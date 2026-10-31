# Genera 08_STORYBOARD/storyboard.html (12 paneles Canvas con el mismo código del video) y MAPA_VOZ.md
import json, os, html
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = lambda p: open(os.path.join(root, p), encoding='utf-8').read()
d = json.loads(R('alineacion.json')); seg = d['segments']
span = lambda a, b: (seg[a]['s'], seg[b]['e']); loc = lambda a, b: ' '.join(seg[i]['text'] for i in range(a, b + 1))
B = [
 (1, 'Vuelo', 0, 1, 2.5, 'Helicóptero grande en vuelo sobre cordilleras; rotor girando; indicadores MOTOR/ROTOR y regla de ALTURA (sin cifras)', 'Apertura en movimiento', 'rotor sintetizado, turbina', 'Rotor y motor acoplados'),
 (2, 'Falla', 2, 2, 5.4, 'El brillo del motor pasa a alerta roja, el indicador MOTOR cae a cero; «MOTOR APAGADO» y «EL ROTOR SIGUE GIRANDO»', 'Continuo', 'la turbina se apaga, alerta breve', 'El rotor no se detiene'),
 (3, '¿Se desploma?', 3, 4, 8.9, 'Zoom out: trayectoria roja en picado (tachada en «No») frente a la trayectoria cian de DESCENSO CONTROLADO', 'Retroceso de cámara', 'whoosh, zumbido de tachado, marcador', 'Autorrotación = descenso, no vuelo nivelado'),
 (4, 'Motor ≠ rotor', 5, 5, 14.0, 'Inmersión en el capó: motor detenido (X), RUEDA LIBRE (aro que gira, cubo quieto), transmisión y mástil girando', 'Inmersión con apertura circular', 'riser, clic de embrague, trinquete', 'Rueda libre: FAA HFH cap. 2'),
 (5, 'Autorrotación', 6, 6, 18.5, 'Match-cut: el aro de la rueda libre se convierte en el disco del rotor visto desde arriba; título AUTORROTACIÓN', 'Match-cut circular', 'swish, riser, sparkle + ding', '—'),
 (6, 'Paso colectivo', 7, 7, 22.9, 'Una pala barre la cámara y revela el perfil: el ángulo de paso baja; palanca del colectivo hacia abajo; «BAJAR EL PASO COLECTIVO»', 'Barrido de pala', 'whoosh, palanca (roller + tock)', '«inclinación de las palas» = paso colectivo'),
 (7, 'Descenso', 8, 9, 26.0, 'Retroceso al helicóptero que desciende; flecha y «DESCIENDE»; el suelo sube', 'Zoom out desde el rotor', 'whoosh, aire', 'Descenso controlado'),
 (8, 'Flujo relativo', 10, 10, 33.0, 'Partículas y flechas cian atraviesan el disco de abajo hacia arriba respecto al helicóptero; «SIN POTENCIA DEL MOTOR»', 'Continuo', 'riser de aire, pops', 'Flujo relativo, no corriente externa'),
 (9, 'Energía', 11, 12, 40.9, 'ALTURA → AIRE QUE ATRAVIESA EL ROTOR → GIRO DEL ROTOR; «no se crea energía: se transforma»', 'Fundido desde las partículas', 'pops + pluma, success', 'Conversión de energía potencial'),
 (10, 'Flare', 13, 13, 46.0, 'Aproximación al campo; FLARE: morro arriba, la flecha de velocidad de caída se acorta; contacto amortiguado (recreación conceptual)', 'Plano general del campo', 'whoosh, golpe de patines + polvo', 'FAA HFH cap. 11: flare'),
 (11, 'Límites', 14, 15, 54.0, 'Aviso + ALTURA / VELOCIDAD / REACCIÓN DEL PILOTO', 'Continuo', 'error suave, 3 blips', 'Sin garantía de éxito'),
 (12, 'Conclusión', 16, 17, 62.3, 'En tierra, el rotor se detiene poco a poco; «SIN MOTOR ≠ SIN CONTROL»; «puede ser posible · no está garantizado»; ASOMBROTECA discreto', 'Continuo', 'sello, success, ding', '—'),
]
cards = ''.join(f'<article class="card"><canvas width="1080" height="1920" data-t="{kt}"></canvas><div class="meta"><div class="num">{n:02d} · {html.escape(nm)}</div><div class="time">{span(a,b)[0]:.2f}–{span(a,b)[1]:.2f} s · fotograma {kt:.2f} s</div><p class="vo">«{html.escape(loc(a,b))}»</p><dl><dt>Sujeto y cambio</dt><dd>{html.escape(w)}</dd><dt>Transición</dt><dd>{html.escape(tr)}</dd><dt>Sonido</dt><dd>{html.escape(sn)}</dd><dt>Física</dt><dd>{html.escape(ph)}</dd></dl></div></article>' for (n, nm, a, b, kt, w, tr, sn, ph) in B)
js = lambda p: '<script>/* ' + p + ' */\n' + R(p).replace('</script', '<\\/script') + '\n</script>'
page = f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Storyboard Autorrotación</title><style>{R('fonts/fuentes.css')}
body{{margin:0;background:#090b2c;color:#f6faff;font-family:Nunito,system-ui,sans-serif}} header,section{{max-width:1280px;margin:auto;padding:24px 16px 8px}} h1{{font:700 40px Fredoka;margin:0}} h2{{font:700 26px Fredoka}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;padding:16px;max-width:1280px;margin:auto}} .card{{background:#141846;border-radius:18px;overflow:hidden}} canvas{{width:100%;height:auto;display:block}}
.meta{{padding:12px 14px 16px}} .num{{font:700 20px Fredoka;color:#ffd23f}} .time{{font:400 12px ui-monospace,monospace;color:#bde5f8}} .vo{{font-weight:800;font-size:14px}} dl{{font-size:13px;margin:0}} dt{{color:#56e8ff;font-weight:900;margin-top:6px}} dd{{margin:0;color:#dfefff}} li{{line-height:1.6}}
</style></head><body><header><h1>Storyboard · Autorrotación</h1><p>Flat-Vector Science · 1080×1920 · voz real {d['duration']:.3f} s + 1 s de cola · paneles dibujados con el código del video.</p></header><div class="grid">{cards}</div>
<section><h2>Supuestos científicos (FAA Helicopter Flying Handbook, cap. 2 y 11)</h2><ul><li>Rueda libre: el rotor gira sin arrastre del motor.</li><li>«Reducir la inclinación de las palas» se rotula como BAJAR EL PASO COLECTIVO (todas las palas, no inclinar el helicóptero).</li><li>El aire atraviesa el disco de abajo hacia arriba RELATIVO al helicóptero que desciende.</li><li>La autorrotación es un descenso controlado; el flare usa la energía del rotor; el éxito no está garantizado.</li><li>Sin cifras de altura, velocidad, RPM ni ángulos: los indicadores son cualitativos.</li></ul></section>
{js('lib/harness.js')}{js('js/datos.js')}{js('js/estilo_flat.js')}{js('js/episodio.js')}
<script>(async()=>{{try{{await Promise.all(['900 40px "Nunito"','800 40px "Nunito"','700 40px "Fredoka"'].map(f=>document.fonts.load(f,'AaZz09')));}}catch(e){{}}for(const c of document.querySelectorAll('canvas[data-t]'))window.EPISODIO.explainer(c.getContext('2d'),1080,1920,Number(c.dataset.t));window.__ready=true;}})();</script></body></html>'''
open(os.path.join(root, '..', '08_STORYBOARD', 'storyboard.html'), 'w', encoding='utf-8').write(page)
md = ['# Mapa voz → escenas', '', f'Duración de la voz (ffprobe): {d["duration"]:.3f} s', '', '| # | Locución | Tiempo (s) | Sujeto y cambio | Transición | Sonido | Física |', '|---|---|---|---|---|---|---|']
md += [f'| {n:02d} {nm} | «{loc(a,b)}» | {span(a,b)[0]:.2f}–{span(a,b)[1]:.2f} | {w} | {tr} | {sn} | {ph} |' for (n, nm, a, b, kt, w, tr, sn, ph) in B]
open(os.path.join(root, '..', '08_STORYBOARD', 'MAPA_VOZ.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n'); print('storyboard ok')
