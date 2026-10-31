// =====================================================================================================
// estilo_base.js — funciones del estilo "Product Launch Reveal" (styles/product-launch.js, 02_REFERENCIA_ORIGINAL)
// ADAPTADAS a un lienzo vertical 1080x1920. Cambios respecto al original, todos documentados aquí:
//  · Las dimensiones fijas 1280x720 se sustituyen por W/HH del lienzo (capas, barridos, rellenos).
//  · stage(): el bokeh se desplaza respecto a W/2 (antes 640) y la luz cenital escala con el alto vertical.
//  · body(): la rejilla de red neuronal del "die" se sustituye por un gancho L.dieDraw(x, P, yT) para dibujar
//    el contenido de la billetera (ledger, llave, red); la arquitectura de iluminación (softbox, rim, sheen,
//    espejo, chaflán, barrido especular, anillo cónico) es idéntica al original.
//  · finish(): igual que el original (viñeta 0.55 + grano soft-light 0.06 a 24 fps de semilla), sin rebajar.
//  · Se añaden: approx()/neq() para dibujar ≈ y ≠ (la fuente Inter subconjunto latin no los incluye).
// H (lib/harness.js) y SOUND (lib/sound.js) se cargan sin modificar.
// =====================================================================================================
(function () {
 const S = (window.PLR = {});
 const PI = Math.PI;
 const sm = (a, b, x) => H.smooth(a, b, x);
 const io = (x) => H.ease.inOut(H.clamp(x));
 const eo = (x) => H.ease.out(H.clamp(x));
 const GV = ['#b69cff', '#e879f9', '#ff9a4d'];
 const GT = ['#5eead4', '#38bdf8', '#6d7cff'];
 const GG = ['#7cf0b8', '#2dd4bf'];
 const GOLD = ['#ffe08a', '#f0b90b', '#ff9a4d'];
 const RED = '#ff453a', INK = '#f5f5f7', GREY = '#a1a1a6', DIM = '#6e6e73';
 const CYAN = '#38bdf8', TEAL = '#2dd4bf', BGOLD = '#f0b90b', GRAPH = '#1d2028';
 Object.assign(S, { PI, sm, io, eo, GV, GT, GG, GOLD, RED, INK, GREY, DIM, CYAN, TEAL, BGOLD, GRAPH });
 S.W = 1080; S.HH = 1920;

 // ---------- geometría (original) ----------
 const HALF = 1, RAD = 0.27, THICK = 0.12, SEG = 48;
 function rr(a, r, seg) {
  const pts = [], cs = [[a - r, a - r], [-(a - r), a - r], [-(a - r), -(a - r)], [a - r, -(a - r)]];
  cs.forEach(([cx, cz], k) => { for (let i = 0; i <= seg; i++) { const an = k * PI / 2 + (i / seg) * PI / 2; pts.push([cx + r * Math.cos(an), cz + r * Math.sin(an), an]); } });
  return pts;
 }
 const OUT = rr(HALF, RAD, SEG), DIE = rr(0.66, 0.12, 5);
 Object.assign(S, { HALF, RAD, THICK, rr, OUT, DIE });
 // ---------- cámara (original) ----------
 function cam(c) {
  const cyw = Math.cos(c.yaw), syw = Math.sin(c.yaw), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch), D = 7, F = c.s * 1900;
  const P = (x, y, z) => { const X = x * cyw - z * syw, Z = x * syw + z * cyw, up = y * cp - Z * sp, dep = Z * cp + y * sp, k = F / (D - dep); return [c.cx + X * k, c.cy - up * k, dep]; };
  const N = (nx, nz) => [nx * cyw - nz * syw, nx * syw + nz * cyw];
  return Object.assign({}, c, { P, N, unit: F / D });
 }
 function keyed(keys, t) {
  if (t <= keys[0].t) return Object.assign({}, keys[0]);
  for (let i = 0; i < keys.length - 1; i++) {
   const a = keys[i], b = keys[i + 1];
   if (t <= b.t) { const e = io((t - a.t) / (b.t - a.t)), o = {}; for (const k in a) o[k] = H.lerp(a[k], b[k], e); return o; }
  }
  return Object.assign({}, keys[keys.length - 1]);
 }
 const poly = (x, pts) => { x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.closePath(); };
 const gauss = (d, k) => Math.exp(-d * d * k);
 Object.assign(S, { cam, keyed, poly, gauss });

 // ---------- escenario (adaptado a vertical) ----------
 function stage(x, W, Hh, c, L, t) {
  if (L.white) {
   x.fillStyle = '#e4e4e9'; x.fillRect(0, 0, W, Hh);
   const g = x.createRadialGradient(c.cx, c.cy - 380, 40, c.cx, c.cy - 220, 1400);
   g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#f4f4f7'); g.addColorStop(1, '#dcdce2');
   x.fillStyle = g; x.fillRect(0, 0, W, Hh);
   return;
  }
  x.fillStyle = '#030304'; x.fillRect(0, 0, W, Hh);
  const k = L.key;
  let g = x.createRadialGradient(c.cx, c.cy - c.unit * 0.9, 10, c.cx, c.cy - c.unit * 0.6, 1100);
  g.addColorStop(0, `rgba(44,47,60,${0.9 * k})`); g.addColorStop(0.45, `rgba(20,21,28,${0.8 * k})`); g.addColorStop(1, 'rgba(3,3,4,0)');
  x.fillStyle = g; x.fillRect(0, 0, W, Hh);
  // charco de luz en el suelo
  x.save(); x.translate(c.cx, c.cy); x.scale(1, Math.max(0.24, Math.sin(c.pitch) * 0.7));
  g = x.createRadialGradient(0, 0, 0, 0, 0, c.unit * 2.6);
  g.addColorStop(0, `rgba(70,74,92,${0.42 * k})`); g.addColorStop(1, 'rgba(70,74,92,0)');
  x.fillStyle = g; x.beginPath(); x.arc(0, 0, c.unit * 2.6, 0, 7); x.fill(); x.restore();
  // bokeh desenfocado (profundidad de campo) — mismos tonos que el original + oro contextual
  const r = H.rng(404);
  for (let i = 0; i < 8; i++) {
   const bx = r() * W + Math.sin(t * 0.2 + i) * 14 - (c.cx - W / 2) * 0.15, by = r.range(0.04, 0.42) * Hh, rad = r.range(50, 140), hue = r.pick(['120,110,255', '255,140,90', '90,200,255', '240,185,11']);
   const a = r.range(0.025, 0.05) * k * (L.bokeh == null ? 1 : L.bokeh);
   g = x.createRadialGradient(bx, by, 0, bx, by, rad);
   g.addColorStop(0, `rgba(${hue},${a})`); g.addColorStop(0.6, `rgba(${hue},${a * 0.6})`); g.addColorStop(1, `rgba(${hue},0)`);
   x.fillStyle = g; x.beginPath(); x.arc(bx, by, rad, 0, 7); x.fill();
  }
 }
 // ---------- objeto héroe (iluminación idéntica al original; contenido del die por gancho) ----------
 function body(x, c, L, mirror, W, Hh) {
  const hv = L.hover, yT = hv + THICK / 2, yB = hv - THICK / 2, sc = c.unit / 271;
  const P = mirror ? (a, y, b) => c.P(a, -y, b) : c.P;
  const n = OUT.length, top = OUT.map((p) => P(p[0], yT, p[1])), bot = OUT.map((p) => P(p[0], yB, p[1]));
  const white = L.white ? 1 : 0;
  const segs = [];
  for (let i = 0; i < n; i++) {
   const j = (i + 1) % n, a1 = OUT[i][2], a2 = OUT[j][2];
   let nx = Math.cos(a1) + Math.cos(a2), nz = Math.sin(a1) + Math.sin(a2); const nl = Math.hypot(nx, nz) || 1; nx /= nl; nz /= nl;
   const [NX, NZ] = c.N(nx, nz);
   segs.push({ i, j, NX, NZ });
   if (NZ < -0.03) continue;
   const lam = Math.max(0, NX * -0.6 + NZ * 0.8), sd = Math.max(0, NX * -0.25 + NZ * 0.97), spec = Math.pow(sd, 18), sheen = Math.pow(sd, 4);
   const rim = Math.pow(Math.max(0, NX), 3);
   let v = 14 + lam * 62 * L.key + Math.min(1, spec * 0.85 + sheen * 0.3) * 140 * L.key + rim * 120 * L.rim + white * 40;
   if (mirror) v *= 0.9;
   const cc = (m) => `rgb(${Math.min(255, v * 0.96 * m) | 0},${Math.min(255, v * 0.98 * m) | 0},${Math.min(255, (v * 1.05 + 3) * m) | 0})`;
   const m = Math.max(1, Math.ceil(Math.hypot(top[j][0] - top[i][0], top[j][1] - top[i][1]) / 40));
   const lp = (A, B, f) => [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f];
   for (let q = 0; q < m; q++) {
    const t0 = lp(top[i], top[j], q / m), t1 = lp(top[i], top[j], (q + 1) / m), b0 = lp(bot[i], bot[j], q / m), b1 = lp(bot[i], bot[j], (q + 1) / m);
    let ex = t1[0] - t0[0], ey = t1[1] - t0[1]; const el = Math.hypot(ex, ey) || 1; ex /= el; ey /= el;
    const tm = [(t0[0] + t1[0]) / 2, (t0[1] + t1[1]) / 2], bm = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2];
    let gx = -ey, gy = ex, hh = (bm[0] - tm[0]) * gx + (bm[1] - tm[1]) * gy;
    if (Math.abs(hh) < 0.5) { gx = bm[0] - tm[0]; gy = bm[1] - tm[1]; hh = 1; }
    const sg = x.createLinearGradient(tm[0], tm[1], tm[0] + gx * hh, tm[1] + gy * hh);
    if (mirror) { sg.addColorStop(0, cc(0.5)); sg.addColorStop(0.45, cc(1)); sg.addColorStop(1, cc(1.2)); }
    else { sg.addColorStop(0, cc(1.32)); sg.addColorStop(0.3, cc(1.05)); sg.addColorStop(0.52, cc(0.62)); sg.addColorStop(0.74, cc(0.82)); sg.addColorStop(1, cc(0.42)); }
    x.fillStyle = sg; x.strokeStyle = sg; x.lineWidth = 0.9;
    poly(x, [t1, t0, b0, b1]); x.fill(); x.stroke();
   }
  }
  x.lineWidth = 1.2 * sc; x.strokeStyle = 'rgba(0,0,0,0.6)';
  for (const s of segs) if (s.NZ > 0) { x.beginPath(); x.moveTo(bot[s.i][0], bot[s.i][1]); x.lineTo(bot[s.j][0], bot[s.j][1]); x.stroke(); }
  if (mirror) { x.fillStyle = '#060608'; poly(x, bot); x.fill(); return; }
  let minY = 1e9, maxY = -1e9; top.forEach((p) => { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); });
  poly(x, top);
  let g = x.createLinearGradient(0, minY, 0, maxY);
  g.addColorStop(0, white ? '#2a2c33' : '#1d2028'); g.addColorStop(1, '#08090c');
  x.fillStyle = g; x.fill();
  x.save(); poly(x, top); x.clip();
  g = x.createLinearGradient(0, minY, 0, maxY);
  g.addColorStop(0, `rgba(255,255,255,${0.16 * L.key})`); g.addColorStop(0.35, `rgba(255,255,255,${0.035 * L.key})`); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, minY, W, maxY - minY);
  { const A = P(-1.1, yT, 0.6), B = P(0.6, yT, -1.1); const sg = x.createLinearGradient(A[0], A[1], B[0], B[1]);
   sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.3, 'rgba(255,255,255,0)'); sg.addColorStop(0.46, `rgba(255,255,255,${0.11 * L.key})`); sg.addColorStop(0.5, `rgba(255,255,255,${0.05 * L.key})`); sg.addColorStop(0.66, 'rgba(255,255,255,0)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
   x.fillStyle = sg; x.fillRect(0, minY, W, maxY - minY); }
  const die = DIE.map((p) => P(p[0], yT, p[1]));
  poly(x, die); x.fillStyle = 'rgba(4,5,8,0.92)'; x.fill();
  x.lineWidth = 0.6; x.strokeStyle = `rgba(150,160,200,${0.06 + 0.05 * (L.act || 0)})`; x.beginPath();
  for (let q = -0.56; q <= 0.57; q += 0.08) { let a = P(q, yT, -0.6), b = P(q, yT, 0.6); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); a = P(-0.6, yT, q); b = P(0.6, yT, q); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); }
  x.stroke();
  if (L.dieDraw) { x.save(); poly(x, die); x.clip(); L.dieDraw(x, P, yT, sc); x.restore(); }
  if (L.spec > -0.3 && L.spec < 1.3) {
   const A = P(-1.1, yT, 1.1), B = P(1.1, yT, -1.1), u = L.spec;
   g = x.createLinearGradient(A[0], A[1], B[0], B[1]);
   const st = (o, a) => { const q = u + o; if (q > 0 && q < 1) g.addColorStop(q, `rgba(255,255,255,${a})`); };
   g.addColorStop(0, 'rgba(255,255,255,0)'); st(-0.16, 0); st(-0.05, 0.08); st(0, 0.42 * L.key); st(0.02, 0.18); st(0.1, 0); g.addColorStop(1, 'rgba(255,255,255,0)');
   x.fillStyle = g; x.fillRect(0, 0, W, Hh);
  }
  x.restore();
  if (L.ring > 0.01) {
   const ctr = P(0, yT, 0);
   x.save();
   const cg = x.createConicGradient(L.ringRot || 0, ctr[0], ctr[1]);
   (L.ringCols || ['#b69cff', '#e879f9', '#ff9a4d', '#5eead4', '#6d7cff', '#b69cff']).forEach((s, i, arr) => cg.addColorStop(i / (arr.length - 1), s));
   x.strokeStyle = cg; x.globalAlpha = Math.min(1, L.ring); x.lineWidth = 2.2 * sc;
   x.shadowColor = L.ringGlow || 'rgba(200,130,255,0.9)'; x.shadowBlur = 16 * sc * Math.min(1.6, L.ring);
   poly(x, die); x.stroke();
   x.shadowBlur = 0; x.lineWidth = 0.8 * sc; x.strokeStyle = `rgba(255,255,255,${0.5 * Math.min(1, L.ring)})`; poly(x, die); x.stroke();
   x.restore();
  }
  x.lineWidth = 1.5 * sc;
  for (const s of segs) {
   const back = Math.max(0, -s.NZ), front = Math.max(0, s.NX * -0.6 + s.NZ * 0.8);
   const a = Math.min(1, Math.pow(back, 1.2) * 0.95 * L.rim + front * 0.45 * L.key + 0.06);
   x.strokeStyle = `rgba(235,238,255,${a})`;
   x.beginPath(); x.moveTo(top[s.i][0], top[s.i][1]); x.lineTo(top[s.j][0], top[s.j][1]); x.stroke();
  }
 }
 let RL = null;
 function chip(x, c, L, W, Hh) {
  const u = c.unit, white = !!L.white;
  x.save(); x.translate(c.cx, c.cy); x.scale(1, Math.max(0.18, Math.sin(c.pitch) * 0.8));
  let g = x.createRadialGradient(0, 0, 0, 0, 0, u * 1.45);
  g.addColorStop(0, `rgba(0,0,0,${white ? 0.32 : 0.75})`); g.addColorStop(0.6, `rgba(0,0,0,${white ? 0.1 : 0.3})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.beginPath(); x.arc(0, 0, u * 1.45, 0, 7); x.fill();
  if (L.ring > 0.01 && !white) {
   g = x.createRadialGradient(0, 0, 0, 0, 0, u * 1.9);
   const sp = L.spill || '170,110,255';
   g.addColorStop(0, `rgba(${sp},${0.16 * Math.min(1.5, L.ring)})`); g.addColorStop(0.5, `rgba(255,130,90,${0.05 * Math.min(1.5, L.ring)})`); g.addColorStop(1, 'rgba(0,0,0,0)');
   x.globalCompositeOperation = 'lighter'; x.fillStyle = g; x.beginPath(); x.arc(0, 0, u * 1.9, 0, 7); x.fill();
  }
  x.restore();
  if (!RL || RL.width !== W || RL.height !== Hh) RL = H.layer(W, Hh);
  const r = RL.getContext('2d'); r.setTransform(1, 0, 0, 1, 0, 0); r.globalCompositeOperation = 'source-over'; r.clearRect(0, 0, W, Hh);
  body(r, c, L, true, W, Hh);
  r.globalCompositeOperation = 'destination-in';
  g = r.createLinearGradient(0, c.cy, 0, c.cy + u * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  r.fillStyle = g; r.fillRect(0, 0, W, Hh);
  x.save(); x.globalAlpha = white ? 0.22 : 0.45 * Math.max(0.2, L.key); x.drawImage(RL, 0, 0, W, Hh); x.restore();
  body(x, c, L, false, W, Hh);
 }
 Object.assign(S, { stage, body, chip });

 // ---------- tipografía (original) ----------
 function setF(x, w, px) { x.font = `${w} ${px}px "Inter"`; try { x.letterSpacing = (px >= 40 ? -Math.round(px * 0.035) : 0) + 'px'; } catch (e) {} }
 function grad(x, x0, x1, stops) { const g = x.createLinearGradient(x0, 0, x1, 0); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
 function wordsW(x, list, w, px) { setF(x, w, px); const sp = x.measureText(' ').width + px * 0.08; let tot = 0; list.forEach((it, i) => { it._w = it.glyph ? px * 0.62 : x.measureText(it.s).width; tot += it._w + (i ? sp : 0); }); return { tot, sp }; }
 function words(x, list, X, Y, w, px, t, o) {
  o = o || {};
  x.save();
  const ga = x.globalAlpha; // ADAPTACIÓN: respeta el alfa del contenedor (el original lo sobrescribía)
  const { tot, sp } = wordsW(x, list, w, px);
  let cx = o.align === 'center' ? X - tot / 2 : o.align === 'right' ? X - tot : X;
  const x0 = cx;
  for (const it of list) {
   const e = eo((t - it.t) / (o.dur || 0.6));
   if (e > 0.001) {
    x.globalAlpha = ga * e * (o.alpha == null ? 1 : o.alpha);
    const b = (1 - e) * (o.blur == null ? 10 : o.blur);
    x.filter = b > 0.3 ? `blur(${b.toFixed(1)}px)` : 'none';
    const fill = it.fill === 'grad' ? grad(x, o.gx0 == null ? x0 : o.gx0, o.gx1 == null ? x0 + tot : o.gx1, o.stops || GV) : it.fill || o.fill || INK;
    x.fillStyle = fill;
    x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    const yy = Y + (1 - e) * px * 0.28;
    if (it.glyph === 'approx') approx(x, cx, yy - px * 0.36, px * 0.56, fill);
    else if (it.glyph === 'neq') neq(x, cx, yy - px * 0.36, px * 0.56, fill);
    else x.fillText(it.s, cx, yy);
   }
   cx += it._w + sp;
  }
  x.filter = 'none';
  x.restore();
  return { x0, tot };
 }
 function label(x, s, X, Y, w, px, fill, align, a) {
  const ga = x.globalAlpha; x.save(); setF(x, w, px); x.globalAlpha = ga * (a == null ? 1 : a); /* ADAPTACIÓN: respeta alfa del contenedor */ x.fillStyle = fill; x.textAlign = align || 'left'; x.textBaseline = 'alphabetic';
  if (s[0] === '≈' || s[0] === '≠') {
   const rest = s.slice(1), gw = px * 0.62, rw = x.measureText(rest).width, tot = gw + rw;
   let x0 = align === 'center' ? X - tot / 2 : align === 'right' ? X - tot : X;
   (s[0] === '≈' ? approx : neq)(x, x0, Y - px * 0.36, px * 0.56, fill);
   x.textAlign = 'left'; x.fillText(rest, x0 + gw, Y);
  } else x.fillText(s, X, Y);
  x.restore();
 }
 // ≈ y ≠ dibujados (no existen en el subconjunto latin de Inter)
 function approx(x, X, Ymid, w, fill) {
  x.save(); x.strokeStyle = fill; x.lineWidth = Math.max(2, w * 0.13); x.lineCap = 'round';
  for (const dy of [-w * 0.17, w * 0.17]) {
   x.beginPath();
   for (let i = 0; i <= 16; i++) { const u = i / 16, px = X + w * 0.08 + u * w * 0.84, py = Ymid + dy - Math.sin(u * PI * 2) * w * 0.1; i ? x.lineTo(px, py) : x.moveTo(px, py); }
   x.stroke();
  }
  x.restore();
 }
 function neq(x, X, Ymid, w, fill) {
  x.save(); x.strokeStyle = fill; x.lineWidth = Math.max(2, w * 0.13); x.lineCap = 'round'; x.beginPath();
  x.moveTo(X + w * 0.08, Ymid - w * 0.17); x.lineTo(X + w * 0.92, Ymid - w * 0.17);
  x.moveTo(X + w * 0.08, Ymid + w * 0.17); x.lineTo(X + w * 0.92, Ymid + w * 0.17);
  x.moveTo(X + w * 0.68, Ymid - w * 0.5); x.lineTo(X + w * 0.32, Ymid + w * 0.5); x.stroke(); x.restore();
 }
 // callout de línea fina: punto de anclaje -> codo -> final con rótulo (original; tamaños por opciones)
 function callout(x, pts, p, lab, sub, side, o) {
  o = o || {};
  if (p <= 0) return;
  const ink = o.ink || '255,255,255';
  x.save();
  const [A] = pts, e = eo(p / 0.35);
  x.fillStyle = `rgba(${ink},${0.95 * e})`; x.beginPath(); x.arc(A[0], A[1], 4.6, 0, 7); x.fill();
  x.strokeStyle = `rgba(${ink},${0.35 * e})`; x.lineWidth = 1.2; x.beginPath(); x.arc(A[0], A[1], 6 + 8 * e, 0, 7); x.stroke();
  let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let rem = len * io(sm(0.1, 0.75, p));
  x.strokeStyle = `rgba(${ink},0.7)`; x.lineWidth = 1.4; x.beginPath(); x.moveTo(A[0], A[1]);
  for (let i = 1; i < pts.length && rem > 0; i++) {
   const a = pts[i - 1], b = pts[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]), f = Math.min(1, rem / d);
   x.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); rem -= d;
  }
  x.stroke();
  const la = sm(0.6, 1, p), E = pts[pts.length - 1], dx = (1 - la) * 10 * (side === 'r' ? 1 : -1);
  if (la > 0) {
   const px = o.px || 40;
   const tx = side === 'r' ? E[0] + 16 + dx : side === 'c' ? E[0] : E[0] - 16 + dx, al = side === 'r' ? 'left' : side === 'c' ? 'center' : 'right';
   const ty = side === 'c' ? E[1] - 18 : E[1] + px * 0.36;
   label(x, lab, tx, ty, 600, px, o.labFill || `rgb(${ink})`, al, la);
   if (sub) label(x, sub, tx, ty + px * 1.1, 400, o.subPx || 32, o.subFill || GREY, al, la);
  }
  x.restore();
 }
 function arrow(x, pts, p, stroke, lw, head) {
  if (p <= 0) return;
  const n = Math.max(2, Math.round(pts.length * H.clamp(p)));
  x.save(); x.strokeStyle = stroke; x.lineWidth = lw || 1.2; x.lineCap = 'round'; x.beginPath();
  for (let i = 0; i < n; i++) (i ? x.lineTo : x.moveTo).call(x, pts[i][0], pts[i][1]);
  x.stroke();
  if (head !== false && n >= 2) {
   const a = pts[n - 2], b = pts[n - 1], an = Math.atan2(b[1] - a[1], b[0] - a[0]), hl = 10 + (lw || 1.2) * 3;
   x.beginPath(); x.moveTo(b[0] - hl * Math.cos(an - 0.45), b[1] - hl * Math.sin(an - 0.45)); x.lineTo(b[0], b[1]); x.lineTo(b[0] - hl * Math.cos(an + 0.45), b[1] - hl * Math.sin(an + 0.45)); x.stroke();
  }
  x.restore();
 }
 const bez = (p0, p1, p2, p3, n) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n, v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; });
 Object.assign(S, { setF, grad, wordsW, words, label, approx, neq, callout, arrow, bez });

 // ---------- acabado (original, misma intensidad) ----------
 let GR = null;
 function finish(x, W, Hh, t, white) {
  if (!GR) { GR = H.layer(256, 256); const g = GR.getContext('2d'), img = g.createImageData(256, 256), r = H.rng(77); for (let i = 0; i < img.data.length; i += 4) { const v = r() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; } g.putImageData(img, 0, 0); }
  if (!white) H.vignette(x, W, Hh, 0.55);
  const r = H.rng(900 + Math.floor(t * 24));
  x.save(); x.globalAlpha = white ? 0.04 : 0.06; x.globalCompositeOperation = 'soft-light';
  x.translate(-r() * 256, -r() * 256); x.fillStyle = x.createPattern(GR, 'repeat'); x.fillRect(0, 0, W + 256, Hh + 256); x.restore();
 }
 function ringGlow(base, t, pulses) { let v = base; for (const p of pulses) if (t > p) v += 0.9 * Math.exp(-(t - p) * 5); return v; }
 Object.assign(S, { finish, ringGlow });
})();
