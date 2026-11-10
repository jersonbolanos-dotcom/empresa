// =====================================================================================================
// episodio.js — «¿Qué número esconde esta lluvia?» · FORMATO: MONTECARLO · Plantilla Asombroteca SIN_VOZ 2.2
// Llueven gotas al azar (H.rng) sobre un cuadrado con un círculo inscrito. Las que caen dentro se encienden en turquesa y las de fuera en
// rosa. La proporción dentro/total tiende a π/4, así que 4·dentro/total → π: el contador se acerca a 3,14159… gota a gota.
// Al final la lluvia se seca y vuelve el cuadrado vacío (bucle). Sonido: cada gota suena (más aguda dentro que fuera) y un rumor de lluvia.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 const NG = TL.param.gotas ?? 40000, TL_ = TL.param.tLluvia ?? 27, S = SIM.montecarlo({ n: NG, seed: TL.semilla });
 const CX = 540, CY = 820, RAD = 340;                       // cuadrado de 680 px con su círculo inscrito (el contador va debajo, sin taparlo)
 // ritmo de la lluvia: empieza gota a gota y acelera (exponencial); la gota k cae en tk
 const A = 5.2, cuenta = (t) => (t <= 0 ? 0 : t >= TL_ ? NG : Math.floor(NG * (Math.exp(A * t / TL_) - 1) / (Math.exp(A) - 1)));
 const tGota = (k) => TL_ * Math.log(1 + (k + 1) * (Math.exp(A) - 1) / NG) / A;
 const T0 = 0.35;                                           // en el fotograma 0 la primera gota ya va cayendo
 const tk = (k) => tGota(k) + T0, n = (t) => cuenta(t - T0);
 const PI_FIN = S.pi(NG); window.MC_INFO = { PI_FIN, err: Math.abs(PI_FIN - Math.PI) };
 const sx = (k) => CX + S.x[k] * RAD, sy = (k) => CY + S.y[k] * RAD;
 const fmt = (v) => v.toFixed(4).replace('.', ',');

 // ---------- 2 · DIBUJO ----------
 function draw(ctx, t) {
  const k = n(t), seca = sm(D - 2.4, D - 0.9, t);
  ctx.save();
  // cuadrado y círculo
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; ctx.strokeRect(CX - RAD, CY - RAD, 2 * RAD, 2 * RAD);
  ctx.strokeStyle = 'rgba(79,227,255,0.55)'; ctx.beginPath(); ctx.arc(CX, CY, RAD, 0, TAU); ctx.stroke();
  // gotas ya caídas (se secan al final)
  ctx.globalAlpha = 1 - seca; const sz = k < 400 ? 7 : k < 4000 ? 4.5 : 3;
  for (let i = 0; i < k; i++) { ctx.fillStyle = S.dentro[i] ? '#4fe3ff' : '#ff5fb4'; ctx.fillRect(sx(i) - sz / 2, sy(i) - sz / 2, sz, sz); }
  // salpicadura de las gotas recientes (anillo que se abre)
  ctx.lineWidth = 2; for (let i = Math.max(0, k - 40); i < k; i++) { const u = (t - tk(i)) / 0.45; if (u < 0 || u > 1) continue; ctx.strokeStyle = S.dentro[i] ? `rgba(79,227,255,${1 - u})` : `rgba(255,95,180,${1 - u})`; ctx.beginPath(); ctx.arc(sx(i), sy(i), 4 + 22 * E.out(u), 0, TAU); ctx.stroke(); }
  // las primeras gotas caen desde arriba (estela)
  for (let i = k; i < Math.min(NG, k + 6); i++) { const dt = tk(i) - t; if (dt > 0.35 || i > 300) break; const y = sy(i) - dt * 1600; if (y < 470) continue; const g = ctx.createLinearGradient(0, y - 60, 0, y); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0.9)'); ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx(i), y - 60); ctx.lineTo(sx(i), y); ctx.stroke(); }
  ctx.restore();
  // fórmula pequeña con los recuentos reales
  const den = k ? S.acum[k] : 0, a = 1 - seca;
  R.chico(ctx, 'π ≈ 4 · dentro / total', 80, 1340, { px: 34, font: 'IBM Plex Mono', fw: 600, align: 'left', col: '#ffd54a', kind: 'formula', alpha: a });
  R.chico(ctx, `dentro ${P.fmtN(den)} · total ${P.fmtN(k)}`, 80, 1382, { px: 32, font: 'IBM Plex Mono', fw: 600, align: 'left', col: 'rgba(220,225,255,0.8)', kind: 'formula', alpha: a });
  // contador: la estimación (las cifras que ya coinciden con π se encienden)
  const v = k ? S.pi(k) : 0, s = fmt(v), ref = '3,1416'; let ok = 0; while (ok < s.length && s[ok] === ref[ok]) ok++;
  R.contador(ctx, t, k ? s : '?', { x: 540, y: 1252, px: 112, glow: ok >= 4 ? '120,255,170' : '79,227,255' });
  R.pregunta(ctx, t, { y: 300, px: 70 }); R.frase(ctx, t, { y: 300, px: 58 });
 }

 // ---------- 3 · SONIDO: cada gota (las primeras una a una; luego lluvia) ----------
 const EVG = []; for (let i = 0; i < NG; i++) EVG.push({ t: tk(i), p: S.dentro[i] ? 15 + (i % 3) : 9 + (i % 3), v: 0.55, pan: S.x[i] * 0.6 });
 function sound(k) { R.asmr(k, EVG, { voz: 'gota', maxBin: 2, bin: 1 / 40, dens: 70, gain: 0.8 });
  for (let t = 2; t < TL_ + T0; t += 0.25) { const r = n(t + 0.25) - n(t); if (r < 8) continue; k.noise(t, { dur: 0.3, color: 'pink', filter: 'bandpass', f: 3000, q: 0.7, gain: Math.min(0.05, 0.004 * Math.sqrt(r)), a: 0.08 }); R.EV.push(t); } }

 const EP = R.make({ draw, sound, eventos: () => EVG.map((e) => e.t).concat(Array.from({ length: 200 }, (_, q) => 2 + q * 0.25)) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
