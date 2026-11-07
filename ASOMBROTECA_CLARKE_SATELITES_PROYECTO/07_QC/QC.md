# QC · Ep. 07 · Arthur C. Clarke · V3 (mejorada con la plantilla v1.26)

Archivo: `07_OUTPUT/ASOMBROTECA_CLARKE_SATELITES_FINAL.mp4` (detalle en `qc_tecnico.txt`). Versiones anteriores: `07_OUTPUT/V1/` y `07_OUTPUT/V2/` (QC en `07_QC/V1/` y `07_QC/V2/`).

| Control | Resultado |
|---|---|
| Formato | H.264 1080×1920, 30 fps · AAC 48 kHz estéreo · 88,17 s · 61,1 MB ✔ |
| Decodificación completa | 0 errores ✔ |
| Negros / congelados / silencios | 0 / 0 / 0 ✔ |
| Sonoridad | −13,9 LUFS, pico real −1,7 dBTP ✔ |
| Voz | md5 `de700aaa44dbd0ab47115934891da6bc` = original ✔ |
| Determinismo | dos pasadas, hashes idénticos ✔ |
| Física (`04_CODIGO/comprobaciones.js`) | 17/17 OK (altitud, radio, período sidéreo, v, enlaces visibles, 120°, cobertura y polos, giro) ✔ |

## Lista del SUPERPROMPT (sección 24)
| Punto | Estado y dónde verlo (`frames/`) |
|---|---|
| Tierra sin deformación polar | ✔ nuevo `P.earthHQ` (ruido 3D sobre la esfera, casquetes polares); vista desde el norte en 15, 21, 23 |
| Continentes coherentes, rotación continua | ✔ misma proyección que `orbView`; rot decreciente (oeste→este) |
| Trayectorias orbitales coherentes / GEO explicado | ✔ 11 + `tira_corrotacion.jpg`; dos perspectivas simultáneas en 12 + `tira_dos_perspectivas.jpg` |
| Escala real solo cuando lo es | ✔ «A ESCALA REAL» aparece cuando la órbita mide 6,61 radios (10); el resto «DISTANCIAS ESQUEMÁTICAS» |
| Satélites con mejor diseño y presencia | ✔ `P.satGEO3` (bus 3D, alas con yugo, reflectores); primer plano en 13, plano medio en 17 |
| Variedad de planos | ✔ ecuatorial (1, 9), escala lateral (10), cenital (15, 23), primer plano (13), suelo (8, 12, 16), lateral (14), corte (18), cobertura (21) |
| Clarke refinado | ✔ trabaja sobre el documento; la cámara entra al papel (5) y las líneas del boceto se convierten en la Tierra 3D (6) |
| Revista = recreación editorial | ✔ rotulada; acercamiento al diagrama, posiciones iluminadas → 3 satélites 3D (22, 23) |
| Sputnik correcto | ✔ esfera con 4 antenas, órbita baja inclinada, «12 AÑOS», foto «RÉPLICA» con crédito (24) |
| Enlace ascendente comprensible | ✔ estación de Londres en primer plano → la cámara sube con el haz → antena receptora resaltada (16, 17) |
| Repetidor demuestra su función | ✔ corte esquemático: receptora → filtrado → conversión (6 → 4 GHz, onda más larga) → amplificación (onda mayor) → transmisora (18) |
| Enlace descendente llega a una estación | ✔ Nueva York recibe (vídeo) dentro de la cobertura (19) |
| 3 satélites a 120° y polos limitados | ✔ «120° — 120° — 120°», coberturas a 5° de elevación, círculo de 75° (20, 21) |
| Contribución de Clarke matizada | ✔ esquema anterior (Potočnik, 1929), «no inventó / ni fue el primero», documento → red global, Early Bird 1965 con su modelo cilíndrico y «antes: Syncom» (25, 26) |
| Escena doméstica convincente | ✔ casa contemporánea, antena offset con LNB; la cámara parte de la antena y sube hasta SU satélite (27, 28) |
| Cierre con ASOMBROTECA | ✔ satélite en primer plano → Tierra con 3 satélites, desaceleración suave (29, 30) |
| Textos legibles, sin choques con subtítulos | ✔ rótulos ≥ 32 px (principales 38 px) y por encima de y = 1340 |

## Cambios V3 (recursos de la plantilla v1.26)
- Escala real: contadores HUD (altitud 0 → 35.786 km con sonido de contador, radio terrestre 6.378 km) y etiqueta «A ESCALA REAL · SATÉLITE AMPLIADO».
- Velocidad: cifra grande «≈ 3,07 km/s». Rotación: HUD comparativo ecuador 0,46 km/s frente a satélite 3,07 km/s.
- Enlace ascendente: etiqueta con línea guía hasta la antena receptora.
- Revista: sello «RECREACIÓN» que golpea sobre la recreación editorial.
- Sputnik: ficha documental con la foto real (crédito en pantalla) y sello «RÉPLICA».
- Cierre: «¡Cuéntanos en los comentarios!» con tarjetas de comentarios (avatares ilustrados) bajo la Tierra con los tres satélites.
- Control de calidad generado con `tools/producir.py qc`: todo ✔ (determinista, 0 errores, sin negros/congelados/silencios).
