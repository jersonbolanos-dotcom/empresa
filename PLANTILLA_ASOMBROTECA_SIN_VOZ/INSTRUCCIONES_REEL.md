# Instrucciones del módulo SIN VOZ (`motor/reel.js`, `window.REEL`)

Se carga después de `motor/plantilla.js` y de `js/tiempos.js`. No modifica `PLANTILLA`, `H` ni `SOUND`. Todos los bloques `P.*`, efectos `FX.*` y música `MUS.*` de `INSTRUCCIONES_PLANTILLA.md` se pueden usar dentro de las escenas.

## Esqueleto de `episodio.js`

```js
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;
 const ESTILO = 'asombroteca', MARCA = 'ASOMBROTECA';
 const B = [{ t0: 0, t1: D, in: { type: 'cut' }, draw(ctx, t) {
   R.fondo(ctx, t);                       // fondo que ya se mueve en t = 0
   /* … bloques del formato, con tiempos R.t('clave') … */
   R.titulares(ctx, t, { y: 340 });       // textos de tiempos.txt
 }, sfx(k) { /* efectos propios del formato (los de tiempos.txt se añaden solos) */ } }];
 const EP = R.make({ estilo: ESTILO, marca: MARCA, beats: B, loop: 0.5, marcaY: 1385 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
```

Puede haber varios beats con transiciones (`in: { type: 'zoom' | 'iris' | 'slide' | 'rise' | 'fade', d, x, y }`), como en el ejemplo del pulpo.

## Reloj y montaje

| Elemento | Uso |
|---|---|
| `R.TL` | `{ dur, musica, lineas: [{ t0, t1, d, texto, sfx: [...], clave }] }` leído de `tiempos.txt` |
| `R.t('clave')`, `R.t1('clave')`, `R.L('clave')` | Inicio, fin o línea completa (error claro si la clave no existe) |
| `R.make({ beats, estilo, marca, marcaY (1385), marcaAntes (2.0), loop (0.5), music, ambience, sfxTiempos })` | Monta el reel con `PLANTILLA.make`, sin voz ni subtítulos, y con zona segura. Añade los efectos de `tiempos.txt`, la música (`R.musica` con `TL.musica`, si no se da `music`), la marca discreta los últimos `marcaAntes` s y el enlace del bucle: los últimos `loop` s funden con el fotograma 0 |
| `R.musica(k, D, 'suave' \| 'piano' \| 'pulso' \| 'no', { bpm, gain, chords })` | `MUS.piano` / `MUS.pulso` con el tempo ajustado a un número entero de compases (bucle en fase) |
| `R.SFX[nombre](k, t)` | Los efectos con nombre de la columna «efecto». Para añadir uno nuevo: añadirlo aquí y en `EFECTOS` de `tools/tiempos.py` |
| `R.fondo(ctx, t, { c0, c1, c2, glow, gy, seed, cols })` | Fondo índigo «asombroteca» con bokeh y motas que se mueven (con otro estilo, usa `P.fondo`) |

## Texto en pantalla

| Elemento | Uso |
|---|---|
| `R.texto(ctx, s, t, t0, t1, { x, y, px (82), anim: 'pop' \| 'golpe' \| 'sube' \| 'maquina', font ('Fredoka'), fw, col, hi, maxW (840), maxLines (3), fadeOut })` | Texto grande con contorno. `*palabra*` sale en amarillo; ` / ` es un salto de línea. Se encoge y se recoloca para quedar en 220 ≤ y ≤ 1450 y 60 ≤ x ≤ 940. Si `t0 ≤ 0`, ya está visible en el fotograma 0. Registra su caja para el QC de zona segura |
| `R.titulares(ctx, t, { y, px, anim, pos: { clave: { x, y, px, anim, maxW } }, skip: [claves] })` | Pinta cada línea de `tiempos.txt` que tiene texto, durante su intervalo |
| `R.palabras(s)` | Cuenta las palabras como el QC |

## Formatos

