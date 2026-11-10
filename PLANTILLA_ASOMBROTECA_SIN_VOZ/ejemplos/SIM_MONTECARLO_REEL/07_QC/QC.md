# QC · SIM_MONTECARLO_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 32.00 s · 9.7 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 0.51/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 3.07/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 21.1/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -13.9 LUFS · pico -5.3 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 3/3 arranques coinciden con eventos (40121 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 0 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula, unidad) | tipos: contador (máx. 1 a la vez), formula (máx. 2 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Qué número esconde / esta lluvia?» (5 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Lanzando puntos al azar se puede calcular *π*.» (8 palabras) a 27.6 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 320/320 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.1/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.2): cada gota cae desde arriba con su estela y se queda en el punto del plano donde toca (azul dentro del círculo, rosa fuera), con su anillo de salpicadura. El cuadrado, el círculo, el contador (debajo, sin taparlos) y la fórmula con los recuentos quedan dentro de la zona segura. La estimación oscila (3,2174 → 3,0285 → 3,1445) y termina en 3,1416 con 40.000 gotas; la frase sale solo tras la última gota y nunca coincide con la pregunta. Tras la lluvia, un barrido de luz gira sobre el círculo; luego la lluvia se seca, el contador vuelve a «?» y empalma con el inicio.
