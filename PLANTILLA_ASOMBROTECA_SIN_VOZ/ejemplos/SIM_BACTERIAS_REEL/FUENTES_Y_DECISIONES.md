# Fuentes y decisiones · ¿Llenarán el círculo antes del final?

Formato: `rebote` · Plantilla Asombroteca SIN_VOZ 2.0 · 35 s.

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Una *E. coli* puede dividirse cada 20 minutos.» | En condiciones óptimas de laboratorio (caldo LB, 37 °C), el tiempo de duplicación de *Escherichia coli* es de unos 20 minutos | Sezonov, G., Joseleau-Petit, D. y D'Ari, R. (2007), «Escherichia coli physiology in Luria-Bertani broth», *Journal of Bacteriology* 189(23): 8746-8749 |

## Decisiones

- **Proceso**: una bola rebota dentro de un círculo. Al tocar el borde, si han pasado al menos `tDiv` = 3,2 s desde su última división, se divide en dos hijas que se reparten su área (radio ÷ √2). Así parte de una bola grande (r = 40) y llega a 600 bolas de r = 13. Los choques entre bolas son elásticos y con masa proporcional al área (`SIM.rebote`, 240 Hz, `H.rng(7)`).
- **Ciencia escondida**: como en una bacteria, cada individuo se divide por su cuenta tras su tiempo de generación. El ritmo de divisiones crece con el número de bolas, así que el crecimiento es exponencial hasta que falta espacio.
- **Final incierto**: `tDiv` está ajustado en Chromium para que el círculo se llene (600 bolas) a los 33,5 s, justo antes del final; con valores cercanos se queda sin llenar. Después todo se contrae en la bola inicial, que es el fotograma 0 (bucle).
- **Arranque**: la bola grande sale del borde con un «toc» fuerte en el fotograma 0, con estela, y la primera división llega a los 0,8 s.
- **Sonido** (de los eventos):
  - borde: madera, más aguda cuanto más rápida y más pequeña es la bola;
  - choques entre bolas: tic suave;
  - cada nacimiento: una gota que sube de tono con el número de bolas;
  - al llenarse: un acorde de campana.
  - Sin música.
- **Nada flota**: no hay gravedad (es un plano visto desde arriba). Las bolas solo se mueven por inercia, rebotes y choques.
- El parecido con las bacterias es una analogía: la simulación no reproduce su biología, solo la regla «cada individuo se divide tras un tiempo».
