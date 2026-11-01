# ASOMBROTECA · El submarino que no volvió · V3 (Plantilla Asombroteca)

- **Video:** `07_OUTPUT/ASOMBROTECA_SUBMARINO_PLANTILLA_V3.mp4` (1080×1920, 30 fps, 73,3 s, voz original).
- **Primer episodio hecho con la plantilla universal** `PLANTILLA_ASOMBROTECA/`, en piel «plana».
- **Versiones anteriores, intactas:**
  - V1 Engineering Blueprint: `../07_OUTPUT/`.
  - V2 Bioluminescent Deep Sea: solo storyboard, sin aprobar, en `../V2_DEEP_SEA/`.
- **Estructura:**
  - PROBLEMA: se hunde y no responde.
  - EXPLICACIÓN: tanques de lastre, PESO frente a EMPUJE y soplado con aire comprimido.
  - CASO REAL: USS Thresher, 1963, y la posible cadena de fallos en fichas de dominó.
  - CONSECUENCIA: la presión y las 129 personas, en silencio.
  - LECCIÓN.
  - SOLUCIÓN: SUBSAFE.
  - CIERRE: ASOMBROTECA y «Seguir».
- **Datos y fuentes:** los mismos que en V1 (`../FUENTES_Y_DECISIONES.md`). SUBSAFE se describe como «programa que certifica el casco y los sistemas de emergencia». En pantalla no aparecen cifras de profundidad ni de presión; el manómetro es cualitativo.
- **Reproducir:**

  ```
  cd 04_CODIGO && python3 -I tools/build.py && node tools/render.js index.html frames 6 && node tools/audio.js index.html stems
  ```

  Después se mezcla y se codifica como indica `PLANTILLA_ASOMBROTECA/INSTRUCCIONES_PLANTILLA.md`.

## V3.1 · Foto real
- **Video:** `07_OUTPUT/ASOMBROTECA_SUBMARINO_PLANTILLA_V3_1_FOTO_REAL.mp4`. La V3 se conserva sin cambios.
- **Cambio:** en la escena de 1963 (≈30,6–38,6 s), la ficha de archivo ya no lleva un submarino ilustrado. En su lugar va la **foto real del USS Thresher** que aportó el usuario: `../01_ENTRADA/fotos/uss_thresher_original.jpg`, embebida en `04_CODIGO/js/foto_thresher.js`. La foto tiene un acercamiento lento y el pie dice «FOTO REAL · USS THRESHER · U.S. NAVY».
- **Lo que no cambió:** el resto de fotogramas, el audio y los tiempos. Solo se volvieron a renderizar los fotogramas 915–1165.
