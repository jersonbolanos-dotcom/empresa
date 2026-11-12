# (Episodio Musk/Zhao) Alineación palabra a palabra SIN modelo de reconocimiento de voz (no había ASR disponible en el entorno).
# Método: 1) pausas mayores (ffmpeg silencedetect -38 dB, >=0.25 s) delimitan 28 tramos de voz que coinciden 1:1
# con las frases/pausas del guion; 2) pausas menores (-36 dB, >=0.09 s) se encajan en el límite de palabra más
# cercano; 3) dentro de cada sub-tramo el tiempo se reparte por sílabas habladas.
# Precisión esperada: límites de frase ~±0.05 s; palabras interiores ~±0.25 s.
# Uso: python3 -I alinear.py sil_mayor.txt sil_menor.txt DURACION salida.json [tramos.txt]
# tramos.txt (opcional): una línea por tramo de voz, en el orden de la voz; cifras con forma hablada «1963|mil_novecientos_sesenta_y_tres».
import json, re, sys

MAJOR, MINOR, DUR, OUT = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
TRAMOS = sys.argv[5] if len(sys.argv) > 5 else None

# (texto mostrado, forma hablada para contar sílabas). Una entrada por tramo de voz.
SEGS = [
    "Imagina que un submarino está a cientos de metros bajo el océano.",
    "De repente, algo falla…",
    "y comienza a hundirse.",
    "La tripulación intenta regresar a la superficie, pero el submarino no responde.",
    "Para entender por qué, hay que conocer sus tanques de lastre.",
    "Cuando un submarino quiere sumergirse, permite que el agua entre en estos tanques, aumentando su peso.",
    "Y para volver a subir, utiliza aire comprimido para expulsar el agua.",
    "Pero, ¿qué ocurre si ese sistema de emergencia falla?",
    "En 1963,|mil_novecientos_sesenta_y_tres el submarino nuclear estadounidense USS|u_ese_ese Thresher se hundió durante unas pruebas en el Atlántico.",
    "Las investigaciones identificaron una posible cadena de fallos que incluyó problemas en el sistema de propulsión y dificultades para expulsar el agua de los tanques de lastre.",
    "A medida que descendía, la presión del océano aumentaba…",
    "hasta que el casco no pudo soportarla.",
    "Las 129|ciento_veintinueve personas que iban a bordo perdieron la vida.",
    "El océano no necesita una grieta para convertirse en una amenaza.",
    "A veces, basta con que un sistema de emergencia no funcione cuando más se necesita.",
    "Asombroteca.",
    "La ciencia oculta de lo imposible.",
]

