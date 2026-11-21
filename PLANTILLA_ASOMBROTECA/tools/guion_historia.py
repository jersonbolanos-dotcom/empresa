#!/usr/bin/env python3
# v2.4 · Revisa un guion del MODO HISTORIA (Facebook) ANTES de generar la voz.
# Uso: python3 -I tools/guion_historia.py <PROYECTO>/03_GUION/guion.txt [caracteres_por_segundo]
#   · una frase o tramo por línea; las líneas «[PAUSA x]» cuentan como silencio de x s.
#   · velocidad por defecto: 16 caracteres/s (Dan, Eleven v4: 1.078 car. → 70,7 s en «relojes»; 990 car. → 59,1 s en «Chacao»).
# Comprueba: duración estimada (objetivo 85-100 s; AVISO por debajo de 75 s o por encima de 110 s), palabras (200-230) y la estructura:
#   0-3 s peligro («¿Qué pasa si…?» o «Vas en…», «Estás dentro de…») · 3-12 s una cifra · 12-20 s promesa abierta ·
#   20-75 s 3-4 pasos con frase de tensión · 75-90 s desenlace · 90-100 s pregunta para comentar + «sigue a Asombroteca».
import re
import sys

TENSION = r"\b(pero|y entonces|aqu[ií] viene|el problema|casi nadie|lo que nadie|sin embargo|de pronto|justo entonces|y ah[ií]|lo peor|lo raro)\b"
NUMERO = r"\d|\b(uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien|ciento|cientos|mil|millón|millones)\b"
PROMESA = r"no es lo que|lo que (te|nadie|casi nadie)|al final|ya ver[aá]s|la respuesta|lo que de verdad|lo que realmente"


def main():
    if len(sys.argv) < 2:
        sys.exit('Uso: guion_historia.py guion.txt [caracteres_por_segundo]')
    cps = float(sys.argv[2]) if len(sys.argv) > 2 else 16.0
    lineas = [l.strip() for l in open(sys.argv[1], encoding='utf-8') if l.strip() and not l.startswith('#')]
    t, tramos, car, pal = 0.0, [], 0, 0
    for l in lineas:
        m = re.match(r'^\[PAUSA\s+([\d.,]+)\]$', l, re.I)
        if m:
            t += float(m.group(1).replace(',', '.')); continue
        d = len(l) / cps + 0.25   # 0,25 s de respiración natural entre tramos
        tramos.append((t, t + d, l.lower())); t += d; car += len(l); pal += len(l.split())
    dur = t
    en = lambda a, b: ' '.join(x[2] for x in tramos if x[0] < b and x[1] > a)
    print(f'Guion: {len(tramos)} tramos · {pal} palabras · {car} caracteres → ~{dur:.0f} s a {cps:g} car./s')
    av = []
    if dur < 75:
        av.append(f'AVISO: queda corto (~{dur:.0f} s; mínimo 75 s, objetivo 85-100 s)')
    elif dur > 110:
        av.append(f'AVISO: queda largo (~{dur:.0f} s; máximo 110 s, objetivo 85-100 s)')
    elif not 85 <= dur <= 100:
        av.append(f'nota: ~{dur:.0f} s, fuera del objetivo 85-100 s (dentro de 75-110)')
    if not 200 <= pal <= 230:
        av.append(f'nota: {pal} palabras (objetivo 200-230)')
    primera = tramos[0][2] if tramos else ''
    if not re.search(r'qu[eé] pasa si|\?|\b(vas|est[aá]s|imagina que est[aá]s|imagina que vas|te subes|vuelas|conduces|peligro)\b', primera):
        av.append('AVISO primera frase: no hay pregunta ni peligro («¿Qué pasa si…?» o «Vas en…», «Estás dentro de…»)')
    if not re.search(NUMERO, en(3, 12.5)):
        av.append('AVISO 3-12 s: falta una cifra concreta de lo que está en juego')
    if not re.search(PROMESA, en(0, 20)):
        av.append('AVISO antes de 20 s: no se reconoce una promesa abierta («y lo que te salva no es lo que imaginas»)')
    nt = len(re.findall(TENSION, en(20, 76)))
    if nt < 3:
        av.append(f'AVISO 20-75 s: {nt} frases de tensión (mínimo 3: «pero aquí viene el problema…», «y entonces pasa algo que casi nadie sabe…»)')
    fin = en(dur - 12, dur + 1)
    if '?' not in fin:
        av.append('AVISO cierre: no tiene una pregunta concreta para comentar')
    if not re.search(r'sigue a asombroteca|s[ií]guenos', fin):
        av.append('AVISO cierre: falta «sigue a Asombroteca»')
    print('\n'.join(av) if av else 'Estructura de historia: correcta')
    print('(solo avisa, no bloquea)')
    for a, b, l in tramos:
        print(f'  {a:5.1f}-{b:5.1f} s  {l[:90]}')


if __name__ == '__main__':
    main()
