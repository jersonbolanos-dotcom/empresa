// =====================================================================================================
// estilo_abisal.js — motor del estilo «Bioluminescent Deep Sea» (Light & Imaging), tomado del código de referencia
// (styles/deep-sea.js) y adaptado a 1080x1920 vertical. Se conservan tal cual: sprites de brillo (spr/dot), capa
// lejana desenfocada (far/blurSprite), agua + bruma + rayos (water/haze), medusa con red nerviosa (jelly/NET),
// sifonóforo (siph), ctenóforo (comb), rape abisal (angler), muestreo de puntos (samplePts/textPts), enjambres y
// texto de plancton (swarm/gather), tipografía bioluminiscente (gtext), trazos de luz (gstroke/ring), corrientes de
// plancton con punta de flecha (current), destellos (sparkles), flick, comp y el acabado (viñeta + grano por fotograma).
// Cambios para vertical: la nieve marina cubre 1080x1920 con la misma densidad por área; textPts admite cuerpos
// grandes; el HUD es español y cualitativo (sin cifras de profundidad/temperatura inventadas) y a ≥30 px.
// Nuevo: silueta de submarino iluminada sólo por luz viva (subSil) y su vista «rayos X» luminosa (xray helpers).
// =====================================================================================================
(function () {
 const TAU = Math.PI * 2;
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
 const sm = (a, b, x) => H.smooth(a, b, x);
 const E = H.ease;
 const lerp = H.lerp;
 const WH = [255, 255, 255];
 const C = {
  cyan: [80, 232, 255], teal: [40, 230, 195], blue: [70, 140, 255], violet: [150, 120, 255],
  mag: [255, 80, 205], amber: [255, 172, 70], red: [255, 74, 60], snow: [178, 206, 228], green: [110, 255, 190],
  ice: [190, 250, 255],
 };
 const F = {
  title: (px) => `600 ${px}px "Fraunces"`,
  titleI: (px) => `italic 600 ${px}px "Fraunces"`,
  num: (px) => `700 ${px}px "Fraunces"`,
  label: (px) => `700 ${px}px "Space Grotesk"`,
  hud: (px) => `400 ${px}px "IBM Plex Mono"`,
 };
 const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
 const hsl = (h, s, l) => {
  h = (((h % 360) + 360) % 360) / 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
 };

 // ---------- glow sprites ----------
 const SPR = {};
 function spr(rgb, kind) {
  const key = kind + rgb.map((v) => v | 0).join(',');
  if (SPR[key]) return SPR[key];
  const S = 64, c = H.layer(S, S), x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  const hot = H.mix(rgb, WH, 0.6);
  if (kind === 'core') {
   g.addColorStop(0, H.rgba(WH, 1)); g.addColorStop(0.1, H.rgba(hot, 0.9)); g.addColorStop(0.3, H.rgba(rgb, 0.35));
   g.addColorStop(0.6, H.rgba(rgb, 0.08)); g.addColorStop(1, H.rgba(rgb, 0));
  } else if (kind === 'bokeh') {
   g.addColorStop(0, H.rgba(rgb, 0.45)); g.addColorStop(0.7, H.rgba(rgb, 0.55)); g.addColorStop(0.88, H.rgba(rgb, 0.8)); g.addColorStop(1, H.rgba(rgb, 0));
  } else {
   g.addColorStop(0, H.rgba(hot, 1)); g.addColorStop(0.12, H.rgba(rgb, 0.75)); g.addColorStop(0.35, H.rgba(rgb, 0.22));
   g.addColorStop(0.65, H.rgba(rgb, 0.05)); g.addColorStop(1, H.rgba(rgb, 0));
  }
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  return (SPR[key] = c);
 }
 function dot(ctx, x, y, r, rgb, a, kind) {
  if (a <= 0.004 || r <= 0.2) return;
  const ga = ctx.globalAlpha;
  ctx.globalAlpha = Math.min(1, a);
  ctx.drawImage(spr(rgb.map((v) => Math.round(v / 4) * 4), kind || 'soft'), x - r, y - r, 2 * r, 2 * r);
  ctx.globalAlpha = ga;
 }

 // ---------- far, out-of-focus layer ----------
 let FAR = null;
 function far(ctx, W, Hh, fn, a, blur) {
  if (a <= 0.004) return;
  const fw = Math.ceil(W / 3), fh = Math.ceil(Hh / 3);
  if (!FAR || FAR.w !== fw) { FAR = { w: fw, a: H.layer(fw, fh), b: H.layer(fw, fh) }; }
  const xa = FAR.a.getContext('2d'), xb = FAR.b.getContext('2d');
  xa.setTransform(1, 0, 0, 1, 0, 0); xa.globalAlpha = 1; xa.globalCompositeOperation = 'source-over'; xa.clearRect(0, 0, fw, fh);
  xa.setTransform(1 / 3, 0, 0, 1 / 3, 0, 0); fn(xa); xa.setTransform(1, 0, 0, 1, 0, 0);
  xb.setTransform(1, 0, 0, 1, 0, 0); xb.globalCompositeOperation = 'source-over'; xb.clearRect(0, 0, fw, fh);
  xb.filter = `blur(${blur == null ? 1 : blur}px)`; xb.drawImage(FAR.a, 0, 0); xb.filter = 'none';
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(FAR.b, 0, 0, fw * 3, fh * 3); ctx.restore();
 }
 const FSPR = {};
 function blurSprite(w, h, sc, blur, fn) {
  const cw = Math.ceil(w * sc), ch = Math.ceil(h * sc), a = H.layer(cw, ch), b = H.layer(cw, ch);
  const xa = a.getContext('2d'); xa.setTransform(sc, 0, 0, sc, 0, 0); fn(xa);
  const xb = b.getContext('2d'); xb.filter = `blur(${blur}px)`; xb.drawImage(a, 0, 0); xb.filter = 'none';
  return b;
 }
 // far animals for the vertical frame (same recipe as the reference's FARJ)
 const FARJ = [
  { x: 960, y: 1650, s: 30, ph: 0.3, on: 0.42, col: C.blue, tent: 7, tl: 80, dr: 0.21, sw: 18, v: 3 },
  { x: 110, y: 1180, s: 22, ph: 0.7, on: 0.38, col: C.teal, tent: 6, tl: 58, tilt: 0.3, dr: 0.17, sw: 14, v: 2 },
  { x: 720, y: 1900, s: 26, ph: 0.5, on: 0.35, col: C.violet, tent: 6, tl: 64, tilt: -0.2, dr: 0.13, sw: 30, v: 4 },
  { x: 260, y: 2300, s: 18, ph: 0.1, on: 0.3, col: C.blue, tent: 6, tl: 50, dr: 0.19, sw: 12, v: 3 },
 ];
 function farJelly(i, J) {
  if (FSPR['j' + i]) return FSPR['j' + i];
  const w = J.s * 5, h = J.s * 2.6 + J.tl + 30, ox = w / 2, oy = J.s * 2.3;
  const cv = blurSprite(w, h, 0.5, 1.4, (x) => { jelly(x, { x: ox, y: oy, s: J.s, t: 1.3 + i, ph: J.ph, on: 1, col: J.col, tent: J.tent, tl: J.tl }); });
  return (FSPR['j' + i] = { cv, w, h, ox, oy });
 }
 function farStrand() {
  if (FSPR.strand) return FSPR.strand;
  const w = 1080, h = 2100, ch = [];
  for (let i = 0; i < 24; i++) { const f = i / 23; ch.push([1040 - f * 200 + Math.sin(f * 3) * 22, f * 2000]); }
  const cv = blurSprite(w, h, 1 / 3, 1.1, (x) => siph(x, ch, 0.7, (i) => 0.3 + 0.3 * Math.sin(-i * 0.5), 0.8, 0.36, C.violet, C.blue));
  return (FSPR.strand = { cv, w, h });
 }
 function farLayer(ctx, t, camY, fa) {
  if (fa <= 0.004) return;
  const py = camY * 0.14;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  FARJ.forEach((J, i) => {
   const sp = farJelly(i, J), c = Math.pow(0.5 + 0.5 * Math.sin(TAU * (t * 0.45 + J.ph)), 2);
   const x = J.x + Math.sin(t * J.dr + i * 1.3) * J.sw, y = ((J.y - py - t * J.v) % 2400 + 2400) % 2400 - 200;
   ctx.globalAlpha = fa * J.on;
   ctx.save(); ctx.translate(x, y); ctx.rotate(J.tilt || 0); ctx.scale(1 - 0.1 * c, 1 + 0.06 * c);
   ctx.drawImage(sp.cv, -sp.ox, -sp.oy, sp.w, sp.h); ctx.restore();
  });
  const st = farStrand();
  ctx.globalAlpha = fa * (0.8 + 0.2 * Math.sin(t * 0.9));
  const sy = ((-py * 1.4) % 2100 + 2100) % 2100;
  ctx.drawImage(st.cv, Math.sin(t * 0.4) * 14, sy - 2100, st.w, st.h); ctx.drawImage(st.cv, Math.sin(t * 0.4) * 14, sy, st.w, st.h);
  ctx.restore();
 }

 // ---------- water ----------
 let HAZE = null;
 function haze() {
  if (HAZE) return HAZE;
  const w = 90, h = 160, c = H.layer(w, h), x = c.getContext('2d'), nz = H.makeNoise(5150), img = x.createImageData(w, h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
   const v = cl(nz.fbm2(i * 0.04, j * 0.025, 4) * 0.7 + 0.45), k = (j * w + i) * 4;
   img.data[k] = 20; img.data[k + 1] = 70; img.data[k + 2] = 105; img.data[k + 3] = 255 * v * v;
  }
  x.putImageData(img, 0, 0);
  return (HAZE = c);
 }
 function water(ctx, W, Hh, t, depth, rays) {
  const top = H.mix([12, 44, 74], [3, 12, 26], depth), mid = H.mix([4, 20, 40], [1, 6, 15], depth);
  const g = ctx.createLinearGradient(0, 0, 0, Hh);
  g.addColorStop(0, H.rgba(top)); g.addColorStop(0.5, H.rgba(mid)); g.addColorStop(1, 'rgb(0,2,6)');
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = Math.max(0.11, 0.16 * (1 - depth * 0.55));
  ctx.drawImage(haze(), -60 + Math.sin(t * 0.13) * 40, -30 + Math.cos(t * 0.1) * 20, W + 120, Hh + 60);
  ctx.globalAlpha = 1;
  const vf = ctx.createLinearGradient(0, 0, 0, Hh * 0.55);
  vf.addColorStop(0, 'rgba(14,52,84,0.2)'); vf.addColorStop(0.45, 'rgba(10,40,70,0.07)'); vf.addColorStop(1, 'rgba(10,40,70,0)');
  ctx.fillStyle = vf; ctx.fillRect(0, 0, W, Hh * 0.55);
  if (rays > 0.01) {
   const sc = 1.5;
   for (let i = 0; i < 6; i++) {
    const xc = 60 + i * 190 + Math.sin(t * 0.35 + i * 2.1) * 35, wt = 18 + (i % 3) * 16, len = (360 + (i % 2) * 120) * sc;
    const fl = 0.55 + 0.45 * Math.sin(t * 0.9 + i * 1.7);
    const gr = ctx.createLinearGradient(0, 0, 0, len);
    gr.addColorStop(0, `rgba(110,195,225,${0.075 * rays * fl})`); gr.addColorStop(1, 'rgba(110,195,225,0)');
    ctx.globalAlpha = 1; ctx.fillStyle = gr; ctx.beginPath();
    ctx.moveTo(xc - wt, -5); ctx.lineTo(xc + wt, -5); ctx.lineTo(xc + wt * 2.6 + len * 0.22, len); ctx.lineTo(xc - wt * 1.4 + len * 0.22, len); ctx.fill();
   }
   ctx.lineWidth = 1.2;
   for (let k = 0; k < 4; k++) {
    ctx.strokeStyle = `rgba(140,215,240,${0.05 * rays})`; ctx.beginPath();
    for (let x = 0; x <= W; x += 16) ctx.lineTo(x, 8 + k * 7 + Math.sin(x * 0.02 + t * 1.3 + k * 2) * 3 + Math.sin(x * 0.051 - t * 0.9) * 2);
    ctx.stroke();
   }
  }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
 }

 // ---------- marine snow (3 parallax layers; same density per area as the 1280x720 reference) ----------
 let SNOW = null;
 function snowData() {
  if (SNOW) return SNOW;
  const R = H.rng(4242), A = (1080 * 1920) / (1280 * 720);
  const spec = [
   { n: Math.round(260 * A), z: 0.3, r: [0.5, 1.1], a: [0.14, 0.38], v: [3, 8] },
   { n: Math.round(110 * A), z: 0.65, r: [0.9, 1.9], a: [0.28, 0.58], v: [6, 13] },
   { n: Math.round(16 * A), z: 1.6, r: [7, 22], a: [0.035, 0.09], v: [10, 22], bokeh: true },
  ];
  SNOW = spec.map((L) => ({ ...L, ps: Array.from({ length: L.n }, () => ({
   x: R() * 1200, y: R() * 2040, r: R.range(L.r[0], L.r[1]), a: R.range(L.a[0], L.a[1]), v: R.range(L.v[0], L.v[1]),
   ph: R() * TAU, f: R.range(0.2, 0.7), sw: R.range(2, 9),
  })) }));
  return SNOW;
 }
 function snow(ctx, W, Hh, t, camY, camX, vel, lights, amt) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const spanY = Hh + 120, spanX = W + 120;
  for (const L of snowData()) for (const p of L.ps) {
   const y = (((p.y + t * p.v - camY * L.z) % spanY) + spanY) % spanY - 60;
   const x = (((p.x + Math.sin(t * p.f + p.ph) * p.sw - camX * L.z) % spanX) + spanX) % spanX - 60;
   const a = p.a * amt;
   let lit = 0, lc = null;
   if (lights) for (const l of lights) { const d = Math.hypot(x - l.x, y - l.y); if (d < l.r) { const v = l.k * (1 - d / l.r) ** 2; if (v > lit) { lit = v; lc = l.col; } } }
   const st = vel * L.z * 0.045;
   if (L.bokeh) { dot(ctx, x, y, p.r * (1 + Math.min(2, Math.abs(st) * 0.01)), lc && lit > 0.05 ? lc : C.snow, a + lit * 0.12, 'bokeh'); continue; }
   if (Math.abs(st) > 2.5) {
    ctx.globalAlpha = cl((a + lit) * 1.4 / (1 + Math.abs(st) * 0.03));
    ctx.strokeStyle = 'rgb(178,206,228)'; ctx.lineWidth = p.r * 1.3;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + st); ctx.stroke();
   } else {
    dot(ctx, x, y, p.r * 2.8, C.snow, a);
    if (lit > 0.02) dot(ctx, x, y, p.r * 3.5, lc, lit);
   }
  }
  ctx.restore();
 }

 function sparkles(ctx, cx, cy, rx, ry, t, seed, n, a, col, rate) {
  if (a <= 0.01) return;
  const R = H.rng(seed);
  for (let i = 0; i < n; i++) {
   const ang = R() * TAU, rr = Math.sqrt(R()), ph = R() * TAU, sp = (rate || 3) * (0.6 + R()), sz = R.range(3, 7);
   const fl = Math.pow(Math.max(0, Math.sin(t * sp + ph)), 6);
   if (fl < 0.02) continue;
   dot(ctx, cx + Math.cos(ang) * rr * rx, cy + Math.sin(ang) * rr * ry, sz, col || C.cyan, a * fl, 'core');
  }
 }

 // ---------- jellyfish ----------
 const NET = (() => {
  const R = H.rng(919), nodes = [], edges = [];
  [[0.3, 3], [0.56, 5], [0.8, 7]].forEach(([rr, n], li) => {
   for (let i = 0; i < n; i++) {
    const a = lerp(0.3, Math.PI - 0.3, i / (n - 1)) + R.range(-0.06, 0.06);
    nodes.push({ u: Math.cos(a) * rr, v: Math.sin(a) * rr * 0.98 + 0.04, L: li });
   }
  });
  nodes.push({ u: 0, v: 0.12, L: -1 });
  const hub = nodes.length - 1;
  nodes.forEach((n, i) => {
   if (n.L < 0) return;
   if (n.L === 0) edges.push({ a: hub, b: i });
   const next = nodes.map((m, j) => ({ j, m })).filter((o) => o.m.L === n.L + 1)
    .sort((p, q) => Math.hypot(p.m.u - n.u, p.m.v - n.v) - Math.hypot(q.m.u - n.u, q.m.v - n.v)).slice(0, 2);
   next.forEach((o) => edges.push({ a: i, b: o.j }));
   const same = nodes.map((m, j) => ({ j, m })).filter((o) => o.m.L === n.L && o.j > i).sort((p, q) => Math.abs(p.m.u - n.u) - Math.abs(q.m.u - n.u));
   if (same.length && R() < 0.5) edges.push({ a: i, b: same[0].j });
  });
  edges.forEach((e) => { e.w0 = R.range(0.15, 1); e.w1 = cl(e.w0 + R.range(-0.7, 0.7), 0.12, 1); });
  return { nodes, edges, hub };
 })();

 function jelly(ctx, J) {
  const on = J.on == null ? 1 : J.on;
  if (on <= 0.003) return null;
  const { x, s, t } = J, col = J.col || C.cyan, acc = J.acc || C.mag, hot = H.mix(col, WH, 0.45);
  const c = Math.pow(0.5 + 0.5 * Math.sin(TAU * (t * (J.rate || 0.45) + (J.ph || 0))), 2);
  const w = s * (1 - 0.12 * c), h = s * 0.8 * (1 + 0.08 * c), y = J.y - c * s * 0.04;
  const rimY = (u) => y + h * 0.12 * Math.sqrt(Math.max(0, 1 - u * u));
  ctx.save();
  ctx.translate(x, y); ctx.rotate(J.tilt || 0); ctx.translate(-x, -y);
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const n = J.tent || 14, TL = J.tl || s * 2;
  for (let i = 0; i < n; i++) {
   const u = -0.92 + 1.84 * i / (n - 1), bx = x + u * w, by = rimY(u), L = TL * (0.6 + 0.4 * hash(i + 3.3));
   const pts = [];
   for (let j = 0; j <= 24; j++) {
    const f = j / 24;
    pts.push([bx + u * w * 0.22 * f + Math.sin(t * 1.6 - f * 6.5 + i * 1.9) * s * 0.11 * f + (J.sway || 0) * f * f * L, by + f * L * (1 - 0.1 * c)]);
   }
   const tg = ctx.createLinearGradient(0, by, 0, by + L);
   tg.addColorStop(0, H.rgba(col, 0.5 * on)); tg.addColorStop(0.5, H.rgba(col, 0.22 * on)); tg.addColorStop(1, H.rgba(col, 0));
   ctx.globalAlpha = 1; ctx.strokeStyle = tg;
   ctx.lineWidth = 5; ctx.globalAlpha = 0.18; ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
   ctx.lineWidth = 1.1; ctx.globalAlpha = 1; ctx.stroke();
   const fb = (t * 0.42 + hash(i)) % 1, pb = pts[Math.min(24, Math.round(fb * 24))];
   dot(ctx, pb[0], pb[1], 8, col, 0.75 * on * (1 - fb));
  }
  for (let k = 0; k < 4; k++) {
   const ox = x + (k - 1.5) * w * 0.12, L = TL * 0.42, oc = H.mix(col, acc, 0.35);
   ctx.beginPath();
   for (let j = 0; j <= 20; j++) { const f = j / 20; ctx.lineTo(ox + Math.sin(t * 1.2 - f * 4 + k * 1.3) * s * 0.07 * f + (k - 1.5) * s * 0.05 * f + (J.sway || 0) * f * f * L * 0.6, y + h * 0.08 + f * L); }
   ctx.globalAlpha = 1; ctx.strokeStyle = H.rgba(oc, 0.06 * on); ctx.lineWidth = s * 0.09; ctx.stroke();
   ctx.strokeStyle = H.rgba(oc, 0.2 * on); ctx.lineWidth = 1.4; ctx.stroke();
  }
  const bellPath = (k, dy) => {
   ctx.beginPath(); ctx.moveTo(x - w * k, y + dy);
   ctx.bezierCurveTo(x - w * k * 1.03, y - h * k * 0.72 + dy, x - w * k * 0.62, y - h * k * 1.02 + dy, x, y - h * k * 1.02 + dy);
   ctx.bezierCurveTo(x + w * k * 0.62, y - h * k * 1.02 + dy, x + w * k * 1.03, y - h * k * 0.72 + dy, x + w * k, y + dy);
  };
  bellPath(1, 0);
  const N = 16;
  for (let i = 1; i <= N; i++) { const u1 = 1 - 2 * i / N, um = 1 - (2 * i - 1) / N; ctx.quadraticCurveTo(x + um * w, rimY(um) + h * 0.07, x + u1 * w, rimY(u1)); }
  ctx.closePath();
  const bg = ctx.createRadialGradient(x, y - h * 0.42, 0, x, y - h * 0.42, w * 1.08);
  bg.addColorStop(0, H.rgba(col, 0.07 * on)); bg.addColorStop(0.6, H.rgba(col, 0.1 * on)); bg.addColorStop(0.86, H.rgba(col, 0.24 * on)); bg.addColorStop(1, H.rgba(col, 0));
  ctx.globalAlpha = 1; ctx.fillStyle = bg; ctx.fill();
  ctx.strokeStyle = H.rgba(col, 0.16 * on); ctx.lineWidth = 1.2; bellPath(0.7, h * 0.06); ctx.stroke();
  for (let i = 0; i < 9; i++) {
   const u = -0.88 + 1.76 * i / 8;
   ctx.beginPath(); ctx.moveTo(x + u * w * 0.1, y - h * 0.97); ctx.quadraticCurveTo(x + u * w * 0.82, y - h * 0.85 * Math.sqrt(1 - u * u * 0.6), x + u * w * 0.98, rimY(u));
   ctx.strokeStyle = H.rgba(col, 0.1 * on); ctx.lineWidth = 1; ctx.stroke();
  }
  if (J.gon) for (let k = -1; k <= 1; k++) {
   const gx = x + k * w * 0.36, gy = y - h * (0.42 - Math.abs(k) * 0.06), gr = w * 0.11;
   ctx.beginPath(); ctx.ellipse(gx, gy, gr, gr * 0.75, 0, 0, TAU);
   ctx.strokeStyle = H.rgba(acc, 0.12 * on * J.gon); ctx.lineWidth = 9; ctx.stroke();
   ctx.strokeStyle = H.rgba(H.mix(acc, WH, 0.3), 0.4 * on * J.gon); ctx.lineWidth = 2; ctx.stroke();
  }
  bellPath(1, 0);
  ctx.strokeStyle = H.rgba(col, 0.1 * on); ctx.lineWidth = 10; ctx.stroke();
  ctx.strokeStyle = H.rgba(hot, 0.6 * on); ctx.lineWidth = 1.8; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, w, h * 0.12, 0, Math.PI, TAU); ctx.strokeStyle = H.rgba(col, 0.18 * on); ctx.lineWidth = 1.2; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, w, h * 0.12, 0, 0, Math.PI); ctx.strokeStyle = H.rgba(hot, 0.5 * on); ctx.lineWidth = 2; ctx.stroke();
  for (let i = 0; i <= 26; i++) {
   const u = -1 + 2 * i / 26, pul = Math.pow(Math.max(0, Math.sin(u * 5 - t * 4 + (J.ph || 0) * 9)), 6);
   dot(ctx, x + u * w, rimY(u), 5 + pul * 8, i % 5 === 2 ? acc : col, (0.35 + 0.65 * pul) * on);
  }
  let pos = null;
  if (J.net) {
   const Nn = J.net, na = Nn.a == null ? 1 : Nn.a;
   pos = NET.nodes.map((nd) => [x + nd.u * w, y - nd.v * h * 0.98]);
   NET.edges.forEach((e, i) => {
    const p = pos[e.a], q = pos[e.b], wg = Nn.ew ? Nn.ew(e, i) : e.w0, ec = Nn.ec ? Nn.ec(e, i) : col;
    const a = (0.2 + 0.6 * wg) * on * na;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = H.rgba(ec, a * 0.22); ctx.lineWidth = 3 + wg * 6; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
    ctx.strokeStyle = H.rgba(H.mix(ec, WH, 0.35), a); ctx.lineWidth = 0.6 + wg * 2.2; ctx.stroke();
    const pu = Nn.pulse ? Nn.pulse(e, i) : -1;
    if (pu >= 0 && pu <= 1) dot(ctx, lerp(p[0], q[0], pu), lerp(p[1], q[1], pu), 14, Nn.pc || ec, on * na, 'core');
   });
   pos.forEach((p, i) => {
    const act = Nn.act ? Nn.act(i) : 0.5, nc = Nn.nc ? Nn.nc(i) : col;
    dot(ctx, p[0], p[1], 14 + act * 26, nc, (0.3 + 0.7 * act) * on * na);
    dot(ctx, p[0], p[1], 5 + act * 4, nc, (0.55 + 0.45 * act) * on * na, 'core');
   });
  }
  dot(ctx, x, y - h * 0.4, w * 2.1, col, 0.09 * on);
  ctx.restore();
  return { x, y, w, h, pos };
 }

 // ---------- siphonophore chain ----------
 function siph(ctx, pts, t, lit, sc, a, colDim, colLit, colOf) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  colDim = colDim || C.violet; colLit = colLit || C.cyan;
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.globalAlpha = 1; ctx.strokeStyle = H.rgba(colDim, 0.12 * a); ctx.lineWidth = 6 * sc; ctx.stroke();
  ctx.strokeStyle = H.rgba(H.mix(colDim, WH, 0.3), 0.4 * a); ctx.lineWidth = 1.2; ctx.stroke();
  pts.forEach((p, i) => {
   const q = pts[Math.max(0, i - 1)], r = pts[Math.min(pts.length - 1, i + 1)], ang = Math.atan2(r[1] - q[1], r[0] - q[0]);
   const L = cl(lit(i)), col = H.mix(colDim, colOf ? colOf(i) : colLit, L), al = a * (0.35 + 0.65 * L);
   const wob = Math.sin(t * 2.2 - i * 0.7) * 0.12;
   ctx.globalAlpha = 1; ctx.strokeStyle = H.rgba(col, 0.22 * al); ctx.lineWidth = 0.9;
   for (const sd of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(p[0], p[1]);
    for (let j = 1; j <= 8; j++) ctx.lineTo(p[0] + sd * j * 1.5 * sc + Math.sin(t * 1.8 + j * 0.8 + i) * 3 * sc, p[1] + j * 5 * sc);
    ctx.stroke();
   }
   ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(ang + wob);
   const rx = 15 * sc, ry = 10 * sc;
   const g = ctx.createRadialGradient(-rx * 0.2, 0, 0, 0, 0, rx);
   g.addColorStop(0, H.rgba(col, 0.32 * al)); g.addColorStop(0.75, H.rgba(col, 0.1 * al)); g.addColorStop(1, H.rgba(col, 0));
   ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.fill();
   ctx.strokeStyle = H.rgba(H.mix(col, WH, 0.4), 0.65 * al); ctx.lineWidth = 1.3;
   ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, -Math.PI * 0.85, Math.PI * 0.85); ctx.stroke();
   ctx.beginPath(); ctx.ellipse(rx * 0.15, 0, rx * 0.55, ry * 0.55, 0, 0, TAU); ctx.strokeStyle = H.rgba(col, 0.35 * al); ctx.stroke();
   ctx.restore();
   dot(ctx, p[0], p[1], 26 * sc * (1 + L * 0.8), col, al * 0.55);
   dot(ctx, p[0], p[1], 7 * sc, col, al * (0.25 + 0.75 * L), 'core');
  });
  ctx.restore();
 }

 // ---------- comb jelly ----------
 function comb(ctx, x, y, s, t, a, tilt) {
  if (a <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt || 0); ctx.globalCompositeOperation = 'lighter';
  const rx = s * 0.62, ry = s;
  const g = ctx.createRadialGradient(0, -ry * 0.2, 0, 0, 0, ry);
  g.addColorStop(0, `rgba(150,200,255,${0.05 * a})`); g.addColorStop(0.8, `rgba(150,200,255,${0.08 * a})`); g.addColorStop(1, 'rgba(150,200,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = `rgba(170,215,255,${0.25 * a})`; ctx.lineWidth = 1.2; ctx.stroke();
  for (const sd of [-1, 1]) {
   ctx.beginPath(); ctx.moveTo(sd * rx * 0.3, ry * 0.2);
   for (let j = 1; j <= 20; j++) ctx.lineTo(sd * (rx * 0.3 + j * 2.5) + Math.sin(t * 1.5 - j * 0.4) * 6, ry * 0.2 + j * s * 0.09);
   ctx.strokeStyle = `rgba(170,215,255,${0.16 * a})`; ctx.lineWidth = 1; ctx.stroke();
  }
  [-0.92, -0.62, -0.25, 0.25, 0.62, 0.92].forEach((u, row) => {
   for (let j = 0; j < 15; j++) {
    const th = lerp(0.35, 2.75, j / 14), px = u * rx * Math.sin(th), py = -ry * Math.cos(th);
    const wave = Math.pow(0.5 + 0.5 * Math.sin(th * 7 - t * 8 + row * 0.9), 3);
    const col = hsl(th * 110 - t * 260 + row * 45, 1, 0.62);
    dot(ctx, px, py, 3 + wave * 6, col, a * (0.2 + 0.8 * wave) * (1 - Math.abs(u) * 0.35), 'core');
   }
  });
  ctx.restore();
 }

 // ---------- anglerfish (verbatim recipe) ----------
 function angler(ctx, x, y, s, t, lure, a, flip) {
  const k = s / 100, dir = flip ? -1 : 1;
  const lx = 98, ly = -100 + Math.sin(t * 1.4) * 5 + Math.sin(t * 0.7) * 3;
  const wl = [x + lx * k * dir, y + ly * k];
  ctx.save(); ctx.globalAlpha = a;
  ctx.translate(x, y); ctx.scale(k * dir, k);
  ctx.globalCompositeOperation = 'lighter';
  dot(ctx, lx, ly, 330, C.amber, 0.16 * lure * a);
  ctx.globalCompositeOperation = 'source-over';
  const body = () => {
   ctx.beginPath(); ctx.moveTo(-118, -6);
   ctx.lineTo(-168, -46); ctx.quadraticCurveTo(-160, 0, -168, 44); ctx.lineTo(-118, 8);
   ctx.bezierCurveTo(-90, 48, -10, 74, 62, 58);
   ctx.quadraticCurveTo(92, 48, 102, 16);
   ctx.quadraticCurveTo(60, 20, 42, 8);
   ctx.quadraticCurveTo(64, -6, 90, -14);
   ctx.bezierCurveTo(78, -62, -20, -78, -118, -6);
   ctx.closePath();
  };
  ctx.beginPath(); ctx.moveTo(-40, -58); ctx.quadraticCurveTo(-64, -84, -96, -70); ctx.quadraticCurveTo(-92, -48, -108, -22); ctx.lineTo(-64, -42); ctx.closePath();
  ctx.fillStyle = 'rgba(9,9,12,0.92)'; ctx.fill();
  ctx.strokeStyle = `rgba(190,140,96,${0.05 + 0.12 * lure})`; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = `rgba(190,140,96,${0.06 * lure})`; ctx.lineWidth = 0.8;
  for (let i = 0; i < 5; i++) { const f = i / 4; ctx.beginPath(); ctx.moveTo(lerp(-46, -98, f), lerp(-54, -34, f)); ctx.lineTo(lerp(-58, -98, f), lerp(-78, -64, f)); ctx.stroke(); }
  const lg = ctx.createRadialGradient(lx, ly, 10, lx, ly, 270);
  lg.addColorStop(0, H.rgba(H.mix([8, 10, 14], [140, 96, 60], lure))); lg.addColorStop(0.2, H.rgba(H.mix([8, 10, 14], [92, 64, 44], lure)));
  lg.addColorStop(0.35, H.rgba(H.mix([7, 9, 13], [44, 32, 27], lure))); lg.addColorStop(0.55, H.rgba(H.mix([5, 7, 11], [16, 14, 16], lure)));
  lg.addColorStop(1, 'rgb(3,5,9)');
  body(); ctx.fillStyle = lg; ctx.fill();
  ctx.save(); body(); ctx.clip();
  const sh = ctx.createLinearGradient(0, -40, 0, 70);
  sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(0.5, 'rgba(2,3,6,0.45)'); sh.addColorStop(1, 'rgba(2,3,6,0.85)');
  ctx.fillStyle = sh; ctx.fillRect(-180, -90, 300, 170);
  ctx.globalCompositeOperation = 'lighter';
  const hl = ctx.createRadialGradient(lx - 30, ly + 52, 0, lx - 30, ly + 52, 150);
  hl.addColorStop(0, `rgba(255,168,92,${0.22 * lure})`); hl.addColorStop(0.5, `rgba(255,150,80,${0.07 * lure})`); hl.addColorStop(1, 'rgba(255,150,80,0)');
  ctx.fillStyle = hl; ctx.fillRect(-180, -90, 300, 170);
  const sg = ctx.createRadialGradient(lx - 40, ly + 30, 0, lx - 40, ly + 30, 170);
  sg.addColorStop(0, `rgba(255,214,160,${0.07 * lure})`); sg.addColorStop(1, 'rgba(255,214,160,0)');
  ctx.save(); ctx.translate(0, 6); body(); ctx.restore(); ctx.strokeStyle = sg;
  for (let i = 0; i < 6; i++) { ctx.lineWidth = 26 - i * 4; ctx.stroke(); }
  for (let i = 0; i < 8; i++) {
   const f = i / 7, px = lerp(-96, 36, f), py = lerp(-2, -24, f) + Math.sin(f * 7) * 3, d = Math.hypot(px - lx, py - ly);
   dot(ctx, px, py, 3.2, [255, 196, 140], 0.85 * lure * cl(1.25 - d / 240), 'core');
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
  const rg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 230);
  rg.addColorStop(0, `rgba(255,198,120,${0.85 * lure})`); rg.addColorStop(1, 'rgba(255,190,110,0)');
  body(); ctx.strokeStyle = rg; ctx.lineWidth = 2.2; ctx.stroke();
  ctx.strokeStyle = `rgba(170,120,84,${0.28 * lure})`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-100, 0); ctx.quadraticCurveTo(-30, -14, 40, -30); ctx.stroke();
  ctx.strokeStyle = `rgba(170,120,84,${0.1 * lure})`; ctx.lineWidth = 0.8;
  for (let i = 0; i < 5; i++) { const f = (i - 2) / 2; ctx.beginPath(); ctx.moveTo(-122, f * 4); ctx.lineTo(-164, f * 38); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-20, 22); ctx.quadraticCurveTo(-52, 40, -44, 64); ctx.quadraticCurveTo(-26, 46, -6, 34); ctx.closePath();
  ctx.fillStyle = 'rgba(16,14,16,0.9)'; ctx.fill(); ctx.strokeStyle = `rgba(200,150,100,${0.22 * lure})`; ctx.stroke();
  ctx.fillStyle = `rgba(235,225,205,${0.12 + 0.6 * lure})`;
  for (let i = 0; i < 8; i++) { const f = i / 7, tx = lerp(88, 50, f), ty = lerp(-12, 4, f), tl = 13 - Math.abs(f - 0.4) * 10;
   ctx.beginPath(); ctx.moveTo(tx - 2, ty); ctx.lineTo(tx + 2, ty); ctx.lineTo(tx + 1, ty + tl); ctx.fill(); }
  for (let i = 0; i < 7; i++) { const f = i / 6, tx = lerp(98, 54, f), ty = lerp(14, 14, f) + Math.sin(f * 3) * 3, tl = 15 - Math.abs(f - 0.3) * 12;
   ctx.beginPath(); ctx.moveTo(tx - 2, ty); ctx.lineTo(tx + 2, ty); ctx.lineTo(tx - 1, ty - tl); ctx.fill(); }
  ctx.beginPath(); ctx.arc(30, -32, 7, 0, TAU); ctx.fillStyle = '#020305'; ctx.fill();
  ctx.strokeStyle = `rgba(200,220,210,${0.15 + 0.4 * lure})`; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.globalCompositeOperation = 'lighter'; dot(ctx, 27, -35, 3, C.ice, 0.5 * lure, 'core');
  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath(); ctx.moveTo(18, -56); ctx.quadraticCurveTo(46, -150, lx, ly);
  ctx.strokeStyle = `rgba(${lerp(30, 120, lure) | 0},${lerp(28, 90, lure) | 0},${lerp(30, 70, lure) | 0},1)`; ctx.lineWidth = 2.6; ctx.stroke();
  ctx.globalCompositeOperation = 'lighter';
  dot(ctx, lx, ly, 120, C.amber, 0.55 * lure * a);
  dot(ctx, lx, ly, 34, C.amber, lure * a, 'core');
  dot(ctx, lx, ly, 12, [255, 240, 200], lure * a, 'core');
  ctx.restore();
  return wl;
 }

 // ---------- point sampling ----------
 const PTS = {};
 function samplePts(key, w, h, step, drawFn) {
  if (PTS[key]) return PTS[key];
  const c = H.layer(w, h), x = c.getContext('2d');
  x.fillStyle = '#fff'; x.strokeStyle = '#fff'; drawFn(x);
  const d = x.getImageData(0, 0, w, h).data, R = H.rng(key), out = [];
  const on = (i, j) => i >= 0 && j >= 0 && i < w && j < h && d[(j * w + i) * 4 + 3] > 120;
  for (let j = 0; j < h; j += step) for (let i = 0; i < w; i += step) {
   if (!on(i, j)) continue;
   const edge = !on(i - step, j) || !on(i + step, j) || !on(i, j - step) || !on(i, j + step);
   out.push({ x: i - w / 2 + R.range(-0.4, 0.4) * step, y: j - h / 2 + R.range(-0.4, 0.4) * step, e: edge, r: R(), a: R() * TAU, d: R(), q: R() });
  }
  return (PTS[key] = out);
 }
 // y relative to the baseline; canvas grows with the type size (reference: 1280x200, baseline 130)
 function textPts(str, font, step, px) {
  px = px || 90;
  const key = 'B' + str + font + step;
  if (PTS[key]) return PTS[key];
  const h = Math.max(200, Math.ceil(px * 1.6)), base = Math.round(h * 0.65);
  const raw = samplePts('T' + str + font + step, 1280, h, step, (x) => { x.font = font; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillText(str, 640, base); });
  return (PTS[key] = raw.map((p) => ({ ...p, y: p.y + h / 2 - base })));
 }
 function swarm(ctx, pts, cx, cy, sc, form, t, col, a, sink) {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const sp = 1 - form;
  for (const p of pts) {
   let px = cx + p.x * sc + Math.cos(p.a + t * 0.9) * sp * (30 + p.d * 160) + Math.sin(t * 2.1 + p.r * 9) * 1.4;
   let py = cy + p.y * sc + Math.sin(p.a + t * 0.9) * sp * (24 + p.d * 120) + Math.cos(t * 1.7 + p.q * 9) * 1.4;
   if (sink) { const k = Math.pow(cl(sink.k * (1.2 - p.d * 0.4)), 1.6); px = lerp(px, sink.x + (p.q - 0.5) * 20, k); py = lerp(py, sink.y + (p.r - 0.5) * 30, k); }
   const tw = 0.55 + 0.45 * Math.sin(t * (3 + p.r * 5) + p.a * 7);
   dot(ctx, px, py, p.e ? 6 : 5, col, a * (p.e ? 0.95 : 0.4) * tw * (0.35 + 0.65 * form), p.e ? 'core' : 'soft');
  }
  ctx.restore();
 }
 function gather(ctx, pts, cx, cy, p, t, col, a, from) {
  if (a <= 0.01 || p <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const pt of pts) {
   const q = E.inOut(cl((p - pt.r * 0.42) / 0.58));
   const tx = cx + pt.x, ty = cy + pt.y;
   const sx = from ? from.x + Math.cos(pt.a) * from.r * (0.2 + pt.d) : tx + Math.cos(pt.a) * (150 + pt.d * 520);
   const sy = from ? from.y + Math.sin(pt.a) * from.r * 0.7 * (0.2 + pt.d) : ty + Math.sin(pt.a) * (110 + pt.d * 260);
   const sw = Math.sin(q * Math.PI) * 70 * (pt.q - 0.5);
   const dx = tx - sx, dy = ty - sy, dl = Math.hypot(dx, dy) || 1;
   const px = lerp(sx, tx, q) - dy / dl * sw, py = lerp(sy, ty, q) + dx / dl * sw;
   const tw = 0.6 + 0.4 * Math.sin(t * (4 + pt.d * 6) + pt.a * 5);
   dot(ctx, px, py, q > 0.97 ? 4.5 : 5.5, col, a * (0.25 + 0.75 * q) * tw, 'core');
  }
  ctx.restore();
 }
 function gtext(ctx, s, x, y, font, rgb, a, align, blur) {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha = 1; ctx.font = font; ctx.textAlign = align || 'center'; ctx.textBaseline = 'alphabetic';
  const b = blur || 16;
  ctx.globalCompositeOperation = 'lighter';
  ctx.shadowColor = H.rgba(rgb, a); ctx.shadowBlur = b * 2.6; ctx.fillStyle = H.rgba(rgb, 0.55 * a); ctx.fillText(s, x, y);
  ctx.shadowBlur = b * 1.1; ctx.fillStyle = H.rgba(rgb, 0.6 * a); ctx.fillText(s, x, y);
  ctx.shadowBlur = 0; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = H.rgba(H.mix(rgb, WH, 0.62), a); ctx.fillText(s, x, y);
  ctx.restore();
 }
 function tw(ctx, s, font) { ctx.save(); ctx.font = font; const w = ctx.measureText(s).width; ctx.restore(); return w; }
 function gstroke(ctx, path, rgb, a, lw) {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  path(); ctx.strokeStyle = H.rgba(rgb, 0.16 * a); ctx.lineWidth = lw * 4.5; ctx.stroke();
  ctx.strokeStyle = H.rgba(rgb, 0.4 * a); ctx.lineWidth = lw * 2; ctx.stroke();
  ctx.strokeStyle = H.rgba(H.mix(rgb, WH, 0.6), a); ctx.lineWidth = lw; ctx.stroke();
  ctx.restore();
 }
 function ring(ctx, x, y, r, rgb, a, lw) { gstroke(ctx, () => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }, rgb, a, lw || 2.5); }

 // ---------- luminous current ----------
 function bez(P, u) {
  const v = 1 - u;
  return [v * v * v * P[0][0] + 3 * v * v * u * P[1][0] + 3 * v * u * u * P[2][0] + u * u * u * P[3][0],
   v * v * v * P[0][1] + 3 * v * v * u * P[1][1] + 3 * v * u * u * P[2][1] + u * u * u * P[3][1]];
 }
 function curPts(P) {
  const pts = [bez(P, 0)], len = [0];
  for (let i = 1; i <= 80; i++) { const p = bez(P, i / 80); len.push(len[i - 1] + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])); pts.push(p); }
  const at = (s) => { let i = 1; while (i < 80 && len[i] < s) i++; const f = (s - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; };
  return { at, L: len[80], pts };
 }
 function current(ctx, P, prog, t, col, a, sig, sigCol, noHead) {
  if (prog <= 0 || a <= 0.01) return;
  const c = curPts(P), Lp = c.L * cl(prog);
  ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  ctx.beginPath(); for (let s = 0; s <= Lp; s += 6) { const p = c.at(s); s ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
  ctx.strokeStyle = H.rgba(col, 0.2 * a); ctx.lineWidth = 2; ctx.stroke();
  for (let s = 0; s <= Lp; s += 12) {
   const p = c.at(s), pul = Math.pow(0.5 + 0.5 * Math.sin(s * 0.045 - t * 8), 4);
   dot(ctx, p[0], p[1], 6.5, col, a * (0.4 + 0.6 * pul), 'core');
  }
  const end = c.at(Lp);
  if (prog < 1) dot(ctx, end[0], end[1], 22, col, a, 'core');
  const hp = noHead ? 0 : cl((prog - 0.85) / 0.15);
  if (hp > 0) {
   const e0 = c.at(c.L - 8), ang = Math.atan2(end[1] - e0[1], end[0] - e0[0]);
   for (const sd of [-1, 1]) for (let k = 1; k <= 3; k++) {
    const aa = ang + Math.PI + sd * 0.6;
    dot(ctx, end[0] + Math.cos(aa) * k * 9 * hp, end[1] + Math.sin(aa) * k * 9 * hp, 7, col, a * hp, 'core');
   }
   dot(ctx, end[0], end[1], 9, col, a * hp, 'core');
  }
  if (sig != null && sig >= 0 && sig <= 1) {
   for (let k = 0; k < 6; k++) { const s = c.L * cl(sig - k * 0.025), p = c.at(s); dot(ctx, p[0], p[1], 26 - k * 3, sigCol || col, a * (1 - k * 0.15), 'core'); }
  }
  ctx.restore();
 }

 // ---------- HUD (vertical, Spanish, qualitative: no invented depth/temperature readings) ----------
 function hud(ctx, W, depthScroll, t, a, label) {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = F.hud(30); ctx.textAlign = 'right';
  const x = W - 44;
  ctx.fillStyle = 'rgba(150,220,235,0.78)'; ctx.fillText('PROFUNDIDAD ▼', x, 78);
  ctx.fillStyle = 'rgba(150,220,235,0.5)'; ctx.fillText(label || 'SONAR ACTIVO', x, 118);
  const lx = x - 260;
  ctx.strokeStyle = 'rgba(150,220,235,0.45)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(lx, 136); ctx.lineTo(lx + 260, 136); ctx.stroke();
  for (let i = -1; i < 20; i++) { const off = ((depthScroll * 0.6) % 18), tx = lx + i * 18 - off; if (tx < lx || tx > lx + 260) continue; ctx.beginPath(); ctx.moveTo(tx, 136); ctx.lineTo(tx, i % 5 === 0 ? 124 : 130); ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,90,80,' + (0.5 + 0.5 * (Math.sin(t * 4) > 0 ? 1 : 0)) + ')';
  ctx.beginPath(); ctx.arc(x - 286, 68, 6, 0, TAU); ctx.fill();
  ctx.restore();
 }
 function finish(ctx, W, Hh, t, v) {
  H.vignette(ctx, W, Hh, v == null ? 0.6 : v, '0,0,4');
  H.grain(ctx, W, Hh, 0.035, 1 + Math.floor(t * 24), true);
 }
 const flick = (t, t0, t1, seed) => {
  if (t <= t0) return 0; if (t >= t1) return 1;
  const p = (t - t0) / (t1 - t0), r = hash(Math.floor(t * 24) + seed * 13.7);
  return r < 0.35 + p * 0.6 ? p * (0.6 + 0.4 * r) + 0.1 : 0.06;
 };
 const LAY = [];
 function layer(i, W, Hh) { if (!LAY[i]) LAY[i] = H.layer(W, Hh); return LAY[i]; }
 function comp(ctx, W, Hh, i, fn, o) {
  o = o || {};
  if ((o.alpha == null ? 1 : o.alpha) <= 0.003) return;
  const L = layer(i, W, Hh), x = L.getContext('2d');
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.filter = 'none'; x.clearRect(0, 0, W, Hh);
  fn(x);
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1;
  if (o.mask) { x.globalCompositeOperation = 'destination-in'; x.fillStyle = o.mask(x); x.fillRect(0, 0, W, Hh); x.globalCompositeOperation = 'source-over'; }
  ctx.save();
  if (o.clip) { ctx.beginPath(); o.clip(ctx); ctx.clip(); }
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
  ctx.drawImage(L, 0, 0, W, Hh); ctx.restore();
 }

 // ================= NUEVO: el submarino en la zona de medianoche =================
 // Perfil en lágrima (proa a la izquierda). r = medio alto relativo. Hr = alto/eslora (0.13 silueta real, mayor en el corte).
 function hullPts(x, y, L, Hh, n = 60) {
  const r = (u) => (u < 0.18 ? Math.sqrt(1 - Math.pow((0.18 - u) / 0.18, 2)) : u < 0.62 ? 1 : Math.pow(Math.max(0, 1 - (u - 0.62) / 0.38), 1.25) * 0.97 + 0.03);
  const o = [];
  for (let i = 0; i <= n; i++) { const u = i / n; o.push([x - L / 2 + u * L, y - r(u) * Hh / 2]); }
  for (let i = n; i >= 0; i--) { const u = i / n; o.push([x - L / 2 + u * L, y + r(u) * Hh / 2]); }
  return o;
 }
 function subGeom(x, y, L, Hr, rot) {
  const Hh = L * Hr, cs = Math.cos(rot || 0), sn = Math.sin(rot || 0), R = (p) => [x + (p[0] - x) * cs - (p[1] - y) * sn, y + (p[0] - x) * sn + (p[1] - y) * cs];
  const P = (a) => a.map(R);
  const sx = x - L * 0.2, sw = L * 0.13, sh = L * 0.085, top = y - Hh / 2;
  return {
   Hh, R,
   hull: P(hullPts(x, y, L, Hh)),
   sail: P([[sx - sw / 2, top + 2], [sx - sw / 2 + sw * 0.12, top - sh], [sx + sw / 2 - sw * 0.05, top - sh], [sx + sw / 2, top + 2]]),
   fplane: P([[sx - sw * 0.15, top - sh * 0.55], [sx + sw * 0.6, top - sh * 0.55]]),
   splane: P([[x + L * 0.36, y], [x + L * 0.47, y - L * 0.006], [x + L * 0.47, y + L * 0.006]]),
   rudder: P([[x + L * 0.4, y - L * 0.08], [x + L * 0.46, y - L * 0.08], [x + L * 0.47, y + L * 0.08], [x + L * 0.41, y + L * 0.08]]),
   prop: P([[x + L * 0.495, y - L * 0.035], [x + L * 0.51, y], [x + L * 0.495, y + L * 0.035]]),
   sailTop: R([sx, top - sh]), bow: R([x - L / 2, y]),
  };
 }
 const poly = (ctx, pts, close) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); if (close) ctx.closePath(); };
 // dark silhouette, lit only by living light (like the anglerfish): fill darkens away from `lt`, rim light on the near edge
 function subSil(ctx, x, y, L, rot, lt, a, t, o) {
  if (a <= 0.01) return null;
  o = o || {};
  const G = subGeom(x, y, L, 0.13, rot);
  ctx.save(); ctx.globalAlpha = a;
  const lc = lt.col || C.cyan, lk = lt.k == null ? 1 : lt.k;
  const fill = () => { ctx.fillStyle = (() => { const g = ctx.createRadialGradient(lt.x, lt.y, 10, lt.x, lt.y, lt.r || 700); g.addColorStop(0, H.rgba(H.mix([6, 9, 14], H.mix(lc, [0, 0, 0], 0.45), lk * 0.75))); g.addColorStop(0.5, H.rgba(H.mix([4, 7, 11], H.mix(lc, [0, 0, 0], 0.75), lk * 0.35))); g.addColorStop(1, 'rgb(2,4,8)'); return g; })(); };
  // sail, planes, rudder behind/with the hull
  ctx.globalCompositeOperation = 'source-over';
  fill(); poly(ctx, G.sail, true); ctx.fill(); poly(ctx, G.rudder, true); ctx.fill(); poly(ctx, G.splane, true); ctx.fill();
  ctx.lineWidth = L * 0.012; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgb(3,5,9)'; poly(ctx, G.fplane); ctx.stroke();
  fill(); poly(ctx, G.hull, true); ctx.fill();
  // form shading
  ctx.save(); poly(ctx, G.hull, true); ctx.clip();
  const sh = ctx.createLinearGradient(0, y - G.Hh / 2, 0, y + G.Hh / 2);
  sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(0.55, 'rgba(1,2,5,0.35)'); sh.addColorStop(1, 'rgba(1,2,5,0.8)');
  ctx.fillStyle = sh; ctx.fillRect(x - L, y - L, L * 2, L * 2);
  // faint hull plating lines catching light
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 1; i < 9; i++) { const u = i / 9, px = x - L / 2 + u * L; const d = Math.hypot(px - lt.x, y - lt.y); ctx.strokeStyle = H.rgba(lc, 0.05 * lk * cl(1.3 - d / (lt.r || 700))); ctx.lineWidth = 1.2; ctx.beginPath(); const p0 = G.R([px, y - G.Hh / 2]), p1 = G.R([px, y + G.Hh / 2]); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke(); }
  ctx.restore();
  // rim light from the light source
  const rg = ctx.createRadialGradient(lt.x, lt.y, 0, lt.x, lt.y, lt.r || 700);
  rg.addColorStop(0, H.rgba(H.mix(lc, WH, 0.3), 0.85 * lk)); rg.addColorStop(1, H.rgba(lc, 0));
  ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rg; ctx.lineWidth = 3.2;
  poly(ctx, G.hull, true); ctx.stroke(); poly(ctx, G.sail, false); ctx.stroke(); poly(ctx, G.rudder, false); ctx.stroke();
  // own lights: a soft navigation light on the sail; a warning light when it fails
  if (o.nav) { dot(ctx, G.sailTop[0], G.sailTop[1] - 8, 40, C.ice, 0.3 * o.nav); dot(ctx, G.sailTop[0], G.sailTop[1] - 8, 9, C.ice, o.nav, 'core'); }
  if (o.warn) { const bl = 0.5 + 0.5 * Math.sin(t * 9); dot(ctx, G.sailTop[0] + L * 0.03, G.sailTop[1] - 8, 120, C.red, 0.45 * o.warn * bl); dot(ctx, G.sailTop[0] + L * 0.03, G.sailTop[1] - 8, 16, C.red, o.warn * (0.5 + 0.5 * bl), 'core'); }
  ctx.restore();
  return G;
 }
 // the same hull as a glowing section («rayos X» de luz viva): outline in light, Hr sets the section scale
 function subGlow(ctx, x, y, L, Hr, rot, col, a, lw) {
  if (a <= 0.01) return null;
  const G = subGeom(x, y, L, Hr, rot);
  gstroke(ctx, () => poly(ctx, G.hull, true), col, a, lw || 3);
  gstroke(ctx, () => poly(ctx, G.sail, false), col, a * 0.8, (lw || 3) * 0.8);
  gstroke(ctx, () => poly(ctx, G.rudder, false), col, a * 0.6, (lw || 3) * 0.7);
  gstroke(ctx, () => poly(ctx, G.prop, false), col, a * 0.6, (lw || 3) * 0.7);
  return G;
 }
 function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

 window.ABISAL = { TAU, cl, sm, E, lerp, WH, C, F, hash, hsl, spr, dot, far, farLayer, water, snow, sparkles, NET, jelly, siph, comb, angler, samplePts, textPts, swarm, gather, gtext, tw, gstroke, ring, bez, curPts, current, hud, finish, flick, comp, subGeom, subSil, subGlow, poly, rrect, hullPts };
})();
