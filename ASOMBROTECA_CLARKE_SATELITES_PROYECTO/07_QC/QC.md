# QC · Ep. 07 · Arthur C. Clarke y los satélites de comunicación

Archivo: `07_OUTPUT/ASOMBROTECA_07_CLARKE_SATELITES_FINAL.mp4` (detalle en `qc_tecnico.txt`)

| Control | Resultado |
|---|---|
| Formato | H.264 1080×1920, 30 fps, 2645 fotogramas · AAC 48 kHz estéreo · 88,17 s · 59,1 MB (< 100 MB) ✔ |
| Decodificación completa | 0 errores ✔ |
| Negros (d 0,3 s) / congelados (1,5 s) / silencios (−50 dB, 1 s) | 0 / 0 / 0 ✔ |
| Sonoridad | −13,9 LUFS integrados, pico real −1,8 dBTP ✔ |
| Voz | md5 `de700aaa44dbd0ab47115934891da6bc` idéntico al original; sin alterar ✔ |
| Determinismo | dos renders de prueba con hashes idénticos ✔ |
| Física (`04_CODIGO/comprobaciones.js`) | 14/14 OK: altitud 35 786 km, v 3,07 km/s, visibilidad de enlaces, 120°, cobertura 76,3° (polos fuera), giro oeste→este ✔ |
| Subtítulos | `capStyle 'barra'`, `capY 1540`; rótulos ≥ 32 px y por encima de y = 1420 ✔ |
| Marca | solo «ASOMBROTECA» discreto al final ✔ |

## Lista de verificación del SUPERPROMPT
| # | Punto | Dónde (fotograma en `frames/`) |
|---|---|---|
| 1 | Gancho en el espacio, «¡LO IMAGINÓ EN 1945!», 12 años antes | 01 |
| 2 | Señales de TV desde el espacio (televisor apoyado en su mueble) | 02 |
| 3 | Despacho de 1945 + figura de Clarke; foto rotulada «FOTOGRAFÍA DE 1965» con crédito | 03 |
| 4 | Boceto 120° que se dibuja («¿CIENCIA FICCIÓN?», recreación) | 04 |
| 5 | Estación repetidora conceptual enlazando Londres y Ciudad del Cabo, rotulada como ilustrativa | 05 |
| 6 | Problema de seguimiento LEO: la antena sigue al satélite y se pierde la señal | 06 |
| 7 | Altitud a escala real medida desde la superficie (≈ 36 000 km / 35 786 km) | 08 |
| 8 | GEO: la Tierra gira y el satélite RECORRE su órbita con su punto del ecuador debajo (tiempo acelerado) | 09, `tira_corrotacion.jpg` |
| 9 | Vista desde la superficie: día/noche, satélite fijo, antena inmóvil | 10 |
| 10 | Misma velocidad angular, no lineal (3,07 vs 0,46 km/s) | 12, 13 |
| 11 | Enlace ascendente / repetidor / descendente; ambas estaciones dentro de la cobertura; ningún haz atraviesa la Tierra | 14, 15, `tira_enlace.jpg` |
| 12 | 3 satélites a 120°, coberturas curvas, polos fuera (círculo de 75°) | 16 |
| 13 | Revista recreada, rotulada «RECREACIÓN EDITORIAL · NO ES LA PÁGINA ORIGINAL» | 17 |
| 14 | Sputnik 1957: órbita baja inclinada, no GEO ni repetidor de TV; foto «RÉPLICA · FOTO NASA» con crédito | 18 |
| 15 | Matiz: no inventó los satélites ni fue el primero (Noordung, 1929) | 19 |
| 16 | Legado: red global + Intelsat I «Early Bird» (1965) | 20 |
| 17 | Antena parabólica en un tejado apuntando fija al satélite; cierre con 3 satélites y ASOMBROTECA | 21, 22 |

Hoja de contacto del MP4: `hoja_contacto.jpg`. Los fundidos entre escenas aparecen a veces en la hoja (fotograma tomado en plena transición), no son negros prolongados (blackdetect = 0).
Retrocompatibilidad: la v1.25 solo añade bloques y FX (comprobado: ningún nombre repetido en `plantilla.js`, sintaxis correcta); no cambia ningún bloque existente.
