# AI STYLE ATLAS — EDITORIAL ESSAY COLLAGE

**Plantilla elegida por el usuario:** Editorial Essay Collage, categoría Popular Explainer Looks de Futurepedia AI Style Atlas.

## Ficha visual original aportada

**LOOK:** The editorial "animated essay" collage: warm grainy paper, archival halftone prints with torn white borders and soft shadows, newspaper clippings in serif type with a translucent yellow highlighter sweep, masking tape, flat colour blocks and big cut-out condensed headlines.

**MOTION:** Cutouts drop and slide in on 12 fps hand-animated steps while the camera pushes smoothly through parallax layers; the highlighter sweeps left to right and a red marker rings the key detail.

**HOW IT EXPLAINS:** Scenes are joined by fast blurred camera whips that hide the cut, plus a new paper sheet slid up on steps; arrows are thin ink route lines and red marker, numbers are re-cut condensed numerals on paper strips, and the emphasis is the yellow highlighter sweep (plus a red marker ring and cross on the wrong guess).

## Funciones esenciales del código fuente enviado en la conversación

`H.rng` `H.makeNoise` `edgePoly` `sprite` `drawSpr` `shadowFill` `fibre` `texture` `grainTiles` `treat` `makePrint` `makeStrip` `makeClipping` `hilite` `tape` `partial` `marker` `loopPts` `inkArrow` `place` `arrive` `putSpr` `bgPaper` `block` `finish` `camAt` `drawExplainer` `explainerSound`.

Las bibliotecas compartidas `H` y `SOUND` se incluyen como archivos independientes en `lib/`, reconstruidas desde una copia anterior de la misma plantilla base y verificadas con `node --check`. Su estilo `editorial-collage.js` original, muy extenso, NO se incorpora aquí byte por byte: se preservan esta ficha técnica y los requisitos precisos. Si Claude requiere reutilizar exactamente todas las funciones del original, debe recibir también el `REFERENCE STYLE SOURCE` pegado por el usuario o exportado directamente desde Futurepedia. **No reemplazar el original por un estilo genérico.**

### Colores originales
KRAFT #C9A878; PAPER #F0E9D9; INK #1A1816; RED #B8483A; CARD #F5F1E7; NEWS #E9E1CB. Tipos: Anton / Libre Baskerville / Oswald.

### Modo narrado (corrección del prompt original)
El prompt original asume sin voz; en Asombroteca manda la pista del usuario. Crear storyboard visual **antes** de animar, con 8–12 paneles reales; determinar duración por el archivo de audio; producir video vertical 1080x1920; mezclar música y FX de forma independiente si se usa `voiceover:true`, ya que `SOUND.kit` silencia música/ambiente en ese modo.
