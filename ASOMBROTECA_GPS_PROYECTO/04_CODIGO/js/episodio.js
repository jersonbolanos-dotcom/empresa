// =====================================================================================================
// episodio.js — «¿Cómo sabe tu celular dónde estás? (GPS)» · Asombroteca · PLANTILLA ASOMBROTECA v1.5
// Arco: celular sin internet → subida a la órbita (≈20.200 km) → constelación → mensaje (posición + hora)
// → tiempo de viaje × velocidad de la luz = distancia → analogía de las casas (trilateración) → al menos 4
// satélites (posición + reloj del celular) → relatividad (≈38 µs/día) → regreso al mapa → «Sigue a Asombroteca».
// Cifras verificadas (FUENTES_Y_DECISIONES.md). Reloj = segundos de la voz original. Determinista.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  exactamente: wt(0, 'exactamente'), sin0: wt(0, 'sin'), internet: wt(0, 'internet'), como1: SG(1).s,
  respuesta: SG(2).s, mas2: wt(2, 'más'), km2: wt(2, 'kilómetros'), cabeza: wt(2, 'cabeza'),
  alla: SG(3).s, decenas: wt(3, 'decenas'), satelites3: wt(3, 'satélites'), giran: wt(3, 'giran'), tierra: wt(3, 'tierra'),
  envian: wt(4, 'envían'), senales4: wt(4, 'señales'), radio: wt(4, 'radio'),
  cada: SG(5).s, dos: wt(5, 'dos'), donde6: SG(6).s, satelite6: wt(6, 'satélite'), hora: wt(7, 'hora'), mensaje: wt(7, 'mensaje'),
  cuando8: SG(8).s, recibe: wt(8, 'recibe'), calcula: SG(9).s, tiempo9: wt(9, 'tiempo'), llegar: wt(9, 'llegar'),
  truco10: SG(10).s, truco: wt(10, 'truco'), como11: SG(11).s, velocidad: wt(11, 'velocidad'), luz: wt(11, 'luz'),
  ese12: SG(12).s, permite: wt(12, 'permite'), lejos: wt(12, 'lejos'), satelite12: wt(12, 'satélite'),
  pero13: SG(13).s, solo13: wt(13, 'solo'), imagina14: SG(14).s, diez: wt(14, '10'), casa14: wt(14, 'casa'),
  podrias: SG(15).s, muchisimos: wt(15, 'muchísimos'), ahora16: SG(16).s, otras: wt(16, 'otras'), tres: wt(16, 'tres'), personas: wt(16, 'personas'),
  distancia17: wt(17, 'distancia'), casas17: wt(17, 'casas'), combinar: wt(18, 'combinar'), distancias18: wt(18, 'distancias'), ubicacion18: wt(18, 'ubicación'),
  eso19: SG(19).s, hace19: wt(19, 'hace'), satelites19: wt(19, 'satélites'),
  normalmente: SG(20).s, menos: wt(20, 'menos'), cuatro: wt(20, '4'), posicion21: wt(21, 'posición'), corregir: wt(22, 'corregir'), diferencias: wt(22, 'diferencias'), tiempo22: wt(22, 'tiempo'),
  y23: SG(23).s, sorprendente: wt(23, 'sorprendente'), relojes: wt(24, 'relojes'), correcciones: wt(24, 'correcciones'), relatividad: wt(24, 'relatividad'), einstein: wt(24, 'einstein'),
  sin25: SG(25).s, errores: wt(25, 'errores'), aumentarian: wt(25, 'aumentarían'), rapidamente: wt(25, 'rápidamente'),
  asi26: SG(26).s, mapa: wt(26, 'mapa'), recuerda: wt(26, 'recuerda'), miles: wt(26, 'miles'), camino: wt(26, 'camino'),
  sigue: SG(27).s, asombroteca: wt(27, 'asombroteca'), end: A.speech_end,
 };
 const TB = { orbita: T.alla - 0.1, mensaje: T.cada - 0.15, viaje: T.cuando8 - 0.25, casas: T.pero13 - 0.1, cuatro: T.eso19 - 0.25, relat: T.y23 - 0.15, mapa: T.asi26 - 0.2, cierre: T.sigue - 0.15 };

 // ---------------- utilidades ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, px, a, c = 'rgba(230,240,255,0.92)', al = 'center') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `700 ${px}px "IBM Plex Mono"`; ctx.textAlign = al; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 10; ctx.fillText(s, x, y); ctx.restore(); };
 let STARS = null;
 function space(ctx, t, a = 1) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#050a1c'); g.addColorStop(1, '#0d1a3a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  if (!STARS) { const R = H.rng(5); STARS = Array.from({ length: 220 }, () => [R() * W, R() * HH, R.range(0.6, 2.2), R() * TAU]); }
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffffff'; for (const [x, y, r, ph] of STARS) { ctx.globalAlpha = a * (0.45 + 0.4 * Math.sin(t * 1.5 + ph)); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } ctx.restore();
 }
 function mapScreen(ctx, x, y, w, h, t, o = {}) { // pantalla del celular con mapa y punto azul
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); const z = o.zoom || 1; ctx.scale(z, z); ctx.translate(-(x + w / 2), -(y + h / 2));
  P.mapCity(ctx, x, y, w, h, 3, { block: 46, street: 10 }); ctx.restore();
  if (o.route) { const pts = o.route; ctx.save(); ctx.strokeStyle = '#2f80ed'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); }
  if (o.dot !== false) P.dot(ctx, o.dx ?? x + w / 2, o.dy ?? y + h * 0.55, 14, t);
  // barra de estado: sin datos ni wifi
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillRect(x, y, w, 44); ctx.fillStyle = '#1d1b3a'; ctx.font = '800 22px Nunito'; ctx.textAlign = 'left'; ctx.fillText('9:41', x + 22, y + 30);
  if (o.offline) { ctx.textAlign = 'right'; ctx.fillStyle = '#e8505b'; ctx.fillText('SIN DATOS', x + w - 22, y + 30); }
 }
 function house(ctx, x, y, s, c) { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(x, y + s * 0.5, s * 0.6, s * 0.14, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillRect(x - s * 0.42, y - s * 0.1, s * 0.84, s * 0.6); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - s * 0.55, y - s * 0.05); ctx.lineTo(x, y - s * 0.55); ctx.lineTo(x + s * 0.55, y - s * 0.05); ctx.closePath(); ctx.fill(); ctx.fillStyle = c; ctx.fillRect(x - s * 0.1, y + s * 0.18, s * 0.2, s * 0.32); ctx.restore(); }
 function person(ctx, x, y, s, c = '#1d1b3a') { ctx.save(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y - s * 0.6, s * 0.22, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - s * 0.28, y - s * 0.34, s * 0.56, s * 0.6, s * 0.2); ctx.fill(); ctx.restore(); }

 // ================= BEATS =================
 const B = [];
 // 1 · gancho: el celular sabe dónde estás sin internet → subida a la órbita
 B.push({ t0: 0, t1: TB.orbita, draw(ctx, t) {
  const up = E.inOut(win(t, T.respuesta - 0.1, T.cabeza + 0.3));
  // cielo que pasa de día a espacio
  const sky = ctx.createLinearGradient(0, 0, 0, HH), dayTop = [80, 160, 230], dayBot = [190, 225, 250], sp0 = [5, 10, 28], sp1 = [13, 26, 58];
  const mix = (a, b, u) => H.rgba([lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]);
  sky.addColorStop(0, mix(dayTop, sp0, cl(up * 1.4))); sky.addColorStop(1, mix(dayBot, sp1, cl(up * 1.1))); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HH);
  if (up > 0.3) space(ctx, t, (up - 0.3) / 0.7 * 0.9);
  // nubes que bajan (parallax) durante la subida
  const R = H.rng(9); for (let i = 0; i < 9; i++) { const x = R() * W, y0 = R() * HH, s = R.range(0.6, 1.4), y = y0 + up * 2600 * s - 900; if (y < -200 || y > HH + 200) continue; ctx.fillStyle = `rgba(255,255,255,${0.75 * (1 - up)})`; for (const [dx, dy, r] of [[0, 0, 60], [60, -20, 75], [130, 0, 55], [65, 18, 60]]) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill(); } }
  // ciudad al fondo (se aleja hacia abajo)
  ctx.save(); ctx.translate(0, up * 1400); const Rb = H.rng(4); ctx.fillStyle = '#5b6b84'; for (let i = 0; i < 14; i++) { const w = Rb.range(60, 110), h = Rb.range(160, 420); ctx.fillRect(i * 80 - 20, 1700 - h, w, h + 400); } ctx.restore();
  // el celular: grande al principio, se encoge y baja durante la subida
  const ps = lerp(1, 0.2, up), py = lerp(860, 1700, up * up);
  ctx.save(); ctx.translate(540, py); ctx.scale(ps, ps); ctx.translate(-540, -860);
  P.phone(ctx, 540, 860, 500, (x, y, w, h) => mapScreen(ctx, x, y, w, h, t, { zoom: 1 + 0.6 * E.inOut(win(t, T.exactamente - 0.2, T.exactamente + 0.6)), offline: t > T.sin0 - 0.1 }));
  ctx.restore();
  // sin internet
  if (t > T.sin0 - 0.1 && t < T.respuesta + 0.3) { const a = 1 - sm(T.respuesta, T.respuesta + 0.3, t); ctx.save(); ctx.globalAlpha = a; P.withPop(ctx, t, T.sin0 - 0.05, 540, 330, () => { P.rr(ctx, 300, 285, 480, 96, 48, '#e8505b', { sy: 10 }); P.text(ctx, 'SIN INTERNET', 590, 335, 44, '#ffffff'); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(362, 352, 14 + k * 12, -2.4, -0.75); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(334, 308); ctx.lineTo(392, 360); ctx.stroke(); }); ctx.restore(); }
  P.onoma(ctx, '¿CÓMO?', 540, 620, 130, t, T.como1, T.respuesta + 0.2, { c: '#ffd166' });
  // regla de altitud y contador (≈ 20.200 km, verificado)
  const ra = sm(T.mas2 - 0.4, T.mas2, t) * (1 - sm(T.alla - 0.3, T.alla, t));
  if (ra > 0) { ctx.save(); ctx.globalAlpha = ra; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(120, 1380); ctx.lineTo(120, 380); ctx.stroke(); for (let k = 0; k <= 10; k++) { const y = 1380 - k * 100; ctx.beginPath(); ctx.moveTo(120, y); ctx.lineTo(k % 5 ? 140 : 160, y); ctx.stroke(); } const my = 1380 - 1000 * up; P.circle(ctx, 120, my, 14, '#ffd166'); ctx.restore();
   P.counter(ctx, 600, 560, 110, t, T.mas2, T.cabeza, 0, 20200, { box: '#ffd166', c: '#081426', suffix: ' km', fmt: (v) => v.toLocaleString('es-CO') }); }
  tag(ctx, 'altitud de los satélites GPS ≈ 20.200 km', 600, 680, 26, ra * sm(T.km2, T.km2 + 0.4, t));
  // aparece el satélite arriba al final de la subida
  const sa = sm(T.cabeza - 0.6, T.cabeza + 0.3, t); if (sa > 0) { ctx.save(); ctx.globalAlpha = sa; P.satellite(ctx, 600, lerp(-100, 320, sa), 90, 0.2); ctx.restore(); }
 }, sfx(k) {
  FX.ubicacion(k, 0.3); FX.aparece(k, T.exactamente, 620); FX.tachado(k, T.sin0); FX.onomatopeya(k, T.como1);
  k.play('riser', T.respuesta - 0.1, { dur: T.cabeza - T.respuesta + 0.3, gain: 0.4 }); k.play('whoosh', T.respuesta, { dur: 1.5, top: 1800, gain: 0.4 }); FX.contador(k, T.mas2, T.cabeza, 0, 20200); FX.senal(k, T.cabeza + 0.2, 0.8);
 } });
 // 2 · la constelación: decenas de satélites alrededor de la Tierra, enviando señales de radio
 const ORB = [0, 1, 2, 3, 4, 5].map((i) => ({ rot: -0.9 + i * 0.36, rx: 470, ry: 150 + (i % 3) * 25, ph: i * 1.1 }));
 B.push({ t0: TB.orbita, t1: TB.mensaje, in: { type: 'iris', d: 0.6, x: 600, y: 320 }, draw(ctx, t) {
  space(ctx, t); const gx = 540, gy = 1000, gr = 300;
  const sats = []; ORB.forEach((o, i) => { for (let j = 0; j < 2; j++) { const a = o.ph + j * Math.PI + t * 0.22, ex = Math.cos(a) * o.rx, ey = Math.sin(a) * o.ry, x = gx + ex * Math.cos(o.rot) - ey * Math.sin(o.rot), y = gy + ex * Math.sin(o.rot) + ey * Math.cos(o.rot); sats.push({ x, y, back: Math.sin(a) < 0, i }); } });
  const oa = sm(T.alla, T.alla + 0.6, t);
  const orbit = (o, front) => { ctx.save(); ctx.strokeStyle = `rgba(150,200,255,${0.35 * oa})`; ctx.lineWidth = 2; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.ellipse(gx, gy, o.rx, o.ry, o.rot, front ? 0 : Math.PI, front ? Math.PI : TAU); ctx.stroke(); ctx.restore(); };
  ORB.forEach((o) => orbit(o, false)); sats.filter((s) => s.back).forEach((s) => { ctx.save(); ctx.globalAlpha = oa * 0.7; P.satellite(ctx, s.x, s.y, 30, 0.3); ctx.restore(); });
  P.globe(ctx, gx, gy, gr, t * 0.15);
  ORB.forEach((o) => orbit(o, true));
  const ra = sm(T.envian - 0.2, T.envian + 0.3, t);
  sats.filter((s) => !s.back).forEach((s, i) => { ctx.save(); ctx.globalAlpha = oa; P.satellite(ctx, s.x, s.y, 38, 0.3); ctx.restore(); if (ra > 0) P.rings(ctx, s.x, s.y, t + i * 0.3, { r: 90, n: 2, period: 1.4, a: ra * 0.8, dir: Math.atan2(gy - s.y, gx - s.x), spread: 0.7, w: 4 }); });
  pill(ctx, 'DECENAS DE SATÉLITES', 540, 360, 44, t, T.decenas, '#ffd166', '#081426');
  pill(ctx, 'ENVÍAN SEÑALES DE RADIO', 540, 450, 34, t, T.senales4, '#55e9ff', '#081426');
  tag(ctx, 'ESCALA NO REAL', 540, 1390, 22, oa * 0.8);
 }, sfx(k) { FX.revelar(k, TB.orbita + 0.2); FX.aparece(k, T.decenas, 600); k.play('whoosh', T.giran, { dur: 1.4, top: 1200, gain: 0.3, minor: true }); [0, 0.5, 1.0, 1.5].forEach((d, i) => FX.senal(k, T.envian + d, 0.7, 1300 + i * 120)); FX.etiqueta(k, T.senales4); } });
 // 3 · el mensaje: dónde está el satélite y a qué hora envió la señal
 B.push({ t0: TB.mensaje, t1: TB.viaje, in: { type: 'zoom', d: 0.6, x: 540, y: 700 }, draw(ctx, t) {
  space(ctx, t);
  P.satellite(ctx, 540, 420, 130, 0.12 + Math.sin(t) * 0.03);
  P.rings(ctx, 540, 500, t, { r: 260, n: 3, period: 1.3, a: 0.9, dir: Math.PI / 2, spread: 0.55, w: 6 });
  // tarjeta del mensaje que baja del satélite
  const ca = E.out(win(t, T.cada, T.cada + 0.5)); if (ca <= 0) return;
  ctx.save(); ctx.translate(0, (1 - ca) * -300); ctx.globalAlpha = ca;
  P.rr(ctx, 120, 760, 840, 520, 36, '#ffffff', { sy: 16 }); P.text(ctx, 'SEÑAL DEL SATÉLITE', 540, 830, 40, '#1d1b3a', { kind: 'title' });
  ctx.fillStyle = '#e6ebf2'; ctx.fillRect(170, 870, 740, 4);
  const r1 = sm(T.donde6 - 0.1, T.donde6 + 0.2, t), r2 = sm(T.hora - 0.1, T.hora + 0.2, t);
  if (r1 > 0) { ctx.globalAlpha = ca * r1; P.pin(ctx, 240, 1030, 90, '#e8505b'); P.text(ctx, 'DÓNDE ESTÁ', 600, 960, 44, '#1d1b3a'); P.text(ctx, 'EL SATÉLITE', 600, 1010, 44, '#1d1b3a'); P.text(ctx, '(su posición en la órbita)', 600, 1056, 28, '#6a6f86'); }
  if (r2 > 0) { ctx.globalAlpha = ca * r2; P.clock(ctx, 240, 1180, 56, 43200 + t * 60); P.text(ctx, 'HORA EXACTA', 600, 1160, 44, '#1d1b3a'); P.text(ctx, 'DEL ENVÍO', 600, 1210, 44, '#1d1b3a'); P.text(ctx, '(reloj atómico a bordo)', 600, 1252, 28, '#6a6f86'); }
  ctx.restore();
  pill(ctx, '2 DATOS', 880, 330, 40, t, T.dos, '#ffd166', '#081426');
 }, sfx(k) { FX.senal(k, TB.mensaje + 0.3, 0.8); FX.aparece(k, T.cada, 520); k.play('paper', T.cada + 0.05, { dur: 0.4, gain: 0.35 }); FX.etiqueta(k, T.dos); FX.datos(k, T.donde6, 10); FX.aparece(k, T.donde6, 640); FX.tictac(k, T.hora, 3, 0.4); FX.aparece(k, T.hora, 760); } });
 // 4 · tiempo de viaje × velocidad de la luz = distancia
 const SAT = [200, 420], PH = [850, 760];
 B.push({ t0: TB.viaje, t1: TB.casas, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  space(ctx, t);
  // superficie terrestre abajo
  ctx.save(); ctx.beginPath(); ctx.arc(540, 3600, 2300, 0, TAU); ctx.clip(); P.globe(ctx, 540, 3600, 2300, 0.4); ctx.restore();
  P.satellite(ctx, SAT[0], SAT[1], 80, 0.5);
  P.phone(ctx, PH[0], PH[1], 150, (x, y, w, h) => mapScreen(ctx, x, y, w, h, t, { offline: true }));
  // el pulso viaja del satélite al celular (repetido) y llega al recibir
  const ang = Math.atan2(PH[1] - SAT[1], PH[0] - SAT[0]), Ld = Math.hypot(PH[0] - SAT[0], PH[1] - SAT[1]);
  ctx.save(); ctx.strokeStyle = 'rgba(120,220,255,0.3)'; ctx.setLineDash([12, 12]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(SAT[0], SAT[1]); ctx.lineTo(PH[0], PH[1] - 170); ctx.stroke(); ctx.restore();
  const u = ((t - TB.viaje) * 0.6) % 1, px = SAT[0] + Math.cos(ang) * (Ld - 170) * u, py = SAT[1] + Math.sin(ang) * (Ld - 170) * u;
  P.rings(ctx, px, py, t, { r: 40, n: 2, period: 0.6, a: 0.9, dir: ang, spread: 0.9, w: 5 }); P.glow(ctx, px, py, 40, '120,220,255', 0.9);
  if (t > T.recibe) P.rings(ctx, PH[0], PH[1] - 150, t, { r: 120, n: 2, period: 1.0, a: 0.8 * (1 - sm(T.truco10, T.truco10 + 0.5, t)) });
  // cronómetro (cámara lenta): tardó ≈ 0,07 s
  const ta = sm(T.calcula - 0.1, T.calcula + 0.2, t) * (1 - sm(T.truco10 - 0.2, T.truco10 + 0.2, t));
  if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; P.rr(ctx, 300, 1010, 480, 200, 30, '#ffffff', { sy: 12 }); const v = 0.067 * E.out(win(t, T.calcula + 0.1, T.llegar + 0.3)); P.text(ctx, 'TARDÓ', 540, 1060, 34, '#6a6f86'); P.text(ctx, '≈ ' + v.toFixed(2).replace('.', ',') + ' s', 540, 1140, 72, '#1d1b3a', { kind: 'title' }); ctx.restore(); tag(ctx, 'menos de una décima de segundo', 540, 1255, 26, ta); }
  pill(ctx, 'EL TRUCO', 540, 340, 48, t, T.truco, '#ffd166', '#081426', TB.casas - 0.2);
  // fórmula
  const fa = sm(T.velocidad - 0.2, T.velocidad + 0.2, t);
  if (fa > 0) { ctx.save(); ctx.globalAlpha = fa; P.rr(ctx, 70, 990, 940, 300, 32, '#ffffff', { sy: 12 }); P.text(ctx, 'DISTANCIA =', 540, 1060, 44, '#1d1b3a', { kind: 'title' }); P.text(ctx, 'VELOCIDAD DE LA LUZ × TIEMPO', 540, 1125, 40, '#2f80ed'); const va = sm(T.permite - 0.1, T.permite + 0.3, t); ctx.globalAlpha = fa * va; P.text(ctx, '≈ 300.000 km/s × 0,07 s ≈ 20.000 km', 540, 1210, 38, '#e8505b'); ctx.restore(); }
  const la = sm(T.lejos - 0.1, T.lejos + 0.3, t);
  if (la > 0) { const mx = (SAT[0] + PH[0]) / 2 - 40, my = (SAT[1] + PH[1] - 170) / 2 + 70; ctx.save(); ctx.globalAlpha = la; ctx.translate(mx, my); ctx.rotate(ang); P.rr(ctx, -150, -36, 300, 72, 36, '#ffd166', { sy: 6 }); P.text(ctx, '≈ 20.000 KM', 0, 2, 36, '#081426'); ctx.restore(); }
 }, sfx(k) {
  for (let x = TB.viaje + 0.2; x < T.truco10; x += 1 / 0.6) FX.senal(k, x, 0.5, 1500); FX.aparece(k, T.recibe, 700); k.play('ding', T.recibe + 0.05, { f: 'A6', gain: 0.15, minor: true });
  FX.aparece(k, T.calcula, 560); FX.tictac(k, T.calcula + 0.1, 4, 0.3); FX.sello(k, T.llegar + 0.3);
  FX.sello(k, T.truco); FX.aparece(k, T.velocidad, 520); k.play('whoosh', T.luz, { dur: 0.6, top: 3000, gain: 0.35 }); FX.etiqueta(k, T.permite); FX.correcto(k, T.lejos);
 } });
 // 5 · analogía de las casas: una distancia no basta; cuatro distancias sí
 const TG = [560, 900];
 const HOUSES = [{ x: 260, y: 660, c: '#e8505b', t: () => T.imagina14 + 0.3 }, { x: 880, y: 600, c: '#2fbf71', t: () => T.otras }, { x: 300, y: 1240, c: '#7a6cf0', t: () => T.tres }, { x: 900, y: 1200, c: '#f0b90b', t: () => T.personas }];
 HOUSES.forEach((h) => (h.r = Math.hypot(h.x - TG[0], h.y - TG[1])));
 B.push({ t0: TB.casas, t1: TB.cuatro, in: { type: 'iris', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  P.mapCity(ctx, 0, 0, W, HH, 11, { block: 120, street: 22 });
  ctx.fillStyle = 'rgba(15,20,40,0.12)'; ctx.fillRect(0, 0, W, HH);
  pill(ctx, 'CON UNO SOLO NO BASTA', 540, 330, 40, t, T.pero13, '#e8505b', '#ffffff', T.imagina14 + 0.2);
  HOUSES.forEach((h, i) => {
   const ha = P.popS(t, h.t(), 0.3); if (ha <= 0) return;
   const rp = i === 0 ? E.inOut(win(t, T.diez - 0.1, T.casa14 + 0.3)) : E.inOut(win(t, T.distancia17 + (i - 1) * 0.35, T.distancia17 + (i - 1) * 0.35 + 0.8));
   P.rangeCircle(ctx, h.x, h.y, h.r, rp, h.c, { fillA: 0.06, w: 6 });
   P.withPop(ctx, t, h.t(), h.x, h.y, () => house(ctx, h.x, h.y, 70, h.c), 0.3);
  });
  // la primera distancia: «10 km»
  const la = sm(T.diez - 0.1, T.diez + 0.3, t) * (1 - sm(T.ahora16, T.ahora16 + 0.4, t)); if (la > 0) { const h = HOUSES[0]; ctx.save(); ctx.globalAlpha = la; ctx.strokeStyle = h.c; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(h.x, h.y); ctx.lineTo(h.x + h.r, h.y); ctx.stroke(); P.rr(ctx, h.x + h.r / 2 - 70, h.y - 60, 140, 56, 28, '#ffffff', { sy: 6 }); P.text(ctx, '10 KM', h.x + h.r / 2, h.y - 32, 30, '#1d1b3a'); ctx.restore(); }
  // muchísimos lugares posibles sobre el círculo
  const qa = sm(T.muchisimos - 0.1, T.muchisimos + 0.3, t) * (1 - sm(T.ahora16 + 0.6, T.ahora16 + 1.1, t)); if (qa > 0) { const h = HOUSES[0]; for (let k = 0; k < 9; k++) { const an = k / 9 * TAU + 0.3, x = h.x + Math.cos(an) * h.r, y = h.y + Math.sin(an) * h.r; ctx.save(); ctx.globalAlpha = qa * sm(T.muchisimos + k * 0.08, T.muchisimos + k * 0.08 + 0.2, t); person(ctx, x, y, 44, '#1d1b3a'); P.text(ctx, '?', x + 22, y - 44, 30, '#e8505b', { kind: 'title' }); ctx.restore(); } }
  pill(ctx, '¿DÓNDE ESTOY?', 540, 330, 40, t, T.podrias, '#ffffff', '#1d1b3a', T.ahora16 + 0.2);
  pill(ctx, '+3 DISTANCIAS MÁS', 540, 330, 40, t, T.otras, '#2f80ed', '#ffffff', T.combinar);
  // combinar: un único punto común
  const ca = sm(T.combinar - 0.1, T.combinar + 0.4, t); if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; ctx.strokeStyle = '#1d1b3a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(TG[0], TG[1], 46 + 10 * Math.sin(t * 6), 0, TAU); ctx.stroke(); ctx.restore(); }
  const pa = P.popS(t, T.ubicacion18 - 0.1, 0.35); if (pa > 0) { ctx.save(); ctx.translate(TG[0], TG[1]); ctx.scale(pa, pa); ctx.translate(-TG[0], -TG[1]); P.pin(ctx, TG[0], TG[1], 110, '#e8505b'); ctx.restore(); }
  pill(ctx, '¡AQUÍ ESTÁS!', 540, 330, 48, t, T.ubicacion18, '#2fbf71', '#ffffff');
 }, sfx(k) {
  FX.tachado(k, T.solo13); HOUSES.forEach((h, i) => FX.aparece(k, h.t(), 500 + i * 100)); k.play('stroke', T.diez - 0.1, { material: 'marker', dur: 0.8, gain: 0.3 }); FX.etiqueta(k, T.diez);
  for (let i = 0; i < 9; i++) k.play('pop', T.muchisimos + i * 0.08, { f: 700 + i * 40, gain: 0.18, minor: true }); FX.onomatopeya(k, T.podrias);
  [0, 1, 2].forEach((i) => k.play('stroke', T.distancia17 + i * 0.35, { material: 'marker', dur: 0.8, gain: 0.22, minor: true }));
  k.play('riser', T.combinar - 0.3, { dur: 1.2, gain: 0.3 }); FX.ubicacion(k, T.ubicacion18 - 0.1); k.play('thud', T.ubicacion18 - 0.05, { f: 150, gain: 0.35 });
 } });
 // 6 · lo mismo con satélites: al menos 4 (posición + corregir el reloj del celular)
 const S4 = [[170, 470], [420, 360], [690, 370], [930, 480]], PHN = [560, 1250];
 B.push({ t0: TB.cuatro, t1: TB.relat, in: { type: 'rise', d: 0.55 }, draw(ctx, t) {
  space(ctx, t);
  ctx.save(); ctx.beginPath(); ctx.arc(540, 3500, 2200, 0, TAU); ctx.clip(); P.globe(ctx, 540, 3500, 2200, 0.8); ctx.restore();
  S4.forEach(([x, y], i) => {
   const t0 = T.hace19 + i * 0.35, a = sm(t0 - 0.2, t0, t); if (a <= 0) return;
   ctx.save(); ctx.globalAlpha = a; P.satellite(ctx, x, y, 52, 0.4); ctx.restore();
   const r = Math.hypot(PHN[0] - x, PHN[1] - y), an = Math.atan2(PHN[1] - y, PHN[0] - x), p = E.inOut(win(t, t0, t0 + 0.8));
   ctx.save(); ctx.globalAlpha = a * 0.9; ctx.strokeStyle = ['#e8505b', '#2fbf71', '#7a6cf0', '#f0b90b'][i]; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.arc(x, y, r, an - 0.35 * p, an + 0.35 * p); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = a * 0.35; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(PHN[0], PHN[1]); ctx.stroke(); ctx.restore();
  });
  const fa = sm(T.satelites19 + 0.6, T.satelites19 + 1.0, t); P.dot(ctx, PHN[0], PHN[1], 16, t); if (fa > 0) { ctx.save(); ctx.globalAlpha = fa; P.pin(ctx, PHN[0], PHN[1] - 10, 90, '#e8505b'); ctx.restore(); }
  P.counter(ctx, 540, 720, 150, t, T.menos, T.cuatro + 0.15, 1, 4, { box: '#ffd166', c: '#081426' });
  tag(ctx, 'SATÉLITES COMO MÍNIMO', 540, 830, 30, sm(T.cuatro, T.cuatro + 0.3, t));
  pill(ctx, '3 → TU POSICIÓN', 540, 930, 38, t, T.posicion21, '#2f80ed', '#ffffff');
  pill(ctx, '+1 → CORRIGE EL RELOJ DEL CELULAR', 540, 1020, 34, t, T.corregir, '#2fbf71', '#ffffff');
  tag(ctx, '1 microsegundo de error ≈ 300 metros', 540, 1110, 26, sm(T.diferencias, T.diferencias + 0.3, t), 'rgba(255,230,160,0.95)');
 }, sfx(k) { S4.forEach((_, i) => { const t0 = T.hace19 + i * 0.35; FX.senal(k, t0, 0.6, 1200 + i * 150); k.play('stroke', t0 + 0.05, { material: 'pen', dur: 0.6, gain: 0.2, minor: true }); }); FX.ubicacion(k, T.satelites19 + 0.6); FX.contador(k, T.menos, T.cuatro + 0.15, 1, 4); FX.etiqueta(k, T.posicion21); FX.etiqueta(k, T.corregir); FX.tictac(k, T.diferencias, 3, 0.25); } });
 // 7 · relatividad: el reloj del satélite adelanta ≈ 38 µs/día; sin corregir, el error crece > 10 km/día
 B.push({ t0: TB.relat, t1: TB.mapa, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  space(ctx, t);
  pill(ctx, 'ALGO MÁS SORPRENDENTE', 540, 330, 40, t, T.y23 + 0.2, '#7a6cf0', '#ffffff', T.relojes + 0.3);
  const ca = sm(T.y23 + 0.5, T.y23 + 0.9, t);
  if (ca > 0) { const base = 43200 + (t - T.relojes) * 60, drift = 9 * sm(T.relojes, T.rapidamente, t); ctx.save(); ctx.globalAlpha = ca;
   P.satellite(ctx, 290, 470, 60, 0.3); P.clock(ctx, 290, 650, 105, base + drift, { sec: '#e8505b' }); P.text(ctx, 'EN EL SATÉLITE', 290, 800, 30, '#ffffff');
   P.globe(ctx, 790, 470, 55, t * 0.2); P.clock(ctx, 790, 650, 105, base, { sec: '#2f80ed' }); P.text(ctx, 'EN LA TIERRA', 790, 800, 30, '#ffffff'); ctx.restore();
   tag(ctx, '(diferencia exagerada para verla)', 540, 845, 22, ca * 0.85); }
  const ka = sm(T.correcciones - 0.1, T.correcciones + 0.3, t);
  if (ka > 0) { ctx.save(); ctx.globalAlpha = ka; P.rr(ctx, 110, 880, 860, 210, 30, '#ffffff', { sy: 12 }); P.text(ctx, '+45 µs (menos gravedad)  −7 µs (velocidad)', 540, 930, 30, '#6a6f86'); P.text(ctx, '≈ +38 MICROSEGUNDOS AL DÍA', 540, 995, 46, '#1d1b3a', { kind: 'title' }); P.text(ctx, 'el reloj del satélite adelanta', 540, 1055, 28, '#6a6f86'); ctx.restore(); }
  pill(ctx, 'RELATIVIDAD DE EINSTEIN', 540, 330, 42, t, T.relatividad, '#ffd166', '#081426', T.sin25 + 0.2);
  // sin corrección: el punto en el mapa se aleja de tu posición real
  const ea = sm(T.sin25 - 0.1, T.sin25 + 0.3, t);
  if (ea > 0) { ctx.save(); ctx.globalAlpha = ea; ctx.beginPath(); ctx.roundRect(110, 1110, 860, 240, 26); ctx.clip(); P.mapCity(ctx, 110, 1110, 860, 240, 21, { block: 60, street: 12 }); const g = E.inOut(win(t, T.errores, T.rapidamente + 0.5)); P.dot(ctx, 330, 1240, 14, t); P.rangeCircle(ctx, 330, 1240, 30 + 260 * g, 1, '#e8505b', { fillA: 0.08, w: 5 }); P.pin(ctx, 330 + 420 * g, 1240 - 20 * g, 64, '#e8505b'); ctx.restore(); pill(ctx, 'SIN CORRECCIÓN', 540, 330, 42, t, T.sin25, '#e8505b', '#ffffff', TB.mapa - 0.2); }
  tag(ctx, 'MÁS DE 10 KM DE ERROR POR DÍA', 540, 1400, 30, sm(T.aumentarian, T.aumentarian + 0.3, t), 'rgba(255,170,160,1)');
 }, sfx(k) { FX.aparece(k, T.y23 + 0.2, 600); k.play('sparkle', T.sorprendente, { gain: 0.4, n: 6 }); FX.aparece(k, T.relojes, 520); FX.tictac(k, T.relojes + 0.2, 8, 0.5); FX.sello(k, T.correcciones); FX.sello(k, T.relatividad); FX.tachado(k, T.sin25); k.play('riser', T.errores, { dur: 2.4, gain: 0.3 }); FX.etiqueta(k, T.aumentarian); } });
 // 8 · regreso al mapa del celular: satélites a miles de kilómetros te ayudan a llegar
 const ROUTE = (x, y, w, h) => [[x + w * 0.2, y + h * 0.85], [x + w * 0.2, y + h * 0.62], [x + w * 0.55, y + h * 0.62], [x + w * 0.55, y + h * 0.4], [x + w * 0.8, y + h * 0.4], [x + w * 0.8, y + h * 0.2]];
 B.push({ t0: TB.mapa, t1: TB.cierre, in: { type: 'iris', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  space(ctx, t);
  const sa = sm(T.recuerda - 0.2, T.recuerda + 0.3, t);
  [[150, 330], [400, 270], [680, 280], [930, 340]].forEach(([x, y], i) => { if (sa <= 0) return; ctx.save(); ctx.globalAlpha = sa; P.satellite(ctx, x, y, 40, 0.3); ctx.strokeStyle = 'rgba(120,220,255,0.35)'; ctx.setLineDash([10, 12]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y + 30); ctx.lineTo(540, 640); ctx.stroke(); ctx.restore(); P.rings(ctx, x, y + 20, t + i * 0.2, { r: 60, n: 2, period: 1.2, a: sa * 0.7, dir: Math.atan2(640 - y, 540 - x), spread: 0.6, w: 3 }); });
  P.phone(ctx, 540, 1010, 380, (x, y, w, h) => { const rt = ROUTE(x, y, w, h); mapScreen(ctx, x, y, w, h, t, { route: rt, dot: false }); const L = P.path(rt), [dx, dy] = L.at(L.L * E.inOut(win(t, T.mapa, T.camino + 0.5))); P.dot(ctx, dx, dy, 14, t); P.pin(ctx, rt[rt.length - 1][0], rt[rt.length - 1][1], 60, '#e8505b'); });
  tag(ctx, 'A MILES DE KILÓMETROS SOBRE TI', 540, 470, 28, sm(T.miles - 0.1, T.miles + 0.3, t), 'rgba(255,230,160,0.95)');
 }, sfx(k) { FX.aparece(k, T.mapa, 640); k.play('pop', T.recuerda, { f: 520, gain: 0.3 }); [0, 0.3, 0.6, 0.9].forEach((d, i) => FX.senal(k, T.recuerda + d, 0.5, 1300 + i * 100)); FX.etiqueta(k, T.miles); FX.ubicacion(k, T.camino + 0.3); } });
 // 9 · cierre: «Sigue a Asombroteca»
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'iris', d: 0.6, x: 540, y: 960 }, draw(ctx, t) {
  space(ctx, t); P.globe(ctx, 540, 1700, 520, t * 0.1);
  P.withPop(ctx, t, T.sigue + 0.1, 540, 820, () => { P.rr(ctx, 110, 720, 860, 220, 40, '#ffffff', { sy: 16 }); P.text(ctx, 'ASOMBROTECA', 540, 810, 96, '#1d1b3a', { kind: 'title' }); P.text(ctx, 'la ciencia oculta de lo imposible', 540, 888, 34, '#5a5790'); });
  const press = win(t, T.asombroteca + 1.0, T.asombroteca + 1.2), done = t > T.asombroteca + 1.15;
  P.withPop(ctx, t, T.asombroteca + 0.2, 540, 1080, () => { P.rr(ctx, 330, 1030, 420, 100, 50, done ? '#2fbf71' : '#f0b90b', { sy: 10 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 1082, 44, '#1d1b3a'); });
  if (t > T.asombroteca + 0.4) P.finger(ctx, 610, lerp(1500, 1100, E.out(win(t, T.asombroteca + 0.4, T.asombroteca + 1.0))), 110, press * (1 - win(t, T.asombroteca + 1.3, T.asombroteca + 1.6)));
 }, sfx(k) { FX.sello(k, T.sigue + 0.1); FX.aparece(k, T.asombroteca + 0.2, 700); FX.clic(k, T.asombroteca + 1.15); k.play('ding', T.asombroteca + 1.2, { f: 'A5', gain: 0.3 }); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['internet', 'satélites', 'radio', 'hora', 'luz', 'basta', 'ubicación', 'Einstein', 'relatividad', 'camino', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 200, gain: 0.03, a: 1, hold: DURATION - 2 }); },
  music(k) {
   const C = [['C3', 'G3', 'E4', 'B4'], ['A2', 'E3', 'C4', 'G4'], ['F2', 'C3', 'A3', 'E4'], ['G2', 'D3', 'B3', 'D4']];
   k.music('pad', 0, T.alla, { bpm: 100, gain: 0.38, chords: C });
   k.music('pulse', T.alla, T.y23, { bpm: 108, gain: 0.22, chords: C });
   k.music('pad', T.y23, T.asi26, { bpm: 96, gain: 0.36, chords: [['D3', 'A3', 'F4', 'C5'], ['B2', 'F#3', 'D4', 'A4']] });
   k.music('pulse', T.asi26, DURATION, { bpm: 108, gain: 0.24, chords: [['F2', 'C3', 'A3', 'E4'], ['G2', 'D3', 'B3', 'D4'], ['C3', 'G3', 'E4', 'B4']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
