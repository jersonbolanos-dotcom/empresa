# SUPERPROMPT · PLANTILLA ASOMBROTECA (para cualquier video)

Copia este texto en Claude Code, abierto en la carpeta `PLANTILLA_ASOMBROTECA`, y completa los campos marcados con ⟨ ⟩.

---

Actúa como director científico, guionista visual, animador Canvas/JavaScript, diseñador de sonido y supervisor de postproducción. Vas a producir un video vertical de Asombroteca usando **la PLANTILLA ASOMBROTECA de esta carpeta**. No inventes otro sistema.

**MI VIDEO**
- Tema: ⟨tema o título⟩
- Audio: ⟨nombre del archivo⟩, que pondré en `⟨carpeta del video⟩/01_ENTRADA/audio/`
- Guion (opcional): ⟨pega aquí el guion o déjalo vacío; manda el audio⟩
- Fotos reales (opcional): ⟨archivos en 01_ENTRADA/fotos/ y dónde van⟩
- Piel: ⟨plana | oscura | elige tú⟩
- Modo: ⟨«Trabaja»: produce el MP4 sin pedirme aprobación | «Storyboard primero»: muéstrame el storyboard y espera mi OK⟩

**LEE PRIMERO**
- `00_LEEME_PRIMERO.md`
- `INSTRUCCIONES_PLANTILLA.md`. Sus reglas son obligatorias.
- `catalogo/` y `ejemplo_submarino/04_CODIGO/js/episodio.js`, como referencia de calidad y de uso de los bloques.

**REGLAS QUE NO SE ROMPEN**
1. **Voz y guion.**
   - No alteres, sintetices, aceleres ni recortes mi voz.
   - El audio manda sobre cualquier guion. Si no coinciden, transcribe y repórtame las diferencias.
   - No cambies el guion.
2. **Datos.**
   - No inventes cifras. Verifica con fuentes cada dato que aparezca en pantalla y anótalo en `FUENTES_Y_DECISIONES.md`.
   - Si algo es incierto, rotúlalo como «posible» o «probable».
3. **Formato.** 1080×1920, 30 fps, H.264 + AAC 48 kHz, MP4 de menos de 100 MB.
4. **Marca.** Sin logos de terceros; solo la palabra ASOMBROTECA en el cierre.
5. **Temas sensibles.** Respeto: sin explosiones ni dramatización, con silencio en el momento.
6. **Determinismo.** `window.seek(t)`, `window.DURATION`, `window.scoreSound`. `H.rng` y nunca `Math.random`. H y SOUND sin modificar.
7. **Versiones.** No sobrescribas versiones anteriores. Si corrijo algo, cambia solo eso.

**CÓMO CONTARLO**
- Estructura: **PROBLEMA → EXPLICACIÓN → CASO o CONSECUENCIA → SOLUCIÓN o LECCIÓN → CIERRE** (ASOMBROTECA + «Seguir»).
- Gancho en menos de 2 s.
- Algo cambia cada 1–2 s, siempre en una palabra concreta de la voz.
- Usa los bloques de la plantilla: lupa, bocadillo con ✗ o ✓, contador, onomatopeya, dominó, manómetro, flechas, personas, escudo de solución.
- Usa metáforas visuales claras y comparaciones de escala con objetos cotidianos.
- Pon un momento de énfasis en la idea clave.
- Si existe una solución real, muéstrala explícitamente.
- Subtítulos estándar Asombroteca: `capStyle: 'barra'` (blanco, sin caja, barra amarilla) con 10–25 palabras clave en amarillo. El estilo «selección» (arriba, palabra a palabra) queda como alternativa.
- Contenido entre y ≈ 260 y 1400; los subtítulos van hacia y ≈ 1540. Nada importante en los 250 px inferiores.

