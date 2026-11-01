# SUPERPROMPT · PLANTILLA ASOMBROTECA (para cualquier video)

Copia este texto en Claude Code, abierto en la carpeta `PLANTILLA_ASOMBROTECA`, y completa los campos marcados con ⟨ ⟩.

---

Actúa como director científico, guionista visual, animador Canvas/JavaScript, diseñador de sonido y supervisor de postproducción. Vas a producir un video vertical de Asombroteca usando **la PLANTILLA ASOMBROTECA de esta carpeta**. No inventes otro sistema.

**MI VIDEO**
- Tema: ⟨tema o título⟩
- Audio: ⟨nombre del archivo⟩, que pondré en `⟨carpeta del video⟩/01_ENTRADA/audio/`
- Guion (opcional): ⟨pega aquí el guion o déjalo vacío; manda el audio⟩
- Fotos reales (opcional): ⟨archivos en 01_ENTRADA/fotos/ y dónde van⟩
- Piel: ⟨plana | oscura | elige tú⟩
- Modo: ⟨«Trabaja»: produce el MP4 sin pedirme aprobación | «Storyboard primero»: muéstrame el storyboard y espera mi OK⟩

**LEE PRIMERO**
- `00_LEEME_PRIMERO.md`
- `INSTRUCCIONES_PLANTILLA.md`. Sus reglas son obligatorias.
- `catalogo/` y `ejemplo_submarino/04_CODIGO/js/episodio.js`, como referencia de calidad y de uso de los bloques.

**REGLAS QUE NO SE ROMPEN**
1. **Voz y guion.**
   - No alteres, sintetices, aceleres ni recortes mi voz.
   - El audio manda sobre cualquier guion. Si no coinciden, transcribe y repórtame las diferencias.
   - No cambies el guion.
2. **Datos.**
   - No inventes cifras. Verifica con fuentes cada dato que aparezca en pantalla y anótalo en `FUENTES_Y_DECISIONES.md`.
   - Si algo es incierto, rotúlalo como «posible» o «probable».
3. **Formato.** 1080×1920, 30 fps, H.264 + AAC 48 kHz, MP4 de menos de 100 MB.
4. **Marca.** Sin logos de terceros; solo la palabra ASOMBROTECA en el cierre.
5. **Temas sensibles.** Respeto: sin explosiones ni dramatización, con silencio en el momento.
6. **Determinismo.** `window.seek(t)`, `window.DURATION`, `window.scoreSound`. `H.rng` y nunca `Math.random`. H y SOUND sin modificar.
7. **Versiones.** No sobrescribas versiones anteriores. Si corrijo algo, cambia solo eso.

**CÓMO CONTARLO**
- Estructura: **PROBLEMA → EXPLICACIÓN → CASO o CONSECUENCIA → SOLUCIÓN o LECCIÓN → CIERRE** (ASOMBROTECA + «Seguir»).
- Gancho en menos de 2 s.
- Algo cambia cada 1–2 s, siempre en una palabra concreta de la voz.
- Usa los bloques de la plantilla: lupa, bocadillo con ✗ o ✓, contador, onomatopeya, dominó, manómetro, flechas, personas, escudo de solución.
- Usa metáforas visuales claras y comparaciones de escala con objetos cotidianos.
- Pon un momento de énfasis en la idea clave.
- Si existe una solución real, muéstrala explícitamente.
- Subtítulos arriba, palabra a palabra, con 10–20 palabras clave en recuadro de selección.
- Nada importante en los 250 px inferiores.

**SONIDO**
- Cada aparición, etiqueta, flecha, tachado, contador, onomatopeya y transición lleva su efecto (`PLANTILLA.FX`), en el fotograma exacto.
- La voz siempre delante.
- Música original en un stem aparte, que se retira en los momentos sensibles.
- Mezcla a unos −15 LUFS con pico ≤ −1 dBFS.

**PROCESO**
1. Preparar la voz con `tools/preparar_voz.sh`. Corregir los tramos, alinear y generar subtítulos (`js/datos.js`).
2. Investigar y verificar los datos.
3. Escribir `js/episodio.js` partiendo de `nuevo_video/04_CODIGO/js/episodio.js`.
4. Revisar una hoja de contacto de unos 20 instantes y corregir textos encimados o cortados.
5. Si el modo es «Storyboard primero», entregar el storyboard (10–12 paneles dibujados con el mismo código) y esperar mi OK.
6. Renderizar, generar los stems, mezclar y codificar.
7. QC completo (ffprobe, decodificación, negros y congelados, sonoridad, md5 de la voz, determinismo) y documentación (README, QC, fuentes).
8. Commit y push. Entrégame el MP4 en el chat y dime qué mejoras hiciste al prompt.

**SI FALTA ALGO EN LA PLANTILLA**

Si mi video necesita algo que la plantilla no tiene (un objeto, gráfico, transición, efecto de sonido o piel), créalo. Si es reutilizable, **añádelo a la plantilla** siguiendo la sección 9 de `INSTRUCCIONES_PLANTILLA.md`:
- hazlo genérico;
- no rompas el ejemplo;
- añádelo al catálogo;
- anótalo en `CAMBIOS_PLANTILLA.md`;
- regenera el ZIP.

Dime qué añadiste.

Si sientes que al prompt le falta algo para que el video se vea mejor, hazlo y explícamelo.
