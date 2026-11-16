"""Linea de tiempo compartida (video + audio) · V2 estilo pelicula de accion de autos.

Rejilla de 140 BPM (pulso de trailer). Todo en BEATS de salida; b(x) -> segundos.
"""
import math

BPM = 140.0
BEAT = 60.0 / BPM
FPS = 30
W, H = 1080, 1920
SRC_W, SRC_H = 480, 854
SRC_FPS = 120
TAIL = 0.62
END_BEAT = 36
DUR = END_BEAT * BEAT + TAIL


def b(x):
    return x * BEAT


def smooth(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def ease_in(x):
    x = min(max(x, 0.0), 1.0)
    return x ** 2.2


def ease_out(x):
    x = min(max(x, 0.0), 1.0)
    return 1 - (1 - x) ** 2.2


def ease_io(x):
    x = min(max(x, 0.0), 1.0)
    return 0.5 - 0.5 * math.cos(math.pi * x)


def lin(x):
    return min(max(x, 0.0), 1.0)


# (beat_ini, beat_fin, src_ini, src_fin, curva, nombre)
SEGMENTS = [
    (2, 9, 0.00, 1.60, lin, 'asiento'),        # 0.53x, entra desde negro
    (9, 10, 1.60, 3.55, ease_io, 'whip'),      # whip con motion blur real
    (10, 12, 3.55, 4.40, lin, 'fi'),
    (12, 18, 4.40, 5.95, lin, 'faro'),         # 0.6x
    (18, 20, 5.95, 8.10, ease_in, 'reveal'),   # speed ramp acelerando
    (20, 23, 8.10, 8.75, ease_out, 'heroe'),   # camara lenta heroica (0.5x -> 0)
    (23, 30, 8.75, 11.75, lin, 'accion'),      # ~1x
    (30, 32, 11.75, 12.45, ease_out, 'frenada'),
    (32, 34.6, 12.45, 12.62, lin, 'final'),    # ultimo plano, funde a negro
]
FADE_IN = (2.0, 3.6)       # beats: fundido desde negro
FADE_OUT = (33.6, 34.6)    # beats: fundido a negro antes del titulo
TITLE = (34.4, 36.0)       # titulo discreto sobre negro

HITS = {
    'braam': [4, 20, 32],      # golpes grandes
    'impact': [10, 12],        # golpes medios (cortes)
    'title': [34.4],
}
# tambores de trailer en la seccion de accion (beat, intensidad)
TOMS = [(23, 1.0), (23.75, 0.6), (24.5, 0.8), (25, 1.0), (26, 0.7), (26.5, 0.7), (27, 1.0),
        (27.75, 0.6), (28.5, 0.8), (29, 1.0), (29.5, 0.8), (29.75, 0.9)]
TICKS = (4, 12)            # tic-tac de tension (corcheas)


def segment_at(beat):
    for s in SEGMENTS:
        if s[0] <= beat < s[1]:
            return s
    return None


def src_time(t):
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
