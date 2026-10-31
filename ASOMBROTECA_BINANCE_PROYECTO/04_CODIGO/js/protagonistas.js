// =====================================================================================================
// protagonistas.js (V3) — objetos protagonistas con geometría propia, reutilizando la proyección cam(),
// la iluminación (key/rim/spec), el reflejo de suelo y los materiales de Product Launch Reveal.
//  · emblem3D: símbolo de Binance extruido (trazado Simple Icons, sin modificar) en oro #F0B90B.
//  · coin: ficha luminosa de cripto (iconos cryptocurrency-icons, sin modificar) — ejemplos del ecosistema.
//  · vault / cash: metáforas físicas (bóveda y fajos) que se desintegran.
//  · device: billetera caliente (vidrio + metal) con pantalla de saldo, entradas/salidas y conexión.
//  · tiles: módulo de autorización (solicitud → verificación → firma).
//  · box3r: caja orientable (bloques, reservas, fajos).
// Todo determinista (H.rng). Sin recursos externos.
// =====================================================================================================
(function () {
 const S = window.PLR, LG = window.LOGOS;
 const { PI, sm, io, eo, INK, GREY, RED, CYAN, TEAL, BGOLD } = S;
 const PR = (window.PROT = {});

 // ---------- trazados SVG de líneas rectas -> polígonos (para extruir el emblema) ----------
 function parseLinePath(d) {
  const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g);
  const polys = []; let cur = null, x = 0, y = 0, sx = 0, sy = 0, cmd = null, i = 0;
  const num = () => parseFloat(tok[i++]);
  while (i < tok.length) {
   if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
   const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
   if (C === 'Z') { if (cur && cur.length > 2) polys.push(cur); cur = null; x = sx; y = sy; continue; }
   if (C === 'M') { const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; if (cur && cur.length > 2) polys.push(cur); cur = [[x, y]]; sx = x; sy = y; cmd = rel ? 'l' : 'L'; continue; }
   if (C === 'L') { const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; }
   else if (C === 'H') { const a = num(); x = rel ? x + a : a; }
   else if (C === 'V') { const b = num(); y = rel ? y + b : b; }
   else throw new Error('comando no soportado ' + cmd);
   if (!cur) cur = [[sx, sy]];
   const last = cur[cur.length - 1]; if (Math.hypot(last[0] - x, last[1] - y) > 1e-4) cur.push([x, y]);
  }
  if (cur && cur.length > 2) polys.push(cur);
  // quitar el punto de cierre duplicado
  return polys.map((p) => { const a = p[0], b = p[p.length - 1]; return Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-3 ? p.slice(0, -1) : p; });
 }
 const BIN = parseLinePath(LG.binance.paths[0].d);
 PR.BIN_POLYS = BIN;
 const P2D = {}; const path2d = (k, i) => (P2D[k + i] || (P2D[k + i] = new Path2D(LG[k].paths[i].d)));
 PR.binancePath = () => path2d('binance', 0);

 // ---------- capa de reflejo genérica (misma receta que chip(): espejo + máscara degradada) ----------
 let RF = null;
 PR.reflect = function (x, c, W, Hh, drawMirror, alpha, floorY) {
  if (!RF || RF.width !== W || RF.height !== Hh) RF = H.layer(W, Hh);
  const r = RF.getContext('2d'); r.setTransform(1, 0, 0, 1, 0, 0); r.globalCompositeOperation = 'source-over'; r.globalAlpha = 1; r.clearRect(0, 0, W, Hh);
  drawMirror(r);
  const fy = floorY == null ? c.cy : floorY, span = c.unit * 0.9;
  r.globalCompositeOperation = 'destination-in';
  const g = r.createLinearGradient(0, fy - 4, 0, fy + span);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(4 / (span + 4), 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  r.fillStyle = g; r.fillRect(0, 0, W, Hh);
  r.globalCompositeOperation = 'source-over';
  x.save(); x.globalAlpha *= alpha; x.drawImage(RF, 0, 0, W, Hh); x.restore();
 };
 // sombra de contacto (original de chip())
 PR.contact = function (x, c, wx, wz, rad, a) {
  const p = c.P(wx, 0, wz);
  x.save(); x.translate(p[0], p[1]); x.scale(1, Math.max(0.18, Math.sin(c.pitch) * 0.8));
  const g = x.createRadialGradient(0, 0, 0, 0, 0, c.unit * rad);
  g.addColorStop(0, `rgba(0,0,0,${0.7 * a})`); g.addColorStop(0.6, `rgba(0,0,0,${0.28 * a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.beginPath(); x.arc(0, 0, c.unit * rad, 0, 7); x.fill(); x.restore();
 };

 // ---------- transformación local de un objeto (posición + giro sobre el eje vertical) ----------
 function xf(c, o, mirror) {
  const cr = Math.cos(o.ry || 0), sr = Math.sin(o.ry || 0), s = o.scale == null ? 1 : o.scale;
  return (lx, ly, lz) => { lx *= s; ly *= s; lz *= s; const wx = o.x + lx * cr + lz * sr, wz = o.z - lx * sr + lz * cr, wy = o.y + ly; return mirror ? c.P(wx, -wy, wz) : c.P(wx, wy, wz); };
 }
 PR.xf = xf;
 const facing = (c, o, nx, nz) => { const cr = Math.cos(o.ry || 0), sr = Math.sin(o.ry || 0); const wx = nx * cr + nz * sr, wz = -nx * sr + nz * cr; return c.N(wx, wz)[1] * Math.cos(c.pitch); };

 // ---------- EMBLEMA BINANCE 3D ----------
 // o: {x,y,z, size, depth, ry, a, key, rim, spec(-0.3..1.3), glow, glitch(0..1), t}
 PR.emblem3D = function (x, c, o, mirror) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const T = xf(c, o, mirror), size = o.size, dep = o.depth;
  const L = (p, s) => T((p[0] - 12) / 24 * size, (24 - p[1]) / 24 * size, s * dep / 2);
  const fv = facing(c, o, 0, 1), cap = fv >= 0 ? 1 : -1;
  const cr = Math.cos(o.ry || 0), sr = Math.sin(o.ry || 0);
  x.save(); x.globalAlpha *= a;
  // caras laterales (metal mecanizado), ordenadas por profundidad
  const sides = [];
  for (const poly of BIN) for (let i = 0; i < poly.length; i++) {
   const p = poly[i], q = poly[(i + 1) % poly.length];
   const ex = q[0] - p[0], ey = -(q[1] - p[1]), el = Math.hypot(ex, ey) || 1;
   const nx = ey / el, ny = -ex / el; // normal en el plano del símbolo
   const wnx = nx * cr, wnz = -nx * sr;
   const quad = [L(p, 1), L(q, 1), L(q, -1), L(p, -1)];
   sides.push({ quad, dep: (quad[0][2] + quad[1][2] + quad[2][2] + quad[3][2]) / 4, nx: wnx, ny, nz: wnz });
  }
  sides.sort((u, v) => u.dep - v.dep);
  const key = o.key == null ? 1 : o.key, rim = o.rim == null ? 1 : o.rim;
  for (const s of sides) {
   const [NX, NZ] = c.N(s.nx, s.nz);
   const lam = Math.max(0, NX * -0.55 + s.ny * 0.5 + NZ * 0.65), rimL = Math.pow(Math.max(0, NX), 3);
   const v = 0.18 + 0.75 * lam * key + 0.6 * rimL * rim;
   x.fillStyle = `rgb(${Math.min(255, 240 * v) | 0},${Math.min(255, 175 * v) | 0},${Math.min(255, 20 + 30 * v) | 0})`;
   S.poly(x, s.quad); x.fill(); x.strokeStyle = x.fillStyle; x.lineWidth = 0.8; x.stroke();
  }
  // cara frontal: oro con degradado de softbox
  const capPts = BIN.map((poly) => poly.map((p) => L(p, cap)));
  let minY = 1e9, maxY = -1e9, minX = 1e9, maxX = -1e9;
  capPts.forEach((pl) => pl.forEach((p) => { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); }));
  const capPath = () => { x.beginPath(); capPts.forEach((pl) => { pl.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.closePath(); }); };
  const g = x.createLinearGradient(minX, minY, maxX * 0.3 + minX * 0.7, maxY);
  const k = 0.55 + 0.45 * key;
  g.addColorStop(0, `rgb(${255 * k | 0},${236 * k | 0},${170 * k | 0})`); g.addColorStop(0.35, `rgb(${246 * k | 0},${190 * k | 0},${24 * k | 0})`); g.addColorStop(1, `rgb(${150 * k | 0},${104 * k | 0},${6 * k | 0})`);
  if (!mirror && o.glow) { x.save(); x.shadowColor = `rgba(240,185,11,${0.65 * o.glow})`; x.shadowBlur = 60 * o.glow; capPath(); x.fillStyle = g; x.fill(); x.restore(); }
  capPath(); x.fillStyle = g; x.fill();
  if (!mirror) {
   x.save(); capPath(); x.clip();
   // barrido especular
   if (o.spec > -0.3 && o.spec < 1.3) {
    const gg = x.createLinearGradient(minX - 80, minY, maxX + 80, maxY), u = o.spec;
    const st = (off, al) => { const q = u + off; if (q > 0 && q < 1) gg.addColorStop(q, `rgba(255,255,255,${al})`); };
    gg.addColorStop(0, 'rgba(255,255,255,0)'); st(-0.12, 0); st(-0.03, 0.15); st(0, 0.75 * key); st(0.03, 0.2); st(0.1, 0); gg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gg; x.fillRect(minX - 100, minY - 100, maxX - minX + 200, maxY - minY + 200);
   }
   // perturbación: barras de interferencia roja que atraviesan el sistema
   if (o.glitch > 0.01) {
    const r = H.rng(700 + Math.floor((o.t || 0) * 30));
    for (let i = 0; i < 7; i++) { const yy = minY + r() * (maxY - minY), hh = 3 + r() * 14; x.fillStyle = `rgba(255,69,58,${0.55 * o.glitch * r()})`; x.fillRect(minX - 40 + (r() - 0.5) * 60 * o.glitch, yy, maxX - minX + 80, hh); }
   }
   x.restore();
   x.strokeStyle = `rgba(255,236,170,${0.35 + 0.4 * rim})`; x.lineWidth = 1.4; capPath(); x.stroke();
  }
  x.restore();
 };

 // ---------- FICHA DE CRIPTO (logo genuino) ----------
 // kind: btc | eth | usdt | bnb ; o: {squash, spin, a, glow, th}
 PR.coin = function (x, X, Y, R, kind, o) {
  o = o || {}; const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const lg = LG[kind], sx = Math.cos(o.spin || 0), sy = o.squash == null ? 1 : o.squash, th = (o.th == null ? 0.16 : o.th) * R;
  x.save(); x.globalAlpha *= a; x.translate(X, Y);
  // canto (grosor)
  const edgeCol = H.rgba(H.mix(lg.disc, '#000000', 0.45), 1);
  x.fillStyle = edgeCol; x.beginPath(); x.ellipse(0, th * sy, R * Math.abs(sx), R * sy, 0, 0, 7); x.fill();
  x.fillRect(-R * Math.abs(sx), 0, 2 * R * Math.abs(sx), th * sy);
  // resplandor
  if (o.glow) { x.shadowColor = H.rgba(lg.disc, 0.8 * o.glow); x.shadowBlur = 30 * o.glow; }
  x.save(); x.scale(Math.abs(sx) < 0.02 ? 0.02 : sx, sy);
  x.fillStyle = lg.disc; x.beginPath(); x.arc(0, 0, R, 0, 7); x.fill(); x.shadowBlur = 0;
  // glifo oficial (viewBox 32)
  if (Math.abs(sx) > 0.2) {
   x.save(); x.scale(R / 16, R / 16); x.translate(-16, -16);
   lg.paths.forEach((p, i) => { x.globalAlpha = a * p.op; x.fillStyle = '#fff'; x.fill(path2d(kind, i), kind === 'usdt' ? 'evenodd' : 'nonzero'); });
   x.restore();
  }
  // brillo de vidrio
  const g = x.createLinearGradient(-R, -R, R, R); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
  x.globalAlpha = a; x.fillStyle = g; x.beginPath(); x.arc(0, 0, R, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = 1.5 / Math.max(0.3, Math.min(Math.abs(sx), sy)); x.stroke();
  x.restore(); x.restore();
 };

 // ---------- CAJA ORIENTABLE ----------
 PR.box3r = function (x, c, o, w, h, d, st) {
  st = st || {}; const T = xf(c, o, st.mirror);
  const X = [-w / 2, w / 2], Y = [0, h], Z = [-d / 2, d / 2];
  const v = []; for (const xx of X) for (const yy of Y) for (const zz of Z) v.push(T(xx, yy, zz));
  const id = (i, j, k) => i * 4 + j * 2 + k;
  const faces = [
   { q: [id(0, 0, 0), id(0, 1, 0), id(0, 1, 1), id(0, 0, 1)], n: 'side', nx: -1, nz: 0 }, { q: [id(1, 0, 0), id(1, 0, 1), id(1, 1, 1), id(1, 1, 0)], n: 'side', nx: 1, nz: 0 },
   { q: [id(0, 0, 0), id(1, 0, 0), id(1, 1, 0), id(0, 1, 0)], n: 'back', nx: 0, nz: -1 }, { q: [id(0, 0, 1), id(0, 1, 1), id(1, 1, 1), id(1, 0, 1)], n: 'front', nx: 0, nz: 1 },
   { q: [id(0, 1, 0), id(1, 1, 0), id(1, 1, 1), id(0, 1, 1)], n: 'top', nx: 0, nz: 0 },
  ];
  faces.forEach((f) => { f.dep = f.q.reduce((s, i) => s + v[i][2], 0) / 4; });
  faces.sort((a, b) => a.dep - b.dep);
  const al = st.alpha == null ? 1 : st.alpha;
  for (const f of faces) {
   if (f.n !== 'top' && facing(c, o, f.nx, f.nz) < -0.02) continue;
   const pts = f.q.map((i) => v[i]);
   S.poly(x, pts);
   const base = f.n === 'top' ? (st.top || 'rgba(40,44,56,0.92)') : f.n === 'front' ? (st.front || 'rgba(22,24,32,0.95)') : (st.side || 'rgba(14,15,20,0.95)');
   x.save(); x.globalAlpha *= al; x.fillStyle = base; x.fill();
   x.strokeStyle = st.edge || 'rgba(235,238,255,0.35)'; x.lineWidth = st.lw || 1.2; x.stroke(); x.restore();
  }
  return { v, id, top: [v[id(0, 1, 0)], v[id(1, 1, 0)], v[id(0, 1, 1)]], front: [v[id(0, 1, 1)], v[id(1, 1, 1)], v[id(0, 0, 1)]], c: T(0, h, 0), cf: T(0, h / 2, d / 2) };
 };
 // dibuja contenido 2D (u,v en [0..UW]x[0..UH]) sobre una cara proyectada (afín: TL, TR, BL)
 PR.onFace = function (x, tri, UW, UH, fn) {
  const [TL, TR, BL] = tri;
  x.save();
  const m = x.getTransform();
  x.transform((TR[0] - TL[0]) / UW, (TR[1] - TL[1]) / UW, (BL[0] - TL[0]) / UH, (BL[1] - TL[1]) / UH, TL[0], TL[1]);
  fn(x); x.restore(); void m;
 };

 // ---------- BÓVEDA (metáfora física) ----------
 // o: {x,y,z,R, ry, a, wheel(rad), dissolve(0..1), target:[sx,sy], t}
 PR.vault = function (x, c, o) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const T = xf(c, o), R = o.R, dz = 0.22;
  const ring = (r, z, n = 72) => Array.from({ length: n }, (_, i) => { const an = i / n * PI * 2; return T(Math.cos(an) * r, R + Math.sin(an) * r, z); });
  const dis = o.dissolve || 0;
  if (dis <= 0) {
   x.save(); x.globalAlpha *= a;
   // cuerpo cilíndrico (canto) + cara frontal de acero
   const back = ring(R, -dz), front = ring(R, dz);
   x.fillStyle = '#2a2d36'; S.poly(x, back); x.fill();
   for (let i = 0; i < front.length; i++) { const j = (i + 1) % front.length; const sh = 0.4 + 0.6 * Math.max(0, Math.cos(i / front.length * PI * 2 - 2.4)); x.fillStyle = `rgb(${60 * sh + 30 | 0},${62 * sh + 32 | 0},${70 * sh + 36 | 0})`; S.poly(x, [back[i], back[j], front[j], front[i]]); x.fill(); }
   const f0 = T(0, R, dz);
   const gr = x.createRadialGradient(f0[0] - 40, f0[1] - 60, 10, f0[0], f0[1], c.unit * R * 1.2);
   gr.addColorStop(0, '#6b6f7c'); gr.addColorStop(0.5, '#3a3d48'); gr.addColorStop(1, '#16171c');
   x.fillStyle = gr; S.poly(x, front); x.fill();
   x.strokeStyle = 'rgba(235,238,255,0.6)'; x.lineWidth = 2; S.poly(x, front); x.stroke();
   x.strokeStyle = 'rgba(235,238,255,0.25)'; S.poly(x, ring(R * 0.82, dz + 0.01)); x.stroke();
   // pernos
   for (let k = 0; k < 16; k++) { const an = k / 16 * PI * 2, p = T(Math.cos(an) * R * 0.9, R + Math.sin(an) * R * 0.9, dz + 0.01); x.fillStyle = '#9a9eab'; x.beginPath(); x.arc(p[0], p[1], 0.035 * c.unit, 0, 7); x.fill(); }
   // volante (radios) que gira
   x.strokeStyle = '#c9ccd6'; x.lineWidth = 0.05 * c.unit; x.lineCap = 'round';
   for (let k = 0; k < 6; k++) { const an = k / 6 * PI * 2 + (o.wheel || 0), p = T(Math.cos(an) * R * 0.45, R + Math.sin(an) * R * 0.45, dz + 0.04), q = T(Math.cos(an) * R * 0.12, R + Math.sin(an) * R * 0.12, dz + 0.04); x.beginPath(); x.moveTo(q[0], q[1]); x.lineTo(p[0], p[1]); x.stroke(); }
   x.restore();
  } else {
   // desintegración elegante: puntos de los contornos que viajan hacia el dial (match cut)
   const r = H.rng(77), pts = [];
   for (const rr of [1, 0.82, 0.45]) for (let i = 0; i < 90; i++) { const an = i / 90 * PI * 2; pts.push(T(Math.cos(an) * R * rr, R + Math.sin(an) * R * rr, dz)); }
   const tg = o.target || T(0, R, dz);
   x.save();
   for (const p of pts) {
    const j = r(), d = H.clamp((dis - j * 0.45) / 0.55); if (d >= 1) continue;
    const dd = io(d), wob = Math.sin(d * PI);
    const X = H.lerp(p[0] + (r() - 0.5) * 120 * wob, tg[0], dd), Y = H.lerp(p[1] + (r() - 0.5) * 120 * wob, tg[1], dd);
    x.globalAlpha = a * (1 - dd * 0.85); x.fillStyle = d > 0.05 ? '#ffd76a' : '#c9ccd6'; x.beginPath(); x.arc(X, Y, 2.6, 0, 7); x.fill();
   }
   x.restore();
  }
 };
 // dial de la cerradura (sobrevive al match cut y se convierte en indicador de autorización)
 PR.dial = function (x, X, Y, rad, o) {
  o = o || {}; const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const col = o.col || BGOLD;
  x.save(); x.globalAlpha *= a; x.lineCap = 'round';
  x.strokeStyle = 'rgba(255,255,255,0.15)'; x.lineWidth = rad * 0.14; x.beginPath(); x.arc(X, Y, rad, 0, 7); x.stroke();
  x.shadowColor = col; x.shadowBlur = 24 * (o.glow == null ? 1 : o.glow); x.strokeStyle = col; x.lineWidth = rad * 0.14;
  const p = o.p == null ? 1 : o.p; x.beginPath(); x.arc(X, Y, rad, -PI / 2 + (o.rot || 0), -PI / 2 + (o.rot || 0) + p * PI * 2); x.stroke(); x.shadowBlur = 0;
  // marcas del dial
  for (let k = 0; k < 24; k++) { const an = k / 24 * PI * 2 + (o.rot || 0); const r0 = rad * 0.72, r1 = rad * (k % 6 ? 0.8 : 0.86); x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 2; x.beginPath(); x.moveTo(X + Math.cos(an) * r0, Y + Math.sin(an) * r0); x.lineTo(X + Math.cos(an) * r1, Y + Math.sin(an) * r1); x.stroke(); }
  // icono central
  x.strokeStyle = col; x.fillStyle = col; x.lineWidth = rad * 0.1;
  if (o.icon === 'check') { x.beginPath(); x.moveTo(X - rad * 0.3, Y + rad * 0.02); x.lineTo(X - rad * 0.08, Y + rad * 0.25); x.lineTo(X + rad * 0.34, Y - rad * 0.22); x.stroke(); }
  else if (o.icon === 'x') { x.beginPath(); x.moveTo(X - rad * 0.25, Y - rad * 0.25); x.lineTo(X + rad * 0.25, Y + rad * 0.25); x.moveTo(X + rad * 0.25, Y - rad * 0.25); x.lineTo(X - rad * 0.25, Y + rad * 0.25); x.stroke(); }
  else if (o.icon === 'lock') { const s = rad * 0.32, drop = (o.lockOpen || 0) * rad * 0.18; x.beginPath(); x.roundRect(X - s, Y - s * 0.2, 2 * s, s * 1.5, s * 0.25); x.stroke(); x.beginPath(); x.arc(X, Y - s * 0.2 - drop, s * 0.62, PI, 0); x.stroke(); }
  else if (o.icon === 'key') { x.beginPath(); x.arc(X - rad * 0.2, Y, rad * 0.16, 0, 7); x.stroke(); x.beginPath(); x.moveTo(X - rad * 0.04, Y); x.lineTo(X + rad * 0.38, Y); x.moveTo(X + rad * 0.22, Y); x.lineTo(X + rad * 0.22, Y + rad * 0.14); x.moveTo(X + rad * 0.34, Y); x.lineTo(X + rad * 0.34, Y + rad * 0.1); x.stroke(); }
  else { x.beginPath(); x.arc(X, Y, rad * 0.12, 0, 7); x.fill(); }
  x.restore();
 };

 // ---------- FAJOS (metáfora física) ----------
 PR.cash = function (x, c, o) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  for (let k = 0; k < 3; k++) for (let j = 0; j < 3 - k; j++) {
   const oo = { x: o.x + (j - (2 - k) / 2) * 0.62, y: o.y + k * 0.2, z: o.z, ry: o.ry };
   const r = PR.box3r(x, c, oo, 0.58, 0.19, 0.32, { alpha: a, top: 'rgba(196,204,190,0.95)', front: 'rgba(150,160,146,0.95)', side: 'rgba(110,118,108,0.95)', edge: 'rgba(255,255,255,0.4)' });
   // faja central
   const b0 = PR.xf(c, oo)(-0.06, 0.19, -0.16), b1 = PR.xf(c, oo)(0.06, 0.19, 0.16);
   x.save(); x.globalAlpha *= a; x.fillStyle = 'rgba(240,185,11,0.85)'; const q = [PR.xf(c, oo)(-0.06, 0.191, -0.16), PR.xf(c, oo)(0.06, 0.191, -0.16), PR.xf(c, oo)(0.06, 0.191, 0.16), PR.xf(c, oo)(-0.06, 0.191, 0.16)]; S.poly(x, q); x.fill(); x.restore();
   void r; void b0; void b1;
  }
 };

 // ---------- BILLETERA CALIENTE: dispositivo de vidrio y metal ----------
 // o: {x,y,z,ry,scale,a, bal(0..1), state:'idle'|'ok'|'alert'|'gold', online, flow(0..1 tráfico), t, ringP, ringIcon, ringCol, spec, key}
 PR.DW = 1.5; PR.DH = 2.3; PR.DD = 0.16;
 PR.device = function (x, c, o, mirror) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return null;
  const w = PR.DW, h = PR.DH, d = PR.DD, t = o.t || 0;
  const key = o.key == null ? 1 : o.key;
  // chasis metálico
  const f = PR.box3r(x, c, o, w, h, d, { alpha: a, mirror, top: 'rgba(120,124,138,0.95)', front: 'rgba(14,15,20,0.98)', side: `rgba(${70 + 50 * key | 0},${72 + 50 * key | 0},${82 + 50 * key | 0},0.98)`, edge: 'rgba(235,238,255,0.55)', lw: 1.6 });
  if (mirror) return f;
  const T = xf(c, o);
  // pantalla (inset) sobre la cara frontal
  const inset = 0.09, sTL = T(-w / 2 + inset, h - inset, d / 2 + 0.002), sTR = T(w / 2 - inset, h - inset, d / 2 + 0.002), sBL = T(-w / 2 + inset, inset, d / 2 + 0.002), sBR = T(w / 2 - inset, inset, d / 2 + 0.002);
  if (facing(c, o, 0, 1) < 0) return f;
  x.save(); x.globalAlpha *= a;
  S.poly(x, [sTL, sTR, sBR, sBL]); x.fillStyle = '#05060a'; x.fill(); x.save(); x.clip();
  const UW = 600, UH = 940;
  PR.onFace(x, [sTL, sTR, sBL], UW, UH, (u) => walletUI(u, UW, UH, o, t));
  // vidrio: reflejo del softbox + barrido especular
  const g = x.createLinearGradient(sTL[0], sTL[1], sBR[0], sBR[1]); g.addColorStop(0, `rgba(255,255,255,${0.14 * key})`); g.addColorStop(0.35, 'rgba(255,255,255,0.02)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(Math.min(sTL[0], sBL[0]) - 10, Math.min(sTL[1], sTR[1]) - 10, Math.abs(sTR[0] - sTL[0]) + 40, Math.abs(sBL[1] - sTL[1]) + 40);
  if (o.spec > -0.3 && o.spec < 1.3) {
   const gg = x.createLinearGradient(sTL[0] - 50, sTL[1], sBR[0] + 50, sBR[1]), u = o.spec;
   const st = (off, al) => { const q = u + off; if (q > 0 && q < 1) gg.addColorStop(q, `rgba(255,255,255,${al})`); };
   gg.addColorStop(0, 'rgba(255,255,255,0)'); st(-0.1, 0); st(-0.03, 0.06); st(0, 0.32 * key); st(0.02, 0.12); st(0.08, 0); gg.addColorStop(1, 'rgba(255,255,255,0)');
   x.fillStyle = gg; x.fillRect(Math.min(sTL[0], sBL[0]) - 60, Math.min(sTL[1], sTR[1]) - 60, Math.abs(sTR[0] - sTL[0]) + 120, Math.abs(sBL[1] - sTL[1]) + 120);
  }
  x.restore();
  // marco de vidrio iluminado (rim)
  x.strokeStyle = `rgba(235,238,255,${0.35 + 0.3 * key})`; x.lineWidth = 1.4; S.poly(x, [sTL, sTR, sBR, sBL]); x.stroke();
  x.restore();
  // antena de conexión: ondas
  if (o.online > 0.01) {
   const top = T(0, h + 0.12, 0);
   x.save(); x.globalAlpha *= a * o.online; x.strokeStyle = CYAN; x.lineCap = 'round';
   for (let k = 0; k < 3; k++) { const ph = ((t * 1.2 + k / 3) % 1); x.globalAlpha = a * o.online * (1 - ph); x.lineWidth = 4; x.beginPath(); x.arc(top[0], top[1] + 20, 20 + ph * 70, PI * 1.2, PI * 1.8); x.stroke(); }
   x.restore();
  }
  return Object.assign(f, { T, screen: [sTL, sTR, sBL, sBR], ringAt: () => { const p = T(0, 0.09 + (h - 0.18) * (1 - 790 / UH), d / 2); return p; } });
 };
 function walletUI(u, UW, UH, o, t) {
  const state = o.state || 'idle';
  const accent = state === 'alert' ? RED : state === 'gold' ? BGOLD : CYAN;
  // cabecera
  u.fillStyle = 'rgba(255,255,255,0.04)'; u.fillRect(0, 0, UW, 110);
  u.font = '800 44px "Inter"'; u.fillStyle = INK; u.textAlign = 'left'; u.textBaseline = 'middle'; u.fillText('HOT WALLET', 36, 58);
  const on = 0.6 + 0.4 * Math.sin(t * 6);
  u.fillStyle = state === 'alert' ? `rgba(255,69,58,${on})` : `rgba(56,189,248,${on})`; u.beginPath(); u.arc(UW - 60, 56, 14, 0, 7); u.fill();
  // saldo (barra; sin cifras inventadas)
  u.font = '600 34px "Inter"'; u.fillStyle = GREY; u.fillText('SALDO', 36, 170);
  u.fillStyle = 'rgba(255,255,255,0.08)'; u.beginPath(); u.roundRect(36, 200, UW - 72, 46, 23); u.fill();
  const bal = H.clamp(o.bal == null ? 1 : o.bal);
  const gb = u.createLinearGradient(36, 0, UW - 36, 0);
  if (state === 'gold') { gb.addColorStop(0, '#ffe08a'); gb.addColorStop(1, '#f0b90b'); } else if (state === 'alert') { gb.addColorStop(0, '#ff9a4d'); gb.addColorStop(1, '#ff453a'); } else { gb.addColorStop(0, '#5eead4'); gb.addColorStop(1, '#38bdf8'); }
  u.fillStyle = gb; u.beginPath(); u.roundRect(36, 200, Math.max(46, (UW - 72) * bal), 46, 23); u.fill();
  // filas de activos (ejemplos) con flechas de entrada/salida
  const kinds = ['btc', 'eth', 'usdt', 'bnb'];
  kinds.forEach((k, i) => {
   const y = 330 + i * 105;
   u.fillStyle = 'rgba(255,255,255,0.035)'; u.beginPath(); u.roundRect(28, y - 44, UW - 56, 88, 18); u.fill();
   PR.coin(u, 84, y, 32, k, { th: 0.1 });
   u.fillStyle = 'rgba(255,255,255,0.1)'; u.beginPath(); u.roundRect(140, y - 10, 250, 20, 10); u.fill();
   const lv = H.clamp(bal * (0.55 + 0.4 * ((i * 37) % 10) / 10));
   u.fillStyle = H.rgba(accent, 0.8); u.beginPath(); u.roundRect(140, y - 10, 250 * lv, 20, 10); u.fill();
   // flecha in/out animada (tráfico)
   const fl = o.flow || 0;
   if (fl > 0) {
    const out = (i % 2 === 0) !== (state === 'alert'), ph = ((t * 2.2 + i * 0.27) % 1);
    u.save(); u.globalAlpha = fl; u.strokeStyle = state === 'alert' ? RED : out ? '#ff9a4d' : '#5eead4'; u.lineWidth = 7; u.lineCap = 'round';
    const ax = 470, dir = (state === 'alert' || out) ? 1 : -1, ox = dir * (ph - 0.5) * 40;
    u.beginPath(); u.moveTo(ax - 40 + ox, y); u.lineTo(ax + 40 + ox, y); u.moveTo(ax + ox + dir * 40, y); u.lineTo(ax + ox + dir * 22, y - 16); u.moveTo(ax + ox + dir * 40, y); u.lineTo(ax + ox + dir * 22, y + 16); u.stroke(); u.restore();
   }
  });
  u.font = '600 30px "Inter"'; u.fillStyle = '#8e8e93'; u.textAlign = 'center'; u.fillText('activos de ejemplo', UW / 2, 750);
  // indicador de autorización (el dial del match cut)
  PR.dial(u, UW / 2, 850, 62, { a: o.ringA == null ? 1 : o.ringA, p: o.ringP == null ? 1 : o.ringP, col: o.ringCol || accent, icon: o.ringIcon || 'dot', rot: t * 0.4, glow: 0.8, lockOpen: o.lockOpen });
 }

 // ---------- MÓDULO DE AUTORIZACIÓN: tres tarjetas 3D de vidrio (solicitud → verificación → firma) ----------
 // o: {x,y,z,ry,scale,a, st:[s0,s1,s2] (0 apagado..1 encendido), col, t}
 PR.tiles = function (x, c, o) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return [];
  const out = [];
  const icons = ['doc', 'shield', 'key'];
  for (let i = 0; i < 3; i++) {
   const on = o.st ? o.st[i] : 0, col = o.cols ? o.cols[i] : (o.col || BGOLD), rgb = H.hex(col).join(',');
   const oo = { x: o.x + (i - 1) * 1.05 * (o.scale || 1), y: o.y + 0.05 * Math.sin((o.t || 0) * 1.6 + i), z: o.z, ry: o.ry, scale: o.scale };
   const r = PR.box3r(x, c, oo, 0.82, 0.82, 0.1, { alpha: a, top: `rgba(${on > 0.05 ? rgb : '40,44,56'},${0.25 + 0.35 * on})`, front: 'rgba(20,22,30,0.92)', side: 'rgba(14,16,22,0.92)', edge: on > 0.05 ? `rgba(${rgb},${0.5 + 0.5 * on})` : 'rgba(235,238,255,0.35)', lw: 2 });
   PR.onFace(x, r.front, 100, 100, (u) => {
    u.globalAlpha = a * (0.45 + 0.55 * on); u.strokeStyle = on > 0.05 ? col : '#c7c7cc'; u.lineWidth = 7; u.lineCap = 'round'; u.lineJoin = 'round';
    if (on > 0.05) { u.shadowColor = col; u.shadowBlur = 16 * on; }
    if (icons[i] === 'doc') { u.beginPath(); u.roundRect(30, 18, 40, 60, 6); u.stroke(); u.beginPath(); u.moveTo(40, 36); u.lineTo(60, 36); u.moveTo(40, 50); u.lineTo(60, 50); u.moveTo(40, 64); u.lineTo(52, 64); u.stroke(); }
    else if (icons[i] === 'shield') { u.beginPath(); u.moveTo(50, 16); u.lineTo(78, 28); u.quadraticCurveTo(76, 66, 50, 84); u.quadraticCurveTo(24, 66, 22, 28); u.closePath(); u.stroke(); if (o.mark && o.mark[i]) { u.beginPath(); if (o.mark[i] === 'x') { u.moveTo(38, 38); u.lineTo(62, 62); u.moveTo(62, 38); u.lineTo(38, 62); } else { u.moveTo(37, 50); u.lineTo(47, 61); u.lineTo(64, 39); } u.stroke(); } }
    else { u.beginPath(); u.arc(34, 50, 13, 0, 7); u.stroke(); u.beginPath(); u.moveTo(47, 50); u.lineTo(80, 50); u.moveTo(68, 50); u.lineTo(68, 62); u.moveTo(78, 50); u.lineTo(78, 58); u.stroke(); }
   });
   out.push(r);
  }
  return out;
 };
})();
