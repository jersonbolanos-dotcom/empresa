// =====================================================================================================
// episodio.js — «¿Mito o verdad?» Cap. 1 · ¿Cargar el celular toda la noche daña la batería? · PLANTILLA ASOMBROTECA v1.36b · «tecno»
// Serie: serie_mito_verdad (P.veredicto + FX.veredicto). Veredicto: A MEDIAS. UN solo vídeo con UN gancho (v1.34): el A.
// Voz: ElevenLabs Eleven v4, Dan, UNA toma (928 caracteres), 25 tramos, 58,8 s. Metáfora sostenida: un GLOBO (cargar = soplar;
// al 100 % deja de soplar; inflado al máximo durante horas se cansa; al sol, peor). Encuadre v1.34 con P.encuadrar; manos con
// P.manoImg (v1.35); pregunta fija y centrada con P.pregunta (v1.36b). Celular, cargador, cama, almohada y bomba genéricos, sin logos.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, B0, DURATION, txt } = K;
 const S = (i) => A.segments[i].s, Se = (i) => A.segments[i].e;
 const CY = '#3ee6ff', GO = '#ffc845', RD = '#ff4d5e', GR = '#22d27a', INK = '#0d1117';
 const R = (a, b, t) => E.out(win(t, a, b));
 const Tk = {
  enchufas: wt(0, 'enchufas'), noche: wt(1, 'noche.'), globo: wt(5, 'globo.'), cien: wt(6, '100'), soplar: wt(6, 'soplar:'), para: S(7), poquito: wt(8, 'poquito'),
  maximo: wt(9, 'máximo'), horas: wt(9, 'horas'), cansa: wt(9, 'cansa.'), algo: wt(10, 'algo'), sabe: wt(11, 'sabe'), despiertas: wt(11, 'despiertas.'),
  ochenta: wt(12, '80'), noche2: wt(12, 'noche…'), termina: wt(13, 'termina'), levantes: wt(13, 'levantes.'), desgasta: wt(14, 'desgasta'), anos: wt(14, 'años'),
  cien2: wt(15, '100'), calor: wt(16, 'calor.'), sol: wt(17, 'sol.'), almohada: wt(18, 'almohada:'), apple: wt(19, 'Apple'), desaconsejan: wt(19, 'desaconsejan.'),
  veredicto: S(20), medias: wt(21, 'medias.'), problema: wt(22, 'problema…'), optimizada: wt(23, 'optimizada'), aire: wt(23, 'aire.'), envia: S(24),
 };
 const tV = Tk.medias - 0.05;

 // ---------- dibujo compartido con los caps. 2-4 (misma serie, mismo aspecto) ----------
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

 const APPS = [['#2ecc71', 'chat'], ['#ff6b6b', 'camara'], ['#ff9f43', 'nota'], ['#3ea8ff', 'pin'], ['#a29bfe', 'calendario'], ['#00b894', 'globo']];
 // icono de app genérico (cuadrado redondeado + pictograma)
 const appIcon = (c, x, y, s, k) => { const [col, ic] = APPS[k % APPS.length]; c.save(); c.fillStyle = col; c.beginPath(); c.roundRect(x - s / 2, y - s / 2, s, s, s * 0.24); c.fill(); c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.roundRect(x - s / 2, y - s / 2, s, s * 0.45, [s * 0.24, s * 0.24, 0, 0]); c.fill(); P.icon(c, ic, x, y, s * 0.62, { mode: 'flat', col: '#ffffff', col2: col }); c.restore(); };
 // copo de nieve (6 brazos)
 const copo = (c, x, y, r, a = 1) => { c.save(); c.globalAlpha *= a; c.strokeStyle = '#eaf8ff'; c.lineWidth = r * 0.14; c.lineCap = 'round'; for (let q = 0; q < 6; q++) { const an = q * TAU / 6, dx = Math.cos(an), dy = Math.sin(an); c.beginPath(); c.moveTo(x, y); c.lineTo(x + dx * r, y + dy * r); c.moveTo(x + dx * r * 0.55, y + dy * r * 0.55); c.lineTo(x + dx * r * 0.55 + Math.cos(an + 0.8) * r * 0.3, y + dy * r * 0.55 + Math.sin(an + 0.8) * r * 0.3); c.moveTo(x + dx * r * 0.55, y + dy * r * 0.55); c.lineTo(x + dx * r * 0.55 + Math.cos(an - 0.8) * r * 0.3, y + dy * r * 0.55 + Math.sin(an - 0.8) * r * 0.3); c.stroke(); } c.restore(); };
 // marcapáginas (cinta roja con punta en V)
 const cinta = (c, x, y, w, h, a = 1) => { c.save(); c.globalAlpha *= a; c.fillStyle = RD; c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.lineTo(x, y + h - w * 0.55); c.lineTo(x - w / 2, y + h); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,0.22)'; c.fillRect(x - w / 2, y, w * 0.3, h - w * 0.4); c.restore(); };
 // tarjeta de app (vista de multitarea): cabecera con icono, renglones de contenido; o.hielo 0…1 (escarcha + copo), o.marca 0…1, o.pag (n.º de página)

 // ---------- dibujo propio del capítulo ----------
 // mesita de noche (se apoya en el suelo; tablero a la altura y)
 const mesita = (c, x, y, w) => { c.save(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(x, y + 380, w * 0.6, 20, 0, 0, TAU); c.fill(); c.fillStyle = '#5b4232'; c.fillRect(x - w / 2 + 20, y + 30, w - 40, 340); c.fillStyle = '#6e5140'; c.beginPath(); c.roundRect(x - w / 2, y, w, 40, 10); c.fill();
  c.fillStyle = '#4a3528'; c.fillRect(x - w / 2 + 40, y + 70, w - 80, 120); c.fillStyle = '#c9a26b'; c.beginPath(); c.arc(x, y + 130, 10, 0, TAU); c.fill(); c.restore(); };
 // lámpara de mesita (encendida 0…1)
 const lampara = (c, x, y, on) => { c.save(); if (on > 0) P.glow(c, x, y - 150, 330, '255,214,140', 0.45 * on); c.fillStyle = '#8f9bb0'; c.fillRect(x - 8, y - 130, 16, 130); c.fillStyle = '#6c7a94'; c.beginPath(); c.ellipse(x, y - 4, 60, 12, 0, 0, TAU); c.fill();
  c.fillStyle = on > 0.5 ? '#ffe2a8' : '#c9b48a'; c.beginPath(); c.moveTo(x - 50, y - 130); c.lineTo(x + 50, y - 130); c.lineTo(x + 80, y - 230); c.lineTo(x - 80, y - 230); c.closePath(); c.fill(); c.restore(); };
 // cama con almohada (vista lateral, sobre el suelo; colchón a la altura y)
 const cama = (c, x, y, w, o = {}) => { c.save(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(x, y + 210, w * 0.55, 22, 0, 0, TAU); c.fill(); c.fillStyle = '#3b4766'; c.fillRect(x - w / 2, y + 60, w, 140); c.fillStyle = '#2e3852'; c.fillRect(x - w / 2 - 20, y - 160, 40, 370);
  c.fillStyle = '#e8ecf5'; c.beginPath(); c.roundRect(x - w / 2, y, w, 80, 24); c.fill(); c.fillStyle = '#6c8fd6'; c.beginPath(); c.roundRect(x - w / 2 + w * 0.32, y - 12, w * 0.68, 70, 26); c.fill(); c.fillStyle = 'rgba(255,255,255,0.18)'; c.fillRect(x - w / 2 + w * 0.36, y - 4, w * 0.6, 14);
  // almohada (se levanta un poco si o.debajo)
  const ay = y - 46 - (o.levanta || 0); c.fillStyle = '#f7f9fd'; c.beginPath(); c.ellipse(x - w / 2 + w * 0.17, ay, w * 0.15, 46, 0, 0, TAU); c.fill(); c.strokeStyle = '#d6dce8'; c.lineWidth = 5; c.stroke(); c.restore(); };
 // ventana con luna o sol
 const ventana = (c, x, y, w, h, noche, t) => { c.save(); const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, noche > 0.5 ? '#0d1b3a' : '#7cc4ff'); g.addColorStop(1, noche > 0.5 ? '#1c2f5c' : '#cfe9ff'); c.fillStyle = g; c.beginPath(); c.roundRect(x - w / 2, y, w, h, 12); c.fill();
  if (noche > 0.5) { c.fillStyle = '#f2f0d8'; c.beginPath(); c.arc(x + w * 0.18, y + h * 0.32, w * 0.13, 0, TAU); c.fill(); c.fillStyle = g; c.beginPath(); c.arc(x + w * 0.24, y + h * 0.27, w * 0.11, 0, TAU); c.fill(); for (let q = 0; q < 6; q++) { const Rr = H.rng(q + 3); c.fillStyle = `rgba(255,255,255,${0.4 + 0.4 * Math.sin(t * 2 + q)})`; c.fillRect(x - w / 2 + Rr() * w, y + Rr() * h * 0.7, 4, 4); } }
  c.strokeStyle = '#5a6680'; c.lineWidth = 10; c.beginPath(); c.roundRect(x - w / 2, y, w, h, 12); c.stroke(); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + h); c.moveTo(x - w / 2, y + h / 2); c.lineTo(x + w / 2, y + h / 2); c.stroke(); c.restore(); };
 // globo en la boquilla de una bomba de inflar apoyada en el suelo (suelo en y). tam 0…1.15 (1 = lleno), canso 0…1 (arrugas y color apagado), calor 0…1
 const globo = (c, x, y, s, tam, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 6, 150, 16, 0, 0, TAU); c.fill();
  // bomba: base, cilindro, mango (baja con o.bombeo 0…1)
  c.fillStyle = '#3a4252'; c.beginPath(); c.roundRect(-130, -26, 260, 30, 10); c.fill(); c.fillStyle = '#5a6680'; c.beginPath(); c.roundRect(-40, -300, 80, 280, 16); c.fill(); const hb = (o.bombeo || 0) * 90;
  c.fillStyle = '#9aa3b2'; c.fillRect(-8, -390 + hb, 16, 100); c.fillStyle = '#cfd8e3'; c.beginPath(); c.roundRect(-90, -410 + hb, 180, 28, 12); c.fill();
  c.strokeStyle = '#2b2f36'; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(40, -60); c.quadraticCurveTo(170, -40, 190, -150); c.stroke();
  // globo
  const k = Math.max(0.12, tam), rx = 150 * k, ry = 180 * k, cyb = -170 - ry, col = H.mix(o.col || '#ff4d5e', '#8a6f78', 0.55 * (o.canso || 0)), wob = (o.calor || 0) * Math.sin(t * 12) * 6;
  c.fillStyle = H.rgba(col); c.beginPath(); c.ellipse(190 + wob, cyb, rx + wob, ry, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(178, -160); c.lineTo(202, -160); c.lineTo(190, -176); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(190 - rx * 0.4, cyb - ry * 0.35, rx * 0.18, ry * 0.26, -0.4, 0, TAU); c.fill();
  if (o.canso > 0) { c.strokeStyle = `rgba(60,20,30,${0.5 * o.canso})`; c.lineWidth = 4; for (let q = 0; q < 7; q++) { const an = -1.2 + q * 0.4; c.beginPath(); c.arc(190, cyb, rx * (0.55 + 0.05 * (q % 3)), an, an + 0.25); c.stroke(); } }
  if (o.calor > 0) { c.strokeStyle = `rgba(255,140,90,${0.7 * o.calor})`; c.lineWidth = 7; for (let i = -1; i <= 1; i++) { c.beginPath(); for (let q = 0; q <= 12; q++) { const yy = cyb - ry - 30 - q * 12, xx = 190 + i * rx * 0.5 + Math.sin(q * 0.9 + t * 9 + i) * 10; q ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); } }
  c.restore(); };
 // reloj despertador
 const despertador = (c, x, y, s, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); const tb = o.suena ? Math.sin(t * 40) * 0.08 * o.suena : 0; c.rotate(tb);
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 150, 130, 14, 0, 0, TAU); c.fill(); c.fillStyle = '#9aa3b2'; c.fillRect(-90, 100, 20, 50); c.fillRect(70, 100, 20, 50);
  for (const sg of [-1, 1]) { c.fillStyle = GO; c.beginPath(); c.arc(sg * 80, -110, 46, 0, TAU); c.fill(); }
  c.fillStyle = '#1f2a3a'; c.beginPath(); c.arc(0, 0, 140, 0, TAU); c.fill(); c.strokeStyle = GO; c.lineWidth = 14; c.stroke(); c.fillStyle = '#0b1622'; c.beginPath(); c.arc(0, 0, 118, 0, TAU); c.fill();
  txt(c, o.hora || '7:00', 0, 6, 74, '#e6edf5', { w: 900, f: 'Fredoka' }); if (o.suena > 0) { c.strokeStyle = `rgba(255,200,69,${o.suena})`; c.lineWidth = 8; for (const sg of [-1, 1]) for (let q = 1; q <= 2; q++) { c.beginPath(); c.arc(0, -10, 150 + q * 34, sg > 0 ? -0.6 : Math.PI - 0.4, sg > 0 ? 0.4 : Math.PI + 0.6); c.stroke(); } }
  c.restore(); };
 // termómetro (nivel 0…1)
 const termometro = (c, x, y, s, lv) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#e6edf5'; c.beginPath(); c.roundRect(-34, -300, 68, 300, 34); c.fill(); c.beginPath(); c.arc(0, 30, 62, 0, TAU); c.fill();
  const col = H.rgba(H.mix('#3ea8ff', '#ff4d5e', lv)); c.fillStyle = col; c.beginPath(); c.arc(0, 30, 46, 0, TAU); c.fill(); c.beginPath(); c.roundRect(-18, -270 * lv - 10, 36, 270 * lv + 40, 18); c.fill(); if (lv > 0.5) P.glow(c, 0, 0, 160, '255,77,94', 0.4 * lv);
  c.strokeStyle = '#8f9bb0'; c.lineWidth = 5; for (let q = 0; q < 5; q++) { c.beginPath(); c.moveTo(34, -260 + q * 55); c.lineTo(58, -260 + q * 55); c.stroke(); } c.restore(); };
 // conector del cable (punta USB) y cable hasta la pared
 const conector = (c, x, y, ang = 0) => { c.save(); c.translate(x, y); c.rotate(ang); c.fillStyle = '#e9edf3'; c.beginPath(); c.roundRect(-22, 0, 44, 70, 10); c.fill(); c.fillStyle = '#9aa3b2'; c.fillRect(-12, -24, 24, 26); c.restore(); };
 const toggle = (c, x, y, s, on) => { c.save(); c.fillStyle = on > 0.5 ? GR : '#3a4252'; c.beginPath(); c.roundRect(x - s, y - s * 0.55, s * 2, s * 1.1, s * 0.55); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x - s * 0.45 + s * 0.9 * on, y, s * 0.45, 0, TAU); c.fill(); c.restore(); };
 // soporte del celular sobre la mesita (el celular se apoya en él; el cable entra por abajo)
 const soporte = (c, x, y, w) => { c.save(); c.fillStyle = '#2b3140'; c.beginPath(); c.moveTo(x - w * 0.42, y); c.lineTo(x + w * 0.42, y); c.lineTo(x + w * 0.3, y - 60); c.lineTo(x - w * 0.3, y - 60); c.closePath(); c.fill(); c.fillStyle = '#3a4252'; c.fillRect(x - w * 0.32, y - 66, w * 0.64, 10); c.restore(); };
 // celular de pie en su soporte, sobre la mesita (tablero en ym): devuelve la y de su borde inferior
 const celMesa = (c, x, ym, w, t, o = {}) => { const h = w * 2.05, yb = ym - 64; soporte(c, x, ym, w); celular(c, x, yb - h / 2, w, t, o); return yb; };
 // dormitorio completo (ventana, cama, mesita y celular de pie en su soporte): ocupa todo el ancho del encuadre. o.izq dibuja lo que va
 // sobre la mesita a la izquierda del celular (lámpara, despertador…); o.cel = opciones del celular. Devuelve la y del borde inferior del celular.
 const dormitorio = (g, t, o = {}) => { ventana(g, 820, 330, 300, 360, 1, t); cama(g, 780, 1080, 520); mesita(g, 330, 1060, 420); if (o.izq) o.izq(g); return celMesa(g, 380, 1060, 340, t, o.cel || {}); };
 const FR_DORM = [0, 300, 1000, 1300];
 const rayo = (c, x, y, s, a = 1) => { c.save(); c.globalAlpha *= a; P.glow(c, x, y, s * 1.2, '255,200,69', 0.4); P.icon(c, 'rayo', x, y, s, { mode: 'flat', col: GO }); c.restore(); };

 // =====================================================================================================
 // ESCENAS (una idea visual por frase, sincronizada con la palabra exacta de la voz)
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO A: lo enchufas antes de dormir… y lo dejas toda la noche ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  fondo(ctx, t); const qB = P.pregunta(ctx, '¿CARGARLO TODA LA NOCHE / DAÑA LA BATERÍA?', t, 0, S(2) - 0.15, { capY: 330, px: 58, clave: 'BATERÍA?', x: 540, dy: 110 });
  const sube = E.inOut(win(t, 0, Tk.enchufas + 0.6)), on = sm(Tk.enchufas + 0.5, Tk.enchufas + 0.7, t), luz = 1 - sm(Tk.noche - 0.2, Tk.noche + 0.2, t), ret = E.in(win(t, Tk.enchufas + 0.8, Tk.enchufas + 1.5));
  const r = ENC(ctx, [0, 300, 1000, 1460], (g) => {
   ventana(g, 820, 330, 300, 360, 1, t); cama(g, 780, 1080, 520); mesita(g, 330, 1060, 420); lampara(g, 170, 1060, luz);
   const yb = celMesa(g, 380, 1060, 340, t, { bat: 0.35, pantalla: '#0b1622', dibuja: (c, sw, sh) => { if (on > 0) { bateria(c, 0, -40, 200, 92, 0.35, { col: GR }); rayo(c, 0, 110, 120, on); } } });
   const cy = lerp(1500, yb - 2, sube); g.strokeStyle = '#e9edf3'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(380, cy + 70); g.quadraticCurveTo(380, 1300, 120, 1460); g.stroke(); conector(g, 380, cy);
   g.fillStyle = `rgba(5,8,20,${0.45 * (1 - luz)})`; g.fillRect(-200, 200, 1400, 1400); }, { franja: { x0: 30, x1: 1050, y0: qB + 30, y1: 1640, cx: 540, cy: (qB + 30 + 1640) / 2, w: 980, h: 1640 - qB - 30 }, alto: 0.98, ancho: 0.98 });
  // la mano (pinza) sube con el conector y se retira
  const yb0 = 1060 - 64, cyc = lerp(1500, yb0 - 2, sube), [hx, hy] = r.map(380, cyc + 30); if (ret < 1) P.manoImg(ctx, 'pinza', hx + 95 * r.k + ret * 260, hy + 45 * r.k + ret * 380, 440 * r.k, { ancla: 'centro' });
 }, sfx(k) { k.play('whoosh', 0.1, { dur: 0.5, gain: 0.2 }); k.play('click', Tk.enchufas + 0.55, { gain: 0.5 }); FX.chispa(k, Tk.enchufas + 0.6, 0.25); k.play('click', Tk.noche - 0.1, { gain: 0.25 }); } });

 // ---------- 2 · ¿Cargarlo toda la noche daña la batería? ¿Mito o verdad? ----------
 B.push({ t0: S(2), t1: S(5), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); const a = R(S(3) - 0.2, S(3) + 0.2, t), flip = Math.sin(t * 6) > 0;
  ENC(ctx, FR_DORM, (g) => { P.glow(g, 380, 700, 420, '255,200,69', 0.25 * a);
   dormitorio(g, t, { izq: (c) => lampara(c, 170, 1060, 0), cel: { bat: 0.55, dibuja: (c, sw, sh) => { bateria(c, 0, -40, 200, 92, 0.55, { col: GR }); rayo(c, 0, 110, 120, 1); c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(11,22,34,0.85)'; c.fillRect(-sw / 2, -sh / 2, sw, sh); txt(c, '?', 0, 20, 300, GO, { w: 900, f: 'Fredoka' }); c.restore(); } } });
   g.save(); g.globalAlpha *= a; for (const [lab, col, x0, y0, on] of [['MITO', RD, 140, 650, flip], ['VERDAD', GR, 840, 840, !flip]]) { g.globalAlpha = a * (on ? 1 : 0.35); g.fillStyle = col; g.beginPath(); g.roundRect(x0 - 140, y0, 280, 110, 24); g.fill(); txt(g, lab, x0, y0 + 57, 54, '#fff', { w: 900, f: 'Fredoka' }); } g.restore(); });
 }, sfx(k) { FX.aparece(k, S(3), 700); for (let i = 0; i < 4; i++) k.play('tick', S(3) + 0.15 + i * 0.26, { gain: 0.2 }); } });

 // ---------- 3 · Piensa en un globo ----------
 B.push({ t0: S(5), t1: S(6), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const inf = E.out(win(t, S(5), Tk.globo + 0.4)), bo = Math.abs(Math.sin(t * 7)) * (1 - win(t, Tk.globo + 0.3, Tk.globo + 0.5));
  ENC(ctx, [-120, 680, 980, 1440], (g) => { losa(g, -100, 960, 1410); globo(g, 380, 1410, 1.5, 0.3 + 0.55 * inf, t, { bombeo: bo }); }, { ancho: 0.9 });
 }, sfx(k) { for (let i = 0; i < 3; i++) k.play('swish', S(5) + 0.1 + i * 0.45, { gain: 0.2 }); } });

 // ---------- 4 · al 100 % deja de soplar: para de cargar… y solo sopla un poquito si baja ----------
 B.push({ t0: S(6), t1: S(9), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const sube = cl(win(t, S(6), Tk.cien)), lv0 = 0.62 + 0.38 * sube, para = sm(Tk.para - 0.1, Tk.para + 0.1, t), pq = win(t, Tk.poquito - 0.4, Tk.poquito + 0.8), baja = Math.sin(pq * Math.PI);
  const lv = lv0 - 0.05 * baja, tam = 0.7 + 0.3 * sube - 0.06 * baja, bombea = (t < Tk.soplar ? Math.abs(Math.sin(t * 7)) : 0) + (pq > 0.45 && pq < 0.8 ? Math.sin((pq - 0.45) / 0.35 * Math.PI) : 0);
  ENC(ctx, [20, 700, 1020, 1440], (g) => { losa(g, 0, 1000, 1410);
   celMesa(g, 230, 1410, 300, t, { bat: lv, dibuja: (c, sw, sh) => { bateria(c, 0, -60, 220, 100, lv, { pct: Math.round(lv * 100) + ' %', col: GR }); rayo(c, 0, 150, 110, 1 - para + (pq > 0.45 && pq < 0.8 ? 1 : 0)); } });
   globo(g, 600, 1410, 1.05, tam, t, { bombeo: cl(bombea) }); });
  P.statBig(ctx, '100 %', 300, 520, t, Tk.cien, Tk.para + 0.4, { px: 110, col: GR }); P.tag(ctx, 'DEJA DE CARGAR', 470, 520, t, Tk.para + 0.4, S(9), { mono: true, col: GO, px: 56 });
 }, sfx(k) { for (let i = 0; i < 5; i++) k.play('swish', S(6) + 0.2 + i * 0.45, { gain: 0.15 }); FX.correcto(k, Tk.cien); k.play('click', Tk.para, { gain: 0.35 }); FX.etiqueta(k, Tk.para + 0.4); k.play('swish', Tk.poquito + 0.2, { gain: 0.25 }); } });

 // ---------- 5 · un globo inflado al máximo durante horas se cansa ----------
 B.push({ t0: S(9), t1: S(10), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const cs = sm(Tk.horas, Tk.cansa + 0.3, t), hr = Math.floor(lerp(23, 31, win(t, Tk.horas - 0.2, Tk.cansa + 0.2))) % 24;
  ENC(ctx, [-20, 800, 1000, 1440], (g) => { losa(g, -20, 1000, 1410); globo(g, 290, 1410, 1.15, 1.12, t, { canso: cs }); despertador(g, 800, 1410 - 160, 0.95, t, { hora: hr + ':00' }); }, { ancho: 0.98 });
  P.tag(ctx, 'AL MÁXIMO', 300, 520, t, Tk.maximo - 0.2, S(10), { mono: true, col: RD, px: 58 }); P.tag(ctx, 'SE CANSA', 680, 1395, t, Tk.cansa - 0.1, S(10), { mono: true, col: GO, px: 58 });
 }, sfx(k) { FX.etiqueta(k, Tk.maximo - 0.2); for (let i = 0; i < 6; i++) k.play('tick', Tk.horas + i * 0.25, { gain: 0.18 }); FX.etiqueta(k, Tk.cansa - 0.1); } });

 // ---------- 6 · muchos celulares hacen algo más: tu celular SABE A QUÉ HORA TE DESPIERTAS ----------
 B.push({ t0: S(10), t1: S(12), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const rv = sm(Tk.sabe - 0.2, Tk.sabe + 0.3, t), su = sm(Tk.despiertas - 0.2, Tk.despiertas + 0.1, t) * (1 - sm(S(12) - 0.4, S(12), t));
  ENC(ctx, FR_DORM, (g) => {
   dormitorio(g, t, { izq: (c) => despertador(c, 175, 1060 - 75, 0.45, t, { hora: '7:00', suena: su }), cel: { bat: 0.8, dibuja: (c, sw, sh) => { if (rv < 1) { c.save(); c.globalAlpha *= 1 - rv; bateria(c, 0, -40, 200, 92, 0.6, { col: GR }); rayo(c, 0, 110, 110, 1); c.restore(); }
    if (rv > 0) { c.save(); c.globalAlpha *= rv; P.icon(c, 'reloj', 0, -120, 120, { mode: 'flat', col: GO }); txt(c, '7:00', 0, 30, 92, '#e6edf5', { w: 900, f: 'Fredoka' }); txt(c, 'Alarma', 0, 110, 40, '#8f9bb0', { w: 800 }); c.restore(); } } } });
   if (rv > 0) { g.save(); g.globalAlpha *= rv; g.strokeStyle = 'rgba(255,200,69,0.8)'; g.setLineDash([16, 12]); g.lineWidth = 6; g.beginPath(); g.moveTo(200, 900); g.quadraticCurveTo(220, 700, 300, 640); g.stroke(); g.setLineDash([]); g.restore(); } });
  P.tag(ctx, 'SABE TU HORARIO', 470, 520, t, Tk.despiertas - 0.1, S(12), { mono: true, col: GO, px: 58 });
 }, sfx(k) { FX.revelar(k, Tk.sabe - 0.2); FX.etiqueta(k, Tk.despiertas - 0.1); for (let i = 0; i < 6; i++) k.play('tick', Tk.despiertas + i * 0.08, { gain: 0.15, f: 1800 }); } });

 // ---------- 7 · se queda en el 80 % casi toda la noche… y termina justo antes de que te levantes ----------
 B.push({ t0: S(12), t1: S(14), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const p1 = cl(win(t, Tk.ochenta - 0.3, Tk.noche2 + 0.2)), p2 = cl(win(t, Tk.termina, Tk.levantes)), su = sm(Tk.levantes - 0.1, Tk.levantes + 0.2, t);
  ENC(ctx, [30, 550, 970, 1345], (g) => { const X0 = 110, X1 = 890, Y0 = 1240, Y1 = 640, yv = (v) => lerp(Y0, Y1, v);
   g.fillStyle = '#121a28'; g.beginPath(); g.roundRect(40, 560, 920, 780, 30); g.fill(); g.strokeStyle = '#2a3446'; g.lineWidth = 4; for (const v of [0.8, 1]) { g.setLineDash([12, 10]); g.beginPath(); g.moveTo(X0, yv(v)); g.lineTo(X1, yv(v)); g.stroke(); } g.setLineDash([]);
   txt(g, '80 %', X0 + 250, yv(0.8) - 40, 64, GO, { w: 900, f: 'Fredoka' }); txt(g, '100 %', X0 + 250, yv(1) - 40, 64, GR, { w: 900, f: 'Fredoka' });
   P.icon(g, 'luna', X0 + 20, 1290, 70, { mode: 'flat', col: '#cfd8e3' }); txt(g, '23:00', X0 + 130, 1290, 52, '#8f9bb0', { w: 800, f: 'IBM Plex Mono' }); P.icon(g, 'sol', X1 - 20, 1290, 70, { mode: 'flat', col: GO }); txt(g, '7:00', X1 - 120, 1290, 52, '#8f9bb0', { w: 800, f: 'IBM Plex Mono' });
   // curva: sube hasta 80 %, meseta casi toda la noche, y sube al 100 % justo antes de las 7:00
   const pts = []; for (let q = 0; q <= 60; q++) { const u = q / 60, x = lerp(X0, X1, u), v = u < 0.15 ? lerp(0.35, 0.8, E.out(u / 0.15)) : u < 0.86 ? 0.8 : lerp(0.8, 1, E.inOut((u - 0.86) / 0.14)); pts.push([x, yv(v), u]); }
   const lim = p1 < 1 ? 0.86 * p1 : 0.86 + 0.14 * p2; g.strokeStyle = CY; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); let last = pts[0]; pts.forEach(([x, y, u], i) => { if (u <= lim) { i ? g.lineTo(x, y) : g.moveTo(x, y); last = [x, y]; } }); g.stroke();
   bateria(g, last[0], last[1] - 90, 170, 80, (last[1] - Y0) / (Y1 - Y0), { col: GR }); despertador(g, X1 - 30, 760, 0.42, t, { hora: '7:00', suena: su }); });
 }, sfx(k) { k.play('riser', Tk.ochenta - 0.3, { dur: 0.8, gain: 0.15 }); k.play('riser', Tk.termina, { dur: Tk.levantes - Tk.termina, gain: 0.2 }); FX.correcto(k, Tk.levantes); } });

 // ---------- 8 · lo que sí desgasta con los años: mucho tiempo al 100 %… y el calor ----------
 B.push({ t0: S(14), t1: S(17), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const an = win(t, Tk.anos - 0.3, Tk.cien2), yr = 2026 + Math.floor(3 * an), cap = 1 - 0.25 * win(t, Tk.anos, Tk.calor + 0.6), hot = sm(Tk.calor - 0.3, Tk.calor + 0.2, t), full = sm(Tk.cien2 - 0.2, Tk.cien2 + 0.2, t);
  ENC(ctx, [20, 460, 1000, 1440], (g) => { losa(g, 0, 1000, 1410);
   bateriaV(g, 300, 1410 - 380 - 6, 360, 760, cap * (0.7 + 0.3 * full), { col: full > 0.5 ? GO : GR }); if (full > 0) P.glow(g, 300, 1000, 260, '255,200,69', 0.3 * full);
   g.strokeStyle = RD; g.lineWidth = 8; g.setLineDash([16, 10]); const yc = 1410 - 6 - 22 - (760 - 44) * cap; g.beginPath(); g.moveTo(110, yc); g.lineTo(490, yc); g.stroke(); g.setLineDash([]);
   g.fillStyle = '#f4f2fb'; g.beginPath(); g.roundRect(170, 470, 260, 130, 20); g.fill(); g.fillStyle = RD; g.beginPath(); g.roundRect(170, 470, 260, 40, [20, 20, 0, 0]); g.fill(); txt(g, String(yr), 300, 565, 64, INK, { w: 900, f: 'Fredoka' });
   g.save(); g.globalAlpha *= 0.35 + 0.65 * hot; termometro(g, 760, 1300, 1.25, 0.2 + 0.75 * hot); g.restore(); });
  P.tag(ctx, 'MUCHO TIEMPO AL 100 %', 400, 1395, t, Tk.cien2 - 0.2, S(17), { mono: true, col: GO, px: 52 }); P.tag(ctx, 'CALOR', 700, 520, t, Tk.calor - 0.2, S(17), { mono: true, col: RD, px: 60 });
 }, sfx(k) { FX.pasarPagina(k, Tk.anos); FX.etiqueta(k, Tk.cien2 - 0.2); k.play('riser', Tk.calor - 0.3, { dur: 0.6, gain: 0.2 }); FX.etiqueta(k, Tk.calor - 0.2); } });

 // ---------- 9 · como un globo al sol ----------
 B.push({ t0: S(17), t1: S(18), in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  fondo(ctx, t); const s = sm(S(17) - 0.1, Tk.sol, t);
  ENC(ctx, [-120, 300, 1000, 1440], (g) => { losa(g, -100, 980, 1410); P.glow(g, 820, 430, 300, '255,200,69', 0.6 * s); P.icon(g, 'sol', 820, 430, 220 * (0.6 + 0.4 * s), { mode: 'flat', col: GO }); globo(g, 300, 1410, 1.3, 1.12, t, { canso: 0.6, calor: s }); }, { ancho: 0.9 });
 }, sfx(k) { k.play('riser', S(17), { dur: 0.8, gain: 0.2 }); } });

 // ---------- 10 · nunca lo cargues debajo de la almohada: Apple y Google lo desaconsejan (plano cercano de la almohada) ----------
 B.push({ t0: S(18), t1: Tk.veredicto - 0.35, in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const mete = E.out(win(t, S(18), S(18) + 0.6)), hot = sm(Tk.almohada - 0.3, Tk.almohada + 0.8, t), no = sm(Tk.desaconsejan - 0.3, Tk.desaconsejan, t);
  ENC(ctx, [150, 690, 1060, 1140], (g) => {
   ventana(g, 560, 600, 260, 240, 1, t);
   // cabecero y colchón (vista lateral cercana)
   g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(600, 1290, 440, 18, 0, 0, TAU); g.fill();
   g.fillStyle = '#3b4766'; g.beginPath(); g.roundRect(150, 1160, 900, 120, 16); g.fill(); g.fillStyle = '#e8ecf5'; g.beginPath(); g.roundRect(150, 1070, 900, 100, 26); g.fill();
   // celular tumbado en el colchón, metido bajo la almohada: asoma por la derecha con la pantalla encendida
   const px = lerp(960, 760, mete); g.save(); g.translate(px, 1030); g.scale(1, 0.62); g.rotate(Math.PI / 2); celular(g, 0, 0, 250, t, { bat: 0.8, dibuja: (c, sw, sh) => { P.glow(c, 0, 0, 160, '62,230,255', 0.35); rayo(c, 0, -40, 110, 1); } }); g.restore();
   // cable conectado al extremo del celular, que cae por el borde del colchón
   g.strokeStyle = '#e9edf3'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(px + 270, 1030); g.quadraticCurveTo(px + 330, 1040, px + 300, 1180); g.stroke(); g.fillStyle = '#e9edf3'; g.beginPath(); g.roundRect(px + 250, 1014, 40, 32, 6); g.fill();
   // almohada encima (se calienta en rojo)
   const pc = H.rgba(H.mix('#f7f9fd', '#ff6b6b', 0.75 * hot)); if (hot > 0) P.glow(g, 490, 990, 340, '255,77,94', 0.55 * hot);
   g.fillStyle = pc; g.beginPath(); g.ellipse(490, 1000, 310, 105, 0, 0, TAU); g.fill(); g.strokeStyle = H.rgba(H.mix('#d6dce8', '#c0392b', hot)); g.lineWidth = 6; g.stroke(); g.fillStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.ellipse(430, 960, 180, 30, -0.05, 0, TAU); g.fill();
   if (hot > 0) { g.strokeStyle = `rgba(255,120,80,${0.85 * hot})`; g.lineWidth = 9; g.lineCap = 'round'; for (let k = -2; k <= 2; k++) { g.beginPath(); for (let q = 0; q <= 12; q++) { const yy = 880 - q * 14, xx = 490 + k * 100 + Math.sin(q * 0.9 + t * 9 + k) * 12; q ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } }
   if (no > 0) P.icon(g, 'cruz', 560, 980, 340 * E.out(no), { mode: 'flat', col: RD, col2: '#fff' }); }, { ancho: 0.97 });
  P.tag(ctx, 'BAJO LA ALMOHADA: NO', 470, 520, t, Tk.desaconsejan - 0.3, Tk.veredicto - 0.35, { mono: true, col: RD, px: 54 });
 }, sfx(k) { k.play('whoosh', S(18) + 0.1, { dur: 0.5, gain: 0.2 }); k.play('riser', Tk.almohada - 0.3, { dur: 1.0, gain: 0.2 }); k.play('error', Tk.desaconsejan, { f: 'C3', gain: 0.35 }); FX.etiqueta(k, Tk.desaconsejan - 0.3); } });

 // ---------- 11 · VEREDICTO: A MEDIAS (sello de la serie) ----------
 B.push({ t0: Tk.veredicto - 0.35, t1: S(22), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); ENC(ctx, FR_DORM, (g) => { dormitorio(g, t, { izq: (c) => lampara(c, 170, 1060, 0), cel: { bat: 0.8, dibuja: (c) => rayo(c, 0, 0, 120, 1) } }); });
  ctx.fillStyle = `rgba(5,8,12,${0.55 * sm(Tk.veredicto - 0.3, Tk.veredicto, t)})`; ctx.fillRect(0, 0, W, HH);
  P.veredicto(ctx, t, tV, 'A MEDIAS', { y: 1000 });
 }, sfx(k) { k.play('riser', Tk.veredicto - 0.3, { dur: tV - Tk.veredicto + 0.2, gain: 0.25, minor: true }); FX.veredicto(k, tV, 'A MEDIAS'); } });

 // ---------- 12 · cargarlo de noche no es el problema… si usas la carga optimizada y lo dejas al aire ----------
 B.push({ t0: S(22), t1: S(24), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const op = sm(Tk.optimizada - 0.2, Tk.optimizada + 0.1, t), ai = sm(Tk.aire - 0.3, Tk.aire, t);
  ENC(ctx, FR_DORM, (g) => {
   dormitorio(g, t, { izq: (c) => lampara(c, 170, 1060, 0), cel: { bat: 0.8, dibuja: (c, sw, sh) => { bateria(c, 0, -170, 210, 96, 0.8, { col: GR }); c.fillStyle = '#1f2a3a'; c.beginPath(); c.roundRect(-sw * 0.44, 0, sw * 0.88, 150, 24); c.fill(); txt(c, 'Carga', -sw * 0.15, 48, 40, '#e6edf5', { w: 800 }); txt(c, 'optimizada', -sw * 0.15, 98, 34, '#e6edf5', { w: 800 }); toggle(c, sw * 0.25, 75, 44, op); } } });
   if (ai > 0) { g.save(); g.globalAlpha *= ai; g.strokeStyle = 'rgba(62,230,255,0.75)'; g.lineWidth = 8; g.lineCap = 'round'; for (const sg of [-1, 1]) for (let q = 0; q < 3; q++) { const x0 = 380 + sg * (220 + q * 50), off = ((t * 120 + q * 50) % 160); g.beginPath(); g.moveTo(x0, 960 - off); g.quadraticCurveTo(x0 + sg * 40, 860 - off, x0, 760 - off); g.stroke(); } g.restore(); } });
  P.tag(ctx, 'CARGA OPTIMIZADA', 470, 520, t, Tk.optimizada - 0.1, S(24), { mono: true, col: GR, px: 56 }); P.tag(ctx, 'AL AIRE', 470, 1395, t, Tk.aire - 0.2, S(24), { mono: true, col: CY, px: 58 });
 }, sfx(k) { FX.toque(k, Tk.optimizada); FX.etiqueta(k, Tk.optimizada - 0.1); k.play('whoosh', Tk.aire - 0.2, { dur: 0.7, gain: 0.2 }); FX.etiqueta(k, Tk.aire - 0.2); } });

 // ---------- 13 · CIERRE ----------
 B.push({ t0: S(24), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); P.ctaShare(ctx, t, S(24) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { P.fondo(cc, t); mesita(cc, 480, 1160, 520); celMesa(cc, 480, 1160, 300, t, { bat: 0.8 }); P.veredicto(cc, t, -10, 'A MEDIAS', { y: 760 }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(24) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'tecno', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['noche.', 'batería?', 'verdad?', 'globo.', '100', 'soplar:', 'poquito', 'máximo', 'cansa.', 'despiertas.', '80', 'levantes.', 'desgasta', 'calor.', 'sol.', 'almohada:', 'medias.', 'optimizada', 'aire.', 'amigo'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 600, gain: 0.006, a: 0.05, hold: DURATION - 2.2 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 100, gain: 0.55, chords: [['D2', 'F2', 'A2', 'D3'], ['A#1', 'D2', 'F2', 'A#2'], ['F2', 'A2', 'C3', 'F3'], ['C2', 'E2', 'G2', 'C3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
