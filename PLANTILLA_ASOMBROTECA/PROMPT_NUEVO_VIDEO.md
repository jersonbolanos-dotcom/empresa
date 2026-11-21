# Prompt para producir un vídeo nuevo · v2.0 «modo viral» (copiar y pegar en Claude Code)

Rellena lo que va entre corchetes. El molde anterior (v1.34) está en `respaldo_v1.44/PROMPT_NUEVO_VIDEO.md`.

---

```
Usa la PLANTILLA ASOMBROTECA v2.0 (modo viral). Lee primero el bloque v2.0 de GUIA_ESTILOS.md.

TEMA: [tema]. Datos solo de fuentes oficiales o científicas, 2 por dato. Mínimo 3 cifras verificadas.

GANCHO
- Proponme 3 frases gancho de 2 a 4 s, cada una con la paradoja completa, y para cada una la SEGUNDA frase (un segundo
  dato que agrande el misterio) y el fotograma 0 (una sola cosa, en primerísimo plano, ya en acción). ESPERA.

GUION (40 a 90 s)
- Cadena de preguntas con re-ganchos cada 8 a 15 s, un «No es X: es Y», analogías de una frase y remate que responda al
  título. Sin promesas genéricas ni metáfora sostenida. Dime caracteres y cifras con sus fuentes. ESPERA.

IMAGEN
- Un solo mundo continuo, cámara que viaja, máximo 3 cortes. Primerísimo plano. El objeto es el protagonista.
- Luz y profundidad en todos los planos. Titulares grandes con palabra de color. Cifras como contadores, con su fuente.
- Último plano igual al fotograma 0.

ESTILO (v2.2)
- estilo: '<nombre>' de la tabla del bloque v2.2 de GUIA_ESTILOS. Cifras con su valor final y quietas ~1,5 s; un solo texto grande a la vez.

SONIDO
- Una sola toma de voz (generations_count: 1). Sin música continua. Silencio antes de cada revelación.

CIERRE (alternar con el vídeo anterior)
- Bucle al fotograma 0, invitación a comentar algo concreto («¿Te atreverías a…? Te leo en los comentarios») o prometer el siguiente vídeo.

ENTREGA
- Hoja de prueba de 15 a 18 fotogramas antes del render, con el fotograma 0 el primero.
- FINAL.mp4 con QC, portada, PUBLICAR.md y FUENTES_Y_DECISIONES.md.
```

## Variante FACEBOOK · modo «historia» (v2.4)

```
Usa la PLANTILLA ASOMBROTECA v2.4 en modo historia: PL.make({ modo: 'historia', estilo: '<nombre>' }).
TEMA: ¿Qué pasa si…? (un vehículo o una catástrofe; alguien en peligro y lo que lo salva).
GUION (85-100 s; revísalo con tools/guion_historia.py y dime duración estimada, caracteres y cifras con fuentes). ESPERA mi OK.
- 0-3 s el peligro (frame 0 + «¿Qué pasa si…?» o «Vas en…»); 3-12 s lo que está en juego con una cifra; 12-20 s promesa abierta;
  20-75 s el mecanismo en 3-4 pasos con frase de tensión; 75-90 s el desenlace; 90-100 s pregunta para comentar + «sigue a Asombroteca».
IMAGEN: 6-8 escenas de 4-8 s con movimiento; nunca el mismo plano más de 6 s; el cierre no repite el fotograma 0.
SONIDO: v2.3; pausas de 0,3-0,5 s antes de cada giro con el fondo en silencio. Una sola toma de voz.
ENTREGA: hoja de prueba, FINAL.mp4 con QC, portada, PUBLICAR.md (Facebook) y FUENTES_Y_DECISIONES.md.
```
