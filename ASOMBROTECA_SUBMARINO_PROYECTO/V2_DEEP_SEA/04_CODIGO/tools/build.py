# Construye 04_CODIGO/index.html autocontenido desde index.src.html (inserta CSS/JS y la voz en base64).
# Uso: python3 -I tools/build.py   (desde 04_CODIGO)
import base64, re, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(root, 'index.src.html'), encoding='utf-8').read()
def css(m): return '<style>\n' + open(os.path.join(root, m.group(1)), encoding='utf-8').read() + '\n</style>'
def js(m):
    code = open(os.path.join(root, m.group(1)), encoding='utf-8').read().replace('</script', '<\\/script')
    return f'<script>/* ---- {m.group(1)} ---- */\n' + code + '\n</script>'
out = re.sub(r'<!-- @inline-css (\S+) -->', css, src)
out = re.sub(r'<!-- @inline-js (\S+) -->', js, out)
voice = os.path.join(root, '..', '..', '01_ENTRADA', 'audio', 'voz_original_submarino.mp3')
b64 = base64.b64encode(open(voice, 'rb').read()).decode()
out = out.replace('src="../../01_ENTRADA/audio/voz_original_submarino.mp3"', f'src="data:audio/mpeg;base64,{b64}"')
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(out)
print('index.html', round(len(out) / 1e6, 2), 'MB')
