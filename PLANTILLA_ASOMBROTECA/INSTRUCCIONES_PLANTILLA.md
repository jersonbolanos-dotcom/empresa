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

**Bloques v1.14 (episodio «Gran Muralla China»)** — montañas con cresta, murallas, tierra apisonada y logística:

| Bloque | Uso |
|---|---|
| `ranges(ctx, t, {hor, sky, sun, layers, seed, arid, fogA, front:{y, amp}, nearC, farC})` | Cordilleras por capas con niebla de valle, luz en las laderas y vegetación. `arid` (0..1) pasa a paisaje seco. **Devuelve `ridge(x)`**, la cresta delantera, para apoyar murallas y caminos |
| `wallPath(ctx, pts, t, {style, h, w, build, towers, towerS, ruin, crenel, smokeAt, smoke, glow})` | **Muralla que sigue el terreno** (por ejemplo, `pts` sobre `ridge`): cara con hiladas según el material (`tierra`, `piedra` o `ladrillo`), adarve en escorzo, almenas, sombra de contacto y torres en fracciones del recorrido. `build` la construye a lo largo del camino; `ruin`, la deteriora |
| `watchtower(ctx, x, y, s, t, {style, smoke, fire, ruin, glow})` | Torre de vigilancia o de señales (ladrillo o piedra con ventanas arqueadas y almenas; de tierra, ataludada). Humo (día) o fuego (noche) deterministas |
| `rammedEarth(ctx, x, y, w, h, t, {total, done, loose, compact, form, workers, hit, cut, glowLayer})` | **Tierra apisonada**: capas terminadas con su textura; capa actual suelta que baja de altura y se densifica con `compact`; encofrado (tablones en corte); pisones que tocan la superficie y levantan polvo; `cut` marca las capas |
| `mingSection(ctx, x, y, w, h, t, {build, glow})` | Corte de muro Ming: cimiento de piedra, paramentos de ladrillo ataludados (se colocan hilada a hilada), núcleo de tierra y cascajo, adarve y parapeto. Devuelve puntos para rótulos |
| `chinaMap(ctx, x, y, w, h, t, {lon0, lon1, lat0, lat1})` + `mapWall(ctx, pts, p, t, {c, w})` + `CNWALLS` | Mapa esquemático del norte de China (mar de Bohai, Shandong, Liaodong, río Amarillo, Gobi, Ordos y relieve) y tramos de muralla con símbolo cartográfico. `CNWALLS` trae esquemas aproximados de Reinos Combatientes, Qin, Han y Ming |
| `laborer`, `porter`, `oxcart`, `packAnimal` | Trabajador con ropa y sombrero variados; porteador con pértiga y dos cestas; carro de dos ruedas con buey y ruedas que giran; mula con alforjas. Cargas: `tierra`, `piedra` o `ladrillos` |
| `dust(ctx, x, y, t, t0, {s})` | Nube de polvo determinista |

**v1.19 · almacenamiento: del IBM 350 (1956) al HDD, la flash y la microSD (episodio «El primer disco duro era una máquina gigantesca»):**

| Bloque | Uso |
|---|---|
| `RM` · `R350` · `r350y(k)` | Paleta del módulo (fondo industrial, metal de época, madera, luz cálida, disco, cian, datos, oro) y geometría del IBM 350 en **centímetros**: armario ≈ 152 × 172 × 74, 50 discos de 61 cm (R = 30,5), paso 1,27 cm. `r350y(k)` da la altura del disco k |
| `box3(ctx, cam, x0, x1, y0, y1, z0, z1, col, {only, alpha, k, edge})` | Caja 3D con caras sombreadas y ocultación. `only: 'back' \| 'front'` para dibujar el interior entre las caras traseras y las delanteras |
| `ibm350(ctx, cam, t, {rot, open, xray, arm:{k, ext}, hl, count, extract:{k, u}, lights, x, z})` | IBM 350 en 3D con `P.cam3`: armario con ventana, rejillas y pilotos; panel frontal que se retira (`open`); cubiertas transparentes (`xray`); 50 discos con grosor sobre un eje, con huecos oscuros entre ellos y marcas que giran; motor; columna con carro y brazo radial que entra en el hueco `k` (`ext` 0 = fuera, 1 = pista interior); resaltado y recuento de discos; extracción de un disco. Devuelve puntos para rótulos (`top`, `front`, `armTip`, `column`, `disk(k)`…). La cámara puede entrar entre dos discos |
| `room1956(ctx, cam, t, {warm, door, back})` | Sala informática de 1956: baldosas, paredes con zócalo, puerta de 2,1 m como referencia, ventanas altas y luz cálida |
| `worker1956(ctx, cam, foot, t, {pose, var, h})` | Técnico de los años 50 (camisa, corbata, pantalón) a la escala de la proyección en el punto 3D `foot`. Referencia de tamaño. Pose `point` para señalar o sostener algo |
| `ramac305(ctx, cam, t, {x, z, consoleDx})` | Resto del sistema IBM 305 RAMAC (genérico): armario de proceso con pilotos, consola de madera con máquina de escribir e impresora |
| `microSD(ctx, cx, cy, mm, {rot, back, glow, tilt})` | Tarjeta microSD con su forma real (11 × 15 mm, escalón lateral). `back` muestra los contactos. `mm` = px por milímetro |
| `fingertip(ctx, cx, tipY, fw, t, {skin, card, cardRot, glow})` | Yema del dedo (lado de la palma) que sale del borde inferior, con la microSD apoyada y sombra de contacto (escala real: dedo ≈ 17 mm) |
| `photoTile(ctx, x, y, s, seed, {rot})` | Miniatura de foto (paisaje estilizado) para visualizar contenido de forma conceptual |
| `platterFace(ctx, cx, cy, r, t, {tilt, rot})` | Disco del IBM 350 en 2D (frente o inclinado) con pistas, brillo y agujero central |
| `magSurface(ctx, x, y, w, h, t, {rows, speed, write})` | Macro de la superficie magnética: pistas que pasan con regiones magnetizadas (flechas N→/←S didácticas) |
| `magSection(ctx, x, y, w, h, t, {n, speed})` | Corte: sustrato de aluminio + recubrimiento magnético con regiones. Devuelve puntos para rótulos |
| `headTrack(ctx, x, y, w, h, t, {mode: 'write'\|'read', speed})` | Cabeza sobre una pista, con colchón de aire visible (nunca toca el disco). En `write` la bobina magnetiza al pasar; en `read` los cambios generan una señal eléctrica |
| `capBars(ctx, x, y, w, items, max, u, {bh, gap})` | Barras de capacidad en escala lineal (`items: [{label, mb, col}]`) |
| `hdd35(ctx, cx, cy, s, t, {rot, arm, plate, cover, angle})` | HDD de 3,5″ abierto (genérico): plato, eje, brazo pivotante que apunta al plato e imán. `plate` 0→1 hace desaparecer el plato (para pasar a flash). `s` = px/mm |
| `driveBox(ctx, cx, baseY, s, kind, t)` | Unidades cerradas a escala: `'1970'` (armario de discos removibles), `'525'`, `'35'` y `'25'` |
| `flashChip(ctx, cx, cy, s, t, {die, glow})` | Chip flash sobre placa con patas y pistas. `die` abre la matriz de celdas |
| `flashCells(ctx, x, y, w, h, t, {cols, rows, prog})` | Celdas flash conceptuales: puerta flotante que retiene electrones (carga = bit), sin piezas que giran |
| `floppy35(ctx, cx, cy, s, {rot, shutter, col})` | Disquete de 3,5″ (90 × 94 mm): persiana metálica, etiqueta y muesca |
| `dimLine(ctx, x0, y0, x1, y1, label, {col, px, off, a})` · `rulerCm(ctx, x, y, L, s)` | Cota con flechas y rótulo (≥ 32 px) y regla graduada en cm para comparar tamaños |

