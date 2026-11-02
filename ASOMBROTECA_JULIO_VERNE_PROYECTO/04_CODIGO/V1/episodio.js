// =====================================================================================================
// episodio.js — «Julio Verne imaginó los viajes a la Luna en 1865» · Asombroteca · Ep. 04 · PLANTILLA v1.22 (Verne / Apolo)
// Dos épocas: 1865 (imaginación: grabado, sepia, estudio, cápsula y Columbiad de la NOVELA) → 1969 (realidad: Saturno V, plataforma
// 39A, tripulación, Eagle). La animación es la protagonista; los cinco documentos auténticos aparecen como planos flotantes breves
// (P.floatPhoto) solo cuando la voz nombra a la persona, objeto o acontecimiento. Lo recreado se rotula como recreación/visualización.
// Física sin cifras inventadas: el cañón alcanza la velocidad en un recorrido corto (aceleración extrema); el cohete acelera durante
// varios minutos y de forma NO constante. Reloj = voz original (89,73 s).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS, IMG = {};
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  s0: SG(0).s, aviones: wt(0, 'aviones'), s1: SG(1).s, tres1: wt(1, 'tres'), luna1: wt(1, 'luna'), florida1: wt(1, 'florida'), s2: SG(2).s, apolo2: wt(2, 'apolo'),
  s3: SG(3).s, julio: wt(3, 'julio'), s4: SG(4).s, novela: wt(4, 'novela'), tierra4: wt(4, 'tierra'), s5: SG(5).s, viajeros: wt(5, 'viajeros'), capsula5: wt(5, 'cápsula'),
  s6: SG(6).s, s7: SG(7).s, canon7: wt(7, 'cañón'), enterrado: wt(7, 'enterrado'), s8: SG(8).s, nave8: wt(8, 'nave'), s9: SG(9).s, motores: wt(9, 'motores'),
  s10: SG(10).s, s11: SG(11).s, s12: SG(12).s, disparo: wt(12, 'disparo'), aceleracion: wt(12, 'aceleración'), mortal: wt(12, 'mortal'), s13: SG(13).s, asombroso: wt(13, 'asombroso'),
  s14: SG(14).s, florida14: wt(14, 'florida'), s15: SG(15).s, tripulacion: wt(15, 'tripulación'), capsula15: wt(15, 'cápsula'), luna15: wt(15, 'luna'),
  s16: SG(16).s, apolo16: wt(16, 'apolo'), florida16: wt(16, 'florida'), s17: SG(17).s, armstrong: wt(17, 'armstrong'), collins: wt(17, 'collins'),
  s18: SG(18).s, s19: SG(19).s, saturno: wt(19, 'saturno'), minutos: wt(19, 'minutos'), s20: SG(20).s, golpe: wt(20, 'golpe'),
  s21: SG(21).s, verne21: wt(21, 'verne'), rodeaban: wt(21, 'rodeaban'), s22: SG(22).s, s23: SG(23).s, ingenieria: wt(23, 'ingeniería'), s24: SG(24).s, s25: SG(25).s, asombroteca: wt(25, 'asombroteca'), end: A.speech_end,
 };
 const B0 = { b1b: T.s1 - 0.15, b2: T.s2 - 0.2, b3: T.s3 - 0.2, b4: T.s5 - 0.2, b5: T.s6 - 0.2, b6: T.s8 - 0.2, b7: T.s10 - 0.2, b8: T.s13 - 0.2, b9: T.s14 - 0.2, b10: T.s16 - 0.2, b11: T.s18 - 0.2, b12: T.s19 - 0.2, b14: T.s21 - 0.2, b14b: T.s22 - 0.18, b15: T.s22 + 1.4, b16: T.s23 + 3.0, b17: T.s24 - 0.15 };

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
 // escena exterior de 1865 en Florida (suelo, palmeras, cielo de grabado)
 const florida1865 = (ctx, cam, t) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#5f7f9e'); g.addColorStop(0.6, '#d8c9a2'); g.addColorStop(1, '#e8dab8'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const G = 3000; poly3s(ctx, cam, [[-G, 0, -G], [G, 0, -G], [G, 0, G], [-G, 0, G]], '#a3966a'); for (const [x, z] of [[-40, -60], [50, -90], [-80, -30], [90, -40], [-20, -130], [30, -170]]) bill(ctx, cam, [x, 0, z], 9, (px, py, ph) => P.palm(ctx, px, py, ph, t)); };
 const poly3s = (ctx, cam, pts, fill) => { const Q = cam.clip(pts, 1); if (Q.length < 3) return; ctx.beginPath(); Q.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
 // cohete en su plataforma (cámara, despegue en m, encendido)
 const padScene = (ctx, cam, t, o = {}) => { const pad = P.pad39A(ctx, cam, t, { arms: o.arms ?? 1, skyTop: o.skyTop, skyMid: o.skyMid }); const up = o.up || 0; let r = null; const items = [{ d: pad.towerDepth, f: pad.tower }, { d: cam.depth([0, 55 + up, 0]), f: () => { r = P.saturnV3(ctx, cam, [0, up, 0], t, {}); } }]; items.sort((a, b) => b.d - a.d); items.forEach((x) => x.f()); if (o.tg != null && o.tg > 0 && r) P.plume3(ctx, cam, r.nozzles, t, { tg: o.tg, power: o.power ?? 1, len: o.len }); return r; };

 const B = [];
 // 1 · GANCHO — una cápsula metálica asciende; la Tierra se aleja y la Luna aparece; la imagen se convierte en un grabado: es 1865
 B.push({ t0: 0, t1: B0.b1b, in: { type: 'cut' }, draw(ctx, t) {
  const u = win(t, 0, B0.b1b), up = E.out(u); space(ctx, t, t * 260); P.earth3(ctx, lerp(500, 600, up), lerp(1900, 2350, up), lerp(900, 380, up), t, { rot: t * 0.08, light: [-0.4, 0.5, 0.75] }); P.moon3(ctx, lerp(760, 690, up), lerp(260, 330, up), lerp(70, 165, up), t, { light: [-0.6, 0.2, 0.7], glow: 1 });
  const oa = lerp(0.2, 1.5, E.inOut(u)), cam = P.cam3([Math.cos(oa) * 12, lerp(0.5, 5.5, up), Math.sin(oa) * 12], [0, 2.3, 0], lerp(1300, 950, up)); ctx.save(); ctx.translate(0, Math.sin(t * 2) * 6); P.vCapsule3(ctx, cam, [0, 0, 0], t, { L: [-0.5, 0.4, 0.75] }); ctx.restore();
  const eg = sm(3.0, 4.2, t); if (eg > 0) P.engraveGrade(ctx, eg, t); title(ctx, '¡1865: VIAJE A LA LUNA!', t, 3.4, B0.b1b + 4.1, {}); vign(ctx, 0.35);
 }, sfx(k) { FX.espacio(k, 0, 4.5, 0.8); k.play('whoosh', 0.1, { dur: 1.5, top: 900, gain: 0.25 }); FX.saltoTiempo(k, 3.0, 1.2, 0.5); } });

 // 1b · TRES HOMBRES, LA LUNA, FLORIDA — el mismo mundo, ya como grabado: cápsula sobre su cuna, tres viajeros, la Luna en el cielo
 B.push({ t0: B0.b1b, t1: B0.b2, in: { type: 'cut' }, draw(ctx, t) {
  const cam = shot([[B0.b1b, [10, 2.4, 13], [3, 2.6, 0], 900], [B0.b2, [9, 2.2, 11.5], [3.2, 2.8, 0], 900]], t); florida1865(ctx, cam, t); P.moon3(ctx, 820, 330, 120, t, { light: [-0.5, 0.2, 0.8] });
  P.box3(ctx, cam, -2.2, 2.2, 0, 0.6, -2.2, 2.2, '#6b4f33', {}); P.vCapsule3(ctx, cam, [0, 0.6, 0], t, {}); const tr = [[3.6, 0, 2.2, 0], [4.9, 0, 1.4, 1], [6.2, 0, 0.6, 2]];
  tr.forEach(([x, y, z, v], i) => { const a = sm(T.tres1 - 0.1 + i * 0.12, T.tres1 + 0.3 + i * 0.12, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; bill(ctx, cam, [x, y, z], 1.8, (px, py, ph) => P.traveler1865(ctx, px, py, ph, t, { var: v, pose: v === 2 ? 'point' : 'stand' })); ctx.restore(); });
  P.engraveGrade(ctx, 1, t); title(ctx, '¡1865: VIAJE A LA LUNA!', t, B0.b1b - 1, B0.b1b + 3.6, {}); lab(ctx, '3 VIAJEROS', null, 290, 1300, t, T.tres1, B0.b2, { col: C.oro }); lab(ctx, 'FLORIDA', null, 760, 1300, t, T.florida1 - 0.1, B0.b2, { col: C.oro }); recon(ctx, 'FICCIÓN DE VERNE · RECREACIÓN', t, B0.b1b + 0.3, B0.b2);
 }, sfx(k) { FX.etiqueta(k, T.tres1); FX.etiqueta(k, T.florida1); } });

 // 2 · MÁS DE CIEN AÑOS ANTES — línea temporal 1865 → 1969; el año 1969 se convierte en la silueta del Saturno V
 B.push({ t0: B0.b2, t1: B0.b3, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, B0.b2 + 0.2, T.apolo2 + 0.2), g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#231C19'); g.addColorStop(1, '#050B18'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); stars(ctx, t, 120, 9, 0);
  const x0 = 140, x1 = 940, y = 1050, xm = lerp(x0, x1, E.inOut(u)); ctx.strokeStyle = 'rgba(245,247,250,0.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); const lg = ctx.createLinearGradient(x0, 0, x1, 0); lg.addColorStop(0, C.sepia); lg.addColorStop(1, C.cian); ctx.strokeStyle = lg; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xm, y); ctx.stroke();
  for (let yr = 1870; yr < 1969; yr += 10) { const x = lerp(x0, x1, (yr - 1865) / 104); ctx.fillStyle = 'rgba(245,247,250,0.4)'; ctx.fillRect(x - 2, y - 14, 4, 28); }
  txt(ctx, '1865', x0, y + 80, 52, C.papel, { f: '"Space Grotesk"', w: 700 }); P.yearRoll(ctx, xm, y - 120, 92, 1865, 1969, E.inOut(u), {}); const sa = sm(T.apolo2 - 0.1, T.apolo2 + 0.6, t);
  if (sa > 0) { ctx.save(); ctx.globalAlpha = sa; const sx = x1, sy = y - 210, h = 520 * E.out(sa), wv = h * 0.092; ctx.fillStyle = '#E8ECEA'; ctx.beginPath(); ctx.moveTo(sx - wv / 2, sy); ctx.lineTo(sx - wv / 2, sy - h * 0.6); ctx.lineTo(sx - wv * 0.33, sy - h * 0.66); ctx.lineTo(sx - wv * 0.33, sy - h * 0.86); ctx.lineTo(sx - wv * 0.18, sy - h * 0.93); ctx.lineTo(sx, sy - h); ctx.lineTo(sx + wv * 0.18, sy - h * 0.93); ctx.lineTo(sx + wv * 0.33, sy - h * 0.86); ctx.lineTo(sx + wv * 0.33, sy - h * 0.66); ctx.lineTo(sx + wv / 2, sy - h * 0.6); ctx.lineTo(sx + wv / 2, sy); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#24282C'; ctx.fillRect(sx - wv / 2, sy - h * 0.08, wv / 2, h * 0.08); ctx.fillRect(sx - wv / 2, sy - h * 0.31, wv, h * 0.025); ctx.restore(); txt(ctx, 'APOLO 11', x1, y + 80, 44, C.cian, { f: '"Space Grotesk"', w: 700 }); }
  title(ctx, '104 AÑOS ANTES', t, B0.b2 + 0.5, B0.b3 + 0.2, {});
 }, sfx(k) { FX.saltoTiempo(k, B0.b2 + 0.1, 1.6, 0.6); FX.revelar(k, T.apolo2 - 0.1); } });

 // 3 · JULIO VERNE — su estudio (recreación); al nombrarlo aparece su fotografía auténtica junto al escritorio; luego, la novela
 B.push({ t0: B0.b3, t1: B0.b4, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, B0.b3, B0.b4), z = lerp(1.0, 1.35, E.inOut(u)); P.study1865(ctx, t, { z, x: lerp(0, -60, u), y: lerp(0, 140, E.inOut(u)) }, { write: (t * 0.3) % 1 });
  ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540 + 60 * u, -960 - 140 * E.inOut(u)); P.writer1865(ctx, 340, 1700, 560, t, { write: (t * 0.45) % 1 }); const bk = sm(T.novela - 0.3, T.novela + 0.3, t); if (bk > 0) { } ctx.restore();
  P.floatPhoto(ctx, IMG.verne, 740, 640, 400, t, T.julio - 0.15, T.novela + 0.1, { tag: 'FOTOGRAFÍA HISTÓRICA', label: 'JULIO VERNE', sub: 'escritor francés (1828–1905)', from: 1, rotY: -0.16 });
  const bb = sm(T.novela + 0.15, T.novela + 0.6, t); if (bb > 0) { ctx.save(); ctx.globalAlpha = bb; P.book1865(ctx, 760, 760, lerp(0.62, 0.74, win(t, T.novela, B0.b4)), t, { rot: -0.04 }); ctx.restore(); lab(ctx, '«DE LA TIERRA A LA LUNA» · 1865', null, 540, 1330, t, T.novela + 0.3, B0.b4 + 0.2, { col: C.oro }); }
  sepiaWarm(ctx, 0.25); vign(ctx, 0.45); recon(ctx, 'RECREACIÓN HISTÓRICA', t, B0.b3 + 0.4, T.julio - 0.2);
 }, sfx(k) { FX.escribir(k, B0.b3 + 0.2, 1.4, 0.7); FX.revelar(k, T.julio - 0.15); FX.paginas(k, T.novela, 2, 0.8); } });

 // 4 · LA CÁPSULA METÁLICA — modelo 3D del proyectil de la novela; los tres viajeros suben; junto al modelo, el grabado original de 1868
 B.push({ t0: B0.b4, t1: B0.b5, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const a = win(t, B0.b4, B0.b5), cam = P.cam3([Math.cos(0.2 + a * 0.7) * 10 + 1.5, 3.2 + a * 1.2, Math.sin(0.2 + a * 0.7) * 10], [3.6, 2.4, -1.5], 900); florida1865(ctx, cam, t);
  P.box3(ctx, cam, -2.2, 2.2, 0, 0.6, -2.2, 2.2, '#6b4f33', {}); const items = [actor(cam, [0, 2, 0], () => P.vCapsule3(ctx, cam, [0, 0.6, 0], t, {}))];
  [[2.6, 1.6, 0], [3.4, -0.6, 1], [4.2, -1.8, 2]].forEach(([x, z, v], i) => { const walk = win(t, T.viajeros + i * 0.25, T.viajeros + 1.6 + i * 0.25), px = lerp(x, 1.7, walk), pz = lerp(z, 0.4, walk); items.push(actor(cam, [px, 0, pz], () => bill(ctx, cam, [px, walk > 0.99 ? 0.6 : 0, pz], 1.8, (X, Y, h) => P.traveler1865(ctx, X, Y, h, t, { var: v, pose: walk > 0 && walk < 1 ? 'walk' : 'stand', ph: t * 1.4 + i * 0.3, dir: -1 })))); });
  items.sort((p, q) => q.d - p.d).forEach((x) => x.f()); sepiaWarm(ctx, 0.35); vign(ctx, 0.35);
  P.floatPhoto(ctx, IMG.grabado, 760, 640, 390, t, T.capsula5 - 0.2, B0.b5 + 0.5, { tag: 'GRABADO ORIGINAL', label: 'ILUSTRACIÓN HISTÓRICA · 1868', sub: 'Henri de Montaut · ficción', from: 1, rotY: -0.16 });
  lab(ctx, 'CÁPSULA METÁLICA', null, 300, 1330, t, T.capsula5 - 0.1, B0.b5 + 0.2, { col: C.oro }); recon(ctx, 'RECREACIÓN · FICCIÓN DE VERNE', t, B0.b4 + 0.3, T.capsula5 - 0.3);
 }, sfx(k) { FX.pasos(k, T.viajeros, 4, 0.36, 0.6); FX.metal(k, T.capsula5); FX.revelar(k, T.capsula5 - 0.2); } });

 // 5 · EL CAÑÓN GIGANTESCO — la cápsula se baja hacia el brocal del Columbiad enterrado; corte que revela su enorme profundidad
 B.push({ t0: B0.b5, t1: B0.b6, in: { type: 'cut' }, draw(ctx, t) {
  const tc = T.canon7 - 0.15; if (t < tc) { const cap = lerp(7, -3.5, E.inOut(win(t, B0.b5 + 0.6, tc))), cam = shot([[B0.b5, [16, 12, 22], [0, 6, 0], 850], [tc, [9, 20, 12], [0, -1, 0], 850]], t); P.columbiad3(ctx, cam, t, { cap }); sepiaWarm(ctx, 0.3); vign(ctx, 0.35); P.floatPhoto(ctx, IMG.grabado, 760, 640, 390, t, T.capsula5 - 0.2, B0.b5 + 0.5, { tag: 'GRABADO ORIGINAL', label: 'ILUSTRACIÓN HISTÓRICA · 1868', sub: 'Henri de Montaut · ficción', from: 1, rotY: -0.16 }); }
  else { const u = E.inOut(win(t, tc, B0.b6 - 0.3)), s = lerp(12, 4.4, u), gy = lerp(760, 300, u); const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#6f8fae'); g.addColorStop(1, '#d9c9a4'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const r = P.columbiadSection(ctx, 540, gy, s, t, { p: 0, people: true }); sepiaWarm(ctx, 0.3);
   title(ctx, '¡UN CAÑÓN GIGANTESCO!', t, tc + 0.1, B0.b6 + 0.1, {}); lab(ctx, '≈ 274 m DE PROFUNDIDAD', [r.mouth[0] + 30, Math.min(1200, r.mouth[1] + 260)], 1010, 640, t, T.enterrado, B0.b6 + 0.1, { al: 'right', sub: '900 pies en la novela' }); lab(ctx, 'ENTERRADO EN EL SUELO', null, 540, 1330, t, T.enterrado + 0.3, B0.b6 + 0.1, { col: C.oro }); recon(ctx, 'DISPOSITIVO FICTICIO', t, tc + 0.4, B0.b6); }
 }, sfx(k) { FX.grua(k, B0.b5 + 0.6, 2.2, 0.8); FX.metal(k, T.canon7 - 0.3, 0.8); k.play('whoosh', T.canon7 - 0.15, { dur: 1.6, top: 600, gain: 0.3 }); FX.revelar(k, T.canon7); } });

 // 6 · ANTES DE LA ERA ESPACIAL — taller del siglo XIX: máquina de vapor; nadie había visto una nave; no había motores para salir de la Tierra
 B.push({ t0: B0.b6, t1: B0.b7, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, B0.b6, B0.b7), g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#2e2420'); g.addColorStop(1, '#16110e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = 'rgba(120,80,50,0.25)'; ctx.lineWidth = 2; for (let y = 0; y < 1500; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); for (let x = (y / 34 % 2) * 40; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 34); ctx.stroke(); } }
  ctx.save(); ctx.translate(540, 960); const zz = lerp(1.0, 0.82, E.inOut(win(t, T.motores - 0.5, B0.b7))); ctx.scale(zz, zz); ctx.translate(-540, -960); P.steamEngine(ctx, 560, 1460, 1.25, t, { rpm: 46 }); ctx.restore(); ctx.fillStyle = '#3a2f28'; ctx.fillRect(0, 1460, W, 460); sepiaWarm(ctx, 0.3);
  const na = sm(T.nave8 - 0.2, T.nave8 + 0.3, t) * (1 - sm(T.s9 + 0.3, T.s9 + 0.8, t)); if (na > 0) { ctx.save(); ctx.globalAlpha = na; ctx.strokeStyle = 'rgba(245,247,250,0.85)'; ctx.lineWidth = 5; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 30; ctx.beginPath(); ctx.moveTo(860, 760); ctx.lineTo(830, 660); ctx.lineTo(830, 470); ctx.quadraticCurveTo(860, 360, 890, 470); ctx.lineTo(890, 660); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]); txt(ctx, '?', 860, 570, 90, C.oro, { w: 900 }); ctx.restore(); lab(ctx, 'NAVE ESPACIAL: NUNCA VISTA', null, 540, 300, t, T.nave8, T.s9 + 0.6, { col: C.oro }); }
  const ma = sm(T.motores - 0.2, T.motores + 0.4, t); if (ma > 0) { ctx.save(); ctx.globalAlpha = ma; const top = lerp(1120, 640, E.out(win(t, T.motores, T.motores + 1.6))); ctx.strokeStyle = C.fuego; ctx.lineWidth = 8; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(560, 1120); ctx.lineTo(560, top); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = 'rgba(255,90,74,0.95)'; ctx.fillRect(470, top - 12, 180, 12); ctx.restore(); lab(ctx, 'SIN MOTORES PARA SALIR DE LA TIERRA', null, 540, 420, t, T.motores + 0.3, B0.b7 + 0.2, { col: C.fuego }); }
  title(ctx, 'ANTES DE LA ERA ESPACIAL', t, B0.b6 + 0.3, T.nave8 - 0.1, {}); vign(ctx, 0.45);
 }, sfx(k) { FX.motor(k, B0.b6, B0.b7 - B0.b6, 0.6); FX.martillo(k, B0.b6 + 0.8, 4, 0.4, 0.4); FX.etiqueta(k, T.nave8); FX.tachado(k, T.motores + 0.6); } });

 // 7 · ACELERACIÓN MORTAL — corte del cañón: carga, disparo y proyectil acelerando en el tubo (cámara lenta); velocidad enorme en un
 // recorrido corto ⇒ aceleración extrema sobre los pasajeros. Visualización conceptual, sin cifras.
 B.push({ t0: B0.b7, t1: B0.b8, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const fire = T.disparo + 0.1, p = E.in(win(t, fire, fire + 1.6)), s = 26, yb = -274 + 20 + p * 254 + 2.3, gy = 1050 - yb * s * -1 * -1; const gyy = 980 + yb * s; const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#6f8fae'); g.addColorStop(1, '#d9c9a4'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const r = P.columbiadSection(ctx, 540, gyy, s, t, { p, v: t > fire ? E.out(win(t, fire, fire + 1.6)) : 0, acc: t > fire && t < fire + 1.7 ? 1 : 0, flash: sm(fire - 0.05, fire + 0.05, t) * (1 - sm(fire + 0.2, fire + 0.9, t)) }); sepiaWarm(ctx, 0.25);
  if (t > fire) { lab(ctx, 'VELOCIDAD', r.vArrow, 1010, 760, t, fire + 0.3, B0.b8, { al: 'right', col: C.cian }); lab(ctx, 'ACELERACIÓN', r.aArrow, 70, 620, t, fire + 0.2, B0.b8, { al: 'left', col: '#ff5a4a', sub: 'enorme y repentina' }); txt(ctx, 'CÁMARA LENTA', 900, 160, 32, 'rgba(245,247,250,0.8)', { f: '"IBM Plex Mono"', w: 700 }); }
  else lab(ctx, 'CARGA EXPLOSIVA', r.bottom, 70, 900, t, B0.b7 + 0.6, fire, { al: 'left', col: C.fuego });
  const ex = sm(T.aceleracion - 0.4, T.aceleracion, t); if (ex > 0) { ctx.save(); ctx.globalAlpha = ex; ctx.fillStyle = 'rgba(5,11,24,0.8)'; ctx.beginPath(); ctx.roundRect(90, 1060, 900, 300, 26); ctx.fill(); txt(ctx, 'RECORRIDO CORTO', 300, 1120, 34, C.papel); ctx.fillStyle = C.papel; ctx.fillRect(150, 1160, 300 * E.out(ex), 18); txt(ctx, 'VELOCIDAD ENORME', 760, 1120, 34, C.cian); ctx.fillStyle = C.cian; ctx.fillRect(580, 1160, 360 * E.out(ex), 18); txt(ctx, '⇒ ACELERACIÓN EXTREMA', 540, 1250, 46, '#ff6a5a', { w: 900 }); txt(ctx, 'mortal para los pasajeros', 540, 1310, 34, 'rgba(245,247,250,0.85)', { w: 600 }); ctx.restore(); }
  title(ctx, 'ACELERACIÓN EXTREMA', t, T.aceleracion - 0.2, B0.b8 + 0.1, {}); recon(ctx, 'VISUALIZACIÓN CONCEPTUAL', t, B0.b7 + 0.3, T.disparo); vign(ctx, 0.35);
 }, sfx(k) { FX.canonazo(k, T.disparo + 0.1, 0.8); FX.aceleracion(k, T.disparo + 0.1, 1.6, 0.8); FX.alarma ? 0 : 0; FX.revelar(k, T.aceleracion - 0.4); } });

 // 8 · LO ASOMBROSO — salimos del cañón: mapa de EE. UU. y Florida que se ilumina
 B.push({ t0: B0.b8, t1: B0.b9, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, B0.b8, B0.b9), g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#231C19'); g.addColorStop(1, '#3a2b20'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); P.usMap(ctx, 540, 1000, lerp(900, 1100, E.inOut(u)), t, { tilt: lerp(0.3, 0.6, u), hl: sm(T.asombroso - 0.3, T.asombroso + 0.4, t), era: 0 });
  title(ctx, '¡COINCIDENCIAS SORPRENDENTES!', t, B0.b8 + 0.3, B0.b9 + 3.0, { px: 56 }); vign(ctx, 0.4);
 }, sfx(k) { k.play('whoosh', B0.b8, { dur: 0.8, gain: 0.3 }); FX.revelar(k, T.asombroso - 0.3); } });

 // 9 · FLORIDA · 3 VIAJEROS · LUNA — un recorrido continuo une los tres elementos que imaginó Verne
 B.push({ t0: B0.b9, t1: B0.b10, in: { type: 'cut' }, draw(ctx, t) {
  const kx = (t < T.tripulacion - 0.3 ? 0 : t < T.capsula15 - 0.3 ? 1 : 2), px = lerp(0, 1080, E.inOut(win(t, T.tripulacion - 0.6, T.tripulacion))) + lerp(0, 1080, E.inOut(win(t, T.capsula15 - 0.6, T.capsula15))); const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#231C19'); g.addColorStop(1, '#3a2b20'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  ctx.save(); ctx.translate(-px, 0); const m = P.usMap(ctx, 540, 1000, 1100, t, { tilt: 0.6, hl: 1, era: 0, pins: [{ id: 'st', lon: -82.46, lat: 27.95, a: sm(T.florida14 - 0.2, T.florida14 + 0.2, t) }] }); if (m.pins.st) lab(ctx, "STONE'S HILL · FLORIDA", m.pins.st, 540, 640, t, T.florida14, B0.b10, { col: C.oro, sub: 'lugar del lanzamiento en la novela' });
  ctx.strokeStyle = 'rgba(255,212,71,0.7)'; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(m.pins.st ? m.pins.st[0] : 760, 960); ctx.quadraticCurveTo(1400, 700, 1620, 1150); ctx.quadraticCurveTo(2100, 1400, 2700, 900); ctx.stroke(); ctx.setLineDash([]);
  [[1380, 0], [1620, 1], [1860, 2]].forEach(([x, v], i) => { const a = sm(T.tripulacion + i * 0.15, T.tripulacion + 0.4 + i * 0.15, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; P.traveler1865(ctx, x, 1300, 380, t, { var: v, pose: v === 2 ? 'wave' : 'stand' }); ctx.restore(); } });
  P.moon3(ctx, 2620, 620, 220, t, { light: [-0.6, 0.2, 0.75] }); { const cp = E.inOut(win(t, T.capsula15, B0.b10)), cx = lerp(2300, 2520, cp), cy = lerp(1250, 800, cp); ctx.save(); ctx.translate(cx, cy); ctx.rotate(0.5); ctx.fillStyle = '#c6cbcd'; ctx.beginPath(); ctx.moveTo(-22, 40); ctx.lineTo(-22, -10); ctx.quadraticCurveTo(-22, -46, 0, -52); ctx.quadraticCurveTo(22, -46, 22, -10); ctx.lineTo(22, 40); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.restore(); P.engraveGrade(ctx, 0.85, t);
  const parts = [['FLORIDA', T.florida14], ['3 VIAJEROS', T.tripulacion], ['LUNA', T.luna15]]; ctx.save(); ctx.font = '900 52px Nunito'; const ws = parts.map(([s2]) => ctx.measureText(s2).width), sep = 70, tot = ws.reduce((a2, b2) => a2 + b2, 0) + sep * 2; let xx = 540 - tot / 2; parts.forEach(([s2, t0], i) => { const a = sm(t0, t0 + 0.3, t); if (a > 0) { ctx.globalAlpha = a; txt(ctx, s2, xx + ws[i] / 2, 230, 52, i === kx ? C.oro : C.blanco, { w: 900, sh: 1 }); if (i < 2) txt(ctx, '·', xx + ws[i] + sep / 2, 230, 52, C.oro, { w: 900 }); } xx += ws[i] + sep; }); ctx.restore();
 }, sfx(k) { FX.etiqueta(k, T.florida14); k.play('whoosh', T.tripulacion - 0.6, { dur: 0.6, gain: 0.25 }); FX.etiqueta(k, T.tripulacion); k.play('whoosh', T.capsula15 - 0.6, { dur: 0.6, gain: 0.25 }); FX.etiqueta(k, T.luna15); } });

 // 10 · 1969 — del mapa al Centro Espacial Kennedy: el Saturno V en la plataforma 39A; la tripulación real (fotografía NASA)
 B.push({ t0: B0.b10, t1: B0.b11, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const tm = T.apolo16 + 0.2; if (t < tm) { const u = win(t, B0.b10, tm), g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#050B18'); g.addColorStop(1, '#173F72'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); stars(ctx, t, 120, 7, 0); const m = P.usMap(ctx, 540 - 520 * E.inOut(u), 1000 - 260 * E.inOut(u), lerp(1100, 3000, E.inOut(u)), t, { tilt: 0.6, hl: 0.6, era: 1, pins: [{ id: 'kc', lon: -80.6, lat: 28.6, col: C.cian }] }); if (m.pins.kc) lab(ctx, 'CABO CAÑAVERAL · 1969', m.pins.kc, 540, 520, t, B0.b10 + 0.3, tm, { col: C.cian, sub: 'Centro Espacial Kennedy' }); P.yearRoll(ctx, 540, 300, 96, 1865, 1969, E.out(win(t, B0.b10, B0.b10 + 1.0)), {}); }
  else { const cam = shot([[tm, [120, 20, 150], [40, 52, -30], 880], [B0.b11, [150, 45, 90], [45, 55, -40], 900]], t); padScene(ctx, cam, t, {}); lab(ctx, 'SATURNO V · PLATAFORMA 39A', null, 540, 1330, t, tm + 0.2, T.armstrong - 0.2, { col: C.cian }); }
  P.floatPhoto(ctx, IMG.tripulacion, 670, 760, 580, t, T.armstrong - 0.2, B0.b11 + 0.1, { tag: 'FOTOGRAFÍA NASA · 1969', label: 'ARMSTRONG · COLLINS · ALDRIN', sub: 'tripulación del Apolo 11', from: 1, rotY: -0.12 });
 }, sfx(k) { FX.saltoTiempo(k, B0.b10, 1.4, 0.5); k.play('whoosh', T.apolo16 + 0.1, { dur: 1.0, top: 900, gain: 0.3 }); FX.revelar(k, T.armstrong - 0.2); } });

 // 11 · LA DIFERENCIA — cañón contra cohete
 B.push({ t0: B0.b11, t1: B0.b12, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, B0.b11, B0.b12); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 540, HH); ctx.clip(); ctx.translate(-270, 0); const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#6f8fae'); g.addColorStop(1, '#d9c9a4'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); P.columbiadSection(ctx, 540, 380, lerp(3.6, 3.9, u), t, { p: 0, people: true }); sepiaWarm(ctx, 0.3); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(540, 0, 540, HH); ctx.clip(); ctx.translate(270, 0); const cam = P.cam3([150, 30, 130], [0, 54, 0], lerp(1000, 1080, u)); padScene(ctx, cam, t, { arms: 1 }); ctx.restore(); ctx.fillStyle = C.blanco; ctx.fillRect(536, 0, 8, HH);
  lab(ctx, 'CAÑÓN (FICCIÓN)', null, 270, 1330, t, B0.b11 + 0.2, B0.b12 + 0.2, { col: C.papel }); lab(ctx, 'COHETE (REAL)', null, 810, 1330, t, B0.b11 + 0.35, B0.b12 + 0.2, { col: C.cian }); title(ctx, 'CAÑÓN VS. COHETE', t, B0.b11 + 0.1, B0.b12 + 0.2, {});
 }, sfx(k) { k.play('swish', B0.b11 + 0.05, { dur: 0.6, gain: 0.4 }); MUS.golpe(k, B0.b11 + 0.1, { gain: 0.6 }); } });

 // 12 · EL SATURNO V — motores, encendido y despegue; la fotografía real del lanzamiento; después, cómo acelera cada sistema
 B.push({ t0: B0.b12, t1: B0.b14, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const ig = B0.b12 + 0.6, lo = ig + 1.6, tg = t - ig, up = t > lo ? 0.5 * 2.2 * (t - lo) ** 2 + 1.0 * (t - lo) : 0, power = sm(ig, ig + 0.8, t);
  const cam = t < lo ? shot([[B0.b12, [30, -2, 40], [0, 4, 0], 800], [lo, [70, 8, 90], [0, 12, 0], 820]], t) : shot([[lo, [70, 8, 90], [0, 12, 0], 820], [T.minutos, [210, 30, 260], [0, 40 + up * 0.6, 0], 900], [B0.b14, [260, 60, 300], [0, 60 + up * 0.7, 0], 900]], t);
  padScene(ctx, cam, t, { arms: 1 - sm(ig - 0.5, lo, t), up, tg: tg > 0 ? tg : null, power, len: 300 }); const ac = sm(T.minutos - 0.4, T.minutos + 0.2, t);
  P.floatPhoto(ctx, IMG.saturno, 760, 720, 420, t, T.saturno - 0.15, T.minutos - 0.1, { tag: 'FOTOGRAFÍA NASA', label: 'LANZAMIENTO REAL', sub: '16 de julio de 1969', from: 1, rotY: -0.16 });
  if (ac > 0) { ctx.save(); ctx.globalAlpha = ac; P.accelCompare(ctx, 110, 640, 860, 420, win(t, T.minutos - 0.2, T.golpe + 0.3), t, {}); ctx.restore(); }
  recon(ctx, 'RECREACIÓN 3D', t, B0.b12 + 0.2, T.saturno - 0.2); lab(ctx, 'ACELERA DURANTE VARIOS MINUTOS', null, 540, 1330, t, T.minutos, T.s20, { col: C.cian }); lab(ctx, 'NO DE GOLPE, COMO EL CAÑÓN', null, 540, 1330, t, T.s20 + 0.1, B0.b14 + 0.2, { col: C.papel });
 }, sfx(k) { FX.encendido(k, B0.b12 + 0.6, 1.6, 1); FX.saturno(k, B0.b12 + 1.2, 6, 0.55); FX.revelar(k, T.saturno - 0.15); FX.etiqueta(k, T.minutos); } });

 // 14 · EN LA NOVELA RODEAN LA LUNA — esquema (no a escala): ruta real del Apolo 11 frente a la del proyectil de Verne
 B.push({ t0: B0.b14, t1: B0.b14b, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  space(ctx, t, 0); const ea = [260, 1150, 150], mo = [800, 440, 110]; P.earth3(ctx, ea[0], ea[1], ea[2], t, { rot: t * 0.05 }); P.moon3(ctx, mo[0], mo[1], mo[2], t, { light: [-0.7, -0.1, 0.7] });
  const ua = win(t, B0.b14 + 0.1, T.verne21), uv = win(t, T.verne21, B0.b14b + 0.2); ctx.save(); ctx.globalAlpha = 1 - 0.55 * uv; const pa = P.lunarPath(ctx, 'apollo', ea, mo, ua, t, {}); ctx.restore(); if (ua < 1) P.csm(ctx, pa.pos[0], pa.pos[1], 0.45, pa.ang); lab(ctx, 'APOLO 11 (1969)', null, 300, 760, t, B0.b14 + 0.2, B0.b14b + 0.2, { col: C.cian, sub: 'órbita terrestre → viaje → órbita lunar' });
  if (uv > 0) { const pv = P.lunarPath(ctx, 'verne', ea, mo, uv, t, { col: C.papel, lw: 6 }); ctx.save(); ctx.translate(pv.pos[0], pv.pos[1]); ctx.rotate(pv.ang + Math.PI / 2); ctx.fillStyle = '#c6cbcd'; ctx.beginPath(); ctx.moveTo(-12, 22); ctx.lineTo(-12, -6); ctx.quadraticCurveTo(-12, -26, 0, -30); ctx.quadraticCurveTo(12, -26, 12, -6); ctx.lineTo(12, 22); ctx.closePath(); ctx.fill(); ctx.restore(); lab(ctx, 'NOVELA: RODEAN LA LUNA', null, 760, 1000, t, T.rodeaban - 0.2, B0.b14b + 0.2, { col: C.papel, sub: '«Alrededor de la Luna», 1870' }); }
  txt(ctx, 'ESQUEMA · NO A ESCALA', 540, 1390, 32, 'rgba(245,247,250,0.7)', { f: '"IBM Plex Mono"', w: 700 });
 }, sfx(k) { FX.espacio(k, B0.b14, B0.b14b - B0.b14 + 0.5, 0.7); FX.etiqueta(k, T.rodeaban - 0.2); } });

 // 14b · NO CAMINARON SOBRE ELLA — el proyectil de la novela pasa sobre la superficie sin posarse
 B.push({ t0: B0.b14b, t1: B0.b15, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, B0.b14b, B0.b15); space(ctx, t, 0); P.moon3(ctx, 540, 2150, 1300, t, { rot: u * 0.2, light: [-0.5, 0.5, 0.7] }); const cx = lerp(160, 920, u), cy = 720 + Math.sin(u * Math.PI) * -60; ctx.save(); ctx.translate(cx, cy); ctx.rotate(1.2); ctx.fillStyle = '#c6cbcd'; ctx.beginPath(); ctx.moveTo(-34, 60); ctx.lineTo(-34, -14); ctx.quadraticCurveTo(-34, -70, 0, -78); ctx.quadraticCurveTo(34, -70, 34, -14); ctx.lineTo(34, 60); ctx.closePath(); ctx.fill(); ctx.restore();
  P.engraveGrade(ctx, 0.9, t); title(ctx, 'EN LA NOVELA NO ALUNIZARON', t, B0.b14b + 0.1, B0.b15 + 0.2, { px: 54 });
 }, sfx(k) { FX.tachado(k, B0.b14b + 0.5); } });

 // 15 · EL APOLO 11 SÍ LLEGÓ — el módulo lunar Eagle desciende y se posa; la fotografía auténtica de Buzz Aldrin en la superficie
 B.push({ t0: B0.b15, t1: B0.b16, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const land = B0.b15 + 1.6, u = E.out(win(t, B0.b15, land)); ctx.fillStyle = '#020306'; ctx.fillRect(0, 0, W, HH); stars(ctx, t, 90, 3, 0); P.earth3(ctx, 820, 330, 90, t, { light: [-0.7, 0.2, 0.6] });
  const gy = 1250; const gg = ctx.createLinearGradient(0, gy - 60, 0, HH); gg.addColorStop(0, '#9a9fa2'); gg.addColorStop(1, '#5e6366'); ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(0, gy); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, gy - 18 * Math.sin(x * 0.006) - 8 * Math.sin(x * 0.03)); ctx.lineTo(W, HH); ctx.lineTo(0, HH); ctx.closePath(); ctx.fill(); const R = H.rng(12); for (let k = 0; k < 26; k++) { const x = R() * W, y = gy + 40 + R() * 600, rr = 10 + R() * 50; ctx.fillStyle = 'rgba(60,64,67,0.45)'; ctx.beginPath(); ctx.ellipse(x, y, rr, rr * 0.3, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(200,204,206,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y - 2, rr, rr * 0.3, 0, Math.PI, TAU); ctx.stroke(); }
  const ly = lerp(560, gy + 30, u), th = 1 - sm(land - 0.2, land, t); if (th > 0.02) { const d = cl((ly - 900) / 400); ctx.fillStyle = `rgba(190,190,185,${0.35 * d * th})`; ctx.beginPath(); ctx.ellipse(400, gy + 30, 260 * d, 40 * d, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(400 + 120, gy + 34, 220 * (0.4 + u * 0.6), 20, 0, 0, TAU); ctx.fill(); P.eagleLM(ctx, 400, ly, 1.25, t, { legs: 1, thrust: th * 0.8 });
  P.floatPhoto(ctx, IMG.aldrin, 790, 820, 420, t, land - 0.3, B0.b16 + 0.2, { tag: 'FOTOGRAFÍA NASA · 1969', label: 'BUZZ ALDRIN EN LA LUNA', sub: 'junto al Eagle', from: 1, rotY: -0.14 });
  lab(ctx, 'EAGLE · MÓDULO LUNAR', null, 300, 300, t, B0.b15 + 0.2, land + 0.4, { col: C.cian }); lab(ctx, 'ARMSTRONG Y ALDRIN CAMINARON', null, 540, 1330, t, land + 0.2, B0.b16 + 0.2, { col: C.cian, sub: 'Collins quedó en órbita lunar' });
 }, sfx(k) { FX.revelar(k, B0.b15 + 1.3); FX.llegada(k, B0.b15 + 1.6, 0.5); } });

 // 16 · DE LA IMAGINACIÓN A LA REALIDAD — 1865 ficción frente a 1969 realidad; se funden en la Luna y la Tierra
 B.push({ t0: B0.b16, t1: B0.b17, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, B0.b16, B0.b17), mg = sm(B0.b17 - 1.4, B0.b17, t); space(ctx, t, 0); P.moon3(ctx, 540, lerp(1500, 1250, mg), lerp(420, 520, mg), t, { light: [-0.6, 0.3, 0.7] });
  ctx.save(); ctx.globalAlpha = 1 - mg; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 540, 1150); ctx.clip(); ctx.translate(-270, 0); P.columbiad3(ctx, P.cam3([15, 9, 21], [0, 6.5, 0], lerp(820, 900, u)), t, { cap: 4, palms: true }); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 540, 1150); ctx.clip(); P.engraveGrade(ctx, 1, t); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(540, 0, 540, 1150); ctx.clip(); ctx.translate(270, 0); padScene(ctx, P.cam3([150, 30, 130], [0, 56, 0], lerp(900, 980, u)), t, { arms: 1, skyTop: '#050B18', skyMid: '#173F72' }); ctx.restore(); ctx.fillStyle = C.blanco; ctx.fillRect(536, 0, 8, 1150);
  txt(ctx, '1865 · FICCIÓN', 270, 1080, 44, C.papel, { w: 900, sh: 1 }); txt(ctx, '1969 · REALIDAD', 810, 1080, 44, C.cian, { w: 900, sh: 1 }); ctx.restore();
  title(ctx, 'DE LA IMAGINACIÓN A LA REALIDAD', t, B0.b16 + 0.2, B0.b17 + 0.3, { px: 52 });
 }, sfx(k) { MUS.golpe(k, B0.b16 + 0.1, { gain: 0.5 }); k.play('whoosh', B0.b17 - 1.4, { dur: 1.2, top: 800, gain: 0.25 }); } });

 // 17 · CIERRE — la Luna en primer plano, la Tierra a lo lejos; la cámara asciende; «ASOMBROTECA» discreto
 B.push({ t0: B0.b17, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const u = E.inOut(win(t, B0.b17, DURATION)); space(ctx, t, u * 200); P.earth3(ctx, lerp(760, 700, u), lerp(620, 420, u), lerp(80, 110, u), t, { rot: t * 0.05, light: [-0.6, 0.3, 0.7] }); P.moon3(ctx, 540, lerp(1250, 1700, u), lerp(520, 640, u), t, { rot: t * 0.02, light: [-0.6, 0.3, 0.7] });
  const a = sm(T.asombroteca, T.asombroteca + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(245,247,250,0.75)'; ctx.lineWidth = 2; const lw = 230 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 230); ctx.lineTo(540 + lw, 230); ctx.moveTo(540 - lw, 338); ctx.lineTo(540 + lw, 338); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 285, 54, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
 }, sfx(k) { FX.espacio(k, B0.b17, DURATION - B0.b17, 0.6); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.end + 0.6); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['1865,', 'Luna', 'Florida!', 'Apolo', 'Julio', 'Verne,', 'Luna».', 'cápsula', 'cañón', 'gigantesco', 'nave', 'motores', 'locura.', 'aceleración', 'mortal.', 'asombroso.', 'Florida', 'tres', 'Luna.', '1969,', 'Armstrong,', 'Aldrin', 'Collins.', 'fundamental.', 'Saturno', 'minutos,', 'golpe.', 'rodeaban', 'caminaron', 'ingeniería', 'espacio?', 'Asombroteca!'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 380, q: 0.6, gain: 0.008, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   MUS.piano(k, 0, B0.b6, { bpm: 72, gain: 0.85, strings: 0.6, chords: [['D3', 'F3', 'A3', 'D4'], ['A#2', 'D3', 'F3', 'A#3'], ['F2', 'A2', 'C3', 'F3'], ['A2', 'C#3', 'E3', 'A3']] });
   MUS.pulso(k, B0.b6, B0.b8, { bpm: 100, gain: 0.7, chords: [['D3', 'F3', 'A3', 'D4'], ['A#2', 'D3', 'F3', 'A#3'], ['G2', 'A#2', 'D3', 'G3'], ['A2', 'C#3', 'E3', 'A3']] });
   MUS.epica(k, B0.b8, B0.b10, { bpm: 84, gain: 0.6, drums: 0, strings: 0.8, ostinato: 0.3, chords: [['F2', 'C3', 'F3', 'A3'], ['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3'], ['C2', 'G2', 'C3', 'E3']] });
   MUS.epica(k, B0.b10, B0.b14, { bpm: 92, gain: 0.85, drums: 0.7, strings: 1, ostinato: 0.6, chords: [['D2', 'A2', 'D3', 'F#3'], ['G2', 'D3', 'G3', 'B3'], ['A2', 'E3', 'A3', 'C#4'], ['D2', 'A2', 'D3', 'F#3']] });
   MUS.piano(k, B0.b14, B0.b17, { bpm: 68, gain: 0.75, strings: 0.8, chords: [['D3', 'F#3', 'A3', 'D4'], ['B2', 'D3', 'F#3', 'B3'], ['G2', 'B2', 'D3', 'G3'], ['A2', 'C#3', 'E3', 'A3']] });
   MUS.epica(k, B0.b17, DURATION, { bpm: 76, gain: 0.7, drums: 0, strings: 0.9, ostinato: 0.2, chords: [['G2', 'D3', 'G3', 'B3'], ['D2', 'A2', 'D3', 'F#3'], ['E2', 'B2', 'E3', 'G3'], ['D2', 'A2', 'D3', 'F#3']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { for (const k of Object.keys(window.FOTOS || {})) { IMG[k] = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = window.FOTOS[k]; }); } }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
