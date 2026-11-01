# ASOMBROTECA · ¿Cómo construyen túneles debajo de los ríos sin que se inunden?

- **Video final (V2):** `07_OUTPUT/ASOMBROTECA_TUNEL_BAJO_RIO_FINAL.mp4` (1080×1920, 30 fps, 105,12 s, −14,1 LUFS). La V1 está en `07_OUTPUT/V1/`.
- **Plantilla:** v1.16.1 (tuneladora como un solo sistema, `ringSection`) sobre v1.16 (módulo de túneles: `TUN`, `tunWorld`, `tbmSide`, `tunCross`, `riverAerial`, `cutterFace`, `ringBuild`, `gasketHD`, `tunnelView`; FX `corteTBM`, `sinfin`, `tren`).
- **Código:** `04_CODIGO/js/episodio.js` (+ `index.src.html`, `alineacion.json`, `js/datos.js`). Construir: `python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py`.
- **Audio:** `05_AUDIO/voz_original.mp3` (intacta), `musica_original.wav`, `efectos_sonido.wav`, `mezcla_final.wav`.
- **Subtítulos:** `06_SUBTITULOS/subtitulos.srt`. **Guion/tramos:** `03_GUION/`.
- **QC:** `07_QC/QC.md`, `07_QC/hoja_contacto.jpg`, `07_QC/fotogramas/`, `07_QC/secuencias/`.
- **Fuentes y decisiones:** `FUENTES_Y_DECISIONES.md`.

Mezcla: voz mono → estéreo; música −2 dB con sidechain de la voz; efectos −2 dB; +4,4 dB; alimiter 0,84; fundido final 0,8 s desde 104,32 s. Codificación: libx264 crf 20, High@4.1, yuv420p, faststart; AAC 192 kb/s 48 kHz.
