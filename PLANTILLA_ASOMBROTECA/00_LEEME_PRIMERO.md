# PLANTILLA ASOMBROTECA · Léeme primero

Motor para producir vídeos verticales explicativos terminados:

- 1080 × 1920, 30 fps, H.264 + AAC;
- la voz original como reloj;
- subtítulos palabra a palabra;
- animación por código;
- música y efectos sintetizados;
- control de calidad automático.

Sirve para **cualquier tema y cualquier canal**. El motor es fijo y cada vídeo solo escribe su lista de escenas (`episodio.js`).

## Empezar en 4 pasos

Desde la carpeta que contiene `PLANTILLA_ASOMBROTECA`:

```
python3 PLANTILLA_ASOMBROTECA/tools/nuevo_proyecto.py MI_VIDEO --estilo cartoon --marca "MI CANAL" --voz mi_voz.mp3
python3 PLANTILLA_ASOMBROTECA/tools/producir.py MI_VIDEO_PROYECTO voz       # revisa luego 03_GUION/tramos.txt
python3 PLANTILLA_ASOMBROTECA/tools/producir.py MI_VIDEO_PROYECTO alinear
python3 PLANTILLA_ASOMBROTECA/tools/producir.py MI_VIDEO_PROYECTO todo      # render + QC → 07_OUTPUT/MI_VIDEO_FINAL.mp4
```

- El proyecto recién creado ya produce un vídeo válido: una escena provisional por tramo de voz y el cierre de compartir.
- Después se sustituyen las escenas provisionales por las reales en `04_CODIGO/js/episodio.js`.
- Para revisar antes del render completo: `producir.py MI_VIDEO_PROYECTO prueba 1 5 9 …` crea la hoja de contacto `07_QC/prueba.jpg`.

## Usarla en otro chat o compartirla con otra persona

1. Copia la carpeta `PLANTILLA_ASOMBROTECA` (o su zip `PLANTILLA_ASOMBROTECA_KIT.zip`) junto a tu audio.
2. Pega en Claude Code el contenido de **`PROMPT_NUEVO_VIDEO.md`**, rellenando el tema, el estilo y la marca.
3. Opcional, para que cada chat nuevo recuerde las reglas: copia `CLAUDE_MEMORIA_PROYECTO.md` a la raíz de tu repositorio con el nombre `CLAUDE.md`.

## Qué hay dentro

| Archivo o carpeta | Para qué sirve |
|---|---|
| `PROMPT_NUEVO_VIDEO.md` | Prompt de copiar y pegar para producir un vídeo en cualquier chat. |
| `GUIA_ESTILOS.md` | Fórmula de guion viral, reglas visuales, los 8 estilos y cuándo usar cada uno. |
| `SUPERPROMPT_PLANTILLA_ASOMBROTECA.md` | Reglas de producción y «reglas aprendidas» (se amplía con cada vídeo). |
| `INSTRUCCIONES_PLANTILLA.md` | Firmas y uso de TODOS los bloques `P.*` y efectos `FX.*`, por versión. |
| `CAMBIOS_PLANTILLA.md` | Historial de versiones. |
| `catalogo/catalogo_v126.jpg` | Captura de los estilos y bloques nuevos (y `catalogo.png` con los de la v1.0). |
| `ejemplo_demo_v126/` | Vídeo de ejemplo completo con los recursos nuevos (voz sintética de demostración). |
| `ejemplo_submarino/` | Ejemplo clásico de la v1.0. |
| `motor/plantilla.js` | El motor: bloques, estilos, subtítulos, transiciones, sonido. No se toca entre vídeos (solo se amplía). |
| `lib/` | `H` (utilidades) y `SOUND` (síntesis de audio). No se modifican. |
| `fonts/` | Tipografías embebidas, con sus licencias. |
| `tools/` | `nuevo_proyecto.py`, `producir.py`, `determinismo.js`, preparar voz (Whisper), alinear, subtítulos, build, fotogramas, render, audio, hoja de contacto y voz sintética `voz_kokoro/`. |
| `tools/plantillas_proyecto/` | Esqueleto que copia `nuevo_proyecto.py`: `index.src.html`, `episodio.js` y la documentación del proyecto. |
| `nuevo_video/` | Esqueleto antiguo (v1.0), que se conserva por compatibilidad. Usa `nuevo_proyecto.py`. |

## Estilos (`--estilo`)

| Estilo | Para qué temas |
|---|---|
| `cartoon` | Salud, química, biología. |
| `noche` | Cuerpo humano, memoria, misterio. |
| `blueprint` | Lógica, matemáticas, datos. |
| `dossier` | Historia, guerra, crimen. |
| `producto` | Objetos cotidianos en 3D. |
| `tecno` | Electrónica y pantallas. |
| `asombroteca` | Estándar del canal: subtítulos con barra abajo. |

Detalles y capturas en `GUIA_ESTILOS.md` y `catalogo/catalogo_v126.jpg`.

## Requisitos

- Python 3, Node con Playwright y Chromium, y ffmpeg.
- Opcional, para transcribir la voz: `pip install sherpa-onnx numpy`. El modelo Whisper se descarga solo y se borra al terminar.

## Reglas que no se negocian

- La voz no se toca: se comprueba su md5.
- Cada fotograma depende solo del tiempo: se usa `H.rng`, nunca `Math.random`.
- Nada flota.
- Los datos llevan fuente.
- Las fotos llevan su licencia y su fecha real.
- −14 LUFS y pico ≤ −1 dBTP.
- La plantilla solo se amplía: nunca se rompe lo que ya funciona.
