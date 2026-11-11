# Instrucciones · motor de simulación (`motor/sim.js`) y montaje (`motor/reel.js`) · SIN_VOZ 2.4

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
| `SIM.incendio(cfg)` (v2.2) | `cols, rows, densidad(c, r)`, `corte(c, r, rng)` (árbol cortado → tocón), `focos [[c, r]…]`, `dMin, dMax` (retraso de contagio entre vecinos), `arde` (s), `seed` | `arbol` (0 vacío, 1 árbol, 2 tocón), `tIgn[i]`, `orden` (de ignición), `tFin`, `escala(k)` (multiplica los tiempos; Dijkstra es lineal) |
| `SIM.montecarlo(cfg)` (v2.2) | `n, seed` | `x, y` en [-1, 1], `dentro`, `acum`, `pi(k)` = 4 · dentro / total con los k primeros |
| `SIM.pendulos(cfg)` (v2.2) | `n (15), gamma, K, g, theta0, extra` | `T[k] = gamma/(K+k)`, `L[k] = g(T/2π)²`, `theta(k, t)`, `oscilaciones(k, t)`, `cruces [{ t, n, sentido }]` (pasos por la vertical) |
| `SIM.hormiga(cfg)` (v2.3) | `pasos, W` (lado de la rejilla) | `px, py, dir` por paso, `celda[k]`, `celdas`, `estado(j, K)`, `primero(j)`, `ultimo(j, K)`, `caja(K)` (casillas tocadas), `autopista` (paso en que empieza el ciclo de 104) |
| `SIM.dla(cfg)` (v2.3) | `n, G, seed, r0` (la primera sale de ahí y camina sin saltos, para verla), `cola` | `x, y, r` de cada partícula pegada, `rMax[i]`, `camino0` (todo el camino de la primera), `cola[i]` (sus últimos pasos) |
| `SIM.pendulo2(cfg)` (v2.3) | `th1, th2, w1, w2, L1, L2, m1, m2, g, delta, dur, fps, sub` | Dos péndulos dobles A y B (B con `delta` rad más en el 2.º brazo): `A.t1, A.t2, A.w2`, ídem B, `sep(f)`, `tSep(umbral)`, `energia` |
| `SIM.boids(cfg)` (v2.4) | `n, dur, seed, caja [x0,x1,y0,y1,z0,z1], rv, rs, vMin, vMax, wS, wA, wC, wB, vecinos, margen, anillo, halcon {t0,t1,v,rHuida,wH}, percha {t,x,y,z,w}` | `pos` (fotograma·n·3), `hal` (halcón), `giros[f]` (fracción que gira bruscamente) |
| `SIM.grayscott(cfg)` (v2.4) | `W, H, F, k, Du, Dv, NF, pasos(f), semillas, seed, umbral, areaMin` | `v` (Uint8 por fotograma) y `manchas[f]` (grupos conectados) |
| `SIM.mandel` (v2.4) | `nucleo(cr, ci, p)` (Newton), `tamano(cr, ci, p)` (tamaño y giro de la minicopia), `periodo(cr, ci, pMax)` | Para encontrar minicopias y encuadrarlas como el conjunto entero |
| `SIM.grid(cell, W, H)` · `SIM.resample(pts, N)` | Rejilla espacial para choques · remuestreo por longitud de arco con Catmull-Rom | |

