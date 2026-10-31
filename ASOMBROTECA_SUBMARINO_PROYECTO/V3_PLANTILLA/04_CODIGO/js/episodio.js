// =====================================================================================================
// episodio.js — «El submarino que no volvió» · V3 con la PLANTILLA ASOMBROTECA (piel «plana»)
// Estructura: PROBLEMA (se hunde y no responde) → EXPLICACIÓN (tanques de lastre) → CASO REAL (USS Thresher, 1963)
// → CONSECUENCIA (129) → LECCIÓN → SOLUCIÓN (SUBSAFE) → cierre. Voz original; tiempos = alineación de la voz.
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
  cientos: wt(0, 'cientos'), oceano: wt(0, 'océano'), repente: SG(1).s, falla1: wt(1, 'falla'), comienza: SG(2).s, hundirse: wt(2, 'hundirse'),
  trip: SG(3).s, intenta: wt(3, 'intenta'), regresar: wt(3, 'regresar'), superficie: wt(3, 'superficie'), noresp: wt(3, 'no'), responde: wt(3, 'responde'),
  entender: SG(4).s, tanques4: wt(4, 'tanques'), cuando5: SG(5).s, sumergirse: wt(5, 'sumergirse'), permite: wt(5, 'permite'), agua5: wt(5, 'agua'), aumentando: wt(5, 'aumentando'), peso: wt(5, 'peso'),
  subir: wt(6, 'subir'), aire6: wt(6, 'aire'), comprimido: wt(6, 'comprimido'), expulsar6: wt(6, 'expulsar'),
  pero7: SG(7).s, emergencia7: wt(7, 'emergencia'), falla7: wt(7, 'falla'),
  en1963: SG(8).s, y1963: wt(8, '1963'), nuclear: wt(8, 'nuclear'), uss: wt(8, 'uss'), thresher: wt(8, 'thresher'), hundio: wt(8, 'hundió'), pruebas: wt(8, 'pruebas'), atlantico: wt(8, 'atlántico'),
  invest: SG(9).s, posible: wt(9, 'posible'), cadena: wt(9, 'cadena'), propulsion: wt(9, 'propulsión'), dificult: wt(9, 'dificultades'), expulsar9: wt(9, 'expulsar'), lastre9: wt(9, 'lastre'),
  medida: SG(10).s, presion: wt(10, 'presión'), aumentaba: wt(10, 'aumentaba'), hasta: SG(11).s, casco: wt(11, 'casco'), soportarla: wt(11, 'soportarla'),
  las12: SG(12).s, n129: wt(12, '129'), personas: wt(12, 'personas'), bordo: wt(12, 'bordo'), vida: wt(12, 'vida'),
  oceano13: SG(13).s, grieta: wt(13, 'grieta'), amenaza: wt(13, 'amenaza'),
  aveces: SG(14).s, basta: wt(14, 'basta'), sistema14: wt(14, 'sistema'), nofunc: wt(14, 'no'), necesita: wt(14, 'necesita'),
  asombro: SG(15).s, tag: SG(16).s, end: A.speech_end,
 };
 const C = { navy: '#1d1b3a', sea0: [74, 190, 214], sea1: [32, 120, 168], sea2: [16, 58, 104], sea3: [8, 22, 48], hull: '#34465f', hullHi: '#46607f', hullLo: '#26334a', sail: '#2d3d55', bronze: '#d2a03f', water: '#3fa9f5', waterHi: '#7cc8ff', air: '#eaf6ff', inside: '#e8eef6', tankWall: '#53647e', bottle: '#f5b82e', valve: '#e8505b', pipe: '#8a98ad' };

 // ---------------- fondo marino plano ----------------
 function sea(ctx, t, depth, o = {}) {
  const k = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
  const c0 = depth < 0.5 ? k(C.sea0, C.sea1, depth * 2) : k(C.sea1, C.sea3, (depth - 0.5) * 2), c1 = depth < 0.5 ? k(C.sea1, C.sea2, depth * 2) : k(C.sea2, [3, 8, 22], (depth - 0.5) * 2);
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, H.rgba(c0)); g.addColorStop(1, H.rgba(c1));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  // rayos planos
  const ra = (1 - depth) * 0.1;
  if (ra > 0.005) for (let i = 0; i < 5; i++) { const x = 80 + i * 230 + Math.sin(t * 0.3 + i) * 30; ctx.fillStyle = `rgba(255,255,255,${ra * (0.6 + 0.4 * Math.sin(t * 0.8 + i * 2))})`; ctx.beginPath(); ctx.moveTo(x - 40, -10); ctx.lineTo(x + 40, -10); ctx.lineTo(x + 260, HH * 0.8); ctx.lineTo(x + 120, HH * 0.8); ctx.fill(); }
  // nieve marina (puntos planos) que sube con el descenso
  const R = H.rng(77), sc = o.scroll || 0;
  for (let i = 0; i < 90; i++) { const x = R() * W, y0 = R() * (HH + 100), r = R.range(2, 5), sp = R.range(8, 20); const y = (((y0 - t * sp - sc * (0.5 + r / 8)) % (HH + 100)) + HH + 100) % (HH + 100) - 50; ctx.fillStyle = `rgba(255,255,255,${0.12 + 0.12 * (r / 5)})`; ctx.beginPath(); ctx.arc(x + Math.sin(t * 0.5 + i) * 6, y, r, 0, TAU); ctx.fill(); }
 }
 // superficie (olas planas) vista desde abajo
 function surface(ctx, y, t) {
  if (y < -60) return;
  ctx.fillStyle = 'rgba(190,240,255,0.55)'; ctx.beginPath(); ctx.moveTo(0, -10); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin(x * 0.018 + t * 2) * 12); ctx.lineTo(W, -10); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin(x * 0.018 + t * 2) * 12); for (let x = W; x >= 0; x -= 20) ctx.lineTo(x, y + 8 + Math.sin(x * 0.018 + t * 2) * 12); ctx.fill();
 }
 // ---------------- submarino plano (perfil, proa a la izquierda) ----------------
 const rr = (u) => (u < 0.18 ? Math.sqrt(1 - Math.pow((0.18 - u) / 0.18, 2)) : u < 0.62 ? 1 : Math.pow(Math.max(0, 1 - (u - 0.62) / 0.38), 1.25) * 0.97 + 0.03);
 function hullPath(ctx, x, y, L, Hh) { ctx.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60; const px = x - L / 2 + u * L, py = y - rr(u) * Hh / 2; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } for (let i = 60; i >= 0; i--) { const u = i / 60; ctx.lineTo(x - L / 2 + u * L, y + rr(u) * Hh / 2); } ctx.closePath(); }
 function sub(ctx, x, y, L, rot, t, o = {}) {
  const Hh = L * (o.hr || 0.15), f = PL.SKINS.plana === undefined ? (c) => c : P.withPop && ((c) => c);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.translate(-x, -y);
  const sx = x - L * 0.2, sw = L * 0.13, sh = L * 0.1, top = y - Hh / 2;
  // vela con timones de vela
  ctx.fillStyle = C.sail; ctx.beginPath(); ctx.roundRect(sx - sw / 2, top - sh, sw, sh + 20, [sw * 0.3, sw * 0.18, 0, 0]); ctx.fill();
  ctx.fillStyle = C.hullHi; ctx.fillRect(sx - sw / 2 + 8, top - sh + 8, sw - 16, 10);
  ctx.fillStyle = C.sail; ctx.beginPath(); ctx.roundRect(sx - sw * 0.1, top - sh * 0.55, sw * 0.8, 12, 6); ctx.fill();
  if (o.num) { ctx.fillStyle = '#ffffff'; ctx.font = `900 ${sh * 0.34}px Nunito`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.num, sx, top - sh * 0.22); }
  // timones de popa (cruciformes)
  ctx.fillStyle = C.sail; ctx.beginPath(); ctx.roundRect(x + L * 0.39, y - Hh * 0.95, L * 0.07, Hh * 1.9, 8); ctx.fill();
  // casco con banda de luz y sombra
  hullPath(ctx, x, y, L, Hh); ctx.fillStyle = C.hull; ctx.fill();
  ctx.save(); hullPath(ctx, x, y, L, Hh); ctx.clip(); ctx.fillStyle = C.hullHi; ctx.fillRect(x - L, top, L * 2, Hh * 0.28); ctx.fillStyle = C.hullLo; ctx.fillRect(x - L, y + Hh * 0.18, L * 2, Hh); ctx.restore();
  ctx.fillStyle = C.sail; ctx.beginPath(); ctx.roundRect(x + L * 0.34, y - 8, L * 0.12, 16, 8); ctx.fill();
  // hélice
  const pa = t * 14 * (o.prop ?? 1);
  ctx.fillStyle = C.bronze; for (let i = 0; i < 2; i++) { const s = Math.abs(Math.sin(pa + i * Math.PI / 2)); ctx.beginPath(); ctx.ellipse(x + L * 0.505, y + (i ? 1 : -1) * Hh * 0.22 * s, 10, Hh * 0.22 * s + 4, 0, 0, TAU); ctx.fill(); }
  ctx.beginPath(); ctx.arc(x + L * 0.5, y, 10, 0, TAU); ctx.fill();
  // luces
  if (o.nav) { ctx.fillStyle = `rgba(160,255,200,${0.25 * o.nav})`; ctx.beginPath(); ctx.arc(sx, top - sh - 8, 26, 0, TAU); ctx.fill(); ctx.fillStyle = '#a8ffd0'; ctx.beginPath(); ctx.arc(sx, top - sh - 8, 9, 0, TAU); ctx.fill(); }
  if (o.warn) { const bl = 0.5 + 0.5 * Math.sin(t * 12); ctx.fillStyle = `rgba(255,80,80,${0.35 * o.warn * bl})`; ctx.beginPath(); ctx.arc(sx + 30, top - sh - 10, 60, 0, TAU); ctx.fill(); ctx.fillStyle = `rgba(255,90,90,${o.warn})`; ctx.beginPath(); ctx.arc(sx + 30, top - sh - 10, 13, 0, TAU); ctx.fill(); }
  if (o.crack) { ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); const pts = [[x + L * 0.05, top + 4], [x + L * 0.09, y - Hh * 0.15], [x + L * 0.04, y + Hh * 0.05], [x + L * 0.1, y + Hh * 0.3], [x + L * 0.07, y + Hh / 2 - 4]]; const n = Math.ceil(o.crack * (pts.length - 1)); pts.slice(0, n + 1).forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); ctx.strokeStyle = '#e8505b'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
  ctx.restore();
  return { sailTop: [sx, top - sh], Hh };
 }
 // ---------------- corte del submarino (tanques de lastre) ----------------
 const CUT = { x: 540, y: 960, L: 1040, hr: 0.36 };
 function cutaway(ctx, t, s) {
  const { x, y, L } = CUT, Hh = L * CUT.hr;
  // estado del lastre
  const fill = E.inOut(win(t, T.permite, T.aumentando + 0.4)), blow = E.inOut(win(t, T.aire6 + 0.1, T.expulsar6 + 0.9)), lvl = fill * (1 - 0.88 * blow);
  // casco exterior
  ctx.fillStyle = C.sail; ctx.beginPath(); ctx.roundRect(x - L * 0.27, y - Hh / 2 - L * 0.08, L * 0.14, L * 0.1, [30, 20, 0, 0]); ctx.fill();
  hullPath(ctx, x, y, L, Hh); ctx.fillStyle = C.hull; ctx.fill();
  ctx.save(); hullPath(ctx, x, y, L, Hh); ctx.clip(); ctx.fillStyle = C.hullHi; ctx.fillRect(x - L, y - Hh / 2, L * 2, 22); ctx.restore();
  // casco resistente (interior, claro)
  const px0 = x - 250, px1 = x + 260, ph = Hh * 0.7;
  P.rr(ctx, px0, y - ph / 2, px1 - px0, ph, 70, C.inside, { shadow: false });
  // tanques (fuera del casco resistente)
  const tanks = [[x - 462, y - 118, 196, 236], [x + 290, y - 104, 168, 208]];
  tanks.forEach(([tx, ty, w, h], i) => {
   P.rr(ctx, tx - 10, ty - 10, w + 20, h + 20, 34, C.tankWall, { shadow: false });
   P.rr(ctx, tx, ty, w, h, 26, C.air, { shadow: false });
   const wy = ty + h * (1 - lvl);
   if (lvl > 0.01) { ctx.save(); ctx.beginPath(); ctx.roundRect(tx, ty, w, h, 26); ctx.clip(); ctx.fillStyle = C.water; ctx.beginPath(); ctx.moveTo(tx, ty + h); for (let xx = tx; xx <= tx + w; xx += 8) ctx.lineTo(xx, wy + Math.sin(xx * 0.06 + t * 5) * 5); ctx.lineTo(tx + w, ty + h); ctx.fill(); ctx.fillStyle = C.waterHi; ctx.beginPath(); for (let xx = tx; xx <= tx + w; xx += 8) ctx.lineTo(xx, wy + Math.sin(xx * 0.06 + t * 5) * 5); for (let xx = tx + w; xx >= tx; xx -= 8) ctx.lineTo(xx, wy + 9 + Math.sin(xx * 0.06 + t * 5) * 5); ctx.fill(); ctx.restore(); }
   // válvula de ventilación arriba (rueda) y rejilla de entrada abajo
   const vx = tx + w / 2, vy = ty - 52, open = sm(T.sumergirse, T.sumergirse + 0.3, t) * (1 - sm(T.aire6 - 0.4, T.aire6, t));
   ctx.fillStyle = C.pipe; ctx.fillRect(vx - 8, vy, 16, 52);
   ctx.save(); ctx.translate(vx, vy); ctx.rotate(open * Math.PI / 2); P.circle(ctx, 0, 0, 24, C.valve); ctx.fillStyle = '#fff'; ctx.fillRect(-20, -4, 40, 8); ctx.restore();
   for (let k2 = 0; k2 < 4; k2++) { ctx.fillStyle = C.tankWall; ctx.fillRect(tx + 28 + k2 * (w - 56) / 3 - 6, ty + h + 10, 12, 26); }
   // aire que sale arriba / agua que entra abajo
   const inflow = sm(T.permite, T.permite + 0.3, t) * (1 - sm(T.aumentando + 0.6, T.aumentando + 1, t));
   P.bubbles(ctx, vx - 40, vy - 330, 80, 300, t, 11 + i, 10, inflow, { speed: 0.9 });
   if (inflow > 0) for (let k2 = 0; k2 < 2; k2++) P.arrow(ctx, vx + (k2 ? 34 : -34), ty + h + 150, vx + (k2 ? 34 : -34), ty + h + 40, inflow, C.water, 16);
   const out = sm(T.aire6 + 0.1, T.aire6 + 0.4, t) * (1 - sm(T.expulsar6 + 0.9, T.expulsar6 + 1.3, t));
   if (out > 0) for (let k2 = 0; k2 < 2; k2++) P.arrow(ctx, vx + (k2 ? 34 : -34), ty + h + 40, vx + (k2 ? 34 : -34), ty + h + 170, out, C.water, 16);
  });
  // botellas de aire comprimido + tuberías
  const ax = x - 130, ay = y - 10, on = sm(T.subir, T.subir + 0.4, t);
  const dead = sm(T.falla7, T.falla7 + 0.2, t);
  ctx.fillStyle = C.pipe; ctx.fillRect(x - 266, y - 66, ax + 30 - (x - 266), 14); ctx.fillRect(ax + 200, y - 52, x + 290 - (ax + 200), 14); ctx.fillRect(ax + 22, y - 66, 16, ay - (y - 66)); ctx.fillRect(ax + 192, y - 52, 16, ay - (y - 52));
  for (let k2 = 0; k2 < 3; k2++) { P.rr(ctx, ax + k2 * 85, ay, 64, 140, 30, on > 0.5 ? C.bottle : '#c9a24a', { shadow: false }); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(ax + k2 * 85 + 12, ay + 16, 10, 100); }
  const blowing = sm(T.aire6, T.aire6 + 0.2, t) * (1 - sm(T.expulsar6 + 0.9, T.expulsar6 + 1.3, t)) * (1 - dead);
  if (blowing > 0) { ctx.fillStyle = `rgba(255,255,255,${blowing})`; for (let k2 = 0; k2 < 8; k2++) { const u = (t * 1.6 + k2 / 8) % 1; ctx.beginPath(); ctx.arc(lerp(ax + 30, x - 266, u), y - 59, 6, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(lerp(ax + 200, x + 290, u), y - 45, 6, 0, TAU); ctx.fill(); } }
  return { lvl, tanks, ax, ay };
 }
 // ---------------- utilidades de rótulos ----------------
 const pill = (ctx, s, x, y, px, t, t0, o) => P.pill(ctx, s, x, y, px, t, t0, o);
 const fadeOut = (t, t1, d = 0.25) => 1 - sm(t1 - d, t1, t);

 // ================= BEATS =================
 const B = [];
 // 1 · PROBLEMA: a cientos de metros, algo falla y se hunde
 B.push({ t0: 0, t1: T.trip, draw(ctx, t) {
  const dive = E.inOut(win(t, 0.1, 3.4)), sink = E.inOut(win(t, T.comienza, T.trip + 0.6));
  sea(ctx, t, 0.15 + 0.35 * dive + 0.15 * sink, { scroll: dive * 900 + sink * 300 });
  surface(ctx, 470 - 900 * dive, t);
  const sx = 540 + Math.sin(t * 0.5) * 6, sy = 1000 + 240 * sink + Math.sin(t * 0.8) * 6, rot = 0.12 * sink;
  const warn = sm(T.falla1 - 0.1, T.falla1 + 0.1, t);
  // ondas de sonar
  [0.2, T.oceano].forEach((p0) => { const u = win(t, p0, p0 + 1.6); if (u > 0 && u < 1) { ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - u)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(sx - 180, sy - 130, 40 + u * 420, 0, TAU); ctx.stroke(); } });
  P.bubbles(ctx, 160, sy - 500, 760, 500, t, 3, 14, 0.4 + 0.6 * sink, { speed: 0.5 + sink });
  const G = sub(ctx, sx, sy, 860, rot, t, { nav: 1 - warn, warn });
  // regla de profundidad (sin cifras)
  const ry0 = Math.max(470 - 900 * dive, 420), ra = sm(T.cientos - 0.4, T.cientos, t);
  if (ra > 0) { ctx.save(); ctx.globalAlpha = ra; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.moveTo(990, ry0); ctx.lineTo(990, sy - 40); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(990, sy - 20); ctx.lineTo(970, sy - 50); ctx.lineTo(1010, sy - 50); ctx.fill(); ctx.restore(); }
  P.withPop(ctx, t, T.cientos, 740, 480, () => { P.rr(ctx, 540, 437, 400, 86, 43, '#ffffff', { sy: 8 }); P.text(ctx, 'CIENTOS DE METROS', 740, 482, 36, '#1d1b3a'); });
  // falla: destello rojo + onomatopeya + bocadillo de alerta
  const fl = warn * (0.5 + 0.5 * Math.sin(t * 12)) * (1 - sm(T.comienza + 0.6, T.trip, t));
  if (fl > 0) { ctx.fillStyle = `rgba(232,80,91,${0.16 * fl})`; ctx.fillRect(0, 0, W, HH); }
  P.onoma(ctx, '¡BIP BIP!', 300, 760, 92, t, T.falla1 - 0.08, T.falla1 + 1.4, { c: '#ffdf5e' });
  P.bubble(ctx, G.sailTop[0] + 260, G.sailTop[1] - 170 + 0 * sink, 210, 170, t, T.falla1 + 0.05, (bx, by) => { ctx.fillStyle = '#e8505b'; ctx.beginPath(); ctx.moveTo(bx, by - 52); ctx.lineTo(bx + 56, by + 46); ctx.lineTo(bx - 56, by + 46); ctx.closePath(); ctx.lineJoin = 'round'; ctx.strokeStyle = '#e8505b'; ctx.lineWidth = 14; ctx.stroke(); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(bx - 6, by - 22, 12, 40); ctx.beginPath(); ctx.arc(bx, by + 32, 7, 0, TAU); ctx.fill(); }, { tailX: -60 });
  // se hunde
  const ha = sm(T.hundirse - 0.2, T.hundirse + 0.3, t);
  if (ha > 0) { P.arrow(ctx, 900, sy + 150, 900, sy + 420, ha, '#e8505b', 30); P.withPop(ctx, t, T.hundirse, 760, sy + 480, () => { P.rr(ctx, 600, sy + 440, 320, 80, 40, '#e8505b', { sy: 8 }); P.text(ctx, 'SE HUNDE', 760, sy + 482, 36, '#ffffff'); }); }
 }, sfx(k) {
  FX.sonar(k, 0.2, 0.9); FX.sonar(k, T.oceano, 0.6); FX.burbujas(k, 0.4, 3, 5, 2, 0.8);
  FX.etiqueta(k, T.cientos); k.play('stroke', T.cientos - 0.4, { material: 'marker', dur: 0.4, gain: 0.25, minor: true });
  FX.alarma(k, T.falla1 - 0.08, 3); FX.onomatopeya(k, T.falla1 - 0.08); FX.aparece(k, T.falla1 + 0.05, 480);
  k.tone(T.comienza, { f: [[0, 110], [1.6, 48]], type: 'triangle', dur: 1.7, gain: 0.14, a: 0.1 }); k.play('whoosh', T.hundirse - 0.2, { dur: 1.0, top: 900, gain: 0.35 });
  FX.flecha(k, T.hundirse - 0.2); FX.aparece(k, T.hundirse, 420); FX.burbujas(k, T.comienza, 1.8, 10, 5, 1);
 } });
 // 2 · PROBLEMA: la tripulación intenta subir… no responde (panel de control)
 B.push({ t0: T.trip, t1: T.entender, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  ctx.fillStyle = '#25304a'; ctx.fillRect(0, 0, W, HH);
  ctx.fillStyle = '#2e3a58'; for (let i = 0; i < 8; i++) ctx.fillRect(0, 430 + i * 190, W, 6);
  // consola
  P.rr(ctx, 90, 470, 900, 1000, 60, '#3a4766', { sy: 18 });
  P.rr(ctx, 150, 530, 780, 440, 34, '#0f1a2c', { shadow: false });
  // pantalla: submarino pequeño y su rumbo
  const pull = E.out(win(t, T.regresar - 0.1, T.regresar + 0.35)), dead = sm(T.noresp, T.noresp + 0.2, t), fail = sm(T.pero7 || T.noresp, T.noresp + 0.1, t);
  ctx.save(); ctx.beginPath(); ctx.roundRect(150, 530, 780, 440, 34); ctx.clip();
  ctx.strokeStyle = 'rgba(80,232,160,0.25)'; ctx.lineWidth = 2; for (let x = 150; x < 930; x += 60) { ctx.beginPath(); ctx.moveTo(x, 530); ctx.lineTo(x, 970); ctx.stroke(); } for (let y = 530; y < 970; y += 60) { ctx.beginPath(); ctx.moveTo(150, y); ctx.lineTo(930, y); ctx.stroke(); }
  const dy = 40 * win(t, T.trip, T.entender);
  sub(ctx, 520, 800 + dy, 300, 0.12, t, { nav: 0 });
  // flecha prevista hacia arriba (verde) que se vuelve roja y tachada
  const ap = sm(T.superficie - 0.3, T.superficie + 0.2, t);
  P.arrow(ctx, 760, 860, 760, 600, ap, dead > 0.5 ? '#e8505b' : '#50e8a0', 22);
  ctx.fillStyle = '#50e8a0'; ctx.font = '900 30px Nunito'; ctx.textAlign = 'left'; ctx.globalAlpha = ap * (1 - dead); ctx.fillText('SUPERFICIE', 600, 580); ctx.globalAlpha = 1;
  P.cross(ctx, 760, 720, 150, win(t, T.noresp, T.noresp + 0.3));
  ctx.restore();
  // palanca SUBIR
  const lx = 300, ly = 1250, ang = lerp(0.6, -0.6, pull);
  P.rr(ctx, lx - 90, ly - 30, 180, 60, 30, '#232d45', { shadow: false });
  ctx.save(); ctx.translate(lx, ly); ctx.rotate(ang); ctx.fillStyle = '#9aa7bd'; ctx.fillRect(-10, -190, 20, 190); P.circle(ctx, 0, -200, 40, '#e8505b'); ctx.restore();
  P.text(ctx, 'SUBIR', lx, ly + 90, 40, '#ffffff');
  // luces de estado
  [['#50e8a0', 640], ['#f0b90b', 760], ['#e8505b', 880]].forEach(([c, x], i) => { const on = i === 2 ? (0.4 + 0.6 * (Math.sin(t * 10) > 0 ? 1 : 0)) : i === 0 ? 1 - dead : 0.5; P.circle(ctx, x, 1150, 40, '#1a2338'); ctx.fillStyle = c; ctx.globalAlpha = 0.25 + 0.75 * on; ctx.beginPath(); ctx.arc(x, 1150, 28, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; });
  P.onoma(ctx, '¡CLAC!', 470, 1060, 76, t, T.regresar, T.regresar + 1.0, { c: '#ffffff', rot: 0.1 });
  P.withPop(ctx, t, T.responde - 0.05, 760, 1330, () => { P.rr(ctx, 520, 1280, 480, 100, 50, '#e8505b', { sy: 10 }); P.text(ctx, 'NO RESPONDE', 760, 1332, 44, '#ffffff'); });
 }, sfx(k) {
  k.play('roller', T.regresar - 0.1, { dur: 0.45, gain: 0.35 }); k.play('tock', T.regresar + 0.35, { f: 300, gain: 0.5 }); FX.onomatopeya(k, T.regresar);
  FX.flecha(k, T.superficie - 0.3); k.play('blip', T.superficie, { f: 'E6', gain: 0.3 });
  FX.tachado(k, T.noresp); FX.aparece(k, T.responde - 0.05, 380); k.play('buzz', T.responde, { f: 92, dur: 0.3, gain: 0.25 });
 } });
 // 3 · EXPLICACIÓN: la lupa entra en el casco: tanques de lastre
 const LENS = [235, 980];
 B.push({ t0: T.entender, t1: T.cuando5 + 0.3, in: { type: 'iris', d: 0.5, x: 540, y: 980 }, draw(ctx, t) {
  sea(ctx, t, 0.45, { scroll: 1300 + t * 20 });
  sub(ctx, 560, 980, 1000, 0, t, { nav: 1, hr: 0.15 });
  const ls = E.back(win(t, T.entender + 0.6, T.entender + 1.0));
  P.lens(ctx, LENS[0], LENS[1], 220, ls, () => { ctx.save(); ctx.translate(LENS[0], LENS[1]); ctx.scale(1.1, 1.1); ctx.translate(-(CUT.x - 352), -CUT.y); cutaway(ctx, Math.min(t, T.permite - 0.01)); ctx.restore(); });
  P.withPop(ctx, t, T.tanques4, 600, 560, () => { P.rr(ctx, 270, 505, 660, 110, 55, '#25b8a8', { sy: 12 }); P.text(ctx, 'TANQUES DE LASTRE', 600, 562, 50, '#ffffff'); });
  const ap = sm(T.tanques4 + 0.2, T.tanques4 + 0.6, t); P.arrow(ctx, 430, 640, 320, 760, ap, '#ffffff', 16);
  P.withPop(ctx, t, T.tanques4 + 0.5, 600, 1330, () => { P.rr(ctx, 290, 1290, 620, 84, 42, '#ffffff', { sy: 8 }); P.text(ctx, 'FUERA DEL CASCO RESISTENTE', 600, 1334, 32, '#1d1b3a'); });
 }, sfx(k) { FX.aparece(k, T.entender + 0.6, 500); k.play('ding', T.entender + 0.65, { f: 'E6', gain: 0.18, minor: true }); FX.sello(k, T.tanques4); FX.flecha(k, T.tanques4 + 0.2); FX.etiqueta(k, T.tanques4 + 0.5); } });
 // 4 · EXPLICACIÓN: cómo se sumerge, cómo sube, y la pregunta
 B.push({ t0: T.cuando5 + 0.3, t1: T.en1963 - 0.15, in: { type: 'zoom', d: 0.6, x: LENS[0], y: LENS[1] }, draw(ctx, t) {
  const lvlNow = E.inOut(win(t, T.permite, T.aumentando + 0.4)) * (1 - 0.88 * E.inOut(win(t, T.aire6 + 0.1, T.expulsar6 + 0.9)));
  const dy = 70 * lvlNow - 40 * sm(T.expulsar6, T.expulsar6 + 1.2, t);
  sea(ctx, t, 0.45 + 0.1 * lvlNow, { scroll: 1400 + dy * 3 });
  ctx.save(); ctx.translate(0, dy);
  const st = cutaway(ctx, t, 1);
  // etiquetas
  P.withPop(ctx, t, T.sumergirse + 0.1, 250, 640, () => { P.rr(ctx, 60, 600, 380, 80, 40, '#ffffff', { sy: 8 }); P.text(ctx, 'VENTILACIÓN', 250, 642, 34, '#1d1b3a'); });
  P.withPop(ctx, t, T.agua5, 250, 1360, () => { P.rr(ctx, 40, 1320, 420, 80, 40, '#3fa9f5', { sy: 8 }); P.text(ctx, 'ENTRADA DE AGUA', 250, 1362, 34, '#ffffff'); });
  P.withPop(ctx, t, T.aire6, 820, 1360, () => { P.rr(ctx, 610, 1320, 420, 80, 40, '#f5b82e', { sy: 8 }); P.text(ctx, 'AIRE COMPRIMIDO', 820, 1362, 34, '#1d1b3a'); });
  ctx.restore();
  // PESO (abajo) y EMPUJE (arriba)
  const wa = sm(T.aumentando - 0.3, T.aumentando, t) * fadeOut(t, T.pero7 + 0.2), el = 70 + 90 * st.lvl, bl = 70 + 90 * (1 - st.lvl);
  P.arrow(ctx, 540, 1160 + dy, 540, 1160 + dy + el, wa, '#ff9f43', 30);
  P.arrow(ctx, 560, 770 + dy, 560, 770 + dy - bl, wa, '#3fa9f5', 30);
  if (wa > 0) { P.text(ctx, 'PESO', 590, 1180 + dy + el * 0.5, 40, '#ffffff', { align: 'left', a: wa }); P.text(ctx, 'EMPUJE', 600, 740 + dy - bl * 0.5, 40, '#ffffff', { align: 'left', a: wa }); }
  // veredictos
  const v1 = sm(T.peso, T.peso + 0.2, t) * fadeOut(t, T.subir + 0.2), v2 = sm(T.expulsar6 + 0.3, T.expulsar6 + 0.5, t) * fadeOut(t, T.pero7 + 0.3);
  if (v1 > 0) { ctx.save(); ctx.globalAlpha = v1; P.rr(ctx, 170, 1520, 740, 96, 48, '#ff9f43', { sy: 10 }); P.text(ctx, 'PESO > EMPUJE  →  BAJA', 540, 1570, 42, '#1d1b3a'); ctx.restore(); }
  if (v2 > 0) { ctx.save(); ctx.globalAlpha = v2; P.rr(ctx, 170, 1520, 740, 96, 48, '#3fa9f5', { sy: 10 }); P.text(ctx, 'EMPUJE > PESO  →  SUBE', 540, 1570, 42, '#ffffff'); ctx.restore(); }
  P.onoma(ctx, 'GLUB GLUB', 760, 520, 78, t, T.agua5 - 0.1, T.aumentando + 0.8, { c: '#bfe8ff', rot: 0.08 });
  P.onoma(ctx, 'FSSSHH', 330, 520, 84, t, T.comprimido - 0.1, T.expulsar6 + 1.0, { c: '#ffffff', rot: -0.08 });
  // la pregunta: ¿y si el sistema de emergencia falla?
  const qa = sm(T.pero7 - 0.1, T.pero7 + 0.2, t);
  if (qa > 0) { ctx.fillStyle = `rgba(29,27,58,${0.45 * qa})`; ctx.fillRect(0, 0, W, HH); }
  P.bubble(ctx, 540, 600, 300, 230, t, T.emergencia7 - 0.2, (bx, by) => { P.rr(ctx, bx - 34, by - 80, 68, 150, 32, '#f5b82e', { shadow: false }); ctx.fillStyle = '#8a98ad'; ctx.fillRect(bx - 12, by - 100, 24, 24); P.cross(ctx, bx, by, 150, win(t, T.falla7, T.falla7 + 0.3)); }, { tailX: 0 });
  P.onoma(ctx, '?', 800, 520, 200, t, T.falla7, T.en1963, { c: '#f0b90b', rot: 0.15 });
 }, sfx(k) {
  FX.etiqueta(k, T.sumergirse + 0.1); k.play('thud', T.sumergirse, { f: 140, gain: 0.35 }); k.tone(T.sumergirse, { f: [[0, 900], [0.08, 620]], type: 'triangle', dur: 0.12, gain: 0.07 });
  FX.agua(k, T.permite, T.aumentando + 1.0 - T.permite); FX.burbujas(k, T.permite, T.aumentando + 0.6 - T.permite, 9, 7);
  FX.etiqueta(k, T.agua5); FX.onomatopeya(k, T.agua5 - 0.1); FX.flecha(k, T.aumentando - 0.3); FX.aparece(k, T.peso, 360);
  k.play('thud', T.aire6 - 0.15, { f: 140, gain: 0.35 }); FX.etiqueta(k, T.aire6); FX.siseo(k, T.aire6, T.expulsar6 + 1.1 - T.aire6); FX.onomatopeya(k, T.comprimido - 0.1);
  FX.agua(k, T.expulsar6 - 0.2, 1.4); FX.burbujas(k, T.expulsar6, 1.2, 14, 21, 1.1); FX.aparece(k, T.expulsar6 + 0.3, 640); k.play('success', T.expulsar6 + 0.5, { gain: 0.2, minor: true });
  k.noise(T.pero7 - 0.1, { dur: 0.6, color: 'brown', filter: 'lowpass', f: [[0, 500], [0.6, 150]], gain: 0.14, a: 0.1 });
  FX.aparece(k, T.emergencia7 - 0.2, 520); FX.tachado(k, T.falla7); FX.onomatopeya(k, T.falla7);
 } });
 // 5 · CASO REAL: 1963, USS Thresher (ficha de archivo)
 B.push({ t0: T.en1963 - 0.15, t1: T.invest - 0.2, in: { type: 'slide', d: 0.5 }, draw(ctx, t) {
  ctx.fillStyle = '#1d1b3a'; ctx.fillRect(0, 0, W, HH);
  const R = H.rng(5); for (let i = 0; i < 26; i++) { ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.arc(R() * W, R() * HH, R.range(20, 90), 0, TAU); ctx.fill(); }
  P.counter(ctx, 540, 520, 150, t, T.y1963 - 0.05, T.y1963 + 0.55, 1950, 1963, { box: '#f0b90b', c: '#1d1b3a' });
  // foto de archivo
  const ca = E.out(win(t, T.nuclear - 0.3, T.nuclear + 0.2));
  if (ca > 0) { ctx.save(); ctx.translate(540, 920 + (1 - ca) * 80); ctx.rotate(-0.04); ctx.globalAlpha = ca;
   P.rr(ctx, -400, -230, 800, 470, 18, '#f4efe2', { sy: 16 }); ctx.save(); ctx.beginPath(); ctx.rect(-370, -200, 740, 360); ctx.clip(); ctx.translate(-540, -920);
   const sk = (a, b) => a; sea(ctx, t, 0.35, { scroll: 0 }); sub(ctx, 560, 930 + 30 * sm(T.hundio, T.hundio + 1.5, t), 600, 0.08 * sm(T.hundio, T.hundio + 1.5, t), t, { num: '593', nav: 1 }); ctx.restore();
   ctx.fillStyle = '#1d1b3a'; ctx.font = '800 30px Nunito'; ctx.textAlign = 'left'; ctx.fillText('ARCHIVO · SUBMARINO NUCLEAR · EE. UU.', -370, 205); ctx.restore(); }
  P.withPop(ctx, t, T.thresher - 0.05, 540, 1240, () => { ctx.save(); ctx.translate(540, 1240); ctx.rotate(-0.05); P.rr(ctx, -330, -60, 660, 120, 22, '#e8505b', { sy: 10 }); P.text(ctx, 'USS THRESHER', 0, 4, 64, '#ffffff', { kind: 'title' }); ctx.restore(); });
  pill(ctx, 'PRUEBAS DE INMERSIÓN', 540, 1390, 36, t, T.pruebas, { bg: '#ffffff' });
  pill(ctx, '10 DE ABRIL · OCÉANO ATLÁNTICO', 540, 1490, 34, t, T.atlantico, { bg: '#25b8a8', fg: '#ffffff' });
 }, sfx(k) { FX.contador(k, T.y1963 - 0.05, T.y1963 + 0.55, 1950, 1963); k.play('paper', T.nuclear - 0.3, { dur: 0.35, gain: 0.5 }); k.play('slap', T.nuclear + 0.15, { gain: 0.35 }); FX.sello(k, T.thresher - 0.05); FX.etiqueta(k, T.pruebas); FX.etiqueta(k, T.atlantico); FX.sonar(k, T.hundio, 0.4); } });
 // 6 · CASO REAL: posible cadena de fallos (fichas de dominó)
 const DOM = [
  { x: 120, c: '#3fa9f5', t: () => T.propulsion - 0.15, l: ['PROBABLE FUGA', 'EN UNA TUBERÍA'], lt: () => T.posible + 0.4, icon: (ctx, x, y) => { ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 60, y - 50, 120, 26); ctx.fillRect(x + 34, y - 50, 26, 70); ctx.beginPath(); ctx.moveTo(x - 10, y + 10); ctx.quadraticCurveTo(x - 34, y + 50, x - 10, y + 60); ctx.quadraticCurveTo(x + 14, y + 50, x - 10, y + 10); ctx.fill(); } },
  { x: 430, c: '#ff9f43', t: () => T.dificult - 0.1, l: ['PÉRDIDA DE', 'PROPULSIÓN'], lt: () => T.propulsion, icon: (ctx, x, y) => { ctx.fillStyle = '#ffffff'; for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(x, y); ctx.rotate(i * TAU / 3); ctx.beginPath(); ctx.ellipse(0, -34, 18, 34, 0, 0, TAU); ctx.fill(); ctx.restore(); } ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill(); } },
  { x: 740, c: '#e8505b', t: () => T.lastre9 - 0.1, l: ['SOPLADO DE LASTRE', 'INSUFICIENTE'], lt: () => T.dificult + 0.1, icon: (ctx, x, y) => { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(x - 26, y - 56, 52, 110, 24); ctx.fill(); ctx.fillRect(x - 10, y - 74, 20, 20); } },
 ];
 B.push({ t0: T.invest - 0.2, t1: T.medida - 0.3, in: { type: 'rise', d: 0.55 }, draw(ctx, t) {
  ctx.fillStyle = '#28305a'; ctx.fillRect(0, 0, W, HH); ctx.fillStyle = '#323b6b'; ctx.fillRect(0, 1250, W, HH);
  P.withPop(ctx, t, T.posible - 0.05, 540, 560, () => { P.rr(ctx, 120, 500, 840, 120, 60, '#ffffff', { sy: 12 }); ctx.save(); ctx.font = '900 46px Nunito'; ctx.textBaseline = 'middle'; const a = 'POSIBLE ', b = 'CADENA DE FALLOS', wa = ctx.measureText(a).width, wb = ctx.measureText(b).width, x0 = 540 - (wa + wb) / 2; ctx.fillStyle = '#e8505b'; ctx.textAlign = 'left'; ctx.fillText(a, x0, 563); ctx.fillStyle = '#1d1b3a'; ctx.fillText(b, x0 + wa, 563); ctx.restore(); });
  DOM.forEach((d, i) => {
   const fall = win(t, d.t(), d.t() + 0.35), target = i < 2 ? 0.36 : 1.2, rot = E.in(fall) * target;
   P.withPop(ctx, t, d.lt() - 0.15, d.x + 110, 1250, () => { ctx.save(); ctx.translate(d.x + 220, 1250); ctx.rotate(rot); P.rr(ctx, -220, -400, 220, 400, 22, d.c, { sy: 10 }); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(-200, -380, 14, 360); d.icon(ctx, -110, -200); ctx.restore(); });
   const la = sm(d.lt(), d.lt() + 0.2, t);
   if (la > 0) { ctx.save(); ctx.globalAlpha = la; P.text(ctx, d.l[0], d.x + 110, 1320, 30, '#ffffff'); P.text(ctx, d.l[1], d.x + 110, 1362, 30, '#ffffff'); ctx.restore(); }
  });
  // al caer el último: el agua no sale
  P.onoma(ctx, '¡TOC!', 270, 880, 70, t, DOM[0].t() + 0.3, DOM[0].t() + 1.2, { c: '#ffffff' });
  P.onoma(ctx, '¡TOC!', 580, 880, 70, t, DOM[1].t() + 0.3, DOM[1].t() + 1.2, { c: '#ffffff', rot: 0.1 });
 }, sfx(k) { FX.aparece(k, T.posible - 0.05, 460); DOM.forEach((d) => { FX.aparece(k, d.lt() - 0.15, 600); FX.domino(k, d.t() + 0.33); }); k.play('thud', DOM[2].t() + 0.36, { f: 80, gain: 0.45 }); } });
 // 7 · CASO REAL: la presión aumenta… el casco no la soporta (sin explosión)
 B.push({ t0: T.medida - 0.3, t1: T.las12 - 0.1, in: { type: 'iris', d: 0.6, x: 540, y: 960 }, draw(ctx, t) {
  const dep = E.inOut(win(t, T.medida, T.soportarla)), dark = sm(T.soportarla + 0.3, T.las12 - 0.15, t);
  sea(ctx, t, 0.75 + 0.25 * dep, { scroll: 3000 + dep * 1500 });
  const sx = 540, sy = 940 + 40 * dep, crack = win(t, T.soportarla - 0.05, T.soportarla + 0.3);
  const sh = crack > 0 && crack < 1 ? Math.sin(t * 70) * 5 : 0;
  sub(ctx, sx + sh, sy, 760, 0.1, t, { nav: 0, crack, prop: 0 });
  // flechas de presión hacia dentro
  const pa = sm(T.presion - 0.3, T.presion + 0.1, t), L = 60 + 120 * dep;
  if (pa > 0) for (let i = 0; i < 10; i++) { const an = (i + 0.5) / 10 * TAU, rx = 470, ry = 230, ex = sx + Math.cos(an) * rx, ey = sy + Math.sin(an) * ry; P.arrow(ctx, ex + Math.cos(an) * L, ey + Math.sin(an) * L, ex, ey, pa, '#7cc8ff', 18 + 10 * dep); }
  P.withPop(ctx, t, T.presion, 540, 520, () => { P.rr(ctx, 290, 465, 500, 110, 55, '#ffffff', { sy: 12 }); P.text(ctx, 'PRESIÓN', 540, 522, 54, '#1d1b3a', { kind: 'title' }); });
  P.withPop(ctx, t, T.aumentaba, 540, 1330, () => P.gauge(ctx, 540, 1330, 120, 0.2 + 0.8 * dep, ''));
  P.onoma(ctx, 'CRRRK', 300, 1180, 84, t, T.casco - 0.1, T.soportarla + 0.4, { c: '#ffdf5e' });
  P.withPop(ctx, t, T.soportarla + 0.1, 540, 1560, () => { P.rr(ctx, 240, 1510, 600, 100, 50, '#e8505b', { sy: 10 }); P.text(ctx, 'LÍMITE DEL CASCO', 540, 1562, 44, '#ffffff'); });
  if (dark > 0) { ctx.fillStyle = `rgba(3,6,16,${dark})`; ctx.fillRect(0, 0, W, HH); }
 }, sfx(k) {
  k.noise(T.medida, { dur: T.soportarla + 0.4 - T.medida, color: 'brown', filter: 'lowpass', f: [[0, 120], [T.soportarla - T.medida, 320]], gain: 0.16, a: T.soportarla - T.medida - 0.5, hold: 0.2 });
  FX.aparece(k, T.presion, 420); FX.flecha(k, T.presion - 0.3, 0.5); FX.aparece(k, T.aumentaba, 520);
  FX.crujido(k, T.presion + 0.2, 0.7, 110); FX.crujido(k, T.aumentaba + 0.2, 0.9, 85); FX.crujido(k, T.casco, 1.1, 70); FX.onomatopeya(k, T.casco - 0.1);
  FX.golpeSordo(k, T.soportarla + 0.05); FX.aparece(k, T.soportarla + 0.1, 300);
 } });
 // 8 · CONSECUENCIA: 129 personas (silencio, respeto)
 B.push({ t0: T.las12 - 0.1, t1: T.oceano13 - 0.15, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = '#0c1024'; ctx.fillRect(0, 0, W, HH);
  const a = sm(T.n129 - 0.2, T.n129 + 0.2, t);
  ctx.save(); ctx.globalAlpha = a; P.bigText(ctx, '129', 540, 700, 230, '#ffffff', { stroke: false, kind: 'title' }); ctx.restore();
  pill(ctx, 'PERSONAS A BORDO', 540, 880, 38, t, T.personas, { bg: '#ffffff' });
  const t0 = T.personas + 0.2, t1 = T.vida + 0.2;
  for (let i = 0; i < 129; i++) { const r = Math.floor(i / 13), c = i % 13, x = 540 + (c - 6) * 74, y = 1000 + r * 60; const on = sm(t0 + (t1 - t0) * i / 129, t0 + (t1 - t0) * i / 129 + 0.3, t); ctx.globalAlpha = 0.15 + 0.75 * on; P.person(ctx, x, y + 14, 48, '#cfe6ff'); }
  ctx.globalAlpha = 1;
 }, sfx(k) { FX.campana(k, T.vida + 0.4); } });
 // 9 · LECCIÓN: no hace falta una grieta
 B.push({ t0: T.oceano13 - 0.15, t1: T.aveces - 0.1, in: { type: 'iris', d: 0.6, x: 540, y: 980 }, draw(ctx, t) {
  sea(ctx, t, 0.4, { scroll: t * 30 });
  sub(ctx, 540, 1040, 880, 0, t, { nav: 1 });
  P.bubble(ctx, 380, 640, 260, 210, t, T.grieta - 0.15, (bx, by) => { ctx.strokeStyle = '#1d1b3a'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(bx - 20, by - 70); ctx.lineTo(bx + 14, by - 22); ctx.lineTo(bx - 16, by + 10); ctx.lineTo(bx + 18, by + 60); ctx.stroke(); P.cross(ctx, bx, by, 150, win(t, T.grieta + 0.2, T.grieta + 0.5)); }, { tailX: 20 });
  P.withPop(ctx, t, T.amenaza - 0.1, 760, 640, () => { P.rr(ctx, 560, 580, 420, 120, 60, '#e8505b', { sy: 12 }); P.text(ctx, 'AMENAZA', 760, 642, 52, '#ffffff', { kind: 'title' }); });
  P.withPop(ctx, t, T.grieta + 0.5, 540, 1330, () => { P.rr(ctx, 200, 1285, 680, 90, 45, '#ffffff', { sy: 8 }); P.text(ctx, 'CASCO SIN GRIETAS… Y AUN ASÍ', 540, 1332, 34, '#1d1b3a'); });
 }, sfx(k) { FX.sonar(k, T.oceano13 + 0.1, 0.5); FX.aparece(k, T.grieta - 0.15, 520); FX.tachado(k, T.grieta + 0.2); FX.etiqueta(k, T.grieta + 0.5); FX.sello(k, T.amenaza - 0.1); } });
 // 10 · LECCIÓN: el sistema de emergencia que no funciona cuando más se necesita
 B.push({ t0: T.aveces - 0.1, t1: T.asombro - 0.3, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  ctx.fillStyle = '#25304a'; ctx.fillRect(0, 0, W, HH);
  const y = 900, dead = sm(T.nofunc, T.nofunc + 0.3, t);
  P.withPop(ctx, t, T.aveces + 0.2, 200, y, () => { P.rr(ctx, 130, y - 170, 140, 300, 66, '#f5b82e', { sy: 12 }); ctx.fillStyle = '#8a98ad'; ctx.fillRect(180, y - 205, 40, 40); P.text(ctx, 'AIRE', 200, y + 190, 32, '#ffffff'); });
  const p1 = sm(T.basta, T.basta + 0.5, t);
  ctx.fillStyle = '#8a98ad'; ctx.fillRect(270, y - 12, 220 * p1, 24); if (p1 >= 1) ctx.fillRect(610, y - 12, 220 * sm(T.sistema14 + 0.3, T.sistema14 + 0.8, t), 24);
  P.withPop(ctx, t, T.sistema14, 550, y, () => { P.circle(ctx, 550, y, 70, '#e8505b', { shadow: true }); ctx.save(); ctx.translate(550, y); ctx.rotate(t * 0.5 * (1 - dead)); ctx.fillStyle = '#ffffff'; ctx.fillRect(-56, -9, 112, 18); ctx.fillRect(-9, -56, 18, 112); ctx.restore(); P.text(ctx, 'VÁLVULA', 550, y - 130, 32, '#ffffff'); });
  P.withPop(ctx, t, T.sistema14 + 0.6, 900, y, () => { P.rr(ctx, 820, y - 150, 170, 300, 34, C.air, { sy: 12 }); ctx.fillStyle = C.water; ctx.beginPath(); ctx.roundRect(820, y - 100, 170, 250, [0, 0, 34, 34]); ctx.fill(); P.text(ctx, 'TANQUE', 905, y + 200, 32, '#ffffff'); });
  // flujo de aire que se corta
  const fl = sm(T.sistema14 + 0.2, T.sistema14 + 0.5, t) * (1 - dead);
  if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${fl})`; for (let k2 = 0; k2 < 6; k2++) { const u = (t * 1.5 + k2 / 6) % 1; ctx.beginPath(); ctx.arc(lerp(280, 820, u), y, 9, 0, TAU); ctx.fill(); } }
  P.cross(ctx, 550, y, 190, win(t, T.nofunc, T.nofunc + 0.3));
  P.withPop(ctx, t, T.necesita - 0.4, 540, 1300, () => { P.rr(ctx, 120, 1245, 840, 110, 55, '#e8505b', { sy: 12 }); P.text(ctx, 'CUANDO MÁS SE NECESITA', 540, 1302, 46, '#ffffff'); });
  P.withPop(ctx, t, T.necesita - 0.2, 860, 600, () => { P.circle(ctx, 860, 600, 90, '#ffffff', { shadow: true }); ctx.strokeStyle = '#1d1b3a'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(860, 600); ctx.lineTo(860 + Math.cos(t * 6) * 0, 600 - 55); ctx.moveTo(860, 600); ctx.lineTo(860 + Math.cos(t * 3) * 45, 600 + Math.sin(t * 3) * 45); ctx.stroke(); });
 }, sfx(k) { FX.aparece(k, T.aveces + 0.2, 520); FX.flecha(k, T.basta); FX.aparece(k, T.sistema14, 600); FX.aparece(k, T.sistema14 + 0.6, 680); FX.siseo(k, T.sistema14 + 0.2, T.nofunc - T.sistema14); FX.tachado(k, T.nofunc); k.play('tick', T.necesita - 0.2, { gain: 0.4 }); for (let i = 1; i < 5; i++) k.play('tick', T.necesita - 0.2 + i * 0.25, { gain: 0.25, minor: true }); FX.sello(k, T.necesita - 0.4); } });
 // 11 · SOLUCIÓN + cierre
 B.push({ t0: T.asombro - 0.3, t1: DURATION + 1, in: { type: 'iris', d: 0.6, x: 540, y: 960 }, draw(ctx, t) {
  ctx.fillStyle = '#1d1b3a'; ctx.fillRect(0, 0, W, HH);
  const R = H.rng(9); for (let i = 0; i < 20; i++) { ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.arc(R() * W, R() * HH, R.range(30, 110), 0, TAU); ctx.fill(); }
  const s0 = T.asombro - 0.1;
  pill(ctx, 'LA SOLUCIÓN', 540, 470, 38, t, s0, { bg: '#2fbf71', fg: '#ffffff' });
  P.withPop(ctx, t, s0 + 0.2, 170, 640, () => P.shield(ctx, 170, 640, 85, '#2fbf71', win(t, s0 + 0.4, s0 + 0.8)));
  const ta = sm(s0 + 0.3, s0 + 0.6, t);
  ctx.save(); ctx.globalAlpha = ta; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.font = '900 40px Nunito'; ctx.fillText('Tras el Thresher nació', 290, 600); ctx.fillStyle = '#f0b90b'; ctx.fillText('SUBSAFE:', 290, 652); ctx.fillStyle = '#ffffff'; ctx.font = '700 34px Nunito'; ctx.fillText('un programa que certifica el casco', 290, 702); ctx.fillText('y los sistemas de emergencia.', 290, 746); ctx.restore();
  P.withPop(ctx, t, T.asombro + 0.1, 540, 1000, () => { P.rr(ctx, 110, 900, 860, 220, 40, '#ffffff', { sy: 16 }); P.text(ctx, 'ASOMBROTECA', 540, 990, 96, '#1d1b3a', { kind: 'title' }); P.text(ctx, 'la ciencia oculta de lo imposible', 540, 1068, 34, '#5a5790'); });
  const press = win(t, T.tag + 1.3, T.tag + 1.5), done = t > T.tag + 1.45;
  P.withPop(ctx, t, T.tag + 0.4, 540, 1290, () => { P.rr(ctx, 330, 1240, 420, 100, 50, done ? '#2fbf71' : '#f0b90b', { sy: 10 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 1292, 44, '#1d1b3a'); });
  const fy = lerp(1700, 1310, E.out(win(t, T.tag + 0.7, T.tag + 1.3)));
  if (t > T.tag + 0.7) P.finger(ctx, 610, fy, 110, press * (1 - win(t, T.tag + 1.6, T.tag + 1.9)));
 }, sfx(k) { FX.aparece(k, T.asombro - 0.1, 560); FX.correcto(k, T.asombro + 0.3); FX.sello(k, T.asombro + 0.1); FX.aparece(k, T.tag + 0.4, 700); FX.clic(k, T.tag + 1.45); k.play('ding', T.tag + 1.5, { f: 'A5', gain: 0.3 }); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B,
  keywords: ['cientos', 'falla', 'hundirse', 'responde', ['lastre', T.tanques4 - 1, T.tanques4 + 2], 'peso', 'comprimido', 'emergencia', '1963', 'Thresher', 'posible', 'propulsión', 'presión', 'casco', '129', 'grieta', 'amenaza', ['necesita', T.aveces, 99], 'Asombroteca'],
  capY: 300,
  ambience(k) {
   k.noise(0, { dur: T.las12 - 0.2, color: 'brown', filter: 'lowpass', f: 180, gain: 0.06, a: 1.2, hold: T.las12 - 2.4 });
   k.noise(T.oceano13 - 0.2, { dur: T.asombro - T.oceano13, color: 'brown', filter: 'lowpass', f: 170, gain: 0.05, a: 1, hold: T.asombro - T.oceano13 - 2 });
  },
  music(k) {
   const Dm = [['D2', 'A2', 'F3', 'C4'], ['Bb1', 'F2', 'D3', 'A3']];
   k.music('pad', 0, T.entender, { bpm: 72, gain: 0.4, chords: Dm });
   k.music('pulse', T.entender, T.pero7, { bpm: 96, gain: 0.26, chords: [['F2', 'C3', 'A3', 'E4'], ['C2', 'G2', 'E3', 'B3'], ['D2', 'A2', 'F3', 'C4'], ['Bb1', 'F2', 'D3', 'A3']] });
   k.music('pad', T.pero7, T.las12 - 0.3, { bpm: 72, gain: 0.42, chords: [['D2', 'A2', 'F3', 'C4'], ['G1', 'D2', 'Bb2', 'F3'], ['Bb1', 'F2', 'D3', 'A3'], ['A1', 'E2', 'C#3', 'G3']] });
   k.music('pad', T.oceano13 - 0.2, T.asombro - 0.3, { bpm: 66, gain: 0.34, chords: [['D2', 'A2', 'F3', 'E4'], ['Bb1', 'F2', 'D3', 'C4']] });
   k.music('pad', T.asombro - 0.3, DURATION, { bpm: 66, gain: 0.4, chords: [['D2', 'A2', 'F#3', 'E4'], ['G2', 'D3', 'B3', 'F#4']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
