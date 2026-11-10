# Fuentes y decisiones · ¿Qué construirá la hormiga?

Formato: `hormiga` · Plantilla Asombroteca SIN_VOZ 2.3 · 35 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Con 2 reglas, tras *10.000 pasos* de caos, construye esta autopista.» | La hormiga de Langton sigue dos reglas: en casilla vacía gira 90° a la derecha, en casilla llena a la izquierda, invierte la casilla y avanza. Desde la rejilla vacía se mueve de forma caótica unos 10.000 pasos y después construye una «autopista» diagonal: un ciclo de 104 pasos que se repite sin fin. En esta simulación la autopista empieza en el paso 9.976. Que cualquier configuración finita acabe en una autopista no está demostrado; por eso la frase no dice «siempre» | Langton, C. G. (1986), «Studying artificial life with cellular automata», *Physica D* 22: 120-149 |

## Decisiones

- **Proceso**: `SIM.hormiga`, sin azar (las dos reglas son deterministas). La rejilla vacía es de 640 × 640 casillas.
- **Reloj de pasos**:
  - **paso a paso** los primeros 2,5 s (5 pasos/s, 12 pasos);
  - **aceleración**: de 5 a 40 pasos/s en 1 s, y luego exponencial hasta el paso 9.976, a los 21,5 s;
  - **autopista**: se frena hasta 300 pasos/s para verla construirse, y llega a unos 15.500 pasos.
- **Cámara**: encuadra siempre todas las casillas tocadas. Mira 1 s adelante, se suaviza y se limita para que la caja de casillas quede entera dentro del tablero. La autopista nunca sale del cuadro.
- **Contexto con la imagen**:
  - una flechita blanca muestra hacia dónde mira la hormiga;
  - las dos reglas van dibujadas en grande bajo el tablero: casilla blanca con flecha que gira a la derecha y casilla de color con flecha que gira a la izquierda;
  - el color de cada casilla indica cuándo se tocó por primera vez.
- **Contador**: pasos, con la palabra «pasos» debajo (tipo `unidad`).
- **Bucle**: las casillas se apagan y el contador vuelve a 0 para empalmar con la rejilla vacía.
- **Sonido**:
  - un tic por paso (más agudo en casilla vacía, más grave en llena), con el control de densidad de `R.asmr`;
  - en la autopista, una gota cada 104 pasos (el ritmo del ciclo).
  - Cierre (v2.3.1): un acorde suave (`R.cierre`) entra con la frase final y se desvanece antes del empalme.
  - Sin música.
- **Nada flota**: la hormiga camina sobre el tablero de baldosas y las casillas están en él.
