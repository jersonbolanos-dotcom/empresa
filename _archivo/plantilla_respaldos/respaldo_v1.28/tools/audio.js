// Renderiza los stems sintetizados con el kit SOUND original:
//   sfx.wav   = SOUND.renderOffline(window.scoreSound, DURATION, 48000, { voiceover: true })
//   music.wav = SOUND.renderOffline(window.scoreMusic, DURATION, 48000, { voiceover: false })  (bus aparte)
// Uso: node tools/audio.js index.html carpeta_salida   (desde 04_CODIGO)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
function wav(file, inter, sr) {
 const n = inter.length, buf = Buffer.alloc(44 + n * 4);
 buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
 buf.writeUInt32LE(16, 16); buf.writeUInt16LE(3, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(sr, 24);
 buf.writeUInt32LE(sr * 8, 28); buf.writeUInt16LE(8, 32); buf.writeUInt16LE(32, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
 for (let i = 0; i < n; i++) buf.writeFloatLE(inter[i], 44 + i * 4);
 fs.writeFileSync(file, buf);
}
(async () => {
 const [file, out] = process.argv.slice(2);
 fs.mkdirSync(out, { recursive: true });
 const browser = await chromium.launch();
 const page = await browser.newPage();
 const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
 await page.addInitScript(() => { window.__HEADLESS = true; });
 await page.goto('file://' + path.resolve(file));
 await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
 for (const [name, fn, opts] of [['sfx', 'scoreSound', { voiceover: true }], ['music', 'scoreMusic', { voiceover: false }]]) {
  const r = await page.evaluate(async ([fn, opts]) => {
   const res = await SOUND.renderOffline(window[fn], window.DURATION, 48000, opts);
   return { data: Array.from(res.inter), peak: res.peak, frames: res.frames, sr: res.sr };
  }, [fn, opts]);
  wav(path.join(out, name + '.wav'), Float32Array.from(r.data), r.sr);
  console.log(name, 'frames', r.frames, 'peak', r.peak.toFixed(3));
 }
 if (errs.length) { console.error(errs.join('\n')); process.exitCode = 1; }
 await browser.close();
})();
