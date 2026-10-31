# QC · ASOMBROTECA_SUBMARINO_THRESHER_V1.mp4

| Prueba | Resultado |
|---|---|
| ffprobe | H.264 1080×1920, 30/1 fps, yuv420p · AAC 48 kHz estéreo 256 kb/s · 73,281 s · 94,2 MB (<100 MB de GitHub) — `ffprobe.txt` |
| Fotogramas | 2199 renderizados (`render.log`), 0 errores de página |
| Decodificación completa (`-f null`) | OK, sin errores |
| blackdetect (0,3 s) / freezedetect (3 s) | sin detecciones |
| Sonoridad (ebur128) | I = −14,8 LUFS · LRA 2,8 LU · pico verdadero −1,1 dBFS (limitador a 0,87) |
| Voz | `01_ENTRADA/audio/voz_original_submarino.mp3` idéntica al archivo recibido (md5 144b8020…aa09de); sólo se convierte a estéreo y se rellena con 1 s de silencio al final. Sin cortes, sin cambio de velocidad ni de tono |
| Determinismo | md5 idénticos en dos páginas y orden distinto — `determinismo.txt` |
| Subtítulos | 44 frases, ≤6 palabras, ≤2 líneas, blancos sin caja con barra amarilla bajo la palabra activa; el lema final sube a y≈1210 para no pisar el cajetín |
| Revisión visual | `hoja_contacto.jpg` (22 instantes) y `capturas/`; se corrigieron: etiquetas fuera de cuadro, rumbo cruzando el sello FALLA, rótulos sobre los subtítulos (tanques, cadena de fallos, presión), cajetín pisado por el subtítulo |

Límite conocido: a los 69–70 s, durante el retroceso de cámara, el subtítulo «Asombroteca.» pasa por encima de la nota SUBSAFE ya leída (≈1 s).
