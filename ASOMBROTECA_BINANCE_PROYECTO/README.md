# ASOMBROTECA · El robo de Binance (micro-película vertical)

Entregable final: `../ASOMBROTECA_BINANCE_FINAL_V3.mp4` (cambios en INFORME_V3.md). Versión anterior: `../ASOMBROTECA_BINANCE_FINAL_V2.mp4` y `08_VERSION_ANTERIOR_V2/`. Formato 1080×1920, 30 fps, H.264 yuv420p, AAC estéreo 48 kHz, 115,5 s.

| Carpeta | Contenido |
|---|---|
| `01_ENTRADA/audio/` | Voz original del usuario, sin modificar, y el guion de referencia |
| `02_REFERENCIA_ORIGINAL/` | PDF original, texto extraído sin editar, `lib/harness.js`, `lib/sound.js` y `styles/product-launch.js` reconstruidos (ver RECONSTRUCCION.md) |
| `03_STORYBOARD/storyboard.html` | 12 paneles Canvas dibujados con el código del vídeo y su tabla de beats |
| `04_CODIGO/index.html` | Reproductor autocontenido (voz incrustada): play/pausa, barra de búsqueda, tiempo, sonido y loop. Expone `window.seek(t)`, `window.DURATION`, `window.scoreSound` y `window.explainer` |
| `04_CODIGO/js/` | `estilo_base.js` (estilo adaptado a 9:16), `protagonistas.js` (V3: emblema, bóveda, billetera, tarjetas, cajas), `logos.js` (trazados SVG), `binance.js` (explainer), `sonido_binance.js` (efectos y música), `datos.js` (alineación) |
| `04_CODIGO/recursos/logos/` | SVG genuinos de Binance, BTC, ETH, USDT y BNB con sus licencias CC0 |
| `03_STORYBOARD/MAPA_ESCENAS_V3.md` | Frase, tiempo, visual V2, nuevo protagonista, transición y sonido |
| `04_CODIGO/tools/` | Alineación, subtítulos, build, storyboard, render de fotogramas, stems de audio y reconstrucción desde el PDF |
| `05_AUDIO/` | `voice_original.mp3` (copia exacta), `music.wav`, `sfx.wav` y `mix.wav` |
| `06_SUBTITULOS/subtitulos.srt` | Subtítulos en español |
| `07_QC/` | QC.md, ffprobe.txt, logs y capturas |
| `FUENTES_Y_DECISIONES.md` | Fuentes con URL, decisiones y limitaciones |

## Reproducir el pipeline (desde `04_CODIGO`, con Node, Playwright/Chromium, Python 3 y FFmpeg)

```bash
python3 -I tools/alinear.py <sil_mayor.txt> <sil_menor.txt> 115.487313 alineacion.json   # ver cabecera del script
python3 -I tools/subtitulos.py alineacion.json ../06_SUBTITULOS/subtitulos.srt js/datos.js
python3 -I tools/build.py                      # -> index.html autocontenido
python3 -I tools/storyboard.py                 # -> ../03_STORYBOARD/storyboard.html
node tools/audio.js index.html ../05_AUDIO     # -> sfx.wav, music.wav
node tools/render.js index.html /tmp/frames 4 30
# mezcla y exportación: comandos exactos en ../07_QC/QC.md y export_ffmpeg_log.txt
```

Mezcla usada:

```bash
ffmpeg -i voice_original.mp3 -i music.wav -i sfx.wav -filter_complex "[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0[v];[1:a]volume=2dB[m];[2:a]volume=-12dB[s];[v][m][s]amix=inputs=3:duration=first:normalize=0,volume=4dB,alimiter=limit=0.89:level=false:attack=3:release=60[o]" -map "[o]" -c:a pcm_s24le -ar 48000 mix.wav
ffmpeg -framerate 30 -i frames/f_%05d.jpg -i mix.wav -c:v libx264 -preset slow -crf 17 -profile:v high -level 4.2 -pix_fmt yuv420p -r 30 -c:a aac -b:a 256k -movflags +faststart -t 115.487 ASOMBROTECA_BINANCE_FINAL_V3.mp4
```
