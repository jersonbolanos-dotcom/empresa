# Fuentes y decisiones · ¿Qué animal dibujan estos círculos?

Formato: `fourier` · Plantilla Asombroteca SIN_VOZ 2.1 · 32 s.

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
- **Etapas**: 1, 2, 3, 4, 5, 6, 8, 10, 13, 18, 40 y 900 círculos por cadena. El animal solo se reconoce en las últimas.
- **Elefante**:
  - silueta propia de una sola línea;
  - el propio trazo dibuja el ojo (un bucle que cuelga de la frente) y las arrugas de la trompa, con más puntos de contorno;
  - el trazo es más grueso y brillante;
  - al completarse, la cámara se acerca (×1,14) y lo centra;
  - los círculos siguen girando tenues y un tramo de luz recorre la silueta, así que nunca se queda quieto.
- **Sonido**: campanita que sube con cada etapa, acorde al completar el dibujo y zumbido suave del lápiz cuyo tono sigue a su velocidad. Sin música.
- **Nada flota**: las cadenas van encadenadas centro con centro desde un centro fijo.
