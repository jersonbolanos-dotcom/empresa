# Fuentes y decisiones · ¿Podrías llegar a otra galaxia en solo 29 años?

## Audio
- **Narración original:** `01_ENTRADA/audio/voz_original_andromeda.mp3` (122,828 s), sin modificar. Su md5 es idéntico al del archivo subido.
- **Transcripción** con Whisper-small local, corregida a mano en `03_GUION/tramos.txt`. Las cifras habladas se marcan `2|dos`, `29|veintinueve` y `30|treinta`. Los cambios afectan solo al texto de los subtítulos:

| Whisper escribió | Corregido a |
|---|---|
| «la distancia astandrómida» | «la distancia hasta Andrómeda» |
| «2,5 millones» | «2 millones y medio» (como se dice en la voz) |
| «Sombroteca» | «Asombroteca» |

## Modelo físico (verificado)
- **Hipótesis:** viaje rectilíneo, aceleración propia constante a = 1 g = 9,80665 m/s² durante la 1.ª mitad y frenado simétrico durante la 2.ª, con velocidad inicial y final ≈ 0. Se ignoran la gravedad y la expansión cósmica.
- **Datos de entrada:** D = 2,5 millones de años luz; c = 299.792.458 m/s; 1 año luz = 9,4607 × 10¹⁵ m; 1 año = 365,25 días. En estas unidades, 1 g ≈ 1,0323 al/año².
- **Fórmulas:**
  - Por fase: x(τ) = (c²/a)[cosh(aτ/c) − 1], t(τ) = (c/a) sinh(aτ/c), v(τ) = c·tanh(aτ/c).
  - Total: τ_total = 2(c/a)·arcosh[1 + aD/(2c²)], t_total = 2(c/a)·sinh[aτ_total/(2c)].
- **Doble verificación:** un cálculo independiente en Python (`03_GUION/verificacion_relatividad.py`, salida en `…_salida.txt`) y la simulación de la plantilla (`P.REL.trip`, comprobada en `…_js.txt`).

| Magnitud | Resultado | En pantalla |
|---|---|---|
| Tiempo propio (nave) | **28,60 años** | «≈ 29 años» y reloj de misión «28,6 años» |
| Tiempo en la Tierra (marco de partida) | **2.500.002 años** | «≈ 2.500.000 años» y reloj «2.500.002 años» |
| Factor de Lorentz máximo (a mitad de viaje) | γ ≈ 1.290.370 | Panel γ y contracción |
| Velocidad máxima | 1 − v/c ≈ 3,0 × 10⁻¹³ | Velocímetro «0,9999999999997 c»; **nunca llega a c** |
| Distancia restante a mitad de viaje, medida por la nave | 1.250.000 al ÷ γ ≈ **0,97 años luz** | «Medida por la nave: 0,97 al» |
| A 0,99 c | γ ≈ 7,09 | «1 año en la nave ≈ 7 años en la Tierra» |
| Cohete ideal de fotones (sin pérdidas) | m₀/m₁ = e^(aτ/c) = e^29,53 ≈ **6,7 × 10¹² (6,7 billones)** | «≈ 6,7 billones de kg por cada kg que llega» |

Nota sobre la distancia: la cifra más citada es ≈ 2,5 millones de años luz; algunas mediciones dan ≈ 2,54 millones. Con 2,537 millones, τ = 28,63 años, lo que no cambia el «≈ 29».

## Otras cifras
- **«escala comprimida: la distancia real es ≈ 25 veces el diámetro de la Vía Láctea»:** 2,5 millones al ÷ ≈ 100.000 al (diámetro aproximado del disco).
- **«Albert Einstein · relatividad especial (1905)»:** año del artículo «Sobre la electrodinámica de los cuerpos en movimiento».

## Rigor conceptual (checklist del prompt)
- **Los dos relojes** salen siempre de la misma simulación, nunca de contadores independientes. Rótulos: «tiempo propio» para la nave y «marco de partida» para la Tierra. En los instantes intermedios, el tiempo terrestre es la coordenada t del marco de partida en el evento de la nave; esa convención de simultaneidad se indica en el rótulo.
- **A bordo todo es normal:** «a bordo, el reloj marca su ritmo normal (tiempo propio)». No se dice que los astronautas sientan el tiempo más lento.
- **Nunca más rápido que la luz:**
  - El velocímetro usa una escala logarítmica en 1 − v/c, con la marca «c» que nunca se alcanza.
  - En las carreras con un rayo de luz, la luz siempre va por delante.
- **1 g es aceleración propia:** «a bordo se siente como la gravedad de la Tierra». La velocidad respecto a la Tierra no crece de forma newtoniana.
- **Frenado:** la nave gira de forma gradual y el motor apunta al destino durante la 2.ª mitad. No hay inversión instantánea.
- **Contracción de longitud:** en el marco comóvil instantáneo, distancia restante ÷ γ.
  - Las galaxias no se mueven ni se deforman.
  - Rótulo: «cambia la distancia que mide cada observador».
  - No hay agujeros de gusano ni motor de curvatura.
- **Aberración de las estrellas:** proyección estereográfica escalada por e^(−η) que agrupa y azula las estrellas al frente. Rotulada «efecto estilizado», con un tope visual de η en 3,2.
- **Energía:**
  - Corte con zonas: propulsión (hipotética), energía, soporte vital y escudo contra radiación y polvo.
  - Rótulos «motor conceptual · no existe hoy» y «tecnologías que todavía no existen».
  - La cifra del cohete de fotones es un límite ideal: cualquier sistema real sería peor.
