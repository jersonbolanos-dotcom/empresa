#!/usr/bin/env python3
# Lee el guion de un reel de SIMULACIÓN (Plantilla Asombroteca SIN_VOZ 2.0) y genera js/tiempos.js + tiempos.json.
# Uso (desde 04_CODIGO):  python3 -I ../../tools/tiempos.py ../03_GUION/tiempos.txt js/tiempos.js tiempos.json
#
# Formato de 03_GUION/tiempos.txt («#» = comentario):
#   DURACION 35                         25-45 s (se redondea a fotogramas enteros, 30 fps)
#   MUSICA no                           no · muy_baja
#   FONDO oscuro                        oscuro (por defecto) · atardecer (v2.4: cielo claro de atardecer con figuras oscuras; el QC lo mide aparte)
#   SEMILLA 7                           semilla de H.rng para la simulación
#   PREGUNTA 3.5 | ¿Llenarán el círculo antes del final?     (fin en s | texto ≤ 6 palabras; está en pantalla desde el fotograma 0)
#   FRASE 31 | Una *E. coli* puede duplicarse cada 20 minutos.  (inicio en s | la ÚNICA frase que revela el dato; ≤ 14 palabras)
#   FUENTE Sezonov et al. (2007), Journal of Bacteriology 189: 8746-8749
#   PARAM tDiv 2.3                      parámetros numéricos de la simulación (R.TL.param.tDiv)
import json, re, sys

FPS = 30


def palabras(s):
    return len([w for w in s.replace('*', ' ').split() if w != '/' and re.search(r'\w', w)])


def leer(path):
    d = {'duracion': None, 'musica': 'no', 'semilla': 1, 'pregunta': '', 'tPregunta': 3.5, 'frase': '', 'tFrase': None, 'fuente': '', 'param': {}, 'fondo': 'oscuro'}
    err, avisos = [], []
    for n, raw in enumerate(open(path, encoding='utf-8'), 1):
        s = raw.strip()
        if not s or s.startswith('#'):
            continue
        m = re.match(r'^(\w+)\s+(.*)$', s)
        if not m:
            err.append(f'línea {n}: no se entiende «{s}»'); continue
        k, v = m.group(1).upper(), m.group(2).strip()
        try:
            if k == 'DURACION':
                d['duracion'] = float(v.replace(',', '.').rstrip('s'))
            elif k == 'MUSICA':
                d['musica'] = v.split()[0].lower()
                if d['musica'] not in ('no', 'muy_baja'):
                    err.append(f'línea {n}: MUSICA debe ser «no» o «muy_baja»')
            elif k == 'FONDO':
                d['fondo'] = v.split()[0].lower()
                if d['fondo'] not in ('oscuro', 'atardecer'):
                    err.append(f'línea {n}: FONDO debe ser «oscuro» o «atardecer»')
            elif k == 'SEMILLA':
                d['semilla'] = int(v.split()[0])
            elif k in ('PREGUNTA', 'FRASE'):
                a, b = [x.strip() for x in v.split('|', 1)]
                tt = round(float(a.replace(',', '.')) * FPS) / FPS
                if k == 'PREGUNTA':
                    d['pregunta'], d['tPregunta'] = b, tt
                else:
                    d['frase'], d['tFrase'] = b, tt
            elif k == 'FUENTE':
                d['fuente'] = v
            elif k == 'PARAM':
                pk, pv = v.split(None, 1)
                d['param'][pk] = float(pv.replace(',', '.'))
            else:
                err.append(f'línea {n}: clave desconocida «{k}»')
        except ValueError:
            err.append(f'línea {n}: valor mal escrito en «{s}»')
    D = d['duracion']
    if D is None:
        err.append('falta DURACION')
    else:
        df = round(D * FPS) / FPS
        if abs(df - D) > 1e-6:
            avisos.append(f'DURACION {D} → {df:.4f}')
        d['duracion'] = D = round(df, 4)
        if not 25 <= D <= 45:
            err.append(f'DURACION {D} fuera de 25-45 s')
    if not d['pregunta']:
        err.append('falta PREGUNTA')
    elif palabras(d['pregunta']) > 6:
        err.append(f'la pregunta tiene {palabras(d["pregunta"])} palabras (máximo 6)')
    if not d['frase']:
        err.append('falta FRASE (la frase final que revela el dato)')
    elif palabras(d['frase']) > 14:
        err.append(f'la frase final tiene {palabras(d["frase"])} palabras (máximo 14)')
    if not d['fuente']:
        err.append('falta FUENTE del dato')
    if D and d['tFrase'] is not None and not (D * 0.6 <= d['tFrase'] <= D - 2):
        err.append(f'FRASE en {d["tFrase"]} s: debe salir hacia el final (entre {D * 0.6:.1f} y {D - 2:.1f} s)')
    if d['tPregunta'] < 1.5:
        err.append('la pregunta debe verse al menos 1,5 s')
    return d, err, avisos


def main():
    data, err, avisos = leer(sys.argv[1])
    for a in avisos:
        print('aviso:', a)
    if err:
        for e in err:
            print('ERROR:', e)
        sys.exit(1)
    open(sys.argv[2], 'w', encoding='utf-8').write('// Generado por tools/tiempos.py desde 03_GUION/tiempos.txt — no editar a mano.\nwindow.TIEMPOS = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    if len(sys.argv) > 3:
        json.dump(data, open(sys.argv[3], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'tiempos: {data["duracion"]} s · pregunta «{data["pregunta"]}» · frase en {data["tFrase"]} s · música {data["musica"]}')


if __name__ == '__main__':
    main()
