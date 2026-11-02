# FUENTES Y DECISIONES · «Julio Verne imaginó los viajes a la Luna en 1865» (Episodio 04)

Asombroteca · Plantilla v1.22 (módulo Verne / Apolo)

## Datos históricos (verificación)
| Dato | En pantalla | Base |
|---|---|---|
| *De la Terre à la Lune* se publicó en 1865 | «DE LA TIERRA A LA LUNA» · 1865 | Bibliografía estándar de Verne (Hetzel, 1865) |
| Julio Verne, 1828–1905, escritor francés | «escritor francés (1828–1905)» | Biografía estándar |
| La novela lanza un proyectil tripulado con un cañón gigantesco (el Columbiad) enterrado en un pozo de unos 900 pies en Stone's Hill, Florida | «≈ 274 m DE PROFUNDIDAD · 900 pies en la novela», «STONE'S HILL · FLORIDA» | Texto de la novela (cap. sobre el Columbiad) |
| Tres viajeros (Barbicane, Nicholl y Ardan) | «3 VIAJEROS» (figuras genéricas, sin rostros inventados de personas reales) | Texto de la novela |
| El rodeo de la Luna se narra en *Autour de la Lune* (1870); no alunizan | «NOVELA: RODEAN LA LUNA · "Alrededor de la Luna", 1870», «EN LA NOVELA NO ALUNIZARON» | Bibliografía estándar |
| Apolo 11 despegó el 16 de julio de 1969 desde el complejo 39A (Cabo Cañaveral, Florida) con un Saturno V | «LANZAMIENTO REAL · 16 de julio de 1969», «SATURNO V · PLATAFORMA 39A» | NASA (KSC-69PC-442) |
| Tripulación: Armstrong, Collins y Aldrin; Armstrong y Aldrin pisaron la Luna, Collins quedó en órbita | «ARMSTRONG · COLLINS · ALDRIN» (orden de izquierda a derecha en la foto), «ARMSTRONG Y ALDRIN CAMINARON · Collins quedó en órbita lunar» | NASA |
| El cañón no era una alternativa viable para personas: la velocidad necesaria en un recorrido tan corto implica una aceleración extrema | «RECORRIDO CORTO + VELOCIDAD ENORME ⇒ ACELERACIÓN EXTREMA · mortal para los pasajeros», sin cifras | Cinemática básica (a = v²/2L). No se muestra ningún número de fuerzas g |
| El cohete acelera durante varios minutos y no de forma constante | Gráfico cualitativo velocidad–tiempo con tramos de distinta pendiente; «esquema cualitativo · sin escala» | Perfil de ascenso del Saturno V (etapas S-IC, S-II y S-IVB) |

**No se pudo consultar ninguna fuente en línea desde la sesión** (red restringida). Los datos anteriores son hechos de referencia ampliamente documentados.

## Documentos auténticos (`01_ENTRADA/referencias_originales/`)
Imágenes adjuntadas por el usuario, que coinciden con el paquete de descarga (`descargar_imagenes.py` y `FUENTES_ORIGINALES.txt`).

| Archivo | Uso | Procedencia y licencia |
|---|---|---|
| 01 Julio Verne | Al nombrarlo (12,2–14,2 s), flotando junto al escritorio | Atelier Nadar / Paris Musées – Carnavalet, CC0. **Datación 1860–1890**: no se afirma que sea de 1865 |
| 02 Grabado de Henri de Montaut (1868) | Al describir la cápsula (18,4–20,2 s), junto al modelo 3D | Dominio público. Ilustración de **ficción**, rotulada como tal |
| 03 Tripulación Apolo 11 | Al nombrar a Armstrong, Aldrin y Collins (58,2–60,7 s) | NASA, dominio público EE. UU. |
| 04 Saturno V despegando | Al explicar el Saturno V (64,5–67,2 s) | NASA KSC-69PC-442, dominio público EE. UU. |
| 05 Buzz Aldrin en la Luna | En el alunizaje del Eagle (77,5–79,8 s) | NASA AS11-40-5869, dominio público EE. UU. Se identifica como Aldrin |

**Tratamiento de las imágenes:**
- Solo se reducen de tamaño para incrustarlas en `js/fotos.js`.
- Se muestran sobre un plano flotante con perspectiva, sombra y marco fino.
- No se recolorean, no se animan los rostros y no se recortan.
- No implican patrocinio de la NASA.

## Recreaciones
Se rotulan con discreción: «RECREACIÓN HISTÓRICA», «FICCIÓN DE VERNE · RECREACIÓN», «DISPOSITIVO FICTICIO», «VISUALIZACIÓN CONCEPTUAL», «RECREACIÓN 3D» y «ESQUEMA · NO A ESCALA».

- Estudio y escritor: figura genérica, sin pretender ser un retrato.
- Cápsula y Columbiad: según la novela.
- Lanzamiento ficticio.
- Saturno V y plataforma 39A en 3D: proporciones aproximadas, 110,6 m.
- Trayectorias.
- Eagle.

**Precisión de los recorridos:** en el esquema el Saturno V completo no llega a la Luna; solo la nave Apolo viaja, y la trayectoria no se presenta como la exacta.

## Voz
`01_ENTRADA/audio/voz_original_julio_verne.mp3`: md5 `db27223bfaa6acbed5f489dc889453b7`, 89,73 s, sin cambios.

Transcripción local (Whisper) corregida en `03_GUION/tramos.txt`:
- «Berné» → Verne;
- «I'm strong, aldrin and colins» → Armstrong, Aldrin y Collins;
- «la polo 11» → Apolo 11;
- cifras con su forma hablada.

## Música y efectos (originales)
- **Música:** `MUS.piano` (1865, misterio), `MUS.pulso` (cañón y tensión), `MUS.epica` (asombro y 1969, con tambores en el despegue), piano emotivo en la Luna y resolución épica suave. Sin obras protegidas.
- **Efectos nuevos de la plantilla:** `FX.canonazo` (en la atmósfera) y `FX.saturno` (en tierra). En el espacio no hay explosiones; solo música y texturas no diegéticas.

## Corrección cinematográfica (V2 · `ASOMBROTECA_JULIO_VERNE_LUNA_FINAL.mp4`)
- Proyectil: modelo único `P.vCapsule3`/`P.vCapsuleAt` en todas las escenas; metal remachado con portillas de bronce, sin motores, alas ni antenas (la novela describe un proyectil de aluminio disparado por cañón).
- Stone's Hill: lugar FICTICIO de la novela, cerca de Tampa (Florida). Se marca sin coordenadas en pantalla y rotulado «ficción».
- Cabo Kennedy · Complejo 39A: lugar REAL del lanzamiento del Apolo 11 (16 jul 1969; en 1963–1973 el cabo se llamó Cabo Kennedy). Marca aproximada, sin coordenadas en pantalla.
- Aceleración: comparación cualitativa (cañón: recorrido corto ⇒ aceleración extrema; Saturno V: varios minutos por etapas, aceleración no constante). Sin cifras de g ni velocidades.
- Eagle (módulo lunar) distinto de Columbia (módulo de mando): Armstrong y Aldrin en la superficie, Collins en órbita lunar.
- Trayectorias: esquemas no a escala; la novela «De la Tierra a la Luna» (1865) continúa en «Alrededor de la Luna» (1870), donde los viajeros rodean la Luna sin alunizar.
- Créditos en pantalla: Atelier Nadar · Paris Musées (CC0); Henri de Montaut · dominio público; NASA; NASA · KSC-69PC-442; NASA · AS11-40-5869.
- Revisión del audio: no se detectaron errores históricos en la narración.
