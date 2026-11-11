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
 function draw(ctx, t) {
  const f = Math.min(NF - 1, Math.round(t * 30)), off = f * GW * GH, fin = 1 - sm(D - 2.6, D - 0.9, t), d = img.data;   // al final la piel vuelve a quedar lisa
  for (let i = 0; i < GW * GH; i++) { const j = Math.round(S.v[off + i] * fin), o = 4 * i; d[o] = LUT[3 * j]; d[o + 1] = LUT[3 * j + 1]; d[o + 2] = LUT[3 * j + 2]; d[o + 3] = 255; }
  c2.putImageData(img, 0, 0);
  ctx.save(); ctx.beginPath(); ctx.roundRect(X0, Y0, AW, AH, 46); ctx.clip(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(cv, X0, Y0, AW, AH);
  // luz de estudio sobre la piel (centro iluminado, bordes en sombra)
  const lx = 540 + 120 * Math.sin(t * 0.21), ly = Y0 + AH * (0.45 + 0.08 * Math.cos(t * 0.17));   // la luz se mueve despacio
  const g = ctx.createRadialGradient(lx, ly, 60, lx, ly, AW * 0.72); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.6, 'rgba(0,0,0,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = g; ctx.fillRect(X0, Y0, AW, AH); ctx.restore();
  R.contador(ctx, t, Math.round(S.manchas[f] * fin), { x: 540, y: 1325, px: 96, glow: '255,170,80' });
  R.chico(ctx, 'manchas', 540, 1388, { px: 32, col: 'rgba(255,215,170,0.9)', kind: 'unidad' });
  R.pregunta(ctx, t, { y: 300, px: 72 }); R.frase(ctx, t, { y: 300, px: 42 });
 }

 // ---------- 3 · SONIDO: una gota por cada mancha nueva (cuando una se parte o aparece) ----------
 const EVM = []; for (let f = 1; f < NF && f / 30 < D - 2.6; f++) { const nu = S.manchas[f] - S.manchas[f - 1]; for (let q = 0; q < Math.min(3, nu); q++) EVM.push({ t: f / 30 + q * 0.011, p: 8 + ((S.manchas[f] + q) % 9), v: 0.55, pan: ((S.manchas[f] * 37 + q * 11) % 100) / 100 - 0.5 }); }
 function sound(k) { R.asmr(k, EVM, { voz: 'gota', maxBin: 2, bin: 1 / 40, dens: 40, gain: 0.8 }); R.cierre(k); }
 const EP = R.make({ draw, sound, eventos: () => EVM.map((e) => e.t).concat([TL.tFrase]) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
