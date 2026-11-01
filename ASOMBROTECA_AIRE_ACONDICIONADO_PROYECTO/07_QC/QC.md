# QC · ASOMBROTECA_AIRE_ACONDICIONADO_V1.mp4

| Prueba | Resultado |
|---|---|
| ffprobe | H.264 1080×1920, relación de aspecto 9:16, 30/1 fps constantes (r = avg = 30/1). AAC 48 kHz estéreo 256 kb/s. 87,988 s (voz de 86,988 s más 1 s de cierre). 64,6 MB. Detalle en `ffprobe.txt`. |
| Render | 2640 fotogramas en 89 s, sin errores de página (`render.log`). |
| Decodificación completa | OK. |
| blackdetect (0,3 s) / freezedetect (3 s) | Sin detecciones: no hay escenas negras ni congeladas. |
| Sonoridad | I = −14,3 LUFS, pico verdadero −1,4 dBFS. La música y los efectos bajan con sidechain cuando suena la voz (ducking). |
| Voz | md5 e13067c5… idéntico al archivo recibido. Sin cambios de velocidad, tono ni cortes. |
| Subtítulos | 54 frases en estilo «barra»: blanco, barra amarilla animada, palabras clave en amarillo, máximo dos líneas, franja segura inferior. El SRT está en `06_SUBTITULOS/`. |
| Determinismo | md5 idénticos en dos páginas y en orden distinto (`determinismo.txt`). |
| Revisión visual | Hoja de contacto de 28 instantes y 11 fotogramas de revisión (`fotogramas_revision/`) que cubren el gancho, el refrigerante, el evaporador, el aire, el compresor, el condensador, la expansión, el ciclo, la revelación y el cierre. |

**Correcciones hechas tras la primera revisión:**
- Franjas vacías por encima y por debajo del mundo: ahora el cielo, el suelo y el edificio cubren todo el encuadre.
- Deflector que se veía como un palo.
- Aire frío que parecía lluvia: ahora son trazadores más cortos y curvos.
- Etiquetas del ciclo completo encimadas: ahora hay insignias numeradas sobre cada componente y una leyenda en el cielo.
- Notas de presión tapando la unidad exterior.
