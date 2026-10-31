# Fuentes y decisiones · El robo de Binance (Asombroteca)

Fecha de consulta de todas las fuentes: **31 oct 2026**.

## Limitación de la verificación

Desde este entorno el proxy de red bloqueó la descarga directa de páginas (binance.com, trmlabs.com, thehackernews.com, etc.). Los datos se contrastaron con un **buscador web**, que devolvió títulos, URL y extractos de varios medios. Antes de publicar, alguien debe abrir al menos las fuentes primarias marcadas con ★ y confirmar las cifras.

## Datos que aparecen en pantalla

| Dato en pantalla | Fuente(s) | Resumen de lo que dicen | Estado |
|---|---|---|---|
| 29 oct 2026: robo en billeteras calientes de Binance | [CNBC 30 oct](https://www.cnbc.com/2026/10/30/billions-in-crypto-frozen-in-binance-hack-heres-what-happens-next-.html), [Al Jazeera 30 oct](https://www.aljazeera.com/news/2026/10/30/binance-says-6-3bn-stolen-in-biggest-crypto-heist-in-history-what-we-know), [The Hacker News](https://thehackernews.com/2026/10/binance-suffers-security-breach.html) | Los retiros no autorizados empezaron el 29 oct (≈20:05 UTC según varias fuentes) | Corroborado por varios medios |
| ≈US$6.300 M (estimación de Binance) | Al Jazeera, CNBC, [MarketScale](https://www.marketscale.com/industries/software-and-technology/binance-pauses-withdrawals-after-a-theft-it-puts-at-6-3-billion-the-largest-crypto-hack-on-record) | Binance cifra el robo en unos 6.300 M USD | Corroborado |
| ≈US$6.360 M en 10 redes; «la mayor parte en unos 20 minutos» (TRM Labs) | ★ [TRM Labs blog](https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history), [Cointelegraph](https://cointelegraph.com/news/north-korea-linked-to-63b-binance-hack-by-crypto-investigators) | Cita de TRM: «approximately USD 6.36 billion out of Binance wallets on ten blockchains, most of it in about 20 minutes» | Corroborado (extracto citado por el buscador) |
| ≈US$3.000 M congelados on-chain (Binance, 30 oct) | The Hacker News («Nearly $3 Billion Frozen»), [The Currency Analytics](https://thecurrencyanalytics.com/crypto-exchanges/binance-freezes-3b-assets-after-6-3b-hot-wallet-compromise-307092), CNBC 30 oct | Unos 3.000 M congelados con emisores e investigadores. Eran sobre todo stablecoins; ETH y BTC no se congelaron | Corroborado |
| 90 % de los activos afectados **repuesto** con fondos propios (31 oct) | ★ [CNBC 31 oct](https://www.cnbc.com/2026/10/31/binance-hack-asset-coverage-withdrawals.html), [CoinDesk 31 oct](https://www.coindesk.com/business/2026/10/31/binance-says-it-has-replaced-90-of-stolen-crypto-after-massive-usd6-3-billion-breach), [TechBooky](https://www.techbooky.com/binance-says-90-of-assets-affected-by-6-3b-hack-are-replenished/) | Binance repuso el respaldo del ≈90 % (el 30 oct era ≈80 %) con el fondo de seguros de futuros, la tesorería y el SAFU. **No** son fondos recuperados del atacante. El dato depende de las declaraciones de Binance | Corroborado como declaración de Binance |
| Reservas propias «SAFU + tesorería» | CNBC 31 oct, CoinDesk 31 oct | Fondo de seguros de futuros, tesorería corporativa y SAFU | Corroborado |
| «Causa: en investigación» | CNBC 30 oct, [SOCRadar](https://socradar.io/blog/binance-hack-6-3b-hot-wallet-theft/) | Hay una explicación preliminar (posible acceso desde el portátil de un ingeniero DevOps a un contenedor de servicio). Binance no había publicado la causa raíz definitiva | Se muestra solo «en investigación» |

## Decisiones editoriales

1. **Dos cifras del monto.** La cifra grande es la de Binance (≈6.300 M). Debajo, en gris, va la de TRM (≈6.360 M en 10 redes, valor al momento del movimiento). Así cada cifra lleva su autor, y el texto explica que difieren por el método de cálculo.
2. **«≈20 min» va separado del monto** y dice «la mayor parte de los fondos · según TRM Labs». No dice «todo el robo duró 20 minutos».
3. **Atribución omitida en pantalla.** TRM atribuye el ataque a TraderTraitor (Corea del Norte) «con alta confianza», y Chainalysis coincide. Es una atribución analítica, no una conclusión de Binance, y la locución no la menciona, así que se omite. Algunos medios citan además al FBI; no se verificó en fuente primaria.
4. **Mecanismo del compromiso.** Hay análisis de terceros que hablan de delegación EIP-7702 o del portátil de un DevOps. **No se representan**: la investigación seguía abierta y la regla es no enseñar pasos explotables. La escena 06 lleva la etiqueta «RECREACIÓN CONCEPTUAL».
5. **Congelado ≠ recuperado y repuesto ≠ recuperado.** Las reservas propias (bloque oro) entran desde otra capa, sin conexión con las rutas del robo. En ningún momento hay una transferencia de vuelta del atacante a Binance. Las dos cifras se muestran en chips separados («90 % REPUESTO» y «≈3.000 M CONGELADOS») para no mezclar unidades (porcentaje frente a dólares).
6. **Física de las transacciones.** El valor se representa como cambio de saldos: las filas del libro bajan en la billetera y los anillos de los receptores se llenan. No viajan monedas físicas. Las rutas son una visualización conceptual y no reconstruyen transacciones reales.
7. **«Normalmente».** El botón «Deshacer» tachado lleva la salvedad «*normalmente: no existe una reversión automática*».
8. **Gancho.** El fotograma 0 muestra el objeto con luz de contorno, el rótulo «ROBO DE CRIPTOMONEDAS» y la fecha (la primera palabra se oye a 0,22 s). La cifra monumental aparece cuando la voz la dice (≈16,6 s), porque sincronizar con el audio tiene prioridad 1. En los primeros segundos el callout «custodia digital» presenta el objeto.
9. **Marca.** No hay logo. Solo el texto «ASOMBROTECA» en la esquina superior izquierda (30 px, 62 % de opacidad), fuera de la franja de subtítulos y sin intro ni outro de marca. El cierre usa el barrido de luz a escenario blanco propio del estilo de referencia.

## Decisiones técnicas

- **Voz.** Única pista en `01_ENTRADA/audio/` (MP3 mono, 44,1 kHz, 128 kbps, 115,487 s). Se usa íntegra, sin cortes ni cambios de tempo o tono. SHA-256 idéntico al archivo subido. En la mezcla, la voz pasa de mono a estéreo (mismo canal en L y R) y recibe la misma ganancia de master que el resto (+4 dB). Un limitador a −1 dBFS solo actúa en picos aislados.
- **Alineación.** No había ningún modelo de reconocimiento de voz: Hugging Face y los servidores de modelos están bloqueados por el proxy. Se alineó por pausas del audio (28 tramos de voz que coinciden 1:1 con las frases del guion) y reparto silábico dentro de cada tramo (`04_CODIGO/tools/alinear.py`). En el primer tramo el reparto entre las dos primeras pausas se infirió por densidad de núcleos silábicos. Una escucha humana debería confirmar que no hay palabras distintas del guion; si las hay, basta con editar `SEGS` y regenerar.
- **Música.** Instrumental original, generada con el kit SOUND (`k.music` y `k.tone`) en una pasada aparte con `voiceover:false`, porque el modo voiceover la suprime. `lib/sound.js` no se modificó.
- **Efectos.** `SOUND.renderOffline(scoreSound, DURATION, 48000, {voiceover:true})`.
- **Fuente tipográfica.** Inter (OFL 1.1), del paquete npm `@fontsource/inter@5.0.18`, incrustada en base64. Su subconjunto latin no tiene ≈ ni ≠, así que esos signos se dibujan como trazos.

## V3 · logos y símbolos

- Binance: `binance.svg` de [Simple Icons](https://simpleicons.org) 16.36.0 (CC0; fuente indicada por el proyecto: binance.com). Color #F0B90B. El trazado se extruye en 3D sin cambiar su geometría.
- BTC, ETH, USDT y BNB: [cryptocurrency-icons](https://github.com/spothq/cryptocurrency-icons) 0.18.1 (CC0), versión color con disco y glifo.
- Las fichas son **ejemplos del ecosistema** y llevan la etiqueta correspondiente. No significan que esos activos fueran robados. Según CNBC (31 oct), los activos congelados eran sobre todo stablecoins y Binance declaró plenamente respaldados BTC, ETH, USDT, BNB, SOL, USDC y otros. No se afirma en pantalla qué activos se sustrajeron ni qué redes se usaron.
- Las 6 confirmaciones de bloque son ilustrativas.
- El indicador del 90 % llega directo a su valor, sin cuenta: la reposición fue del 80 % (30 oct) al 90 % (31 oct) y no se inventan hitos intermedios.
