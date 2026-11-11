# QC · SIM_TURING_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 28.00 s · 3.5 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 0.33/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 2.82/255 en 0,5 s | ✔ |
| Fondo oscuro (luminancia media) | 36.1/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -14.7 LUFS · pico -3.6 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 69/70 arranques coinciden con eventos (96 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 2 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula, unidad) | tipos: contador (máx. 1 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez), unidad (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Quién pinta / estas manchas?» (4 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Alan Turing explicó en 1952 cómo pueden / formarse solas las manchas de los animales.» (14 palabras) a 22.0 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 280/280 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.2/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.4): las manchas están en la piel (parche iluminado sobre fondo oscuro, dentro de la zona segura). Ocho semillas crecen, se parten en dos y llenan la piel hacia los 20 s (8 → 39 → 79 → 95 → 100); después se acomodan, con la luz moviéndose despacio. La frase sale a los 22 s con la piel ya llena y nunca coincide con la pregunta; al final la piel vuelve a quedar lisa para empalmar. Sin tiempo muerto.
