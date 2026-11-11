# Fuentes y decisiones · ¿Dónde termina esta figura?

Formato: `mandelbrot` · Plantilla Asombroteca SIN_VOZ 2.4 · 40 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Nunca termina: toda esta figura sale de una sola fórmula, *z² + c*.» | El conjunto de Mandelbrot son los números complejos c para los que la iteración z → z² + c, empezando en z = 0, no se escapa al infinito. Su borde tiene detalle a cualquier escala y contiene infinitas copias reducidas del conjunto entero | Mandelbrot, B. B. (1980), «Fractal aspects of the iteration of z → λz(1−z) for complex λ and z», *Annals of the New York Academy of Sciences* 357: 249-259 |

## Decisiones

- **Recorrido**:
  - zoom continuo a velocidad constante en escala logarítmica, por el valle de los caballitos de mar;
  - termina en una minicopia de periodo 507 (núcleo c ≈ −0,7436438946 + 0,1318261648 i, hallado con el método de Newton);
  - su tamaño y su giro (s = 1/(β·λ²), Munafo) dan el aumento final, ×37 millones, y el giro, 13,8°, para que quede encuadrada igual que el conjunto entero del fotograma 0. Por eso el vídeo empalma solo.
- **Profundidad**: ×37 millones en lugar de ×10.000 millones. Las minicopias más profundas necesitan miles de iteraciones por píxel; esta se calcula a resolución completa en tiempo razonable y sin perder nitidez.
- **Cálculo**:
  - cada píxel, en cada fotograma, a 1080 × 1920, con escape continuo;
  - detección de órbitas periódicas para el interior;
  - de 400 a 3.000 iteraciones según el aumento.
- **Color**:
  - paleta cíclica viva;
  - el brillo depende de cuánto tarda cada píxel en escapar respecto al más rápido del fotograma: lejos del conjunto es oscuro y en sus bordes hay luz (fondo oscuro, luminancia media ~34/255).
- **Textos**:
  - franjas oscuras suaves detrás de la pregunta, la frase y el contador;
  - el contador (×1 … ×37 millones) se apaga del todo antes del empalme, para no encimarse con el «×1» del inicio.
- **Sonido**: una nota de cristal cada vez que el aumento se duplica (cada vez más aguda), una campana en cada ×10 y el acorde de cierre. Sin música.
- **QC**: el control de textos (`textos.js`) no calcula el fractal: solo registra dónde se dibujan los textos.
