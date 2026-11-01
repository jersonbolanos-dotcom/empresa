# ASOMBROTECA · ¿Cómo pueden los puentes resistir los terremotos?

- **Video final (V2):** `07_OUTPUT/ASOMBROTECA_PUENTES_ANTISISMICOS_FINAL.mp4` (1080×1920, 30 fps, 101,99 s, −13,9 LUFS). La V1 está en `07_OUTPUT/V1/`.
- **Plantilla:** v1.15.1 (cámaras con profundidad, `isolatorHD`, `damperHD`, `roadView`, `bridgeSection`) sobre v1.15 (módulo de ingeniería sísmica: `quakeGround`, `sdof`, `bridge`, `isolatorDetail`, `damperDetail`, `jointDetail`; FX `temblor`, `estructura`, `hidraulico`, `metal`, `trafico`).
- **Código:** `04_CODIGO/js/episodio.js` (+ `index.src.html`, `alineacion.json`, `js/datos.js`). Construir: `python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py`.
- **Audio:** `05_AUDIO/voz_original.mp3` (intacta), `musica_original.wav`, `efectos_sonido.wav`, `mezcla_final.wav`.
- **Subtítulos:** `06_SUBTITULOS/subtitulos.srt`. **Guion/tramos:** `03_GUION/`.
- **QC:** `07_QC/QC.md`, `07_QC/hoja_contacto.jpg`, `07_QC/fotogramas/`, `07_QC/secuencias/`.
- **Fuentes y decisiones:** `FUENTES_Y_DECISIONES.md`.

Mezcla: voz mono → estéreo; música −2 dB con *sidechain* de la voz (umbral 0,03, ratio 6); efectos −1 dB; +4,9 dB; alimiter 0,84; fundido final de 0,8 s desde 101,19 s.
Codificación: libx264 crf 20, preset medium, High@4.1, yuv420p, faststart; AAC 192 kb/s 48 kHz.
