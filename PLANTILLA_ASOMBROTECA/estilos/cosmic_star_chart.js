// estilos/cosmic_star_chart.js · v2.2 · «Carta celeste cósmica»: espacio profundo con nebulosas (verde azulado, violeta, rosa, oro),
// estrellas con picos de difracción y, encima, el grabado de un atlas celeste en filete dorado y cian pálido: anillo de grados,
// órbitas punteadas con flechas, marcadores y versalitas espaciadas. Temas: espacio. Transición: estela de salto.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const ORO = '#d9b45a', CIAN = '#bfe8ff';
 const PAL = { fondo: '#2ec4b6', fondo2: '#7b4fd6', objeto: '#7b8fd6', objeto2: '#d9b45a', detalle: ORO, sombra: '#05060f', acento: '#ffe7a8', rojo: '#ff5b5b' };
 const nebulosa = () => C.textura('nebulosa', 270, 480, (() => { const nz = C.ruido(901), nz2 = C.ruido(902); const cols = [[46, 196, 182], [123, 79, 214], [224, 96, 154], [217, 180, 90]]; return (x, y) => { const a = C.cl(nz.fbm2(x * 0.012, y * 0.012, 5) * 1.6 + 0.1), b = C.cl(nz2.fbm2(x * 0.02 + 5, y * 0.02, 4) * 1.4), c = C.cl(nz.fbm2(x * 0.03 + 11, y * 0.025, 3) * 1.5 - 0.2);
  const base = [5, 6, 15], m = (col, k) => col.map((v, i) => v * k); const r = base.map((v, i) => v + m(cols[0], a * 0.55)[i] + m(cols[1], b * 0.5)[i] + m(cols[2], c * 0.35)[i] + m(cols[3], a * c * 0.3)[i]); return r.map((v) => Math.min(255, v)); }; })());
 const pico = (ctx, x, y, r, a = 1) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; P.resplandor(ctx, x, y, r * 3, '255,240,210', 0.5 * a); ctx.strokeStyle = `rgba(255,245,225,${0.7 * a})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - r * 5, y); ctx.lineTo(x + r * 5, y); ctx.moveTo(x, y - r * 5); ctx.lineTo(x, y + r * 5); ctx.stroke(); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - r * 2, y - r * 2); ctx.lineTo(x + r * 2, y + r * 2); ctx.moveTo(x - r * 2, y + r * 2); ctx.lineTo(x + r * 2, y - r * 2); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, TAU); ctx.fill(); ctx.restore(); };
 const carta = () => C.cache('cosmos-carta', () => { const c = H.layer(W, HH), g = c.getContext('2d'); g.strokeStyle = 'rgba(217,180,90,0.45)'; g.lineWidth = 1.6; const cx = W / 2, cy = 1050, R = 760; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke(); g.beginPath(); g.arc(cx, cy, R - 28, 0, TAU); g.stroke();
  for (let i = 0; i < 360; i += 5) { const a = (i / 180) * Math.PI, l = i % 30 === 0 ? 26 : i % 10 === 0 ? 16 : 8; g.beginPath(); g.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.lineTo(cx + Math.cos(a) * (R - l), cy + Math.sin(a) * (R - l)); g.stroke(); }
  g.strokeStyle = 'rgba(191,232,255,0.3)'; g.setLineDash([3, 9]); for (const [rx, ry, rot] of [[620, 210, -0.25], [470, 150, -0.25], [300, 96, -0.25]]) { g.beginPath(); g.ellipse(cx, cy, rx, ry, rot, 0, TAU); g.stroke(); } g.setLineDash([]); return c; });
 C.registrar('cosmic_star_chart', {
  familia: 'Cósmico', temas: 'espacio, cielo, astronomía', paleta: PAL,
  textos: {
   titular: { fam: "'Fraunces', serif", peso: 600, escalaX: 0.86, espaciado: '3px', colBase: '#f3e6c4', col: '#ff6b6b', borde: 'rgba(5,6,15,0.88)', bordeAncho: 0.12 },
   contador: { fam: "'Fraunces', serif", peso: 600, col: '#f3e6c4', colFinal: '#d9b45a', borde: 'rgba(5,6,15,0.88)', famEtiqueta: "'Fraunces', serif", pesoEtiqueta: 600, colEtiqueta: '#bfe8ff' },
   fuente: { fam: "'Fraunces', serif", peso: 600, col: '#e9dcb8', franja: 'rgba(5,6,15,0.72)' },
   cap: { fam: 'Fraunces', color: '#f3e6c4', caja: 'rgba(5,6,15,0.55)' },
   brillo: { a: 0.3, r: 12 },
  },
  fondo(ctx, t) { C.pintarTextura(ctx, nebulosa()); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const r = H.rng(31); for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * HH, s = Math.pow(r(), 3) * 3 + 0.6; ctx.globalAlpha = (0.4 + 0.6 * Math.abs(Math.sin(t * (0.5 + r()) + i))) * 0.9; ctx.fillStyle = r() < 0.2 ? '#ffd8a0' : '#ffffff'; ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill(); } ctx.restore();
   pico(ctx, 180, 380, 6, 0.9); pico(ctx, 960, 1520, 5, 0.7); C.pintarTextura(ctx, carta()); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto', col = PAL[rol] || PAL.objeto, b = C.caja(f); ctx.save();
   if (rol === 'sombra') { ctx.fillStyle = 'rgba(2,3,10,0.82)'; C.trazar(ctx, f); ctx.fill(); ctx.restore(); return; }
   if (f.tipo === 'circulo' || f.tipo === 'elipse') { const [cx, cy, w, h] = C.centro(f), g = ctx.createRadialGradient(cx - w * 0.25, cy - h * 0.3, Math.min(w, h) * 0.05, cx, cy, Math.max(w, h) * 0.6); g.addColorStop(0, C.tono(col, 0.45)); g.addColorStop(0.55, col); g.addColorStop(1, C.tono(col, -0.75)); ctx.fillStyle = g; C.trazar(ctx, f); ctx.fill(); ctx.strokeStyle = 'rgba(191,232,255,0.5)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); return; }
   ctx.fillStyle = C.rgba(col, rol === 'fondo' || rol === 'fondo2' ? 0.16 : 0.32); C.trazar(ctx, f); ctx.fill(); ctx.strokeStyle = ORO; ctx.lineWidth = 2.4; ctx.stroke(); ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; ctx.save(); ctx.strokeStyle = o.rol === 'rojo' ? '#ff6b6b' : o.rol === 'detalle' ? 'rgba(217,180,90,0.9)' : CIAN; ctx.lineWidth = Math.max(2, (o.ancho || 4) * 0.5); if (o.punteada) ctx.setLineDash([3, 10]); C.trazarPts(ctx, q, false); ctx.stroke(); ctx.setLineDash([]);
   if (o.flecha) { const a = q[q.length - 2], e = q[q.length - 1], ang = Math.atan2(e[1] - a[1], e[0] - a[0]); ctx.beginPath(); ctx.moveTo(e[0] - Math.cos(ang - 0.6) * 22, e[1] - Math.sin(ang - 0.6) * 22); ctx.lineTo(e[0], e[1]); ctx.lineTo(e[0] - Math.cos(ang + 0.6) * 22, e[1] - Math.sin(ang + 0.6) * 22); ctx.stroke(); ctx.beginPath(); ctx.arc(e[0], e[1], 14, 0, TAU); ctx.stroke(); } ctx.restore(); },
  brillo(ctx, x, y, r) { P.resplandor(ctx, x, y, r * 4, '255,220,160', 0.5); pico(ctx, x, y, r * 0.45, 1); ctx.save(); ctx.strokeStyle = ORO; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * 1.4, 0, TAU); ctx.stroke(); ctx.setLineDash([2, 6]); ctx.beginPath(); ctx.arc(x, y, r * 1.9, 0, TAU); ctx.stroke(); ctx.restore(); },
  acabado(ctx, t) { C.bloom(ctx, 0.55); C.vineta(ctx, 0.55, '2,2,8', 0.34); C.grano(ctx, t, 0.03); },
  transicion(ctx, u, A, B) { (u < 0.5 ? A : B)(ctx); const k = Math.sin(u * Math.PI), r = H.rng(9); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 120; i++) { const a = r() * TAU, d0 = r() * 400, d1 = d0 + 1400 * k; ctx.strokeStyle = `rgba(${r() < 0.5 ? '191,232,255' : '217,180,90'},${0.6 * k})`; ctx.lineWidth = 1 + r() * 2; ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * d0, HH / 2 + Math.sin(a) * d0); ctx.lineTo(W / 2 + Math.cos(a) * d1, HH / 2 + Math.sin(a) * d1); ctx.stroke(); } ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = `rgba(255,255,255,${Math.max(0, k - 0.75) * 2})`; ctx.fillRect(0, 0, W, HH); ctx.restore(); },
  sonidos: {
   aparece: (k, t) => k.tone(t, { f: 1760, dur: 1.2, gain: 0.03, a: 0.004, verb: 0.6 }),
   trazo: (k, t, d = 1.5) => { k.noise(t, { dur: d, color: 'pink', filter: 'lowpass', f: 1200, gain: 0.04, a: d * 0.4, hold: d * 0.3 }); k.tone(t, { f: 'A3', dur: d, gain: 0.02, a: d * 0.4, hold: d * 0.3, verb: 0.5 }); },
   transicion: (k, t, d = 0.8) => k.play('riser', t - d * 0.6, { dur: d, gain: 0.3 }),
   golpe: (k, t) => { k.tone(t, { f: [[0, 90], [1, 45]], dur: 1.2, gain: 0.09, a: 0.01, verb: 0.4 }); },
  },
 });
})();
