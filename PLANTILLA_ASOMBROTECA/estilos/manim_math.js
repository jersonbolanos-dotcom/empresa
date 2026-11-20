// estilos/manim_math.js · v2.2 · «Matemáticas estilo Manim»: negro puro, vectores nítidos con antialias, paleta contenida (azul,
// verde azulado, amarillo, rojo y verde), relleno a media opacidad con el contorno lleno, ejes con marcas y serif matemática.
// Las formas se «escriben» (o.p: el contorno se traza y luego se rellena). Temas: números y escalas. Transición: transformar.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#5CD0B3', fondo2: '#83C167', objeto: '#58C4DD', objeto2: '#5CD0B3', detalle: '#ffffff', sombra: '#888888', acento: '#FFFF00', rojo: '#FC6255' };
 C.registrar('manim_math', {
  familia: 'Explicativos populares', temas: 'números, escalas, geometría', paleta: PAL,
  textos: {
   titular: { fam: "'Fraunces', serif", peso: 600, escalaX: 0.92, colBase: '#ffffff', col: '#FC6255', borde: '#000000', bordeAncho: 0.06 },
   contador: { fam: "'Fraunces', serif", peso: 600, col: '#ffffff', colFinal: '#FFFF00', borde: '#000000', bordeAncho: 0.06, famEtiqueta: "'Fraunces', serif", pesoEtiqueta: 600, colEtiqueta: '#ffffff' },
   fuente: { fam: "'Fraunces', serif", peso: 600, col: '#bbbbbb', franja: 'rgba(0,0,0,0)' },
   cap: { fam: 'Fraunces', color: '#ffffff', caja: false },
  },
  // o.plano: una cuadrícula NumberPlane tenue
  fondo(ctx, t, o = {}) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, HH); if (o.plano !== false) { ctx.strokeStyle = 'rgba(88,196,221,0.16)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 0; x <= W; x += 90) { ctx.moveTo(x, 0); ctx.lineTo(x, HH); } for (let y = 30; y <= HH; y += 90) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 1470); ctx.lineTo(W, 1470); ctx.moveTo(90, 0); ctx.lineTo(90, HH); ctx.stroke(); } ctx.restore(); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto', col = PAL[rol] || PAL.objeto, p = o.p ?? 1; ctx.save();
   const pts = C.puntos(f, 140); const q = C.parcial(pts.concat([pts[0]]), C.cl(p / 0.7)); if (p > 0.7 || p >= 1) { ctx.globalAlpha = rol === 'sombra' ? 0.7 : 0.5 * C.cl((p - 0.7) / 0.3 + (p >= 1 ? 1 : 0)); ctx.fillStyle = rol === 'sombra' ? '#000000' : col; C.trazar(ctx, f); ctx.fill(); ctx.globalAlpha = 1; }
   ctx.strokeStyle = rol === 'sombra' ? '#888888' : col; ctx.lineWidth = 5; ctx.lineJoin = 'round'; C.trazarPts(ctx, q, false); ctx.stroke(); ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; ctx.save(); ctx.strokeStyle = PAL[o.rol || 'detalle'] || '#fff'; ctx.lineWidth = o.ancho ? Math.max(3, o.ancho * 0.8) : 4; ctx.lineCap = 'round'; if (o.punteada) ctx.setLineDash([12, 12]); C.trazarPts(ctx, q, false); ctx.stroke(); ctx.setLineDash([]); if (o.flecha) C.punta(ctx, q[q.length - 2], q[q.length - 1], 30, ctx.strokeStyle); ctx.restore(); },
  brillo(ctx, x, y, r, o = {}) { ctx.save(); ctx.fillStyle = '#FFFF00'; ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, TAU); ctx.fill(); const k = ((o.t || 0) * 0.8) % 1; ctx.strokeStyle = `rgba(255,255,0,${1 - k})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r * (0.7 + k * 1.2), 0, TAU); ctx.stroke(); ctx.strokeStyle = '#FFFF00'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore(); },
  acabado() {},
  transicion(ctx, u, A, B) { const e = C.sm(0, 1, u); ctx.save(); ctx.globalAlpha = 1 - e; ctx.translate(0, -60 * e); A(ctx); ctx.restore(); ctx.save(); ctx.globalAlpha = e; ctx.translate(0, 60 * (1 - e)); B(ctx); ctx.restore(); },
  sonidos: {
   aparece: (k, t) => k.tone(t, { f: 660, dur: 0.35, gain: 0.04, a: 0.004, verb: 0.3 }),
   trazo: (k, t, d = 1) => k.tone(t, { f: [[0, 330], [d, 495]], dur: d, gain: 0.025, a: d * 0.3, hold: d * 0.5, verb: 0.3 }),
   transicion: (k, t, d = 0.6) => k.noise(t, { dur: d, color: 'pink', filter: 'lowpass', f: 900, gain: 0.05, a: d * 0.5 }),
   golpe: (k, t) => k.tone(t, { f: [[0, 220], [0.3, 110]], dur: 0.4, gain: 0.08, a: 0.004 }),
  },
 });
})();
