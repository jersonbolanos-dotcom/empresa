// =====================================================================================================
// episodio.js — «¿Cómo enviaban mensajes antes del teléfono? El telégrafo óptico de Claude Chappe» · Asombroteca · Ep. 06 · PLANTILLA v1.24
// Una SEÑAL concreta (configuración A) sale de la torre A, la observa por telescopio el operador de B, la copia con el manipulador
// (cuerdas → poleas → regulador e indicadores), C la observa y la repite… hasta Lille. Modelo maestro ÚNICO de estación (P.chappeTower)
// en todas las escenas. Sin haces ni ondas: las líneas de visión son discontinuas y se rotulan como esquema. Reloj = voz (88,45 s).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS, IMG = {};
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const T = { chappe: wt(2, 'chappe'), brazos: wt(4, 'brazos'), codigo: wt(6, 'código'), telescopio: wt(7, 'telescopio'), observaba: wt(7, 'observaba'), copiaba: wt(8, 'copiaba'), repetia: wt(9, 'repetía'), elevados: wt(11, 'elevados'), precision: wt(12, 'precisión'),
  caballo: wt(14, 'caballo'), paris: wt(15, 'parís'), lille: wt(15, 'lille'), niebla: wt(17, 'niebla'), lluvia: wt(17, 'lluvia'), noche: wt(17, 'noche'), electrico: wt(18, 'eléctrico'), wifi: wt(19, 'wifi'), red19: wt(19, 'red'), internet: wt(20, 'internet'), end: A.speech_end };
 for (let i = 0; i < A.segments.length; i++) T['s' + i] = A.segments[i].s;
 const B0 = { b2: T.s1 - 0.2, b3: T.s2 - 0.2, b4: T.s3 - 0.2, b5: T.s4 - 0.2, b6: T.s5 - 0.2, b7: T.s7 - 0.2, b8: T.s8 - 0.2, b9: T.s9 - 0.2, b11: T.s10 - 0.2, b12: T.s12 - 0.2, b13: T.s13 - 0.2, b14: T.s14 - 0.2, b15: T.s15 - 0.2, b16: T.s16 - 0.2, b17: T.s17 - 0.2, b18: T.s18 - 0.2, b19: T.s19 - 0.2, b20: T.s20 - 0.2 };

 // ---------------- utilidades ----------------
 const C = { oro: '#FFD447', blanco: '#F5F7FA', sepia: '#A67A54', papel: '#DEC9A8', cian: '#53C5E8', fuego: '#FF9A42', espacio: '#050B18' };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.fillStyle = c; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; if (o.ls) ctx.letterSpacing = o.ls + 'px'; if (o.sh) { ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 14; } ctx.fillText(s, x, y); ctx.restore(); };
 // título breve de escena: barra amarilla y texto blanco grande, arriba, con fundido
 const title = (ctx, s, t, t0, t1, o = {}) => { const a = sm(t0, t0 + 0.3, t) * (1 - sm(t1 - 0.3, t1, t)); if (a <= 0) return; const y = o.y || 230, e = E.out(cl((t - t0) / 0.5)); ctx.save(); ctx.globalAlpha *= a; const g = ctx.createLinearGradient(0, 0, 0, y + 170); g.addColorStop(0, 'rgba(0,0,0,0.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, y + 170); ctx.font = `900 ${o.px || 62}px Nunito`; const tw = ctx.measureText(s).width; ctx.fillStyle = C.oro; ctx.fillRect(540 - tw / 2 * e - 10, y + 44, (tw + 20) * e, 8); txt(ctx, s, 540, y, o.px || 62, C.blanco, { w: 900, sh: 1 }); ctx.restore(); };
 const lab = (ctx, s, anchor, x, y, t, t0, t1, o = {}) => P.ykLabel(ctx, s, anchor, x, y, t, t0, t1, o);
 const recon = (ctx, s, t, t0, t1) => P.ykRecon(ctx, t, t0, t1, { s });
 const vign = (ctx, a = 0.4) => { const g = ctx.createRadialGradient(540, 900, 500, 540, 900, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 const shot = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++; const a = keys[i], b = keys[i + 1], u = E.inOut(win(t, a[0], b[0])), L = (p, q) => p.map((v, j) => lerp(v, q[j], u)); return P.cam3(L(a[1], b[1]), L(a[2], b[2]), lerp(a[3] || 900, b[3] || 900, u)); };
 const stars = (ctx, t, n = 260, seed = 4, drift = 0) => { const R = H.rng(seed); ctx.save(); for (let i = 0; i < n; i++) { const x = R() * W, y = ((R() * HH + drift * (0.3 + R())) % HH + HH) % HH, s = R() < 0.08 ? 3 : 1.8; ctx.globalAlpha = 0.35 + R() * 0.65; ctx.fillStyle = '#e8f0ff'; ctx.fillRect(x, y, s, s); } ctx.restore(); };
 const space = (ctx, t, drift = 0) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#02050d'); g.addColorStop(1, '#0a1630'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); stars(ctx, t, 300, 4, drift); };
 const bill = (ctx, cam, foot, h, f) => { const a = cam.clip([foot], 1)[0], b = cam.clip([[foot[0], foot[1] + h, foot[2]]], 1)[0]; if (!a || !b) return null; return f(a[0], a[1], a[1] - b[1]); };
 const actor = (cam, p, f) => ({ d: cam.depth(p), f });
 const sepiaWarm = (ctx, a) => { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = a; ctx.fillStyle = '#E7B56E'; ctx.fillRect(0, 0, W, HH); ctx.restore(); };
 const blueTech = (ctx, a) => P.techGrade(ctx, a);

 // ---------------- red de estaciones (metros) y señales ----------------
 const TWR = [[0, 0], [9000, 300], [18000, -200], [27000, 250], [36000, -100]], NAMES = ['A', 'B', 'C', 'D', 'E'], hz = (x, z) => P.chappeHeight(x, z, TWR);
 const ST = TWR.map(([x, z]) => [x, hz(x, z), z]), TOP = ST.map(([x, y, z]) => [x, y + P.CHP.th + P.CHP.mast, z]);
 // configuraciones didácticas (A, B, C son etiquetas del video, NO letras del código de Chappe)
 const S0 = { reg: 0, li: 90, ri: 90 }, SA = { reg: 0, li: 45, ri: 135 }, SB = { reg: 90, li: 90, ri: 90 }, SC = { reg: 0, li: 135, ri: 45 }, SW = { reg: 0, li: 45, ri: 90 };
 const sky = (ctx, o = {}) => P.chappeSky(ctx, o);
 // cámara siempre por encima del terreno (evita atravesar colinas)
 const C3 = (pos, tgt, f) => P.cam3([pos[0], Math.max(pos[1], hz(pos[0], pos[2]) + 6), pos[2]], tgt, f);
 // plano de paisaje con todas las estaciones; cfg(i, t) da la configuración de cada torre; pins / los (líneas de visión discontinuas)
 const land = (ctx, cam, t, o = {}) => { sky(ctx, o); P.chappeLand(ctx, cam, t, Object.assign({ towers: TWR }, o)); const order = ST.map((p, i) => ({ i, d: cam.depth(p) })).sort((a, b) => b.d - a.d);
  for (const { i } of order) P.chappeTower(ctx, cam, ST[i], t, { cfg: o.cfg ? o.cfg(i, t) : S0, scope: 1, glow: o.glow ? o.glow(i, t) : 0 });
  if (o.los) { ctx.save(); ctx.globalAlpha *= o.los; ctx.setLineDash([14, 12]); ctx.lineWidth = 3; for (let i = 0; i < TOP.length - 1; i++) { const a = cam.pr(TOP[i]), b = cam.pr(TOP[i + 1]); if (a[2] < 2 || b[2] < 2) continue; ctx.strokeStyle = o.losLit && o.losLit(i, t) ? 'rgba(255,212,71,0.9)' : 'rgba(245,247,246,0.55)'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } ctx.restore(); }
  if (o.pins) for (let i = 0; i < TOP.length; i++) { const p = cam.pr([TOP[i][0], TOP[i][1] + 6, TOP[i][2]]); if (p[2] < 2) continue; const lit = o.pins(i, t); ctx.save(); if (lit) P.glow(ctx, p[0], p[1] - 30, 40, '255,212,71', 0.7); ctx.fillStyle = lit ? '#FFD447' : 'rgba(245,247,246,0.85)'; ctx.beginPath(); ctx.moveTo(p[0], p[1] - 10); ctx.lineTo(p[0] - 11, p[1] - 30); ctx.lineTo(p[0], p[1] - 50); ctx.lineTo(p[0] + 11, p[1] - 30); ctx.closePath(); ctx.fill(); ctx.font = '900 32px Nunito'; ctx.textAlign = 'center'; ctx.fillStyle = '#F5F7F6'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8; ctx.fillText(NAMES[i], p[0], p[1] - 76); ctx.restore(); }
 };
 const shotK = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++; const a = keys[i], b = keys[i + 1], u = E.inOut(win(t, a[0], b[0])), L2 = (p, q) => p.map((v, j) => lerp(v, q[j], u)); return C3(L2(a[1], b[1]), L2(a[2], b[2]), lerp(a[3] || 900, b[3] || 900, u)); };
 // vista por el telescopio: la torre A ampliada (cámara cercana equivalente con focal larga), bruma, borde de latón y viñeta
 const scopeView = (ctx, cx, cy, r, t, cfg, o = {}) => { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip(); ctx.translate(cx - 540, cy - 900); const tp = TOP[o.tower ?? 0], cam = C3([tp[0] + 150, tp[1] + 2, tp[2] + 8], [tp[0], tp[1] - 2.2, tp[2]], o.f || 7600);
  sky(ctx, o); P.chappeLand(ctx, cam, t, Object.assign({ towers: TWR, near: [TWR[o.tower ?? 0][0], TWR[o.tower ?? 0][1]], road: false }, o)); P.chappeTower(ctx, cam, ST[o.tower ?? 0], t, { cfg }); ctx.setTransform(ctx.getTransform()); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip(); ctx.fillStyle = `rgba(205,218,222,${0.18 + 0.6 * (o.fog || 0)})`; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); if (o.rain) P.rainFX(ctx, t, o.rain); if (o.night) { ctx.fillStyle = `rgba(6,10,20,${0.82 * o.night})`; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); } const g = ctx.createRadialGradient(cx, cy, r * 0.62, cx, cy, r); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.85)'); ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); ctx.restore();
  ctx.save(); ctx.strokeStyle = '#a88a5c'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, TAU); ctx.stroke(); ctx.strokeStyle = '#5e4a30'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, r + 17, 0, TAU); ctx.stroke(); ctx.restore(); };
 // torre esquemática 2D (mismo modelo y misma geometría que la 3D) para diagramas
 const miniTower = (ctx, x, yb, s, cfg, o = {}) => { const bw = 4.2 * s, bh = 7.2 * s, top = yb - bh - 5.6 * s; ctx.save(); ctx.fillStyle = o.dim ? '#8f8577' : '#B1A28D'; ctx.fillRect(x - bw / 2, yb - bh, bw, bh); ctx.fillStyle = '#6a6560'; ctx.beginPath(); ctx.moveTo(x - bw / 2 - 4, yb - bh); ctx.lineTo(x, yb - bh - 1.3 * s); ctx.lineTo(x + bw / 2 + 4, yb - bh); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#6b5038'; ctx.fillRect(x - 0.14 * s, top, 0.28 * s, 5.6 * s);
  const G = P.chappeGeom(cfg, s), toS = ([p, q]) => [x + p, top - q], bar = (a, b, wd, col) => { const A2 = toS(a), B2 = toS(b), dx = B2[0] - A2[0], dy = B2[1] - A2[1], l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * wd / 2, ny = (dx / l) * wd / 2; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(A2[0] + nx, A2[1] + ny); ctx.lineTo(B2[0] + nx, B2[1] + ny); ctx.lineTo(B2[0] - nx, B2[1] - ny); ctx.lineTo(A2[0] - nx, A2[1] - ny); ctx.closePath(); ctx.fill(); };
  ctx.strokeStyle = '#454E52'; ctx.lineWidth = Math.max(2, s * 0.08); for (const [e, c] of [[G.e1, G.c1], [G.e2, G.c2]]) { const a = toS(e), b = toS(c); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.fillStyle = '#454E52'; ctx.beginPath(); ctx.arc(b[0], b[1], Math.max(3, s * 0.16), 0, TAU); ctx.fill(); }
  bar(G.e1, G.e2, Math.max(4, 0.36 * s), '#303738'); bar(G.e1, G.i1, Math.max(3, 0.3 * s), o.colL || '#303738'); bar(G.e2, G.i2, Math.max(3, 0.3 * s), o.colR || '#303738'); ctx.fillStyle = '#806044'; for (const c of [[0, 0], G.e1, G.e2]) { const p = toS(c); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(3, s * 0.13), 0, TAU); ctx.fill(); }
  if (o.lit) P.glow(ctx, x, top, s * 4, '255,212,71', 0.5 * o.lit); ctx.restore(); return { top }; };

 const B = [];
 // 1 · GANCHO — la torre A cambia sus brazos; la cámara acelera hacia B y C y asciende para revelar la red
 const ch1 = (i, t) => P.chappeAt([[0, S0], [[0.6, 3.3, 5.0, 99, 99][i], SA]], t);
 B.push({ t0: 0, t1: B0.b2, in: { type: 'cut' }, draw(ctx, t) {
  const cam = shotK([[0, [-30, TOP[0][1] + 4, 24], [0, TOP[0][1] - 2, 0], 900], [2.1, [-46, TOP[0][1] + 7, -26], [0, TOP[0][1] - 1, 0], 900], [3.8, [5200, TOP[1][1] + 160, 320], [9000, TOP[1][1], 300], 900], [4.9, [8975, TOP[1][1] + 4, 318], [9000, TOP[1][1] - 2, 300], 900], [B0.b2, [12000, TOP[1][1] + 1600, 5600], [24000, ST[2][1], -100], 900]], t);
  land(ctx, cam, t, { cfg: ch1, near: t < 2.6 ? [0, 0] : t < 5.4 ? [9000, 300] : null, pins: t > 4.6 ? (i) => i <= 2 && t > [0.6, 3.3, 5.0][i] : null, los: sm(4.6, 5.4, t), losLit: (i) => t > [3.3, 5.0, 99][i] });
  title(ctx, '¡MENSAJES SIN ELECTRICIDAD!', t, 0.25, 4.6, { px: 50 }); recon(ctx, 'RECONSTRUCCIÓN ANIMADA', t, 0.6, B0.b2);
 }, sfx(k) { FX.viento(k, 0, 6.2, 0.6); FX.polea(k, 0.6, 1.0, 0.8); k.play('whoosh', 1.8, { dur: 2.4, gain: 0.3 }); FX.polea(k, 3.3, 1.0, 0.5); } });
 // 2 · Francia, finales del s. XVIII: vuelo sobre caminos, aldeas y colinas; línea de visión ESQUEMÁTICA entre estaciones
 B.push({ t0: B0.b2, t1: B0.b3, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, B0.b2, B0.b3), cam = C3([lerp(1500, 15000, E.inOut(u)), lerp(700, 520, u) + 120, lerp(-5200, -3800, u)], [lerp(9000, 24000, E.inOut(u)), 150, lerp(0, 200, u)], 900);
  land(ctx, cam, t, { cfg: (i) => SA, pins: () => true, los: sm(B0.b2 + 2.5, B0.b2 + 3.2, t), drift: t });
  title(ctx, 'FRANCIA · FINALES DEL SIGLO XVIII', t, B0.b2 + 0.3, B0.b2 + 4.2, { px: 44 }); lab(ctx, 'LÍNEA DE VISIÓN (ESQUEMA)', null, 540, 1330, t, B0.b2 + 3.2, B0.b3 + 0.2, { col: C.papel, sub: 'no es un rayo: el operador MIRA la torre vecina' });
 }, sfx(k) { FX.viento(k, B0.b2, B0.b3 - B0.b2, 0.5); FX.etiqueta(k, B0.b2 + 3.2); } });
 // 3 · Claude Chappe en su taller con un modelo del mecanismo + RETRATO (grabado)
 B.push({ t0: B0.b3, t1: B0.b4, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, B0.b3, B0.b4), cam = P.cam3([lerp(2.6, 1.3, E.inOut(u)), lerp(1.7, 1.45, u), lerp(2.8, 1.6, E.inOut(u))], [lerp(-0.3, 0, u), 1.15, 0], 1000), cfg = P.chappeAt([[0, S0], [B0.b3 + 0.8, SA]], t, 1.2);
  ctx.save(); P.workshop1790(ctx, cam, t, { cfg }); bill(ctx, cam, [-1.05, 0, 0.35], 1.72, (X, Y, h) => P.traveler1865(ctx, X, Y, h, t, { var: 2, pose: 'point', dir: 1 })); ctx.restore(); sepiaWarm(ctx, 0.25); vign(ctx, 0.4);
  P.floatPhoto(ctx, IMG.retrato, 770, 560, 360, t, T.chappe - 0.35, B0.b4 + 0.2, { tag: 'GRABADO HISTÓRICO', label: 'CLAUDE CHAPPE', sub: 'inventor francés', credit: 'L. Figuier, Les Merveilles de la science · dominio público', from: 1, rotY: -0.12 });
  recon(ctx, 'RECONSTRUCCIÓN ANIMADA', t, B0.b3 + 0.3, T.chappe - 0.4);
 }, sfx(k) { FX.madera(k, B0.b3 + 0.4, 3, 0.6); FX.polea(k, B0.b3 + 0.8, 1.0, 0.4); FX.revelar(k, T.chappe - 0.35); } });
 // 4 · ¿cómo funcionaba? una torre completa; la cámara asciende hacia el mecanismo + FOTO del modelo de museo
 B.push({ t0: B0.b4, t1: B0.b5, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = E.inOut(win(t, B0.b4, B0.b5 + 0.4)), cam = C3([lerp(-60, -34, u), ST[1][1] + lerp(6, 15, u), lerp(46, 26, u) + 300], [9000, ST[1][1] + lerp(7, 12.5, u), 300], 900);
  land(ctx, { ...cam }, t, { cfg: () => SA, near: [9000, 300] }); title(ctx, '¿CÓMO FUNCIONABA?', t, B0.b4 + 0.2, B0.b5 + 0.2, {});
  P.floatPhoto(ctx, IMG.museo, 800, 620, 330, t, B0.b4 + 0.3, B0.b5 + 0.4, { tag: 'MODELO CONSERVADO EN MUSEO', label: 'FOTO ACTUAL DE UN MODELO', sub: 'no es una foto de 1794', credit: 'Foto: Van Der Meulen Christofle · CC0', from: 1, rotY: -0.12 });
 }, sfx(k) { k.play('whoosh', B0.b4 + 0.1, { dur: 1.2, gain: 0.22 }); FX.revelar(k, B0.b4 + 0.3); } });
 // 5 · los brazos: órbita cercana al regulador y los indicadores (ejes, poleas, contrapesos) + GRABADO del mecanismo
 const cfg5 = (t) => P.chappeAt([[0, SA], [B0.b5 + 0.6, S0], [B0.b5 + 2.0, SB], [B0.b5 + 3.3, SA]], t, 0.95);
 B.push({ t0: B0.b5, t1: B0.b6, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, B0.b5, B0.b6), az = lerp(-0.8, 0.5, E.inOut(u)), tp = TOP[1], cam = C3([tp[0] + Math.cos(az) * 12, tp[1] + 2.6, tp[2] + Math.sin(az) * 12], [tp[0], tp[1] + 0.2, tp[2]], 950);
  land(ctx, cam, t, { cfg: (i) => (i === 1 ? cfg5(t) : SA), near: [9000, 300] }); const r = cam.pr([tp[0] + 0.3, tp[1], tp[2]]);
  title(ctx, 'BRAZOS MECÁNICOS', t, B0.b5 + 0.2, B0.b6 + 0.2, {}); lab(ctx, 'REGULADOR (BARRA CENTRAL)', r, 70, 1250, t, T.brazos - 0.6, T.brazos + 1.0, { al: 'left', col: C.oro }); lab(ctx, 'DOS INDICADORES ARTICULADOS', null, 540, 1330, t, T.brazos + 0.9, B0.b6 + 0.2, { col: C.oro, sub: 'cada uno gira sobre su eje, con contrapeso' });
  P.floatPhoto(ctx, IMG.grabado, 790, 600, 360, t, T.brazos - 1.1, T.brazos + 0.9, { tag: 'GRABADO HISTÓRICO · 1868', label: 'MECANISMO DE CHAPPE', credit: 'L. Figuier, 1868 · dominio público', from: 1, rotY: -0.12 });
 }, sfx(k) { FX.polea(k, B0.b5 + 0.6, 0.95, 0.8); FX.polea(k, B0.b5 + 2.0, 0.95, 0.8); FX.polea(k, B0.b5 + 3.3, 0.95, 0.8); FX.revelar(k, T.brazos - 1.1); } });
 // 6 · cada posición era una señal: vista frontal constante, tres configuraciones mantenidas
 const K6 = [[0, S0], [B0.b6 + 0.35, SA], [B0.b6 + 1.95, SB], [B0.b6 + 3.55, SC]];
 B.push({ t0: B0.b6, t1: B0.b7, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const tp = TOP[1], cam = C3([tp[0] - 15, tp[1] + 0.6, tp[2] + 1.2], [tp[0], tp[1] - 0.6, tp[2]], 1150), cfg = P.chappeAt(K6, t, 0.9);
  land(ctx, cam, t, { cfg: (i) => (i === 1 ? cfg : SA), near: [9000, 300] });
  const k = t < K6[2][0] ? 0 : t < K6[3][0] ? 1 : 2, a = sm(K6[k + 1][0] + 0.8, K6[k + 1][0] + 1.0, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; txt(ctx, ['SEÑAL A', 'SEÑAL B', 'SEÑAL C'][k], 540, 380, 60, C.oro, { w: 900, sh: 1 }); ctx.restore(); }
  ctx.save(); ctx.fillStyle = 'rgba(17,27,35,0.78)'; ctx.beginPath(); ctx.roundRect(110, 1110, 860, 290, 24); ctx.fill(); [0, 1, 2].forEach((j) => { const on = t > K6[j + 1][0] + 0.8; ctx.globalAlpha = on ? 1 : 0.25; miniTower(ctx, 260 + j * 280, 1380, 13, [SA, SB, SC][j], { lit: j === k ? 1 : 0 }); }); ctx.restore();
  title(ctx, 'CADA POSICIÓN ERA UNA SEÑAL', t, B0.b6 + 0.2, B0.b7 + 0.2, { px: 46 }); lab(ctx, '196 SEÑALES POSIBLES', null, 540, 480, t, T.codigo - 0.3, B0.b7 + 0.2, { col: C.papel, sub: 'ligadas a un vocabulario de códigos' }); recon(ctx, 'A, B, C: ETIQUETAS DIDÁCTICAS', t, B0.b6 + 0.5, T.codigo - 0.4);
 }, sfx(k) { for (let j = 1; j < 4; j++) FX.polea(k, K6[j][0], 0.9, 0.8); } });
 // 7 · observación: el operador de B mira por el telescopio y vemos la torre A ampliada mostrando la señal A
 B.push({ t0: B0.b7, t1: B0.b8, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); const look = sm(B0.b7 + 0.3, B0.b7 + 1.0, t); P.chappeSection(ctx, 60, 380, 960, 980, t, { cfg: S0, look }); const z = E.inOut(win(t, T.observaba - 0.2, T.telescopio - 0.2));
  if (z > 0) { const cx = lerp(860, 540, z), cy = lerp(800, 860, z), r = lerp(20, 430, z); scopeView(ctx, cx, cy, r, t, SA, { tower: 0 }); }
  title(ctx, 'OBSERVACIÓN A DISTANCIA', t, B0.b7 + 0.2, B0.b8 + 0.2, {}); lab(ctx, 'TORRE A (AMPLIADA)', null, 540, 1350, t, T.telescopio, B0.b8 + 0.2, { col: C.oro, sub: 'a simple vista apenas se distingue' });
 }, sfx(k) { FX.pasos(k, B0.b7 + 0.2, 3, 0.3, 0.5); FX.telescopio(k, T.observaba - 0.3); } });
 // 8 · copiar la señal: del telescopio al manipulador; las cuerdas suben y el mecanismo toma la MISMA forma
 B.push({ t0: B0.b8, t1: B0.b9, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); const mv0 = T.copiaba - 0.1, man = P.chappeAt([[0, S0], [mv0, SA]], t, 1.1), top = P.chappeAt([[0, S0], [mv0 + 0.35, SA]], t, 1.1), moving = t > mv0 && t < mv0 + 1.5 ? 1 : 0;
  P.chappeSection(ctx, 60, 380, 960, 980, t, { cfg: top, man, look: 1 - sm(B0.b8, B0.b8 + 0.6, t), moving }); scopeView(ctx, 905, 600, 105, t, SA, { tower: 0 });
  txt(ctx, 'LO QUE VE', 905, 740, 32, C.oro, { w: 800 }); title(ctx, 'COPIAR LA SEÑAL', t, B0.b8 + 0.2, B0.b9 + 0.2, { y: 200 }); lab(ctx, 'MANIPULADOR → CUERDAS → POLEAS → BRAZOS', null, 540, 1395, t, mv0 + 0.2, B0.b9 + 0.2, { col: C.oro, px: 32 });
 }, sfx(k) { FX.cuerda(k, T.copiaba, 0.8); FX.polea(k, T.copiaba + 0.3, 1.1, 1); } });
 // 9 · la torre siguiente repite: vuelo de B a C, C observa y copia; después el esquema A → B → C
 B.push({ t0: B0.b9, t1: B0.b11, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const t1 = B0.b9 + 1.5, t2 = T.repetia + 0.6, cfgC = P.chappeAt([[0, S0], [T.repetia, SA]], t, 1.0);
  if (t < t2) { const cam = shotK([[B0.b9, [9060, ST[1][1] + 30, 330], [18000, TOP[2][1], -200], 900], [t1, [17900, ST[2][1] + 14, -180], [18000, TOP[2][1] - 4, -200], 900], [t2, [17940, ST[2][1] + 9, -170], [18000, TOP[2][1] - 1, -200], 900]], t);
   land(ctx, cam, t, { cfg: (i) => (i < 2 ? SA : i === 2 ? cfgC : S0), near: t < B0.b9 + 0.6 ? [9000, 300] : [18000, -200] }); lab(ctx, 'TORRE C: OBSERVA A B Y COPIA', null, 540, 1330, t, B0.b9 + 0.9, t2, { col: C.oro }); }
  else { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#92B7C8'); g.addColorStop(1, '#dfe8ea'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.fillStyle = '#6F8864'; ctx.beginPath(); ctx.moveTo(0, 1300); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 1180 - 90 * Math.exp(-(((x - 180) / 140) ** 2)) - 90 * Math.exp(-(((x - 540) / 140) ** 2)) - 90 * Math.exp(-(((x - 900) / 140) ** 2))); ctx.lineTo(W, HH); ctx.lineTo(0, HH); ctx.closePath(); ctx.fill();
   const sq = [t2 + 0.1, t2 + 0.55, t2 + 1.0]; [180, 540, 900].forEach((x, j) => { const on = t > sq[j]; miniTower(ctx, x, 1095, 14, on ? SA : S0, { lit: on ? 1 : 0 }); txt(ctx, 'ABC'[j], x, 1150, 48, C.blanco, { w: 900, sh: 1 }); });
   ctx.save(); ctx.globalAlpha = sm(t2, t2 + 0.3, t); txt(ctx, 'A → B → C', 540, 520, 72, C.oro, { w: 900, sh: 1 }); txt(ctx, 'cada torre OBSERVA a la anterior y COPIA', 540, 600, 34, C.blanco, { w: 700, sh: 1 }); ctx.restore(); }
  title(ctx, 'REPETIR LA SEÑAL', t, B0.b9 + 0.2, t2 - 0.1, {});
 }, sfx(k) { k.play('whoosh', B0.b9 + 0.1, { dur: 1.4, gain: 0.3 }); FX.telescopio(k, B0.b9 + 1.6); FX.polea(k, T.repetia, 1.0, 0.8); [0.1, 0.55, 1.0].forEach((d) => FX.etiqueta(k, T.repetia + 0.6 + d)); } });
 // 11 · puntos elevados: la cámara sube a una colina; perfil del terreno con la línea de visión por encima de los obstáculos
 B.push({ t0: B0.b11, t1: B0.b12, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const sw = T.s11 - 0.1; if (t < sw) { const u = win(t, B0.b11, sw), cam = C3([18000 - 900 + 500 * u, ST[2][1] - 60 + 140 * E.inOut(u), -200 + 700], [18000, TOP[2][1], -200], 900); land(ctx, cam, t, { cfg: () => SA, near: [18000, -200] }); }
  else { ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); const x0 = 60, x1 = 1020, yb = 1250, prof = (x) => yb - 260 * Math.exp(-(((x - 150) / 120) ** 2)) - 260 * Math.exp(-(((x - 930) / 120) ** 2)) - 70 * Math.exp(-(((x - 540) / 150) ** 2)) - 20 * Math.sin(x / 40);
   ctx.fillStyle = '#6F8864'; ctx.beginPath(); ctx.moveTo(x0, yb + 60); for (let x = x0; x <= x1; x += 6) ctx.lineTo(x, prof(x)); ctx.lineTo(x1, yb + 60); ctx.closePath(); ctx.fill();
   for (const tx of [380, 420, 640, 700]) { ctx.fillStyle = '#3f5a3c'; ctx.beginPath(); ctx.ellipse(tx, prof(tx) - 26, 18, 28, 0, 0, TAU); ctx.fill(); } for (const hx of [500, 545, 585]) { ctx.fillStyle = '#d8ccb2'; ctx.fillRect(hx - 14, prof(hx) - 22, 28, 22); ctx.fillStyle = '#8a4f3a'; ctx.beginPath(); ctx.moveTo(hx - 17, prof(hx) - 22); ctx.lineTo(hx, prof(hx) - 36); ctx.lineTo(hx + 17, prof(hx) - 22); ctx.fill(); }
   const L1 = miniTower(ctx, 150, prof(150) + 2, 9, SA), L2 = miniTower(ctx, 930, prof(930) + 2, 9, SA), a = sm(sw + 0.4, sw + 0.9, t); ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([14, 12]); ctx.strokeStyle = '#F5F7F6'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(150, L1.top); ctx.lineTo(930, L2.top); ctx.stroke(); ctx.restore();
   txt(ctx, 'colinas: la vista pasa por encima de árboles y aldeas', 540, 1380, 34, C.blanco, { w: 700 }); lab(ctx, 'LÍNEA DE VISIÓN DESPEJADA', null, 540, 640, t, sw + 0.6, B0.b12 + 0.2, { col: C.oro, sub: 'estaciones a decenas de kilómetros, según el terreno' }); }
  title(ctx, 'LÍNEA DE VISIÓN', t, B0.b11 + 0.2, B0.b12 + 0.2, {});
 }, sfx(k) { FX.viento(k, B0.b11, 2.2, 0.5); k.play('whoosh', T.s11 - 0.1, { dur: 0.6, gain: 0.2 }); FX.etiqueta(k, T.s11 + 0.5); } });
 // 12 · precisión: una copia con un indicador mal colocado se corrige
 B.push({ t0: B0.b12, t1: B0.b13, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); const fix = T.precision + 0.2, cfgR = P.chappeAt([[0, SW], [fix, SA]], t, 0.9), ok = t > fix + 0.9;
  txt(ctx, 'SEÑAL OBSERVADA', 290, 400, 34, C.blanco, { w: 800 }); txt(ctx, 'SEÑAL COPIADA', 790, 400, 34, C.blanco, { w: 800 }); miniTower(ctx, 290, 1230, 50, SA, {}); miniTower(ctx, 790, 1230, 50, cfgR, { colR: ok ? '#51CAD9' : '#E98165' });
  txt(ctx, ok ? '✓ IGUAL' : '✗ UN INDICADOR NO COINCIDE', 540, 1340, 44, ok ? '#51CAD9' : '#E98165', { w: 900 });
  title(ctx, 'PRECISIÓN MECÁNICA', t, B0.b12 + 0.2, B0.b13 + 0.2, {});
 }, sfx(k) { FX.etiqueta(k, B0.b12 + 0.5); FX.polea(k, T.precision + 0.2, 0.9, 0.8); FX.correcto(k, T.precision + 1.15); } });
 // 13 · el mensaje viaja sin mensajero: vista alta; la señal pasa de estación en estación
 const relay13 = (i) => B0.b13 + 0.6 + i * 0.95;
 B.push({ t0: B0.b13, t1: B0.b14, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, B0.b13, B0.b14), cam = C3([lerp(-6000, 6000, E.inOut(u)), 4200, lerp(-11000, -13000, u)], [lerp(14000, 22000, u), 0, 0], 900);
  land(ctx, cam, t, { cfg: (i) => P.chappeAt([[0, S0], [relay13(i), SA]], t), pins: (i) => t > relay13(i) + 0.6, los: 1, losLit: (i) => t > relay13(i + 1) });
  title(ctx, 'INFORMACIÓN SIN TRANSPORTE FÍSICO', t, B0.b13 + 0.2, B0.b14 + 0.2, { px: 40 }); lab(ctx, 'NADIE RECORRE EL CAMINO', null, 540, 1330, t, B0.b13 + 1.4, B0.b14 + 0.2, { col: C.oro, sub: 'se retransmite una forma, de torre en torre' });
 }, sfx(k) { for (let i = 0; i < 5; i++) { FX.polea(k, relay13(i), 0.8, 0.45); FX.etiqueta(k, relay13(i) + 0.6); } } });
 // 14 · más rápido que un mensajero a caballo (comparación conceptual, sin cifras)
 const relay14 = (i) => B0.b14 + 0.8 + i * 0.75;
 B.push({ t0: B0.b14, t1: B0.b15, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, B0.b14, B0.b15), rx = lerp(1500, 1720, u), rz = -2200 + 900 * Math.sin(rx / 5200), cam = C3([rx - 6, hz(rx, rz) + 2.6, rz - 9], [rx + 300, hz(rx + 300, rz) + 40, rz + 500], 900);
  land(ctx, cam, t, { cfg: (i) => P.chappeAt([[0, S0], [relay14(i), SA]], t), pins: (i) => t > relay14(i) + 0.5, los: 0.8, losLit: (i) => t > relay14(i + 1) });
  const p = cam.pr([rx, hz(rx, rz), rz]), q = cam.pr([rx, hz(rx, rz) + 1.6, rz]); if (p[2] > 1) P.horseRider(ctx, p[0], p[1], Math.max(20, p[1] - q[1]), t, { dir: 1 });
  title(ctx, 'MÁS RÁPIDO QUE UN MENSAJERO', t, B0.b14 + 0.2, B0.b15 + 0.2, { px: 46 }); lab(ctx, 'LA SEÑAL YA LLEGÓ', null, 540, 1330, t, relay14(4) + 0.6, B0.b15 + 0.2, { col: C.oro, sub: 'el jinete sigue en camino' }); recon(ctx, 'COMPARACIÓN CONCEPTUAL', t, B0.b14 + 0.4, relay14(4));
 }, sfx(k) { FX.galope(k, B0.b14 + 0.1, B0.b15 - B0.b14, 0.8); for (let i = 0; i < 5; i++) FX.etiqueta(k, relay14(i) + 0.5); } });
 // 15 · 1794 · París–Lille: mapa estilizado, trazado esquemático
 B.push({ t0: B0.b15, t1: B0.b16, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.fillStyle = '#2a2018'; ctx.fillRect(0, 0, W, HH); ctx.save(); ctx.beginPath(); ctx.roundRect(50, 380, 980, 980, 20); ctx.clip(); P.chappeMap(ctx, 540, 870, 1150, t, { u: win(t, T.paris - 0.2, T.lille + 0.3), n: 9 }); ctx.restore(); ctx.strokeStyle = 'rgba(226,208,171,0.7)'; ctx.lineWidth = 3; ctx.strokeRect(50, 380, 980, 980); P.engraveGrade(ctx, 0.35, t);
  title(ctx, '1794 · PARÍS–LILLE', t, B0.b15 + 0.2, B0.b16 + 0.2, {}); txt(ctx, 'trazado esquemático · estaciones sin ubicación exacta', 540, 1395, 32, 'rgba(245,247,246,0.85)', { w: 700 });
 }, sfx(k) { FX.mapa ? FX.mapa(k, B0.b15 + 0.2) : 0; for (let i = 0; i < 9; i++) k.play('blip', lerp(T.paris - 0.2, T.lille + 0.3, i / 8), { f: 700 + i * 60, dur: 0.05, gain: 0.15, minor: true }); } });
 // 16 · la desventaja: el cielo se cubre, el paisaje pierde contraste
 B.push({ t0: B0.b16, t1: B0.b17, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, B0.b16, B0.b17), st = sm(B0.b16, B0.b17, t), tp = TOP[1], cam = C3([tp[0] - 40 + 18 * u, tp[1] - 6, tp[2] + 26 - 10 * u], [tp[0] - 400, tp[1] - 20, tp[2] - 60], 900);
  land(ctx, cam, t, { cfg: () => SA, near: [9000, 300], storm: st * 0.8, fog: st * 0.3, drift: t * 3 }); title(ctx, 'UN PROBLEMA ENORME', t, B0.b16 + 0.2, B0.b17 + 0.2, {});
 }, sfx(k) { FX.viento(k, B0.b16, 2.6, 0.9); } });
 // 17 · niebla, lluvia intensa, noche: por el telescopio la torre A deja de distinguirse
 B.push({ t0: B0.b17, t1: B0.b18, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const fog = sm(T.niebla - 0.4, T.niebla + 0.4, t), rain = sm(T.lluvia, T.lluvia + 0.4, t) * (1 - sm(T.noche, T.noche + 0.6, t)), night = sm(T.noche - 0.2, T.noche + 0.8, t), o = { fog: Math.min(0.92, fog * 0.92), storm: 0.8, rain, night };
  ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); scopeView(ctx, 540, 860, 440, t, SA, Object.assign({ tower: 0 }, o)); if (fog > 0.2) P.fogFX(ctx, fog * 0.25, night);
  const k = t < T.lluvia - 0.1 ? 0 : t < T.noche - 0.1 ? 1 : 2; if (t > T.niebla - 0.3) { ctx.save(); txt(ctx, ['NIEBLA', 'LLUVIA INTENSA', 'NOCHE'][k], 540, 1380, 52, '#E98165', { w: 900, sh: 1 }); ctx.restore(); }
  title(ctx, 'SIN VISIBILIDAD, NO HAY TRANSMISIÓN', t, B0.b17 + 0.2, B0.b18 + 0.2, { px: 40 });
 }, sfx(k) { FX.viento(k, B0.b17, 5.5, 0.8); FX.lluviaFuerte(k, T.lluvia, T.noche - T.lluvia + 0.6, 0.7); } });
 // 18 · el telégrafo eléctrico (s. XIX): postes, cables y manipulador; otra tecnología, otra época
 B.push({ t0: B0.b18, t1: B0.b19, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const u = win(t, B0.b18, B0.b19), x = lerp(600, 1100, u), z = -2200 + 900 * Math.sin(x / 5200) - 12, cam = C3([x, hz(x, z) + 9, z], [x + 500, hz(x + 500, z) + 4, z + 120], 900);
  const L = (sky(ctx, {}), P.chappeLand(ctx, cam, t, { towers: TWR, near: [x, z + 60] })); P.telegraphPoles(ctx, cam, hz, t, { a: sm(B0.b18 + 0.2, B0.b18 + 1.0, t), pulse: ((t - B0.b18) * 0.45) % 1 }); void L;
  const pr = Math.floor(t * 4) % 3 === 0 ? 1 : 0; ctx.save(); ctx.globalAlpha = sm(B0.b18 + 0.6, B0.b18 + 1.1, t); ctx.fillStyle = 'rgba(17,27,35,0.85)'; ctx.beginPath(); ctx.roundRect(140, 1130, 800, 260, 24); ctx.fill(); P.telegraphKey(ctx, 540, 1270, 1.3, t, { press: pr }); txt(ctx, 'MANIPULADOR ELÉCTRICO · SIGLO XIX', 540, 1170, 32, C.blanco, { w: 800 }); ctx.restore();
  title(ctx, 'LLEGÓ EL TELÉGRAFO ELÉCTRICO', t, B0.b18 + 0.3, B0.b19 + 0.2, { px: 44 }); recon(ctx, 'OTRA TECNOLOGÍA · OTRA ÉPOCA', t, B0.b18 + 0.5, T.electrico + 1.6);
 }, sfx(k) { FX.saltoTiempo(k, B0.b18, 1.2, 0.5); FX.clicMorse(k, B0.b18 + 1.2, 10, 0.8); } });
 // 19 · una red antes de internet: vuelo alto sobre la cadena de estaciones
 B.push({ t0: B0.b19, t1: B0.b20, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const u = win(t, B0.b19, B0.b20), cam = C3([lerp(-3000, 2000, u), lerp(1500, 6500, E.inOut(u)), lerp(-6000, -15000, E.inOut(u))], [lerp(12000, 18000, u), 0, 0], 900);
  land(ctx, cam, t, { cfg: () => SA, pins: () => true, los: sm(B0.b19 + 0.5, B0.b19 + 1.5, t), losLit: () => true, drift: t });
  title(ctx, 'UNA RED ANTES DE INTERNET', t, B0.b19 + 0.3, B0.b20 + 0.2, {});
 }, sfx(k) { FX.viento(k, B0.b19, B0.b20 - B0.b19, 0.5); k.play('whoosh', B0.b19 + 0.3, { dur: 2.5, gain: 0.2 }); } });
 // 20 · cierre: luz cálida, una torre transmite su última señal, la cámara se aleja; ASOMBROTECA discreto
 B.push({ t0: B0.b20, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const u = win(t, B0.b20, DURATION), tp = TOP[2], cam = C3([tp[0] - lerp(26, 150, E.inOut(u)), tp[1] + lerp(2, 40, u), tp[2] + lerp(18, 110, E.inOut(u))], [tp[0], tp[1] - 1.5, tp[2]], 900);
  land(ctx, cam, t, { cfg: (i) => (i === 2 ? P.chappeAt([[0, SA], [B0.b20 + 1.0, SC]], t, 1.1) : SA), near: [18000, -200], dusk: 0.7, drift: t });
  const a = sm(T.internet - 0.6, T.internet, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(245,247,250,0.75)'; ctx.lineWidth = 2; const lw = 230 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 230); ctx.lineTo(540 + lw, 230); ctx.moveTo(540 - lw, 338); ctx.lineTo(540 + lw, 338); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 285, 54, C.blanco, { w: 800, ls: 10, sh: 1 }); ctx.restore(); }
 }, sfx(k) { FX.polea(k, B0.b20 + 1.0, 1.1, 0.7); FX.viento(k, B0.b20, DURATION - B0.b20, 0.4); FX.campana(k, T.internet + 0.1); FX.fin(k, T.end + 0.6); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['electricidad!', 'torres', 'Claude', 'Chappe.', 'brazos', 'móviles.', 'código.', 'telescopio.', 'copiaba', 'repetía', 'elevados.', 'precisión.', 'camino!', 'caballo.', '1794', 'París', 'Lille.', 'niebla,', 'noche,', 'eléctrico,', 'wifi,', 'red', 'internet!'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 600, gain: 0.006, a: 0.8, hold: DURATION - 2.2 }); },
  music(k) {
   MUS.piano(k, 0, B0.b5, { bpm: 70, gain: 0.8, strings: 0.6, chords: [['D3', 'F3', 'A3', 'D4'], ['A#2', 'D3', 'F3', 'A#3'], ['G2', 'A#2', 'D3', 'G3'], ['A2', 'C#3', 'E3', 'A3']] });
   MUS.pulso(k, B0.b5, B0.b13, { bpm: 96, gain: 0.66, chords: [['D3', 'F3', 'A3', 'D4'], ['C3', 'E3', 'G3', 'C4'], ['A#2', 'D3', 'F3', 'A#3'], ['A2', 'C#3', 'E3', 'A3']] });
   MUS.epica(k, B0.b13, B0.b16, { bpm: 88, gain: 0.72, drums: 0.5, strings: 1, ostinato: 0.5, chords: [['F2', 'C3', 'F3', 'A3'], ['C2', 'G2', 'C3', 'E3'], ['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3']] });
   MUS.piano(k, B0.b16, B0.b18, { bpm: 62, gain: 0.7, strings: 0.9, chords: [['D3', 'F3', 'A3', 'D4'], ['A#2', 'D3', 'F3', 'A#3'], ['G2', 'A#2', 'D3', 'G3'], ['A2', 'C#3', 'E3', 'A3']] });
   MUS.epica(k, B0.b18, DURATION, { bpm: 78, gain: 0.66, drums: 0.2, strings: 0.9, ostinato: 0.3, chords: [['F2', 'C3', 'F3', 'A3'], ['A#1', 'F2', 'A#2', 'D3'], ['C2', 'G2', 'C3', 'E3'], ['F2', 'C3', 'F3', 'A3']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { for (const k of Object.keys(window.FOTOS || {})) { IMG[k] = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = window.FOTOS[k]; }); } }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
