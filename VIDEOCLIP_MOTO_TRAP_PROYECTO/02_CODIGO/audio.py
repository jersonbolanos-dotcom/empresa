"""Diseno sonoro 100 % sintetizado (sin muestras externas, sin musica con copyright).

Cada efecto se coloca en la misma rejilla (timeline.py) que los eventos visuales.
uso: python3 audio.py <salida.wav>
"""
import sys
import wave

import numpy as np

from timeline import BASS, BEAT, DUR, HITS, INTRO_FLASHES, KICKS_SOFT, b

SR = 48000
N = int(round(DUR * SR))
R = np.random.default_rng(140)


# ----------------------------------------------------------------------------- dsp
def tt(dur):
    return np.arange(int(dur * SR)) / SR


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


def sweep_bp(x, fc, width_oct=0.6, n=2048, hop=512):
    """filtro paso-banda con frecuencia central variable fc(t) (STFT)"""
    win = np.sqrt(np.hanning(n + 1)[:-1])
    pad = np.concatenate([np.zeros(n), x, np.zeros(n)])
    out = np.zeros_like(pad)
    f = np.fft.rfftfreq(n, 1 / SR)
    lf = np.log2(np.maximum(f, 1))
    for s in range(0, len(pad) - n, hop):
        tc = (s + n / 2 - n) / SR
        c = np.log2(max(20.0, fc(tc)))
        mask = np.exp(-0.5 * ((lf - c) / width_oct) ** 2)
        seg = np.fft.irfft(np.fft.rfft(pad[s:s + n] * win) * mask, n=n) * win
        out[s:s + n] += seg
    return out[n:n + len(x)] / 1.5


def env_ad(n, att, dec, curve=1.0):
    t = np.arange(n) / SR
    a = np.clip(t / max(att, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - att, 0) / dec) ** curve


def osc_sine(freq_arr):
    return np.sin(2 * np.pi * np.cumsum(freq_arr) / SR)


def stereo(m, width=0.0, pan=0.0, delay_ms=0.0):
    l = m.copy()
    r = m.copy()
    if delay_ms > 0:
        d = int(delay_ms * SR / 1000)
        r = np.concatenate([np.zeros(d), m[:-d]]) if d else r
    g_l = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
    g_r = np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
    s = np.stack([l * g_l, r * g_r], 1)
    if width:
        mid = (s[:, 0] + s[:, 1]) / 2
        side = (s[:, 0] - s[:, 1]) / 2 * (1 + width)
        s = np.stack([mid + side, mid - side], 1)
    return s


def make_ir(dur, tau, seed, lp=6000):
    r = np.random.default_rng(seed)
    t = tt(dur)
    ir = r.standard_normal((len(t), 2)) * np.exp(-t / tau)[:, None]
    ir = fft_filter(ir, lo=120, hi=lp, order=2)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    return ir / np.sqrt((ir ** 2).sum(0)).max()


def convolve(x, ir):
    n = len(x) + len(ir) - 1
    nf = 1 << (n - 1).bit_length()
    out = np.zeros((len(x), 2))
    for c in range(2):
        y = np.fft.irfft(np.fft.rfft(x[:, c], nf) * np.fft.rfft(ir[:, c], nf), nf)
        out[:, c] = y[:len(x)]
    return out


class Bus:
    def __init__(self):
        self.x = np.zeros((N, 2))

    def add(self, sig, t0, gain=1.0):
        if sig.ndim == 1:
            sig = stereo(sig)
        i0 = int(round(t0 * SR))
        if i0 < 0:
            sig = sig[-i0:]
            i0 = 0
        n = min(len(sig), N - i0)
        if n > 0:
            self.x[i0:i0 + n] += sig[:n] * gain


