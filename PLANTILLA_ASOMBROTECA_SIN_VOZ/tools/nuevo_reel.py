#!/usr/bin/env python3
# Crea un reel SIN VOZ de SIMULACIÓN a partir del ejemplo de su formato (funciona desde el primer minuto).
# Uso:  python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/nuevo_reel.py NOMBRE --formato rebote|galton|fourier|incendio|montecarlo|pendulos|hormiga|cristal|caos
#                [--marca ASOMBROTECA] [--titulo "Título"] [--destino CARPETA]
# Resultado: <destino>/NOMBRE_REEL/ con 03_GUION/tiempos.txt, 04_CODIGO/{index.src.html, js/episodio.js}, FUENTES_Y_DECISIONES.md.
# Después: editar tiempos.txt y episodio.js → python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/producir_reel.py NOMBRE_REEL todo
import argparse, os, re, shutil, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FORMATOS = {'rebote': 'SIM_BACTERIAS_REEL', 'galton': 'SIM_GALTON_REEL', 'fourier': 'SIM_FOURIER_REEL',
            'incendio': 'SIM_INCENDIO_REEL', 'montecarlo': 'SIM_MONTECARLO_REEL', 'pendulos': 'SIM_PENDULOS_REEL',   # v2.2
            'hormiga': 'SIM_HORMIGA_REEL', 'cristal': 'SIM_CRISTAL_REEL', 'caos': 'SIM_CAOS_REEL'}   # v2.3


def version():
    for l in open(os.path.join(RAIZ, 'CAMBIOS_PLANTILLA.md'), encoding='utf-8'):
        m = re.match(r'^\|\s*SIN_VOZ\s+([\d.]+)', l)
        if m:
            v = m.group(1)
    return v


def main():
    ap = argparse.ArgumentParser(description='Crea un reel SIN VOZ de simulación.')
    ap.add_argument('nombre'); ap.add_argument('--formato', required=True, choices=sorted(FORMATOS))
    ap.add_argument('--marca', default='ASOMBROTECA')
    ap.add_argument('--titulo', default=None); ap.add_argument('--destino', default='.')
    a = ap.parse_args()
    nombre = re.sub(r'[^A-Za-z0-9_]+', '_', a.nombre.upper()).strip('_')
    P = os.path.abspath(os.path.join(a.destino, nombre if nombre.endswith('_REEL') else nombre + '_REEL'))
    if os.path.exists(P):
        sys.exit(f'Ya existe: {P}')
    ej = os.path.join(RAIZ, 'ejemplos', FORMATOS[a.formato])
    for d in ['03_GUION', '04_CODIGO/js', '05_AUDIO', '07_OUTPUT', '07_QC']:
        os.makedirs(os.path.join(P, d), exist_ok=True)
    shutil.copy2(os.path.join(ej, '03_GUION', 'tiempos.txt'), os.path.join(P, '03_GUION', 'tiempos.txt'))
    epi = open(os.path.join(ej, '04_CODIGO', 'js', 'episodio.js'), encoding='utf-8').read()
    if a.marca != 'ASOMBROTECA':
        epi = epi.replace('R.make({ draw, sound,', f"R.make({{ marca: {{ nombre: '{a.marca}' }}, draw, sound,", 1)
    open(os.path.join(P, '04_CODIGO', 'js', 'episodio.js'), 'w', encoding='utf-8').write(epi)
    ruta = os.path.relpath(RAIZ, os.path.join(P, '04_CODIGO')).replace(os.sep, '/')
    src = open(os.path.join(RAIZ, 'tools', 'plantillas_reel', 'index.src.html'), encoding='utf-8').read()
    src = src.replace('{{RUTA}}', ruta).replace('{{TITULO}}', a.titulo or nombre.replace('_', ' ').title()).replace('{{VERSION}}', version())
    open(os.path.join(P, '04_CODIGO', 'index.src.html'), 'w', encoding='utf-8').write(src)
    fu = open(os.path.join(RAIZ, 'tools', 'plantillas_reel', 'FUENTES_Y_DECISIONES.md'), encoding='utf-8').read()
    open(os.path.join(P, 'FUENTES_Y_DECISIONES.md'), 'w', encoding='utf-8').write(fu.replace('{{TITULO}}', a.titulo or nombre).replace('{{FORMATO}}', a.formato))
    print(f'Reel creado: {P}\n  formato {a.formato} (copia del ejemplo {FORMATOS[a.formato]}), marca de agua {a.marca}')
    print('  1) Edita 03_GUION/tiempos.txt (pregunta ≤ 6 palabras, frase final con el dato, fuente, 25-45 s, PARAM de la simulación)')
    print('  2) Adapta 04_CODIGO/js/episodio.js y ajusta la simulación en el navegador: node tools/sim_info.js 04_CODIGO/index.html')
    print(f'  3) python3 {os.path.relpath(os.path.join(RAIZ, "tools", "producir_reel.py"))} {os.path.relpath(P)} prueba 0 1 5 10 20 30   → hoja de contacto')
    print(f'  4) python3 {os.path.relpath(os.path.join(RAIZ, "tools", "producir_reel.py"))} {os.path.relpath(P)} todo        → MP4 + QC')


if __name__ == '__main__':
    main()
