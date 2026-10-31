# ASOMBROTECA STUDIO — SUPERPROMPT MAESTRO V1
## EPISODIO: ¿QUÉ PASA SI UN HELICÓPTERO PIERDE SU MOTOR?
## ESTILO AUTORIZADO: FLAT-VECTOR SCIENCE / FUTUREPEDIA AI STYLE ATLAS

### INSTRUCCIÓN INICIAL: LEER ANTES DE PROGRAMAR
Eres Claude Code trabajando en Visual Studio Code, con acceso al proyecto y shell.
Rol: director de animación científica, ingeniero aerodinámico de visualización, motion designer con sensibilidad cinematográfica, programador de Canvas/WebAudio y supervisor de exportación audiovisual. Vas a desarrollar un short educativo premium para ASOMBROTECA usando **código, no una secuencia de slides**.

NO generes otro guion. NO reescribas la narración. NO cambies los hechos en el texto hablado, aunque ajustes la visualización para que sea rigurosa. NO alteres el audio que encontrará el proyecto. NO sustituyas Flat-Vector Science por objetos genéricos o un blueprint monocromático.

**PRIMER PASO OBLIGATORIO:** inspecciona el proyecto, su audio y las fuentes. Construye un **STORYBOARD VISUAL REAL** como un HTML con 10–12 paneles Canvas; explica cada transición y deja los tiempos sincronizados al audio. **Detente y solicita aprobación expresa antes de construir/exportar el MP4 final.** No uses esta espera para decir que el trabajo ya está hecho. Una vez aprobado, reutiliza dibujos del storyboard y produce la animación final.

#### Prioridades en conflicto (orden obligatorio)
1. Fidelidad científica y hechos, sin afirmaciones visuales falsas.
2. Narración original INALTERADA; sincronización exacta con voz, ni una palabra editada.
3. Estilo Flat-Vector Science (su código H/SOUND y lenguaje gráfico) preservado.
4. Objetos significativos que cambian al cambiar la frase, no una composición plantilla fija.
5. Elegancia cinematográfica, continuidad y claridad en teléfono.
6. Música/SFX originales con mezcla subordinada a la voz.
7. Estabilidad técnica, reproducibilidad y entrega verificable.

### 01. ENTRADAS, AUDIO Y DURACIÓN
- Guion: `03_GUION/GUION_ORIGINAL_APROBADO_INTOCABLE.txt`; conserva absolutamente todas sus palabras, pausas y puntuación de referencia.
- Busca narración proporcionada por usuario en `01_ENTRADA/audio/`. Detecta extensiones WAV/MP3/M4A/AAC/OGG. Si hay varias, lista y pide cuál usar; nunca inventes selección.
- Mide duración real con `ffprobe` y waveform con ffmpeg. Usa ESTA pista como reloj maestro: `DURATION = duración de voz + cola final apropiada`, nunca comprimas narración a 15 segundos por configuración del ejemplo.
- No hagas text-to-speech, clones, síntesis, time-stretch, recortes, cambios de velocidad, remuestreo destructivo ni sustitución de la voz. Puedes muxear la pista original sin cambiar su contenido audible; si el contenedor exige codificar, evita aplicar filtros que alteren voz.
- Obtén alineación palabra/segmento con el audio real si existen librerías locales; verifica manualmente timestamps dudosos. NO supongas que cada frase dura idéntico. Si no puedes alinear voz con certeza, genera una tabla de referencias temporales con confianza y solicita su corrección antes de exportar.
- El archivo `03_GUION` es contenido hablado, NO captions gigantes en pantalla. Textos de pantalla condensan conceptos sin reemplazar ni alterar la voz.

### 02. TRATAMIENTO VISUAL: NO CONFUNDIR PLANTILLA CON HISTORIA
Aquí no hay robots de IA, gatos, perros, planetas, galaxias ni porcentajes de entrenamiento. La plantilla original trata de aprendizaje automático; usar sus objetos literalmente sería un ERROR.

Aplica los MISMOS RECURSOS de Flat-Vector Science a estos sujetos correctos: un helicóptero realista dentro del estilo vectorial, cabina, fuselaje, patines/tren, rotor principal, eje, palas y unidad de rueda libre, aire en flujo ascendente relativo, distancia al suelo, campo de aterrizaje y un corte transversal aerodinámico.

