# QC · ASOMBROTECA_EP05_FINAL_PUBLICACION.mp4 (retoque cinematográfico final, V2)

Versión anterior: `07_OUTPUT/V1/ASOMBROTECA_05_TARJETAS_PERFORADAS_FINAL_V1.mp4` (QC en `07_QC/V1/`).

## Técnico (`qc_tecnico.txt`)
| Comprobación | Resultado |
|---|---|
| Vídeo | H.264, 1080×1920, 30 fps constantes, 2662 fotogramas |
| Audio | AAC 48 kHz estéreo, 192 kb/s |
| Duración / tamaño | 88,73 s (voz 87,72 s + 1 s de cierre) · 66,7 MB |
| Decodificación completa | 0 errores |
| blackdetect / freezedetect / silencedetect | sin incidencias |
| Sonoridad | −14,1 LUFS · pico −1,9 dBTP · LRA 2,5 LU |
| Voz | md5 `54a6b7b9684b8dee63da881aaf9de058` = archivo original (intacta) |
| Determinismo | `hash.js`: fotogramas idénticos entre ejecuciones |

## Lista de verificación del retoque
| Punto | Estado |
|---|---|
| microSD con proporciones correctas (11 × 15 × 1 mm, escalón lateral, 8 contactos) | ✔ modelo 3D nuevo, regla de 15 mm |
| Mano artificial | ✔ eliminada (la microSD se apoya en una base con ranura) |
| Tarjetas apiladas como objetos individuales | ✔ capas con desplazamiento, tono y junta propios + sombra de contacto |
| Perforadora con secuencia mecánica coherente | ✔ tecla → varilla → barra → punzones → matriz → recorte cae → regreso → avance por cremallera |
| Lector: contacto eléctrico | ✔ estado A «SIN CONTACTO» / estado B «CONTACTO DETECTADO», nunca a la vez, sincronizados con «detectaba… / lo convertía en información» |
| La tarjeta no atraviesa rodillos ni superficies | ✔ holguras revisadas (rodillo de arrastre a 0,8 mm de la bancada, tarjeta 0,18 mm) |
| Agujeros en posiciones válidas | ✔ código de tarjeta; = ( ) + con el juego FORTRAN de la IBM 026 |
| FORTRAN coherente | ✔ `READ 5, A, B` (FORTRAN II: lee A y B con el FORMAT 5); el mazo contiene el programa completo (FORMAT, suma, PRINT, STOP, END) |
| Hollerith ≠ lector IBM | ✔ prensa de agujas y mercurio, electroimán, trinquete y dial; tarjeta redonda de otro formato |
| Fotos con atribuciones | ✔ las tres, con crédito en pantalla |
| Títulos duplicados, objetos fantasma, negros | ✔ ninguno (se corrigió la desaparición de la tarjeta al atravesar el agujero) |
| Subtítulos sincronizados, voz intacta, música equilibrada, cierre limpio | ✔ |

Fotogramas de inspección del MP4 en `fotogramas/` (20) y tiras de movimiento en `movimiento/` (14).
