# PLANTILLA ASOMBROTECA SIN VOZ 2.4 · Léeme primero

Reels verticales **sin narración** del tipo «oddly satisfying» o simulación: **un solo proceso físico continuo que escala**. Ejemplos: bolas que se multiplican en un círculo, miles de bolitas que forman una campana o círculos que giran y dibujan un animal. Cada simulación esconde un dato de ciencia real, que se revela al final con una sola frase.

Formato fijo:

- 1080 × 1920, 30 fps, H.264 + AAC 48 kHz, < 100 MB;
- de 25 a 45 s;
- −14 LUFS, pico ≤ −1 dBTP;
- el último fotograma empalma con el primero para que el reel se repita solo.

> Respaldos: la versión 1.0 (5 formatos de infografía) está en `V1/`, y la 2.0 (simulación sin elementos de contexto) en `V2/`.

## Reglas (el QC las comprueba)

1. **Un solo proceso, sin cortes**: movimiento continuo desde el fotograma 0.
2. **Simulación real y determinista**: gravedad, rebotes, colisiones y partículas, con `H.rng` y nunca `Math.random`. Se precalcula al cargar (`motor/sim.js`) y cada fotograma solo lee su estado: `seek(t)` es función pura de t.
3. **Texto mínimo**:
   - una **pregunta** de ≤ 6 palabras al inicio, con saltos de línea equilibrados (` / `);
   - un **contador** grande;
   - una **frase final** que revela el dato y solo sale cuando ya se vio el desenlace;
   - la marca de agua «ASOMBROTECA», pequeña, con contorno y durante todo el vídeo, en una esquina dentro de la zona segura (220 ≤ y ≤ 1450, x ≤ 940).
   - Además, como mucho **1-2 etiquetas** de 1-3 palabras y, si hacen falta, números de ejes o una fórmula pequeña.
3 bis. **El contexto lo da la IMAGEN, no el texto**: placa de Petri y bacilos que se parten, con un reloj de 20 min por generación; flechitas ← → de la bola que se sigue y números bajo las casillas; plano cartesiano con cadenas x/y y la fórmula. Si hace falta, cámara lenta (la física no cambia) y zoom encuadrado dentro de la zona segura.
4. **El sonido sale de la simulación**: cada choque o evento suena, con un tono que cambia según la velocidad o la cantidad (estilo ASMR). Música muy baja o ninguna.
5. **Fondo oscuro y limpio**, con colores vivos en los objetos (excepción: `FONDO atardecer`, cielo claro con figuras oscuras).
6. **Final incierto** hasta el último segundo, y empalme con el inicio.
7. **Dato real con su fuente** en `FUENTES_Y_DECISIONES.md`.
8. **Nada flota**: lo que cae se apoya o sale por una abertura. Se revisa a ojo en la hoja de contacto.

## Hacer un reel

```
python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/nuevo_reel.py MI_REEL --formato rebote|galton|fourier|incendio|montecarlo|pendulos|hormiga|cristal|caos|bandada|turing|mandelbrot
#   edita MI_REEL_REEL/03_GUION/tiempos.txt (pregunta, frase, fuente, duración, PARAM) y 04_CODIGO/js/episodio.js
python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/producir_reel.py MI_REEL_REEL build
node PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/sim_info.js MI_REEL_REEL/04_CODIGO/index.html          # ajustar PARAM (en el navegador)
python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/producir_reel.py MI_REEL_REEL prueba 0 1 5 10 20 30  # UNA hoja de contacto
python3 PLANTILLA_ASOMBROTECA_SIN_VOZ/tools/producir_reel.py MI_REEL_REEL todo                   # MP4 + QC
```

Tras mirar `07_QC/hoja_contacto.jpg`, escribe `07_QC/revision_visual.txt` con `nada flota: OK` y repite `qc`.

**Ajustar el final incierto.** Con simulaciones caóticas, Node y Chromium pueden dar resultados distintos. Ajusta los `PARAM` con `sim_info.js`, que corre en el mismo navegador que el render.

## `03_GUION/tiempos.txt`

```
DURACION 35
MUSICA no                      # no · muy_baja
FONDO oscuro                   # oscuro · atardecer (v2.4)
SEMILLA 7
PREGUNTA 3.6 | ¿Llenarán el círculo antes del final?
FRASE 30.0 | Una *E. coli* puede dividirse cada 20 minutos.
FUENTE Sezonov et al. (2007), Journal of Bacteriology 189: 8746-8749
PARAM tDiv 3.2
```

