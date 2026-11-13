// =====================================================================================================
// FORMATO DE SERIE «¿QUÉ PASA SI…?» (serie_que_pasa_si) · PLANTILLA ASOMBROTECA v1.37
// Se incrusta DESPUÉS de motor/plantilla.js (nuevo_proyecto.py --serie serie_que_pasa_si lo añade solo).
// Añade, sin tocar el motor:
//   P.queHacer(ctx, t, t0, consejos, { x = 540, y = 470, w = 800, t1, titulo = 'QUÉ HACER' })
//        → remate final de la serie (en lugar del sello de mito/verdad): etiqueta amarilla «QUÉ HACER» que cae y golpea en t0
//          y debajo 2-3 consejos que entran uno a uno, cada uno con su ✓ verde. consejos = [{ t, txt }, …] (t = cuándo lo dice la voz).
//          Texto ≥ 46 px, ajustado al ancho (máx. 2 líneas por consejo), dentro de x 140-940. Devuelve el y inferior del panel.
//   FX.queHacer(k, t0, consejos)  → golpe + acorde mayor en t0 y un «tic» alegre por cada consejo.
//   P.serieTitulo(ctx, t, t0, t1, { y })  → rótulo pequeño «¿QUÉ PASA SI…?» (opcional).
// El resto del formato (pregunta fija con P.pregunta, objeto grande en movimiento desde el fotograma 0, promesa en los
// primeros segundos, portada fija) está en LEEME.md y lo comprueba el QC normal (zona segura, encuadre, gancho).
// =====================================================================================================
(function () {
 const PL = window.PLANTILLA; if (!PL) return; const P = PL.P, FX = PL.FX;
 const cl = (v) => Math.max(0, Math.min(1, v)), sm = (a, b, t) => { const u = cl((t - a) / (b - a)); return u * u * (3 - 2 * u); };
 P.SERIE_QUE_PASA_SI = { nombre: '¿QUÉ PASA SI…?' };
 const partir = (ctx, txt, ancho) => { const pal = String(txt).split(/\s+/), L = []; let l = '';
  for (const p of pal) { const q = l ? l + ' ' + p : p; if (ctx.measureText(q).width > ancho && l) { L.push(l); l = p; } else l = q; } if (l) L.push(l); return L; };
 P.queHacer = (ctx, t, t0, consejos, o = {}) => {
  if (t < t0 - 0.35) return 0; if (o.t1 && t > o.t1) return 0;
  const x = o.x ?? 540, y = o.y ?? 470, w = Math.min(o.w ?? 800, 2 * Math.min(x - 140, 940 - x)), titulo = o.titulo || 'QUÉ HACER';
  const a = o.t1 ? 1 - sm(o.t1 - 0.25, o.t1, t) : 1; ctx.save(); ctx.globalAlpha *= a;
  // etiqueta amarilla que cae y golpea en t0
  const u = cl((t - (t0 - 0.35)) / 0.35), dt = Math.max(0, t - t0), yy = y - (1 - u * u) * 500 + (dt > 0 ? Math.sin(dt * 40) * 8 * Math.exp(-dt * 8) : 0);
  ctx.font = '900 76px Nunito'; const tw = Math.min(w, ctx.measureText(titulo).width + 90), th = 112;
  ctx.save(); ctx.globalAlpha *= sm(t0 - 0.35, t0 - 0.25, t); ctx.translate(x, yy); ctx.rotate(-0.03 * (1 - u));
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = '#FFD23F'; ctx.beginPath(); ctx.roundRect(-tw / 2, -th / 2, tw, th, 22); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.fillStyle = '#141414'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(titulo, 0, 5); ctx.restore();
  // consejos
  let py = y + th / 2 + 34; const px = o.px || 54, lh = px * 1.18, R = 34, tx = x - w / 2 + 2 * R + 26, ancho = w - 2 * R - 40;
  const filas = consejos.map((c) => { let f = px; ctx.font = `800 ${f}px Nunito`; let L = partir(ctx, c.txt, ancho); while (L.length > 2 && f > 46) { f -= 2; ctx.font = `800 ${f}px Nunito`; L = partir(ctx, c.txt, ancho); } return { ...c, f, L }; });
  const hTot = filas.reduce((s, r) => s + Math.max(2 * R, r.L.length * r.f * 1.18) + 30, 0);
  const vis = filas.filter((r) => t >= r.t - 0.2).length;
  if (vis) { ctx.save(); ctx.globalAlpha *= sm(filas[0].t - 0.2, filas[0].t + 0.1, t) * 0.82; ctx.fillStyle = '#0d1020'; ctx.beginPath(); ctx.roundRect(x - w / 2, py - 24, w, hTot + 18, 30); ctx.fill(); ctx.restore(); }
  for (const r of filas) { const h = Math.max(2 * R, r.L.length * r.f * 1.18), e = sm(r.t - 0.2, r.t + 0.15, t);
   if (e > 0) { ctx.save(); ctx.globalAlpha *= e; const dx = (1 - e) * 60, cy = py + h / 2;
    const pop = 1 + 0.25 * Math.exp(-Math.max(0, t - r.t) * 9) * (t > r.t ? 1 : 0); ctx.save(); ctx.translate(x - w / 2 + R + 22 + dx, cy); ctx.scale(pop, pop);
    ctx.fillStyle = '#22d27a'; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-14, 1); ctx.lineTo(-4, 12); ctx.lineTo(15, -11); ctx.stroke(); ctx.restore();
    ctx.font = `800 ${r.f}px Nunito`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.lineJoin = 'round'; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    r.L.forEach((l, i) => { const ly = cy + (i - (r.L.length - 1) / 2) * r.f * 1.18; ctx.strokeText(l, tx + dx, ly); ctx.fillText(l, tx + dx, ly); }); ctx.restore(); }
   py += h + 30; }
  ctx.restore();
  if (P.safeLog) P.safeLog('cifra', x - w / 2, y - th / 2, x + w / 2, vis ? py : y + th / 2);   // cuenta para el QC (zona segura y encimados)
  return py;
 };
 FX.queHacer = (k, t0, consejos = []) => { k.play('whoosh', t0 - 0.35, { dur: 0.35, top: 2200, gain: 0.3, minor: true }); k.play('thud', t0, { f: 70, gain: 0.5 }); k.play('stamp', t0 + 0.01, { gain: 0.4 });
  ['C5', 'E5', 'G5'].forEach((n, i) => k.tone(t0 + 0.06 + i * 0.05, { f: n, dur: 1, gain: 0.045, verb: 0.4, a: 0.01 }));
  consejos.forEach((c, i) => { k.play('pop', c.t, { f: 620 + i * 90, gain: 0.35, minor: true }); k.tone(c.t + 0.03, { f: ['E6', 'G6', 'C7'][i % 3], dur: 0.35, gain: 0.04, verb: 0.3, minor: true }); }); };
 P.serieTitulo = (ctx, t, t0, t1, o = {}) => P.tag(ctx, '¿QUÉ PASA SI…?', o.x ?? 540, o.y ?? 640, t, t0, t1, { mono: true, col: '#FFD23F', px: o.px || 40 });
})();
