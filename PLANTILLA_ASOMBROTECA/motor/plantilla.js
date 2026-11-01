// =====================================================================================================
// PLANTILLA ASOMBROTECA · motor universal de explainers verticales (1080x1920, 30 fps, voz original)
// ------------------------------------------------------------------------------------------------------
// Un episodio = voz + alineación (window.ALIGN) + una lista de BEATS. Cada beat dibuja su escena en función de t
// y declara sus sonidos. El motor pone: transiciones entre beats, subtítulos «palabra a palabra» con la palabra
// clave seleccionada, piel visual (plana o oscura-técnica), acabado, y genera scoreSound/scoreMusic.
// Todo es función pura de t (H.rng / H.makeNoise; nunca Math.random) => window.seek(t) en cualquier orden.
// Requiere: lib/harness.js (H) y lib/sound.js (SOUND) sin modificar.
// =====================================================================================================
(function () {
 const W = 1080, HH = 1920, TAU = Math.PI * 2;
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
 const sm = (a, b, x) => H.smooth(a, b, x);
 const E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));

 // ---------------- PIELES ----------------
 // Una piel define colores semánticos, tipografías y el acabado. Los bloques sólo usan nombres semánticos.
 const SKINS = {
  plana: {
   name: 'plana',
   c: { ink: '#1d1b3a', ink2: '#3b3866', paper: '#ffffff', mute: '#c9c6e3', accent: '#f0b90b', red: '#e8505b', green: '#2fbf71', blue: '#3fa9f5', teal: '#25b8a8', pink: '#f28fae', violet: '#7a6cf0', orange: '#ff9f43', shadow: 'rgba(15,10,40,0.22)', handle: '#f0b90b' },
   font: { cap: 'Nunito', capW: 800, capDim: 700, title: 'Fredoka', titleW: 700, label: 'Nunito', labelW: 900, mono: 'Nunito' },
   rim: null, grain: 0.022, vignette: 0.28, vigCol: '10,8,30',
  },
  oscura: {
   name: 'oscura',
   c: { ink: '#0b0c10', ink2: '#1b1d25', paper: '#f4f1e8', mute: '#7d7a70', accent: '#f2b84b', red: '#ff6b57', green: '#5fd38d', blue: '#5aa9ff', teal: '#3fd6c6', pink: '#ff8fb1', violet: '#9b8cff', orange: '#ffb057', shadow: 'rgba(0,0,0,0.5)', handle: '#f2b84b' },
   font: { cap: 'Space Grotesk', capW: 700, capDim: 400, title: 'Space Grotesk', titleW: 700, label: 'IBM Plex Mono', labelW: 600, mono: 'IBM Plex Mono' },
   rim: '#f2b84b', grain: 0.05, vignette: 0.55, vigCol: '0,0,0',
   // la piel oscura: fondo casi negro, acentos vivos, blancos en papel cálido, borde dorado fino y grano (look «editor técnico»)
   // colores saturados se mantienen vivos (acentos sobre negro); blancos → papel cálido; neutros medios → gris carbón
   tone: (hex) => { const [r, g, b] = H.hex(hex), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (r + g + b) / 3; if (mx - mn < 40) return l > 180 ? '#ece7da' : H.rgba([l * 0.55 + 10, l * 0.55 + 12, l * 0.55 + 16]); return H.rgba([r * 0.92, g * 0.92, b * 0.92]); },
  },
 };
 let SK = SKINS.plana;
 const col = (name) => SK.c[name] || name;
 const fill = (c) => (SK.tone && c[0] === '#' ? SK.tone(c) : c);

 // ---------------- PRIMITIVAS PLANAS ----------------
 const P = {};
 P.rr = (ctx, x, y, w, h, r, c, o = {}) => {
  ctx.save();
  if (o.shadow !== false) { ctx.fillStyle = col('shadow'); ctx.beginPath(); ctx.roundRect(x + (o.sx ?? 0), y + (o.sy ?? 12), w, h, r); ctx.fill(); }
  ctx.fillStyle = fill(c); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
  if (SK.rim && o.rim !== false) { ctx.strokeStyle = SK.rim; ctx.globalAlpha *= 0.7; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
 };
 P.circle = (ctx, x, y, r, c, o = {}) => {
  ctx.save();
  if (o.shadow) { ctx.fillStyle = col('shadow'); ctx.beginPath(); ctx.arc(x, y + 10, r, 0, TAU); ctx.fill(); }
  ctx.fillStyle = fill(c); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  if (SK.rim && o.rim !== false) { ctx.strokeStyle = SK.rim; ctx.lineWidth = 2; ctx.globalAlpha *= 0.7; ctx.stroke(); }
  ctx.restore();
 };
 P.poly = (ctx, pts, c, o = {}) => {
  ctx.save(); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  ctx.fillStyle = fill(c); ctx.fill();
  if (SK.rim && o.rim) { ctx.strokeStyle = SK.rim; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
 };
 P.font = (kind, px) => { const f = SK.font; return kind === 'title' ? `${f.titleW} ${px}px "${f.title}"` : kind === 'mono' ? `${f.labelW} ${px}px "${f.mono}"` : `${f.labelW} ${px}px "${f.label}"`; };
 // texto con contorno grueso (estilo «6 METROS»/onomatopeya)
 P.bigText = (ctx, s, x, y, px, c, o = {}) => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); const sc = o.scale ?? 1; ctx.scale(sc, sc);
  ctx.font = P.font(o.kind || 'title', px); ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  if (o.stroke !== false) { ctx.strokeStyle = o.strokeCol || col('ink'); ctx.lineWidth = px * 0.16; ctx.strokeText(s, 0, 0); }
  ctx.fillStyle = c || col('paper'); ctx.fillText(s, 0, 0);
  ctx.restore();
 };
 P.text = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = P.font(o.kind || 'label', px); ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.globalAlpha *= o.a ?? 1; ctx.fillText(s, x, y); ctx.restore(); };
 P.tw = (ctx, s, font) => { ctx.save(); ctx.font = font; const w = ctx.measureText(s).width; ctx.restore(); return w; };
 // aparición con rebote (escala back-out), devuelve escala 0..~1.08..1
 P.popS = (t, t0, d = 0.32) => { const u = win(t, t0, t0 + d); return u <= 0 ? 0 : E.back(u); };
 P.withPop = (ctx, t, t0, x, y, fn, d) => { const s = P.popS(t, t0, d); if (s <= 0.001) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); fn(); ctx.restore(); };
 // flecha gruesa redondeada que se dibuja (p 0..1)
 P.arrow = (ctx, x0, y0, x1, y1, p, c, w = 22) => {
  if (p <= 0) return; const xe = lerp(x0, x1, p), ye = lerp(y0, y1, p), an = Math.atan2(y1 - y0, x1 - x0), hl = w * 1.6;
  ctx.save(); ctx.strokeStyle = fill(c); ctx.fillStyle = fill(c); ctx.lineCap = 'round'; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(xe - Math.cos(an) * hl * 0.6, ye - Math.sin(an) * hl * 0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xe + Math.cos(an) * hl * 0.25, ye + Math.sin(an) * hl * 0.25); ctx.lineTo(xe - Math.cos(an - 0.6) * hl, ye - Math.sin(an - 0.6) * hl); ctx.lineTo(xe - Math.cos(an + 0.6) * hl, ye - Math.sin(an + 0.6) * hl); ctx.closePath();
  ctx.lineJoin = 'round'; ctx.lineWidth = w * 0.35; ctx.fill(); ctx.stroke();
  ctx.restore();
 };
 // X roja con borde blanco (tachado) y ✓ verde
 P.cross = (ctx, x, y, s, p, c) => {
  if (p <= 0) return; const a = cl(p * 2), b = cl(p * 2 - 1);
  ctx.save(); ctx.lineCap = 'round';
  for (const [w, cc] of [[s * 0.34, col('paper')], [s * 0.2, c || col('red')]]) { ctx.strokeStyle = cc; ctx.lineWidth = w;
   ctx.beginPath(); ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x - s / 2 + s * a, y - s / 2 + s * a); ctx.stroke();
   if (b > 0) { ctx.beginPath(); ctx.moveTo(x + s / 2, y - s / 2); ctx.lineTo(x + s / 2 - s * b, y - s / 2 + s * b); ctx.stroke(); } }
  ctx.restore();
 };
 P.check = (ctx, x, y, s, p, c) => {
  if (p <= 0) return; const pts = [[x - s * 0.45, y], [x - s * 0.12, y + s * 0.32], [x + s * 0.5, y - s * 0.38]];
  const L1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), L2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]), d = p * (L1 + L2);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [w, cc] of [[s * 0.3, col('paper')], [s * 0.17, c || col('green')]]) { ctx.strokeStyle = cc; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(...pts[0]);
   if (d <= L1) ctx.lineTo(lerp(pts[0][0], pts[1][0], d / L1), lerp(pts[0][1], pts[1][1], d / L1)); else { ctx.lineTo(...pts[1]); ctx.lineTo(lerp(pts[1][0], pts[2][0], (d - L1) / L2), lerp(pts[1][1], pts[2][1], (d - L1) / L2)); } ctx.stroke(); }
  ctx.restore();
 };
 // bocadillo blanco con cola y un icono dibujado por callback
 P.bubble = (ctx, x, y, w, h, t, t0, icon, o = {}) => {
  P.withPop(ctx, t, t0, x + (o.tailX ?? -w * 0.3), y + h / 2 + 40, () => {
   ctx.save(); ctx.fillStyle = col('shadow'); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2 + 10, w, h, h * 0.35); ctx.fill();
   ctx.fillStyle = fill('#ffffff'); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h * 0.35); ctx.fill();
   const tx = x + (o.tailX ?? -w * 0.3); ctx.beginPath(); ctx.moveTo(tx - 26, y + h / 2 - 4); ctx.lineTo(tx - 34, y + h / 2 + 46); ctx.lineTo(tx + 22, y + h / 2 - 4); ctx.closePath(); ctx.fill();
   if (SK.rim) { ctx.strokeStyle = SK.rim; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h * 0.35); ctx.stroke(); }
   ctx.restore(); icon(x, y);
  });
 };
 // píldora con texto (etiqueta tipo «cada 1,5 - 2 h»)
 P.pill = (ctx, s, x, y, px, t, t0, o = {}) => {
  ctx.save(); ctx.font = P.font(o.kind || 'label', px); const w = ctx.measureText(s).width + px * 1.2, h = px * 1.6; ctx.restore();
  P.withPop(ctx, t, t0, x, y, () => { P.rr(ctx, x - w / 2, y - h / 2, w, h, h / 2, o.bg || '#ffffff', { sy: 8 }); P.text(ctx, s, x, y + 2, px, o.fg || col('ink'), { kind: o.kind }); }, 0.28);
  return w;
 };
 // onomatopeya (GRRR, BIP BIP…) con temblor
 P.onoma = (ctx, s, x, y, px, t, t0, t1, o = {}) => {
  const a = sm(t0, t0 + 0.08, t) * (1 - sm(t1 - 0.15, t1, t)); if (a <= 0) return;
  const sh = o.shake === false ? 0 : Math.sin(t * 60) * 4 * (1 - win(t, t0, t0 + 0.4));
  ctx.save(); ctx.globalAlpha = a; P.bigText(ctx, s, x + sh, y, px, o.c || col('paper'), { rot: o.rot ?? -0.12, scale: P.popS(t, t0, 0.25) || 0.001 }); ctx.restore();
 };
 // contador que rueda (enteros); devuelve el valor mostrado
 P.counter = (ctx, x, y, px, t, t0, t1, from, to, o = {}) => {
  const u = E.out(win(t, t0, t1)), v = Math.round(lerp(from, to, u));
  const s = (o.prefix || '') + (o.fmt ? o.fmt(v) : String(v)) + (o.suffix || '');
  P.withPop(ctx, t, t0 - 0.1, x, y, () => {
   if (o.box) { ctx.save(); ctx.font = P.font('title', px); const w = ctx.measureText(s).width + px * 0.7; ctx.restore(); P.rr(ctx, x - w / 2, y - px * 0.72, w, px * 1.44, px * 0.22, o.box, { sy: 12 }); }
   P.bigText(ctx, s, x, y, px, o.c || col('paper'), { stroke: !o.box });
  });
  return v;
 };
 // lupa: anillo dorado y contenido recortado (como mirar dentro de algo)
 P.lens = (ctx, x, y, r, s, draw) => {
  if (s <= 0.001) return; const R = r * s;
  ctx.save(); ctx.fillStyle = col('shadow'); ctx.beginPath(); ctx.arc(x, y + 14, R + 18, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.clip(); draw(); ctx.restore();
  ctx.save(); ctx.lineWidth = 22 * s; ctx.strokeStyle = fill('#d9a42b'); ctx.beginPath(); ctx.arc(x, y, R + 9 * s, 0, TAU); ctx.stroke();
  ctx.lineWidth = 6 * s; ctx.strokeStyle = fill('#f6d47a'); ctx.beginPath(); ctx.arc(x, y, R + 3 * s, -2.6, -1.2); ctx.stroke(); ctx.restore();
 };
 // manómetro cualitativo (sin cifras): la aguja va de verde a rojo
 P.gauge = (ctx, x, y, r, v, label) => {
  P.circle(ctx, x, y, r + 16, col('ink2'), { shadow: true }); P.circle(ctx, x, y, r, '#ffffff');
  const a0 = Math.PI * 0.8, a1 = Math.PI * 2.2;
  [['#2fbf71', 0, 0.45], ['#f0b90b', 0.45, 0.72], ['#e8505b', 0.72, 1]].forEach(([c, u0, u1]) => { ctx.save(); ctx.strokeStyle = fill(c); ctx.lineWidth = r * 0.16; ctx.beginPath(); ctx.arc(x, y, r * 0.78, lerp(a0, a1, u0), lerp(a0, a1, u1)); ctx.stroke(); ctx.restore(); });
  const an = lerp(a0, a1, cl(v)) + Math.sin(v * 80) * 0.01;
  ctx.save(); ctx.strokeStyle = fill(col('ink')); ctx.lineWidth = r * 0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an) * r * 0.7, y + Math.sin(an) * r * 0.7); ctx.stroke(); ctx.restore();
  P.circle(ctx, x, y, r * 0.1, col('ink'));
  if (label) P.text(ctx, label, x, y + r * 0.45, r * 0.16, col('ink'));
 };
 // ficha de dominó que cae (p 0..1) con icono
 P.domino = (ctx, x, y, w, h, p, c, icon) => {
  ctx.save(); ctx.translate(x + w / 2, y + h); ctx.rotate(E.in(cl(p)) * 1.25);
  P.rr(ctx, -w / 2, -h, w, h, 18, c, { sy: 10 }); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(-w / 2 + 14, -h + 14, 12, h - 28);
  if (icon) icon(0, -h * 0.5); ctx.restore();
 };
 // persona (icono) para cuadrículas respetuosas
 P.person = (ctx, x, y, s, c) => { ctx.save(); ctx.fillStyle = fill(c); ctx.beginPath(); ctx.arc(x, y - s * 0.55, s * 0.28, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - s * 0.36, y - s * 0.2, s * 0.72, s * 0.62, [s * 0.34, s * 0.34, s * 0.08, s * 0.08]); ctx.fill(); ctx.restore(); };
 // escudo con ✓ (solución)
 P.shield = (ctx, x, y, s, c, p) => {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = col('shadow'); const sh = () => { ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * 0.55, -s * 0.78, s * 0.85, -s * 0.8); ctx.quadraticCurveTo(s * 0.9, s * 0.35, 0, s); ctx.quadraticCurveTo(-s * 0.9, s * 0.35, -s * 0.85, -s * 0.8); ctx.quadraticCurveTo(-s * 0.55, -s * 0.78, 0, -s); };
  ctx.translate(0, 12); sh(); ctx.fill(); ctx.translate(0, -12); ctx.fillStyle = fill(c); sh(); ctx.fill(); ctx.restore();
  P.check(ctx, x, y + s * 0.05, s * 0.8, p, '#ffffff');
 };
 // dedo que toca (cierre «Seguir»)
 P.finger = (ctx, x, y, s, press) => {
  ctx.save(); ctx.translate(x, y + press * 10); ctx.rotate(-0.35);
  ctx.fillStyle = fill('#f1b48c'); ctx.beginPath(); ctx.roundRect(-s * 0.22, -s * 0.05, s * 0.44, s * 1.3, s * 0.22); ctx.fill();
  ctx.fillStyle = fill('#f7d0b5'); ctx.beginPath(); ctx.roundRect(-s * 0.15, 0, s * 0.3, s * 0.28, s * 0.12); ctx.fill();
  ctx.fillStyle = fill('#e39c76'); ctx.fillRect(-s * 0.22, s * 0.55, s * 0.44, 4); ctx.restore();
 };
 // partículas deterministas (burbujas, polvo…)
 P.bubbles = (ctx, x, y, w, h, t, seed, n, a, o = {}) => {
  if (a <= 0) return; const R = H.rng(seed);
  for (let i = 0; i < n; i++) { const bx = x + R() * w, sp = R.range(0.3, 1), r = R.range(o.r0 || 6, o.r1 || 18), ph = R(); const u = ((t * sp * (o.speed || 0.5) + ph) % 1);
   const yy = y + h - u * h, xx = bx + Math.sin(t * 2 + i) * 8;
   ctx.save(); ctx.globalAlpha = a * (1 - u) * 0.9; ctx.strokeStyle = o.c || 'rgba(255,255,255,0.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(xx, yy, r, 0, TAU); ctx.stroke();
   ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(xx - r * 0.35, yy - r * 0.35, r * 0.25, 0, TAU); ctx.fill(); ctx.restore(); }
 };


 // ---------------- BLOQUES v1.2 (episodio microondas) ----------------
 // cámara 2.5D por fotogramas clave [t, x, y, zoom, rot]: devuelve el estado y lo aplica (centro de pantalla = punto mirado)
 P.camAt = (keys, t) => { if (t <= keys[0][0]) return keys[0].slice(1); for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t <= b[0]) { const u = E.inOut(win(t, a[0], b[0])); return [lerp(a[1], b[1], u), lerp(a[2], b[2], u), Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u)), lerp(a[4] || 0, b[4] || 0, u)]; } } return keys[keys.length - 1].slice(1); };
 P.camApply = (ctx, c) => { ctx.translate(W / 2, HH / 2); ctx.rotate(c[3] || 0); ctx.scale(c[2], c[2]); ctx.translate(-c[0], -c[1]); };
 // brillo aditivo (luz, energía): no se usa para «partículas de onda»
 P.glow = (ctx, x, y, r, rgb, a) => { if (a <= 0.003 || r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(0.4, `rgba(${rgb},${a * 0.35})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); };
 // rampa térmica (temperatura, NO intensidad de campo): 0 frío azul → 0.5 amarillo → 0.75 naranja → 1 rojo
 P.heat = (v) => { const st = [[0, [40, 110, 230]], [0.35, [90, 200, 235]], [0.55, [250, 215, 70]], [0.78, [250, 140, 40]], [1, [225, 45, 40]]]; v = cl(v); for (let i = 0; i < st.length - 1; i++) { const [a, ca] = st[i], [b, cb] = st[i + 1]; if (v <= b) { const u = (v - a) / (b - a); return [lerp(ca[0], cb[0], u), lerp(ca[1], cb[1], u), lerp(ca[2], cb[2], u)]; } } return st[st.length - 1][1]; };
 // onda electromagnética estilizada: cinta luminosa sinusoidal a lo largo de una polilínea (dos hebras desfasadas = volumen)
 P.wave = (ctx, pts, t, o = {}) => {
  const amp = o.amp || 26, lam = o.lam || 120, sp = o.speed || 260, a = o.a ?? 1, rgb = o.rgb || '90,220,255', prog = o.prog ?? 1;
  const seg = []; let L = 0; for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push([L, d, i]); L += d; }
  const at = (s) => { for (const [l0, d, i] of seg) if (s <= l0 + d || i === seg.length - 1) { const u = d ? (s - l0) / d : 0, p = pts[i], q = pts[i + 1]; return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, Math.atan2(q[1] - p[1], q[0] - p[0])]; } };
  const Lp = L * cl(prog); if (Lp < 2 || a <= 0.01) return;
  // o.over: dibujar en modo normal (sobre fondos claros, donde el modo aditivo se vuelve blanco)
  ctx.save(); ctx.globalCompositeOperation = o.over ? 'source-over' : 'lighter'; ctx.lineCap = 'round';
  for (const [ph, w, al] of [[0, 9, 0.18], [0, 3, 0.85], [Math.PI / 2, 2, 0.45]]) {
   ctx.beginPath();
   for (let s2 = 0; s2 <= Lp; s2 += 4) { const [x, y, an] = at(s2), env = Math.min(1, s2 / 40, (Lp - s2) / 40 + 0.2), off = Math.sin((s2 - t * sp) / lam * TAU + ph) * amp * env * (ph ? 0.6 : 1); const px = x - Math.sin(an) * off, py = y + Math.cos(an) * off; s2 ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
   ctx.strokeStyle = `rgba(${rgb},${al * a})`; ctx.lineWidth = w; ctx.stroke();
  }
  ctx.restore();
 };
 // molécula de agua (O rojo, 2 H blancos a ~104,5°), ángulo = orientación del dipolo
 P.water = (ctx, x, y, s, ang, o = {}) => {
  const hx = (k) => [x + Math.cos(ang + k * 0.912) * s * 0.95, y + Math.sin(ang + k * 0.912) * s * 0.95];
  ctx.save();
  for (const k of [-1, 1]) { const [px, py] = hx(k); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = s * 0.22; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(px, py); ctx.stroke(); }
  const oc = o.hot != null ? P.heat(0.15 + 0.85 * o.hot) : [230, 70, 70];
  const g = ctx.createRadialGradient(x - s * 0.2, y - s * 0.2, s * 0.1, x, y, s * 0.62); g.addColorStop(0, '#ffffff'); g.addColorStop(0.25, H.rgba(oc)); g.addColorStop(1, H.rgba(oc.map((v) => v * 0.55)));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * 0.6, 0, TAU); ctx.fill();
  for (const k of [-1, 1]) { const [px, py] = hx(k), gh = ctx.createRadialGradient(px - s * 0.1, py - s * 0.1, 1, px, py, s * 0.36); gh.addColorStop(0, '#ffffff'); gh.addColorStop(1, '#b9c4d6'); ctx.fillStyle = gh; ctx.beginPath(); ctx.arc(px, py, s * 0.34, 0, TAU); ctx.fill(); }
  ctx.restore();
 };


 // ---------------- BLOQUES v1.4 (episodio aire acondicionado) ----------------
 // Recorrido: polilínea con longitud acumulada; at(s) → [x, y, ángulo]. Reutilizable para tuberías, cables, rutas.
 P.path = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); const total = L[L.length - 1];
  const at = (s) => { s = Math.max(0, Math.min(total, s)); let i = 1; while (i < L.length - 1 && L[i] < s) i++; const u = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]), a = pts[i - 1], b = pts[i]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(b[1] - a[1], b[0] - a[0])]; };
  return { pts, L: total, at }; };
 P.strokePath = (ctx, pts, w, col, o = {}) => { ctx.save(); ctx.lineCap = o.cap || 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.globalAlpha *= o.a ?? 1; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); };
 // Fluido dentro de un conducto transparente. FASE y TEMPERATURA son independientes:
 //   phase(u) 0 = líquido · 1 = vapor · intermedio = mezcla (líquido con burbujas); temp(u) 0..1 → P.heat (azul frío → rojo caliente)
 //   u = fracción del recorrido. o: { w ancho, speed px/s, phase, temp, a, seed }
 P.fluid = (ctx, path, t, o = {}) => {
  const w = o.w || 12, sp = o.speed || 60, a = o.a ?? 1, ph = o.phase || (() => 0), tp = o.temp || (() => 0.5), R = H.rng(o.seed || 1);
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  // núcleo líquido: grosor ∝ fracción líquida, color = temperatura
  const step = 6;
  for (let s = 0; s < path.L - step; s += step) { const u = s / path.L, f = ph(u), lw = w * 0.78 * (1 - f); if (lw < 0.6) continue; const [x0, y0] = path.at(s), [x1, y1] = path.at(s + step + 0.5); ctx.strokeStyle = H.rgba(P.heat(tp(u)), 0.85); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
  // partículas que avanzan: en líquido, puntos densos; en vapor y mezcla, burbujas (anillos)
  const n = Math.floor(path.L / (w * 0.9));
  for (let i = 0; i < n; i++) { const off = R() * path.L, s = (off + t * sp) % path.L, u = s / path.L, f = ph(u), [x, y, an] = path.at(s), j = (R() - 0.5) * w * 0.55, px = x - Math.sin(an) * j, py = y + Math.cos(an) * j, col = H.rgba(H.mix(P.heat(tp(u)), [255, 255, 255], 0.35), 0.95);
   if (R() < f) { const r = w * (0.16 + 0.14 * R()); ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.2, w * 0.09); ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.stroke(); }
   else if (R() < 0.7) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px, py, Math.max(1.2, w * 0.1), 0, TAU); ctx.fill(); } }
  ctx.restore();
 };
 // Trazadores de aire: rayas cortas que viajan por una trayectoria (no humo). temp 0..1 tiñe el aire.
 P.airStreaks = (ctx, path, t, o = {}) => {
  const n = o.n || 14, sp = o.speed || 220, len = o.len || 46, a = o.a ?? 1, R = H.rng(o.seed || 3), spread = o.spread || 40;
  if (a <= 0.01) return; ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const off = R() * path.L, lane = (R() - 0.5) * spread, s = (off + t * sp * (0.8 + 0.4 * R())) % path.L, u = s / path.L, tt = typeof o.temp === 'function' ? o.temp(u) : (o.temp ?? 0.5), al = a * Math.sin(Math.PI * u) * 0.9;
   const [x0, y0, an] = path.at(s), [x1, y1] = path.at(Math.max(0, s - len)), nx = -Math.sin(an) * lane, ny = Math.cos(an) * lane;
   const g = ctx.createLinearGradient(x1 + nx, y1 + ny, x0 + nx, y0 + ny); const c = P.heat(tt); g.addColorStop(0, H.rgba(c, 0)); g.addColorStop(1, H.rgba(H.mix(c, [255, 255, 255], 0.3), al));
   ctx.strokeStyle = g; ctx.lineWidth = o.w || 4; ctx.beginPath(); ctx.moveTo(x1 + nx, y1 + ny); ctx.lineTo(x0 + nx, y0 + ny); ctx.stroke(); }
  ctx.restore();
 };
 // Ventilador axial (unidad exterior): aspas que giran + rejilla
 P.fanAxial = (ctx, x, y, r, ang, o = {}) => {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = o.bg || '#1a2230'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.rotate(ang); const nb = o.blades || 3;
  for (let k = 0; k < nb; k++) { ctx.save(); ctx.rotate(k * TAU / nb); ctx.fillStyle = o.blade || '#5f6f82'; ctx.beginPath(); ctx.moveTo(r * 0.12, -r * 0.08); ctx.bezierCurveTo(r * 0.5, -r * 0.42, r * 0.92, -r * 0.3, r * 0.9, r * 0.05); ctx.bezierCurveTo(r * 0.6, r * 0.12, r * 0.3, r * 0.1, r * 0.12, r * 0.08); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = o.hub || '#9aa7b6'; ctx.beginPath(); ctx.arc(0, 0, r * 0.14, 0, TAU); ctx.fill();
  ctx.rotate(-ang); if (o.grille !== false) { ctx.strokeStyle = 'rgba(200,210,225,0.35)'; ctx.lineWidth = 2; for (let k = 1; k <= 5; k++) { ctx.beginPath(); ctx.arc(0, 0, r * k / 5, 0, TAU); ctx.stroke(); } for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(k * TAU / 8) * r, Math.sin(k * TAU / 8) * r); ctx.stroke(); } }
  ctx.restore();
 };
 // Ventilador de flujo cruzado (unidad interior): cilindro horizontal con álabes que se desplazan
 P.fanCross = (ctx, x0, y0, w, h, ph, o = {}) => {
  ctx.save(); const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#2b3442'); g.addColorStop(0.5, '#5d6b7e'); g.addColorStop(1, '#232b37');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x0, y0, w, h, h / 2); ctx.fill(); ctx.clip();
  ctx.strokeStyle = o.blade || 'rgba(220,230,245,0.55)'; ctx.lineWidth = 2; const sp = h * 0.45;
  for (let x = x0 - sp + ((ph * sp) % sp); x < x0 + w + sp; x += sp) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.quadraticCurveTo(x + sp * 0.3, y0 + h / 2, x, y0 + h); ctx.stroke(); }
  ctx.restore();
 };


 // ---------------- BLOQUES v1.5 (episodio GPS) ----------------
 // Celular: marco + pantalla con callback (la pantalla se recorta). (cx, cy) centro, w ancho.
 P.phone = (ctx, cx, cy, w, screen, o = {}) => {
  const h = w * 2.05, x = cx - w / 2, y = cy - h / 2, r = w * 0.14, b = w * 0.045;
  ctx.save(); ctx.fillStyle = col('shadow'); ctx.beginPath(); ctx.roundRect(x + 8, y + 18, w, h, r); ctx.fill();
  const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#2b2f3a'); g.addColorStop(1, '#11141a'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x + b, y + b, w - 2 * b, h - 2 * b, r * 0.8); ctx.clip(); screen(x + b, y + b, w - 2 * b, h - 2 * b); ctx.restore();
  ctx.fillStyle = '#0b0d12'; ctx.beginPath(); ctx.roundRect(cx - w * 0.14, y + b + w * 0.03, w * 0.28, w * 0.07, w * 0.035); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x + 1, y + 1, w - 2, h - 2, r); ctx.stroke();
  ctx.restore();
 };
 // Mapa de ciudad visto desde arriba (manzanas, calles, parque, río). Determinista por semilla.
 P.mapCity = (ctx, x, y, w, h, seed = 1, o = {}) => {
  const R = H.rng(seed); ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = o.ground || '#eef1f4'; ctx.fillRect(x, y, w, h);
  const bs = o.block || 90, st = o.street || 16;
  for (let yy = y - bs; yy < y + h + bs; yy += bs + st) for (let xx = x - bs; xx < x + w + bs; xx += bs + st) { const k = R(); ctx.fillStyle = k < 0.1 ? '#bfe3c0' : k < 0.16 ? '#cfe4f6' : '#dfe3e8'; ctx.beginPath(); ctx.roundRect(xx, yy, bs, bs, 8); ctx.fill(); }
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = st * 1.6; ctx.beginPath(); ctx.moveTo(x, y + h * 0.62); ctx.bezierCurveTo(x + w * 0.3, y + h * 0.5, x + w * 0.6, y + h * 0.78, x + w, y + h * 0.66); ctx.stroke();
  ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = st * 0.9; ctx.stroke();
  ctx.strokeStyle = '#9fd0f2'; ctx.lineWidth = st * 2.4; ctx.beginPath(); ctx.moveTo(x + w * 0.15, y); ctx.bezierCurveTo(x + w * 0.05, y + h * 0.3, x + w * 0.35, y + h * 0.55, x + w * 0.2, y + h); ctx.stroke();
  ctx.restore();
 };
 // Pin de ubicación (gota) y punto azul pulsante
 P.pin = (ctx, x, y, s, c = '#e8505b') => { ctx.save(); ctx.fillStyle = col('shadow'); ctx.beginPath(); ctx.ellipse(x, y + 4, s * 0.35, s * 0.12, 0, 0, TAU); ctx.fill(); ctx.fillStyle = fill(c); ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x - s * 0.15, y - s * 0.35, x - s * 0.5, y - s * 0.55, x - s * 0.5, y - s * 0.85); ctx.arc(x, y - s * 0.85, s * 0.5, Math.PI, 0); ctx.bezierCurveTo(x + s * 0.5, y - s * 0.55, x + s * 0.15, y - s * 0.35, x, y); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y - s * 0.85, s * 0.2, 0, TAU); ctx.fill(); ctx.restore(); };
 P.dot = (ctx, x, y, r, t, c = '#2f80ed') => { const ph = (t * 1.2) % 1; ctx.save(); ctx.fillStyle = `rgba(47,128,237,${0.35 * (1 - ph)})`; ctx.beginPath(); ctx.arc(x, y, r * (1 + 2.2 * ph), 0, TAU); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, r * 1.25, 0, TAU); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); };
 // Círculo de distancia (rango) que se dibuja: p 0..1
 P.rangeCircle = (ctx, x, y, r, p, c = '#2f80ed', o = {}) => { if (p <= 0) return; ctx.save(); ctx.fillStyle = H.rgba(H.hex(c), o.fillA ?? 0.08); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = o.w || 5; ctx.setLineDash(o.dash || [18, 12]); ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * cl(p)); ctx.stroke(); ctx.restore(); };
 // Globo terrestre plano con continentes estilizados (ruido), rotación ang, sombra de día/noche suave
 let GLOBE = null;
 P.globe = (ctx, x, y, r, ang = 0) => {
  if (!GLOBE) { const S = 512, c = H.layer(S * 2, S), g = c.getContext('2d'), nz = H.makeNoise(77), img = g.createImageData(S * 2, S); for (let j = 0; j < S; j++) for (let i = 0; i < S * 2; i++) { const lon = i / (S * 2) * TAU, lat = (j / S - 0.5) * Math.PI, v = nz.fbm3(Math.cos(lat) * Math.cos(lon) * 1.6, Math.cos(lat) * Math.sin(lon) * 1.6, Math.sin(lat) * 1.6, 4), land = v > 0.06, ice = Math.abs(lat) > 1.25, q = (j * S * 2 + i) * 4, c3 = ice ? [235, 242, 248] : land ? (v > 0.22 ? [150, 170, 110] : [95, 170, 95]) : [40, 120, 200]; img.data[q] = c3[0]; img.data[q + 1] = c3[1]; img.data[q + 2] = c3[2]; img.data[q + 3] = 255; } g.putImageData(img, 0, 0); GLOBE = c; }
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  const S = GLOBE.height, off = ((ang / TAU) % 1 + 1) % 1 * S * 2;
  for (let k = -1; k <= 1; k++) ctx.drawImage(GLOBE, 0, 0, S * 2, S, x - r - off / (S * 2) * r * 4 + k * r * 4, y - r, r * 4, r * 2);
  const sh = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r * 1.05); sh.addColorStop(0, 'rgba(255,255,255,0.18)'); sh.addColorStop(0.6, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,10,30,0.55)'); ctx.fillStyle = sh; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  ctx.restore();
  const at = ctx.createRadialGradient(x, y, r * 0.95, x, y, r * 1.12); at.addColorStop(0, 'rgba(120,190,255,0.5)'); at.addColorStop(1, 'rgba(120,190,255,0)'); ctx.save(); ctx.fillStyle = at; ctx.beginPath(); ctx.arc(x, y, r * 1.12, 0, TAU); ctx.fill(); ctx.restore();
 };
 // Satélite genérico (cuerpo + paneles solares + antena)
 P.satellite = (ctx, x, y, s, rot = 0, o = {}) => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  for (const sd of [-1, 1]) { ctx.fillStyle = '#2b4f8a'; ctx.fillRect(sd > 0 ? s * 0.32 : -s * 1.22, -s * 0.22, s * 0.9, s * 0.44); ctx.strokeStyle = 'rgba(200,220,255,0.55)'; ctx.lineWidth = Math.max(1, s * 0.03); for (let k = 1; k < 4; k++) { const xx = (sd > 0 ? s * 0.32 : -s * 1.22) + k * s * 0.225; ctx.beginPath(); ctx.moveTo(xx, -s * 0.22); ctx.lineTo(xx, s * 0.22); ctx.stroke(); } ctx.fillStyle = '#9aa7b6'; ctx.fillRect(sd > 0 ? s * 0.22 : -s * 0.32, -s * 0.04, s * 0.1, s * 0.08); }
  ctx.fillStyle = o.body || '#d9a42b'; ctx.beginPath(); ctx.roundRect(-s * 0.24, -s * 0.3, s * 0.48, s * 0.6, s * 0.06); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(-s * 0.2, -s * 0.26, s * 0.1, s * 0.52);
  ctx.fillStyle = '#e8edf3'; ctx.beginPath(); ctx.ellipse(0, s * 0.38, s * 0.18, s * 0.08, 0, 0, TAU); ctx.fill();
  ctx.restore();
 };
 // Ondas de radio que se expanden desde (x, y): anillos o arcos dirigidos (dir, abertura)
 P.rings = (ctx, x, y, t, o = {}) => { const n = o.n || 3, maxR = o.r || 220, per = o.period || 1.2, c = o.c || '120,220,255', a = o.a ?? 1; if (a <= 0) return; ctx.save(); ctx.lineCap = 'round'; for (let k = 0; k < n; k++) { const u = ((t / per + k / n) % 1), rr = 10 + u * maxR; ctx.strokeStyle = `rgba(${c},${a * (1 - u) * 0.9})`; ctx.lineWidth = o.w || 5; ctx.beginPath(); if (o.dir != null) ctx.arc(x, y, rr, o.dir - (o.spread || 0.6), o.dir + (o.spread || 0.6)); else ctx.arc(x, y, rr, 0, TAU); ctx.stroke(); } ctx.restore(); };
 // Reloj analógico (h, m, s en horas/minutos/segundos continuos)
 P.clock = (ctx, x, y, r, secs, o = {}) => {
  P.circle(ctx, x, y, r + r * 0.08, o.rim || col('ink2'), { shadow: true }); P.circle(ctx, x, y, r, o.face || '#ffffff');
  ctx.save(); ctx.strokeStyle = '#1d1b3a'; for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; ctx.lineWidth = k % 3 ? 3 : 6; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82); ctx.lineTo(x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95); ctx.stroke(); }
  const hand = (frac, len, w, c) => { const a = frac * TAU - Math.PI / 2; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke(); };
  hand((secs / 43200) % 1, r * 0.5, r * 0.08, '#1d1b3a'); hand((secs / 3600) % 1, r * 0.72, r * 0.06, '#1d1b3a'); hand((secs / 60) % 1, r * 0.82, r * 0.025, o.sec || '#e8505b');
  ctx.fillStyle = '#1d1b3a'; ctx.beginPath(); ctx.arc(x, y, r * 0.07, 0, TAU); ctx.fill(); ctx.restore();
 };

 // ======================= v1.6 · OCÉANO, CABLES SUBMARINOS Y TELECOMUNICACIONES =======================
 const mixC = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
 // Curva suave (Catmull-Rom) que pasa por los puntos: devuelve una polilínea densa (para rutas, cables, contornos)
 P.spline = (pts, seg = 10) => { if (pts.length < 3) return pts.slice(); const out = []; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]; for (let k = 0; k < seg; k++) { const u = k / seg, u2 = u * u, u3 = u2 * u; out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3))); } } out.push(pts[pts.length - 1].slice()); return out; };
 // Mar de perfil: degradado según la profundidad (0 superficie → 1 abismo), rayos de luz que se apagan al bajar
 // y «nieve marina» que deriva. o: { x, y, w, h, snow (nº partículas), rays, seed, dy (desplazamiento: descenso) }
 P.ocean = (ctx, t, depth = 0.5, o = {}) => {
  const x = o.x ?? 0, y = o.y ?? 0, w = o.w ?? W, h = o.h ?? HH, d = cl(depth);
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, H.rgba(mixC([22, 123, 255], [6, 42, 70], cl(d * 1.6)))); g.addColorStop(0.55, H.rgba(mixC([6, 60, 110], [3, 19, 34], d))); g.addColorStop(1, H.rgba(mixC([6, 42, 70], [2, 9, 18], d))); ctx.save(); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const ra = (o.rays ?? 1) * Math.pow(1 - d, 1.6) * 0.16;
  if (ra > 0.005) { ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const cx = x + w * (0.1 + i * 0.17) + Math.sin(t * 0.4 + i * 1.7) * 40, sp = 60 + (i % 3) * 30; const rg = ctx.createLinearGradient(0, y, 0, y + h * 0.8); rg.addColorStop(0, `rgba(180,230,255,${ra})`); rg.addColorStop(1, 'rgba(180,230,255,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(cx - sp * 0.3, y); ctx.lineTo(cx + sp * 0.3, y); ctx.lineTo(cx + sp * 1.4 + 120, y + h * 0.8); ctx.lineTo(cx - sp * 0.2 + 120, y + h * 0.8); ctx.closePath(); ctx.fill(); } ctx.globalCompositeOperation = 'source-over'; }
  const n = o.snow ?? 90, R = H.rng(o.seed || 31), dy = o.dy || 0;
  for (let i = 0; i < n; i++) { const px = x + ((R() * w + Math.sin(t * 0.3 + i) * 12) % w + w) % w, sp = R.range(6, 18), py = y + (((R() * h - t * sp - dy * R.range(0.6, 1.4)) % h) + h) % h, r = R.range(0.8, 2.6); ctx.fillStyle = `rgba(210,235,255,${R.range(0.15, 0.45) * (0.5 + 0.5 * d)})`; ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill(); }
  ctx.restore();
 };
 // Superficie del mar de perfil (línea ondulada con espuma). o: { x, w, amp, sky (color encima, null = no pinta), c }
 P.waves = (ctx, y, t, o = {}) => {
  const x0 = o.x ?? 0, w = o.w ?? W, amp = o.amp ?? 10, f = (x) => y + Math.sin(x * 0.012 + t * 1.6) * amp + Math.sin(x * 0.031 - t * 2.1) * amp * 0.4;
  ctx.save(); if (o.sky) { ctx.fillStyle = o.sky; ctx.beginPath(); ctx.moveTo(x0, y - 2000); for (let x = x0; x <= x0 + w; x += 12) ctx.lineTo(x, f(x)); ctx.lineTo(x0 + w, y - 2000); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = o.c || 'rgba(230,248,255,0.85)'; ctx.lineWidth = 5; ctx.beginPath(); for (let x = x0; x <= x0 + w; x += 12) (x === x0 ? ctx.moveTo(x, f(x)) : ctx.lineTo(x, f(x))); ctx.stroke(); ctx.restore(); return f;
 };
 // Fondo marino de perfil: sedimento ondulado, rocas y una franja de arena. Devuelve yAt(x) (altura del fondo) para apoyar cables.
 P.seabed = (ctx, y, t, o = {}) => {
  const x0 = o.x ?? 0, w = o.w ?? W, s = o.seed || 7, bot = o.bottom ?? HH, yAt = (x) => y + Math.sin(x * 0.006 + s) * 14 + Math.sin(x * 0.019 + s * 2) * 6;
  ctx.save(); const g = ctx.createLinearGradient(0, y - 20, 0, bot); g.addColorStop(0, o.c || '#3a4a55'); g.addColorStop(1, o.c2 || '#141d24'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, bot); for (let x = x0; x <= x0 + w; x += 10) ctx.lineTo(x, yAt(x)); ctx.lineTo(x0 + w, bot); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(160,190,200,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); for (let x = x0; x <= x0 + w; x += 10) (x === x0 ? ctx.moveTo(x, yAt(x)) : ctx.lineTo(x, yAt(x))); ctx.stroke();
  const R = H.rng(s * 13); for (let i = 0; i < (o.rocks ?? 7); i++) { const rx = x0 + R() * w, rw = R.range(20, 70), ry = yAt(rx); ctx.fillStyle = `rgba(${R.int(60, 90)},${R.int(75, 100)},${R.int(85, 110)},1)`; ctx.beginPath(); ctx.ellipse(rx, ry + rw * 0.15, rw, rw * 0.45, 0, Math.PI, TAU); ctx.fill(); }
  ctx.restore(); return yAt;
 };
 // Barco cablero de perfil sobre la línea de agua y (s = media eslora en px). Proa a la izquierda; popa a la derecha con
 // roldana (polea) por donde sale el cable. Se mece con t. o: { tanks (tambor/tanque visible), flip }. Devuelve [x, y] de la roldana.
 P.ship = (ctx, x, y, s, t, o = {}) => {
  const bob = Math.sin(t * 1.3) * s * 0.012, rot = Math.sin(t * 0.9) * 0.012, fl = o.flip ? -1 : 1;
  ctx.save(); ctx.translate(x, y + bob); ctx.rotate(rot); ctx.scale(fl, 1);
  ctx.fillStyle = '#c23b3b'; ctx.beginPath(); ctx.moveTo(-s * 0.98, s * 0.02); ctx.lineTo(s * 0.98, s * 0.02); ctx.lineTo(s * 0.9, s * 0.16); ctx.lineTo(-s * 0.8, s * 0.16); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1d3b6a'; ctx.beginPath(); ctx.moveTo(-s * 1.08, -s * 0.2); ctx.lineTo(s, -s * 0.12); ctx.lineTo(s * 0.98, s * 0.03); ctx.lineTo(-s * 0.98, s * 0.03); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.fillRect(-s * 0.98, -s * 0.2, s * 1.96, s * 0.03);
  ctx.fillStyle = '#f4f7fb'; ctx.beginPath(); ctx.roundRect(-s * 0.85, -s * 0.5, s * 0.5, s * 0.32, s * 0.03); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * 0.78, -s * 0.66, s * 0.34, s * 0.17, s * 0.03); ctx.fill();
  ctx.fillStyle = '#1d2a3a'; for (let i = 0; i < 5; i++) ctx.fillRect(-s * 0.8 + i * s * 0.09, -s * 0.42, s * 0.055, s * 0.06); for (let i = 0; i < 3; i++) ctx.fillRect(-s * 0.74 + i * s * 0.09, -s * 0.6, s * 0.055, s * 0.05);
  ctx.fillStyle = '#e8b04a'; ctx.fillRect(-s * 0.62, -s * 0.84, s * 0.04, s * 0.18);
  if (o.tanks !== false) { ctx.fillStyle = '#7d8a99'; ctx.beginPath(); ctx.roundRect(-s * 0.2, -s * 0.34, s * 0.55, s * 0.16, s * 0.03); ctx.fill(); ctx.strokeStyle = '#222b36'; ctx.lineWidth = s * 0.012; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-s * 0.17 + i * s * 0.09, -s * 0.33); ctx.lineTo(-s * 0.17 + i * s * 0.09, -s * 0.19); ctx.stroke(); } }
  ctx.strokeStyle = '#e8b04a'; ctx.lineWidth = s * 0.035; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(s * 0.62, -s * 0.15); ctx.lineTo(s * 0.86, -s * 0.52); ctx.lineTo(s * 1.0, -s * 0.15); ctx.stroke();
  const sx = s * 1.02, sy = -s * 0.16; ctx.fillStyle = '#d9dee5'; ctx.beginPath(); ctx.arc(sx, sy, s * 0.07, 0, TAU); ctx.fill(); ctx.fillStyle = '#4a5563'; ctx.beginPath(); ctx.arc(sx, sy, s * 0.025, 0, TAU); ctx.fill();
  ctx.restore();
  return [x + fl * (sx * Math.cos(rot) - sy * Math.sin(rot)), y + bob + sx * Math.sin(rot) + sy * Math.cos(rot)];
 };
 // Corte transversal de un cable submarino de fibra óptica (de dentro hacia fuera): fibras en gel dentro de un tubo de acero,
 // hilos de acero (resistencia), conductor de cobre (lleva la energía a los repetidores), aislante de polietileno y, si o.armor,
 // armadura de alambres y cubierta exterior (cables de aguas someras). o.p 0..1 revela las capas de dentro afuera.
 // Devuelve [{ id, r }] con el radio medio de cada capa (para rotular con flechas).
 P.cableSection = (ctx, x, y, r, o = {}) => {
  const arm = !!o.armor, p = o.p ?? 1, Lr = arm ? { tube: 0.17, steel: 0.36, cu: 0.42, pe: 0.72, arm: 0.92, out: 1 } : { tube: 0.2, steel: 0.44, cu: 0.52, pe: 1 };
  const ids = arm ? ['fibras', 'acero', 'cobre', 'polietileno', 'armadura', 'cubierta'] : ['fibras', 'acero', 'cobre', 'polietileno'];
  const vis = (i) => cl((p * ids.length - (ids.length - 1 - i)) * 1.2); // capa exterior primero en aparecer al abrir (p sube: aparecen las de dentro al final)
  const ring = (r0, r1, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r1 * r, 0, TAU); ctx.arc(x, y, r0 * r, 0, TAU, true); ctx.fill(); };
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.arc(x + r * 0.04, y + r * 0.08, r, 0, TAU); ctx.fill();
  const order = arm ? [['cubierta', Lr.arm, Lr.out], ['armadura', Lr.pe, Lr.arm], ['polietileno', Lr.cu, Lr.pe], ['cobre', Lr.steel, Lr.cu], ['acero', Lr.tube, Lr.steel], ['fibras', 0, Lr.tube]] : [['polietileno', Lr.cu, Lr.pe], ['cobre', Lr.steel, Lr.cu], ['acero', Lr.tube, Lr.steel], ['fibras', 0, Lr.tube]];
  const out = [];
  for (const [id, r0, r1] of order) {
   const a = vis(ids.indexOf(id)); out.push({ id, r: ((r0 + r1) / 2) * r, r0: r0 * r, r1: r1 * r }); if (a <= 0) continue; ctx.globalAlpha = a;
   if (id === 'cubierta') ring(r0, r1, '#2b2a24');
   else if (id === 'armadura') { ring(r0, r1, '#3b434d'); const n = 22, wr = (r1 - r0) * r * 0.5; for (let i = 0; i < n; i++) { const an = i / n * TAU, rr = (r0 + r1) / 2 * r; ctx.fillStyle = '#9aa5b2'; ctx.beginPath(); ctx.arc(x + Math.cos(an) * rr, y + Math.sin(an) * rr, wr * 0.95, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(x + Math.cos(an) * rr - wr * 0.3, y + Math.sin(an) * rr - wr * 0.3, wr * 0.35, 0, TAU); ctx.fill(); } }
   else if (id === 'polietileno') { const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r1 * r); g.addColorStop(0, '#f6f8fb'); g.addColorStop(1, '#c9d1db'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r1 * r, 0, TAU); ctx.arc(x, y, r0 * r, 0, TAU, true); ctx.fill(); }
   else if (id === 'cobre') ring(r0, r1, '#d9823b');
   else if (id === 'acero') { ring(r0, r1, '#5f6b78'); for (const [k, n] of [[0.32, 14], [0.75, 20]]) { const rr = (r0 + (r1 - r0) * k) * r, wr = Math.PI * rr / n * 0.92; for (let i = 0; i < n; i++) { const an = i / n * TAU + k; ctx.fillStyle = '#aeb8c4'; ctx.beginPath(); ctx.arc(x + Math.cos(an) * rr, y + Math.sin(an) * rr, wr, 0, TAU); ctx.fill(); } } }
   else { ring(r1 * 0.82, r1, '#c9d2dc'); ctx.fillStyle = '#ffe7a3'; ctx.beginPath(); ctx.arc(x, y, r1 * 0.82 * r, 0, TAU); ctx.fill(); const FC = ['#2f80ed', '#ff9b45', '#2fbf71', '#a0522d', '#8799a8', '#ffffff', '#e8505b', '#1d1b3a']; FC.forEach((c, i) => { const an = i / FC.length * TAU, rr = r1 * 0.45 * r; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + Math.cos(an) * rr, y + Math.sin(an) * rr, r1 * 0.13 * r, 0, TAU); ctx.fill(); }); }
  }
  ctx.restore(); return out;
 };
 // Fibra óptica vista de lado: revestimiento (cladding) de vidrio y núcleo; la luz va GUIADA dentro del núcleo como pulsos
 // (no como un rayo en zigzag). o: { bits ('1011…' patrón que se repite), gap px entre bits, speed px/s, att 0..1 (pérdida de brillo
 // a lo largo de cada tramo), boost [x…] (amplificadores: el brillo se recupera), c 'r,g,b', a, labels }
 P.fiber = (ctx, x0, x1, y, h, t, o = {}) => {
  const a = o.a ?? 1; if (a <= 0) return; const c = o.c || '73,230,255', bits = o.bits || '1101001110', gap = o.gap || 46, sp = o.speed || 420, ch = h * (o.core || 0.32);
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, 'rgba(200,235,255,0.35)'); g.addColorStop(0.5, 'rgba(200,235,255,0.12)'); g.addColorStop(1, 'rgba(200,235,255,0.35)'); ctx.fillStyle = g; ctx.fillRect(x0, y - h / 2, x1 - x0, h);
  ctx.strokeStyle = 'rgba(220,240,255,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(x0, y - h / 2, x1 - x0, h);
  ctx.fillStyle = `rgba(${c},0.14)`; ctx.fillRect(x0, y - ch / 2, x1 - x0, ch);
  const boosts = [x0, ...(o.boost || [])].sort((p, q) => p - q), att = o.att || 0;
  const bright = (x) => { let b0 = x0, b1 = x1; for (let i = 0; i < boosts.length; i++) if (boosts[i] <= x) { b0 = boosts[i]; b1 = boosts[i + 1] ?? x1; } return 1 - att * (x - b0) / Math.max(1, b1 - b0); };
  ctx.beginPath(); ctx.rect(x0, y - h / 2, x1 - x0, h); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
  const head = t * sp, mA = Math.floor((head - (x1 - x0) - gap) / gap), mB = Math.floor((head + gap) / gap);
  for (let m = mA; m <= mB; m++) { const xx = x0 + head - m * gap; if (bits[((m % bits.length) + bits.length) % bits.length] !== '1' || xx < x0 - gap || xx > x1 + gap) continue; const b = cl(bright(cl(xx, x0, x1))); if (b <= 0.02) continue;
   ctx.save(); ctx.translate(xx, y); ctx.scale(2.6, 1); P.glow(ctx, 0, 0, ch * 1.3, c, 0.85 * b); ctx.restore(); ctx.fillStyle = `rgba(240,255,255,${0.9 * b})`; ctx.beginPath(); ctx.ellipse(xx, y, gap * 0.28, ch * 0.32, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
 };
 // Repetidor submarino (carcasa cilíndrica con conos, en línea con el cable). glow 0..1 = amplificando (luz que se reaviva).
 P.repeater = (ctx, x, y, s, ang = 0, glow = 0) => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  const g = ctx.createLinearGradient(0, -s * 0.35, 0, s * 0.35); g.addColorStop(0, '#c9d2dc'); g.addColorStop(0.5, '#8794a3'); g.addColorStop(1, '#4b5664'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-s * 1.3, -s * 0.1); ctx.lineTo(-s * 0.9, -s * 0.33); ctx.lineTo(s * 0.9, -s * 0.33); ctx.lineTo(s * 1.3, -s * 0.1); ctx.lineTo(s * 1.3, s * 0.1); ctx.lineTo(s * 0.9, s * 0.33); ctx.lineTo(-s * 0.9, s * 0.33); ctx.lineTo(-s * 1.3, s * 0.1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3b4552'; for (const k of [-0.55, 0, 0.55]) ctx.fillRect(s * k - s * 0.04, -s * 0.33, s * 0.08, s * 0.66);
  if (glow > 0) { P.glow(ctx, 0, 0, s * 1.6, '70,245,188', 0.55 * glow); ctx.fillStyle = `rgba(70,245,188,${0.9 * glow})`; ctx.beginPath(); ctx.arc(0, 0, s * 0.12, 0, TAU); ctx.fill(); }
  ctx.restore();
 };
 // Mapa del mundo ESTILIZADO (contornos simplificados, proyección equirrectangular). NO sirve para rutas exactas.
 // o: { lon0, lon1, lat0, lat1 (ventana), sea, land, coast, grid, round }. Devuelve proj([lon, lat]) → [px, py].
 const LAND = [
  [[-168, 66], [-140, 70], [-110, 72], [-85, 70], [-75, 62], [-62, 58], [-55, 50], [-66, 44], [-76, 35], [-81, 25], [-90, 29], [-97, 26], [-97, 20], [-87, 21], [-84, 10], [-78, 8], [-90, 14], [-105, 20], [-112, 30], [-118, 34], [-124, 40], [-124, 48], [-132, 55], [-150, 60], [-165, 60]],
  [[-52, 82], [-25, 82], [-20, 70], [-42, 60], [-55, 68]],
  [[-78, 8], [-60, 10], [-50, 0], [-35, -6], [-40, -22], [-48, -28], [-58, -38], [-65, -55], [-72, -50], [-73, -38], [-71, -18], [-81, -5], [-78, 2]],
  [[-10, 36], [-9, 43], [-1, 46], [-4, 48], [2, 51], [8, 54], [10, 57], [5, 62], [15, 69], [30, 71], [45, 68], [70, 73], [100, 77], [140, 72], [170, 69], [180, 66], [160, 60], [142, 52], [140, 42], [130, 35], [122, 31], [120, 23], [110, 20], [108, 12], [104, 1], [100, 8], [98, 16], [92, 22], [80, 15], [77, 8], [72, 20], [66, 25], [57, 25], [56, 26], [58, 22], [52, 16], [44, 12], [42, 18], [35, 28], [33, 31], [35, 36], [27, 37], [26, 40], [23, 36], [20, 40], [14, 40], [12, 44], [8, 44], [3, 43], [-1, 37], [-5, 36]],
  [[-17, 21], [-16, 12], [-8, 4], [5, 5], [9, 4], [10, -3], [13, -12], [12, -18], [18, -34], [26, -34], [33, -26], [40, -16], [40, -5], [44, 2], [51, 11], [43, 11], [37, 18], [33, 30], [22, 32], [11, 33], [10, 37], [-1, 36], [-6, 35], [-10, 30]],
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [140, -38], [132, -32], [115, -34]],
  [[-5, 50], [1, 51], [0, 53], [-3, 56], [-6, 58], [-5, 55]], [[130, 31], [136, 34], [140, 36], [142, 40], [141, 45], [139, 38]],
  [[44, -25], [47, -25], [50, -15], [49, -12]], [[172, -34], [178, -38], [174, -41], [167, -46]], [[95, 5], [105, -6], [115, -8], [120, -9], [110, -3], [100, 2]], [[110, 2], [118, 6], [119, -2], [114, -4]],
 ];
 P.worldMap = (ctx, x, y, w, h, o = {}) => {
  const lon0 = o.lon0 ?? -180, lon1 = o.lon1 ?? 180, lat0 = o.lat0 ?? -60, lat1 = o.lat1 ?? 80;
  const proj = ([lo, la]) => [x + (lo - lon0) / (lon1 - lon0) * w, y + (lat1 - la) / (lat1 - lat0) * h];
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, o.round ?? 0); ctx.clip(); ctx.fillStyle = o.sea || '#062A46'; ctx.fillRect(x, y, w, h);
  if (o.grid !== false) { ctx.strokeStyle = 'rgba(135,153,168,0.16)'; ctx.lineWidth = 1.5; for (let lo = -180; lo <= 180; lo += 30) { const [px] = proj([lo, 0]); ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y + h); ctx.stroke(); } for (let la = -60; la <= 80; la += 20) { const [, py] = proj([0, la]); ctx.beginPath(); ctx.moveTo(x, py); ctx.lineTo(x + w, py); ctx.stroke(); } }
  for (const poly of LAND) { const pts = poly.map(proj), n = pts.length; ctx.beginPath(); const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; let m = mid(pts[n - 1], pts[0]); ctx.moveTo(m[0], m[1]); for (let i = 0; i < n; i++) { const q = mid(pts[i], pts[(i + 1) % n]); ctx.quadraticCurveTo(pts[i][0], pts[i][1], q[0], q[1]); } ctx.closePath(); ctx.fillStyle = o.land || '#123a58'; ctx.fill(); ctx.strokeStyle = o.coast || 'rgba(73,230,255,0.45)'; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore(); return proj;
 };
 // Ruta de cable luminosa que se dibuja (prog 0..1) con paquetes de luz que viajan por ella. pts en píxeles (pasan por P.spline).
 // o: { c 'r,g,b', w, speed px/s, dots, a, smooth (false = tal cual) } · devuelve el objeto P.path de la ruta.
 P.cableRoute = (ctx, pts, prog, t, o = {}) => {
  const a = o.a ?? 1; if (a <= 0 || prog <= 0) return null; const pp = o.smooth === false ? pts : P.spline(pts, 12), L = P.path(pp), end = L.L * cl(prog), c = o.c || '73,230,255', w = o.w || 5;
  const part = [pp[0]]; let acc = 0; for (let i = 1; i < pp.length; i++) { acc += Math.hypot(pp[i][0] - pp[i - 1][0], pp[i][1] - pp[i - 1][1]); if (acc >= end) { const q = L.at(end); part.push([q[0], q[1]]); break; } part.push(pp[i]); }
  ctx.save(); ctx.globalAlpha *= a; P.strokePath(ctx, part, w * 3.2, `rgba(${c},0.18)`); P.strokePath(ctx, part, w, `rgba(${c},0.95)`);
  const nd = o.dots ?? Math.max(1, Math.round(L.L / 160)), sp = o.speed || 260; ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < nd; i++) { const s = ((t * sp + i * L.L / nd) % L.L); if (s > end) continue; const [dx, dy] = L.at(s); P.glow(ctx, dx, dy, w * 4, c, 0.9); ctx.fillStyle = '#f4faff'; ctx.beginPath(); ctx.arc(dx, dy, w * 0.75, 0, TAU); ctx.fill(); }
  ctx.restore(); return L;
 };
 // Regla vertical de profundidad: 0 m arriba (y0) → max abajo (y1); marcador en v metros con etiqueta. o: { step, a, c, fmt, side ('right') }
 P.depthGauge = (ctx, x, y0, y1, v, max, o = {}) => {
  const a = o.a ?? 1; if (a <= 0) return; const step = o.step || max / 4, c = o.c || 'rgba(244,250,255,0.85)', fmt = o.fmt || ((m) => (m > 0 ? '−' : '') + Math.round(m).toLocaleString('es-CO') + ' m'), sd = o.side === 'left' ? -1 : 1;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
  ctx.font = '600 24px "IBM Plex Mono"'; ctx.textAlign = sd > 0 ? 'left' : 'right'; ctx.textBaseline = 'middle';
  for (let m = 0; m <= max + 1e-6; m += step) { const yy = lerp(y0, y1, m / max); ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + sd * 18, yy); ctx.stroke(); ctx.globalAlpha = a * 0.7; ctx.fillText(fmt(m), x + sd * 28, yy); ctx.globalAlpha = a; }
  const my = lerp(y0, y1, cl(v / max)); ctx.fillStyle = '#FFD447'; ctx.beginPath(); ctx.moveTo(x - sd * 6, my); ctx.lineTo(x - sd * 34, my - 16); ctx.lineTo(x - sd * 34, my + 16); ctx.closePath(); ctx.fill();
  ctx.restore();
 };
 // ROV (vehículo submarino operado a distancia, con cable umbilical): chasis amarillo, flotador, propulsores y focos. o: { light, arm 0..1, umb [x,y] }
 P.rov = (ctx, x, y, s, t, o = {}) => {
  const bob = Math.sin(t * 2.1) * s * 0.03; ctx.save();
  if (o.umb) { ctx.strokeStyle = '#FFD447'; ctx.lineWidth = Math.max(2, s * 0.03); ctx.beginPath(); ctx.moveTo(o.umb[0], o.umb[1]); ctx.quadraticCurveTo((o.umb[0] + x) / 2 + s * 0.6, (o.umb[1] + y) / 2, x, y - s * 0.45 + bob); ctx.stroke(); }
  ctx.translate(x, y + bob);
  if (o.light) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(-s * 0.7, s * 0.1, 0, -s * 0.7, s * 0.1, s * 3); g.addColorStop(0, 'rgba(255,250,210,0.45)'); g.addColorStop(1, 'rgba(255,250,210,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-s * 0.7, s * 0.05); ctx.lineTo(-s * 3.2, s * 1.4); ctx.lineTo(-s * 3.2, -s * 0.5); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#f4c430'; ctx.beginPath(); ctx.roundRect(-s * 0.7, -s * 0.45, s * 1.4, s * 0.32, s * 0.08); ctx.fill();
  ctx.strokeStyle = '#3b4552'; ctx.lineWidth = s * 0.06; ctx.strokeRect(-s * 0.66, -s * 0.13, s * 1.32, s * 0.42);
  ctx.fillStyle = '#5f6b78'; ctx.fillRect(-s * 0.5, -s * 0.08, s * 0.7, s * 0.3);
  for (const k of [-0.55, 0.55]) { ctx.fillStyle = '#222b36'; ctx.beginPath(); ctx.roundRect(s * k - s * 0.14, s * 0.18, s * 0.28, s * 0.16, s * 0.05); ctx.fill(); }
  ctx.fillStyle = '#fffbe0'; ctx.beginPath(); ctx.arc(-s * 0.68, s * 0.05, s * 0.07, 0, TAU); ctx.fill();
  const am = o.arm ?? 0.3; ctx.strokeStyle = '#aeb8c4'; ctx.lineWidth = s * 0.05; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s * 0.5, s * 0.25); ctx.lineTo(-s * 0.75, s * (0.35 + am * 0.3)); ctx.lineTo(-s * 0.95, s * (0.3 + am * 0.5)); ctx.stroke();
  ctx.restore();
 };
 // Arado submarino remolcado (perfil): avanza sobre patines, abre una zanja con la reja y deja el cable enterrado detrás.
 P.plow = (ctx, x, y, s, t, o = {}) => {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#e8b04a'; ctx.beginPath(); ctx.roundRect(-s * 0.6, -s * 0.5, s * 1.2, s * 0.32, s * 0.06); ctx.fill();
  ctx.strokeStyle = '#3b4552'; ctx.lineWidth = s * 0.06; ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.18); ctx.lineTo(-s * 0.8, 0); ctx.lineTo(-s * 0.2, 0); ctx.moveTo(s * 0.55, -s * 0.18); ctx.lineTo(s * 0.4, 0); ctx.lineTo(s * 0.8, 0); ctx.stroke();
  ctx.fillStyle = '#5f6b78'; ctx.beginPath(); ctx.moveTo(s * 0.05, -s * 0.2); ctx.lineTo(s * 0.25, -s * 0.2); ctx.lineTo(s * 0.2, s * 0.45); ctx.lineTo(0, s * 0.35); ctx.closePath(); ctx.fill();
  const R = H.rng(Math.floor(t * 8)); ctx.fillStyle = 'rgba(160,140,110,0.45)'; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(s * (0.1 + R() * 0.6), -s * R() * 0.25, s * R.range(0.03, 0.08), 0, TAU); ctx.fill(); }
  ctx.restore();
 };
 // Ancla (con argolla, caña, cepo y uñas) y garfio de recuperación (rezón).
 P.anchor = (ctx, x, y, s, rot = 0, c = '#8799A8') => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = c; ctx.lineWidth = s * 0.12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, -s * 0.85, s * 0.14, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s * 0.7); ctx.lineTo(0, s * 0.5); ctx.moveTo(-s * 0.32, -s * 0.48); ctx.lineTo(s * 0.32, -s * 0.48); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, s * 0.55, 0.25, Math.PI - 0.25); ctx.stroke(); ctx.fillStyle = c; for (const sd of [-1, 1]) { const ax = sd * Math.cos(0.25) * s * 0.55, ay = Math.sin(0.25) * s * 0.55; ctx.beginPath(); ctx.moveTo(ax + sd * s * 0.1, ay - s * 0.2); ctx.lineTo(ax - sd * s * 0.15, ay - s * 0.05); ctx.lineTo(ax + sd * s * 0.12, ay + s * 0.08); ctx.closePath(); ctx.fill(); }
  ctx.restore();
 };
 P.grapnel = (ctx, x, y, s, rot = 0, c = '#c9d2dc') => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = c; ctx.lineWidth = s * 0.12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -s * 0.8); ctx.lineTo(0, s * 0.3); ctx.stroke(); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, s * 0.3); ctx.quadraticCurveTo(sd * s * 0.5, s * 0.35, sd * s * 0.5, -s * 0.15); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(0, -s * 0.9, s * 0.1, 0, TAU); ctx.stroke(); ctx.restore();
 };
 // Estación de aterrizaje del cable en la costa (edificio técnico donde el cable submarino se conecta a la red terrestre).
 P.station = (ctx, x, y, s, o = {}) => {
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x - s * 0.55, y - 4, s * 1.2, 10);
  ctx.fillStyle = o.c || '#e9eef4'; ctx.fillRect(x - s * 0.5, y - s * 0.6, s, s * 0.6); ctx.fillStyle = '#8799A8'; ctx.fillRect(x - s * 0.56, y - s * 0.66, s * 1.12, s * 0.08);
  ctx.fillStyle = '#167BFF'; for (let i = 0; i < 3; i++) ctx.fillRect(x - s * 0.38 + i * s * 0.28, y - s * 0.45, s * 0.18, s * 0.14);
  ctx.fillStyle = '#5f6b78'; ctx.fillRect(x - s * 0.1, y - s * 0.24, s * 0.2, s * 0.24);
  if (o.on) { ctx.fillStyle = '#46F5BC'; ctx.beginPath(); ctx.arc(x + s * 0.36, y - s * 0.16, s * 0.05, 0, TAU); ctx.fill(); }
  ctx.restore();
 };

 // ---------------- SUBTÍTULOS (arriba, palabra a palabra, palabra clave seleccionada) ----------------
 // Trozos de ≤3 palabras (≤4 si son cortas); las palabras aparecen al decirse: la actual en blanco y negrita,
 // las ya dichas en gris; la palabra clave lleva recuadro de selección con asas en el color de acento.
 let CHUNKS = null;
 function chunks(A) {
  if (CHUNKS) return CHUNKS;
  const out = [];
  for (const ph of A.phrases) {
   const ws = ph.w.map((w, i) => ({ ...w, txt: ph.lines.join(' ').split(' ')[i] || w.w }));
   let cur = [];
   const flush = () => { if (cur.length) out.push(cur); cur = []; };
   ws.forEach((w) => { const chars = cur.reduce((s, x) => s + x.txt.length + 1, 0) + w.txt.length; if (cur.length >= 4 || (cur.length >= 3 && chars > 16) || chars > 22) flush(); cur.push(w); });
   flush();
  }
  out.forEach((c, i) => { c.s = c[0].s; c.e = i + 1 < out.length ? Math.min(out[i + 1][0].s, c[c.length - 1].e + 0.6) : c[c.length - 1].e + 0.6; });
  return (CHUNKS = out);
 }
 const nrm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]/g, '');
 function captions(ctx, A, t, cfg) {
  if (cfg.capStyle === 'barra') return captionsBar(ctx, A, t, cfg);
  const ch = chunks(A).find((c) => t >= c.s - 0.05 && t < c.e); if (!ch) return;
  const KW = cfg.keywords || [], y = cfg.capY || 300;
  const px = cfg.capPx || 64, fB = `${SK.font.capW} ${px}px "${SK.font.cap}"`, fD = `${SK.font.capDim} ${px}px "${SK.font.cap}"`;
  ctx.save(); ctx.textBaseline = 'alphabetic';
  const vis = ch.filter((w) => t >= w.s - 0.04);
  if (!vis.length) { ctx.restore(); return; }
  // reparto en 1-2 líneas
  const meas = (w, i) => { ctx.font = i === vis.length - 1 ? fB : fD; return ctx.measureText(w.txt).width; };
  ctx.font = fB; const sp = ctx.measureText(' ').width;
  const all = ch.map((w) => { ctx.font = fB; return ctx.measureText(w.txt).width; });
  const total = all.reduce((a, b) => a + b, 0) + sp * (ch.length - 1);
  let lines = [ch.map((_, i) => i)];
  if (total > 900 && ch.length > 1) { let best = 1, bd = 1e9; for (let k = 1; k < ch.length; k++) { const a = all.slice(0, k).reduce((s, v) => s + v, 0), b = all.slice(k).reduce((s, v) => s + v, 0); if (Math.abs(a - b) < bd) { bd = Math.abs(a - b); best = k; } } lines = [ch.map((_, i) => i).slice(0, best), ch.map((_, i) => i).slice(best)]; }
  const lh = px * 1.18, y0 = y - (lines.length - 1) * lh / 2;
  const fade = 1 - sm(ch.e - 0.12, ch.e, t);
  lines.forEach((ln, li) => {
   const lw = ln.reduce((s, i) => s + all[i], 0) + sp * (ln.length - 1); let x = 540 - lw / 2;
   ln.forEach((i) => {
    const w = ch[i], shown = t >= w.s - 0.04, active = shown && (i === ch.length - 1 || t < ch[i + 1].s - 0.04);
    if (shown) {
     const pop = E.out(win(t, w.s - 0.04, w.s + 0.1)), yy = y0 + li * lh + (1 - pop) * 10;
     const isKW = KW.some((k) => (Array.isArray(k) ? nrm(w.txt) === nrm(k[0]) && w.s >= k[1] && w.s <= k[2] : nrm(w.txt) === nrm(k)));
     if (isKW) { // recuadro de selección con asas
      const bx = x - 12, by = yy - px * 0.86, bw = all[i] + 24, bh = px * 1.16, ka = fade * pop;
      ctx.save(); ctx.globalAlpha = ka; ctx.fillStyle = SK.name === 'plana' ? 'rgba(20,16,60,0.28)' : 'rgba(242,184,75,0.12)'; ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = col('handle'); ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);
      ctx.fillStyle = '#ffffff'; for (const [hx, hy] of [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]]) { ctx.fillRect(hx - 7, hy - 7, 14, 14); ctx.strokeRect(hx - 7, hy - 7, 14, 14); }
      ctx.restore();
     }
     ctx.font = active || isKW ? fB : fD;
     ctx.globalAlpha = fade * pop * (active || isKW ? 1 : 0.62);
     ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 3;
     ctx.fillStyle = '#ffffff'; ctx.fillText(w.txt, x, yy); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    }
    x += all[i] + sp;
   });
  });
  ctx.restore();
 }


 // ---- estilo «barra» (estándar Asombroteca): frase completa en blanco (≤2 líneas), barra amarilla animada bajo la
 // palabra que se dice; las palabras clave se tiñen de amarillo. Posición por defecto: franja segura inferior (y≈1500).
 function captionsBar(ctx, A, t, cfg) {
  const ph = A.phrases.find((p) => t >= p.s - 0.03 && t < p.e); if (!ph) return;
  const KW = cfg.keywords || [], y = cfg.capY || 1500, maxW = 920;
  const a = sm(ph.s - 0.03, ph.s + 0.08, t) * (1 - sm(ph.e - 0.1, ph.e, t));
  let px = cfg.capPx || 60; const fam = SK.font.cap;
  ctx.save(); ctx.font = `${SK.font.capW} ${px}px "${fam}"`;
  const widest = Math.max(...ph.lines.map((l) => ctx.measureText(l).width)); if (widest > maxW) { px = Math.floor(px * maxW / widest); ctx.font = `${SK.font.capW} ${px}px "${fam}"`; }
  const lh = px * 1.24, y0 = y - (ph.lines.length - 1) * lh / 2, sp = ctx.measureText(' ').width, boxes = []; let wi = 0;
  ph.lines.forEach((ln, li) => { const lw = ctx.measureText(ln).width; let x = 540 - lw / 2; ln.split(' ').forEach((w) => { const ww = ctx.measureText(w).width, wd = ph.w[wi] || {}; boxes.push({ w, x, y: y0 + li * lh, ww, s: wd.s ?? ph.s, e: wd.e ?? ph.e }); wi++; x += ww + sp; }); });
  let act = boxes.findIndex((b) => t >= b.s && t < b.e); if (act < 0) act = t >= boxes[boxes.length - 1].s ? boxes.length - 1 : 0;
  const b0 = boxes[act], nb = boxes[act + 1]; let bx = b0.x, bw = b0.ww;
  if (nb && nb.y === b0.y) { const f = E.inOut(sm(b0.e - 0.08, b0.e, t)); bx = lerp(b0.x, nb.x, f); bw = lerp(b0.ww, nb.ww, f); }
  ctx.globalAlpha = a; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f0b90b'; ctx.beginPath(); ctx.roundRect(bx, b0.y + px * 0.2, bw, Math.max(6, px * 0.1), 4); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0.75)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 3;
  for (const b of boxes) { const kw = KW.some((k) => (Array.isArray(k) ? nrm(b.w) === nrm(k[0]) && b.s >= k[1] && b.s <= k[2] : nrm(b.w) === nrm(k))); ctx.fillStyle = kw ? '#ffd54a' : '#ffffff'; ctx.fillText(b.w, b.x, b.y); }
  ctx.restore();
 }

 // ---------------- TRANSICIONES ----------------
 // cut | iris (círculo desde un punto) | slide (barrido lateral con desenfoque de movimiento) | rise (sube) | fade | zoom (entra por un punto)
 function transition(ctx, type, u, o, drawPrev, drawNext, L) {
  const e = E.inOut(u);
  if (type === 'iris' || type === 'zoom') {
   if (type === 'zoom') { ctx.save(); const s = lerp(1, 4, e); ctx.translate(o.x, o.y); ctx.scale(s, s); ctx.translate(-o.x, -o.y); drawPrev(ctx); ctx.restore(); } else drawPrev(ctx);
   const r = lerp(0, 2300, E.in(u) * 0.35 + e * 0.65);
   ctx.save(); ctx.beginPath(); ctx.arc(o.x ?? 540, o.y ?? 960, r, 0, TAU); ctx.clip(); drawNext(ctx); ctx.restore();
   ctx.save(); ctx.strokeStyle = col('accent'); ctx.lineWidth = 18 * (1 - u); ctx.beginPath(); ctx.arc(o.x ?? 540, o.y ?? 960, r, 0, TAU); ctx.stroke(); ctx.restore();
  } else if (type === 'slide' || type === 'rise') {
   const dx = type === 'slide' ? -W * e : 0, dy = type === 'rise' ? -HH * e : 0;
   ctx.save(); ctx.translate(dx, dy); drawPrev(ctx); ctx.restore();
   ctx.save(); ctx.translate(dx + (type === 'slide' ? W : 0), dy + (type === 'rise' ? HH : 0)); drawNext(ctx); ctx.restore();
   const blur = Math.sin(u * Math.PI);
   if (blur > 0.05) { const c = L.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, HH); c.drawImage(ctx.canvas, 0, 0); ctx.save(); ctx.globalAlpha = 0.45 * blur; ctx.filter = type === 'slide' ? `blur(${10 * blur}px)` : `blur(${8 * blur}px)`; ctx.drawImage(L, 0, 0); ctx.restore(); }
  } else if (type === 'fade') {
   drawPrev(ctx); ctx.save(); ctx.globalAlpha = e; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, HH); ctx.restore();
   if (u > 0.5) { ctx.save(); ctx.globalAlpha = (u - 0.5) * 2; drawNext(ctx); ctx.restore(); }
  } else drawNext(ctx);
 }

 // ---------------- EPISODIO ----------------
 // cfg = { skin, align, duration, beats:[{t0,t1,in:{type,d,x,y}, draw(ctx,t,api), sfx(k,api)}], keywords, music(k,api), capY }
 function make(cfg) {
  SK = SKINS[cfg.skin || 'plana'];
  const A = cfg.align, D = cfg.duration;
  let LA = null, LB = null;
  const api = { P, W, HH, cl, sm, win, E, lerp, col, fill, SK: () => SK, TAU };
  function drawBeat(ctx, b, t) { ctx.save(); b.draw(ctx, t, api); ctx.restore(); }
  function explainer(ctx, Wd, Hd, t) {
   if (!LA) { LA = H.layer(W, HH); LB = H.layer(W, HH); }
   const bs = cfg.beats; let i = bs.findIndex((b) => t >= b.t0 && t < b.t1); if (i < 0) i = t < bs[0].t0 ? 0 : bs.length - 1;
   const b = bs[i], tr = b.in || { type: 'cut', d: 0 }, u = tr.d ? win(t, b.t0, b.t0 + tr.d) : 1;
   ctx.save(); ctx.fillStyle = col('ink'); ctx.fillRect(0, 0, W, HH); ctx.restore();
   if (i > 0 && u < 1 && tr.type !== 'cut') transition(ctx, tr.type, u, tr, (c) => drawBeat(c, bs[i - 1], t), (c) => drawBeat(c, b, t), LA);
   else drawBeat(ctx, b, t);
   // acabado de la piel
   H.vignette(ctx, W, HH, SK.vignette, SK.vigCol);
   captions(ctx, A, t, cfg);
   if (SK.grain) H.grain(ctx, W, HH, SK.grain, 1 + Math.floor(t * 24), true);
  }
  // sonido: cada beat declara sus efectos; el motor añade las transiciones
  const TS = TRANS_SFX;
  function scoreSound(k) {
   cfg.beats.forEach((b, i) => { if (i > 0 && b.in && b.in.type !== 'cut' && TS[b.in.type]) TS[b.in.type](k, b.t0, b.in.d || 0.5); if (b.sfx) b.sfx(k, api); });
   if (cfg.ambience) cfg.ambience(k, api);
  }
  function scoreMusic(k) { if (cfg.music) cfg.music(k, api); }
  return { explainer, scoreSound, scoreMusic, DURATION: D };
 }
 // sonidos de transición (paleta del medio: papel/tinta plana → swish y whoosh suaves)
 const TRANS_SFX = {
  iris: (k, t, d) => { k.play('whoosh', t - 0.05, { dur: d + 0.1, top: 1800, gain: 0.45, minor: true }); k.play('pop', t + d * 0.6, { f: 420, gain: 0.3, minor: true }); },
  zoom: (k, t, d) => { k.play('riser', t - 0.2, { dur: d + 0.2, gain: 0.3, minor: true }); k.play('whoosh', t, { dur: d, top: 2600, gain: 0.45, minor: true }); },
  slide: (k, t, d) => k.play('swish', t, { dur: Math.max(0.2, d * 0.8), gain: 0.55, minor: true }),
  rise: (k, t, d) => k.play('whoosh', t, { dur: d + 0.1, top: 1400, gain: 0.45, minor: true }),
  fade: (k, t, d) => k.noise(t, { dur: d + 0.3, color: 'brown', filter: 'lowpass', f: [[0, 600], [d + 0.3, 120]], gain: 0.12, a: d * 0.5, minor: true }),
 };
 // efectos con nombre para los bloques (consistencia entre episodios)
 const FX = {
  aparece: (k, t, f = 560) => k.play('pop', t, { f, gain: 0.5 }),
  etiqueta: (k, t) => { k.play('pop', t, { f: 700, gain: 0.35, minor: true }); k.play('tick', t + 0.02, { gain: 0.25, minor: true }); },
  flecha: (k, t, d = 0.4) => k.play('swish', t, { dur: d, gain: 0.35, minor: true }),
  tachado: (k, t) => { k.play('error', t, { f: 'A3', gain: 0.4 }); k.play('slap', t, { gain: 0.3, minor: true }); },
  correcto: (k, t) => k.play('success', t, { gain: 0.4 }),
  sello: (k, t) => k.play('stamp', t, { gain: 0.5 }),
  contador: (k, t0, t1, from, to) => { let last = -1; const val = (t) => Math.round(lerp(from, to, E.out(win(t, t0, t1)))); let prev = val(t0); for (let t = t0; t <= t1; t += 0.005) { const v = val(t); if (v !== prev && t - last >= 1 / 12) { k.play('count', t, { gain: 0.9, minor: true }); last = t; } prev = v; } k.play('tock', t1, { f: 520, gain: 0.5 }); },
  onomatopeya: (k, t) => k.play('slap', t, { gain: 0.35, minor: true }),
  burbujas: (k, t, d, rate = 9, seed = 1, g = 1) => { const R = H.rng(seed); for (let x = 0; x < d; x += 1 / rate) { const f = 380 + R() * 700; k.tone(t + x + R() * 0.05, { f: [[0, f], [0.06, f * 1.7]], dur: 0.07, gain: 0.05 * g, a: 0.004, pan: R() - 0.5, minor: true }); } },
  siseo: (k, t, d) => k.noise(t, { dur: d, color: 'white', filter: 'highpass', f: [[0, 2500], [0.3, 3800], [d, 2000]], gain: 0.07, a: 0.05, hold: d * 0.7 }),
  agua: (k, t, d) => k.noise(t, { dur: d, color: 'pink', filter: 'lowpass', f: [[0, 400], [Math.min(1, d * 0.4), 1300], [d, 500]], gain: 0.12, a: 0.3, hold: d * 0.6 }),
  alarma: (k, t, n = 3) => { for (let i = 0; i < n; i++) k.tone(t + i * 0.36, { f: [[0, 760], [0.16, 620]], type: 'square', dur: 0.3, gain: 0.05, filter: 'lowpass', f2: 1800, a: 0.01 }); },
  sonar: (k, t, g = 1) => { for (let e = 0; e < 3; e++) k.tone(t + e * 0.42, { f: 1180, dur: 1.1, gain: 0.1 * g * Math.pow(0.42, e), a: 0.004, verb: 0.4, minor: e > 0 }); },
  crujido: (k, t, g = 1, f = 90) => k.tone(t, { f: [[0, f], [0.35, f * 0.8], [0.6, f * 1.05]], type: 'sawtooth', dur: 0.65, gain: 0.05 * g, filter: 'bandpass', f2: f * 4, q: 3, a: 0.08 }),
  golpeSordo: (k, t) => { k.play('thud', t, { f: 55, gain: 0.55 }); k.noise(t, { dur: 1.2, color: 'brown', filter: 'lowpass', f: [[0, 400], [1.2, 80]], gain: 0.18, a: 0.01 }); },
  domino: (k, t) => { k.play('tock', t, { f: 380, gain: 0.5 }); k.play('click', t + 0.03, { gain: 0.4, minor: true }); },
  clic: (k, t) => k.play('click', t, { gain: 0.6 }),
  campana: (k, t) => k.play('bell', t, { f: 'A3', gain: 0.18 }),
  // v1.2 · aparatos y ciencia
  pitido: (k, t, f = 'E6', n = 1) => { for (let i = 0; i < n; i++) k.tone(t + i * 0.16, { f, type: 'square', dur: 0.1, gain: 0.05, a: 0.003, hold: 0.07, filter: 'lowpass', f2: 3200 }); },
  zumbido: (k, t, d, g = 1) => { k.tone(t, { f: 120, type: 'sawtooth', dur: d, gain: 0.03 * g, a: 0.15, hold: d * 0.85, filter: 'lowpass', f2: 600 }); k.tone(t, { f: 60, dur: d, gain: 0.06 * g, a: 0.15, hold: d * 0.85 }); k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: 900, q: 1.5, gain: 0.025 * g, a: 0.2, hold: d * 0.8 }); },
  motor: (k, t, d, g = 1) => { k.tone(t, { f: 48, type: 'triangle', dur: d, gain: 0.05 * g, a: 0.3, hold: d * 0.8 }); for (let x = 0; x < d; x += 0.5) k.play('tick', t + x, { f: 2400, gain: 0.08 * g, minor: true }); },
  campo: (k, t, d = 1.2, g = 1) => { const R = H.rng(Math.round(t * 100)); for (let x = 0; x < d; x += 0.07) k.tone(t + x, { f: [523, 659, 784, 988, 1175][Math.floor(R() * 5)], dur: 0.5, gain: 0.02 * g, a: 0.02, filter: 'lowpass', f2: 2200, verb: 0.4, pan: R() * 1.2 - 0.6, minor: true }); k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: 2400, q: 2, gain: 0.03 * g, a: d * 0.4 }); },
  escala: (k, t, d = 1) => { k.play('riser', t, { dur: d, gain: 0.35 }); k.tone(t + d, { f: [[0, 90], [0.4, 45]], dur: 0.6, gain: 0.25 }); },
  revelar: (k, t) => { k.play('whoosh', t, { dur: 0.6, top: 2000, gain: 0.35, minor: true }); k.play('ding', t + 0.35, { f: 'C6', gain: 0.18, minor: true }); },
  puerta: (k, t) => { k.play('click', t, { gain: 0.7 }); k.play('thud', t + 0.03, { f: 160, gain: 0.25 }); k.noise(t + 0.05, { dur: 0.35, color: 'pink', filter: 'bandpass', f: 1200, q: 1, gain: 0.05, a: 0.05 }); },
  // v1.4 · aire y refrigeración
  ventilador: (k, t, d, g = 1, f = 300) => { k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, f * 0.6], [Math.min(1.5, d * 0.3), f], [d, f]], q: 0.9, gain: 0.05 * g, a: Math.min(1.2, d * 0.3), hold: d * 0.7 }); },
  compresion: (k, t, d = 1.2) => { k.tone(t, { f: [[0, 70], [d, 140]], type: 'sawtooth', dur: d, gain: 0.05, filter: 'lowpass', f2: 700, a: 0.2 }); k.play('riser', t, { dur: d, gain: 0.25 }); k.play('thud', t + d, { f: 90, gain: 0.35 }); },
  expansion: (k, t, d = 0.9) => { k.noise(t, { dur: d, color: 'white', filter: 'highpass', f: [[0, 5000], [d, 2200]], gain: 0.09, a: 0.01 }); k.tone(t, { f: [[0, 900], [d, 300]], dur: d, gain: 0.03, filter: 'lowpass', f2: 1500 }); },
  goteo: (k, t, n = 5, gap = 0.22, seed = 5) => { const R = H.rng(seed); for (let i = 0; i < n; i++) { const f = 600 + R() * 500; k.tone(t + i * gap + R() * 0.05, { f: [[0, f * 1.6], [0.08, f]], dur: 0.12, gain: 0.05, a: 0.003, pan: R() - 0.5, minor: true }); } },
  calor: (k, t, d = 1.5, g = 1) => k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: [[0, 200], [d * 0.6, 600], [d, 250]], gain: 0.12 * g, a: d * 0.4, hold: d * 0.2 }),
  // v1.5 · señales, tiempo y ubicación
  senal: (k, t, g = 1, f = 1400) => { k.tone(t, { f: [[0, f], [0.12, f * 0.92]], type: 'sine', dur: 0.18, gain: 0.07 * g, a: 0.004, verb: 0.3 }); k.tone(t + 0.16, { f: f * 1.5, type: 'sine', dur: 0.12, gain: 0.04 * g, a: 0.004, minor: true }); },
  datos: (k, t, n = 10, g = 1) => { for (let i = 0; i < n; i++) k.tone(t + i * 0.045, { f: i % 2 ? 2100 : 1600, type: 'square', dur: 0.03, gain: 0.025 * g, a: 0.002, hold: 0.02, filter: 'lowpass', f2: 4000, minor: true }); },
  tictac: (k, t, n = 4, gap = 0.5) => { for (let i = 0; i < n; i++) k.play('tock', t + i * gap, { f: i % 2 ? 1500 : 1900, gain: 0.3, minor: true }); },
  ubicacion: (k, t) => { k.tone(t, { f: 'E5', dur: 0.5, gain: 0.12, verb: 0.3 }); k.tone(t + 0.1, { f: 'B5', dur: 0.6, gain: 0.11, verb: 0.3 }); k.tone(t + 0.2, { f: 'E6', dur: 0.9, gain: 0.09, verb: 0.35 }); },
  fin: (k, t) => { k.tone(t, { f: 'E6', dur: 1.6, gain: 0.16, verb: 0.3 }); k.tone(t, { f: 'E7', dur: 0.6, gain: 0.04 }); },
  // v1.6 · océano, cables y telecomunicaciones
  bajoAgua: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: 240, gain: 0.08 * g, a: Math.min(1, d * 0.3), hold: d * 0.7 }); FX.burbujas(k, t, d, 1.4, Math.round(t * 10) + 3, 0.6 * g); },
  inmersion: (k, t, d = 1.2) => { k.noise(t, { dur: d, color: 'pink', filter: 'lowpass', f: [[0, 3200], [d, 200]], gain: 0.24, a: 0.02 }); k.play('thud', t, { f: 80, gain: 0.25 }); FX.burbujas(k, t, d * 0.8, 16, 3, 1.4); },
  olas: (k, t, d, g = 1) => k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 450], [d * 0.5, 900], [d, 450]], q: 0.6, gain: 0.07 * g, a: Math.min(1, d * 0.3), hold: d * 0.5 }),
  pulsoLuz: (k, t, n = 4, gap = 0.16, g = 1) => { for (let i = 0; i < n; i++) k.tone(t + i * gap, { f: [[0, 2500 + (i % 3) * 180], [0.1, 2300]], dur: 0.25, gain: 0.035 * g, a: 0.003, verb: 0.35, minor: true }); },
  amplifica: (k, t, g = 1) => { k.tone(t, { f: [[0, 300], [0.35, 900]], type: 'triangle', dur: 0.4, gain: 0.05 * g, a: 0.3 }); k.play('ding', t + 0.35, { f: 'E6', gain: 0.14 * g, minor: true }); },
  cabrestante: (k, t, d, g = 1) => { k.tone(t, { f: 55, type: 'sawtooth', dur: d, gain: 0.035 * g, filter: 'lowpass', f2: 420, a: 0.2, hold: d * 0.8 }); for (let x = 0; x < d; x += 0.12) k.play('tick', t + x, { f: 1700, gain: 0.12 * g, minor: true }); },
  ancla: (k, t) => { const R = H.rng(Math.round(t * 100)); for (let i = 0; i < 10; i++) k.play('tick', t + i * 0.05 + R() * 0.02, { f: 2800 + R() * 1600, gain: 0.22, minor: true }); k.play('thud', t + 0.55, { f: 70, gain: 0.45 }); k.noise(t + 0.55, { dur: 0.8, color: 'brown', filter: 'lowpass', f: 600, gain: 0.15 }); },
  rotura: (k, t) => { k.noise(t, { dur: 0.12, filter: 'highpass', f: 1500, gain: 0.4, a: 0.001 }); k.play('thud', t, { f: 110, gain: 0.4 }); k.tone(t + 0.02, { f: [[0, 900], [0.3, 120]], type: 'sawtooth', dur: 0.32, gain: 0.04, filter: 'lowpass', f2: 2000 }); },
  empalme: (k, t, d = 0.8) => { const R = H.rng(Math.round(t * 100) + 7); for (let x = 0; x < d; x += 0.03 + R() * 0.04) k.noise(t + x, { dur: 0.02, filter: 'highpass', f: 4000, gain: 0.12 + R() * 0.1, minor: true }); k.tone(t, { f: 240, type: 'square', dur: d, gain: 0.015, filter: 'lowpass', f2: 1500, a: 0.02, hold: d * 0.8 }); },
 };
 window.PLANTILLA = { make, SKINS, P, FX, TRANS_SFX, setSkin: (n) => (SK = SKINS[n]), W, HH };
})();