# ----------------------------------------------------------------------------- instrumentos
def boom(dur=3.2, f0=95, f1=31, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = f1 + (f0 - f1) * np.exp(-t / 0.18)
    sub = osc_sine(fr) * env_ad(n, 0.002, 0.95)
    r = np.random.default_rng(seed)
    nz = fft_filter(r.standard_normal(n), hi=1800) * env_ad(n, 0.001, 0.12)
    click = fft_filter(r.standard_normal(n), lo=2500) * env_ad(n, 0.0005, 0.012)
    body = np.tanh(1.6 * sub) * 0.9 + 0.55 * nz + 0.35 * click
    s = stereo(body)
    s += stereo(fft_filter(r.standard_normal(n), lo=200, hi=3000) * env_ad(n, 0.01, 0.6), width=0.9) * 0.18
    return s


def sub_drop(dur=2.6, f0=62, f1=24):
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = f1 + (f0 - f1) * np.exp(-t / 0.7)
    return stereo(np.tanh(1.3 * osc_sine(fr)) * env_ad(n, 0.004, 1.1))


def metal(dur=2.2, seed=1, pitch=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    r = np.random.default_rng(seed)
    parts = np.array([211, 347, 563, 787, 1123, 1597, 2237, 3109, 4211]) * pitch
    sig = np.zeros(n)
    for p in parts:
        dec = r.uniform(0.15, 1.1) * (500 / p) ** 0.3
        fr = p * (1 - 0.015 * np.exp(-t / 0.05))
        sig += r.uniform(0.3, 1.0) * osc_sine(fr) * np.exp(-t / dec)
    sig /= len(parts) / 2.5
    hit = fft_filter(r.standard_normal(n), lo=2500, hi=9000) * env_ad(n, 0.0005, 0.03)
    s = stereo(sig, width=0.4, delay_ms=7) + stereo(hit) * 0.8
    return s


def bass808(dur_s, semis, glide, seed=2):
    n = int((dur_s + 0.25) * SR)
    t = np.arange(n) / SR
    f0 = 36.71 * 2 ** (semis / 12)
    g = 2 ** (glide / 12 * np.clip(t / max(dur_s, 1e-3), 0, 1) ** 1.5)
    fr = f0 * g
    body = osc_sine(fr)
    e = np.exp(-t / max(0.35, dur_s * 0.75))
    e *= np.clip(t / 0.003, 0, 1)
    e *= np.clip((dur_s + 0.05 - t) / 0.06, 0, 1)
    punch = osc_sine(50 + 110 * np.exp(-t / 0.012)) * np.exp(-t / 0.05)
    s = np.tanh(2.4 * body * e) * 0.8 + 0.5 * punch
    return stereo(s)


def kick(seed=3, f0=125, f1=44, dec=0.22):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    s = osc_sine(f1 + (f0 - f1) * np.exp(-t / 0.03)) * env_ad(n, 0.001, dec)
    return stereo(np.tanh(1.5 * s))


def snare(seed=4):
    n = int(0.6 * SR)
    r = np.random.default_rng(seed)
    nz = fft_filter(r.standard_normal(n), lo=900, hi=7500)
    e = np.zeros(n)
    for k, d in enumerate([0, 0.009, 0.018, 0.026]):  # clap en rafagas
        i = int(d * SR)
        e[i:] += env_ad(n - i, 0.0005, 0.012 if k < 3 else 0.17)
    tone = osc_sine(np.full(n, 185.0)) * env_ad(n, 0.001, 0.05)
    return stereo(nz * e * 0.9 + 0.4 * tone, width=0.3)


def hat(open_=False, seed=5, vel=1.0):
    n = int((0.25 if open_ else 0.06) * SR)
    r = np.random.default_rng(seed)
    nz = fft_filter(r.standard_normal(n), lo=7000, hi=16000)
    return stereo(nz * env_ad(n, 0.0005, 0.09 if open_ else 0.018) * vel, width=0.2)


def crash(dur=2.5, seed=6):
    n = int(dur * SR)
    r = np.random.default_rng(seed)
    nz = fft_filter(r.standard_normal((n, 2)), lo=3000, hi=14000)
    return nz * env_ad(n, 0.002, 0.7)[:, None] * 0.7


def whoosh(dur, f_a=250, f_b=5500, f_c=700, pan_a=-0.8, pan_b=0.8, seed=7):
    n = int(dur * SR)
    r = np.random.default_rng(seed)
    nz = r.standard_normal(n)

    def fc(tc):
        p = np.clip(tc / dur, 0, 1)
        return f_a * (f_b / f_a) ** (p / 0.6) if p < 0.6 else f_b * (f_c / f_b) ** ((p - 0.6) / 0.4)
    y = sweep_bp(nz, fc, 0.7)
    p = np.linspace(0, 1, n)
    y *= np.sin(np.pi * p) ** 1.5
    pans = pan_a + (pan_b - pan_a) * p
    return np.stack([y * np.cos((pans + 1) * np.pi / 4), y * np.sin((pans + 1) * np.pi / 4)], 1) * 1.4


def riser(dur, seed=8, f_a=180, f_b=7000):
    n = int(dur * SR)
    r = np.random.default_rng(seed)
    nz = sweep_bp(r.standard_normal(n), lambda tc: f_a * (f_b / f_a) ** np.clip(tc / dur, 0, 1), 0.5)
    t = np.arange(n) / SR
    p = t / dur
    tone = osc_sine(70 * (900 / 70) ** p * (1 + 0.01 * np.sin(2 * np.pi * (4 + 12 * p) * t)))
    tone2 = osc_sine(70 * 1.5 * (900 / 70) ** p)
    e = p ** 2.4
    y = (nz * 1.2 + 0.25 * tone + 0.12 * tone2) * e
    return stereo(y, width=0.6, delay_ms=11)


def reverse_impact(dur=1.4, seed=9):
    base = boom(dur, 140, 40, seed)[:, 0] * 0.6 + metal(dur, seed)[:, 0] * 0.5
    tail = convolve(stereo(base), make_ir(dur, 0.5, seed))[:int(dur * SR)]
    rev = tail[::-1].copy()
    p = np.linspace(0, 1, len(rev))
    return rev * (p ** 1.5)[:, None] * 1.6


def glitch_sfx(dur, seed=10):
    n = int(dur * SR)
    r = np.random.default_rng(seed)
    y = np.zeros(n)
    i = 0
    while i < n:
        L = int(r.uniform(0.008, 0.045) * SR)
        kind = r.integers(0, 3)
        t = np.arange(min(L, n - i)) / SR
        if kind == 0:
            y[i:i + L] = np.sign(np.sin(2 * np.pi * r.uniform(200, 2500) * t)) * 0.5
        elif kind == 1:
            y[i:i + L] = r.standard_normal(len(t)) * 0.6
        else:
            y[i:i + L] = 0
        i += L
    # bitcrush
    hold = 6
    y = np.repeat(y[::hold], hold)[:n]
    y = np.round(y * 6) / 6
    y = fft_filter(y, lo=150, hi=12000)
    return stereo(y, width=0.8, delay_ms=4) * 0.7


def radio(dur, seed=11):
    n = int(dur * SR)
    r = np.random.default_rng(seed)
    t = np.arange(n) / SR
    nz = fft_filter(r.standard_normal(n), lo=1300, hi=3800)
    am = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * (60 + 40 * np.sin(2 * np.pi * 3 * t)) * t))
    sq = osc_sine(2400 + 1400 * np.sin(2 * np.pi * 1.7 * t)) * 0.25
    crackle = (r.uniform(0, 1, n) > 0.9985) * r.standard_normal(n) * 3
    y = (nz * am + sq + crackle) * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.4
    return stereo(y, pan=-0.3) * 0.6


