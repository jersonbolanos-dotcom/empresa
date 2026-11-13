// =====================================================================================================
// episodio.js — «¿Mito o verdad?» Cap. 4 · ¿Hay que dejar que la batería llegue a 0 %? · PLANTILLA ASOMBROTECA v1.33 · estilo «tecno»
// Serie: serie_mito_verdad (P.veredicto + FX.veredicto). Veredicto: MITO. Mano: P.mano (v1.33, de una sola pieza).
// Voz: ElevenLabs Eleven v4, Dan, UNA toma con 3 ganchos. El gancho B ocupa 2 tramos y A y C uno, así que el cuerpo empieza en el tramo
// k0 = (tramos de la variante) − 18; todos los tiempos del cuerpo se anclan con wb(i, 'palabra') sobre el tramo k0 + i.
// Metáfora sostenida: la batería de litio es una GOMA ELÁSTICA (en el medio no se daña; en los extremos se agrieta).
// Celular, cargador y baterías genéricos dibujados, sin marcas ni logos («Ni-Cd» y «Li-ion» son nombres de química, no marcas).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, B0, DURATION, txt } = K;
 const GANCHO = window.GANCHO || 'A';
 const k0 = A.segments.length - 18, S = (i) => A.segments[i].s, Se = (i) => A.segments[i].e;
 const Sb = (i) => S(k0 + i), wb = (i, w, n = 0) => wt(k0 + i, w, n), Bb = (i) => B0['b' + (k0 + i)];
 const Tk = {
  g0e: Se(k0 - 1), g1: k0 > 1 ? S(1) : 0,
  mito0: Sb(0), niquel: wb(1, 'níquel:'), vaciabas: wb(2, 'vaciabas,'), olvidaban: wb(2, '«olvidaban»'), memoria: wb(3, 'memoria.'),
  litio: wb(4, 'litio…'), noTiene: wb(5, 'tiene'), goma: wb(6, 'goma'), medio: wb(7, 'medio'), extremos: wb(8, 'extremos,'), otra: wb(8, 'vez.'),
  apaga: wb(9, 'apaga'), reserva: wb(10, 'reserva'), cero: wb(11, 'cero'), desgasta: wb(12, 'desgasta'),
  veredicto: Sb(13), mito: wb(14, 'mito.'), cargala: Sb(15), limitar: wb(16, 'limitar'), ochenta: wb(16, '80'), apple: wb(16, 'Apple'), mejor: wb(16, 'mejor'), envia: Sb(17),
 };
 const tV = Tk.mito - 0.05;
 const CY = '#3ee6ff', GO = '#ffc845', RD = '#ff4d5e', GR = '#22d27a', INK = '#0d1117';
 const R = (a, b, t) => E.out(win(t, a, b));

 // ---------- dibujo compartido con el cap. 3 (misma serie, mismo aspecto) ----------
 const fondo = (ctx, t) => P.fondo(ctx, t);
 const mesa = (ctx, y = 1420) => { const g = ctx.createLinearGradient(0, y, 0, HH); g.addColorStop(0, '#2a3140'); g.addColorStop(1, '#11151d'); ctx.fillStyle = g; ctx.fillRect(0, y, W, HH - y); ctx.fillStyle = 'rgba(62,230,255,0.25)'; ctx.fillRect(0, y, W, 3); };
 // celular genérico (frente): pantalla con barra de estado y batería
 const celular = (ctx, x, y, w, t, o = {}) => { const h = w * 2.05; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 16, w, h, w * 0.14); ctx.fill();
  ctx.fillStyle = '#1b2029'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * 0.14); ctx.fill(); ctx.strokeStyle = '#5a6680'; ctx.lineWidth = 6; ctx.stroke();
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

 // cargador como objeto que se sujeta (centrado en 0, 0) y conector del cable
 const cargadorObj = (c) => { c.fillStyle = '#e9edf3'; c.beginPath(); c.roundRect(-110, -120, 200, 240, 26); c.fill(); c.fillStyle = '#c9d1dc'; c.fillRect(-110, 40, 200, 14); c.fillStyle = '#9aa3b2'; c.fillRect(-60, -170, 18, 54); c.fillRect(-10, -170, 18, 54); };
 const conector = (c) => { c.fillStyle = '#e9edf3'; c.beginPath(); c.roundRect(-60, -110, 120, 220, 22); c.fill(); c.fillStyle = '#9aa3b2'; c.fillRect(-26, -150, 52, 44); };
 const cable = (ctx, x, y, t, a) => { ctx.strokeStyle = '#e9edf3'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 40, y + 200, x - 60, HH + 40); ctx.stroke(); };

 // ---------- dibujo propio del capítulo ----------
 // icono grande de batería con nivel (0…1), color por nivel
 const bateria = (ctx, x, y, w, h, nivel, o = {}) => { const lv = cl(nivel), col = o.col || (lv <= 0.05 ? RD : lv < 0.2 ? '#ff9f43' : GR); ctx.save(); ctx.lineWidth = w * 0.045; ctx.strokeStyle = o.borde || '#cfd8e3'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h * 0.18); ctx.stroke(); ctx.fillStyle = o.borde || '#cfd8e3'; ctx.beginPath(); ctx.roundRect(x + w / 2 + w * 0.02, y - h * 0.2, w * 0.05, h * 0.4, 6); ctx.fill();
  const m = w * 0.06; if (lv > 0) { ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.roundRect(x - w / 2 + m, y - h / 2 + m, (w - 2 * m) * lv, h - 2 * m, h * 0.1); ctx.fill(); ctx.shadowBlur = 0; }
  if (o.pct != null) txt(ctx, o.pct, x, y + h * 0.95, h * 0.55, col, { w: 900, f: 'Fredoka' }); ctx.restore(); };
 // pila de níquel (cilíndrica, genérica) con zona «olvidada» (memoria) en gris
 const pilaNiCd = (ctx, x, y, w, h, t, o = {}) => { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + h / 2 + 8, w * 0.55, 14, 0, 0, TAU); ctx.fill();
  const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#2f6b3f'); g.addColorStop(0.45, '#5fb36f'); g.addColorStop(1, '#244f30'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, w * 0.12); ctx.fill();
  ctx.fillStyle = '#c9d1dc'; ctx.beginPath(); ctx.roundRect(x - w * 0.16, y - h / 2 - h * 0.05, w * 0.32, h * 0.06, 6); ctx.fill();
  txt(ctx, 'Ni-Cd', x, y - h * 0.32, w * 0.24, '#eafbe9', { w: 900, f: 'Fredoka' });
  // medidor interior: carga (cian) y memoria (gris con cristales)
  const mx = x - w * 0.28, mw = w * 0.56, my0 = y - h * 0.18, mh = h * 0.6, car = cl(o.carga ?? 0.6), mem = cl(o.memoria ?? 0);
  ctx.fillStyle = 'rgba(5,10,15,0.6)'; ctx.beginPath(); ctx.roundRect(mx, my0, mw, mh, 10); ctx.fill();
  ctx.fillStyle = CY; ctx.fillRect(mx + 6, my0 + mh * (1 - car), mw - 12, mh * car - 6);
  if (mem > 0) { const yT = my0 + 6, yB = my0 + mh * (1 - Math.max(car, 0.55)), hh = (yB - yT) * mem; ctx.fillStyle = 'rgba(150,160,175,0.85)'; ctx.fillRect(mx + 6, yB - hh, mw - 12, hh); const Rr = H.rng(7); ctx.strokeStyle = 'rgba(230,240,255,0.7)'; ctx.lineWidth = 3; for (let k = 0; k < 10 * mem; k++) { const cx = mx + 14 + Rr() * (mw - 28), cy = yB - hh + 8 + Rr() * Math.max(4, hh - 16), r = 6 + Rr() * 8; ctx.beginPath(); for (let q = 0; q < 6; q++) { const a = q * TAU / 6; q ? ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } ctx.closePath(); ctx.stroke(); } }
  ctx.restore(); };
 // celda de litio (bolsa plana, genérica)
 const celdaLi = (ctx, x, y, w, h, t, o = {}) => { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + h / 2 + 8, w * 0.55, 14, 0, 0, TAU); ctx.fill();
  const g = ctx.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2); g.addColorStop(0, '#c9d6e6'); g.addColorStop(0.5, '#8fa3bd'); g.addColorStop(1, '#5d7090'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 26); ctx.fill();
  ctx.fillStyle = '#d9b36a'; ctx.fillRect(x - w * 0.22, y - h / 2 - 26, w * 0.12, 30); ctx.fillStyle = '#b9c2cc'; ctx.fillRect(x + w * 0.1, y - h / 2 - 26, w * 0.12, 30);
  txt(ctx, 'Li-ion', x, y - h * 0.28, w * 0.17, INK, { w: 900, f: 'Fredoka' }); const lv = cl(o.nivel ?? 0.6); ctx.fillStyle = 'rgba(5,10,15,0.55)'; ctx.beginPath(); ctx.roundRect(x - w * 0.36, y - h * 0.08, w * 0.72, h * 0.42, 14); ctx.fill(); ctx.fillStyle = CY; ctx.beginPath(); ctx.roundRect(x - w * 0.34, y - h * 0.06, w * 0.68 * lv, h * 0.38, 10); ctx.fill(); ctx.restore(); };
 // goma elástica entre dos clavijas sobre una tabla: e = estiramiento (0 = floja, 0,5 = medio, 1 = al máximo); grietas 0…1
 const goma = (ctx, cx, y, t, e, gr = 0, o = {}) => { const span = lerp(260, 900, cl(e)), x0 = cx - span / 2, x1 = cx + span / 2, sag = lerp(110, 0, cl(e * 1.6)), th = lerp(46, 18, cl(e));
  ctx.save(); ctx.fillStyle = '#3b2b22'; ctx.beginPath(); ctx.roundRect(cx - 520, y + 70, 1040, 46, 12); ctx.fill();
  for (const px of [x0, x1]) { ctx.fillStyle = '#9aa3b2'; ctx.fillRect(px - 14, y - 20, 28, 110); ctx.fillStyle = '#cfd8e3'; ctx.beginPath(); ctx.arc(px, y - 20, 22, 0, TAU); ctx.fill(); }
  const col = o.col || (e > 0.85 || e < 0.12 ? RD : e > 0.7 || e < 0.25 ? GO : GR); ctx.strokeStyle = col; ctx.lineWidth = th; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo(cx, y + sag * 2, x1, y); ctx.stroke(); ctx.shadowBlur = 0;
  if (gr > 0) { const Rr = H.rng(31); ctx.strokeStyle = 'rgba(20,10,10,0.85)'; ctx.lineWidth = 4; for (let k = 0; k < Math.floor(14 * gr); k++) { const q = 0.1 + Rr() * 0.8, px = lerp(x0, x1, q), py = y + sag * 2 * 4 * q * (1 - q) / 2; ctx.beginPath(); ctx.moveTo(px - 6, py - th * 0.45); ctx.lineTo(px + 4, py); ctx.lineTo(px - 3, py + th * 0.45); ctx.stroke(); } }
  ctx.restore(); return { x0, x1 }; };
 // teléfono inalámbrico antiguo genérico (años noventa)
 const telViejo = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 300, 160, 16, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2b2f36'; ctx.fillRect(40, -400, 26, 160); ctx.beginPath(); ctx.arc(53, -400, 18, 0, TAU); ctx.fill();
  ctx.fillStyle = '#3a3f48'; ctx.beginPath(); ctx.roundRect(-110, -260, 220, 560, 40); ctx.fill(); ctx.fillStyle = '#8fb08a'; ctx.fillRect(-80, -220, 160, 90); ctx.fillStyle = '#20301f'; ctx.font = '700 34px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.fillText('12:00', 0, -165);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { ctx.fillStyle = '#5a606b'; ctx.beginPath(); ctx.roundRect(-80 + c * 58, -100 + r * 62, 44, 44, 10); ctx.fill(); } ctx.restore(); };

 // v1.34 · ENCUADRE: cada escena se dibuja como un grupo que P.encuadrar escala y centra en la franja de escena (subtítulos arriba)
 const ENC = (ctx, caja, fn, o = {}) => P.encuadrar(ctx, caja, fn, Object.assign({ capY: 330, ancho: 0.85 }, o));
 // losa (mesa finita) sobre la que se apoyan los objetos del grupo (nada flota)
 const losa = (c, x0, x1, y) => { const g = c.createLinearGradient(0, y, 0, y + 70); g.addColorStop(0, '#2a3140'); g.addColorStop(1, '#151a23'); c.fillStyle = g; c.beginPath(); c.roundRect(x0, y, x1 - x0, 70, 14); c.fill(); c.fillStyle = 'rgba(62,230,255,0.35)'; c.fillRect(x0 + 10, y, x1 - x0 - 20, 3); };
 // batería vertical grande (corte): nivel 0…1 desde abajo; o.reserva = capa de reserva con candado (0…1); o.limite = raya del 80 % (0…1)
 const bateriaV = (c, x, y, w, h, nivel, o = {}) => { c.save(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(x, y + h / 2 + 6, w * 0.55, 14, 0, 0, TAU); c.fill();
  c.fillStyle = '#0b1622'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 34); c.fill(); c.strokeStyle = '#cfd8e3'; c.lineWidth = 14; c.stroke(); c.fillStyle = '#cfd8e3'; c.beginPath(); c.roundRect(x - w * 0.18, y - h / 2 - 30, w * 0.36, 24, 8); c.fill();
  const m = 22, ih = h - 2 * m, lv = cl(nivel), col = o.col || (lv < 0.1 ? RD : lv < 0.25 ? '#ff9f43' : GR);
  if (lv > 0) { c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 18; c.beginPath(); c.roundRect(x - w / 2 + m, y + h / 2 - m - ih * lv, w - 2 * m, ih * lv, 18); c.fill(); c.shadowBlur = 0; }
  if (o.reserva > 0) { c.globalAlpha *= o.reserva; const rh = ih * 0.16, g = c.createLinearGradient(0, y + h / 2 - m - rh, 0, y + h / 2 - m); g.addColorStop(0, 'rgba(62,230,255,0.95)'); g.addColorStop(1, 'rgba(20,110,170,0.95)'); c.fillStyle = g; c.beginPath(); c.roundRect(x - w / 2 + m, y + h / 2 - m - rh, w - 2 * m, rh, 16); c.fill(); P.glow(c, x, y + h / 2 - m - rh / 2, w * 0.7, '62,230,255', 0.45); P.icon(c, 'candado', x, y + h / 2 - m - rh / 2, rh * 0.75, { mode: 'flat', col: GO });
   c.strokeStyle = 'rgba(255,255,255,0.8)'; c.setLineDash([12, 10]); c.lineWidth = 5; c.beginPath(); c.moveTo(x - w / 2 + m, y + h / 2 - m - rh - 8); c.lineTo(x + w / 2 - m, y + h / 2 - m - rh - 8); c.stroke(); c.setLineDash([]); }
  c.restore(); if (o.limite > 0) { c.save(); c.globalAlpha *= o.limite; const yl = y + h / 2 - m - ih * 0.8; c.strokeStyle = GO; c.setLineDash([16, 10]); c.lineWidth = 7; c.beginPath(); c.moveTo(x - w / 2 - 20, yl); c.lineTo(x + w / 2 + 20, yl); c.stroke(); c.setLineDash([]); c.restore(); } };

 // =====================================================================================================
 // ESCENAS
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO ----------
 B.push({ t0: 0, t1: Bb(0), in: { type: 'cut' }, draw(ctx, t) {
  fondo(ctx, t);
  if (GANCHO === 'A') {
   // la batería baja 3 % → 1 %, la pantalla se apaga; al lado, una mano sostiene el cargador sin enchufarlo, esperando
   const fin = Math.max(1.6, Tk.g0e - 0.6), pct = Math.max(0, Math.round(lerp(3, 0, win(t, 0, fin)))), off = sm(fin, fin + 0.12, t);
   // (v1.34: sin mano; el cargador espera en la mesa, al lado, con el cable sin enchufar)
   ENC(ctx, [20, 440, 950, 1580], (g) => { losa(g, 0, 960, 1560);
    celular(g, 300, 1000, 540, t, { bat: pct / 100, pantalla: off > 0.5 ? '#000000' : '#1a0d10', dibuja: (c) => { if (off < 0.5) { bateria(c, 0, -40, 300, 140, pct / 100 + 0.01, { pct: pct + ' %' }); P.glow(c, 0, -40, 260, '255,77,94', 0.25 + 0.15 * Math.sin(t * 8)); } } });
    g.strokeStyle = '#e9edf3'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(705, 1548); g.quadraticCurveTo(560, 1572, 450, 1552); g.stroke(); g.fillStyle = '#e9edf3'; g.beginPath(); g.roundRect(405, 1532, 56, 30, 8); g.fill();
    cargador(g, 800, 1560 - 72 * 1.6, 1.6, t); });
  } else if (GANCHO === 'B') {
   // teléfono inalámbrico antiguo + pila Ni-Cd; el calendario salta de 1995 a 2026 y aparece el celular de hoy
   const sw = sm(Tk.g1 - 0.1, Tk.g1 + 0.4, t), y = Math.round(lerp(1995, 2026, E.inOut(win(t, Tk.g1, Tk.g0e - 0.1))));
   // (v1.34: el grupo —teléfono, pila y calendario sobre su mesa— se encuadra centrado en la franja de escena)
   const pz = 1 + 0.05 * E.out(win(t, 0, 2.5));
   ENC(ctx, [110, 500, 940, 1590], (g) => { g.translate(525, 1045); g.scale(pz, pz); g.translate(-525, -1045); losa(g, 70, 990, 1555);
    g.save(); g.globalAlpha *= 1 - sw * 0.85; telViejo(g, 300, 1555 - 300 * 1.45, 1.45, t); pilaNiCd(g, 770, 1555 - 228, 280, 440, t, { carga: 0.55, memoria: 0.6 }); g.restore();
    if (sw > 0) { g.save(); g.globalAlpha *= sw; celular(g, 330, 1555 - 492 - 8, 480, t, { bat: 0.6 }); g.restore(); }
    g.fillStyle = '#f4f2fb'; g.beginPath(); g.roundRect(640, 650, 280, 210, 22); g.fill(); g.fillStyle = RD; g.beginPath(); g.roundRect(640, 650, 280, 56, [22, 22, 0, 0]); g.fill(); txt(g, String(y), 780, 790, 96, INK, { w: 900, f: 'Fredoka' }); });
  } else {
   // icono de batería al 0 %; la cámara entra en la celda y queda una capa de carga brillando, con candado
   const z = E.inOut(win(t, 0.5, Math.max(1.6, Tk.g0e - 0.4)));
   if (z < 0.55) { ctx.save(); ctx.globalAlpha *= 1 - cl(z / 0.55); const pu = 1 + 0.035 * Math.sin(t * 7); P.glow(ctx, 480, 1000, 420, '255,77,94', 0.2 + 0.12 * Math.sin(t * 7)); ctx.translate(480, 1000); ctx.scale((1 + z * 2) * pu, (1 + z * 2) * pu); ctx.translate(-480, -1000); bateria(ctx, 480, 1000, 620, 280, 0, { pct: '0 %', col: RD }); ctx.restore(); }
   if (z > 0.45) { ctx.save(); ctx.globalAlpha *= cl((z - 0.45) / 0.55); ctx.fillStyle = '#0b1622'; ctx.beginPath(); ctx.roundRect(110, 640, 760, 820, 40); ctx.fill(); ctx.strokeStyle = '#cfd8e3'; ctx.lineWidth = 14; ctx.stroke();
    const g = ctx.createLinearGradient(0, 1240, 0, 1440); g.addColorStop(0, 'rgba(62,230,255,0.9)'); g.addColorStop(1, 'rgba(20,110,170,0.9)'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(140, 1250 + Math.sin(t * 3) * 6, 700, 180, 24); ctx.fill(); P.glow(ctx, 490, 1330, 360, '62,230,255', 0.45);
    P.icon(ctx, 'candado', 490, 1320, 130, { mode: 'flat', col: GO }); ctx.restore(); }
  }
 }, sfx(k) {
  if (GANCHO === 'A') { for (let i = 0; i < 3; i++) k.play('blip', 0.1 + i * 0.6, { f: 500 - i * 60, gain: 0.25 }); k.play('error', Math.max(1.6, Tk.g0e - 0.6), { f: 'C3', gain: 0.4 }); }
  else if (GANCHO === 'B') { FX.pasarPagina(k, Tk.g1 + 0.1); FX.saltoTiempo(k, Tk.g1, 0.9); }
  else { k.play('whoosh', 0.5, { dur: 1.0, gain: 0.3, minor: true }); FX.aparece(k, Tk.g0e - 0.5, 520); }
 } });

 // ---------- 2 · ¿Mito o verdad? ----------
 B.push({ t0: Bb(0), t1: Bb(1), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); const a = R(Sb(0), Sb(0) + 0.4, t), flip = Math.sin(t * 6) > 0;
  P.glow(ctx, 480, 1000, 480, '255,200,69', 0.25 * a); celular(ctx, 480, 1040, 420, t, { bat: 0.02, dibuja: (c) => { c.save(); c.globalAlpha *= a; txt(c, '?', 0, 30, 380, GO, { w: 900, f: 'Fredoka' }); c.restore(); } });
  ctx.save(); ctx.globalAlpha *= a; for (const [lab, col, x0, on] of [['MITO', RD, 150, flip], ['VERDAD', GR, 810, !flip]]) { ctx.globalAlpha = a * (on ? 1 : 0.35); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x0 - 120, 700, 240, 90, 20); ctx.fill(); txt(ctx, lab, x0, 747, 46, '#fff', { w: 900, f: 'Fredoka' }); } ctx.restore();
 }, sfx(k) { FX.aparece(k, Sb(0), 700); for (let i = 0; i < 4; i++) k.play('tick', Sb(0) + 0.2 + i * 0.26, { gain: 0.2 }); } });

 // ---------- 3 · baterías de níquel: si no las vaciabas, «olvidaban» parte de su carga (efecto memoria) ----------
 B.push({ t0: Bb(1), t1: Bb(4), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const ciclo = win(t, Tk.vaciabas, Tk.memoria), car = 0.55 + 0.4 * Math.abs(Math.sin(ciclo * Math.PI * 3)) * (1 - ciclo * 0.6), mem = sm(Tk.olvidaban - 0.2, Tk.memoria, t);
  ENC(ctx, [110, 740, 860, 1425], (g) => { losa(g, 60, 900, 1410); telViejo(g, 240, 1410 - 186, 0.62, t); pilaNiCd(g, 640, 1410 - 328, 380, 640, t, { carga: car, memoria: mem }); });
  P.tag(ctx, 'NÍQUEL', 600, 500, t, Tk.niquel - 0.1, Tk.olvidaban - 0.2, { mono: true, col: GR, px: 60 }); P.tag(ctx, 'EFECTO MEMORIA', 470, 500, t, Tk.memoria - 0.15, Bb(4), { mono: true, col: GO, px: 60 });
 }, sfx(k) { FX.etiqueta(k, Tk.niquel - 0.1); for (let i = 0; i < 3; i++) k.play('blip', Tk.vaciabas + i * 0.5, { f: 600 + i * 40, gain: 0.2 }); k.play('error', Tk.olvidaban, { f: 'E3', gain: 0.25, minor: true }); FX.etiqueta(k, Tk.memoria - 0.15); } });

 // ---------- 4 · tu celular usa litio… y el litio no tiene esa memoria ----------
 B.push({ t0: Bb(4), t1: Bb(6), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const no = sm(Tk.noTiene - 0.1, Tk.noTiene + 0.3, t);
  ENC(ctx, [70, 470, 990, 1400], (g) => { losa(g, 30, 1010, 1385);
   celular(g, 240, 1385 - 348 - 14, 340, t, { bat: 0.6, dibuja: (c) => { c.strokeStyle = 'rgba(62,230,255,0.6)'; c.setLineDash([12, 10]); c.lineWidth = 4; c.strokeRect(-100, -60, 200, 280); c.setLineDash([]); } });
   g.strokeStyle = 'rgba(62,230,255,0.6)'; g.lineWidth = 4; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(350, 1060); g.lineTo(450, 1000); g.stroke(); g.setLineDash([]);
   celdaLi(g, 720, 1385 - 388, 520, 760, t, { nivel: 0.4 + 0.5 * Math.abs(Math.sin(t * 0.9)) });
   if (no > 0) { P.glow(g, 720, 570, 160, '34,210,122', 0.6 * no); P.icon(g, 'check', 720, 570, 180 * no, { mode: 'flat', col: GR, col2: '#fff' }); } });
  P.tag(ctx, 'LITIO', 630, 1385, t, Tk.litio - 0.2, Bb(6), { mono: true, col: CY, px: 60 }); P.tag(ctx, 'SIN MEMORIA', 400, 500, t, Tk.noTiene + 0.1, Bb(6), { mono: true, col: GR, px: 60 });
 }, sfx(k) { FX.aparece(k, Tk.litio - 0.2, 600); FX.etiqueta(k, Tk.litio - 0.2); FX.correcto(k, Tk.noTiene); } });

 // ---------- 5 · como una goma elástica: en el medio no se daña; en los extremos se agrieta ----------
 B.push({ t0: Bb(6), t1: Bb(9), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const ex = sm(Tk.extremos - 0.3, Tk.extremos, t), osc = 0.5 + 0.18 * Math.sin(t * 3), dur = win(t, Tk.extremos, Bb(9)), extr = Math.sin(dur * Math.PI * 4) > 0 ? 1 : 0.04;
  const e = lerp(osc, extr, ex), gr = ex * cl(dur * 1.4);
  ENC(ctx, [-40, 440, 1000, 1235], (g) => { goma(g, 480, 1110, t, e, gr); bateria(g, 480, 600, 820, 280, e, { pct: Math.round(e * 100) + ' %', col: e > 0.85 || e < 0.12 ? RD : GR }); });
  P.tag(ctx, 'EN EL MEDIO', 470, 1395, t, Tk.medio - 0.2, Tk.extremos - 0.3, { mono: true, col: GR, px: 60 }); P.tag(ctx, 'EXTREMOS', 470, 1395, t, Tk.extremos, Bb(9), { mono: true, col: RD, px: 60 });
 }, sfx(k) { FX.aparece(k, Sb(6), 540); FX.etiqueta(k, Tk.medio - 0.2); for (let i = 0; i < 4; i++) k.play('swish', Tk.extremos + i * (Bb(9) - Tk.extremos) / 4, { gain: 0.3 }); FX.crujido ? FX.crujido(k, Tk.otra) : null; } });

 // ---------- 6 · se apaga antes de vaciarse del todo: guarda una reserva ----------
 B.push({ t0: Bb(9), t1: Bb(11), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const off = sm(Tk.apaga - 0.1, Tk.apaga + 0.1, t), xr = sm(Tk.reserva - 0.5, Tk.reserva - 0.1, t);
  // (v1.34: el celular marca 0 % y se apaga; a su lado, su batería por dentro: queda una reserva con candado)
  ENC(ctx, [40, 590, 930, 1415], (g) => { losa(g, 0, 970, 1400);
   celular(g, 240, 1400 - 389 - 12, 380, t, { bat: 0.01, pantalla: off > 0.5 ? '#000' : '#1a0d10', dibuja: (c) => { if (off < 0.5) bateria(c, 0, -40, 230, 105, 0.01, { pct: '0 %', col: RD }); } });
   g.strokeStyle = 'rgba(62,230,255,0.6)'; g.lineWidth = 4; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(400, 1080); g.lineTo(540, 1050); g.stroke(); g.setLineDash([]);
   bateriaV(g, 715, 1400 - 380 - 6, 330, 760, 0.02, { reserva: xr }); });
  P.tag(ctx, 'RESERVA', 640, 1390, t, Tk.reserva - 0.2, Bb(11), { mono: true, col: CY, px: 60 });
 }, sfx(k) { k.play('error', Tk.apaga, { f: 'C3', gain: 0.35 }); FX.revelar(k, Tk.reserva - 0.5); FX.etiqueta(k, Tk.reserva - 0.2); } });

 // ---------- 7 · llegar a cero muy seguido… se desgasta más rápido ----------
 B.push({ t0: Bb(11), t1: Tk.veredicto - 0.35, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const cyc = win(t, Tk.cero - 0.2, Tk.desgasta + 0.8), lv = Math.abs(Math.cos(cyc * Math.PI * 3.5)), salud = 1 - 0.45 * sm(Tk.desgasta - 0.3, Tk.desgasta + 0.6, t) - 0.15 * cyc;
  ENC(ctx, [-40, 460, 1000, 1300], (g) => { goma(g, 480, 1180, t, lerp(0.04, 0.96, lv), cl(cyc * 1.5)); bateria(g, 480, 620, 820, 280, lv * salud, { col: lv < 0.1 ? RD : GO });
   g.strokeStyle = 'rgba(255,255,255,0.7)'; g.setLineDash([12, 10]); g.lineWidth = 5; const xs = 480 - 410 + 49 + 722 * salud; g.beginPath(); g.moveTo(xs, 465); g.lineTo(xs, 775); g.stroke(); g.setLineDash([]); });
  P.tag(ctx, 'SE DESGASTA', 470, 1395, t, Tk.desgasta - 0.2, Tk.veredicto - 0.35, { mono: true, col: RD, px: 60 });
 }, sfx(k) { for (let i = 0; i < 4; i++) k.play('blip', Tk.cero + i * 0.35, { f: 400 - i * 30, gain: 0.2 }); k.play('error', Tk.desgasta, { f: 'A2', gain: 0.3 }); FX.etiqueta(k, Tk.desgasta - 0.2); } });

 // ---------- 8 · VEREDICTO: MITO (sello de la serie) ----------
 B.push({ t0: Tk.veredicto - 0.35, t1: Bb(15), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); mesa(ctx, 1440); celular(ctx, 480, 1060, 380, t, { bat: 0.02 });
  ctx.fillStyle = `rgba(5,8,12,${0.55 * sm(Tk.veredicto - 0.3, Tk.veredicto, t)})`; ctx.fillRect(0, 0, W, HH);
  P.veredicto(ctx, t, tV, 'MITO', { y: 1020 });
 }, sfx(k) { k.play('riser', Tk.veredicto - 0.3, { dur: tV - Tk.veredicto + 0.2, gain: 0.25, minor: true }); FX.veredicto(k, tV, 'MITO'); } });

 // ---------- 9 · cárgala cuando quieras · límite del 80 % (opción de algunos de Apple y Google) ----------
 B.push({ t0: Bb(15), t1: Bb(17), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const lim = sm(Tk.limitar - 0.3, Tk.limitar, t), plug = R(Sb(15), Sb(15) + 0.6, t), lv = lerp(0.45, 0.8, win(t, Sb(15) + 0.6, Tk.mejor)), on = sm(Tk.ochenta - 0.1, Tk.ochenta + 0.2, t);
  // (v1.34: sin mano; el cable entra solo en el celular y a su lado la batería se llena hasta la raya del 80 %)
  ENC(ctx, [40, 600, 930, 1430], (g) => { losa(g, 0, 970, 1410);
   const cy = 1410 - 389 - 12, yb = cy + 389 + 40 * (1 - plug);
   g.strokeStyle = '#e9edf3'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(240, yb + 30); g.quadraticCurveTo(250, 1440, 420, 1425); g.lineTo(980, 1425); g.stroke(); g.fillStyle = '#e9edf3'; g.beginPath(); g.roundRect(222, yb - 6, 36, 40, 8); g.fill();
   celular(g, 240, cy, 380, t, { bat: lv, dibuja: (c, sw, sh) => {
    if (lim < 1) { c.save(); c.globalAlpha *= 1 - lim; bateria(c, 0, -60, 240, 112, lv, { pct: Math.round(lv * 100) + ' %', col: GR }); P.icon(c, 'rayo', 0, 130, 80, { mode: 'flat', col: GO }); c.restore(); }
    if (lim > 0) { c.save(); c.globalAlpha *= lim; c.fillStyle = '#1f2a3a'; c.beginPath(); c.roundRect(-sw * 0.44, -70, sw * 0.88, 140, 24); c.fill(); txt(c, 'Límite', -sw * 0.17, -18, 40, '#e6edf5', { w: 800 }); txt(c, '80 %', -sw * 0.17, 36, 50, GO, { w: 900, f: 'Fredoka' });
     c.fillStyle = on > 0.5 ? GR : '#3a4252'; c.beginPath(); c.roundRect(sw * 0.08, -28, 104, 56, 28); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(sw * 0.08 + 28 + 48 * on, 0, 22, 0, TAU); c.fill(); c.restore(); } } });
   bateriaV(g, 700, 1410 - 356 - 6, 300, 712, lv, { col: GR, limite: lim }); });
  P.tag(ctx, 'CUANDO QUIERAS', 330, 500, t, Sb(15), Tk.limitar - 0.3, { mono: true, col: GR, px: 60 }); P.statBig(ctx, '80 %', 660, 505, t, Tk.ochenta - 0.1, Bb(17), { px: 104, sub: 'LÍMITE', col: GO });
 }, sfx(k) { k.play('click', Sb(15) + 0.6, { gain: 0.45 }); FX.chispa(k, Sb(15) + 0.62, 0.3); FX.etiqueta(k, Sb(15)); FX.toque(k, Tk.ochenta); FX.aparece(k, Tk.ochenta - 0.1, 720); } });

 // ---------- 10 · CIERRE ----------
 B.push({ t0: Bb(17), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); P.ctaShare(ctx, t, Bb(17) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { P.fondo(cc, t); mesa(cc); celular(cc, 480, 1060, 380, t, { bat: 0.02 }); P.veredicto(cc, t, -10, 'MITO', { y: 760 }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, Bb(17) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'tecno', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['«educar»', 'noventa.', 'vacía.', 'verdad?', 'níquel:', '«olvidaban»', 'memoria.', 'litio…', 'goma', 'medio', 'extremos,', 'reserva', 'cero', 'desgasta', 'mito.', 'quieras.', '80', 'amigo'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 600, gain: 0.006, a: 0.05, hold: DURATION - 2.2 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 104, gain: 0.55, chords: [['D2', 'F2', 'A2', 'D3'], ['A#1', 'D2', 'F2', 'A#2'], ['F2', 'A2', 'C3', 'F3'], ['C2', 'E2', 'G2', 'C3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
