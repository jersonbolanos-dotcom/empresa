# QC · V2 (ASOMBROTECA_HELICOPTERO_AUTORROTACION_V2.mp4)

| Prueba | Resultado | Estado |
|---|---|---|
| Formato | H.264 High, 1080×1920, yuv420p, 30 fps, 1910 fotogramas decodificados, 63,67 s; AAC 48 kHz estéreo; moov al inicio; 44 MB (`ffprobe_V2.txt`) | PASS |
| Decodificación completa | 0 errores | PASS |
| Fotogramas negros o congelados | Ninguno | PASS |
| Audio | Pista idéntica bit a bit a la V1 (mismo MD5); voz con SHA-256 igual al original | PASS |
| Aterrizaje: 13 fotogramas de 43 a 49 s (`contacto_aterrizaje_V2.png`) | Aproximación → morro arriba (44,5–45,5) → nivelación (46–46,5) → colectivo arriba (47–47,5) → contacto (48,3) → asentado. Sin saltos; el rotor gira en todo momento | PASS |
| Escenas corregidas (`contacto_V2.png`) | Inicio con nubes y estelas, corte de potencia y sacudón; tres estados del tren de potencia; dos palas con «el disco no se inclina»; baja/aire con el disco del rotor | PASS |
| Sincronía | El aterrizaje sigue a las palabras («aprovechar», «amortiguar», «aterrizaje») y el golpe de patines del audio coincide con el contacto (48,3 s) | PASS |
| Errores JS durante el render | 0 | PASS |

---

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
