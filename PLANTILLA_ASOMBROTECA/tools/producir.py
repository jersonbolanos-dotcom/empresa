#!/usr/bin/env python3
# Producción de un vídeo de la PLANTILLA ASOMBROTECA, paso a paso o de una vez.
# Uso:  python3 PLANTILLA_ASOMBROTECA/tools/producir.py <carpeta_proyecto> <paso> [opciones]
# Pasos:
#   voz       pausas + transcripción Whisper (si hay sherpa-onnx) → 03_GUION/tramos_borrador.txt (y tramos.txt si no existe);
#             guarda la huella md5 de la voz en 07_QC/voz_md5.txt
#   alinear   palabras con tiempo (03_GUION/tramos.txt) → 04_CODIGO/alineacion.json, js/datos.js, 06_SUBTITULOS/subtitulos.srt
#   build     04_CODIGO/index.html (reproductor con voz, música y efectos)
#   prueba    hoja de contacto con los instantes pedidos → 07_QC/prueba.jpg   (p. ej.: prueba 2 8.5 15 30)
#   render    fotogramas + música/efectos + mezcla (sidechain, −14 LUFS, ≤ −1 dBTP) + H.264/AAC → 07_OUTPUT/<NOMBRE>_FINAL.mp4
#   qc        control técnico (formato, decodificación, negros, congelados, silencios, sonoridad, md5 voz, determinismo,
#             hoja de contacto) → 07_QC/qc_tecnico.txt, 07_QC/QC.md, 07_QC/hoja_contacto.jpg
#   todo      build + render + qc          limpiar   borra index.html y temporales
#   variantes (v1.29) con [GANCHO A/B/C] en tramos.txt: render + qc de cada variante → 07_OUTPUT/VARIANTE_A.mp4, _B, _C
#             (QC en 07_QC/QC_A.md…). Sin ganchos hace lo mismo que «todo».
#   portada   (v1.30) portada "TEXTO" "PALABRA_ROJA" "ETIQUETA" [SEGUNDO] → 07_OUTPUT/portada.jpg 1080×1920. Maqueta fija: fotograma
#             NÍTIDO del episodio (sin subtítulos) en el SEGUNDO exacto dado (o --t), texto arriba en dos líneas con borde oscuro,
#             etiqueta amarilla, centrado en x = 540 y dentro del recorte 3:4 (y 240-1680). «/» separa líneas («13 AÑOS / ESPERANDO»).
#             --gancho X (variante del fotograma) · --bajar PX (baja el fotograma para dejar cielo al texto) · --foco X · --bloque
# Opciones: --cola 1.0 (segundos tras la voz) · --workers 6 · --salida NOMBRE.mp4 · --trabajo DIR (temporales; por defecto /tmp)
#           --gancho A|B|C (v1.29: variante para build/prueba/render/qc; con ganchos, por defecto la A) · --t 12.5 (fotograma de la portada)
import argparse, glob, hashlib, json, math, os, re, shutil, subprocess, sys, tempfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = os.path.join(RAIZ, 'tools')
AUDIO_EXT = ('.mp3', '.wav', '.m4a', '.aac', '.flac', '.ogg')


def sh(cmd, cwd=None, check=True, capture=False):
    print('  $', cmd if isinstance(cmd, str) else ' '.join(cmd), flush=True)
    r = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str), text=True, capture_output=capture)
    if check and r.returncode != 0:
        if capture:
            print(r.stdout[-2000:], r.stderr[-2000:])
        sys.exit(f'ERROR en: {cmd}')
    return r


def voz(P):
    fs = sorted(f for f in glob.glob(os.path.join(P, '01_ENTRADA', 'audio', '*')) if f.lower().endswith(AUDIO_EXT))
    if not fs:
        sys.exit('No hay voz en 01_ENTRADA/audio/')
    return fs[0]


def voz_montada(P):
    # v1.28: voz con las pausas de posproducción («[PAUSA x]» en tramos.txt), si las hay
    f = os.path.join(P, '05_AUDIO', 'voz_montada.wav'); al = os.path.join(P, '04_CODIGO', 'alineacion.json')
    try:
        pp = json.load(open(al, encoding='utf-8')).get('pausas_post') if os.path.exists(al) else None
    except Exception:
        pp = None
    return f if pp and os.path.exists(f) else None


