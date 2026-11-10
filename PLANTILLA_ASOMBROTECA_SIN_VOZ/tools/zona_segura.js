// QC de la zona segura de Instagram (v1.27). Recorre el vídeo cada 0,2 s con el registro de textos activado (window.__SAFE_QC)
// y comprueba que ningún subtítulo, etiqueta, cifra, aviso, título o marca cae en y < 220, y > 1450 o x > 940.
// También cuenta cuántas etiquetas hay a la vez (máx. 2) y si aparece un título fijo arriba.
// Uso: node tools/zona_segura.js index.html [paso=0.2]   → imprime un JSON { fuera: [...], maxEtiquetas, titulos, muestras }
const { chromium } = require('playwright'); const path = require('path');
(async () => {
 const file = path.resolve(process.argv[2]), paso = Number(process.argv[3] || 0.2); const b = await chromium.launch();
 const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.addInitScript(() => { window.__HEADLESS = true; window.__SAFE_QC = true; });
 await p.goto('file://' + file); await p.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
 const res = await p.evaluate((paso) => { const S = window.PLANTILLA.P.SAFE, D = window.DURATION, fuera = [], vistos = new Set(); let maxEt = 0, titulos = 0, n = 0;
  for (let t = 0; t < D; t += paso) { window.seek(t); const L = window.PLANTILLA.safeLog() || []; n++; let et = 0;
   for (const [k, x0, y0, x1, y1] of L) { if (k === 'etiqueta' || k === 'aviso') et++; if (k === 'titulo') titulos++;
    const motivo = y0 < S.top ? 'y<' + S.top : y1 > S.bottom ? 'y>' + S.bottom : x1 > S.right ? 'x>' + S.right : x0 < 0 ? 'x<0' : null;
    if (motivo) { const key = k + motivo + Math.round(t); if (!vistos.has(key)) { vistos.add(key); fuera.push({ t: +t.toFixed(1), tipo: k, motivo, caja: [x0, y0, x1, y1] }); } } }
   maxEt = Math.max(maxEt, et); }
  return { fuera, maxEtiquetas: maxEt, titulos, muestras: n }; }, paso);
 console.log(JSON.stringify(res)); await b.close();
})();
