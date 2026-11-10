// =====================================================================================================
// episodio.js — «¿Qué animal dibujan estos círculos?» · FORMATO: FOURIER · Plantilla Asombroteca SIN_VOZ 2.0
// Epiciclos de Fourier (DFT del contorno de un elefante dibujado de una sola línea: lomo, cabeza, oreja, trompa, colmillo,
// patas con uñas y cola; el ojo se añade al completar el dibujo). Cada etapa añade más círculos y el trazo pasa de una elipse a un garabato y por fin al elefante detallado.
// Sonido: campanita que sube con cada etapa nueva + zumbido suave del lápiz cuyo tono sigue a su velocidad.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SILUETA (orden del trazo; coordenadas de dibujo, y hacia abajo, elefante mirando a la derecha) ----------
 const SIL = [
  [200, 250], [262, 196], [345, 166], [432, 152], [520, 156], [598, 170], [650, 186],                       // lomo
  [674, 196], [668, 240], [656, 300], [654, 356], [676, 400], [722, 410], [762, 370], [776, 300], [760, 230], [728, 186],   // oreja (bucle)
  [744, 146], [800, 140], [852, 168],                                                                        // cráneo
  [878, 210], [892, 270], [900, 334], [906, 398], [918, 462], [936, 522], [958, 572], [986, 602], [1010, 598], [1016, 574], [996, 566], // trompa, por fuera
  [974, 548], [952, 504], [936, 452], [922, 404], [906, 376],                                                // trompa, por dentro
  [902, 392], [936, 412], [970, 438], [966, 450], [924, 436], [890, 416],                                    // colmillo
  [860, 422], [826, 444], [792, 456], [772, 474],                                                            // mandíbula y pecho
  [778, 530], [780, 604], [784, 662], [796, 690], [792, 704], [772, 710], [752, 703], [732, 710], [708, 704], [700, 668], [704, 590], [700, 528], // pata delantera (con uñas)
  [652, 512], [560, 522], [470, 522], [402, 512],                                                            // vientre
  [384, 544], [380, 624], [384, 672], [394, 694], [390, 706], [368, 712], [344, 705], [320, 712], [294, 706], [284, 672], [270, 602], [250, 524], [226, 462], // pata trasera (con uñas)
  [208, 402], [198, 344],                                                                                    // anca
  [176, 338], [162, 374], [156, 424], [146, 448], [158, 462], [172, 450], [174, 414], [182, 370], [197, 342], // cola
  [199, 296],
 ];
 const SC = 0.95, OX = 540 - 580 * SC, OY = 850 - 430 * SC;
 const F = SIM.fourier({ trazo: SIL.map(([x, y]) => [OX + x * SC, OY + y * SC]), N: 2048, K: 520 });

 // ---------- 2 · ETAPAS (cuántos círculos y cuánto dura cada vuelta completa) ----------
 // muchas etapas con pocos círculos (el animal no se adivina) y el salto a cientos de círculos solo al final
 const ETAPAS = [[1, 2.4], [2, 2.2], [3, 2.2], [4, 2.2], [5, 2.2], [6, 2.2], [8, 2.4], [10, 2.4], [13, 2.6], [18, 2.6], [40, 2.6], [900, 3.4]];
 let acc = 0; const ET = ETAPAS.map(([n, d]) => { const e = { n: Math.min(n, F.coef.length), t0: acc, d }; acc += d; return e; }); const T_FIN = acc;   // 29.5 s
 const M = 1100; ET.forEach((e) => { e.traza = new Float32Array(2 * (M + 1)); for (let q = 0; q <= M; q++) { const [x, y] = F.punto(e.n, q / M); e.traza[2 * q] = x; e.traza[2 * q + 1] = y; } });
 const etapa = (t) => { let i = 0; while (i < ET.length - 1 && t >= ET[i + 1].t0) i++; return i; };
 const tau = (t) => { const e = ET[etapa(t)]; return cl((t - e.t0) / e.d); };

 // ---------- 3 · DIBUJO ----------
 const traza = (ctx, e, u, w, col, a) => { const m = Math.max(1, Math.floor(u * M)); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); for (let q = 0; q <= m; q++) { const x = e.traza[2 * q], y = e.traza[2 * q + 1]; q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); };
 function draw(ctx, t) {
  const i = etapa(t), e = ET[i], u = tau(t), fin = sm(T_FIN, T_FIN + 0.8, t);
  // etapa anterior como fantasma (se ve cómo mejora)
  if (i > 0 && fin < 1) traza(ctx, ET[i - 1], 1, 3, 'rgba(120,200,255,1)', 0.18 * (1 - u * 0.6));
  // relleno suave cuando el elefante se completa
  if (fin > 0) { ctx.save(); ctx.beginPath(); for (let q = 0; q <= M; q++) { const x = e.traza[2 * q], y = e.traza[2 * q + 1]; q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); const g = ctx.createLinearGradient(160, 450, 1000, 1150); g.addColorStop(0, 'rgba(80,190,255,0.22)'); g.addColorStop(1, 'rgba(255,90,190,0.22)'); ctx.globalAlpha = fin; ctx.fillStyle = g; ctx.fill('nonzero'); ctx.restore();
   // la oreja (lámina) y el colmillo (marfil) se rellenan al completar la silueta, para leer el animal de un vistazo
   const poly = (a, b) => { ctx.beginPath(); for (let q = a; q <= b; q++) { const [x, y] = SIL[q]; q === a ? ctx.moveTo(OX + x * SC, OY + y * SC) : ctx.lineTo(OX + x * SC, OY + y * SC); } ctx.closePath(); };
   ctx.save(); ctx.globalAlpha = fin; poly(7, 16); ctx.fillStyle = 'rgba(190,150,255,0.30)'; ctx.fill(); poly(36, 41); ctx.fillStyle = 'rgba(255,246,225,0.85)'; ctx.fill(); ctx.restore();
   // detalles finales: el ojo (dibujado al completar la silueta)
   const ex = OX + 838 * SC, ey = OY + 238 * SC; ctx.save(); ctx.globalAlpha = fin; ctx.fillStyle = '#e9e4ff'; ctx.beginPath(); ctx.ellipse(ex, ey, 11, 8, -0.3, 0, TAU); ctx.fill(); ctx.fillStyle = '#1a1530'; ctx.beginPath(); ctx.arc(ex + 2, ey + 1, 5, 0, TAU); ctx.fill(); ctx.restore(); }
  // trazo actual con brillo y degradado
  const gr = ctx.createLinearGradient(160, 450, 1000, 1150); gr.addColorStop(0, '#5fd2ff'); gr.addColorStop(0.55, '#b78cff'); gr.addColorStop(1, '#ff5fb4');
  ctx.save(); ctx.shadowColor = 'rgba(150,170,255,0.9)'; ctx.shadowBlur = 16; traza(ctx, e, u, 5 + fin, gr, 1); ctx.restore();
  // epiciclos (se apagan al terminar el dibujo)
  const ca = 1 - fin; if (ca > 0) { const ch = F.cadena(e.n, u); ctx.save(); ctx.lineWidth = 1.6;
   for (let j = 0; j < e.n; j++) { const r = F.coef[j].r; if (r < 0.7) break; const [x, y] = ch[j], [x2, y2] = ch[j + 1]; ctx.strokeStyle = `rgba(255,255,255,${ca * (j < 3 ? 0.32 : 0.18)})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.strokeStyle = `rgba(255,255,255,${ca * 0.55})`; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke(); }
   const [px, py] = ch[ch.length - 1]; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(px, py, 7, 0, TAU); ctx.fill(); P.glow(ctx, px, py, 40, '255,255,255', 0.5 * ca); ctx.restore(); }
  R.contador(ctx, t, e.n, { y: 1345, glow: '183,140,255', bump: 1 - cl((t - e.t0) / 0.3) });
  R.pregunta(ctx, t); R.frase(ctx, t, { px: 56 });
 }

 // ---------- 4 · SONIDO ----------
 const vel = (t) => { const e = ET[etapa(t)], u = tau(t), du = 1 / (e.d * 60), [a, b] = F.punto(e.n, u), [c, d] = F.punto(e.n, Math.min(1, u + du)); return Math.hypot(c - a, d - b) * 60; };
 function sound(k) {
  R.asmr(k, ET.map((e, q) => ({ t: e.t0, p: 10 + q, v: 0.75 })), { voz: 'campana', maxBin: 1, gain: 0.8 });
  R.asmr(k, [{ t: T_FIN, p: 15, v: 0.9 }, { t: T_FIN, p: 17, v: 0.7 }, { t: T_FIN, p: 20, v: 0.6 }], { voz: 'campana', maxBin: 3, gain: 0.9 });
  R.zumbido(k, 0, T_FIN, (t) => 150 + Math.min(500, vel(t) * 0.22), (t) => 0.6 + 0.4 * cl(vel(t) / 2500), { gain: 0.055, trozo: 0.5 });
 }

 const EP = R.make({ draw, sound, eventos: () => ET.map((e) => e.t0).concat([T_FIN]) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: F };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
