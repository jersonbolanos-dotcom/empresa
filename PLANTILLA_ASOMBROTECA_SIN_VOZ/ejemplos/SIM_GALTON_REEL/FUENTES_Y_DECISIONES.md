# Fuentes y decisiones · ¿Dónde caerá la última bola?

Formato: `galton` · Plantilla Asombroteca SIN_VOZ 2.1 · 45 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Por eso la *estatura* de la gente forma esta misma curva.» | La estatura de los adultos de un mismo sexo se distribuye casi exactamente como una normal (campana de Gauss): resulta de sumar muchos efectos pequeños (genes y ambiente), igual que cada bola suma 16 desvíos al azar (teorema central del límite). Al mezclar hombres y mujeres sigue saliendo una sola campana, algo más ancha (no es bimodal) | Galton, F. (1889), *Natural Inheritance*, Macmillan (estatura de adultos y quincunx); Schilling, M. F., Watkins, A. E. y Watkins, W. (2002), «Is human height bimodal?», *The American Statistician* 56(3): 223-229 |

## Decisiones

- **Contexto con la imagen**:
  - la cámara sigue a la bola blanca a **cámara lenta** (~11 s; la física es la misma, solo cambia la velocidad de reproducción);
  - en cada fila aparece una flechita ← o →, y la etiqueta «← 7 · 9 →» cuenta sus 16 decisiones;
  - debajo de cada casilla va su número, que es cuántas veces una bola fue a la derecha;
  - la blanca hace 9 → y cae en la casilla 9, que se enciende.
- **Las 16 decisiones**: con choques reales, una bola puede pasar por un hueco o rebotar dos veces. Por eso cada flecha marca el lado hacia el que se desplaza entre una fila y la siguiente, y siempre son 16. La salida de la blanca (`xUltima = 0,625`, elegida en Chromium) hace que el número de → coincida con su casilla.
- **Proceso**:
  - 2.000 bolitas caen por 16 filas de clavos con gravedad, restitución 0,5, rozamiento en el choque y resistencia lateral (`SIM.galton`, 90 estados/s, `H.rng(3)`);
  - la distribución sale con σ ≈ 2,3 casillas y curtosis ≈ 3, como una normal;
  - en las casillas se apilan con una regla de llenado (sin choques entre ellas).
- **Campana dorada**: es una normal ajustada a la media y la desviación de lo que cayó.
- **Frase**: aparece solo cuando la bola blanca ya llegó (38,8 s), para no revelar la respuesta antes.
- **Encuadre**: durante el zoom (×1,3, altura fija), el tablero entero, de la tolva al piso, queda dentro de la zona segura (piso en y ≈ 1415). La marca de agua tiene contorno oscuro y siempre va encima.
- **Bucle**: tras la llegada se abre la compuerta y las bolitas salen por la ranura, sin dibujarse bajo el piso. El tablero vacío empalma con el inicio.
- **Sonido**:
  - madera en cada clavo;
  - gota en cada casilla;
  - cristal en cada decisión de la blanca (más agudo a la derecha);
  - campana a su llegada;
  - arena al vaciar.
  - Sin música.
- **Nada flota**: todas las bolitas caen por gravedad y se apoyan en la pila o en el piso.
