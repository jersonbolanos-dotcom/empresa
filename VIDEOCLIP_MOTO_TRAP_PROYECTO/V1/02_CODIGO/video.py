"""Render de video del videoclip (sin audio). Determinista.

uso: python3 video.py <src120.rgb> <salida.mp4> [frames: a,b,c para pruebas -> PNG en carpeta]
"""
import math
import os
import subprocess
import sys
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from timeline import (BEAT, DUR, FPS, H, HITS, INTRO_FLASHES, BASS, SEGMENTS, SRC_FPS,
                      SRC_H, SRC_W, W, b, ease_io, segment_at, smooth, src_speed, src_time)

FONT_BLACK_IT = '/usr/share/fonts/opentype/inter/InterDisplay-BlackItalic.otf'
FONT_BLACK = '/usr/share/fonts/opentype/inter/InterDisplay-Black.otf'
FONT_MONO = '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-ExtraBold.ttf'

FRAME_BYTES = SRC_W * SRC_H * 3
G = {}  # estado por proceso


# ----------------------------------------------------------------------------- utilidades
def env_hits(beat, hits, decay):
    v = 0.0
    for h in hits:
        if beat >= h:
            v = max(v, math.exp(-(beat - h) / decay))
    return v


def ramp(beat, pts):
    """interpolacion lineal por puntos [(beat, valor), ...]"""
    if beat <= pts[0][0]:
        return pts[0][1]
    for (b0, v0), (b1, v1) in zip(pts, pts[1:]):
        if beat < b1:
            return v0 + (v1 - v0) * smooth((beat - b0) / (b1 - b0))
    return pts[-1][1]


def noise1(t, seed, freqs=(7.3, 13.1, 23.7)):
    r = np.random.default_rng(seed)
    ph = r.uniform(0, 2 * np.pi, len(freqs))
    return sum(math.sin(2 * math.pi * f * t + p) / (i + 1) for i, (f, p) in enumerate(zip(freqs, ph))) / 1.83


def box_blur_x(a, r):
    if r < 1:
        return a
    r = int(r)
    c = np.cumsum(np.pad(a, ((0, 0), (r + 1, r)) + ((0, 0),) * (a.ndim - 2), mode='edge'), axis=1)
    return (c[:, 2 * r + 1:] - c[:, :-2 * r - 1]) / (2 * r + 1)


def box_blur(a, r):
    a = box_blur_x(a, r)
    return np.swapaxes(box_blur_x(np.swapaxes(a, 0, 1), r), 0, 1)


def up(a, size, mode=Image.BILINEAR):
    """reescala array float HxW (o HxWx3) a size=(w,h)"""
    if a.ndim == 2:
        return np.asarray(Image.fromarray(a.astype(np.float32), 'F').resize(size, mode))
    return np.stack([up(a[..., i], size, mode) for i in range(a.shape[2])], -1)


# ----------------------------------------------------------------------------- recursos
def tile_noise(h, w, beta, seed):
    r = np.random.default_rng(seed)
    n = r.standard_normal((h, w))
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.fftfreq(w)[None, :]
    f = np.sqrt(fx ** 2 + fy ** 2)
    f[0, 0] = 1
    out = np.real(np.fft.ifft2(np.fft.fft2(n) / f ** beta))
    out = (out - out.mean()) / out.std()
    return out.astype(np.float32)


