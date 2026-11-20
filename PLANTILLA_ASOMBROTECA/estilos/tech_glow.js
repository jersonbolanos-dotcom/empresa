// estilos/tech_glow.js · v2.2 · «Tech Glow»: espacio azul marino a índigo con brillos eléctricos que derivan, rejilla en
// perspectiva, tarjetas de cristal oscuro con borde de neón y destello (bloom) en todo lo brillante. Temas: vehículos,
// accidentes, tecnología actual. Transición: estela de velocidad de la luz.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#0a0c33', fondo2: '#141a52', objeto: '#38e1ff', objeto2: '#8b5cff', detalle: '#9fefff', sombra: '#02030f', acento: '#ffd36a', rojo: '#ff3b6b' };
 const GLOWS = [[0.18, 0.22, 520, '56,225,255', 0.22], [0.85, 0.35, 600, '139,92,255', 0.26], [0.5, 0.78, 700, '255,79,216', 0.12], [0.1, 0.7, 460, '80,120,255', 0.18]];
 const neonGrad = (ctx, b) => { const g = ctx.createLinearGradient(b[0], b[1], b[2], b[3]); g.addColorStop(0, '#38e1ff'); g.addColorStop(1, '#a66bff'); return g; };
 C.registrar('tech_glow', {
  familia: 'Explicativos populares', temas: 'vehículos, accidentes, tecnología', paleta: PAL,
  textos: {
   titular: { fam: "'Space Grotesk', Nunito, sans-serif", peso: 700, colBase: '#ffffff', col: '#ff3b6b', borde: 'rgba(3,4,26,0.88)', bordeAncho: 0.12 },
   contador: { fam: "'Space Grotesk', Nunito, sans-serif", peso: 700, col: '#ffffff', colFinal: '#38e1ff', borde: 'rgba(3,4,26,0.85)', famEtiqueta: "'Space Grotesk', sans-serif", pesoEtiqueta: 600, colEtiqueta: '#b9c8ff' },
   fuente: { fam: "'Space Grotesk', sans-serif", peso: 500, col: '#c3ccff', franja: 'rgba(4,6,32,0.72)' },
   cap: { fam: 'Space Grotesk', color: '#ffffff', caja: 'rgba(4,6,32,0.55)' },
   brillo: { a: 0.4, r: 16 },
  },
  fondo(ctx, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createLinearGradient(0, 0, W * 0.4, HH); g.addColorStop(0, '#03041a'); g.addColorStop(0.55, '#080a2d'); g.addColorStop(1, '#140c40'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
   ctx.globalCompositeOperation = 'lighter'; GLOWS.forEach(([gx, gy, r, c, a], i) => { const x = (gx + 0.05 * Math.sin(t * 0.21 + i * 1.9)) * W, y = (gy + 0.04 * Math.cos(t * 0.17 + i * 2.7)) * HH, rg = ctx.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(${c},${a})`); rg.addColorStop(0.45, `rgba(${c},${a * 0.35})`); rg.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = rg; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); });
   ctx.globalCompositeOperation = 'source-over'; for (let y = 60; y < HH * 0.5; y += 54) { ctx.fillStyle = `rgba(150,170,255,${0.1 * (y / (HH * 0.5))})`; for (let x = 27; x < W; x += 54) ctx.fillRect(x - 1.5, y - 1.5, 3, 3); }
   const hy = HH * 0.66, sg = ctx.createLinearGradient(0, hy, 0, HH); sg.addColorStop(0, 'rgba(110,140,255,0)'); sg.addColorStop(1, 'rgba(140,170,255,0.28)'); ctx.strokeStyle = sg; ctx.lineWidth = 2; ctx.beginPath();
   for (let i = -20; i <= 20; i++) { ctx.moveTo(W / 2 + i * 20, hy); ctx.lineTo(W / 2 + i * 260, HH + 200); } const roll = (t * 0.35) % 1; for (let k = 0; k < 14; k++) { const z = Math.pow((k + roll) / 14, 2.2), y = hy + z * (HH - hy + 200); ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke(); ctx.restore(); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto', b = C.caja(f); ctx.save();
   if (rol === 'sombra') { ctx.filter = 'blur(3px)'; ctx.fillStyle = 'rgba(0,0,8,0.88)'; C.trazar(ctx, f); ctx.fill(); ctx.filter = 'none'; ctx.strokeStyle = 'rgba(56,225,255,0.35)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); return; }
   if (rol === 'acento' || rol === 'rojo') { const [cx, cy, w] = C.centro(f), rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.6); rg.addColorStop(0, rol === 'rojo' ? '#ffd0dc' : '#fff6d8'); rg.addColorStop(1, rol === 'rojo' ? '#ff3b6b' : '#ffb84a'); ctx.fillStyle = rg; ctx.shadowColor = rol === 'rojo' ? '#ff3b6b' : '#ffcc66'; ctx.shadowBlur = 40; C.trazar(ctx, f); ctx.fill(); ctx.restore(); return; }
   const fondo = rol === 'fondo' || rol === 'fondo2'; ctx.fillStyle = fondo ? 'rgba(12,16,58,0.92)' : 'rgba(14,18,60,0.86)'; C.trazar(ctx, f); ctx.fill();
   const sh = ctx.createLinearGradient(0, b[1], 0, b[3]); sh.addColorStop(0, 'rgba(120,170,255,0.18)'); sh.addColorStop(0.5, 'rgba(120,170,255,0)'); ctx.fillStyle = sh; ctx.fill();
   ctx.strokeStyle = rol === 'objeto2' ? '#a66bff' : neonGrad(ctx, b); ctx.lineWidth = fondo ? 2 : 4; ctx.shadowColor = rol === 'objeto2' ? '#8b5cff' : '#38e1ff'; ctx.shadowBlur = fondo ? 8 : 22; ctx.stroke(); ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; const w = o.ancho || 5; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
   ctx.strokeStyle = o.rol === 'rojo' ? '#ff3b6b' : '#38e1ff'; ctx.lineWidth = w * 2.4; ctx.globalAlpha = 0.25; ctx.filter = 'blur(6px)'; C.trazarPts(ctx, q, false); ctx.stroke(); ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.lineWidth = w; ctx.strokeStyle = o.rol === 'rojo' ? '#ff8fae' : '#bff6ff'; ctx.stroke();
   if (o.t != null) { const k = ((o.t * 0.6) % 1), r = C.parcial(q, k), e = r[r.length - 1]; P.resplandor(ctx, e[0], e[1], w * 7, '180,245,255', 0.9); }
   if (o.flecha) C.punta(ctx, q[q.length - 2], q[q.length - 1], w * 4, '#bff6ff'); ctx.restore(); },
  brillo(ctx, x, y, r, o = {}) { P.resplandor(ctx, x, y, r * 4.2, '255,210,120', 0.55); P.resplandor(ctx, x, y, r * 2, '255,240,200', 0.7); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,240,210,0.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - r * 3.4, y); ctx.lineTo(x + r * 3.4, y); ctx.moveTo(x, y - r * 2.2); ctx.lineTo(x, y + r * 2.2); ctx.stroke(); ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.arc(x, y, r * 0.75, 0, TAU); ctx.fill(); ctx.restore(); },
  acabado(ctx, t) { C.bloom(ctx, 0.9); C.vineta(ctx, 0.55, '2,3,20'); C.grano(ctx, t, 0.035); },
  transicion(ctx, u, A, B, L) { const e = C.sm(0, 1, u); if (u < 0.5) { ctx.save(); const s = 1 + e * 1.6; ctx.translate(W / 2, HH / 2); ctx.scale(s, s); ctx.translate(-W / 2, -HH / 2); A(ctx); ctx.restore(); } else B(ctx);
   const k = Math.sin(u * Math.PI), r = H.rng(77); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 90; i++) { const a = r() * TAU, d0 = 80 + r() * 300, d1 = d0 + (300 + r() * 900) * k; ctx.strokeStyle = `rgba(${r() < 0.5 ? '120,230,255' : '170,130,255'},${0.5 * k})`; ctx.lineWidth = 1.5 + r() * 3; ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * d0, HH / 2 + Math.sin(a) * d0); ctx.lineTo(W / 2 + Math.cos(a) * d1, HH / 2 + Math.sin(a) * d1); ctx.stroke(); } ctx.restore(); },
  sonidos: {
   aparece: (k, t) => { k.tone(t, { f: [[0, 1320], [0.12, 1760]], dur: 0.35, gain: 0.05, a: 0.004, verb: 0.35 }); k.noise(t, { dur: 0.25, filter: 'highpass', f: 5000, gain: 0.03, a: 0.01 }); },
   trazo: (k, t, d = 1) => k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 1400], [d, 4200]], q: 2, gain: 0.04, a: d * 0.4, hold: d * 0.4 }),
   transicion: (k, t, d = 0.6) => { k.play('whoosh', t, { dur: d + 0.2, top: 4200, gain: 0.4, minor: true }); k.tone(t, { f: [[0, 180], [d, 900]], dur: d, gain: 0.03, a: d * 0.6 }); },
   golpe: (k, t) => { k.play('thud', t, { f: 55, gain: 0.5 }); k.tone(t, { f: 880, dur: 0.6, gain: 0.03, a: 0.005, verb: 0.5 }); },
  },
 });
})();
