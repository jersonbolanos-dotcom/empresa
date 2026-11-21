# ASOMBROTECA · memoria del proyecto (se carga sola en cada chat nuevo)

Responder siempre en **español**. Plantilla actual: **PLANTILLA_ASOMBROTECA v2.5** (changelog completo abajo y en `PLANTILLA_ASOMBROTECA/CAMBIOS_PLANTILLA.md`).

## 1. Qué es Asombroteca
Canal de vídeos verticales explicativos (1080×1920) sobre ingeniería, vehículos, catástrofes, historia y tecnología, con narración en español, dibujos animados por código (canvas) y datos verificados. Público adulto de Facebook (México, Argentina, Colombia), TikTok, Instagram y YouTube. Tono de documental con asombro. Sin logos: solo un «ASOMBROTECA» discreto al final.

### Qué modo usar en cada plataforma
| Plataforma | Modo | Temas |
|---|---|---|
| **Facebook** | `modo: 'historia'` (85-100 s, «¿Qué pasa si…?» con alguien en peligro) | Solo vehículos, ingeniería, catástrofes e historia. Nada de celular, videojuegos, fútbol ni criptomonedas. |
| **TikTok e Instagram** | `modo: 'viral'` (40-90 s, ráfaga) | Los de siempre. |
| **YouTube** | cualquiera de los dos | — |

**Por qué (Meta Business Suite):** los virales de Facebook duraban 1:32-1:36 y se veían 31-43 s de media (avión sin motores 303 mil, submarino 235 mil, rayo en avión 47 mil); los recientes en modo viral (~1:00) se ven 6-10 s y sacan 200-500. El mismo vídeo del rayo dentro del carro: 14.700 en YouTube y 300 en Facebook. En Facebook el problema es la forma, no el tema.

## 2. Estructura de carpetas
```
/                                  repositorio (GitHub jersonbolanos-dotcom/empresa)
├── CLAUDE.md                      ESTE archivo (traspaso)          README.md  índice corto
├── PLANTILLA_ASOMBROTECA/         la plantilla (motor + herramientas + documentación)
│   ├── motor/plantilla.js         el motor: PL.make, bloques P.*, FX, cámara, subtítulos, transiciones (no tocar H ni SOUND)
│   ├── motor/manos.js             siluetas de manos de P.manoR
│   ├── lib/harness.js, sound.js   H (dibujo, H.rng) y SOUND (síntesis de efectos) — NO MODIFICAR
│   ├── estilos/                   biblioteca v2.2: _comun.js + 15 pieles (tech_glow, engineering_blueprint, …)
│   ├── fonts/                     letras incrustadas (Nunito, Fredoka, Space Grotesk, IBM Plex Mono, Fraunces)
│   ├── tools/                     herramientas (ver §3)
│   ├── nuevo_video/, tools/plantillas_proyecto/   moldes de proyecto nuevo (index.src.html, episodio.js, PUBLICAR, FUENTES)
│   ├── series/                    formatos de serie («¿Qué pasa si…?», «Mito o verdad»)
│   ├── catalogo/                  hojas visuales (estilos_v22.jpg, manos, personajes)
│   ├── ejemplo_submarino/, ejemplo_demo_v126/   ejemplos (el submarino es la referencia de determinismo)
│   ├── manos/                     PNG de manos de episodios antiguos (P.manoImg) — no borrar
│   ├── SUPERPROMPT_PLANTILLA_ASOMBROTECA.md  reglas 1-168 («REGLAS APRENDIDAS»)
│   ├── INSTRUCCIONES_PLANTILLA.md  todos los bloques P.* y FX por versión + referencia de PL.make (v2.5)
│   ├── GUIA_ESTILOS.md            fórmula de guion, bloques v2.0 / v2.2 / v2.4 y tabla tema → estilo
│   ├── CAMBIOS_PLANTILLA.md       changelog de todas las versiones
│   └── PROMPT_NUEVO_VIDEO.md      molde para pedir un vídeo (viral y variante Facebook «historia»)
├── <TEMA>_PROYECTO/               un vídeo por carpeta:
│   ├── 01_ENTRADA/audio/          la voz original (mp3 de ElevenLabs) — intocable
│   ├── 03_GUION/guion.txt, tramos.txt   guion y tramos de voz ([PAUSA x], [QUITAR])
│   ├── 04_CODIGO/index.src.html, js/episodio.js, js/datos.js, alineacion.json   (index.html se genera, no se sube)
│   ├── 05_AUDIO/                  voz montada, efectos, mezcla
│   ├── 06_SUBTITULOS/subtitulos.srt
│   ├── 07_OUTPUT/<TEMA>_FINAL.mp4, portada.jpg, PUBLICAR.md
│   ├── 07_QC/QC.md, hoja_prueba.jpg, hoja_contacto.jpg, voz_md5.txt, (sonidos.md)
│   ├── FUENTES_Y_DECISIONES.md    cada dato con 2 fuentes y cada decisión
│   └── V1/                        respaldo de la versión anterior al corregir
├── HISTORIA_PRUEBA_PROYECTO/      prueba del modo historia (camión sin frenos, sin voz, cifras SIN VERIFICAR: no publicar)
├── ESTILOS_PRUEBA_PROYECTO/       escena de prueba de los 15 estilos (tools/muestra_estilos.py)
├── referencias/estilos_atlas/     originales del AI Style Atlas (solo consulta; no van en el kit)
└── _archivo/                      cosas guardadas por si acaso (respaldos viejos de la plantilla, voz_kokoro, renders sueltos)
```
Vídeos más recientes como ejemplo: `PUENTE_CHACAO_PROYECTO` (v2.3, estilo engineering_blueprint, 3D, sonido rico), `RELOJES_ANTIGUOS_PROYECTO`, `DISQUETE_MEMORIA_PROYECTO`, `HISTORIA_PRUEBA_PROYECTO` (modo historia).

