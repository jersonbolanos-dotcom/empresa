# Fuentes y decisiones · ¿Qué pasa dentro del motor de una moto?

Vídeo único, gancho B en primera persona · plantilla v1.41 · consultado el 14-11-2026. Dos fuentes por dato.

> **Cómo se verificó.** Las páginas se leyeron **completas** (descargadas y leídas en su texto), salvo la de Honda (ver la nota).
> Fuentes: una universidad (Calgary), un manual universitario (Universidad de Windsor, publicado por la Universidad de Washington), la ficha técnica oficial de un fabricante (Kawasaki) y Wikipedia como apoyo. En el vídeo no aparece ninguna marca.

## Fuentes
- **[CALGARY]** Energy Education, Universidad de Calgary, «Four stroke engine»: https://energyeducation.ca/encyclopedia/Four_stroke_engine
- **[UW]** «Four Stroke Cycle Engines» (manual de la Universidad de Windsor, curso ENGR 100 de la Universidad de Washington): https://courses.washington.edu/engr100/Section_Wei/engine/UofWindsorManual/Four%20Stroke%20Cycle%20Engines.htm
- **[KAWASAKI]** Kawasaki, ficha técnica oficial de la Z125 PRO (moto de trabajo de 125 cc): https://hawaii.kawasaki.com/en-us/motorcycle/z/mini-naked/z125-pro/2026-z125-pro
- **[HONDA]** Honda UK, ficha técnica de la CB125F: https://www.honda.co.uk/motorcycles/range/125cc/cb125f-2024/specifications.html (**solo por el resumen del buscador**, ver la nota)
- **[WIKI-4T]** Wikipedia, «Four-stroke engine»: https://en.wikipedia.org/wiki/Four-stroke_engine
- **[WIKI-CIG]** Wikipedia, «Crankshaft»: https://en.wikipedia.org/wiki/Crankshaft
- **[WIKI-CAD]** Wikipedia, «Chain drive»: https://en.wikipedia.org/wiki/Chain_drive

## Datos verificados
| Dato en el vídeo | Fuente 1 | Fuente 2 |
|---|---|---|
| El motor trabaja en cuatro tiempos: aspira, aprieta (comprime), explota (fuerza) y sopla (escape) | [CALGARY]: «intake, compression, power, and exhaust» | [UW]: «four distinct piston strokes (intake, compression, power, and exhaust)» |
| Arriba, dos válvulas se abren y se cierran | [UW]: «the intake valve is open… The intake valve then closes»; válvula de escape en el cuarto tiempo | [KAWASAKI]: «4-stroke, 1 cylinder, SOHC, 2-valve» |
| Uno: el pistón baja y entra aire con gasolina | [UW]: «the piston moves from TDC to BDC and the intake valve is open… the air-fuel mixture… into the cylinder» | [CALGARY]: en la admisión el pistón baja y entra la mezcla de aire y combustible |
| Dos: el pistón sube y lo comprime | [UW]: tiempo de compresión, el pistón sube con las válvulas cerradas | [CALGARY]: «compression» |
| Tres: la bujía lanza una chispa y explota; la explosión empuja el pistón hacia abajo | [CALGARY]: «a spark plug provides the compressed fuel with the activation energy required to begin combustion» | [UW]: tiempo de fuerza, los gases empujan el pistón hacia abajo |
| Cuatro: el humo sale por el escape | [UW]: tiempo de escape, se abre la válvula de escape | [CALGARY]: «exhaust» |
| La biela y el cigüeñal convierten el sube y baja en giro | [UW]: «Piston force… transferred through the connecting rod to apply torque to the crankshaft» | [WIKI-CIG]: «convert the reciprocating motion into rotational motion» |
| La cadena lleva ese giro a la rueda de atrás | [KAWASAKI]: «Final Drive: Sealed chain» | [WIKI-CAD]: la transmisión por cadena lleva la fuerza a las ruedas de bicicletas y motos |
| Una explosión cada dos vueltas | [UW]: «An operating cycle requires two revolutions (720°) of the crankshaft» | [CALGARY]: «one power stroke for every two cycles of the piston (or four piston strokes)» |
| A unas seis mil vueltas por minuto (moto de trabajo de 100–150 cc, a régimen normal) | [KAWASAKI]: par máximo a 6.000 rpm (página completa) | [HONDA]: 10,9 Nm a 6.000 rpm (solo resumen del buscador) |

## La cuenta de las explosiones
- 6.000 vueltas por minuto ÷ 60 segundos = **100 vueltas por segundo**.
- Una explosión cada dos vueltas → 100 ÷ 2 = **50 explosiones por segundo**.
- **Tres mil cada minuto** es la misma cuenta: 50 × 60 = 3.000 (o 6.000 vueltas ÷ 2).
- Es un valor redondo para un motor de un cilindro a unas seis mil vueltas («a unas…»): a menos vueltas hay menos explosiones y a más vueltas, más.

## Decisiones
- **Honda, solo por el resumen del buscador:** la página de Honda UK da error 404 al descargarla. Se acepta el dato (10,9 Nm a 6.000 rpm) por el resumen, porque la página **completa** de Kawasaki dice lo mismo (par máximo a 6.000 rpm). Aprobado por el usuario.
- **Voz:** una sola toma (Eleven v4, voz Dan; 936 caracteres, 66,4 s). Se quitó «Ahora, el dato.» con `[QUITAR]` y se puso `[PAUSA 0.6]` antes de «A unas seis mil vueltas por minuto…» (aprobado por el usuario). Resultado: 64,43 s, voz intacta (md5 por tramo, 31/31 iguales). Para eso se arregló `alinear.py` (plantilla v1.41).
- **Sin «cc» ni «rpm» en la voz:** «vueltas por minuto»; los números, en palabras.
- **Sin instrucciones para desarmar ni modificar el motor:** solo se explica qué pasa dentro, con el motor en «rayos X» (dibujo en corte).
- **Sin marcas, logos ni fotos:** moto de trabajo genérica (con caja de domicilios), ciudad andina al atardecer, personas, tablero y motor dibujados.
- **Manos del gancho:** guantes dibujados que envuelven los puños del manubrio (las manos ilustradas del canal, `P.manoImg`, son manos sin guante y no pueden agarrar un puño). La mano derecha gira el acelerador justo antes de «EXPLOTA». Lo pidió el usuario.
- **Exageraciones didácticas:** la bola de fuego que sale a cámara, el destello y el temblor; las explosiones en cámara lenta; el color de la mezcla (azul), de la explosión (naranja) y del humo (gris); el contador de vueltas. El motor de verdad está cerrado y no se ve por dentro.
- **Metáforas:** respirar (aspira, aprieta, explota, sopla; las válvulas como una nariz) y, para biela y cigüeñal, las piernas pedaleando una bicicleta.
- **Encuadre:** en los planos del motor entero, el motor ocupa algo más de la mitad del ancho para que se vea entero (es alto y estrecho); los primeros planos llenan la pantalla. El QC de encuadre da correcto.
- **Portada:** «DENTRO DEL / MOTOR» con MOTOR en rojo; la moto grande con el motor en rayos X y la explosión naranja dentro; la marca debajo, en una franja fuera del dibujo (`--marca-y 1850`).
