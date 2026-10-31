# Genera ../08_STORYBOARD/storyboard.html (10 paneles Canvas dibujados con el mismo código del video) y MAPA_VOZ.md
import json, os, html
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = lambda p: open(os.path.join(root, p), encoding='utf-8').read()
d = json.loads(R('alineacion.json')); seg = d['segments']
span = lambda a, b: (seg[a]['s'], seg[b]['e']); loc = lambda a, b: ' '.join(seg[i]['text'] for i in range(a, b + 1))
B = [
 (1, 'Zona de medianoche', 0, 0, 3.4, 'cientos de metros · PROFUNDIDAD ▼ · SONAR ACTIVO',
  'Apertura: la cámara se hunde (la nieve marina sube); un ctenóforo y una medusa lejana se encienden; el plancton se reúne en «cientos de metros». El submarino es una silueta oscura iluminada sólo por luz viva.',
  'sonar grave, burbujas, ambiente de corriente profunda, brillo de plancton'),
 (2, 'Algo falla', 1, 3, 11.0, 'FALLA · se hunde · superficie ↑ · ✗ · NO RESPONDE',
  'Continuo: el título sube a la esquina; la luz de navegación se vuelve alarma roja con anillo de énfasis; el casco se inclina y baja, una corriente ámbar marca «se hunde»; una corriente cian intenta subir hacia los últimos rayos y se apaga bajo una ✗ roja.',
  'alarma corta, golpe sordo, oleaje grave, corriente que sube y se corta, error grave'),
 (3, 'Tanques de lastre', 4, 4, 16.0, 'TANQUES DE LASTRE · CASCO RESISTENTE',
  'Continuo: la cámara entra en el casco y la silueta se transforma en su sección de luz (rayos X bioluminiscentes); los tanques se encienden fuera del casco resistente.',
  'oleaje, ping al aterrizar el rótulo, brillo'),
 (4, 'Inmersión', 5, 5, 22.2, 'VENTILACIÓN · ENTRADA DE AGUA · EMPUJE · PESO · peso > empuje · desciende',
  'Continuo: las válvulas giran y el aire sale en burbujas por arriba; el agua (plancton verde-azulado) entra por abajo y sube el nivel; la flecha PESO crece y el conjunto baja un poco.',
  'clunk de válvula, burbujas, agua que entra'),
 (5, 'Soplado y la pregunta', 6, 7, 29.9, 'AIRE COMPRIMIDO · empuje > peso · asciende · ¿y si falla?',
  'Continuo: las botellas se encienden, la corriente de aire recorre las tuberías, el agua sale por abajo, el EMPUJE crece y sube; luego una ✗ roja sobre las tuberías y la pregunta en magenta; las luces del corte se apagan.',
  'siseo de aire, burbujas, agua expulsada, error grave, apagón'),
 (6, '1963', 8, 8, 37.9, '1963 · USS Thresher · SSN-593 · SUBMARINO NUCLEAR · EE. UU. · pruebas de inmersión · 10 DE ABRIL · OCÉANO ATLÁNTICO',
  'Cambio de escena (salto en el tiempo), como en la referencia: oscuridad y el señuelo del rape abisal se enciende e ilumina agua nueva; el Thresher aparece iluminado por esa luz ámbar.',
  'parpadeo del señuelo, nota grave, oleaje de revelación, ping'),
 (7, 'Posible cadena de fallos', 9, 9, 48.0, 'posible cadena de fallos · FALLO INICIAL (probable fuga en una tubería) · PÉRDIDA DE PROPULSIÓN · SOPLADO DE LASTRE (no logró expulsar el agua)',
  'Continuo: la cámara desciende a lo largo de un sifonóforo; sus segmentos se encienden uno a uno, cian → ámbar → magenta; cada eslabón recibe su rótulo.',
  'descenso, un «tock» suave por eslabón, onda magenta en el último'),
 (8, 'Presión y límite', 10, 11, 54.3, 'presión del océano · AUMENTA CON LA PROFUNDIDAD · SECCIÓN DEL CASCO · LÍMITE DEL CASCO',
  'Continuo: más hondo; corrientes de luz convergen sobre la sección del casco y crecen con la profundidad; el anillo pasa a rojo con fracturas finas; la luz se apaga (sin explosión).',
  'retumbo creciente, crujidos, golpe sordo apagado'),
 (9, '129', 12, 12, 58.0, '129 · personas a bordo · HUD: SILENCIO',
  'Tras el apagón, el plancton se reúne en «129»; luego 129 luces suben despacio, una por persona.',
  'silencio: sin música; sólo una campana grave muy baja'),
 (10, 'Lección y cierre', 13, 16, 67.6, 'el océano no necesita una grieta · CASCO INTACTO · y aun así, una amenaza · AIRE COMPRIMIDO → VÁLVULA ✗ → TANQUE DE LASTRE · cuando más se necesita · nota SUBSAFE · ASOMBROTECA · la ciencia oculta de lo imposible',
  'Cambio de escena con la floración de plancton que barre la pantalla (como la referencia); el esquema del sistema de emergencia se enciende y la válvula se tacha; al final el plancton forma ASOMBROTECA y una medusa sube con su red encendida.',
  'floración brillante, ping, error grave, acorde que resuelve, ping final'),
]
cards = ''.join(f'<article class="card"><canvas width="1080" height="1920" data-t="{kt}"></canvas><div class="meta"><div class="num">{n:02d} · {html.escape(nm)}</div><div class="time">{span(a,b)[0]:.2f}–{span(a,b)[1]:.2f} s · fotograma {kt:.2f} s</div><p class="vo">«{html.escape(loc(a,b))}»</p><dl><dt>Texto en pantalla</dt><dd>{html.escape(tx)}</dd><dt>Cómo llega</dt><dd>{html.escape(tr)}</dd><dt>Sonidos clave</dt><dd>{html.escape(sn)}</dd></dl></div></article>' for (n, nm, a, b, kt, tx, tr, sn) in B)
js = lambda p: '<script>/* ' + p + ' */\n' + R(p).replace('</script', '<\\/script') + '\n</script>'
page = f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Storyboard Submarino Abisal</title><style>{R('fonts/fuentes.css')}
:root{{--bg:#00040c;--card:#06121f;--ink:#dff6ff;--dim:#8fb7c8;--cyan:#50e8ff;--mag:#ff50cd;--amb:#ffac46}}
body{{margin:0;background:var(--bg);color:var(--ink);font-family:"Space Grotesk",system-ui,sans-serif}} header,section{{max-width:1280px;margin:auto;padding:24px 16px 8px}} h1{{font:italic 600 38px Fraunces;margin:0;color:var(--cyan)}} h2{{font:600 26px Fraunces;color:var(--cyan)}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;padding:16px;max-width:1280px;margin:auto}} .card{{background:var(--card);border:1px solid #12324a;border-radius:10px;overflow:hidden}} canvas{{width:100%;height:auto;display:block}}
.meta{{padding:12px 14px 16px}} .num{{font:700 18px "Space Grotesk";color:var(--amb)}} .time{{font:400 12px "IBM Plex Mono",monospace;color:var(--dim)}} .vo{{font-weight:700;font-size:14px}} dl{{font-size:13px;margin:0}} dt{{color:var(--cyan);font-weight:700;margin-top:6px}} dd{{margin:0;color:#c9e3ee}} li{{line-height:1.6;font-size:15px}}
</style></head><body><header><h1>Storyboard · El submarino que no volvió (V2 · Bioluminescent Deep Sea)</h1><p>1080×1920 vertical · tu voz original ({d['duration']:.3f} s) + 1 s de cola · cada panel está dibujado con el mismo código del video (motor del estilo de referencia).</p></header><div class="grid">{cards}</div>
<section><h2>Datos asumidos o verificados</h2><ul>
<li>Se mantiene la misma historia, guion y voz de la V1; sólo cambia el medio visual.</li>
<li>Datos en pantalla (verificados para la V1): USS Thresher (SSN-593), submarino nuclear de EE. UU.; 10 de abril de 1963; pruebas de inmersión en el Atlántico; 129 personas a bordo; tras el accidente se creó el programa SUBSAFE.</li>
<li>«Posible cadena de fallos»: la investigación apuntó a una probable fuga en una tubería; la causa exacta no se conoce con certeza, por eso se rotula como posible.</li>
<li>Sin cifras de profundidad ni de presión: el HUD de la referencia mostraba «DEPTH 0000 m» y temperatura; aquí es cualitativo (PROFUNDIDAD ▼, SONAR ACTIVO, SILENCIO) para no inventar números.</li>
<li>El submarino no emite luz propia salvo una luz de navegación y la alarma: como el rape abisal de la referencia, se ve sólo por la luz viva que lo rodea.</li>
<li>Formato: el estilo de referencia es 1280×720 sin narración; lo adapté a 1080×1920 con tu voz porque es el formato de tu serie, conservando texturas, brillo, nieve marina, grano y viñeta a la misma intensidad.</li>
</ul></section>
{js('lib/harness.js')}{js('js/datos.js')}{js('js/estilo_abisal.js')}{js('js/episodio.js')}
<script>(async()=>{{try{{await Promise.all(['600 40px "Fraunces"','italic 600 40px "Fraunces"','700 40px "Fraunces"','700 40px "Space Grotesk"','400 40px "IBM Plex Mono"'].map(f=>document.fonts.load(f,'AaZz09')));}}catch(e){{}}for(const c of document.querySelectorAll('canvas[data-t]'))window.EPISODIO.explainer(c.getContext('2d'),1080,1920,Number(c.dataset.t));window.__ready=true;}})();</script></body></html>'''
open(os.path.join(root, '..', '08_STORYBOARD', 'storyboard.html'), 'w', encoding='utf-8').write(page)
md = ['# Mapa voz → escenas (V2 · Bioluminescent Deep Sea)', '', f'Duración de la voz (ffprobe): {d["duration"]:.3f} s', '', '| # | Locución | Tiempo (s) | Texto en pantalla | Cómo llega | Sonidos |', '|---|---|---|---|---|---|']
md += [f'| {n:02d} {nm} | «{loc(a,b)}» | {span(a,b)[0]:.2f}–{span(a,b)[1]:.2f} | {tx} | {tr} | {sn} |' for (n, nm, a, b, kt, tx, tr, sn) in B]
open(os.path.join(root, '..', '08_STORYBOARD', 'MAPA_VOZ.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n'); print('ok')
