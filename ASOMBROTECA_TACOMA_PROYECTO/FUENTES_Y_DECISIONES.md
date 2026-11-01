# Fuentes y decisiones · «El puente que se destruyó por el viento · Tacoma Narrows, 1940»

Nota: desde esta sesión no fue posible abrir en línea las páginas indicadas (wsdot.wa.gov y aps.org quedan fuera de los dominios permitidos de la red). Los datos proceden de la documentación publicada y ampliamente citada que se lista; conviene contrastarlos con esas páginas si se desea una verificación en línea.

## Hechos
| Dato | Valor usado | Fuente |
|---|---|---|
| Inauguración | 1 de julio de 1940 | WSDOT, *Tacoma Narrows Bridge history*; ASCE, *Tacoma Narrows Bridges* (Historic Civil Engineering Landmark) |
| Colapso | 7 de noviembre de 1940, ~11:00 | WSDOT; Federal Works Agency, *The Failure of the Tacoma Narrows Bridge* (Ammann, von Kármán, Woodruff, 1941) |
| Vano central / vanos laterales | 2.800 ft ≈ 853 m / 1.100 ft ≈ 335 m | WSDOT; ASCE |
| Ancho del tablero | 39 ft ≈ 11,9 m (dos carriles) | WSDOT |
| Vigas laterales de alma llena | 8 ft ≈ 2,4 m de canto | WSDOT; FWA (1941) |
| Torres | dos torres de acero de ~425 ft sobre el agua | WSDOT |
| Viento el día del colapso | ~42 mph ≈ 68 km/h, medido cerca de un extremo | WSDOT; FWA (1941) |
| Oscilaciones previas | ondulaciones verticales desde la construcción («Galloping Gertie») | WSDOT; APS News (nov. 2016) |
| Paso a torsión | hacia las 10:00 el movimiento pasó a torsión con un nodo en el centro del vano (las dos mitades giraban en sentidos opuestos), tras deslizar una abrazadera del cable en el centro | WSDOT; FWA (1941); Billah & Scanlan, *Am. J. Phys.* 59 (1991) 118 |
| Amplitud de torsión | inclinación del tablero de hasta ~28° | WSDOT |
| Colapso progresivo | primero cayó un tramo central (~600 ft); después cayeron otras partes del vano central; las torres quedaron en pie y los vanos laterales se hundieron | WSDOT; ASCE |
| Mecanismo | inestabilidad aeroelástica (flutter torsional autoexcitado), no resonancia forzada clásica por ráfagas periódicas | Billah & Scanlan (1991); APS News (2016) |
| Lección | los ensayos aerodinámicos (túnel de viento, modelos seccionales) pasaron a ser decisivos; el puente de 1950 usó una viga de celosía profunda y mayor rigidez torsional | ASCE; WSDOT |

## Decisiones
- **Un solo puente maestro** (`P.tacBridge`, plantilla v1.17) con las proporciones de 1940; las secciones técnicas (`P.tacSection`) derivan del mismo tablero (vigas laterales de alma llena + losa).
- **Modos**: vertical (6 semiondas, amplitud visual ×6 aprox., rotulada «deformación amplificada») y torsión con un nodo en el centro (~0,2 Hz) hasta ~0,48 rad (~28°, magnitud de los registros, sin amplificar en las escenas históricas).
- **Mecanismo**: flujo didáctico (no CFD): líneas de corriente que rodean la sección, separación tras las vigas, remolinos que recorren el tablero y momento aerodinámico en el mismo sentido que la velocidad de giro (amortiguamiento aerodinámico negativo); la barra de energía es cualitativa.
- **Colapso**: fallos locales (péndolas) → tramo central de ~183 m → tramos adyacentes en orden; caída con gravedad e inercia; torres en pie; sin explosiones ni olas exageradas. La secuencia exacta de cada tramo es una reconstrucción plausible, no una réplica fotograma a fotograma del filme.
- **Túnel de viento**: comparación conceptual entre el tablero de 1940 (oscila cada vez más) y un tablero aerodinámico de ejemplo (estable); no se afirma que todos los puentes modernos usen ese diseño.
- **Mapa**: estilizado (no cartografía de precisión).
- Música y efectos originales sintetizados; paleta del SUPERPROMPT.
