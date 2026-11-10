// =====================================================================================================
// episodio.js — «¿Dónde caerá la última bola?» · FORMATO: GALTON · Plantilla Asombroteca SIN_VOZ 2.1
// 2.000 bolitas caen por 16 filas de clavos con gravedad, choques y rebote reales (SIM.galton, precalculado con H.rng) y se apilan
// en 17 casillas: sale la campana de Gauss. La última bola (blanca) cae sola: la cámara la sigue a CÁMARA LENTA (~11 s; la física es
// la misma, solo cambia la velocidad de reproducción) y en cada fila aparece una flechita ← o → (16 decisiones al azar). Debajo de
// cada casilla, su número = cuántas veces fue a la derecha. La frase sale SOLO tras su llegada.
// Después se abre la compuerta y el tablero se vacía despacio, mientras se lee la frase (bucle). Sonido: madera en cada clavo, gota en cada casilla, cristal en cada
// decisión de la bola blanca, campana al llegar.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN (en tiempo de simulación s; 90 estados por segundo para que la cámara lenta sea fluida) ----------
 const DS = 40, G = { x0: 540, yPeg0: 470, filas: 16, dx: 46, dy: 30, pegR: 8, r: 3.4, nBolas: TL.param.nBolas ?? 2000, tIni: -1.2, pre: 1.2, tFin: TL.param.tFin ?? 27, tUltima: TL.param.tUltima ?? 28.3, xUltima: TL.param.xUltima ?? 0, yFondo: 1340, e: 0.5, fric: 0.7, drag: 1.5, vMax: 800, seed: TL.semilla };
 const S = SIM.galton({ dur: DS, fps: 90, sub: 3, ...G }), SF = S.fps, U = S.ultima, tLlega = S.llegada[U];
 // ---------- 2 · RELOJ DEL VÍDEO: normal → cámara lenta durante la caída de la blanca → normal ----------
 const LENTA = TL.param.lenta ?? 11, A0 = G.tUltima - 0.25, B0 = tLlega + 0.3, RHO = (B0 - A0) / LENTA;
 const tau = (t) => (t < A0 ? t : t < A0 + LENTA ? A0 + (t - A0) * RHO : B0 + (t - A0 - LENTA));        // vídeo → simulación
 const vid = (s) => (s < A0 ? s : s < B0 ? A0 + (s - A0) / RHO : A0 + LENTA + (s - B0));                // simulación → vídeo
 // vaciado LENTO: empieza 1,5 s después de la llegada y termina justo cuando empieza el empalme (la pila baja y sale por la ranura)
 const T_LLEGA = vid(tLlega), T_VAC = T_LLEGA + 1.5, S_VAC = tau(T_VAC), D_VAC = D - 0.6 - T_VAC, A_VAC = 2 * 430 / (D_VAC * D_VAC);
 const HUE = (id) => (200 + (id / S.nB) * 320) % 360, COLS = Array.from({ length: S.nB }, (_, i) => `hsl(${HUE(i)},92%,60%)`);
 const pil = S.pilas.map((p) => p.map((i) => ({ i, t: S.llegada[i], s: S.sl[i] })).sort((a, b) => a.s - b.s));
 const golpes = Array.from({ length: S.NF }, () => []); S.eventos.forEach((e) => { if (e.tipo === 'clavo') { const f = Math.round(e.t * SF); if (f < S.NF) golpes[f].push(e.fila * 100 + e.col); } });
 const llegadas = S.eventos.filter((e) => e.tipo === 'casilla').map((e) => e.t);
 const HN = S.pilas.map((p) => p.length), NT = HN.reduce((a, b) => a + b, 0), MU = HN.reduce((a, v, k) => a + v * k, 0) / NT, SD = Math.sqrt(HN.reduce((a, v, k) => a + v * (k - MU) ** 2, 0) / NT);
 const peg = (rr, j) => [G.x0 + (j - rr / 2) * G.dx, G.yPeg0 + rr * G.dy];
 // trayectoria de la blanca y sus 16 decisiones (hacia qué lado se desplaza entre una fila y la siguiente)
 const CAM = []; for (let f = 0; f < S.NF; f++) { const A = S.activas(f); let p = null; for (let q = 0; q < A.length; q += 3) if (A[q + 2] === U) { p = [A[q], A[q + 1]]; break; } CAM.push(p); }
 const PATH = CAM.map((p, f) => p && [f / SF, p[0], p[1]]).filter(Boolean);
 const cruce = (yr) => { const k = PATH.findIndex((p) => p[2] >= yr); if (k < 1) return null; const a = PATH[k - 1], c = PATH[k], u = (yr - a[2]) / (c[2] - a[2]); return [lerp(a[0], c[0], u), lerp(a[1], c[1], u), yr]; };
 const XR = Array.from({ length: G.filas + 1 }, (_, rr) => cruce(G.yPeg0 + rr * G.dy));
 const DEC = Array.from({ length: G.filas }, (_, rr) => XR[rr] && XR[rr + 1] ? { t: XR[rr + 1][0], x: XR[rr][1], y: XR[rr][2], d: Math.sign(XR[rr + 1][1] - XR[rr][1]) || 1 } : null).filter(Boolean);
 window.GALTON_INFO = { tLlega, T_LLEGA, casilla: S.casilla[U], derechas: DEC.filter((d) => d.d > 0).length, decisiones: DEC.length, simFin: tau(D), RHO };
 const camPos = (s) => { const f = Math.round(s * SF); let sx = 0, sy = 0, n = 0; for (let q = f - 12; q <= f + 12; q++) { const p = CAM[cl(q, 0, S.NF - 1)]; if (p) { sx += p[0]; sy += p[1]; n++; } } return n ? [sx / n, sy / n] : null; };
 // encuadre del zoom: ×1,3 con la altura FIJA para que todo el tablero (de la tolva al piso de las casillas) quede en 245 ≤ y ≤ 1415
 // (zona segura); la cámara solo sigue a la bola blanca en horizontal
 const ZOOM = 1.3, Y_CEN = 860, Y_FIJA = G.yFondo - (1415 - Y_CEN) / ZOOM;
 const camW = (t) => sm(A0 - 0.1, A0 + 0.7, t) * (1 - sm(T_LLEGA + 0.4, T_LLEGA + 1.2, t));
 const flecha = (ctx, x, y, d, a, col) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(d, 1); ctx.fillStyle = col; ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-10, -3.5); ctx.lineTo(2, -3.5); ctx.lineTo(2, -9); ctx.lineTo(13, 0); ctx.lineTo(2, 9); ctx.lineTo(2, 3.5); ctx.lineTo(-10, 3.5); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); };

 // ---------- 3 · DIBUJO ----------
 function draw(ctx, t) {
  const s = tau(t), f = Math.min(S.NF - 1, Math.round(s * SF)), vac = Math.max(0, t - T_VAC), drop = 0.5 * A_VAC * vac * vac, fadeV = 1 - cl(vac / D_VAC);
  const w = E.inOut(camW(t)), cp = camPos(s) || (s < G.tUltima ? [G.x0, G.yPeg0] : S.slot(S.casilla[U] < 0 ? 8 : S.casilla[U], S.sl[U]));   // sin estado entre fotogramas
   const zc = [cl(cp[0], 430, 650), Y_FIJA], z = lerp(1, ZOOM, w);
  ctx.save(); ctx.translate(lerp(zc[0], 540, w), lerp(zc[1], Y_CEN, w)); ctx.scale(z, z); ctx.translate(-zc[0], -zc[1]);   // (con w = 0 es la identidad)
 
  // tolva con las bolas que faltan
  const lanz = S.sal.reduce((a, x) => a + (x <= s ? 1 : 0), 0), nivel = (S.nB - lanz) / S.nB, ref = sm(D - 0.9, D, t);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(G.x0 - 120, 372); ctx.lineTo(G.x0 - 14, G.yPeg0 - 46); ctx.moveTo(G.x0 + 120, 372); ctx.lineTo(G.x0 + 14, G.yPeg0 - 46); ctx.stroke();
  const RH = H.rng(11), nh = Math.round(Math.max(nivel, ref) * 160); for (let q = 0; q < nh; q++) { const u = RH(), ww = lerp(26, 220, u), yy = lerp(G.yPeg0 - 52, 378, u) + Math.sin(t * 6 + q) * 0.8, xx = G.x0 + (RH() - 0.5) * ww; ctx.fillStyle = COLS[Math.floor(RH() * S.nB)]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(xx, yy, G.r, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1;
  // clavos (los tocados en los últimos 0,13 s de simulación brillan)
  const hot = new Map(); for (let b = 0; b < 12; b++) for (const key of golpes[Math.max(0, f - b)] || []) hot.set(key, Math.max(hot.get(key) || 0, 1 - b / 12));
  for (let rr = 0; rr < G.filas; rr++) for (let j = 0; j <= rr; j++) { const [px, py] = peg(rr, j), h = hot.get(rr * 100 + j) || 0; ctx.fillStyle = h ? `rgba(255,${200 + 55 * h},${120 + 120 * h},${0.55 + 0.45 * h})` : 'rgba(210,215,235,0.55)'; ctx.beginPath(); ctx.arc(px, py, G.pegR * (0.62 + 0.2 * h), 0, TAU); ctx.fill(); if (h > 0.7) P.glow(ctx, px, py, 26, '255,220,150', 0.25 * h); }
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(G.x0 - G.dx * 0.75, G.yPeg0 - G.dy * 1.2); ctx.lineTo(S.binL, S.yBin); ctx.moveTo(G.x0 + G.dx * 0.75, G.yPeg0 - G.dy * 1.2); ctx.lineTo(S.binL + S.nBins * G.dx, S.yBin); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k <= S.nBins; k++) { const x = S.binL + k * G.dx; ctx.moveTo(x, S.yBin + 6); ctx.lineTo(x, S.yF + 4); } ctx.stroke();
  // compuerta del piso: se desliza en horizontal y deja una ranura
  const ab = E.inOut(cl(vac / 0.4)) * (1 - sm(D - 0.75, D - 0.6, t)); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 4; ctx.beginPath(); for (let k = 0; k < S.nBins; k++) { const x = S.binL + k * G.dx; ctx.moveTo(x, S.yF + 4); ctx.lineTo(x + G.dx * (1 - 0.7 * ab), S.yF + 4); } ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1080, S.yF + 2); ctx.clip();
  for (let k = 0; k < S.nBins; k++) { const p = pil[k]; for (let q = 0; q < p.length; q++) { const b = p[q]; if (b.t > s) continue; const [x, y] = S.slot(k, b.s); const isU = b.i === U; ctx.globalAlpha = fadeV; ctx.fillStyle = isU ? '#ffffff' : COLS[b.i]; ctx.beginPath(); ctx.arc(x, y + drop, G.r * (isU ? 1.5 : 1), 0, TAU); ctx.fill(); if (isU && fadeV > 0) P.glow(ctx, x, y + drop, 60 + 14 * Math.sin(t * 5), '255,255,255', (0.5 + 0.2 * Math.sin(t * 5)) * fadeV); } }
  ctx.restore();
  const A = S.activas(f); for (let q = 0; q < A.length; q += 3) { const id = A[q + 2], isU = id === U; ctx.globalAlpha = 1; ctx.fillStyle = isU ? '#ffffff' : COLS[id]; ctx.beginPath(); ctx.arc(A[q], A[q + 1], G.r * (isU ? 1.5 : 1), 0, TAU); ctx.fill(); if (isU) P.glow(ctx, A[q], A[q + 1], 70, '255,255,255', 0.55); }
  ctx.globalAlpha = 1;
  // la bola blanca: estela de su recorrido y una flechita ← / → por fila
  const fade2 = 1 - sm(T_VAC - 0.1, T_VAC + 0.3, t); if (s > G.tUltima && fade2 > 0) { const tr = PATH.filter((p) => p[0] <= s && p[0] >= G.tUltima); if (tr.length > 1) { ctx.save(); ctx.globalAlpha = 0.5 * fade2; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.setLineDash([4, 6]); ctx.beginPath(); tr.forEach((p, q) => (q ? ctx.lineTo(p[1], p[2]) : ctx.moveTo(p[1], p[2]))); ctx.stroke(); ctx.restore(); }
   for (const dd of DEC) if (s >= dd.t) { const a = E.out(cl((s - dd.t) / 0.08)) * fade2; flecha(ctx, dd.x + dd.d * 4, dd.y + G.dy * 0.5, dd.d, a, dd.d > 0 ? '#ff7cc6' : '#7fe0ff'); } }
  // campana de Gauss ajustada a lo que cayó, cuando ya llegó casi todo el grueso
  const cg = sm(vid(G.tFin + 2.0), vid(G.tFin + 3.0), t) * fadeV; if (cg > 0) { const hL = 2 * G.r * 0.9 / S.per; ctx.strokeStyle = `rgba(255,213,74,${0.9 * cg})`; ctx.lineWidth = 5; ctx.shadowColor = 'rgba(255,213,74,0.8)'; ctx.shadowBlur = 14; ctx.beginPath();
   for (let q = 0; q <= 160; q++) { const xb = -0.5 + q / 160 * S.nBins, zz = (xb - MU) / SD, dens = NT * Math.exp(-zz * zz / 2) / (SD * Math.sqrt(TAU)), x = S.binL + (xb + 0.5) * G.dx, y = S.yF - dens * hL; q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.shadowBlur = 0;
   // tras la llegada, un tramo de luz recorre la campana (movimiento continuo mientras se lee la frase)
   const lu = sm(T_LLEGA + 0.6, T_LLEGA + 1.2, t) * fadeV; if (lu > 0) { const c0 = ((t - T_LLEGA) / 2.2) % 1 * 190 - 30; ctx.save(); ctx.globalAlpha = lu; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(255,255,255,0.95)'; ctx.shadowBlur = 24; ctx.beginPath(); let first = true;
    for (let q = Math.max(0, Math.floor(c0)); q <= Math.min(160, Math.floor(c0) + 30); q++) { const xb = -0.5 + q / 160 * S.nBins, zz = (xb - MU) / SD, dens = NT * Math.exp(-zz * zz / 2) / (SD * Math.sqrt(TAU)), x = S.binL + (xb + 0.5) * G.dx, y = S.yF - dens * hL; first ? ctx.moveTo(x, y) : ctx.lineTo(x, y); first = false; } ctx.stroke(); ctx.restore(); } }
  ctx.restore();
  // números de las casillas (= veces a la derecha); el de la blanca se enciende al llegar
  const nA = (1 - w) * fadeV, kU = S.casilla[U], on = sm(T_LLEGA, T_LLEGA + 0.3, t);
  for (let k = 0; k < S.nBins; k++) { const isK = k === kU && on > 0; R.chico(ctx, String(k), S.binL + (k + 0.5) * G.dx, S.yF + 34, { px: isK ? 36 : 32, col: isK ? '#ffd54a' : 'rgba(220,225,255,0.75)', kind: 'eje', alpha: nA * (isK ? 1 : 0.85) }); }
  const hechas = DEC.filter((dd) => s >= dd.t), izq = hechas.filter((dd) => dd.d < 0).length, der = hechas.length - izq, ea = sm(A0, A0 + 0.5, t) * fadeV;
  if (ea > 0.02) R.chico(ctx, `← ${izq} · ${der} →`, 835, 640, { px: 44, fw: 800, col: '#ffffff', kind: 'etiqueta', alpha: ea });
  const c = S.cuenta(f), lt = (() => { let lo = 0, hi = llegadas.length; while (lo < hi) { const m = (lo + hi) >> 1; if (llegadas[m] <= s) lo = m + 1; else hi = m; } return lo ? llegadas[lo - 1] : -9; })();
  R.contador(ctx, t, Math.round(c * (1 - cl(drop / 430))), { x: 245, y: 640, px: 116, glow: '255,150,220', bump: 1 - cl((s - lt) / 0.12) });
  R.pregunta(ctx, t, { y: 318 }); R.frase(ctx, t, { y: 318 });
 }

 // ---------- 4 · SONIDO (eventos en tiempo de simulación → tiempo del vídeo) ----------
 function sound(k) { const ev = S.eventos;
  R.asmr(k, ev.filter((e) => e.tipo === 'clavo' && e.t < S_VAC).map((e) => ({ t: vid(e.t), p: 22 - e.fila * 0.8, v: (0.25 + 0.6 * cl(e.v / 500)) * (e.id === U ? 1.3 : 1), pan: (e.col - e.fila / 2) / 9 })), { voz: 'madera', maxBin: 2, bin: 1 / 60, dens: 90, gain: 0.75 });
  R.asmr(k, ev.filter((e) => e.tipo === 'casilla' && e.t < S_VAC).map((e) => ({ t: vid(e.t), p: 3 + e.k * 0.75, v: 0.3 + 0.4 * e.v, pan: (e.k - 8) / 10 })), { voz: 'gota', maxBin: 1, bin: 1 / 40, dens: 50, gain: 0.55 });
  R.asmr(k, DEC.map((dd, q) => ({ t: vid(dd.t), p: (dd.d > 0 ? 16 : 12) + (q % 3) * 0.5, v: 0.8, pan: dd.d * 0.4 })), { voz: 'cristal', maxBin: 1, gain: 0.9 });
  R.asmr(k, [{ t: T_LLEGA, p: 15, v: 1 }, { t: T_LLEGA, p: 17, v: 0.8 }, { t: T_LLEGA, p: 19, v: 0.7 }], { voz: 'campana', maxBin: 3, gain: 1 });
  k.noise(T_VAC, { dur: D_VAC, color: 'pink', filter: 'lowpass', f: [[0, 2400], [D_VAC, 500]], gain: 0.08, a: 0.4, hold: D_VAC * 0.6 }); R.asmr(k, Array.from({ length: Math.round(D_VAC * 25) }, (_, q) => ({ t: T_VAC + q * 0.04, p: 12 + (q % 7), v: 0.25 })), { voz: 'tic', maxBin: 1, bin: 0.03, gain: 0.45 });
 }

 const EP = R.make({ draw, sound, eventos: () => S.eventos.map((e) => vid(e.t)).concat(Array.from({ length: Math.round(D_VAC * 25) }, (_, q) => T_VAC + q * 0.04), DEC.map((dd) => vid(dd.t))) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
