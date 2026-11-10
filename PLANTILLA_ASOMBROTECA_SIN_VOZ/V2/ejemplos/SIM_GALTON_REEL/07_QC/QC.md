# QC · SIM_GALTON_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 40.00 s · 12.2 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 0.59/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 1.25/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 17.8/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -13.9 LUFS · pico -4.7 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 22/22 arranques coinciden con eventos (36122 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 0 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (solo pregunta, contador, frase y marca) | tipos: contador (máx. 1 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Dónde caerá la última bola?» (5 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Sumar muchos azares siempre dibuja la *campana de Gauss*.» (9 palabras) a 33.4 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 400/400 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.1/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4) y de la prueba del vaciado: todas las bolitas caen por gravedad y se apoyan en la pila o en el piso de su casilla. Al vaciar, la compuerta se desliza en horizontal y las bolitas salen por la ranura sin dibujarse bajo el piso (la marca de agua no se tapa). La última bola (blanca) cae sola; la campana dorada ajustada aparece sobre las casillas. La frase se va por completo antes de que vuelva la pregunta.
