# Fuentes y decisiones · Del disquete a las memorias diminutas

Vídeo único, gancho C en segunda persona · plantilla v1.42 · consultado el 15-11-2026. Dos fuentes por dato.

> **Cómo se verificó.** Todas las páginas se leyeron **completas**. Las normas de Ecma están escaneadas (sin texto), así que se leyeron sus páginas convertidas a imagen: ECMA-125, cláusulas 6.1.2 (grosor), 9.8 y 9.11 (sectores y capacidad por pista) y 10 (300 vueltas por minuto); ECMA-147, cláusula 6.1.2 (grosor). Ningún dato sale solo del resumen del buscador.
> Fuentes: un organismo técnico de normas (Ecma International), un museo (Computer History Museum), fabricantes (Kioxia, Samsung) y Wikipedia como apoyo.

## Fuentes
- **[ECMA-125]** Ecma International, *Standard ECMA-125: Data interchange on 90 mm flexible disk cartridges using MFM recording at 15 916 ftprad on 80 tracks on each side* (1987), el disquete de 3,5" de alta densidad: https://ecma-international.org/publications-and-standards/standards/ecma-125/ (PDF: https://ecma-international.org/wp-content/uploads/ECMA-125_1st_edition_december_1987.pdf)
- **[ECMA-147]** Ecma International, *Standard ECMA-147* (1990), disquete de 90 mm de 2,88 megas (mismo cartucho): https://ecma-international.org/publications-and-standards/standards/ecma-147/
- **[CHM-1]** Computer History Museum, The Storage Engine, «1976: Minicomputers stimulate floppy disk sales»: https://www.computerhistory.org/storageengine/minicomputers-stimulate-floppy-disk-sales/
- **[CHM-2]** Computer History Museum, Revolution, «Floppy Disks»: https://www.computerhistory.org/revolution/story/261
- **[KIOXIA-SD]** Kioxia, ficha de la tarjeta microSD EXCERIA PLUS G2: https://europe.kioxia.com/en-mea/personal/micro-sd/exceria-plus-g2.html
- **[KIOXIA-BiCS]** Kioxia, «What is the 3D Flash Memory "BiCS FLASH™"?»: https://www.kioxia.com/en-jp/rd/technology/bics-flash.html y «3D Flash Memory BiCS FLASH™»: https://americas.kioxia.com/en-us/business/memory/bics.html
- **[SAMSUNG]** Samsung Insights, «Embracing the V-NAND Paradigm Shift» (2015): https://insights.samsung.com/2015/08/26/embracing-the-v-nand-paradigm-shift-whitepaper
- **[WIKI-FD]** Wikipedia, «Floppy disk»: https://en.wikipedia.org/wiki/Floppy_disk
- **[WIKI-FLASH]** Wikipedia, «Flash memory»: https://en.wikipedia.org/wiki/Flash_memory
- **[WIKI-USB]** Wikipedia, «USB flash drive»: https://en.wikipedia.org/wiki/USB_flash_drive
- **[WIKI-SD]** Wikipedia, «SD card»: https://en.wikipedia.org/wiki/SD_card

