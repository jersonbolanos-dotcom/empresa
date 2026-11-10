# Fuentes y decisiones · ¿En cuántas horas llenan esto?

Formato: `rebote` · Plantilla Asombroteca SIN_VOZ 2.1 · 35 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Dividiéndose cada 20 minutos, 1 *E. coli* llega a 600 en unas 3 horas.» | En condiciones óptimas de laboratorio (caldo LB, 37 °C), *E. coli* se duplica cada ~20 min. Llegar de 1 a 600 bacterias requiere log₂ 600 ≈ 9,2 generaciones × 20 min ≈ 3 h 04 min | Sezonov, G., Joseleau-Petit, D. y D'Ari, R. (2007), «Escherichia coli physiology in Luria-Bertani broth», *Journal of Bacteriology* 189(23): 8746-8749 |

## Decisiones

- **Contexto con la imagen**:
  - las bolas son bacilos (cápsulas alargadas, como *E. coli*) dentro de una placa de Petri;
  - crecen entre divisiones, se estrechan por el medio y se parten en dos;
  - un reloj pequeño junto al contador avanza **20 min por generación**.
- **Reloj coherente con la simulación**:
  - marca 20 min × la generación media de las bacterias que hay en cada fotograma (cada división suma una generación a la madre y a la hija);
  - al llenarse la placa (600 bacterias, 33,5 s) marca **3 h 07 min**, coherente con el cálculo teórico (≈ 3 h 04 min) y con la frase final («unas 3 horas»).
- **Proceso**:
  - un bacilo se mueve en la placa;
  - al tocar el borde, si han pasado ≥ 3,2 s desde su última división, se divide en dos hijas que se reparten su área (radio ÷ √2), de r = 40 a r = 13;
  - los choques son elásticos, con masa ∝ área (`SIM.rebote`, 240 Hz, `H.rng(7)`).
  - La forma de bacilo es solo visual: el choque se calcula con un círculo del mismo radio.
- **Final incierto**: `tDiv` está ajustado en Chromium para que la placa se llene a los 33,5 s de 35. Después todo se contrae en la bacteria inicial (empalme con el fotograma 0).
- **Sonido**:
  - borde: madera, más aguda cuanto más rápida y más pequeña es la bacteria;
  - choques: tic suave;
  - cada división: una gota que sube de tono con el número de bacterias;
  - al llenarse: campana.
  - Sin música.
- **Nada flota**: la placa se ve desde arriba, sin gravedad; las bacterias se mueven sobre el agar.
- **Analogía**: las bacterias reales no se dividen al tocar el borde ni se mueven tan rápido. La simulación solo reproduce la regla «cada una se divide tras su tiempo de generación», que es lo que hace exponencial el crecimiento.
