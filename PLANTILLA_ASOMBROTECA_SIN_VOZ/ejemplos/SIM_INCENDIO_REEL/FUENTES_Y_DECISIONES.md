# Fuentes y decisiones · ¿Se quemará todo el bosque?

Formato: `incendio` · Plantilla Asombroteca SIN_VOZ 2.2 · 40 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Por debajo del *59 %* de árboles, el fuego ya no cruza el bosque.» | En una red cuadrada donde cada casilla tiene un árbol con probabilidad p y el fuego pasa de un árbol a sus 4 vecinos, existe un camino de árboles que cruza todo el bosque solo si p supera el umbral de percolación de sitios, p_c = 0,59274621(13). Por debajo, los grupos de árboles conectados son finitos y el fuego se extingue | Newman, M. E. J. y Ziff, R. M. (2000), «Efficient Monte Carlo algorithm and high-precision results for percolation», *Physical Review Letters* 85: 4104-4107 (arXiv cond-mat/0005264); Stauffer, D. y Aharony, A. (1994), *Introduction to Percolation Theory*, 2.ª ed., Taylor & Francis |

## Decisiones

- **Tema**: incendio forestal en lugar de contagio y vacunas (pedido del usuario, para evitar temas de salud que limitan la monetización).
- **Proceso**:
  - bosque de 60 × 60 casillas visto desde arriba, con un 86 % de árboles;
  - el fuego empieza en el borde izquierdo y pasa de un árbol a sus 4 vecinos con un retraso al azar (`SIM.incendio`, Dijkstra, `H.rng(244)`).
- **Dos cortafuegos del mismo ancho** (8 columnas, árboles cortados → tocones):
  - el primero conserva un 66 % de árboles, por encima del umbral, y el fuego lo cruza;
  - el segundo conserva un 42 %, por debajo, y el fuego se detiene dentro de él (llega a su última columna).
  - Cada etiqueta muestra el % real medido en la simulación.
  - Con estas densidades, en 177 de 400 semillas probadas en Chromium el fuego cruza el primer cortafuegos y se queda en el segundo; se eligió la 244, que llega más lejos (máximo suspense).
- **Contador**: % del bosque quemado, con la palabra «quemado» debajo (tipo `unidad`) para no confundirlo con los % de los cortafuegos. Termina en 70 %.
- **Sin tiempo muerto**: del 95 al 98 % de los árboles quemados el fuego va 2,5 veces más rápido y el último 2 %, 8 veces (remapeo monótono: el orden de ignición no cambia). La frase entra 0,4 s después de que se apaga el último árbol.
- **Bucle**: el bosque rebrota (gotas) y el contador vuelve a 0 % para empalmar con el inicio.
- **Sonido**:
  - un chasquido por cada árbol que prende;
  - un rugido grave cuyo volumen sigue al número de árboles que arden;
  - un siseo al apagarse;
  - gotas al rebrotar.
  - Sin música.
- **Nada flota**: vista cenital; árboles, tocones y llamas están sobre el suelo del bosque.
