// =====================================================================================================
// episodio.js — «¿Qué pasa si…?» Cap. 1 · ¿Qué pasa si te cae un rayo dentro del carro? · PLANTILLA ASOMBROTECA v1.37 · «noche»
// Serie: serie_que_pasa_si (P.pregunta fija + remate P.queHacer). UN solo vídeo con UN gancho (v1.34): el A.
// Voz: ElevenLabs Eleven v4, Dan, UNA toma (1.008 caracteres), 26 tramos, 61,9 s. Metáfora sostenida: el PARAGUAS (protege la
// tela de arriba, no el mango; el agua resbala por fuera y cae al suelo) = la carrocería de metal (no las llantas).
// Tormenta nocturna con relámpagos; carro, carretera y persona dibujados genéricos, sin marcas. Encuadre v1.34 (P.encuadrar).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, DURATION, txt } = K;
 const S = (i) => A.segments[i].s;
 const YE = '#ffd23f', RD = '#ff4d5e', GR = '#22d27a', CY = '#8fd8ff';
 const Tk = {
  rayo: wt(1, 'rayo'), encima: wt(1, 'encima.'), sorprender: wt(3, 'sorprender.'), paraguas: wt(4, 'paraguas'), mango: wt(5, 'mango…'), tela: wt(6, 'tela'), agua: wt(7, 'agua'), suelo0: wt(7, 'suelo.'),
  rayo2: wt(8, 'rayo.'), corriente: wt(9, 'corriente'), carroceria: wt(9, 'carrocería'), fuera: wt(10, 'fuera,'), alrededor: wt(10, 'alrededor'), baja: wt(11, 'baja'), llantas0: wt(11, 'llantas.'),
  sorpresa: wt(12, 'sorpresa:'), llantas: wt(13, 'llantas'), salvan: wt(13, 'salvan.'), fuerte: wt(14, 'fuerte'), detenga: wt(14, 'detenga.'), metal: wt(15, 'metal'), jaula: wt(15, 'jaula.'),
  descapotable: wt(16, 'descapotable'), capota: wt(16, 'capota'), sinTela: wt(17, 'tela.'), danado: wt(19, 'dañado:'), electronica: wt(20, 'electrónica,'), llanta: wt(20, 'llanta'), vidrio: wt(20, 'vidrio'),
  hacer: wt(21, 'hacer?'), quedate: wt(22, 'Quédate'), sube: wt(23, 'Sube'), toques: wt(24, 'toques'), celular: wt(24, 'celular'), envia: S(25),
 };
 const T_CERCA = 0.7, T_TECHO = 1.85;   // peligro en < 2 s: un rayo cae cerca a 0,7 s y otro en el techo a 1,85 s

 // ---------- cielo de tormenta, lluvia y relámpagos ----------
 const rel = (t, golpes) => { let f = 0; for (const g of golpes) { const d = t - g; if (d >= 0 && d < 1.2) f = Math.max(f, Math.exp(-d * 7) * (d < 0.12 ? (Math.sin(d * 140) > 0 ? 1 : 0.55) : 1)); } return f; };
 const cielo = (ctx, t, fl = 0) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, H.rgba(H.mix('#05070f', '#3a4c78', fl))); g.addColorStop(0.55, H.rgba(H.mix('#0d1530', '#55689a', fl))); g.addColorStop(1, '#070a14'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const R = H.rng(31); for (let i = 0; i < 9; i++) { const x = ((R() * 1500 + t * (8 + R() * 10)) % 1500) - 210, y = 230 + R() * 420, r = 160 + R() * 160; ctx.fillStyle = `rgba(${Math.round(20 + 90 * fl)},${Math.round(26 + 100 * fl)},${Math.round(48 + 120 * fl)},0.75)`; ctx.beginPath(); ctx.ellipse(x, y, r * 1.5, r * 0.55, 0, 0, TAU); ctx.fill(); } };
 const lluvia = (ctx, t, a = 1, fl = 0) => { const R = H.rng(77); ctx.save(); ctx.strokeStyle = `rgba(${Math.round(150 + 100 * fl)},${Math.round(180 + 70 * fl)},255,${0.35 * a})`; ctx.lineWidth = 2.5; ctx.beginPath();
  for (let i = 0; i < 150; i++) { const x0 = R() * 1400 - 100, y0 = R() * 2000, sp = 1500 + R() * 700, l = 34 + R() * 34, y = ((y0 + t * sp) % 2050) - 60, x = x0 - y * 0.18; ctx.moveTo(x, y); ctx.lineTo(x - l * 0.18, y + l); } ctx.stroke(); ctx.restore(); };
 const destello = (ctx, fl) => { if (fl > 0) { ctx.fillStyle = `rgba(220,235,255,${0.5 * fl})`; ctx.fillRect(0, 0, W, HH); } };
 // rayo zigzag con ramas (determinista)
 const rayoPts = (seed, x0, y0, x1, y1, n = 14, amp = 90) => { const R = H.rng(seed), pts = [[x0, y0]]; for (let k = 1; k < n; k++) { const u = k / n; pts.push([lerp(x0, x1, u) + (R() - 0.5) * amp * (1 - u * 0.6), lerp(y0, y1, u) + (R() - 0.5) * 20]); } pts.push([x1, y1]); return pts; };
 const rayo = (c, seed, x0, y0, x1, y1, a, w = 10) => { if (a <= 0) return; const pts = rayoPts(seed, x0, y0, x1, y1), R = H.rng(seed + 5); c.save(); c.globalAlpha *= a; c.lineJoin = 'round'; c.lineCap = 'round';
  const tr = (P0, lw, col, blur) => { c.shadowColor = '#9fd0ff'; c.shadowBlur = blur; c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); P0.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); };
  const ramas = []; for (let b = 0; b < 3; b++) { const i = 3 + Math.floor(R() * (pts.length - 6)), [bx, by] = pts[i], d = (R() > 0.5 ? 1 : -1); ramas.push(rayoPts(seed + 11 + b, bx, by, bx + d * (120 + R() * 140), by + 160 + R() * 160, 6, 50)); }
  for (const r of ramas) tr(r, w * 0.9, 'rgba(170,210,255,0.8)', 20); tr(pts, w * 2.6, 'rgba(160,205,255,0.55)', 50); tr(pts, w, '#ffffff', 25); c.restore(); };
 // chispas que saltan (determinista)
 const chispas = (c, x, y, t, t0, n = 18, r = 160) => { const d = t - t0; if (d < 0 || d > 0.9) return; const R = H.rng(Math.round(t0 * 100)); c.save(); for (let i = 0; i < n; i++) { const a = R() * TAU, v = (0.4 + R()) * r, q = d / 0.9, px = x + Math.cos(a) * v * q, py = y + Math.sin(a) * v * q + 300 * q * q; c.strokeStyle = `rgba(255,${200 + Math.round(R() * 55)},120,${1 - q})`; c.lineWidth = 5; c.beginPath(); c.moveTo(px, py); c.lineTo(px - Math.cos(a) * 26, py - Math.sin(a) * 26); c.stroke(); } c.restore(); };

 // ---------- carretera mojada (en coordenadas del grupo: el suelo es y = 0) ----------
 const carretera = (c, t, vel = 1, x0 = -1700, x1 = 1700) => { const g = c.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, '#1c2230'); g.addColorStop(1, '#0a0d14'); c.fillStyle = g; c.fillRect(x0, 0, x1 - x0, 900);
  c.fillStyle = 'rgba(143,216,255,0.25)'; c.fillRect(x0, 0, x1 - x0, 4); const off = (t * 900 * vel) % 300; c.fillStyle = 'rgba(245,247,250,0.75)'; for (let x = x0 - 300; x < x1 + 300; x += 300) { c.beginPath(); c.roundRect(x - off, 110, 160, 16, 6); c.fill(); }
  c.fillStyle = 'rgba(143,216,255,0.07)'; for (let x = x0; x < x1; x += 140) c.fillRect(x - (off * 0.5) % 140, 40, 70, 3);
  c.fillStyle = 'rgba(245,247,250,0.55)'; c.fillRect(x0, 300, x1 - x0, 12);   // borde de la calzada
  const R = H.rng(91); c.lineWidth = 3; for (let i = 0; i < 70; i++) { const bx = x0 + R() * (x1 - x0), by = 30 + R() * 560, ph = (t * (1.3 + R()) + R()) % 1, xx = ((bx - off * (0.4 + 0.6 * (by > 300 ? 0 : 1)) - x0) % (x1 - x0) + (x1 - x0)) % (x1 - x0) + x0;   // salpicaduras de lluvia
   c.strokeStyle = `rgba(170,215,255,${0.55 * (1 - ph)})`; c.beginPath(); c.ellipse(xx, by, 8 + 34 * ph, 3 + 8 * ph, 0, 0, TAU); c.stroke(); } };

 // ---------- carro genérico (vista lateral, mira a la derecha; suelo en y = 0, largo ≈ 1000) ----------
 const RU = [[-310, -85], [310, -85]];
 const CAM_DEL = [[0, -432], [140, -432], [185, -415], [305, -285], [420, -262], [410, -110], [330, -60], [310, 0]];
 const CAM_TRAS = [[0, -432], [-190, -432], [-235, -410], [-310, -272], [-420, -262], [-410, -110], [-330, -60], [-310, 0]];
 const largo = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
 const tramo = (c, pts, p, t, w = 14) => { if (p <= 0) return; const L = largo(pts) * cl(p), R = H.rng(Math.floor(t * 24)); let acc = 0; const out = [pts[0]];
  for (let i = 1; i < pts.length && acc < L; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], d = Math.hypot(bx - ax, by - ay), u = Math.min(1, (L - acc) / d), n = Math.max(2, Math.round(d * u / 40));
   for (let k = 1; k <= n; k++) { const q = (k / n) * u, j = k < n ? (R() - 0.5) * 14 : 0; out.push([lerp(ax, bx, q) + j, lerp(ay, by, q) + j]); } acc += d; }
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round'; c.shadowColor = YE; c.shadowBlur = 30; c.strokeStyle = 'rgba(255,210,63,0.6)'; c.lineWidth = w * 2.2; c.beginPath(); out.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
  c.shadowBlur = 12; c.strokeStyle = '#fff6c8'; c.lineWidth = w * 0.7; c.stroke(); const [hx, hy] = out[out.length - 1]; c.fillStyle = '#fff'; c.shadowBlur = 40; c.beginPath(); c.arc(hx, hy, w * 1.2, 0, TAU); c.fill(); c.restore(); };
 const rueda = (c, x, y, t, o = {}) => { const ang = (o.gira ?? 1) * t * 9, pin = o.pinchada || 0; c.save(); c.translate(x, y); c.scale(1 + pin * 0.12, 1 - pin * 0.28); c.translate(0, pin * 30);
  c.fillStyle = '#111317'; c.beginPath(); c.arc(0, 0, 85, 0, TAU); c.fill(); c.strokeStyle = '#2b2f36'; c.lineWidth = 8; c.beginPath(); c.arc(0, 0, 70, 0, TAU); c.stroke();
  c.fillStyle = '#9aa3b2'; c.beginPath(); c.arc(0, 0, 46, 0, TAU); c.fill(); c.rotate(ang); c.strokeStyle = '#5c6575'; c.lineWidth = 9; for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(k * TAU / 5) * 42, Math.sin(k * TAU / 5) * 42); c.stroke(); }
  c.fillStyle = '#cfd8e3'; c.beginPath(); c.arc(0, 0, 12, 0, TAU); c.fill(); c.restore(); };
 const carroceria = (c) => { c.beginPath(); c.moveTo(-495, -115); c.lineTo(-500, -215); c.quadraticCurveTo(-495, -255, -440, -262); c.lineTo(-310, -272); c.lineTo(-235, -410); c.quadraticCurveTo(-220, -430, -190, -432); c.lineTo(140, -432); c.quadraticCurveTo(170, -430, 185, -415);
  c.lineTo(305, -285); c.lineTo(455, -262); c.quadraticCurveTo(500, -250, 505, -200); c.lineTo(505, -120); c.quadraticCurveTo(500, -100, 480, -100); c.lineTo(415, -100); c.arc(310, -85, 105, 0, Math.PI, true); c.lineTo(-205, -85); c.arc(-310, -85, 105, 0, Math.PI, true); c.lineTo(-480, -100); c.closePath(); };
 const cristal = (c) => { c.beginPath(); c.moveTo(-282, -286); c.lineTo(-220, -404); c.quadraticCurveTo(-208, -418, -188, -418); c.lineTo(135, -418); c.quadraticCurveTo(158, -416, 170, -404); c.lineTo(282, -288); c.closePath(); };
 const conductor = (c, t, o = {}) => { const fl = o.fl || 0; c.save(); c.fillStyle = '#1d2433'; c.beginPath(); c.roundRect(40, -330, 150, 60, 30); c.fill();   // asiento
  c.fillStyle = '#2d3b5a'; c.beginPath(); c.roundRect(60, -345, 120, 70, [30, 30, 8, 8]); c.fill();   // hombros (chaqueta)
  c.fillStyle = H.rgba(H.mix('#c98f68', '#f1c7a5', fl)); c.beginPath(); c.arc(120, -378, 34, 0, TAU); c.fill(); c.fillStyle = '#2a1d16'; c.beginPath(); c.arc(116, -390, 33, Math.PI * 0.95, Math.PI * 2.05); c.fill();   // cabeza y pelo
  c.strokeStyle = '#2d3b5a'; c.lineWidth = 18; c.lineCap = 'round'; c.beginPath(); c.moveTo(165, -330); c.lineTo(222, -322); c.stroke();   // brazo al volante
  c.strokeStyle = '#3a4152'; c.lineWidth = 10; c.beginPath(); c.ellipse(232, -330, 12, 34, -0.3, 0, TAU); c.stroke(); c.restore(); };
 const carro = (c, t, o = {}) => { const fl = o.fl || 0; c.save();
  c.save(); c.translate(0, 6); c.scale(1, -0.55); c.globalAlpha *= 0.16 + 0.2 * fl; c.fillStyle = '#4f7fd8'; carroceria(c); c.fill(); c.restore();   // reflejo en el asfalto mojado
  c.fillStyle = 'rgba(0,0,0,0.45)'; c.beginPath(); c.ellipse(0, 4, 540, 22, 0, 0, TAU); c.fill();
  if (o.faros !== false) { const g = c.createLinearGradient(505, 0, 1300, 0); g.addColorStop(0, 'rgba(255,236,170,0.45)'); g.addColorStop(1, 'rgba(255,236,170,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(500, -210); c.lineTo(1400, -330); c.lineTo(1400, 10); c.closePath(); c.fill(); }
  // carrocería (lona en el techo si es descapotable)
  const cb = c.createLinearGradient(0, -432, 0, -100); cb.addColorStop(0, H.rgba(H.mix('#4f7fd8', '#a9c4ff', fl * 0.6))); cb.addColorStop(1, H.rgba(H.mix('#22427f', '#5a7cc0', fl * 0.6))); c.fillStyle = cb; carroceria(c); c.fill();
  if (o.lona) { c.save(); carroceria(c); c.clip(); c.fillStyle = '#d9c9a0'; c.fillRect(-330, -450, 660, 172); c.strokeStyle = 'rgba(80,60,30,0.55)'; c.setLineDash([12, 10]); c.lineWidth = 4; for (const x of [-150, 0, 150]) { c.beginPath(); c.moveTo(x, -440); c.lineTo(x, -290); c.stroke(); } c.setLineDash([]); c.restore(); }
  // cristal y cabina
  c.save(); cristal(c); c.clip(); c.fillStyle = H.rgba(H.mix('#0c1626', '#3b5277', fl)); c.fillRect(-300, -430, 600, 160); if (o.seguro > 0) P.glow(c, 120, -360, 260, '34,210,122', 0.5 * o.seguro);
  if (o.conductor !== false) conductor(c, t, { fl }); const ven = o.ventana ?? 1; if (ven < 1) { c.fillStyle = 'rgba(12,22,38,0.0)'; }
  c.fillStyle = `rgba(160,200,255,${0.18 + 0.1 * fl})`; c.save(); c.beginPath(); c.rect(-300, -290 - 132 * ven, 600, 132 * ven); c.clip(); c.beginPath(); c.moveTo(-120, -420); c.lineTo(-60, -420); c.lineTo(-170, -290); c.lineTo(-230, -290); c.closePath(); c.fill(); c.beginPath(); c.moveTo(60, -420); c.lineTo(90, -420); c.lineTo(-20, -290); c.lineTo(-50, -290); c.closePath(); c.fill(); c.restore();
  if (ven < 1) { c.strokeStyle = 'rgba(200,225,255,0.8)'; c.lineWidth = 4; c.beginPath(); c.moveTo(-290, -290 - 132 * ven); c.lineTo(290, -290 - 132 * ven); c.stroke(); }
  if (o.grieta > 0) { c.save(); c.globalAlpha *= o.grieta; c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = 4; const R = H.rng(41), cx = -235, cy = -340; for (let k = 0; k < 9; k++) { const a = R() * TAU; let x = cx, y = cy; c.beginPath(); c.moveTo(x, y); for (let s = 0; s < 4; s++) { x += Math.cos(a + (R() - 0.5) * 0.8) * 26; y += Math.sin(a + (R() - 0.5) * 0.8) * 26; c.lineTo(x, y); } c.stroke(); } c.fillStyle = 'rgba(255,255,255,0.9)'; c.beginPath(); c.arc(cx, cy, 9, 0, TAU); c.fill(); c.restore(); }
  c.restore();
  c.fillStyle = H.rgba(H.mix('#22427f', '#6d8fd0', fl * 0.5)); c.fillRect(8, -420, 26, 134);   // pilar central
  c.strokeStyle = 'rgba(10,20,40,0.6)'; c.lineWidth = 4; c.beginPath(); c.moveTo(21, -286); c.lineTo(21, -110); c.moveTo(282, -288); c.lineTo(300, -110); c.moveTo(-282, -286); c.lineTo(-290, -110); c.stroke();   // puertas
  c.fillStyle = '#cfd8e3'; c.beginPath(); c.roundRect(-150, -252, 60, 14, 7); c.fill(); c.beginPath(); c.roundRect(170, -252, 60, 14, 7); c.fill();   // manijas
  c.strokeStyle = 'rgba(255,255,255,0.28)'; c.lineWidth = 5; c.beginPath(); c.moveTo(-300, -268); c.lineTo(450, -256); c.stroke();
  c.fillStyle = o.faros === false ? '#555' : '#fff0b0'; c.beginPath(); c.roundRect(478, -222, 30, 30, 8); c.fill(); c.fillStyle = '#ff3b4e'; c.beginPath(); c.roundRect(-505, -232, 22, 40, 6); c.fill();
  if (o.jaula > 0) { c.save(); c.globalAlpha *= o.jaula; c.strokeStyle = CY; c.lineWidth = 7; c.shadowColor = CY; c.shadowBlur = 18; carroceria(c); c.stroke(); c.lineWidth = 5; c.beginPath(); for (let x = -420; x <= 440; x += 86) { c.moveTo(x, -110); c.lineTo(x, x > -235 && x < 185 ? -430 : x <= -235 ? lerp(-262, -430, cl((x + 310) / 75)) : lerp(-430, -262, cl((x - 185) / 120))); } for (const y of [-160, -220, -270]) { c.moveTo(-495, y); c.lineTo(505, y); } c.stroke(); c.restore(); }
  RU.forEach(([x, y], i) => rueda(c, x, y, t, { gira: o.gira ?? 1, pinchada: i === 0 ? (o.pinchada || 0) : 0 }));
  if (o.corriente > 0) { const p = o.corriente; tramo(c, CAM_DEL, p, t); tramo(c, CAM_TRAS, p, t);
   if (p >= 0.98) { const d = (t * 1.6) % 1; for (const [x] of RU) for (const q of [d, (d + 0.5) % 1]) { c.strokeStyle = `rgba(255,210,63,${0.8 * (1 - q)})`; c.lineWidth = 6; c.beginPath(); c.ellipse(x, 6, 40 + 260 * q, 10 + 40 * q, 0, 0, TAU); c.stroke(); } } }
  c.restore(); };

 // ---------- paraguas y persona (dibujo propio) ----------
 const persona = (c, x, y, s, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(0,0,0,0.4)'; c.beginPath(); c.ellipse(0, 0, 120, 16, 0, 0, TAU); c.fill();
  c.fillStyle = '#1b2233'; c.beginPath(); c.roundRect(-52, -260, 44, 260, 14); c.fill(); c.beginPath(); c.roundRect(8, -260, 44, 260, 14); c.fill();   // piernas
  c.fillStyle = '#c0533e'; c.beginPath(); c.moveTo(-78, -250); c.lineTo(-62, -520); c.quadraticCurveTo(0, -560, 62, -520); c.lineTo(78, -250); c.closePath(); c.fill();   // abrigo
  c.fillStyle = '#d99a72'; c.beginPath(); c.arc(0, -600, 58, 0, TAU); c.fill(); c.fillStyle = '#2a1d16'; c.beginPath(); c.arc(-4, -616, 58, Math.PI * 0.95, Math.PI * 2.05); c.fill();   // cabeza
  c.strokeStyle = '#c0533e'; c.lineWidth = 36; c.lineCap = 'round'; c.beginPath(); c.moveTo(40, -500); c.lineTo(95, -420); c.lineTo(110, -470); c.stroke(); c.fillStyle = '#d99a72'; c.beginPath(); c.arc(112, -478, 24, 0, TAU); c.fill();   // brazo y mano
  c.restore(); };
 // paraguas: puño en (x, y); o.tela 0…1, o.mango (resalta el mango), o.telaOk (resalta la tela), o.agua (gotas que resbalan)
 const paraguas = (c, x, y, s, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); const top = -520, r = 330;
  c.strokeStyle = o.mango ? RD : '#3a3f4a'; c.lineWidth = o.mango ? 16 : 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, top + 20); c.lineTo(0, 10); c.arc(-28, 10, 28, 0, Math.PI); c.stroke();   // vara y mango en J
  if (o.mango) { P.glow(c, 0, -30, 120, '255,77,94', 0.5); }
  const tl = o.tela ?? 1; c.strokeStyle = '#9aa3b2'; c.lineWidth = 7; for (let k = 0; k <= 6; k++) { const a = Math.PI + k * Math.PI / 6; c.beginPath(); c.moveTo(0, top); c.quadraticCurveTo(Math.cos(a) * r * 0.6, top + Math.sin(a) * 150 - 40, Math.cos(a) * r, top + 150 + (k % 6 === 0 ? 0 : -20)); c.stroke(); }
  if (tl > 0) { c.save(); c.globalAlpha *= tl; c.fillStyle = o.telaOk ? '#2fbf74' : '#2b6fd6'; c.beginPath(); c.moveTo(-r, top + 150); for (let k = 0; k < 6; k++) { const xa = -r + k * (2 * r / 6), xb = xa + 2 * r / 6; c.quadraticCurveTo((xa + xb) / 2, top + 110, xb, top + 150); } c.bezierCurveTo(r * 0.9, top - 60, r * 0.4, top - 150, 0, top - 150); c.bezierCurveTo(-r * 0.4, top - 150, -r * 0.9, top - 60, -r, top + 150); c.closePath(); c.fill();
   if (o.telaOk) { c.shadowColor = GR; c.shadowBlur = 30; c.strokeStyle = '#bfffd9'; c.lineWidth = 6; c.stroke(); } c.restore(); }
  c.fillStyle = '#3a3f4a'; c.beginPath(); c.arc(0, top - 150, 12, 0, TAU); c.fill();
  // agua: cae sobre la tela, resbala por fuera y cae al suelo (o.suelo = y del suelo en coordenadas del paraguas)
  if (o.agua > 0) { const R = H.rng(5); c.fillStyle = `rgba(170,215,255,${0.9 * o.agua})`; for (let i = 0; i < 30; i++) { const sd = R() < 0.5 ? -1 : 1, ph = (t * 0.7 + R()) % 1, ys = o.suelo ?? 600; let px, py;
    if (ph < 0.5) { const u = ph / 0.5; px = sd * lerp(30, r * 1.02, u); py = top - 150 + (top + 150 - (top - 150)) * u * u; } else { const u = (ph - 0.5) / 0.5; px = sd * r * 1.04; py = lerp(top + 160, ys, u * u); }
    c.beginPath(); c.ellipse(px, py, 11, 17, 0, 0, TAU); c.fill(); } }
  c.restore(); };

 // ---------- encuadre ----------
 const ENC = (ctx, caja, fn, o = {}) => P.encuadrar(ctx, caja, fn, Object.assign({ capY: 330, ancho: 0.92 }, o));
 const nubes = (g, t, fl) => { const R = H.rng(51); for (let i = 0; i < 6; i++) { const x = -700 + i * 280 + Math.sin(t * 0.3 + i) * 20, y = -1050 + R() * 120; g.fillStyle = `rgba(${Math.round(30 + 90 * fl)},${Math.round(36 + 100 * fl)},${Math.round(60 + 120 * fl)},0.9)`; g.beginPath(); g.ellipse(x, y, 260, 110, 0, 0, TAU); g.fill(); } };
 const CAJA = [-545, -560, 545, 330];   // carro + algo de cielo y de carretera

 // =====================================================================================================
 // ESCENAS
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO A: vas en el carro de noche… y un rayo cae justo encima ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  const fl = rel(t, [T_CERCA, T_TECHO]); cielo(ctx, t, fl); lluvia(ctx, t, 1, fl);
  const qB = P.pregunta(ctx, '¿QUÉ PASA SI TE CAE UN RAYO / DENTRO DEL CARRO?', t, 0, S(2) - 0.15, { capY: 330, px: 60, clave: 'RAYO', x: 540, dy: 110 });
  const pz = 1 + 0.07 * E.inOut(win(t, 0, S(2))), sh = t > T_TECHO && t < T_TECHO + 0.5 ? Math.sin(t * 90) * 10 * (1 - (t - T_TECHO) / 0.5) : 0, cp = sm(T_TECHO, T_TECHO + 1.2, t);
  ENC(ctx, CAJA, (g) => { g.translate(sh, 0); g.translate(0, -200); g.scale(pz, pz); g.translate(0, 200); carretera(g, t, 1); nubes(g, t, fl);
   rayo(g, 3, 250, -1000, 440, 0, 1 - sm(T_CERCA + 0.15, T_CERCA + 0.45, t) * (t > T_CERCA ? 1 : 0) - (t < T_CERCA ? 1 : 0), 9);   // cae cerca, delante
   carro(g, t, { fl, corriente: cp > 0 ? 0.25 + 0.75 * (cp > 0.99 ? 1 : cp) : 0 });
   if (t >= T_TECHO) rayo(g, 7, -60, -1000, 0, -432, 1 - sm(T_TECHO + 0.25, T_TECHO + 0.7, t), 12);
   chispas(g, 0, -440, t, T_TECHO, 22, 220); },
   { franja: { x0: 20, x1: 1060, y0: qB + 20, y1: 1500, cx: 540, cy: (qB + 20 + 1500) / 2, w: 1040, h: 1500 - qB - 20 }, ancho: 0.98, alto: 0.98 });
  destello(ctx, fl * 0.8);
 }, sfx(k) { trueno(k, T_CERCA, 0.8); trueno(k, T_TECHO, 1.1); FX.chispa(k, T_TECHO, 0.8, 1); } });

 // ---------- 2 · ¿Qué te pasa? Lo que ocurre te va a sorprender ----------
 B.push({ t0: S(2), t1: S(4), in: { type: 'cut' }, draw(ctx, t) {
  const fl = rel(t, [Tk.sorprender]) * 0.8; cielo(ctx, t, fl); lluvia(ctx, t, 1, fl);
  const pz = 1.25 + 0.1 * E.inOut(win(t, S(2), S(4))), q = sm(S(2) + 0.1, S(2) + 0.4, t);
  ENC(ctx, CAJA, (g) => { g.translate(0, -300); g.scale(pz, pz); g.translate(0, 300); carretera(g, t, 0.6); carro(g, t, { fl, corriente: 1, gira: 0.6 });
   if (q > 0) { g.save(); g.globalAlpha *= q; txt(g, '?', 120 + Math.sin(t * 5) * 6, -560, 190 * E.out(q), YE, { w: 900, f: 'Fredoka' }); g.restore(); } });
  destello(ctx, fl * 0.6);
 }, sfx(k) { FX.aparece(k, S(2) + 0.15, 520); FX.chispa(k, S(2), 1.2, 0.6); trueno(k, Tk.sorprender, 0.6); } });

 // ---------- 3 · piensa en un paraguas bajo la lluvia: no te protege el mango… te protege la tela; el agua resbala y cae al suelo ----------
 B.push({ t0: S(4), t1: S(8), in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  cielo(ctx, t, 0); lluvia(ctx, t, 1, 0);
  const mg = win(t, Tk.mango - 0.3, S(6)) > 0 && t < S(6) ? 1 : 0, ok = t >= Tk.tela - 0.2, ag = sm(Tk.agua - 0.4, Tk.agua, t) + (t < Tk.agua - 0.4 ? 0.5 : 0);
  const r = ENC(ctx, [-420, -1200, 470, 60], (g) => { g.fillStyle = '#1c2230'; g.fillRect(-1200, 0, 2400, 700); g.fillStyle = 'rgba(143,216,255,0.25)'; g.fillRect(-1200, 0, 2400, 4);
   persona(g, -20, 0, 1, t); paraguas(g, 92, -478, 1, t, { mango: mg, telaOk: ok, agua: Math.min(1, ag), suelo: 478 }); g.fillStyle = 'rgba(143,216,255,0.12)'; g.beginPath(); g.ellipse(40, 60, 420, 40, 0, 0, TAU); g.fill();
   if (t > Tk.suelo0 - 0.3) { const d = (t * 1.4) % 1; for (const sx of [-250, 430]) { g.strokeStyle = `rgba(170,215,255,${0.8 * (1 - d)})`; g.lineWidth = 4; g.beginPath(); g.ellipse(sx, 4, 30 + 80 * d, 6 + 10 * d, 0, 0, TAU); g.stroke(); } } }, { ancho: 0.98, alto: 0.98 });
  if (mg) { const [x, y] = r.map(64, -440); P.icon(ctx, 'cruz', x + 120, y, 120, { mode: 'flat', col: RD, col2: '#fff' }); }
  P.tag(ctx, 'MANGO', 640, 1200, t, Tk.mango - 0.3, S(6), { mono: true, col: RD, px: 62 });
  P.tag(ctx, 'LA TELA', 540, 520, t, Tk.tela - 0.2, S(8), { mono: true, col: GR, px: 62 });
 }, sfx(k) { FX.lluvia(k, S(4), S(8) - S(4), 1.2); FX.etiqueta(k, Tk.mango - 0.3); k.play('error', Tk.mango, { f: 'D3', gain: 0.2, minor: true }); FX.correcto(k, Tk.tela); FX.etiqueta(k, Tk.tela - 0.2); } });

 // ---------- 4 · tu carro hace lo mismo con el rayo: la corriente corre por la carrocería de metal, por fuera, alrededor de ti… y baja al suelo por las llantas ----------
 B.push({ t0: S(8), t1: S(12), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const tg = Tk.rayo2 - 0.25, fl = rel(t, [tg]); cielo(ctx, t, fl); lluvia(ctx, t, 1, fl);
  const p = t < Tk.corriente - 0.2 ? 0 : t < Tk.baja ? 0.62 * E.out(win(t, Tk.corriente - 0.2, Tk.fuera)) : 0.62 + 0.38 * E.inOut(win(t, Tk.baja, Tk.llantas0)), seg = sm(Tk.alrededor - 0.3, Tk.alrededor + 0.2, t);
  ENC(ctx, CAJA, (g) => { carretera(g, t, 0.5); nubes(g, t, fl); carro(g, t, { fl, corriente: p, seguro: seg, gira: 0.5 }); if (t >= tg) rayo(g, 13, 80, -1000, 0, -432, 1 - sm(tg + 0.3, tg + 0.8, t), 12); chispas(g, 0, -440, t, tg, 16, 180); });
  destello(ctx, fl * 0.7);
  P.tag(ctx, 'CARROCERÍA DE METAL', 470, 520, t, Tk.carroceria - 0.2, Tk.alrededor - 0.3, { mono: true, col: YE, px: 56 });
  P.tag(ctx, 'TÚ, A SALVO', 470, 520, t, Tk.alrededor - 0.2, Tk.baja - 0.2, { mono: true, col: GR, px: 58 });
  P.tag(ctx, 'AL SUELO', 470, 520, t, Tk.baja, S(12), { mono: true, col: YE, px: 62 });
 }, sfx(k) { trueno(k, Tk.rayo2 - 0.25, 1); FX.chispa(k, Tk.corriente - 0.2, 1.6, 0.7); FX.etiqueta(k, Tk.carroceria - 0.2); FX.correcto(k, Tk.alrededor); FX.chispa(k, Tk.baja, 1.4, 0.6); k.play('thud', Tk.llantas0, { f: 60, gain: 0.4 }); } });

 // ---------- 5 · la sorpresa: las llantas de caucho no te salvan; el rayo es demasiado fuerte para que el caucho lo detenga ----------
 B.push({ t0: S(12), t1: S(15), in: { type: 'zoom', d: 0.4, x: 540, y: 900 }, draw(ctx, t) {
  const fl = rel(t, [Tk.fuerte - 0.1]); cielo(ctx, t, fl * 0.7); lluvia(ctx, t, 0.8, fl);
  const no = sm(Tk.salvan - 0.3, Tk.salvan, t), arc = t >= Tk.fuerte - 0.1 ? 1 - sm(Tk.detenga + 0.3, Tk.detenga + 0.8, t) : 0, p = sm(Tk.fuerte - 0.1, Tk.detenga, t);
  ENC(ctx, [-420, -560, 420, 200], (g) => { carretera(g, t, 0, -1500, 1500); g.save(); g.translate(0, -60 + 85 * 3.6 / 3.6); g.restore();
   g.save(); g.scale(3.6, 3.6); rueda(g, 0, -85, t, { gira: 0.15 }); g.restore();
   if (arc > 0) rayo(g, 23, -60, -1400, -40, -620, arc, 14);
   if (arc > 0) { tramo(g, [[-40, -620], [-230, -560], [-300, -306], [-200, -40], [0, 0]], p, t, 22); tramo(g, [[-40, -620], [230, -560], [300, -306], [200, -40], [0, 0]], p, t, 22); }
   if (p >= 0.98 && arc > 0) { const d = (t * 1.6) % 1; g.strokeStyle = `rgba(255,210,63,${0.9 * (1 - d)})`; g.lineWidth = 10; g.beginPath(); g.ellipse(0, 10, 80 + 380 * d, 16 + 50 * d, 0, 0, TAU); g.stroke(); }
   if (no > 0) { g.save(); g.globalAlpha *= no; g.strokeStyle = RD; g.lineWidth = 46; g.lineCap = 'round'; const s = 230 * E.out(no); g.beginPath(); g.moveTo(-s, -306 - s); g.lineTo(s, -306 + s); g.moveTo(s, -306 - s); g.lineTo(-s, -306 + s); g.stroke(); g.restore(); } }, { ancho: 0.86 });
  destello(ctx, fl * 0.5);
  P.tag(ctx, 'LLANTAS DE CAUCHO', 470, 520, t, Tk.llantas - 0.2, Tk.fuerte - 0.2, { mono: true, col: RD, px: 56 });
  P.tag(ctx, 'NO LO DETIENEN', 470, 520, t, Tk.fuerte - 0.1, S(15), { mono: true, col: RD, px: 58 });
 }, sfx(k) { k.play('riser', S(12) - 0.1, { dur: 0.9, gain: 0.3, minor: true }); FX.etiqueta(k, Tk.llantas - 0.2); k.play('error', Tk.salvan, { f: 'C3', gain: 0.3 }); trueno(k, Tk.fuerte - 0.1, 0.9); FX.chispa(k, Tk.fuerte, 1.2, 0.8); } });

 // ---------- 6 · te protege el metal que te rodea, como una jaula ----------
 B.push({ t0: S(15), t1: S(16), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  cielo(ctx, t, 0); lluvia(ctx, t, 1, 0); const j = sm(Tk.metal - 0.3, Tk.jaula, t);
  ENC(ctx, CAJA, (g) => { carretera(g, t, 0.4); nubes(g, t, 0); carro(g, t, { jaula: j, seguro: j, gira: 0.4, corriente: 1 }); });
  P.tag(ctx, 'JAULA DE METAL', 470, 520, t, Tk.metal - 0.2, S(16), { mono: true, col: CY, px: 60 });
 }, sfx(k) { FX.revelar(k, Tk.metal - 0.3); FX.correcto(k, Tk.jaula); } });

 // ---------- 7 · por eso un descapotable no sirve, ni con la capota puesta: es un paraguas sin tela ----------
 B.push({ t0: S(16), t1: S(18), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  const fl = rel(t, [Tk.capota]); cielo(ctx, t, fl * 0.7); lluvia(ctx, t, 1, fl); const no = sm(Tk.capota - 0.2, Tk.capota + 0.2, t), ins = sm(Tk.sinTela - 0.9, Tk.sinTela - 0.5, t);
  ctx.save(); ctx.globalAlpha *= 1 - ins; const r = ENC(ctx, CAJA, (g) => { carretera(g, t, 0.6); nubes(g, t, fl); carro(g, t, { fl, lona: true, gira: 0.6 }); });
  if (no > 0) { const [x, y] = r.map(0, -330); P.icon(ctx, 'cruz', x, y, 260 * E.out(no), { mode: 'flat', col: RD, col2: '#fff' }); } ctx.restore();
  if (ins > 0) { ctx.save(); ctx.globalAlpha *= ins; ENC(ctx, [-420, -1200, 470, 60], (g) => { g.fillStyle = '#1c2230'; g.fillRect(-1200, 0, 2400, 700); g.fillStyle = 'rgba(143,216,255,0.25)'; g.fillRect(-1200, 0, 2400, 4); persona(g, -20, 0, 1, t); paraguas(g, 92, -478, 1, t, { tela: 0 });
   const R2 = H.rng(61); g.fillStyle = 'rgba(170,215,255,0.9)'; for (let i = 0; i < 26; i++) { const px = -300 + R2() * 700, py = -1000 + ((R2() * 1000 + t * 900) % 1000); g.beginPath(); g.ellipse(px, py, 9, 15, 0, 0, TAU); g.fill(); } }, { ancho: 0.98, alto: 0.98 }); ctx.restore(); }
  P.tag(ctx, 'DESCAPOTABLE', 470, 520, t, Tk.descapotable - 0.2, Tk.sinTela - 0.9, { mono: true, col: RD, px: 60 });
  P.tag(ctx, 'PARAGUAS SIN TELA', 470, 520, t, Tk.sinTela - 0.8, S(18), { mono: true, col: RD, px: 56 });
 }, sfx(k) { FX.etiqueta(k, Tk.descapotable - 0.2); trueno(k, Tk.capota, 0.6); k.play('error', Tk.capota + 0.1, { f: 'D3', gain: 0.3 }); FX.etiqueta(k, Tk.sinTela - 0.8); } });

 // ---------- 8 · eso sí, el carro puede salir dañado: electrónica, una llanta, el vidrio de atrás ----------
 B.push({ t0: S(18), t1: S(21), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const fl = rel(t, [S(18)]); cielo(ctx, t, fl * 0.6); lluvia(ctx, t, 1, fl);
  const el = t >= Tk.electronica - 0.2, pin = sm(Tk.llanta - 0.2, Tk.llanta + 0.3, t), gr = sm(Tk.vidrio - 0.2, Tk.vidrio + 0.1, t), parp = el ? (Math.sin(t * 23) > 0.3 ? 1 : 0) : 1;
  const r = ENC(ctx, CAJA, (g) => { carretera(g, t, 0); nubes(g, t, fl); carro(g, t, { fl, gira: 0, pinchada: pin, grieta: gr, faros: parp ? true : false }); if (el) chispas(g, 250, -310, t, Tk.electronica - 0.2 + Math.floor((t - Tk.electronica) / 0.9) * 0.9, 14, 120); if (pin > 0) chispas(g, -310, -40, t, Tk.llanta - 0.2, 16, 160); });
  P.tag(ctx, 'ELECTRÓNICA', 470, 520, t, Tk.electronica - 0.2, Tk.llanta - 0.2, { mono: true, col: YE, px: 60 });
  P.tag(ctx, 'LLANTA', 470, 520, t, Tk.llanta - 0.2, Tk.vidrio - 0.2, { mono: true, col: YE, px: 60 });
  P.tag(ctx, 'VIDRIO DE ATRÁS', 470, 520, t, Tk.vidrio - 0.2, S(21), { mono: true, col: YE, px: 60 });
 }, sfx(k) { FX.chispa(k, Tk.electronica - 0.2, 0.9, 1); FX.etiqueta(k, Tk.electronica - 0.2); k.play('thud', Tk.llanta, { f: 90, gain: 0.5 }); k.noise(Tk.llanta, { dur: 0.6, color: 'pink', filter: 'highpass', f: 1500, gain: 0.15, a: 0.002 }); FX.rotura(k, Tk.vidrio); } });

 // ---------- 9 · ¿Qué hacer? Quédate dentro. Sube las ventanas. No toques el metal ni el celular cargando ----------
 const CONSEJOS = [{ t: Tk.quedate, txt: 'Quédate dentro' }, { t: Tk.sube, txt: 'Sube las ventanas' }, { t: Tk.toques, txt: 'No toques el metal' }];
 const tQ = Tk.hacer - 0.25;
 B.push({ t0: S(21), t1: S(25), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  cielo(ctx, t, 0); lluvia(ctx, t, 1, 0); const ven = t < Tk.sube ? 0.35 : 0.35 + 0.65 * E.inOut(win(t, Tk.sube, Tk.sube + 0.8)), no = sm(Tk.toques - 0.2, Tk.toques + 0.2, t);
  const y0 = 1000, r = ENC(ctx, [-545, -450, 545, 120], (g) => { carretera(g, t, 0); carro(g, t, { gira: 0, ventana: ven, seguro: sm(Tk.quedate - 0.2, Tk.quedate + 0.3, t) });
   if (no > 0) { g.save(); g.globalAlpha *= no; g.strokeStyle = RD; g.lineWidth = 10; g.shadowColor = RD; g.shadowBlur = 20; for (const x of [-120, 200]) { g.beginPath(); g.roundRect(x - 40, -262, 80, 34, 12); g.stroke(); } g.restore(); } },
   { franja: { x0: 30, x1: 1050, y0, y1: 1500, cx: 540, cy: (y0 + 1500) / 2, w: 1020, h: 1500 - y0 }, ancho: 0.95, alto: 0.95 });
  P.queHacer(ctx, t, tQ, CONSEJOS, { y: 520, px: 60 });
 }, sfx(k) { FX.queHacer(k, tQ, CONSEJOS); k.play('whoosh', Tk.sube, { dur: 0.8, top: 900, gain: 0.25 }); } });

 // ---------- 10 · CIERRE ----------
 B.push({ t0: S(25), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  cielo(ctx, t, 0); lluvia(ctx, t, 0.6, 0);
  P.ctaShare(ctx, t, S(25) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { cielo(cc, t, 0.4); cc.save(); cc.translate(540, 1250); cc.scale(0.9, 0.9); carretera(cc, t, 0.5); nubes(cc, t, 0.4); carro(cc, t, { fl: 0.4, corriente: 1, gira: 0.5 }); rayo(cc, 7, -60, -1000, 0, -432, 1, 12); cc.restore(); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(25) + 0.1); FX.fin(k, T.end + 0.3); } });

 // trueno: chasquido + golpe grave + retumbo que se apaga
 function trueno(k, t, g = 1) { k.noise(t - 0.01, { dur: 0.14, filter: 'highpass', f: 2500, gain: 0.3 * g, a: 0.001 }); k.play('thud', t, { f: 45, gain: 0.6 * g }); k.noise(t + 0.05, { dur: 2.6, color: 'brown', filter: 'lowpass', f: [[0, 1100], [2.6, 90]], gain: 0.28 * g, a: 0.01 }); }

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'noche', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['rayo', 'encima.', 'sorprender.', 'paraguas', 'mango…', 'tela', 'suelo.', 'carrocería', 'metal,', 'alrededor', 'llantas.', 'sorpresa:', 'caucho', 'salvan.', 'fuerte', 'jaula.', 'descapotable', 'tela.', 'dañado:', 'electrónica,', 'llanta', 'vidrio', 'hacer?', 'dentro.', 'ventanas.', 'metal', 'amigo'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 1800, q: 0.6, gain: 0.02, a: 0.05, hold: DURATION - 2.5 }); k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 400, gain: 0.02, a: 0.05, hold: DURATION - 2.5 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 92, gain: 0.45, chords: [['D2', 'F2', 'A2', 'D3'], ['A#1', 'D2', 'F2', 'A#2'], ['G1', 'A#1', 'D2', 'G2'], ['A1', 'C#2', 'E2', 'A2']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
