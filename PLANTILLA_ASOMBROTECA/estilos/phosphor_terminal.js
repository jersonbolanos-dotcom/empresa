// estilos/phosphor_terminal.js · v2.2 · «Terminal de fósforo»: tubo de fósforo verde con halo, líneas de barrido, barra de zumbido
// que sube, viñeta curva del tubo y reflejo del cristal. El episodio dibuja normal (luces = trazo) y el acabado lo vuelve verde
// fósforo. Temas: tecnología de antes, ordenadores. Transición: el «V-hold» hace rodar la imagen.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PAL = { fondo: '#1a1a1a', fondo2: '#262626', objeto: '#ffffff', objeto2: '#bdbdbd', detalle: '#ffffff', sombra: '#000000', acento: '#ffffff', rojo: '#ffffff' };
 const vidrio = () => C.cache('crt-vidrio', () => { const c = H.layer(W, HH), g = c.getContext('2d'); const v = g.createRadialGradient(W / 2, HH / 2, HH * 0.3, W / 2, HH / 2, HH * 0.62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(0.75, 'rgba(0,0,0,0.35)'); v.addColorStop(1, 'rgba(0,0,0,0.92)'); g.fillStyle = v; g.fillRect(0, 0, W, HH);
  const r = g.createLinearGradient(0, 0, W, HH * 0.5); r.addColorStop(0, 'rgba(255,255,255,0.08)'); r.addColorStop(0.35, 'rgba(255,255,255,0)'); g.fillStyle = r; g.beginPath(); g.ellipse(W * 0.3, HH * 0.18, W * 0.6, HH * 0.14, -0.3, 0, TAU); g.fill();
  g.strokeStyle = '#151513'; g.lineWidth = 40; g.beginPath(); g.roundRect(0, 0, W, HH, 90); g.stroke(); return c; });
 C.registrar('phosphor_terminal', {
  familia: 'Retro digital', temas: 'tecnología de antes, ordenadores, código', paleta: PAL,
  textos: {
   titular: { fam: "'IBM Plex Mono', monospace", peso: 700, colBase: '#b9ffcc', col: '#ff5b4f', borde: 'rgba(0,14,4,0.92)', bordeAncho: 0.14 },
   contador: { fam: "'IBM Plex Mono', monospace", peso: 700, col: '#b9ffcc', colFinal: '#7dff9b', borde: 'rgba(0,14,4,0.92)', famEtiqueta: "'IBM Plex Mono', monospace", pesoEtiqueta: 600, colEtiqueta: '#7dff9b' },
   fuente: { fam: "'IBM Plex Mono', monospace", peso: 500, col: '#9dffb4', franja: 'rgba(0,16,6,0.82)' },
   cap: { fam: 'IBM Plex Mono', color: '#b9ffcc', caja: 'rgba(0,16,6,0.7)' },
   brillo: { a: 0.6, r: 10 },
  },
  fondo(ctx, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, W, HH); ctx.font = '600 24px "IBM Plex Mono"'; ctx.fillStyle = 'rgba(255,255,255,0.2)'; const r = H.rng(8);
   for (let i = 0; i < 10; i++) { let s = ''; for (let j = 0; j < 8 + Math.floor(r() * 26); j++) s += '0123456789ABCDEF.:/-'[Math.floor(r() * 20)]; ctx.fillText(s, 70, 1500 + i * 30); } ctx.fillStyle = 'rgba(255,255,255,0.5)'; if (Math.floor(t * 2) % 2) ctx.fillRect(70 + 9 * 18, 1500 + 10 * 30 - 22, 18, 26); ctx.restore(); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto'; ctx.save(); C.trazar(ctx, f); ctx.fillStyle = rol === 'sombra' ? 'rgba(0,0,0,0.92)' : rol === 'fondo' || rol === 'fondo2' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.16)'; ctx.fill(); if (rol !== 'sombra') { ctx.strokeStyle = rol === 'fondo' || rol === 'fondo2' ? 'rgba(255,255,255,0.45)' : '#ffffff'; ctx.lineWidth = rol === 'fondo' || rol === 'fondo2' ? 3 : 5; ctx.stroke(); } ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = o.ancho || 5; if (o.punteada) ctx.setLineDash([14, 10]); C.trazarPts(ctx, q, false); ctx.stroke(); ctx.setLineDash([]); if (o.flecha) C.punta(ctx, q[q.length - 2], q[q.length - 1], 26, '#fff'); ctx.restore(); },
  brillo(ctx, x, y, r) { ctx.save(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3); ctx.lineTo(x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8); ctx.stroke(); } ctx.restore(); },
  acabado(ctx, t) { C.fosforo(ctx, '#39ff6a', 1.3); C.bloom(ctx, 0.8, 'brightness(1) contrast(1.6)'); C.escaneo(ctx, t, { paso: 4, a: 0.3, barra: 0.06, vel: 160 }); C.pintarTextura(ctx, vidrio()); C.grano(ctx, t, 0.05); },
  transicion(ctx, u, A, B) { const e = C.sm(0, 1, u), y = -e * HH; ctx.save(); ctx.translate(0, y); A(ctx); ctx.restore(); ctx.save(); ctx.translate(0, y + HH + 80); B(ctx); ctx.restore(); ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(0, y + HH, W, 80); ctx.restore(); },
  sonidos: {
   trazo: (k, t, d = 1.2) => k.noise(t, { dur: d, filter: 'bandpass', f: 3200, q: 2, gain: 0.035, a: 0.05, hold: d * 0.85 }),
   aparece: (k, t) => k.tone(t, { f: 1000, type: 'square', dur: 0.08, gain: 0.04, a: 0.002, hold: 0.06, filter: 'lowpass', f2: 3000 }),
   transicion: (k, t, d = 0.6) => { k.tone(t, { f: [[0, 60], [d, 30]], type: 'sawtooth', dur: d, gain: 0.05, filter: 'lowpass', f2: 300, a: 0.01, hold: d * 0.7 }); k.noise(t, { dur: d * 0.6, filter: 'highpass', f: 6000, gain: 0.03, a: 0.005 }); },
   golpe: (k, t) => k.tone(t, { f: 880, type: 'square', dur: 0.25, gain: 0.05, a: 0.003, hold: 0.18, filter: 'lowpass', f2: 2500 }),
  },
 });
})();
