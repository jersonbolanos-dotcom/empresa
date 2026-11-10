# QC · SIM_PENDULOS_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 38.00 s · 10.2 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 2.43/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 3.81/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 16.6/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -14.0 LUFS · pico -6.5 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 8/8 arranques coinciden con eventos (1443 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 0 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula, unidad) | tipos: contador (máx. 1 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Volverán a alinearse?» (3 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Cada péndulo marca su ritmo solo con su *longitud*.» (9 palabras) a 34.3 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 380/380 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.2/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.2): los 15 péndulos cuelgan de sus dos anclajes (hilos en V) en la barra horizontal, sostenida por dos postes apoyados en la base; las sombras de las bolas caen sobre la base. Vista 3D fija un poco desde arriba, dentro de la zona segura (x 130-930, y 445-1230). Se ven la serpiente (1,6 y 36,4 s), las ondas (4,7 y 30,1 s), el caos aparente (11-27 s) y la fila casi alineada (33,2 s; alineación exacta a los 34 s). Solo el contador de segundos, separado de la marca de agua. La frase sale tras la realineación y nunca coincide con la pregunta.
