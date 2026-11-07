# Ejemplo · demo de la plantilla v1.26 («¿Por qué el café te quita el sueño?»)

Vídeo de 39 s hecho con las herramientas y bloques nuevos: 3D de producto (taza torneada con sombra), personajes con cara,
metáfora llave/cerradura, plano técnico con HUD, barras y reloj, subtítulos «ios» con iconos y el cierre «Envíaselo a ese amigo…».
La voz es sintética (Kokoro, Apache 2.0) porque es solo una demostración; en un vídeo real se usa la voz original.

Verlo (desde esta carpeta):
```
python3 ../tools/producir.py . build      # crea 04_CODIGO/index.html con reproductor
python3 ../tools/producir.py . render     # (opcional) genera 07_OUTPUT/ejemplo_demo_v126_FINAL.mp4
```
El código de las escenas está en `04_CODIGO/js/episodio.js` y es el mejor punto de partida para aprender los bloques nuevos.
Datos: la cafeína bloquea los receptores de adenosina (A1/A2A) sin activarlos; su vida media en adultos ronda las 5 horas
(varía entre 3 y 10 h según la persona).