if TRAMOS:
    # v1.27: las etiquetas de interpretación de ElevenLabs v4 ([short pause], [long pause], [whispers]…) y <break …/> se quitan:
    # nunca salen en los subtítulos. Los puntos suspensivos se conservan.
    _tag = lambda l: re.sub(r'\s+', ' ', re.sub(r'\[[^\]]*\]|<[^>]*>', ' ', l)).strip()
    # v1.28: una línea que sea SOLO «[PAUSA x]» (0,3 ≤ x ≤ 1,0 s) inserta x s de silencio exacto entre el tramo anterior y el
    # siguiente (posproducción: los tramos de voz no se tocan). Un «[PAUSA …]» mal escrito, fuera de rango o dentro de una línea
    # de texto es un ERROR (no se ignora). El resto de etiquetas entre corchetes se siguen quitando.
    PAUSA_OK = re.compile(r'^\s*\[\s*pausa\s+([0-9]+(?:[.,][0-9]+)?)\s*s?\s*\]\s*$', re.I)
    # v1.29: «[GANCHO A|B|C] texto» marca los tramos de cada gancho grabado en la MISMA toma; van todos antes del cuerpo.
    # Un gancho puede ocupar varias líneas seguidas con la misma letra. Sin ganchos, todo funciona como en la v1.28.
    GANCHO_OK = re.compile(r'^\s*\[\s*gancho\s+([abc])\s*\]\s*(.*)$', re.I)
    SEGS, PAUSAS_POST, GANCHOS = [], [], {}
    _cuerpo, _ultima = False, None
    for n, l in enumerate(open(TRAMOS, encoding='utf-8'), 1):
        if not l.strip() or l.startswith('#'):
            continue
        g = GANCHO_OK.match(l)
        if g:
            letra, t = g.group(1).upper(), _tag(g.group(2))
            if _cuerpo:
                sys.exit(f'ERROR tramos.txt línea {n}: los [GANCHO …] deben ir TODOS antes del cuerpo')
            if not t:
                sys.exit(f'ERROR tramos.txt línea {n}: [GANCHO {letra}] sin texto')
            if letra in GANCHOS and _ultima != letra:
                sys.exit(f'ERROR tramos.txt línea {n}: las líneas del [GANCHO {letra}] deben ir seguidas')
            GANCHOS.setdefault(letra, []).append(len(SEGS)); SEGS.append(t); _ultima = letra; continue
        if re.search(r'\[\s*gancho\b', l, re.I):
            sys.exit(f'ERROR tramos.txt línea {n}: «{l.strip()}» — escribe [GANCHO A], [GANCHO B] o [GANCHO C] al principio de la línea, seguido del texto')
        m = PAUSA_OK.match(l)
        if m and GANCHOS and not _cuerpo:
            sys.exit(f'ERROR tramos.txt línea {n}: no se puede poner [PAUSA] entre los ganchos ni justo antes del cuerpo')
        if m:
            x = float(m.group(1).replace(',', '.'))
            if not 0.3 <= x <= 1.0:
                sys.exit(f'ERROR tramos.txt línea {n}: «{l.strip()}» — la pausa debe estar entre 0.3 y 1.0 s')
            if not SEGS:
                sys.exit(f'ERROR tramos.txt línea {n}: una [PAUSA] no puede ir antes del primer tramo de voz')
            PAUSAS_POST.append([len(SEGS) - 1, x]); continue
        if re.search(r'\[\s*pausa\b', l, re.I):
            sys.exit(f'ERROR tramos.txt línea {n}: «{l.strip()}» — [PAUSA x] debe ir sola en su línea, con x entre 0.3 y 1.0')
        t = _tag(l)
        if t:
            SEGS.append(t); _cuerpo = True
    if GANCHOS and not _cuerpo:
        sys.exit('ERROR tramos.txt: hay [GANCHO …] pero falta el cuerpo del guion')
    if PAUSAS_POST and PAUSAS_POST[-1][0] >= len(SEGS) - 1:
        sys.exit('ERROR tramos.txt: una [PAUSA] no puede ir después del último tramo de voz')

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

segs = [{"i": i, "s": round(a, 3), "e": round(b, 3), "text": re.sub(r"(\S+)\|\S+", r"\1", SEGS[i])} for i, (a, b) in enumerate(speech)]
ORIG_WORDS = [dict(r) for r in result]   # v1.29: copia en el tiempo ORIGINAL de la voz (antes de las pausas de posproducción)
# v1.28 · pausas de posproducción: silencio insertado en el centro del hueco entre el tramo k y el k+1; todo lo que sigue se desplaza
PP = globals().get('PAUSAS_POST', [])
extra = {}
pausas_post = []
total = 0.0
for k, x in PP:
    t_ins = round((speech[k][1] + speech[k + 1][0]) / 2, 3)
    pausas_post.append({"tras_tramo": k, "t": t_ins, "t_montado": round(t_ins + total, 3), "dur": x}); total += x
for p in pausas_post:
    for r in result:
        if r["seg"] > p["tras_tramo"]:
            r["s"] = round(r["s"] + p["dur"], 3); r["e"] = round(r["e"] + p["dur"], 3)
    first = next(r for r in result if r["seg"] == p["tras_tramo"] + 1); first["pausa"] = round(first.get("pausa", 0) + p["dur"], 3)
    for g in segs:
        g.setdefault("s0", g["s"]); g.setdefault("e0", g["e"])
        if g["i"] > p["tras_tramo"]:
            g["s"] = round(g["s"] + p["dur"], 3); g["e"] = round(g["e"] + p["dur"], 3)
if pausas_post:
    extra = {"pausas_post": pausas_post, "duracion_original": round(DUR, 6)}
for r in result:
    r["w"] = r["w"]
