# Prompt para producir un vídeo nuevo (copiar y pegar en cualquier chat de Claude Code)

Rellena lo que va entre corchetes. Adjunta al chat:

- la carpeta o el zip de la plantilla (`PLANTILLA_ASOMBROTECA`);
- tu audio de narración;
- si quieres, imágenes de referencia.

---

```
Usa la PLANTILLA ASOMBROTECA que te adjunto (carpeta PLANTILLA_ASOMBROTECA o su zip) para producir un vídeo vertical
terminado. No crees otra plantilla: si le falta algo, amplíala con bloques nuevos (versión nueva en CAMBIOS_PLANTILLA.md)
sin romper lo existente.

Antes de empezar, lee en este orden:
  1. PLANTILLA_ASOMBROTECA/00_LEEME_PRIMERO.md
  2. PLANTILLA_ASOMBROTECA/GUIA_ESTILOS.md
  3. PLANTILLA_ASOMBROTECA/SUPERPROMPT_PLANTILLA_ASOMBROTECA.md (reglas y «reglas aprendidas»)
  4. PLANTILLA_ASOMBROTECA/INSTRUCCIONES_PLANTILLA.md (firmas de todos los bloques)
  5. PLANTILLA_ASOMBROTECA/ejemplo_demo_v126/04_CODIGO/js/episodio.js (ejemplo completo)

DATOS DEL VÍDEO
- Tema: [p. ej. «¿Por qué crujen los nudillos?»]
- Audio: [nombre del archivo | «genéralo con ElevenLabs»]. Si lo adjunto, es la voz original: no se modifica, ni se acelera, ni se recorta; marca el tiempo de todo.
- Estilo: [asombroteca (por defecto) | cartoon | noche | blueprint | dossier | producto | tecno] (o «elige tú el más adecuado»)
- Canal / marca al final: [ASOMBROTECA u otro nombre]
- Referencias o fotos reales: [ninguna | adjuntas, con su licencia]

REGLAS v1.27 (mandan sobre todo lo demás): zona segura de Instagram (texto solo en 220 ≤ y ≤ 1450 y x ≤ 940, subtítulos
arriba), gancho sin contexto y con movimiento desde el fotograma 0, ángulo personal (tu móvil, tu casa, tu cuerpo), pantalla
limpia (sin título fijo, ≤ 2 etiquetas de 1-3 palabras), 3-4 pausas dramáticas de 0,4-1,0 s (se pueden alargar con
«[PAUSA x]» en tramos.txt, v1.28), 45-70 s, y cierre
«Envíaselo a ese amigo que…» con P.ctaShare (nunca «Sigue a Asombroteca»).

CÓMO TRABAJAR
0. GANCHOS: antes de escribir el guion completo, proponme 3 ganchos (contradicción, cifra imposible o algo en juego, en
   segunda persona; prohibido empezar con «Imagina», «En el año…», «Antes de…», «Hace mucho…») y ESPERA a que elija uno.
0b. VOZ (si no la adjunto): escribe el guion con 3-4 pausas justo antes de cada revelación o dato fuerte y genérala con el
   conector de ElevenLabs: modelo Eleven v4, voz Dan (9F4C8ztpNUmXkdDDbz3J). v4 no acepta <break>: usa [short pause],
   [long pause] (una sola vez) y puntos suspensivos. En 03_GUION/tramos.txt las etiquetas entre corchetes se pueden dejar:
   se quitan solas y nunca salen en los subtítulos. Si no puedes guardar el audio dentro del proyecto, dame el enlace de
   ElevenLabs para descargarlo y te lo adjunto.
0c. PAUSAS EN POSPRODUCCIÓN (v1.28): si una pausa de la voz se queda corta, NO regeneres la voz: en 03_GUION/tramos.txt
   pon una línea que sea solo «[PAUSA x]» (x de 0.3 a 1.0 s) entre los dos tramos. Se inserta silencio exacto, los tramos
   de voz no se tocan y todos los tiempos siguientes (alineación, subtítulos) se desplazan solos. Un valor fuera de rango o
   una «[PAUSA x]» dentro de una línea de texto da ERROR; las demás etiquetas entre corchetes se quitan sin más.
1. Crea el proyecto:  python3 PLANTILLA_ASOMBROTECA/tools/nuevo_proyecto.py NOMBRE --estilo ESTILO --marca "MARCA" --voz AUDIO
2. Voz:      python3 PLANTILLA_ASOMBROTECA/tools/producir.py NOMBRE_PROYECTO voz
   Corrige 03_GUION/tramos.txt (una línea por tramo de voz; cifras en forma hablada: 500|quinientos) y después:
             python3 PLANTILLA_ASOMBROTECA/tools/producir.py NOMBRE_PROYECTO alinear
3. Escribe 04_CODIGO/js/episodio.js con la fórmula de GUIA_ESTILOS.md:
   una idea visual por frase, una metáfora sostenida, personajes con cara si encaja, etiquetas de 1 a 3 palabras, cifras
   como contadores y el cierre «Envíaselo a ese amigo…» con P.ctaShare. Ancla los tiempos a palabras con wt(tramo, 'palabra').
4. UNA ronda de prueba:  python3 PLANTILLA_ASOMBROTECA/tools/producir.py NOMBRE_PROYECTO prueba 1 4 8 …   (10-12 instantes)
   Revisa la hoja 07_QC/prueba.jpg y corrige lo que se vea mal (textos tapados, objetos fuera de cuadro, nada flota).
5. Render y control:  python3 PLANTILLA_ASOMBROTECA/tools/producir.py NOMBRE_PROYECTO todo
   El QC debe salir «TODO CORRECTO»: 1080×1920, 30 fps, H.264 + AAC, −14 LUFS, pico ≤ −1 dBTP, voz intacta (md5 de cada
   tramo), determinista, zona segura, ≤ 2 etiquetas, sin título fijo, gancho sin contexto, movimiento desde el fotograma 0,
   cierre de compartir, ≤ 90 s (avisa si dura menos de 45 s o más de 75 s).
6. Documenta las fuentes de cada dato en FUENTES_Y_DECISIONES.md y las licencias de las imágenes en CREDITOS_IMAGENES.md.
7. Si añadiste bloques a la plantilla: anótalos en CAMBIOS_PLANTILLA.md e INSTRUCCIONES_PLANTILLA.md y, si sirve, añade una
   «regla aprendida» al SUPERPROMPT.

ENTREGA
El MP4 final (07_OUTPUT), la hoja de contacto, el informe de QC y un resumen en español de lo hecho.
```

---

## Variantes rápidas

- **Corregir un vídeo ya hecho:**
  - Pide: «Respalda la versión actual en carpetas `V1/` y cambia solo esto: …».
  - Después repite los pasos 4 y 5.
- **Sin voz propia (solo para pruebas):** `tools/voz_kokoro/` genera una voz sintética con licencia comercial (Apache 2.0).
- **Otro canal:** cambia `--marca`. La plantilla no lleva logos; solo el nombre discreto al final (`P.marca`).
