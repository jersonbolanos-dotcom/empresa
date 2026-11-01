# ASOMBROTECA · ¿Cómo funciona un microondas?

- **Video:** `07_OUTPUT/ASOMBROTECA_MICROONDAS_V1.mp4` (1080×1920, 30 fps, 83,9 s). Miniatura en `07_OUTPUT/miniatura.jpg`.
- **Base:** hecho con `PLANTILLA_ASOMBROTECA` v1.2. Este episodio añadió a la plantilla los subtítulos «barra», la cámara 2.5D, las ondas, las moléculas, la rampa térmica, los nuevos efectos de sonido y el ducking.

| Carpeta | Contenido |
|---|---|
| `01_ENTRADA/audio/` | Voz original, sin modificar |
| `03_GUION/` | `tramos.txt` (21 tramos) y la transcripción de Whisper |
| `04_CODIGO/` | `index.src.html` (usa el motor de `../PLANTILLA_ASOMBROTECA`), `js/episodio.js` (6 beats), `js/datos.js`, `alineacion.json` y los silencios |
| `05_AUDIO/` | Voz, música original, efectos y mezcla |
| `06_SUBTITULOS/` | `subtitulos.srt` |
| `07_QC/` | QC.md, ffprobe, determinismo, render.log y hoja de contacto |
| `FUENTES_Y_DECISIONES.md` | Ciencia verificada, fuentes y decisiones visuales |

**Reproducir**, desde `04_CODIGO`:

```
python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py
node ../../PLANTILLA_ASOMBROTECA/tools/render.js index.html frames 4
node ../../PLANTILLA_ASOMBROTECA/tools/audio.js index.html stems
```

Luego se mezcla con ducking y se codifica como indica `INSTRUCCIONES_PLANTILLA.md`.
