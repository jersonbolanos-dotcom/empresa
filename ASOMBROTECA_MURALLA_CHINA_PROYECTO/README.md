# ASOMBROTECA · ¿Cómo construyeron la Gran Muralla China sin maquinaria moderna?

- **Video final (V2):** `07_OUTPUT/ASOMBROTECA_GRAN_MURALLA_FINAL.mp4` (1080×1920, 30 fps, 114,7 s, 86,1 MB). Miniatura en `07_OUTPUT/miniatura.jpg`.
- **Respaldo V1:** `07_OUTPUT/V1/`, `05_AUDIO/V1/`, `07_QC/V1/` y `04_CODIGO/V1_respaldo/`.
- **Corrección geométrica (v1.14.2):** terreno, muros y torres forman un único sistema (tramos que terminan en las torres, puertas al nivel del adarve, peldaños en las pendientes, bases sobre el terreno, sombras según el sol).
- **Revisión final (V2):** muralla y torres con volumen (adarve, almenas 2,5D, sombras, cimiento, torres integradas con puertas y pabellón); personajes proporcionados que caminan sin patinar; compactación golpe a golpe con indicador claro; épocas diferenciadas; mapas grandes con cámara; cortes con materiales; transporte por curvas de nivel; vigilancia en 4 pasos con línea de visión; paralaje.
- **Base:** `PLANTILLA_ASOMBROTECA` v1.14.2. Este episodio añadió:
  - cordilleras con cresta (`ranges`);
  - la muralla que sigue el terreno (`wallPath`);
  - torres con humo o fuego (`watchtower`);
  - tierra apisonada animada (`rammedEarth`);
  - el corte Ming (`mingSection`);
  - el mapa del norte de China por periodos (`chinaMap`, `mapWall`, `CNWALLS`);
  - porteadores, carro de bueyes, animal de carga y trabajadores con ropa variada;
  - polvo y 7 FX nuevos.
- **Arco (19 escenas):**
  1. Muralla sobre las crestas.
  2. Constructores.
  3. Ingeniería, materiales y trabajo.
  4. No se construyó de una sola vez.
  5. Más de 2.000 años.
  6. Tierra, piedra y ladrillo.
  7. Moldes.
  8. Compactación.
  9. Tierra apisonada.
  10. Piedra local.
  11. Ming.
  12. ¿Cómo subían los materiales?
  13. Carros, animales y personas.
  14. Pendientes.
  15. Torres y señales.
  16. Generaciones.
  17. No fue una sola muralla.
  18. Obra de muchas generaciones.
  19. Asombroteca.
- **Reconstruir:** desde `04_CODIGO`, ejecuta `python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py` y luego `node ../../PLANTILLA_ASOMBROTECA/tools/render.js index.html <carpeta> 6`.
