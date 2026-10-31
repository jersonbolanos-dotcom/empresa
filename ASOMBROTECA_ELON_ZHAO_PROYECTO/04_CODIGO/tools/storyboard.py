# Genera 03_STORYBOARD/storyboard.html (12 paneles Canvas con el mismo código del video) y MAPA_ESCENAS.md
# Uso: python3 -I tools/storyboard.py   (desde 04_CODIGO, después de tools/build.py)
import json, os, html
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = lambda p: open(os.path.join(root, p), encoding='utf-8').read()
d = json.loads(R('alineacion.json')); seg = d['segments']
span = lambda a, b: (seg[a]['s'], seg[b]['e'])
loc = lambda a, b: ' '.join(seg[i]['text'] for i in range(a, b + 1))
BEATS = [
 (1, 'Gancho', 0, 0, 2.8, 'Ficha de Musk + titular recortado «MUSK vs BINANCE» (rotulador rojo en «se burló») + emblema de Binance; tira «US$1.000 MILLONES» tapada por una solapa', 'Apertura: primer recorte a 0,05 s', 'papel, cinta, rotulador, sello', 'X: —'),
 (2, 'La respuesta', 1, 1, 7.5, 'Entra la ficha de Zhao (fundador); flecha de tinta de Zhao a Musk en «respondió»; la solapa deja ver «US$1.000» en «mil millones» y lo vuelve a tapar', 'Continuo', 'papel, pluma, subrayador', '—'),
 (3, 'El ataque', 2, 2, 13.6, 'Recorte de noticia «BINANCE SUFRE UN HACKEO» (29-30 oct) con subrayado en BINANCE; tira «+US$6.000 MILLONES» en «seis mil»; nota «reportes: unos US$6.300 millones»', 'Latigazo con desenfoque: cambio de argumento', 'whoosh, papel, sello + golpe', 'Reportes de prensa'),
 (4, 'Comparación con FTX', 3, 3, 20.5, 'Tira «PROMESA: CUBRIR A LOS USUARIOS»; recorte de archivo «FTX SE DECLARA EN QUIEBRA (nov 2022)» con círculo rojo; línea discontinua y tira «COMPARACIÓN EN X» (nunca «=»)', 'Travelling vertical por el mismo papel', 'subrayador, pluma, sello', '—'),
 (5, 'Reacciones de Musk', 4, 4, 25.8, 'X-01 (😬, ante la comparación con FTX) con círculo rojo; X-02 (🔥😂, otro hilo: aviso de CZ del 28 oct). Emojis en el orden de la voz: risa, fuego', 'Latigazo', 'papel, pop por emoji, rotulador', 'X-01, X-02'),
 (6, 'Zhao no se queda callado', 5, 6, 28.6, 'Una hoja nueva sube a 12 fps; la ficha de Zhao entra y empuja fuera la de Musk; «FUNDADOR DE BINANCE» subrayado; «NO SE QUEDÓ CALLADO»', 'Hoja que sube: cambio de autor', 'papel, cinta, sello', '—'),
 (7, 'La cita', 7, 9, 36.6, 'X-03: fragmento original en inglés subrayado al ritmo de la voz («Elon, have a lot of respect» → «bad time to troll.» → «Please stop.» con círculo); la traducción va en los subtítulos', 'Continuo', 'subrayador por frase, rotulador', 'X-03'),
 (8, 'La sorpresa', 10, 10, 39.0, 'La MISMA hoja se despliega y revela su parte inferior (X-04, mismo post)', 'Pliegue de papel: misma fuente', 'papel largo + riser', 'X-04 = X-03'),
 (9, 'US$500 millones', 11, 11, 45.8, 'Se subraya «$500m investment in your Twitter takeover»; la tira «US$500 MILLONES» se desdobla; flecha de tinta Binance → Twitter (logos oficiales) «compra de Twitter · 2022»', 'Continuo', 'cinta, sello, pluma', 'X-04'),
 (10, 'SpaceX: más de 1.000 M', 12, 12, 52.4, 'Hilo rojo desde la inversión hasta el logo de SpaceX (SPCX); sello «SEGÚN ZHAO»; tira «+US$1.000 MILLONES»; «valoración declarada por Zhao · no auditada»', 'Continuo: la misma inversión se transforma', 'pluma, sello, golpe', 'X-04'),
 (11, 'No necesitan vender', 13, 13, 56.6, 'X-05 «RESUMEN EDITORIAL · NO ES CITA LITERAL» (Yi He, sin retrato); certificado de acciones ilustrativo con «VENDER» tachado; «NO NECESITAN VENDER»', 'Latigazo', 'papel, rotulador ×2, error', 'X-05'),
 (12, 'Mosaico y pregunta', 14, 15, 63.6, 'MOTIVO (😬🔥😂) / RESPUESTA («Please stop.») / INVERSIÓN (500M → +1.000M), unidos con tinta; se apartan y quedan Musk y Zhao enfrentados con «¿TÚ DE QUÉ LADO ESTÁS?» y «ASOMBROTECA»', 'Retroceso de cámara', 'papel ×3, pluma, sellos', '—'),
]
POSTS = [
 ('X-01', '@elonmusk · 30 oct 2026', 'https://x.com/elonmusk/status/2116025797400236362', '😬 (ante la comparación pública con FTX)', 'Extracto editorial reconstruido; no es captura', 'Beat 05 y mosaico'),
 ('X-02', '@elonmusk · 30 oct 2026', 'https://x.com/elonmusk/status/2116034884393213964', '🔥😂 (respuesta a un aviso de CZ del 28 oct; otro hilo)', 'Extracto editorial reconstruido; no es captura', 'Beat 05 y mosaico'),
 ('X-03', '@cz_binance · 30 oct 2026', 'https://x.com/cz_binance/status/2116097554882728341', '“Elon, have a lot of respect for you, but bad time to troll. Please stop.”', 'Fragmento real citado por prensa; maquetación propia', 'Beat 07'),
 ('X-04', '@cz_binance · 30 oct 2026 (MISMO post que X-03)', 'https://x.com/cz_binance/status/2116097554882728341', '“Our SPCX shares (from our $500m investment in your Twitter takeover) are worth more than a billion.”', 'Fragmento real citado por prensa; se revela desplegando la misma hoja', 'Beats 08-10'),
 ('X-05', '@heyibinance · 30 oct 2026', 'https://x.com/heyibinance/status/2116101170079076558', 'Paráfrasis (Reuters): los ingresos anuales cubrirían las pérdidas; no necesitan vender', 'RESUMEN EDITORIAL · NO ES CITA LITERAL', 'Beat 11'),
]
cards = []
for (n, name, a, b, kt, what, trans, snd, src) in BEATS:
    s0, e0 = span(a, b)
    cards.append(f'<article class="card"><canvas width="1080" height="1920" data-t="{kt}"></canvas><div class="meta"><div class="num">{n:02d} · {html.escape(name)}</div><div class="time">{s0:.2f}–{e0:.2f} s · fotograma {kt:.2f} s</div><p class="vo">«{html.escape(loc(a, b))}»</p><dl><dt>Protagonista y cambio</dt><dd>{html.escape(what)}</dd><dt>Transición</dt><dd>{html.escape(trans)}</dd><dt>Sonido</dt><dd>{html.escape(snd)}</dd><dt>Publicación</dt><dd>{html.escape(src)}</dd></dl></div></article>')
