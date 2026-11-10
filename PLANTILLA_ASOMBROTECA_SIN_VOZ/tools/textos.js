// QC de textos de un reel de simulación (SIN_VOZ 2.0). Recorre el vídeo cada `paso` s con el registro de textos activado
// (window.__SAFE_QC → REEL.safeLog()) y devuelve un JSON con: textos fuera de la zona segura (220 ≤ y ≤ 1450, 60 ≤ x ≤ 940),
// tipos de texto vistos (solo se permiten pregunta, contador, frase y marca), máximo de cada tipo a la vez, en cuántas muestras está
// la marca de agua, si la pregunta está en el fotograma 0 y la frase al final, y los instantes de los eventos de la simulación.
// Uso: node tools/textos.js index.html [paso=0.1]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
 const file = path.resolve(process.argv[2]), paso = Number(process.argv[3] || 0.1); const b = await chromium.launch();
 const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.addInitScript(() => { window.__HEADLESS = true; window.__SAFE_QC = true; });
 await p.goto('file://' + file); await p.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
 const res = await p.evaluate((paso) => { const S = window.REEL.SAFE, D = window.DURATION, fuera = [], tipos = {}, max = {}, vistos = new Set(); let n = 0, marca = 0;
  const kindsAt = (t) => { window.seek(t); return window.REEL.safeLog() || []; };
  for (let t = 0; t < D; t += paso) { const L = kindsAt(t); n++; const c = {};
   for (const [k, x0, y0, x1, y1] of L) { tipos[k] = (tipos[k] || 0) + 1; c[k] = (c[k] || 0) + 1; if (k === 'marca') marca++;
    const m = y0 < S.top ? 'y<' + S.top : y1 > S.bottom ? 'y>' + S.bottom : x1 > S.right ? 'x>' + S.right : x0 < S.left - 1 ? 'x<' + S.left : null;
    if (m) { const key = k + m + Math.round(t); if (!vistos.has(key)) { vistos.add(key); fuera.push({ t: +t.toFixed(1), tipo: k, motivo: m, caja: [x0, y0, x1, y1] }); } } }
   for (const k in c) max[k] = Math.max(max[k] || 0, c[k]); }
  const k0 = kindsAt(0).map((x) => x[0]), kf = kindsAt(D - 0.75).map((x) => x[0]);
  return { fuera, tipos, max, muestras: n, marca, pregunta0: k0.includes('pregunta'), contador0: k0.includes('contador'), fraseFinal: kf.includes('frase'), eventos: (window.eventos ? window.eventos() : []).filter((x) => x >= 0 && x < D) }; }, paso);
 console.log(JSON.stringify(res)); await b.close();
})();
