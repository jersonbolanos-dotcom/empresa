# Fuentes y decisiones · Musk vs Zhao

Consulta: 31 oct 2026. El proxy de este entorno bloquea x.com, wikimedia.org y la mayoría de medios, así que los hechos se contrastaron con un buscador web. Las URL de los posts vienen del kit.

## Hechos que aparecen en pantalla

| Dato | Fuentes | Estado |
|---|---|---|
| Hackeo de Binance, 29-30 oct 2026, «más de 6.000 M» (guion); reportes de ≈6.300 M | CNBC, Al Jazeera, CoinDesk (ver episodio Binance) | Corroborado. En pantalla se lee «+US$6.000 MILLONES» y una nota: «reportes: unos US$6.300 millones» |
| Musk respondió con 😬 a una comparación con FTX | Kit: x.com/elonmusk/status/2116025797400236362; [Yahoo Finance](https://finance.yahoo.com/markets/crypto/articles/elon-musk-trolling-binance-hack-102655034.html) | Corroborado |
| Musk publicó 🔥😂 ante un aviso de seguridad de CZ (otro hilo) | Kit: x.com/elonmusk/status/2116034884393213964; [crypto.news](https://crypto.news/cz-elon-musk-stop-trolling-binance-hack/), [Decrypt](https://decrypt.co/382236/elon-musk-cz-trade-blows-spacex-shares-binance-hack) | Corroborado. Se rotula «otro hilo» |
| Zhao: «Elon, have a lot of respect for you, but bad time to troll. Please stop.» | [CryptoSlate](https://cryptoslate.com/cz-asks-musk-to-stop-trolling-saying-our-spacex-shares-top-1-billion/), [BeInCrypto](https://beincrypto.com/cz-elon-musk-spacex-shares-binance-hack-gap/), kit | Corroborado (fragmento) |
| Mismo post: «Our SPCX shares (from our $500m investment in your Twitter takeover) are worth more than a billion.» | CryptoSlate, Decrypt, Indian Express (kit) | Corroborado. Es la afirmación de Zhao, no una valoración auditada, y así se rotula |
| Yi He: no necesitan vender, los ingresos anuales cubrirían las pérdidas | Reuters (kit), Decrypt | Paráfrasis; se rotula «RESUMEN EDITORIAL · NO ES CITA LITERAL» |
| FTX se declaró en quiebra en noviembre de 2022 | Hecho público ampliamente documentado | Se muestra como recorte de archivo, con una línea de comparación (nunca «=») |

## Decisiones

- **Guion y voz.** La transcripción alineada coincide palabra por palabra con `02_GUION_APROBADO_NO_MODIFICAR.txt`; la comprobación automática dio True. La voz se usa entera: el SHA-256 coincide con el archivo subido. Se añade 1 s de cola visual con silencio; la voz no se toca.
- **Fotos.** No hay fotos reales porque la descarga desde Wikimedia fue bloqueada (403). Musk y Zhao aparecen como **fichas tipográficas**: nombre, cuenta y papel con una trama abstracta, **sin un rostro inventado**. `tools/build.py` detecta los JPG si se colocan en `04_CODIGO/recursos/fotos/` con los nombres del manifiesto. Entonces los procesa con `treat()` + `makePrint()` (halftone duotono, borde rasgado, cinta) y basta con volver a renderizar.
- **Publicaciones.** Se recrean en código como «EXTRACTO EDITORIAL»: sin avatar, likes, verificaciones ni timestamps de la interfaz de X. X-03 y X-04 son **la misma hoja**, que se despliega.
- **Emojis.** Twemoji (CC-BY 4.0), solo los documentados: 😬, 🔥 y 😂.
- **Motor visual.** `editorial-collage-core-adaptado.js` del kit, sin modificar. El `editorial-collage.js` original completo **no venía** en el kit; aquí no se afirma haberlo usado. Dos adaptaciones en `episodio.js`, ambas documentadas:
  - Parallax relativo a la cámara: el `place()` del núcleo desplaza las regiones lejanas del origen.
  - `bgPaper` con mosaico de la fibra.
- **Sonido.** H y SOUND idénticos a los del kit (comparados sin espacios). Efectos con `voiceover:true`. La música original va en un stem aparte (`voiceover:false`), porque el kit la suprime en modo voz.
- **Marca.** «ASOMBROTECA» aparece una sola vez, discreta, en el cierre. Sin logo.

## Créditos (para la descripción)

- Logos: Simple Icons, CC0. Las marcas pertenecen a sus titulares y se usan de forma referencial.
- Emojis: Twemoji © Twitter, Inc. y colaboradores, CC-BY 4.0.
- Tipografías: Anton, Oswald y Libre Baskerville (OFL 1.1).
- Si se añaden las fotos: Elon Musk, Trevor Cokley/U.S. Air Force (dominio público en EE. UU.); Changpeng Zhao, Aevozer/Wikimedia Commons, CC BY-SA 4.0, adaptación con trama y recorte.

## Versión con fotografías (FINAL_ASOMBROTECA_ELON_ZHAO_1080x1920_FOTOS.mp4)

- **Fotos.** Musk y Zhao en las dos fotografías que el usuario envió en el chat. Los originales se guardaron sin tocar en `04_CODIGO/recursos/fotos/original_*.webp`. **No he podido verificar su autor ni su licencia**:
  - Musk: parece el retrato de la Royal Society de 2018.
  - Zhao: es un retrato de estudio profesional.
  - Antes de publicar, confirma el origen de ambas y añade los créditos correspondientes. Si alguna no tiene una licencia adecuada, se puede sustituir por las fotos de Wikimedia del kit: es el mismo flujo, basta con cambiar el archivo.
- **Tratamiento.** Recorte de cabeza y hombros, y después `treat()` (semitono duotono a 45°, celda 4) + `makePrint()` (borde blanco rasgado, sombra, textura). Cinta con `tape()`, aparición con `putSpr()` a 12 fps y `place()` con parallax. No se alteran la identidad ni la expresión.
- **Cambios limitados (todo lo demás queda igual).**
  - Las fichas de nombre de Musk y Zhao ahora muestran la foto y su rótulo de nombre debajo: en la apertura, en las reacciones de X y en la escena de Zhao.
  - Acercamiento moderado (+8 %) sobre la foto de Zhao durante su cita.
  - Dos miniaturas rotuladas «MUSK» (junto a la compra de Twitter) y «ZHAO» (junto al sello «SEGÚN ZHAO»).
  - El cierre muestra ambas fotos enfrentadas con sus nombres.
- **Sin cambios.** La pista de audio del MP4 nuevo es idéntica bit a bit a la anterior: MD5 de la pista decodificada 6911d1f905afc4bc6d37ca5e64a9f6f6 en ambos. Tampoco cambian la duración, los subtítulos ni la cámara.
