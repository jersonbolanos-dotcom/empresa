# Formato de serie «¿MITO O VERDAD?» (`serie_mito_verdad`) · plantilla v1.31

Serie de 6 capítulos sobre cosas que todos hacemos con el celular. **Todos los capítulos usan el mismo formato.**

## Crear un capítulo
```
python3 PLANTILLA_ASOMBROTECA/tools/nuevo_proyecto.py MITO_CAP4_TEMA --serie serie_mito_verdad --estilo tecno --voz AUDIO
```
Crea el proyecto con: `serie.js` incrustado en `index.src.html` (tras el motor), `SERIE.json` en la raíz del proyecto y
`07_OUTPUT/PUBLICAR.md` de la serie.

## Estructura fija del guion (≤ 1.300 caracteres, una sola toma)
1. 3 ganchos de ≤ 2 s (`[GANCHO A/B/C]`), en segunda persona, sin dar el veredicto.
2. «¿Mito o verdad?» + la metáfora cotidiana del capítulo.
3. Mecanismo en 2-4 pasos, con 3-4 pausas antes de cada revelación.
4. Cifras SOLO medidas y publicadas (2 fuentes); si no hay cifra fiable, sin número. Las deducciones se dicen como tales («puede…»).
5. `[long pause]` + «Veredicto: mito | verdad | a medias.» → **sello** `P.veredicto(...)` + `FX.veredicto(...)` justo en esa frase.
6. Cuándo sí y cuándo no (una frase).
7. «Envíaselo a ese amigo que…» + `P.ctaShare`.

## Sello del veredicto
```js
const tV = wt(SEG, 'medias.') - 0.35;            // la palabra del veredicto (o 'mito.', 'verdad.')
P.veredicto(ctx, t, tV, 'A MEDIAS', { y: 1000 }); // 'MITO' (rojo) · 'VERDAD' (verde) · 'A MEDIAS' (ámbar)
// en sfx(k):
FX.veredicto(k, tV, 'A MEDIAS');
```
El sello cae acelerando, golpea en `tV` con onda y polvo del color del veredicto, tiembla y se queda. Cuenta en el QC
como «cifra» (zona segura y encimados), así que no pongas otras etiquetas encima mientras está.

## Portada fija de la serie
```
python3 PLANTILLA_ASOMBROTECA/tools/producir.py PROYECTO portada "¿PREGUNTA LÍNEA 1 / LÍNEA 2?" "PALABRA_ROJA" SEGUNDO --gancho X [--escala 0.84] [--bajar PX]
```
Con `SERIE.json` en el proyecto, la etiqueta amarilla es SIEMPRE «¿MITO O VERDAD?» (no se pasa), la palabra clave va en rojo,
las dos líneas tienen el mismo tamaño y la marca va ARRIBA, sobre la etiqueta, para que no tape la escena.

**REGLA DEL FONDO (v1.32):** el fotograma es el **OBJETO COTIDIANO del capítulo en uso** (el celular, el cargador…), grande y
centrado bajo el texto, NUNCA la metáfora (el balde solo no se entiende fuera del vídeo) ni el sello del veredicto (no se adelanta
la respuesta). Suele estar en el gancho A. Si el objeto no cabe entero bajo el texto, `--escala` (< 1) reduce el fotograma (los
bordes se funden con el fondo) y `--bajar` lo coloca debajo del texto; `portada.js` comprueba que todo quede dentro del 3:4.

## Capítulos
| Cap. | Pregunta | Veredicto | Proyecto |
|---|---|---|---|
| 3 | ¿En modo avión carga más rápido el celular? | A MEDIAS | `MITO_CAP3_MODO_AVION_PROYECTO` (portada: `"¿CARGA MÁS RÁPIDO / EN MODO AVIÓN?" "AVIÓN?" 2.0 --gancho A --escala 0.84 --bajar 168` · celular con el dedo en el avión y la batería con «?») |

## Mano
Para señalar en pantalla, usa `P.mano(ctx, x, y, s, { ang })` (v1.31) y en el cierre `P.ctaShare(…, { mano: true })`.
