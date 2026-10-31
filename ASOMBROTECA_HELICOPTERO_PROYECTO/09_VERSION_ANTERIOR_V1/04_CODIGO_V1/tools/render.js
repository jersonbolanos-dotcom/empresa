// Render fotograma a fotograma: window.seek(i/30) en Chromium headless -> JPEG (q 0.97) numerados.
// Paraleliza en N páginas; cada fotograma es función pura de t, así que el orden no importa.
// Uso: node tools/render.js index.html carpeta_frames [workers=4] [fps=30]   (desde 04_CODIGO)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
 const [file, out, wk = '4', fpsS = '30'] = process.argv.slice(2);
 const fps = Number(fpsS), workers = Number(wk);
 fs.mkdirSync(out, { recursive: true });
 const browser = await chromium.launch();
 const probe = await browser.newPage();
 await probe.addInitScript(() => { window.__HEADLESS = true; });
 await probe.goto('file://' + path.resolve(file));
 await probe.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
 const D = await probe.evaluate(() => window.DURATION);
 await probe.close();
 const N = Math.ceil(D * fps - 1e-9); // fotogramas 0..N-1 cubren [0, D)
 console.log('DURATION', D, 'frames', N);
 const t0 = Date.now(); let done = 0; const errs = [];
 async function worker(w) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.addInitScript(() => { window.__HEADLESS = true; });
  await page.goto('file://' + path.resolve(file));
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  for (let i = w; i < N; i += workers) {
   const f = path.join(out, `f_${String(i).padStart(5, '0')}.jpg`);
   if (fs.existsSync(f)) { done++; continue; }
   const url = await page.evaluate((t) => { window.seek(t); return document.getElementById('cv').toDataURL('image/jpeg', 0.97); }, i / fps);
   fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
   if (++done % 300 === 0) console.log(done + '/' + N, ((Date.now() - t0) / 1000).toFixed(0) + ' s');
  }
  await page.close();
 }
 await Promise.all(Array.from({ length: workers }, (_, w) => worker(w)));
 console.log('listo', N, 'fotogramas en', ((Date.now() - t0) / 1000).toFixed(0), 's');
 if (errs.length) { console.error(errs.join('\n')); process.exitCode = 1; }
 await browser.close();
})();
