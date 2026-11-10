# QC · SIM_GALTON_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 45.00 s · 17.9 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 0.56/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 1.12/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 19.2/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -13.9 LUFS · pico -3.6 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 77/77 arranques coinciden con eventos (35796 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 0 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula) | tipos: contador (máx. 1 a la vez), eje (máx. 17 a la vez), etiqueta (máx. 1 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Dónde caerá / la última bola?» (5 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Por eso la *estatura* de la gente forma esta misma curva.» (11 palabras) a 38.8 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 450/450 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.1/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.1): todas las bolitas caen por gravedad y se apoyan en la pila o en el piso de su casilla. La bola blanca se sigue a cámara lenta (~11 s) con zoom ×1,3 de altura fija: el tablero entero, la llegada y la campana quedan dentro de la zona segura (piso en y ≈ 1415). Aparecen 16 flechitas ← → y la cuenta «← 7 · 9 →»; la blanca cae en la casilla 9 (número encendido). La frase sale SOLO tras la llegada (38,8 s) y nunca coincide con la pregunta («¿Dónde caerá / la última bola?», equilibrada). Mientras se lee, la pila baja despacio y sale por la ranura del piso (sin dibujarse debajo) hasta el empalme. La marca de agua, con contorno, se lee siempre encima de las bolitas.
