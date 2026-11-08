# Guía de estilos y guion · PLANTILLA ASOMBROTECA v1.27

> **v1.27 · Reglas para más visualizaciones (mandan sobre todo lo demás):**
> 1. **Zona segura de Instagram:** texto importante solo en 220 ≤ y ≤ 1450 y x ≤ 940. Subtítulos arriba (estilo `ios`, capY 330-520), una palabra clave por frase.
> 2. **Gancho (0-2 s):** nada de «Imagina», «En el año…», «Antes de…». Contradicción, cifra imposible o algo en juego, en segunda persona. Movimiento desde el fotograma 0. Se proponen 3 ganchos y el usuario elige antes del guion.
> 3. **Ángulo personal:** se cuenta desde la vida del espectador (tu móvil, tu casa, tu cuerpo, tu ciudad).
> 4. **Pantalla limpia:** sin título fijo arriba; máximo 2 etiquetas a la vez de 1-3 palabras; avisos pequeños y breves.
> 5. **Pausas dramáticas:** 3-4 silencios de 0,4-1,0 s antes de las revelaciones (ElevenLabs Multilingual v2 con `<break time="0.6s" />`). La animación se frena, la música baja y entra `FX.pausa`.
> 6. **Duración:** 45-70 s (el QC avisa por encima de 75 s y falla por encima de 90).
> 7. **Cierre:** la última frase siempre es «Envíaselo a ese amigo que…» con `P.ctaShare`; «ASOMBROTECA» solo pequeño con `P.marca`; nunca «Sigue a Asombroteca».

Lo que hace funcionar a los vídeos verticales de referencia, convertido en reglas y bloques de la plantilla.

**Referencias analizadas (7 vídeos):**

- ¿Por qué el fentanilo da tanto placer?
- Lo que pasa cuando bebes de más (alcohol y memoria).
- 1.000 botellas y una envenenada.
- La batalla del castillo de Itter.
- El teclado del iPhone.
- La pantalla táctil.
- El gancho del metro.

Catálogo visual de todo lo nuevo: `catalogo/catalogo_v126.jpg`. Ejemplo ejecutable: `ejemplo_demo_v126/`.

---

## 1. Fórmula de guion (todas las referencias la siguen)

| Paso | Qué es | Ejemplo de las referencias |
|---|---|---|
| 1. Gancho (≤ 2 s) | Pregunta o dato que parece imposible, en segunda persona | «¿Por qué…?», «Mil botellas para tu fiesta, y una está envenenada.» |
| 2. Giro | Corrige la intuición: «No es X, es Y» | «No es que lo hayas olvidado, es que nunca llegó a grabarlo.» |
| 3. Metáfora cotidiana | Un objeto conocido explica el mecanismo y se mantiene en todo el vídeo | cerradura y llave = receptor; grabadora = hipocampo; rejilla de cables = pantalla |
| 4. Mecanismo en 2-4 pasos | Cada paso, una frase y una imagen; con cifras concretas | «Con 2 catadores, 4 combinaciones; con 10, 1.024.» |
| 5. Consecuencia | Lo sorprendente que se deduce | «Por eso la pantalla se vuelve loca cuando llueve.» |
| 6. Remate | Vuelve al gancho con una frase redonda | «Sienta tan bien por lo mismo que mata.» |
| 7. Llamada a compartir | Siempre igual: «Envíaselo a ese amigo que…» + un tipo de persona concreto | «…que se sabe de memoria la Segunda Guerra Mundial.» |

**Ritmo:**

- Duración de 45 a 70 s (v1.27), a unas 3 palabras por segundo, con 3-4 pausas dramáticas de 0,4-1,0 s antes de cada revelación.
- Frases cortas, casi sin subordinadas.
- Segunda persona («tu cerebro», «tu móvil»).

**Datos:**

- Una cifra por frase como máximo, y siempre con unidad.
- Cada dato lleva su fuente en `FUENTES_Y_DECISIONES.md`.

---

## 2. Reglas visuales extraídas

1. **Una idea visual por frase.** Cada vez que la voz cambia de idea, cambia la imagen. Sin cortes bruscos: la cámara se acerca, se aleja o transforma un objeto en el siguiente. Las referencias tienen de 0 a 7 cortes en 30-97 s.
2. **Metáfora sostenida.** El mismo objeto metafórico vuelve en varios planos: la cerradura aparece en el gancho, en el mecanismo y en el remate.
3. **Personificación.** Moléculas, órganos y objetos llevan cara (`P.character`, `P.face`). El estado de ánimo cuenta la historia: dolor = bola de pinchos enfadada; placer = bola naranja feliz.
4. **Texto en pantalla mínimo.** Solo etiquetas de 1-3 palabras (`P.tag`, píldora oscura con líneas guía) y cifras grandes (`P.statBig`, `P.hud`). El resto lo dicen la voz y los subtítulos.
5. **Subtítulos arriba**, palabra a palabra (estilo `ios`):
   - la palabra que suena, en blanco;
   - lo ya dicho, en gris;
   - lo que falta, muy tenue;
   - la palabra clave, con recuadro de selección azul y asas redondas;
   - si ayuda, un icono vectorial junto a la palabra clave (`capIcons: { mojadas: 'gota' }`).
6. **Cifras como contador.** Los números cambian ante el espectador: contadores HUD, barras que crecen, cuadrículas de pictogramas que se rellenan.
7. **Personas reales = fichas.** En historia, foto en ficha tipo polaroid con nombre (`P.dossier`), «?» para los que aún no se han presentado y un sello que golpea (`P.stamp`).
8. **Cierre de compartir.** Un móvil con la vista previa del propio vídeo y la hoja de compartir. El dedo toca un contacto (aparece el visto azul), luego «Enviar», y queda «✓ Enviado» (`P.ctaShare` + `FX.compartir`).
9. **Sonido:**
   - un efecto por cada cambio visual: toque, pop, whoosh, sello…;
   - música discreta bajo la voz, que manda (sidechain automático);
   - −14 LUFS.