| Bloque | Uso |
|---|---|
| `R.contador(ctx, t, { valor, x, y, px (150), etiqueta, prefijo, sufijo, bump (0..1), col, maxW })` | Cifra grande amarilla (miles con punto) que late en cada salto, con una etiqueta debajo |
| `R.saltos(t, [t…])` → `{ i, u }` · `R.contadorSfx(k, [t…])` | Índice del último salto y avance desde él · un clic en cada salto |
| `R.quiz(ctx, t, { opciones, correcta, t0, paso (0.3), tRevela, x, y0 (700), gap (180), w (800), h (140), px })` · `R.quizSfx(k, o)` | Tarjetas A/B/C que entran con pop. Al revelar, la correcta se pone verde con ✓ y las otras se apagan con ✗ |
| `R.cuentaAtras(ctx, t, { t0, n (5), x, y, r })` · `R.cuentaAtrasSfx(k, o)` | Aro que se vacía con el número; los 2 últimos van en rojo. Tictac cada segundo |
| `R.tamanos(ctx, t, { items: [{ v, valor, t0, d, col, col2, icon(ctx, x, yEnd, w, u), labelDy }], x0, x1, base, esc, dir: 'abajo' \| 'arriba', ancho, px, mark })` → `[{ x, yEnd, w, u }]` · `R.tamanosSfx(k, o)` | Barras a escala real que crecen una a una con su valor (si no caben, el valor se coloca al lado). Pop al empezar y tock al llegar |
| `R.lineaTiempo(ctx, t, { items: [{ anio, titulo, img, t0, col }], x, cx, w, gap, yFoco, tFin, dFin, incognita })` → `{ cam, Y }` · `R.lineaTiempoSfx(k, o)` | Fichas `P.dossier` con chincheta. El año entra con `P.stamp` (pon `sello` en tiempos.txt) y la cámara baja de ficha en ficha. Las fichas «?» esperan su turno |
| `R.lamina(fn(ctx, s), s, bg)` | Lienzo cuadrado para usarlo como «foto» de una ficha (ilustración propia, sin fotos con licencia) |
| `R.capas(ctx, t, { x, y, W, Lz, capas: [{ nombre, kind, grosor, col }], cortes: [t…], gap, d, tJunta, dJunta, activa, activaU, yaw, tilt, pantalla })` → `{ top, M, hY }` · `R.capasSfx(k, o)` | Pila en vista 3/4 sobre una base apoyada en la mesa. En el corte i suben las placas 0..i, guiadas por 4 varillas. `kind`: `vidrio`, `tactil`, `polarizador`, `oled`, `tft`, `base` o `color`. Al llegar `tJunta` todo vuelve a juntarse (bucle) |

## Herramientas

| Herramienta | Uso |
|---|---|
| `tools/nuevo_reel.py NOMBRE --formato F [--estilo E] [--marca M] [--titulo T] [--destino D]` | Crea `NOMBRE_REEL/` copiando el ejemplo del formato. Las rutas a la plantilla se calculan solas |
| `tools/producir_reel.py REEL tiempos \| build \| prueba t… \| render \| qc \| todo \| limpiar` | Producción completa. Opciones: `--workers 6` · `--musica-db -2` (nivel de la música: −20 LUFS + este valor antes de normalizar) · `--salida` · `--trabajo` |
| `tools/tiempos.py tiempos.txt js/tiempos.js tiempos.json` | Valida y convierte el guion de tiempos |
| `tools/frames.js`, `render.js`, `audio.js`, `determinismo.js`, `zona_segura.js`, `sheet.py` | Iguales que en la plantilla con voz; `audio.js` renderiza los efectos a volumen completo (`voiceover: false`) |

## Mezcla

La música se lleva a −22 LUFS (`--musica-db -2`) y los efectos pasan por un compresor suave (los clics tienen picos muy altos). La suma va a `loudnorm` en dos pasadas (−14 LUFS, pico verdadero −1,5 dBTP) y, si hace falta, se corrige con ganancia y limitador. Lleva fundidos de 10 ms al empezar y de 120 ms al acabar para que el bucle no haga clic.
