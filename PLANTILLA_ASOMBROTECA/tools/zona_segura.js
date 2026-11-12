// QC de la zona segura de Instagram (v1.27). Recorre el vídeo cada 0,2 s con el registro de textos activado (window.__SAFE_QC)
// y comprueba que ningún subtítulo, etiqueta, cifra, aviso, título o marca cae en y < 220, y > 1450 o x > 940.
// También cuenta cuántas etiquetas hay a la vez (máx. 2) y si aparece un título fijo arriba.
// v1.29: además
//   · encimados: dos textos/contadores distintos visibles a la vez en la misma zona (se cruzan > 20 % de la caja menor, con las cajas encogidas 8 px) → lista;
//   · pantalla llena: cada 0,5 s mide el ancho que ocupa el contenido NO textual (bordes de dibujo, sin las cajas de texto)
//     dentro de la zona segura (0-940 × 220-1450); si es < 60 % durante más de 3 s seguidos → aviso (no es error).
// Uso: node tools/zona_segura.js index.html [paso=0.2]
//   → imprime un JSON { fuera: [...], maxEtiquetas, titulos, muestras, encimados: [...], llena: { minimo, avisos: [[t0,t1,%]] } }
const { chromium } = require('playwright'); const path = require('path');
(async () => {
 const file = path.resolve(process.argv[2]), paso = Number(process.argv[3] || 0.2); const b = await chromium.launch();
 const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.addInitScript(() => { window.__HEADLESS = true; window.__SAFE_QC = true; });
 await p.goto('file://' + file); await p.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
 const res = await p.evaluate((paso) => { const S = window.PLANTILLA.P.SAFE, D = window.DURATION, fuera = [], vistos = new Set(); let maxEt = 0, titulos = 0, n = 0;
  const encimados = [], vistosE = new Set(), anchos = [];
  const cv = document.getElementById('cv'), sc = 4, mini = document.createElement('canvas'); mini.width = 1080 / sc; mini.height = 1920 / sc; const mx = mini.getContext('2d', { willReadFrequently: true });
  const X1 = Math.round(940 / sc), Y0 = Math.round(220 / sc), Y1 = Math.round(1450 / sc);
  // las cajas registradas son estimaciones algo generosas: se encogen 8 px por lado antes de comparar
  const enc = (q) => [q[0], q[1] + 8, q[2] + 8, q[3] - 8, q[4] - 8];
  const solape = (a0, c0) => { const a = enc(a0), c = enc(c0), w = Math.min(a[3], c[3]) - Math.max(a[1], c[1]), h = Math.min(a[4], c[4]) - Math.max(a[2], c[2]); if (w <= 0 || h <= 0) return 0;
   const ar = (q) => Math.max(1, (q[3] - q[1]) * (q[4] - q[2])); return (w * h) / Math.min(ar(a), ar(c)); };
  const iguales = (a, c) => [1, 2, 3, 4].every((k) => Math.abs(a[k] - c[k]) <= 3);
  const kL = Math.max(1, Math.round(0.5 / paso));
  for (let i0 = 0; i0 * paso < D; i0++) { const t = i0 * paso; window.seek(t); const L = window.PLANTILLA.safeLog() || []; n++; let et = 0;
   for (const [k, x0, y0, x1, y1] of L) { if (k === 'etiqueta' || k === 'aviso') et++; if (k === 'titulo') titulos++;
    const motivo = y0 < S.top ? 'y<' + S.top : y1 > S.bottom ? 'y>' + S.bottom : x1 > S.right ? 'x>' + S.right : x0 < 0 ? 'x<0' : null;
    if (motivo) { const key = k + motivo + Math.round(t); if (!vistos.has(key)) { vistos.add(key); fuera.push({ t: +t.toFixed(1), tipo: k, motivo, caja: [x0, y0, x1, y1] }); } } }
   maxEt = Math.max(maxEt, et);
   // v1.29 · encimados (las palabras de un mismo subtítulo no cuentan entre sí; una caja registrada dos veces tampoco)
   for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i], c = L[j];
    if ((a[0] === 'subtitulo' && c[0] === 'subtitulo') || iguales(a, c)) continue;
    if (solape(a, c) > 0.2) { const key = a[0] + c[0] + Math.round(t * 2); if (!vistosE.has(key)) { vistosE.add(key); encimados.push({ t: +t.toFixed(1), a: a[0], b: c[0], cajas: [a.slice(1), c.slice(1)] }); } } }
   // v1.29 · pantalla llena (≈ cada 0,5 s)
   if (i0 % kL === 0) {
    mx.drawImage(cv, 0, 0, mini.width, mini.height); const im = mx.getImageData(0, 0, mini.width, mini.height).data, Wm = mini.width;
    const tapa = L.map((q) => [q[1] / sc - 2, q[2] / sc - 2, q[3] / sc + 2, q[4] / sc + 2]);
    const lum = (x, y) => { const o = (y * Wm + x) * 4; return 0.3 * im[o] + 0.59 * im[o + 1] + 0.11 * im[o + 2]; };
    let x0 = -1, x1 = -1;
    for (let x = 1; x < X1; x++) { let c = 0;
     for (let y = Y0 + 1; y < Y1; y++) { if (tapa.some((q) => x >= q[0] && x <= q[2] && y >= q[1] && y <= q[3])) continue;
      const g = Math.abs(lum(x, y) - lum(x - 1, y)) + Math.abs(lum(x, y) - lum(x, y - 1)); if (g > 36) c++; }
     if (c >= (Y1 - Y0) * 0.03) { if (x0 < 0) x0 = x; x1 = x; } }
    anchos.push([+t.toFixed(2), x0 < 0 ? 0 : (x1 - x0 + 1) / X1]); } }
  const avisos = []; let ini = null;
  for (let i = 0; i <= anchos.length; i++) { const bajo = i < anchos.length && anchos[i][1] < 0.6;
   if (bajo && ini === null) ini = i;
   if (!bajo && ini !== null) { const t0 = anchos[ini][0], t1 = i < anchos.length ? anchos[i][0] : D; if (t1 - t0 > 3) avisos.push([t0, +t1.toFixed(1), Math.round(100 * Math.min(...anchos.slice(ini, i).map((q) => q[1])))]); ini = null; } }
  return { fuera, maxEtiquetas: maxEt, titulos, muestras: n, encimados, llena: { minimo: Math.round(100 * Math.min(1, ...anchos.map((q) => q[1]))), avisos } }; }, paso);
 console.log(JSON.stringify(res)); await b.close();
})();
