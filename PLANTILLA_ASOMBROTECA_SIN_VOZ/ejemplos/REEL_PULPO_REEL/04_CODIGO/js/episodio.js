// =====================================================================================================
// episodio.js — «¿Cuántos corazones tiene un pulpo?» · FORMATO: ADIVINA ANTES DE QUE ACABE · Plantilla Asombroteca SIN_VOZ
// Pregunta → tres opciones (pop) → cuenta atrás de 5 s con tictac → revelación con sonido → explicación → «Comenta tu respuesta».
// El pulpo descansa sobre la arena (nada flota). Datos y fuentes en FUENTES_Y_DECISIONES.md.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;
 const ESTILO = 'asombroteca', MARCA = 'ASOMBROTECA';

 // ---------- 1 · TIEMPOS ----------
 const QUIZ = { opciones: ['Uno', 'Dos', 'Tres'], correcta: 2, t0: R.t('opciones'), paso: 0.3, tRevela: R.t('revela'), y0: 650, gap: 170, h: 132 };
 const CUENTA = { t0: R.t('cuenta'), n: 5, y: 1215, r: 84 };
 const T2 = R.t('branquias'), tB = R.t('branquias'), tC = R.t('cuerpo'), tA = R.t('azul');

 // ---------- 2 · FONDO MARINO Y PULPO ----------
 const fondoMar = (ctx, t, yS) => { R.fondo(ctx, t, { c0: '#22327a', c1: '#1a2360', c2: '#0f1638', glow: '90,170,255', gy: 900 });
  // rayos de luz que se mueven
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const x = 140 + i * 210 + Math.sin(t * 0.5 + i) * 40; const g = ctx.createLinearGradient(0, 0, 0, yS); g.addColorStop(0, 'rgba(160,210,255,0.08)'); g.addColorStop(1, 'rgba(160,210,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x + 140, yS); ctx.lineTo(x - 60, yS); ctx.fill(); } ctx.restore();
  // arena
  const g = ctx.createLinearGradient(0, yS - 30, 0, 1920); g.addColorStop(0, '#d9b97a'); g.addColorStop(1, '#8a6a3c'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, yS); for (let x = 0; x <= 1080; x += 30) ctx.lineTo(x, yS + Math.sin(x * 0.011) * 14); ctx.lineTo(1080, 1920); ctx.lineTo(0, 1920); ctx.fill();
  const RG = H.rng(3); for (let i = 0; i < 40; i++) { const x = RG() * 1080, y = yS + 30 + RG() * (1920 - yS), r = 4 + RG() * 12; ctx.fillStyle = `rgba(90,70,40,${0.25 + RG() * 0.3})`; ctx.beginPath(); ctx.ellipse(x, y, r * 1.4, r * 0.7, 0, 0, TAU); ctx.fill(); }
  // burbujas que suben
  const RB = H.rng(9); for (let i = 0; i < 18; i++) { const x0 = RB() * 1080, sp = 60 + RB() * 80, ph = RB() * 30, y = yS - ((t * sp + ph * 60) % (yS + 100)), r = 4 + RB() * 9; ctx.strokeStyle = 'rgba(220,240,255,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x0 + Math.sin(t * 2 + i) * 10, y, r, 0, TAU); ctx.stroke(); } };
 const corazon = (ctx, x, y, s, col, beat) => { const k = s * (1 + 0.12 * beat); ctx.save(); ctx.translate(x, y); ctx.scale(k / 30, k / 30); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 10); ctx.bezierCurveTo(-30, -10, -16, -34, 0, -18); ctx.bezierCurveTo(16, -34, 30, -10, 0, 10); ctx.fill(); ctx.restore(); };
 // pulpo apoyado: yB = suelo; xr = rayos X (0..1); hb / hs = resalte corazones branquiales / sistémico; az = sangre azul
 function pulpo(ctx, x, yB, s, t, o = {}) { const xr = o.xr || 0; ctx.save(); ctx.translate(x, yB); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(40,25,10,0.35)'; ctx.beginPath(); ctx.ellipse(0, 6, 420, 34, 0, 0, TAU); ctx.fill();
  const arm = (i, front) => { const side = i < 4 ? -1 : 1, j = i % 4, bx = side * (25 + j * 22), gx = side * (170 + j * 70), tip = side * (250 + j * 75), w0 = 34 - j * 3, wig = Math.sin(t * 1.6 + i * 1.3) * 18;
   const pts = []; for (let q = 0; q <= 80; q++) { const u = q / 80; let px, py; if (u < 0.5) { const v = u / 0.5; px = lerp(bx, gx, v) + side * Math.sin(v * Math.PI) * 30; py = lerp(-120, -8, E.inOut(v)); } else { const v = (u - 0.5) / 0.5; px = lerp(gx, tip, v) - side * Math.pow(v, 4) * 40; py = -8 - Math.pow(v, 3) * (55 + wig); } pts.push([px, py]); }
   ctx.fillStyle = front ? '#e8705c' : '#c4523f'; for (let q = 0; q < pts.length; q++) { const r = w0 * (1 - q / pts.length * 0.85); ctx.beginPath(); ctx.arc(pts[q][0], pts[q][1], r / 2, 0, TAU); ctx.fill(); }
   if (front) { ctx.fillStyle = '#f7c9b6'; for (let q = 40; q < pts.length; q += 6) { const r = w0 * (1 - q / pts.length * 0.85) * 0.18; ctx.beginPath(); ctx.arc(pts[q][0], pts[q][1] + r * 1.5, r, 0, TAU); ctx.fill(); } } };
  [1, 2, 5, 6].forEach((i) => arm(i, false));
  // manto (cabeza) que respira
  const br = 1 + 0.03 * Math.sin(t * 2.2); ctx.save(); ctx.translate(0, -250); ctx.scale(br, 1 / br); ctx.rotate(-0.08);
  const g = ctx.createRadialGradient(-50, -60, 20, 0, 0, 220); g.addColorStop(0, '#ff9a80'); g.addColorStop(1, '#c2493a'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, -30, 150, 190, 0, 0, TAU); ctx.fill();
  const RS = H.rng(5); ctx.fillStyle = 'rgba(150,40,30,0.35)'; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc((RS() - 0.5) * 200, -120 + RS() * 180, 6 + RS() * 10, 0, TAU); ctx.fill(); }
  if (xr > 0) { // rayos X: branquias, corazones y vasos
   ctx.globalAlpha = xr; ctx.fillStyle = 'rgba(30,10,40,0.55)'; ctx.beginPath(); ctx.ellipse(0, -30, 132, 172, 0, 0, TAU); ctx.fill();
   const vas = o.az > 0 ? `rgba(${lerp(230, 70, o.az)},${lerp(230, 150, o.az)},255,0.95)` : 'rgba(230,230,240,0.8)'; ctx.strokeStyle = vas; ctx.lineWidth = 7; ctx.lineCap = 'round';
   ctx.beginPath(); for (const sd of [-1, 1]) { ctx.moveTo(sd * 62, 40); ctx.lineTo(sd * 100, 10); ctx.moveTo(sd * 100, 10); ctx.quadraticCurveTo(sd * 60, -20, 0, 20); } ctx.moveTo(0, 20); ctx.lineTo(0, 170); ctx.moveTo(0, 150); ctx.lineTo(-60, 190); ctx.moveTo(0, 150); ctx.lineTo(60, 190); ctx.stroke();
   if (o.az > 0) P.glow(ctx, 0, 60, 160, '80,150,255', 0.4 * o.az);
   for (const sd of [-1, 1]) { ctx.fillStyle = 'rgba(255,190,200,0.75)'; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(sd * (100 + k * 2), -10 + k * 7, 26 - k * 3, 7, sd * 0.5, 0, TAU); ctx.fill(); } }
   const bt = (tt) => Math.max(0, Math.sin(tt * TAU * 1.3)) ** 6;
   for (const sd of [-1, 1]) { corazon(ctx, sd * 62, 46, 36 + 14 * (o.hb || 0), '#ff4d6d', bt(t)); if (o.hb) P.glow(ctx, sd * 62, 42, 90, '255,90,120', 0.45 * o.hb); }
   corazon(ctx, 0, 24, 46 + 16 * (o.hs || 0), '#ff2d55', bt(t + 0.3)); if (o.hs) P.glow(ctx, 0, 26, 110, '255,60,100', 0.5 * o.hs);
   ctx.globalAlpha = 1; }
  ctx.restore();
  // ojos
  for (const sd of [-1, 1]) { ctx.fillStyle = '#fff4d8'; ctx.beginPath(); ctx.ellipse(sd * 62, -150, 30, 26, 0, 0, TAU); ctx.fill(); const bl = (t % 3.7) < 0.12 ? 0.15 : 1; ctx.fillStyle = '#1b1b1b'; ctx.beginPath(); ctx.ellipse(sd * 62 + Math.sin(t * 0.7) * 6, -146, 15, 6 * bl, 0, 0, TAU); ctx.fill(); }
  [0, 3, 4, 7].forEach((i) => arm(i, true));
  ctx.restore(); }

 // ---------- 3 · ESCENAS ----------
 const B = [];
 B.push({ t0: 0, t1: T2, in: { type: 'cut' }, draw(ctx, t) {
  fondoMar(ctx, t, 1560);
  pulpo(ctx, 540, 1600, 0.62, t);
  R.quiz(ctx, t, QUIZ); R.cuentaAtras(ctx, t, CUENTA);
  R.titulares(ctx, t, { y: 340 });
 }, sfx(k) { R.quizSfx(k, QUIZ); R.cuentaAtrasSfx(k, CUENTA); } });
 B.push({ t0: T2, t1: D, in: { type: 'zoom', d: 0.5, x: 540, y: 1420 }, draw(ctx, t) {
  fondoMar(ctx, t, 1540);
  const hb = sm(tB, tB + 0.4, t) * (1 - sm(tC - 0.1, tC + 0.3, t)), hs = sm(tC, tC + 0.4, t) * (1 - sm(tA - 0.1, tA + 0.3, t)), az = sm(tA, tA + 0.6, t);
  pulpo(ctx, 540, 1585, 1.6, t, { xr: sm(T2 + 0.3, T2 + 0.9, t), hb, hs, az });
  R.titulares(ctx, t, { y: 360, pos: { comenta: { y: 470, px: 74 } } });
 }, sfx(k) { FX.latido(k, tB + 0.3, 2, 0.75, 0.7); FX.latido(k, tC + 0.3, 2, 0.75, 0.9); } });

 // ---------- 4 · MONTAJE ----------
 const EP = R.make({ estilo: ESTILO, marca: MARCA, beats: B, loop: 0.5, marcaY: 285 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