FX v1.19: `sala1956`, `motorDiscos` (suave, nunca una turbina), `carro`, `panel`, `interruptor`, `escribir`, `leer`, `chipFlash`, `disquete` y `miniaturizar`. Música: `MUS.industrial(k, t0, t1, {bpm, chords, perc, strings})` (percusión mecánica suave, relés, bordón y cuerdas).

**v1.18 · comunicaciones y épocas, 1926 ↔ hoy (episodio «Nikola Tesla imaginó el celular en 1926»):**

| Bloque | Uso |
|---|---|
| `ERA.old` / `ERA.now` · `mixc(a, b, u)` | Paletas oficiales de época: 1926 (sepia, café, papel, bronce) y hoy (azul, cian, noche, hielo, oro). `mixc` mezcla dos colores para transiciones graduales |
| `eraGrade(ctx, amt, t, {grain, dust})` · `techGrade(ctx, amt)` | Gradación de película de 1926 sobre lo dibujado: tono sepia, velo cálido, parpadeo, viñeta, grano suave a 12 cambios/s, polvo y rayas, todo determinista. `amt` 1→0 para retirarla poco a poco. `techGrade` aplica velo azul y viñeta fría. Llamar dentro del beat (antes de los subtítulos); con `clip` sirve para una sola tarjeta |
| `radioWaves(ctx, x, y, t, {dir, spread, n, col, r0, r1, speed, a, w})` | Arcos de señal que nacen en un punto y se desvanecen (conceptual) |
| `candlestick(ctx, x, y, s, t, {lift, ear, ring, wireTo})` | Teléfono de candelero apoyado en una superficie: auricular colgado en la horquilla (`lift` lo lleva a `ear`), vibración de timbre y cable a la pared |
| `switchboard(ctx, x, sueloY, w, t, {n, plug(i,c,t), lamps})` | Centralita manual: paneles de jacks, lamparitas, repisa con clavijas que se conectan con su cordón y operadoras de espaldas en sillas apoyadas en el suelo |
| `city1926(ctx, t, {gy, poles, wires, cut, cars, seed})` · `car1926(ctx, x, y, s, t, dir)` | Calle genérica de los años 20: rascacielos escalonados, postes con crucetas, aisladores y haces de cables, autos de época con ruedas que giran. `cut` 0→1 hace desaparecer los cables de izquierda a derecha («el cable se vuelve señal») |
| `radioTower(ctx, x, gy, h, t, {waves, wcol, r1})` | Torre de radio de celosía con riostras, apoyada en el suelo, que emite arcos |
| `teslaOld(ctx, x, y, s, t, {hand, handL, look})` | Tesla hacia 1926 (≈70 años), figura ESTILIZADA y no retrato: delgado, traje de tres piezas, cuello alto, pelo gris con raya al medio y bigote. Manos `down`, `chin`, `point` o `pocket`. Solo respira y parpadea: sin labios ni diálogo. Rotular «RECONSTRUCCIÓN» |
| `magazine1926(ctx, cx, cy, s, t, {title, date, head, by, page, hi, tag})` | Revista RECONSTRUIDA, no facsímil: cabecera en Fraunces, metadatos reales, texto ilegible (nunca citas inventadas), paso de página, resaltado de un párrafo y sello «RECONSTRUCCIÓN CONCEPTUAL» |
| `vestPocket(ctx, x, y, w, h, t, {dev, glow})` | Chaleco en primer plano (botones, cadena de reloj, bolsillo) con un aparato conceptual que asoma |
| `smartphone(ctx, cx, cy, h, t, {screen, cut, rot, glow, body})` | Smartphone GENÉRICO sin marca. `screen(ctx, x, y, w, h)` dibuja la pantalla. `cut` 0→1 abre la vista de corte y devuelve `camera`, `mic`, `chip`, `antenna` y `battery` para rotular |
| `handHold(ctx, cx, cy, h, 'back'|'front', {skin, sleeve})` | (v1.18.1) Mano derecha con agarre real, vista por quien sostiene el teléfono. La palma va detrás, con el talón bajo el borde inferior y la base del pulgar fuera del borde derecho. Los cuatro dedos rodean el borde izquierdo, con las yemas y las uñas apoyadas en el frente. El pulgar se apoya en la pantalla con sombra de contacto. La muñeca, el antebrazo y la manga llegan al borde inferior (nada flota). Orden: `back`, luego el teléfono, luego `front`. Para que la mano entre o cambie de sitio, muévela opaca (sube desde abajo o se desliza); nunca con un fundido de opacidad |
| `persona(ctx, cx, cy, s, t, {skin, hair, shirt, style, look, ph})` | Persona en plano medio con parpadeo y leve movimiento de cabeza (sin labios sincronizados) |
| `videoCall(ctx, x, y, w, h, t, {t0, remote, self, connect})` | Interfaz genérica de videollamada: persona remota, recuadro propio, tiempo de llamada, micrófono, cámara y colgar. `connect` 0→1 para conectar |
| `cellTower(ctx, x, gy, h, t, {waves, dir})` | Estación base: monopolo, tres sectores de antenas de panel, armario y valla. Devuelve `ant` |
| `fiberPath(ctx, pts, t, {prog, pulses, speed, col, w})` | Fibra óptica con funda, núcleo y pulsos de luz. `prog` revela el tendido |
| `dataPackets(ctx, x0, y0, x1, y1, t, {n, size, speed, arc, col, a})` | Paquetes de datos (0/1) que viajan entre dos puntos |
| `earthNight(ctx, cx, cy, r, t, {lon0, lat0, arcs, lights})` | Tierra nocturna ortográfica con luces agrupadas en torno a ~70 metrópolis reales y arcos de ENLACE CONCEPTUAL con un punto que viaja. Rotularlos como conceptuales: la señal real viaja por redes |
| `yearRoll(ctx, cx, cy, px, desde, hasta, u, {col, font})` | Marcador de año mecánico (1926 → 2026), cada dígito rueda por separado |
| `evoGrid(ctx, cx, y, t, k, {steps})` | Cadena de evolución 3×2 con iconos (TELÉFONO ANTIGUO → IDEA → INALÁMBRICO → BOLSILLO → SMARTPHONE → VIDEOLLAMADA). `k` = pasos encendidos. El color pasa de sepia a cian |
| `eraLabel(ctx, texto, cx, cy, px, t, t0, era, {t1})` | Título o cápsula de época: Fraunces sobre sepia oscuro (era < 0,5) o Nunito sobre azul noche |

