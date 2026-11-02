# FUENTES Y DECISIONES · «Yakhchal: hielo en el desierto» (Episodio 03)

Asombroteca · Plantilla v1.20 (módulo yakhchal)

## Datos y su base
| Dato | Uso en pantalla | Fuente |
|---|---|---|
| *Yakhchal* (یخچال): *yakh* «hielo» + *chāl* «pozo» | ««POZO DE HIELO» EN PERSA» | Etimología estándar del persa |
| Edificios con cúpula (a menudo escalonada) y depósito excavado bajo el suelo | Modelo maestro: cúpula escalonada con entrada y pozo | Fotografías aportadas por el usuario (yakhchal de cúpula y yakhchal cónico escalonado); literatura general sobre los yakhchal de Irán |
| En algunas instalaciones el agua se extendía en capas de ≈ 5–10 cm que se congelaban en noches de invierno suficientemente frías; después se añadía otra capa | «≈ 5–10 CM EN ALGUNAS INSTALACIONES», con «NOCHE 1, 2, 3 · TIEMPO ACELERADO · VARIAS NOCHES» | Encyclopaedia Iranica, según el encargo. **No se pudo consultar desde la sesión** (red restringida) |
| Muro de sombra al sur del estanque, de este a oeste, que da sombra al estanque | Modelo maestro y sección del sitio | Encargo del usuario y descripción habitual de los yakhchal con muro de sombra |
| Sol de invierno a mediodía ≈ 34,6° sobre el horizonte, al sur (latitud ≈ 32° N, solsticio: 90 − 32 − 23,44) | Las sombras del modelo y la comprobación automática | Cálculo astronómico (latitud aproximada de Yazd y Meybod) |

## Física (sin cifras inventadas)
- **Flechas naranjas = transferencia de energía térmica; tonos azules = menor temperatura.** El frío nunca se dibuja como un líquido que circula.
- **Congelación:** el agua pierde energía hacia el cielo y el aire («EL AGUA PIERDE ENERGÍA HACIA EL CIELO Y EL AIRE»). No se atribuye todo a la radiación, la Luna no aparece como fuente de frío y no hay hielo instantáneo: la congelación crece desde la superficie con un paso de tiempo indicado.
- **Almacenamiento:** «EL CALOR LLEGA MÁS DESPACIO, NO DESAPARECE». Las paredes y el terreno retrasan el calentamiento; no crean frío. Parte del hielo llega al verano (no todo) y el agua de fusión se drena a un sumidero.
- **Sin temperaturas inventadas.** No se muestra ninguna temperatura ni velocidad de congelación.

## Modelo maestro y comprobaciones
- **Un único modelo `P.YK`** en decímetros (x = este, z = sur). El 3D, la sección técnica (vista desde el este, con el norte a la derecha) y la escena lateral de transporte usan la misma geometría y la misma escala.
- **Proporciones aproximadas:** cúpula de unos 17,5 m de alto y 20 m de diámetro en la base, pared de 2 m en la base a 0,7 m arriba, pozo de unos 6 m de profundidad. Es una reconstrucción didáctica, sin planos de un yakhchal concreto, y así se rotula («RECONSTRUCCIÓN HISTÓRICA»).
- **`04_CODIGO/comprobaciones.js`** verifica 15 condiciones; resultado en `07_QC/comprobaciones.txt`, con las 15 superadas:
  - estanque al norte del muro;
  - muro este–oeste;
  - el estanque no invade la cúpula;
  - el camino conecta la entrada con el estanque;
  - el canal llega desde el oeste;
  - sombras hacia el norte y la sombra de invierno cubre el estanque;
  - la entrada es mayor que una persona;
  - el depósito queda bajo tierra;
  - el perfil es continuo;
  - el audio es válido;
  - los subtítulos están en zona segura.

## Fotografías
- **Fotografía A (exterior de Meybod):** se usó la primera imagen adjunta (cúpula tras un muro de adobe), que coincide con la descripción del archivo de Commons *20110102_Ice_House_(exterior)_Meybod_Iran.jpg* (Ggia, **CC BY-SA 3.0**). No se pudo comprobar en Commons que sea exactamente ese archivo: hay que confirmarlo.
- **Fotografía B (interior de Meybod):** no se recibió. La segunda imagen adjunta es otro yakhchal **por fuera** (cono escalonado), de autoría y licencia desconocidas. Por eso no se usó como foto del interior ni se incorporó al video, como pide el encargo: «no sustituyas silenciosamente las referencias». Solo sirvió de referencia visual para la forma escalonada del modelo. En ese momento del video se muestra únicamente la reconstrucción.
- **Licencia CC BY-SA 3.0:** exige atribución y que las adaptaciones se compartan con la misma licencia. Desde aquí no se puede garantizar que el video completo cumpla esa condición, porque depende de cómo lo publiques. Por eso se entregan dos versiones:
  - **`ASOMBROTECA_03_YAKHCHAL_FINAL.mp4`:** sin fotografías incorporadas, solo animación. Es la versión publicable sin condiciones de licencia.
  - **`ASOMBROTECA_03_YAKHCHAL_CON_FOTO.mp4`:** con la fotografía A (21,8–25,4 s), rótulo «FOTOGRAFÍA ACTUAL», pie «YAKHCHAL DE MEYBOD · IRÁN» y crédito «Foto: Ggia · CC BY-SA 3.0» en pantalla. Úsala solo si aceptas las condiciones de la licencia: atribución, enlace a la licencia en la descripción y, si se considera adaptación, compartir igual.
- En ningún caso se presenta la foto como de dominio público ni se anima su contenido.

## Voz
- `01_ENTRADA/audio/voz_original_yakhchal.mp3`: md5 `a7d4b23ebe34d850c0fcafe2d915dab8`, idéntico al subido. 95,007 s. Sin cambios.
- **Correcciones solo en subtítulos:** «Jackchall» → «yakhchal», «persia» → «Persia» y «caloroso» → «caluroso». Whisper escribió «caloroso»; lo más probable es que la voz diga «caluroso», pero conviene confirmarlo de oído.

## Música y efectos (originales)
- **Música:** `MUS.persa`, nueva: modo de tipo Homayun, santur pulsado, bordón y daf, sin citas de obras existentes. Hay variaciones de tempo y densidad por bloque, y cuerdas en el ciclo final.
- **Efectos:**
  - nuevos: `hieloCrujir`, `pico`, `bloque`, `escarcha`;
  - existentes: viento, calor, agua, goteo, salto de tiempo, etiquetas, sello y campana.
