# QA · versión con fotos: FINAL_ASOMBROTECA_ELON_ZHAO_1080x1920_FOTOS.mp4

| Prueba (versión con fotos) | Resultado | Estado |
|---|---|---|
| Formato | H.264 High, 1080×1920, yuv420p, 30 fps, 1939 fotogramas, 64,63 s; AAC 48 kHz estéreo; moov al inicio; 80 MB (`ffprobe_FOTOS.txt`) | PASS |
| Decodificación completa | 0 errores | PASS |
| Fotogramas negros o congelados | Ninguno | PASS |
| Narración y mezcla | Pista de audio idéntica bit a bit a la versión anterior (mismo MD5) | PASS |
| Rostros reconocibles | 24 capturas del MP4 (`capturas_FOTOS/`, `contacto_FOTOS.png`): Musk en 0:00–0:08, 0:22–0:28, 0:44–0:52 y cierre; Zhao en 0:04–0:08, 0:27–0:40, 0:46–0:52 y cierre | PASS |
| Fotos que tapen subtítulos o información | No se observan en las capturas. Las miniaturas se movieron dos veces para no cortar la tira de 500M ni salirse del encuadre | PASS |
| Licencia de las fotos aportadas | Sin verificar | **PENDIENTE (usuario)** |

---

# QA · versión anterior: FINAL_ASOMBROTECA_ELON_ZHAO_1080x1920.mp4

Solo se anota lo que se ejecutó de verdad.

| Prueba | Resultado | Estado |
|---|---|---|
| Formato | H.264 High, 1080×1920, yuv420p, 30 fps, 1939 fotogramas decodificados, 64,63 s; AAC estéreo 48 kHz; moov al inicio | PASS |
| Decodificación completa (`ffmpeg -v error -f null -`) | 0 errores | PASS |
| Fotogramas negros o congelados (blackdetect, freezedetect ≥1,5 s) | Ninguno | PASS |
| Mezcla | −14,4 LUFS, pico −1,0 dBFS. Voz delante; música y efectos en stems aparte | PASS |
| Voz | SHA-256 idéntico al archivo subido; duración 63,634 s completa más 1 s de cola en silencio | PASS |
| Guion | Texto alineado == guion bloqueado (comprobación automática True) | PASS |
| Subtítulos | 38 bloques, ≤2 líneas, blancos con contorno de tinta y sin caja, subrayado amarillo en la palabra activa, franja en y≈1490 | PASS |
| Revisión visual | 35 capturas del MP4 (`contacto.png`) y storyboard. Se corrigieron: cifra demasiado ancha, tarjetas encima de los subtítulos, hueco vacío a 57 s, encuadres de la escena de SpaceX y de la de Yi He | PASS |
| Restos de la plantilla de ejemplo | No hay gatos, perros, mainframe ni 97 %, ni una placa persistente; cada escena tiene su propio recorte | PASS |
| Publicaciones | X-01 y X-02 separadas («otro hilo»); X-03 y X-04 como un mismo post que se despliega; X-05 rotulada como resumen | PASS |
| Determinismo | Render por `window.seek(i/30)` en 4 páginas en paralelo y tramos re-renderizados sin diferencias de continuidad visibles | PASS |
| Fotos reales de Musk y Zhao | No incluidas en esa versión (resuelto en la versión con fotos) | — |
| Escucha a 0,5× y en altavoz de teléfono | No realizada (sin escucha humana en el entorno) | PENDIENTE |
| Alineación por palabra | Por pausas y sílabas, sin reconocimiento de voz: unos ±0,25 s en palabras interiores | Límite conocido |
