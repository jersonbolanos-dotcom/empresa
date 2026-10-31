# Genera 08_STORYBOARD/storyboard.html (12 paneles Canvas con el mismo código del video) y MAPA_VOZ.md
import json, os, html
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = lambda p: open(os.path.join(root, p), encoding='utf-8').read()
d = json.loads(R('alineacion.json')); seg = d['segments']
span = lambda a, b: (seg[a]['s'], seg[b]['e']); loc = lambda a, b: ' '.join(seg[i]['text'] for i in range(a, b + 1))
B = [
 (1, 'Profundidad', 0, 0, 3.6, 'El plotter dibuja la superficie y el perfil del submarino; la cota CIENTOS DE METROS (sin cifra) crece', 'Apertura con el plotter en marcha', 'sonar, plotter, ambiente oceánico grave', 'Sin cifras de profundidad (varían según la fuente)'),
 (2, 'Falla', 1, 2, 7.6, 'Sello rojo FALLA, círculo de corrección en la popa; el submarino se inclina y se hunde; flecha SE HUNDE', 'Continuo; la cámara acompaña', 'alarma corta, sello, barrido grave', 'Corrección en rojo = práctica real de planos'),
 (3, 'No responde', 3, 3, 12.4, 'Rumbo previsto a superficie (línea de trazos) tachado con X roja; NO RESPONDE', 'Continuo', 'dos clunks de mando sin efecto, zumbido', '—'),
 (4, 'Tanques de lastre', 4, 4, 16.0, 'Leader «VER SECCIÓN B-B» lleva a la sección: casco exterior, CASCO RESISTENTE y TANQUES DE LASTRE fuera de él', 'Paneo por la lámina siguiendo el leader', 'whoosh, plotter', 'Tanques externos al casco resistente'),
 (5, 'Inmersión', 5, 5, 22.0, 'VENTILACIÓN abre: el aire sale por arriba (burbujas), el agua entra por abajo (rayado que sube); PESO crece', 'Continuo', 'clunk de válvulas, agua, burbujas', 'Inundación por ventilación; no entra agua al casco resistente'),
 (6, 'Soplado', 6, 6, 26.4, 'Botellas de AIRE COMPRIMIDO → tuberías → tanques; el agua sale por abajo; EMPUJE > PESO · ASCIENDE', 'Continuo', 'válvula, siseo de aire, agua expulsada', 'El soplado desplaza el agua; no es propulsión'),
 (7, '¿Y si falla?', 7, 7, 30.1, 'X roja sobre la línea de aire; sello ¿Y SI FALLA?', 'Continuo', 'error, sello', '—'),
 (8, 'USS Thresher', 8, 8, 38.2, 'Leader diagonal hacia la historia: 1963, USS THRESHER (SSN-593), perfil, 10 ABR 1963 · PRUEBAS DE INMERSIÓN · OCÉANO ATLÁNTICO', 'Paneo diagonal', 'whoosh, sonar, sello', 'Datos: GlobalSecurity, USNI'),
 (9, 'Cadena de fallos', 9, 9, 48.1, 'POSIBLE CADENA DE FALLOS: FALLO INICIAL (probable fuga en tubería) → PÉRDIDA DE PROPULSIÓN → SOPLADO DE LASTRE insuficiente', 'La cámara baja por el diagrama', 'relés, zumbido', '«posible»: la causa exacta no se conoce con certeza'),
 (10, 'Presión', 10, 11, 54.5, 'Regla de PROFUNDIDAD; SECCIÓN DEL CASCO con flechas de presión que crecen; fractura roja; LÍMITE DEL CASCO', 'Leader vertical', 'retumbo creciente, crujidos, golpe sordo (sin explosión)', 'La presión aumenta con la profundidad'),
 (11, '129', 12, 12, 58.5, '129 · PERSONAS A BORDO; el plotter traza 129 marcas en grupos de cinco; 10 ABRIL 1963', 'Leader', 'silencio respetuoso: sin música, sólo el plotter bajo y una campana grave', 'Cifra verificada (129 a bordo)'),
 (12, 'Lección y cierre', 13, 16, 72.5, 'Sistema de emergencia AIRE → VÁLVULA (X roja) → TANQUE; CUANDO MÁS SE NECESITA; nota SUBSAFE; la cámara se aleja y muestra toda la lámina; cajetín ASOMBROTECA', 'Retroceso a la lámina completa y llegada al cajetín', 'sonar, sello, whoosh, ding', 'SUBSAFE: programa creado tras el Thresher'),
]
cards = ''.join(f'<article class="card"><canvas width="1080" height="1920" data-t="{kt}"></canvas><div class="meta"><div class="num">{n:02d} · {html.escape(nm)}</div><div class="time">{span(a,b)[0]:.2f}–{span(a,b)[1]:.2f} s · fotograma {kt:.2f} s</div><p class="vo">«{html.escape(loc(a,b))}»</p><dl><dt>Sujeto y cambio</dt><dd>{html.escape(w)}</dd><dt>Transición</dt><dd>{html.escape(tr)}</dd><dt>Sonido</dt><dd>{html.escape(sn)}</dd><dt>Rigor</dt><dd>{html.escape(ph)}</dd></dl></div></article>' for (n, nm, a, b, kt, w, tr, sn, ph) in B)
js = lambda p: '<script>/* ' + p + ' */\n' + R(p).replace('</script', '<\\/script') + '\n</script>'
page = f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Storyboard Submarino</title><style>{R('fonts/fuentes.css')}
body{{margin:0;background:#0a1c3a;color:#eef4ff;font-family:"IBM Plex Mono",ui-monospace,monospace}} header,section{{max-width:1280px;margin:auto;padding:24px 16px 8px}} h1{{font:700 34px "Space Mono";margin:0}} h2{{font:700 22px "Space Mono"}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;padding:16px;max-width:1280px;margin:auto}} .card{{background:#12305c;border:1px solid #2b5590;border-radius:6px;overflow:hidden}} canvas{{width:100%;height:auto;display:block}}
.meta{{padding:12px 14px 16px}} .num{{font:700 18px "Space Mono";color:#f0b90b}} .time{{font-size:12px;color:#a9c4ea}} .vo{{font-weight:600;font-size:13px}} dl{{font-size:12px;margin:0}} dt{{color:#ff806e;font-weight:700;margin-top:6px}} dd{{margin:0;color:#dbe7fb}} li{{line-height:1.6;font-size:14px}}
</style></head><body><header><h1>Storyboard · El submarino que no volvió</h1><p>Engineering Blueprint · 1080×1920 · voz real {d['duration']:.3f} s + 1 s de cola · paneles dibujados con el código del video.</p></header><div class="grid">{cards}</div>
<section><h2>Decisiones de rigor</h2><ul><li>El audio es la autoridad: narra el caso del USS Thresher, no el guion genérico propuesto en el kit.</li><li>Sin cifras de profundidad, presión ni tiempos: sólo 1963, SSN-593, 10 de abril y 129 personas (verificados).</li><li>La cadena de fallos se rotula como POSIBLE, igual que la narración.</li><li>El colapso del casco se representa como una fractura técnica en rojo, sin dramatizar.</li></ul></section>
{js('lib/harness.js')}{js('js/datos.js')}{js('js/episodio.js')}
<script>(async()=>{{try{{await Promise.all(['600 40px "IBM Plex Mono"','700 40px "Space Mono"'].map(f=>document.fonts.load(f,'AaZz09')));}}catch(e){{}}for(const c of document.querySelectorAll('canvas[data-t]'))window.EPISODIO.explainer(c.getContext('2d'),1080,1920,Number(c.dataset.t));window.__ready=true;}})();</script></body></html>'''
os.makedirs(os.path.join(root, '..', '08_STORYBOARD'), exist_ok=True)
open(os.path.join(root, '..', '08_STORYBOARD', 'storyboard.html'), 'w', encoding='utf-8').write(page)
md = ['# Mapa voz → escenas', '', f'Duración de la voz (ffprobe): {d["duration"]:.3f} s', '', '| # | Locución | Tiempo (s) | Sujeto y cambio | Transición | Sonido | Rigor |', '|---|---|---|---|---|---|---|']
md += [f'| {n:02d} {nm} | «{loc(a,b)}» | {span(a,b)[0]:.2f}–{span(a,b)[1]:.2f} | {w} | {tr} | {sn} | {ph} |' for (n, nm, a, b, kt, w, tr, sn, ph) in B]
open(os.path.join(root, '..', '08_STORYBOARD', 'MAPA_VOZ.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n'); print('storyboard ok')
