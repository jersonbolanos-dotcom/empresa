# QC · Yakhchal V2 · `07_OUTPUT/ASOMBROTECA_03_YAKHCHAL_FINAL.mp4` (versión oficial con fotografía)

Solo se marca como superado lo que se ha probado. Fecha: 2026-11-02.

## 1 · Pruebas técnicas — `qc_tecnico.txt`
| Prueba | Resultado |
|---|---|
| ffprobe | H.264 High 1080×1920, 30/1, 2880 fotogramas · AAC LC 48 kHz estéreo · 96,0 s · 73,2 MB (< 100 MB) |
| Decodificación completa (`ffmpeg -v error -f null`) | 0 errores |
| blackdetect (d 0,3 s, umbral 0,08) | 0 intervalos |
| freezedetect (n 0,002, d 1,5 s) | ninguno |
| silencedetect (−50 dB, 1 s) | ninguno |
| ebur128 | −14,0 LUFS integrados · LRA 2,8 LU · pico −1,6 dB (≤ −1) |
| md5 de la voz | `a7d4b23ebe34d850c0fcafe2d915dab8`, idéntico al original. Voz sin cambios de duración, velocidad ni recorte |
| Determinismo | 2 cargas de la página, orden distinto (5,3 · 17,9 · 41 s): mismos md5 de fotograma |
| Retrocompatibilidad | `plantilla.js` solo AÑADE bloques: diff de +301 / −0 líneas en la inserción; los ajustes posteriores afectan solo a bloques nuevos. Ningún episodio anterior usa los bloques v1.21 y se comprobó que no hay nombres repetidos. No se tocó ningún bloque existente, así que no hacía falta reconstruir los demás episodios |
| Audio | Pistas regeneradas dos veces. Diferencia máxima entre ejecuciones ≈ 4·10⁻⁸, equivalente a −135 dB (redondeo flotante del render de audio), inaudible |

**Mezcla:**
```
[voz 48 kHz, apad 96,007][música +1 dB → sidechaincompress(voz) thr 0,03 ratio 6][efectos −3 dB]
→ amix normalize=0 → +7,8 dB → alimiter 0,8 → afade out 95,207 s (0,8 s)
```

## 2 · Comprobaciones automáticas del modelo — `comprobaciones.txt` (20/20)
- **Estanque, muro y canal:** el estanque queda al norte del muro de sombra, el muro va de este a oeste y el canal llega desde el oeste.
- **Sombras:** el sol de invierno (≈ 34,6°) da sombra que cubre el estanque, y las sombras de verano van hacia el norte.
- **Vestíbulo:** une la entrada con el camino; la puerta mide 17 dm.
- **Perfil curvo continuo, sin escalones:** espesor horizontal mínimo de 14 dm; la pared es más gruesa en la base.
- **Silueta del modelo frente a silueta medida en la foto:** desviación máxima del 3,8 % del radio de la base.
- **Escalera:** no atraviesa el hielo (246 bloques comprobados) y baja desde el lado de la entrada.
- **Bloques:** todos quedan dentro del muro de contención, y cada uno apoya ≥ 40 % de su base sobre un bloque de la capa inferior.
- **Foto:** está cargada.
- **Esta prueba falló la primera vez y se corrigió:** había bloques sin apoyo en el borde del pozo ataluzado.

## 3 · Pruebas visuales realizadas (hojas de prueba antes del render y hoja del MP4)
Tres rondas de fotogramas de prueba (46 + 20 + 6 fotogramas) antes del render final, y 2 renders completos corregidos. Hoja de contacto del MP4: `hoja_contacto_mp4.jpg` (26 fotogramas). Tiras de movimiento del MP4 (5 fps):
- `movimiento_V2_t25.4_foto_a_modelo.jpg`
- `movimiento_V2_t43.3_congelacion.jpg`
- `movimiento_V2_t48.2_cortar_levantar.jpg`
- `movimiento_V2_t52.3_bajar_colocar.jpg`
- `movimiento_V2_t75.4_invierno_verano.jpg`

| Área | Prueba | Resultado |
|---|---|---|
| Arquitectura · exterior | Cúpula curva, lisa, con textura y sombra de contacto (28,6 s) | OK |
| Arquitectura · comparación con la foto | `comparacion_foto_modelo.jpg`: foto, mezcla al 50 % y modelo con la misma cámara; las siluetas coinciden | OK |
| Arquitectura · sección | Perfil curvo, revoque, adobe, pared más gruesa abajo, vestíbulo, pozo ataluzado, escalera con murete y drenaje (20,8 · 62,9 · 64,8 s) | OK |
| Arquitectura · depósito y entrada | Corte 3D con bóveda interior, rellano, revestimiento, escalera y paso de entrada (30,8 · 53 · 59,9 s) | OK |
| Arquitectura · estanque y muro | Taludes, caballón, canal; muro al sur con rayos y sombra sobre el estanque (68,6 s) | OK |
| Animación · congelación | Ondas → pérdida de energía → cristales desde las orillas → vista lateral → noches → grosor para cortar (43,3–48 s) | OK. Al principio los cristales se veían como un tablero de cuadros; se usó una cuadrícula más fina y una transición suave |
| Animación · corte y traslado | Barra en la ranura → palanca → el bloque se separa → se levanta → porteadores por el camino hasta el vestíbulo | OK |
| Animación · colocación | Baja la escalera tallada (lejos del hielo) con el bloque y lo coloca | OK, aunque la figura se ve pequeña en el plano (ver limitaciones) |
| Animación · calor | Flechas cualitativas que se atenúan en la pared; una pequeña parte llega al interior | OK |
| Animación · invierno → verano | Estanque helado → transporte → depósito lleno → meses (luz, estanque sin hielo, seco) → verano → queda parte del hielo | OK |
| Audiovisual | Subtítulos blancos con resaltado amarillo, capY 1540; rótulos a y < 1420; foto con crédito; sin logos; «ASOMBROTECA» discreto al final | OK |
| Cámara | Ningún plano con la cámara bajo tierra ni con el muro tapando el sujeto | OK. Se corrigió en la ronda 1, donde había varios planos al sur del muro y uno bajo tierra |
| Sincronía | Planos y rótulos anclados a palabras de la voz (`wt`). Duración 96,0 s | OK |

## 4 · Limitaciones sin resolver (honestas)
- **Superficie del modelo:** el modelo no copia la textura de la foto. La silueta coincide, pero la envolvente 3D es más uniforme: las bandas horizontales, las manchas y las muescas de la escalera de la foto aparecen solo como detalle tenue.
- **Colocación del bloque (53–55 s):** el trabajador mide unos 110 px de alto. Se lee bien la acción (baja con el bloque y lo deposita), pero no los detalles de las manos.
- **Cristales del estanque:** en el primer plano todavía se intuye la cuadrícula de celdas mientras avanza el hielo. Cuando termina de congelarse, la superficie queda continua.
- **Zanja del corte 3D:** el corte del terreno se muestra como una zanja recta, un recurso didáctico y no una excavación real.
- **Interior:** no hay fotografía del interior. La foto B nunca se recibió, así que el interior es solo reconstrucción y así se rotula.
- **Datos no consultados desde aquí:** la Encyclopaedia Iranica (capas de 5–10 cm) y la ficha de Commons de la foto (autor y licencia) no se pudieron abrir por la red restringida.
- **Dimensiones y meses:** las dimensiones son una reconstrucción didáctica, no los planos de un yakhchal concreto. Los meses (ENERO → JULIO) son orientativos.
