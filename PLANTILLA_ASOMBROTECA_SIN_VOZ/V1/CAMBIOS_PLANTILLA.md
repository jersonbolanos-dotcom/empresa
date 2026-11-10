# Cambios de la plantilla SIN VOZ

Plantilla hermana de `PLANTILLA_ASOMBROTECA` (v1.28) para reels cortos sin narración. El motor (`motor/plantilla.js`), `lib/` y las fuentes son copias idénticas de la v1.28; todo lo nuevo está en `motor/reel.js` y `tools/`.

| Versión | Fecha | Qué cambió | Origen |
|---|---|---|---|
| SIN_VOZ 1.0 | 2026-11-10 | Primera versión. Reloj sin voz `03_GUION/tiempos.txt` → `js/tiempos.js` (`tools/tiempos.py`). Módulo `motor/reel.js`: `R.make` (montaje sin subtítulos, zona segura, efectos en el fotograma exacto, música en bucle y enlace del bucle), `R.texto`/`R.titulares` (texto grande animado en zona segura), `R.fondo`, `R.musica` y los formatos `R.contador`, `R.quiz` + `R.cuentaAtras`, `R.tamanos`, `R.lineaTiempo` y `R.capas`. Herramientas `nuevo_reel.py` y `producir_reel.py` (QC propio). 5 reels de ejemplo. | Pedido del usuario: reels hipnóticos sin narración |
