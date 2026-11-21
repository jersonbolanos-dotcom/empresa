#!/usr/bin/env python3
# v1.28 · Monta la voz con las pausas de posproducción de alineacion.json («[PAUSA x]» en tramos.txt).
# Inserta x s de SILENCIO DIGITAL EXACTO (muestras a cero) en cada punto; las muestras de voz se copian tal cual: nada se acelera,
# recorta ni recodifica (salida WAV float32 con la frecuencia y canales del original). El archivo original no se toca.
# Uso: python3 -I montar_voz.py voz_original alineacion.json salida.wav
# También se importa desde producir.py (tramos_identicos) para el control «Voz intacta» tramo a tramo.
import json, subprocess, sys
import numpy as np


def info(f):
    o = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=sample_rate,channels', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip().split(',')
    return int(o[0]), int(o[1])


def leer(f, sr, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-acodec', 'pcm_f32le', '-ar', str(sr), '-ac', str(ch), '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, ch)


def montar(voz, al, out):
    d = json.load(open(al)); pp = d.get('pausas_post', [])
    sr, ch = info(voz); x = leer(voz, sr, ch); partes, prev = [], 0
    for p in sorted(pp, key=lambda q: q['t']):
        i = int(round(p['t'] * sr)); partes += [x[prev:i], np.zeros((int(round(p['dur'] * sr)), ch), dtype=np.float32)]; prev = i
    partes.append(x[prev:]); y = np.concatenate(partes)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', str(ch), '-i', '-', '-c:a', 'pcm_f32le', out], input=y.tobytes(), check=True)
    return sr, len(pp)


def tramos_identicos(voz, montada, al):
    """Compara la huella (md5 de las muestras) de cada tramo de voz del original con el mismo tramo en la voz montada."""
    import hashlib
    d = json.load(open(al)); sr, ch = info(voz); a = leer(voz, sr, ch); b = leer(montada, sr, ch); pp = sorted(d.get('pausas_post', []), key=lambda q: q['t'])
    ok = 0; segs = d['segments']
    for g in segs:
        s0, e0 = g.get('s0', g['s']), g.get('e0', g['e']); off = sum(int(round(p['dur'] * sr)) for p in pp if p['t'] <= s0)
        i0, i1 = int(round(s0 * sr)), int(round(e0 * sr))
        if hashlib.md5(a[i0:i1].tobytes()).hexdigest() == hashlib.md5(b[i0 + off:i1 + off].tobytes()).hexdigest():
            ok += 1
    return ok, len(segs)


if __name__ == '__main__':
    sr, n = montar(sys.argv[1], sys.argv[2], sys.argv[3])
    print(f'voz montada: {n} pausas insertadas ({sr} Hz) → {sys.argv[3]}')