FX v1.18: `timbre`, `auricular`, `clavija`, `oficina`, `paginas`, `radio1920`, `saltoTiempo`, `senalRadio`, `encender`, `llamada`, `flujoDatos` y `calle1920`. Música v1.18: `MUS.piano(k, t0, t1, {bpm, chords, melody, strings, waltz})` (piano con caída natural y cuerdas) y `MUS.pulso(k, t0, t1, {bpm, chords, kick, arp, pad})` (pulsos electrónicos). Los nombres `P.phone`, `P.person`, `FX.senal`, `FX.datos` y `FX.tiempo` siguen siendo los de v1.5 y anteriores: comprueba que un nombre no exista antes de crearlo.

**v1.17.1 · material documental, bandera y sección detallada (corrección final de «Tacoma Narrows»):**

| Bloque | Uso |
|---|---|
| `docPhoto(ctx, img, cx, cy, maxW, maxH, t, t0, t1, {label, tag, zoom, tilt})` | Tarjeta documental para fotografías REALES sin alterarlas: relación de aspecto original, marco fino, sombra suave, entrada 96 %→100 % con desplazamiento vertical sutil, salida suave, acercamiento lento dentro del marco (`zoom: [cx0, cy0, z0, cx1, cy1, z1]`), rótulos «ARCHIVO HISTÓRICO» y pie de foto. Las imágenes se incrustan como `data:` en un `js/fotos.js` y se cargan en `EPISODIO.init` |
| `usFlag(ctx, x, y, h)` · `flagPill(ctx, texto, cx, cy, t, t0, t1)` | Bandera de EE. UU. con proporciones oficiales (1:1,9; 13 franjas; cantón; 50 estrellas) y cápsula informativa discreta con entrada y salida suaves |
| `tacSection3D(ctx, cx, cy, s, th, t, {rot})` | Sección 2,5D extruida del tablero de 1940: losa, vigas laterales de alma llena con alas y rigidizadores, vigas transversales, eje y flecha de giro; devuelve puntos para cotas y rótulos |
| `tacSection` (`type: 'celosia'`) | Sección de celosía profunda (ejemplo del puente de 1950) abierta al viento, para comparar en el túnel de viento |
| `TAC.w` (`trav`) · `TK` | La oscilación vertical combina onda estacionaria y una componente que avanza (nula en las torres); acero y cables más oscuros para contrastar con el cielo; las péndolas conservan su longitud (el cable sigue al borde) |

**v1.17 · motor 3D ligero y puente colgante (episodio «Tacoma Narrows»):**

| Bloque | Uso |
|---|---|
| `cam3(pos, tgt, f, roll)` | Cámara 3D en perspectiva: `pr(p)` proyecta un punto, `clip(pts)` recorta un polígono contra el plano cercano antes de proyectar (evita caras perdidas o invertidas), `depth(p)`. Base para cualquier escena 3D con orden del pintor y ocultación de caras traseras |
| `TAC`, `TK` | Geometría del puente de 1940 (vano 853 m, laterales 335 m, tablero 11,9 m, vigas de alma llena de 2,4 m, torres de ~130 m, péndolas cada 15,24 m) y paleta del episodio. `TAC.w(x, m)` modo vertical (semiondas) y `TAC.th(x, m)` torsión con un nodo en el centro del vano |
| `tacBridge(ctx, t, {cam, m, cars, xray, glow, fog})` | Puente colgante completo en 3D: tablero por estaciones (calzada, cara exterior de las vigas, coronación, fondo) que se deforma con `w` y gira con `th` sección a sección; dos cables parabólicos que siguen a cada borde; péndolas conectadas; torres con dos patas, travesaños y arriostramiento en X sobre pilas; pilas de los vanos laterales y anclajes. Colapso por tramos `m.fail = [[xa, xb, tRotura, giro, cabeceo], …]` (caída con gravedad y giro, hundimiento), péndolas que se rompen `m.snap`, cable que sube al perder carga (`m.lift`), vanos laterales que se hunden (`m.sideSag`). Coches de 1940. Devuelve `sect(x)` (puntos de la sección deformada) y `cableY` |
| `tacWorld(ctx, t, {cam, warm})` | Estrecho en 3D: cielo con nubes, colinas boscosas, orillas con talud y árboles, agua con destellos y niebla ligera |
| `tacWind(ctx, t, cam, {k})` | Trazos de viento semitransparentes que cruzan el estrecho |
| `tacSection(ctx, cx, cy, s, th, t, {flow, vortex, moment, w, edges, type})` | Sección transversal del mismo tablero (`'H'` 1940 o `'cajon'`) que gira `th`; líneas de corriente que la rodean sin atravesarla, separación y estela, remolinos que recorren el tablero según la fase del giro y momento aerodinámico (flecha curva) en el sentido de la velocidad de giro `w` (aporta energía) |
| `windTunnel(ctx, cx, cy, w, h, th, t, {type})` | Ensayo de un modelo seccional sobre muelles en un túnel de viento |
| `mapWA(ctx, x, y, w, h, t)` | Mapa estilizado del estado de Washington con Puget Sound y el punto de Tacoma Narrows |
| FX `aleteo`, `desgarro`, `salpicadura` | Oscilación lenta del tablero (un golpe de aire por medio ciclo), desgarro de acero (sin explosión), impacto de un tramo en el agua |

