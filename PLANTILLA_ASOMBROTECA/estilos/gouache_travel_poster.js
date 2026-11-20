// estilos/gouache_travel_poster.js · v2.2 · «Cartel de viaje en gouache»: seis colores planos, opacos y mate, en capas que se
// alejan; el pincel seco deja vetas donde la pintura se adelgaza en los bordes; grano del papel del cartel.
// Temas: historia antigua, lugares, viajes. Transición: una mano de crema barre el cartel antes de pintar el siguiente.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#1f6f73', fondo2: '#1d2b45', objeto: '#efe2c4', objeto2: '#e8742a', detalle: '#1d2b45', sombra: '#16243a', acento: '#e3b23c', rojo: '#c8392b' };
 const tooth = () => C.textura('gouache-tooth', 270, 480, (() => { const nz = C.ruido(301), r = H.rng(7); return (x, y) => { const v = 128 + nz.n2(x * 0.35, y * 0.35) * 40 + (r() - 0.5) * 50; return [v, v, v]; }; })());
 // vetas de pincel seco: trazos finos y horizontales de un tono algo más claro u oscuro, que se cortan cerca del borde
 const pincelSeco = (ctx, f, col, sem) => { const b = C.caja(f), r = H.rng(sem), w = b[2] - b[0], h = b[3] - b[1]; ctx.save(); C.trazar(ctx, f); ctx.clip();
  for (let i = 0; i < Math.min(140, h / 3); i++) { const y = b[1] + r() * h, x0 = b[0] + r() * w * 0.3, l = w * (0.25 + r() * 0.6); ctx.strokeStyle = C.tono(col, r() < 0.5 ? 0.12 : -0.12); ctx.globalAlpha = 0.25 + r() * 0.35; ctx.lineWidth = 1 + r() * 3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + l, y + (r() - 0.5) * 6); ctx.stroke(); }
  ctx.globalAlpha = 1; ctx.strokeStyle = C.tono(col, 0.18); ctx.lineWidth = 7; ctx.setLineDash([22, 9, 6, 13]); C.trazar(ctx, f); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); };
 C.registrar('gouache_travel_poster', {
  familia: 'Pictórico', temas: 'historia antigua, lugares, viajes', paleta: PAL,
  textos: {
   titular: { fam: "'Space Grotesk', sans-serif", peso: 700, colBase: '#f6ead0', col: '#ff5a3c', borde: '#1d2b45', bordeAncho: 0.16 },
   contador: { fam: "'Space Grotesk', sans-serif", peso: 700, col: '#f6ead0', colFinal: '#e3b23c', borde: '#1d2b45', famEtiqueta: "'Space Grotesk', sans-serif", pesoEtiqueta: 700, colEtiqueta: '#f6ead0' },
   fuente: { fam: "'Space Grotesk', sans-serif", peso: 500, col: '#f6ead0', franja: 'rgba(29,43,69,0.82)' },
   cap: { fam: 'Space Grotesk', color: '#f6ead0', caja: 'rgba(29,43,69,0.72)' },
  },
  fondo(ctx, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const bandas = ['#f1c86a', '#f3d58a', '#f4e0ad', '#efe2c4']; bandas.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(0, i * 300, W, i === 3 ? HH : 300); });
   ctx.restore(); const cerro = (y, amp, col, sem) => { const r = H.rng(sem), pts = [[-40, HH]]; for (let x = -40; x <= W + 40; x += 90) pts.push([x, y - amp * (0.5 + 0.5 * Math.sin(x * 0.006 + sem)) - r() * amp * 0.25]); pts.push([W + 40, HH]); const f = { tipo: 'poli', pts }; ctx.save(); ctx.fillStyle = col; C.trazar(ctx, f); ctx.fill(); ctx.restore(); pincelSeco(ctx, f, col, sem); };
   cerro(1040, 140, '#7aa59a', 3); cerro(1120, 110, '#4f8e8a', 5); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto', col = PAL[rol] || PAL.objeto; ctx.save(); ctx.fillStyle = col; C.trazar(ctx, f); ctx.fill(); ctx.restore(); if (rol !== 'sombra') pincelSeco(ctx, f, col, Math.round(C.caja(f)[0] * 7 + C.caja(f)[1])); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; ctx.save(); ctx.strokeStyle = o.rol === 'rojo' ? '#c8392b' : o.rol === 'acento' ? '#e3b23c' : '#1d2b45'; ctx.lineWidth = (o.ancho || 6) * 1.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.punteada) ctx.setLineDash([28, 18]); C.trazarPts(ctx, q, false); ctx.stroke(); ctx.setLineDash([]);
   if (o.flecha) C.punta(ctx, q[q.length - 2], q[q.length - 1], 40, ctx.strokeStyle); ctx.restore(); },
  brillo(ctx, x, y, r) { ctx.save(); ctx.fillStyle = '#f4e0ad'; ctx.beginPath(); ctx.arc(x, y, r * 2.1, 0, TAU); ctx.fill(); ctx.fillStyle = '#f1c86a'; ctx.beginPath(); ctx.arc(x, y, r * 1.55, 0, TAU); ctx.fill(); ctx.fillStyle = '#e8742a';
   for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(a - 0.06) * r * 1.15, y + Math.sin(a - 0.06) * r * 1.15); ctx.lineTo(x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5); ctx.lineTo(x + Math.cos(a + 0.06) * r * 1.15, y + Math.sin(a + 0.06) * r * 1.15); ctx.fill(); }
   ctx.fillStyle = '#e3b23c'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); pincelSeco(ctx, { tipo: 'circulo', x, y, r }, '#e3b23c', 9); },
  acabado(ctx, t) { C.pintarTextura(ctx, tooth(), 0.22, 'overlay'); C.vineta(ctx, 0.22, '40,30,20', 0.4); C.grano(ctx, t, 0.03); },
  transicion(ctx, u, A, B) { const k = C.sm(0, 1, u < 0.5 ? u * 2 : (u - 0.5) * 2), x0 = u < 0.5 ? 0 : W * k, w = u < 0.5 ? W * k : W * (1 - k); if (u < 0.5) A(ctx); else B(ctx);
   if (w > 1) { ctx.save(); ctx.fillStyle = '#efe2c4'; ctx.fillRect(x0, 0, w, HH); ctx.restore(); pincelSeco(ctx, { tipo: 'rect', x: x0, y: 0, w, h: HH }, '#efe2c4', 21); } },
  sonidos: {
   trazo: (k, t, d = 1) => k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 900], [d, 1500]], q: 0.8, gain: 0.07, a: 0.1, hold: d * 0.7 }),
   aparece: (k, t) => k.play('thud', t, { f: 140, gain: 0.25 }),
   transicion: (k, t, d = 0.8) => k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 600], [d * 0.5, 2000], [d, 900]], q: 0.7, gain: 0.12, a: d * 0.3, hold: d * 0.4 }),
   golpe: (k, t) => k.play('stamp', t, { gain: 0.4 }),
  },
 });
})();
