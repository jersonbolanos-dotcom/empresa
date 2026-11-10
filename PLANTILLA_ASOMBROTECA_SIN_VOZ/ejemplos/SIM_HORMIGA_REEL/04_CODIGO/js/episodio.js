// =====================================================================================================
// episodio.js — «¿Qué construirá la hormiga?» · FORMATO: HORMIGA · Plantilla Asombroteca SIN_VOZ 2.3
// Hormiga de Langton (SIM.hormiga, sin azar): en casilla vacía gira a la derecha, en casilla llena a la izquierda, invierte la casilla
// y avanza. Unos 10.000 pasos de caos y, de pronto, una «autopista» diagonal que se repite cada 104 pasos. Los primeros 2,5 s van paso
// a paso; luego se acelera hasta el inicio de la autopista y se frena para verla construirse. La cámara encuadra SIEMPRE todas las
// casillas tocadas (con anticipación), dentro de la zona segura. Abajo, las dos reglas dibujadas. Sonido: un tic por paso (más agudo
// en casilla vacía) y, en la autopista, un pulso cada 104 pasos.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · RELOJ DE PASOS: lento → acelera (exponencial) → autopista a ritmo fijo ----------
 const T1 = TL.param.lento ?? 2.5, TA = TL.param.tAutopista ?? 21.5, RIT = TL.param.ritmo ?? 300, V0 = 5, T_FIN = D - 2.6;
 const KA = 9976;   // paso en que empieza la autopista (se comprueba abajo con la simulación)
 const DT = 1 / 600, rate = (t, b) => (t < T1 ? V0 : t < TA ? V0 * Math.exp(b * (t - T1)) : t < TA + 1.5 ? lerp(V0 * Math.exp(b * (TA - T1)), RIT, E.inOut(cl((t - TA) / 1.5))) : RIT);
 const integra = (b, hasta) => { let K = 0; for (let t = 0; t < hasta; t += DT) K += rate(t, b) * DT; return K; };
 let bl = 0.05, bh = 1; for (let q = 0; q < 60; q++) { const m = (bl + bh) / 2; if (integra(m, TA) < KA) bl = m; else bh = m; } const B = (bl + bh) / 2;
 const NS = Math.ceil(D / DT) + 2, KT = new Float64Array(NS); for (let i = 1; i < NS; i++) KT[i] = KT[i - 1] + (i * DT < T_FIN ? rate((i - 1) * DT, B) * DT : 0);
 const Kt = (t) => { const u = cl(t, 0, D) / DT, i = Math.min(NS - 2, Math.floor(u)); return lerp(KT[i], KT[i + 1], u - i); };
 const tK = (k) => { let lo = 0, hi = NS - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (KT[m] < k) lo = m + 1; else hi = m; } return lo === 0 ? 0 : (lo - 1 + (k - KT[lo - 1]) / Math.max(1e-9, KT[lo] - KT[lo - 1])) * DT; };
 const S = SIM.hormiga({ pasos: Math.ceil(KT[NS - 1]) + 2, W: 640 }); const NK = S.N;
 window.HORMIGA_INFO = { autopista: S.autopista, pasos: NK, b: B, tAut: tK(S.autopista) };

 // ---------- 2 · CÁMARA: encuadra todas las casillas tocadas (mira 1 s adelante), suavizada y precalculada ----------
 const BOX = { x0: 130, y0: 420, x1: 950, y1: 1215 }, AREA = { x0: 175, y0: 455, x1: 905, y1: 1180 };   // tablero y zona útil (dentro de la zona segura)
 const fit = (c) => Math.min(46, (AREA.x1 - AREA.x0) / (c[2] - c[0] + 7), (AREA.y1 - AREA.y0) / (c[3] - c[1] + 7));
 const NF = Math.round(D * 30) + 1, CAM = []; { let s = null, cx = 0, cy = 0;
  for (let f = 0; f < NF; f++) { const t = f / 30, ca = S.caja(Kt(t) + 1), cb = S.caja(Kt(Math.min(T_FIN, t + 1.0)) + 1), st = fit(cb), mx = (cb[0] + cb[2] + 1) / 2, my = (cb[1] + cb[3] + 1) / 2;
   if (s === null) { s = st; cx = mx; cy = my; } else { s = lerp(s, st, 0.08); cx = lerp(cx, mx, 0.08); cy = lerp(cy, my, 0.08); }
   let sc = Math.min(s, fit(ca)); const hw = (AREA.x1 - AREA.x0) / 2 / sc, hh = (AREA.y1 - AREA.y0) / 2 / sc;
   let X = cl(cx, ca[2] + 1 + 2 - hw, ca[0] - 2 + hw), Y = cl(cy, ca[3] + 1 + 2 - hh, ca[1] - 2 + hh); CAM.push([sc, X, Y]); s = sc; } }
 const camAt = (t) => { const u = cl(t * 30, 0, NF - 1), i = Math.min(NF - 2, Math.floor(u)), a = CAM[i], b = CAM[i + 1], q = u - i; return [lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q)]; };
 const XC = (AREA.x0 + AREA.x1) / 2, YC = (AREA.y0 + AREA.y1) / 2;

 // ---------- 3 · DIBUJO ----------
 const W = S.W, NC = S.celdas.length, CX = new Int16Array(NC), CY = new Int16Array(NC); S.celdas.forEach((c, j) => { CX[j] = c % W; CY[j] = (c / W) | 0; });
 const HUE = Float32Array.from({ length: NC }, (_, j) => (190 + 150 * Math.min(1, S.primero(j) / 11000)) % 360);
 function draw(ctx, t) {
  const K = Kt(t), Ki = Math.floor(K), [sc, cx, cy] = camAt(t), fin = sm(D - 2.6, D - 0.9, t), sx = (gx) => XC + (gx - cx) * sc, sy = (gy) => YC + (gy - cy) * sc;
  ctx.save();
  // tablero (suelo de baldosas por donde camina la hormiga)
  ctx.fillStyle = '#10142a'; ctx.beginPath(); ctx.roundRect(BOX.x0, BOX.y0, BOX.x1 - BOX.x0, BOX.y1 - BOX.y0, 22); ctx.fill(); ctx.strokeStyle = 'rgba(160,175,230,0.25)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(BOX.x0, BOX.y0, BOX.x1 - BOX.x0, BOX.y1 - BOX.y0, 22); ctx.clip();
  if (sc > 7) { ctx.strokeStyle = `rgba(150,165,220,${0.10 * cl((sc - 7) / 10)})`; ctx.lineWidth = 1; ctx.beginPath();
   const gx0 = Math.floor(cx - (XC - BOX.x0) / sc) - 1, gx1 = Math.ceil(cx + (BOX.x1 - XC) / sc) + 1, gy0 = Math.floor(cy - (YC - BOX.y0) / sc) - 1, gy1 = Math.ceil(cy + (BOX.y1 - YC) / sc) + 1;
   for (let g = gx0; g <= gx1; g++) { ctx.moveTo(sx(g), BOX.y0); ctx.lineTo(sx(g), BOX.y1); } for (let g = gy0; g <= gy1; g++) { ctx.moveTo(BOX.x0, sy(g)); ctx.lineTo(BOX.x1, sy(g)); } ctx.stroke(); }
  // casillas llenas: color según cuándo se tocaron por primera vez; brillo si se invirtieron hace poco
  ctx.globalAlpha = 1 - fin; const pad = sc > 6 ? 1 : 0;
  for (let j = 0; j < NC; j++) { if (S.primero(j) >= Ki) continue; const on = S.estado(j, Ki); if (!on) continue; const u = S.ultimo(j, Ki), rec = cl(1 - (K - u) / 400);
   ctx.fillStyle = `hsl(${HUE[j]},90%,${48 + 22 * rec}%)`; ctx.fillRect(sx(CX[j]) + pad, sy(CY[j]) + pad, sc - 2 * pad, sc - 2 * pad); }
  // la hormiga: avanza de casilla en casilla (interpolada cuando va lenta), con su flechita de dirección
  const kk = Math.min(NK - 1, Ki), q = Ki >= NK - 1 ? 0 : E.inOut(K - Ki), ax = lerp(S.px[kk], S.px[kk + 1], q) + 0.5, ay = lerp(S.py[kk], S.py[kk + 1], q) + 0.5, dd = S.dir[Math.min(NK, kk + 1)];
  const X = sx(ax), Y = sy(ay), z = Math.max(16, sc * 0.95); P.glow(ctx, X, Y, z * 1.8, '255,255,255', 0.5);
  ctx.save(); ctx.translate(X, Y); ctx.rotate(dd * Math.PI / 2); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(0, -z * 0.55); ctx.lineTo(z * 0.42, z * 0.4); ctx.lineTo(0, z * 0.18); ctx.lineTo(-z * 0.42, z * 0.4); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.restore();
  // las dos reglas, dibujadas: casilla vacía → gira a la derecha · casilla llena → gira a la izquierda
  ctx.save(); ctx.globalAlpha = 1 - 0.6 * fin; const regla = (x0, llena) => { const y0 = 1276, c = 62; ctx.fillStyle = llena ? 'hsl(260,90%,60%)' : '#10142a'; ctx.strokeStyle = 'rgba(200,210,255,0.7)'; ctx.lineWidth = 2; ctx.fillRect(x0, y0, c, c); ctx.strokeRect(x0, y0, c, c);
   ctx.strokeStyle = '#ffd54a'; ctx.lineWidth = 4; ctx.lineCap = 'round'; const s = llena ? -1 : 1; ctx.beginPath(); ctx.moveTo(x0 + c / 2, y0 + c - 6); ctx.lineTo(x0 + c / 2, y0 + c / 2); ctx.quadraticCurveTo(x0 + c / 2, y0 + 12, x0 + c / 2 + s * 26, y0 + 12); ctx.stroke();
   ctx.beginPath(); ctx.moveTo(x0 + c / 2 + s * 36, y0 + 12); ctx.lineTo(x0 + c / 2 + s * 22, y0 + 3); ctx.lineTo(x0 + c / 2 + s * 22, y0 + 21); ctx.closePath(); ctx.fillStyle = '#ffd54a'; ctx.fill(); };
  regla(175, false); regla(300, true); ctx.restore();
  R.contador(ctx, t, Math.round(K * (1 - sm(D - 1.4, D - 0.75, t))), { x: 680, y: 1308, px: 96, glow: '160,140,255' });
  R.chico(ctx, 'pasos', 680, 1370, { px: 32, col: 'rgba(200,190,255,0.9)', kind: 'unidad' });
  R.pregunta(ctx, t, { y: 300, px: 72 }); R.frase(ctx, t, { y: 300, px: 50 });
 }

 // ---------- 4 · SONIDO: un tic por paso; en la autopista, un pulso cada 104 pasos ----------
 const JIDX = new Map(S.celdas.map((c, j) => [c, j]));   // casilla → índice (para saber si estaba llena: nota más grave)
 const EVK = []; for (let k = 1; k < NK && tK(k) < T_FIN; k++) EVK.push({ t: tK(k), p: S.estado(JIDX.get(S.celda[k]), k) ? 9 : 13, v: 0.5, pan: cl((S.px[k] - S.px[0]) / 60, -0.8, 0.8) });
 const EVA = []; if (S.autopista > 0) for (let k = S.autopista; k < NK && tK(k) < T_FIN; k += 104) EVA.push({ t: tK(k), p: 8, v: 0.8 });
 function sound(k) { R.asmr(k, EVK, { voz: 'tic', maxBin: 2, bin: 1 / 40, dens: 60, gain: 0.55 }); R.asmr(k, EVA, { voz: 'gota', maxBin: 1, bin: 0.1, gain: 0.7 }); }
 const EP = R.make({ draw, sound, eventos: () => EVK.map((e) => e.t).concat(EVA.map((e) => e.t)) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
