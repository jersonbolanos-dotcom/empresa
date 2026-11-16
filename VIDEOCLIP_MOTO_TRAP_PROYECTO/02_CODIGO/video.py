"""Render de video · V2 look de pelicula de accion de autos (sin audio). Determinista.

uso: python3 video.py <src120.rgb> <salida.mp4>            render completo
     python3 video.py <src120.rgb> <carpeta> t1,t2,...     fotogramas de prueba (PNG)
"""
import math
import os
import subprocess
import sys
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from timeline import (BEAT, DUR, FADE_IN, FADE_OUT, FPS, H, HITS, SRC_FPS, SRC_H, SRC_W, TITLE,
                      TOMS, W, smooth, src_speed, src_time)

FONT_TITLE = '/usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf'
FONT_SMALL = '/usr/share/fonts/opentype/inter/InterDisplay-Medium.otf'
FRAME_BYTES = SRC_W * SRC_H * 3
BAR = 200            # franjas de cine fijas (px arriba y abajo)
G = {}


# ----------------------------------------------------------------------------- utilidades
def env_hits(beat, hits, decay):
    v = 0.0
    for h in hits:
        if beat >= h:
            v = max(v, math.exp(-(beat - h) / decay))
    return v


def noise1(t, seed, freqs=(5.1, 9.7, 17.3)):
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
    if a.ndim == 2:
        return np.asarray(Image.fromarray(a.astype(np.float32), 'F').resize(size, mode))
    return np.stack([up(a[..., i], size, mode) for i in range(a.shape[2])], -1)


def screen(base, layer):
    return 1 - (1 - base) * (1 - np.clip(layer, 0, 1))


def tile_noise(h, w, beta, seed):
    r = np.random.default_rng(seed)
    n = r.standard_normal((h, w))
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.fftfreq(w)[None, :]
    f = np.sqrt(fx ** 2 + fy ** 2)
    f[0, 0] = 1
    out = np.real(np.fft.ifft2(np.fft.fft2(n) / f ** beta))
    return ((out - out.mean()) / out.std()).astype(np.float32)


