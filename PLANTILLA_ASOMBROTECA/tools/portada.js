// Portada fija del canal (1080×1920) · MAQUETA ESTÁNDAR v1.30 (la misma en todos los vídeos, para que el perfil se vea como una marca):
//   · fondo: un fotograma NÍTIDO del propio vídeo (sin desenfoque y sin subtítulos), con la escena principal bien visible;
//   · arriba de la escena: etiqueta amarilla pequeña y el texto corto en dos líneas (la línea con la PALABRA_ROJA, en rojo y más
//     grande; la otra, en blanco), con borde oscuro en las letras para que se lean sobre la imagen;
//   · la marca, discreta, abajo;
//   · todo centrado en x = 540 y dentro del recorte 3:4 de la cuadrícula del perfil de Instagram (1080×1440 centrado: 240 ≤ y ≤ 1680).
// Líneas: «/» separa líneas («13 AÑOS / ESPERANDO»); sin «/», una palabra por línea.
// Uso: node tools/portada.js fondo.jpg salida.jpg "TEXTO" "PALABRA_ROJA" "ETIQUETA" [MARCA] [FOCO_X] [BLOQUE] [BAJAR]
//   FOCO_X: x del fotograma que queda centrada (540 = sin desplazar) · BLOQUE: 'arriba' (estándar v1.30); 'centro'/'abajo' (v1.29)
//   BAJAR: px que se baja el fotograma para dejar cielo libre al texto (la franja de arriba se rellena con el borde del fotograma)
// (normalmente lo llama: producir.py PROYECTO portada "TEXTO" "PALABRA_ROJA" "ETIQUETA" SEGUNDO [--gancho X] [--bajar 300])
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
 const [fondo, salida, texto, roja, etiqueta, marca = 'ASOMBROTECA', focoS = '540', bloque = 'arriba', bajarS = '0', modoRoja = 'linea', tam = 'desigual'] = process.argv.slice(2);
 // v1.31 (series): modoRoja 'palabra' = solo la palabra clave en rojo (no toda su línea) · tam 'igual' = las dos líneas del mismo tamaño (una pregunta)
 const css = fs.readFileSync(path.join(__dirname, '..', 'fonts', 'fuentes.css'), 'utf8');
 const img = 'data:image/jpeg;base64,' + fs.readFileSync(fondo).toString('base64');
 const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
 await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css} body{margin:0;background:#000}</style></head><body><canvas id="c" width="1080" height="1920"></canvas>
  <span style="font:900 20px Nunito">a</span><span style="font:800 20px Nunito">a</span></body></html>`);
 await p.evaluate(() => document.fonts.ready);
 const res = await p.evaluate(async ({ img, texto, roja, etiqueta, marca, foco, bloque, bajar, modoRoja, tam }) => {
  const c = document.getElementById('c'), ctx = c.getContext('2d'); await document.fonts.load('900 100px Nunito'); await document.fonts.load('800 40px Nunito');
  const im = new Image(); im.src = img; await im.decode();
  const nrm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toUpperCase();
  const X = 540, MAXW = 920, Y0 = 240, Y1 = 1680;
  // fondo NÍTIDO: el fotograma a tamaño real (o ampliado solo si hay que centrar un foco); sin desenfoque
  const k = Math.max(1080 / im.width, 1920 / im.height) * (foco === 540 ? 1 : 1.25), w = im.width * k, h = im.height * k;
  let ox = 540 - foco * k * (im.width / 1080); ox = Math.min(0, Math.max(1080 - w, ox)); const oy = (1920 - h) / 2 + bajar;
  ctx.fillStyle = '#05060a'; ctx.fillRect(0, 0, 1080, 1920);
  if (bajar > 0) ctx.drawImage(im, 0, 0, im.width, 2, ox, 0, w, oy + 2);   // franja de arriba: el borde superior del fotograma, estirado
  ctx.drawImage(im, ox, oy, w, h);
  const arriba = bloque === 'arriba';
  if (arriba) { const g = ctx.createLinearGradient(0, Y0, 0, Y0 + 640); g.addColorStop(0, 'rgba(0,0,0,0.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, Y0 + 640); }
  const lines = (texto.includes('/') ? texto.split('/') : texto.trim().split(/\s+/)).map((s) => s.trim().toUpperCase()).filter(Boolean);
  const esRoja = (l) => l.split(/\s+/).some((w) => nrm(w) === nrm(roja));
  const fit = (l, cap) => { let px = cap; ctx.font = `900 ${px}px Nunito`; while (px > 60 && ctx.measureText(l).width > MAXW) { px -= 4; ctx.font = `900 ${px}px Nunito`; } return px; };
  let L = lines.map((l) => ({ s: l, r: esRoja(l), px: fit(l, tam === 'igual' ? (arriba ? 175 : 210) : esRoja(l) ? (arriba ? 250 : 330) : (arriba ? 150 : 190)) }));
  if (tam === 'igual') { const m = Math.min(...L.map((q) => q.px)); L = L.map((q) => ({ ...q, px: m })); }
  const LH = 1.14, ET = 76, gap = 30, MG = 70, alto = () => ET + gap + L.reduce((a, q) => a + q.px * LH, 0) + MG;
  while (alto() > (arriba ? 620 : bloque === 'abajo' ? 640 : Y1 - Y0 - 80)) L = L.map((q) => ({ ...q, px: q.px * 0.95 }));
  const cyB = bloque === 'abajo' ? 1360 : 960; let y = arriba ? Y0 + 40 + ET / 2 : Math.min(Y1 - 40 - alto(), cyB - alto() / 2) + ET / 2;
  // etiqueta amarilla pequeña
  ctx.font = '900 44px Nunito'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const et = etiqueta.toUpperCase(), tw = ctx.measureText(et).width;
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 16; ctx.fillStyle = '#FFD23F'; ctx.beginPath(); ctx.roundRect(X - tw / 2 - 30, y - ET / 2, tw + 60, ET, 16); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = '#111111'; ctx.fillText(et, X, y + 2);
  const caja = [X - tw / 2 - 30, y - ET / 2, X + tw / 2 + 30, y + ET / 2]; y += ET / 2 + gap;
  ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
  for (const q of L) { ctx.font = `900 ${q.px}px Nunito`; const by = y + q.px * 0.86;
   ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 6; ctx.lineWidth = q.px * 0.13; ctx.strokeStyle = '#0a0612'; ctx.strokeText(q.s, X, by);
   ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
   if (modoRoja === 'palabra') { const ws = q.s.split(' '), sp = ctx.measureText(' ').width, tot = ctx.measureText(q.s).width; let xx = X - tot / 2; ctx.textAlign = 'left'; for (const w2 of ws) { ctx.fillStyle = nrm(w2) === nrm(roja) ? '#FF2D2D' : '#FFFFFF'; ctx.fillText(w2, xx, by); xx += ctx.measureText(w2).width + sp; } ctx.textAlign = 'center'; }
   else { ctx.fillStyle = q.r ? '#FF2D2D' : '#FFFFFF'; ctx.fillText(q.s, X, by); } const m = ctx.measureText(q.s).width; caja[0] = Math.min(caja[0], X - m / 2 - q.px * 0.065); caja[2] = Math.max(caja[2], X + m / 2 + q.px * 0.065); y += q.px * LH; }
  caja[3] = y;
  // marca discreta (abajo en la maqueta v1.30; debajo del texto en la v1.29)
  ctx.font = '800 34px Nunito'; ctx.letterSpacing = '6px'; ctx.textBaseline = 'middle'; const my = arriba ? Y1 - 50 : Math.min(Y1 - 30, y + 40);
  ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.strokeText(marca.toUpperCase(), X + 3, my); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillText(marca.toUpperCase(), X + 3, my); caja[3] = Math.max(caja[3], my + 20);
  return { url: c.toDataURL('image/jpeg', 0.93), caja: caja.map(Math.round) }; }, { img, texto, roja, etiqueta, marca, foco: Number(focoS), bloque, bajar: Number(bajarS), modoRoja, tam });
 fs.writeFileSync(salida, Buffer.from(res.url.split(',')[1], 'base64'));
 const [x0, y0, x1, y1] = res.caja, dentro = y0 >= 240 && y1 <= 1680 && x0 >= 0 && x1 <= 1080, centro = Math.abs((x0 + x1) / 2 - 540) <= 4;
 console.log(`portada: ${salida} · texto en x ${x0}-${x1} (centro ${Math.round((x0 + x1) / 2)}), y ${y0}-${y1} · recorte 3:4 (y 240-1680): ${dentro ? 'dentro' : 'FUERA'}`); await b.close();
 if (!dentro || !centro) process.exit(1);
})();