def voz_usada(P, a=None):
    G = gancho(P, a) if a else None
    if G:
        return os.path.join(P, '05_AUDIO', f'voz_{G}.wav')   # v1.29: la deja build.py (tramos del original, sin tocar)
    return voz_montada(P) or voz(P)


def ganchos(P):
    f = os.path.join(P, '04_CODIGO', 'alineacion.json')
    try:
        return json.load(open(f, encoding='utf-8')).get('ganchos') or {} if os.path.exists(f) else {}
    except Exception:
        return {}


def gancho(P, a):
    # v1.29: variante activa (None si el proyecto no tiene [GANCHO …])
    gn = ganchos(P); g = (getattr(a, 'gancho', None) or '').upper() or None
    if g and g not in gn:
        sys.exit(f'No hay [GANCHO {g}] en este proyecto' + (f' (hay: {", ".join(sorted(gn))})' if gn else ' (tramos.txt sin ganchos)'))
    return g or (('A' if 'A' in gn else sorted(gn)[0]) if gn else None)


def alin(P, a=None):
    G = gancho(P, a) if a else None
    return os.path.join(P, '04_CODIGO', f'alineacion_{G}.json' if G else 'alineacion.json')


def suf(P, a):
    G = gancho(P, a); return f'_{G}' if G else ''