## Datos verificados
| Dato en el vídeo | Fuente 1 | Fuente 2 |
|---|---|---|
| Un disquete guardaba un poco más de un mega | [ECMA-125] 9.8 y 9.11: 18 sectores de 512 bytes por pista (9.216 bytes), 80 pistas por cara, 2 caras → 1.474.560 bytes | [CHM-1]: «with up to 1.44 MB capacity»; [WIKI-FD]: «1.44 MB (1,474,560 bytes)» |
| Un disco con imán (recubrimiento magnético) que giraba | [ECMA-125] 10: el disco gira a 300 vueltas por minuto; «magnetic surface of the disk» | [WIKI-FD]: «a thin, flexible disk coated with a magnetic storage medium»; «a spindle motor… rotates the magnetic medium» |
| Una cabeza que corría encima, leyendo y escribiendo puntitos magnéticos | [ECMA-125]: la cabeza de lectura y escritura se mueve de la pista 00 a la 79 («Line of Access») y la superficie está en contacto con las cabezas magnéticas | [WIKI-FD]: «a stepper motor-operated mechanism moves the magnetic read/write heads radially along the surface»; también [CHM-2] |
| Todo se movía… y por eso **podía** dañarse | [WIKI-FD]: sacar el disco mientras gira «is likely to cause damage to the disk, drive head» | [WIKI-USB]: la memoria flash es «more durable due to a lack of moving parts» que el disquete; [CHM-2]: el de 3,5" era «more durable than previous floppy formats» (deducción: por eso «podía») |
| La tarjeta de hoy no tiene nada que gire | [SAMSUNG]: la memoria flash funciona «rather than a spinning disk» | [WIKI-USB]: «no fragile moving parts» |
| Cajoncitos (celdas) que guardan electricidad (electrones) encerrada | [KIOXIA-BiCS]: en cada celda los electrones se intercambian con una película que guarda la carga; «the number of electrons accumulated in one memory cell» | [WIKI-FLASH]: la capa de nitruro de silicio «traps electrons»; [SAMSUNG]: «the number of electrons stored in each cell» |
| Se encogieron tanto que ya no podían achicarse más | [KIOXIA-BiCS]: «there are limits to miniaturization technology»; al encogerse, cada celda guarda menos electrones | [SAMSUNG]: por debajo de 20 nanómetros hay menos electrones por celda y es más difícil leerlas |
| Así que los apilaron como un edificio de más de cien pisos | [KIOXIA-BiCS]: 48 capas en 2015, 96 en 2018, 162 en 2022; la generación 10 tiene 332 capas | [WIKI-FLASH]: memorias 3D de 160 y 176 capas; [SAMSUNG]: «multiple layers of cells that are stacked vertically» |
| Una tarjeta de quinientos doce gigas, del tamaño de una uña | [KIOXIA-SD]: microSD de 512 GB; medidas 15,0 × 11,0 × 1,0 mm | [WIKI-SD]: microSD «15 mm × 11 mm × 1 mm» |
| Más de trescientos mil disquetes / una torre de más de un kilómetro | Cálculo de abajo con [ECMA-125] (capacidad y grosor 3,3 mm) y [KIOXIA-SD] (capacidad útil) | [ECMA-147] confirma el mismo grosor del cartucho (3,3 mm ± 0,2 mm) |
| Miles de millones de cajoncitos | Deducción: 512 gigas ≈ 4 billones de bits y cada celda guarda pocos bits ([SAMSUNG]: tres por celda), así que son más de un billón de celdas; «miles de millones» se queda corto | [WIKI-FLASH]: celdas que guardan uno o varios bits |

## El cálculo del dato fuerte
1. **Un disquete** ([ECMA-125]): 18 sectores × 512 bytes × 80 pistas × 2 caras = **1.474.560 bytes**.
2. **Una tarjeta de 512 gigas** ([KIOXIA-SD]): capacidad útil 460,8 gigas, con 1 giga = 1.073.741.824 bytes → 460,8 × 1.073.741.824 = **494.780.232.499 bytes**.
3. **Disquetes para llenarla:** 494.780.232.499 ÷ 1.474.560 = **335.544 disquetes** → «más de trescientos mil».
   - Con los 512 gigas nominales del envase (512 × 1.000.000.000 bytes) saldrían 347.222. Se usa la cifra menor, la de la capacidad útil.
4. **Altura de la torre:** cada cartucho mide **3,3 mm** de grueso ([ECMA-125] 6.1.2 y [ECMA-147] 6.1.2) → 335.544 × 3,3 mm = **1.107.295 mm ≈ 1.107 metros** → «más de un kilómetro».
   - Con 347.222 disquetes serían 1.146 m. En ambos casos, más de un kilómetro.

## Decisiones
- **Voz:** una sola toma (Eleven v4, voz Dan; 938 caracteres, 63,7 s, 938 créditos). No hizo falta `[QUITAR]` ni `[PAUSA]`. Voz intacta (md5 por tramo, 24/24 iguales). A petición del usuario: «Tu tarjeta de hoy es otra biblioteca… pero sin nada que gire».
- **Sin siglas en la voz:** «megas», «gigas», «memoria»; números en letras. En pantalla se escribe «1 MEGA», «512 GIGAS», «+100 PISOS», «+300.000» y «1 KM».
- **Sonido (plantilla v1.42):** etiquetas a −10 dB; el «tin» (`FX.clave`) suena solo 4 veces: «un poco más de un mega», «más de cien pisos», «más de trescientos mil» y «más de un kilómetro».
- **Metáfora:** la biblioteca que se encoge (el disquete, una biblioteca redonda que gira con una cabeza que corre; la tarjeta, cajoncitos con electricidad encerrada apilados como un edificio).
- **Exageraciones didácticas:** los «libros» en el disco, los puntitos magnéticos como flechas de colores, los electrones grandes con signo menos, la «tapa» que se cierra sobre ellos (en la realidad los rodea una capa aislante), la tarjeta que sale a cámara, la avalancha y la torre entre las nubes (la persona a su lado no está a escala) son ilustrativos.
- **El disquete por dentro:** se dibuja en corte (disco, ventana y cabeza); en el real la cabeza entra por la ventana de la persiana metálica.
- **Sin marcas ni logos:** computador beige, celular, tarjeta y disquetes genéricos y dibujados; sin fotos. Las manos de cerca son las ilustradas del canal (`P.manoImg`).
- **No se compara la torre con ningún edificio famoso** para no necesitar otras fuentes.
- **Portada:** «TODO EN / UNA UÑA» con «UNA UÑA» en rojo (línea de la palabra clave) y la etiqueta «DEL DISQUETE A HOY»; el disquete grande junto a la tarjetita en la punta del dedo; la marca debajo, fuera del dibujo (`--marca-y 1850`).
- **Red del entorno:** se añadieron los dominios de Ecma, el Computer History Museum, la SD Association, Micron, Kioxia y la sala de prensa de Samsung para leer las fuentes completas (la página de la SD Association y la de Micron piden verificación y no se usan).

