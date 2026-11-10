# Instrucciones · motor de simulación (`motor/sim.js`) y montaje (`motor/reel.js`) · SIN_VOZ 2.1

Orden de carga en `index.src.html`: `lib/harness.js` (H), `lib/sound.js` (SOUND), `js/tiempos.js`, `motor/plantilla.js`, `motor/sim.js`, `motor/reel.js` y `js/episodio.js`.

## Esqueleto de `episodio.js`

```js
(function () {
 const R = window.REEL, { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;
 const S = SIM.rebote({ dur: D, cx: 540, cy: 815, R: 420, r: 13, r0: 40, v0: 900, tDiv: TL.param.tDiv, nMax: 600, seed: TL.semilla, inicio: true });
 function draw(ctx, t) { const f = Math.round(t * 30);        // lee el fotograma precalculado
   /* … dibujar los objetos con colores vivos … */
   R.contador(ctx, t, S.n(f)); R.pregunta(ctx, t); R.frase(ctx, t); }
 function sound(k) { R.asmr(k, S.eventos.filter((e) => e.tipo === 'borde').map((e) => ({ t: e.t, p: 4 + e.v / 130, v: 0.6 })), { voz: 'madera' }); }
 const EP = R.make({ draw, sound, eventos: () => S.eventos.map((e) => e.t) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
```

`R.make` pone el fondo oscuro, la marca de agua, la viñeta y el empalme (los últimos `loop` s, 0,6 por defecto, funden con el fotograma 0). No hay escenas ni transiciones: un solo `draw(ctx, t)`.

## `SIM` · simulaciones precalculadas

Todas corren una vez al cargar, con paso fijo (`fps × sub`, por defecto 30 × 8 = 240 Hz) y `H.rng(seed)`. Devuelven el estado por fotograma y `eventos` (`[{ t, tipo, … }]`).

| Función | Parámetros | Devuelve |
|---|---|---|
| `SIM.rebote(cfg)` | `dur, cx, cy, R` (círculo), `r` (radio mínimo), `r0` (radio inicial; cada división ÷ √2), `v0`, `tDiv` (edad mínima para dividirse), `age0`, `nMax`, `seed`, `x0, y0, ang0`, `inicio` (arranca tocando el borde, con un evento en t = 0), `tColapso` (s finales sin divisiones), `vChoque` | `n(f)`, `x(f,i)`, `y(f,i)`, `radio(f,i)`, `gen`, `born`, `tLleno`, `eventos` (`inicio`, `borde {v, ang, r}`, `choque {v}`, `nace {n}`, `lleno`) |
| `SIM.galton(cfg)` | `dur, x0, yPeg0, filas, dx, dy, pegR, r, nBolas, tIni, tFin, tUltima` (la última, sola), `pre` (precarga), `yFondo, g, e` (restitución), `fric, drag, vMax, seed` | `activas(f)` → `[x, y, id…]`, `cuenta(f)`, `pilas[k]`, `slot(k, s)`, `casilla, sl, llegada, sal, ultima, binL, yBin, yF, per`, `eventos` (`clavo {fila, col, v}`, `casilla {k, capa, v}`) |
| `SIM.fourier(cfg)` | `trazo` (`[[x, y]…]` cerrado, en orden de dibujo), `N` (muestras, 2048), `K` (términos ±K) | `coef` (de mayor a menor radio), `c0`, `punto(n, tau)`, `cadena(n, tau)`, `muestras` |
| v2.1 | `SIM.rebote` → `genF(f, i)` (generación en el fotograma f) y `madre[i]` · `SIM.galton` → `fps` libre (90 para cámara lenta, con `sub: 3`), `xUltima`, y en cada choque `id` y `lado` · `SIM.fourier({ muestras })`: dos DFT de señales reales (`[x, 0]` y `[y, 0]`) para las cadenas x/y | |
| `SIM.grid(cell, W, H)` · `SIM.resample(pts, N)` | Rejilla espacial para choques · remuestreo por longitud de arco con Catmull-Rom | |

Ajustes conocidos (comprobados en Chromium):
- **Rebote**: `r0 40`, `r 13`, `R 420`, `v0 900`, `tDiv 3,2`, `nMax 600`, `ang0 −0,25` y `seed 7` llenan el círculo a los 33,5 s de 35.
- **Galton**: `e 0,5`, `fric 0,7`, `drag 1,5` y `pegR 8` con `dx 46` dan σ ≈ 2,3 casillas y curtosis ≈ 3, como una normal.