rows = ''.join(f'<tr><td>{p[0]}</td><td>{html.escape(p[1])}</td><td><a href="{p[2]}">{p[2]}</a></td><td>{html.escape(p[3])}</td><td>{html.escape(p[4])}</td><td>{html.escape(p[5])}</td></tr>' for p in POSTS)
js = lambda p: '<script>/* ' + p + ' */\n' + R(p).replace('</script', '<\\/script') + '\n</script>'
fotos = json.loads(R('js/fotos.js').split('window.FOTOS = ', 1)[1].rstrip().rstrip(';'))
foto_txt = 'Fotos reales incluidas: ' + ', '.join(k for k, v in fotos.items() if v) if any(fotos.values()) else 'Fotos reales NO incluidas: la red del entorno bloqueó upload.wikimedia.org. Las fichas de Musk y Zhao son tipográficas (nombre, cuenta y papel con trama abstracta), sin rostros inventados. Al añadir los JPG con licencia en 04_CODIGO/recursos/fotos/ se sustituyen automáticamente.'
page = f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Storyboard Musk vs Zhao</title><style>{R('fonts/fuentes.css')}
:root{{--bg:#efe8d8;--ink:#1a1816;--red:#b8483a;--line:#c9a878}} body{{margin:0;background:var(--bg);color:var(--ink);font-family:Oswald,system-ui,sans-serif}}
header,section{{max-width:1280px;margin:auto;padding:24px 16px 8px}} h1{{font:400 44px Anton;margin:0}} h2{{font:400 28px Anton}} p{{line-height:1.5}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;padding:16px;max-width:1280px;margin:auto}}
.card{{background:#f5f1e7;border:1px solid var(--line);border-radius:6px;overflow:hidden;box-shadow:0 4px 14px rgba(40,28,15,.15)}} canvas{{width:100%;height:auto;display:block}}
.meta{{padding:12px 14px 16px}} .num{{font:400 22px Anton;color:var(--red)}} .time{{font:400 12px ui-monospace,monospace;color:#6b5a40}} .vo{{font:italic 400 14px "Libre Baskerville"}} dl{{font-size:13px;margin:0}} dt{{font-weight:700;margin-top:6px}} dd{{margin:0}}
table{{border-collapse:collapse;font-size:13px;width:100%}} td{{border:1px solid var(--line);padding:6px;vertical-align:top}} .wrap{{overflow-x:auto}}
</style></head><body><header><h1>Storyboard · Musk vs Zhao</h1><p>Editorial Essay Collage · 1080×1920 · tiempos del audio real ({d['duration']:.3f} s + 1 s de cola). Paneles dibujados con el mismo código del video.</p></header>
<div class="grid">{''.join(cards)}</div>
<section><h2>Publicaciones (X-01…X-05)</h2><div class="wrap"><table><tr><td>Código</td><td>Autor · fecha</td><td>URL</td><td>Fragmento / contenido</td><td>Tratamiento</td><td>Escena</td></tr>{rows}</table></div>
<h2>Fotografías y licencias</h2><p>{html.escape(foto_txt)}</p>
<h2>Hechos no confirmados y límites</h2><ul><li>Cifra de las acciones SPCX (&gt;US$1.000 M): afirmación de Zhao, no auditada.</li><li>Texto literal del post de Yi He no verificado (X bloqueado): se muestra como resumen.</li><li>Las tarjetas son extractos editoriales: no imitan la interfaz de X (sin avatar, likes ni verificaciones).</li><li>Alineación por pausas + sílabas (sin ASR).</li></ul></section>
{js('lib/harness.js')}{js('js/datos.js')}{js('js/recursos.js')}{js('js/fotos.js')}{js('js/editorial-collage-core-adaptado.js')}{js('js/episodio.js')}
<script>(async()=>{{try{{await Promise.all(['400 40px "Anton"','500 40px "Oswald"','700 40px "Oswald"','700 40px "Libre Baskerville"','italic 400 40px "Libre Baskerville"'].map(f=>document.fonts.load(f,'AaZz09')));}}catch(e){{}}
await window.EPISODIO.init();for(const c of document.querySelectorAll('canvas[data-t]')){{window.EPISODIO.explainer(c.getContext('2d'),1080,1920,Number(c.dataset.t));}}window.__ready=true;}})();</script></body></html>'''
open(os.path.join(root, '..', '03_STORYBOARD', 'storyboard.html'), 'w', encoding='utf-8').write(page)
md = ['# Mapa de escenas · Musk vs Zhao', '', '| # | Locución | Tiempo (s) | Protagonista y cambio | Transición | Sonido | Publicación |', '|---|---|---|---|---|---|---|']
for (n, name, a, b, kt, what, trans, snd, src) in BEATS:
    s0, e0 = span(a, b); md.append(f'| {n:02d} {name} | «{loc(a, b)}» | {s0:.2f}–{e0:.2f} | {what} | {trans} | {snd} | {src} |')
open(os.path.join(root, '..', '03_STORYBOARD', 'MAPA_ESCENAS.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print('storyboard ok')
