// Captura fotogramas sueltos (PNG) de index.html en tiempos dados — para QC y storyboard.
// Uso: node tools/frames.js index.html salida_dir t1 t2 ...   (desde 04_CODIGO)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
 const [file, outDir, ...ts] = process.argv.slice(2);
 fs.mkdirSync(outDir, { recursive: true });
 const browser = await chromium.launch();
 const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
 const errs = [];
 page.on('pageerror', (e) => errs.push(String(e)));
 page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
 const sinSubs = !!process.env.SIN_SUBTITULOS;   // v1.29: SIN_SUBTITULOS=1 → fotograma sin subtítulos (fondo de la portada)
 await page.addInitScript((ss) => { window.__HEADLESS = true; if (ss) window.__SIN_SUBTITULOS = true; }, sinSubs);
 await page.goto('file://' + path.resolve(file));
 await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
 for (const t of ts) {
  const ms = await page.evaluate((t) => { const a = performance.now(); window.seek(t); return performance.now() - a; }, Number(t));
  const url = await page.evaluate(() => document.getElementById('cv').toDataURL('image/png'));
  const f = path.join(outDir, `t_${Number(t).toFixed(2).padStart(6, '0')}.png`);
  fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
  console.log(f, ms.toFixed(1) + ' ms');
 }
 if (errs.length) { console.error('ERRORES:\n' + errs.join('\n')); process.exitCode = 1; }
 await browser.close();
})();