## v2.0 · Modo viral (rehecho con la plantilla v2.0)
- **Excepción de voz (aprobada por el usuario):** el modo viral pide que la segunda frase sea un segundo dato y que el remate responda al título. Este episodio **conserva las frases ya grabadas** (Dan, Eleven v4, una sola toma, 0 créditos nuevos, voz intacta: md5 y 24/24 tramos idénticos). Por eso la segunda frase («¿Cómo pasamos de esto… a esto?») y el cierre son los de la versión anterior. Los vídeos nuevos sí siguen la fórmula completa.
- Contador «DISQUETES QUE CABEN» = 335.544: 1.474.560 bytes por disquete (ECMA-125: 18 sectores × 512 B × 80 pistas × 2 caras) y tarjeta de 512 GB con 460,8 GiB útiles (494.780.232.499 bytes). Letra pequeña en pantalla: «Cálculo: ECMA-125 (1,44 MB) y tarjeta de 512 GB».
- Escala real en el plano «esto / esto»: 1 mm = 8,5 px de mundo (disquete de 90 mm, microSD de 11 × 15 mm, uña de un índice adulto ≈ 13 mm).
- Respaldo de la versión anterior (v1.43, con música y personajes) en `V2/`.

## v2.0 · Vídeo completo en modo viral (FINAL)
- **Contadores y su fuente en pantalla (letra pequeña con franja):**
  - «UN POCO MÁS DE 1 MEGA» → **1.474.560 bytes** = 80 pistas × 18 sectores × 512 B × 2 caras ([ECMA-125]).
  - «MÁS DE 100 PISOS» → **162 pisos de celdas** (Kioxia BiCS FLASH de 2022, [KIOXIA-BiCS]); la voz dice «más de cien», y 162 lo cumple (hay generaciones de 218 y 332 capas).
  - «MÁS DE 300.000» → **335.544 disquetes** (cálculo de arriba, [ECMA-125] + [KIOXIA-SD]).
  - «MÁS DE 1 KM» → **1.107 m** = 335.544 × 3,3 mm ([ECMA-125] 6.1.2); la regla de altura sube a 1 m = 6 px.
- **Un solo mundo con la cámara viajando:** uña → computador de los 90 y «disco lleno» (primer plano de las manos en el teclado, sin persona) → la cámara entra por la ranura al disquete y por la ventana de la persiana al disco → sale a la uña y entra en la tarjeta (celdas, electricidad encerrada, se encogen, edificio de capas) → sale a la uña → montaña y torre (de lado) → vuelta a la uña. **2 cortes secos** (53,0 s, al revelar «más de trescientos mil», y 59,7 s, «en una uña») y **2 fogonazos** («uña» y el final).
- **Sonido (regla 155):** 14 efectos en todo el vídeo, como mucho 3 por cada 10 s; la avalancha, el giro del disco y la montaña son un solo sonido continuo cada uno; los contadores suben en silencio y suenan con un golpe al final; el «tin» (`FX.clave`) solo 3 veces: «trescientos mil», «kilómetro» y la «uña» final. Silencio real antes de «Más de trescientos mil» (1,8 s). Sin música.
- **Final en bucle:** en «… en una uña» el último plano repite el fotograma 0; durante ese plano (y el gancho) solo se ve el titular, sin subtítulos (`capOcultar`).
- **La voz** es la misma toma (excepción anotada arriba): por eso la segunda frase y el cierre «Envíaselo…» son los grabados.
- Respaldo de la versión anterior en `V2/`.
