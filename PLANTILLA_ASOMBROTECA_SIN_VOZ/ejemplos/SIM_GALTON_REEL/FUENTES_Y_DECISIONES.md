# Fuentes y decisiones · ¿Dónde caerá la última bola?

Formato: `galton` · Plantilla Asombroteca SIN_VOZ 2.0 · 40 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Sumar muchos azares siempre dibuja la campana de Gauss.» | Cada bolita sufre 16 desvíos al azar; la suma de muchas variables aleatorias independientes tiende a la distribución normal (teorema central del límite). Galton construyó este tablero, el *quincunx*, para mostrarlo | Galton, F. (1889), *Natural Inheritance*, Macmillan, cap. V; de Moivre, A. (1733), aproximación normal de la binomial; Laplace, P.-S. (1812), *Théorie analytique des probabilités* |

## Decisiones

- **Proceso**: 2.000 bolitas caen por 16 filas de clavos con gravedad (1.400 px/s²), choques reales con restitución 0,5, rozamiento en el choque y resistencia lateral (`SIM.galton`, 240 Hz, `H.rng(3)`). Con estos parámetros la distribución sale con σ ≈ 2,3 casillas y curtosis ≈ 3, como una normal.
- **Simplificación**: en las casillas las bolitas se apilan con una regla de llenado (sin choques entre ellas). Así son viables 2.000 bolitas y la pila queda limpia.
- **Campana dorada**: es una normal ajustada a la media y la desviación de lo que cayó de verdad, no una binomial ideal, porque un tablero físico no es una binomial perfecta.
- **Final incierto**: la última bola (blanca) sale sola y cae a los ~38,5 s; su casilla no se sabe hasta que llega. Después se abre la compuerta del piso, las bolitas salen por la ranura (nada se dibuja bajo el piso ni tapa la marca) y el tablero vacío empalma con el inicio.
- **Movimiento desde el fotograma 0**: hay 1,2 s de precarga, así que al empezar ya caen bolitas.
- **Sonido**:
  - cada clavo tocado: madera, más grave en las filas de abajo, con paneo según la columna, y el clavo se ilumina;
  - cada bolita que llega a su casilla: gota, con el tono según la casilla;
  - la última bola: acorde de campana;
  - el vaciado: arena que cae.
  - Sin música.
- **Nada flota**: todas las bolitas caen por gravedad y se apoyan en la pila o en el fondo.
