# Reconstrucción de los JS desde el PDF

- `plantilla.pdf`: fuente original, **sin modificar** (34 páginas).
- `plantilla_texto_extraido_SIN_EDITAR.txt`: copia sin editar del .txt del paquete, con sus saltos de línea visuales.
- `lib/harness.js`, `lib/sound.js` y `styles/product-launch.js`: reconstruidos desde el PDF con `04_CODIGO/tools/reconstruir_desde_pdf.py`.

## Método

El PDF corta visualmente las líneas largas de código, que continúan en el margen izquierdo (x0 = 72 pt). Para cada línea se leyó su geometría con pdfplumber. Una línea se unió con la anterior, con un espacio, cuando se cumplían tres condiciones:

1. empieza en el margen izquierdo;
2. la anterior llega cerca del margen derecho y su primera palabra no habría cabido (x1 + 4 + ancho de la palabra > 523,5 pt);
3. no empieza por `//`, `(function`, `})` ni una valla de código.

La sangría se reconstruyó como round((x0 − 72) / 6,1) espacios. Es una aproximación: la fuente del PDF es proporcional y no afecta a la sintaxis.

## Verificación

- `node --check` pasa en los tres archivos.
- Los tres se ejecutaron en Chromium: H y SOUND funcionan, y el reproductor y el render offline los usan sin errores.
- No se garantiza integridad byte a byte con el original: las líneas en blanco y la sangría exacta no se conservan en el PDF.

## Uso en la producción

`04_CODIGO/lib/harness.js` y `04_CODIGO/lib/sound.js` son copias **idénticas** de estos archivos. Las funciones del estilo se adaptaron a 9:16 en `04_CODIGO/js/estilo_base.js`; la cabecera de ese archivo detalla cada cambio. `styles/product-launch.js` queda aquí intacto como referencia.
