#!/usr/bin/env python3
# Producción de un reel SIN VOZ de SIMULACIÓN (Plantilla Asombroteca SIN_VOZ 2.0), paso a paso o de una vez.
# Uso:  python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/producir_reel.py <carpeta_reel> <paso> [opciones]
# Pasos:
#   tiempos   03_GUION/tiempos.txt → 04_CODIGO/js/tiempos.js + tiempos.json (pregunta ≤ 6 palabras, frase, fuente, 25-45 s)
#   build     tiempos + 04_CODIGO/index.html (reproductor; la simulación se precalcula al cargar)
#   prueba    hoja de contacto con los instantes pedidos → 07_QC/prueba.jpg   (p. ej.: prueba 0 2 5.5 9 14)
#   render    fotogramas + sonido de los eventos + música (opcional) + mezcla (−14 LUFS, ≤ −1 dBTP) + H.264/AAC → 07_OUTPUT/<NOMBRE>_FINAL.mp4
#   qc        control del reel (una escena, movimiento, fondo oscuro, texto mínimo, sonido = eventos, marca, bucle…) → 07_QC/qc_tecnico.txt, 07_QC/QC.md, 07_QC/hoja_contacto.jpg
#   todo      build + render + qc          limpiar   borra index.html y temporales
# Opciones: --workers 6 · --salida NOMBRE.mp4 · --trabajo DIR (temporales; por defecto /tmp) · --musica-db -10 (música «muy baja»: −20 LUFS + este valor antes de normalizar)
import argparse, glob, json, os, re, shutil, subprocess, sys, tempfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = os.path.join(RAIZ, 'tools')


def sh(cmd, cwd=None, check=True, capture=False):
    print('  $', cmd if isinstance(cmd, str) else ' '.join(cmd), flush=True)
    r = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str), text=True, capture_output=capture)
    if check and r.returncode != 0:
        if capture:
            print(r.stdout[-2000:], r.stderr[-2000:])
        sys.exit(f'ERROR en: {cmd}')
    return r


def trabajo(P, a):
    d = a.trabajo or os.path.join(tempfile.gettempdir(), 'reel_' + os.path.basename(os.path.abspath(P)))
    os.makedirs(d, exist_ok=True)
    return d


def C(P):
    return os.path.join(P, '04_CODIGO')


def leer_tiempos(P):
    return json.load(open(os.path.join(C(P), 'tiempos.json'), encoding='utf-8'))


def p_tiempos(P, a):
    os.makedirs(os.path.join(C(P), 'js'), exist_ok=True)
    sh(['python3', '-I', os.path.join(T, 'tiempos.py'), '../03_GUION/tiempos.txt', 'js/tiempos.js', 'tiempos.json'], cwd=C(P))


def p_build(P, a):
    p_tiempos(P, a)
    sh(['python3', '-I', os.path.join(T, 'build.py')], cwd=C(P))


def p_prueba(P, a):
    p_build(P, a); W = tempfile.mkdtemp(prefix='prueba_', dir=trabajo(P, a))
    ts = a.extra or ['0', '2', '5', '10', '15']
    sh(['node', os.path.join(T, 'frames.js'), 'index.html', W] + ts, cwd=C(P))
    pngs = sorted(glob.glob(os.path.join(W, '*.png')))
    out = os.path.join(P, '07_QC', 'prueba.jpg'); os.makedirs(os.path.dirname(out), exist_ok=True)
    sh(['python3', '-I', os.path.join(T, 'sheet.py'), out, str(min(6, len(pngs)))] + pngs)
    shutil.rmtree(W, ignore_errors=True)
    print(f'Hoja de prueba: {out}')


def nombre_final(P, a):
    if a.salida:
        return a.salida
    return os.path.basename(os.path.abspath(P)).replace('_REEL', '') + '_FINAL.mp4'


def sonoridad(f):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'ebur128=peak=true', '-vn', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = r[r.rfind('Summary:'):]
    i = re.search(r'I:\s+(-?[\d.]+) LUFS', s); pk = re.search(r'Peak:\s+(-?[\d.]+) dBFS', s)
    return {'I': float(i.group(1)), 'TP': float(pk.group(1)) if pk else None} if i else None


