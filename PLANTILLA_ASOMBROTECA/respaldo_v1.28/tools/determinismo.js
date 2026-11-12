// Comprueba que cada fotograma es función pura de t: renderiza unos instantes en dos órdenes distintos y compara su huella.
// Uso: node tools/determinismo.js index.html [t1 t2 t3 …]   (sin tiempos: 3 instantes repartidos por la duración)
// Salida: una línea por instante y «DETERMINISMO OK» o «DETERMINISMO FALLO» (código de salida 1).
const { chromium } = require('playwright'); const path = require('path'); const crypto = require('crypto');
(async () => {
 const file = path.resolve(process.argv[2]); let ts = process.argv.slice(3).map(Number);
 const b = await chromium.launch(); const res = {};
 for (let run = 0; run < 2; run++) {
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.addInitScript(() => { window.__HEADLESS = true; });
  await p.goto('file://' + file); await p.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  if (!ts.length) { const D = await p.evaluate(() => window.DURATION || 10); ts = [D * 0.13, D * 0.51, D * 0.87].map((v) => +v.toFixed(2)); }
  for (const t of run ? [...ts].reverse() : ts) { const h = await p.evaluate((t) => { window.seek(t); return Array.from(document.getElementById('cv').getContext('2d').getImageData(0, 0, 1080, 1920).data.filter((_, i) => i % 7 === 0)); }, t); (res[t] = res[t] || []).push(crypto.createHash('md5').update(Buffer.from(h)).digest('hex')); }
  await p.close(); }
 let ok = true; for (const t of ts) { const [a, c] = res[t]; console.log(t.toFixed(2).padStart(7), a, a === c ? '=' : '≠', c); if (a !== c) ok = false; }
 console.log(ok ? 'DETERMINISMO OK' : 'DETERMINISMO FALLO'); await b.close(); process.exit(ok ? 0 : 1);
})();
