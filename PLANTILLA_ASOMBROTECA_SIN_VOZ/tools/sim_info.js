// Resumen de la simulación de un reel, calculada EN EL NAVEGADOR (igual que en el render: Node y Chromium pueden diferir en los
// últimos decimales y una simulación caótica amplifica esa diferencia). Úsalo para ajustar PARAM en tiempos.txt.
// Uso: node tools/sim_info.js 04_CODIGO/index.html   (antes: producir_reel.py REEL build)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.addInitScript(() => { window.__HEADLESS = true; });
 await p.goto('file://' + path.resolve(process.argv[2])); await p.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
 const r = await p.evaluate(() => { const S = window.EPISODIO.sim || {}, D = window.DURATION, o = { duracion: D, eventos: {} };
  for (const e of S.eventos || []) o.eventos[e.tipo] = (o.eventos[e.tipo] || 0) + 1;
  if ('tLleno' in S) { o.formato = 'rebote'; o.tLleno = S.tLleno; o.margen = S.tLleno == null ? 'NO SE LLENA' : +(D - S.tLleno).toFixed(2) + ' s antes del final'; o.bolasFinal = S.n(S.NF - 1); o.primeraDivision = (S.eventos.find((e) => e.tipo === 'nace') || {}).t; }
  if (S.pilas) { o.formato = 'galton'; o.casillas = S.pilas.map((q) => q.length); o.ultimaCasilla = S.casilla[S.ultima]; o.ultimaLlega = S.llegada[S.ultima]; }
  if (S.coef) { o.formato = 'fourier'; o.terminos = S.coef.length; o.radiosMayores = S.coef.slice(0, 5).map((c) => +c.r.toFixed(1)); }
  return o; });
 console.log(JSON.stringify(r, null, 1)); await b.close(); })();
