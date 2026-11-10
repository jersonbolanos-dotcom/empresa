# PLANTILLA ASOMBROTECA SIN VOZ · Léeme primero

Plantilla hermana de `PLANTILLA_ASOMBROTECA` para **reels cortos sin narración**: vídeos hipnóticos de 15 a 25 segundos en los que todo lo cuentan la animación, el texto en pantalla y los efectos de sonido (pops, whoosh, clics, sellos), con música suave opcional. Están pensados para verse varias veces y para que la gente comente.

Formato fijo:

- 1080 × 1920, 30 fps, H.264 + AAC 48 kHz, menos de 100 MB;
- de 12 a 30 s (objetivo: 15-25 s);
- −14 LUFS, pico ≤ −1 dBTP;
- el último fotograma enlaza con el primero (bucle).

El motor es el mismo que el de la plantilla con voz (`motor/plantilla.js` v1.28, `lib/`, fuentes): todos los bloques `P.*`, los efectos `FX.*` y la música `MUS.*` siguen disponibles. Lo nuevo está en `motor/reel.js` y en `tools/`.

## Hacer un reel en 3 pasos

Desde la carpeta que contiene `PLANTILLA_ASOMBROTECA_SIN_VOZ`:

```
python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/nuevo_reel.py MI_REEL --formato quiz --estilo asombroteca
#   edita MI_REEL_REEL/03_GUION/tiempos.txt   (textos, efectos y tiempos)
#   edita MI_REEL_REEL/04_CODIGO/js/episodio.js (escenas)
python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/producir_reel.py MI_REEL_REEL prueba 0 2 5 9 14   # hoja de contacto 07_QC/prueba.jpg
python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/producir_reel.py MI_REEL_REEL todo                # → 07_OUTPUT/MI_REEL_FINAL.mp4 + 07_QC/QC.md
```

- El reel recién creado ya funciona: es una copia del ejemplo de su formato, lista para cambiar el tema.
- `todo` = tiempos → build → render (≈ 1 min por cada 10 s de vídeo con 4 núcleos) → mezcla → QC.
- Después de mirar la hoja de contacto, escribe `07_QC/revision_visual.txt` con la línea `nada flota: OK` (o lo que haya que corregir) y vuelve a lanzar `producir_reel.py MI_REEL_REEL qc`.

## El reloj: `03_GUION/tiempos.txt`

No hay voz, así que este archivo marca el tiempo de todo.

```
DURACION 20
MUSICA suave          # suave (piano) · piano · pulso · no
# inicio | duración | texto en pantalla                    | efecto   | clave
0.0      | 2.0      | ¿Cuántas habrá al *final* del video?  | whoosh   | gancho
2.0      | 2.8      | Se divide en dos cada *20 minutos*    | pop      | divide
```

- Cada línea es una aparición. El texto sale grande, animado y con su efecto, en el fotograma exacto.
- Como mucho 8 palabras por pantalla. Las palabras entre `*asteriscos*` salen en amarillo y ` / ` fuerza un salto de línea.
- Toda línea con texto lleva un efecto. Efectos disponibles: `pop`, `popAgudo`, `popGrave`, `whoosh`, `swish`, `clic`, `tic`, `sello`, `golpe`, `ding`, `correcto`, `error`, `revelar`, `riser`, `chispa`, `teclas`, `moneda`, `boing`, `latido`, `pagina` y `campana`.
- La `clave` permite usar ese instante en el código: `R.t('divide')`.
- `tools/tiempos.py` lo valida: duración de 12 a 30 s, gancho antes de 1 s, palabras, efectos y claves repetidas. Además ajusta cada inicio al fotograma.

## Los 5 formatos (cada uno con su ejemplo en `ejemplos/`)

| `--formato` | Qué es | Bloques | Ejemplo |
|---|---|---|---|
| `contador` | **Contador imposible**: un número que sube en vivo, con un clic en cada salto. | `R.contador`, `R.saltos`, `R.contadorSfx` | `REEL_BACTERIAS_REEL` · una bacteria que se duplica cada 20 min |
| `quiz` | **Adivina antes de que acabe**: pregunta, tres opciones, cuenta atrás de 5 s con tictac, revelación y «Comenta tu respuesta». | `R.quiz`, `R.cuentaAtras` | `REEL_PULPO_REEL` · ¿cuántos corazones tiene un pulpo? |
| `tamanos` | **Comparación de tamaños**: barras que crecen una a una, con un pop en cada una. | `R.tamanos` (estilo `P.barsGrow`, hacia arriba o hacia abajo) | `REEL_OCEANO_REEL` · ¿el Everest cabe en el océano? |
| `linea` | **Línea del tiempo**: estilo dossier, con un sello que golpea cada fecha. | `R.lineaTiempo` (`P.dossier` + `P.stamp`), `R.lamina` | `REEL_INVENTOS_REEL` · ¿qué nació antes, el fax o el teléfono? |
| `capas` | **Qué hay por dentro**: capas que se separan, con una etiqueta corta y un whoosh en cada una. | `R.capas` | `REEL_PANTALLA_REEL` · las capas de la pantalla del celular |

