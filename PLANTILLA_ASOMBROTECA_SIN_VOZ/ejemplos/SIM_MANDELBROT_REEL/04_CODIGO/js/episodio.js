// =====================================================================================================
// episodio.js — «¿Dónde termina esta figura?» · FORMATO: MANDELBROT · Plantilla Asombroteca SIN_VOZ 2.4
// Zoom continuo en el conjunto de Mandelbrot (z → z² + c), a velocidad constante en escala logarítmica, por el valle de los caballitos
// de mar hasta una minicopia (periodo 507, núcleo hallado con Newton). Su tamaño y giro (s = 1/(β·λ²)) dicen cuánto acercarse y cuánto
// girar para que al final la minicopia quede encuadrada exactamente como el conjunto entero del fotograma 0: el vídeo empalma solo.
// Cada píxel se calcula en cada fotograma (resolución completa, escape continuo, detección de órbitas periódicas para el interior);
// las iteraciones máximas crecen con el aumento para no perder nitidez. Sonido: una nota cada vez que el aumento se duplica (cada vez
// más aguda) y una campana cada ×10; al final, el acorde de cierre.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · LA MINICOPIA Y EL RECORRIDO ----------
 const PER = TL.param.periodo ?? 507, [NR, NI] = SIM.mandel.nucleo(TL.param.cr, TL.param.ci, PER, 100), [SR, SI] = SIM.mandel.tamano(NR, NI, PER);
 const W0 = 3.3, C0 = [-0.66, 0], SZ = Math.hypot(SR, SI), ROT = Math.atan2(SI, SR), W1 = W0 * SZ;            // ancho de la vista (unidades de c)
 const T = [NR + SR * C0[0] - SI * C0[1], NI + SR * C0[1] + SI * C0[0]];                                        // centro final: la minicopia encuadrada como el conjunto
 const LZ = Math.log(W0 / W1); window.MANDEL_INFO = { nucleo: [NR, NI], tamano: SZ, giroGrados: ROT * 180 / Math.PI, aumentoFinal: W0 / W1 };
 const vista = (t) => { const u = cl(t / D), w = W0 * Math.exp(-LZ * u), q = Math.pow(1 - u, 2) * (w / W0);   // velocidad constante en log; la minicopia va al centro
  return { u, w, cx: T[0] + (C0[0] - T[0]) * q, cy: T[1] + (C0[1] - T[1]) * q, th: ROT * u, maxIt: Math.round(400 + 2600 * Math.pow(u, 1.6)) }; };

 // ---------- 2 · CÁLCULO DE CADA PÍXEL ----------
 const it = (cr, ci, maxIt) => { let zr = 0, zi = 0, pr = 0, pi = 0, per = 8, k = 0;
  const q = (cr - 0.25) * (cr - 0.25) + ci * ci; if (q * (q + (cr - 0.25)) < 0.25 * ci * ci || (cr + 1) * (cr + 1) + ci * ci < 0.0625) return -1;   // cardioide y bulbo principales
  for (let n = 0; n < maxIt; n++) { const zr2 = zr * zr, zi2 = zi * zi; if (zr2 + zi2 > 1e6) return n + 1 - Math.log2(Math.log2(zr2 + zi2) / 2);
   zi = 2 * zr * zi + ci; zr = zr2 - zi2 + cr;
   if (Math.abs(zr - pr) < 1e-22 && Math.abs(zi - pi) < 1e-22) return -1;
   if (++k === per) { k = 0; per *= 2; pr = zr; pi = zi; } } return -1; };
 const W = 1080, HH = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = HH; const cx2 = cv.getContext('2d'), img = cx2.createImageData(W, HH), px = img.data;
 const LUT = new Uint8Array(1024 * 3); for (let i = 0; i < 1024; i++) { const x = i / 1024; for (let c = 0; c < 3; c++) LUT[3 * i + c] = Math.round(255 * cl(0.5 + 0.5 * Math.cos(TAU * (x + [0.0, 0.33, 0.67][c] + 0.1)))); }   // paleta cíclica viva
 const NB = new Float32Array(W * HH);
 function fractal(t) { const V = vista(t), cs = Math.cos(V.th), sn = Math.sin(V.th), k = V.w / W, fase = t * 0.03; let nmin = Infinity;
  for (let y = 0; y < HH; y++) { const v = (y - HH / 2) * k; for (let x = 0; x < W; x++) { const u = (x - W / 2) * k, n = it(V.cx + u * cs + v * sn, V.cy + u * sn - v * cs, V.maxIt); NB[y * W + x] = n; if (n >= 0 && n < nmin) nmin = n; } }
  // brillo relativo a lo que tarda en escapar el píxel más rápido del fotograma: lejos del conjunto, oscuro; en sus bordes, luz viva
  const tau = 10 + 0.9 * nmin;
  for (let i = 0; i < W * HH; i++) { const n = NB[i], o = 4 * i;
   if (n < 0) { px[o] = 4; px[o + 1] = 4; px[o + 2] = 10; } else { const b = Math.pow(1 - Math.exp(-(n - nmin) / tau), 2.2), s = Math.log2(n + 1) * 0.32 + fase, j = (((s % 1) + 1) % 1 * 1024) | 0;
    px[o] = 8 + LUT[3 * j] * b; px[o + 1] = 6 + LUT[3 * j + 1] * b; px[o + 2] = 18 + LUT[3 * j + 2] * b; }
   px[o + 3] = 255; }
  cx2.putImageData(img, 0, 0); return cv; }
 const aumento = (t) => W0 / vista(t).w;
 const fmtA = (z) => { const r2 = (x) => { const p = Math.pow(10, Math.floor(Math.log10(x)) - 1); return Math.round(x / p) * p; };
  if (z < 1e6) return '×' + P.fmtN(Math.max(1, Math.round(r2(Math.max(1, z))))); const m = z / 1e6; return '×' + (m < 10 ? m.toFixed(1).replace('.', ',') : P.fmtN(Math.round(r2(m)))) + ' millones'; };

 // ---------- 3 · DIBUJO ----------
 function draw(ctx, t) {
  if (!window.__SAFE_QC) ctx.drawImage(fractal(t), 0, 0);   // (el QC de textos solo mira dónde están los textos: no calcula el fractal)
  R.contador(ctx, t, fmtA(aumento(t)), { x: 540, y: 1345, px: 92, glow: '255,120,200', maxW: 820 });
  R.pregunta(ctx, t, { y: 300, px: 72 }); R.frase(ctx, t, { y: 300, px: 52 });
 }

 // ---------- 4 · SONIDO: una nota en cada duplicación del aumento, una campana en cada ×10 y el acorde de cierre ----------
 const EVD = [], EVC = []; for (let k = 1; k * Math.LN2 < LZ; k++) EVD.push({ t: D * k * Math.LN2 / LZ, p: 4 + (k % 12), v: 0.5 }); for (let m = 1; m * Math.LN10 < LZ; m++) EVC.push({ t: D * m * Math.LN10 / LZ, p: 3, v: 0.8 });
 function sound(k) { R.asmr(k, EVD, { voz: 'cristal', maxBin: 1, bin: 0.05, gain: 0.8 }); R.asmr(k, EVC, { voz: 'campana', maxBin: 1, bin: 0.05, gain: 0.6 }); R.cierre(k); }
 const EP = R.make({ draw, sound, eventos: () => EVD.concat(EVC).map((e) => e.t).concat([TL.tFrase]) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
