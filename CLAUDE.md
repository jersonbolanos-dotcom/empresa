# ASOMBROTECA · memoria del proyecto (se carga sola en cada chat nuevo)

Canal de videos verticales explicativos. El usuario manda audio de narración + SUPERPROMPT y espera el MP4 terminado,
con resumen en español. Responder siempre en español.

## Leer primero (en este orden)
1. `PLANTILLA_ASOMBROTECA/SUPERPROMPT_PLANTILLA_ASOMBROTECA.md` — reglas y «REGLAS APRENDIDAS» (1–125; las 121–125 de la v1.34 mandan: UN solo vídeo por defecto con el gancho elegido, fórmula de los más vistos, «Imagina» solo con peligro < 2 s, encuadre como FALLO del QC; luego las 155–156 de la v2.0b mandan sobre el sonido y las manos; las 99–120 de la v1.27–v1.31: zona segura, ganchos, una toma de voz, variantes, portada estándar v1.30, PUBLICAR.md y formatos de serie en `series/`).
2. `PLANTILLA_ASOMBROTECA/INSTRUCCIONES_PLANTILLA.md` — todos los bloques `P.*` y FX disponibles por versión.
3. `PLANTILLA_ASOMBROTECA/CAMBIOS_PLANTILLA.md` — versión actual de la plantilla.
4. El episodio más parecido como ejemplo (p. ej. `ASOMBROTECA_MACHU_PICCHU_PROYECTO/04_CODIGO/js/episodio.js`).

## v2.0 · MODO VIRAL (manda sobre todo; ver el bloque v2.0 de `GUIA_ESTILOS.md` y las reglas 128–154 del SUPERPROMPT)
- Vídeos nuevos con `PL.make({ modo: 'viral' })`. Fotograma 0 = la imagen más fuerte (una sola cosa, primerísimo plano, ya en acción); gancho de 2–4 s con la paradoja completa; segunda frase = segundo dato (sin promesas genéricas); un solo texto en el gancho.
- Cadena de preguntas con re-ganchos cada 8–15 s, un «No es X: es Y», analogías de una frase (sin metáfora sostenida), ≥ 3 cifras verificadas como contadores con fuente en letra pequeña, remate que responde al título y último plano = fotograma 0. Duración 40–90 s.
- Un solo mundo continuo (`P.camino`, `P.atravesar`), máximo 3 cortes y 2 fogonazos; primerísimo plano (solo los textos no se recortan); el objeto es el protagonista (personas con cara solo si la historia trata de personas; manos `P.manoR`, dedo `P.dedoPP`); luz y profundidad (`P.capaDesenfoque`, `P.resplandor`, `P.reflejo`, `P.vineta`, `P.grano`, `P.particulas`); paleta corta; titulares grandes `P.titular` en vez de etiquetas.
- Sin música continua por defecto (o −10 dB con `musica: 'baja'`), silencio de 0,5–1,2 s antes de cada revelación, −14 LUFS. La voz es un parámetro del proyecto.
- Sonido v2.3 (regla 162, manda sobre la 155 en el número): efectos COHERENTES con la imagen hasta ~5 por cada 10 s y fondo muy suave (≈ −30 dB bajo la voz) por escena que baja a silencio 0,5-1 s antes de cada revelación; prohibido el ruido sin motivo; QC avisa con > 5 en 10 s.
- Pocos sonidos (v2.0b, regla 155): un efecto solo cuando pasa algo IMPORTANTE; avalancha = un solo «crash» continuo; contadores en silencio con un golpe al final; `FX.clave` máx. 3-4 por vídeo; etiquetas y pausas mudas en modo viral. QC: máx. 3 efectos por cada 10 s.
- QC v2.0 (avisos): cambios bruscos > 3, protagonista en el fotograma 0 < 70 % del ancho, piso de sonido entre frases que nunca baja de −45 dB, más de 3 efectos por cada 10 s, más de 4 `FX.clave`.
- Manos (v2.0b, regla 156): `P.manoR` es una sola silueta con contorno continuo, sin costuras.
- Sustituidas: corte directo en cada plano, «nada cortado en los bordes» (solo textos), personajes con reacción, metáfora sostenida, promesa de respuesta y el cierre «Envíaselo» obligatorio. Los episodios viejos no se rehacen y renderizan igual.

