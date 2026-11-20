// estilos/sumi_e.js · v2.2 · «Sumi-e»: tinta japonesa sobre papel de arroz fibroso; aguadas grises diluidas que se corren y se
// pierden en la niebla; trazos de pincel cargado que terminan en cerdas secas; mucho espacio vacío y un sello bermellón.
// Temas: historia antigua, naturaleza, calma. Transición: la niebla cruza el rollo.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#9a938a', fondo2: '#6e675e', objeto: '#3a3632', objeto2: '#141210', detalle: '#141210', sombra: '#141210', acento: '#c23b22', rojo: '#c23b22' };
 const ALFA = { fondo: 0.14, fondo2: 0.24, objeto: 0.42, objeto2: 0.8, sombra: 0.7, acento: 0.85, rojo: 0.85 };
 const papel = () => C.textura('washi', 270, 480, (() => { const nz = C.ruido(55), nz2 = C.ruido(56); return (x, y) => { const v = nz.fbm2(x * 0.03, y * 0.03, 3), fl = nz2.fbm2(x * 0.12, y * 0.12, 2); const L = 1 + v * 0.05 + fl * 0.03; return [239 * L, 231 * L, 214 * L]; }; })());
 const sello = (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.04); ctx.fillStyle = '#c23b22'; ctx.globalAlpha = 0.88; ctx.fillRect(-s / 2, -s / 2, s, s); ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = s * 0.08; ctx.strokeStyle = '#000'; ctx.strokeRect(-s * 0.36, -s * 0.36, s * 0.72, s * 0.72); ctx.beginPath(); ctx.moveTo(0, -s * 0.28); ctx.lineTo(0, s * 0.28); ctx.moveTo(-s * 0.22, -s * 0.05); ctx.lineTo(s * 0.22, -s * 0.05); ctx.stroke(); ctx.restore(); };
 const pincel = (ctx, pts, o) => { const q = C.remuestrear(C.parcial(pts, o.p ?? 1), 3); if (q.length < 2) return; const w = (o.ancho || 6) * 2, r = H.rng(o.sem || Math.round(q[0][0] * 3 + q[0][1])), N = q.length, col = o.col || '#141210';
  const nr = q.map((p, i) => { const a = q[Math.max(0, i - 1)], b = q[Math.min(N - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; });
  const ancho = (i) => { const u = i / (N - 1); return w * (0.35 + 1.1 * Math.sin(Math.min(1, u * 1.6 + 0.12) * Math.PI * 0.62)) * (1 - 0.55 * u); };
  ctx.save(); ctx.fillStyle = col; ctx.globalAlpha = 0.9; ctx.beginPath(); q.forEach((p, i) => { const a = ancho(i) / 2; i ? ctx.lineTo(p[0] + nr[i][0] * a, p[1] + nr[i][1] * a) : ctx.moveTo(p[0] + nr[i][0] * a, p[1] + nr[i][1] * a); }); for (let i = N - 1; i >= 0; i--) { const a = ancho(i) / 2; ctx.lineTo(q[i][0] - nr[i][0] * a, q[i][1] - nr[i][1] * a); } ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 0.5; ctx.strokeStyle = col; for (let s = 0; s < 7; s++) { const off = (s / 6 - 0.5) * 0.9, corte = 0.55 + r() * 0.4; ctx.lineWidth = 1 + r() * 1.6; ctx.beginPath(); for (let i = Math.floor(N * corte); i < N; i++) { if (r() < 0.18) { ctx.stroke(); ctx.beginPath(); continue; } const a = ancho(i) * off; ctx.lineTo(q[i][0] + nr[i][0] * a, q[i][1] + nr[i][1] * a); } ctx.stroke(); }
  if (o.flecha) C.punta(ctx, q[N - 2], q[N - 1], w * 2.6, col); ctx.restore(); };
 C.registrar('sumi_e', {
  familia: 'Pictórico', temas: 'historia antigua, naturaleza, calma', paleta: PAL,
  textos: {
   titular: { fam: "'Fraunces', serif", peso: 700, escalaX: 0.9, colBase: '#141210', col: '#c23b22', borde: 'rgba(239,231,214,0.92)', bordeAncho: 0.14 },
   contador: { fam: "'Fraunces', serif", peso: 700, col: '#141210', colFinal: '#c23b22', borde: 'rgba(239,231,214,0.92)', famEtiqueta: "'Fraunces', serif", pesoEtiqueta: 600, colEtiqueta: '#3a3632' },
   fuente: { fam: "'Fraunces', serif", peso: 600, col: '#f3ece0', franja: 'rgba(20,18,16,0.72)' },
   cap: { fam: 'Fraunces', color: '#f6efe2', caja: 'rgba(20,18,16,0.62)' },
  },
  fondo(ctx, t) { C.pintarTextura(ctx, papel()); C.pintarTextura(ctx, C.fibras('washi', 3400, 'rgba(150,130,100,1)', 57), 0.32);
   ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = '#6e675e'; ctx.filter = 'blur(14px)'; ctx.beginPath(); ctx.moveTo(-40, 1150); for (let x = -40; x <= W + 40; x += 60) ctx.lineTo(x, 1080 - 180 * Math.exp(-Math.pow((x - 260) / 180, 2)) - 120 * Math.exp(-Math.pow((x - 760) / 220, 2))); ctx.lineTo(W + 40, 1400); ctx.lineTo(-40, 1400); ctx.closePath(); ctx.fill(); ctx.restore();
   sello(ctx, W - 150, HH - 330, 74); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto'; ctx.save(); ctx.globalAlpha = ALFA[rol] ?? 0.5; ctx.fillStyle = PAL[rol] || PAL.objeto; ctx.filter = 'blur(5px)'; C.trazar(ctx, f); ctx.fill(); ctx.filter = 'blur(1.5px)'; ctx.globalAlpha *= 0.55; ctx.strokeStyle = PAL.objeto2; ctx.lineWidth = rol === 'fondo' || rol === 'fondo2' ? 2 : 6; ctx.stroke(); ctx.restore();
   if (rol === 'objeto2' || rol === 'objeto') { const pts = C.puntos(f, 60); pincel(ctx, pts.slice(0, Math.floor(pts.length * 0.62)), { ancho: rol === 'objeto2' ? 4 : 3, sem: Math.round(C.caja(f)[0] + 3) }); } },
  linea(ctx, pts, o = {}) { pincel(ctx, pts, { ...o, col: o.rol === 'rojo' || o.rol === 'acento' ? '#c23b22' : '#141210' }); },
  brillo(ctx, x, y, r) { ctx.save(); ctx.fillStyle = '#c23b22'; ctx.globalAlpha = 0.85; ctx.filter = 'blur(2px)'; ctx.beginPath(); ctx.arc(x, y, r * 1.1, 0, TAU); ctx.fill(); ctx.filter = 'blur(10px)'; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, TAU); ctx.fill(); ctx.restore(); },
  acabado(ctx, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 3; i++) { const y = 700 + i * 380 + 40 * Math.sin(t * 0.2 + i), x = ((t * (14 + i * 6)) % 600) - 300, g = ctx.createLinearGradient(0, y - 90, 0, y + 90); g.addColorStop(0, 'rgba(244,239,228,0)'); g.addColorStop(0.5, 'rgba(244,239,228,0.32)'); g.addColorStop(1, 'rgba(244,239,228,0)'); ctx.fillStyle = g; ctx.fillRect(x - 200, y - 90, W + 400, 180); } ctx.restore(); C.vineta(ctx, 0.18, '90,80,60', 0.42); },
  transicion(ctx, u, A, B) { if (u < 0.5) A(ctx); else B(ctx); const k = Math.sin(u * Math.PI); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = k * 0.95; const x = (u - 0.5) * W * 1.6, g = ctx.createLinearGradient(x - W * 0.6, 0, x + W * 1.6, 0); g.addColorStop(0, 'rgba(244,239,228,0)'); g.addColorStop(0.3, 'rgba(244,239,228,1)'); g.addColorStop(0.7, 'rgba(244,239,228,1)'); g.addColorStop(1, 'rgba(244,239,228,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.restore(); },
  sonidos: {
   trazo: (k, t, d = 0.8) => k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 700], [d * 0.4, 1800], [d, 1200]], q: 1.2, gain: 0.06, a: 0.08, hold: d * 0.6 }),
   aparece: (k, t) => k.play('thud', t, { f: 110, gain: 0.3 }),
   transicion: (k, t, d = 1) => k.noise(t, { dur: d + 0.4, color: 'brown', filter: 'lowpass', f: [[0, 300], [d * 0.5, 800], [d + 0.4, 300]], gain: 0.1, a: d * 0.4, hold: d * 0.3 }),
   golpe: (k, t) => { k.play('thud', t, { f: 80, gain: 0.45 }); k.tone(t, { f: 'D4', type: 'triangle', dur: 1.1, gain: 0.04, a: 0.005, verb: 0.5 }); },
  },
 });
})();
