// estilos/engineering_blueprint.js · v2.2 · «Plano de ingeniería»: cianotipo azul de Prusia con manchas y decoloración,
// líneas blancas que sangran un poco en el papel, sombreado rayado a 45°, cotas con flechas, marco con zonas y pliegues.
// Temas: vehículos, máquinas, accidentes. Transición: el cabezal del trazador barre el pliego.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#123b7a', fondo2: '#16488f', objeto: '#e8f1ff', objeto2: '#cfe0ff', detalle: '#ffffff', sombra: '#0a2554', acento: '#fff2b8', rojo: '#ff6a5c' };
 const papel = () => C.textura('blueprint', 270, 480, (() => { const nz = C.ruido(211), nz2 = C.ruido(212), r = H.rng(5); return (x, y) => { const m = nz.fbm2(x * 0.02, y * 0.02, 4), f = nz2.n2(x * 0.18, y * 0.18), sol = C.cl(nz2.fbm2(x * 0.008 + 3, y * 0.008, 3) * 1.6 + 0.2, 0, 1) * 0.12, ex = Math.min(x, 269 - x) / 270, ey = Math.min(y, 479 - y) / 480, borde = Math.pow(1 - C.cl(Math.min(ex, ey) * 8), 2);
  const k = 1 + m * 0.12 + f * 0.035 - borde * 0.25 + (r() - 0.5) * 0.04; return [(18 + sol * 120) * k, (59 + sol * 110) * k, (122 + sol * 80) * k]; }; })());
 const rejilla = () => C.cache('bp-rejilla', () => { const c = H.layer(W, HH), g = c.getContext('2d'); g.strokeStyle = 'rgba(220,235,255,0.07)'; g.lineWidth = 1; g.beginPath(); for (let x = 0; x <= W; x += 30) { g.moveTo(x, 0); g.lineTo(x, HH); } for (let y = 0; y <= HH; y += 30) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke();
  g.strokeStyle = 'rgba(220,235,255,0.14)'; g.beginPath(); for (let x = 0; x <= W; x += 150) { g.moveTo(x, 0); g.lineTo(x, HH); } for (let y = 0; y <= HH; y += 150) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke();
  g.strokeStyle = 'rgba(235,244,255,0.75)'; g.lineWidth = 4; g.strokeRect(30, 30, W - 60, HH - 60); g.lineWidth = 1.5; g.strokeRect(44, 44, W - 88, HH - 88); for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(30 + i * (W - 60) / 6, 30); g.lineTo(30 + i * (W - 60) / 6, 44); g.moveTo(30 + i * (W - 60) / 6, HH - 30); g.lineTo(30 + i * (W - 60) / 6, HH - 44); g.stroke(); }
  for (let i = 1; i < 10; i++) { g.beginPath(); g.moveTo(30, 30 + i * (HH - 60) / 10); g.lineTo(44, 30 + i * (HH - 60) / 10); g.moveTo(W - 30, 30 + i * (HH - 60) / 10); g.lineTo(W - 44, 30 + i * (HH - 60) / 10); g.stroke(); }
  g.strokeRect(W - 380, HH - 230, 336, 186); g.beginPath(); g.moveTo(W - 380, HH - 168); g.lineTo(W - 44, HH - 168); g.moveTo(W - 380, HH - 108); g.lineTo(W - 44, HH - 108); g.moveTo(W - 220, HH - 168); g.lineTo(W - 220, HH - 44); g.stroke();
  // pliegues del papel
  for (const [x0, y0, x1, y1] of [[W / 2, 0, W / 2, HH], [0, HH / 3, W, HH / 3], [0, (2 * HH) / 3, W, (2 * HH) / 3]]) { g.strokeStyle = 'rgba(255,255,255,0.09)'; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.strokeStyle = 'rgba(0,10,40,0.22)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 + 3, y0 + 3); g.lineTo(x1 + 3, y1 + 3); g.stroke(); }
  return c; });
 const tinta = (ctx, ancho, col = 'rgba(235,244,255,0.95)') => { ctx.save(); ctx.strokeStyle = 'rgba(220,235,255,0.16)'; ctx.lineWidth = ancho * 3; ctx.stroke(); ctx.restore(); ctx.strokeStyle = col; ctx.lineWidth = ancho; ctx.stroke(); };
 C.registrar('engineering_blueprint', {
  familia: 'Dibujo a mano', temas: 'vehículos, máquinas, accidentes', paleta: PAL,
  textos: {
   titular: { fam: "'IBM Plex Mono', monospace", peso: 700, colBase: '#f2f7ff', col: '#ff6a5c', borde: 'rgba(8,30,70,0.9)', bordeAncho: 0.12 },
   contador: { fam: "'IBM Plex Mono', monospace", peso: 700, col: '#f2f7ff', colFinal: '#fff2b8', borde: 'rgba(8,30,70,0.9)', famEtiqueta: "'IBM Plex Mono', monospace", pesoEtiqueta: 600, colEtiqueta: '#d6e6ff' },
   fuente: { fam: "'IBM Plex Mono', monospace", peso: 500, col: '#d6e6ff', franja: 'rgba(8,30,70,0.75)' },
   cap: { fam: 'IBM Plex Mono', color: '#ffffff', caja: 'rgba(8,30,70,0.62)' },
  },
  fondo(ctx) { C.pintarTextura(ctx, papel()); C.pintarTextura(ctx, rejilla()); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto', b = C.caja(f); ctx.save(); C.trazar(ctx, f);
   if (rol === 'fondo' || rol === 'fondo2') { ctx.fillStyle = 'rgba(200,220,255,0.06)'; ctx.fill(); ctx.setLineDash([18, 10]); tinta(ctx, 2, 'rgba(235,244,255,0.6)'); ctx.restore(); return; }
   ctx.fillStyle = rol === 'sombra' ? 'rgba(0,12,40,0.35)' : 'rgba(220,235,255,0.07)'; ctx.fill(); ctx.save(); ctx.clip(); const paso = rol === 'sombra' ? 12 : rol === 'objeto2' ? 36 : 0;
   if (paso) { ctx.strokeStyle = rol === 'sombra' ? 'rgba(235,244,255,0.55)' : 'rgba(235,244,255,0.26)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = b[0] - (b[3] - b[1]); x < b[2]; x += paso) { ctx.moveTo(x, b[3]); ctx.lineTo(x + (b[3] - b[1]), b[1]); } ctx.stroke(); } ctx.restore();
   if (rol === 'acento' || rol === 'rojo') { tinta(ctx, 4, rol === 'rojo' ? '#ff8b7f' : '#fff2b8'); } else if (rol !== 'sombra') tinta(ctx, 4);
   ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; ctx.save(); ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; C.trazarPts(ctx, q, false); if (o.punteada) ctx.setLineDash([16, 10]); tinta(ctx, o.ancho || 3, o.rol === 'rojo' ? '#ff8b7f' : undefined); ctx.setLineDash([]);
   if (o.flecha || o.cota) { C.punta(ctx, q[q.length - 2], q[q.length - 1], 22, '#eef5ff'); if (o.cota) C.punta(ctx, q[1], q[0], 22, '#eef5ff'); } ctx.restore(); },
  brillo(ctx, x, y, r) { ctx.save(); ctx.strokeStyle = 'rgba(240,247,255,0.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
   ctx.beginPath(); for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; ctx.moveTo(x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75); ctx.lineTo(x + Math.cos(a) * r * 2.3, y + Math.sin(a) * r * 2.3); } ctx.moveTo(x - r * 2.6, y); ctx.lineTo(x + r * 2.6, y); ctx.moveTo(x, y - r * 2.6); ctx.lineTo(x, y + r * 2.6); ctx.stroke(); ctx.restore(); },
  acabado(ctx, t) { const m = C.fibras('bp', 2600, 'rgba(220,235,255,1)', 41); C.pintarTextura(ctx, m, 0.18); C.vineta(ctx, 0.35, '4,18,50'); C.grano(ctx, t, 0.04); },
  transicion(ctx, u, A, B) { const x = C.sm(0, 1, u) * (W + 120) - 60; ctx.save(); ctx.beginPath(); ctx.rect(x, 0, W - x, HH); ctx.clip(); A(ctx); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, x, HH); ctx.clip(); B(ctx); ctx.restore();
   ctx.save(); ctx.fillStyle = 'rgba(235,244,255,0.9)'; ctx.fillRect(x - 3, 0, 6, HH); ctx.fillStyle = '#d8e6ff'; ctx.fillRect(x - 40, HH * 0.46, 80, 60); ctx.restore(); },
  sonidos: {
   trazo: (k, t, d = 1.2) => k.noise(t, { dur: d, filter: 'bandpass', f: [[0, 3200], [d * 0.5, 4200], [d, 3600]], q: 3, gain: 0.05, a: 0.08, hold: d * 0.8 }),
   aparece: (k, t) => k.play('stamp', t, { gain: 0.35 }),
   transicion: (k, t, d = 0.8) => { k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: 900, gain: 0.08, a: 0.1, hold: d * 0.7 }); k.noise(t, { dur: d, filter: 'bandpass', f: 3800, q: 3, gain: 0.04, a: 0.05, hold: d * 0.8 }); },
   golpe: (k, t) => k.play('thud', t, { f: 60, gain: 0.45 }),
  },
 });
})();
