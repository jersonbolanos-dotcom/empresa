# QC · ASOMBROTECA_PUENTES_ANTISISMICOS_FINAL.mp4 (V2 · plantilla v1.15.1)

Versión anterior respaldada en `07_QC/V1/`, `07_OUTPUT/V1/`, `05_AUDIO/V1/` y `04_CODIGO/V1/episodio.js`.

## Verificación técnica (ffprobe / ffmpeg sobre el MP4 final)
| Prueba | Resultado |
|---|---|
| Contenedor / códecs | MP4 · H.264 High@4.1 yuv420p · AAC LC 48 kHz estéreo 192 kb/s · faststart · sin marcas de agua |
| Resolución / fps / fotogramas | 1080×1920 · 30 fps · 3059 fotogramas |
| Duración | 101,989 s (voz 100,989 s + 1 s de cola) |
| Tamaño | 69,0 MB (< 100 MB) |
| Decodificación completa | 0 errores |
| blackdetect (≥ 0,3 s) | 0 tramos negros |
| freezedetect (n 0,001, ≥ 2,5 s) | 0 congelados |
| silencedetect (−45 dB, ≥ 1,5 s) | 0 silencios |
| Sonoridad (ebur128) | −13,9 LUFS · LRA 2,9 LU · pico verdadero −1,2 dBFS (sin clipping; astats pico −1,31 dB) |
| md5 de la voz | 70d39c79874860c4e4036db6484a15b7 = entrada (voz intacta, reloj maestro) |
| Determinismo | t = 5,3 · 17,9 · 41 s: mismo md5 en orden directo e inverso |
| Retrocompatibilidad v1.15.1 | Solo cambian bloques v1.15 (`bridge`, `bridgeSection`) y se añaden bloques nuevos; ningún otro episodio los usa (comprobado con grep) |

## Inspección visual
- Hoja de contacto del MP4: `hoja_contacto.jpg` (26 fotogramas, `fotogramas/`).
- Secuencias de movimiento (fotogramas cada 0,2 s): `secuencias/apertura.jpg`, `comparacion.jpg`, `apoyos.jpg`, `disipador.jpg`, `junta.jpg`, `cierre.jpg`.

Revisado y correcto:
- Apoyos: placas superior e inferior conectadas a viga y cabezal en todo el ciclo; caucho, láminas y núcleo de plomo se cortan juntos y vuelven; reposo (40,8–42,4 s) antes del movimiento.
- Pilares y cimentaciones: zapatas enterradas (terreno cercano), estribos encajados en el talud; el terreno ya no tapa el extremo del tablero en los planos del estribo.
- Disipador: el cilindro sigue al estribo, el vástago a la ménsula del tablero; el pistón cambia de posición y el flujo y la flecha de resistencia cambian de sentido con la velocidad.
- Juntas: estado normal con coches cruzando sobre los peines cerrados; los coches se detienen antes de que la junta se mueva y ninguno queda sobre ella; la abertura nunca supera la longitud de los dientes.
- Comparación A/B: mismo sismo, misma escala y cámara; flechas rotuladas como indicadores cualitativos.
- Textos dentro de márgenes (40–1040 px), notas ≥ 32 px fuera de la franja de subtítulos; aviso de amplificación solo al inicio de cada plano con movimiento.

Errores detectados y corregidos durante el QC: terreno que tapaba el extremo del tablero junto al estribo; viga del primer plano del aislador dibujada como sección; rótulos superpuestos en el resumen y en la comparación; coche que cruzaba la junta al empezar a abrirse y desaparecía de golpe; rótulo de la junta tapando un coche.

## Límites conocidos
- Proyección 2,5D (oblicua y perspectiva simple), no 3D real con iluminación física.
- Los factores de amplificación son distintos para suelo, pila y tablero (se escalan para que se vean); por eso se rotula la amplificación.
- La flecha de resistencia del disipador (∝ √|v|) y la barra de energía son cualitativas, no salen de un modelo numérico de diseño.
