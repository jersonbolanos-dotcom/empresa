# Fuentes y decisiones · ¿Qué número esconde esta lluvia?

Formato: `montecarlo` · Plantilla Asombroteca SIN_VOZ 2.2 · 32 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Lanzando puntos al azar se puede calcular *π*.» | Si se lanzan puntos al azar, uniformes, sobre un cuadrado con un círculo inscrito, la fracción que cae dentro tiende a π/4 (área del círculo / área del cuadrado), así que 4 · dentro / total → π. Es el método de Montecarlo; su precursor es el problema de la aguja de Buffon | Metropolis, N. y Ulam, S. (1949), «The Monte Carlo Method», *Journal of the American Statistical Association* 44(247): 335-341; Buffon, G.-L. Leclerc, conde de (1777), *Essai d'arithmétique morale* |

## Decisiones

- **Proceso**:
  - 40.000 gotas caen en puntos uniformes del cuadrado (`SIM.montecarlo`, `H.rng(403)`);
  - las de dentro del círculo son azules y las de fuera, rosas;
  - la lluvia empieza gota a gota (la primera ya va cayendo en el fotograma 0) y acelera de forma exponencial.
- **Contador**: la estimación 4 · dentro / total con 4 decimales. Las cifras se encienden en verde cuando coinciden con 3,1416.
  - La semilla 403 se eligió en Chromium: el error llega a 0,034 a mitad del vídeo (final incierto) y la estimación final es exactamente 3,1416.
- **Fórmula pequeña** con los recuentos reales de dentro y total.
- **Bucle**: la lluvia se seca y el contador vuelve a «?» junto con la pregunta del empalme.
- **Sonido**:
  - una gota por cada punto (las primeras se oyen una a una; luego suenan como lluvia, con el control de densidad de `R.asmr`);
  - ruido de lluvia que sigue al ritmo.
  - Cierre (v2.3.1): un acorde suave (`R.cierre`) entra con la frase final y se desvanece antes del empalme.
  - Sin música.
- **Nada flota**: cada gota cae y se queda en el punto donde toca el plano.
