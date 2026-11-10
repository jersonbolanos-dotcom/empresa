// =====================================================================================================
// episodio.js — «¿Volverán a alinearse?» · FORMATO: PÉNDULOS · Plantilla Asombroteca SIN_VOZ 2.2
// Onda de péndulos (Berg 1991): 15 péndulos cuelgan de una barra fija sostenida por dos postes. En γ = 34 s el péndulo n completa
// K + n oscilaciones (T_n = γ / (K + n), L_n = g·(T_n / 2π)²), así que se desfasan —serpiente, ondas, caos aparente— y a los 34 s
// vuelven a estar alineados. A la derecha, el número de oscilaciones de cada uno. Sonido: cada paso por la vertical suena con una nota
// según el péndulo (en la realineación, todas a la vez: un acorde).
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 const S = SIM.pendulos({ n: 15, gamma: TL.param.gamma ?? 34, K: TL.param.K ?? 14, theta0: 0.33, extra: 4 });
 const PIV = { x: 500, y: 420 }, NB = S.n, PX = 640 / S.L[0];   // escala: el más largo mide 640 px
 const ROT = []; { let yl = -1e9; for (let k = 0; k < NB; k++) { const y = S.L[k] * PX; ROT[k] = Math.abs(yl - y) >= 36; if (ROT[k]) yl = y; } } // rótulos sin encimarse

 const COL = Array.from({ length: NB }, (_, k) => `hsl(${(190 + k * 22) % 360},95%,62%)`);
 const bob = (k, t) => { const L = S.L[k] * PX, th = S.theta(k, t); return [PIV.x + L * Math.sin(th), PIV.y + L * Math.cos(th)]; };

 // ---------- 2 · DIBUJO ----------
 function draw(ctx, t) {
  ctx.save();
  // estructura fija: barra superior sostenida por dos postes que llegan al suelo (los hilos cuelgan de ella)
  const base = 1160; ctx.strokeStyle = 'rgba(200,210,235,0.5)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(170, PIV.y); ctx.lineTo(830, PIV.y); ctx.moveTo(190, PIV.y); ctx.lineTo(190, base); ctx.moveTo(810, PIV.y); ctx.lineTo(810, base); ctx.moveTo(140, base); ctx.lineTo(860, base); ctx.stroke(); ctx.fillStyle = 'rgba(200,210,235,0.12)'; ctx.fillRect(140, base, 720, 10);
  ctx.fillStyle = 'rgba(200,210,235,0.7)'; ctx.beginPath(); ctx.arc(PIV.x, PIV.y, 9, 0, TAU); ctx.fill();
  // estelas suaves (0,25 s) y péndulos
  for (let k = NB - 1; k >= 0; k--) { const c = COL[k];
   ctx.strokeStyle = c; for (let q = 1; q <= 6; q++) { const [x, y] = bob(k, t - q * 0.04); ctx.globalAlpha = 0.12 * (1 - q / 7); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 15, 0, TAU); ctx.fill(); }
   ctx.globalAlpha = 1; const [x, y] = bob(k, t); ctx.strokeStyle = 'rgba(230,235,255,0.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(PIV.x, PIV.y); ctx.lineTo(x, y); ctx.stroke();
   const g = ctx.createRadialGradient(x - 5, y - 5, 2, x, y, 17); g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, c); g.addColorStop(1, c); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 16, 0, TAU); ctx.fill();
   // oscilaciones completas de cada péndulo, a la derecha de su altura de reposo
   if (ROT[k]) R.chico(ctx, String(S.oscilaciones(k, t)), 905, PIV.y + S.L[k] * PX + 11, { px: 32, col: c, kind: 'eje', align: 'right' }); }
  // al realinearse, un destello sobre la línea vertical
  const al = Math.exp(-Math.pow((t - S.gamma) / 0.35, 2)); if (al > 0.02) { ctx.globalAlpha = al; ctx.strokeStyle = '#ffd54a'; ctx.lineWidth = 4; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(PIV.x + S.L[NB - 1] * PX * Math.sin(0.33), PIV.y + S.L[NB - 1] * PX * 0.9); ctx.lineTo(PIV.x + S.L[0] * PX * Math.sin(0.33), PIV.y + S.L[0] * PX * 1.02); ctx.stroke(); ctx.setLineDash([]); P.glow(ctx, 540, 860, 400, '255,213,74', 0.2 * al); }
  ctx.restore();
  R.contador(ctx, t, (Math.round(t * 10) / 10).toFixed(1).replace('.', ','), { x: 470, y: 1300, px: 104, sufijo: ' s', glow: '120,200,255' });
  R.pregunta(ctx, t, { y: 300, px: 72 }); R.frase(ctx, t, { y: 300, px: 58 });
 }

 // ---------- 3 · SONIDO: cada paso por la vertical ----------
 const EVP = S.cruces.filter((c) => c.t < D).map((c) => ({ t: c.t, p: 5 + c.n * 1, v: 0.55, pan: c.sentido * 0.3 }));
 function sound(k) { R.asmr(k, EVP, { voz: 'cristal', maxBin: 3, bin: 1 / 50, dens: 30, gain: 0.8 }); R.asmr(k, [{ t: S.gamma, p: 15, v: 0.9 }, { t: S.gamma, p: 17, v: 0.7 }, { t: S.gamma, p: 19, v: 0.7 }], { voz: 'campana', maxBin: 3, gain: 0.8 }); }

 const EP = R.make({ draw, sound, eventos: () => EVP.map((e) => e.t).concat([S.gamma]) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