**v1.16.1 · tuneladora como un solo sistema mecánico (corrección final de «Túnel bajo el río»):**

| Bloque | Uso |
|---|---|
| `tbmState` (ciclo completo) | excavar (0–0,6) → retraer cilindros (0,6–0,66) → montar 7 dovelas (0,66–0,94) → apoyar cilindros en el anillo nuevo (0,94–1). Añade `retr` |
| `tbmSide` (rediseñado) | Todas las piezas se sitúan respecto al frente `xm` y al eje: cabeza con aberturas que giran (el terreno pasa por ellas a la cámara), árbol al rodamiento principal, mamparo con sensores, cámara LLENA de terreno acondicionado, boca del tornillo dentro de la cámara, hélice que gira con marina visible, motor y compuerta, tolva a la cinta, 4 cilindros anclados al anillo de empuje con vástago y zapata sobre el último anillo, erector con brazo telescópico y alimentador de dovelas. Mismo orden de montaje que `ringBuild` (solera primero, llave en la clave) |
| `cutterFace` (rediseñado) | Cabeza EPB 2,5D: aro robusto con cortadores perimetrales, 6 brazos en cajón con profundidad, placas frontales con ranuras de entrada, rascadores, rippers, refuerzo interior, centro con cortador cola de pez y terreno moviéndose tras las ranuras |
| `ringBuild` (rediseñado) | Dovelas con volumen (cara + canto), anillo anterior con juntas longitudinales escalonadas, erector con corona giratoria, contrapeso, brazo telescópico y pinza de dos patines; devuelve `held` y `prev` |
| `ringSection(ctx, cx, cy, R, t, {grout, press, glowJoint})` | Sección transversal del revestimiento en el terreno: terreno con agua en los poros, hueco anular que la lechada llena desde la solera hacia la clave, 7 dovelas con sellos en las juntas, interior seco |
| `tunWorld` / `tunCross` | Capa de sedimentos sobre el lecho, cáusticas y neblina en el agua; nuevos puntos de anclaje para rótulos (`bulkhead`, `screwIn`, `screwOut`, `cyl`, `tail`) |
| `tunnelView` | Vía con ancho proporcionado al túnel, andén con barandilla, bandejas de cables y niebla de profundidad |

**v1.16 · túneles bajo ríos (episodio «Túnel bajo el río»):**

| Bloque | Uso |
|---|---|
| `TUN`, `TC` | **Sistema de coordenadas único** del río y el túnel: nivel del terreno `GS`, superficie del agua `WS`, perfil del lecho `bed(x)`, capas `layers` (arena, arcilla, grava, roca), eje `TY`, radio `R`, anchura de anillo `w`, espesor `ti`, pozos `x0`/`x1`; `TC` = paleta (agua, terreno, acero, cabeza de corte, hormigón, sellos, presión, zona protegida) |
| `tbmState(cyc, base)` | Estado de avance a partir de un número continuo de anillos: excava (0–0,6: la cabeza avanza una anchura de anillo empujada por los cilindros) y monta (0,6–1: el erector coloca 7 dovelas). Devuelve `xm` (frente), `rf` (cara del último anillo), `build`, `adv` |
| `tunWorld(ctx, t, {st, mode, press, support, watertable, tbm, glow, dusk})` | Sección longitudinal por el eje del túnel: cielo, ciudad en profundidad, río en sección con rayos y partículas, barcos, capas, nivel freático, pozo de ataque (y de salida), revestimiento de anillos con juntas escalonadas y sellos, relleno anular de lechada, y la tuneladora (`tbmSide`) o el túnel terminado (solera, vía, luces, tren). `press` = empuje del terreno y del agua; `support` = presión de soporte en la cámara. Devuelve puntos para rótulos |
| `tbmSide(ctx, st, t, o)` | Tuneladora EPB en sección: cabeza de corte (solo ella gira), cámara con terreno acondicionado, mamparo con sensores, tornillo sinfín con hélice animada, cinta, vagonetas, cilindros de empuje apoyados en el último anillo, erector con dovela, cepillos de cola, inyección de lechada y equipos posteriores sobre ruedas. `glow`: `head`, `chamber`, `screw`, `cyl`, `erector` |
| `tunCross(ctx, t, {mode, train, press, xray, flow, boats, dusk})` | Sección transversal: el río fluye a lo ancho (barcos, corriente, rayos), lecho con vegetación, capas y el túnel (anillo de 7 dovelas con sellos, lechada, interior con vía y tren de frente). `xray` = corte transparente del terreno sobre el túnel |
| `riverAerial(ctx, t, {alt, tunnel, dusk})` | Toma aérea en perspectiva de un río entre manzanas de ciudad, barcos con estela; `alt` 1→0 desciende hasta el agua; `tunnel` dibuja el trazado bajo el río |
| `cutterFace(ctx, cx, cy, R, ang, t)` | Cabeza de corte de frente: aro, radios, cortadores de disco, rascadores y aberturas por donde entra el terreno |
| `ringBuild(ctx, cx, cy, R, t, {placed})` | Montaje de un anillo de frente dentro del escudo: anillo anterior con juntas desfasadas, dovelas colocadas y el erector que toma, eleva, gira y posiciona la actual; la llave cierra el anillo (`placed` 0–7 continuo) |
| `gasketHD(ctx, cx, cy, s, t, {close, water})` | Macro de una junta: dos cantos de dovela con ranura, sello elastomérico con huecos que se comprime, agua a presión desde fuera, lechada, perno e interior seco |
| `tunnelView(ctx, t, {train, speed, cam})` | Interior de un túnel ferroviario terminado en perspectiva: anillos rellenos con juntas, luminarias, bandejas, andén, vía y un tren que se acerca |
| FX `corteTBM`, `sinfin`, `tren` | Giro de la cabeza de corte contra el terreno, tornillo sinfín, paso de un tren (se combinan con `chapuzon`, `bajoAgua`, `corriente`, `hidraulico`, `encaje`, `compresion`) |

