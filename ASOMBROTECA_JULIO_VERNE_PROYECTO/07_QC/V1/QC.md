# QC · Episodio 04 · `07_OUTPUT/ASOMBROTECA_04_JULIO_VERNE_FINAL.mp4` (2026-11-02)

Solo se marca como superado lo que se ha probado.

## Pruebas técnicas — `qc_tecnico.txt`
| Prueba | Resultado |
|---|---|
| ffprobe | H.264 High 1080×1920 · 30/1 constante · 2722 fotogramas · AAC LC 48 kHz estéreo · 90,73 s · 59,7 MB |
| Decodificación completa | 0 errores |
| blackdetect / freezedetect / silencedetect | 0 / 0 / 0 |
| ebur128 | −14,1 LUFS · LRA 2,4 LU · pico −1,6 dB |
| md5 de la voz | `db27223bfaa6acbed5f489dc889453b7`, idéntico al original. Voz completa: duración del vídeo = voz + 1 s de cierre |
| Determinismo | 2 cargas en orden distinto: mismos md5 de fotograma |
| Retrocompatibilidad | La plantilla solo AÑADE bloques v1.22 y 2 efectos. Ningún bloque existente cambia y se comprobó antes que los nombres no existían |

## Revisión visual
- **Antes del render:** 3 rondas de fotogramas de prueba (33 + 12 + 2 + 6).
- **Hoja del MP4:** `hoja_contacto_mp4.jpg`, 26 fotogramas.
- **Tiras de movimiento del MP4** (5 fps, `movimiento_t*.jpg`): gancho, grabado, foto de Verne, grabado de Montaut, cañón, aceleración, foto de la tripulación, despegue, foto del Saturno V, comparación, trayectorias, foto de Aldrin, ficción/realidad y cierre.

**Corregido tras la revisión:**
- La Tierra salía pixelada; ahora se renderiza a mayor resolución.
- Varias cámaras quedaban demasiado lejos: viajeros, cañón y Saturno V.
- Había un libro duplicado.
- Una etiqueta se cortaba en el borde.
- Los textos de «FLORIDA · 3 VIAJEROS · LUNA» estaban mal espaciados.
- El grabado tapaba la cápsula; ahora va a la derecha.
- La foto de la tripulación cubría el cohete; el cohete se desplazó a la izquierda.
- El gancho era casi estático; ahora hay órbita y una Tierra que se aleja.
- La comparación final de ficción frente a realidad salía pobre.
- El rugido del despegue tapaba la voz; se bajó.

## Fotografías (comprobado en los fotogramas)
| # | Archivo | Momento | Etiqueta | Verificado |
|---|---|---|---|---|
| 1 | Julio Verne | Al nombrarlo | «JULIO VERNE · escritor francés (1828–1905)» | No se data en 1865 |
| 2 | Grabado de Montaut | «cápsula metálica» | «ILUSTRACIÓN HISTÓRICA · 1868 · Henri de Montaut · ficción» | Junto al modelo, sin taparlo |
| 3 | Tripulación | «Armstrong, Aldrin y Collins» | «ARMSTRONG · COLLINS · ALDRIN» | Coincide con el orden de la foto |
| 4 | Saturno V | «Saturno V» | «LANZAMIENTO REAL · 16 de julio de 1969» | — |
| 5 | Aldrin en la Luna | Alunizaje del Eagle | «BUZZ ALDRIN EN LA LUNA · junto al Eagle» | No se etiqueta como Armstrong |

En todas:
- tamaño entre el 35 % y el 54 % del ancho;
- entre 1,9 y 2,7 s en pantalla;
- entrada lateral con perspectiva y salida suave;
- por encima de la franja de subtítulos.

## Limitaciones
- **Figuras simplificadas:** el escritor del estudio y los viajeros son figuras genéricas e ilustrativas, no retratos.
- **Tierra estilizada:** los continentes no reproducen la geografía real.
- **Saturno V y torre:** son modelos simplificados; la torre es de celosía esquemática.
- **Separación de etapas:** no se representa; la narración no la menciona.
- **Fuentes en línea:** no se pudieron consultar desde la sesión.
