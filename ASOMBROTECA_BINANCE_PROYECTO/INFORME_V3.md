# Informe V3 · remasterización cinematográfica

Entregable: `../ASOMBROTECA_BINANCE_FINAL_V3.mp4`. La V2 se conserva como `../ASOMBROTECA_BINANCE_FINAL_V2.mp4`, y su código, subtítulos, audio y QC están en `08_VERSION_ANTERIOR_V2/`.

## Qué cambió

**El protagonista ahora cambia con cada concepto.** La placa negra del ejemplo (`body()`/`chip()`) ya no aparece en el video. Siguen en el código como referencia de iluminación. Cada concepto tiene su propio objeto, todos hechos con la misma proyección `cam()`, la luz key/rim, los barridos especulares, el reflejo de suelo y el acabado del estilo original (`js/protagonistas.js`):

| Concepto | Protagonista | Cómo se une al siguiente |
|---|---|---|
| Binance | Emblema 3D extruido en oro #F0B90B, a partir del trazado oficial de Simple Icons. Le atraviesa una perturbación roja en «ocurrió» y gira en «Binance». | La cámara entra en él |
| 20 min / 6.300 M | Anillo temporal de 20 min en el suelo. El valor sale por el anillo y cambia de oro a rojo en «atacantes». Unas partículas suben hasta la cifra. | El emblema se aleja |
| No fue una bóveda | Puerta de bóveda de acero y fajos en 3D, tachados con la palabra y desintegrados en partículas | **Match cut:** el dial de la cerradura sobrevive |
| Billetera caliente | Dispositivo de vidrio y metal con pantalla: saldo, activos de ejemplo, entradas y salidas, LED y ondas de conexión | El dial se convierte en su indicador de autorización. La cámara atraviesa el cristal |
| Autorización | Tres tarjetas 3D: Solicitud → Verificación → Firma (capa interna de Binance). La transacción va luego a la cadena (capa de red) | Retroceso de cámara |
| Retiros no autorizados | Tarjetas y pantalla en rojo, saldo que baja, rutas rojas hacia direcciones externas | La cámara sigue la salida |
| Blockchain | La operación entra como anotación en un bloque. Aparecen 6 confirmaciones (ilustrativas), se sella con candado y «Deshacer» sale tachado | La cadena pasa a primer plano |
| Dispersión / rastreo | El grafo de V2, ahora naciendo del origen rojo, con una retícula de rastreo que salta entre nodos | Subida a cenital |
| Congelamiento | Solo algunos nodos se vuelven turquesa con candado. Los demás siguen emitiendo pulsos | Continuo |
| Reposición | Torre de lingotes de reserva con el emblema, separada de las rutas del robo, y flujo oro hasta la billetera | Retroceso que separa las dos fuentes |
| 90 % | Indicador circular que llega directamente al 90 %, sin cifras intermedias. El 10 % restante va en rojo tenue | Énfasis sobre el mismo plano |
| Conclusión | Tarjetas y billetera. Un rastro luminoso va de la firma a la billetera y de ahí a las salidas, y en «minutos» se cierra el candado. Barrido a blanco con el dial-candado | Barrido de luz del estilo |

**Logos.** Son SVG genuinos guardados en `04_CODIGO/recursos/logos/` (ambos paquetes son CC0 y sus trazados no se modificaron):
- Binance: Simple Icons 16.36.0.
- BTC, ETH, USDT y BNB: cryptocurrency-icons 0.18.1.

Las fichas solo aparecen cuando la voz habla del ecosistema («plataformas de criptomonedas») y de mover activos. Siempre llevan la etiqueta «ejemplos» o «activos de ejemplo», porque **no** indican qué activos se robaron. No se nombra ninguna red como afectada.

**Rótulos.**
- Los titulares ya no repiten el subtítulo, salvo los términos clave que se enfatizan a propósito: «Billetera caliente», «Autorización digital», «Confirmada», «¿Cómo?».
- Texto secundario con un mínimo de 30–32 px y en un gris más claro (#C7C7CC).
- Frases nuevas de máxima claridad:
  - «SEGUIR UNA TRANSACCIÓN ≠ RECUPERAR EL DINERO».
  - «REPUESTO CON RECURSOS PROPIOS / NO SIGNIFICA 90 % RECUPERADO DEL ROBO».
  - «Fuente independiente · no viene de los atacantes».
  - «congelados on-chain: solo una parte».

**Sonido.** La música no cambia. Los efectos de V2 se mantienen y se añadieron otros, todos con el kit SOUND original:
- Emblema: brillo del barrido, interferencia ×2, giro y fichas.
- Bóveda: impacto de la puerta, giro del volante y fajos.
- Billetera: zumbido del dial al volar y arranque de la pantalla.
- Autorización: selección de tarjetas y alarma al pasar a rojo.
- Blockchain: 6 ticks de confirmación.
- Rastreo: pitidos de la retícula.
- Reservas: golpes de los lingotes.
- 90 %: un *riser* que sube hasta la cifra en lugar de la cuenta numérica.
- Cierre: rastro de consecuencias.

## Qué se conservó

- La voz original, sin cambios: su SHA-256 coincide con el del archivo subido.
- El guion, la alineación y los subtítulos (mismo SRT).
- H y SOUND, idénticos byte a byte a la reconstrucción.
- `window.seek(t)`, `window.DURATION` y `window.scoreSound`.
- Render determinista con H.rng.
- El grafo de rutas azul y rojo, los contadores, los degradados, la cámara continua, el barrido a blanco y el acabado (viñeta y grano).

## Qué se comprobó de verdad (ver 07_QC/)

- MP4: 1080×1920, H.264 High, yuv420p, 30 fps, 3465 fotogramas decodificados. AAC estéreo 48 kHz. moov al inicio.
- Decodificación completa con 0 errores. Sin fotogramas negros ni congelados.
- Mezcla: −14,8 LUFS, pico −1,0 dBFS.
- 0 errores JS durante el render.
- Revisión visual de 33 capturas del MP4 (`07_QC/contacto_V3.png`) y del storyboard.

Durante esa revisión se corrigieron cuatro problemas:
- tarjetas de autorización que se veían de canto;
- nombres de las tarjetas superpuestos;
- torre de reservas cortada en el borde;
- titular del cierre encima de las tarjetas.

También se quitó un tachón en «NO SIGNIFICA 90 % RECUPERADO», que se leía como una doble negación.

## Límites que siguen vigentes

- La alineación por palabra no usa reconocimiento de voz (ver FUENTES_Y_DECISIONES.md). Falta una escucha humana de control.
- Las 6 confirmaciones son ilustrativas: el número real depende de cada red.
- Los logos de terceros son marcas registradas. Se usan con fines informativos y sin alterar su geometría.
