# PLANTILLA ASOMBROTECA · Instrucciones maestras para cualquier video

Este documento resume lo importante de todos los prompts anteriores (Binance, Elon/Zhao, Helicóptero y Submarino) y de los videos de referencia virales. Sirve para producir cualquier explainer vertical con la misma calidad, sin empezar de cero.

---

## 1. Reglas que no se rompen

1. **La voz es sagrada.** No se altera, no se sintetiza, no se acelera ni se recorta. Solo se convierte a estéreo y se rellena con silencio al final.
2. **El audio manda.** Si el guion propuesto no coincide con lo que se oye, gana el audio: se transcribe (Whisper local) y se reportan las diferencias. Nunca se falsifican subtítulos.
3. **El guion no se cambia.** Lo que dice la voz es lo que aparece en los subtítulos.
4. **Rigor:**
   - No se inventan números.
   - Cada dato en pantalla (fechas, cifras, nombres) se verifica con fuentes y se anota en `FUENTES_Y_DECISIONES.md`.
   - Si las fuentes no coinciden, no se pone la cifra.
   - Si algo es incierto, se rotula como «posible» o «probable».
5. **Respeto en temas sensibles.** Nada de explosiones ni dramatización de muertes. En esos momentos va silencio o casi silencio.
6. **Sin logos de terceros.** La marca solo aparece como la palabra **ASOMBROTECA** en el cierre.
7. **Formato:**
   - 1080×1920 vertical, 30 fps, H.264 (yuv420p, faststart) y AAC 48 kHz.
   - MP4 de menos de 100 MB.
8. **Determinismo.**
   - Cada fotograma es función pura de `t`: `window.seek(t)`, `window.DURATION`, `window.scoreSound`.
   - Todo el azar viene de `H.rng`/`H.makeNoise`; nunca de `Math.random`.
   - `lib/harness.js` (H) y `lib/sound.js` (SOUND) se usan sin modificar.
9. **Versiones.**
   - Nunca se sobrescribe una versión entregada: V1, V2, V3… y se guarda copia de la anterior.
   - Si algo ya funciona, no se rehace: solo se corrige lo pedido.
10. **No se dice que algo está terminado sin el MP4 exportado y revisado.**

## 2. Cómo se cuenta la historia

Toda historia sigue esta estructura: **PROBLEMA → EXPLICACIÓN → CASO o CONSECUENCIA → SOLUCIÓN o LECCIÓN → CIERRE**.

- **Gancho en menos de 2 s.** Desde el primer fotograma ocurre algo: movimiento, sonido o una pregunta. Nada de intros lentas.
- **Algo cambia cada 1–2 s, sincronizado con una palabra concreta de la voz.** Puede ser:
  - un icono que aparece;
  - un número que cuenta;
  - un bocadillo, una tachadura o una flecha que se dibuja;
  - un zoom con lupa.
- **Elementos visuales que explican, no que decoran:**
  - comparaciones de escala con objetos cotidianos;
  - metáforas visuales (dominó para una cadena de causas, lupa para ver dentro);
  - flechas de fuerza o de flujo;
  - antes/después;
  - ✗ para lo que falla y ✓ para lo que funciona.
- **Un momento de énfasis** en la idea clave: rebote, anillo, sello o sacudida.
- **Una solución explícita** cuando existe. El espectador debe salir sabiendo qué se hizo o qué se aprendió.
- **El cierre se mantiene en pantalla al menos ~1 s**, con ASOMBROTECA y «la ciencia oculta de lo imposible».

## 3. Subtítulos

- Van **arriba** (y ≈ 300), en trozos de 1 a 4 palabras.
- Las palabras **aparecen a medida que se dicen**: la actual en blanco y negrita, las anteriores en gris.
- La **palabra clave** lleva un **recuadro de selección con asas** en el color de acento.
- La lista de palabras clave se escribe a mano en cada episodio. Admite límites de tiempo (`['necesita', t0, t1]`) para no repetir el recuadro.
- Sombra suave, sin caja opaca.
- Ningún elemento importante en los 250 px inferiores (zona de la interfaz de Instagram y TikTok).

## 4. Sonido

