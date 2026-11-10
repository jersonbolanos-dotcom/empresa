# QC · SIM_CAOS_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 34.00 s · 5.1 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 2.15/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 3.20/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 16.5/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -14.0 LUFS · pico -2.3 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 41/41 arranques coinciden con eventos (56 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 1 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula, unidad) | tipos: contador (máx. 1 a la vez), etiqueta (máx. 1 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Seguirán juntos / los dos?» (4 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Una diferencia de una *millonésima* / basta para cambiarlo todo.» (9 palabras) a 29.0 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 340/340 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.1/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.3): los dos péndulos dobles cuelgan del mismo eje atornillado al tablero. Desde el inicio se ven los dos (rosa ancho debajo como contorno, celeste encima) y la etiqueta «1 millonésima» los señala con dos líneas de sus colores. Van juntos hasta ~13 s y se separan claramente a los 15,4 s; después, caos con estelas largas y brillantes. La barrita logarítmica crece hasta llenarse. Todo queda dentro del tablero y de la zona segura. La frase sale en pleno caos y nunca coincide con la pregunta; al final vuelven a la posición de salida para empalmar.
