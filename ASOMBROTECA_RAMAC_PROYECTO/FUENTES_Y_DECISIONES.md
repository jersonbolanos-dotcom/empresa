# FUENTES Y DECISIONES · «El primer disco duro era una máquina gigantesca»

Serie «La evolución del almacenamiento» · Episodio 02 · Asombroteca · Plantilla v1.19

## Datos en pantalla

| Dato | En el video | Fuente |
|---|---|---|
| IBM 305 RAMAC, presentado comercialmente en 1956; el IBM 350 es su unidad de almacenamiento en disco | Escena 5: «IBM 305 RAMAC · EL SISTEMA INFORMÁTICO COMPLETO» y una flecha a «UNIDAD DE DISCOS IBM 350» | Computer History Museum (CHM), *First Commercial Hard Disk Drive Shipped* y *The First Disk Drive: RAMAC 350*; ETHW, *Creating Magnetic Disk Storage at IBM* |
| 50 discos montados en horizontal sobre un eje vertical | Modelo 3D con 50 discos instanciados (con grosor) sobre un solo eje; contador de 0 a 50 | CHM / ETHW |
| 24 pulgadas de diámetro = 60,96 cm (no es el radio) | «61 CM DE DIÁMETRO · 24 PULGADAS = 60,96 CM», con cota de lado a lado | CHM / ETHW |
| 1.200 rpm | Se dice en las notas. La animación gira despacio a propósito para evitar el efecto estroboscópico a 30 fps | CHM / ETHW |
| 5 millones de caracteres de 6 bits ≈ 3,75 MB | «3,75 MB · 5 MILLONES DE CARACTERES DE 6 BITS». Nunca GB | CHM (5 millones × 6 bits = 30 Mbit = 3,75 MB) |
| Un único carro de acceso que sube y baja para elegir el disco y un brazo que entra en radial para elegir la pista; las cabezas flotan sobre un colchón de aire (de ahí el compresor) | Escena 13: el brazo se retira, el carro sube y el brazo entra. Rótulo «LAS CABEZAS FLOTAN SOBRE AIRE: NO TOCAN EL DISCO» | ETHW / CHM |
| Discos de aluminio con recubrimiento de óxido de hierro | Escena 12: corte del disco con los rótulos «DISCO DE ALUMINIO» y «RECUBRIMIENTO MAGNÉTICO», y la nota «REPRESENTACIÓN DIDÁCTICA» | ETHW |
| «Más de una tonelada» | Rótulo «UNIDAD DE DISCOS + COMPRESOR DE AIRE», tal como pide el guion | Las cifras de peso varían según la fuente (unidad sola o con compresor). Se mantiene el matiz del guion y no se da un número exacto |
| Primer disco duro comercial | «PRIMER DISCO DURO COMERCIAL · DISCOS DE ACCESO ALEATORIO». No se dice que fuera el primer almacenamiento magnético | CHM |
| Disquete de 3,5″: medio magnético flexible, 90 × 94 mm | Escena 20, a la misma escala que la microSD | Norma del formato |
| microSD: 11 × 15 mm | Gancho, comparación final y disquete, a escala real | Especificación SD Association |
| microSD de 1 TB (ejemplo) ≈ 266.000 veces 3,75 MB | Rótulo «EJEMPLO». Se venden tarjetas microSD de 1 TB desde 2019. Cálculo: 10¹² / 3,75·10⁶ ≈ 266.667 | Fabricantes (p. ej., anuncios de 2019 de tarjetas microSD de 1 TB) |
| Foto de 5 MB | «FOTO DE EJEMPLO: 5 MB» y «EL TAMAÑO DEPENDE DEL FORMATO Y LA RESOLUCIÓN» | Ejemplo ilustrativo, no un tamaño universal |
| Flash: celdas que retienen carga, sin piezas que giran, no volátil (no es RAM) | Escena 17. No hay platos dentro del chip | Funcionamiento general de la memoria NAND flash |

### Limitación de la verificación

Desde esta sesión no se pueden abrir computerhistory.org, ethw.org ni wikipedia.org: no están en los dominios de red permitidos del entorno. Los datos coinciden con los del guion y con la literatura conocida. Para consultarlos aquí hay que añadir esos dominios en la configuración de red del entorno.

## Decisiones de reconstrucción

1. **Sin fotos falsas.** Todo es animación con el rótulo «RECONSTRUCCIÓN». La sala de 1956 y el técnico son genéricos.
2. **El IBM 350.** Es un armario gris (≈ 152 × 172 × 74 cm) con una ventana que deja ver la pila de discos, rejillas y pilotos. La geometría es aproximada y coherente con las fotos conocidas: la pila tras una ventana y el mecanismo de acceso al lado. No se ha medido sobre planos originales.
3. **El mecanismo.** No se usa el brazo pivotante de un HDD moderno: es un carro vertical con un brazo radial. En la comparación con el HDD se dice expresamente: «1956: CARRO QUE SUBE Y BAJA · HDD: BRAZO QUE GIRA».
4. **Los discos.** Son 50, con grosor, sobre un eje común y con huecos oscuros entre ellos. La cámara entra entre dos discos y el brazo no atraviesa ninguno.
5. **Color de los discos.** Se usa un bronce grisáceo (óxido de hierro), más fiel a las fotos en color que el azul grisáceo de la paleta del guion. El resto de la paleta se respeta.
6. **Miniaturización.** Las escalas de tamaño son reales, con zoom logarítmico y una barra de escala. La capacidad se muestra creciendo sin cifras, como pide el guion. Las épocas son aproximadas: años 60–70, años 80 (5,25″), 3,5″ y 2,5″.
7. **Escala.** Las comparaciones respetan la escala real. La microSD sobre el armario se ve con lupa, sin agrandarla. El cierre lleva el rótulo «SECUENCIA HISTÓRICA · NO A ESCALA».