def metal_text(txt, size, font=FONT_BLACK_IT, track=0, red_glow=True):
    """sprite RGBA float (0..1) de texto cromado con borde rojo y sombra"""
    f = ImageFont.truetype(font, size)
    pad = int(size * 0.35)
    chars = list(txt)
    widths = [f.getbbox(c)[2] - f.getbbox(c)[0] for c in chars]
    tw = sum(widths) + track * (len(chars) - 1)
    asc, desc = f.getmetrics()
    th = asc + desc
    Wt, Ht = tw + 2 * pad, th + 2 * pad
    m = Image.new('L', (Wt, Ht), 0)
    d = ImageDraw.Draw(m)
    x = pad
    for c, wc in zip(chars, widths):
        d.text((x - f.getbbox(c)[0], pad), c, font=f, fill=255)
        x += wc + track
    bb = m.getbbox()
    mask = np.asarray(m, np.float32) / 255
    y0, y1 = bb[1], bb[3]
    yy = np.linspace(0, 1, Ht)[:, None]
    rel = np.clip((yy * Ht - y0) / max(1, (y1 - y0)), 0, 1)
    # cromo: cielo claro arriba, linea de horizonte oscura, reflejo de suelo abajo
    chrome = np.interp(rel, [0, 0.08, 0.42, 0.50, 0.53, 0.80, 1.0],
                       [0.98, 0.92, 0.70, 0.30, 0.55, 0.80, 0.55])
    chrome = np.broadcast_to(chrome, (Ht, Wt))
    # relieve: gradiente de la mascara suavizada
    sm = np.asarray(m.filter(ImageFilter.GaussianBlur(size * 0.018)), np.float32) / 255
    gy, gx = np.gradient(sm)
    bevel = np.clip(-(gx + gy) * size * 0.06, -0.35, 0.45)
    base = np.clip(chrome + bevel, 0, 1)
    rgb = np.stack([base * 1.0, base * 0.985, base * 0.99], -1)
    # borde rojo fino
    edge = np.asarray(m.filter(ImageFilter.MaxFilter(5)), np.float32) / 255 - mask
    edge = np.clip(edge, 0, 1)
    red = np.array([0.86, 0.03, 0.05], np.float32)
    col = rgb * mask[..., None] + red * edge[..., None]
    a = np.clip(mask + edge, 0, 1)
    # resplandor rojo + sombra
    glow = np.asarray(m.filter(ImageFilter.GaussianBlur(size * 0.09)), np.float32) / 255
    shadow = np.asarray(m.filter(ImageFilter.GaussianBlur(size * 0.04)), np.float32) / 255
    shadow = np.roll(shadow, (int(size * 0.03), int(size * 0.02)), (0, 1))
    return {'col': col.astype(np.float32), 'a': a.astype(np.float32),
            'glow': (glow * (0.85 if red_glow else 0)).astype(np.float32),
            'shadow': shadow.astype(np.float32), 'mask': mask}


