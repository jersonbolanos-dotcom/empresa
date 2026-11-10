# QC · SIM_FOURIER_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 32.00 s · 6.6 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 0.93/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 1.79/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 15.7/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -14.0 LUFS · pico -4.3 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 12/12 arranques coinciden con eventos (13 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 0 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula) | tipos: contador (máx. 1 a la vez), eje (máx. 2 a la vez), formula (máx. 3 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Qué animal dibujan estos círculos?» (5 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Cualquier dibujo se puede hacer sumando *círculos que giran.* / (Fourier, 1822)» (11 palabras) a 28.6 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 320/320 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.2/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.1): no hay objetos físicos; las dos cadenas (x arriba, y a la izquierda) van encadenadas centro con centro desde centros fijos y sus líneas punteadas se cruzan en el lápiz, sobre un plano cartesiano tenue (la «x» del eje dentro de la zona segura). La fórmula de la esquina enciende los términos nuevos (k = …). Hasta 18 círculos hay garabatos; con 40 empieza a verse el animal y con 900 sale el elefante detallado (ojo y arrugas de la trompa dibujados por el propio trazo); al final la cámara se acerca y un tramo de luz sigue recorriendo la silueta. La frase se va antes de que vuelva la pregunta.
