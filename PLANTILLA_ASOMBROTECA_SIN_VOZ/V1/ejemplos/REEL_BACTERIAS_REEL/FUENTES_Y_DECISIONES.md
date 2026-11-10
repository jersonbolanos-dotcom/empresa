# Fuentes y decisiones · Una bacteria mientras ves esto

Formato: `contador` · Plantilla Asombroteca SIN_VOZ · 20 s.

## Datos que salen en pantalla

| Dato en pantalla | Valor | Fuente |
|---|---|---|
| Se divide en dos cada 20 minutos | Tiempo de duplicación de *E. coli* en condiciones ideales de laboratorio (medio LB, 37 °C): unos 20 min | Sezonov, Joseleau-Petit y D'Ari (2007), «Escherichia coli physiology in Luria-Bertani broth», *Journal of Bacteriology* 189(23): 8746-8749 |
| 10 horas → más de mil millones | 10 h = 600 min = 30 duplicaciones → 2³⁰ = 1.073.741.824 | Cálculo (2³⁰) |

## Decisiones

- El contador muestra el cálculo teórico de duplicación sin límites. En la placa real el crecimiento se frena por falta de nutrientes y de espacio (fase estacionaria). No se afirma que pase dentro del cuerpo.
- Cada clic = una duplicación = 20 min de laboratorio (`R.contadorSfx`): el sonido cuenta el tiempo.
- Gancho: «¿Cuántas habrá al final del video?», con la bacteria ya moviéndose en el fotograma 0.
- Bucle: al final el contador rebobina hasta 1 y la colonia vuelve a ser una sola bacteria, igual que el fotograma 0.
- Nada flota: las bacterias están sobre el agar de una placa de Petri, vista desde arriba, que se apoya en la mesa (con sombra de contacto).
- Más allá de 1.024 bacterias, la colonia se dibuja como un césped que va llenando la placa (no se pueden dibujar mil millones).
- Música: `MUS.pulso` original, a un tempo ajustado para que quepan compases enteros en 20 s.