Rasgos obligatorios del estilo:
- Gradient navy→violet con profundidad, no fondo técnico plano; glows radiales discretos que den volumen; partículas atmosféricas con parallax coherente.
- Grandes formas sin contornos negros duros; degradados de 3–4 paradas; zonas de sombra en media luna (`crescent`), rim highlights y reflejos selectivos; iluminación de amanecer/atardecer o azul crepuscular (no fondo espacial literal).
- Easing suave, gentle overshoot, zoom/scale con cámara que se acerca a un mecanismo y sale a contexto; motion blur controlado si aporta fluidez.
- Líneas flecha gruesas, curvas de puntos redondeados, movimiento de partículas a lo largo de trayectorias reales. Colores estables para caudal, potencia y peligro.
- Nunito/Fredoka; sistema de rótulos tipo `pill()`, texto grande, pocos datos simultáneos.
- Pases de acabado equivalentes a `finish()`/grainTex del origen a misma intensidad o calibrados sin destrucción de color. **No omitir estos pases para acelerar render**: optimiza caché y GPU.
- No añadas ojos, caras ni expresiones a helicópteros; los personajes redondos son un recurso opcional de la plantilla que no corresponde a una simulación mecánica seria.

**ERROR PREVIO QUE DEBES EVITAR:** en otro episodio, una placa central oscura se mantuvo idéntica durante distintas frases; la cámara se movía, pero el objeto no evolucionaba. Aquí NO conserves todo el tiempo un helicóptero de perfil estático con etiquetas distintas. El protagonista cambia de escala y función: helicóptero completo → conjunto motor/transmisión → rueda libre → disco rotor → corte transversal de pala → flujo relativo → trayectoria de descenso → maniobra final. Mantén identidad y continuidad, pero no una figura vacía repetida.

### 03. MODELO MECÁNICO: EXACTITUD, NO ANIMACIONES DECORATIVAS
Revisa `06_REFERENCIAS/VERIFICACION_FAA.md` ANTES del storyboard.

- Motor y rotor son conjuntos diferentes. En una falla de motor, la `freewheeling unit` o rueda libre/desembrague permite giro del rotor sin que el motor siga impulsándolo. No muestres que las palas se detienen completamente y mágicamente vuelven a girar.
- El usuario dice literalmente "reducir rápidamente la inclinación de las palas"; representa con precisión la **disminución del paso colectivo**, no una inclinación brusca de todo el disco rotor ni palas doblándose.
- Fase powered flight: rotor produce corriente descendente en sistema estacionario con sustentación; fase autorrotativa: durante descenso, el aire relativo cruza de ABAJO HACIA ARRIBA el disco. Aclara de ser necesario mediante rótulo `FLUJO RELATIVO DEL AIRE` y partículas.
- No basta con la inercia del rotor durante todo el descenso: hay sectores de pala con fuerza aerodinámica que mantienen las RPM; no dibujes simples soplidos mágicos de abajo que sustituyen toda la física. Demuestra la transformación de energía de altura en flujo y rotación sin inventar energía.
- El helicóptero NO queda suspendido o volando nivelado para siempre sin motor; tiene descenso y avance en autorrotación según condiciones.
- Final: `flare` cerca del suelo reduce descenso y velocidad horizontal; el piloto usa energía cinética almacenada del rotor y la gestión del colectivo al final para amortiguar contacto. No representar un aterrizaje automáticamente suave o seguro.
- No asignar velocidades, alturas exactas, porcentajes de éxito, RPM específicas o ángulos que no correspondan a un modelo identificado. Cifras meramente escénicas se omiten.
- No representar autorrotación como el principio de un paracaídas ni una hélice alimentada por el viento hacia abajo.
- El rotor de cola y mando direccional pueden mostrarse subordinadamente, sin falsas simplificaciones en diferencias de modelos o emergencias de rotor de cola.
- Aterrizaje solo en zona despejada, como una recreación conceptual. No dar instrucciones de pilotaje operativo.

### 04. CÁMARA COMO NARRADOR, NO COMO DECORADO

