// =====================================================================================================
// episodio.js — «Yakhchal: hielo en el desierto» · Asombroteca · Ep. 03 · PLANTILLA v1.20 (módulo yakhchal)
// MODELO MAESTRO ÚNICO (P.YK, dm; x = este, z = sur): cúpula escalonada con entrada al sur, camino, estanque al NORTE del muro de
// sombra este–oeste, canal desde el oeste. Las sombras salen del mismo vector solar (sol al sur). La sección técnica (P.ykSection)
// es el mismo modelo visto desde el este (norte a la derecha), alineada con la cámara 3D para pasar del exterior al corte sin saltos.
// Trayectoria: desierto → edificio → invierno → estanque → congelación (varias noches, tiempo acelerado) → extracción → depósito →
// aislamiento → sombra → verano → ciclo de estaciones. Flechas naranjas = energía térmica; azules = menor temperatura.
// Fotografía A (yakhchal de Meybod, Ggia, CC BY-SA 3.0) solo si js/fotos.js la carga (versión «con foto»). Reloj = voz original.
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
 const TB = { b2: T.y1 - 0.2, b3: T.eso - 0.2, b4: T.pero3 - 0.2, b5: T.la5 - 0.2, b6: T.los6 - 0.2, b7: T.algunas7 - 0.2, b8: T.pero8 - 0.2, b10: T.en10 - 0.2, b10b: T.col11 - 0.15, b11: T.el12 - 0.2, b12: T.despues - 0.2, b13: T.y15 - 0.2, b14: T.el16 - 0.2, b15: T.sus18 - 0.2, b16: T.ademas - 0.2, b17: T.asi - 0.2, b18: T.no23 - 0.2, b18b: T.habian - 0.2, b19: T.conocias - 0.2, b20: T.cuentanos - 0.2 };

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

 const B = [];
 // 1 · GANCHO — desierto abrasador y, en el horizonte, el cono del yakhchal: ¿hielo aquí?
 B.push({ t0: 0, t1: TB.b2, in: { type: 'cut' }, draw(ctx, t) {
  const z = lerp(1.15, 1.0, E.out(win(t, 0, TB.b2))); ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540, -1100); P.ykDesert(ctx, t, { heat: 1, horizon: 1120, sunX: 800, sunY: 360 });
  const hx = 300, hy = 1110, hs = 0.9; ctx.fillStyle = '#c99e6a'; for (let j = 0; j < 9; j++) { const r = 95 * (1 - 0.86 * (j / 9)), y0 = hy - j * 18 * hs; ctx.fillRect(hx - r * hs, y0 - 18 * hs, 2 * r * hs, 18 * hs + 1); ctx.fillStyle = j % 2 ? '#c99e6a' : '#d2a874'; } ctx.restore();
  const s = sm(T.calor0 - 0.4, T.calor0 + 0.3, t); if (s > 0) { for (let k = 0; k < 5; k++) heatArrow(ctx, 800 + Math.cos(1.9 + k * 0.28) * 120, 360 + Math.sin(1.9 + k * 0.28) * 120, 800 + Math.cos(1.9 + k * 0.28) * (260 + 30 * Math.sin(t * 4 + k)), 360 + Math.sin(1.9 + k * 0.28) * (260 + 30 * Math.sin(t * 4 + k)), s, 9); }
  scrimTop(ctx, 0.3); title(ctx, '¿HIELO EN EL DESIERTO?', t, 0.25, { px: 58, era: 0 }); tag(ctx, 'CALOR INTENSO', 800, 640, t, T.calor0, {});
 }, sfx(k) { FX.viento(k, 0, TB.b2 + 0.3, 0.6); FX.calor(k, 0.2, 3.5); FX.aparece(k, 0.25, 520); } });

 // 2 · ENORMES BLOQUES DE HIELO — dentro, en la penumbra fresca, bloques apilados; un haz de luz entra por el acceso. Sin electricidad.
 B.push({ t0: TB.b2, t1: TB.b3, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#2b2219'); g.addColorStop(1, '#120e0a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.save(); ctx.translate(540, 1000); ctx.scale(lerp(1, 1.08, win(t, TB.b2, TB.b3)), lerp(1, 1.08, win(t, TB.b2, TB.b3))); ctx.translate(-540, -1000);
  ctx.fillStyle = '#3b2e22'; ctx.beginPath(); ctx.moveTo(0, 1700); ctx.lineTo(0, 700); ctx.quadraticCurveTo(540, -200, 1080, 700); ctx.lineTo(1080, 1700); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(90,65,40,0.35)'; ctx.lineWidth = 2; for (let y = 300; y < 1700; y += 46) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); }
  const bm = ctx.createLinearGradient(760, 300, 460, 1500); bm.addColorStop(0, 'rgba(255,230,180,0.0)'); bm.addColorStop(0.3, 'rgba(255,230,180,0.18)'); bm.addColorStop(1, 'rgba(255,230,180,0)'); ctx.fillStyle = bm; ctx.beginPath(); ctx.moveTo(820, 380); ctx.lineTo(900, 380); ctx.lineTo(760, 1500); ctx.lineTo(380, 1500); ctx.closePath(); ctx.fill();
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5 - (r > 2 ? 1 : 0); c++) { const x = 230 + c * 160 + (r % 2) * 60 + (r > 2 ? 60 : 0), y = 1440 - r * 105; P.iceBlock(ctx, x, y, 150, 98, {}); } ctx.restore();
  const a = sm(T.hielo1 - 0.2, T.hielo1 + 0.4, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a * (0.5 + 0.5 * Math.sin(t * 5)); ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (const [x, y] of [[300, 1300], [620, 1200], [470, 1110], [760, 1390]]) { ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 4, y); ctx.lineTo(x, y + 14); ctx.lineTo(x - 4, y); ctx.closePath(); ctx.fill(); } ctx.restore(); }
  const e = sm(T.electricidad - 0.3, T.electricidad + 0.2, t); if (e > 0) { ctx.save(); ctx.globalAlpha = e; ctx.fillStyle = 'rgba(11,20,36,0.88)'; ctx.beginPath(); ctx.arc(540, 520, 105, 0, TAU); ctx.fill(); ctx.strokeStyle = C.blanco; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(515, 470); ctx.lineTo(515, 505); ctx.moveTo(565, 470); ctx.lineTo(565, 505); ctx.stroke(); ctx.beginPath(); ctx.roundRect(495, 500, 90, 50, 12); ctx.stroke(); ctx.beginPath(); ctx.moveTo(540, 550); ctx.lineTo(540, 590); ctx.stroke(); ctx.strokeStyle = '#e8505b'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(470, 450); ctx.lineTo(610, 590); ctx.stroke(); ctx.restore(); pill(ctx, 'SIN ELECTRICIDAD', 540, 690, t, T.electricidad, { px: 40 }); }
  scrimTop(ctx, 0.3); title(ctx, 'ENORMES BLOQUES DE HIELO', t, T.hielo1 - 0.3, { era: 0 }); recon(ctx, t, TB.b2 + 0.4);
 }, sfx(k) { k.noise(TB.b2, { dur: TB.b3 - TB.b2, color: 'brown', filter: 'lowpass', f: 300, gain: 0.04, a: 0.5, hold: 3 }); FX.hieloCrujir(k, T.hielo1 - 0.2, 1.4, 0.8); k.play('sparkle', T.hielo1, { gain: 0.3 }); FX.tachado(k, T.electricidad); } });

 // 3 · ANTIGUA PERSIA — el complejo en el paisaje, con la ciudad al fondo (vista desde el noreste, luz cálida)
 B.push({ t0: TB.b3, t1: TB.b4, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = shot([[TB.b3, [900, 200, -560], [0, 70, 80], 820], [TB.b4, [760, 170, -470], [0, 75, 60], 860]], t); P.ykWorld(ctx, cam, t, { sun: P.ykSun(25, 220), town: true, water: 0 });
  scrimTop(ctx, 0.35); title(ctx, 'ANTIGUA PERSIA', t, T.persia - 0.4, { era: 0, px: 56 }); tag(ctx, 'ACTUAL IRÁN', 540, 300, t, T.persia + 0.1); recon(ctx, t, TB.b3 + 0.4);
 }, sfx(k) { FX.viento(k, TB.b3, TB.b4 - TB.b3, 0.5); FX.aparece(k, T.persia - 0.4, 500); } });

 // 4 · ¿CÓMO LO CONSERVABAN? — un bloque de hielo bajo el sol del desierto: el calor (flechas naranjas) lo derrite
 B.push({ t0: TB.b4, t1: TB.b5, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  P.ykDesert(ctx, t, { heat: 1, horizon: 1180, sunX: 760, sunY: 380 }); const m = sm(T.frio4, TB.b5, t) * 0.35; P.iceBlock(ctx, 540, 1180, 330, 210, { melt: m });
  const ha = sm(T.como4, T.como4 + 0.5, t); for (let k = 0; k < 5; k++) { const a = 1.85 + k * 0.17, r0 = 110, r1 = 300 + 25 * Math.sin(t * 3 + k); heatArrow(ctx, 760 + Math.cos(a) * r0, 380 + Math.sin(a) * r0, 760 + Math.cos(a) * r1, 380 + Math.sin(a) * r1, ha, 10); }
  for (let k = 0; k < 4; k++) heatArrow(ctx, 230 + k * 210, 1500, 380 + k * 100, 1310, ha * 0.8, 8);
  scrimTop(ctx, 0.35); title(ctx, '¿CÓMO LO CONSERVABAN?', t, T.como4 - 0.1, { era: 0 }); tag(ctx, 'FLECHAS NARANJAS = ENERGÍA TÉRMICA', 540, 300, t, T.frio4, { col: C.calor });
 }, sfx(k) { k.play('whoosh', TB.b4 + 0.05, { dur: 0.4, top: 1600, gain: 0.25 }); FX.calor(k, T.como4, 3.5); FX.goteo(k, T.frio4 + 0.5, 6, 0.4, 3); } });

 // 5 · ARQUITECTURA + FÍSICA — la sección técnica del mismo modelo, con el calor que intenta entrar
 B.push({ t0: TB.b5, t1: TB.b6, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  sky(ctx, 0); const s = 3.1, ox = 540, gy = 1050; P.ykSection(ctx, ox, gy, s, t, { flip: true, ice: 0.75, heat: sm(T.fisica - 0.3, T.fisica + 0.3, t), sun: SUN_SUMMER });
  pill(ctx, 'ARQUITECTURA', 300, 1250, t, T.arquitectura - 0.1, { px: 40, era: 0 }); pill(ctx, 'FÍSICA', 790, 1250, t, T.fisica - 0.1, { px: 40 }); txt(ctx, '+', 560, 1250, 56, C.oro, { w: 900 });
  scrimTop(ctx, 0.35); title(ctx, 'ARQUITECTURA Y FÍSICA', t, T.la5 + 0.2, { era: 0 }); recon(ctx, t, TB.b5 + 0.4);
 }, sfx(k) { FX.aparece(k, T.arquitectura - 0.1, 480); FX.aparece(k, T.fisica - 0.1, 620); } });

 // 6 · YAKHCHAL — la cúpula escalonada en 3D; FOTOGRAFÍA ACTUAL de Meybod (si está cargada) y vuelta al modelo
 B.push({ t0: TB.b6, t1: TB.b7, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = shot([[TB.b6, [560, 60, -330], [0, 85, 0], 900], [TB.b7, [430, 50, -250], [0, 88, 0], 900]], t); P.ykWorld(ctx, cam, t, { sun: P.ykSun(40, 215), town: true });
  const t0 = TB.b6 + 0.2, t1 = T.yakhchal + 0.55, ph = IMG.meybod; if (ph) { dimAll(ctx, 0.62 * sm(t0, t0 + 0.5, t) * (1 - sm(t1 - 0.5, t1, t))); P.photoCard(ctx, ph, 540, 760, 920, 650, t, t0, t1, { tag: 'FOTOGRAFÍA ACTUAL', label: 'YAKHCHAL DE MEYBOD · IRÁN', credit: 'Foto: Ggia · CC BY-SA 3.0', zoom: [0.5, 0.45, 1, 0.5, 0.45, 1.04] }); }
  scrimTop(ctx, 0.35); title(ctx, 'YAKHCHAL', t, T.yakhchal - 0.25, { era: 0, px: 64 }); tag(ctx, '«POZO DE HIELO» EN PERSA', 540, 300, t, T.yakhchal + 0.1); if (!ph || t > t1) recon(ctx, t, ph ? t1 : TB.b6 + 0.4);
 }, sfx(k) { FX.viento(k, TB.b6, TB.b7 - TB.b6, 0.4); k.play('shutter', TB.b6 + 0.25, { gain: 0.3 }); FX.sello(k, T.yakhchal - 0.2); } });

 // 7 · CÚPULAS QUE AÍSLAN — acercamiento a la envolvente de adobe y paso a la sección (mismo modelo, misma escala, vista desde el este)
 B.push({ t0: TB.b7, t1: TB.b8, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const tc = T.aislar - 0.4, cam = shot([[TB.b7, [520, 40, -200], [0, 90, 0], 900], [tc, CAM_E(430, 1000, 80).pos, [0, 80, 0], 1000]], t); const sec = secFrom(CAM_E(430, 1000, 80));
  if (t < tc + 0.6) { P.ykWorld(ctx, cam, t, { sun: SUN_SUMMER }); }
  const w = sm(tc, tc + 0.6, t); if (w > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * w, HH); ctx.clip(); sky(ctx, 0); P.ykSection(ctx, sec.ox, sec.gy, sec.s, t, { flip: true, ice: 0.75, heat: sm(T.aislar, T.aislar + 0.5, t), sun: SUN_SUMMER }); ctx.restore(); if (w < 1) { ctx.fillStyle = C.oro; ctx.fillRect(W * w - 3, 0, 6, HH); } }
  pill(ctx, 'CÚPULA DE ADOBE', 540, 1270, t, T.cupulas, { px: 36, era: 0, t1: tc + 0.3 }); if (w >= 1) { lead(ctx, [sec.ox - P.ykR(60) * sec.s + 10, sec.gy - 60 * sec.s], 260, 1270, sm(T.aislar + 0.2, T.aislar + 0.6, t)); pill(ctx, 'PAREDES MUY GRUESAS', 300, 1270, t, T.aislar + 0.2, { px: 34, era: 0 }); tag(ctx, 'EL CALOR ENTRA MÁS DESPACIO', 700, 1350, t, T.exterior7 - 0.2, { col: C.calor }); }
  scrimTop(ctx, 0.35); title(ctx, 'AISLAR DEL CALOR EXTERIOR', t, T.cupulas - 0.2, { era: 0 }); recon(ctx, t, TB.b7 + 0.3, { y: 300 });
 }, sfx(k) { k.play('whoosh', TB.b7 + 0.2, { dur: 1.4, top: 900, gain: 0.25 }); k.play('swish', T.aislar - 0.4, { dur: 0.6, gain: 0.4 }); FX.calor(k, T.aislar, 2); FX.etiqueta(k, T.aislar + 0.2); } });

 // 8 · EL COMPLEJO + 9 · INVIERNO — vista aérea orientada (brújula): cúpula, camino, estanque, muro de sombra, canal; llega la noche de invierno
 B.push({ t0: TB.b8, t1: TB.b10, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const nt = sm(T.secreto, T.invierno9 + 0.3, t), cam = shot([[TB.b8, [300, 1050, 720], [0, 0, 120], 1000], [TB.b10, [250, 950, 680], [0, 0, 140], 1000]], t), r = P.ykWorld(ctx, cam, t, { sun: SUN_WINTER, night: nt });
  P.ykCompass(ctx, cam, 930, 330);
  const L = [['CÚPULA', [0, Y.H, 0], 230, 640], ['CAMINO', [0, 0, 145], 820, 820], ['ESTANQUE', [0, 1, 245], 250, 1080], ['MURO DE SOMBRA', [0, Y.swall.h, 326], 700, 1290], ['CANAL', [-560, 1, Y.canal.z], 230, 1340]];
  L.forEach(([s, p, x, y], i) => { const t0 = TB.b8 + 0.2 + i * 0.32, a = sm(t0, t0 + 0.3, t) * (1 - sm(T.secreto - 0.3, T.secreto, t)); if (a <= 0) return; lead(ctx, r.pr(p), x, y, a); pill(ctx, s, x, y, t, t0, { px: 32, era: 0, t1: T.secreto }); });
  if (nt > 0.05) { P.seasonDial(ctx, 540, 1100, 90, 0.02); }
  scrimTop(ctx, 0.35); title(ctx, nt < 0.5 ? 'EL COMPLEJO COMPLETO' : 'EL SECRETO: EL INVIERNO', t, nt < 0.5 ? TB.b8 + 0.1 : T.secreto, { era: nt < 0.5 ? 0 : 1 }); tag(ctx, 'ESTANQUE AL NORTE DEL MURO (ESTE–OESTE)', 540, 300, t, TB.b8 + 1.0, { t1: T.secreto, col: C.frio });
 }, sfx(k) { for (let i = 0; i < 5; i++) FX.etiqueta(k, TB.b8 + 0.2 + i * 0.32); FX.saltoTiempo(k, T.secreto, 1.4, 0.6); k.noise(T.invierno9, { dur: TB.b10 - T.invierno9 + 0.5, color: 'pink', filter: 'bandpass', f: 600, q: 0.6, gain: 0.03, a: 0.6, hold: 0.5 }); } });

 // 10 · NOCHES FRÍAS Y ESTANQUES POCO PROFUNDOS — de noche, el agua del canal entra en el estanque; detalle: lámina de pocos cm
 B.push({ t0: TB.b10, t1: TB.b11, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const tf = TB.b10b + 0.9, wa = win(t, T.agua11 - 0.4, T.profundos);
  if (t < tf + 0.4) { const cam = shot([[TB.b10, [180, 900, 60], [-60, 0, 245], 1000], [tf + 0.4, [100, 700, 120], [-120, 0, 245], 1000]], t); const rw = P.ykWorld(ctx, cam, t, { sun: SUN_WINTER, night: 0.6, water: wa }); const la = sm(TB.b10 + 0.4, TB.b10 + 0.8, t) * (1 - sm(tf, tf + 0.3, t)); lead(ctx, rw.pr([150, 1, 245]), 820, 1050, la, C.frio); pill(ctx, 'ESTANQUE', 820, 1050, t, TB.b10 + 0.4, { px: 34, t1: tf + 0.3 }); lead(ctx, rw.pr([-500, 1, Y.canal.z]), 300, 700, la, C.frio); pill(ctx, 'CANAL', 300, 700, t, TB.b10 + 0.6, { px: 34, t1: tf + 0.3 }); }
  const f = sm(tf, tf + 0.4, t); if (f > 0) { ctx.save(); ctx.globalAlpha *= f; ctx.fillStyle = C.noche; ctx.fillRect(0, 0, W, HH); const R = H.rng(4); for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(230,240,255,${0.3 + R() * 0.6})`; ctx.fillRect(R() * W, R() * 700, 2, 2); } P.pondSection(ctx, 120, 860, 840, 300, t, { water: wa, freeze: 0, layers: 0, loss: sm(tf + 0.2, tf + 0.8, t) }); ctx.restore(); P.dimLine(ctx, 1010, 1112, 1010, 1160, '', { a: f }); tag(ctx, '≈ 5–10 CM EN ALGUNAS INSTALACIONES', 540, 1290, t, T.profundos - 0.1, { px: 32 }); tag(ctx, 'GROSOR EXAGERADO PARA VERLO', 540, 1365, t, T.profundos + 0.2, { col: C.frio }); }
  scrimTop(ctx, 0.3); title(ctx, t < tf ? 'NOCHES SUFICIENTEMENTE FRÍAS' : 'ESTANQUES POCO PROFUNDOS', t, t < tf ? T.noches - 0.2 : tf, { px: 48 }); if (t < tf) tag(ctx, 'AGUA DEL CANAL', 540, 300, t, T.agua11 - 0.2, { col: C.frio });
 }, sfx(k) { k.noise(TB.b10, { dur: TB.b11 - TB.b10, color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.03, a: 0.6, hold: 4 }); FX.agua(k, T.agua11 - 0.4, 2.4); FX.etiqueta(k, T.profundos - 0.1); } });

 // 11 · SE CONGELABA, CAPA A CAPA — el agua cede energía al cielo y al aire; el hielo crece desde la superficie; varias noches (tiempo acelerado)
 B.push({ t0: TB.b11, t1: TB.b12, in: { type: 'cut' }, draw(ctx, t) {
  ctx.fillStyle = C.noche; ctx.fillRect(0, 0, W, HH); const R = H.rng(4); for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(230,240,255,${0.3 + R() * 0.6})`; ctx.fillRect(R() * W, R() * 700, 2, 2); }
  const n1 = T.congelaba - 0.2, n1e = T.y13 + 0.2, nL = 3, span = (TB.b12 - 0.3 - n1e) / (nL - 1); let layers = 0, freeze = E.inOut(win(t, n1, n1e)), night = 1; if (t > n1e) { const k = Math.min(nL - 1, Math.floor((t - n1e) / span)), fr = (t - n1e - k * span) / span; layers = 1 + k; freeze = k < nL - 1 ? E.inOut(cl(fr * 1.3 - 0.15)) : 1; if (k >= nL - 1) { layers = nL; freeze = 0; } }
  const wf = layers >= nL ? 0 : 1; P.pondSection(ctx, 120, 860, 840, 300, t, { water: wf, freeze, layers, loss: 1 - sm(TB.b12 - 0.6, TB.b12, t) });
  const nn = Math.min(nL, 1 + Math.floor(Math.max(0, t - n1e) / span)); ctx.save(); ctx.fillStyle = 'rgba(11,20,36,0.88)'; ctx.beginPath(); ctx.roundRect(330, 1240, 420, 110, 24); ctx.fill(); ctx.restore(); txt(ctx, 'NOCHE ' + nn, 540, 1295, 52, C.frio, { w: 900 }); tag(ctx, 'TIEMPO ACELERADO · VARIAS NOCHES', 540, 1385, t, n1e, { col: C.oro });
  pill(ctx, 'EL AGUA PIERDE ENERGÍA HACIA EL CIELO Y EL AIRE', 540, 760, t, TB.b11 + 0.1, { px: 30, t1: n1e + 0.2 });
  scrimTop(ctx, 0.3); title(ctx, t < n1e ? 'EL AGUA SE CONGELABA' : 'CAPAS DE HIELO', t, t < n1e ? TB.b11 + 0.1 : n1e);
 }, sfx(k) { FX.escarcha(k, T.congelaba - 0.2, 1.8, 0.9); FX.hieloCrujir(k, T.congelaba + 0.4, 1.4, 0.7); for (let i = 0; i < 3; i++) FX.saltoTiempo(k, T.y13 + 0.2 + i * 1.0, 0.6, 0.35); FX.hieloCrujir(k, T.capas, 1.0, 0.8); } });

 // 12 · CORTAR Y TRASLADAR — vista lateral (norte a la derecha): un trabajador corta con el pico; otros llevan los bloques por el camino hasta la entrada
 B.push({ t0: TB.b12, t1: TB.b13, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  sky(ctx, 0.15); const s = 8, gy = 1180, ox = 1700, X = (z) => ox - z * s; ctx.fillStyle = '#d7b98a'; ctx.fillRect(0, gy, W, HH - gy); ctx.fillStyle = '#e2c9a0'; ctx.fillRect(X(Y.path.z1), gy - 2, (Y.path.z1 - Y.path.z0) * s, 6);
  ctx.fillStyle = '#9c8060'; ctx.fillRect(X(Y.pond.z1 + 6), gy - 4, (Y.pond.z1 - Y.pond.z0 + 12) * s, 10); const cutP = win(t, T.cortaban - 0.2, TB.b13); for (let i = 0; i < 9; i++) { const z = Y.pond.z0 + 6 + i * 12; if (z + 12 > Y.pond.z1) continue; const gone = i < Math.floor(cutP * 4); if (!gone) P.iceBlock(ctx, X(z + 6), gy - 12, 12 * s - 3, 18, {}); }
  // cúpula al norte (derecha) con su entrada al sur, en la misma escala
  ctx.save(); ctx.fillStyle = '#c99e6a'; for (let j = 0; j < Y.n; j++) { const y0 = (Y.H * j) / Y.n, r = P.ykR(y0 + 0.1); ctx.fillStyle = j % 2 ? '#c99e6a' : '#d2a874'; ctx.fillRect(ox - r * s, gy - (y0 + Y.H / Y.n) * s, 2 * r * s, (Y.H / Y.n) * s + 1); } ctx.fillStyle = '#2b2017'; ctx.beginPath(); ctx.moveTo(X(P.ykR(1)) - 2, gy); ctx.lineTo(X(P.ykR(1)) - 2, gy - Y.entH * s * 0.6); ctx.quadraticCurveTo(X(P.ykR(1)) + 6, gy - Y.entH * s, X(P.ykR(1)) + 14, gy - Y.entH * s * 0.6); ctx.lineTo(X(P.ykR(1)) + 14, gy); ctx.closePath(); ctx.fill(); ctx.restore();
  const hpx = 17 * s; P.persianWorker(ctx, X(Y.pond.z0 + 8), gy, hpx, t, { pose: 'pick', lift: 0.5 + 0.5 * Math.sin(t * 5.5), var: 0, dir: -1 });
  for (let i = 0; i < 2; i++) { const t0 = T.trasladaban - 0.9 + i * 0.9, u = win(t, t0, t0 + 2.6); if (u <= 0 || u >= 1) continue; const z = lerp(Y.pond.z0 - 4, Y.path.z0 + 2, u), d = (Y.pond.z0 - z) * s; P.persianWorker(ctx, X(z), gy, hpx, t, { pose: 'carry', ph: d / (hpx * 0.8), var: 1 + i, dir: 1 }); }
  pill(ctx, 'CORTAR LOS BLOQUES', 300, 1320, t, T.cortaban - 0.1, { px: 34, era: 0, t1: T.trasladaban }); pill(ctx, 'LLEVARLOS AL DEPÓSITO', 560, 1320, t, T.trasladaban, { px: 34, era: 0 });
  scrimTop(ctx, 0.3); title(ctx, 'CORTAR Y TRASLADAR', t, TB.b12 + 0.1, { era: 0 }); recon(ctx, t, TB.b12 + 0.4, { y: 380 }); tag(ctx, 'ESTANQUE  ←  SUR · NORTE  →  CÚPULA', 540, 300, t, TB.b12 + 0.5, { col: C.frio });
 }, sfx(k) { for (let x = T.cortaban - 0.1; x < TB.b13; x += 1.15) FX.pico(k, x, 0.8); for (let i = 0; i < 2; i++) k.play('stroke', T.trasladaban - 0.9 + i * 0.9, { material: 'chalk', dur: 2.4, gain: 0.25 }); FX.bloque(k, T.depositos + 0.2, 0.8); } });

 // 13 · LA VERDADERA INGENIERÍA — exterior desde el este que se convierte en el CORTE del mismo edificio (misma posición y escala)
 B.push({ t0: TB.b13, t1: TB.b14, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = CAM_E(430, 1000, 80), sec = secFrom(cam), w = sm(T.ingenieria - 0.6, T.ingenieria + 0.2, t);
  P.ykWorld(ctx, cam, t, { sun: SUN_WINTER }); if (w > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * w, HH); ctx.clip(); sky(ctx, 0); P.ykSection(ctx, sec.ox, sec.gy, sec.s, t, { flip: true, ice: 0.3 }); ctx.restore(); if (w < 1) { ctx.fillStyle = C.oro; ctx.fillRect(W * w - 3, 0, 6, HH); } }
  scrimTop(ctx, 0.35); title(ctx, 'LA VERDADERA INGENIERÍA', t, T.y15 + 0.1, { era: 0 }); tag(ctx, 'CORTE NORTE–SUR (VISTO DESDE EL ESTE)', 540, 300, t, T.ingenieria, { col: C.frio }); recon(ctx, t, TB.b13 + 0.3, { y: 380 });
 }, sfx(k) { k.play('riser', TB.b13 + 0.2, { dur: 1.6, gain: 0.25 }); k.play('swish', T.ingenieria - 0.6, { dur: 0.8, gain: 0.45 }); } });

 // 14 · DEPÓSITO BAJO TIERRA — acercamiento al pozo: los trabajadores bajan la escalera y colocan los bloques
 B.push({ t0: TB.b14, t1: TB.b15, in: { type: 'cut' }, draw(ctx, t) {
  const s0 = secFrom(CAM_E(430, 1000, 80)), u = E.inOut(win(t, TB.b14, TB.b14 + 1.6)), s = lerp(s0.s, 6.2, u), ox = lerp(s0.ox, 540, u), gy = lerp(s0.gy, 700, u), ice = lerp(0.3, 0.72, win(t, TB.b14 + 1.0, TB.b15 - 0.4));
  sky(ctx, 0); P.ykSection(ctx, ox, gy, s, t, { flip: true, ice }); const X = (z) => ox - z * s, Yp = (y) => gy - y * s, hpx = 17 * s;
  const st = (k) => [X(Y.pitR - 4 - k * 4.2 - 2.1), Yp(-k * (Y.pitD / 9))]; const cyc = ((t - TB.b14) / 2.6) % 1, k = Math.min(8, cyc * 10); const p = st(Math.floor(k)); if (u > 0.6) P.persianWorker(ctx, p[0], p[1], hpx, t, { pose: k < 8 ? 'carry' : 'lower', ph: k * 0.5, lift: 0.4, var: 1, dir: 1 });
  const top = -Y.pitD + ice * (Y.pitD + 30); if (u > 0.6) P.persianWorker(ctx, X(-20), Yp(Math.min(top, -2)), hpx, t, { pose: 'lower', lift: 0.5 + 0.5 * Math.sin(t * 2), var: 2, dir: -1 });
  pill(ctx, 'PROTEGIDO DEL SOL', 540, 300, t, T.protegidos - 0.1, { px: 34, era: 0 }); lead(ctx, [X(-30), Yp(-Y.pitD * 0.6)], 300, 1300, sm(T.excavados, T.excavados + 0.4, t)); pill(ctx, 'DEPÓSITO EXCAVADO BAJO TIERRA', 420, 1300, t, T.excavados, { px: 32, era: 0 });
  scrimTop(ctx, 0.35); title(ctx, 'EL DEPÓSITO', t, TB.b14 + 0.1, { era: 0 }); recon(ctx, t, TB.b14 + 0.6, { y: 380 });
 }, sfx(k) { for (let x = TB.b14 + 1.6; x < TB.b15; x += 1.3) { k.play('stroke', x, { material: 'chalk', dur: 0.6, gain: 0.2 }); FX.bloque(k, x + 1.0, 0.6); } FX.etiqueta(k, T.excavados); } });

 // 15 · PAREDES GRUESAS Y AISLANTES — el calor exterior (naranja) se frena al atravesar la pared; el agua de fusión baja al sumidero
 B.push({ t0: TB.b15, t1: TB.b16, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  sky(ctx, 0); const s = 3.4, ox = 540, gy = 1000; const r = P.ykSection(ctx, ox, gy, s, t, { flip: true, ice: 0.72, heat: sm(T.calor18 - 0.6, T.calor18, t), melt: sm(T.interior18, TB.b16, t) * 0.6, sun: SUN_SUMMER });
  lead(ctx, [ox + (P.ykR(50) - 8) * s, gy - 50 * s], 840, 330, sm(T.gruesas - 0.2, T.gruesas + 0.2, t)); pill(ctx, 'PAREDES GRUESAS', 780, 330, t, T.gruesas - 0.2, { px: 34, era: 0 }); pill(ctx, 'MATERIALES AISLANTES', 540, 1220, t, T.aislantes - 0.1, { px: 34, era: 0 });
  tag(ctx, 'EL CALOR LLEGA MÁS DESPACIO, NO DESAPARECE', 540, 1295, t, T.calor18, { col: C.calor }); lead(ctx, r.drain, 300, 1370, sm(T.interior18 + 0.2, T.interior18 + 0.6, t), C.frio); tag(ctx, 'DRENAJE DEL AGUA DE FUSIÓN', 340, 1370, t, T.interior18 + 0.2, { col: C.frio, px: 32 });
  scrimTop(ctx, 0.35); title(ctx, 'FRENAR EL CALOR', t, TB.b15 + 0.1, { era: 0 });
 }, sfx(k) { FX.calor(k, T.calor18 - 0.6, 2.5); FX.etiqueta(k, T.gruesas - 0.2); FX.etiqueta(k, T.aislantes - 0.1); FX.goteo(k, T.interior18, 4, 0.35, 7); } });

 // 16 · LA SOMBRA — sección del sitio completo: el muro este–oeste da sombra hacia el norte, sobre el estanque; el depósito no recibe sol
 B.push({ t0: TB.b16, t1: TB.b17, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  sky(ctx, 0); const s = 1.62, ox = 860, gy = 1000; const r = P.ykSection(ctx, ox, gy, s, t, { flip: true, ice: 0.72, site: true, sun: SUN_WINTER, pondIce: 0.6 });
  const sx = ox - 330 * s - 160, sy = 420; P.glow(ctx, sx, sy, 160, '255,220,140', 0.5); ctx.fillStyle = '#fff2c4'; ctx.beginPath(); ctx.arc(sx, sy, 46, 0, TAU); ctx.fill();
  pill(ctx, 'MURO DE SOMBRA (ESTE–OESTE)', 330, 760, t, T.sombra - 0.2, { px: 30, era: 0 }); lead(ctx, r.swall, 300, 760, sm(T.sombra - 0.2, T.sombra + 0.2, t)); pill(ctx, 'SOMBRA HACIA EL NORTE', 560, 1110, t, T.sombra + 0.3, { px: 30, era: 0 }); tag(ctx, 'SOL DE INVIERNO AL MEDIODÍA (AL SUR)', 540, 1340, t, T.sombra + 0.6, { col: C.oro });
  tag(ctx, 'SUR ←  · →  NORTE', 540, 300, t, TB.b16 + 0.3, { col: C.frio });
  scrimTop(ctx, 0.35); title(ctx, 'LA SOMBRA AYUDABA', t, TB.b16 + 0.1, { era: 0 }); recon(ctx, t, TB.b16 + 0.4, { y: 380 });
 }, sfx(k) { FX.aparece(k, T.sombra - 0.2, 500); FX.etiqueta(k, T.sombra + 0.3); } });

 // 17 · MÁS LENTO, HASTA EL VERANO — las estaciones avanzan; el hielo baja poco a poco (no desaparece) y el agua se drena
 B.push({ t0: TB.b17, t1: TB.b18, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, T.asi, T.verano + 0.3), sum = sm(0.3, 0.9, u); sky(ctx, 0); ctx.save(); ctx.globalAlpha = sum * 0.35; ctx.fillStyle = '#ffb347'; ctx.fillRect(0, 0, W, 1000); ctx.restore();
  const s = 3.4, ox = 540, gy = 1000; P.ykSection(ctx, ox, gy, s, t, { flip: true, ice: lerp(0.72, 0.42, E.inOut(u)), heat: 0.5 + 0.5 * sum, melt: 0.3 + 0.5 * u, sun: SUN_SUMMER });
  P.seasonDial(ctx, 860, 1250, 70, lerp(0.02, 0.5, E.inOut(u)));
  tag(ctx, 'SE DERRITE MÁS LENTAMENTE', 400, 1250, t, T.derretia, { px: 32 }); tag(ctx, 'PARTE DEL HIELO LLEGA AL VERANO', 400, 1330, t, T.verano - 0.2, { col: C.frio, px: 32 });
  scrimTop(ctx, 0.35); title(ctx, 'DEL INVIERNO AL VERANO', t, TB.b17 + 0.1, { era: 0 }); recon(ctx, t, TB.b17 + 0.4, { y: 380 });
 }, sfx(k) { FX.goteo(k, T.derretia, 8, 0.4, 11); FX.saltoTiempo(k, T.y22, 3.0, 0.4); FX.etiqueta(k, T.verano - 0.2); } });

 // 18 · NO FABRICABAN HIELO EN VERANO — verano: sale un bloque del depósito; ciclo de estaciones: congelar → guardar → usar
 B.push({ t0: TB.b18, t1: TB.b19, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  if (t < TB.b18b + 0.3) { const cam = shot([[TB.b18, [470, 55, 150], [0, 45, 120], 900], [TB.b18b + 0.3, [420, 50, 140], [0, 45, 120], 900]], t); P.ykWorld(ctx, cam, t, { sun: SUN_SUMMER }); const u = win(t, TB.b18 + 0.3, TB.b18b), z = lerp(P.ykR(1) + 4, Y.path.z0 + 60, u); wk3(ctx, cam, [0, 0, z], t, { pose: 'carry', ph: u * 4, var: 1, dir: -1 }); ctx.save(); ctx.globalAlpha = 0.15; ctx.strokeStyle = '#fff3d6'; ctx.lineWidth = 3; for (let k = 0; k < 6; k++) { const yy = 1100 + k * 14; ctx.beginPath(); for (let x = 0; x <= W; x += 16) { const v = Math.sin(x * 0.03 + t * 6 + k) * 4; x ? ctx.lineTo(x, yy + v) : ctx.moveTo(x, yy + v); } ctx.stroke(); } ctx.restore(); tag(ctx, 'VERANO', 540, 300, t, TB.b18 + 0.2, { col: '#ffb347', px: 40 }); }
  const c = sm(TB.b18b, TB.b18b + 0.4, t); if (c > 0) { ctx.save(); ctx.globalAlpha *= c; ctx.fillStyle = '#0B1424'; ctx.fillRect(0, 0, W, HH); ctx.restore(); const R0 = 300, cx = 540, cy = 860; ctx.save(); ctx.globalAlpha *= c; const S2 = [['INVIERNO', 'CONGELAR', '#7cc4e8', -Math.PI / 2], ['PRIMAVERA', 'GUARDAR', '#8fd18a', 0], ['VERANO', 'USAR', '#ffb347', Math.PI / 2], ['OTOÑO', 'PREPARAR', '#d9935a', Math.PI]]; const sweep = win(t, TB.b18b + 0.3, T.meses + 0.3) * TAU; ctx.strokeStyle = 'rgba(245,247,248,0.15)'; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, TAU); ctx.stroke(); ctx.strokeStyle = C.oro; ctx.beginPath(); ctx.arc(cx, cy, R0, -Math.PI / 2, -Math.PI / 2 + sweep); ctx.stroke(); S2.forEach(([n, v, col, a], i) => { const x = cx + Math.cos(a) * R0, y = cy + Math.sin(a) * R0, on = sweep >= (i * Math.PI / 2) - 0.01; ctx.fillStyle = on ? col : 'rgba(245,247,248,0.25)'; ctx.beginPath(); ctx.arc(x, y, 34, 0, TAU); ctx.fill(); const tx = cx + Math.cos(a) * (R0 - 120), ty = cy + Math.sin(a) * (R0 - 110); txt(ctx, n, tx, ty - 22, 32, on ? col : 'rgba(245,247,248,0.4)', { w: 900 }); txt(ctx, v, tx, ty + 20, 36, on ? C.blanco : 'rgba(245,247,248,0.4)', { w: 900 }); }); ctx.restore(); P.iceBlock(ctx, cx, cy + 10, 120, 80, { melt: 0.15 * win(t, T.estacion, T.meses) }); tag(ctx, 'GUARDAR EL FRÍO DURANTE MESES', 540, 1300, t, T.meses - 0.4); }
  scrimTop(ctx, 0.35); title(ctx, t < TB.b18b ? 'SIN FABRICAR HIELO EN VERANO' : 'APROVECHAR EL FRÍO DE UNA ESTACIÓN', t, t < TB.b18b ? TB.b18 + 0.1 : TB.b18b + 0.1, { px: t < TB.b18b ? 50 : 44 });
 }, sfx(k) { FX.calor(k, TB.b18, 3); for (let i = 0; i < 4; i++) FX.etiqueta(k, TB.b18b + 0.3 + (T.meses - TB.b18b) * i / 4); FX.correcto(k, T.meses); } });

 // 19 · ¿CONOCÍAS ESTE INVENTO? — atardecer sobre el complejo
 B.push({ t0: TB.b19, t1: TB.b20, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = shot([[TB.b19, [500, 170, -360], [0, 85, 20], 900], [TB.b20, [470, 165, -330], [0, 86, 20], 900]], t); P.ykWorld(ctx, cam, t, { sun: SUN_DUSK, town: true }); ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.45; ctx.fillStyle = '#ff9a4a'; ctx.fillRect(0, 0, W, HH); ctx.restore();
  scrimTop(ctx, 0.35); title(ctx, '¿CONOCÍAS ESTE INVENTO?', t, T.conocias - 0.1, { era: 0 });
 }, sfx(k) { FX.viento(k, TB.b19, TB.b20 - TB.b19 + 0.5, 0.4); } });

 // 20 · CIERRE — ASOMBROTECA sobre el crepúsculo
 B.push({ t0: TB.b20, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.b20, DURATION)), cam = P.cam3([lerp(470, 640, u), lerp(165, 260, u), lerp(-330, -500, u)], [0, 86, 20], 900); P.ykWorld(ctx, cam, t, { sun: SUN_DUSK, night: lerp(0.15, 0.55, u), town: true }); ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.4; ctx.fillStyle = '#ff9a4a'; ctx.fillRect(0, 0, W, HH); ctx.restore();
  const a = sm(T.asombroteca, T.asombroteca + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(245,247,248,0.75)'; ctx.lineWidth = 2; const lw = 280 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 330); ctx.lineTo(540 + lw, 330); ctx.moveTo(540 - lw, 450); ctx.lineTo(540 + lw, 450); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 392, 64, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
  const b = sm(T.asombroteca + 0.5, T.asombroteca + 1.0, t); if (b > 0) { ctx.save(); ctx.globalAlpha *= b; txt(ctx, 'LA CIENCIA OCULTA DE LO IMPOSIBLE', 540, 500, 34, C.oro, { w: 700, ls: 3 }); ctx.restore(); }
 }, sfx(k) { FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.end + 0.6); } });

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
