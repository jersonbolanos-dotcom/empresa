# Prompt para pedir un reel nuevo (copiar y pegar)

Rellena las tres líneas de arriba y pega todo en Claude Code, junto con la carpeta `PLANTILLA_ASOMBROTECA_SIN_VOZ` (o su zip).

---

**Tema:** _________________ (p. ej., «el corazón de una ballena azul»)
**Formato:** contador · quiz · tamanos · linea · capas
**Estilo:** asombroteca (por defecto) · viral · cartoon · noche · blueprint · dossier · producto · tecno

Hazme un reel SIN VOZ con la plantilla `PLANTILLA_ASOMBROTECA_SIN_VOZ`. Lee primero `00_LEEME_PRIMERO.md`, `INSTRUCCIONES_REEL.md` y el ejemplo del formato elegido en `ejemplos/`.

1. Propón 3 ganchos (pregunta o dato imposible, ≤ 8 palabras) y espera a que elija uno.
2. Crea el reel con `tools/nuevo_reel.py NOMBRE --formato F --estilo E` y escribe `03_GUION/tiempos.txt`:
   - 15-25 s;
   - texto ≤ 8 palabras por pantalla;
   - un efecto en cada aparición;
   - el gancho visible en el fotograma 0;
   - un final que vuelva al principio (bucle).
3. Adapta `04_CODIGO/js/episodio.js` al tema: nada flota, todo con `H.rng` y el texto dentro de la zona segura.
4. Verifica cada dato y anota su fuente en `FUENTES_Y_DECISIONES.md`.
5. Haz UNA hoja de contacto (`producir_reel.py NOMBRE prueba …`, 8-10 instantes) y corrige lo que haga falta.
6. Ejecuta `producir_reel.py NOMBRE todo`, mira la hoja de contacto del MP4, escribe `07_QC/revision_visual.txt` (`nada flota: OK`) y repite `qc` hasta que salga «TODO CORRECTO».
7. Entrégame el MP4 y un resumen en español con los datos usados y sus fuentes.
