# ASOMBROTECA — SUPERPROMPT MAESTRO PARA CLAUDE CODE
## EPISODIO: ¿CÓMO SE SUMERGE Y EMERGE UN SUBMARINO?
## PLANTILLA OBLIGATORIA: ENGINEERING BLUEPRINT (AI STYLE ATLAS)

Actúa como director científico, animador Canvas/JavaScript, diseñador de sonido y supervisor de postproducción. Crea un explainer cinematográfico vertical con continuidad espacial, basado REALMENTE en la plantilla original incluida. NO hagas diapositivas, infografías estáticas ni una reinterpretación genérica del color azul.

### ARCHIVOS Y PRIORIDAD
1. Lee íntegro `04_PLANTILLA_ORIGINAL/ENGINEERING_BLUEPRINT_AI_STYLE_ATLAS_ORIGINAL.pdf` y su texto extraído (este último puede alterar saltos de línea; NO lo ejecutes como código sin reconstruirlo y probarlo).
2. Conserva el código, bibliotecas, helpers, texturas, trazos, retícula y funciones `H` y `SOUND` cuando existan. Extiende el sistema sin sustituir su identidad. Verifica las firmas reales antes de llamarlas.
3. Detecta la voz en `01_ENTRADA/audio/`; mide duración con ffprobe y sincroniza el video a ese audio. NO generes, sustituyas, alteres ni aceleres la narración. Si la voz dice algo distinto del guion propuesto, toma el audio como autoridad y reporta diferencias; no falsifiques subtítulos.
4. `03_GUION/GUION_PROPUESTO_SUBMARINO.txt` es una propuesta editorial, NO afirmes que es la transcripción aprobada del video previo. Si se aporta audio o guion aprobado, reemplaza esta propuesta solo con autorización o úsala únicamente como referencia.
5. Si se proporciona video de referencia del submarino, úsalo para analizar ritmo y explicación, NO reutilices el MP4 como salida ni copies errores.

### FORMATO Y ESTÉTICA
1080×1920, 9:16, 30 fps, H.264/AAC. Diseño nativo vertical. Engineering Blueprint: planos técnicos azul profundo, líneas cian y blanco, cotas y anotaciones monoespaciadas, textura y trazos dibujados según el PDF original, secciones técnicas del mismo submarino protagonista, visualizaciones de presión/flujo y capas con profundidad. Paleta ORIENTATIVA, no verificada contra el código: fondo #071A2D, azul #0D2B43, cian #69C8E8, blanco #E8F3F7, amarillo #F0B90B, rojo advertencia #FF806E. Mantén continuidad de geometría entre exterior, corte y macro de tanques.

Inicio inmediato: submarino navegando, cámara lo sigue y abre corte técnico de casco. Sin introducción lenta. Cámara fluida con dolly, match-cut, parallax, macro a válvulas, corte transversal y regreso al exterior; transiciones motivadas por el mismo objeto. Microanimaciones incluso durante pausas de lectura. Sin logos; solamente palabra ASOMBROTECA discreta al final. Subtítulos blancos sin caja opaca, barra amarilla pequeña y zonas seguras para móvil.

### PRECISIÓN CIENTÍFICA OBLIGATORIA
- Flotabilidad = empuje hidrostático de Arquímedes frente al peso; evitar decir que el agua 'empuja hacia arriba por presión desde abajo' sin contexto.
- Los tanques de lastre principales se inundan por ventilación para inmersión: agua entra y aire sale; en superficie se mantienen principalmente con aire. No mostrar agua entrando en la cabina ni inundando el casco resistente.
- Al emerger mediante soplado, aire comprimido desplaza agua de tanques; no confundir con propulsión por hélice. No presentar el soplado como única manera de cambiar profundidad en todas las condiciones.
- Los planos de inmersión generan fuerzas hidrodinámicas cuando el submarino se mueve; no afirmar que por sí solos permiten ascender parado.
- Distinguir trimado/flotabilidad cercana a neutralidad de cambios grandes de lastre. No afirmar que siempre debe hacerse 'más pesado que el agua' de manera absoluta o que desciende en caída libre.
- Mostrar tanque externo al casco resistente, válvulas de ventilación, entradas de agua, burbujas y recorrido de aire comprimido; etiquetas exactas: TANQUE DE LASTRE, VENTILACIÓN, ENTRADA DE AGUA, AIRE COMPRIMIDO, PLANOS DE INMERSIÓN, EMPUJE y PESO.
- No inventar cifras de profundidad, presión, velocidades, capacidades, tiempos ni dimensiones. Si agregas números, deben estar verificados y con fuente.

### STORYBOARD (ADAPTAR A TIEMPOS REALES DE VOZ)
1. Gancho: submarino en mar profundo; se insinúa inmersión y ascenso.
2. Macro del tanque con aire, línea de flotación, equilibrio peso/empuje.
3. Ventilación: válvulas abren; agua entra desde abajo, aire sale por arriba.
4. Corte transversal: tanque se llena, aumenta masa total; descenso controlado.
5. Estado sumergido, cámara acompaña trayectoria; planos de inmersión giran.
6. Macro de aire comprimido entrando al tanque; agua expulsada al exterior.
7. El tanque recupera volumen de aire; disminuye masa; ascenso.
8. Comparativa visual peso/empuje y planos de control, sin tablas estáticas.
9. Emergencia a superficie con salpicaduras, transición a plano de ingeniería.
10. Cierre minimalista 'ASOMBROTECA' sincronizado con la narración.
Cada beat debe corresponder a una frase real de audio. Si el audio no está, storyboard con tiempos provisionales explícitamente marcados.

### IMPLEMENTACIÓN
Construye storyboard HTML VISUAL con 8–10 paneles Canvas que usen las funciones de estilo originales; pide aprobación antes de la producción final salvo instrucción explícita de autonomía. Implementa animación determinista por tiempo: `window.seek(t)`, `window.DURATION`, `window.renderFrame` y controles play/pause/scrub. Evita `Math.random()` por frame; usa generadores con seed. Reutiliza realmente `H` y `SOUND` según sus APIs originales; prueba código antes de exportar. Música ambiental y SFX ORIGINALES independientes: sonar muy sutil, válvulas, agua, aire, mecanismo y burbujas; voz siempre por delante, sin clipping. No generar voz sintética.

Exporta con FFmpeg 1080x1920/30 fps H.264 AAC. Verifica ffprobe, revisa fotogramas de gancho, entrada de agua, descenso, aire comprimido, ascenso y cierre; valida etiquetas y flechas de flujo, legibilidad, transiciones, audio y duración. Entrega código, HTML player, storyboard, archivos de proyecto, MP4 solo si efectivamente se exportó, muestras QC y README. Nunca digas que terminaste un video si solo entregaste código.

### ORDEN DE EJECUCIÓN
Inspeccionar PDF íntegro y audios → reconstruir código fuente y probar funciones H/SOUND → investigar mecanismos físicos → storyboard → aprobación → animación continua → subtítulos y sonido sincronizados → render → QA → paquete final.
