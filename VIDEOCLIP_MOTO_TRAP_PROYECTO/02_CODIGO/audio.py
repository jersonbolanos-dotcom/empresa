"""Diseno sonoro V2 · trailer de pelicula de accion de autos. 100 % sintetizado por codigo
(sin muestras externas, sin musica con copyright). Misma rejilla que el video (timeline.py).

uso: python3 audio.py <salida.wav>
"""
import sys
import wave

import numpy as np

from timeline import BEAT, DUR, HITS, TICKS, TOMS, b

SR = 48000
N = int(round(DUR * SR))


# ----------------------------------------------------------------------------- dsp
def fft_filter(x, lo=None, hi=None, order=4):
    X = np.fft.rfft(x, axis=0)
    f = np.fft.rfftfreq(x.shape[0], 1 / SR)
    m = np.ones_like(f)
    if lo:
        m *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    if hi:
        m *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    if x.ndim == 2:
        m = m[:, None]
    return np.fft.irfft(X * m, n=x.shape[0], axis=0)


def stft_mask(x, maskfn, n=2048, hop=512):
    win = np.sqrt(np.hanning(n + 1)[:-1])
    pad = np.concatenate([np.zeros(n), x, np.zeros(n)])
    out = np.zeros_like(pad)
    f = np.fft.rfftfreq(n, 1 / SR)
    for s in range(0, len(pad) - n, hop):
        tc = (s + n / 2 - n) / SR
        out[s:s + n] += np.fft.irfft(np.fft.rfft(pad[s:s + n] * win) * maskfn(f, tc), n=n) * win
    return out[n:n + len(x)] / 1.5


def sweep_bp(x, fc, width_oct=0.6):
    def m(f, tc):
        return np.exp(-0.5 * ((np.log2(np.maximum(f, 1)) - np.log2(max(20.0, fc(tc)))) / width_oct) ** 2)
    return stft_mask(x, m)


def sweep_lp(x, fc):
    return stft_mask(x, lambda f, tc: 1 / (1 + (f / max(30.0, fc(tc))) ** 4))


def env_ad(n, att, dec):
    t = np.arange(n) / SR
    return np.clip(t / max(att, 1e-4), 0, 1) * np.exp(-np.maximum(t - att, 0) / dec)


def osc(freq):
    return np.sin(2 * np.pi * np.cumsum(freq) / SR)


def saw(freq, seed=0):
    ph = np.random.default_rng(seed).uniform(0, 1)
    p = (np.cumsum(freq) / SR + ph) % 1
    return 2 * p - 1


def stereo(m, pan=0.0, width=0.0, delay_ms=0.0):
    r = m
    if delay_ms > 0:
        d = int(delay_ms * SR / 1000)
        r = np.concatenate([np.zeros(d), m[:-d]])
    s = np.stack([m * np.cos((pan + 1) * np.pi / 4), r * np.sin((pan + 1) * np.pi / 4)], 1) * np.sqrt(2)
    if width:
        mid, side = (s[:, 0] + s[:, 1]) / 2, (s[:, 0] - s[:, 1]) / 2 * (1 + width)
        s = np.stack([mid + side, mid - side], 1)
    return s


def make_ir(dur, tau, seed, lp=6000):
    r = np.random.default_rng(seed)
    t = np.arange(int(dur * SR)) / SR
    ir = fft_filter(r.standard_normal((len(t), 2)) * np.exp(-t / tau)[:, None], lo=120, hi=lp, order=2)
    k = int(0.015 * SR)
    ir[:k] *= np.linspace(0, 1, k)[:, None]
    return ir / np.sqrt((ir ** 2).sum(0)).max()


def convolve(x, ir):
    n = len(x) + len(ir) - 1
    nf = 1 << (n - 1).bit_length()
    out = np.zeros((len(x), 2))
    for c in range(2):
        out[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], nf) * np.fft.rfft(ir[:, c], nf), nf)[:len(x)]
    return out