- La pregunta está en pantalla desde el fotograma 0 hasta el instante que indiques.
- La frase entra en su instante y se va antes del empalme, así que nunca coincide con la pregunta.
- Las palabras entre `*asteriscos*` salen en amarillo y ` / ` fuerza un salto de línea.

## Los 12 formatos (con su ejemplo en `ejemplos/`)

| `--formato` | Proceso | Contador | Final incierto → empalme | Ejemplo y dato |
|---|---|---|---|---|
| `rebote` | Bacilos en una placa de Petri. Al tocar el borde, si ya «maduraron», se estrechan y se parten en dos hijas que se reparten su área. Choques elásticos reales. Reloj de 20 min por generación | Bacterias (+ reloj) | ¿En cuántas horas se llena? (en el último segundo) → todo vuelve a una bacteria | `SIM_BACTERIAS_REEL` · 1 *E. coli* llega a 600 en unas 3 h |
| `galton` | Miles de bolitas caen por una red de clavos (gravedad, choque y rebote) y se apilan en casillas numeradas. La última, blanca, se sigue a cámara lenta con una flechita ← → por fila | Bolas que llegan (+ «← · →») | ¿Dónde cae la bola blanca? → se abre la compuerta y el tablero se vacía | `SIM_GALTON_REEL` · por eso la estatura forma esta curva |
| `fourier` | Dos cadenas de epiciclos (x arriba, y a la izquierda) con líneas punteadas al lápiz, sobre un plano cartesiano, y la fórmula en una esquina | Círculos | ¿Qué figura es? → con cientos de círculos sale la silueta detallada; luego vuelve a un círculo | `SIM_FOURIER_REEL` · cualquier dibujo es una suma de círculos que giran (Fourier, 1822) |
| `incendio` (v2.2) | Bosque visto desde arriba; el fuego salta de árbol en árbol (percolación). Dos cortafuegos iguales: uno con 66 % de árboles (el fuego lo cruza) y otro con 42 % (lo detiene), con su % en una etiqueta | % quemado (+ «quemado») | ¿Se quemará todo? (el fuego tantea el segundo cortafuegos) → el bosque rebrota | `SIM_INCENDIO_REEL` · por debajo del 59 % de árboles el fuego no cruza (Newman y Ziff, 2000) |
| `montecarlo` (v2.2) | Lluvia de 40.000 puntos al azar sobre un cuadrado con su círculo inscrito; dentro azul, fuera rosa; fórmula pequeña con los recuentos | Estimación de π | La cifra oscila hasta el final → la lluvia se seca y vuelve a «?» | `SIM_MONTECARLO_REEL` · con puntos al azar se calcula π (Metropolis y Ulam, 1949) |
| `pendulos` (v2.2) | Onda de péndulos clásica en 3D: 15 péndulos colgados en V de una barra, de longitudes calculadas; serpiente, ondas y caos aparente | Segundos | ¿Volverán a alinearse? (a los 34 s) → siguen y empalman | `SIM_PENDULOS_REEL` · el ritmo de un péndulo solo depende de su longitud (Huygens, 1673; Berg, 1991) |
| `hormiga` (v2.3) | Hormiga de Langton sobre un tablero: 2 reglas dibujadas en grande; paso a paso 2,5 s, luego acelera; la cámara encuadra siempre todo | Pasos (+ «pasos») | ¿Qué construirá? (caos hasta el paso ~10.000) → las casillas se apagan | `SIM_HORMIGA_REEL` · tras 10.000 pasos de caos construye una autopista (Langton, 1986) |
| `cristal` (v2.3) | Agregación limitada por difusión en una placa: la primera partícula camina sola (1,3 s) y luego llegan miles con su estela; la cámara se aleja | Partículas (+ «partículas») | ¿Qué forma crecerá? → onda de luz y el cúmulo se apaga | `SIM_CRISTAL_REEL` · ramas como las de un rayo (Witten y Sander, 1981; Niemeyer et al., 1984) |
| `caos` (v2.3) | Dos péndulos dobles (celeste y rosa) del mismo eje, con una millonésima de diferencia; barrita logarítmica de la diferencia | Segundos | ¿Seguirán juntos? (se separan a los ~15 s) → vuelven a la salida | `SIM_CAOS_REEL` · una millonésima basta para cambiarlo todo (Lorenz, 1963; Shinbrot et al., 1992) |
| `bandada` (v2.4) | Murmuración de estorninos: boids 3D con 3 reglas sobre un cielo de atardecer (`FONDO atardecer`); un halcón la atraviesa y la abre en ondas; al final bajan a los árboles | Pájaros (+ «pájaros») | ¿Quién la guía? → se posan y el cielo queda vacío | `SIM_BANDADA_REEL` · nadie la guía: 3 reglas (Reynolds, 1987; Ballerini et al., 2008) |
| `turing` (v2.4) | Reacción-difusión de Gray-Scott sobre un trozo de piel: manchas que nacen, se parten y se acomodan | Manchas (+ «manchas») | ¿Quién las pinta? → la piel vuelve a quedar lisa | `SIM_TURING_REEL` · Turing (1952) explicó cómo pueden formarse |
| `mandelbrot` (v2.4) | Zoom continuo hasta una minicopia encuadrada como el conjunto entero (empalma solo) | Aumento (×1 … ×37 millones) | ¿Dónde termina? → vuelve a empezar | `SIM_MANDELBROT_REEL` · nunca termina: z² + c (Mandelbrot, 1980) |

