# QC · SIM_BANDADA_FINAL.mp4

**TODO CORRECTO**

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración (25-45 s) / tamaño (< 100 MB) | 38.00 s · 25.0 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Una sola escena (sin cortes: scdet) | 0 cortes | ✔ |
| Movimiento continuo (cambio entre medios segundos) | mín. 0.16/255 · 0 congelados > 1 s · 0 negros | ✔ |
| Movimiento desde el fotograma 0 | 1.53/255 en 0,5 s | ✔ |
| Fondo de atardecer (luminancia media 60-180; FONDO atardecer) | 76.2/255 | ✔ |
| Sonoridad (−14 LUFS, pico ≤ −1 dBTP) | -14.0 LUFS · pico -5.4 dBTP | ✔ |
| Sonido sacado de la simulación (arranques = eventos ±25 ms) | 18/18 arranques coinciden con eventos (906 eventos) | ✔ |
| Música (muy baja o ninguna) | ninguna | ✔ |
| Silencios > 1 s (informativo) | 1 | ✔ |
| Determinismo (simulación precalculada incluida) | OK | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Texto mínimo (pregunta, contador, frase, marca; ≤ 2 etiquetas, ejes, fórmula, unidad) | tipos: contador (máx. 1 a la vez), frase (máx. 1 a la vez), marca (máx. 1 a la vez), pregunta (máx. 1 a la vez), unidad (máx. 1 a la vez) | ✔ |
| Pregunta y frase nunca juntas (empalme limpio) | 0 muestras con las dos | ✔ |
| Pregunta ≤ 6 palabras en el fotograma 0 · contador visible | «¿Quién guía / a esta bandada?» (5 palabras) · fotograma 0: sí · contador: sí | ✔ |
| Una sola frase final con el dato · fuente | «Nadie la guía: / cada pájaro sigue solo *3 reglas*.» (9 palabras) a 30.5 s · fuente: sí | ✔ |
| Marca de agua «ASOMBROTECA» todo el vídeo | 380/380 muestras | ✔ |
| Bucle (último fotograma ≈ primero) | diferencia media 0.1/255 | ✔ |
| Nada flota (revisión visual de la hoja de contacto) | OK | ✔ |

Reel SIN VOZ de simulación (v2.0): sin comprobación de voz ni de md5. Hoja de contacto: `hoja_contacto.jpg`. Dato y fuente en `FUENTES_Y_DECISIONES.md`.

## Revisión visual

nada flota: OK
Revisión de hoja_contacto.jpg (12 fotogramas del MP4, v2.4): los pájaros vuelan (trazos oscuros sobre el cielo de atardecer) y al final se posan en los árboles; nada queda suspendido sin volar. La nube se forma sola al llegar (1.233 → 2.400), se estira, se dobla y se enrolla. El halcón, silueta grande con alas abiertas, la atraviesa hacia los 17-20 s y la abre en ondas que se cierran. La frase sale después y nunca coincide con la pregunta; el contador baja a 0 cuando la bandada baja a dormir, y el cielo vacío empalma con el inicio.
