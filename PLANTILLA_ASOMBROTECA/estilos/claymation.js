// estilos/claymation.js · v2.2 · «Plastilina»: piezas de barro hechas a mano, con el contorno irregular que «hierve» a 12
// imágenes por segundo, brillo céreo, huellas de dedos y marcas de herramienta, sobre un decorado de barro con poca
// profundidad de campo. Temas: cuerpo, naturaleza, humor. Transición: la pieza se cae y entra la siguiente con aplastamiento.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#c8743a', fondo2: '#a85a2c', objeto: '#e6cfa0', objeto2: '#8a7a68', detalle: '#5a4030', sombra: '#3b2a20', acento: '#ffcf3a', rojo: '#d8392b' };
 const pared = () => C.textura('clay-pared', 270, 480, (() => { const nz = C.ruido(611); return (x, y) => { const v = nz.fbm2(x * 0.03, y * 0.03, 4), b = nz.n2(x * 0.15, y * 0.15) * 0.4; const L = 1 + v * 0.12 + b * 0.05; return [47 * L, 127 * L, 134 * L]; }; })());
 const fase = (t) => Math.floor((t || 0) * 12);   // «en dos»: la forma cambia 12 veces por segundo
 const barro = (ctx, f, col, o = {}) => { const b = C.caja(f), cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, w = b[2] - b[0], h = b[3] - b[1], sem = Math.round(b[0] * 3 + b[1]);
  const pts = C.deformar(C.puntos(f, 120), Math.min(w, h) * 0.035 + 2, sem, fase(o.t), 3);
  ctx.save(); ctx.fillStyle = 'rgba(30,18,10,0.35)'; ctx.filter = 'blur(10px)'; ctx.beginPath(); ctx.ellipse(cx + w * 0.04, b[3] + 6, w * 0.48, Math.max(10, h * 0.08), 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.save(); C.trazarPts(ctx, pts); const g = ctx.createRadialGradient(cx - w * 0.22, cy - h * 0.28, Math.min(w, h) * 0.05, cx, cy, Math.max(w, h) * 0.7); g.addColorStop(0, C.tono(col, 0.32)); g.addColorStop(0.55, col); g.addColorStop(1, C.tono(col, -0.32)); ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = C.tono(col, -0.45); ctx.globalAlpha = 0.55; ctx.lineWidth = Math.min(w, h) * 0.08; ctx.filter = 'blur(6px)'; C.trazarPts(ctx, pts.map((q) => [q[0] + w * 0.02, q[1] + h * 0.04])); ctx.stroke(); ctx.filter = 'none';
   const r = H.rng(sem + fase(o.t) % 2); ctx.globalAlpha = 0.18; ctx.strokeStyle = C.tono(col, -0.4); ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { const fx = b[0] + w * (0.2 + r() * 0.6), fy = b[1] + h * (0.2 + r() * 0.6); for (let k = 1; k < 6; k++) { ctx.beginPath(); ctx.ellipse(fx, fy, k * 5, k * 3.6, r() * 3, 0.3, 2.6); ctx.stroke(); } }
   ctx.globalAlpha = 0.5; ctx.fillStyle = '#fffaf0'; ctx.filter = 'blur(4px)'; ctx.beginPath(); ctx.ellipse(cx - w * 0.2, cy - h * 0.25, Math.max(6, w * 0.08), Math.max(4, h * 0.05), -0.5, 0, TAU); ctx.fill(); ctx.restore();
  ctx.strokeStyle = C.tono(col, -0.5); ctx.lineWidth = 2.5; C.trazarPts(ctx, pts); ctx.stroke(); ctx.restore(); };
 C.registrar('claymation', {
  familia: 'Papel y manualidades', temas: 'cuerpo, naturaleza, animales', paleta: PAL,
  textos: {
   titular: { fam: "'Fredoka', Nunito, sans-serif", peso: 700, colBase: '#f6e7c4', col: '#e8402e', borde: '#3b2a20', bordeAncho: 0.16 },
   contador: { fam: "'Fredoka', Nunito, sans-serif", peso: 700, col: '#f6e7c4', colFinal: '#ffcf3a', borde: '#3b2a20', famEtiqueta: "'Fredoka', Nunito, sans-serif", pesoEtiqueta: 700, colEtiqueta: '#f6e7c4' },
   fuente: { fam: "'Nunito', sans-serif", peso: 700, col: '#f6e7c4', franja: 'rgba(59,42,32,0.78)' },
   cap: { fam: 'Fredoka', color: '#fff6e4', caja: 'rgba(59,42,32,0.62)' },
  },
  fondo(ctx, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'blur(3px)'; C.pintarTextura(ctx, pared()); ctx.filter = 'none'; const L = P.resplandor; L(ctx, 300, 500, 900, '255,236,200', 0.22);
   const mesa = C.deformar(C.puntos({ tipo: 'rect', x: -60, y: 1250, w: W + 120, h: 800 }, 120), 14, 9, fase(t), 4); const g = ctx.createLinearGradient(0, 1250, 0, HH); g.addColorStop(0, '#d98a4a'); g.addColorStop(1, '#9c5228'); ctx.fillStyle = g; C.trazarPts(ctx, mesa); ctx.fill(); ctx.restore(); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto'; if (rol === 'sombra') { ctx.save(); ctx.fillStyle = 'rgba(40,24,14,0.45)'; ctx.filter = 'blur(8px)'; C.trazar(ctx, f); ctx.fill(); ctx.restore(); return; } barro(ctx, f, PAL[rol] || PAL.objeto, o); },
  linea(ctx, pts, o = {}) { const q = C.parcial(C.remuestrear(pts, 10), o.p ?? 1); if (q.length < 2) return; const w = (o.ancho || 6) * 2.4, col = o.rol === 'rojo' ? '#d8392b' : o.rol === 'acento' ? '#ffcf3a' : '#5a4030', nz = C.ruido(4), ph = fase(o.t); const qq = q.map((p, i) => [p[0] + nz.n2(i * 0.3, ph) * 3, p[1] + nz.n2(i * 0.3 + 9, ph) * 3]);
   ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.punteada) { ctx.fillStyle = col; qq.forEach((p, i) => { if (i % 3 === 0) { ctx.beginPath(); ctx.arc(p[0], p[1], w * 0.45, 0, TAU); ctx.fill(); } }); } else { ctx.strokeStyle = C.tono(col, -0.4); ctx.lineWidth = w; C.trazarPts(ctx, qq.map((p) => [p[0] + 2, p[1] + 4]), false); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = w * 0.9; C.trazarPts(ctx, qq, false); ctx.stroke(); ctx.strokeStyle = C.tono(col, 0.35); ctx.lineWidth = w * 0.25; C.trazarPts(ctx, qq.map((p) => [p[0] - w * 0.15, p[1] - w * 0.18]), false); ctx.stroke(); }
   if (o.flecha) barro(ctx, { tipo: 'poli', pts: (() => { const a = qq[qq.length - 2], e = qq[qq.length - 1], ang = Math.atan2(e[1] - a[1], e[0] - a[0]); return [[e[0] + Math.cos(ang) * w, e[1] + Math.sin(ang) * w], [e[0] + Math.cos(ang + 2.4) * w * 1.6, e[1] + Math.sin(ang + 2.4) * w * 1.6], [e[0] + Math.cos(ang - 2.4) * w * 1.6, e[1] + Math.sin(ang - 2.4) * w * 1.6]]; })() }, col, o); ctx.restore(); },
  brillo(ctx, x, y, r, o = {}) { P.resplandor(ctx, x, y, r * 3, '255,220,140', 0.3); for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; barro(ctx, { tipo: 'elipse', x: x + Math.cos(a) * r * 1.5, y: y + Math.sin(a) * r * 1.5, rx: r * 0.32, ry: r * 0.18, rot: a }, '#ffb33a', o); } barro(ctx, { tipo: 'circulo', x, y, r }, '#ffcf3a', o); },
  acabado(ctx, t) { C.vineta(ctx, 0.45, '30,18,10', 0.34); C.grano(ctx, t, 0.04); },
  transicion(ctx, u, A, B) { if (u < 0.5) { const e = C.sm(0, 0.5, u); ctx.save(); ctx.translate(W / 2, HH * 0.6 + e * HH); ctx.rotate(e * 0.5); ctx.translate(-W / 2, -HH * 0.6); A(ctx); ctx.restore(); } else { const e = C.sm(0.5, 1, u), sy = 1 + 0.12 * Math.sin(e * Math.PI * 1.5) * (1 - e); ctx.save(); ctx.translate(W / 2, HH); ctx.scale(2 - sy, sy); ctx.translate(-W / 2, -HH); B(ctx); ctx.restore(); } },
  sonidos: {
   aparece: (k, t) => { k.noise(t, { dur: 0.18, color: 'brown', filter: 'lowpass', f: [[0, 900], [0.18, 200]], gain: 0.14, a: 0.01 }); k.tone(t, { f: [[0, 180], [0.15, 120]], dur: 0.18, gain: 0.05 }); },
   transicion: (k, t, d = 0.6) => { k.noise(t, { dur: d, color: 'brown', filter: 'bandpass', f: 500, q: 1.5, gain: 0.1, a: 0.05, hold: d * 0.6 }); k.play('thud', t + d * 0.5, { f: 70, gain: 0.4 }); },
   golpe: (k, t) => { k.play('thud', t, { f: 65, gain: 0.55 }); k.noise(t, { dur: 0.12, color: 'pink', filter: 'lowpass', f: 1400, gain: 0.12, a: 0.003 }); },
   trazo: (k, t, d = 0.6) => k.noise(t, { dur: d, color: 'brown', filter: 'bandpass', f: 380, q: 2, gain: 0.08, a: 0.05, hold: d * 0.7 }),
  },
 });
})();
