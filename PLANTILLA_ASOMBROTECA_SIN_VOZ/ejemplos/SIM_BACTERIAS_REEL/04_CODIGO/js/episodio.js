// =====================================================================================================
// episodio.js — «¿En cuántas horas llenan esto?» · FORMATO: REBOTE · Plantilla Asombroteca SIN_VOZ 2.1
// Un bacilo (forma de E. coli) se mueve en una placa de Petri; cuando toca el borde y ya «maduró» (tDiv s desde su última división)
// se estrecha por el medio y se parte en dos hijas que se reparten su área. El reloj avanza 20 min por generación (media real
// de las generaciones de la simulación en cada fotograma). Choques elásticos reales entre bolas (SIM.rebote, precalculado y determinista con H.rng).
// Cada choque suena: borde = madera (tono según la velocidad), bola-bola = tic suave, nacimiento = gota que sube con la cantidad.
// tDiv está ajustado para que el círculo se llene justo antes del final; después todo vuelve a UNA bola (bucle).
// Dato y fuente: FUENTES_Y_DECISIONES.md.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 // bola inicial grande (r0 = 40) que arranca tocando el borde con un «toc»; cada división reparte el área (radio / √2) hasta r = 13
 const C = { cx: 540, cy: 815, R: 420, r: 13, r0: 40 }, V0 = 900, T_COL = 1.2, TDIV = TL.param.tDiv ?? 3.2;
 const S = SIM.rebote({ dur: D, ...C, v0: V0, tDiv: TDIV, age0: TDIV - 0.5, inicio: true, x0: 440, y0: 815, ang0: -0.25, nMax: TL.param.nMax ?? 600, seed: TL.semilla, tColapso: T_COL });
 const tC = D - T_COL, FPS = S.fps;
 // bacilos en tonos verdes y turquesa (vivos), uno distinto por bacteria
 const COL = Array.from({ length: S.nMax }, (_, i) => `hsl(${95 + ((i * 47) % 100)},88%,${54 + (i % 3) * 4}%)`);
 const nacimientos = S.eventos.filter((e) => e.tipo === 'nace').map((e) => e.t);
 const ultimoNac = (t) => { let lo = 0, hi = nacimientos.length; while (lo < hi) { const m = (lo + hi) >> 1; if (nacimientos[m] <= t) lo = m + 1; else hi = m; } return lo ? nacimientos[lo - 1] : -9; };
 const x0 = S.x(0, 0), y0 = S.y(0, 0);
 // divisiones de cada bacteria (como madre) para el estrangulamiento previo y el crecimiento entre divisiones
 const DIV = Array.from({ length: S.nMax }, () => []); for (let j = 0; j < S.nMax; j++) if (S.madre[j] >= 0) DIV[S.madre[j]].push(S.born[j]); DIV.forEach((d) => d.sort((a, b) => a - b));
 const ultimaDiv = (i, t) => { let u = S.born[i]; for (const d of DIV[i]) if (d <= t) u = d; return u; }, proxDiv = (i, t) => { for (const d of DIV[i]) if (d > t) return d; return 1e9; };
 // reloj: 20 minutos por generación, con la generación MEDIA de las bacterias que hay en cada fotograma (coherente con las divisiones)
 const minutos = (f) => { const n = S.n(f); let g = 0; for (let i = 0; i < n; i++) g += S.genF(f, i); return 20 * g / n; };
 const MIN_LLENO = S.tLleno != null ? minutos(Math.round(S.tLleno * FPS) + 1) : null; window.MIN_LLENO = MIN_LLENO;
 // un bacilo: cápsula orientada; «pinch» 0..1 = se estrecha por el medio antes de partirse en dos
 function bacilo(ctx, x, y, ang, L, Wd, col, pinch, a) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col;
  if (pinch > 0.02) { const h = L * 0.5 + Wd * 0.15 * pinch, off = L * 0.25 + Wd * 0.12 * pinch; for (const sg of [-1, 1]) { ctx.beginPath(); ctx.roundRect(sg * off - h / 2, -Wd / 2, h, Wd, Wd / 2); ctx.fill(); } ctx.fillRect(-Wd * 0.2, -Wd * 0.5 * (1 - pinch) * 0.9, Wd * 0.4, Wd * (1 - pinch) * 0.9); }
  else { ctx.beginPath(); ctx.roundRect(-L / 2, -Wd / 2, L, Wd, Wd / 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.roundRect(-L * 0.34, -Wd * 0.32, L * 0.55, Wd * 0.2, Wd * 0.1); ctx.fill(); ctx.restore(); }
 function placa(ctx, lleno) { ctx.save(); const g = ctx.createRadialGradient(C.cx - 120, C.cy - 140, 30, C.cx, C.cy, C.R); g.addColorStop(0, 'rgba(255,200,120,0.10)'); g.addColorStop(1, 'rgba(255,170,90,0.04)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(C.cx, C.cy, C.R + 2, 0, TAU); ctx.fill();
  ctx.strokeStyle = `rgba(220,235,255,${0.30 + 0.45 * lleno})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(C.cx, C.cy, C.R + 3, 0, TAU); ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = 'rgba(200,225,255,0.12)'; ctx.beginPath(); ctx.arc(C.cx, C.cy, C.R + 16, 0, TAU); ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(235,245,255,0.45)'; ctx.beginPath(); ctx.arc(C.cx, C.cy, C.R + 21, 0, TAU); ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(C.cx, C.cy, C.R + 12, -2.55, -1.75); ctx.stroke(); ctx.restore(); }
 function reloj(ctx, t, m) { const x = 132, y = 1332, r = 40; ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.lineWidth = 3; for (let q = 0; q < 12; q++) { const a = q / 12 * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78); ctx.lineTo(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9); ctx.stroke(); }
  const am = m / 60 * TAU - Math.PI / 2, ah = m / 720 * TAU - Math.PI / 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#ffd54a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(am) * r * 0.75, y + Math.sin(am) * r * 0.75); ctx.stroke(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ah) * r * 0.5, y + Math.sin(ah) * r * 0.5); ctx.stroke(); ctx.restore();
  const hh = Math.floor(m / 60), mm = Math.floor(m % 60); R.chico(ctx, (hh ? hh + ' h ' : '') + String(mm).padStart(hh ? 2 : 1, '0') + ' min', x + r + 18, y, { px: 38, fw: 800, align: 'left', kind: 'etiqueta' }); }

 // ---------- 2 · DIBUJO (lee el fotograma precalculado) ----------
 function draw(ctx, t) {
  const f = Math.min(S.NF - 1, Math.round(t * FPS)), n = S.n(f), col = E.inOut(win(t, tC, D - 0.15)), lleno = S.tLleno != null ? sm(S.tLleno, S.tLleno + 0.3, t) * (1 - col) : 0;
  placa(ctx, lleno); if (lleno > 0) P.glow(ctx, C.cx, C.cy, C.R * 1.25, '255,213,74', 0.16 * lleno);
  const fp = Math.max(0, f - 1), fn = Math.min(S.NF - 1, f + 1);
  ctx.save(); ctx.beginPath(); ctx.arc(C.cx, C.cy, C.R + 4, 0, TAU); ctx.clip();
  // estelas muy suaves mientras hay pocas bacterias
  const NB = n < 4 ? 8 : n < 16 ? 4 : 0; for (let back = NB; back >= 1; back--) { const fb = Math.max(0, f - back), nb = S.n(fb), q = 1 - back / (NB + 1); ctx.globalAlpha = 0.28 * q * q * (1 - col); for (let i = 0; i < nb; i++) { ctx.fillStyle = COL[i]; ctx.beginPath(); ctx.arc(S.x(fb, i), S.y(fb, i), S.radio(fb, i) * 0.6 * q, 0, TAU); ctx.fill(); } }
  ctx.globalAlpha = 1;
  // cuello entre madre e hija recién separadas (se estira y se rompe)
  for (let i = 1; i < n; i++) { const m = S.madre[i], u = (t - S.born[i]) / 0.12; if (m < 0 || u < 0 || u > 1 || col > 0) continue; const rr = S.radio(f, i); if (Math.hypot(S.x(f, i) - S.x(f, m), S.y(f, i) - S.y(f, m)) > rr * 3.2) continue; ctx.strokeStyle = COL[m]; ctx.globalAlpha = 0.9 * (1 - u); ctx.lineCap = 'round'; ctx.lineWidth = rr * 1.1 * (1 - u) * 0.7; ctx.beginPath(); ctx.moveTo(S.x(f, i), S.y(f, i)); ctx.lineTo(S.x(f, m), S.y(f, m)); ctx.stroke(); }
  ctx.globalAlpha = 1;
  for (let i = 0; i < n; i++) { let x = S.x(f, i), y = S.y(f, i), rr = S.radio(f, i), a = 1;
   const ix = i < S.n(fp) ? S.x(fp, i) : x, iy = i < S.n(fp) ? S.y(fp, i) : y, jx = S.x(fn, i), jy = S.y(fn, i), ang = Math.atan2(jy - iy, jx - ix);
   const edad = t - ultimaDiv(i, t), crece = cl(edad / TDIV), pr = proxDiv(i, t), pinch = col > 0 ? 0 : cl(1 - (pr - t) / 0.35), nace = E.out(cl((t - S.born[i]) / 0.2));
   let L = rr * 2 * (1.05 + 0.35 * crece + 0.25 * pinch) * (0.7 + 0.3 * nace), Wd = rr * 1.1;
   if (col > 0) { x = lerp(x, x0, col); y = lerp(y, y0, col); if (i > 0) a = 1 - col; else { L = lerp(L, C.r0 * 2.3, col); Wd = lerp(Wd, C.r0 * 1.1, col); } }
   if (rr > 20) P.glow(ctx, x, y, rr * 2.6, '150,255,180', 0.22 * a);
   if (a > 0.01) bacilo(ctx, x, y, ang, L, Wd, COL[i], pinch, a); }
  ctx.restore();
  // reloj (20 min por generación) y contador de bacterias; al final ambos vuelven a cero / a 1
  const mins = minutos(f) * (1 - col); reloj(ctx, t, mins);
  const v = col > 0 ? Math.max(1, Math.round(Math.pow(n, 1 - col))) : n, bump = 1 - cl((t - ultimoNac(t)) / 0.22);
  R.contador(ctx, t, v, { x: 700, y: 1326, px: 110, glow: '150,255,180', bump: col > 0 ? 0 : bump });
  R.pregunta(ctx, t, { y: 300, px: 66 }); R.frase(ctx, t, { y: 300, px: 50, maxLines: 2 });
 }

 // ---------- 3 · SONIDO (de los eventos de la simulación) ----------
 function sound(k) {
  const ev = S.eventos;
  // «toc» fuerte en el fotograma 0 (la bola grande sale del borde)
  const e0 = ev[0]; if (e0 && e0.tipo === 'inicio') { R.asmr(k, [{ t: 0, p: 2, v: 1, pan: 0 }], { voz: 'madera', gain: 1.6 }); k.play('thud', 0, { f: 90, gain: 0.5 }); }
  // borde: más agudo cuanto más rápida y más pequeña es la bola
  R.asmr(k, ev.filter((e) => e.tipo === 'borde' && e.t < tC).map((e) => ({ t: e.t, p: 4 + (e.v / V0) * 7 - ((e.r || 13) - 13) / 5, v: (0.35 + 0.5 * cl(e.v / V0)) * (e.r > 20 ? 1.4 : 1), pan: Math.cos(e.ang) * 0.6 })), { voz: 'madera', maxBin: 2, dens: 45, gain: 0.9 });
  R.asmr(k, ev.filter((e) => e.tipo === 'choque' && e.t < tC).map((e) => ({ t: e.t, p: 9 + cl(e.v / V0) * 8, v: 0.15 + 0.4 * cl(e.v / V0) })), { voz: 'tic', maxBin: 1, dens: 80, gain: 0.6 });
  R.asmr(k, ev.filter((e) => e.tipo === 'nace').map((e) => ({ t: e.t, p: 8 + Math.log2(e.n + 1) * 1.6, v: 0.7 })), { voz: 'gota', maxBin: 1, bin: 1 / 30, dens: 30, gain: 0.8 });
  if (S.tLleno != null) R.asmr(k, [0, 2, 4].map((q) => ({ t: S.tLleno, p: 12 + q, v: 0.8 })), { voz: 'campana', maxBin: 3, gain: 0.9 });
  k.tone(tC, { f: [[0, 520], [1.0, 130]], dur: 1.1, gain: 0.06, a: 0.05, verb: 0.4 }); R.EV.push(tC);
 }

 const EP = R.make({ draw, sound, eventos: () => S.eventos.map((e) => e.t).concat([tC]) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