def power_down(dur=0.8):
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = 420 * (30 / 420) ** (t / dur)
    y = np.tanh(2 * np.sign(osc_sine(fr)) * 0.5 + osc_sine(fr / 2)) * (1 - t / dur)
    return stereo(fft_filter(y, hi=3000)) * 0.6


def drone(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros((n, 2))
    for k, (f, a) in enumerate([(36.71, 1.0), (55.0, 0.55), (73.42, 0.45), (36.71 * 1.003, 0.8), (110.0, 0.18)]):
        ph = np.random.default_rng(k).uniform(0, 1)
        saw = 2 * ((f * t + ph) % 1) - 1
        lfo = 1 + 0.25 * np.sin(2 * np.pi * (0.11 + 0.05 * k) * t + k)
        y += stereo(saw * a * lfo, pan=(-0.5 + 0.25 * k))
    y = fft_filter(y, lo=28, hi=260, order=3)
    tex = fft_filter(R.standard_normal((n, 2)), lo=90, hi=520, order=2) * 0.5
    tex *= (0.6 + 0.4 * np.sin(2 * np.pi * 0.23 * t))[:, None]
    return y * 0.5 + tex


def shimmer(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = sum(osc_sine(np.full(n, f)) * (0.5 + 0.5 * np.sin(2 * np.pi * (5.3 + i) * t + i)) / (i + 1)
            for i, f in enumerate([1174.7, 1760.0, 2349.3, 2637.0]))
    return stereo(y * np.sin(np.pi * t / dur) ** 2, width=0.9, delay_ms=13) * 0.25


# ----------------------------------------------------------------------------- arreglo
def build():
    hits, drums, pad, verb = Bus(), Bus(), Bus(), Bus()

    # INTRO 0-4: drone naciendo, riser, destellos con glitch, reverse impact al BOOM
    pad.add(drone(DUR), 0)
    hits.add(riser(b(4) - 0.02, seed=81), 0, 0.55)
    for k, (bf, nfr, _) in enumerate(INTRO_FLASHES):
        hits.add(glitch_sfx(nfr / 30 + 0.05, seed=100 + k), b(bf), 0.55)
        hits.add(kick(seed=k, f0=90, f1=38, dec=0.12), b(bf), 0.35)
    hits.add(reverse_impact(1.5, 91), b(4) - 1.5, 0.8)

    # golpes principales
    for bt in HITS['boom']:
        hits.add(boom(seed=int(bt)), b(bt), 1.0)
        verb.add(boom(seed=int(bt) + 1)[:, :] * 0.5, b(bt))
    for bt in HITS['metal']:
        m = metal(seed=int(bt * 3), pitch=1.0 if bt != 10 else 1.25)
        hits.add(m, b(bt), 0.55)
        verb.add(m, b(bt), 0.6)
    hits.add(sub_drop(), b(20), 0.75)
    hits.add(sub_drop(3.0, 55, 22), b(32), 0.7)
    for bt in (20, 32):
        drums.add(crash(seed=int(bt)), b(bt), 0.45)
        verb.add(crash(seed=int(bt) + 1), b(bt), 0.4)

    # 808 y bombos suaves
    for bt, dur_b, semi, gl in BASS:
        drums.add(bass808(b(dur_b), semi, gl), b(bt), 0.62)
    for bt in KICKS_SOFT:
        drums.add(kick(seed=int(bt * 2), f0=80, f1=36, dec=0.3), b(bt), 0.45)

    # asiento 4-9: hats discretos en corcheas
    for k in range(10):
        bt = 5 + k * 0.5
        if bt < 9:
            drums.add(hat(seed=200 + k, vel=0.35 + 0.1 * (k % 2)), b(bt), 0.4)

    # whip 9-10
    hits.add(whoosh(b(1.0) + 0.05, seed=71), b(9), 0.75)
    hits.add(reverse_impact(0.5, 92), b(10) - 0.5, 0.45)
    drums.add(kick(), b(10), 0.6)

    # 12: corte glitch al faro
    hits.add(glitch_sfx(0.22, seed=121), b(12), 0.7)
    hits.add(radio(0.45, seed=122), b(12), 0.55)
    hits.add(boom(2.0, 70, 30, seed=123), b(12), 0.45)

    # faro 12-18: tension, shimmer metalico, redoble de caja 16-18, riser 14-19.75
    pad.add(shimmer(b(6.5)), b(12), 1.0)
    hits.add(riser(b(5.75), seed=82, f_a=150, f_b=9000), b(14), 0.6)
    t_roll = 16.0
    step = 0.5
    while t_roll < 19.7:
        vel = 0.18 + 0.55 * (t_roll - 16) / 3.7
        drums.add(snare(seed=int(t_roll * 16)), b(t_roll), vel)
        t_roll += step
        if t_roll >= 17:
            step = 0.25
        if t_roll >= 18.5:
            step = 0.125
    hits.add(whoosh(b(2.0), 200, 7000, 400, 0.7, -0.7, seed=72), b(18), 0.7)
    hits.add(reverse_impact(1.2, 93), b(20) - 1.2, 0.9)

    # beat 22-30
    for bt in HITS['snare']:
        drums.add(snare(seed=int(bt)), b(bt), 0.75)
        verb.add(snare(seed=int(bt) + 1), b(bt), 0.35)
    x = 22.0
    while x < 30:
        roll = (25.5 <= x < 26) or (29.5 <= x < 30)
        st = (1 / 8 if x < 26 else 1 / 6) if roll else 0.5
        drums.add(hat(seed=int(x * 48), vel=0.55 if (x * 2) % 2 == 0 else 0.4), b(x), 0.5)
        x += st
    drums.add(hat(open_=True, seed=300), b(23.5), 0.35)
    drums.add(hat(open_=True, seed=301), b(27.5), 0.35)
    for k, bt in enumerate([22, 25.5, 29]):
        hits.add(glitch_sfx(0.3, seed=140 + k), b(bt), 0.6)
        hits.add(radio(0.35, seed=150 + k), b(bt), 0.4)
    hits.add(whoosh(0.35, 400, 6000, 1500, -0.6, 0.6, seed=73), b(22) - 0.1, 0.5)

    # frenada 30-32 y poster
    hits.add(riser(b(2.0), seed=83, f_a=400, f_b=9000), b(30), 0.5)
    hits.add(reverse_impact(0.9, 94), b(32) - 0.9, 0.8)
    hits.add(glitch_sfx(0.35, seed=160), b(35), 0.6)
    hits.add(power_down(0.9), b(35.2), 0.7)

    # --- duck del pad (sidechain) en golpes y 808
    t = np.arange(N) / SR
    duck = np.zeros(N)
    for bt in HITS['boom'] + [x[0] for x in BASS] + KICKS_SOFT:
        tt0 = b(bt)
        m = t >= tt0
        duck[m] = np.maximum(duck[m], np.exp(-(t[m] - tt0) / 0.25))
    # dinamica del pad por secciones (mas presente en tension, hueco antes del drop)
    beat = t / BEAT
    lev = np.interp(beat, [0, 4, 4.01, 12, 18, 19.75, 19.76, 20, 22, 30, 32, 35, 36.5],
                    [0.25, 0.75, 0.55, 0.65, 1.0, 1.0, 0.0, 0.0, 0.45, 0.5, 0.9, 0.7, 0.0])
    pad.x *= (lev * (1 - 0.7 * duck))[:, None]
    # hueco pre-drop: silencio total de todo lo no-impacto en 19.75-20
    gap = ~((beat >= 19.80) & (beat < 20))
    hits.x[~gap] *= 0.15
    drums.x[~gap] *= 0.0

    rev = convolve(verb.x * 0.5 + hits.x * 0.15 + drums.x * 0.05, make_ir(3.0, 0.9, 5, lp=5000))
    mix = hits.x * 0.9 + drums.x * 0.9 + pad.x * 0.38 + rev * 0.35
    mix = fft_filter(mix, lo=24, order=4)
    # bajos: mono por debajo de 120 Hz (claridad y compatibilidad)
    low = fft_filter(mix, hi=120, order=4)
    low_m = low.mean(1, keepdims=True)
    mix = mix - low + low_m
    # fundido final
    fo = np.clip((DUR - t) / 0.25, 0, 1)
    mix *= fo[:, None]
    mix /= np.abs(mix).max()
    mix = np.tanh(1.3 * mix) / np.tanh(1.3)   # saturacion suave, sin clipping
    return mix * 0.89


def main():
    mix = build()
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
    with wave.open(sys.argv[1], 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print('ok', sys.argv[1], len(pcm) / SR)


if __name__ == '__main__':
    main()
