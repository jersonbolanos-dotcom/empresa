# QC · ASOMBROTECA_VIKINGOS_FINAL.mp4 (V2, revisión maestra)

| Control | Resultado |
|---|---|
| Formato | 1080×1920 (9:16), 30 fps constantes, H.264 High@4.1 yuv420p, AAC-LC 48 kHz estéreo 256 kb/s, *faststart* (`ffprobe.txt`). Compatible con Shorts, Reels, TikTok y Facebook |
| Duración | 117,846 s (voz 116,846 s + 1 s de cierre); 3.536 fotogramas |
| Tamaño | 83,0 MB (< 100 MB) |
| Reproducción / decodificación completa | ffmpeg decodifica todo el archivo sin errores |
| Negros / congelados | blackdetect y freezedetect: 0 |
| Silencios accidentales | silencedetect (−50 dB, ≥ 0,5 s): 0 |
| Sonoridad | −13,8 LUFS integrados; LRA 2,8 LU; pico verdadero −2,3 dBTP. Entrada de 40 ms y salida de 0,8 s después de la voz |
| Equilibrio | Música ≈ 20 dB por debajo de la voz con *ducking* (sidechain); efectos con *ducking* suave |
| Voz | md5 idéntico al archivo subido (1e302aa6cc80b918fc09ef4f27e3da0e): sin alterar, acelerar ni recortar; empieza en t = 0,05 s, igual que el original |
| Subtítulos | barra (blanco + barra amarilla), sin cambios, 68 bloques (`06_SUBTITULOS/subtitulos.srt`) |
| Determinismo | `determinismo.txt`: dos ejecuciones idénticas |
| Retrocompatibilidad v1.13.1 | IGUAL en los 9 episodios anteriores (Machu Picchu, Andrómeda, Barco, Pirámides, Represa, Internet submarino, GPS, Aire acondicionado y Microondas) |
| Revisión visual | (1) Una ronda de hoja de contacto antes del render (38 fotogramas). Se corrigió: notas del corte de tablas encima de la sección; nota de conteo encima del rótulo de 993; transición mapa → mar lenta; frase no verificada en el cierre. (2) Tras el primer render se revisaron 54 fotogramas del MP4 y se corrigió la pila de leña de L'Anse aux Meadows (parecía suelta y un tronco flotaba). Se volvió a renderizar. (3) Revisión de 54 fotogramas del MP4 definitivo (`fotogramas_revision/`, `hoja_contacto.jpg`) y de pares de fotogramas consecutivos en la apertura, el corte y la transición mapa → mar |
| Mapas | Rutas por mar sin cruzar tierra (Noruega → Feroe → Islandia; Islandia → cabo Farewell → asentamiento oriental; Groenlandia → estrecho de Davis → Baffin → Labrador → Terranova); rotuladas como «ruta aproximada» frente a «sitio documentado» |
| Datos | 1021 con el estudio de *Nature* (2021); 471 años = 1492 − 1021; Islandia ≈ 870; Groenlandia ≈ 985 (ver `FUENTES_Y_DECISIONES.md`) |
| Respaldo V1 | `07_OUTPUT/V1/`, `05_AUDIO/V1/`, `07_QC/V1/`, `04_CODIGO/V1_respaldo/` |
