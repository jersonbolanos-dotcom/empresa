# Construye index.html autocontenido desde index.src.html: inserta CSS/JS marcados y la voz en base64.
# Uso (desde la carpeta 04_CODIGO del video):  python3 -I ../../tools/build.py
# La voz es el primer archivo de ../01_ENTRADA/audio/ y se referencia en index.src.html como src="VOZ".
import base64, re, os, sys
root = os.getcwd()
src = open(os.path.join(root, 'index.src.html'), encoding='utf-8').read()
def css(m): return '<style>\n' + open(os.path.join(root, m.group(1)), encoding='utf-8').read() + '\n</style>'
def js(m):
    code = open(os.path.join(root, m.group(1)), encoding='utf-8').read().replace('</script', '<\\/script')
    return f'<script>/* ---- {os.path.basename(m.group(1))} ---- */\n' + code + '\n</script>'
out = re.sub(r'<!-- @inline-css (\S+) -->', css, src)
out = re.sub(r'<!-- @inline-js (\S+) -->', js, out)
adir = os.path.join(root, '..', '01_ENTRADA', 'audio')
voces = sorted(f for f in os.listdir(adir) if not f.startswith('.')) if os.path.isdir(adir) else []
if voces:
    b64 = base64.b64encode(open(os.path.join(adir, voces[0]), 'rb').read()).decode()
    out = out.replace('src="VOZ"', f'src="data:audio/mpeg;base64,{b64}"')
    print('voz:', voces[0])
else:
    print('AVISO: no hay voz en 01_ENTRADA/audio/')
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(out)
print('index.html', round(len(out) / 1e6, 2), 'MB')
