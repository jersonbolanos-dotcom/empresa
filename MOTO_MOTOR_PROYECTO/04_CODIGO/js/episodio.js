// =====================================================================================================
// episodio.js — ¿Qué pasa dentro del motor de una moto? · PLANTILLA ASOMBROTECA v1.41 · «cartoon» (ciudad de montaña al atardecer)
// UN solo vídeo con UN gancho (v1.34): el B («Entre tus piernas… hay una máquina que explota sin parar»), en primera persona
// (vista desde los ojos del conductor: tablero, manos, tanque y motor entre las piernas). Voz: ElevenLabs Eleven v4, Dan, UNA toma
// (936 caracteres, 66,4 s) + [QUITAR] «Ahora, el dato.» + [PAUSA 0.6] antes de «A unas seis mil…» → 64,43 s, voz intacta.
// Metáfora sostenida: RESPIRAR (aspira, aprieta, explota, sopla; las válvulas como una nariz) y, para biela y cigüeñal, las
// piernas pedaleando una bicicleta. Dato: a unas seis mil vueltas por minuto, una explosión cada dos vueltas → 50 por segundo.
// Dirección visual: el motor en corte / «rayos X» es el centro (cilindro, pistón, dos válvulas, bujía y chispa, explosión naranja,
// biela, cigüeñal, cadena); los cuatro tiempos con etiqueta grande; cámara lenta y luego zumbido; golpes en la palabra fuerte;
// el conductor y la gente de la calle con vida. Moto, ciudad y personas dibujadas, genéricas, sin marcas ni logos.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, DURATION, txt } = K;
 const S = (i) => A.segments[i].s;
 const YE = '#ffd23f', RD = '#ff4d5e', GR = '#22d27a', CY = '#8fd8ff', NAR = '#ff9f43', AZ = '#3ea8ff', MEZ = '120,200,255';
 const PORTADA = typeof window !== 'undefined' && !!window.__SIN_SUBTITULOS;
 const Tk = {
  explota: wt(1, 'explota'), sin: wt(1, 'sin'), parar: wt(1, 'parar.'), dentro: wt(2, 'dentro?'), asombroso: wt(3, 'asombroso'), respira: wt(4, 'respira,'), cuatro: wt(6, 'cuatro'),
  valvulas: wt(7, 'válvulas'), nariz: wt(7, 'nariz.'), uno: wt(8, 'Uno:'), aspira: wt(9, 'aspira.'), gasolina: wt(10, 'gasolina.'), dos: wt(11, 'Dos:'), aprieta: wt(12, 'aprieta.'), comprime: wt(13, 'comprime.'),
  tres: wt(14, 'Tres:'), bujia: wt(15, 'bujía'), chispa: wt(15, 'chispa…'), explota2: wt(16, 'explota.'), empuja: wt(17, 'empuja'), abajo: wt(17, 'abajo.'), cuatro2: wt(18, 'Cuatro:'), sopla: wt(19, 'sopla.'), escape: wt(20, 'escape.'),
  biela: wt(21, 'biela'), giro: wt(21, 'giro,'), pedales: wt(22, 'pedales'), cadena: wt(23, 'cadena'), rueda: wt(23, 'rueda'), seis: wt(24, 'seis'), minuto: wt(24, 'minuto,'), cadaDos: wt(24, 'dos'),
  cincuenta: wt(25, 'cincuenta'), segundo: wt(25, 'segundo.'), tresMil: wt(26, 'Tres'), minuto2: wt(27, 'minuto.'), cincuenta2: wt(28, 'Cincuenta'), trabajo: wt(29, 'trabajo,'), pedido: wt(29, 'pedido'), casa: wt(29, 'casa.'),
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

 // ---------- CIUDAD DE MONTAÑA AL ATARDECER (calle que pasa; off = desplazamiento de la calle) ----------
 const ciudad = (ctx, t, o = {}) => { const fy = o.fy ?? 1250, off = o.off || 0;
  const g = ctx.createLinearGradient(0, -400, 0, fy); g.addColorStop(0, '#5b6fc4'); g.addColorStop(0.55, '#f2a46b'); g.addColorStop(1, '#ffd59a'); ctx.fillStyle = g; ctx.fillRect(-900, -900, W + 1800, fy + 900);
  ctx.fillStyle = '#ffe6a0'; ctx.beginPath(); ctx.arc(780, fy - 520, 70, 0, TAU); ctx.fill();
  for (const [c, h, k, sp] of [['#8a86b8', 520, 0.004, 0.05], ['#5f7a8a', 400, 0.007, 0.12], ['#4b6a52', 290, 0.011, 0.2]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-900, fy); for (let x = -900; x <= W + 900; x += 30) ctx.lineTo(x, fy - h + 70 * Math.sin((x + off * sp) * k) + 40 * Math.sin((x + off * sp) * k * 2.7 + 1)); ctx.lineTo(W + 900, fy); ctx.closePath(); ctx.fill(); }
  // casas de colores con balcones (paralaje)
  const cols = ['#e2a32b', '#c8553d', '#2f6db5', '#5f9a4e', '#e6c9a0', '#b8452f', '#7a6fb8'], cw = 200, o2 = ((off * 0.6) % (cw * 7) + cw * 7) % (cw * 7);
  for (let i = -6; i < 13; i++) { const x = i * cw - o2, k = ((i % 7) + 7) % 7, hh = 230 + (k % 3) * 50; ctx.fillStyle = cols[k]; ctx.fillRect(x, fy - hh, cw - 6, hh); ctx.fillStyle = '#7a3a22'; ctx.beginPath(); ctx.moveTo(x - 10, fy - hh); ctx.lineTo(x + cw / 2, fy - hh - 40); ctx.lineTo(x + cw + 4, fy - hh); ctx.closePath(); ctx.fill();
   ctx.fillStyle = 'rgba(30,30,50,0.55)'; ctx.fillRect(x + 30, fy - hh + 40, 46, 56); ctx.fillRect(x + 118, fy - hh + 40, 46, 56); ctx.fillStyle = '#5a3418'; ctx.fillRect(x + 76, fy - 100, 46, 100); ctx.fillStyle = 'rgba(255,220,140,0.55)'; ctx.fillRect(x + 30, fy - hh + 40, 46, 20);
   ctx.strokeStyle = '#3a2a22'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 20, fy - hh + 110); ctx.lineTo(x + cw - 26, fy - hh + 110); ctx.stroke(); for (let b = x + 26; b < x + cw - 26; b += 16) { ctx.beginPath(); ctx.moveTo(b, fy - hh + 110); ctx.lineTo(b, fy - hh + 132); ctx.stroke(); } }
  // cables y postes
  const po = ((off * 0.8) % 600 + 600) % 600; ctx.strokeStyle = '#3a3a44'; ctx.lineWidth = 3; for (let i = -2; i < 4; i++) { const x = i * 600 - po; ctx.fillStyle = '#4a4a52'; ctx.fillRect(x - 6, fy - 520, 12, 520); ctx.beginPath(); ctx.moveTo(x, fy - 500); ctx.quadraticCurveTo(x + 300, fy - 430, x + 600, fy - 500); ctx.moveTo(x, fy - 470); ctx.quadraticCurveTo(x + 300, fy - 400, x + 600, fy - 470); ctx.stroke(); ctx.fillStyle = '#fff2b0'; ctx.beginPath(); ctx.arc(x + 20, fy - 515, 9, 0, TAU); ctx.fill(); }
  // andén y calle
  ctx.fillStyle = '#b8b0a2'; ctx.fillRect(-900, fy, W + 1800, 50); ctx.fillStyle = '#8a8276'; ctx.fillRect(-900, fy + 50, W + 1800, 10);
  ctx.fillStyle = '#4a4a50'; ctx.fillRect(-900, fy + 60, W + 1800, 1400); const lo = ((off) % 220 + 220) % 220; ctx.fillStyle = '#f2f2f2'; for (let x = -900 - lo; x < W + 900; x += 220) ctx.fillRect(x, fy + 250, 120, 14);
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let x = -900 - ((off * 1.0) % 90); x < W + 900; x += 90) ctx.fillRect(x, fy + 60, 3, 1400); };

 // ---------- MOTOR EN CORTE («rayos X»): cilindro, pistón, dos válvulas, bujía, biela, cigüeñal. phi = ángulo del ciclo (0..4π) ----------
 // 0..π ADMISIÓN (baja, entra mezcla) · π..2π COMPRESIÓN (sube) · 2π..3π EXPLOSIÓN (baja) · 3π..4π ESCAPE (sube). Chispa en phi = 2π.
 const CR = 70, CL = 210;
 const tiempo = (phi) => { const f = ((phi % (4 * Math.PI)) + 4 * Math.PI) % (4 * Math.PI); return Math.floor(f / Math.PI); };
 const motorRX = (ctx, t, x, y, s, o = {}) => { const phi = o.phi || 0, f = ((phi % (4 * Math.PI)) + 4 * Math.PI) % (4 * Math.PI), th = phi, st = Math.floor(f / Math.PI), u = (f % Math.PI) / Math.PI;
  const pinY = -(CR * Math.cos(th) + Math.sqrt(CL * CL - CR * CR * Math.sin(th) ** 2)), cpx = CR * Math.sin(th), cpy = -CR * Math.cos(th), pTop = pinY - 50, HEAD = -420;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // cárter y cilindro (paredes)
  ctx.fillStyle = '#0e2448'; ctx.beginPath(); ctx.roundRect(-170, -70, 340, 230, 60); ctx.fill(); ctx.fillRect(-82, HEAD, 164, -HEAD - 60);
  ctx.strokeStyle = '#bfe0f5'; ctx.lineWidth = 12; ctx.beginPath(); ctx.roundRect(-170, -70, 340, 230, 60); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-88, HEAD); ctx.lineTo(-88, -70); ctx.moveTo(88, HEAD); ctx.lineTo(88, -70); ctx.stroke();
  ctx.strokeStyle = 'rgba(191,224,245,0.35)'; ctx.lineWidth = 6; for (let k = 0; k < 6; k++) { const yy = HEAD + 40 + k * 50; ctx.beginPath(); ctx.moveTo(-88, yy); ctx.lineTo(-130, yy); ctx.moveTo(88, yy); ctx.lineTo(130, yy); ctx.stroke(); }
  // culata, puertos y válvulas
  const lvA = st === 0 ? Math.sin(u * Math.PI) : 0, lvE = st === 3 ? Math.sin(u * Math.PI) : 0;
  ctx.fillStyle = '#123058'; ctx.beginPath(); ctx.moveTo(-150, HEAD); ctx.lineTo(150, HEAD); ctx.lineTo(150, HEAD - 110); ctx.lineTo(-150, HEAD - 110); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#bfe0f5'; ctx.lineWidth = 12; ctx.strokeRect(-150, HEAD - 110, 300, 110);
  ctx.fillStyle = o.portCol || 'rgba(120,200,255,0.35)'; ctx.beginPath(); ctx.moveTo(-60, HEAD); ctx.lineTo(-20, HEAD); ctx.lineTo(-150, HEAD - 90); ctx.lineTo(-230, HEAD - 90); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(150,150,160,0.4)'; ctx.beginPath(); ctx.moveTo(20, HEAD); ctx.lineTo(60, HEAD); ctx.lineTo(230, HEAD - 90); ctx.lineTo(150, HEAD - 90); ctx.closePath(); ctx.fill();
  for (const [vx, lv, col] of [[-42, lvA, '#7ad0ff'], [42, lvE, '#c9ced8']]) { const dy = 26 * lv; ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(vx, HEAD - 150 + dy); ctx.lineTo(vx, HEAD + dy); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(vx - 30, HEAD - 6 + dy, 60, 14, 6); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 4; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(vx - 16, HEAD - 140 + dy + k * 12); ctx.lineTo(vx + 16, HEAD - 134 + dy + k * 12); ctx.stroke(); } if (o.marcaValvulas) { ctx.strokeStyle = YE; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(vx, HEAD - 2 + dy, 40, 0, TAU); ctx.stroke(); } }
  // mezcla / explosión / humo en la cámara
  ctx.save(); ctx.beginPath(); ctx.rect(-82, HEAD + 8, 164, pTop - HEAD - 8); ctx.clip(); const vol = pTop - HEAD, R = H.rng(7);
  if (st === 0 || st === 1) { const dens = st === 1 ? lerp(0.45, 0.85, u) : 0.45; ctx.fillStyle = `rgba(${MEZ},${dens * 0.55})`; ctx.fillRect(-82, HEAD, 164, vol + 10); ctx.fillStyle = `rgba(200,240,255,${dens})`; for (let i = 0; i < 26; i++) { const bx = -70 + R() * 140, by = HEAD + 10 + R() * (vol - 14) + 6 * Math.sin(t * 6 + i); ctx.beginPath(); ctx.arc(bx, by, 4 + 2 * dens, 0, TAU); ctx.fill(); } }
  else if (st === 2) { const k = 1 - u * 0.75, g = ctx.createRadialGradient(0, HEAD + 10, 4, 0, HEAD + 20, 160); g.addColorStop(0, `rgba(255,250,200,${k})`); g.addColorStop(0.35, `rgba(255,160,40,${k})`); g.addColorStop(1, `rgba(200,60,20,${0.8 * k})`); ctx.fillStyle = g; ctx.fillRect(-82, HEAD, 164, vol + 10); }
  else { ctx.fillStyle = 'rgba(120,120,130,0.55)'; ctx.fillRect(-82, HEAD, 164, vol + 10); ctx.fillStyle = 'rgba(200,200,205,0.7)'; for (let i = 0; i < 18; i++) { const bx = -70 + R() * 140, by = HEAD + 10 + R() * (vol - 14); ctx.beginPath(); ctx.arc(bx + 20 * u, by - 30 * u, 7, 0, TAU); ctx.fill(); } }
  ctx.restore();
  // flujo por los puertos
  if (lvA > 0.1) { ctx.fillStyle = 'rgba(200,240,255,0.9)'; for (let i = 0; i < 8; i++) { const q = ((t * 1.8 + i / 8) % 1); ctx.beginPath(); ctx.arc(lerp(-200, -40, q), lerp(HEAD - 80, HEAD + 10, q), 6, 0, TAU); ctx.fill(); } }
  if (lvE > 0.1) { ctx.fillStyle = 'rgba(190,190,200,0.85)'; for (let i = 0; i < 8; i++) { const q = ((t * 1.8 + i / 8) % 1); ctx.beginPath(); ctx.arc(lerp(40, 210, q), lerp(HEAD + 10, HEAD - 80, q), 8, 0, TAU); ctx.fill(); } }
  // bujía
  ctx.fillStyle = '#f2f2f2'; ctx.fillRect(-18, HEAD - 210, 36, 90); ctx.fillStyle = '#9aa3b2'; ctx.fillRect(-24, HEAD - 124, 48, 30); ctx.fillStyle = '#c9a24a'; ctx.fillRect(-8, HEAD - 96, 16, 90);
  const sp = o.chispa ?? (f > 2 * Math.PI - 0.15 && f < 2 * Math.PI + 0.35 ? 1 : 0); if (sp > 0) { P.glow(ctx, 0, HEAD - 2, 70, '255,240,120', sp); ctx.strokeStyle = `rgba(255,255,180,${sp})`; ctx.lineWidth = 5; const R2 = H.rng(Math.floor(t * 40)); for (let j = 0; j < 5; j++) { let a = R2() * TAU, px = 0, py = HEAD - 4; ctx.beginPath(); ctx.moveTo(px, py); for (let q = 0; q < 3; q++) { px += Math.cos(a) * 12; py += Math.sin(a) * 12; a += (R2() - 0.5); ctx.lineTo(px, py); } ctx.stroke(); } }
  if (o.marcaBujia) { ctx.strokeStyle = YE; ctx.lineWidth = 6; ctx.strokeRect(-40, HEAD - 220, 80, 230); }
  // pistón, biela, cigüeñal
  ctx.fillStyle = '#c7d0dc'; ctx.beginPath(); ctx.roundRect(-78, pTop, 156, 92, 10); ctx.fill(); ctx.strokeStyle = '#7d8896'; ctx.lineWidth = 4; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-78, pTop + 12 + k * 10); ctx.lineTo(78, pTop + 12 + k * 10); ctx.stroke(); }
  if (o.marcaPiston) { ctx.strokeStyle = YE; ctx.lineWidth = 6; ctx.strokeRect(-92, pTop - 12, 184, 116); }
  ctx.save(); ctx.translate(0, 0); ctx.rotate(th); ctx.fillStyle = '#6b7280'; ctx.beginPath(); ctx.arc(0, 0, 105, 0, TAU); ctx.fill(); ctx.fillStyle = '#4a5260'; ctx.beginPath(); ctx.arc(0, 0, 100, Math.PI * 0.15, Math.PI * 0.85); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.strokeStyle = '#d7dee8'; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, pinY); ctx.lineTo(cpx, cpy); ctx.stroke(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, pinY, 14, 0, TAU); ctx.fill(); ctx.fillStyle = '#c9a24a'; ctx.beginPath(); ctx.arc(cpx, cpy, 18, 0, TAU); ctx.fill(); ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill();
  if (o.marcaBiela) { ctx.strokeStyle = YE; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 130, 0, TAU); ctx.stroke(); }
  // flecha de empuje
  if (o.empuje) { ctx.save(); ctx.globalAlpha = o.empuje; flecha(ctx, 0, pTop - 10, 0, pTop + 120, NAR, 22); ctx.restore(); }
  ctx.restore(); return { st, f, pinY, pTop }; };
 const fasePhi = (t, t0, vel) => (t - t0) * vel;   // vel en rad/s

 // ---------- BOLA DE FUEGO HACIA LA CÁMARA (k = 0..1; con k = 1 llena ~90 % del ancho) ----------
 const bolaFuego = (ctx, t, x, y, k, o = {}) => { if (k <= 0) return; ctx.save(); const r = 30 + (o.rad || 540) * k, g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,230,1)'); g.addColorStop(0.3, 'rgba(255,215,90,0.98)'); g.addColorStop(0.6, 'rgba(255,130,30,0.92)'); g.addColorStop(0.85, 'rgba(200,60,20,0.6)'); g.addColorStop(1, 'rgba(120,30,10,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  const R = H.rng(o.seed || 9); for (let i = 0; i < 26; i++) { const a = R() * TAU, d = r * (0.55 + 0.4 * R()), rr = r * (0.15 + 0.15 * R()); ctx.fillStyle = i % 2 ? 'rgba(255,170,50,0.85)' : 'rgba(255,110,30,0.8)'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, rr, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,240,180,0.95)'; ctx.lineCap = 'round'; for (let i = 0; i < 30; i++) { const a = R() * TAU, d0 = r * 0.7, d1 = r * (1 + 0.4 * R()); ctx.lineWidth = 3 + 5 * R(); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * d0, y + Math.sin(a) * d0); ctx.lineTo(x + Math.cos(a) * d1, y + Math.sin(a) * d1); ctx.stroke(); } ctx.restore(); };

 // ---------- MOTO DE LADO (y = suelo; mira a la derecha), con conductor, caja de domicilios, humo, cadena; rx = motor en rayos X ----------
 const rueda = (ctx, x, y, r, a) => { ctx.fillStyle = '#1b1b1e'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.arc(x, y, r * 0.72, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a2d33'; ctx.beginPath(); ctx.arc(x, y, r * 0.64, 0, TAU); ctx.fill(); ctx.strokeStyle = '#c9ced8'; ctx.lineWidth = 4; for (let i = 0; i < 12; i++) { const b = a + i * TAU / 12; ctx.beginPath(); ctx.moveTo(x + Math.cos(b) * r * 0.12, y + Math.sin(b) * r * 0.12); ctx.lineTo(x + Math.cos(b) * r * 0.66, y + Math.sin(b) * r * 0.66); ctx.stroke(); } ctx.fillStyle = '#c9ced8'; ctx.beginPath(); ctx.arc(x, y, r * 0.14, 0, TAU); ctx.fill(); };
 const piloto = (ctx, t, o = {}) => { const bob = 3 * Math.sin(t * 7), jc = o.chaqueta || '#2f6db5';
  ctx.strokeStyle = '#2c3a5a'; ctx.lineWidth = 38; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-110, -380); ctx.lineTo(30, -330); ctx.lineTo(-10, -205); ctx.stroke(); ctx.fillStyle = '#1b1b1e'; ctx.beginPath(); ctx.ellipse(0, -195, 30, 14, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = jc; ctx.beginPath(); ctx.moveTo(-150, -390); ctx.lineTo(-70, -385); ctx.lineTo(-20, -590 + bob); ctx.lineTo(-110, -610 + bob); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillRect(-120, -520 + bob, 70, 10);
  ctx.strokeStyle = jc; ctx.lineWidth = 32; ctx.beginPath(); ctx.moveTo(-50, -570 + bob); ctx.lineTo(70, -500); ctx.lineTo(150, -470); ctx.stroke(); ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(152, -470, 20, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(-55, -650 + bob); ctx.rotate(o.giraCabeza || 0); ctx.fillStyle = o.casco || '#e8463c'; ctx.beginPath(); ctx.arc(0, 0, 62, Math.PI * 0.85, Math.PI * 2.35); ctx.lineTo(48, 44); ctx.lineTo(-40, 48); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#1e2a3a'; ctx.beginPath(); ctx.moveTo(10, -26); ctx.quadraticCurveTo(66, -14, 62, 22); ctx.lineTo(18, 22); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(26, -18, 22, 6); ctx.restore(); };
 const moto = (ctx, t, x, y, s, o = {}) => { const ra = (o.rueda ?? t * 9), vib = (o.vibra ?? 1) * 2 * Math.sin(t * 90); ctx.save(); ctx.translate(x, y); ctx.scale(o.espejo ? -s : s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 6, 360, 18, 0, 0, TAU); ctx.fill();
  ctx.translate(0, vib);
  // caja de domicilios (sin logo)
  if (o.caja !== false) { ctx.fillStyle = '#e2a32b'; ctx.beginPath(); ctx.roundRect(-380, -560, 170, 160, 12); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(-380, -500, 170, 10); ctx.fillStyle = '#3a3a44'; ctx.fillRect(-330, -400, 70, 30); }
  rueda(ctx, -260, -125, 125, ra); rueda(ctx, 270, -125, 125, ra);
  // chasis, horquilla, guardabarros
  ctx.strokeStyle = '#2a2d33'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-260, -125); ctx.lineTo(-80, -230); ctx.lineTo(160, -400); ctx.moveTo(-260, -125); ctx.lineTo(-160, -360); ctx.lineTo(-40, -370); ctx.stroke(); ctx.strokeStyle = '#9aa3b2'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(185, -470); ctx.lineTo(270, -125); ctx.stroke();
  ctx.fillStyle = '#b8452f'; ctx.beginPath(); ctx.arc(270, -130, 150, Math.PI * 1.1, Math.PI * 1.55); ctx.lineTo(270, -130); ctx.closePath(); ctx.fill();
  // tubo de escape y humo
  ctx.strokeStyle = '#7d848f'; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(70, -250); ctx.quadraticCurveTo(60, -130, -60, -140); ctx.lineTo(-300, -170); ctx.stroke(); ctx.fillStyle = '#5a6068'; ctx.beginPath(); ctx.roundRect(-340, -200, 150, 46, 18); ctx.fill();
  if (o.humo !== false) { const hk = o.humo ?? 0.7; ctx.save(); ctx.scale(o.espejo ? -1 : 1, 1); for (let i = 0; i < 9; i++) { const ph = ((t * 1.3 + i / 9) % 1), hx = (o.espejo ? 1 : -1) * (350 + ph * 260 * Math.max(1, hk)), hy = -180 - ph * 90 + 10 * Math.sin(t * 3 + i); ctx.globalAlpha = hk * (1 - ph) * 0.7; ctx.fillStyle = '#d9d9de'; ctx.beginPath(); ctx.arc(hx, hy, (14 + 40 * ph) * Math.max(1, hk), 0, TAU); ctx.fill(); } ctx.restore(); ctx.globalAlpha = 1; }
  // cadena
  ctx.strokeStyle = '#5a5f68'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-40, -195); ctx.lineTo(-260, -170); ctx.moveTo(-40, -150); ctx.lineTo(-260, -80); ctx.stroke(); ctx.fillStyle = '#c9ced8'; for (let i = 0; i < 8; i++) { const q = ((ra * 0.1 + i / 8) % 1); ctx.beginPath(); ctx.arc(lerp(-40, -260, q), lerp(-195, -170, q), 4, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#7d848f'; ctx.beginPath(); ctx.arc(-40, -172, 26, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(-260, -125, 52, 0, TAU); ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1;
  // motor (bloque + cilindro con aletas)
  ctx.fillStyle = '#6b7280'; ctx.beginPath(); ctx.roundRect(-110, -270, 190, 140, 34); ctx.fill(); ctx.save(); ctx.translate(20, -270); ctx.rotate(0.35); ctx.fillStyle = '#8a929e'; ctx.fillRect(-44, -150, 88, 150); ctx.fillStyle = '#5f6670'; for (let k = 0; k < 7; k++) ctx.fillRect(-58, -146 + k * 20, 116, 8); ctx.restore();
  // tanque, asiento, tablero, faro, manubrio
  ctx.fillStyle = '#c8553d'; ctx.beginPath(); ctx.moveTo(-40, -380); ctx.quadraticCurveTo(40, -470, 160, -420); ctx.lineTo(150, -360); ctx.quadraticCurveTo(50, -340, -40, -350); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(50, -420, 50, 10, -0.2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1e1e22'; ctx.beginPath(); ctx.roundRect(-210, -390, 190, 36, 16); ctx.fill();
  ctx.fillStyle = '#2a2d33'; ctx.beginPath(); ctx.arc(205, -440, 34, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff6c8'; ctx.beginPath(); ctx.arc(222, -440, 22, -1.2, 1.2); ctx.fill(); if (o.luz) P.glow(ctx, 240, -440, 160, '255,240,180', o.luz);
  ctx.strokeStyle = '#1e1e22'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(185, -470); ctx.lineTo(150, -500); ctx.stroke();
  if (o.piloto !== false) piloto(ctx, t, o.pilotoO || {});
  if (o.rx) { const R = o.rxR || 170; ctx.save(); ctx.globalAlpha = o.rx; ctx.fillStyle = '#0b1d3a'; ctx.beginPath(); ctx.arc(-10, -260, R, 0, TAU); ctx.fill(); ctx.strokeStyle = CY; ctx.lineWidth = 6; ctx.stroke(); ctx.beginPath(); ctx.arc(-10, -260, R - 4, 0, TAU); ctx.clip(); ctx.translate(-10, -260 + 60 * R / 170); ctx.rotate(0.3); motorRX(ctx, t, 0, 0, 0.32 * R / 170, { phi: o.phi ?? t * 14 }); ctx.restore(); if (o.latido) { P.glow(ctx, -10, -280, R + 30, '255,150,40', o.latido); } }
  ctx.restore(); };

 // ---------- VISTA DESDE LOS OJOS DEL CONDUCTOR: la calle adelante, tablero, manos, tanque y motor entre las piernas ----------
 // ---------- GUANTE AGARRANDO EL PUÑO DEL MANUBRIO (vista del conductor). gas 0..1 = la muñeca gira el acelerador hacia atrás ----------
 const guante = (ctx, t, x, y, izq, gas) => { ctx.save(); ctx.translate(x, y); ctx.scale(izq ? -1.25 : 1.25, 1.25); ctx.rotate(0.3);
  // antebrazo (manga de la chaqueta) que baja hacia el conductor
  ctx.fillStyle = '#2f6db5'; ctx.beginPath(); ctx.moveTo(-40, 50); ctx.lineTo(70, 40); ctx.lineTo(330, 520); ctx.lineTo(120, 560); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(-10, 120, 150, 14);
  // puño de goma (estrías que se desplazan al girar el acelerador)
  ctx.fillStyle = '#18181b'; ctx.beginPath(); ctx.roundRect(-150, -30, 300, 60, 26); ctx.fill(); ctx.strokeStyle = '#34343a'; ctx.lineWidth = 5; const ph = gas * 26; for (let i = -6; i <= 6; i++) { const yy = ((i * 9 + ph) % 54 + 54) % 54 - 27; ctx.beginPath(); ctx.moveTo(-148, yy); ctx.lineTo(-100, yy); ctx.moveTo(100, yy); ctx.lineTo(148, yy); ctx.stroke(); }
  // la mano gira con el puño
  ctx.rotate(-0.28 * gas); ctx.translate(0, 6 * gas);
  ctx.fillStyle = '#3a3a42'; ctx.beginPath(); ctx.roundRect(-62, 30, 124, 70, 18); ctx.fill(); ctx.fillStyle = '#d9a03a'; ctx.fillRect(-62, 52, 124, 14);   // puño del guante (muñequera)
  ctx.fillStyle = '#2b2b31'; ctx.beginPath(); ctx.ellipse(0, 4, 96, 62, 0, 0, TAU); ctx.fill();   // dorso
  ctx.fillStyle = '#2b2b31'; ctx.beginPath(); ctx.ellipse(-92, 26, 30, 44, 0.6, 0, TAU); ctx.fill();   // pulgar por debajo
  for (let i = 0; i < 4; i++) { const fx = -66 + i * 44, fy = -46 - (i === 1 || i === 2 ? 6 : 0); ctx.fillStyle = '#26262b'; ctx.beginPath(); ctx.roundRect(fx - 20, fy - 22, 40, 52, 18); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.beginPath(); ctx.ellipse(fx, fy - 6, 12, 7, 0, 0, TAU); ctx.fill(); }   // dedos que envuelven el puño
  ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.ellipse(-10, 0, 60, 26, -0.1, 0, TAU); ctx.fill(); ctx.fillStyle = '#4a4a52'; ctx.beginPath(); ctx.roundRect(-40, -8, 80, 22, 10); ctx.fill();   // refuerzo de nudillos
  ctx.restore(); };
 const pov = (ctx, t, o = {}) => { const off = t * 900, vib = 3 * Math.sin(t * 70);
  ctx.save(); ctx.translate(vib * 0.5, vib);
  // calle hacia delante (perspectiva)
  const hy = 760; const g = ctx.createLinearGradient(0, 0, 0, hy); g.addColorStop(0, '#6a7fd0'); g.addColorStop(1, '#ffc98a'); ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, hy + 100);
  ctx.fillStyle = '#5f7a8a'; ctx.beginPath(); ctx.moveTo(-100, hy); for (let x = -100; x <= W + 100; x += 40) ctx.lineTo(x, hy - 90 - 50 * Math.sin(x * 0.008 + 1)); ctx.lineTo(W + 100, hy); ctx.closePath(); ctx.fill();
  const cols = ['#e2a32b', '#c8553d', '#2f6db5', '#5f9a4e', '#b8452f']; for (const sd of [-1, 1]) for (let i = 0; i < 7; i++) { const d = ((i / 7 + t * 0.6) % 1), z = d * d, xx = 540 + sd * (60 + 700 * z), hh = 60 + 520 * z, ww = 40 + 380 * z; ctx.fillStyle = cols[(i + (sd > 0 ? 2 : 0)) % 5]; ctx.fillRect(sd < 0 ? xx - ww : xx, hy + 10 * z - hh, ww, hh); ctx.fillStyle = 'rgba(30,30,50,0.45)'; ctx.fillRect((sd < 0 ? xx - ww : xx) + ww * 0.2, hy - hh * 0.8, ww * 0.25, hh * 0.25); }
  ctx.fillStyle = '#4a4a50'; ctx.beginPath(); ctx.moveTo(480, hy); ctx.lineTo(600, hy); ctx.lineTo(W + 300, HH); ctx.lineTo(-300, HH); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f2f2f2'; for (let i = 0; i < 6; i++) { const d = ((i / 6 + t * 1.6) % 1), z = d * d, yy = hy + 600 * z, w = 6 + 40 * z, h = 10 + 120 * z; ctx.fillRect(540 - w / 2, yy, w, h); }
  // tablero y manubrio
  ctx.fillStyle = '#1e1e22'; ctx.beginPath(); ctx.moveTo(-20, 1010); ctx.quadraticCurveTo(540, 900, W + 20, 1010); ctx.lineTo(W + 20, 1060); ctx.quadraticCurveTo(540, 950, -20, 1060); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2a2d33'; ctx.beginPath(); ctx.arc(540, 940, 120, 0, TAU); ctx.fill(); ctx.fillStyle = '#0f1218'; ctx.beginPath(); ctx.arc(540, 940, 100, 0, TAU); ctx.fill(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.8 + 1.4 * i / 10); ctx.beginPath(); ctx.moveTo(540 + Math.cos(a) * 80, 940 + Math.sin(a) * 80); ctx.lineTo(540 + Math.cos(a) * 92, 940 + Math.sin(a) * 92); ctx.stroke(); }
  const na = Math.PI * (0.8 + 1.4 * (o.aguja ?? (0.45 + 0.05 * Math.sin(t * 9)))); ctx.strokeStyle = RD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(540, 940); ctx.lineTo(540 + Math.cos(na) * 84, 940 + Math.sin(na) * 84); ctx.stroke();
  guante(ctx, t, 190, 1000, true, 0); guante(ctx, t, 890, 1000, false, o.gas || 0);
  // piernas (jeans) y tanque
  ctx.fillStyle = '#2c3a5a'; ctx.beginPath(); ctx.moveTo(-60, 1300); ctx.quadraticCurveTo(200, 1250, 330, 1500); ctx.lineTo(260, HH + 60); ctx.lineTo(-60, HH + 60); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(W + 60, 1300); ctx.quadraticCurveTo(W - 200, 1250, W - 330, 1500); ctx.lineTo(W - 260, HH + 60); ctx.lineTo(W + 60, HH + 60); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c8553d'; ctx.beginPath(); ctx.moveTo(360, 1090); ctx.quadraticCurveTo(540, 1050, 720, 1090); ctx.quadraticCurveTo(760, 1300, 680, 1460); ctx.lineTo(400, 1460); ctx.quadraticCurveTo(320, 1300, 360, 1090); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.ellipse(500, 1180, 40, 90, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.arc(540, 1120, 26, 0, TAU); ctx.fill();
  // motor entre las piernas (aletas) o en rayos X
  const rx = o.rx || 0; ctx.fillStyle = '#7d848f'; ctx.beginPath(); ctx.roundRect(380, 1470, 320, 330, 30); ctx.fill(); ctx.fillStyle = '#5f6670'; for (let k = 0; k < 9; k++) ctx.fillRect(360, 1490 + k * 34, 360, 12);
  if (rx > 0) { ctx.save(); ctx.beginPath(); ctx.arc(540, 1590, 30 + 300 * rx, 0, TAU); ctx.clip(); ctx.fillStyle = '#0b1d3a'; ctx.fillRect(0, 1200, W, 800); motorRX(ctx, t, 540, 1770, 0.78, { phi: o.phi ?? t * 14 }); ctx.restore(); ctx.strokeStyle = CY; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(540, 1590, 30 + 300 * rx, 0, TAU); ctx.stroke(); }
  if (o.latido) P.glow(ctx, 540, 1600, 260, '255,150,40', o.latido);
  ctx.restore(); };

 // ---------- TACÓMETRO (×1000 vueltas por minuto) ----------
 const tacometro = (ctx, x, y, r, v) => { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#1e1e22'; ctx.beginPath(); ctx.arc(0, 0, r + 18, 0, TAU); ctx.fill(); ctx.fillStyle = '#0f1218'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); const a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
  ctx.strokeStyle = RD; ctx.lineWidth = r * 0.08; ctx.beginPath(); ctx.arc(0, 0, r * 0.86, lerp(a0, a1, 0.8), a1); ctx.stroke();
  for (let i = 0; i <= 10; i++) { const a = lerp(a0, a1, i / 10); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72); ctx.lineTo(Math.cos(a) * r * 0.84, Math.sin(a) * r * 0.84); ctx.stroke(); if (i % 2 === 0) txt(ctx, String(i), Math.cos(a) * r * 0.56, Math.sin(a) * r * 0.56, Math.max(36, r * 0.14), '#ffffff', { w: 800, f: 'Nunito' }); }
  txt(ctx, '×1000', 0, r * 0.42, Math.max(34, r * 0.11), '#9aa3b2', { w: 800, f: 'Nunito' });
  const a = lerp(a0, a1, cl(v / 10)); ctx.strokeStyle = NAR; ctx.lineWidth = r * 0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8); ctx.stroke(); ctx.fillStyle = '#ddd'; ctx.beginPath(); ctx.arc(0, 0, r * 0.08, 0, TAU); ctx.fill(); ctx.restore(); };

 // ---------- PIERNAS PEDALEANDO (metáfora de la biela y el cigüeñal) ----------
 const pedaleo = (ctx, t, x, y, s, a) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const hip = [-80, -420], L1 = 230, L2 = 220;
  ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fill(); ctx.fillStyle = '#6b7280'; for (let i = 0; i < 24; i++) { const b = a + i * TAU / 24; ctx.beginPath(); ctx.arc(Math.cos(b) * 70, Math.sin(b) * 70, 7, 0, TAU); ctx.fill(); }
  for (const [ph, col] of [[Math.PI, '#24314d'], [0, '#2c3a5a']]) { const b = a + ph, px = Math.cos(b) * 110, py = Math.sin(b) * 110; ctx.strokeStyle = '#c9ced8'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(px, py); ctx.stroke();
   const dx = px - hip[0], dy = py - hip[1], d = Math.min(L1 + L2 - 1, Math.hypot(dx, dy)), aa = Math.atan2(dy, dx), k = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)), kx = hip[0] + Math.cos(aa - k) * L1, ky = hip[1] + Math.sin(aa - k) * L1;
   ctx.strokeStyle = col; ctx.lineWidth = 60; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(kx, ky); ctx.lineTo(px, py); ctx.stroke(); ctx.fillStyle = '#1b1b1e'; ctx.beginPath(); ctx.ellipse(px + 20, py, 50, 22, 0, 0, TAU); ctx.fill(); }
  ctx.restore(); };

 // ---------- CADENA Y RUEDA DE ATRÁS (primer plano) ----------
 const cadenaPP = (ctx, t, a) => { rueda(ctx, 760, 1040, 420, a); ctx.fillStyle = '#7d848f'; ctx.beginPath(); ctx.arc(760, 1040, 190, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a5f68'; for (let i = 0; i < 40; i++) { const b = a + i * TAU / 40; ctx.beginPath(); ctx.arc(760 + Math.cos(b) * 196, 1040 + Math.sin(b) * 196, 10, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#7d848f'; ctx.beginPath(); ctx.arc(170, 1040, 80, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a5f68'; for (let i = 0; i < 14; i++) { const b = a * 2.4 + i * TAU / 14; ctx.beginPath(); ctx.arc(170 + Math.cos(b) * 86, 1040 + Math.sin(b) * 86, 9, 0, TAU); ctx.fill(); }
  const top = [[170, 954], [760, 844]], bot = [[170, 1126], [760, 1236]]; ctx.strokeStyle = '#3a3e46'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(top[0][0], top[0][1]); ctx.lineTo(top[1][0], top[1][1]); ctx.moveTo(bot[0][0], bot[0][1]); ctx.lineTo(bot[1][0], bot[1][1]); ctx.stroke();
  ctx.fillStyle = '#c9ced8'; for (let i = 0; i < 16; i++) { const q = ((a * 0.08 + i / 16) % 1); ctx.beginPath(); ctx.arc(lerp(top[0][0], top[1][0], q), lerp(top[0][1], top[1][1], q), 7, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(lerp(bot[1][0], bot[0][0], q), lerp(bot[1][1], bot[0][1], q), 7, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#c9ced8'; ctx.beginPath(); ctx.arc(170, 1040, 24, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(760, 1040, 40, 0, TAU); ctx.fill(); };

 // =====================================================================================================
 // ESCENAS (un plano por idea, ningún ángulo > 4 s; textos siempre encima de destellos y explosiones)
 // =====================================================================================================
 const B = [];
 const MX = 540, MY = 1530, MS = 1.15;   // moto en la calle
 const motoW = (px, py) => [MX + MS * px, MY + MS * py];   // punto de la moto en el mundo
 const ENG = motoW(-10, -260);
 const calle = (ctx, t, o = {}) => { ciudad(ctx, t, { fy: 1260, off: (o.vel ?? 600) * t }); if (o.gente !== false) { persona(ctx, t, o.px ?? 150, 1300, 0.62, Object.assign({ ropa: '#7a6fb8', seed: 2, mira: 1 }, o.peaton || {})); } moto(ctx, t, MX, MY, MS, o.moto || {}); };
 const SM = 1.3, ZK = 1.25 / SM, centroMotor = (s) => [540, 1220];   // motorRX centrado en pantalla (el cigüeñal en y; el cilindro arriba)
 const rxFull = (ctx, t, phi, o = {}) => { const s = o.s ?? SM, c = centroMotor(s); rejilla(ctx); return motorRX(ctx, t, c[0], c[1] + (o.dy || 0), s, Object.assign({ phi }, o)); };
 const golpeBoom = (k, t0, g = 1) => { k.play('thud', t0, { f: 42, gain: 1.0 * g }); k.noise(t0, { dur: 0.9, color: 'brown', filter: 'lowpass', f: [[0, 2200], [0.9, 150]], gain: 0.45 * g, a: 0.002 }); k.noise(t0, { dur: 0.25, filter: 'highpass', f: 2500, gain: 0.35 * g, a: 0.001 }); };
 const motorSon = (k, t0, t1, hz, g = 0.06) => { for (let x = t0; x < t1; x += 1 / hz) k.tone(x, { f: 70, type: 'square', dur: 0.03, gain: g, a: 0.002, filter: 'lowpass', f2: 600, minor: true }); };

 // ---------- 1 · GANCHO (primera persona): la calle pasa, el tablero, tus manos, el tanque y el motor entre las piernas → en «EXPLOTA» el motor se vuelve rayos X y la bola de fuego sale a cámara → «sin parar»: explosiones cada vez más rápidas ----------
 const latidos = (() => { const r = []; let x = Tk.sin - 0.05, g = 0.34; while (x < S(2) + 0.2) { r.push(x); x += g; g = Math.max(0.085, g * 0.78); } return r; })();
 const latidoV = (t) => { let v = 0; for (const p of latidos) { const d = t - p; if (d >= 0 && d < 0.4) v = Math.max(v, Math.exp(-d * 11)); } return v; };
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  if (PORTADA) { ciudad(ctx, 1.0, { fy: 1520, off: 300 }); moto(ctx, 1.0, 560, 1770, 1.32, { rx: 1, phi: 2 * Math.PI + 0.25, latido: 0.9, humo: 0.8, luz: 0.6, rueda: 0.4, vibra: 0 }); bolaFuego(ctx, 1.0, 560 + 1.32 * -10, 1770 + 1.32 * -330, 0.2, { rad: 300 }); ctx.fillStyle = '#1e1612'; ctx.fillRect(0, 1790, W, HH); ctx.fillStyle = '#b8452f'; ctx.fillRect(0, 1784, W, 8); return; }
  P.pregunta(ctx, '¿QUÉ PASA DENTRO / DEL MOTOR?', t, 0, S(2) - 0.15, { capY: 330, px: 58, clave: 'MOTOR', col: '#ff3b3b', x: 540, dy: 110 });
  const TE = Tk.explota, golpes = [[TE, 1.4]], sh = sacude(t, golpes, 56), rx = sm(TE - 0.3, TE - 0.02, t), lv = latidoV(t);
  ctx.save(); ctx.translate(sh[0] + (lv * 6) * Math.sin(t * 80), sh[1]); const z = lerp(1.0, 1.12, sm(0, TE, t)); ctx.translate(540, 1500); ctx.scale(z, z); ctx.translate(-540, -1500);
  pov(ctx, t, { gas: t < TE + 0.5 ? sm(TE - 0.65, TE - 0.2, t) : 0.6 + 0.4 * lv, rx, phi: t > TE ? 2 * Math.PI + (t - TE) * 30 : 2 * Math.PI - 0.1, latido: lv * 0.8, aguja: 0.4 + 0.25 * sm(0, TE, t) + 0.05 * Math.sin(t * 9) }); ctx.restore();
  if (lv > 0.05) bolaFuego(ctx, t, 540, 1480, 0.12 + 0.2 * lv, { rad: 300, seed: 3 });
  const kf = t < TE - 0.2 ? 0 : t < TE ? E.in((t - TE + 0.2) / 0.2) : 1 - sm(TE + 0.1, TE + 0.5, t); bolaFuego(ctx, t, lerp(540, 540, kf), lerp(1480, 960, kf), kf, { rad: 560 });
  fogonazo(ctx, t, [[TE, 0.9]]);
 }, sfx(k) { const TE = Tk.explota; motorSon(k, 0, TE, 14, 0.05); k.noise(0, { dur: S(2), color: 'brown', filter: 'lowpass', f: 300, gain: 0.12, a: 0.02 }); k.noise(0, { dur: S(2), filter: 'bandpass', f: 900, q: 0.8, gain: 0.04, a: 0.05 });
  k.play('whoosh', TE - 0.25, { dur: 0.25, top: 2400, gain: 0.35, minor: true }); golpeBoom(k, TE, 1.1); latidos.forEach((p) => { k.play('thud', p, { f: 70, gain: 0.45 }); k.noise(p, { dur: 0.08, color: 'brown', filter: 'lowpass', f: 1200, gain: 0.2, a: 0.002 }); }); } });

 // ---------- 2 · ¿Qué pasa ahí dentro? → la calle: la moto pasa grande (domicilios), la gente mira ----------
 B.push({ t0: S(2), t1: S(3), in: { type: 'cut' }, draw(ctx, t) {
  const cam = camK(t, [[S(2), 540, 1080, 1.0], [S(3), 560, 1060, 1.06]]); ctx.save(); zoomP(ctx, cam); calle(ctx, t, { px: 960, peaton: { sonrie: 0.5, mira: -1 }, moto: { humo: 0.8 } }); ctx.restore();
 }, sfx(k) { motorSon(k, S(2), S(3), 18, 0.05); k.play('whoosh', S(2), { dur: 0.8, top: 1200, gain: 0.25 }); k.noise(S(2), { dur: S(3) - S(2), color: 'brown', filter: 'lowpass', f: 400, gain: 0.12, a: 0.05 }); } });

 // ---------- 3 · Es más asombroso de lo que crees → la cámara se acerca al motor y se vuelve rayos X ----------
 B.push({ t0: S(3), t1: S(4), in: { type: 'cut' }, draw(ctx, t) {
  const u = sm(S(3), S(4) - 0.3, t), cam = [lerp(560, ENG[0], u), lerp(1060, ENG[1], u), lerp(1.06, 2.3, E.inOut(u))]; ctx.save(); zoomP(ctx, cam); calle(ctx, t, { moto: { rx: sm(Tk.asombroso - 0.4, Tk.asombroso + 0.2, t), latido: 0.3 + 0.2 * Math.sin(t * 20) } }); ctx.restore();
  anillo(ctx, t, 540, 950, 330, sm(Tk.asombroso - 0.2, Tk.asombroso + 0.2, t));
 }, sfx(k) { motorSon(k, S(3), S(4), 18, 0.05); k.tone(S(3) + 0.3, { f: [[0, 300], [2, 900]], type: 'sine', dur: 2.2, gain: 0.05 }); FX.revelar(k, Tk.asombroso - 0.3); } });

 // ---------- 4 · Tu motor respira, como tú, en cuatro tiempos. → el conductor respira (aire que entra y sale) → el motor en rayos X, lento ----------
 B.push({ t0: S(4), t1: S(7), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.cuatro - 0.4;
  if (t < tb) { const ch = motoW(-60, -560), cam = camK(t, [[S(4), ch[0], ch[1] + 40, 1.6], [tb, ch[0] + 20, ch[1] + 20, 1.75]]); ctx.save(); zoomP(ctx, cam); calle(ctx, t, { vel: 300, gente: false, moto: { pilotoO: { giraCabeza: 0.05 * Math.sin(t * 2) } } }); ctx.restore();
   const br = Math.sin((t - S(4)) * 3.2); ctx.save(); ctx.globalAlpha = 0.85; ctx.strokeStyle = br > 0 ? CY : '#ffffff'; ctx.lineWidth = 12; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { const yy = 760 + i * 60, x0 = br > 0 ? 960 : 700, x1 = br > 0 ? 720 : 960; flecha(ctx, x0, yy, x1, yy + 10, br > 0 ? CY : '#ffffff', 12); } ctx.restore(); TAG(ctx, br > 0 ? 'ASPIRA' : 'SOPLA', 470, 520, t, S(4) + 0.1, tb, { mono: true, col: CY, px: 56 }); }
  else { rxFull(ctx, t, fasePhi(t, tb, 2.2)); TAG(ctx, '4 TIEMPOS', 470, 520, t, tb + 0.1, S(7), { mono: true, col: YE, px: 66 }); }
 }, sfx(k) { k.noise(S(4), { dur: 1.4, color: 'pink', filter: 'bandpass', f: 600, q: 1, gain: 0.08, a: 0.3 }); k.play('whoosh', Tk.cuatro - 0.45, { dur: 0.3, top: 1600, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.cuatro - 0.3); motorSon(k, Tk.cuatro - 0.4, S(7), 4, 0.06); } });

 // ---------- 5 · Arriba, dos válvulas se abren y se cierran como una nariz. → primer plano de la culata: las válvulas → la cámara gira: entra (azul) y sale (gris) ----------
 B.push({ t0: S(7), t1: S(8), in: { type: 'cut' }, draw(ctx, t) {
  const ph = fasePhi(t, S(7), 3.0), s = SM, c = centroMotor(s);
  if (t < 14.4) { const cam = camK(t, [[S(7), 540, c[1] - SM * 470, ZK * 2.2], [14.4, 520, c[1] - SM * 470, ZK * 2.4]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam); motorRX(ctx, t, c[0], c[1], s, { phi: ph, marcaValvulas: t > Tk.valvulas - 0.3 }); ctx.restore(); TAG(ctx, 'DOS VÁLVULAS', 470, 520, t, Tk.valvulas - 0.3, 14.4, { mono: true, col: CY, px: 60 }); }
  else { const cam = camK(t, [[14.4, 540, c[1] - SM * 440, ZK * 1.6], [S(8), 540, c[1] - SM * 400, ZK * 1.45]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam); ctxGiro(ctx, 540, 900, -0.12 + 0.06 * sm(14.4, S(8), t)); motorRX(ctx, t, c[0], c[1], s, { phi: ph }); ctx.restore(); TAG(ctx, 'COMO UNA NARIZ', 470, 520, t, Tk.nariz - 0.6, S(8), { mono: true, col: '#ffffff', px: 56 }); }
 }, sfx(k) { for (let x = S(7) + 0.2; x < S(8); x += 0.55) k.play('tick', x, { f: 900, gain: 0.12, minor: true }); FX.etiqueta(k, Tk.valvulas - 0.3); FX.etiqueta(k, Tk.nariz - 0.6); k.noise(S(7), { dur: S(8) - S(7), color: 'pink', filter: 'bandpass', f: 700, q: 1, gain: 0.05, a: 0.3 }); } });

 // ---------- 6 · Uno: ASPIRA. El pistón baja y entra aire con gasolina. → tiempo 1 en cámara lenta (motor entero → acercamiento a la entrada) ----------
 B.push({ t0: S(8), t1: S(11), in: { type: 'cut' }, draw(ctx, t) {
  const ph = lerp(0.05, Math.PI - 0.05, sm(S(8) + 0.3, S(11) - 0.1, t)), tb = 18.6, s = SM, c = centroMotor(s);
  if (t < tb) { const cam = camK(t, [[S(8), 540, 950, 1.0], [tb, 540, 940, 1.06]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam); motorRX(ctx, t, c[0], c[1], s, { phi: ph }); ctx.restore(); }
  else { const cam = camK(t, [[tb, 420, c[1] - SM * 430, ZK * 1.7], [S(11), 470, c[1] - SM * 330, ZK * 1.55]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam); motorRX(ctx, t, c[0], c[1], s, { phi: ph, marcaPiston: t > Tk.gasolina - 1.2 }); ctx.restore(); }
  TAG(ctx, '1 · ASPIRA', 470, 520, t, Tk.uno - 0.1, S(11), { mono: true, col: CY, px: 72 });
 }, sfx(k) { FX.etiqueta(k, Tk.uno - 0.1); k.noise(Tk.aspira, { dur: 2.6, color: 'pink', filter: 'bandpass', f: [[0, 400], [2.6, 900]], q: 1, gain: 0.1, a: 0.3 }); k.play('whoosh', 18.6, { dur: 0.3, top: 1400, gain: 0.2, minor: true }); } });

 // ---------- 7 · Dos: APRIETA. El pistón sube y lo comprime. → tiempo 2 (la cámara gira → acercamiento a la cámara de combustión que se aprieta) ----------
 B.push({ t0: S(11), t1: S(14), in: { type: 'cut' }, draw(ctx, t) {
  const ph = lerp(Math.PI + 0.05, 2 * Math.PI - 0.08, sm(S(11) + 0.2, S(14) - 0.1, t)), tb = 22.8, s = SM, c = centroMotor(s);
  if (t < tb) { const cam = camK(t, [[S(11), 540, 950, 1.05], [tb, 540, 950, 1.1]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam); ctxGiro(ctx, 540, 950, 0.1 * sm(S(11), tb, t)); motorRX(ctx, t, c[0], c[1], s, { phi: ph }); ctx.restore(); }
  else { const cam = camK(t, [[tb, 540, c[1] - SM * 330, ZK * 1.9], [S(14), 540, c[1] - SM * 350, ZK * 2.1]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam); motorRX(ctx, t, c[0], c[1], s, { phi: ph }); ctx.restore(); }
  TAG(ctx, '2 · APRIETA', 470, 520, t, Tk.dos - 0.1, S(14), { mono: true, col: YE, px: 72 });
 }, sfx(k) { FX.etiqueta(k, Tk.dos - 0.1); k.tone(Tk.aprieta, { f: [[0, 150], [2.6, 420]], type: 'triangle', dur: 2.8, gain: 0.06 }); } });

 // ---------- 8 · Tres: la BUJÍA lanza una chispa… y EXPLOTA. → primer plano de la bujía (chispa en «chispa») → ¡explosión naranja en «explota»! ----------
 B.push({ t0: S(14), t1: S(17), in: { type: 'cut' }, draw(ctx, t) {
  const TE = Tk.explota2, tb = TE - 0.55, s = SM, c = centroMotor(s), golpes = [[TE, 1.4]], sh = sacude(t, golpes, 54);
  if (t < tb) { const sp = t > Tk.chispa - 0.05 ? 0.6 + 0.4 * Math.sin(t * 60) : 0, cam = camK(t, [[S(14), 540, c[1] - SM * 520, ZK * 2.6], [tb, 540, c[1] - SM * 480, ZK * 2.9]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam); motorRX(ctx, t, c[0], c[1], s, { phi: 2 * Math.PI - 0.06, chispa: sp, marcaBujia: t > Tk.bujia - 0.3 }); ctx.restore(); TAG(ctx, 'BUJÍA', 470, 520, t, Tk.bujia - 0.3, tb + 0.2, { mono: true, col: YE, px: 66 }); }
  else { const ph = t < TE ? 2 * Math.PI - 0.04 : 2 * Math.PI + (t - TE) * 1.2, cam = camK(t, [[tb, 540, 950, 1.15], [S(17), 540, 950, 1.05]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam, sh); motorRX(ctx, t, c[0], c[1], s, { phi: ph, chispa: t > TE - 0.1 && t < TE + 0.1 ? 1 : 0 }); ctx.restore();
   const kf = t < TE - 0.08 ? 0 : t < TE ? (t - TE + 0.08) / 0.08 : 1 - sm(TE + 0.15, TE + 0.6, t); bolaFuego(ctx, t, 540, lerp(c[1] - SM * 400, 960, cl(kf)), kf, { rad: 560, seed: 4 }); fogonazo(ctx, t, [[TE, 0.85]]); TAG(ctx, '3 · EXPLOTA', 470, 520, t, TE - 0.15, S(17), { mono: true, col: NAR, px: 72 }); }
  if (t < Tk.bujia - 0.3) TAG(ctx, '3 · EXPLOTA', 470, 520, t, Tk.tres - 0.1, Tk.bujia - 0.35, { mono: true, col: NAR, px: 72 });
 }, sfx(k) { FX.etiqueta(k, Tk.tres - 0.1); FX.etiqueta(k, Tk.bujia - 0.3); for (let i = 0; i < 6; i++) k.tone(Tk.chispa + i * 0.04, { f: 2000 + i * 300, type: 'square', dur: 0.02, gain: 0.05 }); k.noise(Tk.chispa, { dur: 0.25, filter: 'highpass', f: 4000, gain: 0.2, a: 0.002 }); k.play('whoosh', Tk.explota2 - 0.2, { dur: 0.2, top: 3000, gain: 0.3, minor: true }); golpeBoom(k, Tk.explota2, 1.1); } });

 // ---------- 9 · La explosión empuja el pistón hacia abajo. → tiempo de fuerza: flecha naranja, la cámara baja del fuego al cigüeñal ----------
 B.push({ t0: S(17), t1: S(18), in: { type: 'cut' }, draw(ctx, t) {
  const ph = lerp(2 * Math.PI + 0.45, 3 * Math.PI - 0.05, sm(S(17), S(18) - 0.1, t)), s = SM, c = centroMotor(s), cam = camK(t, [[S(17), 540, c[1] - SM * 300, ZK * 1.5], [S(18), 540, c[1] - SM * 100, ZK * 1.35]]);
  rejilla(ctx); ctx.save(); zoomP(ctx, cam); motorRX(ctx, t, c[0], c[1], s, { phi: ph, empuje: sm(Tk.empuja - 0.3, Tk.empuja, t) }); ctx.restore();
  TAG(ctx, 'EMPUJA EL PISTÓN', 470, 520, t, Tk.empuja - 0.3, S(18), { mono: true, col: NAR, px: 56 });
 }, sfx(k) { FX.etiqueta(k, Tk.empuja - 0.3); k.noise(S(17), { dur: 1.5, color: 'brown', filter: 'lowpass', f: [[0, 900], [1.5, 120]], gain: 0.15, a: 0.01 }); } });

 // ---------- 10 · Cuatro: SOPLA. El humo sale por el escape. → tiempo 4 (sale el humo gris) → la calle: humo del tubo de escape ----------
 B.push({ t0: S(18), t1: S(21), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.escape - 0.45, s = SM, c = centroMotor(s);
  if (t < tb) { const ph = lerp(3 * Math.PI + 0.05, 4 * Math.PI - 0.05, sm(S(18), tb, t)), cam = camK(t, [[S(18), 540, 950, 1.0], [tb, 560, 920, 1.12]]); rejilla(ctx); ctx.save(); zoomP(ctx, cam); motorRX(ctx, t, c[0], c[1], s, { phi: ph }); ctx.restore(); TAG(ctx, '4 · SOPLA', 470, 520, t, Tk.cuatro2 - 0.1, tb, { mono: true, col: '#c9ced8', px: 72 }); }
  else { const cam = camK(t, [[tb, 540, 1130, 0.95], [S(21), 540, 1140, 0.98]]); ctx.save(); zoomP(ctx, cam); calle(ctx, t, { vel: 400, px: 960, peaton: { mira: -1 }, moto: { humo: 1.2 } }); { const ex = motoW(-330, -175); for (let i = 0; i < 12; i++) { const ph = ((t * 0.8 + i / 12) % 1), hx = ex[0] - 20 - ph * 170 + 25 * Math.sin(t * 2 + i), hy = ex[1] - 20 - ph * 420; ctx.globalAlpha = 0.8 * (1 - ph) * sm(0, 0.12, ph); ctx.fillStyle = i % 2 ? '#c9ccd3' : '#b3b7c0'; ctx.beginPath(); ctx.arc(hx, hy, 34 + 90 * ph, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; } ctx.restore(); TAG(ctx, 'ESCAPE', 470, 520, t, Tk.escape - 0.4, S(21), { mono: true, col: '#c9ced8', px: 66 }); }
 }, sfx(k) { FX.etiqueta(k, Tk.cuatro2 - 0.1); k.noise(Tk.sopla, { dur: 1.4, filter: 'bandpass', f: 1200, q: 0.8, gain: 0.12, a: 0.1 }); motorSon(k, Tk.escape - 0.45, S(21), 14, 0.06); } });

 // ---------- 11 · La biela y el cigüeñal convierten ese sube y baja en giro, → primer plano del cigüeñal y la biela girando; la cámara gira ----------
 B.push({ t0: S(21), t1: S(22), in: { type: 'cut' }, draw(ctx, t) {
  const ph = fasePhi(t, S(21), 5.5), s = SM, c = centroMotor(s), cam = camK(t, [[S(21), 540, c[1] - 120, ZK * 1.75], [Tk.giro - 0.5, 540, c[1] - 160, ZK * 1.95], [S(22), 540, c[1] - 220, ZK * 1.6]]);
  rejilla(ctx); ctx.save(); zoomP(ctx, cam); ctxGiro(ctx, 540, c[1] - 150, 0.15 * Math.sin((t - S(21)) * 0.8)); motorRX(ctx, t, c[0], c[1], s, { phi: ph, marcaBiela: t > Tk.biela - 0.2 }); ctx.restore();
  if (t > Tk.giro - 0.4) { ctx.save(); ctx.globalAlpha = sm(Tk.giro - 0.4, Tk.giro, t); ctx.strokeStyle = YE; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(540, 1240, 260, -0.3, 2.2); ctx.stroke(); flecha(ctx, 540 + Math.cos(2.0) * 260, 1240 + Math.sin(2.0) * 260, 540 + Math.cos(2.25) * 260, 1240 + Math.sin(2.25) * 260, YE, 16); ctx.restore(); }
  TAG(ctx, 'BIELA Y CIGÜEÑAL', 470, 520, t, Tk.biela - 0.2, S(22), { mono: true, col: YE, px: 58 });
 }, sfx(k) { FX.etiqueta(k, Tk.biela - 0.2); motorSon(k, S(21), S(22), 8, 0.06); k.play('whoosh', Tk.giro - 0.4, { dur: 0.5, top: 1400, gain: 0.25, minor: true }); } });

 // ---------- 12 · como tus piernas en los pedales de una bicicleta. → piernas que pedalean (rodilla = biela, pedal = cigüeñal) ----------
 B.push({ t0: S(22), t1: S(23), in: { type: 'cut' }, draw(ctx, t) {
  const cam = camK(t, [[S(22), 540, 780, 1.0], [S(23), 520, 770, 1.05]]); ctx.save(); zoomP(ctx, cam); ciudad(ctx, t, { fy: 1520, off: 300 * t });
  ctx.strokeStyle = '#2f6db5'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(500, 1240); ctx.lineTo(380, 830); ctx.lineTo(760, 830); ctx.lineTo(500, 1240); ctx.moveTo(760, 830); ctx.lineTo(860, 1240); ctx.stroke(); rueda(ctx, 180, 1300, 230, -t * 5); rueda(ctx, 900, 1300, 230, -t * 5);
  { const bob = 6 * Math.sin(t * 9); ctx.fillStyle = '#1b1b1e'; ctx.beginPath(); ctx.ellipse(400, 815, 70, 20, -0.1, 0, TAU); ctx.fill(); ctx.strokeStyle = '#1b1b1e'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(760, 830); ctx.lineTo(790, 740); ctx.lineTo(850, 735); ctx.stroke(); ctx.strokeStyle = '#2f80c9'; ctx.lineWidth = 90; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(420, 790); ctx.lineTo(600, 560 + bob); ctx.stroke(); ctx.strokeStyle = '#2f80c9'; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(610, 580 + bob); ctx.lineTo(740, 650); ctx.lineTo(840, 735); ctx.stroke(); ctx.fillStyle = '#c98b5e'; ctx.beginPath(); ctx.arc(655, 470 + bob, 58, 0, TAU); ctx.fill(); ctx.strokeStyle = '#1b1b1e'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(655, 470 + bob, 58, 0, TAU); ctx.stroke(); ctx.fillStyle = '#24314d'; ctx.beginPath(); ctx.arc(650, 455 + bob, 64, Math.PI, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(690, 470 + bob, 8, 0, TAU); ctx.fill(); }
  pedaleo(ctx, t, 500, 1240, 1.0, t * 4.5); ctx.restore();
  TAG(ctx, 'COMO PEDALEAR', 470, 520, t, Tk.pedales - 0.5, S(23), { mono: true, col: CY, px: 60 });
 }, sfx(k) { FX.etiqueta(k, Tk.pedales - 0.5); for (let x = S(22) + 0.1; x < S(23); x += 0.35) k.play('tick', x, { f: 600, gain: 0.1, minor: true }); } });

 // ---------- 13 · Y la cadena lleva ese giro a la rueda de atrás. → primer plano de la cadena y la rueda → (pausa) la moto, el motor late en rayos X ----------
 B.push({ t0: S(23), t1: S(24), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.rueda + 0.6;
  if (t < tb) { const cam = camK(t, [[S(23), 480, 1040, 1.05], [tb, 560, 1040, 1.12]]); ctx.save(); zoomP(ctx, cam); ciudad(ctx, t, { fy: 1240, off: 500 * t }); cadenaPP(ctx, t, t * 6); ctx.restore(); TAG(ctx, 'CADENA', 470, 520, t, Tk.cadena - 0.3, tb, { mono: true, col: YE, px: 66 }); }
  else { const lv = Math.max(0, Math.sin((t - tb) * 7)) ** 6, cam = camK(t, [[tb, 540, 1080, 1.0], [S(24), 540, 1060, 1.06]]); ctx.save(); zoomP(ctx, cam); calle(ctx, t, { vel: 200, moto: { rx: 1, latido: 0.3 + 0.6 * lv, humo: 0.5, vibra: 0.4 } }); ctx.restore(); }
 }, sfx(k) { FX.etiqueta(k, Tk.cadena - 0.3); k.noise(S(23), { dur: Tk.rueda + 0.6 - S(23), filter: 'bandpass', f: 2500, q: 2, gain: 0.06, a: 0.1 }); const tb = Tk.rueda + 0.6; for (let x = tb; x < S(24); x += 2 * Math.PI / 7) k.play('thud', x + 0.05, { f: 60, gain: 0.4 }); } });

 // ---------- 14 · A unas SEIS MIL vueltas por minuto, con una explosión cada dos vueltas… → el tacómetro sube a 6 → el motor: vuelta 1, vuelta 2… ¡pum! ----------
 B.push({ t0: S(24), t1: S(25), in: { type: 'cut' }, draw(ctx, t) {
  const tb = Tk.minuto + 0.35;
  if (t < tb) { const v = lerp(1.5, 6, E.out(sm(S(24), Tk.seis + 0.15, t))) + 0.06 * Math.sin(t * 40), cam = camK(t, [[S(24), 540, 960, 1.1], [tb, 540, 960, 1.2]]); ctx.save(); zoomP(ctx, cam); ctx.fillStyle = '#1b1d24'; ctx.fillRect(-300, -300, W + 600, HH + 600); ctx.strokeStyle = '#2a2d36'; ctx.lineWidth = 3; for (let r = 450; r < 1400; r += 60) { ctx.beginPath(); ctx.arc(540, 960, r, 0, TAU); ctx.stroke(); } tacometro(ctx, 540, 960, 400, v); ctx.restore(); TAG(ctx, '6.000 VUELTAS POR MINUTO', 470, 520, t, Tk.seis - 0.2, tb, { mono: true, col: NAR, px: 46 }); }
  else { const ph = fasePhi(t, tb, 6.0), s = 1.15, c = [540, 1150], vuelta = Math.floor((((ph % (4 * Math.PI)) + 4 * Math.PI) % (4 * Math.PI)) / (2 * Math.PI)) + 1, st = tiempo(ph); rejilla(ctx); motorRX(ctx, t, c[0], c[1], s, { phi: ph });
   txt(ctx, 'VUELTA ' + vuelta, 540, 1410, 60, vuelta === 2 ? YE : '#ffffff', { w: 900, f: 'Nunito' }); if (st === 2) { const q = (((ph % (4 * Math.PI)) + 4 * Math.PI) % (4 * Math.PI) - 2 * Math.PI) / Math.PI; if (q < 0.3) bolaFuego(ctx, t, 540, c[1] - s * 380, 0.25 * (1 - q / 0.3), { rad: 300, seed: 6 }); }
   TAG(ctx, '1 EXPLOSIÓN CADA 2 VUELTAS', 470, 520, t, tb + 0.05, S(25), { mono: true, col: YE, px: 44 }); }
 }, sfx(k) { const tb = Tk.minuto + 0.35; k.tone(S(24), { f: [[0, 90], [0.8, 200]], type: 'sawtooth', dur: tb - S(24), gain: 0.05, filter: 'lowpass', f2: 900 }); FX.etiqueta(k, Tk.seis - 0.2); FX.etiqueta(k, tb + 0.05);
  for (let x = tb + (2 * Math.PI) / 6.0; x < S(25); x += (4 * Math.PI) / 6.0) { k.play('thud', x, { f: 55, gain: 0.6 }); k.noise(x, { dur: 0.15, color: 'brown', filter: 'lowpass', f: 1500, gain: 0.25, a: 0.002 }); } } });

 // ---------- 15 · son CINCUENTA explosiones cada segundo. → ¡golpe en «cincuenta»!: el número gigante, destello y el motor se vuelve un zumbido ----------
 B.push({ t0: S(25), t1: S(26), in: { type: 'cut' }, draw(ctx, t) {
  const g0 = Tk.cincuenta, golpes = [[g0, 1.4]], sh = sacude(t, golpes, 56), s = SM, c = centroMotor(s), ph = fasePhi(t, S(25), 60), st = tiempo(ph);
  ctx.save(); ctx.translate(sh[0], sh[1]); rejilla(ctx); motorRX(ctx, t, c[0], c[1], s, { phi: ph }); if (st === 2) bolaFuego(ctx, t, 540, c[1] - s * 380, 0.22, { rad: 280, seed: Math.floor(t * 30) }); ctx.restore();
  ctx.fillStyle = 'rgba(10,15,30,0.5)'; ctx.fillRect(0, 0, W, HH); if (t > g0 - 0.05) bolaFuego(ctx, t, 540, 900, 0.32 + 0.1 * Math.sin(t * 40), { rad: 560, seed: 9 }); const pop = t > g0 ? 1 + 0.35 * Math.exp(-(t - g0) * 8) : 0; if (pop > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(pop, pop); txt(ctx, '50', 0, 0, 440, '#ffffff', { w: 900, f: 'Fredoka' }); ctx.restore(); }
  fogonazo(ctx, t, [[g0, 0.7]]); TAG(ctx, 'EXPLOSIONES POR SEGUNDO', 470, 1330, t, g0 + 0.1, S(26), { mono: true, col: NAR, px: 46 });
 }, sfx(k) { golpeBoom(k, Tk.cincuenta, 1.2); for (let x = S(25); x < S(26); x += 1 / 50) k.tone(x, { f: 80, type: 'square', dur: 0.01, gain: 0.05, a: 0.001, filter: 'lowpass', f2: 900, minor: true }); FX.etiqueta(k, Tk.cincuenta + 0.1); } });

 // ---------- 16 · Tres mil… cada minuto. → el contador sube hasta 3.000 ----------
 B.push({ t0: S(26), t1: S(28), in: { type: 'cut' }, draw(ctx, t) {
  const s = SM, c = centroMotor(s), ph = fasePhi(t, S(26), 60), n = Math.round(3000 * E.out(sm(S(26), Tk.minuto2, t))), cam = camK(t, [[S(26), 540, 960, 1.0], [S(28), 540, 960, 1.08]]);
  ctx.save(); zoomP(ctx, cam); rejilla(ctx); motorRX(ctx, t, c[0], c[1], s, { phi: ph }); ctx.restore(); ctx.fillStyle = 'rgba(10,15,30,0.55)'; ctx.fillRect(0, 0, W, HH); bolaFuego(ctx, t, 540, 900, 0.22 + 0.08 * Math.sin(t * 40), { rad: 560, seed: 10 });
  txt(ctx, n >= 1000 ? Math.floor(n / 1000) + '.' + String(n % 1000).padStart(3, '0') : String(n), 540, 900, 260, YE, { w: 900, f: 'Fredoka' }); TAG(ctx, 'EXPLOSIONES POR MINUTO', 470, 1330, t, Tk.minuto2 - 0.3, S(28), { mono: true, col: YE, px: 46 });
 }, sfx(k) { for (let x = S(26); x < Tk.minuto2; x += 0.05) k.play('tick', x, { f: 1400, gain: 0.08, minor: true }); k.play('ding', Tk.minuto2, { f: 'E6', gain: 0.25 }); FX.etiqueta(k, Tk.minuto2 - 0.3); } });

 // ---------- 17 · Cincuenta por segundo… → la calle: la moto pasa con el motor latiendo en rayos X (zumbido) ----------
 B.push({ t0: S(28), t1: S(29), in: { type: 'cut' }, draw(ctx, t) {
  const cam = camK(t, [[S(28), 560, 1100, 1.15], [S(29), 520, 1080, 1.05]]); ctx.save(); zoomP(ctx, cam); calle(ctx, t, { vel: 900, peaton: { sonrie: 1, mira: 1 }, moto: { rx: 1, latido: 0.5 + 0.4 * Math.abs(Math.sin(t * 50)), phi: t * 60, luz: 0.5 } }); ctx.restore();
 }, sfx(k) { for (let x = S(28); x < S(29); x += 1 / 50) k.tone(x, { f: 80, type: 'square', dur: 0.01, gain: 0.04, a: 0.001, filter: 'lowpass', f2: 900, minor: true }); k.play('whoosh', S(28), { dur: 0.8, top: 1400, gain: 0.3 }); } });

 // ---------- 18 · mientras vas al TRABAJO, llevas un PEDIDO o vuelves a CASA. → la calle con tráfico → la entrega (el cliente sonríe) → FINAL: llega a casa, el niño saluda; el motor late tranquilo ----------
 B.push({ t0: S(29), t1: S(30), in: { type: 'cut' }, draw(ctx, t) {
  const t1 = Tk.pedido - 0.25, t2 = Tk.casa - 0.55;
  if (t < t1) { const cam = camK(t, [[S(29), 540, 1060, 1.0], [t1, 560, 1060, 1.05]]); ctx.save(); zoomP(ctx, cam); calle(ctx, t, { vel: 700, px: 900, peaton: { mira: -1 }, moto: { luz: 0.6 } }); ctx.restore(); TAG(ctx, 'AL TRABAJO', 470, 520, t, Tk.trabajo - 0.4, t1, { mono: true, col: YE, px: 60 }); }
  else if (t < t2) { const cam = camK(t, [[t1, 520, 1080, 1.05], [t2, 500, 1080, 1.1]]); ctx.save(); zoomP(ctx, cam); ciudad(ctx, t, { fy: 1260, off: 0 }); persona(ctx, t, 860, 1520, 0.95, { ropa: '#5f9a4e', sonrie: 1, brazoI: [-120, -360], seed: 3 }); ctx.fillStyle = '#e2a32b'; ctx.fillRect(860 - 0.95 * 200, 1520 - 0.95 * 420, 120, 90); moto(ctx, t, 380, 1560, 0.9, { rueda: 0, vibra: 0.3, humo: 0.3, pilotoO: { giraCabeza: 0.1 } }); ctx.restore(); TAG(ctx, 'UN PEDIDO', 470, 520, t, Tk.pedido - 0.25, t2, { mono: true, col: YE, px: 60 }); }
  else { const cam = camK(t, [[t2, 540, 1150, 1.0], [S(30), 560, 1170, 1.1]]); ctx.save(); zoomP(ctx, cam); ciudad(ctx, t, { fy: 1300, off: 0 }); ctx.fillStyle = '#5a3418'; ctx.fillRect(850, 1060, 180, 240); ctx.fillStyle = 'rgba(255,220,140,0.7)'; ctx.fillRect(870, 1080, 140, 90);
   persona(ctx, t, 940, 1320, 0.65, { ropa: '#e8463c', sonrie: 1, salto: 0.25 * Math.max(0, Math.sin((t - t2) * 8)), brazoD: [90, -560], seed: 4 }); moto(ctx, t, 520, 1560, 0.95, { rueda: 0.3, vibra: 0.2, rx: sm(t2 + 0.1, t2 + 0.35, t) * (1 - sm(t2 + 1.0, t2 + 1.35, t)), rxR: 115, phi: t * 10, latido: (0.25 + 0.2 * Math.sin(t * 8)) * (1 - sm(t2 + 1.0, t2 + 1.35, t)), humo: 0.3, luz: 0.7, pilotoO: { giraCabeza: 0.15 } }); ctx.restore(); TAG(ctx, 'A CASA', 470, 520, t, Tk.casa - 0.5, S(30), { mono: true, col: GR, px: 60 }); }
 }, sfx(k) { motorSon(k, S(29), S(30), 12, 0.04); FX.etiqueta(k, Tk.trabajo - 0.4); FX.etiqueta(k, Tk.pedido - 0.25); k.play('pop', Tk.pedido, { f: 600, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.casa - 0.5); k.tone(Tk.casa, { f: 'C5', dur: 1, gain: 0.05, verb: 0.5 }); k.tone(Tk.casa + 0.1, { f: 'E5', dur: 1, gain: 0.04, verb: 0.5 }); } });

 // ---------- 19 · CIERRE ----------
 B.push({ t0: S(30), t1: DURATION, in: { type: 'cut' }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#5b6fc4'); g.addColorStop(1, '#2a2440'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  P.ctaShare(ctx, t, S(30) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { ciudad(cc, t, { fy: 1300, off: 200 }); moto(cc, t, 540, 1560, 1.15, { rx: 1, latido: 0.5 }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(30) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'cartoon', capBorde: true, marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: [],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 300, gain: 0.02, a: 0.05, hold: DURATION - 2.5 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 100, gain: 0.45, chords: [['E2', 'B2', 'E3', 'G3'], ['C2', 'G2', 'C3', 'E3'], ['G2', 'D3', 'G3', 'B3'], ['D2', 'A2', 'D3', 'F#3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
