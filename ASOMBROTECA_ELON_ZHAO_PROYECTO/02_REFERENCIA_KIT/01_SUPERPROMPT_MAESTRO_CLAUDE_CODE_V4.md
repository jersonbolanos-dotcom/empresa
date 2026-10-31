# ASOMBROTECA STUDIO — SUPERPROMPT MAESTRO V4
## EPISODIO: ELON MUSK vs CHANGPENG ZHAO / BINANCE / SPACE X
### Estética obligatoria: AI STYLE ATLAS / POPULAR EXPLAINER LOOKS / EDITORIAL ESSAY COLLAGE

**ORDEN DE TRABAJO**: ejecuta sobre los archivos del ZIP. Tu trabajo es construir una pieza audiovisual de primera calidad, no dar consejos. Primer hito: STORYBOARD VISUAL HTML (8–12 viñetas), con cuadros Canvas ya tratados con el look de la plantilla, tiempos basados en el audio y una lista de fuentes/activos; detente por la aprobación del storyboard si el usuario aún no la ha dado. Tras la aprobación, ejecuta render y control de calidad. No pidas de nuevo el guion; está bloqueado en `02_GUION_APROBADO_NO_MODIFICAR.txt`.

# 1. OBJETIVO EDITORIAL

Presentar una historia reciente sobre un intercambio público en X entre Elon Musk y Changpeng Zhao. El conflicto no debe quedarse en un conjunto de rostros y cifras: debe mostrar causa y consecuencia en este orden: (a) robo multimillonario a Binance, (b) dudas públicas por una comparación con FTX, (c) reacciones con emojis de Musk, (d) respuesta de Zhao pidiendo detener las burlas, (e) recordatorio de la inversión de US$500 millones en la adquisición de Twitter, (f) vínculo posterior con acciones de SpaceX valoradas por Zhao en más de US$1.000 millones, (g) aclaración de Binance sobre no necesitar venderlas, (h) contraste final entre bromas y dinero real.

No es una película sobre un chip de inteligencia artificial. NO copies gatos, perros, sala de mainframe, mapa de Ithaca, network de aprendizaje ni 97 % del ejemplo; tampoco clones las tarjetas como una decoración fija. Copia técnicas, gramática visual, textura, sonido y movimiento, nunca el tema de la demo.

# 2. NARRACIÓN BLOQUEADA Y TIEMPO

El guion autorizado es exclusivamente el texto del archivo `02_GUION_APROBADO_NO_MODIFICAR.txt`. No reescribas, acortes, amplíes, sustituyas ni traduzcas frases. No inventes citas. Si el archivo de voz está presente en `01_ENTRADA/audio/`, úsalo sin sintetizar ni modificar la voz: ni tono, velocidad, timbre, compresión destructiva ni eliminación de silencios naturales. Si no está, deja el proyecto preparado y sincroniza al recibirlo; no generes voz artificial. La duración REAL se mide con `ffprobe` sobre el audio, no se impone la duración de 15 s de la plantilla, ni una estimación de 60 s.

Obten transcripción con timestamps de palabras/frases; contrasta manualmente con guion bloqueado; si hay divergencia entre audio y guion, informa y usa el audio como master temporal sin inventar narración. Mantén las palabras habladas y el subtítulo exactamente sincronizados. `DURATION = duración_audio + cola_visual_pequeña`, salvo indicación distinta.

Formato final nativo 1080x1920, 9:16, 30 fps, 48 kHz estéreo, MP4 H.264 y AAC compatible. No renderices 1280x720 para luego recortar. La librería original usa 1280x720; modifica la arquitectura de viewport, cámara, tipografía y coordenadas para vertical de forma explícita, conservando sus métodos.

# 3. REGLA PRINCIPAL APRENDIDA DEL VIDEO ANTERIOR

La versión anterior de Binance demostró buen movimiento, pero repitió una placa/objeto central aunque la explicación cambiaba. EN ESTE EPISODIO ESTÁ PROHIBIDO convertir un recuadro genérico, rostro, papel o logo en protagonista inmóvil a lo largo de todo el video. Cada objeto DEBE representar un referente específico, y debe cambiar cuando la frase cambie de referente. Cada beat tendrá protagonista, comportamiento, función narrativa, persistencia justificada y una transición motivada. No camufles falta de significado con zooms, parallax y adornos.