- **Sincronía exacta.** El sonido empieza en el fotograma exacto en que aparece su evento.
- **Cada bloque tiene su efecto** (`PLANTILLA.FX`):

  | Efecto | Evento |
  |---|---|
  | `aparece` | algo aparece en pantalla |
  | `etiqueta` | una etiqueta se coloca |
  | `flecha` | una flecha se dibuja |
  | `tachado` | algo se tacha |
  | `correcto` | algo sale bien |
  | `sello` | un sello o rótulo cae |
  | `contador` | un número cuenta (máximo 12 clics por segundo) |
  | `onomatopeya` | aparece una onomatopeya |
  | `burbujas`, `siseo`, `agua`, `alarma`, `sonar`, `crujido`, `golpeSordo`, `domino`, `clic`, `campana` | sonidos ambientales y de objetos |

- **Las transiciones suenan solas** según su tipo.
- **Jerarquía:** la voz siempre delante, luego los efectos y la música muy por debajo. Como máximo unos 3 sonidos a la vez, con pequeños silencios para que los golpes importantes se noten.
- **Stems separados:** `sfx.wav` (voiceover:true) y `musica.wav` (voiceover:false).
- **Mezcla de referencia:**

```
ffmpeg -i voz.mp3 -i musica.wav -i sfx.wav -filter_complex "[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0,apad=whole_dur=D[v];[1:a]volume=3dB[m];[2:a]volume=-5dB[s];[v][m][s]amix=inputs=3:duration=longest:normalize=0,volume=4dB,alimiter=limit=0.87:level=false:attack=3:release=60,atrim=0:D[o]"
```

  Objetivo: unos −15 LUFS con pico verdadero ≤ −1 dBFS.

**Ducking (música bajo la voz):** la música se comprime con la voz como señal de control:

```
[1:a]volume=3dB[m0];[v]asplit[v1][vk];[m0][vk]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[m]
```

## 5. Pieles visuales

| Piel | Aspecto | Cuándo usarla |
|---|---|---|
| `plana` | Ilustración plana de colores cálidos, formas redondeadas sin contorno, sombras planas, tipografías Nunito y Fredoka | Ciencia cotidiana, cuerpo humano, naturaleza, historias |
| `oscura` | «Editor técnico»: fondo casi negro, acento dorado y coral, rellenos oscurecidos con borde dorado fino, grano, Space Grotesk e IBM Plex Mono | Tecnología, dinero, internet, datos, IA |

La piel se elige con `skin: 'plana' | 'oscura'` en `PLANTILLA.make`. Los bloques usan colores semánticos (`ink`, `paper`, `accent`, `red`, `green`, `blue`…), así que la misma escena funciona con cualquier piel.

## 6. Bloques disponibles (`PLANTILLA.P`)

| Grupo | Bloques |
|---|---|
| Formas | `rr` (rectángulo redondeado con sombra plana), `circle`, `poly` |
| Texto | `bigText`, `pill`, `text` |
| Animación | `popS` / `withPop` (aparición con rebote) |
| Indicadores | `arrow` (flecha que se dibuja), `cross` ✗, `check` ✓, `shield` (escudo con ✓, para la solución) |
| Recursos de los videos de referencia | `bubble` (bocadillo con icono), `onoma` (onomatopeya con temblor), `counter` (número que rueda, con o sin caja), `lens` (lupa dorada para ver dentro de algo) |
| Datos | `gauge` (manómetro cualitativo, sin cifras), `domino` (cadena de causas), `person` (icono de persona para cuadrículas respetuosas) |
| Cierre y ambiente | `finger` (dedo que toca «Seguir»), `bubbles` (burbujas o partículas deterministas) |

**Añadidos en v1.2** (episodio del microondas):

| Bloque | Uso |
|---|---|
| `camAt(keys, t)` + `camApply` | Cámara 2.5D: dolly, travelling y cambios de escala sobre una escena en espacio-mundo |
| `glow` | Luz o energía aditiva |
| `heat(v)` | Rampa térmica azul → amarillo → naranja → rojo. Solo para TEMPERATURA |
| `wave` | Onda electromagnética como cinta sinusoidal. Con `over: true` se dibuja sobre fondos claros |
| `water` | Molécula de agua con su ángulo de dipolo y color térmico |

**Añadidos en v1.4** (episodio del aire acondicionado):

| Bloque | Uso |
|---|---|
| `path(pts)` + `strokePath` | Recorridos medidos para tuberías, cables o rutas |
| `fluid(ctx, path, t, {phase, temp})` | Fluido dentro de un tubo. La FASE (líquido, vapor, mezcla) y la TEMPERATURA se representan por separado |
| `airStreaks` | Trazadores de aire, en lugar de humo |
| `fanAxial` y `fanCross` | Ventiladores axial y de flujo cruzado |

**Añadidos en v1.5** (episodio del GPS):

