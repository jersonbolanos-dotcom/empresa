// =====================================================================================================
// episodio.js — «Yakhchal: hielo en el desierto» · Asombroteca · Ep. 03 · V3 (retoques finales) · PLANTILLA v1.21.1 (yakhchal fiel a la fotografía)
// MODELO MAESTRO ÚNICO (P.YK + P.YK2, dm; x = este, z = sur): cúpula de perfil curvo medido sobre la fotografía de Meybod, vestíbulo al
// sur, depósito excavado con muro de contención, escalera tallada (lado de la entrada, fuera del hielo), sumidero y drenaje al norte,
// estanque histórico al NORTE del muro de sombra este–oeste, canal desde el oeste. Sombras y luz con el mismo vector solar.
// Cortes (3D y sección técnica) vistos desde el ESTE: sur a la izquierda, norte a la derecha.
// La FOTOGRAFÍA ACTUAL (Meybod, Ggia, CC BY-SA 3.0) es parte de la versión oficial: tarjeta → alineación con el modelo → fundido.
// Flechas naranjas = energía térmica (cualitativa). Reloj = voz original.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS, Y = P.YK, IMG = {};
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  imagina: SG(0).s, desertica: wt(0, 'desértica'), calor0: wt(0, 'calor'), y1: SG(1).s, hielo1: wt(1, 'hielo'), electricidad: wt(1, 'electricidad'),
  eso: SG(2).s, persia: wt(2, 'persia'), pero3: SG(3).s, como4: SG(4).s, frio4: wt(4, 'frío'), caluroso: wt(4, 'caluroso'),
  la5: SG(5).s, arquitectura: wt(5, 'arquitectura'), fisica: wt(5, 'física'), los6: SG(6).s, construcciones: wt(6, 'construcciones'), yakhchal: wt(6, 'yakhchal'),
  algunas7: SG(7).s, cupulas: wt(7, 'cúpulas'), materiales7: wt(7, 'materiales'), aislar: wt(7, 'aislar'), exterior7: wt(7, 'exterior'),
  pero8: SG(8).s, interesante: wt(8, 'interesante'), el9: SG(9).s, secreto: wt(9, 'secreto'), invierno9: wt(9, 'invierno'),
  en10: SG(10).s, noches: wt(10, 'noches'), frias: wt(10, 'frías'), col11: SG(11).s, agua11: wt(11, 'agua'), estanques: wt(11, 'estanques'), profundos: wt(11, 'profundos'),
  el12: SG(12).s, congelaba: wt(12, 'congelaba'), y13: SG(13).s, poco13: wt(13, 'poco', 1), capas: wt(13, 'capas'),
  despues: SG(14).s, cortaban: wt(14, 'cortaban'), bloques14: wt(14, 'bloques'), trasladaban: wt(14, 'trasladaban'), depositos: wt(14, 'depósitos'),
  y15: SG(15).s, ingenieria: wt(15, 'ingeniería'), el16: SG(16).s, almacenaba: wt(16, 'almacenaba'), protegidos: wt(16, 'protegidos'), sol16: wt(16, 'sol'),
  muchas: SG(17).s, excavados: wt(17, 'excavados'), tierra: wt(17, 'tierra'),
  sus18: SG(18).s, gruesas: wt(18, 'gruesas'), aislantes: wt(18, 'aislantes'), calor18: wt(18, 'calor'), interior18: wt(18, 'interior'),
  ademas: SG(19).s, sombra: wt(19, 'sombra'), temperaturas: wt(19, 'temperaturas'), asi: SG(20).s, el21: SG(21).s, derretia: wt(21, 'derretía'), lentamente: wt(21, 'lentamente'),
  y22: SG(22).s, invierno22: wt(22, 'invierno'), verano: wt(22, 'verano'), no23: SG(23).s, fabricar: wt(23, 'fabricar'), desierto23: wt(23, 'desierto'),
  habian: SG(24).s, aprovechar: wt(24, 'aprovechar'), frio24: wt(24, 'frío'), estacion: wt(24, 'estación'), meses: wt(24, 'meses'),
  conocias: SG(25).s, cuentanos: SG(26).s, asombroteca: wt(26, 'asombroteca'), end: A.speech_end,
 };
 const TB = { b2: T.y1 - 0.2, b3: T.eso - 0.2, b4: T.pero3 - 0.2, b5: T.la5 - 0.2, b6: T.los6 - 0.2, b7: T.algunas7 - 0.2, b8: T.pero8 - 0.2, b9: T.el9 - 0.2, b10: T.en10 - 0.2, b10b: T.col11 - 0.15, b11: T.el12 - 0.2, b12: T.despues - 0.2, b13: T.y15 - 0.2, b14: T.el16 - 0.2, b15: T.sus18 - 0.2, b16: T.ademas - 0.2, b17: T.asi - 0.2, b18: T.no23 - 0.2, b18b: T.habian - 0.2, b19: T.conocias - 0.2, b20: T.cuentanos - 0.2, b18x: T.y22 - 0.2 };

 // ---------------- utilidades ----------------
 const C = { oro: '#FFD447', blanco: '#F5F7F8', calor: '#FF8A3D', frio: '#7cc4e8', hielo: '#cfeaf4', noche: '#0d1b2e' };
 const title = (ctx, s, t, t0, o = {}) => P.eraLabel(ctx, s, 540, o.y || 200, o.px || 52, t, t0, o.era ?? 1, o);
 const pill = (ctx, s, x, y, t, t0, o = {}) => P.eraLabel(ctx, s, x, y, o.px || 36, t, t0, o.era ?? 1, o);
 const tag = (ctx, s, x, y, t, t0, o = {}) => { const a = sm(t0, t0 + 0.3, t) * (o.t1 ? 1 - sm(o.t1 - 0.3, o.t1, t) : 1); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `700 ${o.px || 32}px "IBM Plex Mono"`; const tw = ctx.measureText(s).width; ctx.fillStyle = 'rgba(11,20,36,0.88)'; ctx.fillRect(x - tw / 2 - 16, y - 26, tw + 32, 52); ctx.fillStyle = o.col || C.oro; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + 1); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.fillStyle = c; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
 const lead = (ctx, p, x1, y1, a, c = C.oro) => { if (!p || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], x1, E.out(a)), lerp(p[1], y1, E.out(a))); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, TAU); ctx.fill(); ctx.restore(); };
 const scrimTop = (ctx, a = 0.45) => { const g = ctx.createLinearGradient(0, 0, 0, 420); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 420); };
 const dimAll = (ctx, a) => { if (a > 0) { ctx.fillStyle = `rgba(8,12,18,${a})`; ctx.fillRect(0, 0, W, HH); } };
 const shot = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++; const a = keys[i], b = keys[i + 1], u = E.inOut(win(t, a[0], b[0])), L = (p, q) => p.map((v, j) => lerp(v, q[j], u)); return P.cam3(L(a[1], b[1]), L(a[2], b[2]), lerp(a[3] || 900, b[3] || 900, u)); };
 const SUN_SUMMER = P.ykSun(62, 200), SUN_WINTER = P.ykSun(34.6, 180), SUN_DUSK = P.ykSun(26, 240);
 const recon = (ctx, t, t0, o = {}) => tag(ctx, 'RECONSTRUCCIÓN HISTÓRICA', o.x || 540, o.y || 1365, t, t0, { col: C.frio, t1: o.t1 });
 // trabajador en 3D: pies en el punto del modelo (dm) y 17 dm de alto, escala tomada de la proyección
 const wk3 = (ctx, cam, foot, t, o) => { const a = cam.clip([foot], 1)[0], b = cam.clip([[foot[0], foot[1] + 17, foot[2]]], 1)[0]; if (!a || !b) return null; return P.persianWorker(ctx, a[0], a[1], a[1] - b[1], t, o); };
 // cámara este (norte a la DERECHA) usada para el exterior que se convierte en sección
 const CAM_E = (d = 430, f = 1000, ty = 80) => P.cam3([d, ty, 0], [0, ty, 0], f);
 const secFrom = (cam) => { const a = cam.clip([[0, 0, 0]], 1)[0], b = cam.clip([[0, Y.H, 0]], 1)[0]; return { ox: a[0], gy: a[1], s: (a[1] - b[1]) / Y.H }; };
 const sky = (ctx, night, warm = 0) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, P.mixc(warm ? '#e07a3a' : '#2f7fd6', '#060d1f', night)); g.addColorStop(0.6, P.mixc(warm ? '#f2b56b' : '#9cc8ea', '#14284a', night)); g.addColorStop(1, P.mixc('#e9d8b4', '#1d2a44', night)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 const snowflake = (ctx, x, y, r, c) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = Math.max(3, r * 0.12); ctx.lineCap = 'round'; for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.stroke(); } ctx.restore(); };
 const heatArrow = (ctx, x0, y0, x1, y1, a = 1, w = 8) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.calor; ctx.fillStyle = C.calor; ctx.lineWidth = w; ctx.lineCap = 'round'; const an = Math.atan2(y1 - y0, x1 - x0); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - Math.cos(an) * w * 1.6, y1 - Math.sin(an) * w * 1.6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - Math.cos(an - 0.5) * w * 3, y1 - Math.sin(an - 0.5) * w * 3); ctx.lineTo(x1 - Math.cos(an + 0.5) * w * 3, y1 - Math.sin(an + 0.5) * w * 3); ctx.closePath(); ctx.fill(); ctx.restore(); };

 const poly3s = (ctx, cam, pts, fill) => { const Q = cam.clip(pts, 1); if (Q.length < 3) return; ctx.beginPath(); Q.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };

 // ---------------- v1.21: utilidades de cámara, sol, trabajadores 3D y fotografía ----------------
 const W2 = P.ykWorld2, Y2 = P.YK2;
 const wk2 = (ctx, cam, foot, t, o = {}) => { const a = cam.clip([foot], 1)[0], b = cam.clip([[foot[0], foot[1] + 17, foot[2]]], 1)[0]; if (!a || !b) return null; let dir = o.dir ?? 1; if (o.toward) { const c2 = cam.clip([o.toward], 1)[0]; if (c2) dir = c2[0] < a[0] ? -1 : 1; } return P.persianWorker2(ctx, a[0], a[1], a[1] - b[1], t, { ...o, dir }); };
 const actor = (cam, foot, f) => ({ d: cam.depth([foot[0], foot[1] + 8, foot[2]]), f });
 const sunDisc = (ctx, cam, sun, a = 1, r = 64) => { const p = cam.clip([[cam.pos[0] + sun[0] * 9000, cam.pos[1] + sun[1] * 9000, cam.pos[2] + sun[2] * 9000]], 1)[0]; if (!p || a <= 0) return p; if (p[0] < -600 || p[0] > 1680 || p[1] < -600 || p[1] > 2500) return p; P.glow(ctx, p[0], p[1], r * 7, '255,214,140', 0.6 * a); ctx.fillStyle = `rgba(255,249,228,${a})`; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill(); return p; };
 const shimmer = (ctx, t, y0, a = 1, n = 9) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = 0.16 * a; ctx.strokeStyle = '#fff3d6'; ctx.lineWidth = 3; for (let k = 0; k < n; k++) { const yy = y0 + k * 14; ctx.beginPath(); for (let x = 0; x <= W; x += 16) { const v = Math.sin(x * 0.03 + t * 6 + k) * 4; x ? ctx.lineTo(x, yy + v) : ctx.moveTo(x, yy + v); } ctx.stroke(); } ctx.restore(); };
 const grade = (ctx, col, a, mode = 'soft-light') => { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = mode; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, HH); ctx.restore(); };
 const vign = (ctx, a = 0.35) => { const g = ctx.createRadialGradient(540, 900, 500, 540, 900, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 const kick = (ctx, num, s, t, t0, t1, sub) => P.ykKicker(ctx, num, s, t, t0, t1, { sub });
 const lab = (ctx, s, anchor, x, y, t, t0, t1, o = {}) => P.ykLabel(ctx, s, anchor, x, y, t, t0, t1, o);
 const reconB = (ctx, t, t0, t1) => P.ykRecon(ctx, t, t0, t1);
 const yearSun = (u) => P.ykSun(lerp(34.6, 80, Math.sin(Math.PI * cl(u)) ** 1.2) * 1, 180 + 18 * Math.sin(u * 3)); // mediodía: invierno → verano → invierno
 const SUN_HOT = P.ykSun(58, 205), SUN_W = P.ykSun(34.6, 180), SUN_PHOTO = P.ykSun(30, 160), SUN_EVE = P.ykSun(18, 250);
 const SKY_PHOTO = { skyTop: '#024393', skyMid: '#2f6fb5' };
 // Fotografía de Meybod alineada con el modelo: con la cámara MC la silueta del modelo coincide con la de la foto (cima y anchura a 0,45 H)
 const MC = P.cam3([300, 14, -30], [0, 80, 0], 1250);
 // encaje por mínimos cuadrados de la silueta medida en la foto (136 bordes) con la silueta del modelo vista desde MC: ≈ 10 px rms
 const photoXf = () => ({ x: -55.24, y: 550.25, s: 1.0957 });
 let FEATH = null; const feathered = () => { if (FEATH || !IMG.meybod) return FEATH; const im = IMG.meybod, c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); g.globalCompositeOperation = 'destination-in'; const gx = g.createLinearGradient(0, 0, c.width, 0); gx.addColorStop(0, 'rgba(0,0,0,0)'); gx.addColorStop(0.12, '#000'); gx.addColorStop(0.88, '#000'); gx.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gx; g.fillRect(0, 0, c.width, c.height); const gy = g.createLinearGradient(0, 0, 0, c.height); gy.addColorStop(0, 'rgba(0,0,0,0)'); gy.addColorStop(0.1, '#000'); gy.addColorStop(0.8, '#000'); gy.addColorStop(0.93, 'rgba(0,0,0,0)'); g.fillStyle = gy; g.fillRect(0, 0, c.width, c.height); FEATH = c; return c; };
 // tarjeta de la fotografía (marco fino, etiqueta FOTOGRAFÍA ACTUAL, pie y crédito); rect = {x,y,w,h} en pantalla; ui = alfa de rótulos
 const CARD = { x: 540 - 460, y: 760 - 303, w: 920, h: 606 };
 const drawCard = (ctx, img, R, ui, zoom = 1) => { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 36 * ui; ctx.shadowOffsetY = 14 * ui; ctx.fillStyle = `rgba(245,247,248,${0.92 * ui})`; ctx.beginPath(); ctx.roundRect(R.x - 5, R.y - 5, R.w + 10, R.h + 10, 24 * ui); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.save(); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 20 * ui); ctx.clip(); const dw = R.w * zoom, dh = R.h * zoom; ctx.drawImage(img, R.x - (dw - R.w) * 0.5, R.y - (dh - R.h) * 0.42, dw, dh); ctx.restore();
  if (ui > 0.01) { ctx.globalAlpha *= ui; ctx.font = '700 32px "IBM Plex Mono"'; const tg = 'FOTOGRAFÍA ACTUAL', tw = ctx.measureText(tg).width; ctx.fillStyle = 'rgba(11,20,36,0.92)'; ctx.beginPath(); ctx.roundRect(R.x + 18, R.y - 26, tw + 32, 50, 12); ctx.fill(); ctx.fillStyle = C.oro; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(tg, R.x + 34, R.y - 1);
   ctx.font = '800 40px Nunito'; const lbl = 'YAKHCHAL DE MEYBOD · IRÁN', lw = ctx.measureText(lbl).width; ctx.fillStyle = 'rgba(11,20,36,0.92)'; ctx.beginPath(); ctx.roundRect(540 - lw / 2 - 24, R.y + R.h + 24, lw + 48, 64, 32); ctx.fill(); ctx.fillStyle = C.blanco; ctx.textAlign = 'center'; ctx.fillText(lbl, 540, R.y + R.h + 57); ctx.font = '600 32px Nunito'; ctx.fillStyle = 'rgba(245,247,248,0.85)'; ctx.fillText('Foto: Ggia · CC BY-SA 3.0', 540, R.y + R.h + 126); }
  ctx.restore(); };

 const B = [];
 // 1 · GANCHO — macro del hielo (gotas de condensación) → retroceso rápido que revela el depósito de adobe → subida al desierto
 B.push({ t0: 0, t1: TB.b2, in: { type: 'cut' }, draw(ctx, t) {
  const u1 = win(t, 0.95, 2.75), u2 = win(t, 2.55, TB.b2);
  if (t < 3.15) { const cam = t < 2.55 ? shot([[0.95, [16, -30, 20], [-20, -31, 12], 900], [1.75, [120, -2, 46], [-12, -24, 6], 820], [2.75, [250, 46, 70], [-10, -6, 0], 820]], t) : shot([[2.55, [228, 40, 64], [-10, -8, 0], 820], [TB.b2, [900, 520, 640], [0, 40, 0], 900]], t);
   W2(ctx, cam, t, { sun: SUN_HOT, cut: { c: 0, ice: 0.9, warm: 0.5 } }); }
  if (t > 2.55) { const cam = shot([[2.55, [228, 40, 64], [-10, -8, 0], 820], [TB.b2, [900, 520, 640], [0, 40, 0], 900]], t), a = sm(2.75, 3.15, t); ctx.save(); ctx.globalAlpha = a; W2(ctx, cam, t, { sun: SUN_HOT, skyTop: '#2a78d4', skyMid: '#cfe0ea' }); const sp = sunDisc(ctx, cam, SUN_HOT, 1, 70); shimmer(ctx, t, 980, sm(3.0, 3.6, t)); grade(ctx, '#ffb060', 0.28 * a); ctx.restore(); if (sp) lab(ctx, 'CALOR INTENSO', [sp[0], sp[1]], 540, 340, t, T.calor0 - 0.1, TB.b2 + 0.2); }
  const mA = 1 - sm(0.95, 1.4, t); if (mA > 0) { ctx.save(); ctx.globalAlpha = mA; P.iceMacro2(ctx, t, { zoom: lerp(1.22, 0.8, E.in(win(t, 0, 1.4))), drip: win(t, 0.1, 1.3), warm: 0.75 }); ctx.restore(); }
  if (t > 1.2 && t < 3.0) reconB(ctx, t, 1.5, 2.9);
  vign(ctx, 0.3);
 }, sfx(k) { FX.hieloCrujir(k, 0.05, 1.0, 0.7); FX.goteo(k, 0.3, 3, 0.35, 5); k.play('whoosh', 0.95, { dur: 1.2, top: 1800, gain: 0.35 }); FX.viento(k, 2.6, TB.b2 - 2.4, 0.6); FX.calor(k, 2.8, 2.2); } });

 // 2 · BLOQUES DE HIELO SIN ELECTRICIDAD — la cámara baja hacia el vestíbulo, cruza la puerta y descubre el depósito
 B.push({ t0: TB.b2, t1: TB.b3, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const tc = TB.b2 + 1.55; if (t < tc) { const cam = shot([[TB.b2, [330, 150, 250], [0, 30, 60], 900], [tc, [0, 9, 128], [0, 9, 100], 900]], t); W2(ctx, cam, t, { sun: SUN_HOT }); sunDisc(ctx, cam, SUN_HOT, 1, 60); const d = sm(tc - 0.35, tc, t); if (d > 0) dimAll(ctx, d); }
  else { const cam = shot([[tc, [0, 34, 78], [-4, -18, 0], 700], [TB.b3, [10, 44, 70], [-8, -26, -10], 720]], t); ctx.fillStyle = '#1a140f'; ctx.fillRect(0, 0, W, HH); P.ykCutaway(ctx, cam, t, { c: 1e9, ice: 0.92, warm: 0.6, dim: 1.05, actors: [actor(cam, [-30, 0.2, 68], () => wk2(ctx, cam, [-30, 0.2, 68], t, { pose: 'stand', var: 1, dir: -1 }))] });
   const bm = ctx.createLinearGradient(540, 0, 540, 1500); bm.addColorStop(0, 'rgba(255,214,150,0.18)'); bm.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = bm; ctx.beginPath(); ctx.moveTo(380, 0); ctx.lineTo(700, 0); ctx.lineTo(860, 1500); ctx.lineTo(220, 1500); ctx.closePath(); ctx.fill(); dimAll(ctx, 1 - sm(tc, tc + 0.35, t)); vign(ctx, 0.45); }
  const e = sm(T.electricidad - 0.3, T.electricidad + 0.2, t) * (1 - sm(TB.b3 - 0.3, TB.b3, t)); if (e > 0) { ctx.save(); ctx.globalAlpha = e; ctx.fillStyle = 'rgba(10,16,26,0.7)'; ctx.beginPath(); ctx.roundRect(300, 260, 480, 96, 48); ctx.fill(); ctx.strokeStyle = C.blanco; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(352, 284); ctx.lineTo(352, 300); ctx.moveTo(376, 284); ctx.lineTo(376, 300); ctx.stroke(); ctx.beginPath(); ctx.roundRect(340, 298, 48, 28, 6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(364, 326); ctx.lineTo(364, 342); ctx.stroke(); ctx.strokeStyle = '#e8505b'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(334, 280); ctx.lineTo(394, 340); ctx.stroke(); txt(ctx, 'SIN ELECTRICIDAD', 580, 309, 36, C.blanco, { w: 800 }); ctx.restore(); }
 }, sfx(k) { k.play('whoosh', TB.b2 + 0.1, { dur: 1.4, top: 900, gain: 0.3 }); k.noise(TB.b2 + 1.55, { dur: TB.b3 - TB.b2 - 1.4, color: 'brown', filter: 'lowpass', f: 300, gain: 0.05, a: 0.4, hold: 2 }); FX.hieloCrujir(k, T.hielo1 - 0.1, 1.2, 0.7); FX.goteo(k, TB.b2 + 2.0, 4, 0.3, 4); FX.tachado(k, T.electricidad); } });

 // 3 · ANTIGUA PERSIA — el complejo en su paisaje: pueblo, montañas, luz cálida
 B.push({ t0: TB.b3, t1: TB.b4, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = shot([[TB.b3, [-520, 140, -330], [0, 60, 80], 900], [TB.b4, [-440, 120, -280], [0, 66, 60], 920]], t); W2(ctx, cam, t, { sun: P.ykSun(24, 225), town: true, skyMid: '#f0c890' }); sunDisc(ctx, cam, P.ykSun(24, 225), 0.8, 50); grade(ctx, '#ffa860', 0.3); vign(ctx, 0.3);
  kick(ctx, 'IRÁN', 'ANTIGUA PERSIA', t, T.persia - 0.5, TB.b4 + 0.2);
 }, sfx(k) { FX.viento(k, TB.b3, TB.b4 - TB.b3, 0.5); FX.aparece(k, T.persia - 0.4, 500); } });

 // 4 · ¿CÓMO? — un bloque al sol sobre la arena: se funde y deja un charco (contraste hielo / calor)
 B.push({ t0: TB.b4, t1: TB.b5, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, TB.b4, TB.b5), cam = P.cam3([lerp(40, 26, u), lerp(10, 8, u), lerp(34, 28, u)], [0, 3.6, 0], 1100), sun = P.ykSun(60, 210);
  const sk = ctx.createLinearGradient(0, 0, 0, HH); sk.addColorStop(0, '#2a78d4'); sk.addColorStop(0.5, '#d9e6ea'); sk.addColorStop(1, '#efd9a8'); ctx.fillStyle = sk; ctx.fillRect(0, 0, W, HH); const sp = sunDisc(ctx, cam, sun, 1, 90);
  const G = 3000; P.box3(ctx, cam, -G, G, -1, 0, -G, G, '#dcbc8a', {}); const R = H.rng(5); for (let i = 0; i < 40; i++) { const x = R.range(-160, 160), z = R.range(-200, 60), s = R.range(2, 8); P.box3(ctx, cam, x - s, x + s, 0, 0.05, z - s * 0.4, z + s * 0.4, R() > 0.5 ? '#cfae7f' : '#e4c99a', {}); }
  const m = sm(T.como4, TB.b5, t) * 0.75, pr = 6 + m * 9; { const pts = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * TAU, rr = pr * (1 + 0.15 * Math.sin(a * 3 + 1)); pts.push([rr * Math.cos(a) * 1.2, 0.06, rr * Math.sin(a)]); } const Q = cam.clip(pts, 1); if (Q.length > 2) { ctx.beginPath(); Q.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = 'rgba(90,70,45,0.45)'; ctx.fill(); ctx.fillStyle = `rgba(150,200,225,${0.25 + 0.3 * m})`; ctx.fill(); } }
  const sh = P.ykShadow([4, 7, 3], sun); poly3s(ctx, cam, [[-4, 0.07, -3], [4, 0.07, -3], [sh[0] + 4, 0.07, sh[2] + 3], [sh[0] - 4, 0.07, sh[2] - 3]], 'rgba(60,40,20,0.3)');
  P.iceBox3(ctx, cam, -4, 4, 0.08, 7, -3, 3, { seed: 9, melt: m });
  const dr = sm(T.frio4, T.frio4 + 0.4, t); if (dr > 0) { const p0 = cam.clip([[0, 0.1, 3.2]], 1)[0]; if (p0) { for (let k = 0; k < 3; k++) { const ph = ((t * 1.3 + k * 0.33) % 1); ctx.fillStyle = `rgba(180,225,245,${0.8 * dr * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(p0[0] + (k - 1) * 70, p0[1] - 60 + ph * 70, 7, 10, 0, 0, TAU); ctx.fill(); } } }
  shimmer(ctx, t, 1060, 1, 12); grade(ctx, '#ffb060', 0.22); vign(ctx, 0.3);
  if (sp) lab(ctx, 'AL SOL SE FUNDE', null, 540, 1300, t, T.caluroso - 0.2, TB.b5 + 0.2);
 }, sfx(k) { k.play('whoosh', TB.b4 + 0.05, { dur: 0.4, top: 1600, gain: 0.25 }); FX.calor(k, T.como4, 3.5); FX.goteo(k, T.frio4 + 0.3, 6, 0.4, 3); } });

 // 5 · ARQUITECTURA Y FÍSICA — exterior (este) que se convierte, con un barrido, en la sección técnica alineada
 B.push({ t0: TB.b5, t1: TB.b6, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, TB.b5, TB.b6), cam = P.cam3([lerp(560, 470, E.inOut(u)), 75, lerp(-40, 0, E.inOut(u))], [0, 75, 0], 1000), sun = P.ykSun(48, 190);
  W2(ctx, cam, t, { sun }); const sec = secFrom(cam), wx = W * E.inOut(win(t, T.arquitectura - 0.6, T.arquitectura + 0.4));
  if (wx > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, wx, HH); ctx.clip(); const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#0f2a44'); g.addColorStop(1, '#1d3a58'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); P.ykSection2(ctx, sec.ox, sec.gy, sec.s, t, { flip: true, ice: 0.85, heat: sm(T.fisica - 0.2, T.fisica + 0.4, t), grad: sm(T.fisica, T.fisica + 0.8, t), sun, tint: 1 }); ctx.restore(); ctx.fillStyle = C.oro; ctx.fillRect(wx - 3, 0, 6, HH); }
  const sp = secFrom(cam); const wallP = [sp.ox - ((P.ykR2(70) + P.ykRin2(70)) / 2) * sp.s, sp.gy - 70 * sp.s];
  lab(ctx, 'ARQUITECTURA', wallP, 70, 330, t, T.arquitectura, TB.b6 + 0.2, { al: 'left', sub: 'forma, espesor y materiales' });
  lab(ctx, 'FÍSICA', [sp.ox + (P.ykR2(110) + 40) * sp.s, sp.gy - 114 * sp.s], 1010, 470, t, T.fisica, TB.b6 + 0.2, { al: 'right', sub: 'cómo viaja el calor', col: C.calor });
 }, sfx(k) { k.play('swish', T.arquitectura - 0.5, { dur: 0.8, gain: 0.4 }); FX.aparece(k, T.arquitectura - 0.1, 480); FX.aparece(k, T.fisica - 0.1, 620); FX.calor(k, T.fisica, 1.4); } });

 // 6 · YAKHCHAL — la FOTOGRAFÍA ACTUAL (tarjeta grande con marco fino) con un acercamiento lento
 B.push({ t0: TB.b6, t1: TB.b7, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = P.cam3([300, 14, -30], [0, 80, 0], 1250); W2(ctx, cam, t, { sun: SUN_PHOTO, ...SKY_PHOTO }); dimAll(ctx, 0.62);
  const a = sm(TB.b6 + 0.1, TB.b6 + 0.6, t), e = E.out(sm(TB.b6 + 0.1, TB.b6 + 0.9, t)); if (IMG.meybod && a > 0) { ctx.save(); ctx.globalAlpha = a; const R = { x: CARD.x, y: CARD.y + (1 - e) * 24, w: CARD.w, h: CARD.h }; drawCard(ctx, IMG.meybod, R, 1, lerp(1.0, 1.07, E.inOut(win(t, TB.b6, TB.b7)))); ctx.restore(); }
  const ya = sm(T.yakhchal - 0.25, T.yakhchal + 0.3, t); if (ya > 0) { ctx.save(); ctx.globalAlpha = ya; txt(ctx, 'YAKHCHAL', 540, 1292, 84, C.blanco, { w: 900, ls: 8 }); ctx.fillStyle = C.oro; ctx.fillRect(540 - 120 * E.out(ya), 1342, 240 * E.out(ya), 5); txt(ctx, '«pozo de hielo» en persa', 540, 1388, 36, 'rgba(245,247,248,0.85)', { w: 600 }); ctx.restore(); }
 }, sfx(k) { FX.viento(k, TB.b6, TB.b7 - TB.b6, 0.35); k.play('shutter', TB.b6 + 0.2, { gain: 0.3 }); FX.sello(k, T.yakhchal - 0.2); } });

 // 7 · DE LA FOTO AL MODELO — la foto se amplía hasta alinearse con el modelo, se funde en la reconstrucción, la cámara orbita y el
 // corte revela el interior (pared gruesa, cámara, depósito); el calor exterior choca con la envolvente
 const tA = TB.b7, tB = TB.b7 + 0.6, tM0 = T.cupulas - 0.3, tM1 = T.cupulas + 0.15, tO = T.cupulas + 0.3;
 B.push({ t0: TB.b7, t1: TB.b8, in: { type: 'cut' }, draw(ctx, t) {
  const cutC = lerp(Y.R0 + 4, 0, E.inOut(win(t, T.aislar - 0.4, T.aislar + 0.9))), cut = t > T.aislar - 0.4 ? { c: cutC, ice: 0.9 } : null;
  const cam = t < tO ? MC : shot([[tO, MC.pos, MC.tgt, 1250], [T.aislar - 0.2, [300, 60, 120], [0, 55, 0], 1000], [T.exterior7, [270, 120, 30], [0, 25, 0], 900], [TB.b8, [280, 130, 10], [0, 22, 0], 880]], t);
  W2(ctx, cam, t, { sun: SUN_PHOTO, ...SKY_PHOTO, cut }); const dome = cam.clip([[0, Y.H, 0]], 1)[0];
  const pa = 1 - sm(tM0, tM1, t); if (IMG.meybod && pa > 0) { const X = photoXf(MC), e = E.inOut(win(t, tA, tB)), fx = { x: lerp(CARD.x - (CARD.w * 0.035), X.x, e), y: lerp(CARD.y - CARD.h * 0.03, X.y, e), w: lerp(CARD.w * 1.07, 1080 * X.s, e), h: lerp(CARD.h * 1.07, 710 * X.s, e) };
   ctx.save(); ctx.globalAlpha = pa; if (e < 1) { dimAll(ctx, 0.62 * (1 - e)); } const ui = 1 - sm(tA, tA + 0.3, t); if (e < 0.999) { ctx.save(); ctx.beginPath(); ctx.roundRect(fx.x, fx.y, fx.w, fx.h, 20 * (1 - e)); ctx.clip(); ctx.drawImage(IMG.meybod, fx.x, fx.y, fx.w, fx.h); ctx.restore(); ctx.globalAlpha = pa * (1 - e); drawCard(ctx, IMG.meybod, { x: fx.x, y: fx.y, w: fx.w, h: fx.h }, ui, 1); ctx.globalAlpha = pa; ctx.globalAlpha = pa * e; ctx.drawImage(feathered(), fx.x, fx.y, fx.w, fx.h); } else ctx.drawImage(feathered(), fx.x, fx.y, fx.w, fx.h); ctx.restore();
   const la = sm(tB - 0.1, tB + 0.2, t) * pa; if (la > 0) { ctx.save(); ctx.globalAlpha = la; ctx.font = '700 32px "IBM Plex Mono"'; ctx.fillStyle = 'rgba(11,20,36,0.85)'; const s1 = 'FOTOGRAFÍA ACTUAL', w1 = ctx.measureText(s1).width; ctx.beginPath(); ctx.roundRect(64, 1330, w1 + 32, 50, 12); ctx.fill(); ctx.fillStyle = C.oro; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s1, 80, 1356); ctx.restore(); } }
  if (t > tM0) { const ga = sm(tM0 - 0.25, tM0, t) * (1 - sm(tM1, tM1 + 0.35, t)); if (ga > 0 && dome) { ctx.save(); ctx.globalAlpha = ga; ctx.strokeStyle = C.oro; ctx.lineWidth = 4; ctx.setLineDash([14, 10]); ctx.beginPath(); for (let y = 0; y <= Y.H; y += 4) { const p = cam.clip([[0, y, P.ykR2(y)]], 1)[0]; if (p) y ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } for (let y = Y.H; y >= 0; y -= 4) { const p = cam.clip([[0, y, -P.ykR2(y)]], 1)[0]; if (p) ctx.lineTo(p[0], p[1]); } ctx.stroke(); ctx.setLineDash([]); ctx.restore(); } reconB(ctx, t, tM1 - 0.2, T.aislar + 0.3); }
  if (cut) { const wP = cam.clip([[0, 40, (P.ykR2(40) + P.ykRin2(40)) / 2]], 1)[0], wN = cam.clip([[0, 40, -(P.ykR2(40) + P.ykRin2(40)) / 2]], 1)[0], ch = cam.clip([[0, 90, 0]], 1)[0];
   lab(ctx, 'PARED GRUESA DE ADOBE', wN, 1010, 300, t, T.aislar + 0.5, TB.b8 + 0.2, { al: 'right' }); lab(ctx, 'INTERIOR PROTEGIDO', ch, 70, 420, t, T.aislar + 0.9, TB.b8 + 0.2, { al: 'left', col: C.frio });
   const ha = sm(T.exterior7 - 0.3, T.exterior7 + 0.3, t); if (ha > 0) for (const [y, sg] of [[30, 1], [80, 1], [130, 1], [40, -1], [100, -1]]) { const p1 = cam.clip([[0, y, sg * (P.ykR2(y) + 2)]], 1)[0], p0 = cam.clip([[0, y + 10, sg * (P.ykR2(y) + 46)]], 1)[0]; if (p0 && p1) heatArrow(ctx, p0[0], p0[1], p1[0], p1[1], ha, 7); } }
  vign(ctx, 0.25);
 }, sfx(k) { k.play('whoosh', TB.b7 + 0.05, { dur: 0.7, top: 1200, gain: 0.3 }); k.play('sparkle', tM0, { gain: 0.25 }); k.play('swish', T.aislar - 0.4, { dur: 0.9, gain: 0.45 }); FX.etiqueta(k, T.aislar + 0.5); FX.etiqueta(k, T.aislar + 0.9); FX.calor(k, T.exterior7 - 0.2, 1.6); } });

 // 8 · LO INTERESANTE — la cámara se eleva: el complejo completo (estanque al norte del muro, canal desde el oeste)
 B.push({ t0: TB.b8, t1: TB.b9, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = shot([[TB.b8, [420, 120, 80], [0, 30, 60], 900], [TB.b9, [820, 760, -620], [0, 0, 120], 860]], t); const w = W2(ctx, cam, t, { sun: P.ykSun(30, 215), town: true }); grade(ctx, '#ffb070', 0.18);
  lab(ctx, 'ESTANQUE', w.pondC, 300, 1240, t, TB.b8 + 0.7, TB.b9 + 0.25, { al: 'center', col: C.frio }); lab(ctx, 'MURO DE SOMBRA', w.wallC, 760, 1180, t, TB.b8 + 0.9, TB.b9 + 0.25); lab(ctx, 'DEPÓSITO', w.dome && w.dome.top, 720, 520, t, TB.b8 + 1.1, TB.b9 + 0.25); P.ykCompass(ctx, cam, 960, 300, 40);
 }, sfx(k) { k.play('whoosh', TB.b8 + 0.1, { dur: 1.6, top: 700, gain: 0.25 }); for (let i = 0; i < 3; i++) FX.etiqueta(k, TB.b8 + 0.7 + i * 0.2); } });

 // 9 · INVIERNO — cae la noche sobre el complejo; el año avanza hacia el invierno
 B.push({ t0: TB.b9, t1: TB.b10, in: { type: 'cut' }, draw(ctx, t) {
  const n = E.inOut(win(t, TB.b9 + 0.2, TB.b10)), cam = shot([[TB.b9, [820, 760, -620], [0, 0, 120], 860], [TB.b10, [700, 420, -380], [0, 0, 180], 900]], t); W2(ctx, cam, t, { sun: P.ykSun(lerp(30, 4, n), 235), night: n * 0.85, town: true }); grade(ctx, '#ffb070', 0.18 * (1 - n));
  kick(ctx, '01', 'INVIERNO', t, T.invierno9 - 0.3, TB.b11 - 0.3, 'el frío de la noche');
 }, sfx(k) { FX.saltoTiempo(k, T.secreto, 1.4, 0.5); k.noise(T.invierno9, { dur: TB.b10 - T.invierno9 + 0.5, color: 'pink', filter: 'bandpass', f: 600, q: 0.6, gain: 0.03, a: 0.6, hold: 0.5 }); } });

 // 10 · NOCHES FRÍAS — de noche, junto al estanque vacío; solo en regiones con noches suficientemente frías
 B.push({ t0: TB.b10, t1: TB.b10b, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = shot([[TB.b10, [-320, 170, 60], [20, 0, 250], 900], [TB.b10b, [-360, 140, 90], [0, 0, 250], 900]], t); W2(ctx, cam, t, { sun: SUN_W, night: 0.9 });
  kick(ctx, '01', 'INVIERNO', t, TB.b10 - 1, TB.b11 - 0.3, 'el frío de la noche'); lab(ctx, 'NOCHES FRÍAS Y DESPEJADAS', null, 540, 1250, t, T.frias - 0.4, TB.b10b + 0.2, { sub: 'solo en algunas regiones', col: C.frio });
 }, sfx(k) { k.noise(TB.b10, { dur: TB.b10b - TB.b10, color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.03, a: 0.6, hold: 3 }); FX.etiqueta(k, T.frias - 0.4); } });

 // 10b · AGUA EN ESTANQUES POCO PROFUNDOS — el canal del oeste llena el estanque; trabajadores con rastrillo reparten la lámina
 B.push({ t0: TB.b10b, t1: TB.b11, in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  const cam = shot([[TB.b10b, [-470, 50, 150], [-120, 0, 245], 900], [TB.b11, [-380, 34, 170], [-60, 0, 245], 900]], t), wa = E.inOut(win(t, T.agua11 - 0.3, TB.b11 - 0.2));
  const act = [[-262, 0, 186, 0], [-150, 0, 186, 2]].map(([x, y, z, v]) => actor(cam, [x, y, z], () => wk2(ctx, cam, [x, y, z], t, { pose: 'rake', var: v, toward: [x + 40, 0, z + 40] })));
  W2(ctx, cam, t, { sun: SUN_W, night: 0.86, water: wa, actors: act });
  lab(ctx, 'POCO PROFUNDO', cam.clip([[-120, 0, 245]], 1)[0], 540, 520, t, T.profundos - 0.3, TB.b11 + 0.2, { sub: 'una lámina fina de agua', col: C.frio });
 }, sfx(k) { FX.agua(k, T.agua11 - 0.3, 2.4); FX.etiqueta(k, T.profundos - 0.3); } });

 // 11 · SE CONGELABA, CAPA A CAPA — ondas → pérdida de energía → cristales que se extienden → vista lateral del grosor → noches nuevas
 B.push({ t0: TB.b11, t1: TB.b12, in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  const tS = T.y13 - 0.1; if (t < tS) { const cam = shot([[TB.b11, [-60, 18, 200], [80, -2, 250], 760], [tS, [-48, 24, 196], [90, -1, 252], 800]], t), ia = win(t, TB.b11 + 0.45, tS + 0.05) * 0.98; W2(ctx, cam, t, { sun: SUN_W, night: 0.88, water: 1, ice: ia, ripple: 1 - sm(TB.b11, T.congelaba, t) });
   const la = sm(TB.b11 + 0.1, TB.b11 + 0.5, t) * (1 - sm(tS - 0.2, tS, t)); if (la > 0) { ctx.save(); for (let k = 0; k < 6; k++) { const ph = ((t * 0.55 + k * 0.19) % 1), x = 140 + k * 160, y0 = 1180 - ph * 380; ctx.globalAlpha = la * Math.sin(Math.PI * ph) * 0.8; heatArrow(ctx, x, y0, x + (k % 2 ? 10 : -10), y0 - 130, 1, 6); } ctx.restore(); }
   lab(ctx, 'EL AGUA PIERDE ENERGÍA', null, 540, 330, t, TB.b11 + 0.15, tS, { sub: 'hacia el cielo nocturno y el aire', col: C.calor }); lab(ctx, 'CRISTALES DE HIELO', cam.clip([[0, -1.3, 240]], 1)[0], 540, 520, t, T.congelaba + 0.1, tS, { col: C.frio }); }
  else { const ctx2 = ctx; const g = ctx.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, '#060d1f'); g.addColorStop(1, '#1d2a44'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const R = H.rng(31); for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(232,240,255,${0.3 + R() * 0.6})`; ctx.fillRect(R() * W, R() * 700, 2, 2); }
   const n1 = T.y13 + 1.05, n2 = T.capas - 0.2, nE = TB.b12 - 0.3; let n = 0, wa = 1, fz = 0, lbl = 'NOCHE 1'; if (t < n1) { fz = E.inOut(win(t, tS + 0.15, n1 - 0.1)); } else if (t < n2) { n = 1; wa = sm(n1, n1 + 0.25, t); fz = E.inOut(win(t, n1 + 0.3, n2 - 0.1)); lbl = 'NOCHE 2'; } else { const k = Math.min(3, Math.floor((t - n2) / ((nE - n2) / 3))); n = 2 + k; wa = sm(n2 + k * (nE - n2) / 3, n2 + k * (nE - n2) / 3 + 0.2, t); fz = E.inOut(cl(((t - n2) % ((nE - n2) / 3)) / ((nE - n2) / 3) * 1.4 - 0.3)); lbl = n >= 4 ? 'VARIAS NOCHES' : 'NOCHE ' + (n + 1); if (t > nE) { n = 5; wa = 0; } }
   const ps = P.ykPondSide(ctx, 150, 980, 780, 46, t, { n, water: wa, freeze: fz, loss: wa > 0 ? 1 - fz : 0, night: 0.9, maxN: 6 });
   tag(ctx, lbl, 540, 400, t, tS + 0.1, {}); txt(ctx, 'TIEMPO ACELERADO', 540, 470, 32, 'rgba(245,247,248,0.75)', { w: 700, f: '"IBM Plex Mono"' });
   lab(ctx, 'SE CONGELA DESDE ARRIBA', [700, ps.top + 6], 1000, 640, t, tS + 0.35, n1, { al: 'right', col: C.frio }); lab(ctx, 'CAPAS DE AGUA DE 5–10 CM', [300, ps.layerY(0)], 70, 1330, t, n1 - 0.2, TB.b12, { al: 'left', sub: 'En instalaciones documentadas', col: C.frio });
   if (t > nE - 0.4) lab(ctx, 'GROSOR PARA CORTAR', [800, ps.layerY(2.5)], 1010, 760, t, nE - 0.4, TB.b12 + 0.2, { al: 'right' }); }
 }, sfx(k) { FX.agua(k, TB.b11, 0.8); FX.escarcha(k, T.congelaba - 0.2, 1.8, 0.9); FX.hieloCrujir(k, T.congelaba + 0.5, 1.2, 0.6); for (let i = 0; i < 4; i++) FX.saltoTiempo(k, T.y13 + 0.1 + i * 0.85, 0.5, 0.3); FX.hieloCrujir(k, T.capas, 1.0, 0.8); } });

 // 12 · CORTAR Y TRASLADAR — barra en la junta, palanca, el bloque se separa, se levanta con esfuerzo; luego, a pie por el camino
 B.push({ t0: TB.b12, t1: TB.b13, in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  const tW = T.trasladaban - 0.1; if (t < tW) { const g = ctx.createLinearGradient(0, 0, 0, 1000); g.addColorStop(0, '#9fc3e0'); g.addColorStop(1, '#e8dcc0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
    ctx.fillStyle = '#cdb08a'; ctx.fillRect(0, 560, W, 300); ctx.strokeStyle = 'rgba(90,64,40,0.25)'; ctx.lineWidth = 2; for (let y = 580; y < 860; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const ps = P.ykPondSide(ctx, -100, 1120, 1280, 22, t, { n: 4, water: 0, grooves: [470, 591], cut: 1, maxN: 4 }), it = ps.iceTop;
    const pry = E.inOut(win(t, T.cortaban - 0.2, T.cortaban + 0.9)), sep = sm(T.cortaban + 0.4, T.cortaban + 0.9, t), lf = E.inOut(win(t, T.cortaban + 0.95, tW - 0.05));
    ctx.fillStyle = 'rgba(14,30,42,0.85)'; ctx.fillRect(370, it, 121, 88 + sep * 4);
    if (lf <= 0) { ctx.save(); ctx.translate(430.5, it + 44 - sep * 8); ctx.rotate(-0.04 * sep); P.iceSlab2(ctx, 0, 0, 121, 88, { seed: 5, top: 0 }); ctx.restore(); }
    const ck = sm(T.cortaban + 0.3, T.cortaban + 0.45, t) * (1 - sm(T.cortaban + 0.6, T.cortaban + 1.0, t)); if (ck > 0) { ctx.save(); ctx.globalAlpha = ck; ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(371, it + 4); ctx.lineTo(375, it + 30); ctx.lineTo(369, it + 58); ctx.lineTo(373, it + 86); ctx.stroke(); ctx.restore(); const u = win(t, T.cortaban + 0.4, T.cortaban + 1.0); if (u > 0 && u < 1) { const R = H.rng(77); for (let k = 0; k < 9; k++) { const vx = R.range(-90, 60), vy = R.range(-260, -140), x = 372 + vx * u, y = it + 4 + vy * u + 520 * u * u; if (y > it + 2) continue; ctx.fillStyle = `rgba(235,244,248,${0.9 * (1 - u)})`; ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x + 4, y); ctx.lineTo(x, y + 4); ctx.lineTo(x - 4, y); ctx.closePath(); ctx.fill(); } } }
    P.persianWorker2(ctx, 200, it, 470, t, { pose: 'pry', lift: pry, var: 0, tip: [61.6, 18] });
    if (lf > 0 || t > T.cortaban - 0.5) P.persianWorker2(ctx, 541, it, 470, t, { pose: 'lift', lift: lf, var: 2, dir: -1, surf: 32, block: { w: 44, h: 32 }, noBlock: lf <= 0 });
    lab(ctx, 'BARRA EN LA RANURA', [372, it + 30], 1010, 380, t, T.cortaban - 0.1, T.cortaban + 1.0, { al: 'right' }); lab(ctx, 'SE LEVANTA A MANO', null, 540, 1330, t, T.cortaban + 1.0, tW, {}); }
  else { const u = win(t, tW, TB.b13), carriers = [0, 1, 2].map((k) => ({ z: 186 - (t - tW) * 9 - k * 26, k })); const lead = 186 - (t - tW) * 9 - 26, cam = P.cam3([48, 20, lead + 26], [0, 9, lead - 26], 900);
   const act = carriers.map(({ z, k }) => actor(cam, [-4 + k * 3, 0.4, z], () => wk2(ctx, cam, [-4 + k * 3, 0.4, z], t, { pose: 'carry', ph: (t * 1.1 + k * 0.37) % 1, var: k, toward: [-4, 0.4, z - 20], block: { w: 44, h: 32 } })));
   W2(ctx, cam, t, { sun: SUN_W, water: 1, ice: 1, actors: act }); lab(ctx, 'HASTA EL DEPÓSITO', cam.clip([[0, 10, Y2.ent.z1]], 1)[0], 540, 380, t, T.depositos - 0.3, TB.b13 + 0.2, {}); }
 }, sfx(k) { FX.pico(k, T.cortaban - 0.1, 0.8); FX.hieloCrujir(k, T.cortaban + 0.5, 0.8, 0.8); k.play('stroke', T.cortaban + 1.0, { material: 'chalk', dur: 0.8, gain: 0.25 }); for (let i = 0; i < 3; i++) k.play('stroke', T.trasladaban + i * 0.65, { material: 'chalk', dur: 0.5, gain: 0.18 }); } });

 // 13 · LA VERDADERA INGENIERÍA — dentro: baja por la escalera tallada en el muro (lejos del hielo) y coloca el bloque en la pila
 B.push({ t0: TB.b13, t1: TB.b14, in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  const cam = shot([[TB.b13, [80, 64, -40], [-14, -14, 56], 1250], [TB.b14, [72, 52, -30], [-18, -26, 50], 1300]], t), C2 = { c: 0, ice: 0.52 };
  const d = E.inOut(win(t, TB.b13 + 0.2, T.ingenieria + 0.25)), kf = d * 5, k0 = Math.floor(kf), fr = kf - k0; const st = (k) => { const a = lerp(Y2.stair.a0, Y2.stair.a1, (k + 0.5) / 14), y = -(k + 1) * (Y.pitD / 14), r = P.ykPitR(y) + 1.5 - Y2.stair.w / 2; return [r * Math.cos(a), y, r * Math.sin(a)]; };
  const pA = st(k0), pB = st(k0 + 1), foot = [lerp(pA[0], pB[0], fr), fr < 0.5 ? pA[1] : pB[1], lerp(pA[2], pB[2], fr)], placing = t > T.ingenieria + 0.25;
  const pl = E.inOut(win(t, T.ingenieria + 0.3, TB.b14 - 0.2)); const act = [actor(cam, foot, () => { const a = cam.clip([foot], 1)[0], b = cam.clip([[foot[0], foot[1] + 17, foot[2]]], 1)[0]; if (!a || !b) return; const hpx = a[1] - b[1], stp = (Y.pitD / 14) / 17 * 170; const nb = cam.clip([pB], 1)[0], dr = nb && nb[0] < a[0] ? -1 : 1; const o2 = placing ? { pose: 'place', lift: 1 - pl, surf: -2, var: 1, block: { w: 44, h: 32 }, release: sm(TB.b14 - 0.35, TB.b14 - 0.1, t) } : { pose: 'descend', var: 1, ph: fr, block: { w: 44, h: 32 }, feet: fr < 0.5 ? [[-9, 0], [15, stp * E.inOut(fr * 2)]] : [[-9, -stp * (1 - E.inOut((fr - 0.5) * 2))], [15, 0]] }; P.persianWorker2(ctx, a[0], a[1], hpx, t, { ...o2, dir: placing ? -1 : dr }); })];
  ctx.fillStyle = '#1a140f'; ctx.fillRect(0, 0, W, HH); W2(ctx, cam, t, { sun: SUN_W, cut: { ...C2, actors: act } });
  kick(ctx, '02', 'EL DEPÓSITO', t, TB.b13 + 0.2, TB.b14 + 0.2); lab(ctx, 'ESCALERA EN EL MURO', cam.clip([st(4)], 1)[0], 70, 380, t, TB.b13 + 0.6, T.ingenieria + 0.6, { al: 'left', sub: 'fuera del hielo' });
 }, sfx(k) { for (let i = 0; i < 7; i++) k.play('stroke', TB.b13 + 0.3 + i * 0.33, { material: 'chalk', dur: 0.25, gain: 0.15 }); FX.bloque(k, TB.b14 - 0.3, 0.8); k.play('riser', TB.b13 + 0.2, { dur: 1.6, gain: 0.2 }); } });

 // 14 · PROTEGIDO DEL SOL, BAJO TIERRA — sol sobre la cúpula; la cámara baja por la zanja de corte hasta el fondo excavado
 B.push({ t0: TB.b14, t1: TB.b15, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const tc = T.excavados - 0.5; if (t < tc) { const cam = shot([[TB.b14, [560, 140, 120], [0, 70, 0], 900], [tc, [450, 100, 80], [0, 50, 0], 900]], t); W2(ctx, cam, t, { sun: SUN_HOT, rays: 0 }); const sp = sunDisc(ctx, cam, SUN_HOT, 1, 60); shimmer(ctx, t, 900, 0.7);
   const ra = sm(T.protegidos - 0.4, T.protegidos, t); if (ra > 0 && sp) { ctx.save(); ctx.globalAlpha = ra; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = 'rgba(255,212,71,0.9)'; ctx.lineWidth = 4; for (const y of [40, 90, 140]) { const p = cam.clip([[P.ykR2(y) * 0.7, y, P.ykR2(y) * 0.7]], 1)[0]; if (p) { ctx.beginPath(); ctx.moveTo(lerp(sp[0], p[0], 0.25), lerp(sp[1], p[1], 0.25)); ctx.lineTo(p[0], p[1]); ctx.stroke(); } } ctx.setLineDash([]); ctx.restore(); }
   lab(ctx, 'PROTEGIDO DEL SOL', null, 540, 1300, t, T.protegidos - 0.2, tc + 0.1, {}); }
  else { const cam = shot([[tc, [330, 120, 60], [0, 10, 0], 860], [TB.b15, [250, 34, 40], [-30, -40, 0], 780]], t); ctx.fillStyle = '#1a140f'; ctx.fillRect(0, 0, W, HH); const r = W2(ctx, cam, t, { sun: SUN_HOT, cut: { c: 0, ice: 0.88, melt: 0.05 } });
   lab(ctx, 'EXCAVADO BAJO TIERRA', cam.clip([[0, -Y.pitD * 0.6, -Y2.pitR0]], 1)[0], 1010, 360, t, T.excavados, TB.b15 + 0.2, { al: 'right' }); lab(ctx, 'MURO DE CONTENCIÓN', cam.clip([[0, -30, Y2.pitR0 + 2]], 1)[0], 70, 500, t, T.tierra - 0.2, TB.b15 + 0.2, { al: 'left', sub: 'revestido de adobe' }); lab(ctx, 'DRENAJE', cam.clip([[0, -Y.pitD, 0]], 1)[0], 540, 1330, t, T.tierra + 0.2, TB.b15 + 0.2, { col: C.frio, sub: 'el agua de fusión sale' }); }
 }, sfx(k) { FX.calor(k, TB.b14, 2.5); k.play('whoosh', T.excavados - 0.5, { dur: 1.0, top: 600, gain: 0.25 }); FX.etiqueta(k, T.excavados); FX.etiqueta(k, T.tierra - 0.2); FX.goteo(k, T.tierra + 0.2, 3, 0.3, 9); } });

 // 15 · PAREDES GRUESAS Y AISLANTES — planos alternos: sol sobre el adobe → corte del muro (espesor y materiales) → flujo de calor
 // cualitativo (se atenúa, no desaparece) → interior con el hielo protegido
 B.push({ t0: TB.b15, t1: TB.b16, in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  const s1 = T.gruesas + 0.5, s2 = T.calor18 - 0.75, s3 = T.interior18 - 0.45;
  if (t < s1) { const cam = shot([[TB.b15, [150, 30, 120], [40, 50, 60], 760], [s1, [140, 26, 110], [36, 56, 56], 820]], t); W2(ctx, cam, t, { sun: P.ykSun(55, 160) }); grade(ctx, '#ffb060', 0.25); shimmer(ctx, t, 300, 0.6, 14); lab(ctx, 'SOL DIRECTO SOBRE EL ADOBE', null, 540, 1300, t, TB.b15 + 0.1, s1, { col: C.calor }); }
  else if (t < s2) { const u = win(t, s1, s2), sc = lerp(10, 9, u), gy = 1250, ox = 540 + ((P.ykR2(40) + P.ykRin2(40)) / 2) * sc; const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#2f7fd6'); g.addColorStop(1, '#cfe0ea'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const r = P.ykSection2(ctx, ox, gy, sc, t, { flip: true, ice: 0.85, sun: P.ykSun(55, 160) });
   const zx = (z) => ox - z * sc; lab(ctx, 'REVOQUE DE BARRO Y PAJA', [zx(P.ykR2(60)), gy - 60 * sc], 1010, 330, t, s1 + 0.1, s2, { al: 'right' }); lab(ctx, 'ADOBE', [zx((P.ykR2(30) + P.ykRin2(30)) / 2), gy - 30 * sc], 1010, 470, t, T.aislantes - 0.3, s2, { al: 'right', sub: 'barro secado al sol' }); const a2 = sm(s1 + 0.2, s1 + 0.6, t); const yD = gy - 34 * sc; if (a2 > 0) { ctx.save(); ctx.globalAlpha = a2; ctx.strokeStyle = C.oro; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(zx(P.ykR2(34)), yD); ctx.lineTo(zx(P.ykRin2(34)), yD); ctx.stroke(); for (const x of [zx(P.ykR2(34)), zx(P.ykRin2(34))]) { ctx.beginPath(); ctx.moveTo(x, yD - 16); ctx.lineTo(x, yD + 16); ctx.stroke(); } ctx.restore(); } lab(ctx, 'PARED MÁS GRUESA EN LA BASE', [(zx(P.ykR2(34)) + zx(P.ykRin2(34))) / 2, yD], 540, 1330, t, s1 + 0.3, s2, {}); }
  else if (t < s3) { const sc = 3.9, gy = 1130, ox = 560; const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#e98a48'); g.addColorStop(0.55, '#f5c58a'); g.addColorStop(1, '#efd9b0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const r = P.ykSection2(ctx, ox, gy, sc, t, { flip: true, ice: 0.85, heat: sm(s2, s2 + 0.3, t), grad: sm(s2 + 0.2, s2 + 0.9, t), tint: 2.4 });
   lab(ctx, 'EL CALOR ENTRA LENTAMENTE', null, 540, 250, t, s2 + 0.2, s3, { col: C.calor, sub: 'la pared no lo bloquea del todo' }); lab(ctx, 'EXTERIOR · SOL', null, 170, 640, t, s2 + 0.35, s3, { col: C.calor }); lab(ctx, 'INTERIOR · MÁS FRESCO', null, 560, 860, t, s2 + 0.5, s3, { col: C.frio }); }
  else { const cam = shot([[s3, [160, 20, 40], [-30, -16, 0], 820], [TB.b16, [150, 14, 30], [-30, -20, -4], 840]], t); ctx.fillStyle = '#1a140f'; ctx.fillRect(0, 0, W, HH); W2(ctx, cam, t, { sun: SUN_HOT, cut: { c: 0, ice: 0.86, dim: 0.95 } }); grade(ctx, '#7cc4e8', 0.12, 'soft-light'); lab(ctx, 'EL HIELO SIGUE PROTEGIDO', null, 540, 1300, t, s3 + 0.1, TB.b16 + 0.2, { col: C.frio }); }
 }, sfx(k) { FX.calor(k, TB.b15, 1.8); k.play('swish', T.gruesas + 0.4, { dur: 0.5, gain: 0.35 }); FX.etiqueta(k, T.gruesas + 0.6); FX.etiqueta(k, T.aislantes - 0.3); k.play('swish', T.calor18 - 0.8, { dur: 0.5, gain: 0.35 }); FX.calor(k, T.calor18 - 0.5, 1.6); k.play('swish', T.interior18 - 0.5, { dur: 0.5, gain: 0.35 }); FX.goteo(k, T.interior18, 3, 0.3, 7); } });

 // 16 · LA SOMBRA — el muro este–oeste al sur del estanque: rayos del sol de invierno que rozan su arista, sombra que cubre el estanque;
 // el muro y la cúpula tienen funciones relacionadas pero distintas
 B.push({ t0: TB.b16, t1: TB.b17, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = shot([[TB.b16, [760, 300, 120], [0, 20, 230], 900], [TB.b17, [700, 360, -40], [0, 10, 220], 900]], t), sun = SUN_W; const w = W2(ctx, cam, t, { sun, water: 1, ice: 0.9, rays: sm(T.sombra - 0.4, T.sombra + 0.2, t) }); P.ykCompass(ctx, cam, 960, 300, 40);
  lab(ctx, 'MURO: SOMBRA SOBRE EL ESTANQUE', w.wallC, 540, 1250, t, T.sombra + 0.2, TB.b17 + 0.2, {}); lab(ctx, 'MENOS RADIACIÓN DIRECTA', w.pondC, 540, 1120, t, T.sombra + 0.9, TB.b17 + 0.2, { col: C.frio }); lab(ctx, 'CÚPULA: AÍSLA EL DEPÓSITO', w.dome && w.dome.top, 540, 420, t, T.temperaturas - 0.4, TB.b17 + 0.2, { col: C.frio });
 }, sfx(k) { FX.aparece(k, T.sombra - 0.2, 500); FX.etiqueta(k, T.sombra + 0.2); FX.etiqueta(k, T.sombra + 0.9); FX.etiqueta(k, T.temperaturas - 0.4); } });

 // 17 · MÁS LENTAMENTE — pantalla partida, mismo tiempo: hielo expuesto al sol frente a hielo guardado en el depósito
 B.push({ t0: TB.b17, t1: TB.b18x, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, TB.b17 + 0.3, TB.b18x - 0.1); const half = (x0, f) => { ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, 540, HH); ctx.clip(); ctx.translate(x0 - 270, 0); f(); ctx.restore(); };
  half(0, () => { const cam = P.cam3([20, 8, 17], [0, 3.6, 0], 900), sun = P.ykSun(60, 210); const sk = ctx.createLinearGradient(0, 0, 0, HH); sk.addColorStop(0, '#2a78d4'); sk.addColorStop(0.5, '#d9e6ea'); sk.addColorStop(1, '#efd9a8'); ctx.fillStyle = sk; ctx.fillRect(0, 0, W, HH); const sp = sunDisc(ctx, cam, sun, 1, 60); P.box3(ctx, cam, -3000, 3000, -1, 0, -3000, 3000, '#dcbc8a', {}); const m = u * 0.9, pr = 6 + m * 10; const pts = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU; pts.push([pr * Math.cos(a) * 1.2, 0.06, pr * Math.sin(a)]); } poly3s(ctx, cam, pts, `rgba(150,190,210,${0.3 + 0.3 * m})`); const sh = P.ykShadow([4, 7, 3], sun); poly3s(ctx, cam, [[-4, 0.07, -3], [4, 0.07, -3], [sh[0] + 4, 0.07, sh[2] + 3], [sh[0] - 4, 0.07, sh[2] - 3]], 'rgba(60,40,20,0.28)'); P.iceBox3(ctx, cam, -4, 4, 0.08, 7, -3, 3, { seed: 9, melt: m });
   if (sp) { ctx.save(); ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = 'rgba(255,212,71,0.9)'; ctx.lineWidth = 4; for (const q of [[-2, 6, 0], [2, 5, 2], [0, 3, 3]]) { const p = cam.clip([q], 1)[0]; if (p) { ctx.beginPath(); ctx.moveTo(lerp(sp[0], p[0], 0.3), lerp(sp[1], p[1], 0.3)); ctx.lineTo(p[0], p[1]); ctx.stroke(); } } ctx.restore(); } shimmer(ctx, t, 1000, 1, 10); grade(ctx, '#ffb060', 0.2); });
  half(540, () => { const cam = P.cam3([58, 46, 30], [-40, -22, -8], 540); ctx.fillStyle = '#1a140f'; ctx.fillRect(0, 0, W, HH); P.ykCutaway(ctx, cam, t, { c: 1e9, ice: 0.95, melt: u * 0.12, warm: 0.4, dim: 1.0 }); grade(ctx, '#7cc4e8', 0.1); vign(ctx, 0.45); });
  ctx.fillStyle = C.blanco; ctx.fillRect(537, 0, 6, HH); lab(ctx, 'AL SOL', null, 270, 330, t, TB.b17 + 0.2, TB.b18x + 0.2, { col: C.calor, px: 40, sub: 'se funde rápido' }); lab(ctx, 'EN EL DEPÓSITO', null, 810, 330, t, TB.b17 + 0.35, TB.b18x + 0.2, { col: C.frio, px: 40, sub: 'se funde despacio' });
  const ma = sm(T.lentamente - 0.3, T.lentamente + 0.2, t); if (ma > 0) { ctx.save(); ctx.globalAlpha = ma; ctx.fillStyle = 'rgba(10,16,26,0.7)'; ctx.beginPath(); ctx.roundRect(330, 1230, 420, 80, 40); ctx.fill(); txt(ctx, 'MISMO TIEMPO', 540, 1271, 36, C.blanco, { w: 800, f: '"IBM Plex Mono"' }); ctx.restore(); }
 }, sfx(k) { FX.goteo(k, T.derretia, 6, 0.4, 11); FX.calor(k, TB.b17, 2.5); FX.etiqueta(k, T.lentamente - 0.3); } });

 // 18 · DEL INVIERNO AL VERANO — estanque helado → transporte → hielo guardado → la cámara sale → pasan los meses (luz, calor,
 // estanque seco) → en verano, de vuelta al depósito: queda una parte del hielo
 B.push({ t0: TB.b18x, t1: TB.b18b, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const a1 = T.invierno22 - 0.6, a2 = T.invierno22 + 0.45, a3 = T.verano - 1.1, a4 = T.no23 + 0.9, a5 = T.desierto23 - 0.9;
  if (t < a1) { const cam = shot([[TB.b18x, [560, 260, -160], [0, 0, 240], 900], [a1, [300, 120, 20], [0, 0, 190], 900]], t); const act = [0, 1].map((k) => { const z = 186 - k * 30 - (t - TB.b18x) * 9; return actor(cam, [3, 0.4, z], () => wk2(ctx, cam, [3, 0.4, z], t, { pose: 'carry', ph: (t * 1.1 + k * 0.4) % 1, var: k, toward: [3, 0.4, z - 20], block: { w: 44, h: 32 } })); }); W2(ctx, cam, t, { sun: SUN_W, water: 1, ice: 1, actors: act }); kick(ctx, '03', 'DEL INVIERNO AL VERANO', t, TB.b18x + 0.1, a3); }
  else if (t < a2) { const cam = shot([[a1, [230, 40, 90], [-20, -14, 20], 840], [a2, [300, 80, 120], [0, 0, 20], 860]], t); ctx.fillStyle = '#1a140f'; ctx.fillRect(0, 0, W, HH); W2(ctx, cam, t, { sun: SUN_W, cut: { c: 0, ice: 0.95 } }); kick(ctx, '03', 'DEL INVIERNO AL VERANO', t, TB.b18x + 0.1, a3); lab(ctx, 'DEPÓSITO LLENO', null, 540, 1300, t, a1 + 0.1, a2, { col: C.frio }); }
  else if (t < a4) { const u = E.inOut(win(t, a2, a4)), mo = win(t, a2 + 0.2, a4 - 0.3), cam = shot([[a2, [560, 220, -200], [0, 20, 200], 900], [a4, [640, 300, -260], [0, 20, 200], 900]], t), sun = yearSun(lerp(0.02, 0.5, mo)); W2(ctx, cam, t, { sun, water: mo < 0.55 ? 1 : 0, ice: cl(1 - mo * 2.2), dry: mo > 0.55 }); grade(ctx, '#ffb060', 0.3 * mo); shimmer(ctx, t, 1000, mo);
   const M = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO'], mi = Math.min(6, Math.floor(mo * 7)); tag(ctx, M[mi], 540, 400, t, a2 + 0.1, {}); kick(ctx, '03', 'DEL INVIERNO AL VERANO', t, TB.b18x + 0.1, a3); lab(ctx, 'EL ESTANQUE YA NO HIELA', w0(cam), 420, 1180, t, a4 - 1.4, a4, { col: C.calor }); }
  else if (t < a5) { const cam = shot([[a4, [-430, 95, 170], [60, -4, 250], 900], [a5, [-400, 85, 175], [80, -4, 252], 900]], t); W2(ctx, cam, t, { sun: SUN_HOT, dry: true }); sunDisc(ctx, cam, SUN_HOT, 1, 60); shimmer(ctx, t, 900, 1, 12); grade(ctx, '#ffb060', 0.3); lab(ctx, 'VERANO: EL ESTANQUE SIN HIELO', null, 540, 400, t, a4, a5 + 0.1, { col: C.calor }); }
  else { const cam = shot([[a5, [300, 70, 120], [0, -10, 10], 860], [TB.b18b, [230, 30, 70], [-16, -26, 6], 840]], t); ctx.fillStyle = '#1a140f'; ctx.fillRect(0, 0, W, HH); W2(ctx, cam, t, { sun: SUN_HOT, cut: { c: 0, ice: 0.95, melt: 0.55, warm: 0.4 } }); lab(ctx, 'QUEDA PARTE DEL HIELO', cam.clip([[0, -40, 0]], 1)[0], 540, 380, t, a5 + 0.3, TB.b18b + 0.2, { col: C.frio, sub: 'no todo: una parte se fundió' }); }
 }, sfx(k) { for (let i = 0; i < 3; i++) k.play('stroke', TB.b18x + 0.2 + i * 0.5, { material: 'chalk', dur: 0.4, gain: 0.15 }); k.play('whoosh', T.invierno22 - 0.6, { dur: 0.6, gain: 0.25 }); FX.saltoTiempo(k, T.invierno22 + 0.5, 2.2, 0.4); FX.calor(k, T.no23 + 0.9, 3); k.play('whoosh', T.desierto23 - 0.9, { dur: 0.6, gain: 0.25 }); FX.goteo(k, T.desierto23 - 0.6, 4, 0.3, 13); } });
 const w0 = (cam) => cam.clip([[0, 0, (Y.pond.z0 + Y.pond.z1) / 2]], 1)[0];

 // 19 · APROVECHAR EL FRÍO DE UNA ESTACIÓN — el depósito a lo largo del año: el nivel baja despacio mientras cambia la luz exterior
 B.push({ t0: TB.b18b, t1: TB.b19, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = shot([[TB.b18b, [26, 40, 66], [-8, -30, 0], 760], [TB.b19, [14, 22, 58], [-10, -34, -4], 800]], t); ctx.fillStyle = '#1a140f'; ctx.fillRect(0, 0, W, HH); P.ykCutaway(ctx, cam, t, { c: 1e9, ice: 0.95, melt: 0.55, warm: 0.5, dim: 1.05 }); const bm = ctx.createLinearGradient(540, 0, 540, 1500); bm.addColorStop(0, 'rgba(255,214,150,0.16)'); bm.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = bm; ctx.beginPath(); ctx.moveTo(380, 0); ctx.lineTo(700, 0); ctx.lineTo(860, 1500); ctx.lineTo(220, 1500); ctx.closePath(); ctx.fill(); vign(ctx, 0.45);
  lab(ctx, 'EL FRÍO DE UNA ESTACIÓN', cam.clip([[0, -34, 0]], 1)[0], 70, 330, t, T.aprovechar - 0.1, TB.b19 + 0.2, { al: 'left', col: C.frio }); lab(ctx, 'CONSERVADO DURANTE MESES', null, 540, 1250, t, T.meses - 0.5, TB.b19 + 0.2, {});
 }, sfx(k) { FX.etiqueta(k, T.aprovechar - 0.1); FX.saltoTiempo(k, T.estacion, 1.6, 0.35); FX.correcto(k, T.meses); } });

 // 20 · FINAL — plano amplio con luz cálida de verano: estanque, muro, cúpula fiel a la foto, profundidad; breve revelación del hielo
 // conservado y la cámara se aleja; «ASOMBROTECA» discreto al final
 B.push({ t0: TB.b19, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.b19, DURATION)), cc = T.conocias, rv = sm(cc + 0.1, cc + 0.9, t) * (1 - sm(TB.b20 + 0.2, TB.b20 + 1.1, t)), cut = rv > 0.01 ? { c: lerp(Y.R0 + 4, 4, E.inOut(rv)), ice: 0.95, melt: 0.55, warm: 0.5 } : null;
  const cam = P.cam3([lerp(560, 820, u), lerp(150, 430, u), lerp(-220, -520, u)], [0, lerp(50, 20, u), lerp(40, 160, u)], lerp(900, 960, u)), sun = SUN_EVE;
  W2(ctx, cam, t, { sun, town: true, dry: true, cut, skyMid: '#f2c48a', night: lerp(0, 0.25, win(t, TB.b20 + 2, DURATION)) }); sunDisc(ctx, cam, sun, 0.9, 52); grade(ctx, '#ff9a4a', 0.36); vign(ctx, 0.35);
  if (rv > 0.3) lab(ctx, 'HIELO EN PLENO VERANO', cam.clip([[0, -40, 0]], 1)[0], 540, 1250, t, cc + 0.6, TB.b20 + 0.4, { col: C.frio });
  const a = sm(T.asombroteca, T.asombroteca + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(245,247,248,0.75)'; ctx.lineWidth = 2; const lw = 230 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 330); ctx.lineTo(540 + lw, 330); ctx.moveTo(540 - lw, 438); ctx.lineTo(540 + lw, 438); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 385, 54, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
 }, sfx(k) { FX.viento(k, TB.b19, DURATION - TB.b19, 0.4); k.play('swish', T.conocias + 0.1, { dur: 0.8, gain: 0.3 }); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.end + 0.6); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['desértica,', 'calor', 'hielo', 'electricidad!', 'Persia.', 'frío', 'caluroso?', 'arquitectura', 'física.', 'yakhchal.', 'cúpulas', 'aislar', 'interesante.', 'invierno!', 'frías,', 'estanques', 'profundos.', 'congelaba,', 'capas', 'cortaban', 'bloques', 'depósitos.', 'ingeniería!', 'sol,', 'tierra.', 'gruesas', 'aislantes', 'sombra', 'lentamente,', 'verano.', 'fabricar', 'frío', 'meses!', 'invento?', 'Asombroteca!'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 450, q: 0.6, gain: 0.01, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   MUS.persa(k, 0, TB.b8, { bpm: 88, root: 'D3', gain: 0.9, santur: 0.8, daf: 0.55, drone: 0.7 });
   MUS.persa(k, TB.b8, TB.b12, { bpm: 72, root: 'D3', gain: 0.7, santur: 0.55, daf: 0.15, drone: 0.9 });
   MUS.persa(k, TB.b12, TB.b17, { bpm: 92, root: 'D3', gain: 0.85, santur: 0.75, daf: 0.6, drone: 0.7 });
   MUS.persa(k, TB.b17, TB.b19, { bpm: 80, root: 'G2', gain: 0.85, santur: 0.8, daf: 0.4, drone: 0.8 });
   MUS.epica(k, TB.b18b, TB.b19, { bpm: 80, chords: [['G2', 'D3', 'G3', 'A#3'], ['D#2', 'A#2', 'D#3', 'G3'], ['F2', 'C3', 'F3', 'A3'], ['D2', 'A2', 'D3', 'F#3']], gain: 0.5, drums: 0, strings: 0.8, ostinato: 0 });
   MUS.persa(k, TB.b19, DURATION, { bpm: 66, root: 'D3', gain: 0.8, santur: 0.6, daf: 0, drone: 1 });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { for (const k of Object.keys(window.FOTOS || {})) { IMG[k] = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = window.FOTOS[k]; }); } }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
