// =====================================================================================================
// episodio.js — «¿Mito o verdad?» Cap. 6 · ¿Un imán puede borrar tu celular? · PLANTILLA ASOMBROTECA v1.36b · «tecno»
// Serie: serie_mito_verdad (P.veredicto + FX.veredicto). Veredicto: MITO. UN solo vídeo con UN gancho (v1.34): el C.
// Voz: ElevenLabs Eleven v4, Dan, UNA toma (929 caracteres), 23 tramos, 58,0 s. Metáfora sostenida: LETRAS IMANTADAS en la nevera
// (lo magnético, que otro imán desordena) frente a TINTA EN UN CUADERNO (la memoria flash del celular). Encuadre v1.34 (P.encuadrar),
// manos P.manoImg, pregunta fija con P.pregunta. Celular, imanes, nevera, disco duro, cuaderno, brújula y tarjeta genéricos, sin logos.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, B0, DURATION, txt } = K;
 const S = (i) => A.segments[i].s, Se = (i) => A.segments[i].e;
 const CY = '#3ee6ff', GO = '#ffc845', RD = '#ff4d5e', GR = '#22d27a', INK = '#0d1117';
 const R = (a, b, t) => E.out(win(t, a, b));
 const Tk = {
  imanes: wt(0, 'imanes'), borra: wt(1, 'borra.'), mito0: S(3), letras: wt(4, 'letras'), magnetico: wt(6, 'magnético.'), desordenar: wt(7, 'desordenarlos.'), celdas: wt(9, 'celdas'), tinta: wt(10, 'tinta'), cuaderno: wt(10, 'cuaderno.'),
  encima: wt(12, 'encima'), nada: wt(12, 'nada.'), afecta: wt(14, 'afecta.'), brujula: wt(15, 'brújula'), marcar: wt(15, 'marcar'), banda: wt(16, 'banda'), funda: wt(16, 'funda:'), imantadas: wt(17, 'imantadas,'), danarse: wt(17, 'dañarse.'),
  veredicto: S(18), mito: wt(19, 'mito.'), saca: wt(21, 'saca'), funda2: wt(21, 'funda'), iman2: wt(21, 'imán'), cargador: wt(21, 'cargador'), envia: S(22),
 };
 const tV = Tk.mito - 0.05;

 // ---------- dibujo compartido con los caps. 1-5 (misma serie, mismo aspecto) ----------
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
 // imán de herradura (rojo con puntas plateadas); ang = giro; brillo de campo con o.campo 0…1
 const herradura = (c, x, y, s, t, o = {}) => { c.save(); c.translate(x, y); c.rotate(o.ang || 0); c.scale(s, s);
  if (o.campo > 0) { c.strokeStyle = `rgba(62,230,255,${0.55 * o.campo})`; c.lineWidth = 6; for (let q = 1; q <= 3; q++) { const r = 40 + q * 38 + ((t * 60) % 38); c.beginPath(); c.arc(0, 150, r, Math.PI * 0.05, Math.PI * 0.95); c.stroke(); } }
  c.lineCap = 'butt'; c.strokeStyle = '#e04050'; c.lineWidth = 70; c.beginPath(); c.arc(0, 0, 90, Math.PI, 0, false); c.lineTo(90, 120); c.moveTo(-90, 0); c.lineTo(-90, 120); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 14; c.beginPath(); c.arc(0, 0, 112, Math.PI * 1.1, Math.PI * 1.6); c.stroke();
  c.fillStyle = '#cfd8e3'; c.fillRect(-125, 120, 70, 60); c.fillRect(55, 120, 70, 60); c.restore(); };
 // letra imantada de nevera
 const letra = (c, ch, x, y, s, col, a = 0) => { c.save(); c.translate(x, y); c.rotate(a); txt(c, ch, 3, 5, s, 'rgba(0,0,0,0.35)', { w: 900, f: 'Fredoka' }); txt(c, ch, 0, 0, s, col, { w: 900, f: 'Fredoka' }); c.restore(); };
 // puerta de nevera con letras imantadas; o.desorden 0…1 las revuelve
 const nevera = (c, x, y, w, h, t, o = {}) => { c.save(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(x, y + h / 2 + 10, w * 0.55, 18, 0, 0, TAU); c.fill(); const g = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#dfe5ee'); g.addColorStop(0.5, '#f4f6fb'); g.addColorStop(1, '#c9d1dc'); c.fillStyle = g; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 30); c.fill();
  c.fillStyle = '#9aa3b2'; c.beginPath(); c.roundRect(x + w * 0.36, y - h * 0.3, 16, h * 0.25, 8); c.fill(); c.fillStyle = '#c9d1dc'; c.fillRect(x - w / 2, y - h * 0.08, w, 8);
  const W2 = o.palabra || 'DATOS', cols = ['#ff4d5e', '#3ea8ff', '#22d27a', '#ffc845', '#a29bfe', '#ff9f43'], Rr = H.rng(o.seed || 3), d = o.desorden || 0;
  [...W2].forEach((ch, i) => { const bx = x - w * 0.06 - (W2.length - 1) * w * 0.07 + i * w * 0.14, by = y - h * 0.22, rx = x - w * 0.36 + Rr() * w * 0.72, ry = y - h * 0.38 + Rr() * h * 0.7, ra = (Rr() - 0.5) * 2; letra(c, ch, lerp(bx, rx, d), lerp(by, ry, d), w * 0.15, cols[i % cols.length], ra * d); });
  c.restore(); };
 // disco duro abierto (plato magnético + brazo); o.borra 0…1 = chispas y sectores que se apagan
 const disco = (c, x, y, s, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 230, 230, 16, 0, 0, TAU); c.fill(); c.fillStyle = '#6c7a94'; c.beginPath(); c.roundRect(-220, -260, 440, 480, 30); c.fill(); c.strokeStyle = '#8f9bb0'; c.lineWidth = 6; c.stroke();
  const g = c.createRadialGradient(-30, -60, 20, 0, -20, 190); g.addColorStop(0, '#f4f6fb'); g.addColorStop(1, '#8f9bb0'); c.fillStyle = g; c.beginPath(); c.arc(0, -20, 180, 0, TAU); c.fill();
  c.save(); c.rotate(t * 3); c.strokeStyle = 'rgba(40,50,70,0.25)'; c.lineWidth = 2; for (let r = 60; r < 180; r += 16) { c.beginPath(); c.arc(0, -20, r, 0, TAU); c.stroke(); } if (o.borra > 0) { const Rr = H.rng(8); for (let i = 0; i < 18; i++) { const a = Rr() * TAU, r = 60 + Rr() * 110; c.fillStyle = `rgba(255,77,94,${0.8 * o.borra})`; c.fillRect(Math.cos(a) * r - 6, -20 + Math.sin(a) * r - 6, 12, 12); } } c.restore();
  c.fillStyle = '#2b2f36'; c.beginPath(); c.arc(0, -20, 30, 0, TAU); c.fill(); c.save(); c.translate(160, 170); c.rotate(-2.4 + Math.sin(t * 2) * 0.15); c.fillStyle = '#cfd8e3'; c.beginPath(); c.roundRect(-14, -10, 28, 200, 10); c.fill(); c.restore(); c.fillStyle = '#2b2f36'; c.beginPath(); c.arc(160, 170, 30, 0, TAU); c.fill(); c.restore(); };
 // cuaderno abierto con letras escritas en tinta
 const cuaderno = (c, x, y, s, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 18, 300, 22, 0, 0, TAU); c.fill(); c.fillStyle = '#2f5aa8'; c.beginPath(); c.roundRect(-290, -360, 580, 370, 14); c.fill();
  for (const sg of [-1, 1]) { c.fillStyle = '#fbf8ee'; c.beginPath(); c.roundRect(sg < 0 ? -275 : 5, -345, 270, 340, 8); c.fill(); c.strokeStyle = 'rgba(62,130,220,0.35)'; c.lineWidth = 3; for (let r = 0; r < 9; r++) { c.beginPath(); c.moveTo(sg < 0 ? -265 : 15, -300 + r * 34); c.lineTo(sg < 0 ? -15 : 265, -300 + r * 34); c.stroke(); } }
  c.fillStyle = '#9aa3b2'; for (let q = 0; q < 8; q++) { c.beginPath(); c.arc(0, -320 + q * 42, 7, 0, TAU); c.fill(); }
  const tx = o.texto || 'DATOS', p = o.escribe ?? 1; c.save(); c.beginPath(); c.rect(-260, -320, 520 * p, 200); c.clip(); txt(c, tx, -130, -230, 92, '#1f3b80', { w: 900, f: 'Fredoka' }); txt(c, 'FOTOS', 140, -230, 70, '#1f3b80', { w: 900, f: 'Fredoka' }); c.restore(); c.restore(); };
 // brújula (aguja desviada con o.desvio, en radianes)
 const brujula = (c, x, y, r, t, o = {}) => { c.save(); c.translate(x, y); c.fillStyle = '#1f2a3a'; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.strokeStyle = '#cfd8e3'; c.lineWidth = r * 0.08; c.stroke(); txt(c, 'N', 0, -r * 0.7, r * 0.26, '#e6edf5', { w: 900, f: 'Fredoka' });
  c.rotate(o.desvio || 0); c.fillStyle = RD; c.beginPath(); c.moveTo(0, -r * 0.62); c.lineTo(r * 0.12, 0); c.lineTo(-r * 0.12, 0); c.closePath(); c.fill(); c.fillStyle = '#e6edf5'; c.beginPath(); c.moveTo(0, r * 0.62); c.lineTo(r * 0.12, 0); c.lineTo(-r * 0.12, 0); c.closePath(); c.fill(); c.fillStyle = '#2b2f36'; c.beginPath(); c.arc(0, 0, r * 0.08, 0, TAU); c.fill(); c.restore(); };
 // tarjeta con banda magnética (o.dano 0…1: la banda parpadea en rojo y se agrieta)
 const tarjetaB = (c, x, y, w, t, o = {}) => { const h = w * 0.63; c.save(); c.translate(x, y); c.rotate(o.ang || 0); c.fillStyle = 'rgba(0,0,0,0.3)'; c.beginPath(); c.roundRect(-w / 2 + 8, -h / 2 + 12, w, h, w * 0.06); c.fill(); const g = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, '#3ea8ff'); g.addColorStop(1, '#6c5ce7'); c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, w * 0.06); c.fill();
  const d = o.dano || 0, blink = d > 0 ? (Math.sin(t * 18) > 0 ? 1 : 0.4) : 0; c.fillStyle = d > 0 ? H.rgba(H.mix('#1b1f27', '#ff4d5e', d * blink)) : '#1b1f27'; c.fillRect(-w / 2, -h * 0.28, w, h * 0.2);
  if (d > 0.5) { c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 3; c.beginPath(); c.moveTo(-w * 0.2, -h * 0.28); c.lineTo(-w * 0.1, -h * 0.18); c.lineTo(-w * 0.15, -h * 0.08); c.moveTo(w * 0.15, -h * 0.28); c.lineTo(w * 0.22, -h * 0.17); c.stroke(); }
  c.fillStyle = 'rgba(255,255,255,0.85)'; c.fillRect(-w * 0.4, h * 0.12, w * 0.5, h * 0.08); c.fillStyle = '#ffd36b'; c.beginPath(); c.roundRect(w * 0.18, h * 0.05, w * 0.18, h * 0.22, 6); c.fill(); c.restore(); };
 // memoria flash: rejilla de celdas eléctricas que se encienden
 const celdas = (c, x, y, w, h, t, o = {}) => { c.save(); c.fillStyle = '#1f2633'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 22); c.fill(); c.strokeStyle = '#5a6680'; c.lineWidth = 6; c.stroke(); const n = 8, m = 6, cw = (w - 60) / n, chh = (h - 60) / m, Rr = H.rng(14);
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const on = Rr() > 0.45, ph = (o.on ?? 1); c.fillStyle = on ? `rgba(62,230,255,${0.25 + 0.65 * ph})` : 'rgba(62,230,255,0.08)'; c.beginPath(); c.roundRect(x - w / 2 + 30 + i * cw + 4, y - h / 2 + 30 + j * chh + 4, cw - 8, chh - 8, 6); c.fill(); if (on && ph > 0.5) { c.fillStyle = '#ffd36b'; c.beginPath(); c.arc(x - w / 2 + 30 + (i + 0.5) * cw, y - h / 2 + 30 + (j + 0.5) * chh, 5, 0, TAU); c.fill(); } }
  c.restore(); };

 // celular por dentro (rayos X): imanes (anillo y altavoces) y memoria; o.imanes 0…1, o.mem 0…1
 const rayosX = (c, sw, sh, t, o = {}) => { c.fillStyle = '#0a1a2e'; c.fillRect(-sw / 2, -sh / 2, sw, sh); c.strokeStyle = 'rgba(120,180,255,0.35)'; c.lineWidth = 3; c.strokeRect(-sw * 0.4, -sh * 0.42, sw * 0.8, sh * 0.84);
  // v2: imanes reconocibles (barras rojo y plata en anillo + dos imanes de herradura), con brillo o.brillo 0…1
  const im = o.imanes || 0, br = o.brillo || 0; if (im > 0) { c.save(); c.globalAlpha *= im; if (br > 0) P.glow(c, 0, sh * 0.05, sw * 0.6, '255,77,94', 0.45 * br);
   const rr = sw * 0.27; for (let q = 0; q < 8; q++) { const a0 = q * TAU / 8; c.save(); c.translate(Math.cos(a0) * rr, sh * 0.05 + Math.sin(a0) * rr); c.rotate(a0 + Math.PI / 2); c.fillStyle = '#e04050'; c.beginPath(); c.roundRect(-34, -16, 34, 32, [8, 0, 0, 8]); c.fill(); c.fillStyle = '#cfd8e3'; c.beginPath(); c.roundRect(0, -16, 34, 32, [0, 8, 8, 0]); c.fill(); c.restore(); }
   herradura(c, 0, -sh * 0.36, 0.32, t, { ang: Math.PI, campo: br }); herradura(c, 0, sh * 0.38, 0.32, t, { ang: 0, campo: br }); c.restore(); }
  const m = o.mem ?? 1; c.save(); c.globalAlpha *= 0.4 + 0.6 * m; c.fillStyle = '#1f2633'; c.beginPath(); c.roundRect(-sw * 0.18, -sh * 0.28, sw * 0.36, sh * 0.14, 10); c.fill(); c.fillStyle = '#ffd36b'; for (let q = 0; q < 6; q++) c.fillRect(-sw * 0.14 + q * sw * 0.05, -sh * 0.25, sw * 0.03, sh * 0.08); c.restore(); };

 // =====================================================================================================
 // ESCENAS
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO C: tu celular ya lleva imanes dentro… y no se borra ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  fondo(ctx, t); const qB = P.pregunta(ctx, '¿UN IMÁN PUEDE / BORRAR TU CELULAR?', t, 0, S(2) - 0.15, { capY: 330, px: 62, clave: 'IMÁN', x: 540, dy: 110 });
  const im = sm(0.0, 0.5, t), brl = sm(Tk.imanes - 0.2, Tk.imanes + 0.2, t) * (0.75 + 0.25 * Math.sin(t * 9)), ok = sm(Tk.borra - 0.2, Tk.borra + 0.2, t), pz = 1 + 0.06 * E.out(win(t, 0, 3));
  ENC(ctx, [10, 380, 1010, 1440], (g) => { g.translate(500, 1000); g.scale(pz, pz); g.translate(-500, -1000); losa(g, 0, 1010, 1410);
   celular(g, 300, 1410 - 461 - 14, 450, t, { bat: 0.7, dibuja: (c, sw, sh) => rayosX(c, sw, sh, t, { imanes: im, brillo: brl, mem: 1 }) });
   celdas(g, 770, 980, 380, 300, t, { on: 0.5 + 0.5 * ok }); txt(g, 'MEMORIA', 770, 790, 54, '#cfd8e3', { w: 900, f: 'Fredoka' }); if (ok > 0) P.icon(g, 'check', 770, 1220, 160 * E.out(ok), { mode: 'flat', col: GR, col2: '#fff' }); },
   { franja: { x0: 30, x1: 1050, y0: qB + 30, y1: 1640, cx: 540, cy: (qB + 30 + 1640) / 2, w: 980, h: 1640 - qB - 30 }, alto: 0.98, ancho: 0.98 });
  P.tag(ctx, 'IMANES', 760, 880, t, Tk.imanes - 0.15, S(2), { mono: true, col: RD, px: 70 });
 }, sfx(k) { k.play('whoosh', 0.05, { dur: 0.6, gain: 0.25 }); FX.revelar(k, 0.2); FX.etiqueta(k, Tk.imanes - 0.15); FX.correcto(k, Tk.borra); } });

 // ---------- 2 · ¿Un imán puede borrar tu celular? ¿Mito o verdad? ----------
 B.push({ t0: S(2), t1: S(4), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); const a = R(Tk.mito0 - 0.2, Tk.mito0 + 0.2, t), flip = Math.sin(t * 6) > 0, ac = E.inOut(win(t, S(2), S(2) + 1.4));
  ENC(ctx, [0, 320, 1000, 1440], (g) => { losa(g, 0, 1000, 1410); celular(g, 300, 1410 - 461 - 14, 450, t, { bat: 0.7, dibuja: (c, sw, sh) => { c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(11,22,34,0.85)'; c.fillRect(-sw / 2, -sh / 2, sw, sh); txt(c, '?', 0, 10, 300, GO, { w: 900, f: 'Fredoka' }); c.restore(); } });
   herradura(g, lerp(900, 760, ac), 900, 1.1, t, { ang: Math.PI / 2, campo: ac });
   g.save(); g.globalAlpha *= a; for (const [lab, col, x0, y0, on] of [['MITO', RD, 150, 330, flip], ['VERDAD', GR, 850, 330, !flip]]) { g.globalAlpha = a * (on ? 1 : 0.35); g.fillStyle = col; g.beginPath(); g.roundRect(x0 - 140, y0, 280, 110, 24); g.fill(); txt(g, lab, x0, y0 + 57, 54, '#fff', { w: 900, f: 'Fredoka' }); } g.restore(); });
 }, sfx(k) { k.play('whoosh', S(2), { dur: 1, gain: 0.2 }); FX.aparece(k, Tk.mito0, 700); for (let i = 0; i < 4; i++) k.play('tick', Tk.mito0 + 0.15 + i * 0.26, { gain: 0.2 }); } });

 // ---------- 3 · piensa en letras imantadas en la nevera ----------
 B.push({ t0: S(4), t1: S(5), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const ap = R(S(4), Tk.letras + 0.3, t);
  ENC(ctx, [100, 420, 900, 1450], (g) => { nevera(g, 500, 920, 720, 1000, t, { palabra: 'DATOS', desorden: 0 }); g.save(); g.globalAlpha *= 1 - ap; g.fillStyle = '#e6eaf1'; g.fillRect(150, 540, 700, 220); g.restore(); }, { ancho: 0.8 });
 }, sfx(k) { for (let i = 0; i < 5; i++) k.play('click', S(4) + 0.2 + i * 0.15, { gain: 0.25 }); } });

 // ---------- 4 · discos duros: disco magnético… y otro imán puede desordenarlos ----------
 B.push({ t0: S(5), t1: S(8), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const mg = sm(Tk.magnetico - 0.2, Tk.magnetico + 0.2, t), pas = win(t, Tk.desordenar - 0.6, Tk.desordenar + 0.8), des = sm(Tk.desordenar - 0.2, Tk.desordenar + 0.5, t);
  ENC(ctx, [0, 660, 1010, 1440], (g) => { losa(g, 0, 1010, 1410); disco(g, 270, 1410 - 230, 1.05, t, { borra: des }); if (mg > 0) P.glow(g, 270, 1155, 260, '62,230,255', 0.35 * mg);
   nevera(g, 770, 1000, 420, 800, t, { palabra: 'DATOS', desorden: des }); if (pas > 0 && pas < 1) herradura(g, lerp(-100, 1100, pas), 620, 0.9, t, { ang: Math.PI, campo: 1 }); });
  P.tag(ctx, 'DISCO MAGNÉTICO', 330, 520, t, Tk.magnetico - 0.2, S(8), { mono: true, col: CY, px: 54 }); P.tag(ctx, 'SE DESORDENAN', 640, 1395, t, Tk.desordenar, S(8), { mono: true, col: RD, px: 54 });
 }, sfx(k) { FX.etiqueta(k, Tk.magnetico - 0.2); k.play('whoosh', Tk.desordenar - 0.6, { dur: 1.2, gain: 0.3 }); k.play('error', Tk.desordenar + 0.1, { f: 'E3', gain: 0.25, minor: true }); FX.etiqueta(k, Tk.desordenar); } });

 // ---------- 5 · la memoria de tu celular no es magnética: celdas eléctricas… como tinta en un cuaderno ----------
 B.push({ t0: S(8), t1: S(11), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const ce = sm(Tk.celdas - 0.3, Tk.celdas + 0.2, t), ti = win(t, Tk.tinta - 0.3, Tk.cuaderno + 0.4);
  ENC(ctx, [0, 590, 1010, 1440], (g) => { losa(g, 0, 1010, 1410);
   celular(g, 230, 1410 - 400 - 14, 390, t, { bat: 0.7, dibuja: (c, sw, sh) => { if (ce < 1) { c.save(); c.globalAlpha *= 1 - ce; P.icon(c, 'camara', 0, -40, 120, { mode: 'flat', col: '#cfd8e3' }); c.restore(); } if (ce > 0) { c.save(); c.globalAlpha *= ce; celdas(c, 0, 0, sw * 0.86, sh * 0.6, t, { on: ce }); c.restore(); } } });
   g.save(); g.globalAlpha *= cl(ti * 3); cuaderno(g, 720, 1400, 0.8, t, { texto: 'DATOS', escribe: ti }); g.restore(); });
  P.tag(ctx, 'NO ES MAGNÉTICA', 330, 520, t, S(8) + 0.4, Tk.celdas - 0.3, { mono: true, col: GR, px: 54 }); P.tag(ctx, 'CELDAS ELÉCTRICAS', 400, 520, t, Tk.celdas - 0.3, S(11), { mono: true, col: CY, px: 54 });
 }, sfx(k) { FX.etiqueta(k, S(8) + 0.4); FX.revelar(k, Tk.celdas - 0.3); k.play('swish', Tk.tinta, { gain: 0.25 }); } });

 // ---------- 6 · un imán de nevera no tiene nada que desordenar: puede pasarle por encima sin borrar nada ----------
 B.push({ t0: S(11), t1: S(13), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const pas = win(t, Tk.encima - 0.5, Tk.nada + 0.4), ok = sm(Tk.nada - 0.1, Tk.nada + 0.3, t);
  ENC(ctx, [0, 680, 1010, 1440], (g) => { losa(g, 0, 1010, 1410);
   celular(g, 230, 1410 - 400 - 14, 390, t, { bat: 0.7, dibuja: (c, sw, sh) => celdas(c, 0, 0, sw * 0.86, sh * 0.6, t, { on: 1 }) }); cuaderno(g, 720, 1400, 0.8, t, { texto: 'DATOS', escribe: 1 });
   const mx = lerp(-60, 1080, E.inOut(pas)); if (pas > 0 && pas < 1) { g.save(); g.translate(mx, 820); g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.ellipse(6, 70, 70, 12, 0, 0, TAU); g.fill(); letra(g, 'A', 0, 0, 160, '#ff4d5e', Math.sin(t * 4) * 0.2); g.restore(); }
   if (ok > 0) { P.icon(g, 'check', 230, 700, 150 * E.out(ok), { mode: 'flat', col: GR, col2: '#fff' }); P.icon(g, 'check', 720, 960, 150 * E.out(ok), { mode: 'flat', col: GR, col2: '#fff' }); } });
  P.tag(ctx, 'NADA SE BORRA', 470, 520, t, Tk.nada - 0.1, S(13), { mono: true, col: GR, px: 58 });
 }, sfx(k) { k.play('whoosh', Tk.encima - 0.5, { dur: 1.0, gain: 0.25 }); FX.correcto(k, Tk.nada); FX.etiqueta(k, Tk.nada - 0.1); } });

 // ---------- 7 · dos cosas que un imán fuerte sí afecta: la brújula, que puede marcar mal ----------
 B.push({ t0: S(13), t1: S(16), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const ac = E.inOut(win(t, Tk.afecta - 0.6, Tk.afecta + 0.4)), br = sm(Tk.brujula - 0.3, Tk.brujula + 0.1, t), dv = sm(Tk.marcar - 0.4, Tk.marcar + 0.2, t);
  ENC(ctx, [0, 440, 1010, 1440], (g) => { losa(g, 0, 1010, 1410);
   celular(g, 300, 1410 - 461 - 14, 450, t, { bat: 0.7, dibuja: (c, sw, sh) => { c.save(); c.globalAlpha *= br; brujula(c, 0, -20, sw * 0.38, t, { desvio: dv * (1.3 + Math.sin(t * 9) * 0.25) }); c.restore(); txt(c, '2', sw * 0.32, -sh * 0.4, 60, GO, { w: 900, f: 'Fredoka' }); } });
   herradura(g, lerp(900, 760, ac), 900, 1.1, t, { ang: Math.PI / 2, campo: ac }); });
  P.tag(ctx, 'BRÚJULA', 330, 520, t, Tk.brujula - 0.2, S(16), { mono: true, col: GO, px: 60 }); P.tag(ctx, 'MARCA MAL', 640, 1395, t, Tk.marcar - 0.1, S(16), { mono: true, col: RD, px: 56 });
 }, sfx(k) { k.play('whoosh', Tk.afecta - 0.6, { dur: 0.8, gain: 0.25 }); FX.etiqueta(k, Tk.brujula - 0.2); for (let i = 0; i < 6; i++) k.play('tick', Tk.marcar + i * 0.12, { gain: 0.15 }); FX.etiqueta(k, Tk.marcar - 0.1); } });

 // ---------- 8 · las tarjetas con banda magnética de la funda: esas sí son letras imantadas, y pueden dañarse ----------
 B.push({ t0: S(16), t1: Tk.veredicto - 0.35, in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const tj = E.out(win(t, S(16), Tk.funda + 0.3)), ac = E.inOut(win(t, Tk.imantadas - 0.6, Tk.danarse)), dn = sm(Tk.danarse - 0.4, Tk.danarse + 0.2, t), le = sm(Tk.imantadas - 0.2, Tk.imantadas + 0.2, t);
  ENC(ctx, [0, 440, 1010, 1440], (g) => { losa(g, 0, 1010, 1410);
   tarjetaB(g, 330 + 180 * tj, 1000 - 60 * tj, 360, t, { ang: 0.12, dano: dn });
   g.fillStyle = '#3a2a22'; g.beginPath(); g.roundRect(80, 520, 460, 880, 50); g.fill(); g.fillStyle = '#4a3528'; g.beginPath(); g.roundRect(100, 540, 420, 840, 40); g.fill();   // funda tipo cartera
   celular(g, 310, 960, 400, t, { bat: 0.7 });
   if (le > 0) { g.save(); g.globalAlpha *= le * (1 - dn * 0.5); letra(g, 'A', 610, 690, 110, '#ffc845', -0.2); letra(g, 'B', 700, 680, 110, '#3ea8ff', 0.15); g.restore(); }
   herradura(g, lerp(900, 800, ac), 1180, 0.9, t, { ang: Math.PI / 2, campo: ac }); });
  P.tag(ctx, 'BANDA MAGNÉTICA', 400, 520, t, Tk.banda - 0.2, Tk.veredicto - 0.35, { mono: true, col: RD, px: 54 });
 }, sfx(k) { k.play('swish', S(16) + 0.2, { gain: 0.3 }); FX.etiqueta(k, Tk.banda - 0.2); k.play('whoosh', Tk.imantadas - 0.6, { dur: 0.8, gain: 0.25 }); k.play('error', Tk.danarse, { f: 'C3', gain: 0.3 }); } });

 // ---------- 9 · VEREDICTO: MITO ----------
 B.push({ t0: Tk.veredicto - 0.35, t1: S(20), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); ENC(ctx, [0, 400, 1000, 1440], (g) => { losa(g, 0, 1000, 1410); celular(g, 300, 1410 - 461 - 14, 450, t, { bat: 0.7, dibuja: (c, sw, sh) => rayosX(c, sw, sh, t, { imanes: 1, brillo: 0.6, mem: 1 }) }); herradura(g, 780, 900, 1.15, t, { ang: Math.PI / 2, campo: 1 }); });
  ctx.fillStyle = `rgba(5,8,12,${0.55 * sm(Tk.veredicto - 0.3, Tk.veredicto, t)})`; ctx.fillRect(0, 0, W, HH);
  P.veredicto(ctx, t, tV, 'MITO', { y: 1000 });
 }, sfx(k) { k.play('riser', Tk.veredicto - 0.3, { dur: tV - Tk.veredicto + 0.2, gain: 0.25, minor: true }); FX.veredicto(k, tV, 'MITO'); } });

 // ---------- 10 · tu celular está a salvo… pero saca las tarjetas de la funda antes de acercarlo a un imán o a un cargador magnético ----------
 B.push({ t0: S(20), t1: S(22), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const sa = sm(S(20), S(20) + 0.4, t), sc = E.inOut(win(t, Tk.saca - 0.1, Tk.funda2 + 0.4)), im = sm(Tk.iman2 - 0.3, Tk.iman2, t), cg = sm(Tk.cargador - 0.3, Tk.cargador, t);
  const r = ENC(ctx, [0, 440, 1010, 1440], (g) => { losa(g, 0, 1010, 1410);
   celular(g, 260, 1410 - 430 - 14, 420, t, { bat: 0.7, dibuja: (c, sw, sh) => { if (sa > 0) P.icon(c, 'escudo', 0, -30, 200 * sa, { mode: 'flat', col: GR, col2: '#0b1622' }); } });
   g.save(); g.globalAlpha *= 0.35 + 0.65 * im; herradura(g, 760, 760, 0.75, t, { ang: Math.PI / 2, campo: im }); g.restore();
   g.save(); g.globalAlpha *= 0.35 + 0.65 * cg; g.fillStyle = '#e9edf3'; g.beginPath(); g.ellipse(760, 1250, 150, 40, 0, 0, TAU); g.fill(); g.strokeStyle = CY; g.lineWidth = 8; g.beginPath(); g.ellipse(760, 1240, 100, 24, 0, 0, TAU); g.stroke(); g.restore(); });
  // la mano saca la tarjeta de la funda
  if (sc > 0 && sc < 1) { const [hx, hy] = r.map(260 + sc * 380, 1100 - sc * 250); P.manoImg(ctx, 'sostiene_tarjeta', hx, hy, 380 * r.k, { ancla: 'centro' }); }
  P.tag(ctx, 'SACA LAS TARJETAS', 470, 520, t, Tk.saca - 0.1, S(22), { mono: true, col: GO, px: 54 });
 }, sfx(k) { FX.correcto(k, S(20) + 0.1); k.play('swish', Tk.saca, { gain: 0.3 }); FX.etiqueta(k, Tk.saca - 0.1); FX.aparece(k, Tk.iman2 - 0.3, 620); FX.aparece(k, Tk.cargador - 0.3, 700); } });

 // ---------- 11 · CIERRE ----------
 B.push({ t0: S(22), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); P.ctaShare(ctx, t, S(22) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { P.fondo(cc, t); nevera(cc, 480, 1060, 600, 900, t, { palabra: 'DATOS' }); P.veredicto(cc, t, -10, 'MITO', { y: 760 }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(22) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'tecno', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['imanes', 'borra.', 'celular?', 'verdad?', 'nevera.', 'magnético.', 'desordenarlos.', 'magnética.', 'eléctricas…', 'tinta', 'nada.', 'brújula', 'mal.', 'banda', 'dañarse.', 'mito.', 'salvo…', 'tarjetas', 'amigo'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 600, gain: 0.006, a: 0.05, hold: DURATION - 2.2 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 104, gain: 0.55, chords: [['D2', 'F2', 'A2', 'D3'], ['A#1', 'D2', 'F2', 'A#2'], ['F2', 'A2', 'C3', 'F3'], ['C2', 'E2', 'G2', 'C3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