## Voz

- `01_ENTRADA/audio/voz_original_ramac.mp3`: md5 `3586f33b80106b12e0420667e24f55e8`, idéntico al archivo subido. 93,884 s. Sin ninguna modificación.
- Correcciones solo en los subtítulos:
  - «discuets» → «disquetes»;
  - «Ramac» → «RAMAC»;
  - «asombroteca» → «Asombroteca»;
  - las cifras habladas se muestran en dígitos.
- Whisper transcribió «Compártela este vídeo». Los subtítulos ponen «Compártele este video», como el guion. Es la forma que Whisper suele confundir y no se pudo comprobar de oído, así que conviene escucharlo.

## Música y efectos

Todo es original y generado con la plantilla:

- **Música:**
  - pulsos electrónicos para el gancho;
  - `MUS.industrial` (nuevo: percusión mecánica suave, bordón grave y cuerdas) para 1956;
  - un golpe orquestal en «3,75 MB»;
  - piano para la explicación;
  - pulsos para la evolución;
  - cuerdas épicas para la comparación;
  - piano para la resolución.
- **Efectos:**
  - nuevos: `sala1956`, `motorDiscos` (suave, sin «turbina»), `carro`, `panel`, `interruptor`, `escribir`, `leer`, `chipFlash`, `disquete`, `miniaturizar`;
  - existentes: `saltoTiempo`, `contador`, `sello`, `encender`, `flujoDatos`.

## Fotografías reales incorporadas (V2)

Se usaron las cuatro imágenes que adjuntó el usuario. Se guardan sin alterar en `01_ENTRADA/referencias/` y se incrustan reescaladas en `04_CODIGO/js/fotos.js`. Aparecen como tarjetas documentales con el rótulo «FOTOGRAFÍA REAL» o «PIEZA REAL», con su pie y su crédito en pantalla.

| # | Imagen | Momento | Crédito y licencia (según el encargo) | Observaciones |
|---|---|---|---|---|
| 1 | IBM 305 RAMAC (BRL61-IBM_305_RAMAC.jpeg, Wikimedia Commons) | 19,1–22,5 s | Dominio público | Muestra el sistema; se acompaña de «IBM 305 RAMAC: SISTEMA INFORMÁTICO COMPLETO · IBM 350: SU UNIDAD DE DISCOS» |
| 2 | Disco del RAMAC (RAMAC_305_disk.JPG) | 27,7–31,0 s | Foto: Mikaël Restoux (Deep silence) · CC BY 2.5 | Va junto al gráfico «≈ 61 cm · 24″». Atribución en pantalla y aquí |
| 3 | Disco duro abierto (Harddrive_platters.jpg) | 60,0–62,3 s | Dominio público | Rotulada «UNIDAD AVERIADA: NO MUESTRA SU FUNCIONAMIENTO». No se presenta como pieza de 1956 |
| 4 | microSD con adaptador (Adaptador_MicroSD.png) | 83,6–86,1 s | CC0 | Ilustra tamaño y formato, no capacidad. **Discrepancia:** la imagen adjunta muestra una tarjeta de 32 GB con la marca Kingston, no una de 4 GB como indica el encargo. No se menciona su capacidad y la de 1 TB se rotula como «EJEMPLO» |

**Verificación pendiente.** Desde la sesión no se puede abrir commons.wikimedia.org (dominio no permitido). Las licencias y autorías vienen del encargo del usuario y no se pudieron comprobar en las páginas originales. Antes de publicar, confirma que cada imagen adjunta es el archivo de Commons citado. Esto vale sobre todo para la foto 4, porque la marca y la capacidad no coinciden con la descripción. Repite la atribución de la foto 2 en la descripción del video: «Foto del disco RAMAC: Mikaël Restoux, CC BY 2.5».

## Cambios de la V2 (corrección final)
- **IBM 350 rediseñado a partir de la foto 1:**
  - gran ventana de inspección, banda superior oscura, panel derecho con rejillas y pilotos;
  - pila de 50 discos anulares con el gran agujero central de la pieza real (foto 2) y paso de 1,5 cm; los huecos entre discos se ven oscuros;
  - mecanismo de acceso con dos guías, carro, cable con polea y brazo radial con dos cabezas.
- **Proporción de la pila.** No se dispone de planos: el paso se eligió para que la pila (≈ 74 cm de alto) sea coherente con la foto. Es una aproximación.
- **Extracción del disco eliminada.** Antes un disco salía del armario; ahora se compara con la foto real y con el gráfico de 61 cm.
- **Capacidad:** contador de caracteres de 0 a 5.000.000 (rotulado «CONTANDO…»), luego «× 6 BITS = 30.000.000 BITS = 3.750.000 BYTES» y por último «≈ 3,75 MB». Ya no aparecen megabytes intermedios.
- **Escritura y lectura.** La codificación «cambio = 1 · sin cambio = 0» es una simplificación divulgativa: la lectura detecta las transiciones de flujo. Se rotula como «SIMPLIFICADO».
- **Flash:** celda de puerta flotante con carga o sin ella. Se rotula como no volátil y se distingue de la RAM. Hay una escena «MISMO PROPÓSITO, OTRA TECNOLOGÍA».
- **Comparaciones separadas:**
  - tamaño físico a escala real: el técnico con la tarjeta y una lupa;
  - capacidad como ejemplo: 1 TB = 1.000.000 MB, ≈ 266.667 veces 3,75 MB;
  - la secuencia de evolución lleva «ESCALA AJUSTADA EN CADA PASO» y el tamaño real escrito de cada aparato.
- **Narración.** No se detectó ninguna inexactitud que obligue a cambiarla.