Ajustes conocidos (comprobados en Chromium):
- **Rebote**: `r0 40`, `r 13`, `R 420`, `v0 900`, `tDiv 3,2`, `nMax 600`, `ang0 −0,25` y `seed 7` llenan el círculo a los 33,5 s de 35.
- **Galton**: `e 0,5`, `fric 0,7`, `drag 1,5` y `pegR 8` con `dx 46` dan σ ≈ 2,3 casillas y curtosis ≈ 3, como una normal.
- **Incendio**: bosque al 86 %, cortafuegos de 8 columnas que conservan 66 % (el fuego cruza) y 42 % (se detiene): pasa en 177 de 400 semillas; la 244 llega a la última columna. Para quitar el tiempo muerto final, remapea `tIgn` de forma monótona (ver el ejemplo).
- **Montecarlo**: `seed 403` con 40.000 puntos termina en 3,1416 exacto.
- **Hormiga**: la autopista empieza en el paso 9.976; la cámara del ejemplo encuadra `caja(K)` mirando 1 s adelante.
- **Cristal (DLA)**: `seed 5`, `n 6000`, `r0 30`: la primera camina 2.679 pasos; radio final ≈ 143.
- **Caos**: con los dos brazos a `th0 1,76` y `delta 1e-6`, la separación clara (> 30 %) llega a los 15,4 s (en Chromium; es caótico: ajusta siempre en el navegador).
- **Bandada**: `rv 4`, `rs 2`, `wS 30`, `wA 3`, `wC 5`, `vecinos 8`, `margen 0,3` con 2.400 pájaros: nube con RMS de 12-19 unidades (~19 s de cálculo con 3.000; usa ≤ 2.400 para no pasar de 60 s de carga).
- **Turing**: `F 0,030`, `k 0,062`, rejilla 140 × 146, 8 semillas, 7,5 pasos/fotograma: piel llena hacia los 20 s.
- **Mandelbrot**: minicopia de periodo 507 cerca de −0,7436439 + 0,1318262 i (×37 millones); más profundo, el cálculo por píxel se dispara.
- **Péndulos**: `gamma 34`, `K 36` (proporción de longitudes 1,9 : 1, como los aparatos clásicos); vista 3D con una cámara fija (`pr(x, y, z)` en el ejemplo).

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
| `R.chico(ctx, s, x, y, { px (32), font, fw, col, align, alpha, kind })` | Texto pequeño sin animación: `kind` `'etiqueta'` (≤ 2 a la vez, 1-3 palabras), `'eje'` (números/letras de ejes), `'formula'` o `'unidad'` (v2.2: una palabra bajo el contador, ≤ 1) |
| `R.texto(ctx, s, t, t0, t1, o)` | Texto con contorno dentro de la zona segura (`*resalte*`, ` / ` salto de línea). Lo usan los anteriores |
| `R.asmr(k, eventos, { voz, gain, maxBin (2), bin (1/50 s), dens (40), base })` | Cada evento `{ t, p | f, v, pan }` suena con la voz elegida. Por cada ventana de `bin` s quedan los `maxBin` más fuertes y el volumen baja con la densidad, para que mil choques suenen a lluvia suave sin saturar. Voces: `madera`, `cristal`, `gota`, `tic`, `campana` |
| `R.nota(p, base)` | Índice → frecuencia de la escala pentatónica (siempre suena bien) |
| `R.zumbido(k, t0, t1, f(t), g(t), { gain, trozo })` | Tono continuo que sigue a la simulación (p. ej., la velocidad del lápiz) |
| `R.cierre(k, { t, fin, notas, base, gain })` (v2.3.1) | Acorde suave de cierre (pentatónica, triángulo con filtro y reverberación) que entra con la frase final (`TL.tFrase`) se sostiene hasta 1,2 s antes del final y se desvanece hasta el último fotograma. Añade `TL.tFrase` a `eventos` |
| `R.musica(k, D, 'no' \| 'muy_baja')` | Colchón de piano muy bajo (en la mezcla, −20 LUFS + `--musica-db` (−10)) |

## Cámara lenta y zoom (ejemplo de Galton)

La simulación se calcula en su propio tiempo `s`. El vídeo la recorre con un reloj por tramos, `tau(t)`: velocidad normal, más lenta durante el tramo que se quiere seguir y normal otra vez. Los eventos de sonido se pasan al tiempo del vídeo con la inversa, `vid(s)`. Guarda 90 estados por segundo para que la cámara lenta no repita fotogramas. El zoom se encuadra para que todo quede dentro de la zona segura (altura fija y seguimiento solo horizontal) y no guarda estado entre fotogramas.

## QC v2 (`producir_reel.py qc`)

| Control | Cómo se mide |
|---|---|
| Una sola escena | `ffmpeg scdet` (umbral 14): 0 cortes |
| Movimiento continuo | Diferencia media entre fotogramas cada 0,5 s > 0,15/255, sin congelados > 1 s ni negros |
| Fondo oscuro | Luminancia media < 45/255 (con `FONDO atardecer` en `tiempos.txt`, v2.4: cielo claro con figuras oscuras, de 60 a 180) |
| Sonido de la simulación | Arranques de la pista de efectos (subidas de envolvente de 5 ms) que coinciden ±25 ms con un evento (`window.eventos()`): ≥ 95 % |
| Texto mínimo | `tools/textos.js` cada 0,1 s: `pregunta`, `contador`, `frase` y `marca` (uno de cada), `etiqueta` (≤ 2), `eje`, `formula` y `unidad` (≤ 1), dentro de la zona segura; pregunta y frase nunca juntas (también durante el empalme) |
| Marca de agua | Presente en el 100 % de las muestras |
| Bucle | Último fotograma ≈ primero (diferencia < 8/255) |
| Nada flota | `07_QC/revision_visual.txt` con «nada flota: OK» tras mirar la hoja de contacto |
