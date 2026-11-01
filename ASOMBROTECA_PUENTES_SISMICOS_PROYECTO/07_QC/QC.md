# QC · ASOMBROTECA_PUENTES_SISMICOS.mp4 (plantilla v1.15)

| Prueba | Resultado |
|---|---|
| Contenedor / códecs | MP4 · H.264 High (nivel 4.1) yuv420p · AAC LC 48 kHz estéreo 192 kb/s |
| Resolución / fps | 1080×1920 · 30 fps · 3059 fotogramas |
| Duración | 101,989 s (voz 100,989 s + 1 s de cola) |
| Tamaño | 68,2 MB (< 100 MB) |
| Decodificación completa (`ffmpeg -f null`) | 0 errores |
| blackdetect (d ≥ 0,3 s) | 0 tramos negros |
| freezedetect (n = 0,001, d ≥ 2,5 s) | 0 congelados |
| silencedetect (−45 dB, ≥ 1,5 s) | 0 silencios |
| Sonoridad (ebur128) | −13,9 LUFS integrados · LRA 2,7 LU · pico −1,3 dBFS |
| md5 de la voz (entrada = copia en 05_AUDIO) | 70d39c79874860c4e4036db6484a15b7 = 70d39c79874860c4e4036db6484a15b7 (voz intacta; es el reloj maestro) |
| Determinismo (mismos fotogramas en distinto orden de búsqueda) | IGUAL: t = 5,3 · 17,9 · 41 s dan el mismo md5 en orden directo e inverso |
| `Math.random` en el episodio | 0 usos (solo en un comentario) (solo `H.rng`) |
| Subtítulos | `capStyle: 'barra'`, `capY: 1540`; 60 bloques en `06_SUBTITULOS/subtitulos.srt` |
| Notas en pantalla | ≥ 32 px y fuera de la franja de subtítulos (rótulo de amplificación en y = 1385) |
| Marca | Solo «ASOMBROTECA» discreto al final; sin logos |
| Retrocompatibilidad v1.15 | Los 10 episodios anteriores reconstruidos con la plantilla (ya con el módulo v1.15) dieron hash IGUAL; los cambios posteriores tocan solo bloques nuevos de v1.15, que ningún otro episodio usa (comprobado con grep) |

## Inspección visual (hoja de contacto del MP4: `hoja_contacto.jpg`, fotogramas en `fotogramas/`)
- Un solo puente en todo el video; pilas, zapatas y estribos apoyados en el terreno (zapatas embebidas en la pendiente; estribos encajados en el talud con losas de acceso).
- El suelo se mueve primero; las pilas se curvan como ménsulas; el tablero responde; el rótulo de amplificación aparece en todas las escenas con sismo.
- Aislador: capas de caucho y láminas de acero en paralelogramo moderado, sin separación; placas unidas al tablero y al cabezal.
- Disipador en corte: pistón, fluido, cámara y anclajes; la barra de energía muestra que solo **parte** pasa a calor.
- Junta: peines en la calzada y holgura que se abre y se cierra sin llegar a cero.
- Comparación rígido/controlado con medidor de demanda calculado del modelo; sin afirmar que lo rígido siempre falla.
- Límites conocidos: los planos generales usan una proyección 2,5D simple (no 3D real); en el primer plano de la junta los peines se ven con poca profundidad porque la calzada está vista casi de canto.
