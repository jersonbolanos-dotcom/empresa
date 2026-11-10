// =====================================================================================================
// episodio.js — «¿Se quemará todo el bosque?» · FORMATO: INCENDIO · Plantilla Asombroteca SIN_VOZ 2.2
// Bosque visto desde arriba (60 × 60 árboles). El fuego pasa de un árbol a sus 4 vecinos con un retraso al azar (SIM.incendio:
// percolación de sitios, precalculada con H.rng). Dos franjas de cortafuegos iguales (árboles cortados → tocones): la primera deja ~66 % de
// árboles, por encima del umbral de percolación (59 %), y el fuego la cruza; la segunda deja ~42 %, por debajo, y lo detiene. Al final rebrota.
// Sonido: chasquido en cada árbol que prende, rugido cuyo volumen sigue a los árboles que arden, siseo al apagarse, gotas al rebrotar.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 const CO = 60, RO = 60, CS = 14, X0 = 120, Y0 = 470, DEN = TL.param.densidad ?? 0.86, Q1 = TL.param.queda1 ?? 0.66, Q2 = TL.param.queda2 ?? 0.44;
 const F1 = [18, 25], F2 = [38, 45];   // franjas de cortafuegos (columnas), las dos de 8 columnas
 const enFranja = (c) => (c >= F1[0] && c <= F1[1]) || (c >= F2[0] && c <= F2[1]);
 const S = SIM.incendio({ cols: CO, rows: RO, densidad: () => DEN, corte: (c, r, rng) => (c >= F1[0] && c <= F1[1]) ? rng() < 1 - Q1 / DEN : (c >= F2[0] && c <= F2[1]) ? rng() < 1 - Q2 / DEN : false, focos: [27, 28, 29, 30, 31, 32].map((r) => [0, r]), dMin: 0.14, dMax: 0.34, arde: 1.2, seed: TL.semilla });
 // sin tiempo muerto: del 95 al 98 % de árboles el fuego va 2,5 veces más rápido y el último 2 %, 8 veces (remapeo monótono:
 // el orden de ignición no cambia) y, en cuanto se apaga el último, entra la frase
 { const n = S.orden.length, tq = (f) => S.tIgn[S.orden[Math.floor(f * (n - 1))]], t95 = tq(0.95), t98 = tq(0.98);
   const w = (t) => (t <= t95 ? t : t <= t98 ? t95 + (t - t95) * 0.4 : t95 + (t98 - t95) * 0.4 + (t - t98) * 0.12);
   for (const i of S.orden) S.tIgn[i] = w(S.tIgn[i]); S.tFin = S.tIgn[S.orden[n - 1]]; }
 const T_FIN = S.escala((TL.tFrase - S.arde - 0.4) / S.tFin), T_APAGA = T_FIN + S.arde, T_BROTE = D - 3.2;
 const densF = (F) => { let a = 0; for (let r = 0; r < RO; r++) for (let c = F[0]; c <= F[1]; c++) if (S.arbol[r * CO + c] === 1) a++; return Math.round(100 * a / (RO * (F[1] - F[0] + 1))); };
 const DF = [densF(F1), densF(F2)];   // % real de árboles que quedan en cada cortafuegos (sale en su etiqueta)
 const N_ARB = S.arbol.reduce((a, v) => a + (v === 1 ? 1 : 0), 0), IGN = S.orden.map((i) => S.tIgn[i]);
 const cuantos = (t) => { let lo = 0, hi = IGN.length; while (lo < hi) { const m = (lo + hi) >> 1; if (IGN[m] <= t) lo = m + 1; else hi = m; } return lo; };
 const maxCol = S.orden.reduce((m, i) => Math.max(m, i % CO), 0); window.INCENDIO_INFO = { maxCol, quemados: S.orden.length, N_ARB, T_FIN, cruza1: maxCol > F1[1], cruza2: maxCol > F2[1], DF };
 const RG = H.rng(9), TONO = Float32Array.from({ length: CO * RO }, () => RG()), BROTE = Float32Array.from({ length: CO * RO }, () => RG());
 const JX = Float32Array.from({ length: CO * RO }, () => (RG() - 0.5) * 6), JY = Float32Array.from({ length: CO * RO }, () => (RG() - 0.5) * 6);   // copas algo irregulares (aspecto natural)
 const pos = (i) => [X0 + (i % CO + 0.5) * CS + JX[i], Y0 + (((i / CO) | 0) + 0.5) * CS + JY[i]];

 // ---------- 2 · DIBUJO ----------
 function draw(ctx, t) {
  // suelo del bosque (los árboles se apoyan en él: vista cenital)
  ctx.save(); const g = ctx.createLinearGradient(0, Y0, 0, Y0 + RO * CS); g.addColorStop(0, '#13200f'); g.addColorStop(1, '#0d170b'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(X0 - 10, Y0 - 10, CO * CS + 20, RO * CS + 20, 18); ctx.fill();
  // franjas de cortafuegos (tierra desnuda)
  ctx.fillStyle = 'rgba(140,100,55,0.42)'; for (const [a, b] of [F1, F2]) ctx.fillRect(X0 + a * CS, Y0 - 10, (b - a + 1) * CS, RO * CS + 20);
  const brote = (i) => t > T_BROTE + BROTE[i] * 1.6;   // al final el bosque rebrota (empalme con el inicio)
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < CO * RO; i++) { const a = S.arbol[i]; if (!a) continue; const [x, y] = pos(i);
   if (a === 2) { ctx.fillStyle = '#a7804f'; ctx.beginPath(); ctx.arc(x, y, 3.6, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(40,25,12,0.8)'; ctx.lineWidth = 1; ctx.stroke(); continue; }   // tocón
   const ti = S.tIgn[i], q = t - ti;
   if (q < 0 || brote(i)) { const s = brote(i) ? E.out(cl((t - T_BROTE - BROTE[i] * 1.6) / 0.4)) : 1; ctx.fillStyle = `hsl(${105 + TONO[i] * 40},${55 + TONO[i] * 25}%,${30 + TONO[i] * 14}%)`; ctx.beginPath(); ctx.arc(x, y, (5.6 + TONO[i] * 2.2) * s, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(190,255,150,0.18)'; ctx.beginPath(); ctx.arc(x - 1.8 * s, y - 1.8 * s, 2.4 * s, 0, TAU); ctx.fill(); continue; }
   if (q < S.arde) continue;   // los que arden se dibujan después (capa de luz)
   const em = 1 - cl((q - S.arde) / 1.6), br = 0.22 * Math.exp(-(q - S.arde) / 3.5) * (0.5 + 0.5 * Math.sin(t * 6.3 + i * 1.7)), e2 = Math.max(em, br);   // brasas que titilan unos segundos
   ctx.fillStyle = `rgb(${26 + 150 * e2},${22 + 50 * e2},${20 + 6 * e2})`; ctx.beginPath(); ctx.arc(x, y, 4.4, 0, TAU); ctx.fill(); }
  // árboles que arden: llama que parpadea (capa aditiva)
  ctx.globalCompositeOperation = 'lighter';
  const n0 = cuantos(t - S.arde), n1 = cuantos(t); for (let k = n0; k < n1; k++) { const i = S.orden[k]; if (brote(i)) continue; const [x, y] = pos(i), q = (t - S.tIgn[i]) / S.arde, fl = 0.75 + 0.25 * Math.sin(t * 31 + i), v = Math.sin(Math.PI * Math.min(1, q * 1.4));
   ctx.fillStyle = `rgba(255,${70 + 50 * fl},10,${0.28 * v})`; ctx.beginPath(); ctx.arc(x, y - 3, 22 * v * fl, 0, TAU); ctx.fill(); ctx.fillStyle = `rgba(255,${120 + 60 * fl},30,${0.55 * v})`; ctx.beginPath(); ctx.arc(x, y - 2, 11 * v * fl, 0, TAU); ctx.fill(); ctx.fillStyle = `rgba(255,${225 + 30 * fl},${150},${0.95 * v})`; ctx.beginPath(); ctx.arc(x, y - 1, 5 * v * fl, 0, TAU); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
  // humo: velos grises que derivan despacio sobre el bosque mientras arde y se disipan tras apagarse (movimiento continuo)
  const hum = cl((t - 2) / 3) * (1 - sm(T_BROTE - 0.2, T_BROTE + 1.4, t)); if (hum > 0.01) { ctx.save(); ctx.beginPath(); ctx.rect(X0 - 10, Y0 - 10, CO * CS + 20, RO * CS + 20); ctx.clip(); const W = CO * CS + 240;
   for (let b = 0; b < 9; b++) { const x = X0 - 120 + ((b * 137 + t * (22 + b * 3)) % W), y = Y0 + RO * CS * ((b * 0.383) % 1) - 30 * Math.sin(t * 0.4 + b), rr = 110 + 30 * Math.sin(t * 0.7 + b * 2);
    const g2 = ctx.createRadialGradient(x, y, 0, x, y, rr); g2.addColorStop(0, `rgba(150,140,135,${0.16 * hum})`); g2.addColorStop(1, 'rgba(150,140,135,0)'); ctx.fillStyle = g2; ctx.fillRect(x - rr, y - rr, 2 * rr, 2 * rr); }
   ctx.restore(); }
  ctx.restore();
  // etiquetas: % de árboles que quedan en cada cortafuegos
  [F1, F2].forEach(([a, b], q) => { const xc = X0 + (a + b + 1) / 2 * CS; R.chico(ctx, `${DF[q]} % árboles`, xc, Y0 - 36, { px: 32, col: q ? '#9fd0ff' : '#ffb27a', kind: 'etiqueta' }); ctx.save(); ctx.strokeStyle = 'rgba(233,195,138,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xc, Y0 - 16); ctx.lineTo(xc, Y0 - 2); ctx.stroke(); ctx.restore(); });
  // contador: % del bosque quemado (vuelve a 0 al rebrotar)
  const qn = cuantos(t), reb = sm(T_BROTE, T_BROTE + 2.0, t), pct = Math.round(100 * qn / N_ARB * (1 - reb));
  R.contador(ctx, t, pct, { x: 430, y: 1360, px: 96, sufijo: ' %', glow: '255,140,60', bump: 0 });
  R.chico(ctx, 'quemado', 430, 1424, { px: 32, col: 'rgba(255,190,140,0.9)', kind: 'unidad' });   // qué mide el contador (no confundir con los % de los cortafuegos)
  R.pregunta(ctx, t, { y: 300, px: 70 }); R.frase(ctx, t, { y: 300, px: 54 });
 }

 // ---------- 3 · SONIDO ----------
 const CH = []; for (let t = 0; t < T_APAGA; t += 0.25) CH.push(t);
 function sound(k) {
  R.asmr(k, S.orden.map((i, q) => ({ t: S.tIgn[i], p: 14 + (TONO[i] * 8), v: 0.3 + 0.4 * TONO[i], pan: ((i % CO) / CO - 0.5) * 1.2 })), { voz: 'tic', maxBin: 2, bin: 1 / 40, dens: 60, gain: 0.7 });
  // rugido del fuego: ruido grave cuyo volumen sigue al número de árboles que arden (calculado de la simulación)
  for (const t of CH) { const b = cuantos(t) - cuantos(t - S.arde); if (b <= 0) continue; k.noise(t, { dur: 0.32, color: 'brown', filter: 'lowpass', f: 500 + Math.min(900, b * 4), gain: Math.min(0.11, 0.012 * Math.sqrt(b)), a: 0.06 }); R.EV.push(t); }
  k.noise(T_APAGA, { dur: 1.4, color: 'pink', filter: 'highpass', f: [[0, 2500], [1.4, 5000]], gain: 0.05, a: 0.2 }); R.EV.push(T_APAGA);
  R.asmr(k, Array.from({ length: 12 }, (_, q) => ({ t: T_BROTE + q * 0.14, p: 10 + q, v: 0.5 })), { voz: 'gota', maxBin: 1, bin: 0.1, gain: 0.6 });
 }

 const EP = R.make({ draw, sound, eventos: () => IGN.concat(CH, [T_APAGA], Array.from({ length: 12 }, (_, q) => T_BROTE + q * 0.14)) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
