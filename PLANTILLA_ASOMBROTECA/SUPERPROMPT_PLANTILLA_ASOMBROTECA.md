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
