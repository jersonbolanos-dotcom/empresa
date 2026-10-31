#!/usr/bin/env python3
"""Descarga retratos auténticos citados en 07_FOTOS_Y_LICENCIAS.md. Requiere internet. No inventa imágenes ni ignora errores."""
from pathlib import Path
import urllib.request
from PIL import Image

assets = Path(__file__).resolve().parents[1] / 'assets' / 'fotos'
assets.mkdir(parents=True, exist_ok=True)
photos = [
    ('elon_musk_2022_dominio_publico.jpg', 'https://upload.wikimedia.org/wikipedia/commons/1/17/Elon_Musk_April_2022.jpg'),
    ('changpeng_zhao_2022_cc_by_sa_4.jpg', 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Changpeng_Zhao_in_2022.jpg'),
    ('changpeng_zhao_websummit_2022_cc_by_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/a/ae/BE0_6626_%2852470900064%29.jpg'),
]
failed=[]
for name,url in photos:
    path=assets / name
    try:
        if not path.exists():
            req=urllib.request.Request(url, headers={'User-Agent':'AsombrotecaStudio/1.0 (documentary editorial use; contact via site)'})
            with urllib.request.urlopen(req, timeout=35) as resp:
                data=resp.read()
            if len(data)<8000: raise ValueError('Archivo demasiado pequeño; revisar error del servidor')
            path.write_bytes(data)
        with Image.open(path) as im:
            im.verify()
        with Image.open(path) as im:
            print(f'OK: {name} ({im.width}×{im.height})')
    except Exception as e:
        print(f'ERROR: {name} -> {type(e).__name__}: {e}')
        failed.append((name,url))
if failed:
    print('Descargas no completadas. Ver 07_FOTOS_Y_LICENCIAS.md y aportar fotos válidas antes de exportar video.')
    raise SystemExit(1)
print('Fotos disponibles. Revisar condiciones y créditos de cada imagen antes de publicación.')
