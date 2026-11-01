# Fuentes y decisiones · ¿Cómo funciona realmente un aire acondicionado?

## Audio
- **Narración original:** `01_ENTRADA/audio/voz_original_aire_acondicionado.mp3`, 86,988 s, MP3 de 44,1 kHz. Se generó con ElevenLabs en el plan **Starter**, que según ElevenLabs incluye licencia comercial. No se alteró.
- **Transcripción:** Whisper-small local. Coincide palabra por palabra con el guion; Whisper escribió «Sombroteca» y se corrigió a «Asombroteca». Hay 21 tramos reales en `03_GUION/tramos.txt`.

## Ciencia representada

| Principio | Cómo se muestra |
|---|---|
| El aparato transporta calor del interior al exterior gastando trabajo eléctrico | El calor entra en el evaporador y sale por el condensador. La nota final dice: «calor expulsado = calor de la habitación + trabajo del compresor» |
| Circuito cerrado | Un único recorrido continuo (`CIRCUIT`) que se traza completo y se mantiene en todas las escenas |
| El refrigerante entra al evaporador como mezcla fría de baja presión | Tramo «línea» con fase de mezcla y color frío. Dentro del serpentín la mezcla se evapora hasta quedar en vapor (corte del tubo) |
| El ventilador interior mueve el aire a través del evaporador | Ventilador de flujo cruzado. El aire entra por arriba más cálido y sale por el deflector más fresco (trazadores, no humo) |
| El compresor eleva la presión y la temperatura del vapor | Corte de un compresor **rotativo**, común en equipos split pequeños (otros usan scroll): la cámara de compresión se achica, el mismo número de moléculas queda más apretado, sube el manómetro y el color pasa de frío a caliente |
| El condensador libera calor al exterior y el vapor condensa | Flechas de calor hacia el aire exterior, aire de salida más cálido y corte del tubo con gotas que forman líquido. Al final del serpentín, el líquido sigue enfriándose (subenfriado, temperatura «tibia») |
| La válvula de expansión reduce la presión y produce una mezcla fría | Corte de la válvula con aguja y orificio: líquido de alta presión que pasa a mezcla de baja presión con burbujas (evaporación parcial). El calor no «desaparece» |
| La FASE y la TEMPERATURA son propiedades distintas | `P.fluid` dibuja la fase con la forma (núcleo líquido = puntos; vapor = anillos; mezcla = ambos) y la temperatura con el color (rampa azul → rojo). El refrigerante no es «azul = líquido, rojo = gas» |
| Alta presión y baja presión | Indicadores en la válvula y leyenda en el ciclo completo: alta = compresor → condensador → válvula; baja = válvula → evaporador → compresor |

**Ubicación de la válvula:** en muchos splits, el dispositivo de expansión (válvula electrónica o capilar) está en la unidad exterior. Por eso se dibuja allí, y la línea delgada lleva la mezcla fría hasta el evaporador.

**Cifras:** no se muestra ninguna (ni temperaturas, ni presiones, ni potencias). Los indicadores son cualitativos.

## Fuentes consultadas
- Componentes y funciones de un mini split (MRCOOL): https://support.mrcool.com/hc/en-us/articles/37811336473620-Mini-Split-System-Components-Functions
- Cómo funcionan los aires acondicionados sin ductos (RefrigerantHQ): https://refrigeranthq.com/ductless-air-conditioners-work/
- Partes de un mini split sin ductos (Daikin Comfort): https://daikincomfort.com/blog-detail/parts-of-a-ductless-mini-split-system
- Mini split: historia, funcionamiento y aplicaciones (AirCondLounge): https://aircondlounge.com/mini-split-wiki-history-operation-applications/
- Cómo funcionan las bombas de calor mini split (PickHVAC): https://www.pickhvac.com/?p=44902
- Balance de energía Q_cond = Q_evap + W_comp: primera ley de la termodinámica aplicada al ciclo de compresión de vapor (física general).

## Mejoras añadidas a la plantilla (v1.4)
Se añadieron los bloques `path`, `strokePath`, `fluid`, `airStreaks`, `fanAxial` y `fanCross`, y los FX `ventilador`, `compresion`, `expansion`, `goteo` y `calor`. Están documentados en `PLANTILLA_ASOMBROTECA/CAMBIOS_PLANTILLA.md`, en `INSTRUCCIONES_PLANTILLA.md` y en el catálogo.
