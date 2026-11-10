// =====================================================================================================
// REEL v2 · reels SIN VOZ de SIMULACIÓN HIPNÓTICA («oddly satisfying») · Plantilla Asombroteca SIN_VOZ 2.0
// ------------------------------------------------------------------------------------------------------
// Un solo proceso físico continuo (motor/sim.js), sin cortes, en movimiento desde el fotograma 0. Texto mínimo: una PREGUNTA
// (≤ 6 palabras) al inicio, un CONTADOR grande y una FRASE final que revela el dato real. Marca de agua «ASOMBROTECA» pequeña
// durante todo el vídeo, en una esquina dentro de la zona segura. Sonido sacado de los eventos de la simulación (R.asmr).
// No modifica PLANTILLA, H ni SOUND. Todo es función pura de t.
//
//   const R = window.REEL, TL = R.TL       TL = { dur, musica, semilla, pregunta, tPregunta, frase, tFrase, fuente }
//   R.make({ draw(ctx, t), sound(k), eventos: () => [t…], loop (0.6), marca: { x, y, align } }) → { explainer, scoreSound, scoreMusic, DURATION }
//   R.pregunta(ctx, t, o) · R.contador(ctx, t, valor, o) · R.frase(ctx, t, o) · R.marcaAgua(ctx, t, o) · R.texto(…)
//   R.asmr(k, eventos, { voz, gain, maxBin, bin, dens }) · R.nota(p) (escala pentatónica) · R.zumbido(k, t0, t1, f(t), g(t))
// =====================================================================================================
(function () {
 const PL = window.PLANTILLA, P = PL.P, MUS = PL.MUS;
 const W = 1080, HH = 1920, TAU = Math.PI * 2;
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
 const sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const SAFE = { top: 220, bottom: 1450, left: 60, right: 940, cx: 500 };
 let LOG = null; const log = (k, x0, y0, x1, y1) => { if (LOG) LOG.push([k, Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1)]); };
 const fmtN = (v) => P.fmtN(v);

 // ---------------- RELOJ Y TEXTOS: tiempos.txt → window.TIEMPOS ----------------
 const RAW = window.TIEMPOS || {};
 const TL = { dur: RAW.duracion || 30, musica: RAW.musica || 'no', semilla: RAW.semilla ?? 1, pregunta: RAW.pregunta || '', tPregunta: RAW.tPregunta ?? 3.5,
  frase: RAW.frase || '', tFrase: RAW.tFrase ?? (RAW.duracion || 30) - 4, fuente: RAW.fuente || '', param: RAW.param || {} };
 const R = { TL, SAFE, W, HH, TAU, cl, sm, E, lerp, win, fmtN, log };
 R.safeLog = () => LOG || [];

 // ---------------- FONDO: oscuro y limpio ----------------
 R.fondo = (ctx, t, o = {}) => { ctx.save(); ctx.fillStyle = o.c0 || '#06060b'; ctx.fillRect(0, 0, W, HH);
  const g = ctx.createRadialGradient(540, o.gy ?? 860, 0, 540, o.gy ?? 860, 1100); g.addColorStop(0, o.glow || 'rgba(40,44,90,0.55)'); g.addColorStop(1, 'rgba(6,6,11,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.restore(); };

 // ---------------- TEXTO ----------------
 // R.texto(ctx, s, t, t0, t1, { x, y, px, anim: 'pop'|'sube'|'golpe', font, fw, col, hi, maxW, maxLines, kind, fadeOut })
 // «*palabra*» = color de acento; « / » = salto de línea. Se encoge y se recoloca dentro de la zona segura y registra su caja (QC).
 const parse = (s) => { const out = []; let hi = false; for (const raw of s.split(/\s+/).filter(Boolean)) { if (raw === '/') { out.push({ br: true }); continue; } let h = hi, any = hi; for (const ch of raw) if (ch === '*') { h = !h; if (h) any = true; } const w = raw.replace(/\*/g, ''); if (w) out.push({ w, hi: any }); hi = h; } return out; };
 R.palabras = (s) => parse(s || '').filter((x) => !x.br && /[\p{L}\p{N}]/u.test(x.w)).length;
 R.texto = (ctx, s, t, t0, t1, o = {}) => {
  if (!s || t < t0 - 1e-6 || (t1 != null && t > t1 + 1e-6)) return null;
  const intro = t0 <= 1e-6 ? 1 : 0, out = t1 != null && o.fadeOut !== false ? 1 - sm(t1 - 0.35, t1, t) : 1; if (out <= 0) return null;
  const anim = o.anim || 'pop', font = o.font || 'Fredoka', fw = o.fw || 700, maxW = Math.min(o.maxW || 840, SAFE.right - SAFE.left), toks = parse(s); let px = o.px || 72; const lines = [];
  ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  const layout = () => { lines.length = 0; ctx.font = `${fw} ${px}px "${font}"`; const sp = ctx.measureText(' ').width; let cur = [], cw = 0;
   for (const tk of toks) { if (tk.br) { if (cur.length) lines.push({ ws: cur, w: cw }); cur = []; cw = 0; continue; } const ww = ctx.measureText(tk.w).width; if (cur.length && cw + sp + ww > maxW) { lines.push({ ws: cur, w: cw }); cur = []; cw = 0; } cur.push({ ...tk, ww }); cw += (cur.length > 1 ? sp : 0) + ww; }
   if (cur.length) lines.push({ ws: cur, w: cw }); return sp; };
  let sp = layout(); while ((Math.max(...lines.map((l) => l.w)) > maxW || lines.length > (o.maxLines || 3)) && px > 36) { px -= 3; sp = layout(); }
  const lh = px * 1.14, bw = Math.max(...lines.map((l) => l.w)), bh = lines.length * lh;
  let x = cl(o.x ?? SAFE.cx, SAFE.left + bw / 2, SAFE.right - bw / 2), y = cl(o.y ?? 330, SAFE.top + bh / 2 + 6, SAFE.bottom - bh / 2 - 6); const top = y - bh / 2;
  log(o.kind || 'texto', x - bw / 2, top, x + bw / 2, top + bh);
  const u = intro ? 1 : win(t, t0, t0 + 0.4); let sc = 1, dy = 0, alpha = out;
  if (anim === 'sube') { dy = (1 - E.out(u)) * 50; alpha *= E.out(u); } else if (anim === 'golpe') { sc = intro ? 1 : lerp(1.5, 1, E.in(win(t, t0, t0 + 0.16))); alpha *= cl(u * 5); }
  if (intro && o.respira !== false) sc *= 1 + 0.03 * Math.sin(t * 3.6);
  ctx.globalAlpha *= alpha; ctx.translate(x, y + dy); ctx.scale(sc, sc); ctx.translate(-x, -y); ctx.lineJoin = 'round'; ctx.font = `${fw} ${px}px "${font}"`; let wi = 0;
  lines.forEach((ln, li) => { let xx = x - ln.w / 2; const yy = top + li * lh + px * 0.86;
   for (const w of ln.ws) { const wu = anim === 'pop' && !intro ? E.out(win(t, t0 + wi * 0.06, t0 + wi * 0.06 + 0.32)) : 1, ws = anim === 'pop' && !intro ? lerp(0.4, 1, wu) + 0.1 * Math.sin(Math.PI * wu) : 1;
    if (wu > 0.001) { ctx.save(); const cx = xx + w.ww / 2, cy = yy - px * 0.32; ctx.translate(cx, cy); ctx.scale(ws, ws); ctx.translate(-cx, -cy); ctx.globalAlpha *= cl(wu * 3);
     ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.lineWidth = px * 0.14; ctx.strokeText(w.w, xx, yy); ctx.fillStyle = w.hi ? (o.hi || '#ffd54a') : (o.col || '#ffffff'); ctx.fillText(w.w, xx, yy); ctx.restore(); }
    xx += w.ww + sp; wi++; } });
  ctx.restore(); return { x0: x - bw / 2, y0: top, x1: x + bw / 2, y1: top + bh, px }; };

 // La pregunta (≤ 6 palabras) ya está en el fotograma 0 y se va en tPregunta
 R.pregunta = (ctx, t, o = {}) => R.texto(ctx, TL.pregunta, t, 0, TL.tPregunta, { y: 330, px: 74, kind: 'pregunta', ...o });
 // La frase final (el dato) entra en tFrase y se queda casi hasta el final
 // y se va por completo ANTES de que empiece el empalme con el fotograma 0 (así nunca se encima con la pregunta)
 R.LOOP = 0.6;
 R.frase = (ctx, t, o = {}) => R.texto(ctx, TL.frase, t, TL.tFrase, o.fin ?? TL.dur - R.LOOP - 0.15, { y: 330, px: 60, anim: 'sube', kind: 'frase', maxLines: 3, ...o });
 // Contador grande. o = { x, y (1335), px (130), col, glow 'r,g,b', bump 0..1, sufijo }
 R.contador = (ctx, t, valor, o = {}) => { const s = (typeof valor === 'number' ? fmtN(valor) : String(valor)) + (o.sufijo || ''); let px = o.px || 130; ctx.save(); ctx.font = `900 ${px}px "Nunito"`; while (ctx.measureText(s).width > (o.maxW || 760) && px > 40) { px -= 4; ctx.font = `900 ${px}px "Nunito"`; }
  const tw = ctx.measureText(s).width, x = cl(o.x ?? 540, SAFE.left + tw / 2, SAFE.right - tw / 2), y = cl(o.y ?? 1335, SAFE.top + px * 0.62, SAFE.bottom - px * 0.62), b = o.bump || 0, sc = 1 + 0.06 * Math.sin(Math.PI * b);
  ctx.translate(x, y); ctx.scale(sc, sc); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = `rgba(${o.glow || '255,213,74'},${0.55 + 0.3 * Math.sin(Math.PI * b)})`; ctx.shadowBlur = px * 0.35; ctx.fillStyle = o.col || '#ffffff'; ctx.fillText(s, 0, 0); ctx.shadowBlur = 0; ctx.fillText(s, 0, 0); ctx.restore();
  log('contador', x - tw / 2, y - px * 0.6, x + tw / 2, y + px * 0.6); };
 // Texto pequeño sin animación (etiquetas de 1-3 palabras, números de ejes, fórmulas). o = { px (32), font, fw, col, align, alpha, kind:
 //   'etiqueta' (≤ 2 a la vez) | 'eje' (números y letras de ejes) | 'formula', base ('middle'), sombra }
 R.chico = (ctx, s, x, y, o = {}) => { if (!s) return null; const px = o.px || 32; ctx.save(); ctx.font = `${o.fw || 700} ${px}px "${o.font || 'Nunito'}"`; const tw = ctx.measureText(s).width, al = o.align || 'center', x0 = al === 'left' ? x : al === 'right' ? x - tw : x - tw / 2;
  ctx.globalAlpha *= o.alpha ?? 1; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; if (o.sombra !== false) { ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = px * 0.16; ctx.lineJoin = 'round'; ctx.strokeText(s, x0, y); } ctx.fillStyle = o.col || '#ffffff'; ctx.fillText(s, x0, y); ctx.restore();
  if ((o.alpha ?? 1) > 0.05) log(o.kind || 'etiqueta', x0, y - px * 0.6, x0 + tw, y + px * 0.6); return { x0, x1: x0 + tw, w: tw }; };
 // Marca de agua discreta durante TODO el vídeo, con contorno oscuro (legible aunque haya objetos debajo) (esquina inferior derecha de la zona segura por defecto)
 R.marcaAgua = (ctx, t, o = {}) => { const s = o.nombre || 'ASOMBROTECA', px = o.px || 32; ctx.save(); ctx.font = `800 ${px}px "Nunito"`; ctx.letterSpacing = '5px'; const tw = ctx.measureText(s).width, al = o.align || 'right', xr = o.x ?? 925, y = o.y ?? 1424, x0 = al === 'right' ? xr - tw : al === 'center' ? xr - tw / 2 : xr;
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.globalAlpha *= o.alpha ?? 0.5; ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.lineWidth = 6; ctx.strokeText(s, x0, y); ctx.fillStyle = '#ffffff'; ctx.fillText(s, x0, y); ctx.restore(); log('marca', x0, y - px * 0.6, x0 + tw, y + px * 0.6); };

 // ---------------- SONIDO DESDE LA SIMULACIÓN (estilo ASMR) ----------------
 const PENTA = [0, 2, 4, 7, 9];
 R.nota = (p, base = 261.63) => { const o = Math.floor(p / 5), q = ((Math.round(p) % 5) + 5) % 5; return base * Math.pow(2, (PENTA[q] + 12 * o) / 12); };
 const VOCES = {
  madera: (k, t, f, g, pan) => { k.tone(t, { f, type: 'triangle', dur: 0.11, gain: 0.5 * g, a: 0.0015, pan }); k.tone(t, { f: f * 2.01, dur: 0.05, gain: 0.12 * g, a: 0.001, pan }); k.noise(t, { dur: 0.008, filter: 'bandpass', f: Math.min(9000, f * 4), q: 3, gain: 0.12 * g, pan }); },
  cristal: (k, t, f, g, pan) => { k.tone(t, { f, dur: 0.9, gain: 0.26 * g, a: 0.002, verb: 0.35, pan }); k.tone(t, { f: f * 2.76, dur: 0.25, gain: 0.06 * g, a: 0.002, verb: 0.35, pan }); },
  gota: (k, t, f, g, pan) => k.tone(t, { f: [[0, f * 0.75], [0.05, f * 1.25]], dur: 0.12, gain: 0.42 * g, a: 0.002, pan, verb: 0.2 }),
  tic: (k, t, f, g, pan) => { k.noise(t, { dur: 0.012, filter: 'bandpass', f: Math.min(10000, f * 3), q: 6, gain: 0.35 * g, pan }); k.tone(t, { f: f * 1.5, dur: 0.035, gain: 0.08 * g, a: 0.001, pan }); },
  campana: (k, t, f, g, pan) => { k.tone(t, { f, dur: 2.2, gain: 0.22 * g, a: 0.003, verb: 0.5, pan }); k.tone(t, { f: f * 2, dur: 1.0, gain: 0.07 * g, a: 0.003, verb: 0.5, pan }); k.tone(t, { f: f * 3.01, dur: 0.5, gain: 0.03 * g, a: 0.003, verb: 0.5, pan }); },
 };
 R.VOCES = VOCES; R.EV = [];
 // ev: [{ t, f (Hz) | p (índice pentatónico), v (0..1 intensidad), pan }]. Agrupa por ventanas de `bin` s y deja como mucho `maxBin`
 // sonidos por ventana (los más fuertes); el volumen baja con la densidad para que mil choques suenen a lluvia suave y no saturen.
 R.asmr = (k, ev, o = {}) => { const bin = o.bin ?? 1 / 50, maxB = o.maxBin ?? 2, dens = o.dens ?? 40, voz = VOCES[o.voz || 'madera'], G = o.gain ?? 1;
  const s = [...ev].sort((a, b) => a.t - b.t); let i = 0; const ts = s.map((e) => e.t);
  const cnt = (t) => { let lo = 0, hi = ts.length; while (lo < hi) { const m = (lo + hi) >> 1; if (ts[m] < t - 0.25) lo = m + 1; else hi = m; } let a = lo; lo = a; hi = ts.length; while (lo < hi) { const m = (lo + hi) >> 1; if (ts[m] < t + 0.25) lo = m + 1; else hi = m; } return lo - a; };
  while (i < s.length) { const b0 = Math.floor(s[i].t / bin); let j = i; while (j < s.length && Math.floor(s[j].t / bin) === b0) j++;
   const grp = s.slice(i, j).sort((a, b) => b.v - a.v).slice(0, maxB), d = cnt(s[i].t), gd = 1 / Math.sqrt(1 + d / dens);
   for (const e of grp) { const f = e.f ?? R.nota(e.p ?? 10, o.base); voz(k, e.t, f, G * cl(e.v, 0.05, 1) * gd, e.pan ?? 0); R.EV.push(e.t); }
   i = j; } };
 // Zumbido continuo cuyo tono y volumen siguen a la simulación (p. ej., la velocidad del lápiz): f(t) Hz y g(t) 0..1
 R.zumbido = (k, t0, t1, f, g, o = {}) => { const st = o.paso ?? 0.05; for (let t = t0; t < t1; t += o.trozo ?? 1.0) { const d = Math.min(o.trozo ?? 1.0, t1 - t) + 0.08, fe = [], ge = []; for (let u = 0; u <= d + 1e-6; u += st) fe.push([u, f(t + u)]);
   const gm = g(t + d / 2); k.tone(t, { f: fe, dur: d, gain: (o.gain ?? 0.05) * gm, a: 0.04, hold: d - 0.08, type: o.type || 'sine', filter: 'lowpass', f2: 1800, verb: 0.25, pan: 0 }); } };
 R.musica = (k, D, tipo) => { if (!tipo || tipo === 'no') return; MUS.piano(k, 0, D, { bpm: 240 * Math.max(2, Math.round(D / (240 / 60))) / D, gain: 0.35, strings: 0.8, chords: [['A2', 'E3', 'A3', 'C4'], ['F2', 'C3', 'F3', 'A3'], ['C3', 'G3', 'C4', 'E4'], ['G2', 'D3', 'G3', 'B3']] }); };

 // ---------------- MONTAJE (una sola escena, sin cortes) ----------------
 R.make = (cfg) => { const D = cfg.duration ?? TL.dur, LOOP = cfg.loop ?? 0.6; R.LOOP = LOOP; let LY = null;
  const frame = (ctx, t) => { ctx.save(); R.fondo(ctx, t, cfg.fondo); cfg.draw(ctx, t); R.marcaAgua(ctx, t, cfg.marca); ctx.restore(); };
  const explainer = (ctx, Wd, Hd, t) => { LOG = typeof window !== 'undefined' && window.__SAFE_QC ? [] : null; frame(ctx, t);
   if (LOOP > 0 && t > D - LOOP) { if (!LY) LY = H.layer(W, HH); const c = LY.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.clearRect(0, 0, W, HH); const keep = LOG, al = E.inOut(win(t, D - LOOP, D)); LOG = keep ? [] : null; frame(c, 0); const sub = LOG; LOG = keep;
    if (keep && sub && al > 0.02) for (const e of sub) keep.push(['empalme:' + e[0], e[1], e[2], e[3], e[4]]);   // textos del fotograma 0 que vuelven (QC)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = al; ctx.drawImage(LY, 0, 0); ctx.restore(); }
   // viñeta suave (fondo limpio)
   H.vignette(ctx, W, HH, 0.35, '0,0,0'); };
  const scoreSound = (k) => { R.EV = []; cfg.sound(k); };
  const scoreMusic = (k) => R.musica(k, D, TL.musica);
  return { explainer, scoreSound, scoreMusic, DURATION: D, eventos: cfg.eventos || (() => R.EV) };
 };

 window.REEL = R;
})();
