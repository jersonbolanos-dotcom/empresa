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
 // ---------- LEOPARDO (silueta original, de perfil, de pie sobre el suelo) y cámara que se aleja ----------
 const LP = [[985,300],[978,280],[955,262],[930,250],[918,228],[905,210],[888,214],[880,238],[862,250],[820,250],[760,225],[700,225],[600,235],[500,238],[400,228],[330,228],[280,245],[255,268],
  [200,282],[150,312],[110,362],[90,422],[92,482],[110,522],[140,542],[160,534],[165,515],[140,510],[124,478],[122,430],[137,382],[172,337],[222,307],[262,295],
  [258,335],[262,385],[280,425],[300,460],[305,520],[300,580],[312,600],[372,600],[370,585],[352,575],[345,520],[345,475],[360,445],[390,440],
  [450,450],[530,456],[600,452],[640,445],[655,490],[652,560],[648,588],[660,600],[718,600],[712,585],[700,575],[698,520],[700,470],[712,440],
  [750,420],[800,398],[840,375],[880,352],[915,338],[945,328],[965,320],[980,312]];
 const PATAS = [[[300,430],[330,450],[345,505],[340,560],[338,588],[350,600],[400,600],[396,586],[382,575],[378,520],[380,465],[360,435]],
  [[610,440],[628,485],[624,560],[620,588],[632,600],[680,600],[676,586],[664,575],[662,520],[664,475],[650,440]]];
 const LX = (x) => 40 + (x - 90) * 1.12, LY = (y) => 1150 - (600 - y) * 1.12, SUELO = LY(600);
 const camino = (ctx, pts) => { const q = pts.map(([x, y]) => [LX(x), LY(y)]), n = q.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  ctx.beginPath(); let p = m(q[n - 1], q[0]); ctx.moveTo(p[0], p[1]); for (let i = 0; i < n; i++) { const c = q[i], e = m(q[i], q[(i + 1) % n]); ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]); } ctx.closePath(); };
 const WW = 200, WH = WW * AH / AW, PC = [LX(510), LY(342)], LC = [540, 900], Z0 = AW / WW, CW = [540, Y0 + AH / 2];   // ventana inicial: un trozo del lomo
 const T_Z0 = 19.0, T_Z1 = 22.4, T_B0 = D - 3.6, T_B1 = D - 1.4;   // se aleja antes de la frase y vuelve a acercarse para el empalme
 const zoomE = (t) => E.inOut(cl((t - T_Z0) / (T_Z1 - T_Z0))) * (1 - E.inOut(cl((t - T_B0) / (T_B1 - T_B0))));

 function draw(ctx, t) {
  const f = Math.min(NF - 1, Math.round(t * 30)), off = f * GW * GH, fin = 1 - sm(D - 2.6, D - 0.9, t), d = img.data;   // al final la piel vuelve a quedar lisa
  for (let i = 0; i < GW * GH; i++) { const j = Math.round(S.v[off + i] * fin), o = 4 * i; d[o] = LUT[3 * j]; d[o + 1] = LUT[3 * j + 1]; d[o + 2] = LUT[3 * j + 2]; d[o + 3] = 255; }
  c2.putImageData(img, 0, 0);
  const e = zoomE(t), z = Math.exp(lerp(Math.log(Z0), 0, e)), cs = [lerp(CW[0], LC[0], e), lerp(CW[1], LC[1], e)], wc = [lerp(PC[0], LC[0], e), lerp(PC[1], LC[1], e)];
  const pat = ctx.createPattern(cv, 'repeat'); pat.setTransform(new DOMMatrix().translate(PC[0] - WW / 2, PC[1] - WH / 2).scale(WW / GW, WH / GH));
  ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.translate(cs[0], cs[1]); ctx.scale(z, z); ctx.translate(-wc[0], -wc[1]);
  // suelo y sombra (el leopardo está de pie)
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(LX(520), SUELO + 4, 400, 20, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(160,140,120,0.35)'; ctx.lineWidth = 3 / z; ctx.beginPath(); ctx.moveTo(-200, SUELO); ctx.lineTo(1280, SUELO); ctx.stroke();
  // patas del otro lado (más oscuras), cuerpo con las manchas de la simulación, vientre más claro
  for (const pt of PATAS) { camino(ctx, pt); ctx.fillStyle = pat; ctx.fill(); ctx.fillStyle = 'rgba(20,10,0,0.45)'; ctx.fill(); }
  camino(ctx, LP); ctx.fillStyle = pat; ctx.fill();
  ctx.save(); camino(ctx, LP); ctx.clip(); const gv = ctx.createLinearGradient(0, LY(225), 0, LY(600)); gv.addColorStop(0, 'rgba(60,30,0,0.15)'); gv.addColorStop(0.45, 'rgba(255,240,215,0)'); gv.addColorStop(0.75, 'rgba(255,240,215,0.3)'); gv.addColorStop(1, 'rgba(30,15,0,0.35)'); ctx.fillStyle = gv; ctx.fillRect(0, LY(100), 1080, 700); ctx.restore();
  camino(ctx, LP); ctx.strokeStyle = 'rgba(30,15,5,0.6)'; ctx.lineWidth = 2.5 / z; ctx.stroke();
  // ojo, nariz y oreja
  ctx.fillStyle = '#1a0e05'; ctx.beginPath(); ctx.ellipse(LX(945), LY(276), 9, 5, -0.15, 0, TAU); ctx.fill(); ctx.fillStyle = '#e8c070'; ctx.beginPath(); ctx.arc(LX(943), LY(275), 2.8, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2a1608'; ctx.beginPath(); ctx.ellipse(LX(981), LY(299), 7, 5, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 2.5 / z; ctx.beginPath(); ctx.moveTo(LX(982), LY(304)); ctx.quadraticCurveTo(LX(976), LY(316), LX(962), LY(318)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(LX(904), LY(216)); ctx.lineTo(LX(892), LY(236)); ctx.lineTo(LX(910), LY(234)); ctx.closePath(); ctx.fill();
  ctx.restore();
  // al principio solo se ve un trozo del lomo (ventana), con luz de estudio; al alejarse, aparece el leopardo entero
  const wa = 1 - sm(0, 0.55, e); if (wa > 0.01) { ctx.save(); ctx.globalAlpha = wa;
   const lx = 540 + 120 * Math.sin(t * 0.21), ly = Y0 + AH * (0.45 + 0.08 * Math.cos(t * 0.17)), g = ctx.createRadialGradient(lx, ly, 60, lx, ly, AW * 0.72); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.6, 'rgba(0,0,0,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0.85)');
   ctx.save(); ctx.beginPath(); ctx.roundRect(X0, Y0, AW, AH, 46); ctx.clip(); ctx.fillStyle = g; ctx.fillRect(X0, Y0, AW, AH); ctx.restore();
   ctx.beginPath(); ctx.rect(0, 0, 1080, 1920); ctx.roundRect(X0, Y0, AW, AH, 46); ctx.fillStyle = '#07070d'; ctx.fill('evenodd'); ctx.restore(); }
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