## QC (`producir_reel.py qc` → `07_QC/QC.md`)

El QC revisa:

- formato y duración de 25 a 45 s;
- decodificación;
- **una sola escena** (`scdet` sin cortes);
- **movimiento continuo** (cambio cada medio segundo, sin fotogramas congelados ni negros) y movimiento desde el fotograma 0;
- **fondo oscuro**;
- −14 LUFS;
- **sonido sacado de la simulación** (cada arranque de sonido coincide ±25 ms con un evento simulado);
- música muy baja o ninguna;
- determinismo;
- zona segura;
- **texto mínimo** (pregunta, contador, frase y marca; ≤ 2 etiquetas, ejes, fórmula y una unidad bajo el contador);
- pregunta y frase nunca juntas;
- pregunta ≤ 6 palabras en el fotograma 0;
- frase final con su fuente;
- **marca de agua en todas las muestras**;
- bucle;
- nada flota (revisión visual).

Cuando todo pasa, escribe **TODO CORRECTO**.

## Qué hay dentro

| Archivo o carpeta | Para qué sirve |
|---|---|
| `PROMPT_NUEVO_REEL.md` | Prompt corto de copiar y pegar para pedir un reel nuevo. |
| `INSTRUCCIONES_REEL.md` | Firmas de `SIM.*` y `R.*` y cómo escribir `episodio.js`. |
| `motor/sim.js` | Simulaciones precalculadas y deterministas: `SIM.rebote`, `SIM.galton`, `SIM.fourier`, `SIM.incendio`, `SIM.montecarlo`, `SIM.pendulos`, `SIM.hormiga`, `SIM.dla`, `SIM.pendulo2`, `SIM.boids`, `SIM.grayscott`, `SIM.mandel` y utilidades. |
| `motor/reel.js` | Montaje (fondo, pregunta, contador, frase, marca de agua, bucle) y sonido ASMR desde los eventos (`R.asmr`). |
| `motor/plantilla.js`, `lib/`, `fonts/` | Motor v1.28 sin cambios (se usan `H`, `SOUND`, `P.glow` y `P.fmtN`). |
| `tools/` | `nuevo_reel.py`, `producir_reel.py`, `tiempos.py`, `sim_info.js`, `textos.js` (QC de textos), `build.py`, `render.js`, `audio.js`, `frames.js`, `sheet.py`, `determinismo.js`. |
| `ejemplos/` | Los 12 reels de ejemplo (código, MP4 y QC). |
| `V1/` | Respaldo de la versión 1.0. |
| `INSTRUCCIONES_PLANTILLA.md`, `GUIA_ESTILOS.md`, `catalogo/` | Referencia heredada de los bloques `P.*` y `FX.*` (lo que habla de voz no se aplica aquí). |

Requisitos: Python 3 con numpy, Node con Playwright y Chromium, y ffmpeg.
