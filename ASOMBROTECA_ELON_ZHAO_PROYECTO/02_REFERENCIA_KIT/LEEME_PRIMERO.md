# LEEME PRIMERO — V5: FOTOGRAFÍAS Y POSTS VERIFICADOS

IMPORTANTE: El guion NO se ha modificado. Lee `01_SUPERPROMPT_MAESTRO_CLAUDE_CODE_V5.md` (el V4 sigue disponible para comparación) y `06_TWEETS_ORIGINALES_URLS_Y_USO.md`.

La V5 incluye 5 imágenes PNG de EXTRACTOS EDITORIALES de publicaciones, con enlaces a los posts originales, y enlaces+licencias exactas de fotografías reales de Musk y CZ. **Los JPG fotográficos NO están físicamente incluidos** porque este entorno no pudo descargarlos: Claude debe ejecutar `python tools/descargar_fotos.py` en su máquina conectada. Un PNG de extracto no es una captura de X. Comprueba su rótulo.

Usa rostros reales (una vez descargados), recortes de papel, halftone, movimiento por frases. No fabriques tweets completos ni retratos. Antes de exportar un MP4, revisar licencias/atribuciones y asegurar que cada mensaje es una fuente auténtica o rotulado como resumen.

# ASOMBROTECA — ELON MUSK / BINANCE / ZHAO — KIT V4

## Para Claude Code (VS Code)

1. Extraer el ZIP dentro de la carpeta del proyecto.
2. Abrir `01_SUPERPROMPT_MAESTRO_CLAUDE_CODE_V4.md` y entregarlo como instrucción principal.
3. El texto **aprobado e inmutable** está en `02_GUION_APROBADO_NO_MODIFICAR.txt`.
4. La ficha visual de la plantilla está en `03_PLANTILLA_AI_STYLE_ATLAS_FICHA_Y_USO.md` y bibliotecas compartidas en `lib/harness.js`, `lib/sound.js`.
5. Una base gráfica del estilo que conserva materiales, textura, recortes, fotografía halftone, cámara y marcador está en `styles/editorial-collage-core-adaptado.js` (adaptación técnica, no código original completo).
6. **Importante**: el código de referencia completo `styles/editorial-collage.js` que pegaste en ChatGPT NO se ha podido incorporar byte por byte en este ZIP. Pega también en Claude Code el bloque `REFERENCE STYLE SOURCE (styles/editorial-collage.js)` íntegro desde tu texto original o descárgalo de AI Style Atlas, para que mantenga el estilo real y las funciones de texturas/motion. No confundir con `product-launch.js`.
7. Poner la narración en `01_ENTRADA/audio/`, por ejemplo `voz.mp3`, sin modificarla.
8. Claude debe producir primero el storyboard HTML para aprobación y después el MP4 final y proyecto fuente.

Si Claude no tiene el audio todavía, no debe sintetizar la voz. Las referencias no incluyen fotografías ni capturas porque deben escogerse y verificarse con derechos adecuados durante producción.

### Integridad
Las dos bibliotecas compartidas pasan `node --check`, pero esto NO constituye una prueba de funcionamiento en navegador ni de la referencia Editorial completa. No hay archivos de fotografías descargados ni video terminado en este ZIP.
