# PLANTILLA ASOMBROTECA · Léeme primero

Es la plantilla oficial para **todos los videos** de Asombroteca: verticales 1080×1920, con tu voz original, subtítulos palabra a palabra y efectos de sonido. Se adapta a cualquier tema porque el motor es fijo y cada video solo cambia su lista de escenas.

## Qué hay dentro

| Carpeta o archivo | Para qué sirve |
|---|---|
| `SUPERPROMPT_PLANTILLA_ASOMBROTECA.md` | Prompt para pegar a Claude Code con tu audio y tu tema. Produce el video completo con esta plantilla. |
| `INSTRUCCIONES_PLANTILLA.md` | Reglas, estructura narrativa, subtítulos, sonido, pieles, bloques, paso a paso, control de calidad y cómo ampliar la plantilla. |
| `CAMBIOS_PLANTILLA.md` | Historial de lo que se va añadiendo a la plantilla. |
| `catalogo/catalogo.png` y `catalogo.html` | Todos los bloques visuales en las dos pieles: «plana» (ilustración) y «oscura» (editor técnico). |
| `motor/plantilla.js` | El motor. No se toca entre videos. |
| `lib/` | H y SOUND (sin modificar). |
| `fonts/` | Tipografías embebidas, con sus licencias. |
| `tools/` | Preparar voz (pausas y Whisper), alinear, subtítulos, build, capturar fotogramas, render, sonido y hoja de contacto. |
| `nuevo_video/` | Carpeta base vacía para un video nuevo. Su `episodio.js` está comentado paso a paso. |
| `ejemplo_submarino/` | Video completo de referencia: «El submarino que no volvió», con voz y foto real. |

## Uso rápido

1. Copia `nuevo_video/` con el nombre de tu video.
2. Pon tu audio en `01_ENTRADA/audio/`.
3. Abre Claude Code en esta carpeta y pega `SUPERPROMPT_PLANTILLA_ASOMBROTECA.md`, completando el tema y, si quieres, la piel.

## Ver el ejemplo

```
cd ejemplo_submarino/04_CODIGO
python3 -I ../../tools/build.py
```

Abre `index.html` en el navegador. Tiene reproductor con play, barra de tiempo, sonido y loop.

## Requisitos

- Node con Playwright y Chromium.
- ffmpeg.
- Python 3.
- Opcional, para transcribir: `pip install sherpa-onnx numpy`. El modelo Whisper se descarga solo.
