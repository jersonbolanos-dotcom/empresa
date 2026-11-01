# Fuentes y decisiones · ¿Cómo construyeron las pirámides sin máquinas?

## Audio
- **Narración original:** `01_ENTRADA/audio/voz_original_piramides.mp3` (94,589 s), sin modificar. Su md5 es idéntico al del archivo subido.
- **Transcripción** con Whisper-small local, corregida a mano en `03_GUION/tramos.txt`. Los cambios afectan solo al texto de los subtítulos, nunca al audio:

| Whisper escribió | Corregido a |
|---|---|
| «haza» | «hazaña» |
| «ir a transportarlos» | «Era transportarlos» |
| «Umedecer» | «Humedecer» |
| «contaban contra bajadores» | «contaban con trabajadores» |
| «Sombrateca» | «Asombroteca» |
| «gruas» | «grúas» |

## Cifras en pantalla (todas verificadas)
| En pantalla | Dato y fuente |
|---|---|
| «+ 4.500 años» | La Gran Pirámide se construyó hacia 2580–2560 a. C. (IV dinastía, Keops). Wikipedia, *Great Pyramid of Giza* |
| «≈ 146 m, altura original» | 146,6 m originales; hoy unos 138,5 m porque perdió el revestimiento y la punta. La voz dice «casi 150 metros», coherente con este dato. Ídem |
| «≈ 2,3 millones de bloques (estimación)» | Estimación habitual de 2,3 millones. Ídem |
| «≈ 2,5 t de media · algunos de granito: más de 50 t» | Media de unas 2,5 t. Los bloques de granito de la Cámara del Rey (de Asuán) pesan de 25 a 80 t. Ídem |
| «en laboratorio: con 2–5 % de agua, hasta la mitad de fuerza (U. de Ámsterdam, 2014)» | Fall, Bonn *et al.*, «Sliding Friction on Wet and Dry Sand», *Physical Review Letters* 112, 175502 (2014). Nota de la UvA: https://iop.uva.nl/content/news/2014/00/prl-egyptian-pyramids.html · phys.org: https://phys.org/news/2014-04-ancient-egyptians-pyramid-stones-sand.amp |
| «codo real (≈ 52 cm)» | Codo real egipcio de unos 52,3–52,5 cm (medida estándar) |
| «≈ 20 años de obra (estimación)» | Estimación clásica de unas dos décadas para el reinado de Keops; se rotula como estimación |

## Rigor y matices
- **Rampas:** se presentan como **hipótesis principal**, no como hecho. Se muestran cuatro propuestas (recta, zigzag, espiral, interna) con signos de pregunta y el rótulo «LOS ARQUEÓLOGOS AÚN DEBATEN» / «quizá combinaron varias».
- **Hatnub (2018):** se cita como indicio, no como prueba. Es una rampa con escaleras y agujeros para postes en una cantera de alabastro.
  - History.com: https://www.history.com/articles/ancient-egypt-pyramid-ramp-discovery
  - Live Science: https://www.livescience.com/63978-great-pyramid-ramp-discovered.html
- **Arena húmeda:** se aclara que es un resultado de laboratorio. La pintura de la tumba de Djehutihotep se menciona como representación (aguador delante del trineo), sin afirmar que sea un manual técnico.
- **Trabajadores especializados:** «vivían en una aldea junto a la obra», según la aldea de trabajadores excavada en Giza (Lehner/Hawass). No se usa la imagen de esclavos.
- **Organización:** «papiros de Merer», el diario de Wadi el-Jarf (hallado en 2013), que registra el transporte de caliza de Tura a Giza por el Nilo. De ahí también el rótulo «caliza fina de Tura y granito de Asuán llegaban por el Nilo».
- **Herramientas de cobre:** cinceles y sierras; las sierras trabajaban con arena como abrasivo (experimentos de arqueología experimental).
- **Orientación:** «lados alineados con los puntos cardinales», sin cifra de error.
- **Revestimiento:** el final muestra la pirámide con su revestimiento de caliza blanca pulida, como lucía originalmente.

## Decisiones creativas
- **Escenas:** desierto cálido para las escenas «de campo», sala oscura con fichas para el debate y lo que sabemos, y plano azul para la planificación. El cierre, al atardecer, con el revestimiento.
- **Continuidad:**
  - Una sola escena de arrastre (trineo, cuerdas y seis trabajadores con marcha animada) sirve para «trineos y cuerdas» y para «arena húmeda». El aguador entra, la arena se oscurece, la barra de fuerza baja al 50 % y el grupo camina más rápido.
  - En «¿cómo subían?» y «rampas», la pirámide crece por hiladas y la rampa crece con ella.
- **Legibilidad:** los rótulos llevan una cápsula oscura semitransparente y hay una franja cálida bajo los subtítulos, porque el cielo del desierto es muy claro.

## Mejoras al prompt (para próximos episodios)
1. Para temas con **debate abierto** (rampas), pedir que se muestren las hipótesis como tales: varias opciones, signos de pregunta y la palabra «hipótesis» en pantalla.
2. Pedir **escala humana** en cada cifra grande (persona junto a la pirámide y junto al bloque).
3. Para fondos claros (desierto, nieve, cielo), exigir **cápsulas o sombras** en los textos y una franja bajo los subtítulos.
4. Cuando el guion cite un experimento («humedecer la arena»), pedir la **fuente y el matiz** («en laboratorio»).

## Mejoras añadidas a la plantilla (v1.8)
- **Bloques:** `desert`, `pyramid`, `block`, `sled`, `worker`, `rope`, `ramp`, `papyrus`, `tool`, `palm` y `qmark`.
- **FX:** `arrastre`, `cuerda`, `esfuerzo`, `vertido`, `cincel`, `piedra` y `viento`.
- Documentado en `CAMBIOS_PLANTILLA.md`, en `INSTRUCCIONES_PLANTILLA.md` y en el catálogo (50 bloques).
