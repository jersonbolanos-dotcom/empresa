# ASOMBROTECA · Episodio 03 · Yakhchal: hielo en el desierto — V2 (corrección cinematográfica profunda)

- **Video final oficial, CON la fotografía real del yakhchal de Meybod:** `07_OUTPUT/ASOMBROTECA_03_YAKHCHAL_FINAL.mp4`
  - 96,0 s · 2880 fotogramas · 1080×1920 · 30 fps
  - H.264 High + AAC 48 kHz estéreo
  - −14,0 LUFS · pico −1,6 dB · 73 MB
- **Versiones anteriores (V1):** `07_OUTPUT/V1/`, que contiene la entrega con foto y la entrega sin foto. También quedan en V1 el QC, el audio y el código:
  - `07_QC/V1/`
  - `05_AUDIO/V1/`
  - `04_CODIGO/V1/`
- **Voz original intacta:** `01_ENTRADA/audio/voz_original_yakhchal.mp3` (md5 `a7d4b23ebe34d850c0fcafe2d915dab8`).
- **Código:** `04_CODIGO/js/episodio.js` (20 planos, plantilla v1.21), `js/fotos.js` (la foto) y `comprobaciones.js` (20 pruebas, todas superadas).
- **QC:** `07_QC/QC.md`
  - pruebas técnicas: `qc_tecnico.txt`;
  - hoja de contacto del MP4: `hoja_contacto_mp4.jpg`;
  - tiras de movimiento: `movimiento_V2_*`;
  - comparación foto ↔ modelo: `comparacion_foto_modelo.jpg`.

**Reconstruir (desde `04_CODIGO`):**
1. Construir y comprobar:
   ```
   python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py
   node comprobaciones.js > ../07_QC/comprobaciones.txt
   ```
2. Render y audio:
   ```
   node $T/render.js index.html <fotogramas> 6
   node $T/audio.js index.html ../05_AUDIO
   ```
   Renombrar las pistas a `musica_original.wav` y `efectos_sonido.wav`.
3. Mezcla (ver `07_QC/QC.md`): voz, música +1 dB con compresión por la voz (sidechain), efectos −3 dB, +7,8 dB y `alimiter=0.8`, fundido final en 95,207 s.
4. Codificación:
   ```
   libx264 -preset slow -crf 20 -maxrate 8.5M -bufsize 17M -pix_fmt yuv420p · AAC 192k 48 kHz
   ```
