#!/usr/bin/env python3
"""Descarga dos imágenes históricas verificadas desde Wikimedia Commons.
Ejecutar: python descargar_imagenes.py
Requiere conexión a Internet en el equipo local.
"""
from pathlib import Path
import urllib.request
import urllib.error

DEST = Path(__file__).resolve().parent / 'referencias_originales'
DEST.mkdir(exist_ok=True)
IMAGES = [
    ('01_Arthur_C_Clarke_foto_1965.jpg',
     'https://upload.wikimedia.org/wikipedia/commons/6/62/Arthur_C._Clarke_1965.jpg',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/Arthur_C._Clarke_1965.jpg'),
    ('02_Sputnik_1_replica_NASA.jpg',
     'https://upload.wikimedia.org/wikipedia/commons/b/be/Sputnik_asm.jpg',
     'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sputnik_asm.jpg'),
]
for name, *urls in IMAGES:
    target = DEST/name
    if target.exists() and target.stat().st_size > 1000:
        print(f'[YA EXISTE] {name}')
        continue
    errors=[]
    for url in urls:
        try:
            req = urllib.request.Request(url, headers={'User-Agent':'AsombrotecaStudio-Educational/1.0 (Mozilla/5.0)', 'Accept':'image/jpeg,image/*;q=0.9'})
            with urllib.request.urlopen(req, timeout=35) as r:
                data = r.read(12_000_000)
                mime = r.headers.get('content-type','')
            if not data.startswith(b'\xff\xd8\xff') or len(data) < 1000:
                raise ValueError(f'Archivo no parece JPG valido: {mime}, {len(data)} bytes')
            target.write_bytes(data)
            print(f'[OK] {name}: {len(data):,} bytes')
            break
        except Exception as e:
            errors.append(str(e))
    else:
        print(f'[ERROR] {name}: ' + ' / '.join(errors))
        print('Descargar manualmente desde el enlace en FUENTES_Y_LICENCIAS.txt')
print('\nCarpeta:', DEST)
