#!/usr/bin/env python3
# v2.5 · Renderiza SOLO un tramo corto de un proyecto (prueba rápida, sin tocar el FINAL): fotogramas del tramo + voz + efectos.
# Uso: python3 -I tools/clip.py <PROYECTO> <t0> <t1>      → <PROYECTO>/07_QC/clip_<t0>-<t1>.mp4
#   · construye index.html, saca los fotogramas a 30 fps con frames.js, genera la pista de efectos con audio.js y mezcla
#     la voz (05_AUDIO/voz_montada.wav o el primer audio de 01_ENTRADA/audio) con los efectos del mismo tramo.
#   · no sustituye al QC: para entregar, `producir.py <PROYECTO> video`.
import glob
import os
import shutil
import subprocess
import sys
import tempfile

T = os.path.dirname(os.path.abspath(__file__))


def main():
    if len(sys.argv) < 4:
        sys.exit('Uso: clip.py <PROYECTO> <t0> <t1>')
    P, t0, t1 = os.path.abspath(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3])
    C = os.path.join(P, '04_CODIGO'); Q = os.path.join(P, '07_QC'); os.makedirs(Q, exist_ok=True)
    subprocess.run([sys.executable, '-I', os.path.join(T, 'build.py')], cwd=C, check=True, stdout=subprocess.DEVNULL)
    W = tempfile.mkdtemp(prefix='clip_')
    try:
        n = int(round((t1 - t0) * 30)); ts = [f'{t0 + i / 30:.4f}' for i in range(n)]
        for i in range(0, n, 60):   # en lotes (la línea de órdenes no admite miles de argumentos)
            subprocess.run(['node', os.path.join(T, 'frames.js'), 'index.html', W] + ts[i:i + 60], cwd=C, check=True, stdout=subprocess.DEVNULL)
        pngs = sorted(glob.glob(os.path.join(W, 't_*.png')))
        for k, f in enumerate(pngs):
            os.rename(f, os.path.join(W, f'f_{k:05d}.png'))
        A = os.path.join(W, 'audio'); subprocess.run(['node', os.path.join(T, 'audio.js'), 'index.html', A], cwd=C, check=True, stdout=subprocess.DEVNULL)
        voz = os.path.join(P, '05_AUDIO', 'voz_montada.wav')
        if not os.path.exists(voz):
            voz = sorted(glob.glob(os.path.join(P, '01_ENTRADA', 'audio', '*')))[0]
        out = os.path.join(Q, f'clip_{t0:g}-{t1:g}.mp4')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', os.path.join(W, 'f_%05d.png'),
                        '-ss', f'{t0}', '-t', f'{t1 - t0}', '-i', voz, '-ss', f'{t0}', '-t', f'{t1 - t0}', '-i', os.path.join(A, 'sfx.wav'),
                        '-filter_complex', '[1:a]aresample=48000,aformat=channel_layouts=stereo[v];[2:a]aresample=48000,aformat=channel_layouts=stereo,volume=-1dB[s];[v][s]amix=inputs=2:normalize=0[o]',
                        '-map', '0:v', '-map', '[o]', '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
        print(f'Clip: {out} ({len(pngs)} fotogramas)')
    finally:
        shutil.rmtree(W, ignore_errors=True)


if __name__ == '__main__':
    main()
