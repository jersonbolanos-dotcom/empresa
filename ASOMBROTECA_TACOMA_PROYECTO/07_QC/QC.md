# QC · ASOMBROTECA_TACOMA_NARROWS_FINAL.mp4 (plantilla v1.17)

## Verificación técnica (ffprobe / ffmpeg sobre el MP4 final)
| Prueba | Resultado |
|---|---|
| Contenedor / códecs | MP4 · H.264 High@4.1 yuv420p · AAC LC 48 kHz estéreo 192 kb/s · sin marcas de agua |
| Resolución / fps / fotogramas | 1080×1920 · 30 fps · 3153 fotogramas |
| Duración | 105,124 s (voz 104,124 s + 1 s de cola) |
| Tamaño | 71,6 MB (< 100 MB) |
| Decodificación completa | 0 errores |
| blackdetect (≥ 0,3 s) | 0 tramos negros |
| freezedetect (n 0,001, ≥ 2,5 s) | 0 congelados |
| silencedetect (−45 dB, ≥ 1,5 s) | 0 silencios |
| Sonoridad (ebur128) | −14,0 LUFS · LRA 2,5 LU · pico verdadero −1,4 dBFS |
| md5 de la voz | bbca75c5ead25b6ffb62c5f0492d9eff = entrada (voz intacta, sin cambios de velocidad ni tono) |
| Determinismo | t = 5,3 · 17,9 · 41 s: mismo md5 en orden directo e inverso |
| Retrocompatibilidad | La plantilla solo añade bloques y efectos (git diff: 117 inserciones, 0 eliminaciones) |
| Subtítulos | 62 bloques; «7» y «1940» con su forma hablada en la alineación |

## Inspección visual
- Hoja de contacto del MP4 (`hoja_contacto.jpg`, 31 fotogramas en `fotogramas/`) y secuencias cada 0,2 s (`secuencias/`: gancho, ondas verticales, paso a torsión, bordes, mecanismo, crecimiento, límite, colapso ×2, túnel de viento).
- Comprobado: un solo puente con las mismas proporciones en todas las tomas; torres, cables, péndolas y tablero conectados; la torsión gira cada sección alrededor de su eje (las dos mitades en sentidos opuestos) y es distinta de la ondulación vertical; la amplitud crece por fases; las péndolas se rompen antes de que caiga el primer tramo; los tramos caen en orden, con gravedad, hasta el agua; las torres siguen en pie y los vanos laterales se hunden; textos dentro de márgenes.

Correcciones hechas durante el QC: la cámara inicial quedaba bajo el terreno de la orilla; colinas que tapaban el agua; caras del tablero perdidas o invertidas cerca de la cámara (se añadió recorte contra el plano cercano); el puente se veía como una franja fina en muchos planos (cámaras sobre el eje y diagonales cercanas); líneas de corriente que atravesaban la sección (ahora la rodean); error de dibujo en los tramos recortados de la calzada.

## Límites conocidos
- Motor 3D ligero (polígonos planos con niebla); no es un render físico con iluminación global.
- El flujo de aire es un modelo visual didáctico, no una simulación CFD.
- Las salpicaduras son discretas a la escala del plano general; en algunos planos lejanos el giro del tablero se aprecia mejor en movimiento que en un fotograma suelto.
- La secuencia de caída de cada tramo es una reconstrucción plausible basada en las descripciones históricas.
