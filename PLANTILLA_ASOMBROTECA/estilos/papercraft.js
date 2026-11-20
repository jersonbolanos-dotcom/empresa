// estilos/papercraft.js · v2.2 · «Maquetas de cartulina»: modelos de caras planas impresas con líneas de pliegue punteadas,
// pestañas de pegamento y finas costuras, con volumen (cara de arriba más clara, canto más oscuro) y luz cálida, sobre una
// alfombrilla de corte verde con cuadrícula. Temas: cuerpo, objetos, cómo se construye algo. Transición: la hoja se pliega.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#e9e2cf', fondo2: '#cfc5ab', objeto: '#f4efe2', objeto2: '#3d6fb6', detalle: '#2a2a2a', sombra: '#0e3a26', acento: '#f2a33a', rojo: '#d9322b' };
 const alfombra = () => C.cache('pc-alfombra', () => { const c = H.layer(W, HH), g = c.getContext('2d'); g.fillStyle = '#1f6e4a'; g.fillRect(0, 0, W, HH); const r = H.rng(5); for (let i = 0; i < 2500; i++) { g.fillStyle = r() < 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)'; g.fillRect(r() * W, r() * HH, 2 + r() * 4, 2 + r() * 4); }
  g.strokeStyle = 'rgba(220,255,230,0.18)'; g.lineWidth = 1.5; g.beginPath(); for (let x = 0; x <= W; x += 45) { g.moveTo(x, 0); g.lineTo(x, HH); } for (let y = 0; y <= HH; y += 45) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke(); g.strokeStyle = 'rgba(220,255,230,0.35)'; g.lineWidth = 2.5; g.beginPath(); for (let x = 0; x <= W; x += 225) { g.moveTo(x, 0); g.lineTo(x, HH); } for (let y = 0; y <= HH; y += 225) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke();
  g.strokeStyle = 'rgba(255,240,200,0.5)'; g.lineWidth = 2; g.setLineDash([4, 10]); g.beginPath(); g.moveTo(0, 0); g.lineTo(W, HH * 0.56); g.stroke(); g.setLineDash([]);
  // herramientas en los bordes: lápiz y barra de pegamento
  g.save(); g.translate(120, HH - 210); g.rotate(-0.5); g.fillStyle = '#f2c14e'; g.fillRect(-160, -16, 280, 32); g.fillStyle = '#e8b8a0'; g.beginPath(); g.moveTo(120, -16); g.lineTo(170, 0); g.lineTo(120, 16); g.fill(); g.fillStyle = '#2a2a2a'; g.beginPath(); g.moveTo(155, -5); g.lineTo(170, 0); g.lineTo(155, 5); g.fill(); g.restore();
  g.save(); g.translate(W - 110, 230); g.rotate(0.4); g.fillStyle = '#e9e9f2'; g.fillRect(-36, -150, 72, 230); g.fillStyle = '#7a4fd6'; g.fillRect(-38, -170, 76, 60); g.restore(); return c; });
 const pliegues = (ctx, pts, ins) => { ctx.save(); ctx.setLineDash([6, 8]); ctx.strokeStyle = 'rgba(40,40,40,0.35)'; ctx.lineWidth = 2; const b = C.caja({ tipo: 'poli', pts }), cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2; ctx.beginPath(); pts.forEach((q, i) => { const x = q[0] + (cx - q[0]) * ins, y = q[1] + (cy - q[1]) * ins; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.stroke(); ctx.restore(); };
 const pieza = (ctx, f, col, o = {}) => { const pts = C.puntos(f, 48), b = C.caja(f), alto = o.alto ?? Math.min(26, (b[3] - b[1]) * 0.18);
  ctx.save(); ctx.fillStyle = 'rgba(6,30,18,0.4)'; ctx.filter = 'blur(10px)'; ctx.translate(10, alto + 12); C.trazarPts(ctx, pts); ctx.fill(); ctx.restore();
  ctx.save(); ctx.fillStyle = C.tono(col, -0.28); ctx.translate(0, alto); C.trazarPts(ctx, pts); ctx.fill(); ctx.restore();
  ctx.save(); ctx.fillStyle = C.tono(col, -0.22); for (let i = 0; i < pts.length; i++) { const a = pts[i], c2 = pts[(i + 1) % pts.length]; if (c2[0] - a[0] > 0 && (a[1] + c2[1]) / 2 > (b[1] + b[3]) / 2 - 1) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(c2[0], c2[1]); ctx.lineTo(c2[0], c2[1] + alto); ctx.lineTo(a[0], a[1] + alto); ctx.closePath(); ctx.fill(); } } ctx.restore();
  ctx.save(); const g = ctx.createLinearGradient(b[0], b[1], b[2], b[3]); g.addColorStop(0, C.tono(col, 0.18)); g.addColorStop(1, C.tono(col, -0.08)); ctx.fillStyle = g; C.trazarPts(ctx, pts); ctx.fill(); ctx.strokeStyle = 'rgba(30,30,30,0.6)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore(); pliegues(ctx, pts, 0.12);
  if (o.pestana !== false && b[2] - b[0] > 120) { ctx.save(); ctx.fillStyle = C.tono(col, 0.25); ctx.strokeStyle = 'rgba(30,30,30,0.4)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(b[2] - 6, b[1] + 20); ctx.lineTo(b[2] + 22, b[1] + 34); ctx.lineTo(b[2] + 22, b[1] + 70); ctx.lineTo(b[2] - 6, b[1] + 84); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); } };
 C.registrar('papercraft', {
  familia: 'Explicativos populares', temas: 'cuerpo, objetos, cómo se construye', paleta: PAL,
  textos: {
   titular: { fam: "'Space Grotesk', sans-serif", peso: 700, colBase: '#fdf8ec', col: '#ff4a3a', borde: '#123d29', bordeAncho: 0.16 },
   contador: { fam: "'Space Grotesk', sans-serif", peso: 700, col: '#fdf8ec', colFinal: '#f2c14e', borde: '#123d29', famEtiqueta: "'Space Grotesk', sans-serif", pesoEtiqueta: 600, colEtiqueta: '#fdf8ec' },
   fuente: { fam: "'Nunito', sans-serif", peso: 700, col: '#fdf8ec', franja: 'rgba(14,50,32,0.8)' },
   cap: { fam: 'Nunito', color: '#ffffff', caja: 'rgba(10,40,25,0.6)' },
  },
  fondo(ctx) { C.pintarTextura(ctx, alfombra()); P.resplandor(ctx, 200, 300, 1300, '255,230,180', 0.18); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto'; if (rol === 'sombra') { ctx.save(); ctx.fillStyle = 'rgba(6,30,18,0.5)'; ctx.filter = 'blur(5px)'; C.trazar(ctx, f); ctx.fill(); ctx.restore(); return; } pieza(ctx, f, PAL[rol] || PAL.objeto, { alto: rol === 'fondo' || rol === 'fondo2' ? 8 : undefined, pestana: rol !== 'fondo' && rol !== 'fondo2' }); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; const w = (o.ancho || 6) * 2.6, col = o.rol === 'rojo' ? '#d9322b' : o.rol === 'acento' ? '#f2a33a' : '#f4efe2';
   ctx.save(); ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; ctx.strokeStyle = 'rgba(6,30,18,0.35)'; ctx.lineWidth = w; C.trazarPts(ctx, q.map((p) => [p[0] + 5, p[1] + 7]), false); ctx.stroke(); ctx.strokeStyle = col; C.trazarPts(ctx, q, false); ctx.stroke(); ctx.setLineDash([5, 7]); ctx.strokeStyle = 'rgba(40,40,40,0.4)'; ctx.lineWidth = 1.6; ctx.stroke(); ctx.setLineDash([]); if (o.flecha) C.punta(ctx, q[q.length - 2], q[q.length - 1], w * 2.2, col); ctx.restore(); },
  brillo(ctx, x, y, r) { pieza(ctx, { tipo: 'circulo', x, y, r }, '#f2c14e', { alto: 10, pestana: false }); ctx.save(); ctx.fillStyle = '#f2a33a'; for (let i = 0; i < 10; i++) { const a = (i / 10) * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(a - 0.12) * r * 1.2, y + Math.sin(a - 0.12) * r * 1.2); ctx.lineTo(x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75); ctx.lineTo(x + Math.cos(a + 0.12) * r * 1.2, y + Math.sin(a + 0.12) * r * 1.2); ctx.fill(); } ctx.restore(); },
  acabado(ctx, t) { C.vineta(ctx, 0.35, '4,24,14', 0.36); C.grano(ctx, t, 0.03); },
  transicion(ctx, u, A, B) { const e = C.sm(0, 1, u); if (e < 0.5) { const s = Math.cos(e * Math.PI); ctx.save(); ctx.translate(W / 2, 0); ctx.scale(s, 1); ctx.translate(-W / 2, 0); A(ctx); ctx.restore(); ctx.save(); ctx.fillStyle = `rgba(0,0,0,${0.5 * (1 - s)})`; ctx.fillRect(W / 2 - (W / 2) * s, 0, W * s, HH); ctx.restore(); } else { const s = -Math.cos(e * Math.PI); ctx.save(); ctx.translate(W / 2, 0); ctx.scale(Math.max(0.001, s), 1); ctx.translate(-W / 2, 0); B(ctx); ctx.restore(); } },
  sonidos: {
   aparece: (k, t) => k.noise(t, { dur: 0.1, filter: 'bandpass', f: 2200, q: 2, gain: 0.12, a: 0.003 }),
   transicion: (k, t, d = 0.6) => { k.noise(t, { dur: d, filter: 'bandpass', f: [[0, 1500], [d, 2600]], q: 1.4, gain: 0.07, a: d * 0.4 }); k.noise(t + d * 0.5, { dur: 0.08, filter: 'bandpass', f: 2000, q: 2, gain: 0.12, a: 0.003 }); },
   golpe: (k, t) => k.play('thud', t, { f: 100, gain: 0.35 }),
   trazo: (k, t, d = 0.8) => k.noise(t, { dur: d, filter: 'bandpass', f: 1800, q: 2, gain: 0.04, a: 0.08, hold: d * 0.6 }),
  },
 });
})();
