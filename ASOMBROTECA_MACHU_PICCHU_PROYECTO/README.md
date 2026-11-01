# ASOMBROTECA · ¿Cómo construyeron Machu Picchu en lo alto de los Andes?

- **Video final:** `07_OUTPUT/ASOMBROTECA_MACHU_PICCHU_FINAL.mp4` (1080×1920, 30 fps, 117,4 s, 82,0 MB). Miniatura en `07_OUTPUT/miniatura.jpg`.
- **Respaldo V1:** `07_OUTPUT/V1/`, `05_AUDIO/V1/`, `07_QC/V1/` y `04_CODIGO/V1_respaldo/episodio_v1.js`.
- **Corrección final:** se rediseñó la ciudadela (`citadel` v1.12.1) para que todas las construcciones se apoyen en plataformas. Se añadieron muros de contención, terrazas en la ladera y un pico de fondo sin edificios. Los trabajadores se colocan sobre las plataformas reales. Las fuentes se conectan con el canal. Las notas tienen al menos 32 px y se parten en dos líneas en lugar de achicarse.
- **Base:** `PLANTILLA_ASOMBROTECA` v1.12.1. Este episodio añadió los bloques de montaña, mampostería, terrazas, drenaje y agua, 6 FX y 4 reglas nuevas del SUPERPROMPT.
- **Arco (24 beats):**
  1. Ciudadela entre la niebla (≈ 2.430 m).
  2. Montañas y lluvia.
  3. ¿Sin máquinas? Del presente al siglo XV.
  4. Ingeniería bajo la piedra.
  5. El terreno.
  6. Agua + pendiente = riesgo.
  7. Terrazas.
  8. ¿Qué había dentro?
  9. Capas y drenaje.
  10. El agua sale.
  11. Cantera.
  12. Percusión y abrasión.
  13. Materiales locales.
  14. Piedras que encajan.
  15. Sin mortero.
  16. El agua.
  17. Canal y 16 fuentes por gravedad.
  18. Tres sistemas.
  19. Cinco siglos.
  20. Ingeniería adaptada a la naturaleza.
  21. Asombroteca.

| Carpeta | Contenido |
|---|---|
| `01_ENTRADA/audio/` | Voz original, sin modificar |
| `03_GUION/` | `tramos.txt` corregido y la transcripción de Whisper |
| `04_CODIGO/` | `index.src.html`, `js/episodio.js`, `js/datos.js` y `alineacion.json` (se construye con `python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py`) |
| `05_AUDIO/` | Voz, música original, efectos y mezcla final (con ducking) |
| `06_SUBTITULOS/` | `subtitulos.srt` |
| `07_QC/` | `QC.md`, ffprobe, determinismo, hoja de contacto y fotogramas de revisión |
| `FUENTES_Y_DECISIONES.md` | Datos, fuentes, rigor, decisiones y mejoras al prompt |
