// =====================================================================================================
// episodio.js — ¿Cómo funcionaban por dentro los televisores de antes? · PLANTILLA ASOMBROTECA v1.39 · «cartoon» (sala años 80-90)
// UN solo vídeo con UN gancho (v1.34): el A («Estás frente al televisor de tu abuela… y te está disparando»), con el golpecito
// de la abuela (de la B) y la imagen que se desarma en un solo puntito que barre (de la C). Voz: ElevenLabs Eleven v4, Dan,
// UNA toma (1.023 caracteres, 65,8 s) + [QUITAR] «o sea,» y «Eso sí:» + [PAUSA 0.4] antes del vacío → 64,95 s, voz intacta.
// Metáfora sostenida: PINTAR UNA PARED CON UNA MANGUERA, muy rápido, línea por línea (la pintura aparece donde cae el agua).
// Dirección visual: el tubo en corte / «rayos X» es el centro (cañón al fondo, chorro brillante, bobinas de cobre que lo desvían,
// barrido línea por línea en cámara lenta y luego rápido, fósforo que se enciende); un plano por idea con cámara que se mueve;
// golpes sincronizados con la palabra fuerte; la abuela y el niño con vida (antena, golpecito, reacciones); final grande.
// Televisor, sala y personas dibujados, genéricos, sin marcas ni programas reales (en pantalla: estática o un paisaje genérico).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, DURATION, txt } = K;
 const S = (i) => A.segments[i].s;
 const YE = '#ffd23f', RD = '#ff4d5e', GR = '#22d27a', CY = '#8fd8ff', NAR = '#ff9f43', AZ = '#3ea8ff', COB = '#d8843a';
 const PORTADA = typeof window !== 'undefined' && !!window.__SIN_SUBTITULOS;
 const Tk = {
  disparando: wt(1, 'disparando.'), funcionaba: wt(2, 'funcionaba?'), sorprender: wt(3, 'sorprender.'), canon: wt(4, 'cañón'), dispara: wt(4, 'dispara'), pantalla: wt(4, 'pantalla…'), ti: wt(5, 'ti.'),
  manguera: wt(6, 'manguera…'), linea: wt(7, 'línea'), imanes: wt(8, 'imanes'), lado: wt(8, 'lado'), arriba: wt(8, 'arriba'), quinientas: wt(9, 'quinientas'), segundo: wt(9, 'segundo…'), imagen: wt(10, 'imagen.'),
  fosforo: wt(11, 'fósforo'), pega: wt(11, 'pega…'), agua: wt(12, 'agua.'), tres: wt(13, 'tres'), rojo: wt(14, 'rojo,'), verde: wt(14, 'verde'), azul: wt(14, 'azul.'), pesados: wt(15, 'pesados'), profundos: wt(15, 'profundos?'),
  vacio: wt(16, 'vacío.'), aprieta: wt(17, 'aprieta'), gruesisimo: wt(18, 'gruesísimo.'), esquinas: wt(19, 'esquinas.'), puntito: wt(20, 'puntito'), velocidad: wt(20, 'velocidad.'), abras: wt(21, 'abras;'), desconectado: wt(22, 'desconectado'), peligrosa: wt(22, 'peligrosa.'),
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


 // ---------- SALA (fondo: papel tapiz de flores, ventana con cortinas que se mueven, rayo de sol con polvo; piso de baldosa) ----------
 const salaFondo = (ctx, t, o = {}) => { const fy = o.fy ?? 1440;
  ctx.fillStyle = '#f0d9ad'; ctx.fillRect(-900, -900, W + 1800, fy + 900);
  for (let yy = -900, r = 0; yy < fy - 200; yy += 96, r++) for (let xx = -900 + (r % 2) * 48; xx < W + 900; xx += 96) { ctx.fillStyle = 'rgba(190,80,70,0.35)'; for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; ctx.beginPath(); ctx.ellipse(xx + Math.cos(a) * 9, yy + Math.sin(a) * 9, 8, 5, a, 0, TAU); ctx.fill(); } ctx.fillStyle = 'rgba(90,130,80,0.35)'; ctx.beginPath(); ctx.ellipse(xx + 18, yy + 16, 9, 4, 0.6, 0, TAU); ctx.fill(); }
  // ventana con cortinas
  const vx = o.vx ?? 640, vy = fy - 1050; ctx.fillStyle = '#7a4a2a'; ctx.fillRect(vx - 16, vy - 16, 392, 432); const gs = ctx.createLinearGradient(0, vy, 0, vy + 400); gs.addColorStop(0, '#ffb070'); gs.addColorStop(1, '#ffe4b0'); ctx.fillStyle = gs; ctx.fillRect(vx, vy, 360, 400);
  ctx.fillStyle = '#7a4a2a'; ctx.fillRect(vx + 172, vy, 16, 400); ctx.fillRect(vx, vy + 192, 360, 16);
  for (const k of [-1, 1]) { const cx = k < 0 ? vx - 30 : vx + 390, sw = 18 * Math.sin(t * 1.3 + k); ctx.fillStyle = '#b8452f'; ctx.beginPath(); ctx.moveTo(cx - 70, vy - 40); ctx.lineTo(cx + 70, vy - 40); for (let i = 0; i <= 10; i++) { const u = i / 10; ctx.lineTo(cx + 70 * (k < 0 ? 0.6 : 1) + sw * u + 10 * Math.sin(u * 9 + t * 2), vy - 40 + u * 520); } ctx.lineTo(cx - 70 + sw, vy + 480); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(80,20,10,0.35)'; ctx.lineWidth = 4; for (let j = -2; j <= 2; j++) { ctx.beginPath(); ctx.moveTo(cx + j * 24, vy - 30); ctx.lineTo(cx + j * 24 + sw * 0.8, vy + 470); ctx.stroke(); } }
  ctx.fillStyle = '#5a3418'; ctx.fillRect(vx - 120, vy - 50, 600, 14);
  // cuadro genérico y repisa
  ctx.fillStyle = '#8a5428'; ctx.fillRect(60, fy - 980, 220, 170); ctx.fillStyle = '#7fb0c8'; ctx.fillRect(76, fy - 964, 188, 138); ctx.fillStyle = '#5f8a4e'; ctx.beginPath(); ctx.moveTo(76, fy - 826); ctx.lineTo(150, fy - 900); ctx.lineTo(210, fy - 860); ctx.lineTo(264, fy - 890); ctx.lineTo(264, fy - 826); ctx.closePath(); ctx.fill();
  // zócalo de madera
  ctx.fillStyle = '#9a6a3c'; ctx.fillRect(-900, fy - 200, W + 1800, 200); ctx.fillStyle = '#7a4f2a'; ctx.fillRect(-900, fy - 210, W + 1800, 14); ctx.strokeStyle = 'rgba(60,35,15,0.35)'; ctx.lineWidth = 3; for (let x = -900; x < W + 900; x += 120) { ctx.beginPath(); ctx.moveTo(x, fy - 196); ctx.lineTo(x, fy); ctx.stroke(); }
  // piso
  ctx.fillStyle = '#b5603f'; ctx.fillRect(-900, fy, W + 1800, 1400); ctx.strokeStyle = '#8f4a2f'; ctx.lineWidth = 5; for (let x = -900; x < W + 900; x += 160) { ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x + (x - 540) * 0.6, fy + 500); ctx.stroke(); } for (const yy of [fy + 70, fy + 170, fy + 300]) { ctx.beginPath(); ctx.moveTo(-900, yy); ctx.lineTo(W + 900, yy); ctx.stroke(); }
  // rayo de sol con polvo
  ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(vx + 360, vy); ctx.lineTo(vx - 260, fy + 200); ctx.lineTo(vx - 700, fy + 200); ctx.closePath(); ctx.fill(); ctx.restore();
  const R = H.rng(3); for (let i = 0; i < 40; i++) { const u = (R() + t * 0.03 * (0.5 + R())) % 1, v = R(), px = lerp(vx + 360 * v, vx - 700 + 440 * v, u) + 12 * Math.sin(t * 0.8 + i), py = lerp(vy, fy + 200, u); ctx.fillStyle = `rgba(255,250,220,${0.5 + 0.4 * Math.sin(t * 3 + i)})`; ctx.beginPath(); ctx.arc(px, py, 2 + R() * 3, 0, TAU); ctx.fill(); } };

 // ---------- PANTALLA: imagen genérica, estática y BARRIDO (la imagen «pintada» por un solo puntito) ----------
 const imagen = (ctx, x, y, w, h) => { const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#3a6fd8'); g.addColorStop(0.6, '#f7a35c'); g.addColorStop(1, '#f7d27a'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#ffe28a'; ctx.beginPath(); ctx.arc(x + w * 0.7, y + h * 0.48, h * 0.14, 0, TAU); ctx.fill();
  ctx.fillStyle = '#3d6b4a'; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + h * 0.62); ctx.lineTo(x + w * 0.25, y + h * 0.42); ctx.lineTo(x + w * 0.5, y + h * 0.64); ctx.lineTo(x + w * 0.78, y + h * 0.5); ctx.lineTo(x + w, y + h * 0.66); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2b4f37'; ctx.fillRect(x, y + h * 0.82, w, h * 0.18); ctx.fillStyle = '#6fb6e8'; ctx.beginPath(); ctx.moveTo(x + w * 0.38, y + h); ctx.quadraticCurveTo(x + w * 0.5, y + h * 0.86, x + w * 0.62, y + h * 0.82); ctx.lineTo(x + w * 0.67, y + h * 0.82); ctx.quadraticCurveTo(x + w * 0.6, y + h * 0.9, x + w * 0.56, y + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c8553d'; ctx.fillRect(x + w * 0.12, y + h * 0.68, w * 0.14, h * 0.12); ctx.fillStyle = '#7a2f1e'; ctx.beginPath(); ctx.moveTo(x + w * 0.1, y + h * 0.68); ctx.lineTo(x + w * 0.19, y + h * 0.6); ctx.lineTo(x + w * 0.28, y + h * 0.68); ctx.closePath(); ctx.fill(); };
 const estatica = (ctx, x, y, w, h, t) => { const f = Math.floor(t * 24), R = H.rng(f * 13 + 7); ctx.fillStyle = '#6f7377'; ctx.fillRect(x, y, w, h); for (let i = 0; i < 240; i++) { const v = Math.floor(R() * 255); ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fillRect(x + R() * w, y + R() * h, (6 + R() * 26) * w / 420, (3 + R() * 5) * h / 330); } for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(x, y + ((t * 300 + i * 137) % h), w, 10 * h / 330); } };
 const barrido = (ctx, x, y, w, h, p, nL, o = {}) => { const lh = h / nL, cur = cl(p) * nL, li = Math.floor(cur), fx = cur - li;
  ctx.fillStyle = o.bg || '#0a0d14'; ctx.fillRect(x, y, w, h); ctx.fillStyle = o.bg ? 'rgba(120,100,80,0.35)' : 'rgba(120,170,220,0.22)'; for (let k = 0; k < nL; k++) ctx.fillRect(x, y + (k + 0.5) * lh - 2, w, 4);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, Math.min(li, nL) * lh); if (li < nL) ctx.rect(x, y + li * lh, w * fx, lh); ctx.clip(); imagen(ctx, x, y, w, h);
  if (o.lineas) { ctx.fillStyle = 'rgba(0,0,0,0.4)'; for (let k = 1; k < nL; k++) ctx.fillRect(x, y + k * lh - 1.5, w, 3); } ctx.restore();
  if (li < nL && o.punto !== false) { const px = x + w * fx, py = y + (li + 0.5) * lh, r = o.r || Math.max(5, Math.min(18, lh * 0.4)); P.glow(ctx, px, py, r * 7, '200,240,255', 0.95); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill(); }
  return li < nL ? [x + w * fx, y + (li + 0.5) * lh] : null; };

 // ---------- TELEVISOR de mueble (de frente; y = piso). Centro de la pantalla en (x − 70·s, y − 325·s) ----------
 const TVW = 640, TVH = 470, SCX = -70, SCY = -325, SCW = 420, SCH = 330;
 const madera = (ctx, w) => { const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, '#5a3418'); g.addColorStop(0.5, '#93592a'); g.addColorStop(1, '#5a3418'); return g; };
 const televisor = (ctx, t, x, y, s, o = {}) => { const tb = o.tiembla || 0; ctx.save(); ctx.translate(x + tb * 5 * Math.sin(t * 70), y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 4, TVW * 0.55, 16, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#4a2a12'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * (TVW / 2 - 70), -70); ctx.lineTo(k * (TVW / 2 - 40), 0); ctx.lineTo(k * (TVW / 2 - 58), 0); ctx.lineTo(k * (TVW / 2 - 92), -70); ctx.closePath(); ctx.fill(); }
  const top = -70 - TVH; ctx.fillStyle = madera(ctx, TVW); ctx.beginPath(); ctx.roundRect(-TVW / 2, top, TVW, TVH, 22); ctx.fill(); ctx.strokeStyle = '#3a200c'; ctx.lineWidth = 6; ctx.stroke();
  ctx.strokeStyle = 'rgba(40,20,5,0.22)'; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-TVW / 2 + 10, top + 40 + i * 70); ctx.quadraticCurveTo(0, top + 30 + i * 70 + 10 * Math.sin(i), TVW / 2 - 10, top + 44 + i * 70); ctx.stroke(); }
  const sx = SCX - SCW / 2, sy = SCY - SCH / 2; ctx.fillStyle = '#1b1b1e'; ctx.beginPath(); ctx.roundRect(sx - 16, sy - 16, SCW + 32, SCH + 32, 40); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, SCW, SCH, 46); ctx.clip(); const m = o.pantalla || 'apagada';
  if (m === 'estatica') estatica(ctx, sx, sy, SCW, SCH, t); else if (m === 'imagen') imagen(ctx, sx, sy, SCW, SCH); else if (m === 'barrido') barrido(ctx, sx, sy, SCW, SCH, o.p || 0, o.nL || 12, { lineas: o.lineas, r: o.rPunto }); else if (typeof m === 'function') m(ctx, sx, sy, SCW, SCH); else { ctx.fillStyle = '#2a3330'; ctx.fillRect(sx, sy, SCW, SCH); }
  if (o.mezcla) { ctx.globalAlpha = o.mezcla; estatica(ctx, sx, sy, SCW, SCH, t); ctx.globalAlpha = 1; }
  const v = ctx.createRadialGradient(SCX, SCY, SCH * 0.3, SCX, SCY, SCW * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = v; ctx.fillRect(sx, sy, SCW, SCH);
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.ellipse(sx + SCW * 0.3, sy + SCH * 0.22, SCW * 0.32, SCH * 0.12, -0.3, 0, TAU); ctx.fill(); ctx.restore();
  const px = sx + SCW + 44; ctx.fillStyle = '#2b1a0c'; ctx.beginPath(); ctx.roundRect(px - 10, sy - 10, 120, SCH + 20, 16); ctx.fill();
  for (let i = 0; i < 2; i++) { const ky = sy + 52 + i * 92; ctx.fillStyle = '#d9d4c8'; ctx.beginPath(); ctx.arc(px + 50, ky, 30, 0, TAU); ctx.fill(); ctx.save(); ctx.translate(px + 50, ky); ctx.rotate((o.perilla || 0) * (i ? 1 : -1) + i * 0.8); ctx.fillStyle = '#333'; ctx.fillRect(-4, -28, 8, 22); ctx.restore(); }
  ctx.fillStyle = '#4a3a2a'; for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) { ctx.beginPath(); ctx.arc(px + 20 + c * 20, sy + 238 + r * 15, 4, 0, TAU); ctx.fill(); }
  if (o.encendido !== false && m !== 'apagada') { ctx.fillStyle = '#ff5040'; ctx.beginPath(); ctx.arc(px + 50, sy + SCH - 8, 6, 0, TAU); ctx.fill(); }
  // carpeta tejida y antena de conejo
  ctx.fillStyle = '#fbf6ec'; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI, r = 150 + (i % 2) * 14; ctx.lineTo(40 + Math.cos(a) * r, top + 4 + Math.sin(a) * r * 0.16); } ctx.closePath(); ctx.fill();
  const a = o.antena || 0; ctx.fillStyle = '#2a2a2e'; ctx.beginPath(); ctx.ellipse(40, top - 8, 52, 18, 0, Math.PI, TAU); ctx.fill();
  ctx.strokeStyle = '#c9ced8'; ctx.lineWidth = 7; ctx.lineCap = 'round'; for (const k of [-1, 1]) { const ang = -Math.PI / 2 + k * ((o.antenaAng ?? 0.45) + 0.12 * a * k), L = o.antenaL ?? 250; ctx.beginPath(); ctx.moveTo(40, top - 18); ctx.lineTo(40 + Math.cos(ang) * L, top - 18 + Math.sin(ang) * L); ctx.stroke(); ctx.fillStyle = '#c9ced8'; ctx.beginPath(); ctx.arc(40 + Math.cos(ang) * L, top - 18 + Math.sin(ang) * L, 9, 0, TAU); ctx.fill(); }
  ctx.restore();
  if (o.brillo) P.glow(ctx, x + s * SCX, y + s * SCY, 520 * s, o.brilloCol || '170,200,255', o.brillo); };
 // punto de la pantalla en coordenadas del mundo
 const tvPunto = (x, y, s, u = 0, v = 0) => [x + s * (SCX + u * SCW / 2), y + s * (SCY + v * SCH / 2)];

 // ---------- TUBO EN CORTE («rayos X»): cañón al fondo (izquierda), bobinas de cobre, chorro brillante, fósforo en la pantalla (derecha) ----------
 const tuboPath = (ctx) => { ctx.beginPath(); ctx.moveTo(-480, -46); ctx.lineTo(-200, -46); ctx.bezierCurveTo(-60, -60, 180, -300, 330, -330); ctx.quadraticCurveTo(372, 0, 330, 330); ctx.bezierCurveTo(180, 300, -60, 60, -200, 46); ctx.lineTo(-480, 46); ctx.quadraticCurveTo(-500, 0, -480, -46); ctx.closePath(); };
 const pantY = (v) => v * 318, pantX = (v) => 336 + 18 * (1 - v * v);
 const tuboRX = (ctx, t, x, y, s, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // interior al vacío
  ctx.fillStyle = '#0e2448'; tuboPath(ctx); ctx.fill();
  // aire dentro (antes de hacer el vacío)
  const sa = o.aireSale; if (sa != null) { const R = H.rng(17); for (let i = 0; i < 90; i++) { const bx = -470 + R() * 820, by = (R() - 0.5) * 640, k = cl(sa * 1.8 - (bx + 470) / 820 * 0.8), ex = -560 - 140 * R(), ey = (R() - 0.5) * 120, px = lerp(bx, -470, cl(k * 1.6)), py = lerp(by, 0, cl(k * 1.6)), qx = k > 0.62 ? lerp(-470, ex, (k - 0.62) / 0.38) : px, qy = k > 0.62 ? lerp(0, ey, (k - 0.62) / 0.38) : py; if (k >= 1) continue; ctx.fillStyle = `rgba(200,225,255,${0.85 * (1 - Math.max(0, k - 0.7) / 0.3)})`; ctx.beginPath(); ctx.arc(qx + 8 * Math.sin(t * 3 + i), qy + 8 * Math.cos(t * 2.6 + i), 7, 0, TAU); ctx.fill(); } }
  const ai = o.aireDentro || 0; if (ai > 0) { ctx.save(); tuboPath(ctx); ctx.clip(); const R = H.rng(17); for (let i = 0; i < 90; i++) { const bx = -470 + R() * 820, by = (R() - 0.5) * 640, dx = 14 * Math.sin(t * 3 + i), dy = 14 * Math.cos(t * 2.6 + i * 1.3); ctx.fillStyle = `rgba(200,220,255,${0.75 * ai})`; ctx.beginPath(); ctx.arc(bx + dx - (1 - ai) * 300, by + dy, 6, 0, TAU); ctx.fill(); } ctx.restore(); }
  // vidrio (grueso)
  const gr = o.grosor || 0; ctx.strokeStyle = gr > 0 ? `rgb(${Math.round(lerp(190, 255, gr))},${Math.round(lerp(225, 210, gr))},${Math.round(lerp(245, 63, gr))})` : '#bfe0f5'; ctx.lineWidth = 14 + 18 * gr; tuboPath(ctx); ctx.stroke();
  if (o.grieta) { ctx.save(); ctx.globalAlpha = o.grieta; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.lineCap = 'round'; const R = H.rng(41); for (const [cx, cy] of [[340, -120], [250, 230], [120, -230]]) for (let j = 0; j < 5; j++) { let a = R() * TAU, px = cx, py = cy; ctx.beginPath(); ctx.moveTo(px, py); for (let q = 0; q < 4; q++) { px += Math.cos(a) * 34; py += Math.sin(a) * 34; a += (R() - 0.5) * 1.3; ctx.lineTo(px, py); } ctx.stroke(); } ctx.restore(); }
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(334, -300); ctx.quadraticCurveTo(366, 0, 334, 300); ctx.stroke();
  // fósforo en la cara interior de la pantalla
  ctx.strokeStyle = 'rgba(120,255,170,0.35)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(322, -318); ctx.quadraticCurveTo(354, 0, 322, 318); ctx.stroke();
  // cañón(es)
  const tres = o.tres, gunsY = tres ? [-20, 0, 20] : [0], gunCol = tres ? ['#ff5a5a', '#4cff7a', '#5aa0ff'] : ['#dfe8f2'];
  ctx.fillStyle = '#7d8896'; ctx.fillRect(-470, -30, 150, 60); for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#9aa6b5' : '#5f6a78'; ctx.fillRect(-460 + i * 34, -36, 22, 72); }
  if (o.marcaCanon) { ctx.strokeStyle = YE; ctx.lineWidth = 6; ctx.strokeRect(-484, -54, 182, 108); }
  for (let k = 0; k < 4; k++) { ctx.fillStyle = '#c9a24a'; ctx.fillRect(-500, -24 + k * 16, 26, 6); }
  // bobinas de cobre (deflexión)
  const bo = o.bobinas || 0; for (const sg of [-1, 1]) { ctx.save(); ctx.translate(-150, sg * 78); if (bo > 0) P.glow(ctx, 0, 0, 120, '255,170,80', 0.45 * bo); ctx.fillStyle = '#5a3018'; ctx.beginPath(); ctx.roundRect(-70, -26, 140, 52, 12); ctx.fill(); ctx.strokeStyle = COB; ctx.lineWidth = 6; for (let i = -60; i <= 60; i += 12) { ctx.beginPath(); ctx.moveTo(i, -24); ctx.lineTo(i + 6, 24); ctx.stroke(); } ctx.restore(); }
  if (bo > 0) { ctx.save(); ctx.globalAlpha = 0.5 * bo; ctx.strokeStyle = '#ffb35c'; ctx.lineWidth = 3; ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t * 60; for (const r of [70, 100, 130]) { ctx.beginPath(); ctx.ellipse(-150, 0, r * 0.7, r, 0, 0, TAU); ctx.stroke(); } ctx.setLineDash([]); ctx.restore(); }
  // conos hasta las esquinas
  if (o.cono) { ctx.save(); ctx.globalAlpha = o.cono; ctx.strokeStyle = YE; ctx.lineWidth = 5; ctx.setLineDash([18, 12]); for (const v of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(pantX(v), pantY(v)); ctx.stroke(); } ctx.setLineDash([]); ctx.restore(); }
  // chorro(s)
  const ha = o.haz ?? 0; if (ha > 0) { const v = o.v ?? 0, hitX = pantX(v), hitY = pantY(v), L = o.largo ?? 1;
   gunsY.forEach((gy, gi) => { const pts = [[-320, gy], [-150, gy * 0.4], [hitX, hitY + gy * 0.15]]; const along = (u) => { if (u < 0.3) { const q = u / 0.3; return [lerp(pts[0][0], pts[1][0], q), lerp(pts[0][1], pts[1][1], q)]; } const q = (u - 0.3) / 0.7; return [lerp(pts[1][0], pts[2][0], q), lerp(pts[1][1], pts[2][1], q)]; };
    const end = along(L); ctx.save(); ctx.globalAlpha = ha; ctx.lineCap = 'round'; const col = gunCol[gi]; for (const [lw, a] of [[30, 0.12], [16, 0.25], [6, 0.9]]) { ctx.strokeStyle = a > 0.5 ? '#ffffff' : col; ctx.globalAlpha = ha * a; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); if (L > 0.3) { ctx.lineTo(pts[1][0], pts[1][1]); } ctx.lineTo(end[0], end[1]); ctx.stroke(); }
    ctx.globalAlpha = ha; for (let i = 0; i < 10; i++) { const u = ((t * 2.2 + i / 10) % 1) * L, q = along(u); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(q[0], q[1], 5, 0, TAU); ctx.fill(); } ctx.restore(); });
   if (L >= 1) { P.glow(ctx, hitX, hitY, 110, o.tres ? '255,255,255' : '130,255,180', ha); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hitX, hitY, 9, 0, TAU); ctx.fill(); } }
  // aire empujando desde afuera
  const ap = o.aire || 0; if (ap > 0) { const Lr = 30 + 70 * ap; ctx.save(); ctx.globalAlpha = Math.min(1, ap * 2); for (const [ex, ey, nx, ny] of [[60, -205, 0.45, 1], [200, -300, 0.25, 1], [60, 205, 0.45, -1], [200, 300, 0.25, -1], [370, -180, -1, 0], [372, 0, -1, 0], [370, 180, -1, 0], [-330, -46, 0, 1], [-330, 46, 0, -1]]) { const n = Math.hypot(nx, ny), ux = nx / n, uy = ny / n, ox = ex - ux * (Lr + 30), oy = ey - uy * (Lr + 30); flecha(ctx, ox, oy, ex - ux * 18, ey - uy * 18, AZ, 12); } ctx.restore(); }
  ctx.restore(); };
 const tuboPunto = (x, y, s, px, py) => [x + s * px, y + s * py];
 // tubo centrado en (540, 960) y girado ang (0 = cañón a la izquierda; −π/2 = pantalla arriba)
 // en diagonal el embudo se va hacia la pantalla: se recentra (abajo-izquierda) y se reduce un poco para que quepa entero
 const diag = (ang) => Math.abs(Math.sin(2 * ang));
 const tuboCentro = (ctx, t, s, ang, o) => { const k = diag(ang), se = s * (1 - 0.2 * k); ctx.save(); ctx.translate(540 - 90 * k, 960 + 230 * k); ctx.rotate(ang); tuboRX(ctx, t, 64 * se, 0, se, o); ctx.restore(); };
 const rotP = (s, ang, px, py) => { const k = diag(ang), se = s * (1 - 0.2 * k), x = (64 + px) * se, y = py * se; return [540 - 90 * k + x * Math.cos(ang) - y * Math.sin(ang), 960 + 230 * k + x * Math.sin(ang) + y * Math.cos(ang)]; };

 // ---------- TELEVISOR DE LADO (lo profundo), con el tubo dentro si rx > 0 ----------
 const tvLado = (ctx, t, x, y, s, o = {}) => { const D = 600, Hh = TVH; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 4, D * 0.6, 16, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#4a2a12'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * (D / 2 - 60), -70); ctx.lineTo(k * (D / 2 - 34), 0); ctx.lineTo(k * (D / 2 - 52), 0); ctx.lineTo(k * (D / 2 - 82), -70); ctx.closePath(); ctx.fill(); }
  const top = -70 - Hh, rx = o.rx || 0;
  ctx.fillStyle = madera(ctx, D); ctx.beginPath(); ctx.roundRect(-D / 2, top, D, Hh, 20); ctx.fill(); ctx.strokeStyle = '#3a200c'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#1b1b1e'; ctx.fillRect(D / 2 - 26, top + 30, 26, Hh - 60); ctx.fillStyle = '#2a3330'; ctx.beginPath(); ctx.moveTo(D / 2, top + 50); ctx.quadraticCurveTo(D / 2 + 30, top + Hh / 2, D / 2, top + Hh - 50); ctx.closePath(); ctx.fill();
  if (rx > 0) { ctx.save(); ctx.beginPath(); ctx.roundRect(-D / 2 + 14, top + 14, D - 28, Hh - 28, 14); ctx.clip(); ctx.globalAlpha = rx; ctx.fillStyle = '#0b1d3a'; ctx.fillRect(-D / 2, top, D, Hh); ctx.restore(); ctx.save(); ctx.globalAlpha = rx; tuboRX(ctx, t, 0, top + Hh / 2, 0.6, Object.assign({}, o.tubo || {})); ctx.restore(); }
  if (o.profundo) { ctx.save(); ctx.globalAlpha = o.profundo; ctx.strokeStyle = YE; ctx.fillStyle = YE; ctx.lineWidth = 8; const yy = top - 60; ctx.beginPath(); ctx.moveTo(-D / 2 + 30, yy); ctx.lineTo(D / 2 - 30, yy); ctx.stroke(); flecha(ctx, 0, yy, -D / 2, yy, YE, 8); flecha(ctx, 0, yy, D / 2, yy, YE, 8); ctx.restore(); }
  const a = o.antena || 0; ctx.strokeStyle = '#c9ced8'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.fillStyle = '#2a2a2e'; ctx.beginPath(); ctx.ellipse(0, top - 8, 52, 18, 0, Math.PI, TAU); ctx.fill(); for (const k of [-1, 1]) { const ang = -Math.PI / 2 + k * ((o.antenaAng ?? 0.3) + 0.08 * a * k), L = o.antenaL ?? 240; ctx.beginPath(); ctx.moveTo(0, top - 18); ctx.lineTo(Math.cos(ang) * L, top - 18 + Math.sin(ang) * L); ctx.stroke(); }
  ctx.restore(); };

 // ---------- TELEVISOR POR DETRÁS (tapa con rejillas y tornillos; sin mostrar cómo se abre) ----------
 const tvAtras = (ctx, t, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 4, TVW * 0.55, 16, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#4a2a12'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * (TVW / 2 - 70), -70); ctx.lineTo(k * (TVW / 2 - 40), 0); ctx.lineTo(k * (TVW / 2 - 58), 0); ctx.lineTo(k * (TVW / 2 - 92), -70); ctx.closePath(); ctx.fill(); }
  const top = -70 - TVH; ctx.fillStyle = madera(ctx, TVW); ctx.beginPath(); ctx.roundRect(-TVW / 2, top, TVW, TVH, 22); ctx.fill();
  ctx.fillStyle = '#3a2a1e'; ctx.beginPath(); ctx.roundRect(-TVW / 2 + 40, top + 40, TVW - 80, TVH - 80, 16); ctx.fill(); ctx.fillStyle = '#1e1610'; for (let r = 0; r < 9; r++) for (let c = 0; c < 6; c++) ctx.fillRect(-TVW / 2 + 80 + c * 84, top + 70 + r * 40, 60, 12);
  ctx.fillStyle = '#c9ced8'; for (const [sx, sy] of [[-TVW / 2 + 60, top + 60], [TVW / 2 - 60, top + 60], [-TVW / 2 + 60, top + TVH - 60], [TVW / 2 - 60, top + TVH - 60]]) { ctx.beginPath(); ctx.arc(sx, sy, 10, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = '#222'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(TVW / 2 - 120, top + TVH - 40); ctx.quadraticCurveTo(TVW / 2, 40, TVW / 2 + 120, 0); ctx.stroke(); ctx.fillStyle = '#222'; ctx.fillRect(TVW / 2 + 110, -24, 50, 30); ctx.fillStyle = '#c9a24a'; ctx.fillRect(TVW / 2 + 158, -18, 22, 6); ctx.fillRect(TVW / 2 + 158, -6, 22, 6);
  ctx.restore(); };

 // ---------- METÁFORA: PARED Y MANGUERA (la pintura aparece donde cae el agua, línea por línea) ----------
 const pared = (ctx, t, p, nL, o = {}) => { const x0 = 110, y0 = 560, w = 860, h = 760;
  ctx.fillStyle = '#d9cbb3'; ctx.fillRect(-600, -600, W + 1200, HH + 1200); ctx.strokeStyle = 'rgba(120,100,80,0.45)'; ctx.lineWidth = 4; for (let yy = -600, r = 0; yy < HH + 600; yy += 70, r++) { ctx.beginPath(); ctx.moveTo(-600, yy); ctx.lineTo(W + 600, yy); ctx.stroke(); for (let xx = -600 + (r % 2) * 70; xx < W + 600; xx += 140) { ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + 70); ctx.stroke(); } }
  ctx.fillStyle = '#b8a688'; ctx.fillRect(x0 - 20, y0 - 20, w + 40, h + 40); ctx.fillStyle = '#ece4d4'; ctx.fillRect(x0, y0, w, h);
  const hit = barrido(ctx, x0, y0, w, h, p, nL, { punto: false, bg: '#ece4d4' }); ctx.strokeStyle = 'rgba(150,130,100,0.25)'; ctx.lineWidth = 2; for (let k = 1; k < nL; k++) { ctx.beginPath(); ctx.moveTo(x0, y0 + k * h / nL); ctx.lineTo(x0 + w, y0 + k * h / nL); ctx.stroke(); }
  ctx.fillStyle = '#ece4d4'; const lh = h / nL, cur = cl(p) * nL, li = Math.floor(cur); if (li < nL) { ctx.save(); ctx.globalAlpha = 0; ctx.restore(); }
  // agua: chorro desde la boquilla (abajo) hasta el punto que pinta
  const tgt = li < nL ? [x0 + w * (cur - li), y0 + (li + 0.5) * lh] : [x0 + w * 0.5, y0 + h * 0.5], nz = [540 + 80 * Math.sin(t * 0.7), 1720];
  ctx.fillStyle = '#2f7a3a'; ctx.beginPath(); ctx.moveTo(nz[0] - 40, HH + 100); ctx.quadraticCurveTo(nz[0] - 30, nz[1] + 60, nz[0] - 18, nz[1]); ctx.lineTo(nz[0] + 18, nz[1]); ctx.quadraticCurveTo(nz[0] + 30, nz[1] + 60, nz[0] + 40, HH + 100); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#c9ced8'; ctx.fillRect(nz[0] - 22, nz[1] - 40, 44, 44);
  if (li < nL) { const cx = (nz[0] + tgt[0]) / 2, cy = Math.min(nz[1], tgt[1]) - 160; ctx.lineCap = 'round'; for (const [lw, c] of [[26, 'rgba(120,190,255,0.35)'], [12, 'rgba(200,235,255,0.9)']]) { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(nz[0], nz[1] - 40); ctx.quadraticCurveTo(cx, cy, tgt[0], tgt[1]); ctx.stroke(); }
   const R = H.rng(Math.floor(t * 30)); ctx.fillStyle = 'rgba(200,235,255,0.9)'; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc(tgt[0] + (R() - 0.5) * 70, tgt[1] + (R() - 0.3) * 50, 3 + R() * 5, 0, TAU); ctx.fill(); } P.glow(ctx, tgt[0], tgt[1], 90, '255,240,200', 0.6); }
  return tgt; };

 // ---------- PRIMER PLANO DE LOS PUNTITOS DE FÓSFORO (tríadas rojo, verde, azul) ----------
 const fosforos = (ctx, t, o = {}) => { ctx.fillStyle = '#07090f'; ctx.fillRect(-600, -600, W + 1200, HH + 1200); const st = 66, cols = ['255,70,70', '70,255,110', '80,140,255'], spot = o.spot, lit = o.lit || [1, 1, 1], base = o.base ?? 0.12;
  for (let r = -2, ri = 0; r < 34; r++, ri++) for (let c = -2; c < 20; c++) { const k = ((c % 3) + 3) % 3, x = c * st + (ri % 2) * st / 2, y = 300 + r * st * 0.86; let b = base * (o.todo ? 1 : 1); if (spot) { const d = Math.hypot(x - spot[0], y - spot[1]); b += Math.max(0, 1 - d / (o.radio || 150)); } b = Math.min(1, b) * lit[k] + (o.todo ? 0.85 * lit[k] : 0); b = Math.min(1, b);
   ctx.fillStyle = `rgba(${cols[k]},${0.12 + 0.88 * b})`; ctx.beginPath(); ctx.arc(x, y, st * 0.38, 0, TAU); ctx.fill(); if (b > 0.5) { ctx.fillStyle = `rgba(255,255,255,${(b - 0.5) * 0.9})`; ctx.beginPath(); ctx.arc(x, y, st * 0.16, 0, TAU); ctx.fill(); } }
  if (spot && o.haz !== false) { P.glow(ctx, spot[0], spot[1], 200, '220,245,255', 0.6); } };

 // ---------- ESTALLIDO DE ELECTRONES HACIA LA CÁMARA (k = 0..1; con k = 1 llena ~90 % del ancho) ----------
 const disparo = (ctx, t, x, y, k) => { if (k <= 0) return; ctx.save(); const r = 40 + 520 * k; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(190,240,255,0.95)'); g.addColorStop(0.7, 'rgba(90,180,255,0.6)'); g.addColorStop(1, 'rgba(60,120,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  const R = H.rng(5); ctx.strokeStyle = 'rgba(220,250,255,0.95)'; ctx.lineCap = 'round'; for (let i = 0; i < 40; i++) { const a = R() * TAU, d0 = r * (0.2 + 0.5 * R()), d1 = d0 + 80 + 160 * k * R(); ctx.lineWidth = 3 + 6 * R(); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * d0, y + Math.sin(a) * d0); ctx.lineTo(x + Math.cos(a) * d1, y + Math.sin(a) * d1); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 6; for (let j = 0; j < 6; j++) { let a = j / 6 * TAU + t, px = x, py = y; ctx.beginPath(); ctx.moveTo(px, py); for (let s = 0; s < 6; s++) { px += Math.cos(a) * r * 0.16; py += Math.sin(a) * r * 0.16; a += (R() - 0.5) * 1.2; ctx.lineTo(px, py); } ctx.stroke(); } ctx.restore(); };

 // =====================================================================================================
 // ESCENAS (un plano por idea, ninguno > 4 s quieto; textos siempre encima de los destellos)
 // =====================================================================================================
 const B = [];
 const FY = 1440, TX = 520, TS = 1.05;   // piso, televisor en la sala
 const fam = (c, t, o = {}) => { persona(c, t, (o.nino && o.nino.x) ?? 150, FY, 0.82, Object.assign({ ropa: '#3a7a4a', seed: 1.3, mira: 1 }, o.nino || {})); };
 const abuela = (c, t, o = {}) => persona(c, t, 800, FY, 1.1, Object.assign({ abuela: true, ropa: '#8e4f8a', piel: '#c98d63', seed: 0, mira: -1 }, o));
 const sala = (ctx, t, o = {}) => { salaFondo(ctx, t, { fy: FY }); const delante = o.nino && o.nino.delante; if (o.nino !== false && !delante) fam(ctx, t, { nino: o.nino || {} }); televisor(ctx, t, TX, FY, TS, o.tv || {}); if (delante) fam(ctx, t, { nino: o.nino }); if (o.abuela !== false) abuela(ctx, t, o.abuela || {}); if (o.tv && o.tv.pantalla && o.tv.pantalla !== 'apagada') P.glow(ctx, TX + TS * SCX, FY + TS * SCY, 600, '170,200,255', 0.18); };

 // ---------- 1 · GANCHO: frente al televisor de tu abuela (estática, antena) → la cámara avanza → en «DISPARANDO» el chorro sale a cámara (90 %) → la familia reacciona ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  if (PORTADA) { const fy = 1770, ps = 1.55, cx = 540, sp = cx + ps * 110; salaFondo(ctx, 0.5, { fy });
   ctx.save(); ctx.beginPath(); ctx.rect(-100, -100, sp + 100, HH + 200); ctx.clip(); tvLado(ctx, 0.5, cx, fy, ps, { rx: 1, antena: 0, antenaAng: 1.25, antenaL: 200, tubo: { haz: 1, v: -0.25 } }); ctx.restore();
   ctx.save(); ctx.beginPath(); ctx.rect(sp, -100, W, HH + 200); ctx.clip(); tvLado(ctx, 0.5, cx, fy, ps, { antena: 0, antenaAng: 1.25, antenaL: 200 }); ctx.restore();
   const top = fy - ps * (70 + TVH); ctx.fillStyle = CY; ctx.fillRect(sp - 3, top + 6, 6, ps * TVH - 12); P.glow(ctx, sp, top + ps * TVH / 2, 260, '143,216,255', 0.35); P.glow(ctx, cx + ps * 312, top + ps * TVH / 2, 260, '140,255,190', 0.55);
   ctx.fillStyle = '#1e1612'; ctx.fillRect(0, fy + 20, W, HH); ctx.fillStyle = '#b8452f'; ctx.fillRect(0, fy + 14, W, 8); return; }
  P.pregunta(ctx, '¿CÓMO FUNCIONABA / EL TELEVISOR DE ANTES?', t, 0, S(2) - 0.15, { capY: 330, px: 58, clave: 'TELEVISOR', col: '#ff3b3b', x: 540, dy: 110 });
  const TE = Tk.disparando, TC = TE - 0.3, TR = TE + 0.35, golpes = [[TE, 1.4]], sh = sacude(t, golpes, 56);
  ctx.save(); ctx.translate(sh[0], sh[1]);
  const scW = tvPunto(TX, FY, TS);
  if (t < TR) { const u = E.in(cl(t / TE)), z = lerp(1.2, 1.75, u), cam = [lerp(520, scW[0], u), lerp(1030, scW[1], u), z]; ctx.save(); zoomP(ctx, cam);
   sala(ctx, t, { tv: { pantalla: 'estatica', antena: Math.sin(t * 4), tiembla: t > TC ? 1.5 : 0, brillo: 0.15 }, abuela: { brazoI: [(TX + TS * (40 + Math.sin(0.45) * 130) - 800) / 1.1 + 6 * Math.sin(t * 4), (FY + TS * (-70 - TVH - 18 - Math.cos(0.45) * 130) - FY) / 1.1] }, nino: { mira: 1 } }); ctx.restore();
   if (t >= TC) { const k = t < TE ? E.in((t - TC) / (TE - TC)) * 0.85 + 0.1 : 1; disparo(ctx, t, 540, 960, k); } }
  else { const cam = camK(t, [[TR, 520, 1030, 1.2], [S(2), 520, 1030, 1.24]]); ctx.save(); zoomP(ctx, cam);
   sala(ctx, t, { tv: { pantalla: 'estatica', antena: Math.sin(t * 4), brillo: 0.2 }, abuela: { miedo: 1 - sm(TE + 0.7, S(2), t) * 0.7, pecho: t > TE + 0.7 }, nino: { miedo: 1, salto: Math.max(0, Math.sin((t - TR) * 9)) * (1 - sm(TE + 0.7, S(2), t)) } }); ctx.restore();
   disparo(ctx, t, 540, 960, 0.8 * (1 - sm(TR, TR + 0.5, t))); }
  ctx.restore(); fogonazo(ctx, t, [[TE, 1.0]]);
 }, sfx(k) { const TE = Tk.disparando; k.noise(0, { dur: S(2), filter: 'bandpass', f: 3000, q: 0.6, gain: 0.07, a: 0.02, hold: TE - 0.3 }); k.tone(0, { f: 7800, dur: TE, gain: 0.006, a: 0.3 }); for (let x = 0.2; x < TE; x += 0.33) k.play('tick', x, { f: 600, gain: 0.06, minor: true });
  k.play('riser', 0.6, { dur: TE - 0.6, gain: 0.3, minor: true }); k.play('whoosh', TE - 0.3, { dur: 0.3, top: 3200, gain: 0.4, minor: true }); k.play('thud', TE, { f: 38, gain: 1.0 }); k.noise(TE, { dur: 0.7, filter: 'highpass', f: 2500, gain: 0.5, a: 0.002 }); for (let i = 0; i < 8; i++) k.tone(TE + i * 0.045, { f: 180 + i * 90, type: 'square', dur: 0.04, gain: 0.05, a: 0.002 }); k.tone(TE, { f: [[0, 120], [0.8, 60]], type: 'sawtooth', dur: 0.9, gain: 0.07, filter: 'lowpass', f2: 900 }); k.play('pop', TE + 0.4, { f: 380, gain: 0.25, minor: true }); } });

 // ---------- 2 · ¿Cómo funcionaba? → el televisor DE LADO: lo profundo que era; la cámara lo rodea ----------
 B.push({ t0: S(2), t1: S(3), in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const cam = camK(t, [[S(2), 600, 1060, 1.12], [S(3), 520, 1040, 1.05]]); ctx.save(); zoomP(ctx, cam); salaFondo(ctx, t, { fy: FY }); tvLado(ctx, t, 540, FY, 1.35, { antena: Math.sin(t * 3) }); ctx.restore();
 }, sfx(k) { k.play('whoosh', S(2), { dur: 0.6, top: 1400, gain: 0.3 }); k.noise(S(2), { dur: S(3) - S(2), filter: 'bandpass', f: 3000, q: 0.6, gain: 0.04, a: 0.1 }); } });

 // ---------- 3 · Lo que pasaba por dentro te va a sorprender → un escáner recorre el mueble y deja ver el TUBO dentro ----------
 B.push({ t0: S(3), t1: S(4), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const cam = camK(t, [[S(3), 520, 1040, 1.05], [S(4), 540, 1000, 1.25]]), sc = sm(S(3) + 0.2, Tk.sorprender + 0.3, t); ctx.save(); zoomP(ctx, cam); salaFondo(ctx, t, { fy: FY });
  tvLado(ctx, t, 540, FY, 1.35, { rx: sc, antena: Math.sin(t * 3), tubo: { haz: sm(Tk.sorprender - 0.3, Tk.sorprender, t), v: 0.4 * Math.sin(t * 3) } });
  const xs = lerp(100, 980, sc); ctx.fillStyle = CY; ctx.fillRect(xs - 4, 600, 8, 900); P.glow(ctx, xs, 1050, 400, '143,216,255', 0.3 * (1 - sm(0.9, 1, sc))); ctx.restore();
 }, sfx(k) { k.tone(S(3) + 0.2, { f: [[0, 300], [2, 1000]], type: 'sine', dur: 2.2, gain: 0.05 }); FX.revelar(k, Tk.sorprender - 0.3); } });

 // ---------- 4 · Al fondo del tubo, un CAÑÓN dispara electrones hacia la pantalla… → rayos X: primer plano del cañón y la cámara sigue el chorro hasta la pantalla ----------
 B.push({ t0: S(4), t1: S(5), in: { type: 'cut' }, draw(ctx, t) {
  const ts = 1.15, tx = 540 - 40 * ts, ty = 960, L = sm(Tk.dispara, Tk.pantalla - 0.1, t), cam = camK(t, [[S(4), tx - 330 * ts, ty, 2.0], [Tk.dispara, tx - 300 * ts, ty, 1.9], [Tk.pantalla, tx + 120 * ts, ty, 1.15], [S(5), 540, ty, 1.0]]);
  rejilla(ctx); ctx.save(); zoomP(ctx, cam); tuboRX(ctx, t, tx, ty, ts, { haz: L > 0 ? 1 : 0, largo: L, v: 0, marcaCanon: t < Tk.dispara + 0.2 && t > Tk.canon - 0.2 }); ctx.restore();
  TAG(ctx, 'CAÑÓN', 470, 520, t, Tk.canon - 0.3, Tk.pantalla - 0.6, { mono: true, col: YE, px: 66 }); TAG(ctx, 'CHORRO DE ELECTRONES', 470, 520, t, Tk.pantalla - 0.4, S(5), { mono: true, col: CY, px: 50 });
 }, sfx(k) { k.play('whoosh', S(4), { dur: 0.4, top: 1600, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.canon - 0.3); k.play('thud', Tk.dispara, { f: 90, gain: 0.4 }); k.tone(Tk.dispara, { f: [[0, 200], [1.6, 900]], type: 'sawtooth', dur: 1.7, gain: 0.03, filter: 'lowpass', f2: 2500 }); k.noise(Tk.dispara, { dur: S(5) - Tk.dispara, filter: 'bandpass', f: 5000, q: 2, gain: 0.05, a: 0.05 }); FX.etiqueta(k, Tk.pantalla - 0.4); } });

 // ---------- 5 · …hacia ti. → de frente, el televisor transparente: el chorro sale de la pantalla a la cámara (golpe en «ti») ----------
 B.push({ t0: S(5), t1: S(6), in: { type: 'cut' }, draw(ctx, t) {
  const g0 = Tk.ti, golpes = [[g0, 1.0]], sh = sacude(t, golpes, 40), k = E.out(cl((t - S(5)) / (g0 - S(5)))) * (1 - 0.6 * sm(g0 + 0.2, S(6), t)), sc = tvPunto(TX, FY, TS);
  ctx.save(); ctx.translate(sh[0], sh[1]); ctx.save(); zoomP(ctx, [sc[0], sc[1] - 20, 1.7]); sala(ctx, t, { tv: { pantalla: (c, x, y, w, h) => { c.fillStyle = '#0a1830'; c.fillRect(x, y, w, h); }, brillo: 0.4, brilloCol: '150,230,255' }, nino: false, abuela: false }); ctx.restore(); disparo(ctx, t, 540, 930, 0.3 + 0.7 * k); ctx.restore();
  fogonazo(ctx, t, golpes); TAG(ctx, '¡HACIA TI!', 470, 520, t, g0 - 0.2, S(6), { mono: true, col: RD, px: 66 });
 }, sfx(k) { k.play('thud', Tk.ti, { f: 45, gain: 0.9 }); k.noise(Tk.ti, { dur: 0.5, filter: 'highpass', f: 3000, gain: 0.4, a: 0.002 }); for (let i = 0; i < 6; i++) k.tone(Tk.ti + i * 0.05, { f: 220 + i * 110, type: 'square', dur: 0.04, gain: 0.05 }); FX.etiqueta(k, Tk.ti - 0.2); } });

 // ---------- 6 · Como pintar una pared con una manguera… → la pared; la manguera pinta una línea ----------
 B.push({ t0: S(6), t1: S(7), in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const p = sm(S(6) + 0.2, S(7), t) * (2 / 12), cam = camK(t, [[S(6), 540, 1000, 1.0], [S(7), 520, 980, 1.06]]); ctx.save(); zoomP(ctx, cam); pared(ctx, t, p, 12); ctx.restore();
  TAG(ctx, 'COMO UNA MANGUERA', 470, 520, t, Tk.manguera - 0.4, S(7), { mono: true, col: AZ, px: 54 });
 }, sfx(k) { k.noise(S(6) + 0.2, { dur: S(7) - S(6) - 0.2, filter: 'bandpass', f: 1800, q: 0.8, gain: 0.1, a: 0.1 }); FX.etiqueta(k, Tk.manguera - 0.4); } });

 // ---------- 7 · línea por línea. → acercamiento: la manguera va bajando renglón por renglón ----------
 B.push({ t0: S(7), t1: S(8), in: { type: 'zoom', d: 0.35, x: 540, y: 900 }, draw(ctx, t) {
  const p = lerp(2 / 12, 6 / 12, sm(S(7), S(8), t)), cam = camK(t, [[S(7), 540, 820, 1.35], [S(8), 540, 900, 1.25]]); ctx.save(); zoomP(ctx, cam); pared(ctx, t, p, 12); ctx.restore();
  TAG(ctx, 'LÍNEA POR LÍNEA', 470, 520, t, Tk.linea - 0.3, S(8), { mono: true, col: YE, px: 60 });
 }, sfx(k) { k.noise(S(7), { dur: S(8) - S(7), filter: 'bandpass', f: 1800, q: 0.8, gain: 0.1, a: 0.05 }); for (let i = 0; i < 4; i++) k.play('tick', S(7) + 0.3 + i * 0.35, { f: 900, gain: 0.12, minor: true }); FX.etiqueta(k, Tk.linea - 0.3); } });

 // ---------- 8 · Unos imanes mueven el chorro de lado a lado y de arriba abajo → rayos X: las bobinas de cobre lo desvían (de lado) → de frente, el puntito va de lado a lado y baja ----------
 B.push({ t0: S(8), t1: S(9), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const tb = Tk.lado - 0.2;
  if (t < tb) { const ts = 1.15, tx = 540 - 40 * ts, cam = camK(t, [[S(8), tx - 150 * ts, 960, 1.8], [tb, tx - 100 * ts, 960, 1.55]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam); tuboRX(ctx, t, tx, 960, ts, { haz: 1, v: 0.85 * Math.sin((t - S(8)) * 3), bobinas: sm(Tk.imanes - 0.3, Tk.imanes, t) }); ctx.restore(); TAG(ctx, 'IMANES (BOBINAS)', 470, 520, t, Tk.imanes - 0.3, tb, { mono: true, col: NAR, px: 56 }); }
  else { const sc = tvPunto(TX, FY, TS), cam = camK(t, [[tb, sc[0], sc[1] - 70, 2.05], [S(9), sc[0], sc[1] - 70, 2.2]]), u = (t - tb) * 1.1, p = Math.min(0.999, u / 3.2); ctx.save(); zoomP(ctx, cam); sala(ctx, t, { tv: { pantalla: 'barrido', p, nL: 6, lineas: true, rPunto: 12 }, nino: false, abuela: false }); ctx.restore();
   const vy = t > Tk.arriba - 0.2; ctx.save(); ctx.globalAlpha = 0.9; if (!vy) { flecha(ctx, 330, 1430, 760, 1430, YE, 14); flecha(ctx, 760, 1430, 330, 1430, YE, 14); } else { flecha(ctx, 970, 620, 970, 1280, YE, 14); } ctx.restore();
   TAG(ctx, vy ? 'DE ARRIBA ABAJO' : 'DE LADO A LADO', 470, 520, t, vy ? Tk.arriba - 0.2 : tb, S(9), { mono: true, col: YE, px: 56 }); }
 }, sfx(k) { k.play('whoosh', S(8), { dur: 0.4, top: 1400, gain: 0.25, minor: true }); k.tone(Tk.imanes - 0.2, { f: [[0, 120], [1, 180]], type: 'triangle', dur: 1.2, gain: 0.05 }); FX.etiqueta(k, Tk.imanes - 0.3); k.play('whoosh', Tk.lado - 0.25, { dur: 0.3, top: 2000, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.lado - 0.2); FX.etiqueta(k, Tk.arriba - 0.2); } });

 // ---------- 9 · Barre más de quinientas líneas, decenas de veces por segundo… → (de la C) la imagen se desarma en UN puntito que barre: lento… y acelera ----------
 B.push({ t0: S(9), t1: S(10), in: { type: 'cut' }, draw(ctx, t) {
  const sc = tvPunto(TX, FY, TS), d = t - S(9), cam = camK(t, [[S(9), sc[0], sc[1] - 70, 2.2], [Tk.quinientas, sc[0], sc[1] - 60, 2.05], [S(10), 520, 1060, 1.25]]);
  const lento = 1.0, fase = d < lento ? d / lento * 0.12 : 0.12 + Math.pow(d - lento, 2) * 0.5, nL = d < lento ? 10 : Math.round(lerp(10, 90, sm(S(9) + lento, Tk.segundo, t))), p = fase % 1;
  ctx.save(); zoomP(ctx, cam); sala(ctx, t, { tv: { pantalla: d < 0.25 ? 'imagen' : 'barrido', p, nL, lineas: nL < 30, rPunto: nL < 30 ? 12 : 6 }, nino: false, abuela: false }); ctx.restore();
  TAG(ctx, 'MÁS DE 500 LÍNEAS', 470, 520, t, Tk.quinientas - 0.3, Tk.segundo - 0.4, { mono: true, col: YE, px: 56 }); TAG(ctx, 'DECENAS DE VECES POR SEGUNDO', 470, 520, t, Tk.segundo - 0.4, S(10), { mono: true, col: CY, px: 42 });
 }, sfx(k) { const d0 = S(9); for (let x = d0 + 0.05, g = 0.25; x < S(10); x += g, g = Math.max(0.03, g * 0.85)) k.play('tick', x, { f: 1100, gain: 0.1, minor: true }); k.play('riser', d0 + 1, { dur: S(10) - d0 - 1, gain: 0.3, minor: true }); FX.etiqueta(k, Tk.quinientas - 0.3); FX.etiqueta(k, Tk.segundo - 0.4); } });

 // ---------- 10 · y tu ojo ve una imagen. → (de la B) la sala: hay estática, la abuela le da el GOLPECITO… y aparece la imagen ----------
 B.push({ t0: S(10), t1: S(11), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const tg = S(10) + 0.25, ok = sm(tg + 0.3, Tk.imagen, t), cam = camK(t, [[S(10), 520, 1060, 1.08], [S(11), 540, 1040, 1.14]]), d = t - tg, bump = d > 0 && d < 0.5 ? Math.sin(d * 25) * Math.exp(-d * 6) : 0;
  ctx.save(); zoomP(ctx, cam); sala(ctx, t, { tv: { pantalla: 'imagen', mezcla: 1 - ok, tiembla: Math.abs(bump), brillo: 0.15 }, abuela: { brazoI: [(TX + TS * TVW / 2 - 70 - 800) / 1.1, (FY - TS * 360 - FY) / 1.1 - 26 * Math.abs(bump)], sonrie: ok }, nino: { sonrie: ok, salto: 0.3 * Math.max(0, Math.sin((t - Tk.imagen) * 8)) * sm(Tk.imagen - 0.1, Tk.imagen, t) } }); ctx.restore();
  if (d > 0 && d < 0.4) { ctx.save(); ctx.globalAlpha = 1 - d / 0.4; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(860, 930, 40 + i * 26 + d * 120, -0.8, 0.8); ctx.stroke(); } ctx.restore(); }
 }, sfx(k) { const tg = S(10) + 0.25; k.noise(S(10), { dur: 0.6, filter: 'bandpass', f: 3000, q: 0.6, gain: 0.08, a: 0.02 }); k.play('thud', tg, { f: 150, gain: 0.5 }); k.play('thud', tg + 0.12, { f: 140, gain: 0.35 }); k.tone(Tk.imagen - 0.1, { f: 'C5', dur: 0.6, gain: 0.05, verb: 0.4 }); k.tone(Tk.imagen, { f: 'E5', dur: 0.6, gain: 0.05, verb: 0.4 }); } });

 // ---------- 11 · El fósforo de la pantalla brilla donde le pega… → primer plano de los puntitos: brillan donde pasa el chorro ----------
 B.push({ t0: S(11), t1: S(12), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const d = t - S(11), row = Math.floor(d * 1.6), sx = ((d * 1.6) % 1) * 1300 - 110, sy = 640 + (row % 4) * 170, cam = camK(t, [[S(11), 540, 950, 1.0], [S(12), 560, 960, 1.12]]);
  ctx.save(); zoomP(ctx, cam); fosforos(ctx, t, { spot: [sx, sy], radio: 190, base: 0.3 }); ctx.restore();
  TAG(ctx, 'FÓSFORO', 470, 520, t, Tk.fosforo - 0.3, S(12), { mono: true, col: GR, px: 66 });
 }, sfx(k) { k.noise(S(11), { dur: S(12) - S(11), filter: 'bandpass', f: 6000, q: 3, gain: 0.04, a: 0.1 }); FX.etiqueta(k, Tk.fosforo - 0.3); k.play('ding', Tk.pega, { f: 'A5', gain: 0.15 }); } });

 // ---------- 12 · como la pintura donde cae el agua. → la pared: donde cae el agua aparece la pintura (acercamiento al chorro) ----------
 B.push({ t0: S(12), t1: S(13), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  const p = lerp(6 / 12, 9 / 12, sm(S(12), S(13), t)), cam = camK(t, [[S(12), 560, 1060, 1.5], [S(13), 520, 1000, 1.2]]); ctx.save(); zoomP(ctx, cam); pared(ctx, t, p, 12); ctx.restore();
  TAG(ctx, 'DONDE CAE EL AGUA', 470, 520, t, Tk.agua - 0.6, S(13), { mono: true, col: AZ, px: 54 });
 }, sfx(k) { k.noise(S(12), { dur: S(13) - S(12), filter: 'bandpass', f: 1800, q: 0.8, gain: 0.1, a: 0.05 }); FX.etiqueta(k, Tk.agua - 0.6); } });

 // ---------- 13 · En los de color hay tres mangueras: → rayos X con TRES cañones y tres chorros; tubo en diagonal, grande y centrado; la cámara gira ----------
 B.push({ t0: S(13), t1: S(14), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const u = sm(S(13), S(14), t), ang = lerp(-1.0, -0.8, u), sT = 1.05, g = rotP(sT, ang, -400, 0), cam = camK(t, [[S(13), lerp(540, g[0], 0.4), lerp(960, g[1], 0.4), 1.25], [S(14), 540, 960, 1.0]]);
  rejilla(ctx); ctx.save(); zoomP(ctx, cam); tuboCentro(ctx, t, sT, ang, { haz: 1, tres: true, v: 0.5 * Math.sin((t - S(13)) * 2) }); ctx.restore();
  TAG(ctx, 'TRES CHORROS', 470, 520, t, Tk.tres - 0.3, S(14), { mono: true, col: '#ffffff', px: 62 });
 }, sfx(k) { k.play('whoosh', S(13), { dur: 0.5, top: 1600, gain: 0.25, minor: true }); for (let i = 0; i < 3; i++) k.play('pop', S(13) + 0.3 + i * 0.18, { f: 400 + i * 120, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.tres - 0.3); } });

 // ---------- 14 · rojo, verde y azul. → los puntitos se encienden por color, uno por palabra, y juntos dan blanco ----------
 B.push({ t0: S(14), t1: S(15), in: { type: 'cut' }, draw(ctx, t) {
  const lr = sm(Tk.rojo - 0.1, Tk.rojo + 0.1, t), lv = sm(Tk.verde - 0.1, Tk.verde + 0.1, t), la = sm(Tk.azul - 0.1, Tk.azul + 0.1, t), cam = camK(t, [[S(14), 540, 950, 1.25], [S(15), 540, 950, 1.0]]);
  ctx.save(); zoomP(ctx, cam); fosforos(ctx, t, { base: 0.05, todo: true, lit: [lr, lv, la] }); ctx.restore();
  P.tag(ctx, 'ROJO', 470, 520, t, Tk.rojo - 0.3, Tk.verde - 0.22, { mono: true, col: '#ff5a5a', px: 70 }); P.tag(ctx, 'VERDE', 470, 520, t, Tk.verde - 0.2, Tk.azul - 0.22, { mono: true, col: '#4cff7a', px: 70 }); P.tag(ctx, 'AZUL', 470, 520, t, Tk.azul - 0.2, S(15), { mono: true, col: '#6aa8ff', px: 70 });
 }, sfx(k) { k.tone(Tk.rojo, { f: 'C5', dur: 0.4, gain: 0.07 }); k.tone(Tk.verde, { f: 'E5', dur: 0.4, gain: 0.07 }); k.tone(Tk.azul, { f: 'G5', dur: 0.4, gain: 0.07 }); k.tone(Tk.azul + 0.3, { f: 'C6', dur: 1, gain: 0.05, verb: 0.5 }); } });

 // ---------- 15 · ¿Y por qué eran tan pesados y profundos? → LA SALA: el niño empuja el televisor y no se mueve, la abuela se ríe → de lado, lo profundo → (pausa) rayos X: el aire empieza a salir ----------
 const TUS = 1.0, TUX = 540 + 64 * TUS, TV_S = 1.15;   // TV_S: tubo vertical (≈ 71 % del ancho, casi todo el alto útil)
 B.push({ t0: S(15), t1: S(16), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.profundos - 0.1, tp = Tk.profundos + 0.6;
  if (t < tb) { const cam = camK(t, [[S(15), 470, 1060, 1.12], [tb, 450, 1080, 1.2]]), sh = 4 * Math.sin(t * 40); ctx.save(); zoomP(ctx, cam);
   sala(ctx, t, { tv: { pantalla: 'imagen', brillo: 0.12 }, nino: { delante: true, x: 160 + sh, brazoD: [120 + 6 * Math.sin(t * 30), -340], brazoI: [80, -310], incl: 0.28, miedo: 0.3 }, abuela: { sonrie: 1, pecho: true, salto: 0.07 * Math.abs(Math.sin(t * 16)), mira: -1 } });
   ctx.fillStyle = '#7fc8ff'; for (const [dx, dy, ph] of [[-50, -600, 0], [40, -630, 0.5]]) { const q = ((t * 1.5 + ph) % 1); ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.ellipse(160 + dx * 0.82 + 30, FY + dy * 0.82 + q * 60, 7, 11, 0, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; ctx.restore();
   TAG(ctx, 'PESADO', 470, 520, t, Tk.pesados - 0.3, tb, { mono: true, col: NAR, px: 64 }); }
  else if (t < tp) { const cam = camK(t, [[tb, 540, 1080, 1.0], [tp, 540, 1060, 1.06]]); ctx.save(); zoomP(ctx, cam); salaFondo(ctx, t, { fy: FY }); tvLado(ctx, t, 540, FY, 1.35, { profundo: sm(tb, tb + 0.3, t), antena: Math.sin(t * 2) }); ctx.restore(); TAG(ctx, 'PROFUNDO', 470, 520, t, tb + 0.05, tp, { mono: true, col: YE, px: 64 }); }
  else { const sa = 0.45 * sm(tp, S(16), t), cam = camK(t, [[tp, 540, 960, 1.1], [S(16), 540, 960, 1.02]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam); tuboCentro(ctx, t, TUS, lerp(0, -0.3, sm(tp, S(16), t)), { aireSale: sa }); ctx.restore(); }
 }, sfx(k) { k.noise(S(15) + 0.2, { dur: 0.9, color: 'brown', filter: 'bandpass', f: 200, q: 2, gain: 0.12, a: 0.1 }); FX.etiqueta(k, Tk.pesados - 0.3); for (let i = 0; i < 3; i++) k.play('pop', S(15) + 0.5 + i * 0.22, { f: 700 + i * 60, gain: 0.12, minor: true }); k.play('whoosh', Tk.profundos - 0.15, { dur: 0.4, top: 1400, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.profundos - 0.05); k.noise(Tk.profundos + 0.6, { dur: S(16) - Tk.profundos - 0.6, filter: 'bandpass', f: [[0, 600], [1, 1400]], q: 1.5, gain: 0.1, a: 0.2 }); FX.latido(k, Tk.profundos + 0.7, 2, 0.5); } });

 // ---------- 16 · Porque por dentro el tubo está al VACÍO. → el tubo GIRA hasta quedar de pie (grande); el aire termina de salir… ¡golpe en «vacío»!: destello, sacudida, el vidrio cruje ----------
 B.push({ t0: S(16), t1: S(17), in: { type: 'cut' }, draw(ctx, t) {
  const g0 = Tk.vacio, golpes = [[g0, 1.4]], sh = sacude(t, golpes, 52), sa = lerp(0.45, 1, sm(S(16), g0 - 0.15, t)), ang = lerp(-0.3, -Math.PI / 2, E.inOut(sm(S(16), g0 - 0.1, t))), s_ = lerp(TUS, TV_S, sm(S(16), g0 - 0.1, t)), cam = camK(t, [[S(16), 540, 960, 1.0], [g0, 540, 960, 1.04], [S(17), 540, 960, 1.0]]), gr = t > g0 ? Math.exp(-(t - g0) * 2.2) : 0;
  rejilla(ctx); ctx.save(); zoomP(ctx, cam, sh); tuboCentro(ctx, t, s_, ang, { aireSale: sa, grieta: gr }); ctx.restore();
  if (t > g0) { const v = cl((t - g0) / 0.5); ctx.save(); ctx.globalAlpha = 0.5 * (1 - v); ctx.strokeStyle = CY; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(540, 960, 200 + 600 * v, 0, TAU); ctx.stroke(); ctx.restore(); }
  fogonazo(ctx, t, [[g0, 0.6]]); TAG(ctx, 'AL VACÍO', 470, 520, t, g0 - 0.15, S(17), { mono: true, col: CY, px: 72 });
 }, sfx(k) { k.noise(S(16), { dur: Tk.vacio - S(16), filter: 'bandpass', f: [[0, 1200], [2, 3500]], q: 1.2, gain: 0.12, a: 0.05 }); k.play('riser', S(16) + 0.2, { dur: Tk.vacio - S(16) - 0.25, gain: 0.3, minor: true }); k.play('thud', Tk.vacio, { f: 38, gain: 1.0 });
  for (let i = 0; i < 7; i++) k.noise(Tk.vacio + 0.02 + i * 0.045, { dur: 0.03, filter: 'highpass', f: 3500 + i * 300, gain: 0.35, a: 0.001 }); k.tone(Tk.vacio, { f: 880, type: 'triangle', dur: 1.4, gain: 0.07, verb: 0.6 }); k.tone(Tk.vacio, { f: 1318, type: 'triangle', dur: 1.1, gain: 0.05, verb: 0.6 }); FX.etiqueta(k, Tk.vacio - 0.15); } });

 // ---------- 17 · El aire lo aprieta desde afuera… → de pie: acercamiento al CUELLO y la cámara se aleja mientras las flechas del aire aprietan ----------
 B.push({ t0: S(17), t1: S(18), in: { type: 'cut' }, draw(ctx, t) {
  const ap = sm(S(17), Tk.aprieta + 0.3, t), ang = -Math.PI / 2, n = rotP(TV_S, ang, -330, 0), cam = camK(t, [[S(17), n[0], n[1] - 60, 1.7], [Tk.aprieta + 0.1, 540, 1000, 1.15], [S(18), 540, 960, 1.0]]);
  rejilla(ctx); ctx.save(); zoomP(ctx, cam); ctx.translate(2 * ap * Math.sin(t * 60), 0); tuboCentro(ctx, t, TV_S, ang, { aire: ap }); ctx.restore();
  TAG(ctx, 'EL AIRE APRIETA', 470, 520, t, Tk.aprieta - 0.4, S(18), { mono: true, col: AZ, px: 58 });
 }, sfx(k) { k.noise(S(17), { dur: S(18) - S(17), color: 'brown', filter: 'lowpass', f: [[0, 200], [2, 600]], gain: 0.15, a: 0.3 }); FX.etiqueta(k, Tk.aprieta - 0.4); } });

 // ---------- 18 · y el vidrio tenía que ser gruesísimo. → acercamiento al VIDRIO de la pantalla (arriba), que se vuelve grueso y brilla; la cámara gira un poco ----------
 B.push({ t0: S(18), t1: S(19), in: { type: 'zoom', d: 0.35, x: 540, y: 600 }, draw(ctx, t) {
  const gr = sm(S(18) + 0.2, Tk.gruesisimo, t), ang = -Math.PI / 2 + 0.12 * sm(S(18), S(19), t), f = rotP(TV_S, ang, 300, 0), cam = camK(t, [[S(18), f[0], f[1] + 140, 1.55], [S(19), f[0], f[1] + 170, 1.4]]);
  rejilla(ctx); ctx.save(); zoomP(ctx, cam); tuboCentro(ctx, t, TV_S, ang, { aire: 0.6, grosor: gr }); ctx.restore();
  TAG(ctx, 'VIDRIO GRUESO', 470, 1390, t, Tk.gruesisimo - 0.5, S(19), { mono: true, col: YE, px: 62 });
 }, sfx(k) { k.play('whoosh', S(18), { dur: 0.4, top: 1400, gain: 0.25, minor: true }); k.tone(Tk.gruesisimo - 0.2, { f: 'A4', type: 'triangle', dur: 0.9, gain: 0.06, verb: 0.4 }); FX.etiqueta(k, Tk.gruesisimo - 0.5); } });

 // ---------- 19 · Y el chorro puede necesitar espacio para abrirse hasta las esquinas. → el tubo gira de nuevo a horizontal: el chorro barre de esquina a esquina (cono) → de lado, lo profundo ----------
 B.push({ t0: S(19), t1: S(20), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.esquinas + 0.15;
  if (t < tb) { const q = sm(S(19), S(19) + 1.4, t), ang = lerp(-Math.PI / 2, -0.12, E.inOut(q)), s_ = lerp(TV_S, TUS, q), cam = camK(t, [[S(19), 540, 960, 1.0], [tb, 540, 960, 1.06]]), v = Math.sin((t - S(19)) * 4);
   rejilla(ctx); ctx.save(); zoomP(ctx, cam); tuboCentro(ctx, t, s_, ang, { haz: 1, v: 0.98 * v, cono: sm(Tk.esquinas - 1.0, Tk.esquinas - 0.6, t), bobinas: 0.6 }); ctx.restore(); TAG(ctx, 'HASTA LAS ESQUINAS', 470, 520, t, Tk.esquinas - 0.6, tb, { mono: true, col: YE, px: 52 }); }
  else { const cam = camK(t, [[tb, 540, 1060, 1.12], [S(20), 540, 1080, 1.02]]); ctx.save(); zoomP(ctx, cam); salaFondo(ctx, t, { fy: FY }); tvLado(ctx, t, 540, FY, 1.35, { rx: 0.85, profundo: 1, tubo: { haz: 1, v: 0.95 * Math.sin(t * 4), cono: 1 } }); ctx.restore(); }
 }, sfx(k) { k.noise(S(19), { dur: S(20) - S(19), filter: 'bandpass', f: 5000, q: 2, gain: 0.05, a: 0.1 }); for (let x = S(19) + 0.1; x < S(20); x += Math.PI / 4) k.play('whoosh', x, { dur: 0.3, top: 2400, gain: 0.12, minor: true }); FX.etiqueta(k, Tk.esquinas - 0.6); } });

 // ---------- 20 · Toda esa imagen… era un solo puntito pintando a toda velocidad. → la familia mira la imagen → primer plano: un solo puntito la pinta a toda velocidad ----------
 B.push({ t0: S(20), t1: S(21), in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const tb = Tk.puntito - 0.35;
  if (t < tb) { const cam = camK(t, [[S(20), 520, 1080, 1.02], [tb, 520, 1060, 1.1]]); ctx.save(); zoomP(ctx, cam); sala(ctx, t, { tv: { pantalla: 'imagen', brillo: 0.2 }, nino: { sonrie: 1, mira: 1 }, abuela: { sonrie: 1, pecho: true } }); ctx.restore(); }
  else { const sc = tvPunto(TX, FY, TS), cam = camK(t, [[tb, sc[0], sc[1] - 70, 2.3], [S(21), sc[0], sc[1] - 70, 2.15]]), d = t - tb, p = d < 0.9 ? d / 0.9 * 0.35 : (0.35 + (d - 0.9) * 2.2) % 1; ctx.save(); zoomP(ctx, cam); sala(ctx, t, { tv: { pantalla: 'barrido', p, nL: d < 0.9 ? 14 : 80, lineas: d < 0.9, rPunto: d < 0.9 ? 12 : 7 }, nino: false, abuela: false }); ctx.restore(); }
  TAG(ctx, 'UN SOLO PUNTITO', 470, 520, t, Tk.puntito - 0.3, S(21), { mono: true, col: '#ffffff', px: 60 });
 }, sfx(k) { k.tone(S(20), { f: 'E4', dur: 1.5, gain: 0.04, verb: 0.5 }); k.play('whoosh', Tk.puntito - 0.4, { dur: 0.3, top: 2000, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.puntito - 0.3); for (let x = Tk.puntito + 0.6; x < S(21); x += 0.05) k.play('tick', x, { f: 1500, gain: 0.05, minor: true }); } });

 // ---------- 21 · nunca lo abras; → el televisor por detrás, con una X roja y el rayo de peligro ----------
 B.push({ t0: S(21), t1: S(22), in: { type: 'cut' }, draw(ctx, t) {
  const cam = camK(t, [[S(21), 540, 1080, 1.0], [S(22), 540, 1070, 1.06]]); ctx.save(); zoomP(ctx, cam); salaFondo(ctx, t, { fy: FY }); tvAtras(ctx, t, 520, FY, 1.32); ctx.restore();
  marcaX(ctx, 520, 900, 300, sm(S(21), S(21) + 0.25, t)); TAG(ctx, 'NUNCA LO ABRAS', 470, 520, t, Tk.abras - 0.3, S(22), { mono: true, col: RD, px: 62 });
 }, sfx(k) { k.play('error', Tk.abras, { f: 'C3', gain: 0.3 }); k.play('thud', Tk.abras, { f: 80, gain: 0.5 }); FX.etiqueta(k, Tk.abras - 0.3); } });

 // ---------- 22 · aun desconectado puede guardar electricidad peligrosa. → enchufe fuera y, dentro, la carga que queda (rayo) → FINAL: la pantalla se apaga en un puntito ----------
 B.push({ t0: S(22), t1: S(23), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const tb = Tk.peligrosa + 0.15;
  if (t < tb) { const cam = camK(t, [[S(22), 540, 1060, 1.1], [tb, 540, 1060, 1.0]]); ctx.save(); zoomP(ctx, cam); salaFondo(ctx, t, { fy: FY }); tvLado(ctx, t, 600, FY, 1.3, { rx: 0.9 }); ctx.strokeStyle = '#222'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(250, FY - 140); ctx.quadraticCurveTo(160, FY + 40, 110, FY + 60); ctx.stroke(); ctx.fillStyle = '#222'; ctx.fillRect(60, FY + 40, 60, 36); ctx.fillStyle = '#c9a24a'; ctx.fillRect(36, FY + 46, 26, 7); ctx.fillRect(36, FY + 62, 26, 7);
    const R = H.rng(Math.floor(t * 20)), cx = 600 + 1.3 * 0.6 * 60, cy = FY - 1.3 * (70 + TVH / 2) - 1.3 * 0.6 * 180; P.glow(ctx, cx, cy, 160, '255,220,80', 0.5 + 0.3 * Math.sin(t * 20)); ctx.strokeStyle = YE; ctx.lineWidth = 6; for (let j = 0; j < 4; j++) { let a = R() * TAU, px = cx, py = cy; ctx.beginPath(); ctx.moveTo(px, py); for (let s = 0; s < 5; s++) { px += Math.cos(a) * 26; py += Math.sin(a) * 26; a += (R() - 0.5) * 1.4; ctx.lineTo(px, py); } ctx.stroke(); } ctx.restore();
   const a = sm(Tk.desconectado - 0.2, Tk.desconectado + 0.2, t); if (a > 0) P.icon(ctx, 'rayo', 820, 760, 170 * E.out(a), { mode: 'flat', col: YE, col2: '#1b1b1e' }); TAG(ctx, 'PELIGRO', 470, 520, t, Tk.desconectado - 0.2, tb, { mono: true, col: RD, px: 66 }); }
  else { const sc = tvPunto(TX, FY, TS), cam = camK(t, [[tb, 520, 1040, 1.18], [S(23), 520, 1030, 1.24]]), q = cl((t - tb) / 0.7), sy = Math.max(0.006, 1 - E.in(Math.min(1, q * 1.6))), sx = q < 0.6 ? 1 : Math.max(0.012, 1 - E.in((q - 0.6) / 0.4)), fade = 1 - sm(tb + 0.7, S(23), t);
   ctx.save(); zoomP(ctx, cam); sala(ctx, t, { tv: { pantalla: (c, x, y, w, h) => { c.fillStyle = '#05070a'; c.fillRect(x, y, w, h); c.save(); c.translate(x + w / 2, y + h / 2); c.scale(sx, sy); c.translate(-(x + w / 2), -(y + h / 2)); imagen(c, x, y, w, h); c.restore(); if (q >= 0.6) { P.glow(c, x + w / 2, y + h / 2, 90, '255,255,255', fade); c.fillStyle = `rgba(255,255,255,${fade})`; c.beginPath(); c.arc(x + w / 2, y + h / 2, 6, 0, TAU); c.fill(); } }, brillo: 0.15 * fade }, nino: { sonrie: 0.6 }, abuela: { sonrie: 0.8 } }); ctx.restore(); }
 }, sfx(k) { k.noise(S(22), { dur: Tk.peligrosa + 0.15 - S(22), filter: 'highpass', f: 4000, gain: 0.06, a: 0.05 }); for (let i = 0; i < 6; i++) k.tone(Tk.desconectado + i * 0.3, { f: 300 + 80 * (i % 3), type: 'square', dur: 0.04, gain: 0.04 }); FX.etiqueta(k, Tk.desconectado - 0.2); const tb = Tk.peligrosa + 0.15; k.tone(tb, { f: [[0, 900], [0.6, 120]], type: 'sine', dur: 0.7, gain: 0.08 }); k.play('pop', tb + 0.5, { f: 900, gain: 0.2, minor: true }); } });

 // ---------- 23 · CIERRE ----------
 B.push({ t0: S(23), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#8a5428'); g.addColorStop(1, '#3a200c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  P.ctaShare(ctx, t, S(23) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { salaFondo(cc, t, { fy: 1500 }); televisor(cc, t, 540, 1500, 1.3, { pantalla: 'imagen' }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(23) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'cartoon', capBorde: true, marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: [],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 300, gain: 0.02, a: 0.05, hold: DURATION - 2.5 }); },
  music(k) { MUS.piano(k, 0, DURATION, { bpm: 88, gain: 0.5, strings: 0.6, chords: [['D3', 'A3', 'D4', 'F4'], ['A#2', 'F3', 'A#3', 'D4'], ['F2', 'C3', 'F3', 'A3'], ['C3', 'G3', 'C4', 'E4']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