| Bloque | Uso |
|---|---|
| `phone` | Celular con pantalla programable |
| `mapCity` | Mapa de ciudad visto desde arriba |
| `pin` y `dot` | Pin de ubicación y punto azul pulsante |
| `rangeCircle` | Círculo de distancia (trilateración) |
| `globe` | Globo terrestre con continentes |
| `satellite` | Satélite genérico |
| `rings` | Ondas de radio, en anillo o dirigidas |
| `clock` | Reloj analógico |

**Bloques v1.8 (episodio «Las pirámides»)** — historia antigua, construcción y trabajo humano:

| Bloque | Uso |
|---|---|
| `desert(ctx, y, t, {sky, sunX, sunY})` | Desierto con sol y dunas; **devuelve `yAt(x)`** del suelo |
| `pyramid(ctx, x, y, w, h, {built, courses, casing, joints})` | Pirámide 3/4 por hiladas: `built` la construye por niveles (con plataforma), `casing` añade el revestimiento liso. **Devuelve `{apex, base, at(cara, u, v)}`** para poner rampas, personas o marcas sobre las caras |
| `block(ctx, x, y, w, h, {c})` | Bloque de piedra en perspectiva (caliza o granito) |
| `sled(ctx, x, y, s)` | Trineo de madera con bloque; **devuelve el punto de amarre de la cuerda** |
| `worker(ctx, x, y, h, fase, {pose})` | Persona estilizada que camina (`walk`), tira (`pull`), vierte agua (`pour`), está quieta (`stand`) o trabaja (`chisel`); **devuelve la posición de las manos** |
| `rope(ctx, pts, w)` | Cuerda trenzada |
| `ramp(ctx, pir, tipo, p, {top})` | Rampas sobre una pirámide: `recta`, `zigzag`, `espiral`, `interna` (hipótesis) |
| `papyrus`, `tool(ctx, tipo, …)` | Papiro con signos estilizados; herramientas: `cincel`, `mazo`, `sierra`, `codo`, `plomada`, `escuadra` |
| `palm`, `qmark` | Palmera que se mece; signo de interrogación flotante (dudas e hipótesis abiertas) |

Efectos `FX` de v1.8: `arrastre` (piedra sobre arena), `cuerda` (tensión), `esfuerzo` (tirones rítmicos), `vertido` (agua), `cincel`, `piedra` (bloque que se asienta) y `viento` (desierto).

**Bloques v1.7 (episodio «La represa»)** — agua, energía y electricidad:

| Bloque | Uso |
|---|---|
| `waterBody(ctx, pts, t, {surf, top, bottom})` | Masa de agua (embalse, río) en un polígono, con degradado por profundidad y superficie con brillo |
| `concrete(ctx, pts, {joints, stains, light})` | Hormigón con juntas y manchas (represas, muros, edificios técnicos) |
| `pipe(ctx, pts, w, t, {fill, flow, speed})` | Tubería con agua que la LLENA (`fill` = hasta dónde llegó) y trazadores de flujo |
| `gate(ctx, x, y, w, h, open)` | Compuerta deslizante de toma |
| `francis(ctx, x, y, r, ang, {open, flow, t})` | Turbina Francis vista desde arriba: carcasa espiral, álabes directrices FIJOS y rodete que GIRA |
| `waterwheel(ctx, x, y, r, ang)` | Rueda de molino |
| `genSection(ctx, x, y, r, ang, {poles, field, current})` | Generador en corte: rotor con electroimanes N/S que gira, estator fijo con bobinas que se encienden y líneas de campo conceptuales |
| `sine(ctx, x, y, w, h, t, {phases})` | Corriente alterna (una o tres fases) |
| `transformer(ctx, x, y, s, {n1, n2, flux})` | Transformador: núcleo y dos devanados (n2 > n1 = eleva la tensión) |
| `pylon` y `powerLine` | Torre de alta tensión (**devuelve los puntos de amarre**) y cable con catenaria y paquetes de energía |
| `house`, `factory`, `skyline` | Casa, fábrica y ciudad con ventanas que se encienden |
| `bulb`, `switchWall` | Bombilla con halo e interruptor |
| `cloud` (con `rain`), `sun`, `fish` | Ciclo del agua y ecosistemas |

Efectos `FX` de v1.7: `compuerta`, `corriente` (agua que fluye), `turbina` (giro que acelera), `generador` (zumbido de 60 Hz), `induccion`, `transformador`, `lineas` (zumbido y chasquidos de alta tensión), `bombilla` y `lluvia`.

