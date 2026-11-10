# Fuentes y decisiones · ¿Seguirán juntos los dos?

Formato: `caos` · Plantilla Asombroteca SIN_VOZ 2.3 · 34 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Una diferencia de una *millonésima* basta para cambiarlo todo.» | El péndulo doble es un sistema caótico: dos movimientos que empiezan casi iguales se separan de forma exponencial con el tiempo (dependencia sensible de las condiciones iniciales). Aquí, una diferencia inicial de 10⁻⁶ rad en el segundo brazo se vuelve una separación completa a los 15,4 s | Lorenz, E. N. (1963), «Deterministic nonperiodic flow», *Journal of the Atmospheric Sciences* 20: 130-141; Shinbrot, T., Grebogi, C., Wisdom, J. y Yorke, J. A. (1992), «Chaos in a double pendulum», *American Journal of Physics* 60: 491-499 |

## Decisiones

- **Física**:
  - `SIM.pendulo2`: dos brazos iguales sin rozamiento (ecuaciones de Lagrange), integrados con RK4 a 1.200 pasos/s;
  - los dos péndulos salen con los dos brazos a 1,76 rad, y el rosa tiene 10⁻⁶ rad más en el de abajo;
  - el ángulo se eligió en Chromium para que la separación clara (más del 30 % de la longitud) llegue a los 15,4 s y queden unos 14 s de caos.
- **Dos desde el fotograma 0**: el rosa se dibuja debajo y más ancho (contorno) y el celeste encima. La etiqueta «1 millonésima» señala a los dos con dos líneas finas, de sus colores, hasta los 6 s.
- **Tamaño**: cada brazo mide 204 px; el péndulo ocupa casi todo el tablero. Las estelas duran 2,5 s y son brillantes.
- **Barrita**: en escala logarítmica, va de una millonésima a todo el péndulo y muestra cómo crece la diferencia.
- **Contador**: los segundos.
- **Bucle**: en los últimos 1,9 s los dos vuelven a la posición de salida (los ángulos se interpolan) para empalmar con el fotograma 0.
- **Sonido**:
  - un zumbido por péndulo que sigue la velocidad de su brazo de abajo (el rosa, una quinta más agudo);
  - una campana suave cuando se separan.
  - Sin música.
- **Nada flota**: los dos cuelgan del mismo eje, atornillado al tablero.
