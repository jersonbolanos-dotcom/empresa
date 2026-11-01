# QC · ASOMBROTECA_MICROONDAS_V1.mp4

| Prueba | Resultado |
|---|---|
| ffprobe | H.264 1080×1920 a 30/1 fps (yuv420p). AAC 48 kHz estéreo 256 kb/s. 83,913 s (voz de 82,913 s más 1 s de cola). 65,1 MB. Detalle en `ffprobe.txt`. |
| Render | 2518 fotogramas en 122 s, sin errores de página (`render.log`). |
| Decodificación completa | OK. |
| blackdetect (0,3 s) y freezedetect (3 s) | Sin detecciones. |
| Sonoridad | I = −14,7 LUFS, pico verdadero −1,0 dBFS. La música se reduce con sidechain cuando suena la voz. |
| Voz | md5 6de15416… idéntico al archivo recibido. No se alteró: solo se pasó a estéreo y se añadió 1 s de silencio al final. |
| Subtítulos | 49 frases (≤2 líneas) en estilo «barra»: blanco, barra amarilla animada, palabras clave en amarillo, franja segura inferior (y ≈ 1520). El SRT está en `06_SUBTITULOS/`. |
| Determinismo | md5 idénticos en dos páginas y en orden distinto (`determinismo.txt`). |
| Compatibilidad de la plantilla v1.2 | El episodio del submarino da los mismos md5 de fotograma que antes del cambio. |
| Revisión visual | Hoja de contacto de 24 instantes (`hoja_contacto.jpg`). Se corrigieron estos problemas: ondas que se veían como rayos blancos sobre el interior iluminado (ahora cintas azules en modo normal); reflejo de la mesada en forma de caja; franja vacía bajo la mesada; malla de la ventana a escala gigante en los acercamientos; botón INICIO que se veía transparente al pulsarlo; ✗ del mito que seguía en la explicación correcta; rótulos encimados («Profundidad» y «Conducción», «Calor sin fuego» y «Ondas»); moléculas pequeñas y amontonadas. |
