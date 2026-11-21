// =====================================================================================================
// episodio.js — PRUEBA del MODO HISTORIA (v2.4): «¿Qué pasa si un camión pierde los frenos en una bajada?»
// Sin voz: marcas de tiempo estimadas (16 car./s). Cifras de ejemplo SIN VERIFICAR: no publicar.
// 8 escenas (7 cambios), cada plano 4-8 s y siempre en movimiento; estilo tech_glow (vehículos); sonido v2.3.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const K = PL.kit(A, { lead: 0.2, tail: 1.2 }), { W, HH, TAU, E, lerp, wt, T, DURATION } = K;
 const S = (i) => A.segments[i].s, Se = (i) => A.segments[i].e, C01 = (v) => Math.max(0, Math.min(1, v));
 const pl = () => PL.piel(), RO = '#ff5a4f';
 const Tk = { cuarenta: wt(1, 'cuarenta'), cien: wt(2, 'cien'), calor: wt(5, 'calor:'), problema: wt(6, 'problema:'), dilata: wt(7, 'dilata,'), fondo: wt(8, 'fondo…'), carril: wt(9, 'carril'), grava: wt(10, 'grava'), hunden: wt(11, 'hunden,'), quieto: wt(13, 'quieto,'), piedras: wt(14, 'piedras') };
 // cámara de cada escena: [t, x, y, zoom]; se interpola siempre (nada quieto)
 const cam = (ctx, t, Kf) => { const v = P.camino(t, Kf.map((k) => [k[0], k[1], k[2], k[3]])); ctx.translate(540, 960); ctx.scale(v[2], v[2]); ctx.translate(-v[0], -v[1]); };
 // ---------- piezas (con la piel del estilo) ----------
 const rueda = (ctx, x, y, r, t, o = {}) => { const L = pl(); L.forma(ctx, { tipo: 'circulo', x, y, r }, { rol: 'objeto', t }); L.forma(ctx, { tipo: 'circulo', x, y, r: r * 0.55 }, { rol: 'objeto2', t }); const a = t * (o.giro ?? 8); for (let k = 0; k < 5; k++) { const b = a + (k / 5) * TAU; L.linea(ctx, [[x, y], [x + Math.cos(b) * r * 0.5, y + Math.sin(b) * r * 0.5]], { ancho: 4, t }); } if (o.calor) L.brillo(ctx, x, y, r * (0.4 + 0.5 * o.calor), { t }); };
 const camion = (ctx, x, y, s, t, o = {}) => { const L = pl(); ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang || 0); ctx.scale(s, s);
  L.forma(ctx, { tipo: 'rect', x: -420, y: -260, w: 560, h: 220, r: 10 }, { rol: 'objeto2', t }); L.forma(ctx, { tipo: 'poli', pts: [[150, -40], [150, -230], [260, -230], [320, -140], [330, -40]] }, { rol: 'objeto', t }); L.forma(ctx, { tipo: 'poli', pts: [[190, -205], [255, -205], [295, -145], [190, -145]] }, { rol: 'detalle', t });
  for (const wx of [-330, -200, 250]) rueda(ctx, wx, -20, 48, t, { giro: o.giro ?? 8, calor: o.calor || 0 }); if (o.faros) L.brillo(ctx, 330, -80, 18, { t }); ctx.restore(); };
 const ladera = (ctx, t, x0, y0, x1, y1) => { const L = pl(); L.forma(ctx, { tipo: 'poli', pts: [[x0 - 2000, y0], [x1 + 2000, y1 + (y1 - y0) * 2000 / (x1 - x0)], [x1 + 2000, 4000], [x0 - 2000, 4000]] }, { rol: 'fondo', t }); L.linea(ctx, [[x0 - 2000, y0 - (y1 - y0) * 2000 / (x1 - x0)], [x1 + 2000, y1 + (y1 - y0) * 2000 / (x1 - x0)]], { ancho: 5, t }); };
 const lineas = (ctx, t, ang, k = 1) => { ctx.save(); ctx.globalAlpha = 0.5 * k; const R = H.rng(4); ctx.strokeStyle = '#7ff3ff'; ctx.lineWidth = 3; for (let i = 0; i < 26; i++) { const y = R() * HH, x = ((R() * 1500 - t * 1600 * k) % 1500 + 1500) % 1500 - 200; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 160, y + 160 * Math.tan(ang)); ctx.stroke(); } ctx.restore(); };
 const grava = (ctx, t, x0, y0, x1, y1, n, sem) => { const R = H.rng(sem); for (let i = 0; i < n; i++) { const u = R(), x = lerp(x0, x1, u), y = lerp(y0, y1, u) + R() * 120, r = 6 + R() * 12; pl().forma(ctx, { tipo: 'circulo', x, y, r }, { rol: R() < 0.5 ? 'objeto2' : 'detalle', t }); } };
 const tambor = (ctx, t, calor, hueco) => { const L = pl(), cx = 540, cy = 1000, R0 = 330 + 26 * hueco; L.forma(ctx, { tipo: 'circulo', x: cx, y: cy, r: R0 + 40 }, { rol: 'objeto', t }); L.forma(ctx, { tipo: 'circulo', x: cx, y: cy, r: R0 }, { rol: 'fondo2', t });
  for (const s of [-1, 1]) L.forma(ctx, { tipo: 'poli', pts: [[cx - 230, cy + s * 60], [cx - 260, cy + s * 230], [cx + 260, cy + s * 230], [cx + 230, cy + s * 60]].map((q) => [q[0], cy + (q[1] - cy) * (1 - 0.06 * hueco)]) }, { rol: 'objeto2', t });
  for (let k = 0; k < 12; k++) { const b = t * 6 + (k / 12) * TAU; L.linea(ctx, [[cx + Math.cos(b) * (R0 + 10), cy + Math.sin(b) * (R0 + 10)], [cx + Math.cos(b) * (R0 + 34), cy + Math.sin(b) * (R0 + 34)]], { ancho: 4, t }); }
  if (calor > 0) { P.resplandor(ctx, cx, cy, 520, '255,90,40', 0.45 * calor); L.brillo(ctx, cx, cy - R0, 30 + 40 * calor, { t }); L.brillo(ctx, cx, cy + R0, 30 + 40 * calor, { t }); } };
 // ---------- escenas ----------
 const E1 = (ctx, t) => { pl().fondo(ctx, t); ctx.save(); cam(ctx, t, [[0, 540, 980, 1.6], [S(1), 600, 960, 1.3]]); ladera(ctx, t, 0, 1150, 1080, 1250); camion(ctx, 560, 1180, 1.1, t, { ang: 0.09, faros: 1, calor: 0.5 + 0.5 * C01(t / 5), giro: 12 }); ctx.restore(); lineas(ctx, t, 0.09, 1.2); };
 const E2 = (ctx, t) => { pl().fondo(ctx, t); ctx.save(); cam(ctx, t, [[S(1), 300, 700, 0.55], [Se(1), 1100, 900, 0.55], [S(2), 1500, 1000, 0.8], [S(3), 2100, 1180, 1.05]]); ladera(ctx, t, -1000, 400, 4000, 1700); const tx = 300 + (t - S(1)) * 160; camion(ctx, tx, 400 + (tx + 1000) * 0.26, 0.6, t, { ang: 0.255, faros: 1, giro: 14 }); ctx.restore(); lineas(ctx, t, 0.26, C01((t - S(2)) / 2)); };
 const E3 = (ctx, t) => { pl().fondo(ctx, t); ctx.save(); cam(ctx, t, [[S(3), 540, 900, 0.9], [S(4), 540, 980, 1.25]]); ladera(ctx, t, -400, 900, 1500, 1300); ctx.globalAlpha = 0.35 + 0.25 * Math.sin(t * 3); pl().linea(ctx, [[700, 1060], [1200, 760]], { ancho: 10, punteada: true, t }); ctx.globalAlpha = 1; camion(ctx, 260 + (t - S(3)) * 40, 1000, 0.55, t, { ang: 0.2, faros: 1 }); ctx.restore(); };
 const E4 = (ctx, t) => { pl().fondo(ctx, t); ctx.save(); cam(ctx, t, [[S(4), 540, 1000, 0.8], [S(5), 540, 1000, 1.0], [S(6), 640, 860, 1.6]]); tambor(ctx, t, C01((t - Tk.calor) / 4) * 0.7, 0); ctx.restore(); };
 const E5 = (ctx, t) => { pl().fondo(ctx, t); ctx.save(); cam(ctx, t, [[S(6), 540, 1000, 1.0], [S(7), 540, 980, 1.15], [S(8), 760, 760, 1.9], [S(9), 760, 760, 1.6]]); const h = C01((t - Tk.dilata + 0.3) / 1.2); tambor(ctx, t, 0.7 + 0.3 * C01((t - S(6)) / 3), h);
   if (h > 0) for (const s of [-1, 1]) pl().linea(ctx, [[540 + s * 200, 1000 - 380], [540 + s * 260, 1000 - 430]], { flecha: true, rol: 'rojo', ancho: 6, t }); ctx.restore();
   if (t > S(8)) { ctx.save(); const k = C01((t - S(8)) / 0.4); ctx.globalAlpha = k; pl().forma(ctx, { tipo: 'rect', x: 120, y: 1150, w: 840, h: 300, r: 20 }, { rol: 'fondo2', t }); const v = 60 + 60 * C01((t - S(8)) / 4); pl().linea(ctx, [[540, 1420], [540 + Math.cos(Math.PI + (v / 140) * Math.PI) * 240, 1420 + Math.sin(Math.PI + (v / 140) * Math.PI) * 240]], { ancho: 8, rol: 'rojo', t }); ctx.restore(); } };
 const E6 = (ctx, t) => { pl().fondo(ctx, t); ctx.save(); cam(ctx, t, [[S(9), 300, 1000, 0.6], [S(10), 1300, 760, 0.75], [S(11), 1500, 700, 1.2]]); ladera(ctx, t, -1000, 700, 3000, 1500); const L = pl(); L.forma(ctx, { tipo: 'poli', pts: [[900, 1080], [2300, 380], [2400, 470], [1000, 1150]] }, { rol: 'objeto2', t }); grava(ctx, t, 950, 1080, 2300, 420, 220, 5); camion(ctx, 200 + (t - S(9)) * 60, 940 + (200 + (t - S(9)) * 60 + 1000) * 0.2 - 160, 0.5, t, { ang: 0.2, faros: 1, calor: 1 }); ctx.restore(); };
 const E7 = (ctx, t) => { pl().fondo(ctx, t); ctx.save(); const u = C01((t - S(11)) / (S(13) - S(11))), x = lerp(500, 1350, 1 - Math.pow(1 - u, 2.2)); cam(ctx, t, [[S(11), x - 80, 980, 1.0], [S(12), lerp(500, 1350, 1 - Math.pow(1 - C01((S(12) - S(11)) / (S(13) - S(11))), 2.2)), 940, 1.25], [S(13), 1350, 900, 1.05]]);
   const L = pl(); L.forma(ctx, { tipo: 'poli', pts: [[-500, 1250], [3000, 760], [3000, 2200], [-500, 2200]] }, { rol: 'objeto2', t }); grava(ctx, t, -500, 1240, 3000, 760, 320, 7); const hund = 40 * u; camion(ctx, x, 1250 - (x + 500) * 0.14 + hund, 0.75, t, { ang: -0.14, giro: 10 * (1 - u), calor: 1 - u });
   const Rr = H.rng(9); for (let i = 0; i < 24; i++) { const a = Rr() * Math.PI, sp = (1 - u) * 260; L.forma(ctx, { tipo: 'circulo', x: x - 200 + Math.cos(a) * sp * ((t * 2 + Rr()) % 1), y: 1200 - (x + 500) * 0.14 - Math.sin(a) * sp * ((t * 2 + Rr()) % 1), r: 8 }, { rol: 'detalle', t }); } ctx.restore(); };
 const E8 = (ctx, t) => { pl().fondo(ctx, t); ctx.save(); cam(ctx, t, [[S(13), 1350, 900, 1.3], [S(14), 1300, 860, 1.0], [S(15), 1250, 820, 0.85]]); const L = pl(); L.forma(ctx, { tipo: 'poli', pts: [[-500, 1250], [3000, 760], [3000, 2200], [-500, 2200]] }, { rol: 'objeto2', t }); grava(ctx, t, -500, 1240, 3000, 760, 320, 7); camion(ctx, 1350, 1250 - 1850 * 0.14 + 40, 0.75, t, { ang: -0.14, giro: 0 });
   ctx.globalAlpha = 0.4 * (1 - C01((t - S(13)) / 5)); P.particulas(ctx, t, { tipo: 'polvo', n: 50, area: [700, 700, 2000, 1100], a: 0.6 }); ctx.restore(); };
 const E9 = (ctx, t) => { pl().fondo(ctx, t); ctx.save(); cam(ctx, t, [[S(15), 900, 900, 0.42], [DURATION, 1100, 860, 0.5]]); ladera(ctx, t, -2000, 300, 4000, 1900); const L = pl(); L.forma(ctx, { tipo: 'poli', pts: [[900, 1310], [2300, 610], [2400, 700], [1000, 1380]] }, { rol: 'objeto2', t }); grava(ctx, t, 950, 1310, 2300, 650, 160, 5); camion(ctx, 1500, 1060, 0.5, t, { ang: -0.45, giro: 0 }); ctx.restore(); };
 // ---------- beats: 8 escenas (7 cambios) ----------
 const TIT = (ctx, s, t, t0, t1, clave, px = 96, y = 560) => P.titular(ctx, s, 540, y, t, t0, t1, { px, clave, col: RO });
 const CNT = (ctx, t, v, t0, t1, o) => { t0 -= 0.3; if (t < t0 || t > t1) return; const a = 1 - C01((t - t1 + 0.25) / 0.25); P.contador(ctx, t, 540, 620, v, Object.assign({ t0, px: 112, final: v, a }, o)); if (t > t0 + 0.2) P.fuenteCifra(ctx, 'Cifra de ejemplo · PRUEBA, sin verificar', 540, 790, { a: 0.92 * a }); };
 const ES = [[0, S(1), E1], [S(1), S(3), E2], [S(3), S(4), E3], [S(4), S(6), E4], [S(6), S(9), E5], [S(9), S(11), E6], [S(11), S(13), E7], [S(13), S(15), E8], [S(15), DURATION, E9]];
 // (E3 dura 4,4 s y sigue a E2 con la misma ladera: se une a ella con un fundido, sin corte → 8 escenas)
 const B = ES.map(([t0, t1, fn], i) => ({ t0: i === 0 ? 0 : t0 - 0.05, t1: i === ES.length - 1 ? DURATION : t1 - 0.05, in: { type: i === 0 ? 'cut' : i === 2 ? 'fade' : 'piel', d: i === 2 ? 0.5 : 0.6 }, draw(ctx, t) {
  fn(ctx, t);
  if (i === 0) TIT(ctx, '¿SIN FRENOS?', t, -0.3, S(1) - 0.2, 'FRENOS?', 110);
  if (i === 1) { CNT(ctx, t, 40, Tk.cuarenta, Se(1), { unidad: 'T', etiqueta: 'UN CAMIÓN CARGADO' }); CNT(ctx, t, 100, Tk.cien, Se(2), { unidad: 'KM/H', etiqueta: 'SIN FRENOS, EN POCOS KM' }); }
  if (i === 2) TIT(ctx, 'NO ES LO QUE IMAGINAS', t, S(3), Se(3) + 0.2, 'IMAGINAS', 76);
  if (i === 3) TIT(ctx, 'VELOCIDAD = CALOR', t, Tk.calor - 0.2, Se(5), 'CALOR', 84);
  if (i === 4) TIT(ctx, 'EL TAMBOR SE DILATA', t, Tk.dilata - 0.2, Se(7), 'DILATA', 76);
  if (i === 5) TIT(ctx, 'RAMPA DE GRAVA', t, Tk.grava - 0.3, Se(10), 'GRAVA', 96);
  if (i === 7) TIT(ctx, 'LA GRAVA LO FRENA', t, S(14), Se(14), 'GRAVA', 80);
  if (i === 8) { TIT(ctx, '¿TE METERÍAS?', t, S(15), 0, 'METERÍAS?', 100); if (t > DURATION - 1.2) P.marca(ctx, t, DURATION - 0.9); }
 }, sfx(k) {
  const d = (t1 - t0); if (d > 1.5) { k.noise(t0 + 0.1, { dur: d - 0.3, color: 'pink', filter: 'bandpass', f: i >= 3 && i <= 4 ? 300 : 600, q: 0.6, gain: 0.008, a: 1.2, hold: d - 1.9 }); }   // fondo muy suave por escena (v2.3)
  if (i === 0) k.noise(1.2, { dur: 1.0, filter: 'bandpass', f: 3000, q: 4, gain: 0.08, a: 0.05, hold: 0.6 });   // chirrido de frenos
  if (i === 1) { k.play('thud', Tk.cuarenta + 0.35, { f: 60, gain: 0.35 }); k.play('thud', Tk.cien + 0.35, { f: 60, gain: 0.35 }); }
  if (i === 4) FX.clave(k, Tk.dilata);
  if (i === 6) k.noise(S(11) + 0.2, { dur: 3, color: 'pink', filter: 'lowpass', f: 900, gain: 0.08, a: 0.2, hold: 2 });   // la grava (un sonido continuo)
  if (i === 7) FX.clave(k, Tk.quieto);
 } }));

 const EP = PL.make({ estilo: 'tech_glow', modo: 'historia', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B, capOcultar: [[0, S(1) - 0.05]] });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
