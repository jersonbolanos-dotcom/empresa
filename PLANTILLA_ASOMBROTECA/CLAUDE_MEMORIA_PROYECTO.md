# ASOMBROTECA · memoria del proyecto (se carga sola en cada chat nuevo)

Canal de videos verticales explicativos. El usuario manda audio de narración + SUPERPROMPT y espera el MP4 terminado,
con resumen en español. Responder siempre en español.

## Leer primero (en este orden)
1. `PLANTILLA_ASOMBROTECA/SUPERPROMPT_PLANTILLA_ASOMBROTECA.md` — reglas y «REGLAS APRENDIDAS» (1–120; las 99–120 de la v1.27–v1.31 mandan sobre todo lo anterior).
2. `PLANTILLA_ASOMBROTECA/INSTRUCCIONES_PLANTILLA.md` — todos los bloques `P.*` y FX disponibles por versión.
   `PLANTILLA_ASOMBROTECA/GUIA_ESTILOS.md` — fórmula de guion viral, 8 estilos y bloques v1.26 (personajes, móvil, HUD, mapas, 3D).
3. `PLANTILLA_ASOMBROTECA/CAMBIOS_PLANTILLA.md` — versión actual de la plantilla.
4. El episodio más parecido como ejemplo (p. ej. `ASOMBROTECA_MACHU_PICCHU_PROYECTO/04_CODIGO/js/episodio.js`).

## Reglas fijas
- Voz intocable (no alterar, sintetizar, acelerar ni recortar). El audio es el reloj maestro. Comprobar md5 de la voz.
- 1080×1920, 30 fps, H.264 + AAC 48 kHz, < 100 MB, −14 LUFS, pico ≤ −1 dBTP.
- v1.27 · Zona segura de Instagram: ningún texto importante en y < 220, y > 1450 ni x > 940. Subtítulos arriba palabra a palabra con `PL.make({ estilo: 'asombroteca' })` (estilo ios, capY 420, una palabra clave por frase). La barra en y = 1540 ya NO es el estándar (opción manual no recomendada). Notas ≥ 32 px.
- v1.27 · Gancho sin contexto (contradicción / cifra imposible / algo en juego, en 2.ª persona) y movimiento desde el fotograma 0; proponer 3 ganchos y ESPERAR la elección del usuario antes del guion. Ángulo personal (tu móvil, tu casa, tu cuerpo).
- v1.27 · Pantalla limpia: sin título fijo arriba, ≤ 2 etiquetas a la vez (1-3 palabras), avisos pequeños y breves. 3-4 pausas antes de las revelaciones (voz con ElevenLabs Eleven v4, voz Dan 9F4C8ztpNUmXkdDDbz3J; sin `<break>`: `[short pause]`, `[long pause]` una vez y «…»; los corchetes nunca salen en los subtítulos). Duración 45-70 s (QC avisa > 75, falla > 90). Cierre siempre «Envíaselo a ese amigo que…» + `P.ctaShare`; prohibido «Sigue a Asombroteca».
- v1.28 · Pausas en posproducción: línea `[PAUSA x]` (0.3–1.0 s) sola en `tramos.txt` → silencio exacto entre tramos (`05_AUDIO/voz_montada.wav`), tiempos desplazados; fuera de rango = ERROR. QC «Voz intacta» por md5 de cada tramo. QC avisa si dura < 45 s.
- v1.29 · Ahorro de créditos y crecimiento: ElevenLabs con `generations_count: 1` y guion ≤ 1.300 caracteres (avisar del número ANTES de generar); 3 ganchos en la MISMA toma marcados `[GANCHO A/B/C] texto` en `tramos.txt` → `producir.py NOMBRE variantes` → `07_OUTPUT/VARIANTE_A/B/C.mp4` (voz por tramos del original, md5 por tramo); `window.GANCHO` en `episodio.js` para la imagen de los primeros 2 s; QC: silencio inicial ≤ 0,5 s y final ≤ 1 s, nada encimado (✘), pantalla llena ≥ 60 % (aviso); `producir.py NOMBRE portada "TEXTO" "ROJA" "ETIQUETA"` → `portada.jpg`; `07_OUTPUT/PUBLICAR.md` (gancho como pregunta sin respuesta, pedir comentar, 3-5 hashtags); datos en 2 fuentes; personas reales dibujadas, sin fotos.
- v1.30 · Portada estándar: fotograma NÍTIDO del vídeo (sin subtítulos) en un segundo exacto (`producir.py NOMBRE portada "L1 / L2" "ROJA" "ETIQUETA" SEGUNDO [--gancho X] [--bajar PX]`), texto arriba en dos líneas con borde oscuro (una roja), etiqueta amarilla, centrado en x = 540 y dentro del recorte 3:4 (y 240-1680).
- v1.31 · Series: `series/serie_mito_verdad/` («¿MITO O VERDAD?»: sello `P.veredicto` + `FX.veredicto`, portada fija con la pregunta en 2 líneas y la palabra clave en rojo, PUBLICAR de la serie). Crear capítulos con `nuevo_proyecto.py --serie serie_mito_verdad --capitulo N`.
- Sin logos; solo un «ASOMBROTECA» pequeño al final con `P.marca`.
- Datos verificados con fuentes en `FUENTES_Y_DECISIONES.md`.
- Determinismo: `H.rng`, nunca `Math.random`. No modificar `H` ni `SOUND`.
- No crear plantillas nuevas: ampliar `PLANTILLA_ASOMBROTECA` (bloques nuevos, versión nueva en CAMBIOS) y comprobar retrocompatibilidad.
- Nada flota: los objetos se apoyan en superficies definidas.
- Al corregir: respaldar la versión anterior en carpetas `V1/` y cambiar solo lo pedido.
- Git: commit + push a la rama de trabajo; no subir `index.html` generados; no crear PR salvo que se pida.

