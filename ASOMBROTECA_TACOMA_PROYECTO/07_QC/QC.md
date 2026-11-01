# QC · ASOMBROTECA_TACOMA_NARROWS_FINAL.mp4 (V2 · plantilla v1.17.1)

Versión anterior respaldada en `07_OUTPUT/V1/`, `07_QC/V1/`, `05_AUDIO/V1/` y `04_CODIGO/V1/episodio.js`.

## Verificación técnica (ffprobe / ffmpeg sobre el MP4 final)
| Prueba | Resultado |
|---|---|
| Contenedor / códecs | MP4 · H.264 High@4.1 yuv420p · AAC LC 48 kHz estéreo 192 kb/s · sin marcas de agua |
| Resolución / fps / fotogramas | 1080×1920 · 30 fps · 3153 fotogramas |
| Duración | 105,124 s (voz 104,124 s + 1 s de cola) |
| Tamaño | 72,7 MB (< 100 MB) |
| Decodificación completa | 0 errores |
| blackdetect (≥ 0,3 s) | 0 tramos negros |
| freezedetect (n 0,001, ≥ 2,5 s) | 0 congelados |
| silencedetect (−45 dB, ≥ 1,5 s) | 0 silencios |
| Sonoridad (ebur128) | −14,0 LUFS · LRA 2,5 LU · pico verdadero −1,4 dBFS |
| md5 de la voz | bbca75c5ead25b6ffb62c5f0492d9eff = entrada (voz original intacta; no se sustituyó ningún fragmento) |
| Determinismo | t = 5,3 · 17,9 · 41 s: mismo md5 en orden directo e inverso |
| Retrocompatibilidad | Solo cambian bloques v1.17 (puente colgante), que ningún otro episodio usa (comprobado con grep) |

## Inspección visual (hoja de contacto de 34 fotogramas + secuencias cada 0,2 s en `secuencias/`)
- Fotografía 1 (calzada ondulada): 18,4–24,2 s, tarjeta documental con marco, sombra, «ARCHIVO HISTÓRICO» y «TACOMA NARROWS · 1940»; persona y carretera visibles; reconstrucción atenuada detrás.
- Bandera: cápsula «TACOMA, WASHINGTON · EE. UU.» desde «Estados Unidos» (20,1 s) hasta 24,1 s, bajo la foto, sin taparla.
- Línea de tiempo 1-jul → 7-nov-1940 en el mismo bloque, debajo, sin solaparse.
- Oscilación vertical en plano lateral de medio vano con la torre en cuadro («la torre no se mueve»); torsión desde la calzada con eje longitudinal discontinuo y flechas de borde; bordes izquierdo/derecho en el plano de cuarto de vano.
- Mecanismo con secuencia causal numerada 1–5 y momento aerodinámico centrado en la sección.
- Colapso: fallas locales → tramo central → tramos adyacentes, con salpicaduras; torres en pie. Fotografía 2 («COLAPSO REAL · 7 NOV 1940») de 82,8 a 87,3 s con acercamiento lento a la zona dañada, como evidencia tras la reconstrucción.
- Textos dentro de márgenes; las tarjetas no tapan los subtítulos; «RECONSTRUCCIÓN» identifica las escenas animadas.

## Pendiente antes de publicar
- **Derechos de las dos fotografías: no verificados** (ver FUENTES_Y_DECISIONES.md). El video NO debe considerarse listo para publicar hasta confirmar su licencia o sustituirlas por copias con licencia adecuada.
- No hay ninguna corrección de audio pendiente: la frase sobre el viento ya es correcta en la grabación.

## Límites conocidos
- Motor 3D ligero (polígonos planos con niebla), no render físico.
- Flujo de aire didáctico (no CFD).
- La secuencia exacta de caída de cada tramo es una reconstrucción plausible basada en descripciones históricas.
