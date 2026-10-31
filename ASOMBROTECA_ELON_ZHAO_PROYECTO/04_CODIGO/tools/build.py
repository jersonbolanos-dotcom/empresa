# Construye 04_CODIGO/index.html autocontenido desde index.src.html (inserta CSS/JS y la voz en base64).
# Uso: python3 -I tools/build.py   (desde 04_CODIGO)
import base64, re, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(root, 'index.src.html'), encoding='utf-8').read()
# fotos reales con licencia: si existen en recursos/fotos/ se incrustan; si no, el episodio usa fichas tipográficas (sin rostros inventados)
import json
fotos = {}
CAND = {'musk': ['elon_musk_aportada_usuario.jpg', 'elon_musk_2022_dominio_publico.jpg'], 'zhao': ['changpeng_zhao_aportada_usuario.jpg', 'changpeng_zhao_2022_cc_by_sa_4.jpg']}
for who in CAND:
    fn = next((f for f in CAND[who] if os.path.exists(os.path.join(root, 'recursos', 'fotos', f))), CAND[who][-1])
    fp = os.path.join(root, 'recursos', 'fotos', fn)
    cfg = os.path.join(root, 'recursos', 'fotos', fn + '.crop.json')
    if os.path.exists(fp):
        fotos[who] = {'src': 'data:image/jpeg;base64,' + base64.b64encode(open(fp, 'rb').read()).decode(), 'archivo': fn}
        if os.path.exists(cfg): fotos[who]['crop'] = json.load(open(cfg))
    else:
        fotos[who] = None
open(os.path.join(root, 'js', 'fotos.js'), 'w').write('// Generado por tools/build.py\nwindow.FOTOS = ' + json.dumps(fotos) + ';\n')
print('fotos:', {k: (v['archivo'] if v else 'NO DISPONIBLE') for k, v in fotos.items()})
def css(m): return '<style>\n' + open(os.path.join(root, m.group(1)), encoding='utf-8').read() + '\n</style>'
def js(m):
    code = open(os.path.join(root, m.group(1)), encoding='utf-8').read().replace('</script', '<\\/script')
    return f'<script>/* ---- {m.group(1)} ---- */\n' + code + '\n</script>'
out = re.sub(r'<!-- @inline-css (\S+) -->', css, src)
out = re.sub(r'<!-- @inline-js (\S+) -->', js, out)
voice = os.path.join(root, '..', '01_ENTRADA', 'audio', 'voz_original_Audio_de_ElonMusk.mp3')
b64 = base64.b64encode(open(voice, 'rb').read()).decode()
out = out.replace('src="../01_ENTRADA/audio/voz_original_Audio_de_ElonMusk.mp3"', f'src="data:audio/mpeg;base64,{b64}"')
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(out)
print('index.html', round(len(out) / 1e6, 2), 'MB')
