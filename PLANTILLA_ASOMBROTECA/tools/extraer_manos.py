#!/usr/bin/env python3
# v1.35 · Recorta una HOJA DE MANOS ilustradas (fondo oscuro liso, 7 columnas × 3 filas, rótulos debajo) en sprites con fondo
# transparente y genera motor/manos.js (window.MANOS_IMG = { nombre: { src: 'data:image/webp;base64,…', w, h, punta: [x, y] } }).
# Uso: python3 -I PLANTILLA_ASOMBROTECA/tools/extraer_manos.py HOJA.png [--escala 2] [--nombres a,b,c…]
#   · detecta las filas y columnas por los huecos de fondo; el orden de --nombres es de izquierda a derecha y de arriba abajo;
#   · alfa suave por distancia de color al fondo local de cada celda, sin halo (el color se «des-mezcla» del fondo);
#   · --escala amplía con Lanczos (2 por defecto). Si la hoja llega en más resolución, basta con volver a ejecutarlo.
#   · «punta» = punto del dedo que señala (para anclar P.manoImg con { ancla: 'punta' }), calculado en las poses que señalan.
import argparse, base64, io, json, os, sys
import numpy as np
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOMBRES = ('frente,abierta,paz,ok,pulgar_arriba,pulgar_abajo,puno,'
           'lado_izquierdo,lado_derecho,dorso,palma,apunta_derecha,apunta_izquierda,sujeta_celular,'
           'escribe,sostiene_taza,sostiene_tarjeta,palma_arriba,palma_abajo,pinza,garra')
# dónde está la punta del dedo que señala: 'arriba' (punto más alto), 'derecha', 'izquierda'
PUNTA = {'frente': 'arriba', 'lado_izquierdo': 'arriba', 'lado_derecho': 'arriba', 'apunta_derecha': 'derecha', 'apunta_izquierda': 'izquierda'}


def tramos(v, minimo, ancho_min):
    out, on = [], False
    for i, x in enumerate(v):
        if x > minimo and not on:
            on, i0 = True, i
        if x <= minimo and on:
            on = False
            if i - i0 >= ancho_min:
                out.append((i0, i))
    if on and len(v) - i0 >= ancho_min:
        out.append((i0, len(v)))
    return out


