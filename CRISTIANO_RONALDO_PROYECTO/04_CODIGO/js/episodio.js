// =====================================================================================================
// episodio.js — «Le llamaban llorón: Cristiano Ronaldo» · PLANTILLA ASOMBROTECA v1.29 · estilo «noche»
// Voz: ElevenLabs Eleven v4, Dan, UNA toma con 3 ganchos ([GANCHO A/B/C] en tramos.txt) → 3 variantes (producir.py … variantes).
// Cada gancho ocupa 2 tramos, así que el cuerpo empieza SIEMPRE en el tramo 2 en las tres variantes.
// Personas reales: Cristiano dibujado con rasgos reconocibles (tupé, número 7, celebración «Siuuu»), sin copiar fotos ni escudos.
// Metáfora sostenida: la ALCANCÍA (cada hábito es una moneda). Fórmula: gancho → giro (no era debilidad, era rabia) → 4 pasos
// (llanto, Lisboa a los 12, pesas, corazón a los 15) → alcancía → sueño en ciclos → 41 años y 985 goles → remate → compartir.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, B0, DURATION, txt } = K;
 const GANCHO = window.GANCHO || 'A';
 const S = (i) => A.segments[i].s, Se = (i) => A.segments[i].e;
 // ---------- tiempos clave (tramos del cuerpo: 2…24, iguales en las 3 variantes) ----------
 const Tk = {
  g0e: Se(0), g1: S(1), g1e: Se(1),
  perdia: wt(2, 'perdía.'), balon: wt(3, 'balón,'), debil: wt(4, 'debilidad…'), rabia: wt(5, 'rabia.'),
  doce: wt(6, '12'), lisboa: wt(6, 'Lisboa,'), familia: wt(6, 'familia.'), lloro: wt(7, 'Lloró'), dias: wt(7, 'días…'), pero: wt(8, 'pero'), volvio: wt(8, 'volvió.'),
  flaco: wt(9, 'flaco,'), gimnasio: wt(9, 'gimnasio'), pesas: wt(9, 'pesas.'),
  quince: wt(10, '15,'), corazon: wt(10, 'corazón'), rapido: wt(10, 'rápido.'), taqui: S(11),
  laser: wt(12, 'láser'), manana: wt(12, 'mañana…'), tarde: wt(13, 'tarde'), casa: wt(13, 'casa.'), pocos: wt(14, 'pocos'), entrenar: wt(14, 'entrenar.'),
  secreto: wt(15, 'secreto'), truco: wt(15, 'truco.'), alcancia: wt(16, 'alcancía.'),
  moneda: wt(17, 'moneda:'), entreno: wt(18, 'entrenamiento'), comida: wt(18, 'comida'), noche: wt(18, 'noche'), sueno: wt(18, 'sueño.'),
  ciclos: wt(19, 'ciclos'), noventa: wt(19, '90'), cinco: wt(19, 'cinco'),
  anos41: wt(20, '41'), marcando: wt(20, 'marcando.'), van: wt(21, 'van'), g985: wt(21, '985'), goles: wt(21, 'goles'), oficiales: wt(21, 'oficiales.'),
  talento: wt(22, 'talento'), campo: wt(22, 'campo.'), alc2: wt(23, 'alcancía'), veinte: wt(23, '20'), envia: S(24),
 };
 const RED = '#e0263a', GRN = '#1f8a4c', GOLD = '#FFC845', SKIN = '#c98b62', HAIR = '#22140b', TEAR = '#8fd3ff', ECG = '#3dff8a';
 const R = (a, b, t) => E.out(win(t, a, b));

 // =====================================================================================================
 // DIBUJO PROPIO
 // =====================================================================================================
 // ---- jugador (adulto o niño): pies en (x, y), altura h. Poses: stand · run · siuu · lift · cry ----
 const jugador = (ctx, x, y, h, t, o = {}) => {
  const kid = !!o.kid, th = o.thin ?? 1, pose = o.pose || 'stand', r = h * (kid ? 0.088 : 0.068), shirt = o.shirt || RED, shorts = o.shorts || (kid ? '#1d2b4a' : GRN), sock = o.sock || (kid ? '#e8edf5' : RED);
  let jy = 0, lean = 0; const u = o.u ?? 1;
  if (pose === 'siuu') { jy = -Math.sin(Math.PI * cl(u)) * h * 0.22 * (u < 1 ? 1 : 0); lean = (1 - cl(u)) * 0.2; }
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  // sombra de contacto (nada flota): se encoge cuando salta
  const sh = 1 - Math.min(0.6, -jy / h * 2); ctx.fillStyle = `rgba(0,0,0,${0.38 * sh})`; ctx.beginPath(); ctx.ellipse(x, y + 4, h * 0.2 * sh * (pose === 'siuu' ? 1.5 : 1), h * 0.028 * sh, 0, 0, TAU); ctx.fill();
  ctx.translate(x, y + jy); ctx.rotate(lean); ctx.translate(-x, -y);
  const hipY = y - h * 0.47, shY = y - h * (kid ? 0.78 : 0.8), hc = [x, y - h + r], sw = h * (kid ? 0.105 : 0.14) * th, hw = h * (kid ? 0.07 : 0.085) * th;
  const lw = h * (kid ? 0.055 : 0.07) * Math.max(0.75, th), aw = h * (kid ? 0.042 : 0.055) * Math.max(0.75, th), ph = t * 9;
  // piernas: ángulos (desde la vertical) cadera y rodilla
  let legs = [[-0.04, 0], [0.04, 0]];
  if (pose === 'run') { const s = Math.sin(ph); legs = [[0.45 * s, Math.max(0, -s) * 0.7], [-0.45 * s, Math.max(0, s) * 0.7]]; }
  if (pose === 'siuu') legs = [[-0.36 * cl(u * 1.4), 0], [0.36 * cl(u * 1.4), 0]];
  if (pose === 'lift') legs = [[-0.16, 0], [0.16, 0]];
  const limb = (x0, y0, a1, a2, L, w, c1, c2, cut = 0.5) => { const kx = x0 + Math.sin(a1) * L * 0.5, ky = y0 + Math.cos(a1) * L * 0.5, fx = kx + Math.sin(a1 + a2) * L * 0.5, fy = ky + Math.cos(a1 + a2) * L * 0.5;
   ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = c2; ctx.lineWidth = w * 0.86; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
   ctx.strokeStyle = c1; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, kx, cut * 2 > 1 ? 1 : cut * 2), lerp(y0, ky, cut * 2 > 1 ? 1 : cut * 2)); if (cut > 0.5) ctx.lineTo(lerp(kx, fx, (cut - 0.5) * 2), lerp(ky, fy, (cut - 0.5) * 2)); ctx.stroke(); return [fx, fy]; };
  const Lleg = y - hipY;
  for (const [i, sg] of [[0, -1], [1, 1]]) { const [a1, a2] = legs[i], hx = x + sg * hw * 0.55; const f = limb(hx, hipY, a1, -a2 * Math.sign(a1 || 1), Lleg, lw, shorts, kid ? SKIN : sock, 0.42);
   // media (adulto) y bota
   if (!kid) { ctx.strokeStyle = sock; ctx.lineWidth = lw * 0.9; ctx.beginPath(); ctx.moveTo(lerp(hx, f[0], 0.62), lerp(hipY, f[1], 0.62)); ctx.lineTo(f[0], f[1] - h * 0.01); ctx.stroke(); }
   else { ctx.strokeStyle = sock; ctx.lineWidth = lw * 0.88; ctx.beginPath(); ctx.moveTo(lerp(hx, f[0], 0.78), lerp(hipY, f[1], 0.78)); ctx.lineTo(f[0], f[1] - h * 0.01); ctx.stroke(); }
   ctx.fillStyle = '#111317'; ctx.beginPath(); ctx.ellipse(f[0] + sg * h * 0.018, f[1], h * 0.045, h * 0.02, 0, 0, TAU); ctx.fill(); }
  // tronco (camiseta) — los niños flacos llevan la camiseta grande
  const bag = kid ? 1.25 : 1; ctx.fillStyle = shirt; ctx.beginPath(); ctx.moveTo(x - sw * bag, shY); ctx.lineTo(x + sw * bag, shY); ctx.lineTo(x + hw * 1.15 * bag, hipY + h * 0.03); ctx.lineTo(x - hw * 1.15 * bag, hipY + h * 0.03); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x - sw * bag, shY, sw * bag * 0.5, hipY - shY + h * 0.03);
  if (!kid) { ctx.strokeStyle = GRN; ctx.lineWidth = h * 0.012; ctx.beginPath(); ctx.arc(x, shY - h * 0.005, h * 0.035, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  if (o.num) { ctx.save(); ctx.font = `900 ${h * (kid ? 0.11 : 0.12)}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = h * 0.008; ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.strokeText(o.num, x, (shY + hipY) / 2 + h * 0.01); ctx.fillStyle = '#ffffff'; ctx.fillText(o.num, x, (shY + hipY) / 2 + h * 0.01); ctx.restore(); }
  // brazos: ángulos desde la vertical (positivo = hacia fuera)
  let arms = [[0.14, 0.1], [0.14, 0.1]];
  if (pose === 'run') { const s = Math.sin(ph); arms = [[-0.6 * s, 1.1], [0.6 * s, 1.1]]; }
  if (pose === 'siuu') { const q = cl(u * 1.2); arms = [[lerp(2.6, 0.95, q), 0], [lerp(2.6, 0.95, q), 0]]; }
  if (pose === 'cry') arms = [[0.1, 0.05], [0.1, 0.05]];
  if (pose === 'puños') { const tb = Math.sin(t * 40) * 0.02 * (o.tension ?? 1); arms = [[0.3 + tb, 0.55], [0.3 - tb, 0.55]]; }
  const La = h * (kid ? 0.32 : 0.34);
  if (pose === 'lift') { const rep = o.repT0 != null ? 0.5 + 0.5 * Math.cos((t - o.repT0) * 3.2) : 0.5 - 0.5 * Math.cos(t * 3.2), by = shY - h * lerp(0.02, 0.2, rep), bx = sw * 1.25;
   for (const sg of [-1, 1]) { ctx.lineCap = 'round'; ctx.strokeStyle = SKIN; ctx.lineWidth = aw; ctx.beginPath(); ctx.moveTo(x + sg * sw * 0.95, shY + h * 0.02); ctx.lineTo(x + sg * (sw + h * 0.06), lerp(shY + h * 0.08, shY - h * 0.06, rep)); ctx.lineTo(x + sg * bx, by); ctx.stroke(); ctx.strokeStyle = shirt; ctx.lineWidth = aw * 1.25; ctx.beginPath(); ctx.moveTo(x + sg * sw * 0.95, shY + h * 0.02); ctx.lineTo(lerp(x + sg * sw * 0.95, x + sg * (sw + h * 0.06), 0.45), lerp(shY + h * 0.02, lerp(shY + h * 0.08, shY - h * 0.06, rep), 0.45)); ctx.stroke(); }
   ctx.strokeStyle = '#c9ced8'; ctx.lineWidth = h * 0.018; ctx.beginPath(); ctx.moveTo(x - h * 0.42, by); ctx.lineTo(x + h * 0.42, by); ctx.stroke();
   for (const sg of [-1, 1]) for (let k = 0; k < 2; k++) { ctx.fillStyle = k ? '#3a3f4b' : '#262a33'; const px = x + sg * (h * 0.33 + k * h * 0.045); ctx.beginPath(); ctx.roundRect(px - h * 0.02, by - h * (0.11 - k * 0.02), h * 0.04, h * (0.22 - k * 0.04), 6); ctx.fill(); } }
  else for (const [i, sg] of [[0, -1], [1, 1]]) { const [a1, a2] = arms[i]; const f = limb(x + sg * sw * 0.95, shY + h * 0.02, sg * a1, sg * a2, La, aw, shirt, SKIN, 0.32);
   if (pose === 'puños') { ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(f[0], f[1], aw * 1.05, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(90,40,20,0.55)'; ctx.lineWidth = aw * 0.14; for (let q = -1; q <= 1; q++) { ctx.beginPath(); ctx.moveTo(f[0] - aw * 0.6, f[1] + q * aw * 0.38); ctx.lineTo(f[0] + aw * 0.6, f[1] + q * aw * 0.38); ctx.stroke(); } } }
  // cuello y cabeza
  ctx.fillStyle = SKIN; ctx.fillRect(x - r * 0.35, shY - r * 0.55, r * 0.7, r * 0.6);
  const [cx, cy0] = hc, cy = cy0 + (pose === 'siuu' ? -r * 0.1 : 0), tilt = pose === 'siuu' ? -0.12 * cl(u) : 0;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(tilt); ctx.translate(-cx, -cy);
  ctx.fillStyle = SKIN; ctx.beginPath(); ctx.ellipse(cx - r * 0.98, cy + r * 0.05, r * 0.18, r * 0.26, 0, 0, TAU); ctx.ellipse(cx + r * 0.98, cy + r * 0.05, r * 0.18, r * 0.26, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.95, r * (kid ? 1.0 : 1.08), 0, 0, TAU); ctx.fill();
  // pelo: tupé (adulto) o rizos (niño)
  ctx.fillStyle = HAIR;
  if (kid) { for (let k = 0; k < 11; k++) { const a = Math.PI + (k / 10) * Math.PI; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r * 0.9, cy - r * 0.15 + Math.sin(a) * r * 0.92, r * 0.3, 0, TAU); ctx.fill(); } ctx.beginPath(); ctx.ellipse(cx, cy - r * 0.55, r * 0.85, r * 0.45, 0, 0, TAU); ctx.fill(); }
  else { ctx.beginPath(); ctx.moveTo(cx - r * 0.97, cy - r * 0.05); ctx.quadraticCurveTo(cx - r * 1.02, cy - r * 0.95, cx - r * 0.35, cy - r * 1.22); ctx.quadraticCurveTo(cx + r * 0.05, cy - r * 1.62, cx + r * 0.62, cy - r * 1.42); ctx.quadraticCurveTo(cx + r * 1.08, cy - r * 1.05, cx + r * 0.97, cy - r * 0.05); ctx.quadraticCurveTo(cx + r * 0.85, cy - r * 0.62, cx + r * 0.2, cy - r * 0.78); ctx.quadraticCurveTo(cx - r * 0.55, cy - r * 0.7, cx - r * 0.97, cy - r * 0.05); ctx.fill();
   ctx.fillStyle = 'rgba(34,20,11,0.45)'; ctx.beginPath(); ctx.ellipse(cx - r * 0.86, cy - r * 0.25, r * 0.14, r * 0.4, 0.1, 0, TAU); ctx.ellipse(cx + r * 0.86, cy - r * 0.25, r * 0.14, r * 0.4, -0.1, 0, TAU); ctx.fill(); }
  // cara
  const mood = o.mood || 'serio', ey = cy - r * 0.02, ex = r * 0.36;
  for (const sg of [-1, 1]) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(cx + sg * ex, ey, r * 0.16, mood === 'grita' ? r * 0.13 : r * 0.12, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#1b1210'; ctx.beginPath(); ctx.arc(cx + sg * ex + (o.look || 0) * r * 0.05, ey + r * 0.01, r * 0.075, 0, TAU); ctx.fill();
   const br = { llora: 0.35, triste: 0.3, rabia: -0.38, grita: 0.18, feliz: 0.1, serio: -0.08 }[mood] ?? 0; ctx.strokeStyle = HAIR; ctx.lineWidth = r * 0.1; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx + sg * (ex - r * 0.2), ey - r * 0.27 - br * r * 0.25); ctx.lineTo(cx + sg * (ex + r * 0.2), ey - r * 0.27 + br * r * 0.25); ctx.stroke(); }
  ctx.fillStyle = '#a8644a'; ctx.beginPath(); ctx.moveTo(cx, ey + r * 0.05); ctx.lineTo(cx - r * 0.09, ey + r * 0.32); ctx.lineTo(cx + r * 0.06, ey + r * 0.34); ctx.closePath(); ctx.fill();
  const my = cy + r * 0.55; ctx.strokeStyle = '#5a2418'; ctx.fillStyle = '#3a1410'; ctx.lineWidth = r * 0.08;
  if (mood === 'grita') { ctx.beginPath(); ctx.ellipse(cx, my, r * 0.24, r * 0.26, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#d9534f'; ctx.beginPath(); ctx.ellipse(cx, my + r * 0.12, r * 0.13, r * 0.08, 0, 0, TAU); ctx.fill(); }
  else if (mood === 'llora') { const w2 = Math.sin(t * 14) * r * 0.02; ctx.beginPath(); ctx.moveTo(cx - r * 0.24, my + r * 0.1); ctx.quadraticCurveTo(cx, my - r * 0.16 + w2, cx + r * 0.24, my + r * 0.1); ctx.quadraticCurveTo(cx, my - r * 0.02, cx - r * 0.24, my + r * 0.1); ctx.fill(); }
  else if (mood === 'feliz') { ctx.beginPath(); ctx.arc(cx, my - r * 0.1, r * 0.22, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  else if (mood === 'triste') { ctx.beginPath(); ctx.arc(cx, my + r * 0.12, r * 0.18, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(cx - r * 0.2, my); ctx.lineTo(cx + r * 0.2, my + (mood === 'rabia' ? r * 0.03 : 0)); ctx.stroke(); }
  ctx.restore();
  // lágrimas: dos regueros y gotas que caen (o.tears 0…1)
  const tr = o.tears || 0; if (tr > 0) { ctx.save(); ctx.globalAlpha *= tr; ctx.strokeStyle = TEAR; ctx.lineWidth = r * 0.07; ctx.lineCap = 'round';
   for (const sg of [-1, 1]) { const x0 = cx + sg * ex, y0 = ey + r * 0.13; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + sg * r * 0.06, y0 + r * 0.3, x0 + sg * r * 0.02, y0 + r * 0.6); ctx.stroke();
    for (let k = 0; k < 2; k++) { const q = (t * 1.3 + k * 0.5 + (sg > 0 ? 0.25 : 0)) % 1; ctx.fillStyle = TEAR; ctx.beginPath(); ctx.ellipse(x0 + sg * r * 0.02, y0 + r * 0.62 + q * r * 2.2, r * 0.07, r * 0.1, 0, 0, TAU); ctx.globalAlpha = tr * (1 - q); ctx.fill(); ctx.globalAlpha = tr; } }
   ctx.restore(); }
  // fuego en los ojos (o.fuego 0…1) y vapor de las lágrimas que se evaporan (o.vapor 0…1)
  const fu = o.fuego || 0; if (fu > 0) { for (const sg of [-1, 1]) { const fx = cx + sg * ex, fy = ey; P.glow(ctx, fx, fy, r * 0.9, '255,140,40', 0.9 * fu);
    for (let k = 0; k < 3; k++) { const ph = (t * 3 + k / 3 + (sg > 0 ? 0.5 : 0)) % 1, fl = r * (0.35 + 0.25 * Math.sin(t * 17 + k * 2)) * fu; ctx.save(); ctx.globalAlpha *= fu * (1 - ph); ctx.fillStyle = k ? '#ffb347' : '#ff5d3c'; ctx.beginPath(); ctx.moveTo(fx - r * 0.1, fy - r * 0.05); ctx.quadraticCurveTo(fx + sg * r * 0.05 + Math.sin(t * 9 + k) * r * 0.08, fy - fl - ph * r * 0.5, fx + r * 0.1, fy - r * 0.05); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = `rgba(255,${180 + 60 * fu | 0},90,${fu})`; ctx.beginPath(); ctx.arc(fx, fy + r * 0.01, r * 0.075, 0, TAU); ctx.fill(); } }
  const va = o.vapor || 0; if (va > 0) { ctx.save(); ctx.lineCap = 'round'; for (const sg of [-1, 1]) for (let k = 0; k < 3; k++) { const q = (t * 0.9 + k / 3) % 1, x0 = cx + sg * ex + Math.sin(t * 4 + k) * r * 0.1, y0 = ey + r * 0.5 - q * r * 2.2; ctx.strokeStyle = `rgba(230,240,255,${0.55 * va * Math.sin(Math.PI * q)})`; ctx.lineWidth = r * 0.12; ctx.beginPath(); ctx.moveTo(x0, y0 + r * 0.3); ctx.quadraticCurveTo(x0 + sg * r * 0.25, y0 + r * 0.15, x0, y0); ctx.quadraticCurveTo(x0 - sg * r * 0.25, y0 - r * 0.15, x0, y0 - r * 0.3); ctx.stroke(); } ctx.restore(); }
  ctx.restore();
  return { head: [cx, cy0 + jy], r };
 };

 // ---- balón ----
 const balon = (ctx, x, y, r, rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.arc(r * 0.08, r * 0.1, r, 0, TAU); ctx.fill();
  ctx.fillStyle = '#f7f8fb'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = '#1b1d24';
  const pent = (px, py, s, a0) => { ctx.beginPath(); for (let k = 0; k < 5; k++) { const a = a0 + k * TAU / 5 - Math.PI / 2; ctx.lineTo(px + Math.cos(a) * s, py + Math.sin(a) * s); } ctx.closePath(); ctx.fill(); };
  pent(0, 0, r * 0.36, 0); for (let k = 0; k < 5; k++) { const a = k * TAU / 5 - Math.PI / 2; pent(Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95, r * 0.3, Math.PI / 5); }
  ctx.restore(); const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0.25)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore(); };

 // ---- portería con red que se infla (bx, by: punto de impacto; b: 0…1) ----
 const porteria = (ctx, x, y, w, h, b = 0, bx = 0.5, by = 0.5) => { const dx = w * 0.12, dy = -h * 0.16; ctx.save(); ctx.lineCap = 'round';
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x + w / 2 + dx / 2, y + 6, w * 0.6, 16, 0, 0, TAU); ctx.fill();
  const P2 = (u, v) => { const d = b * 0.55 * Math.exp(-((u - bx) ** 2 + (v - by) ** 2) / 0.06); return [x + u * w + dx * (1 + d), y - (1 - v) * h + dy * (1 + d) + d * 30]; };
  ctx.strokeStyle = 'rgba(235,240,250,0.45)'; ctx.lineWidth = 2.5;
  for (let i = 0; i <= 12; i++) { ctx.beginPath(); for (let j = 0; j <= 10; j++) { const p = P2(i / 12, j / 10); j ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); }
  for (let j = 0; j <= 10; j++) { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const p = P2(i / 12, j / 10); i ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); }
  ctx.strokeStyle = 'rgba(235,240,250,0.3)'; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + dx, y - h + dy); ctx.moveTo(x + w, y - h); ctx.lineTo(x + w + dx, y - h + dy); ctx.stroke();
  ctx.strokeStyle = '#f5f7fa'; ctx.lineWidth = w * 0.03; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.lineTo(x + w, y - h); ctx.lineTo(x + w, y); ctx.stroke(); ctx.restore(); };

 // ---- monitor de latidos: ritmo que puede acelerar (ritmo(tau) en latidos/s; fase integrada en forma cerrada) ----
 const onda = (f) => { f = ((f % 1) + 1) % 1; const g = (c, s, a) => a * Math.exp(-((f - c) ** 2) / (2 * s * s)); return g(0.12, 0.025, 0.12) - g(0.26, 0.008, 0.18) + g(0.29, 0.01, 1) - g(0.32, 0.01, 0.32) + g(0.52, 0.04, 0.25); };
 const faseLin = (tau, r0, r1, ta, tb) => tau <= ta ? r0 * tau : tau <= tb ? r0 * ta + r0 * (tau - ta) + (r1 - r0) * (tau - ta) ** 2 / (2 * (tb - ta)) : r0 * ta + (r0 + r1) / 2 * (tb - ta) + r1 * (tau - tb);
 const monitor = (ctx, x, y, w, h, t, fase, o = {}) => { ctx.save(); ctx.fillStyle = '#05140d'; ctx.strokeStyle = '#2f4a3d'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(x, y, w, h, 26); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(x + 6, y + 6, w - 12, h - 12, 20); ctx.clip(); ctx.strokeStyle = 'rgba(61,255,138,0.08)'; ctx.lineWidth = 2; for (let gx = x; gx < x + w; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke(); } for (let gy = y; gy < y + h; gy += 40) { ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke(); }
  const sp = o.speed || 320, base = y + h * 0.62, amp = h * 0.42, end = o.end ?? (x + w - 24); ctx.strokeStyle = o.col || ECG; ctx.lineWidth = 6; ctx.shadowColor = o.col || ECG; ctx.shadowBlur = 16; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let px = x + 10; px <= end; px += 3) { const tau = t - (end - px) / sp; px === x + 10 ? ctx.moveTo(px, base - onda(fase(tau)) * amp) : ctx.lineTo(px, base - onda(fase(tau)) * amp); } ctx.stroke();
  ctx.shadowBlur = 24; ctx.fillStyle = '#d8ffe8'; ctx.beginPath(); ctx.arc(end, base - onda(fase(t)) * amp, 9, 0, TAU); ctx.fill(); ctx.restore(); return { y: base - onda(fase(t)) * amp, x: end }; };

 // ---- alcancía (cerdito con el 7) ----
 const alcancia = (ctx, x, y, s, t, o = {}) => { const e = o.e ?? 1, sq = 1 + Math.sin(Math.max(0, t - (o.hit || -9)) * 18) * 0.05 * Math.exp(-Math.max(0, t - (o.hit || -9)) * 4); ctx.save(); ctx.translate(x, y); ctx.scale(s * e * sq, s * e / sq);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 1.02, 1.05, 0.1, 0, 0, TAU); ctx.fill();
  const g = ctx.createLinearGradient(0, -0.9, 0, 0.9); g.addColorStop(0, '#ffd27a'); g.addColorStop(1, '#e09a2b'); ctx.fillStyle = '#c47f1d';
  for (const lx of [-0.62, -0.28, 0.3, 0.64]) { ctx.beginPath(); ctx.roundRect(lx - 0.11, 0.45, 0.22, 0.56, 0.08); ctx.fill(); }
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 1.12, 0.78, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e8a33a'; ctx.beginPath(); ctx.moveTo(-0.62, -0.62); ctx.lineTo(-0.42, -1.02); ctx.lineTo(-0.2, -0.7); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(-0.1, -0.74); ctx.lineTo(0.08, -1.08); ctx.lineTo(0.26, -0.72); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f2b04a'; ctx.beginPath(); ctx.ellipse(-1.12, 0.05, 0.24, 0.3, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#9b5e12'; ctx.beginPath(); ctx.ellipse(-1.16, -0.03, 0.05, 0.08, 0, 0, TAU); ctx.ellipse(-1.06, 0.12, 0.05, 0.08, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1b1210'; ctx.beginPath(); ctx.arc(-0.7, -0.22, 0.07, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#9b5e12'; ctx.lineWidth = 0.05; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(1.18, -0.05, 0.12, Math.PI * 0.6, Math.PI * 2.1); ctx.stroke();
  ctx.fillStyle = '#5a3208'; ctx.beginPath(); ctx.roundRect(-0.28, -0.76, 0.56, 0.08, 0.04); ctx.fill();
  ctx.font = '900 0.78px Fredoka'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = RED; ctx.fillText('7', 0.18, 0.12);
  ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.beginPath(); ctx.ellipse(-0.25, -0.38, 0.5, 0.16, -0.3, 0, TAU); ctx.fill();
  const lleno = o.fill || 0; if (lleno > 0) P.glow(ctx, 0, 0, 1.6, '255,200,69', 0.25 * lleno);
  ctx.restore(); };
 const moneda = (ctx, x, y, r, ic, rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.15, Math.abs(Math.cos(rot))), 1); ctx.fillStyle = '#b07a12'; ctx.beginPath(); ctx.arc(0, r * 0.08, r, 0, TAU); ctx.fill(); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#e9a92a'; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, TAU); ctx.stroke(); if (ic) P.icon(ctx, ic, 0, 0, r * 1.05, { mode: 'flat', col: '#7a4f00' }); ctx.restore(); };

 // ---- calendario que pierde hojas (sin cifras: «muchos días», «pocos días») ----
 const calendario = (ctx, x, y, w, h, t, t0, t1) => { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.roundRect(x + 8, y + 10, w, h, 18); ctx.fill(); ctx.fillStyle = '#e9edf5'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 18); ctx.fill();
  ctx.fillStyle = 'rgba(26,29,38,0.25)'; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { ctx.beginPath(); ctx.roundRect(x + 24 + c * (w - 48) / 4, y + h * 0.36 + r * h * 0.19, (w - 48) / 4 - 10, h * 0.13, 5); ctx.fill(); }
  const n = 6; for (let k = 0; k < n; k++) { const q = win(t, t0 + k * (t1 - t0) / n, t0 + (k + 1) * (t1 - t0) / n); if (q <= 0 || q >= 1) continue; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.translate(x + w / 2 + q * 160, y + q * 240); ctx.rotate(q * 1.4); ctx.fillStyle = '#f7f9fc'; ctx.fillRect(-w / 2, 0, w, h * 0.8); ctx.restore(); }
  ctx.fillStyle = RED; ctx.beginPath(); ctx.roundRect(x, y, w, h * 0.24, [18, 18, 0, 0]); ctx.fill(); ctx.fillStyle = '#2a2f3d'; for (const fx of [0.3, 0.7]) { ctx.beginPath(); ctx.roundRect(x + w * fx - 8, y - 18, 16, 40, 8); ctx.fill(); } ctx.restore(); };
 // ---- fondos propios ----
 const atardecer = (ctx, t) => { const g = ctx.createLinearGradient(0, 0, 0, 1180); g.addColorStop(0, '#120a26'); g.addColorStop(0.55, '#4a1f4f'); g.addColorStop(0.85, '#c4574a'); g.addColorStop(1, '#f2a65a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 1180);
  P.glow(ctx, 760, 1120, 380, '255,190,110', 0.35); ctx.fillStyle = '#2a1636'; ctx.beginPath(); ctx.moveTo(0, 1110); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, 1080 - 70 * Math.sin(x / 210 + 1) - 40 * Math.sin(x / 90)); ctx.lineTo(W, 1180); ctx.lineTo(0, 1180); ctx.fill();
  ctx.fillStyle = '#1d3a66'; ctx.fillRect(0, 1130, W, 50); ctx.strokeStyle = 'rgba(255,200,140,0.35)'; ctx.lineWidth = 3; for (let k = 0; k < 6; k++) { const yy = 1138 + k * 7, o2 = (t * 30 + k * 57) % 200; ctx.beginPath(); ctx.moveTo(560 + o2 - 100, yy); ctx.lineTo(640 + o2 - 100, yy); ctx.stroke(); }
  const gd = ctx.createLinearGradient(0, 1170, 0, HH); gd.addColorStop(0, '#8a5a36'); gd.addColorStop(1, '#3b2414'); ctx.fillStyle = gd; ctx.fillRect(0, 1170, W, HH - 1170);
  const Rr = H.rng(31); ctx.fillStyle = 'rgba(40,22,10,0.35)'; for (let k = 0; k < 90; k++) { ctx.beginPath(); ctx.ellipse(Rr() * W, 1190 + Rr() * 700, 3 + Rr() * 8, 2 + Rr() * 3, 0, 0, TAU); ctx.fill(); } };
 const estadio = (ctx, t, o = {}) => { P.fondo(ctx, t); const L = [[110, 820], [970, 820]]; for (const [lx, ly] of L) { ctx.fillStyle = '#1a1f2e'; ctx.fillRect(lx - 7, ly + 30, 14, 1180 - ly - 30); ctx.fillStyle = '#2a3042'; ctx.beginPath(); ctx.roundRect(lx - 60, ly - 22, 120, 56, 8); ctx.fill(); P.glow(ctx, lx, ly, 520, '255,245,220', 0.2); ctx.fillStyle = 'rgba(255,250,235,0.95)'; for (let k = 0; k < 4; k++) for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.arc(lx - 39 + k * 26, ly - 6 + j * 24, 9, 0, TAU); ctx.fill(); } }
  const g = ctx.createLinearGradient(0, 1150, 0, HH); g.addColorStop(0, '#1d6b3c'); g.addColorStop(1, '#0b2d19'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 1180); ctx.lineTo(W, 1180); ctx.lineTo(W, HH); ctx.lineTo(0, HH); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.05)'; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(0, 1180 + k * 130); ctx.lineTo(W, 1180 + k * 130); ctx.lineTo(W, 1245 + k * 130); ctx.lineTo(0, 1245 + k * 130); ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(540, 1520, 360, 90, 0, 0, TAU); ctx.stroke(); if (o.crowd) { const Rr = H.rng(9); for (let k = 0; k < 160; k++) { const xx = Rr() * W, yy = 1030 + Rr() * 120, fl = Math.sin(t * 6 + k) > 0.92; ctx.fillStyle = fl ? 'rgba(255,255,255,0.9)' : `rgba(${120 + Rr() * 80},${60 + Rr() * 60},${90 + Rr() * 80},0.6)`; ctx.beginPath(); ctx.arc(xx, yy, fl ? 4 : 6, 0, TAU); ctx.fill(); } } };

 // =====================================================================================================
 // ESCENAS
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO (depende de la variante) ----------
 B.push({ t0: 0, t1: B0.b2, in: { type: 'cut' }, draw(ctx, t) {
  if (GANCHO === 'A') {
   // niño llorando en un campo de tierra; una lágrima cae, se vuelve balón y entra en la red
   atardecer(ctx, t); porteria(ctx, 640, 1330, 360, 250, sm(Tk.g1e - 0.5, Tk.g1e - 0.2, t) * (1 - sm(Tk.g1e + 0.3, Tk.g1e + 1.2, t)), 0.55, 0.45);
   const k0 = jugador(ctx, 330, 1420, 820, t, { kid: true, thin: 0.75, shirt: '#3d7fd9', mood: 'llora', tears: 1, pose: 'cry' });
   const tf = Tk.g0e - 0.25, fall = win(t, 0.25, tf), land = [430, 1420];
   const [hx, hy] = [k0.head[0] + k0.r * 0.4, k0.head[1] + k0.r * 0.7];
   if (t < tf) { ctx.fillStyle = TEAR; P.glow(ctx, lerp(hx, land[0], fall), lerp(hy, land[1], E.in(fall)), 60, '143,211,255', 0.6); ctx.beginPath(); ctx.ellipse(lerp(hx, land[0], fall), lerp(hy, land[1], E.in(fall)), 14 + 10 * fall, 20 + 12 * fall, 0, 0, TAU); ctx.fill(); }
   else { const g = sm(tf, tf + 0.25, t), kick = win(t, Tk.g1 + 0.2, Tk.g1e - 0.3), bx = lerp(land[0], 820, E.inOut(kick)), by = lerp(land[1] - 40, 1180, E.inOut(kick)) - Math.sin(Math.PI * kick) * 220;
    if (kick < 1) { P.glow(ctx, bx, by, 120, '143,211,255', 0.4 * (1 - g)); balon(ctx, bx, by, 18 + 30 * g, t * 6 * (kick > 0 ? 3 : 0.4)); } else balon(ctx, 830, 1270, 46, 0); }
  } else if (GANCHO === 'B') {
   // contador 0 → 985 y el niño más flaco del equipo
   P.fondo(ctx, t); const n = Math.round(985 * E.out(win(t, 0, Math.max(0.6, Tk.g0e)))), lift = sm(Tk.g1 - 0.2, Tk.g1 + 0.2, t);
   P.glow(ctx, 540, lerp(980, 660, lift), 520, '255,200,69', 0.22 * (1 - lift * 0.5));
   P.statBig(ctx, String(n), 540, lerp(980, 660, lift), t, 0, null, { px: lerp(300, 140, lift), sub: 'GOLES OFICIALES', col: GOLD });
   const fila = [[175, 1.3, '#6a7385'], [385, 1.35, '#6a7385'], [590, 0.62, '#3d7fd9'], [810, 1.3, '#6a7385']];
   for (const [i, [fx, th, c]] of fila.entries()) { const e = R(Tk.g1 + i * 0.12, Tk.g1 + 0.4 + i * 0.12, t); if (e <= 0) continue; ctx.save(); if (th < 1) P.glow(ctx, fx, 1120, 260, '79,163,255', 0.35); jugador(ctx, fx, 1450 + (1 - e) * 120, (th < 1 ? 520 : 560) * (0.85 + 0.15 * e), t, { kid: true, thin: th, shirt: c, mood: th < 1 ? 'serio' : 'feliz', sock: th < 1 ? '#e8edf5' : '#aab3c2' }); ctx.restore(); }
  } else {
   // monitor de latidos: la línea salta, se acelera y se convierte en la trayectoria de un balón que entra en la red
   P.fondo(ctx, t); const fase = (tau) => faseLin(tau, 1.2, 3.4, 0.2, Math.max(0.5, Tk.g0e)), kick = win(t, Tk.g1, Tk.g1e - 0.25);
   porteria(ctx, 600, 1420, 360, 260, sm(Tk.g1e - 0.45, Tk.g1e - 0.15, t) * (1 - sm(Tk.g1e + 0.3, Tk.g1e + 1.2, t)), 0.55, 0.45);
   const m = monitor(ctx, 90, 640, 900, 380, t, fase, { end: lerp(966, 966, 0) });
   P.character(ctx, 'corazon', 200, 1240, 120, t, { mood: kick > 0 ? 'contento' : 'asustado', bounce: 1 + (t < Tk.g1 ? 2 : 0) });
   if (kick > 0) { const p0 = [966, m.y], p1 = [1010, 760], p2 = [800, 1290], q = E.inOut(kick), bez = (u) => [(1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
    ctx.save(); ctx.strokeStyle = ECG; ctx.lineWidth = 6; ctx.shadowColor = ECG; ctx.shadowBlur = 16; ctx.setLineDash([16, 14]); ctx.beginPath(); for (let k = 0; k <= 30; k++) { const pp = bez(q * k / 30); k ? ctx.lineTo(...pp) : ctx.moveTo(...pp); } ctx.stroke(); ctx.restore();
    const b2 = bez(q); balon(ctx, b2[0], b2[1], 40, t * 14); }
  }
 }, sfx(k) {
  if (GANCHO === 'A') { k.play('blip', 0.05, { gain: 0.3 }); k.play('pop', Tk.g0e - 0.25, { f: 300, gain: 0.5 }); k.play('thud', Tk.g1 + 0.2, { f: 110, gain: 0.5 }); k.play('swish', Tk.g1e - 0.5, { gain: 0.5 }); k.noise(Tk.g1e - 0.3, { dur: 1.3, color: 'pink', filter: 'lowpass', f: 1400, gain: 0.05, a: 0.1 }); }
  else if (GANCHO === 'B') { FX.contador(k, 0, Math.max(0.6, Tk.g0e), 0, 985); for (let i = 0; i < 4; i++) FX.aparece(k, Tk.g1 + i * 0.12, 480 + i * 60); }
  else { FX.latido(k, 0.05, 3, 0.7); FX.latido(k, 2.1, 3, 0.35, 0.8); k.play('thud', Tk.g1, { f: 110, gain: 0.5 }); k.play('swish', Tk.g1e - 0.45, { gain: 0.5 }); k.noise(Tk.g1e - 0.25, { dur: 1.3, color: 'pink', filter: 'lowpass', f: 1400, gain: 0.05, a: 0.1 }); }
 } });

 // ---------- 2 · Madeira: lloraba si perdía · si no le pasaban el balón ----------
 B.push({ t0: B0.b2, t1: B0.b4, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  atardecer(ctx, t); const pase = win(t, Tk.balon - 0.6, Tk.balon + 0.6), bx = lerp(620, 940, E.inOut(pase)), by = 1360 - Math.sin(Math.PI * pase) * 120;
  jugador(ctx, 700, 1400, 560, t, { kid: true, thin: 1.3, shirt: '#8a93a6', mood: 'feliz', pose: pase > 0 && pase < 1 ? 'run' : 'stand', sock: '#aab3c2' });
  jugador(ctx, 960, 1380, 520, t, { kid: true, thin: 1.25, shirt: '#8a93a6', mood: 'feliz', sock: '#aab3c2' }); balon(ctx, bx, by, 26, t * 8);
  jugador(ctx, 290, 1440, 820, t, { kid: true, thin: 0.75, shirt: '#3d7fd9', mood: 'llora', tears: sm(Tk.perdia - 0.4, Tk.perdia, t), pose: 'cry' });
  P.tag(ctx, 'MADEIRA', 290, 1500 - 60, t, S(2) + 0.2, Tk.balon - 0.3, { mono: true });
 }, sfx(k) { FX.etiqueta(k, S(2) + 0.2); k.play('blip', Tk.perdia, { gain: 0.25 }); k.play('thud', Tk.balon - 0.6, { f: 130, gain: 0.35 }); k.play('thud', Tk.balon + 0.6, { f: 120, gain: 0.3 }); } });

 // ---------- 3 · Y no era debilidad… era rabia (las lágrimas se evaporan, la mirada arde) ----------
 B.push({ t0: B0.b4, t1: Tk.doce - 0.1, in: { type: 'zoom', d: 0.4, x: 300, y: 900 }, draw(ctx, t) {
  P.fondo(ctx, t); const rb = sm(Tk.rabia - 0.15, Tk.rabia + 0.25, t), seca = sm(S(5) - 0.35, Tk.rabia + 0.1, t);
  P.glow(ctx, 540, 1000, 620, rb > 0 ? '255,93,60' : '120,160,255', 0.25 + 0.25 * rb);
  if (rb > 0) { const Rr = H.rng(12); for (let k = 0; k < 40; k++) { const q = (t * 0.6 + Rr()) % 1, xx = 200 + Rr() * 680; ctx.fillStyle = `rgba(255,${120 + Rr() * 100 | 0},60,${rb * (1 - q) * 0.8})`; ctx.beginPath(); ctx.arc(xx + Math.sin(t * 3 + k) * 20, 1500 - q * 900, 4 + Rr() * 8, 0, TAU); ctx.fill(); } }
  jugador(ctx, 540, 1800, 1180, t, { kid: true, thin: 0.8, shirt: '#3d7fd9', mood: seca > 0.5 ? 'rabia' : 'llora', tears: 1 - seca, vapor: seca * (1 - sm(Tk.rabia + 0.4, Tk.rabia + 0.9, t)), fuego: rb, pose: rb > 0.05 ? 'puños' : 'stand', tension: rb });
 }, sfx(k) { k.play('whoosh', Tk.debil, { dur: 0.5, gain: 0.3, minor: true }); k.noise(S(5) - 0.35, { dur: 0.6, color: 'white', filter: 'highpass', f: 3000, gain: 0.03, a: 0.2, minor: true }); k.noise(Tk.rabia - 0.1, { dur: 1.4, color: 'brown', filter: 'lowpass', f: [[0, 300], [0.6, 1400], [1.4, 500]], gain: 0.12, a: 0.2 }); k.play('thud', Tk.rabia, { f: 70, gain: 0.5 }); } });

 // ---------- 4 · A los 12, de Madeira a Lisboa, sin su familia ----------
 const MAD = [250, 1300], LIS = [770, 860];
 const mapa = (ctx, t) => { const g = ctx.createLinearGradient(0, 600, 0, HH); g.addColorStop(0, '#0b2140'); g.addColorStop(1, '#06111f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); P.bokeh(ctx, t, { n: 10, a: 0.08 });
  ctx.fillStyle = '#2a3348'; ctx.strokeStyle = '#4f5d7a'; ctx.lineWidth = 3; ctx.beginPath(); [[700, 620], [1080, 600], [1080, 1290], [830, 1260], [790, 1190], [770, 1080], [742, 960], [752, 890], [716, 830], [694, 720]].forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(150,170,210,0.35)'; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(880, 620); ctx.lineTo(860, 760); ctx.lineTo(900, 900); ctx.lineTo(880, 1060); ctx.lineTo(905, 1265); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#3a4560'; ctx.beginPath(); ctx.ellipse(MAD[0], MAD[1], 62, 22, -0.15, 0, TAU); ctx.fill(); ctx.stroke();
  for (const [p, c] of [[MAD, '255,93,115'], [LIS, '255,200,69']]) { P.glow(ctx, p[0], p[1], 70, c, 0.6); ctx.fillStyle = `rgb(${c})`; ctx.beginPath(); ctx.arc(p[0], p[1], 12, 0, TAU); ctx.fill(); } };
 B.push({ t0: Tk.doce - 0.1, t1: B0.b7, in: { type: 'iris', d: 0.35, x: 540, y: 1000 }, draw(ctx, t) {
  mapa(ctx, t); const fl = E.inOut(win(t, Tk.doce + 0.2, Tk.lisboa + 0.2)), c = [520, 820], bz = (u) => [(1 - u) ** 2 * MAD[0] + 2 * (1 - u) * u * c[0] + u * u * LIS[0], (1 - u) ** 2 * MAD[1] + 2 * (1 - u) * u * c[1] + u * u * LIS[1]];
  ctx.save(); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.setLineDash([18, 14]); ctx.beginPath(); for (let k = 0; k <= 40; k++) { const p = bz(fl * k / 40); k ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); ctx.restore();
  const p = bz(fl), p2 = bz(Math.min(1, fl + 0.02)); ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(Math.atan2(p2[1] - p[1], p2[0] - p[0]) + Math.PI / 4); P.icon(ctx, 'avion', 0, 0, 120, { mode: 'flat', col: '#ffffff' }); ctx.restore();
  P.statBig(ctx, '12', 300, 760, t, Tk.doce - 0.1, Tk.familia - 0.1, { px: 150, sub: 'AÑOS', col: GOLD });
  P.tag(ctx, 'MADEIRA', MAD[0], MAD[1] + 90, t, Tk.doce + 0.1, B0.b7, { mono: true }); P.tag(ctx, 'LISBOA', LIS[0] - 40, LIS[1] + 110, t, Tk.lisboa, B0.b7, { mono: true, col: GOLD });
  const fam = sm(Tk.familia - 0.3, Tk.familia, t); if (fam > 0) { ctx.save(); ctx.globalAlpha *= fam; for (let k = 0; k < 3; k++) P.avatar(ctx, 150 + k * 110, 1090, 46, 40 + k, { bg: '#2a3348' }); ctx.strokeStyle = '#ff5d73'; ctx.lineWidth = 12; ctx.lineCap = 'round'; const x2 = win(t, Tk.familia, Tk.familia + 0.3); ctx.beginPath(); ctx.moveTo(90, 1040); ctx.lineTo(lerp(90, 430, x2), lerp(1040, 1140, x2)); ctx.stroke(); ctx.restore(); }
 }, sfx(k) { k.play('whoosh', Tk.doce + 0.2, { dur: 1.4, gain: 0.35, minor: true }); FX.aparece(k, Tk.doce - 0.1, 620); FX.etiqueta(k, Tk.lisboa); FX.tachado(k, Tk.familia); } });

 // ---------- 5 · Lloró muchos días… pero no volvió ----------
 B.push({ t0: B0.b7, t1: B0.b9, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  P.fondo(ctx, t, null, { c0: '#0d1430', c1: '#05060f' });
  // ventana con lluvia nocturna
  ctx.fillStyle = '#0f2346'; ctx.strokeStyle = '#3a4a6e'; ctx.lineWidth = 14; ctx.beginPath(); ctx.roundRect(560, 640, 380, 480, 16); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(750, 640); ctx.lineTo(750, 1120); ctx.moveTo(560, 880); ctx.lineTo(940, 880); ctx.stroke();
  P.icon(ctx, 'luna', 850, 730, 90, { mode: 'flat', col: '#f4e7b0' }); const Rr = H.rng(4); ctx.strokeStyle = 'rgba(160,200,255,0.5)'; ctx.lineWidth = 3; for (let k = 0; k < 40; k++) { const q = (t * 1.6 + Rr()) % 1, xx = 575 + Rr() * 350; ctx.beginPath(); ctx.moveTo(xx, 650 + q * 460); ctx.lineTo(xx - 6, 680 + q * 460); ctx.stroke(); }
  // calendario que pasa hojas
  calendario(ctx, 120, 660, 260, 250, t, Tk.lloro, Tk.dias + 0.6);
  // maleta y niño
  ctx.fillStyle = '#6b3f22'; ctx.beginPath(); ctx.roundRect(200, 1240, 200, 170, 14); ctx.fill(); ctx.fillStyle = '#4a2a15'; ctx.fillRect(270, 1215, 60, 28); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(300, 1414, 120, 14, 0, 0, TAU); ctx.fill();
  const no = sm(Tk.pero - 0.1, Tk.pero + 0.3, t); jugador(ctx, 600, 1420, 760, t, { kid: true, thin: 0.75, shirt: '#3d7fd9', mood: no > 0.5 ? 'rabia' : 'llora', tears: 1 - no, pose: 'stand' });
  if (no > 0) { ctx.save(); ctx.globalAlpha *= no; ctx.fillStyle = 'rgba(10,14,30,0.75)'; ctx.beginPath(); ctx.roundRect(100, 980, 300, 150, 20); ctx.fill(); P.icon(ctx, 'avion', 150, 1055, 80, { mode: 'flat', col: '#c9d3e6' }); txt(ctx, 'MADEIRA', 296, 1055, 34, '#c9d3e6', { w: 800 }); const x2 = win(t, Tk.volvio - 0.2, Tk.volvio + 0.1); ctx.strokeStyle = '#ff5d73'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(120, 995); ctx.lineTo(lerp(120, 380, x2), lerp(995, 1115, x2)); if (x2 > 0.5) { ctx.moveTo(380, 995); ctx.lineTo(lerp(380, 120, (x2 - 0.5) * 2), lerp(995, 1115, (x2 - 0.5) * 2)); } ctx.stroke(); ctx.restore(); }
 }, sfx(k) { k.noise(B0.b7, { dur: 2.5, color: 'pink', filter: 'bandpass', f: 3000, q: 0.7, gain: 0.03, a: 0.4 }); FX.pasarPagina(k, Tk.lloro + 0.2); FX.pasarPagina(k, Tk.dias); FX.aparece(k, Tk.pero, 420); FX.tachado(k, Tk.volvio - 0.2); } });

 // ---------- 6 · el más flaco → se escapaba al gimnasio a hacer pesas ----------
 B.push({ t0: B0.b9, t1: B0.b10, in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  const gym = sm(Tk.gimnasio - 0.12, Tk.gimnasio + 0.02, t);
  if (gym < 1) { ctx.save(); P.fondo(ctx, t); const fila = [[175, 1.3], [385, 1.35], [590, 0.62], [810, 1.3]]; for (const [i, [fx, th]] of fila.entries()) { if (th < 1) P.glow(ctx, fx, 1100, 260, '79,163,255', 0.35); jugador(ctx, fx, 1440, th < 1 ? 620 : 680, t, { kid: true, thin: th, shirt: th < 1 ? '#3d7fd9' : '#6a7385', mood: th < 1 ? 'serio' : 'feliz', sock: th < 1 ? '#e8edf5' : '#aab3c2' }); }
   P.tag(ctx, 'EL MÁS FLACO', 590, 700, t, Tk.flaco - 0.2, Tk.gimnasio - 0.12, { mono: true, to: [[590, 780]] }); ctx.restore(); }
  if (gym > 0) { ctx.save(); ctx.globalAlpha *= gym; ctx.fillStyle = '#0b0d16'; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 640, 520, '255,240,200', 0.18);
   ctx.fillStyle = '#121a33'; ctx.beginPath(); ctx.roundRect(640, 640, 280, 240, 14); ctx.fill(); P.icon(ctx, 'luna', 780, 740, 90, { mode: 'flat', col: '#f4e7b0' });
   ctx.fillStyle = '#2a2f3d'; ctx.fillRect(0, 1430, W, HH - 1430); ctx.fillStyle = '#3a4152'; for (let k = 0; k < 9; k++) ctx.fillRect(k * 130, 1430, 120, 12);
   jugador(ctx, 470, 1430, 780, t, { kid: true, thin: 0.72, shirt: '#3d7fd9', mood: 'rabia', pose: 'lift', repT0: Tk.gimnasio }); ctx.restore(); }
 }, sfx(k) { for (let i = 0; i < 4; i++) FX.aparece(k, B0.b9 + 0.1 + i * 0.1, 460 + i * 50); FX.etiqueta(k, Tk.flaco - 0.2); k.play('whoosh', Tk.gimnasio - 0.15, { dur: 0.3, gain: 0.3, minor: true }); FX.metal(k, Tk.gimnasio); k.play('thud', Tk.gimnasio + 0.02, { f: 120, gain: 0.35 }); FX.metal(k, Tk.pesas + 0.4); } });

 // ---------- 7 · A los 15, el corazón se dispara: taquicardia ----------
 const faseCor = (tau) => faseLin(tau, 1.2, 3.6, Tk.corazon, Tk.rapido + 0.2);
 B.push({ t0: B0.b10, t1: B0.b12, in: { type: 'zoom', d: 0.4, x: 540, y: 1000 }, draw(ctx, t) {
  P.fondo(ctx, t, null, { c0: '#2a0b1c', c1: '#090510' }); const rate = t < Tk.corazon ? 1.2 : lerp(1.2, 3.6, win(t, Tk.corazon, Tk.rapido + 0.2)), beat = Math.pow(Math.max(0, Math.sin(faseCor(t) * TAU)), 6);
  P.glow(ctx, 540, 930, 420 + 60 * beat, '255,60,90', 0.25 + 0.25 * beat);
  P.character(ctx, 'corazon', 540, 930, 230 * (1 + 0.08 * beat), t, { mood: rate > 2.2 ? 'asustado' : 'serio', bounce: 0 });
  monitor(ctx, 90, 1180, 900, 250, t, faseCor);
  P.statBig(ctx, '15', 840, 700, t, Tk.quince - 0.1, Tk.corazon + 0.6, { px: 130, sub: 'AÑOS', col: GOLD });
  P.tag(ctx, 'TAQUICARDIA', 540, 1250 - 110, t, Tk.taqui - 0.05, B0.b12, { mono: true, col: '#ff5d73' });
 }, sfx(k) { FX.aparece(k, Tk.quince - 0.1, 640); let tt = B0.b10 + 0.1; while (tt < B0.b12) { k.play('thud', tt, { f: 62, gain: 0.42 }); k.play('thud', tt + 0.16, { f: 54, gain: 0.28, minor: true }); const r = tt < Tk.corazon ? 1.2 : lerp(1.2, 3.6, win(tt, Tk.corazon, Tk.rapido + 0.2)); tt += 1 / r; } FX.etiqueta(k, Tk.taqui - 0.05); k.play('tick', Tk.taqui, { gain: 0.2 }); } });

 // ---------- 8 · láser por la mañana → en casa por la tarde → a los pocos días, a entrenar ----------
 const faseOp = (tau) => faseLin(tau, 3.4, 1.2, Tk.laser, Tk.manana + 0.6);
 B.push({ t0: B0.b12, t1: B0.b15, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const ent = sm(Tk.pocos - 0.3, Tk.pocos, t);
  if (ent < 1) { ctx.save(); P.fondo(ctx, t, null, { c0: '#0b1a33', c1: '#05060f' });
   // el sol cruza el cielo: mañana → tarde
   const su = E.inOut(win(t, S(12), Tk.casa)), sa = Math.PI * (0.92 - 0.84 * su), sx = 540 + Math.cos(sa) * 400, sy = 1000 - Math.sin(sa) * 330;
   ctx.strokeStyle = 'rgba(255,200,69,0.25)'; ctx.lineWidth = 4; ctx.setLineDash([10, 12]); ctx.beginPath(); ctx.arc(540, 1000, 400, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke(); ctx.setLineDash([]);
   P.glow(ctx, sx, sy, 160, '255,200,69', 0.5); P.icon(ctx, 'sol', sx, sy, 110, { mode: 'flat', col: GOLD });
   const ca = sm(Tk.casa - 0.4, Tk.casa, t), calm = sm(Tk.laser, Tk.manana + 0.6, t);
   P.character(ctx, 'corazon', lerp(540, 330, ca), 1050, lerp(190, 120, ca), t, { mood: calm > 0.6 ? 'feliz' : 'asustado', bounce: 0.6 });
   const lz = win(t, Tk.laser - 0.1, Tk.manana + 0.5); if (lz > 0 && lz < 1) { const f2 = Math.sin(Math.PI * lz); ctx.save(); ctx.strokeStyle = `rgba(255,70,90,${0.9 * f2})`; ctx.lineWidth = 8; ctx.shadowColor = '#ff465a'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.moveTo(1000, 640); ctx.lineTo(560, 1040); ctx.stroke(); ctx.restore(); P.glow(ctx, 560, 1040, 90, '255,120,140', 0.8 * f2); ctx.fillStyle = '#c9d3e6'; ctx.beginPath(); ctx.roundRect(950, 600, 110, 70, 14); ctx.fill(); }
   if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; P.icon(ctx, 'casa', 720, 1110, 330, { mode: 'flat', col: '#e9edf5' }); ctx.restore(); }
   monitor(ctx, 120, 1260, 840, 170, t, faseOp, {}); P.tag(ctx, 'LÁSER', 780, 720, t, Tk.laser, Tk.manana + 0.4, { mono: true, col: '#ff8a9a' });
   ctx.restore(); }
  if (ent > 0) { ctx.save(); ctx.globalAlpha *= ent; estadio(ctx, t); const rx = lerp(160, 900, win(t, Tk.pocos, B0.b15 + 0.6)); jugador(ctx, rx, 1460, 700, t, { kid: true, thin: 0.85, shirt: '#3d7fd9', mood: 'feliz', pose: 'run' }); balon(ctx, rx + 120, 1440, 34, t * 10);
   calendario(ctx, 110, 640, 220, 200, t, Tk.pocos - 0.2, Tk.entrenar); ctx.restore(); }
 }, sfx(k) { k.play('riser', Tk.laser - 0.4, { dur: 0.5, gain: 0.25, minor: true }); FX.chispa(k, Tk.laser, 0.8); FX.etiqueta(k, Tk.laser); FX.correcto(k, Tk.manana + 0.4); FX.aparece(k, Tk.casa - 0.3, 520); FX.pasarPagina(k, Tk.pocos); FX.pasos ? FX.pasos(k, Tk.pocos + 0.3, 2) : null; } });

 // ---------- 9 · No es un truco: es una alcancía ----------
 B.push({ t0: B0.b15, t1: B0.b17, in: { type: 'iris', d: 0.4, x: 540, y: 1000 }, draw(ctx, t) {
  P.fondo(ctx, t); const ap = sm(Tk.alcancia - 0.52, Tk.alcancia - 0.25, t), ha = 1 - sm(Tk.alcancia - 0.78, Tk.alcancia - 0.55, t);
  if (ha > 0) { ctx.save(); ctx.globalAlpha *= ha; ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(540, 1260, 300, 60, 0, 0, TAU); ctx.fill(); ctx.fillRect(330, 900, 420, 360); ctx.fillStyle = RED; ctx.fillRect(330, 1180, 420, 50); ctx.beginPath(); ctx.ellipse(540, 900, 210, 40, 0, 0, TAU); ctx.fillStyle = '#1d1d22'; ctx.fill();
   ctx.save(); ctx.translate(800, 980); ctx.rotate(-0.6 + Math.sin(t * 4) * 0.1); ctx.fillStyle = '#111'; ctx.fillRect(-14, -220, 28, 260); ctx.fillStyle = '#fff'; ctx.fillRect(-14, -220, 28, 50); ctx.restore();
   const Rr = H.rng(3); for (let k = 0; k < 14; k++) { const q = (t * 0.8 + Rr()) % 1; ctx.fillStyle = `rgba(255,220,120,${1 - q})`; ctx.beginPath(); ctx.arc(540 + (Rr() - 0.5) * 500, 880 - q * 260, 6, 0, TAU); ctx.fill(); }
   const x2 = win(t, Tk.truco - 0.1, Tk.truco + 0.25); if (x2 > 0) { ctx.strokeStyle = '#ff5d73'; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(300, 760); ctx.lineTo(lerp(300, 800, x2), lerp(760, 1320, x2)); if (x2 > 0.5) { ctx.moveTo(800, 760); ctx.lineTo(lerp(800, 300, (x2 - 0.5) * 2), lerp(760, 1320, (x2 - 0.5) * 2)); } ctx.stroke(); } ctx.restore(); }
  if (ap > 0) { P.glow(ctx, 540, 1060, 520, '255,200,69', 0.3 * ap); alcancia(ctx, 540, 1080, 290, t, { e: E.back ? E.back(ap) : E.out(ap) }); P.tag(ctx, 'ALCANCÍA', 540, 1460 - 40, t, Tk.alcancia + 0.2, B0.b17, { mono: true, col: GOLD }); }
 }, sfx(k) { k.play('sparkle', B0.b15 + 0.1, { gain: 0.25, minor: true }); FX.tachado(k, Tk.truco - 0.1); FX.revelar(k, Tk.alcancia - 0.45); FX.etiqueta(k, Tk.alcancia + 0.2); } });

 // ---------- 10 · Cada día mete una moneda: entrenamiento extra, comida limpia, noche de sueño ----------
 const MON = [[Tk.moneda, null, null], [Tk.entreno, 'musculo', 'ENTRENAMIENTO'], [Tk.comida, 'hoja', 'COMIDA LIMPIA'], [Tk.noche, 'luna', 'SUEÑO']];
 B.push({ t0: B0.b17, t1: B0.b19, in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  P.fondo(ctx, t); const caidas = MON.filter((m) => t > m[0] + 0.55).length; let hit = -9; for (const m of MON) if (t > m[0] + 0.55) hit = m[0] + 0.55;
  P.glow(ctx, 540, 1060, 520, '255,200,69', 0.12 + 0.07 * caidas); alcancia(ctx, 540, 1060, 260, t, { hit, fill: caidas / 4 });
  MON.forEach(([t0, ic, lb], i) => { const q = win(t, t0, t0 + 0.55); if (q <= 0 || q >= 1) return; moneda(ctx, 540 + 40, lerp(620, 850, E.in(q)), 70, ic, t * 6); });
  const cur = MON.slice(1).findIndex((m, i) => t >= m[0] && t < (MON[i + 2] ? MON[i + 2][0] : B0.b19)); if (cur >= 0) { const [t0, ic, lb] = MON[cur + 1], t1 = MON[cur + 2] ? MON[cur + 2][0] - 0.05 : B0.b19; P.tag(ctx, lb, 540, 1390, t, t0, t1, { mono: true, col: GOLD, px: 72 }); }
  for (let k = 0; k < caidas; k++) moneda(ctx, 180 + k * 90, 720, 34, null, 0);
 }, sfx(k) { for (const [t0] of MON) { k.play('whoosh', t0, { dur: 0.5, gain: 0.2, minor: true }); k.play('ding', t0 + 0.55, { f: 'E6', gain: 0.25 }); k.play('tick', t0 + 0.6, { gain: 0.3 }); } } });

 // ---------- 11 · Duerme por ciclos de 90 minutos, unos cinco al día ----------
 B.push({ t0: B0.b19, t1: B0.b20, in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  P.fondo(ctx, t, null, { c0: '#0d1438', c1: '#04050d' }); const cx = 540, cy = 1030, Rr = 330, ap = R(S(19), S(19) + 0.5, t);
  ctx.save(); ctx.globalAlpha *= ap; ctx.strokeStyle = 'rgba(200,215,255,0.18)'; ctx.lineWidth = 46; ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, TAU); ctx.stroke();
  for (let h = 0; h < 24; h++) { const a = h / 24 * TAU - Math.PI / 2; ctx.strokeStyle = 'rgba(220,230,255,0.5)'; ctx.lineWidth = h % 6 ? 3 : 6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (Rr - 40), cy + Math.sin(a) * (Rr - 40)); ctx.lineTo(cx + Math.cos(a) * (Rr - (h % 6 ? 58 : 70)), cy + Math.sin(a) * (Rr - (h % 6 ? 58 : 70))); ctx.stroke(); }
  // 5 ciclos de 90 min: 4 seguidos de noche + 1 siesta (esquema del método de ciclos)
  const C = [23, 24.5, 26, 27.5, 14.5], nOn = Math.min(5, Math.floor(lerp(0, 5.99, win(t, Tk.noventa - 0.2, Tk.cinco + 0.2))));
  C.forEach((h0, i) => { const on = i < nOn, a0 = h0 / 24 * TAU - Math.PI / 2 + 0.02, a1 = (h0 + 1.5) / 24 * TAU - Math.PI / 2 - 0.02; ctx.strokeStyle = on ? '#9b8cff' : 'rgba(155,140,255,0.15)'; ctx.lineWidth = 46; ctx.lineCap = 'butt'; if (on) { ctx.shadowColor = '#9b8cff'; ctx.shadowBlur = 24; } ctx.beginPath(); ctx.arc(cx, cy, Rr, a0, a1); ctx.stroke(); ctx.shadowBlur = 0; });
  ctx.restore(); P.icon(ctx, 'luna', cx, cy - 120, 110, { mode: 'flat', col: '#f4e7b0' });
  P.statBig(ctx, '90 min', cx, cy + 40, t, Tk.noventa - 0.2, Tk.cinco - 0.1, { px: 96, col: '#c9c1ff' }); P.statBig(ctx, '× 5', cx, cy + 40, t, Tk.cinco - 0.05, B0.b20, { px: 130, sub: 'AL DÍA', col: GOLD });
  P.tag(ctx, 'CICLOS', cx, 640, t, Tk.ciclos - 0.1, B0.b20 - 0.4, { mono: true, col: '#c9c1ff' }); P.ykRecon(ctx, t, S(19) + 0.3, S(19) + 2.4, { s: 'ESQUEMA', y: 1420 });
 }, sfx(k) { FX.etiqueta(k, Tk.ciclos - 0.1); for (let i = 0; i < 5; i++) k.play('blip', Tk.noventa - 0.2 + i * (Tk.cinco + 0.4 - Tk.noventa) / 5, { gain: 0.25, f: 520 + i * 60 }); FX.aparece(k, Tk.cinco - 0.05, 700); } });

 // ---------- 12 · Con 41 años sigue marcando · 985 goles oficiales («Siuuu») ----------
 B.push({ t0: B0.b20, t1: Tk.talento - 0.25, in: { type: 'zoom', d: 0.45, x: 540, y: 1000 }, draw(ctx, t) {
  estadio(ctx, t, { crowd: true }); const u = win(t, Tk.marcando - 0.7, Tk.marcando);
  P.glow(ctx, 540, 1100, 560, '255,200,69', 0.12 + 0.3 * sm(Tk.marcando - 0.1, Tk.marcando + 0.4, t));
  if (t > Tk.marcando) { const q = win(t, Tk.marcando, Tk.marcando + 0.8); ctx.save(); ctx.strokeStyle = `rgba(255,220,120,${0.6 * (1 - q)})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(540, 1470, 120 + 520 * q, 30 + 120 * q, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
  jugador(ctx, 540, 1470, 760, t, { num: '7', mood: t > Tk.marcando - 0.1 ? 'grita' : 'serio', pose: t > Tk.marcando - 0.7 ? 'siuu' : 'stand', u });
  P.hud(ctx, t, [{ label: 'Edad', from: 15, to: 41, t0: Tk.anos41 - 0.3, t1: Tk.anos41 + 0.5, y: 700, valuePx: 100, a: sm(Tk.anos41 - 0.5, Tk.anos41 - 0.3, t) }, { label: 'Goles oficiales', from: 900, to: 985, t0: Tk.van - 0.2, t1: Tk.g985 + 0.8 * (Tk.goles - Tk.g985), x: 'right', hi: true, y: 700, valuePx: 100, a: sm(Tk.van - 0.4, Tk.van - 0.2, t) }]);
 }, sfx(k) { FX.contador(k, Tk.anos41 - 0.3, Tk.anos41 + 0.5, 15, 41); k.play('whoosh', Tk.marcando - 0.7, { dur: 0.6, gain: 0.35, minor: true }); k.play('thud', Tk.marcando, { f: 80, gain: 0.55 }); k.noise(Tk.marcando, { dur: 2.2, color: 'pink', filter: 'lowpass', f: 1600, gain: 0.07, a: 0.15 }); FX.contador(k, Tk.van - 0.2, Tk.g985 + 0.8 * (Tk.goles - Tk.g985), 900, 985); } });

 // ---------- 13 · El talento te pone en el campo · la alcancía te mantiene 20 años ----------
 B.push({ t0: Tk.talento - 0.25, t1: B0.b24, in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  estadio(ctx, t); const st = R(Tk.talento - 0.2, Tk.campo, t), al = sm(Tk.alc2 - 0.3, Tk.alc2, t);
  const sa = 1 - al; if (sa > 0) { ctx.save(); ctx.globalAlpha *= sa; P.glow(ctx, 790, 800, 230, '255,212,71', 0.45); P.icon(ctx, 'estrella', 790, 800, 230, { mode: 'flat', col: GOLD }); ctx.strokeStyle = 'rgba(255,212,71,0.6)'; ctx.lineWidth = 6; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.moveTo(720, 880); ctx.quadraticCurveTo(560, 900, lerp(560, 470, st), 1000); ctx.stroke(); ctx.restore(); }
  jugador(ctx, lerp(400, 300, al), 1450, lerp(560 + 180 * st, 600, al), t, { num: '7', mood: 'feliz', pose: 'stand' });
  if (al > 0) { alcancia(ctx, 720, 1180, 230 * E.out(al), t, { fill: 1 }); }
  P.statBig(ctx, '20', 760, 760, t, Tk.veinte - 0.15, B0.b24, { px: 140, sub: 'AÑOS', col: GOLD });
 }, sfx(k) { FX.personaje(k, Tk.talento); FX.revelar(k, Tk.alc2 - 0.35); FX.aparece(k, Tk.veinte - 0.15, 720); } });

 // ---------- 14 · CIERRE: «Envíaselo a ese amigo…» ----------
 B.push({ t0: B0.b24, t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  P.fondo(ctx, t); P.ctaShare(ctx, t, B0.b24 + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { estadio(cc, t, { crowd: true }); jugador(cc, 540, 1470, 760, t, { num: '7', mood: 'grita', pose: 'siuu', u: 1 }); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'] });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, B0.b24 + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'noche', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['llorón…', 'goles…', 'corazón', 'perdía.', 'balón,', 'rabia.', 'Lisboa,', 'volvió.', 'pesas.', 'rápido.', 'Taquicardia.', 'láser', 'casa.', 'entrenar.', 'truco.', 'alcancía.', 'moneda:', 'sueño.', 'ciclos', 'marcando.', '985', 'campo.', 'alcancía', 'amigo'],
  capIcons: { corazón: 'corazon', sueño: 'luna' },
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 500, gain: 0.006, a: 0.05, hold: DURATION - 2.2 }); },
  music(k) { MUS.epica(k, 0, DURATION, { bpm: 84, gain: 0.55, drums: 0.35, ostinato: 0.4, chords: [['A1', 'E2', 'A2', 'C3'], ['F1', 'C2', 'F2', 'A2'], ['C2', 'G2', 'C3', 'E3'], ['G1', 'D2', 'G2', 'B2']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