**Importante**: ajusta los `PARAM` con `node tools/sim_info.js 04_CODIGO/index.html`. Calcula en el mismo navegador que el render; Node puede dar otro resultado en una simulación caótica.

## `R` · montaje, textos y sonido

| Elemento | Uso |
|---|---|
| `R.TL` | `{ dur, musica, semilla, pregunta, tPregunta, frase, tFrase, fuente, param }` de `tiempos.txt` |
| `R.make({ draw, sound, eventos, loop, marca: { nombre, x, y, align, px, alpha }, fondo: { c0, glow, gy } })` | Una sola escena con fondo oscuro, marca de agua todo el vídeo, empalme y viñeta |
| `R.pregunta(ctx, t, o)` | La pregunta (≤ 6 palabras), visible desde el fotograma 0 hasta `tPregunta`, con un leve «respirar» |
| `R.contador(ctx, t, valor, { x, y (1335), px (130), glow 'r,g,b', bump 0..1, sufijo })` | Cifra grande blanca con halo de color |
| `R.frase(ctx, t, { y, px, fin })` | La frase final (el dato), entra en `tFrase` y se va antes del empalme (`fin`, por defecto `dur − loop − 0,15`) |
| `R.marcaAgua(ctx, t, o)` | «ASOMBROTECA» de 32 px al 50 %, con contorno oscuro, en (925, 1424), alineado a la derecha |
| `R.chico(ctx, s, x, y, { px (32), font, fw, col, align, alpha, kind })` | Texto pequeño sin animación: `kind` `'etiqueta'` (≤ 2 a la vez, 1-3 palabras), `'eje'` (números/letras de ejes) o `'formula'` |
| `R.texto(ctx, s, t, t0, t1, o)` | Texto con contorno dentro de la zona segura (`*resalte*`, ` / ` salto de línea). Lo usan los anteriores |
| `R.asmr(k, eventos, { voz, gain, maxBin (2), bin (1/50 s), dens (40), base })` | Cada evento `{ t, p | f, v, pan }` suena con la voz elegida. Por cada ventana de `bin` s quedan los `maxBin` más fuertes y el volumen baja con la densidad, para que mil choques suenen a lluvia suave sin saturar. Voces: `madera`, `cristal`, `gota`, `tic`, `campana` |
| `R.nota(p, base)` | Índice → frecuencia de la escala pentatónica (siempre suena bien) |
| `R.zumbido(k, t0, t1, f(t), g(t), { gain, trozo })` | Tono continuo que sigue a la simulación (p. ej., la velocidad del lápiz) |
| `R.musica(k, D, 'no' \| 'muy_baja')` | Colchón de piano muy bajo (en la mezcla, −20 LUFS + `--musica-db` (−10)) |

## Cámara lenta y zoom (ejemplo de Galton)

La simulación se calcula en su propio tiempo `s`. El vídeo la recorre con un reloj por tramos, `tau(t)`: velocidad normal, más lenta durante el tramo que se quiere seguir y normal otra vez. Los eventos de sonido se pasan al tiempo del vídeo con la inversa, `vid(s)`. Guarda 90 estados por segundo para que la cámara lenta no repita fotogramas. El zoom se encuadra para que todo quede dentro de la zona segura (altura fija y seguimiento solo horizontal) y no guarda estado entre fotogramas.

## QC v2 (`producir_reel.py qc`)

| Control | Cómo se mide |
|---|---|
| Una sola escena | `ffmpeg scdet` (umbral 14): 0 cortes |
| Movimiento continuo | Diferencia media entre fotogramas cada 0,5 s > 0,15/255, sin congelados > 1 s ni negros |
| Fondo oscuro | Luminancia media < 45/255 |
| Sonido de la simulación | Arranques de la pista de efectos (subidas de envolvente de 5 ms) que coinciden ±25 ms con un evento (`window.eventos()`): ≥ 95 % |
| Texto mínimo | `tools/textos.js` cada 0,1 s: `pregunta`, `contador`, `frase` y `marca` (uno de cada), `etiqueta` (≤ 2), `eje` y `formula`, dentro de la zona segura; pregunta y frase nunca juntas (también durante el empalme) |
| Marca de agua | Presente en el 100 % de las muestras |
| Bucle | Último fotograma ≈ primero (diferencia < 8/255) |
| Nada flota | `07_QC/revision_visual.txt` con «nada flota: OK» tras mirar la hoja de contacto |
