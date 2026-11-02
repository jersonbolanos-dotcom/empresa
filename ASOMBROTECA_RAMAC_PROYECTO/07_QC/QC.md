# QC · ASOMBROTECA_PRIMER_DISCO_DURO_FINAL.mp4 (V2 · corrección final)

Ruta: `ASOMBROTECA_RAMAC_PROYECTO/07_OUTPUT/ASOMBROTECA_PRIMER_DISCO_DURO_FINAL.mp4`. La versión anterior está en `07_OUTPUT/V1/`, `07_QC/V1/`, `05_AUDIO/V1/` y `04_CODIGO/V1/`.

| Comprobación | Resultado |
|---|---|
| ffprobe | H.264 High 4.1 · 1080×1920 · 30/1 fps constantes · AAC-LC 48 kHz estéreo · faststart |
| Duración | 94,884 s · 2846 fotogramas |
| Tamaño | 73,0 MB (< 100 MB) |
| Decodificación completa | 0 errores |
| Negros / congelados / silencios | 0 / 0 / 0 |
| Sonoridad | −14,0 LUFS · LRA 1,8 LU · pico −1,4 dBTP. Mismos ajustes de mezcla que la V1 |
| md5 de la voz | 3586f33b80106b12e0420667e24f55e8 = archivo subido. Voz y guion sin cambios |
| Determinismo | t = 5,3 · 17,9 · 41 s: mismo md5 en orden directo e inverso |
| Retrocompatibilidad v1.19.1 | Solo cambian bloques v1.19 que únicamente usa este episodio (`ibm350`, `worker1956`, `fingertip`, disco interno). Los bloques nuevos son aditivos |

## Revisión por intervalos (`fotogramas/`, `hoja_contacto_mp4.jpg`, `movimiento_t*.jpg`)
| Intervalo | Qué se revisó | Tira |
|---|---|---|
| 0–8 s | La mano con la microSD a escala (dedo ≈ 17 mm, tarjeta 11 × 15 mm), la cámara que se aleja y la entrada en 1956 | `t1.0`, `t6.0` |
| 8–23 s | El IBM 350 rediseñado junto al técnico que señala, y la foto 1 con la distinción 305 / 350 | `t19.0` |
| 23–38 s | Se retira el cristal; el recuento termina en 50; el carro cambia de disco con el brazo retirado (sin atravesar platos); la cámara entra entre dos discos; foto 2 + 61 cm; capacidad sin cifras contradictorias | `t22.8`, `t27.4`, `t34.0` |
| 39–57 s | Corte magnético grande; carro y brazo; escritura (la bobina cambia la magnetización); lectura (pulsos en los cambios → bits); hueco de aire | `t47.0`, `t52.6`, `t55.0` |
| 58–75 s | Plato de 61 cm frente a un HDD a la misma escala; partes del HDD; foto 3; miniaturización; HDD frente a microSD; chip NAND; celda de puerta flotante | `t58.0`, `t61.6`, `t70.4`, `t72.6` |
| 75–90 s | Evolución con el tamaño real de cada paso; tamaño físico a escala real; foto 4 + capacidad como ejemplo; disquete | `t81.6`, `t83.6` |
| 90–95 s | Secuencia histórica (no a escala) y ASOMBROTECA | `t89.6` |

## Defectos encontrados y corregidos durante el QC
- El pulgar quedaba levantado y la mano parecía hacer una «V»: se rebajó a lo largo de la palma.
- Los rótulos de las partes del HDD no llegaban a verse antes de la foto 3: se adelantó el acercamiento y la foto se prolonga hasta 62,3 s.
- El contador de años mostraba cifras intermedias sin sentido («2086»). Se sustituyó por el año aproximado de cada aparato: 1956, ≈ 1970, ≈ 1980, ≈ 1990, ≈ 2005, HOY.
- El técnico quedaba cortado en el borde: se recolocó.
- El cubo blanco superior se veía desde abajo: ahora solo se dibuja si la cámara está por encima.
- Rótulos de la celda flash: ahora tienen líneas hasta la puerta flotante y el canal.

## Pendiente (no verificable aquí)
- Licencias y autorías de las fotos según el encargo (Commons no está accesible desde la sesión).
- La foto 4 adjunta muestra una microSD de 32 GB con marca, no la de 4 GB descrita. Ver `FUENTES_Y_DECISIONES.md`.
