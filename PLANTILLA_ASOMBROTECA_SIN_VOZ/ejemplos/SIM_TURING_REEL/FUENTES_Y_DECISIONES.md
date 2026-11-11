# Fuentes y decisiones · ¿Quién pinta estas manchas?

Formato: `turing` · Plantilla Asombroteca SIN_VOZ 2.4.1 · 30 s (versión anterior en `V1/`).

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Alan Turing explicó en 1952 cómo pueden formarse solas las manchas de los animales.» | Turing propuso que dos sustancias que reaccionan entre sí y se difunden a distinta velocidad pueden formar patrones (manchas, rayas) a partir de un tejido casi uniforme. La propuesta era teórica; las pruebas en animales llegaron después (por ejemplo, las rayas del pez ángel, Kondo y Asai, 1995). Por eso la frase dice «explicó cómo pueden formarse» | Turing, A. M. (1952), «The chemical basis of morphogenesis», *Philosophical Transactions of the Royal Society of London B* 237: 37-72; Kondo, S. y Asai, R. (1995), *Nature* 376: 765-768 |

## Decisiones

- **Modelo**:
  - `SIM.grayscott` es reacción-difusión de Gray-Scott (Pearson, J. E. (1993), «Complex patterns in a simple system», *Science* 261: 189-192), un sistema del tipo que propuso Turing, no el de su artículo;
  - parámetros F = 0,030, k = 0,062, Du = 0,21, Dv = 0,105, con rejilla periódica de 140 × 146;
  - 8 semillas sobre una piel lisa con ruido mínimo (`H.rng(3)`).
- **Ritmo** (sin tiempo muerto):
  - 7,5 pasos por fotograma: las manchas crecen, se parten en dos y llenan la piel hacia los 20 s (8 → 40 → 86 → 100);
  - la pregunta queda al menos 4,5 s en pantalla;
  - entre los 19 y los 22,4 s la cámara se aleja y revela que la piel es el lomo de un leopardo;
  - la frase sale a los 23 s, con el leopardo entero;
  - el vídeo dura 30 s.
- **Contador**: manchas contadas de verdad en cada fotograma (grupos conectados de celdas con v > 0,18).
- **Aspecto**: color arena con el borde de cada mancha oscuro y el centro más claro, como las del leopardo. Luz de estudio que se mueve despacio (la imagen nunca se congela). La piel es un parche iluminado sobre fondo oscuro.
- **Leopardo** (silueta original, de perfil, caminando):
  - cuerpo largo con la espalda algo arqueada, patas largas y delgadas (una delantera adelantada), cabeza redondeada con hocico corto, orejas pequeñas y cuello marcado, cola larga que cae y se curva hacia arriba;
  - vientre y parte baja de las patas más claros;
  - lleva el MISMO patrón de la simulación (la rejilla es periódica, así que se repite sin costuras): manchas grandes en el tronco y pequeñas en patas, cabeza y cola;
  - antes de alejarse, el trozo de piel pierde sus bordes y se funde con el lomo, sin recuadro;
  - mueve la cola despacio y respira (el pecho sube y baja), así que no queda congelado.
- **Bucle**: la cámara vuelve a acercarse al lomo y la piel vuelve a quedar lisa.
- **Sonido**: desde el fotograma 0, una gota por cada una de las 8 semillas; después, una gota por cada mancha nueva (cuando aparece o se parte en dos) y el acorde de cierre con la frase. Sin música.
- **Nada flota**: las manchas están en la piel.
