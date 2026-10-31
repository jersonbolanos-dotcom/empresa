# QC · ASOMBROTECA_HELICOPTERO_AUTORROTACION_FINAL.mp4

| Prueba | Resultado | Estado |
|---|---|---|
| `node --check` de los JS y consola del navegador | Sin errores (`render_log*.txt`) | PASS |
| Fuentes Fredoka y Nunito incrustadas (OFL), sin Internet | Cargadas antes del primer fotograma | PASS |
| Determinismo de `seek(t)` | Mismo MD5 en t = 5,3 / 17,9 / 41 s, también en orden distinto (`determinismo.txt`) | PASS |
| Formato | H.264 High, 1080×1920, yuv420p, 30 fps CFR, 1910 fotogramas decodificados, 63,67 s; AAC estéreo 48 kHz; moov al inicio; 42 MB | PASS |
| Decodificación completa | 0 errores | PASS |
| Fotogramas negros o congelados | Ninguno | PASS |
| Voz | SHA-256 idéntico al archivo subido; 62,668 s completos más 1 s de cola | PASS |
| Guion | Texto alineado == guion aprobado (True) | PASS |
| Mezcla | −14,6 LUFS, pico −1,1 dBFS. Música y efectos en stems aparte | PASS |
| Keyframes revisados | 30 capturas del MP4 (`contacto.png`): vuelo, falla, trayectorias, rueda libre, autorrotación, colectivo, flujo ascendente, energía, flare, límites y cierre | PASS |
| Flechas de aire | Hacia arriba solo durante la autorrotación; el rotor nunca se detiene en vuelo | PASS |
| Evolución del protagonista | helicóptero → tren de potencia → disco del rotor → perfil de pala → helicóptero en descenso → cadena de energía → aterrizaje | PASS |
| Subtítulos | 34 bloques, ≤2 líneas, blancos sin caja, barra amarilla en la palabra activa. Se corrigieron solapes de rótulos con los subtítulos y con los indicadores | PASS |
| Sin logo de Asombroteca | Solo el texto final | PASS |
| Escucha humana en teléfono | No realizada | PENDIENTE |
| Alineación por palabra | Por pausas y sílabas (unos ±0,25 s en palabras interiores) | Límite conocido |
