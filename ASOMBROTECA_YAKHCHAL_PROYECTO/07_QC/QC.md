# QC · Yakhchal V3 (retoques finales) · `07_OUTPUT/ASOMBROTECA_03_YAKHCHAL_PUBLICABLE.mp4`

Versión oficial CON la fotografía real del yakhchal de Meybod. Se trabajó sobre la V2, respaldada en `07_OUTPUT/V2/`, `04_CODIGO/V2/`, `05_AUDIO/V2/` y `07_QC/V2/`. Voz, guion y duración sin cambios. Solo se marca como superado lo que se ha probado (2026-11-02).

## 1 · Pruebas técnicas — `qc_tecnico.txt`
| Prueba | Resultado |
|---|---|
| ffprobe | H.264 High 1080×1920 · 30/1 constante (r = avg = 30) · 2880 fotogramas · AAC LC 48 kHz estéreo · 96,0 s · 71,8 MB |
| Decodificación completa | 0 errores |
| blackdetect / freezedetect / silencedetect | 0 intervalos · ninguno · ninguno |
| ebur128 | −14,0 LUFS · LRA 2,8 LU · pico −1,6 dB |
| md5 de la voz | `a7d4b23ebe34d850c0fcafe2d915dab8`, idéntico al original |
| Determinismo | 2 cargas en orden distinto: mismos md5 de fotograma |
| Comprobaciones del modelo | 20/20 superadas (`comprobaciones.txt`) |

Mezcla: igual que en V2. Las pistas se regeneraron porque cambió el momento de un efecto en la transición de la foto. La música es la misma.

## 2 · Correcciones pedidas y cómo se comprobaron
| # | Corrección | Comprobación |
|---|---|---|
| 1 | **Gancho:** las burbujas abstractas se sustituyen por la esquina de un bloque de hielo natural (`P.iceMacro2`), con superficie irregular, núcleo lechoso, columnas de burbujas, canto translúcido, reflejos discretos, escarcha y una gota que resbala. Se conserva el retroceso al depósito y la subida al desierto | Tiras `t0.0`, `t2.4` y `t4.2` |
| 2 | **Foto → modelo:** se midió la silueta real de la foto (214 bordes) y se ajustó por mínimos cuadrados el perfil del modelo maestro: (1−h)^0,70·(1+0,22·sen πh) con remate redondeado. El error baja de ≈ 57 px a ≈ 10 px de media cuadrática. El fundido con dos cúpulas dura 0,45 s. Créditos intactos | `comparacion_foto_modelo.jpg`, tira `t25.2`, comprobación automática nueva con la silueta medida |
| 3 | **Etiqueta:** «CAPAS DE AGUA DE 5–10 CM» + «En instalaciones documentadas», sin «por noche». Cada noche se añade una lámina de agua que se enfría y se congela desde arriba; no aparece hielo de golpe | Tiras `t43.4` y `t46.0` |
| 4 | **Extracción:** la barra entra en la ranura y no atraviesa el bloque; al separarse hay una grieta y saltan esquirlas; ya no hay un bloque duplicado; el bloque mantiene su tamaño (44 × 32 cm) en el corte, el levantamiento, el transporte, la escalera y la colocación; las manos quedan sobre la carga | Tira `t48.2` |
| 5 | **Escalera:** peldaños macizos de adobe hasta el fondo, apoyados en el muro, con 13 dm de ancho, sombra bajo cada nariz y continuidad desde el rellano de la entrada. El trabajador apoya un pie en cada peldaño (posición ajustada al escalón) | Tira `t52.4` y comprobación «la escalera no atraviesa el hielo» |
| 6 | **Hielo almacenado:** blanco azulado menos saturado, núcleo lechoso, canto translúcido, burbujas sutiles, aristas irregulares y base plana con línea de contacto | Hoja de contacto (6,8 · 53 · 85 s) |
| 7 | **Aislamiento:** corte más grande, banda de revoque distinta del adobe, flechas perpendiculares a la superficie, puntos que avanzan despacio dentro del muro y una flecha pequeña que llega al interior; fondo cálido fuera y tono frío dentro. Rótulos: «EL CALOR ENTRA LENTAMENTE · la pared no lo bloquea del todo», «EXTERIOR · SOL» e «INTERIOR · MÁS FRESCO». Sin cifras | Tira `t62.2` |
| 8 | **Comparación:** al sol, rayos que llegan al bloque, charco que crece y sombra en el suelo; protegido, un bloque de la pila dentro del depósito (bóveda, paja, muro). Etiquetas más grandes con subtítulo cualitativo («se funde rápido» / «se funde despacio») | Tira `t70.8` |
| 9 | **Invierno → verano:** estanque helado → depósito lleno → meses (luz y estanque que se deshiela) → estanque seco a ras de suelo → vuelta al depósito con parte del hielo → interior del depósito, en lugar de otra órbita repetida. Sin indicador redundante | Tiras `t76.6` y `t79.4` |
| 10 | **Cierre:** alejamiento menor y más alto, con estanque seco, muro, sombra y cúpula reconocibles; luz cálida; «ASOMBROTECA» discreto | Tiras `t88.6` y `t93.4` |
| 11 | **Etiquetas:** fondo de las píldoras más opaco (contraste) y sin solapes. Se quitó el indicador de estaciones donde repetía el mes | Hoja de contacto |
| Extra | **Fundidos:** durante los fundidos de 0,3 s la cúpula se veía como una malla (juntas entre caras). Ahora la escena se compone en una capa opaca y se funde entera | Fotogramas 4,25 · 52,2 · 33,8 |
| Extra | **Cámaras:** el plano de entrada (4–5 s) empezaba al sur del muro y quedaba tapado; ahora empieza al norte, sobre el estanque | Tira `t4.2` |

## 3 · Revisión de movimiento (tiras del MP4, 5 fps)
Franjas revisadas: 0–6 s, 22–28 s, 40–49 s, 48–55 s, 56–65 s, 70–73 s, 76–87 s y 88–96 s, en 15 tiras (`movimiento_V3_*`). Las anomalías encontradas se corrigieron y se volvió a exportar: dos renders completos más.

## 4 · Limitaciones sin resolver
- El modelo reproduce la silueta de la foto, no su textura: las bandas y las manchas apenas se insinúan.
- Mientras el hielo avanza, en primer plano todavía se intuye la cuadrícula de celdas del estanque.
- En la escalera el trabajador mide unos 110–120 px: el gesto se lee, pero no el detalle de las manos.
- La zanja del corte 3D es un recurso didáctico.
- No hay foto del interior, porque no se recibió ninguna verificada.
- No pude consultar la Encyclopaedia Iranica ni la ficha de Commons desde la sesión por las restricciones de red. La licencia CC BY-SA 3.0 exige atribución y un enlace a la licencia al publicar.