Durante toda la película tiene que existir cambio visual intencional, pero con pausas de comprensión: movimiento continuo sutil cuando el público lee, fuerte cuando descubre mecanismo.

Rutas de cámara narrativas concretas:
1. Toma dinámica del helicóptero real volando ante montañas, entra a encuadre desde la primera fracción de segundo, el motor falla y un sonido se apaga.
2. Traveling desde cabina hacia motor: aparece motor iluminado y transmisión conectada al rotor; flujo de potencia animado.
3. Cuando la voz afirma que las hélices siguen girando, continuidad del mismo eje: el flujo de potencia de motor pasa a cero, **pero la rotación del rotor no llega a cero**.
4. Zoom macro hacia el mecanismo rueda libre con anillos acoplados/desacoplados. Solo lo justo para entender separación de motor y rotor.
5. Movimiento push-through hacia el plano del rotor; se transforman aspas en corte transversal de pala para explicar paso colectivo.
6. La cámara sale bajo el helicóptero y asciende siguiendo partículas azules del flujo RELATIVO atravesando el rotor de abajo hacia arriba.
7. Zoom out para mostrar helicóptero avanzando/descendiendo; trayectoria curva de energía/altura; no halo cósmico irrelevante.
8. La trayectoria converge hacia campo y la cámara desciende para explicar flare y contacto.
9. Cierre con helicóptero en el suelo y el principio visual: "SIN MOTOR ≠ SIN CONTROL", junto a condiciones de seguridad.

Transiciones estilo propio: match-cut rotor circular→engranaje; partículas ascendentes→lineas de sustentación; reflejo del rotor→curva de descenso; zoom-in/out al mecanismo; wipe motivado por una pala que cruza cámara, nunca planetas arbitrarios.

### 05. STORYBOARD REQUERIDO ANTES DE CODIFICAR PELÍCULA
Crear `08_STORYBOARD/storyboard.html` con 10–12 paneles verdaderamente ilustrados en Canvas, no cajitas de texto, imágenes estáticas genéricas, tablas vacías o wireframes.

Cada panel debe dibujar una imagen clave con estilo equivalente al final (gradientes, sombras, glows, helicóptero correcto, flechas, grano). Debajo, tabla que incluya:
- ID de beat; frase exacta del guion asociada; tiempo de inicio y fin REAL de voz; texto exacto a mostrar; sujeto principal; cambio de escala/cámara; continuidad del anterior; notas físicas; entrada/salida, SFX exacto, razón de la transición.
- Evidencia de qué se conserva y qué cambia en el siguiente beat, para evitar duplicación estática de plantillas.
- Lista de supuestos factuales y su verificación; lista de recursos faltantes.
- Un timeline general de la voz medido por ffprobe.

**PAUSA OBLIGATORIA:** entregar storyboard y esperar `OK` del usuario. Ni automatizar render final ni prometer que lo hará en background sin ejecución. Una vez aprobado, construir proyecto y renderizar video en la siguiente ejecución/turno del flujo de Claude Code. Si el usuario autoriza expresamente render directo, se puede saltar esta pausa.

### 06. PROGRESIÓN POR 12 BEATS (ORDEN Y SIGNIFICADO; TIMINGS SEGÚN AUDIO)

BEAT 01 — "Un helicóptero está volando...". Helicóptero protagonista grande cruzando acantilado al primer frame. Sol y cielo gradiente, tierra a distancia. No una portada que tape el gancho. Zoom hacia motor.

BEAT 02 — "...de repente, su motor se apaga". Indicador de potencia pasa a cero y flujo motor→transmisión se apaga. Rotor sigue girando. La cámara viaja dentro del fuselaje; un alerta breve. No hacer explotar motor.

BEAT 03 — "¿Se desploma inmediatamente? No necesariamente". Contraste visual: flecha roja de caída abrupta tachada y trayectoria azul de descenso en autorrotación. Encuadre con helicóptero y suelo como contexto, sin prometer resultado.

BEAT 04 — "puede seguir volando sin que su motor impulse las hélices". Mismo rotor pasa a vista de conjunto motor/transmisión/rueda libre; motor detenido, rotor con inercia/transición al régimen autorrotativo. Intercambia el flujo naranja de potencia con el flujo cian del aire.

