# Prompt para producir un vídeo nuevo · v1.34 (copiar y pegar en Claude Code)

Rellena lo que va entre corchetes. Usa siempre el mismo chat de Claude Code con la plantilla ya cargada.

---

```
Usa la PLANTILLA ASOMBROTECA (v1.34) para producir un vídeo vertical terminado. No crees otra plantilla: si le falta
algo, amplíala sin romper lo existente (versión nueva en CAMBIOS_PLANTILLA.md).

Antes de empezar, lee: 00_LEEME_PRIMERO.md, GUIA_ESTILOS.md (bloques v1.34, v1.29 y v1.27 primero),
SUPERPROMPT_PLANTILLA_ASOMBROTECA.md, INSTRUCCIONES_PLANTILLA.md y ejemplo_demo_v126/04_CODIGO/js/episodio.js.

DATOS DEL VÍDEO
- Tema: [p. ej. «¿Tu móvil se carga mejor en modo avión?»]
- Estilo: [asombroteca (por defecto) | cartoon | noche | blueprint | dossier | producto | tecno | elige tú]
- Ganchos: [3 hablados (≈ 250 créditos extra) | 3 visuales (0 créditos extra) | solo 1]
- Marca: ASOMBROTECA
- Fotos reales: [ninguna | adjuntas, con su licencia]

AHORRO DE CRÉDITOS (obligatorio, estoy con presupuesto justo)
- UNA sola generación en ElevenLabs: creative_generate_speech con generations_count: 1. Nunca pidas dos tomas.
- Modelo Eleven v4, voz Dan (9F4C8ztpNUmXkdDDbz3J). Pausas con [short pause], «…» y [long pause] (una vez en el cuerpo).
- Guion completo (ganchos incluidos) de 1.300 caracteres como máximo. Dime cuántos caracteres tiene ANTES de generar.
- Nunca regeneres el audio entero. Pausa corta → [PAUSA x] en tramos.txt. Palabra mal dicha → regenera solo ese tramo
  corto y avísame de cuántos caracteres es antes de hacerlo.

CÓMO TRABAJAR
1. GANCHOS: proponme 3 ganchos de ≤ 2 s (contradicción, cifra imposible, algo en juego o desmentir un mito, en segunda
   persona; prohibido «En el año…», «Antes de…»; «Imagina» solo si el peligro llega antes de 2 s). Prioriza la fórmula de
   mis vídeos más vistos (GUIA_ESTILOS v1.34): peligro en un medio de transporte tipo «¿Qué pasa si…?», yo DENTRO de la
   situación («Vas en un avión…») con el peligro en los primeros 2 s, promesa de respuesta («y la explicación es
   sorprendente»), un solo objeto grande y en movimiento desde el fotograma 0 y la pregunta escrita arriba los primeros
   segundos. Para cada gancho, describe también la imagen de los primeros 2 s. ESPERA a que elija UNO.
2. GUION: escríbelo con la fórmula de GUIA_ESTILOS.md, 45-70 s, 3-4 pausas antes de cada revelación, y cierre
   «Envíaselo a ese amigo que…». Verifica cada cifra en 2 fuentes. Enséñamelo con su número de caracteres y ESPERA mi OK.
3. VOZ (una sola toma), POR DEFECTO UN SOLO VÍDEO (v1.34): el gancho que elegí + el cuerpo. En tramos.txt márcalo con su
   letra ([GANCHO B] texto) para que episodio.js dibuje su imagen inicial.
   - Solo si te pido las 3 variantes: los 3 ganchos al principio, separados por «… [short pause] …», y luego el cuerpo,
     todo en la misma generación, marcados [GANCHO A], [GANCHO B] y [GANCHO C].
   Si no puedes guardar el audio en el proyecto, dame el enlace de ElevenLabs y te lo adjunto.
4. Proyecto y alineación:
   python3 PLANTILLA_ASOMBROTECA/tools/nuevo_proyecto.py NOMBRE --estilo ESTILO --marca "ASOMBROTECA" --voz AUDIO
   python3 PLANTILLA_ASOMBROTECA/tools/producir.py NOMBRE voz      (corrige tramos.txt; cifras habladas: 500|quinientos)
   python3 PLANTILLA_ASOMBROTECA/tools/producir.py NOMBRE alinear
5. episodio.js: una idea visual por frase, metáfora sostenida, protagonista grande (≥ 60 % del ancho de la zona segura)
   y escena centrada en la zona segura, sin media pantalla vacía (P.encuadrar; el QC lo marca como FALLO), ≤ 2 etiquetas
   de 1-3 palabras, cifras como contadores, P.ctaShare al final. Ancla tiempos con wa()/wt().
   Los primeros 2 s dibujan el gancho elegido (con 3 variantes, dependen de window.GANCHO).
6. UNA ronda de prueba: producir.py NOMBRE prueba (10-12 instantes). Revisa 07_QC/prueba.jpg: nada encimado en
   transiciones, nada cortado en los bordes, nada flota, pantalla llena. Mándame la hoja antes del render.
7. Render y QC: producir.py NOMBRE video (con 3 variantes: producir.py NOMBRE variantes). El QC debe salir «TODO CORRECTO» en cada
   MP4, con sonido desde el fotograma 0 (≤ 0,5 s de silencio inicial) y ≤ 1 s de silencio final.
8. Entrega en 07_OUTPUT/:
   - el MP4 (<NOMBRE>_FINAL.mp4; con 3 variantes: VARIANTE_A, VARIANTE_B y VARIANTE_C);
   - portada.jpg 1080×1920 (maqueta v1.30): fotograma NÍTIDO del vídeo con la escena principal, texto corto en dos líneas
     arriba (una en rojo) con borde oscuro, etiqueta amarilla pequeña, centrado en x = 540 y dentro del recorte 3:4 (y 240-1680);
   - PUBLICAR.md: título y descripción para YouTube, Facebook, Instagram y TikTok. Gancho como pregunta SIN dar la
     respuesta, invitación a comentar (nunca «dale like» ni «comparte si…»), 3-5 hashtags;
   - FUENTES_Y_DECISIONES.md con las 2 fuentes de cada dato.
```

---

## Variantes rápidas

- **Corregir un vídeo ya hecho:** «Respalda la versión actual en `V1/` y cambia solo esto: …». Luego pasos 6 y 7. No regeneres la voz.
- **Reel sin voz (hipnótico):** usa la plantilla `PLANTILLA_ASOMBROTECA_SIN_VOZ` y su `PROMPT_NUEVO_REEL.md`.
- **Probar ganchos (opcional, si pediste 3 variantes):** sube las 3 variantes a Instagram como «Reel de prueba». A las 24 h, comparte al perfil la que más retuvo en los primeros 3 s y súbela a Facebook, YouTube y TikTok.
