# v2.2 · Hoja de muestra de la biblioteca de estilos: el MISMO tema pintado con cada piel, un fotograma vertical por estilo.
# Uso (desde la raíz del repositorio):
#   python3 -I PLANTILLA_ASOMBROTECA/tools/muestra_estilos.py ESTILOS_PRUEBA_PROYECTO [SEGUNDO=13.9] [estilo1,estilo2,…]
# Necesita 04_CODIGO/js/episodio_prueba.js con '__ESTILO__' donde va el nombre del estilo. Deja la hoja en 07_QC/muestra_estilos.jpg
# y los fotogramas en 07_QC/estilos/<nombre>.png. Restaura episodio.js al terminar.
import os, sys, glob, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

T = os.path.dirname(os.path.abspath(__file__))
ORDEN = ['tech_glow', 'engineering_blueprint', 'illuminated_manuscript', 'gouache_travel_poster', 'sumi_e', 'pixel_16bit', 'win95',
         'phosphor_terminal', 'kinetic_type', 'manim_math', 'claymation', 'cut_paper', 'papercraft', 'flat_vector_science', 'cosmic_star_chart']


def main():
    P = os.path.abspath(sys.argv[1]); t = sys.argv[2] if len(sys.argv) > 2 else '13.9'
    estilos = sys.argv[3].split(',') if len(sys.argv) > 3 else [e for e in ORDEN if os.path.exists(os.path.join(T, '..', 'estilos', e + '.js'))]
    C = os.path.join(P, '04_CODIGO'); ep = os.path.join(C, 'js', 'episodio.js'); plantilla = open(os.path.join(C, 'js', 'episodio_prueba.js'), encoding='utf-8').read()
    salida = os.path.join(P, '07_QC', 'estilos'); os.makedirs(salida, exist_ok=True); previo = open(ep, encoding='utf-8').read() if os.path.exists(ep) else None
    try:
        for e in estilos:
            open(ep, 'w', encoding='utf-8').write(plantilla.replace('__ESTILO__', e))
            subprocess.run([sys.executable, '-I', os.path.join(T, 'build.py')], cwd=C, check=True, capture_output=True)
            d = tempfile.mkdtemp(prefix='estilo_')
            r = subprocess.run(['node', os.path.join(T, 'frames.js'), 'index.html', d, t], cwd=C, capture_output=True, text=True)
            png = glob.glob(os.path.join(d, '*.png'))
            if not png:
                print('FALLO', e, r.stdout[-600:], r.stderr[-600:]); continue
            shutil.move(png[0], os.path.join(salida, e + '.png')); shutil.rmtree(d, ignore_errors=True); print('ok', e)
    finally:
        if previo is not None:
            open(ep, 'w', encoding='utf-8').write(previo)
        elif os.path.exists(ep):
            os.remove(ep)
        h = os.path.join(C, 'index.html')
        if os.path.exists(h):
            os.remove(h)
    hechos = [e for e in estilos if os.path.exists(os.path.join(salida, e + '.png'))]
    if not hechos:
        return
    cols = 5; tw, th = 360, 640; filas = (len(hechos) + cols - 1) // cols; et = 34
    hoja = Image.new('RGB', (cols * tw, filas * (th + et)), (16, 16, 20)); dw = ImageDraw.Draw(hoja)
    try:
        fnt = ImageFont.truetype(os.path.join(T, '..', 'fonts', 'Nunito-Bold.ttf'), 22)
    except Exception:
        fnt = ImageFont.load_default()
    for i, e in enumerate(hechos):
        im = Image.open(os.path.join(salida, e + '.png')).convert('RGB').resize((tw, th), Image.LANCZOS)
        x, y = (i % cols) * tw, (i // cols) * (th + et); hoja.paste(im, (x, y + et)); dw.text((x + 10, y + 5), f'{ORDEN.index(e) + 1 if e in ORDEN else i + 1:02d} {e}', fill=(240, 240, 240), font=fnt)
    out = os.path.join(P, '07_QC', 'muestra_estilos.jpg'); hoja.save(out, quality=90); print('hoja:', out, hoja.size)


if __name__ == '__main__':
    main()
