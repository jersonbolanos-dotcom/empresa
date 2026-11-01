# QC · ASOMBROTECA_MURALLA_CHINA.mp4

| Control | Resultado |
|---|---|
| Formato | 1080×1920 (9:16), 30 fps constantes, H.264 High@4.1 yuv420p, AAC-LC 48 kHz estéreo 256 kb/s, *faststart* (`ffprobe.txt`) |
| Duración | 114,711 s (voz 113,711 s + 1 s de cierre); 3.442 fotogramas |
| Tamaño | 83,4 MB (< 100 MB) |
| Reproducción / decodificación completa | ffmpeg decodifica todo el archivo sin errores |
| Negros / congelados | blackdetect y freezedetect: 0 |
| Silencios accidentales | silencedetect (−50 dB, ≥ 0,5 s): 0 |
| Sonoridad | −14,4 LUFS integrados; LRA 2,6 LU; pico verdadero −2,4 dBTP; entrada de 40 ms y salida de 0,8 s después de la voz |
| Equilibrio | Música ≈ 20 dB por debajo de la voz con *ducking*; efectos solo en acciones visibles (golpes de pisón, vertido, ruedas, cascos, ladrillos, piedra, fuego, viento y transiciones) |
| Voz | md5 idéntico al archivo subido (d552b4e8e7f872d88a1c366e81a13763): sin alterar, acelerar ni recortar |
| Subtítulos | barra (blanco + barra amarilla), 64 bloques (`06_SUBTITULOS/subtitulos.srt`); «Muralla China», «Asombroteca» y «2.000» corregidos |
| Determinismo | `determinismo.txt`: dos ejecuciones idénticas |
| Retrocompatibilidad v1.14 | RETRO_PENDIENTE |
| Revisión visual | (1) Una ronda de hoja de contacto antes del render (31 fotogramas). Se corrigió: paneles de materiales con fondo vacío; franjas de luz demasiado marcadas en las laderas; etiquetas de Pekín y Shanhaiguan superpuestas. (2) Tras el primer render se revisaron 52 fotogramas del MP4. La escena de piedra local tenía piedras que parecían nubes y figuras flotando sobre la ladera: se rehízo con una línea de suelo explícita (cornisa, cantera, pila con sombra, sendero y muro). Se volvió a renderizar. (3) Revisión de 52 fotogramas del MP4 definitivo (`fotogramas_revision/`, `hoja_contacto.jpg`) |
| Precisión | Sin «visible desde la Luna», sin «un solo emperador», sin cifras inventadas; mapa rotulado como esquema aproximado y tramos por periodos |
