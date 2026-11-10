// =====================================================================================================
// episodio.js — «¿Dónde caerá la última bola?» · FORMATO: GALTON · Plantilla Asombroteca SIN_VOZ 2.0
// 2.000 bolitas caen por 16 filas de clavos con gravedad, choques y rebote reales (SIM.galton, precalculado con H.rng) y se apilan
// en 17 casillas: sale la campana de Gauss. La última bola cae sola al final. Después se abre la compuerta y el tablero se vacía
// (bucle). Cada clavo tocado suena (madera, más grave cuanto más abajo) y se ilumina; cada bola que llega a su casilla, una gota.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 const G = { x0: 540, yPeg0: 490, filas: 16, dx: 46, dy: 30, pegR: 8, r: 3.4, nBolas: TL.param.nBolas ?? 2000, tIni: -1.2, pre: 1.2, tFin: D - 7, tUltima: D - 5.7, yFondo: 1392, e: 0.5, fric: 0.7, drag: 1.5, vMax: 800, seed: TL.semilla };
 const S = SIM.galton({ dur: D, ...G }), FPS = S.fps, U = S.ultima, tLlega = S.llegada[U], tVac = Math.min(D - 1.0, tLlega + 0.55);
 const HUE = (id) => (200 + (id / S.nB) * 320) % 360, COLS = Array.from({ length: S.nB }, (_, i) => `hsl(${HUE(i)},92%,60%)`);
 // llegada ordenada por casilla (para contar cuántas hay apiladas en cada instante)
 const pil = S.pilas.map((p) => p.map((i) => ({ i, t: S.llegada[i], s: S.sl[i] })).sort((a, b) => a.s - b.s));
 // clavos tocados por fotograma (para iluminarlos)
 const golpes = Array.from({ length: S.NF }, () => []); S.eventos.forEach((e) => { if (e.tipo === 'clavo') { const f = Math.round(e.t * FPS); if (f < S.NF) golpes[f].push(e.fila * 100 + e.col); } });
 const llegadas = S.eventos.filter((e) => e.tipo === 'casilla').map((e) => e.t);
 // campana ajustada a lo que salió (media y desviación de las casillas): la física real no es una binomial perfecta
 const HN = S.pilas.map((p) => p.length), NT = HN.reduce((a, b) => a + b, 0), MU = HN.reduce((a, v, k) => a + v * k, 0) / NT, SD = Math.sqrt(HN.reduce((a, v, k) => a + v * (k - MU) ** 2, 0) / NT);
 const peg = (rr, j) => [G.x0 + (j - rr / 2) * G.dx, G.yPeg0 + rr * G.dy];

 // ---------- 2 · DIBUJO ----------
 function draw(ctx, t) {
  const f = Math.min(S.NF - 1, Math.round(t * FPS)), vac = Math.max(0, t - tVac), drop = 0.5 * 2600 * vac * vac, fadeV = 1 - cl(vac / 0.7);
  ctx.save();
  // tolva con las bolas que faltan
  const lanz = S.sal.reduce((a, s) => a + (s <= t ? 1 : 0), 0), quedan = S.nB - lanz, nivel = quedan / S.nB, ref = sm(D - 0.9, D, t);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(G.x0 - 120, 400); ctx.lineTo(G.x0 - 14, G.yPeg0 - 52); ctx.moveTo(G.x0 + 120, 400); ctx.lineTo(G.x0 + 14, G.yPeg0 - 52); ctx.stroke();
  const RH = H.rng(11), nh = Math.round(Math.max(nivel, ref) * 160); for (let q = 0; q < nh; q++) { const u = RH(), w = lerp(26, 220, u), yy = lerp(G.yPeg0 - 58, 404, u) + Math.sin(t * 6 + q) * 0.8, xx = G.x0 + (RH() - 0.5) * w; ctx.fillStyle = COLS[Math.floor(RH() * S.nB)]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(xx, yy, G.r, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1;
  // clavos (los tocados en los últimos fotogramas brillan)
  const hot = new Map(); for (let b = 0; b < 4; b++) for (const key of golpes[Math.max(0, f - b)] || []) hot.set(key, Math.max(hot.get(key) || 0, 1 - b / 4));
  for (let rr = 0; rr < G.filas; rr++) for (let j = 0; j <= rr; j++) { const [px, py] = peg(rr, j), h = hot.get(rr * 100 + j) || 0; ctx.fillStyle = h ? `rgba(255,${200 + 55 * h},${120 + 120 * h},${0.55 + 0.45 * h})` : 'rgba(210,215,235,0.55)'; ctx.beginPath(); ctx.arc(px, py, G.pegR * (0.62 + 0.2 * h), 0, TAU); ctx.fill(); if (h > 0.7) P.glow(ctx, px, py, 26, '255,220,150', 0.25 * h); }
  // guías laterales y separadores de las casillas
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(G.x0 - G.dx * 0.75, G.yPeg0 - G.dy * 1.2); ctx.lineTo(S.binL, S.yBin); ctx.moveTo(G.x0 + G.dx * 0.75, G.yPeg0 - G.dy * 1.2); ctx.lineTo(S.binL + S.nBins * G.dx, S.yBin); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k <= S.nBins; k++) { const x = S.binL + k * G.dx; ctx.moveTo(x, S.yBin + 6); ctx.lineTo(x, S.yF + 4); } ctx.stroke();
  // compuerta del piso: cada tramo se desliza en horizontal y deja una ranura (no baja, no tapa la marca de agua)
  const ab = E.inOut(cl(vac / 0.3)) * (1 - sm(D - 0.75, D - 0.6, t)); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 4; ctx.beginPath(); for (let k = 0; k < S.nBins; k++) { const x = S.binL + k * G.dx; ctx.moveTo(x, S.yF + 4); ctx.lineTo(x + G.dx * (1 - 0.7 * ab), S.yF + 4); } ctx.stroke();
  // al vaciar, las bolas salen por la ranura: nada se dibuja por debajo del piso
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1080, S.yF + 2); ctx.clip();
  // bolas apiladas
  for (let k = 0; k < S.nBins; k++) { const p = pil[k]; for (let q = 0; q < p.length; q++) { const b = p[q]; if (b.t > t) continue; const [x, y] = S.slot(k, b.s); const isU = b.i === U; ctx.globalAlpha = fadeV; ctx.fillStyle = isU ? '#ffffff' : COLS[b.i]; ctx.beginPath(); ctx.arc(x, y + drop, G.r * (isU ? 1.5 : 1), 0, TAU); ctx.fill(); if (isU && fadeV > 0) P.glow(ctx, x, y + drop, 60, '255,255,255', 0.6 * fadeV); } }
  ctx.restore();
  // bolas en vuelo
  const A = S.activas(f); for (let q = 0; q < A.length; q += 3) { const id = A[q + 2], isU = id === U; ctx.globalAlpha = 1; ctx.fillStyle = isU ? '#ffffff' : COLS[id]; ctx.beginPath(); ctx.arc(A[q], A[q + 1], G.r * (isU ? 1.5 : 1), 0, TAU); ctx.fill(); if (isU) P.glow(ctx, A[q], A[q + 1], 70, '255,255,255', 0.55); }
  ctx.globalAlpha = 1;
  // campana de Gauss (normal con la media y la desviación de lo que cayó) sobre las casillas, cuando ya cayeron casi todas
  const cg = sm(D - 6.6, D - 5.6, t) * fadeV; if (cg > 0) { const hL = 2 * G.r * 0.9 / S.per; ctx.strokeStyle = `rgba(255,213,74,${0.9 * cg})`; ctx.lineWidth = 5; ctx.shadowColor = 'rgba(255,213,74,0.8)'; ctx.shadowBlur = 14; ctx.beginPath();
   for (let q = 0; q <= 160; q++) { const xb = -0.5 + q / 160 * S.nBins, z = (xb - MU) / SD, dens = NT * Math.exp(-z * z / 2) / (SD * Math.sqrt(TAU)), x = S.binL + (xb + 0.5) * G.dx, y = S.yF - dens * hL * 1.0; q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.shadowBlur = 0; }
  ctx.restore();
  // contador: bolas que ya llegaron (se vacía con el tablero)
  const c = S.cuenta(f), lt = (() => { let lo = 0, hi = llegadas.length; while (lo < hi) { const m = (lo + hi) >> 1; if (llegadas[m] <= t) lo = m + 1; else hi = m; } return lo ? llegadas[lo - 1] : -9; })();
  R.contador(ctx, t, Math.round(c * fadeV), { x: 245, y: 640, px: 116, glow: '255,150,220', bump: 1 - cl((t - lt) / 0.12) });
  R.pregunta(ctx, t, { y: 318 }); R.frase(ctx, t, { y: 318 });
 }

 // ---------- 3 · SONIDO ----------
 function sound(k) { const ev = S.eventos;
  R.asmr(k, ev.filter((e) => e.tipo === 'clavo' && e.t < tVac).map((e) => ({ t: e.t, p: 22 - e.fila * 0.8, v: 0.25 + 0.6 * cl(e.v / 500), pan: (e.col - e.fila / 2) / 9 })), { voz: 'madera', maxBin: 2, bin: 1 / 60, dens: 90, gain: 0.75 });
  R.asmr(k, ev.filter((e) => e.tipo === 'casilla' && e.t < tVac).map((e) => ({ t: e.t, p: 3 + e.k * 0.75, v: 0.3 + 0.4 * e.v, pan: (e.k - 8) / 10 })), { voz: 'gota', maxBin: 1, bin: 1 / 40, dens: 50, gain: 0.55 });
  R.asmr(k, [{ t: tLlega, p: 15, v: 1 }, { t: tLlega, p: 17, v: 0.8 }, { t: tLlega, p: 19, v: 0.7 }], { voz: 'campana', maxBin: 3, gain: 1 });
  k.noise(tVac, { dur: 1.0, color: 'pink', filter: 'lowpass', f: [[0, 3000], [1.0, 400]], gain: 0.10, a: 0.05 }); R.asmr(k, Array.from({ length: 40 }, (_, q) => ({ t: tVac + q * 0.022, p: 12 + (q % 7), v: 0.3 })), { voz: 'tic', maxBin: 1, bin: 0.02, gain: 0.5 });
 }

 const EP = R.make({ draw, sound, eventos: () => S.eventos.map((e) => e.t).concat([tVac]) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