class Bus:
    def __init__(self):
        self.x = np.zeros((N, 2))

    def add(self, sig, t0, gain=1.0):
        if sig.ndim == 1:
            sig = stereo(sig)
        i0 = int(round(t0 * SR))
        if i0 < 0:
            sig, i0 = sig[-i0:], 0
        n = min(len(sig), N - i0)
        if n > 0:
            self.x[i0:i0 + n] += sig[:n] * gain


# ----------------------------------------------------------------------------- instrumentos
def boom(dur=3.0, f0=90, f1=30, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    r = np.random.default_rng(seed)
    sub = np.tanh(1.5 * osc(f1 + (f0 - f1) * np.exp(-t / 0.2))) * env_ad(n, 0.002, 1.0)
    nz = fft_filter(r.standard_normal(n), hi=1500) * env_ad(n, 0.001, 0.10)
    click = fft_filter(r.standard_normal(n), lo=2500) * env_ad(n, 0.0005, 0.01)
    return stereo(sub * 0.9 + 0.5 * nz + 0.3 * click)


def braam(dur=3.4, seed=1):
    """metal grave de trailer: pila de sierras en Re con filtro que se abre y cierra"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for k, (f, a) in enumerate([(36.71, 1.0), (73.42, 0.9), (110.0, 0.55), (146.83, 0.45), (73.42 * 1.006, 0.7),
                                (36.71 * 0.996, 0.6)]):
        y += a * saw(np.full(n, f), seed + k)
    y = sweep_lp(y, lambda tc: 120 + 1500 * np.exp(-max(tc - 0.06, 0) / 0.45) * min(1, tc / 0.06 + 0.05))
    y = np.tanh(1.8 * y / np.abs(y).max())
    e = np.clip(t / 0.03, 0, 1) * np.exp(-t / 1.5) * np.clip((dur - t) / 0.4, 0, 1)
    return stereo(y * e, width=0.5, delay_ms=9) * 0.8 + boom(dur, 80, 28, seed) * 0.9


def impact(seed=2, pitch=1.0):
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    r = np.random.default_rng(seed)
    ring = sum(osc(np.full(n, f * pitch)) * np.exp(-t / d) for f, d in [(196, 0.5), (311, 0.35), (523, 0.25), (887, 0.18)])
    return boom(1.8, 110, 40, seed) * 0.8 + stereo(ring * 0.18, width=0.5, delay_ms=6) + \
        stereo(fft_filter(r.standard_normal(n), lo=1500, hi=8000) * env_ad(n, 0.0005, 0.04)) * 0.5


def tom(vel=1.0, seed=3, f0=100):
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    r = np.random.default_rng(seed)
    body = osc(f0 * 0.62 + f0 * 0.38 * np.exp(-t / 0.04)) * env_ad(n, 0.001, 0.32)
    skin = fft_filter(r.standard_normal(n), lo=180, hi=1600) * env_ad(n, 0.0008, 0.05)
    return stereo(np.tanh(1.4 * (body + 0.6 * skin)) * vel, pan=r.uniform(-0.35, 0.35))


def tick(hi=True, seed=4):
    n = int(0.05 * SR)
    r = np.random.default_rng(seed)
    y = fft_filter(r.standard_normal(n), lo=2500 if hi else 1600, hi=6000) * env_ad(n, 0.0003, 0.006)
    return stereo(y, pan=0.25 if hi else -0.25)


def ostinato_note(dur, f=73.42, accent=1.0, seed=5):
    n = int(dur * SR)
    y = saw(np.full(n, f), seed) + 0.6 * saw(np.full(n, f * 1.004), seed + 1) + 0.4 * saw(np.full(n, f * 2), seed + 2)
    y = fft_filter(y, lo=50, hi=650 + 500 * accent, order=2)
    return stereo(y * env_ad(n, 0.004, 0.08 + 0.05 * accent) * accent, width=0.3)


def whoosh(dur, f_a=250, f_b=5500, f_c=700, pan_a=-0.8, pan_b=0.8, seed=7):
    n = int(dur * SR)
    nz = np.random.default_rng(seed).standard_normal(n)

    def fc(tc):
        p = np.clip(tc / dur, 0, 1)
        return f_a * (f_b / f_a) ** (p / 0.6) if p < 0.6 else f_b * (f_c / f_b) ** ((p - 0.6) / 0.4)
    y = sweep_bp(nz, fc, 0.7) * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
    pans = np.linspace(pan_a, pan_b, n)
    return np.stack([y * np.cos((pans + 1) * np.pi / 4), y * np.sin((pans + 1) * np.pi / 4)], 1) * 1.4


def riser(dur, seed=8, f_a=150, f_b=8000):
    n = int(dur * SR)
    t = np.arange(n) / SR
    p = t / dur
    nz = sweep_bp(np.random.default_rng(seed).standard_normal(n), lambda tc: f_a * (f_b / f_a) ** np.clip(tc / dur, 0, 1), 0.5)
    # tono tipo Shepard ascendente
    tone = sum(osc(70 * k * (8 ** p)) * np.sin(np.pi * ((p + k / 3) % 1)) for k in (1, 2, 3)) / 3
    return stereo((nz * 1.1 + 0.3 * tone) * p ** 2.3, width=0.6, delay_ms=11)


def reverse_impact(dur=1.4, seed=9):
    base = boom(dur, 140, 40, seed)[:, 0] * 0.7
    tail = convolve(stereo(base), make_ir(dur, 0.5, seed))[:int(dur * SR)]
    return tail[::-1] * (np.linspace(0, 1, len(tail)) ** 1.5)[:, None] * 1.6


def engine(rpm, level, seed=10):
    """monocilindrico 4 tiempos: una explosion cada 2 vueltas (f = rpm/120)"""
    r = np.random.default_rng(seed)
    fire = rpm / 120.0
    ph = np.cumsum(fire) / SR
    cyc = ph.astype(np.int64)
    frac = ph % 1
    jit = 1 + 0.22 * r.standard_normal(cyc.max() + 2)
    pulse = np.exp(-frac * 7) * jit[cyc]
    pulse -= np.convolve(pulse, np.ones(2400) / 2400, mode='same')
    body = fft_filter(pulse, lo=35, hi=2200, order=2)
    exhaust = fft_filter(r.standard_normal(len(rpm)), lo=250, hi=3500) * pulse ** 2 * 0.6
    whine = osc(rpm / 60 * 3) * 0.04 * (rpm / 9000)
    y = np.tanh(2.2 * (body + exhaust) / (np.abs(body).max() + 1e-9) * 1.4) + whine
    return stereo(y * level, width=0.15)


def starter(dur=0.45, seed=11):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sign(osc(np.full(n, 48 + 30 * t / dur))) * 0.3 + fft_filter(np.random.default_rng(seed).standard_normal(n), 800, 4000) * 0.15
    y *= (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 14 * t))) * np.clip(t / 0.02, 0, 1)
    return stereo(fft_filter(y, lo=60, hi=3000))


def pad(dur):
    """cuerdas graves y drone oscuro de fondo"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros((n, 2))
    for k, (f, a) in enumerate([(36.71, 1.0), (73.42, 0.6), (110.0, 0.35), (146.83, 0.25), (174.61, 0.18)]):
        lfo = 1 + 0.2 * np.sin(2 * np.pi * (0.13 + 0.04 * k) * t + k)
        y += stereo(saw(np.full(n, f * (1 + 0.002 * k)), 20 + k) * a * lfo, pan=-0.5 + 0.25 * k)
    return fft_filter(y, lo=30, hi=420, order=3)


def tonal_hit(dur=4.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = sum(a * osc(np.full(n, f)) * np.exp(-t / d) for f, a, d in [(73.42, 1.0, 2.0), (146.83, 0.5, 1.4),
                                                                   (220.0, 0.35, 1.1), (293.66, 0.2, 0.9)])
    return stereo(y * np.clip(t / 0.01, 0, 1), width=0.4, delay_ms=12) * 0.6 + boom(dur, 70, 30, 77) * 0.5


# ----------------------------------------------------------------------------- arreglo
def rpm_curve():
    t = np.arange(N) / SR
    beat = t / BEAT
    r = np.random.default_rng(42)
    idle = 1500 + 90 * np.interp(t, np.linspace(0, DUR, 200), r.standard_normal(200))
    rpm = idle.copy()

    def blip(c, peak, up_s, down_s):
        tc = b(c)
        rise = np.clip((t - (tc - up_s)) / up_s, 0, 1) ** 1.5
        fall = np.exp(-np.maximum(t - tc, 0) / down_s)
        return np.where(t < tc, rise, fall) * (peak - 1500) * ((t > tc - up_s))

    rpm += blip(1.2, 3600, 0.08, 0.35)             # arranque: primer acelerón
    rpm += blip(9.35, 7200, 0.12, 0.30)            # acelerón en el whip
    rev = (beat >= 17.6) & (beat < 19.8)
    p = np.clip((beat - 17.6) / 2.2, 0, 1)
    rpm = np.where(rev, 1500 + 8300 * p ** 1.8, rpm)  # gran acelerón en el reveal
    hero = (beat >= 19.8) & (beat < 23)
    rpm = np.where(hero, 9800 * 0.34 * (1 - 0.3 * np.clip((beat - 20) / 3, 0, 1)), rpm)  # sonido "en camara lenta"
    act = (beat >= 23) & (beat < 30)
    rpm = np.where(act, 2100 + blip(25.0, 6200, 0.1, 0.25) + blip(29.0, 6800, 0.1, 0.25), rpm)
    fr = (beat >= 30) & (beat < 32)
    rpm = np.where(fr, 1200 + 3800 * (1 - np.clip((beat - 30) / 2, 0, 1)) ** 1.6, rpm)
    rpm = np.where(beat >= 32, 1250 + 60 * np.sin(t * 3), rpm)
    lev = np.interp(beat, [0, 1.0, 1.05, 4, 9, 12, 17.6, 19.8, 19.81, 20, 20.01, 23, 23.01, 30, 32, 33.6, 34.4, 40],
                    [0, 0, 0.55, 0.40, 0.35, 0.22, 0.25, 0.75, 0, 0, 0.45, 0.25, 0.22, 0.25, 0.30, 0.18, 0, 0])
    return rpm, lev, beat


def build():
    hits, perc, music, eng, verb = Bus(), Bus(), Bus(), Bus(), Bus()
    t = np.arange(N) / SR

    # motor: arranque + ralenti + acelerones (la version "camara lenta" va oscurecida)
    rpm, lev, beat = rpm_curve()
    e = engine(rpm, lev)
    dark = fft_filter(e, hi=420, order=3) * 1.6
    hero = ((beat >= 20) & (beat < 23)).astype(float)
    hero = np.convolve(hero, np.ones(2400) / 2400, mode='same')[:, None]
    eng.x += e * (1 - hero) + dark * hero
    eng.add(starter(), b(1.05) - 0.45, 0.5)

    # intro: riser grave + reverse impact hacia el primer braam
    hits.add(riser(b(4) - 0.05, seed=81, f_a=90, f_b=3000), 0, 0.35)
    hits.add(reverse_impact(1.4, 91), b(4) - 1.4, 0.7)

    for bt in HITS['braam']:
        hits.add(braam(seed=int(bt)), b(bt), 0.95)
        verb.add(boom(seed=int(bt) + 1) * 0.6, b(bt))
    hits.add(boom(3.2, 62, 22, 5) * 0.8, b(20), 0.8)                 # sub-drop en el reveal
    for bt in HITS['impact']:
        im = impact(seed=int(bt), pitch=1.0 if bt == 10 else 0.84)
        hits.add(im, b(bt), 0.75)
        verb.add(im, b(bt), 0.5)

    # tension: tic-tac 4-12
    k = 0
    x = TICKS[0] + 0.5
    while x < TICKS[1]:
        perc.add(tick(k % 2 == 0, seed=200 + k), b(x), 0.35 + 0.15 * (x - 4) / 8)
        x += 0.5
        k += 1

    # transiciones
    hits.add(whoosh(b(1.0) + 0.05, seed=71), b(9), 0.8)
    hits.add(whoosh(0.55, 300, 6000, 900, 0.7, -0.7, seed=72), b(12) - 0.45, 0.6)
    hits.add(whoosh(b(2.0), 200, 7000, 400, -0.7, 0.7, seed=73), b(18), 0.55)
    hits.add(whoosh(b(3.0), 60, 900, 120, 0.4, -0.4, seed=74), b(20.1), 0.8)    # whoosh grave de camara lenta
    hits.add(whoosh(b(2.0), 3000, 1200, 120, -0.5, 0.5, seed=75), b(30), 0.6)   # frenada

    # faro 12-18: ostinato suave en corcheas que crece, riser y reverse impact al reveal
    x = 14.0
    while x < 19.8:
        acc = 1.0 if (x * 2) % 2 == 0 else 0.6
        st = 0.5 if x < 17 else 0.25
        music.add(ostinato_note(b(st) * 0.95, accent=acc * (0.35 + 0.65 * (x - 14) / 5.8), seed=int(x * 8)), b(x), 0.55)
        x += st
    hits.add(riser(b(5.8), seed=82), b(14), 0.55)
    hits.add(reverse_impact(1.2, 93), b(20) - 1.2, 0.85)

    # accion 23-30: taikos + ostinato en semicorcheas
    for bt, v in TOMS:
        perc.add(tom(v, seed=int(bt * 10), f0=105 if v > 0.9 else 130), b(bt), 0.85)
        verb.add(tom(v, seed=int(bt * 10) + 1), b(bt), 0.25)
    x = 23.0
    while x < 30:
        acc = 1.0 if (x * 4) % 4 == 0 else (0.75 if (x * 4) % 2 == 0 else 0.5)
        f = 73.42 if x < 27 else 87.31 if x < 29 else 82.41
        music.add(ostinato_note(b(0.25) * 0.9, f=f, accent=acc, seed=int(x * 16)), b(x), 0.6)
        x += 0.25
    hits.add(riser(b(2.0), seed=83, f_a=300, f_b=7000), b(30), 0.45)
    hits.add(reverse_impact(0.9, 94), b(32) - 0.9, 0.8)

    # titulo: golpe tonal con cola larga
    hits.add(tonal_hit(), b(HITS['title'][0]), 0.75)
    verb.add(tonal_hit(), b(HITS['title'][0]), 0.5)

    # pad oscuro por secciones con sidechain en golpes
    pd = pad(DUR)
    lev = np.interp(beat, [0, 3, 4, 12, 18, 19.8, 19.81, 20, 20.5, 23, 30, 32, 34.4, 36.5],
                    [0.0, 0.4, 0.55, 0.55, 0.9, 0.9, 0, 0, 0.8, 0.6, 0.55, 0.8, 0.5, 0])
    duck = np.zeros(N)
    for bt in HITS['braam'] + HITS['impact'] + [x[0] for x in TOMS]:
        m = t >= b(bt)
        duck[m] = np.maximum(duck[m], np.exp(-(t[m] - b(bt)) / 0.25))
    music.x += pd * (lev * (1 - 0.6 * duck))[:, None] * 0.6

    # silencio antes del reveal (19.8-20): solo queda la cola del reverse impact
    gap = (beat >= 19.82) & (beat < 20)
    for bus in (perc, music, eng):
        bus.x[gap] = 0
    hits.x[gap] *= 0.1

    rev = convolve(verb.x * 0.5 + hits.x * 0.12 + perc.x * 0.12, make_ir(3.2, 1.0, 5, lp=5000))
    mix = hits.x * 0.9 + perc.x * 0.85 + music.x * 0.7 + eng.x * 0.55 + rev * 0.35
    mix = fft_filter(mix, lo=24, order=4)
    low = fft_filter(mix, hi=120, order=4)
    mix = mix - low + low.mean(1, keepdims=True)    # graves en mono
    mix *= np.clip((DUR - t) / 0.25, 0, 1)[:, None]
    mix /= np.abs(mix).max()
    return np.tanh(1.25 * mix) / np.tanh(1.25) * 0.89


def main():
    pcm = (np.clip(build(), -1, 1) * 32767).astype('<i2')
    with wave.open(sys.argv[1], 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print('ok', sys.argv[1], len(pcm) / SR)


if __name__ == '__main__':
    main()