---

## 3. Estilos

Se eligen con `PL.make({ estilo: '…' })`, que fija piel, subtítulos y posición. El fondo se pinta con `P.fondo(ctx, t)`.

| Estilo | Para qué temas | Aspecto | Subtítulos | Bloques típicos | Referencia de origen |
|---|---|---|---|---|---|
| `cartoon` | salud, química, biología, para todos los públicos | degradados vivos (morado, turquesa) con bokeh | `ios` arriba | `P.character`, `P.keyLock`, `P.icon` relleno | placer/fentanilo |
| `noche` | cuerpo humano, fiesta, memoria, misterio | casi negro con bokeh de colores y partículas | `ios` arriba | `P.filmStrip`, `P.recBadge`, `P.scrCamera`, `P.scrAlert` | alcohol y memoria |
| `blueprint` | lógica, matemáticas, datos, puzzles | plano técnico azul con cuadrícula, letra monoespaciada | `mono` arriba (capY 430), clave en amarillo | `P.hud`, `P.iconGrid`, `P.dotMatrix`, `P.barsGrow`, `P.clockBP` | 1.000 botellas |
| `dossier` | historia, guerra, crimen, biografías | documental oscuro, mapa cenital de bosque | `ios` arriba | `P.mapTop`, `P.dossier`, `P.stamp`, `P.emblem`, `P.scope` | castillo de Itter |
| `producto` | cómo funciona un objeto cotidiano | negro con resplandor cálido y motas | `ios` arriba | `P.render3` (3D), `P.tag`, flechas | gancho del metro |
| `tecno` | electrónica, pantallas, internet | gris carbón con brillos cian y dorados | `ios` arriba | `P.layerStack` (campo y lecturas), `P.keyboardUI`, `P.smartphone` | teclado, pantalla táctil |
| `asombroteca` | estándar del canal (v1.27) | piel «plana» | `ios` arriba (capY 420), una palabra clave por frase | todos los anteriores | episodios 1-7, ahora en zona segura |
| `viral` | alias de `noche` | | | | |

**Combinar estilos dentro de un vídeo** (como hace la demo):

- Cada escena puede pintar otro fondo: `P.fondo(ctx, t, 'blueprint')`.
- Si necesita los colores de otra piel, cámbiala solo durante esa escena: `PL.setSkin('blueprint')` al empezar el `draw` y `PL.setSkin('cartoon')` al terminar.
- Mantén un estilo principal y cambia solo con motivo, por ejemplo al pasar de la metáfora a los datos.

---

## 4. Bloques nuevos de la v1.26 (resumen)

Firmas completas en `INSTRUCCIONES_PLANTILLA.md`, sección v1.26.

- **Estilo y montaje:** `P.fondo`, `P.bokeh`, `P.motes`, `P.gridBP`, `PL.kit(A)` (quita el código repetido de cada episodio), `P.marca` (nombre del canal configurable) y `P.mini` (una escena reducida dentro de un rectángulo).
- **Interfaz:**
  - `P.avatar` (persona ilustrada por semilla);
  - pantallas de móvil para `P.smartphone`: `P.scrShare`, `P.scrChat`, `P.scrLock`, `P.scrAlert`, `P.scrCamera`;
  - `P.keyboardUI` y `P.ctaShare` (cierre completo).
- **Datos:** `P.hud`, `P.iconGrid`, `P.dotMatrix`, `P.barsGrow`, `P.statBig`, `P.clockBP` y `P.icon` (49 iconos: `P.ICONOS`).
- **Personajes y metáforas:** `P.face`, `P.character` (14 tipos), `P.keyLock`, `P.filmStrip` y `P.recBadge`.
- **Historia:** `P.mapTop` (bosque, caminos, lugares, tropas y rutas), `P.dossier`, `P.stamp`, `P.emblem` y `P.scope`.
- **Tecnología:** `P.layerStack` (corte por capas con campo eléctrico y lecturas que bajan al tocar).
- **3D de producto:**
  - mallas: `P.mesh.box`, `extrude`, `cyl`, `sphere` y `lathe`;
  - render: `P.render3`, con luz suave, sombras de contacto, superficies de apoyo y pintura sobre caras.
- **Sonido:** `FX.toque`, `FX.compartir`, `FX.llave`, `FX.latido`, `FX.chispa`, `FX.disparos`, `FX.tanque`, `FX.rec`, `FX.alertaMovil`, `FX.personaje` y `FX.pasarPagina`.

---

## 5. Lo que hacemos MEJOR que las referencias

- **Exactitud física y de escala.** Hay comprobaciones automáticas y se rotula «ESQUEMÁTICO» cuando hace falta, en lugar de solo un aspecto bonito.
- **Fuentes y licencias.** Están documentadas en cada proyecto, y las fotos llevan su fecha real y su crédito.
- **Producción automática y reproducible:**
  - los fotogramas se calculan solo a partir del tiempo, así que el resultado es idéntico en cada render;
  - el control de calidad mide formato, sonoridad, pico real, negros, congelados, silencios y la huella de la voz, y comprueba que el render es idéntico.
- **Nitidez.** Se entrega a 1080 × 1920; las referencias están a 720 × 1280.
- **Ningún objeto flota.** Las sombras de contacto en el 3D y las superficies de apoyo lo garantizan.
