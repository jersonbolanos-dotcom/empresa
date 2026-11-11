# Fuentes y decisiones · ¿Quién guía a esta bandada?

Formato: `bandada` · Plantilla Asombroteca SIN_VOZ 2.4.1 · 38 s (versión anterior en `V1/`).

## Dato que revela la frase final

| Frase | Dato | Fuente |
|---|---|---|
| «Nadie la guía: cada pájaro sigue solo *3 reglas*.» | Una bandada realista surge sin líder si cada individuo sigue tres reglas locales con sus vecinos: separación (no chocar), alineación (volar en la dirección de los vecinos) y cohesión (no alejarse de ellos). En los estorninos reales cada pájaro reacciona a unos 7 vecinos, y no hay ningún pájaro que dirija la bandada | Reynolds, C. W. (1987), «Flocks, herds and schools: A distributed behavioral model», *Computer Graphics* 21(4): 25-34; Ballerini, M. et al. (2008), «Interaction ruling animal collective behavior depends on topological rather than metric distance», *PNAS* 105: 1232-1237 |

## Decisiones

- **Simulación**:
  - `SIM.boids`: 2.400 pájaros en 3D, `H.rng(2)`, 60 pasos/s, con las 3 reglas de Reynolds;
  - la separación se aplica con todos los vecinos a menos de 2 unidades; la alineación y la cohesión, con los primeros 8 vecinos (Ballerini, ~7).
  - La forma de la nube (se estira, se dobla, se enrolla) sale solo de esas 3 reglas.
- **Además de las 3 reglas** (para contar la escena, no para formar la bandada):
  - un borde suave del cielo, para que no se salgan del encuadre;
  - la huida del halcón;
  - al final, la bajada a la percha: los estorninos reales terminan la murmuración bajando a dormir.
- **Halcón**: entra a los 17 s, persigue el centro de la bandada y sigue de largo. Los pájaros a menos de 12 unidades huyen y la nube se abre en ondas y se vuelve a cerrar. Se dibuja como un halcón real visto desde abajo: alas curvas y puntiagudas que aletean, cabeza marcada con pico ganchudo y cola en abanico (~230 px de envergadura).
- **Cámara**: fija, en perspectiva, con el horizonte bajo (y ≈ 1350) para que la nube llene el cielo. Los pájaros son trazos oscuros sobre un cielo de atardecer naranja-rosado, como en las fotos de murmuraciones. Con `FONDO atardecer`, el QC mide un cielo claro (luminancia media de 60 a 180) en lugar de un fondo oscuro.
- **Contador**: pájaros en el cielo (dentro del encuadre y sobre los árboles): sube de ~300 a 2.400 mientras llegan y baja al final, cuando se posan.
- **Sonido**:
  - rumor de alas desde el fotograma 0: un grano de ruido rosa por fotograma, más fuerte cuantos más pájaros hay en el cielo y cuantos más giran;
  - dos silbidos de aire al pasar el halcón;
  - acorde de cierre con la frase.
  - Sin música.
- **Nada flota**: los pájaros vuelan y, al final, se posan en los árboles.