Fotografías auténticas de Elon Musk, Changpeng Zhao y, opcionalmente, Yi He son preferibles. Buscar imágenes de uso apropiado para publicación (licencia, atribución/permiso según el recurso); registrar fuente y licencia. NO crear fotografías ficticias haciéndolas pasar por eventos reales. No usar caras genéricas. Si no se obtiene foto usable: emblema, recorte tipográfico y nombre explícito; no dibujes falsos retratos identificables. Las fotografías deben conservar identidad y rasgos y pasar por medio-tono/tramado duotono del código original, recorte blanco irregular, sombra papel y cinta adhesiva con bordes fibrosos. La edición estética no debe sugerir endorsement.

Al hablar de X, tweets y respuestas, prioriza capturas auténticas de publicaciones cuya URL, fecha, autor y texto hayan sido comprobados. Si el acceso a X no permite recuperarlas, recrea un *extracto editorial* tipográfico sobre papel con rótulo explícito 'EXTRACTO / RECONSTRUCCIÓN TIPOGRÁFICA', NO imites una captura real falsa con avatar, timestamp y verificaciones inventados. No inventes hashtags, números de likes, interacciones, fechas exactas ni emojis distintos de los documentados. En el intercambio, distingue la respuesta con emoji de mueca a comparación con FTX y otros emojis reportados en publicaciones separadas; NO fusionar automáticamente conversaciones no idénticas. Cuando el guion dice 'se burló', toma en cuenta que es interpretación de Zhao y de los medios sobre el tono de Musk.

# 4. MOTOR ESTÉTICO QUE SE DEBE MANTENER DE AI STYLE ATLAS

Look: papel kraft y marfil cálido, fibra orgánica, superficie envejecida, impresiones de archivo con trama halftone y bordes blancos desgarrados, sombreado de papel realista, columnas tipográficas de periódico con serif, números gruesos en tiras recortadas, amarillo marcador translúcido, círculo y tachón con rotulador rojo, cinta de enmascarar, bloques planos y flechas de tinta.

Técnicas obligatorias de la fuente suministrada: `H.rng`, `H.makeNoise`, seeded deterministic drawing; `edgePoly`, `sprite`, `drawSpr`, `shadowFill`, `fibre`, `texture`, `grainTiles`, `treat`, `makePrint`, `makeStrip`, `makeClipping`, `hilite`, `tape`, `partial`, `marker`, `loopPts`, `inkArrow`, `place`, `arrive`, `putSpr`, `bgPaper`, `block`, `finish`, `q12`, y lógica de whips/parallax. Si el código original exacto está disponible, preserva sus funciones relevantes y extiéndelas, sin reemplazar todo por HTML/CSS plano ni por un slide deck. Sus objetos de gato/perro/mainframe son demostrativos y DEBEN quitarse de la narrativa, no de las bibliotecas genéricas.

Fuentes: Anton (titulares), Libre Baskerville (citas/recortes periodísticos), Oswald (rótulos/metadata), pre-cargadas antes de capturar frames. Usa fuentes empaquetadas/precargadas apropiadamente para render offline. Paleta de base: PAPER #F0E9D9, KRAFT #C9A878, INK #1A1816, RED #B8483A, CARD #F5F1E7, NEWS #E9E1CB. Binance #F0B90B solo en logotipo/contexto correspondiente; X negro/blanco; verde/azul para comparación de magnitudes solo cuando ayude. La plantilla es editorial de papel: evita neón espacial, glitch continuo, cristal genérico o chips futuristas no motivados.

Cámara: fondo y recortes con parallax 2.5D, cámara continua suave entre contenidos relacionados, whip blur 0.2–0.4 s para cortes editoriales necesarios, hojas que deslizan y reemplazan secciones, animación de recortes a 12 fps escalonados y cámara a 30 fps. No hagas cortes cada 1 s de manera automática. Repite la gramática visual, no los mismos objetos ni el mismo layout.

# 5. STORYBOARD VISUAL — DIRECCIÓN PRELIMINAR (AJUSTA LOS TIEMPOS AL AUDIO REAL)

