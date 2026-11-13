// =====================================================================================================
// episodio.js — «¿Mito o verdad?» Cap. 2 · ¿Cerrar las apps que quedan abiertas ahorra batería? · PLANTILLA ASOMBROTECA v1.36 · «tecno»
// Serie: serie_mito_verdad (P.veredicto + FX.veredicto). Veredicto: MITO. UN solo vídeo con UN gancho (v1.34): el A.
// Voz: ElevenLabs Eleven v4, Dan, toma 1 de 2 (781 caracteres), 24 tramos. Metáfora sostenida: un LIBRO CON MARCAPÁGINAS
// (la app congelada = el libro con el marcapáginas puesto; cerrarla = cerrar el libro y tirar el marcapáginas).
// Encuadre v1.34: cada escena es un grupo que P.encuadrar centra en la franja de escena. Manos: P.manoImg (v1.35).
// Pregunta escrita arriba los primeros segundos: P.pregunta (v1.36). Celular, apps e iconos genéricos dibujados, sin logos.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, B0, DURATION, txt } = K;
 const S = (i) => A.segments[i].s, Se = (i) => A.segments[i].e;
 const CY = '#3ee6ff', GO = '#ffc845', RD = '#ff4d5e', GR = '#22d27a', INK = '#0d1117';
 const R = (a, b, t) => E.out(win(t, a, b));
 const Tk = {
  desliza: wt(0, 'Deslizas'), cierras0: wt(1, 'cierras'), pregunta: S(2), mito0: S(3), libro: wt(5, 'libro'), marca: wt(5, 'marcapáginas.'),
  sales: wt(6, 'sales'), funcionando: wt(6, 'funcionando:'), congela: wt(7, 'congela,'), pagina: wt(8, 'página'),
  procesador: wt(9, 'procesador…'), gasta: wt(10, 'gasta'), apple: wt(11, 'Apple'), google: wt(11, 'Google'), ayuda: wt(11, 'ayuda.'),
  cierras: wt(12, 'cierras…'), cerrarLibro: wt(13, 'cerrar'), tirar: wt(13, 'tirar'), cero: wt(14, 'cero,'), abrirla: wt(14, 'abrirla'), trabajo: wt(15, 'trabajo.'),
  cerrarla: wt(16, 'cerrarla'), mas: wt(17, 'MÁS'), menos: wt(18, 'menos.'), veredicto: S(19), mito: wt(20, 'mito.'),
  traba: wt(21, 'traba…'), ubicacion: wt(22, 'ubicación'), musica: wt(22, 'música'), necesitas: wt(22, 'necesitas.'), envia: S(23),
 };
 const tV = Tk.mito - 0.05;

 // ---------- dibujo compartido con los caps. 3 y 4 (misma serie, mismo aspecto) ----------
 const fondo = (ctx, t) => P.fondo(ctx, t);
 const mesa = (ctx, y = 1420) => { const g = ctx.createLinearGradient(0, y, 0, HH); g.addColorStop(0, '#2a3140'); g.addColorStop(1, '#11151d'); ctx.fillStyle = g; ctx.fillRect(0, y, W, HH - y); ctx.fillStyle = 'rgba(62,230,255,0.25)'; ctx.fillRect(0, y, W, 3); };
 // celular genérico (frente): pantalla con barra de estado y batería
 const celular = (ctx, x, y, w, t, o = {}) => { const h = w * 2.05; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 16, w, h, w * 0.14); ctx.fill();
  ctx.fillStyle = '#1b2029'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * 0.14); ctx.fill(); ctx.strokeStyle = '#5a6680'; ctx.lineWidth = 6; ctx.stroke();
  const sw = w * 0.9, sh = h * 0.93; ctx.fillStyle = o.pantalla || '#0b1622'; ctx.beginPath(); ctx.roundRect(-sw / 2, -sh / 2, sw, sh, w * 0.1); ctx.fill();
  ctx.fillStyle = '#05080c'; ctx.beginPath(); ctx.roundRect(-w * 0.12, -sh / 2 + w * 0.04, w * 0.24, w * 0.06, w * 0.03); ctx.fill();
  if (o.bat != null) { const bw = w * 0.13, bh = w * 0.065, bx = sw / 2 - bw - w * 0.06, by = -sh / 2 + w * 0.045; ctx.strokeStyle = '#cfd8e3'; ctx.lineWidth = 2.5; ctx.strokeRect(bx, by, bw, bh); ctx.fillStyle = o.bat > 0.2 ? '#5fd38d' : RD; ctx.fillRect(bx + 2, by + 2, (bw - 4) * cl(o.bat), bh - 4); }
  if (o.avion) { ctx.fillStyle = GO; P.icon(ctx, 'avion', -sw / 2 + w * 0.12, -sh / 2 + w * 0.075, w * 0.08, { mode: 'flat', col: GO }); }
  if (o.dibuja) o.dibuja(ctx, sw, sh);
  ctx.restore(); return { h }; };
 // cargador genérico con cable que entra al celular (enchufe en la base)
 const cargador = (ctx, x, y, s, t, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 72, 70, 10, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e9edf3'; ctx.beginPath(); ctx.roundRect(-60, -70, 120, 140, 18); ctx.fill(); ctx.fillStyle = '#c9d1dc'; ctx.fillRect(-60, 20, 120, 10); ctx.fillStyle = '#9aa3b2'; ctx.fillRect(-22, -95, 10, 28); ctx.fillRect(12, -95, 10, 28);
  if (o.rapido) { ctx.fillStyle = GO; P.icon(ctx, 'rayo', 0, -10, 70, { mode: 'flat', col: GO }); } ctx.restore(); };
 // iconos genéricos de las radios
 const bateria = (ctx, x, y, w, h, nivel, o = {}) => { const lv = cl(nivel), col = o.col || (lv <= 0.05 ? RD : lv < 0.2 ? '#ff9f43' : GR); ctx.save(); ctx.lineWidth = w * 0.045; ctx.strokeStyle = o.borde || '#cfd8e3'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h * 0.18); ctx.stroke(); ctx.fillStyle = o.borde || '#cfd8e3'; ctx.beginPath(); ctx.roundRect(x + w / 2 + w * 0.02, y - h * 0.2, w * 0.05, h * 0.4, 6); ctx.fill();
  const m = w * 0.06; if (lv > 0) { ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.roundRect(x - w / 2 + m, y - h / 2 + m, (w - 2 * m) * lv, h - 2 * m, h * 0.1); ctx.fill(); ctx.shadowBlur = 0; }
  if (o.pct != null) txt(ctx, o.pct, x, y + h * 0.95, h * 0.55, col, { w: 900, f: 'Fredoka' }); ctx.restore(); };
 // pila de níquel (cilíndrica, genérica) con zona «olvidada» (memoria) en gris
 // v1.34 · ENCUADRE: cada escena se dibuja como un grupo que P.encuadrar escala y centra en la franja de escena (subtítulos arriba)
 const ENC = (ctx, caja, fn, o = {}) => P.encuadrar(ctx, caja, fn, Object.assign({ capY: 330, ancho: 0.85 }, o));
 // losa (mesa finita) sobre la que se apoyan los objetos del grupo (nada flota)
 const losa = (c, x0, x1, y) => { const g = c.createLinearGradient(0, y, 0, y + 70); g.addColorStop(0, '#2a3140'); g.addColorStop(1, '#151a23'); c.fillStyle = g; c.beginPath(); c.roundRect(x0, y, x1 - x0, 70, 14); c.fill(); c.fillStyle = 'rgba(62,230,255,0.35)'; c.fillRect(x0 + 10, y, x1 - x0 - 20, 3); };
 // batería vertical grande (corte): nivel 0…1 desde abajo; o.reserva = capa de reserva con candado (0…1); o.limite = raya del 80 % (0…1)
 const bateriaV = (c, x, y, w, h, nivel, o = {}) => { c.save(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(x, y + h / 2 + 6, w * 0.55, 14, 0, 0, TAU); c.fill();
  c.fillStyle = '#0b1622'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 34); c.fill(); c.strokeStyle = '#cfd8e3'; c.lineWidth = 14; c.stroke(); c.fillStyle = '#cfd8e3'; c.beginPath(); c.roundRect(x - w * 0.18, y - h / 2 - 30, w * 0.36, 24, 8); c.fill();
  const m = 22, ih = h - 2 * m, lv = cl(nivel), col = o.col || (lv < 0.1 ? RD : lv < 0.25 ? '#ff9f43' : GR);
  if (lv > 0) { c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 18; c.beginPath(); c.roundRect(x - w / 2 + m, y + h / 2 - m - ih * lv, w - 2 * m, ih * lv, 18); c.fill(); c.shadowBlur = 0; }
  if (o.reserva > 0) { c.globalAlpha *= o.reserva; const rh = ih * 0.16, g = c.createLinearGradient(0, y + h / 2 - m - rh, 0, y + h / 2 - m); g.addColorStop(0, 'rgba(62,230,255,0.95)'); g.addColorStop(1, 'rgba(20,110,170,0.95)'); c.fillStyle = g; c.beginPath(); c.roundRect(x - w / 2 + m, y + h / 2 - m - rh, w - 2 * m, rh, 16); c.fill(); P.glow(c, x, y + h / 2 - m - rh / 2, w * 0.7, '62,230,255', 0.45); P.icon(c, 'candado', x, y + h / 2 - m - rh / 2, rh * 0.75, { mode: 'flat', col: GO });
   c.strokeStyle = 'rgba(255,255,255,0.8)'; c.setLineDash([12, 10]); c.lineWidth = 5; c.beginPath(); c.moveTo(x - w / 2 + m, y + h / 2 - m - rh - 8); c.lineTo(x + w / 2 - m, y + h / 2 - m - rh - 8); c.stroke(); c.setLineDash([]); }
  c.restore(); if (o.limite > 0) { c.save(); c.globalAlpha *= o.limite; const yl = y + h / 2 - m - ih * 0.8; c.strokeStyle = GO; c.setLineDash([16, 10]); c.lineWidth = 7; c.beginPath(); c.moveTo(x - w / 2 - 20, yl); c.lineTo(x + w / 2 + 20, yl); c.stroke(); c.setLineDash([]); c.restore(); } };


 // ---------- dibujo propio del capítulo ----------
 const APPS = [['#2ecc71', 'chat'], ['#ff6b6b', 'camara'], ['#ff9f43', 'nota'], ['#3ea8ff', 'pin'], ['#a29bfe', 'calendario'], ['#00b894', 'globo']];
 // icono de app genérico (cuadrado redondeado + pictograma)
 const appIcon = (c, x, y, s, k) => { const [col, ic] = APPS[k % APPS.length]; c.save(); c.fillStyle = col; c.beginPath(); c.roundRect(x - s / 2, y - s / 2, s, s, s * 0.24); c.fill(); c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.roundRect(x - s / 2, y - s / 2, s, s * 0.45, [s * 0.24, s * 0.24, 0, 0]); c.fill(); P.icon(c, ic, x, y, s * 0.62, { mode: 'flat', col: '#ffffff', col2: col }); c.restore(); };
 // copo de nieve (6 brazos)
 const copo = (c, x, y, r, a = 1) => { c.save(); c.globalAlpha *= a; c.strokeStyle = '#eaf8ff'; c.lineWidth = r * 0.14; c.lineCap = 'round'; for (let q = 0; q < 6; q++) { const an = q * TAU / 6, dx = Math.cos(an), dy = Math.sin(an); c.beginPath(); c.moveTo(x, y); c.lineTo(x + dx * r, y + dy * r); c.moveTo(x + dx * r * 0.55, y + dy * r * 0.55); c.lineTo(x + dx * r * 0.55 + Math.cos(an + 0.8) * r * 0.3, y + dy * r * 0.55 + Math.sin(an + 0.8) * r * 0.3); c.moveTo(x + dx * r * 0.55, y + dy * r * 0.55); c.lineTo(x + dx * r * 0.55 + Math.cos(an - 0.8) * r * 0.3, y + dy * r * 0.55 + Math.sin(an - 0.8) * r * 0.3); c.stroke(); } c.restore(); };
 // marcapáginas (cinta roja con punta en V)
 const cinta = (c, x, y, w, h, a = 1) => { c.save(); c.globalAlpha *= a; c.fillStyle = RD; c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.lineTo(x, y + h - w * 0.55); c.lineTo(x - w / 2, y + h); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,0.22)'; c.fillRect(x - w / 2, y, w * 0.3, h - w * 0.4); c.restore(); };
 // tarjeta de app (vista de multitarea): cabecera con icono, renglones de contenido; o.hielo 0…1 (escarcha + copo), o.marca 0…1, o.pag (n.º de página)
 const tarjeta = (c, x, y, w, h, k, t, o = {}) => { c.save(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.roundRect(x - w / 2 + 8, y - h / 2 + 14, w, h, w * 0.1); c.fill();
  c.fillStyle = '#f4f6fb'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, w * 0.1); c.fill(); c.fillStyle = APPS[k % APPS.length][0]; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h * 0.16, [w * 0.1, w * 0.1, 0, 0]); c.fill();
  appIcon(c, x, y - h / 2 - w * 0.06, w * 0.24, k); c.fillStyle = '#c9d1dc'; for (let r = 0; r < 6; r++) { c.beginPath(); c.roundRect(x - w * 0.38, y - h * 0.22 + r * h * 0.1, w * (r % 3 === 2 ? 0.5 : 0.76), h * 0.045, h * 0.02); c.fill(); }
  if (o.pag) txt(c, o.pag, x, y + h * 0.4, w * 0.11, '#7a8699', { w: 800, f: 'IBM Plex Mono' });
  if (o.hielo > 0) { const hi = cl(o.hielo); c.save(); c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, w * 0.1); c.clip(); c.fillStyle = `rgba(170,225,255,${0.55 * hi})`; c.fillRect(x - w / 2, y - h / 2, w, h); const Rr = H.rng(k * 13 + 5); c.strokeStyle = `rgba(255,255,255,${0.8 * hi})`; c.lineWidth = 3;
   for (let q = 0; q < 26; q++) { const px = x - w / 2 + Rr() * w, py = y - h / 2 + Rr() * h, L = 14 + Rr() * 30, an = Rr() * TAU; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(an) * L * hi, py + Math.sin(an) * L * hi); c.stroke(); } c.restore();
   c.strokeStyle = `rgba(220,245,255,${0.9 * hi})`; c.lineWidth = 6; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, w * 0.1); c.stroke(); copo(c, x, y, w * 0.26 * (0.6 + 0.4 * E.out(hi)), hi); }
  if (o.marca > 0) cinta(c, x + w * 0.3, y - h / 2 - 6, w * 0.13, h * 0.3 * E.out(cl(o.marca)), 1);
  c.restore(); };
 // libro sobre la mesa: abierto 0 (cerrado) … 1 (abierto), con marcapáginas (marca 0…1; vuela con o.vuela 0…1)
 const libro = (c, x, y, s, abierto, marca, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 18, 300, 22, 0, 0, TAU); c.fill();
  const ab = E.inOut(cl(abierto));
  if (ab > 0.02) { const wR = 260, wL = 260 * ab; c.fillStyle = '#7a2f2f'; c.beginPath(); c.roundRect(-wL - 12, -18, wL + wR + 24, 26, 8); c.fill();
   for (const sg of [-1, 1]) { const ww = sg < 0 ? wL : wR; if (ww < 4) continue; c.fillStyle = '#f7f1e3'; c.beginPath(); c.moveTo(0, -6); c.quadraticCurveTo(sg * ww * 0.5, -30, sg * ww, -16); c.lineTo(sg * ww, -340 + (1 - ab) * 0); c.quadraticCurveTo(sg * ww * 0.5, -356, 0, -336); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(120,100,70,0.35)'; c.lineWidth = 6; for (let r = 0; r < 8; r++) { const yy = -296 + r * 34; c.beginPath(); c.moveTo(sg * ww * 0.12, yy); c.lineTo(sg * ww * (r === 7 ? 0.55 : 0.86), yy + 6); c.stroke(); } }
   c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(-6, -336, 12, 330); }
  else { c.fillStyle = '#9b3b3b'; c.beginPath(); c.roundRect(-230, -150, 470, 150, 14); c.fill(); c.fillStyle = '#f7f1e3'; c.fillRect(-218, -132, 446, 114); c.fillStyle = '#b84a4a'; c.beginPath(); c.roundRect(-230, -150, 470, 44, 14); c.fill(); c.fillStyle = 'rgba(120,100,70,0.35)'; for (let r = 0; r < 5; r++) c.fillRect(-212, -96 + r * 16, 434, 4); }
  if (marca > 0) { const v = cl(o.vuela || 0), mx = (ab > 0.02 ? 120 : 160) + v * 420, my = (ab > 0.02 ? -350 : -170) - v * 520 + v * v * 300; c.save(); c.translate(mx, my); c.rotate(v * 3.2); cinta(c, 0, 0, 44, 210 * E.out(cl(marca)), 1 - cl((v - 0.8) / 0.2)); c.restore(); }
  c.restore(); };
 // chip (procesador) con patillas; carga 0 (frío, apagado) … 1 (caliente, rojo, con ondas de calor)
 const chip = (c, x, y, s, carga, t, o = {}) => { const q = cl(carga); c.save(); c.translate(x, y); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(10, s * 0.62, s * 0.6, 18, 0, 0, TAU); c.fill();
  c.fillStyle = '#9aa3b2'; for (let i = 0; i < 6; i++) { const p = -s * 0.38 + i * s * 0.152; c.fillRect(p - 7, -s / 2 - 34, 14, 36); c.fillRect(p - 7, s / 2 - 2, 14, 36); c.fillRect(-s / 2 - 34, p - 7, 36, 14); c.fillRect(s / 2 - 2, p - 7, 36, 14); }
  c.fillStyle = '#1f2633'; c.beginPath(); c.roundRect(-s / 2, -s / 2, s, s, s * 0.08); c.fill(); c.strokeStyle = '#5a6680'; c.lineWidth = 6; c.stroke();
  const col = q < 0.05 ? '#2a3a55' : H.rgba(H.mix('#3ea8ff', '#ff4d5e', q)); c.fillStyle = col; c.beginPath(); c.roundRect(-s * 0.3, -s * 0.3, s * 0.6, s * 0.6, s * 0.06); c.fill();
  if (q > 0.05) P.glow(c, 0, 0, s * (0.5 + 0.4 * q), q > 0.5 ? '255,77,94' : '62,168,255', 0.25 + 0.4 * q);
  txt(c, 'CPU', 0, 0, s * 0.16, q < 0.05 ? '#6c7a94' : '#ffffff', { w: 900, f: 'Fredoka' });
  if (q > 0.6) { c.strokeStyle = `rgba(255,140,90,${0.7 * (q - 0.6) / 0.4})`; c.lineWidth = 7; c.lineCap = 'round'; for (let i = -1; i <= 1; i++) { c.beginPath(); for (let k = 0; k <= 12; k++) { const yy = -s / 2 - 60 - k * 12, xx = i * s * 0.25 + Math.sin(k * 0.9 + t * 9 + i) * 10; k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); } }
  if (o.hielo > 0) { c.fillStyle = `rgba(170,225,255,${0.35 * o.hielo})`; c.beginPath(); c.roundRect(-s / 2, -s / 2, s, s, s * 0.08); c.fill(); copo(c, s * 0.34, -s * 0.34, s * 0.14, o.hielo); }
  c.restore(); };
 // pantalla de inicio (rejilla de apps) dentro del celular
 const inicio = (c, sw, sh, t, o = {}) => { const s = sw * 0.17; for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) { const k = r * 4 + q; appIcon(c, -sw * 0.33 + q * sw * 0.22, -sh * 0.3 + r * sh * 0.13, s, k + (o.d || 0)); } };
 // página de ayuda genérica (documento con renglones, título y marca de verificación)
 const ayuda = (c, x, y, w, h, nom, ok, t) => { c.save(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.roundRect(x - w / 2 + 10, y - h / 2 + 16, w, h, 22); c.fill(); c.fillStyle = '#f4f6fb'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 22); c.fill();
  c.fillStyle = '#dfe5ee'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h * 0.2, [22, 22, 0, 0]); c.fill(); txt(c, 'AYUDA', x, y - h / 2 + h * 0.07, w * 0.09, '#5a6680', { w: 900, f: 'IBM Plex Mono', ls: 4 }); txt(c, nom, x, y - h / 2 + h * 0.145, w * 0.12, INK, { w: 900, f: 'Fredoka' });
  c.fillStyle = '#c9d1dc'; for (let r = 0; r < 7; r++) { c.beginPath(); c.roundRect(x - w * 0.38, y - h * 0.2 + r * h * 0.085, w * (r % 3 === 2 ? 0.5 : 0.76), h * 0.035, 6); c.fill(); }
  if (ok > 0) { P.glow(c, x + w * 0.3, y + h * 0.36, w * 0.3, '34,210,122', 0.5 * ok); P.icon(c, 'check', x + w * 0.3, y + h * 0.36, w * 0.34 * E.out(cl(ok)), { mode: 'flat', col: GR, col2: '#fff' }); }
  c.restore(); };
 // tarjeta de motivo (casos raros): icono grande + rótulo dibujado
 const motivo = (c, x, y, w, h, ic, col, lab, on, t, o = {}) => { c.save(); c.globalAlpha *= 0.45 + 0.55 * cl(on); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.roundRect(x - w / 2 + 8, y - h / 2 + 14, w, h, 30); c.fill(); c.fillStyle = '#1f2a3a'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 30); c.fill(); c.strokeStyle = on > 0.5 ? col : '#3a4252'; c.lineWidth = 8; c.stroke();
  if (on > 0) P.glow(c, x, y - h * 0.12, w * 0.6, col === GO ? '255,200,69' : col === CY ? '62,230,255' : '255,77,94', 0.35 * on);
  if (o.dibujo) o.dibujo(c, x, y - h * 0.12, w * 0.5); else P.icon(c, ic, x, y - h * 0.12, w * 0.5, { mode: 'flat', col: col, col2: '#1f2a3a' });
  txt(c, lab, x, y + h * 0.33, w * 0.15, '#e6edf5', { w: 900, f: 'Fredoka' }); c.restore(); };
 const flecha = (c, x0, y0, x1, y1, col, a = 1) => { c.save(); c.globalAlpha *= a; c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 10; c.lineCap = 'round'; c.setLineDash([18, 14]); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.setLineDash([]); const an = Math.atan2(y1 - y0, x1 - x0); c.beginPath(); c.moveTo(x1 + Math.cos(an) * 10, y1 + Math.sin(an) * 10); c.lineTo(x1 - Math.cos(an - 0.5) * 34, y1 - Math.sin(an - 0.5) * 34); c.lineTo(x1 - Math.cos(an + 0.5) * 34, y1 - Math.sin(an + 0.5) * 34); c.closePath(); c.fill(); c.restore(); };

 // =====================================================================================================
 // ESCENAS (una idea visual por frase, sincronizada con la palabra exacta de la voz)
 // =====================================================================================================
 const B = [];
 const FR_GANCHO = { x0: 30, x1: 910, y0: 600, y1: 1430, cx: 470, cy: 1015, w: 880, h: 830 };   // con la pregunta arriba
 // ---------- 1 · GANCHO A: deslizas hacia arriba y cierras todas tus apps (la batería no se mueve) ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  fondo(ctx, t); P.pregunta(ctx, '¿CERRAR APPS / AHORRA BATERÍA?', t, 0, 4.8, { capY: 330, px: 70, clave: 'BATERÍA?' });
  const vuela = (i) => E.in(win(t, Tk.desliza + 0.25 + i * 0.55, Tk.desliza + 0.75 + i * 0.55));
  const r = ENC(ctx, [20, 300, 960, 1430], (g) => { losa(g, 0, 980, 1410);
   celular(g, 300, 1410 - 492 - 12, 480, t, { bat: 0.62, dibuja: (c, sw, sh) => { c.fillStyle = 'rgba(30,40,60,0.85)'; c.fillRect(-sw / 2, -sh / 2, sw, sh);
    for (let i = 2; i >= 0; i--) { const v = vuela(i); if (v >= 1) continue; c.save(); c.globalAlpha *= 1 - v * 0.6; tarjeta(c, (i - 1) * sw * 0.16, -sh * 0.02 - v * sh * 0.9 + i * 12, sw * 0.62, sh * 0.66, i + 1, t); c.restore(); } } });
   bateriaV(g, 760, 1410 - 330 - 6, 300, 660, 0.62, { col: GR }); });
  // el dedo desliza cada tarjeta hacia arriba
  const i = Math.min(2, Math.floor(Math.max(0, t - Tk.desliza - 0.25) / 0.55)), ph = cl((t - Tk.desliza - 0.25 - i * 0.55) / 0.5);
  const [fx, fy] = r.map(300, 980 - E.inOut(ph) * 330); if (t > Tk.desliza - 0.1 && t < Tk.desliza + 1.95) P.manoImg(ctx, 'frente', fx + 10, fy, 560, { ancla: 'punta', ang: 0.18 });
 }, sfx(k) { for (let i = 0; i < 3; i++) k.play('swish', Tk.desliza + 0.3 + i * 0.55, { gain: 0.35 }); k.play('tick', Tk.cierras0 + 0.3, { gain: 0.2 }); } });

 // ---------- 2 · ¿Cerrarlas ahorra batería? ¿Mito o verdad? ----------
 B.push({ t0: S(2), t1: S(5), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); const a = R(Tk.mito0 - 0.2, Tk.mito0 + 0.2, t), flip = Math.sin(t * 6) > 0;
  ENC(ctx, [0, 560, 960, 1430], (g) => { losa(g, 0, 960, 1410); P.glow(g, 480, 1000, 480, '255,200,69', 0.25 * a);
   celular(g, 480, 1410 - 461 - 12, 450, t, { bat: 0.62, dibuja: (c, sw, sh) => { inicio(c, sw, sh, t); c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(11,22,34,0.82)'; c.fillRect(-sw / 2, -sh / 2, sw, sh); txt(c, '?', 0, 20, 360, GO, { w: 900, f: 'Fredoka' }); c.restore(); } });
   g.save(); g.globalAlpha *= a; for (const [lab, col, x0, on] of [['MITO', RD, 130, flip], ['VERDAD', GR, 830, !flip]]) { g.globalAlpha = a * (on ? 1 : 0.35); g.fillStyle = col; g.beginPath(); g.roundRect(x0 - 130, 760, 260, 100, 22); g.fill(); txt(g, lab, x0, 812, 50, '#fff', { w: 900, f: 'Fredoka' }); } g.restore(); });
 }, sfx(k) { FX.aparece(k, Tk.mito0, 700); for (let i = 0; i < 4; i++) k.play('tick', Tk.mito0 + 0.15 + i * 0.26, { gain: 0.2 }); } });

 // ---------- 3 · Piensa en un libro con marcapáginas ----------
 B.push({ t0: S(5), t1: S(6), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const ab = sm(S(5) - 0.1, Tk.libro + 0.2, t), mk = sm(Tk.marca - 0.15, Tk.marca + 0.35, t);
  ENC(ctx, [-40, 820, 1000, 1440], (g) => { losa(g, -20, 980, 1410); libro(g, 480, 1400, 1.55, ab, mk, t); });
 }, sfx(k) { FX.pasarPagina(k, Tk.libro); k.play('blip', Tk.marca, { f: 700, gain: 0.25 }); } });

 // ---------- 4 · sales de la app: no la deja funcionando, la CONGELA justo en la página donde ibas ----------
 B.push({ t0: S(6), t1: S(9), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const sal = E.inOut(win(t, Tk.sales - 0.1, Tk.sales + 0.6)), hi = sm(Tk.congela - 0.15, Tk.congela + 0.45, t), mk = sm(Tk.pagina - 0.15, Tk.pagina + 0.3, t), noF = sm(Tk.funcionando - 0.4, Tk.funcionando, t) * (1 - hi);
  ENC(ctx, [20, 470, 990, 1440], (g) => { losa(g, 0, 990, 1410);
   celular(g, 270, 1410 - 461 - 12, 450, t, { bat: 0.62, dibuja: (c, sw, sh) => { inicio(c, sw, sh, t, { d: 2 }); c.fillStyle = `rgba(11,22,34,${0.75 * sal})`; c.fillRect(-sw / 2, -sh / 2, sw, sh);
    const cw = lerp(sw, sw * 0.7, sal), ch = lerp(sh, sh * 0.62, sal); tarjeta(c, 0, lerp(0, -sh * 0.04, sal), cw, ch, 2, t, { hielo: hi, marca: mk, pag: 'pág. 37' });
    if (noF > 0) { c.save(); c.globalAlpha *= noF; P.icon(c, 'engranaje', 0, sh * 0.38, 110, { mode: 'flat', col: '#9aa3b2' }); P.icon(c, 'cruz', 40, sh * 0.38 + 30, 70, { mode: 'flat', col: RD, col2: '#fff' }); c.restore(); } } });
   libro(g, 740, 1400, 0.82, 1, mk, t); if (hi > 0) copo(g, 740, 900, 70 * hi, hi * 0.9); });
  P.tag(ctx, 'CONGELADA', 470, 1395, t, Tk.congela, S(9), { mono: true, col: CY, px: 64 });
 }, sfx(k) { k.play('whoosh', Tk.sales, { dur: 0.5, gain: 0.25 }); k.play('error', Tk.funcionando, { f: 'E3', gain: 0.15, minor: true }); FX.crujido(k, Tk.congela); FX.etiqueta(k, Tk.congela); k.play('blip', Tk.pagina, { f: 760, gain: 0.25 }); } });

 // ---------- 5 · congelada no usa el procesador y casi no gasta batería ----------
 B.push({ t0: S(9), t1: S(11), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const cp = sm(Tk.procesador - 0.4, Tk.procesador, t), bt = sm(Tk.gasta - 0.4, Tk.gasta, t), lv = 0.62 - 0.006 * win(t, Tk.gasta, S(11));
  ENC(ctx, [20, 690, 990, 1440], (g) => { losa(g, 0, 990, 1410); chip(g, 290, 1410 - 300, 380, 0, t, { hielo: 1 }); tarjeta(g, 290, 1410 - 300, 170, 240, 2, t, { hielo: 1 });
   g.save(); g.globalAlpha *= 0.35 + 0.65 * bt; bateriaV(g, 760, 1410 - 350 - 6, 300, 700, lv, { col: GR }); g.restore(); });
  P.tag(ctx, 'CPU EN REPOSO', 330, 520, t, Tk.procesador - 0.2, S(11), { mono: true, col: CY, px: 56 }); P.tag(ctx, 'CASI NADA', 660, 1395, t, Tk.gasta, S(11), { mono: true, col: GR, px: 60 });
 }, sfx(k) { FX.etiqueta(k, Tk.procesador - 0.2); FX.correcto(k, Tk.gasta); } });

 // ---------- 6 · lo dicen Apple y Google en sus páginas de ayuda ----------
 B.push({ t0: S(11), t1: S(12), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const a1 = R(Tk.apple - 0.2, Tk.apple + 0.2, t), a2 = R(Tk.google - 0.2, Tk.google + 0.2, t), ok = sm(Tk.ayuda - 0.2, Tk.ayuda + 0.3, t);
  ENC(ctx, [20, 470, 960, 1420], (g) => { g.save(); g.globalAlpha *= a1; g.translate(0, (1 - a1) * 60); ayuda(g, 255, 945, 420, 900, 'Apple', ok, t); g.restore();
   g.save(); g.globalAlpha *= a2; g.translate(0, (1 - a2) * 60); ayuda(g, 725, 945, 420, 900, 'Google', ok, t); g.restore(); });
 }, sfx(k) { FX.aparece(k, Tk.apple - 0.2, 620); FX.aparece(k, Tk.google - 0.2, 680); FX.correcto(k, Tk.ayuda); } });

 // ---------- 7 · si la cierras… es como cerrar el libro y tirar el marcapáginas ----------
 B.push({ t0: S(12), t1: S(14), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const sw0 = E.in(win(t, Tk.cierras - 0.05, Tk.cierras + 0.45)), cb = 1 - E.inOut(win(t, Tk.cerrarLibro - 0.1, Tk.cerrarLibro + 0.45)), vu = win(t, Tk.tirar - 0.05, Tk.tirar + 0.9);
  const r = ENC(ctx, [20, 400, 1000, 1440], (g) => { losa(g, 0, 990, 1410);
   celular(g, 270, 1410 - 461 - 12, 450, t, { bat: 0.62, dibuja: (c, sw, sh) => { c.fillStyle = 'rgba(30,40,60,0.85)'; c.fillRect(-sw / 2, -sh / 2, sw, sh); if (sw0 < 1) { c.save(); c.globalAlpha *= 1 - sw0 * 0.7; tarjeta(c, 0, -sh * 0.04 - sw0 * sh * 0.95, sw * 0.7, sh * 0.62, 2, t, { hielo: 1, marca: 1, pag: 'pág. 37' }); c.restore(); } } });
   libro(g, 740, 1400, 0.82, cb, 1, t, { vuela: vu }); });
  const ph = cl((t - Tk.cierras + 0.35) / 0.8), [fx, fy] = r.map(270, 1000 - E.inOut(ph) * 380); if (t > Tk.cierras - 0.4 && t < Tk.cierras + 0.7) P.manoImg(ctx, 'frente', fx + 10, fy, 560, { ancla: 'punta', ang: 0.18 });
  P.tag(ctx, 'SIN MARCAPÁGINAS', 470, 1395, t, Tk.tirar + 0.3, S(14), { mono: true, col: RD, px: 58 });
 }, sfx(k) { k.play('swish', Tk.cierras, { gain: 0.4 }); k.play('thud', Tk.cerrarLibro + 0.35, { gain: 0.35 }); k.play('whoosh', Tk.tirar, { dur: 0.6, gain: 0.3 }); FX.etiqueta(k, Tk.tirar + 0.3); } });

 // ---------- 8 · la próxima vez tiene que abrirla DESDE CERO y le cuesta más trabajo ----------
 B.push({ t0: S(14), t1: S(16), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const tap = sm(Tk.abrirla - 0.3, Tk.abrirla, t), pr = cl(win(t, Tk.cero - 0.1, Tk.trabajo + 0.3)), ld = cl(win(t, Tk.abrirla, Tk.trabajo));
  const r = ENC(ctx, [20, 470, 990, 1440], (g) => { losa(g, 0, 990, 1410);
   celular(g, 270, 1410 - 461 - 12, 450, t, { bat: 0.62, dibuja: (c, sw, sh) => { inicio(c, sw, sh, t, { d: 2 });
    if (tap > 0) { c.save(); c.globalAlpha *= tap; c.fillStyle = '#f4f6fb'; c.fillRect(-sw / 2, -sh / 2, sw, sh); appIcon(c, 0, -sh * 0.12, sw * 0.32, 2); c.strokeStyle = '#3ea8ff'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.arc(0, sh * 0.12, 46, t * 7, t * 7 + 4.2); c.stroke();
     c.fillStyle = '#dfe5ee'; c.beginPath(); c.roundRect(-sw * 0.36, sh * 0.26, sw * 0.72, 26, 13); c.fill(); c.fillStyle = '#3ea8ff'; c.beginPath(); c.roundRect(-sw * 0.36, sh * 0.26, sw * 0.72 * pr, 26, 13); c.fill(); txt(c, Math.round(pr * 100) + ' %', 0, sh * 0.36, 44, '#5a6680', { w: 800, f: 'IBM Plex Mono' }); c.restore(); } } });
   chip(g, 760, 1410 - 280, 300, 0.15 + 0.85 * ld, t); });
  const [fx, fy] = r.map(270 - 0.33 * 405, 937 - 0.3 * 858);   // icono de la app (primera de la rejilla) if (t > Tk.abrirla - 0.6 && t < Tk.abrirla + 0.35) P.manoImg(ctx, 'frente', fx, fy + 30 * (1 - tap), 520, { ancla: 'punta', ang: 0.12 });
  P.tag(ctx, 'DESDE CERO', 330, 520, t, Tk.cero - 0.1, S(16), { mono: true, col: GO, px: 60 }); P.tag(ctx, 'MÁS TRABAJO', 660, 1395, t, Tk.trabajo - 0.2, S(16), { mono: true, col: RD, px: 60 });
 }, sfx(k) { FX.toque(k, Tk.abrirla); FX.etiqueta(k, Tk.cero - 0.1); k.play('riser', Tk.cero, { dur: Tk.trabajo - Tk.cero + 0.3, gain: 0.2 }); FX.etiqueta(k, Tk.trabajo - 0.2); } });

 // ---------- 9 · así que cerrarla PUEDE gastar MÁS batería, no menos ----------
 B.push({ t0: S(16), t1: Tk.veredicto - 0.35, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const d = win(t, Tk.cerrarla, Tk.menos + 0.3), mas = sm(Tk.mas - 0.2, Tk.mas + 0.2, t);
  ENC(ctx, [-20, 420, 1000, 1440], (g) => { losa(g, -10, 990, 1410);
   bateriaV(g, 240, 1410 - 330 - 6, 300, 660, 0.62 - 0.02 * d, { col: GR }); bateriaV(g, 720, 1410 - 330 - 6, 300, 660, 0.62 - 0.12 * d, { col: d > 0.5 ? GO : GR });
   tarjeta(g, 240, 610, 150, 210, 2, t, { hielo: 1, marca: 1 }); appIcon(g, 720, 610, 150, 2); g.strokeStyle = '#3ea8ff'; g.lineWidth = 10; g.beginPath(); g.arc(720, 610, 100, t * 6, t * 6 + 4); g.stroke();
   txt(g, 'DEJARLA', 240, 1460, 58, '#e6edf5', { w: 900, f: 'Fredoka' }); txt(g, 'CERRARLA', 720, 1460, 58, '#e6edf5', { w: 900, f: 'Fredoka' });
   if (mas > 0) flecha(g, 900, 760, 900, 760 + 260 * mas, RD, mas); });
  P.tag(ctx, 'PUEDE GASTAR MÁS', 470, 500, t, Tk.mas - 0.2, Tk.veredicto - 0.35, { mono: true, col: RD, px: 58 });
 }, sfx(k) { FX.etiqueta(k, Tk.mas - 0.2); k.play('error', Tk.mas, { f: 'A2', gain: 0.25, minor: true }); } });

 // ---------- 10 · VEREDICTO: MITO (sello de la serie) ----------
 B.push({ t0: Tk.veredicto - 0.35, t1: S(21), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); ENC(ctx, [0, 560, 960, 1430], (g) => { losa(g, 0, 960, 1410); celular(g, 480, 1410 - 461 - 12, 450, t, { bat: 0.62, dibuja: (c, sw, sh) => inicio(c, sw, sh, t) }); });
  ctx.fillStyle = `rgba(5,8,12,${0.55 * sm(Tk.veredicto - 0.3, Tk.veredicto, t)})`; ctx.fillRect(0, 0, W, HH);
  P.veredicto(ctx, t, tV, 'MITO', { y: 1000 });
 }, sfx(k) { k.play('riser', Tk.veredicto - 0.3, { dur: tV - Tk.veredicto + 0.2, gain: 0.25, minor: true }); FX.veredicto(k, tV, 'MITO'); } });

 // ---------- 11 · solo vale la pena cerrarla si se traba… o si usa la ubicación o la música de fondo ----------
 B.push({ t0: S(21), t1: S(23), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const o1 = sm(Tk.traba - 0.3, Tk.traba, t), o2 = sm(Tk.ubicacion - 0.2, Tk.ubicacion + 0.1, t), o3 = sm(Tk.musica - 0.2, Tk.musica + 0.1, t), fin = sm(Tk.necesitas - 0.4, Tk.necesitas, t);
  ENC(ctx, [0, 690, 990, 1440], (g) => { losa(g, -10, 1000, 1410);
   motivo(g, 165, 1060, 300, 680, 'alerta', RD, 'SE TRABA', o1, t, { dibujo: (c, x, y, s) => { tarjeta(c, x, y + 20, s * 0.8, s * 1.1, 1, t); c.strokeStyle = RD; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.arc(x, y + 20, s * 0.22, t * 2, t * 2 + 4.4); c.stroke(); } });
   motivo(g, 495, 1060, 300, 680, 'pin', CY, 'UBICACIÓN', o2, t); motivo(g, 825, 1060, 300, 680, 'nota', GO, 'MÚSICA', o3, t);
   for (const [x, on] of [[165, o1], [495, o2], [825, o3]]) if (on > 0.3) P.icon(g, 'check', x + 110, 745, 110 * E.out(cl((on - 0.3) / 0.7)), { mode: 'flat', col: GR, col2: '#fff' }); });
  P.tag(ctx, 'SÍ CIERRA', 470, 520, t, Tk.traba, S(23), { mono: true, col: GR, px: 60 });
 }, sfx(k) { FX.etiqueta(k, Tk.traba); FX.correcto(k, Tk.traba + 0.2); FX.correcto(k, Tk.ubicacion + 0.1); FX.correcto(k, Tk.musica + 0.1); } });

 // ---------- 12 · CIERRE ----------
 B.push({ t0: S(23), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); P.ctaShare(ctx, t, S(23) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { P.fondo(cc, t); mesa(cc); celular(cc, 480, 1060, 380, t, { bat: 0.62, dibuja: (c2, sw, sh) => inicio(c2, sw, sh, t) }); P.veredicto(cc, t, -10, 'MITO', { y: 760 }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(23) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'tecno', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['apps.', 'batería?', 'verdad?', 'marcapáginas.', 'congela,', 'página', 'procesador…', 'batería.', 'Apple', 'Google', 'cierras…', 'tirar', 'cero,', 'trabajo.', 'MÁS', 'mito.', 'traba…', 'ubicación', 'música', 'amigo'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 600, gain: 0.006, a: 0.05, hold: DURATION - 2.2 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 104, gain: 0.55, chords: [['D2', 'F2', 'A2', 'D3'], ['A#1', 'D2', 'F2', 'A#2'], ['F2', 'A2', 'C3', 'F3'], ['C2', 'E2', 'G2', 'C3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