def p_render(P, a):
    p_build(P, a); W = trabajo(P, a); FR = os.path.join(W, 'fotogramas'); AU = os.path.join(W, 'audio')
    shutil.rmtree(FR, ignore_errors=True); shutil.rmtree(AU, ignore_errors=True)
    D = leer_tiempos(P)['duracion']; N = round(D * 30)
    sh(['node', os.path.join(T, 'render.js'), 'index.html', FR, str(a.workers)], cwd=C(P))
    sh(['node', os.path.join(T, 'audio.js'), 'index.html', AU], cwd=C(P))
    A5 = os.path.join(P, '05_AUDIO'); os.makedirs(A5, exist_ok=True)
    shutil.copy2(os.path.join(AU, 'music.wav'), os.path.join(A5, 'musica_original.wav'))
    shutil.copy2(os.path.join(AU, 'sfx.wav'), os.path.join(A5, 'efectos_sonido.wav'))
    mez = os.path.join(A5, 'mezcla_final.wav'); mus_wav = os.path.join(A5, 'musica_original.wav'); sfx_wav = os.path.join(A5, 'efectos_sonido.wav')
    # sin voz: la música se lleva a un nivel fijo (−20 LUFS + --musica-db) y los efectos se comprimen un poco (los clics tienen
    # picos muy altos); después loudnorm en dos pasadas fija −14 LUFS con pico verdadero ≤ −1,5 dBTP. Fundidos mínimos para el bucle.
    Lm = sonoridad(mus_wav); gm = (-20 + a.musica_db - Lm['I']) if Lm and Lm['I'] > -70 else -60
    pre = (f'[0:a]aresample=48000,aformat=channel_layouts=stereo,volume={gm:.2f}dB[m];'
           '[1:a]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=0.06:ratio=4:attack=1:release=120:makeup=2[s];'
           f'[m][s]amix=inputs=2:normalize=0,afade=t=in:st=0:d=0.01,afade=t=out:st={D - 0.12:.3f}:d=0.12,atrim=0:{D}')
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', mus_wav, '-i', sfx_wav, '-filter_complex', pre + ',loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json[o]', '-map', '[o]', '-f', 'null', '-'], capture_output=True, text=True).stderr
    j = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
    ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    sh(['ffmpeg', '-v', 'error', '-y', '-i', mus_wav, '-i', sfx_wav, '-filter_complex', pre + ',' + ln + ',aresample=48000[o]', '-map', '[o]', '-ar', '48000', '-c:a', 'pcm_f32le', mez])
    for _ in range(2):   # corrección fina si hiciera falta (ganancia + limitador)
        L = sonoridad(mez)
        if not L or (abs(L['I'] + 14) <= 0.5 and (L['TP'] or -9) <= -1.5):
            break
        g = -14 - L['I']; tmp = mez + '.tmp.wav'
        sh(['ffmpeg', '-v', 'error', '-y', '-i', mez, '-af', f'volume={g:.2f}dB,alimiter=limit=0.75:level=false:attack=1:release=50', '-c:a', 'pcm_f32le', tmp]); os.replace(tmp, mez)
    O = os.path.join(P, '07_OUTPUT'); os.makedirs(O, exist_ok=True); out = os.path.join(O, nombre_final(P, a))
    enc = lambda crf, extra: sh(['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', os.path.join(FR, 'f_%05d.jpg'), '-i', mez, '-frames:v', str(N), '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf)] + extra +
                                ['-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-t', str(D), out])
    enc(20, [])
    if os.path.getsize(out) > 95e6:
        enc(23, ['-maxrate', '8.5M', '-bufsize', '17M'])
    shutil.rmtree(FR, ignore_errors=True)
    print(f'Vídeo: {out} ({os.path.getsize(out) / 1e6:.1f} MB, {D:.2f} s)')


def leer_wav(f):
    import numpy as np
    # WAV float32 (formato 3) escrito por audio.js: se lee a mano
    b = open(f, 'rb').read(); i = 12; sr = 48000; ch = 2; data = None
    while i < len(b) - 8:
        cid = b[i:i + 4]; sz = int.from_bytes(b[i + 4:i + 8], 'little')
        if cid == b'fmt ':
            ch = int.from_bytes(b[i + 10:i + 12], 'little'); sr = int.from_bytes(b[i + 12:i + 16], 'little')
        if cid == b'data':
            data = np.frombuffer(b[i + 8:i + 8 + sz], dtype='<f4'); break
        i += 8 + sz + (sz & 1)
    return np.abs(data.reshape(-1, ch)).max(axis=1), sr


def onsets(f):
    # arranques de sonido en la pista de efectos: subidas de nivel de la envolvente (ventanas de 5 ms)
    import numpy as np
    env, sr = leer_wav(f); w = int(0.005 * sr); n = len(env) // w
    e = env[:n * w].reshape(n, w).max(axis=1); out = []; last = -1
    for i in range(6, n):
        base = e[i - 6:i - 1].max()
        if e[i] >= 0.004 and e[i] > 1.8 * base + 1e-4 and i - last > 4:
            out.append(i * w / sr); last = i
    return out


def sincro(P, eventos):
    # cada arranque de sonido debe coincidir (±25 ms) con un evento de la simulación: el sonido SALE de la simulación
    f = os.path.join(P, '05_AUDIO', 'efectos_sonido.wav')
    if not os.path.exists(f) or not eventos:
        return None
    import bisect
    ev = sorted(eventos); ons = onsets(f); ok = 0
    for t in ons:
        i = bisect.bisect_left(ev, t - 0.025)
        if i < len(ev) and ev[i] <= t + 0.01:
            ok += 1
    return ok, len(ons), len(ev)


def gris(out, tt=None, frame=None):
    args = ['ffmpeg', '-v', 'error'] + (['-ss', str(tt)] if tt is not None else []) + ['-i', out]
    if frame is not None:
        args += ['-vf', f'select=eq(n\\,{frame}),scale=108:192,format=gray', '-vsync', '0']
    else:
        args += ['-vf', 'scale=108:192,format=gray']
    raw = subprocess.run(args + ['-frames:v', '1', '-f', 'rawvideo', '-'], capture_output=True).stdout
    return list(raw)


def grises(out, fps):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', out, '-vf', f'fps={fps},scale=108:192,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    n = 108 * 192
    return [raw[i:i + n] for i in range(0, len(raw) - n + 1, n)]


def p_qc(P, a):
    O = os.path.join(P, '07_OUTPUT'); Q = os.path.join(P, '07_QC'); os.makedirs(Q, exist_ok=True)
    out = os.path.join(O, nombre_final(P, a))
    if not os.path.exists(out):
        mp4 = sorted(glob.glob(os.path.join(O, '*.mp4')))
        if not mp4:
            sys.exit('No hay vídeo en 07_OUTPUT/: ejecuta «render».')
        out = mp4[-1]
    if not os.path.exists(os.path.join(C(P), 'index.html')):
        p_build(P, a)
    import numpy as np
    info = json.loads(sh(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,sample_rate,channels,nb_frames:format=duration,size', '-of', 'json', out], capture=True).stdout)
    vs = [s for s in info['streams'] if s.get('width')][0]; au = [s for s in info['streams'] if s.get('sample_rate')]
    dur = float(info['format']['duration']); size = int(info['format']['size']); nfr = int(vs.get('nb_frames') or round(dur * 30))
    err = subprocess.run(['ffmpeg', '-v', 'error', '-i', out, '-f', 'null', '-'], capture_output=True, text=True).stderr.strip().splitlines()
    log = lambda vf, af=None: subprocess.run(['ffmpeg', '-hide_banner', '-i', out] + (['-vf', vf, '-an'] if vf else ['-af', af, '-vn']) + ['-f', 'null', '-'], capture_output=True, text=True).stderr
    negros = len(re.findall('black_start', log('blackdetect=d=0.3:pix_th=0.02'))); cong = len(re.findall('freeze_start', log('freezedetect=n=0.001:d=1.0')))
    cortes = re.findall(r'lavfi\.scd\.time: ([\d.]+)', log('scdet=threshold=14'))
    L = sonoridad(out); tl = leer_tiempos(P); mus = tl.get('musica', 'no') != 'no'
    sil = re.findall(r'silence_start: ([\d.]+)', log(None, 'silencedetect=n=-50dB:d=1'))
    det = None
    r = subprocess.run(['node', os.path.join(T, 'determinismo.js'), 'index.html'], cwd=C(P), capture_output=True, text=True); det = 'DETERMINISMO OK' in r.stdout
    sh(['ffmpeg', '-v', 'error', '-y', '-i', out, '-vf', f'fps=1/{max(1.0, dur / 12):.3f},scale=270:480,tile=6x2', '-frames:v', '1', os.path.join(Q, 'hoja_contacto.jpg')])
    tx = None
    r = subprocess.run(['node', os.path.join(T, 'textos.js'), 'index.html', '0.1'], cwd=C(P), capture_output=True, text=True)
    try:
        tx = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception:
        print(r.stderr[-1500:])
    # imagen: fondo oscuro, movimiento continuo (cada medio segundo cambia algo), arranque en movimiento, bucle
    G2 = [np.frombuffer(g, dtype=np.uint8).astype(np.int16) for g in grises(out, 2)]
    lum = float(np.mean([g.mean() for g in G2])) if G2 else None
    difs = [float(np.abs(G2[i + 1] - G2[i]).mean()) for i in range(len(G2) - 1)]
    g0, g5 = gris(out, 0), gris(out, 0.5); gl = gris(out, frame=nfr - 1)
    mov0 = float(np.abs(np.array(g0, dtype=np.int16) - np.array(g5, dtype=np.int16)).mean()) if g0 and g5 and len(g0) == len(g5) else None
    loopd = float(np.abs(np.array(g0, dtype=np.int16) - np.array(gl, dtype=np.int16)).mean()) if g0 and gl and len(g0) == len(gl) else None
    import importlib.util
    spec = importlib.util.spec_from_file_location('tiempos_mod', os.path.join(T, 'tiempos.py')); tm = importlib.util.module_from_spec(spec); spec.loader.exec_module(tm)
    np_ = tm.palabras(tl['pregunta']); nf_ = tm.palabras(tl['frase'])
    fuentes = os.path.join(P, 'FUENTES_Y_DECISIONES.md'); fu = os.path.exists(fuentes) and bool(tl.get('fuente'))
    sc = sincro(P, tx['eventos'] if tx else [])
    rv = os.path.join(Q, 'revision_visual.txt'); flota = None
    if os.path.exists(rv):
        flota = bool(re.search(r'nada flota:\s*ok', open(rv, encoding='utf-8').read(), re.I))
    PERM = {'pregunta', 'contador', 'frase', 'marca'}
    ok = lambda c: '✔' if c else '✘'
    filas = [
        ('Formato', f'{vs["codec_name"]} {vs["width"]}×{vs["height"]} {vs["r_frame_rate"]} · {au[0]["codec_name"] + " " + au[0]["sample_rate"] + " Hz" if au else "SIN AUDIO"}', vs['codec_name'] == 'h264' and vs['width'] == 1080 and vs['height'] == 1920 and vs['r_frame_rate'] == '30/1' and bool(au) and au[0]['codec_name'] == 'aac' and au[0]['sample_rate'] == '48000'),
        ('Duración (25-45 s) / tamaño (< 100 MB)', f'{dur:.2f} s · {size / 1e6:.1f} MB', 25 <= dur <= 45.05 and size < 100e6),
        ('Decodificación completa', f'{len(err)} errores', not err),
        ('Una sola escena (sin cortes: scdet)', f'{len(cortes)} cortes' + (': ' + ', '.join(cortes[:5]) if cortes else ''), not cortes),
        ('Movimiento continuo (cambio entre medios segundos)', f'mín. {min(difs):.2f}/255 · {cong} congelados > 1 s · {negros} negros' if difs else 'sin datos', bool(difs) and min(difs) > 0.15 and cong == 0 and negros == 0),
        ('Movimiento desde el fotograma 0', 'sin datos' if mov0 is None else f'{mov0:.2f}/255 en 0,5 s', mov0 is not None and mov0 > 0.4),
        ('Fondo oscuro (luminancia media)', 'sin datos' if lum is None else f'{lum:.1f}/255', lum is not None and lum < 45),
        ('Sonoridad (−14 LUFS, pico ≤ −1 dBTP)', f'{L["I"]:.1f} LUFS · pico {L["TP"]:.1f} dBTP' if L else '—', bool(L) and abs(L['I'] + 14) <= 1 and (L['TP'] or 0) <= -1),
        ('Sonido sacado de la simulación (arranques = eventos ±25 ms)', 'sin datos' if not sc else f'{sc[0]}/{sc[1]} arranques coinciden con eventos ({sc[2]} eventos)', bool(sc) and sc[1] > 0 and sc[0] / sc[1] >= 0.95),
        ('Música (muy baja o ninguna)', 'ninguna' if not mus else f'muy baja (−20 LUFS {a.musica_db:+.0f} dB antes de normalizar)', (not mus) or a.musica_db <= -6),
        ('Silencios > 1 s (informativo)', f'{len(sil)}', True),
        ('Determinismo (simulación precalculada incluida)', 'OK' if det else 'FALLO', det is True),
        ('Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940)', 'sin datos' if tx is None else (f'{len(tx["fuera"])} textos fuera' + (': ' + ', '.join(f'{f["tipo"]} t={f["t"]} {f["motivo"]}' for f in tx['fuera'][:5]) if tx['fuera'] else '')), tx is not None and not tx['fuera']),
        ('Texto mínimo (solo pregunta, contador, frase y marca)', 'sin datos' if tx is None else 'tipos: ' + ', '.join(f'{k} (máx. {tx["max"].get(k, 0)} a la vez)' for k in sorted(tx['tipos'])), tx is not None and set(tx['tipos']) <= PERM and all(v <= 1 for v in tx['max'].values())),
        ('Pregunta y frase nunca juntas (empalme limpio)', 'sin datos' if tx is None else f'{tx.get("juntas", 0)} muestras con las dos', tx is not None and tx.get('juntas', 0) == 0),
        ('Pregunta ≤ 6 palabras en el fotograma 0 · contador visible', f'«{tl["pregunta"]}» ({np_} palabras)' + ('' if tx is None else f' · fotograma 0: {"sí" if tx["pregunta0"] else "NO"} · contador: {"sí" if tx["contador0"] else "NO"}'), np_ <= 6 and tx is not None and tx['pregunta0'] and tx['contador0']),
        ('Una sola frase final con el dato · fuente', f'«{tl["frase"]}» ({nf_} palabras) a {tl["tFrase"]:.1f} s · fuente: {"sí" if fu else "FALTA"}', nf_ <= 14 and tx is not None and tx['fraseFinal'] and fu),
        ('Marca de agua «ASOMBROTECA» todo el vídeo', 'sin datos' if tx is None else f'{tx["marca"]}/{tx["muestras"]} muestras', tx is not None and tx['marca'] == tx['muestras']),
        ('Bucle (último fotograma ≈ primero)', 'sin datos' if loopd is None else f'diferencia media {loopd:.1f}/255', loopd is not None and loopd < 8),
        ('Nada flota (revisión visual de la hoja de contacto)', 'pendiente: crear 07_QC/revision_visual.txt' if flota is None else ('OK' if flota else 'REVISAR'), flota is True),
    ]
    txt = '\n'.join(f'{k}: {v} {ok(c)}' for k, v, c in filas)
    veredicto = 'TODO CORRECTO' if all(c for _, _, c in filas) else 'HAY PUNTOS A REVISAR'
    open(os.path.join(Q, 'qc_tecnico.txt'), 'w').write(f'Archivo: {out}\n{txt}\nQC: {veredicto}\n')
    md = [f'# QC · {os.path.basename(out)}', '', f'**{veredicto}**', '', '| Control | Resultado | |', '|---|---|---|'] + [f'| {k} | {v} | {ok(c)} |' for k, v, c in filas]
    md += ['', 'Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.']
    if os.path.exists(rv):
        md += ['', '## Revisión visual', '', open(rv, encoding='utf-8').read().strip()]
    open(os.path.join(Q, 'QC.md'), 'w').write('\n'.join(md) + '\n')
    print(txt)
    print('QC: ' + veredicto)


def p_limpiar(P, a):
    f = os.path.join(C(P), 'index.html')
    if os.path.exists(f):
        os.remove(f)
    shutil.rmtree(trabajo(P, a), ignore_errors=True)
    print('Temporales borrados.')


def main():
    ap = argparse.ArgumentParser(description='Produce un reel SIN VOZ de simulación.')
    ap.add_argument('proyecto'); ap.add_argument('paso', choices=['tiempos', 'build', 'prueba', 'render', 'qc', 'todo', 'limpiar'])
    ap.add_argument('extra', nargs='*', help='instantes (s) para «prueba»')
    ap.add_argument('--workers', type=int, default=6); ap.add_argument('--musica-db', type=float, default=-10.0)
    ap.add_argument('--salida', default=None); ap.add_argument('--trabajo', default=None)
    a = ap.parse_args(); P = os.path.abspath(a.proyecto)
    if not os.path.isfile(os.path.join(P, '03_GUION', 'tiempos.txt')):
        sys.exit(f'No parece un reel (falta 03_GUION/tiempos.txt): {P}')
    pasos = {'tiempos': [p_tiempos], 'build': [p_build], 'prueba': [p_prueba], 'render': [p_render], 'qc': [p_qc], 'todo': [p_render, p_qc], 'limpiar': [p_limpiar]}
    for f in pasos[a.paso]:
        print(f'== {f.__name__[2:]}')
        f(P, a)


if __name__ == '__main__':
    main()
