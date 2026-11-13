# ¿Qué pasa si te cae un rayo dentro del carro?

Proyecto creado con la PLANTILLA ASOMBROTECA v1.37 (estilo «noche»).

| Carpeta | Contenido |
|---|---|
| `01_ENTRADA/audio/` | La voz original (el reloj del vídeo; no se modifica). |
| `01_ENTRADA/referencias_originales/` | Fotos o documentos reales, con su licencia en `CREDITOS_IMAGENES.md`. |
| `03_GUION/tramos.txt` | Una línea por tramo de voz (entre pausas). Cifras con su forma hablada: `1945|milnovecientoscuarentaycinco`. |
| `04_CODIGO/js/episodio.js` | Las escenas del vídeo. |
| `05_AUDIO/` | Música y efectos generados + mezcla. |
| `06_SUBTITULOS/subtitulos.srt` | Subtítulos. |
| `07_OUTPUT/` | El MP4 final. |
| `07_QC/` | Control de calidad (informe, hoja de contacto). |

## Producir (desde la carpeta que contiene la plantilla)

```
python3 PLANTILLA_ASOMBROTECA/tools/producir.py QPS_CAP1_RAYO_CARRO_PROYECTO voz        # pausas + transcripción → 03_GUION/tramos_borrador.txt
# revisar 03_GUION/tramos.txt (una línea por tramo; cifras en forma hablada)
python3 PLANTILLA_ASOMBROTECA/tools/producir.py QPS_CAP1_RAYO_CARRO_PROYECTO alinear    # palabras con tiempo → js/datos.js + subtítulos
python3 PLANTILLA_ASOMBROTECA/tools/producir.py QPS_CAP1_RAYO_CARRO_PROYECTO prueba 2 8 15 30   # hoja de contacto rápida → 07_QC/prueba.jpg
python3 PLANTILLA_ASOMBROTECA/tools/producir.py QPS_CAP1_RAYO_CARRO_PROYECTO render     # vídeo completo → 07_OUTPUT/*_FINAL.mp4
python3 PLANTILLA_ASOMBROTECA/tools/producir.py QPS_CAP1_RAYO_CARRO_PROYECTO qc         # informe → 07_QC/QC.md
```
