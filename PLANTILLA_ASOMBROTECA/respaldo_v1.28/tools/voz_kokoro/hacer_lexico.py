# Construye un léxico español (es-419) para Kokoro/sherpa-onnx con fonemas espeak-ng
import re, sys, espeakng_loader
from phonemizer.backend.espeak.wrapper import EspeakWrapper
EspeakWrapper.set_library(espeakng_loader.get_library_path()); EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
from phonemizer import phonemize
toks = {l.split(' ')[0] for l in open(__import__('os').environ.get('KOKORO_DIR','kokoro-multi-lang-v1_0')+'/tokens.txt', encoding='utf-8') if l.strip()}
text = open(sys.argv[1], encoding='utf-8').read()
words = sorted({w for w in re.findall(r"[a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9]+", text)}, key=str.lower)
lw = sorted({w.lower() for w in words})
ph = phonemize(lw, language='es-419', backend='espeak', with_stress=True, njobs=1)
bad = set(); out = []
for w, p in zip(lw, ph):
    p = p.strip().replace(' ', '')
    chars = [c for c in p if c in toks]; bad |= {c for c in p if c not in toks}
    out.append(w + ' ' + ' '.join(chars))
    if w != w.capitalize(): out.append(w.capitalize() + ' ' + ' '.join(chars))
open(sys.argv[2], 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(len(lw), 'palabras; fonemas fuera del vocabulario:', bad)
