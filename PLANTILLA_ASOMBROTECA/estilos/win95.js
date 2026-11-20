// estilos/win95.js · v2.2 · «Escritorio de los 90»: fondo verde azulado, ventanas grises con bisel de 2 píxeles, barra de título
// azul marino, texto de sistema sin suavizar y la escena dentro de una ventana. El acabado lo pasa a píxeles 2×2 con la paleta
// de 16 colores. Temas: tecnología de antes, ordenadores, internet. Transición: rectángulos de zoom.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const VGA = ['#000000', '#800000', '#008000', '#808000', '#000080', '#800080', '#008080', '#c0c0c0', '#808080', '#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff', '#ffffff', '#dfdfdf', '#5a8fd0', '#c8a060', '#f4d080'];
 const PAL = { fondo: '#008000', fondo2: '#808000', objeto: '#dfdfdf', objeto2: '#c0c0c0', detalle: '#000000', sombra: '#808080', acento: '#ffff00', rojo: '#ff0000' };
 const bisel = (ctx, x, y, w, h, hundido) => { ctx.fillStyle = '#c0c0c0'; ctx.fillRect(x, y, w, h); const a = hundido ? '#808080' : '#ffffff', b = hundido ? '#ffffff' : '#000000', c = hundido ? '#000000' : '#dfdfdf', d = hundido ? '#dfdfdf' : '#808080';
  ctx.fillStyle = a; ctx.fillRect(x, y, w, 4); ctx.fillRect(x, y, 4, h); ctx.fillStyle = b; ctx.fillRect(x, y + h - 4, w, 4); ctx.fillRect(x + w - 4, y, 4, h); ctx.fillStyle = c; ctx.fillRect(x + 4, y + 4, w - 8, 4); ctx.fillRect(x + 4, y + 4, 4, h - 8); ctx.fillStyle = d; ctx.fillRect(x + 4, y + h - 8, w - 8, 4); ctx.fillRect(x + w - 8, y + 4, 4, h - 8); };
 const ventana = (ctx, x, y, w, h) => { bisel(ctx, x, y, w, h); ctx.fillStyle = '#000080'; ctx.fillRect(x + 8, y + 8, w - 16, 50); ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 20, y + 22, 26, 22); for (let i = 0; i < 3; i++) bisel(ctx, x + w - 46 - i * 44, y + 14, 38, 36); ctx.fillStyle = '#000'; ctx.fillRect(x + w - 34, y + 36, 14, 4);
  bisel(ctx, x + 8, y + 64, w - 16, h - 72, true); };
 const icono = (ctx, x, y, col) => { ctx.fillStyle = '#000'; ctx.fillRect(x - 2, y - 2, 76, 64); ctx.fillStyle = col; ctx.fillRect(x, y, 72, 60); ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 8, y + 8, 56, 8); ctx.fillStyle = '#000080'; ctx.fillRect(x + 6, y + 70, 60, 14); };
 C.registrar('win95', {
  familia: 'Interfaz retro', temas: 'tecnología de antes, ordenadores', paleta: PAL, ventana, bisel,
  textos: {
   titular: { fam: "'Nunito', sans-serif", peso: 900, colBase: '#ffffff', col: '#ff2020', borde: '#000000', bordeAncho: 0.16 },
   contador: { fam: "'Nunito', sans-serif", peso: 900, col: '#ffffff', colFinal: '#ffff00', borde: '#000000', famEtiqueta: "'Nunito', sans-serif", pesoEtiqueta: 800, colEtiqueta: '#ffffff' },
   fuente: { fam: "'Nunito', sans-serif", peso: 700, col: '#000000', franja: 'rgba(192,192,192,0.95)' },
   cap: { fam: 'Nunito', color: '#ffffff', caja: 'rgba(0,0,128,0.88)' },
   pixel: 2,
  },
  fondo(ctx, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#008080'; ctx.fillRect(0, 0, W, HH); [[60, 640, '#ffff00'], [60, 800, '#c0c0c0'], [60, 960, '#5a8fd0']].forEach(([x, y, c]) => icono(ctx, x, y, c));
   ventana(ctx, 150, 640, 880, 960); const gc = ctx.createLinearGradient(0, 712, 0, 1590); gc.addColorStop(0, '#5a8fd0'); gc.addColorStop(0.5, '#a8c8f0'); gc.addColorStop(1, '#dfeeff'); ctx.fillStyle = gc; ctx.fillRect(166, 712, 848, 872);
   ctx.fillStyle = '#c0c0c0'; ctx.fillRect(0, HH - 90, W, 90); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, HH - 90, W, 4); bisel(ctx, 10, HH - 78, 170, 66); ctx.fillStyle = '#000'; ctx.font = '800 34px Nunito'; ctx.fillText('Inicio', 70, HH - 34); bisel(ctx, W - 210, HH - 78, 200, 66, true); ctx.restore(); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto'; ctx.save(); if (rol === 'sombra') { ctx.fillStyle = '#808080'; C.trazar(ctx, f); ctx.fill(); ctx.restore(); return; }
   ctx.fillStyle = PAL[rol] || PAL.objeto; C.trazar(ctx, f); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.stroke(); ctx.save(); ctx.clip(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.translate(4, 4); C.trazar(ctx, f); ctx.stroke(); ctx.restore(); ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; ctx.save(); ctx.strokeStyle = o.rol === 'rojo' ? '#ff0000' : '#000000'; ctx.lineWidth = 4; ctx.setLineDash(o.punteada ? [6, 6] : []); C.trazarPts(ctx, q, false); ctx.stroke(); ctx.setLineDash([]); if (o.flecha) C.punta(ctx, q[q.length - 2], q[q.length - 1], 26, ctx.strokeStyle); ctx.restore(); },
  brillo(ctx, x, y, r) { ctx.save(); ctx.fillStyle = '#ffff00'; ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke(); for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25); ctx.lineTo(x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7); ctx.stroke(); } ctx.restore(); },
  acabado(ctx) { C.pixelar(ctx, 2, VGA, 0); },
  transicion(ctx, u, A, B) { if (u < 0.6) A(ctx); else B(ctx); const k = C.sm(0, 1, u); ctx.save(); ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.setLineDash([8, 8]); for (let i = 0; i < 6; i++) { const s = C.cl(k * 1.4 - i * 0.08), w = 80 + (W - 120) * s, h = 120 + (HH - 300) * s; ctx.strokeRect(W / 2 - w / 2, HH / 2 - h / 2, w, h); } ctx.restore(); },
  sonidos: {
   aparece: (k, t) => k.play('click', t, { gain: 0.6 }),
   golpe: (k, t) => { ['C5', 'E5', 'G5'].forEach((n, i) => k.tone(t + i * 0.06, { f: n, type: 'triangle', dur: 0.9 - i * 0.1, gain: 0.04, a: 0.005, verb: 0.3 })); },
   transicion: (k, t, d = 0.5) => k.noise(t, { dur: d, filter: 'bandpass', f: 1600, q: 5, gain: 0.05, a: 0.01, hold: d * 0.8 }),
   trazo: (k, t, d = 1) => k.noise(t, { dur: d, filter: 'bandpass', f: 900, q: 6, gain: 0.03, a: 0.05, hold: d * 0.8 }),
  },
 });
})();
