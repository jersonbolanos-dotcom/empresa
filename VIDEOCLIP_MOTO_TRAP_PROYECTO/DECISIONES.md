# Videoclip moto · estética gangster / rockstar / dark trap

## Material original (`01_ORIGINAL/`, intacto, md5 2c1260aa653fd304acf742359155e86a)
- 480×854 (9:16), H.264, ~29,83 fps variable, 14,87 s, AAC 48 kHz estéreo (solo ambiente, sin música).
- Una sola toma continua en mano y con poca luz. Recorrido: asiento con logo (0–2 s) → calca «125» →
  calca «FI» (3,5–4,5 s) → faro LED en primer plano (4,5–6 s) → la cámara se aleja (6–8 s) → plano general de la moto (8–14,8 s).
- Limitaciones: baja resolución, ruido de sensor, LED del faro saturado, temblor de mano y desenfoque en movimientos rápidos.

## Decisiones
- **Rejilla musical original a 140 BPM** (`02_CODIGO/timeline.py`): video y audio leen la misma lista de golpes,
  así que todo corte, flash, shake o glitch tiene su sonido en el mismo frame.
- **Remapeo temporal** sobre una versión del original interpolada a 120 fps con flujo óptico (ffmpeg minterpolate):
  cámara lenta limpia (asiento 0,72×, faro 0,6×), whip a ~7× y speed ramp acelerando hasta el drop.
  **Motion blur real**: cada frame promedia los subfotogramas que cubre un obturador de 180°.
- **Estructura (36 beats + cola, 16,0 s)**: intro en negro con destellos del faro → BOOM → asiento → whip →
  «FI» → corte glitch rojo → faro (destellos anamórficos, humo, brasas) → reveal → DROP congelado con «125»
  cromado → beat con glitch en golpes → frenada → póster en duotono negro/rojo con semitono → fundido.
- **Texto**: solo «125» y «FI», que están impresos en la propia moto. No se inventan nombres ni frases; no se usa la marca como título.
- **Color**: curva con pie (negros profundos sin aplastar), desaturación selectiva que conserva el turquesa original
  de la moto y realza los rojos, sombras con matiz carmesí y altas luces metálicas. Se mantienen los colores reales de la moto y los rostros.
- **Formato**: reescalado a 1080×1920 (mismo 9:16, sin deformar) para que la tipografía y los VFX salgan nítidos; 30 fps constantes.
- **Audio**: se elimina la pista original. Todo el diseño sonoro se sintetiza por código (`audio.py`): booms,
  sub-drops, 808 con glide y tape-stop, impactos metálicos, risers, reverse impacts, whooshes con paneo, glitch con
  bitcrush, interferencia de radio, drone oscuro con sidechain y hueco de silencio antes del drop. Sin muestras ni música con copyright.
  Graves en mono por debajo de 120 Hz.

## Reproducir
```
cd 02_CODIGO
ffmpeg -i ../01_ORIGINAL/VID-20261115-WA0000.mp4 -an -vf "fps=30,minterpolate=fps=120:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,format=rgb24" -f rawvideo src120.rgb
python3 video.py src120.rgb video_sin_audio.mp4        # ~3 min con 4 núcleos
python3 audio.py ../03_AUDIO/diseno_sonoro_premaster.wav
# máster: loudnorm 2 pasadas (-14 LUFS, lineal) + alimiter 0.84 → diseno_sonoro_master.wav
ffmpeg -i video_sin_audio.mp4 -i ../03_AUDIO/diseno_sonoro_master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart ../04_FINAL/VIDEOCLIP_MOTO_TRAP_1080x1920.mp4
```
