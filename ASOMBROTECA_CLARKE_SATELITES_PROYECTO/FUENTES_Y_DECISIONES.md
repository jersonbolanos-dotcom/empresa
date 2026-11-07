# Fuentes y decisiones · Ep. 07 · Arthur C. Clarke y la órbita geoestacionaria

## Datos verificados
| Dato en el vídeo | Fuente |
|---|---|
| Artículo «Extra-Terrestrial Relays: Can Rocket Stations Give World-wide Radio Coverage?», *Wireless World*, octubre de 1945; ~36 000 km; tres estaciones a 120° | IEEE ComSoc, https://www.comsoc.org/node/19071 · texto reproducido en https://lakdiva.org.lk/clarke/1945ww/ |
| Clarke proponía estaciones (tripuladas) en órbitas de 24 h; Sputnik 1 fue lanzado en 1957 | NASA, https://www.nasa.gov/history/communications-satellites/ |
| «Órbita de Clarke»; Intelsat I «Early Bird» (1965), primer satélite comercial geoestacionario; tres satélites equiespaciados cubren casi todas las zonas habitadas, los polos (≳ 75°) quedan fuera | IEEE TechNav, https://technav.ieee.org/topic/geostationary-satellites/ |
| Early Bird lanzado el 6-4-1965; radio ≈ 42 164 km, altitud ≈ 35 786 km | https://lakdiva.org.lk/clarke/ |
| Clarke no fue el primero en imaginar la órbita: su propio artículo cita a Hermann Noordung (Herman Potočnik), libro de 1929 | Reproducción del artículo en NASA NTRS (referencias del artículo) |
| Altitud 35 786 km, radio 42 164 km, v ≈ 3,07 km/s, ecuador ≈ 0,46 km/s, día sidéreo 23 h 56 min, horizonte 81,3°, cobertura útil (5°) 76,3° | Cálculo propio con GM = 398 600,44 km³/s² y T = 86 164 s → `04_CODIGO/comprobaciones.js` (todas OK) |
| Sputnik 1: órbita baja (~96 min por vuelta, inclinación ~65°), solo emitía señales de radio | NASA (histórico Sputnik); se dibuja esquemática |

## Decisiones
- **GEO nunca quieto en el espacio:** el satélite tiene longitud fija y la Tierra gira de oeste a este (`rot` decreciente); en vista externa recorre su órbita a la vez que gira la Tierra, con la marca de su punto del ecuador debajo (escena 8). En vista desde el suelo aparece fijo (escena 9).
- **Escala:** escena 7 a escala real (r = 74 px, órbita 6,61 radios, cota medida desde la superficie). El resto usa k = 2,15 y se rotula «DISTANCIAS ESQUEMÁTICAS». Las coberturas usan la altura REAL (horizonte con elevación mínima de 5°).
- **Enlaces:** solo se dibujan si la estación ve el satélite sobre su horizonte (`sees()`); Londres y Nueva York están dentro de la cobertura del satélite de 30° O (elevaciones 24,8° y 25,2°).
- **Estación de 1945:** ilustración conceptual (no es un diseño de Clarke), distinta del satélite moderno. El ejemplo LEO de la escena 5 se rotula «EJEMPLO».
- **Fotos:** Clarke rotulada «FOTOGRAFÍA DE 1965»; Sputnik rotulado «RÉPLICA · FOTO NASA». La revista es una **recreación editorial**, rotulada así; no se usa la página original (derechos no revisados).
- No se menciona la fecha de Syncom 3 (no se encontró explícita en las fuentes consultadas).
