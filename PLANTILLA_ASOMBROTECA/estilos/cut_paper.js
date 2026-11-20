// estilos/cut_paper.js · v2.2 · «Diorama de papel recortado»: caja de sombras de cartulina en capas; cada forma es una hoja recortada
// con textura de fibra, canto iluminado y sombra suave sobre la hoja de detrás; los bordes rasgados muestran el alma blanca
// del papel. Temas: cuerpo, naturaleza, historias. Transición: las capas se deslizan en paralaje.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#3f7d6b', fondo2: '#2d5f52', objeto: '#efe4cf', objeto2: '#c08a5c', detalle: '#3a2e44', sombra: '#2a2440', acento: '#f2c14e', rojo: '#d6453d' };
 const fibra = () => C.cache('cp-fibra', () => { const c = H.layer(256, 256), g = c.getContext('2d'), r = H.rng(71); g.fillStyle = 'rgba(128,128,128,1)'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { g.strokeStyle = r() < 0.5 ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)'; g.lineWidth = 0.6 + r(); const x = r() * 256, y = r() * 256, a = r() * TAU, l = 4 + r() * 14; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); } return c; });
 const hoja = (ctx, pts, col, o = {}) => { ctx.save(); ctx.shadowColor = 'rgba(15,10,30,0.42)'; ctx.shadowBlur = 18; ctx.shadowOffsetX = 6; ctx.shadowOffsetY = 12; ctx.fillStyle = col; C.trazarPts(ctx, pts); ctx.fill(); ctx.restore();
  ctx.save(); C.trazarPts(ctx, pts); ctx.clip(); ctx.globalAlpha = 0.22; ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = ctx.createPattern(fibra(), 'repeat'); ctx.fillRect(0, 0, W, HH); ctx.restore();
  ctx.save(); C.trazarPts(ctx, pts); ctx.clip(); ctx.strokeStyle = 'rgba(255,250,235,0.55)'; ctx.lineWidth = 5; ctx.translate(2, 3); C.trazarPts(ctx, pts); ctx.stroke(); ctx.restore();
  if (o.rasgado) { ctx.save(); ctx.strokeStyle = 'rgba(255,253,245,0.95)'; ctx.lineWidth = 4; ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1] - 2) : ctx.moveTo(q[0], q[1] - 2))); ctx.stroke(); ctx.restore(); } };
 const rasgar = (f, sem) => C.deformar(C.puntos(f, 160), 6, sem, 0, 18);
 C.registrar('cut_paper', {
  familia: 'Papel y manualidades', temas: 'cuerpo, naturaleza, historias', paleta: PAL,
  textos: {
   titular: { fam: "'Fredoka', Nunito, sans-serif", peso: 700, colBase: '#fbf3e2', col: '#ff5a4a', borde: '#2a2440', bordeAncho: 0.15 },
   contador: { fam: "'Fredoka', Nunito, sans-serif", peso: 700, col: '#fbf3e2', colFinal: '#f2c14e', borde: '#2a2440', famEtiqueta: "'Nunito', sans-serif", pesoEtiqueta: 800, colEtiqueta: '#fbf3e2' },
   fuente: { fam: "'Nunito', sans-serif", peso: 700, col: '#fbf3e2', franja: 'rgba(42,36,64,0.78)' },
   cap: { fam: 'Nunito', color: '#fbf3e2', caja: 'rgba(42,36,64,0.6)' },
  },
  fondo(ctx, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#2c2f5e'); g.addColorStop(1, '#525aa0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.restore();
   const capa = (y, amp, col, sem, dx) => { const r = H.rng(sem), pts = [[-60, HH + 40]]; for (let x = -60; x <= W + 60; x += 40) pts.push([x + dx, y - amp * (0.5 + 0.5 * Math.sin(x * 0.0065 + sem)) - r() * 10]); pts.push([W + 60, HH + 40]); hoja(ctx, C.deformar(pts, 2, sem, 0, 30), col, { rasgado: true }); };
   capa(950, 160, '#3b3f7a', 3, Math.sin(t * 0.2) * 10); capa(1060, 120, '#4b5c8f', 5, Math.sin(t * 0.25) * 18); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto'; if (rol === 'sombra') { ctx.save(); ctx.fillStyle = 'rgba(20,14,40,0.4)'; ctx.filter = 'blur(4px)'; C.trazar(ctx, f); ctx.fill(); ctx.restore(); return; }
   const pts = rol === 'fondo' || rol === 'fondo2' ? rasgar(f, Math.round(C.caja(f)[1])) : C.puntos(f, 120); hoja(ctx, pts, PAL[rol] || PAL.objeto, { rasgado: rol === 'fondo' || rol === 'fondo2' }); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; const w = (o.ancho || 6) * 3.2, col = o.rol === 'rojo' ? '#d6453d' : o.rol === 'acento' ? '#f2c14e' : '#efe4cf';
   ctx.save(); ctx.shadowColor = 'rgba(15,10,30,0.4)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 6; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'butt'; ctx.lineJoin = 'round'; if (o.punteada) ctx.setLineDash([w * 1.6, w * 0.9]); C.trazarPts(ctx, q, false); ctx.stroke(); ctx.restore();
   if (o.flecha) { const a = q[q.length - 2], e = q[q.length - 1], ang = Math.atan2(e[1] - a[1], e[0] - a[0]); hoja(ctx, [[e[0] + Math.cos(ang) * w * 1.2, e[1] + Math.sin(ang) * w * 1.2], [e[0] + Math.cos(ang + 2.3) * w * 1.6, e[1] + Math.sin(ang + 2.3) * w * 1.6], [e[0] + Math.cos(ang - 2.3) * w * 1.6, e[1] + Math.sin(ang - 2.3) * w * 1.6]], col); } },
  brillo(ctx, x, y, r) { const rayos = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU, rr = i % 2 ? r * 1.25 : r * 1.9; rayos.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } hoja(ctx, rayos, '#f6d070'); hoja(ctx, C.puntos({ tipo: 'circulo', x, y, r }, 60), '#f2c14e'); },
  acabado(ctx, t) { C.vineta(ctx, 0.4, '12,8,30', 0.36); C.grano(ctx, t, 0.035); },
  transicion(ctx, u, A, B) { const e = C.sm(0, 1, u); ctx.save(); ctx.translate(-W * e, 0); A(ctx); ctx.restore(); ctx.save(); ctx.translate(W * (1 - e), 0); B(ctx); ctx.restore(); ctx.save(); const g = ctx.createLinearGradient(W * (1 - e) - 40, 0, W * (1 - e), 0); g.addColorStop(0, 'rgba(10,8,25,0)'); g.addColorStop(1, 'rgba(10,8,25,0.45)'); ctx.fillStyle = g; ctx.fillRect(W * (1 - e) - 40, 0, 40, HH); ctx.restore(); },
  sonidos: {
   aparece: (k, t) => k.noise(t, { dur: 0.16, filter: 'highpass', f: 2800, gain: 0.07, a: 0.01 }),
   transicion: (k, t, d = 0.7) => k.noise(t, { dur: d, filter: 'bandpass', f: [[0, 1200], [d, 3200]], q: 1, gain: 0.07, a: d * 0.3, hold: d * 0.4 }),
   golpe: (k, t) => { k.noise(t, { dur: 0.08, filter: 'bandpass', f: 1800, q: 1, gain: 0.2, a: 0.002 }); k.play('thud', t, { f: 120, gain: 0.25 }); },
   trazo: (k, t, d = 0.8) => k.noise(t, { dur: d, filter: 'bandpass', f: 2600, q: 1.5, gain: 0.04, a: 0.06, hold: d * 0.7 }),
  },
 });
})();
