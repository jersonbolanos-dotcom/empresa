# QC · SIM_MANDELBROT_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 40.00 s · 44.0 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 5.97/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 5.68/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 35.2/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -14.3 LUFS · pico -3.6 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 29/29 arranques coinciden con eventos (36 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 0 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula, unidad) | tipos: contador (máx. 1 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Dónde termina / esta figura?» (4 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Nunca termina: toda esta figura / sale de una sola fórmula, *z² + c*.» (12 palabras) a 33.0 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 400/400 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.2/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.4): figura matemática sin objetos físicos; nada queda suspendido. Zoom continuo nítido de ×1 a ×37 millones por el valle de los caballitos de mar (espirales, minicopias a ×53.000 y ×220.000, filamentos), fondo oscuro con bordes de colores vivos. Franjas oscuras suaves detrás de la pregunta, la frase y el contador, que se leen sobre las zonas brillantes. La frase sale al final y nunca coincide con la pregunta; el contador se apaga antes del empalme y la minicopia final, encuadrada como el conjunto entero, empalma con el inicio (diferencia 0,2/255).
