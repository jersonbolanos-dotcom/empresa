// =====================================================================================================
// episodio.js — «¿Llenarán el círculo antes del final?» · FORMATO: REBOTE · Plantilla Asombroteca SIN_VOZ 2.0
// Una bola rebota dentro de un círculo; cuando toca el borde y ya «maduró» (tDiv s desde su última división) se divide en dos,
// como una bacteria. Choques elásticos reales entre bolas (SIM.rebote, precalculado y determinista con H.rng).
// Cada choque suena: borde = madera (tono según la velocidad), bola-bola = tic suave, nacimiento = gota que sube con la cantidad.
// tDiv está ajustado para que el círculo se llene justo antes del final; después todo vuelve a UNA bola (bucle).
// Dato y fuente: FUENTES_Y_DECISIONES.md.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 const C = { cx: 540, cy: 830, R: 430, r: 13 }, V0 = 620, T_COL = 1.2;
 const S = SIM.rebote({ dur: D, ...C, v0: V0, tDiv: TL.param.tDiv ?? 2.3, nMax: TL.param.nMax ?? 620, seed: TL.semilla, tColapso: T_COL });
 const tC = D - T_COL, FPS = S.fps;
 const COL = Array.from({ length: S.nMax }, (_, i) => `hsl(${(185 + i * 137.508) % 360},92%,${58 + (S.gen[i] % 3) * 4}%)`);   // arcoíris con el ángulo áureo
 const nacimientos = S.eventos.filter((e) => e.tipo === 'nace').map((e) => e.t);
 const ultimoNac = (t) => { let lo = 0, hi = nacimientos.length; while (lo < hi) { const m = (lo + hi) >> 1; if (nacimientos[m] <= t) lo = m + 1; else hi = m; } return lo ? nacimientos[lo - 1] : -9; };
 const x0 = S.x(0, 0), y0 = S.y(0, 0);

 // ---------- 2 · DIBUJO (lee el fotograma precalculado) ----------
 function draw(ctx, t) {
  const f = Math.min(S.NF - 1, Math.round(t * FPS)), n = S.n(f), col = E.inOut(win(t, tC, D - 0.15)), lleno = S.tLleno != null ? sm(S.tLleno, S.tLleno + 0.3, t) * (1 - col) : 0;
  // el recipiente: aro fino que brilla al llenarse
  ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${0.22 + 0.5 * lleno})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(C.cx, C.cy, C.R + 2, 0, TAU); ctx.stroke();
  if (lleno > 0) P.glow(ctx, C.cx, C.cy, C.R * 1.25, '255,213,74', 0.18 * lleno);
  // estelas cortas (2 fotogramas atrás) y bolas
  for (let back = 2; back >= 1; back--) { const fb = Math.max(0, f - back), nb = S.n(fb); ctx.globalAlpha = (back === 1 ? 0.22 : 0.1) * (1 - col); for (let i = 0; i < nb; i++) { ctx.fillStyle = COL[i]; ctx.beginPath(); ctx.arc(S.x(fb, i), S.y(fb, i), C.r * (back === 1 ? 0.8 : 0.6), 0, TAU); ctx.fill(); } }
  ctx.globalAlpha = 1;
  for (let i = 0; i < n; i++) { let x = S.x(f, i), y = S.y(f, i), rr = C.r * (0.45 + 0.55 * E.out(cl((t - S.born[i]) / 0.18))), a = 1;
   if (col > 0) { x = lerp(x, x0, col); y = lerp(y, y0, col); if (i > 0) a = 1 - col; }
   if (a <= 0.01) continue; ctx.globalAlpha = a; ctx.fillStyle = COL[i]; ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.arc(x - rr * 0.32, y - rr * 0.32, rr * 0.3, 0, TAU); ctx.fill(); }
  ctx.restore();
  // contador: bolas (al final baja de vuelta a 1)
  const v = col > 0 ? Math.max(1, Math.round(Math.pow(n, 1 - col))) : n, bump = 1 - cl((t - ultimoNac(t)) / 0.22);
  R.contador(ctx, t, v, { y: 1345, glow: '120,220,255', bump: col > 0 ? 0 : bump });
  R.pregunta(ctx, t); R.frase(ctx, t);
 }

 // ---------- 3 · SONIDO (de los eventos de la simulación) ----------
 function sound(k) {
  const ev = S.eventos;
  R.asmr(k, ev.filter((e) => e.tipo === 'borde' && e.t < tC).map((e) => ({ t: e.t, p: 4 + (e.v / V0) * 7, v: 0.35 + 0.5 * cl(e.v / V0), pan: Math.cos(e.ang) * 0.6 })), { voz: 'madera', maxBin: 2, dens: 45, gain: 0.9 });
  R.asmr(k, ev.filter((e) => e.tipo === 'choque' && e.t < tC).map((e) => ({ t: e.t, p: 9 + cl(e.v / V0) * 8, v: 0.15 + 0.4 * cl(e.v / V0) })), { voz: 'tic', maxBin: 1, dens: 80, gain: 0.6 });
  R.asmr(k, ev.filter((e) => e.tipo === 'nace').map((e) => ({ t: e.t, p: 8 + Math.log2(e.n + 1) * 1.6, v: 0.7 })), { voz: 'gota', maxBin: 1, bin: 1 / 30, dens: 30, gain: 0.8 });
  if (S.tLleno != null) R.asmr(k, [0, 2, 4].map((q) => ({ t: S.tLleno, p: 12 + q, v: 0.8 })), { voz: 'campana', maxBin: 3, gain: 0.9 });
  k.tone(tC, { f: [[0, 520], [1.0, 130]], dur: 1.1, gain: 0.06, a: 0.05, verb: 0.4 }); R.EV.push(tC);
 }

 const EP = R.make({ draw, sound, eventos: () => S.eventos.map((e) => e.t).concat([tC]) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
