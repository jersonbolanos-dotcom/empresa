# ASOMBROTECA · Episodio 03 · Yakhchal: hielo en el desierto

- **Video final (publicable sin condiciones de licencia):** `07_OUTPUT/ASOMBROTECA_03_YAKHCHAL_FINAL.mp4` (96,0 s · 1080×1920 · 30 fps · −14,0 LUFS · 64 MB)
- **Versión con la fotografía A (CC BY-SA 3.0, Ggia):** `07_OUTPUT/ASOMBROTECA_03_YAKHCHAL_CON_FOTO.mp4` (ver condiciones en `FUENTES_Y_DECISIONES.md`)
- **Voz original intacta:** `01_ENTRADA/audio/voz_original_yakhchal.mp3`
- **Fotografías recibidas:** `01_ENTRADA/referencias/`
- **Guion y alineación:** `03_GUION/`, `04_CODIGO/alineacion.json` · **Subtítulos:** `06_SUBTITULOS/subtitulos.srt`
- **Código:** `04_CODIGO/js/episodio.js` (20 planos sobre el modelo maestro `P.YK` de la plantilla v1.20), `index.src.html`, `js/fotos.js`
- **Comprobaciones automáticas:** `04_CODIGO/comprobaciones.js` → `07_QC/comprobaciones.txt`
- **Audio:** `05_AUDIO/` (música, efectos, mezcla) · **QC:** `07_QC/QC.md`

**Reconstruir (desde `04_CODIGO`):**
1. `python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py` y `node comprobaciones.js`.
2. `render.js` y `audio.js`.
3. Mezcla: música +1 dB, efectos −3 dB, +4,8 dB.
4. Codificación: `-crf 20 -maxrate 8.5M -bufsize 17M`.

**Versión sin foto:** se genera sustituyendo `window.FOTOS = {...}` por `window.FOTOS = {}` en el `index.html` construido.
