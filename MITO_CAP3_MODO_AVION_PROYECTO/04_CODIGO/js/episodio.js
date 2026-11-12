// =====================================================================================================
// episodio.js — «¿Mito o verdad?» Cap. 3 · ¿En modo avión carga más rápido el celular? · PLANTILLA ASOMBROTECA v1.31 · estilo «tecno»
// Serie: serie_mito_verdad (P.veredicto + FX.veredicto, incrustados desde series/serie_mito_verdad/serie.js). Veredicto: A MEDIAS.
// Voz: ElevenLabs Eleven v4, Dan, UNA toma con 3 ganchos de un tramo cada uno → el cuerpo empieza en el tramo 1 en las 3 variantes.
// Metáfora sostenida: la batería es un BALDE, el cargador una MANGUERA y las radios (red móvil, wifi, bluetooth) AGUJEROS.
// Celular y cargador genéricos dibujados, sin marcas ni logos (el bluetooth se representa con unos auriculares, sin su símbolo).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, B0, DURATION, txt } = K;
 const GANCHO = window.GANCHO || 'A';
 const S = (i) => A.segments[i].s, Se = (i) => A.segments[i].e;
 const Tk = {
  g0e: Se(0), mito: S(1), balde: wt(2, 'balde,'), manguera: wt(3, 'manguera'), agujeros: wt(4, 'agujeros:'),
  red: wt(5, 'red'), wifi: wt(5, 'wifi'), bt: wt(5, 'bluetooth'), gastan: wt(5, 'gastan'),
  avion: S(6), tapa: wt(7, 'tapa'), senal: wt(8, 'señal,'), crece: wt(8, 'crece:'), grita: wt(9, 'grita'), antena: wt(9, 'antena'),
  carga: S(10), si: S(11), pequenos: wt(12, 'pequeños,'), enorme: wt(12, 'enorme.'), pruebas: wt(13, 'pruebas'), minutos: wt(13, 'minutos,'), hora: wt(13, 'hora.'),
  veredicto: S(14), medias: wt(15, 'medias.'), mala: wt(16, 'mala'), lento: wt(16, 'lento.'), rapido: wt(17, 'rápido,'), nada: wt(17, 'nada.'),
 };
 const tV = Tk.medias - 0.05;   // el sello golpea al decir «medias»
 const CY = '#3ee6ff', GO = '#ffc845', RD = '#ff4d5e', INK = '#0d1117';
 const R = (a, b, t) => E.out(win(t, a, b));

 // =====================================================================================================
 // DIBUJO PROPIO (genérico)
 // =====================================================================================================
 const fondo = (ctx, t) => P.fondo(ctx, t);
 const mesa = (ctx, y = 1420) => { const g = ctx.createLinearGradient(0, y, 0, HH); g.addColorStop(0, '#2a3140'); g.addColorStop(1, '#11151d'); ctx.fillStyle = g; ctx.fillRect(0, y, W, HH - y); ctx.fillStyle = 'rgba(62,230,255,0.25)'; ctx.fillRect(0, y, W, 3); };
 // celular genérico (frente): pantalla con barra de estado y batería
 const celular = (ctx, x, y, w, t, o = {}) => { const h = w * 2.05; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 16, w, h, w * 0.14); ctx.fill();
  ctx.fillStyle = '#1b2029'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * 0.14); ctx.fill(); ctx.strokeStyle = '#3a4252'; ctx.lineWidth = 4; ctx.stroke();
  const sw = w * 0.9, sh = h * 0.93; ctx.fillStyle = o.pantalla || '#0b1622'; ctx.beginPath(); ctx.roundRect(-sw / 2, -sh / 2, sw, sh, w * 0.1); ctx.fill();
  ctx.fillStyle = '#05080c'; ctx.beginPath(); ctx.roundRect(-w * 0.12, -sh / 2 + w * 0.04, w * 0.24, w * 0.06, w * 0.03); ctx.fill();
  if (o.bat != null) { const bw = w * 0.13, bh = w * 0.065, bx = sw / 2 - bw - w * 0.06, by = -sh / 2 + w * 0.045; ctx.strokeStyle = '#cfd8e3'; ctx.lineWidth = 2.5; ctx.strokeRect(bx, by, bw, bh); ctx.fillStyle = o.bat > 0.2 ? '#5fd38d' : RD; ctx.fillRect(bx + 2, by + 2, (bw - 4) * cl(o.bat), bh - 4); }
  if (o.avion) { ctx.fillStyle = GO; P.icon(ctx, 'avion', -sw / 2 + w * 0.12, -sh / 2 + w * 0.075, w * 0.08, { mode: 'flat', col: GO }); }
  if (o.dibuja) o.dibuja(ctx, sw, sh);
  ctx.restore(); return { h }; };
 // cargador genérico con cable que entra al celular (enchufe en la base)
 const cargador = (ctx, x, y, s, t, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 72, 70, 10, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e9edf3'; ctx.beginPath(); ctx.roundRect(-60, -70, 120, 140, 18); ctx.fill(); ctx.fillStyle = '#c9d1dc'; ctx.fillRect(-60, 20, 120, 10); ctx.fillStyle = '#9aa3b2'; ctx.fillRect(-22, -95, 10, 28); ctx.fillRect(12, -95, 10, 28);
  if (o.rapido) { ctx.fillStyle = GO; P.icon(ctx, 'rayo', 0, -10, 70, { mode: 'flat', col: GO }); } ctx.restore(); };
 // iconos genéricos de las radios
 const icRed = (ctx, x, y, s, a = 1, n = 4) => { ctx.save(); ctx.globalAlpha *= a; for (let k = 0; k < 4; k++) { ctx.fillStyle = k < n ? '#e6edf5' : 'rgba(230,237,245,0.25)'; ctx.fillRect(x - s * 0.5 + k * s * 0.27, y + s * 0.4 - s * (0.25 + k * 0.22), s * 0.2, s * (0.25 + k * 0.22)); } ctx.restore(); };
 const icWifi = (ctx, x, y, s, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = '#e6edf5'; ctx.lineCap = 'round'; ctx.lineWidth = s * 0.12; for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.arc(x, y + s * 0.4, s * 0.22 * k, -Math.PI * 0.78, -Math.PI * 0.22); ctx.stroke(); } ctx.fillStyle = '#e6edf5'; ctx.beginPath(); ctx.arc(x, y + s * 0.4, s * 0.08, 0, TAU); ctx.fill(); ctx.restore(); };
 const icAuri = (ctx, x, y, s, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = '#e6edf5'; ctx.lineWidth = s * 0.11; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y + s * 0.05, s * 0.36, Math.PI, 0); ctx.stroke(); ctx.fillStyle = '#e6edf5'; for (const sg of [-1, 1]) { ctx.beginPath(); ctx.roundRect(x + sg * s * 0.36 - s * 0.12, y, s * 0.24, s * 0.36, s * 0.08); ctx.fill(); } ctx.restore(); };
 // BALDE (la batería): nivel 0…1, agujeros [{u, v, r, flujo}], tapones (0…1 cada uno), manguera: grosor del chorro de entrada (0 = sin manguera)
 const HOLES = [{ v: 0.35, u: -0.28, ic: icRed }, { v: 0.52, u: 0.02, ic: icWifi }, { v: 0.69, u: 0.3, ic: icAuri }];
 const balde = (ctx, x, y, s, t, o = {}) => { const wt2 = 560 * s, wb = 430 * s, h = 560 * s, top = y - h, lvl = cl(o.nivel ?? 0.5);
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(x, y + 6, wb * 0.62, 18 * s, 0, 0, TAU); ctx.fill();
  // interior y agua
  const xL = (yy) => x - lerp(wb, wt2, (y - yy) / h) / 2, xR = (yy) => x + lerp(wb, wt2, (y - yy) / h) / 2;
  ctx.fillStyle = '#1c2533'; ctx.beginPath(); ctx.moveTo(xL(top), top); ctx.lineTo(xR(top), top); ctx.lineTo(xR(y), y); ctx.lineTo(xL(y), y); ctx.closePath(); ctx.fill();
  const wy = y - h * lvl * 0.92; if (lvl > 0) { ctx.save(); ctx.beginPath(); ctx.moveTo(xL(wy), wy); for (let k = 0; k <= 30; k++) { const xx = lerp(xL(wy), xR(wy), k / 30); ctx.lineTo(xx, wy + Math.sin(t * 4 + k * 0.7) * 5 * s); } ctx.lineTo(xR(y), y); ctx.lineTo(xL(y), y); ctx.closePath(); const g = ctx.createLinearGradient(0, wy, 0, y); g.addColorStop(0, 'rgba(62,230,255,0.95)'); g.addColorStop(1, 'rgba(20,110,170,0.95)'); ctx.fillStyle = g; ctx.fill(); ctx.restore(); }
  // cuerpo metálico translúcido
  ctx.strokeStyle = '#9fb0c6'; ctx.lineWidth = 10 * s; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(xL(top), top); ctx.lineTo(xL(y), y); ctx.lineTo(xR(y), y); ctx.lineTo(xR(top), top); ctx.stroke();
  ctx.strokeStyle = '#c9d6e6'; ctx.lineWidth = 12 * s; ctx.beginPath(); ctx.ellipse(x, top, wt2 / 2, 26 * s, 0, 0, TAU); ctx.stroke();
  for (const f of [0.33, 0.66]) { ctx.strokeStyle = 'rgba(159,176,198,0.35)'; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(xL(y - h * f), y - h * f); ctx.lineTo(xR(y - h * f), y - h * f); ctx.stroke(); }
  P.icon(ctx, 'rayo', x, y - h * 0.15, 90 * s, { mode: 'flat', col: 'rgba(255,200,69,0.55)' });
  // asa
  ctx.strokeStyle = '#9fb0c6'; ctx.lineWidth = 8 * s; ctx.beginPath(); ctx.arc(x, top, wt2 * 0.48, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  // agujeros con su chorro (fuga) e icono
  (o.agujeros || []).forEach((hq, i) => { const H0 = HOLES[i], a = hq.a ?? 1; if (a <= 0) return; const hy = y - h * H0.v, hx = x + H0.u * lerp(wb, wt2, H0.v), rr = (hq.r ?? 1) * 16 * s, tap = cl(hq.tapon ?? 0);
   if (hy > wy && tap < 1) { const fl = (1 - tap) * a * (hq.flujo ?? 1), side = H0.u < 0 ? -1 : 1, Lx = 120 * s * (0.6 + 0.4 * fl) * (hq.r ?? 1); ctx.save(); ctx.strokeStyle = `rgba(255,77,94,${0.85 * fl})`; ctx.lineCap = 'round'; ctx.lineWidth = rr * 1.2;
    ctx.beginPath(); for (let k = 0; k <= 16; k++) { const q = k / 16, xx = hx + side * Lx * q, yy = hy + (y + 30 * s - hy) * q * q; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
    for (let k = 0; k < 4; k++) { const q = ((t * 1.6 + k / 4 + i * 0.3) % 1); ctx.fillStyle = `rgba(255,77,94,${fl * (1 - q)})`; ctx.beginPath(); ctx.arc(hx + side * Lx * q, hy + (y + 30 * s - hy) * q * q, rr * 0.5, 0, TAU); ctx.fill(); } ctx.restore(); }
   ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#05080c'; ctx.beginPath(); ctx.ellipse(hx, hy, rr, rr * 0.75, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = RD; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
   if (tap > 0) { ctx.save(); ctx.translate(hx, hy - (1 - tap) * 120 * s); ctx.globalAlpha *= cl(tap * 2); ctx.fillStyle = GO; ctx.beginPath(); ctx.roundRect(-rr * 1.3, -rr * 1.1, rr * 2.6, rr * 2.2, rr * 0.5); ctx.fill(); P.icon(ctx, 'avion', 0, 0, rr * 1.6, { mode: 'flat', col: INK }); ctx.restore(); }
   if (hq.icono !== false) H0.ic(ctx, hx + (H0.u < 0 ? -1 : 1) * 0 , hy - rr * 3.4, 52 * s * (hq.icS ?? 1), a); });
  ctx.restore(); return { top, wt2, h }; };
 // manguera desde el cargador hasta el borde del balde, con chorro de grosor g (0…1)
 const manguera = (ctx, bx, top, s, t, g, o = {}) => { if (g <= 0) return; const sx = o.sx ?? 160, sy = o.sy ?? 700, ex = bx - 60 * s, ey = top - 40 * s; ctx.save();
  ctx.strokeStyle = '#3a4252'; ctx.lineWidth = (28 + 40 * (o.ancho ?? 1)) * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.bezierCurveTo(sx + 120, sy - 160, ex - 120, ey - 220, ex, ey); ctx.stroke();
  ctx.strokeStyle = '#596377'; ctx.lineWidth = (18 + 30 * (o.ancho ?? 1)) * s; ctx.stroke();
  const fw = (14 + 70 * (o.ancho ?? 1)) * s * g; const gg = ctx.createLinearGradient(0, ey, 0, ey + 380 * s); gg.addColorStop(0, 'rgba(62,230,255,0.95)'); gg.addColorStop(1, 'rgba(62,230,255,0.3)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(ex - fw / 2, ey); ctx.lineTo(ex + fw / 2, ey); ctx.lineTo(ex + fw * 0.4, ey + 380 * s); ctx.lineTo(ex - fw * 0.4, ey + 380 * s); ctx.closePath(); ctx.fill();
  P.glow(ctx, ex, ey + 150 * s, 160 * s * (0.5 + g), '62,230,255', 0.35 * g); ctx.restore(); };
 // torre de telefonía lejana
 const torre = (ctx, x, y, h, t, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = '#8b97ab'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - h * 0.18, y); ctx.lineTo(x, y - h); ctx.lineTo(x + h * 0.18, y); ctx.moveTo(x - h * 0.12, y - h * 0.33); ctx.lineTo(x + h * 0.12, y - h * 0.33); ctx.moveTo(x - h * 0.07, y - h * 0.66); ctx.lineTo(x + h * 0.07, y - h * 0.66); ctx.stroke(); ctx.fillStyle = RD; ctx.beginPath(); ctx.arc(x, y - h, 9, 0, TAU); ctx.fill(); P.glow(ctx, x, y - h, 40, '255,77,94', 0.5 * (0.5 + 0.5 * Math.sin(t * 4))); ctx.restore(); };
 // ondas de radio
 const ondas = (ctx, x, y, t, o = {}) => { const n = o.n || 4, R0 = o.r0 || 60, Rm = o.rm || 420; ctx.save(); for (let k = 0; k < n; k++) { const q = (t * (o.vel || 0.8) + k / n) % 1; ctx.strokeStyle = `rgba(62,230,255,${(1 - q) * (o.a ?? 0.7)})`; ctx.lineWidth = (o.lw || 6) * (1 - q * 0.5); ctx.beginPath(); if (o.arco) ctx.arc(x, y, R0 + q * (Rm - R0), o.arco[0], o.arco[1]); else ctx.arc(x, y, R0 + q * (Rm - R0), 0, TAU); ctx.stroke(); } ctx.restore(); };

 // =====================================================================================================
 // ESCENAS
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO ----------
 B.push({ t0: 0, t1: B0.b1, in: { type: 'cut' }, draw(ctx, t) {
  fondo(ctx, t);
  if (GANCHO === 'A') {
   // panel de ajustes: el dedo toca el avión, entra el cable y la batería aparece con «?»
   const tap = sm(0.7, 0.85, t), plug = R(1.2, 1.6, t);
   celular(ctx, 540, 1000, 560, t, { bat: 0.3, avion: tap > 0.5, dibuja: (c, sw, sh) => {
    const tiles = [['wifi', 0], ['avion', 1], ['linterna', 0], ['luna', 0]], tw = (sw - 90) / 2; tiles.forEach(([n, k], i) => { const cx = -sw / 2 + 30 + tw / 2 + (i % 2) * (tw + 30), cy = -sh / 2 + 170 + Math.floor(i / 2) * 200, on = k && tap > 0.5; c.fillStyle = on ? GO : '#1f2a3a'; c.beginPath(); c.roundRect(cx - tw / 2, cy - 75, tw, 150, 30); c.fill();
     if (n === 'wifi') icWifi(c, cx, cy - 22, 90); else if (n === 'avion') P.icon(c, 'avion', cx, cy, 90, { mode: 'flat', col: on ? INK : '#e6edf5' }); else P.icon(c, n === 'linterna' ? 'bombilla' : 'luna', cx, cy, 80, { mode: 'flat', col: '#e6edf5' }); });
    const q = sm(1.6, 1.9, t); if (q > 0) { c.save(); c.globalAlpha *= q; c.strokeStyle = '#cfd8e3'; c.lineWidth = 10; c.strokeRect(-150, 300, 240, 110); c.fillStyle = '#5fd38d'; c.fillRect(-144, 306, 72, 98); c.fillStyle = '#cfd8e3'; c.fillRect(90, 330, 16, 50); txt(c, '?', 180, 355, 140, GO, { w: 900, f: 'Fredoka' }); c.restore(); } } });
   // dedo
   const fx = lerp(860, 668, R(0.1, 0.75, t)), fy = lerp(1300, 610, R(0.1, 0.75, t)) + tap * 10; P.mano(ctx, fx, fy, 70, { ang: -0.45 }); if (t > 0.75 && t < 1.1) P.glow(ctx, 658, 636, 120, '255,200,69', 0.6 * (1 - (t - 0.75) / 0.35));
   // cable que entra por abajo con chispa
   const cyy = lerp(1800, 1580, plug); ctx.strokeStyle = '#e9edf3'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(540, HH); ctx.lineTo(540, cyy); ctx.stroke(); ctx.fillStyle = '#c9d1dc'; ctx.fillRect(522, cyy - 50, 36, 50); if (plug > 0.95 && t < 2.2) P.glow(ctx, 540, 1578, 90, '62,230,255', 0.8 * (1 - (t - 1.6) / 0.6));
  } else if (GANCHO === 'B') {
   // el icono del avión brilla sobre el celular cargando; la cámara se acerca y aparece una trampilla en el icono
   const z = 1 + 0.55 * E.inOut(win(t, 0.2, Math.max(1.4, Tk.g0e - 0.3))), op = sm(Tk.g0e - 0.9, Tk.g0e - 0.4, t);
   ctx.save(); ctx.translate(540, 980); ctx.scale(z, z); ctx.translate(-540, -980);
   celular(ctx, 540, 1080, 400, t, { bat: 0.5 + 0.1 * Math.sin(t), pantalla: '#0b1a2a' }); ctx.strokeStyle = '#e9edf3'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(540, 1490); ctx.lineTo(540, HH); ctx.stroke();
   P.glow(ctx, 540, 980, 260, '255,200,69', 0.5 + 0.2 * Math.sin(t * 6)); P.icon(ctx, 'avion', 540, 980, 300, { mode: 'flat', col: GO });
   if (op > 0) { ctx.save(); ctx.translate(575, 1000); const Rg = H.rng(23); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let k = 0; k < 9; k++) { const ang = (k / 9) * TAU + Rg() * 0.5, L = (90 + Rg() * 120) * op; let px = 0, py = 0; ctx.beginPath(); ctx.moveTo(0, 0); for (let q = 1; q <= 4; q++) { px = Math.cos(ang + (Rg() - 0.5) * 0.5) * L * q / 4; py = Math.sin(ang + (Rg() - 0.5) * 0.5) * L * q / 4; ctx.lineTo(px, py); }
     ctx.strokeStyle = 'rgba(20,14,0,0.85)'; ctx.lineWidth = 7; ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2.5; ctx.stroke(); }
    for (let r = 1; r <= 2; r++) { ctx.beginPath(); for (let k = 0; k <= 12; k++) { const a = k / 12 * TAU, rr = (36 * r + Rg() * 14) * op; k ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2; ctx.stroke(); }
    P.glow(ctx, 0, 0, 90 * op, '255,255,255', 0.5 * op); for (let k = 0; k < 6; k++) { const a = Rg() * TAU, d = (60 + Rg() * 140) * cl((t - (Tk.g0e - 0.7)) / 0.5); ctx.fillStyle = `rgba(255,220,120,${0.9 * (1 - cl((t - (Tk.g0e - 0.7)) / 0.8))})`; ctx.beginPath(); ctx.moveTo(Math.cos(a) * d, Math.sin(a) * d); ctx.lineTo(Math.cos(a) * d + 10, Math.sin(a) * d + 16); ctx.lineTo(Math.cos(a) * d - 8, Math.sin(a) * d + 12); ctx.closePath(); ctx.fill(); }
    ctx.restore(); }
   ctx.restore();
  } else {
   // de noche: el celular boca abajo en la mesa de noche lanza ondas buscando una torre lejana
   const g = ctx.createLinearGradient(0, 0, 0, 1200); g.addColorStop(0, '#05070d'); g.addColorStop(1, '#101828'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 1200); for (let k = 0; k < 60; k++) { const R2 = H.rng(k + 3); ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.5 * R2()})`; ctx.fillRect(R2() * W, R2() * 1000, 2, 2); }
   torre(ctx, 900, 1100, 260, t, 0.9); ctx.fillStyle = '#3b2b22'; ctx.fillRect(140, 1290, 800, 40); ctx.fillStyle = '#2a1f19'; ctx.fillRect(170, 1330, 30, 300); ctx.fillRect(880, 1330, 30, 300);
   { const pw = 620, x0 = 540 - pw / 2, yT = 1170, yB = 1285, sk = 70;   // celular tumbado, en perspectiva, pantalla hacia arriba
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(540, 1290, pw * 0.55, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2a303c'; ctx.beginPath(); ctx.moveTo(x0, yB); ctx.lineTo(x0 + pw, yB); ctx.lineTo(x0 + pw, yB + 18); ctx.lineTo(x0, yB + 18); ctx.closePath(); ctx.fill();   // canto
    const quad = (m, f) => { ctx.beginPath(); ctx.moveTo(x0 + sk + m, yT + m * 0.4); ctx.lineTo(x0 + pw - sk - m, yT + m * 0.4); ctx.lineTo(x0 + pw - m, yB - m * 0.4); ctx.lineTo(x0 + m, yB - m * 0.4); ctx.closePath(); ctx.fillStyle = f; ctx.fill(); };
    quad(0, '#1b2029'); const pul = 0.6 + 0.4 * Math.sin(t * 3); quad(10, '#0b1622'); ctx.save(); ctx.strokeStyle = `rgba(62,230,255,${0.7 * pul})`; ctx.lineWidth = 5; ctx.shadowColor = '#3ee6ff'; ctx.shadowBlur = 24; ctx.beginPath(); ctx.moveTo(x0 + sk + 10, yT + 4); ctx.lineTo(x0 + pw - sk - 10, yT + 4); ctx.lineTo(x0 + pw - 10, yB - 4); ctx.lineTo(x0 + 10, yB - 4); ctx.closePath(); ctx.stroke(); ctx.restore();
    ctx.fillStyle = `rgba(62,230,255,${0.25 * pul})`; ctx.beginPath(); ctx.roundRect(470, yT + 40, 140, 26, 10); ctx.fill(); ctx.fillStyle = '#05080c'; ctx.beginPath(); ctx.roundRect(510, yT + 8, 60, 10, 5); ctx.fill(); }
   ondas(ctx, 540, 1200, t, { n: 5, r0: 110, rm: 680, vel: 1.1, arco: [Math.PI * 1.05, Math.PI * 1.95] });
   const nb = 1 + Math.floor((Math.sin(t * 5) * 0.5 + 0.5) * 3); icRed(ctx, 540, 900, 140, 1, nb);
  }
 }, sfx(k) {
  if (GANCHO === 'A') { FX.toque(k, 0.78); k.play('blip', 0.82, { f: 900, gain: 0.3 }); k.play('click', 1.55, { gain: 0.4 }); FX.chispa(k, 1.6, 0.3); FX.aparece(k, 1.7, 520); }
  else if (GANCHO === 'B') { k.play('riser', 0.2, { dur: 1.2, gain: 0.25, minor: true }); FX.rotura ? FX.rotura(k, Tk.g0e - 0.7) : k.play('error', Tk.g0e - 0.7, { f: 'A3', gain: 0.3 }); k.play('thud', Tk.g0e - 0.68, { f: 90, gain: 0.35 }); }
  else { for (let i = 0; i < 4; i++) k.play('blip', 0.1 + i * 0.5, { f: 700 + i * 80, gain: 0.18 }); FX.senal ? FX.senal(k, 0.2) : null; }
 } });

 // ---------- 2 · ¿Mito o verdad? ----------
 B.push({ t0: B0.b1, t1: Tk.balde - 0.35, in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); const a = R(S(1), S(1) + 0.4, t), flip = Math.sin(t * 6) > 0;
  P.glow(ctx, 480, 1000, 480, '255,200,69', 0.25 * a); celular(ctx, 480, 1040, 420, t, { bat: 0.4, dibuja: (c) => { c.save(); c.globalAlpha *= a; txt(c, '?', 0, 30, 380, GO, { w: 900, f: 'Fredoka' }); c.restore(); } });
  ctx.save(); ctx.globalAlpha *= a; for (const [lab, col, x0, on] of [['MITO', RD, 150, flip], ['VERDAD', '#22d27a', 810, !flip]]) { ctx.globalAlpha = a * (on ? 1 : 0.35); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x0 - 120, 700, 240, 90, 20); ctx.fill(); txt(ctx, lab, x0, 747, 46, '#fff', { w: 900, f: 'Fredoka' }); } ctx.restore();
  P.serieTitulo(ctx, t, S(1), Tk.balde - 0.4, { y: 1450 - 40 });
 }, sfx(k) { FX.aparece(k, S(1), 700); for (let i = 0; i < 4; i++) k.play('tick', S(1) + 0.2 + i * 0.26, { gain: 0.2 }); } });

 // ---------- 3 · la batería es un balde; el cargador, la manguera ----------
 B.push({ t0: Tk.balde - 0.35, t1: B0.b4, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); mesa(ctx); const ap = R(Tk.balde - 0.3, Tk.balde + 0.3, t), mg = sm(Tk.manguera - 0.2, Tk.manguera + 0.2, t), lvl = 0.25 + 0.35 * win(t, Tk.manguera, B0.b4 + 0.5);
  const morph = 1 - sm(Tk.balde - 0.35, Tk.balde, t); if (morph > 0) { ctx.save(); ctx.globalAlpha *= morph; celular(ctx, 600, 1060, 380, t, { bat: 0.25 }); ctx.restore(); }
  ctx.save(); ctx.globalAlpha *= ap; const b = balde(ctx, 600, 1420, 1.0 * (0.85 + 0.15 * ap), t, { nivel: lvl, agujeros: [] }); ctx.restore();
  if (mg > 0) { cargador(ctx, 160, 760, 1.1, t); manguera(ctx, 600, b.top, 1, t, mg, { sx: 170, sy: 680 }); }
 }, sfx(k) { FX.aparece(k, Tk.balde - 0.2, 480); k.noise(Tk.manguera, { dur: B0.b4 - Tk.manguera + 0.3, color: 'pink', filter: 'bandpass', f: 1200, q: 0.8, gain: 0.04, a: 0.2 }); } });

 // ---------- 4 · el balde tiene agujeros: red móvil, wifi y bluetooth ----------
 const aguj = (t, o = {}) => [{ a: R(Tk.red - 0.1, Tk.red + 0.2, t), ...o }, { a: R(Tk.wifi - 0.1, Tk.wifi + 0.2, t), ...o }, { a: R(Tk.bt - 0.1, Tk.bt + 0.2, t), ...o }];
 B.push({ t0: B0.b4, t1: B0.b6, in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  fondo(ctx, t); mesa(ctx); const lvl = 0.6 + 0.05 * Math.sin(t);
  cargador(ctx, 160, 760, 1.1, t); const b = balde(ctx, 600, 1420, 1.0, t, { nivel: lvl, agujeros: aguj(t) }); manguera(ctx, 600, b.top, 1, t, 1, { sx: 170, sy: 680 });
  P.tag(ctx, 'GASTAN ENERGÍA', 600, 640, t, Tk.gastan - 0.1, B0.b6, { mono: true, col: RD });
 }, sfx(k) { for (const tt of [Tk.red, Tk.wifi, Tk.bt]) { k.play('pop', tt, { f: 300, gain: 0.4 }); k.noise(tt + 0.05, { dur: 0.5, color: 'white', filter: 'bandpass', f: 2500, q: 1, gain: 0.03, a: 0.05 }); } FX.etiqueta(k, Tk.gastan - 0.1); } });

 // ---------- 5 · el modo avión… tapa esos agujeros ----------
 B.push({ t0: B0.b6, t1: B0.b8, in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  fondo(ctx, t); mesa(ctx); cargador(ctx, 160, 760, 1.1, t);
  const tp = (i) => R(Tk.tapa + i * 0.22, Tk.tapa + 0.3 + i * 0.22, t), ai = sm(Tk.avion - 0.1, Tk.avion + 0.3, t) * (1 - sm(Tk.tapa - 0.1, Tk.tapa + 0.2, t));
  const b = balde(ctx, 600, 1420, 1.0, t, { nivel: 0.62 + 0.08 * win(t, Tk.tapa, B0.b8), agujeros: [0, 1, 2].map((i) => ({ a: 1, tapon: tp(i) })) }); manguera(ctx, 600, b.top, 1, t, 1, { sx: 170, sy: 680 });
  if (ai > 0) { P.glow(ctx, 760, 760, 200, '255,200,69', 0.5 * ai); P.icon(ctx, 'avion', 760, 760, 220 * ai, { mode: 'flat', col: GO }); }
  P.tag(ctx, 'MODO AVIÓN', 760, 640, t, Tk.avion, B0.b8, { mono: true, col: GO });
 }, sfx(k) { FX.aparece(k, Tk.avion, 620); FX.etiqueta(k, Tk.avion); for (let i = 0; i < 3; i++) k.play('click', Tk.tapa + 0.3 + i * 0.22, { gain: 0.45 }); } });

 // ---------- 6 · con poca señal el agujero crece: el celular grita para que la antena lo escuche ----------
 B.push({ t0: B0.b8, t1: B0.b10, in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); mesa(ctx); const cr = 1 + 1.6 * E.out(win(t, Tk.crece - 0.2, Tk.crece + 0.6)), gr = sm(Tk.grita - 0.2, Tk.grita + 0.2, t);
  torre(ctx, 930, 900, 230, t, 1); icRed(ctx, 930, 560 + 60, 90, 1, 1);
  const b = balde(ctx, 470, 1420, 0.92, t, { nivel: 0.55, agujeros: [{ a: 1, r: cr, flujo: 1, icS: 1.4 }, { a: 0.35, icono: false }, { a: 0.35, icono: false }] });
  if (gr > 0) { ondas(ctx, 470, b.top - 40, t, { n: 4, r0: 40, rm: 520, vel: 1.4, a: 0.8 * gr, lw: 10, arco: [-Math.PI * 0.45, Math.PI * 0.05] }); }
  P.tag(ctx, 'POCA SEÑAL', 930, 1000 - 40 + 60, t, Tk.senal - 0.1, B0.b10, { mono: true, col: RD });
 }, sfx(k) { FX.etiqueta(k, Tk.senal - 0.1); k.noise(Tk.crece, { dur: 0.8, color: 'white', filter: 'bandpass', f: [[0, 1500], [0.8, 3500]], q: 1, gain: 0.05, a: 0.1 }); for (let i = 0; i < 4; i++) k.play('blip', Tk.grita + i * 0.25, { f: 900 + i * 120, gain: 0.25 }); } });

 // ---------- 7 · ¿carga más rápido? Sí… pero los agujeros son pequeños y la manguera es enorme ----------
 B.push({ t0: B0.b10, t1: B0.b13, in: { type: 'zoom', d: 0.4, x: 540, y: 1000 }, draw(ctx, t) {
  fondo(ctx, t); mesa(ctx); const si = sm(Tk.si - 0.1, Tk.si + 0.2, t) * (1 - sm(Tk.si + 0.8, Tk.si + 1.1, t)), big = E.inOut(win(t, Tk.pequenos - 0.3, Tk.enorme + 0.2));
  cargador(ctx, 150, 760, 1.1 + 0.3 * big, t, { rapido: big > 0.5 }); const b = balde(ctx, 620, 1420, 0.95, t, { nivel: 0.55 + 0.2 * win(t, Tk.enorme, B0.b13), agujeros: [{ a: 1, r: 1 - 0.4 * big }, { a: 1, r: 1 - 0.4 * big }, { a: 1, r: 1 - 0.4 * big }] });
  manguera(ctx, 620, b.top, 0.95, t, 1, { sx: 170, sy: 680, ancho: 1 + 1.4 * big });
  if (si > 0) { P.glow(ctx, 840, 760, 160, '34,210,122', 0.6 * si); P.icon(ctx, 'check', 840, 760, 200 * si, { mode: 'flat', col: '#22d27a', col2: '#fff' }); }
  P.tag(ctx, 'MANGUERA ENORME', 600, 640, t, Tk.enorme - 0.2, B0.b13, { mono: true, col: CY });
 }, sfx(k) { FX.correcto(k, Tk.si); k.play('whoosh', Tk.pequenos - 0.3, { dur: 1.0, gain: 0.3, minor: true }); FX.etiqueta(k, Tk.enorme - 0.2); } });

 // ---------- 8 · en las pruebas publicadas: solo unos minutos, en cargas de más de una hora ----------
 B.push({ t0: B0.b13, t1: Tk.veredicto - 0.35, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const u = E.inOut(win(t, Tk.pruebas, Tk.hora + 0.2)), gap = sm(Tk.minutos - 0.3, Tk.minutos + 0.1, t);
  // dos cargas en paralelo: con modo avión (arriba) y normal (abajo); la de arriba llega un poco antes
  const rows = [['avion', 1.0, GO], ['red', 0.94, CY]], X0 = 160, X1 = 900;
  rows.forEach(([ic, sp, col], i) => { const y = 860 + i * 260, f = cl(u * sp / 0.98); ctx.fillStyle = '#1b2230'; ctx.beginPath(); ctx.roundRect(X0, y - 60, X1 - X0, 120, 24); ctx.fill(); ctx.strokeStyle = '#4a5670'; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(X0 + 8, y - 52, (X1 - X0 - 16) * f, 104, 18); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.roundRect(X0 + 8, y - 52, (X1 - X0 - 16) * f, 104, 18); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.22)'; for (let sx = X0 - 120 + (t * 90) % 60; sx < X1; sx += 60) { ctx.beginPath(); ctx.moveTo(sx, y + 52); ctx.lineTo(sx + 30, y + 52); ctx.lineTo(sx + 130, y - 52); ctx.lineTo(sx + 100, y - 52); ctx.closePath(); ctx.fill(); } ctx.restore(); ctx.fillStyle = '#cfd8e3'; ctx.fillRect(X1 + 6, y - 24, 16, 48);
   if (ic === 'avion') P.icon(ctx, 'avion', X0 - 70, y, 80, { mode: 'flat', col: GO }); else icRed(ctx, X0 - 70, y - 10, 80, 1, 4); });
  if (gap > 0) { const xA = X0 + 8 + (X1 - X0 - 16), xN = X0 + 8 + (X1 - X0 - 16) * cl(0.94 / 0.98); ctx.save(); ctx.globalAlpha *= gap; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(xN, 780); ctx.lineTo(xN, 1210); ctx.moveTo(xA, 780); ctx.lineTo(xA, 1210); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
  P.tag(ctx, 'UNOS MINUTOS', 520, 1310, t, Tk.minutos - 0.1, Tk.veredicto - 0.35, { mono: true, col: '#fff', px: 72 }); P.tag(ctx, '+1 HORA', 520, 690, t, Tk.pruebas + 0.4, Tk.veredicto - 0.35, { mono: true, col: CY, px: 72 });
 }, sfx(k) { FX.aparece(k, Tk.pruebas, 520); FX.tictac(k, Tk.pruebas + 0.3, 6, 0.4); FX.etiqueta(k, Tk.minutos - 0.1); FX.etiqueta(k, Tk.pruebas + 0.4); } });

 // ---------- 9 · VEREDICTO: A MEDIAS (sello de la serie) ----------
 B.push({ t0: Tk.veredicto - 0.35, t1: B0.b16, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); mesa(ctx, 1440); const b = balde(ctx, 540, 1440, 0.8, t, { nivel: 0.66, agujeros: [{ a: 0.8, icono: false, flujo: 0.5 }, { a: 0.8, icono: false, flujo: 0.5 }, { a: 0.8, icono: false, flujo: 0.5 }] });
  ctx.fillStyle = `rgba(5,8,12,${0.55 * sm(Tk.veredicto - 0.3, Tk.veredicto, t)})`; ctx.fillRect(0, 0, W, HH);
  txt(ctx, 'VEREDICTO', 480, 760, 64, '#cfd8e3', { w: 900, f: 'Fredoka', ls: 8 });
  P.veredicto(ctx, t, tV, 'A MEDIAS', { y: 1020 });
 }, sfx(k) { k.play('riser', Tk.veredicto - 0.3, { dur: tV - Tk.veredicto + 0.2, gain: 0.25, minor: true }); FX.veredicto(k, tV, 'A MEDIAS'); } });

 // ---------- 10 · Puede notarse un poco más con mala señal o cargador lento; con uno rápido, casi nada ----------
 B.push({ t0: B0.b16, t1: B0.b18, in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); mesa(ctx); const der = sm(Tk.rapido - 0.3, Tk.rapido, t);
  // izquierda: manguera fina + agujero grande (mala señal) → la fuga pesa más
  const bL = balde(ctx, 280, 1420, 0.62, t, { nivel: 0.45, agujeros: [{ a: 1, r: 1.8, icS: 1.2 }, { a: 1, icono: false }, { a: 1, icono: false }] }); manguera(ctx, 280, bL.top, 0.62, t, 1, { sx: 60, sy: 760, ancho: 0.3 });
  // derecha: manguera enorme → los agujeros casi no se notan
  ctx.save(); const bR = balde(ctx, 800, 1420, 0.62, t, { nivel: 0.8, agujeros: [{ a: 1, icono: false, r: 0.7 }, { a: 1, icono: false, r: 0.7 }, { a: 1, icono: false, r: 0.7 }] }); manguera(ctx, 800, bR.top, 0.62, t, 1, { sx: 1040, sy: 760, ancho: 2.2 }); ctx.restore();
  P.tag(ctx, 'CARGADOR LENTO', 280, 680, t, Tk.lento - 0.3, B0.b18, { mono: true, col: RD }); P.tag(ctx, 'CARGADOR RÁPIDO', 780, 680, t, Tk.rapido - 0.1, B0.b18, { mono: true, col: CY });
 }, sfx(k) { FX.etiqueta(k, Tk.lento - 0.3); FX.etiqueta(k, Tk.rapido - 0.1); } });

 // ---------- 11 · CIERRE: «Envíaselo a ese amigo…» ----------
 B.push({ t0: B0.b18, t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); P.ctaShare(ctx, t, B0.b18 + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { P.fondo(cc, t); mesa(cc); balde(cc, 540, 1420, 0.9, t, { nivel: 0.6, agujeros: [{ a: 1 }, { a: 1 }, { a: 1 }] }); P.veredicto(cc, t, -10, 'A MEDIAS', { y: 760, w: 760 }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], mano: true });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, B0.b18 + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'tecno', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['avión', 'trampa.', 'antena', 'verdad?', 'balde,', 'manguera', 'agujeros:', 'energía', 'tapa', 'crece:', 'grita', 'rápido?', 'enorme.', 'minutos,', 'hora.', 'medias.', 'lento.', 'nada.', 'amigo'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 600, gain: 0.006, a: 0.05, hold: DURATION - 2.2 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 104, gain: 0.55, chords: [['D2', 'F2', 'A2', 'D3'], ['A#1', 'D2', 'F2', 'A#2'], ['F2', 'A2', 'C3', 'F3'], ['C2', 'E2', 'G2', 'C3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
