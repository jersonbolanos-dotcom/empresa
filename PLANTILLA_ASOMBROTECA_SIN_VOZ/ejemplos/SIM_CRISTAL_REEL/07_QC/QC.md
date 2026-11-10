# QC · SIM_CRISTAL_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 32.00 s · 7.7 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 0.40/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 0.79/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 16.0/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -13.8 LUFS · pico -6.7 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 6/6 arranques coinciden con eventos (6001 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 1 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula, unidad) | tipos: contador (máx. 1 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez), unidad (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Qué forma / crecerá aquí?» (4 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Partículas pegándose al azar / forman ramas como las de un *rayo*.» (11 palabras) a 27.4 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 320/320 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.1/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.3): todo ocurre sobre la placa (fija en pantalla); la primera partícula camina en zigzag y se pega a 1,3 s; luego llegan miles con la estela de sus últimos pasos y se pegan al cúmulo, que crece desde el núcleo sin salir de la placa ni de la zona segura. Color según el orden de llegada. La frase sale con las 6.000 partículas ya pegadas y nunca coincide con la pregunta; al final una onda de luz recorre las ramas y el cúmulo se apaga hasta el núcleo para empalmar.
