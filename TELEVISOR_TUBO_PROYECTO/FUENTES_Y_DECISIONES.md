# Fuentes y decisiones · ¿Cómo funcionaban por dentro los televisores de antes?

Vídeo único, gancho A (con el golpecito de la B y el puntito de la C) · plantilla v1.39 · consultado el 14-11-2026. Dos fuentes por dato.

> **Cómo se verificó.** Las páginas se leyeron **completas** (descargadas y leídas en su texto), no solo el resumen del buscador.
>
> **Por qué no hay universidades ni museos.** Se intentó y no se pudo leer ninguna:
> - **HyperPhysics** (Universidad Estatal de Georgia): se añadió su dominio a la red del entorno, pero no resolvió («Could not resolve host»).
> - **Britannica**: bloquea la lectura automática con una página de verificación («Just a moment… Enable JavaScript and cookies»).
> - **ETHW** (IEEE): no tiene el artículo «Cathode Ray Tube» («There is currently no text in this page»).
> - La búsqueda no dio ninguna página de museo con la explicación técnica.
>
> Por eso las fuentes son técnicas y de divulgación seria, todas leídas completas: iFixit, Explain That Stuff, Wikipedia, JavaLab, Professor Messer y la guía de reparación de repairfaq.org.

## Fuentes
- **[IFIXIT]** iFixit, «CRT Repair Risks and Safety»: https://www.ifixit.com/Wiki/CRT_Repair_Risks_and_Safety
- **[EXPLAIN]** Chris Woodford, «How does television work?», Explain That Stuff: https://www.explainthatstuff.com/television.html
- **[WIKI-CRT]** Wikipedia, «Cathode-ray tube»: https://en.wikipedia.org/wiki/Cathode-ray_tube
- **[WIKI-TV]** Wikipedia, «Analog television»: https://en.wikipedia.org/wiki/Analog_television
- **[JAVALAB]** JavaLab, «How a CRT TV works» (simulación educativa): https://javalab.org/en/crt_tv_en/
- **[MESSER]** Professor Messer, «Why should you avoid working inside of a CRT?» (formación técnica): https://www.professormesser.com/free-a-plus-training/a-plus-pop-quizzes/why-should-you-avoid-working-inside-of-a-crt/2
- **[REPAIRFAQ]** Samuel M. Goldwasser, «TV FAQ: Safety guidelines», Sci.Electronics.Repair FAQ: https://repairfaq.org/samnew/tvfaq/tvsafg.htm

## Datos verificados
| Dato en el vídeo | Fuente 1 | Fuente 2 |
|---|---|---|
| Al fondo del tubo, un cañón dispara electrones hacia la pantalla | [EXPLAIN]: «fires a beam of electrons… down a long cathode-ray tube» | [JAVALAB]: «The Electron gun emits an electron beam» |
| Unos imanes (bobinas) mueven el chorro de lado a lado y de arriba abajo, línea por línea | [EXPLAIN]: «electromagnets steer it from side to side so it scans… line by line» | [JAVALAB]: «A deflection coil (deflection yoke) bends the electron beam… bent by magnetic fields» |
| Más de quinientas líneas | [EXPLAIN]: «525 different "lines"… (NTSC), or 625 lines… (PAL)» | [WIKI-TV]: sistemas de 525 y de 625 líneas |
| Decenas de veces por segundo, y el ojo ve una imagen completa | [WIKI-CRT]: los televisores funcionan a 50 Hz (PAL) o 60 Hz (NTSC) | [EXPLAIN]: «flickering on the screen so fast that they fuse together in your brain» |
| El fósforo brilla donde le pega el chorro | [EXPLAIN]: «the screen is coated with many tiny dots of chemicals called phosphors… make a tiny pinpoint of… light» | [WIKI-TV]: el haz «trace[s] lines across a phosphor coated surface» |
| En los de color, tres chorros (rojo, verde y azul) | [WIKI-CRT]: «three electron beams, one for each additive primary color (red, green, and blue)» | [EXPLAIN]: «three electron guns (one red, one blue, and one green)» |
| Por dentro el tubo está al vacío y el aire lo aprieta desde fuera | [WIKI-CRT]: «evacuated to less than a millionth of atmospheric pressure» | [IFIXIT]: «a near-perfect vacuum… 800 pounds of force… resulting from atmospheric pressure» (en uno de 27 pulgadas); también [REPAIRFAQ]: «several tons of force attempting to crush the typical CRT» |
| El vidrio tenía que ser gruesísimo (y por eso pesaba tanto) | [IFIXIT]: la pantalla «needs to be very thick to deal with this force»; el peso se carga del lado de la pantalla (vidrio grueso) | [WIKI-CRT]: «thick lead glass»; «The CRT makes up most of the weight» |
| El chorro **puede** necesitar espacio para abrirse hasta las esquinas (por eso eran profundos) | [WIKI-CRT]: «The depth of a CRT is related to its screen size» y al ángulo de desvío (90°, 110°) | [EXPLAIN]: «a long cathode-ray tube» (apoyo débil: no dice por qué; de ahí el «puede») |
| Aun desconectado puede guardar electricidad peligrosa: nunca lo abras | [MESSER]: «maintains very high voltages, even when the monitor is powered off and unplugged» | [IFIXIT]: «like a giant high-voltage capacitor… discharge it before any kind of work»; también [WIKI-CRT]: «CRTs have to be discharged before handling» |

## Decisiones
- **Voz:** una sola toma (1.023 caracteres, 65,8 s). Se quitaron con `[QUITAR]` «o sea,» y «Eso sí:», y se alargó la pausa larga con `[PAUSA 0.4]` antes de «Porque por dentro el tubo está al vacío». Resultado: 64,95 s, voz intacta (md5 por tramo).
- **Sin siglas:** siempre «tubo», nunca «CRT».
- **Sin cifras de fuerza en la voz:** las fuentes no coinciden (800 libras en uno de 27 pulgadas frente a «varias toneladas»); se dice «el aire lo aprieta». Tampoco se dan pulgadas ni pesos.
- **Seguridad sin instrucciones:** solo «nunca lo abras». No se muestra cómo se abre ni cómo se descarga; el plano de atrás es la tapa cerrada con una X roja.
- **El puntito al apagarlo:** sale solo como imagen final, sin explicarlo en la voz, porque no se encontraron dos fuentes serias sobre su causa.
- **«Un solo puntito»:** vale para el blanco y negro; en los de color son tres chorros juntos, como se explica antes.
- **Exageraciones didácticas:** el chorro a cámara del gancho y de «hacia ti», el barrido en cámara lenta con pocas líneas, el chorro de color blanco-azulado (los electrones no se ven), las partículas de aire que salen y las grietas del vidrio en «vacío» son ilustrativos.
- **Metáfora:** la manguera que pinta una pared línea por línea; la pintura aparece donde cae el agua, como el fósforo donde pega el chorro.
- **Sin marcas ni programas reales:** televisor de mueble genérico; en pantalla, estática o un paisaje dibujado. Sala, familia y objetos dibujados; sin fotos.
- **Cambio en la red del entorno:** se añadieron dominios técnicos, de universidades y de museos para intentar leer las fuentes; los que respondieron están arriba.
