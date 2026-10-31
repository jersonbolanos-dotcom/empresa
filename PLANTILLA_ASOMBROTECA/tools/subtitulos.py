# Genera subtítulos (frases de 2-6 palabras, máx. 2 líneas) desde alineacion.json
# Salidas: 06_SUBTITULOS/subtitulos.srt y 04_CODIGO/js/datos.js (palabras + frases para el canvas)
# Uso: python3 -I subtitulos.py alineacion.json subtitulos.srt datos.js
import json, sys
src, srt_out, js_out = sys.argv[1:4]
d = json.load(open(src))
W = d["words"]
MAXW, MAXC = 6, 24

def ends_phrase(w):
    return w[-1] in ",.?…:;" if w else False

# 1) cláusulas: dentro de cada tramo de voz, cortar en signos de puntuación
clauses, cur = [], []
for i, w in enumerate(W):
    cur.append(w)
    nxt = W[i + 1] if i + 1 < len(W) else None
    if nxt is None or nxt["seg"] != w["seg"] or ends_phrase(w["w"]):
        clauses.append(cur); cur = []
# fusionar cláusulas de 1 palabra con la siguiente del mismo tramo ("Investigadores," + ...)
cl2 = []
for c in clauses:
    if cl2 and len(cl2[-1]) == 1 and cl2[-1][0]["seg"] == c[0]["seg"] and not cl2[-1][0]["w"].endswith(("…", ".", "?")):
        cl2[-1] = cl2[-1] + c
    else:
        cl2.append(c)
# 2) repartir cada cláusula en trozos equilibrados de 2-6 palabras y <= 2 líneas
import math
chunks = []
for c in cl2:
    n = len(c); chars = sum(len(x["w"]) + 1 for x in c)
    k = max(math.ceil(n / MAXW), math.ceil(chars / (MAXC * 1.6)), 1)
    while k > 1 and n / k < 2: k -= 1
    base, extra = divmod(n, k); pos = 0
    for j in range(k):
        m = base + (1 if j < extra else 0)
        chunks.append(c[pos:pos + m]); pos += m

def lines(c):
    txt = " ".join(x["w"] for x in c)
    if len(txt) <= MAXC: return [txt]
    best = None
    for k in range(1, len(c)):
        a = " ".join(x["w"] for x in c[:k]); b = " ".join(x["w"] for x in c[k:])
        sc = max(len(a), len(b))
        if best is None or sc < best[0]: best = (sc, [a, b])
    return best[1]

def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

out = []
phr = []
for i, c in enumerate(chunks):
    s = c[0]["s"]; e = c[-1]["e"]
    # mantener el subtítulo hasta el siguiente o +0.35 s tras la última palabra
    nxt = chunks[i + 1][0]["s"] if i + 1 < len(chunks) else d["duration"]
    e_show = min(nxt, e + 0.35)
    L = lines(c)
    out.append(f"{i + 1}\n{ts(s)} --> {ts(e_show)}\n" + "\n".join(L) + "\n")
    phr.append({"s": round(s, 3), "e": round(e_show, 3), "lines": L,
                "w": [{"w": x["w"], "s": x["s"], "e": x["e"]} for x in c]})
open(srt_out, "w").write("\n".join(out))
open(js_out, "w").write("// Generado por tools/subtitulos.py desde alineacion.json (no editar a mano)\n"
                        "window.ALIGN = " + json.dumps({"duration": d["duration"], "speech_end": d["speech_end"],
                                                       "segments": d["segments"], "words": d["words"], "phrases": phr},
                                                      ensure_ascii=False) + ";\n")
print(len(chunks), "subtítulos")
