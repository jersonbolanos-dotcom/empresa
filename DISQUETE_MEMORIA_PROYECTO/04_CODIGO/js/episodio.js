// =====================================================================================================
// episodio.js — Del disquete a las memorias diminutas · PLANTILLA ASOMBROTECA v2.0 (modo viral, completo) · «cartoon» (oficina de los 90 → hoy)
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
 const TAG = (ctx, s_, x, y, t, t0, t1, o) => P.tag(ctx, s_, x, y, t, t0 - 0.25, t1 - 0.25, Object.assign({ bg: '#26304a' }, o));   // fondo sólido: nunca se ve transparente
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
 const lector = (ctx, t, cx, cy, s, o = {}) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); const ph = t * 8; ctx.fillStyle = '#d8cdb3'; ctx.beginPath(); ctx.roundRect(-440, -420, 880, 680, 30); ctx.fill(); ctx.fillStyle = '#c9bc9f'; ctx.fillRect(-440, 180, 880, 80); ctx.fillStyle = '#2a2a2e'; ctx.fillRect(-300, 205, 600, 24); ctx.fillStyle = '#3cff6a'; ctx.beginPath(); ctx.arc(360, 217, 10, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(20,26,44,0.9)'; ctx.beginPath(); ctx.roundRect(-410, -390, 820, 560, 22); ctx.fill(); for (const [sx, sy] of [[-410, -390], [410, -390], [-410, 170], [410, 170]]) { ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.arc(sx * 0.95, sy * 0.95 + (sy > 0 ? -8 : 8), 9, 0, TAU); ctx.fill(); }
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
 const MONT = (() => { const R = RNG(77), out = []; for (let i = 0; i < 170; i++) { const u = R() + R() - 1, x = 540 + u * 560, hmax = 760 * (1 - Math.abs(u)), y = 1560 - R() * hmax; out.push({ x, y, rot: (R() - 0.5) * 1.6, col: ['#2b2f36', '#3a5fb0', '#59606e', '#23262d', '#3a5fb0'][i % 5], d: R() }); } return out.sort((a, b) => b.y - a.y); })();
 const montana = (ctx, t, u, o = {}) => { const n = Math.floor(MONT.length * cl(u)); for (let i = 0; i < n; i++) { const m = MONT[i], f = cl((u * MONT.length - i) / 6), y = lerp(m.y - 900, m.y, E.out(f)); P.floppy35(ctx, m.x, y, o.s ?? 1.6, { rot: m.rot, col: m.col }); } };
 // ---------- NUBES ----------
 const nube = (ctx, x, y, s, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffffff'; for (const [dx, dy, r] of [[0, 0, 60], [55, -20, 70], [120, 0, 55], [60, 20, 60]]) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill(); } ctx.restore(); };
 // ---------- DEDO CON LA TARJETA en la yema (mano ilustrada del canal + P.microSD) ----------
 const dedoTarjeta = (ctx, t, x, y, alto, o = {}) => { P.manoV(ctx, 'lado_derecho', x, y, alto, { ancla: 'punta', ang: o.ang || 0, piel: '#e0a77e' }); const mm = alto * 0.0058; P.microSD(ctx, x, y + mm * 8.2, mm, { rot: -0.06 }); if (o.glow) P.glow(ctx, x, y + mm * 8, mm * 22, '255,230,120', o.glow); };
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
 // ---------- CELDA QUE SE ENCOGE (llena la pantalla): las paredes se juntan y caben menos electrones ----------
 const celdaEncoge = (ctx, t, u) => { const w = mix2(740, 300, E.inOut(u)), bx0 = 540 - w / 2, bx1 = 540 + w / 2, by0 = 760, by1 = 1180, n = Math.max(2, Math.round(11 - 9 * u));
  ctx.fillStyle = '#1b2a44'; ctx.fillRect(-100, 1300, 1280, 330); ctx.fillStyle = '#26406a'; ctx.fillRect(-100, 1300, 1280, 70); ctx.fillStyle = 'rgba(143,216,255,0.25)'; ctx.fillRect(bx0 - 30, by1, w + 60, 120);
  ctx.fillStyle = '#16324f'; ctx.fillRect(bx0, by0, w, by1 - by0); ctx.strokeStyle = '#8fd8ff'; ctx.lineWidth = 16; ctx.strokeRect(bx0, by0, w, by1 - by0);
  for (let i = 0; i < n; i++) { const cols = Math.max(1, Math.floor(w / 140)), x = bx0 + 70 + (i % cols) * ((w - 140) / Math.max(1, cols - 1 || 1)) + 18 * Math.sin(t * (7 + i) + i), y = by0 + 90 + Math.floor(i / cols) * 110 + 18 * Math.cos(t * (6 + i)); if (y > by1 - 40) continue; P.glow(ctx, x, y, 60, '255,210,63', 0.5); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a3a00'; ctx.fillRect(x - 13, y - 4, 26, 8); }
  for (const s of [-1, 1]) { const ax = 540 + s * (w / 2 + 120); flecha(ctx, ax + s * 100, 970, ax, 970, RD, 22); } };
 const mix2 = (a, b, k) => a + (b - a) * k;

 // =====================================================================================================
 // ESCENAS (un plano por idea, ningún ángulo > 4 s; textos siempre encima de destellos y efectos)
 // =====================================================================================================
 const B = [];
 const golpe = (k, t0, g = 1) => { k.play('thud', t0, { f: 50, gain: 0.9 * g }); k.noise(t0, { dur: 0.5, color: 'brown', filter: 'lowpass', f: [[0, 1800], [0.5, 160]], gain: 0.3 * g, a: 0.002 }); };
 const crrr = (k, t0, t1, g = 1) => { for (let x = t0; x < t1; x += 0.11) k.noise(x, { dur: 0.07, filter: 'bandpass', f: 900 + 300 * Math.sin(x * 23), q: 3, gain: 0.07 * g, a: 0.004 }); k.tone(t0, { f: 95, type: 'sawtooth', dur: t1 - t0, gain: 0.025 * g, filter: 'lowpass', f2: 400, a: 0.05, hold: (t1 - t0) * 0.8 }); };
 const PREG = (ctx, t) => P.pregunta(ctx, '¿CÓMO CABE TODO / EN UNA UÑA?', t, 0, S(3) - 0.1, { capY: 330, px: 58, clave: 'UÑA', col: '#ff3b3b', x: 540, dy: 110 });
 const persona90 = (ctx, t, x, y, alto, o = {}) => P.personaje(ctx, t, x, y, alto, Object.assign({ tipo: 'adulto', ropa: '#4f7f6a', ropa2: '#3a3550', corbata: '#c0392b', seed: 3, piel: '#e0a77e' }, o));

 // ---------- v2.0 · MODO VIRAL · 0 → S(6): UN SOLO MUNDO CONTINUO, SIN CORTES ----------
 // Fotograma 0: avalancha de disquetes en primerísimo plano (llena la pantalla, ya cayendo). En «uña» todos se meten en la tarjeta que
 // descansa sobre la uña (dedo en primerísimo plano, P.dedoPP). «¿Cómo pasamos de esto…» → la cámara viaja al disquete (escala real) →
 // «…a esto?» → los dos a la vez, a escala real, y el contador «DISQUETES QUE CABEN» → «algo que no se ve»: la cámara ATRAVIESA la tarjeta
 // (celdas con electricidad encerrada) → «¿Te acuerdas del ruidito del lector…?»: sale por la ranura de la disquetera beige → «disco lleno».
 // Un solo texto en el gancho («CABEN EN UNA UÑA»). Mundo: escritorio oscuro; 1 mm = 8,5 px de mundo (disquete 90 mm, tarjeta 11 × 15 mm, uña ≈ 13 mm).
 const VCOL = ['#2b2f36', '#3a5fb0', '#2b2f36', '#59606e', '#3a5fb0', '#23262d'];
 const DEDO_P = [1500, 900], DEDO_AN = 150, MM = 7.2, CARD = [1500, 900 + DEDO_AN * 0.45], DISQ = [500, 1100], DISQ_S = 8.5;
 const AVA = (() => { const R = RNG(2024), out = []; for (let i = 0; i < 46; i++) out.push({ x0: R() * 1300 - 110, y0: R() * 2700 - 400, vy: 700 + R() * 600, vx: (R() - 0.5) * 220, r0: R() * 6, sp: (R() - 0.5) * 3.2, s: 2.6 + R() * 4.2, col: VCOL[i % VCOL.length], d: R() }); return out.sort((a, b) => a.s - b.s); })();
 const camV = (t) => P.camino(t, [[0, 1500, 985, 3.0], [1.7, 1500, 992, 3.25], [Tk.una, 1500, 1000, 3.7], [S(2), 1500, 1000, 3.9], [Tk.esto1 - 0.15, 500, 1100, 1.12], [Tk.esto2 - 0.35, 520, 1100, 1.06], [Tk.esto2 + 0.3, 1500, 933, 3.6], [S(4), 1500, 940, 3.75]]);
 const aPantalla = (cam, p) => [(p[0] - cam[0]) * cam[2] + 540, (p[1] - cam[1]) * cam[2] + 960];
 const mesaOscura = (ctx) => { ctx.fillStyle = '#10121a'; ctx.fillRect(-3000, -3000, 8000, 9000); ctx.strokeStyle = 'rgba(255,255,255,0.025)'; ctx.lineWidth = 6; for (let y = -1000; y < 4000; y += 46) { ctx.beginPath(); ctx.moveTo(-1000, y); ctx.bezierCurveTo(600, y + 18, 1400, y - 14, 3200, y + 10); ctx.stroke(); } };
 const mundoV = (ctx, t, cardA = 1, parte = 'todo') => {
  if (parte !== 'dedo') { mesaOscura(ctx); P.resplandor(ctx, 1250, 1000, 1300, '255,196,140', 0.16); P.floppy35(ctx, DISQ[0], DISQ[1], DISQ_S, { rot: -0.1, col: '#3a5fb0' }); }
  if (parte === 'fondo') return;
  const d = P.dedoPP(ctx, DEDO_P[0], DEDO_P[1], DEDO_AN, { vista: 'dorso', piel: 'medio', largo: 2600, luz: 0.8 });
  if (cardA > 0) { ctx.save(); ctx.globalAlpha *= cardA; P.microSD(ctx, d.una[0], d.una[1] + 2, MM, { rot: -0.07 }); P.reflejo(ctx, (c) => { c.beginPath(); c.rect(d.una[0] - 5.5 * MM, d.una[1] - 7.5 * MM, 11 * MM, 15 * MM); }, t, { ancho: 30, a: 0.35, vel: 0.5 }); ctx.restore(); }
 };
 const avalancha = (ctx, t, tgt, capa) => { for (const f of AVA) { const c = E.in(sm(1.55 + 0.35 * f.d, Tk.una - 0.04, t)); if (c >= 1) continue; const atras = f.d < 0.6 && c <= 0; if ((capa === 'atras' && !atras) || (capa === 'delante' && atras)) continue; let y = f.y0 + f.vy * t + 380 * t * t; y = ((y + 500) % 2900 + 2900) % 2900 - 500; const x = f.x0 + f.vx * t, ang = c * 5, rx = x - tgt[0], ry = y - tgt[1], k = 1 - c;
   const px = tgt[0] + (rx * Math.cos(ang) - ry * Math.sin(ang)) * k, py = tgt[1] + (rx * Math.sin(ang) + ry * Math.cos(ang)) * k, s = f.s * Math.pow(k, 1.4) * (0.85 + 0.15 * (1 - c));
   if (s < 0.05) continue; const dib = (cc) => P.floppy35(cc, px, py, s, { rot: f.r0 + f.sp * t + c * 3, col: f.col }); if (f.s < 3.6 && c < 0.3) P.capaDesenfoque(ctx, 7, dib); else dib(ctx); } };
 const interiorV = (ctx, t) => { ctx.fillStyle = '#060c1f'; ctx.fillRect(0, 0, W, HH); P.resplandor(ctx, 540, 960, 900, '60,120,255', 0.35);
  const av = (t * 0.9) % 1;
  for (let r = 15; r >= 0; r--) { const z = 0.7 + (r - av) * 0.55; if (z <= 0.35) continue; const sc = 1 / z, fade = Math.min(1, 2.2 / (z + 0.4)); for (const lado of [1, -1]) { const yy = 960 + lado * 330 * sc; for (let c = -5; c <= 5; c++) { const x = 540 + c * 250 * sc, cw = 205 * sc, ch = 120 * sc; if (x < -cw || x > W + cw) continue;
     ctx.save(); ctx.globalAlpha = fade; ctx.fillStyle = lado > 0 ? '#16295a' : '#132250'; ctx.strokeStyle = 'rgba(143,216,255,0.55)'; ctx.lineWidth = Math.max(1, 4 * sc); ctx.beginPath(); ctx.roundRect(x - cw / 2, yy - ch / 2, cw, ch, 14 * sc); ctx.fill(); ctx.stroke();
     const on = ((c * 7 + (r + Math.floor(t * 0.9)) * 3 + (lado > 0 ? 1 : 0)) % 3) !== 0; if (on) { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, yy, 26 * sc, 0, TAU); ctx.fill(); if (z < 3.5) P.resplandor(ctx, x, yy, 90 * sc, '255,210,80', 0.5 * fade); } ctx.restore(); } } }
  P.particulas(ctx, t, { tipo: 'chispas', n: 40, area: [0, 300, W, 1700], a: 0.7, seed: 11 }); };
 const camOf = (t) => P.camino(t, [[S(5) - 0.2, 730, 1223, 2.4], [Tk.lector + 0.35, 735, 1226, 2.7], [Tk.lleno - 0.6, 540, 1110, 1.2], [Tk.lleno + 0.25, 540, 1120, 1.27], [S(6) - 0.35, 640, 1180, 1.42]]);
 const oficinaV = (ctx, t, cam) => { ctx.save(); P.aplicaCamara(ctx, cam, cam[4] ? [3 * Math.sin(t * 60), 0] : [0, 0]); oficina90(ctx, t); const p = sm(S(5) + 0.4, Tk.lleno - 0.15, t), err = t > Tk.lleno - 0.05 ? (t - Tk.lleno + 0.05) * 2 : 0;
  pcBeige(ctx, t, 540, 1320, 1.0, { led: t < Tk.lleno && t > S(5) && Math.sin(t * 14) > 0 ? 1 : 0, disco: '#3a5fb0', pantalla: pantallaCopia(p, err) }); teclado(ctx); manosTeclado(ctx, t); ctx.restore();
  ctx.fillStyle = 'rgba(8,10,24,0.5)'; ctx.fillRect(0, 0, W, HH); const led = aPantalla(cam, [640, 1242]); P.resplandor(ctx, led[0], led[1], 180 * cam[2], '60,255,110', t < Tk.lleno && Math.sin(t * 14) > 0 ? 0.45 : 0.1); const scr = aPantalla(cam, [540, 860]); P.resplandor(ctx, scr[0], scr[1], 420 * cam[2], '120,190,255', 0.22); const kb = aPantalla(cam, [540, 1430]); P.resplandor(ctx, kb[0], kb[1], 380 * cam[2], '255,200,150', 0.2); };
 const TIT = (ctx, t) => P.titular(ctx, 'CABEN EN UNA UÑA', 540, 480, t, -0.3, S(2) - 0.1, { px: 96, clave: 'UÑA', col: '#ff3b3b' });
 const CONT = (ctx, t) => { const t0 = Tk.esto2 + 0.15, v = Math.round(335544 * E.out(sm(t0, ATRAV[1] - 0.1, t))), a = 1 - sm(S(5) - 0.5, S(5) - 0.15, t); if (t < t0 - 0.2 || a <= 0) return; P.contador(ctx, t, 540, 570, v, { t0, px: 128, final: 335544, etiqueta: 'DISQUETES QUE CABEN', a }); if (v >= 335544) P.fuenteCifra(ctx, 'Cálculo: ECMA-125 (1,44 MB) y tarjeta de 512 GB', 540, 765, { a: 0.92 * a }); };
 const ATRAV = [S(4) - 0.05, S(4) + 1.25], SALE = [S(5) - 0.25, S(5) + 0.85];

 B.push({ t0: 0, t1: S(6) - 0.35, in: { type: 'cut' }, draw(ctx, t) {
  if (PORTADA) { const cam = camV(0), tg = aPantalla(cam, CARD); ctx.save(); P.aplicaCamara(ctx, cam); mundoV(ctx, 0, 1, 'fondo'); ctx.restore(); avalancha(ctx, 0, tg, 'atras'); ctx.save(); P.aplicaCamara(ctx, cam); mundoV(ctx, 0, 1, 'dedo'); ctx.restore(); avalancha(ctx, 0, tg, 'delante'); P.resplandor(ctx, tg[0], tg[1], 300, '255,214,110', 0.35); P.vineta(ctx, 0.55); return; }   // v2.0: portada = el fotograma 0 (uña con la tarjeta y disquetes cayendo)
  if (t < ATRAV[0]) { const cam = camV(t), sh = sacude(t, [[Tk.una, 0.9]], 26); const tg = aPantalla(cam, CARD); ctx.save(); P.aplicaCamara(ctx, cam, sh); mundoV(ctx, t, 1, 'fondo'); ctx.restore(); avalancha(ctx, t, tg, 'atras'); ctx.save(); P.aplicaCamara(ctx, cam, sh); mundoV(ctx, t, 1, 'dedo'); ctx.restore();   // v2.0b: parte de la avalancha cae DETRÁS del dedo (su punta redondeada se ve desde el fotograma 0)
   if (t > Tk.una - 0.1) P.resplandor(ctx, tg[0], tg[1], 260 * cam[2] / 3, '255,214,110', 0.55 * (1 - sm(Tk.una, S(2) + 0.6, t)) + 0.12);
   if (t >= Tk.esto2 - 0.1) { const a = sm(Tk.esto2 - 0.1, Tk.esto2 + 0.3, t); ctx.save(); P.aplicaCamara(ctx, cam); anillo(ctx, t, CARD[0], CARD[1], 84, a); ctx.restore(); }
   avalancha(ctx, t, tg, 'delante'); P.particulas(ctx, t, { tipo: 'polvo', n: 50, a: 0.35, seed: 5 }); }
  else if (t < ATRAV[1] + 0.02) { const cam = camV(ATRAV[0]); P.atravesar(ctx, t, ATRAV[0], ATRAV[1], (c) => { c.save(); P.aplicaCamara(c, cam); mundoV(c, t); c.restore(); }, (c) => interiorV(c, t), { centro: aPantalla(cam, CARD), zoom: 9 }); }
  else if (t < SALE[0]) interiorV(ctx, t);
  else if (t < SALE[1]) P.salir(ctx, t, SALE[0], SALE[1], (c) => interiorV(c, t), (c) => oficinaV(c, t, camOf(t)), { centro: aPantalla(camOf(t), [730, 1223]), zoom: 12 });
  else { const cam = camOf(t); cam[4] = t < Tk.lector + 0.35 ? 1 : 0; const sh = sacude(t, [[Tk.lleno, 0.5]], 18); cam[0] -= sh[0] / cam[2]; oficinaV(ctx, t, cam); }
  fogonazo(ctx, t, [[Tk.una, 0.55]]); TIT(ctx, t); CONT(ctx, t); P.vineta(ctx, 0.5); P.grano(ctx, t, 0.05);
 }, sfx(k) {   // v2.0 · un sonido solo cuando pasa algo IMPORTANTE (nunca por objeto, partícula o número): 4 en los 12 primeros segundos
  k.noise(0, { dur: 1.85, color: 'pink', filter: 'bandpass', f: [[0, 2600], [1.85, 1300]], q: 0.7, gain: 0.13, a: 0.02, hold: 1.2 }); k.noise(0, { dur: 1.85, color: 'brown', filter: 'lowpass', f: 600, gain: 0.14, a: 0.02, hold: 1.2 });   // la avalancha: UN «crash» continuo y suave
  golpe(k, Tk.una, 1.1); k.play('pop', Tk.una, { f: 240, gain: 0.3 });   // «uña»: todo entra en la tarjeta (tras ~0,7 s de silencio)
  golpe(k, ATRAV[1] - 0.1, 0.8);   // el contador llega a 335.544 justo al entrar en la tarjeta (sube en silencio)
  const c0 = SALE[1] - 0.1, cd = Tk.lleno - 0.1 - c0; k.noise(c0, { dur: cd, filter: 'bandpass', f: [[0, 900], [cd * 0.3, 1250], [cd * 0.6, 820], [cd, 1150]], q: 2.5, gain: 0.07, a: 0.05, hold: cd * 0.85 }); k.tone(c0, { f: 95, type: 'sawtooth', dur: cd, gain: 0.025, filter: 'lowpass', f2: 400, a: 0.05, hold: cd * 0.8 });   // el lector: un solo ruido continuo
  k.tone(Tk.lleno, { f: 'A3', type: 'square', dur: 0.45, gain: 0.1, hold: 0.35, filter: 'lowpass', f2: 1400 }); k.tone(Tk.lleno, { f: 'A4', type: 'square', dur: 0.35, gain: 0.05, filter: 'lowpass', f2: 2000 });   // el error: UN solo sonido
 } });
 // ======================================================================================================================
 // v2.0 · RESTO DEL VIAJE — un solo mundo con la cámara viajando (2 cortes secos: 53,0 s y 59,7 s; 2 fogonazos: «uña» y el final)
 //  computador de los 90 y «disco lleno» (manos en el teclado) → la cámara ENTRA por la ranura al disquete → entra por la ventana de la
 //  persiana al disco (biblioteca redonda, imán, cabeza, puntitos) → SALE a la uña y ENTRA en la tarjeta (celdas, electricidad encerrada,
 //  se encogen, edificio de capas) → sale a la uña → la montaña de disquetes y la torre del kilómetro → vuelta a la uña = fotograma 0.
 // ======================================================================================================================
 const OFI_FIN = S(6) - 0.35, DISQ_IN = [OFI_FIN, S(6) + 0.6], DISCO_IN = [S(7) - 0.3, S(7) + 0.75];
 const SAL_DISCO = [S(13) - 0.35, S(13) + 0.55], TARJ_IN = [S(13) + 1.65, S(14) + 0.35];
 const CELDA_X = Tk.cajoncitos - 0.45, ENCOGE_X = S(16) - 0.15, CAPAS_X = S(17) - 0.25, SAL_CAPAS = [S(18) - 0.3, S(18) + 0.7];
 const T_MONT = S(19) - 0.02, T_FIN = S(22), RANURA = [730, 1223];
 const fondoOscuro = (ctx, col = '#0b0e18') => { ctx.fillStyle = col; ctx.fillRect(0, 0, W, HH); };
 const rampa = (t, a, b) => (t <= a ? 0 : t >= b ? t - (a + b) / 2 : (t - a) * (t - a) / (2 * (b - a)));   // integral de una subida lineal (velocidad suave)
 const TITV = (ctx, s_, t, t0, t1, clave, px = 92) => P.titular(ctx, s_, 540, 480, t, t0, t1, { px, clave, col: '#ff3b3b' });
 // ---------- el computador: teclado y manos (primer plano; en «lleno» las manos saltan hacia atrás) ----------
 const teclado = (ctx) => { ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(540, 1490, 320, 18, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#ddd2b8'; ctx.beginPath(); ctx.roundRect(236, 1378, 608, 108, 12); ctx.fill(); ctx.fillStyle = '#c4b89c'; ctx.fillRect(236, 1468, 608, 18);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) { ctx.fillStyle = '#efe7d3'; ctx.beginPath(); ctx.roundRect(252 + c * 41.6, 1390 + r * 19, 36, 15, 3); ctx.fill(); } };
 const manosTeclado = (ctx, t) => { const lev = E.out(sm(Tk.lleno - 0.02, Tk.lleno + 0.3, t)), tec = t < Tk.lleno ? Math.sin(t * 22) : 0;
  P.manoR(ctx, 'relajada', 418 - 34 * lev, 1420 - 6 * Math.max(0, tec) - 80 * lev, 330, { lado: 'izquierda', giro: { roll: 180 }, ancla: 'punta', piel: 'medio', ang: 0.12 + 0.22 * lev });
  P.manoR(ctx, 'relajada', 662 + 34 * lev, 1420 - 6 * Math.max(0, -tec) - 80 * lev, 330, { giro: { roll: 180 }, ancla: 'punta', piel: 'medio', ang: -0.12 - 0.22 * lev }); };
 // ---------- el disquete de cerca (la cámara entró por la ranura) ----------
 const zDisq = (t) => 1 + 0.035 * (t - S(6));
 const escenaDisq = (ctx, t) => { fondoOscuro(ctx); P.resplandor(ctx, 540, 1000, 900, '255,196,140', 0.14); const z = zDisq(t); ctx.save(); ctx.translate(540, 1170); ctx.scale(z, z); ctx.translate(-540, -1170);
  P.floppy35(ctx, 540, 1170, 9, { col: '#3a5fb0', shutter: sm(S(6) + 0.9, S(6) + 1.8, t) * 0.65 }); P.reflejo(ctx, (c) => { c.beginPath(); c.rect(135, 747, 810, 846); }, t, { a: 0.16 }); ctx.restore(); P.particulas(ctx, t, { tipo: 'polvo', n: 40, a: 0.3, seed: 8 }); };
 const ventanaDisq = (t) => { const z = zDisq(t); return [540 + (473 - 540) * z, 1170 + (900 - 1170) * z]; };
 const CONT_MB = (ctx, t) => { const t0 = S(6) + 0.6, tf = Tk.mega - 0.05; if (t < t0 - 0.25 || t > S(7) - 0.1) return; const a = 1 - sm(S(7) - 0.45, S(7) - 0.15, t), v = Math.round(1474560 * E.out(sm(t0, tf, t)));
  P.contador(ctx, t, 540, 610, v, { t0, px: 112, final: 1474560, etiqueta: 'BYTES', a }); if (v >= 1474560) P.fuenteCifra(ctx, 'ECMA-125: 80 pistas × 18 sectores × 512 B × 2 caras', 540, 745, { a: 0.92 * a }); };
 // ---------- dentro del disco: la biblioteca redonda, el imán que gira, la cabeza que corre, los puntitos ----------
 const camDisco = (t) => P.camino(t, [[S(7), 540, 1000, 1.0], [S(8), 540, 1000, 1.06], [Tk.cabeza - 0.2, 540, 980, 1.1], [Tk.cabeza + 0.6, 540, 760, 1.55], [S(9), 540, 740, 1.75], [S(10) - 0.35, 540, 730, 2.3], [S(10) + 0.45, 540, 1010, 1.0], [S(13), 540, 1000, 1.06]]);
 const angDisco = (t) => 0.8 * (t - S(7)) + 8.2 * rampa(t, Tk.iman - 0.3, Tk.giraba + 0.3) + 6 * rampa(t, S(10), S(10) + 0.5);
 const rayas = (ctx, d) => { ctx.strokeStyle = `rgba(255,255,255,${0.85 * d})`; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(540, 1000, 190 + i * 55, 0.3 + i, 0.3 + i + 1.1 * d); ctx.stroke(); } const R = RNG(12); for (let i = 0; i < 34; i++) { ctx.fillStyle = `rgba(230,220,200,${0.8 * d})`; ctx.beginPath(); ctx.arc(540 + (R() - 0.5) * 760, 1000 + (R() - 0.5) * 760, 4 + R() * 7, 0, TAU); ctx.fill(); } };
 const escenaDisco = (ctx, t) => { fondoOscuro(ctx, '#0d0f1a'); P.resplandor(ctx, 540, 1000, 820, '255,170,110', 0.18); const cam = camDisco(t), mov = sm(S(10), S(10) + 0.4, t) * (1 - sm(S(13) - 0.6, S(13), t)), sh = sacude(t, [[Tk.danarse, 0.6]], 26);
  const cab = t < Tk.cabeza ? 0.3 : 0.5 + 0.42 * Math.sin((t - Tk.cabeza) * 3.4 * (1 + mov));
  ctx.save(); P.aplicaCamara(ctx, cam, [5 * mov * Math.sin(t * 63) + sh[0], sh[1]]); corteDisq(ctx, t, 540, 1000, 11, { caja: 0.15, ang: angDisco(t), cab, libros: sm(Tk.biblioteca - 0.4, Tk.biblioteca, t) * (1 - sm(S(8) - 0.3, S(8) + 0.25, t)), puntos: t > Tk.cabeza ? 1 : 0 });
   const d = sm(S(12) - 0.1, Tk.danarse, t); if (d > 0) rayas(ctx, d); ctx.restore();
  const rojo = sm(Tk.danarse - 0.05, Tk.danarse + 0.2, t) * (1 - sm(S(13) - 0.5, S(13), t)); if (rojo > 0) P.vineta(ctx, 0.5 * rojo, '160,20,30'); P.particulas(ctx, t, { tipo: 'polvo', n: 36, a: 0.3, seed: 9 }); };
 const escenaPistas = (ctx, t) => { fondoOscuro(ctx, '#0d0f1a'); P.resplandor(ctx, 540, 1000, 700, '62,168,255', 0.16); ctx.save(); ctx.translate(540, 1000); ctx.scale(1.18, 1.18); ctx.translate(-540, -1000); P.magTrack(ctx, 0, 620, W, 760, t, { mode: t < Tk.puntitos + 0.3 ? 'write' : 'read', speed: 120 }); ctx.restore(); };
 const aPistas = (t) => sm(S(9) - 0.15, S(9) + 0.3, t) * (1 - sm(S(10) - 0.35, S(10) + 0.1, t));
 // ---------- la tarjeta: cámara en la uña, atravesar, celdas, celda grande, se encogen, edificio de capas ----------
 const camTarj = (t) => P.camino(t, [[SAL_DISCO[0], 1500, 1000, 3.4], [TARJ_IN[0], 1500, 1030, 4.2]]);
 const mundoCam = (ctx, t, cam) => { ctx.save(); P.aplicaCamara(ctx, cam); mundoV(ctx, t); ctx.restore(); const tg = aPantalla(cam, CARD); P.resplandor(ctx, tg[0], tg[1], 90 * cam[2], '255,214,110', 0.22); P.particulas(ctx, t, { tipo: 'polvo', n: 40, a: 0.3, seed: 5 }); };
 const escenaCelda = (ctx, t) => { fondoOscuro(ctx, '#070d1f'); P.resplandor(ctx, 540, 970, 760, '60,120,255', 0.28); ctx.save(); ctx.translate(540, 1000); ctx.scale(1.1, 1.1); ctx.translate(-540, -1060); celdaGrande(ctx, t, CELDA_X + 0.1, Tk.encerrada); ctx.restore(); };
 const escenaEncoge = (ctx, t) => { fondoOscuro(ctx, '#070d1f'); P.resplandor(ctx, 540, 970, 760, '60,120,255', 0.28); ctx.save(); ctx.translate(540, 1000); ctx.scale(1.1, 1.1); ctx.translate(-540, -1060); celdaEncoge(ctx, t, sm(ENCOGE_X + 0.2, Tk.achicarse + 0.3, t)); ctx.restore(); };
 const pisosN = (t) => lerp(1, 162, E.in(sm(Tk.apilaron - 0.3, Tk.pisos - 0.05, t)));
 const escenaCapas = (ctx, t) => { fondoOscuro(ctx, '#070d1f'); P.resplandor(ctx, 540, 1250, 820, '60,140,255', 0.3); const cam = P.camino(t, [[CAPAS_X, 540, 1810, 1.6], [Tk.edificio, 540, 1680, 1.35], [Tk.cien, 540, 1180, 1.05], [S(18) + 0.7, 540, 1160, 1.03]]);
  ctx.save(); P.aplicaCamara(ctx, cam); capas(ctx, t, 540, 1800, pisosN(t), { hp: 5, w: 760, d: 360 }); ctx.restore(); P.particulas(ctx, t, { tipo: 'chispas', n: 24, a: 0.5, seed: 21 }); };
 const camPreg = (t) => P.camino(t, [[SAL_CAPAS[0], 1500, 1030, 3.0], [S(18) + 2.6, 1250, 1060, 1.15], [T_MONT, 1000, 1080, 0.86]]);
 const CONT_PISOS = (ctx, t) => { if (t < Tk.apilaron - 0.4 || t > SAL_CAPAS[0] + 0.2) return; const a = 1 - sm(SAL_CAPAS[0] - 0.2, SAL_CAPAS[0] + 0.2, t), v = Math.floor(pisosN(t)); P.contador(ctx, t, 540, 600, v, { t0: Tk.apilaron - 0.3, px: 112, final: 162, etiqueta: 'PISOS DE CELDAS', a }); if (v >= 162) P.fuenteCifra(ctx, 'Kioxia BiCS FLASH: 162 capas (2022)', 540, 735, { a: 0.92 * a }); };
 // ---------- de lado: la montaña de disquetes y la torre del kilómetro (1 m = 6 px) ----------
 const SUELO = 1640, PXM = 6, alturaM = (t) => 1107 * E.inOut(sm(S(20) + 0.15, Tk.kilometro, t));
 const camLadoY = (t) => { const subir = Math.max(0, alturaM(t) * PXM - (SUELO - 900)); return subir * (1 - E.inOut(sm(S(21), S(21) + 0.75, t))); };
 const escenaLado = (ctx, t) => { const cy = camLadoY(t), alt = cl(cy / 5000), g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, `rgb(${Math.round(lerp(18, 6, alt))},${Math.round(lerp(24, 8, alt))},${Math.round(lerp(46, 22, alt))})`); g.addColorStop(1, '#141a2c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  if (alt > 0.05) { ctx.save(); ctx.globalAlpha = alt; P.particulas(ctx, t, { tipo: 'polvo', n: 70, a: 0.7, tam: 2, col: '220,230,255', seed: 33 }); ctx.restore(); }
  const zf = 1 + 2.4 * E.inOut(sm(S(21) + 0.7, T_FIN, t)); ctx.save(); ctx.translate(965, 1330); ctx.scale(zf, zf); ctx.translate(-965, -1330); ctx.translate(0, cy);
  ctx.fillStyle = '#1a1612'; ctx.fillRect(-200, SUELO, W + 400, 900); ctx.fillStyle = '#3a2f26'; ctx.fillRect(-200, SUELO, W + 400, 8); P.resplandor(ctx, 520, SUELO - 200, 700, '255,196,140', 0.12);
  const mA = 1 - sm(S(20) - 0.1, S(20) + 0.9, t); if (mA > 0) { ctx.save(); ctx.globalAlpha *= mA; ctx.translate(430, SUELO); ctx.scale(0.9, 0.9); ctx.translate(-540, -1560); montana(ctx, t, lerp(0.08, 1, E.out(sm(T_MONT, Tk.mil, t))), { s: 1.6 }); ctx.restore(); }
  const H = alturaM(t) * PXM; if (H > 1) { const top = SUELO - H, y0 = Math.max(top, -cy - 40), y1 = Math.min(SUELO, -cy + HH + 40); ctx.fillStyle = '#23262d'; ctx.fillRect(170, top, 520, SUELO - top); for (let y = Math.floor(y1 / 18) * 18; y > y0; y -= 18) { const i = Math.round((SUELO - y) / 18); ctx.fillStyle = VCOL[(i * 5) % VCOL.length]; ctx.fillRect(170, y - 16, 520, 16); ctx.fillStyle = '#9aa3a8'; ctx.fillRect(330, y - 16, 160, 16); }
   ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(140, SUELO); ctx.lineTo(140, top); ctx.stroke(); ctx.fillStyle = '#ffffff'; ctx.font = '800 34px Nunito'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; for (let m = 100; m <= 1100 && SUELO - m * PXM > top - 1; m += 100) { const y = SUELO - m * PXM; if (y < -cy - 40 || y > -cy + HH + 40) continue; ctx.beginPath(); ctx.moveTo(140, y); ctx.lineTo(112, y); ctx.stroke(); ctx.globalAlpha = 0.7; ctx.fillText(`${m} m`, 152, y - 24); ctx.globalAlpha = 1; } }
  const d = P.dedoPP(ctx, 965, 1300, 120, { vista: 'dorso', piel: 'medio', largo: 700, luz: 0.8 }); P.microSD(ctx, d.una[0], d.una[1] + 2, 5.8, { rot: -0.07 }); ctx.restore(); P.vineta(ctx, 0.5); };
 const CONT_LADO = (ctx, t) => { if (t < S(20) - 0.2) { const t0 = T_MONT + 0.1, v = Math.round(335544 * E.out(sm(t0, Tk.mil, t))), a = 1 - sm(S(20) - 0.5, S(20) - 0.2, t); P.contador(ctx, t, 540, 600, v, { t0, px: 116, final: 335544, etiqueta: 'DISQUETES', a }); if (v >= 335544) P.fuenteCifra(ctx, 'Cálculo: ECMA-125 (1,44 MB) y tarjeta de 512 GB', 540, 735, { a: 0.92 * a }); return; }
  if (t > S(21) + 0.4) return; const a = sm(S(20) - 0.1, S(20) + 0.2, t) * (1 - sm(S(21), S(21) + 0.4, t)), v = Math.round(alturaM(t)); P.contador(ctx, t, 540, 600, v, { t0: S(20) - 0.1, px: 116, final: 1107, unidad: 'M', etiqueta: 'DE ALTURA', a }); if (v >= 1107) P.fuenteCifra(ctx, '335.544 disquetes × 3,3 mm (ECMA-125)', 540, 735, { a: 0.92 * a }); };

 // ---------- B · el disquete por dentro (de la ranura al disco), sin cortes ----------
 B.push({ t0: OFI_FIN, t1: SAL_DISCO[0], in: { type: 'cut' }, draw(ctx, t) {
  if (t < DISQ_IN[1]) { const c0 = camOf(OFI_FIN); P.atravesar(ctx, t, DISQ_IN[0], DISQ_IN[1], (c) => oficinaV(c, OFI_FIN, camOf(OFI_FIN)), (c) => escenaDisq(c, t), { centro: aPantalla(c0, RANURA), zoom: 10 }); }
  else if (t < DISCO_IN[0]) escenaDisq(ctx, t);
  else if (t < DISCO_IN[1]) P.atravesar(ctx, t, DISCO_IN[0], DISCO_IN[1], (c) => escenaDisq(c, DISCO_IN[0]), (c) => escenaDisco(c, t), { centro: ventanaDisq(DISCO_IN[0]), zoom: 9 });
  else { escenaDisco(ctx, t); const a = aPistas(t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; escenaPistas(ctx, t); ctx.restore(); } }
  CONT_MB(ctx, t); TITV(ctx, 'UN POCO MÁS DE 1 MEGA', t, Tk.mega - 0.35, S(7) - 0.1, 'MEGA', 68); TITV(ctx, 'TODO SE MOVÍA', t, Tk.movia - 0.4, S(12) - 0.1, 'MOVÍA', 96); TITV(ctx, 'PODÍA DAÑARSE', t, Tk.danarse - 0.3, SAL_DISCO[0], 'DAÑARSE', 96);
  P.vineta(ctx, 0.5); P.grano(ctx, t, 0.05);
 }, sfx(k) {   // 4 sonidos: el golpe del contador (1 MEGA), el giro del disco (continuo, sube al «sonaba») y el rayón
  golpe(k, Tk.mega - 0.05, 0.8);
  const t0 = Tk.iman, d = S(13) - t0; k.noise(t0, { dur: d, color: 'brown', filter: 'bandpass', f: [[0, 160], [1.2, 320], [d, 260]], q: 1, gain: 0.07, a: 0.8, hold: d * 0.85 }); k.tone(t0, { f: [[0, 40], [1.2, 95], [d, 92]], type: 'sawtooth', dur: d, gain: 0.02, filter: 'lowpass', f2: 420, a: 0.8, hold: d * 0.85 });
  k.noise(Tk.sonaba - 0.6, { dur: 2.4, filter: 'bandpass', f: [[0, 800], [2.4, 1100]], q: 2.5, gain: 0.05, a: 0.9, hold: 1.2 });
  k.noise(Tk.danarse, { dur: 0.6, filter: 'highpass', f: 3000, gain: 0.12, a: 0.005 }); k.tone(Tk.danarse, { f: 'A3', type: 'square', dur: 0.4, gain: 0.07, hold: 0.3, filter: 'lowpass', f2: 1400 });
 } });

 // ---------- C · sale del disco a la uña, entra en la tarjeta (celdas, electricidad encerrada, se encogen, edificio) y vuelve a la uña ----------
 B.push({ t0: SAL_DISCO[0], t1: T_MONT, in: { type: 'cut' }, draw(ctx, t) {
  if (t < SAL_DISCO[1]) P.salir(ctx, t, SAL_DISCO[0], SAL_DISCO[1], (c) => escenaDisco(c, t), (c) => mundoCam(c, t, camTarj(t)), { centro: [540, 960], zoom: 9 });
  else if (t < TARJ_IN[0]) mundoCam(ctx, t, camTarj(t));
  else if (t < TARJ_IN[1]) { const c0 = camTarj(TARJ_IN[0]); P.atravesar(ctx, t, TARJ_IN[0], TARJ_IN[1], (c) => mundoCam(c, t, c0), (c) => interiorV(c, t), { centro: aPantalla(c0, CARD), zoom: 7 }); }
  else if (t < CELDA_X + 0.4) { interiorV(ctx, t); const a = sm(CELDA_X, CELDA_X + 0.4, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; escenaCelda(ctx, t); ctx.restore(); } }
  else if (t < ENCOGE_X + 0.3) { escenaCelda(ctx, t); const a = sm(ENCOGE_X, ENCOGE_X + 0.3, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; escenaEncoge(ctx, t); ctx.restore(); } }
  else if (t < CAPAS_X + 0.4) { escenaEncoge(ctx, t); const a = sm(CAPAS_X, CAPAS_X + 0.4, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; escenaCapas(ctx, t); ctx.restore(); } }
  else if (t < SAL_CAPAS[0]) escenaCapas(ctx, t);
  else if (t < SAL_CAPAS[1]) P.salir(ctx, t, SAL_CAPAS[0], SAL_CAPAS[1], (c) => escenaCapas(c, t), (c) => mundoCam(c, t, camPreg(t)), { centro: [540, 960], zoom: 8 });
  else mundoCam(ctx, t, camPreg(t));
  TITV(ctx, 'SIN NADA QUE GIRE', t, Tk.gire - 0.45, S(15) - 0.1, 'GIRE', 80); CONT_PISOS(ctx, t); TITV(ctx, 'MÁS DE 100 PISOS', t, Tk.cien - 0.3, SAL_CAPAS[0], '100', 84); TITV(ctx, '¿CUÁNTOS DISQUETES?', t, Tk.cuantos + 0.3, S(19) - 0.6, 'DISQUETES', 72);
  P.vineta(ctx, 0.5); P.grano(ctx, t, 0.05);
 }, sfx(k) {   // 2 sonidos: la electricidad que se encierra y el golpe del contador de pisos; después, silencio real hasta «Más de trescientos mil»
  FX.zumbido(k, Tk.electricidad, 1.6, 0.5); golpe(k, Tk.pisos - 0.05, 0.8);
  const s0 = S(19) - 1.75, s1 = S(19) - 0.8; k.noise(s0, { dur: s1 - s0, color: 'brown', filter: 'lowpass', f: 220, gain: 0.012, a: 0.3, hold: s1 - s0 - 0.45 });   // murmullo grave (muy bajo, no cuenta como efecto) y luego 0,8 s de silencio real antes de la revelación
 } });

 // ---------- D · CORTE 1: de lado, la montaña de disquetes y la torre del kilómetro; la cámara sube y vuelve a bajar a la uña ----------
 B.push({ t0: T_MONT, t1: T_FIN, in: { type: 'cut' }, draw(ctx, t) {
  escenaLado(ctx, t); CONT_LADO(ctx, t); TITV(ctx, 'MÁS DE 300.000', t, Tk.trescientos - 0.1, S(20) - 0.15, '300.000', 96); TITV(ctx, 'MÁS DE 1 KM', t, Tk.kilometro - 0.2, S(21) + 0.3, 'KM', 110); P.grano(ctx, t, 0.05);
 }, sfx(k) {   // la montaña: UN solo «crash» continuo; «tin» en «mil» y en «kilómetro» (los contadores suben en silencio)
  golpe(k, T_MONT + 0.02, 0.9); k.noise(T_MONT + 0.02, { dur: 2.0, color: 'pink', filter: 'bandpass', f: [[0, 2400], [2, 1200]], q: 0.7, gain: 0.13, a: 0.02, hold: 1.3 }); k.noise(T_MONT + 0.02, { dur: 2.0, color: 'brown', filter: 'lowpass', f: 600, gain: 0.14, a: 0.02, hold: 1.3 });
  FX.clave(k, Tk.mil); FX.clave(k, Tk.kilometro);
 } });

 // ---------- E · CORTE 2 (con fogonazo): «en una uña» → el último plano repite el fotograma 0 (bucle). Al final, el ASOMBROTECA discreto ----------
 B.push({ t0: T_FIN, t1: DURATION, in: { type: 'cut' }, draw(ctx, t) {
  const tl = t - DURATION, cam = camV(0), tg = aPantalla(cam, CARD);
  ctx.save(); P.aplicaCamara(ctx, cam); mundoV(ctx, tl, 1, 'fondo'); ctx.restore(); avalancha(ctx, tl, tg, 'atras'); ctx.save(); P.aplicaCamara(ctx, cam); mundoV(ctx, tl, 1, 'dedo'); ctx.restore(); avalancha(ctx, tl, tg, 'delante');
  P.particulas(ctx, tl, { tipo: 'polvo', n: 50, a: 0.35, seed: 5 }); fogonazo(ctx, t, [[T_FIN, 0.5]]); P.titular(ctx, 'CABEN EN UNA UÑA', 540, 480, t, T_FIN + 0.35, 0, { px: 96, clave: 'UÑA', col: '#ff3b3b' });
  P.vineta(ctx, 0.5); P.grano(ctx, tl, 0.05); P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.clave(k, Tk.una2); k.noise(Tk.una2, { dur: DURATION - Tk.una2, color: 'pink', filter: 'bandpass', f: 2200, q: 0.7, gain: 0.09, a: 0.02, hold: DURATION - Tk.una2 - 0.8 }); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'cartoon', capBorde: true, marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  modo: 'viral', capOcultar: [[0, S(2) - 0.05], [S(22) - 0.05, DURATION + 1]],   // v2.0b: durante el gancho, SOLO el titular; el subtítulo entra cuando termina
    // v2.0: sin música ni ambiente; etiquetas y pausas mudas; el «tin» (FX.clave) en «1 mega», «100 pisos», «300.000» y «1 km»
  keywords: [],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 400, gain: 0.02, a: 0.05, hold: DURATION - 2.5 }); },
  music(k) { MUS.piano(k, 0, S(18), { bpm: 84, gain: 0.7, strings: 0.6, chords: [['D3', 'F#3', 'A3', 'D4'], ['B2', 'D3', 'F#3', 'B3'], ['G2', 'B2', 'D3', 'G3'], ['A2', 'C#3', 'E3', 'A3']] }); MUS.pulso(k, S(19), DURATION, { bpm: 100, gain: 0.5, chords: [['D3', 'F#3', 'A3', 'D4'], ['G2', 'B2', 'D3', 'G3'], ['B2', 'D3', 'F#3', 'B3'], ['A2', 'C#3', 'E3', 'A3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
