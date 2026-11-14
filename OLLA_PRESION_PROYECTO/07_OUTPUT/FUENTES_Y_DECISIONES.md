# Fuentes y decisiones · ¿Por qué no explota una olla a presión?

Vídeo único, gancho A + C · plantilla v1.39 · consultado el 14-11-2026. Dos fuentes por dato.

> **Cómo se verificó.** Las páginas completas no se pudieron abrir desde este entorno: la red de la sesión no resolvía esos dominios. Todos los datos se comprobaron con **los resúmenes y extractos que da el buscador** de cada página, no leyendo la página entera.
> En particular, **los ciento veinte grados** se aceptaron porque coinciden tres extensiones universitarias: Penn State, NDSU y Montana State. Las tres dan unos 250 °F (≈ 121 °C) a 15 libras de presión, comprobado **por resumen del buscador y no en la página completa**.

## Fuentes
- **[PSU]** Penn State Extension, «Preparing Meals with Pressure Cookers»: https://extension.psu.edu/preparing-meals-with-pressure-cookers
- **[NDSU]** North Dakota State University Extension, FN2064 (tabla de temperatura de ebullición según la presión): https://www.ndsu.edu/agriculture/sites/default/files/2022-11/fn2064.pdf
- **[MSU]** Montana State University Extension, «Meals in Minutes» (MontGuide): https://www.montana.edu/extension/nutrition/nutrition-cooking-culture/mealsinminutes.html
- **[PRESTO]** Presto (fabricante), instrucciones de ollas a presión de 4 y 6 cuartos y de ollas/envasadoras: https://www.gopresto.com/uploads/downloads/instructions/0136206.pdf · https://www.gopresto.com/uploads/85653_Instruction_Kit.pdf
- **[UF]** Universidad de Florida, UF/IFAS EDIS FS446 (ollas a presión: historia y seguridad): https://edis.ifas.ufl.edu/publication/FS446
- **[UIDAHO]** Universidad de Idaho / Pacific Northwest Extension, PNW747 «Guide to Using and Caring for Your Electric Programmable Pressure Cooker»: https://uidaho.edu/extension/publications/pnw/pnw747
- **[FOODAL]** Foodal, «The "Dangerous Pressure Canner/Cooker" Myth Debunked»: https://foodal.com/knowledge/things-that-preserve/dangerous-pressure-cannercooker-myth-debunked/
- **[CPSC]** U.S. Consumer Product Safety Commission, retirada de ollas Welbilt (las tapas se abrían con presión dentro): https://www.cpsc.gov/Recalls/2005/cpsc-hsn-lp-announce-recall-of-welbilt-electronic-pressure-cookers

