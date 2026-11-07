# Asombroteca Studio - Episodio 06. Requiere Internet en el computador del usuario.
from pathlib import Path
from urllib.request import Request, urlopen
import json, imghdr
root = Path(__file__).resolve().parent
out = root / "referencias_originales"
out.mkdir(exist_ok=True)
assets = json.loads((root/"MANIFIESTO_IMAGENES.json").read_text(encoding="utf-8"))
for a in assets:
    dest=out / a["filename"]
    try:
        req=Request(a["url"],headers={"User-Agent":"Mozilla/5.0 (Asombroteca educational media)"})
        with urlopen(req,timeout=45) as f:
            data=f.read()
        ext=imghdr.what(None,data)
        if len(data)<10000 or ext not in ("png","jpeg"):
            raise ValueError(f"La respuesta no es una imagen esperada: {ext}, {len(data)} bytes")
        if a["filename"].lower().endswith(".png") != (ext=="png"):
            raise ValueError("Formato de imagen inesperado")
        dest.write_bytes(data)
        print("OK:",dest.name,"|",len(data),"bytes")
    except Exception as e:
        print("NO DESCARGADO:",dest.name, str(e))
        print("Descarga manual:",a["source"])
print("Carpeta de salida:",out)