def piezas(m):
    # componentes conexas (4-vecinos); se conservan las que miden ≥ 3 % de la mayor, ensanchadas 2 px para no cortar el borde suave
    h, w = m.shape; lab = np.zeros((h, w), np.int32); tam = [0]; n = 0
    for y0 in range(h):
        for x0 in np.nonzero(m[y0] & (lab[y0] == 0))[0]:
            if lab[y0, x0]:
                continue
            n += 1; pila = [(y0, x0)]; lab[y0, x0] = n; c = 0
            while pila:
                y, x = pila.pop(); c += 1
                for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= yy < h and 0 <= xx < w and m[yy, xx] and not lab[yy, xx]:
                        lab[yy, xx] = n; pila.append((yy, xx))
            tam.append(c)
    if n == 0:
        return np.ones((h, w), np.float32)
    big = max(tam); ok = np.array([t >= 0.03 * big for t in tam]); ok[0] = False; k = ok[lab]
    for _ in range(2):
        k = k | np.roll(k, 1, 0) | np.roll(k, -1, 0) | np.roll(k, 1, 1) | np.roll(k, -1, 1)
    return k.astype(np.float32)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('hoja'); ap.add_argument('--escala', type=float, default=2.0)
    ap.add_argument('--nombres', default=NOMBRES); ap.add_argument('--salida', default=os.path.join(RAIZ, 'motor', 'manos.js'))
    ap.add_argument('--pngs', default=os.path.join(RAIZ, 'manos'))
    a = ap.parse_args(); nombres = a.nombres.split(',')
    im = np.asarray(Image.open(a.hoja).convert('RGB')).astype(np.float32); H, W, _ = im.shape
    esq = np.concatenate([im[:8, :8].reshape(-1, 3), im[:8, -8:].reshape(-1, 3), im[-8:, :8].reshape(-1, 3), im[-8:, -8:].reshape(-1, 3)])
    bg0 = np.median(esq, 0); d0 = np.sqrt(((im - bg0) ** 2).sum(2)); m0 = d0 > 40
    # filas de dibujo (las bandas altas); los rótulos son bandas bajas (< 45 px a la escala de la hoja de 1024 px)
    filas = [f for f in tramos(m0.sum(1), 3, 4) if f[1] - f[0] > H * 0.12]
    celdas = []
    for (y0, y1) in filas:
        ya, yb = max(0, y0 - 6), min(H, y1 + 6)
        for (x0, x1) in tramos(m0[ya:yb].sum(0), 0, 8):
            celdas.append((max(0, x0 - 6), ya, min(W, x1 + 6), yb))
    if len(celdas) != len(nombres):
        sys.exit(f'ERROR: {len(celdas)} manos detectadas y {len(nombres)} nombres (usa --nombres)')
    os.makedirs(a.pngs, exist_ok=True); datos = {}
    for nom, (x0, y0, x1, y1) in zip(nombres, celdas):
        c = im[y0:y1, x0:x1]
        borde = np.concatenate([c[:3].reshape(-1, 3), c[-3:].reshape(-1, 3), c[:, :3].reshape(-1, 3), c[:, -3:].reshape(-1, 3)])
        bg = np.median(borde, 0); d = np.sqrt(((c - bg) ** 2).sum(2))
        al = np.clip((d - 10) / 34, 0, 1)
        al *= piezas(al > 0.3)   # quita astillas de las manos vecinas: solo las piezas grandes
        # recorte ajustado al dibujo
        ys, xs = np.where(al > 0.5); ya, yb, xa, xb = max(0, ys.min() - 3), min(c.shape[0], ys.max() + 4), max(0, xs.min() - 3), min(c.shape[1], xs.max() + 4)
        c, al = c[ya:yb, xa:xb], al[ya:yb, xa:xb]
        # des-mezcla del fondo: color = (c − (1 − α)·fondo) / α
        a3 = np.maximum(al, 1e-3)[..., None]; col = np.clip((c - (1 - a3) * bg) / a3, 0, 255)
        # ampliación premultiplicada (sin halo)
        h, w = al.shape; W2, H2 = round(w * a.escala), round(h * a.escala)
        pm = Image.fromarray((col * al[..., None]).astype(np.uint8)); pa = Image.fromarray((al * 255).astype(np.uint8))
        pm, pa = pm.resize((W2, H2), Image.LANCZOS), pa.resize((W2, H2), Image.LANCZOS)
        A = np.asarray(pa).astype(np.float32) / 255; C = np.asarray(pm).astype(np.float32)
        C = np.clip(C / np.maximum(A, 1e-3)[..., None], 0, 255); C[A < 0.004] = 0
        rgba = Image.fromarray(np.dstack([C, A * 255]).astype(np.uint8), 'RGBA')
        rgba.save(os.path.join(a.pngs, nom + '.png'), optimize=True)
        buf = io.BytesIO(); rgba.save(buf, 'WEBP', quality=92, method=6)
        reg = {'src': 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(), 'w': W2, 'h': H2}
        if nom in PUNTA:
            ys, xs = np.where(A > 0.5)
            if PUNTA[nom] == 'arriba':
                y = ys.min(); fila = xs[ys <= y + 3]; reg['punta'] = [int(fila.mean()), int(y)]
            else:
                x = xs.max() if PUNTA[nom] == 'derecha' else xs.min(); col_ = ys[np.abs(xs - x) <= 3]; reg['punta'] = [int(x), int(col_.mean())]
        datos[nom] = reg
        print(f'{nom:18s} {W2}×{H2}' + (f'  punta {reg["punta"]}' if 'punta' in reg else ''))
    with open(a.salida, 'w', encoding='utf-8') as f:
        f.write('// v1.35 · manos ilustradas (sprites con fondo transparente) generadas por tools/extraer_manos.py desde la hoja de manos.\n'
                '// No editar a mano: vuelve a ejecutar la herramienta. Uso en los episodios: P.manoImg (ver INSTRUCCIONES, v1.35).\n')
        f.write('window.MANOS_IMG = ' + json.dumps(datos, separators=(',', ':')) + ';\n')
    print(f'{a.salida}: {os.path.getsize(a.salida) / 1e6:.1f} MB · PNG en {a.pngs}')


if __name__ == '__main__':
    main()
