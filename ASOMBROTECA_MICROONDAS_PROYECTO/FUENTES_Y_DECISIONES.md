# Fuentes y decisiones · ¿Cómo funciona un microondas?

## Audio y guion
- **Voz original:** `01_ENTRADA/audio/voz_original_microondas.mp3`, 82,913 s, mono 44,1 kHz. No se alteró.
- **Transcripción:** Whisper-small local. Coincide con el guion de referencia. La única diferencia fue que Whisper escribió «Magnetron» y se corrigió a «magnetrón».
- **Tramos:** el guion se dividió en los 21 tramos de voz reales (`03_GUION/tramos.txt`). La narración no dice «Asombroteca», así que la marca aparece solo como texto discreto al final, sin pantalla final.

## Ciencia representada (verificada)

| Tema | Lo que se muestra | Fuente |
|---|---|---|
| Magnetrón | Tubo de electrones que convierte la energía eléctrica en microondas. Recibe alimentación de alto voltaje y emite por una antena hacia la guía de ondas. | FDA, actualización al consumidor (archivo 2008): [enlace](https://webarchive.library.unt.edu/eot2008/20080923231839/http:/www.fda.gov/consumer/updates/microwave112107.html) |
| Paredes metálicas | Reflejan las microondas. La interferencia forma un patrón estacionario con zonas fuertes y débiles. | FDA (arriba); patente US 6462320 sobre calentamiento dieléctrico: [enlace](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/6462320) |
| Calentamiento dieléctrico | El campo eléctrico alterno actúa sobre moléculas polares, sobre todo el agua, y la energía se disipa en el material como calor. Las moléculas se dibujan con desfases y desorden propios: no giran al unísono. Se evita presentarlo como «fricción» mecánica simple. | Springer, *Food and Bioprocess Technology*, s11947-008-0136-0: [enlace](https://springerlink.bibliotecabuap.elogim.com/doi/10.1007/s11947-008-0136-0); Nature Index, calentamiento por microondas en alimentos: [enlace](https://www.nature.com/nature-index/topics/l4/microwave-heating-techniques-in-food-processing) |
| Mito de «adentro hacia afuera» | Es falso: el microondas no cocina desde el centro. | FDA (arriba); Sage, enciclopedia *Green Health*: [enlace](https://sk.sagepub.com/ency/edvol/embed/greenhealth/chpt/microwave-ovens) |
| Profundidad de penetración | Limitada y **dependiente del alimento**. Sin cifra en pantalla, porque las fuentes dan valores distintos según la temperatura y el material. El calor se redistribuye por conducción. | Springer / Nature Index (arriba) |
| Plato giratorio | Mueve la comida por las zonas fijas del campo y promedia el calentamiento. Más uniforme, **no perfecto**: la simulación mantiene la diferencia entre el centro y el borde. | Patentes de platos giratorios US 4330696: [enlace](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4330696) y US 4886948: [enlace](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4886948) |
| Malla de la puerta | Los agujeros, de pocos milímetros, son mucho más pequeños que la onda: las microondas se reflejan y la luz visible pasa. La «onda de unos 12 cm» sale de λ = c/f con f = 2,45 GHz, la frecuencia doméstica habitual (≈ 12,2 cm). | Cálculo directo; frecuencia doméstica 2,45 GHz según las fuentes anteriores |

## Decisiones visuales
- **Colores que no se mezclan:**
  - **cian / azul** = campo electromagnético (visualización);
  - **rampa azul → amarillo → naranja → rojo** = temperatura.

  Cada escena lo rotula.
- **Ondas:** se dibujan como cintas sinusoidales, nunca como rayos láser ni partículas. El rótulo «VISUALIZACIÓN CIENTÍFICA · NO VISIBLE A SIMPLE VISTA» aparece en todas las escenas de ondas o moléculas.
- **Penetración:** no se impone un patrón universal de superficie → centro. La absorción decae con la profundidad pero es irregular, hay algo de absorción interior y luego conducción. La zona más fría y la más caliente se detectan sobre el propio mapa simulado.
- **Sin cifras inventadas:** el termómetro y el medidor de uniformidad son cualitativos. La única cifra en pantalla, unos 12 cm, es física verificable.
- **Cámara continua en tres escalas:** cocina → corte técnico → cavidad → molécula, con zoom hacia el alimento. Después vienen el corte del alimento (iris), la vista cenital del plato (zoom) y la macro de la malla (barrido). Termina con un regreso continuo a la cocina.

## Mejoras añadidas a la plantilla (v1.2)
- Subtítulos «barra», el estándar Asombroteca que pedía el prompt.
- Cámara 2.5D.
- Bloques `glow`, `heat`, `wave` (con modo para fondos claros) y `water`.
- Efectos `pitido`, `zumbido`, `motor`, `campo`, `escala`, `revelar`, `puerta` y `fin`.
- Ducking de la música por sidechain.
- Generador del catálogo.

Todo está anotado en `PLANTILLA_ASOMBROTECA/CAMBIOS_PLANTILLA.md`.