**v1.15.1 · puente cinematográfico y primeros planos mecánicos (revisión de «Puentes sísmicos»):**

| Bloque | Uso |
|---|---|
| `bridge` (`D` variable) | La profundidad `D` es ahora una **cámara**: `[44,-30]` lateral, `[150,-105]` tres cuartos, `[80,-14]` bajo el tablero. Interpolar `D` entre claves da una órbita suave sin cambiar de geometría. El valle tiene volumen (franjas de profundidad, río que lo cruza, árboles a su profundidad, terreno cercano que entierra las zapatas), sombra del tablero, losa + vigas con rigidizadores y diafragmas, pretiles con baranda, carriles, apoyos en dos filas en vistas anchas y juntas de peine sin «agujero» bajo la losa. El terreno cae junto al muro del estribo (no tapa el extremo del tablero) |
| `isolatorHD(ctx, cx, cy, s, t, {base, top, cut, n, glow})` | Aislador con núcleo de plomo en detalle 2,5D: cabezal de pila, placa inferior anclada, capas de caucho y láminas de acero que se cortan sin separarse, núcleo de plomo que se deforma con ellas (no es un pistón), placa superior y viga del tablero en alzado. `base` = movimiento de la subestructura, `top` = del tablero. Devuelve puntos para rótulos |
| `damperHD(ctx, ax, ay, bx, s, t, {cut, vel, heat, force})` | Disipador viscoso en detalle: placa de anclaje atornillada al estribo, articulaciones con pasador, cilindro de longitud fija, vástago, pistón con orificios, fluido en dos cámaras con flujo esquemático en sentido contrario al pistón, calor cualitativo y flecha de **resistencia** opuesta a la velocidad (∝ √|v|) |
| `roadView(ctx, t, {vy, jz, gap, finger, cars, glow, dusk})` | Vista desde la calzada con punto de fuga: carriles, pretiles, farolas y una **junta de peine** cuya abertura `gap` nunca supera la longitud de los dientes (capacidad). Coches de frente o de espaldas |
| `bridgeSection(ctx, cx, gy, s, t, {ug, up, ud, flow, hl, iso})` | Corte transversal por una pila: estratos, pilotes, zapata, fuste, cabezal en martillo, cuatro apoyos, vigas en I, losa y pretiles; `flow` anima el **camino de cargas** del suelo al tablero |

**v1.15 · ingeniería sísmica: puente completo, sismo físico y mecanismos (episodio «Puentes sísmicos»):**

| Bloque | Uso |
|---|---|
| `quakeGround({t0, t1, amp, seed, freqs, pulses, floor})` | Movimiento del suelo determinista: suma de senos con envolvente. `pulses: [[a, b, k], …]` sube y baja la intensidad al ritmo del guion (`floor` = nivel entre pulsos; 0 = calma). Devuelve `{env(t), ug(t), ag(t)}` (desplazamiento y aceleración) |
| `sdof(ag, Tn, zeta, tA, tB, dt)` | Oscilador de un grado de libertad (Newmark) bajo aceleración de base: **la respuesta de la estructura sale de la física**, no de un seno inventado. Puente aislado ≈ `Tn 2.5, zeta 0.2`; rígido ≈ `Tn 0.6, zeta 0.05`. Devuelve `u(t)` con `.max` y `.vel(t)` (precalcular una vez, fuera de `draw`) |
| `bridge(ctx, t, {mode, ug, up, ud, section, forces, demand, xray, cut, heat, vel, glow, cars, piers, x0, x1, deckTop, bearH, plateau, valley, ground, trees, river})` | **Puente de vigas como un solo sistema**: valle con terraplenes, losas de acceso, estribos encajados en el talud (asiento, muro de guarda), zapatas que siguen la pendiente (pilotes en `section`), pilas que se curvan como ménsulas, cabezales, apoyos (`mode 'aislado'` = aisladores elastoméricos; `'rigido'` = apoyos fijos), tablero cajón con calzada, barandas y coches, juntas de peine y disipadores viscosos en los estribos. `ug` suelo, `up` deriva de la cabeza de pila, `ud` tablero absoluto. Los mecanismos se dibujan con todo su detalle dentro de la geometría: **un primer plano es solo un zoom de cámara**. Devuelve `{piers, bearings, dampers, joints}` con puntos para rótulos |
| `isolatorDetail(ctx, cx, cy, w, h, shear, t, {layers, lead, glow, bolts})` | Aislador laminado: placas atornilladas, capas de caucho y láminas de acero que se cortan en paralelogramo sin separarse, núcleo de plomo opcional. Devuelve `{top, bottom, rubber, shim, lead}` |
| `damperDetail(ctx, a, b, t, {cut, heat, vel, r, body, rod})` | Disipador viscoso entre anclajes: cuerpo de longitud fija, vástago, pistón con orificios; en corte (`cut`) se ve el fluido, el flujo según `vel` y el calor (`heat`). Devuelve `{body, piston, rod, a, b}` |
| `jointDetail(ctx, x, y, w, h, gap, t, {glow})` | Junta de dilatación en alzado (uso suelto; `bridge` ya incluye juntas de peine en la calzada) |
| `hArrow(ctx, x, y, len, c, w)` · `car(ctx, x, y, s, c)` · `SEC` | Flecha horizontal con signo; coche de perfil; paleta de ingeniería (hormigón, acero, caucho, disipación, fuerza, control, terreno, vegetación) |
| FX `temblor`, `estructura`, `hidraulico`, `metal`, `trafico` | Retumbo grave sin estruendo, crujido estructural suave, flujo hidráulico, contacto metálico leve, tráfico lejano (sin sonidos de catástrofe) |

**v1.14.2 · sistema único terreno + muralla + torres (corrección geométrica):**

