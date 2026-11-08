# Construye index.html autocontenido desde index.src.html: inserta CSS/JS marcados y la voz en base64.
# Uso (desde la carpeta 04_CODIGO del video):  python3 -I ../../tools/build.py
# La voz es el primer archivo de ../01_ENTRADA/audio/ y se referencia en index.src.html como src="VOZ".
import json, base64, re, os, sys
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
mont = os.path.join(root, '..', '05_AUDIO', 'voz_montada.wav')   # v1.28: voz con pausas de posproducción
al = os.path.join(root, 'alineacion.json')
try:
    pp = json.load(open(al, encoding='utf-8')).get('pausas_post') if os.path.exists(al) else None
except Exception:
    pp = None
if pp and voces and (not os.path.exists(mont) or os.path.getmtime(mont) < os.path.getmtime(al)):
    # la voz montada falta o es más vieja que la alineación: se regenera (silencio exacto entre tramos, voz intacta)
    import subprocess, sys
    os.makedirs(os.path.dirname(mont), exist_ok=True)
    subprocess.run([sys.executable, '-I', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'montar_voz.py'), os.path.join(adir, voces[0]), al, mont], check=True)
if pp and os.path.exists(mont):
    b64 = base64.b64encode(open(mont, 'rb').read()).decode()
    out = out.replace('src="VOZ"', f'src="data:audio/wav;base64,{b64}"')
    print('voz: 05_AUDIO/voz_montada.wav (con pausas de posproducción)')
elif voces:
    b64 = base64.b64encode(open(os.path.join(adir, voces[0]), 'rb').read()).decode()
    out = out.replace('src="VOZ"', f'src="data:audio/mpeg;base64,{b64}"')
    print('voz:', voces[0])
else:
    print('AVISO: no hay voz en 01_ENTRADA/audio/')
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(out)
print('index.html', round(len(out) / 1e6, 2), 'MB')
