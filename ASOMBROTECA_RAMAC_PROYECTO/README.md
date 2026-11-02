# ASOMBROTECA · El primer disco duro era una máquina gigantesca (Ep. 02, «La evolución del almacenamiento»)

- Video final: `07_OUTPUT/ASOMBROTECA_PRIMER_DISCO_DURO_FINAL.mp4` (V2 · 94,9 s · 1080×1920 · 30 fps · −14 LUFS · 73 MB · 4 fotografías reales)
- Voz original intacta: `01_ENTRADA/audio/voz_original_ramac.mp3`
- Guion y alineación: `03_GUION/tramos.txt`, `03_GUION/transcripcion_whisper.json`, `04_CODIGO/alineacion.json`
- Subtítulos: `06_SUBTITULOS/subtitulos.srt`
- Código: `04_CODIGO/js/episodio.js` (21 planos) + `index.src.html` (plantilla v1.19.1: IBM 350 rediseñado y bloques de almacenamiento)
- Audio: `05_AUDIO/musica_original.wav`, `efectos_sonido.wav`, `mezcla_final.wav`
- QC: `07_QC/QC.md`, 11 fotogramas de inspección, tiras de movimiento, md5 de la voz
- Fuentes y decisiones de rigor: `FUENTES_Y_DECISIONES.md`

Reconstruir (desde `04_CODIGO`): `python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py`, luego `render.js` / `audio.js`, la mezcla del SUPERPROMPT (música 0 dB, efectos −2 dB, +4,3 dB) y la codificación con `-crf 20 -maxrate 8.5M -bufsize 17M`.
- Fotografías reales: `01_ENTRADA/referencias/` (créditos en FUENTES_Y_DECISIONES.md) · incrustadas en `04_CODIGO/js/fotos.js`
