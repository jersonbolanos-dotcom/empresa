# Prompt para pedir un reel de simulación nuevo (copiar y pegar)

Rellena las dos líneas de arriba y pega todo en Claude Code, junto con la carpeta `PLANTILLA_ASOMBROTECA_SIN_VOZ` (o su zip).

---

**Dato de ciencia que esconde:** _________________ (p. ej., «la desintegración radiactiva sigue una semivida»)
**Formato:** rebote · galton · fourier (o «propón uno nuevo» → se añade a `motor/sim.js`)

Hazme un reel SIN VOZ de simulación con `PLANTILLA_ASOMBROTECA_SIN_VOZ` (v2.4). Lee primero `00_LEEME_PRIMERO.md`, `INSTRUCCIONES_REEL.md` y el ejemplo del formato en `ejemplos/`.

1. Antes de programar, enséñame un plan corto. Debe incluir:
   - el proceso físico (único, continuo y que escala);
   - la pregunta (≤ 6 palabras);
   - el contador;
   - el final incierto y cómo empalma con el inicio;
   - la frase final con el dato y su fuente.
2. Crea el reel con `tools/nuevo_reel.py NOMBRE --formato F` y escribe `03_GUION/tiempos.txt` (25-45 s, MUSICA no o muy_baja).
3. Simulación real y determinista (`H.rng`, nunca `Math.random`). El sonido debe salir de los eventos (`R.asmr`), con un tono según la velocidad o la cantidad. Fondo oscuro, colores vivos, nada flota.
4. Ajusta los `PARAM` en el navegador con `tools/sim_info.js`, para que el desenlace llegue en el último segundo.
5. Mándame UNA hoja de contacto (`producir_reel.py NOMBRE prueba …`, 10-12 instantes) antes del render completo.
6. Con mi OK, ejecuta `producir_reel.py NOMBRE todo`, revisa la hoja del MP4, escribe `07_QC/revision_visual.txt` y repite `qc` hasta «TODO CORRECTO».
7. Entrégame el MP4 y un resumen en español con el dato y su fuente.