## 3. Cómo se hace un vídeo (de principio a fin)
Desde `<PROYECTO>/04_CODIGO`, con `T=../../PLANTILLA_ASOMBROTECA/tools`.
1. **Investigación y guion.** Datos solo de fuentes fiables (las que pida el usuario: organismos oficiales, universidades, museos, USGS…), **2 fuentes por dato**; lo que sea deducción se dice con «puede». Proponer 3 ganchos y ESPERAR; luego el guion con caracteres y cifras con fuentes y ESPERAR el OK. En modo historia: `python3 -I $T/guion_historia.py ../03_GUION/guion.txt` (duración estimada y estructura; solo avisa).
2. **Voz (una sola generación, ver §5).** Descargar a `01_ENTRADA/audio/`, guardar el md5 en `07_QC/voz_md5.txt`.
3. **Alineación.** `bash $T/preparar_voz.sh ../01_ENTRADA/audio/<voz>.mp3 .` (duración, silencios y transcripción Whisper) → escribir `03_GUION/tramos.txt` (una línea por tramo de voz; `[PAUSA 0.4]` entre líneas para silencios de posproducción; `[QUITAR] texto` para tramos grabados que no van) → `python3 -I $T/alinear.py sil_major.txt sil_minor.txt $(cat duracion.txt) alineacion.json ../03_GUION/tramos.txt` → `python3 -I $T/subtitulos.py alineacion.json ../06_SUBTITULOS/subtitulos.srt js/datos.js`.
4. **Episodio.** `js/episodio.js` con `PL.make({ modo, estilo, align, duration, beats, … })`; tiempos con `wt(tramo, 'palabra', n)`. Construir: `python3 -I $T/build.py`.
5. **Hoja de prueba (UNA ronda, 15-18 fotogramas, el 0 primero).** `node $T/frames.js index.html <dir> 0 3 …` + `python3 -I $T/sheet.py ../07_QC/hoja_prueba.jpg 6 <pngs> --ficha <modo> "estimada 60 s"`. Para ver/oír un tramo: `python3 -I $T/clip.py .. t0 t1`. Enviar la hoja y ESPERAR.
6. **Render + QC.** Desde la raíz: `python3 -B PLANTILLA_ASOMBROTECA/tools/producir.py <PROYECTO> video` (render, efectos, mezcla con sidechain a −14 LUFS, H.264, QC completo → `07_QC/QC.md`). Debe decir **QC: TODO CORRECTO**. Tarda 5-7 min: lanzarlo en segundo plano.
7. **Portada.** Fondo = fotograma 0 sin subtítulos: `SIN_SUBTITULOS=1 node $T/frames.js index.html <dir> 0` → `node $T/portada.js <dir>/t_000.00.png ../07_OUTPUT/portada.jpg "LÍNEA 1/LÍNEA 2" PALABRA_ROJA "ETIQUETA" ASOMBROTECA 540 arriba 0 palabra desigual 1.0 abajo`.
8. **Textos.** `07_OUTPUT/PUBLICAR.md` (título, texto para Facebook/TikTok con pregunta para comentar, fuentes, hashtags, comentario fijado) y `FUENTES_Y_DECISIONES.md`.
9. **Git.** Commit + push a la rama de trabajo; no subir `index.html`; no crear PR salvo que se pida. Borrar carpetas de fotogramas al terminar (disco limitado).

