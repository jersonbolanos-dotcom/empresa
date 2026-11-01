# Fuentes y decisiones · ¿Cómo viaja internet de un continente a otro por el fondo del océano?

## Audio
- **Narración original:** `01_ENTRADA/audio/voz_original_internet.mp3` (99,788 s), sin ninguna modificación. Su md5 coincide con el del archivo subido.
- **Transcripción:** Whisper-small local. Coincide con el guion. Whisper escribió «Sombroteca» y se corrigió a «Asombroteca». Hay 23 tramos en `03_GUION/tramos.txt`.

## Cifras mostradas (todas verificadas)
| En pantalla | Dato | Fuente |
|---|---|---|
| «MÁS DEL 99 % del tráfico intercontinental» | TeleGeography confirma que los cables submarinos llevan más del 99 % del tráfico intercontinental (aclara que no puede calcularlo con precisión sin datos de satélite) | TeleGeography, *2023 Mythbusting part 3*: https://blog.telegeography.com/2023-mythbusting-part-3 |
| «≈ 600 SISTEMAS de cables en servicio (2025)» | 596 sistemas en servicio en noviembre de 2025 | TeleGeography, *State of the Network 2026*: https://www2.telegeography.com/hubfs/LP-Assets/Ebooks/State%20of%20the%20Network%202026_TeleGeography.pdf |
| «profundidad media del océano ≈ 3.700 m» | 3.682 m (estimación NOAA/WHOI, 2010) | NOAA Ocean Exploration: https://oceanexplorer.noaa.gov/facts/ocean-depth.html |
| Regla de profundidad hasta 4.000 m | Ilustra «varios miles de metros»; se aclara que algunos cables pasan por zonas aún más hondas | ídem |
| «≈ 0,125 mm de vidrio» | Diámetro estándar del revestimiento de una fibra monomodo (125 µm), comparable a un cabello | Norma ITU-T G.652 (dato estándar de la industria) |
| «≈ 6.600 km ÷ ≈ 200.000 km/s ≈ 0,03 s» | Cable MAREA (Virginia Beach–Bilbao): 6.605 km. Luz en vidrio de sílice (n ≈ 1,47): ≈ 204.000 km/s. 6.600 / 200.000 = 0,033 s | Wikipedia MAREA / FCC: https://www.wikiwand.com/en/articles/MAREA; Computer History Museum: https://www.computerhistory.org/collections/catalog/102766623 |

