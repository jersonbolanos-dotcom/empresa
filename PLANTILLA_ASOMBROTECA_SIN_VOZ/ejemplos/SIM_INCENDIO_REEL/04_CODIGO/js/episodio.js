// =====================================================================================================
// episodio.js — «¿Se quemará todo el bosque?» · FORMATO: INCENDIO · Plantilla Asombroteca SIN_VOZ 2.2
// Bosque visto desde arriba (60 × 60 árboles). El fuego pasa de un árbol a sus 4 vecinos con un retraso al azar (SIM.incendio:
// percolación de sitios, precalculada con H.rng). Dos franjas de cortafuegos (árboles cortados → tocones) dejan solo ~32 % de árboles,
// por debajo del umbral de percolación (59 %): la estrecha puede dejar pasar el fuego; la ancha lo detiene. Al final el bosque rebrota.
// Sonido: chasquido en cada árbol que prende, rugido cuyo volumen sigue a los árboles que arden, siseo al apagarse, gotas al rebrotar.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 const CO = 60, RO = 60, CS = 14, X0 = 120, Y0 = 470, DEN = TL.param.densidad ?? 0.7, CORTE = TL.param.corte ?? 0.55;
 const F1 = [21, 23], F2 = [40, 45];   // franjas de cortafuegos (columnas)
 const enFranja = (c) => (c >= F1[0] && c <= F1[1]) || (c >= F2[0] && c <= F2[1]);
 const S = SIM.incendio({ cols: CO, rows: RO, densidad: () => DEN, corte: (c, r, rng) => enFranja(c) && rng() < CORTE, focos: [27, 28, 29, 30, 31, 32].map((r) => [0, r]), dMin: 0.14, dMax: 0.34, arde: 1.2, seed: TL.semilla });
 const T_FIN = S.escala((TL.param.tFuego ?? 33.5) / S.tFin), T_APAGA = T_FIN + S.arde, T_BROTE = D - 3.2;
 const N_ARB = S.arbol.reduce((a, v) => a + (v === 1 ? 1 : 0), 0), IGN = S.orden.map((i) => S.tIgn[i]);
 const cuantos = (t) => { let lo = 0, hi = IGN.length; while (lo < hi) { const m = (lo + hi) >> 1; if (IGN[m] <= t) lo = m + 1; else hi = m; } return lo; };
 const maxCol = S.orden.reduce((m, i) => Math.max(m, i % CO), 0); window.INCENDIO_INFO = { maxCol, quemados: S.orden.length, N_ARB, T_FIN, cruza1: maxCol > F1[1], cruza2: maxCol > F2[1] };
 const RG = H.rng(9), TONO = Float32Array.from({ length: CO * RO }, () => RG()), BROTE = Float32Array.from({ length: CO * RO }, () => RG());
 const JX = Float32Array.from({ length: CO * RO }, () => (RG() - 0.5) * 6), JY = Float32Array.from({ length: CO * RO }, () => (RG() - 0.5) * 6);   // copas algo irregulares (aspecto natural)
 const pos = (i) => [X0 + (i % CO + 0.5) * CS + JX[i], Y0 + (((i / CO) | 0) + 0.5) * CS + JY[i]];

 // ---------- 2 · DIBUJO ----------
 function draw(ctx, t) {
  // suelo del bosque (los árboles se apoyan en él: vista cenital)
  ctx.save(); const g = ctx.createLinearGradient(0, Y0, 0, Y0 + RO * CS); g.addColorStop(0, '#13200f'); g.addColorStop(1, '#0d170b'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(X0 - 10, Y0 - 10, CO * CS + 20, RO * CS + 20, 18); ctx.fill();
  // franjas de cortafuegos (tierra desnuda)
  ctx.fillStyle = 'rgba(120,90,50,0.22)'; for (const [a, b] of [F1, F2]) ctx.fillRect(X0 + a * CS, Y0 - 10, (b - a + 1) * CS, RO * CS + 20);
  const brote = (i) => t > T_BROTE + BROTE[i] * 1.6;   // al final el bosque rebrota (empalme con el inicio)
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < CO * RO; i++) { const a = S.arbol[i]; if (!a) continue; const [x, y] = pos(i);
   if (a === 2) { ctx.fillStyle = '#7a5a36'; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(40,25,12,0.8)'; ctx.lineWidth = 1; ctx.stroke(); continue; }   // tocón
   const ti = S.tIgn[i], q = t - ti;
   if (q < 0 || brote(i)) { const s = brote(i) ? E.out(cl((t - T_BROTE - BROTE[i] * 1.6) / 0.4)) : 1; ctx.fillStyle = `hsl(${105 + TONO[i] * 40},${55 + TONO[i] * 25}%,${30 + TONO[i] * 14}%)`; ctx.beginPath(); ctx.arc(x, y, (5.6 + TONO[i] * 2.2) * s, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(190,255,150,0.18)'; ctx.beginPath(); ctx.arc(x - 1.8 * s, y - 1.8 * s, 2.4 * s, 0, TAU); ctx.fill(); continue; }
   if (q < S.arde) continue;   // los que arden se dibujan después (capa de luz)
   const em = 1 - cl((q - S.arde) / 1.6); ctx.fillStyle = `rgb(${26 + 150 * em},${22 + 50 * em},${20 + 6 * em})`; ctx.beginPath(); ctx.arc(x, y, 4.4, 0, TAU); ctx.fill(); }
  // árboles que arden: llama que parpadea (capa aditiva)
  ctx.globalCompositeOperation = 'lighter';
  const n0 = cuantos(t - S.arde), n1 = cuantos(t); for (let k = n0; k < n1; k++) { const i = S.orden[k]; if (brote(i)) continue; const [x, y] = pos(i), q = (t - S.tIgn[i]) / S.arde, fl = 0.75 + 0.25 * Math.sin(t * 31 + i), v = Math.sin(Math.PI * Math.min(1, q * 1.4));
   ctx.fillStyle = `rgba(255,${70 + 50 * fl},10,${0.28 * v})`; ctx.beginPath(); ctx.arc(x, y - 3, 22 * v * fl, 0, TAU); ctx.fill(); ctx.fillStyle = `rgba(255,${120 + 60 * fl},30,${0.55 * v})`; ctx.beginPath(); ctx.arc(x, y - 2, 11 * v * fl, 0, TAU); ctx.fill(); ctx.fillStyle = `rgba(255,${225 + 30 * fl},${150},${0.95 * v})`; ctx.beginPath(); ctx.arc(x, y - 1, 5 * v * fl, 0, TAU); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over'; ctx.restore();
  // etiquetas: las dos franjas de cortafuegos
  for (const [a, b] of [F1, F2]) { const xc = X0 + (a + b + 1) / 2 * CS; R.chico(ctx, 'cortafuegos', xc, Y0 - 36, { px: 32, col: '#e9c38a', kind: 'etiqueta' }); ctx.save(); ctx.strokeStyle = 'rgba(233,195,138,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xc, Y0 - 16); ctx.lineTo(xc, Y0 - 2); ctx.stroke(); ctx.restore(); }
  // contador: % del bosque quemado (vuelve a 0 al rebrotar)
  const qn = cuantos(t), reb = sm(T_BROTE, T_BROTE + 2.0, t), pct = Math.round(100 * qn / N_ARB * (1 - reb));
  R.contador(ctx, t, pct, { x: 430, y: 1385, px: 96, sufijo: ' %', glow: '255,140,60', bump: 0 });
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
