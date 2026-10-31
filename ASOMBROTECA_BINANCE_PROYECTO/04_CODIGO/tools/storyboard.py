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
 (1, 'Golpe inicial', 0, 2, 3.0, 'Rim light encuentra el módulo de custodia en la oscuridad; fecha en oro palabra a palabra; callout «custodia digital».', 'Inicio: actividad desde el fotograma 0 (luz rim + órbita micro).', 'Órbita lenta yaw −0.95→−0.72, push-in leve.', 'air + bwoom al encenderse la luz; clics por palabra; acorde del anillo.', 'Fecha 29 oct 2026 (Binance, TRM).'),
 (2, 'Magnitud y rapidez', 3, 3, 17.95, 'Reloj de 20 min (dato TRM, separado) y cifra monumental ≈US$6.300 M que cuenta al decirse y se bloquea en «dólares».', 'Continuo: el titular de fecha se disuelve; el objeto sigue en plano.', 'Push-in y giro; leve zoom en el bloqueo de la cifra.', 'ticks del contador (≤12/s); bwoom + acorde = golpe mayor.', '≈US$6.300 M (Binance); ≈US$6.360 M en 10 redes, mayor parte en ≈20 min (TRM).'),
 (3, 'Misterio', 4, 7, 23.9, 'Bóveda y billetes en línea fina, tachados en rojo con la palabra; se desmaterializan en partículas oro que entran en el die.', 'Contraste: lo físico se descarta y fluye hacia el contenedor digital.', 'Cámara se aleja ligeramente y baja.', 'trazos de tachón + nota grave; sparkle en la desmaterialización; bwoom en «¿cómo?».', 'Ilustrativo (sin dato).'),
 (4, 'Hot wallet', 8, 9, 31.0, 'Dolly-in atravesando el cristal hasta el die (vista casi cenital); puertos laten y líneas se dibujan hacia «internet»; tráfico rápido.', 'Continuo: la cámara entra en el mismo objeto.', 'Dolly-in s 1.3→1.9, pitch 0.6→1.1.', 'glide largo; blips por puerto; ticks de tráfico.', 'Definición genérica de billetera caliente.'),
 (5, 'Autorización digital', 10, 10, 39.0, 'Capa 1: placa de vidrio con llave (orden firmada, empresa). Capa 2: cadena de bloques detrás (registro on-chain). Flecha oro entre capas.', 'Continuo: salida del cristal; aparecen dos capas distintas.', 'Pull-back a plano 3/4 con la cadena detrás.', 'stamp + acorde en «autorizaciones»; clics de callouts.', 'Distinción conceptual autorización ≠ validez en red.'),
 (6, 'Retiros no autorizados', 11, 12, 49.0, 'La placa se vuelve roja; la orden se desvía a direcciones externas (nodos rojos en el suelo). Chip «RECREACIÓN CONCEPTUAL». «Causa: en investigación».', 'Continuo: mismo plano, la flecha cambia de destino.', 'Cámara sube (pitch 0.72) para ver el suelo.', 'whoosh de salida; error en «no había autorizado»; nota interrogativa.', 'Binance: retiros no autorizados; causa en investigación (30-31 oct).'),
 (7, 'Confirmación irreversible', 13, 14, 59.5, 'Hueco de luz; la transacción entra en un bloque que se sella (candado cian). Botón «Deshacer» tachado en rojo. Nota «normalmente».', 'Continuo: la cadena de bloques pasa a primer plano.', 'Macro sobre la cadena, pitch 0.48.', 'silencio musical; stamp del sellado; tachón + dos notas graves.', 'Propiedad general de cadenas públicas, con salvedad.'),
 (8, 'Dispersión y rastreo', 15, 17, 72.0, 'Vista cenital: rutas multi-salto hacia direcciones; saldos que se acreditan (anillos), el del objeto baja. Rastro cian brilla. «Seguir ≠ recuperar».', 'Continuo: la cámara sube a cenital sobre el mismo suelo.', 'Cenital, órbita lenta yaw −0.2→−0.7.', 'tocks por llegada (cambio de saldo); barrido cian del rastro.', 'Rutas = visualización conceptual, no log real.'),
 (9, 'Carrera contra el tiempo', 18, 19, 84.0, 'Cronómetro; algunos nodos se congelan (hexágono teal), otros siguen moviéndose. ≈US$3.000 M congelados on-chain.', 'Continuo: misma red; cambia el estado de algunos nodos.', 'Órbita cenital yaw −0.7→−1.08.', 'tic-tac; dings de congelamiento; bwoom en «congelar».', '≈US$3.000 M congelados (Binance, 30 oct).'),
 (10, 'Binance cubre pérdidas', 20, 20, 88.2, 'Bloque oro de reservas (SAFU + tesorería) sube a la derecha, separado de las rutas del robo, y repone el saldo del objeto (filas en oro).', 'Continuo: segunda fuente contable independiente.', 'Vuelta a plano 3/4 del objeto.', 'riser + bwoom; aire suave.', 'Binance cubre con fondos propios (SAFU, tesorería, fondo de seguros).'),
 (11, 'Dato crucial 90 %', 21, 23, 99.8, '«90 % REPUESTO» en oro; pulso rojo en «Pero atención»; «≠ recuperado del atacante»; chips 90 % REPUESTO | ≈3.000 M CONGELADOS (unidades separadas).', 'Continuo con énfasis en la cifra.', 'Plano estable, objeto abajo.', 'ticks + bwoom/acorde en 90 %; corte musical en «atención»; error en «recuperado».', '90 % de activos afectados repuesto (Binance, 31 oct).'),
 (12, 'Conclusión', 24, 27, 114.9, 'Regreso al héroe; candado cierra el acceso; titular «Una autorización comprometida… miles de millones en minutos»; barrido de luz a escenario blanco y «La ciencia oculta de lo imposible.»', 'Cambio de escena a la manera del estilo: barrido de luz a blanco.', 'Push-in final y órbita suave.', 'stamp del candado; barrido; acorde resolutivo.', 'Sin cifras nuevas.'),
]
cards = []
for (n, name, a, b, kt, tr, flow, camr, snd, dato) in BEATS:
    s, e = span(a, b)
    cards.append(f'''<article class="card"><canvas width="1080" height="1920" data-t="{kt}"></canvas>
<div class="meta"><div class="num">{n:02d} · {html.escape(name)}</div><div class="time">{s:.2f}–{e:.2f} s · fotograma clave {kt:.2f} s</div>
<p class="vo">«{html.escape(loc(a, b))}»</p>
<dl><dt>Transformación</dt><dd>{html.escape(tr)}</dd><dt>Entrada / salida</dt><dd>{html.escape(flow)}</dd><dt>Cámara</dt><dd>{html.escape(camr)}</dd><dt>Sonido</dt><dd>{html.escape(snd)}</dd><dt>Dato auditado</dt><dd>{html.escape(dato)}</dd></dl></div></article>''')
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
<header><h1>Storyboard · El robo de Binance</h1><p>12 fotogramas clave dibujados con el mismo código del video (H + Product Launch Reveal adaptado a 9:16). Tiempos = segundos del audio original (duración {d['duration']:.3f} s).</p></header>
<div class="grid">{''.join(cards)}</div>
<section><h2>Supuestos y límites</h2><ul>
<li>Alineación por pausas del audio + reparto silábico (sin reconocimiento de voz disponible): límites de frase ±0.05 s, palabras interiores ±0.25 s aprox.</li>
<li>Primeros tres tramos de voz: el reparto de la frase inicial entre las dos primeras pausas se infirió por densidad silábica.</li>
<li>Las rutas, direcciones y bloques son representación conceptual; no reproducen transacciones reales.</li>
<li>No se muestra el mecanismo del compromiso: la causa seguía en investigación el 31 oct 2026. La atribución de TRM Labs (TraderTraitor) se omite en pantalla porque la locución no la menciona.</li>
</ul></section>
{js('lib/harness.js')}{js('js/datos.js')}{js('js/estilo_base.js')}{js('js/binance.js')}
<script>(async()=>{{try{{await Promise.all(['400 40px "Inter"','600 40px "Inter"','800 40px "Inter"'].map(f=>document.fonts.load(f,'AaZz09')));}}catch(e){{}}
for(const c of document.querySelectorAll('canvas[data-t]')){{const x=c.getContext('2d');window.BINANCE.explainer(x,1080,1920,Number(c.dataset.t));}}window.__ready=true;}})();</script>
</body></html>'''
open(os.path.join(root, '..', '03_STORYBOARD', 'storyboard.html'), 'w', encoding='utf-8').write(page)
print('storyboard.html', round(len(page) / 1e3), 'KB')
