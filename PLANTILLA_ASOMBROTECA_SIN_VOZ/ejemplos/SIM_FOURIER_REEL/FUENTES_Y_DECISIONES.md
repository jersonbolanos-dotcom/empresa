# Fuentes y decisiones · ¿Qué animal dibujan estos círculos?

Formato: `fourier` · Plantilla Asombroteca SIN_VOZ 2.1.1 · 35 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Cualquier dibujo se puede hacer sumando círculos que giran. (Fourier, 1822)» | Cada coordenada de una curva cerrada es una suma de cosenos (serie de Fourier): x(t) = Σ aₖ·cos(kt + φₖ), y(t) = Σ bₖ·cos(kt + ψₖ). Cada término es un círculo que gira | Fourier, J. (1822), *Théorie analytique de la chaleur*, Firmin Didot |

## Decisiones

- **Contexto con la imagen** (estilo del vídeo de referencia del colibrí):
  - la cadena de epiciclos de **arriba** calcula x(t) y la de la **izquierda** calcula y(t);
  - de sus puntas salen líneas punteadas, celeste y rosa, que se cruzan en el lápiz;
  - detrás hay un plano cartesiano tenue con ejes, marcas y las letras x, y.
- **Fórmula**: va pequeña en la esquina superior izquierda. La fila «k = …» enciende en amarillo los términos nuevos de cada etapa.
- **Cálculo**:
  - es la DFT (2.048 muestras) de cada coordenada por separado, como señales reales;
  - la punta de cada cadena es la parte real de la suma de vectores giratorios, que equivale a Σ |cₖ|·cos(kt + arg cₖ);
  - se ordenan de mayor a menor radio.
- **Etapas**: 1, 2, 3, 4, 5, 6, 8, 10, 13, 18, 40 y **1.800** círculos por cadena. El animal solo se reconoce en las últimas.
- **Elefante (contorno nuevo)**:
  - es un diseño original de una sola línea continua, escrito como trazo SVG con `tools/elefante/generar_trazo.py` (con su visor `ver_trazo.js`) y muestreado con **4.096 puntos**;
  - la **oreja** es grande y cerrada, con el lóbulo en punta; el lomo llega a su borde superior y sigue por su contorno (la oreja tapa el hombro; el borde superior se repasa sobre sí mismo para cerrar el bucle sin cruces);
  - la **trompa** es gruesa en la base, con arrugas en el borde exterior y la punta enroscada;
  - el **colmillo** es más grande y se rellena de marfil brillante cuando el lápiz lo dibuja;
  - el **ojo** es una almendra con su pliegue;
  - las **patas** son columnas que se ensanchan hacia el pie, con uñas en las cercanas;
  - la **cola** lleva mechón.
- **Encuadre**: durante todo el dibujo el elefante queda dentro de la zona segura (280 ≤ x ≤ 928). Al completarse (27,8 s), la cámara lo amplía a ~840 px de ancho y se queda **3,2 s** antes de la frase (31 s), con un acercamiento lento y los colores girando despacio (movimiento continuo). El contador está abajo a la izquierda y nunca tapa el dibujo.
- **Sonido**: campanita que sube con cada etapa, acorde al completar el dibujo y zumbido suave del lápiz cuyo tono sigue a su velocidad. Sin música.
- **Nada flota**: las cadenas van encadenadas centro con centro desde un centro fijo.
