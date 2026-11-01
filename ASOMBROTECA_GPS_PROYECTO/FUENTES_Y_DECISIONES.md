# Fuentes y decisiones · GPS: ¿cómo sabe tu celular dónde estás?

## Audio
- **Narración original:** `01_ENTRADA/audio/voz_original_gps.mp3`, 95,948 s. No se alteró.
- **Transcripción:** Whisper-small local. No había guion escrito, así que el audio es la referencia. Se corrigió «Sombro Teca» → «Asombroteca», se completó «¿Dónde está el satél…» → «dónde está el satélite», y las cifras se escribieron con su forma hablada (20.000, 10, 4). Hay 28 tramos en `03_GUION/tramos.txt`.

## Cifras mostradas en pantalla (verificadas)

| Dato | Valor | Fuente |
|---|---|---|
| Altitud de los satélites GPS | ≈ 20.200 km (la voz dice «más de 20.000») | [iaps.info, *Implications of Relativistic Effects on GPS*](https://iaps.info/2023/03/01/article-of-the-month-march-2023/); [MakeTechEasier](https://maketecheasier.com/gps-clock-relativity-correction/) |
| Lo que transmite cada satélite | Su posición (efemérides) y la hora exacta de envío; lleva relojes atómicos | [Inflibnet, *GPS Error and Biases*](https://ebooks.inflibnet.ac.in/geop10/chapter/gps-error-and-biases/); [UN-GGIM, curso S06](https://mdgs.un.org/unsd/geoinfo/UNGEGN/docs/_data_ICAcourses/_pdf/selfstudy/s06/S06_05b.pdf) |
| Tiempo de viaje de la señal | ≈ 0,07 s (20.200 km ÷ 299.792 km/s ≈ 0,067 s, con el satélite justo encima) | Cálculo directo |
| Velocidad de la luz | ≈ 300.000 km/s | Constante física (299.792 km/s) |
| Mínimo de satélites | 4: tres para la posición y uno más para el error del reloj del receptor | [UN-GGIM](https://mdgs.un.org/unsd/geoinfo/UNGEGN/docs/_data_ICAcourses/_pdf/selfstudy/s06/S06_05b.pdf); [*American Practical Navigator*, cap. 11](https://kwx.liehendr.com/content/wikisource_en_all_maxi_2022-09/A/The_American_Practical_Navigator/Chapter_11) |
| 1 microsegundo de error | ≈ 300 m | [Inflibnet](https://ebooks.inflibnet.ac.in/geop10/chapter/gps-error-and-biases/) |
| Relatividad | +45 µs/día (menos gravedad) − 7 µs/día (velocidad) ≈ +38 µs/día: el reloj del satélite adelanta | [iaps.info](https://iaps.info/?p=9486); [MakeTechEasier](https://maketecheasier.com/mte-gps-satellites-tick-about-38-microseconds-a-day-faster-than-clocks-on-earth-a-relativistic-drift-einstein-predicted-and-one-the-system-corrects-every-orbit-or-your-location-would-drift-10-kilometr/) |
| Error sin corregir | más de 10 km por día | [iaps.info](https://iaps.info/2023/03/01/article-of-the-month-march-2023/) |

**Decisiones:**
- No se muestra un número exacto de satélites: la voz dice «decenas» y el número operativo varía.
- La escena de la constelación lleva el rótulo «ESCALA NO REAL».
- Los relojes de la escena de relatividad exageran la diferencia para que se vea, y lo dicen en pantalla.
- La analogía de las casas solo lleva la cifra que dice la voz (10 km). Las otras tres distancias no tienen número.

## Mejoras añadidas a la plantilla (v1.5)
Se añadieron los bloques `phone`, `mapCity`, `pin`, `dot`, `rangeCircle`, `globe`, `satellite`, `rings` y `clock`, y los FX `senal`, `datos`, `tictac` y `ubicacion`. Están en `PLANTILLA_ASOMBROTECA/CAMBIOS_PLANTILLA.md`, en `INSTRUCCIONES_PLANTILLA.md` y en el catálogo.