**Bloques v1.6 (episodio «Internet bajo el mar»)** — océano, cables submarinos y telecomunicaciones:

| Bloque | Uso |
|---|---|
| `spline(pts, seg)` | Curva suave que pasa por los puntos (rutas, cables colgando, contornos) |
| `ocean(ctx, t, depth, {x,y,w,h,snow,rays,dy})` | Mar de perfil: color según profundidad (0 superficie → 1 abismo), rayos de luz y «nieve marina». `dy` crece durante un descenso |
| `waves(ctx, y, t, {sky,amp,w})` | Superficie del mar con oleaje; `sky` pinta el cielo encima |
| `seabed(ctx, y, t, {seed,rocks,bottom})` | Fondo marino; **devuelve `yAt(x)`** para apoyar cables u objetos en el fondo |
| `ship(ctx, x, y, s, t, {tanks,flip})` | Barco cablero de perfil que se mece; **devuelve el punto de la roldana de popa** (de donde sale el cable) |
| `cableSection(ctx, x, y, r, {p,armor})` | Corte del cable: fibras en gel y tubo, hilos de acero, cobre, polietileno (+ armadura y cubierta con `armor`). **Devuelve las capas con su radio** para rotular |
| `fiber(ctx, x0, x1, y, h, t, {bits,gap,speed,att,boost})` | Fibra de perfil (revestimiento + núcleo) con pulsos de luz GUIADOS (sin zigzag). `att` = pérdida de brillo a lo largo; `boost` = posiciones de amplificadores |
| `repeater(ctx, x, y, s, ang, glow)` | Repetidor submarino; `glow` = amplificando |
| `worldMap(ctx, x, y, w, h, {lon0,lon1,lat0,lat1,...})` | Mapa del mundo ESTILIZADO (equirrectangular). **Devuelve `proj([lon,lat])`**. Rotular siempre «mapa estilizado» |
| `cableRoute(ctx, pts, prog, t, {c,w,dots,speed,smooth})` | Ruta luminosa que se dibuja con paquetes de luz viajando; devuelve `P.path` |
| `depthGauge(ctx, x, y0, y1, v, max, {step})` | Regla vertical de profundidad con marcador |
| `rov`, `plow` | Vehículo submarino operado a distancia (focos, brazo, umbilical) y arado submarino que entierra cables |
| `anchor`, `grapnel`, `station` | Ancla, garfio de recuperación y estación de aterrizaje en la costa |

Efectos `FX` de v1.6: `bajoAgua` (ambiente submarino con burbujas), `inmersion` (zambullida), `olas`, `pulsoLuz` (destellos de luz/datos ópticos), `amplifica`, `cabrestante` (máquina que suelta o recoge cable), `ancla` (cadena + golpe), `rotura` y `empalme` (chispas de unión).

Efectos `FX` de v1.5: `senal`, `datos`, `tictac` y `ubicacion`.

Efectos `FX` de v1.4: `ventilador`, `compresion`, `expansion`, `goteo` y `calor`.

Efectos `FX` añadidos: `pitido`, `zumbido`, `motor`, `campo`, `escala`, `revelar`, `puerta`, `fin`.

**Subtítulos «barra»** (`capStyle: 'barra'`, estándar Asombroteca): frase completa en blanco, barra amarilla animada bajo la palabra que se dice y palabras clave en amarillo. Por defecto van en la franja segura inferior (y ≈ 1500). El estilo «selección» (arriba, con asas) sigue disponible.

**Transiciones** (campo `in` de cada beat):

| Tipo | Efecto | Uso |
|---|---|---|
| `cut` | corte directo | — |
| `iris` | círculo que se abre desde un punto | — |
| `zoom` | la escena anterior se agranda hacia un punto mientras se abre la nueva | ideal tras una lupa |
| `slide` | barrido lateral con desenfoque | — |
| `rise` | la nueva escena sube desde abajo | — |
| `fade` | fundido a negro | momentos de silencio |

## 7. Cómo hacer un video nuevo (paso a paso)

1. **Preparar la carpeta.** Copiar `nuevo_video/` con el nombre del video (por ejemplo `video_tripas/`), dentro de esta misma carpeta de plantilla.
2. **Poner la voz** en `01_ENTRADA/audio/`. Las fotos reales, si las hay, van en `01_ENTRADA/fotos/`.
3. **Analizar la voz.**
   - Ejecutar `bash ../tools/preparar_voz.sh 01_ENTRADA/audio/<voz>.mp3 trabajo/`. Mide la duración, detecta las pausas y transcribe con Whisper.
   - Revisar `trabajo/tramos_borrador.txt`: corregir nombres propios y escribir las cifras con su forma hablada.
   - Guardarlo como `03_GUION/tramos.txt`.