01 — HOOK: 'Elon Musk se burló ...' Dos fotografías reales recortadas de Musk y Zhao enfrentadas; papel de periódico, rasgadura, titular 'MUSK vs BINANCE', símbolo de Binance. Un gran `US$1.000 MILLONES` se insinúa en capas detrás y se oculta; no revelar todo. Fotos con movimientos diferenciales, no retratos flotantes genéricos. Primer estímulo concreto dentro de 0.5 s.

02 — ATAQUE: 'Binance sufrió un ataque ...' Inserto de titular verificado de hack y fecha. El nombre BINANCE se marca con subrayador; cifra `+US$6.000 MILLONES` (porque el guion dice 'más de seis mil'). Tiras de valor recortado, no una bóveda física sin pertinencia. La cámara atraviesa el recorte y entra a una ilustración editorial de exchange/billetera; sin dar a entender que los billetes físicos fueron trasladados.

03 — PARALELO FTX: sobre una mesa de pruebas cae una noticia auténtica de FTX 2022. Dos titulares diferenciados BINANCE / FTX unidos por línea de tinta de comparación, nunca usar signo = ni insinuar que Binance quebró. Texto 'COMPARACIÓN EN X', no 'MISMA SITUACIÓN'.

04 — EMOJIS: la cámara se desliza hacia el extracto verificado de la reacción de Musk, anotación roja que rodea un emoji de mueca; en otro recorte, si verificado, emojis de risa y fuego. Cada mensaje real en tarjeta correspondiente. Texto: 'REACCIONES EN X'. Sonido papel, click seco, silencio breve; no montaje engañoso de respuestas de distintos hilos.

05 — ZHAO RESPONDE: fotografía real de Zhao entra de detrás de una hoja y releva a Musk en el foco. Su respuesta se compone como cita atribuida y fragmentada al ritmo de la voz, resaltando `BAD TIME TO TROLL` / `PLEASE STOP`. Puedes traducir de manera contextual al español, sin atribuir como literal en español si difiere del original. Retrato y mensaje interactúan: el papel de Zhao desplaza la tarjeta previa de Musk. Una sola cita en pantalla, legible.

06 — REVELACIÓN 500M: 'había invertido quinientos millones...' Un documento de acuerdo/inversión conceptual vincula BINANCE → Twitter (2022). Una tira tipográfica `US$500 MILLONES` se revela al desdoblar un papel; una flecha de tinta une logos fieles de Binance y Twitter histórico. No muestres que alguien entregó maletines; es una inversión corporativa.

07 — LA TRANSFORMACIÓN: 'vinculada a acciones de SpaceX...' La cámara sigue el mismo papel de inversión (persistencia justificada) que se dobla/rota y revela `SPCX / SpaceX` y `> US$1.000 MILLONES`, atribuida a 'VALORACIÓN SEGÚN ZHAO'. El signo + o duplicación visual no debe interpretarse como plusvalía realizada en efectivo. No presentar la cifra como auditoría verificada ni mostrar una venta realizada.

08 — NO HACE FALTA VENDER: Yi He puede aparecer con foto auténtica si se obtiene; si no, nota empresarial sin retrato. Tira `NO NECESITAN VENDER` destacada; símbolo de venta tachado sobre representación de acciones. Dinero para cubrir pérdidas separado de valoración no líquida. No inventar estados financieros.

09 — CIERRE/CONTEXTO: mosaico de tres recortes MOTIVO / RESPUESTA / INVERSIÓN: reacción de Musk, petición de Zhao, cifras 500M y >1B. Ritmo de prensa: el papel de 500M crece para revelar 1B; cámara retrocede y ambas figuras quedan enfrentadas editorialmente. Pregunta final `'¿TÚ DE QUÉ LADO ESTÁS?'` en gran titular, sin afirmar culpabilidad ni generar odio. Cierre `ASOMBROTECA` pequeño discreto, sin logo o marca de agua.

Si el audio requiere 10–12 beats, divide los momentos, pero nunca rellenes con escenas de relleno, fotos permanentes, texto genérico o una única tarjeta que no cambia. Para cada beat del storyboard: tiempo inicial/final real, palabras exactas del audio, objetivo semántico, objeto protagonista, cambio concreto, referencia original de la plantilla aplicada, transición explicada, subtítulo/copy y FX. Muestra en `storyboard.html` una cuadrícula real de Canvas con fotogramas tratados con las funciones de la plantilla, no un listado de párrafos ni cajas vacías. Bajo la cuadrícula registra hechos no confirmados y licencias de materiales.