## 4. Reglas de la plantilla (resumen; detalle en SUPERPROMPT 1-168 y GUIA)
**Fijas.** 1080×1920, 30 fps, H.264 + AAC 48 kHz, < 100 MB, −14 LUFS, pico ≤ −1 dBTP. Voz intocable (el audio es el reloj). Determinismo: `H.rng`, nunca `Math.random`. Nada flota. Ampliar la plantilla (versión nueva en CAMBIOS), nunca crear otra; comprobar que los vídeos anteriores salen idénticos. Al corregir, respaldar en `V1/` y cambiar solo lo pedido.

**Modo viral (v2.0, TikTok/Instagram).** Fotograma 0 = la imagen más fuerte (una cosa, primerísimo plano, ya en acción, ≥ 70 % del ancho); gancho de 2-4 s con la paradoja completa y un solo texto; segunda frase = segundo dato; cadena de preguntas con re-ganchos cada 8-15 s; un «No es X: es Y»; analogías de una frase; ≥ 3 cifras como contadores con fuente; remate que responde al título; **último plano = fotograma 0**; 40-90 s; un solo mundo continuo, máx. 3 cortes; nunca el mismo plano > 4 s.

**Modo historia (v2.4, Facebook).** 85-100 s. 0-3 s el peligro («¿Qué pasa si…?» / «Vas en…») → 3-12 s lo que está en juego con una cifra → 12-20 s promesa abierta («y lo que te salva no es lo que imaginas») → 20-75 s el mecanismo en 3-4 pasos, cada uno con frase de tensión («pero aquí viene el problema…»), giro cada ~15 s → 75-90 s desenlace → 90-100 s pregunta concreta + «sigue a Asombroteca», **sin repetir el fotograma 0**. 6-8 escenas de 4-8 s con movimiento; nunca el mismo plano > 6 s; pausas de 0,3-0,5 s antes de cada giro.

**Comunes a los dos.** Un solo texto grande a la vez (`P.titular` con palabra roja, `P.contador`, `P.tachado`). Contadores con el valor final desde que aparecen, quietos ~1,5 s, cifras redondeadas en pantalla y la exacta + fuente en letra pequeña (`P.fuenteCifra`). Recuadro azul fino en una palabra clave de los subtítulos (v2.1, `recuadro`). Subtítulos ocultos durante el gancho (`capOcultar`). Cierres alternos entre vídeos.

**Estilos (v2.2).** `estilo: '<nombre>'` de los 15 de `estilos/`; solo cambia la piel; el tema se dibuja con `PL.piel().fondo / forma / linea / brillo`. Tabla: vehículos/puentes/máquinas → tech_glow, engineering_blueprint; historia antigua → illuminated_manuscript, gouache_travel_poster, sumi_e; tecnología de antes → pixel_16bit, win95, phosphor_terminal; números → kinetic_type, manim_math; cuerpo/naturaleza → claymation, cut_paper, papercraft, flat_vector_science; espacio → cosmic_star_chart.

**Sonido (v2.3).** Sin música. Efectos COHERENTES con la imagen, hasta ~5 por cada 10 s (golpe, crujido, ola, pilote, corriente, retumbo…); prohibido el ruido sin motivo. Fondo muy suave por escena (≈ 30-40 dB bajo la voz) que calla 0,5-1 s antes de cada revelación. «Tin» (`FX.clave`) máx. 3. Contadores en silencio con un golpe al final. La voz siempre delante. Los efectos se generan en el `sfx(k)` de cada escena.

**Datos.** 2 fuentes por dato (las que pida el usuario); verificar titulares de prensa (p. ej. los «80 km» de Chacao eran falsos: el epicentro estaba a ~400 km); lo no confirmado se descarta; las deducciones o principios generales se dicen con «puede» y se anotan así en FUENTES.

