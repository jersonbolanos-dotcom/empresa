# QC · ASOMBROTECA_TESLA_1926_FINAL.mp4

| Comprobación | Resultado |
|---|---|
| Contenedor / códecs | MP4 · H.264 High 4.1 · yuv420p · 1080×1920 · 30 fps · AAC-LC 48 kHz estéreo 192 kb/s · faststart |
| Duración | 85,506 s (voz 84,506 s + 1 s de cierre) · 2565 fotogramas |
| Tamaño | 74,1 MB (< 100 MB) · 6,9 Mb/s |
| Decodificación completa | 0 errores |
| blackdetect (d 0,3 · pix_th 0,06) | 0 tramos negros |
| freezedetect (n 0,001 · d 2,5) | 0 congelados |
| silencedetect (−45 dB · 1,5 s) | 0 silencios |
| Sonoridad (EBU R128) | −14,1 LUFS integrados · LRA 2,5 LU · pico −1,2 dBTP |
| md5 de la voz | f9f2d195eb6ce94f93d2e5ea140c6712 = archivo subido (Nikola_Tesla_.mp3): intacta |
| Determinismo | t = 5,3 · 17,9 · 41 s: mismo md5 en orden directo e inverso |
| Retrocompatibilidad v1.18 | Cambio solo aditivo en plantilla.js (0 líneas borradas); sin nombres duplicados nuevos; hashes de GPS, Internet submarino y Tacoma iguales con v1.17.1 y v1.18 (ver abajo) |
| Subtítulos | 48 bloques · barra amarilla · capY 1540 · «1926», «cien», «Asombroteca» correctos |
| Notas y rótulos | Todos ≥ 32 px y fuera de la franja de subtítulos (y < 1420) |

## Revisión visual
- `hoja_contacto_mp4.jpg`: 22 fotogramas del MP4 final, uno por escena (`fotogramas/`).
- Secuencias de movimiento (5 fps, 2,4 s):
  - `movimiento_t29.5.jpg`: los cables se convierten en señal.
  - `movimiento_t46.4.jpg`: del bolsillo al smartphone; la gradación pasa de sepia a azul.
  - `movimiento_t52.5.jpg`: vista de corte del teléfono.
  - `movimiento_t58.5.jpg`: recorrido de los datos por la red.

## Corregido durante el QC
1. **Tamaño.** La primera codificación pesaba 329 MB porque el grano de película cambiaba en cada fotograma.
   - Se suavizó el grano de `P.eraGrade`: celda de 512 px, 12 cambios/s, opacidad 0,06.
   - Se codificó con `-maxrate 8.5M`.
   - Resultado: 74 MB.
2. **Destello sepia y aparato duplicado.** Había un destello sepia de un fotograma al entrar en «Una idea adelantada a su época», y el aparato conceptual se veía duplicado detrás del smartphone durante la transformación. Ambos corregidos y verificados en `movimiento_t46.4.jpg`.
3. **Nombres repetidos.** Varios bloques nuevos repetían nombres existentes (`P.phone`, `P.person`, `FX.senal`, `FX.datos`, `FX.tiempo`), lo que rompía los episodios GPS e Internet submarino. Se renombraron a:
   - `P.smartphone`, `P.persona`;
   - `FX.senalRadio`, `FX.flujoDatos`, `FX.saltoTiempo`.

   El render de Tesla dio el mismo md5 de fotogramas antes y después del cambio. Las pistas de audio difieren solo en ~1e-8, que es redondeo de coma flotante.

## Corrección V2 (2026-11-02): la mano que sostiene el teléfono
Pedido: «arregla la mano… que se mire natural… parece que la mano se transporta». Solo se cambió eso.
- **Dibujo (`P.handHold`, plantilla v1.18.1).** Agarre real:
  - la palma va detrás del teléfono y el talón asoma bajo el borde inferior;
  - los cuatro dedos rodean el borde izquierdo, con las yemas y las uñas apoyadas en el frente;
  - el pulgar se apoya en la pantalla con sombra de contacto;
  - la muñeca y el antebrazo están unidos a la palma.
- **Movimiento:**
  - la mano ya no aparece con fundidos semitransparentes ni salta de sitio;
  - sube opaca desde abajo («celulares», cierre) y se desliza de forma continua hasta la vista de corte;
  - entra con barrido en «Datos → imagen + sonido» y dentro de la tarjeta «HOY»;
  - las miniaturas con mano aparecen con escala.
- **Audio.** Los efectos automáticos de transición cambian con las nuevas entradas (barrido en vez de sonido de fundido), así que se regeneró `efectos_sonido.wav` y se rehízo la mezcla con los mismos ajustes. Voz y música sin cambios.
- **Respaldo de la versión anterior:**
  - `07_OUTPUT/V1/`;
  - `07_QC/V1/` (hoja de contacto y `handHold` anterior);
  - `05_AUDIO/V1/`;
  - `04_CODIGO/V1/episodio.js`.
- **QC V2:**
  - 74,0 MB, 85,506 s, 2565 fotogramas;
  - 0 errores de decodificación, 0 tramos negros, 0 congelados, 0 silencios;
  - −14,1 LUFS, pico −1,2 dBTP;
  - md5 de la voz sin cambios;
  - determinismo comprobado (mismo md5 en orden directo e inverso).
- **Revisión visual:**
  - `mano_escenas.jpg`: todas las escenas con mano;
  - `movimiento_mano_t50.6.jpg`: la mano sube con el teléfono;
  - `movimiento_mano_t51.9.jpg`: deslizamiento continuo a la vista de corte;
  - `movimiento_mano_t79.1.jpg`: cierre.
