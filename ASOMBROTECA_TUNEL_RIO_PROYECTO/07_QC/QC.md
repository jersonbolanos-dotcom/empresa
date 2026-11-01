# QC · ASOMBROTECA_TUNEL_BAJO_RIO_FINAL.mp4 (V2 · plantilla v1.16.1)

Versión anterior respaldada en `07_OUTPUT/V1/`, `07_QC/V1/`, `05_AUDIO/V1/` y `04_CODIGO/V1/episodio.js`.

## Verificación técnica (ffprobe / ffmpeg sobre el MP4 final)
| Prueba | Resultado |
|---|---|
| Contenedor / códecs | MP4 · H.264 High@4.1 yuv420p · AAC LC 48 kHz estéreo 192 kb/s · sin marcas de agua |
| Resolución / fps / fotogramas | 1080×1920 · 30 fps · 3153 fotogramas |
| Duración | 105,124 s (voz 104,124 s + 1 s de cola) |
| Tamaño | 79,7 MB (< 100 MB) |
| Decodificación completa | 0 errores |
| blackdetect (≥ 0,3 s) | 0 tramos negros |
| freezedetect (n 0,001, ≥ 2,5 s) | 0 congelados |
| silencedetect (−45 dB, ≥ 1,5 s) | 0 silencios |
| Sonoridad (ebur128) | −14,1 LUFS · LRA 3,2 LU · pico verdadero −1,4 dBFS |
| md5 de la voz | 3762a113e49d59f56d127fbda6914c54 = entrada (voz intacta) |
| Determinismo | t = 5,3 · 17,9 · 41 s: mismo md5 en orden directo e inverso |
| Retrocompatibilidad | Solo cambian bloques v1.16 (túneles), que ningún otro episodio usa (comprobado con grep) |

## Inspección visual
- Hoja de contacto del MP4: `hoja_contacto.jpg` (28 fotogramas en `fotogramas/`).
- Secuencias cada 0,2 s (`secuencias/`): descenso, presión, cabeza de corte, extracción, ciclo de cilindros, dovelas, anillo, relleno anular, sello, reviste, cierre.

Comprobado en las secuencias:
- La tuneladora no se desarma: todas sus piezas mantienen posición y escala al mover la cámara; la cabeza gira y el cuerpo no.
- Cilindros: el cuerpo sigue anclado al anillo de empuje; el vástago y la zapata se apoyan en el último anillo y se extienden durante el avance; se retraen para el montaje y vuelven a apoyarse en el anillo nuevo.
- Material: frente → aberturas de la cabeza → cámara llena → boca del tornillo → hélice → compuerta → tolva → cinta → vagonetas, sin apariciones ni desapariciones.
- Dovelas: el erector las toma del alimentador, las sujeta con la pinza y las lleva a su posición; el anillo se cierra con la llave y las juntas longitudinales quedan escalonadas respecto al anillo anterior (rótulo corregido: «JUNTAS ESCALONADAS ENTRE ANILLOS»).
- Relleno anular: la lechada ocupa el hueco entre el anillo y el terreno (fuera del revestimiento), no una capa interior; los sellos están en las juntas.
- El túnel está siempre bajo el lecho y rodeado de terreno en las dos secciones.
- Textos dentro de márgenes y fuera de la franja de subtítulos.

Errores detectados y corregidos en esta revisión: rótulos «ENTRADA DEL TORNILLO»/«TORNILLO SINFÍN» y «LECHADA»/«TERRENO CON AGUA» que se cruzaban en la misma fila; rótulo de sensores que pisaba la leyenda; partículas que se dibujaban sobre las placas de la cabeza (eliminadas).

## Límites conocidos
- Proyección 2,5D (secciones técnicas y perspectivas simples), no 3D con iluminación física.
- En la vista longitudinal las dovelas laterales del anillo en montaje quedan fuera del plano de corte; se ven completas en la vista frontal del anillo.
- El paso de la vista lateral a la frontal del anillo es un fundido con acercamiento, no una órbita 3D continua.