def flat_text(txt, size, font, color, track=0):
    f = ImageFont.truetype(font, size)
    chars = list(txt)
    widths = [f.getbbox(c)[2] - f.getbbox(c)[0] if c != ' ' else size // 3 for c in chars]
    tw = sum(widths) + track * (len(chars) - 1)
    asc, desc = f.getmetrics()
    m = Image.new('L', (tw + 8, asc + desc + 8), 0)
    d = ImageDraw.Draw(m)
    x = 4
    for c, wc in zip(chars, widths):
        if c != ' ':
            d.text((x - f.getbbox(c)[0], 4), c, font=f, fill=255)
        x += wc + track
    m = m.crop(m.getbbox())
    a = np.asarray(m, np.float32) / 255
    return {'col': np.broadcast_to(np.array(color, np.float32), a.shape + (3,)).copy(), 'a': a}


def init_worker(src_path):
    n = os.path.getsize(src_path) // FRAME_BYTES
    G['src'] = np.memmap(src_path, np.uint8, 'r', shape=(n, SRC_H, SRC_W, 3))
    G['n'] = n
    # LUT de curva (toe que conserva detalle en negros)
    x = np.linspace(0, 1, 1024, dtype=np.float32)
    y = np.clip((x - 0.035) / 0.93, 0, 1)
    y = 0.75 * (y * y * (3 - 2 * y)) + 0.25 * y ** 1.15
    y = 0.014 + 0.976 * y
    G['lut'] = y.astype(np.float32)
    # grano mono (banco)
    r = np.random.default_rng(11)
    G['grain'] = [up(r.standard_normal((H // 2, W // 2)).astype(np.float32), (W, H), Image.BICUBIC).astype(np.float16)
                  for _ in range(6)]
    # vineta
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    rr = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.46) / (H * 0.60)) ** 2)
    G['vig'] = np.clip(rr, 0, 1.6).astype(np.float32)
    # humo (texturas tileables)
    G['smokeA'] = tile_noise(320, 180, 1.35, 3)
    G['smokeB'] = tile_noise(320, 180, 1.0, 4)
    # semitono: mapa de distancias de una celda
    cell = 12
    cy, cx = np.mgrid[0:cell, 0:cell].astype(np.float32) + 0.5
    G['cell'] = cell
    G['dist'] = np.tile(np.sqrt((cx - cell / 2) ** 2 + (cy - cell / 2) ** 2), (H // cell + 1, W // cell + 1))[:H, :W]
    # tipografia
    G['t125'] = metal_text('125', 470)
    G['t125s'] = metal_text('125', 400)
    G['tfi'] = flat_text('F I', 70, FONT_MONO, (0.90, 0.05, 0.07), track=34)
    G['lock125'] = flat_text('125', 78, FONT_BLACK, (0.96, 0.96, 0.96))
    G['lockfi'] = flat_text('FI', 34, FONT_MONO, (0.90, 0.05, 0.07), track=14)
    # brasas
    r = np.random.default_rng(21)
    N = 70
    G['emb'] = dict(x=r.uniform(0, W, N), v=r.uniform(0.05, 0.16, N), ph=r.uniform(0, 1, N),
                    sw=r.uniform(10, 45, N), sf=r.uniform(0.3, 1.2, N), br=r.uniform(0.4, 1.0, N),
                    gold=r.uniform(0, 1, N) < 0.3)


# ----------------------------------------------------------------------------- etapas
def fetch(ts, span):
    """frame de origen promediando el obturador (motion blur real)"""
    src, n = G['src'], G['n']
    k = int(np.clip(round(span * SRC_FPS), 1, 16))
    times = [ts] if k == 1 else np.linspace(ts - span / 2, ts + span / 2, k)
    idx = sorted(set(int(np.clip(round(t * SRC_FPS), 0, n - 1)) for t in times))
    acc = np.zeros((SRC_H, SRC_W, 3), np.float32)
    for i in idx:
        acc += src[i]
    return acc / (255.0 * len(idx))


def grade(x, exposure=1.0):
    x = x * exposure
    r, g, bb = x[..., 0], x[..., 1], x[..., 2]
    l = 0.2126 * r + 0.7152 * g + 0.0722 * bb
    mx = np.maximum(g, bb)
    redm = np.clip((r - mx) * 4.0, 0, 1)
    tealm = np.clip((np.minimum(g, bb) - r) * 5.0, 0, 1)
    sat = 0.52 + 0.40 * tealm + 0.55 * redm
    x = l[..., None] + (x - l[..., None]) * sat[..., None]
    x = G['lut'][np.clip(x * 1023, 0, 1023).astype(np.int32)]
    l2 = 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]
    sh = ((1 - l2) ** 3)[..., None]
    hi = (l2 ** 2)[..., None]
    x = x + sh * np.array([0.020, -0.006, -0.002], np.float32) + hi * np.array([0.01, 0.005, 0.0], np.float32)
    return np.clip(x, 0, 1)


def bloom_streak(x, bloom, streak):
    l = 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]
    br = np.clip((l - 0.80) / 0.20, 0, 1) ** 2.5
    sw, shh = SRC_W // 4, SRC_H // 4
    small = up(br, (sw, shh), Image.BOX)
    out = x
    if bloom > 0:
        bl = box_blur(box_blur(small, 3), 3)
        out = out + bloom * up(bl, (SRC_W, SRC_H))[..., None] * np.array([1.0, 0.92, 0.9], np.float32)
    if streak > 0:
        st = small
        for _ in range(3):
            st = box_blur_x(st, 22)
        st = st / (st.max() + 1e-6) * min(1.0, small.max() * 1.6)
        core = box_blur_x(small, 6)
        s_up = up(st, (SRC_W, SRC_H))[..., None]
        c_up = up(core, (SRC_W, SRC_H))[..., None]
        out = out + streak * (s_up * np.array([0.95, 0.16, 0.12], np.float32) * 0.9
                              + c_up * np.array([1.0, 0.95, 0.95], np.float32) * 0.15)
    return out


def camera(img_u8, zoom, rot_deg, sx, sy, pan_x, pan_y, ca):
    """transformacion afin (inversa) a 1080x1920 con aberracion cromatica por canal"""
    base = W / SRC_W
    th = math.radians(rot_deg)
    out = []
    pim = Image.fromarray(img_u8)
    chans = pim.split()
    for i, k in enumerate((1 + ca, 1.0, 1 - ca)):
        s = 1.0 / (base * zoom * k)
        a, bq = s * math.cos(th), s * math.sin(th)
        d, e = -s * math.sin(th), s * math.cos(th)
        ocx, ocy = W / 2 + sx, H / 2 + sy
        icx, icy = SRC_W / 2 + pan_x, SRC_H / 2 + pan_y
        c = icx - a * ocx - bq * ocy
        f = icy - d * ocx - e * ocy
        out.append(chans[i].transform((W, H), Image.AFFINE, (a, bq, c, d, e, f), Image.BICUBIC))
    im = Image.merge('RGB', out).filter(ImageFilter.UnsharpMask(radius=2.2, percent=55, threshold=2))
    return np.asarray(im, np.float32) / 255


def screen(base, layer):
    return 1 - (1 - base) * (1 - np.clip(layer, 0, 1))


def add_smoke(img, t, amt):
    if amt <= 0:
        return img
    A, B = G['smokeA'], G['smokeB']
    a = np.roll(A, (int(t * 9) % A.shape[0], int(t * 14) % A.shape[1]), (0, 1))
    bq = np.roll(B, (int(-t * 5) % B.shape[0], int(t * 22) % B.shape[1]), (0, 1))
    m = np.clip(0.55 * a + 0.45 * bq, -1.5, 2.5)
    m = np.clip((m + 0.4) / 2.2, 0, 1) ** 1.6
    yy = np.linspace(0, 1, m.shape[0])[:, None]
    m = m * (0.35 + 0.65 * yy)
    mm = up(m.astype(np.float32), (W, H))[..., None]
    return screen(img, amt * mm * np.array([0.78, 0.80, 0.84], np.float32))


def light_leak(img, t, amt, palette='red', seed=0):
    if amt <= 0.003:
        return img
    gw, gh = 90, 160
    yy, xx = np.mgrid[0:gh, 0:gw].astype(np.float32)
    r = np.random.default_rng(seed)
    cols = {'red': [(1.0, 0.12, 0.05), (1.0, 0.35, 0.08)],
            'gold': [(1.0, 0.62, 0.22), (1.0, 0.30, 0.08)]}[palette]
    acc = np.zeros((gh, gw, 3), np.float32)
    for k in range(3):
        cx = gw * (r.uniform(-0.2, 1.2) + 0.35 * math.sin(t * r.uniform(0.6, 1.4) + k))
        cy = gh * (r.uniform(0.0, 1.0) + 0.15 * math.cos(t * r.uniform(0.4, 1.1) + 2 * k))
        sg = r.uniform(25, 55)
        g = np.exp(-(((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * sg ** 2)))
        acc += g[..., None] * np.array(cols[k % 2], np.float32)
    return screen(img, amt * up(acc, (W, H)))


def embers(img, t, amt):
    if amt <= 0:
        return img
    e = G['emb']
    gw, gh = 270, 480
    buf = np.zeros((gh, gw, 3), np.float32)
    yy = (1.15 - ((t * e['v'] + e['ph']) % 1.3)) * H
    xx = e['x'] + np.sin(t * e['sf'] * 2 + e['ph'] * 9) * e['sw']
    fl = 0.6 + 0.4 * np.sin(t * 17 * e['sf'] + e['ph'] * 30)
    for i in range(len(xx)):
        px, py = int(xx[i] / 4), int(yy[i] / 4)
        if 1 <= px < gw - 1 and 1 <= py < gh - 1:
            col = (1.0, 0.62, 0.20) if e['gold'][i] else (1.0, 0.25, 0.06)
            buf[py, px] += np.array(col) * e['br'][i] * fl[i] * 3.2
    buf = box_blur(buf, 1)
    return screen(img, amt * up(buf, (W, H)))


def rgb_split(img, px):
    px = int(round(px))
    if px == 0:
        return img
    out = img.copy()
    out[..., 0] = np.roll(img[..., 0], px, 1)
    out[..., 2] = np.roll(img[..., 2], -px, 1)
    return out


def glitch(img, fi, amt):
    if amt <= 0.02:
        return img
    r = np.random.default_rng(1000 + fi)
    out = img.copy()
    nb = int(4 + 14 * amt)
    for _ in range(nb):
        y0 = r.integers(0, H - 10)
        hh = int(r.integers(6, int(20 + 140 * amt)))
        dx = int(r.normal(0, 90 * amt))
        sl = out[y0:y0 + hh]
        sl[:] = np.roll(sl, dx, 1)
        if r.uniform() < 0.35:
            sl[..., 0] = np.roll(sl[..., 0], int(r.normal(0, 30 * amt)), 1)
        if r.uniform() < 0.18 * amt:
            sl[:] = sl * np.array([1.0, 0.15, 0.15], np.float32) + np.array([0.25, 0, 0], np.float32)
        if r.uniform() < 0.08 * amt:
            sl[:] = 1 - sl
    for _ in range(int(3 * amt)):  # bloques copiados (datamosh)
        bw, bh = int(r.integers(80, 400)), int(r.integers(20, 120))
        x0, y0 = int(r.integers(0, W - bw)), int(r.integers(0, H - bh))
        x1, y1 = int(r.integers(0, W - bw)), int(r.integers(0, H - bh))
        out[y1:y1 + bh, x1:x1 + bw] = out[y0:y0 + bh, x0:x0 + bw]
    if amt > 0.4:
        out[::3] *= 0.82
    return np.clip(out, 0, 1)


def halftone(img, mix):
    if mix <= 0:
        return img
    cell = G['cell']
    l = 0.2126 * img[..., 0] + 0.7152 * img[..., 1] + 0.0722 * img[..., 2]
    small = np.asarray(Image.fromarray(l.astype(np.float32), 'F').resize((W // cell + 1, H // cell + 1), Image.BOX))
    rad = np.sqrt(np.clip(small, 0, 1)) * cell * 0.72
    rad = np.kron(rad, np.ones((cell, cell), np.float32))[:H, :W]
    dot = np.clip(rad - G['dist'] + 0.5, 0, 1)
    ll = np.clip((l - 0.04) / 0.85, 0, 1)
    duo = np.stack([np.interp(ll, [0, 0.5, 1], [0.02, 0.78, 1.0]),
                    np.interp(ll, [0, 0.5, 1], [0.0, 0.03, 0.94]),
                    np.interp(ll, [0, 0.5, 1], [0.0, 0.05, 0.90])], -1).astype(np.float32)
    poster = duo * (0.22 + 0.78 * dot[..., None])
    return img * (1 - mix) + poster * mix


def paste(img, spr, cx, cy, scale=1.0, alpha=1.0, shine=None, glow_amt=1.0):
    """compone sprite (metal_text / flat_text) centrado en (cx,cy)"""
    if alpha <= 0.003:
        return img
    col, a = spr['col'], spr['a']
    hs, ws = a.shape
    if abs(scale - 1) > 1e-3:
        nw, nh = max(2, int(ws * scale)), max(2, int(hs * scale))
        a = up(a, (nw, nh))
        col = up(col, (nw, nh))
        glow = up(spr['glow'], (nw, nh)) if 'glow' in spr else None
        sh = up(spr['shadow'], (nw, nh)) if 'shadow' in spr else None
    else:
        glow, sh = spr.get('glow'), spr.get('shadow')
    hs, ws = a.shape
    x0, y0 = int(cx - ws / 2), int(cy - hs / 2)
    X0, Y0, X1, Y1 = max(0, x0), max(0, y0), min(W, x0 + ws), min(H, y0 + hs)
    if X1 <= X0 or Y1 <= Y0:
        return img
    sx, sy = X0 - x0, Y0 - y0
    region = img[Y0:Y1, X0:X1]
    aa = a[sy:sy + Y1 - Y0, sx:sx + X1 - X0][..., None] * alpha
    cc = col[sy:sy + Y1 - Y0, sx:sx + X1 - X0]
    if shine is not None:   # barrido de brillo diagonal sobre el cromo
        yy, xx = np.mgrid[sy:sy + Y1 - Y0, sx:sx + X1 - X0]
        u = (xx + yy * 0.45) / (ws + hs * 0.45)
        band = np.exp(-((u - shine) / 0.035) ** 2)[..., None]
        cc = np.clip(cc + band * 0.9, 0, 1)
    if sh is not None:
        s = sh[sy:sy + Y1 - Y0, sx:sx + X1 - X0][..., None] * alpha
        region = region * (1 - 0.75 * s)
    if glow is not None and glow_amt > 0:
        g = glow[sy:sy + Y1 - Y0, sx:sx + X1 - X0][..., None] * alpha * glow_amt
        region = screen(region, g * np.array([0.95, 0.05, 0.04], np.float32))
    region = region * (1 - aa) + cc * aa
    img[Y0:Y1, X0:X1] = region
    return img


def slam(beat, b0, frames=4):
    """entrada contundente: escala 1.9 -> 1.0 en n frames, con alfa"""
    dtf = (beat - b0) * BEAT * FPS
    if dtf < 0:
        return None
    p = min(1.0, dtf / frames)
    return 1.0 + 0.9 * (1 - p) ** 2, min(1.0, 0.25 + p)


# ----------------------------------------------------------------------------- frame
def render_frame(fi):
    t = fi / FPS
    beat = t / BEAT
    ts, seg = src_time(t)
    name = seg[5] if seg else 'intro'
    spd = src_speed(t) if seg else 0.0

    # --- parametros de camara por seccion
    zoom, rot, panx, pany, dirblur = 1.06, 0.0, 0.0, 0.0, 0
    if name == 'asiento':
        p = (beat - 4) / 5
        zoom, rot = 1.10 + 0.16 * smooth(p), -1.6 + 2.0 * p
    elif name == 'whip':
        p = (beat - 9)
        sw = math.sin(math.pi * p)
        zoom, rot, panx = 1.18 + 0.10 * sw, 0.4 - 2.5 * sw, -55 * math.sin(math.pi * p) * (1 if p < 0.5 else -0.4)
        dirblur = 26 * sw ** 1.5
    elif name == 'fi':
        p = (beat - 10) / 2
        zoom, rot = 1.12 + 0.06 * p, 1.2 - 1.6 * p
    elif name == 'faro':
        p = (beat - 12) / 6
        zoom, rot = 1.10 + 0.22 * smooth(p), -0.8 + 1.2 * p
    elif name == 'reveal':
        p = (beat - 18) / 2
        zoom, rot = 1.30 - 0.24 * p ** 1.4, 0.5 - 1.5 * p
    elif name == 'freeze':
        p = (beat - 20) / 2
        zoom, rot = 1.06 + 0.05 * p, -1.0 + 0.4 * p
    elif name == 'beat':
        p = (beat - 22) / 8
        zoom, rot = 1.06 + 0.12 * smooth(p), -0.6 + 1.0 * math.sin(p * 2.2)
    elif name == 'frenada':
        p = (beat - 30) / 2
        zoom, rot = 1.18 + 0.14 * smooth(p), 0.4 + 1.2 * p
    elif name == 'poster':
        p = (beat - 32) / 4
        zoom, rot = 1.12 + 0.08 * p, 1.6 - 0.4 * p

    # punch de zoom y shake en golpes
    boom = env_hits(beat, HITS['boom'], 0.9)
    metal = env_hits(beat, HITS['metal'], 0.5)
    snare = env_hits(beat, HITS['snare'], 0.35)
    gl = env_hits(beat, HITS['glitch'], 0.22)
    b808 = env_hits(beat, [x[0] for x in BASS if 22 <= x[0] < 30], 0.25)
    zoom += 0.11 * env_hits(beat, HITS['boom'], 0.35) + 0.05 * env_hits(beat, HITS['metal'], 0.25) + 0.02 * b808
    shake = 34 * boom + 16 * metal + 12 * snare + 5 * b808 + 2.0
    sx = shake * noise1(t, 1)
    sy = shake * noise1(t, 2)
    rot += 0.035 * shake * noise1(t, 3, (3.1, 5.7, 9.2))
    zoom = max(zoom, 1.04 + abs(rot) * 0.03 + shake / 900)
    ca = 0.0016 + 0.006 * boom + 0.004 * gl + (0.0015 if name == 'faro' else 0)

    # --- imagen base
    exposure = 1.0
    bloom, streak = 0.15, 0.15
    if name in ('faro',):
        bloom, streak, exposure = 0.22, 0.65, 0.80
    elif name in ('reveal', 'freeze', 'beat', 'frenada', 'poster'):
        bloom, streak, exposure = 0.16, 0.40, 0.88
    elif name == 'asiento':
        exposure = 1.18
    if seg is not None:
        span = abs(spd) * (1.0 / FPS) * 0.5
        x = fetch(ts, span)
        x = grade(x, exposure)
        if dirblur > 0:
            x = box_blur_x(x, dirblur)
        x = bloom_streak(x, bloom, streak)
        img = camera((np.clip(x, 0, 1) * 255).astype(np.uint8), zoom, rot, sx, sy, panx, pany, ca)
        frame_alpha = 1.0
    else:
        # intro: negro con destellos del faro (cortes stroboscopicos)
        img = np.zeros((H, W, 3), np.float32)
        frame_alpha = 0.0
        for bf, nfr, st in INTRO_FLASHES:
            df = (beat - bf) * BEAT * FPS
            if 0 <= df < nfr:
                x = grade(fetch(st, 0.0), 1.15)
                x = bloom_streak(x, 0.35, 0.9)
                img = camera((np.clip(x, 0, 1) * 255).astype(np.uint8), 1.35 + 0.05 * df, 2.5 - bf, 0, 0,
                             0, 0, 0.008)
                frame_alpha = 1.0 - df / (nfr + 0.5)
                img *= frame_alpha
                gl = max(gl, 0.7)
                break

    # --- capas atmosfericas
    smoke = {'intro': 0.10, 'asiento': 0.10, 'whip': 0.08, 'fi': 0.10, 'faro': 0.26, 'reveal': 0.20,
             'freeze': 0.22, 'beat': 0.14, 'frenada': 0.18, 'poster': 0.12}[name]
    img = add_smoke(img, t, smoke)
    leak = 0.22 * env_hits(beat, [4], 1.0) + 0.30 * env_hits(beat, [20], 0.8) + 0.18 * env_hits(beat, [32], 1.2)
    if leak > 0:
        img = light_leak(img, t, leak, 'red', seed=int(beat < 10) + 2 * int(beat >= 30))
    if name == 'faro':
        img = light_leak(img, t, 0.10 + 0.06 * math.sin((beat - 12) * 0.9), 'gold', seed=7)
    emb = {'faro': 0.9, 'reveal': 0.6, 'freeze': 1.0, 'beat': 0.5, 'frenada': 0.6, 'poster': 0.8}.get(name, 0)
    img = embers(img, t, emb)

    # --- estilizacion de congelados
    if name == 'freeze':
        img = halftone(img, 0.30 * math.exp(-(beat - 20) / 0.18) + 0.10)
    if name == 'poster':
        img = halftone(img, min(1.0, 0.35 + (beat - 32) * 3))

    # --- tipografia
    if name == 'freeze' or (name == 'beat' and beat < 22.5):
        s = slam(beat, 20)
        if s:
            sc, al = s
            out = 0.0
            if beat >= 22:
                out = (beat - 22) / 0.5
            al *= (1 - out)
            for k in (3, 2, 1):  # estela de entrada
                if sc > 1.02:
                    img = paste(img, G['t125'], W / 2, 1390, sc * (1 + 0.12 * k), al * 0.18 / k, glow_amt=0)
            shine = -0.2 + 1.4 * ((beat - 20.3) / 1.4)
            img = paste(img, G['t125'], W / 2 + sx * 0.5, 1390 + sy * 0.5, sc, al, shine=shine)
            if out > 0:
                img = glitch(img, fi + 50, 0.9 * out + 0.4)
    if name in ('beat', 'frenada') and beat >= 22.5:
        p = min(1.0, (beat - 22.5) / 0.35)
        al = p * (1 - max(0.0, (beat - 31.0) / 1.0))
        xoff = -60 * (1 - p) ** 2
        y = 200
        img[y - 8:y + 92, int(70 + xoff):int(76 + xoff)] = img[y - 8:y + 92, int(70 + xoff):int(76 + xoff)] * (1 - al) + np.array([0.9, 0.04, 0.06]) * al
        img = paste(img, G['lock125'], 92 + xoff + G['lock125']['a'].shape[1] / 2, y + 30, 1.0, al)
        img = paste(img, G['lockfi'], 94 + xoff + G['lockfi']['a'].shape[1] / 2, y + 86, 1.0, al)
    if name == 'poster':
        s = slam(beat, 32, 5)
        if s:
            sc, al = s
            fade = 1 - smooth((beat - 35.2) / 0.6)
            al *= fade
            for k in (3, 2, 1):
                if sc > 1.02:
                    img = paste(img, G['t125s'], W / 2, 1360, sc * (1 + 0.12 * k), al * 0.18 / k, glow_amt=0)
            img = paste(img, G['t125s'], W / 2 + sx * 0.4, 1360 + sy * 0.4, sc, al,
                        shine=-0.2 + 1.4 * ((beat - 32.4) / 1.6))
            p2 = smooth((beat - 32.5) / 0.5) * fade
            img = paste(img, G['tfi'], W / 2, 1105, 1.0, p2)
            # filetes rojos
            ln = int(380 * p2)
            if ln > 2:
                for yy_ in (1105,):
                    img[yy_ - 2:yy_ + 2, W // 2 - 140 - ln:W // 2 - 140] = [0.9, 0.04, 0.06]
                    img[yy_ - 2:yy_ + 2, W // 2 + 140:W // 2 + 140 + ln] = [0.9, 0.04, 0.06]

    # --- glitch / rgb split
    gamt = gl
    if name == 'freeze' and beat < 20.15:
        gamt = max(gamt, 0.5)
    img = glitch(img, fi, gamt)
    img = rgb_split(img, 16 * gl + 9 * boom + 3 * b808)

    # --- flashes
    fl = env_hits(beat, HITS['boom'], 0.09)
    if fl > 0.01:
        img = img * (1 - fl) + fl
    redf = 1.0 if 0 <= (beat - 12) * BEAT * FPS < 2 else 0.0
    if redf:
        img = img * 0.35 + np.array([0.75, 0.02, 0.03], np.float32) * 0.65

    # --- vineta, grano, letterbox, fundido final
    vig = 0.55 if name == 'faro' else 0.45
    img = img * (1 - vig * np.clip(G['vig'] - 0.45, 0, 1)[..., None])
    gr = G['grain'][fi % 6].astype(np.float32)
    l = 0.2126 * img[..., 0] + 0.7152 * img[..., 1] + 0.0722 * img[..., 2]
    gamp = (0.075 if name == 'poster' else 0.05) * (1 - 0.55 * l)
    img = img + (gr * gamp)[..., None]

    bar = ramp(beat, [(0, 260), (4, 260), (6, 110), (12, 110), (12.5, 190), (18, 190), (20, 0),
                      (22, 0), (23, 70), (30, 70), (32, 300), (32.01, 0)])
    bar = int(bar)
    if bar > 0:
        img[:bar] = 0
        img[H - bar:] = 0
    fade = smooth((beat - 35.4) / 0.6)
    if fade > 0:
        img = img * (1 - fade)
    return (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)


# ----------------------------------------------------------------------------- main
def main():
    src_path, out = sys.argv[1], sys.argv[2]
    nfr = int(round(DUR * FPS))
    if len(sys.argv) > 3:
        os.makedirs(out, exist_ok=True)
        init_worker(src_path)
        for spec in sys.argv[3].split(','):
            fi = int(round(float(spec) * FPS))
            Image.fromarray(render_frame(fi)).save(os.path.join(out, f'f{fi:04d}.png'))
            print('ok', fi, flush=True)
        return
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                            '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-maxrate', '28M', '-bufsize', '56M',
                            '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709',
                            '-color_trc', 'bt709', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    with Pool(4, initializer=init_worker, initargs=(src_path,)) as pool:
        for i, fr in enumerate(pool.imap(render_frame, range(nfr), chunksize=2)):
            enc.stdin.write(fr.tobytes())
            if i % 30 == 0:
                print(f'frame {i}/{nfr}', flush=True)
    enc.stdin.close()
    enc.wait()
    print('listo', out, nfr)


if __name__ == '__main__':
    main()