4. **Alinear y generar subtítulos.**
   - `python3 -I ../tools/alinear.py trabajo/sil_major.txt trabajo/sil_minor.txt $(cat trabajo/duracion.txt) 04_CODIGO/alineacion.json 03_GUION/tramos.txt`
   - `python3 -I ../tools/subtitulos.py 04_CODIGO/alineacion.json 06_SUBTITULOS/subtitulos.srt 04_CODIGO/js/datos.js`
5. **Investigar y verificar los datos** y escribir `FUENTES_Y_DECISIONES.md`.
6. **Escribir `04_CODIGO/js/episodio.js`** partiendo de la base comentada:
   - tabla `T` de palabras;
   - beats `{t0, t1, in, draw, sfx}`;
   - piel, palabras clave, música y ambiente.

   Para fotos reales, seguir el patrón de `ejemplo_submarino` (`js/foto_*.js` en base64 + `init`).
7. **Construir y revisar.**
   - Desde `04_CODIGO`: `python3 -I ../../tools/build.py`.
   - Revisar fotogramas con `node ../../tools/frames.js index.html qc 1 5 10 …` y `python3 -I ../../tools/sheet.py hoja.png 6 qc/*.png`.
   - Corregir solapes antes del render.
8. **Renderizar e integrar.**
   - Render: `node ../../tools/render.js index.html frames 6`.
   - Stems: `node ../../tools/audio.js index.html ../05_AUDIO`.
   - Mezcla (sección 4) y codificación:

```
ffmpeg -framerate 30 -i frames/f_%05d.jpg -i mix.wav -c:v libx264 -preset slow -crf 19 -maxrate 10M -bufsize 20M -pix_fmt yuv420p -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest 07_OUTPUT/VIDEO.mp4
```

9. **Cerrar.** QC (sección 8), README, commit y push.

## 8. Lista de control de calidad (antes de entregar)

- [ ] ffprobe: 1080×1920, 30 fps, H.264 + AAC 48 kHz, duración = voz + cola.
- [ ] Decodificación completa sin errores; sin negros ni congelados (blackdetect/freezedetect).
- [ ] Sonoridad cerca de −15 LUFS y pico ≤ −1 dBFS; la voz siempre por delante.
- [ ] El md5 de la voz de entrada coincide con el archivo recibido.
- [ ] Determinismo: mismo `t` → mismos píxeles, en dos órdenes distintos.
- [ ] Hoja de contacto revisada: sin textos encimados, sin rótulos cortados, nada importante abajo del todo.
- [ ] Datos en pantalla verificados y con fuente.
- [ ] Documentación: README, QC.md, FUENTES_Y_DECISIONES.md y mapa voz → escenas.

## 9. La plantilla crece: cómo añadir algo nuevo

Si un video necesita algo que la plantilla no tiene, se crea y **se incorpora a la plantilla** para que los videos siguientes también puedan usarlo. Puede ser un objeto o personaje, un tipo de gráfico, una transición, un efecto de sonido o una piel nueva.

Pasos:

1. **Decidir dónde va.**
   - Si es reutilizable (gráfico de barras, mapa, línea de tiempo, personaje genérico, transición), va en `motor/plantilla.js` como bloque de `P`, transición o efecto de `FX`.
   - Si es exclusivo del tema (el submarino, un intestino concreto), se queda en el `episodio.js` del video.
2. **Hacerlo genérico.**
   - Colores semánticos (`col('accent')`, `fill('#hex')`) para que funcione en las pieles «plana» y «oscura».
   - Parámetros con tiempos (`t`, `t0`).
   - Determinista (`H.rng`).
   - Con su sonido en `FX`.
3. **No romper lo anterior.**
   - Los bloques existentes no cambian de firma.
   - Antes y después del cambio, el `ejemplo_submarino` debe dar los mismos md5 de fotograma (prueba de determinismo).
4. **Mostrarlo.** Añadirlo al catálogo (`catalogo/catalogo_src.js`) y regenerar `catalogo.png`.
5. **Documentarlo.**
   - Añadirlo a la tabla de bloques (sección 6).
   - Anotar en `CAMBIOS_PLANTILLA.md` la versión, qué se añadió y para qué video.
6. **Entregar.** Regenerar `PLANTILLA_ASOMBROTECA_KIT.zip`, hacer commit y push.
