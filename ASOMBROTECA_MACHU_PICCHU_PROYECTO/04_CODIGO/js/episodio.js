// =====================================================================================================
// episodio.js — «¿Cómo construyeron Machu Picchu en lo alto de los Andes?» · Asombroteca · PLANTILLA v1.12
// Arco: ciudadela entre la niebla (≈ 2.430 m) → montañas, pendientes y lluvia (≈ 2.000 mm/año) → ¿sin máquinas?
// → presente → reconstrucción del siglo XV → ingeniería bajo la piedra → el terreno → agua + pendiente = riesgo →
// terrazas → por dentro: suelo, arena, grava y piedras → drenaje → cantera de granito → percusión y abrasión →
// materiales locales → piedras que encajan (solo algunos muros) → sin mortero (otros muros sí llevan barro) →
// manantial → canal (≈ 749 m, ≈ 3 %) → 16 fuentes por gravedad → tres sistemas integrados → cinco siglos después
// (con conservación) → ingeniería adaptada a la naturaleza → Asombroteca.
// Datos verificados en FUENTES_Y_DECISIONES.md. Reloj = voz original. Determinista.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const C = { montana: '#34483F', veg: '#587348', vegL: '#87A46B', piedra: '#858D86', piedraL: '#C3C8BD', tierra: '#795C43', grava: '#A6A79B', arena: '#C7B18A', agua: '#37B9D9', aguaL: '#7AE6F2', cielo: '#91B9D0', niebla: '#DCE4DD', dorado: '#D4AC64', oro: '#FFD447', fondo: '#111A19', blanco: '#F4F7F3', rojo: '#d9534f' };
 const T = {
  anos0: wt(0, '500'), incas0: wt(0, 'incas'), ciudad0: wt(0, 'ciudad'), piedra0: wt(0, 'piedra'), m2400: wt(0, '2.400'), metros0: wt(0, 'metros'), mar: wt(0, 'mar'),
  y1: SG(1).s, montanas: wt(1, 'montañas'), pendientes: wt(1, 'pendientes'), lluvias: wt(1, 'lluvias'), intensas: wt(1, 'intensas'),
  pero2: SG(2).s, como2: wt(2, 'cómo'), machu2: wt(2, 'machu'), sin2: wt(2, 'sin'), excavadoras: wt(2, 'excavadoras'), gruas: wt(2, 'grúas'), maquinaria: wt(2, 'maquinaria'), moderna: wt(2, 'moderna'),
  la3: SG(3).s, ingenieria3: wt(3, 'ingeniería'), avanzada: wt(3, 'avanzada'), imaginas: wt(3, 'imaginas'),
  primero: SG(4).s, problema: wt(4, 'problema'), gigantesco: wt(4, 'gigantesco'), terreno5: wt(5, 'terreno'),
  construir6: SG(6).s, montana6: wt(6, 'montaña'), deslizamientos: wt(6, 'deslizamientos'), acumulaciones: wt(6, 'acumulaciones'), agua6: wt(6, 'agua'),
  por7: SG(7).s, prepararon: wt(7, 'prepararon'), levantaron: wt(7, 'levantaron'), terrazas7: wt(7, 'terrazas'), escalonadas: wt(7, 'escalonadas'),
  pero8: SG(8).s, simples: wt(8, 'simples'), escalones: wt(8, 'escalones'),
  en9: SG(9).s, interior: wt(9, 'interior'), capas: wt(9, 'capas'), materiales9: wt(9, 'materiales'), drenar: wt(9, 'drenar'), estabilizar: wt(9, 'estabilizar'), suelo: wt(9, 'suelo'),
  asi10: SG(10).s, lluvias10: wt(10, 'lluvias'), destruyeran: wt(10, 'destruyeran'), construcciones10: wt(10, 'construcciones'),
  despues: SG(11).s, desafio: wt(11, 'desafío'), trabajar: SG(12).s, transportar: wt(12, 'transportar'), bloques12: wt(12, 'bloques'),
  los13: SG(13).s, herramientas: wt(13, 'herramientas'), trabajo13: wt(13, 'trabajo'), percusion: wt(13, 'percusión'), abrasion: wt(13, 'abrasión'), forma: wt(13, 'forma'),
  muchos: SG(14).s, canteras: wt(14, 'canteras'), cercanas: wt(14, 'cercanas'),
  y15: SG(15).s, sorprendente: wt(15, 'sorprendente'), en16: SG(16).s, algunas: wt(16, 'algunas'), piedras16: wt(16, 'piedras'), talladas: wt(16, 'talladas'), encajar: wt(16, 'encajar'), precision: wt(16, 'precisión'), extraordinaria: wt(16, 'extraordinaria'),
  sin17: SG(17).s, mortero: wt(17, 'mortero'), juntas: wt(17, 'juntas'),
  pero18: SG(18).s, fundamental: wt(18, 'fundamental'), agua19: wt(19, 'agua'),
  los20: SG(20).s, canales: wt(20, 'canales'), fuentes: wt(20, 'fuentes'), conducir: wt(20, 'conducir'), manantiales: wt(20, 'manantiales'), sectores: wt(20, 'sectores'), ciudad20: wt(20, 'ciudad'),
  asi21: SG(21).s, arquitectura: wt(21, 'arquitectura'), drenaje21: wt(21, 'drenaje'), abastecimiento: wt(21, 'abastecimiento'), entorno: wt(21, 'entorno'), exigente: wt(21, 'exigente'),
  y22: SG(22).s, increible: wt(22, 'increíble'), sobrevivido: wt(22, 'sobrevivido'), siglos: wt(22, 'siglos'),
  machu23: SG(23).s, montana23: wt(23, 'montaña'), fue24: SG(24).s, ingenieria24: wt(24, 'ingeniería'), adaptada: wt(24, 'adaptada'), naturaleza: wt(24, 'naturaleza'),
  sigue: SG(25).s, asombroteca: wt(25, 'asombroteca'), end: A.speech_end,
 };
 const TB = { terreno0: T.y1 - 0.2, como: T.pero2 - 0.15, oculta: T.la3 - 0.2, problema: T.primero - 0.2, riesgo: T.construir6 - 0.2, terrazas: T.por7 - 0.2, dentro: T.pero8 - 0.2, capas: T.en9 - 0.2, drena: T.asi10 - 0.2, piedra: T.despues - 0.2, tallado: T.los13 - 0.2, cantera: T.muchos - 0.2, encaje: T.y15 - 0.2, mortero: T.sin17 - 0.15, agua: T.pero18 - 0.2, canales: T.los20 - 0.2, sistemas: T.asi21 - 0.2, siglos: T.y22 - 0.2, final: T.machu23 - 0.2, cierre: T.sigue - 0.15 };

 // ---------------- utilidades ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, px, a, c = 'rgba(244,247,243,0.98)') => { if (a <= 0.01) return; px = Math.max(px, 32); ctx.save(); ctx.globalAlpha = a; ctx.font = `600 ${px}px "IBM Plex Mono"`; let L = [s];
  if (ctx.measureText(s).width + px * 1.2 > 1000) { const m = s.length / 2; let k = -1; for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (k < 0 || Math.abs(i - m) < Math.abs(k - m))) k = i; if (k > 0) L = [s.slice(0, k), s.slice(k + 1)]; }
  const lw = Math.max(...L.map((l) => ctx.measureText(l).width)); if (lw + px * 1.2 > 1020) { px *= 1000 / (lw + px * 1.2); ctx.font = `600 ${px}px "IBM Plex Mono"`; }
  const w = Math.max(...L.map((l) => ctx.measureText(l).width)) + px * 1.2, lh = px * 1.25, h = px * 0.45 + lh * L.length, x0 = Math.min(Math.max(x - w / 2, 30), 1050 - w);
  P.rr(ctx, x0, y - h / 2, w, h, px * 0.6, 'rgba(17,26,25,0.78)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; L.forEach((l, i) => ctx.fillText(l, x0 + w / 2, y + 1 + (i - (L.length - 1) / 2) * lh)); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 8; ctx.fillText(s, x, y); ctx.restore(); };
 const callout = (ctx, x0, y0, x1, y1, s, a, c = C.blanco, al = 'left') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 7, 0, TAU); ctx.fill(); ctx.restore(); ctx.save(); ctx.globalAlpha = a; txt(ctx, s, x1 + (al === 'left' ? 10 : -10), y1, 34, c, { al }); ctx.restore(); };
 const scrim = (ctx) => { const g = ctx.createLinearGradient(0, 1400, 0, 1760); g.addColorStop(0, 'rgba(17,26,25,0)'); g.addColorStop(0.5, 'rgba(17,26,25,0.65)'); g.addColorStop(1, 'rgba(17,26,25,0.65)'); ctx.fillStyle = g; ctx.fillRect(0, 1400, W, 520); };
 const worker = (ctx, x, y, h, ph, pose = 'walk') => P.worker(ctx, x, y, h, ph, { pose, c: '#6b4428', cloth: '#b5452b' });
 // paisaje + ciudadela (vista aérea) compartidos por gancho, sistemas, siglos y final
 function aerial(ctx, t, o = {}) {
  P.andes(ctx, t, { sun: o.sun || [820, 330], peaks: [760, 260, 900], sky: o.sky });
  P.fog(ctx, 760, 300, t, { a: 0.55 * (o.fogA ?? 1), seed: 1 });
  const g = P.citadel(ctx, o.cx ?? 470, o.cy ?? 980, o.s ?? 470, t, { age: o.age ?? 1, canal: o.canal ?? 0, glow: o.glow || {}, fogA: o.fogA });
  if (o.onCity) o.onCity(g);
  P.fog(ctx, 1150, 360, t * 1.3, { a: 0.65 * (o.fogA ?? 1), seed: 3, speed: 24 });
  return g;
 }
 // iconos de maquinaria moderna (para tachar)
 const crane = (ctx, x, y, s) => { ctx.save(); ctx.strokeStyle = '#f0b90b'; ctx.lineWidth = s * 0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - s * 0.2, y + s * 0.5); ctx.lineTo(x - s * 0.2, y - s * 0.5); ctx.lineTo(x + s * 0.55, y - s * 0.5); ctx.moveTo(x + s * 0.4, y - s * 0.5); ctx.lineTo(x + s * 0.4, y - s * 0.1); ctx.stroke(); ctx.restore(); };
 const excav = (ctx, x, y, s) => { ctx.save(); ctx.fillStyle = '#f0b90b'; ctx.fillRect(x - s * 0.45, y - s * 0.05, s * 0.55, s * 0.3); ctx.fillStyle = '#333'; ctx.fillRect(x - s * 0.5, y + s * 0.25, s * 0.65, s * 0.15); ctx.strokeStyle = '#f0b90b'; ctx.lineWidth = s * 0.08; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + s * 0.05, y); ctx.lineTo(x + s * 0.3, y - s * 0.35); ctx.lineTo(x + s * 0.5, y + s * 0.15); ctx.stroke(); ctx.restore(); };
 const gear = (ctx, x, y, s, a) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#9aa7b6'; for (let i = 0; i < 8; i++) { ctx.rotate(TAU / 8); ctx.fillRect(-s * 0.08, -s * 0.48, s * 0.16, s * 0.15); } ctx.beginPath(); ctx.arc(0, 0, s * 0.36, 0, TAU); ctx.fill(); ctx.restore(); };
 // terrazas grandes en corte (escenas de construcción, interior y drenaje)
 const TER = { x0: -60, y0: 1460, sw: 300, sh: 200, n: 4 };

 // ================= BEATS =================
 const B = [];
 // 1 · gancho: la ciudadela emerge de la niebla · +500 años · ≈ 2.430 m
 B.push({ t0: 0, t1: TB.terreno0, draw(ctx, t) {
  const cam = P.camAt([[0, 470, 1000, 2.2], [3.2, 470, 960, 1.35], [T.mar, 520, 900, 1.0], [TB.terreno0, 520, 880, 1.0]], t);
  ctx.save(); P.camApply(ctx, cam); aerial(ctx, t, { fogA: 1 + 0.8 * (1 - sm(0, 2.5, t)) }); ctx.restore();
  const fa = 1 - sm(0, 2.2, t); if (fa > 0) { ctx.fillStyle = `rgba(220,228,221,${0.9 * fa})`; ctx.fillRect(0, 0, W, HH); }
  P.counter(ctx, 540, 330, 76, t, T.anos0 - 0.1, T.anos0 + 0.5, 0, 500, { box: C.oro, c: C.fondo, prefix: '+ ', suffix: ' años' });
  const ha = sm(T.m2400 - 0.2, T.m2400 + 0.3, t); if (ha > 0) { ctx.save(); ctx.globalAlpha = ha; ctx.strokeStyle = C.blanco; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(990, 1330); ctx.lineTo(990, 760); ctx.stroke(); for (const y of [1330, 760]) { ctx.beginPath(); ctx.moveTo(970, y); ctx.lineTo(1010, y); ctx.stroke(); } ctx.restore(); P.counter(ctx, 780, 690, 62, t, T.m2400, T.metros0 + 0.4, 0, 2430, { box: C.blanco, c: C.fondo, prefix: '≈ ', suffix: ' m', fmt: (v) => v.toLocaleString('es-CO') }); tag(ctx, 'sobre el nivel del mar', 780, 770, 24, ha); }
  pill(ctx, '¡UNA CIUDAD A 2.400 METROS!', 540, 440, 40, t, T.mar - 0.3, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, 0, TB.terreno0 + 0.5, 1); k.play('riser', 0.1, { dur: 2.2, gain: 0.3 }); k.play('whoosh', 1.2, { dur: 2.2, top: 900, gain: 0.35 }); FX.contador(k, T.anos0 - 0.1, T.anos0 + 0.5, 0, 25); FX.contador(k, T.m2400, T.metros0 + 0.4, 0, 30); FX.sello(k, T.mar - 0.3); } });
 // 2 · montañas, pendientes y lluvias intensas: el agua corre por la ladera
 B.push({ t0: TB.terreno0, t1: TB.como, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  P.andes(ctx, t, { sky: ['#4f6f85', '#a9bfc8'], peaks: [300, 800, 520], layers: [['#8aa1a8', 560, 300, 0.003], ['#6b8a80', 760, 360, 0.0045], ['#4c6b56', 1000, 420, 0.006]] });
  const sl = [[-50, 1500], [400, 1150], [820, 760], [1150, 600]]; ctx.fillStyle = '#3d5446'; ctx.beginPath(); ctx.moveTo(-50, HH); sl.forEach((p) => ctx.lineTo(...p)); ctx.lineTo(1150, HH); ctx.closePath(); ctx.fill();
  const R = H.rng(4); for (let i = 0; i < 40; i++) { const x = R() * 1100, y = lerp(1500, 600, x / 1150) + 20 + R() * 300; ctx.fillStyle = 'rgba(120,128,120,0.6)'; ctx.beginPath(); ctx.ellipse(x, y, R.range(10, 30), R.range(6, 14), 0, 0, TAU); ctx.fill(); }
  P.fog(ctx, 640, 300, t, { a: 0.5, seed: 2 });
  const ra = sm(T.lluvias - 0.3, T.lluvias + 0.2, t); P.rainSheet(ctx, t, { a: ra, n: 260 });
  if (ra > 0) { ctx.save(); ctx.globalAlpha = ra; for (let k = 0; k < 5; k++) { const pts = [[1050 - k * 60, 640 + k * 30], [700 - k * 40, 960 + k * 30], [300 - k * 30, 1300 + k * 25]]; ctx.save(); ctx.setLineDash([16, 18]); ctx.lineDashOffset = -t * 160; P.strokePath(ctx, P.spline(pts), 5, 'rgba(122,230,242,0.8)'); ctx.restore(); } ctx.restore(); }
  pill(ctx, 'MONTAÑAS', 260, 330, 36, t, T.montanas, C.blanco, C.fondo);
  pill(ctx, 'PENDIENTES', 540, 410, 36, t, T.pendientes, C.blanco, C.fondo);
  pill(ctx, 'LLUVIA', 820, 330, 36, t, T.lluvias, C.agua, C.fondo);
  tag(ctx, 'casi 2.000 mm de lluvia al año', 540, 1365, 24, sm(T.intensas, T.intensas + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.terreno0, TB.como - TB.terreno0, 1); FX.etiqueta(k, T.montanas); FX.etiqueta(k, T.pendientes); FX.lluviaFuerte(k, T.lluvias - 0.3, TB.como - T.lluvias + 1, 1); k.play('thud', T.intensas, { f: 50, gain: 0.25 }); } });
 // 3 · ¿cómo sin excavadoras, grúas ni maquinaria? → del presente a la reconstrucción del siglo XV
 B.push({ t0: TB.como, t1: TB.oculta, in: { type: 'cut' }, draw(ctx, t) {
  const age = 1 - sm(T.maquinaria + 0.2, T.moderna + 0.9, t);
  ctx.save(); P.camApply(ctx, [520, 900, 1.15]); aerial(ctx, t, { age, cx: 470, cy: 980, onCity: (g) => { if (age >= 1) return; const R = H.rng(8); g.plats.filter((p) => p.kind !== 'agri').forEach((p) => { const n = p.kind === 'plaza' ? 4 : 1; for (let i = 0; i < n; i++) { const x = lerp(p.x0 + 12, p.x1 - 12, R()); ctx.save(); ctx.globalAlpha = 1 - age; worker(ctx, x, p.y - 4, 30, t * 0.5 + R(), R() < 0.5 ? 'walk' : 'pull'); ctx.restore(); } }); } }); ctx.restore();
  const ia = sm(T.sin2 - 0.1, T.sin2 + 0.2, t) * (1 - sm(T.moderna + 0.2, T.moderna + 0.6, t));
  if (ia > 0) { ctx.save(); ctx.globalAlpha = ia; [[270, excav, T.excavadoras], [540, crane, T.gruas], [810, (c, x, y, s) => gear(c, x, y, s, t), T.maquinaria]].forEach(([x, fn, tt]) => { P.circle(ctx, x, 560, 95, 'rgba(244,247,243,0.92)'); fn(ctx, x, 560, 120); if (t > tt) P.cross(ctx, x, 560, 150, E.out(win(t, tt, tt + 0.3)), C.rojo); }); ctx.restore(); }
  pill(ctx, '¿CÓMO LO HICIERON?', 540, 330, 50, t, T.como2, C.oro, C.fondo);
  tag(ctx, 'reconstrucción conceptual · siglo XV', 540, 1365, 24, sm(T.moderna + 0.3, T.moderna + 0.8, t));
  scrim(ctx);
 }, sfx(k) { FX.onomatopeya(k, T.como2); [T.excavadoras, T.gruas, T.maquinaria].forEach((x) => FX.tachado(k, x)); FX.tiempo(k, T.maquinaria + 0.2, 1.6, 1); FX.viento(k, TB.como, TB.oculta - TB.como, 0.6); } });
 // 4 · ingeniería bajo la piedra: el terreno se vuelve transparente y aparecen las capas
 B.push({ t0: TB.oculta, t1: TB.problema, in: { type: 'cut' }, draw(ctx, t) {
  const cut = sm(T.ingenieria3, T.avanzada + 0.3, t);
  P.andes(ctx, t, { sun: [820, 300], peaks: [760, 260, 900] });
  P.terraces(ctx, TER.x0, TER.y0, TER.sw, TER.sh, TER.n, t, { cut, build: 1 });
  if (cut < 1) { ctx.save(); ctx.globalAlpha = 1 - cut; ctx.fillStyle = '#587348'; ctx.beginPath(); ctx.moveTo(-20, HH); ctx.lineTo(-20, TER.y0 + 40); for (let i = 0; i <= TER.n; i++) { ctx.lineTo(TER.x0 + i * TER.sw, TER.y0 - i * TER.sh); ctx.lineTo(TER.x0 + (i + 1) * TER.sw, TER.y0 - (i + 1) * TER.sh); } ctx.lineTo(W + 20, HH); ctx.closePath(); ctx.fill(); ctx.restore(); }
  pill(ctx, 'INGENIERÍA BAJO LA PIEDRA', 540, 330, 42, t, T.ingenieria3, C.oro, C.fondo);
  tag(ctx, 'Wright: quizá 50–60 % del esfuerzo quedó bajo tierra', 540, 430, 22, sm(T.avanzada, T.avanzada + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.revelar(k, TB.oculta + 0.1); k.play('whoosh', T.ingenieria3, { dur: 1.2, top: 1400, gain: 0.35 }); FX.sello(k, T.ingenieria3 + 0.1); FX.campo(k, T.avanzada, 1.2, 0.7); } });
 // 5 · el problema: la ladera natural (sin terrazas), con zonas que hay que preparar
 const SLOPE = [[-40, 1450], [1120, 520]];
 const slopeY = (x) => lerp(SLOPE[0][1], SLOPE[1][1], (x - SLOPE[0][0]) / (SLOPE[1][0] - SLOPE[0][0]));
 B.push({ t0: TB.problema, t1: TB.riesgo, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  P.andes(ctx, t, { sun: [200, 330], peaks: [500, 820, 300] });
  ctx.fillStyle = '#4c6b56'; ctx.beginPath(); ctx.moveTo(-40, HH); ctx.lineTo(...SLOPE[0]); ctx.lineTo(...SLOPE[1]); ctx.lineTo(1120, HH); ctx.closePath(); ctx.fill();
  const R = H.rng(11); for (let i = 0; i < 30; i++) { const x = R() * 1100, y = slopeY(x) + 30 + R() * 400; P.granite(ctx, [[x - 30, y - 12], [x + 26, y - 16], [x + 34, y + 10], [x - 24, y + 14]], { seed: i, bevel: false }); }
  const za = sm(T.terreno5 - 0.2, T.terreno5 + 0.3, t); if (za > 0) [[300, 'pendiente fuerte'], [620, 'roca'], [880, 'suelo inestable']].forEach(([x, s], i) => { const y = slopeY(x) - 10; ctx.save(); ctx.globalAlpha = za; ctx.setLineDash([10, 8]); ctx.strokeStyle = C.oro; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y + 40, 110, 60, -0.68, 0, TAU); ctx.stroke(); ctx.restore(); tag(ctx, s, x, y - 90, 22, za * sm(T.terreno5 + i * 0.2, T.terreno5 + i * 0.2 + 0.3, t)); });
  pill(ctx, 'UN PROBLEMA GIGANTESCO', 540, 330, 42, t, T.problema, C.blanco, C.fondo, T.terreno5);
  pill(ctx, '¡EL TERRENO!', 540, 330, 54, t, T.terreno5, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.problema, TB.riesgo - TB.problema, 0.8); FX.etiqueta(k, T.problema); FX.sello(k, T.terreno5); FX.crujido(k, T.terreno5 + 0.4, 0.8, 70); } });
 // 6 · agua + pendiente = riesgo: infiltración, suelo saturado, pequeño deslizamiento conceptual y acumulación
 B.push({ t0: TB.riesgo, t1: TB.terrazas, in: { type: 'cut' }, draw(ctx, t) {
  P.andes(ctx, t, { sky: ['#4f6f85', '#a9bfc8'], peaks: [500, 820, 300] });
  ctx.fillStyle = '#4c6b56'; ctx.beginPath(); ctx.moveTo(-40, HH); ctx.lineTo(...SLOPE[0]); ctx.lineTo(...SLOPE[1]); ctx.lineTo(1120, HH); ctx.closePath(); ctx.fill();
  P.rainSheet(ctx, t, { a: 1, n: 240 });
  // zona saturada (más azul con el tiempo) bajo la superficie
  const sat = sm(T.construir6, T.deslizamientos + 0.5, t); ctx.save(); ctx.globalAlpha = 0.55 * sat; ctx.fillStyle = '#37b9d9'; ctx.beginPath(); ctx.moveTo(...SLOPE[0]); ctx.lineTo(...SLOPE[1]); ctx.lineTo(1120, 520 + 160); ctx.lineTo(-40, 1450 + 160); ctx.closePath(); ctx.fill(); ctx.restore();
  const R = H.rng(5); for (let i = 0; i < 40; i++) { const u = (t * 0.4 + R()) % 1, x = R() * 1100, y = slopeY(x) + u * 150; ctx.fillStyle = `rgba(122,230,242,${0.9 * (1 - u)})`; ctx.beginPath(); ctx.ellipse(x, y, 3, 5, 0, 0, TAU); ctx.fill(); }
  // pequeño deslizamiento localizado (conceptual)
  const sl = E.inOut(win(t, T.deslizamientos, T.deslizamientos + 1.2)); const bx = 700, by = slopeY(700); ctx.save(); ctx.translate(-sl * 120, sl * 90); ctx.fillStyle = '#6b5a44'; ctx.beginPath(); ctx.moveTo(bx - 80, by + 55); ctx.lineTo(bx + 90, slopeY(bx + 90)); ctx.lineTo(bx + 60, slopeY(bx + 60) + 60); ctx.closePath(); ctx.fill(); ctx.restore(); if (sl > 0) { ctx.save(); ctx.strokeStyle = C.rojo; ctx.lineWidth = 4; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(bx - 80, by + 55); ctx.lineTo(bx + 90, slopeY(bx + 90)); ctx.stroke(); ctx.restore(); }
  // acumulación de agua al pie
  const ac = sm(T.acumulaciones - 0.2, T.agua6 + 0.4, t); if (ac > 0) P.waterBody(ctx, [[-40, 1450 - 40 * ac], [260, 1450 - 40 * ac], [260, slopeY(260)], [-40, 1450]], t, { a: ac, top: 1400 });
  pill(ctx, 'DESLIZAMIENTOS', 540, 330, 42, t, T.deslizamientos, C.rojo, C.blanco, T.acumulaciones + 0.6);
  pill(ctx, 'AGUA + PENDIENTE = RIESGO', 540, 330, 42, t, T.acumulaciones + 0.6, C.oro, C.fondo);
  tag(ctx, 'ilustración conceptual de un riesgo, no de Machu Picchu', 540, 1365, 22, sm(T.deslizamientos, T.deslizamientos + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.lluviaFuerte(k, TB.riesgo, TB.terrazas - TB.riesgo, 1); FX.goteo(k, T.construir6, 8, 0.25); k.noise(T.deslizamientos, { dur: 1.4, color: 'brown', filter: 'lowpass', f: [[0, 600], [1.4, 150]], gain: 0.25, a: 0.05 }); FX.alarma(k, T.deslizamientos + 0.2, 2); FX.agua(k, T.acumulaciones, 1.5); FX.sello(k, T.acumulaciones + 0.6); } });
 // 7 · prepararon el terreno y levantaron terrazas escalonadas (construcción progresiva con trabajadores)
 B.push({ t0: TB.terrazas, t1: TB.dentro, in: { type: 'iris', d: 0.6, x: 540, y: 1000 }, draw(ctx, t) {
  P.andes(ctx, t, { sun: [200, 330], peaks: [500, 820, 300] });
  const b = E.inOut(win(t, T.prepararon - 0.2, T.escalonadas + 0.5)); const g = P.terraces(ctx, TER.x0, TER.y0, TER.sw, TER.sh, TER.n, t, { build: b, cut: 0 });
  if (b < 1) { ctx.fillStyle = '#4c6b56'; const xb = TER.x0 + b * TER.n * TER.sw; ctx.beginPath(); ctx.moveTo(xb, HH); ctx.lineTo(xb, TER.y0 - b * TER.n * TER.sh); ctx.lineTo(TER.x0 + TER.n * TER.sw + 200, TER.y0 - TER.n * TER.sh - 60); ctx.lineTo(W + 40, HH); ctx.closePath(); ctx.fill(); }
  g.tops.forEach(([x0, x1, y], i) => { if (i === g.tops.length - 1) for (let k = 0; k < 3; k++) worker(ctx, x0 + 50 + k * 60, y - 4, 70, t * 0.6 + k * 0.3, k === 1 ? 'chisel' : 'walk'); });
  pill(ctx, 'PREPARAR EL TERRENO', 540, 330, 40, t, T.prepararon, C.blanco, C.fondo, T.terrazas7);
  pill(ctx, 'TERRAZAS ESCALONADAS', 540, 330, 44, t, T.terrazas7, C.oro, C.fondo);
  tag(ctx, 'muros de contención + relleno', 540, 430, 24, sm(T.levantaron, T.levantaron + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.terrazas, TB.dentro - TB.terrazas, 0.6); FX.golpePiedra(k, T.prepararon, 6, 0.55, 0.7); k.noise(T.prepararon, { dur: 2.5, color: 'brown', filter: 'lowpass', f: 500, gain: 0.08, a: 0.3, hold: 1.8 }); FX.sello(k, T.terrazas7); } });
 // 8 · no eran simples escalones: el muro se vuelve transparente · 9 · capas y drenaje · 10 · el agua sale
 const LAB = [['SUELO CULTIVABLE', 0.08, C.vegL], ['ARENA', 0.23, C.arena], ['GRAVA', 0.43, C.grava], ['PIEDRAS', 0.78, C.piedraL]];
 const terraceScene = (ctx, t, o) => {
  P.andes(ctx, t, { sky: o.rain ? ['#4f6f85', '#a9bfc8'] : undefined, sun: o.rain ? null : [200, 330], peaks: [500, 820, 300] });
  const cam = o.cam || [540, 960, 1]; ctx.save(); P.camApply(ctx, cam); P.terraces(ctx, TER.x0, TER.y0, TER.sw, TER.sh, TER.n, t, { cut: o.cut, water: o.water || 0 }); ctx.restore();
  if (o.rain) P.rainSheet(ctx, t, { a: o.rain, n: 220 });
 };
 B.push({ t0: TB.dentro, t1: TB.capas, in: { type: 'zoom', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  const cut = sm(T.simples, T.escalones + 0.6, t);
  P.andes(ctx, t, { sun: [200, 330], peaks: [500, 820, 300] }); P.terraceCut(ctx, 80, 560, 900, 760, t, { reveal: 1 });
  if (cut < 1) { ctx.save(); ctx.globalAlpha = 1 - cut; ctx.beginPath(); ctx.rect(60, 540, 960, 900); ctx.clip(); P.stoneWall(ctx, 40, 540, 1000, 900, { style: 'rustica', seed: 15, rows: 16 }); ctx.restore(); }
  if (cut > 0 && cut < 1) { ctx.save(); ctx.strokeStyle = `rgba(255,212,71,${1 - cut})`; ctx.lineWidth = 6; ctx.strokeRect(60, 540, 960, 900); ctx.restore(); }
  pill(ctx, 'NO ERAN SIMPLES ESCALONES', 540, 330, 40, t, T.pero8 + 0.1, C.blanco, C.fondo, T.escalones + 0.3);
  pill(ctx, '¿QUÉ HABÍA DENTRO?', 540, 330, 48, t, T.escalones + 0.3, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.etiqueta(k, T.pero8 + 0.1); k.play('whoosh', T.simples, { dur: 1, top: 1600, gain: 0.3 }); FX.revelar(k, T.escalones); FX.onomatopeya(k, T.escalones + 0.3); } });
 B.push({ t0: TB.capas, t1: TB.drena, in: { type: 'cut' }, draw(ctx, t) {
  P.andes(ctx, t, { sun: [200, 330], peaks: [500, 820, 300] });
  P.terraceCut(ctx, 80, 560, 900, 760, t, { reveal: sm(T.interior - 0.4, T.capas + 1.2, t), labels: sm(T.capas - 0.2, T.materiales9 + 0.6, t), water: sm(T.drenar - 0.3, T.drenar + 0.3, t) });
  pill(ctx, 'CAPAS POR DENTRO', 540, 330, 42, t, T.interior, C.blanco, C.fondo, T.drenar);
  pill(ctx, 'DRENAJE INTERNO', 540, 330, 48, t, T.drenar, C.agua, C.fondo);
  tag(ctx, 'de grueso (abajo) a fino (arriba): el agua baja y sale', 540, 1365, 26, sm(T.estabilizar, T.estabilizar + 0.4, t));
  tag(ctx, 'reconstrucción típica: no todas las terrazas eran iguales', 540, 470, 24, sm(T.capas, T.capas + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.revelar(k, TB.capas + 0.1); LAB.forEach((_, k2) => FX.etiqueta(k, T.capas + k2 * 0.35)); FX.goteo(k, T.drenar, 8, 0.2); FX.sello(k, T.drenar); FX.arroyo(k, T.drenar + 0.5, TB.drena - T.drenar, 0.6); } });
 B.push({ t0: TB.drena, t1: TB.piedra, in: { type: 'cut' }, draw(ctx, t) {
  const ra = sm(T.lluvias10 - 0.3, T.lluvias10 + 0.3, t); P.andes(ctx, t, { sky: ['#4f6f85', '#a9bfc8'], peaks: [500, 820, 300] });
  P.terraceCut(ctx, 80, 560, 900, 760, t, { water: 1, labels: 1 - sm(TB.drena, TB.drena + 0.6, t) }); P.rainSheet(ctx, t, { a: ra, n: 220, h: 560 });
  callout(ctx, 150, 1225, 330, 1400, 'EL AGUA SALE AL PIE DEL MURO', sm(TB.drena + 0.4, TB.drena + 0.8, t), '#7AE6F2');
  pill(ctx, 'EL AGUA PUEDE DRENAR', 540, 330, 44, t, TB.drena + 0.2, C.agua, C.fondo);
  tag(ctx, 'reduce el riesgo; no lo elimina por completo', 540, 1365, 22, sm(T.construcciones10, T.construcciones10 + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.lluviaFuerte(k, T.lluvias10 - 0.3, TB.piedra - T.lluvias10 + 0.3, 0.9); FX.arroyo(k, TB.drena, TB.piedra - TB.drena, 1); FX.correcto(k, T.construcciones10); } });
 // 11 · el desafío de la piedra: cantera de granito en el propio sitio
 const quarry = (ctx, t, o = {}) => {
  P.andes(ctx, t, { sun: [880, 300], peaks: [300, 800, 600] });
  ctx.fillStyle = '#4c6b56'; ctx.fillRect(0, 1180, W, 800);
  const R = H.rng(31); for (let i = 0; i < 9; i++) { const x = 60 + i * 115, y = 1060 + (i % 3) * 40; P.granite(ctx, [[x, y], [x + 110, y - 30], [x + 130, y + 120], [x - 10, y + 140]], { seed: i + 5, c1: '#a8ada4', c2: '#6f766f' }); }
  ctx.strokeStyle = 'rgba(30,34,32,0.7)'; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(140 + i * 170, 1060); ctx.lineTo(160 + i * 170 + R.range(-20, 20), 1200); ctx.stroke(); }
 };
 B.push({ t0: TB.piedra, t1: TB.tallado, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  quarry(ctx, t);
  // bloque desprendido que tiran con cuerdas
  const p = E.inOut(win(t, T.transportar - 0.3, TB.tallado)); const bx = lerp(380, 560, p); P.granite(ctx, [[bx - 90, 1180], [bx + 90, 1170], [bx + 100, 1290], [bx - 95, 1300]], { seed: 77, c1: '#b4b9b0', c2: '#7a827b' });
  const hands = []; for (let k = 0; k < 5; k++) hands.push(worker(ctx, bx + 170 + k * 70, 1300, 120, t * 0.5 + k * 0.2, 'pull')); P.rope(ctx, [[bx + 100, 1230], ...hands], 4);
  for (let k = 0; k < 2; k++) worker(ctx, 150 + k * 90, 1300, 120, t * 0.5, 'chisel');
  pill(ctx, 'EL DESAFÍO DE LA PIEDRA', 540, 330, 42, t, T.desafio, C.oro, C.fondo);
  tag(ctx, 'granito de la propia montaña', 540, 430, 24, sm(T.bloques12, T.bloques12 + 0.4, t));
  tag(ctx, 'reconstrucción conceptual del trabajo', 540, 1365, 22, sm(T.trabajar, T.trabajar + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.piedra, TB.tallado - TB.piedra, 0.6); FX.sello(k, T.desafio); FX.golpePiedra(k, T.trabajar, 5, 0.5, 0.7); FX.arrastre(k, T.transportar - 0.3, TB.tallado - T.transportar + 0.3, 0.7, 600); FX.esfuerzo(k, T.transportar, 3, 0.9, 0.6); } });
 // 12 · percusión y abrasión: la forma del bloque cambia (de tosco a labrado)
 B.push({ t0: TB.tallado, t1: TB.cantera, in: { type: 'zoom', d: 0.6, x: 540, y: 1200 }, draw(ctx, t) {
  ctx.fillStyle = '#2a332f'; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 900, 700, '212,172,100', 0.18); ctx.fillStyle = '#3b3328'; ctx.fillRect(0, 1180, W, 800);
  const f = E.inOut(win(t, T.percusion - 0.6, T.forma + 0.3)); const rough = [[220, 760], [480, 700], [760, 740], [840, 960], [800, 1170], [520, 1200], [250, 1160], [180, 960]], dressed = [[240, 760], [520, 750], [800, 760], [810, 960], [800, 1170], [520, 1180], [240, 1170], [230, 960]];
  const pts = rough.map((p, i) => [lerp(p[0], dressed[i][0], f), lerp(p[1], dressed[i][1], f)]); P.granite(ctx, pts, { seed: 33 });
  // percusión: el percutor golpea en el borde superior derecho, saltan esquirlas
  const hit = ((t - T.herramientas) * 2.4) % 1, pa = sm(T.herramientas - 0.2, T.herramientas, t) * (1 - sm(T.abrasion, T.abrasion + 0.4, t));
  if (pa > 0) { const cx = pts[7][0], cy = pts[7][1] - 40, back = Math.sin(hit * Math.PI), hx = cx - 26 - back * 90, hy = cy - back * 40; ctx.save(); ctx.globalAlpha = pa; const hand = worker(ctx, hx - 90, 1180, 330, 0, 'chisel'); ctx.strokeStyle = '#6b4428'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hand[0], hand[1]); ctx.lineTo(hx - 20, hy + 6); ctx.stroke(); P.granite(ctx, [[hx - 36, hy - 30], [hx + 26, hy - 34], [hx + 34, hy + 22], [hx - 30, hy + 26]], { seed: 99, c1: '#9aa0a0', c2: '#5f6662' }); if (hit < 0.25) { const R = H.rng(Math.floor((t - T.herramientas) * 2.4)); for (let k = 0; k < 12; k++) { const a = Math.PI * R.range(0.6, 1.4), d = 20 + hit * 520 * R(); ctx.fillStyle = '#c3c8bd'; ctx.fillRect(cx + Math.cos(a) * d * 0.5, cy + Math.sin(a) * d * 0.5 + hit * 260, 7, 7); } } ctx.restore(); tag(ctx, 'percutor: piedra más dura', 540, 640, 24, pa); }
  // abrasión: frotar con arena y agua deja la superficie lisa
  const aa = sm(T.abrasion - 0.2, T.abrasion + 0.2, t); if (aa > 0) { const ax = 520 + Math.sin(t * 5) * 140; ctx.save(); ctx.globalAlpha = aa; P.granite(ctx, [[ax - 70, 960], [ax + 70, 955], [ax + 74, 1010], [ax - 66, 1015]], { seed: 55, c1: '#b6aa8a', c2: '#7d725c' }); ctx.fillStyle = 'rgba(199,177,138,0.6)'; for (let k = 0; k < 20; k++) ctx.fillRect(ax - 90 + k * 9, 1020 + (k % 3) * 4, 3, 3); ctx.restore(); tag(ctx, 'abrasión: arena + agua', 540, 1260, 24, aa); }
  pill(ctx, 'HERRAMIENTAS DE PIEDRA', 540, 330, 40, t, T.herramientas, C.blanco, C.fondo, T.percusion);
  pill(ctx, 'PERCUSIÓN Y ABRASIÓN', 540, 330, 46, t, T.percusion, C.oro, C.fondo);
  tag(ctx, 'el método exacto variaba según la piedra y el acabado', 540, 1365, 21, sm(T.forma, T.forma + 0.4, t));
 }, sfx(k) { FX.revelar(k, TB.tallado + 0.1); FX.golpePiedra(k, T.herramientas, 9, 1 / 2.4, 1); FX.sello(k, T.percusion); FX.abrasion(k, T.abrasion, TB.cantera - T.abrasion, 1); } });
 // 13 · canteras cercanas: la cantera junto a los recintos, transporte corto a mano
 B.push({ t0: TB.cantera, t1: TB.encaje, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  P.andes(ctx, t, { sun: [880, 300], peaks: [300, 800, 600] }); ctx.fillStyle = '#4c6b56'; ctx.fillRect(0, 1100, W, 900);
  for (let i = 0; i < 4; i++) P.granite(ctx, [[40 + i * 70, 980 - i * 20], [120 + i * 70, 960 - i * 20], [140 + i * 70, 1110], [30 + i * 70, 1120]], { seed: i + 40 }); tag(ctx, 'CANTERA', 180, 900, 24, 1);
  P.stoneWall(ctx, 700, 900, 320, 200, { style: 'sillar', seed: 7, rows: 4 }); ctx.fillStyle = '#9a7b45'; ctx.beginPath(); ctx.moveTo(680, 905); ctx.lineTo(860, 780); ctx.lineTo(1040, 905); ctx.closePath(); ctx.fill(); tag(ctx, 'RECINTOS', 860, 740, 24, 1);
  ctx.save(); ctx.setLineDash([12, 12]); ctx.strokeStyle = C.oro; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(330, 1130); ctx.quadraticCurveTo(500, 1180, 680, 1110); ctx.stroke(); ctx.restore(); tag(ctx, 'recorrido corto', 510, 1210, 22, sm(T.cercanas - 0.2, T.cercanas + 0.2, t));
  const p = ((t - TB.cantera) * 0.25) % 1, bx = lerp(340, 640, p); P.granite(ctx, [[bx - 50, 1100], [bx + 50, 1095], [bx + 55, 1160], [bx - 48, 1165]], { seed: 12 }); const hs = []; for (let k = 0; k < 3; k++) hs.push(worker(ctx, bx + 90 + k * 55, 1170, 95, t * 0.5 + k * 0.2, 'pull')); P.rope(ctx, [[bx + 55, 1130], ...hs], 3);
  pill(ctx, 'MATERIALES LOCALES', 540, 330, 46, t, T.canteras, C.oro, C.fondo);
  tag(ctx, 'no sabemos cómo se movió cada bloque', 540, 1365, 22, sm(T.cercanas, T.cercanas + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.cantera, TB.encaje - TB.cantera, 0.5); FX.sello(k, T.canteras); FX.arrastre(k, TB.cantera, TB.encaje - TB.cantera, 0.6, 600); } });
 // 14 · piedras que encajan: un bloque baja y ocupa su hueco exacto (muro poligonal) · 15 · sin mortero
 const WALL = { x: 140, y: 600, w: 800, h: 700, cols: 5, rows: 4, seed: 23, skip: 7 };
 B.push({ t0: TB.encaje, t1: TB.mortero, in: { type: 'iris', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  ctx.fillStyle = '#2a332f'; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 900, 700, '212,172,100', 0.15);
  const cells = P.stoneWall(ctx, WALL.x, WALL.y, WALL.w, WALL.h, { style: 'poligonal', cols: WALL.cols, rows: WALL.rows, seed: WALL.seed, skip: WALL.skip });
  const hole = cells[WALL.skip]; ctx.save(); ctx.fillStyle = '#1a1f1d'; ctx.beginPath(); hole.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); ctx.restore();
  const d = 1 - E.inOut(win(t, T.talladas, T.encajar + 0.4)); P.granite(ctx, hole.map(([x, y]) => [x, y - d * 520]), { seed: WALL.skip * 13 + 1, joint: 1.4 });
  const z = sm(T.precision - 0.2, T.extraordinaria + 0.6, t); if (z > 0) { const cx = hole[1][0], cy = hole[1][1]; ctx.save(); ctx.globalAlpha = z; P.lens(ctx, 820, 470, 150, 1, () => { ctx.save(); ctx.translate(820, 470); ctx.scale(4, 4); ctx.translate(-cx, -cy); P.stoneWall(ctx, WALL.x, WALL.y, WALL.w, WALL.h, { style: 'poligonal', cols: WALL.cols, rows: WALL.rows, seed: WALL.seed }); ctx.restore(); }); ctx.restore(); }
  pill(ctx, 'LO VERDADERAMENTE SORPRENDENTE', 540, 330, 36, t, T.y15 + 0.1, C.blanco, C.fondo, T.encajar);
  pill(ctx, 'PIEDRAS QUE ENCAJAN', 540, 330, 48, t, T.encajar, C.oro, C.fondo);
  tag(ctx, 'solo en algunos muros (templos y recintos importantes)', 540, 1365, 21, sm(T.algunas, T.algunas + 0.4, t));
 }, sfx(k) { FX.revelar(k, TB.encaje + 0.1); k.play('sparkle', T.sorprendente, { gain: 0.35, n: 6 }); k.play('whoosh', T.talladas, { dur: 1.2, top: 700, gain: 0.3 }); FX.encaje(k, T.encajar + 0.4); FX.sello(k, T.precision); } });
 B.push({ t0: TB.mortero, t1: TB.agua, in: { type: 'cut' }, draw(ctx, t) {
  ctx.fillStyle = '#2a332f'; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 900, 700, '212,172,100', 0.15);
  ctx.save(); ctx.beginPath(); ctx.rect(60, 450, 960, 520); ctx.clip(); ctx.translate(540, 710); ctx.scale(2.2, 2.2); ctx.translate(-540, -900); P.stoneWall(ctx, WALL.x, WALL.y, WALL.w, WALL.h, { style: 'poligonal', cols: WALL.cols, rows: WALL.rows, seed: WALL.seed }); ctx.restore(); ctx.strokeStyle = C.oro; ctx.lineWidth = 3; ctx.strokeRect(60, 450, 960, 520); txt(ctx, 'MAMPOSTERÍA FINA: piedra contra piedra', 540, 1015, 38, C.oro);
  const ra = sm(T.mortero, T.mortero + 0.4, t); if (ra > 0) { ctx.save(); ctx.globalAlpha = ra; P.stoneWall(ctx, 60, 1080, 960, 260, { style: 'rustica', seed: 4, rows: 5 }); ctx.strokeStyle = C.blanco; ctx.lineWidth = 3; ctx.strokeRect(60, 1080, 960, 260); ctx.restore(); txt(ctx, 'otros muros: piedra de campo con barro', 540, 1385, 36, C.blanco, { w: 700 }); }
  pill(ctx, 'SIN MORTERO', 540, 330, 54, t, T.sin17, C.oro, C.fondo);
 }, sfx(k) { FX.sello(k, T.sin17); k.play('paper', T.mortero, { dur: 0.6, gain: 0.3 }); FX.etiqueta(k, T.juntas); } });
 // 16 · el agua: una gota se une a un hilo de agua · 17 · manantial → canal → 16 fuentes por gravedad
 const CAN = [[1000, 420], [780, 520], [600, 640], [420, 760], [300, 840]];
 const FOUNT = (i) => [300 - i * 30, 920 + i * 92];
 B.push({ t0: TB.agua, t1: TB.canales, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  P.andes(ctx, t, { sun: [880, 300], peaks: [300, 800, 600] }); ctx.fillStyle = '#4c6b56'; ctx.beginPath(); ctx.moveTo(-20, HH); ctx.lineTo(-20, 900); ctx.lineTo(1100, 360); ctx.lineTo(1100, HH); ctx.closePath(); ctx.fill();
  const dp = E.in(win(t, T.pero18, T.agua19)); const dx = 960, dy = lerp(200, 420, dp); P.glow(ctx, dx, dy, 30, '122,230,242', 0.8); ctx.fillStyle = C.aguaL; ctx.beginPath(); ctx.moveTo(dx, dy - 18); ctx.quadraticCurveTo(dx + 14, dy + 4, dx, dy + 12); ctx.quadraticCurveTo(dx - 14, dy + 4, dx, dy - 18); ctx.fill();
  P.channel(ctx, CAN, t, { fill: sm(T.agua19, T.agua19 + 1, t) });
  pill(ctx, 'ALGO FUNDAMENTAL', 540, 330, 40, t, T.fundamental - 0.2, C.blanco, C.fondo, T.agua19);
  pill(ctx, '¡EL AGUA!', 540, 330, 56, t, T.agua19, C.agua, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.etiqueta(k, T.fundamental - 0.2); FX.goteo(k, T.agua19 - 0.2, 2, 0.3); FX.sello(k, T.agua19); FX.arroyo(k, T.agua19 + 0.2, TB.canales - T.agua19, 0.8); } });
 B.push({ t0: TB.canales, t1: TB.sistemas, in: { type: 'cut' }, draw(ctx, t) {
  P.andes(ctx, t, { sun: [880, 300], peaks: [300, 800, 600] }); ctx.fillStyle = '#4c6b56'; ctx.beginPath(); ctx.moveTo(-20, HH); ctx.lineTo(-20, 900); ctx.lineTo(1100, 360); ctx.lineTo(1100, HH); ctx.closePath(); ctx.fill();
  // manantial
  P.circle(ctx, 1000, 400, 34, '#3c4a46'); P.glow(ctx, 1000, 400, 60, '122,230,242', 0.6); callout(ctx, 1000, 380, 860, 300, 'MANANTIAL', sm(T.manantiales - 0.3, T.manantiales, t), C.aguaL, 'right');
  P.channel(ctx, CAN, t, { fill: 1 });
  const fa = sm(T.fuentes - 0.3, T.fuentes + 1.2, t); for (let i = 0; i < 5; i++) { const [ax, ay] = FOUNT(i), [bx, by] = FOUNT(i + 1); P.channel(ctx, [[ax + 40, ay + 22], [ax + 40, by - 70], [bx, by - 88]], t, { w: 12, fill: cl(fa * 6 - i - 0.5) }); } for (let i = 0; i < 6; i++) { const [fx, fy] = FOUNT(i); P.incaFountain(ctx, fx, fy, 92, t + i * 0.3, cl(fa * 6 - i)); }
  callout(ctx, 640, 640, 760, 760, 'CANAL ≈ 749 m', sm(T.canales, T.canales + 0.3, t), C.blanco); tag(ctx, 'pendiente ≈ 3 %: el agua baja sola', 760, 830, 22, sm(T.conducir, T.conducir + 0.3, t));
  callout(ctx, 330, 1150, 470, 1240, '16 FUENTES EN CASCADA', sm(T.fuentes, T.fuentes + 0.4, t), C.aguaL);
  pill(ctx, 'CANALES Y FUENTES', 540, 300, 44, t, T.canales, C.agua, C.fondo, T.manantiales);
  pill(ctx, 'AGUA POR GRAVEDAD', 540, 300, 48, t, T.manantiales, C.oro, C.fondo);
  tag(ctx, 'ilustración: 6 de las 16 fuentes', 540, 1365, 22, sm(T.sectores, T.sectores + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.arroyo(k, TB.canales, TB.sistemas - TB.canales, 1); FX.etiqueta(k, T.canales); for (let i = 0; i < 7; i++) FX.goteo(k, T.fuentes + i * 0.17, 2, 0.12, i + 3); FX.sello(k, T.manantiales); } });
 // 18 · tres sistemas integrados: muros/terrazas, drenaje (lluvia) y abastecimiento (manantial) — distintos
 B.push({ t0: TB.sistemas, t1: TB.siglos, in: { type: 'iris', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  const gw = sm(T.arquitectura - 0.2, T.arquitectura + 0.3, t), gd = sm(T.drenaje21 - 0.2, T.drenaje21 + 0.3, t), ga = sm(T.abastecimiento - 0.2, T.abastecimiento + 0.3, t);
  ctx.save(); P.camApply(ctx, [560, 900, 1.25 + 0.04 * Math.sin(t * 0.3)]); aerial(ctx, t, { age: 1, canal: ga, glow: { walls: gw, drain: gd, water: ga }, fogA: 0.5 }); ctx.restore();
  [['ARQUITECTURA', C.dorado, T.arquitectura], ['DRENAJE', C.agua, T.drenaje21], ['AGUA', C.aguaL, T.abastecimiento]].forEach(([s, c, t0], i) => pill(ctx, s, 220 + i * 320, 330, 34, t, t0, c, C.fondo));
  for (let i = 0; i < 2; i++) if (t > [T.drenaje21, T.abastecimiento][i]) txt(ctx, '+', 380 + i * 320, 332, 40, C.blanco);
  tag(ctx, 'drenaje (lluvia) y abastecimiento (manantial) son sistemas distintos', 540, 1365, 20, sm(T.entorno, T.entorno + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.sistemas, TB.siglos - TB.sistemas, 0.6); FX.etiqueta(k, T.arquitectura); FX.etiqueta(k, T.drenaje21); FX.etiqueta(k, T.abastecimiento); FX.arroyo(k, T.abastecimiento, 3, 0.5); FX.correcto(k, T.exigente); } });
 // 19 · cinco siglos después: la reconstrucción se transforma en el estado actual (misma toma)
 B.push({ t0: TB.siglos, t1: TB.final, in: { type: 'cut' }, draw(ctx, t) {
  const age = E.inOut(win(t, T.increible - 0.3, T.siglos + 0.3));
  ctx.save(); P.camApply(ctx, [540, 920, 1.15]); aerial(ctx, t, { age, fogA: 0.7 }); ctx.restore();
  P.counter(ctx, 540, 330, 70, t, T.increible - 0.2, T.siglos + 0.3, 0, 500, { box: C.oro, c: C.fondo, prefix: '+ ', suffix: ' años' });
  tag(ctx, 'muchas estructuras siguen en pie (con trabajos de conservación)', 540, 1365, 20, sm(T.sobrevivido, T.sobrevivido + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.tiempo(k, T.increible - 0.3, T.siglos - T.increible + 0.6, 1); FX.contador(k, T.increible - 0.2, T.siglos + 0.3, 0, 25); } });
 // 20 · revelación final: de la terraza a la ciudadela completa entre la niebla · 21 · Asombroteca
 const finale = (ctx, t) => { const u = t - TB.final; ctx.save(); P.camApply(ctx, P.camAt([[TB.final, 470, 1000, 1.7], [T.montana23, 500, 930, 1.15], [T.adaptada, 520, 890, 1.0], [DURATION, 520, 880, 1.02]], t)); aerial(ctx, t, { age: 1, sun: [820, 300], fogA: 0.9 }); ctx.restore(); P.glow(ctx, 820, 300, 500, '255,220,170', 0.2 * sm(TB.final, TB.final + 3, t)); };
 B.push({ t0: TB.final, t1: TB.cierre, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  finale(ctx, t);
  pill(ctx, 'NO SOLO UNA CIUDAD', 540, 330, 44, t, T.machu23 + 0.2, C.blanco, C.fondo, T.fue24);
  pill(ctx, 'INGENIERÍA ADAPTADA', 540, 330, 46, t, T.ingenieria24, C.oro, C.fondo);
  pill(ctx, 'A LA NATURALEZA', 540, 420, 46, t, T.naturaleza - 0.2, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.final, DURATION - TB.final, 0.8); k.play('riser', TB.final, { dur: 2.5, gain: 0.3 }); FX.revelar(k, T.ingenieria24); FX.sello(k, T.naturaleza - 0.2); } });
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'cut' }, draw(ctx, t) {
  finale(ctx, t);
  P.withPop(ctx, t, T.sigue + 0.1, 540, 420, () => { P.rr(ctx, 210, 355, 660, 130, 32, 'rgba(17,26,25,0.78)'); P.text(ctx, 'ASOMBROTECA', 540, 421, 68, C.blanco, { kind: 'title' }); });
  const press = win(t, T.asombroteca + 1.0, T.asombroteca + 1.2), done = t > T.asombroteca + 1.15;
  P.withPop(ctx, t, T.asombroteca + 0.2, 540, 565, () => { P.rr(ctx, 380, 520, 320, 86, 43, done ? '#2fbf71' : C.oro, { sy: 8 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 565, 36, C.fondo); });
  if (t > T.asombroteca + 0.4) P.finger(ctx, 600, lerp(900, 585, E.out(win(t, T.asombroteca + 0.4, T.asombroteca + 1.0))), 90, press * (1 - win(t, T.asombroteca + 1.3, T.asombroteca + 1.6)));
  scrim(ctx);
 }, sfx(k) { FX.sello(k, T.sigue + 0.1); FX.aparece(k, T.asombroteca + 0.2, 700); FX.clic(k, T.asombroteca + 1.15); k.play('ding', T.asombroteca + 1.2, { f: 'A5', gain: 0.3 }); FX.fin(k, T.asombroteca + 1.5); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['500', '2.400', 'montañas', 'lluvias', 'Machu', 'Picchu', 'ingeniería', 'terreno', 'deslizamientos', 'terrazas', 'drenar', 'piedra', 'percusión', 'abrasión', 'canteras', 'encajar', 'mortero', 'agua', 'manantiales', 'drenaje', 'siglos', 'naturaleza', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 500, q: 0.7, gain: 0.022, a: 2, hold: DURATION - 3 }); },
  music(k) {
   // armonía pentatónica (sobria, sin clichés): cuerdas/pads y pulso moderado
   const M1 = [['A2', 'E3', 'A3', 'C4'], ['G2', 'D3', 'G3', 'B3'], ['F2', 'C3', 'A3', 'C4'], ['E2', 'B2', 'E3', 'G3']];
   k.music('pad', 0, T.primero, { bpm: 78, gain: 0.42, chords: M1 });
   k.music('pad', T.primero, T.por7, { bpm: 72, gain: 0.36, chords: [['D2', 'A2', 'D3', 'F3'], ['E2', 'B2', 'E3', 'G3']] });
   k.music('pulse', T.por7, T.despues, { bpm: 92, gain: 0.22, chords: M1 });
   k.music('pulse', T.despues, T.pero18, { bpm: 84, gain: 0.22, chords: [['E2', 'B2', 'E3', 'G3'], ['D2', 'A2', 'D3', 'F#3'], ['C2', 'G2', 'C3', 'E3'], ['D2', 'A2', 'D3', 'F#3']] });
   k.music('pad', T.pero18, T.y22, { bpm: 88, gain: 0.38, chords: [['C3', 'G3', 'C4', 'E4'], ['G2', 'D3', 'G3', 'B3'], ['A2', 'E3', 'A3', 'C4'], ['F2', 'C3', 'F3', 'A3']] });
   k.music('pad', T.y22, DURATION, { bpm: 76, gain: 0.44, chords: [['F2', 'C3', 'A3', 'C4'], ['G2', 'D3', 'B3', 'D4'], ['A2', 'E3', 'C4', 'E4'], ['A2', 'E3', 'A3', 'C#4']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
