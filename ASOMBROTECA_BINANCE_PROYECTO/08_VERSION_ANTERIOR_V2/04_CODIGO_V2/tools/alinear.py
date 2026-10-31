# Alineación palabra a palabra SIN modelo de reconocimiento de voz (no había ASR disponible en el entorno).
# Método: 1) pausas mayores (ffmpeg silencedetect -38 dB, >=0.25 s) delimitan 28 tramos de voz que coinciden 1:1
# con las frases/pausas del guion; 2) pausas menores (-36 dB, >=0.09 s) se encajan en el límite de palabra más
# cercano; 3) dentro de cada sub-tramo el tiempo se reparte por sílabas habladas.
# Precisión esperada: límites de frase ~±0.05 s; palabras interiores ~±0.25 s.
# Uso: python3 -I alinear.py sil_mayor.txt sil_menor.txt DURACION salida.json
import json, re, sys

MAJOR, MINOR, DUR, OUT = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]

# (texto mostrado, forma hablada para contar sílabas). Una entrada por tramo de voz.
SEGS = [
    "El 29|veintinueve de octubre de 2026,|dos_mil_veintiséis algo increíble ocurrió en Binance,",
    "una de las mayores plataformas",
    "de criptomonedas del mundo.",
    "En aproximadamente veinte minutos, unos atacantes consiguieron sustraer la mayor parte de una fortuna valorada en seis mil trescientos millones de dólares.",
    "No entraron a una bóveda.",
    "No se llevaron billetes.",
    "Entonces…",
    "¿cómo pudieron robar tanto dinero?",
    "Todo comienza con las llamadas billeteras calientes.",
    "Son sistemas conectados a internet que permiten a plataformas como Binance mover criptomonedas rápidamente.",
    "Pero para realizar esos movimientos, deben existir autorizaciones digitales seguras.",
    "Durante el ataque, los delincuentes consiguieron ejecutar retiros que Binance no había autorizado.",
    "La empresa todavía investiga cómo fueron comprometidos sus sistemas.",
    "Y aquí comienza lo más sorprendente.",
    "Cuando una transferencia queda confirmada en una cadena de bloques, normalmente no existe un botón para deshacerla.",
    "Los fondos comenzaron a distribuirse hacia direcciones controladas por los atacantes, a través de diferentes redes.",
    "Cada movimiento dejaba un rastro digital.",
    "Pero poder seguir ese rastro no significa que sea posible recuperar el dinero.",
    "Entonces comenzó una carrera contra el tiempo.",
    "Investigadores, plataformas y emisores de criptomonedas intentaron localizar los activos y congelar aquellos que podían bloquearse.",
    "Binance anunció que cubriría las pérdidas con recursos propios.",
    "Y el 31|treinta_y_uno de octubre informó que ya había repuesto el equivalente al noventa por ciento de los activos afectados.",
    "Pero atención.",
    "Eso no significa que hubiera recuperado el noventa por ciento de lo robado.",
    "Este ataque dejó una lección inquietante.",
    "En el mundo digital, una autorización comprometida puede permitir el movimiento de miles de millones de dólares en cuestión de minutos.",
    "Asombroteca.",
    "La ciencia oculta de lo imposible.",
]

def syl(w):
    w = w.lower().replace("_", " ")
    w = re.sub(r"[^a-záéíóúüñ ]", "", w)
    n = 0
    for tok in w.split():
        # grupos vocálicos; hiatos con tilde en i/u cuentan doble
        g = re.findall(r"[aeiouáéíóúü]+", tok)
        c = 0
        for v in g:
            c += 1
            if len(v) > 1 and (re.search(r"[íú]", v) or re.search(r"[aeoáéó][aeoáéó]", v)):
                c += 1
        n += max(1, c)
    return max(1, n)

def words_of(seg):
    out = []
    for tok in seg.split(" "):
        if "|" in tok:
            shown, spoken = tok.split("|", 1)
            # el resto de la forma hablada se pega a la palabra mostrada
            out.append([shown, spoken])
        else:
            out.append([tok, tok])
    # 'de 2026,|dos_mil_veintiséis' -> la forma hablada llega pegada al token "2026,"
    return out

def read_pairs(p):
    return [tuple(map(float, l.split())) for l in open(p) if l.strip()]

major = read_pairs(MAJOR)
speech = []
prev = 0.0
for s, e in major:
    if s - prev > 0.05: speech.append([prev, s])
    prev = e
if DUR - prev > 0.05: speech.append([prev, DUR])
# primer tramo arranca con la voz: el audio empieza con voz casi inmediata
minor = [((s + e) / 2, e - s) for s, e in read_pairs(MINOR)]
assert len(speech) == len(SEGS), (len(speech), len(SEGS))

# fin de habla real: el último silencio menor que llega al final
last_end = DUR
for s, e in read_pairs(MINOR):
    if e >= DUR - 0.01: last_end = s
speech[-1][1] = min(speech[-1][1], last_end)
# inicio real de voz (inicio del fichero = voz a ~0.05 s)
speech[0][0] = 0.05

result = []
for si, ((a, b), seg) in enumerate(zip(speech, SEGS)):
    ws = words_of(seg)
    sy = [syl(sp) for _, sp in ws]
    tot = sum(sy)
    # límites previstos
    bounds = [a]
    acc = 0
    for k in sy[:-1]:
        acc += k; bounds.append(a + (b - a) * acc / tot)
    bounds.append(b)
    # pausas menores dentro del tramo -> encajar
    fixed = {0: a, len(ws): b}
    for m, d in minor:
        if a + 0.15 < m < b - 0.15:
            j = min(range(1, len(ws)), key=lambda i: abs(bounds[i] - m)) if len(ws) > 1 else None
            if j is not None and abs(bounds[j] - m) < 0.7: fixed[j] = m
    keys = sorted(fixed)
    times = [None] * (len(ws) + 1)
    for k0, k1 in zip(keys, keys[1:]):
        t0, t1 = fixed[k0], fixed[k1]
        sub = sum(sy[k0:k1]); acc = 0
        for i in range(k0, k1 + 1):
            times[i] = t0 + (t1 - t0) * acc / sub if sub else t0
            if i < k1: acc += sy[i]
    for i, (shown, spoken) in enumerate(ws):
        result.append({"w": shown, "s": round(times[i], 3), "e": round(times[i + 1], 3), "seg": si})

segs = [{"i": i, "s": round(a, 3), "e": round(b, 3), "text": SEGS[i].replace("29|veintinueve", "29").replace("2026,|dos_mil_veintiséis", "2026,").replace("31|treinta_y_uno", "31")} for i, (a, b) in enumerate(speech)]
for r in result:
    r["w"] = r["w"]
json.dump({"duration": DUR, "speech_end": round(speech[-1][1], 3), "segments": segs, "words": result,
           "method": "silencedetect + reparto silábico; sin ASR"}, open(OUT, "w"), ensure_ascii=False, indent=1)
print(len(result), "palabras;", len(segs), "tramos")