| Bloque | Uso |
|---|---|
| `wallSystem(ctx, gy, xa, xb, t, {style, h, thick, build, towersX, towerSmoke, towerFire, pavilionX, ruin, sunLeft, crenel, glow})` | **Sistema único**: comparte la cresta `gy(x)` y una proyección oblicua (`D`) para muros, almenas y torres. La muralla se divide en **tramos que terminan en las caras de cada torre**. Orden de dibujo: tramo → torre → tramo, para que el muro quede delante de la cara lateral de la torre y detrás de su cara frontal. El adarve va en rampa donde la pendiente local es suave y en peldaños donde es fuerte, y se enlaza al nivel de cada torre. La cara frontal baja hasta el terreno (zócalo de piedra en el ladrillo). Las torres tienen zócalo que llega al suelo, cara lateral con **puerta al nivel del adarve donde entra el tramo**, ventanas, almenas y pabellón opcional. Las sombras proyectadas siguen la posición del sol (`sunLeft`). Devuelve las torres (`roof`, `door`, `F`) y `walk(x)` |
| `ridgePeaks(gy, xa, xb, gap)` | Cumbres de una cresta con separación mínima: se usan para poner las torres en los puntos altos |
| `rangeRidge(o)` | La misma cresta delantera de `ranges(o)`, sin dibujar (para colocar torres o cámaras antes del dibujo) |
| `ranges` (`rugged`) | Crestas rocosas y estribaciones con lado iluminado y lado en sombra según el sol |
| `wallPath`, `watchtower` | Ahora usan `wallSystem` y la misma torre (compatibles con la firma anterior) |

**Añadidos y mejoras v1.14.1 (revisión final de «Gran Muralla»):**

| Bloque | Uso |
|---|---|
| `figure(ctx, x, y, h, ph, {pose, var, dir, lift, target})` | **Persona proporcionada** (cabeza, torso, brazos y piernas articulados con IK) con túnica cruzada, faja, pantalón y calzado, y sombrero de paja, pañuelo, moño o gorro según `var`. **El pie más bajo toca siempre `y`**. Poses: `walk`, `stand`, `carry` (pértiga), `ram` (pisón con las dos manos, `lift` 0..1), `chisel` (`target`), `look` y `lead`. Para que no patine: `ph = distancia recorrida / (h · 0,85)`. Devuelve las manos, la cabeza, el hombro y los pies |
| `laborer`, `porter` (mejorados) | Usan `figure`; el porteador lleva la pértiga al hombro y la sujeta con la mano |
| `wallPath` (rediseñado) | Muralla 2,5D: sombra proyectada, cimiento que baja a la ladera, adarve con grosor, pretil interior, almenas con cara, techo y lateral, troneras, zócalo de piedra (ladrillo), mampostería (piedra) o capas erosionadas (tierra), cara final con grosor y torres integradas cuya base llega al terreno. `pavilion` añade un pabellón con tejado a las torres indicadas |
| `watchtower` (rediseñado) | Cara frontal, cara lateral con puerta al nivel del adarve, ventanas arqueadas, almenas con volumen y pabellón opcional; humo o fuego desde la azotea |
| `matFill(ctx, pts, mat, {layer, reeds, bh, glow})` | Relleno de material para cortes: `tierra` (capas), `grava` (cascajo), `piedra`, `ladrillo` (aparejo), `madera` y cañas |
| `wallSection(ctx, x, y, w, h, t, kind, {reeds, build, glow})` | **Cortes comparables**: `tierra` (apisonada, con capas de cañas opcionales), `piedra` (mampostería con relleno) y `ming` (cimiento de piedra, núcleo de tierra y cascajo, paramentos de ladrillo que se colocan hilada a hilada, adarve y parapeto). Devuelve puntos para rótulos |
| `ranges` (`part`) | `part: 'back'` / `'front'` para dibujar las capas lejanas con una cámara atenuada (**paralaje**) |
| `rammedEarth` (mejorado) | Trabajadores `figure` con pisón sujeto con las dos manos; anillo de impacto y polvo al tocar; capa suelta solo un 35 % más alta que la compactada; encofrado con travesaño atado |

Efectos `FX` de v1.14: `apisonar` (golpes de pisón), `vertido` (tierra), `ruedas`, `cascos`, `ladrillo`, `hoguera` y `pasosTierra`.

**Bloques v1.13 (episodio «Vikingos en América»)** — mar cinematográfico, barco nórdico, mapas de rutas, arqueología y tiempo:

| Bloque | Uso |
|---|---|
| `seaHD(ctx, t, {hor, sky, sun, sunA, clouds, mood, amp, flow, fogA, seed, x0, x1, part, split})` | **Mar cinematográfico** por filas en perspectiva: cielo, nubes, sol, olas de varias escalas, crestas con espuma y niebla. `mood`: `calma`, `fresco` o `tormenta`. `flow` hace que el mar pase junto al barco. Se dibuja en dos pasadas (`part: 'back'` hasta `split`, luego el barco, luego `part: 'front'`) para que el agua tape bien el casco. **Devuelve `float(x, y, eslora)` → `{y, ang}`** para que el barco cabecee y suba con las olas |
| `seaWave(o, x, y, t)` | Altura del agua en un punto (misma fórmula del mar) |
| `knarr(ctx, x, y, s, t, {ang, sail, billow, oars, oarN, oarPhase, xray, flex, crew, wake, glow, flip})` | **Barco mercante nórdico** de perfil, con casco trincado (tablas superpuestas con remaches), roda y codaste, remo de gobierno, mástil, verga, vela cuadrada con franjas, jarcia, remos opcionales y tripulación sobria (sin cascos con cuernos). `xray` vuelve el casco transparente y muestra la quilla, las cuadernas y los bancos. `flex` es una flexión sutil. **Devuelve puntos** (`mastTop`, `sailC`, `keelC`, `hull(u, f)`, `oar`…) para los rótulos |
| `clinkerSection(ctx, cx, cy, w, h, t, {explode, flex, glow, n})` | Corte transversal del casco trincado: tracas que se solapan, remaches, quilla, cuaderna y bao. `explode` separa las tablas para mostrar el solape. Devuelve `overlaps`, `keel`, `rib`, `beam` |
| `northAtlantic(ctx, x, y, w, h, t, {lon0, lon1, lat0, lat1, ice, grid})` | Mapa ESTILIZADO del Atlántico Norte (Escandinavia, Islandia, Groenlandia con hielo, Baffin, Labrador y Terranova). **Devuelve `proj([lon, lat])`** |
| `seaRoute(ctx, pts, p, t, {c, w, ship, shipS, glow})` | Ruta marítima suave que se dibuja con `p` y lleva un barquito en la punta |
| `coast(ctx, y, t, {kind, h, x0, x1, c, snow, green})` | Costa lejana sobre el horizonte: `fiordo`, `volcanica`, `glaciar` o `baja` |
| `iceberg(ctx, x, y, s, t)` | Iceberg con la parte sumergida insinuada |
| `sodHouse(ctx, x, y, w, h, t, {ruin, smoke, doorX, glow})` | Casa nórdica de madera y césped; `ruin` la convierte en los restos arqueológicos (bases de muros bajo la hierba) |
| `treeRings(ctx, x, y, r, t, {n, hi, count, cut})` | Corte de madera con anillos de crecimiento, anillo destacado, recuento hasta la corteza y marca de corte. Devuelve `at(i, ángulo)` |
| `timeline(ctx, x0, x1, y, t, {from, to, step, p, marks, span, spanP})` | Línea temporal con marcas grandes y un tramo luminoso entre dos fechas. Devuelve `map(año)` |
| `nightSky(ctx, t, {a, y0, y1, n, band, mark})` | Cielo nocturno con estrellas que titilan y vía láctea |
| `norse(ctx, x, y, h, ph, {pose})` | Persona nórdica estilizada (túnica, capa y gorro); poses `stand`, `look`, `row`, `point` y `walk` |

