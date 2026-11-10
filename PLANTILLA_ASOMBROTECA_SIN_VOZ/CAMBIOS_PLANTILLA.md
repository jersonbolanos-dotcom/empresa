# Cambios de la plantilla SIN VOZ

Plantilla hermana de `PLANTILLA_ASOMBROTECA` (v1.28). `motor/plantilla.js`, `lib/` y `fonts/` son copias idénticas de la v1.28.

| Versión | Fecha | Qué cambió | Origen |
|---|---|---|---|
| SIN_VOZ 1.0 | 2026-11-10 | Reels de infografía con 5 formatos (contador, quiz, tamaños, línea del tiempo, capas), reloj `tiempos.txt`, `motor/reel.js`, `nuevo_reel.py` y `producir_reel.py`. Respaldada entera en `V1/`. | Pedido del usuario |
| SIN_VOZ 2.0 | 2026-11-10 | Rehecha como plantilla de **simulación hipnótica**. Nuevo `motor/sim.js` con simulaciones precalculadas y deterministas: `SIM.rebote` (división al tocar el borde, radio por generación, choques elásticos con masa), `SIM.galton` (gravedad, choques con clavos, rozamiento, precarga, apilado por casillas), `SIM.fourier` (DFT de un trazo, epiciclos), `SIM.grid` y `SIM.resample`. `motor/reel.js` v2: una sola escena, fondo oscuro, pregunta ≤ 6 palabras, contador grande, frase final que se va antes del empalme, marca de agua «ASOMBROTECA» durante todo el vídeo, empalme con el fotograma 0, sonido ASMR desde los eventos (`R.asmr`, voces madera/cristal/gota/tic/campana, escala pentatónica, control de densidad) y `R.zumbido`. `tiempos.txt` v2 (PREGUNTA, FRASE, FUENTE, PARAM). QC v2: una escena (scdet), movimiento continuo, fondo oscuro, sonido = eventos, texto mínimo, marca en todas las muestras, bucle. Herramientas `sim_info.js` (ajuste en el navegador) y `textos.js`. 3 ejemplos: bacterias (rebote), Galton y Fourier (elefante). | Pedido del usuario: reels «oddly satisfying» con millones de vistas |
