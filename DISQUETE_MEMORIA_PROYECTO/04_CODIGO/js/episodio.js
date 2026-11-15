// =====================================================================================================
// episodio.js — Del disquete a las memorias diminutas · PLANTILLA ASOMBROTECA v1.42 · «cartoon» (oficina de los 90 → hoy)
// UN solo vídeo con UN gancho (v1.34): el C en segunda persona («Todos tus disquetes… hoy caben en una uña»).
// Voz: ElevenLabs Eleven v4, Dan, UNA toma (938 caracteres, 63,7 s), voz intacta.
// Metáfora sostenida: LA BIBLIOTECA QUE SE ENCOGE (el disquete, una biblioteca redonda que gira con un bibliotecario-imán que corre;
// la tarjeta, otra biblioteca sin nada que gire: cajoncitos con electricidad encerrada, apilados como un edificio).
// Sonido (v1.42): etiquetas suaves; el «tin» (FX.clave) solo en 4 momentos: «un poco más de un mega», «más de cien pisos»,
// «más de trescientos mil» y «más de un kilómetro». Computador, oficina, personas y tarjetas dibujados, sin marcas ni logos.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, DURATION, txt } = K;
 const S = (i) => A.segments[i].s;
 const YE = '#ffd23f', RD = '#ff4d5e', GR = '#22d27a', CY = '#8fd8ff', NAR = '#ff9f43', AZ = '#3ea8ff', BL = '#ffffff';
 const PORTADA = typeof window !== 'undefined' && !!window.__SIN_SUBTITULOS;
 const Tk = {
  disquetes: wt(0, 'disquetes…'), una: wt(1, 'uña.'), esto1: wt(2, 'esto…'), esto2: wt(3, 'esto?'), ve: wt(4, 've.'),
  ruidito: wt(5, 'ruidito'), lector: wt(5, 'lector…'), disco: wt(5, '«disco'), lleno: wt(5, 'lleno»?'), disquete: wt(6, 'disquete'), mega: wt(6, 'mega.'),
  biblioteca: wt(7, 'biblioteca'), iman: wt(8, 'imán'), giraba: wt(8, 'giraba,'), cabeza: wt(8, 'cabeza'), corria: wt(8, 'corría'), puntitos: wt(9, 'puntitos'),
  movia: wt(10, 'movía…'), sonaba: wt(11, 'sonaba,'), danarse: wt(12, 'dañarse.'), tarjeta: wt(13, 'tarjeta'), biblioteca2: wt(13, 'biblioteca…'), gire: wt(14, 'gire.'),
  miles: wt(15, 'miles'), cajoncitos: wt(15, 'cajoncitos'), electricidad: wt(15, 'electricidad'), encerrada: wt(15, 'encerrada.'), encogieron: wt(16, 'encogieron'), achicarse: wt(16, 'achicarse'),
  apilaron: wt(17, 'apilaron,'), edificio: wt(17, 'edificio'), cien: wt(17, 'cien'), pisos: wt(17, 'pisos.'), cuantos: wt(18, '¿Cuántos'), quinientos: wt(18, 'quinientos'), gigas: wt(18, 'gigas?'),
  trescientos: wt(19, 'trescientos'), mil: wt(19, 'mil.'), torre: wt(20, 'torre'), kilometro: wt(20, 'kilómetro.'), todo: wt(21, 'todo'), una2: wt(22, 'uña.'),
 };
 const TAG = (ctx, s_, x, y, t, t0, t1, o) => P.tag(ctx, s_, x, y, t, t0 - 0.25, t1 - 0.25, o);
 // ---------- cámara y efectos (como en el tren) ----------
 const camK = (t, Kf) => { if (t <= Kf[0][0]) return Kf[0].slice(1); for (let i = 0; i < Kf.length - 1; i++) { const [t0, x0, y0, z0] = Kf[i], [t1, x1, y1, z1] = Kf[i + 1]; if (t < t1) { const u = E.inOut(cl((t - t0) / Math.max(0.01, t1 - t0))); return [lerp(x0, x1, u), lerp(y0, y1, u), Math.exp(lerp(Math.log(z0), Math.log(z1), u))]; } } return Kf[Kf.length - 1].slice(1); };
 const sacude = (t, golpes, amp = 30) => { let x = 0, y = 0; for (const [g, f] of golpes) { const d = t - g; if (d >= 0 && d < 0.6) { const k = amp * f * Math.exp(-d * 7); x += Math.sin(d * 97) * k; y += Math.cos(d * 83) * k * 0.8; } } return [x, y]; };
 const zoomP = (ctx, cam, sh = [0, 0]) => { ctx.translate(540 + sh[0], 950 + sh[1]); ctx.scale(cam[2], cam[2]); ctx.translate(-cam[0], -cam[1]); };
 const fogonazo = (ctx, t, golpes) => { let a = 0; for (const [g, f] of golpes) { const d = t - g; if (d >= 0 && d < 0.7) a = Math.max(a, Math.min(1, f) * (d < 0.07 ? 1 : Math.exp(-(d - 0.07) * 8))); } if (a > 0) { ctx.fillStyle = `rgba(255,250,235,${0.95 * a})`; ctx.fillRect(-80, -80, W + 160, HH + 160); } };
 const ctxGiro = (ctx, x, y, a) => { ctx.translate(x, y); ctx.rotate(a); ctx.translate(-x, -y); };
 const marcaX = (ctx, x, y, r, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = RD; ctx.lineWidth = r * 0.18; ctx.lineCap = 'round'; const q = r * E.out(a); ctx.beginPath(); ctx.moveTo(x - q, y - q); ctx.lineTo(x + q, y + q); ctx.moveTo(x + q, y - q); ctx.lineTo(x - q, y + q); ctx.stroke(); ctx.restore(); };
 const flecha = (ctx, x0, y0, x1, y1, col, lw) => { const a = Math.atan2(y1 - y0, x1 - x0); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - Math.cos(a) * lw * 1.6, y1 - Math.sin(a) * lw * 1.6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - Math.cos(a - 0.5) * lw * 3, y1 - Math.sin(a - 0.5) * lw * 3); ctx.lineTo(x1 - Math.cos(a + 0.5) * lw * 3, y1 - Math.sin(a + 0.5) * lw * 3); ctx.closePath(); ctx.fill(); };
 const anillo = (ctx, t, x, y, r, a, col = YE) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.setLineDash([26, 16]); ctx.lineDashOffset = -t * 60; ctx.beginPath(); ctx.arc(x, y, r + 8 * Math.sin(t * 6), 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); };
 const sepia = (ctx, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#808080'; ctx.fillRect(-100, -100, W + 200, HH + 200); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#e0b07a'; ctx.fillRect(-100, -100, W + 200, HH + 200); ctx.restore(); const v = ctx.createRadialGradient(540, 960, 400, 540, 960, 1150); v.addColorStop(0, 'rgba(40,20,5,0)'); v.addColorStop(1, `rgba(40,20,5,${0.55 * a})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, HH); };

 const rejilla = (ctx, x0 = -400, y0 = -400, x1 = W + 400, y1 = HH + 400) => { ctx.fillStyle = '#0b1d3a'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); ctx.strokeStyle = 'rgba(143,216,255,0.12)'; ctx.lineWidth = 2; for (let gx = Math.floor(x0 / 54) * 54; gx <= x1; gx += 54) { ctx.beginPath(); ctx.moveTo(gx, y0); ctx.lineTo(gx, y1); ctx.stroke(); } for (let gy = Math.floor(y0 / 54) * 54; gy <= y1; gy += 54) { ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x1, gy); ctx.stroke(); } };
 const persona = (ctx, t, x, y, s, o = {}) => { const m = o.miedo || 0, son = o.sonrie || 0, j = o.salto || 0; ctx.save(); ctx.translate(x, y - j * 110 * s); ctx.rotate(o.incl || 0); ctx.scale(s, s); const ropa = o.ropa || '#3d6fb6', piel = o.piel || '#d9a074';
  ctx.fillStyle = '#3a3550'; ctx.fillRect(-56, -200, 48, 200); ctx.fillRect(8, -200, 48, 200);
  ctx.fillStyle = ropa; ctx.beginPath(); ctx.roundRect(-74, -470, 148, 290, [56, 56, 14, 14]); ctx.fill();
  if (o.abuela) { ctx.fillStyle = '#f4efe6'; ctx.beginPath(); ctx.roundRect(-54, -400, 108, 230, 12); ctx.fill(); ctx.strokeStyle = '#c8553d'; ctx.lineWidth = 6; ctx.strokeRect(-40, -330, 80, 60); }
  const brazoArriba = m > 0.5, pecho = o.pecho, sd = o.seed || 0, bal = Math.sin(t * 2.3 + sd * 3), rv = o.revuelve ? t * 5 : 0; ctx.strokeStyle = ropa; ctx.lineWidth = 36; ctx.lineCap = 'round';
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 56, -440); let hx, hy; if (!brazoArriba && o.brazoI && k === -1) { hx = o.brazoI[0]; hy = o.brazoI[1]; } else if (!brazoArriba && o.brazoD && k === 1) { hx = o.brazoD[0]; hy = o.brazoD[1]; } else if (brazoArriba) { hx = k * (80 + 10 * Math.sin(t * 9 + k)); hy = -560 + 8 * Math.sin(t * 11 + k); } else if (pecho && k === 1) { hx = 10; hy = -380 + 6 * bal; } else if (o.revuelve && k === 1) { hx = 150 + 26 * Math.cos(rv); hy = -520 + 12 * Math.sin(rv); } else if (o.cuchara && k === 1) { hx = 130 + 8 * bal; hy = -330 + 6 * bal; } else { hx = k * (86 + 8 * bal); hy = -260 + 10 * Math.sin(t * 1.9 + k + sd); } ctx.lineTo(hx, hy); ctx.stroke(); ctx.fillStyle = piel; ctx.beginPath(); ctx.arc(hx, hy, 22, 0, TAU); ctx.fill();
   if ((o.cuchara || o.revuelve) && k === 1 && !brazoArriba) { ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.revuelve ? 0.25 : 0.5); ctx.fillStyle = '#9c6b3f'; ctx.fillRect(-6, -10, 12, 130); ctx.beginPath(); ctx.ellipse(0, 130, 22, 16, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
  ctx.fillStyle = piel; ctx.fillRect(-20, -500, 40, 40); ctx.beginPath(); ctx.arc(0, -548, 64, 0, TAU); ctx.fill();
  if (o.abuela) { ctx.fillStyle = '#d6d6d6'; ctx.beginPath(); ctx.arc(-2, -568, 66, Math.PI * 0.92, Math.PI * 2.08); ctx.fill(); ctx.beginPath(); ctx.arc(0, -628, 30, 0, TAU); ctx.fill(); }
  else { ctx.fillStyle = o.pelo || '#2a1d16'; ctx.beginPath(); ctx.arc(-4, -566, 64, Math.PI * 0.95, Math.PI * 2.05); ctx.fill(); }
  const parp = m < 0.4 && ((t + sd * 1.7) % 2.7) < 0.12; if (parp) { ctx.strokeStyle = '#3a1410'; ctx.lineWidth = 5; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 23 - 10, -546); ctx.lineTo(k * 23 + 10, -546); ctx.stroke(); } } else { ctx.fillStyle = '#fff'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -546, 9 + 8 * m, 0, TAU); ctx.fill(); } ctx.fillStyle = '#111'; const mx = (o.mira || 0) * 3; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23 + mx, -546, 4.5, 0, TAU); ctx.fill(); } }
  if (o.abuela) { ctx.strokeStyle = '#5a4636'; ctx.lineWidth = 4; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -546, 19, 0, TAU); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-4, -546); ctx.lineTo(4, -546); ctx.stroke(); }
  ctx.fillStyle = 'rgba(230,110,100,0.35)'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 38, -520, 12, 0, TAU); ctx.fill(); }
  if (m > 0.4) { ctx.fillStyle = '#3a1410'; ctx.beginPath(); ctx.ellipse(0, -508, 13, 16 * m, 0, 0, TAU); ctx.fill(); } else { ctx.strokeStyle = '#3a1410'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -526, 18 + 6 * son, 0.25, Math.PI - 0.25); ctx.stroke(); }
  ctx.restore(); };

 // =====================================================================================================
 // DIBUJOS (todo apoyado: el computador y la torre sobre la mesa, las personas pisan el suelo)
 // =====================================================================================================
 const RNG = (s) => H.rng(s);
 const DCOL = ['#2b2f36', '#3a5fb0', '#c0392b', '#2e8b57', '#e0b02a', '#7a4f9a', '#1f6f8b', '#e67e22'];
 // ---------- OFICINA / COLEGIO DE LOS 90 ----------
 const oficina90 = (ctx, t, o = {}) => { const my = o.mesa ?? 1320; const g = ctx.createLinearGradient(0, -300, 0, 1500); g.addColorStop(0, '#efe3c6'); g.addColorStop(1, '#d6c49c'); ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, 1900);
  ctx.fillStyle = '#9b6e45'; ctx.fillRect(-400, 1120, W + 800, 400); ctx.strokeStyle = '#86603b'; ctx.lineWidth = 5; for (let x = -400; x < W + 400; x += 90) { ctx.beginPath(); ctx.moveTo(x, 1120); ctx.lineTo(x, 1520); ctx.stroke(); } ctx.fillStyle = '#7a5532'; ctx.fillRect(-400, 1110, W + 800, 16);
  // ventana con persianas
  ctx.fillStyle = '#9fd0f0'; ctx.fillRect(40, 380, 330, 470); ctx.fillStyle = 'rgba(255,255,255,0.75)'; for (let i = 0; i < 16; i++) ctx.fillRect(40, 390 + i * 29, 330, 13 + 3 * Math.sin(t * 0.8 + i)); ctx.strokeStyle = '#f2f2f2'; ctx.lineWidth = 16; ctx.strokeRect(40, 380, 330, 470);
  // corcho con papeles
  ctx.fillStyle = '#b98a55'; ctx.fillRect(660, 430, 360, 280); ctx.strokeStyle = '#7a5532'; ctx.lineWidth = 12; ctx.strokeRect(660, 430, 360, 280); const R = RNG(4); for (let i = 0; i < 6; i++) { const px = 690 + (i % 3) * 110 + R() * 20, py = 460 + Math.floor(i / 3) * 120 + R() * 20; ctx.save(); ctx.translate(px, py); ctx.rotate((R() - 0.5) * 0.2); ctx.fillStyle = ['#fff8d6', '#ffffff', '#d6f0ff'][i % 3]; ctx.fillRect(0, 0, 90, 100); ctx.fillStyle = 'rgba(80,80,80,0.35)'; for (let k = 0; k < 4; k++) ctx.fillRect(10, 18 + k * 18, 70, 5); ctx.fillStyle = RD; ctx.beginPath(); ctx.arc(45, 6, 7, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#6a5848'; ctx.fillRect(-400, 1520, W + 800, 800);
  if (o.mesa !== false) { ctx.fillStyle = '#8a5b34'; ctx.fillRect(-60, my, W + 120, 44); ctx.fillStyle = '#a56d3f'; ctx.fillRect(-60, my, W + 120, 12); ctx.fillStyle = '#6e4627'; ctx.fillRect(-60, my + 44, W + 120, 190); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-60, my + 44, W + 120, 14); for (const dx of [120, 560, 960]) { ctx.strokeStyle = '#5a381e'; ctx.lineWidth = 6; ctx.strokeRect(dx - 150, my + 70, 300, 70); ctx.strokeRect(dx - 150, my + 150, 300, 70); ctx.fillStyle = '#c9a25c'; ctx.fillRect(dx - 30, my + 100, 60, 10); ctx.fillRect(dx - 30, my + 180, 60, 10); } ctx.fillStyle = '#3a3d44'; ctx.beginPath(); ctx.roundRect(260, my - 26, 420, 26, 6); ctx.fill(); ctx.fillStyle = '#d9d2c0'; for (let i = 0; i < 14; i++) ctx.fillRect(272 + i * 29, my - 22, 22, 8); } };
 // ---------- SALA DE HOY ----------
 const salaHoy = (ctx, t) => { ctx.fillStyle = '#f2ede6'; ctx.fillRect(-400, -400, W + 800, 1950); ctx.fillStyle = '#9ec9ea'; ctx.fillRect(560, 380, 460, 560); ctx.fillStyle = '#5d7da3'; for (let i = 0; i < 7; i++) { const h = 120 + 60 * Math.abs(Math.sin(i * 2.1)); ctx.fillRect(580 + i * 62, 940 - h, 50, h); } ctx.fillStyle = 'rgba(255,255,255,0.5)'; for (let i = 0; i < 7; i++) for (let k = 0; k < 4; k++) ctx.fillRect(590 + i * 62, 960 - 140 + k * 26 - 60 * Math.abs(Math.sin(i * 2.1)) + 20, 10, 10); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 18; ctx.strokeRect(560, 380, 460, 560); ctx.beginPath(); ctx.moveTo(790, 380); ctx.lineTo(790, 940); ctx.stroke();
  ctx.fillStyle = '#c9b39a'; ctx.fillRect(-400, 1530, W + 800, 800); ctx.strokeStyle = 'rgba(120,90,60,0.25)'; ctx.lineWidth = 4; for (let x = -400; x < W + 400; x += 140) { ctx.beginPath(); ctx.moveTo(x, 1530); ctx.lineTo(x - 80, 1920); ctx.stroke(); }
  ctx.fillStyle = '#5b7f5a'; ctx.beginPath(); ctx.ellipse(120, 1180, 90, 160, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#c8a27a'; ctx.fillRect(70, 1330, 100, 200); };
 // ---------- COMPUTADOR BEIGE (caja de escritorio + monitor de tubo). x, yb = centro y apoyo en la mesa ----------
 const pcBeige = (ctx, t, x, yb, s = 1, o = {}) => { ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(0, 4, 360, 16, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e8dec6'; ctx.beginPath(); ctx.roundRect(-330, -160, 660, 160, 14); ctx.fill(); ctx.fillStyle = '#d3c7ab'; ctx.fillRect(-330, -40, 660, 40); ctx.fillStyle = '#c7baa0'; ctx.fillRect(-300, -130, 260, 8); ctx.fillRect(-300, -110, 260, 8);
  ctx.fillStyle = '#d8cdb3'; ctx.beginPath(); ctx.roundRect(70, -128, 240, 64, 8); ctx.fill(); ctx.fillStyle = '#2a2a2e'; ctx.fillRect(90, -104, 200, 14); if (o.disco) { ctx.fillStyle = o.disco; ctx.fillRect(100, -106, 180, 6); }
  ctx.fillStyle = '#b9ad93'; ctx.fillRect(250, -84, 34, 12); const led = o.led ?? 0; ctx.fillStyle = led > 0.5 ? '#3cff6a' : '#2d5a36'; ctx.beginPath(); ctx.arc(100, -78, 7, 0, TAU); ctx.fill(); if (led > 0.5) P.glow(ctx, 100, -78, 30, '60,255,110', 0.8);
  ctx.fillStyle = '#d3c7ab'; ctx.fillRect(-70, -200, 140, 40); ctx.fillStyle = '#e8dec6'; ctx.beginPath(); ctx.roundRect(-290, -690, 580, 500, 26); ctx.fill(); ctx.fillStyle = '#d6cbb1'; ctx.beginPath(); ctx.roundRect(-290, -250, 580, 60, [0, 0, 26, 26]); ctx.fill();
  const sx = -240, sy = -650, sw = 480, sh = 380; ctx.fillStyle = '#1b2a5a'; ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 22); ctx.fill(); if (o.pantalla) { ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 22); ctx.clip(); o.pantalla(ctx, sx, sy, sw, sh); ctx.restore(); } ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.ellipse(sx + 120, sy + 80, 120, 50, -0.3, 0, TAU); ctx.fill();
  ctx.fillStyle = '#b9ad93'; ctx.beginPath(); ctx.arc(230, -220, 9, 0, TAU); ctx.fill(); ctx.restore(); };
 const pantallaCopia = (p, err) => (ctx, sx, sy, sw, sh) => { ctx.fillStyle = '#1f6f8b'; ctx.fillRect(sx, sy, sw, sh); for (let i = 0; i < 3; i++) { ctx.fillStyle = '#e8e8e8'; ctx.fillRect(sx + 30, sy + 40 + i * 70, 50, 40); }
  ctx.fillStyle = '#c9c9c9'; ctx.fillRect(sx + 70, sy + 110, sw - 140, 170); ctx.fillStyle = '#1a3f9a'; ctx.fillRect(sx + 70, sy + 110, sw - 140, 34); ctx.fillStyle = '#fff'; ctx.font = '700 26px Nunito'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('Copiando…', sx + 84, sy + 128);
  ctx.fillStyle = '#fff'; ctx.fillRect(sx + 100, sy + 200, sw - 200, 36); ctx.fillStyle = '#1a3f9a'; for (let k = 0; k < Math.floor(p * 14); k++) ctx.fillRect(sx + 104 + k * ((sw - 208) / 14), sy + 204, (sw - 208) / 14 - 4, 28);
  if (err > 0) { const sc = 0.6 + 0.4 * E.out(Math.min(1, err * 1.6)) + 0.06 * Math.sin(err * 20) * (1 - Math.min(1, err)); ctx.save(); ctx.translate(sx + sw / 2, sy + sh / 2); ctx.scale(sc, sc); ctx.fillStyle = '#d6d6d6'; ctx.fillRect(-200, -110, 400, 220); ctx.fillStyle = '#9a1a1a'; ctx.fillRect(-200, -110, 400, 40); ctx.fillStyle = '#fff'; ctx.font = '700 26px Nunito'; ctx.textAlign = 'center'; ctx.fillText('Error', 0, -90); ctx.fillStyle = '#e02424'; ctx.beginPath(); ctx.arc(-130, 20, 40, 0, TAU); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-148, 2); ctx.lineTo(-112, 38); ctx.moveTo(-112, 2); ctx.lineTo(-148, 38); ctx.stroke(); ctx.fillStyle = '#111'; ctx.font = '900 46px Nunito'; ctx.textAlign = 'left'; ctx.fillText('DISCO', -70, 0); ctx.fillText('LLENO', -70, 48); ctx.restore(); } };
 // ---------- TORRE DE DISQUETES (de lado, grosor real 3,3 mm sobre 90 mm). x, yb = centro y apoyo; s = px por mm ----------
 const torreDisq = (ctx, t, x, yb, n, s, o = {}) => { const w = 90 * s, h = 3.3 * s; for (let i = 0; i < n; i++) { const k = (i + 1) / n, dx = (o.sway ?? 0) * Math.sin(t * 3.1 + 0.3) * Math.pow(k, 1.6) * 60 + (o.desp ? o.desp(i) : 0), y = yb - (i + 1) * h; ctx.fillStyle = DCOL[(i * 3) % DCOL.length]; ctx.fillRect(x - w / 2 + dx, y, w, h - 1); ctx.fillStyle = '#b9c0c9'; ctx.fillRect(x - w / 2 + dx + w * 0.3, y, w * 0.35, h - 1); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x - w / 2 + dx, y, w, Math.max(1, h * 0.25)); } };
 // ---------- EL DISQUETE EN CORTE (vista de arriba): caja, disco magnético que gira, pistas, cabeza que va y viene, puntitos magnéticos y «libros» ----------
 const corteDisq = (ctx, t, cx, cy, s, o = {}) => { const ang = o.ang ?? t * 5, caja = o.caja ?? 0.35, cab = o.cab ?? 0.5, R = 42.9 * s; ctx.save(); ctx.translate(cx, cy);
  ctx.fillStyle = `rgba(43,47,54,${caja})`; ctx.strokeStyle = '#8a94a3'; ctx.lineWidth = Math.max(3, s * 0.6); ctx.beginPath(); ctx.roundRect(-45 * s, -47 * s, 90 * s, 94 * s, 3 * s); ctx.fill(); ctx.stroke();
  const g = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R); g.addColorStop(0, '#8a5a36'); g.addColorStop(1, '#5e3a20'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill();
  ctx.save(); ctx.rotate(ang); ctx.strokeStyle = 'rgba(255,220,180,0.16)'; ctx.lineWidth = 2; for (let r = 14; r < 42; r += 2.2) { ctx.beginPath(); ctx.arc(0, 0, r * s, 0, TAU); ctx.stroke(); } ctx.strokeStyle = 'rgba(255,230,200,0.3)'; ctx.lineWidth = 3; for (let k = 0; k < 18; k++) { const a = k * TAU / 18; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 14 * s, Math.sin(a) * 14 * s); ctx.lineTo(Math.cos(a) * 41 * s, Math.sin(a) * 41 * s); ctx.stroke(); }
   if (o.libros) { ctx.globalAlpha = o.libros; for (let ring = 0; ring < 4; ring++) { const rr = (18 + ring * 6) * s, nb = 22 + ring * 8; for (let k = 0; k < nb; k++) { const a = k * TAU / nb; ctx.save(); ctx.rotate(a); ctx.fillStyle = DCOL[(k + ring) % DCOL.length]; ctx.fillRect(rr - 2.2 * s, -0.9 * s, 4.4 * s, 1.8 * s * (0.8 + 0.3 * ((k * 7) % 3))); ctx.restore(); } } ctx.globalAlpha = 1; }
   if (o.puntos) { const rr = lerp(15, 40, cab) * s; for (let k = 0; k < 48; k++) { const a = k * TAU / 48, bit = ((k * 37) % 5) < 2; ctx.save(); ctx.rotate(a); ctx.fillStyle = bit ? '#3ea8ff' : '#ff9f43'; ctx.beginPath(); ctx.arc(rr, 0, 1.4 * s, 0, TAU); ctx.fill(); ctx.restore(); } }
  ctx.restore();
  ctx.fillStyle = '#c9ced8'; ctx.beginPath(); ctx.arc(0, 0, 12.5 * s, 0, TAU); ctx.fill(); ctx.save(); ctx.rotate(ang); ctx.fillStyle = '#7d848f'; ctx.fillRect(-3 * s, -3 * s, 6 * s, 6 * s); ctx.fillRect(5 * s, -2 * s, 3 * s, 5 * s); ctx.restore();
  // ventana de lectura y la cabeza (va y viene en radial, hacia arriba)
  ctx.strokeStyle = 'rgba(200,210,225,0.6)'; ctx.lineWidth = 3; ctx.strokeRect(-4 * s, -44 * s, 8 * s, 30 * s); const hy = -lerp(15, 40, cab) * s; ctx.fillStyle = '#2a2d33'; ctx.fillRect(-7 * s, hy - 2.5 * s, 14 * s, 5 * s); ctx.fillStyle = '#d8b04a'; ctx.fillRect(-1.5 * s, hy - 2.5 * s, 3 * s, 5 * s); ctx.strokeStyle = '#2a2d33'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(0, -60 * s); ctx.stroke();
  if (o.marcaCab) anillo(ctx, t, 0, hy, 9 * s, o.marcaCab);
  ctx.restore(); };
 // ---------- MECANISMO DEL LECTOR (de lado): motor que gira, disco, cabeza en un riel con tornillo, «crrr» ----------
 const lector = (ctx, t, cx, cy, s, o = {}) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); const ph = t * 8;
  ctx.fillStyle = '#5a6270'; ctx.fillRect(-420, 120, 840, 60); ctx.fillStyle = '#3a4048'; ctx.beginPath(); ctx.roundRect(-120, 40, 240, 80, 14); ctx.fill(); ctx.fillStyle = '#c9ced8'; ctx.fillRect(-20, -20, 40, 70);
  ctx.fillStyle = '#7a4a2a'; ctx.beginPath(); ctx.ellipse(0, -20, 360, 46, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(255,220,180,0.35)'; ctx.lineWidth = 4; for (let k = 0; k < 8; k++) { const a = ph + k * TAU / 8; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 60, -20 + Math.sin(a) * 8); ctx.lineTo(Math.cos(a) * 350, -20 + Math.sin(a) * 44); ctx.stroke(); }
  ctx.fillStyle = '#c9ced8'; ctx.beginPath(); ctx.ellipse(0, -20, 60, 8, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#6b7280'; ctx.fillRect(-400, -150, 800, 22); ctx.strokeStyle = '#9aa3b2'; ctx.lineWidth = 6; for (let x = -390; x < 390; x += 24) { const xx = x + ((ph * 6) % 24); ctx.beginPath(); ctx.moveTo(xx, -150); ctx.lineTo(xx + 12, -128); ctx.stroke(); }
  const hx = lerp(80, 330, o.cab ?? (0.5 + 0.5 * Math.sin(t * 2.4))); ctx.fillStyle = '#2a2d33'; ctx.fillRect(hx - 40, -170, 80, 60); ctx.fillRect(hx - 8, -110, 16, 70); ctx.fillStyle = '#d8b04a'; ctx.fillRect(hx - 18, -46, 36, 14);
  if (o.ruido) { ctx.strokeStyle = `rgba(255,255,255,${0.7 * o.ruido})`; ctx.lineWidth = 8; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { const r = 70 + i * 50 + ((t * 120) % 50); ctx.beginPath(); for (let a = -0.6; a <= 0.6; a += 0.1) { const rr = r + 10 * Math.sin(a * 30 + t * 30); ctx.lineTo(hx + 60 + Math.cos(a) * rr, -140 + Math.sin(a) * rr); } ctx.stroke(); } }
  ctx.restore(); };
 // ---------- TARJETA EN RAYOS X (sobre P.microSD): azul translúcido, chip, celdas que brillan, electrones ----------
 const tarjetaRX = (ctx, t, cx, cy, mm, o = {}) => { P.microSD(ctx, cx, cy, mm, { rot: o.rot || 0 }); const a = o.rx ?? 1; if (a <= 0) return; const w = 11 * mm, h = 15 * mm; ctx.save(); ctx.translate(cx, cy); if (o.rot) ctx.rotate(o.rot); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(20,60,140,0.78)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, mm * 0.8); ctx.fill();
  const cw = w * 0.62, ch = h * 0.5, x0 = -cw / 2, y0 = -h * 0.12 - ch / 2; ctx.strokeStyle = '#8fd8ff'; ctx.lineWidth = Math.max(2, mm * 0.15); ctx.strokeRect(x0, y0, cw, ch); const n = o.n ?? 10; for (let i = 0; i < n; i++) for (let k = 0; k < Math.round(n * ch / cw); k++) { const px = x0 + (i + 0.5) * cw / n, py = y0 + (k + 0.5) * cw / n; if (py > y0 + ch) continue; const on = ((i * 7 + k * 3 + Math.floor(t * 3)) % 4) === 0; ctx.fillStyle = on ? '#ffd23f' : 'rgba(143,216,255,0.5)'; ctx.fillRect(px - cw / n * 0.3, py - cw / n * 0.3, cw / n * 0.6, cw / n * 0.6); }
  ctx.strokeStyle = 'rgba(143,216,255,0.6)'; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-w * 0.4 + i * w * 0.11, h * 0.36); ctx.lineTo(-w * 0.4 + i * w * 0.11, h * 0.48); ctx.stroke(); }
  ctx.restore(); };
 // ---------- EDIFICIO DE CAPAS (memoria 3D en isométrico): n pisos construidos; cada piso con celdas ----------
 const capas = (ctx, t, cx, yb, n, o = {}) => { const wv = o.w ?? 520, dv = o.d ?? 260, hp = o.hp ?? 9, top = Math.floor(n); for (let i = 0; i < top + 1; i++) { const f = i < top ? 1 : n - top; if (f <= 0) break; const y = yb - i * hp - (1 - f) * 120; ctx.save(); ctx.globalAlpha = f; const xL = cx - wv / 2, xR = cx + wv / 2;
   ctx.fillStyle = i % 2 ? '#2a6f9e' : '#3a8fc4'; ctx.beginPath(); ctx.moveTo(xL, y); ctx.lineTo(cx, y + dv / 2); ctx.lineTo(cx, y + dv / 2 + hp); ctx.lineTo(xL, y + hp); ctx.closePath(); ctx.fill(); ctx.fillStyle = i % 2 ? '#1f5a82' : '#2d77a8'; ctx.beginPath(); ctx.moveTo(xR, y); ctx.lineTo(cx, y + dv / 2); ctx.lineTo(cx, y + dv / 2 + hp); ctx.lineTo(xR, y + hp); ctx.closePath(); ctx.fill();
   if (i === top - 1 || (i === top && f > 0.5)) { ctx.fillStyle = '#5fb4e8'; ctx.beginPath(); ctx.moveTo(xL, y); ctx.lineTo(cx, y - dv / 2); ctx.lineTo(xR, y); ctx.lineTo(cx, y + dv / 2); ctx.closePath(); ctx.fill(); for (let a = 1; a < 10; a++) for (let b = 1; b < 10; b++) { const u = a / 10, v = b / 10, px = lerp(lerp(xL, cx, u), lerp(cx, xR, u), v), py = lerp(lerp(y, y - dv / 2, u), lerp(y + dv / 2, y, u), v); const on = ((a * 3 + b * 5 + Math.floor(t * 4)) % 5) === 0; ctx.fillStyle = on ? '#ffd23f' : 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.arc(px, py, 6, 0, TAU); ctx.fill(); } }
   ctx.restore(); } };
 // ---------- MONTAÑA DE DISQUETES (posiciones fijas; caen por orden) ----------
 const MONT = (() => { const R = RNG(77), out = []; for (let i = 0; i < 170; i++) { const u = R() + R() - 1, x = 540 + u * 560, hmax = 760 * (1 - Math.abs(u)), y = 1560 - R() * hmax; out.push({ x, y, rot: (R() - 0.5) * 1.6, col: DCOL[i % DCOL.length], d: R() }); } return out.sort((a, b) => b.y - a.y); })();
 const montana = (ctx, t, u, o = {}) => { const n = Math.floor(MONT.length * cl(u)); for (let i = 0; i < n; i++) { const m = MONT[i], f = cl((u * MONT.length - i) / 6), y = lerp(m.y - 900, m.y, E.out(f)); P.floppy35(ctx, m.x, y, o.s ?? 1.6, { rot: m.rot, col: m.col }); } };
 // ---------- NUBES ----------
 const nube = (ctx, x, y, s, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffffff'; for (const [dx, dy, r] of [[0, 0, 60], [55, -20, 70], [120, 0, 55], [60, 20, 60]]) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill(); } ctx.restore(); };
 // ---------- DEDO CON LA TARJETA en la yema (mano ilustrada del canal + P.microSD) ----------
 const dedoTarjeta = (ctx, t, x, y, alto, o = {}) => { if (typeof window !== 'undefined' && window.MANOS_IMG) P.manoImg(ctx, 'lado_derecho', x, y, alto, { ancla: 'punta', ang: o.ang || 0 }); const mm = alto * 0.0052; P.microSD(ctx, x - mm * 1, y + mm * 9, mm, { rot: -0.08 }); if (o.glow) P.glow(ctx, x, y + mm * 9, mm * 22, '255,230,120', o.glow); };
 // ---------- CAJA DE DISQUETES (en el suelo o la mesa) ----------
 const cajaDisq = (ctx, x, yb, s = 1) => { ctx.save(); ctx.translate(x, yb); ctx.scale(s, s); for (let i = 0; i < 7; i++) { ctx.save(); ctx.translate(-110 + i * 36, -150 - 8 * Math.sin(i * 1.7)); ctx.rotate(-0.12 + 0.04 * i); ctx.fillStyle = DCOL[i % DCOL.length]; ctx.fillRect(-14, -60, 28, 120); ctx.fillStyle = '#b9c0c9'; ctx.fillRect(-14, -60, 28, 30); ctx.restore(); } ctx.fillStyle = '#c9b48a'; ctx.beginPath(); ctx.roundRect(-160, -160, 320, 160, 10); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-160, -160, 320, 26); ctx.fillStyle = '#fff'; ctx.fillRect(-90, -110, 180, 50); ctx.fillStyle = 'rgba(80,80,80,0.5)'; ctx.fillRect(-70, -95, 140, 8); ctx.fillRect(-70, -78, 100, 8); ctx.restore(); };
 // ---------- CELDA GRANDE (cajoncito en corte): el canal abajo, los electrones suben al cajón y la TAPA se cierra sobre ellos ----------
 const celdaGrande = (ctx, t, t0, tc, o = {}) => { const bx0 = 170, bx1 = 910, by0 = 760, by1 = 1180, lid = E.inOut(sm(tc - 0.45, tc, t));
  ctx.fillStyle = '#1b2a44'; ctx.fillRect(60, 1300, 960, 330); ctx.fillStyle = '#26406a'; ctx.fillRect(60, 1300, 960, 70); ctx.fillStyle = '#3f6e8f'; ctx.beginPath(); ctx.roundRect(60, 1300, 220, 120, 16); ctx.fill(); ctx.beginPath(); ctx.roundRect(800, 1300, 220, 120, 16); ctx.fill();
  ctx.fillStyle = 'rgba(143,216,255,0.25)'; ctx.fillRect(bx0 - 30, by1, bx1 - bx0 + 60, 120);   // capa aislante (túnel)
  ctx.fillStyle = '#16324f'; ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0); ctx.strokeStyle = '#8fd8ff'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(bx0, by0); ctx.lineTo(bx0, by1); ctx.lineTo(bx1, by1); ctx.lineTo(bx1, by0); ctx.stroke();
  const R = RNG(31), n = 11; for (let i = 0; i < n; i++) { const d = i * 0.07, u = sm(t0 + d, t0 + 0.9 + d, t), hx = lerp(-60 + i * 60, bx0 + 60 + (i % 5) * 140, E.inOut(u)), hy0 = 1340 + 20 * Math.sin(t * 6 + i), hy1 = by0 + 90 + Math.floor(i / 5) * 110; const jig = u >= 1 ? (lid >= 1 ? 22 : 34) : 6; const x = (u < 1 ? hx : bx0 + 60 + (i % 5) * 140) + jig * Math.sin(t * (7 + i) + i * 2), y = lerp(hy0, hy1, E.inOut(u)) + jig * Math.cos(t * (6 + i) + i);
   P.glow(ctx, x, y, 60, '255,210,63', 0.5); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a3a00'; ctx.fillRect(x - 13, y - 4, 26, 8); }
  // la tapa: se desliza desde la derecha y cierra el cajón
  const lx = lerp(bx1 + 40, bx0 - 8, lid); ctx.fillStyle = '#8fd8ff'; ctx.beginPath(); ctx.roundRect(lx, by0 - 40, bx1 - bx0 + 16, 44, 12); ctx.fill(); ctx.fillStyle = '#c9eeff'; ctx.fillRect(lx + 20, by0 - 32, bx1 - bx0 - 30, 10); ctx.fillStyle = '#56708a'; ctx.fillRect(lx + (bx1 - bx0) / 2 - 60, by0 - 120, 120, 80);
  if (lid >= 1) { const a = sm(tc, tc + 0.4, t); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(960, by0 - 60, 40, Math.PI, 0); ctx.stroke(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(910, by0 - 60, 100, 80, 12); ctx.fill(); ctx.restore(); } };

 // =====================================================================================================
 // ESCENAS (un plano por idea, ningún ángulo > 4 s; textos siempre encima de destellos y efectos)
 // =====================================================================================================
 const B = [];
 const golpe = (k, t0, g = 1) => { k.play('thud', t0, { f: 50, gain: 0.9 * g }); k.noise(t0, { dur: 0.5, color: 'brown', filter: 'lowpass', f: [[0, 1800], [0.5, 160]], gain: 0.3 * g, a: 0.002 }); };
 const crrr = (k, t0, t1, g = 1) => { for (let x = t0; x < t1; x += 0.11) k.noise(x, { dur: 0.07, filter: 'bandpass', f: 900 + 300 * Math.sin(x * 23), q: 3, gain: 0.07 * g, a: 0.004 }); k.tone(t0, { f: 95, type: 'sawtooth', dur: t1 - t0, gain: 0.025 * g, filter: 'lowpass', f2: 400, a: 0.05, hold: (t1 - t0) * 0.8 }); };
 const PREG = (ctx, t) => P.pregunta(ctx, '¿CÓMO CABE TODO / EN UNA UÑA?', t, 0, S(3) - 0.1, { capY: 330, px: 58, clave: 'UÑA', col: '#ff3b3b', x: 540, dy: 110 });
 const persona90 = (ctx, t, x, y, s, o = {}) => persona(ctx, t, x, y, s, Object.assign({ ropa: '#4f7f6a', pelo: '#3b2414', seed: 3 }, o));

 // ---------- 1 · GANCHO: la torre de disquetes se tambalea en la mesa y la persona de los 90 la mira → en «UÑA» la torre se comprime y la tarjeta sale a cámara (90 % del ancho) ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  if (PORTADA) { oficina90(ctx, 1, { mesa: 1560 }); ctx.fillStyle = 'rgba(30,25,20,0.25)'; ctx.fillRect(0, 0, W, HH); P.floppy35(ctx, 330, 1322, 5.0, { rot: -0.04, col: '#3a5fb0' }); dedoTarjeta(ctx, 1, 800, 1000, 820, { glow: 0.7 }); ctx.fillStyle = '#2a2220'; ctx.fillRect(0, 1790, W, HH); ctx.fillStyle = '#b8452f'; ctx.fillRect(0, 1784, W, 8); return; }
  const TU = Tk.una, sh = sacude(t, [[TU, 1.4]], 52), comp = sm(TU - 0.45, TU - 0.05, t), cam = camK(t, [[0, 560, 1200, 1.12], [TU, 540, 1180, 1.2]]);
  ctx.save(); zoomP(ctx, cam, sh); oficina90(ctx, t); ctx.save(); ctx.translate(500, 1320); ctx.scale(1 - 0.95 * comp, 1 - 0.95 * comp); ctx.rotate(comp * 2.5); ctx.translate(-500, -1320); torreDisq(ctx, t, 500, 1320, 26, 6.2, { sway: 1 - comp, desp: (i) => (i % 2 ? 1 : -1) * 6 * Math.sin(t * 4 + i) }); ctx.restore();
  persona90(ctx, t, 900, 1700, 0.95, { miedo: t > 1.2 ? 0.6 : 0.2, mira: -1 }); ctx.restore();
  if (t > TU - 0.3) { const u = sm(TU - 0.3, TU, t), back = sm(TU + 0.15, S(2), t), mm = lerp(4, 88, E.in(u)) * (1 - 0.45 * E.out(back)); tarjetaRX(ctx, t, 540 + sh[0], lerp(1230, 980, E.out(u)) + sh[1], mm, { rot: lerp(1.2, 0.05, u) + 0.2 * back, rx: 0 }); }
  fogonazo(ctx, t, [[TU, 0.6]]); PREG(ctx, t);
 }, sfx(k) { for (let i = 0; i < 10; i++) k.play('tock', 0.15 + i * 0.2, { f: 700 + 80 * (i % 3), gain: 0.12, minor: true }); k.play('whoosh', Tk.una - 0.45, { dur: 0.45, top: 2600, gain: 0.35, minor: true }); golpe(k, Tk.una, 1.2); k.play('pop', Tk.una + 0.03, { f: 260, gain: 0.35 }); } });

 // ---------- 2 · ¿Cómo pasamos de ESTO… (el disquete sobre la mesa) a ESTO? (la tarjeta en la punta del dedo, junto a la uña) ----------
 B.push({ t0: S(2), t1: S(4), in: { type: 'cut' }, draw(ctx, t) {
  if (t < S(3) - 0.05) { const cam = camK(t, [[S(2), 540, 1000, 1.0], [S(3), 540, 990, 1.06]]); ctx.save(); zoomP(ctx, cam); ctx.fillStyle = '#8a5b34'; ctx.fillRect(-300, -300, W + 600, HH + 600); ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 6; for (let y = -300; y < HH + 300; y += 70) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y + 30); ctx.stroke(); }
   P.floppy35(ctx, 540, 1010, 8.0, { rot: -0.08 + 0.05 * Math.sin(t * 1.5), col: '#3a5fb0' }); ctx.restore(); }
  else { const cam = camK(t, [[S(3), 540, 980, 1.0], [S(4), 540, 960, 1.1]]); ctx.save(); zoomP(ctx, cam); salaHoy(ctx, t); ctx.fillStyle = 'rgba(30,30,40,0.25)'; ctx.fillRect(-300, -300, W + 600, HH + 600); dedoTarjeta(ctx, t, 560, 700 + 6 * Math.sin(t * 2), 1250, { glow: 0.5 + 0.2 * Math.sin(t * 5) }); ctx.restore(); }
  PREG(ctx, t);
 }, sfx(k) { k.play('whoosh', S(3), { dur: 0.4, top: 1600, gain: 0.25, minor: true }); k.play('sparkle', S(3) + 0.1, { gain: 0.2 }); } });

 // ---------- 3 · La respuesta está en algo que no se ve. → la tarjeta gira y un barrido de rayos X deja ver por dentro ----------
 B.push({ t0: S(4), t1: S(5), in: { type: 'cut' }, draw(ctx, t) {
  const u = sm(S(4), S(5), t); ctx.fillStyle = '#0f1424'; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 980, 700, '60,120,255', 0.35); const rx = sm(Tk.ve - 1.2, Tk.ve, t);
  tarjetaRX(ctx, t, 540, 980, lerp(48, 62, E.inOut(u)), { rot: 0.25 * Math.sin((t - S(4)) * 0.9), rx, n: 12 });
  const sy = lerp(400, 1560, ((t - S(4)) * 0.6) % 1); ctx.fillStyle = 'rgba(143,216,255,0.25)'; ctx.fillRect(140, sy - 6, 800, 12);
 }, sfx(k) { k.tone(S(4), { f: [[0, 200], [2.8, 600]], type: 'sine', dur: 2.9, gain: 0.05 }); FX.revelar(k, Tk.ve - 1.1); } });

 // ---------- 4 · ¿Te acuerdas del ruidito del lector… y del temido «DISCO LLENO»? → el lector de cerca (lucecita, crrr) → la oficina: la barra de copia… y «DISCO LLENO»; la persona se desespera ----------
 B.push({ t0: S(5), t1: S(6), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.lector + 0.35, TL = Tk.lleno;
  if (t < tb) { const cam = camK(t, [[S(5), 700, 960, 1.6], [tb, 720, 970, 1.7]]); ctx.save(); zoomP(ctx, cam, [3 * Math.sin(t * 60), 0]); oficina90(ctx, t); pcBeige(ctx, t, 540, 1320, 1.0, { led: Math.sin(t * 14) > 0 ? 1 : 0, disco: '#3a5fb0', pantalla: pantallaCopia(0.2, 0) }); ctx.restore(); TAG(ctx, 'EL LECTOR', 470, 520, t, Tk.ruidito - 0.2, tb, { mono: true, col: '#ffffff', px: 60 }); }
  else { const p = sm(tb, TL - 0.15, t), err = t > TL - 0.05 ? (t - TL + 0.05) * 2 : 0, sh = sacude(t, [[TL, 0.5]], 22), cam = camK(t, [[tb, 540, 1080, 1.0], [S(6), 540, 1070, 1.05]]); ctx.save(); zoomP(ctx, cam, sh); oficina90(ctx, t); pcBeige(ctx, t, 470, 1320, 1.05, { led: t < TL && Math.sin(t * 14) > 0 ? 1 : 0, disco: '#3a5fb0', pantalla: pantallaCopia(p, err) }); cajaDisq(ctx, 200, 1880, 1.1); persona90(ctx, t, 880, 1900, 1.2, { miedo: t > TL ? 1 : 0, mira: -1 }); ctx.restore(); }
 }, sfx(k) { crrr(k, S(5) + 0.1, Tk.lleno - 0.1, 1.2); FX.etiqueta(k, Tk.ruidito - 0.2); for (let x = S(5) + 0.2; x < Tk.lleno; x += 0.36) k.play('tick', x, { f: 2600, gain: 0.05, minor: true }); k.play('error', Tk.lleno, { gain: 0.45 }); k.tone(Tk.lleno, { f: 'A4', type: 'square', dur: 0.35, gain: 0.05, filter: 'lowpass', f2: 2000 }); } });

 // ---------- 5 · Un disquete guardaba UN POCO MÁS DE UN MEGA. → el disquete de cerca y su «medidor» casi vacío ← «tin» 1 ----------
 B.push({ t0: S(6), t1: S(7), in: { type: 'cut' }, draw(ctx, t) {
  const cam = camK(t, [[S(6), 540, 960, 1.0], [S(7), 540, 930, 1.08]]); ctx.save(); zoomP(ctx, cam); ctx.fillStyle = '#d6c49c'; ctx.fillRect(-300, -300, W + 600, HH + 600); P.floppy35(ctx, 540, 1000, 7.2, { rot: 0.06 * Math.sin((t - S(6)) * 1.2), col: '#c0392b', shutter: sm(S(6) + 0.6, S(6) + 1.6, t) * 0.6 }); ctx.restore();
  TAG(ctx, 'UN POCO MÁS DE 1 MEGA', 470, 520, t, Tk.mega - 0.3, S(7), { mono: true, col: YE, px: 50 });
 }, sfx(k) { k.play('click', S(6) + 0.6, { gain: 0.4 }); k.play('swish', S(6) + 0.65, { dur: 0.4, gain: 0.25, minor: true }); FX.clave(k, Tk.mega - 0.3); } });

 // ---------- 6 · Por dentro era una BIBLIOTECA REDONDA: un disco con IMÁN que giraba, y una CABEZA que corría encima, → la caja se vuelve transparente: libros en estantes redondos → el disco magnético gira → la cabeza va y viene ----------
 B.push({ t0: S(7), t1: S(9), in: { type: 'cut' }, draw(ctx, t) {
  const t1 = S(8) - 0.05, t2 = Tk.cabeza - 0.35; ctx.fillStyle = '#141a2c'; ctx.fillRect(0, 0, W, HH);
  if (t < t1) { const u = sm(S(7), S(7) + 1.0, t), cam = camK(t, [[S(7), 540, 980, 1.0], [t1, 540, 960, 1.12]]); ctx.save(); zoomP(ctx, cam); corteDisq(ctx, t, 540, 1000, 9.0, { caja: lerp(1, 0.25, u), libros: sm(Tk.biblioteca - 0.4, Tk.biblioteca, t), ang: (t - S(7)) * 1.2, cab: 0.3 }); ctx.restore(); TAG(ctx, 'BIBLIOTECA REDONDA', 470, 520, t, Tk.biblioteca - 0.3, t1, { mono: true, col: YE, px: 54 }); }
  else if (t < t2) { const cam = camK(t, [[t1, 540, 1000, 1.1], [t2, 540, 1000, 1.0]]); ctx.save(); zoomP(ctx, cam); ctxGiro(ctx, 540, 1000, -0.35 + 0.15 * sm(t1, t2, t)); corteDisq(ctx, t, 540, 1000, 8.6, { caja: 0.2, ang: (t - t1) * 10, cab: 0.3 }); ctx.restore(); TAG(ctx, 'DISCO MAGNÉTICO', 470, 520, t, Tk.iman - 0.3, t2, { mono: true, col: NAR, px: 56 }); }
  else { const cab = 0.5 + 0.45 * Math.sin((t - t2) * 3.2), cam = camK(t, [[t2, 540, 760, 1.5], [S(9), 540, 740, 1.6]]); ctx.save(); zoomP(ctx, cam); corteDisq(ctx, t, 540, 1000, 8.6, { caja: 0.2, ang: (t - t1) * 10, cab, marcaCab: 1 }); ctx.restore(); TAG(ctx, 'LA CABEZA', 470, 520, t, Tk.cabeza - 0.2, S(9), { mono: true, col: CY, px: 60 }); }
 }, sfx(k) { FX.etiqueta(k, Tk.biblioteca - 0.3); k.play('paper', S(7) + 0.4, { gain: 0.2 }); FX.etiqueta(k, Tk.iman - 0.3); k.tone(S(8), { f: 80, type: 'sawtooth', dur: S(9) - S(8), gain: 0.03, filter: 'lowpass', f2: 500, a: 0.2, hold: 2 }); FX.etiqueta(k, Tk.cabeza - 0.2); for (let x = Tk.cabeza; x < S(9); x += 0.25) k.play('tick', x, { f: 1500, gain: 0.06, minor: true }); } });

 // ---------- 7 · leyendo y escribiendo PUNTITOS MAGNÉTICOS. → la pista en cámara lenta: la cabeza cambia los puntitos ----------
 B.push({ t0: S(9), t1: S(10), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.puntitos - 0.1; ctx.fillStyle = '#141a2c'; ctx.fillRect(0, 0, W, HH);
  if (t < tb) { const cam = camK(t, [[S(9), 540, 960, 1.0], [tb, 540, 960, 1.05]]); ctx.save(); zoomP(ctx, cam); P.magTrack(ctx, 0, 620, W, 760, t, { mode: 'write', speed: 120 }); ctx.restore(); }
  else { const cam = camK(t, [[tb, 520, 980, 1.25], [S(10), 560, 960, 1.15]]); ctx.save(); zoomP(ctx, cam); ctxGiro(ctx, 540, 980, 0.08); P.magTrack(ctx, 0, 620, W, 760, t, { mode: 'read', speed: 120 }); ctx.restore(); }
  TAG(ctx, 'PUNTITOS MAGNÉTICOS', 470, 520, t, Tk.puntitos - 0.2, S(10), { mono: true, col: AZ, px: 52 });
 }, sfx(k) { for (let x = S(9); x < S(10); x += 0.18) k.play('blip', x, { f: 700 + 200 * ((x * 10) % 2 > 1 ? 1 : 0), gain: 0.05, minor: true }); FX.etiqueta(k, Tk.puntitos - 0.2); } });

 // ---------- 8 · Todo se movía… por eso sonaba, y por eso PODÍA DAÑARSE. → el mecanismo del lector (motor, tornillo, cabeza) y el «crrr» → el disco rayado y con polvo; error ----------
 B.push({ t0: S(10), t1: S(13), in: { type: 'cut' }, draw(ctx, t) {
  const tb = S(12) - 0.05; ctx.fillStyle = '#141a2c'; ctx.fillRect(0, 0, W, HH);
  if (t < tb) { const cam = camK(t, [[S(10), 540, 980, 1.0], [tb, 560, 960, 1.12]]); ctx.save(); zoomP(ctx, cam, [2 * Math.sin(t * 70), 0]); lector(ctx, t, 540, 1050, 1.15, { ruido: sm(Tk.sonaba - 0.3, Tk.sonaba, t) }); ctx.restore(); TAG(ctx, 'TODO SE MOVÍA', 470, 520, t, Tk.movia - 0.3, tb, { mono: true, col: '#ffffff', px: 58 }); }
  else { const u = sm(tb, Tk.danarse, t), sh = sacude(t, [[Tk.danarse, 0.5]], 20), cam = camK(t, [[tb, 540, 980, 1.25], [S(13), 540, 980, 1.15]]); ctx.save(); zoomP(ctx, cam, sh); corteDisq(ctx, t, 540, 1000, 8.6, { caja: 0.2, ang: (t - tb) * 4, cab: 0.6 });
   ctx.strokeStyle = `rgba(255,255,255,${0.8 * u})`; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(540, 1000, 180 + i * 50, 0.3 + i, 0.3 + i + 0.9 * u); ctx.stroke(); } const R = RNG(12); for (let i = 0; i < 30; i++) { ctx.fillStyle = `rgba(230,220,200,${0.8 * u})`; ctx.beginPath(); ctx.arc(540 + (R() - 0.5) * 700, 1000 + (R() - 0.5) * 700, 4 + R() * 6, 0, TAU); ctx.fill(); } ctx.restore();
   marcaX(ctx, 540, 1000, 200, sm(Tk.danarse - 0.1, Tk.danarse + 0.2, t)); TAG(ctx, 'PODÍA DAÑARSE', 470, 520, t, Tk.danarse - 0.3, S(13), { mono: true, col: RD, px: 58 }); }
 }, sfx(k) { FX.etiqueta(k, Tk.movia - 0.3); crrr(k, S(10), S(12), 1.4); FX.etiqueta(k, Tk.danarse - 0.3); k.noise(S(12), { dur: 0.8, filter: 'highpass', f: 3000, gain: 0.05, a: 0.1 }); k.play('error', Tk.danarse, { gain: 0.3 }); } });

 // ---------- 9 · Tu tarjeta de hoy es OTRA BIBLIOTECA… pero SIN NADA QUE GIRE. → hoy: el hijo con el celular, asombrado → primer plano: la mano sostiene el celular y la tarjetita sale de su bandeja ----------
 B.push({ t0: S(13), t1: S(15), in: { type: 'cut' }, draw(ctx, t) {
  const tb = S(14) - 0.05;
  if (t < tb) { const cam = camK(t, [[S(13), 540, 1000, 1.0], [tb, 540, 980, 1.06]]), tr = sm(Tk.biblioteca2 - 0.6, Tk.biblioteca2, t); ctx.save(); zoomP(ctx, cam); salaHoy(ctx, t); persona(ctx, t, 440, 2560, 2.6, { ropa: '#e2a32b', pelo: '#2a1d16', seed: 6, miedo: 0.48, brazoD: [70, -420], brazoI: [10, -400], mira: 1 }); ctx.save(); ctx.translate(740, 1530); ctx.rotate(-0.12); ctx.fillStyle = '#1b1d24'; ctx.beginPath(); ctx.roundRect(-140, -260, 280, 520, 36); ctx.fill(); ctx.fillStyle = '#4fb4f0'; ctx.beginPath(); ctx.roundRect(-118, -230, 236, 460, 22); ctx.fill(); P.glow(ctx, 0, 0, 200, '200,240,255', 0.5); P.microSD(ctx, 0, -10, 7, { rot: 0 }); P.glow(ctx, 0, -10, 120, '255,230,120', 0.5 + 0.3 * Math.sin(t * 6)); ctx.fillStyle = '#9aa3b2'; const tx = 140 + 70 * E.out(tr); ctx.fillRect(140, 90, tx - 140 + 30, 40); P.microSD(ctx, tx, 110, 5, { rot: Math.PI / 2 }); if (tr > 0.2) P.glow(ctx, tx, 110, 90, '255,230,120', 0.6); ctx.restore(); ctx.restore(); TAG(ctx, 'OTRA BIBLIOTECA', 470, 520, t, Tk.biblioteca2 - 0.4, tb, { mono: true, col: YE, px: 60 }); }
  else { const u = sm(tb, tb + 0.8, t), cam = camK(t, [[tb, 540, 1000, 1.0], [S(15), 540, 980, 1.08]]); ctx.save(); zoomP(ctx, cam); salaHoy(ctx, t); ctx.fillStyle = 'rgba(20,20,30,0.35)'; ctx.fillRect(-300, -300, W + 600, HH + 600); if (typeof window !== 'undefined' && window.MANOS_IMG) P.manoImg(ctx, 'sujeta_celular', 600, 1600, 1150, { ancla: 'base' }); const tx = lerp(640, 330, E.out(u)); ctx.fillStyle = '#9aa3b2'; ctx.fillRect(tx - 70, 860, 140, 44); P.microSD(ctx, tx - 20, 882, 7.5, { rot: Math.PI / 2 }); ctx.restore();
   const a = sm(Tk.gire - 0.5, Tk.gire, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.translate(300, 1250); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, 80, 0.4, 5.6); ctx.stroke(); flecha(ctx, Math.cos(5.4) * 80, Math.sin(5.4) * 80, Math.cos(5.8) * 80, Math.sin(5.8) * 80, '#ffffff', 12); ctx.restore(); marcaX(ctx, 300, 1250, 110, a); }
   TAG(ctx, 'SIN NADA QUE GIRE', 470, 520, t, Tk.gire - 0.5, S(15), { mono: true, col: GR, px: 56 }); }
 }, sfx(k) { k.play('sparkle', S(13) + 0.2, { gain: 0.15 }); FX.etiqueta(k, Tk.biblioteca2 - 0.4); k.play('click', S(14) + 0.1, { gain: 0.5 }); k.play('swish', S(14) + 0.15, { dur: 0.5, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.gire - 0.5); } });

 // ---------- 10 · Son MILES DE MILLONES de cajoncitos diminutos que guardan ELECTRICIDAD ENCERRADA. → rayos X: la tarjeta → el chip se abre → la rejilla de celdas → una celda con electrones atrapados ----------
 B.push({ t0: S(15), t1: S(16), in: { type: 'cut' }, draw(ctx, t) {
  const t1 = Tk.cajoncitos - 0.1, t2 = Tk.electricidad - 0.3; ctx.fillStyle = '#0f1424'; ctx.fillRect(0, 0, W, HH);
  if (t < t1) { const u = sm(S(15), t1, t), cam = camK(t, [[S(15), 540, 980, 1.0], [t1, 540, 960, 1.3]]); ctx.save(); zoomP(ctx, cam); tarjetaRX(ctx, t, 540, 1000, 60, { rx: 1, n: 14, rot: -0.1 + 0.1 * u }); ctx.restore(); TAG(ctx, 'MILES DE MILLONES', 470, 520, t, Tk.miles - 0.3, t1 + 0.6, { mono: true, col: YE, px: 56 }); }
  else if (t < t2) { const cam = camK(t, [[t1, 540, 980, 1.0], [t2, 540, 980, 1.1]]); ctx.save(); zoomP(ctx, cam); ctxGiro(ctx, 540, 980, -0.05); P.flashCells(ctx, 90, 560, 900, 840, t, { cols: 8, rows: 7, prog: sm(t1, t2, t) }); ctx.restore(); TAG(ctx, 'CAJONCITOS (CELDAS)', 470, 520, t, t1 + 0.6, t2, { mono: true, col: CY, px: 50 }); }
  else { const cam = camK(t, [[t2, 540, 980, 1.0], [S(16), 540, 960, 1.08]]); ctx.save(); zoomP(ctx, cam); celdaGrande(ctx, t, t2, Tk.encerrada); ctx.restore(); TAG(ctx, 'ELECTRICIDAD ENCERRADA', 470, 520, t, Tk.electricidad - 0.2, S(16), { mono: true, col: YE, px: 46 }); }
 }, sfx(k) { FX.etiqueta(k, Tk.miles - 0.3); k.tone(S(15), { f: [[0, 300], [1.5, 700]], type: 'sine', dur: 1.6, gain: 0.04 }); FX.etiqueta(k, Tk.cajoncitos + 0.5); for (let x = Tk.cajoncitos; x < Tk.electricidad; x += 0.12) k.play('blip', x, { f: 1200, gain: 0.04, minor: true }); FX.etiqueta(k, Tk.electricidad - 0.2); FX.burbujas(k, Tk.electricidad, 1.5, 8, 3, 0.6); } });

 // ---------- 11 · Se encogieron tanto que ya no podían achicarse más. → la rejilla se vuelve cada vez más fina → una celda tan pequeña que casi no le caben electrones ----------
 B.push({ t0: S(16), t1: S(17), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.achicarse - 0.3; ctx.fillStyle = '#0f1424'; ctx.fillRect(0, 0, W, HH);
  if (t < tb) { const u = sm(S(16), tb, t), n = Math.round(lerp(6, 26, E.inOut(u))); ctx.save(); zoomP(ctx, camK(t, [[S(16), 540, 980, 1.0], [tb, 540, 980, 1.05]])); P.flashCells(ctx, 90, 560, 900, 840, t, { cols: n, rows: n, prog: 1 }); ctx.restore(); TAG(ctx, 'MÁS Y MÁS PEQUEÑAS', 470, 520, t, Tk.encogieron - 0.2, tb, { mono: true, col: CY, px: 54 }); }
  else { const u = sm(tb, S(17), t), sc = lerp(1, 0.75, E.out(u)); ctx.save(); ctx.translate(540, 980); ctx.scale(sc, sc); ctx.translate(-540, -980); P.flashCell(ctx, 120, 560, 840, 820, t, { charge: lerp(1, 0.3, u) }); ctx.restore(); anillo(ctx, t, 540, 980, 420 * sc, u, RD); for (let i = 0; i < 2; i++) { const xx = i ? 900 : 180; ctx.save(); ctx.globalAlpha = 0.5; P.flashCell(ctx, xx - 120, 820, 240, 240, t, { charge: 0.2 }); ctx.restore(); } TAG(ctx, 'NO PODÍAN ACHICARSE MÁS', 470, 520, t, Tk.achicarse - 0.2, S(17), { mono: true, col: RD, px: 46 }); }
 }, sfx(k) { FX.etiqueta(k, Tk.encogieron - 0.2); k.tone(S(16), { f: [[0, 500], [2, 1400]], type: 'triangle', dur: 2.2, gain: 0.035 }); FX.etiqueta(k, Tk.achicarse - 0.2); k.play('error', Tk.achicarse + 0.3, { gain: 0.15 }); } });

 // ---------- 12 · Así que los APILARON, como un EDIFICIO de MÁS DE CIEN PISOS. → los pisos de celdas se apilan desde abajo → el edificio entero con el contador ← «tin» 2 ----------
 B.push({ t0: S(17), t1: S(18), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.edificio - 0.2, n = lerp(1, 101, E.in(sm(Tk.apilaron - 0.3, Tk.cien, t))); ctx.fillStyle = '#0f1424'; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 1200, 700, '60,140,255', 0.3);
  if (t < tb) { const cam = camK(t, [[S(17), 540, 1150, 1.0], [tb, 540, 1120, 1.05]]); ctx.save(); zoomP(ctx, cam); capas(ctx, t, 540, 1480, Math.max(8, Math.min(n, 40)), { hp: 12, w: 760, d: 360 }); ctx.restore(); TAG(ctx, 'APILADAS', 470, 520, t, Tk.apilaron - 0.2, tb, { mono: true, col: CY, px: 60 }); }
  else { const cam = camK(t, [[tb, 540, 1150, 1.0], [S(18), 540, 1120, 0.96]]); ctx.save(); zoomP(ctx, cam); ctxGiro(ctx, 540, 1150, 0.03 * Math.sin(t)); capas(ctx, t, 540, 1580, n, { hp: 8, w: 760, d: 360 }); ctx.restore(); txt(ctx, (n >= 100 ? '+100' : Math.floor(n)) + ' PISOS', 540, 1480, 70, YE, { w: 900, f: 'Fredoka' }); TAG(ctx, 'MÁS DE 100 PISOS', 470, 520, t, Tk.cien - 0.3, S(18), { mono: true, col: YE, px: 60 }); }
 }, sfx(k) { FX.etiqueta(k, Tk.apilaron - 0.2); for (let x = Tk.apilaron; x < Tk.cien; x += 0.09) k.play('tick', x, { f: 1800 + 600 * ((x - Tk.apilaron) / 3), gain: 0.05, minor: true }); FX.clave(k, Tk.cien - 0.3); k.play('thud', Tk.cien, { f: 70, gain: 0.4 }); } });

 // ---------- 13 · ¿Cuántos disquetes caben en una tarjeta de QUINIENTOS DOCE GIGAS? [pausa larga] → la tarjeta en la mesa y un disquete al lado → empiezan a caer disquetes alrededor (suspenso) ----------
 B.push({ t0: S(18), t1: S(19), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.gigas + 0.35;
  if (t < tb) { const cam = camK(t, [[S(18), 540, 1000, 1.0], [tb, 540, 990, 1.08]]); ctx.save(); zoomP(ctx, cam); ctx.fillStyle = '#d6c49c'; ctx.fillRect(-300, -300, W + 600, HH + 600); ctx.fillStyle = '#8a5b34'; ctx.fillRect(-300, 1260, W + 600, 900); P.floppy35(ctx, 400, 1000, 6.4, { rot: -0.08, col: '#3a5fb0' }); P.microSD(ctx, 900, 1180, 6.4, { rot: 0.1 }); P.glow(ctx, 900, 1180, 180, '255,230,120', 0.4 + 0.2 * Math.sin(t * 4)); ctx.restore(); TAG(ctx, 'TARJETA DE 512 GIGAS', 470, 520, t, Tk.quinientos - 0.3, tb, { mono: true, col: YE, px: 52 }); }
  else { const u = sm(tb, S(19), t), cam = camK(t, [[tb, 540, 1290, 1.22], [S(19), 540, 1280, 1.18]]); ctx.save(); zoomP(ctx, cam); ctx.fillStyle = '#c9d6e8'; ctx.fillRect(-300, -300, W + 600, HH + 600); ctx.fillStyle = '#8a5b34'; ctx.fillRect(-300, 1560, W + 600, 900); ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 6; for (let y = 1600; y < 2300; y += 60) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); } montana(ctx, t, 0.35 + 0.25 * u); P.microSD(ctx, 540, 1610, 3.0, { rot: 0 }); P.glow(ctx, 540, 1610, 90, '255,230,120', 0.6); ctx.restore(); }
 }, sfx(k) { FX.etiqueta(k, Tk.quinientos - 0.3); const tb = Tk.gigas + 0.35; for (let i = 0; i < 14; i++) k.play('tock', tb + i * 0.12, { f: 500 + 50 * (i % 4), gain: 0.06, minor: true }); FX.latido(k, Tk.gigas + 0.3, 3, 0.5); } });

 // ---------- 14 · MÁS DE TRESCIENTOS MIL. → ¡golpe! la avalancha de disquetes llena la pantalla y el número gigante ← «tin» 3 ----------
 B.push({ t0: S(19), t1: S(20), in: { type: 'cut' }, draw(ctx, t) {
  const TT = Tk.trescientos, sh = sacude(t, [[TT, 1.3]], 48), u = sm(S(19), TT + 0.4, t);
  ctx.save(); zoomP(ctx, [540, 1280, 1.18], sh); ctx.fillStyle = '#c9d6e8'; ctx.fillRect(-300, -300, W + 600, HH + 600); ctx.fillStyle = '#8a5b34'; ctx.fillRect(-300, 1560, W + 600, 900); ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 6; for (let y = 1600; y < 2300; y += 60) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); } montana(ctx, t, lerp(0.6, 1, E.out(u))); ctx.restore();
  ctx.fillStyle = 'rgba(15,20,36,0.45)'; ctx.fillRect(0, 0, W, HH); if (t > TT - 0.05) { const pop = 1 + 0.3 * Math.exp(-(t - TT) * 8); ctx.save(); ctx.translate(540, 980); ctx.scale(pop, pop); txt(ctx, '+300.000', 0, 0, 190, '#ffffff', { w: 1000, f: 'Fredoka' }); ctx.restore(); }
  fogonazo(ctx, t, [[TT, 0.6]]); TAG(ctx, 'DISQUETES', 470, 1330, t, TT, S(20), { mono: true, col: YE, px: 64 });
 }, sfx(k) { for (let i = 0; i < 30; i++) k.play('tock', S(19) + i * 0.05, { f: 400 + 40 * (i % 7), gain: 0.06, minor: true }); golpe(k, Tk.trescientos, 1.1); FX.clave(k, Tk.trescientos + 0.05); } });

 // ---------- 15 · Apilados, serían una TORRE de MÁS DE UN KILÓMETRO. → la torre de disquetes sube y la cámara la sigue entre las nubes → la regla marca 1 KM ← «tin» 4 ----------
 B.push({ t0: S(20), t1: S(21), in: { type: 'cut' }, draw(ctx, t) {
  const u = E.inOut(sm(S(20), Tk.kilometro + 0.2, t)), top = lerp(820, -1400, E.inOut(sm(S(20), Tk.kilometro, t))), camY = Math.max(0, 460 - top);
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, `rgb(${Math.round(lerp(150, 40, u))},${Math.round(lerp(200, 90, u))},${Math.round(lerp(240, 180, u))})`); g.addColorStop(1, '#bcd8f0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  ctx.save(); ctx.translate(0, camY); ctx.fillStyle = '#7a8a5a'; ctx.fillRect(-100, 1560, W + 200, 800); for (const [x, y, s] of [[80, 900, 1.2], [700, 400, 1.5], [120, -200, 1.3], [760, -900, 1.6], [60, -1500, 1.2], [700, -2100, 1.4]]) nube(ctx, x, y, s, 0.85);
   const w = 700; for (let y = 1560; y > top; y -= 18) { const i = Math.round((1560 - y) / 18); ctx.fillStyle = DCOL[(i * 3) % DCOL.length]; ctx.fillRect(470 - w / 2, y - 17, w, 17); ctx.fillStyle = '#b9c0c9'; ctx.fillRect(470 - w / 2 + w * 0.3, y - 17, w * 0.35, 17); }
   persona(ctx, t, 900, 1560, 0.5, { ropa: '#e2a32b', miedo: 0.6, mira: -1, seed: 6 });
   ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(1000, 1560); ctx.lineTo(1000, -1040); ctx.stroke(); for (let k = 0; k <= 10; k++) { const y = lerp(1560, -1040, k / 10); ctx.beginPath(); ctx.moveTo(1000, y); ctx.lineTo(k % 5 ? 970 : 940, y); ctx.stroke(); }
  ctx.restore(); if (t > Tk.kilometro - 0.3) { const a = sm(Tk.kilometro - 0.3, Tk.kilometro, t); ctx.save(); ctx.globalAlpha = a; txt(ctx, '1 KM', 900, -1040 + camY - 50, 70, YE, { w: 900, f: 'Fredoka' }); ctx.restore(); }
  TAG(ctx, 'MÁS DE 1 KILÓMETRO', 470, 520, t, Tk.kilometro - 0.3, S(21), { mono: true, col: YE, px: 56 });
 }, sfx(k) { k.play('riser', S(20), { dur: Tk.kilometro - S(20), gain: 0.35 }); k.noise(S(20), { dur: 2.5, filter: 'bandpass', f: 600, q: 0.6, gain: 0.06, a: 0.5 }); FX.clave(k, Tk.kilometro - 0.3); } });

 // ---------- 16 · Y todo eso… en una UÑA. → FINAL en primer plano: el disquete grande y, al lado, la tarjetita en la punta del dedo ----------
 B.push({ t0: S(21), t1: S(23), in: { type: 'cut' }, draw(ctx, t) {
  const cam = camK(t, [[S(21), 560, 1040, 1.15], [S(23), 580, 1030, 1.25]]); ctx.save(); zoomP(ctx, cam); ctx.fillStyle = '#d6c49c'; ctx.fillRect(-300, -300, W + 600, HH + 600); ctx.fillStyle = '#8a5b34'; ctx.fillRect(-300, 1300, W + 600, 900); ctx.fillStyle = '#a56d3f'; ctx.fillRect(-300, 1300, W + 600, 14);
  P.floppy35(ctx, 330, 1080, 4.6, { rot: -0.06, col: '#3a5fb0' }); dedoTarjeta(ctx, t, 820, 760 + 5 * Math.sin(t * 2), 1100, { glow: 0.4 + 0.5 * sm(Tk.una2 - 0.3, Tk.una2, t) }); ctx.restore();
 }, sfx(k) { k.play('sparkle', Tk.una2 - 0.1, { gain: 0.25 }); k.tone(Tk.una2, { f: 'C5', dur: 1.2, gain: 0.05, verb: 0.5 }); k.tone(Tk.una2 + 0.12, { f: 'G5', dur: 1.2, gain: 0.04, verb: 0.5 }); } });

 // ---------- 17 · CIERRE ----------
 B.push({ t0: S(23), t1: DURATION, in: { type: 'cut' }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#3a5fb0'); g.addColorStop(1, '#1b2340'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  P.ctaShare(ctx, t, S(23) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { cc.fillStyle = '#d6c49c'; cc.fillRect(0, 0, W, HH); P.floppy35(cc, 330, 1000, 4.6, { col: '#3a5fb0' }); P.microSD(cc, 800, 1000, 6, {}); }), names: ['Andrés', 'Paola', 'Jorge', 'Lucía'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(23) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'cartoon', capBorde: true, marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  etiquetas: 'suave',   // v1.42: etiquetas a −10 dB; el «tin» (FX.clave) solo en «1 mega», «100 pisos», «300.000» y «1 km»
  keywords: [],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 400, gain: 0.02, a: 0.05, hold: DURATION - 2.5 }); },
  music(k) { MUS.piano(k, 0, S(18), { bpm: 84, gain: 0.7, strings: 0.6, chords: [['D3', 'F#3', 'A3', 'D4'], ['B2', 'D3', 'F#3', 'B3'], ['G2', 'B2', 'D3', 'G3'], ['A2', 'C#3', 'E3', 'A3']] }); MUS.pulso(k, S(19), DURATION, { bpm: 100, gain: 0.5, chords: [['D3', 'F#3', 'A3', 'D4'], ['G2', 'B2', 'D3', 'G3'], ['B2', 'D3', 'F#3', 'B3'], ['A2', 'C#3', 'E3', 'A3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
