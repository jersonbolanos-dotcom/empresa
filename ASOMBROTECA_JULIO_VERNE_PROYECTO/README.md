# ASOMBROTECA · Episodio 04 · Julio Verne imaginó los viajes a la Luna en 1865

- **Video final:** `07_OUTPUT/ASOMBROTECA_04_JULIO_VERNE_FINAL.mp4`
  - 90,73 s · 1080×1920 · 30 fps constantes
  - H.264 + AAC 48 kHz · −14,1 LUFS · pico −1,6 dB · 59,7 MB
- **Voz original intacta:** `01_ENTRADA/audio/voz_original_julio_verne.mp3`
- **Documentos auténticos:** `01_ENTRADA/referencias_originales/` (y el paquete de descarga con sus fuentes)
- **Guion y alineación:** `03_GUION/` y `04_CODIGO/alineacion.json`
- **Subtítulos:** `06_SUBTITULOS/subtitulos.srt`
- **Código:** `04_CODIGO/js/episodio.js` (18 escenas, plantilla v1.22), `js/fotos.js`, `index.src.html`
- **Audio:** `05_AUDIO/` (`musica_original.wav`, `efectos_sonido.wav`, `mezcla_final.wav`)
- **QC:** `07_QC/QC.md`, `qc_tecnico.txt`, `hoja_contacto_mp4.jpg`, `movimiento_t*.jpg`, `fotogramas/`

**Reconstruir (desde `04_CODIGO`; T = `../../PLANTILLA_ASOMBROTECA/tools`):**
1. Construir:
   ```
   python3 -I $T/build.py
   ```
2. Render y audio:
   ```
   node $T/render.js index.html <fotogramas> 6
   node $T/audio.js index.html ../05_AUDIO
   ```
3. Mezcla: voz + música +1 dB con compresión por la voz (sidechain) + efectos −3 dB, luego +7,2 dB, `alimiter=0.8` y fundido final en 89,93 s.
4. Codificación:
   ```
   libx264 -crf 20 -maxrate 8.5M -bufsize 17M · AAC 192k
   ```
