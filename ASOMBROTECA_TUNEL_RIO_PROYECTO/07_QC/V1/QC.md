# QC · ASOMBROTECA_TUNEL_BAJO_EL_RIO_FINAL.mp4 (plantilla v1.16)

## Verificación técnica (ffprobe / ffmpeg sobre el MP4 final)
| Prueba | Resultado |
|---|---|
| Contenedor / códecs | MP4 · H.264 High@4.1 yuv420p · AAC LC 48 kHz estéreo 192 kb/s · sin marcas de agua |
| Resolución / fps / fotogramas | 1080×1920 · 30 fps · 3153 fotogramas |
| Duración | 105,124 s (voz 104,124 s + 1 s de cola) |
| Tamaño | 75,9 MB (< 100 MB) |
| Decodificación completa | 0 errores |
| blackdetect (≥ 0,3 s) | 0 tramos negros |
| freezedetect (n 0,001, ≥ 2,5 s) | 0 congelados |
| silencedetect (−45 dB, ≥ 1,5 s) | 0 silencios |
| Sonoridad (ebur128) | −14,1 LUFS · LRA 3,2 LU · pico verdadero −1,5 dBFS |
| md5 de la voz | 3762a113e49d59f56d127fbda6914c54 = entrada (voz intacta, reloj maestro) |
| Determinismo | t = 5,3 · 17,9 · 41 s: mismo md5 en orden directo e inverso |
| Retrocompatibilidad | La plantilla solo añade bloques y efectos (git diff: 232 inserciones, 0 eliminaciones); los episodios anteriores no cambian |
| Subtítulos | 62 bloques en `06_SUBTITULOS/subtitulos.srt`; `capStyle: 'barra'`, `capY: 1540` |

## Inspección visual
- Hoja de contacto del MP4 (`hoja_contacto.jpg`, 27 fotogramas en `fotogramas/`) y secuencias cada 0,2 s (`secuencias/`: descenso, cabeza de corte, extracción, dovelas, anillo, sello, reviste, equilibrio).
- Comprobado: el túnel está siempre bajo el lecho y a la misma profundidad en las dos secciones; la tuneladora está alineada con el eje y el revestimiento sigue la misma trayectoria; solo gira la cabeza de corte; los cilindros se apoyan en el último anillo y se extienden durante la excavación; la marina recorre cámara → tornillo → cinta → vagonetas; el erector sostiene cada dovela desde el alimentador hasta su posición y la llave cierra el anillo sin solapes; el sello se comprime y el agua se detiene en él; textos dentro de márgenes y fuera de la franja de subtítulos.

Correcciones hechas durante el QC: túnel demasiado pequeño en las secciones transversales (radio y encuadres ampliados); rótulos que quedaban fuera de cuadro en la extracción; pozo de salida que faltaba al terminar el recorrido; barcos que casi nunca entraban en cuadro; corte transparente que parecía un pozo; exceso de cielo en el plano «el río sigue fluyendo».

## Límites conocidos
- Proyección 2,5D (secciones técnicas y perspectivas simples), no 3D con iluminación física.
- En la extracción, las vagonetas aparecen muy al final del travelling.
- La transición de la cabeza de corte de frente a la vista en sección es un fundido, no una órbita 3D continua.
