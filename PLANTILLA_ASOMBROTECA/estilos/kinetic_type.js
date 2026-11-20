// estilos/kinetic_type.js · v2.2 · «Tipografía cinética»: solo dos tintas (papel claro y azul eléctrico) más el rojo de la palabra
// clave; palabras condensadas enormes recortadas de borde a borde, rellenas o en contorno, ecos que se repiten y textura de
// semitono. Las formas se alternan llenas / en contorno / con puntos. Temas: números y escalas. Transición: rasgado en tiras.
(function () {
 const PL = window.PLANTILLA, P = PL.P, C = PL.estilosComun, W = C.W, HH = C.HH, TAU = C.TAU;
 const AZ = '#1f2bff', PAPEL = '#f2efe8';
 const PAL = { fondo: AZ, fondo2: AZ, objeto: AZ, objeto2: AZ, detalle: AZ, sombra: AZ, acento: AZ, rojo: '#ff2a2a' };
 const semitono = (ctx, b, paso = 18, dens = 0.5) => { ctx.fillStyle = AZ; for (let y = b[1]; y < b[3]; y += paso) for (let x = b[0] + ((y / paso) % 2) * paso / 2; x < b[2]; x += paso) { ctx.beginPath(); ctx.arc(x, y, paso * 0.5 * dens, 0, TAU); ctx.fill(); } };
 C.registrar('kinetic_type', {
  familia: 'Generativo y tipografía', temas: 'números y escalas', paleta: PAL,
  textos: {
   titular: { fam: "'Space Grotesk', sans-serif", peso: 700, escalaX: 0.82, colBase: AZ, col: '#ff2a2a', borde: PAPEL, bordeAncho: 0.1 },
   contador: { fam: "'Space Grotesk', sans-serif", peso: 700, col: AZ, colFinal: '#ff2a2a', borde: PAPEL, bordeAncho: 0.1, famEtiqueta: "'IBM Plex Mono', monospace", pesoEtiqueta: 700, colEtiqueta: AZ },
   fuente: { fam: "'IBM Plex Mono', monospace", peso: 600, col: PAPEL, franja: 'rgba(31,43,255,0.92)' },
   cap: { fam: 'Space Grotesk', color: PAPEL, caja: 'rgba(31,43,255,0.9)' },
  },
  // o.palabra: una palabra enorme en contorno detrás de la escena (la idea del plano)
  fondo(ctx, t, o = {}) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = PAPEL; ctx.fillRect(0, 0, W, HH); const palabra = o.palabra || 'SOL';
   ctx.font = '700 520px "Space Grotesk"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.save(); ctx.translate(W / 2, 1640); ctx.scale(0.62, 1.25); ctx.strokeStyle = AZ; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.globalAlpha = 0.5 - i * 0.15; ctx.strokeText(palabra, 0, -i * 70 - (t * 40) % 70); } ctx.restore();
   ctx.globalAlpha = 1; ctx.fillStyle = AZ; ctx.fillRect(0, 1480, W, 10); ctx.fillRect(0, 300, W, 4); ctx.restore(); },
  forma(ctx, f, o = {}) { const rol = o.rol || 'objeto', b = C.caja(f); ctx.save(); C.trazar(ctx, f);
   if (rol === 'objeto') { ctx.fillStyle = AZ; ctx.fill(); }
   else if (rol === 'objeto2' || rol === 'fondo2') { ctx.strokeStyle = AZ; ctx.lineWidth = 8; ctx.stroke(); }
   else if (rol === 'sombra' || rol === 'acento') { ctx.save(); ctx.clip(); semitono(ctx, b, 16, rol === 'sombra' ? 0.85 : 0.6); ctx.restore(); }
   else if (rol === 'rojo') { ctx.fillStyle = '#ff2a2a'; ctx.fill(); }
   else { ctx.save(); ctx.clip(); semitono(ctx, b, 26, 0.32); ctx.restore(); ctx.strokeStyle = AZ; ctx.lineWidth = 4; ctx.stroke(); }
   ctx.restore(); },
  linea(ctx, pts, o = {}) { const q = C.parcial(pts, o.p ?? 1); if (q.length < 2) return; ctx.save(); ctx.strokeStyle = o.rol === 'rojo' ? '#ff2a2a' : o.rol === 'detalle' ? PAPEL : AZ; ctx.lineWidth = (o.ancho || 6) * 1.6; ctx.lineCap = 'butt'; C.trazarPts(ctx, q, false); ctx.stroke(); if (o.flecha) { const a = q[q.length - 2], e = q[q.length - 1], ang = Math.atan2(e[1] - a[1], e[0] - a[0]); for (let i = 0; i < 2; i++) { const x = e[0] - Math.cos(ang) * i * 26, y = e[1] - Math.sin(ang) * i * 26; ctx.beginPath(); ctx.moveTo(x - Math.cos(ang - 0.7) * 34, y - Math.sin(ang - 0.7) * 34); ctx.lineTo(x, y); ctx.lineTo(x - Math.cos(ang + 0.7) * 34, y - Math.sin(ang + 0.7) * 34); ctx.stroke(); } } ctx.restore(); },
  brillo(ctx, x, y, r) { ctx.save(); ctx.fillStyle = AZ; for (let i = 0; i < 9; i++) { const rr = r * 1.9 - i * r * 0.2; if (rr <= 0) break; ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.lineWidth = 6; ctx.strokeStyle = AZ; ctx.globalAlpha = 0.25 + i * 0.09; ctx.stroke(); } ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(x, y, r * 0.7, 0, TAU); ctx.fill(); ctx.restore(); },
  acabado(ctx, t) { C.grano(ctx, t, 0.03); },
  transicion(ctx, u, A, B, L) { const [c, g] = C.capa(16); (u < 0.5 ? A : B)(g); const k = Math.sin(u * Math.PI), n = 14, r = H.rng(Math.floor(u * 8)); ctx.save(); ctx.fillStyle = PAPEL; ctx.fillRect(0, 0, W, HH); for (let i = 0; i < n; i++) { const y = (i / n) * HH, h = HH / n, dx = (r() - 0.5) * 420 * k; ctx.drawImage(c, 0, y, W, h, dx, y, W, h); }
   if (Math.abs(u - 0.5) < 0.04) { ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, HH); } ctx.restore(); },
  sonidos: {
   aparece: (k, t) => { k.play('thud', t, { f: 90, gain: 0.35 }); k.noise(t, { dur: 0.06, filter: 'highpass', f: 2500, gain: 0.08, a: 0.002 }); },
   transicion: (k, t, d = 0.4) => k.play('swish', t, { dur: Math.max(0.15, d * 0.6), gain: 0.5 }),
   golpe: (k, t) => { k.play('thud', t, { f: 50, gain: 0.7 }); k.noise(t, { dur: 0.3, color: 'brown', filter: 'lowpass', f: [[0, 2000], [0.3, 200]], gain: 0.2, a: 0.002 }); },
   trazo: (k, t, d = 0.5) => k.noise(t, { dur: d, filter: 'highpass', f: [[0, 1500], [d, 6000]], gain: 0.05, a: d * 0.6 }),
  },
 });
})();
