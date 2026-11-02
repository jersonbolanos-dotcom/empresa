# ASOMBROTECA STUDIO - VIDEO 04
# Ejecutar en VS Code: python descargar_imagenes.py
# Descarga fotografias/ilustraciones autenticas a ./referencias_originales/
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

ASSETS = {
    '01_Julio_Verne_retrato_historico.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/69/Portrait_de_Jules_Verne_%281828-1905%29%2C_%C3%A9crivain._PH57401%282%29.jpg',
    '02_Ilustracion_proyectil_1868_Henri_de_Montaut.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/%27From_the_Earth_to_the_Moon%27_by_Henri_de_Montaut_38.jpg',
    '03_Apolo11_tripulacion_NASA_1969.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Apollo_11_Crew.jpg',
    '04_Apolo11_Saturno_V_despegue_NASA_1969.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Apollo_11_Saturn_V_lifting_off_on_July_16%2C_1969.jpg',
    '05_Apolo11_Buzz_Aldrin_Luna_NASA.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/AldrinOnMoon.jpg',
}

def main():
    directory = Path(__file__).resolve().parent / 'referencias_originales'
    directory.mkdir(parents=True, exist_ok=True)
    done = 0
    for filename, url in ASSETS.items():
        path = directory / filename
        try:
            req = Request(url, headers={'User-Agent': 'Mozilla/5.0 AsombrotecaStudio/1.0 (historical educational documentary)'})
            with urlopen(req, timeout=40) as response:
                data = response.read()
                ctype = response.headers.get('Content-Type', '')
            if len(data) < 5000 or 'image' not in ctype:
                print(f'ERROR: {filename}: el servidor no devolvio imagen valida ({ctype}, {len(data)} bytes)')
                continue
            path.write_bytes(data)
            done += 1
            print(f'OK {filename} ({len(data):,} bytes)')
        except (URLError, HTTPError, TimeoutError, OSError) as ex:
            print(f'ERROR {filename}: {ex}')
            print(f'  Descarga manual: {url}')
    print(f'Listo: {done}/{len(ASSETS)} imagenes. Carpeta: {directory}')

if __name__ == '__main__':
    main()
