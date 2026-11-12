// =====================================================================================================
// FORMATO DE SERIE «¿MITO O VERDAD?» (serie_mito_verdad) · PLANTILLA ASOMBROTECA v1.31
// Se incrusta DESPUÉS de motor/plantilla.js (nuevo_proyecto.py --serie serie_mito_verdad lo añade solo).
// Añade, sin tocar el motor:
//   P.veredicto(ctx, t, t0, tipo, { x = 480, y = 1000, w = 760, t1 })  → sello grande que CAE y golpea: 'MITO' (rojo), 'VERDAD' (verde), 'A MEDIAS' (ámbar).
//                                                     Cae desde arriba con giro, golpe con onda y polvo, queda con temblor que se apaga.
//   FX.veredicto(k, t0, tipo)                       → silbido de caída + golpe grave + sello + acorde según el veredicto.
//   P.serieTitulo(ctx, t, t0, t1, { y })            → rótulo pequeño «¿MITO O VERDAD?» (opcional, p. ej. con la pregunta del capítulo).
// Uso típico (al final del mecanismo, cuando la voz dice «Veredicto: …»):
//   P.veredicto(ctx, t, wt(seg, 'medias.') - 0.35, 'A MEDIAS');   y en sfx:  FX.veredicto(k, wt(seg, 'medias.') - 0.35, 'A MEDIAS');
// =====================================================================================================
(function () {
 const PL = window.PLANTILLA; if (!PL) return; const P = PL.P, FX = PL.FX;
 const cl = (v) => Math.max(0, Math.min(1, v)), sm = (a, b, t) => { const u = cl((t - a) / (b - a)); return u * u * (3 - 2 * u); };
 const COL = { 'MITO': ['#ff3b4e', '255,59,78'], 'VERDAD': ['#22d27a', '34,210,122'], 'A MEDIAS': ['#ffb020', '255,176,32'] };
 P.SERIE_MITO_VERDAD = { nombre: '¿MITO O VERDAD?', veredictos: Object.keys(COL) };
 P.veredicto = (ctx, t, t0, tipo, o = {}) => {
  const [c, rgb] = COL[tipo] || COL['A MEDIAS']; if (t < t0 - 0.45) return; if (o.t1 && t > o.t1) return;
  const x = o.x ?? 480, y = o.y ?? 1000, w = o.w ?? 760, caida = cl((t - (t0 - 0.45)) / 0.45), u = caida * caida;   // cae acelerando y golpea en t0
  const dt = Math.max(0, t - t0), tiembla = dt > 0 ? Math.sin(dt * 55) * 10 * Math.exp(-dt * 7) : 0, rot = -0.12 + (1 - u) * 0.5;
  const sc = dt > 0 ? 1 + 0.08 * Math.exp(-dt * 9) * Math.cos(dt * 30) : 1.35 - 0.35 * u, yy = y - (1 - u) * 900 + tiembla;
  const a = (o.t1 ? 1 - sm(o.t1 - 0.25, o.t1, t) : 1) * sm(t0 - 0.45, t0 - 0.3, t);
  if (dt > 0) { const q = cl(dt / 0.6); ctx.save(); ctx.globalAlpha *= a * (1 - q); ctx.strokeStyle = `rgba(${rgb},0.9)`; ctx.lineWidth = 14 * (1 - q) + 2; ctx.beginPath(); ctx.ellipse(x, y + 40, w * (0.55 + 0.5 * q), 120 * (0.6 + 0.6 * q), 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
   const R = window.H && H.rng ? H.rng(17) : null; if (R) { ctx.save(); for (let k = 0; k < 26; k++) { const ang = R() * Math.PI * 2, d = (80 + R() * 380) * cl(dt / 0.5), s = 5 + R() * 9; ctx.globalAlpha = a * (1 - cl(dt / 0.8)); ctx.fillStyle = `rgba(${rgb},0.85)`; ctx.beginPath(); ctx.arc(x + Math.cos(ang) * d * 1.6, y + 40 + Math.sin(ang) * d * 0.45, s, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); } }
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, yy); ctx.rotate(rot); ctx.scale(sc, sc);
  const h = w * 0.34; ctx.shadowColor = `rgba(${rgb},0.7)`; ctx.shadowBlur = 40; ctx.lineWidth = 22; ctx.strokeStyle = c; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 30); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-w / 2 + 26, -h / 2 + 26, w - 52, h - 52, 18); ctx.stroke();
  let px = h * 0.62; ctx.font = `900 ${px}px Nunito`; while (ctx.measureText(tipo).width > w - 110) { px -= 4; ctx.font = `900 ${px}px Nunito`; }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(tipo, 0, 4);
  // textura de tinta gastada (determinista)
  if (window.H && H.rng) { const R2 = H.rng(9); ctx.globalCompositeOperation = 'destination-out'; for (let k = 0; k < 70; k++) { ctx.globalAlpha = 0.5 * R2(); ctx.beginPath(); ctx.arc((R2() - 0.5) * w, (R2() - 0.5) * h, 2 + R2() * 7, 0, Math.PI * 2); ctx.fill(); } }
  ctx.restore();
  if (P.safeLog) P.safeLog('cifra', x - w / 2, y - h / 2, x + w / 2, y + h / 2);   // cuenta para el QC (zona segura y encimados)
 };
 FX.veredicto = (k, t0, tipo) => { k.play('whoosh', t0 - 0.45, { dur: 0.45, top: 2400, gain: 0.35, minor: true }); k.play('thud', t0, { f: 60, gain: 0.7 }); k.play('stamp', t0 + 0.01, { gain: 0.6 });
  const ac = tipo === 'VERDAD' ? ['C5', 'E5', 'G5'] : tipo === 'MITO' ? ['C4', 'D#4', 'F#4'] : ['C5', 'F5', 'G5']; ac.forEach((n, i) => k.tone(t0 + 0.08 + i * 0.05, { f: n, dur: 1.1, gain: 0.05, verb: 0.4, a: 0.01 })); };
 P.serieTitulo = (ctx, t, t0, t1, o = {}) => P.tag(ctx, '¿MITO O VERDAD?', o.x ?? 540, o.y ?? 640, t, t0, t1, { mono: true, col: '#FFD23F', px: o.px || 40 });
})();
