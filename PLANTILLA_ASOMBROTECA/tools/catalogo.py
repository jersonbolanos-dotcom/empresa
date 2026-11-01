# Regenera catalogo/catalogo.html (bloques en las dos pieles) desde catalogo/catalogo_src.js
# Uso (desde PLANTILLA_ASOMBROTECA): python3 -I tools/catalogo.py ; captura PNG con un navegador headless.
import os, re
K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = lambda p: open(os.path.join(K, p), encoding='utf-8').read()
js = lambda p: '<script>' + R(p).replace('</script', '<\\/script') + '</script>'
names = re.findall(r"\['([^']+)', \(c, t\)", R('catalogo/catalogo_src.js'))
cells = ''.join(f'<figure><canvas width="400" height="300" data-i="{i}" data-sk="{sk}"></canvas><figcaption>{n} · <b>{sk}</b></figcaption></figure>' for i, n in enumerate(names) for sk in ('plana', 'oscura'))
page = f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Catálogo Plantilla</title><style>{R('fonts/fuentes.css')}
body{{margin:0;background:#14132b;color:#fff;font-family:Nunito,sans-serif}} h1{{font:700 34px Fredoka;margin:20px 16px 4px}} p{{margin:0 16px 12px;color:#c9c6e3}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;padding:16px}} figure{{margin:0;background:#1d1b3a;border-radius:12px;overflow:hidden}} canvas{{width:100%;display:block}} figcaption{{padding:8px 10px;font-size:13px;color:#dcdaf2}}</style></head>
<body><h1>Plantilla Asombroteca · catálogo de bloques</h1><p>Cada bloque en piel «plana» y «oscura». Dibujado con el mismo motor de los videos (motor/plantilla.js).</p><div class="g">{cells}</div>
{js('lib/harness.js')}{js('motor/plantilla.js')}{js('catalogo/catalogo_src.js')}
<script>(async()=>{{try{{await Promise.all(['700 40px "Nunito"','800 40px "Nunito"','900 40px "Nunito"','700 40px "Fredoka"','700 40px "Space Grotesk"','600 40px "IBM Plex Mono"'].map(f=>document.fonts.load(f,'Aa09')));}}catch(e){{}}drawCatalog();window.__ready=true;}})();</script></body></html>'''
open(os.path.join(K, 'catalogo', 'catalogo.html'), 'w', encoding='utf-8').write(page)
print(len(names), 'bloques')
