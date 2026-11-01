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

## Revisión V2
### Afirmación del audio sobre el viento (no requiere corrección)
El encargo pedía corregir una frase según la cual el viento de ese día «era el más fuerte que había soportado». La voz real (tramo 3, 9,38–12,41 s, transcripción alineada) dice lo contrario: «Y el viento **ni siquiera** era el más fuerte que había soportado». Es decir, afirma que NO era el más fuerte, lo que coincide con los registros (el puente había soportado vientos más intensos). No se ha sustituido ningún fragmento de voz. En pantalla se mantiene «EL VIENTO NO ERA EXTRAORDINARIO» y «≈ 68 km/h medidos cerca de un extremo», coherente con la sustitución propuesta.

### Fotografías de archivo
- Archivos usados: `01_ENTRADA/referencias/ref_torsion.jpg` (calzada ondulada con una persona; md5 f2422c7b…) y `ref_colapso.jpg` (tramo cayendo al agua; md5 f0999319…), proporcionados por el usuario. Se muestran sin alterar su contenido (solo encuadre dentro del marco, escala y acercamiento lento).
- **Derechos: NO verificados.** Desde esta sesión no se pudo consultar la procedencia (red sin acceso a los archivos históricos). Imágenes de este suceso se atribuyen habitualmente a fondos como University of Washington Libraries (Special Collections), Tacoma Public Library (Northwest Room) o a fotogramas del filme de Barney Elliott; su situación de derechos varía según la copia. Antes de publicar: confirmar el titular y la licencia de cada copia, o sustituirlas por versiones con licencia libre o de dominio público documentado (p. ej. copias con licencia indicada en Wikimedia Commons o con permiso del archivo).

### Otros datos revisados
- Ángulo: «hasta ≈ 28°» se presenta como testimonio de la época (rótulo «según testimonios de la época»), no como medición exacta ni como resultado de la animación.
- Fallos previos: en lugar de «se rompen las primeras péndolas» se rotula «fallas locales: péndolas y conexiones»; se menciona el aflojamiento de una abrazadera del cable en el centro antes del paso a torsión (FWA, 1941).
- El colapso se muestra por tramos (no de una vez) y las torres permanecen en pie.
- Comparación final: sección de 1940 frente a dos enfoques de ejemplo (sección cerrada aerodinámica y celosía profunda como el puente de 1950), rotulados como ejemplos; sin cifras de rendimiento.