**SONIDO**
- Cada aparición, etiqueta, flecha, tachado, contador, onomatopeya y transición lleva su efecto (`PLANTILLA.FX`), en el fotograma exacto.
- La voz siempre delante.
- Música original en un stem aparte, que se retira en los momentos sensibles.
- Mezcla a unos −14 LUFS con pico verdadero ≤ −1 dBFS (ducking de la música con la voz; ver `INSTRUCCIONES_PLANTILLA.md`).
- En el espacio no se propaga el sonido: los efectos del vacío son recursos cinematográficos y así se documentan.

**PROCESO**
1. Preparar la voz con `tools/preparar_voz.sh`. Corregir los tramos, alinear y generar subtítulos (`js/datos.js`).
2. Investigar y verificar los datos.
3. Escribir `js/episodio.js` partiendo de `nuevo_video/04_CODIGO/js/episodio.js`.
4. Revisar una hoja de contacto de unos 20 instantes y corregir textos encimados o cortados.
5. Si el modo es «Storyboard primero», entregar el storyboard (10–12 paneles dibujados con el mismo código) y esperar mi OK.
6. Renderizar, generar los stems, mezclar y codificar.
7. QC completo (ffprobe, decodificación, negros y congelados, sonoridad, md5 de la voz, determinismo) y **retrocompatibilidad**: los episodios anteriores deben dar los mismos hashes con la plantilla nueva. Documentación: README, QC y fuentes.
   - Borra los fotogramas temporales de los episodios ya entregados: un disco lleno hace fallar Chromium.
8. Commit y push. Entrégame el MP4 en el chat y dime qué mejoras hiciste al prompt.

**SI FALTA ALGO EN LA PLANTILLA**

Si mi video necesita algo que la plantilla no tiene (un objeto, gráfico, transición, efecto de sonido o piel), créalo. Si es reutilizable, **añádelo a la plantilla** siguiendo la sección 9 de `INSTRUCCIONES_PLANTILLA.md`:
- hazlo genérico;
- no rompas el ejemplo;
- añádelo al catálogo;
- anótalo en `CAMBIOS_PLANTILLA.md`;
- regenera el ZIP.

Dime qué añadiste.

Si sientes que al prompt le falta algo para que el video se vea mejor, hazlo y explícamelo.

