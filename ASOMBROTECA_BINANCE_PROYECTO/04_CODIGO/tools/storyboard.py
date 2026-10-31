# Genera 03_STORYBOARD/storyboard.html: 12 paneles Canvas dibujados con el MISMO código del video
# (H + estilo_base.js + binance.js) en el fotograma clave de cada beat, más la tabla de beats.
# Uso: python3 -I tools/storyboard.py   (desde 04_CODIGO)
import json, os, html
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = lambda p: open(os.path.join(root, p), encoding='utf-8').read()
d = json.loads(R('alineacion.json'))
seg = d['segments']
def span(a, b): return seg[a]['s'], (seg[b]['e'] if b < len(seg) else d['duration'])
def loc(a, b): return ' '.join(seg[i]['text'] for i in range(a, b + 1))
BEATS = [
 # (n, nombre, tramo_ini, tramo_fin, fotograma_clave, NUEVO protagonista y transformación, transición, cámara, sonido, dato auditado, visual V2 sustituido)
 (1, 'Binance', 0, 2, 8.5, 'Emblema de Binance 3D extruido en oro #F0B90B (trazado Simple Icons); barrido especular; perturbación roja a «ocurrió»; giro en «Binance»; fichas BTC/ETH/USDT/BNB orbitan en «plataformas de criptomonedas» (ejemplos).', 'Apertura: el emblema ya está iluminado en el fotograma 0.', 'Órbita lenta yaw −0.55→−0.12 y push-in.', 'sparkle del barrido, glitch ×2, whoosh del giro, pops de las fichas.', 'Fecha 29 oct 2026; Binance.', 'Placa negra genérica'),
 (2, 'Veinte minutos y miles de millones', 3, 3, 17.95, 'La cámara entra y baja: un anillo de 20 min en el suelo rodea el emblema; el valor sale por el anillo (oro→rojo tras «atacantes»); partículas suben a la cifra ≈US$6.300 M, que cuenta y se bloquea en «dólares».', 'Continuo: mismo emblema, nuevo plano.', 'Push-in y subida de pitch 0.24→0.46.', 'ticks del contador; bwoom + acorde.', '≈US$6.300 M (Binance); ≈6.360 M en 10 redes, mayor parte en ≈20 min (TRM).', 'Placa + número'),
 (3, 'No fue una bóveda', 4, 7, 23.4, 'Puerta de bóveda de acero (pernos, volante) y fajos 3D, tachados con la palabra; se desintegran en partículas oro hacia el dial de la cerradura, que sobrevive encendido.', 'Match cut: el dial circular de la cerradura se convierte en el indicador de autorización de la billetera.', 'Plano frontal, pitch 0.2.', 'impact, roller, slap+paper, sparkle, acorde del dial, bwoom en «¿cómo?».', 'Metáfora (sin dato).', 'Contornos 2D'),
 (4, 'Billetera caliente', 8, 9, 33.5, 'Dispositivo de vidrio y metal con pantalla: SALDO, filas de activos de ejemplo, flechas de entrada/salida, LED en línea y ondas de conexión; la cámara atraviesa el cristal y las conexiones salen a internet; fichas viajan por las líneas.', 'Match cut del dial; el dispositivo se ensambla desde el suelo.', 'Rodear y dolly-in a través del cristal (s 1.0→2.06).', 'whoosh del dial, boot, blips de conexión, ticks de tráfico.', 'Definición genérica.', 'Placa con filas'),
 (5, 'Autorización digital', 10, 10, 39.5, 'Tres tarjetas 3D: 1 Solicitud → 2 Verificación → 3 Firma (capa interna de Binance); haz oro hasta la billetera; la billetera emite a la cadena de bloques (capa de la red, cian).', 'Retroceso: aparece la capa de permisos encima y la de red delante.', 'Pull-back s 0.84, yaw 0.22→0.3.', 'select ×2, stamp de la firma, clic de la red.', 'Autorización interna ≠ validación en la red.', 'Placa dorada plana'),
 (6, 'Retiros no autorizados', 11, 12, 46.0, 'Tarjetas y pantalla en rojo (✕); el saldo baja; rutas rojas salen hacia direcciones externas. «RECREACIÓN CONCEPTUAL» y «Mecanismo: en investigación».', 'Continuo: el mismo haz cambia de color y destino.', 'La cámara sube y sigue la salida.', 'buzz, whoosh de salida, error, nota interrogativa.', 'Binance: retiros no autorizados; causa en investigación.', 'Placa roja'),
 (7, 'Confirmación en blockchain', 13, 14, 58.5, 'La operación entra como anotación roja en un bloque; 6 marcas de confirmación (ilustrativas); el bloque se sella con un candado cian; los enlaces encadenan bloques; «Deshacer» tachado con «normalmente».', 'La billetera sale de plano; la cadena pasa a protagonista.', 'Travelling a lo largo de la cadena.', 'ticks ×6, stamp, tachón + dos notas graves.', 'Propiedad general, con salvedad.', 'Cajas lisas'),
 (8, 'Dispersión y rastreo', 15, 17, 72.0, 'Grafo de rutas (V2 conservado) que nace del origen rojo de las salidas; retícula de rastreo salta de nodo en nodo; «SEGUIR UNA TRANSACCIÓN ≠ RECUPERAR EL DINERO».', 'La cámara sube a cenital sobre el mismo suelo.', 'Viaje cenital por el grafo.', 'tocks por llegada, barrido cian, blips de la retícula.', 'Rutas conceptuales, no un registro real.', 'Grafo + placa'),
 (9, 'Rastrear y congelar', 18, 19, 84.0, 'Algunos nodos pasan a turquesa con hexágono y candado; otros siguen emitiendo pulsos. ≈US$3.000 M «solo una parte».', 'Continuo.', 'Órbita cenital.', 'tic-tac, dings de congelamiento, bwoom.', '≈US$3.000 M congelados (Binance, 30 oct).', 'Igual + placa'),
 (10, 'Fuente independiente', 20, 20, 88.0, 'Torre de lingotes de reserva con el emblema de Binance, separada; flujo oro hasta la billetera, cuyo saldo se repone; las rutas del robo siguen fuera, en rojo tenue.', 'Retroceso que separa espacialmente las dos fuentes.', 'Plano 3/4 con la torre a la derecha.', 'thuds de los lingotes, sparkle, riser, bwoom.', 'SAFU, tesorería y fondo de seguros (Binance).', 'Bloque oro plano'),
 (11, 'El 90 %', 21, 23, 99.8, 'Indicador circular que llega directamente a 90 % (el 10 % restante en rojo tenue); «REPUESTO CON RECURSOS PROPIOS»; pulso rojo en «atención»; «NO SIGNIFICA 90 % RECUPERADO DEL ROBO».', 'Énfasis sobre el mismo plano.', 'Plano estable.', 'riser al valor final (sin cuenta), bwoom + acorde, corte musical, error.', '90 % repuesto (Binance, 31 oct).', 'Contador 0→90'),
 (12, 'Conclusión', 24, 27, 113.6, 'Vuelven las tarjetas de autorización y la billetera; en «comprometida» pasan a rojo y un rastro luminoso recorre firma → billetera → salidas; en «minutos» el candado se cierra; barrido de luz a blanco con el dial-candado y la frase final.', 'Barrido de luz propio del estilo.', 'Push-in final.', 'buzz, barrido del rastro, stamp del candado, barrido, acorde resolutivo.', 'Sin cifras nuevas.', 'Placa en blanco'),
]
cards = []
for (n, name, a, b, kt, tr, flow, camr, snd, dato, old) in BEATS:
    s, e = span(a, b)
    cards.append(f'''<article class="card"><canvas width="1080" height="1920" data-t="{kt}"></canvas>
<div class="meta"><div class="num">{n:02d} · {html.escape(name)}</div><div class="time">{s:.2f}–{e:.2f} s · fotograma clave {kt:.2f} s</div>
<p class="vo">«{html.escape(loc(a, b))}»</p>
<dl><dt>Transformación</dt><dd>{html.escape(tr)}</dd><dt>Entrada / salida</dt><dd>{html.escape(flow)}</dd><dt>Cámara</dt><dd>{html.escape(camr)}</dd><dt>Sonido</dt><dd>{html.escape(snd)}</dd><dt>Dato auditado</dt><dd>{html.escape(dato)}</dd><dt>Sustituye en V2</dt><dd>{html.escape(old)}</dd></dl></div></article>''')
js = lambda p: '<script>/* ' + p + ' */\n' + R(p).replace('</script', '<\\/script') + '\n</script>'
page = f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Storyboard Binance</title><style>{R('fonts/inter.css')}
:root{{--bg:#030304;--ink:#f5f5f7;--grey:#a1a1a6;--line:#1d2028;--gold:#f0b90b}}
body{{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,sans-serif}}
header{{padding:28px 16px 8px;max-width:1280px;margin:auto}} h1{{font:800 34px Inter;letter-spacing:-1px;margin:0}} header p{{color:var(--grey);margin:6px 0}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;padding:16px;max-width:1280px;margin:auto}}
.card{{background:#0b0c10;border:1px solid var(--line);border-radius:14px;overflow:hidden}} canvas{{width:100%;height:auto;display:block;background:#000}}
.meta{{padding:12px 14px 16px}} .num{{font:800 18px Inter;color:var(--gold)}} .time{{font:400 12px ui-monospace,monospace;color:var(--grey);margin-top:2px}}
.vo{{font:600 14px Inter;margin:10px 0}} dl{{margin:0;font-size:12.5px;line-height:1.45}} dt{{color:var(--grey);font-weight:600;margin-top:6px}} dd{{margin:0}}
section{{max-width:1280px;margin:auto;padding:8px 16px 40px;color:var(--grey);font-size:14px;line-height:1.55}} section h2{{color:var(--ink);font:800 20px Inter}}
</style></head><body>
<header><h1>Storyboard V3 · El robo de Binance</h1><p>12 fotogramas clave dibujados con el mismo código del video (H + Product Launch Reveal adaptado a 9:16). V3: un protagonista distinto por concepto. Tiempos = segundos del audio original (duración {d['duration']:.3f} s).</p></header>
<div class="grid">{''.join(cards)}</div>
<section><h2>Supuestos y límites</h2><ul>
<li>Alineación por pausas del audio + reparto silábico (sin reconocimiento de voz disponible): límites de frase ±0.05 s, palabras interiores ±0.25 s aprox.</li>
<li>Primeros tres tramos de voz: el reparto de la frase inicial entre las dos primeras pausas se infirió por densidad silábica.</li>
<li>Las rutas, direcciones y bloques son representación conceptual; no reproducen transacciones reales.</li>
<li>No se muestra el mecanismo del compromiso: la causa seguía en investigación el 31 oct 2026. La atribución de TRM Labs (TraderTraitor) se omite en pantalla porque la locución no la menciona.</li>
</ul></section>
{js('lib/harness.js')}{js('js/datos.js')}{js('js/estilo_base.js')}{js('js/logos.js')}{js('js/protagonistas.js')}{js('js/binance.js')}
<script>(async()=>{{try{{await Promise.all(['400 40px "Inter"','600 40px "Inter"','800 40px "Inter"'].map(f=>document.fonts.load(f,'AaZz09')));}}catch(e){{}}
for(const c of document.querySelectorAll('canvas[data-t]')){{const x=c.getContext('2d');window.BINANCE.explainer(x,1080,1920,Number(c.dataset.t));}}window.__ready=true;}})();</script>
</body></html>'''
open(os.path.join(root, '..', '03_STORYBOARD', 'storyboard.html'), 'w', encoding='utf-8').write(page)
md = ['# Mapa de escenas V3', '', '| # | Locución (tramos reales) | Tiempo (s) | Visual V2 | Nuevo protagonista / transformación | Transición | Sonido |', '|---|---|---|---|---|---|---|']
for (n, name, a, b, kt, tr, flow, camr, snd, dato, old) in BEATS:
    s0, e0 = span(a, b)
    md.append(f'| {n:02d} {name} | «{loc(a, b)}» | {s0:.2f}–{e0:.2f} | {old} | {tr} | {flow} | {snd} |')
open(os.path.join(root, '..', '03_STORYBOARD', 'MAPA_ESCENAS_V3.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print('storyboard.html', round(len(page) / 1e3), 'KB')