## Ciencia representada (según el checklist del prompt)
- **No por satélites:** el satélite se tacha con «LA MAYORÍA NO VA POR SATÉLITE». No se dice que nunca se use satélite.
- **Mapa:** estilizado, con rutas simplificadas por corredores reales (Atlántico norte, EE. UU.–España, Brasil–Portugal, Brasil–África, África occidental y oriental, Mediterráneo–Asia, Australia, Pacífico). Lleva el rótulo «MAPA ESTILIZADO · RUTAS SIMPLIFICADAS, NO EXACTAS».
- **Estructura del cable** (aguas profundas): fibras en gel dentro de un tubo, hilos de acero (resistencia), conductor de cobre (lleva la energía a los repetidores) y aislante de polietileno. Se aclara que cerca de la costa se añade armadura. La comparación de tamaño es «parecido a una manguera de jardín», sin cifra.
  - Fuentes: patentes de alimentación de repetidores (https://patents.google.com/patent/US7171125, https://patents.google.com/patent/US9893834) y la patente de estructura del cable (https://patents.justia.com/patent/4278835).
- **La fibra:** núcleo y revestimiento. La luz va guiada en el núcleo como pulsos, sin el zigzag de rayos que pide evitar el prompt.
- **Datos → luz:** un transmisor (láser + modulador) **modula** la intensidad y la fase de la luz, con «miles de millones de cambios por segundo, no una letra por destello».
- **Repetidores:**
  - Son amplificadores ópticos (EDFA) que refuerzan la luz sin pasarla a electricidad, uno por fibra y sentido.
  - Reciben energía en serie por el conductor del cable.
  - Se dice «uno cada varias decenas de kilómetros», porque las fuentes dan de 40 a 60 km según el diseño. Se rotula «separación no a escala».
- **Cruce:** se calcula con la longitud real de MAREA. Al llegar se ve la estación costera y el rótulo «sigue por redes terrestres».
- **Tendido:**
  - Barco cablero con el cable en tanques; el cable sale por la roldana de popa con velocidad y tensión controladas y queda en el fondo detrás del barco.
  - Se rotula «ESCALA NO REAL».
- **Enterrado:**
  - Cerca de la costa (riesgo de anclas y redes de pesca), un arado submarino abre la zanja.
  - Se aclara que en aguas profundas el cable suele quedar apoyado en el fondo.
- **Rotura y reparación** (proceso real):
  1. Pruebas desde tierra localizan la falla.
  2. El barco llega y un garfio recupera el cable. A esa profundidad no bajan buzos; se usa garfio o ROV.
  3. Se empalma en cubierta.
  4. Se prueba (✓).
  5. Se devuelve al fondo.
  - Fuentes:
    - Hackaday, «Undersea cable repair» (2024): https://hackaday.com/2024/07/30/undersea-cable-repair
    - Gizmodo, «How to fix a mysteriously ruptured undersea cable»: https://gizmodo.com/how-to-fix-a-mysteriously-ruptured-undersea-cable-353230
    - S. Drew, «Problems Faced by Industry in Subsea Cable Repair» (CIL-NUS, 2011): https://cil.nus.edu.sg/wp-content/uploads/2011/04/Session-2-Steve-Drew-Problems-Faced-by-Industry-in-Subsea-Cable-Repair-110404.pdf

## Decisiones creativas
- Se usó la paleta del prompt: `#031322`, `#062A46`, `#167BFF`, `#49E6FF`, `#46F5BC`, `#F4FAFF`, `#8799A8`, `#FFD447`, `#FF9B45`.
- Hay continuidad visual: el mensaje «¡Hola desde Colombia!» sale del celular, cruza el Atlántico hasta Madrid y al final vuelve al mismo chat y al mapa con toda la red encendida.
- Subtítulos «barra» (blanco, barra amarilla) con palabras clave: cables submarinos, fibras ópticas, pulsos de luz, repetidores, barcos, entierran, repararlo, clic, mar y Asombroteca.

## Mejoras al prompt (para próximos episodios)
1. Pedir siempre una **fuente por cifra** en pantalla y un rótulo de «escala no real» o «mapa estilizado» cuando corresponda. Así se hizo aquí.
2. Indicar el **punto de partida del espectador** (país o ciudad) para el mensaje de ejemplo. Aquí se eligió Colombia → Madrid.
3. Cuando el guion nombra un proceso con varios pasos («localizarlo, recuperarlo y repararlo»), mostrarlo como **fila de pasos numerados** que se encienden con la voz.
4. Para tiempos («fracción de segundo»), dar el **cálculo visible** con un cable real en lugar de una cifra suelta.

## Mejoras añadidas a la plantilla (v1.6)
- **Bloques:** `spline`, `ocean`, `waves`, `seabed`, `ship`, `cableSection`, `fiber`, `repeater`, `worldMap`, `cableRoute`, `depthGauge`, `rov`, `plow`, `anchor`, `grapnel` y `station`.
- **FX:** `bajoAgua`, `inmersion`, `olas`, `pulsoLuz`, `amplifica`, `cabrestante`, `ancla`, `rotura` y `empalme`.
- Están documentados en `PLANTILLA_ASOMBROTECA/CAMBIOS_PLANTILLA.md`, en `INSTRUCCIONES_PLANTILLA.md` y en el catálogo (33 bloques).