BEAT 05 — "El secreto está en... autorrotación". Titular AUTORROTACIÓN, apareciendo adherido al disco rotor; cámara se acerca al plano de aspas, con energía potencial→movimiento de aire→rotor.

BEAT 06 — "debe reducir rápidamente la inclinación de las palas". Macro sección de pala con flecha explícita `REDUCCIÓN DEL PASO COLECTIVO`; ángulo de pala ilustrado con cambio moderado, no un número ficticio. No confundir paso colectivo con inclinación del helicóptero.

BEAT 07 — "El helicóptero comienza a descender". Cámara sale del corte aerodinámico y vuelve a la aeronave; movimiento descendente suave, sensación clara de caída controlada y límite de altura.

BEAT 08 — "El aire atraviesa el rotor desde abajo". Flechas cian grandes cruzando disco desde abajo hacia arriba **en referencia al helicóptero**; siguen contorno curvo de flujo, mientras palas rotan.

BEAT 09 — "energía de su propio descenso". Transformación visual de altura en rotación: representación conceptual de energía potencial y corriente relativa; partículas cian conectadas a velocidad angular naranja. Evita mostrar una fuente externa de energía inventada.

BEAT 10 — "cuando se acerca al suelo". Vista de trayectoria descenso hacia campo despejado; el piloto realiza flare. Silueta levanta ligeramente morro mientras disminuye tasa de descenso y avance. No parecer subida continua.

BEAT 11 — "Pero no siempre funciona...". Rótulos ALTURA / VELOCIDAD / REACCIÓN DEL PILOTO surgen vinculados a variables reales. La aeronave de la recreación toca suelo, no lo presenta como garantizado para cualquier situación.

BEAT 12 — "perder el motor no significa... Esto es Asombroteca". Plano abierto del helicóptero ya en suelo; el rotor desacelera gradualmente DESPUÉS del aterrizaje. Mensaje final `SIN MOTOR ≠ SIN CONTROL` (como posibilidad, no garantía). Solo wordmark discreto `ASOMBROTECA`; no agregar logo.

Si audio real motiva entre 9 y 14 beats, reagrupa sin cambiar secuencia causal. Se sugiere 12 por claridad, pero NUNCA impongas 12 escenas desconectadas o un corte duro por frase. En pantalla un cambio significativo o microacción cada 1–3 s; alto dinamismo sin sobrecargar.

### 07. SUBTÍTULOS Y TEXTOS
- Subtítulos palabra/frase, blanco y SIN caja negra, acento bajo la palabra relevante con **barra amarilla fina animada**. Fuente Nunito, grosor alto y alto contraste; sombra muy suave si hace falta. Subtítulos exactos respecto al audio, no editar la voz.
- Usa safe zones: margen superior e inferior y reserva laterales para UI de TikTok/Reels/Shorts. Subtítulos por encima de controles y lejos de la zona donde explicación técnica se vuelve crítica.
- Texto técnico corto: `MOTOR APAGADO`, `RUEDA LIBRE`, `PASO COLECTIVO`, `AIRE RELATIVO ↑`, `AUTORROTACIÓN`, `FLARE`, `ALTURA`, `VELOCIDAD`, `REACCIÓN`.
- No escribas flechas de flujo incorrectas ni llenes pantalla de elementos pequeños imposibles de leer.
- Marca del canal: exclusivamente `ASOMBROTECA` discreto. No dibujar icono/logo de Asombroteca (petición permanente del proyecto).

### 08. PALETA HEX — ESTILO ORIGINAL + SIGNIFICADO
- Cielo noche: #090B2C, #18134F, #3A1A6C (familia Flat-Vector Science)
- Cielo crepúsculo variable: #233B75 → #7250B2
- Silueta aeronave luz: #A4FBEF → #3CCBDC → #1D64B0
- Sombras aeronave: #141846 / #10164A
- Aire relativo: #56E8FF / #A4FBEF (flujo de abajo hacia arriba)
- Flujo potencia motor: #FFCC7A / #FF8D3F / #D24A2A
- Falla/alerta: #FF3B5C (solo al motor apagarse / trayectoria imposible)
- Éxito mecánico: #38E08E (si aparece, no representar garantía de seguridad)
- Atención/datos: #FFD23F
- Tipografía principal: #F6FAFF; secundaria: #BDE5F8
- Campo de aterrizaje: verdes y tierras suaves coherentes con look Flat-Vector, sin diseño fotográfico ni low-poly genérico.
- No conviertas el episodio en un plano técnico monocromático. Debe sentirse como Flat-Vector Science.

