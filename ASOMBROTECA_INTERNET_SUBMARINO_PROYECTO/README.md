# ASOMBROTECA · ¿Cómo viaja internet de un continente a otro por el fondo del océano?

- **Video:** `07_OUTPUT/ASOMBROTECA_INTERNET_SUBMARINO_V1.mp4` (1080×1920, 30 fps, 100,8 s). La miniatura está en `07_OUTPUT/miniatura.jpg`.
- **Base:** `PLANTILLA_ASOMBROTECA` v1.6. Este episodio añadió los bloques de océano, cables y telecomunicaciones, y nueve FX nuevos.
- **Arco (14 beats):**
  1. Mensaje Colombia → Madrid.
  2. No por satélite: por cables (más del 99 %).
  3. Red mundial (≈ 600 sistemas, mapa estilizado).
  4. Descenso (≈ 4.000 m).
  5. Corte del cable.
  6. Fibra: núcleo y revestimiento, pulsos de luz.
  7. Datos → luz modulada.
  8. Pérdida de luz y repetidores (amplificadores ópticos).
  9. Cruce del Atlántico en ≈ 0,03 s.
  10. Barco cablero.
  11. Enterrado cerca de la costa.
  12. Rotura por ancla y reparación en 5 pasos.
  13. Regreso al celular y la red completa.
  14. «Sigue a Asombroteca».

| Carpeta | Contenido |
|---|---|
| `01_ENTRADA/audio/` | Voz original, sin modificar |
| `03_GUION/` | `tramos.txt` y la transcripción de Whisper |
| `04_CODIGO/` | `index.src.html`, `js/episodio.js`, `js/datos.js` y `alineacion.json` (se construye con `python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py`) |
| `05_AUDIO/` | Voz, música original, efectos y mezcla final (con ducking) |
| `06_SUBTITULOS/` | `subtitulos.srt` |
| `07_QC/` | `QC.md`, ffprobe, determinismo, render.log, hoja de contacto y fotogramas de revisión |
| `FUENTES_Y_DECISIONES.md` | Cifras verificadas, fuentes, decisiones y mejoras al prompt |
