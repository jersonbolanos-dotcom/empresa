# ASOMBROTECA · Nikola Tesla imaginó el celular en 1926 (Ep. 01, «Predicciones del pasado»)

- Video final: `07_OUTPUT/ASOMBROTECA_TESLA_1926_FINAL.mp4` (85,5 s · 1080×1920 · 30 fps · −14 LUFS)
- Voz original intacta: `01_ENTRADA/audio/voz_original_tesla.mp3`
- Guion y alineación: `03_GUION/tramos.txt`, `03_GUION/transcripcion_whisper.json`, `04_CODIGO/alineacion.json`
- Subtítulos: `06_SUBTITULOS/subtitulos.srt`
- Código: `04_CODIGO/js/episodio.js` (18 beats, 17 escenas del brief) + `index.src.html` (plantilla v1.18)
- Audio: `05_AUDIO/musica_original.wav`, `efectos_sonido.wav`, `mezcla_final.wav`
- QC: `07_QC/QC.md`, hoja de contacto, secuencias de movimiento, md5 de la voz
- Fuentes y decisiones de rigor: `FUENTES_Y_DECISIONES.md`

Reconstruir (desde `04_CODIGO`): `python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py`, luego `render.js` / `audio.js`, la mezcla y la codificación del SUPERPROMPT.

Para la codificación de este episodio se añadió `-maxrate 8.5M -bufsize 17M`, porque el grano sepia exige un tope de tasa de bits.
