// estilos/illuminated_manuscript.js · v2.2 · «Manuscrito iluminado»: folio de vitela con pautado, tinta ferrogálica y rúbricas
// en bermellón, pigmentos planos (lapislázuli, malaquita, rosa) con filigrana de albayalde, oro bruñido con un brillo que
// viaja y orla de zarcillos con bezantes dorados. Temas: historia antigua. Transición: pasar la hoja.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#d9c592', fondo2: '#b98f5a', objeto: '#2a4fa0', objeto2: '#2f8a5a', detalle: '#2a1d12', sombra: '#5a4128', acento: 'oro', rojo: '#c8331f', rosa: '#c96b7a' };
 const TINTA = '#2a1d12';
 const vitela = () => C.textura('vitela', 270, 480, (() => { const nz = C.ruido(41), nz2 = C.ruido(97); return (x, y) => { const m = nz.fbm2(x * 0.02, y * 0.02, 4), f = nz2.fbm2(x * 0.09, y * 0.12, 3), ex = Math.min(x, 269 - x) / 270, ey = Math.min(y, 479 - y) / 480, borde = Math.pow(1 - C.cl(Math.min(ex * 7, ey * 6)), 2), st = C.cl(nz2.fbm2(x * 0.012 + 9, y * 0.014, 3) * 1.8, -1, 1);
  const L = 1 + m * 0.08 + f * 0.03 - borde * 0.16; return [236 * L + st * 5, 220 * L + st, 180 * L - st * 9 - borde * 16]; }; })());
 const orla = () => C.cache('ms-orla', () => { const c = H.layer(W, HH), g = c.getContext('2d'), r = H.rng(13);
  g.strokeStyle = 'rgba(42,29,18,0.18)'; g.lineWidth = 1.2; for (let y = 220; y < HH - 120; y += 38) { g.beginPath(); g.moveTo(90, y); g.lineTo(W - 90, y); g.stroke(); }
  for (const [col, ins, lw] of [['#2a4fa0', 46, 6], ['#c8331f', 60, 3], ['#2a1d12', 70, 1.5]]) { g.strokeStyle = col; g.lineWidth = lw; g.strokeRect(ins, ins, W - 2 * ins, HH - 2 * ins); }
  const zarcillo = (x, y, dir, n) => { g.strokeStyle = '#2a1d12'; g.lineWidth = 2.4; let a = dir, px = x, py = y; for (let i = 0; i < n; i++) { const l = 26 + r() * 22, nx = px + Math.cos(a) * l, ny = py + Math.sin(a) * l; g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px + Math.cos(a + 0.8) * l * 0.6, py + Math.sin(a + 0.8) * l * 0.6, nx, ny); g.stroke();
    if (i % 2 === 0) { g.fillStyle = r() < 0.5 ? '#2f8a5a' : '#2a4fa0'; g.beginPath(); g.ellipse(nx + Math.cos(a + 1.5) * 14, ny + Math.sin(a + 1.5) * 14, 12, 6, a + 1.5, 0, TAU); g.fill(); g.stroke(); }
    if (i % 3 === 1) { const gg = g.createRadialGradient(nx - 3, ny - 3, 1, nx, ny, 10); gg.addColorStop(0, '#fff3b0'); gg.addColorStop(0.5, '#d9a93a'); gg.addColorStop(1, '#7a5418'); g.fillStyle = gg; g.beginPath(); g.arc(nx, ny, 9, 0, TAU); g.fill(); g.lineWidth = 1.2; g.stroke(); g.lineWidth = 2.4; }
    px = nx; py = ny; a += (r() - 0.5) * 1.4; } };
  for (const [x, y, d] of [[70, 70, 0.6], [W - 70, 70, 2.5], [70, HH - 70, -0.6], [W - 70, HH - 70, -2.5]]) zarcillo(x, y, d, 9); for (let y = 300; y < HH - 300; y += 380) { zarcillo(70, y, -0.2, 4); zarcillo(W - 70, y + 190, Math.PI + 0.2, 4); }
  return c; });
 const oro = (ctx, b, t) => { const g = ctx.createLinearGradient(b[0], b[1], b[2], b[3]), k = ((t || 0) * 0.25) % 1.6 - 0.3; g.addColorStop(0, '#8a6420'); g.addColorStop(C.cl(k - 0.12), '#d4a73c'); g.addColorStop(C.cl(k), '#fff3b0'); g.addColorStop(C.cl(k + 0.12), '#d4a73c'); g.addColorStop(1, '#7a5418'); return g; };
 C.registrar('illuminated_manuscript', {
  familia: 'Ilustración', temas: 'historia antigua y medieval', paleta: PAL,
  textos: {
   titular: { fam: "'Fraunces', serif", peso: 800, escalaX: 0.88, colBase: '#2a1d12', col: '#c8331f', borde: 'rgba(240,226,190,0.95)', bordeAncho: 0.14 },
   contador: { fam: "'Fraunces', serif", peso: 800, col: '#2a1d12', colFinal: '#c8331f', borde: 'rgba(240,226,190,0.95)', famEtiqueta: "'Fraunces', serif", pesoEtiqueta: 700, colEtiqueta: '#2a1d12' },
   fuente: { fam: "'Fraunces', serif", peso: 600, col: '#f6ead0', franja: 'rgba(42,29,18,0.72)' },
   cap: { fam: 'Fraunces', color: '#fff6e2', caja: 'rgba(42,29,18,0.66)' },
  },
  fondo(ctx) { C.pintarTextura(ctx, vitela()); C.pintarTextura(ctx, orla()); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto', b = C.caja(f); ctx.save(); C.trazar(ctx, f);
   if (rol === 'sombra') { ctx.clip(); ctx.strokeStyle = 'rgba(60,40,20,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = b[0] - (b[3] - b[1]); x < b[2]; x += 10) { ctx.moveTo(x, b[3]); ctx.lineTo(x + (b[3] - b[1]), b[1]); } for (let x = b[0]; x < b[2] + (b[3] - b[1]); x += 14) { ctx.moveTo(x, b[3]); ctx.lineTo(x - (b[3] - b[1]), b[1]); } ctx.stroke(); ctx.restore(); return; }
   ctx.fillStyle = rol === 'acento' ? oro(ctx, b, o.t) : rol === 'fondo' ? '#c9b07a' : rol === 'fondo2' ? '#9c7a4c' : PAL[rol] || PAL.objeto; ctx.fill();
   ctx.save(); ctx.clip(); ctx.globalAlpha = 0.18; C.pintarTextura(ctx, vitela(), 1, 'multiply'); ctx.restore();
   if (rol !== 'fondo' && rol !== 'fondo2' && rol !== 'acento') { ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(255,252,240,0.75)'; ctx.lineWidth = 2.5; const r = H.rng(Math.round(b[0] + b[1])); for (let i = 0; i < 7; i++) { const x = b[0] + (b[2] - b[0]) * (0.15 + r() * 0.7), y = b[1] + (b[3] - b[1]) * (0.12 + r() * 0.3); ctx.beginPath(); ctx.arc(x, y, 10 + r() * 14, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } ctx.restore(); }
   ctx.strokeStyle = TINTA; ctx.lineWidth = rol === 'fondo' || rol === 'fondo2' ? 2.5 : 4; ctx.stroke(); ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.remuestrear(C.parcial(pts, o.p ?? 1), 8); if (q.length < 2) return; const w = o.ancho || 5; ctx.save(); ctx.strokeStyle = o.rol === 'rojo' ? '#c8331f' : o.rol === 'acento' ? '#b8892c' : TINTA; ctx.lineCap = 'round';
   for (let i = 1; i < q.length; i++) { const u = i / q.length; ctx.lineWidth = w * (0.55 + 0.8 * Math.sin(u * Math.PI)); ctx.beginPath(); ctx.moveTo(q[i - 1][0], q[i - 1][1]); ctx.lineTo(q[i][0], q[i][1]); ctx.stroke(); }
   if (o.flecha) C.punta(ctx, q[q.length - 2], q[q.length - 1], w * 4, ctx.strokeStyle); ctx.restore(); },
  brillo(ctx, x, y, r, o = {}) { ctx.save(); const b = [x - r, y - r, x + r, y + r]; ctx.fillStyle = oro(ctx, b, o.t); ctx.strokeStyle = TINTA; ctx.lineWidth = 3;
   ctx.beginPath(); for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU, rr = i % 2 ? r * 1.35 : r * 1.75; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke();
   ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = TINTA; ctx.beginPath(); ctx.arc(x - r * 0.32, y - r * 0.12, r * 0.07, 0, TAU); ctx.arc(x + r * 0.32, y - r * 0.12, r * 0.07, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x, y + r * 0.15, r * 0.35, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); ctx.restore(); },
  acabado(ctx, t) { C.vineta(ctx, 0.42, '70,45,20', 0.36); C.grano(ctx, t, 0.04); },
  transicion(ctx, u, A, B) { const e = C.sm(0, 1, u), x = W * (1 - e); B(ctx); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, x, HH); ctx.clip(); A(ctx); ctx.restore();
   if (e > 0 && e < 1) { const g = ctx.createLinearGradient(x - 120, 0, x + 60, 0); g.addColorStop(0, 'rgba(60,40,20,0)'); g.addColorStop(0.7, 'rgba(60,40,20,0.35)'); g.addColorStop(1, 'rgba(60,40,20,0)'); ctx.fillStyle = g; ctx.fillRect(x - 120, 0, 180, HH);
    ctx.save(); ctx.beginPath(); ctx.rect(x, 0, Math.min(140, W - x) * Math.sin(e * Math.PI), HH); ctx.clip(); C.pintarTextura(ctx, vitela(), 1); ctx.fillStyle = 'rgba(80,55,25,0.18)'; ctx.fillRect(x, 0, 140, HH); ctx.restore(); } },
  sonidos: {
   trazo: (k, t, d = 1.2) => k.noise(t, { dur: d, filter: 'bandpass', f: [[0, 2400], [d, 2900]], q: 4, gain: 0.04, a: 0.1, hold: d * 0.8 }),
   aparece: (k, t) => k.tone(t, { f: 'A3', type: 'triangle', dur: 0.5, gain: 0.05, a: 0.005, verb: 0.4 }),
   transicion: (k, t, d = 0.8) => { k.noise(t, { dur: d, color: 'pink', filter: 'lowpass', f: [[0, 2400], [d, 600]], gain: 0.09, a: d * 0.3, hold: d * 0.3 }); },
   golpe: (k, t) => k.play('thud', t, { f: 70, gain: 0.4 }),
  },
 });
})();
