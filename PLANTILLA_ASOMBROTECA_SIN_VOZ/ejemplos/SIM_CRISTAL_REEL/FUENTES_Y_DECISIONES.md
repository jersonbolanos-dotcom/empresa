# Fuentes y decisiones · ¿Qué forma crecerá aquí?

Formato: `cristal` · Plantilla Asombroteca SIN_VOZ 2.3 · 32 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Partículas pegándose al azar forman ramas como las de un *rayo*.» | En la agregación limitada por difusión (DLA), partículas que caminan al azar (movimiento browniano) y se pegan al tocar el cúmulo forman un fractal ramificado. La misma geometría aparece en la ruptura dieléctrica, la descarga eléctrica que forma figuras como las de un rayo | Witten, T. A. y Sander, L. M. (1981), «Diffusion-limited aggregation, a kinetic critical phenomenon», *Physical Review Letters* 47: 1400-1403; Niemeyer, L., Pietronero, L. y Wiesmann, H. J. (1984), «Fractal dimension of dielectric breakdown», *Physical Review Letters* 52: 1033-1036 |

## Decisiones

- **Proceso**:
  - `SIM.dla` en una rejilla fina: 6.000 partículas, `H.rng(5)`;
  - cada una sale de un círculo justo fuera del cúmulo, camina al azar (con saltos largos cuando está lejos, que no cambian el resultado) y se pega al tocar un vecino.
- **Primera partícula**: se sigue entera, paso a paso (2.679 pasos sin saltos largos), a cámara lenta durante 1,3 s, y se pega en el núcleo a 1,3 s.
- **Llegadas**: después llegan las demás con un ritmo que acelera de forma exponencial. Cada una muestra la estela de sus últimos 24 pasos.
- **Cámara**: la placa es fija en pantalla y la cámara se aleja dentro de ella, como un microscopio, para que el cúmulo quepa siempre (radio ≤ 360 px). Todo se recorta a la placa.
- **Color**: según el orden de llegada, del cian al magenta.
- **Final**: una onda de luz recorre las ramas del centro hacia fuera, para que la imagen no se quede quieta. Luego el cúmulo se apaga hasta el núcleo para empalmar.
- **Contador**: partículas pegadas, con «partículas» debajo (tipo `unidad`).
- **Sonido**: una nota de cristal por partícula, más aguda cuanto más lejos del centro, con el control de densidad de `R.asmr`. Cierre (v2.3.1): un acorde suave (`R.cierre`) entra con la frase final y se desvanece antes del empalme. Sin música.
- **Nada flota**: todo ocurre sobre la placa; las partículas caminan por ella y se pegan al cúmulo.
