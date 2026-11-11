// =====================================================================================================
// episodio.js — «¿Quién pinta estas manchas?» · FORMATO: TURING · Plantilla Asombroteca SIN_VOZ 2.4
// Reacción-difusión de Gray-Scott (SIM.grayscott; Pearson 1993), un sistema del tipo que propuso Turing (1952): dos sustancias que
// reaccionan y se difunden a distinta velocidad. Sobre un trozo de piel lisa, unas pocas semillas crecen, se parten en dos y llenan
// la piel de manchas que se acomodan. El contador cuenta las manchas de verdad (grupos conectados) en cada fotograma. Colores de
// piel de leopardo: borde oscuro y centro algo más claro. Sonido: una gota cada vez que nace una mancha; al final, acorde de cierre.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 const NF = Math.round(D * 30) + 1, T_PARA = D - 3.2, PAS = TL.param.pasos ?? 11, GW = 140, GH = 146;
 const S = SIM.grayscott({ W: GW, H: GH, F: TL.param.F ?? 0.03, k: TL.param.k ?? 0.062, Du: 0.2097, Dv: 0.105, NF, semillas: TL.param.semillas ?? 12, seed: TL.semilla,
  pasos: (f) => (f === 0 ? 0 : f / 30 < T_PARA ? PAS : 1) });   // al final apenas avanza (se acomodan) mientras salen la frase y el empalme
 window.TURING_INFO = { manchas: [0, 150, 300, 450, 600, 750, 900, NF - 1].map((f) => S.manchas[Math.min(NF - 1, f)]) };

 // ---------- 2 · DIBUJO ----------
 const X0 = 150, Y0 = 400, AW = 780, AH = Math.round(780 * GH / GW), cv = document.createElement('canvas'); cv.width = GW; cv.height = GH; const c2 = cv.getContext('2d'), img = c2.createImageData(GW, GH);
 const piel = [200, 150, 82], borde = [40, 24, 12], centro = [112, 70, 34];
 const LUT = new Uint8Array(256 * 3); for (let i = 0; i < 256; i++) { const v = i / 510; let c;
  if (v < 0.12) c = piel; else if (v < 0.2) { const q = E.inOut((v - 0.12) / 0.08); c = piel.map((a, j) => lerp(a, borde[j], q)); } else if (v < 0.28) c = borde; else { const q = E.inOut(cl((v - 0.28) / 0.08)); c = borde.map((a, j) => lerp(a, centro[j], q)); }
  for (let j = 0; j < 3; j++) LUT[3 * i + j] = Math.round(c[j]); }
 // ---------- LEOPARDO (silueta original de perfil, caminando: una pata delantera adelantada) y cámara que se aleja ----------
 // Tronco, cuello y cabeza en un contorno; patas y cola desde su línea central con grosores. Manchas grandes en el tronco y
 // pequeñas en patas, cabeza y cola (el mismo patrón de la simulación, a dos escalas).
 const TRONCO = [[975,272],[968,256],[950,246],[934,232],[915,222],[904,214],[897,201],[885,204],[875,220],[856,236],[815,254],[775,258],[720,258],[640,250],[560,244],[480,246],[400,256],[345,270],[318,290],
  [306,322],[304,352],[318,384],[380,392],[450,386],[520,394],[600,412],[660,425],[712,418],[748,396],[780,372],[815,350],[850,334],[890,322],[925,312],[952,302],[966,292],[974,282]];
 const linea = (c) => { const L = [], Rr = []; for (let i = 0; i < c.length; i++) { const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, nx = -dy / m, ny = dx / m, w = c[i][2] / 2;
   L.push([c[i][0] + nx * w, c[i][1] + ny * w]); Rr.push([c[i][0] - nx * w, c[i][1] - ny * w]); } return L.concat(Rr.reverse()); };
 const PATA = (hx, hy, kx, ky, ax, ay, px, py, fx, w0) => linea([[hx, hy, w0], [kx, ky, w0 * 0.62], [ax, ay, w0 * 0.4], [px, py, w0 * 0.33], [fx, 597, w0 * 0.26]]);
 const PATAS_LEJOS = [PATA(395, 330, 440, 412, 405, 500, 410, 588, 432, 84), PATA(690, 350, 688, 435, 690, 518, 688, 588, 710, 64)];   // del otro lado (más oscuras)
 const PATAS_CERCA = [PATA(360, 330, 372, 418, 305, 502, 296, 588, 318, 92), PATA(728, 350, 752, 435, 772, 515, 786, 586, 812, 68)];    // trasera estirada atrás, delantera adelantada
 const COLA_C = [[322, 286, 30], [282, 302, 26], [236, 334, 22], [204, 390, 19], [190, 452, 16], [196, 510, 14], [214, 546, 12], [242, 560, 11], [264, 548, 10], [272, 526, 9]];
 const cola = (t) => { const th = 0.13 * Math.sin(t * 1.25) + 0.05 * Math.sin(t * 2.9), [bx, by] = COLA_C[0];   // la cola se balancea despacio (más en la punta)
  return linea(COLA_C.map(([x, y, w], i) => { const a = th * Math.pow(i / (COLA_C.length - 1), 1.4), c = Math.cos(a), sn = Math.sin(a), dx = x - bx, dy = y - by; return [bx + dx * c - dy * sn, by + dx * sn + dy * c, w]; })); };
 const tronco = (t) => { const r = 4.5 * Math.sin(TAU * t / 2.8); return TRONCO.map(([x, y]) => [x, y + (y > 340 && x > 520 && x < 800 ? r * Math.sin(Math.PI * (x - 520) / 280) : 0)]); };   // respira: el pecho sube y baja

 const LX = (x) => 80 + (x - 180) * 1.15, LY = (y) => 1150 - (600 - y) * 1.15, SUELO = LY(600);
 const camino = (ctx, pts) => { const q = pts.map(([x, y]) => [LX(x), LY(y)]), n = q.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  ctx.beginPath(); let p = m(q[n - 1], q[0]); ctx.moveTo(p[0], p[1]); for (let i = 0; i < n; i++) { const c = q[i], e = m(q[i], q[(i + 1) % n]); ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]); } ctx.closePath(); };
 const WW = 300, WH = WW * AH / AW, PC = [LX(560), LY(325)], LC = [540, 920], Z0 = AW / WW, CW = [540, Y0 + AH / 2];   // el trozo de piel inicial es un trozo del lomo
 const T_Z0 = 19.0, T_Z1 = 22.4, T_B0 = D - 3.6, T_B1 = D - 1.4;   // se aleja antes de la frase y vuelve a acercarse para el empalme
 const zoomE = (t) => E.inOut(cl((t - T_Z0) / (T_Z1 - T_Z0))) * (1 - E.inOut(cl((t - T_B0) / (T_B1 - T_B0))));

 // piel con bordes que se difuminan: fe = 0 → recuadro redondeado con luz de estudio; fe = 1 → mancha de piel sin bordes ni luz
 const FX = document.createElement('canvas'); FX.width = AW; FX.height = AH; const fxc = FX.getContext('2d');
 const piel_difusa = (t, fe) => { fxc.setTransform(1, 0, 0, 1, 0, 0); fxc.globalCompositeOperation = 'source-over'; fxc.clearRect(0, 0, AW, AH);
  fxc.save(); fxc.beginPath(); fxc.roundRect(0, 0, AW, AH, 46); fxc.clip(); fxc.imageSmoothingEnabled = true; fxc.imageSmoothingQuality = 'high'; fxc.drawImage(cv, 0, 0, AW, AH);
  const va = 1 - fe; if (va > 0.01) { const lx = AW / 2 + 120 * Math.sin(t * 0.21), ly = AH * (0.45 + 0.08 * Math.cos(t * 0.17)), g = fxc.createRadialGradient(lx, ly, 60, lx, ly, AW * 0.72);
   g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.6, `rgba(0,0,0,${0.25 * va})`); g.addColorStop(1, `rgba(0,0,0,${0.85 * va})`); fxc.fillStyle = g; fxc.fillRect(0, 0, AW, AH); }
  fxc.restore();
  if (fe > 0.01) { fxc.globalCompositeOperation = 'destination-in'; const R0 = AW * lerp(0.75, 0.18, fe), R1 = AW * lerp(0.76, 0.52, fe), m = fxc.createRadialGradient(AW / 2, AH / 2, R0, AW / 2, AH / 2, R1);
   m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)'); fxc.fillStyle = m; fxc.fillRect(0, 0, AW, AH); fxc.globalCompositeOperation = 'source-over'; }
  return FX; };

 function draw(ctx, t) {
  const f = Math.min(NF - 1, Math.round(t * 30)), off = f * GW * GH, fin = 1 - sm(D - 2.6, D - 0.9, t), d = img.data;   // al final la piel vuelve a quedar lisa
  for (let i = 0; i < GW * GH; i++) { const j = Math.round(S.v[off + i] * fin), o = 4 * i; d[o] = LUT[3 * j]; d[o + 1] = LUT[3 * j + 1]; d[o + 2] = LUT[3 * j + 2]; d[o + 3] = 255; }
  c2.putImageData(img, 0, 0);
  const e = zoomE(t);
  // la piel en su recuadro; desde 17,6 s pierde la luz de estudio y sus bordes se difuminan (al alejarse no queda ningún borde)
  const fe = Math.max(sm(T_Z0 - 1.4, T_Z0, t), e > 0 ? 1 : 0) * (1 - sm(T_B1 - 0.2, T_B1 + 0.6, t)), fx = piel_difusa(t, fe);
  if (e < 0.001) { ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(fx, X0, Y0, AW, AH); ctx.restore(); } else {
   const z = Math.exp(lerp(Math.log(Z0), 0, e)), cs = [lerp(CW[0], LC[0], e), lerp(CW[1], LC[1], e)], wc = [lerp(PC[0], LC[0], e), lerp(PC[1], LC[1], e)];
   const patG = ctx.createPattern(cv, 'repeat'); patG.setTransform(new DOMMatrix().translate(PC[0] - WW / 2, PC[1] - WH / 2).scale(WW / GW, WH / GH));          // manchas grandes (tronco)
   const patP = ctx.createPattern(cv, 'repeat'); patP.setTransform(new DOMMatrix().translate(PC[0], PC[1]).scale(0.45 * WW / GW, 0.45 * WH / GH));              // manchas pequeñas (patas, cabeza, cola)
   ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.translate(cs[0], cs[1]); ctx.scale(z, z); ctx.translate(-wc[0], -wc[1]);
   ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(LX(560), SUELO + 4, 430, 18, 0, 0, TAU); ctx.fill();
   ctx.strokeStyle = 'rgba(160,140,120,0.35)'; ctx.lineWidth = 3 / z; ctx.beginPath(); ctx.moveTo(-300, SUELO); ctx.lineTo(1380, SUELO); ctx.stroke();
   const claro = (pts, y0, y1, a) => { ctx.save(); camino(ctx, pts); ctx.clip(); const g = ctx.createLinearGradient(0, LY(y0), 0, LY(y1)); g.addColorStop(0, 'rgba(255,238,205,0)'); g.addColorStop(1, `rgba(255,238,205,${a})`); ctx.fillStyle = g; ctx.fillRect(-300, LY(y0), 1700, LY(y1) - LY(y0) + 40); ctx.restore(); };
   const pieza = (pts, pat, osc) => { camino(ctx, pts); ctx.fillStyle = pat; ctx.fill(); if (osc) { ctx.fillStyle = `rgba(25,12,0,${osc})`; ctx.fill(); } };
   for (const pt of PATAS_LEJOS) { pieza(pt, patP, 0.4); claro(pt, 480, 600, 0.25); }
   const COLA = cola(t), TR = tronco(t);
   pieza(COLA, patP, 0);
   for (const pt of PATAS_CERCA) { pieza(pt, patP, 0); claro(pt, 470, 600, 0.3); camino(ctx, pt); ctx.strokeStyle = 'rgba(30,15,5,0.55)'; ctx.lineWidth = 2.2 / z; ctx.stroke(); }   // su contorno queda debajo del cuerpo
   pieza(TR, patG, 0);
   ctx.save(); camino(ctx, TR); ctx.clip(); ctx.fillStyle = patP; for (let q = 0; q < 8; q++) { ctx.globalAlpha = (q + 1) / 8; ctx.fillRect(LX(800 + q * 8), LY(180), LX(1000) - LX(800 + q * 8), LY(340) - LY(180)); } ctx.globalAlpha = 1; ctx.restore();   // cabeza y cuello: manchas pequeñas (transición gradual)
   claro(TR, 330, 410, 0.55);   // vientre más claro
   ctx.save(); camino(ctx, TR); ctx.clip(); const gs = ctx.createLinearGradient(0, LY(240), 0, LY(300)); gs.addColorStop(0, 'rgba(60,30,0,0.25)'); gs.addColorStop(1, 'rgba(60,30,0,0)'); ctx.fillStyle = gs; ctx.fillRect(-300, LY(200), 1700, 200); ctx.restore();   // lomo algo más oscuro
   ctx.strokeStyle = 'rgba(30,15,5,0.55)'; ctx.lineWidth = 2.2 / z; for (const pt of [TR, COLA]) { camino(ctx, pt); ctx.stroke(); }
   // ojo, nariz, boca y oreja
   ctx.fillStyle = '#1a0e05'; ctx.beginPath(); ctx.ellipse(LX(935), LY(256), 9, 5, -0.2, 0, TAU); ctx.fill(); ctx.fillStyle = '#e8c070'; ctx.beginPath(); ctx.arc(LX(933), LY(255), 2.8, 0, TAU); ctx.fill();
   ctx.fillStyle = '#2a1608'; ctx.beginPath(); ctx.ellipse(LX(971), LY(272), 7, 5, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 2.4 / z; ctx.beginPath(); ctx.moveTo(LX(970), LY(277)); ctx.quadraticCurveTo(LX(964), LY(290), LX(948), LY(294)); ctx.stroke();
   ctx.beginPath(); ctx.moveTo(LX(895), LY(206)); ctx.lineTo(LX(887), LY(218)); ctx.lineTo(LX(900), LY(217)); ctx.closePath(); ctx.fillStyle = '#2a1608'; ctx.fill();
   // el trozo de piel inicial se funde con el lomo al empezar a alejarse
   // la misma piel difusa se funde con el lomo (mismo patrón): sobre el cuerpo se va despacio; fuera del cuerpo, enseguida (sin halo)
   const pa = 1 - sm(0, 0.45, e), po = 1 - sm(0, 0.12, e);
   if (po > 0.01) { ctx.globalAlpha = po; ctx.drawImage(fx, PC[0] - WW / 2, PC[1] - WH / 2, WW, WH); ctx.globalAlpha = 1; }
   if (pa > 0.01) { ctx.save(); camino(ctx, TR); ctx.clip(); ctx.globalAlpha = pa; ctx.drawImage(fx, PC[0] - WW / 2, PC[1] - WH / 2, WW, WH); ctx.restore(); }
   ctx.restore();
  }
  R.contador(ctx, t, Math.round(S.manchas[f] * fin), { x: 540, y: 1325, px: 96, glow: '255,170,80' });
  R.chico(ctx, 'manchas', 540, 1388, { px: 32, col: 'rgba(255,215,170,0.9)', kind: 'unidad' });
  R.pregunta(ctx, t, { y: 300, px: 72 }); R.frase(ctx, t, { y: 300, px: 42 });
 }

 // ---------- 3 · SONIDO: una gota por cada mancha nueva (cuando una se parte o aparece) ----------
 const EVM = []; for (let f = 1; f < NF && f / 30 < D - 2.6; f++) { const nu = S.manchas[f] - S.manchas[f - 1]; for (let q = 0; q < Math.min(3, nu); q++) EVM.push({ t: f / 30 + q * 0.011, p: 8 + ((S.manchas[f] + q) % 9), v: 0.55, pan: ((S.manchas[f] * 37 + q * 11) % 100) / 100 - 0.5 }); }
 for (let q = 0; q < (TL.param.semillas ?? 8); q++) EVM.unshift({ t: 0.03 + q * 0.2, p: 6 + q, v: 0.5, pan: (q / 7 - 0.5) * 0.8 });   // una gota por cada semilla, desde el fotograma 0
 function sound(k) { R.asmr(k, EVM, { voz: 'gota', maxBin: 2, bin: 1 / 40, dens: 40, gain: 0.8 }); R.cierre(k); }
 const EP = R.make({ draw, sound, eventos: () => EVM.map((e) => e.t).concat([TL.tFrase]) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