### 09. RENDER Y ARQUITECTURA
- Fuente en HTML Canvas 2D + JavaScript y métodos original style; sin render estático tipo presentación.
- 1080x1920 píxeles **NATIVOS** 9:16, 30 FPS. Adapta composiciones desde H.W=1280/H.H=720 con transform de cámara y reencuadre **por escena**, no estirando horizontal 1280x720 a 1080x1920.
- Crea `explainer(ctx,W,H_,t)` y `scoreSound(k)`; `window.seek=(t)=>...`, `window.DURATION`, `window.scoreSound`, `window.renderReady`/ready fonts; `window.previewVoice()` si ayuda.
- H y SOUND deben conservarse intactas (archivos originales proporcionados en paquete). Si agregas utilidades, ponlas en módulos independientes y no sobrescribas H.rng, H.makeNoise, SOUND.kit ni SOUND.renderOffline.
- Reutiliza `glow`, `crescent`, `ball`, `arrow`, `text`, `pill`, `sky` y `finish` del estilo para crear rotor, helicóptero y ambiente; los objetos del ejemplo IA NO se transfieren.
- JS rendering 100 % determinista según t; semilla controlada y caché de sprites estáticos, sin `Math.random` ni dependencia del estado del frame anterior.
- Crea `preview.html` con controles play, pause, seek, volumen, loop; escena visible a tamaño adaptado y opción de inspeccionar solo frames.
- Crea `render.js` o `render.py` que capture cada frame `seek(i/30)` con Puppeteer/Chromium y escriba a FFmpeg de modo que el archivo MP4 final sea verificable.
- Resolución real 1080x1920; 30 fps CFR; H.264 y audio AAC, `yuv420p`, `-movflags +faststart`. Exporta miniatura/portada vertical si es útil, sin otra marca.
- Maneja codecs, disponibilidad ffmpeg y errores. No simules que exportaste si no existe el MP4.

### 10. SOUND — DISEÑO SONORO CON NARRACIÓN REAL
El prompt ORIGINAL de Atlas suponía `voiceover:false`. AQUÍ SÍ HAY VOZ DEL USUARIO: esta es una adaptación deliberada para evitar música demasiado alta o eliminar la voz.

- Mantén `SOUND` sin modificar y usa `scoreSound(k)` con marcas idénticas a timecodes de imagen, renderizando SFX con `SOUND.renderOffline(scoreSound,DURATION,48000,{voiceover:true})`.
- Nota de compatibilidad: esta función devuelve un **objeto** `{inter,peak,frames,sr}`, no directamente un Float32Array. Convierte los float32 interleaved stereo a WAV correctamente.
- SOUND con `voiceover:true` suprime `k.bed` y `k.music`. Por ello, crea una pista **MUSICAL SEPARADA** original: ejecuta un score de música con `voiceover:false` y efectos desactivados (o utiliza instrumento generado con código local) para luego mezclar en FFmpeg a volumen bajo bajo el stem de narración, sin duplicar SFX.
- SFX por fenómeno: rotor motor normal, corte de potencia, pequeño alerta, aire sostenido, enfoque en engranaje, whoosh de cámara, descenso aire, flare y contacto; usa sonidos originales o generados con kit, NUNCA efectos que impliquen un accidente real si la visualización no lo muestra.
- Sonido `rotor`: el kit original no tiene sample rotor; sintetiza modulaciones o capas armónicas sutiles y transiciones entre `motor+rotor` y `solo rotor+aire` sin cortar brusco a silencio absoluto. El audio final debe permitir escuchar nítidamente la voz.
- Prioridad: narration mayor que SFX, música debajo. Evitar clipping/ruido excesivo; analiza true peak/loudness si herramientas existen, sin alterar pista de voz. Mantén quietud breves en pregunta/"No necesariamente" y reveal "autorrotación".

