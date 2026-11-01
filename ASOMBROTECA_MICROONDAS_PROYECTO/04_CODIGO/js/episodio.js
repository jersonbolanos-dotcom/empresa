// =====================================================================================================
// episodio.js — «¿Cómo funciona un microondas?» · Asombroteca · PLANTILLA ASOMBROTECA v1.2
// Tres escalas conectadas por cámara continua y cambios de escala:
//   EXTERIOR (cocina) → MECÁNICA (corte técnico: botón, alimentación, magnetrón, guía de ondas, cavidad)
//   → MICROSCÓPICA (moléculas de agua en campo alterno) → corte del alimento (mito, penetración, conducción,
//   mapa térmico) → plato giratorio (vista cenital) → malla de la puerta (macro) → regreso a la cocina.
// Las ondas y las moléculas son VISUALIZACIONES didácticas, no fenómenos visibles. Temperatura (rampa térmica)
// y campo (cian) nunca comparten color. Reloj = segundos de la voz original; todo determinista (H.rng/H.makeNoise).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  calentar: wt(0, 'calentar'), comida0: wt(0, 'comida'), sin: wt(0, 'sin'), aire: wt(0, 'aire'),
  ondas1: wt(1, 'ondas'), invisibles: wt(1, 'invisibles'), pero2: SG(2).s, como: SG(3).s,
  todo: SG(4).s, presionas: wt(4, 'presionas'), boton: wt(4, 'botón'), inicio: wt(4, 'inicio'),
  dentro5: SG(5).s, dispositivo: wt(5, 'dispositivo'), magnetron: wt(5, 'magnetrón'),
  transforma: wt(6, 'transforma'), energia6: wt(6, 'energía'), electrica: wt(6, 'eléctrica'), micro6: wt(6, 'microondas'),
  estas7: SG(7).s, viajan: wt(7, 'viajan'), compartimento: wt(7, 'compartimento'), comida7: wt(7, 'comida'), rebotan: wt(7, 'rebotan'), paredes7: wt(7, 'paredes'), metalicas7: wt(7, 'metálicas'),
  cuando8: SG(8).s, alimentos: wt(8, 'alimentos'), campos: wt(8, 'campos'), interactuan: wt(8, 'interactúan'), moleculas: wt(8, 'moléculas'), agua: wt(8, 'agua'),
  transfiriendo: wt(9, 'transfiriéndoles'), energia9: wt(9, 'energía'), convirtiendo: wt(9, 'convirtiéndose'), calor9: wt(9, 'calor'),
  pero10: SG(10).s, sorprendente: wt(10, 'sorprendente'),
  contrario: SG(11).s, creen: wt(11, 'creen'), no11: wt(11, 'no'), adentro: wt(11, 'adentro'), afuera: wt(11, 'afuera'),
  ondas12: wt(12, 'ondas'), penetran: wt(12, 'penetran'), profundidad: wt(12, 'profundidad'), calor12: wt(12, 'calor'), distribuye: wt(12, 'distribuye'), zonas12: wt(12, 'zonas'),
  poreso: SG(13).s, calientes: wt(13, 'calientes'), mientras: wt(13, 'mientras'), frias: wt(13, 'frías'),
  plato14: SG(14).s, platoW: wt(14, 'plato'), giratorio: wt(14, 'giratorio'),
  para15: SG(15).s, mover: wt(15, 'mover'), zonas15: wt(15, 'zonas'), campo15: wt(15, 'campo'), conseguir: wt(15, 'conseguir'), uniforme: wt(15, 'uniforme'),
  ademas: SG(16).s, paredes16: wt(16, 'paredes'), malla: wt(16, 'malla'), puerta: wt(16, 'puerta'), mantener: wt(16, 'mantener'), dentro16: wt(16, 'dentro'),
  asi: SG(17).s, calientes17: wt(17, 'calientes'), recuerda: wt(17, 'recuerda'),
  no18: SG(18).s, fuego: wt(18, 'fuego'), cocinar: wt(18, 'cocinar'),
  solo: SG(19).s, energia19: wt(19, 'energía'), ondas19: wt(19, 'ondas'), fisica: wt(19, 'física'),
  todo20: SG(20).s, cocina20: wt(20, 'cocina'), dias: wt(20, 'días'), end: A.speech_end,
 };
 // límites de escena (beats)
 const TB = { mol: T.alimentos + 0.4, corte: T.pero10 - 0.1, plato: T.plato14 - 0.1, malla: T.ademas - 0.15, cierre: T.asi - 0.1 };
 const CAPMAX = 1360; // ningún rótulo científico por debajo (subtítulos y UI de redes)

 // ================= utilidades de rótulo =================
 const pillAt = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `700 ${o.px || 26}px "IBM Plex Mono"`; ctx.textAlign = o.align || 'center'; ctx.fillStyle = o.c || 'rgba(200,235,255,0.85)'; ctx.fillText(s, x, y); ctx.restore(); };
 const VIS = (ctx, a) => tag(ctx, 'VISUALIZACIÓN CIENTÍFICA · NO VISIBLE A SIMPLE VISTA', 540, 1395, a * 0.9, { px: 22, c: 'rgba(180,225,255,0.8)' });

 // ================= COCINA + MICROONDAS (espacio-mundo) =================
 let BOKEH = null;
 function bokeh() {
  if (BOKEH) return BOKEH;
  const c = H.layer(1100, 900), x = c.getContext('2d'), R = H.rng(31);
  for (let i = 0; i < 40; i++) { const px = R() * 1100, py = R() * 700, r = R.range(20, 70), warm = R() < 0.6; const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, warm ? 'rgba(255,190,120,0.35)' : 'rgba(150,200,255,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(px - r, py - r, 2 * r, 2 * r); }
  // siluetas suaves de estantes y frascos (desenfocadas)
  x.filter = 'blur(10px)'; x.fillStyle = 'rgba(30,22,18,0.6)'; x.fillRect(0, 360, 1100, 26); for (let i = 0; i < 9; i++) { x.fillStyle = `rgba(${60 + R() * 40},${45 + R() * 30},${35 + R() * 20},0.55)`; x.beginPath(); x.roundRect(40 + i * 120, 250 + R() * 30, 60 + R() * 30, 110, 14); x.fill(); }
  x.filter = 'none'; return (BOKEH = c);
 }
 function kitchen(ctx, t, lit) {
  // pared (ladrillo blanco cálido apenas insinuado), luz colgante, mesada con reflejo
  const g = ctx.createLinearGradient(0, -1700, 0, 260); g.addColorStop(0, '#1a1512'); g.addColorStop(0.55, '#3a2c22'); g.addColorStop(1, '#5a4434');
  ctx.fillStyle = g; ctx.fillRect(-1400, -1800, 2800, 2060);
  ctx.globalAlpha = 0.9; ctx.drawImage(bokeh(), -1100, -1250, 2200, 1800); ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(255,230,200,0.05)'; ctx.lineWidth = 3; for (let y = -1700; y < 260; y += 70) { ctx.beginPath(); ctx.moveTo(-1400, y); ctx.lineTo(1400, y); ctx.stroke(); }
  P.glow(ctx, -650, -900, 900, '255,190,120', 0.35);
  const cg = ctx.createLinearGradient(0, 260, 0, 1000); cg.addColorStop(0, '#6b5444'); cg.addColorStop(0.05, '#3d2f26'); cg.addColorStop(1, '#16110e');
  ctx.fillStyle = cg; ctx.fillRect(-1400, 260, 2800, 2600);
  ctx.fillStyle = 'rgba(255,220,180,0.25)'; ctx.fillRect(-1400, 258, 2800, 5);
  // luz del interior derramada sobre la mesada
  P.glow(ctx, -140, 300, 600, '255,200,120', 0.25 * lit);
 }
 // geometría del aparato (frente en el plano z=0; vista 3/4 con cara superior y lateral derecha)
 const MW = { x0: -440, x1: 440, y0: -260, y1: 260, dx: 70, dy: -70, cav: [-330, -150, 60, 150], food: [-135, 112], panel: [160, -240, 420, 240], btn: [290, 165], mag: [290, -35], wg: [[290, -112], [290, -195], [95, -195], [62, -112]] };
 function foodShape(ctx, x, y, s) { ctx.beginPath(); ctx.moveTo(x - 82 * s, y); ctx.bezierCurveTo(x - 80 * s, y - 50 * s, x - 30 * s, y - 62 * s, x, y - 60 * s); ctx.bezierCurveTo(x + 40 * s, y - 62 * s, x + 82 * s, y - 46 * s, x + 82 * s, y); ctx.closePath(); }
 function microwave(ctx, t, st) {
  // st: { on, lit, xr (corte técnico 0..1), door (apertura 0..1), heat, turn (ángulo plato), waves, field, press }
  const { x0, x1, y0, y1, dx, dy } = MW, [cx0, cy0, cx1, cy1] = MW.cav;
  // sombra de contacto y reflejo en la mesada
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(30, y1 + 6, 520, 26, 0, 0, TAU); ctx.fill(); ctx.restore();
  { const rg2 = ctx.createLinearGradient(0, y1, 0, y1 + 160); rg2.addColorStop(0, 'rgba(150,160,175,0.16)'); rg2.addColorStop(1, 'rgba(150,160,175,0)'); ctx.fillStyle = rg2; ctx.fillRect(x0 + 10, y1 + 4, x1 - x0 + 40, 160); }
  // --- interior de la cavidad (se ve por la ventana; con el corte técnico, entero)
  const lit = st.lit;
  ctx.save();
  const ig = ctx.createLinearGradient(0, cy0, 0, cy1); ig.addColorStop(0, H.rgba(H.mix([60, 62, 70], [250, 214, 150], lit))); ig.addColorStop(1, H.rgba(H.mix([40, 42, 48], [205, 160, 100], lit)));
  ctx.fillStyle = ig; ctx.fillRect(cx0 - 60, cy0 - 50, cx1 - cx0 + 120, cy1 - cy0 + 100);
  ctx.fillStyle = H.rgba(H.mix([30, 32, 38], [190, 150, 95], lit)); ctx.beginPath(); ctx.moveTo(cx0 - 60, cy0 - 50); ctx.lineTo(cx0, cy0); ctx.lineTo(cx0, cy1); ctx.lineTo(cx0 - 60, cy1 + 50); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx1 + 60, cy0 - 50); ctx.lineTo(cx1, cy0); ctx.lineTo(cx1, cy1); ctx.lineTo(cx1 + 60, cy1 + 50); ctx.fill();
  ctx.fillStyle = H.rgba(H.mix([35, 36, 42], [170, 130, 85], lit)); ctx.beginPath(); ctx.moveTo(cx0 - 60, cy1 + 50); ctx.lineTo(cx0, cy1); ctx.lineTo(cx1, cy1); ctx.lineTo(cx1 + 60, cy1 + 50); ctx.fill();
  // abertura de la guía de ondas en la pared derecha (mica)
  ctx.fillStyle = H.rgba(H.mix([70, 70, 80], [230, 215, 180], lit)); ctx.fillRect(cx1 + 8, -130, 26, 44);
  // plato giratorio de vidrio + comida
  const [fx, fy] = MW.food;
  ctx.fillStyle = 'rgba(220,235,255,0.25)'; ctx.beginPath(); ctx.ellipse(fx, fy + 30, 175, 32, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#f2efe8'; ctx.beginPath(); ctx.ellipse(fx, fy + 18, 120, 22, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#d8d3ca'; ctx.beginPath(); ctx.ellipse(fx, fy + 22, 100, 15, 0, 0, TAU); ctx.fill();
  const ta = st.turn || 0;
  ctx.save(); foodShape(ctx, fx, fy + 16, 1); ctx.clip();
  const fg = ctx.createLinearGradient(0, fy - 50, 0, fy + 16); fg.addColorStop(0, '#d9893b'); fg.addColorStop(1, '#9c5220'); ctx.fillStyle = fg; ctx.fillRect(fx - 90, fy - 60, 180, 80);
  const R = H.rng(5); for (let i = 0; i < 14; i++) { const u = ((R() + ta / TAU) % 1), px = fx - 80 + u * 160, py = fy - 30 + R() * 40, vis = Math.sin(u * Math.PI); ctx.fillStyle = `rgba(${R() < 0.5 ? '120,170,60' : '240,200,120'},${0.8 * vis})`; ctx.beginPath(); ctx.ellipse(px, py, 9 * vis + 1, 6, 0, 0, TAU); ctx.fill(); }
  if (st.heat > 0) { const hR = H.rng(8); for (let i = 0; i < 5; i++) { const u = ((hR() + ta / TAU) % 1), px = fx - 70 + u * 140, py = fy - 25 + hR() * 35; P.glow(ctx, px, py, 40, '255,120,40', 0.55 * st.heat * Math.sin(u * Math.PI)); } }
  ctx.restore();
  // vapor
  if (st.steam > 0) { ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${0.35 * st.steam})`; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let k = 0; k < 4; k++) { ctx.beginPath(); for (let j = 0; j <= 20; j++) { const u = j / 20, yy = fy - 60 - u * 160 * st.steam, xx = fx - 45 + k * 30 + Math.sin(u * 6 + t * 2 + k) * 12 * u; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } ctx.restore(); }
  // luz interior
  P.glow(ctx, (cx0 + cx1) / 2, cy0 + 10, 360, '255,210,140', 0.35 * lit);
  // ondas dentro de la cavidad (visualización)
  if (st.waves > 0) cavityWaves(ctx, t, st.waves, st.bounce || 0);
  if (st.field > 0) fieldMap(ctx, t, st.field);
  ctx.restore();
  // --- cuerpo: cara superior, lateral, frente (con transparencia en el corte técnico)
  const xr = st.xr || 0, fa = 1 - 0.82 * xr;
  ctx.save(); ctx.globalAlpha = fa;
  ctx.fillStyle = '#4a505b'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + dx, y0 + dy); ctx.lineTo(x1 + dx, y0 + dy); ctx.lineTo(x1, y0); ctx.fill();
  ctx.fillStyle = '#1c1f25'; ctx.beginPath(); ctx.moveTo(x1, y0); ctx.lineTo(x1 + dx, y0 + dy); ctx.lineTo(x1 + dx, y1 + dy); ctx.lineTo(x1, y1); ctx.fill();
  // frente con hueco de ventana
  const bg = ctx.createLinearGradient(x0, y0, x1, y1); bg.addColorStop(0, '#3a3f48'); bg.addColorStop(0.5, '#2a2e35'); bg.addColorStop(1, '#22252b');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 22); ctx.roundRect(-385, -200, 500, 400, 14); ctx.fill('evenodd');
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x0 + 10, y0 + 6, x1 - x0 - 20, 8);
  // separación puerta/panel
  ctx.fillStyle = '#16181d'; ctx.fillRect(148, y0 + 14, 6, y1 - y0 - 28);
  ctx.restore();
  // ventana: vidrio oscuro + malla (puntos) + reflejo
  ctx.save(); ctx.beginPath(); ctx.roundRect(-385, -200, 500, 400, 14); ctx.clip();
  ctx.fillStyle = `rgba(10,12,16,${(0.55 - 0.35 * lit) * (1 - 0.7 * xr) * (1 - cl((st.door || 0) * 3))})`; ctx.fillRect(-385, -200, 500, 400);
  const ma = (1 - xr) * (st.mesh ?? 1) * (1 - cl((st.door || 0) * 3));
  if (ma > 0.02) { ctx.fillStyle = `rgba(0,0,0,${0.3 * ma})`; for (let y = -196; y < 200; y += 9) for (let x = -381 + ((y / 9) % 2) * 4.5; x < 115; x += 9) ctx.fillRect(x, y, 4, 4); }
  const rg = ctx.createLinearGradient(-385, -200, 115, 200); rg.addColorStop(0, 'rgba(255,255,255,0.12)'); rg.addColorStop(0.35, 'rgba(255,255,255,0)'); rg.addColorStop(0.6, 'rgba(255,255,255,0.05)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = rg; ctx.fillRect(-385, -200, 500, 400);
  ctx.restore();
  // panel de control: pantalla, botones, INICIO
  ctx.save(); ctx.globalAlpha = 1 - 0.6 * xr;
  ctx.fillStyle = '#0b0d10'; ctx.beginPath(); ctx.roundRect(190, -212, 200, 74, 10); ctx.fill();
  const on = st.on;
  ctx.fillStyle = on ? '#67f0d0' : '#22403a'; ctx.font = '700 40px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(on ? (Math.floor(t * 2) % 2 ? '≋≋≋' : '≈≈≈') : '– – –', 290, -174);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { ctx.fillStyle = '#353a44'; ctx.beginPath(); ctx.roundRect(200 + c * 66, -105 + r * 58, 52, 40, 8); ctx.fill(); }
  const pr = st.press || 0, [bx, by] = MW.btn;
  ctx.fillStyle = '#123'; ctx.beginPath(); ctx.arc(bx, by + 6, 48, 0, TAU); ctx.fill();
  ctx.fillStyle = on ? '#2fbf71' : '#2a7a52'; ctx.beginPath(); ctx.arc(bx, by + pr * 5, 46, 0, TAU); ctx.fill();
  if (on) P.glow(ctx, bx, by, 110, '80,255,160', 0.5);
  ctx.fillStyle = '#ffffff'; ctx.font = '900 22px Nunito'; ctx.fillText('INICIO', bx, by + pr * 5 + 1);
  ctx.restore();
  // corte técnico: contornos luminosos + componentes internos
  if (xr > 0.01) internals(ctx, t, st);
  // puerta abierta (gira hacia la izquierda)
  if (st.door > 0) { const d = E.inOut(st.door), w = 570 * (1 - d * 0.82); ctx.save(); ctx.fillStyle = '#2c3038'; ctx.beginPath(); ctx.moveTo(-420, -240); ctx.lineTo(-420 + w, -240 - 40 * d); ctx.lineTo(-420 + w, 240 + 40 * d); ctx.lineTo(-420, 240); ctx.fill(); ctx.fillStyle = '#16181d'; ctx.fillRect(-420 - 30 * d, -240, 30 * d, 480); ctx.restore(); }
 }
 // componentes internos en el corte técnico (alimentación → magnetrón → guía de ondas → cavidad)
 function internals(ctx, t, st) {
  const xr = st.xr, cy = '90,220,255';
  ctx.save(); ctx.globalAlpha = xr;
  // contornos de la carcasa y la cavidad
  const line = (pts, w = 3, c = cy, a = 0.8) => { ctx.strokeStyle = `rgba(${c},${a})`; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); };
  line([[MW.x0, MW.y0], [MW.x1, MW.y0], [MW.x1, MW.y1], [MW.x0, MW.y1], [MW.x0, MW.y0]], 2.5);
  line([[MW.x1, MW.y0], [MW.x1 + MW.dx, MW.y0 + MW.dy], [MW.x1 + MW.dx, MW.y1 + MW.dy], [MW.x1, MW.y1]], 2);
  const [cx0, cy0, cx1, cy1] = MW.cav; line([[cx0 - 60, cy0 - 50], [cx1 + 60, cy0 - 50], [cx1 + 60, cy1 + 50], [cx0 - 60, cy1 + 50], [cx0 - 60, cy0 - 50]], 3, '170,200,230', 0.9);
  // transformador / alimentación de alto voltaje (caja con bobinado)
  const hv = st.power || 0;
  ctx.fillStyle = 'rgba(40,46,58,0.95)'; ctx.beginPath(); ctx.roundRect(222, 210, 136, 30, 6); ctx.fill();
  ctx.fillStyle = '#5b4a3a'; ctx.beginPath(); ctx.roundRect(230, 95, 120, 110, 10); ctx.fill();
  ctx.fillStyle = '#b87333'; for (let i = 0; i < 6; i++) ctx.fillRect(244, 105 + i * 16, 92, 9);
  // cable de alimentación al magnetrón, con energía eléctrica que circula
  ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(350, 120); ctx.bezierCurveTo(400, 100, 400, 20, 340, 10); ctx.stroke();
  if (hv > 0) for (let k = 0; k < 5; k++) { const u = (t * 1.4 + k / 5) % 1, mt = 1 - u; const x = mt * mt * mt * 350 + 3 * mt * mt * u * 400 + 3 * mt * u * u * 400 + u * u * u * 340, y = mt * mt * mt * 120 + 3 * mt * mt * u * 100 + 3 * mt * u * u * 20 + u * u * u * 10; P.glow(ctx, x, y, 22, '255,220,80', hv); }
  // magnetrón: cuerpo con aletas de refrigeración, imanes arriba/abajo y antena hacia la guía de ondas
  const [mx, my] = MW.mag, act = st.mag || 0;
  ctx.fillStyle = '#7d858f'; ctx.beginPath(); ctx.roundRect(mx - 48, my - 58, 96, 116, 10); ctx.fill();
  ctx.fillStyle = '#aab2bc'; for (let i = 0; i < 9; i++) ctx.fillRect(mx - 62, my - 50 + i * 12, 124, 5);
  ctx.fillStyle = '#3b3f46'; ctx.beginPath(); ctx.roundRect(mx - 40, my - 74, 80, 18, 6); ctx.fill(); ctx.beginPath(); ctx.roundRect(mx - 40, my + 56, 80, 18, 6); ctx.fill();
  ctx.fillStyle = '#c9ced6'; ctx.beginPath(); ctx.roundRect(mx - 12, my - 96, 24, 26, 8); ctx.fill();
  if (act > 0) { P.glow(ctx, mx, my, 150, '120,230,255', 0.55 * act * (0.85 + 0.15 * Math.sin(t * 20))); P.glow(ctx, mx, my - 90, 60, '160,240,255', 0.8 * act); }
  // guía de ondas (conducto metálico rectangular)
  ctx.strokeStyle = 'rgba(150,160,175,0.95)'; ctx.lineWidth = 34; ctx.lineJoin = 'round'; ctx.beginPath(); MW.wg.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
  ctx.strokeStyle = 'rgba(40,46,58,0.95)'; ctx.lineWidth = 24; ctx.stroke();
  if (st.guide > 0) P.wave(ctx, MW.wg, t, { amp: 9, lam: 46, speed: 140, prog: st.guide, a: 1 });
  ctx.restore();
 }
 // ondas que rebotan en la cavidad (cintas sinusoidales, nunca rayos rectos ni partículas)
 function cavityWaves(ctx, t, a, bounce) {
  const [x0, y0, x1, y1] = MW.cav, paths = [
   [[x1 + 20, -108], [x0, -20], [x1, 70], [x0 + 60, 150]],
   [[x1 + 20, -108], [x0 + 120, y0], [x0, 60], [x1, 140]],
   [[x1 + 20, -108], [x1 - 160, y1], [x0, y0 + 30], [x1 - 40, y0 + 10]],
  ];
  paths.forEach((p, i) => P.wave(ctx, p, t + i * 0.3, { amp: 16, lam: 110, speed: 140, a: a * (0.95 - i * 0.2), prog: cl(a * 1.2 - i * 0.1), over: true, rgb: '20,130,215' }));
  if (bounce > 0) paths.forEach((p) => p.slice(1, -1).forEach((q, k) => { const ph = (t * 1.3 + k * 0.4) % 1; { ctx.save(); ctx.strokeStyle = `rgba(20,130,215,${bounce * (1 - ph) * 0.9})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(q[0], q[1], 10 + 40 * ph, 0, TAU); ctx.stroke(); ctx.restore(); }; }));
 }
 // intensidad del campo (patrón estacionario: zonas fuertes y débiles), en cian — NO es temperatura
 function fieldMap(ctx, t, a) {
  const [x0, y0, x1, y1] = MW.cav;
  for (let x = x0 + 30; x <= x1 - 20; x += 46) for (let y = y0 + 25; y <= y1 - 10; y += 46) { const v = Math.abs(Math.sin((x - x0) / 61 * Math.PI) * Math.sin((y - y0) / 57 * Math.PI + 0.6)), r = 6 + 16 * v * v; ctx.fillStyle = `rgba(20,130,215,${a * (0.25 + 0.55 * v * v) * (0.85 + 0.15 * Math.sin(t * 6 + x))})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
 }

 // ---------------- cámara del mundo ----------------
 const yOff = (z) => 120 / z; // el objeto mirado queda en y≈840 de pantalla (sobre los subtítulos)
 const CAM1 = [
  [0, 35, 60 + yOff(0.62), 0.62], [1.0, 20, 40 + yOff(0.75), 0.75], [3.4, -120, 10 + yOff(1.3), 1.3],
  [T.ondas1 - 0.2, -125, yOff(1.45), 1.45], [T.invisibles, -135, yOff(2.25), 2.25], [T.como + 0.3, -120, yOff(2.25), 2.25],
  [T.presionas - 0.5, 290, 40 + yOff(2.6), 2.6], [T.inicio + 0.3, 290, 40 + yOff(2.6), 2.6], [T.dispositivo, 300, -20 + yOff(2.2), 2.2], [T.micro6 + 0.4, 290, -30 + yOff(2.2), 2.2],
  [T.compartimento, 150, -90 + yOff(1.9), 1.9], [T.rebotan - 0.2, -110, yOff(1.75), 1.75], [T.alimentos - 0.6, -130, 40 + yOff(1.8), 1.8], [TB.mol + 0.05, -135, 70 + yOff(7), 7],
 ];
 const CAM6 = [[TB.cierre, -110, 20 + yOff(1.5), 1.5], [T.recuerda, 20, 40 + yOff(0.8), 0.8], [T.no18 + 0.6, -40, 60 + yOff(1.05), 1.05], [T.todo20, -120, 80 + yOff(1.7), 1.7], [DURATION, -135, 90 + yOff(2.2), 2.2]];
 function world(ctx, t, cam, st) { ctx.save(); P.camApply(ctx, cam); kitchen(ctx, t, st.lit); microwave(ctx, t, st); ctx.restore(); }
 const foodScreen = (t, keys) => { const c = P.camAt(keys, t); return [(MW.food[0] - c[0]) * c[2] + W / 2, (MW.food[1] - 10 - c[1]) * c[2] + HH / 2]; };

 // ================= BEATS =================
 const B = [];
 // B1 · EXTERIOR → MECÁNICA: gancho, ondas invisibles, botón de inicio, magnetrón, guía de ondas, rebotes, campo
 B.push({ t0: 0, t1: TB.mol, draw(ctx, t) {
  const cam = P.camAt(CAM1, t);
  const xr = sm(1.4, 3.0, t) * (1 - sm(T.ondas1 - 0.4, T.ondas1 + 0.6, t)) + sm(T.inicio + 0.1, T.dentro5 + 0.3, t) * (1 - sm(T.estas7 + 2.4, T.rebotan, t)) * 1;
  const stopPre = t > T.como + 0.2 && t < T.inicio; // el aparato se detiene: «todo comienza…»
  const on = !stopPre;
  const st = {
   on, lit: on ? 1 : 0.15 + 0.85 * sm(T.inicio - 0.1, T.inicio + 0.2, t), xr: cl(xr), heat: sm(2.0, 3.6, t) * (1 - sm(T.ondas1, T.ondas1 + 1, t)) + 0.5 * sm(T.rebotan, T.alimentos, t),
   turn: t * 0.5, waves: (sm(1.8, 2.6, t) * (1 - sm(T.como, T.como + 0.4, t)) + sm(T.compartimento - 0.3, T.compartimento + 0.6, t)), bounce: sm(T.rebotan - 0.1, T.rebotan + 0.2, t),
   field: sm(T.metalicas7, T.metalicas7 + 0.5, t) * (1 - sm(TB.mol - 0.6, TB.mol, t)) + sm(T.ondas1 + 0.8, T.invisibles + 0.3, t) * (1 - sm(T.como, T.como + 0.4, t)),
   press: win(t, T.presionas, T.presionas + 0.12) * (1 - win(t, T.presionas + 0.25, T.presionas + 0.4)), power: sm(T.energia6 - 0.2, T.energia6 + 0.2, t) * (1 - sm(T.viajan, T.viajan + 0.6, t)) + sm(T.inicio, T.inicio + 0.3, t) * (1 - sm(T.dentro5, T.dentro5 + 0.4, t)),
   mag: sm(T.magnetron - 0.2, T.magnetron + 0.2, t), guide: E.inOut(win(t, T.micro6 - 0.2, T.compartimento)),
  };
  st.mesh = 1 - sm(1.25, 1.7, cam[2]);
  world(ctx, t, cam, st);
  // dedo que presiona INICIO
  if (t > T.presionas - 0.6 && t < T.dentro5 + 0.2) { const [bx, by] = MW.btn, sx = (bx - cam[0]) * cam[2] + W / 2, sy = (by - cam[1]) * cam[2] + HH / 2, d = 1 - E.out(win(t, T.presionas - 0.6, T.presionas)), up = win(t, T.presionas + 0.3, T.dentro5); P.finger(ctx, sx + 60, sy + 20 + 260 * d + 500 * E.in(up), 180, win(t, T.presionas, T.presionas + 0.12)); }
  // rótulos (pantalla)
  P.withPop(ctx, t, 0.9, 540, 360, () => { ctx.save(); ctx.globalAlpha = 1 - sm(T.ondas1 - 0.7, T.ondas1 - 0.1, t); P.bigText(ctx, 'CALOR SIN FUEGO', 540, 360, 96, '#ffd54a', { kind: 'title', strokeCol: '#1b1206' }); ctx.restore(); });
  pillAt(ctx, 'AIRE: CASI SIN CALENTAR', 300, 520, 30, t, T.aire - 0.1, '#5aa9ff', '#ffffff', T.ondas1 + 0.2);
  pillAt(ctx, 'COMIDA: SE CALIENTA', 780, 1290, 30, t, T.calentar + 1.2, '#ff7a3d', '#ffffff', T.ondas1 + 0.2);
  pillAt(ctx, 'ONDAS ELECTROMAGNÉTICAS', 540, 380, 40, t, T.ondas1 + 0.1, '#1fb6d6', '#ffffff', T.como + 0.2);
  pillAt(ctx, 'INVISIBLES', 540, 470, 34, t, T.invisibles, '#ffffff', '#11344a', T.como + 0.2);
  P.onoma(ctx, '¿CÓMO?', 540, 520, 120, t, T.como, T.todo + 0.1, { c: '#ffd54a' });
  pillAt(ctx, 'BOTÓN DE INICIO', 540, 400, 38, t, T.boton, '#2fbf71', '#ffffff', T.dentro5 + 0.3);
  pillAt(ctx, 'MAGNETRÓN', 540, 380, 52, t, T.magnetron, '#1fb6d6', '#ffffff', T.estas7 + 0.4);
  pillAt(ctx, 'ENERGÍA ELÉCTRICA', 300, 1290, 30, t, T.energia6, '#d4a017', '#1b1206', T.estas7 + 0.4);
  if (t > T.micro6 - 0.1 && t < T.estas7 + 0.4) { ctx.save(); ctx.globalAlpha = sm(T.micro6 - 0.1, T.micro6 + 0.2, t) * (1 - sm(T.estas7, T.estas7 + 0.4, t)); P.arrow(ctx, 475, 1290, 590, 1290, 1, '#ffffff', 14); ctx.restore(); }
  pillAt(ctx, 'MICROONDAS', 790, 1290, 30, t, T.micro6, '#1fb6d6', '#ffffff', T.estas7 + 0.4);
  pillAt(ctx, 'GUÍA DE ONDAS', 540, 400, 40, t, T.viajan, '#8a98ad', '#ffffff', T.rebotan - 0.2);
  pillAt(ctx, 'LAS PAREDES METÁLICAS LAS REFLEJAN', 540, 400, 34, t, T.paredes7 - 0.1, '#ffffff', '#11344a', TB.mol - 0.3);
  if (t > T.metalicas7) { tag(ctx, 'INTENSIDAD DEL CAMPO: zonas fuertes y débiles', 540, 470, sm(T.metalicas7 + 0.2, T.metalicas7 + 0.5, t) * (1 - sm(TB.mol - 0.6, TB.mol - 0.2, t)), { px: 26 }); }
  VIS(ctx, cl(st.waves + st.field + (st.guide > 0 && st.guide < 1 ? 1 : 0)) * (1 - sm(TB.mol - 0.6, TB.mol, t)));
 }, sfx(k) {
  FX.zumbido(k, 0, T.como + 0.2, 0.8); FX.motor(k, 0, T.como + 0.2, 0.7);
  k.play('whoosh', 0.05, { dur: 0.9, top: 2400, gain: 0.4 }); FX.sello(k, 0.9); FX.campo(k, 1.8, 1.0, 0.8); FX.revelar(k, 1.4);
  FX.etiqueta(k, T.calentar + 1.2); FX.etiqueta(k, T.aire - 0.1);
  k.play('whoosh', T.ondas1 - 0.3, { dur: 1.0, top: 1600, gain: 0.4 }); FX.aparece(k, T.ondas1 + 0.1, 520); FX.campo(k, T.ondas1 + 0.6, 1.6, 1); FX.etiqueta(k, T.invisibles);
  k.noise(T.como, { dur: 0.6, color: 'brown', filter: 'lowpass', f: [[0, 400], [0.6, 90]], gain: 0.15, a: 0.02 }); FX.onomatopeya(k, T.como);
  k.play('whoosh', T.presionas - 0.6, { dur: 0.6, gain: 0.35 }); FX.clic(k, T.presionas + 0.02); FX.pitido(k, T.presionas + 0.06, 'E6', 1); FX.aparece(k, T.boton, 600);
  FX.zumbido(k, T.inicio, TB.mol - T.inicio + 0.6, 1); FX.motor(k, T.inicio, TB.mol - T.inicio, 0.6);
  k.play('whoosh', T.dentro5, { dur: 0.7, gain: 0.35 }); FX.sello(k, T.magnetron); k.tone(T.magnetron, { f: [[0, 90], [0.6, 180]], type: 'sawtooth', dur: 0.8, gain: 0.05, filter: 'lowpass', f2: 900 });
  k.play('neon', T.energia6, { dur: 0.35, gain: 0.35 }); FX.etiqueta(k, T.energia6); FX.flecha(k, T.micro6 - 0.1); FX.etiqueta(k, T.micro6); FX.campo(k, T.micro6, 1.2, 0.8);
  k.play('whoosh', T.viajan - 0.2, { dur: 1.0, top: 1400, gain: 0.35 }); FX.etiqueta(k, T.viajan);
  [0, 0.25, 0.5].forEach((d) => k.play('tock', T.rebotan + d, { f: 1400 - d * 400, gain: 0.25, minor: true })); FX.etiqueta(k, T.paredes7 - 0.1);
  FX.campo(k, T.metalicas7, 1.0, 1); FX.escala(k, T.alimentos - 0.6, 1.0);
 } });
 // B2 · ESCALA MOLECULAR: campo eléctrico alterno, moléculas de agua, energía → calor
 const MOLS = (() => { const R = H.rng(77), o = []; for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) o.push({ x: 170 + c * 235 + R.range(-50, 50) + (r % 2) * 60, y: 500 + r * 125 + R.range(-30, 30), a0: R() * TAU, k: R.range(0.25, 0.9), lag: R.range(0, 1.2), s: R.range(44, 56), ph: R() * TAU }); return o; })();
 B.push({ t0: TB.mol, t1: TB.corte, in: { type: 'zoom', d: 0.8, x: 540, y: 820 }, draw(ctx, t) {
  const g = ctx.createRadialGradient(540, 860, 50, 540, 860, 1100); g.addColorStop(0, '#2a1c14'); g.addColorStop(1, '#0d0907'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const heat = sm(T.transfiriendo, T.calor9 + 0.4, t), Ea = sm(T.campos - 0.2, T.campos + 0.3, t), w = TAU * 0.9, Ef = Math.sin(w * t);
  // fondo: matriz del alimento (glóbulos suaves)
  const R = H.rng(4); for (let i = 0; i < 26; i++) P.glow(ctx, R() * W, 380 + R() * 1000, R.range(80, 200), '200,120,60', 0.08);
  // campo eléctrico alterno: flechas que cambian de sentido
  if (Ea > 0) for (let r = 0; r < 6; r++) { const y = 560 + r * 125 + 62 - 125, L = 220 * Ef; ctx.save(); ctx.globalAlpha = Ea * 0.55; for (let c = 0; c < 3; c++) { const x = 200 + c * 340; if (Math.abs(L) > 20) P.arrow(ctx, x - L / 2, y, x + L / 2, y, 1, '#36c9ec', 12); } ctx.restore(); }
  // moléculas de agua: cada una responde con su propio desfase y desorden (no giran todas igual)
  MOLS.forEach((m, i) => {
   const resp = Ea * m.k * Math.sin(w * t - m.lag), jit = heat * 0.35, R2 = H.rng(i * 31 + Math.floor(t * 30));
   const ang = m.a0 + resp * 0.9 + (R2() - 0.5) * jit * 2, dx = (R2() - 0.5) * 14 * heat, dy = (R2() - 0.5) * 14 * heat;
   P.water(ctx, m.x + dx + Math.sin(t * 0.7 + m.ph) * 6, m.y + dy, m.s, ang, { hot: heat * (0.6 + 0.4 * m.k) });
  });
  if (heat > 0) P.glow(ctx, 540, 880, 700, '255,110,40', 0.25 * heat);
  const hi = MOLS[13];
  if (t > T.agua - 0.1) { const a = sm(T.agua - 0.1, T.agua + 0.2, t); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#ffd54a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(hi.x, hi.y, 70, 0, TAU); ctx.stroke(); ctx.restore(); }
  pillAt(ctx, 'CAMPO ELÉCTRICO ALTERNANTE', 540, 390, 36, t, T.campos, '#1fb6d6', '#ffffff', T.transfiriendo);
  pillAt(ctx, 'MOLÉCULAS DE AGUA (H₂O)', 540, 390, 36, t, T.agua, '#ffffff', '#5a1c10', T.convirtiendo - 0.2);
  pillAt(ctx, 'ENERGÍA  →  CALOR', 540, 390, 46, t, T.convirtiendo, '#ff7a3d', '#ffffff');
  // termómetro cualitativo
  const ta = sm(T.energia9 - 0.3, T.energia9, t);
  if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; P.rr(ctx, 960, 560, 56, 620, 28, '#ffffff', { sy: 8 }); const hcol = P.heat(heat); ctx.fillStyle = H.rgba(hcol); ctx.beginPath(); ctx.roundRect(972, 1168 - 590 * (0.12 + 0.88 * heat), 32, 590 * (0.12 + 0.88 * heat), 16); ctx.fill(); ctx.restore(); }
  tag(ctx, 'El campo cede energía a las moléculas polares;', 540, 1300, sm(T.energia9, T.energia9 + 0.4, t), { px: 26, c: 'rgba(255,235,210,0.9)' });
  tag(ctx, 'se disipa en el alimento como calor (no es simple fricción).', 540, 1336, sm(T.energia9, T.energia9 + 0.4, t), { px: 26, c: 'rgba(255,235,210,0.9)' });
  VIS(ctx, 1);
 }, sfx(k) {
  FX.campo(k, T.campos - 0.2, 1.4, 1); FX.etiqueta(k, T.campos);
  for (let x = T.campos; x < T.calor9 + 0.4; x += 1 / 1.8) k.tone(x, { f: 220, type: 'sine', dur: 0.4, gain: 0.03, a: 0.08, filter: 'lowpass', f2: 900, minor: true });
  FX.etiqueta(k, T.moleculas); FX.aparece(k, T.agua, 700); k.play('ding', T.agua + 0.05, { f: 'A5', gain: 0.15, minor: true });
  k.noise(T.transfiriendo, { dur: T.calor9 + 0.6 - T.transfiriendo, color: 'pink', filter: 'bandpass', f: [[0, 500], [T.calor9 - T.transfiriendo, 2400]], q: 0.8, gain: 0.07, a: 1.2 });
  FX.sello(k, T.convirtiendo); k.play('success', T.calor9 + 0.1, { gain: 0.25 });
 } });
 // B3 · CORTE DEL ALIMENTO: el mito, penetración, conducción, mapa térmico (zonas calientes y frías)
 const GX = 152, GY = 96, CELL = 5, FX0 = 160, FY0 = 640; // rejilla térmica 760x480 px
 const nzF = H.makeNoise(23);
 const inFood = (i, j) => { const x = i / (GX - 1) * 2 - 1, y = j / (GY - 1) * 2 - 1; return Math.pow(Math.abs(x), 4) + Math.pow(Math.abs(y), 4) < 1; };
 const DEPTH = new Float32Array(GX * GY); // distancia al borde (aprox.)
 (() => { for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) { let d = 99; if (inFood(i, j)) { for (let r = 1; r < 60; r++) { if (!inFood(i + r, j) || !inFood(i - r, j) || !inFood(i, j + r) || !inFood(i, j - r)) { d = r; break; } } } else d = -1; DEPTH[j * GX + i] = d; } })();
 const ABS = new Float32Array(GX * GY); // energía absorbida: decae con la profundidad + irregularidad (no un patrón universal)
 (() => { for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) { const d = DEPTH[j * GX + i]; if (d < 0) continue; const irr = 0.55 + 0.45 * nzF.fbm2(i * 0.05, j * 0.07, 3) * 1.6, field = 0.6 + 0.4 * Math.abs(Math.sin(i * 0.09 + 0.5) * Math.sin(j * 0.11)); ABS[j * GX + i] = cl(Math.exp(-d / 13) * field * irr * 1.3 + 0.12 * cl(nzF.n2(i * 0.04 + 9, j * 0.04)), 0, 1.2); } })();
 const TMP = new Float32Array(GX * GY), TMP2 = new Float32Array(GX * GY);
 function blurGrid(src, r) { if (r < 1) { TMP.set(src); return TMP; } const a = TMP2; for (let j = 0; j < GY; j++) { let acc = 0, n = 0; for (let i = -r; i < GX + r; i++) { if (i + r < GX && DEPTH[j * GX + i + r] >= 0) { acc += src[j * GX + i + r]; n++; } if (i - r - 1 >= 0 && DEPTH[j * GX + i - r - 1] >= 0) { acc -= src[j * GX + i - r - 1]; n--; } if (i >= 0 && i < GX) a[j * GX + i] = n ? acc / n : 0; } } for (let i = 0; i < GX; i++) { let acc = 0, n = 0; for (let j = -r; j < GY + r; j++) { if (j + r < GY && DEPTH[(j + r) * GX + i] >= 0) { acc += a[(j + r) * GX + i]; n++; } if (j - r - 1 >= 0 && DEPTH[(j - r - 1) * GX + i] >= 0) { acc -= a[(j - r - 1) * GX + i]; n--; } if (j >= 0 && j < GY) TMP[j * GX + i] = n ? acc / n : 0; } } return TMP; }
 let HL = null;
 function drawField(ctx, vals, mapFn, a) {
  if (!HL) HL = H.layer(GX, GY); const c = HL.getContext('2d'), img = c.createImageData(GX, GY), d = img.data;
  for (let q = 0; q < GX * GY; q++) { if (DEPTH[q] < 0) { d[q * 4 + 3] = 0; continue; } const [r, g, b] = mapFn(vals[q], q); d[q * 4] = r; d[q * 4 + 1] = g; d[q * 4 + 2] = b; d[q * 4 + 3] = 255; }
  c.putImageData(img, 0, 0); ctx.save(); ctx.globalAlpha = a; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(HL, FX0, FY0, GX * CELL, GY * CELL); ctx.restore();
 }
 function foodOutline(ctx) { ctx.beginPath(); for (let k = 0; k <= 120; k++) { const a = k / 120 * TAU, c = Math.cos(a), s = Math.sin(a), x = Math.sign(c) * Math.pow(Math.abs(c), 0.5), y = Math.sign(s) * Math.pow(Math.abs(s), 0.5); const px = FX0 + (x + 1) / 2 * (GX - 1) * CELL, py = FY0 + (y + 1) / 2 * (GY - 1) * CELL; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); }
 B.push({ t0: TB.corte, t1: TB.plato, in: { type: 'iris', d: 0.7, x: 540, y: 880 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#14181f'); g.addColorStop(1, '#07090c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  P.glow(ctx, 540, 880, 800, '255,200,140', 0.08);
  // plato
  ctx.fillStyle = '#e9e5dc'; ctx.beginPath(); ctx.ellipse(540, 1160, 470, 50, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#cfc9bd'; ctx.beginPath(); ctx.ellipse(540, 1160, 420, 36, 0, 0, TAU); ctx.fill();
  const myth = sm(T.contrario - 0.2, T.creen, t) * (1 - sm(T.afuera + 0.3, T.ondas12, t));
  const real = sm(T.ondas12 - 0.2, T.ondas12 + 0.2, t);
  // estado térmico
  const base = (q) => 0.05 + 0.04 * nzF.n2((q % GX) * 0.05, Math.floor(q / GX) * 0.05);
  if (real <= 0) {
   // corte del alimento antes del mito (todo tibio-frío) y el MITO: calor que nace en el centro
   const mp = E.inOut(win(t, T.creen - 0.4, T.afuera, t)), vals = new Float32Array(GX * GY);
   for (let q = 0; q < GX * GY; q++) { if (DEPTH[q] < 0) continue; const i = q % GX, j = Math.floor(q / GX), r = Math.hypot((i - GX / 2) / (GX / 2), (j - GY / 2) / (GY / 2)); vals[q] = base(q) + myth * mp * cl(1.1 - r * 1.3); }
   drawField(ctx, vals, (v) => P.heat(v), 1);
   if (myth > 0) { ctx.save(); ctx.globalAlpha = myth; ctx.setLineDash([16, 12]); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU, L = 120 + 120 * mp; P.arrow(ctx, 540 + Math.cos(a) * 50, 880 + Math.sin(a) * 40, 540 + Math.cos(a) * (50 + L), 880 + Math.sin(a) * (40 + L * 0.6), 1, '#c9d2dc', 10); } ctx.setLineDash([]); ctx.restore(); }
  } else {
   // REAL: las ondas penetran cierta profundidad (depende del alimento) y el calor se redistribuye por conducción
   const absorb = E.out(win(t, T.penetran, T.profundidad + 0.6)), cond = win(t, T.distribuye - 0.3, T.frias), r = Math.round(1 + 9 * cond), amount = 0.15 + 0.85 * absorb;
   const src = new Float32Array(GX * GY); for (let q = 0; q < GX * GY; q++) src[q] = ABS[q] * amount;
   const bl = blurGrid(src, r), mixv = new Float32Array(GX * GY);
   for (let q = 0; q < GX * GY; q++) if (DEPTH[q] >= 0) mixv[q] = base(q) + lerp(src[q], bl[q] * 1.05, cl(cond * 1.3)) * 0.95;
   drawField(ctx, mixv, (v) => P.heat(v), real);
   // ondas que entran por la superficie (cian = campo) y se atenúan
   const wa = sm(T.ondas12 - 0.2, T.penetran + 0.3, t) * (1 - sm(T.distribuye + 0.5, T.distribuye + 1.2, t));
   if (wa > 0) { [[300, 520, 300, 700], [540, 500, 540, 690], [780, 520, 780, 700], [70, 880, 230, 880], [1010, 880, 850, 880]].forEach(([x0, y0, x1, y1], i) => P.wave(ctx, [[x0, y0], [x1, y1]], t + i * 0.2, { amp: 14, lam: 50, speed: 120, a: wa })); }
   // profundidad de penetración (corchete)
   const pa = sm(T.profundidad - 0.2, T.profundidad + 0.2, t) * (1 - sm(T.poreso, T.poreso + 0.4, t));
   if (pa > 0) { ctx.save(); ctx.globalAlpha = pa; ctx.strokeStyle = '#7fe3ff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(980, 650); ctx.lineTo(1000, 650); ctx.lineTo(1000, 730); ctx.lineTo(980, 730); ctx.stroke(); ctx.restore(); const pb = 1 - sm(T.distribuye - 0.4, T.distribuye - 0.1, t); pillAt(ctx, 'PROFUNDIDAD DE PENETRACIÓN', 540, 470, 32, t, T.profundidad, '#1fb6d6', '#ffffff', T.distribuye - 0.1); tag(ctx, 'depende del alimento', 540, 540, pa * pb, { px: 28 }); }
   // conducción: el calor viaja a otras zonas
   const ca = sm(T.distribuye - 0.2, T.distribuye + 0.2, t) * (1 - sm(T.poreso + 0.4, T.poreso + 1, t));
   if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; [[330, 720, 420, 820], [750, 720, 660, 820], [300, 1040, 400, 960], [780, 1040, 680, 960], [540, 690, 540, 800]].forEach(([a, b, c, d]) => P.arrow(ctx, a, b, c, d, win(t, T.distribuye - 0.2, T.distribuye + 0.4), '#ffb347', 14)); ctx.restore(); pillAt(ctx, 'CONDUCCIÓN DE CALOR', 540, 470, 34, t, T.distribuye, '#ff7a3d', '#ffffff', T.poreso + 0.3); }
   // zonas muy calientes / frías
   const ha = sm(T.calientes - 0.2, T.calientes + 0.2, t);
   if (ha > 0) { let best = -1, bq = 0, worst = 9, wq = 0; for (let q = 0; q < GX * GY; q++) if (DEPTH[q] > 4) { if (mixv[q] > best) { best = mixv[q]; bq = q; } if (mixv[q] < worst && DEPTH[q] > 14) { worst = mixv[q]; wq = q; } }
    const pt = (q) => [FX0 + (q % GX) * CELL, FY0 + Math.floor(q / GX) * CELL];
    const [hx, hy] = pt(bq); ctx.save(); ctx.globalAlpha = ha; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(hx, hy, 46, 0, TAU); ctx.stroke(); ctx.restore(); pillAt(ctx, 'MUY CALIENTE', hx, hy - 95, 30, t, T.calientes, '#e2412f', '#ffffff');
    if (t > T.frias - 0.25) { const [cx2, cy2] = pt(wq); ctx.save(); ctx.globalAlpha = sm(T.frias - 0.25, T.frias, t); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx2, cy2, 46, 0, TAU); ctx.stroke(); ctx.restore(); pillAt(ctx, 'AÚN FRÍA', cx2, cy2 + 95, 30, t, T.frias - 0.2, '#2d7fe0', '#ffffff'); }
   }
   // leyenda de TEMPERATURA (no es intensidad de campo)
   const la = sm(T.poreso - 0.3, T.poreso, t);
   if (la > 0) { ctx.save(); ctx.globalAlpha = la; const lg = ctx.createLinearGradient(260, 0, 820, 0); for (let k = 0; k <= 10; k++) lg.addColorStop(k / 10, H.rgba(P.heat(k / 10))); ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(260, 1240, 560, 26, 13); ctx.fill(); ctx.restore(); tag(ctx, 'FRÍO', 220, 1262, la, { px: 26, align: 'right' }); tag(ctx, 'CALIENTE', 840, 1262, la, { px: 26, align: 'left' }); tag(ctx, 'TEMPERATURA', 540, 1310, la, { px: 26 }); }
  }
  ctx.save(); foodOutline(ctx); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
  // sorpresa + pregunta + tachado del mito
  P.onoma(ctx, '¡SORPRESA!', 540, 470, 110, t, T.pero10 + 0.1, T.contrario - 0.1, { c: '#ffd54a' });
  pillAt(ctx, '¿DESDE ADENTRO HACIA AFUERA?', 540, 450, 40, t, T.contrario, '#ffffff', '#1d1b3a', T.ondas12);
  if (t > T.no11 && t < T.ondas12 + 0.3) { ctx.save(); ctx.globalAlpha = 1 - sm(T.ondas12 - 0.3, T.ondas12 + 0.2, t); P.cross(ctx, 540, 880, 300, win(t, T.no11, T.no11 + 0.35)); ctx.restore(); pillAt(ctx, 'MITO', 540, 1110, 52, t, T.no11 + 0.2, '#e2412f', '#ffffff', T.ondas12); }
  tag(ctx, 'CORTE DEL ALIMENTO · VISUALIZACIÓN SIMPLIFICADA', 540, 1395, sm(TB.corte + 0.4, TB.corte + 0.8, t) * 0.9, { px: 22 });
 }, sfx(k) {
  FX.onomatopeya(k, T.pero10 + 0.1); k.play('sparkle', T.sorprendente, { gain: 0.4, n: 6 });
  FX.aparece(k, T.contrario, 480); k.tone(T.creen - 0.4, { f: [[0, 300], [1.6, 420]], type: 'triangle', dur: 1.7, gain: 0.06, a: 0.3, filter: 'lowpass', f2: 1200 });
  FX.tachado(k, T.no11); FX.sello(k, T.no11 + 0.2);
  FX.campo(k, T.ondas12 - 0.2, 1.4, 1); FX.etiqueta(k, T.profundidad); FX.revelar(k, T.penetran);
  FX.flecha(k, T.distribuye - 0.2, 0.6); FX.etiqueta(k, T.distribuye); k.noise(T.distribuye, { dur: 2.5, color: 'brown', filter: 'lowpass', f: 300, gain: 0.08, a: 0.6 });
  FX.etiqueta(k, T.poreso); FX.aparece(k, T.calientes, 760); FX.aparece(k, T.frias - 0.2, 420);
 } });
 // B4 · PLATO GIRATORIO (vista cenital): la comida recorre las zonas fijas del campo → más uniforme, no perfecto
 const PG = 64, PREAL = new Float32Array(PG * PG);
 const field2 = (x, y) => { const v = Math.abs(Math.sin(x * 0.019 + 0.7) * Math.sin(y * 0.021 + 0.3)); return 0.1 + 0.9 * v * v; };
 let PL2 = null;
 B.push({ t0: TB.plato, t1: TB.malla, in: { type: 'zoom', d: 0.7, x: 540, y: 880 }, draw(ctx, t) {
  ctx.fillStyle = '#0c0f13'; ctx.fillRect(0, 0, W, HH);
  const cx = 540, cy = 860, half = 420;
  // suelo metálico de la cavidad
  const mg = ctx.createLinearGradient(cx - half, cy - half, cx + half, cy + half); mg.addColorStop(0, '#3a3f47'); mg.addColorStop(1, '#23272d'); ctx.fillStyle = mg; ctx.beginPath(); ctx.roundRect(cx - half, cy - half, half * 2, half * 2, 30); ctx.fill();
  // zonas del campo (fijas respecto del aparato), en cian
  const fa = sm(T.platoW - 0.3, T.platoW + 0.2, t);
  for (let x = cx - half + 30; x < cx + half; x += 40) for (let y = cy - half + 30; y < cy + half; y += 40) P.glow(ctx, x, y, 34, '80,220,255', fa * 0.5 * field2(x - cx + 400, y - cy + 400));
  // rotación del plato
  const ang = 1.6 * Math.max(0, t - T.mover);
  // calor acumulado en el alimento (marco del plato): promedio del campo sobre las posiciones visitadas
  const n = Math.max(1, Math.min(28, Math.floor(ang / 0.22) + 1)), rF = 230;
  let sum = 0, sum2 = 0, cnt = 0;
  for (let j = 0; j < PG; j++) for (let i = 0; i < PG; i++) { const px = (i / (PG - 1) * 2 - 1) * rF, py = (j / (PG - 1) * 2 - 1) * rF, q = j * PG + i; if (px * px + py * py > rF * rF) { PREAL[q] = -1; continue; } let e = 0; for (let k = 0; k < n; k++) { const th = n === 1 ? 0 : ang * k / (n - 1), c = Math.cos(th), s = Math.sin(th); e += field2(px * c - py * s + 400, px * s + py * c + 400); } e /= n; PREAL[q] = e; sum += e; sum2 += e * e; cnt++; }
  const mean = sum / cnt, sd = Math.sqrt(Math.max(0, sum2 / cnt - mean * mean)), unif = sd / mean;
  if (!PL2) PL2 = H.layer(PG, PG); const c2 = PL2.getContext('2d'), img = c2.createImageData(PG, PG), d = img.data, hv = sm(T.zonas15, T.campo15 + 0.4, t);
  for (let q = 0; q < PG * PG; q++) { if (PREAL[q] < 0) { d[q * 4 + 3] = 0; continue; } const [r, g, b] = P.heat(0.08 + hv * (PREAL[q] / (mean * 1.6))); d[q * 4] = r; d[q * 4 + 1] = g; d[q * 4 + 2] = b; d[q * 4 + 3] = 255; }
  c2.putImageData(img, 0, 0);
  // plato de vidrio + comida (gira)
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
  ctx.fillStyle = 'rgba(210,230,255,0.25)'; ctx.beginPath(); ctx.arc(0, 0, 330, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.stroke();
  for (let k = 0; k < 3; k++) { ctx.fillStyle = '#9aa3ad'; ctx.save(); ctx.rotate(k * TAU / 3); ctx.beginPath(); ctx.arc(250, 0, 14, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#ece8e0'; ctx.beginPath(); ctx.arc(0, 0, 270, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, rF, 0, TAU); ctx.clip(); ctx.imageSmoothingEnabled = true; ctx.drawImage(PL2, -rF, -rF, rF * 2, rF * 2); ctx.restore();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(rF - 26, 0, 12, 0, TAU); ctx.fill(); // marca para ver el giro
  ctx.restore();
  // flecha de giro
  const ga = sm(T.giratorio - 0.2, T.giratorio + 0.2, t);
  if (ga > 0) { ctx.save(); ctx.globalAlpha = ga; ctx.strokeStyle = '#ffd54a'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, cy, 380, -1.2 + ang * 0.2, 0.2 + ang * 0.2); ctx.stroke(); const ea = 0.2 + ang * 0.2; P.arrow(ctx, cx + Math.cos(ea - 0.1) * 380, cy + Math.sin(ea - 0.1) * 380, cx + Math.cos(ea + 0.05) * 380, cy + Math.sin(ea + 0.05) * 380, 1, '#ffd54a', 12); ctx.restore(); }
  pillAt(ctx, 'PLATO GIRATORIO', 540, 330, 44, t, T.platoW, '#ffd54a', '#1d1b3a', T.para15 + 0.2);
  pillAt(ctx, 'ZONAS DEL CAMPO (FIJAS)', 540, 330, 34, t, T.zonas15, '#1fb6d6', '#ffffff', T.conseguir);
  // medidor: diferencia de calentamiento entre zonas
  const ma = sm(T.zonas15 - 0.3, T.zonas15, t);
  if (ma > 0) { ctx.save(); ctx.globalAlpha = ma; P.rr(ctx, 140, 1300, 800, 40, 20, '#2a2f38', { shadow: false }); const v = cl(unif / 0.75); const gcol = H.rgba(H.mix([255, 120, 60], [80, 200, 120], 1 - v)); ctx.fillStyle = gcol; ctx.beginPath(); ctx.roundRect(140, 1300, Math.max(40, 800 * v), 40, 20); ctx.fill(); ctx.restore(); tag(ctx, 'DIFERENCIA DE TEMPERATURA ENTRE ZONAS', 540, 1285, ma, { px: 24 }); }
  pillAt(ctx, 'MÁS UNIFORME · NO PERFECTO', 540, 330, 38, t, T.uniforme - 0.1, '#2fbf71', '#ffffff');
  tag(ctx, 'VISTA DESDE ARRIBA · cian = campo · colores cálidos = temperatura', 540, 1395, sm(TB.plato + 0.4, TB.plato + 0.8, t) * 0.9, { px: 22 });
 }, sfx(k) {
  FX.aparece(k, T.platoW, 620); FX.flecha(k, T.giratorio - 0.2, 0.6); FX.campo(k, T.platoW - 0.3, 1.2, 0.7);
  k.play('click', T.mover - 0.05, { gain: 0.5 }); FX.motor(k, T.mover, TB.malla - T.mover + 0.3, 1.1); k.noise(T.mover, { dur: TB.malla - T.mover, color: 'brown', filter: 'bandpass', f: 220, q: 1.2, gain: 0.05, a: 0.4, hold: TB.malla - T.mover - 0.8 });
  FX.etiqueta(k, T.zonas15); FX.etiqueta(k, T.zonas15 - 0.3); FX.correcto(k, T.uniforme - 0.1);
 } });
 // B5 · MALLA DE LA PUERTA (macro): la onda (~12 cm) no cabe por agujeros de milímetros y se refleja; la luz sí pasa
 B.push({ t0: TB.malla, t1: TB.cierre, in: { type: 'slide', d: 0.5 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#2a1f14'); g.addColorStop(0.5, '#141619'); g.addColorStop(1, '#10161f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  tag(ctx, 'DENTRO', 230, 560, 1, { px: 30, c: 'rgba(255,220,180,0.9)' }); tag(ctx, 'FUERA', 860, 560, 1, { px: 30, c: 'rgba(200,225,255,0.9)' });
  // lámina perforada de perfil (x≈560) con agujeros pequeños
  const mx = 560; ctx.fillStyle = '#8b939d'; ctx.fillRect(mx - 9, 600, 18, 700); ctx.fillStyle = '#0f1216'; for (let y = 610; y < 1300; y += 22) ctx.fillRect(mx - 9, y, 18, 6);
  // paredes metálicas (arriba y abajo) que también reflejan
  const pw = sm(T.paredes16 - 0.2, T.paredes16 + 0.2, t);
  if (pw > 0) { ctx.save(); ctx.globalAlpha = pw; ctx.fillStyle = '#8b939d'; ctx.fillRect(60, 600, mx - 60, 14); ctx.fillRect(60, 1286, mx - 60, 14); ctx.restore(); }
  // microondas: onda larga que llega a la malla y vuelve (reflejo); se queda dentro
  const wv = sm(TB.malla + 0.3, TB.malla + 0.8, t), rp = win(t, T.malla, T.puerta + 0.6);
  P.wave(ctx, [[80, 780], [mx - 14, 780]], t, { amp: 60, lam: 300, speed: 180, a: wv });
  if (rp > 0) P.wave(ctx, [[mx - 14, 1000], [80, 1000]], t + 0.4, { amp: 60, lam: 300, speed: 180, a: wv * rp, prog: E.out(rp) });
  if (rp > 0) { ctx.save(); ctx.globalAlpha = wv * rp; ctx.strokeStyle = 'rgba(120,230,255,0.8)'; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(mx - 40, 790); ctx.quadraticCurveTo(mx + 30, 890, mx - 40, 990); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
  // luz visible: onda muy corta que atraviesa los agujeros
  const la = sm(T.puerta, T.puerta + 0.4, t);
  if (la > 0) [1120, 1180].forEach((y, i) => P.wave(ctx, [[80, y], [1010, y]], t + i * 0.3, { amp: 9, lam: 26, speed: 200, a: la, rgb: '255,220,110' }));
  // lupa con la malla vista de frente
  const ls = E.back(win(t, T.malla - 0.1, T.malla + 0.3));
  P.lens(ctx, 840, 820, 150, ls, () => { ctx.fillStyle = '#20252b'; ctx.fillRect(660, 640, 360, 360); const R = H.rng(2); for (let y = 660; y < 1000; y += 26) for (let x = 680 + ((y / 26) % 2) * 13; x < 1010; x += 26) { ctx.fillStyle = '#0a0c0f'; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,210,150,0.35)'; ctx.beginPath(); ctx.arc(x - 2, y - 2, 3, 0, TAU); ctx.fill(); } });
  pillAt(ctx, 'PAREDES METÁLICAS', 300, 470, 34, t, T.paredes16, '#8a98ad', '#ffffff', T.malla);
  pillAt(ctx, 'MALLA METÁLICA DE LA PUERTA', 540, 400, 36, t, T.malla, '#ffffff', '#1d1b3a');
  pillAt(ctx, 'ONDA DE UNOS 12 CM', 300, 700, 28, t, T.malla + 0.4, '#1fb6d6', '#ffffff');
  pillAt(ctx, 'AGUJEROS DE POCOS MILÍMETROS', 820, 1030, 26, t, T.malla + 0.8, '#3a404a', '#ffffff');
  pillAt(ctx, 'LA LUZ SÍ PASA: POR ESO VES LA COMIDA', 540, 1240, 28, t, T.puerta + 0.2, '#ffd54a', '#1d1b3a');
  P.withPop(ctx, t, T.dentro16 - 0.1, 540, 480, () => { ctx.save(); ctx.globalAlpha = 1; P.rr(ctx, 120, 440, 840, 84, 42, '#2fbf71', { sy: 8 }); P.text(ctx, 'LAS MICROONDAS SE QUEDAN DENTRO', 540, 484, 34, '#ffffff'); ctx.restore(); });
  VIS(ctx, 1);
 }, sfx(k) {
  FX.etiqueta(k, T.paredes16); k.play('tock', T.paredes16 + 0.2, { f: 1500, gain: 0.3 }); FX.aparece(k, T.malla - 0.1, 640); FX.etiqueta(k, T.malla);
  FX.campo(k, TB.malla + 0.3, 1.2, 0.8); k.play('tock', T.malla + 0.4, { f: 1700, gain: 0.35 }); FX.etiqueta(k, T.malla + 0.8);
  k.play('sparkle', T.puerta + 0.1, { gain: 0.3, n: 5 }); FX.etiqueta(k, T.puerta + 0.2); FX.correcto(k, T.dentro16 - 0.1);
 } });
 // B6 · CIERRE: regreso a la cocina; se apaga, «ding», se abre la puerta, comida caliente; ASOMBROTECA discreto
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'iris', d: 0.7, x: 540, y: 840 }, draw(ctx, t) {
  const cam = P.camAt(CAM6, t), done = T.recuerda - 0.2, door = win(t, T.no18 - 0.3, T.no18 + 0.6);
  const st = { on: t < done, lit: t < done ? 1 : 0.4 + 0.6 * door, xr: 0.7 * (1 - sm(TB.cierre + 0.3, TB.cierre + 1.6, t)), heat: 1, turn: t < done ? t * 0.5 : done * 0.5, waves: 0.8 * (1 - sm(TB.cierre + 0.3, TB.cierre + 1.4, t)), field: 0, door, steam: sm(T.no18, T.fuego + 0.6, t) };
  world(ctx, t, cam, st);
  pillAt(ctx, 'SIN FUEGO', 540, 360, 46, t, T.fuego, '#ff7a3d', '#ffffff', T.solo + 0.2);
  pillAt(ctx, 'ENERGÍA', 260, 400, 34, t, T.energia19, '#d4a017', '#1b1206');
  pillAt(ctx, 'ONDAS', 540, 400, 34, t, T.ondas19, '#1fb6d6', '#ffffff');
  pillAt(ctx, 'FÍSICA', 820, 400, 34, t, T.fisica, '#7a6cf0', '#ffffff');
  const aa = sm(T.cocina20, T.cocina20 + 0.6, t);
  if (aa > 0) { ctx.save(); ctx.globalAlpha = aa * 0.95; ctx.font = '700 50px Fredoka'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 22; ctx.fillText('ASOMBROTECA', 540, 210); ctx.restore(); }
 }, sfx(k) {
  FX.zumbido(k, TB.cierre, T.recuerda - 0.2 - TB.cierre, 0.7); FX.motor(k, TB.cierre, T.recuerda - 0.2 - TB.cierre, 0.5);
  FX.fin(k, T.recuerda - 0.2); FX.pitido(k, T.recuerda - 0.05, 'E6', 3);
  FX.puerta(k, T.no18 - 0.3); k.noise(T.no18, { dur: 2.2, color: 'pink', filter: 'bandpass', f: 3000, q: 0.6, gain: 0.03, a: 0.6 });
  FX.sello(k, T.fuego); FX.aparece(k, T.energia19, 520); FX.aparece(k, T.ondas19, 620); FX.aparece(k, T.fisica, 740);
  k.play('whoosh', T.todo20, { dur: 1.2, top: 1500, gain: 0.3, minor: true }); k.play('ding', T.cocina20 + 0.1, { f: 'A5', gain: 0.22 });
 } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1520,
  keywords: ['magnetrón', 'invisibles', 'rebotan', 'agua', 'calor', 'sorprendente', 'afuera', 'profundidad', 'frías', 'giratorio', 'uniforme', 'malla', 'fuego', 'física'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 220, gain: 0.035, a: 1, hold: DURATION - 2 }); },
  music(k) {
   const Em = [['E2', 'B2', 'G3', 'D4'], ['C2', 'G2', 'E3', 'B3'], ['G2', 'D3', 'B3', 'F#4'], ['D2', 'A2', 'F#3', 'C#4']];
   k.music('pad', 0, T.todo, { bpm: 92, gain: 0.4, chords: Em });
   k.music('pulse', T.todo, T.pero10, { bpm: 104, gain: 0.26, chords: Em });
   k.music('pad', T.pero10, T.ondas12, { bpm: 92, gain: 0.35, chords: [['A2', 'E3', 'C4', 'G4'], ['B2', 'F#3', 'D#4', 'A4']] });
   k.music('pulse', T.ondas12, T.asi, { bpm: 104, gain: 0.24, chords: [['E2', 'B2', 'G3', 'D4'], ['C2', 'G2', 'E3', 'B3'], ['A2', 'E3', 'C4', 'G4'], ['B2', 'F#3', 'D#4', 'A4']] });
   k.music('pad', T.asi, DURATION, { bpm: 92, gain: 0.42, chords: [['C3', 'G3', 'E4', 'B4'], ['G2', 'D3', 'B3', 'F#4'], ['E2', 'B2', 'G#3', 'D#4']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
