# FUENTES Y DECISIONES · «Yakhchal: hielo en el desierto» (Episodio 03)

Asombroteca · Plantilla v1.21 (yakhchal fiel a la fotografía) · V2

## Datos y su base
| Dato | Uso en pantalla | Fuente |
|---|---|---|
| *Yakhchal* (یخچال): *yakh* «hielo» + *chāl* «pozo» | ««POZO DE HIELO» EN PERSA» | Etimología estándar del persa |
| Edificios con cúpula y depósito excavado bajo el suelo | V2: cúpula de perfil CURVO medido sobre la fotografía de Meybod (r = R0·(1 − y/H)^0,55; desviación < 4 % respecto a la silueta de la foto), vestíbulo al sur, depósito con muro de contención, escalera, sumidero y drenaje (V1 usaba una cúpula escalonada, ya descartada) | Fotografías aportadas por el usuario (yakhchal de cúpula y yakhchal cónico escalonado); literatura general sobre los yakhchal de Irán |
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

## V2 · Corrección cinematográfica profunda (2026-11-02)
- **Versión oficial elegida por el usuario: la que contiene la fotografía real del yakhchal.**
  - La versión V2 (`07_OUTPUT/V2/`) y la V3 publicable contienen la foto A con «FOTOGRAFÍA ACTUAL», el pie «YAKHCHAL DE MEYBOD · IRÁN» y el crédito «Foto: Ggia · CC BY-SA 3.0», de 21,5 a 27,5 s.
  - La versión sin foto queda solo como respaldo en `07_OUTPUT/V1/`.
  - Recordatorio de licencia (CC BY-SA 3.0): atribución y enlace a la licencia en la descripción. La autoría y la licencia no se pudieron verificar en Commons desde la sesión.
- **Tratamiento de la foto (pedido por el usuario):**
  - tarjeta con acercamiento lento;
  - ampliación hasta alinear la silueta de la foto con la del modelo (misma cámara, bordes difuminados);
  - fundido a la reconstrucción.
  - El contenido de la foto no se altera: solo se escala y se funde. Lo recreado se rotula «RECONSTRUCCIÓN».
- **No se usó ninguna foto de interior:** no se recibió una verificada. La segunda imagen adjunta es otro exterior y sigue sin usarse.
- **Depósito:**
  - pozo excavado con muro de contención revestido de adobe;
  - escalera tallada en el muro, desde la entrada, fuera del volumen del hielo;
  - paja entre capas, rotulada como aislante;
  - sumidero y drenaje del agua de fusión;
  - parte del hielo llega al verano, pero no todo.
- **Muro de sombra:** al sur del estanque, de este a oeste. Los rayos del sol de invierno rozan su arista y la sombra cubre el estanque. El muro da sombra al estanque y la cúpula aísla el depósito: funciones relacionadas pero distintas, y así se rotulan.
- **Física, sin cifras inventadas:**
  - el agua pierde energía hacia el cielo nocturno y el aire;
  - la congelación crece desde la superficie y desde las orillas;
  - el calor avanza más despacio por la pared, que no es una barrera perfecta;
  - no hay temperaturas;
  - la Luna no aparece como fuente de frío.

## V3 · Retoques finales (2026-11-02) — `07_OUTPUT/ASOMBROTECA_03_YAKHCHAL_PUBLICABLE.mp4`
- **Perfil de la cúpula medido en la foto:**
  - se midieron los bordes de la silueta fila a fila (214 bordes) y se ajustó por mínimos cuadrados, vista desde la misma cámara de la transición, el perfil r = R0·(1−h)^0,70·(1+0,22·sen πh), con remate redondeado (parabólico desde h ≈ 0,8);
  - error ≈ 10 px de media cuadrática, frente a ≈ 57 px de V2: mis medidas a ojo de V2 subestimaban la anchura de la mitad inferior;
  - script en `04_CODIGO/ajuste_silueta_foto.py`;
  - sigue siendo una reconstrucción didáctica, no un levantamiento del edificio.
- **Capas de agua:** el rótulo dice «CAPAS DE AGUA DE 5–10 CM · En instalaciones documentadas». Ya no afirma que esa cantidad se congelara necesariamente cada noche.
- **Bloque de hielo:** mide 44 × 32 cm en todas las escenas. Es un tamaño didáctico, sin cifra en pantalla.
- **Aislamiento:** «EL CALOR ENTRA LENTAMENTE · la pared no lo bloquea del todo», sin valores numéricos.
