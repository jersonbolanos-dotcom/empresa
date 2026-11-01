# Fuentes y decisiones · ¿Cómo una represa convierte el agua en electricidad?

## Audio
- **Narración original:** `01_ENTRADA/audio/voz_original_represa.mp3` (96,444 s), sin modificar. Su md5 es idéntico al del archivo subido.
- **Transcripción:** Whisper-small local, que coincide con el guion de referencia. Se corrigieron «Sombroteca» → «Asombroteca» y «álaves» → «álabes» (solo en el texto de los subtítulos). Hay 23 tramos.

## Cifras en pantalla
| En pantalla | Fuente |
|---|---|
| «≈ 18.000 V → 500.000 V» con el rótulo «ejemplo real: central Paulo Afonso IV (Brasil)» | WEG, sustitución de los transformadores elevadores de Paulo Afonso IV (de 18 kV a 500 kV): https://smartwatermagazine.com/news/weg/weg-successfully-completes-replacement-works-paulo-afonso-iv-hydroelectric-power-plant |
| «en casa llega con un voltaje mucho menor (p. ej. 120 o 220 V)» | Tensiones domésticas habituales (América: 120 V; gran parte del mundo: 220–230 V). Cadena 500 → 230 → 115 → 12 kV en distribución: https://www.gatransmission.com/wp-content/uploads/2017/07/Paths-of-Electricity.pdf |

El resto de la explicación es cualitativa. No se muestran cifras de potencia, caudal ni eficiencia.

## Ciencia representada (checklist del prompt)
- **Proceso:** embalse → toma con compuerta → tubería forzada → turbina → eje → generador → transformador → líneas → subestación → distribución → hogar. Fuente: USGS, *Hydroelectric Power: How it Works* (https://www.usgs.gov/water-science-school/science/hydroelectric-power-how-it-works).
- **La pared no genera electricidad.** Se dice en pantalla desde el gancho.
- **Presión con la profundidad:** flechas que crecen con la profundidad sobre el paramento. El embalse está abierto a la atmósfera; no es un depósito a presión.
- **Desnivel:**
  - Una línea luminosa marca el desnivel.
  - Una comparación «menor / mayor desnivel» muestra más energía por cada litro.
  - Se aclara que la potencia también depende del caudal y de la eficiencia.
- **Tubería forzada:** se llena por completo antes de que gire la turbina (`P.pipe` con `fill`). El rótulo dice «va LLENA de agua»; no se muestra agua cayendo en una tubería vacía.
- **Turbina Francis** (vista desde arriba): carcasa espiral, álabes directrices FIJOS (solo se orientan) y rodete que GIRA. El giro acelera hasta un régimen estable.
- **Molino:** comparación rotulada como conceptual; el rodete Francis es otra máquina. Una persona da la escala.
- **Unidad vertical:** el eje gira solidario con el rodete y el rotor. Persona a escala.
- **Generador:**
  - El rotor tiene electroimanes N/S y gira; el estator está fijo y tiene bobinas.
  - Las bobinas se encienden cuando pasa un polo y aparece una onda de corriente alterna.
  - Las líneas de campo son una visualización conceptual (discontinuas).
  - Se dice «la energía viene del giro que entrega la turbina». No hay electrones saltando ni imanes que creen energía.
  - En generadores grandes los polos del rotor son electroimanes (USGS).
- **El agua no se convierte en electricidad:** rótulo «le cede parte de su energía». Sale por el tubo de aspiración y vuelve al río.
- **Transformador:** núcleo con dos devanados (pocas vueltas → muchas vueltas). Rótulo «eleva el voltaje; no crea energía» y «más voltaje = menos corriente = menos pérdidas».
- **Transmisión, subestación y distribución** son etapas distintas: torres de alta tensión → subestación «baja el voltaje» → postes de distribución → casas. No se conecta una línea de alta tensión a un enchufe.
- **Sin combustión:** ciclo del agua (sol, evaporación, nube, lluvia, río, embalse) y una llama tachada, con el rótulo «construirla y mantenerla sí genera emisiones».
- **Impactos ambientales (sobrio):** sedimentos atrapados, barrera para peces y cambios en el río aguas abajo.

## Decisiones creativas
- Paleta del prompt: `#061522`, `#1268A8`, `#38C9FF`, `#55E8FF`, `#778A99`, `#293F52`, `#B8CCD8`, `#FFD447`, `#46C98A`, `#F5FAFF`, `#FF9D4D`.
- **Agua = azul/cian; electricidad = amarillo.** Nunca se mezclan.
- **Un solo corte técnico** de la central sirve para las escenas 2, 3, 4, 9 y 10. La cámara viaja por él (embalse → toma → tubería → casa de máquinas → río / transformador), lo que da continuidad física.
- **Cierre circular:** la bombilla, la cadena recorrida al revés (8 eslabones que se encienden con la voz) y la misma toma monumental del gancho. No hay pantalla negra.

## Mejoras al prompt (para próximos episodios)
1. El guion dice «millones de litros», una cifra muy pequeña para un embalse real (suelen tener miles de millones de m³). Conviene revisar estas frases antes de grabar. Aquí no se mostró ninguna cifra de volumen para no contradecir la voz.
2. Pedir un **ejemplo real** para cada cifra técnica (aquí, Paulo Afonso IV para las tensiones).
3. Cuando el guion compara con algo antiguo (molino), pedir la aclaración «comparación conceptual» y una persona a escala.
4. Para cierres circulares, dar la lista de eslabones de la cadena en orden inverso: así la animación se sincroniza con la voz.

## Mejoras añadidas a la plantilla (v1.7)
- **19 bloques:** `waterBody`, `concrete`, `pipe`, `gate`, `francis`, `waterwheel`, `genSection`, `sine`, `transformer`, `pylon`, `powerLine`, `house`, `factory`, `skyline`, `bulb`, `switchWall`, `cloud`, `sun` y `fish`.
- **9 FX:** `compuerta`, `corriente`, `turbina`, `generador`, `induccion`, `transformador`, `lineas`, `bombilla` y `lluvia`.
- Documentados en `CAMBIOS_PLANTILLA.md`, en `INSTRUCCIONES_PLANTILLA.md` y en el catálogo (43 bloques).
