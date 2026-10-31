# QC · ASOMBROTECA_SUBMARINO_PLANTILLA_V3.mp4

| Prueba | Resultado |
|---|---|
| ffprobe | H.264 1080×1920 a 30 fps (yuv420p). AAC 48 kHz estéreo. 73,281 s. 87,5 MB. Detalle en `ffprobe.txt`. |
| Render | 2199 fotogramas en 64 s, sin errores de página (`render.log`). |
| Decodificación completa | OK. |
| blackdetect / freezedetect | Un solo tramo negro de 0,37 s (54,80–55,17 s). Es el fundido intencional antes de «129». Sin congelados. |
| Sonoridad | I = −14,8 LUFS, pico verdadero −1,1 dBFS. |
| Voz | Es la voz original de `01_ENTRADA/audio/` sin modificar. Solo se convirtió a estéreo y se añadió 1 s de silencio al final. |
| Determinismo | md5 idénticos en dos páginas y en orden distinto (`determinismo.txt`). |
| Revisión visual | En la `hoja_contacto.jpg` (22 instantes) se corrigieron: el bocadillo de alerta encima de «CIENTOS DE METROS», las etiquetas PESO, EMPUJE y AIRE COMPRIMIDO encimadas, la etiqueta VÁLVULA tapada por la ✗, el recuadro de palabra clave repetido en «necesita» y el tamaño de los iconos de las 129 personas. |
