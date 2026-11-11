// =====================================================================================================
// episodio.js — «¿Quién guía a esta bandada?» · FORMATO: BANDADA · Plantilla Asombroteca SIN_VOZ 2.4
// Murmuración de estorninos: boids 3D (SIM.boids, Reynolds 1987). Cada pájaro mira a unos pocos vecinos (como los estorninos reales,
// Ballerini 2008) y sigue 3 reglas: separación, alineación y cohesión. La nube se forma sola al llegar desde los bordes, se estira y
// se enrolla. A los 17 s un halcón la atraviesa: los cercanos huyen y la nube se abre en ondas. Al final bajan a dormir a los árboles.
// Cielo de atardecer naranja-rosado con pájaros oscuros (FONDO atardecer en tiempos.txt: el QC mide un cielo claro, no oscuro).
// Sonido: rumor de alas (un grano de ruido por fotograma, más fuerte cuantos más pájaros giran), silbido del halcón y acorde de cierre.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 const TH = TL.param.tHalcon ?? 17, TP = TL.param.tPercha ?? 33;
 const S = SIM.boids({ n: TL.param.n ?? 2400, dur: D + 0.1, seed: TL.semilla, caja: [-60, 60, 15, 90, -40, 40], rv: 4, rs: 2, vMin: 10, vMax: 17, wS: 30, wA: 3, wC: 5, vecinos: 8, wB: 8, margen: 0.3, anillo: [1.3, 2.0],
  halcon: { t0: TH, t1: TH + 5, v: 38, rHuida: 12, wH: 900 }, percha: { t: TP, x: 0, y: -8, z: 0, w: 3 } });
 const N = S.n;

 // ---------- 2 · CÁMARA FIJA (perspectiva) ----------
 const CXw = -16, DC = 170, FOC = 1900, YH = 1180;
 const sx = (x, z) => 540 + (x - CXw) * FOC / (z + DC), sy = (y, z) => YH - y * FOC / (z + DC);
 const RG = H.rng(11), ARB = Array.from({ length: 34 }, (_, i) => ({ x: -20 + i * 34 + RG() * 18, h: 40 + RG() * 90, w: 40 + RG() * 40 }));   // copas de los árboles (silueta)
 const enCielo = new Int32Array(S.NF); for (let f = 0; f < S.NF; f++) { let c = 0; for (let i = 0; i < N; i++) { const o = (f * N + i) * 3, z = S.pos[o + 2], X = sx(S.pos[o], z), Y = sy(S.pos[o + 1], z); if (X > 0 && X < 1080 && Y > 0 && Y < YH - 8) c++; } enCielo[f] = c; }

 // ---------- 3 · DIBUJO ----------
 function draw(ctx, t) {
  const f = Math.min(S.NF - 1, Math.round(t * 30)), fp = Math.max(0, f - 1);
  // cielo de atardecer
  const g = ctx.createLinearGradient(0, 0, 0, YH); g.addColorStop(0, '#3a2d63'); g.addColorStop(0.35, '#b85a86'); g.addColorStop(0.7, '#f08a6a'); g.addColorStop(1, '#ffc27a'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, YH + 4);
  const sol = ctx.createRadialGradient(700, YH - 30, 10, 700, YH - 30, 420); sol.addColorStop(0, 'rgba(255,236,170,0.75)'); sol.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = sol; ctx.fillRect(0, 0, 1080, YH);
  // pájaros: trazo corto oscuro en la dirección de vuelo (más grande cuanto más cerca)
  ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(28,14,30,0.9)';
  for (let i = 0; i < N; i++) { const o = (f * N + i) * 3, q = (fp * N + i) * 3, z = S.pos[o + 2], X = sx(S.pos[o], z), Y = sy(S.pos[o + 1], z); if (Y > YH + 40) continue;
   const k = FOC / (z + DC), dx = X - sx(S.pos[q], S.pos[q + 2]), dy = Y - sy(S.pos[q + 1], S.pos[q + 2]), m = Math.hypot(dx, dy) || 1, L = 0.35 * k;
   ctx.lineWidth = Math.max(1.6, 0.22 * k); ctx.beginPath(); ctx.moveTo(X - dx / m * L, Y - dy / m * L); ctx.lineTo(X + dx / m * L, Y + dy / m * L); ctx.stroke(); }
  // el halcón: silueta más grande con aleteo
  const h = 3 * f; if (!isNaN(S.hal[h])) { const z = S.hal[h + 2], X = sx(S.hal[h], z), Y = sy(S.hal[h + 1], z), k = FOC / (z + DC) * 2.2, a = Math.sin(t * 16) * 0.5;
   ctx.fillStyle = '#140a14'; ctx.beginPath(); ctx.moveTo(X - 2.2 * k, Y - a * k); ctx.quadraticCurveTo(X - 0.8 * k, Y - 0.5 * k, X, Y); ctx.quadraticCurveTo(X + 0.8 * k, Y - 0.5 * k, X + 2.2 * k, Y - a * k); ctx.quadraticCurveTo(X + 0.8 * k, Y + 0.25 * k, X, Y + 0.45 * k); ctx.quadraticCurveTo(X - 0.8 * k, Y + 0.25 * k, X - 2.2 * k, Y - a * k); ctx.fill(); }
  // árboles (la percha) y suelo: silueta oscura sobre la que acaba la bandada
  ctx.fillStyle = '#120a14'; ctx.fillRect(0, YH, 1080, 1920 - YH); ctx.beginPath(); ctx.moveTo(0, YH + 20);
  for (const a of ARB) { ctx.ellipse(a.x, YH + 10, a.w, a.h, 0, Math.PI, 0); } ctx.lineTo(1080, YH + 20); ctx.fill();
  R.contador(ctx, t, enCielo[f], { x: 540, y: 1330, px: 96, glow: '255,150,110' });
  R.chico(ctx, 'pájaros', 540, 1392, { px: 32, col: 'rgba(255,210,180,0.9)', kind: 'unidad' });
  R.pregunta(ctx, t, { y: 300, px: 72 }); R.frase(ctx, t, { y: 300, px: 54 });
 }

 // ---------- 4 · SONIDO ----------
 const EVA = []; for (let f = 1; f < S.NF - 1 && f / 30 < D - 1; f++) { const gi = S.giros[f]; if (gi > 0.04) EVA.push({ t: f / 30, g: Math.min(1, Math.sqrt(gi)) }); }
 const T_PASO = TH + 2.5;
 function sound(k) {
  for (const e of EVA) { k.noise(e.t, { dur: 0.14, color: 'pink', filter: 'bandpass', f: 1400 + 1600 * e.g, q: 0.8, gain: 0.05 * e.g, a: 0.004 }); R.EV.push(e.t); }   // rumor de alas
  k.noise(TH, { dur: 1.2, color: 'pink', filter: 'bandpass', f: [[0, 600], [1.2, 2600]], q: 1.2, gain: 0.12, a: 0.004 }); k.noise(T_PASO, { dur: 1.0, color: 'white', filter: 'bandpass', f: [[0, 3000], [1, 900]], q: 1, gain: 0.1, a: 0.004 });   // halcón
  R.cierre(k);
 }
 const EP = R.make({ draw, sound, eventos: () => EVA.map((e) => e.t).concat([TH, T_PASO, TL.tFrase]), fondo: { c0: '#1a1020' } });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
