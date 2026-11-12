#!/usr/bin/env python3
# Crea un proyecto de vídeo listo para producir con la PLANTILLA ASOMBROTECA.
# Uso:
#   python3 PLANTILLA_ASOMBROTECA/tools/nuevo_proyecto.py NOMBRE [--titulo "Título"] [--estilo cartoon] [--marca "MI CANAL"]
#                                                          [--voz ruta/voz.mp3] [--destino carpeta]
# Crea <destino>/<NOMBRE>_PROYECTO/ (por defecto junto a la carpeta de la plantilla) con:
#   01_ENTRADA/{audio,referencias_originales}  03_GUION/tramos.txt  04_CODIGO/{index.src.html, js/episodio.js, js/fotos.js}
#   05_AUDIO  06_SUBTITULOS  07_OUTPUT/PUBLICAR.md  07_QC  README.md  FUENTES_Y_DECISIONES.md  CREDITOS_IMAGENES.md
# Las rutas a la plantilla se calculan solas, así que el proyecto funciona esté donde esté.
import argparse, os, re, shutil, sys, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # carpeta PLANTILLA_ASOMBROTECA
TPL = os.path.join(RAIZ, 'tools', 'plantillas_proyecto')
ESTILOS = ['asombroteca', 'viral', 'cartoon', 'noche', 'blueprint', 'dossier', 'producto', 'tecno']


def version():
    try:
        filas = [l for l in open(os.path.join(RAIZ, 'CAMBIOS_PLANTILLA.md'), encoding='utf-8') if re.match(r'^\| \d', l)]
        return filas[-1].split('|')[1].strip()
    except Exception:
        return '?'


def slug(s):
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^A-Za-z0-9]+', '_', s).strip('_').upper() or 'VIDEO'


def main():
    ap = argparse.ArgumentParser(description='Crea un proyecto de vídeo con la plantilla.')
    ap.add_argument('nombre', help='nombre corto del vídeo (p. ej. TECLADO_IPHONE)')
    ap.add_argument('--titulo', default=None, help='título legible del vídeo')
    ap.add_argument('--estilo', default='asombroteca', choices=ESTILOS, help='estilo visual (ver GUIA_ESTILOS.md)')
    ap.add_argument('--marca', default='ASOMBROTECA', help='nombre del canal que aparece al final')
    ap.add_argument('--voz', default=None, help='archivo de voz (mp3/wav/m4a) que se copia a 01_ENTRADA/audio/')
    ap.add_argument('--destino', default=os.path.dirname(RAIZ), help='carpeta donde crear el proyecto')
    ap.add_argument('--serie', default=None, help='formato de serie de PLANTILLA_ASOMBROTECA/series/ (v1.31), p. ej. serie_mito_verdad')
    ap.add_argument('--capitulo', default='', help='número de capítulo de la serie')
    a = ap.parse_args()
    nombre = slug(a.nombre)
    carpeta = os.path.join(os.path.abspath(a.destino), nombre + '_PROYECTO')
    if os.path.exists(carpeta):
        sys.exit(f'Ya existe: {carpeta}  (elige otro nombre o bórrala tú)')
    titulo = a.titulo or a.nombre.replace('_', ' ').capitalize()
    for d in ['01_ENTRADA/audio', '01_ENTRADA/referencias_originales', '03_GUION', '04_CODIGO/js', '05_AUDIO', '06_SUBTITULOS', '07_OUTPUT', '07_QC']:
        os.makedirs(os.path.join(carpeta, d))
    rel = os.path.relpath(RAIZ, os.path.join(carpeta, '04_CODIGO')).replace(os.sep, '/')
    reemplazos = {'{{TITULO}}': titulo, '{{RUTA}}': rel, '{{ESTILO}}': a.estilo, '{{MARCA}}': a.marca.upper(), '{{VERSION}}': version(),
                  '{{CARPETA}}': os.path.relpath(carpeta, os.path.dirname(RAIZ)).replace(os.sep, '/')}

    def copia(src, dst):
        s = open(os.path.join(TPL, src), encoding='utf-8').read()
        for k, v in reemplazos.items():
            s = s.replace(k, v)
        open(os.path.join(carpeta, dst), 'w', encoding='utf-8').write(s)

    copia('index.src.html', '04_CODIGO/index.src.html')
    copia('episodio.js', '04_CODIGO/js/episodio.js')
    copia('README.md', 'README.md')
    copia('FUENTES_Y_DECISIONES.md', 'FUENTES_Y_DECISIONES.md')
    copia('CREDITOS_IMAGENES.md', 'CREDITOS_IMAGENES.md')
    copia('PUBLICAR.md', '07_OUTPUT/PUBLICAR.md')   # v1.29: textos de publicación por red
    if a.serie:   # v1.31: formato de serie (sello del veredicto, portada fija, PUBLICAR de la serie)
        SD = os.path.join(RAIZ, 'series', a.serie)
        if not os.path.isdir(SD):
            sys.exit(f'No existe la serie {a.serie} en {os.path.join(RAIZ, "series")}')
        src = os.path.join(carpeta, '04_CODIGO', 'index.src.html'); h = open(src, encoding='utf-8').read()
        h = h.replace(f'<!-- @inline-js {rel}/motor/plantilla.js -->', f'<!-- @inline-js {rel}/motor/plantilla.js -->\n<!-- @inline-js {rel}/series/{a.serie}/serie.js -->')
        open(src, 'w', encoding='utf-8').write(h)
        shutil.copy2(os.path.join(SD, 'serie.json'), os.path.join(carpeta, 'SERIE.json'))
        if os.path.exists(os.path.join(SD, 'PUBLICAR.md')):
            t = open(os.path.join(SD, 'PUBLICAR.md'), encoding='utf-8').read().replace('{{TITULO}}', titulo).replace('{{CAPITULO}}', a.capitulo or '?')
            open(os.path.join(carpeta, '07_OUTPUT', 'PUBLICAR.md'), 'w', encoding='utf-8').write(t)
        print(f'  serie: {a.serie} (serie.js incrustado, SERIE.json, PUBLICAR.md de la serie)')
    open(os.path.join(carpeta, '04_CODIGO/js/fotos.js'), 'w', encoding='utf-8').write(
        '// Imágenes documentales en base64 (ver CREDITOS_IMAGENES.md): window.FOTOS = { clave: "data:image/jpeg;base64,…" }\nwindow.FOTOS = {};\n')
    open(os.path.join(carpeta, '03_GUION/tramos.txt'), 'w', encoding='utf-8').write(
        '# Una línea por tramo de voz (entre pausas largas), en orden. Cifras con su forma hablada: 1945,|milnovecientoscuarentaycinco\n'
        '# v1.29: ganchos de la misma toma al principio: «[GANCHO A] texto», «[GANCHO B] texto», «[GANCHO C] texto» → producir.py … variantes\n'
        '# Genera un borrador con: python3 PLANTILLA_ASOMBROTECA/tools/producir.py <proyecto> voz\n')
    if a.voz:
        shutil.copy2(a.voz, os.path.join(carpeta, '01_ENTRADA/audio', os.path.basename(a.voz)))
    print(f'Proyecto creado: {carpeta}')
    print(f'  estilo: {a.estilo} · marca: {a.marca.upper()} · plantilla v{version()} (ruta relativa {rel})')
    print('Siguiente paso: pon la voz en 01_ENTRADA/audio/ (si no lo hiciste) y ejecuta')
    print(f'  python3 {os.path.relpath(os.path.join(RAIZ, "tools", "producir.py"))} {os.path.relpath(carpeta)} voz')


if __name__ == '__main__':
    main()
