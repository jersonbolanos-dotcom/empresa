// =====================================================================================================
// episodio.js — ¿Por qué no explota una olla a presión? · PLANTILLA ASOMBROTECA v1.39 · «cartoon» (cocina casera cálida)
// UN solo vídeo con UN gancho (v1.34): A + C («Estás en la cocina de tu abuela… y la olla empieza a pitar como si fuera a
// explotar»). Voz: ElevenLabs Eleven v4, Dan, UNA toma (1.032 caracteres, 65,0 s), intacta. Metáfora sostenida: la GASEOSA
// AGITADA (tapa cerrada = olla cerrada, botella dura = presión, aflojar la tapa = el pito).
// Dirección visual: la olla en corte / «rayos X» es el centro (agua azul, vapor blanco, calor naranja, presión con medidor y
// flechas amarillas, empaque rojo, válvula que sube y baja, tapón de seguridad); un plano por idea con cámara que se mueve;
// impactos con destello + sacudida + silbido; la familia que se asusta con el pito y luego sonríe; final grande en primer plano.
// Olla, cocina, botella y personas dibujadas, genéricas, sin marcas.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, DURATION, txt } = K;
 const S = (i) => A.segments[i].s;
 const YE = '#ffd23f', RD = '#ff4d5e', GR = '#22d27a', CY = '#8fd8ff', NAR = '#ff9f43', AZ = '#3ea8ff';
 const PORTADA = typeof window !== 'undefined' && !!window.__SIN_SUBTITULOS;
 const Tk = {
  pitar: wt(1, 'pitar'), explotar: wt(1, 'explotar.'), explota: wt(2, 'explota?'), secreto: wt(3, 'secreto'), gaseosa: wt(4, 'gaseosa'), cerrada: wt(5, 'cerrada,'), sale: wt(5, 'sale…'),
  dura: wt(6, 'dura.'), mismo: wt(7, 'mismo:'), empaque: wt(8, 'empaque'), atrapado: wt(9, 'atrapado.'), sube: wt(10, 'sube…'), cien: wt(11, 'cien'), veinte: wt(12, 'veinte.'), rapido: wt(13, 'rápido.'),
  pito: wt(14, 'pito?'), peso: wt(15, 'peso:'), levanta: wt(16, 'levanta'), vapor16: wt(16, 'vapor,'), aflojar: wt(17, 'aflojar'), tapada: wt(18, 'tapa,'), fuerza: wt(18, 'fuerza'), golpe: wt(19, 'golpe.'),
  viejas: wt(20, 'viejas'), seguros: wt(21, 'seguros:'), salta: wt(22, 'salta'), abre: wt(23, 'abre'), asustaba: wt(24, 'asustaba…'), diciendo: wt(25, 'diciendo:'), control: wt(26, 'control.'),
 };
 const T_CORTE = 1.2, T_LLENA = 1.9, T_VUELTA = 2.7;

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

 // ---------- VAPOR: bocanadas que suben (función pura de t) ----------
 const vapor = (ctx, x, y, t, k = 1, o = {}) => { if (k <= 0) return; const n = o.n || 10, hg = o.h || 300, r0 = o.r0 || 18, r1 = o.r1 || 80, rate = o.rate || 0.9, dx = o.dx || 0; ctx.save();
  for (let i = 0; i < n; i++) { const ph = (((t * rate + i / n) % 1) + 1) % 1, yy = y - ph * hg, xx = x + dx * ph + Math.sin(i * 2.3 + t * 2 + ph * 4) * 26 * ph, r = lerp(r0, r1, ph);
   ctx.globalAlpha = k * (o.a ?? 0.9) * (1 - ph) * Math.min(1, ph * 8); ctx.fillStyle = i % 3 ? '#ffffff' : '#e9eff5'; ctx.beginPath(); ctx.arc(xx, yy, r, 0, TAU); ctx.fill(); } ctx.restore(); };
 // chorro de vapor HACIA LA CÁMARA: nube sólida que crece (k = 0..1; con k = 1 llena ~90 % del ancho)
 const chorro = (ctx, t, x, y, k, o = {}) => { if (k <= 0) return; const R = H.rng(o.seed || 3); ctx.save();
  for (const capa of [0, 1]) { for (let i = 0; i < 30; i++) { const a = R() * TAU, d = R() * k * (o.rad || 380), rr = (70 + R() * 110) * (0.25 + k);
   ctx.globalAlpha = Math.min(1, 0.6 + 0.4 * k) * (o.alfa ?? 1); ctx.fillStyle = capa ? (i % 3 ? '#ffffff' : '#f2f6fa') : '#c9d4de';
   ctx.beginPath(); ctx.arc(x + Math.cos(a) * d + 18 * Math.sin(t * 3 + i) + (capa ? 0 : 14), y + Math.sin(a) * d * 0.75 + 14 * Math.cos(t * 2.7 + i) + (capa ? 0 : 18), rr, 0, TAU); ctx.fill(); } }
  ctx.restore(); };

 // ---------- COCINA (fondo: pared, ventana con luz de tarde, azulejos; mueble: estufa, perillas, horno, piso) ----------
 const azulejo = (ctx, x, y, s, k) => { ctx.fillStyle = '#f7f1e3'; ctx.fillRect(x, y, s, s); ctx.strokeStyle = '#d6c9ad'; ctx.lineWidth = 3; ctx.strokeRect(x, y, s, s); const c = s / 2;
  ctx.fillStyle = k % 2 ? '#2f6db5' : '#e2a32b'; ctx.beginPath(); ctx.arc(x + c, y + c, s * 0.14, 0, TAU); ctx.fill(); ctx.fillStyle = k % 2 ? '#e2a32b' : '#2f6db5';
  for (let j = 0; j < 4; j++) { const a = j * Math.PI / 2 + Math.PI / 4; ctx.beginPath(); ctx.ellipse(x + c + Math.cos(a) * s * 0.27, y + c + Math.sin(a) * s * 0.27, s * 0.12, s * 0.06, a, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#2f6db5'; for (const [qx, qy] of [[0, 0], [s, 0], [0, s], [s, s]]) { ctx.beginPath(); ctx.arc(x + qx, y + qy, s * 0.11, Math.atan2(c - qy, c - qx) - Math.PI / 2, Math.atan2(c - qy, c - qx) + Math.PI / 2); ctx.lineTo(x + qx, y + qy); ctx.fill(); } };
 const cocinaFondo = (ctx, t, o = {}) => { const ey = o.ey ?? 1200;
  const g = ctx.createLinearGradient(0, -400, 0, ey); g.addColorStop(0, '#f2cf98'); g.addColorStop(1, '#e6b06e'); ctx.fillStyle = g; ctx.fillRect(-900, -900, W + 1800, ey + 900);
  if (o.ventana !== false) { const wx = o.vx ?? 80, wy = ey - 900; ctx.fillStyle = '#7a4a2a'; ctx.fillRect(wx - 20, wy - 20, 380, 420); const gs = ctx.createLinearGradient(0, wy, 0, wy + 380); gs.addColorStop(0, '#ff9d5c'); gs.addColorStop(1, '#ffe2a8'); ctx.fillStyle = gs; ctx.fillRect(wx, wy, 340, 380);
   ctx.fillStyle = '#e0904c'; ctx.beginPath(); ctx.arc(wx + 240, wy + 250, 46, 0, TAU); ctx.fill(); ctx.fillStyle = '#5f9a4e'; ctx.beginPath(); ctx.ellipse(wx + 80, wy + 380, 130, 90, 0, Math.PI, TAU); ctx.ellipse(wx + 270, wy + 380, 120, 110, 0, Math.PI, TAU); ctx.fill();
   ctx.fillStyle = '#7a4a2a'; ctx.fillRect(wx + 162, wy, 16, 380); ctx.fillRect(wx, wy + 182, 340, 16); ctx.fillStyle = '#c8553d'; ctx.fillRect(wx - 40, wy - 40, 420, 26); ctx.fillStyle = 'rgba(200,85,61,0.8)'; ctx.beginPath(); ctx.moveTo(wx - 40, wy - 14); ctx.quadraticCurveTo(wx + 10, wy + 120, wx - 30, wy + 230); ctx.lineTo(wx - 40, wy + 230); ctx.closePath(); ctx.fill();
   P.glow(ctx, wx + 170, wy + 190, 560, '255,180,100', 0.3); }
  // repisa con platos y cucharones (a la derecha)
  const rx = o.rx ?? 560, ry = ey - 700; ctx.fillStyle = '#8a5a34'; ctx.fillRect(rx, ry, 460, 22); ctx.fillStyle = '#6b4226'; ctx.fillRect(rx + 30, ry + 22, 16, 40); ctx.fillRect(rx + 414, ry + 22, 16, 40);
  for (let i = 0; i < 4; i++) { const px = rx + 70 + i * 100; ctx.fillStyle = ['#2f6db5', '#e2a32b', '#c8553d', '#5f9a4e'][i]; ctx.beginPath(); ctx.ellipse(px, ry - 52, 44, 52, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#f7f1e3'; ctx.beginPath(); ctx.ellipse(px, ry - 52, 28, 34, 0, 0, TAU); ctx.fill(); }
  for (let i = 0; i < 3; i++) { const cx = rx + 120 + i * 120, sw = 0.04 * Math.sin(t * 1.5 + i); ctx.save(); ctx.translate(cx, ry + 70); ctx.rotate(sw); ctx.fillStyle = '#9c6b3f'; ctx.fillRect(-7, 0, 14, 150); ctx.beginPath(); ctx.ellipse(0, 170, 30, 22, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#5a3b22'; ctx.fillRect(rx + 60, ry + 60, 360, 10);
  // azulejos detrás de la estufa
  const ts = 96, y0 = ey - 384; let k = 0; for (let yy = y0; yy < ey; yy += ts, k++) for (let xx = -ts * 4, j = 0; xx < W + ts * 4; xx += ts, j++) azulejo(ctx, xx, yy, ts, j + k);
  ctx.fillStyle = '#c8553d'; ctx.fillRect(-900, y0 - 14, W + 1800, 14); };
 const cocinaMueble = (ctx, t, o = {}) => { const ey = o.ey ?? 1200;
  ctx.fillStyle = '#3b3f46'; ctx.fillRect(-900, ey, W + 1800, 64); ctx.fillStyle = '#24272c'; ctx.fillRect(-900, ey + 58, W + 1800, 10);
  const gf = ctx.createLinearGradient(0, ey + 68, 0, ey + 700); gf.addColorStop(0, '#f1e9da'); gf.addColorStop(1, '#d4c7ae'); ctx.fillStyle = gf; ctx.fillRect(-900, ey + 68, W + 1800, 640);
  for (let i = -4; i < 11; i++) { const kx = 50 + i * 160; ctx.fillStyle = '#2b2e33'; ctx.beginPath(); ctx.arc(kx, ey + 140, 32, 0, TAU); ctx.fill(); ctx.fillStyle = '#d9d9d9'; ctx.fillRect(kx - 4, ey + 112, 8, 28); }
  ctx.strokeStyle = '#a89c86'; ctx.lineWidth = 8; ctx.strokeRect(70, ey + 220, W - 140, 420); ctx.fillStyle = 'rgba(40,30,20,0.6)'; ctx.fillRect(150, ey + 300, W - 300, 230); ctx.fillStyle = '#8a7d68'; ctx.fillRect(190, ey + 250, W - 380, 22);
  ctx.fillStyle = 'rgba(255,170,90,0.12)'; ctx.fillRect(150, ey + 300, W - 300, 60);
  // piso de baldosas de barro
  const py = ey + 708; ctx.fillStyle = '#b5603f'; ctx.fillRect(-900, py, W + 1800, 1200); ctx.strokeStyle = '#8f4a2f'; ctx.lineWidth = 5; for (let x = -900; x < W + 900; x += 150) { ctx.beginPath(); ctx.moveTo(x, py); ctx.lineTo(x + (x - 540) * 0.5, py + 400); ctx.stroke(); } for (const yy of [py + 60, py + 150, py + 270]) { ctx.beginPath(); ctx.moveTo(-900, yy); ctx.lineTo(W + 900, yy); ctx.stroke(); } };
 // hornilla con llama azul que tiembla (y = superficie de la estufa)
 const hornilla = (ctx, t, x, y, w, k = 1) => { ctx.fillStyle = '#1b1d21'; ctx.fillRect(x - w / 2 - 40, y - 46, 18, 46); ctx.fillRect(x + w / 2 + 22, y - 46, 18, 46); ctx.fillRect(x - 24, y - 10, 48, 10);
  if (k > 0) for (let i = 0; i < 14; i++) { const u = (i + 0.5) / 14, fx = x - w / 2 + u * w, h = (30 + 18 * Math.sin(t * 23 + i * 1.9) + 10 * Math.sin(t * 37 + i)) * k;
   ctx.fillStyle = 'rgba(60,120,255,0.92)'; ctx.beginPath(); ctx.moveTo(fx - 15, y - 4); ctx.quadraticCurveTo(fx - 9, y - 4 - h * 0.6, fx, y - 4 - h); ctx.quadraticCurveTo(fx + 9, y - 4 - h * 0.6, fx + 15, y - 4); ctx.closePath(); ctx.fill();
   ctx.fillStyle = 'rgba(175,220,255,0.95)'; ctx.beginPath(); ctx.moveTo(fx - 6, y - 4); ctx.quadraticCurveTo(fx - 3, y - 4 - h * 0.35, fx, y - 4 - h * 0.5); ctx.quadraticCurveTo(fx + 3, y - 4 - h * 0.35, fx + 6, y - 4); ctx.closePath(); ctx.fill(); } };

 // ---------- OLLA por fuera (y = fondo de la olla; ancho total con mangos ≈ 820·s, centro visual en x − 70·s) ----------
 const metal = (ctx, w, a, b, c, d) => { const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, a); g.addColorStop(0.33, b); g.addColorStop(0.6, c); g.addColorStop(1, d); return g; };
 const OH = 330, OW = 520;
 const olla = (ctx, t, x, y, s, o = {}) => { const tb = o.tiembla || 0, jx = tb * 5 * Math.sin(t * 61), jy = tb * 3 * Math.sin(t * 47 + 1), sep = !!o.sepia, w = OW, h = OH, ld = o.tapaDy || 0;
  ctx.save(); ctx.translate(x + jx, y + jy); ctx.scale(o.espejo ? -s : s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0, 4, w * 0.55, 14, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1f1f22'; ctx.beginPath(); ctx.roundRect(-w / 2 - 220, -h + 46, 240, 44, 22); ctx.fill(); ctx.beginPath(); ctx.roundRect(w / 2 - 10, -h + 52, 90, 38, 18); ctx.fill();
  ctx.fillStyle = sep ? metal(ctx, w, '#6e5a42', '#d2b88e', '#a48a66', '#5e4a34') : metal(ctx, w, '#7d848f', '#f1f4f8', '#bfc5ce', '#6f7681');
  ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -h); ctx.lineTo(w / 2, -30); ctx.quadraticCurveTo(w / 2, 0, w / 2 - 30, 0); ctx.lineTo(-w / 2 + 30, 0); ctx.quadraticCurveTo(-w / 2, 0, -w / 2, -30); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(-w / 2 + 70, -h + 34, 24, h - 74); ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w / 2, -h + 62); ctx.lineTo(w / 2, -h + 62); ctx.stroke();
  if (sep) { ctx.fillStyle = 'rgba(60,40,20,0.35)'; ctx.beginPath(); ctx.ellipse(120, -140, 50, 34, 0.4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-150, -80, 36, 26, -0.3, 0, TAU); ctx.fill(); }
  ctx.fillStyle = sep ? '#8a7354' : '#9aa1ab'; ctx.fillRect(-w / 2 - 14, -h - 16, w + 28, 22);
  ctx.save(); ctx.translate(0, -ld);
  ctx.fillStyle = sep ? metal(ctx, w, '#7a6448', '#dcc49c', '#b29672', '#6a553c') : metal(ctx, w, '#8a919c', '#f6f8fb', '#c9ced6', '#7a818c');
  ctx.beginPath(); ctx.moveTo(-w / 2 - 12, -h - 16); ctx.quadraticCurveTo(0, -h - 110, w / 2 + 12, -h - 16); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e8463c'; ctx.fillRect(-w / 2 - 12, -h - 22, w + 24, 7);
  ctx.fillStyle = '#2a2a2e'; ctx.beginPath(); ctx.roundRect(-w / 2 - 230, -h - 36, 250, 38, 19); ctx.fill();
  if (!sep) { const pin = o.pin ?? 0.2; ctx.fillStyle = pin > 0.5 ? '#e8463c' : '#9aa1ab'; ctx.beginPath(); ctx.roundRect(-w / 2 - 10, -h - 36 - 30 * pin, 26, 30 * pin + 6, 6); ctx.fill(); }
  if (!sep) { const tp = o.tapon || 0; ctx.save(); ctx.translate(-130 - tp * 60, -h - 58 - tp * 220); ctx.rotate(tp * 3); ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.ellipse(0, 0, 22, 12, 0, 0, TAU); ctx.fill(); ctx.fillRect(-8, 0, 16, 12 * (1 - tp)); ctx.restore(); if (tp > 0) { ctx.fillStyle = '#4a4f57'; ctx.beginPath(); ctx.ellipse(-130, -h - 52, 12, 6, 0, 0, TAU); ctx.fill(); } }
  const bj = o.baila || 0, ang = bj * 0.28 * Math.sin(t * 38), up = bj * 7 * Math.abs(Math.sin(t * 19));
  ctx.fillStyle = '#6b7280'; ctx.fillRect(-9, -h - 92, 18, 32);
  ctx.save(); ctx.translate(0, -h - 92 - up - (o.levanta || 0) * 30); ctx.rotate(ang); ctx.fillStyle = sep ? '#4a3c2c' : '#3d434c'; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.lineTo(24, -52); ctx.lineTo(-24, -52); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(0, -60, 16, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(-18, -46, 8, 40); ctx.restore();
  ctx.restore(); ctx.restore();
  if (o.vapor) vapor(ctx, x + jx, y + jy - (h + 160 + ld) * s, t, o.vapor, { n: 12, h: (o.vh || 380) * s, r0: 14 * s, r1: 72 * s, rate: o.vrate || 1.4, dx: 50 * s });
  if (o.vtapon && (o.tapon || 0) > 0) vapor(ctx, x + jx - (o.espejo ? -130 : 130) * s, y + jy - (h + 60) * s, t, o.vtapon, { n: 12, h: 420 * s, r0: 20 * s, r1: 90 * s, rate: 1.8, dx: -40 * s }); };

 // ---------- OLLA EN CORTE («rayos X»): agua, vapor, calor, flechas de presión, empaque, válvula con peso y tapón ----------
 const lidY = (x, h, pico) => -h - 16 - pico * (1 - Math.pow(x / (OW / 2 + 16), 2));
 const rejilla = (ctx, x0 = -400, y0 = -400, x1 = W + 400, y1 = HH + 400) => { ctx.fillStyle = '#0b1d3a'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); ctx.strokeStyle = 'rgba(143,216,255,0.12)'; ctx.lineWidth = 2; for (let gx = Math.floor(x0 / 54) * 54; gx <= x1; gx += 54) { ctx.beginPath(); ctx.moveTo(gx, y0); ctx.lineTo(gx, y1); ctx.stroke(); } for (let gy = Math.floor(y0 / 54) * 54; gy <= y1; gy += 54) { ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x1, gy); ctx.stroke(); } };
 const ollaRX = (ctx, t, x, y, s, o = {}) => { const w = OW, h = OH, ld = o.tapaDy || 0, wl = o.nivel ?? 0.42, wy = -h * wl; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // estufa en líneas (para que el corte no flote)
  ctx.strokeStyle = 'rgba(143,216,255,0.55)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w, 52); ctx.lineTo(w, 52); ctx.moveTo(-w / 2 - 30, 52); ctx.lineTo(-w / 2 - 30, 0); ctx.moveTo(w / 2 + 30, 52); ctx.lineTo(w / 2 + 30, 0); ctx.stroke();
  ctx.strokeStyle = 'rgba(143,216,255,0.3)'; ctx.strokeRect(-w + 40, 90, 2 * w - 80, 260); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-w + 140 + i * (2 * w - 280) / 4, 140, 22, 0, TAU); ctx.stroke(); }
  // calor (naranja)
  const ca = o.calor ?? 1; if (ca > 0) for (let i = 0; i < 9; i++) { const fx = -w / 2 + 50 + i * (w - 100) / 8, hh = (34 + 16 * Math.sin(t * 20 + i * 1.7)) * ca, g = ctx.createLinearGradient(0, 50, 0, 50 - hh - 20); g.addColorStop(0, 'rgba(255,120,30,0.95)'); g.addColorStop(1, 'rgba(255,210,70,0.1)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(fx - 20, 50); ctx.quadraticCurveTo(fx - 11, 50 - hh * 0.6, fx, 46 - hh); ctx.quadraticCurveTo(fx + 11, 50 - hh * 0.6, fx + 20, 50); ctx.closePath(); ctx.fill(); }
  // interior (cuerpo + cúpula de la tapa)
  ctx.fillStyle = '#123058'; ctx.fillRect(-w / 2, -h, w, h); ctx.beginPath(); ctx.moveTo(-w / 2, -h - ld); ctx.quadraticCurveTo(0, -h - 104 - ld, w / 2, -h - ld); ctx.lineTo(w / 2, -h); ctx.lineTo(-w / 2, -h); ctx.closePath(); ctx.fill();
  // agua
  const hv = o.hierve ?? 1, ag = ctx.createLinearGradient(0, wy, 0, 0); ag.addColorStop(0, 'rgba(90,180,255,0.9)'); ag.addColorStop(1, 'rgba(30,110,220,0.95)'); ctx.fillStyle = ag; ctx.beginPath(); ctx.moveTo(-w / 2, wy); for (let xx = -w / 2; xx <= w / 2; xx += 20) ctx.lineTo(xx, wy + 6 * Math.sin(xx * 0.05 + t * 8) * hv); ctx.lineTo(w / 2, 0); ctx.lineTo(-w / 2, 0); ctx.closePath(); ctx.fill();
  if (o.comida) { const R = H.rng(5); for (let i = 0; i < 46; i++) { const fx = -w / 2 + 30 + R() * (w - 60), fy = -14 - R() * (-wy - 26) + 3 * Math.sin(t * 6 + i), bl = o.comida; ctx.fillStyle = i % 3 ? `rgb(${Math.round(lerp(122, 160, bl))},${Math.round(lerp(47, 80, bl))},30)` : '#5a2214'; ctx.beginPath(); ctx.ellipse(fx, fy, 15, 10, R() * 3, 0, TAU); ctx.fill(); } }
  if (hv > 0) { ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 3; for (let i = 0; i < 28; i++) { const ph = (t * 1.5 * hv + i * 0.137) % 1, bx = -w / 2 + 20 + ((i * 97) % (w - 40)), by = -6 - ph * (-wy - 12); ctx.beginPath(); ctx.arc(bx + 6 * Math.sin(t * 5 + i), by, 4 + 7 * ph, 0, TAU); ctx.stroke(); } }
  // vapor que llena el espacio (blanco)
  const vp = o.vapor ?? 0; if (vp > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h - 110 - ld, w, h + 110 + ld + wy); ctx.clip(); const R = H.rng(9);
   for (let i = 0; i < 40; i++) { const bx = -w / 2 + 30 + R() * (w - 60) + 20 * Math.sin(t * 1.3 + i), by = wy - 20 - R() * (h + 70 + wy) + 12 * Math.sin(t * 1.7 + i * 2), r = 38 + R() * 38, vis = cl((vp * 40 - i) / 3); if (vis <= 0) continue; ctx.fillStyle = `rgba(255,255,255,${0.5 * vis})`; ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fill(); } ctx.restore(); }
  // flechas de presión (amarillas, crecen)
  const pr = o.presion || 0; if (pr > 0) { const L = 26 + 90 * pr, col = pr > 0.85 && o.rojo ? RD : YE, lw = 9 + 6 * pr; ctx.save(); ctx.globalAlpha = Math.min(1, pr * 3);
   for (const [ex, ey, dx, dy] of [[-w / 2 + 14, -h * 0.72, -1, 0], [w / 2 - 14, -h * 0.72, 1, 0], [-w / 2 + 14, -h * 0.98, -1, 0], [w / 2 - 14, -h * 0.98, 1, 0], [-140, -h - 54, 0, -1], [140, -h - 54, 0, -1], [0, -h - 76, 0, -1]]) flecha(ctx, ex - dx * L, ey - dy * L, ex, ey, col, lw); ctx.restore(); }
  // paredes
  ctx.strokeStyle = '#dbe6f2'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-w / 2, -h - 8); ctx.lineTo(-w / 2, -24); ctx.quadraticCurveTo(-w / 2, 0, -w / 2 + 24, 0); ctx.lineTo(w / 2 - 24, 0); ctx.quadraticCurveTo(w / 2, 0, w / 2, -24); ctx.lineTo(w / 2, -h - 8); ctx.stroke();
  // tapa (en corte) con empaque, válvula y tapón
  ctx.save(); ctx.translate(0, -ld);
  ctx.strokeStyle = '#dbe6f2'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-w / 2 - 18, -h - 16); ctx.quadraticCurveTo(0, -h - 120, w / 2 + 18, -h - 16); ctx.stroke();
  const eg = o.empaque || 0; for (const sx of [-1, 1]) { if (eg > 0) P.glow(ctx, sx * (w / 2), -h - 14, 60 + 30 * eg, '255,90,60', 0.5 * eg); ctx.fillStyle = '#e8463c'; ctx.beginPath(); ctx.roundRect(sx * (w / 2) - 16, -h - 24 + (ld > 2 ? 0 : 2), 32, ld > 2 ? 22 : 18, 8); ctx.fill(); }
  const vy = lidY(0, h, 52), lift = (o.peso || 0) * 44; ctx.fillStyle = '#9fb0c4'; ctx.fillRect(-13, vy - 46, 26, 50); ctx.fillStyle = '#123058'; ctx.fillRect(-5, vy - 46, 10, 50);
  if (o.tapado) { ctx.fillStyle = '#8a4b22'; ctx.fillRect(-6, vy - 40, 12, 34 * o.tapado); ctx.beginPath(); ctx.arc(0, vy - 40, 9 * o.tapado, 0, TAU); ctx.fill(); }
  if (lift > 6 && !o.tapado) { vapor(ctx, -30, vy - 52 - lift * 0.5, t, Math.min(1, lift / 30), { n: 7, h: 160, r0: 8, r1: 46, rate: 2.4, dx: -90 }); vapor(ctx, 30, vy - 52 - lift * 0.5, t + 0.37, Math.min(1, lift / 30), { n: 7, h: 160, r0: 8, r1: 46, rate: 2.4, dx: 90 }); }
  ctx.save(); ctx.translate(0, vy - 46 - lift); ctx.fillStyle = '#c7d0dc'; ctx.beginPath(); ctx.moveTo(-42, 10); ctx.lineTo(42, 10); ctx.lineTo(29, -54); ctx.lineTo(-29, -54); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#123058'; ctx.fillRect(-16, -16, 32, 26); ctx.fillStyle = '#c7d0dc'; ctx.beginPath(); ctx.arc(0, -62, 17, 0, TAU); ctx.fill(); if (o.marcaPeso) { ctx.strokeStyle = YE; ctx.lineWidth = 6; ctx.strokeRect(-52, -84, 104, 100); } ctx.restore();
  const px = -150, py = lidY(px, h, 52), tp = o.tapon || 0; ctx.save(); ctx.translate(px - tp * 40, py - 8 - tp * 190); ctx.rotate(tp * 2.6); ctx.fillStyle = '#e8463c'; ctx.beginPath(); ctx.ellipse(0, 0, 26, 13, 0, 0, TAU); ctx.fill(); ctx.fillRect(-9, 0, 18, 26); ctx.restore();
  if (tp > 0.05) vapor(ctx, px, py - 10, t, Math.min(1, tp * 3) * (o.vtapon ?? 1), { n: 12, h: 330, r0: 16, r1: 80, rate: 2.2, dx: -70 });
  if (o.marcaTapon) { ctx.strokeStyle = YE; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(px, py - 12, 50, 0, TAU); ctx.stroke(); }
  ctx.restore(); ctx.restore(); };

 // ---------- medidor de presión y termómetro ----------
 const manometro = (ctx, x, y, r, v, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#2b2f36'; ctx.beginPath(); ctx.arc(0, 0, r + 14, 0, TAU); ctx.fill(); ctx.fillStyle = '#f7f4ec'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  const a0 = Math.PI * 0.75, a1 = Math.PI * 2.25; for (const [u0, u1, c] of [[0, 0.55, GR], [0.55, 0.8, YE], [0.8, 1, RD]]) { ctx.strokeStyle = c; ctx.lineWidth = r * 0.14; ctx.beginPath(); ctx.arc(0, 0, r * 0.78, lerp(a0, a1, u0), lerp(a0, a1, u1)); ctx.stroke(); }
  ctx.strokeStyle = '#333'; ctx.lineWidth = 4; for (let i = 0; i <= 10; i++) { const a = lerp(a0, a1, i / 10); ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.58, Math.sin(a) * r * 0.58); ctx.lineTo(Math.cos(a) * r * 0.67, Math.sin(a) * r * 0.67); ctx.stroke(); }
  const a = lerp(a0, a1, cl(v)) + (o.vibra || 0) * 0.03 * Math.sin((o.t || 0) * 50); ctx.strokeStyle = RD; ctx.lineWidth = r * 0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-Math.cos(a) * r * 0.15, -Math.sin(a) * r * 0.15); ctx.lineTo(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7); ctx.stroke();
  ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(0, 0, r * 0.1, 0, TAU); ctx.fill(); txt(ctx, o.label || 'PRESIÓN', 0, r * 0.45, Math.max(34, r * 0.17), '#333', { w: 900, f: 'Nunito' }); ctx.restore(); };
 const termometro = (ctx, x, y, hg, tc, o = {}) => { const wd = hg * 0.13, top = y - hg, Y = (c) => lerp(y - wd * 1.2, top + wd * 0.8, (c - 90) / 40), yv = Y(Math.max(90, tc));
  ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.roundRect(x - wd / 2, top, wd, hg, wd / 2); ctx.fill(); ctx.beginPath(); ctx.arc(x, y, wd * 0.95, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e8463c'; ctx.beginPath(); ctx.arc(x, y, wd * 0.7, 0, TAU); ctx.fill(); ctx.fillRect(x - wd * 0.22, yv, wd * 0.44, y - yv);
  ctx.fillStyle = '#555'; for (let c = 90; c <= 130; c += 5) ctx.fillRect(x + wd * 0.1, Y(c) - 2, wd * (c % 10 ? 0.25 : 0.4), 4);
  for (const c of [100, 120]) { const yy = Y(c); ctx.fillStyle = c === 120 && tc >= 119 ? YE : '#ffffff'; ctx.fillRect(x + wd / 2, yy - 4, wd * 0.6, 8); txt(ctx, c + ' °C', x + wd * 0.5 + hg * 0.2, yy, Math.max(40, hg * 0.075), c === 120 && tc >= 119 ? YE : '#ffffff', { w: 900, f: 'Nunito' }); }
  ctx.restore(); };
 const reloj = (ctx, t, x, y, r, vel) => { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#333'; ctx.lineWidth = r * 0.08; ctx.stroke(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.fillStyle = '#333'; ctx.fillRect(Math.cos(a) * r * 0.78 - 4, Math.sin(a) * r * 0.78 - 4, 8, 8); }
  ctx.lineCap = 'round'; ctx.strokeStyle = '#333'; ctx.lineWidth = r * 0.07; const a1 = t * vel * 0.083 - Math.PI / 2, a2 = t * vel - Math.PI / 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a1) * r * 0.45, Math.sin(a1) * r * 0.45); ctx.stroke(); ctx.strokeStyle = RD; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a2) * r * 0.7, Math.sin(a2) * r * 0.7); ctx.stroke(); ctx.restore(); };

 // ---------- GASEOSA (botella genérica, sin marca; y = base) ----------
 const botella = (ctx, t, x, y, s, o = {}) => { const bw = 200, bh = 560, du = o.dura || 0; ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang || 0); ctx.scale(s * (1 + du * 0.07), s);
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(0, 6, bw * 0.62, 14, 0, 0, TAU); ctx.fill();
  const path = () => { ctx.beginPath(); ctx.moveTo(-bw / 2, -20); ctx.quadraticCurveTo(-bw / 2, 0, -bw / 2 + 20, 0); ctx.lineTo(bw / 2 - 20, 0); ctx.quadraticCurveTo(bw / 2, 0, bw / 2, -20); ctx.lineTo(bw / 2, -bh * 0.58); ctx.quadraticCurveTo(bw / 2, -bh * 0.75, 36, -bh * 0.86); ctx.lineTo(36, -bh * 0.95); ctx.lineTo(-36, -bh * 0.95); ctx.lineTo(-36, -bh * 0.86); ctx.quadraticCurveTo(-bw / 2, -bh * 0.75, -bw / 2, -bh * 0.58); ctx.closePath(); };
  ctx.save(); path(); ctx.clip(); const lq = o.nivel ?? 0.74, ly = -bh * lq + 8 * Math.sin(t * 9) * (o.agita || 0); ctx.fillStyle = 'rgba(255,140,30,0.93)'; ctx.fillRect(-bw, ly, bw * 2, -ly + 10);
  const nb = o.burbujas ?? 0.25, R = H.rng(4); ctx.fillStyle = 'rgba(255,255,255,0.85)'; for (let i = 0; i < 60; i++) { if (i / 60 > nb) break; const ph = (t * (0.6 + R()) + R()) % 1, bx = -bw / 2 + 16 + R() * (bw - 32), by = -10 - ph * (bh * 0.95 - 10); ctx.beginPath(); ctx.arc(bx + 5 * Math.sin(t * 6 + i), by, 4 + R() * 7, 0, TAU); ctx.fill(); }
  if (o.gas) { ctx.fillStyle = `rgba(255,255,255,${0.35 * o.gas})`; ctx.fillRect(-bw, -bh, bw * 2, bh - lq * bh + ly + bh * lq); }
  ctx.restore();
  path(); ctx.fillStyle = 'rgba(220,240,255,0.16)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#2f6db5'; ctx.fillRect(-bw / 2, -bh * 0.44, bw, bh * 0.17); ctx.fillStyle = YE; ctx.beginPath(); ctx.arc(0, -bh * 0.355, 28, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(-bw / 2 + 22, -bh * 0.56, 16, bh * 0.5);
  const af = o.afloja || 0; ctx.save(); ctx.translate(0, -bh * 0.95 - af * 16); ctx.rotate(af * 0.35); ctx.fillStyle = '#e8463c'; ctx.beginPath(); ctx.roundRect(-44, -42, 88, 44, 6); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.2)'; for (let i = -36; i < 40; i += 12) ctx.fillRect(i, -40, 4, 40); ctx.restore();
  ctx.restore(); };
 const mesaCocina = (ctx, y) => { ctx.fillStyle = '#9c6b3f'; ctx.fillRect(-900, y, W + 1800, 60); ctx.fillStyle = '#7a5130'; ctx.fillRect(-900, y + 60, W + 1800, 1400); ctx.strokeStyle = 'rgba(60,35,15,0.35)'; ctx.lineWidth = 4; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-900, y + 18 + k * 12); for (let x = -900; x <= W + 900; x += 90) ctx.lineTo(x, y + 18 + k * 12 + 4 * Math.sin(x * 0.02 + k)); ctx.stroke(); } for (let x = -900; x < W + 900; x += 240) { ctx.beginPath(); ctx.moveTo(x, y + 60); ctx.lineTo(x, y + 1400); ctx.stroke(); } };

 // ---------- PERSONAS (de pie, detrás del mueble: se ven de la cintura hacia arriba) ----------
 const persona = (ctx, t, x, y, s, o = {}) => { const m = o.miedo || 0, son = o.sonrie || 0, j = o.salto || 0; ctx.save(); ctx.translate(x, y - j * 110 * s); ctx.rotate(o.incl || 0); ctx.scale(s, s); const ropa = o.ropa || '#3d6fb6', piel = o.piel || '#d9a074';
  ctx.fillStyle = '#3a3550'; ctx.fillRect(-56, -200, 48, 200); ctx.fillRect(8, -200, 48, 200);
  ctx.fillStyle = ropa; ctx.beginPath(); ctx.roundRect(-74, -470, 148, 290, [56, 56, 14, 14]); ctx.fill();
  if (o.abuela) { ctx.fillStyle = '#f4efe6'; ctx.beginPath(); ctx.roundRect(-54, -400, 108, 230, 12); ctx.fill(); ctx.strokeStyle = '#c8553d'; ctx.lineWidth = 6; ctx.strokeRect(-40, -330, 80, 60); }
  const brazoArriba = m > 0.5, pecho = o.pecho; ctx.strokeStyle = ropa; ctx.lineWidth = 36; ctx.lineCap = 'round';
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 56, -440); let hx, hy; if (brazoArriba) { hx = k * 80; hy = -560; } else if (pecho && k === 1) { hx = 10; hy = -380; } else if (o.cuchara && k === 1) { hx = 130; hy = -330; } else { hx = k * 86; hy = -260; } ctx.lineTo(hx, hy); ctx.stroke(); ctx.fillStyle = piel; ctx.beginPath(); ctx.arc(hx, hy, 22, 0, TAU); ctx.fill();
   if (o.cuchara && k === 1 && !brazoArriba) { ctx.save(); ctx.translate(hx, hy); ctx.rotate(0.5); ctx.fillStyle = '#9c6b3f'; ctx.fillRect(-6, -10, 12, 130); ctx.beginPath(); ctx.ellipse(0, 130, 22, 16, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
  ctx.fillStyle = piel; ctx.fillRect(-20, -500, 40, 40); ctx.beginPath(); ctx.arc(0, -548, 64, 0, TAU); ctx.fill();
  if (o.abuela) { ctx.fillStyle = '#d6d6d6'; ctx.beginPath(); ctx.arc(-2, -568, 66, Math.PI * 0.92, Math.PI * 2.08); ctx.fill(); ctx.beginPath(); ctx.arc(0, -628, 30, 0, TAU); ctx.fill(); }
  else { ctx.fillStyle = o.pelo || '#2a1d16'; ctx.beginPath(); ctx.arc(-4, -566, 64, Math.PI * 0.95, Math.PI * 2.05); ctx.fill(); }
  ctx.fillStyle = '#fff'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -546, 9 + 8 * m, 0, TAU); ctx.fill(); } ctx.fillStyle = '#111'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -546, 4.5, 0, TAU); ctx.fill(); }
  if (o.abuela) { ctx.strokeStyle = '#5a4636'; ctx.lineWidth = 4; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -546, 19, 0, TAU); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-4, -546); ctx.lineTo(4, -546); ctx.stroke(); }
  ctx.fillStyle = 'rgba(230,110,100,0.35)'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 38, -520, 12, 0, TAU); ctx.fill(); }
  if (m > 0.4) { ctx.fillStyle = '#3a1410'; ctx.beginPath(); ctx.ellipse(0, -508, 13, 16 * m, 0, 0, TAU); ctx.fill(); } else { ctx.strokeStyle = '#3a1410'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -526, 18 + 6 * son, 0.25, Math.PI - 0.25); ctx.stroke(); }
  ctx.restore(); };

 // =====================================================================================================
 // ESCENAS (un plano por idea, ninguno > 4 s quieto; textos siempre encima del vapor y los destellos)
 // =====================================================================================================
 const B = [];
 const EY = 1200;   // superficie de la estufa en los planos de cocina
 const planoCocina = (ctx, t, o = {}) => { cocinaFondo(ctx, t, { ey: EY }); if (o.gente) o.gente(ctx); cocinaMueble(ctx, t, { ey: EY }); hornilla(ctx, t, o.x ?? 620, EY, 420, o.llama ?? 1); olla(ctx, t, o.x ?? 620, EY - 46, o.s ?? 1.2, o.olla || {}); };

 // ---------- 1 · GANCHO: la olla pita y tiembla, la familia salta del susto → (1,2 s) primer plano de la válvula: chorro a la cámara (90 %) → la cocina ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  if (PORTADA) { cocinaFondo(ctx, 0.4, { ey: 1500, ventana: false }); cocinaMueble(ctx, 0.4, { ey: 1500 }); hornilla(ctx, 0.4, 610, 1500, 480, 1); olla(ctx, 0.4, 610, 1454, 1.45, { baila: 1, vapor: 1, vh: 520, vrate: 1.2 }); return; }
  P.pregunta(ctx, '¿POR QUÉ NO EXPLOTA / LA OLLA A PRESIÓN?', t, 0, S(2) - 0.15, { capY: 330, px: 58, clave: 'EXPLOTA', x: 540, dy: 110 });
  const golpes = [[T_LLENA, 1.0], [T_CORTE, 0.3]], sh = sacude(t, golpes, 42);
  ctx.save(); ctx.translate(sh[0], sh[1]);
  if (t < T_CORTE) { const cam = [lerp(560, 590, t / T_CORTE), lerp(880, 870, t / T_CORTE), lerp(1.08, 1.16, t / T_CORTE)]; ctx.save(); zoomP(ctx, cam);
   planoCocina(ctx, t, { x: 620, s: 1.18, olla: { tiembla: 1, baila: 1, vapor: 1, espejo: true }, gente: (c) => persona(c, t, 200, EY + 60, 0.9, { miedo: sm(0.35, 0.55, t), salto: Math.sin(Math.PI * cl((t - 0.4) / 0.5)), ropa: '#3a7a4a' }) }); ctx.restore(); }
  else if (t < T_VUELTA) { const u = E.in(cl((t - T_CORTE) / (T_LLENA - T_CORTE))), z = lerp(2.6, 3.0, cl((t - T_CORTE) / 1.5)); ctx.save(); zoomP(ctx, [620, 640, z]); planoCocina(ctx, t, { x: 620, s: 1.18, olla: { tiembla: 1.4, baila: 1.4, vapor: 0.6, espejo: true } }); ctx.restore();
   const k = t < T_LLENA ? u : 1 - 0.55 * E.out(cl((t - T_LLENA) / (T_VUELTA - T_LLENA))); chorro(ctx, t, 540, 930, k, { rad: 420 }); }
  else { const cam = camK(t, [[T_VUELTA, 540, 900, 1.0], [S(2), 560, 900, 1.08]]), m = 1 - sm(4.6, 5.4, t); ctx.save(); zoomP(ctx, cam);
   planoCocina(ctx, t, { x: 740, s: 1.12, olla: { tiembla: 1, baila: 1, vapor: 1, espejo: true }, gente: (c) => { persona(c, t, 150, EY + 40, 0.95, { abuela: true, ropa: '#8e4f8a', piel: '#c98d63', miedo: m * 0.3, pecho: true }); persona(c, t, 330, EY + 120, 0.72, { miedo: m, salto: 0.6 * Math.max(0, Math.sin((t - T_VUELTA) * 9)) * m, ropa: '#3a7a4a' }); } }); ctx.restore(); }
  ctx.restore(); fogonazo(ctx, t, [[T_LLENA, 0.85]]);
 }, sfx(k) { k.noise(0, { dur: S(2), color: 'brown', filter: 'lowpass', f: 600, gain: 0.1, a: 0.02, hold: S(2) - 0.4 });
  k.tone(0.0, { f: [[0, 2500], [0.6, 2900], [1.2, 3100]], type: 'sawtooth', dur: 1.25, gain: 0.035, filter: 'bandpass', f2: 2900, a: 0.03 }); for (let x = 0.03; x < S(2); x += 0.11) k.play('tick', x, { f: 900, gain: 0.12, minor: true });
  k.noise(0.0, { dur: S(2), filter: 'highpass', f: 3500, gain: 0.05, a: 0.05 }); k.play('pop', 0.45, { f: 300, gain: 0.25, minor: true });
  k.play('whoosh', T_CORTE - 0.05, { dur: 0.35, top: 3000, gain: 0.35, minor: true }); k.noise(T_CORTE, { dur: 1.3, filter: 'highpass', f: [[0, 1500], [0.7, 4000]], gain: 0.35, a: 0.4 });
  k.tone(T_CORTE + 0.1, { f: [[0, 2800], [0.6, 3600]], type: 'sawtooth', dur: 1.0, gain: 0.05, filter: 'bandpass', f2: 3300, a: 0.2 }); k.play('thud', T_LLENA, { f: 40, gain: 1.0 }); k.noise(T_LLENA, { dur: 0.9, color: 'brown', filter: 'lowpass', f: [[0, 1800], [0.9, 150]], gain: 0.35, a: 0.003 });
  k.tone(T_VUELTA, { f: [[0, 2700], [2.8, 3000]], type: 'sawtooth', dur: S(2) - T_VUELTA, gain: 0.03, filter: 'bandpass', f2: 2900, a: 0.1 }); k.play('whoosh', T_VUELTA - 0.05, { dur: 0.4, top: 1800, gain: 0.3, minor: true }); } });

 // ---------- 2 · ¿Por qué no explota? → VISTA DESDE ARRIBA: la tapa, la válvula que baila, la llama alrededor ----------
 B.push({ t0: S(2), t1: S(3), in: { type: 'zoom', d: 0.4, x: 540, y: 950 }, draw(ctx, t) {
  const cam = camK(t, [[S(2), 540, 960, 0.95], [S(3), 540, 960, 1.08]]); ctx.save(); zoomP(ctx, cam); ctxGiro(ctx, 540, 960, (t - S(2)) * 0.12);
  ctx.fillStyle = '#2a2d33'; ctx.fillRect(-500, -500, W + 1000, HH + 1000); ctx.strokeStyle = '#3a3e46'; ctx.lineWidth = 6; for (let gx = -500; gx < W + 500; gx += 120) { ctx.beginPath(); ctx.moveTo(gx, -500); ctx.lineTo(gx, HH + 500); ctx.stroke(); }
  const R = H.rng(2); for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.arc(R() * W, R() * HH, 80 + R() * 120, 0, TAU); ctx.fill(); }
  for (const [bx, by] of [[100, 260], [980, 260], [100, 1660], [980, 1660]]) { ctx.strokeStyle = '#1a1c20'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(bx, by, 140, 0, TAU); ctx.stroke(); }
  const x = 540, y = 960, r = 340; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, f = 1 + 0.2 * Math.sin(t * 25 + i * 2.1); ctx.fillStyle = 'rgba(60,120,255,0.9)'; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * (r + 26 * f), y + Math.sin(a) * (r + 26 * f), 24 * f, 11, a, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#1f1f22'; ctx.beginPath(); ctx.roundRect(x - r - 250, y - 26, 270, 52, 24); ctx.fill(); ctx.beginPath(); ctx.roundRect(x + r - 10, y - 22, 100, 44, 20); ctx.fill();
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#cfd5dd'); g.addColorStop(1, '#7d848f'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#9aa1ab'; ctx.lineWidth = 18; ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 4; for (const rr of [0.35, 0.68]) { ctx.beginPath(); ctx.arc(x, y, r * rr, 0, TAU); ctx.stroke(); }
  ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(x - r * 0.45, y + r * 0.12, 22, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 14) * 0.6); ctx.fillStyle = '#3d434c'; ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.fill(); ctx.fillStyle = '#6b7280'; ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(-8, -46, 16, 30); ctx.restore();
  for (let i = 0; i < 10; i++) { const ph = (t * 1.1 + i / 10) % 1, a = i * 2.4; ctx.globalAlpha = 0.6 * (1 - ph); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * ph * 260, y + Math.sin(a) * ph * 260, 30 + ph * 90, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
  ctx.restore();
 }, sfx(k) { k.play('whoosh', S(2), { dur: 0.5, top: 1600, gain: 0.3, minor: true }); for (let x = S(2); x < S(3); x += 0.11) k.play('tick', x, { f: 900, gain: 0.12, minor: true }); k.tone(S(2), { f: 2800, type: 'sawtooth', dur: S(3) - S(2), gain: 0.02, filter: 'bandpass', f2: 2800, a: 0.1 }); } });

 // ---------- 3 · Tiene un secreto que casi nadie conoce → la olla de lado, un escáner baja y deja ver un poco por dentro; «?» ----------
 B.push({ t0: S(3), t1: S(4), in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const cam = camK(t, [[S(3), 550, 880, 1.15], [S(4), 550, 860, 1.3]]), ys = lerp(560, 1150, sm(S(3) + 0.3, Tk.secreto + 0.9, t)); ctx.save(); zoomP(ctx, cam);
  planoCocina(ctx, t, { x: 620, s: 1.2, olla: { baila: 0.6, vapor: 0.8 } });
  ctx.save(); ctx.beginPath(); ctx.rect(-400, -400, W + 800, ys + 400); ctx.clip(); rejilla(ctx); ollaRX(ctx, t, 620, EY - 46, 1.2, { vapor: 0.7, presion: 0.4 }); ctx.restore();
  ctx.fillStyle = CY; ctx.fillRect(-400, ys - 4, W + 800, 8); P.glow(ctx, 620, ys, 500, '143,216,255', 0.3);
  ctx.restore(); const q = sm(Tk.secreto - 0.2, Tk.secreto + 0.2, t); anillo(ctx, t, 560, 760, 150, q); if (q > 0) { ctx.save(); ctx.globalAlpha = q; txt(ctx, '?', 560, 760, 200, YE, { w: 900, f: 'Fredoka' }); ctx.restore(); }
 }, sfx(k) { k.play('whoosh', S(3), { dur: 0.4, top: 1800, gain: 0.25, minor: true }); k.tone(S(3) + 0.3, { f: [[0, 300], [1.5, 900]], type: 'sine', dur: 1.6, gain: 0.05 }); FX.revelar(k, Tk.secreto - 0.2); } });

 // ---------- 4 · Piensa en una gaseosa agitada → la botella se sacude sobre la mesa, burbujas ----------
 B.push({ t0: S(4), t1: S(5), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const cam = camK(t, [[S(4), 540, 980, 1.0], [S(5), 540, 960, 1.1]]), ag = sm(S(4), Tk.gaseosa + 0.2, t); ctx.save(); zoomP(ctx, cam);
  cocinaFondo(ctx, t, { ey: 1430 }); mesaCocina(ctx, 1430); botella(ctx, t, 540, 1460, 1.6, { ang: 0.16 * ag * Math.sin(t * 22), agita: ag, burbujas: 0.2 + 0.8 * ag });
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 8; ctx.lineCap = 'round'; if (ag > 0.3) for (const k of [-1, 1]) for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(540, 1010, 280 + i * 36, k < 0 ? Math.PI - 0.35 : -0.35, k < 0 ? Math.PI + 0.35 : 0.35); ctx.stroke(); }
  ctx.restore(); P.tag(ctx, 'GASEOSA AGITADA', 470, 520, t, Tk.gaseosa - 0.2, S(5), { mono: true, col: NAR, px: 58 });
 }, sfx(k) { FX.etiqueta(k, Tk.gaseosa - 0.2); for (let x = S(4) + 0.1; x < S(5); x += 0.09) k.play('tick', x, { f: 500, gain: 0.1, minor: true }); k.noise(S(4) + 0.3, { dur: S(5) - S(4) - 0.3, color: 'pink', filter: 'bandpass', f: 2500, q: 2, gain: 0.06, a: 0.2 }); } });

 // ---------- 5 · con la tapa cerrada, el gas no sale… → primer plano de la tapa: burbujas que empujan y no pueden salir ----------
 B.push({ t0: S(5), t1: S(6), in: { type: 'zoom', d: 0.4, x: 540, y: 700 }, draw(ctx, t) {
  const cam = camK(t, [[S(5), 540, 700, 1.9], [S(6), 540, 690, 2.15]]), pr = sm(S(5), Tk.sale, t); ctx.save(); zoomP(ctx, cam);
  cocinaFondo(ctx, t, { ey: 1430 }); mesaCocina(ctx, 1430); botella(ctx, t, 540, 1460, 1.6, { burbujas: 1, gas: pr });
  ctx.restore(); ctx.save(); ctx.globalAlpha = pr; for (const dx of [-90, 0, 90]) flecha(ctx, 540 + dx, 1380, 540 + dx, 1000 + Math.abs(dx) * 0.6, YE, 18); ctx.restore();
  marcaX(ctx, 540, 800, 90, sm(Tk.sale - 0.3, Tk.sale + 0.1, t)); P.tag(ctx, 'TAPA CERRADA', 470, 520, t, Tk.cerrada - 0.3, S(6), { mono: true, col: YE, px: 58 });
 }, sfx(k) { k.play('whoosh', S(5), { dur: 0.4, top: 1400, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.cerrada - 0.3); k.noise(S(5), { dur: S(6) - S(5), color: 'pink', filter: 'bandpass', f: 3000, q: 2, gain: 0.05, a: 0.3 }); k.play('error', Tk.sale, { f: 'D3', gain: 0.2, minor: true }); } });

 // ---------- 6 · y la botella se pone dura → la botella por dentro: flechas de presión hacia fuera; se hincha ----------
 B.push({ t0: S(6), t1: S(7), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const cam = camK(t, [[S(6), 540, 960, 1.0], [S(7), 540, 960, 1.08]]), du = sm(S(6) + 0.1, Tk.dura, t); ctx.save(); zoomP(ctx, cam);
  rejilla(ctx); ctx.strokeStyle = 'rgba(143,216,255,0.55)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-400, 1460); ctx.lineTo(W + 400, 1460); ctx.stroke(); botella(ctx, t, 540, 1460, 1.65, { burbujas: 1, gas: 1, dura: du });
  ctx.save(); ctx.globalAlpha = du; for (const [y0, dx] of [[1000, 1], [1000, -1], [1250, 1], [1250, -1], [800, 1], [800, -1]]) flecha(ctx, 540 + dx * 80, y0, 540 + dx * (y0 < 900 ? 200 : 330), y0, YE, 18); ctx.restore();
  ctx.restore(); P.tag(ctx, 'PRESIÓN', 470, 1395, t, Tk.dura - 0.5, S(7), { mono: true, col: YE, px: 66 });
 }, sfx(k) { k.play('whoosh', S(6), { dur: 0.4, top: 1600, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.dura - 0.5); k.tone(S(6) + 0.1, { f: [[0, 180], [1.2, 360]], type: 'triangle', dur: 1.3, gain: 0.06 }); } });

 // ---------- 7 · La olla hace lo mismo → paneo de la botella a la olla, sobre la estufa ----------
 B.push({ t0: S(7), t1: S(8), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  const u = E.inOut(cl((t - S(7)) / (Tk.mismo - S(7) + 0.2))), cam = [lerp(170, 830, u), lerp(960, 880, u), lerp(1.05, 1.2, u)]; ctx.save(); zoomP(ctx, cam);
  cocinaFondo(ctx, t, { ey: EY, vx: -400, rx: 720 }); cocinaMueble(ctx, t, { ey: EY }); botella(ctx, t, 140, EY, 0.95, { burbujas: 0.6, gas: 0.5 }); hornilla(ctx, t, 900, EY, 420, 1); olla(ctx, t, 900, EY - 46, 1.15, { baila: 0.5, vapor: 0.7 });
  ctx.restore(); P.tag(ctx, 'IGUAL CON VAPOR', 470, 520, t, Tk.mismo - 0.4, S(8), { mono: true, col: CY, px: 56 });
 }, sfx(k) { k.play('whoosh', S(7), { dur: 0.8, top: 1400, gain: 0.3 }); FX.etiqueta(k, Tk.mismo - 0.4); } });

 // ---------- 8 · su tapa cierra con un empaque de goma → corte: la tapa baja y el empaque rojo sella (clic) ----------
 B.push({ t0: S(8), t1: S(9), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const cierra = sm(S(8) + 0.1, Tk.empaque - 0.1, t), ld = 160 * (1 - cierra), eg = sm(Tk.empaque - 0.15, Tk.empaque + 0.2, t), cam = camK(t, [[S(8), 540, 960, 1.0], [Tk.empaque, 540, 960, 1.0], [S(9), 300, 720, 2.1]]);
  ctx.save(); zoomP(ctx, cam); rejilla(ctx); ollaRX(ctx, t, 540, 1330, 1.35, { tapaDy: ld, empaque: eg, vapor: 0, calor: 0.4, hierve: 0.2 }); ctx.restore();
  P.tag(ctx, 'EMPAQUE DE GOMA', 470, 520, t, Tk.empaque - 0.2, S(9), { mono: true, col: RD, px: 56 });
 }, sfx(k) { k.play('whoosh', S(8), { dur: 0.5, top: 1200, gain: 0.25, minor: true }); k.play('thud', Tk.empaque - 0.1, { f: 90, gain: 0.5 }); k.play('tick', Tk.empaque - 0.05, { f: 1600, gain: 0.35 }); FX.etiqueta(k, Tk.empaque - 0.2); } });

 // ---------- 9 · y el vapor se queda atrapado → corte completo: hierve y el vapor blanco llena el espacio ----------
 B.push({ t0: S(9), t1: S(10), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const vp = sm(S(9), Tk.atrapado + 0.2, t), cam = camK(t, [[S(9), 540, 1000, 1.25], [S(10), 540, 980, 1.0]]); ctx.save(); zoomP(ctx, cam); rejilla(ctx); ollaRX(ctx, t, 540, 1330, 1.35, { vapor: vp, empaque: 0.4, presion: 0.25 * vp }); ctx.restore();
  P.tag(ctx, 'VAPOR ATRAPADO', 470, 520, t, Tk.atrapado - 0.6, S(10), { mono: true, col: '#ffffff', px: 58 });
 }, sfx(k) { k.noise(S(9), { dur: S(10) - S(9), color: 'pink', filter: 'bandpass', f: 800, q: 1, gain: 0.08, a: 0.3 }); for (let x = S(9); x < S(10); x += 0.12) k.play('pop', x, { f: 300 + (x * 997) % 300, gain: 0.06, minor: true }); FX.etiqueta(k, Tk.atrapado - 0.6); } });

 // ---------- 10 · La presión sube… (pausa larga) → el medidor sube despacio, las flechas crecen; tensión ----------
 B.push({ t0: S(10), t1: S(11), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const pr = sm(S(10), S(11), t), cam = camK(t, [[S(10), 540, 980, 1.0], [S(11), 640, 760, 1.35]]); ctx.save(); zoomP(ctx, cam); rejilla(ctx); ollaRX(ctx, t, 540, 1330, 1.35, { vapor: 1, presion: 0.3 + 0.7 * pr, empaque: 0.4 });
  manometro(ctx, 760, 760, 120, 0.15 + 0.8 * pr, { vibra: pr, t }); ctx.restore();
  const tn = sm(S(10) + 0.8, S(11), t); if (tn > 0) { ctx.fillStyle = `rgba(255,80,60,${0.12 * tn * (0.6 + 0.4 * Math.sin(t * 14))})`; ctx.fillRect(0, 0, W, HH); }
 }, sfx(k) { k.noise(S(10), { dur: S(11) - S(10), color: 'pink', filter: 'bandpass', f: [[0, 600], [2, 1800]], q: 1, gain: 0.08, a: 0.3 }); k.play('riser', S(10) + 0.2, { dur: S(11) - S(10) - 0.2, gain: 0.35 }); FX.latido(k, Tk.sube + 0.1, 3, 0.45); } });

 // ---------- 11 · y el agua puede pasar de cien grados → ¡GOLPE! termómetro gigante que sube por encima de 100 ----------
 B.push({ t0: S(11), t1: S(12), in: { type: 'cut' }, draw(ctx, t) {
  const golpes = [[S(11) + 0.02, 1.0]], sh = sacude(t, golpes, 40), tc = lerp(98, 110, sm(S(11), S(12), t)), cam = camK(t, [[S(11), 540, 980, 1.1], [S(12), 540, 960, 1.0]]);
  ctx.save(); zoomP(ctx, cam, sh); rejilla(ctx); ollaRX(ctx, t, 540, 1330, 1.35, { vapor: 1, presion: 1, empaque: 0.3, hierve: 1.6 }); termometro(ctx, 360, 1240, 760, tc); ctx.restore();
  fogonazo(ctx, t, golpes); P.tag(ctx, 'MÁS DE 100 °C', 470, 520, t, Tk.cien - 0.3, S(12), { mono: true, col: NAR, px: 62 });
 }, sfx(k) { k.play('thud', S(11), { f: 45, gain: 1.0 }); k.noise(S(11), { dur: 0.6, filter: 'highpass', f: 2500, gain: 0.35, a: 0.002 }); k.tone(S(11), { f: [[0, 2400], [0.8, 3200]], type: 'sawtooth', dur: 0.9, gain: 0.05, filter: 'bandpass', f2: 3000, a: 0.01 }); FX.etiqueta(k, Tk.cien - 0.3); } });

 // ---------- 12 · llega a unos ciento veinte → primer plano del termómetro: la columna llega a 120 (ding) ----------
 B.push({ t0: S(12), t1: S(13), in: { type: 'zoom', d: 0.35, x: 400, y: 700 }, draw(ctx, t) {
  const tc = lerp(110, 120, sm(S(12), Tk.veinte, t)), cam = camK(t, [[S(12), 470, 820, 1.35], [S(13), 470, 760, 1.55]]); ctx.save(); zoomP(ctx, cam); rejilla(ctx); ollaRX(ctx, t, 540, 1330, 1.35, { vapor: 1, presion: 1, hierve: 1.6 }); termometro(ctx, 360, 1240, 760, tc); ctx.restore();
  P.tag(ctx, '≈ 120 °C', 470, 1390, t, Tk.veinte - 0.3, S(13), { mono: true, col: YE, px: 70 });
 }, sfx(k) { k.tone(S(12), { f: [[0, 400], [1.2, 800]], type: 'triangle', dur: 1.3, gain: 0.05 }); k.play('ding', Tk.veinte, { f: 'E6', gain: 0.25 }); FX.etiqueta(k, Tk.veinte - 0.3); } });

 // ---------- 13 · Por eso cocina mucho más rápido → corte con frijoles que se ablandan y un reloj que gira veloz ----------
 B.push({ t0: S(13), t1: S(14), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const bl = sm(S(13), S(14), t), cam = camK(t, [[S(13), 540, 1000, 1.0], [S(14), 520, 1040, 1.12]]); ctx.save(); zoomP(ctx, cam); rejilla(ctx); ollaRX(ctx, t, 540, 1330, 1.35, { vapor: 1, presion: 0.8, comida: bl, nivel: 0.5 }); reloj(ctx, t, 800, 700, 120, 9); ctx.restore();
  P.tag(ctx, 'MÁS RÁPIDO', 470, 520, t, Tk.rapido - 0.5, S(14), { mono: true, col: GR, px: 64 });
 }, sfx(k) { FX.reloj(k, S(13) + 0.1, 18, 0.12); FX.etiqueta(k, Tk.rapido - 0.5); FX.correcto(k, Tk.rapido); } });

 // ---------- 14 · ¿Y el pito? → primer plano de la válvula por fuera, bailando y silbando ----------
 B.push({ t0: S(14), t1: S(15), in: { type: 'zoom', d: 0.35, x: 540, y: 800 }, draw(ctx, t) {
  const cam = camK(t, [[S(14), 620, 650, 2.2], [S(15), 620, 640, 2.5]]); ctx.save(); zoomP(ctx, cam); planoCocina(ctx, t, { x: 620, s: 1.2, olla: { baila: 1.3, vapor: 1, tiembla: 0.6 } }); ctx.restore();
  anillo(ctx, t, 540, 900, 260, sm(Tk.pito - 0.3, Tk.pito, t));
 }, sfx(k) { k.tone(S(14), { f: [[0, 2700], [1, 3000]], type: 'sawtooth', dur: S(15) - S(14), gain: 0.045, filter: 'bandpass', f2: 2900, a: 0.02 }); for (let x = S(14); x < S(15); x += 0.08) k.play('tick', x, { f: 1000, gain: 0.14, minor: true }); FX.revelar(k, Tk.pito - 0.3); } });

 // ---------- 15 · Es una válvula con un peso → rayos X de la válvula: el peso apoyado sobre el tubito ----------
 B.push({ t0: S(15), t1: S(16), in: { type: 'zoom', d: 0.35, x: 540, y: 900 }, draw(ctx, t) {
  const cam = camK(t, [[S(15), 540, 760, 2.0], [S(16), 530, 720, 2.35]]); ctx.save(); zoomP(ctx, cam); rejilla(ctx); ollaRX(ctx, t, 540, 1330, 1.35, { vapor: 1, presion: 0.5, marcaPeso: sm(Tk.peso - 0.4, Tk.peso, t) > 0.5 }); ctx.restore();
  P.tag(ctx, 'VÁLVULA CON PESO', 470, 520, t, Tk.peso - 0.5, S(16), { mono: true, col: YE, px: 56 });
 }, sfx(k) { k.play('whoosh', S(15), { dur: 0.4, top: 1600, gain: 0.25, minor: true }); k.play('thud', Tk.peso, { f: 120, gain: 0.3 }); FX.etiqueta(k, Tk.peso - 0.5); } });

 // ---------- 16 · la presión lo levanta y sale un poquito de vapor → rayos X: el peso sube, sale vapor, baja (ciclo); la cámara se mueve ----------
 B.push({ t0: S(16), t1: S(17), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  const c = Math.max(0, Math.sin((t - Tk.levanta + 0.3) * 7.5)), lift = t < Tk.levanta - 0.3 ? 0 : c, cam = camK(t, [[S(16), 530, 720, 2.35], [Tk.levanta + 0.6, 550, 700, 2.4], [S(17), 540, 900, 1.35]]);
  ctx.save(); zoomP(ctx, cam); rejilla(ctx); ollaRX(ctx, t, 540, 1330, 1.35, { vapor: 1, presion: 0.75 - 0.2 * lift, peso: lift }); ctx.restore();
  
  P.tag(ctx, 'SALE UN POQUITO', 470, 520, t, Tk.vapor16 - 0.6, S(17), { mono: true, col: '#ffffff', px: 56 });
 }, sfx(k) { for (let x = Tk.levanta - 0.3 + 0.2; x < S(17); x += 2 * Math.PI / 7.5) { k.noise(x, { dur: 0.35, filter: 'highpass', f: 3000, gain: 0.2, a: 0.02 }); k.play('tick', x - 0.05, { f: 1300, gain: 0.18, minor: true }); } FX.etiqueta(k, Tk.vapor16 - 0.6); } });

 // ---------- 17 · como al aflojar la tapa de la gaseosa → la tapa de la botella se afloja: «psss» ----------
 B.push({ t0: S(17), t1: S(18), in: { type: 'zoom', d: 0.35, x: 540, y: 700 }, draw(ctx, t) {
  const af = sm(Tk.aflojar - 0.2, Tk.aflojar + 0.2, t), cam = camK(t, [[S(17), 540, 820, 1.5], [S(18), 540, 780, 1.7]]); ctx.save(); zoomP(ctx, cam);
  cocinaFondo(ctx, t, { ey: 1430 }); mesaCocina(ctx, 1430); botella(ctx, t, 540, 1460, 1.6, { afloja: af, burbujas: 1 - 0.5 * af, gas: 1 - af }); if (af > 0.1) { vapor(ctx, 505, 560, t, af, { n: 9, h: 240, r0: 10, r1: 46, rate: 2.2, dx: -120, a: 0.8 }); vapor(ctx, 575, 560, t + 0.3, af, { n: 9, h: 240, r0: 10, r1: 46, rate: 2.2, dx: 120, a: 0.8 }); }
  ctx.restore(); if (af > 0.2) { ctx.save(); ctx.globalAlpha = af; txt(ctx, 'PSSS…', 760, 760, 80, '#ffffff', { w: 900, f: 'Fredoka' }); ctx.restore(); }
 }, sfx(k) { k.play('whoosh', S(17), { dur: 0.4, top: 1400, gain: 0.2, minor: true }); k.noise(Tk.aflojar, { dur: 1.2, filter: 'highpass', f: 4000, gain: 0.3, a: 0.02 }); } });

 // ---------- 18 · Pero si la válvula se tapa, o alguien fuerza la tapa… → rayos X: válvula tapada (rojo) → por fuera: la tapa forzada ----------
 B.push({ t0: S(18), t1: S(19), in: { type: 'zoom', d: 0.35, x: 540, y: 900 }, draw(ctx, t) {
  const tb = Tk.fuerza - 0.25;
  if (t < tb) { const tp = sm(S(18) + 0.2, Tk.tapada, t), cam = camK(t, [[S(18), 540, 900, 2.1], [tb, 540, 940, 1.7]]); ctx.save(); zoomP(ctx, cam); rejilla(ctx); ollaRX(ctx, t, 540, 1330, 1.35, { vapor: 1, presion: 0.6 + 0.4 * tp, rojo: true, tapado: tp }); ctx.restore(); marcaX(ctx, 540, 820, 80, sm(Tk.tapada - 0.1, Tk.tapada + 0.2, t)); P.tag(ctx, 'VÁLVULA TAPADA', 470, 520, t, Tk.tapada - 0.4, tb, { mono: true, col: RD, px: 56 }); }
  else { const cam = camK(t, [[tb, 560, 760, 1.5], [S(19), 560, 740, 1.65]]), fz = sm(tb, S(19), t); ctx.save(); zoomP(ctx, cam); planoCocina(ctx, t, { x: 640, s: 1.2, olla: { tiembla: 1.5 * fz, pin: 1 } }); ctx.restore();
   ctx.save(); ctx.globalAlpha = fz; ctx.strokeStyle = RD; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(540, 900, 360, Math.PI * 1.05, Math.PI * 1.05 + 1.3 * fz); ctx.stroke(); const ea = Math.PI * 1.05 + 1.3 * fz; flecha(ctx, 540 + Math.cos(ea - 0.15) * 360, 900 + Math.sin(ea - 0.15) * 360, 540 + Math.cos(ea) * 360, 900 + Math.sin(ea) * 360, RD, 22); ctx.restore();
   P.tag(ctx, 'TAPA FORZADA', 470, 520, t, tb + 0.05, S(19), { mono: true, col: RD, px: 58 }); }
 }, sfx(k) { k.play('error', Tk.tapada, { f: 'C3', gain: 0.25 }); FX.etiqueta(k, Tk.tapada - 0.4); k.play('whoosh', Tk.fuerza - 0.3, { dur: 0.3, top: 1400, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.fuerza - 0.2); k.noise(Tk.fuerza, { dur: S(19) - Tk.fuerza, color: 'brown', filter: 'bandpass', f: 200, q: 2, gain: 0.15, a: 0.2 }); k.play('riser', S(18) + 0.2, { dur: S(19) - S(18) - 0.2, gain: 0.3, minor: true }); } });

 // ---------- 19 · el vapor sale de golpe → ¡IMPACTO! chorro de vapor hacia la cámara, destello, sacudida ----------
 B.push({ t0: S(19), t1: S(20), in: { type: 'cut' }, draw(ctx, t) {
  const g0 = S(19) + 0.05, golpes = [[g0, 1.2]], sh = sacude(t, golpes, 48), k = E.out(cl((t - S(19)) / 0.45)) * (1 - 0.4 * sm(Tk.golpe + 0.3, S(20), t)); ctx.save(); ctx.translate(sh[0], sh[1]);
  ctx.save(); zoomP(ctx, [570, 780, 1.5]); planoCocina(ctx, t, { x: 640, s: 1.2, olla: { tiembla: 2, tapaDy: 26 * k } }); ctx.restore(); chorro(ctx, t, 540, 880, k, { rad: 440, seed: 7 }); ctx.restore();
  fogonazo(ctx, t, golpes); P.tag(ctx, '¡DE GOLPE!', 470, 520, t, Tk.golpe - 0.3, S(20), { mono: true, col: RD, px: 66 });
 }, sfx(k) { k.play('thud', S(19) + 0.05, { f: 38, gain: 1.0 }); k.noise(S(19) + 0.05, { dur: 1.6, filter: 'highpass', f: [[0, 1200], [1.6, 3000]], gain: 0.45, a: 0.005 }); k.noise(S(19) + 0.05, { dur: 1.0, color: 'brown', filter: 'lowpass', f: [[0, 1600], [1, 120]], gain: 0.35, a: 0.003 }); FX.etiqueta(k, Tk.golpe - 0.3); } });

 // ---------- 20 · Por eso algunas ollas viejas sí podían ser peligrosas → cocina antigua en sepia, olla vieja abollada, alerta ----------
 B.push({ t0: S(20), t1: S(21), in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = camK(t, [[S(20), 470, 880, 1.1], [S(21), 620, 860, 1.25]]); ctx.save(); zoomP(ctx, cam); cocinaFondo(ctx, t, { ey: EY }); cocinaMueble(ctx, t, { ey: EY }); hornilla(ctx, t, 620, EY, 420, 1); olla(ctx, t, 620, EY - 46, 1.2, { sepia: true, tiembla: 0.5, baila: 0.8, vapor: 0.8 }); ctx.restore();
  sepia(ctx, 1); const al = sm(Tk.viejas + 0.2, Tk.viejas + 0.6, t); if (al > 0) P.icon(ctx, 'alerta', 820, 700, 170 * E.out(al), { mode: 'flat', col: RD, col2: '#fff' });
  P.tag(ctx, 'OLLAS VIEJAS', 470, 520, t, Tk.viejas - 0.4, S(21), { mono: true, col: YE, px: 60 });
 }, sfx(k) { k.play('whoosh', S(20), { dur: 0.6, top: 1000, gain: 0.25 }); k.noise(S(20), { dur: S(21) - S(20), color: 'pink', filter: 'bandpass', f: 1800, q: 0.7, gain: 0.04, a: 0.4 }); FX.etiqueta(k, Tk.viejas - 0.4); k.play('error', Tk.viejas + 0.3, { f: 'A2', gain: 0.25, minor: true }); } });

 // ---------- 21 · Las de hoy tienen varios seguros → olla moderna brillante con 3 seguros marcados (✓) ----------
 B.push({ t0: S(21), t1: S(22), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const cam = camK(t, [[S(21), 560, 860, 1.1], [S(22), 560, 830, 1.22]]); ctx.save(); zoomP(ctx, cam); planoCocina(ctx, t, { x: 640, s: 1.25, olla: { baila: 0.4, vapor: 0.5, pin: 1 } }); P.glow(ctx, 600, 820, 520, '255,255,255', 0.15);
  const pts = [[640, 1154 - 1.25 * (OH + 150)], [640 - 130 * 1.25, 1154 - 1.25 * (OH + 58)], [640 - 1.25 * (OW / 2 - 3), 1154 - 1.25 * (OH + 50)]];
  pts.forEach(([px, py], i) => { const a = sm(Tk.seguros - 0.6 + i * 0.35, Tk.seguros - 0.3 + i * 0.35, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = GR; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(px, py, 58, 0, TAU); ctx.stroke(); ctx.restore(); P.icon(ctx, 'check', px + 52, py - 52, 70 * E.out(a), { mode: 'flat', col: GR, col2: '#fff' }); });
  ctx.restore(); P.tag(ctx, 'VARIOS SEGUROS', 470, 520, t, Tk.seguros - 0.6, S(22), { mono: true, col: GR, px: 60 });
 }, sfx(k) { k.play('whoosh', S(21), { dur: 0.5, top: 1600, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.seguros - 0.6); for (let i = 0; i < 3; i++) k.play('ding', Tk.seguros - 0.4 + i * 0.35, { f: ['C6', 'E6', 'G6'][i], gain: 0.18 }); } });

 // ---------- 22 · un tapón que salta si la válvula se tapa → rayos X: válvula tapada, presión al máximo… ¡el tapón salta! ----------
 B.push({ t0: S(22), t1: S(23), in: { type: 'zoom', d: 0.35, x: 540, y: 900 }, draw(ctx, t) {
  const g0 = Tk.salta, tp = E.out(cl((t - g0) / 0.35)), golpes = [[g0, 1.0]], sh = sacude(t, golpes, 36), pr = t < g0 ? sm(S(22), g0, t) : 1 - 0.6 * tp, cam = camK(t, [[S(22), 480, 900, 1.6], [g0, 420, 880, 1.9], [S(23), 520, 940, 1.4]]);
  ctx.save(); zoomP(ctx, cam, sh); rejilla(ctx); ollaRX(ctx, t, 540, 1330, 1.35, { vapor: 1, presion: 0.6 + 0.4 * pr, rojo: t < g0, tapado: 1, tapon: tp, marcaTapon: t < g0 && t > S(22) + 0.3 }); ctx.restore();
  fogonazo(ctx, t, [[g0, 0.7]]); P.tag(ctx, 'TAPÓN DE SEGURIDAD', 470, 520, t, Tk.salta - 0.5, S(23), { mono: true, col: GR, px: 54 });
 }, sfx(k) { k.play('riser', S(22), { dur: Tk.salta - S(22), gain: 0.3, minor: true }); k.play('pop', Tk.salta, { f: 220, gain: 0.8 }); k.play('thud', Tk.salta, { f: 70, gain: 0.6 }); k.noise(Tk.salta, { dur: 1.4, filter: 'highpass', f: 2500, gain: 0.35, a: 0.005 }); k.tone(Tk.salta, { f: [[0, 3200], [1, 2600]], type: 'sawtooth', dur: 1.0, gain: 0.04, filter: 'bandpass', f2: 3000, a: 0.01 }); FX.etiqueta(k, Tk.salta - 0.5); FX.correcto(k, Tk.salta + 0.6); } });

 // ---------- 23 · y una tapa que no abre con presión adentro → primer plano del mango: el seguro rojo arriba, la tapa no gira; candado ----------
 B.push({ t0: S(23), t1: S(24), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  const cam = camK(t, [[S(23), 400, 780, 1.6], [S(24), 350, 740, 1.9]]), tr = sm(Tk.abre - 0.5, Tk.abre, t), rebote = t > Tk.abre ? 0.05 * Math.sin((t - Tk.abre) * 30) * Math.exp(-(t - Tk.abre) * 5) : 0.012 * tr;
  ctx.save(); zoomP(ctx, cam); ctxGiro(ctx, 640, 1000, rebote); planoCocina(ctx, t, { x: 640, s: 1.2, olla: { pin: 1, vapor: 0.4 } }); ctx.restore();
  const a = sm(Tk.abre - 0.2, Tk.abre + 0.1, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(11,22,34,0.75)'; ctx.beginPath(); ctx.arc(760, 1060, 120, 0, TAU); ctx.fill(); ctx.restore(); P.icon(ctx, 'candado', 760, 1060, 150 * E.out(a), { mode: 'flat', col: RD, col2: '#fff' }); }
  P.tag(ctx, 'NO ABRE CON PRESIÓN', 470, 520, t, Tk.abre - 0.6, S(24), { mono: true, col: RD, px: 54 });
 }, sfx(k) { k.play('whoosh', S(23), { dur: 0.4, top: 1400, gain: 0.25, minor: true }); k.noise(Tk.abre - 0.5, { dur: 0.5, color: 'brown', filter: 'bandpass', f: 250, q: 2, gain: 0.15, a: 0.1 }); k.play('thud', Tk.abre, { f: 110, gain: 0.5 }); k.play('tick', Tk.abre + 0.02, { f: 1800, gain: 0.3 }); FX.etiqueta(k, Tk.abre - 0.6); } });

 // ---------- 24 · Ese pito que tanto nos asustaba… → la cocina de la abuela con luz dorada: el niño salta del susto ----------
 B.push({ t0: S(24), t1: S(25), in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  const cam = camK(t, [[S(24), 540, 880, 1.0], [S(25), 520, 880, 1.07]]), j = Math.max(0, Math.sin((t - Tk.asustaba + 0.3) * 8)) * (t > Tk.asustaba - 0.3 && t < Tk.asustaba + 0.7 ? 1 : 0);
  ctx.save(); zoomP(ctx, cam); planoCocina(ctx, t, { x: 740, s: 1.1, olla: { baila: 1, vapor: 1, tiembla: 0.6, espejo: true }, gente: (c) => { persona(c, t, 150, EY + 30, 0.95, { abuela: true, ropa: '#8e4f8a', piel: '#c98d63', cuchara: true, sonrie: 0.6 }); persona(c, t, 340, EY + 120, 0.72, { miedo: t > Tk.asustaba - 0.4 ? 1 : 0.2, salto: j, ropa: '#3a7a4a' }); } }); ctx.restore();
  ctx.fillStyle = 'rgba(255,190,90,0.16)'; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 200, 500, 700, '255,200,120', 0.25);
 }, sfx(k) { k.tone(S(24), { f: [[0, 2700], [2, 2900]], type: 'sawtooth', dur: S(25) - S(24), gain: 0.025, filter: 'bandpass', f2: 2800, a: 0.2 }); k.play('pop', Tk.asustaba - 0.3, { f: 400, gain: 0.3, minor: true }); for (let x = S(24); x < S(25); x += 0.12) k.play('tick', x, { f: 900, gain: 0.08, minor: true }); } });

 // ---------- 25 · era la olla diciendo: → el niño y la abuela sonríen (acercamiento a sus caras) ----------
 B.push({ t0: S(25), t1: S(26), in: { type: 'zoom', d: 0.35, x: 330, y: 700 }, draw(ctx, t) {
  const cam = camK(t, [[S(25), 270, 830, 1.5], [S(26), 280, 810, 1.62]]); ctx.save(); zoomP(ctx, cam); planoCocina(ctx, t, { x: 740, s: 1.1, olla: { baila: 0.5, vapor: 0.7, espejo: true }, gente: (c) => { persona(c, t, 150, EY + 30, 0.95, { abuela: true, ropa: '#8e4f8a', piel: '#c98d63', cuchara: true, sonrie: 1 }); persona(c, t, 340, EY + 120, 0.72, { sonrie: 1, ropa: '#3a7a4a', pecho: true }); } }); ctx.restore();
  ctx.fillStyle = 'rgba(255,190,90,0.16)'; ctx.fillRect(0, 0, W, HH);
 }, sfx(k) { k.tone(S(25) + 0.1, { f: 'E5', dur: 0.9, gain: 0.05, verb: 0.5 }); k.tone(S(25) + 0.2, { f: 'G5', dur: 0.9, gain: 0.04, verb: 0.5 }); } });

 // ---------- 26 · todo bajo control → PRIMER PLANO FINAL: la válvula suelta vapor tranquila, la comida lista ----------
 B.push({ t0: S(26), t1: S(27), in: { type: 'zoom', d: 0.4, x: 540, y: 900 }, draw(ctx, t) {
  const cam = camK(t, [[S(26), 600, 720, 1.6], [S(27), 610, 700, 1.75]]); ctx.save(); zoomP(ctx, cam); planoCocina(ctx, t, { x: 640, s: 1.2, llama: 0.6, olla: { baila: 0.25, vapor: 0.6, vrate: 0.7 } }); ctx.restore();
  ctx.fillStyle = 'rgba(255,190,90,0.12)'; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 760, 600, '255,220,150', 0.2);
  P.tag(ctx, 'TODO BAJO CONTROL', 470, 1390, t, Tk.control - 0.6, S(27), { mono: true, col: GR, px: 58 });
 }, sfx(k) { k.noise(S(26), { dur: S(27) - S(26), filter: 'highpass', f: 3500, gain: 0.08, a: 0.3 }); FX.correcto(k, Tk.control); FX.etiqueta(k, Tk.control - 0.6); } });

 // ---------- 27 · CIERRE ----------
 B.push({ t0: S(27), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#c8553d'); g.addColorStop(1, '#5a2a1c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  P.ctaShare(ctx, t, S(27) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { cocinaFondo(cc, t, { ey: 1300 }); cocinaMueble(cc, t, { ey: 1300 }); hornilla(cc, t, 600, 1300, 460, 1); olla(cc, t, 600, 1254, 1.4, { baila: 1, vapor: 1 }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(27) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'cartoon', capBorde: true, marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: [],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 300, gain: 0.02, a: 0.05, hold: DURATION - 2.5 }); },
  music(k) { MUS.piano(k, 0, DURATION, { bpm: 92, gain: 0.5, strings: 0.6, chords: [['A2', 'E3', 'A3', 'C4'], ['F2', 'C3', 'F3', 'A3'], ['C3', 'G3', 'C4', 'E4'], ['G2', 'D3', 'G3', 'B3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