Cada ejemplo trae su `FUENTES_Y_DECISIONES.md`, el MP4 en `07_OUTPUT/` y el QC en `07_QC/QC.md`.

## Reglas de un reel sin voz

1. **Gancho**: movimiento desde el fotograma 0 y una pregunta o dato imposible en pantalla antes de 1 s. La línea de `t = 0` ya está visible en el primer fotograma.
2. **Texto**: grande y corto (≤ 8 palabras), solo dentro de la zona segura de Instagram (220 ≤ y ≤ 1450, x ≤ 940). `R.texto` se recoloca solo.
3. **Sonido**: cada aparición, cambio o número lleva su efecto en el fotograma exacto. La música es original (`MUS.*`) y suave, y su tempo se ajusta para que quepan compases enteros, así sigue en fase al repetirse.
4. **Bucle**: los últimos 0,5 s funden con el fotograma 0 (`R.make({ loop: 0.5 })`). Diseña el final para que vuelva al principio (p. ej., la colonia vuelve a ser una bacteria y las capas se cierran).
5. **Nada flota**: los objetos se apoyan en superficies (placa sobre la mesa, pulpo en la arena, fichas con chincheta, capas guiadas por varillas).
6. **Determinismo**: `H.rng`, nunca `Math.random`. No se modifican `lib/` ni `motor/plantilla.js`: se amplía `motor/reel.js`.
7. **Marca**: solo un «ASOMBROTECA» discreto al final (`P.marca`, automático). La frase «Envíaselo a ese amigo…» es opcional.
8. **Datos verificados** con su fuente en `FUENTES_Y_DECISIONES.md`.

## QC (`producir_reel.py qc` → `07_QC/QC.md`)

El QC revisa:

- formato H.264/AAC 1080×1920 a 30 fps;
- duración de 12 a 30 s y tamaño menor de 100 MB;
- decodificación completa;
- negros y congelados;
- silencios;
- −14 LUFS y pico ≤ −1 dBTP;
- determinismo;
- zona segura;
- pantalla limpia;
- gancho antes de 1 s;
- movimiento desde el fotograma 0;
- ≤ 8 palabras por pantalla;
- un efecto en cada aparición;
- que cada efecto suene en su fotograma (mide la subida de nivel en la pista de efectos);
- el bucle (el último fotograma debe parecerse al primero);
- «nada flota» (revisión visual registrada).

Cuando todo pasa, escribe **TODO CORRECTO**. No hay comprobación de voz ni de md5.

## Qué hay dentro

| Archivo o carpeta | Para qué sirve |
|---|---|
| `PROMPT_NUEVO_REEL.md` | Prompt corto de copiar y pegar para pedir un reel nuevo. |
| `INSTRUCCIONES_REEL.md` | Firmas de `R.*` y cómo escribir `episodio.js`. |
| `INSTRUCCIONES_PLANTILLA.md`, `GUIA_ESTILOS.md` | Referencia de todos los bloques `P.*`, `FX.*` y `MUS.*` y de los estilos (heredada de la v1.28; lo que habla de voz y subtítulos no se aplica aquí). |
| `CAMBIOS_PLANTILLA.md` | Versiones de la plantilla SIN VOZ. |
| `motor/plantilla.js`, `lib/`, `fonts/` | Motor v1.28 sin cambios. |
| `motor/reel.js` | Módulo SIN VOZ (`window.REEL`). |
| `tools/` | `nuevo_reel.py`, `producir_reel.py`, `tiempos.py`, `build.py`, `render.js`, `audio.js`, `frames.js`, `sheet.py`, `determinismo.js` y `zona_segura.js`. |
| `ejemplos/` | Los 5 reels de ejemplo (código, MP4 y QC). |
| `catalogo/` | Capturas de los bloques del motor. |

Requisitos: Python 3 con numpy, Node con Playwright y Chromium, y ffmpeg.
