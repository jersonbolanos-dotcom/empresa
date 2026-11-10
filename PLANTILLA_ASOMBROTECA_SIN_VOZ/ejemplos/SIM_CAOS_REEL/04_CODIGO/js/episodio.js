// =====================================================================================================
// episodio.js — «¿Seguirán juntos los dos?» · FORMATO: CAOS · Plantilla Asombroteca SIN_VOZ 2.3
// Dos péndulos dobles (SIM.pendulo2: Lagrange + RK4, sin rozamiento) cuelgan del mismo eje, sobre un tablero. Salen casi iguales: el
// segundo brazo del magenta tiene una millonésima de radián más. Se dibujan con mezcla aditiva: mientras coinciden se ven blancos; al
// separarse (~15 s) aparecen el cian y el magenta. Una barrita (escala logarítmica) muestra cómo crece la diferencia. Al final vuelven
// a la posición de salida para empalmar. Sonido: un zumbido por péndulo que sigue la velocidad del brazo de abajo; un golpe suave
// cuando se separan.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;

 // ---------- 1 · SIMULACIÓN ----------
 const TH = TL.param.th0 ?? 1.76, DEL = TL.param.delta ?? 1e-6;
 const S = SIM.pendulo2({ th1: TH, th2: TH, dur: D + 1, delta: DEL, L1: 1, L2: 1 });
 const T_SEP = S.tSep(0.3); window.CAOS_INFO = { tSep: T_SEP, tSep05: S.tSep(0.05) };
 const PIV = { x: 540, y: 800 }, LP = 195, T_R0 = D - 1.9, T_R1 = D - 0.65;   // longitud de cada brazo en px · vuelta a la salida
 const wrap = (a) => a - TAU * Math.round(a / TAU);
 const ang = (Q, t) => { const u = cl(t * 30, 0, S.NF - 1), i = Math.min(S.NF - 2, Math.floor(u)), q = u - i; let a1 = lerp(Q.t1[i], Q.t1[i + 1], q), a2 = lerp(Q.t2[i], Q.t2[i + 1], q);
  const r = E.inOut(cl((t - T_R0) / (T_R1 - T_R0))); if (r > 0) { a1 = TH + wrap(a1 - TH) * (1 - r); a2 = TH + wrap(a2 - TH) * (1 - r); } return [a1, a2]; };
 const pts = (Q, t) => { const [a1, a2] = ang(Q, t), x1 = PIV.x + LP * Math.sin(a1), y1 = PIV.y + LP * Math.cos(a1); return [x1, y1, x1 + LP * Math.sin(a2), y1 + LP * Math.cos(a2)]; };

 // ---------- 2 · DIBUJO ----------
 const COL = { A: '80,230,255', B: '255,80,200' };
 function draw(ctx, t) {
  ctx.save();
  // tablero de fondo con el eje atornillado (los dos péndulos cuelgan de él)
  ctx.fillStyle = '#10142a'; ctx.beginPath(); ctx.roundRect(120, 380, 840, 840, 28); ctx.fill(); ctx.strokeStyle = 'rgba(160,175,230,0.25)'; ctx.lineWidth = 2; ctx.stroke();
  for (const [x, y] of [[150, 410], [930, 410], [150, 1190], [930, 1190]]) { ctx.fillStyle = 'rgba(170,185,230,0.35)'; ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = 'rgba(160,175,230,0.07)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(PIV.x, PIV.y, 2 * LP, 0, TAU); ctx.stroke();
  const fe = 1 - sm(T_R0 - 0.3, T_R0 + 0.6, t);   // las estelas se apagan antes de volver a la salida
  ctx.globalCompositeOperation = 'lighter';
  for (const k of ['A', 'B']) { const Q = S[k], c = COL[k];
   // estela de la bola de abajo (1,2 s)
   ctx.lineWidth = 3; ctx.lineCap = 'round'; let prev = null; for (let q = 36; q >= 0; q--) { const tt = t - q / 30; if (tt < 0) continue; const p = pts(Q, tt); if (prev) { ctx.strokeStyle = `rgba(${c},${0.5 * (1 - q / 37) * fe})`; ctx.beginPath(); ctx.moveTo(prev[2], prev[3]); ctx.lineTo(p[2], p[3]); ctx.stroke(); } prev = p; }
   const [x1, y1, x2, y2] = pts(Q, t);
   ctx.strokeStyle = `rgba(${c},0.75)`; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(PIV.x, PIV.y); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
   ctx.fillStyle = `rgba(${c},0.9)`; ctx.beginPath(); ctx.arc(x1, y1, 15, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x2, y2, 22, 0, TAU); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#dfe6ff'; ctx.beginPath(); ctx.arc(PIV.x, PIV.y, 11, 0, TAU); ctx.fill(); ctx.fillStyle = '#3a4266'; ctx.beginPath(); ctx.arc(PIV.x, PIV.y, 4, 0, TAU); ctx.fill();
  // barrita de la diferencia (escala logarítmica: de una millonésima a todo el péndulo)
  const sp = S.sep(Math.round(cl(t, 0, T_R0) * 30)) * (1 - E.inOut(cl((t - T_R0) / (T_R1 - T_R0)))), fr = cl((Math.log10(Math.max(sp, 1e-7)) + 6.5) / 6.5);
  ctx.fillStyle = 'rgba(160,175,230,0.18)'; ctx.beginPath(); ctx.roundRect(200, 1250, 680, 14, 7); ctx.fill();
  const gb = ctx.createLinearGradient(200, 0, 880, 0); gb.addColorStop(0, '#50e6ff'); gb.addColorStop(1, '#ff50c8'); ctx.fillStyle = gb; ctx.beginPath(); ctx.roundRect(200, 1250, Math.max(14, 680 * fr), 14, 7); ctx.fill();
  ctx.restore();
  R.chico(ctx, '1 millonésima', 200, 1225, { px: 32, col: 'rgba(210,220,255,0.9)', align: 'left', kind: 'etiqueta', alpha: 1 - sm(5, 6.5, t) });
  R.contador(ctx, t, (Math.round(t * 10) / 10).toFixed(1).replace('.', ',') + ' s', { x: 540, y: 1345, px: 96, glow: '200,140,255' });
  R.pregunta(ctx, t, { y: 300, px: 72 }); R.frase(ctx, t, { y: 300, px: 50 });
 }

 // ---------- 3 · SONIDO: un zumbido por péndulo (velocidad del brazo de abajo) y un golpe al separarse ----------
 const w2 = (Q, t) => { const u = cl(t * 30, 0, S.NF - 1); return Math.abs(Q.w2[Math.floor(u)]) * (1 - sm(T_R0, T_R1, t)); };
 const TRZ = 0.5, CH = []; for (let t = 0; t < D - 0.3; t += TRZ) CH.push(t);
 function sound(k) {
  R.zumbido(k, 0, D - 0.3, (t) => 150 + 22 * w2(S.A, t), (t) => 0.35 + 0.65 * cl(w2(S.A, t) / 9), { gain: 0.05, trozo: TRZ });
  R.zumbido(k, 0, D - 0.3, (t) => 225 + 33 * w2(S.B, t), (t) => 0.35 + 0.65 * cl(w2(S.B, t) / 9), { gain: 0.04, trozo: TRZ });
  if (isFinite(T_SEP)) R.asmr(k, [{ t: T_SEP, p: 6, v: 0.9 }], { voz: 'campana', maxBin: 1, gain: 0.7 });
 }
 const EP = R.make({ draw, sound, eventos: () => CH.concat(isFinite(T_SEP) ? [T_SEP] : []) });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION, eventos: EP.eventos, sim: S };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
