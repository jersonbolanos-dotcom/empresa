// =====================================================================================================================
// estilos/_comun.js · PLANTILLA ASOMBROTECA v2.2 · BIBLIOTECA DE ESTILOS (pieles) — utilidades comunes
// Un estilo solo cambia la PIEL (fondo, forma de pintar, trazo, luz, acabado, transición, tipografía y sonidos del medio).
// El episodio sigue dibujando SU tema; para que cada estilo lo pinte a su manera, describe las figuras y su papel:
//   const pl = PL.piel();                               // la piel activa (o null sin estilo)
//   pl.fondo(ctx, t, { luz: 1 })                        // fondo a pantalla completa (cielo, papel, mesa, espacio…)
//   pl.forma(ctx, { tipo: 'elipse', x, y, rx, ry }, { rol: 'objeto', t })   // tipos: elipse, circulo, rect (x,y,w,h,r), poli (pts)
//   pl.linea(ctx, [[x, y], …], { rol: 'detalle', ancho: 8, p: 0..1, t, flecha })
//   pl.brillo(ctx, x, y, r, { rol: 'acento', t })       // sol, estrella, luz
//   roles: fondo, fondo2, objeto, objeto2, detalle, sombra, acento, rojo
// El motor aplica solo la pasada de acabado (pl.acabado) y dibuja DESPUÉS los textos grandes (titular, contador, fuente),
// con la tipografía y los colores del estilo y la palabra clave en rojo. Sonidos del medio: pl.sonidos.aparece(k, t), …
// =====================================================================================================================
(function () {
 const PL = window.PLANTILLA, P = PL.P, W = 1080, HH = 1920, TAU = Math.PI * 2;
 const C = (PL.estilosComun = {});
 const CACHE = {};
 C.W = W; C.HH = HH; C.TAU = TAU;
 C.cache = (clave, gen) => CACHE[clave] || (CACHE[clave] = gen());
 C.cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
 C.sm = (a, b, x) => { const u = C.cl((x - a) / (b - a)); return u * u * (3 - 2 * u); };
 C.hex = (h) => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
 C.rgba = (c, a = 1) => { const [r, g, b] = Array.isArray(c) ? c : C.hex(c); return `rgba(${r | 0},${g | 0},${b | 0},${a})`; };
 C.mix = (c1, c2, k) => { const a = Array.isArray(c1) ? c1 : C.hex(c1), b = Array.isArray(c2) ? c2 : C.hex(c2); return a.map((v, i) => Math.round(v + (b[i] - v) * k)); };
 C.tono = (c, f) => C.rgba(C.mix(c, f < 0 ? '#000000' : '#ffffff', Math.abs(f)));
 C.capa = (() => { const pool = []; return (i, w = W, h = HH) => { let c = pool[i]; if (!c || c.width !== w || c.height !== h) { c = H.layer(w, h); pool[i] = c; } const g = c.getContext('2d', { willReadFrequently: true }); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.clearRect(0, 0, w, h); return [c, g]; }; })();
 // ---------- figuras ----------
 C.trazar = (ctx, f) => { if (typeof f === 'function') { f(ctx); return; } ctx.beginPath();
  if (f.tipo === 'elipse') ctx.ellipse(f.x, f.y, f.rx, f.ry ?? f.rx, f.rot || 0, 0, TAU);
  else if (f.tipo === 'circulo') ctx.arc(f.x, f.y, f.r, 0, TAU);
  else if (f.tipo === 'rect') ctx.roundRect(f.x, f.y, f.w, f.h, f.r || 0);
  else if (f.tipo === 'poli') { f.pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); } };
 C.trazarPts = (ctx, pts, cerrar = true) => { ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); if (cerrar) ctx.closePath(); };
 // puntos del contorno (para deformarlo: barro, papel rasgado, píxel…)
 C.puntos = (f, n = 96) => { if (f.tipo === 'elipse' || f.tipo === 'circulo') { const rx = f.rx ?? f.r, ry = f.ry ?? f.rx ?? f.r, c = Math.cos(f.rot || 0), s = Math.sin(f.rot || 0), out = []; for (let i = 0; i < n; i++) { const a = (i / n) * TAU, x = Math.cos(a) * rx, y = Math.sin(a) * ry; out.push([f.x + x * c - y * s, f.y + x * s + y * c]); } return out; }
  const pts = f.tipo === 'rect' ? [[f.x, f.y], [f.x + f.w, f.y], [f.x + f.w, f.y + f.h], [f.x, f.y + f.h]] : f.pts || [];
  let L = 0; const seg = pts.map((q, i) => { const b = pts[(i + 1) % pts.length], l = Math.hypot(b[0] - q[0], b[1] - q[1]); L += l; return l; }), out = [];
  pts.forEach((q, i) => { const b = pts[(i + 1) % pts.length], k = Math.max(1, Math.round((seg[i] / L) * n)); for (let j = 0; j < k; j++) out.push([q[0] + (b[0] - q[0]) * (j / k), q[1] + (b[1] - q[1]) * (j / k)]); });
  return out; };
 C.caja = (f) => { if (f.tipo === 'elipse') return [f.x - f.rx, f.y - (f.ry ?? f.rx), f.x + f.rx, f.y + (f.ry ?? f.rx)]; if (f.tipo === 'circulo') return [f.x - f.r, f.y - f.r, f.x + f.r, f.y + f.r]; if (f.tipo === 'rect') return [f.x, f.y, f.x + f.w, f.y + f.h];
  const xs = (f.pts || [[0, 0]]).map((q) => q[0]), ys = (f.pts || [[0, 0]]).map((q) => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
 C.centro = (f) => { const b = C.caja(f); return [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2, b[2] - b[0], b[3] - b[1]]; };
 // deformar un contorno con ruido (amplitud en px; fase = «boil» en stop motion)
 C.deformar = (pts, amp, seed = 1, fase = 0, frec = 3) => { const nz = C.ruido(seed); return pts.map((q, i) => { const a = (i / pts.length) * TAU, d = nz.n3(Math.cos(a) * frec, Math.sin(a) * frec, fase * 0.37) * amp; const b = pts[(i + 1) % pts.length], z = pts[(i - 1 + pts.length) % pts.length], tx = b[0] - z[0], ty = b[1] - z[1], l = Math.hypot(tx, ty) || 1; return [q[0] + (ty / l) * d, q[1] - (tx / l) * d]; }); };
 C.ruido = (seed) => C.cache('nz' + seed, () => H.makeNoise(seed));
 // polilínea recortada (0..1 de su largo) para dibujar «en vivo»
 C.parcial = (pts, p = 1) => { if (p >= 1) return pts; if (p <= 0 || pts.length < 2) return pts.slice(0, 1); let L = 0; const ls = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); ls.push(l); L += l; }
  let rest = L * p; const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { if (rest >= ls[i - 1]) { out.push(pts[i]); rest -= ls[i - 1]; } else { const k = rest / ls[i - 1]; out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]); break; } } return out; };
 C.remuestrear = (pts, paso = 6) => { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(l / paso)); for (let j = 1; j <= n; j++) out.push([a[0] + (b[0] - a[0]) * (j / n), a[1] + (b[1] - a[1]) * (j / n)]); } return out; };
 C.punta = (ctx, a, b, tam, col) => { const ang = Math.atan2(b[1] - a[1], b[0] - a[0]); ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[0] - Math.cos(ang - 0.45) * tam, b[1] - Math.sin(ang - 0.45) * tam); ctx.lineTo(b[0] - Math.cos(ang + 0.45) * tam, b[1] - Math.sin(ang + 0.45) * tam); ctx.closePath(); ctx.fill(); ctx.restore(); };
 // ---------- texturas (se generan a baja resolución, una sola vez) ----------
 // C.textura(clave, w, h, (x, y) => [r, g, b, a]) → lienzo w×h (se escala a pantalla completa al dibujarlo)
 C.textura = (clave, w, h, fn) => C.cache('tx' + clave, () => { const c = H.layer(w, h), g = c.getContext('2d'), im = g.createImageData(w, h), d = im.data; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = fn(x, y), o = (y * w + x) * 4; d[o] = v[0]; d[o + 1] = v[1]; d[o + 2] = v[2]; d[o + 3] = v[3] ?? 255; } g.putImageData(im, 0, 0); return c; });
 C.pintarTextura = (ctx, tex, alfa = 1, modo = 'source-over') => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= alfa;   /* v2.5: multiplica la transparencia de quien llama (antes la pisaba) */ ctx.globalCompositeOperation = modo; ctx.imageSmoothingEnabled = true; ctx.drawImage(tex, 0, 0, W, HH); ctx.restore(); };
 // fibras / motas de papel (para cualquier papel: se dibuja encima con poca opacidad)
 C.fibras = (clave, n, col, seed = 3) => C.cache('fb' + clave, () => { const c = H.layer(W, HH), g = c.getContext('2d'), r = H.rng(seed); g.strokeStyle = col; for (let i = 0; i < n; i++) { const x = r() * W, y = r() * HH, a = r() * TAU, l = 6 + r() * 28; g.globalAlpha = 0.15 + r() * 0.45; g.lineWidth = 0.6 + r() * 1.2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); } return c; });
 // ---------- pasadas de acabado a pantalla completa ----------
 C.vineta = (ctx, a = 0.5, col = '0,0,0', r0 = 0.32) => { const g = ctx.createRadialGradient(W / 2, HH / 2, HH * r0, W / 2, HH / 2, HH * 0.62); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.restore(); };
 C.bloom = (ctx, amt = 0.8, filtro = 'brightness(0.85) contrast(2.4) saturate(1.3)') => { const [a, ga] = C.capa(10, 270, 480), [b, gb] = C.capa(11, 135, 240); ga.filter = filtro; ga.drawImage(ctx.canvas, 0, 0, 270, 480); ga.filter = 'none';
  const [a2, ga2] = C.capa(12, 270, 480); ga2.filter = 'blur(3px)'; ga2.drawImage(a, 0, 0); gb.filter = 'blur(5px)'; gb.drawImage(a, 0, 0, 135, 240);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5 * amt; ctx.drawImage(a2, 0, 0, W, HH); ctx.globalAlpha = 0.55 * amt; ctx.drawImage(b, 0, 0, W, HH); ctx.restore(); };
 const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16 - 0.5);
 // pixelar: baja la imagen a W/n × HH/n, la lleva a una paleta (con tramado Bayer 4×4 opcional) y la sube sin suavizar
 C.pixelar = (ctx, n = 4, paleta = null, dither = 0) => { const w = Math.round(W / n), h = Math.round(HH / n), [c, g] = C.capa(13, w, h); g.imageSmoothingEnabled = true; g.drawImage(ctx.canvas, 0, 0, w, h);
  if (paleta) { const im = g.getImageData(0, 0, w, h), d = im.data, pal = paleta.map((q) => (Array.isArray(q) ? q : C.hex(q))), memo = new Map();
   for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = (y * w + x) * 4, k = dither ? BAYER[(y & 3) * 4 + (x & 3)] * dither : 0, r = d[o] + k, gg = d[o + 1] + k, b = d[o + 2] + k, key = ((r >> 3) << 10) | ((gg >> 3) << 5) | (b >> 3);
    let best = memo.get(key); if (best === undefined) { let bd = 1e9; for (let i = 0; i < pal.length; i++) { const p = pal[i], dr = r - p[0], dg = gg - p[1], db = b - p[2], dd = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11; if (dd < bd) { bd = dd; best = i; } } memo.set(key, best); }
    const p = pal[best]; d[o] = p[0]; d[o + 1] = p[1]; d[o + 2] = p[2]; d[o + 3] = 255; } g.putImageData(im, 0, 0); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(c, 0, 0, W, HH); ctx.restore(); };
 // fósforo: la imagen pasa a un solo color (luminancia → tono del tubo)
 C.fosforo = (ctx, col = '#39ff6a', contraste = 1.25) => { const [c, g] = C.capa(14); g.filter = `grayscale(1) contrast(${contraste})`; g.drawImage(ctx.canvas, 0, 0); g.filter = 'none'; g.globalCompositeOperation = 'multiply'; g.fillStyle = col; g.fillRect(0, 0, W, HH);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, HH); ctx.drawImage(c, 0, 0); ctx.restore(); };
 C.escaneo = (ctx, t, o = {}) => { const paso = o.paso || 4, a = o.a ?? 0.22; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(0,0,0,${a})`; for (let y = 0; y < HH; y += paso) ctx.fillRect(0, y, W, Math.max(1, paso / 2));
  if (o.barra) { const yb = ((t * (o.vel || 140)) % (HH + 400)) - 200, g = ctx.createLinearGradient(0, yb - 160, 0, yb + 160); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, `rgba(255,255,255,${o.barra})`); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, yb - 160, W, 320); } ctx.restore(); };
 C.grano = (ctx, t, a = 0.05) => P.grano(ctx, t, a);
 C.desenfocar = (ctx, px) => { const [c, g] = C.capa(15); g.drawImage(ctx.canvas, 0, 0); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${px}px)`; ctx.drawImage(c, 0, 0); ctx.restore(); };
 // ---------- transiciones genéricas (cada estilo puede usar la suya) ----------
 C.fundido = (ctx, u, A, B) => { A(ctx); ctx.save(); ctx.globalAlpha = C.sm(0, 1, u); B(ctx); ctx.restore(); };
 // ---------- valores por defecto de una piel ----------
 const ROLES = ['fondo', 'fondo2', 'objeto', 'objeto2', 'detalle', 'sombra', 'acento', 'rojo'];
 C.colorRol = (pl, rol) => (pl.paleta && (pl.paleta[rol] || pl.paleta.objeto)) || '#888888';
 const DEF = {
  fondo(ctx) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = C.colorRol(this, 'fondo'); ctx.fillRect(0, 0, W, HH); ctx.restore(); },
  forma(ctx, f, o = {}) { ctx.save(); ctx.fillStyle = C.colorRol(this, o.rol || 'objeto'); C.trazar(ctx, f); ctx.fill(); ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); ctx.save(); ctx.strokeStyle = C.colorRol(this, o.rol || 'detalle'); ctx.lineWidth = o.ancho || 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; C.trazarPts(ctx, q, false); ctx.stroke(); ctx.restore(); },
  brillo(ctx, x, y, r, o = {}) { P.resplandor(ctx, x, y, r * 3, '255,220,140', 0.5); ctx.save(); ctx.fillStyle = C.colorRol(this, o.rol || 'acento'); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); },
  acabado() {},
  transicion(ctx, u, A, B) { C.fundido(ctx, u, A, B); },
 };
 C.registrar = (nombre, def) => { const pl = Object.assign({}, def); for (const k of Object.keys(DEF)) if (!pl[k]) pl[k] = DEF[k]; pl.sonidos = pl.sonidos || {}; pl.roles = ROLES; return PL.registrarPiel(nombre, pl); };
})();