## 5. Voz y créditos (ElevenLabs)
- **ElevenLabs Eleven v4 (`eleven_v4`), voz Dan `9F4C8ztpNUmXkdDDbz3J`, `generations_count: 1`.** Herramienta `creative_generate_speech`; esperar con `creative_get_flow_run_status`; descargar el `content_url` con curl.
- **Una sola generación por vídeo. Nunca regenerar la toma completa** (gasta créditos). Calcular la duración ANTES (Dan ≈ 16 caracteres/s: 990 car. → 59 s; 1.078 car. → 71 s; 85-100 s ≈ 1.350-1.600 car.) y ajustar el guion antes de generar.
- **Recortar sin regenerar:** `[QUITAR] texto` en `tramos.txt` (el tramo grabado no va al vídeo), `[PAUSA x]` (0,3-1,0 s de silencio exacto entre tramos), `tools/acortar_pausa.py` para acortar una pausa larga de la grabación. La voz no se acelera ni se altera; el QC compara el md5 por tramo.

## 6. Errores comunes ya resueltos (y cómo evitarlos)
- **Determinismo que falla con un estilo:** letra pequeña sin precargar → v2.5 la precarga sola en `build.py`.
- **Contador en la palabra equivocada:** `wt` toma la primera vez → usar `wt(tramo, 'mil', 1)`; la consola avisa (v2.5).
- **Contador casi transparente o encimado con el siguiente:** que entre 0,3 s antes de la palabra, dure ≥ 1,5 s y termine antes del siguiente.
- **El QC cuenta decenas de efectos:** ruido grave o tonos de 38 Hz en los fondos «laten» → tonos ≥ 98 Hz y ruido en bandas medias; v2.5 mide en 40 ms.
- **Fondos demasiado altos:** medir con ffmpeg volumedetect: fondo ≈ −50/−55 dBFS frente a la voz ≈ −21.
- **Encuadre que falla en el QC:** cielos y mares lisos cuentan como vacío → nubes con borde, olas con contraste, contornos; nada de media pantalla vacía.
- **Fondo de un estilo que no se funde:** v2.5 corrige `pintarTextura`; antes había que pintarlo en una capa aparte.
- **Plano 3D que desaparece de cerca:** tramos del tablero detrás de la cámara → muestreo fino junto a la cámara y caras recortadas al plano de la cámara (ver Chacao).
- **Mano que no agarra:** `P.manoR(ctx, 'puno', …)` sobre el aro (la pose `agarrar` sale con la palma abierta).
- **Encuadre/escena reorganizada que borra el fondo** (pasó bajo el agua en Chacao): revisar siempre la hoja tras refactorizar.
- **«index.html» o cachés sin subir que bloquean el hook:** ya están en `.gitignore`.
- **Disco lleno:** borrar `/tmp/plantilla_*` y carpetas de fotogramas al terminar.

## 7. Changelog v2.0 → v2.5 (completo en CAMBIOS_PLANTILLA.md)
- **v2.0 · Modo viral:** cámara continua, primerísimo plano, luz y profundidad, contadores con fuente, último plano = fotograma 0, QC de avisos virales. **v2.0b:** pocos sonidos (regla 155), manos de una sola silueta (156), gancho con un solo texto. **v2.0c / v2.0.1:** ajustes y `acortar_pausa.py`.
- **v2.1 · Recuadro azul** fino en la palabra clave de los subtítulos (`recuadro`).
- **v2.2 · Biblioteca de 15 estilos** (pieles) con transición y sonidos del medio; contadores con el valor final; QC de contadores, un texto grande a la vez y plano quieto. **v2.2.1:** precarga de letras.
- **v2.3 · Sonido rico pero coherente:** hasta ~5 efectos por cada 10 s, fondos por escena que callan antes de cada revelación (regla 162).
- **v2.4 · Modo historia para Facebook:** estructura de 85-100 s, validador del guion (`guion_historia.py`), QC propio, ficha «Resultado FB 24 h» en las hojas y en QC.md, «Qué modo usar».
- **v2.5 · Cierre:** precarga automática de letras, aviso de palabras repetidas en `wt`, `pintarTextura` con transparencia, contador de efectos en 40 ms, `tools/clip.py`, referencia de `PL.make`, limpieza y `_archivo/`. Sin cambios visuales ni sonoros en los vídeos anteriores.

## 8. Ficha de resultados
Cada hoja de prueba y de contacto lleva la ficha (modo, duración y «Resultado FB 24 h»: tiempo promedio de reproducción, meta > 20 s; reproducciones de 3 s / visualizaciones, meta > 50 %), también en `07_QC/QC.md`. Pedir al usuario esos dos datos a las 24 h y anotarlos.
