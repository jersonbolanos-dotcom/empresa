# Fuentes y decisiones · ¿Quién pinta estas manchas?

Formato: `turing` · Plantilla Asombroteca SIN_VOZ 2.4 · 28 s.

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
  - la frase sale a los 22 s;
  - el vídeo dura 28 s.
- **Contador**: manchas contadas de verdad en cada fotograma (grupos conectados de celdas con v > 0,18).
- **Aspecto**: color arena con el borde de cada mancha oscuro y el centro más claro, como las del leopardo. Luz de estudio que se mueve despacio (la imagen nunca se congela). La piel es un parche iluminado sobre fondo oscuro.
- **Bucle**: al final la piel vuelve a quedar lisa.
- **Sonido**: una gota por cada mancha nueva (cuando aparece o se parte en dos) y el acorde de cierre con la frase. Sin música.
- **Nada flota**: las manchas están en la piel.