- **Llegada:**
  - No se muestra el futuro de la Tierra (solo el giro acelerado del globo).
  - Se recuerda que cualquier mensaje tardaría otros ≈ 2,5 millones de años.
- **Final:** «La física lo permite. La tecnología aún no.», con el rótulo «escenario idealizado: 1 g constante, trayecto recto, sin efectos cosmológicos».

## Decisiones creativas
- Paleta del prompt. **Tiempo terrestre siempre `#FFB45B`; tiempo de la nave siempre `#46E6D2`.**
- **Continuidad:** nave → relojes → Tierra / Vía Láctea / Andrómeda → pulso de luz → cabina → Einstein → diagrama de espacio-tiempo → 1 g → aceleración → giro y frenado → reloj de misión → Tierra → contracción → carrera con la luz → energía → llegada → Andrómeda inmensa.
- **Diagrama de espacio-tiempo:** la línea de universo de la nave se calcula con la simulación. Sus marcas de «1 año a bordo» se amontonan al principio y al final, porque la mayor parte del tiempo terrestre transcurre con la nave casi a c.
- **Sonido:** zumbido espacial, propulsión, subida y bajada de tono al acelerar y frenar, relojes digitales, revelación de galaxias, contracción y un acorde de llegada. Todo es un recurso cinematográfico (en el vacío no hay sonido).

## Mejoras al prompt
1. Para cifras que salen de un modelo (29 años, 2,5 millones), exigir la **simulación como fuente única** y la doble verificación. Se aplicó y quedó como regla en el SUPERPROMPT de la plantilla.
2. Indicar qué **convención de simultaneidad** usan los relojes en los instantes intermedios. Aquí: tiempo coordenado del marco de partida.
3. Añadir un **dato de energía cuantitativo y honesto** (el cohete ideal de fotones), en vez de solo «mucha energía».
4. El efecto visual relativista (aberración) debe rotularse como estilizado si no es una simulación exacta.

## Mejoras añadidas a la plantilla (v1.10)
- **Simulación y texto:** `REL` y `betaText`.
- **Bloques:** `space`, `starfield`, `galaxy`, `spaceship`, `missionClock`, `speedGauge`, `spacetime`, `cockpit` y `scientist`.
- **FX:** `espacio`, `propulsion`, `aceleracion`, `frenado`, `reloj`, `galaxia`, `contraer` y `llegada`.
- **SUPERPROMPT de la plantilla actualizado:**
  - Subtítulos «barra» como estándar.
  - Mezcla a −14 LUFS.
  - Retrocompatibilidad y limpieza de disco en el QC.
  - Nueva sección «Reglas aprendidas en los episodios» con 12 reglas.

## V2 · Rediseño cinematográfico (a pedido del usuario)
Se trabajó sobre el mismo proyecto. La V1 se conserva en `04_CODIGO/V1_respaldo/`, `05_AUDIO/V1/`, `07_OUTPUT/V1/` y `07_QC/V1/`. La narración, la sincronización y la simulación física no cambian.
- **Nave:** nueva `P.starship`, un modelo 3D real de diseño original, la misma en todas las escenas.
  - Partes: escudo frontal contra el polvo interestelar, espina de titanio con carenado, módulo de mando con franja cian, anillo habitable que gira (gravedad artificial), depósitos, radiadores térmicos con líneas cálidas, bloque de propulsión con 3 toberas, chorro de partículas y luces de navegación.
  - Vistas: lateral, 3/4, proa hacia arriba al acelerar, giro de 180° para frenar y órbita lenta al final.
- **Espacio:**
  - `deepSpace`: nebulosa tenue y 3 capas de estrellas con paralaje.
  - `galaxyHD`: disco, brazos, bulbo, regiones HII, polvo y bloom.
  - La aberración (estrellas agrupadas al frente) sigue rotulada como efecto estilizado. Las estelas laterales son un recurso cinematográfico y no se presentan como física.
- **Relatividad:**
  - **Einstein:** diagrama espacio-tiempo de los 3 primeros años a bordo, calculado con `P.REL`. La línea de la nave se curva hacia la de la luz y marca cada año a bordo («3 años a bordo ≈ 10,7 años en la Tierra»).
  - **Dilatación:**
    1. Dos observadores en composición dividida (Tierra / cabina), cada uno con su reloj avanzando NORMAL.
    2. Después, una gráfica «años en la nave» frente a «años en la Tierra» en escala logarítmica, con la diagonal «sin relatividad» como referencia.
  - **Relojes holográficos** (`holoClock`), siempre con datos de la simulación.
- **Velocidad:**
  - Progresión: motores que se encienden poco a poco → la nave apunta al frente y acelera → aberración creciente y partículas cercanas → giro y frenado.
  - Velocímetro con tamaño de texto adaptativo.
- **Energía:** la nave se rotula por sistemas (propulsión hipotética, combustible, radiadores para disipar el calor, soporte vital, escudo contra radiación y polvo) con líneas a puntos reales de la malla 3D.
- **Tipografía:** los rótulos tienen un mínimo de 22–24 px, fondo oscuro y un ancho máximo adaptativo; nada importante queda bajo y ≈ 1430.
- **Sonido:** nuevos FX `encendido`, `pasada` y `holo`. La música y el resto de efectos se mantienen.
