# Ejemplo de uso

El episodio de referencia completo está en `ASOMBROTECA_SUBMARINO_PROYECTO/V3_PLANTILLA/04_CODIGO/`:

| Archivo | Contenido |
|---|---|
| `index.src.html` | Reproductor. Inserta los fuentes, `lib/`, el motor de esta plantilla, `js/datos.js` y `js/episodio.js`. |
| `js/episodio.js` | Tabla `T` de tiempos de la voz, 11 beats con `draw` y `sfx`, palabras clave, música y ambiente. |
| `tools/build.py` | Genera `index.html` autocontenido, con la voz en base64. |

Para un video nuevo:
1. Copia esa carpeta.
2. Cambia la voz y `js/datos.js`.
3. Reescribe los beats de `js/episodio.js`.

El motor (`../motor/plantilla.js`) no se toca: se comparte entre episodios.
