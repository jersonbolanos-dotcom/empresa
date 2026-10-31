# V2 · Corrección final (sin reconstrucción)

Copia de seguridad: `09_VERSION_ANTERIOR_V1/04_CODIGO_V1/` (código V1) y `07_OUTPUT/ASOMBROTECA_HELICOPTERO_AUTORROTACION_V1.mp4`.

**Sin cambios:** narración, duración (63,67 s), subtítulos, música, efectos, colores, fondos, transiciones y estructura. La pista de audio del MP4 V2 es **idéntica bit a bit** a la V1: MD5 de la pista decodificada e0dbacdcc344168568466bd991babced en ambas.

## Prioridad 1 · Maniobra de aterrizaje (41,4–49 s)

La trayectoria se calcula por tramos con curvas de Hermite (posición y velocidad continuas), así que no hay saltos:

1. **Aproximación** (41,4–44,0 s): descenso con avance constante, morro levemente abajo.
2. **Flare** (44,0–46,2 s): el morro sube poco a poco por efecto del **cíclico atrás** (panel de mandos CÍCLICO/COLECTIVO). El avance y el descenso se frenan.
3. **Nivelación** (46,2–47,3 s): el morro vuelve a nivel y el rótulo dice «se nivela para tocar el suelo».
4. **Colectivo arriba** (47,3–48,3 s): la palanca sube y aparece el rótulo «la energía del rotor amortigua el contacto». El brillo naranja del rotor se apaga a medida que esa energía se consume, y el indicador ROTOR baja.
5. **Contacto** (48,3 s): los patines tocan el suelo y asientan con un pequeño rebote amortiguado (unos 0,5 s). El rotor sigue girando y se detiene poco a poco después.

Las flechas «avance» (amarilla) y «descenso» (cian) son proporcionales a la velocidad real del dibujo. El helicóptero se agrandó un poco (escala 0,66 → 0,82) para que la maniobra se lea en el celular. El motor sigue apagado; se mantiene el rótulo «recreación conceptual · no es garantía».

## Prioridad 2 · Explicación científica

- **Rueda libre**, en tres estados numerados:
  - **1 · MOTOR APAGADO**: motor con una X y el cubo interior marcado «0».
  - **2 · RUEDA LIBRE**: una holgura amarilla muestra el desacople, con el texto «desacopla el motor de la transmisión».
  - **3 · EL ROTOR SIGUE GIRANDO**: flechas de giro en la transmisión y el mástil.
- **Paso colectivo:**
  - «mismo ángulo menor en TODAS las palas» y «para conservar las RPM del rotor».
  - Dos perfiles, PALA 1 y PALA 2, cambian a la vez sobre su plano de giro, con la nota «el disco no se inclina».
- **Flujo relativo:** flecha amarilla «baja» (el helicóptero) frente a flecha cian «aire» (sube), y el contorno del «DISCO DEL ROTOR» que el aire atraviesa.

## Prioridad 3 · Inicio (0–8 s)

- Nubes en dos profundidades (detrás y delante del helicóptero) y estelas de velocidad, para dar sensación de desplazamiento y parallax.
- Puntos naranjas de potencia viajan del motor al mástil. En «motor» se cortan y se ve un breve destello rojo del sistema propulsor, sin explosión.
- El helicóptero da un pequeño sacudón amortiguado (unos 2 s).
- El indicador MOTOR cae a cero con una X; el indicador ROTOR sigue activo con un brillo cian que pulsa.

## Prioridad 4 · Legibilidad

| Rótulo | Antes | Ahora |
|---|---|---|
| «RUEDA LIBRE» | 50 px | 54 px |
| «PLANO DE GIRO» | 30 px | 40 px (Nunito 900) |
| «ÁNGULO DE PASO» | 32 px | 40 px |
| «BAJAR EL PASO COLECTIVO» | 46 px | 52 px |
| «FLARE» | 64 px | 70 px |
| «PALANCA DEL COLECTIVO» | 32 px | 34 px |

El cierre «SIN MOTOR ≠ SIN CONTROL» y el nombre discreto «ASOMBROTECA» no cambian.
