#!/usr/bin/env python3
# Crea un reel SIN VOZ nuevo a partir del ejemplo de su formato (funciona desde el primer minuto).
# Uso:  python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/nuevo_reel.py NOMBRE --formato contador|quiz|tamanos|linea|capas
#                [--estilo asombroteca] [--marca ASOMBROTECA] [--titulo "Título"] [--destino CARPETA]
# Resultado: <destino>/NOMBRE_REEL/ con 03_GUION/tiempos.txt, 04_CODIGO/{index.src.html, js/episodio.js}, FUENTES_Y_DECISIONES.md.
# Después: editar tiempos.txt y episodio.js → python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/producir_reel.py NOMBRE_REEL todo
import argparse, os, re, shutil, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FORMATOS = {'contador': 'REEL_BACTERIAS_REEL', 'quiz': 'REEL_PULPO_REEL', 'tamanos': 'REEL_OCEANO_REEL', 'linea': 'REEL_INVENTOS_REEL', 'capas': 'REEL_PANTALLA_REEL'}
ESTILOS = ['asombroteca', 'viral', 'cartoon', 'noche', 'blueprint', 'dossier', 'producto', 'tecno']


def version():
    for l in open(os.path.join(RAIZ, 'CAMBIOS_PLANTILLA.md'), encoding='utf-8'):
        m = re.match(r'^\|\s*SIN_VOZ\s+([\d.]+)', l)
        if m:
            v = m.group(1)
    return v


def main():
    ap = argparse.ArgumentParser(description='Crea un reel SIN VOZ.')
    ap.add_argument('nombre'); ap.add_argument('--formato', required=True, choices=sorted(FORMATOS))
    ap.add_argument('--estilo', default='asombroteca', choices=ESTILOS); ap.add_argument('--marca', default='ASOMBROTECA')
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
    epi = re.sub(r"const ESTILO = '[a-z]+'", f"const ESTILO = '{a.estilo}'", epi, count=1)
    epi = re.sub(r"const MARCA = '[^']*'", f"const MARCA = '{a.marca}'", epi, count=1)
    open(os.path.join(P, '04_CODIGO', 'js', 'episodio.js'), 'w', encoding='utf-8').write(epi)
    ruta = os.path.relpath(RAIZ, os.path.join(P, '04_CODIGO')).replace(os.sep, '/')
    src = open(os.path.join(RAIZ, 'tools', 'plantillas_reel', 'index.src.html'), encoding='utf-8').read()
    src = src.replace('{{RUTA}}', ruta).replace('{{TITULO}}', a.titulo or nombre.replace('_', ' ').title()).replace('{{VERSION}}', version())
    open(os.path.join(P, '04_CODIGO', 'index.src.html'), 'w', encoding='utf-8').write(src)
    fu = open(os.path.join(RAIZ, 'tools', 'plantillas_reel', 'FUENTES_Y_DECISIONES.md'), encoding='utf-8').read()
    open(os.path.join(P, 'FUENTES_Y_DECISIONES.md'), 'w', encoding='utf-8').write(fu.replace('{{TITULO}}', a.titulo or nombre).replace('{{FORMATO}}', a.formato))
    print(f'Reel creado: {P}\n  formato {a.formato} (copia del ejemplo {FORMATOS[a.formato]}), estilo {a.estilo}, marca {a.marca}')
    print('  1) Edita 03_GUION/tiempos.txt (textos ≤ 8 palabras, efecto en cada aparición, gancho antes de 1 s)')
    print('  2) Adapta 04_CODIGO/js/episodio.js (las escenas usan R.t(\'clave\') de tiempos.txt)')
    print(f'  3) python3 {os.path.relpath(os.path.join(RAIZ, "tools", "producir_reel.py"))} {os.path.relpath(P)} prueba 0 2 5 9   → hoja de contacto')
    print(f'  4) python3 {os.path.relpath(os.path.join(RAIZ, "tools", "producir_reel.py"))} {os.path.relpath(P)} todo        → MP4 + QC')


if __name__ == '__main__':
    main()
