// =====================================================================================================
// REEL · módulo SIN VOZ de la PLANTILLA ASOMBROTECA (SIN_VOZ v1.0, sobre el motor v1.28)
// ------------------------------------------------------------------------------------------------------
// Se carga DESPUÉS de motor/plantilla.js y de js/tiempos.js. No modifica PLANTILLA, H ni SOUND: solo los usa.
// El reloj ya no es la voz: es 03_GUION/tiempos.txt → js/tiempos.js (window.TIEMPOS), que fija DURATION, los textos
// en pantalla y los efectos de sonido en el fotograma exacto. Todo es función pura de t (H.rng, nunca Math.random).
//
//   const R = window.REEL, TL = R.TL;           TL.dur, TL.lineas[i] = { t0, t1, d, texto, sfx: [...], clave }
//   R.t('clave') / R.L('clave')                instante / línea con esa clave
//   R.make({ beats, marca, marcaY, loop, music, ambience })   → { explainer, scoreSound, scoreMusic, DURATION }
//   R.fondo(ctx, t, o)                         fondo «asombroteca» que se mueve desde el fotograma 0
//   R.texto(ctx, s, t, t0, t1, o)              texto grande animado (pop · golpe · sube · maquina), siempre en zona segura
//   R.titulares(ctx, t, { y, pos: { clave: { y, px, anim } }, skip: [claves] })   pinta los textos de tiempos.txt
//   R.musica(k, D, 'suave' | 'piano' | 'pulso' | 'no')   música original en bucle exacto (compases enteros)
//   Formatos: R.contador · R.quiz + R.cuentaAtras · R.tamanos · R.lineaTiempo · R.capas  (ver INSTRUCCIONES_REEL.md)
// =====================================================================================================
(function () {
 const PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const W = 1080, HH = 1920, TAU = Math.PI * 2;
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
 const sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const SAFE = { top: 220, bottom: 1450, left: 60, right: 940, cx: 500 };   // texto solo dentro (x ≤ 940; centro útil 500)
 const log = (k, x0, y0, x1, y1) => P.safeLog && P.safeLog(k, x0, y0, x1, y1);
 const fmtN = (v) => P.fmtN(v);

 // ---------------- RELOJ: tiempos.txt ----------------
 const RAW = window.TIEMPOS || { duracion: 15, musica: 'suave', lineas: [] };
 const TL = { dur: RAW.duracion, musica: RAW.musica || 'suave', lineas: RAW.lineas.map((l, i) => ({ ...l, i, t1: l.t0 + l.d })) };
 const byKey = {}; TL.lineas.forEach((l) => { if (l.clave) byKey[l.clave] = l; });
 const L = (c) => { const l = typeof c === 'number' ? TL.lineas[c] : byKey[c]; if (!l) throw new Error('tiempos.txt: no existe la clave «' + c + '»'); return l; };
 const R = { TL, L, t: (c) => L(c).t0, t1: (c) => L(c).t1, SAFE, W, HH, TAU, cl, sm, E, lerp, win, fmtN };

 // ---------------- EFECTOS POR NOMBRE (columna «efecto» de tiempos.txt) ----------------
 // Todos empiezan EXACTAMENTE en t (el fotograma de la línea). Lista cerrada: tools/tiempos.py rechaza los demás nombres.
 R.SFX = {
  pop: (k, t) => k.play('pop', t, { f: 640, gain: 0.7 }),
  popAgudo: (k, t) => k.play('pop', t, { f: 900, gain: 0.6 }),
  popGrave: (k, t) => k.play('pop', t, { f: 380, gain: 0.8 }),
  whoosh: (k, t) => k.play('whoosh', t, { dur: 0.42, top: 2400, gain: 0.75 }),
  swish: (k, t) => k.play('swish', t, { dur: 0.22, gain: 0.7 }),
  clic: (k, t) => k.play('click', t, { gain: 0.9 }),
  tic: (k, t) => k.play('tock', t, { f: 1700, gain: 0.5 }),
  sello: (k, t) => k.play('stamp', t, { gain: 0.8 }),
  golpe: (k, t) => k.play('impact', t, { gain: 0.6 }),
  ding: (k, t) => k.play('ding', t, { f: 'E6', gain: 0.6 }),
  correcto: (k, t) => k.play('success', t, { gain: 0.7 }),
  error: (k, t) => k.play('error', t, { gain: 0.6 }),
  revelar: (k, t) => { k.play('impact', t, { gain: 0.45 }); k.play('sparkle', t, { gain: 0.8 }); },
  riser: (k, t) => k.play('riser', t, { dur: 0.7, gain: 0.6 }),
  chispa: (k, t) => k.play('sparkle', t, { gain: 0.9 }),
  teclas: (k, t) => k.play('typing', t, { n: 8, rate: 0.05, gain: 0.8 }),
  moneda: (k, t) => k.play('coin', t, { gain: 0.8 }),
  boing: (k, t) => k.play('jump', t, { gain: 0.8 }),
  latido: (k, t) => FX.latido(k, t, 1, 0.8, 1.2),
  pagina: (k, t) => k.play('paper', t, { dur: 0.3, gain: 0.9 }),
  campana: (k, t) => k.play('bell', t, { f: 'A5', gain: 0.5 }),
 };
 R.sfx = (k) => { for (const l of TL.lineas) for (const s of l.sfx || []) { const f = R.SFX[s]; if (f) f(k, l.t0); else console.error('efecto desconocido: ' + s); } };

 // ---------------- MÚSICA ORIGINAL (MUS.*) EN BUCLE EXACTO ----------------
 // Ajusta el tempo para que quepa un número ENTERO de compases en DURATION: al repetirse el reel, la música sigue en fase.
 R.musica = (k, D, tipo = 'suave', o = {}) => {
  if (!tipo || tipo === 'no') return;
  const fit = (bpm) => { const bar = 240 / bpm, n = Math.max(2, Math.round(D / bar)); return 240 * n / D; };
  const g = o.gain ?? 1;
  if (tipo === 'pulso') MUS.pulso(k, 0, D, { bpm: fit(o.bpm || 96), gain: 0.42 * g, kick: 0.25, arp: 0.45, pad: 0.7, chords: o.chords });
  else MUS.piano(k, 0, D, { bpm: fit(o.bpm || 76), gain: 0.62 * g, strings: 0.55, chords: o.chords || [['A2', 'E3', 'A3', 'C4'], ['F2', 'C3', 'F3', 'A3'], ['C3', 'G3', 'C4', 'E4'], ['G2', 'D3', 'G3', 'B3']] });
 };

 // ---------------- FONDO ----------------
 R.estilo = 'asombroteca';
 R.fondo = (ctx, t, o = {}) => { if (R.estilo !== 'asombroteca') return P.fondo(ctx, t); ctx.save();
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, o.c0 || '#2b2870'); g.addColorStop(0.55, o.c1 || '#1d1b4a'); g.addColorStop(1, o.c2 || '#121029'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const rg = ctx.createRadialGradient(540, o.gy ?? 860, 0, 540, o.gy ?? 860, 950); rg.addColorStop(0, `rgba(${o.glow || '120,110,255'},0.20)`); rg.addColorStop(1, 'rgba(120,110,255,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, HH);
  P.bokeh(ctx, t, { seed: o.seed ?? 21, n: 11, cols: o.cols || ['255,213,74', '140,150,255', '255,255,255'], a: 0.05, rmin: 70, rmax: 230, speed: 0.7 });
  P.motes(ctx, t, { col: '255,236,190', n: 40, a: 0.35, seed: (o.seed ?? 21) + 3, size: 2 });
  ctx.restore(); };

 // ---------------- TEXTO EN PANTALLA ----------------
 // s: texto corto (≤ 8 palabras). «*palabra*» = amarillo; « / » = salto de línea. o = { x, y, px, anim: 'pop'|'golpe'|'sube'|'maquina',
 // col, hi, maxW, font, stroke, fadeOut (true) }. Se encoge y se recoloca solo para quedar dentro de 220 ≤ y ≤ 1450, 60 ≤ x ≤ 940.
 const parse = (s) => { const out = []; let hi = false; for (const raw of s.split(/\s+/).filter(Boolean)) { if (raw === '/') { out.push({ br: true }); continue; } let h = hi, any = hi; for (const ch of raw) if (ch === '*') { h = !h; if (h) any = true; } const w = raw.replace(/\*/g, ''); if (w) out.push({ w, hi: any }); hi = h; } return out; };
 R.palabras = (s) => parse(s || '').filter((x) => !x.br && /[\p{L}\p{N}]/u.test(x.w)).length;
 R.texto = (ctx, s, t, t0, t1, o = {}) => {
  if (!s || t < t0 - 1e-6 || (t1 != null && t > t1 + 1e-6)) return null;
  const intro = t0 <= 1e-6 ? 1 : 0;          // la línea del fotograma 0 ya está en pantalla (gancho y bucle)
  const out = t1 != null && o.fadeOut !== false ? 1 - sm(t1 - 0.18, t1, t) : 1; if (out <= 0) return null;
  const anim = o.anim || 'pop', font = o.font || 'Fredoka', fw = o.fw || 700, maxW = Math.min(o.maxW || 840, SAFE.right - SAFE.left);
  const toks = parse(s); let px = o.px || 82; const lines = [];
  ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  const layout = () => { lines.length = 0; ctx.font = `${fw} ${px}px "${font}"`; const sp = ctx.measureText(' ').width; let cur = [], cw = 0;
   for (const tk of toks) { if (tk.br) { if (cur.length) lines.push({ ws: cur, w: cw }); cur = []; cw = 0; continue; } const ww = ctx.measureText(tk.w).width; if (cur.length && cw + sp + ww > maxW) { lines.push({ ws: cur, w: cw }); cur = []; cw = 0; } cur.push({ ...tk, ww }); cw += (cur.length > 1 ? sp : 0) + ww; }
   if (cur.length) lines.push({ ws: cur, w: cw }); return sp; };
  let sp = layout(); while ((Math.max(...lines.map((l) => l.w)) > maxW || lines.length > (o.maxLines || 3)) && px > 40) { px -= 4; sp = layout(); }
  const lh = px * 1.12, bw = Math.max(...lines.map((l) => l.w)), bh = lines.length * lh;
  let x = o.x ?? SAFE.cx, y = o.y ?? 400;
  x = cl(x, SAFE.left + bw / 2, SAFE.right - bw / 2); y = cl(y, SAFE.top + bh / 2 + 6, SAFE.bottom - bh / 2 - 6);
  const top = y - bh / 2; log('texto', x - bw / 2, top, x + bw / 2, top + bh);
  // animación
  const u = intro ? 1 : win(t, t0, t0 + (anim === 'golpe' ? 0.16 : 0.34));
  let sc = 1, dy = 0, alpha = out, nChars = Infinity, shake = 0;
  if (anim === 'golpe') { sc = intro ? 1 : lerp(1.7, 1, E.in(u)); alpha *= intro ? 1 : cl(u * 4); shake = intro ? 0 : Math.sin((t - t0) * 70) * 7 * (1 - cl((t - t0 - 0.16) / 0.22)) * (u >= 1 ? 1 : 0); }
  else if (anim === 'sube') { dy = (1 - E.out(u)) * 70; alpha *= E.out(u); }
  else if (anim === 'maquina') { const len = toks.reduce((a, b) => a + (b.w ? b.w.length + 1 : 0), 0); nChars = intro ? Infinity : Math.floor(win(t, t0, t0 + Math.min(1.0, len * 0.035)) * len + 0.001); }
  if (intro && o.respira !== false) sc *= 1 + 0.045 * Math.sin(t * 4.2);   // la línea del fotograma 0 «respira»: movimiento desde el primer fotograma
  ctx.globalAlpha *= alpha; ctx.translate(x + shake, y + dy); ctx.scale(sc, sc); ctx.translate(-x, -y);
  ctx.lineJoin = 'round'; ctx.font = `${fw} ${px}px "${font}"`; let wi = 0, ci = 0;
  lines.forEach((ln, li) => { let xx = x - ln.w / 2; const yy = top + li * lh + px * 0.86;
   for (const w of ln.ws) { let txt = w.w; if (ci >= nChars) break; if (ci + txt.length > nChars) txt = txt.slice(0, nChars - ci); ci += w.w.length + 1;
    const wu = anim === 'pop' && !intro ? E.out(win(t, t0 + wi * 0.055, t0 + wi * 0.055 + 0.3)) : 1, ws = anim === 'pop' && !intro ? lerp(0.35, 1, wu) + 0.12 * Math.sin(Math.PI * wu) : 1;
    if (wu > 0.001) { ctx.save(); const cx = xx + w.ww / 2, cy = yy - px * 0.32; ctx.translate(cx, cy); ctx.scale(ws, ws); ctx.translate(-cx, -cy); ctx.globalAlpha *= cl(wu * 3);
     ctx.strokeStyle = o.stroke || 'rgba(14,11,40,0.92)'; ctx.lineWidth = px * 0.16; ctx.strokeText(txt, xx, yy);
     ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = px * 0.25; ctx.shadowOffsetY = px * 0.05; ctx.fillStyle = w.hi ? (o.hi || '#ffd54a') : (o.col || '#ffffff'); ctx.fillText(txt, xx, yy); ctx.restore(); }
    xx += w.ww + sp; wi++; } });
  ctx.restore(); return { x0: x - bw / 2, y0: top, x1: x + bw / 2, y1: top + bh, px };
 };
 // Pinta todas las líneas de tiempos.txt que tienen texto. o = { y (400), px, anim, pos: { clave: { y, px, anim, x } }, skip: [claves] }
 R.titulares = (ctx, t, o = {}) => { for (const l of TL.lineas) { if (!l.texto || (o.skip && o.skip.includes(l.clave))) continue; if (t < l.t0 - 1e-6 || t > l.t1 + 1e-6) continue;
  const q = { y: o.y ?? 400, px: o.px, anim: o.anim || l.anim, ...(o.pos && l.clave && o.pos[l.clave] || {}) }; R.texto(ctx, l.texto, t, l.t0, l.t1, q); } };

 // ---------------- MONTAJE ----------------
 // Usa PLANTILLA.make sin voz (sin subtítulos ni pausas), con zona segura, añade los efectos de tiempos.txt, la música en bucle,
 // la marca discreta al final y el ENLACE DEL BUCLE: los últimos `loop` s funden con el fotograma 0.
 R.make = (cfg) => {
  const D = cfg.duration ?? TL.dur, LOOP = cfg.loop ?? 0.5; R.estilo = cfg.estilo || 'asombroteca';
  const beats = cfg.beats.map((b) => ({ ...b }));
  if (cfg.marca !== false) { const last = beats[beats.length - 1], d0 = last.draw, mt = D - (cfg.marcaAntes ?? 2.0); last.draw = (ctx, t, api) => { d0(ctx, t, api); P.marca(ctx, t, mt, { y: cfg.marcaY ?? 1385 }); }; }
  const EP = PL.make({ estilo: cfg.estilo || 'asombroteca', marca: { nombre: cfg.marca || 'ASOMBROTECA' }, align: { phrases: [], words: [], segments: [] }, duration: D, beats, pausas: false, zonaSegura: true, keywords: [],
   ambience: cfg.ambience, music: (k, api) => (cfg.music ? cfg.music(k, api) : R.musica(k, D, TL.musica)) });
  let LY = null;
  const explainer = (ctx, Wd, Hd, t) => {
   EP.explainer(ctx, Wd, Hd, t);
   if (LOOP > 0 && t > D - LOOP) { if (!LY) LY = H.layer(W, HH); const c = LY.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.clearRect(0, 0, W, HH);
    const keep = P.SAFE.on; EP.explainer(c, Wd, Hd, 0); P.SAFE.on = keep; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = E.inOut(win(t, D - LOOP, D)); ctx.drawImage(LY, 0, 0); ctx.restore(); }
  };
  const scoreSound = (k) => { EP.scoreSound(k); if (cfg.sfxTiempos !== false) R.sfx(k); };
  return { explainer, scoreSound, scoreMusic: EP.scoreMusic, DURATION: D };
 };

 // =====================================================================================================
 // FORMATOS
 // =====================================================================================================

 // ---- 1 · CONTADOR IMPOSIBLE ----
 // R.contador(ctx, t, { valor, x, y, px (150), etiqueta, sufijo, prefijo, bump (0..1, salto reciente), col, maxW })
 // R.saltos(t, tiempos) → índice del último salto ya ocurrido (−1 antes del primero) y u (0..1 desde ese salto)
 // R.contadorSfx(k, tiempos, { gain, f }) → un clic en cada salto (+ «tock» grave cada 5)
 R.saltos = (t, ts) => { let i = -1; while (i + 1 < ts.length && t >= ts[i + 1] - 1e-6) i++; return { i, u: i < 0 ? 0 : cl((t - ts[i]) / 0.25) }; };
 R.contador = (ctx, t, o = {}) => { const s = (o.prefijo || '') + (typeof o.valor === 'number' ? fmtN(o.valor) : String(o.valor)) + (o.sufijo || '');
  let px = o.px || 150; ctx.save(); const f = () => (ctx.font = `900 ${px}px "Nunito"`); f(); const maxW = o.maxW || 840; while (ctx.measureText(s).width > maxW && px > 40) { px -= 4; f(); }
  const tw = ctx.measureText(s).width, x = cl(o.x ?? SAFE.cx, SAFE.left + tw / 2, SAFE.right - tw / 2), y = cl(o.y ?? 960, SAFE.top + px * 0.7, SAFE.bottom - px * 0.7 - (o.etiqueta ? 60 : 0));
  const b = o.bump ?? 0, sc = 1 + 0.09 * Math.sin(Math.PI * b) * (1 - b);
  P.glow(ctx, x, y, px * 2.2, '255,213,74', 0.10 + 0.12 * Math.sin(Math.PI * b));
  ctx.translate(x, y); ctx.scale(sc, sc); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(14,11,40,0.92)'; ctx.lineWidth = px * 0.14; ctx.strokeText(s, 0, 0);
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = px * 0.2; ctx.fillStyle = o.col || '#ffd54a'; ctx.fillText(s, 0, 0); ctx.restore();
  log('cifra', x - tw / 2, y - px * 0.6, x + tw / 2, y + px * 0.6);
  if (o.etiqueta) R.texto(ctx, o.etiqueta, t, -1, null, { x, y: y + px * 0.62 + 34, px: o.etiquetaPx || 40, font: 'Nunito', fw: 800, col: '#dfe3ff', fadeOut: false });
  return { x, y, px, w: tw }; };
 R.contadorSfx = (k, ts, o = {}) => ts.forEach((t, i) => { k.play('click', t, { f: o.f || 1900 + (i % 4) * 120, gain: o.gain ?? 0.85 }); if (i % 5 === 4) k.play('tock', t, { f: 620, gain: 0.25, minor: true }); });

 // ---- 2 · ADIVINA ANTES DE QUE ACABE ----
 // R.quiz(ctx, t, { opciones: ['…', '…', '…'], correcta: i, t0 (aparece la 1.ª), paso (0.3), tRevela, x, y0 (700), gap (180), w (800), h (140), px (58) })
 // R.quizSfx(k, o) → pop por opción (el sonido de la revelación va en tiempos.txt: «correcto»)
 // R.cuentaAtras(ctx, t, { t0, n (5), x, y, r }) + R.cuentaAtrasSfx(k, { t0, n }) → tictac cada segundo
 R.quiz = (ctx, t, o) => { const ops = o.opciones, n = ops.length, w = o.w || 800, h = o.h || 140, gap = o.gap || 180, x = o.x ?? SAFE.cx, y0 = o.y0 ?? 700, paso = o.paso ?? 0.3, rev = o.tRevela ?? 1e9, letras = o.letras || ['A', 'B', 'C', 'D'];
  const out = []; ctx.save();
  for (let i = 0; i < n; i++) { const ta = o.t0 + i * paso, a = o.t0 <= 1e-6 ? 1 : E.out(win(t, ta, ta + 0.3)); if (t < ta && o.t0 > 1e-6) { out.push(null); continue; }
   const y = y0 + i * gap, ok = i === o.correcta, ur = win(t, rev, rev + 0.35), sc = (o.t0 <= 1e-6 ? 1 : lerp(0.6, 1, a) + 0.08 * Math.sin(Math.PI * a)) * (ok ? 1 + 0.07 * Math.sin(Math.PI * ur) + 0.03 * ur : 1);
   const dim = ok ? 1 : 1 - 0.55 * ur, xx = cl(x, SAFE.left + w / 2, SAFE.right - w / 2);
   ctx.save(); ctx.globalAlpha *= cl(a * 2) * dim; ctx.translate(xx, y); ctx.scale(sc, sc);
   ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
   ctx.fillStyle = ok && ur > 0 ? `rgba(47,191,113,${0.25 + 0.7 * ur})` : 'rgba(255,255,255,0.10)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h * 0.32); ctx.fill(); ctx.shadowColor = 'transparent';
   ctx.lineWidth = 4; ctx.strokeStyle = ok && ur > 0 ? '#7cf0ae' : 'rgba(255,255,255,0.45)'; ctx.stroke();
   // círculo con la letra
   const cx = -w / 2 + h * 0.55; ctx.fillStyle = ok && ur > 0 ? '#2fbf71' : '#f0b90b'; ctx.beginPath(); ctx.arc(cx, 0, h * 0.32, 0, TAU); ctx.fill();
   ctx.fillStyle = '#1d1b3a'; ctx.font = `900 ${h * 0.36}px "Nunito"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(letras[i], cx, 2);
   let px = o.px || 58; ctx.font = `800 ${px}px "Nunito"`; while (ctx.measureText(ops[i]).width > w - h * 1.6 && px > 34) { px -= 2; ctx.font = `800 ${px}px "Nunito"`; }
   ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText(ops[i], cx + h * 0.55, 3);
   if (ur > 0) { ctx.translate(w / 2 - h * 0.5, 0); ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.strokeStyle = ok ? '#ffffff' : 'rgba(232,80,91,0.9)'; ctx.beginPath(); const e = E.out(ur);
    if (ok) { ctx.moveTo(-22, 0); ctx.lineTo(-22 + 16 * Math.min(1, e * 2), 16 * Math.min(1, e * 2)); if (e > 0.5) ctx.lineTo(-6 + 34 * (e - 0.5) * 2, 16 - 40 * (e - 0.5) * 2); }
    else { const q = 18 * e; ctx.moveTo(-q, -q); ctx.lineTo(q, q); ctx.moveTo(q, -q); ctx.lineTo(-q, q); } ctx.stroke(); }
   ctx.restore(); log('texto', xx - w / 2, y - h / 2, xx + w / 2, y + h / 2); out.push({ x: xx, y, w, h }); }
  ctx.restore(); return out; };
 R.quizSfx = (k, o) => o.opciones.forEach((_, i) => k.play('pop', o.t0 + i * (o.paso ?? 0.3), { f: 560 + i * 140, gain: 0.7 }));
 R.cuentaAtras = (ctx, t, o) => { const n = o.n || 5, t0 = o.t0, x = o.x ?? SAFE.cx, y = o.y ?? 1290, r = o.r || 92; if (t < t0 - 0.3 || t > t0 + n + 0.35) return;
  const a = sm(t0 - 0.3, t0, t) * (1 - sm(t0 + n, t0 + n + 0.35, t)), k = cl(Math.floor(t - t0), 0, n - 1), num = n - k, u = (t - t0) - Math.floor(t - t0), rest = cl(1 - (t - t0) / n);
  const hot = num <= 2, c = hot ? '#e8505b' : '#ffd54a'; ctx.save(); ctx.globalAlpha *= a;
  ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * rest); ctx.stroke();
  P.glow(ctx, x, y, r * 2, hot ? '232,80,91' : '255,213,74', 0.18 * (1 - u));
  const s = t >= t0 ? 1 + 0.25 * (1 - E.out(cl(u / 0.25))) : 1; ctx.translate(x, y); ctx.scale(s, s); ctx.font = `900 ${r * 1.15}px "Nunito"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff'; ctx.fillText(String(t < t0 ? n : num), 0, 4);
  ctx.restore(); log('cifra', x - r * 0.6, y - r * 0.65, x + r * 0.6, y + r * 0.65); };
 R.cuentaAtrasSfx = (k, o) => { const n = o.n || 5; for (let i = 0; i < n; i++) k.play('tock', o.t0 + i, { f: n - i <= 2 ? 1300 : (i % 2 ? 1500 : 1900), gain: n - i <= 2 ? 0.75 : 0.55 }); };

 // ---- 3 · COMPARACIÓN DE TAMAÑOS ----
 // Barras que crecen una a una desde una línea base (suelo → 'arriba', superficie del mar → 'abajo'), con su valor y un icono.
 // R.tamanos(ctx, t, { items: [{ v, valor, t0, d (0.8), col, icon(ctx, x, yEnd, w, u) }], x0 (80), x1 (920), base (y), esc (px por unidad),
 //   dir: 'abajo'|'arriba', ancho (0.56 del hueco), px (38) }) → [{ x, yEnd, w, u }]
 // R.tamanosSfx(k, o) → pop al empezar a crecer cada barra y «tock» suave al llegar
 R.tamanos = (ctx, t, o) => { const it = o.items, n = it.length, x0 = o.x0 ?? 80, x1 = o.x1 ?? 920, slot = (x1 - x0) / n, dn = (o.dir || 'abajo') === 'abajo' ? 1 : -1, out = [];
  it.forEach((b, i) => { const u = E.out(win(t, b.t0, b.t0 + (b.d ?? 0.8))), x = b.x ?? x0 + (i + 0.5) * slot, w = slot * (o.ancho ?? 0.56), len = b.v * o.esc * u, yE = o.base + dn * len;
   if (t < b.t0) { out.push({ x, yEnd: o.base, w, u: 0 }); return; }
   ctx.save(); const g = ctx.createLinearGradient(0, o.base, 0, yE || o.base + 1); const c = b.col || '#ffd54a'; g.addColorStop(0, c); g.addColorStop(1, b.col2 || 'rgba(255,213,74,0.55)');
   ctx.fillStyle = g; ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 16; ctx.beginPath(); const yy = Math.min(o.base, yE), hh = Math.max(3, Math.abs(yE - o.base)); ctx.roundRect(x - w / 2, yy, w, hh, Math.min(10, hh / 2)); ctx.fill(); ctx.shadowColor = 'transparent';
   ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2; ctx.stroke();
   // regla: marcas cada 10 % del máximo
   ctx.strokeStyle = 'rgba(29,27,58,0.35)'; ctx.lineWidth = 2; for (let m = o.mark || 1000; m < b.v * u; m += o.mark || 1000) { const ym = o.base + dn * m * o.esc; ctx.beginPath(); ctx.moveTo(x - w / 2 + 4, ym); ctx.lineTo(x - w / 2 + w * 0.35, ym); ctx.stroke(); }
   if (b.icon) b.icon(ctx, x, yE, w, u);
   // valor
   const vs = b.valor ?? fmtN(b.v * u); const px = o.px || 38; ctx.font = `900 ${px}px "Nunito"`; const tw = ctx.measureText(vs).width; let ly = yE + dn * (px * 0.9 + (b.labelDy || 0)), lx = cl(x, SAFE.left + tw / 2, SAFE.right - tw / 2);
   if (ly + px * 0.6 > SAFE.bottom - 4 || ly - px * 0.6 < SAFE.top + 4) { ly = cl(ly, SAFE.top + px, SAFE.bottom - px); lx = cl(x + w / 2 + tw / 2 + 12, SAFE.left + tw / 2, SAFE.right - tw / 2); }
   const la = cl((u - 0.15) * 3); if (la > 0) { ctx.globalAlpha *= la; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(14,11,40,0.9)'; ctx.lineWidth = px * 0.18; ctx.strokeText(vs, lx, ly); ctx.fillStyle = '#ffffff'; ctx.fillText(vs, lx, ly); log('cifra', lx - tw / 2, ly - px * 0.6, lx + tw / 2, ly + px * 0.6); }
   ctx.restore(); out.push({ x, yEnd: yE, w, u }); });
  return out; };
 R.tamanosSfx = (k, o) => o.items.forEach((b, i) => { k.play('pop', b.t0, { f: 520 + i * 90, gain: 0.75 }); k.play('tock', b.t0 + (b.d ?? 0.8) * 0.85, { f: 380 + i * 40, gain: 0.3, minor: true }); });

 // ---- 4 · LÍNEA DEL TIEMPO (dossier) ----
 // Fichas P.dossier clavadas con chincheta en un tablero, una por fecha, unidas por una línea vertical; P.stamp golpea el año.
 // La cámara baja suavemente hasta la ficha activa. R.lineaTiempo(ctx, t, { items: [{ anio, titulo, img (canvas o imagen), t0 }],
 //   x (línea, 150), cx (fichas, 560), w (ficha, 440), gap (760), yFoco (820), tFin (vuelve arriba), incognita (fichas «?» antes de cada fecha; true) })
 // Sonido: «sello» en la columna efecto de tiempos.txt en el instante de cada año (t0) y R.lineaTiempoSfx(k, o) para la entrada de cada ficha.
 R.lineaTiempo = (ctx, t, o) => { const it = o.items, gap = o.gap || 760, w = o.w || 440, lx = o.x ?? 150, cx = o.cx ?? 560, yF = o.yFoco ?? 820, h = w * 1.22;
  // cámara: en cada t0 se centra la ficha i (y = i*gap); vuelve a la primera en tFin
  let cam = 0; it.forEach((b, i) => { if (i) cam = lerp(cam, i * gap, E.inOut(win(t, b.t0 - 0.75, b.t0 - 0.1))); }); if (o.tFin != null) cam = lerp(cam, 0, E.inOut(win(t, o.tFin, o.tFin + (o.dFin ?? 1.2))));
  const Y = (i) => yF + i * gap - cam;
  ctx.save();
  // línea con avance
  const yTop = Y(0) - 400, yBot = Y(it.length - 1) + 400; ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(lx, yTop); ctx.lineTo(lx, yBot); ctx.stroke();
  let prog = Y(0); it.forEach((b, i) => { if (t >= b.t0 - 0.2) prog = Math.max(prog, lerp(Y(Math.max(0, i - 1)), Y(i), E.out(win(t, b.t0 - 0.6, b.t0)))); });
  ctx.strokeStyle = '#ffd54a'; ctx.beginPath(); ctx.moveTo(lx, yTop); ctx.lineTo(lx, prog); ctx.stroke();
  it.forEach((b, i) => { const y = Y(i); if (y < -h || y > HH + h) return; const on = b.t0 <= 1e-6 ? 1 : E.out(win(t, b.t0 - 0.45, b.t0 - 0.05));
   // nodo
   ctx.fillStyle = t >= b.t0 ? '#ffd54a' : 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(lx, y, 20, 0, TAU); ctx.fill(); if (t >= b.t0) P.glow(ctx, lx, y, 90, '255,213,74', 0.35 * (1 - cl((t - b.t0) / 0.8)) + 0.08);
   if (o.incognita !== false && on < 1) { ctx.save(); ctx.globalAlpha *= 1 - on; P.dossier(ctx, null, cx, y + Math.sin(t * 2 + i) * 4, w, t, { unknown: true }); ctx.restore(); }
   if (on <= 0) return;
   ctx.strokeStyle = 'rgba(255,213,74,0.55)'; ctx.lineWidth = 4; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(lx + 22, y); ctx.lineTo(lx + 22 + (cx - w / 2 - lx - 22) * on, y); ctx.stroke(); ctx.setLineDash([]);
   // la ficha se desvanece antes de que su rótulo salga de la zona segura (cámara que sube o baja) y entra con un deslizamiento corto
   const ly0 = y + h * 0.28, ly1 = y + h * 0.44, fz = cl((ly0 - SAFE.top) / 70) * cl((SAFE.bottom - ly1) / 70), al = on * fz;
   const rot = (i % 2 ? 0.035 : -0.04), xs = cx + (1 - on) * 150; if (al <= 0.003) return;
   ctx.save(); ctx.globalAlpha *= al;
   P.dossier(ctx, b.img || null, xs, y, w, t, { name: b.titulo, rot, tape: false });
   P.stamp(ctx, String(b.anio), xs + w * 0.04, y - h * 0.1, w * 0.78, t, b.t0 <= 1e-6 ? -1 : b.t0, { col: b.col || '#e8283c', rot: rot - 0.16 });
   // chincheta que sujeta la ficha al tablero
   const px = xs + Math.sin(rot) * h * 0.47, py = y - Math.cos(rot) * h * 0.47; ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(px + 6, py + 8, 16, 9, 0, 0, TAU); ctx.fill();
   const pg = ctx.createRadialGradient(px - 5, py - 6, 2, px, py, 18); pg.addColorStop(0, '#ff8a8a'); pg.addColorStop(1, '#b3202e'); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 17, 0, TAU); ctx.fill();
   ctx.restore();
   if (al >= 0.15) log('texto', xs - w * 0.42, ly0, xs + w * 0.42, ly1); });
  ctx.restore(); return { cam, Y }; };
 R.lineaTiempoSfx = (k, o) => o.items.forEach((b) => { if (b.t0 > 0.3) k.play('swish', b.t0 - 0.45, { dur: 0.3, gain: 0.45, minor: true }); });
 // Ilustración para una ficha: dibuja fn(ctx, s) en un lienzo cuadrado (se usa como «foto» de P.dossier, en grises)
 R.lamina = (fn, s = 400, bg = '#c9c4b8') => { const c = H.layer(s, s), x = c.getContext('2d'); x.fillStyle = bg; x.fillRect(0, 0, s, s); const g = x.createRadialGradient(s / 2, s * 0.4, 0, s / 2, s / 2, s * 0.75); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0.25)'); x.fillStyle = g; x.fillRect(0, 0, s, s); fn(x, s); return c; };

 // ---- 5 · QUÉ HAY POR DENTRO (capas que se separan) ----
 // Pila de placas en perspectiva (vista 3/4) apoyada en una base sobre una mesa. Las placas suben guiadas por 4 varillas que nacen
 // de la base: nada flota. R.capas(ctx, t, { x, y (centro de la base), W (260), Lz (540), capas: [{ nombre, kind, grosor, col }] (de arriba
 //   abajo; la última es la base fija), cortes: [t0…] (corte i: suben las placas 0..i), gap (90), d (0.6), tJunta, dJunta (1.2), activa (índice
 //   resaltado), yaw (rad), tilt (0.5), pantalla (0..1 brillo del fondo de pantalla) }) → { top: [[x,y]…] de cada placa }
 // kinds: 'vidrio' | 'tactil' | 'polarizador' | 'oled' | 'tft' | 'base' | 'color'.  Sonido: «whoosh» en cada corte (tiempos.txt) y R.capasSfx(k, o)
 const TEX = {};
 const tex = (kind, Wp, Lp) => { const key = kind + Wp + 'x' + Lp; if (TEX[key]) return TEX[key]; const c = H.layer(Wp, Lp), x = c.getContext('2d'), R0 = H.rng(kind.length * 31 + 7);
  if (kind === 'oled') { x.fillStyle = '#07070c'; x.fillRect(0, 0, Wp, Lp); const s = 9; for (let yy = 0; yy < Lp; yy += s) for (let xx = 0; xx < Wp; xx += s) { x.fillStyle = 'rgba(255,60,70,0.55)'; x.fillRect(xx + 1, yy + 1, 2, s - 3); x.fillStyle = 'rgba(60,255,120,0.55)'; x.fillRect(xx + 4, yy + 1, 2, s - 3); x.fillStyle = 'rgba(70,120,255,0.6)'; x.fillRect(xx + 7, yy + 1, 1.6, s - 3); } }
  else if (kind === 'tft') { x.fillStyle = '#3a3a2a'; x.fillRect(0, 0, Wp, Lp); x.strokeStyle = 'rgba(230,200,120,0.55)'; x.lineWidth = 1; const s = 9; x.beginPath(); for (let yy = 0; yy <= Lp; yy += s) { x.moveTo(0, yy); x.lineTo(Wp, yy); } for (let xx = 0; xx <= Wp; xx += s) { x.moveTo(xx, 0); x.lineTo(xx, Lp); } x.stroke(); x.fillStyle = 'rgba(255,220,140,0.8)'; for (let yy = 0; yy < Lp; yy += s) for (let xx = 0; xx < Wp; xx += s) x.fillRect(xx + 1.5, yy + 1.5, 2.5, 2.5); }
  else if (kind === 'tactil') { x.clearRect(0, 0, Wp, Lp); x.fillStyle = 'rgba(120,230,255,0.10)'; x.fillRect(0, 0, Wp, Lp); x.strokeStyle = 'rgba(120,230,255,0.7)'; x.lineWidth = 2; const s = 26; x.beginPath(); for (let yy = s / 2; yy < Lp; yy += s) { x.moveTo(8, yy); x.lineTo(Wp - 8, yy); } x.stroke(); x.strokeStyle = 'rgba(255,190,120,0.65)'; x.beginPath(); for (let xx = s / 2; xx < Wp; xx += s) { x.moveTo(xx, 8); x.lineTo(xx, Lp - 8); } x.stroke(); x.fillStyle = 'rgba(255,213,74,0.9)'; for (let xx = s / 2; xx < Wp; xx += s) x.fillRect(xx - 4, Lp - 10, 8, 8); }
  else if (kind === 'polarizador') { x.fillStyle = 'rgba(60,50,90,0.55)'; x.fillRect(0, 0, Wp, Lp); x.strokeStyle = 'rgba(200,190,255,0.22)'; x.lineWidth = 1.5; x.beginPath(); for (let k = -Lp; k < Wp + Lp; k += 7) { x.moveTo(k, 0); x.lineTo(k + Lp, Lp); } x.stroke(); }
  else if (kind === 'base') { x.fillStyle = '#2a2e3a'; x.fillRect(0, 0, Wp, Lp); x.fillStyle = '#3d4352'; x.fillRect(Wp * 0.1, Lp * 0.36, Wp * 0.8, Lp * 0.5); x.fillStyle = 'rgba(160,170,190,0.5)'; x.fillRect(Wp * 0.42, Lp * 0.58, Wp * 0.16, Lp * 0.03);
   x.fillStyle = '#1f6b4a'; x.fillRect(Wp * 0.1, Lp * 0.06, Wp * 0.8, Lp * 0.26); for (let i = 0; i < 26; i++) { x.fillStyle = R0() < 0.5 ? '#c9b46a' : '#111'; x.fillRect(Wp * 0.12 + R0() * Wp * 0.72, Lp * 0.08 + R0() * Lp * 0.2, 6 + R0() * 22, 6 + R0() * 14); } }
  return (TEX[key] = c); };
 R.capas = (ctx, t, o) => { const Ls = o.capas, n = Ls.length, Wp = o.W || 260, Lp = o.Lz || 540, gap = o.gap || 90, d = o.d || 0.6, yaw = o.yaw ?? 0.62, k = o.tilt ?? 0.5, cx = o.x ?? 500, cy = o.y ?? 1180;
  const junta = o.tJunta != null ? 1 - E.inOut(win(t, o.tJunta, o.tJunta + (o.dJunta ?? 1.2))) : 1;
  const uc = (o.cortes || []).map((tc) => E.inOut(win(t, tc, tc + d)) * junta);
  // altura de cada placa (de abajo arriba)
  const th = Ls.map((l) => l.grosor || 8), hY = new Array(n); let acc = 0; for (let j = n - 1; j >= 0; j--) { let off = 0; for (let c = j; c < uc.length; c++) off += uc[c] * gap; hY[j] = acc + off; acc += th[j]; }
  const cs = Math.cos(yaw), sn = Math.sin(yaw), M = (px, pz, py) => [cx + px * cs - pz * sn, cy - py + k * (px * sn + pz * cs)];
  const corners = [[-Wp / 2, -Lp / 2], [Wp / 2, -Lp / 2], [Wp / 2, Lp / 2], [-Wp / 2, Lp / 2]];
  ctx.save();
  // mesa y sombra de contacto de la base
  const sh = ctx.createRadialGradient(cx, cy + 30, 10, cx, cy + 30, 430); sh.addColorStop(0, 'rgba(0,0,0,0.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(cx, cy + 30, 440, 230, 0, 0, TAU); ctx.fill();
  // varillas guía (traseras antes, delanteras después)
  const topH = hY[0] + th[0] + 24, pins = corners.map(([px, pz]) => [px * 0.86, pz * 0.93]), depth = (p) => p[0] * sn + p[1] * cs;
  const rod = (p, a) => { const [x0, y0] = M(p[0], p[1], th[n - 1]), [x1, y1] = M(p[0], p[1], topH); ctx.strokeStyle = `rgba(200,210,230,${a})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.fillStyle = `rgba(230,236,250,${a})`; ctx.beginPath(); ctx.arc(x1, y1, 6, 0, TAU); ctx.fill(); };
  const sep = Math.max(0, ...uc); pins.filter((p) => depth(p) < 0).forEach((p) => rod(p, 0.55 * sep));
  const tops = [];
  for (let j = n - 1; j >= 0; j--) { const l = Ls[j], y0 = hY[j], y1 = y0 + th[j];
   // caras laterales visibles
   for (let e = 0; e < 4; e++) { const a = corners[e], b = corners[(e + 1) % 4], nx = (a[1] === b[1]) ? 0 : Math.sign(a[0]), nz = (a[0] === b[0]) ? 0 : Math.sign(a[1]), facing = nx * sn + nz * cs; if (facing <= 0) continue;
    const p = [M(a[0], a[1], y1), M(b[0], b[1], y1), M(b[0], b[1], y0), M(a[0], a[1], y0)]; ctx.fillStyle = l.kind === 'base' ? '#4a5060' : l.kind === 'vidrio' ? 'rgba(170,215,255,0.55)' : l.kind === 'tactil' ? 'rgba(120,230,255,0.45)' : l.kind === 'polarizador' ? 'rgba(90,80,130,0.85)' : l.kind === 'oled' ? '#1a1a26' : l.kind === 'tft' ? '#5a5638' : (l.col || '#777');
    ctx.beginPath(); p.forEach(([x, y], q) => (q ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.fillStyle = `rgba(0,0,0,${0.15 + 0.2 * (1 - facing)})`; ctx.fill(); }
   // cara superior (textura en coordenadas locales)
   ctx.save(); ctx.transform(cs, k * sn, -sn, k * cs, cx, cy - y1); ctx.beginPath(); ctx.roundRect(-Wp / 2, -Lp / 2, Wp, Lp, l.kind === 'base' ? 34 : 26); ctx.clip();
   if (l.kind === 'vidrio') { ctx.fillStyle = 'rgba(190,225,255,0.14)'; ctx.fillRect(-Wp / 2, -Lp / 2, Wp, Lp); const gx = ((t * 0.25) % 1.6 - 0.3) * Lp; const gl = ctx.createLinearGradient(0, gx - 90, 0, gx + 90); gl.addColorStop(0, 'rgba(255,255,255,0)'); gl.addColorStop(0.5, 'rgba(255,255,255,0.35)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gl; ctx.fillRect(-Wp / 2, -Lp / 2, Wp, Lp); ctx.fillStyle = 'rgba(10,10,20,0.85)'; ctx.beginPath(); ctx.arc(0, -Lp / 2 + 26, 9, 0, TAU); ctx.fill(); }
   else if (l.kind === 'color') { ctx.fillStyle = l.col || '#888'; ctx.fillRect(-Wp / 2, -Lp / 2, Wp, Lp); }
   else { ctx.drawImage(tex(l.kind, Wp, Lp), -Wp / 2, -Lp / 2); if (l.kind === 'oled') { const s = o.pantalla ?? 0; if (s > 0) { const g = ctx.createLinearGradient(0, -Lp / 2, 0, Lp / 2); g.addColorStop(0, `rgba(255,190,70,${0.75 * s})`); g.addColorStop(0.5, `rgba(240,90,160,${0.6 * s})`); g.addColorStop(1, `rgba(80,90,255,${0.75 * s})`); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(-Wp / 2, -Lp / 2, Wp, Lp); ctx.globalCompositeOperation = 'source-over'; } } }
   ctx.restore();
   // borde y resaltado de la placa activa
   ctx.save(); ctx.transform(cs, k * sn, -sn, k * cs, cx, cy - y1); ctx.beginPath(); ctx.roundRect(-Wp / 2, -Lp / 2, Wp, Lp, l.kind === 'base' ? 34 : 26);
   const act = o.activa === j ? (o.activaU ?? 1) : 0; ctx.lineWidth = 2 + 4 * act; ctx.strokeStyle = act > 0 ? `rgba(255,213,74,${0.4 + 0.6 * act})` : 'rgba(255,255,255,0.35)'; ctx.stroke(); ctx.restore();
   tops[j] = M(Wp / 2, 0, y1); }
  pins.filter((p) => depth(p) >= 0).forEach((p) => rod(p, 0.55 * sep));
  ctx.restore(); return { top: tops, M, hY }; };
 R.capasSfx = (k, o) => { (o.cortes || []).forEach((tc) => k.play('tock', tc + (o.d || 0.6) * 0.9, { f: 900, gain: 0.25, minor: true })); if (o.tJunta != null) { k.play('whoosh', o.tJunta, { dur: (o.dJunta ?? 1.2) * 0.8, top: 1600, gain: 0.5 }); k.play('click', o.tJunta + (o.dJunta ?? 1.2), { gain: 0.8 }); } };

 window.REEL = R;
})();