**Añadidos y mejoras v1.13.1 (revisión maestra de «Vikingos»):**

| Bloque | Uso |
|---|---|
| `knarr` (rediseñado) | Casco con volumen: cara interior de la borda opuesta, cuadernas, bancos y carga (`cargo`), tracas con vetas y tonos variables, juntas de empalme, remaches, quilla marcada, timón lateral con caña y tojo, obenques con vigotas, braza y escotas. `roll` inclina la borda y el mástil; la vela «respira» con ráfagas. Devuelve además `wl` (línea de flotación), `bowWL`, `sternWL` y `oarTips` |
| `knarrWater(ctx, K, t, {speed, spray})` | Espuma en la línea de flotación, bigote de proa, estela y reflejo oscuro. Se dibuja **después** del mar delantero |
| `seaHD` (mejorado) | Sombreado por fila (crestas claras, senos oscuros), destellos del sol sobre el agua, nubes suaves, `flash` (relámpago) y `crest` |
| `clinkerSection` (nuevos parámetros) | `assemble` (las tablas entran una a una) y `rivets` (los remaches aparecen en orden) |
| `northAtlantic` (mejorado) | Costas más fieles (fiordos de Noruega, golfo de Botnia, Islandia, Groenlandia completa, Baffin, Labrador, golfo de San Lorenzo, Terranova) y `latRef` para la proyección |
| `navigator(ctx, x, y, h, t, {look, turn, wind, rim})` | Navegante nórdico de espaldas en 3/4: túnica con cinturón, capa con broche al viento, polainas, gorro y barba; mano a la frente que se anima (`look`) y luz de contorno |
| `longhouse(ctx, x, y, w, d, h, t, {roof, ruin, smoke, door, glow})` | Casa larga de madera y turba en 3/4, apoyada en el suelo con sombra de contacto: muros de turba en espiga, tejado de turba con hierba y puerta con marco. `ruin` la convierte en las bases de muros excavadas |
| `timber(ctx, x, y, w, h, t, {glowEnd, cuts})` | Pieza de madera arqueológica con borde de corteza, cortes de herramienta y testa con anillos |
| `timeline` (mejorado) | Los rótulos nunca salen del lienzo y se omiten las cifras del eje que chocan con una marca |

Efectos `FX` de v1.13: `oleaje`, `madera` (crujidos del casco), `vela` (se iza y se llena), `cuerdas`, `remo`, `pasos`, `martillo` (remachado), `mapa`, `descubrir` y `costa`.

**Música orquestal sintética `PLANTILLA.MUS`** (v1.13; no modifica `SOUND`): `MUS.epica(k, t0, t1, {bpm, chords, gain, drums, strings, drone, ostinato})` combina cuerdas de ataque lento, bordón grave, ostinato y percusión de tambor grave. `MUS.golpe(k, t, {chord})` es un golpe orquestal para las revelaciones. Se usa dentro de `music(k)`.

**Bloques v1.12 (episodio «Machu Picchu»)** — montaña, mampostería, terrazas, drenaje y agua:

| Bloque | Uso |
|---|---|
| `andes(ctx, t, {sky, sun, peaks, layers})` | Cordillera por capas con perspectiva atmosférica |
| `fog(ctx, y, h, t, {a, speed})` | Banda de niebla que deriva entre montañas |
| `rainSheet(ctx, t, {x, y, w, h, n, a})` | Lluvia en diagonal sobre un área |
| `granite(ctx, pts, {c1, c2, bevel})` | Relleno de granito con motas y bisel, para cualquier polígono |
| `stoneWall(ctx, x, y, w, h, {style, skip})` | Muro `poligonal` (bloques que comparten vértices: encajan sin huecos), `sillar` (hiladas) o `rustica` (piedra de campo con juntas de barro). `skip` deja un hueco para animar un bloque que encaja. **Devuelve los polígonos** |
| `terraces(ctx, x0, y0, sw, sh, n, t, {build, cut, water})` | Terrazas escalonadas sobre una ladera, en corte: muros y relleno por capas que se construyen y se revelan, con agua que se infiltra |
| `terraceCut(ctx, x, y, w, h, t, {reveal, labels, water})` | **Corte grande de una terraza** (diagrama clave): muro, capas suelo/arena/grava/piedras con rótulos, roca de la ladera, infiltración y salida del agua al pie del muro |
| `channel(ctx, pts, t, {fill})` | Canal de piedra con agua que fluye (abastecimiento por gravedad) |
| `incaFountain(ctx, x, y, s, t, on)` | Fuente tallada con caño, chorro y pila |
| `citadel(ctx, cx, cy, s, t, {age, canal, glow, fogA, seed, frontRows})` | Ciudadela de montaña (v1.12.1). La geometría se construye desde las **plataformas**: el perfil del cerro sale de ellas, y cada edificio se apoya en una plataforma urbana (fila trasera sobre un escalón de granito) con sombra de contacto, así que nada flota. Incluye sector agrícola con andenes, sector urbano, plaza, escalinatas, muros de contención de granito, terrazas frontales en la ladera (`frontRows`, 5 por defecto), pico de fondo separado (sin edificios) y canal que baja en escalera hasta las fuentes. `age` 0 = reconstrucción (techos de paja), 1 = estado actual. `glow` resalta muros, drenaje y agua por separado. Devuelve `{plats, ground(x)}` para colocar personas u objetos sobre el suelo |

