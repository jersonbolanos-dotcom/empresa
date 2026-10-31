# ASOMBROTECA STUDIO — HELICÓPTERO SIN MOTOR / FLAT-VECTOR SCIENCE

## QUÉ HACER CON ESTE ZIP
1. Extraerlo en la carpeta de trabajo de Claude Code, idealmente con VS Code abierto.
2. Copiar tu narración original a `01_ENTRADA/audio/` (sin modificarla).
3. Dar a Claude Code la orden: "Lee `02_PROMPTS/SUPERPROMPT_MAESTRO_PARA_CLAUDE_CODE.md` y ejecuta su primera fase de storyboard usando los archivos del paquete. Espera mi OK antes del video final".
4. Revisar storyboard y aprobar o indicar correcciones. Luego Claude construirá el video con `ffmpeg` y Canvas.

## CONTENIDO
- `03_GUION/GUION_ORIGINAL_APROBADO_INTOCABLE.txt`: transcripción exacta del guion aprobado por el usuario.
- `02_PROMPTS/SUPERPROMPT_MAESTRO_PARA_CLAUDE_CODE.md`: dirección cinematográfica, aerodinámica, audio, sincronía, estilo, QC y entrega.
- `02_PROMPTS/PROMPT_AI_STYLE_ATLAS_FLAT_VECTOR_SCIENCE.md`: prompt de referencia de Atlas adaptado a las necesidades de Asombroteca.
- `04_AI_STYLE_ATLAS/lib/harness.js` y `lib/sound.js`: bibliotecas H y SOUND desde el paquete anterior, de la misma referencia facilitada por usuario.
- `04_AI_STYLE_ATLAS/styles/flat-vector-helicopter-reference.js`: base de dibujo funcional siguiendo las técnicas de la plantilla para que Claude estudie, reestructure y extienda.
- `06_REFERENCIAS/VERIFICACION_FAA.md`: referencia aeronáutica y advertencias científicas.
- `05_PRODUCCION/STORYBOARD_REFERENCIA.md`: tabla de beats para construir el storyboard, no el storyboard visual final.
- `01_ENTRADA/audio/`: carpeta para voz.

## HONESTIDAD SOBRE LA PLANTILLA
El usuario pegó en el chat el **archivo original largo** `styles/flat-space.js`, pero no adjuntó físicamente un archivo `.js` descargable. Este ZIP incluye un prompt de estilo completo en instrucciones, H y SOUND y una **referencia gráfica adaptada y ejecutable**; NO incluye una copia literal exacta de todas las líneas del archivo original `flat-space.js`. Para fidelidad máxima al 100 %, pegar el código original del chat en `04_AI_STYLE_ATLAS/styles/flat-space.js`, y Claude debe dar prioridad a ese original. La referencia adaptada no debe confundirse ni describirse como el original literal.

## AUDIO / TIEMPOS
No se incluye el archivo de voz porque no se ha proporcionado en este turno. Claude deberá detectar el audio que añadas y alinear TODO a su duración, no forzar los 15 segundos del ejemplo.

## FUENTES
FAA y AOPA en `06_REFERENCIAS/VERIFICACION_FAA.md`. No presentar datos de aerodinámica no verificados como reales.

## ENTREGAS
Este paquete es de PREPRODUCCIÓN para Claude. No contiene un video generado ni un storyboard final ilustrado; Claude deberá producirlos al ejecutar instrucciones.
