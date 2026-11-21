#!/usr/bin/env python3
# v2.4 · Añade a una hoja de prueba / de contacto la FICHA del vídeo: modo, duración final y la casilla «Resultado FB 24 h»
# con dos campos para rellenar a mano tras 24 h en Facebook: tiempo promedio de reproducción (meta: más de 20 s) y
# reproducciones de 3 s / visualizaciones (meta: más del 50 %).
# Uso: python3 -I tools/ficha_hoja.py hoja.jpg <modo> <duración_s | "estimada 92">   (sobrescribe la imagen)
import sys

from PIL import Image, ImageDraw, ImageFont

FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'


def fuente(path, px):
    try:
        return ImageFont.truetype(path, px)
    except Exception:
        return ImageFont.load_default()


def ficha(img_path, modo, dur):
    im = Image.open(img_path).convert('RGB'); W, H = im.size
    k = max(0.5, W / 1800); bh = int(250 * k)
    out = Image.new('RGB', (W, H + bh), (14, 16, 24)); out.paste(im, (0, 0)); d = ImageDraw.Draw(out)
    f1, f2, f3 = fuente(FB, int(34 * k)), fuente(FR, int(28 * k)), fuente(FB, int(28 * k))
    try:
        dtxt = f'{float(str(dur).replace(",", ".")):.1f} s'.replace('.', ',')
    except ValueError:
        dtxt = str(dur)
    m = int(24 * k); y = H + m
    d.text((m, y), f'Modo: {modo}   ·   Duración final: {dtxt}', font=f1, fill=(255, 255, 255))
    y += int(56 * k); bx0, bx1 = m, W - m
    d.rectangle([bx0, y, bx1, H + bh - m], outline=(255, 210, 63), width=max(2, int(3 * k)))
    d.text((bx0 + m, y + int(14 * k)), 'Resultado FB 24 h', font=f3, fill=(255, 210, 63))
    col = (bx1 - bx0) // 2
    for i, (lab, meta) in enumerate((('Tiempo promedio de reproducción: ______ s', 'meta: más de 20 s'), ('Reproducciones de 3 s / visualizaciones: ______ %', 'meta: más del 50 %'))):
        x = bx0 + m + i * col; yy = y + int(62 * k)
        d.text((x, yy), lab, font=f2, fill=(235, 238, 245)); d.text((x, yy + int(40 * k)), meta, font=f2, fill=(160, 170, 190))
    out.save(img_path, quality=92)


if __name__ == '__main__':
    if len(sys.argv) < 4:
        sys.exit('Uso: ficha_hoja.py hoja.jpg <modo> <duración>')
    ficha(sys.argv[1], sys.argv[2], sys.argv[3])
