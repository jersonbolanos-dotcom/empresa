# Biblioteca de estilos del AI Style Atlas (Futurepedia) · para la plantilla Asombroteca

Material de referencia, no código para pegar tal cual en la plantilla.

- `comun/harness_H.js`: librería H (aleatoriedad con semilla, ruido, easing, texturas). Es la misma en los 15 estilos.
- `comun/sound_kit.js`: kit de efectos de sonido sintetizados (Web Audio). Igual en los 15.
- `comun/PROMPT_ORIGINAL_DEL_ATLAS.txt`: las instrucciones originales del Atlas (en inglés).
- `estilos/NN_nombre/STYLE_CARD.txt`: la ficha del estilo (aspecto, movimiento y cómo explica).
- `estilos/NN_nombre/referencia.js`: el código de la animación de ejemplo («¿Cómo aprende la IA?»), 1280×720 horizontal.
- `muestra_15_estilos.jpg`: un fotograma de cada estilo, renderizado con estos archivos.

Notas:
- El código venía pegado en un Word, que convirtió 87 trozos de `${...}` en ecuaciones. Se repararon; los 15 archivos
  pasan `node --check` y renderizan sin errores en Chromium.
- Origen: futurepedia.io/resources/ai-style-atlas («© Futurepedia LLC. All rights reserved»; sin licencia explícita).
  Uso: aprender técnicas y escribir nuestras propias versiones. No copiar los archivos tal cual dentro de la plantilla
  ni incluirlos en un kit que se venda.
