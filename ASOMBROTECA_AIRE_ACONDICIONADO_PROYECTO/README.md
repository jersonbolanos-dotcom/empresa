# ASOMBROTECA · ¿Cómo funciona realmente un aire acondicionado?

- **Video:** `07_OUTPUT/ASOMBROTECA_AIRE_ACONDICIONADO_V1.mp4` (1080×1920, 30 fps, 88 s). Miniatura en `07_OUTPUT/miniatura.jpg`.
- **Base:** `PLANTILLA_ASOMBROTECA` v1.4. Este episodio añadió a la plantilla los bloques `fluid`, `airStreaks`, `fanAxial`, `fanCross` y `path`, y los FX de refrigeración.
- **Concepto:** seguir el viaje del calor por **un único split espacialmente coherente**:
  - habitación con la unidad interior;
  - muro exterior con ventana;
  - unidad exterior en el suelo.

  La cámara recorre ese mismo mundo: habitación → corte de la unidad interior → tubería transparente → circuito completo → evaporador (con corte del tubo) → ventilador y aire → succión a través del muro → compresor rotativo (corte) → condensador (corte) → válvula de expansión (corte) → ciclo completo → regreso a la habitación.

| Carpeta | Contenido |
|---|---|
| `01_ENTRADA/audio/` | Narración original (ElevenLabs Starter, con licencia comercial), sin modificar |
| `03_GUION/` | `tramos.txt` (21 tramos) y la transcripción de Whisper |
| `04_CODIGO/` | `index.src.html` (motor en `../PLANTILLA_ASOMBROTECA`), `js/episodio.js`, `js/datos.js`, `alineacion.json` |
| `05_AUDIO/` | `voz_original.mp3`, `musica_original.wav`, `efectos_sonido.wav`, `mezcla_final.wav` |
| `06_SUBTITULOS/` | `subtitulos.srt` |
| `07_QC/` | `QC.md`, ffprobe, determinismo, render.log, hoja de contacto y fotogramas de revisión |
| `FUENTES_Y_DECISIONES.md` | Ciencia representada, fuentes y decisiones |

**Reproducir**, desde `04_CODIGO`:

```
python3 -I ../../PLANTILLA_ASOMBROTECA/tools/build.py
node ../../PLANTILLA_ASOMBROTECA/tools/render.js index.html frames 4
node ../../PLANTILLA_ASOMBROTECA/tools/audio.js index.html stems
```

Luego se mezcla con ducking y se codifica como indica `INSTRUCCIONES_PLANTILLA.md`.
