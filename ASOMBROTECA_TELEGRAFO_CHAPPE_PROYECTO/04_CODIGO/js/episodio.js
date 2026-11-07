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
 const seedAt = (t) => 3 + Object.values(B0).filter((b) => b <= t).length * 7;
 const land = (ctx, cam, t, o = {}) => { if (o.seed == null) o.seed = seedAt(t); sky(ctx, o); P.chappeLand(ctx, cam, t, Object.assign({ towers: TWR }, o)); const order = ST.map((p, i) => ({ i, d: cam.depth(p) })).sort((a, b) => b.d - a.d);
  for (const { i } of order) P.chappeTower(ctx, cam, ST[i], t, { cfg: o.cfg ? o.cfg(i, t) : S0, scope: 1, glow: o.glow ? o.glow(i, t) : 0 });
  if (o.los) { ctx.save(); ctx.globalAlpha *= o.los; ctx.setLineDash([14, 12]); ctx.lineWidth = 3; for (let i = 0; i < TOP.length - 1; i++) { const a = cam.pr(TOP[i]), b = cam.pr(TOP[i + 1]); if (a[2] < 2 || b[2] < 2) continue; ctx.strokeStyle = o.losLit && o.losLit(i, t) ? 'rgba(255,212,71,0.9)' : 'rgba(245,247,246,0.55)'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } ctx.restore(); }
  if (o.pins) for (let i = 0; i < TOP.length; i++) { const p = cam.pr([TOP[i][0], TOP[i][1] + 6, TOP[i][2]]); if (p[2] < 2) continue; const lit = o.pins(i, t); ctx.save(); if (lit) P.glow(ctx, p[0], p[1] - 30, 40, '255,212,71', 0.7); ctx.fillStyle = lit ? '#FFD447' : 'rgba(245,247,246,0.85)'; ctx.beginPath(); ctx.moveTo(p[0], p[1] - 10); ctx.lineTo(p[0] - 11, p[1] - 30); ctx.lineTo(p[0], p[1] - 50); ctx.lineTo(p[0] + 11, p[1] - 30); ctx.closePath(); ctx.fill(); ctx.font = '900 32px Nunito'; ctx.textAlign = 'center'; ctx.fillStyle = '#F5F7F6'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8; ctx.fillText(NAMES[i], p[0], p[1] - 76); ctx.restore(); }
 };
 const shotK = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++; const a = keys[i], b = keys[i + 1], u = E.inOut(win(t, a[0], b[0])), L2 = (p, q) => p.map((v, j) => lerp(v, q[j], u)); return C3(L2(a[1], b[1]), L2(a[2], b[2]), lerp(a[3] || 900, b[3] || 900, u)); };
 // vista por el telescopio: la torre A ampliada (cámara cercana equivalente con focal larga), bruma, borde de latón y viñeta
 const scopeView = (ctx, cx, cy, r, t, cfg, o = {}) => { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip(); ctx.translate(cx - 540, cy - 900); const tp = TOP[o.tower ?? 0], cam = C3([tp[0] + 150, tp[1] + 2, tp[2] + 8], [tp[0], tp[1] - 2.2, tp[2]], o.f || 7600);
  sky(ctx, Object.assign({ seed: 5 }, o)); P.chappeLand(ctx, cam, t, Object.assign({ towers: TWR, near: [TWR[o.tower ?? 0][0], TWR[o.tower ?? 0][1]], road: false }, o)); ctx.save(); ctx.globalAlpha *= cl(1 - 0.95 * (o.fog || 0)); P.chappeTower(ctx, cam, ST[o.tower ?? 0], t, { cfg, night: o.night }); ctx.restore(); ctx.setTransform(ctx.getTransform()); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip(); ctx.fillStyle = `rgba(205,218,222,${0.18 + 0.6 * (o.fog || 0)})`; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); if (o.rain) P.rainFX(ctx, t, o.rain); if (o.night) { ctx.fillStyle = `rgba(6,10,20,${0.5 * o.night})`; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); } const g = ctx.createRadialGradient(cx, cy, r * 0.62, cx, cy, r); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.85)'); ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); ctx.restore();
  ctx.save(); ctx.strokeStyle = '#a88a5c'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, TAU); ctx.stroke(); ctx.strokeStyle = '#5e4a30'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, r + 17, 0, TAU); ctx.stroke(); ctx.restore(); };
 // torre esquemática 2D (mismo modelo y misma geometría que la 3D) para diagramas
 const miniTower = (ctx, x, yb, s2, cfg, o = {}) => P.chappeMini(ctx, x, yb, s2, cfg, o);

 const B = [];
 // 1 · GANCHO — torre A en primer plano sobre su colina: sus brazos cambian; la cámara sigue su dirección visual hasta B, el operador de
 // B identifica la señal (telescopio) y B la copia; al alejarse aparecen más estaciones
 const ch1 = (i, t) => P.chappeAt([[0, S0], [[0.7, 4.5, 99, 99, 99][i], SA]], t);
 B.push({ t0: 0, t1: B0.b2, in: { type: 'cut' }, draw(ctx, t) {
  const cam = shotK([[0, [-26, TOP[0][1] - 7, 20], [0, TOP[0][1] - 4, 0], 900], [1.7, [-15, TOP[0][1] - 2, 11], [0, TOP[0][1] - 1, 0], 900], [2.5, [-12, TOP[0][1] + 2, 8], [9000, TOP[1][1], 300], 900], [3.7, [8955, TOP[1][1] + 1, 322], [9000, TOP[1][1] - 1.5, 300], 900], [4.9, [8950, TOP[1][1] + 2, 326], [9000, TOP[1][1] - 1, 300], 900], [B0.b2, [8600, TOP[1][1] + 260, 1500], [20000, ST[2][1], -100], 900]], t);
  land(ctx, cam, t, { cfg: ch1, near: t < 2.9 ? [0, 0] : [9000, 300], pins: t > 5.0 ? (i) => i <= 1 : null, los: sm(5.0, 5.6, t) * 0.8, losLit: (i) => i === 0 && t > 5.2 });
  const si = sm(3.75, 3.95, t) * (1 - sm(4.55, 4.75, t)); if (si > 0) { ctx.save(); ctx.globalAlpha = si; scopeView(ctx, 790, 560, 150, t, ch1(0, t), { tower: 0 }); txt(ctx, 'B OBSERVA A', 790, 760, 34, C.oro, { w: 900, sh: 1 }); ctx.restore(); }
  title(ctx, '¡MENSAJES SIN ELECTRICIDAD!', t, 0.25, 3.4, { px: 50 }); recon(ctx, 'RECONSTRUCCIÓN ANIMADA', t, 0.6, B0.b2);
 }, sfx(k) { FX.viento(k, 0, 6.2, 0.6); FX.polea(k, 0.7, 1.0, 0.9); k.play('whoosh', 2.4, { dur: 1.4, gain: 0.3 }); FX.telescopio(k, 3.75); FX.polea(k, 4.5, 1.0, 0.8); } });
 // 2 · Francia, finales del s. XVIII: vuelo sobre caminos, aldeas y colinas; línea de visión ESQUEMÁTICA entre estaciones
 B.push({ t0: B0.b2, t1: B0.b3, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, B0.b2, B0.b3), cam = C3([lerp(1500, 15000, E.inOut(u)), lerp(700, 520, u) + 120, lerp(-5200, -3800, u)], [lerp(9000, 24000, E.inOut(u)), 150, lerp(0, 200, u)], 900);
  land(ctx, cam, t, { cfg: (i) => SA, pins: () => true, los: sm(B0.b2 + 2.5, B0.b2 + 3.2, t), drift: t });
  title(ctx, 'FRANCIA · FINALES DEL SIGLO XVIII', t, B0.b2 + 0.3, B0.b2 + 4.2, { px: 44 }); lab(ctx, 'LÍNEA DE VISIÓN (ESQUEMA)', null, 540, 1330, t, B0.b2 + 3.2, B0.b3 + 0.2, { col: C.papel, sub: 'no es un rayo: el operador MIRA la torre vecina' });
 }, sfx(k) { FX.viento(k, B0.b2, B0.b3 - B0.b2, 0.5); FX.etiqueta(k, B0.b2 + 3.2); } });
 // 3 · Claude Chappe en su taller con un modelo del mecanismo + RETRATO (grabado)
 B.push({ t0: B0.b3, t1: B0.b4, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, B0.b3, B0.b4), cam = P.cam3([lerp(2.6, 1.3, E.inOut(u)), lerp(1.7, 1.45, u), lerp(2.8, 1.6, E.inOut(u))], [lerp(-0.3, 0, u), 1.15, 0], 1000), cfg = P.chappeAt([[0, S0], [B0.b3 + 0.8, SA]], t, 1.2);
  ctx.save(); P.workshop1790(ctx, cam, t, { cfg }); const lev = cam.pr([0.11, 0.86, 0.06]), wob = Math.sin(win(t, B0.b3 + 0.8, B0.b3 + 2.0) * Math.PI) * 8; bill(ctx, cam, [-0.62, 0, 0.3], 1.72, (X, Y, h) => P.figure18c(ctx, X, Y, h, t, { dir: 1, reach: [lev[0], lev[1] + wob] })); ctx.restore(); sepiaWarm(ctx, 0.25); vign(ctx, 0.4);
  P.floatPhoto(ctx, IMG.retrato, 770, 560, 360, t, T.chappe - 0.35, B0.b4 + 0.2, { tag: 'GRABADO HISTÓRICO', label: 'CLAUDE CHAPPE', sub: 'inventor francés', credit: 'L. Figuier, Les Merveilles de la science · dominio público', from: 1, rotY: -0.12 });
  recon(ctx, 'RECONSTRUCCIÓN ANIMADA', t, B0.b3 + 0.3, T.chappe - 0.4);
 }, sfx(k) { FX.madera(k, B0.b3 + 0.4, 3, 0.6); FX.polea(k, B0.b3 + 0.8, 1.0, 0.4); FX.revelar(k, T.chappe - 0.35); } });
 // 4 · ¿cómo funcionaba? una torre completa; la cámara asciende hacia el mecanismo + FOTO del modelo de museo
 B.push({ t0: B0.b4, t1: B0.b5, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = E.inOut(win(t, B0.b4, B0.b5 + 0.4)), cam = C3([lerp(-60, -34, u), ST[1][1] + lerp(6, 15, u), lerp(46, 26, u) + 300], [9000, ST[1][1] + lerp(7, 12.5, u), 300], 900);
  land(ctx, { ...cam }, t, { cfg: () => SA, near: [9000, 300] }); title(ctx, '¿CÓMO FUNCIONABA?', t, B0.b4 + 0.2, B0.b5 + 0.2, {});
  P.floatPhoto(ctx, IMG.museo, 800, 620, 330, t, B0.b4 + 0.3, B0.b5 + 0.4, { tag: 'MODELO CONSERVADO EN MUSEO', label: 'FOTO ACTUAL DE UN MODELO', sub: 'no es una foto de 1794', credit: 'Foto: Van Der Meulen Christofle · CC0', from: 1, rotY: -0.12 });
 }, sfx(k) { k.play('whoosh', B0.b4 + 0.1, { dur: 1.2, gain: 0.22 }); FX.revelar(k, B0.b4 + 0.3); } });
 // 5 · los brazos: regulador horizontal → gira el indicador izquierdo (resaltado) y se detiene → gira el derecho → combinación completa
 // → cambio coherente a otra combinación. Órbita cercana + GRABADO del mecanismo.
 const Z0 = { reg: 0, li: 0, ri: 0 }, k5 = [[0, Z0], [B0.b5 + 0.35, { reg: 0, li: 45, ri: 0 }], [B0.b5 + 1.45, SA], [B0.b5 + 2.9, SB]], cfg5 = (t) => P.chappeAt(k5, t, 0.95);
 B.push({ t0: B0.b5, t1: B0.b6, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, B0.b5, B0.b6), az = lerp(-0.55, 0.35, E.inOut(u)), tp = TOP[1], cam = C3([tp[0] + Math.cos(az) * 14, tp[1] + 0.8, tp[2] + Math.sin(az) * 14], [tp[0], tp[1] + 0.2, tp[2]], 1450);
  const hiL = t > B0.b5 + 0.2 && t < B0.b5 + 1.4, hiR = t > B0.b5 + 1.35 && t < B0.b5 + 2.5;
  sky(ctx, { seed: seedAt(t) }); P.chappeLand(ctx, cam, t, { towers: TWR, near: [9000, 300] }); P.chappeTower(ctx, cam, ST[1], t, { cfg: cfg5(t), scope: 1, colL: hiL ? '#F5C84C' : null, colR: hiR ? '#F5C84C' : null });
  title(ctx, 'BRAZOS MECÁNICOS', t, B0.b5 + 0.2, B0.b6 + 0.2, {}); lab(ctx, 'REGULADOR HORIZONTAL', null, 540, 1330, t, B0.b5 + 0.1, B0.b5 + 0.35, { col: C.oro }); lab(ctx, '1 · INDICADOR IZQUIERDO', null, 540, 1330, t, B0.b5 + 0.35, B0.b5 + 1.4, { col: C.oro, sub: 'gira sobre su eje y se detiene' }); lab(ctx, '2 · INDICADOR DERECHO', null, 540, 1330, t, B0.b5 + 1.45, B0.b5 + 2.5, { col: C.oro, sub: 'el otro brazo, independiente' }); lab(ctx, 'COMBINACIÓN COMPLETA', null, 540, 1330, t, B0.b5 + 2.5, B0.b6 + 0.2, { col: C.oro, sub: 'después, el regulador gira a otra' });
  P.floatPhoto(ctx, IMG.grabado, 800, 600, 330, t, T.brazos - 1.1, T.brazos + 0.9, { tag: 'GRABADO HISTÓRICO · 1868', label: 'MECANISMO DE CHAPPE', credit: 'L. Figuier, 1868 · dominio público', from: 1, rotY: -0.12 });
 }, sfx(k) { FX.polea(k, B0.b5 + 0.35, 0.95, 0.9); FX.polea(k, B0.b5 + 1.45, 0.95, 0.9); FX.polea(k, B0.b5 + 2.9, 0.95, 0.9); FX.revelar(k, T.brazos - 1.1); } });
 // 6 · cada posición era una señal: vista frontal constante, tres configuraciones mantenidas
 const K6 = [[0, S0], [B0.b6 + 0.35, SA], [B0.b6 + 1.95, SB], [B0.b6 + 3.55, SC]];
 B.push({ t0: B0.b6, t1: B0.b7, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const tp = TOP[1], cam = C3([tp[0] - 15, tp[1] + 0.6, tp[2] + 1.2], [tp[0], tp[1] - 0.6, tp[2]], 1150), cfg = P.chappeAt(K6, t, 0.9);
  land(ctx, cam, t, { cfg: (i) => (i === 1 ? cfg : SA), near: [9000, 300] });
  const k = t < K6[2][0] ? 0 : t < K6[3][0] ? 1 : 2, a = sm(K6[k + 1][0] + 0.8, K6[k + 1][0] + 1.0, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; txt(ctx, ['SEÑAL A', 'SEÑAL B', 'SEÑAL C'][k], 540, 380, 60, C.oro, { w: 900, sh: 1 }); txt(ctx, '(ilustrativa)', 540, 430, 32, C.blanco, { w: 700, sh: 1 }); ctx.restore(); }
  ctx.save(); ctx.fillStyle = 'rgba(17,27,35,0.78)'; ctx.beginPath(); ctx.roundRect(110, 1110, 860, 290, 24); ctx.fill(); [0, 1, 2].forEach((j) => { const on = t > K6[j + 1][0] + 0.8; ctx.globalAlpha = on ? 1 : 0.25; miniTower(ctx, 260 + j * 280, 1380, 13, [SA, SB, SC][j], { lit: j === k ? 1 : 0 }); }); ctx.restore();
  title(ctx, 'CADA POSICIÓN ERA UNA SEÑAL', t, B0.b6 + 0.2, B0.b7 + 0.2, { px: 46 }); lab(ctx, '196 SEÑALES · VOCABULARIO DE CHAPPE', null, 540, 520, t, T.codigo - 0.3, B0.b7 + 0.2, { col: C.papel, sub: 'según el Musée des Arts et Métiers' }); recon(ctx, 'A, B, C: ETIQUETAS DIDÁCTICAS', t, B0.b6 + 0.5, T.codigo - 0.4);
 }, sfx(k) { for (let j = 1; j < 4; j++) FX.polea(k, K6[j][0], 0.9, 0.8); } });
 // 7 · plano A: la estación A mantiene su señal; plano B: el telescopio del operador de B muestra EXACTAMENTE esa configuración
 B.push({ t0: B0.b7, t1: B0.b8, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const sw = B0.b7 + 1.4; if (t < sw) { const u = win(t, B0.b7, sw), tp = TOP[0], cam = C3([tp[0] - 30 + 6 * u, tp[1] - 6, tp[2] + 24 - 4 * u], [tp[0], tp[1] - 4, tp[2]], 900); land(ctx, cam, t, { cfg: () => SA, near: [0, 0] }); lab(ctx, 'ESTACIÓN A · SEÑAL FIJA', null, 540, 1330, t, B0.b7 + 0.2, sw, { col: C.oro }); }
  else { ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); const z = E.out(win(t, sw, sw + 0.6)); scopeView(ctx, 540, 860, lerp(120, 440, z), t, SA, { tower: 0 }); lab(ctx, 'LO QUE VE EL OPERADOR DE B', null, 540, 1360, t, sw + 0.3, B0.b8 + 0.2, { col: C.oro, sub: 'la misma posición de los brazos' }); }
  title(ctx, 'OBSERVACIÓN A DISTANCIA', t, B0.b7 + 0.2, B0.b8 + 0.2, {});
 }, sfx(k) { FX.viento(k, B0.b7, 1.5, 0.5); FX.telescopio(k, B0.b7 + 1.4); } });
 // 8 · interior (zoom guiado): del ojo del operador al telescopio, del telescopio al MANIPULADOR, por las cuerdas hasta los brazos;
 // después, por fuera, la torre B gira sus brazos hasta reproducir la señal observada
 const M8 = T.copiaba - 0.3, X8 = B0.b8 + 2.9;
 B.push({ t0: B0.b8, t1: B0.b9, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  if (t < X8) { ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); const man = P.chappeAt([[0, S0], [M8, SA]], t, 1.0), top = P.chappeAt([[0, S0], [M8 + 0.3, SA]], t, 1.0), moving = t > M8 && t < M8 + 1.4 ? 1 : 0, look = 1 - sm(B0.b8 + 0.5, B0.b8 + 0.9, t);
   const f1 = [760, 820], f2 = [560, 960], f3 = [540, 840], u1 = E.inOut(win(t, B0.b8 + 0.4, M8)), u2 = E.inOut(win(t, M8 + 0.5, X8 - 0.2)), fx = lerp(lerp(f1[0], f2[0], u1), f3[0], u2), fy = lerp(lerp(f1[1], f2[1], u1), f3[1], u2), zz = lerp(1.22, 1.0, u2);
   ctx.save(); ctx.translate(540, 900); ctx.scale(zz, zz); ctx.translate(-fx, -fy + (1 - u2) * 0); P.chappeSection(ctx, 40, 300, 1000, 1080, t, { cfg: top, man, look, moving }); ctx.restore();
   scopeView(ctx, 905, 470, 100, t, SA, { tower: 0 }); txt(ctx, 'LO QUE VE', 905, 600, 32, C.oro, { w: 800, sh: 1 });
   lab(ctx, '1 · OBSERVAR', null, 540, 1395, t, B0.b8 + 0.1, M8, { col: C.oro }); lab(ctx, '2 · REPETIR: MANIPULADOR → CUERDAS → BRAZOS', null, 540, 1395, t, M8, X8, { col: C.oro, px: 32 }); }
  else { const tp = TOP[1], u = win(t, X8, B0.b9), cam = C3([tp[0] - 24 + 4 * u, tp[1] - 4, tp[2] + 19], [tp[0], tp[1] - 2, tp[2]], 900); land(ctx, cam, t, { cfg: (i) => (i === 0 ? SA : i === 1 ? P.chappeAt([[0, S0], [M8 + 0.3, SA]], t, 1.0) : S0), near: [9000, 300] }); lab(ctx, 'B REPRODUCE LA SEÑAL', null, 540, 1330, t, X8 + 0.1, B0.b9 + 0.2, { col: C.oro, sub: 'la misma configuración que A' }); }
  title(ctx, 'COPIAR LA SEÑAL', t, B0.b8 + 0.2, B0.b9 + 0.2, { y: 200 });
 }, sfx(k) { FX.cuerda(k, M8, 0.8); FX.polea(k, M8 + 0.3, 1.0, 1); FX.madera(k, M8 + 1.2, 2, 0.5); } });
 // 9 · plano F: el telescopio de C muestra la torre B con la misma señal; C la copia; esquema A → B → C
 const C9 = B0.b9 + 1.5, D9 = T.repetia + 0.3;
 B.push({ t0: B0.b9, t1: B0.b11, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cfgC = P.chappeAt([[0, S0], [C9 + 0.3, SA]], t, 1.0);
  if (t < C9) { ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); scopeView(ctx, 540, 860, 430, t, SA, { tower: 1 }); lab(ctx, 'C OBSERVA A B', null, 540, 1360, t, B0.b9 + 0.2, C9, { col: C.oro, sub: 'otra estación, el mismo procedimiento' }); }
  else if (t < D9 + 0.4) { const tp = TOP[2], u = win(t, C9, D9 + 0.4), cam = C3([tp[0] - 24 + 5 * u, tp[1] - 4, tp[2] + 19], [tp[0], tp[1] - 2, tp[2]], 900); land(ctx, cam, t, { cfg: (i) => (i < 2 ? SA : i === 2 ? cfgC : S0), near: [18000, -200] }); lab(ctx, 'C REPRODUCE LA SEÑAL', null, 540, 1330, t, C9 + 0.2, D9 + 0.4, { col: C.oro }); }
  else { const sq = [D9 + 0.4, D9 + 0.4, D9 + 0.9]; P.relayPanorama(ctx, 0, 300, W, 1120, t, (i) => (i < 2 || t > sq[2] ? (i < 3 ? SA : S0) : S0), { n: 5, done: (i) => i < 2 || (i === 2 && t > sq[2]), los: 1, scale: 9 });
   ctx.save(); ctx.globalAlpha = sm(D9 + 0.4, D9 + 0.7, t); txt(ctx, 'A → B → C', 540, 430, 72, C.oro, { w: 900, sh: 1 }); txt(ctx, 'cada estación OBSERVA a la anterior y COPIA', 540, 505, 34, C.blanco, { w: 700, sh: 1 }); ctx.restore(); }
  title(ctx, 'REPETIR LA SEÑAL', t, B0.b9 + 0.2, D9 + 0.3, {});
 }, sfx(k) { FX.telescopio(k, B0.b9 + 0.2); FX.polea(k, C9 + 0.3, 1.0, 0.8); FX.etiqueta(k, D9 + 0.9); } });
 // 11 · puntos elevados: en el valle una colina tapa la vista (✗); la estación se coloca en la cima y la línea queda despejada
 B.push({ t0: B0.b11, t1: B0.b12, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#91B7D2'); g.addColorStop(1, '#e3ecef'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); P.chappeSky(ctx, { seed: 21 }); const yb = 1330, prof = (x) => yb - 330 * Math.exp(-(((x - 150) / 130) ** 2)) - 300 * Math.exp(-(((x - 930) / 130) ** 2)) - 210 * Math.exp(-(((x - 560) / 120) ** 2)) - 14 * Math.sin(x / 37);
  [[0.86, '#b7c6b6', 120], [0.92, '#9fb39b', 60]].forEach(([k, col, a], L) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, HH); for (let x = 0; x <= W; x += 10) ctx.lineTo(x, yb * k - a * Math.sin(x / (130 + L * 40) + L)); ctx.lineTo(W, HH); ctx.closePath(); ctx.fill(); });
  const hg = ctx.createLinearGradient(0, 900, 0, yb + 80); hg.addColorStop(0, '#8D9E7A'); hg.addColorStop(1, '#5f7a55'); ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(0, HH); for (let x = 0; x <= W; x += 6) ctx.lineTo(x, prof(x)); ctx.lineTo(W, HH); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.beginPath(); ctx.moveTo(560, prof(560)); for (let x = 560; x <= 700; x += 6) ctx.lineTo(x, prof(x)); ctx.lineTo(700, HH); ctx.lineTo(560, HH); ctx.closePath(); ctx.fill();
  for (const [tx, s2] of [[330, 16], [370, 12], [480, 14], [690, 15], [740, 11], [780, 13]]) { ctx.fillStyle = '#3f5a3c'; ctx.beginPath(); ctx.ellipse(tx, prof(tx) - s2 * 1.4, s2, s2 * 1.5, 0, 0, TAU); ctx.fill(); }
  const mv = E.inOut(win(t, T.s11 - 0.2, T.s11 + 0.8)), ax = lerp(360, 150, mv), L1 = miniTower(ctx, ax, prof(ax) + 2, 10, SA), L2 = miniTower(ctx, 930, prof(930) + 2, 10, SA);
  ctx.save(); ctx.setLineDash([14, 12]); ctx.lineWidth = 5; if (mv < 0.98) { const hx = 520, hy = prof(520) + 4; ctx.strokeStyle = 'rgba(233,129,101,0.95)'; ctx.globalAlpha = 1 - mv; ctx.beginPath(); ctx.moveTo(ax, L1.top); ctx.lineTo(hx, hy); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(hx - 22, hy - 22); ctx.lineTo(hx + 22, hy + 22); ctx.moveTo(hx + 22, hy - 22); ctx.lineTo(hx - 22, hy + 22); ctx.stroke(); }
  else { ctx.strokeStyle = '#F6F7F8'; ctx.globalAlpha = sm(T.s11 + 0.8, T.s11 + 1.2, t); ctx.beginPath(); ctx.moveTo(ax, L1.top); ctx.lineTo(930, L2.top); ctx.stroke(); } ctx.restore();
  lab(ctx, 'EN EL VALLE: LA COLINA TAPA LA VISTA', null, 540, 1395, t, B0.b11 + 0.3, T.s11 + 0.3, { col: '#E98165' }); lab(ctx, 'EN LA CIMA: VISTA DESPEJADA', null, 540, 1395, t, T.s11 + 0.9, B0.b12 + 0.2, { col: C.oro, sub: 'la línea es un esquema de visibilidad, no un cable' });
  title(ctx, 'LÍNEA DE VISIÓN', t, B0.b11 + 0.2, B0.b12 + 0.2, {});
 }, sfx(k) { FX.viento(k, B0.b11, 2.2, 0.5); FX.etiqueta(k, B0.b11 + 0.3); k.play('whoosh', T.s11 - 0.2, { dur: 0.9, gain: 0.2 }); FX.correcto(k, T.s11 + 0.9); } });
 // 12 · precisión: misma escala; solo cambia el indicador derecho; lupa sobre su articulación; ERROR → CORRECCIÓN
 B.push({ t0: B0.b12, t1: B0.b13, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  ctx.fillStyle = '#091B2B'; ctx.fillRect(0, 0, W, HH); const fix = T.precision + 0.1, cfgR = P.chappeAt([[0, SW], [fix, SA]], t, 0.9), ok = t > fix + 0.9;
  txt(ctx, 'SEÑAL OBSERVADA', 290, 400, 34, C.blanco, { w: 800 }); txt(ctx, 'SEÑAL COPIADA', 790, 400, 34, C.blanco, { w: 800 }); miniTower(ctx, 290, 1230, 46, SA, {}); const m2 = miniTower(ctx, 790, 1230, 46, cfgR, { colR: ok ? '#51CAD9' : '#E98165' });
  const jp = m2.toS(m2.G.e2), mz = sm(B0.b12 + 0.5, B0.b12 + 0.9, t) * (1 - sm(fix + 1.0, fix + 1.4, t)); if (mz > 0) { ctx.save(); ctx.globalAlpha = mz; ctx.strokeStyle = ok ? '#51CAD9' : '#E98165'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(jp[0], jp[1], 70, 0, TAU); ctx.stroke(); ctx.restore(); }
  txt(ctx, ok ? 'CORRECCIÓN: COINCIDEN' : 'ERROR: UN INDICADOR NO COINCIDE', 540, 1340, 44, ok ? '#51CAD9' : '#E98165', { w: 900 });
  title(ctx, 'PRECISIÓN MECÁNICA', t, B0.b12 + 0.2, B0.b13 + 0.2, {});
 }, sfx(k) { FX.etiqueta(k, B0.b12 + 0.5); FX.polea(k, T.precision + 0.1, 0.9, 0.8); FX.correcto(k, T.precision + 1.05); } });
 // 13 · A → B → C → D → E: cada estación observa a la anterior y copia; el resaltado amarillo solo marca el progreso
 const relay13 = (i) => B0.b13 + 0.5 + i * 1.0;
 B.push({ t0: B0.b13, t1: B0.b14, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); P.relayPanorama(ctx, 0, 330, W, 1080, t, (i) => P.chappeAt([[0, S0], [relay13(i), SA]], t, 0.7), { n: 5, done: (i) => t > relay13(i) + 0.7, los: 1, scale: 10 });
  title(ctx, 'INFORMACIÓN SIN TRANSPORTE FÍSICO', t, B0.b13 + 0.2, B0.b14 + 0.2, { px: 40 }); lab(ctx, 'NADIE RECORRE EL CAMINO', null, 540, 1395, t, B0.b13 + 1.4, B0.b14 + 0.2, { col: C.oro, sub: 'se retransmite una forma, de estación en estación' });
 }, sfx(k) { for (let i = 0; i < 5; i++) { FX.polea(k, relay13(i), 0.7, 0.5); FX.etiqueta(k, relay13(i) + 0.7); } } });
 // 14 · arriba: las estaciones retransmiten; abajo: el mensajero recorre físicamente el camino (comparación conceptual)
 const relay14 = (i) => B0.b14 + 0.6 + i * 0.75;
 B.push({ t0: B0.b14, t1: B0.b15, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); P.relayPanorama(ctx, 0, 300, W, 560, t, (i) => P.chappeAt([[0, S0], [relay14(i), SA]], t, 0.55), { n: 5, done: (i) => t > relay14(i) + 0.55, los: 1, scale: 6 });
  ctx.save(); ctx.beginPath(); ctx.rect(0, 880, W, 560); ctx.clip(); const g = ctx.createLinearGradient(0, 880, 0, 1440); g.addColorStop(0, '#91B7D2'); g.addColorStop(1, '#d8e4e8'); ctx.fillStyle = g; ctx.fillRect(0, 880, W, 560); const sc = (t - B0.b14) * 60;
  [[1150, '#9fb39b', 0.2], [1230, '#8D9E7A', 0.45], [1300, '#6F8965', 1]].forEach(([yy, col, pf]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 1440); for (let x = 0; x <= W; x += 10) ctx.lineTo(x, yy - 26 * Math.sin((x + sc * pf) / 120) - 10 * Math.sin((x + sc * pf) / 41)); ctx.lineTo(W, 1440); ctx.closePath(); ctx.fill(); });
  for (let i = 0; i < 9; i++) { const tx = ((i * 157 - sc * 1.0) % 1300 + 1300) % 1300 - 110; ctx.fillStyle = '#3f5a3c'; ctx.beginPath(); ctx.ellipse(tx, 1270 - 30, 18, 28, 0, 0, TAU); ctx.fill(); } ctx.fillStyle = '#b9a780'; ctx.fillRect(0, 1350, W, 24); P.horseRider(ctx, 420, 1366, 190, t, { dir: 1 }); ctx.restore();
  txt(ctx, 'ESTACIONES: SE COPIA UNA FORMA', 540, 420, 34, C.blanco, { w: 800, sh: 1 }); txt(ctx, 'MENSAJERO: HAY QUE RECORRER EL CAMINO', 540, 940, 34, C.blanco, { w: 800, sh: 1 });
  title(ctx, 'MÁS RÁPIDO QUE UN MENSAJERO', t, B0.b14 + 0.2, B0.b15 + 0.2, { px: 46 }); recon(ctx, 'COMPARACIÓN CONCEPTUAL', t, B0.b14 + 0.4, B0.b15);
 }, sfx(k) { FX.galope(k, B0.b14 + 0.1, B0.b15 - B0.b14, 0.8); for (let i = 0; i < 5; i++) FX.etiqueta(k, relay14(i) + 0.55); } });
 // 15 · 1794 · París–Lille: mapa estilizado, trazado esquemático
 B.push({ t0: B0.b15, t1: B0.b16, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.fillStyle = '#2a2018'; ctx.fillRect(0, 0, W, HH); ctx.save(); ctx.beginPath(); ctx.roundRect(50, 380, 980, 980, 20); ctx.clip(); const mz = lerp(1.25, 1, E.out(win(t, B0.b15, B0.b15 + 0.8))); ctx.translate(540, 870); ctx.scale(mz, mz); ctx.translate(-540, -870); P.chappeMap(ctx, 540, 880, 1250, t, { u: win(t, T.paris - 0.4, T.lille + 0.2), n: 9 }); ctx.restore(); { const a = 1 - sm(B0.b15, B0.b15 + 0.5, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; P.relayPanorama(ctx, 0, 330, W, 1080, t, () => SA, { n: 5, done: () => true, los: 1, scale: 10 }); ctx.restore(); } } ctx.strokeStyle = 'rgba(226,208,171,0.7)'; ctx.lineWidth = 3; ctx.strokeRect(50, 380, 980, 980); P.engraveGrade(ctx, 0.35, t);
  title(ctx, '1794 · PARÍS–LILLE', t, B0.b15 + 0.2, B0.b16 + 0.2, {}); txt(ctx, 'TRAZADO ESQUEMÁTICO · estaciones sin ubicación exacta', 540, 1395, 34, '#F6F7F8', { w: 800 });
 }, sfx(k) { FX.mapa ? FX.mapa(k, B0.b15 + 0.2) : 0; for (let i = 0; i < 9; i++) k.play('blip', lerp(T.paris - 0.2, T.lille + 0.3, i / 8), { f: 700 + i * 60, dur: 0.05, gain: 0.15, minor: true }); } });
 // 16 · la desventaja: el cielo se cubre, el paisaje pierde contraste
 B.push({ t0: B0.b16, t1: B0.b17, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, B0.b16, B0.b17), st = sm(B0.b16, B0.b17, t), tp = TOP[1], cam = C3([tp[0] - 40 + 18 * u, tp[1] - 6, tp[2] + 26 - 10 * u], [tp[0] - 400, tp[1] - 20, tp[2] - 60], 900);
  land(ctx, cam, t, { cfg: () => SA, near: [9000, 300], storm: st * 0.8, fog: st * 0.3, drift: t * 3 }); title(ctx, 'UN PROBLEMA ENORME', t, B0.b16 + 0.2, B0.b17 + 0.2, {});
 }, sfx(k) { FX.viento(k, B0.b16, 2.6, 0.9); } });
 // 17 · niebla, lluvia intensa, noche: por el telescopio la torre A deja de distinguirse
 B.push({ t0: B0.b17, t1: B0.b18, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const fog = sm(T.niebla - 0.4, T.niebla + 0.4, t), rain = sm(T.lluvia, T.lluvia + 0.4, t) * (1 - sm(T.noche, T.noche + 0.6, t)), night = sm(T.noche - 0.2, T.noche + 0.8, t), o = { fog: Math.min(0.92, fog * 0.92) * (1 - 0.75 * night), storm: 0.8, rain, night };
  ctx.fillStyle = '#111B23'; ctx.fillRect(0, 0, W, HH); scopeView(ctx, 540, 860, 440, t, SA, Object.assign({ tower: 0, seed: 31 }, o));
  const k = t < T.lluvia - 0.1 ? 0 : t < T.noche - 0.1 ? 1 : 2; if (t > T.niebla - 0.3) { ctx.save(); txt(ctx, ['NIEBLA', 'LLUVIA INTENSA', 'NOCHE'][k], 540, 1380, 52, '#E98165', { w: 900, sh: 1 }); ctx.restore(); }
  title(ctx, 'SIN VISIBILIDAD, NO HAY TRANSMISIÓN', t, B0.b17 + 0.2, B0.b18 + 0.2, { px: 40 });
 }, sfx(k) { FX.viento(k, B0.b17, 5.5, 0.8); FX.lluviaFuerte(k, T.lluvia, T.noche - T.lluvia + 0.6, 0.7); } });
 // 18 · primero el mecanismo óptico; transición de época; el telégrafo eléctrico: manipulador → circuito → hilo → receptor
 const E18 = B0.b18 + 1.3;
 B.push({ t0: B0.b18, t1: B0.b19, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  if (t < E18) { const tp = TOP[1], u = win(t, B0.b18, E18), cam = C3([tp[0] - 16 + 8 * u, tp[1] - 1, tp[2] + 12 - 4 * u], [tp[0], tp[1] - 0.5, tp[2]], 900); land(ctx, cam, t, { cfg: () => SA, near: [9000, 300] }); const w = sm(E18 - 0.5, E18, t); if (w > 0) { ctx.fillStyle = `rgba(164,123,84,${w})`; ctx.fillRect(0, 0, W, HH); } }
  else { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#3a2b1e'); g.addColorStop(1, '#1f1710'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const per = 1.6, ph = ((t - E18) % per) / per, press = ph < 0.35 ? 1 : 0, pulse = ph < 0.8 ? ph / 0.8 : null, recv = ph > 0.72 && ph < 0.95 ? 1 : 0;
   P.telegraphScene(ctx, 40, 380, 1000, 940, t, { press, pulse, recv }); lab(ctx, 'AQUÍ SÍ VIAJA UNA CORRIENTE ELÉCTRICA', null, 540, 1395, t, E18 + 0.4, B0.b19 + 0.2, { col: '#51CAD9', sub: 'otra tecnología, otra época (s. XIX)' }); }
  title(ctx, 'LLEGÓ EL TELÉGRAFO ELÉCTRICO', t, E18, B0.b19 + 0.2, { px: 44 });
 }, sfx(k) { FX.saltoTiempo(k, E18 - 0.5, 1.0, 0.5); for (let tt = E18; tt < B0.b19; tt += 1.6) { k.play('click', tt, { gain: 0.45 }); k.play('tock', tt + 1.18, { f: 900, gain: 0.3 }); } } });
 // 19 · una red antes de internet: vuelo alto sobre la cadena de estaciones
 B.push({ t0: B0.b19, t1: B0.b20, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const u = E.inOut(win(t, B0.b19, B0.b20)), tp = TOP[1], cam = C3([lerp(tp[0] - 30, -4000, u), lerp(tp[1] + 8, 6200, u), lerp(tp[2] + 25, -14000, u)], [lerp(tp[0], 18000, u), lerp(tp[1], 0, u), lerp(tp[2], 0, u)], 900), rl = (i) => B0.b19 + 1.2 + i * 0.8;
  land(ctx, cam, t, { cfg: (i) => P.chappeAt([[0, S0], [rl(i), SA]], t, 0.6), pins: (i) => t > rl(i) + 0.4, los: sm(B0.b19 + 0.8, B0.b19 + 1.6, t), losLit: (i) => t > rl(i + 1), near: u < 0.25 ? [9000, 300] : null, drift: t });
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
