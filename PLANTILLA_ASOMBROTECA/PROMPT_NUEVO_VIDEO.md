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
- Audio: [nombre del archivo]. Es la voz original: no se modifica, ni se acelera, ni se recorta; marca el tiempo de todo.
- Estilo: [cartoon | noche | blueprint | dossier | producto | tecno | asombroteca] (o «elige tú el más adecuado»)
- Canal / marca al final: [ASOMBROTECA u otro nombre]
- Referencias o fotos reales: [ninguna | adjuntas, con su licencia]

CÓMO TRABAJAR
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
   El QC debe salir «TODO CORRECTO»: 1080×1920, 30 fps, H.264 + AAC, −14 LUFS, pico ≤ −1 dBTP, voz intacta y determinista.
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
