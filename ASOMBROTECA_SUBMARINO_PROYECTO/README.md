# ASOMBROTECA · El submarino que no volvió (Engineering Blueprint)

- Video: `07_OUTPUT/ASOMBROTECA_SUBMARINO_THRESHER_V1.mp4` (1080×1920, 30 fps, 73,3 s; voz original 72,281 s + 1 s de cola)
- Miniatura: `07_OUTPUT/miniatura.jpg` · Subtítulos: `06_SUBTITULOS/subtitulos.srt`

| Carpeta | Contenido |
|---|---|
| `01_ENTRADA/audio/` | Voz original, sin modificar |
| `02_REFERENCIA_KIT/` | Kit entregado, tal como llegó |
| `02_REFERENCIA_ORIGINAL_RECONSTRUIDA/` | Código del PDF Engineering Blueprint reconstruido y validado (`node --check`) |
| `03_GUION/` | Transcripción real del audio (Whisper + corrección) |
| `04_CODIGO/` | `index.html` autocontenido (`window.seek`, `window.DURATION`, `window.scoreSound`), `js/episodio.js`, `js/sonido.js`, `lib/` (H y SOUND sin modificar), `tools/` (alineación, subtítulos, build, render, audio, storyboard) |
| `05_AUDIO/` | voz, música original, sfx y mezcla |
| `07_QC/` | QC.md, ffprobe, determinismo, render.log, hoja de contacto, capturas |
| `08_STORYBOARD/` | `storyboard.html` (12 paneles Canvas con el código del video) y `MAPA_VOZ.md` |
| `FUENTES_Y_DECISIONES.md` | Diferencias con el guion propuesto, fuentes del Thresher y mejoras al prompt |

Reproducir: `cd 04_CODIGO && python3 -I tools/build.py && node tools/render.js index.html frames 4 && node tools/audio.js index.html stems`.
