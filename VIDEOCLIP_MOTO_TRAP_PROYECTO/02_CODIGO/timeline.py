"""Linea de tiempo compartida (video + audio). Rejilla musical original a 140 BPM.

Todo se expresa en BEATS de salida. b(x) -> segundos.
El mapeo tiempo_salida -> tiempo_origen define speed ramps, camara lenta y congelados.
"""
import math

BPM = 140.0
BEAT = 60.0 / BPM          # 0.428571 s
FPS = 30
W, H = 1080, 1920
SRC_W, SRC_H = 480, 854
SRC_FPS = 120              # version interpolada (flujo optico) del original
SRC_DUR = 14.80            # margen de seguridad sobre 14.87 s
TAIL = 0.62                # cola de reverb tras el ultimo beat
END_BEAT = 36
DUR = END_BEAT * BEAT + TAIL


def b(x):
    return x * BEAT


def smooth(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def ease_in(x):      # acelera (rampa de velocidad hacia arriba)
    x = min(max(x, 0.0), 1.0)
    return x ** 2.2


def ease_out(x):     # decelera (frenada a camara lenta)
    x = min(max(x, 0.0), 1.0)
    return 1 - (1 - x) ** 2.2


def ease_io(x):      # lento-rapido-lento (whip / reveal)
    x = min(max(x, 0.0), 1.0)
    return 0.5 - 0.5 * math.cos(math.pi * x) if x < 1 else 1.0


def lin(x):
    return min(max(x, 0.0), 1.0)


# (beat_ini, beat_fin, src_ini, src_fin, curva, nombre)
SEGMENTS = [
    (4, 9, 0.05, 1.60, lin, 'asiento'),        # camara lenta 0.72x con push-in
    (9, 10, 1.60, 3.55, ease_io, 'whip'),      # 4.5x con motion blur real
    (10, 12, 3.55, 4.40, lin, 'fi'),           # tiempo real, golpe en 10
    (12, 18, 4.40, 5.95, lin, 'faro'),         # camara lenta 0.6x
    (18, 20, 5.95, 8.10, ease_in, 'reveal'),   # speed ramp acelerando hasta el drop
    (20, 22, 8.10, 8.10, lin, 'freeze'),       # congelado del drop
    (22, 30, 8.10, 11.55, lin, 'beat'),        # beat completo ~1x
    (30, 32, 11.55, 12.40, ease_out, 'frenada'),
    (32, 36.01, 12.40, 12.40, lin, 'poster'),  # congelado final -> poster
]

# Destellos de la intro (beat, duracion en frames, tiempo de origen)
INTRO_FLASHES = [
    (1.00, 3, 5.55), (2.00, 3, 5.20), (2.50, 2, 5.80),
    (3.00, 2, 4.95), (3.25, 2, 5.65), (3.50, 2, 5.40), (3.75, 1, 5.90),
]

# Golpes sincronizados: (beat, tipo) — compartidos por video y audio
HITS = {
    'boom': [4, 20, 32],
    'metal': [10, 20, 32],
    'glitch': [12, 22, 25.5, 29, 35],
    'snare': [22, 26, 30],
}


# Notas 808 (beat, duracion_beats, semitonos sobre D1=36.71 Hz, glide)
BASS = [
    (4, 3.0, 0, 0), (10, 1.5, 0, 0),
    (20, 2.0, 0, 0), (22, 0.75, 0, 0), (22.75, 0.75, 0, 0), (23.5, 0.5, 3, 0),
    (24, 0.75, 0, 0), (24.75, 1.0, 3, 0), (25.75, 0.75, 7, -4),
    (27, 0.5, 0, 0), (27.5, 0.5, 0, 0), (28, 0.75, 0, 0), (28.75, 1.0, -2, 0),
    (29.75, 0.25, 5, 0), (30, 2.0, 0, -14),     # tape-stop en la frenada
    (32, 3.5, 0, 0),
]
KICKS_SOFT = [6, 7.5, 8, 14, 16]       # latidos graves en la tension


def segment_at(beat):
    for s in SEGMENTS:
        if s[0] <= beat < s[1]:
            return s
    return None


def src_time(t):
    """tiempo de salida (s) -> (tiempo de origen, segmento) o (None, None) en intro."""
    beat = t / BEAT
    s = segment_at(beat)
    if s is None:
        return None, None
    p = (beat - s[0]) / (s[1] - s[0])
    return s[2] + (s[3] - s[2]) * s[4](p), s


def src_speed(t, dt=1e-3):
    a, sa = src_time(t)
    c, sc = src_time(t + dt)
    if a is None or c is None or sa is not sc:
        return 1.0
    return (c - a) / dt
