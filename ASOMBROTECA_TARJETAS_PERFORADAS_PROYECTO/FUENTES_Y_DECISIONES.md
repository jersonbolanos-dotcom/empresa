# FUENTES Y DECISIONES · «Cuando las computadoras utilizaban tarjetas perforadas» (Episodio 05)

## Datos verificados (consultados el 07-11-2026)
- **IBM Heritage — The punched card** (https://www.ibm.com/history/punched-card): la tarjeta IBM «7⅜ × 3¼ in, 80 columnas, 12 filas, agujeros rectangulares»; «IBM introdujo la tarjeta en 1928»; «al escribir un programa, una tarjeta representaba una línea de código… se necesitaban grandes pilas de tarjetas»; las tarjetas perforadas ya se usaban en telares (finales del s. XVIII e inicios del XIX): Hollerith no inventó todas las tarjetas perforadas; «las tarjetas de Hollerith se usaron en el censo de EE. UU. de 1890».
- **U.S. Census Bureau — The Hollerith Machine** (https://www.census.gov/…/hollerith-machine.html): componentes eléctricos; lector manual de dos placas con bisagra; agujas con resorte que atraviesan los agujeros y llegan a pocillos de mercurio; el circuito cerrado mueve los diales (40 en 1890) y suena un timbre; mesa de clasificación con cajones; perforación con pantógrafo.
- Smithsonian y Columbia University (fuentes sugeridas): no accesibles desde este entorno (Cloudflare/JS). No se usó ningún dato que dependa solo de ellas.

## Decisiones
- **Código de tarjeta**: dígito = una perforación en su fila; A–I = 12 + 1…9; J–R = 11 + 1…9; S–Z = 0 + 2…9. Solo se muestran letras, dígitos, espacio y coma, que coinciden en las perforadoras IBM 026 y 029. Ejemplos: «5» = fila 5; «A» = 12 + 1; «B» = 12 + 2. No se presenta como ASCII ni como un bit por agujero.
- **Línea FORTRAN de ejemplo**: `READ 5, A, B` en las columnas 7–18 y el número de secuencia 00000010 en las columnas 73–80 (campos de la tarjeta FORTRAN). Se rotula «ejemplo» y «en muchos sistemas».
- **Lector**: se eligió un único mecanismo para todo el s. XX, el lector de escobillas. Hay una escobilla por columna sobre un rodillo de contacto. La tarjeta va boca abajo, con el borde de la fila 9 delante. El instante del contacto indica la fila. Es una reconstrucción genérica rotulada, no se presenta como universal y no se nombra ningún modelo. Este principio general de las máquinas IBM de registro unitario no se pudo verificar en las fuentes accesibles: queda como reconstrucción.
- **Perforadora**: reconstrucción genérica tipo IBM 026 (teclado, alimentador, estación de perforación y apilador). Se distingue del lector con el rótulo «la perforadora hace los agujeros; el lector los interpreta».
- **Tarjeta de 1890**: otra tarjeta, más corta, con agujeros redondos y sin impresión. La disposición de los agujeros es ilustrativa y no se dan cifras en pantalla. No se usa la tarjeta IBM de 80 columnas para 1890.
- **Tabuladora de 1890**: es electromecánica (prensa con agujas, mercurio, diales y timbre), con mesa de clasificación. Se rotula «no era una computadora electrónica».
- **Memoria flash / microSD**: se rotula «electrónica, sin agujeros». La transición entre tarjeta y microSD es un fundido, no una transformación física. No se da ninguna equivalencia numérica entre la pila y la microSD.
- **Desorden del mazo**: el texto dice «podía ser un problema» y se muestra la reordenación con números de secuencia. No se afirma que el programa fuera irrecuperable.

## Voz
Archivo original `01_ENTRADA/audio/voz_original_tarjetas_perforadas.mp3` (87,72 s; md5 54a6b7b9684b8dee63da881aaf9de058), sin alterar. Transcripción Whisper local y alineación por pausas (23 tramos, 216 palabras). La narración no contiene errores históricos.

## Música y efectos
Originales, generados por la plantilla (MUS.pulso, MUS.industrial, MUS.epica, MUS.piano; FX nuevos perforar, tecleo, tarjetaRoce, escobilla, cascadaTarjetas y dialHollerith). Mezcla con sidechain a −14 LUFS.
