// =====================================================================================================
// episodio.js — «¿Qué forma crecerá aquí?» · FORMATO: CRISTAL · Plantilla Asombroteca SIN_VOZ 2.3
// Agregación limitada por difusión (SIM.dla, Witten y Sander 1981): sobre una placa, partículas que caminan al azar se pegan al tocar
// el cúmulo que crece desde un núcleo central. Los primeros 2,5 s se sigue de cerca el zigzag de la primera partícula; luego llegan
// miles (cada una con la estela de sus últimos pasos) y la cámara se aleja para que el cúmulo quepa siempre en la zona segura.
// Color según el orden de llegada. Sonido: una nota de cristal por partícula pegada, más aguda cuanto más lejos del centro.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN Y RELOJ ----------
 const NP = TL.param.n ?? 6000, T1 = TL.param.lento ?? 2.5, A = TL.param.A ?? 4, T_FIN = TL.tFrase - 0.6;
 const S = SIM.dla({ n: NP, seed: TL.semilla, r0: 30, cola: 24 });
 const cuenta = (t) => (t < T1 ? 0 : t >= T_FIN ? NP : 1 + Math.floor((NP - 1) * (Math.exp(A * (t - T1) / (T_FIN - T1)) - 1) / (Math.exp(A) - 1)));
 const tP = (i) => (i === 0 ? T1 : T1 + (T_FIN - T1) * Math.log(1 + i * (Math.exp(A) - 1) / (NP - 1)) / A);   // instante en que se pega la i
 const RF = S.rMax[NP]; window.CRISTAL_INFO = { rMax: RF, camino0: S.camino0.length / 2 };

 // ---------- 2 · CÁMARA: el cúmulo (y la primera partícula) siempre dentro de un círculo de 360 px ----------
 const CX = 540, CY = 820, RV = 360, NF = Math.round(D * 30) + 1, C0 = S.camino0, L0 = C0.length / 2;
 let r0max = 0; for (let q = 0; q < L0; q++) r0max = Math.max(r0max, Math.hypot(C0[2 * q], C0[2 * q + 1]));
 const radioEn = (t) => Math.max(t < T1 + 0.5 ? r0max : 4, S.rMax[Math.min(NP, cuenta(t))] + 3);
 const ZC = []; { let z = null; for (let f = 0; f < NF; f++) { const t = f / 30, zt = RV / radioEn(Math.min(T_FIN, t + 0.8)); z = z === null ? zt : lerp(z, zt, 0.07); z = Math.min(z, RV / radioEn(t)); ZC.push(z); } }
 const zoom = (t) => { const u = cl(t * 30, 0, NF - 1), i = Math.min(NF - 2, Math.floor(u)); return lerp(ZC[i], ZC[i + 1], u - i); };

 // ---------- 3 · DIBUJO ----------
 const HUE = Float32Array.from({ length: NP }, (_, i) => (185 + 175 * Math.pow(i / NP, 0.7)) % 360);
 function draw(ctx, t) {
  const z = zoom(t), n = cuenta(t), fin = sm(D - 2.4, D - 0.9, t), sx = (x) => CX + x * z, sy = (y) => CY + y * z;
  // la placa: fija en pantalla (la cámara es como un microscopio que se aleja dentro de ella)
  ctx.save(); const RPL = RV + 36; const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, RPL); g.addColorStop(0, '#141a34'); g.addColorStop(1, '#0d1124');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(CX, CY, RPL, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(170,190,255,0.28)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.strokeStyle = 'rgba(170,190,255,0.08)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(CX, CY, RPL - 10, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(CX, CY, RPL - 3, 0, TAU); ctx.clip();   // todo ocurre sobre la placa
  // partículas ya pegadas
  const rp = Math.max(1.2, z * 0.62); ctx.globalAlpha = 1 - fin;
  const onda = sm(T_FIN - 1.5, T_FIN + 0.5, t);   // al terminar, una onda de luz recorre las ramas del centro hacia fuera
  for (let i = 0; i < n; i++) { const rec = cl(1 - (t - tP(i)) / 0.5), w = onda * 18 * Math.max(0, Math.sin(TAU * (S.r[i] / RF * 1.6 - (t - T_FIN) * 0.7))); ctx.fillStyle = `hsl(${HUE[i]},95%,${55 + 30 * rec + w}%)`; ctx.fillRect(sx(S.x[i]) - rp, sy(S.y[i]) - rp, 2 * rp, 2 * rp); }
  // la primera partícula: su zigzag completo a cámara lenta (2,5 s), con estela
  if (t < T1 + 0.1) { const q = Math.min(L0 - 1, Math.floor(L0 * cl(t / T1))); ctx.globalAlpha = 1; ctx.lineWidth = Math.max(1.5, z * 0.35); ctx.lineJoin = 'round';
   for (let s = Math.max(1, q - 220); s <= q; s++) { const a = (s - (q - 220)) / 220; ctx.strokeStyle = `rgba(150,235,255,${0.55 * a})`; ctx.beginPath(); ctx.moveTo(sx(C0[2 * s - 2]), sy(C0[2 * s - 1])); ctx.lineTo(sx(C0[2 * s]), sy(C0[2 * s + 1])); ctx.stroke(); }
   if (t < T1) { const X = sx(C0[2 * q]), Y = sy(C0[2 * q + 1]); P.glow(ctx, X, Y, 30, '150,235,255', 0.6); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(X, Y, Math.max(5, z * 0.7), 0, TAU); ctx.fill(); } }
  // las que están llegando: sus últimos pasos al azar (0,3 s antes de pegarse)
  if (t >= T1 && t < T_FIN + 0.3) { ctx.globalAlpha = 1 - fin; ctx.lineWidth = Math.max(1, z * 0.3); let i0 = Math.max(1, n - 1); while (i0 > 1 && tP(i0 - 1) > t - 0.02) i0--;
   for (let i = Math.max(1, n); i < NP && tP(i) < t + 0.3; i++) { const c = S.cola[i], m = c.length / 2; if (m < 2) continue; const u = 1 - (tP(i) - t) / 0.3, q = Math.max(1, Math.floor(u * (m - 1)));
    ctx.strokeStyle = `hsla(${HUE[i]},90%,75%,0.55)`; ctx.beginPath(); ctx.moveTo(sx(c[0]), sy(c[1])); for (let s = 1; s <= q; s++) ctx.lineTo(sx(c[2 * s]), sy(c[2 * s + 1])); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.fillRect(sx(c[2 * q]) - rp, sy(c[2 * q + 1]) - rp, 2 * rp, 2 * rp); } }
  // el núcleo (donde empieza el cristal)
  ctx.globalAlpha = 1; P.glow(ctx, CX, CY, Math.max(14, z * 3), '255,255,255', 0.55); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(CX, CY, Math.max(3.5, z * 0.8), 0, TAU); ctx.fill();
  ctx.restore();
  R.contador(ctx, t, Math.round(n * (1 - sm(D - 1.4, D - 0.75, t))), { x: 540, y: 1300, px: 96, glow: '120,220,255' });
  R.chico(ctx, 'partículas', 540, 1362, { px: 32, col: 'rgba(180,230,255,0.9)', kind: 'unidad' });
  R.pregunta(ctx, t, { y: 300, px: 72 }); R.frase(ctx, t, { y: 300, px: 48 });
 }

 // ---------- 4 · SONIDO: una nota de cristal por partícula que se pega ----------
 const EVP = []; for (let i = 0; i < NP; i++) EVP.push({ t: tP(i), p: 6 + 12 * cl(S.r[i] / RF), v: 0.55, pan: cl(S.x[i] / RF, -1, 1) * 0.7 });
 function sound(k) { R.asmr(k, EVP, { voz: 'cristal', maxBin: 2, bin: 1 / 40, dens: 50, gain: 0.8 }); }
 const EP = R.make({ draw, sound, eventos: () => EVP.map((e) => e.t) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
