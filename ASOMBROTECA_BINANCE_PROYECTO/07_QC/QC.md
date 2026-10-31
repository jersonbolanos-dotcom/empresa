# Informe QC · ASOMBROTECA_BINANCE_FINAL.mp4

Fecha: 31 oct 2026. Solo figura lo que se ejecutó de verdad. La evidencia está en esta carpeta.

## Técnico (ffprobe.txt, decode_errors.txt, black_freeze.txt, export_ffmpeg_log.txt, render_log.txt)

| Prueba | Resultado | Estado |
|---|---|---|
| Vídeo | H.264 High, 1080×1920, yuv420p, 30/1 fps, 3465 fotogramas, ≈4,0 Mb/s (CRF 17) | PASS |
| Audio | AAC-LC, 48 kHz, estéreo, 256 kb/s, 115,487 s | PASS |
| Duración | Contenedor 115,500 s = 3465/30. Voz 115,487 s, entera (DURATION = duración de ffprobe) | PASS |
| moov al inicio (faststart) | Sí | PASS |
| Decodificación completa (`ffmpeg -f null -`) | 0 errores | PASS |
| Conteo de fotogramas decodificados | 3465 = ceil(115,487 × 30), sin duplicados ni pérdidas (render por índice i/30) | PASS |
| Fotogramas negros (`blackdetect` d ≥ 0,1 s) | Ninguno | PASS |
| Congelados (`freezedetect` d ≥ 1,5 s) | Ninguno | PASS |
| Sonoridad de la mezcla | −14,8 LUFS integrado, LRA 2,0 LU, pico −1,0 dBFS (sin clipping) | PASS |
| Voz original intacta | SHA-256 de `05_AUDIO/voice_original.mp3` = archivo subido (e8be7b76…65b0) | PASS |
| Tiempo por fotograma | 18–50 ms en Chromium headless (objetivo < 100 ms) | PASS |
| Errores JS durante el render | 0 (render_log.txt) | PASS |

## Subtítulos (06_SUBTITULOS/subtitulos.srt)

| Prueba | Resultado | Estado |
|---|---|---|
| Orden y solapes | 65 bloques, tiempos monótonos, sin solapes | PASS |
| Máximo de líneas | 2 | PASS |
| Palabras por bloque | 1–6 (bloques de 1 palabra solo en frases de una palabra: «Entonces…», «Asombroteca.») | PASS |
| Caracteres por línea | ≤ 29. En el lienzo, Inter 600 a 64 px, con reducción automática si una línea supera 900 px | PASS |
| Estilo | Blanco con sombra suave y sin caja; barra #F0B90B bajo la palabra activa; franja centrada en y ≈ 1500 de 1920 | PASS |
| Sincronía por palabra | Alineación por pausas y sílabas: límites de frase ±0,05 s, palabras interiores ±0,25 s aprox. | PASS con límite: no se pudo verificar con reconocimiento de voz ni con escucha humana |

## Visual (capturas/, contacto_beats.png, storyboard_captura.png)

| Prueba | Resultado | Estado |
|---|---|---|
| Fotograma 0 con actividad y dato | Objeto con luz de contorno, rótulo «ROBO DE CRIPTOMONEDAS» y fecha que ya aparece | PASS |
| 12 beats capturados del MP4 | beat00–beat12 | PASS |
| Transiciones capturadas | 10 capturas en cambios de beat y en el barrido a blanco | PASS |
| Legibilidad a escala de teléfono | Revisada en hojas de contacto a 360×640: titulares, cifras y subtítulos legibles; rótulos secundarios de 30–32 px en el límite | PASS |
| Márgenes y solapes | Corregidos en esta sesión: callout cortado, rótulos fuera de alfa y alineación rota por un comentario. Tras la corrección no se ven textos cortados en las capturas | PASS |
| Logo de Asombroteca | No hay. Solo el texto «ASOMBROTECA» en la esquina superior izquierda | PASS |
| Continuidad del objeto héroe | El mismo módulo de custodia aparece en los 12 beats; una sola cámara continua y un barrido de luz final | PASS |

## Criterios de aceptación (sección G)

| Criterio | Estado |
|---|---|
| La primera imagen engancha (actividad + dato) | PASS (la cifra grande llega con su mención, a 16,6 s) |
| Cada beat muestra una transformación y el protagonista es continuo | PASS |
| Voz no generada ni alterada, sin palabras perdidas | PASS (archivo idéntico, duración completa; ganancia uniforme y limitador solo en la mezcla) |
| Duraciones sacadas del audio | PASS |
| Textos y subtítulos legibles, con margen para la interfaz | PASS |
| Sin logos | PASS |
| H, SOUND y la estructura del ejemplo conservadas | PASS (H y SOUND idénticos; cambios del estilo documentados) |
| Cifras sensibles correctas | PASS frente a fuentes de prensa del buscador; pendiente revisar en fuente primaria (ver FUENTES) |
| Música y efectos originales y sincronizados | PASS (síntesis propia con el kit SOUND; huecos en «¿cómo?», «lo más sorprendente» y «pero atención») |
| MP4, HTML, código y SRT validados | PASS |

## Pendiente, con verificación humana recomendada

1. Escuchar el MP4 entero y confirmar que lo que dice la voz coincide con el guion de referencia, sobre todo en los primeros 10 s.
2. Revisar el equilibrio voz/música/efectos en altavoz de teléfono. La medición dice que la voz domina (música y efectos unos 12–13 dB por debajo), pero no hubo escucha subjetiva.
3. Probar en las apps reales (TikTok, Reels, Shorts) que la interfaz no tapa los subtítulos.
