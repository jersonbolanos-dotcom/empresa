// QC de la zona segura de Instagram (v1.27). Recorre el vídeo cada 0,2 s con el registro de textos activado (window.__SAFE_QC)
// y comprueba que ningún subtítulo, etiqueta, cifra, aviso, título o marca cae en y < 220, y > 1450 o x > 940.
// También cuenta cuántas etiquetas hay a la vez (máx. 2) y si aparece un título fijo arriba.
// v1.29: además
//   · encimados: dos textos/contadores distintos visibles a la vez en la misma zona (se cruzan > 20 % de la caja menor, con las cajas encogidas 8 px) → lista;
//   · pantalla llena (v1.34: ENCUADRE, ver abajo; el cierre marcado con safeLog('cierre') no cuenta): cada 0,5 s mide el ancho que ocupa el contenido NO textual (bordes de dibujo, sin las cajas de texto)
//     dentro de la zona segura (0-940 × 220-1450); si es < 60 % durante más de 3 s seguidos → aviso (no es error).
// v1.34: ENCUADRE (FALLO): además del ancho, mide dónde está el dibujo en vertical (centro y percentiles 10/90 de los bordes);
//   falla si > 3 s seguidos la escena es estrecha (< 60 %), está descentrada (centro a > 12 % de la franja de escena = zona segura
//   menos la franja de subtítulos) o deja > 32 % de esa franja vacío arriba o abajo → llena.fallos [[t0, t1, motivo]].
// Uso: node tools/zona_segura.js index.html [paso=0.2]
//   → imprime un JSON { fuera: [...], maxEtiquetas, titulos, muestras, encimados: [...], llena: { minimo, avisos: [[t0,t1,%]] } }
const { chromium } = require('playwright'); const path = require('path');
(async () => {
 const file = path.resolve(process.argv[2]), paso = Number(process.argv[3] || 0.2); const b = await chromium.launch();
 const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.addInitScript(() => { window.__HEADLESS = true; window.__SAFE_QC = true; });
 await p.goto('file://' + file); await p.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
 const res = await p.evaluate((paso) => { const S = window.PLANTILLA.P.SAFE, D = window.DURATION, fuera = [], vistos = new Set(); let maxEt = 0, titulos = 0, n = 0;
  const encimados = [], vistosE = new Set(), anchos = []; let franja = [220, 1450];
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
    let x0 = -1, x1 = -1; const filas = new Array(Y1 - Y0).fill(0);
    for (let x = 1; x < X1; x++) { let c = 0;
     for (let y = Y0 + 1; y < Y1; y++) { if (tapa.some((q) => x >= q[0] && x <= q[2] && y >= q[1] && y <= q[3])) continue;
      const g = Math.abs(lum(x, y) - lum(x - 1, y)) + Math.abs(lum(x, y) - lum(x, y - 1)); if (g > 36) { c++; filas[y - Y0]++; } }
     if (c >= (Y1 - Y0) * 0.03) { if (x0 < 0) x0 = x; x1 = x; } }
    // v1.34 · encuadre vertical, dentro de la FRANJA DE ESCENA = zona segura menos la franja de subtítulos (arriba con capY 330;
    // abajo con capY 1540): dónde está la «masa» de dibujo (bordes; cada fila cuenta como mucho un 25 % del ancho, para que una
    // línea larga —el canto de una mesa— no pese como un objeto): percentiles 10 y 90 y centro, de 0 (arriba) a 1 (abajo)
    const subs = L.filter((q) => q[0] === 'subtitulo'); if (subs.length) { const ym = Math.min(...subs.map((q) => q[2])), yM = Math.max(...subs.map((q) => q[4]));
     franja = (ym + yM) / 2 < 960 ? [Math.max(220, yM + 16), 1450] : [220, Math.min(1450, ym - 16)]; }
    const f0 = Math.max(0, Math.round(franja[0] / sc) - Y0), f1 = Math.min(filas.length, Math.round(franja[1] / sc) - Y0), FR = filas.slice(f0, f1).map((v) => Math.min(v, X1 * 0.25));
    const M = FR.reduce((s0, v) => s0 + v, 0); let acc = 0, p10 = 0, p90 = 1, cy = 0.5;
    if (M > 0) { let my = 0; for (let k = 0; k < FR.length; k++) { const v = FR[k], a0 = acc; acc += v; my += v * k; if (a0 < 0.1 * M && acc >= 0.1 * M) p10 = k / FR.length; if (a0 < 0.9 * M && acc >= 0.9 * M) p90 = k / FR.length; } cy = my / M / FR.length; }
    if (!L.some((q) => q[0] === 'cierre')) anchos.push([+t.toFixed(2), x0 < 0 ? 0 : (x1 - x0 + 1) / X1, +cy.toFixed(3), +p10.toFixed(3), +p90.toFixed(3)]); } }
  // v1.34 · ENCUADRE (es FALLO, no aviso): más de 3 s seguidos con
  //   · el dibujo < 60 % del ancho seguro («estrecho»), o
  //   · su centro vertical a más del 12 % del alto de la franja de escena de su centro («arriba» / «abajo»), o
  //   · más del 32 % de la franja vacío por arriba o por abajo («vacío arriba/abajo»: media pantalla vacía; percentiles 10/90).
  const malo = (q) => { const m = []; if (q[1] < 0.6) m.push('estrecho ' + Math.round(100 * q[1]) + ' %'); if (Math.abs(q[2] - 0.5) > 0.12) m.push(q[2] < 0.5 ? 'arriba' : 'abajo');
   if (q[3] > 0.32) m.push('vacío arriba ' + Math.round(100 * q[3]) + ' %'); if (1 - q[4] > 0.32) m.push('vacío abajo ' + Math.round(100 * (1 - q[4])) + ' %'); return m; };
  const fallos = []; let ini = null;
  for (let i = 0; i <= anchos.length; i++) { const bajo = i < anchos.length && malo(anchos[i]).length > 0;
   if (bajo && ini === null) ini = i;
   if (!bajo && ini !== null) { const t0 = anchos[ini][0], t1 = i < anchos.length ? anchos[i][0] : Math.min(D, anchos[anchos.length - 1][0] + 0.5); if (t1 - t0 > 3) { const cnt = {}; for (const q of anchos.slice(ini, i)) for (const mm of malo(q)) { const k0 = mm.replace(/ \d+ %/, ''); cnt[k0] = (cnt[k0] || 0) + 1; }
    fallos.push([t0, +t1.toFixed(1), Object.keys(cnt).sort((p0, q0) => cnt[q0] - cnt[p0]).join(' + ')]); } ini = null; } }
  const avisos = fallos.map((f) => [f[0], f[1], Math.round(100 * Math.min(...anchos.filter((q) => q[0] >= f[0] && q[0] < f[1]).map((q) => q[1])))]);
  return { fuera, maxEtiquetas: maxEt, titulos, muestras: n, encimados, llena: { minimo: Math.round(100 * Math.min(1, ...anchos.map((q) => q[1]))), fallos, avisos, muestras: anchos } }; }, paso);
 console.log(JSON.stringify(res)); await b.close();
})();