Efectos `FX` de v1.12: `lluviaFuerte`, `golpePiedra` (percusión), `abrasion`, `encaje` (bloque que asienta), `arroyo` (agua por un canal) y `tiempo` (transición histórica).

**Bloques v1.11 (Andrómeda V2, rediseño cinematográfico)** — 3D ligero, nave, espacio profundo y gráficas:

| Bloque | Uso |
|---|---|
| `M3` (`loft`, `box`, `draw`, `project`, `rot`) | Mini motor 3D para Canvas: mallas de caras con sombreado lambert, luz de contorno, brillo especular, orden por profundidad y perspectiva. Sirve para cualquier objeto técnico que deba verse en 3/4 |
| `starship(ctx, x, y, s, t, {yaw, pitch, roll, thrust, ring})` | **Nave interestelar Asombroteca** (diseño original, siempre la misma): escudo frontal contra polvo, espina de titanio, carenado, anillo habitable giratorio, depósitos, radiadores, 3 toberas con chorro de partículas y luces de navegación. Vistas lateral, frontal, trasera y 3/4. `pitch = π/2` = proa hacia arriba |
| `deepSpace(ctx, t, {px, py, streak, dir, neb})` | Espacio profundo con nebulosa tenue y 3 capas de estrellas con **paralaje** (la cámara «viaja» con px/py); estelas opcionales (estilizadas) |
| `galaxyHD(ctx, x, y, r, {seed, tilt, rot, spin})` | Galaxia de ~120.000 partículas: disco, brazos, bulbo, regiones HII, polvo y bloom (en caché) |
| `holoClock(ctx, x, y, r, secs, color, label, value, {sub})` | Reloj holográfico con barrido de segundero y valor digital grande |
| `chart(ctx, x, y, w, h, series, {xr, yr, logY, p, xTicks, yTicks, xLabel, yLabel})` | Gráfica científica integrada (ejes grandes, rejilla, curvas con brillo que se dibujan con `p`, escala logarítmica opcional). **Devuelve `map(x, y)`** para añadir marcas |

Efectos `FX` de v1.11: `encendido` (motores que arrancan), `pasada` (la nave pasa junto a la cámara) y `holo` (interfaz holográfica).

**Bloques v1.10 (episodio «Viaje a Andrómeda»)** — espacio y relatividad:

| Bloque | Uso |
|---|---|
| `REL.trip(D, a)` | **Simulación** de un viaje con aceleración propia constante (acelera la 1.ª mitad y frena la 2.ª) en años y años luz: `tauTot`, `tTot` y `at(f)` → `{ tau, t, x, beta, gamma, eta, oneMinusBeta }`. Úsala como fuente única de relojes, velocidades y distancias; `REL.G1` = 1 g |
| `betaText(1 − v/c)` | v/c como texto con los nueves necesarios (nunca «1 c») |
| `space(ctx)` · `starfield(ctx, t, {eta, cy, F})` | Fondo espacial y campo de estrellas con aberración relativista estilizada (rapidez `eta`) |
| `galaxy(ctx, x, y, r, {seed, tilt, rot, core, arm})` | Galaxia espiral en caché (brazos, bulbo y polvo) |
| `spaceship(ctx, x, y, s, ang, t, {thrust, cut})` | Nave interestelar con chorro de propulsión y corte por zonas |
| `missionClock(ctx, x, y, label, value, color, {sub, prog})` | Panel de reloj o contador de misión |
| `speedGauge(ctx, x, y, r, 1 − v/c)` | Velocímetro logarítmico que se acerca a c sin tocarla |
| `spacetime(ctx, x, y, w, h, lines)` | Diagrama de Minkowski: líneas de universo, cono de luz y marcas de tiempo propio |
| `cockpit(ctx, t, view)` | Cabina con ventana panorámica (el exterior se dibuja en un callback), consolas y astronauta de espaldas |
| `scientist(ctx, x, y, h)` | Silueta histórica estilizada |

Efectos `FX` de v1.10: `espacio`, `propulsion`, `aceleracion`, `frenado`, `reloj`, `galaxia`, `contraer` y `llegada`. Son recursos cinematográficos: en el vacío no se propaga el sonido.

**Bloques v1.9 (episodio «El barco de acero»)** — flotación, hidrostática y barcos:

| Bloque | Uso |
|---|---|
| `seaProfile(ctx, y, t, {sky, sun, depth, x0, x1, bottom})` | Mar de perfil completo: cielo, sol, agua con cáusticas y oleaje |
| `underwater(ctx, y, t, {...})` | Velo de agua para lo sumergido (se dibuja DESPUÉS del objeto) |
| `cargoShip(ctx, x, y, L, draft, t, {H, rows, cut, comps, flood, disp, plimsoll, trim, extraBay})` | Portacontenedores de perfil: calado real, corte longitudinal con mamparos, compartimentos que se inundan, volumen sumergido resaltado, marca Plimsoll, asiento y contenedores añadidos. **Devuelve geometría** (`deck`, `keel`, `bay(i)`, `comps`) |
| `hullSection(ctx, cx, wl, w, h, sink, t, {disp, sep, cargo, flood})` | Sección transversal del casco con aire, carga y el volumen desplazado (que se puede separar). **Devuelve `cob`** (centro de empuje) |
| `forceArrow(ctx, x, y, len, dir, color, label)` | Flecha de fuerza gruesa (empuje, peso, tensión…) |
| `pressureArrows(ctx, pts, y0, t)` | Presión normal a una superficie sumergida, creciendo con la profundidad |
| `splash(ctx, x, y, t, t0)` | Salpicadura determinista |
| `container`, `gantryCrane` | Contenedor y grúa de muelle (**devuelve el spreader**) |
| `beaker`, `greek`, `column` | Vaso con rebosadero, figura clásica y columna (historia de la ciencia) |

Efectos `FX` de v1.9: `chapuzon`, `hundirse`, `casco` (crujido metálico), `grua`, `contenedor`, `inundacion`, `bocina` (de barco) y `equilibrio` (acorde de resolución).

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
