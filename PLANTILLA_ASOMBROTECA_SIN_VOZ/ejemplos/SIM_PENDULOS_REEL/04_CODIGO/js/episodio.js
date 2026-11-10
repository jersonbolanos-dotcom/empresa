// =====================================================================================================
// episodio.js — «¿Volverán a alinearse?» · FORMATO: PÉNDULOS · Plantilla Asombroteca SIN_VOZ 2.2
// Onda de péndulos clásica (Berg 1991): 15 péndulos cuelgan lado a lado de una barra horizontal, cada uno de su propio par de anclajes
// (suspensión en V: solo oscilan perpendiculares a la barra). En γ = 34 s el péndulo n completa K + n oscilaciones
// (T_n = γ / (K + n), L_n = g·(T_n / 2π)²): se desfasan —serpiente, ondas, caos aparente— y a los 34 s vuelven a alinearse.
// Vista 3D en perspectiva, un poco desde arriba (cámara fija), con sombras sobre la base. Solo el contador de segundos.
// Sonido: cada paso por la vertical suena con una nota según el péndulo (en la realineación, un acorde).
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 const TH0 = 0.36;
 const S = SIM.pendulos({ n: 15, gamma: TL.param.gamma ?? 34, K: TL.param.K ?? 36, theta0: TH0, extra: 4 });
 const NB = S.n, ZV = 0.89 / S.L[0], LV = (k) => S.L[k] * ZV, L0 = LV(0);   // escala visual (la física, T y L, no cambia)

 // ---------- 2 · ESCENA 3D (metros) ----------
 // eje X: a lo largo de la barra (péndulo k) · eje Z: dirección de oscilación · eje Y: arriba. La barra está en Y = 0.
 const SP = 0.085, XK = (k) => (k - (NB - 1) / 2) * SP, BH = 0.028;          // separación entre péndulos y media abertura de la V
 const YB = -(L0 + 0.1), BX = XK(0) - 0.12, BX1 = XK(NB - 1) + 0.12, BZ = 0.4;  // base: tabla bajo los péndulos (los postes se apoyan en ella)
 const CAM = { yaw: -0.55, pitch: 0.55, d: 3.2, F: 1680, cx: 532, cy: 765, c: [0, -0.5, 0] };
 const ca = Math.cos(CAM.yaw), sa = Math.sin(CAM.yaw), cp = Math.cos(CAM.pitch), sp = Math.sin(CAM.pitch);
 const pr = (x, y, z) => { x -= CAM.c[0]; y -= CAM.c[1]; z -= CAM.c[2];
  const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y2 = y * cp + z1 * sp, z2 = z1 * cp - y * sp, s = CAM.F / (CAM.d + z2);
  return [CAM.cx + x1 * s, CAM.cy - y2 * s, s, z2]; };
 const COL = Array.from({ length: NB }, (_, k) => `hsl(${(190 + k * 22) % 360},95%,62%)`);
 const bob3 = (k, t) => { const th = S.theta(k, t), L = LV(k); return [XK(k), -L * Math.cos(th), L * Math.sin(th)]; };
 window.PEND_INFO = { L: S.L, T: S.T, esquinas: [[BX, 0, 0], [BX1, 0, 0], [BX, YB, -BZ], [BX1, YB, -BZ], [BX, YB, BZ], [BX1, YB, BZ]].map((p) => pr(...p).slice(0, 2).map(Math.round)) };

 const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y, z], i) => { const [a, b] = pr(x, y, z); if (i) ctx.lineTo(a, b); else ctx.moveTo(a, b); }); ctx.closePath(); };
 const line = (ctx, p, q) => { const [a, b] = pr(...p), [c, d] = pr(...q); ctx.moveTo(a, b); ctx.lineTo(c, d); };

 // ---------- 3 · DIBUJO ----------
 function draw(ctx, t) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // base de madera oscura (tabla con canto) y sombras de las bolas sobre ella (luz cenital)
  ctx.fillStyle = '#1a1f33'; poly(ctx, [[BX, YB, -BZ], [BX1, YB, -BZ], [BX1, YB, BZ], [BX, YB, BZ]]); ctx.fill();
  ctx.strokeStyle = 'rgba(170,185,230,0.35)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#121626'; poly(ctx, [[BX, YB, BZ], [BX1, YB, BZ], [BX1, YB - 0.04, BZ], [BX, YB - 0.04, BZ]]); ctx.fill();
  ctx.fillStyle = '#0f1322'; poly(ctx, [[BX, YB, -BZ], [BX, YB, BZ], [BX, YB - 0.04, BZ], [BX, YB - 0.04, -BZ]]); ctx.fill();
  for (let k = 0; k < NB; k++) { const [x, , z] = bob3(k, t), [a, b, s] = pr(x, YB, z); ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(a, b, 0.038 * s, 0.017 * s, 0, 0, TAU); ctx.fill(); }
  // marco: dos postes que se apoyan en la base y la barra horizontal arriba
  ctx.strokeStyle = 'rgba(205,215,240,0.75)'; ctx.lineWidth = 7; ctx.beginPath(); line(ctx, [BX, YB, 0], [BX, 0.02, 0]); line(ctx, [BX1, YB, 0], [BX1, 0.02, 0]); ctx.stroke();
  ctx.lineWidth = 9; ctx.beginPath(); line(ctx, [BX, 0.02, 0], [BX1, 0.02, 0]); ctx.stroke();
  // al realinearse, un destello a lo largo de la fila
  const al = Math.exp(-Math.pow((t - S.gamma) / 0.4, 2));
  // péndulos, de atrás hacia delante (orden por profundidad)
  const ord = Array.from({ length: NB }, (_, k) => k).map((k) => [k, pr(...bob3(k, t))[3]]).sort((a, b) => b[1] - a[1]);
  for (const [k] of ord) { const c = COL[k], p = bob3(k, t), [bx, by, s] = pr(...p);
   // estela corta
   for (let q = 1; q <= 5; q++) { const [ex, ey, es] = pr(...bob3(k, t - q * 0.035)); ctx.globalAlpha = 0.13 * (1 - q / 6); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(ex, ey, 0.034 * es, 0, TAU); ctx.fill(); }
   ctx.globalAlpha = 1;
   // hilos en V desde sus dos anclajes en la barra
   ctx.strokeStyle = 'rgba(230,235,255,0.45)'; ctx.lineWidth = 1.4; ctx.beginPath(); line(ctx, [XK(k) - BH, 0, 0], p); line(ctx, [XK(k) + BH, 0, 0], p); ctx.stroke();
   ctx.fillStyle = 'rgba(220,228,250,0.9)'; for (const dx of [-BH, BH]) { const [a, b] = pr(XK(k) + dx, 0, 0); ctx.beginPath(); ctx.arc(a, b, 3, 0, TAU); ctx.fill(); }
   // bola
   const r = 0.034 * s, g = ctx.createRadialGradient(bx - r * 0.35, by - r * 0.35, r * 0.1, bx, by, r); g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, c); g.addColorStop(1, c);
   if (al > 0.02) P.glow(ctx, bx, by, r * 3.2, '255,213,74', 0.5 * al);
   ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fill(); }
  if (al > 0.02) { ctx.globalAlpha = al * 0.8; ctx.strokeStyle = '#ffd54a'; ctx.lineWidth = 3; ctx.setLineDash([10, 10]); ctx.beginPath(); for (let k = 0; k < NB; k++) { const [a, b] = pr(...bob3(k, S.gamma)); if (k) ctx.lineTo(a, b); else ctx.moveTo(a, b); } ctx.stroke(); ctx.setLineDash([]); }
  ctx.restore();
  R.contador(ctx, t, (Math.round(t * 10) / 10).toFixed(1).replace('.', ','), { x: 420, y: 1345, px: 100, sufijo: ' s', glow: '120,200,255' });
  R.pregunta(ctx, t, { y: 300, px: 72 }); R.frase(ctx, t, { y: 300, px: 58 });
 }

 // ---------- 4 · SONIDO: cada paso por la vertical ----------
 const EVP = S.cruces.filter((c) => c.t < D).map((c) => ({ t: c.t, p: 5 + c.n * 1, v: 0.55, pan: (c.n / (NB - 1) - 0.5) * 0.8 }));
 function sound(k) { R.asmr(k, EVP, { voz: 'cristal', maxBin: 3, bin: 1 / 50, dens: 30, gain: 0.8 }); R.asmr(k, [{ t: S.gamma, p: 15, v: 0.9 }, { t: S.gamma, p: 17, v: 0.7 }, { t: S.gamma, p: 19, v: 0.7 }], { voz: 'campana', maxBin: 3, gain: 0.8 }); }

 const EP = R.make({ draw, sound, eventos: () => EVP.map((e) => e.t).concat([S.gamma]) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