json.dump({"duration": round(DUR + total, 6) if pausas_post else DUR, "speech_end": round(speech[-1][1] + total, 3), "segments": segs, "words": result,
           "method": "silencedetect + reparto silábico; sin ASR", **extra}, open(OUT, "w"), ensure_ascii=False, indent=1)

# ---- v1.29 · una alineación por variante de gancho: el gancho elegido + el cuerpo, con los tiempos desplazados ----
GN = globals().get('GANCHOS', {})
if GN:
    import os
    cuerpo = max(i for v in GN.values() for i in v) + 1
    ult = cuerpo - 1
    cola = lambda k: min(0.06, max(0.0, (speech[k + 1][0] - speech[k][1]) / 2))   # deja salir la cola de la voz
    c0 = round(speech[ult][1] + cola(ult), 3)   # el cuerpo arranca donde acaba el último gancho: su silencio original
    pp_orig = [(p["t"], p["dur"], p["tras_tramo"]) for p in pausas_post]
    resumen = {}
    for L in sorted(GN):
        idx = GN[L]; h0 = round(max(0.0, speech[idx[0]][0] - 0.05), 3); h1 = round(speech[idx[-1]][1] + cola(idx[-1]), 3)
        trozos = [[h0, h1], [c0, round(DUR, 6)]] if h1 < c0 - 1e-6 else [[h0, round(DUR, 6)]]
        # montaje en el tiempo original: copiar [de, a] tal cual o insertar silencio exacto (pausas de posproducción del cuerpo)
        montaje = []
        for de, a in trozos:
            cur = de
            for t, d, _ in pp_orig:
                if de < t < a:
                    montaje += [{"de": cur, "a": t}, {"silencio": d}]; cur = t
            montaje.append({"de": cur, "a": a})
        def mapa(t, montaje=montaje):
            off = 0.0
            for m in montaje:
                if "silencio" in m:
                    off += m["silencio"]; continue
                if m["de"] - 1e-6 <= t <= m["a"] + 1e-6:
                    return round(off + t - m["de"], 3)
                off += m["a"] - m["de"]
            return round(off, 3)
        total = sum(m.get("silencio", 0) + (m["a"] - m["de"] if "de" in m else 0) for m in montaje)
        keep = idx + list(range(cuerpo, len(SEGS))); nuevo = {o: n for n, o in enumerate(keep)}
        vw = []
        for r in ORIG_WORDS:
            if r["seg"] in nuevo:
                q = {"w": r["w"], "s": mapa(r["s"]), "e": mapa(r["e"]), "seg": nuevo[r["seg"]]}
                vw.append(q)
        for t, d, k in pp_orig:   # marca de pausa en la primera palabra tras cada pausa de posproducción
            f = next(q for q in vw if q["seg"] == nuevo[k + 1]); f["pausa"] = round(f.get("pausa", 0) + d, 3)
        vs = [{"i": nuevo[i], "s": mapa(speech[i][0]), "e": mapa(speech[i][1]), "s0": round(speech[i][0], 3), "e0": round(speech[i][1], 3),
               "text": re.sub(r"(\S+)\|\S+", r"\1", SEGS[i])} for i in keep]
        base, ext = os.path.splitext(OUT)
        json.dump({"duration": round(total, 6), "speech_end": mapa(speech[-1][1]), "segments": vs, "words": vw, "gancho": L,
                   "montaje": montaje, "duracion_original": round(DUR, 6),
                   "pausas_post": [{"tras_tramo": nuevo[k], "t": t, "t_montado": mapa(t) + 0, "dur": d} for t, d, k in pp_orig],
                   "method": "silencedetect + reparto silábico; sin ASR · variante de gancho (v1.29)"},
                  open(f"{base}_{L}{ext}", "w"), ensure_ascii=False, indent=1)
        resumen[L] = round(total, 2)
    d = json.load(open(OUT)); d["ganchos"] = {L: GN[L] for L in sorted(GN)}; d["cuerpo_desde"] = cuerpo
    json.dump(d, open(OUT, "w"), ensure_ascii=False, indent=1)
    print("variantes de gancho:", ", ".join(f"{L} = {v} s" for L, v in resumen.items()))
if pausas_post:
    print("pausas de posproducción:", ", ".join(f"{p['dur']} s tras el tramo {p['tras_tramo']}" for p in pausas_post))
print(len(result), "palabras;", len(segs), "tramos")
