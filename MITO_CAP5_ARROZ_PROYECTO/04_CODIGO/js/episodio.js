// =====================================================================================================
// episodio.js — «¿Mito o verdad?» Cap. 5 · ¿Meter el celular mojado en arroz lo salva? · PLANTILLA ASOMBROTECA v1.36b · «tecno»
// Serie: serie_mito_verdad (P.veredicto + FX.veredicto). Veredicto: MITO. UN solo vídeo con UN gancho (v1.34): el B.
// Voz: ElevenLabs Eleven v4, Dan, UNA toma (873 caracteres), 21 tramos, 54,0 s. Metáfora sostenida: una BOTELLA CERRADA con agua
// dentro (el arroz solo la toca por fuera; los granos, un tapón en el cuello). Encuadre v1.34 (P.encuadrar), manos P.manoImg,
// pregunta fija con P.pregunta. Celular, vaso, tazón de arroz, botella, paño, secador y cargador genéricos, sin logos.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, B0, DURATION, txt } = K;
 const S = (i) => A.segments[i].s, Se = (i) => A.segments[i].e;
 const CY = '#3ee6ff', GO = '#ffc845', RD = '#ff4d5e', GR = '#22d27a', INK = '#0d1117';
 const R = (a, b, t) => E.out(win(t, a, b));
 const Tk = {
  arroz0: wt(0, 'arroz'), danarlo: wt(1, 'dañarlo.'), mito0: S(3), botella: wt(4, 'botella'), dentro: wt(4, 'dentro.'), logica: wt(5, 'lógica:'), absorbe: wt(6, 'absorbe'),
  fuera: wt(7, 'fuera…'), agua: wt(8, 'agua'), quedarse: wt(8, 'quedarse'), peor: wt(9, 'peor:'), polvo: wt(10, 'polvo'), puerto: wt(10, 'puerto'), tapon: wt(10, 'tapón'), cuello: wt(10, 'cuello'),
  apple: wt(11, 'Apple'), arroz11: wt(11, 'arroz.'), veredicto: S(12), mito: wt(13, 'mito.'), recomiendan: wt(14, 'recomiendan'), apagalo: S(15), cargues: wt(16, 'cargues'),
  secalo: wt(16, 'sécalo'), pano: wt(16, 'paño…'), seco: wt(17, 'seco'), ventilado: wt(17, 'ventilado,'), secador: wt(17, 'secador.'), treinta: wt(18, '30'), cargarlo: wt(18, 'cargarlo…'),
  hasta: wt(19, 'hasta'), h24: wt(19, '24'), todo: wt(19, 'todo.'), envia: S(20),
 };
 const tV = Tk.mito - 0.05;

 // ---------- dibujo compartido con los caps. 1-4 (misma serie, mismo aspecto) ----------
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

 const ayuda = (c, x, y, w, h, nom, ok, t) => { c.save(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.roundRect(x - w / 2 + 10, y - h / 2 + 16, w, h, 22); c.fill(); c.fillStyle = '#f4f6fb'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 22); c.fill();
  c.fillStyle = '#dfe5ee'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h * 0.2, [22, 22, 0, 0]); c.fill(); txt(c, 'AYUDA', x, y - h / 2 + h * 0.07, w * 0.09, '#5a6680', { w: 900, f: 'IBM Plex Mono', ls: 4 }); txt(c, nom, x, y - h / 2 + h * 0.145, w * 0.12, INK, { w: 900, f: 'Fredoka' });
  c.fillStyle = '#c9d1dc'; for (let r = 0; r < 7; r++) { c.beginPath(); c.roundRect(x - w * 0.38, y - h * 0.2 + r * h * 0.085, w * (r % 3 === 2 ? 0.5 : 0.76), h * 0.035, 6); c.fill(); }
  if (ok > 0) { P.glow(c, x + w * 0.3, y + h * 0.36, w * 0.3, '34,210,122', 0.5 * ok); P.icon(c, 'check', x + w * 0.3, y + h * 0.36, w * 0.34 * E.out(cl(ok)), { mode: 'flat', col: GR, col2: '#fff' }); }
  c.restore(); };
 // reloj despertador
 const despertador = (c, x, y, s, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); const tb = o.suena ? Math.sin(t * 40) * 0.08 * o.suena : 0; c.rotate(tb);
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 150, 130, 14, 0, 0, TAU); c.fill(); c.fillStyle = '#9aa3b2'; c.fillRect(-90, 100, 20, 50); c.fillRect(70, 100, 20, 50);
  for (const sg of [-1, 1]) { c.fillStyle = GO; c.beginPath(); c.arc(sg * 80, -110, 46, 0, TAU); c.fill(); }
  c.fillStyle = '#1f2a3a'; c.beginPath(); c.arc(0, 0, 140, 0, TAU); c.fill(); c.strokeStyle = GO; c.lineWidth = 14; c.stroke(); c.fillStyle = '#0b1622'; c.beginPath(); c.arc(0, 0, 118, 0, TAU); c.fill();
  txt(c, o.hora || '7:00', 0, 6, 74, '#e6edf5', { w: 900, f: 'Fredoka' }); if (o.suena > 0) { c.strokeStyle = `rgba(255,200,69,${o.suena})`; c.lineWidth = 8; for (const sg of [-1, 1]) for (let q = 1; q <= 2; q++) { c.beginPath(); c.arc(0, -10, 150 + q * 34, sg > 0 ? -0.6 : Math.PI - 0.4, sg > 0 ? 0.4 : Math.PI + 0.6); c.stroke(); } }
  c.restore(); };

 // ---------- dibujo propio del capítulo ----------
 // granos de arroz (elipses alargadas) repartidos en un área; semilla fija
 const granos = (c, x0, y0, w, h, n, seed, o = {}) => { const Rr = H.rng(seed); c.save(); for (let i = 0; i < n; i++) { const x = x0 + Rr() * w, y = y0 + Rr() * h, a = Rr() * Math.PI; c.fillStyle = Rr() > 0.5 ? '#f5f0e1' : '#e8e1cc'; c.beginPath(); c.ellipse(x, y, o.r || 11, (o.r || 11) * 0.45, a, 0, TAU); c.fill(); } c.restore(); };
 // tazón con arroz (apoyado en la mesa en y); devuelve la y de la superficie del arroz
 const tazon = (c, x, y, w, t, o = {}) => { const h = w * 0.42, ys = y - h + 18; c.save(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(x, y + 4, w * 0.48, 16, 0, 0, TAU); c.fill();
  // arroz (montoncito que asoma)
  c.fillStyle = '#efe8d4'; c.beginPath(); c.ellipse(x, ys, w * 0.48, h * 0.32, 0, Math.PI, TAU); c.fill(); c.beginPath(); c.ellipse(x, ys, w * 0.48, h * 0.16, 0, 0, Math.PI); c.fill();
  granos(c, x - w * 0.42, ys - h * 0.26, w * 0.84, h * 0.32, 60, 9, { r: w * 0.018 });
  if (o.dentro) o.dentro(c, ys);   // lo que va hundido en el arroz (se dibuja antes del frente del tazón)
  const g = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#2f6fb8'); g.addColorStop(0.5, '#4f93dd'); g.addColorStop(1, '#245a99'); c.fillStyle = g;
  c.beginPath(); c.moveTo(x - w / 2, ys); c.quadraticCurveTo(x - w * 0.46, y - 6, x - w * 0.3, y); c.lineTo(x + w * 0.3, y); c.quadraticCurveTo(x + w * 0.46, y - 6, x + w / 2, ys); c.closePath(); c.fill();
  c.strokeStyle = '#8fc0f2'; c.lineWidth = 8; c.beginPath(); c.ellipse(x, ys, w * 0.5, h * 0.16, 0, 0, Math.PI); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.18)'; c.fillRect(x - w * 0.36, ys + h * 0.18, w * 0.08, h * 0.4); c.restore(); return ys; };
 // botella cerrada con agua (apoyada en y); o.tapon 0…1 = granos atascados en el cuello; o.agua = nivel
 const botella = (c, x, y, s, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 6, 120, 14, 0, 0, TAU); c.fill();
  const body = new Path2D(); body.moveTo(-100, 0); body.lineTo(-100, -330); body.quadraticCurveTo(-100, -400, -40, -430); body.lineTo(-40, -500); body.lineTo(40, -500); body.lineTo(40, -430); body.quadraticCurveTo(100, -400, 100, -330); body.lineTo(100, 0); body.closePath();
  c.fillStyle = 'rgba(200,230,255,0.16)'; c.fill(body); c.save(); c.clip(body); const lv = o.agua ?? 0.55, wy = -330 * lv + Math.sin(t * 3) * 6; const g = c.createLinearGradient(0, wy, 0, 0); g.addColorStop(0, 'rgba(80,170,255,0.9)'); g.addColorStop(1, 'rgba(30,100,200,0.95)'); c.fillStyle = g; c.fillRect(-110, wy, 220, -wy + 4);
  c.fillStyle = 'rgba(255,255,255,0.35)'; for (let q = 0; q < 6; q++) { c.beginPath(); c.arc(-50 + q * 20, wy + 40 + (q % 3) * 50 - ((t * 40 + q * 30) % 120), 6, 0, TAU); c.fill(); } c.restore();
  c.strokeStyle = '#cfe6ff'; c.lineWidth = 8; c.stroke(body); c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(-80, -320, 16, 280);
  c.fillStyle = '#e04f5f'; c.beginPath(); c.roundRect(-48, -540, 96, 46, 10); c.fill();   // tapa (cerrada)
  if (o.tapon > 0) { c.save(); c.globalAlpha *= cl(o.tapon); granos(c, -36, -500, 72, 70, 22, 4, { r: 12 }); c.restore(); }
  c.restore(); };
 // gotas de agua
 const gotas = (c, x0, y0, w, h, n, seed, a = 1, t = 0) => { const Rr = H.rng(seed); c.save(); c.globalAlpha *= a; for (let i = 0; i < n; i++) { const x = x0 + Rr() * w, y = y0 + Rr() * h + Math.sin(t * 2 + i) * 3, r = 8 + Rr() * 10; c.fillStyle = 'rgba(120,200,255,0.85)'; c.beginPath(); c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r, y - r * 0.2, x, y + r * 0.6); c.quadraticCurveTo(x - r, y - r * 0.2, x, y - r * 1.6); c.fill(); c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(x - r * 0.3, y - r * 0.3, r * 0.22, 0, TAU); c.fill(); } c.restore(); };
 // interior del celular (placa con chips) para usar dentro de celular({ dibuja })
 const placa = (c, sw, sh, t, o = {}) => { c.fillStyle = '#0f3d2e'; c.beginPath(); c.roundRect(-sw * 0.42, -sh * 0.42, sw * 0.84, sh * 0.84, 18); c.fill(); c.strokeStyle = 'rgba(80,220,150,0.35)'; c.lineWidth = 3; for (let q = 0; q < 9; q++) { c.beginPath(); c.moveTo(-sw * 0.38, -sh * 0.36 + q * sh * 0.09); c.lineTo(sw * 0.38, -sh * 0.36 + q * sh * 0.09 + (q % 2 ? 20 : -10)); c.stroke(); }
  c.fillStyle = '#1f2633'; for (const [x, y, w, h] of [[-0.2, -0.2, 0.3, 0.16], [0.12, -0.05, 0.22, 0.2], [-0.15, 0.18, 0.36, 0.12]]) { c.beginPath(); c.roundRect(sw * x - sw * w / 2, sh * y - sh * h / 2, sw * w, sh * h, 8); c.fill(); }
  c.fillStyle = '#c9a26b'; c.fillRect(-sw * 0.3, sh * 0.32, sw * 0.6, sh * 0.06); if (o.gotas > 0) gotas(c, -sw * 0.35, -sh * 0.32, sw * 0.7, sh * 0.62, 9, 21, o.gotas, t); };
 // paño
 const pano = (c, x, y, s, t) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#5ec4b6'; c.beginPath(); c.moveTo(-120, -60); c.quadraticCurveTo(0, -90, 120, -60); c.lineTo(110, 60); c.quadraticCurveTo(0, 80, -110, 60); c.closePath(); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 5; for (let q = -2; q <= 2; q++) { c.beginPath(); c.moveTo(q * 40, -70); c.lineTo(q * 40, 66); c.stroke(); } c.restore(); };
 // secador de pelo genérico
 const secador = (c, x, y, s) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#7a8699'; c.beginPath(); c.roundRect(-140, -70, 220, 120, 50); c.fill(); c.fillStyle = '#5a6680'; c.beginPath(); c.roundRect(70, -55, 90, 90, 18); c.fill(); c.fillStyle = '#7a8699'; c.beginPath(); c.roundRect(-70, 30, 70, 170, 22); c.fill(); c.fillStyle = '#2b2f36'; c.beginPath(); c.arc(-90, -10, 34, 0, TAU); c.fill(); c.restore(); };
 // símbolo de apagado
 const power = (c, x, y, r, col) => { c.save(); c.strokeStyle = col; c.lineWidth = r * 0.18; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, r, -Math.PI / 2 + 0.6, -Math.PI / 2 - 0.6 + TAU); c.stroke(); c.beginPath(); c.moveTo(x, y - r * 1.15); c.lineTo(x, y - r * 0.2); c.stroke(); c.restore(); };
 // celular hundido en el tazón de arroz (inclinado; el puerto de carga queda abajo, dentro del arroz)
 const celArroz = (g, x, y, w, t, o = {}) => tazon(g, x, y, w, t, { dentro: (c, ys) => { c.save(); c.translate(x + 10, ys - w * 0.22); c.rotate(-0.28); celular(c, 0, 0, w * 0.42, t, o.cel || { bat: 0.5 }); c.restore(); if (o.gotas) gotas(c, x - w * 0.25, ys - w * 0.7, w * 0.5, w * 0.4, 6, 3, o.gotas, t); granos(c, x - w * 0.4, ys - w * 0.05, w * 0.8, w * 0.08, 30, 17, { r: w * 0.018 }); } });
 // puerto de carga en primer plano (lupa): o.granos 0…1 = granos y polvo que se cuelan
 const lupaPuerto = (g, x, y, r, t, gr) => { g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fillStyle = '#121a28'; g.fill(); g.clip();
  g.fillStyle = '#2b3140'; g.fillRect(x - r, y - r * 0.15, r * 2, r * 1.2); g.fillStyle = '#05080c'; g.beginPath(); g.roundRect(x - r * 0.5, y - r * 0.08, r, r * 0.3, r * 0.14); g.fill(); g.fillStyle = '#c9a26b'; for (let q = 0; q < 6; q++) g.fillRect(x - r * 0.36 + q * r * 0.14, y + r * 0.02, r * 0.06, r * 0.1);
  if (gr > 0) { const Rr = H.rng(5); for (let i = 0; i < 14; i++) { const p = cl(gr * 1.4 - i * 0.05), sx = x - r * 0.9 + Rr() * r * 1.8, sy = y - r * 0.9 + Rr() * r * 0.3, ex = x - r * 0.4 + Rr() * r * 0.8, ey = y + r * 0.05; const px = lerp(sx, ex, p), py = lerp(sy, ey, p); g.fillStyle = '#f5f0e1'; g.beginPath(); g.ellipse(px, py, r * 0.07, r * 0.03, Rr() * 3, 0, TAU); g.fill(); }
   g.fillStyle = `rgba(240,230,210,${0.5 * gr})`; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(x - r * 0.5 + Rr() * r, y - r * 0.3 + Rr() * r * 0.5, 2 + Rr() * 3, 0, TAU); g.fill(); } }
  g.restore(); g.strokeStyle = '#cfd8e3'; g.lineWidth = 12; g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke(); };

 // =====================================================================================================
 // ESCENAS
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO B: el arroz no seca tu celular… y puede dañarlo ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  fondo(ctx, t); const qB = P.pregunta(ctx, '¿EL ARROZ SALVA / UN CELULAR MOJADO?', t, 0, S(2) - 0.15, { capY: 330, px: 62, clave: 'ARROZ', x: 540, dy: 110 });
  const lp = sm(Tk.arroz0 + 0.3, Tk.arroz0 + 0.9, t), gr = win(t, Tk.danarlo - 0.6, Tk.danarlo + 0.8);
  ENC(ctx, [10, 560, 1010, 1440], (g) => { losa(g, 0, 1010, 1410); celArroz(g, 330, 1400, 640, t, { gotas: 1 }); g.save(); g.globalAlpha *= lp; g.strokeStyle = 'rgba(207,216,227,0.7)'; g.lineWidth = 6; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(400, 1150); g.lineTo(640, 880); g.stroke(); g.setLineDash([]); lupaPuerto(g, 760, 760, 220 * (0.6 + 0.4 * lp), t, gr); g.restore(); },
   { franja: { x0: 30, x1: 1050, y0: qB + 30, y1: 1640, cx: 540, cy: (qB + 30 + 1640) / 2, w: 980, h: 1640 - qB - 30 }, alto: 0.98, ancho: 0.98 });
 }, sfx(k) { k.play('whoosh', 0.05, { dur: 0.5, gain: 0.2 }); for (let i = 0; i < 8; i++) k.play('tick', Tk.danarlo - 0.5 + i * 0.12, { gain: 0.12, f: 2400 }); } });

 // ---------- 2 · ¿Meterlo en arroz lo salva? ¿Mito o verdad? ----------
 B.push({ t0: S(2), t1: S(4), in: { type: 'zoom', d: 0.35, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); const a = R(Tk.mito0 - 0.2, Tk.mito0 + 0.2, t), flip = Math.sin(t * 6) > 0, baja = E.inOut(win(t, S(2), S(2) + 1.2));
  ENC(ctx, [0, 400, 1000, 1440], (g) => { losa(g, 0, 1000, 1410); tazon(g, 500, 1400, 560, t);
   g.save(); g.translate(500, lerp(560, 760, baja)); g.rotate(-0.15); celular(g, 0, 0, 220, t, { bat: 0.5, dibuja: (c, sw, sh) => { gotas(c, -sw * 0.4, -sh * 0.4, sw * 0.8, sh * 0.8, 7, 8, 1, t); c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(11,22,34,0.85)'; c.fillRect(-sw / 2, -sh / 2, sw, sh); txt(c, '?', 0, 10, 260, GO, { w: 900, f: 'Fredoka' }); c.restore(); } }); g.restore();
   g.save(); g.globalAlpha *= a; for (const [lab, col, x0, on] of [['MITO', RD, 140, flip], ['VERDAD', GR, 860, !flip]]) { g.globalAlpha = a * (on ? 1 : 0.35); g.fillStyle = col; g.beginPath(); g.roundRect(x0 - 140, 700, 280, 110, 24); g.fill(); txt(g, lab, x0, 757, 54, '#fff', { w: 900, f: 'Fredoka' }); } g.restore(); });
 }, sfx(k) { FX.aparece(k, Tk.mito0, 700); for (let i = 0; i < 4; i++) k.play('tick', Tk.mito0 + 0.15 + i * 0.26, { gain: 0.2 }); } });

 // ---------- 3 · piensa en una botella cerrada con agua dentro ----------
 B.push({ t0: S(4), t1: S(5), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const ap = R(S(4), Tk.botella + 0.2, t), ag = sm(Tk.botella, Tk.dentro, t);
  ENC(ctx, [0, 600, 1000, 1440], (g) => { losa(g, 0, 1000, 1410); g.save(); g.translate(270, 1410); g.scale(0.85 + 0.15 * ap, 0.85 + 0.15 * ap); g.translate(-270, -1410); botella(g, 270, 1410, 1.45, t, { agua: 0.15 + 0.45 * ag }); g.restore();
   g.save(); g.globalAlpha *= ag; txt(g, '=', 500, 1060, 140, '#cfd8e3', { w: 900, f: 'Fredoka' }); celular(g, 760, 1410 - 400 - 14, 390, t, { dibuja: (c, sw, sh) => placa(c, sw, sh, t, { gotas: ag }) }); g.restore(); });
 }, sfx(k) { FX.aparece(k, Tk.botella, 600); k.play('blip', Tk.dentro, { f: 500, gain: 0.2 }); } });

 // ---------- 4 · la idea parece lógica: el arroz absorbe humedad ----------
 B.push({ t0: S(5), t1: S(7), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const ab = win(t, Tk.absorbe - 0.3, S(7));
  ENC(ctx, [0, 560, 1000, 1440], (g) => { losa(g, 0, 1000, 1410); P.icon(g, 'nube', 500, 700, 300, { mode: 'flat', col: '#9fc9ee', col2: '#1a2433' }); tazon(g, 500, 1400, 900, t);
   const Rr = H.rng(12); g.fillStyle = 'rgba(160,215,255,0.8)'; for (let i = 0; i < 24; i++) { const sx = 380 + Rr() * 240, sy = 760 + Rr() * 120, ph = (ab * 1.6 + Rr()) % 1, x = lerp(sx, 500 + (sx - 500) * 0.4, ph), y = lerp(sy, 1180, ph); g.globalAlpha = (1 - ph) * cl(ab * 4); g.beginPath(); g.arc(x, y, 9, 0, TAU); g.fill(); } g.globalAlpha = 1; });
  P.tag(ctx, 'ABSORBE HUMEDAD', 470, 520, t, Tk.absorbe, S(7), { mono: true, col: CY, px: 58 });
 }, sfx(k) { FX.etiqueta(k, Tk.absorbe); k.play('whoosh', Tk.absorbe, { dur: 1.2, gain: 0.15 }); } });

 // ---------- 5 · pero solo toca la botella por fuera… y el agua puede quedarse dentro ----------
 B.push({ t0: S(7), t1: S(9), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const cel = sm(Tk.agua - 0.4, Tk.agua, t);
  ENC(ctx, [0, 620, 1020, 1440], (g) => { losa(g, 0, 1010, 1410);
   tazon(g, 260, 1400, 480, t, { dentro: (c, ys) => { botella(c, 260, ys + 60, 1.2, t, { agua: 0.6 }); granos(c, 60, ys - 60, 400, 120, 70, 31, { r: 12 }); } });
   g.save(); g.globalAlpha *= 0.3 + 0.7 * cel; tazon(g, 760, 1400, 480, t, { dentro: (c, ys) => { c.save(); c.translate(760, ys - 200); celular(c, 0, 0, 270, t, { dibuja: (cc, sw, sh) => placa(cc, sw, sh, t, { gotas: 1 }) }); c.restore(); granos(c, 560, ys - 60, 400, 120, 70, 32, { r: 12 }); } }); g.restore(); });
  P.tag(ctx, 'SOLO POR FUERA', 330, 520, t, Tk.fuera - 0.3, S(9), { mono: true, col: GO, px: 54 }); P.tag(ctx, 'EL AGUA SIGUE DENTRO', 470, 1395, t, Tk.quedarse - 0.2, S(9), { mono: true, col: CY, px: 52 });
 }, sfx(k) { FX.etiqueta(k, Tk.fuera - 0.3); FX.aparece(k, Tk.agua - 0.4, 620); FX.etiqueta(k, Tk.quedarse - 0.2); } });

 // ---------- 6 · algo peor: polvo y granos en el puerto de carga, como un tapón en el cuello de la botella ----------
 B.push({ t0: S(9), t1: S(11), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const gr = win(t, Tk.polvo - 0.2, Tk.puerto + 0.6), tp = sm(Tk.tapon - 0.3, Tk.tapon + 0.3, t);
  ENC(ctx, [0, 440, 1000, 1440], (g) => { losa(g, 0, 1000, 1410); lupaPuerto(g, 330, 900, 300, t, gr); g.save(); g.globalAlpha *= 0.3 + 0.7 * tp; botella(g, 800, 1410, 1.0, t, { agua: 0.55, tapon: tp }); g.restore(); });
  P.tag(ctx, 'PUERTO DE CARGA', 330, 520, t, Tk.puerto - 0.2, S(11), { mono: true, col: RD, px: 54 }); P.tag(ctx, 'TAPÓN', 760, 1395, t, Tk.tapon, S(11), { mono: true, col: GO, px: 58 });
 }, sfx(k) { for (let i = 0; i < 10; i++) k.play('tick', Tk.polvo + i * 0.12, { gain: 0.12, f: 2600 }); FX.etiqueta(k, Tk.puerto - 0.2); k.play('thud', Tk.tapon, { gain: 0.3 }); FX.etiqueta(k, Tk.tapon); } });

 // ---------- 7 · por eso Apple pide no meter sus celulares en arroz ----------
 B.push({ t0: S(11), t1: Tk.veredicto - 0.35, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const a1 = R(Tk.apple - 0.2, Tk.apple + 0.2, t), no = sm(Tk.arroz11 - 0.3, Tk.arroz11, t);
  ENC(ctx, [0, 440, 1000, 1440], (g) => { losa(g, 0, 1000, 1410); g.save(); g.globalAlpha *= a1; ayuda(g, 270, 920, 420, 880, 'Apple', 0, t); g.restore(); celArroz(g, 740, 1400, 440, t); if (no > 0) P.icon(g, 'cruz', 740, 1180, 300 * E.out(no), { mode: 'flat', col: RD, col2: '#fff' }); });
  P.tag(ctx, 'NO AL ARROZ', 470, 520, t, Tk.arroz11 - 0.2, Tk.veredicto - 0.35, { mono: true, col: RD, px: 58 });
 }, sfx(k) { FX.aparece(k, Tk.apple - 0.2, 620); k.play('error', Tk.arroz11, { f: 'C3', gain: 0.3 }); FX.etiqueta(k, Tk.arroz11 - 0.2); } });

 // ---------- 8 · VEREDICTO: MITO ----------
 B.push({ t0: Tk.veredicto - 0.35, t1: S(14), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); ENC(ctx, [0, 520, 1000, 1440], (g) => { losa(g, 0, 1000, 1410); celArroz(g, 500, 1400, 760, t, { gotas: 1 }); });
  ctx.fillStyle = `rgba(5,8,12,${0.55 * sm(Tk.veredicto - 0.3, Tk.veredicto, t)})`; ctx.fillRect(0, 0, W, HH);
  P.veredicto(ctx, t, tV, 'MITO', { y: 1000 });
 }, sfx(k) { k.play('riser', Tk.veredicto - 0.3, { dur: tV - Tk.veredicto + 0.2, gain: 0.25, minor: true }); FX.veredicto(k, tV, 'MITO'); } });

 // ---------- 9 · lo que sí recomiendan: apágalo, no lo cargues mojado, sécalo con un paño… lugar seco y ventilado, sin secador ----------
 B.push({ t0: S(14), t1: S(18), in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); const off = sm(Tk.apagalo - 0.1, Tk.apagalo + 0.2, t), nc = sm(Tk.cargues - 0.2, Tk.cargues + 0.2, t), pn = win(t, Tk.secalo - 0.1, Tk.pano + 0.4), ve = sm(Tk.ventilado - 0.4, Tk.ventilado, t), sd = sm(Tk.secador - 0.3, Tk.secador, t);
  const seco = cl(pn * 1.2);
  const r = ENC(ctx, [0, 400, 1010, 1440], (g) => { losa(g, 0, 1010, 1410);
   celular(g, 300, 1410 - 410 - 14, 400, t, { bat: 0.5, pantalla: off > 0.5 ? '#000' : '#0b1622', dibuja: (c, sw, sh) => { if (off < 1) { c.save(); c.globalAlpha *= 1 - off; bateria(c, 0, -60, 200, 92, 0.5, { col: GR }); c.restore(); } if (off > 0) { c.save(); c.globalAlpha *= off * (1 - ve * 0.7); power(c, 0, 0, 70, '#8f9bb0'); c.restore(); } gotas(c, -sw * 0.42, -sh * 0.42, sw * 0.84, sh * 0.84, 10, 41, 1 - seco, t); } });
   if (pn > 0 && pn < 1) pano(g, 300 + Math.sin(pn * Math.PI * 4) * 90, 900 + pn * 200, 1.0, t);
   if (ve > 0) { g.save(); g.globalAlpha *= ve; g.strokeStyle = 'rgba(62,230,255,0.75)'; g.lineWidth = 8; g.lineCap = 'round'; for (const sg of [-1, 1]) for (let q = 0; q < 3; q++) { const x0 = 300 + sg * (260 + q * 50), off2 = ((t * 120 + q * 50) % 160); g.beginPath(); g.moveTo(x0, 1250 - off2); g.quadraticCurveTo(x0 + sg * 40, 1150 - off2, x0, 1050 - off2); g.stroke(); } g.restore(); }
   // columna de pasos: cargador tachado y secador tachado
   g.save(); g.globalAlpha *= 0.35 + 0.65 * nc; cargador(g, 780, 760, 1.6, t); if (nc > 0) P.icon(g, 'cruz', 820, 700, 170 * E.out(nc), { mode: 'flat', col: RD, col2: '#fff' }); g.restore();
   g.save(); g.globalAlpha *= 0.35 + 0.65 * sd; secador(g, 800, 1150, 1.0); if (sd > 0) P.icon(g, 'cruz', 820, 1150, 170 * E.out(sd), { mode: 'flat', col: RD, col2: '#fff' }); g.restore(); });
  // la mano pasa el paño
  if (pn > 0 && pn < 1) { const [hx, hy] = r.map(300 + Math.sin(pn * Math.PI * 4) * 90, 880 + pn * 200); P.manoImg(ctx, 'palma_abajo', hx + 40, hy - 10, 330 * r.k, { ancla: 'centro' }); }
  P.tag(ctx, 'APÁGALO', 330, 520, t, Tk.apagalo - 0.1, Tk.cargues - 0.2, { mono: true, col: GR, px: 56 }); P.tag(ctx, 'NO LO CARGUES', 330, 520, t, Tk.cargues - 0.2, Tk.secalo - 0.1, { mono: true, col: RD, px: 56 });
  P.tag(ctx, 'SÉCALO POR FUERA', 330, 520, t, Tk.secalo - 0.1, Tk.seco - 0.2, { mono: true, col: CY, px: 56 }); P.tag(ctx, 'SECO Y VENTILADO', 330, 520, t, Tk.seco - 0.2, S(18), { mono: true, col: GR, px: 56 });
 }, sfx(k) { k.play('click', Tk.apagalo, { gain: 0.4 }); k.play('error', Tk.cargues, { f: 'E3', gain: 0.2, minor: true }); for (let i = 0; i < 4; i++) k.play('swish', Tk.pano - 0.9 + i * 0.3, { gain: 0.25 }); k.play('whoosh', Tk.ventilado - 0.3, { dur: 0.8, gain: 0.2 }); k.play('error', Tk.secador, { f: 'C3', gain: 0.25 }); } });

 // ---------- 10 · Apple: al menos 30 minutos antes de cargarlo… hasta 24 horas en secarse del todo ----------
 B.push({ t0: S(18), t1: S(20), in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const m30 = win(t, Tk.treinta - 0.3, Tk.cargarlo), h24 = win(t, Tk.h24 - 0.3, Tk.todo), seco = cl(win(t, Tk.hasta, Tk.todo + 0.5));
  ENC(ctx, [0, 440, 1000, 1440], (g) => { losa(g, 0, 1000, 1410);
   celular(g, 280, 1410 - 410 - 14, 400, t, { bat: 0.5, pantalla: '#000', dibuja: (c, sw, sh) => gotas(c, -sw * 0.42, -sh * 0.42, sw * 0.84, sh * 0.84, 10, 41, 0.6 * (1 - seco), t) });
   // reloj: arco de 30 min y luego vuelta completa de 24 h
   g.save(); g.translate(760, 860); g.fillStyle = '#1f2a3a'; g.beginPath(); g.arc(0, 0, 200, 0, TAU); g.fill(); g.strokeStyle = '#cfd8e3'; g.lineWidth = 12; g.stroke();
   g.strokeStyle = GO; g.lineWidth = 34; g.beginPath(); g.arc(0, 0, 150, -Math.PI / 2, -Math.PI / 2 + Math.PI * m30 * (1 - h24)); g.stroke(); if (h24 > 0) { g.strokeStyle = CY; g.beginPath(); g.arc(0, 0, 150, -Math.PI / 2, -Math.PI / 2 + TAU * h24); g.stroke(); }
   g.strokeStyle = '#e6edf5'; g.lineWidth = 10; g.lineCap = 'round'; const an = -Math.PI / 2 + TAU * (m30 * 0.5 + h24 * 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * 120, Math.sin(an) * 120); g.stroke(); g.restore();
   cargador(g, 760, 1300, 1.2, t); if (t < Tk.cargarlo + 0.6) { g.save(); g.globalAlpha *= sm(Tk.treinta - 0.3, Tk.treinta, t); P.icon(g, 'reloj', 840, 1250, 90, { mode: 'flat', col: GO }); g.restore(); } });
  P.statBig(ctx, '30 MIN', 690, 520, t, Tk.treinta - 0.1, Tk.hasta - 0.2, { px: 96, sub: 'SEGÚN APPLE', col: GO }); P.statBig(ctx, '24 H', 690, 520, t, Tk.h24 - 0.1, S(20), { px: 96, sub: 'HASTA · SEGÚN APPLE', col: CY });
 }, sfx(k) { FX.aparece(k, Tk.treinta - 0.1, 700); for (let i = 0; i < 8; i++) k.play('tick', Tk.h24 + i * 0.18, { gain: 0.15 }); FX.aparece(k, Tk.h24 - 0.1, 760); } });

 // ---------- 11 · CIERRE ----------
 B.push({ t0: S(20), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); P.ctaShare(ctx, t, S(20) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { P.fondo(cc, t); celArroz(cc, 480, 1300, 600, t); P.veredicto(cc, t, -10, 'MITO', { y: 760 }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(20) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'tecno', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['dañarlo.', 'salva?', 'verdad?', 'botella', 'humedad.', 'fuera…', 'dentro.', 'peor:', 'puerto', 'tapón', 'Apple', 'mito.', 'apágalo,', 'mojado,', 'paño…', 'ventilado,', 'secador.', '30', '24', 'amigo'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 600, gain: 0.006, a: 0.05, hold: DURATION - 2.2 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 104, gain: 0.55, chords: [['D2', 'F2', 'A2', 'D3'], ['A#1', 'D2', 'F2', 'A#2'], ['F2', 'A2', 'C3', 'F3'], ['C2', 'E2', 'G2', 'C3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
