# Formato de serie «¿QUÉ PASA SI…?» (`serie_que_pasa_si`) · plantilla v1.37

Serie de situaciones de peligro o sorpresa vividas **desde dentro**: el espectador está en la escena, en segunda persona, y el
vídeo explica lo que pasa de verdad y **qué hacer**. **Todos los capítulos usan el mismo formato.**

## Crear un capítulo
```
python3 PLANTILLA_ASOMBROTECA/tools/nuevo_proyecto.py QPS_CAP1_TEMA --serie serie_que_pasa_si --capitulo 1 --estilo noche --voz AUDIO
```
Crea el proyecto con `serie.js` incrustado en `index.src.html` (tras el motor), `SERIE.json` en la raíz del proyecto y
`07_OUTPUT/PUBLICAR.md` de la serie.

## Reglas fijas del formato (iguales en todos los capítulos)
1. **Dentro de la situación, en segunda persona, con el peligro en los primeros 2 s.** «Vas en…», «Estás en…»; el peligro
   (el rayo, la ola, el golpe…) se ve y se oye antes de 2,0 s. Un solo gancho, el elegido (`[GANCHO X]` en `tramos.txt`).
2. **Un solo objeto grande y en movimiento desde el fotograma 0** (el carro, el ascensor, la barca…), ≥ 60 % del ancho, sin
   cortes en los bordes. Es el protagonista de todo el vídeo; la metáfora aparece como inserto, nunca lo sustituye del todo.
3. **La pregunta escrita arriba con `P.pregunta`**, fija y centrada (x = 540), desde el fotograma 0 hasta justo antes del
   segundo subtítulo: `P.pregunta(ctx, '¿QUÉ PASA SI… / …?', t, 0, S(2) - 0.15, { clave: 'PALABRA' })`.
4. **Promesa de respuesta en los primeros segundos**, justo tras el gancho: «…y lo que pasa te va a sorprender» o similar.
5. Cuerpo: metáfora cotidiana sostenida, 3-4 pausas (`[short pause]`, «…», un `[long pause]`), un dato por frase, cada dato con
   **2 fuentes oficiales o científicas**; sin cifras inventadas (si no hay cifra con 2 fuentes, sin número); las deducciones con «puede».
6. **Remate «QUÉ HACER» con 2-3 consejos** (en lugar del sello de mito/verdad): la voz dice «¿Qué hacer?» y los consejos, uno por frase.
7. Cierre: «Envíaselo a ese amigo que…» + `P.ctaShare` (con `{ manoImg: 'frente' }` si hay mano).

## Remate «QUÉ HACER»
```js
const tQ = wt(SEG, 'hacer?') - 0.3;                         // la frase «¿Qué hacer?»
const CONSEJOS = [ { t: wt(SEG, 'Quédate'), txt: 'Quédate dentro' },
                   { t: wt(SEG, 'Sube'),    txt: 'Sube las ventanas' },
                   { t: wt(SEG, 'toques'),  txt: 'No toques el metal' } ];
P.queHacer(ctx, t, tQ, CONSEJOS, { y: 470 });               // etiqueta amarilla que cae + consejos con ✓ verde, uno a uno
// en sfx(k):
FX.queHacer(k, tQ, CONSEJOS);
```
Textos cortos (≤ 4 palabras por consejo). Desde t0 el remate marca `safeLog('cierre')`: queda exento del ENCUADRE, como el cierre de compartir. El panel queda dentro de x 140-940 y cuenta en el QC como «cifra» (zona segura y
encimados): mientras está, no pongas otras etiquetas encima; debajo puede seguir la escena (el objeto, más pequeño).

## Portada fija de la serie
```
python3 PLANTILLA_ASOMBROTECA/tools/producir.py PROYECTO portada "¿QUÉ PASA SI… / LÍNEA 2?" "PALABRA_ROJA" SEGUNDO [--foco X] [--bajar PX] [--escala 0.84]
```
Con `SERIE.json`, la etiqueta amarilla es SIEMPRE «¿QUÉ PASA SI…?» (no se pasa; la pregunta de la portada NO la repite: máx. 8 palabras, p. ej. «¿TE CAE UN RAYO / DENTRO DEL CARRO?»), la pregunta en 2 líneas del mismo tamaño
con la palabra clave en rojo, la marca ARRIBA y todo centrado en x = 540. **Fondo:** un fotograma NÍTIDO de la **escena real**
(el objeto en la situación: el carro bajo la tormenta con el rayo), nunca la metáfora ni el panel «QUÉ HACER». Elegir un
segundo sin transición ni destello que lo queme.

## Rayos, destellos y textos
Con fogonazos blancos a pantalla completa, activa `capBorde: true` en `PL.make` (v1.38) para que el subtítulo se lea encima del destello.
En escenas de tormenta, el rayo y los destellos no entran en la franja de subtítulos y pregunta (recorte por encima de un `TOPE`), para que el texto se lea entero; en la portada (`__SIN_SUBTITULOS`) el rayo se ve entero. Ver `QPS_CAP1_RAYO_CARRO_PROYECTO/04_CODIGO/js/episodio.js`.

## Mano y personas
Solo `P.manoImg` (manos ilustradas del canal, `catalogo/manos_v135.jpg`) o personas dibujadas propias; nunca `P.mano`.

## Capítulos
| Cap. | Pregunta | Proyecto |
|---|---|---|
| 1 | ¿Qué pasa si te cae un rayo dentro del carro? | `QPS_CAP1_RAYO_CARRO_PROYECTO` (un solo vídeo, gancho A · portada: `"¿TE CAE UN RAYO / DENTRO DEL CARRO?" "RAYO" 1.0` · V2: el carro grande y abajo, el rayo cae desde la derecha bajo el título (composición propia de portada con `__SIN_SUBTITULOS`)) |
