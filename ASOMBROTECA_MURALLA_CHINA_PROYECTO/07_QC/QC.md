# QC · ASOMBROTECA_GRAN_MURALLA_FINAL.mp4 (V2 · corrección geométrica definitiva, plantilla v1.14.2)

| Control | Resultado |
|---|---|
| Formato | 1080×1920 (9:16), 30 fps constantes, H.264 High@4.1 yuv420p, AAC-LC 48 kHz estéreo 256 kb/s, *faststart* (`ffprobe.txt`) |
| Duración | 114,711 s (voz 113,711 s + 1 s de cierre); 3.442 fotogramas renderizados; misma duración y sincronía que V1 |
| Tamaño | 86,1 MB (< 100 MB) |
| Reproducción / decodificación completa | ffmpeg decodifica todo el archivo sin errores |
| Negros / congelados | blackdetect y freezedetect: 0 |
| Silencios accidentales | silencedetect (−50 dB, ≥ 0,5 s): 0 |
| Sonoridad | −14,4 LUFS integrados; LRA 2,5 LU; pico verdadero −2,3 dBTP; entrada de 40 ms y salida de 0,8 s después de la voz |
| Voz | md5 idéntico al archivo subido (d552b4e8e7f872d88a1c366e81a13763): sin alterar, acelerar ni recortar |
| Subtítulos | sin cambios (64 bloques, estilo barra) |
| Determinismo | `determinismo.txt`: dos ejecuciones idénticas |
| Retrocompatibilidad v1.14.1 | IGUAL en los 10 episodios anteriores |
| Retrocompatibilidad v1.14.2 | RETRO_PENDIENTE |
| Indicadores | Se eliminó «altura de la capa: 175 %». Ahora: «CAPA n DE 7» + «compactación 0–100 %», que avanza un poco con cada golpe de pisón |
| Revisión visual | (1) Una ronda de hoja de contacto antes del render (35 fotogramas). Se corrigió: un radio negativo (error) en el anillo de impacto; nombres de periodos superpuestos en el mapa; el mapa invadía la leyenda; el mapa ocupaba poco espacio. (2) Tras el render: faltaba la clave de tiempo «territorio» (la detección de la amenaza no aparecía y fallaba el audio), corregido y renderizado de nuevo. (3) Revisión de 53 fotogramas del MP4: los primeros segundos de la escena de materiales quedaban vacíos; se añadió el paisaje de fondo y se volvió a renderizar y codificar. (4) Revisión final de 53 fotogramas del MP4 definitivo (`fotogramas_revision/`, `hoja_contacto.jpg`) y de pares de fotogramas consecutivos en la compactación (avance 70 → 80 % golpe a golpe) y en el transporte (pies y patas apoyados en el sendero) |
| Precisión | Fechas contrastadas con UNESCO (sitio 438) y Britannica; mapa rotulado como esquema; cortes rotulados como plausibles y no universales; sin cifras inventadas |
| Respaldo V1 | `07_OUTPUT/V1/`, `05_AUDIO/V1/`, `07_QC/V1/`, `04_CODIGO/V1_respaldo/` |
| Corrección geométrica (v1.14.2) | Terreno, muros y torres comparten la cresta `gy(x)` y una sola proyección oblicua. La muralla se divide en tramos que terminan en las caras de cada torre y se dibuja en el orden tramo → torre → tramo (el muro queda delante de la cara lateral de la torre y detrás de su cara frontal). Las torres están en cumbres (`ridgePeaks`), con zócalo hasta el terreno y puerta en la cara lateral al nivel del adarve donde entra el tramo. El adarve va en rampa o en peldaños según la pendiente local. Las sombras siguen el sol (izquierda en el final). Cresta rocosa con estribaciones |
| Fotogramas inspeccionados de la geometría | 6, 9,8, 60,5, 80, 84, 89,6, 90, 92, 105 y 110 s (planos generales y acercamientos), más la hoja de 56 fotogramas del MP4. Se corrigió durante la prueba: muros demasiado altos por el ruido de la cresta, juntas verticales que cruzaban la cara, franjas verticales en las laderas y tramos en cinta lisa hacia los valles (ahora escalonados) |

