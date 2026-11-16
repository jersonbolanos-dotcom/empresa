# v2.0 · Acortar una pausa NATURAL de la grabación (silencio entre dos tramos) sin tocar la voz.
# Uso (desde 04_CODIGO):  python3 -I ../../PLANTILLA_ASOMBROTECA/tools/acortar_pausa.py alineacion_C.json TRAMO SEGUNDOS
#   TRAMO = índice del tramo DESPUÉS del cual está la pausa (el de la alineación, desde 0); SEGUNDOS = silencio que queda (0,3-1,2).
# Corta solo el silencio central entre el final del tramo y el inicio del siguiente (deja SEGUNDOS/2 a cada lado), actualiza el
# «montaje» (en el tiempo de la grabación original) y desplaza los tiempos de las palabras y los tramos que vienen después.
# Los tramos de voz quedan idénticos (el QC lo comprueba con md5 por tramo). Después: subtitulos.py y build.py (este rearma la voz).
# Volver a ejecutar alinear.py deshace el recorte (se repite este paso). Sin numpy no comprueba la energía del corte.
import json, sys, subprocess, os


def main():
    if len(sys.argv) != 4:
        sys.exit(__doc__ if __doc__ else 'Uso: acortar_pausa.py alineacion_X.json TRAMO SEGUNDOS')
    al, i, x = sys.argv[1], int(sys.argv[2]), float(sys.argv[3].replace(',', '.'))
    if not 0.3 <= x <= 1.2:
        sys.exit('ERROR: el silencio que queda debe estar entre 0,3 y 1,2 s')
    d = json.load(open(al, encoding='utf-8'))
    if 'montaje' not in d:
        sys.exit('ERROR: la alineación no tiene «montaje» (hace falta una variante de gancho, p. ej. alineacion_C.json)')
    segs = d['segments']
    if not 0 <= i < len(segs) - 1:
        sys.exit(f'ERROR: tramo {i} fuera de rango (0-{len(segs) - 2})')
    e, s = segs[i]['e'], segs[i + 1]['s']
    if s - e <= x + 0.05:
        sys.exit(f'La pausa ya mide {s - e:.2f} s (≤ {x:.2f} s): no hay nada que recortar')
    c0, c1 = e + x / 2, s - x / 2; dur = c1 - c0
    # tiempo de salida → tiempo original, dentro del montaje
    pos, nuevo, hecho = 0.0, [], False
    for m in d['montaje']:
        if 'silencio' in m:
            nuevo.append(m); pos += m['silencio']; continue
        L = m['a'] - m['de']
        if not hecho and pos <= c0 and c1 <= pos + L:
            o0, o1 = m['de'] + (c0 - pos), m['de'] + (c1 - pos)
            nuevo += [{'de': m['de'], 'a': round(o0, 4)}, {'de': round(o1, 4), 'a': m['a']}]; hecho = True
        else:
            nuevo.append(m)
        pos += L
    if not hecho:
        sys.exit('ERROR: el silencio cae en el borde de dos piezas del montaje; elige otro valor')
    # comprobación: en el corte no hay voz (energía muy baja en la grabación original)
    try:
        import numpy as np
        adir = os.path.join(os.path.dirname(os.path.abspath(al)), '..', '01_ENTRADA', 'audio'); voz = os.path.join(adir, sorted(os.listdir(adir))[0])
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{o0:.3f}', '-t', f'{o1 - o0:.3f}', '-i', voz, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
        y = np.frombuffer(raw, dtype=np.int16).astype(np.float64) / 32768; pico = 20 * np.log10(np.abs(y).max() + 1e-9) if len(y) else -120
        print(f'pico en el tramo cortado de la grabación: {pico:.1f} dBFS')
        if pico > -30:
            sys.exit('ERROR: el tramo a cortar tiene sonido (> −30 dBFS): no es silencio; no se cambia nada')
    except ImportError:
        pass
    d['montaje'] = nuevo
    for w in d['words']:
        if w['s'] >= c1 - 1e-6:
            w['s'] = round(w['s'] - dur, 3); w['e'] = round(w['e'] - dur, 3)
    for g in segs:
        if g['s'] >= c1 - 1e-6:
            g['s'] = round(g['s'] - dur, 3); g['e'] = round(g['e'] - dur, 3)
    for k in ('duration', 'speech_end'):
        if k in d:
            d[k] = round(d[k] - dur, 6)
    d.setdefault('pausas_acortadas', []).append({'tramo': i, 'queda': x, 'quitado': round(dur, 3)})
    json.dump(d, open(al, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'Pausa tras el tramo {i}: {s - e:.2f} s → {x:.2f} s (se quitan {dur:.2f} s de silencio). Duración: {d["duration"]:.2f} s')


if __name__ == '__main__':
    main()