# 6. DISEÑO DE MOVIMIENTO — REGLAS DE CALIDAD

- El espectador debe reconocer quién habla, a qué publicación se refiere y qué significa cada cifra sin audio.
- Variar escala y encuadre: retrato con recorte, evidencia documental, comparación de recortes, número expansivo, esquema de inversión. NO todas las escenas con 2 fotos lado a lado.
- Un objeto solo persiste entre beats si conserva una función de continuidad: por ejemplo, el mismo documento de inversión que se transforma de Twitter en la referencia a SpaceX.
- Usar transiciones semánticas: pliegue de hoja para cambiar de autor, subrayador para evidenciar una frase, círculo rojo para destacar emoji, whip blur solo cuando hay cambio real de argumento.
- El movimiento a 12fps solo aplica al recorte manual; cámara continua a 30fps para cinematografía premium. Mantener sensación material, sin brusquedad accidental.
- Nada de imágenes pixeladas, caras deformadas, fotos con estiramiento o recortes que corten mentones/cabezas. No ocultar ojos con subtítulos.
- Máximo una idea visual dominante y un detalle secundario en cada beat. Evitar repetir locución en pantalla como grandes títulos y subtítulos al mismo tiempo.
- Titulares compactos con jerarquía; en vertical, tamaño de palabra clave orientativo 70–130px según espacio, etiquetas esenciales 36–52px, cifras 120–210px. Ajusta a la legibilidad real y prueba al tamaño de teléfono.
- Subtítulos blancos sin caja, subrayado amarillo selectivo, no texto arcoíris; posición segura para TikTok/Reels/Shorts. Evitar zona inferior ocupada por controles; usar un safe area conservador y comprobar con fotogramas exportados.
- La marca `ASOMBROTECA` puede estar discretamente 1 vez en el cierre; ningún isotipo, logo adicional o CTA invasivo.

# 7. FOTOGRAFÍAS Y DOCUMENTOS REALES — BÚSQUEDA Y TRAZABILIDAD

Crea `assets_manifest.csv`: filename, persona/entidad, URL, fecha_acceso, licencia_permisos, uso_escena, fuente_verificada. Prioridades: (1) fotos autorizadas de Musk y Zhao, (2) screenshots originales exactos de X (no montaje que suplante), (3) logos correctos de Binance, Twitter 2022, X y SpaceX, (4) captura/recorte noticioso con licencia apropiada o recreación editorial explícitamente rotulada. Si no hay conexión a internet, NO finjas haber descargado recursos: entrega lista de pendientes y coloca placeholders técnicos claramente etiquetados para reemplazo antes de exportar definitivo. No utilices fotos compradas sin licencia, watermark, fotografías sintéticas engañosas ni credenciales de otros usuarios.

Se puede animar un retrato en parallax separando papel, foto, borde, sombra, cinta y marcador. NO animar bocas de personas reales para simular que pronuncian el texto, ni inventar gestos que den a entender un evento documental falso.

# 8. SONIDO ORIGINAL Y MEZCLA

Conserva íntegramente `lib/sound.js` y úsalo para sonidos de papel, lápiz, marcador, cinta, highlight, desplazamientos, subrayados, clicks y golpes de cifras. Separa stems: `voz_original.wav/mp3` (intacta), `sfx.wav` (SOUND), `musica_original.wav` (ambiente propio). El `SOUND` original desactiva k.music y k.bed cuando `voiceover:true`: por eso NO supongas que con ese flag habrá música. Si produces banda completa con `voiceover:false`, mezcla después con ducking bajo la voz y limita efectos dominantes. Alternativamente, produce efectos con voiceover:true y una pista musical adicional independiente. Jamás reemplazar o sintetizar la voz. Transiciones, marcadores y recortes deben oírse en el frame exacto de su aparición. Respeta pausas en la narración.

Música propia, ambiente editorial de investigación con pulso comedido; no música ajena protegida. Monitorear picos, inteligibilidad y ausencia de clipping. Prueba con auriculares y altavoz de teléfono. Entrega pistas separadas y mezcla final. No uses voz IA extra.

