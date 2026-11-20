// estilos/flat_vector_science.js · v2.2 · «Vector plano de ciencia»: espacio azul marino a violeta, formas gruesas sin contorno
// con degradados de varias paradas, sombra en media luna, brillo de borde, halos suaves y campos de estrellas que destellan.
// Temas: cuerpo, naturaleza, ciencia. Transición: un planeta grande cruza la pantalla.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#4b2a8f', fondo2: '#2a1a66', objeto: '#4fd8ff', objeto2: '#ff8a3d', detalle: '#ffffff', sombra: '#140c3a', acento: '#ffd34d', rojo: '#ff4f7a' };
 const estrellas = (ctx, t) => { const r = H.rng(14); for (let i = 0; i < 140; i++) { const x = r() * W, y = r() * HH * 0.7, s = 1 + r() * 2.5, k = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.6 + r() * 1.4) + i)); ctx.globalAlpha = k * 0.85; ctx.fillStyle = '#ffffff'; if (s > 3) { ctx.beginPath(); ctx.moveTo(x, y - s * 3); ctx.lineTo(x + s * 0.6, y); ctx.lineTo(x, y + s * 3); ctx.lineTo(x - s * 0.6, y); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - s * 3, y); ctx.lineTo(x, y + s * 0.6); ctx.lineTo(x + s * 3, y); ctx.lineTo(x, y - s * 0.6); ctx.closePath(); ctx.fill(); } else { ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill(); } } ctx.globalAlpha = 1; };
 C.registrar('flat_vector_science', {
  familia: 'Explicativos populares', temas: 'cuerpo, naturaleza, ciencia', paleta: PAL,
  textos: {
   titular: { fam: "'Nunito', sans-serif", peso: 900, colBase: '#ffffff', col: '#ff4f7a', borde: 'rgba(14,18,64,0.92)', bordeAncho: 0.16 },
   contador: { fam: "'Nunito', sans-serif", peso: 900, col: '#ffffff', colFinal: '#ffd34d', borde: 'rgba(14,18,64,0.92)', famEtiqueta: "'Nunito', sans-serif", pesoEtiqueta: 800, colEtiqueta: '#ffffff' },
   fuente: { fam: "'Nunito', sans-serif", peso: 700, col: '#e4dcff', franja: 'rgba(14,18,64,0.72)' },
   cap: { fam: 'Nunito', color: '#ffffff', caja: 'rgba(14,18,64,0.55)' },
  },
  fondo(ctx, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#0e1240'); g.addColorStop(0.55, '#3a1f7a'); g.addColorStop(1, '#6b2fa0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); P.resplandor(ctx, 200, 500, 700, '120,90,255', 0.25); P.resplandor(ctx, 900, 1200, 800, '255,90,180', 0.15); estrellas(ctx, t); ctx.restore(); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto', col = PAL[rol] || PAL.objeto, b = C.caja(f), w = b[2] - b[0], h = b[3] - b[1]; ctx.save();
   if (rol === 'sombra') { ctx.fillStyle = 'rgba(14,8,50,0.6)'; C.trazar(ctx, f); ctx.fill(); ctx.restore(); return; }
   const g = ctx.createLinearGradient(b[0], b[1], b[2], b[3]); g.addColorStop(0, C.tono(col, 0.35)); g.addColorStop(0.5, col); g.addColorStop(1, C.tono(col, -0.3)); ctx.fillStyle = g; C.trazar(ctx, f); ctx.fill();
   ctx.save(); ctx.clip(); ctx.fillStyle = C.rgba(C.mix(col, '#140c3a', 0.55), 0.55); ctx.translate(w * 0.12, h * 0.14); C.trazar(ctx, f); ctx.fill(); ctx.restore();
   ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 6; ctx.translate(-4, -4); C.trazar(ctx, f); ctx.stroke(); ctx.restore(); ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.remuestrear(C.parcial(pts, o.p ?? 1), 20); if (q.length < 2) return; const col = o.rol === 'rojo' ? '#ff4f7a' : o.rol === 'acento' ? '#ffd34d' : '#ffffff', r = (o.ancho || 6) * 0.8; ctx.save(); ctx.fillStyle = col;
   if (o.punteada || o.rol === 'rojo') q.forEach((p) => { ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill(); }); else { ctx.strokeStyle = col; ctx.lineWidth = r * 1.6; ctx.lineCap = 'round'; C.trazarPts(ctx, q, false); ctx.stroke(); }
   if (o.flecha) C.punta(ctx, q[q.length - 2], q[q.length - 1], r * 7, col); ctx.restore(); },
  brillo(ctx, x, y, r) { P.resplandor(ctx, x, y, r * 4, '255,210,120', 0.55); ctx.save(); const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, '#fff6c2'); g.addColorStop(0.6, '#ffd34d'); g.addColorStop(1, '#ff9a3d'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.moveTo(x + r * 1.3, y - r * 1.5); ctx.lineTo(x + r * 1.42, y - r * 1.12); ctx.lineTo(x + r * 1.8, y - r * 1.0); ctx.lineTo(x + r * 1.42, y - r * 0.88); ctx.lineTo(x + r * 1.3, y - r * 0.5); ctx.lineTo(x + r * 1.18, y - r * 0.88); ctx.lineTo(x + r * 0.8, y - r * 1.0); ctx.lineTo(x + r * 1.18, y - r * 1.12); ctx.closePath(); ctx.fill(); ctx.restore(); },
  acabado(ctx, t) { C.vineta(ctx, 0.4, '14,8,50', 0.36); C.grano(ctx, t, 0.03); },
  transicion(ctx, u, A, B) { const e = C.sm(0, 1, u), cx = -500 + e * (W + 1000), cy = HH * 0.5 + (e - 0.5) * 600, r = 900; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, HH); ctx.arc(cx, cy, r, 0, TAU, true); ctx.clip(); (e < 0.5 ? A : B)(ctx); ctx.restore();
   ctx.save(); const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r); g.addColorStop(0, '#ffb3cf'); g.addColorStop(0.7, '#ff6fae'); g.addColorStop(1, '#b23a7a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 40; ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.4, r * 0.25, -0.3, 0, TAU); ctx.stroke(); ctx.restore(); },
  sonidos: {
   aparece: (k, t) => k.play('pop', t, { f: 700, gain: 0.45 }),
   transicion: (k, t, d = 0.8) => k.play('whoosh', t, { dur: d, top: 2400, gain: 0.45, minor: true }),
   golpe: (k, t) => { k.play('pop', t, { f: 300, gain: 0.5 }); k.play('thud', t, { f: 70, gain: 0.35 }); },
   trazo: (k, t, d = 0.8) => k.tone(t, { f: [[0, 520], [d, 780]], dur: d, gain: 0.025, a: d * 0.4, hold: d * 0.4, verb: 0.3 }),
  },
 });
})();
