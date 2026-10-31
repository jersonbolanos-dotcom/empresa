# Fuentes y decisiones · Helicóptero sin motor (autorrotación)

## Fuentes técnicas (del kit, `02_REFERENCIA_KIT/06_REFERENCIAS/VERIFICACION_FAA.md`)

- FAA, *Helicopter Flying Handbook*:
  - Cap. 2, rueda libre (*freewheeling unit*): https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch02.pdf
  - Cap. 11, descenso autorrotativo, energía del rotor y flare: https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch11.pdf
- AOPA, técnica de autorrotación: https://www.aopa.org/news-and-media/all-news/2021/january/flight-training-magazine/technique-autorotations

La red de este entorno no permite abrir esos PDF. Los hechos representados son los del documento de verificación del kit y coinciden con la explicación estándar de la autorrotación.

## Cómo se representa la física (sin cambiar la voz)

| Locución | Representación visual |
|---|---|
| «sin que su motor impulse las hélices» | Rueda libre: el aro exterior (lado del rotor) gira y el cubo interior (lado del motor) queda quieto. «MOTOR ≠ ROTOR» |
| «reducir la inclinación de las palas» | Rótulo **BAJAR EL PASO COLECTIVO**, con un perfil de pala cuyo ángulo de paso baja y la palanca del colectivo descendiendo. Nota: «menor ángulo en todas las palas a la vez» (no es inclinar el helicóptero) |
| «seguir volando» | Trayectoria de **descenso controlado**, nunca vuelo nivelado |
| «el aire atraviesa el rotor desde abajo» | **FLUJO RELATIVO DEL AIRE**, con la aclaración «el helicóptero baja, así que el aire lo atraviesa de abajo hacia arriba» (no es una corriente externa) |
| «la energía de su propio descenso» | ALTURA → AIRE QUE ATRAVIESA EL ROTOR → GIRO DEL ROTOR, con «no se crea energía: se transforma» |
| «amortiguar el aterrizaje» | FLARE (morro arriba; la flecha de velocidad de caída se acorta) y «recreación conceptual · no es garantía» |
| «no siempre funciona» | ALTURA / VELOCIDAD / REACCIÓN DEL PILOTO |
| Cierre | El rotor se detiene poco a poco **después** de tocar tierra; «SIN MOTOR ≠ SIN CONTROL», con «puede ser posible · no está garantizado» |

- No aparece ninguna cifra de altura, velocidad, RPM ni ángulo. Los indicadores MOTOR y ROTOR son cualitativos.
- El rotor no se detiene nunca en vuelo. Al fallar el motor sus RPM bajan; se recuperan al bajar el colectivo; suben un instante en el flare y se consumen al amortiguar.

## Decisiones técnicas

- **Voz.** Intacta: el SHA-256 coincide con el archivo subido. La transcripción alineada es idéntica palabra por palabra al guion aprobado (comprobación automática: True). Se añade 1 s de cola en silencio.
- **Alineación.** Por pausas y sílabas, sin reconocimiento de voz: 18 tramos que coinciden 1:1 con las frases del guion.
- **Estilo.** Se usa la referencia adaptada del kit. El `flat-space.js` original **no venía** en el paquete, así que no se afirma haberlo usado. Las funciones `glow`, `crescent`, `ball`, `rr`, `label→pill`, `bez`, `arrow` y `finish` se conservan. Cambios:
  - `sky` se adaptó a formato vertical, con partículas atmosféricas en lugar de estrellas.
  - El helicóptero se reconstruyó: dos palas en perspectiva, desenfoque de giro, rotor de cola y morro inclinable.
  - Elementos nuevos: rotor visto desde arriba, perfil de pala, tren de potencia y rueda libre.
- **Sonido.**
  - El kit SOUND no se modificó.
  - El rotor se sintetiza con pulsos de paso de pala cuya cadencia sigue la velocidad del rotor.
  - La turbina se apaga en la falla, sin explosión.
  - La música original va en un stem aparte (`voiceover:false`).
- **Marca.** Solo «ASOMBROTECA», discreto, al final. Sin logo.

## Mejoras añadidas al prompt

1. **Indicadores continuos MOTOR / ROTOR**, sin números. Muestran a lo largo de toda la película la idea central: el motor cae a cero y el rotor sigue en la franja verde.
2. **Regla de ALTURA** que baja durante el descenso y desaparece al aterrizar.
3. **Palanca del colectivo** junto al perfil de pala, para enlazar la acción del piloto con el efecto en las palas.
4. **«No se crea energía: se transforma»** en la cadena de energía, para evitar la idea de energía mágica.
5. **Transiciones propias del estilo:**
   - inmersión con apertura circular dentro del capó;
   - match-cut del aro de la rueda libre al disco del rotor;
   - barrido de una pala que cruza la cámara;
   - zoom de salida desde el rotor.
6. **Sonido de rotor coherente con la física:** se ralentiza al fallar el motor, se recupera al bajar el colectivo, sube en el flare y se apaga poco a poco en tierra.
7. **Silencio musical tenso** justo después de la falla; la música vuelve con «No necesariamente».
