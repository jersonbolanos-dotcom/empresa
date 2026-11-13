// =====================================================================================================
// episodio.js — «¿Qué pasa si…?» Cap. 1 · ¿Qué pasa si te cae un rayo dentro del carro? · PLANTILLA ASOMBROTECA v1.37 · «noche»
// V2 (más planos y movimiento; la V1 está en ../V1/). Serie: serie_que_pasa_si (P.pregunta fija + remate P.queHacer). UN gancho: el A.
// Voz: ElevenLabs Eleven v4, Dan, UNA toma (1.008 caracteres), 26 tramos, 61,9 s (intacta). Metáfora sostenida: el PARAGUAS.
// Planos: lateral con cámara que se mueve (seguimiento, zoom al techo, a la llanta, al vidrio de atrás), cenital, cabina por dentro
// (conductor, parabrisas con limpiaparabrisas y lluvia, tablero) y el paraguas. Impactos: fogonazo blanco, sacudida y trueno fuerte.
// Carro, carretera, persona y paraguas dibujados genéricos, sin marcas. Manos sueltas solo con P.manoImg.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, DURATION, txt } = K;
 const S = (i) => A.segments[i].s;
 const YE = '#ffd23f', RD = '#ff4d5e', GR = '#22d27a', CY = '#8fd8ff';
 const PORTADA = typeof window !== 'undefined' && !!window.__SIN_SUBTITULOS;
 const Tk = {
  rayo: wt(1, 'rayo'), encima: wt(1, 'encima.'), sorprender: wt(3, 'sorprender.'), paraguas: wt(4, 'paraguas'), mango: wt(5, 'mango…'), tela: wt(6, 'tela'), agua: wt(7, 'agua'), suelo0: wt(7, 'suelo.'),
  rayo2: wt(8, 'rayo.'), corriente: wt(9, 'corriente'), carroceria: wt(9, 'carrocería'), fuera: wt(10, 'fuera,'), alrededor: wt(10, 'alrededor'), baja: wt(11, 'baja'), llantas0: wt(11, 'llantas.'),
  sorpresa: wt(12, 'sorpresa:'), llantas: wt(13, 'llantas'), salvan: wt(13, 'salvan.'), fuerte: wt(14, 'fuerte'), detenga: wt(14, 'detenga.'), metal: wt(15, 'metal'), jaula: wt(15, 'jaula.'),
  descapotable: wt(16, 'descapotable'), capota: wt(16, 'capota'), sinTela: wt(17, 'tela.'), danado: wt(19, 'dañado:'), quemar: wt(20, 'quemar'), electronica: wt(20, 'electrónica,'), reventar: wt(20, 'reventar'), llanta: wt(20, 'llanta'), romper: wt(20, 'romper'), vidrio: wt(20, 'vidrio'),
  hacer: wt(21, 'hacer?'), quedate: wt(22, 'Quédate'), sube: wt(23, 'Sube'), toques: wt(24, 'toques'), envia: S(25),
 };
 const T_CERCA = 0.7, T_TECHO = 1.85;   // peligro en < 2 s: un rayo cae cerca a 0,7 s y otro en el techo a 1,85 s
 const T_ARRIBA = Tk.rayo2 - 0.25, T_LLANTA = Tk.fuerte - 0.1;
 // TOPE: y (pantalla) bajo los subtítulos y la pregunta; el rayo no entra por encima (el texto se lee entero). En la portada no hay textos.
 let TOPE = 440; const tope = (y) => { TOPE = PORTADA ? 0 : y; };

 // ---------- cámara: plano = centro del mundo (cx, cy) y zoom z; las tomas se encadenan con paneos y zooms suaves ----------
 const SY = 950;
 const camK = (t, Kf) => { if (t <= Kf[0][0]) return Kf[0].slice(1); for (let i = 0; i < Kf.length - 1; i++) { const [t0, x0, y0, z0] = Kf[i], [t1, x1, y1, z1] = Kf[i + 1]; if (t < t1) { const u = E.inOut(cl((t - t0) / Math.max(0.01, t1 - t0))); return [lerp(x0, x1, u), lerp(y0, y1, u), Math.exp(lerp(Math.log(z0), Math.log(z1), u))]; } } return Kf[Kf.length - 1].slice(1); };
 const sacude = (t, golpes, amp = 30) => { let x = 0, y = 0; for (const [g, f] of golpes) { const d = t - g; if (d >= 0 && d < 0.6) { const k = amp * f * Math.exp(-d * 7); x += Math.sin(d * 97) * k; y += Math.cos(d * 83) * k * 0.8; } } return [x, y]; };
 const vista = (ctx, cam, sh = [0, 0], sy = SY) => { ctx.translate(540 + sh[0], sy + sh[1]); ctx.scale(cam[2], cam[2]); ctx.translate(-cam[0], -cam[1]); };
 const aPantalla = (cam, x, y, sy = SY) => [540 + (x - cam[0]) * cam[2], sy + (y - cam[1]) * cam[2]];
 // fogonazo blanco a pantalla completa en cada impacto (f = fuerza)
 const fogonazo = (ctx, t, golpes) => { let a = 0; for (const [g, f] of golpes) { const d = t - g; if (d >= 0 && d < 0.7) a = Math.max(a, Math.min(1, f) * (d < 0.07 ? 1 : Math.exp(-(d - 0.07) * 8))); } if (a > 0) { ctx.fillStyle = `rgba(255,255,255,${0.96 * a})`; ctx.fillRect(-60, -60, W + 120, HH + 120); } };
 const rel = (t, golpes) => { let f = 0; for (const g of golpes) { const d = t - g; if (d >= 0 && d < 1.2) f = Math.max(f, Math.exp(-d * 6)); } return f; };

 // ---------- cielo de tormenta y lluvia (pantalla) ----------
 const cielo = (ctx, t, fl = 0) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, H.rgba(H.mix('#05070f', '#3a4c78', TOPE > 0 ? 0.15 * fl : fl))); g.addColorStop(0.55, H.rgba(H.mix('#0d1530', '#55689a', fl))); g.addColorStop(1, '#070a14'); ctx.fillStyle = g; ctx.fillRect(-60, -60, W + 120, HH + 120);
  const R = H.rng(31); for (let i = 0; i < 9; i++) { const x = ((R() * 1500 + t * (8 + R() * 10)) % 1500) - 210, y = 230 + R() * 420, r = 160 + R() * 160; ctx.fillStyle = `rgba(${Math.round(20 + 90 * fl)},${Math.round(26 + 100 * fl)},${Math.round(48 + 120 * fl)},0.75)`; ctx.beginPath(); ctx.ellipse(x, y, r * 1.5, r * 0.55, 0, 0, TAU); ctx.fill(); } };
 const lluvia = (ctx, t, a = 1, fl = 0, inc = 0.18) => { const R = H.rng(77); ctx.save(); ctx.strokeStyle = `rgba(${Math.round(150 + 100 * fl)},${Math.round(180 + 70 * fl)},255,${0.38 * a})`; ctx.lineWidth = 2.5; ctx.beginPath();
  for (let i = 0; i < 160; i++) { const x0 = R() * 1500 - 200, y0 = R() * 2000, sp = 1500 + R() * 700, l = 34 + R() * 34, y = ((y0 + t * sp) % 2050) - 60, x = x0 - y * inc; ctx.moveTo(x, y); ctx.lineTo(x - l * inc, y + l); } ctx.stroke(); ctx.restore(); };
 // rayo zigzag con ramas (determinista), recortado bajo TOPE
 const rayoPts = (seed, x0, y0, x1, y1, n = 14, amp = 90) => { const R = H.rng(seed), pts = [[x0, y0]]; for (let k = 1; k < n; k++) { const u = k / n; pts.push([lerp(x0, x1, u) + (R() - 0.5) * amp * (1 - u * 0.6), lerp(y0, y1, u) + (R() - 0.5) * 20]); } pts.push([x1, y1]); return pts; };
 const rayo = (c, seed, x0, y0, x1, y1, a, w = 10) => { if (a <= 0) return; const pts = rayoPts(seed, x0, y0, x1, y1), R = H.rng(seed + 5); c.save(); if (TOPE > 0) { const m = c.getTransform(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.rect(0, TOPE, W, HH); c.clip(); c.setTransform(m); } c.globalAlpha *= a; c.lineJoin = 'round'; c.lineCap = 'round';
  const tr = (P0, lw, col, blur) => { c.shadowColor = '#9fd0ff'; c.shadowBlur = blur; c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); P0.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); };
  const ramas = []; for (let b = 0; b < 3; b++) { const i = 3 + Math.floor(R() * (pts.length - 6)), [bx, by] = pts[i], d = (R() > 0.5 ? 1 : -1); ramas.push(rayoPts(seed + 11 + b, bx, by, bx + d * (120 + R() * 140), by + 160 + R() * 160, 6, 50)); }
  for (const r of ramas) tr(r, w * 0.9, 'rgba(170,210,255,0.8)', 20); tr(pts, w * 2.6, 'rgba(160,205,255,0.55)', 50); tr(pts, w, '#ffffff', 25); c.restore(); };
 const chispas = (c, x, y, t, t0, n = 18, r = 160, dur = 0.9) => { const d = t - t0; if (d < 0 || d > dur) return; const R = H.rng(Math.round(t0 * 100)); c.save(); for (let i = 0; i < n; i++) { const a = R() * TAU, v = (0.4 + R()) * r, q = d / dur, px = x + Math.cos(a) * v * q, py = y + Math.sin(a) * v * q + 300 * q * q; c.strokeStyle = `rgba(255,${200 + Math.round(R() * 55)},120,${1 - q})`; c.lineWidth = 5; c.beginPath(); c.moveTo(px, py); c.lineTo(px - Math.cos(a) * 26, py - Math.sin(a) * 26); c.stroke(); } c.restore(); };
 const chispasLoop = (c, x, y, t, t0, n, r, per = 0.45) => { if (t < t0) return; const k = Math.floor((t - t0) / per); for (let j = Math.max(0, k - 1); j <= k; j++) chispas(c, x, y, t, t0 + j * per, n, r, 0.8); };
 const humo = (c, x, y, t, t0, a = 1) => { if (t < t0) return; const R = H.rng(Math.round(t0 * 10) + 3); c.save(); for (let i = 0; i < 14; i++) { const ph = ((t - t0) * 0.45 + R()) % 1, s = 30 + ph * 140; c.fillStyle = `rgba(120,128,145,${0.35 * a * (1 - ph) * cl((t - t0) * 2)})`; c.beginPath(); c.arc(x + (R() - 0.5) * 120 + ph * 60, y - ph * 420, s, 0, TAU); c.fill(); } c.restore(); };
 const trozos = (c, x, y, t, t0) => { const d = t - t0; if (d < 0 || d > 1.1) return; const R = H.rng(Math.round(t0 * 100) + 7), q = d / 1.1; c.save(); for (let i = 0; i < 16; i++) { const a = -Math.PI * R(), v = 200 + R() * 260; c.fillStyle = `rgba(20,22,26,${1 - q})`; c.save(); c.translate(x + Math.cos(a) * v * q * 1.4, y + Math.sin(a) * v * q + 500 * q * q); c.rotate(d * 8 * (R() - 0.5)); c.fillRect(-14, -8, 28, 16); c.restore(); } c.restore(); };

 // ---------- mundo LATERAL (suelo y = 0; carro centrado, mira a la derecha, largo ≈ 1000) ----------
 const fondoLejano = (c, t, vel) => { c.fillStyle = '#0a0f1e'; c.beginPath(); c.moveTo(-3000, -40); for (let x = -3000; x <= 3000; x += 250) c.lineTo(x, -140 - 90 * Math.abs(Math.sin(x * 0.0021 + 1))); c.lineTo(3000, -40); c.closePath(); c.fill();
  const off = (t * 520 * vel) % 900; for (let x = -2700; x < 2800; x += 900) { const px = x - off; c.fillStyle = '#141a2a'; c.fillRect(px - 9, -760, 18, 760); c.fillRect(px - 9, -760, 110, 14); P.glow(c, px + 100, -738, 90, '255,214,140', 0.25); c.fillStyle = '#ffe2a8'; c.beginPath(); c.ellipse(px + 100, -742, 22, 9, 0, 0, TAU); c.fill(); } };
 const carretera = (c, t, vel = 1, x0 = -3000, x1 = 3000) => { const g = c.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, '#1c2230'); g.addColorStop(1, '#0a0d14'); c.fillStyle = g; c.fillRect(x0, -40, x1 - x0, 1300); c.fillStyle = '#121725'; c.fillRect(x0, -40, x1 - x0, 40);
  c.fillStyle = 'rgba(143,216,255,0.25)'; c.fillRect(x0, 0, x1 - x0, 4); const off = (t * 900 * vel) % 300; c.fillStyle = 'rgba(245,247,250,0.8)'; for (let x = x0 - 300; x < x1 + 300; x += 300) { c.beginPath(); c.roundRect(x - off, 110, 160, 16, 6); c.fill(); }
  c.fillStyle = 'rgba(245,247,250,0.55)'; c.fillRect(x0, 300, x1 - x0, 12);
  const R = H.rng(91); c.lineWidth = 3; for (let i = 0; i < 90; i++) { const bx = x0 + R() * (x1 - x0), by = 30 + R() * 560, ph = (t * (1.3 + R()) + R()) % 1, xx = ((bx - off - x0) % (x1 - x0) + (x1 - x0)) % (x1 - x0) + x0;
   c.strokeStyle = `rgba(170,215,255,${0.55 * (1 - ph)})`; c.beginPath(); c.ellipse(xx, by, 8 + 34 * ph, 3 + 8 * ph, 0, 0, TAU); c.stroke(); } };
 const RU = [[-310, -85], [310, -85]];
 const CAM_DEL = [[0, -432], [140, -432], [185, -415], [305, -285], [420, -262], [410, -110], [330, -60], [310, 0]];
 const CAM_TRAS = [[0, -432], [-190, -432], [-235, -410], [-310, -272], [-420, -262], [-410, -110], [-330, -60], [-310, 0]];
 const largo = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
 const tramo = (c, pts, p, t, w = 14) => { if (p <= 0) return; const L = largo(pts) * cl(p), R = H.rng(Math.floor(t * 24)); let acc = 0; const out = [pts[0]];
  for (let i = 1; i < pts.length && acc < L; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], d = Math.hypot(bx - ax, by - ay), u = Math.min(1, (L - acc) / d), n = Math.max(2, Math.round(d * u / 40));
   for (let k = 1; k <= n; k++) { const q = (k / n) * u, j = k < n ? (R() - 0.5) * 14 : 0; out.push([lerp(ax, bx, q) + j, lerp(ay, by, q) + j]); } acc += d; }
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round'; c.shadowColor = YE; c.shadowBlur = 30; c.strokeStyle = 'rgba(255,210,63,0.6)'; c.lineWidth = w * 2.2; c.beginPath(); out.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
  c.shadowBlur = 12; c.strokeStyle = '#fff6c8'; c.lineWidth = w * 0.7; c.stroke(); const [hx, hy] = out[out.length - 1]; c.fillStyle = '#fff'; c.shadowBlur = 40; c.beginPath(); c.arc(hx, hy, w * 1.2, 0, TAU); c.fill(); c.restore(); };
 const rueda = (c, x, y, t, o = {}) => { const ang = (o.gira ?? 1) * t * 11, pin = o.pinchada || 0; c.save(); c.translate(x, y); c.scale(1 + pin * 0.14, 1 - pin * 0.3); c.translate(0, pin * 32);
  c.fillStyle = '#111317'; c.beginPath(); c.arc(0, 0, 85, 0, TAU); c.fill(); c.save(); c.rotate(ang); c.strokeStyle = '#23262c'; c.lineWidth = 6; for (let k = 0; k < 18; k++) { const a = k * TAU / 18; c.beginPath(); c.moveTo(Math.cos(a) * 74, Math.sin(a) * 74); c.lineTo(Math.cos(a) * 85, Math.sin(a) * 85); c.stroke(); } c.restore();
  c.strokeStyle = '#2b2f36'; c.lineWidth = 8; c.beginPath(); c.arc(0, 0, 66, 0, TAU); c.stroke();
  c.fillStyle = '#9aa3b2'; c.beginPath(); c.arc(0, 0, 46, 0, TAU); c.fill(); c.rotate(ang); c.strokeStyle = '#5c6575'; c.lineWidth = 9; for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(k * TAU / 5) * 42, Math.sin(k * TAU / 5) * 42); c.stroke(); }
  c.fillStyle = '#cfd8e3'; c.beginPath(); c.arc(0, 0, 12, 0, TAU); c.fill(); c.restore(); };
 const carroceria = (c) => { c.beginPath(); c.moveTo(-495, -115); c.lineTo(-500, -215); c.quadraticCurveTo(-495, -255, -440, -262); c.lineTo(-310, -272); c.lineTo(-235, -410); c.quadraticCurveTo(-220, -430, -190, -432); c.lineTo(140, -432); c.quadraticCurveTo(170, -430, 185, -415);
  c.lineTo(305, -285); c.lineTo(455, -262); c.quadraticCurveTo(500, -250, 505, -200); c.lineTo(505, -120); c.quadraticCurveTo(500, -100, 480, -100); c.lineTo(415, -100); c.arc(310, -85, 105, 0, Math.PI, true); c.lineTo(-205, -85); c.arc(-310, -85, 105, 0, Math.PI, true); c.lineTo(-480, -100); c.closePath(); };
 const cristal = (c) => { c.beginPath(); c.moveTo(-282, -286); c.lineTo(-220, -404); c.quadraticCurveTo(-208, -418, -188, -418); c.lineTo(135, -418); c.quadraticCurveTo(158, -416, 170, -404); c.lineTo(282, -288); c.closePath(); };
 // conductor visto de lado (dentro del cristal): o.miedo 0…1 (brazo arriba, ojo y boca abiertos), o.calma 0…1 (sonrisa)
 const conductorLado = (c, t, o = {}) => { const fl = o.fl || 0, m = o.miedo || 0, dx = -14 * m; c.save(); c.fillStyle = '#1d2433'; c.beginPath(); c.roundRect(40, -330, 150, 60, 30); c.fill();
  c.fillStyle = '#2d3b5a'; c.beginPath(); c.roundRect(60 + dx, -345, 120, 70, [30, 30, 8, 8]); c.fill();
  c.fillStyle = H.rgba(H.mix('#c98f68', '#f1c7a5', fl)); c.beginPath(); c.arc(120 + dx, -378, 34, 0, TAU); c.fill(); c.fillStyle = '#2a1d16'; c.beginPath(); c.arc(116 + dx, -390, 33, Math.PI * 0.95, Math.PI * 2.05); c.fill();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(140 + dx, -380, 5 + 5 * m, 0, TAU); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(141 + dx, -380, 2.5, 0, TAU); c.fill();
  if (m > 0.3) { c.fillStyle = '#3a1410'; c.beginPath(); c.ellipse(146 + dx, -362, 5, 8 * m, 0, 0, TAU); c.fill(); } else if ((o.calma || 0) > 0.3) { c.strokeStyle = '#3a1410'; c.lineWidth = 3; c.beginPath(); c.arc(140, -366, 7, 0.2, Math.PI - 0.2); c.stroke(); }
  c.strokeStyle = '#2d3b5a'; c.lineWidth = 18; c.lineCap = 'round'; c.beginPath(); c.moveTo(165 + dx, -330); if (m > 0.3) { c.lineTo(190, -380); c.lineTo(205, -415); } else c.lineTo(222, -322); c.stroke();
  c.strokeStyle = '#3a4152'; c.lineWidth = 10; c.beginPath(); c.ellipse(232, -330, 12, 34, -0.3, 0, TAU); c.stroke(); c.restore(); };
 const carro = (c, t, o = {}) => { const fl = o.fl || 0; c.save();
  c.save(); c.translate(0, 6); c.scale(1, -0.55); c.globalAlpha *= 0.16 + 0.2 * fl; c.fillStyle = '#4f7fd8'; carroceria(c); c.fill(); c.restore();   // reflejo en el asfalto mojado
  c.fillStyle = 'rgba(0,0,0,0.45)'; c.beginPath(); c.ellipse(0, 4, 540, 22, 0, 0, TAU); c.fill();
  if (o.faros !== false) { const g = c.createLinearGradient(505, 0, 1300, 0); g.addColorStop(0, 'rgba(255,236,170,0.45)'); g.addColorStop(1, 'rgba(255,236,170,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(500, -210); c.lineTo(1400, -330); c.lineTo(1400, 10); c.closePath(); c.fill(); }
  const cb = c.createLinearGradient(0, -432, 0, -100); cb.addColorStop(0, H.rgba(H.mix('#4f7fd8', '#a9c4ff', fl * 0.6))); cb.addColorStop(1, H.rgba(H.mix('#22427f', '#5a7cc0', fl * 0.6))); c.fillStyle = cb; carroceria(c); c.fill();
  if (o.lona) { c.save(); carroceria(c); c.clip(); c.fillStyle = '#d9c9a0'; c.fillRect(-330, -450, 660, 172); c.strokeStyle = 'rgba(80,60,30,0.55)'; c.setLineDash([12, 10]); c.lineWidth = 4; for (const x of [-150, 0, 150]) { c.beginPath(); c.moveTo(x, -440); c.lineTo(x, -290); c.stroke(); } c.setLineDash([]); c.restore(); }
  c.save(); cristal(c); c.clip(); c.fillStyle = H.rgba(H.mix('#0c1626', '#3b5277', fl)); c.fillRect(-300, -430, 600, 160); if (o.seguro > 0) P.glow(c, 120, -360, 260, '34,210,122', 0.5 * o.seguro);
  if (o.conductor !== false) conductorLado(c, t, { fl, miedo: o.miedo, calma: o.calma });
  c.fillStyle = `rgba(160,200,255,${0.18 + 0.1 * fl})`; c.beginPath(); c.moveTo(-120, -420); c.lineTo(-60, -420); c.lineTo(-170, -290); c.lineTo(-230, -290); c.closePath(); c.fill(); c.beginPath(); c.moveTo(60, -420); c.lineTo(90, -420); c.lineTo(-20, -290); c.lineTo(-50, -290); c.closePath(); c.fill();
  // gotas que golpean el vidrio lateral
  const Rg = H.rng(19); c.fillStyle = 'rgba(190,225,255,0.55)'; for (let i = 0; i < 22; i++) { const gx = -280 + Rg() * 560, gy = -420 + ((Rg() * 140 + t * (40 + Rg() * 50)) % 140); c.beginPath(); c.ellipse(gx - (t * 60) % 20, gy, 3, 5, 0, 0, TAU); c.fill(); }
  if (o.grieta > 0) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = 3; const R = H.rng(41), cx = -240, cy = -345, g0 = cl(o.grieta); for (let k = 0; k < 14; k++) { const a = R() * TAU; let x = cx, y = cy; c.beginPath(); c.moveTo(x, y); const n = Math.ceil(6 * g0); for (let s = 0; s < n; s++) { x += Math.cos(a + (R() - 0.5) * 0.9) * 16; y += Math.sin(a + (R() - 0.5) * 0.9) * 16; c.lineTo(x, y); } c.stroke(); }
   for (let r = 1; r <= 3; r++) { if (g0 > r / 4) { c.beginPath(); c.arc(cx, cy, r * 26, 0, TAU); c.stroke(); } } c.fillStyle = 'rgba(255,255,255,0.9)'; c.beginPath(); c.arc(cx, cy, 7, 0, TAU); c.fill(); c.restore(); }
  c.restore();
  c.fillStyle = H.rgba(H.mix('#22427f', '#6d8fd0', fl * 0.5)); c.fillRect(8, -420, 26, 134);
  c.strokeStyle = 'rgba(10,20,40,0.6)'; c.lineWidth = 4; c.beginPath(); c.moveTo(21, -286); c.lineTo(21, -110); c.moveTo(282, -288); c.lineTo(300, -110); c.moveTo(-282, -286); c.lineTo(-290, -110); c.stroke();
  c.fillStyle = '#cfd8e3'; c.beginPath(); c.roundRect(-150, -252, 60, 14, 7); c.fill(); c.beginPath(); c.roundRect(170, -252, 60, 14, 7); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.28)'; c.lineWidth = 5; c.beginPath(); c.moveTo(-300, -268); c.lineTo(450, -256); c.stroke();
  c.fillStyle = o.faros === false ? '#555' : '#fff0b0'; c.beginPath(); c.roundRect(478, -222, 30, 30, 8); c.fill(); c.fillStyle = '#ff3b4e'; c.beginPath(); c.roundRect(-505, -232, 22, 40, 6); c.fill();
  // salpicaduras de lluvia en el techo
  { const Rs = H.rng(23); c.strokeStyle = 'rgba(190,225,255,0.6)'; c.lineWidth = 3; for (let i = 0; i < 12; i++) { const sx = -200 + Rs() * 340, ph = (t * (1.5 + Rs()) + Rs()) % 1; c.globalAlpha = 1 - ph; c.beginPath(); c.arc(sx, -434, 4 + 16 * ph, Math.PI, 0); c.stroke(); } c.globalAlpha = 1; }
  if (o.jaula > 0) { c.save(); c.globalAlpha *= o.jaula; c.strokeStyle = CY; c.lineWidth = 7; c.shadowColor = CY; c.shadowBlur = 18; carroceria(c); c.stroke(); c.lineWidth = 5; c.beginPath(); for (let x = -420; x <= 440; x += 86) { c.moveTo(x, -110); c.lineTo(x, x > -235 && x < 185 ? -430 : x <= -235 ? lerp(-262, -430, cl((x + 310) / 75)) : lerp(-430, -262, cl((x - 185) / 120))); } for (const y of [-160, -220, -270]) { c.moveTo(-495, y); c.lineTo(505, y); } c.stroke(); c.restore(); }
  RU.forEach(([x, y], i) => rueda(c, x, y, t, { gira: o.gira ?? 1, pinchada: i === 0 ? (o.pinchada || 0) : 0 }));
  if (o.corriente > 0) { const p = o.corriente; tramo(c, CAM_DEL, p, t); tramo(c, CAM_TRAS, p, t);
   if (p >= 0.98) { const d = (t * 1.6) % 1; for (const [x] of RU) for (const q of [d, (d + 0.5) % 1]) { c.strokeStyle = `rgba(255,210,63,${0.8 * (1 - q)})`; c.lineWidth = 6; c.beginPath(); c.ellipse(x, 6, 40 + 260 * q, 10 + 40 * q, 0, 0, TAU); c.stroke(); } } }
  c.restore(); };
 // escena lateral completa: cielo, fondo que pasa, carretera, carro y lo que añada o.extra(g) (en coordenadas del mundo)
 const lado = (ctx, t, cam, o = {}) => { const fl = o.fl || 0, vel = o.vel ?? 1; cielo(ctx, t, fl); ctx.save(); vista(ctx, cam, o.sh || [0, 0], o.sy); fondoLejano(ctx, t, vel); carretera(ctx, t, vel);
  carro(ctx, t, Object.assign({ gira: vel }, o.carro || {})); if (o.extra) o.extra(ctx); ctx.restore(); lluvia(ctx, t, 1, fl, 0.18 + 0.12 * vel); };

 // ---------- mundo CABINA (por dentro, 1000 × 1100; el conductor de perfil mirando a la derecha) ----------
 const VENT = [[40, 170], [470, 130], [470, 560], [40, 600]], PARA = [[560, 110], [1000, 60], [1000, 600], [560, 600]];
 const poli = (c, P0) => { c.beginPath(); P0.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
 const exterior = (c, t, fl, x0, y0, w, h, vel) => { const g = c.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, H.rgba(H.mix('#0b1330', '#6b80b8', fl))); g.addColorStop(1, H.rgba(H.mix('#05070f', '#2a3550', fl))); c.fillStyle = g; c.fillRect(x0, y0, w, h);
  const off = (t * 700 * vel) % 500; for (let x = x0 - 500; x < x0 + w + 500; x += 500) { const px = x + off; c.fillStyle = '#1a2033'; c.fillRect(px, y0 + h * 0.35, 12, h); P.glow(c, px, y0 + h * 0.35, 70, '255,214,140', 0.3); } };
 const gotas = (c, t, x0, y0, w, h, seed, n = 30) => { if (h <= 0) return; const R = H.rng(seed); for (let i = 0; i < n; i++) { const bx = x0 + R() * w, by = y0 + R() * h, sp = 30 + R() * 60, ph = (t * 0.25 + R()) % 1, y = y0 + ((by - y0 + t * sp) % h), x = bx; c.globalAlpha = 0.85 * Math.min(1, ph * 6) * (1 - ph * 0.3);
   c.fillStyle = 'rgba(190,225,255,0.5)'; c.beginPath(); c.ellipse(x, y, 5 + R() * 4, 7 + R() * 6, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(x - 2, y - 3, 1.8, 0, TAU); c.fill(); } c.globalAlpha = 1; };
 const MARCO = [[[500, 14], [986, 14], [986, 1086], [500, 1086]], [[500, 14], [14, 14], [14, 1086], [500, 1086]], [[515, 118], [515, 600]]];
 const cabina = (c, t, o = {}) => { const fl = o.fl || 0, vel = o.vel ?? 1, m = o.miedo || 0, ca = o.calma || 0;
  // ventanas con el exterior (tormenta), lluvia golpeando el cristal
  c.save(); poli(c, VENT); c.clip(); exterior(c, t, fl, 0, 120, 480, 500, vel); const vh = o.ventana ?? 1; gotas(c, t, 40, 560 - 430 * vh, 430, 430 * vh, 7, 26);
  c.fillStyle = 'rgba(160,200,255,0.12)'; c.fillRect(40, 560 - 430 * vh, 440, 430 * vh); if (vh < 1) { c.strokeStyle = 'rgba(220,235,255,0.9)'; c.lineWidth = 6; c.beginPath(); c.moveTo(40, 560 - 430 * vh); c.lineTo(470, 560 - 430 * vh); c.stroke(); } c.restore();
  c.save(); poli(c, PARA); c.clip(); exterior(c, t, fl, 560, 60, 440, 540, vel); gotas(c, t, 560, 60, 440, 540, 12, 34);
  const ang = -1.9 + 0.68 * Math.sin(t * 3.4), pvx = 800, pvy = 640; c.strokeStyle = '#0b0d12'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(pvx, pvy); c.lineTo(pvx + Math.cos(ang) * 470, pvy + Math.sin(ang) * 470); c.stroke(); c.lineWidth = 7; c.strokeStyle = '#2b2f36'; c.beginPath(); c.moveTo(pvx + Math.cos(ang) * 150, pvy + Math.sin(ang) * 150); c.lineTo(pvx + Math.cos(ang) * 470, pvy + Math.sin(ang) * 470); c.stroke(); c.restore();
  // estructura de metal: techo, pilar, puerta y tablero
  c.fillStyle = '#2a2f3a'; c.fillRect(0, 0, 1000, 120); c.fillStyle = '#353b48'; c.beginPath(); c.moveTo(470, 125); c.lineTo(560, 108); c.lineTo(560, 600); c.lineTo(470, 565); c.closePath(); c.fill();
  c.fillStyle = '#20242d'; c.beginPath(); c.moveTo(0, 600); c.lineTo(40, 600); c.lineTo(470, 560); c.lineTo(560, 600); c.lineTo(560, 1100); c.lineTo(0, 1100); c.closePath(); c.fill(); c.fillRect(0, 0, 40, 1100);
  c.fillStyle = '#cfd8e3'; c.beginPath(); c.roundRect(200, 760, 110, 26, 13); c.fill();   // manija interior (metal)
  c.fillStyle = '#2b303b'; c.beginPath(); c.roundRect(60, 690, 440, 40, 18); c.fill(); c.strokeStyle = '#3a404d'; c.lineWidth = 4; c.stroke();   // apoyabrazos
  c.fillStyle = '#16191f'; c.beginPath(); c.arc(170, 940, 90, 0, TAU); c.fill(); c.strokeStyle = '#3a404d'; c.lineWidth = 5; c.beginPath(); c.arc(170, 940, 90, 0, TAU); c.stroke(); c.lineWidth = 3; for (let k = -70; k <= 70; k += 18) { c.beginPath(); c.moveTo(170 + k, 940 - Math.sqrt(8100 - k * k) * 0.8); c.lineTo(170 + k, 940 + Math.sqrt(8100 - k * k) * 0.8); c.stroke(); }   // altavoz
  c.strokeStyle = '#2f3542'; c.lineWidth = 4; c.beginPath(); c.moveTo(20, 640); c.lineTo(540, 640); c.moveTo(20, 1040); c.lineTo(540, 1040); c.stroke();
  c.fillStyle = '#1a1d24'; c.beginPath(); c.roundRect(540, 600, 470, 230, [30, 0, 0, 0]); c.fill(); c.fillStyle = '#262a33'; c.fillRect(540, 600, 470, 18);
  const parp = (o.chispas ? (Math.sin(t * 31) > 0 ? 1 : 0.25) : 1); c.save(); c.globalAlpha *= parp; for (const gx of [660, 760]) { c.strokeStyle = '#8fd8ff'; c.lineWidth = 5; c.beginPath(); c.arc(gx, 690, 38, Math.PI * 0.8, Math.PI * 2.2); c.stroke(); } c.restore();
  c.fillStyle = o.chispas ? (Math.sin(t * 40) > 0 ? '#e9f2ff' : '#0b0d12') : '#0d2238'; c.beginPath(); c.roundRect(830, 650, 150, 100, 12); c.fill(); if (!o.chispas) { c.fillStyle = '#3ea8ff'; c.fillRect(848, 668, 70, 10); c.fillRect(848, 690, 110, 8); }
  if (o.celular) { c.fillStyle = '#11141a'; c.beginPath(); c.roundRect(870, 540, 60, 110, 10); c.fill(); c.fillStyle = '#24476e'; c.fillRect(876, 548, 48, 92); c.strokeStyle = '#d0d4dc'; c.lineWidth = 6; c.beginPath(); c.moveTo(900, 650); c.bezierCurveTo(900, 760, 980, 760, 990, 820); c.stroke(); }
  // conductor de perfil (dibujo propio): o.miedo / o.calma
  const dx = -40 * m; if (o.seguro > 0) P.glow(c, 360, 640, 380, '34,210,122', 0.45 * o.seguro);
  c.fillStyle = '#151922'; c.beginPath(); c.roundRect(70, 420, 190, 680, 60); c.fill();   // asiento
  c.fillStyle = '#2d3b5a'; c.beginPath(); c.moveTo(150 + dx, 1100); c.lineTo(170 + dx, 640); c.quadraticCurveTo(260 + dx, 570, 380 + dx, 610); c.lineTo(450 + dx, 1100); c.closePath(); c.fill();
  c.strokeStyle = '#11141b'; c.lineWidth = 22; c.beginPath(); c.moveTo(370 + dx, 620); c.lineTo(230 + dx, 1100); c.stroke();   // cinturón
  c.strokeStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 4; c.beginPath(); c.moveTo(300 + dx, 640); c.lineTo(330 + dx, 1100); c.moveTo(200 + dx, 820); c.lineTo(420 + dx, 840); c.stroke();   // costuras de la chaqueta
  c.fillStyle = '#d29a74'; c.fillRect(320 + dx, 540, 60, 80);   // cuello
  const hx = 360 + dx, hy = 470 - 10 * m; c.fillStyle = '#d99a72'; c.beginPath(); c.ellipse(hx, hy, 92, 104, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(hx + 82, hy - 10); c.lineTo(hx + 112, hy + 22); c.lineTo(hx + 84, hy + 30); c.closePath(); c.fill();   // cabeza y nariz
  c.fillStyle = '#2a1d16'; c.beginPath(); c.ellipse(hx - 14, hy - 44, 98, 70, -0.15, Math.PI * 0.92, Math.PI * 2.02); c.fill(); c.beginPath(); c.ellipse(hx - 62, hy - 6, 40, 70, 0, 0, TAU); c.fill();
  c.fillStyle = '#c2805e'; c.beginPath(); c.ellipse(hx - 30, hy + 4, 18, 26, 0, 0, TAU); c.fill();   // oreja
  if (m > 0.35) { c.fillStyle = '#fff'; c.beginPath(); c.arc(hx + 52, hy - 8, 20, 0, TAU); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(hx + 58, hy - 8, 5, 0, TAU); c.fill(); c.strokeStyle = '#2a1d16'; c.lineWidth = 6; c.beginPath(); c.moveTo(hx + 34, hy - 40); c.lineTo(hx + 72, hy - 46); c.stroke();
   c.fillStyle = '#3a1410'; c.beginPath(); c.ellipse(hx + 74, hy + 54, 13, 20 * m, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(150,210,255,0.9)'; c.beginPath(); c.ellipse(hx - 4, hy - 70, 8, 13, 0, 0, TAU); c.fill(); }
  else { c.strokeStyle = '#2a1d16'; c.lineWidth = 6; c.lineCap = 'round'; if (ca > 0.3) { c.beginPath(); c.arc(hx + 52, hy - 4, 12, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); c.beginPath(); c.arc(hx + 64, hy + 44, 18, 0.25, Math.PI * 0.75); c.stroke(); }
   else { c.fillStyle = '#111'; c.beginPath(); c.arc(hx + 54, hy - 8, 7, 0, TAU); c.fill(); c.beginPath(); c.moveTo(hx + 60, hy + 54); c.lineTo(hx + 82, hy + 52); c.stroke(); } }
  // volante y brazos (las manos son parte de la ilustración del conductor)
  c.strokeStyle = '#0d0f14'; c.lineWidth = 26; c.beginPath(); c.ellipse(640, 760, 60, 190, 0, 0, TAU); c.stroke(); c.lineWidth = 30; c.beginPath(); c.moveTo(640, 760); c.lineTo(720, 830); c.stroke();
  const mano = (x, y) => { c.fillStyle = '#d99a72'; c.beginPath(); c.ellipse(x, y, 30, 26, 0, 0, TAU); c.fill(); };
  c.strokeStyle = '#2d3b5a'; c.lineWidth = 56; c.lineCap = 'round'; if (m > 0.35) { c.beginPath(); c.moveTo(340 + dx, 700); c.lineTo(420 + dx, 560); c.stroke(); mano(440 + dx, 520); } else { c.beginPath(); c.moveTo(340, 700); c.lineTo(600, 640); c.stroke(); mano(626, 636); c.beginPath(); c.moveTo(330, 760); c.lineTo(600, 860); c.stroke(); mano(628, 868); }
  // la corriente rodea la cabina POR FUERA (el marco de metal)
  if (o.corriente > 0) { for (const pth of MARCO.slice(0, 2)) tramo(c, pth, o.corriente, t, 16); tramo(c, MARCO[2], o.corriente, t, 12); }
  if (o.chispas) { chispasLoop(c, 905, 700, t, o.chispas, 20, 220, 0.4); chispasLoop(c, 700, 690, t, o.chispas + 0.2, 12, 160, 0.5); }
 };
 const dentro = (ctx, t, cam, o = {}) => { ctx.fillStyle = '#0a0c11'; ctx.fillRect(-60, -60, W + 120, HH + 120); ctx.save(); vista(ctx, cam, o.sh || [0, 0], o.sy); cabina(ctx, t, o); if (o.extra) o.extra(ctx); ctx.restore(); };

 // ---------- mundo CENITAL (carro visto desde arriba, avanza hacia arriba) ----------
 const cenital = (ctx, t, cam, o = {}) => { const fl = o.fl || 0, vel = o.vel ?? 1; ctx.fillStyle = '#0b0e16'; ctx.fillRect(-60, -60, W + 120, HH + 120); ctx.save(); vista(ctx, cam, o.sh || [0, 0]);
  const g = ctx; g.fillStyle = H.rgba(H.mix('#1c2230', '#4a5878', fl)); g.fillRect(-700, -2400, 1400, 4800); g.fillStyle = H.rgba(H.mix('#0f1a12', '#2d4a35', fl)); g.fillRect(-2400, -2400, 1700, 4800); g.fillRect(700, -2400, 1700, 4800);
  g.fillStyle = 'rgba(245,247,250,0.6)'; g.fillRect(-690, -2400, 14, 4800); g.fillRect(676, -2400, 14, 4800); const off = (t * 1100 * vel) % 400; g.fillStyle = 'rgba(245,247,250,0.85)'; for (let y = -2400; y < 2400; y += 400) { g.beginPath(); g.roundRect(-8, y + off, 16, 200, 6); g.fill(); }
  const R = H.rng(57); g.lineWidth = 3; for (let i = 0; i < 80; i++) { const x = -680 + R() * 1360, y0 = -1400 + R() * 2800, ph = (t * (1.6 + R()) + R()) % 1, y = ((y0 + off + 1400) % 2800) - 1400; g.strokeStyle = `rgba(170,215,255,${0.6 * (1 - ph)})`; g.beginPath(); g.arc(x, y, 6 + 26 * ph, 0, TAU); g.stroke(); }
  g.fillStyle = 'rgba(0,0,0,0.45)'; g.beginPath(); g.roundRect(-215, -440, 450, 910, 120); g.fill();
  g.fillStyle = '#111317'; for (const [x, y] of [[-215, -300], [175, -300], [-215, 170], [175, 170]]) { g.beginPath(); g.roundRect(x, y, 40, 140, 10); g.fill(); }
  const beams = g.createLinearGradient(0, -450, 0, -1300); beams.addColorStop(0, 'rgba(255,236,170,0.4)'); beams.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = beams; g.beginPath(); g.moveTo(-170, -440); g.lineTo(-420, -1400); g.lineTo(420, -1400); g.lineTo(170, -440); g.closePath(); g.fill();
  g.fillStyle = H.rgba(H.mix('#2f5fb8', '#9db8f0', fl * 0.6)); g.beginPath(); g.roundRect(-200, -450, 400, 900, 120); g.fill();
  g.fillStyle = '#0c1626'; g.beginPath(); g.moveTo(-160, -170); g.lineTo(160, -170); g.lineTo(140, -60); g.lineTo(-140, -60); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-140, 260); g.lineTo(140, 260); g.lineTo(160, 340); g.lineTo(-160, 340); g.closePath(); g.fill();
  g.fillStyle = H.rgba(H.mix('#3d72d0', '#b5cbf5', fl * 0.6)); g.beginPath(); g.roundRect(-150, -60, 300, 320, 30); g.fill(); g.fillStyle = '#fff0b0'; g.fillRect(-170, -455, 60, 16); g.fillRect(110, -455, 60, 16); g.fillStyle = '#ff3b4e'; g.fillRect(-170, 440, 60, 14); g.fillRect(110, 440, 60, 14);
  g.fillStyle = '#22427f'; g.fillRect(-235, -130, 40, 26); g.fillRect(195, -130, 40, 26);
  if (o.corriente > 0) { const p = o.corriente, c0 = [0, 100]; for (const pth of [[c0, [-150, -60], [-200, -300], [-215, -230]], [c0, [150, -60], [200, -300], [215, -230]], [c0, [-150, 260], [-200, 380], [-215, 240]], [c0, [150, 260], [200, 380], [215, 240]]]) tramo(g, pth, p, t, 14);
   if (p > 0.98) { const d = (t * 1.6) % 1; for (const [x, y] of [[-195, -230], [195, -230], [-195, 240], [195, 240]]) { g.strokeStyle = `rgba(255,210,63,${0.8 * (1 - d)})`; g.lineWidth = 6; g.beginPath(); g.arc(x, y, 40 + 160 * d, 0, TAU); g.stroke(); } } }
  if (o.golpe != null && t >= o.golpe && t < o.golpe + 0.9) { const d = t - o.golpe, a = 1 - d / 0.9; g.save(); g.globalAlpha = a; P.glow(g, 0, 100, 420, '200,230,255', 1); g.strokeStyle = '#fff'; g.lineWidth = 10; g.shadowColor = '#9fd0ff'; g.shadowBlur = 30; const R2 = H.rng(5); for (let k = 0; k < 9; k++) { const an = R2() * TAU; let x = 0, y = 100; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 5; s++) { x += Math.cos(an + (R2() - 0.5)) * 60; y += Math.sin(an + (R2() - 0.5)) * 60; g.lineTo(x, y); } g.stroke(); } g.restore(); chispas(g, 0, 100, t, o.golpe, 24, 300); }
  ctx.restore(); lluvia(ctx, t, 0.7, fl, 0.05); };

 // ---------- paraguas y persona (dibujo propio) ----------
 const persona = (c, x, y, s) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(0,0,0,0.4)'; c.beginPath(); c.ellipse(0, 0, 120, 16, 0, 0, TAU); c.fill();
  c.fillStyle = '#1b2233'; c.beginPath(); c.roundRect(-52, -260, 44, 260, 14); c.fill(); c.beginPath(); c.roundRect(8, -260, 44, 260, 14); c.fill();
  c.fillStyle = '#c0533e'; c.beginPath(); c.moveTo(-78, -250); c.lineTo(-62, -520); c.quadraticCurveTo(0, -560, 62, -520); c.lineTo(78, -250); c.closePath(); c.fill();
  c.fillStyle = '#d99a72'; c.beginPath(); c.arc(0, -600, 58, 0, TAU); c.fill(); c.fillStyle = '#2a1d16'; c.beginPath(); c.arc(-4, -616, 58, Math.PI * 0.95, Math.PI * 2.05); c.fill();
  c.strokeStyle = '#c0533e'; c.lineWidth = 36; c.lineCap = 'round'; c.beginPath(); c.moveTo(40, -500); c.lineTo(95, -420); c.lineTo(110, -470); c.stroke(); c.fillStyle = '#d99a72'; c.beginPath(); c.arc(112, -478, 24, 0, TAU); c.fill(); c.restore(); };
 const paraguas = (c, x, y, s, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); const top = -520, r = 330;
  c.strokeStyle = o.mango ? RD : '#3a3f4a'; c.lineWidth = o.mango ? 16 : 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, top + 20); c.lineTo(0, 10); c.arc(-28, 10, 28, 0, Math.PI); c.stroke();
  if (o.mango) P.glow(c, 0, -30, 120, '255,77,94', 0.5);
  const tl = o.tela ?? 1; c.strokeStyle = '#9aa3b2'; c.lineWidth = 7; for (let k = 0; k <= 6; k++) { const a = Math.PI + k * Math.PI / 6; c.beginPath(); c.moveTo(0, top); c.quadraticCurveTo(Math.cos(a) * r * 0.6, top + Math.sin(a) * 150 - 40, Math.cos(a) * r, top + 150 + (k % 6 === 0 ? 0 : -20)); c.stroke(); }
  if (tl > 0) { c.save(); c.globalAlpha *= tl; c.fillStyle = o.telaOk ? '#2fbf74' : '#2b6fd6'; c.beginPath(); c.moveTo(-r, top + 150); for (let k = 0; k < 6; k++) { const xa = -r + k * (2 * r / 6), xb = xa + 2 * r / 6; c.quadraticCurveTo((xa + xb) / 2, top + 110, xb, top + 150); } c.bezierCurveTo(r * 0.9, top - 60, r * 0.4, top - 150, 0, top - 150); c.bezierCurveTo(-r * 0.4, top - 150, -r * 0.9, top - 60, -r, top + 150); c.closePath(); c.fill();
   if (o.telaOk) { c.shadowColor = GR; c.shadowBlur = 30; c.strokeStyle = '#bfffd9'; c.lineWidth = 6; c.stroke(); } c.restore(); }
  c.fillStyle = '#3a3f4a'; c.beginPath(); c.arc(0, top - 150, 12, 0, TAU); c.fill();
  if (o.agua > 0) { const R = H.rng(5); c.fillStyle = `rgba(170,215,255,${0.9 * o.agua})`; for (let i = 0; i < 30; i++) { const sd = R() < 0.5 ? -1 : 1, ph = (t * 0.7 + R()) % 1, ys = o.suelo ?? 600; let px, py;
    if (ph < 0.5) { const u = ph / 0.5; px = sd * lerp(30, r * 1.02, u); py = top - 150 + 300 * u * u; } else { const u = (ph - 0.5) / 0.5; px = sd * r * 1.04; py = lerp(top + 160, ys, u * u); }
    c.beginPath(); c.ellipse(px, py, 11, 17, 0, 0, TAU); c.fill(); } }
  c.restore(); };
 const calle = (ctx, t, cam, fn) => { cielo(ctx, t, 0); ctx.save(); vista(ctx, cam); ctx.fillStyle = '#1c2230'; ctx.fillRect(-3000, 0, 6000, 2000); ctx.fillStyle = 'rgba(143,216,255,0.25)'; ctx.fillRect(-3000, 0, 6000, 4);
  const R = H.rng(93); ctx.lineWidth = 3; for (let i = 0; i < 60; i++) { const bx = -1500 + R() * 3000, by = 20 + R() * 900, ph = (t * (1.3 + R()) + R()) % 1; ctx.strokeStyle = `rgba(170,215,255,${0.5 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(bx, by, 8 + 34 * ph, 3 + 8 * ph, 0, 0, TAU); ctx.stroke(); }
  ctx.fillStyle = 'rgba(143,216,255,0.12)'; ctx.beginPath(); ctx.ellipse(40, 60, 420, 40, 0, 0, TAU); ctx.fill(); fn(ctx); ctx.restore(); lluvia(ctx, t, 1, 0); };

 // =====================================================================================================
 // ESCENAS (un plano por idea de la voz; entre mundos, transición de cámara —zoom o paneo—, nunca corte seco salvo el fotograma 0)
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO A: vas en el carro de noche… y un rayo cae justo encima → seguimiento lateral y zoom al techo ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  if (PORTADA) {   // portada: carro grande y abajo; el rayo cae desde la derecha, bajo el título
   tope(0); const cam = [0, -260, 1.02]; lado(ctx, t, cam, { fl: 0.3, vel: 1, sy: 1290, carro: { fl: 0.3, corriente: 1, miedo: 1 }, extra: (g) => { rayo(g, 29, 520, -880, 60, -432, 1, 13); chispas(g, 60, -440, 0.3, 0, 22, 200); } }); return; }
  const qB = P.pregunta(ctx, '¿QUÉ PASA SI TE CAE UN RAYO / DENTRO DEL CARRO?', t, 0, S(2) - 0.15, { capY: 330, px: 60, clave: 'RAYO', x: 540, dy: 110 }); tope(qB + 14);
  const golpes = [[T_CERCA, 0.6], [T_TECHO, 1.25]], fl = rel(t, [T_CERCA, T_TECHO]), sh = sacude(t, golpes);
  const cam = camK(t, [[0, 0, -230, 1.04], [1.2, 0, -235, 1.06], [1.75, 40, -380, 2.0], [S(2), 60, -390, 2.15]]);
  const cp = sm(T_TECHO, T_TECHO + 1.2, t), miedo = sm(T_TECHO + 0.05, T_TECHO + 0.25, t);
  lado(ctx, t, cam, { fl, vel: 1, sh, sy: 1080, carro: { fl, corriente: cp > 0 ? 0.25 + 0.75 * cp : 0, miedo },
   extra: (g) => { rayo(g, 3, 900, -1300, 1050, 0, t >= T_CERCA ? 1 - sm(T_CERCA + 0.15, T_CERCA + 0.45, t) : 0, 11); if (t >= T_TECHO) rayo(g, 7, -40, -1400, 20, -432, 1 - sm(T_TECHO + 0.3, T_TECHO + 0.8, t), 14); chispas(g, 20, -440, t, T_TECHO, 26, 260); } });
  fogonazo(ctx, t, golpes);
 }, sfx(k) { trueno(k, T_CERCA, 1.0); trueno(k, T_TECHO, 1.7); FX.chispa(k, T_TECHO, 0.9, 1.2); k.play('whoosh', 1.2, { dur: 0.6, top: 2400, gain: 0.3, minor: true }); } });

 // ---------- 2 · ¿Qué te pasa? Lo que ocurre te va a sorprender → DENTRO de la cabina, el conductor asustado ----------
 B.push({ t0: S(2), t1: S(4), in: { type: 'zoom', d: 0.45, x: 540, y: 820 }, draw(ctx, t) {
  tope(440); const fl = rel(t, [Tk.sorprender]), sh = sacude(t, [[Tk.sorprender, 0.4]]), cam = camK(t, [[S(2), 480, 450, 1.18], [S(4), 440, 450, 1.3]]);
  dentro(ctx, t, cam, { fl, sh, miedo: 1, corriente: 1, vel: 0.6,
   extra: (g) => { const q = sm(S(2) + 0.1, S(2) + 0.4, t); if (q > 0) { g.save(); g.globalAlpha *= q; txt(g, '?', 470 + Math.sin(t * 5) * 6, 300, 200 * E.out(q), YE, { w: 900, f: 'Fredoka' }); g.restore(); } } });
  fogonazo(ctx, t, [[Tk.sorprender, 0.5]]);
 }, sfx(k) { FX.aparece(k, S(2) + 0.15, 520); FX.lluvia(k, S(2), S(4) - S(2), 1.4); for (let x = S(2) + 0.3; x < S(4); x += 1.85) k.noise(x, { dur: 0.35, color: 'pink', filter: 'bandpass', f: 900, q: 2, gain: 0.05, a: 0.1 }); trueno(k, Tk.sorprender, 0.9); } });

 // ---------- 3 · paraguas: plano general → zoom al mango → paneo a la tela → se abre el plano y el agua cae al suelo ----------
 B.push({ t0: S(4), t1: S(8), in: { type: 'zoom', d: 0.45, x: 540, y: 960 }, draw(ctx, t) {
  tope(440); const mg = t >= Tk.mango - 0.3 && t < S(6) ? 1 : 0, ok = t >= Tk.tela - 0.2, ag = sm(Tk.agua - 0.4, Tk.agua, t) + (t < Tk.agua - 0.4 ? 0.5 : 0);
  const cam = camK(t, [[S(4), 40, -560, 0.84], [S(5) - 0.1, 40, -560, 0.86], [Tk.mango - 0.2, 70, -430, 1.85], [S(6) - 0.1, 70, -440, 1.9], [Tk.tela + 0.2, 92, -950, 1.35], [S(7), 92, -940, 1.38], [Tk.agua + 0.6, 50, -540, 0.86]]);
  calle(ctx, t, cam, (g) => { persona(g, -20, 0, 1); paraguas(g, 92, -478, 1, t, { mango: mg, telaOk: ok, agua: Math.min(1, ag), suelo: 478 });
   if (t > Tk.suelo0 - 0.3) { const d = (t * 1.4) % 1; for (const sx of [-250, 430]) { g.strokeStyle = `rgba(170,215,255,${0.8 * (1 - d)})`; g.lineWidth = 4; g.beginPath(); g.ellipse(sx, 4, 30 + 80 * d, 6 + 10 * d, 0, 0, TAU); g.stroke(); } } });
  if (mg) { const [x, y] = aPantalla(cam, 64, -440); P.icon(ctx, 'cruz', Math.min(880, x + 200), y, 150, { mode: 'flat', col: RD, col2: '#fff' }); }
  P.tag(ctx, 'MANGO', 470, 520, t, Tk.mango - 0.3, S(6), { mono: true, col: RD, px: 62 });
  P.tag(ctx, 'LA TELA', 470, 520, t, Tk.tela - 0.2, S(8), { mono: true, col: GR, px: 62 });
 }, sfx(k) { FX.lluvia(k, S(4), S(8) - S(4), 1.2); k.play('whoosh', Tk.mango - 0.6, { dur: 0.5, top: 1600, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.mango - 0.3); k.play('error', Tk.mango, { f: 'D3', gain: 0.2, minor: true }); k.play('whoosh', S(6), { dur: 0.6, top: 1600, gain: 0.25, minor: true }); FX.correcto(k, Tk.tela); FX.etiqueta(k, Tk.tela - 0.2); } });

 // ---------- 4 · tu carro hace lo mismo con el rayo → plano CENITAL: el rayo cae en el techo ----------
 B.push({ t0: S(8), t1: S(9), in: { type: 'zoom', d: 0.45, x: 540, y: 900 }, draw(ctx, t) {
  tope(440); const golpes = [[T_ARRIBA, 1.2]], fl = rel(t, [T_ARRIBA]), sh = sacude(t, golpes), cam = camK(t, [[S(8), 0, 160, 1.3], [S(9), 0, 80, 1.6]]);
  cenital(ctx, t, cam, { fl, sh, vel: 1, golpe: T_ARRIBA, corriente: sm(T_ARRIBA, T_ARRIBA + 1.0, t) });
  fogonazo(ctx, t, golpes);
 }, sfx(k) { k.play('riser', S(8) - 0.2, { dur: T_ARRIBA - S(8) + 0.2, gain: 0.25, minor: true }); trueno(k, T_ARRIBA, 1.7); FX.chispa(k, T_ARRIBA, 0.9, 1); } });

 // ---------- 5 · la corriente corre por la carrocería de metal → primer plano lateral del techo, paneo siguiendo la corriente ----------
 B.push({ t0: S(9), t1: S(10), in: { type: 'zoom', d: 0.4, x: 540, y: 900 }, draw(ctx, t) {
  tope(440); const p = 0.15 + 0.5 * E.out(win(t, S(9), S(10))), cam = camK(t, [[S(9), 200, -320, 1.75], [S(10), -160, -320, 1.7]]);
  lado(ctx, t, cam, { vel: 1, carro: { corriente: p, miedo: 0.6 } });
  P.tag(ctx, 'CARROCERÍA DE METAL', 470, 520, t, Tk.carroceria - 0.2, S(10), { mono: true, col: YE, px: 56 });
 }, sfx(k) { FX.chispa(k, S(9), S(10) - S(9), 0.7); FX.etiqueta(k, Tk.carroceria - 0.2); } });

 // ---------- 6 · por fuera, alrededor de ti… → DENTRO: el conductor tranquilo; la corriente rodea la cabina por fuera ----------
 B.push({ t0: S(10), t1: S(11), in: { type: 'zoom', d: 0.4, x: 540, y: 820 }, draw(ctx, t) {
  tope(440); const seg = sm(Tk.alrededor - 0.3, Tk.alrededor + 0.3, t), cam = camK(t, [[S(10), 480, 450, 1.18], [S(11), 440, 450, 1.28]]);
  dentro(ctx, t, cam, { corriente: 0.4 + 0.6 * E.out(win(t, S(10), Tk.alrededor + 0.4)), seguro: seg, calma: seg, miedo: seg > 0.5 ? 0 : 0.6, vel: 0.6 });
  P.tag(ctx, 'TÚ, A SALVO', 470, 520, t, Tk.alrededor - 0.2, S(11), { mono: true, col: GR, px: 60 });
 }, sfx(k) { FX.lluvia(k, S(10), S(11) - S(10), 1.3); FX.chispa(k, S(10), 1.2, 0.5); FX.correcto(k, Tk.alrededor); FX.etiqueta(k, Tk.alrededor - 0.2); } });

 // ---------- 7 · y baja al suelo pasando por las llantas → paneo de la carrocería a la llanta delantera ----------
 B.push({ t0: S(11), t1: S(12), in: { type: 'zoom', d: 0.4, x: 540, y: 900 }, draw(ctx, t) {
  tope(440); const p = t < Tk.baja ? 0.62 : 0.62 + 0.38 * E.inOut(win(t, Tk.baja, Tk.llantas0)), cam = camK(t, [[S(11), 120, -280, 1.35], [Tk.baja, 140, -260, 1.4], [Tk.llantas0 + 0.2, 300, -110, 2.5]]);
  lado(ctx, t, cam, { vel: 0.7, carro: { corriente: p, calma: 1 } });
  P.tag(ctx, 'AL SUELO', 470, 520, t, Tk.baja, S(12), { mono: true, col: YE, px: 62 });
 }, sfx(k) { FX.chispa(k, Tk.baja, 1.4, 0.6); k.play('whoosh', Tk.baja, { dur: 1.2, top: 1200, gain: 0.25, minor: true }); k.play('thud', Tk.llantas0, { f: 60, gain: 0.5 }); } });

 // ---------- 8 · la sorpresa: las llantas de caucho NO te salvan → primer plano de la llanta; el rayo la rodea; se abre a la JAULA ----------
 B.push({ t0: S(12), t1: S(16), in: { type: 'zoom', d: 0.4, x: 540, y: 1000 }, draw(ctx, t) {
  tope(440); const no = sm(Tk.salvan - 0.3, Tk.salvan, t) * (1 - sm(S(15) - 0.3, S(15), t)), arc = t >= T_LLANTA ? 1 - sm(Tk.detenga + 0.3, Tk.detenga + 0.8, t) : 0, p = sm(T_LLANTA, Tk.detenga, t);
  const golpes = [[T_LLANTA, 1.0]], fl = rel(t, [T_LLANTA]), sh = sacude(t, golpes), j = sm(Tk.metal - 0.3, Tk.jaula, t);
  const cam = camK(t, [[S(12), 260, -150, 1.6], [Tk.sorpresa + 0.3, 310, -130, 3.0], [S(15) - 0.2, 310, -130, 3.05], [Tk.metal + 0.4, 0, -320, 1.04]]);
  lado(ctx, t, cam, { fl, sh, vel: 0.6, carro: { fl, jaula: j, seguro: j, calma: 1, corriente: t > S(15) ? 1 : 0 },
   extra: (g) => { if (arc > 0) { rayo(g, 23, 280, -1300, 310, -275, arc, 14); tramo(g, [[310, -275], [205, -170], [215, -40], [300, 0]], p, t, 12); tramo(g, [[310, -275], [415, -170], [405, -40], [320, 0]], p, t, 12); }
    if (p >= 0.98 && arc > 0) { const d = (t * 1.6) % 1; g.strokeStyle = `rgba(255,210,63,${0.9 * (1 - d)})`; g.lineWidth = 6; g.beginPath(); g.ellipse(310, 6, 40 + 160 * d, 8 + 24 * d, 0, 0, TAU); g.stroke(); }
    if (no > 0) { g.save(); g.globalAlpha *= no; g.strokeStyle = RD; g.lineWidth = 16; g.lineCap = 'round'; const s = 75 * E.out(no); g.beginPath(); g.moveTo(310 - s, -85 - s); g.lineTo(310 + s, -85 + s); g.moveTo(310 + s, -85 - s); g.lineTo(310 - s, -85 + s); g.stroke(); g.restore(); } } });
  fogonazo(ctx, t, golpes);
  P.tag(ctx, 'LLANTAS DE CAUCHO', 470, 520, t, Tk.llantas - 0.2, T_LLANTA - 0.1, { mono: true, col: RD, px: 56 });
  P.tag(ctx, 'NO LO DETIENEN', 470, 520, t, T_LLANTA, S(15), { mono: true, col: RD, px: 58 });
  P.tag(ctx, 'JAULA DE METAL', 470, 520, t, Tk.metal - 0.2, S(16), { mono: true, col: CY, px: 60 });
 }, sfx(k) { k.play('riser', S(12) - 0.1, { dur: 0.9, gain: 0.3, minor: true }); FX.etiqueta(k, Tk.llantas - 0.2); k.play('error', Tk.salvan, { f: 'C3', gain: 0.3 }); trueno(k, T_LLANTA, 1.5); FX.chispa(k, T_LLANTA + 0.05, 1.2, 0.8); k.play('whoosh', S(15) - 0.2, { dur: 1, top: 1400, gain: 0.3, minor: true }); FX.revelar(k, Tk.metal - 0.3); FX.correcto(k, Tk.jaula); } });

 // ---------- 9 · un descapotable no sirve, ni con la capota puesta → paneo lateral a otro carro (lona) ----------
 B.push({ t0: S(16), t1: S(17), in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  tope(440); const no = sm(Tk.capota - 0.2, Tk.capota + 0.2, t), cam = camK(t, [[S(16), -120, -320, 1.04], [S(17), 60, -320, 1.14]]);
  lado(ctx, t, cam, { vel: 0.8, carro: { lona: true, miedo: 0.6 } });
  if (no > 0) { const [x, y] = aPantalla(cam, 0, -330); P.icon(ctx, 'cruz', x, y, 280 * E.out(no), { mode: 'flat', col: RD, col2: '#fff' }); }
  P.tag(ctx, 'DESCAPOTABLE', 470, 520, t, Tk.descapotable - 0.2, S(17), { mono: true, col: RD, px: 60 });
 }, sfx(k) { FX.etiqueta(k, Tk.descapotable - 0.2); k.play('error', Tk.capota + 0.1, { f: 'D3', gain: 0.3 }); } });

 // ---------- 10 · es un paraguas sin tela ----------
 B.push({ t0: S(17), t1: S(18), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  tope(440); const cam = camK(t, [[S(17), 60, -620, 1.05], [S(18), 50, -560, 0.92]]);
  calle(ctx, t, cam, (g) => { persona(g, -20, 0, 1); paraguas(g, 92, -478, 1, t, { tela: 0 }); const R2 = H.rng(61); g.fillStyle = 'rgba(170,215,255,0.9)'; for (let i = 0; i < 30; i++) { const px = -300 + R2() * 700, py = -1100 + ((R2() * 1100 + t * 900) % 1100); g.beginPath(); g.ellipse(px, py, 9, 15, 0, 0, TAU); g.fill(); } });
  P.tag(ctx, 'PARAGUAS SIN TELA', 470, 520, t, S(17), S(18), { mono: true, col: RD, px: 56 });
 }, sfx(k) { FX.etiqueta(k, S(17)); FX.lluvia(k, S(17), S(18) - S(17), 1.3); } });

 // ---------- 11 · eso sí, el carro puede salir dañado → plano general, humo ----------
 B.push({ t0: S(18), t1: Tk.quemar - 0.25, in: { type: 'zoom', d: 0.4, x: 540, y: 900 }, draw(ctx, t) {
  tope(440); const golpes = [[S(18) + 0.05, 0.8]], fl = rel(t, [S(18) + 0.05]), cam = camK(t, [[S(18), 0, -330, 1.04], [Tk.quemar, 60, -320, 1.2]]);
  lado(ctx, t, cam, { fl, sh: sacude(t, golpes), vel: 0.2, carro: { fl, miedo: 0.5, faros: Math.sin(t * 19) > 0 }, extra: (g) => { humo(g, 380, -280, t, S(18) + 0.2, 1); chispasLoop(g, 400, -270, t, S(18) + 0.1, 10, 120, 0.6); } });
  fogonazo(ctx, t, golpes);
  P.tag(ctx, 'DAÑOS', 470, 520, t, Tk.danado - 0.3, Tk.quemar - 0.25, { mono: true, col: YE, px: 62 });
 }, sfx(k) { trueno(k, S(18) + 0.05, 1.2); FX.chispa(k, S(18) + 0.1, 1.2, 0.6); FX.etiqueta(k, Tk.danado - 0.3); } });

 // ---------- 12 · quemar la electrónica → DENTRO, primer plano del tablero con chispas ----------
 B.push({ t0: Tk.quemar - 0.25, t1: Tk.reventar - 0.2, in: { type: 'zoom', d: 0.35, x: 540, y: 900 }, draw(ctx, t) {
  tope(440); const cam = camK(t, [[Tk.quemar - 0.25, 760, 680, 1.55], [Tk.reventar, 820, 690, 1.8]]);
  dentro(ctx, t, cam, { chispas: Tk.electronica - 0.25, vel: 0.2, sh: sacude(t, [[Tk.electronica - 0.2, 0.4]]) });
  P.tag(ctx, 'ELECTRÓNICA', 470, 520, t, Tk.electronica - 0.25, Tk.reventar - 0.2, { mono: true, col: YE, px: 62 });
 }, sfx(k) { FX.chispa(k, Tk.electronica - 0.25, 0.9, 1.3); k.play('error', Tk.electronica, { f: 'A2', gain: 0.25, minor: true }); FX.etiqueta(k, Tk.electronica - 0.25); } });

 // ---------- 13 · reventar una llanta → primer plano: revienta; paneo al vidrio de atrás que se raja ----------
 B.push({ t0: Tk.reventar - 0.2, t1: S(21), in: { type: 'zoom', d: 0.35, x: 540, y: 1000 }, draw(ctx, t) {
  tope(440); const tb = Tk.llanta - 0.1, pin = sm(tb, tb + 0.25, t), gr = sm(Tk.vidrio - 0.15, Tk.vidrio + 0.5, t), sh = sacude(t, [[tb, 0.9], [Tk.vidrio - 0.1, 0.5]]);
  const cam = camK(t, [[Tk.reventar - 0.2, -300, -110, 2.7], [Tk.romper - 0.1, -310, -110, 2.9], [Tk.vidrio - 0.15, -240, -340, 3.0], [S(21), -240, -340, 3.15]]);
  lado(ctx, t, cam, { sh, vel: 0.15, carro: { pinchada: pin, grieta: gr, gira: 0.15 }, extra: (g) => { trozos(g, -310, -40, t, tb); chispas(g, -310, -60, t, tb, 26, 260); humo(g, -310, -40, t, tb, 0.8); } });
  fogonazo(ctx, t, [[tb, 0.15]]);
  P.tag(ctx, 'LLANTA', 470, 520, t, Tk.llanta - 0.2, Tk.vidrio - 0.25, { mono: true, col: YE, px: 62 });
  P.tag(ctx, 'VIDRIO DE ATRÁS', 470, 520, t, Tk.vidrio - 0.15, S(21), { mono: true, col: YE, px: 60 });
 }, sfx(k) { const tb = Tk.llanta - 0.1; k.play('thud', tb, { f: 80, gain: 0.8 }); k.noise(tb, { dur: 0.9, color: 'pink', filter: 'highpass', f: 1200, gain: 0.25, a: 0.002 }); k.play('whoosh', Tk.romper - 0.1, { dur: 0.5, top: 1600, gain: 0.25, minor: true }); FX.rotura(k, Tk.vidrio - 0.1); FX.rotura(k, Tk.vidrio + 0.15); } });

 // ---------- 14 · ¿Qué hacer? → panel arriba; abajo, la cabina: tranquilo dentro, sube la ventana, no toques el metal ni el celular cargando ----------
 const CONSEJOS = [{ t: Tk.quedate, txt: 'Quédate dentro' }, { t: Tk.sube, txt: 'Sube las ventanas' }, { t: Tk.toques, txt: 'No toques el metal' }];
 const tQ = Tk.hacer - 0.25;
 B.push({ t0: S(21), t1: S(25), in: { type: 'zoom', d: 0.4, x: 540, y: 900 }, draw(ctx, t) {
  tope(440); const ven = t < Tk.sube ? 0.3 : 0.3 + 0.7 * E.inOut(win(t, Tk.sube, Tk.sube + 0.8)), no = sm(Tk.toques - 0.2, Tk.toques + 0.2, t), sy = 1250;
  const cam = camK(t, [[S(21), 420, 560, 0.95], [Tk.sube - 0.2, 400, 560, 0.98], [Tk.sube + 0.3, 270, 420, 1.0], [Tk.toques - 0.3, 270, 440, 1.0], [Tk.toques + 0.3, 560, 700, 0.9]]);
  ctx.fillStyle = '#0a0c11'; ctx.fillRect(0, 0, W, HH); ctx.save(); ctx.beginPath(); ctx.rect(0, 920, W, HH - 920); ctx.clip(); dentro(ctx, t, cam, { sy, calma: 1, seguro: sm(Tk.quedate - 0.2, Tk.quedate + 0.3, t), ventana: ven, celular: true, vel: 0 }); ctx.restore();
  if (no > 0) { for (const [wx, wy] of [[255, 773], [900, 595]]) { const [x, y] = aPantalla(cam, wx, wy, sy); if (y > 940) P.icon(ctx, 'cruz', Math.min(880, x), y, 130 * E.out(no), { mode: 'flat', col: RD, col2: '#fff' }); } }
  P.queHacer(ctx, t, tQ, CONSEJOS, { y: 520, px: 60 });
 }, sfx(k) { FX.queHacer(k, tQ, CONSEJOS); k.play('whoosh', Tk.sube, { dur: 0.8, top: 900, gain: 0.25 }); k.play('error', Tk.toques + 0.05, { f: 'D3', gain: 0.2, minor: true }); } });

 // ---------- 15 · CIERRE ----------
 B.push({ t0: S(25), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  tope(0); cielo(ctx, t, 0); lluvia(ctx, t, 0.6, 0);
  P.ctaShare(ctx, t, S(25) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { cielo(cc, t, 0.4); cc.save(); cc.translate(540, 1250); cc.scale(0.95, 0.95); carretera(cc, t, 1); carro(cc, t, { fl: 0.4, corriente: 1, calma: 1 }); rayo(cc, 7, -60, -1100, 0, -432, 1, 12); cc.restore(); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(25) + 0.1); FX.fin(k, T.end + 0.3); } });

 // trueno: chasquido seco + golpe grave + retumbo largo (g = fuerza)
 function trueno(k, t, g = 1) { k.noise(t - 0.01, { dur: 0.16, filter: 'highpass', f: 2200, gain: 0.4 * g, a: 0.001 }); k.play('thud', t, { f: 42, gain: 0.75 * g }); k.play('thud', t + 0.08, { f: 60, gain: 0.4 * g, minor: true }); k.noise(t + 0.04, { dur: 3.0, color: 'brown', filter: 'lowpass', f: [[0, 1400], [3.0, 80]], gain: 0.34 * g, a: 0.005 }); }

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'noche', capBorde: true, marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['rayo', 'encima.', 'sorprender.', 'paraguas', 'mango…', 'tela', 'suelo.', 'carrocería', 'metal,', 'alrededor', 'llantas.', 'sorpresa:', 'caucho', 'salvan.', 'fuerte', 'jaula.', 'descapotable', 'tela.', 'dañado:', 'electrónica,', 'llanta', 'vidrio', 'hacer?', 'dentro.', 'ventanas.', 'metal', 'amigo'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 1800, q: 0.6, gain: 0.02, a: 0.05, hold: DURATION - 2.5 }); k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 400, gain: 0.02, a: 0.05, hold: DURATION - 2.5 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 92, gain: 0.45, chords: [['D2', 'F2', 'A2', 'D3'], ['A#1', 'D2', 'F2', 'A#2'], ['G1', 'A#1', 'D2', 'G2'], ['A1', 'C#2', 'E2', 'A2']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