## Flujo rápido (v1.26, desde la raíz del repositorio)
- `python3 PLANTILLA_ASOMBROTECA/tools/nuevo_proyecto.py NOMBRE --estilo E --marca M --voz V` → `NOMBRE_PROYECTO/`
- `python3 PLANTILLA_ASOMBROTECA/tools/producir.py NOMBRE_PROYECTO voz` → revisar `03_GUION/tramos.txt` → `… alinear` → escribir `js/episodio.js` (usar `PL.kit(A)`) → `… prueba t1 t2 …` → `… todo` (render + mezcla + QC con ✔/✘).

## Flujo manual (desde `<PROYECTO>/04_CODIGO`; T = `../../PLANTILLA_ASOMBROTECA/tools`)
1. Voz: `bash $T/preparar_voz.sh <voz> <proyecto>` → corregir `03_GUION/tramos.txt` (números: `500|quinientos`) → `alinear.py` → `subtitulos.py`.
2. Escribir `js/episodio.js` (beats `{t0,t1,in,draw,sfx}`; tiempos con `wt(seg,'palabra')`).
3. `python3 -I $T/build.py` → `index.html`.
4. Prueba rápida: `node $T/frames.js index.html <dir> t1 t2 …` + `python3 -I $T/sheet.py hoja.jpg cols <pngs>`.
5. Render: `node $T/render.js index.html <frames> 6` (~3 min). Audio: `node $T/audio.js index.html ../05_AUDIO`.
6. Mezcla y codificación: comandos ffmpeg en el SUPERPROMPT (sidechain + alimiter; libx264 crf 20).
7. QC: ffprobe, decodificación completa, blackdetect/freezedetect, ebur128, md5 voz, hoja de contacto del MP4 → `07_QC/QC.md`.

## Para ir rápido
- UNA sola ronda de hoja de contacto (8–12 fotogramas clave) antes del render completo; no renderizar el video entero para probar.
- Borrar las carpetas de fotogramas al terminar (el disco es limitado, ~8 GB).
- La retrocompatibilidad (reconstruir los otros episodios y comparar hash) solo es necesaria si se tocó un bloque existente; lanzarla en segundo plano.
- Con grano/sepia (`P.eraGrade`) codificar además con `-maxrate 8.5M -bufsize 17M`; comprobar el tamaño antes del QC.
- Antes de crear un bloque/FX nuevo, buscar que el nombre no exista ya en `plantilla.js` (las claves repetidas pisan a las antiguas).
- En arquitectura/paisaje: modelo maestro con ejes cardinales y vector solar + `comprobaciones.js` (ver Yakhchal); fotos con licencia condicionada → entregar versión FINAL sin foto y otra CON_FOTO.
- Los efectos de sonido se generan con `FX.*` dentro de cada beat (`sfx(k)`); no hace falta audio externo.
