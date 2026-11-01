# Fuentes y decisiones · ¿Por qué un barco de acero de miles de toneladas no se hunde?

## Audio
- **Narración original:** `01_ENTRADA/audio/voz_original_barco.mp3` (96,026 s), sin modificar. Su md5 es idéntico al del archivo subido.
- **Transcripción:** Whisper-small local, que coincide con el guion de referencia. Se corrigió «Sombroteca» → «Asombroteca» y la puntuación (solo en el texto de los subtítulos). Hay 25 tramos.

## Cifras en pantalla
| En pantalla | Dato y fuente |
|---|---|
| «el acero es ≈ 7,85 veces más denso que el agua dulce» | Acero al carbono ≈ 7.850 kg/m³; agua dulce ≈ 1.000 kg/m³ (el agua de mar ≈ 1.025 kg/m³). Valores de referencia de ingeniería |
| «los mayores portacontenedores: ≈ 400 m de eslora» | La clase de 24.000 TEU (p. ej. MSC Irina) mide 399,99 m |
| «+ 2.000 años» · «Arquímedes de Siracusa (s. III a. C.) · Sobre los cuerpos flotantes» | Arquímedes (c. 287–212 a. C.); su tratado *Sobre los cuerpos flotantes* enuncia el principio |
| Barras de densidad: acero ≈ 7,85 · agua 1 · barco (promedio) «menos de 1» | El valor del barco es cualitativo, porque depende de la carga; no se inventa una cifra |

## Física representada (checklist del prompt)
- **El bloque macizo se hunde:** su peso supera el empuje máximo, el que recibe totalmente sumergido. Se rotula «bloque macizo de acero».
- **El empuje es la resultante de la presión:**
  - Flechas de presión normales a todo el casco sumergido, que crecen con la profundidad.
  - El rótulo dice «las de los lados se compensan»; el agua no empuja solo desde abajo.
- **Agua desplazada:** el volumen sumergido en cian se separa un instante y vuelve. El rótulo dice «volumen desplazado = volumen de la parte sumergida»; el barco no expulsa agua activamente.
- **Empuje = peso del agua desplazada:** la flecha nace en el centro de empuje, que es el centroide del volumen sumergido.
- **Arquímedes:** referencia breve con un vaso con rebosadero y la nota «ilustración conceptual». No se dramatiza la bañera.
- **Macizo ≠ hueco:** el mismo bloque se transforma en casco («misma cantidad de acero, otra forma») y flota. No se dice que la forma por sí sola garantice flotar.
- **Aire interior:** corte longitudinal con mamparos y espacios iluminados. Rótulo: «el aire no empuja como un globo: da mucho volumen con poca masa».
- **Densidad promedio:** masa total ÷ volumen total (acero, carga y espacios). Rótulo: «el acero no cambia: cambia el volumen que ocupa el barco».
- **Hacia el equilibrio:**
  - El calado sigue una aproximación amortiguada al equilibrio.
  - La flecha de empuje es proporcional al volumen sumergido; la de peso es constante.
  - Cuando son iguales: «suma de fuerzas verticales = 0».
  - Se aclara que no volcar depende además del reparto de pesos y de la forma.
- **Más carga:**
  - La grúa de muelle coloca 4 contenedores y el barco baja un poco con cada uno.
  - Se marca la línea de flotación inicial y el volumen sumergido en cian.
  - La marca Plimsoll indica el límite de carga.
- **Inundación:**
  - Vía de agua en un compartimento; el agua llena ese compartimento y parte del vecino.
  - El barco baja y cambia de asiento, pero los mamparos estancos frenan la inundación.
  - Rótulos: «si se inunda demasiado, puede hundirse» y «más peso, menos reserva de flotabilidad». No hay hundimiento catastrófico.
- **Final:** corte del casco, volumen desplazado y flechas EMPUJE = PESO sobre el barco navegando. Se usa «ES SU FORMA… DESPLAZA SUFICIENTE AGUA» en lugar del eslogan simplificado.

## Decisiones creativas
- Paleta del prompt: `#031827`, `#063A5B`, `#1378A8`, `#39D9FF`, `#3D5669`, `#A9C2D1`, `#B7473C`, `#37E6C0` (empuje), `#FF7D65` (peso), `#FFD447`, `#F4FAFF`, `#071522`.
- **Empuje siempre verde cian y hacia arriba; peso siempre rojo coral y hacia abajo.**
- **Continuidad:**
  - La cámara sigue al bloque bajo el agua y, en la oscuridad, aparece encima el casco del portacontenedores.
  - La misma sección transversal sirve para presión, desplazamiento, empuje y equilibrio, y el calado evoluciona sin saltos.
  - El final regresa al portacontenedores del comienzo, ahora al atardecer.
- **Sonido:** bocina del barco, salpicadura y burbujas, crujidos del casco, grúa, golpes de contenedores, agua entrando y un acorde de «equilibrio».

## Mejoras al prompt (para próximos episodios)
1. Pedir que cada fuerza tenga **un color y una dirección fijos** en todo el video (aquí, empuje verde arriba y peso rojo abajo).
2. Para procesos físicos que «se asientan» (equilibrio), pedir un movimiento **amortiguado** en lugar de una parada brusca.
3. Indicar en el guion qué **valor cualitativo** es aceptable cuando no hay una cifra universal (densidad media de un barco).
4. El prompt llegó cortado en la escena 16; el cierre se resolvió con el estándar Asombroteca.

## Mejoras añadidas a la plantilla (v1.9)
- **Bloques:** `seaProfile`, `underwater`, `container`, `cargoShip`, `hullSection`, `forceArrow`, `pressureArrows`, `splash`, `gantryCrane`, `beaker`, `greek` y `column`.
- **FX:** `chapuzon`, `hundirse`, `casco`, `grua`, `contenedor`, `inundacion`, `bocina` y `equilibrio`.
- Documentados en `CAMBIOS_PLANTILLA.md`, en `INSTRUCCIONES_PLANTILLA.md` y en el catálogo (57 bloques).
