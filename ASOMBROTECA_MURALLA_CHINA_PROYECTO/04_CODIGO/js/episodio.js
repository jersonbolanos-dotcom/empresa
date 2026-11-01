// =====================================================================================================
// episodio.js — «¿Cómo construyeron la Gran Muralla China sin maquinaria moderna?» · Asombroteca · PLANTILLA v1.14.1 · V2 (revisión final)
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
  y20: SG(20).s, desafio: wt(20, 'desafío'), construir21: SG(21).s, torres: wt(21, 'torres'), vigilancia: wt(21, 'vigilancia'), fortificaciones: wt(21, 'fortificaciones'), observar: wt(21, 'observar'), territorio: wt(21, 'territorio'), comunicar: wt(21, 'comunicar'), amenazas: wt(21, 'amenazas'),
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

 // ---------------- paisaje compartido con PARALAJE: capas lejanas con cámara atenuada; cresta, muralla y torres con cámara completa ----------------
 // o: { cam, sun, sky, hor, seed, arid, style, build, ruin, smokeAt, smoke, towers, towerS, pavilion, fogA, snow, before, after, prev:{style, ruin} }
 // terreno base compartido: la misma cresta para dibujar, colocar torres y orientar la cámara (sistema único terreno + muralla + torres)
 const RIDGE0 = { hor: 760, seed: 5, front: { y: 1180, amp: 400 }, rugged: 1 }, GY0 = P.rangeRidge(RIDGE0), TX0 = P.ridgePeaks(GY0, -2000, 3100, 300);
 const nearT = (x) => TX0.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a), TX0[0]);
 function ridgeShot(ctx, t, o = {}) {
  const cam = o.cam || [540, 960, 1], pc = [540 + (cam[0] - 540) * 0.3, 960 + (cam[1] - 960) * 0.35, Math.pow(cam[2], 0.35)];
  const R0 = { hor: o.hor ?? 760, sun: o.sun === null ? null : (o.sun || [820, 470]), sunA: o.sunA, sky: o.sky, seed: o.seed ?? 5, arid: o.arid || 0, x0: -2200, x1: 3300, front: { y: o.fy ?? 1180, amp: o.famp ?? 400 }, fogA: o.fogA ?? 0.7, nearC: o.nearC, farC: o.farC, rugged: 1 };
  ctx.save(); P.camApply(ctx, pc); P.ranges(ctx, t, { ...R0, part: 'back' }); ctx.restore();
  ctx.save(); P.camApply(ctx, cam); const rg = P.ranges(ctx, t, { ...R0, part: 'front' }); const gy = rg.ridge;
  const TX = o.towersX || (R0.seed === 5 && (o.fy ?? 1180) === 1180 && (o.famp ?? 400) === 400 ? TX0 : P.ridgePeaks(gy, -2000, 3100, 300));
  if (o.before) o.before(ctx, rg, TX);
  const sunL = !!(R0.sun && R0.sun[0] < 540), base = { h: o.wh ?? 48, sunLeft: sunL };
  if (o.prev) P.wallSystem(ctx, gy, -2100, 3200, t, { ...base, style: o.prev.style, ruin: o.prev.ruin || 0, towersX: o.prev.towers ? TX : [] });
  const ws = P.wallSystem(ctx, gy, -2100, 3200, t, { ...base, style: o.style || 'ladrillo', build: o.build ?? 1, towersX: TX, ruin: o.ruin || 0, towerSmoke: TX.map((x, i) => (o.smokeOf ? o.smokeOf(x, i) : 0)), pavilionX: o.pavilionX || [nearT(250), nearT(900)], glow: o.glow });
  if (o.snow) { ctx.save(); ctx.globalAlpha *= o.snow * 0.35; ctx.fillStyle = 'rgba(240,244,246,0.85)'; ctx.beginPath(); ctx.moveTo(-2200, 2600); for (let x = -2200; x <= 3300; x += 18) ctx.lineTo(x, gy(x) + 10 + 18 * Math.sin(x * 0.03)); ctx.lineTo(3300, 2600); ctx.closePath(); ctx.fill(); ctx.restore(); }
  if (o.after) o.after(ctx, rg, ws, TX);
  ctx.restore(); return { rg, ws, TX };
 }
 // valle árido de la obra de tierra apisonada (reconstrucción)
 const groundSite = (ctx, t, o = {}) => { P.ranges(ctx, t, { hor: o.hor ?? 820, sun: [840, 520], sky: ['#8fb0c2', '#e6dcc4'], seed: 12, arid: 0.75, layers: 4, x0: -800, x1: 1900, front: { y: 1020, amp: 160 }, fogA: 0.6 });
  const g = ctx.createLinearGradient(0, 1040, 0, 2000); g.addColorStop(0, '#b08a5c'); g.addColorStop(1, '#6d5034'); ctx.fillStyle = g; ctx.fillRect(-800, 1040, 2700, 1200); const R = H.rng(31); ctx.fillStyle = 'rgba(90,64,40,0.35)'; for (let i = 0; i < 260; i++) ctx.fillRect(R.range(-700, 1800), R.range(1050, 1950), R.range(2, 6), 2); };
 // porteadores que llegan a la obra: avanzan sin patinar (fase = distancia / zancada), aparecen y desaparecen fuera del foco
 const porters = (ctx, t, n, x0, x1, y, h, speed, loadF) => { for (let i = 0; i < n; i++) { const L = x1 - x0, s = ((t * speed + i * L / n) % L), x = x0 + s, a = sm(0, 0.12, s / L) * (1 - sm(0.86, 1, s / L)); if (a <= 0) continue; ctx.save(); ctx.globalAlpha *= a; P.porter(ctx, x, y + i * 26, h, s / (h * 0.85), { load: loadF(i), var: i + 2 }); ctx.restore(); } };

 const B = [];
 // 1 · GANCHO: vuelo sobre la cordillera; desciende hacia una torre con pabellón y recorre el muro
 const HT = nearT(250), camHook = (t) => P.camAt([[0, 600, 780, 0.55], [2.6, 520, 880, 0.85], [T.imposibles, HT + 40, GY0(HT) - 70, 1.7], [T.maquinaria + 0.4, HT - 180, GY0(HT - 180) - 50, 2.1], [TB.constr, HT - 320, GY0(HT - 320) - 50, 2.25]], t);
 B.push({ t0: 0, t1: TB.constr, draw(ctx, t) {
  ridgeShot(ctx, t, { cam: camHook(t), fogA: 0.8 });
  pill(ctx, '¿CÓMO CONSTRUYERON ESTO?', 540, 270, 54, t, T.gigantesca, C.oro, C.fondo, T.sin1);
  const icons = [[T.excavadoras, icoExc, 270], [T.gruas, icoGrua, 540], [T.maquinaria, icoGear, 810]];
  icons.forEach(([t0, f, x]) => { const a = sm(t0 - 0.2, t0 + 0.1, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.circle(ctx, x, 330, 96, 'rgba(244,245,241,0.95)'); f(ctx, x, 330, 96); ctx.restore(); crossX(ctx, x, 330, 96, win(t, t0 + 0.15, t0 + 0.45)); });
  pill(ctx, 'SIN MAQUINARIA MODERNA', 540, 500, 46, t, T.maquinaria, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, 0, TB.constr + 0.4, 1.3); k.play('whoosh', 0.1, { dur: 2.5, top: 900, gain: 0.3 }); k.play('whoosh', T.imposibles - 0.6, { dur: 1.2, top: 1600, gain: 0.3, minor: true }); FX.aparece(k, T.gigantesca); FX.tachado(k, T.excavadoras + 0.15); FX.tachado(k, T.gruas + 0.15); FX.tachado(k, T.maquinaria + 0.15); MUS.golpe(k, T.muralla0, { gain: 0.7, chord: ['A2', 'E3', 'A3', 'C4'] }); } });

 // 2 · LOS CONSTRUCTORES: nube de polvo → reconstrucción con personas distintas, encofrados y herramientas
 const workersScene = (ctx, t, o = {}) => { groundSite(ctx, t);
  porters(ctx, t, 3, -260, 420, 1390, 200, 36, (i) => (i === 1 && o.stone ? 'piedra' : 'tierra'));
  const R = P.rammedEarth(ctx, 720, 1300, 540, 300, t, { total: 8, done: o.done ?? 3, loose: o.loose ?? 1, compact: 0.45, form: o.form ?? 1, workers: o.workers ?? 3, hit: t * 1.6, cut: o.cut || 0, glowLayer: o.glowLayer, seed: 5 });
  P.laborer(ctx, 170, 1660, 240, t * 1.4, { pose: 'chisel', var: 4, target: [250, 1640] }); ctx.fillStyle = '#8a6440'; ctx.beginPath(); ctx.ellipse(270, 1662, 70, 18, 0, Math.PI, TAU); ctx.fill();
  P.figure(ctx, 1000, 1610, 230, 0, { pose: 'look', var: 6 }); return R; };
 B.push({ t0: TB.constr, t1: TB.desafio, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = P.camAt([[TB.constr, 480, 1280, 1.4], [TB.desafio, 620, 1250, 1.12]], t);
  ctx.save(); P.camApply(ctx, cam); workersScene(ctx, t); ctx.restore();
  const du = win(t, TB.constr, TB.constr + 1.2); if (du < 1) { ctx.save(); ctx.globalAlpha = 1 - du; ctx.fillStyle = 'rgba(206,182,140,1)'; ctx.fillRect(0, 0, W, HH); ctx.restore(); for (let i = 0; i < 6; i++) P.dust(ctx, 180 + i * 150, 900 + (i % 2) * 200, t, TB.constr - 0.2 + i * 0.05, { s: 260, seed: i + 1 }); }
  pill(ctx, 'RECONSTRUCCIÓN HISTÓRICA', 540, 270, 46, t, T.antiguos - 0.3, C.oro, C.fondo);
  tag(ctx, 'herramientas, ropa y técnicas cambiaban según la época y la región', 540, 380, 32, sm(T.chinos, T.chinos + 0.4, t));
  scrim(ctx);
 }, sfx(k) { k.noise(TB.constr - 0.2, { dur: 1.6, color: 'pink', filter: 'lowpass', f: [[0, 2500], [1.6, 400]], gain: 0.12, a: 0.05 }); FX.apisonar(k, TB.constr + 0.8, 5, 0.31, 0.6); FX.pasosTierra(k, TB.constr + 0.5, 6, 0.42, 0.8); FX.viento(k, TB.constr, TB.desafio - TB.constr, 0.5); } });

 // 3 · EL DESAFÍO: la cámara sube sobre la obra; el muro se vuelve transparente y muestra sus capas
 B.push({ t0: TB.desafio, t1: TB.mapa, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = P.camAt([[TB.desafio, 600, 1150, 0.95], [T.la5, 660, 1220, 1.25], [TB.mapa, 720, 1180, 1.6]], t);
  const cut = sm(T.combinacion, T.combinacion + 0.6, t);
  ctx.save(); P.camApply(ctx, cam); workersScene(ctx, t, { done: 5, loose: 0, form: 1 - cut, workers: cut > 0.5 ? 0 : 3, cut, glowLayer: cut > 0.5 ? 2 : null, stone: true }); ctx.restore();
  const q = camPt(cam, [720, 1180]); callout(ctx, q[0], q[1], 760, 620, 'CAPAS', cut, C.oro, 'left');
  const words = [['INGENIERÍA', T.ingenieria, 230], ['MATERIALES', T.materiales5, 540], ['TRABAJO', T.trabajo5, 850]];
  words.forEach(([s, t0, x], i) => { const a = sm(t0 - 0.15, t0 + 0.15, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x - 150, 370, 300, 84, 42, i === 1 ? C.oro : 'rgba(17,26,28,0.85)'); txt(ctx, s, x, 413, 34, i === 1 ? C.fondo : C.blanco); if (i < 2) txt(ctx, '+', x + 155, 413, 46, C.oro); ctx.restore(); });
  pill(ctx, '¿CÓMO LO LOGRARON?', 540, 260, 54, t, T.como4, C.blanco, C.fondo, T.la5);
  pill(ctx, 'LA RESPUESTA', 540, 260, 54, t, T.la5, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.desafio, TB.mapa - TB.desafio, 0.6); FX.aparece(k, T.como4); FX.revelar(k, T.combinacion); FX.etiqueta(k, T.ingenieria); FX.etiqueta(k, T.materiales5); FX.etiqueta(k, T.trabajo5); } });

 // ---------------- MAPA GRANDE del norte de China: cámara que recorre los periodos; etiquetas a tamaño fijo ----------------
 const MAPR = { x: 20, y: 470, w: 1040, h: 640 };
 const cnK = Math.cos(39 * Math.PI / 180), cnS = Math.min(MAPR.w / ((126 - 88) * cnK), MAPR.h / (46 - 32)), cnOx = MAPR.x + (MAPR.w - (126 - 88) * cnK * cnS) / 2, cnOy = MAPR.y + (MAPR.h - (46 - 32) * cnS) / 2;
 const projCN = (p) => [cnOx + (p[0] - 88) * cnK * cnS, cnOy + (46 - p[1]) * cnS]; // misma proyección que P.chinaMap con estos parámetros
 const PER = [['estados', 'REINOS COMBATIENTES', 's. VII–III a. C.', C.estados, [105.0, 35.4]], ['qin', 'QIN', 's. III a. C.', C.qin, [113.5, 43.2]], ['han', 'HAN', 's. II a. C.–II d. C.', C.han, [93.8, 42.7]], ['ming', 'MING', '1368–1644', C.ming, [113.8, 38.3]]];
 const mapLabel = (ctx, s, x, y, px, c, a = 1, bg = 'rgba(17,26,28,0.85)') => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `800 ${px}px Nunito`; const w = ctx.measureText(s).width + px * 0.9; const xx = cl(x, w / 2 + 20, W - w / 2 - 20); P.rr(ctx, xx - w / 2, y - px * 0.72, w, px * 1.44, px * 0.72, bg); txt(ctx, s, xx, y + 2, px, c); ctx.restore(); };
 function chinaShot(ctx, t, o = {}) {
  bgTech(ctx); const cam = o.cam || [540, 790, 1]; const per = o.periods || {};
  ctx.save(); ctx.beginPath(); ctx.rect(0, 380, W, 910); ctx.clip(); P.camApply(ctx, cam); P.chinaMap(ctx, MAPR.x, MAPR.y, MAPR.w, MAPR.h, t, {}); ctx.strokeStyle = 'rgba(200,210,190,0.4)'; ctx.lineWidth = 3 / cam[2]; ctx.strokeRect(MAPR.x, MAPR.y, MAPR.w, MAPR.h);
  PER.forEach(([k, , , c]) => { const p = per[k] || 0; if (p <= 0) return; const hi = o.hi === k ? 1.5 : 1; P.CNWALLS[k].forEach((seg) => P.mapWall(ctx, seg.map(projCN), p, t, { c, w: 12 / cam[2] * hi })); });
  ctx.restore();
  const Q = (ll) => camPt(cam, projCN(ll));
  // lugares y pasos fortificados (a tamaño fijo en pantalla)
  const la = o.labels ?? 1; const pl = (ll, s, dy, a, c = C.blanco) => { if (a <= 0) return; const p = Q(ll); if (p[0] < -50 || p[0] > W + 50 || p[1] < 400 || p[1] > 1270) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = C.blanco; ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, TAU); ctx.fill(); ctx.strokeStyle = C.fondo; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); mapLabel(ctx, s, p[0], p[1] + dy, 30, c, a); };
  pl([116.4, 39.9], 'Pekín', 40, la); pl([98.2, 39.8], 'paso de Jiayuguan', 42, o.ends ?? 0); pl([119.8, 40.0], 'paso de Shanhaiguan', -40, o.ends ?? 0); pl([94.7, 40.1], 'Dunhuang', -40, o.dun ?? 0);
  const ga = Q([101, 43.6]), ra = Q([109.3, 35.4]); if (la > 0) { ctx.save(); ctx.globalAlpha *= la * 0.9; if (ga[1] > 410 && ga[1] < 1265) txt(ctx, 'DESIERTO DE GOBI', ga[0], ga[1], 30, '#4a3c26', { w: 800 }); if (ra[1] > 410 && ra[1] < 1265) txt(ctx, 'río Amarillo', ra[0], ra[1], 28, '#cfe8f4', { w: 700 }); ctx.restore(); }
  // nombre de cada periodo junto a sus tramos
  PER.forEach(([k, name, date, c, ll]) => { const a = cl((per[k] || 0) * 2.5) * (o.names ?? 1); if (a <= 0) return; const p = Q(ll); if (p[1] < 410 || p[1] > 1265) return; mapLabel(ctx, `${name} · ${date}`, p[0], p[1], 32, c, a); });
  // leyenda simplificada
  if (o.legend) { ctx.save(); ctx.globalAlpha *= o.legend; P.rr(ctx, 40, 1300, 1000, 115, 24, 'rgba(17,26,28,0.9)'); PER.forEach(([k, name, , c], i) => { const x = 70 + (i % 2) * 520, y = 1332 + Math.floor(i / 2) * 52, a = 0.3 + 0.7 * cl((per[k] || 0) * 3); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = c; P.rr(ctx, x, y - 12, 70, 24, 12, c); txt(ctx, name, x + 86, y + 2, 32, C.blanco, { al: 'left' }); ctx.restore(); }); ctx.restore(); }
  mapLabel(ctx, 'esquema aproximado · distintos sistemas en distintas épocas', 540, 1262, 26, 'rgba(244,245,241,0.9)', o.note ?? 1, 'rgba(17,26,28,0.7)');
 }
 const camCN = (lon, lat, z) => { const p = projCN([lon, lat]); return [p[0], p[1], z]; };
 // 4-5 · NO SE CONSTRUYÓ DE UNA SOLA VEZ · MÁS DE 2.000 AÑOS: la cámara recorre el mapa mientras aparecen los tramos de cada periodo
 B.push({ t0: TB.mapa, t1: TB.mat, in: { type: 'zoom', d: 0.5, x: 540, y: 800 }, draw(ctx, t) {
  const kE = camCN(115, 40.6, 1.75), kQ = camCN(112, 39.8, 1.45), kH = camCN(99, 39.8, 1.6), kA = camCN(107, 39.0, 1.22);
  const cam = P.camAt([[TB.mapa, ...kE], [T.sola7, ...kE], [T.dinastias + 0.2, ...kQ], [T.levantaron + 0.4, ...kH], [T.reconstruyeron + 0.5, ...kH], [T.n2000 - 0.6, ...kA], [TB.mat, ...kA]], t);
  chinaShot(ctx, t, { cam, periods: { estados: sm(T.sola7 - 0.4, T.vez7 + 0.5, t), qin: sm(T.dinastias, T.levantaron + 0.5, t), han: sm(T.levantaron + 0.5, T.reconstruyeron + 0.5, t), ming: sm(T.reconstruyeron + 0.6, T.n2000 - 0.2, t) }, legend: sm(T.n2000 - 0.5, T.n2000, t), ends: sm(T.n2000 - 0.4, T.n2000, t), dun: sm(T.levantaron + 0.8, T.reconstruyeron, t) * (1 - sm(T.n2000 - 0.6, T.n2000 - 0.2, t)), names: 1 - sm(T.n2000 - 0.5, T.n2000, t) });
  pill(ctx, 'NO SE CONSTRUYÓ DE UNA SOLA VEZ', 540, 200, 44, t, T.gran7, C.oro, C.fondo, T.diferentes8);
  pill(ctx, 'MÁS DE 2.000 AÑOS DE HISTORIA', 540, 200, 46, t, T.n2000 - 0.2, C.oro, C.fondo);
  tag(ctx, 'proyectos separados de distintos estados y dinastías', 540, 300, 30, sm(T.dinastias, T.dinastias + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.mapa(k, TB.mapa + 0.1); FX.flecha(k, T.sola7 - 0.3, 1.2); FX.flecha(k, T.dinastias, 1.2); FX.flecha(k, T.levantaron + 0.5, 1.2); FX.flecha(k, T.reconstruyeron + 0.6, 1.4); FX.sello(k, T.n2000 - 0.2); FX.tiempo(k, T.diferentes8, 2.2, 0.6); } });

 // 6 · DIFERENTES MATERIALES: tres columnas comparables (alzado + corte): tierra apisonada · piedra · ladrillo y piedra (Ming)
 const miniWall = (ctx, t, cx, style, seed) => { ctx.save(); const g = ctx.createLinearGradient(0, 380, 0, 700); g.addColorStop(0, style === 'tierra' ? '#cbbd9c' : '#9fb7c2'); g.addColorStop(1, style === 'tierra' ? '#e4d3ac' : '#d6d8c8'); ctx.fillStyle = g; ctx.fillRect(cx - 175, 380, 350, 320); const gy = (x) => 610 - 40 * Math.sin((x - cx) * 0.012 + seed) - (style === 'tierra' ? -20 : 10);
  ctx.fillStyle = style === 'tierra' ? '#b8955f' : style === 'piedra' ? '#617a52' : '#58744a'; ctx.beginPath(); ctx.moveTo(cx - 180, 710); for (let x = cx - 180; x <= cx + 180; x += 10) ctx.lineTo(x, gy(x)); ctx.lineTo(cx + 180, 710); ctx.closePath(); ctx.fill();
  const pts = []; for (let x = cx - 200; x <= cx + 200; x += 10) pts.push([x, gy(x)]); P.wallPath(ctx, pts, t, { style, h: 44, towers: [0.62], towerS: 110, crenel: style === 'ladrillo', pavilion: [] }); ctx.restore(); };
 B.push({ t0: TB.mat, t1: TB.moldes, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  ridgeShot(ctx, t, { cam: [520 + 80 * win(t, TB.mat, TB.moldes), 960, 0.95], fogA: 0.8 }); { const dk = sm(T.mismos - 0.5, T.mismos, t); ctx.fillStyle = `rgba(17,26,28,${0.88 * dk})`; ctx.fillRect(0, 0, W, HH); }
  const cols = [['tierra', 'TIERRA APISONADA', C.tierra, T.mismos, 180, 3], ['piedra', 'PIEDRA', C.piedraL, T.materiales10, 540, 7], ['ming', 'LADRILLO Y PIEDRA', '#e08a6a', T.partes - 0.3, 900, 11]];
  cols.forEach(([k, name, c, t0, cx, seed]) => { const a = sm(t0 - 0.25, t0 + 0.1, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.rect(cx - 175, 380, 350, 320); ctx.clip(); miniWall(ctx, t, cx, k === 'ming' ? 'ladrillo' : k, seed); ctx.restore(); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(244,245,241,0.5)'; ctx.lineWidth = 3; ctx.strokeRect(cx - 175, 380, 350, 320); P.wallSection(ctx, cx, 1230, 300, 430, t, k === 'ming' ? 'ming' : k, { reeds: k === 'tierra' }); ctx.restore(); mapLabel(ctx, name, cx, 1300, 32, c, a); });
  const lb = (s, x, y, a) => mapLabel(ctx, s, x, y, 28, C.blanco, a, 'rgba(17,26,28,0.75)');
  lb('capas compactadas', 180, 740, sm(T.mismos + 0.3, T.mismos + 0.6, t)); lb('mampostería + relleno', 540, 740, sm(T.materiales10 + 0.3, T.materiales10 + 0.6, t)); lb('ladrillo sobre núcleo', 900, 740, sm(T.partes, T.partes + 0.3, t));
  pill(ctx, 'LO INTERESANTE', 540, 250, 50, t, T.interesante - 0.2, C.blanco, C.fondo, T.no10);
  pill(ctx, 'NO EN TODAS PARTES IGUAL', 540, 250, 48, t, T.no10, C.oro, C.fondo);
  tag(ctx, 'según la región, los materiales y la época · cortes plausibles, no universales', 540, 1385, 30, sm(T.partes, T.partes + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.aparece(k, T.interesante - 0.2); k.play('swish', T.mismos - 0.25, { dur: 0.35, gain: 0.4 }); k.play('swish', T.materiales10 - 0.25, { dur: 0.35, gain: 0.4 }); k.play('swish', T.partes - 0.55, { dur: 0.35, gain: 0.4 }); FX.etiqueta(k, T.mismos); FX.etiqueta(k, T.materiales10); FX.etiqueta(k, T.partes - 0.3); } });

 // 7-9 · MOLDES DE MADERA → COMPACTACIÓN (cada golpe compacta un poco; una capa termina antes de la siguiente) → TIERRA APISONADA
 const NL = 7, POUR = 0.45, RATE = 2.2, NEED = 9, NW = 3, LAYER0 = T.despues12 - 0.1;
 const contacts = (u) => { if (u <= 0) return 0; let n = 0; for (let i = 0; i < NW; i++) n += Math.max(0, Math.floor(u * RATE + i * 0.37 - 0.5) + 1); return n; };
 const RAMDUR = (() => { let u = 0; while (contacts(u) < NEED && u < 5) u += 0.01; return u + 0.12; })(), CYC = POUR + RAMDUR;
 function rammedState(t) {
  if (t < LAYER0) return { done: 2, loose: sm(T.capas11, T.tierra11 + 0.6, t), compact: 0, hit: 0.25, ram: false, layer: 3, cp: 0 };
  const u = t - LAYER0, k = Math.floor(u / CYC), f = u - k * CYC, done = Math.min(NL, 2 + k); if (done >= NL) return { done: NL, loose: 0, compact: 0, hit: 0.25, ram: false, layer: NL, cp: 1 };
  if (f < POUR) return { done, loose: k === 0 ? 1 : sm(0, POUR * 0.9, f), compact: 0, hit: 0.25, ram: false, layer: done + 1, cp: 0 };
  const ur = f - POUR, cp = cl(contacts(ur) / NEED); return { done, loose: 1, compact: cp, hit: ur * RATE, ram: true, layer: done + 1, cp };
 }
 B.push({ t0: TB.moldes, t1: TB.piedra, in: { type: 'zoom', d: 0.45, x: 540, y: 1100 }, draw(ctx, t) {
  const st = rammedState(t), endP = sm(T.esta13 - 0.2, T.esta13 + 0.5, t), cut = sm(T.tierra13, T.apisonada + 0.3, t);
  const cam = P.camAt([[TB.moldes, 640, 1230, 1.9], [T.moldes, 560, 1200, 1.6], [LAYER0, 540, 1190, 1.7], [T.esta13, 540, 1110, 1.35], [TB.piedra, 540, 1080, 1.2]], t);
  ctx.save(); P.camApply(ctx, cam); groundSite(ctx, t);
  const R = P.rammedEarth(ctx, 540, 1400, 600, 480, t, { total: NL, done: st.done, loose: st.loose, compact: st.compact, form: 1 - endP, workers: endP > 0.5 ? 0 : NW, hit: st.hit, cut, glowLayer: cut > 0.5 ? 3 : null, seed: 5 });
  if (t < LAYER0 + 0.3) { const a = sm(T.trabajadores11 - 0.3, T.trabajadores11, t) * (1 - sm(LAYER0, LAYER0 + 0.3, t)); ctx.save(); ctx.globalAlpha *= a; P.porter(ctx, 150, 1400, 230, (t - TB.moldes) * 0.0, { load: 'tierra', var: 3 }); ctx.restore(); if (st.loose > 0 && st.loose < 1) { ctx.fillStyle = 'rgba(169,132,90,0.9)'; for (let i = 0; i < 18; i++) { const u = ((t * 2.5 + i / 18) % 1); ctx.beginPath(); ctx.arc(320 + i * 2 + u * 50, 1080 + u * (R.surf - 1080), 6 + (i % 3) * 2, 0, TAU); ctx.fill(); } } }
  ctx.restore();
  const pM = camPt(cam, [540 + 320, 1400 - 420]);
  callout(ctx, pM[0], pM[1], 780, 640, 'MOLDE DE MADERA', sm(T.moldes - 0.2, T.moldes + 0.2, t) * (1 - endP), C.oro, 'right');
  const pT = camPt(cam, [540 - 330, 1400 - 380]); callout(ctx, pT[0], pT[1], 120, 760, 'tablón en corte', sm(T.madera11, T.madera11 + 0.3, t) * (1 - sm(LAYER0, LAYER0 + 0.3, t)), C.blanco);
  // indicador claro: número de capa y compactación de la capa actual (0–100 %)
  const ia = sm(LAYER0 + 0.2, LAYER0 + 0.5, t) * (1 - sm(T.esta13 - 0.3, T.esta13, t)); if (ia > 0) { ctx.save(); ctx.globalAlpha *= ia; P.rr(ctx, 240, 1285, 600, 110, 24, 'rgba(17,26,28,0.88)'); txt(ctx, `CAPA ${Math.min(st.layer, NL)} DE ${NL}`, 270, 1318, 32, C.oro, { al: 'left' }); txt(ctx, `compactación ${Math.round(st.cp * 10) * 10} %`, 810, 1318, 30, C.blanco, { al: 'right', w: 700 }); ctx.fillStyle = 'rgba(244,245,241,0.18)'; ctx.fillRect(270, 1352, 540, 18); ctx.fillStyle = C.oro; ctx.fillRect(270, 1352, 540 * st.cp, 18); ctx.restore(); }
  pill(ctx, 'CAPAS DE TIERRA', 540, 270, 54, t, T.capas11, C.oro, C.fondo, LAYER0);
  pill(ctx, 'COMPACTACIÓN CAPA POR CAPA', 540, 270, 46, t, LAYER0, C.oro, C.fondo, T.esta13);
  pill(ctx, 'TIERRA APISONADA', 540, 270, 58, t, T.tierra13 - 0.1, C.oro, C.fondo);
  tag(ctx, 'muchos golpes por capa: cada impacto la compacta un poco', 540, 390, 30, sm(T.repetidamente, T.repetidamente + 0.4, t) * (1 - sm(T.esta13 - 0.3, T.esta13, t)));
  tag(ctx, 'sin cemento · en algunos tramos se intercalaban ramas o cañas', 540, 390, 30, sm(T.apisonada, T.apisonada + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.madera(k, TB.moldes + 0.2, 2, 0.8); FX.vertido(k, T.capas11, 1.4, 1);
  for (let L = 0; ; L++) { const t0 = LAYER0 + L * CYC; if (t0 > T.esta13 - 0.3 || 2 + L >= NL) break; if (L > 0) FX.vertido(k, t0, POUR, 0.6); let prev = 0; for (let u = 0; u < RAMDUR; u += 0.01) { const c = contacts(u); if (c > prev && c <= NEED) { k.tone(t0 + POUR + u, { f: [[0, 120], [0.08, 55]], dur: 0.16, gain: 0.26, a: 0.002 }); k.noise(t0 + POUR + u, { dur: 0.16, color: 'brown', filter: 'lowpass', f: 500, gain: 0.1, a: 0.002, minor: true }); } prev = c; } }
  FX.revelar(k, T.tierra13); FX.sello(k, T.apisonada + 0.2); } });

 // 10 · PIEDRA EN LAS MONTAÑAS: cantera en una cornisa, pila apoyada, porteador que sube la piedra hasta el muro
 B.push({ t0: TB.piedra, t1: TB.ming, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = P.camAt([[TB.piedra, 260, 1240, 1.6], [T.piedra14, 460, 1160, 1.3], [TB.ming, 600, 1080, 1.15]], t);
  const pc = [540 + (cam[0] - 540) * 0.3, 960 + (cam[1] - 960) * 0.35, Math.pow(cam[2], 0.35)]; ctx.save(); P.camApply(ctx, pc); P.ranges(ctx, t, { hor: 720, sun: [860, 430], seed: 21, layers: 4, x0: -1200, x1: 2300, front: { y: 980, amp: 260 }, fogA: 0.6 }); ctx.restore();
  ctx.save(); P.camApply(ctx, cam);
  const gy = (x) => x < 470 ? 1380 - (x + 200) * 0.03 : 1360 - (x - 470) * 0.62;
  ctx.fillStyle = '#556b48'; ctx.beginPath(); ctx.moveTo(-400, 2300); for (let x = -400; x <= 1500; x += 20) ctx.lineTo(x, Math.max(820, gy(x))); ctx.lineTo(1500, 2300); ctx.closePath(); ctx.fill();
  const Rr = H.rng(8); ctx.fillStyle = 'rgba(124,130,125,0.55)'; for (let i = 0; i < 26; i++) { const x = Rr.range(-250, 1350), y = Math.max(820, gy(x)) + Rr.range(30, 500); ctx.beginPath(); ctx.ellipse(x, y, Rr.range(14, 40), Rr.range(8, 20), 0, 0, TAU); ctx.fill(); }
  P.granite(ctx, [[-260, 1385], [-200, 1150], [-60, 1090], [120, 1130], [220, 1250], [260, 1372]], { seed: 4, c1: '#a5aaa2', c2: '#6e756f' });
  const wp = []; for (let x = 520; x <= 1500; x += 14) wp.push([x, Math.max(820, gy(x)) + 6]); P.wallPath(ctx, wp, t, { style: 'piedra', h: 70, build: 0.78 + 0.2 * win(t, TB.piedra, TB.ming), towers: [0.62], towerS: 160, crenel: false });
  ctx.fillStyle = 'rgba(25,30,22,0.4)'; ctx.beginPath(); ctx.ellipse(360, 1370, 120, 16, 0, 0, TAU); ctx.fill();
  for (let i = 0; i < 9; i++) { const sx = 270 + (i % 4) * 46 + Math.floor(i / 4) * 22, sy = 1360 - Math.floor(i / 4) * 30; if (Math.floor(i / 4) > 1) continue; P.granite(ctx, [[sx - 24, sy], [sx - 18, sy - 26], [sx + 16, sy - 30], [sx + 24, sy - 4], [sx + 10, sy + 4]], { seed: 20 + i, c1: '#9aa098', c2: '#646b65' }); }
  P.granite(ctx, [[96, gy(96)], [104, gy(96) - 30], [150, gy(96) - 34], [160, gy(96)]], { seed: 3, c1: '#a5aaa2', c2: '#6e756f' }); P.laborer(ctx, 40, gy(40), 180, t * 1.6, { pose: 'chisel', var: 1, target: [120, gy(96) - 30] });
  P.laborer(ctx, 200, gy(200), 180, t * 1.6 + 0.45, { pose: 'chisel', var: 4, target: [270, 1335] });
  const L = 330, s = ((t - TB.piedra) * 42) % L, px = 470 + s * Math.cos(Math.atan(0.62)), py = gy(px); P.porter(ctx, px, py, 165, s / (165 * 0.85), { load: 'piedra', var: 2 });
  ctx.restore();
  pill(ctx, 'PIEDRA LOCAL', 540, 270, 58, t, T.piedra14 - 0.1, C.oro, C.fondo);
  tag(ctx, 'reconstrucción plausible: se usaba la roca del propio terreno', 540, 380, 32, sm(T.piedra14 + 0.3, T.piedra14 + 0.7, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.piedra, TB.ming - TB.piedra, 0.7); FX.golpePiedra(k, T.montanas14); FX.golpePiedra(k, T.montanas14 + 0.6); FX.golpePiedra(k, T.piedra14 + 0.3); FX.aparece(k, T.piedra14 - 0.1); } });

 // 11 · DINASTÍA MING: corte plausible de un tramo; las hiladas de ladrillo se colocan sobre el cimiento de piedra
 B.push({ t0: TB.ming, t1: TB.transp, in: { type: 'zoom', d: 0.45, x: 540, y: 1000 }, draw(ctx, t) {
  bgTech(ctx); const bd = sm(T.reforzados - 0.6, T.ladrillos + 0.6, t);
  const ge = sm(T.ming, T.ming + 0.4, t) * (1 - sm(T.reforzados, T.reforzados + 0.3, t)), gb = sm(T.ladrillos, T.ladrillos + 0.3, t) * (1 - sm(T.piedra15, T.piedra15 + 0.3, t)), gs = sm(T.piedra15, T.piedra15 + 0.3, t);
  ctx.save(); const sc = 1 + 0.05 * win(t, TB.ming, TB.transp); ctx.translate(540, 1050); ctx.scale(sc, sc); ctx.translate(-540, -1050);
  const pts = P.wallSection(ctx, 540, 1300, 780, 700, t, 'ming', { build: bd, glow: { earth: ge > 0.3, fill: ge > 0.3, brick: gb > 0.3, stone: gs > 0.3 } });
  if (bd > 0.05 && bd < 1) { const hy = lerp(1300 - 105, 1300 - 700 * 0.95, bd); P.figure(ctx, 930 - 40 * bd, hy, 140, 0, { pose: 'chisel', var: 3, dir: -1, target: [880 - 40 * bd, hy - 30] }); ctx.fillStyle = '#A45C42'; ctx.fillRect(860 - 40 * bd, hy - 36, 40, 16); }
  ctx.restore();
  callout(ctx, pts.earth[0], pts.earth[1], 110, 1180, 'TIERRA COMPACTADA', sm(T.ming, T.ming + 0.4, t), C.tierra);
  callout(ctx, pts.fill[0], pts.fill[1], 110, 600, 'CASCAJO Y PIEDRA', sm(T.ming + 0.3, T.ming + 0.7, t), C.blanco);
  callout(ctx, pts.brick[0], pts.brick[1], 990, 800, 'LADRILLO', sm(T.ladrillos, T.ladrillos + 0.3, t), '#e08a6a', 'right');
  callout(ctx, pts.stone[0], pts.stone[1], 990, 1400, 'CIMIENTO DE PIEDRA', gs, C.piedraL, 'right');
  pill(ctx, 'DINASTÍA MING · 1368–1644', 540, 250, 48, t, T.dinastia15, C.oro, C.fondo);
  tag(ctx, 'sección plausible: la estructura variaba según la región y el tramo', 540, 360, 30, sm(T.reforzados - 0.3, T.reforzados, t));
  scrim(ctx);
 }, sfx(k) { FX.tiempo(k, TB.ming, 1.0, 0.6); FX.revelar(k, T.ming); FX.ladrillo(k, T.reforzados - 0.4, 6, 0.3); FX.golpePiedra(k, T.piedra15); } });

 // ---------------- MONTAÑA DEL TRANSPORTE: valle con camino de carros, sendero en zigzag que sigue las curvas de nivel, escalones arriba ----------------
 const PATH = P.spline([[300, 1626], [640, 1566], [700, 1530], [340, 1462], [290, 1428], [660, 1352], [712, 1318], [370, 1248], [330, 1214], [640, 1138], [684, 1104], [452, 1036], [432, 1002], [690, 928], [722, 896], [610, 850], [740, 792]], 8), PA = P.path(PATH);
 const crestY = (x) => x < 520 ? 760 : x < 760 ? lerp(760, 782, (x - 520) / 240) : lerp(782, 700, (x - 760) / 540);
 function slopeScene(ctx, t, cam, o = {}) {
  const pc = [540 + (cam[0] - 540) * 0.3, 960 + (cam[1] - 960) * 0.35, Math.pow(cam[2], 0.35)]; ctx.save(); P.camApply(ctx, pc); P.ranges(ctx, t, { hor: 640, sun: [860, 420], seed: 33, layers: 4, x0: -1400, x1: 2500, front: { y: 900, amp: 300 }, fogA: 0.7 }); ctx.restore();
  ctx.save(); P.camApply(ctx, cam);
  // valle y camino de carros (llano)
  ctx.fillStyle = '#6f8a55'; ctx.fillRect(-1400, 1600, 3800, 1400); ctx.fillStyle = 'rgba(176,144,104,0.95)'; ctx.fillRect(-1400, 1626, 1800, 44); ctx.fillStyle = 'rgba(120,96,66,0.5)'; ctx.fillRect(-1400, 1666, 1800, 4);
  // montaña: flanco curvo, cresta y bandas de relieve (curvas de nivel)
  const mpoly = () => { ctx.beginPath(); ctx.moveTo(0, 1640); ctx.quadraticCurveTo(300, 1300, 520, 760); ctx.lineTo(760, 782); ctx.lineTo(1500, 690); ctx.lineTo(1500, 1640); ctx.closePath(); };
  mpoly(); const mg = ctx.createLinearGradient(0, 760, 0, 1640); mg.addColorStop(0, '#5b7548'); mg.addColorStop(1, '#4a6340'); ctx.fillStyle = mg; ctx.fill();
  ctx.save(); mpoly(); ctx.clip(); for (let i = 0; i < 12; i++) { const y = 820 + i * 70; ctx.fillStyle = i % 2 ? 'rgba(255,240,210,0.05)' : 'rgba(20,30,18,0.07)'; ctx.beginPath(); ctx.moveTo(-100, y); for (let x = -100; x <= 1500; x += 30) ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * 10); ctx.lineTo(1500, y + 70); ctx.lineTo(-100, y + 70); ctx.closePath(); ctx.fill(); }
   const lg = ctx.createLinearGradient(0, 0, 900, 0); lg.addColorStop(0, 'rgba(255,236,200,0.14)'); lg.addColorStop(1, 'rgba(0,0,0,0.18)'); ctx.fillStyle = lg; ctx.fillRect(-100, 700, 1700, 1000);
   const R = H.rng(4); for (let i = 0; i < 140; i++) { const x = R.range(0, 1450), y = R.range(800, 1620); ctx.fillStyle = i % 5 ? 'rgba(40,60,36,0.55)' : 'rgba(124,130,125,0.7)'; ctx.beginPath(); ctx.ellipse(x, y, R.range(4, 12), R.range(3, 8), 0, 0, TAU); ctx.fill(); }
  ctx.restore();
  // sendero con ancho, borde en sombra y escalones en el tramo más empinado
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; P.strokePath(ctx, PATH.map(([x, y]) => [x + 3, y + 7]), 24, 'rgba(30,40,24,0.35)'); P.strokePath(ctx, PATH, 22, '#b9976b'); P.strokePath(ctx, PATH, 6, 'rgba(220,196,160,0.45)');
  ctx.strokeStyle = 'rgba(90,70,48,0.8)'; ctx.lineWidth = 2.5; for (let s = PA.L * 0.78; s < PA.L; s += 11) { const q = PA.at(s), nx = -Math.sin(q[2]), ny = Math.cos(q[2]); ctx.beginPath(); ctx.moveTo(q[0] - nx * 10, q[1] - ny * 10); ctx.lineTo(q[0] + nx * 10, q[1] + ny * 10); ctx.stroke(); }
  // muralla en la cresta (en construcción) con torre
  const wp = []; for (let x = 700; x <= 1500; x += 14) wp.push([x, crestY(x)]); P.wallPath(ctx, wp, t, { style: 'ladrillo', h: 58, build: o.build ?? 1, towers: [0.4], towerS: 140, pavilion: [] });
  // pila de materiales en el valle
  ctx.fillStyle = 'rgba(25,30,22,0.35)'; ctx.beginPath(); ctx.ellipse(160, 1622, 150, 14, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#a45c42'; for (let r = 0; r < 3; r++) for (let i = 0; i < 6 - r; i++) ctx.fillRect(40 + i * 26 + r * 13, 1608 - r * 14, 24, 12); for (let i = 0; i < 5; i++) P.granite(ctx, [[200 + i * 24, 1620], [204 + i * 24, 1600], [222 + i * 24, 1598], [226 + i * 24, 1620]], { seed: 40 + i, c1: '#9aa098', c2: '#646b65' });
  if (o.after) o.after(ctx);
  ctx.restore();
 }
 const walkOnPath = (ctx, s, h, kind, v, load) => { const q = PA.at(s), dir = Math.cos(q[2]) >= 0 ? 1 : -1; if (kind === 'animal') P.packAnimal(ctx, q[0], q[1] + 6, h, s / (h * 0.9), { load, dir }); else P.porter(ctx, q[0], q[1] + 6, h, s / (h * 0.85), { load, var: v, dir }); };
 // 12 · ¿CÓMO SUBÍAN LOS MATERIALES?: de la pila del valle a la cresta, siguiendo el sendero; el desnivel se mide
 B.push({ t0: TB.transp, t1: TB.medios, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const pr = sm(T.toneladas, T.dificiles + 0.5, t), cq = PA.at(PA.L * pr);
  const cam = P.camAt([[TB.transp, 260, 1560, 1.7], [T.toneladas, 380, 1500, 1.5], [T.dificiles, cq[0], cq[1] + 60, 1.25], [TB.medios, 560, 1200, 0.78]], t);
  slopeScene(ctx, t, cam, { build: 0.7, after: (c) => { if (pr > 0) { const sub = []; for (let s = 0; s <= PA.L * pr; s += 8) { const q = PA.at(s); sub.push([q[0], q[1]]); } c.save(); c.setLineDash([18, 12]); c.lineDashOffset = -t * 40; P.strokePath(c, sub, 8, C.oro); c.restore(); c.fillStyle = C.oro; c.beginPath(); c.arc(cq[0], cq[1], 14, 0, TAU); c.fill(); } } });
  const a = sm(TB.medios - 1.0, TB.medios - 0.5, t); if (a > 0) { const p0 = camPt(cam, [140, 1626]), p1 = camPt(cam, [760, 790]); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.blanco; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1000, p0[1]); ctx.lineTo(1000, p1[1]); ctx.stroke(); for (const y of [p0[1], p1[1]]) { ctx.beginPath(); ctx.moveTo(970, y); ctx.lineTo(1030, y); ctx.stroke(); } ctx.restore(); mapLabel(ctx, 'GRAN DESNIVEL', 880, (p0[1] + p1[1]) / 2, 32, C.blanco, a); }
  pill(ctx, '¿CÓMO SUBÍAN LOS MATERIALES?', 540, 270, 48, t, T.transportaban - 0.1, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.transp, TB.medios - TB.transp, 1); k.play('riser', T.toneladas, { dur: 1.8, gain: 0.25 }); FX.aparece(k, T.transportaban - 0.1); FX.flecha(k, T.toneladas, 1.4); } });

 // 13 · CARROS, ANIMALES Y TRABAJO HUMANO: carros solo en el camino llano, animales en el sendero suave, personas en lo empinado
 B.push({ t0: TB.medios, t1: TB.pend, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const cam = P.camAt([[TB.medios, 220, 1520, 1.45], [T.animales, 470, 1450, 1.35], [T.cantidades, 560, 1180, 1.2], [TB.pend, 600, 1060, 1.12]], t);
  slopeScene(ctx, t, cam, { build: 0.75, after: (c) => {
   const cx = -260 + 60 * (t - TB.medios); P.oxcart(c, cx, 1650, 280, t, { load: 'ladrillos', phase: cx / (TAU * 0.13 * 280) });
   for (let i = 0; i < 2; i++) { const s = 30 + 28 * (t - TB.medios) + i * 120; walkOnPath(c, s, 120, 'animal', 0, i ? 'piedra' : 'ladrillos'); }
   for (let i = 0; i < 4; i++) { const s = PA.L * 0.52 + 30 * (t - TB.medios) + i * 150; if (s < PA.L - 10) walkOnPath(c, s, 120, 'p', i, i % 2 ? 'ladrillos' : 'piedra'); } } });
  [['CARROS', T.carros, 200, 'camino llano'], ['ANIMALES', T.animales, 540, 'sendero suave'], ['PERSONAS', T.trabajo18 - 0.4, 880, 'tramos empinados']].forEach(([s, t0, x, sub]) => { const a = sm(t0 - 0.15, t0 + 0.15, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x - 160, 345, 320, 120, 30, 'rgba(17,26,28,0.85)'); txt(ctx, s, x, 385, 36, C.oro); txt(ctx, sub, x, 432, 28, C.blanco, { w: 700 }); ctx.restore(); });
  pill(ctx, 'TRANSPORTE MANUAL Y ANIMAL', 540, 250, 48, t, T.utilizaban18, C.blanco, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.ruedas(k, T.carros - 0.3, 2.4, 1); FX.cascos(k, T.animales - 0.1, 8, 0.32, 1); FX.pasosTierra(k, T.cantidades, 8, 0.38, 0.9); FX.etiqueta(k, T.carros); FX.etiqueta(k, T.animales); FX.etiqueta(k, T.trabajo18 - 0.4); } });

 // 14 · PENDIENTES EXTREMAS: escalones; cargas manejables; la cámara sube y revela el muro en construcción en la cresta
 B.push({ t0: TB.pend, t1: TB.torres, in: { type: 'rise', d: 0.45 }, draw(ctx, t) {
  const cam = P.camAt([[TB.pend, 560, 1060, 2.0], [T.empinadas + 0.5, 620, 960, 1.7], [T.manualmente, 760, 860, 1.3], [TB.torres, 800, 840, 1.1]], t);
  slopeScene(ctx, t, cam, { build: 0.62 + 0.1 * win(t, TB.pend, TB.torres), after: (c) => {
   for (let i = 0; i < 6; i++) { const s = PA.L * 0.6 + 26 * (t - TB.pend) + i * 95; if (s < PA.L - 8) walkOnPath(c, s, 112, 'p', i, ['piedra', 'ladrillos', 'tierra'][i % 3]); }
   const bx = 700 + 800 * (0.62 + 0.1 * win(t, TB.pend, TB.torres)) * 0.98; P.figure(c, bx - 30, crestY(bx - 30) + 2, 110, 0, { pose: 'chisel', var: 3, target: [bx - 6, crestY(bx) - 40] }); P.figure(c, bx - 120, crestY(bx - 120) + 2, 110, 0, { pose: 'look', var: 1 }); } });
  pill(ctx, 'A MANO POR LAS PENDIENTES', 540, 270, 48, t, T.empinadas - 0.2, C.oro, C.fondo);
  tag(ctx, 'cargas que una persona podía llevar, en muchos viajes', 540, 380, 32, sm(T.manualmente - 0.3, T.manualmente + 0.1, t));
  scrim(ctx);
 }, sfx(k) { FX.pasosTierra(k, TB.pend + 0.2, 10, 0.5, 1); FX.viento(k, TB.pend, TB.torres - TB.pend, 1.1); FX.aparece(k, T.empinadas - 0.2); FX.golpePiedra(k, T.manualmente + 0.3); } });

 // 15 · TORRES Y VIGILANCIA: observar → detectar → señal de humo → transmisión de torre en torre con línea de visión despejada
 B.push({ t0: TB.torres, t1: TB.gener, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = P.camAt([[TB.torres, 380, 1040, 1.8], [T.torres, 470, 980, 1.55], [T.observar, 620, 900, 0.95], [TB.gener, 660, 880, 0.82]], t);
  const s1 = sm(T.comunicar - 0.3, T.comunicar + 0.3, t), s2 = sm(T.comunicar + 0.35, T.comunicar + 0.8, t), s3 = sm(T.amenazas - 0.1, T.amenazas + 0.35, t), det = sm(T.territorio - 0.2, T.territorio + 0.3, t);
  // tres torres en cumbres sucesivas, integradas en la muralla (mismo sistema que el resto del video)
  const sig = [nearT(420), nearT(780), nearT(1140)], smk = [s1, s2, s3]; let tops = [], thr = null;
  ridgeShot(ctx, t, { cam, sun: [880, 380], fogA: 0.6, smokeOf: (x) => { const i = sig.indexOf(x); return i >= 0 ? smk[i] : 0; },
   after: (c, rg, ws) => { tops = sig.map((x) => { const T0 = ws.towers.find((q) => Math.abs(q.x - x) < 1); return T0 ? T0.roof : [x, rg.ridge(x) - 120]; });
    const r0 = ws.towers.find((q) => Math.abs(q.x - sig[0]) < 1); if (r0) P.figure(c, r0.roof[0] - 6, r0.roof[1] + 2, 40, 0, { pose: 'look', var: 2 });
    if (det > 0) { const dx = 1700, dy = rg.ridge(1700) + 260; c.save(); c.globalAlpha *= det; for (let i = 0; i < 9; i++) { const u = (t * 0.5 + i / 9) % 1; c.fillStyle = `rgba(200,176,136,${0.5 * (1 - u)})`; c.beginPath(); c.arc(dx - u * 160 + i * 6, dy - u * 40, 20 + u * 40, 0, TAU); c.fill(); } c.restore(); }
    // comprobación de línea de visión: el terreno entre torres debe quedar por debajo de la línea
    c.__los = [0, 1].map((i) => { const A2 = tops[i], B2 = tops[i + 1]; for (let x = A2[0] + 20; x < B2[0] - 20; x += 10) { const yl = lerp(A2[1], B2[1], (x - A2[0]) / (B2[0] - A2[0])); if (rg.ridge(x) < yl + 10) return false; } return true; }); } });
  const T1 = tops.map((p) => camPt(cam, p));
  // líneas de visión (de cima a cima, por encima del terreno)
  const los = (a, b, al) => { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = C.oro; ctx.lineWidth = 5; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 50; ctx.beginPath(); ctx.moveTo(a[0], a[1] - 20); ctx.lineTo(b[0], b[1] - 20); ctx.stroke(); ctx.restore(); };
  if (T1.length === 3) { const ok = ctx.__los || [true, true]; if (ok[0]) los(T1[0], T1[1], s2); if (ok[1]) los(T1[1], T1[2], s3); const ob = sm(T.observar - 0.2, T.observar + 0.2, t) * (1 - sm(T.comunicar, T.comunicar + 0.3, t)); if (ob > 0) { ctx.save(); ctx.globalAlpha *= ob * 0.35; ctx.fillStyle = C.oro; ctx.beginPath(); ctx.moveTo(T1[0][0], T1[0][1] - 10); ctx.lineTo(W + 100, T1[0][1] - 200); ctx.lineTo(W + 100, T1[0][1] + 260); ctx.closePath(); ctx.fill(); ctx.restore(); } }
  const steps = [['1 OBSERVAR', T.observar], ['2 DETECTAR', T.territorio], ['3 SEÑAL', T.comunicar], ['4 TRANSMITIR', T.comunicar + 0.5]];
  steps.forEach(([s, t0], i) => { const a = sm(t0 - 0.15, t0 + 0.15, t); if (a <= 0) return; const x = 140 + i * 267; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x - 125, 360, 250, 72, 36, i === 3 ? C.oro : 'rgba(17,26,28,0.88)'); txt(ctx, s, x, 397, 30, i === 3 ? C.fondo : C.blanco); ctx.restore(); });
  pill(ctx, 'OTRO DESAFÍO', 540, 250, 54, t, T.desafio - 0.2, C.blanco, C.fondo, T.construir21);
  pill(ctx, 'VIGILANCIA Y COMUNICACIÓN', 540, 250, 48, t, T.construir21 + 0.2, C.oro, C.fondo);
  tag(ctx, 'humo de día, fuego de noche: de torre en torre, siempre a la vista', 540, 1340, 30, sm(T.comunicar + 0.4, T.comunicar + 0.8, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.torres, TB.gener - TB.torres, 1.2); FX.aparece(k, T.desafio - 0.2); FX.etiqueta(k, T.observar); FX.etiqueta(k, T.territorio); k.play('whoosh', T.observar - 0.3, { dur: 1.2, top: 1100, gain: 0.3 }); FX.hoguera(k, T.comunicar - 0.2, 2.6, 1); FX.etiqueta(k, T.comunicar + 0.5); } });

 // 16 · GENERACIONES: la misma ladera a lo largo de las épocas; cada época construye a su manera sobre (o junto a) lo anterior
 B.push({ t0: TB.gener, t1: TB.mapa2, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  const u = win(t, TB.gener, TB.mapa2), cam = [520 + 120 * u, 950, 0.8 + 0.06 * u];
  const eras = [{ a: 0, b: 0.34, style: 'tierra', label: 'MUROS DE TIERRA · s. VII–III a. C.', tw: [0.4, 0.52, 0.64] }, { a: 0.34, b: 0.62, style: 'piedra', label: 'PIEDRA Y TIERRA · varias dinastías', tw: [0.37, 0.47, 0.57, 0.67] }, { a: 0.62, b: 1, style: 'ladrillo', label: 'MING · LADRILLO Y PIEDRA · 1368–1644', tw: [0.33, 0.405, 0.48, 0.555, 0.63, 0.705] }];
  let k = 0; eras.forEach((e, i) => { if (u >= e.a) k = i; }); const e = eras[k], pe = eras[k - 1], bu = sm(0, 0.75, (u - e.a) / (e.b - e.a));
  const autumn = k === 1 ? sm(0.4, 0.6, (u - e.a) / (e.b - e.a)) : 0, snow = k === 2 ? sm(0.6, 0.9, (u - e.a) / (e.b - e.a)) * 0.8 : 0;
  ridgeShot(ctx, t, { cam, style: e.style, build: k === 0 ? 0.25 + 0.75 * bu : bu, prev: pe ? { style: pe.style, ruin: 0.6, towers: true } : null, ruin: 0, nearC: autumn > 0.5 ? '#6b5a35' : undefined, snow, pavilionX: k === 2 ? [nearT(700)] : [] });
  mapLabel(ctx, e.label, 540, 400, 34, C.oro, 1);
  pill(ctx, 'SIGLOS DE CONSTRUCCIÓN', 540, 280, 50, t, T.siglos22 - 0.2, C.oro, C.fondo);
  tag(ctx, 'se ampliaban tramos, otros quedaban en ruinas y algunos se reparaban', 540, 1340, 30, sm(T.ampliando, T.ampliando + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.tiempo(k, TB.gener + 0.1, 2.0, 0.8); FX.viento(k, TB.gener, TB.mapa2 - TB.gener, 0.8); const d = TB.mapa2 - TB.gener; FX.tiempo(k, TB.gener + d * 0.34, 1.2, 0.6); FX.tiempo(k, TB.gener + d * 0.62, 1.2, 0.6); FX.ladrillo(k, TB.gener + d * 0.7, 3, 0.4, 0.6); } });

 // 17 · NO EXISTE UNA ÚNICA MURALLA CONTINUA: vista general con todos los periodos; tramos separados y conectados resaltados
 B.push({ t0: TB.mapa2, t1: TB.final, in: { type: 'zoom', d: 0.5, x: 540, y: 760 }, draw(ctx, t) {
  const cam = P.camAt([[TB.mapa2, ...camCN(107, 39.0, 1.32)], [TB.final, ...camCN(107, 39.0, 1.22)]], t);
  const order = ['estados', 'qin', 'han', 'ming'], hiIdx = Math.floor(cl(win(t, T.unica - 0.3, T.emperador + 0.5)) * 3.999), hi = t > T.unica - 0.3 ? order[hiIdx] : null;
  chinaShot(ctx, t, { cam, periods: { estados: 1, qin: 1, han: 1, ming: 1 }, legend: 1, ends: 1, names: 0, hi });
  const ca = sm(T.continua - 0.2, T.continua + 0.3, t); if (ca > 0) { const a1 = camPt(cam, projCN([113.0, 42.3])), a2 = camPt(cam, projCN([107.6, 39.3])); ctx.save(); ctx.globalAlpha *= ca; ctx.strokeStyle = C.oro; ctx.lineWidth = 5; for (const p of [a1, a2]) { ctx.beginPath(); ctx.arc(p[0], p[1], 44, 0, TAU); ctx.stroke(); } ctx.restore(); mapLabel(ctx, 'tramos separados', a1[0], a1[1] - 70, 30, C.oro, ca); }
  pill(ctx, 'NO FUE UNA SOLA MURALLA', 540, 200, 50, t, T.sorprendente23 - 0.1, C.oro, C.fondo);
  tag(ctx, 'ni obra de un solo emperador', 540, 300, 32, sm(T.emperador - 0.3, T.emperador + 0.1, t));
  scrim(ctx);
 }, sfx(k) { FX.mapa(k, TB.mapa2 + 0.1); MUS.golpe(k, T.unica, { gain: 0.8, chord: ['D3', 'A3', 'D4', 'F4'] }); FX.aparece(k, T.sorprendente23 - 0.1); FX.etiqueta(k, T.continua); FX.tachado(k, T.emperador); } });

 // 18-19 · FINAL: del detalle del ladrillo y la piedra al paisaje completo al atardecer; cierre limpio
 const finale = (ctx, t) => { const cam = P.camAt([[TB.final, 250, 990, 2.6], [T.resultado, 420, 940, 1.4], [T.historia24, 560, 870, 0.85], [DURATION, 600, 850, 0.68]], t);
  ridgeShot(ctx, t, { cam, sun: [260, 620], sky: ['#5d7f98', '#f0c99a'], pavilionX: [nearT(250), nearT(700), nearT(1200)], fogA: 0.9 }); P.glow(ctx, 260, 560, 900, '255,200,140', 0.16); };
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
