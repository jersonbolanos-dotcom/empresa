# QC · ASOMBROTECA_VIKINGOS.mp4

| Control | Resultado |
|---|---|
| Formato | 1080×1920, 30 fps, H.264 yuv420p + AAC 48 kHz estéreo, 256 kb/s (`ffprobe.txt`) |
| Duración | 117,846 s (voz 116,846 s + 1 s de cierre); 3.536 fotogramas renderizados |
| Tamaño | 81,4 MB (< 100 MB) |
| Reproducción / decodificación completa | ffmpeg decodifica todo el archivo sin errores |
| blackdetect / freezedetect | sin negros ni congelados |
| Sonoridad | −13,8 LUFS integrados; LRA 2,8 LU; pico verdadero −2,3 dBTP. Música ≈ 20 dB por debajo de la voz, con *ducking* |
| Voz | md5 idéntico al archivo subido (1e302aa6cc80b918fc09ef4f27e3da0e): no se alteró, aceleró ni recortó |
| Determinismo | `determinismo.txt`: dos ejecuciones idénticas |
| Retrocompatibilidad v1.13 | RETRO_PENDIENTE |
| Subtítulos | barra (blanco + barra amarilla), `06_SUBTITULOS/subtitulos.srt` (68 bloques); nombres y cifras corregidos |
| Revisión visual | Una ronda de hoja de contacto antes del render (27 fotogramas). Se corrigió: (1) el encuadre del gancho cortaba el barco; (2) las ventanas de Islandia y Groenlandia dejaban fuera las casas y el barco; (3) el navegante era pequeño; (4) la etiqueta de Groenlandia tapaba su punto. Después del render se revisaron 41 fotogramas del MP4 final (`fotogramas_revision/`, `hoja_contacto.jpg`); el rótulo «primer viaje de Colón» se salía del borde y la plantilla ahora lo mantiene dentro del lienzo. Se volvió a renderizar y codificar |
| Revisado en el MP4 | gancho, barco, casco en rayos X, corte de tablas superpuestas, flexión, vela, remos, océano, mapa por etapas, Islandia, Groenlandia, llegada a América, navegación, mapa conceptual, L'Anse aux Meadows (reconstrucción → restos), anillos de 1021, línea temporal, comercio, revelación final y cierre |
