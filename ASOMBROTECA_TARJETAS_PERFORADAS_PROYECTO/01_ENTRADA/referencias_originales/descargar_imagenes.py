from pathlib import Path
import json, urllib.request
root=Path(__file__).resolve().parent
out=root/'referencias_originales'
out.mkdir(exist_ok=True)
assets=json.loads((root/'MANIFIESTO_IMAGENES.json').read_text(encoding='utf-8'))
for item in assets:
 target=out/item['filename']
 try:
  request=urllib.request.Request(item['url'],headers={'User-Agent':'Mozilla/5.0 (Asombroteca educational media importer)'})
  with urllib.request.urlopen(request,timeout=50) as response:
   data=response.read()
  if len(data)<1000 or not data.startswith(b'\xff\xd8'):
   raise ValueError('La respuesta no parece ser un JPEG valido')
  target.write_bytes(data)
  print('OK',target.name,len(data),'bytes')
 except Exception as exc:
  print('ERROR',target.name,':',exc)
  print('Descarga manual:',item['source'])
print('Revisa:',out)
