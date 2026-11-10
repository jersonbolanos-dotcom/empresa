# ASOMBROTECA · memoria del proyecto (se carga sola en cada chat nuevo)

Canal de videos verticales explicativos. El usuario manda audio de narración + SUPERPROMPT y espera el MP4 terminado,
con resumen en español. Responder siempre en español.

## Leer primero (en este orden)
1. `PLANTILLA_ASOMBROTECA/SUPERPROMPT_PLANTILLA_ASOMBROTECA.md` — reglas y «REGLAS APRENDIDAS» (1–80).
2. `PLANTILLA_ASOMBROTECA/INSTRUCCIONES_PLANTILLA.md` — todos los bloques `P.*` y FX disponibles por versión.
3. `PLANTILLA_ASOMBROTECA/CAMBIOS_PLANTILLA.md` — versión actual de la plantilla.
4. El episodio más parecido como ejemplo (p. ej. `ASOMBROTECA_MACHU_PICCHU_PROYECTO/04_CODIGO/js/episodio.js`).

## Reglas fijas
- Voz intocable (no alterar, sintetizar, acelerar ni recortar). El audio es el reloj maestro. Comprobar md5 de la voz.
- 1080×1920, 30 fps, H.264 + AAC 48 kHz, < 100 MB, −14 LUFS, pico ≤ −1 dBTP.
- Subtítulos `capStyle: 'barra'` (blanco, sin caja, barra amarilla), `capY: 1540`. Notas ≥ 32 px, fuera de la franja de subtítulos (y < 1420).
- Sin logos; solo un «ASOMBROTECA» discreto al final.
- Datos verificados con fuentes en `FUENTES_Y_DECISIONES.md`.
- Determinismo: `H.rng`, nunca `Math.random`. No modificar `H` ni `SOUND`.
- No crear plantillas nuevas: ampliar `PLANTILLA_ASOMBROTECA` (bloques nuevos, versión nueva en CAMBIOS) y comprobar retrocompatibilidad.
- Nada flota: los objetos se apoyan en superficies definidas.
- Al corregir: respaldar la versión anterior en carpetas `V1/` y cambiar solo lo pedido.
- Git: commit + push a la rama de trabajo; no subir `index.html` generados; no crear PR salvo que se pida.

## Flujo (desde `<PROYECTO>/04_CODIGO`; T = `../../PLANTILLA_ASOMBROTECA/tools`)
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

## Reels SIN VOZ (`PLANTILLA_ASOMBROTECA_SIN_VOZ`)
- Reels de 15-25 s sin narración. El reloj es `03_GUION/tiempos.txt` (no hay voz ni md5). Leer `PLANTILLA_ASOMBROTECA_SIN_VOZ/00_LEEME_PRIMERO.md` e `INSTRUCCIONES_REEL.md`.
- `tools/nuevo_reel.py NOMBRE --formato contador|quiz|tamanos|linea|capas` → `tools/producir_reel.py NOMBRE_REEL prueba …` → `todo`.
- Texto ≤ 8 palabras, efecto en cada aparición, gancho antes de 1 s, bucle (último fotograma ≈ primero). QC «TODO CORRECTO» con `07_QC/revision_visual.txt` («nada flota: OK»).
- Se amplía `motor/reel.js`; `motor/plantilla.js` y `lib/` son copias intactas de la v1.28.
