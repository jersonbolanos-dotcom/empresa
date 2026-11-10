# QC · SIM_HORMIGA_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 35.00 s · 7.6 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 0.33/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 1.50/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 20.2/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -14.3 LUFS · pico -1.9 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 74/74 arranques coinciden con eventos (14769 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 0 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula, unidad) | tipos: contador (máx. 1 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez), unidad (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Qué construirá / la hormiga?» (4 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Con 2 reglas, tras *10.000 pasos* / de caos, construye esta autopista.» (11 palabras) a 30.4 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 350/350 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.2/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.3): la hormiga (flechita blanca) camina sobre el tablero de baldosas y las casillas llenas están en él. El paso a paso dura 2,5 s y luego acelera (7 → 67 → 266 → 652 → 2.819 pasos). La cámara encuadra siempre todas las casillas tocadas: el caos y la autopista completa (desde el paso 9.976) quedan dentro del tablero y de la zona segura. Las dos reglas, grandes bajo el tablero (casilla blanca → derecha, casilla de color → izquierda). La frase sale con la autopista ya larga y nunca coincide con la pregunta; al final todo se apaga para empalmar.
