// v1.29 · Portada fija del canal (1080×1920): fotograma del vídeo desenfocado y oscurecido, 2-4 palabras gigantes (UNA en rojo),
// etiqueta amarilla pequeña encima y la marca discreta debajo. Todo dentro de la zona segura (x 60-900, y 220-1450).
// Siempre la misma maqueta, para que el perfil se vea como una marca.
// Uso: node tools/portada.js fondo.jpg salida.jpg "TEXTO" "PALABRA_ROJA" "ETIQUETA" [MARCA]
// (normalmente lo llama: producir.py PROYECTO portada "TEXTO" "PALABRA_ROJA" "ETIQUETA")
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
 const [fondo, salida, texto, roja, etiqueta, marca = 'ASOMBROTECA'] = process.argv.slice(2);
 const css = fs.readFileSync(path.join(__dirname, '..', 'fonts', 'fuentes.css'), 'utf8');
 const img = 'data:image/jpeg;base64,' + fs.readFileSync(fondo).toString('base64');
 const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
 await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css} body{margin:0;background:#000}</style></head><body><canvas id="c" width="1080" height="1920"></canvas>
  <span style="font:900 20px Nunito">a</span><span style="font:800 20px Nunito">a</span></body></html>`);
 await p.evaluate(() => document.fonts.ready);
 const url = await p.evaluate(async ({ img, texto, roja, etiqueta, marca }) => {
  const c = document.getElementById('c'), ctx = c.getContext('2d'); await document.fonts.load('900 100px Nunito'); await document.fonts.load('800 40px Nunito');
  const im = new Image(); im.src = img; await im.decode();
  const nrm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toUpperCase();
  // fondo: fotograma a pantalla completa, desenfocado y oscuro
  const k = Math.max(1080 / im.width, 1920 / im.height) * 1.12, w = im.width * k, h = im.height * k;
  ctx.fillStyle = '#05060a'; ctx.fillRect(0, 0, 1080, 1920); ctx.filter = 'blur(26px) saturate(1.15)'; ctx.drawImage(im, (1080 - w) / 2, (1920 - h) / 2, w, h); ctx.filter = 'none';
  ctx.fillStyle = 'rgba(4,6,12,0.58)'; ctx.fillRect(0, 0, 1080, 1920);
  const g = ctx.createRadialGradient(480, 860, 200, 480, 860, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.6)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
  // palabras gigantes, una por línea, centradas en la zona segura
  const ws = texto.trim().split(/\s+/).map((s) => s.toUpperCase()), X = 480, MAXW = 820;
  let px = 250; ctx.font = `900 ${px}px Nunito`; const anchoMax = () => Math.max(...ws.map((s) => ctx.measureText(s).width));
  while (px > 90 && (anchoMax() > MAXW || ws.length * px * 1.02 > 860)) { px -= 4; ctx.font = `900 ${px}px Nunito`; }
  const lh = px * 1.0, alto = ws.length * lh, y0 = 860 - alto / 2 + lh * 0.8;
  // etiqueta amarilla pequeña encima
  ctx.font = '900 44px Nunito'; const et = etiqueta.toUpperCase(), tw = ctx.measureText(et).width, ey = y0 - lh * 0.8 - 70;
  ctx.fillStyle = '#FFD23F'; ctx.beginPath(); ctx.roundRect(X - tw / 2 - 30, ey - 38, tw + 60, 76, 16); ctx.fill();
  ctx.fillStyle = '#111111'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(et, X, ey + 16);
  ctx.font = `900 ${px}px Nunito`; ctx.lineJoin = 'round';
  ws.forEach((s, i) => { const y = y0 + i * lh; const r = nrm(s) === nrm(roja);
   ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 8; ctx.lineWidth = px * 0.09; ctx.strokeStyle = '#000'; ctx.strokeText(s, X, y);
   ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.fillStyle = r ? '#FF2D2D' : '#FFFFFF'; ctx.fillText(s, X, y); });
  // marca discreta
  ctx.font = '800 34px Nunito'; ctx.fillStyle = 'rgba(255,255,255,0.72)'; ctx.letterSpacing = '6px'; ctx.fillText(marca.toUpperCase(), X, Math.min(1400, y0 + alto + 40));
  return c.toDataURL('image/jpeg', 0.93); }, { img, texto, roja, etiqueta, marca });
 fs.writeFileSync(salida, Buffer.from(url.split(',')[1], 'base64')); console.log('portada:', salida); await b.close();
})();