def md5(f):
    h = hashlib.md5()
    with open(f, 'rb') as fh:
        for b in iter(lambda: fh.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def dur_audio(f):
    return float(sh(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture=True).stdout.strip())


def trabajo(P, a):
    d = a.trabajo or os.path.join(tempfile.gettempdir(), 'plantilla_' + os.path.basename(os.path.abspath(P)))
    os.makedirs(d, exist_ok=True)
    return d


def p_voz(P, a):
    V = voz(P); W = trabajo(P, a); C = os.path.join(P, '04_CODIGO')
    os.makedirs(os.path.join(P, '07_QC'), exist_ok=True)
    open(os.path.join(P, '07_QC', 'voz_md5.txt'), 'w').write(f'{md5(V)}  {os.path.basename(V)}\n')
    sh(['bash', os.path.join(T, 'preparar_voz.sh'), V, W])
    for f in ['sil_major.txt', 'sil_minor.txt', 'duracion.txt']:
        shutil.copy2(os.path.join(W, f), os.path.join(C, f))
    b = os.path.join(W, 'tramos_borrador.txt'); g = os.path.join(P, '03_GUION')
    if os.path.exists(b):
        shutil.copy2(b, os.path.join(g, 'tramos_borrador.txt'))
        t = os.path.join(g, 'tramos.txt')
        vacio = not os.path.exists(t) or not [l for l in open(t, encoding='utf-8') if l.strip() and not l.startswith('#')]
        if vacio:
            shutil.copy2(b, t)
            print('  → 03_GUION/tramos.txt creado desde el borrador: REVÍSALO (nombres propios; cifras «500|quinientos»)')
    # el modelo de Whisper pesa ~400 MB: no se deja en el disco
    for m in glob.glob(os.path.join(W, 'sherpa-onnx-*')):
        shutil.rmtree(m, ignore_errors=True)
    print('Voz preparada. Siguiente: revisar 03_GUION/tramos.txt y ejecutar el paso «alinear».')


def p_alinear(P, a):
    C = os.path.join(P, '04_CODIGO')
    if not os.path.exists(os.path.join(C, 'sil_major.txt')):
        sys.exit('Falta el paso «voz».')
    D = open(os.path.join(C, 'duracion.txt')).read().strip() if os.path.exists(os.path.join(C, 'duracion.txt')) else str(dur_audio(voz(P)))
    sh(['python3', '-I', os.path.join(T, 'alinear.py'), 'sil_major.txt', 'sil_minor.txt', D, 'alineacion.json', '../03_GUION/tramos.txt'], cwd=C)
    os.makedirs(os.path.join(C, 'js'), exist_ok=True); os.makedirs(os.path.join(P, '06_SUBTITULOS'), exist_ok=True)
    sh(['python3', '-I', os.path.join(T, 'subtitulos.py'), 'alineacion.json', '../06_SUBTITULOS/subtitulos.srt', 'js/datos.js'], cwd=C)
    d = json.load(open(os.path.join(C, 'alineacion.json')))
    mont = os.path.join(P, '05_AUDIO', 'voz_montada.wav')
    if d.get('pausas_post'):
        os.makedirs(os.path.dirname(mont), exist_ok=True)
        sh(['python3', '-I', os.path.join(T, 'montar_voz.py'), voz(P), os.path.join(C, 'alineacion.json'), mont])
    elif os.path.exists(mont):
        os.remove(mont)   # ya no hay pausas de posproducción: se usa la voz original
    # v1.29 · una alineación, unos subtítulos y una voz por variante de gancho
    for L in sorted(d.get('ganchos') or {}):
        os.makedirs(os.path.join(P, '05_AUDIO'), exist_ok=True)
        sh(['python3', '-I', os.path.join(T, 'subtitulos.py'), f'alineacion_{L}.json', f'../06_SUBTITULOS/subtitulos_{L}.srt', f'js/datos_{L}.js'], cwd=C)
        sh(['python3', '-I', os.path.join(T, 'montar_voz.py'), voz(P), os.path.join(C, f'alineacion_{L}.json'), os.path.join(P, '05_AUDIO', f'voz_{L}.wav')])
        dv = json.load(open(os.path.join(C, f'alineacion_{L}.json')))
        print(f'  variante {L}: «{dv["segments"][0]["text"]}» + cuerpo → {dv["duration"]:.2f} s')
    print(f'Alineado: {len(d["segments"])} tramos, {len(d["words"])} palabras, voz {d["duration"]:.2f} s' + (f' (con {len(d["pausas_post"])} pausas de posproducción)' if d.get('pausas_post') else ''))


def p_build(P, a):
    C = os.path.join(P, '04_CODIGO')
    if not os.path.exists(os.path.join(C, 'js', 'datos.js')):
        sys.exit('Falta js/datos.js: ejecuta «voz» y «alinear».')
    G = gancho(P, a)
    sh(['python3', '-I', os.path.join(T, 'build.py')] + (['--gancho', G] if G else []), cwd=C)


def duracion(P, a):
    d = json.load(open(alin(P, a)))
    return round(d['duration'] + a.cola, 3)


def p_prueba(P, a):
    p_build(P, a); C = os.path.join(P, '04_CODIGO'); W = tempfile.mkdtemp(prefix='prueba_', dir=trabajo(P, a))
    ts = a.extra or ['1', '5', '10', '20']
    sh(['node', os.path.join(T, 'frames.js'), 'index.html', W] + ts, cwd=C)
    pngs = sorted(glob.glob(os.path.join(W, '*.png')))
    out = os.path.join(P, '07_QC', f'prueba{suf(P, a)}.jpg')
    sh(['python3', '-I', os.path.join(T, 'sheet.py'), out, str(min(6, len(pngs)))] + pngs)
    shutil.rmtree(W, ignore_errors=True)
    print(f'Hoja de prueba: {out}')


def pausas(P, mn=0.4, mx=1.6, a=None):
    f = alin(P, a)
    if not os.path.exists(f):
        return []
    ws = json.load(open(f))['words']
    return [(ws[i - 1]['e'], ws[i]['s']) for i in range(1, len(ws)) if mn <= ws[i]['s'] - ws[i - 1]['e'] <= mx or ws[i].get('pausa')]


def nombre_final(P, a):
    if a.salida:
        return a.salida
    if gancho(P, a):
        return f'VARIANTE_{gancho(P, a)}.mp4'   # v1.29
    n = os.path.basename(os.path.abspath(P)).replace('_PROYECTO', '')
    return n + '_FINAL.mp4'


def p_render(P, a):
    p_build(P, a); C = os.path.join(P, '04_CODIGO'); W = trabajo(P, a); FR = os.path.join(W, 'fotogramas'); AU = os.path.join(W, 'audio')
    shutil.rmtree(FR, ignore_errors=True); shutil.rmtree(AU, ignore_errors=True)
    D = duracion(P, a); N = math.ceil(D * 30 - 1e-6)
    sh(['node', os.path.join(T, 'render.js'), 'index.html', FR, str(a.workers)], cwd=C)
    sh(['node', os.path.join(T, 'audio.js'), 'index.html', AU], cwd=C)
    A5 = os.path.join(P, '05_AUDIO'); os.makedirs(A5, exist_ok=True)
    shutil.copy2(os.path.join(AU, 'music.wav'), os.path.join(A5, 'musica_original.wav'))
    shutil.copy2(os.path.join(AU, 'sfx.wav'), os.path.join(A5, 'efectos_sonido.wav'))
    mez = os.path.join(A5, 'mezcla_final.wav')
    PZ = pausas(P, a=a); duck = ('+'.join(f'between(t,{x - 0.05:.2f},{y + 0.1:.2f})' for x, y in PZ) if PZ else '0')
    # v1.27: durante cada pausa dramática la música baja a ~40 % (la animación casi se para y entra FX.pausa)
    fc = ('[0:a]aresample=48000,aformat=channel_layouts=stereo,apad[v];[v]asplit[v1][v2];'
          f"[1:a]volume=4dB,volume='if({duck},0.4,1)':eval=frame[m];"
          '[m][v2]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[2:a]volume=-1dB[s];'
          f'[v1][md][s]amix=inputs=3:normalize=0,volume=7.4dB,alimiter=limit=0.8:level=false,afade=t=out:st={D - 0.8:.3f}:d=0.8,atrim=0:{D}[o]')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', voz_usada(P, a), '-i', os.path.join(A5, 'musica_original.wav'), '-i', os.path.join(A5, 'efectos_sonido.wav'),
        '-filter_complex', fc, '-map', '[o]', '-ar', '48000', mez])
    # corrección automática de sonoridad a −14 LUFS (solo ganancia; el limitador ya fija el pico)
    # (techo de −2 dBFS de muestra tras la ganancia: deja margen para los picos entre muestras y el AAC → ≤ −1 dBTP)
    for _ in range(2):
        L = sonoridad(mez)
        if not L or (abs(L['I'] + 14) <= 0.5 and (L['TP'] or -9) <= -1.2):
            break
        g = -14 - L['I']; tmp = mez + '.tmp.wav'
        sh(['ffmpeg', '-v', 'error', '-y', '-i', mez, '-af', f'volume={g:.2f}dB,alimiter=limit=0.79:level=false:attack=3:release=60', tmp]); os.replace(tmp, mez)
    O = os.path.join(P, '07_OUTPUT'); os.makedirs(O, exist_ok=True); out = os.path.join(O, nombre_final(P, a))
    enc = lambda crf, extra: sh(['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', os.path.join(FR, 'f_%05d.jpg'), '-i', mez, '-frames:v', str(N), '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf)] + extra +
                                ['-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-t', str(D), out])
    enc(20, [])
    if os.path.getsize(out) > 95e6:
        enc(23, ['-maxrate', '8.5M', '-bufsize', '17M'])
    shutil.rmtree(FR, ignore_errors=True)
    print(f'Vídeo: {out} ({os.path.getsize(out) / 1e6:.1f} MB, {D:.2f} s)')


def sonoridad(f):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'ebur128=peak=true', '-vn', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = r[r.rfind('Summary:'):]
    i = re.search(r'I:\s+(-?[\d.]+) LUFS', s); pk = re.search(r'Peak:\s+(-?[\d.]+) dBFS', s)
    return {'I': float(i.group(1)), 'TP': float(pk.group(1)) if pk else None} if i else None


def p_qc(P, a):
    O = os.path.join(P, '07_OUTPUT'); Q = os.path.join(P, '07_QC'); os.makedirs(Q, exist_ok=True); G = gancho(P, a); sf = suf(P, a)
    out = os.path.join(O, nombre_final(P, a))
    if G and not os.path.exists(out):
        sys.exit(f'No existe {out}: ejecuta «render --gancho {G}» o «variantes».')
    if not os.path.exists(out):
        mp4 = sorted(glob.glob(os.path.join(O, '*.mp4')))
        if not mp4:
            sys.exit('No hay vídeo en 07_OUTPUT/: ejecuta «render».')
        out = mp4[-1]
    info = json.loads(sh(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,sample_rate,channels,nb_frames:format=duration,size', '-of', 'json', out], capture=True).stdout)
    vs = [s for s in info['streams'] if s.get('width')][0]; au = [s for s in info['streams'] if s.get('sample_rate')]
    dur = float(info['format']['duration']); size = int(info['format']['size'])
    err = subprocess.run(['ffmpeg', '-v', 'error', '-i', out, '-f', 'null', '-'], capture_output=True, text=True).stderr.strip().splitlines()
    log = lambda vf, af=None: subprocess.run(['ffmpeg', '-hide_banner', '-i', out] + (['-vf', vf, '-an'] if vf else ['-af', af, '-vn']) + ['-f', 'null', '-'], capture_output=True, text=True).stderr
    negros = len(re.findall('black_start', log('blackdetect=d=0.3:pix_th=0.08'))); cong = len(re.findall('freeze_start', log('freezedetect=n=0.002:d=1.5')))
    sil = re.findall(r'silence_start: ([\d.]+)', log(None, 'silencedetect=n=-50dB:d=1')); L = sonoridad(out)
    vm = None; ref = os.path.join(Q, 'voz_md5.txt')
    if os.path.exists(ref):
        vm = md5(voz(P)) == open(ref).read().split()[0]
    # v1.28: con pausas de posproducción, además, cada tramo de la voz montada debe ser idéntico (md5 de muestras) al original
    vt = None; C = os.path.join(P, '04_CODIGO')
    if G:   # v1.29: cada tramo de la variante (gancho + cuerpo) idéntico al original
        sys.path.insert(0, T); import montar_voz
        vt = montar_voz.tramos_identicos_variante(voz(P), voz_usada(P, a), alin(P, a))
    elif voz_montada(P) and os.path.exists(os.path.join(C, 'alineacion.json')):
        sys.path.insert(0, T); import montar_voz
        vt = montar_voz.tramos_identicos(voz(P), voz_montada(P), os.path.join(C, 'alineacion.json'))
    det = None
    if os.path.exists(os.path.join(C, 'index.html')):
        r = subprocess.run(['node', os.path.join(T, 'determinismo.js'), 'index.html'], cwd=C, capture_output=True, text=True); det = 'DETERMINISMO OK' in r.stdout
    sh(['ffmpeg', '-v', 'error', '-y', '-i', out, '-vf', f'fps=1/{max(1.0, dur / 20):.3f},scale=216:384,tile=10x2', '-frames:v', '1', os.path.join(Q, f'hoja_contacto{sf}.jpg')])
    # v1.27 · zona segura de Instagram, etiquetas a la vez, título fijo
    zs = None
    if os.path.exists(os.path.join(C, 'index.html')):
        r = subprocess.run(['node', os.path.join(T, 'zona_segura.js'), 'index.html'], cwd=C, capture_output=True, text=True)
        try:
            zs = json.loads(r.stdout.strip().splitlines()[-1])
        except Exception:
            zs = None
    # v1.27 · gancho, cierre y pausas (desde la alineación)
    al = alin(P, a); gch = cierre = None; npz = len(pausas(P, a=a))
    if os.path.exists(al):
        ws = json.load(open(al))['words']; txt0 = ' '.join(w['w'] for w in ws[:6]).lower(); ult = ' '.join(w['w'] for w in ws if w['seg'] == ws[-1]['seg']).lower(); todo = ' '.join(w['w'] for w in ws).lower()
        gch = not re.match(r'^[¡¿]?\s*(imagina|en el año|en \d{3,4}|antes de|hace mucho|había una vez|hace \d+ años)', txt0)
        cierre = bool(re.search(r'env[ií]a', ult)) and not re.search(r'\b(sigue a|s[ií]guenos|s[ií]gueme)\b', todo)
    # v1.27 · ninguna etiqueta de interpretación ([short pause]…) ni <break/> en los subtítulos
    etq = None; dj = os.path.join(C, 'js', f'datos{sf}.js')
    if os.path.exists(dj):
        etq = sorted(set(re.findall(r'\[[^\]"]*\]|<[^>"]*>', open(dj, encoding='utf-8').read())))
    # v1.27 · movimiento desde el fotograma 0 (ni negro ni quieto)
    def gris(tt):
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(tt), '-i', out, '-frames:v', '1', '-vf', 'scale=108:192,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
        return list(raw)
    g0, g1 = gris(0), gris(0.5); mov = None
    if g0 and g1 and len(g0) == len(g1):
        lum = sum(g0) / len(g0); dif = sum(abs(x - y) for x, y in zip(g0, g1)) / len(g0); mov = lum > 12 and dif > 1.0
    # v1.29 · sonido de punta a punta: silencio (−50 dB) al principio ≤ 0,5 s y al final ≤ 1 s
    s_ini, s_fin = silencios_borde(out, dur)
    enc = None if zs is None else zs.get('encimados'); ll = None if zs is None else zs.get('llena')
    ok = lambda c: '✔' if c else '✘'
    filas = [
        ('Formato', f'{vs["codec_name"]} {vs["width"]}×{vs["height"]} {vs["r_frame_rate"]} · {au[0]["codec_name"] + " " + au[0]["sample_rate"] + " Hz" if au else "SIN AUDIO"}', vs['width'] == 1080 and vs['height'] == 1920 and vs['r_frame_rate'] == '30/1' and bool(au)),
        ('Duración / tamaño', f'{dur:.2f} s · {size / 1e6:.1f} MB', size < 100e6),
        ('Decodificación completa', f'{len(err)} errores', not err),
        ('Negros > 0,3 s / congelados > 1,5 s', f'{negros} / {cong}', negros == 0 and cong == 0),
        ('Silencios > 1 s (−50 dB)', f'{len(sil)}', not sil),
        ('Sonoridad', f'{L["I"]:.1f} LUFS · pico {L["TP"]:.1f} dBTP' if L else '—', bool(L) and abs(L['I'] + 14) <= 1 and (L['TP'] or 0) <= -1),
        ('Voz intacta (md5 por tramo)', ('original ' + ('igual' if vm else 'DISTINTO' if vm is False else 'sin referencia')) + (f' · {vt[0]}/{vt[1]} tramos idénticos en la voz montada' if vt else ''), vm is not False and (vt is None or vt[0] == vt[1])),
        ('Determinismo', 'OK' if det else ('FALLO' if det is False else 'sin index.html'), det is not False),
        ('Duración (objetivo 45-70 s)', f'{dur:.1f} s' + (' · AVISO: más de 75 s' if 75 < dur <= 90 else ' · AVISO: menos de 45 s' if dur < 45 else ''), dur <= 90),
        ('Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940)', ('sin datos' if zs is None else (f'{len(zs["fuera"])} textos fuera' + (': ' + ', '.join(f'{f["tipo"]} t={f["t"]} {f["motivo"]}' for f in zs['fuera'][:6]) if zs['fuera'] else ''))), zs is not None and not zs['fuera']),
        ('Pantalla limpia (≤ 2 etiquetas a la vez, sin título fijo)', 'sin datos' if zs is None else f'máx. {zs["maxEtiquetas"]} etiquetas · {"con" if zs["titulos"] else "sin"} título', zs is not None and zs['maxEtiquetas'] <= 2 and not zs['titulos']),
        ('Pausas dramáticas (0,4-1,6 s; objetivo 3-4)', f'{npz}' + ('' if 3 <= npz <= 6 else ' · AVISO: fuera del objetivo'), True),
        ('Silencio inicial ≤ 0,5 s / final ≤ 1 s (−50 dB)', f'{s_ini:.2f} s / {s_fin:.2f} s', s_ini <= 0.5 and s_fin <= 1.0),
        ('Nada encimado (dos textos o contadores en la misma zona)', 'sin datos' if enc is None else (f'{len(enc)} encimados' + (': ' + ', '.join(f'{e["a"]}+{e["b"]} t={e["t"]}' for e in enc[:6]) if enc else '')), enc is not None and not enc),
        ('Pantalla llena (contenido ≥ 60 % del ancho seguro; aviso si < 60 % más de 3 s)', 'sin datos' if not ll else (f'mínimo {ll["minimo"]} %' + (' · AVISO en ' + ', '.join(f'{x0}-{x1} s ({pc} %)' for x0, x1, pc in ll['avisos'][:5]) if ll['avisos'] else ' · correcto')), True),
        ('Gancho sin frase de contexto' + (f' (variante {G})' if G else ''), 'sin alineación' if gch is None else ('correcto' if gch else 'EMPIEZA CON CONTEXTO (Imagina / En el año / Antes de…)'), gch is not False),
        ('Cierre «Envíaselo a ese amigo…» (sin «Sigue a…»)', 'sin alineación' if cierre is None else ('correcto' if cierre else 'FALTA o hay «Sigue a…»'), cierre is not False),
        ('Subtítulos sin etiquetas [ ] ni < >', 'sin datos' if etq is None else ('limpios' if not etq else 'ETIQUETAS: ' + ', '.join(etq[:5])), etq is None or not etq),
        ('Movimiento desde el fotograma 0', 'sin datos' if mov is None else ('sí' if mov else 'NEGRO o QUIETO al empezar'), mov is not False),
    ]
    txt = '\n'.join(f'{k}: {v} {ok(c)}' for k, v, c in filas)
    open(os.path.join(Q, f'qc_tecnico{sf}.txt'), 'w').write(f'Archivo: {out}\n{txt}\n')
    md = [f'# QC · {os.path.basename(out)}', '', '| Control | Resultado | |', '|---|---|---|'] + [f'| {k} | {v} | {ok(c)} |' for k, v, c in filas]
    md += ['', f'Pausas cortas: los silencios de 0,4-1,6 s no cuentan como error (el control de silencios solo falla a partir de 1 s por debajo de −50 dB, y la música sigue sonando, más baja).', f'Hoja de contacto: `hoja_contacto{sf}.jpg`. Revisión visual (rellenar): textos legibles, nada flota, datos con fuente en FUENTES_Y_DECISIONES.md.']
    open(os.path.join(Q, f'QC{sf}.md'), 'w').write('\n'.join(md) + '\n')
    print(txt)
    bien = all(c for _, _, c in filas)
    print('QC' + (f' variante {G}' if G else '') + ': ' + ('TODO CORRECTO' if bien else 'HAY PUNTOS A REVISAR'))
    return bien


def silencios_borde(out, dur):
    # v1.29: segundos de silencio (< −50 dB) pegados al principio y al final del vídeo
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', out, '-af', 'silencedetect=n=-50dB:d=0.05', '-vn', '-f', 'null', '-'], capture_output=True, text=True).stderr
    ev = re.findall(r'silence_(start|end): (-?[\d.]+)', r); ini = fin = 0.0; abierto = None
    for k, v in ev:
        v = float(v)
        if k == 'start':
            abierto = v
        else:
            if abierto is not None and abierto <= 0.02:
                ini = v
            if v >= dur - 0.05 and abierto is not None:
                fin = dur - abierto
            abierto = None
    if abierto is not None:
        fin = max(fin, dur - abierto)
        if abierto <= 0.02:
            ini = dur
    return ini, fin


def p_variantes(P, a):
    gn = ganchos(P)
    if not gn:
        print('Este proyecto no tiene [GANCHO …] en tramos.txt: se produce un solo vídeo (como «todo»).')
        p_render(P, a); p_qc(P, a); return
    res = {}
    for L in sorted(gn):
        print(f'==== variante {L}'); a.gancho = L; a.salida = None
        p_render(P, a); res[L] = p_qc(P, a)
    a.gancho = None
    print('Variantes: ' + ' · '.join(f'VARIANTE_{L}.mp4 {"TODO CORRECTO" if ok else "HAY PUNTOS A REVISAR (07_QC/QC_" + L + ".md)"}' for L, ok in res.items()))


def p_portada(P, a):
    # v1.31: en un proyecto de serie (SERIE.json), la etiqueta es SIEMPRE la de la serie y no se pasa
    sj = os.path.join(P, 'SERIE.json'); serie = json.load(open(sj, encoding='utf-8')) if os.path.exists(sj) else None
    if serie:
        a.extra = a.extra[:2] + [serie['portada']['etiqueta']] + a.extra[2:]
        a.bloque = serie['portada'].get('bloque', a.bloque)
    if len(a.extra) < 3:
        sys.exit('Uso: producir.py PROYECTO portada "TEXTO" "PALABRA_ROJA" "ETIQUETA" [SEGUNDO]   (en una serie: "TEXTO" "PALABRA_ROJA" [SEGUNDO])')
    texto, roja, etq = a.extra[:3]; ws = texto.replace('/', ' ').split()
    if len(a.extra) >= 4:   # v1.30: segundo exacto del fotograma de fondo como 4.º argumento
        try:
            a.t = float(a.extra[3].replace(',', '.'))
        except ValueError:
            sys.exit(f'El 4.º argumento de «portada» es el segundo del fotograma (p. ej. 2.4), no «{a.extra[3]}».')
    norm = lambda s: re.sub(r'[^0-9a-zñ]', '', s.lower().translate(str.maketrans('áéíóúü', 'aeiouu')))
    if not 2 <= len(ws) <= (8 if serie else 4):
        sys.exit(f'La portada lleva de 2 a 4 palabras gigantes (en una serie, la pregunta en 2 líneas, hasta 8) (hay {len(ws)}).')
    if sum(norm(w) == norm(roja) for w in ws) != 1:
        sys.exit(f'«{roja}» debe ser UNA de las palabras de «{texto}».')
    O = os.path.join(P, '07_OUTPUT'); mp4 = [os.path.join(O, nombre_final(P, a))] + sorted(glob.glob(os.path.join(O, '*.mp4')))
    mp4 = next((f for f in mp4 if os.path.exists(f)), None)
    if not mp4 and a.t is None:
        sys.exit('Sin vídeo en 07_OUTPUT/ hay que indicar el instante del fondo con --t (p. ej. --t 12.5).')
    t = a.t if a.t is not None else round(dur_audio(mp4) * 0.4, 2); W = trabajo(P, a); f = os.path.join(W, 'fondo_portada.jpg')
    # el fondo se dibuja desde el episodio SIN subtítulos (el MP4 los lleva quemados); si no se puede, se toma del MP4
    C = os.path.join(P, '04_CODIGO'); FD = tempfile.mkdtemp(prefix='portada_', dir=W)
    try:
        p_build(P, a)
        subprocess.run(['node', os.path.join(T, 'frames.js'), 'index.html', FD, str(t)], cwd=C, check=True, capture_output=True, env={**os.environ, 'SIN_SUBTITULOS': '1'})
        png = glob.glob(os.path.join(FD, '*.png'))[0]
        sh(['ffmpeg', '-v', 'error', '-y', '-i', png, '-q:v', '2', f])
    except Exception:
        if not mp4:
            sys.exit('No se pudo dibujar el fondo desde el episodio y no hay MP4.')
        print('  (fondo tomado del MP4, con subtítulos)')
        sh(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', mp4, '-frames:v', '1', '-q:v', '2', f])
    shutil.rmtree(FD, ignore_errors=True)
    marca = 'ASOMBROTECA'
    try:
        m = re.search(r"marca\s*:\s*'([^']+)'", open(os.path.join(P, '04_CODIGO', 'js', 'episodio.js'), encoding='utf-8').read()); marca = m.group(1) if m else marca
    except Exception:
        pass
    out = os.path.join(O, 'portada.jpg')
    pr = (serie or {}).get('portada', {})
    sh(['node', os.path.join(T, 'portada.js'), f, out, texto, roja, etq, marca, str(a.foco), a.bloque, str(a.bajar), pr.get('roja', 'linea'), pr.get('tam', 'desigual')])
    print(f'Portada: {out} (fondo: episodio{" variante " + gancho(P, a) if gancho(P, a) else ""} en t = {t} s)')


def p_limpiar(P, a):
    f = os.path.join(P, '04_CODIGO', 'index.html')
    if os.path.exists(f):
        os.remove(f)
    shutil.rmtree(trabajo(P, a), ignore_errors=True)
    print('Temporales borrados.')


def main():
    ap = argparse.ArgumentParser(description='Produce un vídeo de la plantilla.')
    ap.add_argument('proyecto'); ap.add_argument('paso', choices=['voz', 'alinear', 'build', 'prueba', 'render', 'qc', 'todo', 'variantes', 'portada', 'limpiar'])
    ap.add_argument('extra', nargs='*', help='instantes (s) para «prueba»')
    ap.add_argument('--cola', type=float, default=1.0); ap.add_argument('--workers', type=int, default=6)
    ap.add_argument('--salida', default=None); ap.add_argument('--trabajo', default=None)
    ap.add_argument('--gancho', default=None, help='variante A, B o C (v1.29)'); ap.add_argument('--t', type=float, default=None, help='instante del fondo de la portada')
    ap.add_argument('--foco', type=float, default=540, help='portada: x del fotograma que queda centrada'); ap.add_argument('--bloque', default='arriba', choices=['arriba', 'centro', 'abajo'], help='portada: posición del texto (arriba = maqueta v1.30)')
    ap.add_argument('--bajar', type=int, default=0, help='portada: px que se baja el fotograma para dejar cielo al texto')
    a = ap.parse_args(); P = os.path.abspath(a.proyecto)
    if not os.path.isdir(os.path.join(P, '04_CODIGO')):
        sys.exit(f'No parece un proyecto (falta 04_CODIGO): {P}')
    pasos = {'voz': [p_voz], 'alinear': [p_alinear], 'build': [p_build], 'prueba': [p_prueba], 'render': [p_render], 'qc': [p_qc], 'todo': [p_render, p_qc], 'variantes': [p_variantes], 'portada': [p_portada], 'limpiar': [p_limpiar]}
    for f in pasos[a.paso]:
        print(f'== {f.__name__[2:]}')
        f(P, a)


if __name__ == '__main__':
    main()
