// =====================================================================================================
// episodio.js — «¿Cómo construyeron la Gran Muralla China sin maquinaria moderna?» · Asombroteca · PLANTILLA v1.14
// Arco: muralla sobre las crestas (sin máquinas) → constructores (reconstrucción) → ingeniería + materiales + trabajo →
// no se construyó de una sola vez (mapa por periodos) → más de 2.000 años → tierra · piedra · ladrillo → moldes de madera
// → compactación capa por capa → tierra apisonada (corte) → piedra local → dinastía Ming (ladrillo y piedra, núcleo) →
// ¿cómo subían los materiales? → carros, animales y personas → pendientes a mano → torres y señales → generaciones →
// no fue una sola muralla (mapa) → obra de muchas generaciones → Asombroteca.
// Datos verificados en FUENTES_Y_DECISIONES.md. Reloj = voz original. Determinista.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const C = { tierra: '#A4774C', tierraO: '#68472F', piedra: '#7C827D', piedraL: '#BCC0B6', ladrillo: '#A45C42', madera: '#795335', veg: '#425A39', monte: '#526D72', cielo: '#86A9BD', niebla: '#D8D9C9', dorado: '#D5AC62', oro: '#FFD447', fondo: '#111A1C', blanco: '#F4F5F1', rojo: '#d9534f', han: '#4fb3a8', ming: '#d9634a', qin: '#D5AC62', estados: '#b9a3d6' };
 const T = {
  imagina: wt(0, 'imagina'), muralla0: wt(0, 'muralla'), gigantesca: wt(0, 'gigantesca'), montanas0: wt(0, 'montañas'), desiertos: wt(0, 'desiertos'), imposibles: wt(0, 'imposibles'),
  sin1: SG(1).s, excavadoras: wt(1, 'excavadoras'), gruas: wt(1, 'grúas'), maquinaria: wt(1, 'maquinaria'),
  eso2: SG(2).s, antiguos: wt(2, 'antiguos'), chinos: wt(2, 'chinos'),
  pero3: SG(3).s, como4: wt(4, 'cómo'), estructuras: wt(4, 'estructuras'), historia4: wt(4, 'historia'),
  la5: SG(5).s, combinacion: wt(5, 'combinación'), ingenieria: wt(5, 'ingeniería'), materiales5: wt(5, 'materiales'), trabajo5: wt(5, 'trabajo'),
  primero: SG(6).s, gran7: wt(7, 'gran'), sola7: wt(7, 'sola'), vez7: wt(7, 'vez'),
  diferentes8: SG(8).s, dinastias: wt(8, 'dinastías'), levantaron: wt(8, 'levantaron'), reconstruyeron: wt(8, 'reconstruyeron'), n2000: wt(8, '2.000'),
  y9: SG(9).s, interesante: wt(9, 'interesante'), no10: SG(10).s, mismos: wt(10, 'mismos'), materiales10: wt(10, 'materiales'), partes: wt(10, 'partes'),
  en11: SG(11).s, trabajadores11: wt(11, 'trabajadores'), capas11: wt(11, 'capas'), tierra11: wt(11, 'tierra'), moldes: wt(11, 'moldes'), madera11: wt(11, 'madera'),
  despues12: SG(12).s, golpeaban: wt(12, 'golpeaban'), repetidamente: wt(12, 'repetidamente'), compactarlas: wt(12, 'compactarlas'), muros12: wt(12, 'muros'), resistentes: wt(12, 'resistentes'),
  esta13: SG(13).s, tierra13: wt(13, 'tierra'), apisonada: wt(13, 'apisonada'),
  en14: SG(14).s, montanas14: wt(14, 'montañas'), piedra14: wt(14, 'piedra'), terreno14: wt(14, 'terreno'),
  y15: SG(15).s, dinastia15: wt(15, 'dinastía'), ming: wt(15, 'ming'), reforzados: wt(15, 'reforzados'), ladrillos: wt(15, 'ladrillos'), piedra15: wt(15, 'piedra'),
  pero16: SG(16).s, transportaban: wt(17, 'transportaban'), toneladas: wt(17, 'toneladas'), dificiles: wt(17, 'difíciles'),
  utilizaban18: SG(18).s, carros: wt(18, 'carros'), animales: wt(18, 'animales'), cantidades: wt(18, 'cantidades'), trabajo18: wt(18, 'trabajo'),
  en19: SG(19).s, empinadas: wt(19, 'empinadas'), manualmente: wt(19, 'manualmente'),
  y20: SG(20).s, desafio: wt(20, 'desafío'), construir21: SG(21).s, torres: wt(21, 'torres'), vigilancia: wt(21, 'vigilancia'), fortificaciones: wt(21, 'fortificaciones'), observar: wt(21, 'observar'), comunicar: wt(21, 'comunicar'), amenazas: wt(21, 'amenazas'),
  asi22: SG(22).s, siglos22: wt(22, 'siglos'), generaciones: wt(22, 'generaciones'), ampliando: wt(22, 'ampliando'), transformando: wt(22, 'transformando'), sistema22: wt(22, 'sistema'),
  y23: SG(23).s, sorprendente23: wt(23, 'sorprendente'), unica: wt(23, 'única'), continua: wt(23, 'continua'), emperador: wt(23, 'emperador'),
  lo24: SG(24).s, gran24: wt(24, 'gran'), resultado: wt(24, 'resultado'), innumerables: wt(24, 'innumerables'), historia24: wt(24, 'historia'),
  sigue: SG(25).s, asombroteca: wt(25, 'asombroteca'), end: A.speech_end,
 };
 const TB = { constr: T.eso2 - 0.3, desafio: T.pero3 - 0.15, mapa: T.primero - 0.25, mat: T.y9 - 0.25, moldes: T.en11 - 0.25, apis: T.esta13 - 0.2, piedra: T.en14 - 0.2, ming: T.y15 - 0.2, transp: T.pero16 - 0.2, medios: T.utilizaban18 - 0.2, pend: T.en19 - 0.2, torres: T.y20 - 0.2, gener: T.asi22 - 0.25, mapa2: T.y23 - 0.25, final: T.lo24 - 0.2, cierre: T.sigue - 0.15 };

 // ---------------- utilidades ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, px, a, c = 'rgba(244,245,241,0.98)') => { if (a <= 0.01) return; px = Math.max(px, 32); ctx.save(); ctx.globalAlpha *= a; ctx.font = `600 ${px}px "IBM Plex Mono"`; let L = [s];
  if (ctx.measureText(s).width + px * 1.2 > 1000) { const m = s.length / 2; let k = -1; for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (k < 0 || Math.abs(i - m) < Math.abs(k - m))) k = i; if (k > 0) L = [s.slice(0, k), s.slice(k + 1)]; }
  const lw = Math.max(...L.map((l) => ctx.measureText(l).width)); if (lw + px * 1.2 > 1020) { px *= 1000 / (lw + px * 1.2); ctx.font = `600 ${px}px "IBM Plex Mono"`; }
  const w = Math.max(...L.map((l) => ctx.measureText(l).width)) + px * 1.2, lh = px * 1.25, h = px * 0.45 + lh * L.length, x0 = Math.min(Math.max(x - w / 2, 30), 1050 - w);
  P.rr(ctx, x0, y - h / 2, w, h, px * 0.6, 'rgba(17,26,28,0.82)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; L.forEach((l, i) => ctx.fillText(l, x0 + w / 2, y + 1 + (i - (L.length - 1) / 2) * lh)); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 8; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
 const callout = (ctx, x0, y0, x1, y1, s, a, c = C.blanco, al = 'left') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = '800 40px Nunito'; const tw = ctx.measureText(s).width; let tx = al === 'left' ? x1 + 14 : x1 - 14 - tw; tx = cl(tx, 24, W - 24 - tw);
  ctx.strokeStyle = 'rgba(17,26,28,0.7)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 10, 0, TAU); ctx.fill(); P.rr(ctx, tx - 14, y1 - 31, tw + 28, 62, 31, 'rgba(17,26,28,0.84)'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, tx, y1 + 2); ctx.restore(); };
 const scrim = (ctx) => { const g = ctx.createLinearGradient(0, 1400, 0, 1760); g.addColorStop(0, 'rgba(17,26,28,0)'); g.addColorStop(0.5, 'rgba(17,26,28,0.62)'); g.addColorStop(1, 'rgba(17,26,28,0.62)'); ctx.fillStyle = g; ctx.fillRect(0, 1400, W, 520); };
 const bgTech = (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#1b2a2c'); g.addColorStop(1, C.fondo); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = 'rgba(200,210,190,0.05)'; ctx.lineWidth = 2; for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); } for (let y = 0; y <= HH; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } };
 const crossX = (ctx, x, y, r, p) => { if (p <= 0) return; ctx.save(); ctx.strokeStyle = C.rojo; ctx.lineWidth = r * 0.2; ctx.lineCap = 'round'; const a = r * 0.75; ctx.beginPath(); ctx.moveTo(x - a, y - a); ctx.lineTo(x - a + 2 * a * cl(p * 2), y - a + 2 * a * cl(p * 2)); if (p > 0.5) { ctx.moveTo(x + a, y - a); ctx.lineTo(x + a - 2 * a * cl(p * 2 - 1), y - a + 2 * a * cl(p * 2 - 1)); } ctx.stroke(); ctx.restore(); };
 const icoExc = (ctx, x, y, r) => { ctx.save(); ctx.fillStyle = '#e0b030'; ctx.fillRect(x - r * 0.55, y, r * 0.6, r * 0.3); ctx.fillStyle = '#3a3a3a'; ctx.fillRect(x - r * 0.6, y + r * 0.3, r * 0.7, r * 0.14); ctx.strokeStyle = '#e0b030'; ctx.lineWidth = r * 0.12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y + r * 0.05); ctx.lineTo(x + r * 0.35, y - r * 0.45); ctx.lineTo(x + r * 0.6, y + r * 0.05); ctx.stroke(); ctx.fillStyle = '#5b5b5b'; ctx.beginPath(); ctx.moveTo(x + r * 0.5, y); ctx.lineTo(x + r * 0.72, y + r * 0.1); ctx.lineTo(x + r * 0.55, y + r * 0.25); ctx.closePath(); ctx.fill(); ctx.restore(); };
 const icoGrua = (ctx, x, y, r) => { ctx.save(); ctx.strokeStyle = '#e0b030'; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.moveTo(x - r * 0.3, y + r * 0.5); ctx.lineTo(x - r * 0.3, y - r * 0.5); ctx.lineTo(x + r * 0.6, y - r * 0.5); ctx.moveTo(x - r * 0.3, y - r * 0.2); ctx.lineTo(x, y - r * 0.5); ctx.stroke(); ctx.strokeStyle = '#555'; ctx.lineWidth = r * 0.04; ctx.beginPath(); ctx.moveTo(x + r * 0.45, y - r * 0.5); ctx.lineTo(x + r * 0.45, y + r * 0.05); ctx.stroke(); ctx.fillStyle = '#555'; ctx.fillRect(x + r * 0.37, y + r * 0.05, r * 0.16, r * 0.12); ctx.restore(); };
 const icoGear = (ctx, x, y, r) => { ctx.save(); ctx.fillStyle = '#7a8790'; ctx.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = i % 2 ? r * 0.42 : r * 0.55; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.fillStyle = '#e8ecef'; ctx.beginPath(); ctx.arc(x, y, r * 0.18, 0, TAU); ctx.fill(); ctx.restore(); };
 const camPt = (cam, p) => [(p[0] - cam[0]) * cam[2] + 540, (p[1] - cam[1]) * cam[2] + 960];

 // ---------------- paisaje compartido: cordillera + muralla Ming en las crestas ----------------
 // o: { cam, sun, sky, hor, seed, arid, style, build, ruin, smoke, fire, towers, season (0 primavera → 3 invierno), fogA, night }
 function ridgeShot(ctx, t, o = {}) {
  ctx.save(); if (o.cam) P.camApply(ctx, o.cam);
  const rg = P.ranges(ctx, t, { hor: o.hor ?? 760, sun: o.sun === null ? null : (o.sun || [820, 470]), sunA: o.sunA, sky: o.sky, seed: o.seed ?? 5, arid: o.arid || 0, x0: -1800, x1: 2900, front: { y: o.fy ?? 1180, amp: o.famp ?? 400 }, fogA: o.fogA ?? 0.7, nearC: o.nearC, farC: o.farC });
  const pts = []; for (let x = -1800; x <= 2900; x += 18) pts.push([x, rg.ridge(x)]);
  if (o.before) o.before(ctx, rg);
  const pa = P.wallPath(ctx, pts, t, { style: o.style || 'ladrillo', h: o.wh ?? 46, build: o.build ?? 1, towers: o.towers || [0.33, 0.405, 0.48, 0.555, 0.63, 0.705], towerS: o.towerS ?? 112, ruin: o.ruin || 0, smokeAt: o.smokeAt, smoke: o.smoke || 0, glow: o.glow });
  if (o.snow) { ctx.save(); ctx.globalAlpha *= o.snow; ctx.fillStyle = 'rgba(240,244,246,0.85)'; ctx.beginPath(); ctx.moveTo(-1800, 2400); for (let x = -1800; x <= 2900; x += 18) ctx.lineTo(x, rg.ridge(x) + 10 + 18 * Math.sin(x * 0.03)); ctx.lineTo(2900, 2400); ctx.closePath(); ctx.globalAlpha *= 0.35; ctx.fill(); ctx.restore(); }
  if (o.after) o.after(ctx, rg, pa);
  ctx.restore(); return { rg, pa };
 }
 // obra de tierra apisonada en un valle árido (reconstrucción): suelo, encofrado, trabajadores y porteadores
 const groundSite = (ctx, t, o = {}) => { P.ranges(ctx, t, { hor: o.hor ?? 820, sun: [840, 520], sky: ['#8fb0c2', '#e6dcc4'], seed: 12, arid: 0.75, layers: 4, x0: -800, x1: 1900, front: { y: 1020, amp: 160 }, fogA: 0.6 });
  const g = ctx.createLinearGradient(0, 1040, 0, 2000); g.addColorStop(0, '#b08a5c'); g.addColorStop(1, '#6d5034'); ctx.fillStyle = g; ctx.fillRect(-800, 1040, 2700, 1200); const R = H.rng(31); ctx.fillStyle = 'rgba(90,64,40,0.35)'; for (let i = 0; i < 260; i++) ctx.fillRect(R.range(-700, 1800), R.range(1050, 1950), R.range(2, 6), 2); };

 const B = [];
 // 1 · GANCHO: vuelo sobre la cordillera; desciende hacia una torre y recorre el muro
 const camHook = (t) => P.camAt([[0, 600, 760, 0.55], [2.6, 520, 880, 0.85], [T.imposibles, 330, 980, 1.6], [T.maquinaria + 0.4, 160, 1000, 2.1], [TB.constr, 60, 1010, 2.3]], t);
 B.push({ t0: 0, t1: TB.constr, draw(ctx, t) {
  ridgeShot(ctx, t, { cam: camHook(t), fogA: 0.8 });
  pill(ctx, '¿CÓMO CONSTRUYERON ESTO?', 540, 270, 54, t, T.gigantesca, C.oro, C.fondo, T.sin1);
  const icons = [[T.excavadoras, icoExc, 270], [T.gruas, icoGrua, 540], [T.maquinaria, icoGear, 810]];
  icons.forEach(([t0, f, x]) => { const a = sm(t0 - 0.2, t0 + 0.1, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.circle(ctx, x, 330, 96, 'rgba(244,245,241,0.95)'); f(ctx, x, 330, 96); ctx.restore(); crossX(ctx, x, 330, 96, win(t, t0 + 0.15, t0 + 0.45)); });
  pill(ctx, 'SIN MAQUINARIA MODERNA', 540, 500, 46, t, T.maquinaria, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, 0, TB.constr + 0.4, 1.3); k.play('whoosh', 0.1, { dur: 2.5, top: 900, gain: 0.3 }); k.play('whoosh', T.imposibles - 0.6, { dur: 1.2, top: 1600, gain: 0.3, minor: true }); FX.aparece(k, T.gigantesca); FX.tachado(k, T.excavadoras + 0.15); FX.tachado(k, T.gruas + 0.15); FX.tachado(k, T.maquinaria + 0.15); MUS.golpe(k, T.muralla0, { gain: 0.7, chord: ['A2', 'E3', 'A3', 'C4'] }); } });

 // 2 · LOS CONSTRUCTORES: nube de polvo → reconstrucción: personas con ropa distinta, encofrados y herramientas
 const workersScene = (ctx, t, focus = 0) => { groundSite(ctx, t);
  P.rammedEarth(ctx, 700, 1300, 520, 300, t, { total: 8, done: 3, loose: 1, compact: 0.5 + 0.5 * Math.sin(t * 0.7) * 0, form: 1, workers: 3, hit: t * 1.4, seed: 5 });
  for (let i = 0; i < 3; i++) { const u = ((t * 0.07 + i * 0.33) % 1); P.porter(ctx, lerp(-80, 420, u), 1400 + i * 40, 190, t * 1.2 + i * 0.3, { load: 'tierra', var: i + 2 }); }
  P.laborer(ctx, 180, 1650, 230, t * 1.5, { pose: 'chisel', var: 4 }); ctx.fillStyle = '#8a6440'; ctx.beginPath(); ctx.ellipse(260, 1660, 70, 18, 0, Math.PI, TAU); ctx.fill();
  P.laborer(ctx, 960, 1600, 220, 0, { pose: 'stand', var: 5 }); ctx.fillStyle = '#795335'; ctx.fillRect(860, 1560, 70, 40); };
 B.push({ t0: TB.constr, t1: TB.desafio, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = P.camAt([[TB.constr, 480, 1260, 1.35], [TB.desafio, 600, 1240, 1.1]], t);
  ctx.save(); P.camApply(ctx, cam); workersScene(ctx, t); ctx.restore();
  const du = win(t, TB.constr, TB.constr + 1.2); if (du < 1) { ctx.save(); ctx.globalAlpha = 1 - du; ctx.fillStyle = 'rgba(206,182,140,1)'; ctx.fillRect(0, 0, W, HH); ctx.restore(); for (let i = 0; i < 6; i++) P.dust(ctx, 180 + i * 150, 900 + (i % 2) * 200, t, TB.constr - 0.2 + i * 0.05, { s: 260, seed: i + 1 }); }
  pill(ctx, 'RECONSTRUCCIÓN HISTÓRICA', 540, 270, 46, t, T.antiguos - 0.3, C.oro, C.fondo);
  tag(ctx, 'herramientas, ropa y técnicas cambiaban según la época y la región', 540, 380, 32, sm(T.chinos, T.chinos + 0.4, t));
  scrim(ctx);
 }, sfx(k) { k.noise(TB.constr - 0.2, { dur: 1.6, color: 'pink', filter: 'lowpass', f: [[0, 2500], [1.6, 400]], gain: 0.12, a: 0.05 }); FX.apisonar(k, TB.constr + 0.8, 5, 0.36, 0.7); FX.pasosTierra(k, TB.constr + 0.5, 6, 0.42, 0.8); FX.viento(k, TB.constr, TB.desafio - TB.constr, 0.5); } });

 // 3 · EL DESAFÍO: la cámara sube sobre la obra; el muro se vuelve transparente y muestra sus capas
 B.push({ t0: TB.desafio, t1: TB.mapa, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = P.camAt([[TB.desafio, 600, 1150, 0.95], [T.la5, 640, 1220, 1.25], [TB.mapa, 700, 1180, 1.55]], t);
  ctx.save(); P.camApply(ctx, cam); groundSite(ctx, t);
  const cut = sm(T.combinacion, T.combinacion + 0.6, t);
  for (let i = 0; i < 3; i++) { const u = ((t * 0.07 + i * 0.33) % 1); P.porter(ctx, lerp(-80, 420, u), 1400 + i * 40, 190, t * 1.2 + i * 0.3, { load: i === 1 ? 'piedra' : 'tierra', var: i + 2 }); }
  P.rammedEarth(ctx, 700, 1300, 520, 300, t, { total: 8, done: 5, loose: 0, form: 1 - cut, workers: cut > 0.5 ? 0 : 3, hit: t * 1.4, cut, glowLayer: cut > 0.5 ? 2 : null, seed: 5 });
  ctx.restore();
  const q = camPt(cam, [700, 1180]);
  callout(ctx, q[0], q[1], 760, 620, 'CAPAS', cut, C.oro, 'left');
  const words = [['INGENIERÍA', T.ingenieria, 230], ['MATERIALES', T.materiales5, 540], ['TRABAJO', T.trabajo5, 850]];
  words.forEach(([s, t0, x], i) => { const a = sm(t0 - 0.15, t0 + 0.15, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x - 150, 370, 300, 84, 42, i === 1 ? C.oro : 'rgba(17,26,28,0.85)'); txt(ctx, s, x, 413, 34, i === 1 ? C.fondo : C.blanco); if (i < 2) txt(ctx, '+', x + 155, 413, 46, C.oro); ctx.restore(); });
  pill(ctx, '¿CÓMO LO LOGRARON?', 540, 260, 54, t, T.como4, C.blanco, C.fondo, T.la5);
  pill(ctx, 'LA RESPUESTA', 540, 260, 54, t, T.la5, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.desafio, TB.mapa - TB.desafio, 0.6); FX.aparece(k, T.como4); FX.revelar(k, T.combinacion); FX.etiqueta(k, T.ingenieria); FX.etiqueta(k, T.materiales5); FX.etiqueta(k, T.trabajo5); } });

 // ---------------- mapa esquemático del norte de China (tramos por periodos) ----------------
 const MAPR = { x: 20, y: 430, w: 1040, h: 620 };
 const PER = [['estados', 'REINOS COMBATIENTES · s. VII–III a. C.', C.estados], ['qin', 'QIN · s. III a. C.', C.qin], ['han', 'HAN · s. II a. C.–II d. C.', C.han], ['ming', 'MING · 1368–1644', C.ming]];
 function chinaShot(ctx, t, o = {}) {
  bgTech(ctx); const pr = P.chinaMap(ctx, MAPR.x, MAPR.y, MAPR.w, MAPR.h, t, {}); ctx.save(); ctx.strokeStyle = 'rgba(200,210,190,0.4)'; ctx.lineWidth = 3; ctx.strokeRect(MAPR.x, MAPR.y, MAPR.w, MAPR.h); ctx.restore();
  const lab = (ll, s, a, px = 30, c = C.blanco, dy = 0) => { if (a <= 0) return; const p = pr(ll); ctx.save(); ctx.globalAlpha *= a; txt(ctx, s, p[0], p[1] + dy, px, c, { w: 800 }); ctx.restore(); };
  const la = o.labels ?? 1; lab([101, 43.2], 'DESIERTO DE GOBI', la * 0.9, 30, '#5a4a30'); lab([108.5, 35.6], 'río Amarillo', la, 28, '#9fd0e8'); lab([122.5, 38.3], 'mar de Bohai', la * 0.9, 26, '#cfe3ea');
  const city = (ll, s, a, dx = 0, dy = -30) => { if (a <= 0) return; const p = pr(ll); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = C.blanco; ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, TAU); ctx.fill(); ctx.strokeStyle = C.fondo; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); ctx.save(); ctx.globalAlpha *= a; txt(ctx, s, p[0] + dx, p[1] + dy, 30, C.blanco); ctx.restore(); };
  city([116.4, 39.9], 'Pekín', la, 0, 34); city([98.2, 39.8], 'Jiayuguan', o.ends ?? 0, 0, 34); city([119.8, 40.0], 'Shanhaiguan', o.ends ?? 0, 50, -34);
  const pp = o.periods || {}; PER.forEach(([k, s, c]) => { const p = pp[k] || 0; if (p <= 0) return; P.CNWALLS[k].forEach((seg) => P.mapWall(ctx, seg.map(pr), p, t, { c, w: 7 })); });
  if (o.legend) { ctx.save(); ctx.globalAlpha *= o.legend; P.rr(ctx, 40, 1080, 1000, 250, 26, 'rgba(17,26,28,0.85)'); PER.forEach(([k, s, c], i) => { const a = cl((pp[k] || 0) * 3); ctx.save(); ctx.globalAlpha *= 0.35 + 0.65 * a; ctx.fillStyle = c; ctx.fillRect(80, 1118 + i * 54, 60, 12); txt(ctx, s, 160, 1125 + i * 54, 32, C.blanco, { al: 'left', w: 800 }); ctx.restore(); }); ctx.restore(); }
  ctx.save(); ctx.globalAlpha *= 0.9; txt(ctx, 'esquema aproximado de algunos tramos', MAPR.x + MAPR.w - 18, MAPR.y + MAPR.h - 24, 26, 'rgba(244,245,241,0.85)', { al: 'right', w: 600 }); ctx.restore();
  return pr;
 }
 // 4-5 · NO SE CONSTRUYÓ DE UNA SOLA VEZ · MÁS DE 2.000 AÑOS
 B.push({ t0: TB.mapa, t1: TB.mat, in: { type: 'zoom', d: 0.5, x: 540, y: 800 }, draw(ctx, t) {
  const z = 1.12 - 0.12 * E.out(win(t, TB.mapa, TB.mapa + 2)); ctx.save(); ctx.translate(540, 760); ctx.scale(z, z); ctx.translate(-540, -760);
  chinaShot(ctx, t, { periods: { estados: sm(T.sola7 - 0.3, T.vez7 + 0.4, t), qin: sm(T.dinastias, T.levantaron + 0.6, t), han: sm(T.levantaron + 0.4, T.reconstruyeron + 0.6, t), ming: sm(T.reconstruyeron + 0.5, T.n2000 - 0.4, t) }, legend: sm(T.diferentes8, T.diferentes8 + 0.5, t), ends: sm(T.n2000 - 0.6, T.n2000 - 0.2, t) }); ctx.restore();
  pill(ctx, 'NO SE CONSTRUYÓ DE UNA SOLA VEZ', 540, 200, 44, t, T.gran7, C.oro, C.fondo, T.diferentes8);
  pill(ctx, 'MÁS DE 2.000 AÑOS DE HISTORIA', 540, 200, 46, t, T.n2000 - 0.2, C.oro, C.fondo);
  tag(ctx, 'proyectos separados de distintos gobiernos, no una obra continua', 540, 320, 32, sm(T.dinastias, T.dinastias + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.mapa(k, TB.mapa + 0.1); FX.flecha(k, T.sola7 - 0.2, 1); FX.flecha(k, T.dinastias, 1); FX.flecha(k, T.levantaron + 0.4, 1); FX.flecha(k, T.reconstruyeron + 0.5, 1.2); FX.sello(k, T.n2000 - 0.2); FX.tiempo(k, T.diferentes8, 2.2, 0.6); } });

 // 6 · DIFERENTES MATERIALES: tres tramos (tierra en zona árida, piedra en montaña, ladrillo y piedra Ming)
 const panel = (ctx, t, i, a, draw) => { if (a <= 0) return; const x = i * 360, w = 360; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.rect(x, 0, w, HH); ctx.clip(); ctx.translate(x + w / 2, 0); ctx.scale(0.62, 0.62); ctx.translate(-540, 300); draw(ctx); ctx.restore(); if (i > 0) { ctx.fillStyle = 'rgba(17,26,28,0.9)'; ctx.fillRect(x - 3, 0, 6, HH); } };
 B.push({ t0: TB.mat, t1: TB.moldes, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  bgTech(ctx);
  const a1 = sm(T.mismos - 0.2, T.mismos + 0.2, t), a2 = sm(T.materiales10 - 0.1, T.materiales10 + 0.3, t), a3 = sm(T.partes - 0.3, T.partes + 0.1, t), a0 = 1 - Math.max(a1, a2, a3) * 0.0;
  ridgeShot(ctx, t, { cam: [540, 980, 1.0 + 0.3 * win(t, TB.mat, TB.moldes)], style: 'ladrillo' });
  panel(ctx, t, 0, a1, (c) => { ridgeShot(c, t, { cam: [540, 980, 1.6], style: 'tierra', arid: 0.9, seed: 9, towers: [0.45], towerS: 120, wh: 60, sky: ['#9bb8c6', '#eadcc0'] }); });
  panel(ctx, t, 1, a2, (c) => { ridgeShot(c, t, { cam: [540, 980, 1.6], style: 'piedra', seed: 21, towers: [0.45], towerS: 120, wh: 56 }); });
  panel(ctx, t, 2, a3, (c) => { ridgeShot(c, t, { cam: [540, 980, 1.6], style: 'ladrillo', seed: 5, towers: [0.45], towerS: 120, wh: 56 }); });
  [['TIERRA', a1, 180, C.tierra], ['PIEDRA', a2, 540, C.piedraL], ['LADRILLO', a3, 900, C.ladrillo]].forEach(([s, a, x, c]) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x - 140, 1260, 280, 84, 42, 'rgba(17,26,28,0.88)'); txt(ctx, s, x, 1303, 40, c, { w: 900 }); ctx.restore(); });
  pill(ctx, 'LO INTERESANTE', 540, 270, 50, t, T.interesante - 0.2, C.blanco, C.fondo, T.no10);
  pill(ctx, 'NO EN TODAS PARTES IGUAL', 540, 270, 48, t, T.no10, C.oro, C.fondo);
  tag(ctx, 'según la región, los materiales disponibles y la época', 540, 380, 32, sm(T.partes, T.partes + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.aparece(k, T.interesante - 0.2); k.play('swish', T.mismos - 0.2, { dur: 0.35, gain: 0.4 }); k.play('swish', T.materiales10 - 0.1, { dur: 0.35, gain: 0.4 }); k.play('swish', T.partes - 0.3, { dur: 0.35, gain: 0.4 }); FX.etiqueta(k, T.mismos); FX.etiqueta(k, T.materiales10); FX.etiqueta(k, T.partes - 0.2); } });

 // 7-9 · MOLDES DE MADERA → COMPACTACIÓN CAPA POR CAPA → TIERRA APISONADA (corte)
 // ciclo por capa: vertido (0,5 s) → muchos golpes (≈1,2 s) → capa terminada
 const CYC = 1.75, LAYER0 = T.despues12 - 0.1;
 function rammedState(t) { if (t < LAYER0) { const lo = sm(T.capas11, T.tierra11 + 0.6, t); return { done: 2, loose: lo, compact: 0 }; } const u = (t - LAYER0) / CYC, k = Math.floor(u), f = u - k; const done = Math.min(8, 2 + k); if (done >= 8) return { done: 8, loose: 0, compact: 0 }; if (k === 0) return { done: 2, loose: 1, compact: sm(0, 0.85, f) }; return { done, loose: sm(0, 0.25, f), compact: sm(0.3, 0.92, f) }; }
 B.push({ t0: TB.moldes, t1: TB.piedra, in: { type: 'zoom', d: 0.45, x: 540, y: 1100 }, draw(ctx, t) {
  const st = rammedState(t), endP = sm(T.esta13 - 0.2, T.esta13 + 0.5, t), cut = sm(T.tierra13, T.apisonada + 0.3, t);
  const camY = lerp(1210, 1080, sm(LAYER0, T.esta13, t)); const cam = P.camAt([[TB.moldes, 640, 1210, 1.85], [T.moldes, 560, 1180, 1.55], [LAYER0, 540, 1210, 1.5], [T.esta13, 540, 1080, 1.35], [TB.piedra, 540, 1060, 1.2]], t);
  ctx.save(); P.camApply(ctx, cam); groundSite(ctx, t);
  const hitting = t > LAYER0 && st.compact > 0.02 && st.compact < 0.95 && endP < 1;
  const R = P.rammedEarth(ctx, 540, 1400, 600, 480, t, { total: 8, done: st.done, loose: st.loose, compact: st.compact, form: 1 - endP, workers: endP > 0.5 ? 0 : 3, hit: hitting ? t * 2.2 : 0.25, cut, glowLayer: cut > 0.5 ? 4 : null, seed: 5 });
  // vertido: porteadores que vacían cestas en el molde
  if (t < LAYER0 + 0.2) { const a = sm(T.trabajadores11 - 0.3, T.trabajadores11, t) * (1 - sm(LAYER0, LAYER0 + 0.2, t)); ctx.save(); ctx.globalAlpha *= a; P.porter(ctx, 160, 1400, 210, t * 1.1, { load: 'tierra', var: 3 }); ctx.restore(); if (st.loose > 0 && st.loose < 1) { ctx.fillStyle = 'rgba(169,132,90,0.9)'; for (let i = 0; i < 18; i++) { const u = ((t * 2.5 + i / 18) % 1); ctx.beginPath(); ctx.arc(300 + i * 2 + u * 60, 1060 + u * (R.surf - 1060), 6 + (i % 3) * 2, 0, TAU); ctx.fill(); } } }
  ctx.restore();
  // rótulos
  const pM = camPt(cam, [540 + 320, 1400 - 400]), pL = camPt(cam, [540, R.surf + 10]);
  callout(ctx, pM[0], pM[1], 760, 600, 'MOLDE DE MADERA', sm(T.moldes - 0.2, T.moldes + 0.2, t) * (1 - endP), C.oro, 'right');
  if (t > LAYER0 && t < T.esta13) { const hl = st.loose > 0 ? lerp(1.75, 1, st.compact) : 1; tag(ctx, `altura de la capa: ${Math.round(hl * 100)} %`, 540, 1330, 32, sm(LAYER0 + 0.3, LAYER0 + 0.6, t)); }
  pill(ctx, 'CAPAS DE TIERRA', 540, 270, 54, t, T.capas11, C.oro, C.fondo, LAYER0);
  pill(ctx, 'COMPACTACIÓN CAPA POR CAPA', 540, 270, 46, t, LAYER0, C.oro, C.fondo, T.esta13);
  pill(ctx, 'TIERRA APISONADA', 540, 270, 58, t, T.tierra13 - 0.1, C.oro, C.fondo);
  tag(ctx, 'muchos golpes por capa: la tierra suelta pierde volumen y se vuelve densa', 540, 390, 30, sm(T.repetidamente, T.repetidamente + 0.4, t) * (1 - sm(T.esta13 - 0.3, T.esta13, t)));
  tag(ctx, 'sin cemento · en algunos tramos se intercalaban ramas o cañas', 540, 390, 30, sm(T.apisonada, T.apisonada + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.madera(k, TB.moldes + 0.2, 2, 0.8); FX.vertido(k, T.capas11, 1.4, 1); const n = Math.floor((T.esta13 - 0.2 - LAYER0) / CYC); for (let i = 0; i <= n; i++) { const t0 = LAYER0 + i * CYC; if (i > 0) FX.vertido(k, t0, 0.45, 0.6); FX.apisonar(k, t0 + 0.5, 4, 0.28, 0.9); } FX.revelar(k, T.tierra13); FX.sello(k, T.apisonada + 0.2); } });

 // 10 · PIEDRA EN LAS MONTAÑAS: piedra local se prepara, se sube y se coloca en el muro
 B.push({ t0: TB.piedra, t1: TB.ming, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = P.camAt([[TB.piedra, 260, 1240, 1.6], [T.piedra14, 460, 1160, 1.3], [TB.ming, 600, 1080, 1.15]], t);
  ctx.save(); P.camApply(ctx, cam);
  P.ranges(ctx, t, { hor: 720, sun: [860, 430], seed: 21, layers: 4, x0: -800, x1: 1900, front: { y: 980, amp: 260 }, fogA: 0.6 });
  // ladera rocosa delantera: cornisa (cantera) y pendiente hasta la cresta donde se levanta el muro
  const gy = (x) => x < 470 ? 1380 - (x + 200) * 0.03 : 1360 - (x - 470) * 0.62;
  ctx.fillStyle = '#556b48'; ctx.beginPath(); ctx.moveTo(-300, 2200); for (let x = -300; x <= 1400; x += 20) ctx.lineTo(x, Math.max(820, gy(x))); ctx.lineTo(1400, 2200); ctx.closePath(); ctx.fill();
  const Rr = H.rng(8); ctx.fillStyle = 'rgba(124,130,125,0.55)'; for (let i = 0; i < 26; i++) { const x = Rr.range(-250, 1350), y = Math.max(820, gy(x)) + Rr.range(30, 500); ctx.beginPath(); ctx.ellipse(x, y, Rr.range(14, 40), Rr.range(8, 20), 0, 0, TAU); ctx.fill(); }
  P.granite(ctx, [[-260, 1385], [-200, 1150], [-60, 1090], [120, 1130], [220, 1250], [260, 1372]], { seed: 4, c1: '#a5aaa2', c2: '#6e756f' }); // afloramiento de piedra
  // muro de piedra en construcción sobre la pendiente (termina donde están trabajando)
  const wp = []; for (let x = 520; x <= 1400; x += 16) wp.push([x, Math.max(820, gy(x)) + 6]); P.wallPath(ctx, wp, t, { style: 'piedra', h: 70, build: 0.18 + 0.82 * sm(TB.piedra, TB.ming, t) * 0.25 + 0.6, towers: [0.62], towerS: 150, crenel: false });
  // pila de piedras con sombra, apoyada en la cornisa
  ctx.fillStyle = 'rgba(25,30,22,0.4)'; ctx.beginPath(); ctx.ellipse(360, 1370, 120, 16, 0, 0, TAU); ctx.fill();
  for (let i = 0; i < 9; i++) { const sx = 270 + (i % 4) * 46 + Math.floor(i / 4) * 22, sy = 1360 - Math.floor(i / 4) * 30; P.granite(ctx, [[sx - 24, sy], [sx - 18, sy - 26], [sx + 16, sy - 30], [sx + 24, sy - 4], [sx + 10, sy + 4]], { seed: 20 + i, c1: '#9aa098', c2: '#646b65' }); }
  P.laborer(ctx, 60, gy(60), 170, t * 1.6, { pose: 'chisel', var: 1 }); P.granite(ctx, [[96, gy(96)], [104, gy(96) - 30], [150, gy(96) - 34], [160, gy(96)]], { seed: 3, c1: '#a5aaa2', c2: '#6e756f' });
  P.laborer(ctx, 200, gy(200), 170, t * 1.6 + 0.45, { pose: 'chisel', var: 4 });
  // porteador que sube una piedra por la pendiente hasta el muro
  const pu = ((t - TB.piedra) * 0.16) % 1, px = lerp(470, 760, pu), py = gy(px); P.porter(ctx, px, py, 160, t * 1.1, { load: 'piedra', var: 2 });
  ctx.restore();
  pill(ctx, 'PIEDRA LOCAL', 540, 270, 58, t, T.piedra14 - 0.1, C.oro, C.fondo);
  tag(ctx, 'reconstrucción plausible: se usaba la roca del propio terreno', 540, 380, 32, sm(T.piedra14 + 0.3, T.piedra14 + 0.7, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.piedra, TB.ming - TB.piedra, 0.7); FX.golpePiedra(k, T.montanas14); FX.golpePiedra(k, T.montanas14 + 0.6); FX.golpePiedra(k, T.piedra14 + 0.3); FX.aparece(k, T.piedra14 - 0.1); } });

 // 11 · DINASTÍA MING: corte técnico; hiladas de ladrillo sobre cimiento de piedra y núcleo de tierra y cascajo
 B.push({ t0: TB.ming, t1: TB.transp, in: { type: 'zoom', d: 0.45, x: 540, y: 1000 }, draw(ctx, t) {
  bgTech(ctx); const bd = sm(T.reforzados - 0.6, T.ladrillos + 0.6, t), cr = sm(T.ming, T.ming + 0.5, t);
  ctx.save(); const sc = 1 + 0.05 * win(t, TB.ming, TB.transp); ctx.translate(540, 1100); ctx.scale(sc, sc); ctx.translate(-540, -1100);
  const pts = P.mingSection(ctx, 540, 1320, 760, 620, t, { build: bd, glow: { core: cr * (1 - sm(T.reforzados, T.reforzados + 0.3, t)), brick: sm(T.ladrillos, T.ladrillos + 0.3, t) * (1 - sm(T.piedra15, T.piedra15 + 0.3, t)), stone: sm(T.piedra15, T.piedra15 + 0.3, t) } });
  if (bd > 0 && bd < 1) { const hy = lerp(1320 - 100, 1320 - 620, bd); P.laborer(ctx, 905 - 50 * bd, hy + 10, 120, 0, { pose: 'chisel', var: 3 }); }
  ctx.restore();
  callout(ctx, pts.core[0], pts.core[1], 120, 560, 'NÚCLEO DE TIERRA Y CASCAJO', cr, C.oro);
  callout(ctx, pts.brick[0], pts.brick[1], 980, 820, 'LADRILLO', sm(T.ladrillos, T.ladrillos + 0.3, t), C.blanco, 'right');
  callout(ctx, pts.stone[0], pts.stone[1], 980, 1400, 'CIMIENTO DE PIEDRA', sm(T.piedra15, T.piedra15 + 0.3, t), C.blanco, 'right');
  pill(ctx, 'DINASTÍA MING · 1368–1644', 540, 270, 48, t, T.dinastia15, C.oro, C.fondo);
  tag(ctx, 'la estructura variaba según el lugar y la función del tramo', 540, 380, 32, sm(T.reforzados - 0.3, T.reforzados, t));
  scrim(ctx);
 }, sfx(k) { FX.tiempo(k, TB.ming, 1.0, 0.6); FX.revelar(k, T.ming); FX.ladrillo(k, T.reforzados - 0.4, 6, 0.3); FX.golpePiedra(k, T.piedra15); } });

 // 12 · ¿CÓMO SUBÍAN LOS MATERIALES?: de la pila del valle a la cresta por un sendero en zigzag
 const PATH = [[180, 1560], [520, 1470], [300, 1360], [640, 1250], [380, 1130], [700, 1020], [460, 900], [760, 790]];
 const slopeScene = (ctx, t, o = {}) => { const rg = P.ranges(ctx, t, { hor: 640, sun: [860, 420], seed: 33, layers: 4, x0: -800, x1: 1900, front: { y: 900, amp: 300 }, fogA: 0.7 });
  // ladera delantera empinada con la muralla en lo alto
  ctx.fillStyle = '#4a6340'; ctx.beginPath(); ctx.moveTo(-200, 1900); ctx.lineTo(-200, 1640); ctx.quadraticCurveTo(300, 1500, 560, 1100); ctx.quadraticCurveTo(700, 860, 820, 760); ctx.lineTo(1300, 700); ctx.lineTo(1300, 1900); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(30,45,28,0.35)'; ctx.beginPath(); ctx.moveTo(820, 760); ctx.lineTo(1300, 700); ctx.lineTo(1300, 1900); ctx.lineTo(900, 1900); ctx.closePath(); ctx.fill();
  const R = H.rng(4); ctx.fillStyle = 'rgba(40,60,36,0.6)'; for (let i = 0; i < 120; i++) ctx.beginPath(), ctx.arc(R.range(-150, 1250), R.range(780, 1880), R.range(4, 10), 0, TAU), ctx.fill();
  ctx.strokeStyle = 'rgba(190,160,120,0.85)'; ctx.lineWidth = 16; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; P.strokePath(ctx, PATH, 16, 'rgba(176,144,104,0.9)');
  P.wallPath(ctx, [[700, 790], [820, 762], [960, 735], [1120, 712], [1300, 700]], t, { style: 'ladrillo', h: 54, build: o.build ?? 1, towers: [0.35], towerS: 120 });
  ctx.fillStyle = '#a45c42'; for (let r = 0; r < 3; r++) for (let i = 0; i < 6 - r; i++) ctx.fillRect(60 + i * 26 + r * 13, 1600 - r * 14, 24, 12); ctx.fillStyle = '#8f958e'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(240 + i * 22, 1612 - (i % 2) * 10, 18, 12, 0, 0, TAU); ctx.fill(); }
  return rg; };
 B.push({ t0: TB.transp, t1: TB.medios, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = P.camAt([[TB.transp, 300, 1560, 1.6], [T.toneladas, 380, 1300, 1.05], [TB.medios, 520, 1180, 0.85]], t);
  ctx.save(); P.camApply(ctx, cam); slopeScene(ctx, t, { build: 0.7 }); const pa = P.path(PATH), pr = sm(T.toneladas, T.dificiles + 0.4, t); if (pr > 0) { const sub = []; for (let s = 0; s <= pa.L * pr; s += 8) { const q = pa.at(s); sub.push([q[0], q[1]]); } ctx.save(); ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t * 40; P.strokePath(ctx, sub, 8, C.oro); ctx.restore(); } ctx.restore();
  const a = sm(T.dificiles - 0.3, T.dificiles + 0.2, t); if (a > 0) { const p0 = camPt(cam, [140, 1600]), p1 = camPt(cam, [760, 790]); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.blanco; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(980, p0[1]); ctx.lineTo(980, p1[1]); ctx.stroke(); for (const y of [p0[1], p1[1]]) { ctx.beginPath(); ctx.moveTo(950, y); ctx.lineTo(1010, y); ctx.stroke(); } ctx.restore(); tag(ctx, 'gran desnivel', 860, (p0[1] + p1[1]) / 2, 32, a); }
  pill(ctx, '¿CÓMO SUBÍAN LOS MATERIALES?', 540, 270, 48, t, T.transportaban - 0.1, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.transp, TB.medios - TB.transp, 1); k.play('riser', T.toneladas, { dur: 1.8, gain: 0.25 }); FX.aparece(k, T.transportaban - 0.1); FX.flecha(k, T.toneladas, 1.4); } });

 // 13 · CARROS, ANIMALES Y TRABAJO HUMANO: cada medio en el terreno que le corresponde
 B.push({ t0: TB.medios, t1: TB.pend, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const cam = P.camAt([[TB.medios, 300, 1500, 1.5], [T.animales, 380, 1330, 1.35], [T.cantidades, 520, 1100, 1.25], [TB.pend, 560, 1000, 1.15]], t);
  ctx.save(); P.camApply(ctx, cam); slopeScene(ctx, t, { build: 0.75 });
  // carro por el camino llano del valle
  ctx.fillStyle = 'rgba(176,144,104,0.9)'; ctx.fillRect(-300, 1640, 900, 34); P.oxcart(ctx, lerp(-160, 260, win(t, TB.medios, T.animales + 0.5)), 1660, 260, t, { load: 'ladrillos', phase: t * 0.6 });
  // animales de carga por el primer tramo del sendero
  const pa = P.path(PATH); for (let i = 0; i < 2; i++) { const s = pa.L * (0.12 + 0.12 * win(t, TB.medios, TB.pend) + i * 0.05), q = pa.at(s); P.packAnimal(ctx, q[0], q[1] + 4, 110, t * 1.4 + i * 0.5, { load: i ? 'piedra' : 'ladrillos', dir: Math.cos(q[2]) >= 0 ? 1 : -1 }); }
  // personas en el tramo más empinado
  for (let i = 0; i < 4; i++) { const s = pa.L * (0.55 + i * 0.1 + 0.05 * win(t, TB.medios, TB.pend)), q = pa.at(s); P.porter(ctx, q[0], q[1] + 4, 120, t * 1.1 + i * 0.27, { load: i % 2 ? 'ladrillos' : 'piedra', var: i }); }
  ctx.restore();
  [['CARROS', T.carros, 200], ['ANIMALES', T.animales, 540], ['PERSONAS', T.trabajo18 - 0.4, 880]].forEach(([s, t0, x]) => { const a = sm(t0 - 0.15, t0 + 0.15, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x - 150, 360, 300, 84, 42, C.oro); txt(ctx, s, x, 403, 36, C.fondo); ctx.restore(); });
  pill(ctx, 'TRANSPORTE MANUAL Y ANIMAL', 540, 260, 48, t, T.utilizaban18, C.blanco, C.fondo);
  tag(ctx, 'cada medio, según el terreno y la época', 540, 1330, 32, sm(T.cantidades, T.cantidades + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.ruedas(k, T.carros - 0.3, 2.4, 1); FX.cascos(k, T.animales - 0.1, 8, 0.32, 1); FX.pasosTierra(k, T.cantidades, 8, 0.38, 0.9); FX.etiqueta(k, T.carros); FX.etiqueta(k, T.animales); FX.etiqueta(k, T.trabajo18 - 0.4); } });

 // 14 · PENDIENTES EXTREMAS: escalones tallados, cargas manejables, la muralla en construcción en la cresta
 B.push({ t0: TB.pend, t1: TB.torres, in: { type: 'rise', d: 0.45 }, draw(ctx, t) {
  const cam = P.camAt([[TB.pend, 420, 1420, 1.9], [T.empinadas + 0.5, 520, 1150, 1.45], [T.manualmente, 650, 900, 1.15], [TB.torres, 700, 860, 1.0]], t);
  ctx.save(); P.camApply(ctx, cam); slopeScene(ctx, t, { build: 0.6 + 0.1 * win(t, TB.pend, TB.torres) });
  const pa = P.path(PATH); for (let i = 0; i < 7; i++) { const s = pa.L * ((0.25 + i * 0.11 + 0.04 * (t - TB.pend) * 0.25) % 1), q = pa.at(s); P.porter(ctx, q[0], q[1] + 4, 120, t * 1.0 + i * 0.31, { load: ['piedra', 'ladrillos', 'tierra'][i % 3], var: i }); }
  P.laborer(ctx, 860, 765, 110, t * 1.6, { pose: 'chisel', var: 3 }); P.laborer(ctx, 930, 755, 110, t * 1.6 + 0.5, { pose: 'chisel', var: 1 });
  ctx.restore();
  pill(ctx, 'A MANO POR LAS PENDIENTES', 540, 270, 48, t, T.empinadas - 0.2, C.oro, C.fondo);
  tag(ctx, 'cargas que una persona podía llevar, en muchos viajes', 540, 380, 32, sm(T.manualmente - 0.3, T.manualmente + 0.1, t));
  scrim(ctx);
 }, sfx(k) { FX.pasosTierra(k, TB.pend + 0.2, 10, 0.5, 1); FX.viento(k, TB.pend, TB.torres - TB.pend, 1.1); FX.aparece(k, T.empinadas - 0.2); FX.golpePiedra(k, T.manualmente + 0.3); } });

 // 15 · TORRES Y VIGILANCIA: la cámara sigue el muro hasta una torre, sube y conecta con otra torre que da la señal
 B.push({ t0: TB.torres, t1: TB.gener, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = P.camAt([[TB.torres, 420, 1050, 1.9], [T.torres, 520, 980, 1.6], [T.observar, 720, 880, 0.9], [TB.gener, 760, 860, 0.75]], t);
  const sig = sm(T.comunicar - 0.3, T.comunicar + 0.5, t);
  const r = ridgeShot(ctx, t, { cam, sun: [880, 380], towers: [0.37, 0.43, 0.49, 0.55], towerS: 120, smokeAt: 0.55, smoke: sig });
  // conexión entre torres (vista)
  const pa = r.pa, tA = pa.at(0.43 * pa.L), tB = pa.at(0.55 * pa.L), A2 = camPt(cam, [tA[0], tA[1] - 120]), B2 = camPt(cam, [tB[0], tB[1] - 120]);
  const la = sm(T.observar, T.observar + 0.4, t); if (la > 0) { ctx.save(); ctx.globalAlpha *= la; ctx.strokeStyle = C.oro; ctx.lineWidth = 5; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 50; ctx.beginPath(); ctx.moveTo(A2[0], A2[1]); ctx.quadraticCurveTo((A2[0] + B2[0]) / 2, Math.min(A2[1], B2[1]) - 140, B2[0], B2[1]); ctx.stroke(); ctx.restore(); }
  callout(ctx, A2[0], A2[1] + 40, 200, 600, 'TORRE DE VIGILANCIA', sm(T.vigilancia, T.vigilancia + 0.3, t), C.blanco);
  callout(ctx, B2[0], B2[1] - 40, 900, 560, 'SEÑAL DE HUMO', sig, C.oro, 'right');
  pill(ctx, 'OTRO DESAFÍO', 540, 270, 54, t, T.desafio - 0.2, C.blanco, C.fondo, T.construir21);
  pill(ctx, 'VIGILANCIA Y COMUNICACIÓN', 540, 270, 48, t, T.construir21 + 0.2, C.oro, C.fondo);
  tag(ctx, 'de torre en torre, avisos con humo o fuego', 540, 1330, 32, sm(T.comunicar + 0.3, T.comunicar + 0.7, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.torres, TB.gener - TB.torres, 1.2); FX.aparece(k, T.desafio - 0.2); FX.etiqueta(k, T.vigilancia); k.play('whoosh', T.observar - 0.3, { dur: 1.2, top: 1100, gain: 0.3 }); FX.hoguera(k, T.comunicar - 0.2, 2.4, 1); FX.etiqueta(k, T.comunicar + 0.1); } });

 // 16 · GENERACIONES: la misma ladera a lo largo del tiempo (estaciones y épocas); tramos nuevos, ruinas y reparaciones
 B.push({ t0: TB.gener, t1: TB.mapa2, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  const u = win(t, TB.gener, TB.mapa2), cam = [540 + 80 * u, 950, 0.78 + 0.08 * u];
  const season = u * 3, snow = sm(2.2, 2.7, season) * (1 - sm(2.9, 3, season)), autumn = sm(0.8, 1.4, season) * (1 - sm(2.0, 2.4, season));
  const sky = season < 2 ? ['#6f97ad', '#d7d6c4'] : ['#8798a3', '#d8dbd8'];
  ridgeShot(ctx, t, { cam, sky, style: u < 0.45 ? 'tierra' : 'ladrillo', build: lerp(0.35, 1, sm(0.1, 0.9, u)), ruin: u < 0.45 ? 0.2 : 0, nearC: autumn > 0.5 ? '#6b5a35' : undefined, snow, towers: [0.3, 0.38, 0.46, 0.54, 0.62, 0.7] });
  const eras = [['s. VII–III a. C.', 0.0], ['QIN · HAN', 0.22], ['SIGLOS DESPUÉS…', 0.45], ['MING', 0.68]]; let cur = eras[0][0]; eras.forEach(([s, a]) => { if (u >= a) cur = s; });
  ctx.save(); P.rr(ctx, 290, 360, 500, 80, 40, 'rgba(17,26,28,0.85)'); txt(ctx, cur, 540, 402, 38, C.oro, { w: 900 }); ctx.restore();
  pill(ctx, 'SIGLOS DE CONSTRUCCIÓN', 540, 260, 50, t, T.siglos22 - 0.2, C.oro, C.fondo);
  tag(ctx, 'tramos nuevos, abandonados y reparados en distintas épocas', 540, 1330, 32, sm(T.ampliando, T.ampliando + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.tiempo(k, TB.gener + 0.1, 2.5, 0.8); FX.viento(k, TB.gener, TB.mapa2 - TB.gener, 0.8); FX.ladrillo(k, T.ampliando, 3, 0.4, 0.6); FX.tiempo(k, T.transformando, 1.8, 0.6); } });

 // 17 · NO EXISTE UNA ÚNICA MURALLA CONTINUA: mapa con periodos de colores, tramos separados y conectados
 B.push({ t0: TB.mapa2, t1: TB.final, in: { type: 'zoom', d: 0.5, x: 540, y: 760 }, draw(ctx, t) {
  chinaShot(ctx, t, { periods: { estados: 1, qin: 1, han: 1, ming: 1 }, legend: 1, ends: 1, labels: 1 });
  const hi = sm(T.unica, T.unica + 0.4, t); if (hi > 0) { ctx.save(); ctx.globalAlpha *= hi * (0.5 + 0.5 * Math.sin(t * 5)); ctx.strokeStyle = C.oro; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.strokeRect(MAPR.x + 8, MAPR.y + 8, MAPR.w - 16, MAPR.h - 16); ctx.restore(); }
  pill(ctx, 'NO FUE UNA SOLA MURALLA', 540, 200, 50, t, T.sorprendente23 - 0.1, C.oro, C.fondo);
  tag(ctx, 'ni obra de un solo emperador', 540, 320, 34, sm(T.emperador - 0.3, T.emperador + 0.1, t));
  scrim(ctx);
 }, sfx(k) { FX.mapa(k, TB.mapa2 + 0.1); MUS.golpe(k, T.unica, { gain: 0.8, chord: ['D3', 'A3', 'D4', 'F4'] }); FX.aparece(k, T.sorprendente23 - 0.1); FX.tachado(k, T.emperador); } });

 // 18-19 · REVELACIÓN FINAL y CIERRE: vuelo sobre la muralla al atardecer; cierre limpio
 const finale = (ctx, t) => { const cam = P.camAt([[TB.final, 300, 1000, 1.8], [T.resultado, 480, 920, 1.1], [T.historia24, 560, 860, 0.8], [DURATION, 600, 840, 0.7]], t);
  ridgeShot(ctx, t, { cam, sun: [260, 620], sky: ['#5d7f98', '#f0c99a'], towers: [0.3, 0.36, 0.42, 0.48, 0.54, 0.6, 0.66, 0.72], fogA: 0.9 }); P.glow(ctx, 260, 560, 900, '255,200,140', 0.16); };
 B.push({ t0: TB.final, t1: TB.cierre, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  finale(ctx, t);
  pill(ctx, 'UNA OBRA DE MUCHAS GENERACIONES', 540, 270, 44, t, T.innumerables - 0.1, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.final, DURATION - TB.final, 0.9); k.play('whoosh', TB.final, { dur: 2, top: 900, gain: 0.25 }); FX.descubrir(k, T.innumerables - 0.1); MUS.golpe(k, T.historia24, { gain: 0.8, chord: ['D3', 'A3', 'D4', 'F#4'] }); } });
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'cut' }, draw(ctx, t) {
  finale(ctx, t);
  const a = sm(T.sigue, T.sigue + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(244,245,241,0.75)'; ctx.lineWidth = 2; const lw = 280 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 300); ctx.lineTo(540 + lw, 300); ctx.moveTo(540 - lw, 420); ctx.lineTo(540 + lw, 420); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 362, 64, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
  scrim(ctx);
 }, sfx(k) { k.play('whoosh', T.sigue, { dur: 0.8, top: 1200, gain: 0.25, minor: true }); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.asombroteca + 1.0); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['muralla', 'Gran', 'Muralla', 'China', 'montañas', 'desiertos', 'ingeniería', 'materiales', 'trabajo', 'humano', 'dinastías', '2.000', 'tierra', 'moldes', 'madera', 'compactarlas', 'apisonada', 'piedra', 'Ming', 'ladrillos', 'carros', 'animales', 'manualmente', 'torres', 'vigilancia', 'generaciones', 'emperador', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 520, q: 0.7, gain: 0.02, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   // banda sonora original orquestal (modo menor/dórico), sin clichés «orientales»; percusión rítmica en la tierra apisonada
   const Am = [['A1', 'E2', 'A2', 'C3'], ['F1', 'C2', 'F2', 'A2'], ['G1', 'D2', 'G2', 'B2'], ['E1', 'B1', 'E2', 'G#2']];
   const Dd = [['D2', 'A2', 'D3', 'F3'], ['C2', 'G2', 'C3', 'E3'], ['A#1', 'F2', 'A#2', 'D3'], ['A1', 'E2', 'A2', 'C#3']];
   MUS.epica(k, 0, TB.constr, { bpm: 64, chords: Am, gain: 1, drums: 0.35, strings: 1, ostinato: 0 });
   MUS.epica(k, TB.constr, TB.moldes, { bpm: 78, chords: Dd, gain: 0.85, drums: 0.3, strings: 0.85, ostinato: 0.6 });
   MUS.epica(k, TB.moldes, TB.piedra, { bpm: 96, chords: Am, gain: 0.8, drums: 0.75, strings: 0.7, ostinato: 0.9 });
   MUS.epica(k, TB.piedra, TB.transp, { bpm: 84, chords: Dd, gain: 0.85, drums: 0.4, strings: 0.9, ostinato: 0.6 });
   MUS.epica(k, TB.transp, TB.torres, { bpm: 88, chords: Am, gain: 0.9, drums: 0.6, strings: 0.9, ostinato: 0.8 });
   MUS.epica(k, TB.torres, TB.mapa2, { bpm: 70, chords: Dd, gain: 0.85, drums: 0.25, strings: 1, ostinato: 0.4 });
   MUS.epica(k, TB.mapa2, T.sigue, { bpm: 76, chords: [['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3'], ['F1', 'C2', 'F2', 'A2'], ['A1', 'E2', 'A2', 'C#3']], gain: 1, drums: 0.7, strings: 1, ostinato: 0.7 });
   MUS.epica(k, T.sigue, DURATION, { bpm: 60, chords: [['D2', 'A2', 'D3', 'F#3']], gain: 0.9, drums: 0, strings: 1, ostinato: 0 });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
