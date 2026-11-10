#!/usr/bin/env python3
# Lee el guion de tiempos de un reel SIN VOZ y genera el reloj del vídeo.
# Uso (desde la carpeta 04_CODIGO del reel):  python3 -I ../../tools/tiempos.py ../03_GUION/tiempos.txt js/tiempos.js tiempos.json
#
# Formato de 03_GUION/tiempos.txt (una línea por aparición; «#» = comentario):
#   DURACION 20            duración total en segundos (12-30); se redondea a un número entero de fotogramas (30 fps)
#   MUSICA suave           suave (piano) · piano · pulso · no
#   inicio | duración | texto en pantalla | efecto[,efecto…] | clave
#   0.0    | 1.8      | ¿Cuántas habrá al final del video? | whoosh | gancho
#   2.0    | 0.5      |                                    | clic   |            (sin texto: solo sonido o evento)
# - texto: máximo 8 palabras. «*palabra*» = amarillo. « / » = salto de línea.
# - toda línea con texto lleva al menos un efecto (cada aparición suena en su fotograma exacto).
# - clave (opcional, única): nombre para usar el instante en episodio.js con R.t('clave').
# - inicio se ajusta al fotograma más cercano (múltiplo de 1/30 s).
import json, re, sys

EFECTOS = ['pop', 'popAgudo', 'popGrave', 'whoosh', 'swish', 'clic', 'tic', 'sello', 'golpe', 'ding', 'correcto', 'error', 'revelar',
           'riser', 'chispa', 'teclas', 'moneda', 'boing', 'latido', 'pagina', 'campana']
MUSICAS = ['suave', 'piano', 'pulso', 'no']
FPS = 30


def palabras(s):
    return len([w for w in s.replace('*', ' ').split() if w != '/' and re.search(r'\w', w)])


def leer(path):
    dur, mus, lineas, err, avisos = None, 'suave', [], [], []
    for n, raw in enumerate(open(path, encoding='utf-8'), 1):
        s = raw.split('#', 1)[0].strip() if not raw.lstrip().startswith('#') else ''
        if '|' in raw and not raw.lstrip().startswith('#'):
            s = raw.strip()
        if not s:
            continue
        m = re.match(r'^DURACION\s+([\d.,]+)\s*s?$', s, re.I)
        if m:
            dur = float(m.group(1).replace(',', '.')); continue
        m = re.match(r'^MUSICA\s+(\S+)$', s, re.I)
        if m:
            mus = m.group(1).lower()
            if mus not in MUSICAS:
                err.append(f'línea {n}: MUSICA «{mus}» no existe (usa: {", ".join(MUSICAS)})')
            continue
        cols = [c.strip() for c in s.split('|')]
        if len(cols) < 4:
            err.append(f'línea {n}: faltan columnas (inicio | duración | texto | efecto | clave)'); continue
        cols += [''] * (5 - len(cols))
        try:
            t0 = float(cols[0].replace(',', '.')); d = float(cols[1].replace(',', '.'))
        except ValueError:
            err.append(f'línea {n}: inicio o duración no son números'); continue
        t0f = round(t0 * FPS) / FPS
        if abs(t0f - t0) > 1e-6:
            avisos.append(f'línea {n}: inicio {t0} → {t0f:.4f} (fotograma exacto)')
        texto = cols[2]; sfx = [x.strip() for x in cols[3].split(',') if x.strip()]; clave = cols[4]
        for x in sfx:
            if x not in EFECTOS:
                err.append(f'línea {n}: efecto «{x}» no existe (usa: {", ".join(EFECTOS)})')
        if texto and not sfx:
            err.append(f'línea {n}: el texto «{texto}» aparece sin efecto de sonido')
        if texto and palabras(texto) > 8:
            err.append(f'línea {n}: «{texto}» tiene {palabras(texto)} palabras (máximo 8)')
        if d <= 0:
            err.append(f'línea {n}: duración ≤ 0')
        lineas.append({'t0': round(t0f, 4), 'd': round(d, 4), 'texto': texto, 'sfx': sfx, 'clave': clave, 'n': n})
    if dur is None:
        err.append('falta la línea «DURACION x»')
    else:
        df = round(dur * FPS) / FPS
        if abs(df - dur) > 1e-6:
            avisos.append(f'DURACION {dur} → {df:.4f} (fotogramas enteros)')
        dur = round(df, 4)
        if not 12 <= dur <= 30:
            err.append(f'DURACION {dur} fuera de 12-30 s')
    claves = [l['clave'] for l in lineas if l['clave']]
    for c in set(claves):
        if claves.count(c) > 1:
            err.append(f'clave repetida: «{c}»')
    if dur:
        for l in lineas:
            if l['t0'] < 0 or l['t0'] >= dur:
                err.append(f'línea {l["n"]}: inicio {l["t0"]} fuera del vídeo (0-{dur})')
            if l['t0'] + l['d'] > dur + 1e-6:
                l['d'] = round(dur - l['t0'], 4); avisos.append(f'línea {l["n"]}: duración recortada al final del vídeo')
    con_texto = [l for l in lineas if l['texto']]
    if not con_texto or con_texto[0]['t0'] >= 1.0:
        err.append('gancho: debe haber texto en pantalla antes de 1,0 s (pregunta o dato imposible)')
    return {'duracion': dur, 'musica': mus, 'lineas': lineas}, err, avisos


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__ or 'uso: tiempos.py tiempos.txt js/tiempos.js [tiempos.json]')
    data, err, avisos = leer(sys.argv[1])
    for a in avisos:
        print('aviso:', a)
    if err:
        for e in err:
            print('ERROR:', e)
        sys.exit(1)
    out = {'duracion': data['duracion'], 'musica': data['musica'], 'lineas': [{k: l[k] for k in ('t0', 'd', 'texto', 'sfx', 'clave')} for l in data['lineas']]}
    js = '// Generado por tools/tiempos.py desde 03_GUION/tiempos.txt — no editar a mano.\nwindow.TIEMPOS = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n'
    open(sys.argv[2], 'w', encoding='utf-8').write(js)
    if len(sys.argv) > 3:
        json.dump(out, open(sys.argv[3], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    nt = sum(1 for l in out['lineas'] if l['texto'])
    print(f'tiempos: {data["duracion"]} s · {len(out["lineas"])} líneas ({nt} con texto) · música {data["musica"]}')


if __name__ == '__main__':
    main()