# 9. IMPLEMENTACIÓN TÉCNICA

Usa `lib/harness.js` y `lib/sound.js` provistos, y el SOURCE del estilo Editorial Essay Collage que el usuario aportó. Conserva su ADN visual y funciones donde corresponda. Si solo hay la guía de estilo pero no `editorial-collage.js` original, registra explícitamente esta limitación; nunca afirmes que copiaste el código completo. Diseña arquitectura modular `scene_*.js`, sprites/collage reutilizables y parámetros de tiempo. El renderer debe ser determinista: `window.seek(t)` debe dar mismos píxeles para el mismo t; toda variación con semillas. Precachear texturas para evitar recalcular fibre/halftone cada frame; precargar todas las fotos antes de exportar.

Jugador local HTML con play/pause, scrub, mute, loop opcional y contador. `window.seek(t)` `window.DURATION` `window.scoreSound` exponer en window. Font loading: await document.fonts.load para Anton, Oswald, Libre Baskerville. Exportar headless Chromium/Puppeteer capturando cada frame `i/30`, audio 48kHz, mezclar con FFmpeg conservando voz. Verificar cola final, fps, resolución y codec con ffprobe.

A diferencia del ejemplo original 1280x720, la escena nativa vertical debe tener coord centradas en 540x960 y un sistema de profundidad adaptado. El formato 9:16 no es letterbox ni crop. Animar continuamente sin espacios negros ni elementos fuera de escena por errores de composición. Cada transición debe tener frames válidos en todos sus instantes.

# 10. VERIFICACIÓN FACTUAL ANTES DE PUBLICAR

A fecha 31/oct/2026, los reportes situaban el robo en torno a US$6.300 millones; el guion dice 'más de seis mil millones'. Zhao escribió en X que las acciones SPCX ligadas a la inversión de US$500 millones para la adquisición de Twitter valían más de US$1.000 millones. Estas últimas cifras son SU AFIRMACIÓN, no valoración auditada independientemente. Diferenciar eso en texto visual. El mensaje de Musk con emoji de mueca fue en una comparación de Binance con FTX; otros emojis informados pertenecen a reacciones distintas. Mantén el guion bloqueado, pero evita narrativas visuales falsas: no pongas un post inexistente como si fuera una captura auténtica, ni sugieras que hubo venta de acciones. Los fondos robados, congelados y repuestos no son equivalentes. Si aparece algún dato no verificado, no lo conviertas en una animación factual; indica pendiente y solicita fuente pertinente.

# 11. QA Y ENTREGA

Antes de declarar terminada la producción:
1. Validar `guion_original` exacto y voz no alterada comparando duración/forma de onda cuando exista.
2. Generar storyboard visual y contact sheet de inicio, medio, cierre de cada beat.
3. Inspeccionar fotogramas para errores de caras, materiales, recortes, orden de capas, logos, texto ilegible, superposiciones y errores de continuidad.
4. Pasar por voz a 0.5x y comprobar cada revelación con frase específica y cada subtítulo.
5. Controlar licencias de fotografías y capturas; entregar manifiesto.
6. Verificar que no quedan gatos, perros, mainframe, 97% ni accesorios del demo por defecto.
7. Confirmar que no hay placa negra central persistente ni una sola tarjeta reutilizada para todo.
8. Verificar code-path de cada función, determinismo de `window.seek`, eficiencia render y que el audio no se desincroniza.
9. Comprobar con `ffmpeg -v error -i final.mp4 -f null -` y `ffprobe`; documentar resultado real.
10. Exportar `FINAL_ASOMBROTECA_ELON_ZHAO_1080x1920.mp4`, proyecto fuente editable, `storyboard.html`, `assets_manifest.csv`, `subtitulos.srt`, stems WAV y breve `QA.md`.

**CRITERIO DE APROBACIÓN:** no es suficiente que el video esté en constante movimiento. Debe ser semánticamente preciso, reconocible por imágenes auténticas, legible en móvil y conservar el tacto de *Editorial Essay Collage*. Que el espectador vea claramente quién reaccionó, quién contestó y por qué el valor de la inversión es la revelación central.
