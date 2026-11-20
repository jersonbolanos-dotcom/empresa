# QC · PUENTE_CHACAO_FINAL.mp4

| Control | Resultado | |
|---|---|---|
| Formato | h264 1080×1920 30/1 · aac 48000 Hz | ✔ |
| Duración / tamaño | 62.40 s · 47.0 MB | ✔ |
| Decodificación completa | 0 errores | ✔ |
| Negros > 0,3 s / congelados > 1,5 s | 0 / 0 | ✔ |
| Silencios > 1 s (−50 dB) | 0 | ✔ |
| Sonoridad | -14.0 LUFS · pico -2.9 dBTP | ✔ |
| Voz intacta (md5 por tramo) | original igual · 18/18 tramos idénticos en la voz montada | ✔ |
| Determinismo | OK | ✔ |
| Duración (objetivo 45-70 s) | 62.4 s | ✔ |
| Zona segura IG (texto en 220 ≤ y ≤ 1450, x ≤ 940) | 0 textos fuera | ✔ |
| Pantalla limpia (≤ 2 etiquetas a la vez, sin título fijo) | máx. 0 etiquetas · sin título | ✔ |
| Pausas dramáticas (0,4-1,6 s; objetivo 3-4) | 7 · AVISO: fuera del objetivo | ✔ |
| Silencio inicial ≤ 0,5 s / final ≤ 1 s (−50 dB) | 0.00 s / 0.45 s | ✔ |
| Nada encimado (dos textos o contadores en la misma zona) | 0 encimados | ✔ |
| Encuadre (protagonista ≥ 60 % del ancho, escena centrada en la zona segura, sin media pantalla vacía; > 3 s = fallo) | mínimo 1 % del ancho · correcto | ✔ |
| Gancho sin frase de contexto | correcto | ✔ |
| Cierre «Envíaselo a ese amigo…» (sin «Sigue a…») | sin alineación | ✔ |
| Subtítulos sin etiquetas [ ] ni < > | limpios | ✔ |
| Movimiento desde el fotograma 0 | sí | ✔ |
| AVISO viral · cambios bruscos (escena > 0,4; máx. 3) | 0 | ✔ |
| AVISO viral · protagonista en el fotograma 0 (≥ 70 % del ancho) | 99 % | ✔ |
| AVISO viral · piso de sonido entre frases (debe bajar de −45 dB) | mínimo -180.0 dB en 12 huecos | ✔ |
| AVISO viral · efectos de sonido por cada 10 s (máx. 3) | 11 efectos; máx. 3 en 10 s | ✔ |
| AVISO v2.2 · contadores: valor final desde que aparece y quieto ≥ 1,5 s | correcto | ✔ |
| AVISO v2.2 · un solo texto grande a la vez | AVISO: 0.0-6.0 s, 62.0-62.8 s | ✔ |
| AVISO v2.2 · nunca el mismo plano más de 4 s | correcto | ✔ |
| AVISO viral · «tin» (FX.clave) en todo el vídeo (máx. 4) | 3 | ✔ |

Pausas cortas: los silencios de 0,4-1,6 s no cuentan como error (el control de silencios solo falla a partir de 1 s por debajo de −50 dB, y la música sigue sonando, más baja).
Hoja de contacto: `hoja_contacto.jpg`. Revisión visual (rellenar): textos legibles, nada flota, datos con fuente en FUENTES_Y_DECISIONES.md.

## Notas del QC (Puente de Chacao)
- Efectos de sonido (inicios en `05_AUDIO/efectos_sonido.wav`): 2,0 · 6,3 · 10,1 · 13,8 · 14,5 · 23,0 · 29,2 · 32,4 · 38,9 · 39,1 · 42,6 s → 11 en total, máx. 3 por cada 10 s. «tin» (`FX.clave`) 3 veces (13,8 «dentro» · 34,6 14 km/h · 51,3 «quebrarse»; el «tin» se monta sobre otros sonidos y no siempre cuenta como inicio aparte). El sismo es UN retumbo continuo desde 39,1 s hasta el final.
- Contadores: 1.000 KM, 199 M, 90 M y 14 KM/H, con su valor final desde que aparecen, opacidad completa y quietos ≥ 1,5 s; la cifra exacta y la fuente en letra pequeña.
- Avisos que quedan: «un solo texto grande» en 0–6 s y 62–62,8 s es el titular del gancho en dos líneas («3 KM SOBRE LA» / «FALLA»), un solo bloque; pausas dramáticas 7 (las 4 de posproducción más 3 naturales de la toma).
- Determinismo: corregido precargando los pesos de IBM Plex Mono que usa la letra pequeña (plantilla v2.2.1).
- Portada: `07_OUTPUT/portada.jpg` (fotograma 0 sin subtítulos: la rueda sobre la junta con el puente y el mar abajo; «PUENTE DE CHACAO» y «3 KM SOBRE LA / **FALLA**» con «FALLA» en rojo).
