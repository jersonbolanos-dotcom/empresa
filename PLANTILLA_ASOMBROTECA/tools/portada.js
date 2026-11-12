// v1.29 · Portada fija del canal (1080×1920): fotograma del vídeo poco desenfocado y oscurecido, 2-4 palabras gigantes (UNA en
// rojo), etiqueta amarilla pequeña encima y la marca discreta debajo. Siempre la misma maqueta, para que el perfil se vea como una marca.
// La portada no lleva botones encima: el texto se centra en x = 540, y TODO queda dentro del recorte 3:4 de la cuadrícula del
// perfil de Instagram (1080×1440 centrado: 240 ≤ y ≤ 1680).
// Líneas: «/» separa líneas («LE LLAMABAN / LLORÓN»); sin «/», una palabra por línea. Cada línea toma su propio tamaño:
// la línea con la palabra roja es la más grande.
// Uso: node tools/portada.js fondo.jpg salida.jpg "TEXTO" "PALABRA_ROJA" "ETIQUETA" [MARCA] [FOCO_X] [BLOQUE]
//   FOCO_X: x (px del fotograma 1080×1920) que queda centrada en la portada (por defecto 540, sin desplazar)
//   BLOQUE: 'centro' (por defecto, texto en el centro del recorte) o 'abajo' (texto en la mitad baja; deja ver una cara arriba)
// (normalmente lo llama: producir.py PROYECTO portada "TEXTO" "PALABRA_ROJA" "ETIQUETA" [--foco X] [--bloque abajo])
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
 const [fondo, salida, texto, roja, etiqueta, marca = 'ASOMBROTECA', focoS = '540', bloque = 'centro'] = process.argv.slice(2);
 const css = fs.readFileSync(path.join(__dirname, '..', 'fonts', 'fuentes.css'), 'utf8');
 const img = 'data:image/jpeg;base64,' + fs.readFileSync(fondo).toString('base64');
 const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
 await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css} body{margin:0;background:#000}</style></head><body><canvas id="c" width="1080" height="1920"></canvas>
  <span style="font:900 20px Nunito">a</span><span style="font:800 20px Nunito">a</span></body></html>`);
 await p.evaluate(() => document.fonts.ready);
 const res = await p.evaluate(async ({ img, texto, roja, etiqueta, marca, foco, bloque }) => {
  const c = document.getElementById('c'), ctx = c.getContext('2d'); await document.fonts.load('900 100px Nunito'); await document.fonts.load('800 40px Nunito');
  const im = new Image(); im.src = img; await im.decode();
  const nrm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toUpperCase();
  const X = 540, MAXW = 920, Y0 = 240, Y1 = 1680;   // recorte 3:4 del perfil
  // fondo: fotograma algo ampliado (permite centrar el foco), poco desenfocado y oscurecido
  const k = Math.max(1080 / im.width, 1920 / im.height) * (foco === 540 ? 1.08 : 1.4), w = im.width * k, h = im.height * k;
  let ox = 540 - foco * k * (im.width / 1080); ox = Math.min(0, Math.max(1080 - w, ox)); const oy = (1920 - h) / 2;
  ctx.fillStyle = '#05060a'; ctx.fillRect(0, 0, 1080, 1920); ctx.filter = 'blur(5px) saturate(1.1)'; ctx.drawImage(im, ox, oy, w, h); ctx.filter = 'none';
  ctx.fillStyle = 'rgba(4,6,12,0.36)'; ctx.fillRect(0, 0, 1080, 1920);
  const cyB = bloque === 'abajo' ? 1360 : 960, g = ctx.createLinearGradient(0, cyB - 520, 0, cyB + 420); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.45, 'rgba(0,0,0,0.55)'); g.addColorStop(1, 'rgba(0,0,0,0.7)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
  // líneas: «/» separa; si no, una palabra por línea
  const lines = (texto.includes('/') ? texto.split('/') : texto.trim().split(/\s+/)).map((s) => s.trim().toUpperCase()).filter(Boolean);
  const esRoja = (l) => l.split(/\s+/).some((w) => nrm(w) === nrm(roja));
  const fit = (l, cap) => { let px = cap; ctx.font = `900 ${px}px Nunito`; while (px > 60 && ctx.measureText(l).width > MAXW) { px -= 4; ctx.font = `900 ${px}px Nunito`; } return px; };
  let L = lines.map((l) => ({ s: l, r: esRoja(l), px: fit(l, esRoja(l) ? 330 : 190) }));
  const ET = 76, gap = 34, MG = 70; const LH = 1.14;   // interlineado: deja sitio a las tildes de mayúsculas (Ó, Á…) sin tocar la línea de arriba
  let alto = () => ET + gap + L.reduce((a, q) => a + q.px * LH, 0) + MG;
  while (alto() > (bloque === 'abajo' ? 640 : Y1 - Y0 - 80)) L = L.map((q) => ({ ...q, px: q.px * 0.95 }));
  let y = Math.min(Y1 - 40 - alto(), cyB - alto() / 2) + ET / 2;
  // etiqueta amarilla pequeña
  ctx.font = '900 44px Nunito'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const et = etiqueta.toUpperCase(), tw = ctx.measureText(et).width;
  ctx.fillStyle = '#FFD23F'; ctx.beginPath(); ctx.roundRect(X - tw / 2 - 30, y - ET / 2, tw + 60, ET, 16); ctx.fill(); ctx.fillStyle = '#111111'; ctx.fillText(et, X, y + 2);
  const caja = [X - tw / 2 - 30, y - ET / 2, X + tw / 2 + 30, y + ET / 2]; y += ET / 2 + gap;
  ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
  for (const q of L) { ctx.font = `900 ${q.px}px Nunito`; const by = y + q.px * 0.86;
   ctx.shadowColor = 'rgba(0,0,0,0.75)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 8; ctx.lineWidth = q.px * 0.09; ctx.strokeStyle = '#000'; ctx.strokeText(q.s, X, by);
   ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.fillStyle = q.r ? '#FF2D2D' : '#FFFFFF'; ctx.fillText(q.s, X, by); const m = ctx.measureText(q.s).width; caja[0] = Math.min(caja[0], X - m / 2); caja[2] = Math.max(caja[2], X + m / 2); y += q.px * LH; }
  ctx.font = '800 34px Nunito'; ctx.fillStyle = 'rgba(255,255,255,0.78)'; ctx.letterSpacing = '6px'; ctx.textBaseline = 'middle'; const my = Math.min(Y1 - 30, y + 40); ctx.fillText(marca.toUpperCase(), X + 3, my); caja[3] = my + 20;
  return { url: c.toDataURL('image/jpeg', 0.93), caja: caja.map(Math.round) }; }, { img, texto, roja, etiqueta, marca, foco: Number(focoS), bloque });
 fs.writeFileSync(salida, Buffer.from(res.url.split(',')[1], 'base64'));
 const [x0, y0, x1, y1] = res.caja, dentro = y0 >= 240 && y1 <= 1680 && x0 >= 0 && x1 <= 1080;
 console.log(`portada: ${salida} · texto en x ${x0}-${x1}, y ${y0}-${y1} · recorte 3:4 (y 240-1680): ${dentro ? 'dentro' : 'FUERA'}`); await b.close();
 if (!dentro) process.exit(1);
})();
