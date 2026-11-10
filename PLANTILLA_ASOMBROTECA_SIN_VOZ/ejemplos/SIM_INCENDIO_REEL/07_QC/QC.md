# QC · SIM_INCENDIO_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 40.00 s · 10.2 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 0.23/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 0.91/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 29.4/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -14.7 LUFS · pico -3.0 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 290/303 arranques coinciden con eventos (2084 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 0 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula, unidad) | tipos: contador (máx. 1 a la vez), etiqueta (máx. 2 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez), unidad (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Se quemará / todo el bosque?» (5 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Por debajo del *59 %* de árboles, el fuego ya no cruza el bosque.» (13 palabras) a 35.4 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 400/400 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.2/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.2): vista cenital; árboles, tocones, brasas, llamas y humo quedan sobre el suelo del bosque, dentro de la zona segura. Los dos cortafuegos (mismo ancho, tierra y tocones) llevan su etiqueta: «66 % árboles» (el fuego lo cruza, 21-39 %) y «42 % árboles» (el fuego entra pero se detiene). El contador grande lleva debajo «quemado» y no se confunde con las etiquetas. Sin tiempo muerto: a 65 % el frente aún arde y, apagado el último árbol (70 %), entra la frase; nunca coincide con la pregunta. Al final el bosque rebrota y el contador baja a 0 % para empalmar.