def text_sprite(txt, size, font, track):
    f = ImageFont.truetype(font, size)
    widths = [(f.getbbox(c)[2] - f.getbbox(c)[0]) if c != ' ' else size // 3 for c in txt]
    tw = sum(widths) + track * (len(txt) - 1)
    asc, desc = f.getmetrics()
    m = Image.new('L', (tw + 40, asc + desc + 40), 0)
    d = ImageDraw.Draw(m)
    x = 20
    for c, wc in zip(txt, widths):
        if c != ' ':
            d.text((x - f.getbbox(c)[0], 20), c, font=f, fill=255)
        x += wc + track
    m = m.crop(m.getbbox())
    a = np.asarray(m, np.float32) / 255
    hh = a.shape[0]
    # acero cepillado: degradado vertical frio + vetas horizontales finas
    yy = np.linspace(0, 1, hh)[:, None]
    steel = np.interp(yy, [0, 0.45, 0.55, 1], [0.95, 0.78, 0.62, 0.86])
    r = np.random.default_rng(5)
    veins = box_blur_x(r.standard_normal((hh, a.shape[1]))[..., None], 30)[..., 0] * 0.6
    base = np.clip(steel + veins * 0.08, 0, 1)
    col = np.stack([base * 0.96, base * 0.99, base * 1.02], -1)
    return {'a': a, 'col': np.clip(col, 0, 1).astype(np.float32)}


def init_worker(src_path):
    n = os.path.getsize(src_path) // FRAME_BYTES
    G['src'] = np.memmap(src_path, np.uint8, 'r', shape=(n, SRC_H, SRC_W, 3))
    G['n'] = n
    x = np.linspace(0, 1, 1024, dtype=np.float32)
    y = np.clip((x - 0.03) / 0.94, 0, 1)
    y = 0.70 * (y * y * (3 - 2 * y)) + 0.30 * y ** 1.1
    G['lut'] = (0.012 + 0.978 * y).astype(np.float32)
    r = np.random.default_rng(11)
    G['grain'] = [up(r.standard_normal((H // 2, W // 2)).astype(np.float32), (W, H), Image.BICUBIC).astype(np.float16)
                  for _ in range(6)]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    rr = np.sqrt(((xx - W / 2) / (W * 0.66)) ** 2 + ((yy - H * 0.48) / (H * 0.56)) ** 2)
    G['vig'] = np.clip(rr - 0.5, 0, 1).astype(np.float32) ** 1.4
    G['haze'] = tile_noise(320, 180, 1.4, 3)
    G['title'] = text_sprite('1 2 5', 150, FONT_TITLE, 40)
    G['sub'] = text_sprite('F I', 44, FONT_SMALL, 30)


# ----------------------------------------------------------------------------- etapas
def fetch(ts, span):
    src, n = G['src'], G['n']
    k = int(np.clip(round(span * SRC_FPS), 1, 16))
    times = [ts] if k == 1 else np.linspace(ts - span / 2, ts + span / 2, k)
    idx = sorted(set(int(np.clip(round(t * SRC_FPS), 0, n - 1)) for t in times))
    acc = np.zeros((SRC_H, SRC_W, 3), np.float32)
    for i in idx:
        acc += src[i]
    return acc / (255.0 * len(idx))


def grade(x, exposure=1.0):
    """look blockbuster turquesa/naranja: sombras frias, piel y luces calidas"""
    x = x * exposure
    l = 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]
    x = l[..., None] + (x - l[..., None]) * 1.08
    x = G['lut'][np.clip(x * 1023, 0, 1023).astype(np.int32)]
    l = 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]
    sh = np.clip(1 - l / 0.55, 0, 1)[..., None] ** 1.5
    hi = np.clip((l - 0.35) / 0.65, 0, 1)[..., None] ** 1.2
    x = x + sh * np.array([-0.035, 0.012, 0.040], np.float32) + hi * np.array([0.060, 0.018, -0.050], np.float32)
    warm = np.clip((x[..., 0] - x[..., 2]) * 3, 0, 1)[..., None]
    x = x + warm * np.array([0.015, 0.004, -0.01], np.float32)
    return np.clip(x, 0, 1)


def flares(x, bloom, streak):
    """bloom calido + destello anamorfico AZUL horizontal sobre las luces"""
    l = 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]
    br = np.clip((l - 0.70) / 0.25, 0, 1) ** 2
    sw, shh = SRC_W // 4, SRC_H // 4
    small = up(br, (sw, shh), Image.BOX)
    out = x
    if bloom > 0:
        bl = box_blur(box_blur(small, 3), 3)
        out = out + bloom * up(bl, (SRC_W, SRC_H))[..., None] * np.array([1.0, 0.86, 0.70], np.float32)
    if streak > 0:
        core = box_blur(np.clip((small - 0.30) / 0.70, 0, 1), 1)
        st = core
        for _ in range(3):
            st = box_blur_x(st, 40)
        st = st / (st.max() + 1e-6) * min(1.0, core.max() * 1.5)
        thin = box_blur_x(core, 90)
        thin = thin / (thin.max() + 1e-6) * min(1.0, core.max())
        s_up = up(st, (SRC_W, SRC_H))[..., None]
        t_up = up(thin, (SRC_W, SRC_H))[..., None]
        out = out + streak * (s_up * np.array([0.25, 0.50, 1.0], np.float32) * 0.75
                              + t_up * np.array([0.55, 0.75, 1.0], np.float32) * 0.6)
    return out


def camera(img_u8, zoom, rot_deg, sx, sy, pan_x, pan_y, ca):
    base = W / SRC_W
    th = math.radians(rot_deg)
    out = []
    chans = Image.fromarray(img_u8).split()
    for i, k in enumerate((1 + ca, 1.0, 1 - ca)):
        s = 1.0 / (base * zoom * k)
        a, bq = s * math.cos(th), s * math.sin(th)
        d, e = -s * math.sin(th), s * math.cos(th)
        ocx, ocy = W / 2 + sx, H / 2 + sy
        icx, icy = SRC_W / 2 + pan_x, SRC_H / 2 + pan_y
        out.append(chans[i].transform((W, H), Image.AFFINE,
                                      (a, bq, icx - a * ocx - bq * ocy, d, e, icy - d * ocx - e * ocy), Image.BICUBIC))
    im = Image.merge('RGB', out).filter(ImageFilter.UnsharpMask(radius=2.2, percent=60, threshold=2))
    return np.asarray(im, np.float32) / 255


def haze(img, t, amt):
    """neblina atmosferica sutil que se ilumina donde hay luz (haz del faro)"""
    if amt <= 0:
        return img
    A = G['haze']
    a = np.roll(A, (int(t * 7) % A.shape[0], int(t * 12) % A.shape[1]), (0, 1))
    m = np.clip((a + 0.5) / 2.4, 0, 1) ** 1.8
    mm = up(m, (W, H))[..., None]
    l = 0.2126 * img[..., 0] + 0.7152 * img[..., 1] + 0.0722 * img[..., 2]
    lit = box_blur(up(l, (90, 160), Image.BOX), 6)
    lit = up(lit, (W, H))[..., None]
    return screen(img, amt * mm * (0.25 + 1.2 * lit) * np.array([0.80, 0.88, 0.95], np.float32))


def intro_streak(img, beat):
    """destello anamorfico azul que se abre en el negro antes del primer plano"""
    if beat >= 3.6:
        return img
    p = smooth(beat / 2.4)
    fade = 1 - smooth((beat - 2.4) / 1.2)
    y0 = int(H * 0.47)
    xx = np.arange(W, dtype=np.float32)[None, :]
    yy = np.arange(H, dtype=np.float32)[:, None]
    half = 40 + 560 * p
    prof = np.exp(-((xx - W / 2) / half) ** 2)
    thick = np.exp(-((yy - y0) / (3 + 5 * p)) ** 2) + 0.35 * np.exp(-((yy - y0) / (40 + 30 * p)) ** 2)
    core = np.exp(-((xx - W / 2) / 30) ** 2) * np.exp(-((yy - y0) / 10) ** 2)
    lay = (thick * prof)[..., None] * np.array([0.30, 0.55, 1.0], np.float32) + core[..., None] * 0.9
    return screen(img, lay * fade * (0.4 + 0.6 * p))


def paste(img, spr, cx, cy, alpha, shine=None):
    if alpha <= 0.003:
        return img
    a, col = spr['a'], spr['col']
    hs, ws = a.shape
    x0, y0 = int(cx - ws / 2), int(cy - hs / 2)
    region = img[y0:y0 + hs, x0:x0 + ws]
    if shine is not None:
        xx = np.arange(ws)[None, :] / ws
        band = np.exp(-((xx - shine) / 0.06) ** 2)[..., None]
        col = np.clip(col + band * 0.6, 0, 1)
    aa = a[..., None] * alpha
    img[y0:y0 + hs, x0:x0 + ws] = region * (1 - aa) + col * aa
    return img


# ----------------------------------------------------------------------------- frame
def render_frame(fi):
    t = fi / FPS
    beat = t / BEAT
    ts, seg = src_time(t)
    name = seg[5] if seg else 'negro'
    spd = src_speed(t) if seg else 0.0

    zoom, rot, panx, dirblur = 1.06, 0.0, 0.0, 0
    if name == 'asiento':
        p = (beat - 2) / 7
        zoom, rot = 1.06 + 0.20 * smooth(p), -1.2 + 1.8 * p
    elif name == 'whip':
        p = beat - 9
        sw = math.sin(math.pi * p)
        zoom, rot, panx = 1.24 + 0.08 * sw, 0.6 - 2.2 * sw, -50 * sw * (1 if p < 0.5 else -0.4)
        dirblur = 24 * sw ** 1.5
    elif name == 'fi':
        p = (beat - 10) / 2
        zoom, rot = 1.12 + 0.07 * p, 1.0 - 1.4 * p
    elif name == 'faro':
        p = (beat - 12) / 6
        zoom, rot = 1.10 + 0.20 * smooth(p), -0.6 + 1.0 * p
    elif name == 'reveal':
        p = (beat - 18) / 2
        zoom, rot = 1.30 - 0.22 * p ** 1.4, 0.4 - 1.4 * p
    elif name == 'heroe':
        p = (beat - 20) / 3
        zoom, rot = 1.08 + 0.07 * smooth(p), -1.0 + 0.8 * smooth(p)
    elif name == 'accion':
        p = (beat - 23) / 7
        zoom, rot = 1.12 + 0.10 * smooth(p), -0.2 + 0.9 * math.sin(p * 2.0)
    elif name == 'frenada':
        p = (beat - 30) / 2
        zoom, rot = 1.22 + 0.10 * smooth(p), 0.5 + 0.8 * p
    elif name == 'final':
        p = (beat - 32) / 2.6
        zoom, rot = 1.32 + 0.06 * p, 1.3 - 0.3 * p

    braam = env_hits(beat, HITS['braam'], 0.8)
    imp = env_hits(beat, HITS['impact'], 0.45)
    tom = env_hits(beat, [x[0] for x in TOMS], 0.3)
    zoom += 0.07 * env_hits(beat, HITS['braam'], 0.4) + 0.035 * env_hits(beat, HITS['impact'], 0.25) + 0.012 * tom
    shake = 18 * braam + 10 * imp + 5 * tom + 1.6
    sx, sy = shake * noise1(t, 1), shake * noise1(t, 2)
    rot += 0.03 * shake * noise1(t, 3, (2.3, 4.1, 7.7))
    zoom = max(zoom, 1.04 + abs(rot) * 0.03 + shake / 900)
    ca = 0.0010 + 0.0025 * braam

    exposure, bloom, streak = 1.0, 0.14, 0.30
    if name == 'asiento':
        exposure = 1.15
    elif name == 'faro':
        exposure, bloom, streak = 0.80, 0.22, 0.95
    elif name in ('reveal', 'heroe', 'accion', 'frenada', 'final'):
        exposure, bloom, streak = 0.86, 0.16, 0.75
    exposure *= 1 + 0.30 * env_hits(beat, HITS['braam'], 0.12)   # la imagen "respira" en el braam

    if seg is not None:
        x = fetch(ts, abs(spd) * (1.0 / FPS) * 0.5)
        x = grade(x, exposure)
        if dirblur > 0:
            x = box_blur_x(x, dirblur)
        x = flares(x, bloom, streak)
        img = camera((np.clip(x, 0, 1) * 255).astype(np.uint8), zoom, rot, sx, sy, panx, 0, ca)
        hz = {'faro': 0.20, 'reveal': 0.14, 'heroe': 0.16, 'accion': 0.10, 'frenada': 0.12,
              'final': 0.14}.get(name, 0.06)
        img = haze(img, t, hz)
    else:
        img = np.zeros((H, W, 3), np.float32)

    fin = smooth((beat - FADE_IN[0]) / (FADE_IN[1] - FADE_IN[0]))
    fout = 1 - smooth((beat - FADE_OUT[0]) / (FADE_OUT[1] - FADE_OUT[0]))
    img = img * min(fin, fout)
    img = intro_streak(img, beat)

    if beat >= TITLE[0]:
        p = (beat - TITLE[0]) / (TITLE[1] - TITLE[0])
        al = smooth(p / 0.35) * (1 - smooth((p - 0.80) / 0.20))
        img = paste(img, G['title'], W / 2, H * 0.48, al, shine=-0.2 + 1.5 * p)
        img = paste(img, G['sub'], W / 2, H * 0.48 + 135, al * 0.85)
        ln = int(260 * smooth(p / 0.5)) if al > 0.01 else 0
        yl = int(H * 0.48 + 88)
        if ln > 2:
            img[yl:yl + 2, W // 2 - ln:W // 2 + ln] = img[yl:yl + 2, W // 2 - ln:W // 2 + ln] * (1 - al) + \
                np.array([0.25, 0.55, 1.0], np.float32) * al

    vig = 0.55 if name == 'faro' else 0.45
    img = img * (1 - vig * G['vig'][..., None])
    l = 0.2126 * img[..., 0] + 0.7152 * img[..., 1] + 0.0722 * img[..., 2]
    img = img + (G['grain'][fi % 6].astype(np.float32) * 0.030 * (1 - 0.6 * l))[..., None]
    img[:BAR] = 0
    img[H - BAR:] = 0
    return (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)


def main():
    src_path, out = sys.argv[1], sys.argv[2]
    nfr = int(round(DUR * FPS))
    if len(sys.argv) > 3:
        os.makedirs(out, exist_ok=True)
        init_worker(src_path)
        for spec in sys.argv[3].split(','):
            fi = int(round(float(spec) * FPS))
            Image.fromarray(render_frame(fi)).save(os.path.join(out, f'f{fi:04d}.png'))
        return
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                            '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
                            '-maxrate', '24M', '-bufsize', '48M', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709',
                            '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', out],
                           stdin=subprocess.PIPE)
    with Pool(4, initializer=init_worker, initargs=(src_path,)) as pool:
        for i, fr in enumerate(pool.imap(render_frame, range(nfr), chunksize=2)):
            enc.stdin.write(fr.tobytes())
            if i % 60 == 0:
                print(f'frame {i}/{nfr}', flush=True)
    enc.stdin.close()
    enc.wait()
    print('listo', out, nfr)


if __name__ == '__main__':
    main()
