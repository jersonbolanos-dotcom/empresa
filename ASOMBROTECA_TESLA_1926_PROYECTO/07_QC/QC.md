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