## Datos verificados
| Dato en el vídeo | Fuente 1 | Fuente 2 |
|---|---|---|
| La tapa cierra con un empaque de goma que no deja escapar nada | [PRESTO]: el anillo de sellado «forms a pressure-tight seal between the cover and the body» | [MSU]: en la olla sellada el vapor no puede escapar |
| El vapor se queda atrapado y la presión sube | [MSU]: «Because this steam cannot escape, the internal pressure builds» | [PSU]: la presión se acumula dentro de la olla cerrada |
| El agua puede pasar de cien grados: llega a unos ciento veinte | [PSU]: «At 15 pounds of pressure, the temperature inside the pressure cooker can reach 250°F» (≈ 121 °C) | [NDSU]: tabla «250°F at 15 psi» (y 212 °F, 100 °C, al nivel del mar); también [MSU]: «raises the boiling point to about 250F» |
| Por eso cocina mucho más rápido | [MSU]: la temperatura más alta cocina los alimentos más rápido | [PSU]: cocinar a presión acorta los tiempos |
| El «pito» es una válvula con un peso: la presión lo levanta y sale un poquito de vapor | [PRESTO]: el regulador de presión sobre el tubo de ventilación deja salir el exceso de vapor | [UF]: las ollas de fogón usan válvulas de peso («weighted valves») |
| Si la válvula se tapa, un tapón salta y deja salir la presión | [PRESTO]: el tapón de sobrepresión «will automatically pop out and release steam in case the vent pipe becomes blocked» | [UIDAHO]: si fallan las válvulas principal y secundaria, el vapor sale por una salida de emergencia de la tapa |
| La tapa no abre con presión adentro | [PRESTO]: el cierre «prevent[s] the cover from being opened when there is pressure in the unit» | [UIDAHO]: «Locking lid: keeps the pressure cooker closed if there is any pressure inside» |
| Algunas ollas viejas sí podían ser peligrosas (válvula que se tapaba) | [UF]: los primeros modelos tenían una válvula de peso que se tapaba con facilidad y los empaques reventaban | [FOODAL]: desde mediados de los setenta se rediseñó la válvula y se añadieron válvulas secundarias |
| Las de hoy tienen varios seguros | [UF]: hoy tienen varios mecanismos de seguridad (varias válvulas, reguladores, cierres) | [UIDAHO]: tapa con cierre y salida de emergencia, además de las válvulas |
| Si alguien fuerza la tapa, el vapor sale de golpe | [CPSC]: tapas que se abrieron con el contenido a presión → 37 casos de quemaduras | [PRESTO]: el cierre de la tapa existe para que no se abra con presión |

## Decisiones
- **V2** (la versión anterior está en `V1/`: vídeo, `episodio.js` y mezcla; la voz no se tocó):
  - gancho sincronizado: la olla tiembla cada vez más desde «empieza a pitar» y el golpe máximo cae en «explotar», con chorro a cámara, destello, sacudida y silbido; la familia reacciona en ese momento;
  - olla al 62-71 % del ancho, entera (mangos algo más cortos);
  - botella grande y comparación botella-olla lado a lado, del mismo tamaño;
  - etiquetas a opacidad completa cuando la voz las dice;
  - abuela y niño con parpadeo, manos y gestos (la abuela revuelve al servir, el niño se asoma);
  - escena de servir en la cocina en «cocina mucho más rápido»; vuelta a los rayos X en «¿Y el pito?».
- **Física:** se dice «el agua puede pasar de cien grados», no «sin hervir». El agua sí hierve, pero a una temperatura más alta. La cifra de ~120 °C es para unas 15 libras de presión al nivel del mar; las ollas eléctricas y las ciudades altas dan algo menos. Por eso se dice «puede» y «unos».
- **Sin consejos peligrosos:** no se explica cómo abrir, forzar ni destapar una olla. La seguridad queda en «varios seguros». La frase «Revisa la válvula y el empaque, y sigue el manual» se quitó del guion antes de generar la voz, por decisión del usuario.
- **Escena de servir:** la abuela sirve con la olla ya destapada y SIN presión: no hay vapor saliendo por la válvula ni llama encendida. Se dibuja así para no sugerir que se abre con presión.
- **Exageraciones didácticas:** el corte en «rayos X», el vapor en remolinos, las flechas de presión, el tapón que vuela hacia la cámara y el chorro del gancho son ilustrativos. Ninguna olla real explota así.
- **Sin cifras de velocidad:** no se dice cuántas veces más rápido cocina, porque las fuentes no coinciden.
- **Metáfora:** la gaseosa agitada: botella cerrada = olla cerrada, botella dura = presión, aflojar la tapa = el pito. Botella genérica, sin marca.
- **Sin marcas:** olla, botella, cocina y personas dibujadas y genéricas; sin fotos. Presto solo aparece aquí, como fabricante citado.
- **Voz:** una sola toma (1.032 caracteres, 65,0 s), intacta (md5 por tramo).
- **Cambio en la red del entorno:** se añadieron estos dominios al entorno, pero la sesión no llegó a resolverlos; de ahí la verificación por resumen del buscador.
