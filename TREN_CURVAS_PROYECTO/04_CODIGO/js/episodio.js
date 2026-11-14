// =====================================================================================================
// episodio.js — ¿Por qué el tren no se sale de la vía en las curvas? · PLANTILLA ASOMBROTECA v1.39 · «noche» (atardecer)
// UN solo vídeo con UN gancho (v1.34): el A con la imagen del B. Voz: ElevenLabs Eleven v4, Dan, UNA toma (1.014 caracteres,
// 64,6 s) + [PAUSA 0.3] antes del secreto → 64,98 s, voz intacta. Metáfora sostenida: el VASO DE PLÁSTICO que rueda en círculo.
// Dirección visual: la rueda es el centro (primeros planos, eje en «rayos X», conos exagerados con la parte ANCHA en naranja y la
// ESTRECHA en azul), un plano por idea con cámara que se mueve, impactos con fogonazo + sacudida + golpe metálico, pasajeros
// que reaccionan, final grande en primer plano. Tren, vía y paisaje dibujados, genéricos, sin logos.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, DURATION, txt } = K;
 const S = (i) => A.segments[i].s;
 const YE = '#ffd23f', RD = '#ff4d5e', GR = '#22d27a', CY = '#8fd8ff', NAR = '#ff9f43', AZ = '#3ea8ff';
 const PORTADA = typeof window !== 'undefined' && !!window.__SIN_SUBTITULOS;
 const Tk = {
  precipicio: wt(1, 'precipicio.'), sale: wt(2, 'sale?'), nunca: wt(3, 'nunca'), vaso: wt(4, 'vaso'), mesa: wt(4, 'mesa.'), recto: wt(5, 'recto:'), circulo: wt(6, 'círculo…'), boca: wt(7, 'boca'), ancha0: wt(7, 'ancha'),
  ruedas: wt(8, 'ruedas'), cilindros: wt(9, 'cilindros.'), conicas: wt(10, 'cónicas,'), vaso2: wt(10, 'vaso.'), eje: wt(11, 'eje'), giran: wt(12, 'giran'), fuera: wt(13, 'fuera…'), ancha: wt(14, 'ancha…'), camino: wt(15, 'camino'),
  estrecha: wt(16, 'estrecha.'), solo: wt(18, 'solo.'), vaso3: wt(19, 'vaso.'), pestana: wt(20, 'pestaña,'), seguro: wt(21, 'seguro'), guia: wt(21, 'guía.'), inclina: wt(22, 'inclina:'), alto: wt(23, 'alto.'),
  peralte: wt(24, 'peralte,'), empujon: wt(24, 'empujón'), precipicio2: wt(25, 'precipicio…'), cono: wt(26, 'cono.'),
 };
 const T_CORTE = 1.2, T_LLENA = 1.95, T_AFUERA = 3.0, T_SECRETO = Tk.conicas - 0.05;

 // ---------- cámara y efectos (como en el rayo y el cocodrilo) ----------
 const camK = (t, Kf) => { if (t <= Kf[0][0]) return Kf[0].slice(1); for (let i = 0; i < Kf.length - 1; i++) { const [t0, x0, y0, z0] = Kf[i], [t1, x1, y1, z1] = Kf[i + 1]; if (t < t1) { const u = E.inOut(cl((t - t0) / Math.max(0.01, t1 - t0))); return [lerp(x0, x1, u), lerp(y0, y1, u), Math.exp(lerp(Math.log(z0), Math.log(z1), u))]; } } return Kf[Kf.length - 1].slice(1); };
 const sacude = (t, golpes, amp = 30) => { let x = 0, y = 0; for (const [g, f] of golpes) { const d = t - g; if (d >= 0 && d < 0.6) { const k = amp * f * Math.exp(-d * 7); x += Math.sin(d * 97) * k; y += Math.cos(d * 83) * k * 0.8; } } return [x, y]; };
 // zoom de pantalla: (cx, cy) de la escena va al centro (540, 950) con zoom z
 const zoomP = (ctx, cam, sh = [0, 0]) => { ctx.translate(540 + sh[0], 950 + sh[1]); ctx.scale(cam[2], cam[2]); ctx.translate(-cam[0], -cam[1]); };
 const fogonazo = (ctx, t, golpes) => { let a = 0; for (const [g, f] of golpes) { const d = t - g; if (d >= 0 && d < 0.7) a = Math.max(a, Math.min(1, f) * (d < 0.07 ? 1 : Math.exp(-(d - 0.07) * 8))); } if (a > 0) { ctx.fillStyle = `rgba(255,250,235,${0.95 * a})`; ctx.fillRect(-80, -80, W + 160, HH + 160); } };
 const chispas = (c, x, y, t, t0, n = 18, r = 160, dur = 0.7, dir = -1) => { const d = t - t0; if (d < 0 || d > dur) return; const R = H.rng(Math.round(t0 * 100) + 3); c.save(); c.lineCap = 'round'; for (let i = 0; i < n; i++) { const a = (dir < 0 ? Math.PI : 0) + (R() - 0.5) * 1.6 - 0.3, v = (0.5 + R()) * r, q = d / dur, px = x + Math.cos(a) * v * q, py = y + Math.sin(a) * v * q * 0.6 - 120 * q + 260 * q * q; c.strokeStyle = `rgba(255,${190 + Math.round(R() * 60)},90,${1 - q})`; c.lineWidth = 4 + R() * 3; c.beginPath(); c.moveTo(px, py); c.lineTo(px - Math.cos(a) * 24, py - Math.sin(a) * 14); c.stroke(); } c.restore(); };
 const chispasLoop = (c, x, y, t, t0, n, r, per = 0.25, dir = -1) => { if (t < t0) return; const k = Math.floor((t - t0) / per); for (let j = Math.max(0, k - 2); j <= k; j++) chispas(c, x, y, t, t0 + j * per, n, r, 0.6, dir); };
 const ctxGiro = (ctx, x, y, a) => { ctx.translate(x, y); ctx.rotate(a); ctx.translate(-x, -y); };

 // ---------- paisaje de montaña al atardecer (pantalla); hy = horizonte; off = desplazamiento por la marcha ----------
 const paisaje = (ctx, t, o = {}) => { const hy = o.hy ?? 900, off = o.off ?? 0; const g = ctx.createLinearGradient(0, 0, 0, hy); g.addColorStop(0, '#24406e'); g.addColorStop(0.55, '#c86a6a'); g.addColorStop(1, '#ffbf6b'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, hy + 220);
  const sx = o.sx ?? 760; P.glow(ctx, sx, hy - 150, 360, '255,210,140', 0.55); ctx.fillStyle = '#fff2c8'; ctx.beginPath(); ctx.arc(sx, hy - 150, 80, 0, TAU); ctx.fill();
  const capa = (y0, amp, f, col, par, nieve) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-200, hy + 40); const pts = []; for (let x = -200; x <= W + 200; x += 40) { const xx = x + off * par, y = y0 - amp * (0.55 + 0.45 * Math.sin(xx * f + 1.3) * Math.sin(xx * f * 0.37 + 0.7)); pts.push([x, y]); ctx.lineTo(x, y); } ctx.lineTo(W + 200, hy + 40); ctx.closePath(); ctx.fill();
   if (nieve) { ctx.fillStyle = 'rgba(255,240,235,0.85)'; for (let i = 1; i < pts.length - 1; i++) { const [x, y] = pts[i]; if (y < pts[i - 1][1] && y < pts[i + 1][1] && y < y0 - amp * 0.7) { ctx.beginPath(); ctx.moveTo(x - 34, y + 30); ctx.lineTo(x, y); ctx.lineTo(x + 34, y + 30); ctx.closePath(); ctx.fill(); } } } };
  capa(hy - 120, 330, 0.004, '#7a5a86', 0.05, true); capa(hy - 40, 240, 0.006, '#5a3f6a', 0.15, false); capa(hy + 20, 170, 0.009, '#3d2c50', 0.35, false); };

 // ---------- tren de FRENTE (base en la vía: y); s = 1 → 640 px de ancho ----------
 const trenFrente = (ctx, t, x, y, s, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.rotate(o.incl || 0); ctx.scale(s, s);
  ctx.fillStyle = '#2a2d34'; ctx.beginPath(); ctx.roundRect(-280, -120, 560, 80, 12); ctx.fill(); ctx.fillStyle = '#8a909c'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.roundRect(k * 215 - 30, -100, 60, 100, 10); ctx.fill(); }   // bogie y ruedas de frente sobre los rieles
  ctx.fillStyle = '#2a2d34'; ctx.beginPath(); ctx.roundRect(-300, -170, 600, 110, 16); ctx.fill();   // falda
  const gb = ctx.createLinearGradient(-320, 0, 320, 0); gb.addColorStop(0, '#c9ced8'); gb.addColorStop(0.5, '#f7f8fb'); gb.addColorStop(1, '#bfc5d0'); ctx.fillStyle = gb;
  ctx.beginPath(); ctx.moveTo(-320, -150); ctx.lineTo(-320, -520); ctx.quadraticCurveTo(-310, -760, 0, -770); ctx.quadraticCurveTo(310, -760, 320, -520); ctx.lineTo(320, -150); ctx.closePath(); ctx.fill();
  const gw = ctx.createLinearGradient(0, -700, 0, -470); gw.addColorStop(0, '#0f1a2c'); gw.addColorStop(1, '#2b3f5e'); ctx.fillStyle = gw; ctx.beginPath(); ctx.moveTo(-250, -480); ctx.lineTo(-230, -640); ctx.quadraticCurveTo(0, -700, 230, -640); ctx.lineTo(250, -480); ctx.quadraticCurveTo(0, -455, -250, -480); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.moveTo(-150, -650); ctx.lineTo(-90, -650); ctx.lineTo(-170, -490); ctx.lineTo(-230, -490); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e63946'; ctx.fillRect(-320, -360, 640, 46); ctx.fillStyle = '#1d3557'; ctx.fillRect(-320, -310, 640, 14);
  for (const k of [-1, 1]) { P.glow(ctx, k * 200, -240, 150, '255,240,190', 0.8); ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.roundRect(k * 200 - 60, -262, 120, 44, 20); ctx.fill(); }
  ctx.fillStyle = '#8a909c'; ctx.beginPath(); ctx.roundRect(-50, -150, 100, 70, 10); ctx.fill();
  if (o.chispas != null) for (const k of [-1, 1]) chispasLoop(ctx, k * 220 + k * 30, -6, t, o.chispas, 12, 240, 0.18, k);
  ctx.restore(); };

 // ---------- tren de LADO (mira a la derecha; base y) ----------
 const ruedita = (ctx, x, y, r, ang) => { ctx.fillStyle = '#2a2d34'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#8a909c'; ctx.lineWidth = r * 0.18; ctx.beginPath(); ctx.arc(x, y, r * 0.62, 0, TAU); ctx.stroke(); ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.strokeStyle = '#c9ced8'; ctx.lineWidth = r * 0.12; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(k * TAU / 3) * r * 0.6, Math.sin(k * TAU / 3) * r * 0.6); ctx.stroke(); } ctx.restore(); };
 const trenLado = (ctx, t, x, y, s, o = {}) => { const n = o.coches ?? 3, L = 900, Hc = 340, ang = t * (o.giro ?? 14); ctx.save(); ctx.translate(x, y); ctx.rotate(o.incl || 0); ctx.scale(s, s);
  for (let i = 0; i < n; i++) { const x0 = -i * (L + 24) - L; const cab = i === 0;
   ctx.fillStyle = '#3b3f48'; ctx.fillRect(x0 + 60, -90, L - 120, 40);
   for (const bx of [x0 + 150, x0 + L - 150]) { ctx.fillStyle = '#2a2d34'; ctx.beginPath(); ctx.roundRect(bx - 110, -100, 220, 60, 10); ctx.fill(); ruedita(ctx, bx - 60, -40, 40, ang); ruedita(ctx, bx + 60, -40, 40, ang); }
   const gb = ctx.createLinearGradient(0, -Hc - 90, 0, -90); gb.addColorStop(0, '#f7f8fb'); gb.addColorStop(1, '#c9ced8'); ctx.fillStyle = gb; ctx.beginPath();
   if (cab) { ctx.moveTo(x0, -90); ctx.lineTo(x0, -Hc - 90); ctx.lineTo(x0 + L - 260, -Hc - 90); ctx.quadraticCurveTo(x0 + L + 40, -Hc - 60, x0 + L + 60, -150); ctx.quadraticCurveTo(x0 + L + 50, -90, x0 + L - 20, -90); ctx.closePath(); }
   else ctx.roundRect(x0, -Hc - 90, L, Hc, 26); ctx.fill();
   ctx.fillStyle = '#e63946'; ctx.fillRect(x0, -200, cab ? L + 20 : L, 30); ctx.fillStyle = '#1d3557'; ctx.fillRect(x0, -168, cab ? L + 10 : L, 10);
   ctx.fillStyle = '#1a2840'; for (let w = 0; w < 6; w++) { const wx = x0 + 70 + w * 120; if (cab && wx > x0 + L - 300) continue; ctx.beginPath(); ctx.roundRect(wx, -Hc - 50, 90, 110, 14); ctx.fill(); }
   if (cab) { ctx.fillStyle = '#1a2840'; ctx.beginPath(); ctx.moveTo(x0 + L - 250, -Hc - 70); ctx.quadraticCurveTo(x0 + L - 20, -Hc - 50, x0 + L + 20, -260); ctx.lineTo(x0 + L - 250, -260); ctx.closePath(); ctx.fill(); }
   ctx.fillStyle = '#9aa3b2'; ctx.fillRect(x0 + L / 2 - 36, -Hc - 50, 72, 260); }
  if (o.chispas != null) chispasLoop(ctx, -150 - 60, -2, t, o.chispas, 10, 180, 0.2, -1);
  ctx.restore(); };

 // ---------- RUEDA de lado, grande, sobre el riel (centro x, y; radio r) ----------
 const ruedaLado = (ctx, t, x, y, r, o = {}) => { const ang = t * (o.giro ?? 6); ctx.save();
  // riel (perfil lateral) y traviesas que pasan
  const ry = y + r; ctx.fillStyle = '#5a4a3a'; const off = (t * (o.vel ?? 600)) % 260; for (let k = -6; k <= 6; k++) { ctx.beginPath(); ctx.roundRect(x + k * 260 - off - 70, ry + 110, 140, 70, 8); ctx.fill(); }
  ctx.fillStyle = '#7b6a58'; ctx.fillRect(-200, ry + 175, W + 400, 400);
  const gr = ctx.createLinearGradient(0, ry, 0, ry + 110); gr.addColorStop(0, '#e6e9ef'); gr.addColorStop(0.25, '#9aa3b2'); gr.addColorStop(1, '#4a505c'); ctx.fillStyle = gr; ctx.fillRect(-200, ry, W + 400, 50); ctx.fillStyle = '#5c6370'; ctx.fillRect(-200, ry + 50, W + 400, 40); ctx.fillRect(-200, ry + 90, W + 400, 22);
  // pestaña (detrás, más grande) y rueda
  ctx.fillStyle = o.pestana ? H.rgba(H.mix('#4a505c', RD, o.pestana)) : '#4a505c'; ctx.beginPath(); ctx.arc(x, y, r * 1.12, 0, TAU); ctx.fill();
  if (o.pestana) { ctx.save(); ctx.shadowColor = RD; ctx.shadowBlur = 30 * o.pestana; ctx.strokeStyle = `rgba(255,77,94,${o.pestana})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(x, y, r * 1.12, 0, TAU); ctx.stroke(); ctx.restore(); }
  const gw = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); gw.addColorStop(0, '#e6e9ef'); gw.addColorStop(1, '#7d8594'); ctx.fillStyle = gw; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#5c6370'; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.arc(x, y, r * 0.86, 0, TAU); ctx.stroke();
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = '#5c6370'; for (let k = 0; k < 6; k++) { const a = k * TAU / 6; ctx.beginPath(); ctx.ellipse(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.13, r * 0.09, a, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = YE; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.moveTo(r * 0.3, 0); ctx.lineTo(r * 0.82, 0); ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#3b3f48'; ctx.beginPath(); ctx.arc(x, y, r * 0.22, 0, TAU); ctx.fill(); ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.arc(x, y, r * 0.1, 0, TAU); ctx.fill();
  if (o.chispas != null) chispasLoop(ctx, x - r * 0.2, ry, t, o.chispas, 14, r * 0.9, 0.2, -1);
  ctx.restore(); };

 // ---------- EJE con dos ruedas cónicas en «rayos X» (vista de frente). shift > 0 = desplazado hacia la derecha (fuera) ----------
 // centro x0, nivel de los rieles yR, escala s; o.colores (naranja ancha / azul estrecha), o.eje (brillo del eje), o.marca (radio de contacto)
 const ejeRX = (ctx, t, x0, yR, s, o = {}) => { const G = 360, Rin = 260, Rout = 190, Wi = 70, Wo = 110, sh = o.shift || 0; ctx.save(); ctx.translate(x0, yR); ctx.scale(s, s);
  // rejilla de «rayos X»
  if (o.fondo !== false) { ctx.fillStyle = 'rgba(10,30,60,0.9)'; ctx.beginPath(); ctx.roundRect(-640, -620, 1280, 820, 40); ctx.fill(); ctx.strokeStyle = 'rgba(143,216,255,0.12)'; ctx.lineWidth = 2; for (let gx = -640; gx <= 640; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, -620); ctx.lineTo(gx, 200); ctx.stroke(); } for (let gy = -620; gy <= 200; gy += 40) { ctx.beginPath(); ctx.moveTo(-640, gy); ctx.lineTo(640, gy); ctx.stroke(); } }
  // rieles (perfil) y traviesa
  ctx.fillStyle = '#6b5a48'; ctx.fillRect(-560, 90, 1120, 60); for (const k of [-1, 1]) { ctx.fillStyle = '#c9ced8'; ctx.beginPath(); ctx.roundRect(k * G - 36, 0, 72, 34, 10); ctx.fill(); ctx.fillStyle = '#8a909c'; ctx.fillRect(k * G - 12, 30, 24, 50); ctx.fillRect(k * G - 50, 78, 100, 14); }
  // cada rueda: trapecio (cono truncado visto de frente) + pestaña en la cara interior
  const rueda = (k) => { const xi = k * (G - Wi) + sh, xo = k * (G + Wo) + sh, f = cl(k > 0 ? (Wi - sh) / (Wi + Wo) : (Wi + sh) / (Wi + Wo)), rc = lerp(Rin, Rout, f), cy = -rc;
   const gw = ctx.createLinearGradient(xi, 0, xo, 0); if (o.colores) { gw.addColorStop(0, NAR); gw.addColorStop(1, AZ); } else { gw.addColorStop(0, '#9aa3b2'); gw.addColorStop(1, '#6b7280'); } ctx.fillStyle = gw;
   ctx.beginPath(); ctx.moveTo(xi, cy - Rin); ctx.lineTo(xo, cy - Rout); ctx.lineTo(xo, cy + Rout); ctx.lineTo(xi, cy + Rin); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 4; ctx.stroke();
   ctx.fillStyle = o.pestana ? H.rgba(H.mix('#6b7280', RD, o.pestana)) : '#6b7280'; const fx = xi - k * 26; ctx.beginPath(); ctx.moveTo(fx, cy - Rin - 34); ctx.lineTo(xi, cy - Rin); ctx.lineTo(xi, cy + Rin); ctx.lineTo(fx, cy + Rin + 34); ctx.closePath(); ctx.fill();
   if (o.marca) { const xc = k * G, a = o.marca; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = f < 0.5 ? NAR : AZ; ctx.lineWidth = 12; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 20; ctx.beginPath(); ctx.moveTo(xc, cy); ctx.lineTo(xc, 0); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(xc, 0, 16, 0, TAU); ctx.fill(); ctx.restore(); }
   return [k * G + sh * 0, cy]; };
  const cL = rueda(-1), cR = rueda(1);
  // eje rígido
  ctx.save(); if (o.eje) { ctx.shadowColor = CY; ctx.shadowBlur = 30 * o.eje; } ctx.strokeStyle = o.eje ? H.rgba(H.mix('#c9ced8', CY, o.eje)) : '#c9ced8'; ctx.lineWidth = 46; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-(G - Wi) + sh, cL[1]); ctx.lineTo((G - Wi) + sh, cR[1]); ctx.stroke(); ctx.restore();
  // giro sincronizado: flechas curvas sobre cada rueda con la misma fase
  if (o.giro) { const ph = (t * 2.2) % 1; for (const [k, c] of [[-1, cL], [1, cR]]) { ctx.save(); ctx.globalAlpha *= o.giro; ctx.strokeStyle = YE; ctx.lineWidth = 14; ctx.lineCap = 'round'; const xc = k * (G + 20) + sh; ctx.beginPath(); ctx.ellipse(xc, c[1], 120, 300, 0, -Math.PI / 2 + ph * TAU, -Math.PI / 2 + ph * TAU + 1.6); ctx.stroke(); ctx.restore(); } }
  ctx.restore(); };

 // ---------- RUEDA cónica en perspectiva 3/4 (héroe): cara exterior (estrecha) delante, interior (ancha + pestaña) detrás ----------
 const ruedaCono = (ctx, t, x, y, r, o = {}) => { const dz = r * 0.95, rin = r, rout = r * 0.78, ex = 0.32, ang = t * (o.giro ?? 5); ctx.save();
  // pestaña y cara interior (atrás, a la izquierda)
  const bx = x - dz; ctx.fillStyle = '#4a505c'; ctx.beginPath(); ctx.ellipse(bx, y, rin * 1.1 * ex, rin * 1.1, 0, 0, TAU); ctx.fill();
  // superficie de rodadura (cono): bandas de color de la parte ancha (naranja) a la estrecha (azul)
  const gs = ctx.createLinearGradient(bx, 0, x, 0); gs.addColorStop(0, o.colores === false ? '#9aa3b2' : NAR); gs.addColorStop(1, o.colores === false ? '#6b7280' : AZ); ctx.fillStyle = gs;
  ctx.beginPath(); ctx.moveTo(bx, y - rin); ctx.lineTo(x, y - rout); ctx.lineTo(x, y + rout); ctx.lineTo(bx, y + rin); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.moveTo(bx, y - rin); ctx.lineTo(x, y - rout); ctx.lineTo(x, y + rout); ctx.lineTo(bx, y + rin); ctx.closePath(); ctx.clip(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 6; for (let k = 0; k < 10; k++) { const ph = ((k / 10 + t * 0.6) % 1); const yy = Math.cos(ph * Math.PI) ; ctx.beginPath(); ctx.moveTo(bx, y + yy * rin); ctx.lineTo(x, y + yy * rout); ctx.stroke(); } ctx.restore();
  // cara exterior con el disco que gira
  const gf = ctx.createRadialGradient(x - rout * 0.1, y - rout * 0.3, 10, x, y, rout); gf.addColorStop(0, '#eef1f6'); gf.addColorStop(1, '#8a909c'); ctx.fillStyle = gf; ctx.beginPath(); ctx.ellipse(x, y, rout * ex, rout, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#5c6370'; for (let k = 0; k < 6; k++) { const a = ang + k * TAU / 6; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * rout * 0.55 * ex, y + Math.sin(a) * rout * 0.55, rout * 0.12 * ex, rout * 0.12, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#3b3f48'; ctx.beginPath(); ctx.ellipse(x, y, rout * 0.2 * ex, rout * 0.2, 0, 0, TAU); ctx.fill();
  if (o.brillo > 0) { ctx.save(); ctx.globalAlpha *= o.brillo; ctx.strokeStyle = YE; ctx.shadowColor = YE; ctx.shadowBlur = 40; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(bx, y - rin); ctx.lineTo(x, y - rout); ctx.moveTo(bx, y + rin); ctx.lineTo(x, y + rout); ctx.stroke(); ctx.restore(); }
  ctx.restore(); };

 // ---------- VASO de plástico (de lado): eje horizontal, boca ancha a la derecha (+x) si dir = 1 ----------
 const vaso = (ctx, x, y, s, ang, o = {}) => { const L = 300, Rb = 70, Rm = 120; ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const g = ctx.createLinearGradient(0, -Rm, 0, Rm); g.addColorStop(0, '#ff6b6b'); g.addColorStop(0.5, '#e63946'); g.addColorStop(1, '#a4161a'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-L / 2, -Rb); ctx.lineTo(L / 2, -Rm); ctx.lineTo(L / 2, Rm); ctx.lineTo(-L / 2, Rb); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 5; for (const q of [-0.2, 0.2]) { ctx.beginPath(); ctx.moveTo(-L / 2, Rb * q * 4); ctx.lineTo(L / 2, Rm * q * 4); ctx.stroke(); }
  ctx.fillStyle = '#7a0f14'; ctx.beginPath(); ctx.ellipse(L / 2, 0, 28, Rm, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = o.colores ? NAR : '#ffd0d0'; ctx.lineWidth = o.colores ? 16 : 8; ctx.beginPath(); ctx.ellipse(L / 2, 0, 28, Rm, 0, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#c1121f'; ctx.beginPath(); ctx.ellipse(-L / 2, 0, 16, Rb, 0, 0, TAU); ctx.fill(); if (o.colores) { ctx.strokeStyle = AZ; ctx.lineWidth = 16; ctx.beginPath(); ctx.ellipse(-L / 2, 0, 16, Rb, 0, 0, TAU); ctx.stroke(); }
  ctx.restore(); };
 const mesaMadera = (ctx, x0, y0, w, h) => { const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#9c6a3e'); g.addColorStop(1, '#6b4426'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h); ctx.strokeStyle = 'rgba(40,20,8,0.3)'; ctx.lineWidth = 4; for (let y = y0 + 60; y < y0 + h; y += 130) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.bezierCurveTo(x0 + w * 0.3, y + 16, x0 + w * 0.6, y - 16, x0 + w, y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(40,20,8,0.45)'; ctx.lineWidth = 6; for (let x = x0 + 160; x < x0 + w; x += 220) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + h); ctx.stroke(); } };
 // piedras del balasto / suelo (pantalla) para que el suelo no sea una mancha lisa
 const piedras = (ctx, y0, y1, n = 160, seed = 4) => { const R = H.rng(seed); for (let i = 0; i < n; i++) { const x = R() * W, y = y0 + R() * (y1 - y0), r = 8 + R() * 18; ctx.fillStyle = i % 3 ? 'rgba(160,145,125,0.9)' : 'rgba(70,60,50,0.9)'; ctx.beginPath(); ctx.ellipse(x, y, r * 1.4, r, R() * 3, 0, TAU); ctx.fill(); } };

 // ---------- curva vista desde ARRIBA: rieles en arco, traviesas, precipicio fuera, tren o eje ----------
 const curvaArriba = (ctx, t, o = {}) => { const cx = o.cx ?? 1500, cy = o.cy ?? 950, R = o.R ?? 1150, gauge = 110;
  ctx.fillStyle = '#4c6b3a'; ctx.fillRect(-200, -200, W + 400, HH + 400); const R2 = H.rng(9); ctx.fillStyle = '#3e5a30'; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(R2() * W, R2() * HH, 30 + R2() * 50, 0, TAU); ctx.fill(); }
  // precipicio por fuera de la curva
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R + 260, 0, TAU); ctx.rect(-400, -400, W + 2000, HH + 800); ctx.clip('evenodd'); const gv = ctx.createRadialGradient(cx, cy, R + 260, cx, cy, R + 1200); gv.addColorStop(0, '#2b2238'); gv.addColorStop(1, '#14101e'); ctx.fillStyle = gv; ctx.fillRect(-400, -400, W + 2000, HH + 800); ctx.restore();
  ctx.strokeStyle = '#8a7a64'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(cx, cy, R + 260, 0, TAU); ctx.stroke();
  ctx.strokeStyle = '#8f7f6a'; ctx.lineWidth = 230; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
  ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 22; for (let a = 0; a < TAU; a += 0.03) { ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R - 90), cy + Math.sin(a) * (R - 90)); ctx.lineTo(cx + Math.cos(a) * (R + 90), cy + Math.sin(a) * (R + 90)); ctx.stroke(); }
  for (const rr of [R - gauge / 2, R + gauge / 2]) { ctx.strokeStyle = '#d6dae2'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.stroke(); }
  if (o.dist) { const a0 = Math.PI * 0.86, n = 6, da = 0.05, q = o.dist; for (const [rr, col] of [[R + gauge / 2 + 34, NAR], [R - gauge / 2 - 34, AZ]]) { ctx.strokeStyle = col; ctx.lineWidth = 18; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const u = cl(q * n - i); if (u <= 0) continue; ctx.beginPath(); ctx.arc(cx, cy, rr, a0 + i * da, a0 + i * da + da * 0.82 * u); ctx.stroke(); } } }
  if (o.tren) { const n = 3, base = o.ang0 ?? Math.PI * 0.9 + t * 0.05; for (let i = 0; i < n; i++) { const a = base + i * 0.42, px = cx + Math.cos(a) * R, py = cy + Math.sin(a) * R; ctx.save(); ctx.translate(px, py); ctx.rotate(a); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.roundRect(-110 + 14, -230 + 14, 220, 460, 50); ctx.fill(); ctx.fillStyle = '#eef1f6'; ctx.beginPath(); ctx.roundRect(-110, -230, 220, 460, i === 0 ? [100, 100, 30, 30] : 30); ctx.fill(); ctx.fillStyle = '#c9ced8'; ctx.fillRect(-70, -180, 140, 360); ctx.fillStyle = '#e63946'; ctx.fillRect(-110, -6, 220, 12); ctx.restore(); } }
  if (o.eje) { const a = o.ejeAng ?? Math.PI * 1.0, sh = o.shift || 0; ctx.save(); ctx.translate(cx + Math.cos(a) * (R + sh), cy + Math.sin(a) * (R + sh)); ctx.rotate(a); ctx.strokeStyle = '#c9ced8'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(-gauge / 2 - 40, 0); ctx.lineTo(gauge / 2 + 40, 0); ctx.stroke(); for (const k of [-1, 1]) { ctx.fillStyle = k > 0 ? NAR : AZ; ctx.beginPath(); ctx.roundRect(k * gauge / 2 - 22, -70, 44, 140, 12); ctx.fill(); } ctx.restore(); }
 };

 // ---------- cabina (vía en perspectiva que gira junto al precipicio) ----------
 const cabina = (ctx, t, o = {}) => { const hy = 860, giro = o.giro ?? 1, vel = o.vel ?? 2.2; paisaje(ctx, t, { hy, off: t * 300, sx: 820 });
  const X = (d) => 540 + o.dx + giro * Math.pow(1 - d, 2.6) * -900, Y = (d) => hy + (HH + 120 - hy) * Math.pow(d, 1.7), G = (d) => 18 + 560 * Math.pow(d, 1.7);
  // precipicio a la derecha de la vía
  ctx.fillStyle = '#251a33'; ctx.beginPath(); ctx.moveTo(W + 200, hy); for (let i = 0; i <= 40; i++) { const d = i / 40; ctx.lineTo(X(d) + G(d) * 1.9, Y(d)); } ctx.lineTo(W + 200, HH + 200); ctx.closePath(); ctx.fill();
  const gv = ctx.createLinearGradient(0, hy, 0, HH); gv.addColorStop(0, 'rgba(120,90,140,0.6)'); gv.addColorStop(1, 'rgba(10,8,18,0.9)'); ctx.fillStyle = gv; ctx.fill();
  // ladera de roca a la izquierda
  ctx.fillStyle = '#5a4636'; ctx.beginPath(); ctx.moveTo(-200, hy - 40); for (let i = 0; i <= 40; i++) { const d = i / 40; ctx.lineTo(X(d) - G(d) * 1.7, Y(d)); } ctx.lineTo(-200, HH + 200); ctx.closePath(); ctx.fill();
  // balasto
  ctx.fillStyle = '#8f7f6a'; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const d = i / 40; ctx.lineTo(X(d) - G(d) * 1.6, Y(d)); } for (let i = 40; i >= 0; i--) { const d = i / 40; ctx.lineTo(X(d) + G(d) * 1.6, Y(d)); } ctx.closePath(); ctx.fill();
  // traviesas que pasan
  ctx.fillStyle = '#5a4a3a'; for (let k = 0; k < 26; k++) { const d = ((k / 26 + t * vel * 0.12) % 1); const g = G(d), x = X(d), y = Y(d), th = 4 + 30 * d * d; ctx.beginPath(); ctx.roundRect(x - g * 1.35, y - th / 2, g * 2.7, th, 3); ctx.fill(); }
  // rieles
  for (const k of [-1, 1]) { ctx.strokeStyle = '#e6e9ef'; ctx.lineCap = 'round'; for (let i = 0; i < 40; i++) { const d0 = i / 40, d1 = (i + 1) / 40; ctx.lineWidth = 2 + 22 * d1; ctx.beginPath(); ctx.moveTo(X(d0) + k * G(d0), Y(d0)); ctx.lineTo(X(d1) + k * G(d1), Y(d1)); ctx.stroke(); } }
  if (o.chispas != null) { chispasLoop(ctx, X(0.82) + G(0.82), Y(0.82), t, o.chispas, 12, 200, 0.15, 1); chispasLoop(ctx, X(0.82) - G(0.82), Y(0.82), t, o.chispas + 0.07, 8, 160, 0.18, -1); }
  // marco de la cabina
  ctx.fillStyle = '#16181e'; ctx.fillRect(-200, -200, W + 400, 300); ctx.fillRect(-200, -200, 260, HH + 400); ctx.fillRect(W - 60, -200, 260, HH + 400);
  ctx.fillStyle = '#20232b'; ctx.beginPath(); ctx.moveTo(-200, HH - 260); ctx.quadraticCurveTo(540, HH - 330, W + 200, HH - 260); ctx.lineTo(W + 200, HH + 200); ctx.lineTo(-200, HH + 200); ctx.closePath(); ctx.fill();
  for (const gx of [300, 540, 780]) { ctx.strokeStyle = '#8fd8ff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(gx, HH - 150, 54, Math.PI * 0.8, Math.PI * 2.2); ctx.stroke(); ctx.strokeStyle = RD; ctx.lineWidth = 5; const ag = Math.PI * 0.8 + (gx === 540 ? 1.25 : 0.8) * Math.PI; ctx.beginPath(); ctx.moveTo(gx, HH - 150); ctx.lineTo(gx + Math.cos(ag) * 46, HH - 150 + Math.sin(ag) * 46); ctx.stroke(); } };

 // ---------- plano general: el tren en la cornisa, roca del precipicio y valle (tren grande) ----------
 const planoBorde = (ctx, t, o = {}) => { const ry = o.ry ?? 1200; paisaje(ctx, t, { hy: 1000, off: t * 120, sx: 820 });
  const gr = ctx.createLinearGradient(0, ry, 0, HH); gr.addColorStop(0, '#6a5240'); gr.addColorStop(1, '#2c2030'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(-200, ry); ctx.lineTo(W + 200, ry); ctx.lineTo(W + 200, HH + 200); ctx.lineTo(-200, HH + 200); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(30,20,20,0.45)'; ctx.lineWidth = 6; for (let k = 1; k < 9; k++) { const y = ry + k * 60; ctx.beginPath(); ctx.moveTo(-200, y); for (let x = -200; x <= W + 200; x += 80) ctx.lineTo(x, y + 14 * Math.sin(x * 0.02 + k)); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(20,12,16,0.5)'; ctx.lineWidth = 5; const Rk = H.rng(12); for (let i = 0; i < 14; i++) { let x = Rk() * W, y = ry + 30; ctx.beginPath(); ctx.moveTo(x, y); for (let j = 0; j < 6; j++) { x += (Rk() - 0.5) * 60; y += 60; ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.fillStyle = '#8f7f6a'; ctx.fillRect(-200, ry - 60, W + 400, 70); ctx.strokeStyle = '#e6e9ef'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-200, ry - 58); ctx.lineTo(W + 200, ry - 58); ctx.stroke();
  trenLado(ctx, t, o.x ?? 1200, ry - 58, o.s ?? 0.85, { incl: o.incl ?? -0.05, chispas: o.chispas, coches: 3 }); };
 // ---------- vía de FRENTE con peralte (ángulo a, riel de fuera a la derecha) ----------
 const viaFrente = (ctx, t, x, y, s, a) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#7b6a58'; ctx.beginPath(); ctx.moveTo(-700, 300); ctx.lineTo(-560, 0); ctx.lineTo(560, 0); ctx.lineTo(700, 300); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.rotate(-a); ctx.fillStyle = '#8f7f6a'; ctx.beginPath(); ctx.moveTo(-600, 40); ctx.lineTo(-520, -20); ctx.lineTo(520, -20); ctx.lineTo(600, 40); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#5a4a3a'; ctx.fillRect(-470, -60, 940, 50); for (const k of [-1, 1]) { ctx.fillStyle = '#c9ced8'; ctx.beginPath(); ctx.roundRect(k * 210 - 36, -110, 72, 34, 8); ctx.fill(); ctx.fillStyle = '#8a909c'; ctx.fillRect(k * 210 - 12, -80, 24, 22); } ctx.restore(); ctx.restore(); };

 // ---------- personas del vagón (dibujo propio, con reacción) ----------
 const pasajero = (ctx, x, y, s, o = {}) => { const m = o.miedo || 0, ln = o.incl || 0; ctx.save(); ctx.translate(x, y); ctx.rotate(ln); ctx.scale(s, s); const ropa = o.ropa || '#3d6fb6';
  ctx.fillStyle = ropa; ctx.beginPath(); ctx.roundRect(-70, -260, 140, 260, [50, 50, 10, 10]); ctx.fill();
  ctx.fillStyle = o.piel || '#e0a77d'; ctx.beginPath(); ctx.arc(0, -320, 62, 0, TAU); ctx.fill(); ctx.fillStyle = o.pelo || '#2a1d16'; ctx.beginPath(); ctx.arc(-4, -340, 62, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
  ctx.fillStyle = '#fff'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 22, -318, 9 + 8 * m, 0, TAU); ctx.fill(); } ctx.fillStyle = '#111'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 22, -318, 4, 0, TAU); ctx.fill(); }
  if (m > 0.4) { ctx.fillStyle = '#3a1410'; ctx.beginPath(); ctx.ellipse(0, -282, 12, 14 * m, 0, 0, TAU); ctx.fill(); } else { ctx.strokeStyle = '#3a1410'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, -296, 18, 0.25, Math.PI - 0.25); ctx.stroke(); }
  // brazo agarrado a la barra (arriba) cuando hay miedo
  ctx.strokeStyle = ropa; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(50, -230); if (o.agarra) ctx.lineTo(90, -420); else ctx.lineTo(80, -120); ctx.stroke(); ctx.fillStyle = o.piel || '#e0a77d'; ctx.beginPath(); ctx.arc(o.agarra ? 92 : 82, o.agarra ? -432 : -108, 22, 0, TAU); ctx.fill();
  ctx.restore(); };

 // ---------- texto grande «NO / SÍ» y etiquetas de colores ----------
 const marcaX = (ctx, x, y, r, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = RD; ctx.lineWidth = r * 0.18; ctx.lineCap = 'round'; const q = r * E.out(a); ctx.beginPath(); ctx.moveTo(x - q, y - q); ctx.lineTo(x + q, y + q); ctx.moveTo(x + q, y - q); ctx.lineTo(x - q, y + q); ctx.stroke(); ctx.restore(); };

 // =====================================================================================================
 // ESCENAS (un plano por idea, ninguno > 4 s quieto; transiciones de cámara; textos siempre encima de los destellos)
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO A: cabina → (1,2 s) cámara baja en la curva: el tren llega inclinado y llena el 90 % → (3 s) plano general al borde ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  if (PORTADA) { paisaje(ctx, 0.5, { hy: 1020, off: 0, sx: 820 }); ctx.fillStyle = '#251a33'; ctx.fillRect(720, 1020, 600, 1000); ctx.fillStyle = '#8f7f6a'; ctx.beginPath(); ctx.moveTo(-100, HH); ctx.lineTo(360, 1020); ctx.lineTo(760, 1020); ctx.lineTo(1180, HH); ctx.closePath(); ctx.fill(); viaFrente(ctx, 0.5, 540, 1700, 1.0, 0.1); trenFrente(ctx, 0.5, 540, 1612, 1.32, { incl: -0.1, chispas: 0 }); return; }
  P.pregunta(ctx, '¿POR QUÉ EL TREN NO SE SALE / EN LAS CURVAS?', t, 0, S(2) - 0.15, { capY: 330, px: 58, clave: 'CURVAS', x: 540, dy: 110 });
  const golpes = [[T_LLENA, 1.0], [T_CORTE, 0.35]], sh = sacude(t, golpes, 40);
  ctx.save(); ctx.translate(sh[0], sh[1]);
  if (t < T_CORTE) { ctx.save(); ctxGiro(ctx, 540, 1200, -0.07 * sm(0.3, 1.1, t) + 0.01 * Math.sin(t * 30)); cabina(ctx, t, { dx: 0, giro: 0.4 + 0.9 * sm(0, 1.1, t), chispas: 0.55 }); ctx.restore(); }
  else if (t < T_AFUERA) { const u = E.in(cl((t - T_CORTE) / (T_LLENA - T_CORTE))), s = lerp(0.35, 1.52, u), y = lerp(1180, 1880, u);
   paisaje(ctx, t, { hy: 1030, off: 0, sx: 820 }); ctx.fillStyle = '#251a33'; ctx.beginPath(); ctx.moveTo(760, 1030); ctx.lineTo(W + 200, 1030); ctx.lineTo(W + 200, HH + 200); ctx.lineTo(1200, HH + 200); ctx.closePath(); ctx.fill();
   ctx.fillStyle = '#8f7f6a'; ctx.beginPath(); ctx.moveTo(-200, HH + 200); ctx.lineTo(380, 1030); ctx.lineTo(720, 1030); ctx.lineTo(1260, HH + 200); ctx.closePath(); ctx.fill();
   ctx.fillStyle = '#5a4a3a'; for (let k = 0; k < 9; k++) { const d = k / 9, yy = lerp(1030, HH + 100, d * d), w = lerp(180, 1500, d * d); ctx.fillRect(540 - w / 2, yy, w, 6 + 30 * d); }
   ctx.strokeStyle = '#e6e9ef'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(470, 1030); ctx.lineTo(-60, HH + 100); ctx.moveTo(610, 1030); ctx.lineTo(1140, HH + 100); ctx.stroke();
   trenFrente(ctx, t, 540, y, s, { incl: -0.11 * u, chispas: T_CORTE + 0.1 }); }
  else { planoBorde(ctx, t, { x: 1150 + (t - T_AFUERA) * 140, s: 0.85, chispas: T_AFUERA }); }
  ctx.restore(); fogonazo(ctx, t, [[T_LLENA, 0.9]]);
 }, sfx(k) { k.noise(0, { dur: S(2), color: 'brown', filter: 'lowpass', f: 500, gain: 0.12, a: 0.02, hold: S(2) - 0.4 }); for (let x = 0.05; x < S(2); x += 0.21) k.play('tick', x, { f: 700, gain: 0.16, minor: true });
  k.tone(0.4, { f: [[0, 2600], [0.8, 3400]], type: 'sawtooth', dur: 1.0, gain: 0.03, filter: 'bandpass', f2: 3000, a: 0.1 }); FX.chispa(k, 0.55, 0.7, 0.8);
  k.play('whoosh', T_CORTE - 0.05, { dur: 0.3, top: 2600, gain: 0.35, minor: true }); k.tone(T_CORTE + 0.1, { f: 'E4', dur: 0.7, gain: 0.08 }); k.tone(T_CORTE + 0.1, { f: 'G#4', dur: 0.7, gain: 0.06 });
  k.play('thud', T_LLENA, { f: 40, gain: 1.0 }); k.noise(T_LLENA, { dur: 1.2, color: 'brown', filter: 'lowpass', f: [[0, 1600], [1.2, 120]], gain: 0.35, a: 0.003 }); k.tone(T_LLENA, { f: 1180, type: 'triangle', dur: 0.9, gain: 0.06, verb: 0.5 }); k.tone(T_LLENA, { f: 1730, type: 'triangle', dur: 0.7, gain: 0.04, verb: 0.5 }); FX.chispa(k, T_LLENA, 1.0, 1.2);
  k.play('whoosh', T_AFUERA - 0.05, { dur: 0.5, top: 1800, gain: 0.3, minor: true }); } });

 // ---------- 2 · ¿Por qué no se sale? → VISTA DESDE ARRIBA de la curva junto al precipicio ----------
 B.push({ t0: S(2), t1: S(3), in: { type: 'zoom', d: 0.4, x: 540, y: 900 }, draw(ctx, t) {
  const cam = camK(t, [[S(2), 600, 960, 0.8], [S(3), 580, 960, 0.88]]); ctx.save(); zoomP(ctx, cam); curvaArriba(ctx, t, { tren: true, ang0: Math.PI * 0.75 + (t - S(2)) * 0.12 }); ctx.restore();
  const q = sm(Tk.sale - 0.4, Tk.sale, t); if (q > 0) { ctx.save(); ctx.globalAlpha = q; txt(ctx, '?', 300, 1150, 260 * E.out(q), YE, { w: 900, f: 'Fredoka' }); ctx.restore(); }
 }, sfx(k) { k.play('whoosh', S(2), { dur: 0.6, top: 1600, gain: 0.3, minor: true }); for (let x = S(2); x < S(3); x += 0.22) k.play('tick', x, { f: 650, gain: 0.12, minor: true }); FX.aparece(k, Tk.sale - 0.3, 500); } });

 // ---------- 3 · el secreto está en algo que nunca has mirado → cámara baja: el tren pasa y la cámara baja a una rueda borrosa ----------
 B.push({ t0: S(3), t1: S(4), in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const cam = camK(t, [[S(3), 540, 980, 0.9], [Tk.nunca, 540, 1060, 1.3], [S(4), 400, 1150, 2.1]]); ctx.save(); zoomP(ctx, cam); paisaje(ctx, t, { hy: 920, off: t * 260, sx: 820 }); ctx.fillStyle = '#6a5a46'; ctx.fillRect(-400, 1180, W + 800, 900); piedras(ctx, 1220, 1900, 220, 6);
  ctx.fillStyle = '#8f7f6a'; ctx.fillRect(-400, 1150, W + 800, 60); ctx.strokeStyle = '#e6e9ef'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-400, 1152); ctx.lineTo(W + 400, 1152); ctx.stroke();
  trenLado(ctx, t, 1500 - (t - S(3)) * 260, 1152, 0.62, { coches: 3, giro: 18 }); ctx.restore();
  const q = sm(Tk.nunca - 0.2, Tk.nunca + 0.3, t); if (q > 0) { ctx.save(); ctx.globalAlpha = q; ctx.strokeStyle = YE; ctx.lineWidth = 12; ctx.setLineDash([24, 16]); ctx.beginPath(); ctx.arc(540, 980, 220 + 10 * Math.sin(t * 6), 0, TAU); ctx.stroke(); ctx.setLineDash([]); txt(ctx, '?', 540, 980, 200, YE, { w: 900, f: 'Fredoka' }); ctx.restore(); }
 }, sfx(k) { k.noise(S(3), { dur: S(4) - S(3), color: 'brown', filter: 'lowpass', f: 600, gain: 0.12, a: 0.1 }); for (let x = S(3); x < S(4); x += 0.18) k.play('tick', x, { f: 700, gain: 0.14, minor: true }); FX.revelar(k, Tk.nunca - 0.2); } });

 // ---------- 4 · pon un vaso de plástico a rodar sobre la mesa → el vaso de lado sobre la mesa, empieza a rodar ----------
 B.push({ t0: S(4), t1: S(5), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const cam = camK(t, [[S(4), 540, 960, 1.0], [S(5), 560, 1000, 1.12]]); ctx.save(); zoomP(ctx, cam);
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#3a2a40'); g.addColorStop(1, '#1a1220'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, HH + 400); P.glow(ctx, 540, 700, 700, '255,200,140', 0.25); mesaMadera(ctx, -200, 1040, W + 400, 1000);
  const ro = sm(Tk.vaso - 0.3, Tk.mesa, t), xx = lerp(380, 640, ro); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(xx, 1100, 280, 30, 0, 0, TAU); ctx.fill(); vaso(ctx, xx, 900, 1.6, -0.06 + ro * 0.5);
  ctx.restore(); P.tag(ctx, 'VASO DE PLÁSTICO', 470, 520, t, Tk.vaso - 0.2, S(5), { mono: true, col: YE, px: 56 });
 }, sfx(k) { k.play('pop', Tk.vaso - 0.2, { f: 520, gain: 0.3 }); FX.etiqueta(k, Tk.vaso - 0.2); k.noise(Tk.vaso, { dur: 1.6, color: 'pink', filter: 'bandpass', f: 1400, q: 1.5, gain: 0.05, a: 0.2 }); } });

 // ---------- 5 · no va recto: gira en círculo… porque una boca es más ancha → DESDE ARRIBA: el vaso traza un círculo; bocas de color ----------
 B.push({ t0: S(5), t1: S(8), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const cx = 540, cy = 960, Rc = 330, a = (t - S(5)) * 1.2 - 1.2, colores = t > Tk.boca - 0.2, vx0 = cx + Math.cos(a) * (Rc + 60), vy0 = cy + Math.sin(a) * (Rc + 60), zf = sm(Tk.boca - 0.6, Tk.boca, t), cam = [lerp(540, vx0, zf), lerp(960, vy0, zf), lerp(0.95, 1.55, zf)]; ctx.save(); zoomP(ctx, cam);
  mesaMadera(ctx, -600, -600, W + 1200, HH + 1200);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 8; ctx.setLineDash([20, 18]); ctx.beginPath(); ctx.arc(cx, cy, Rc + 60, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  if (t < Tk.recto + 0.3) { ctx.strokeStyle = RD; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(cx + Rc + 60, cy - 500); ctx.lineTo(cx + Rc + 60, cy + 500); ctx.stroke(); marcaX(ctx, cx + Rc + 60, cy - 300, 90, sm(Tk.recto - 0.2, Tk.recto + 0.1, t)); }
  const vx = cx + Math.cos(a) * (Rc + 60), vy = cy + Math.sin(a) * (Rc + 60); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(vx + 10, vy + 14, 180, 120, a, 0, TAU); ctx.fill(); vaso(ctx, vx, vy, 1.05, a + Math.PI / 2, { colores });
  ctx.restore();
  if (colores) { P.tag(ctx, 'BOCA ANCHA', 470, 520, t, Tk.boca - 0.2, Tk.boca + 0.9, { mono: true, col: NAR, px: 60 }); P.tag(ctx, 'BOCA ESTRECHA', 470, 520, t, Tk.boca + 0.9, S(8), { mono: true, col: AZ, px: 58 }); }
  else P.tag(ctx, 'GIRA EN CÍRCULO', 470, 520, t, Tk.circulo - 0.3, Tk.boca - 0.2, { mono: true, col: YE, px: 58 });
 }, sfx(k) { k.noise(S(5), { dur: S(8) - S(5), color: 'pink', filter: 'bandpass', f: 1300, q: 1.5, gain: 0.05, a: 0.2, hold: 3 }); k.play('error', Tk.recto, { f: 'D3', gain: 0.2, minor: true }); FX.etiqueta(k, Tk.circulo - 0.3); FX.etiqueta(k, Tk.boca - 0.2); FX.etiqueta(k, Tk.boca + 0.9); } });

 // ---------- 6 · ¿Y las ruedas del tren? → PRIMER PLANO DE LA RUEDA sobre el riel, girando, chispas ----------
 B.push({ t0: S(8), t1: S(9), in: { type: 'zoom', d: 0.45, x: 540, y: 1000 }, draw(ctx, t) {
  const cam = camK(t, [[S(8), 540, 960, 0.9], [S(9), 540, 990, 1.12]]); ctx.save(); zoomP(ctx, cam); paisaje(ctx, t, { hy: 700, off: t * 500, sx: 900 });
  ctx.fillStyle = '#c9ced8'; ctx.fillRect(-300, 380, W + 600, 220); ctx.fillStyle = '#e63946'; ctx.fillRect(-300, 560, W + 600, 30); ctx.fillStyle = '#2a2d34'; ctx.fillRect(-300, 600, W + 600, 160);
  ruedaLado(ctx, t, 540, 960, 300, { giro: 7, vel: 900, chispas: S(8) + 0.1 }); ctx.restore();
 }, sfx(k) { k.play('whoosh', S(8), { dur: 0.6, top: 1400, gain: 0.3, minor: true }); for (let x = S(8); x < S(9); x += 0.16) k.play('tick', x, { f: 800, gain: 0.16, minor: true }); FX.chispa(k, S(8) + 0.1, 1.0, 0.6); k.play('riser', S(8) + 0.3, { dur: S(9) - S(8) - 0.3, gain: 0.3, minor: true }); } });

 // ---------- 7 · No son cilindros. Son ligeramente CÓNICAS → rayos X: cilindro tachado y ¡CLANG!, el cono de colores ----------
 B.push({ t0: S(9), t1: S(11), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const golpes = [[T_SECRETO, 1.2]], sh = sacude(t, golpes, 44), cono = t >= T_SECRETO, cam = camK(t, [[S(9), 540, 960, 1.0], [T_SECRETO, 540, 960, 1.05], [S(11), 540, 960, 1.15]]);
  ctx.save(); zoomP(ctx, cam, sh); ctx.fillStyle = '#0a1a33'; ctx.fillRect(-300, -300, W + 600, HH + 600); ctx.strokeStyle = 'rgba(143,216,255,0.12)'; ctx.lineWidth = 2; for (let gx = -300; gx <= W + 300; gx += 50) { ctx.beginPath(); ctx.moveTo(gx, -300); ctx.lineTo(gx, HH + 300); ctx.stroke(); } for (let gy = -300; gy <= HH + 300; gy += 50) { ctx.beginPath(); ctx.moveTo(-300, gy); ctx.lineTo(W + 300, gy); ctx.stroke(); }
  if (!cono) { ctx.fillStyle = '#6b7280'; ctx.beginPath(); ctx.roundRect(340, 620, 400, 560, 20); ctx.fill(); ctx.strokeStyle = '#c9ced8'; ctx.lineWidth = 6; ctx.stroke(); txt(ctx, 'CILINDRO', 540, 1260, 54, '#c9ced8', { w: 900, f: 'Fredoka' }); marcaX(ctx, 540, 900, 260, sm(Tk.cilindros - 0.2, Tk.cilindros + 0.1, t)); }
  else { ruedaCono(ctx, t, 720, 930, 420, { brillo: 1 - sm(T_SECRETO + 0.6, T_SECRETO + 1.4, t), giro: 3 }); if (t > Tk.vaso2 - 0.4) { const v = sm(Tk.vaso2 - 0.4, Tk.vaso2, t); ctx.save(); ctx.globalAlpha *= v; vaso(ctx, 520, 1420, 0.9, Math.PI); ctx.restore(); } }
  ctx.restore(); fogonazo(ctx, t, golpes);
  P.tag(ctx, 'NO SON CILINDROS', 470, 520, t, Tk.cilindros - 0.3, T_SECRETO, { mono: true, col: RD, px: 58 }); P.tag(ctx, 'SON CÓNICAS', 470, 520, t, T_SECRETO + 0.05, S(11), { mono: true, col: NAR, px: 64 });
 }, sfx(k) { k.play('error', Tk.cilindros, { f: 'C3', gain: 0.3 }); FX.etiqueta(k, Tk.cilindros - 0.3); k.play('thud', T_SECRETO, { f: 45, gain: 1.0 }); k.tone(T_SECRETO, { f: 880, type: 'triangle', dur: 1.6, gain: 0.08, verb: 0.6 }); k.tone(T_SECRETO, { f: 1318, type: 'triangle', dur: 1.3, gain: 0.06, verb: 0.6 }); k.tone(T_SECRETO + 0.01, { f: 2093, type: 'sine', dur: 1.0, gain: 0.04, verb: 0.6 }); k.noise(T_SECRETO, { dur: 0.25, filter: 'highpass', f: 3000, gain: 0.3, a: 0.001 }); FX.etiqueta(k, T_SECRETO + 0.05); } });

 // ---------- 8 · y van unidas por un eje rígido: las dos giran a la vez → EJE EN RAYOS X con las dos ruedas ----------
 B.push({ t0: S(11), t1: S(13), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const e = sm(Tk.eje - 0.2, Tk.eje + 0.3, t), gi = sm(Tk.giran - 0.3, Tk.giran, t), cam = camK(t, [[S(11), 540, 1110, 0.88], [S(13), 540, 1100, 0.95]]);
  ctx.fillStyle = '#0a1a33'; ctx.fillRect(0, 0, W, HH); ctx.save(); zoomP(ctx, cam); ejeRX(ctx, t, 540, 1300, 1.0, { colores: true, eje: e, giro: gi }); ctx.restore();
  P.tag(ctx, 'EJE RÍGIDO', 470, 520, t, Tk.eje - 0.2, Tk.giran - 0.3, { mono: true, col: CY, px: 62 }); P.tag(ctx, 'GIRAN A LA VEZ', 470, 520, t, Tk.giran - 0.3, S(13), { mono: true, col: YE, px: 58 });
 }, sfx(k) { k.play('whoosh', S(11), { dur: 0.5, top: 1600, gain: 0.25, minor: true }); k.tone(Tk.eje - 0.1, { f: [[0, 200], [0.5, 420]], type: 'triangle', dur: 0.6, gain: 0.06 }); FX.etiqueta(k, Tk.eje - 0.2); FX.etiqueta(k, Tk.giran - 0.3); for (let i = 0; i < 6; i++) k.play('tick', Tk.giran + i * 0.25, { f: 1200, gain: 0.12, minor: true }); } });

 // ---------- 9 · en la curva, el tren se corre un poquito hacia fuera → DESDE ARRIBA: el eje en la curva se desplaza hacia fuera ----------
 B.push({ t0: S(13), t1: S(14), in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const sh = 40 * E.inOut(win(t, S(13) + 0.6, Tk.fuera + 0.2)), cam = camK(t, [[S(13), 300, 960, 0.75], [Tk.fuera - 0.6, 140, 930, 2.4], [S(14), 130, 930, 2.5]]);
  ctx.save(); zoomP(ctx, cam); curvaArriba(ctx, t, { cx: 1300, cy: 960, R: 1150, eje: true, ejeAng: Math.PI, shift: sh });
  if (sh > 2) { const xa = 150 - sh; ctx.strokeStyle = YE; ctx.fillStyle = YE; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(xa + 40, 830); ctx.lineTo(xa - 70, 830); ctx.stroke(); ctx.beginPath(); ctx.moveTo(xa - 100, 830); ctx.lineTo(xa - 62, 806); ctx.lineTo(xa - 62, 854); ctx.closePath(); ctx.fill(); }
  ctx.restore(); P.tag(ctx, 'UN POQUITO HACIA FUERA', 470, 520, t, Tk.fuera - 1.0, S(14), { mono: true, col: YE, px: 52 });
 }, sfx(k) { k.play('whoosh', S(13), { dur: 0.6, top: 1200, gain: 0.25, minor: true }); k.noise(Tk.fuera - 0.6, { dur: 0.8, color: 'pink', filter: 'bandpass', f: 900, q: 1, gain: 0.06, a: 0.2 }); FX.etiqueta(k, Tk.fuera - 1.0); } });

 // ---------- 10 · la rueda de fuera se apoya en su parte más ANCHA… → RAYOS X: contacto naranja (fuera, ancha) y azul (dentro, estrecha) ----------
 B.push({ t0: S(14), t1: S(15), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const sh = 45, m = sm(Tk.ancha - 0.6, Tk.ancha - 0.1, t), cam = camK(t, [[S(14), 540, 1110, 0.85], [S(15), 540, 1100, 0.92]]);
  ctx.fillStyle = '#0a1a33'; ctx.fillRect(0, 0, W, HH); ctx.save(); zoomP(ctx, cam); ejeRX(ctx, t, 540, 1300, 1.0, { colores: true, shift: sh, marca: m }); ctx.restore();
  P.tag(ctx, 'FUERA: PARTE ANCHA', 470, 520, t, Tk.ancha - 0.5, S(15), { mono: true, col: NAR, px: 56 });
 }, sfx(k) { k.play('whoosh', S(14), { dur: 0.5, top: 1600, gain: 0.25, minor: true }); k.play('ding', Tk.ancha - 0.3, { f: 'C6', gain: 0.18 }); FX.etiqueta(k, Tk.ancha - 0.5); } });

 // ---------- 11 · y recorre más camino en cada vuelta → DESDE ARRIBA: una vuelta por de fuera (naranja, larga) y por dentro (azul, corta) ----------
 B.push({ t0: S(15), t1: S(16), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  const q = cl((t - S(15) - 0.1) / (S(16) - S(15) - 0.3)), cam = camK(t, [[S(15), 200, 1200, 1.7], [S(16), 190, 1210, 1.85]]);
  ctx.save(); zoomP(ctx, cam); curvaArriba(ctx, t, { cx: 1300, cy: 960, R: 1150, dist: q }); ctx.restore();
  P.tag(ctx, 'MÁS CAMINO POR VUELTA', 470, 520, t, Tk.camino - 0.4, S(16), { mono: true, col: NAR, px: 54 });
 }, sfx(k) { for (let i = 0; i < 6; i++) k.play('pop', S(15) + 0.2 + i * 0.3, { f: 500 + i * 60, gain: 0.2, minor: true }); FX.etiqueta(k, Tk.camino - 0.4); } });

 // ---------- 12 · la de dentro, en la más ESTRECHA → RAYOS X: primer plano de la rueda de dentro (azul) ----------
 B.push({ t0: S(16), t1: S(17), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  const cam = camK(t, [[S(16), 540, 1100, 0.92], [S(17), 540, 1100, 0.98]]);
  ctx.fillStyle = '#0a1a33'; ctx.fillRect(0, 0, W, HH); ctx.save(); zoomP(ctx, cam); ejeRX(ctx, t, 540, 1300, 1.0, { colores: true, shift: 45, marca: 1 }); ctx.restore();
  P.tag(ctx, 'DENTRO: PARTE ESTRECHA', 470, 520, t, Tk.estrecha - 0.6, S(17), { mono: true, col: AZ, px: 54 });
 }, sfx(k) { k.play('whoosh', S(16), { dur: 0.4, top: 1400, gain: 0.25, minor: true }); k.play('ding', Tk.estrecha - 0.3, { f: 'G5', gain: 0.18 }); FX.etiqueta(k, Tk.estrecha - 0.6); } });

 // ---------- 13 · Resultado: el tren gira solo. Como el vaso. → DENTRO DEL VAGÓN: pasajeros que se agarran… y el vaso que rueda en la mesa ----------
 B.push({ t0: S(17), t1: S(20), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const ln = -0.07 * Math.sin(Math.min(1, (t - S(17)) / 1.2) * Math.PI / 2), miedo = 1 - sm(Tk.solo - 0.3, Tk.solo + 0.3, t), cam = camK(t, [[S(17), 540, 960, 1.0], [S(20), 560, 1000, 1.08]]);
  ctx.save(); zoomP(ctx, cam); ctx.fillStyle = '#d9dee6'; ctx.fillRect(-200, -200, W + 400, HH + 400);
  ctx.save(); ctx.beginPath(); for (const wx of [-40, 380, 800]) ctx.roundRect(wx, 420, 340, 380, 40); ctx.clip(); ctx.save(); ctxGiro(ctx, 540, 610, ln * 2); paisaje(ctx, t, { hy: 760, off: t * 700, sx: 600 }); ctx.restore(); ctx.restore();
  ctx.strokeStyle = '#9aa3b2'; ctx.lineWidth = 14; for (const wx of [-40, 380, 800]) { ctx.beginPath(); ctx.roundRect(wx, 420, 340, 380, 40); ctx.stroke(); }
  ctx.fillStyle = '#c9ced8'; ctx.fillRect(-200, 340, W + 400, 30); ctx.fillStyle = '#8a909c'; ctx.fillRect(150, 300, 18, 1100);
  ctx.fillStyle = '#2b4a8a'; for (const sx of [40, 640]) { ctx.beginPath(); ctx.roundRect(sx, 900, 400, 380, 40); ctx.fill(); }
  pasajero(ctx, 240, 1180, 1.0, { miedo, incl: ln * 1.5, agarra: miedo > 0.4, ropa: '#3d6fb6' }); pasajero(ctx, 840, 1180, 1.0, { miedo, incl: ln * 1.5, ropa: '#c0533e', piel: '#b27a55', pelo: '#111' });
  pasajero(ctx, 250, 1480, 1.0, { miedo, incl: ln * 2.2, agarra: true, ropa: '#3a7a4a' });
  mesaMadera(ctx, 300, 1260, 500, 200); const v = sm(Tk.vaso3 - 0.6, Tk.vaso3 - 0.2, t); if (v > 0) { const a = (t - Tk.vaso3 + 0.6) * 3; vaso(ctx, 550 + Math.cos(a) * 120, 1330 + Math.sin(a) * 40, 0.45, a + Math.PI / 2, { colores: true }); }
  ctx.restore(); P.tag(ctx, 'GIRA SOLO', 470, 520, t, Tk.solo - 0.3, S(20), { mono: true, col: GR, px: 64 });
 }, sfx(k) { k.noise(S(17), { dur: S(20) - S(17), color: 'brown', filter: 'lowpass', f: 400, gain: 0.12, a: 0.2, hold: 2.5 }); k.noise(S(17) + 0.1, { dur: 0.8, color: 'pink', filter: 'bandpass', f: 2200, q: 3, gain: 0.04, a: 0.1 }); FX.correcto(k, Tk.solo); FX.etiqueta(k, Tk.solo - 0.3); k.noise(Tk.vaso3 - 0.5, { dur: 1.0, color: 'pink', filter: 'bandpass', f: 1400, q: 1.5, gain: 0.05, a: 0.2 }); } });

 // ---------- 14 · ¿Y la pestaña…? Es solo un seguro → PRIMER PLANO de la rueda con la pestaña en rojo; escudo ----------
 B.push({ t0: S(20), t1: S(22), in: { type: 'zoom', d: 0.4, x: 540, y: 1000 }, draw(ctx, t) {
  const pe = sm(Tk.pestana - 0.3, Tk.pestana + 0.1, t), seg = sm(Tk.seguro - 0.2, Tk.seguro + 0.2, t), cam = camK(t, [[S(20), 540, 1000, 1.0], [Tk.seguro, 560, 1060, 1.15], [S(22), 600, 1080, 1.2]]);
  ctx.save(); zoomP(ctx, cam); paisaje(ctx, t, { hy: 700, off: t * 400, sx: 300 }); ctx.fillStyle = '#c9ced8'; ctx.fillRect(-300, 380, W + 600, 220); ctx.fillStyle = '#2a2d34'; ctx.fillRect(-300, 600, W + 600, 160);
  ruedaLado(ctx, t, 540, 960, 300, { giro: 5, vel: 700, pestana: pe }); ctx.restore();
  if (seg > 0) P.icon(ctx, 'escudo', 830, 820, 200 * E.out(seg), { mode: 'flat', col: GR, col2: '#0b1622' });
  P.tag(ctx, 'LA PESTAÑA', 470, 520, t, Tk.pestana - 0.3, Tk.seguro - 0.3, { mono: true, col: RD, px: 62 }); P.tag(ctx, 'SOLO UN SEGURO', 470, 520, t, Tk.seguro - 0.2, S(22), { mono: true, col: GR, px: 60 });
 }, sfx(k) { k.play('whoosh', S(20), { dur: 0.5, top: 1400, gain: 0.25, minor: true }); FX.etiqueta(k, Tk.pestana - 0.3); FX.etiqueta(k, Tk.seguro - 0.2); FX.correcto(k, Tk.seguro); for (let x = S(20); x < S(22); x += 0.2) k.play('tick', x, { f: 800, gain: 0.1, minor: true }); } });

 // ---------- 15 · la vía se inclina: el riel de fuera va más alto → VÍA DE FRENTE: se inclina ----------
 B.push({ t0: S(22), t1: S(24), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const a = 0.13 * E.inOut(win(t, Tk.inclina - 0.6, Tk.alto)), cam = camK(t, [[S(22), 540, 960, 0.9], [S(24), 540, 960, 1.0]]);
  ctx.save(); zoomP(ctx, cam); paisaje(ctx, t, { hy: 980, off: t * 40, sx: 820 }); ctx.fillStyle = '#5a4a3a'; ctx.fillRect(-300, 1180, W + 700, 900); piedras(ctx, 1500, 2000, 200, 8);
  viaFrente(ctx, t, 540, 1260, 1.0, a); trenFrente(ctx, t, 540 - 110 * Math.sin(a), 1260 - 110 * Math.cos(a), 0.95, { incl: -a });
  if (a > 0.02) { const al = sm(Tk.alto - 0.4, Tk.alto, t), xr = 540 + 210 * Math.cos(a) + 100, ytop = 1260 - 110 - 210 * Math.sin(a); ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = YE; ctx.fillStyle = YE; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(xr, 1150 + 40); ctx.lineTo(xr, ytop); ctx.stroke(); ctx.beginPath(); ctx.moveTo(xr, ytop - 30); ctx.lineTo(xr - 22, ytop + 6); ctx.lineTo(xr + 22, ytop + 6); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.restore(); P.tag(ctx, 'RIEL DE FUERA MÁS ALTO', 470, 520, t, Tk.alto - 0.6, S(24), { mono: true, col: YE, px: 52 });
 }, sfx(k) { k.play('whoosh', S(22), { dur: 0.6, top: 1200, gain: 0.25, minor: true }); k.noise(Tk.inclina - 0.5, { dur: 1.0, color: 'brown', filter: 'bandpass', f: 300, q: 1, gain: 0.1, a: 0.3 }); FX.etiqueta(k, Tk.alto - 0.6); } });

 // ---------- 16 · es el peralte, y contrarresta el empujón hacia fuera → tren de frente en la curva peraltada, con flechas ----------
 B.push({ t0: S(24), t1: S(25), in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const a = 0.13, fl = sm(Tk.empujon - 0.4, Tk.empujon, t), cam = camK(t, [[S(24), 540, 960, 1.0], [S(25), 540, 980, 1.08]]);
  ctx.save(); zoomP(ctx, cam); paisaje(ctx, t, { hy: 980, off: t * 40, sx: 820 }); ctx.fillStyle = '#5a4a3a'; ctx.fillRect(-300, 1180, W + 700, 900); piedras(ctx, 1500, 2000, 200, 8);
  viaFrente(ctx, t, 540, 1260, 1.0, a); trenFrente(ctx, t, 540 - 110 * Math.sin(a), 1260 - 110 * Math.cos(a), 0.95, { incl: -a });
  if (fl > 0) { ctx.save(); ctx.globalAlpha = fl; for (const [col, x0, x1, y] of [[RD, 700, 980, 820], [GR, 980, 720, 920]]) { ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1 - Math.sign(x1 - x0) * 40, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - Math.sign(x1 - x0) * 60, y - 40); ctx.lineTo(x1 - Math.sign(x1 - x0) * 60, y + 40); ctx.closePath(); ctx.fill(); } ctx.restore(); }
  ctx.restore(); P.tag(ctx, 'PERALTE', 470, 520, t, Tk.peralte - 0.3, S(25), { mono: true, col: YE, px: 66 });
 }, sfx(k) { FX.etiqueta(k, Tk.peralte - 0.3); k.play('whoosh', Tk.empujon - 0.4, { dur: 0.5, top: 1400, gain: 0.25 }); FX.correcto(k, Tk.empujon + 0.4); } });

 // ---------- 17 · así gira el tren junto al precipicio… gracias a un CONO → plano general breve y PRIMER PLANO FINAL de la rueda cónica ----------
 B.push({ t0: S(25), t1: S(27), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const t1 = Tk.precipicio2 + 0.4;
  if (t < t1) { planoBorde(ctx, t, { x: 1150 + (t - S(25)) * 140, s: 0.85 }); }
  else { const z = lerp(0.95, 1.12, E.out(win(t, t1, S(27)))), br = sm(Tk.cono - 0.4, Tk.cono, t);
   ctx.save(); ctx.translate(540, 980); ctx.scale(z, z); ctx.translate(-540, -980); paisaje(ctx, t, { hy: 760, off: t * 500, sx: 300 }); ctx.fillStyle = '#6a5a46'; ctx.fillRect(-300, 1300, W + 600, 900);
   ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.moveTo(-200, 1330); ctx.quadraticCurveTo(540, 1250, W + 200, 1290); ctx.lineTo(W + 200, 1360); ctx.quadraticCurveTo(540, 1320, -200, 1400); ctx.closePath(); ctx.fill();
   ruedaCono(ctx, t, 750, 960, 430, { brillo: br, giro: 6 }); chispasLoop(ctx, 640, 1310, t, t1, 6, 120, 0.3, -1); ctx.restore(); }
  P.tag(ctx, 'GRACIAS A UN CONO', 470, 520, t, Tk.cono - 0.4, S(27), { mono: true, col: NAR, px: 58 });
 }, sfx(k) { k.noise(S(25), { dur: S(27) - S(25), color: 'brown', filter: 'lowpass', f: 500, gain: 0.1, a: 0.2, hold: 3 }); for (let x = S(25); x < S(27); x += 0.2) k.play('tick', x, { f: 750, gain: 0.12, minor: true }); k.play('whoosh', Tk.precipicio2 + 0.35, { dur: 0.5, top: 1800, gain: 0.3 }); k.tone(Tk.cono - 0.1, { f: 'C5', dur: 1.4, gain: 0.06, verb: 0.5 }); k.tone(Tk.cono - 0.05, { f: 'G5', dur: 1.2, gain: 0.05, verb: 0.5 }); FX.etiqueta(k, Tk.cono - 0.4); } });

 // ---------- 18 · CIERRE ----------
 B.push({ t0: S(27), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#24406e'); g.addColorStop(1, '#141a2a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  P.ctaShare(ctx, t, S(27) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { paisaje(cc, t, { hy: 1030, off: 0, sx: 820 }); cc.fillStyle = '#8f7f6a'; cc.fillRect(0, 1030, W, 900); trenFrente(cc, t, 540, 1600, 1.3, { incl: -0.1 }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(27) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'noche', capBorde: true, marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: [],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 300, gain: 0.02, a: 0.05, hold: DURATION - 2.5 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 96, gain: 0.45, chords: [['E2', 'B2', 'E3', 'G3'], ['C2', 'G2', 'C3', 'E3'], ['D2', 'A2', 'D3', 'F#3'], ['B1', 'F#2', 'B2', 'D#3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
