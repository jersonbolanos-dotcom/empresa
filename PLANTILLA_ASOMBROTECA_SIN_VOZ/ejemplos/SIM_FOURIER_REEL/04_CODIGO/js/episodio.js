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

 // ---------- 1 · SILUETA: elefante de una sola línea continua (diseño original), como trazo SVG (M/C/L) ----------
 // lomo → OREJA (bucle cerrado con lóbulo en punta, separada del cuerpo) → cráneo → OJO (almendra con pliegue) → TROMPA (arrugas en el
 // borde exterior y punta enroscada) → COLMILLO → pecho → patas delanteras (cercana con uñas, lejana detrás) → vientre → patas traseras
 // → muslo → COLA con mechón. Generado con tools/elefante (ver FUENTES_Y_DECISIONES.md).
 const TRAZO = 'M 165 300 C 180.0 210.0 290.0 148.0 410.0 138.0 C 480.0 132.0 555.0 142.0 612.0 162.0 C 640.0 190.0 668.0 250.0 684.0 312.0 C 698.0 368.0 694.0 420.0 664.0 458.0 C 648.0 478.0 636.0 500.0 630.0 524.0 C 616.0 500.0 590.0 486.0 560.0 474.0 C 522.0 456.0 500.0 420.0 494.0 384.0 C 488.0 344.0 470.0 320.0 474.0 280.0 C 478.0 238.0 462.0 200.0 476.0 160.0 C 490.0 118.0 530.0 96.0 566.0 100.0 C 594.0 104.0 606.0 130.0 612.0 162.0 C 650.0 130.0 720.0 104.0 790.0 106.0 C 850.0 110.0 894.0 140.0 906.0 192.0 C 912.0 210.0 915.0 220.0 917.0 230.0 C 905.0 229.0 895.0 226.0 887.0 226.0 C 878.0 214.0 858.0 214.0 852.0 228.0 C 848.0 242.0 872.0 248.0 886.0 238.0 C 895.0 240.0 907.0 243.0 918.0 246.0 C 922.0 272.0 926.0 300.0 927.0 328.0 L 928.6 330.1 L 930.2 332.2 L 931.9 334.2 L 933.7 336.2 L 935.4 338.2 L 936.9 340.4 L 938.3 342.7 L 939.5 345.2 L 941.4 347.1 L 943.6 348.9 L 945.6 350.9 L 947.3 353.0 L 948.6 355.4 L 949.6 358.1 L 950.2 360.9 L 952.6 362.7 L 955.1 364.4 L 957.3 366.3 L 958.9 368.5 L 960.0 371.2 L 960.4 374.2 L 960.7 377.3 L 963.7 378.8 L 966.5 380.4 L 968.7 382.5 L 970.0 385.0 L 970.5 388.0 L 970.3 391.3 L 971.3 394.1 L 974.6 395.5 L 977.4 397.3 L 979.4 399.5 L 980.2 402.3 L 980.0 405.7 L 979.1 409.4 L 981.6 411.3 L 985.0 412.9 L 987.6 414.9 L 989.0 417.5 L 989.1 420.7 L 988.1 424.3 L 987.6 427.7 L 991.4 429.3 L 994.6 431.1 L 996.6 433.5 L 997.2 436.5 L 996.4 440.0 L 994.6 443.8 L 996.7 446.2 L 1000.3 448.0 L 1002.9 450.3 L 1004.0 453.1 L 1003.5 456.4 L 1001.8 460.1 L 1000.9 463.5 L 1004.8 465.4 L 1007.7 467.7 L 1009.3 470.4 L 1009.2 473.6 L 1007.6 477.1 L 1005.4 480.5 L 1007.4 482.9 L 1010.4 485.1 L 1012.5 487.5 L 1013.2 490.2 L 1012.7 493.1 L 1011.1 496.1 L 1008.9 499.1 L 1010.4 501.6 L 1013.1 503.8 L 1014.9 506.2 L 1015.7 508.8 L 1015.3 511.4 L 1014.0 514.2 L 1012.1 517.0 L 1011.7 519.6 L 1014.2 521.9 L 1016.0 524.2 L 1017.0 526.6 L 1017.1 529.1 L 1016.3 531.6 L 1015.0 534.2 L 1013.3 536.8 L 1014.2 539.2 L 1016.0 541.4 L 1017.4 543.6 L 1018.0 545.9 L 1018.0 548.3 L 1017.4 550.6 L 1016.4 553.0 L 1015.1 555.4 L 1015.5 557.7 L 1016.9 559.8 L 1018.0 561.9 L 1018.7 564.0 L 1018.9 566.2 L 1018.7 568.4 L 1018.2 570.6 L 1017.6 572.8 L 1016.9 575.0 L 1017.8 577.0 L 1018.8 578.9 L 1019.5 580.9 L 1020.0 582.8 L 1020.3 584.8 L 1020.4 586.8 L 1020.3 588.8 L 1020.3 590.8 L 1020.2 592.8 L 1020.5 594.7 L 1021.3 596.4 L 1022.0 598.2 L 1022.5 599.9 L 1023.0 601.7 L 1023.5 603.5 L 1023.9 605.2 L 1024.3 607.0 L 1024.8 608.7 L 1025.3 610.4 L 1026.0 612.0 C 1036.0 634.0 1068.0 632.0 1073.0 606.0 C 1077.0 586.0 1061.0 575.0 1049.0 585.0 C 1043.0 590.0 1045.0 600.0 1038.0 598.0 C 1020.0 585.0 1004.0 560.0 990.0 520.0 C 976.0 480.0 962.0 452.0 942.0 428.0 C 926.0 412.0 908.0 404.0 889.0 402.0 C 905.0 430.0 925.0 462.0 950.0 474.0 C 962.0 479.0 972.0 474.0 976.0 462.0 C 966.0 478.0 950.0 486.0 934.0 482.0 C 912.0 472.0 896.0 450.0 884.0 428.0 C 868.0 436.0 844.0 446.0 818.0 448.0 C 792.0 452.0 774.0 472.0 770.0 502.0 C 778.0 548.0 786.0 598.0 780.0 646.0 C 776.0 676.0 779.0 692.0 788.0 702.0 C 790.0 712.0 780.0 718.0 770.0 714.0 C 762.0 720.0 750.0 720.0 744.0 714.0 C 736.0 720.0 726.0 720.0 720.0 714.0 C 712.0 716.0 704.0 714.0 702.0 708.0 C 700.0 664.0 698.0 606.0 704.0 548.0 C 694.0 552.0 682.0 554.0 672.0 556.0 C 670.0 604.0 667.0 652.0 666.0 690.0 C 666.0 704.0 662.0 712.0 654.0 714.0 C 642.0 716.0 628.0 716.0 618.0 712.0 C 612.0 664.0 612.0 606.0 620.0 548.0 C 582.0 552.0 520.0 560.0 470.0 556.0 C 440.0 553.0 416.0 548.0 402.0 542.0 C 406.0 592.0 406.0 642.0 402.0 690.0 C 402.0 704.0 398.0 712.0 390.0 714.0 C 378.0 716.0 364.0 716.0 354.0 712.0 C 350.0 662.0 348.0 604.0 346.0 550.0 C 338.0 550.0 328.0 548.0 320.0 546.0 C 326.0 600.0 334.0 648.0 328.0 690.0 C 330.0 704.0 328.0 712.0 320.0 716.0 C 312.0 722.0 300.0 722.0 294.0 716.0 C 286.0 722.0 274.0 722.0 268.0 716.0 C 260.0 720.0 252.0 718.0 246.0 712.0 C 240.0 664.0 232.0 604.0 220.0 542.0 C 206.0 472.0 184.0 422.0 174.0 382.0 C 172.0 366.0 170.0 352.0 168.0 340.0 C 152.0 362.0 144.0 420.0 140.0 468.0 C 132.0 480.0 122.0 494.0 126.0 506.0 C 130.0 512.0 136.0 502.0 139.0 512.0 C 142.0 520.0 148.0 508.0 151.0 516.0 C 156.0 522.0 158.0 500.0 153.0 492.0 C 151.0 484.0 150.0 478.0 150.0 470.0 C 154.0 420.0 160.0 380.0 170.0 352.0 C 170.0 330.0 166.0 315.0 165.0 300.0';
 const aplanar = (dd) => { const t = dd.trim().split(/\s+/), out = []; let i = 0, cx = 0, cy = 0;
  while (i < t.length) { const c = t[i++]; if (c === 'M' || c === 'L') { cx = +t[i++]; cy = +t[i++]; out.push([cx, cy]); }
   else if (c === 'C') { const x1 = +t[i++], y1 = +t[i++], x2 = +t[i++], y2 = +t[i++], x3 = +t[i++], y3 = +t[i++];
    for (let k = 1; k <= 24; k++) { const u = k / 24, v = 1 - u; out.push([v * v * v * cx + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u * x3, v * v * v * cy + 3 * v * v * u * y1 + 3 * v * u * u * y2 + u * u * u * y3]); } cx = x3; cy = y3; } }
  return out; };
 // ---------- 2 · GEOMETRÍA: plano abajo a la derecha, cadena x arriba, cadena y a la izquierda ----------
 const SC = 0.83, BX = 600, BY = 410;                       // centro de la silueta en sus coordenadas
 const O = { x: 676, y: 1040 }, TOP = { x: O.x, y: 560 }, LEFT = { x: 160, y: O.y };
 // ≥ 3.000 puntos del contorno (4.096) y hasta 1.800 círculos por cadena
 const MUESTRAS = SIM.resample(aplanar(TRAZO).map(([x, y]) => [(x - BX) * SC, (y - BY) * SC]), 4096);
 const FXc = SIM.fourier({ muestras: MUESTRAS.map((p) => [p[0], 0]), K: 1000 }), FYc = SIM.fourier({ muestras: MUESTRAS.map((p) => [p[1], 0]), K: 1000 });

 // ---------- 3 · ETAPAS (círculos por cadena y duración de cada vuelta) ----------
 const ETAPAS = [[1, 2.2], [2, 2.0], [3, 2.0], [4, 2.0], [5, 2.0], [6, 2.0], [8, 2.2], [10, 2.2], [13, 2.4], [18, 2.4], [40, 2.6], [1800, 3.8]];
 let acc = 0; const ET = ETAPAS.map(([n, d]) => { const e = { n: Math.min(n, FXc.coef.length), t0: acc, d }; acc += d; return e; }); const T_FIN = acc;
 const pen = (n, tau) => [O.x + FXc.punto(n, tau)[0], O.y + FYc.punto(n, tau)[0]];
 const M = 3000; ET.forEach((e) => { e.traza = new Float32Array(2 * (M + 1)); for (let q = 0; q <= M; q++) { const [x, y] = pen(e.n, q / M); e.traza[2 * q] = x; e.traza[2 * q + 1] = y; } });
 const ANCHO = (1073 - 128) * SC, ZF = 840 / ANCHO;   // el elefante terminado ocupa ~840 px de los 880 de la zona segura
 const etapa = (t) => { let i = 0; while (i < ET.length - 1 && t >= ET[i + 1].t0) i++; return i; };

 // ---------- 4 · DIBUJO ----------
 const camino = (ctx, e, q0, q1) => { ctx.beginPath(); for (let q = q0; q <= q1; q++) { const x = e.traza[2 * q], y = e.traza[2 * q + 1]; q === q0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } };
 const GR = (ctx) => { const g = ctx.createLinearGradient(O.x - 320, O.y - 200, O.x + 320, O.y + 200); g.addColorStop(0, '#7fe0ff'); g.addColorStop(0.5, '#c9a2ff'); g.addColorStop(1, '#ff7cc6'); return g; };
 function plano(ctx, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
  const x0 = 290, x1 = 1060, y0 = 760, y1 = 1330; ctx.strokeStyle = 'rgba(140,160,255,0.08)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = O.x % 40; x <= 1080; x += 40) if (x >= x0 && x <= x1) { ctx.moveTo(x, y0); ctx.lineTo(x, y1); } for (let y = O.y - 240; y <= y1; y += 40) if (y >= y0) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); } ctx.stroke();
  ctx.strokeStyle = 'rgba(200,210,255,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, O.y); ctx.lineTo(x1, O.y); ctx.moveTo(O.x, y1); ctx.lineTo(O.x, y0); ctx.stroke();
  ctx.fillStyle = 'rgba(200,210,255,0.35)'; ctx.beginPath(); ctx.moveTo(x1, O.y); ctx.lineTo(x1 - 14, O.y - 7); ctx.lineTo(x1 - 14, O.y + 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(O.x, y0); ctx.lineTo(O.x - 7, y0 + 14); ctx.lineTo(O.x + 7, y0 + 14); ctx.fill();
  ctx.beginPath(); for (let x = O.x - 360; x <= x1 - 30; x += 40) { ctx.moveTo(x, O.y - 6); ctx.lineTo(x, O.y + 6); } for (let y = y0 + 40; y <= y1; y += 40) { ctx.moveTo(O.x - 6, y); ctx.lineTo(O.x + 6, y); } ctx.stroke(); ctx.restore();
  R.chico(ctx, 'x', 918, O.y + 30, { px: 32, col: 'rgba(200,210,255,0.7)', kind: 'eje', alpha: a }); R.chico(ctx, 'y', O.x + 26, y0 + 10, { px: 32, col: 'rgba(200,210,255,0.7)', kind: 'eje', alpha: a }); }
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
  const zs = lerp(1, ZF, zoom); ctx.translate(lerp(O.x, 500, zoom), lerp(O.y, 860, zoom)); ctx.scale(zs, zs); ctx.translate(-O.x, -O.y);
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
  R.contador(ctx, t, e.n, { x: 430, y: 1394, px: 92, glow: '183,140,255', bump: 1 - cl((t - e.t0) / 0.3) });
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
