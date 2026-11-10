# Construye index.html autocontenido desde index.src.html: inserta los CSS/JS marcados (reel SIN VOZ: no hay audio que incrustar;
# los efectos y la música se sintetizan con SOUND/MUS).
# Uso (desde la carpeta 04_CODIGO del reel):  python3 -I ../../tools/build.py
import os, re
root = os.getcwd()
src = open(os.path.join(root, 'index.src.html'), encoding='utf-8').read()
def css(m): return '<style>\n' + open(os.path.join(root, m.group(1)), encoding='utf-8').read() + '\n</style>'
def js(m):
    code = open(os.path.join(root, m.group(1)), encoding='utf-8').read().replace('</script', '<\\/script')
    return f'<script>/* ---- {os.path.basename(m.group(1))} ---- */\n' + code + '\n</script>'
out = re.sub(r'<!-- @inline-css (\S+) -->', css, src)
out = re.sub(r'<!-- @inline-js (\S+) -->', js, out)
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(out)
print('index.html', round(len(out) / 1e6, 2), 'MB')
