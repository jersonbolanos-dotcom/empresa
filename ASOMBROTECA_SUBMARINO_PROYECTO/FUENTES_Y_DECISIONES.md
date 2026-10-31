# Fuentes y decisiones · El submarino que no volvió

## 1. El audio manda (diferencia con el kit)
El kit traía `GUION_PROPUESTO_SUBMARINO.txt`, un guion genérico de unos 45 s sobre cómo se sumerge un submarino. La voz recibida dura **72,281 s** y cuenta otra historia: los tanques de lastre y el hundimiento del **USS Thresher (1963)**. Como el propio kit indica, el audio es la autoridad:
- Transcribí la voz con Whisper-small (sherpa-onnx, local) y corregí a mano dos errores del reconocimiento: «tanques del astre» pasa a «tanques de lastre», y «A SOMBROTE» pasa a «Asombroteca.». El resultado está en `03_GUION/TRANSCRIPCION_DEL_AUDIO.txt`; la salida cruda, en `transcripcion_whisper_cruda.json`.
- Los subtítulos reproducen lo que se oye, no el guion propuesto. No toqué la voz.

## 2. Datos que aparecen en pantalla (verificados)
| Dato | Fuente |
|---|---|
| USS Thresher (SSN-593), submarino nuclear de EE. UU. | GlobalSecurity — https://www.globalsecurity.org/military/agency/navy/ssn-593.htm |
| Hundido el 10 de abril de 1963 durante pruebas de inmersión profunda en el Atlántico | USNI Naval History, «Inside the Thresher Disaster» (2002) — https://www.usni.org/magazines/naval-history-magazine/2002/april/inside-thresher-disaster ; EBSCO Research Starters — https://www.ebsco.com/research-starters/history/thresher-disaster/ |
| 129 personas a bordo | Las mismas fuentes; también Baird Maritime (publicación de los registros de la Marina) — https://www.bairdmaritime.com/amp/story/commercial-mariner/maritime-security/us-department-of-the-navy-releases-records-related-to-loss-of-submarine-uss-thresher |
| Según la investigación de la Marina, la causa más probable fue una fuga en una tubería o soldadura cerca de la sala de máquinas; después se perdió la propulsión y el soplado de emergencia del lastre no consiguió expulsar suficiente agua | USNI Proceedings 2023, «Was Thresher Ready for Sea?» — https://m.usni.org/magazines/proceedings/2023/april/was-thresher-ready-sea ; Interesting Engineering (documentos desclasificados) — https://interestingengineering.com/new-declassified-documents-reveal-the-truth-behind-the-uss-thresher-sinking |
| Tras el Thresher, la Marina creó el programa de seguridad SUBSAFE | GlobalSecurity; EBSCO |

## 3. Decisiones de rigor
- **No se inventan cifras.** No aparecen profundidades, presiones ni tiempos, porque las fuentes no coinciden en esos valores. La cota dice «CIENTOS DE METROS», como la voz.
- **«Posible».** El diagrama se titula POSIBLE CADENA DE FALLOS, y el primer bloque dice «investigación: probable fuga en tubería». Así se respeta la incertidumbre de la narración. Dejé fuera la hipótesis del hielo en el sistema de aire porque está poco corroborada.
- **Física de los tanques** (siguiendo las notas del kit):
  - Los tanques están fuera del casco resistente.
  - Para sumergirse se abre la VENTILACIÓN: el aire sale por arriba y el agua entra por abajo.
  - Para subir, el AIRE COMPRIMIDO desplaza el agua hacia fuera; el soplado no es propulsión.
  - Nunca entra agua en el casco resistente.
  - PESO y EMPUJE se comparan con flechas.
- **Respeto.** El colapso se muestra como una fractura técnica en rojo («LÍMITE DEL CASCO»), sin explosión ni dramatización. En «129 personas…» la música se retira y suenan solo el plotter, muy bajo, y una campana grave. El plotter traza 129 marcas, una por persona.
- **Sin logos.** Solo la palabra ASOMBROTECA en el cajetín de la lámina.

## 4. Mejoras que añadí al prompt
1. **Narrativa de lámina única.** Todo el episodio ocurre en una sola hoja de plano vertical de 2160×6760 px. La cámara recorre secciones unidas por «leaders», como «VER SECCIÓN B-B», en lugar de cortar entre diapositivas. Al final se aleja para mostrar toda la lámina y se posa en el cajetín, el bloque de título del plano: ASOMBROTECA · DWG NO. SUB-1963.
2. **Corrección en rojo.** Uso el rojo #FF806E (la «advertencia» del kit) como marcado de revisión, una práctica real en los planos: FALLA, NO RESPONDE, X sobre la línea de aire, fractura del casco.
3. **Estilo original adaptado, no imitado.** Reutilicé el motor reconstruido del PDF: lámina moteada, retícula, exposición irregular, sangrado, pliegues con fibras, cabezal del plotter, `H.grain` y `H.vignette` a la misma intensidad. `H` y `SOUND` están sin modificar.
4. **Sonido del plotter automático.** Cada trazo temporizado suena como un movimiento del plotter (penDown, motor, letter del `explainerSound` original), así que la imagen y el sonido no se desincronizan.
5. **Efectos donde la historia los necesita:**
   - sonar al principio, al presentar el Thresher y en la lección;
   - alarma corta en «falla»;
   - clunk de válvulas, agua que entra, burbujas;
   - siseo de aire comprimido y agua expulsada;
   - relés en la cadena de fallos;
   - retumbo de presión con crujidos del casco y golpe sordo final;
   - silencio en «129»;
   - ding en el cierre.
6. **Música original en un stem aparte**, en re menor contenido. Se retira en «129» y vuelve abierta para la lección.
7. **El lema final** sube de posición para no pisar el cajetín.

## 5. Lo que no se cubrió
La narración no menciona los planos de inmersión, así que no se rotulan: añadirlos sería explicar algo que la voz no dice.
