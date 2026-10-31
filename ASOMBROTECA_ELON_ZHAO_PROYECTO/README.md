# ASOMBROTECA · Musk vs Zhao (Editorial Essay Collage)

Entregable actual: `../FINAL_ASOMBROTECA_ELON_ZHAO_1080x1920_FOTOS.mp4` (con fotografías reales de Musk y Zhao). Versión anterior conservada: `../FINAL_ASOMBROTECA_ELON_ZHAO_1080x1920.mp4` (fichas tipográficas). Ambas en 1080×1920, 30 fps, 64,6 s, con la misma narración.

| Carpeta | Contenido |
|---|---|
| `01_ENTRADA/audio/` | Voz original, sin modificar |
| `02_REFERENCIA_KIT/` | Kit V5 completo, tal como llegó |
| `03_STORYBOARD/` | `storyboard.html` (12 paneles Canvas y tabla X-01…X-05) y `MAPA_ESCENAS.md` |
| `04_CODIGO/` | `index.html` (reproductor autocontenido con `window.seek`, `window.DURATION` y `window.scoreSound`), `js/episodio.js` (escenas), `js/sonido.js`, el núcleo collage del kit, `recursos/` (logos, emojis, fotos) y `tools/` |
| `05_AUDIO/` | `voz_original.mp3`, `musica_original.wav`, `sfx.wav` y `mix.wav` |
| `06_SUBTITULOS/subtitulos.srt` | Subtítulos |
| `07_QC/` | QA.md, ffprobe.txt, logs, capturas y hoja de contacto |
| `assets_manifest.csv`, `FUENTES_Y_DECISIONES.md` | Licencias, fuentes y decisiones |

## Añadir las fotos reales y volver a renderizar

1. Copiar `elon_musk_2022_dominio_publico.jpg` y `changpeng_zhao_2022_cc_by_sa_4.jpg` (enlaces en el manifiesto) a `04_CODIGO/recursos/fotos/`. Opcional: `<archivo>.crop.json` con `[x, y, ancho, alto]` para encuadrar el rostro.
2. Desde `04_CODIGO`: `python3 -I tools/build.py && python3 -I tools/storyboard.py && node tools/render.js index.html /tmp/frames 4 30`.
3. Codificar con el mismo comando ffmpeg que figura en `07_QC/export_ffmpeg_log.txt`, con la mezcla `05_AUDIO/mix.wav`.
