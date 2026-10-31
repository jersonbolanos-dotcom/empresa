# (Episodio Musk/Zhao) Alineación palabra a palabra SIN modelo de reconocimiento de voz (no había ASR disponible en el entorno).
# Método: 1) pausas mayores (ffmpeg silencedetect -38 dB, >=0.25 s) delimitan 28 tramos de voz que coinciden 1:1
# con las frases/pausas del guion; 2) pausas menores (-36 dB, >=0.09 s) se encajan en el límite de palabra más
# cercano; 3) dentro de cada sub-tramo el tiempo se reparte por sílabas habladas.
# Precisión esperada: límites de frase ~±0.05 s; palabras interiores ~±0.25 s.
# Uso: python3 -I alinear.py sil_mayor.txt sil_menor.txt DURACION salida.json
import json, re, sys

MAJOR, MINOR, DUR, OUT = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]

# (texto mostrado, forma hablada para contar sílabas). Una entrada por tramo de voz.
SEGS = [
    "Elon Musk se burló del gigantesco robo a Binance…",
    "pero su fundador le respondió recordándole una inversión de mil millones de dólares.",
    "Todo comenzó cuando Binance sufrió un ataque de más de seis mil millones de dólares.",
    "Mientras la empresa prometía devolver el dinero a sus usuarios, alguien comparó la situación con la quiebra de FTX.|efe_te_equis",
    "Musk reaccionó con una mueca y después publicó emojis de risa y fuego.",
    "Pero Changpeng Zhao, fundador de Binance, no se quedó callado.",
    "Le escribió:",
    "«Elon, te respeto mucho,",
    "pero este no es momento para burlarte.",
    "Por favor, detente».",
    "Y entonces llegó la sorpresa.",
    "Zhao recordó que Binance había invertido quinientos millones de dólares para ayudar a Musk a comprar Twitter.",
    "Según él, esa inversión ahora está vinculada a acciones de SpaceX valoradas en más de mil millones de dólares.",
    "Aunque Binance aseguró que no necesita venderlas para cubrir las pérdidas.",
    "Lo que comenzó con unos emojis terminó en una discusión entre multimillonarios.",
    "¿Tú de qué lado estás?",
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

segs = [{"i": i, "s": round(a, 3), "e": round(b, 3), "text": SEGS[i].replace("FTX.|efe_te_equis", "FTX.").replace("29|veintinueve", "29").replace("2026,|dos_mil_veintiséis", "2026,").replace("31|treinta_y_uno", "31")} for i, (a, b) in enumerate(speech)]
for r in result:
    r["w"] = r["w"]
json.dump({"duration": DUR, "speech_end": round(speech[-1][1], 3), "segments": segs, "words": result,
           "method": "silencedetect + reparto silábico; sin ASR"}, open(OUT, "w"), ensure_ascii=False, indent=1)
print(len(result), "palabras;", len(segs), "tramos")