### 11. CALIDAD, TESTS Y ACEPTACIÓN
ANTES DE ENTREGAR anima y revisa, no solo código compilado:
1. `node --check` para archivos JS y consola navegador sin errores.
2. Fonts Fredoka/Nunito cargadas antes del primer frame y export offline sin depender de Internet.
3. `seek(t)` al mismo t produce mismo bitmap; prueba hashes en al menos 3 tiempos elegidos.
4. `ffprobe` duración, códec, fps, resolución, pistas; ninguna pista de voz se reemplaza.
5. 12 keyframes revisados (primer segundo, falla, rotor, rueda libre, colectivo, flechas aire, flare, cierre) en un contact sheet PNG.
6. Verificar flechas ascendentes durante autorrotación y descendentes en powered flight, si se ilustran; no detener rotor tras falla.
7. La cámara atraviesa componentes y el foco visual evoluciona. No hay helicóptero de perfil idéntico durante más de un tramo sin que ocurra un cambio instructivo.
8. Legibilidad de subtítulos desde pantalla de celular; ausencia de cajas negras, logo Asombroteca y marca de agua.
9. Cotejar cada evento con audio real y asegurar que el movimiento visual esencial no aparezca antes o después de la frase sin intención justificada.
10. Renderizar y verificar al menos una reproducción completa del MP4; informar condiciones que no pudiste verificar.

Entregables de la fase storyboard: `08_STORYBOARD/storyboard.html` + paneles + mapa de voz + lista supuestos científicos y mejoras respecto plantilla. **Esperar OK**.
Entregables después de aprobación: `07_OUTPUT/ASOMBROTECA_HELICOPTERO_AUTORROTACION_FINAL.mp4`, `preview.html`, fuentes JS/CSS, WAV música, WAV SFX, subtítulos SRT/ASS, miniatura, registro QC y FFprobe.

### 12. VALIDACIÓN DEL TEMA Y LÍMITES
- No cambiar el guion hablado. Hay simplificaciones verbales del guion; corrígelas VISUALMENTE con precisión sin regrabar voz, por ejemplo rotular "PASO COLECTIVO" cuando habla de inclinación de palas.
- El guion habla de "seguir volando" y "amortiguar el aterrizaje": muestra descenso y posibilidad condicionada, NO planeo horizontal permanente ni aterrizaje garantizado.
- Menciona fuentes FAA para la interpretación física; fuentes están en carpeta de referencias.
- Evitar cifras inventadas de velocidad, altura y RPM.
- Este es contenido educativo, no una guía de pilotaje en emergencias.

### 13. ORDEN DE TRABAJO CONCRETO PARA CLAUDE CODE
1. Lee todos los archivos. Localiza la voz y mide duración con ffprobe. Inspecciona H/SOUND y referencia flat-vector; si el `styles/flat-space.js` original de Futurepedia está disponible adicionalmente, **usa ese exacto como referencia principal**.
2. Haz mapa audio→frases y el plan visual de 12 beats; marca dudas.
3. Construye storyboard HTML REAL con 10–12 Canvas, usando dibujos y finish del estilo; abre o renderiza el storyboard para verificarlo y corrige.
4. Entrega storyboard para APROBACIÓN. No generes todavía video definitivo.
5. Tras recibir OK, construye animación desde esos dibujos, con transiciones continuas y sonido original; exporta MP4 y pistas; QC visual y técnico.
6. Resume qué verificaste realmente y entrega rutas de los archivos. No afirme éxito de pasos no ejecutados.

### MANDATO FINAL
**EL MOTOR SE APAGA, PERO EL ROTOR SIGUE GIRANDO.** Quiero que un espectador comprenda visualmente por qué, desde el corte de potencia hasta el flujo aerodinámico que sostiene la rotación, y cómo puede aprovecharse su energía en una maniobra final. Cada imagen ha de contar una parte del mecanismo, sin estancarse en una plantilla vacía. Conserva la identidad visual genuina de Flat-Vector Science, la narración entregada por el usuario y la personalidad científica de Asombroteca.
