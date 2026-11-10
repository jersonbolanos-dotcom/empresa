// =====================================================================================================
// episodio.js — «¿Qué animal dibujan estos círculos?» · FORMATO: FOURIER (x/y) · Plantilla Asombroteca SIN_VOZ 2.1
// Dos cadenas de epiciclos: la de ARRIBA calcula x(t) y la de la IZQUIERDA calcula y(t) (DFT de cada coordenada del contorno).
// Las líneas punteadas que bajan y cruzan desde sus puntas se encuentran en el lápiz, sobre un plano cartesiano tenue.
// La fórmula x(t) = Σ…, y(t) = Σ… va en una esquina y enciende el término nuevo con cada círculo añadido.
// El contorno del elefante (oreja, OJO y arrugas de la trompa incluidos) lo dibuja el propio trazo.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SILUETA (una sola línea; elefante mirando a la derecha; y hacia abajo) ----------
 const SIL = [
  [200, 250], [262, 196], [345, 166], [432, 152], [520, 156], [598, 170], [650, 186],                                       // lomo
  [674, 196], [668, 240], [656, 300], [654, 356], [676, 400], [722, 410], [762, 370], [776, 300], [760, 230], [728, 186],   // oreja (bucle)
  [744, 146], [800, 140], [850, 164], [868, 188],                                                                           // cráneo
  [858, 208], [846, 220], [842, 219], [852, 225], [855, 237], [848, 248], [836, 249], [828, 240], [830, 228], [840, 221], [848, 216], [862, 204], [876, 198], // OJO: rabillo y bucle
  [884, 222], [892, 268], [899, 320],                                                                                       // frente
  [903, 360], [909, 382], [906, 398], [913, 420], [919, 440], [915, 452], [924, 474], [932, 498], [928, 510], [940, 532], [952, 556], [949, 568], // trompa con arrugas (fuera)
  [966, 588], [986, 604], [1008, 602], [1022, 588], [1020, 570], [1006, 562], [996, 570], [990, 566],                       // punta de la trompa
  [974, 550], [956, 512], [942, 470], [930, 428], [918, 396], [906, 376],                                                   // trompa (dentro)
  [902, 392], [936, 412], [970, 438], [966, 450], [924, 436], [890, 416],                                                   // colmillo
  [860, 422], [826, 444], [792, 456], [772, 474],                                                                           // mandíbula y pecho
  [778, 530], [780, 604], [784, 662], [796, 690], [792, 704], [772, 710], [752, 703], [732, 710], [708, 704], [700, 668], [704, 590], [700, 528], // pata delantera (uñas)
  [652, 512], [560, 522], [470, 522], [402, 512],                                                                           // vientre
  [384, 544], [380, 624], [384, 672], [394, 694], [390, 706], [368, 712], [344, 705], [320, 712], [294, 706], [284, 672], [270, 602], [250, 524], [226, 462], // pata trasera (uñas)
  [208, 402], [198, 344],                                                                                                   // anca
  [176, 338], [162, 374], [156, 424], [146, 448], [158, 462], [172, 450], [174, 414], [182, 370], [197, 342],               // cola
  [199, 296],
 ];
 // ---------- 2 · GEOMETRÍA: plano abajo a la derecha, cadena x arriba, cadena y a la izquierda ----------
 const SC = 0.83, BX = 576, BY = 426;                       // centro de la silueta en sus coordenadas
 const O = { x: 676, y: 1090 }, TOP = { x: O.x, y: 600 }, LEFT = { x: 160, y: O.y };
 const MUESTRAS = SIM.resample(SIL.map(([x, y]) => [(x - BX) * SC, (y - BY) * SC]), 2048);
 const FXc = SIM.fourier({ muestras: MUESTRAS.map((p) => [p[0], 0]), K: 520 }), FYc = SIM.fourier({ muestras: MUESTRAS.map((p) => [p[1], 0]), K: 520 });

 // ---------- 3 · ETAPAS (círculos por cadena y duración de cada vuelta) ----------
 const ETAPAS = [[1, 2.4], [2, 2.2], [3, 2.2], [4, 2.2], [5, 2.2], [6, 2.2], [8, 2.4], [10, 2.4], [13, 2.6], [18, 2.6], [40, 2.6], [900, 3.4]];
 let acc = 0; const ET = ETAPAS.map(([n, d]) => { const e = { n: Math.min(n, FXc.coef.length), t0: acc, d }; acc += d; return e; }); const T_FIN = acc;
 const pen = (n, tau) => [O.x + FXc.punto(n, tau)[0], O.y + FYc.punto(n, tau)[0]];
 const M = 1100; ET.forEach((e) => { e.traza = new Float32Array(2 * (M + 1)); for (let q = 0; q <= M; q++) { const [x, y] = pen(e.n, q / M); e.traza[2 * q] = x; e.traza[2 * q + 1] = y; } });
 const etapa = (t) => { let i = 0; while (i < ET.length - 1 && t >= ET[i + 1].t0) i++; return i; };

 // ---------- 4 · DIBUJO ----------
 const camino = (ctx, e, q0, q1) => { ctx.beginPath(); for (let q = q0; q <= q1; q++) { const x = e.traza[2 * q], y = e.traza[2 * q + 1]; q === q0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } };
 const GR = (ctx) => { const g = ctx.createLinearGradient(O.x - 320, O.y - 200, O.x + 320, O.y + 200); g.addColorStop(0, '#7fe0ff'); g.addColorStop(0.5, '#c9a2ff'); g.addColorStop(1, '#ff7cc6'); return g; };
 function plano(ctx, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
  const x0 = 290, x1 = 1060, y0 = 800, y1 = 1380; ctx.strokeStyle = 'rgba(140,160,255,0.08)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = O.x % 40; x <= 1080; x += 40) if (x >= x0 && x <= x1) { ctx.moveTo(x, y0); ctx.lineTo(x, y1); } for (let y = O.y - 240; y <= y1; y += 40) if (y >= y0) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); } ctx.stroke();
  ctx.strokeStyle = 'rgba(200,210,255,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, O.y); ctx.lineTo(x1, O.y); ctx.moveTo(O.x, y1); ctx.lineTo(O.x, y0); ctx.stroke();
  ctx.fillStyle = 'rgba(200,210,255,0.35)'; ctx.beginPath(); ctx.moveTo(x1, O.y); ctx.lineTo(x1 - 14, O.y - 7); ctx.lineTo(x1 - 14, O.y + 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(O.x, y0); ctx.lineTo(O.x - 7, y0 + 14); ctx.lineTo(O.x + 7, y0 + 14); ctx.fill();
  ctx.beginPath(); for (let x = O.x - 360; x <= x1 - 30; x += 40) { ctx.moveTo(x, O.y - 6); ctx.lineTo(x, O.y + 6); } for (let y = y0 + 40; y <= y1; y += 40) { ctx.moveTo(O.x - 6, y); ctx.lineTo(O.x + 6, y); } ctx.stroke(); ctx.restore();
  R.chico(ctx, 'x', x1 - 6, O.y + 28, { px: 32, col: 'rgba(200,210,255,0.7)', kind: 'eje', alpha: a }); R.chico(ctx, 'y', O.x + 26, y0 + 10, { px: 32, col: 'rgba(200,210,255,0.7)', kind: 'eje', alpha: a }); }
 // cadena de epiciclos; rot = 0 (cadena de x: la punta da la x) o 1 (cadena de y, girada 90°: la punta da la y)
 function cadena(ctx, F, n, tau, C, rot, a) { const ch = F.cadena(n, tau), S = (p) => (rot ? [C.x - p[1], C.y + p[0]] : [C.x + p[0], C.y + p[1]]); ctx.save(); ctx.lineWidth = 1.6;
  for (let j = 0; j < n; j++) { const r = F.coef[j].r; if (r < 0.6) break; const [x, y] = S(ch[j]), [x2, y2] = S(ch[j + 1]); ctx.strokeStyle = `rgba(255,255,255,${a * (j < 2 ? 0.34 : 0.2)})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.strokeStyle = `rgba(255,255,255,${a * 0.6})`; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke(); }
  const end = S(ch[ch.length - 1]); ctx.fillStyle = rot ? '#ff7cc6' : '#7fe0ff'; ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(end[0], end[1], 7, 0, TAU); ctx.fill(); ctx.restore(); return end; }
 // fórmula en la esquina: enciende el término nuevo de cada etapa
 function formula(ctx, t, i) { const a = sm(TL.tPregunta, TL.tPregunta + 0.4, t) * (1 - sm(TL.tFrase - 0.4, TL.tFrase, t)); if (a <= 0) return; const e = ET[i], flash = 1 - cl((t - e.t0) / 0.6), X = 70, Y = 262;
  R.chico(ctx, 'x(t) = Σ aₖ·cos(kt + φₖ)', X, Y, { px: 32, font: 'IBM Plex Mono', fw: 600, align: 'left', col: '#7fe0ff', kind: 'formula', alpha: a });
  R.chico(ctx, 'y(t) = Σ bₖ·cos(kt + ψₖ)', X, Y + 44, { px: 32, font: 'IBM Plex Mono', fw: 600, align: 'left', col: '#ff9ad4', kind: 'formula', alpha: a });
  // fila de términos k = … : los anteriores tenues, el NUEVO encendido
  const prev = i ? ET[i - 1].n : 0, ks = []; for (let k = Math.max(1, e.n - 4); k <= e.n; k++) ks.push(k); const s0 = e.n > 5 ? 'k = … ' : 'k = ';
  ctx.save(); ctx.font = '600 32px "IBM Plex Mono"'; let x = X; const yy = Y + 88; ctx.textBaseline = 'middle'; ctx.globalAlpha = a; ctx.fillStyle = 'rgba(220,225,255,0.6)'; ctx.fillText(s0, x, yy); x += ctx.measureText(s0).width;
  for (const k of ks) { const nuevo = k > prev, s = String(k) + ' '; ctx.fillStyle = nuevo ? `rgba(255,213,74,${0.75 + 0.25 * flash})` : 'rgba(220,225,255,0.55)'; if (nuevo) { ctx.shadowColor = 'rgba(255,213,74,0.9)'; ctx.shadowBlur = 18 * flash; } ctx.fillText(s, x, yy); ctx.shadowBlur = 0; x += ctx.measureText(s).width; }
  ctx.restore(); R.log('formula', X, yy - 20, x, yy + 20); }
 function draw(ctx, t) {
  const i = etapa(t), e = ET[i], u = cl((t - e.t0) / e.d), fin = sm(T_FIN, T_FIN + 0.8, t), zoom = E.inOut(win(t, T_FIN + 0.1, T_FIN + 1.1)), ug = t > T_FIN ? ((t - e.t0) / e.d) % 1 : u;
  ctx.save();
  // al terminar, la cámara se acerca al elefante (más grande) y lo centra
  const zs = lerp(1, 1.14, zoom); ctx.translate(lerp(O.x, 540, zoom), lerp(O.y, 880, zoom)); ctx.scale(zs, zs); ctx.translate(-O.x, -O.y);
  plano(ctx, 1 - fin);
  if (i > 0 && fin < 1) { ctx.save(); ctx.globalAlpha = 0.16 * (1 - u * 0.6); ctx.strokeStyle = '#9fb8ff'; ctx.lineWidth = 3; camino(ctx, ET[i - 1], 0, M); ctx.stroke(); ctx.restore(); }
  if (fin > 0) { ctx.save(); camino(ctx, e, 0, M); ctx.closePath(); const g = ctx.createLinearGradient(O.x - 320, O.y - 200, O.x + 320, O.y + 200); g.addColorStop(0, 'rgba(90,200,255,0.20)'); g.addColorStop(1, 'rgba(255,100,200,0.20)'); ctx.globalAlpha = fin; ctx.fillStyle = g; ctx.fill('nonzero'); ctx.restore(); }
  // trazo: más grueso y brillante
  ctx.save(); ctx.shadowColor = 'rgba(170,190,255,1)'; ctx.shadowBlur = 24; ctx.strokeStyle = GR(ctx); ctx.lineWidth = 7 + 1.5 * fin; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; camino(ctx, e, 0, Math.max(1, Math.floor(u * M))); ctx.stroke(); ctx.shadowBlur = 0; ctx.lineWidth = 2.2; ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.stroke(); ctx.restore();
  if (fin > 0) { const q1 = Math.floor(ug * M), q0 = Math.max(0, q1 - 90); ctx.save(); ctx.globalAlpha = 0.85 * fin; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 22; camino(ctx, e, q0, q1); ctx.stroke(); ctx.restore(); }
  // cadenas, líneas punteadas y lápiz
  const ca = 1 - fin; if (ca > 0.01) { const ex = cadena(ctx, FXc, e.n, ug, TOP, 0, ca), ey = cadena(ctx, FYc, e.n, ug, LEFT, 1, ca), p = [ex[0], ey[1]];
   ctx.save(); ctx.setLineDash([10, 9]); ctx.lineWidth = 2.4; ctx.strokeStyle = `rgba(127,224,255,${0.75 * ca})`; ctx.beginPath(); ctx.moveTo(ex[0], ex[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); ctx.strokeStyle = `rgba(255,124,198,${0.75 * ca})`; ctx.beginPath(); ctx.moveTo(ey[0], ey[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); ctx.setLineDash([]);
   ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, TAU); ctx.fill(); P.glow(ctx, p[0], p[1], 46, '255,255,255', 0.55 * ca); ctx.restore(); }
  ctx.restore();
  formula(ctx, t, i);
  R.contador(ctx, t, e.n, { y: 1360, px: 112, glow: '183,140,255', bump: 1 - cl((t - e.t0) / 0.3) });
  R.pregunta(ctx, t); R.frase(ctx, t, { px: 56 });
 }

 // ---------- 5 · SONIDO ----------
 const vel = (t) => { const e = ET[etapa(t)], u = cl((t - e.t0) / e.d), du = 1 / (e.d * 60), [a, b] = pen(e.n, u), [c, d] = pen(e.n, Math.min(1, u + du)); return Math.hypot(c - a, d - b) * 60; };
 function sound(k) {
  R.asmr(k, ET.map((e, q) => ({ t: e.t0, p: 10 + q, v: 0.75 })), { voz: 'campana', maxBin: 1, gain: 0.8 });
  R.asmr(k, [{ t: T_FIN, p: 15, v: 0.9 }, { t: T_FIN, p: 17, v: 0.7 }, { t: T_FIN, p: 20, v: 0.6 }], { voz: 'campana', maxBin: 3, gain: 0.9 });
  R.zumbido(k, 0, T_FIN, (t) => 150 + Math.min(500, vel(t) * 0.25), (t) => 0.6 + 0.4 * cl(vel(t) / 2200), { gain: 0.055, trozo: 0.5 });
 }

 const EP = R.make({ draw, sound, eventos: () => ET.map((e) => e.t0).concat([T_FIN]) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: FXc };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
