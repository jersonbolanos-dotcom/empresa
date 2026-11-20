// estilos/pixel_16bit.js · v2.2 · «Pixel 16 bits»: escena de consola de los 90 con píxeles de 4×4, paleta estricta de unas 32
// tintas, cielo en bandas con tramado de damero y capas en paralaje. El acabado convierte TODO el dibujo en píxeles con la
// paleta y el tramado (el episodio dibuja normal). Temas: tecnología de antes, videojuegos. Transición: mosaico.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const PALETA = ['#140c34', '#2c1658', '#43206a', '#632a78', '#8c357c', '#b8457a', '#e05c72', '#f6806a', '#ffaa6e', '#ffd28a', '#fff6c2', '#ffffff',
  '#0f1a2e', '#22324f', '#3b5578', '#6b8fb5', '#a8c8e8', '#1e4d2b', '#2f7a3c', '#5cae4a', '#a6d66a', '#3e2a1e', '#6e4a2e', '#a8743e', '#d8a868',
  '#4a4a5e', '#7c7c94', '#b8b8cc', '#000000', '#c8282a', '#ff5048', '#ffd23f'];
 const PAL = { fondo: '#2f7a3c', fondo2: '#1e4d2b', objeto: '#b8b8cc', objeto2: '#7c7c94', detalle: '#22324f', sombra: '#140c34', acento: '#ffd23f', rojo: '#ff5048' };
 C.registrar('pixel_16bit', {
  familia: 'Retro digital', temas: 'tecnología de antes, videojuegos', paleta: PAL,
  textos: {
   titular: { fam: "'IBM Plex Mono', monospace", peso: 700, colBase: '#ffffff', col: '#ff5048', borde: '#140c34', bordeAncho: 0.2 },
   contador: { fam: "'IBM Plex Mono', monospace", peso: 700, col: '#ffffff', colFinal: '#ffd23f', borde: '#140c34', bordeAncho: 0.2, famEtiqueta: "'IBM Plex Mono', monospace", pesoEtiqueta: 700, colEtiqueta: '#ffffff' },
   fuente: { fam: "'IBM Plex Mono', monospace", peso: 600, col: '#ffffff', franja: 'rgba(20,12,52,0.85)' },
   cap: { fam: 'IBM Plex Mono', color: '#ffffff', caja: 'rgba(28,30,110,0.9)' },
   pixel: 4,
  },
  fondo(ctx, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createLinearGradient(0, 0, 0, 1250); g.addColorStop(0, '#140c34'); g.addColorStop(0.35, '#632a78'); g.addColorStop(0.62, '#e05c72'); g.addColorStop(0.85, '#ffaa6e'); g.addColorStop(1, '#ffd28a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
   const r = H.rng(4); ctx.fillStyle = '#fff6c2'; for (let i = 0; i < 60; i++) { const x = Math.floor(r() * 270) * 4, y = Math.floor(r() * 120) * 4; if ((Math.floor(t * 2) + i) % 7) ctx.fillRect(x, y, 4, 4); }
   const sierra = (y0, amp, col, sem, vel) => { const r2 = H.rng(sem); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, HH); for (let x = 0; x <= W; x += 16) { const h = amp * (0.5 + 0.5 * Math.sin((x + t * vel) * 0.01 + sem)) + r2() * 10; ctx.lineTo(x, Math.round((y0 - h) / 4) * 4); } ctx.lineTo(W, HH); ctx.closePath(); ctx.fill(); };
   sierra(1080, 200, '#8c357c', 2, 4); sierra(1150, 140, '#43206a', 5, 8); ctx.fillStyle = '#7c7c94'; for (let i = 0; i < 3; i++) { const x = ((i * 380 + t * 12) % (W + 200)) - 100; ctx.fillRect(x, 320 + i * 90, 160, 24); ctx.fillRect(x + 24, 296 + i * 90, 100, 24); } ctx.restore(); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto', col = PAL[rol] || PAL.objeto, b = C.caja(f); ctx.save(); ctx.fillStyle = col; C.trazar(ctx, f); ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = C.tono(col, 0.28); ctx.fillRect(b[0], b[1], b[2] - b[0], 12); ctx.fillStyle = C.tono(col, -0.3); ctx.fillRect(b[0], b[3] - 16, b[2] - b[0], 16); ctx.restore();
   if (rol !== 'sombra') { ctx.strokeStyle = '#140c34'; ctx.lineWidth = 8; ctx.stroke(); } ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; ctx.save(); ctx.strokeStyle = o.rol === 'rojo' ? '#ff5048' : o.rol === 'acento' ? '#ffd23f' : '#22324f'; ctx.lineWidth = Math.max(8, o.ancho || 8); ctx.lineCap = 'square'; if (o.punteada) ctx.setLineDash([16, 16]); C.trazarPts(ctx, q, false); ctx.stroke(); ctx.setLineDash([]); if (o.flecha) C.punta(ctx, q[q.length - 2], q[q.length - 1], 36, ctx.strokeStyle); ctx.restore(); },
  brillo(ctx, x, y, r) { ctx.save(); ctx.fillStyle = '#ffd28a'; ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff6c2'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffd23f'; for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; ctx.fillRect(x + Math.cos(a) * r * 1.9 - 10, y + Math.sin(a) * r * 1.9 - 10, 20, 20); } ctx.restore(); },
  acabado(ctx) { C.pixelar(ctx, 4, PALETA, 28); },
  transicion(ctx, u, A, B) { if (u < 0.5) A(ctx); else B(ctx); const k = Math.sin(u * Math.PI), n = Math.max(1, Math.round(4 + k * 40)); C.pixelar(ctx, n); },
  sonidos: {
   aparece: (k, t) => { k.tone(t, { f: 'E5', type: 'square', dur: 0.07, gain: 0.05, a: 0.002, hold: 0.05 }); k.tone(t + 0.07, { f: 'B5', type: 'square', dur: 0.09, gain: 0.05, a: 0.002, hold: 0.07 }); },
   transicion: (k, t, d = 0.6) => k.tone(t, { f: [[0, 220], [d, 880]], type: 'square', dur: d, gain: 0.035, filter: 'lowpass', f2: 2400, a: 0.02, hold: d * 0.8 }),
   golpe: (k, t) => { k.noise(t, { dur: 0.18, filter: 'lowpass', f: 1800, gain: 0.18, a: 0.002 }); k.tone(t, { f: [[0, 160], [0.18, 50]], type: 'square', dur: 0.2, gain: 0.06 }); },
   trazo: (k, t, d = 0.8) => k.tone(t, { f: [[0, 440], [d, 660]], type: 'triangle', dur: d, gain: 0.03, a: 0.05, hold: d * 0.7 }),
  },
 });
})();