**REGLAS APRENDIDAS EN LOS EPISODIOS (aplícalas siempre)**
1. **Una fuente por cifra.** Cada número en pantalla lleva su fuente en `FUENTES_Y_DECISIONES.md`. Si es una estimación, se rotula «≈» o «(estimación)». Si no hay una cifra universal (p. ej. la densidad media de un barco), se muestra cualitativa («menos de 1»).
2. **Cálculos verificados.** Si el guion da resultados numéricos (tiempos, velocidades, energías), impleméntalos como una **simulación** (p. ej. `P.REL` para relatividad) y verifícalos con un cálculo independiente (Python) antes de animar. Los contadores salen de la simulación y nunca se animan a mano para «cuadrar» con el guion.
3. **Escala humana.** Pon una persona junto a cada objeto gigante (pirámide, bloque, turbina, generador).
4. **Rótulos honestos.** «Mapa estilizado», «escala no real», «ilustración conceptual», «efecto estilizado», «hipótesis», «escenario idealizado», según corresponda.
5. **Debates abiertos.** Muéstralos como tales: varias hipótesis, signos de pregunta y la palabra «hipótesis» en pantalla.
6. **Fuerzas y magnitudes.** Cada fuerza tiene un color y una dirección fijos en todo el video (empuje verde hacia arriba, peso rojo hacia abajo…). Los equilibrios se alcanzan con movimiento amortiguado, no con paradas bruscas.
7. **Límites físicos.** Nada supera lo que no puede superarse: velocímetros en fracción de c que nunca llegan a 1, tuberías llenas, la pared de la represa que no genera electricidad, etc.
8. **Legibilidad.** En fondos claros (desierto, cielo, nieve), los textos llevan cápsula oscura semitransparente y hay una franja bajo los subtítulos.
9. **Continuidad física.** Un mismo «mundo» o corte técnico atraviesa varias escenas con la cámara (`P.camAt`). Evita escenas aisladas tipo diapositiva.
10. **Procesos con pasos.** Cuando el guion enumera pasos («localizar, recuperar y reparar»), muéstralos como una fila numerada que se enciende con la voz.
11. **Cierres circulares.** Vuelve a la imagen del gancho, ahora entendida.
12. **Transcripción.** Corrige en los subtítulos los errores de Whisper (nombres, cifras, «Asombroteca») sin tocar el audio. Las cifras habladas se escriben `2|dos` en `tramos.txt`.
13. **Revelar lo oculto.** Si la clave está dentro o debajo de algo (terrazas, cascos, generadores), muestra primero la superficie y luego vuélvela transparente o córtala. La revelación es un momento, no un rótulo.
14. **Antes y después en la misma toma.** Las transiciones temporales (reconstrucción ↔ estado actual) se hacen sobre el mismo encuadre para que se puedan comparar.
15. **Sistemas parecidos, separados.** Si dos sistemas se parecen (drenaje de lluvia y abastecimiento de agua; aire y empuje…), dales colores distintos y dilo en pantalla.
16. **Cuantificadores honestos.** «En algunos muros», «muchas estructuras», «con conservación», «no sabemos cómo se movió cada bloque»: si el guion generaliza, la pantalla matiza sin contradecir la voz.
17. **Nada flota.** Toda construcción se apoya en una superficie definida: primero se diseñan las plataformas y el terreno, y los edificios se colocan sobre ellas (nunca al revés). Revisa cada reaparición de un escenario, sobre todo en los movimientos de cámara.
18. **Texto legible.** Mínimo 32 px para notas y 36 px para rótulos; si no cabe, se parte en dos líneas antes que achicarlo. Las notas no invaden la franja de subtítulos (y < 1420).
19. **Escena compartida con dos pasadas.** Cuando un objeto está dentro de un medio (barco en el mar, buzo en el agua), dibuja el fondo, luego el objeto y luego el plano delantero del medio. Así el agua tapa el casco de forma creíble y el objeto «flota» de verdad (usa `seaHD(...).float`).
20. **Mapa + ventana de paisaje.** En los viajes por etapas, deja el mapa fijo y abre una ventana con el paisaje de cada lugar (costa volcánica, glaciar, asentamiento). Así no se pierde la orientación y cada etapa aporta algo visual nuevo.
21. **Precisión histórica en pantalla.** Si el tema roza un mito o una afirmación peligrosa («descubrieron América», «cascos con cuernos», «fecha de toda la ocupación»), una nota breve lo matiza sin contradecir la voz: «tierras ya habitadas por pueblos indígenas», «fecha de un trabajo con madera».
22. **Música por actos.** Usa `MUS.epica` por tramos que siguen el arco (misterio → curiosidad → aventura → revelación → resolución) y `MUS.golpe` en las 3 o 4 revelaciones principales; nunca en cada frase.
23. **Contadores honestos.** Si un dato científico se obtiene contando (anillos, capas, años), no muestres cifras intermedias que parezcan resultados: usa «contando…» y revela solo el valor final verificado.
24. **Rutas por mar y leyenda.** Las rutas de un mapa nunca cruzan tierra. Distingue en la leyenda «ruta aproximada» (línea discontinua) de «sitio documentado» (marca sólida).
25. **El protagonista con volumen.** El objeto central (barco, máquina, edificio) lleva sombra de contacto, una cara interior o lateral visible, variaciones de material y responde al medio: cabeceo y balanceo en el agua, espuma, estela. Cambia de encuadre entre escenas para no repetir la misma toma.
26. **Procesos que se ven ocurrir.** Si el guion explica una técnica (apisonar, remachar, tallar), muestra el cambio físico paso a paso: el material suelto que pierde volumen, la herramienta que toca la superficie, la capa siguiente. Nunca hagas aparecer el resultado terminado de golpe.
27. **Geometría explícita para lo que se apoya.** Personas, pilas de material y edificios se colocan sobre una línea de suelo definida (función `gy(x)` o `ridge(x)`), con sombra de contacto. Si una escena de paisaje deja figuras «flotando» sobre una ladera uniforme, redibuja el primer plano con una cornisa o un camino.
28. **Mapas de periodos honestos.** Cuando una obra se hizo en épocas distintas, usa un color por periodo y una leyenda, haz aparecer los tramos en orden y rotula el mapa como «esquema aproximado». No dibujes una única línea continua desde el principio.
29. **Indicadores con significado.** Todo número en pantalla debe tener una escala clara (por ejemplo, «CAPA 3 DE 7 · compactación 0–100 %»). Nada de porcentajes por encima de 100 ni valores de depuración. Si una magnitud física no está verificada, muestra un progreso, no una medida.
30. **Personas creíbles.** Nada de figuras de palitos: usa `P.figure` (proporciones, ropa de época, herramientas sujetas con las manos). Calcula la fase de la marcha a partir de la distancia recorrida para que los pies no patinen, y apoya cada figura en la línea de suelo o el sendero.
31. **Arquitectura como un solo sistema.** Terreno, muros y torres comparten coordenadas y una única proyección. Los tramos terminan en las caras de las torres (nunca una torre-rectángulo pegada sobre una línea continua). Respeta el orden de dibujo según la profundidad, pon las puertas donde llega el camino superior y haz que las bases sigan el terreno y que las sombras coincidan con el sol. Comprueba en fotogramas fijos de planos generales y de acercamientos.
32. **El movimiento sale de la física.** Si el tema es una vibración o un sismo, genera la excitación (`P.quakeGround`) y calcula la respuesta con `P.sdof` (periodo y amortiguamiento creíbles), precalculada fuera de `draw`. Nada de senos inventados por pieza: el suelo mueve las bases, las bases a las pilas, las pilas al tablero, y los mecanismos responden al **desplazamiento relativo** entre las piezas que unen.
33. **Amplificar se declara.** Si un desplazamiento real (centímetros) se escala para que se vea, rotúlalo en pantalla («MOVIMIENTO AMPLIFICADO PARA VISUALIZACIÓN») mientras dure, y limita la deformación para que las piezas no se separen ni se atraviesen (p. ej. corte del aislador ≤ 0,5 de su altura, juntas que nunca llegan a cero).
34. **Primer plano = zoom de cámara sobre la misma geometría.** Los mecanismos (apoyos, disipadores, juntas…) se dibujan a escala dentro del objeto completo; para «entrar», mueve la cámara y haz que **acompañe a la pieza de referencia** (la pila, el estribo) para que se lea el movimiento relativo. Nunca un dibujo suelto pegado encima como una pegatina.
35. **Comparar con honestidad.** En comparaciones (rígido frente a controlado) muestra un indicador medible (demanda, desplazamiento) y matiza: no todos los casos usan la tecnología, ningún diseño es infalible, «parte de la energía», no «toda». Evita sonidos y visuales de catástrofe cuando el guion no los pide.
36. **Una cámara por idea.** No repitas la misma vista: alterna tres cuartos (escala), lateral (desplazamientos), bajo el tablero (apoyos), corte transversal (camino de cargas), vista desde la calzada (juntas) y primeros planos de detalle; cada cambio responde a la frase que se narra. Si la escena 2,5D tiene profundidad `D`, úsala como cámara e interpólala para orbitar.
37. **Primer plano mecánico = la misma pieza con contexto.** Al pasar a escala de detalle, conserva lo que la sujeta (viga, cabezal, estribo) y enseña el mecanismo en orden: reposo → movimiento de la subestructura → respuesta relativa. Cada componente con su comportamiento (el plomo se corta con el caucho; el pistón es del disipador) y su material con color propio.
38. **Indicadores cualitativos y rótulos sobrios.** Las barras y flechas sin modelo verificado se rotulan «indicador cualitativo», sin porcentajes. El aviso de amplificación aparece solo al inicio de cada plano con movimiento. Los vehículos nunca cruzan una junta mientras se mueve: se detienen antes y luego la junta responde dentro de su capacidad.
39. **Un mundo, dos secciones.** Si el tema combina agua, terreno y una obra, define primero un sistema de coordenadas común (niveles, perfil del lecho, capas, eje de la obra) y dibuja con él tanto la sección longitudinal como la transversal; así el túnel nunca flota en el agua ni cambia de profundidad entre escenas. Descender o ascender = mover la cámara por la misma sección.
40. **Máquinas por fases, no todo a la vez.** Representa los ciclos reales (p. ej. tuneladora: excavar empujando contra el último anillo → montar el anillo con el erector) con un único parámetro de avance; los cilindros, la cabeza y el erector leen ese estado. Si se acelera el tiempo, se rotula «TIEMPO ACELERADO».
41. **El material tiene recorrido.** Lo que se excava, bombea o transporta se ve viajar por un camino físico continuo (cámara → tornillo → cinta → vagonetas) y la cámara puede seguirlo; nada desaparece. Distingue componentes que parecen iguales (sello de junta ≠ relleno anular; EPB ≠ hidroescudo de lodos) con rótulos y colores propios.
42. **Primero la mecánica, después el brillo.** Antes de pulir luces o sombras, comprueba en fotogramas consecutivos que cada pieza está anclada a otra (vástago ↔ anillo, boca del tornillo ↔ cámara, pinza ↔ dovela) y que las longitudes fijas no cambian. Todas las piezas de una máquina se colocan con un único origen (p. ej. el frente) para que no se desarme al mover la cámara.
43. **Rótulos que no se pisan.** Cada rótulo tiene una posición fija en los márgenes (arriba o abajo) y una ventana de tiempo; dos rótulos nunca comparten fila mientras se cruzan. Revisa las secuencias cada 0,2 s, no solo fotogramas sueltos.
44. **Objetos largos en formato vertical: cámara sobre el eje.** Un puente, un tren o una muralla vistos de lado son una franja fina en 9:16. Coloca la cámara sobre el eje o en diagonal cercana (el objeto recorre el cuadro de abajo arriba hacia el punto de fuga) e inclínala hacia abajo para subir el horizonte; reserva el plano lateral lejano para explicar una forma de onda, y acércalo.
45. **Deformaciones por modos y estado único.** Si una estructura vibra, define sus modos (forma × amplitud × fase) en la plantilla y deriva de ellos TODO: tablero, cables, péndolas, sección técnica y rótulos. Distingue los modos (vertical ≠ torsión) con escenas propias y rotula la amplificación cuando la haya.
46. **Colapsos progresivos y físicos.** Una rotura parte del estado deformado: fallos locales primero (p. ej. péndolas), después tramos que se separan en orden histórico y caen con gravedad e inercia; lo que sigue en pie (torres) se mantiene, sin explosiones ni desapariciones. En 3D, recorta los polígonos contra el plano de la cámara (`cam3.clip`).
47. **Fotografías reales como evidencia.** Si el usuario aporta fotografías históricas, úsalas sin alterarlas (sin IA, sin estilizar) con `P.docPhoto`: tarjeta con marco y sombra, rótulo «ARCHIVO HISTÓRICO» y pie de foto, en el momento que las nombra la voz, sin tapar subtítulos ni otras tarjetas. Distingue siempre «RECONSTRUCCIÓN» (animación) de «ARCHIVO» (registro). Antes de publicar, comprueba la procedencia y los derechos; si no se pueden verificar, dilo en la entrega y propone alternativas con licencia.
48. **Contrasta las afirmaciones del encargo con la voz real.** Si el encargo pide corregir una frase, compara primero con la transcripción alineada: puede que la voz ya diga lo correcto. Nunca sintetices ni sustituyas voz sin una toma autorizada; si falta, deja la corrección como pendiente y dilo.
49. **Dos épocas: una transformación, no un fundido.** Cuando un tema compara pasado y presente, usa las paletas `P.ERA` y retira la gradación de época (`P.eraGrade`) de forma progresiva y sincronizada con la narración. El objeto debe transformarse delante del espectador: el cable se vuelve señal, el aparato sale del bolsillo y se convierte en smartphone. Evita los saltos de color o de grano entre beats: usa la misma función `ERA(t)` en todos ellos.
50. **Personajes históricos sin falsificación.** Una persona real se dibuja como figura estilizada a la edad correcta del momento narrado (Tesla en 1926 ≈ 70 años, no el retrato joven). Lleva el rótulo «RECONSTRUCCIÓN», sin labios animados ni frases inventadas. Los documentos (revistas, cartas) se reconstruyen con metadatos reales y texto ilegible, y se marcan como «RECONSTRUCCIÓN CONCEPTUAL · SIN CITAS».
51. **Telecomunicaciones con rigor.** La señal de un celular no cruza el planeta en una sola onda: el teléfono habla con una estación base cercana y los datos siguen por fibra óptica y otras partes de la red, que no siempre incluyen satélites. Los arcos globales se rotulan «ENLACE CONCEPTUAL». Nunca atribuyas a un visionario un invento que no hizo: dilo en pantalla si la voz lo aclara.
52. **Grano que comprime.** El grano o el parpadeo que cambian en cada fotograma multiplican el peso del MP4 (un episodio sepia pasó de 74 a 329 MB). Usa un grano suave, de celda grande y a 12 cambios por segundo, y codifica con `-maxrate 8.5M -bufsize 17M` además de `crf 20`. Comprueba el tamaño antes del QC.
53. **Nombres únicos en la plantilla.** Antes de crear un bloque, un FX o una música nuevos, busca el nombre en `plantilla.js`: en un objeto literal, una clave repetida sustituye en silencio a la anterior y rompe episodios antiguos. Tras ampliar, comprueba que el diff no borra líneas y que los hashes de los episodios que usan bloques vecinos no cambian.
54. **Revisa las uniones de beats en secuencia.** Las transiciones con corte pueden esconder un fotograma con el estado anterior (un destello de color o un objeto duplicado). Revisa siempre una tira de movimiento a 5 fps alrededor de cada transformación clave.
55. **Manos que de verdad sostienen.** Una mano que agarra un objeto debe tener puntos de contacto visibles: dedos que rodean el borde, yemas apoyadas, pulgar con sombra sobre la superficie, palma detrás y muñeca unida al antebrazo, que sale del cuadro. Cuando la mano entra o cambia de sitio, debe moverse opaca y de forma continua (sube desde abajo o se desliza a su nueva posición). Nunca debe aparecer con un fundido semitransparente ni saltar de posición entre escenas, porque parece que se teletransporta. Revísalo con una tira de movimiento.
56. **Máquinas por dentro: mundo 3D en centímetros.** Si la cámara entra en un mecanismo (entre discos, engranajes, circuitos), modela en cm con `P.cam3` y recorta con un plano cercano pequeño (`poly3`/`clip` con `near` = 1). Así las piezas cercanas no desaparecen ni se deforman. Un único modelo maestro, con un solo sistema de coordenadas, sirve para todas las escenas (órbita, rayos X, recorrido interior, extracción).
57. **Escala real, nunca inflada.** Compara tamaños a escala real (tarjeta frente a armario, plato de 61 cm frente a HDD de 3,5″ en la misma escala). Si el objeto pequeño no se ve, usa una lupa en vez de agrandarlo. En las evoluciones de tamaño usa un zoom logarítmico entre objetos con una barra de escala, y encuadra cada objeto por su ancho, no por su alto. Cuando no hay escala, rotúlalo: «NO A ESCALA».
58. **Precisión de unidades y términos.** Distingue el sistema del componente (IBM 305 RAMAC frente a la unidad IBM 350), el radio del diámetro, MB de GB, y un ejemplo de una regla general («FOTO DE EJEMPLO: 5 MB», «EL TAMAÑO DEPENDE…»). Una tecnología nueva no es la anterior encogida (la flash no es un disco pequeño): muestra el cambio de tecnología física.
59. **Giro rápido sin estroboscopia.** A 30 fps, 1.200 rpm producen aliasing. Anima un giro visual continuo y lento, con brillo fijo y marcas que giran, y deja la cifra real en un rótulo o en las notas.
60. **Retrocompatibilidad sin tocar la plantilla.** Para comparar hashes, genera el `index.html` de un episodio antiguo y crea una copia sustituyendo el texto de la plantilla nueva por el de la anterior. Así no hace falta cambiar `plantilla.js` mientras corre la prueba.
61. **Fotografías reales como evidencia, animación como explicación.** Usa `P.photoCard`: una foto cada vez, cuando la voz nombra el objeto, el tiempo justo para reconocerla, con «FOTOGRAFÍA REAL» o «PIEZA REAL», pie y crédito (con atribución si la licencia la exige). Atenúa el fondo y devuelve después el protagonismo a la animación. No animes el interior de una foto como si fuera una grabación. Comprueba que la imagen recibida coincide con la descrita (marca, capacidad, estado: una pieza averiada no ilustra el funcionamiento) y anota cualquier discrepancia en FUENTES. Rediseña los modelos animados a partir de las fotos (proporciones, ventanas, mecanismos) para que la reconstrucción y la evidencia cuenten la misma historia.
62. **Manos de una sola pieza.** Dibuja una mano como UNA silueta: palma, dedos y pulgar en el mismo `Path2D`, con todos los subtrazados en el mismo sentido (si no, el relleno abre huecos), rellena una sola vez con el mismo degradado. El volumen va en el borde exterior (capa desplazada y desenfocada, recortada a la silueta), nunca con un trazo de cada pieza. Pliegues, nudillos y uñas se dibujan dentro de la silueta, nunca flotando fuera. Revisa siempre la mano en primer plano a tamaño grande antes del render.
63. **Modelo maestro con orientación y sol.** Para arquitectura o paisajes, define primero un único modelo con ejes cardinales (p. ej. x = este, z = sur), la posición de cada pieza y un vector solar. Ilumina caras y proyecta sombras con ese mismo vector y deriva de él la sección, el 3D y las vistas laterales. Escribe un `comprobaciones.js` que verifique relaciones espaciales (qué queda al norte de qué, conexiones, que nada se invada, la dirección de las sombras, accesos a escala humana) y guarda el resultado en `07_QC`. Las pruebas automáticas no sustituyen la revisión de fotogramas.
64. **Cámaras coherentes con la orientación.** Un muro al sur tapa lo que hay detrás si la cámara mira desde el sur: elige la cámara según la orientación real en vez de mover piezas por estética. Nunca dibujes decorados (casas, rocas) a menos de una distancia mínima de la cámara. Para pasar del exterior a un corte, usa una cámara lejana alineada y calcula la escala de la sección con la proyección (`secFrom`), y revela el corte con un barrido.
65. **Licencias que condicionan la publicación.** Si una foto tiene una licencia con condiciones (CC BY-SA) o no se puede verificar, entrega como FINAL una versión sin ella y otra versión con la foto, su atribución en pantalla y la explicación de las condiciones. No afirmes nunca dominio público. Si falta una foto pedida, no la sustituyas por otra no verificada: dilo.
66. **Mezclas de color seguras.** `H.mix` y `ykShade` solo aceptan colores `#hex` o arreglos; pasarles una cadena `rgba(...)` produce NEGRO. Para encadenar mezclas usa `H.rgba(H.mix(H.mix(a, b, u), c, v))`.
67. **Procesos físicos legibles.** Muestra el paso del tiempo cuando un proceso dura horas o noches («NOCHE 1, 2, 3 · TIEMPO ACELERADO»). Las flechas naranjas representan energía térmica y los tonos azules, menor temperatura. Rotula los grosores exagerados («GROSOR EXAGERADO PARA VERLO») y no inventes temperaturas ni velocidades.
68. **La arquitectura debe reconocerse frente a la foto.** Cuando haya una fotografía real del edificio, mide su silueta (cima y anchura a varias alturas) y ajusta el perfil del modelo a esas medidas; deja una comprobación automática con la desviación (Yakhchal: < 5 % del radio de la base). Nada de pirámides escalonadas de rectángulos si la foto muestra una envolvente curva; las hiladas solo como textura.
69. **De la foto al modelo sin saltos.** Tarjeta de la foto → ampliación hasta encajar su silueta con la del modelo (misma cámara, mismo cielo, bordes difuminados) → fundido → órbita → interior. La foto real se rotula «FOTOGRAFÍA ACTUAL» y lo recreado «RECONSTRUCCIÓN»; nunca se presenta lo recreado como real.
70. **Cortes coherentes con la cámara.** El corte 3D y la sección 2D se ven desde el mismo lado (Yakhchal: desde el este, sur a la izquierda). Coloca escaleras, accesos y personajes en la mitad que la cámara ve y fuera del volumen de la carga (el hielo no tapa la escalera ni la escalera atraviesa el hielo); compruébalo con una prueba.
71. **Pilas estables y verificadas.** Cualquier apilamiento (bloques, cajas, sacos) se genera con filas repetidas y juntas desplazadas, y una comprobación automática exige que cada pieza apoye una parte suficiente de su base (≥ 40 %) en la capa inferior.
72. **La cámara nunca queda bajo tierra ni detrás de un muro.** Revisa cada plano 3D: la cámara por encima del terreno (o dentro de una zanja de corte) y sin muros entre ella y el sujeto (regla 64). Si un plano no se lee, cambia la cámara antes de añadir rótulos.
73. **Menos títulos, mejor jerarquía.** Rótulo de capítulo discreto en la esquina (`ykKicker`) solo al empezar cada acto; etiquetas con guía (`ykLabel`) que nunca tapan la arquitectura; títulos grandes solo para el nombre del tema o el cierre.
74. **Mide la silueta, no la estimes a ojo.** Para encajar una foto con un modelo, extrae los bordes de la silueta de la foto por programa (fila a fila) y ajusta por mínimos cuadrados el perfil y la transformación vistos desde la MISMA cámara de la transición; deja el script y una comprobación con el error en píxeles. Comprueba también la forma del remate (redondeado o en punta), que el error medio no detecta bien.
75. **Fundidos sin malla y planos sin repetir.** Si un objeto 3D se dibuja por caras con juntas, compón la escena en una capa opaca antes de fundirla (`ykLayer`). En las secuencias largas (estaciones, procesos), cada fase debe tener un encuadre distinto (exterior amplio, detalle a ras de suelo, interior) en vez de repetir la misma órbita.
76. **Documentos auténticos como planos flotantes, no como diapositivas.** Cada foto o grabado real aparece solo cuando la voz nombra a la persona, objeto o hecho (`floatPhoto`): 1,5–3 s, entre el 25 % y el 50 % del ancho, al lado del modelo 3D que explica el mecanismo y nunca encima de él ni de los subtítulos. La etiqueta dice qué es («FOTOGRAFÍA NASA», «GRABADO ORIGINAL · ficción») y no data la imagen con más precisión de la que consta.
77. **Ficción frente a realidad, siempre distinguibles.** El mundo imaginado se dibuja con su propia estética (grabado, sepia: `engraveGrade`) y se rotula «FICCIÓN» o «RECREACIÓN»; lo real usa la paleta moderna y documentos auténticos. Los objetos ficticios (el cañón de Verne) no se presentan como construidos ni como antecedentes técnicos directos de lo real.
78. **Comparar mecanismos físicos sin inventar cifras.** Muestra la relación cualitativa (recorrido corto + velocidad enorme ⇒ aceleración extrema; cohete que acelera durante minutos y de forma no constante) con flechas y curvas «sin escala». No pongas fuerzas g, velocidades ni tiempos si no están calculados y documentados en FUENTES.
