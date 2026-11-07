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
# Opciones: --cola 1.0 (segundos tras la voz) · --workers 6 · --salida NOMBRE.mp4 · --trabajo DIR (temporales; por defecto /tmp)
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
    os.makedirs(os.path.join(C, 'js'), exist_ok=True)
    sh(['python3', '-I', os.path.join(T, 'subtitulos.py'), 'alineacion.json', '../06_SUBTITULOS/subtitulos.srt', 'js/datos.js'], cwd=C)
    d = json.load(open(os.path.join(C, 'alineacion.json')))
    print(f'Alineado: {len(d["segments"])} tramos, {len(d["words"])} palabras, voz {d["duration"]:.2f} s')


def p_build(P, a):
    C = os.path.join(P, '04_CODIGO')
    if not os.path.exists(os.path.join(C, 'js', 'datos.js')):
        sys.exit('Falta js/datos.js: ejecuta «voz» y «alinear».')
    sh(['python3', '-I', os.path.join(T, 'build.py')], cwd=C)


def duracion(P, a):
    d = json.load(open(os.path.join(P, '04_CODIGO', 'alineacion.json')))
    return round(d['duration'] + a.cola, 3)


def p_prueba(P, a):
    p_build(P, a); C = os.path.join(P, '04_CODIGO'); W = tempfile.mkdtemp(prefix='prueba_', dir=trabajo(P, a))
    ts = a.extra or ['1', '5', '10', '20']
    sh(['node', os.path.join(T, 'frames.js'), 'index.html', W] + ts, cwd=C)
    pngs = sorted(glob.glob(os.path.join(W, '*.png')))
    out = os.path.join(P, '07_QC', 'prueba.jpg')
    sh(['python3', '-I', os.path.join(T, 'sheet.py'), out, str(min(6, len(pngs)))] + pngs)
    shutil.rmtree(W, ignore_errors=True)
    print(f'Hoja de prueba: {out}')


def nombre_final(P, a):
    if a.salida:
        return a.salida
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
    fc = ('[0:a]aresample=48000,aformat=channel_layouts=stereo,apad[v];[v]asplit[v1][v2];[1:a]volume=4dB[m];'
          '[m][v2]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[2:a]volume=-1dB[s];'
          f'[v1][md][s]amix=inputs=3:normalize=0,volume=7.4dB,alimiter=limit=0.8:level=false,afade=t=out:st={D - 0.8:.3f}:d=0.8,atrim=0:{D}[o]')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', voz(P), '-i', os.path.join(A5, 'musica_original.wav'), '-i', os.path.join(A5, 'efectos_sonido.wav'),
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
    O = os.path.join(P, '07_OUTPUT'); Q = os.path.join(P, '07_QC'); os.makedirs(Q, exist_ok=True)
    out = os.path.join(O, nombre_final(P, a))
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
    det = None; C = os.path.join(P, '04_CODIGO')
    if os.path.exists(os.path.join(C, 'index.html')):
        r = subprocess.run(['node', os.path.join(T, 'determinismo.js'), 'index.html'], cwd=C, capture_output=True, text=True); det = 'DETERMINISMO OK' in r.stdout
    sh(['ffmpeg', '-v', 'error', '-y', '-i', out, '-vf', f'fps=1/{max(1.0, dur / 20):.3f},scale=216:384,tile=10x2', '-frames:v', '1', os.path.join(Q, 'hoja_contacto.jpg')])
    ok = lambda c: '✔' if c else '✘'
    filas = [
        ('Formato', f'{vs["codec_name"]} {vs["width"]}×{vs["height"]} {vs["r_frame_rate"]} · {au[0]["codec_name"] + " " + au[0]["sample_rate"] + " Hz" if au else "SIN AUDIO"}', vs['width'] == 1080 and vs['height'] == 1920 and vs['r_frame_rate'] == '30/1' and bool(au)),
        ('Duración / tamaño', f'{dur:.2f} s · {size / 1e6:.1f} MB', size < 100e6),
        ('Decodificación completa', f'{len(err)} errores', not err),
        ('Negros > 0,3 s / congelados > 1,5 s', f'{negros} / {cong}', negros == 0 and cong == 0),
        ('Silencios > 1 s (−50 dB)', f'{len(sil)}', not sil),
        ('Sonoridad', f'{L["I"]:.1f} LUFS · pico {L["TP"]:.1f} dBTP' if L else '—', bool(L) and abs(L['I'] + 14) <= 1 and (L['TP'] or 0) <= -1),
        ('Voz intacta (md5)', 'igual al original' if vm else ('DISTINTA' if vm is False else 'sin referencia (paso «voz»)'), vm is not False),
        ('Determinismo', 'OK' if det else ('FALLO' if det is False else 'sin index.html'), det is not False),
    ]
    txt = '\n'.join(f'{k}: {v} {ok(c)}' for k, v, c in filas)
    open(os.path.join(Q, 'qc_tecnico.txt'), 'w').write(f'Archivo: {out}\n{txt}\n')
    md = [f'# QC · {os.path.basename(out)}', '', '| Control | Resultado | |', '|---|---|---|'] + [f'| {k} | {v} | {ok(c)} |' for k, v, c in filas]
    md += ['', 'Hoja de contacto: `hoja_contacto.jpg`. Revisión visual (rellenar): textos legibles, nada flota, rótulos fuera de la franja de subtítulos, datos con fuente en FUENTES_Y_DECISIONES.md.']
    open(os.path.join(Q, 'QC.md'), 'w').write('\n'.join(md) + '\n')
    print(txt)
    print('QC: ' + ('TODO CORRECTO' if all(c for _, _, c in filas) else 'HAY PUNTOS A REVISAR'))


def p_limpiar(P, a):
    f = os.path.join(P, '04_CODIGO', 'index.html')
    if os.path.exists(f):
        os.remove(f)
    shutil.rmtree(trabajo(P, a), ignore_errors=True)
    print('Temporales borrados.')


def main():
    ap = argparse.ArgumentParser(description='Produce un vídeo de la plantilla.')
    ap.add_argument('proyecto'); ap.add_argument('paso', choices=['voz', 'alinear', 'build', 'prueba', 'render', 'qc', 'todo', 'limpiar'])
    ap.add_argument('extra', nargs='*', help='instantes (s) para «prueba»')
    ap.add_argument('--cola', type=float, default=1.0); ap.add_argument('--workers', type=int, default=6)
    ap.add_argument('--salida', default=None); ap.add_argument('--trabajo', default=None)
    a = ap.parse_args(); P = os.path.abspath(a.proyecto)
    if not os.path.isdir(os.path.join(P, '04_CODIGO')):
        sys.exit(f'No parece un proyecto (falta 04_CODIGO): {P}')
    pasos = {'voz': [p_voz], 'alinear': [p_alinear], 'build': [p_build], 'prueba': [p_prueba], 'render': [p_render], 'qc': [p_qc], 'todo': [p_render, p_qc], 'limpiar': [p_limpiar]}
    for f in pasos[a.paso]:
        print(f'== {f.__name__[2:]}')
        f(P, a)


if __name__ == '__main__':
    main()