## v2.2 · BIBLIOTECA DE ESTILOS (bloque v2.2 de GUIA_ESTILOS; reglas 158–161)
- `PL.make({ modo: 'viral', estilo: 'nombre' })` con uno de los 15 estilos de `PLANTILLA_ASOMBROTECA/estilos/` (tabla de temas en GUIA); solo cambia la piel. El tema se dibuja con `PL.piel().fondo / forma / linea / brillo`.
- Cifra con su valor final desde que aparece y quieta ~1,5 s; cifras redondeadas en pantalla y la exacta en letra pequeña; nunca el mismo plano más de 3-4 s; un solo texto grande a la vez; cierres alternos.
- Los originales del Atlas están en `referencias/estilos_atlas/` (no van en el kit).

## Qué modo usar (v2.4)
| Plataforma | Modo | Temas |
|---|---|---|
| **Facebook** | `modo: 'historia'` (85-100 s, «¿Qué pasa si…?» con alguien en peligro) | Solo vehículos, ingeniería, catástrofes e historia. Nada de celular, videojuegos, fútbol ni criptomonedas. |
| **TikTok e Instagram** | `modo: 'viral'` (40-90 s, ráfaga) | Los de siempre. |
| **YouTube** | cualquiera de los dos | — |

En los dos modos siguen las reglas de siempre: un solo texto grande a la vez, contadores que aparecen con el valor final y se quedan quietos ~1,5 s, cifras redondeadas con la fuente exacta en letra pequeña y el recuadro azul en la palabra clave de los subtítulos. Datos de Facebook que lo justifican: tabla en CAMBIOS_PLANTILLA.md (v2.4).

## v2.4 · MODO HISTORIA para Facebook (reglas 163–166; bloque v2.4 de GUIA)
- `PL.make({ modo: 'historia', estilo })`; el modo viral sigue para TikTok/Instagram y renderiza igual. Guion de 85-100 s: peligro 0-3 s → cifra en juego 3-12 s → promesa abierta 12-20 s → mecanismo en 3-4 pasos con frase de tensión (20-75 s) → desenlace (75-90 s) → pregunta + «sigue a Asombroteca» (sin repetir el fotograma 0).
- 6-8 escenas de 4-8 s con movimiento; nunca el mismo plano más de 6 s; pausas de 0,3-0,5 s antes de cada giro. Revisar el guion con `tools/guion_historia.py` (Dan ≈ 16 car./s).

## Reglas fijas
- Voz intocable (no alterar, sintetizar, acelerar ni recortar). El audio es el reloj maestro. Comprobar md5 de la voz.
- 1080×1920, 30 fps, H.264 + AAC 48 kHz, < 100 MB, −14 LUFS, pico ≤ −1 dBTP.
- Subtítulos `capStyle: 'barra'` (blanco, sin caja, barra amarilla), `capY: 1540`. Notas ≥ 32 px, fuera de la franja de subtítulos (y < 1420).
- Sin logos; solo un «ASOMBROTECA» discreto al final.
- Datos verificados con fuentes en `FUENTES_Y_DECISIONES.md`.
- Determinismo: `H.rng`, nunca `Math.random`. No modificar `H` ni `SOUND`.
- No crear plantillas nuevas: ampliar `PLANTILLA_ASOMBROTECA` (bloques nuevos, versión nueva en CAMBIOS) y comprobar retrocompatibilidad.
- Nada flota: los objetos se apoyan en superficies definidas.
- Personajes y manos (v1.43): `P.personaje` (con cuello, brazos con codo, manos que agarran, expresiones y poses; catálogo `PLANTILLA_ASOMBROTECA/catalogo/personajes_v143.jpg`) y `P.manoV` (mano vectorial nítida). En planos cercanos, manos con dedos. `P.manoImg` y los muñecos viejos solo en episodios anteriores.
- Al corregir: respaldar la versión anterior en carpetas `V1/` y cambiar solo lo pedido.
- Git: commit + push a la rama de trabajo; no subir `index.html` generados; no crear PR salvo que se pida.

## Flujo (desde `<PROYECTO>/04_CODIGO`; T = `../../PLANTILLA_ASOMBROTECA/tools`)
1. Voz: `bash $T/preparar_voz.sh <voz> <proyecto>` → corregir `03_GUION/tramos.txt` (números: `500|quinientos`) → `alinear.py` → `subtitulos.py`.
2. Escribir `js/episodio.js` (beats `{t0,t1,in,draw,sfx}`; tiempos con `wt(seg,'palabra')`).
3. `python3 -I $T/build.py` → `index.html`.
4. Prueba rápida: `node $T/frames.js index.html <dir> t1 t2 …` + `python3 -I $T/sheet.py hoja.jpg cols <pngs>`.
5. Producción por defecto (v1.34): `python3 $T/producir.py <PROYECTO> video` (un solo vídeo; `variantes` solo si se piden 3). Render manual: `node $T/render.js index.html <frames> 6` (~3 min). Audio: `node $T/audio.js index.html ../05_AUDIO`.
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
