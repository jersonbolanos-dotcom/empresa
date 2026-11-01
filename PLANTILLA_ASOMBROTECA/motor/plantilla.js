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

 // ======================= v1.7 · AGUA, ENERGÍA Y ELECTRICIDAD (centrales, máquinas, red eléctrica) =======================
 const polyPath = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
 // Masa de agua (embalse, río, canal) en un polígono: degradado por profundidad entre o.top y o.bottom y, si o.surf = [x0, x1, y],
 // superficie con brillo que se mueve. o: { c1, c2, c3, a }
 P.waterBody = (ctx, pts, t, o = {}) => {
  const ys = pts.map((p) => p[1]), top = o.top ?? Math.min(...ys), bot = o.bottom ?? Math.max(...ys);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; const g = ctx.createLinearGradient(0, top, 0, bot); g.addColorStop(0, o.c1 || '#38C9FF'); g.addColorStop(0.18, o.c2 || '#1a86c8'); g.addColorStop(1, o.c3 || '#0a3358'); ctx.fillStyle = g; polyPath(ctx, pts); ctx.fill();
  if (o.surf) { const [x0, x1, y] = o.surf; ctx.clip(); ctx.strokeStyle = 'rgba(245,250,255,0.75)'; ctx.lineWidth = 3; ctx.beginPath(); for (let x = x0; x <= x1; x += 8) { const yy = y + Math.sin(x * 0.03 + t * 2) * 2; x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); ctx.strokeStyle = 'rgba(245,250,255,0.25)'; ctx.lineWidth = 2; for (let k = 0; k < 6; k++) { const xx = x0 + ((k * 0.17 + t * 0.03) % 1) * (x1 - x0), yy = y + 10 + k * 7; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 40 + k * 6, yy); ctx.stroke(); } }
  ctx.restore();
 };
 // Hormigón (represas, muros, edificios técnicos) en un polígono: textura de juntas de vertido y manchas de humedad.
 // o: { c, joints (px entre juntas), stains, light ('left' | 'right') }
 P.concrete = (ctx, pts, o = {}) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  ctx.save(); polyPath(ctx, pts); const g = ctx.createLinearGradient(x0, 0, x1, 0); const c = H.hex(o.c || '#778A99'), dk = H.rgba([c[0] * 0.72, c[1] * 0.72, c[2] * 0.72]), lt = H.rgba([Math.min(255, c[0] * 1.15), Math.min(255, c[1] * 1.15), Math.min(255, c[2] * 1.15)]);
  g.addColorStop(0, o.light === 'right' ? dk : lt); g.addColorStop(1, o.light === 'right' ? lt : dk); ctx.fillStyle = g; ctx.fill(); ctx.clip();
  ctx.strokeStyle = 'rgba(20,30,40,0.22)'; ctx.lineWidth = 2; for (let y = y0 + (o.joints || 46); y < y1; y += o.joints || 46) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
  const R = H.rng(o.seed || 17); for (let i = 0; i < (o.stains ?? 14); i++) { const sx = x0 + R() * (x1 - x0), sy = y0 + R() * (y1 - y0) * 0.6, sh = R.range(40, 200); const sg = ctx.createLinearGradient(0, sy, 0, sy + sh); sg.addColorStop(0, 'rgba(30,40,50,0.18)'); sg.addColorStop(1, 'rgba(30,40,50,0)'); ctx.fillStyle = sg; ctx.fillRect(sx, sy, R.range(4, 14), sh); }
  ctx.restore(); ctx.save(); ctx.strokeStyle = 'rgba(10,20,30,0.5)'; ctx.lineWidth = 3; polyPath(ctx, pts); ctx.stroke(); ctx.restore();
 };
 // Tubería (forzada, conducto) a lo largo de pts: pared metálica, sección transparente y agua que la LLENA y fluye.
 // o: { fill 0..1 (hasta dónde llegó el agua), flow 0..1 (velocidad relativa), speed px/s, glass (pared translúcida), c }
 P.pipe = (ctx, pts, w, t, o = {}) => {
  const L = P.path(pts), fill = cl(o.fill ?? 1), flow = o.flow ?? 1;
  P.strokePath(ctx, pts, w + 14, '#293F52', { cap: 'butt' }); P.strokePath(ctx, pts, w + 6, '#B8CCD8', { cap: 'butt', a: 0.55 });
  P.strokePath(ctx, pts, w, o.glass === false ? '#1b2b3a' : 'rgba(10,30,50,0.9)', { cap: 'butt' });
  if (fill > 0) { const part = []; let acc = 0; part.push(pts[0]); for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (acc + d >= L.L * fill) { const q = L.at(L.L * fill); part.push([q[0], q[1]]); break; } acc += d; part.push(pts[i]); }
   P.strokePath(ctx, part, w * 0.86, o.c || '#1a86c8', { cap: 'butt' }); P.strokePath(ctx, part, w * 0.3, 'rgba(56,201,255,0.45)', { cap: 'butt' });
   if (flow > 0) { const sp = (o.speed || 300) * flow, n = Math.ceil(L.L / 70); ctx.save(); ctx.strokeStyle = 'rgba(220,245,255,0.8)'; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(2, w * 0.08); for (let i = 0; i < n; i++) for (const off of [-0.22, 0.05, 0.25]) { const s = ((t * sp + i * 70 + off * 97) % L.L + L.L) % L.L; if (s > L.L * fill - 10) continue; const [x, y, a] = L.at(s), nx = -Math.sin(a) * w * off, ny = Math.cos(a) * w * off, len = Math.min(40, 14 + 26 * flow); ctx.beginPath(); ctx.moveTo(x + nx - Math.cos(a) * len / 2, y + ny - Math.sin(a) * len / 2); ctx.lineTo(x + nx + Math.cos(a) * len / 2, y + ny + Math.sin(a) * len / 2); ctx.stroke(); } ctx.restore(); }
  }
  return L;
 };
 // Compuerta de toma (deslizante vertical con guías). open 0..1 = cuánto se ha levantado.
 P.gate = (ctx, x, y, w, h, open = 0) => {
  ctx.save(); ctx.fillStyle = '#293F52'; ctx.fillRect(x - 10, y - h * 1.1, 10, h * 2.2); ctx.fillRect(x + w, y - h * 1.1, 10, h * 2.2);
  const gy = y - h * open; const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#5d7387'); g.addColorStop(0.5, '#B8CCD8'); g.addColorStop(1, '#5d7387'); ctx.fillStyle = g; ctx.fillRect(x, gy, w, h);
  ctx.strokeStyle = 'rgba(20,30,40,0.6)'; ctx.lineWidth = 2; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x, gy + h * k / 4); ctx.lineTo(x + w, gy + h * k / 4); ctx.stroke(); } ctx.fillStyle = '#FF9D4D'; ctx.fillRect(x, gy, w, 6); ctx.restore();
 };
 // Turbina Francis vista desde arriba: carcasa espiral, álabes directrices (FIJOS, se orientan con o.open) y rodete (GIRA con ang).
 // o: { casing, open 0..1, flow 0..1 (trazadores de agua entrando en espiral), t, blades }
 P.francis = (ctx, x, y, r, ang, o = {}) => {
  const t = o.t || 0, flow = o.flow ?? 0; ctx.save();
  if (o.casing !== false) { ctx.fillStyle = '#293F52'; ctx.beginPath(); for (let k = 0; k <= 64; k++) { const a = -Math.PI / 2 + k / 64 * TAU, rr = r * (1.02 + 0.5 * (1 - k / 64)); const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.lineTo(x + r * 1.52, y - r * 1.52); ctx.lineTo(x + r * 1.95, y - r * 1.52); ctx.lineTo(x + r * 1.95, y - r * 0.6); ctx.lineTo(x + r * 1.02, y - r * 0.1); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#B8CCD8'; ctx.lineWidth = 3; ctx.stroke();
   ctx.fillStyle = 'rgba(18,104,168,0.85)'; ctx.beginPath(); ctx.arc(x, y, r * 1.0, 0, TAU); ctx.fill(); }
  if (flow > 0) { ctx.save(); ctx.strokeStyle = `rgba(200,240,255,${0.75 * flow})`; ctx.lineWidth = Math.max(2, r * 0.018); ctx.lineCap = 'round'; for (let i = 0; i < 26; i++) { const u = ((t * 0.5 * flow + i / 26) % 1), a = -Math.PI / 2 + u * TAU * 1.15 + i * 0.7, rr = r * (1.45 - u * 0.75); ctx.beginPath(); ctx.arc(x, y, rr, a, a + 0.25); ctx.stroke(); } ctx.restore(); }
  const nv = 18, op = o.open ?? 0.7; for (let i = 0; i < nv; i++) { const a = i / nv * TAU, px = x + Math.cos(a) * r * 0.88, py = y + Math.sin(a) * r * 0.88; ctx.save(); ctx.translate(px, py); ctx.rotate(a + Math.PI / 2 + 0.5 + (1 - op) * 0.9); ctx.fillStyle = '#9fb3c2'; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.1, r * 0.028, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#3b5266'; ctx.beginPath(); ctx.arc(x, y, r * 0.74, 0, TAU); ctx.fill();
  const nb = o.blades || 13; ctx.strokeStyle = '#d6e3ec'; ctx.lineWidth = r * 0.05; ctx.lineCap = 'round'; for (let i = 0; i < nb; i++) { const a = ang + i / nb * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7); ctx.quadraticCurveTo(x + Math.cos(a + 0.45) * r * 0.48, y + Math.sin(a + 0.45) * r * 0.48, x + Math.cos(a + 0.75) * r * 0.24, y + Math.sin(a + 0.75) * r * 0.24); ctx.stroke(); }
  ctx.fillStyle = '#B8CCD8'; ctx.beginPath(); ctx.arc(x, y, r * 0.22, 0, TAU); ctx.fill(); ctx.fillStyle = '#293F52'; ctx.beginPath(); ctx.arc(x, y, r * 0.12, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#FF9D4D'; ctx.lineWidth = r * 0.03; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * r * 0.12, y + Math.sin(ang) * r * 0.12); ctx.stroke();
  ctx.restore();
 };
 // Rueda de molino (de paletas, madera) que gira con ang
 P.waterwheel = (ctx, x, y, r, ang, o = {}) => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.strokeStyle = o.c || '#8a5a32'; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * 0.82, 0, TAU); ctx.stroke();
  const n = 12; for (let i = 0; i < n; i++) { const a = i / n * TAU; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82); ctx.stroke(); ctx.save(); ctx.rotate(a); ctx.fillStyle = '#a8703f'; ctx.fillRect(r * 0.8, -r * 0.05, r * 0.32, r * 0.1); ctx.restore(); }
  ctx.fillStyle = '#5a3a20'; ctx.beginPath(); ctx.arc(0, 0, r * 0.14, 0, TAU); ctx.fill(); ctx.restore();
 };
 // Generador en corte (vista desde el eje): ESTATOR fijo con bobinas y ROTOR que gira con polos N/S (electroimanes).
 // o: { poles (par), slots, field 0..1 (líneas de campo conceptuales), current 0..1 (bobinas que se encienden al pasar un polo) }
 P.genSection = (ctx, x, y, r, ang, o = {}) => {
  const np = o.poles || 8, ns = o.slots || 36, field = o.field ?? 0, cur = o.current ?? 0; ctx.save();
  ctx.fillStyle = '#293F52'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.arc(x, y, r * 0.7, 0, TAU, true); ctx.fill(); ctx.strokeStyle = '#B8CCD8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  for (let i = 0; i < ns; i++) { const a = i / ns * TAU, k = Math.abs(Math.cos(np / 2 * (a - ang))), lit = cur * Math.pow(k, 6); const cx = x + Math.cos(a) * r * 0.8, cy = y + Math.sin(a) * r * 0.8; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.fillStyle = '#c47a3a'; ctx.fillRect(-r * 0.09, -r * 0.035, r * 0.18, r * 0.07); if (lit > 0.03) { ctx.fillStyle = `rgba(255,212,71,${lit})`; ctx.fillRect(-r * 0.09, -r * 0.035, r * 0.18, r * 0.07); } ctx.restore(); if (lit > 0.3) P.glow(ctx, cx, cy, r * 0.12, '255,212,71', 0.5 * lit); }
  ctx.fillStyle = '#16283a'; ctx.beginPath(); ctx.arc(x, y, r * 0.69, 0, TAU); ctx.fill();
  for (let i = 0; i < np; i++) { const a = ang + i / np * TAU, N = i % 2 === 0; ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = N ? '#d9534f' : '#3f7fd1'; ctx.beginPath(); ctx.moveTo(r * 0.3, -r * 0.1); ctx.lineTo(r * 0.62, -r * 0.17); ctx.arc(0, 0, r * 0.64, -0.27, 0.27); ctx.lineTo(r * 0.3, r * 0.1); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#c47a3a'; ctx.fillRect(r * 0.33, -r * 0.13, r * 0.2, r * 0.26); ctx.restore();
   const lx = x + Math.cos(a) * r * 0.5, ly = y + Math.sin(a) * r * 0.5; ctx.save(); ctx.fillStyle = '#F5FAFF'; ctx.font = `800 ${r * 0.09}px Nunito`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(N ? 'N' : 'S', lx, ly); ctx.restore(); }
  if (field > 0) { ctx.save(); ctx.strokeStyle = `rgba(85,232,255,${0.55 * field})`; ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]); ctx.lineDashOffset = -(o.t || 0) * 30; for (let i = 0; i < np; i++) { const a0 = ang + i / np * TAU, a1 = ang + (i + 1) / np * TAU; for (const k of [0.66, 0.74]) { ctx.beginPath(); ctx.moveTo(x + Math.cos(a0) * r * 0.64, y + Math.sin(a0) * r * 0.64); const am = (a0 + a1) / 2; ctx.quadraticCurveTo(x + Math.cos(am) * r * (k + 0.3), y + Math.sin(am) * r * (k + 0.3), x + Math.cos(a1) * r * 0.64, y + Math.sin(a1) * r * 0.64); ctx.stroke(); } } ctx.restore(); }
  ctx.fillStyle = '#B8CCD8'; ctx.beginPath(); ctx.arc(x, y, r * 0.2, 0, TAU); ctx.fill(); ctx.fillStyle = '#293F52'; ctx.beginPath(); ctx.arc(x, y, r * 0.1, 0, TAU); ctx.fill();
  ctx.restore();
 };
 // Onda de corriente alterna que avanza (osciloscopio). o: { cycles, c, a, phases (1 o 3), lw, grid }
 P.sine = (ctx, x, y, w, h, t, o = {}) => {
  const a = o.a ?? 1; if (a <= 0) return; const cyc = o.cycles || 3, ph = o.phases || 1, cols = o.c ? [o.c] : ['#FFD447', '#FF9D4D', '#55E8FF']; ctx.save(); ctx.globalAlpha *= a;
  if (o.grid !== false) { ctx.strokeStyle = 'rgba(245,250,255,0.18)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke(); }
  for (let p = 0; p < ph; p++) { ctx.strokeStyle = cols[p % cols.length]; ctx.lineWidth = o.lw || 5; ctx.beginPath(); for (let i = 0; i <= w; i += 3) { const yy = y - Math.sin((i / w) * cyc * TAU - t * (o.speed || 6) + p * TAU / 3) * h / 2 * (o.amp ?? 1); i ? ctx.lineTo(x + i, yy) : ctx.moveTo(x + i, yy); } ctx.stroke(); }
  ctx.restore();
 };
 // Transformador: núcleo laminado y dos devanados (n1 vueltas a la izquierda, n2 a la derecha). n2 > n1 = eleva la tensión.
 // El flujo magnético (conceptual) recorre el núcleo. o: { n1, n2, flux 0..1, t, glow1, glow2 }
 P.transformer = (ctx, x, y, s, o = {}) => {
  const n1 = o.n1 || 4, n2 = o.n2 || 12, w = s * 1.6, h = s * 1.2, th = s * 0.26; ctx.save();
  ctx.fillStyle = '#5d6f80'; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.fillStyle = o.bg || '#061522'; ctx.fillRect(x - w / 2 + th, y - h / 2 + th, w - 2 * th, h - 2 * th);
  ctx.strokeStyle = 'rgba(20,30,40,0.35)'; ctx.lineWidth = 1; for (let k = 4; k < th; k += 5) { ctx.strokeRect(x - w / 2 + k, y - h / 2 + k, w - 2 * k, h - 2 * k); }
  if ((o.flux ?? 0) > 0) { ctx.strokeStyle = `rgba(85,232,255,${0.7 * o.flux})`; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -(o.t || 0) * 60; ctx.strokeRect(x - w / 2 + th / 2, y - h / 2 + th / 2, w - th, h - th); ctx.setLineDash([]); }
  const coil = (cx, n, g) => { const ch = h - 2 * th + 10; for (let i = 0; i < n; i++) { const yy = y - ch / 2 + (i + 0.5) * ch / n; ctx.strokeStyle = '#c47a3a'; ctx.lineWidth = Math.max(3, ch / n * 0.7); ctx.beginPath(); ctx.ellipse(cx, yy, th * 0.85, ch / n * 0.4, 0, 0, TAU); ctx.stroke(); if (g > 0) { ctx.strokeStyle = `rgba(255,212,71,${g})`; ctx.stroke(); } } };
  coil(x - w / 2 + th / 2, n1, o.glow1 || 0); coil(x + w / 2 - th / 2, n2, o.glow2 || 0);
  ctx.restore();
 };
 // Torre de alta tensión (celosía). Devuelve los 3 puntos de amarre de los cables [[x, y]…].
 P.pylon = (ctx, x, y, h, o = {}) => {
  const c = o.c || '#B8CCD8', w = h * 0.32; ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = Math.max(1.5, h * 0.012); ctx.lineJoin = 'round';
  const top = y - h, legs = [[x - w / 2, y], [x - w * 0.08, top + h * 0.12], [x + w * 0.08, top + h * 0.12], [x + w / 2, y]];
  ctx.beginPath(); ctx.moveTo(...legs[0]); ctx.lineTo(...legs[1]); ctx.moveTo(...legs[3]); ctx.lineTo(...legs[2]); ctx.stroke();
  for (let k = 0; k < 6; k++) { const u0 = k / 6, u1 = (k + 1) / 6, l0 = [lerp(legs[0][0], legs[1][0], u0), lerp(y, top + h * 0.12, u0)], r1 = [lerp(legs[3][0], legs[2][0], u1), lerp(y, top + h * 0.12, u1)], r0 = [lerp(legs[3][0], legs[2][0], u0), lerp(y, top + h * 0.12, u0)], l1 = [lerp(legs[0][0], legs[1][0], u1), lerp(y, top + h * 0.12, u1)]; ctx.beginPath(); ctx.moveTo(...l0); ctx.lineTo(...r1); ctx.moveTo(...r0); ctx.lineTo(...l1); ctx.stroke(); }
  const arms = [top + h * 0.12, top + h * 0.3]; ctx.beginPath(); ctx.moveTo(x - w * 0.75, arms[0]); ctx.lineTo(x + w * 0.75, arms[0]); ctx.moveTo(x - w * 0.55, arms[1]); ctx.lineTo(x + w * 0.55, arms[1]); ctx.moveTo(x, top); ctx.lineTo(x, top + h * 0.12); ctx.stroke(); ctx.restore();
  return [[x - w * 0.75, arms[0] + 8], [x + w * 0.75, arms[0] + 8], [x - w * 0.55, arms[1] + 8]];
 };
 // Cable aéreo con flecha (catenaria) entre a y b; o.dots = paquetes de energía que viajan (amarillo), o.t, o.c, o.w
 P.powerLine = (ctx, a, b, sag, t, o = {}) => {
  const pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) + sag * 4 * u * (1 - u)]); }
  P.strokePath(ctx, pts, o.w || 2.5, o.c || 'rgba(200,215,225,0.8)');
  if (o.dots) { const L = P.path(pts); for (let k = 0; k < o.dots; k++) { const s = ((t * (o.speed || 200) + k * L.L / o.dots) % L.L); const [x, y] = L.at(s); P.glow(ctx, x, y, 16, '255,212,71', 0.9); P.circle(ctx, x, y, 3.5, '#FFF4C2'); } }
 };
 // Casa (fachada) con ventanas que se encienden (lit 0..1); fábrica con chimenea sin humo; ciudad (siluetas con ventanas)
 P.house = (ctx, x, y, s, lit = 0, o = {}) => {
  ctx.save(); ctx.fillStyle = o.wall || '#d8dee6'; ctx.fillRect(x - s * 0.5, y - s * 0.6, s, s * 0.6); ctx.fillStyle = o.roof || '#a8503c'; ctx.beginPath(); ctx.moveTo(x - s * 0.62, y - s * 0.58); ctx.lineTo(x, y - s * 1.02); ctx.lineTo(x + s * 0.62, y - s * 0.58); ctx.closePath(); ctx.fill();
  for (const dx of [-0.28, 0.28]) { ctx.fillStyle = lit > 0 ? `rgba(255,${200 + 30 * lit},${90 + 40 * lit},${0.35 + 0.65 * lit})` : '#2a3b4c'; ctx.fillRect(x + s * dx - s * 0.12, y - s * 0.45, s * 0.24, s * 0.2); if (lit > 0.2) P.glow(ctx, x + s * dx, y - s * 0.35, s * 0.35, '255,212,71', 0.35 * lit); }
  ctx.fillStyle = '#5b4636'; ctx.fillRect(x - s * 0.08, y - s * 0.3, s * 0.16, s * 0.3); ctx.restore();
 };
 P.factory = (ctx, x, y, s, lit = 0) => {
  ctx.save(); ctx.fillStyle = '#8a97a4'; ctx.fillRect(x - s * 0.7, y - s * 0.5, s * 1.4, s * 0.5); ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(x - s * 0.7 + i * s * 0.35, y - s * 0.5); ctx.lineTo(x - s * 0.7 + i * s * 0.35, y - s * 0.75); ctx.lineTo(x - s * 0.7 + (i + 1) * s * 0.35, y - s * 0.5); } ctx.fill();
  ctx.fillRect(x + s * 0.4, y - s * 1.1, s * 0.14, s * 0.6); for (let i = 0; i < 5; i++) { ctx.fillStyle = lit > 0 ? `rgba(255,220,120,${0.3 + 0.7 * lit})` : '#2a3b4c'; ctx.fillRect(x - s * 0.62 + i * s * 0.26, y - s * 0.35, s * 0.16, s * 0.14); } ctx.restore();
 };
 P.skyline = (ctx, x0, x1, y, lit = 0, seed = 3, o = {}) => {
  const R = H.rng(seed); ctx.save(); let x = x0; while (x < x1) { const bw = R.range(40, 90), bh = R.range(80, o.maxH || 300); ctx.fillStyle = o.c || '#1b2f42'; ctx.fillRect(x, y - bh, bw - 6, bh); for (let wy = y - bh + 12; wy < y - 14; wy += 22) for (let wx = x + 8; wx < x + bw - 18; wx += 16) { const on = R() < lit * 0.9; ctx.fillStyle = on ? 'rgba(255,212,71,0.9)' : 'rgba(80,100,120,0.35)'; ctx.fillRect(wx, wy, 7, 10); } x += bw; } if (lit > 0) P.glow(ctx, (x0 + x1) / 2, y - 80, (x1 - x0) * 0.6, '255,212,71', 0.18 * lit); ctx.restore();
 };
 // Bombilla (on 0..1 = encendida, con halo y rayos) e interruptor de pared
 P.bulb = (ctx, x, y, s, on = 0) => {
  ctx.save(); if (on > 0) { P.glow(ctx, x, y, s * 3.2 * (0.8 + 0.2 * on), '255,226,140', 0.75 * on); ctx.strokeStyle = `rgba(255,226,140,${0.7 * on})`; ctx.lineWidth = s * 0.05; ctx.lineCap = 'round'; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i - 4.5) * 0.32; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * s * 0.85, y + Math.sin(a) * s * 0.85); ctx.lineTo(x + Math.cos(a) * s * 1.25, y + Math.sin(a) * s * 1.25); ctx.stroke(); } }
  ctx.fillStyle = on > 0 ? `rgba(255,${235},${170 + 40 * on},${0.55 + 0.45 * on})` : 'rgba(220,235,245,0.35)'; ctx.beginPath(); ctx.arc(x, y - s * 0.15, s * 0.62, Math.PI * 0.8, Math.PI * 2.2); ctx.lineTo(x + s * 0.28, y + s * 0.55); ctx.lineTo(x - s * 0.28, y + s * 0.55); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(245,250,255,0.8)'; ctx.lineWidth = s * 0.04; ctx.stroke();
  ctx.strokeStyle = on > 0 ? '#fff6d0' : '#8a97a4'; ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(x - s * 0.15, y + s * 0.4); ctx.lineTo(x - s * 0.15, y); ctx.quadraticCurveTo(x, y - s * 0.25, x + s * 0.15, y); ctx.lineTo(x + s * 0.15, y + s * 0.4); ctx.stroke();
  ctx.fillStyle = '#8a97a4'; for (let k = 0; k < 3; k++) ctx.fillRect(x - s * 0.3, y + s * (0.55 + k * 0.12), s * 0.6, s * 0.09); ctx.restore();
 };
 P.switchWall = (ctx, x, y, s, on = false) => { ctx.save(); P.rr(ctx, x - s * 0.4, y - s * 0.6, s * 0.8, s * 1.2, s * 0.1, '#eef2f6', { sy: 6 }); ctx.fillStyle = '#c9d2dc'; ctx.fillRect(x - s * 0.18, y - s * 0.35, s * 0.36, s * 0.7); ctx.fillStyle = '#ffffff'; ctx.fillRect(x - s * 0.18, on ? y - s * 0.35 : y, s * 0.36, s * 0.35); ctx.restore(); };
 // Nube (con lluvia si o.rain) y sol
 P.cloud = (ctx, x, y, s, o = {}) => {
  ctx.save(); if (o.rain) { ctx.strokeStyle = 'rgba(160,210,240,0.7)'; ctx.lineWidth = 3; const R = H.rng(o.seed || 2); for (let i = 0; i < 18; i++) { const rx = x + R.range(-s * 0.8, s * 0.8), sp = R.range(400, 600), ry = y + ((R() * s * 2 + (o.t || 0) * sp) % (s * 2.2)); ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 6, ry + 22); ctx.stroke(); } }
  ctx.fillStyle = o.c || '#dfe8f0'; for (const [dx, dy, r] of [[-0.6, 0.1, 0.42], [-0.15, -0.2, 0.55], [0.4, -0.05, 0.48], [0.8, 0.15, 0.32], [0.1, 0.2, 0.45]]) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill(); } ctx.restore();
 };
 P.sun = (ctx, x, y, r, t = 0) => { P.glow(ctx, x, y, r * 3, '255,212,71', 0.5); ctx.save(); ctx.strokeStyle = '#FFD447'; ctx.lineWidth = r * 0.12; ctx.lineCap = 'round'; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * 0.2; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3); ctx.lineTo(x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65); ctx.stroke(); } ctx.restore(); P.circle(ctx, x, y, r, '#FFD447'); };
 // Pez (perfil), dir 1 = mira a la derecha
 P.fish = (ctx, x, y, s, dir = 1, c = '#9fd4c8') => { ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.22, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * 0.45, 0); ctx.lineTo(-s * 0.8, -s * 0.22); ctx.lineTo(-s * 0.8, s * 0.22); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#061522'; ctx.beginPath(); ctx.arc(s * 0.28, -s * 0.05, s * 0.05, 0, TAU); ctx.fill(); ctx.restore(); };

 // ======================= v1.8 · HISTORIA ANTIGUA Y CONSTRUCCIÓN (pirámides, desierto, trabajo humano) =======================
 // Desierto: cielo cálido (o.sky [arriba, abajo]), sol, dunas en dos planos y suelo de arena. Devuelve yAt(x) del suelo.
 P.desert = (ctx, y, t, o = {}) => {
  const sk = o.sky || ['#f3c27a', '#fbe3b0'], g = ctx.createLinearGradient(0, 0, 0, y); g.addColorStop(0, sk[0]); g.addColorStop(1, sk[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, y + 2);
  if (o.sun !== false) { const sx = o.sunX ?? 820, sy = o.sunY ?? 380; P.glow(ctx, sx, sy, 260, '255,230,170', 0.6); P.circle(ctx, sx, sy, 60, '#fff3d6'); }
  const dune = (yy, amp, c, ph) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-10, HH); for (let x = -10; x <= W + 10; x += 10) ctx.lineTo(x, yy + Math.sin(x * 0.006 + ph) * amp + Math.sin(x * 0.017 + ph * 2) * amp * 0.3); ctx.lineTo(W + 10, HH); ctx.closePath(); ctx.fill(); };
  dune(y - 40, 26, o.far || '#e2b674', 1.3); const yAt = (x) => y + Math.sin(x * 0.004 + 0.4) * 8;
  ctx.fillStyle = o.ground || '#d9a865'; ctx.beginPath(); ctx.moveTo(-10, HH); for (let x = -10; x <= W + 10; x += 10) ctx.lineTo(x, yAt(x)); ctx.lineTo(W + 10, HH); ctx.closePath(); ctx.fill();
  const R = H.rng(o.seed || 3); ctx.fillStyle = 'rgba(120,80,40,0.18)'; for (let i = 0; i < 80; i++) { const x = R() * W, yy = y + 10 + R() * (HH - y); ctx.fillRect(x, yy, R.range(6, 30), 2); }
  return yAt;
 };
 // Pirámide en vista 3/4 (cara izquierda iluminada, derecha en sombra) hecha por hiladas de bloques.
 // o: { built 0..1 (altura construida: pirámide truncada con plataforma), courses (nº de hiladas visibles), casing 0..1 (revestimiento
 // liso de caliza blanca), lit, shade, joints }. Devuelve { apex, at(face, u, v) } para colocar cosas sobre las caras (u: 0 base → 1 cúspide).
 P.pyramid = (ctx, x, y, w, h, o = {}) => {
  const Lb = [x - w * 0.5, y - w * 0.05], Fb = [x + w * 0.1, y + w * 0.05], Rb = [x + w * 0.5, y - w * 0.07], Bb = [Lb[0] + Rb[0] - Fb[0], Lb[1] + Rb[1] - Fb[1]], Ap = [x + w * 0.04, y - h];
  const L = (p, u) => [lerp(p[0], Ap[0], u), lerp(p[1], Ap[1], u)], ub = cl(o.built ?? 1), n = o.courses || 26;
  const lit = o.lit || '#e2c08a', shade = o.shade || '#a9814f';
  const face = (A, B, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...L(B, ub)); ctx.lineTo(...L(A, ub)); ctx.closePath(); ctx.fill();
   if ((o.joints ?? 1) > 0) { ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(90,60,30,0.35)'; ctx.lineWidth = Math.max(1, w / 900); for (let k = 1; k < n; k++) { const u = k / n; if (u > ub) break; const a = L(A, u), b = L(B, u); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); const nb = Math.max(3, Math.round(22 * (1 - u))); for (let j = 0; j < nb; j++) { const v = (j + (k % 2) * 0.5) / nb, u2 = (k + 1) / n; const p0 = [lerp(a[0], b[0], v), lerp(a[1], b[1], v)], a2 = L(A, Math.min(u2, ub)), b2 = L(B, Math.min(u2, ub)); const p1 = [lerp(a2[0], b2[0], v), lerp(a2[1], b2[1], v)]; ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); ctx.stroke(); } } ctx.restore(); } };
  ctx.save(); ctx.fillStyle = 'rgba(80,50,20,0.25)'; ctx.beginPath(); ctx.moveTo(...Fb); ctx.lineTo(...Rb); ctx.lineTo(Rb[0] + w * 0.3, Rb[1] + w * 0.08); ctx.lineTo(Fb[0] + w * 0.3, Fb[1] + w * 0.06); ctx.closePath(); ctx.fill();
  face(Lb, Fb, lit); face(Fb, Rb, shade);
  if (ub < 1) { ctx.fillStyle = o.top || '#ecd2a2'; ctx.beginPath(); ctx.moveTo(...L(Lb, ub)); ctx.lineTo(...L(Fb, ub)); ctx.lineTo(...L(Rb, ub)); ctx.lineTo(...L(Bb, ub)); ctx.closePath(); ctx.fill(); }
  const cs = o.casing || 0; if (cs > 0) { ctx.globalAlpha = cs; const g = ctx.createLinearGradient(Lb[0], 0, Fb[0], 0); g.addColorStop(0, '#fbf3e2'); g.addColorStop(1, '#efe2c6'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(...Lb); ctx.lineTo(...Fb); ctx.lineTo(...L(Fb, ub)); ctx.lineTo(...L(Lb, ub)); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#cdbb98'; ctx.beginPath(); ctx.moveTo(...Fb); ctx.lineTo(...Rb); ctx.lineTo(...L(Rb, ub)); ctx.lineTo(...L(Fb, ub)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
  ctx.strokeStyle = 'rgba(255,240,210,0.6)'; ctx.lineWidth = Math.max(1.5, w / 500); ctx.beginPath(); ctx.moveTo(...Fb); ctx.lineTo(...L(Fb, ub)); ctx.stroke();
  ctx.restore();
  return { apex: Ap, base: { L: Lb, F: Fb, R: Rb, B: Bb }, at: (f, u, v) => { const A = f === 'right' ? Fb : Lb, B2 = f === 'right' ? Rb : Fb, a = L(A, u), b = L(B2, u); return [lerp(a[0], b[0], v), lerp(a[1], b[1], v)]; } };
 };
 // Bloque de piedra en falsa perspectiva (frente + tapa + lateral), con vetas. o: { c (caliza '#d8b97f' | granito '#8a7f86'), d (profundidad) }
 P.block = (ctx, x, y, w, h, o = {}) => {
  const c = H.hex(o.c || '#d8b97f'), d = o.d ?? w * 0.25, f = (k) => H.rgba([c[0] * k, c[1] * k, c[2] * k]); ctx.save();
  ctx.fillStyle = 'rgba(60,40,20,0.25)'; ctx.fillRect(x + 6, y + h - 4, w + d * 0.8, 10);
  ctx.fillStyle = f(1.08); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d * 0.8, y - d * 0.5); ctx.lineTo(x + w + d * 0.8, y - d * 0.5); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = f(0.72); ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + d * 0.8, y - d * 0.5); ctx.lineTo(x + w + d * 0.8, y + h - d * 0.5); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = f(0.92); ctx.fillRect(x, y, w, h); const R = H.rng(o.seed || Math.round(x + y)); ctx.strokeStyle = f(0.75); ctx.lineWidth = 1.5; for (let i = 0; i < 4; i++) { const yy = y + R() * h; ctx.beginPath(); ctx.moveTo(x + R() * w * 0.3, yy); ctx.lineTo(x + w * (0.5 + R() * 0.5), yy + R.range(-6, 6)); ctx.stroke(); }
  ctx.restore();
 };
 // Trineo de madera de perfil (patines curvados al frente a la DERECHA) con un bloque encima. Devuelve el punto de amarre de la cuerda.
 P.sled = (ctx, x, y, s, o = {}) => {
  ctx.save(); ctx.strokeStyle = '#7a4f2a'; ctx.lineWidth = s * 0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - s * 0.6, y); ctx.lineTo(x + s * 0.5, y); ctx.quadraticCurveTo(x + s * 0.68, y, x + s * 0.7, y - s * 0.14); ctx.stroke();
  ctx.fillStyle = '#9a6a3a'; for (let i = 0; i < 4; i++) ctx.fillRect(x - s * 0.55 + i * s * 0.32, y - s * 0.1, s * 0.07, s * 0.1); ctx.fillRect(x - s * 0.6, y - s * 0.14, s * 1.15, s * 0.05); ctx.restore();
  if (o.block !== false) P.block(ctx, x - s * 0.5, y - s * 0.14 - s * 0.55, s * 0.9, s * 0.55, { c: o.c, seed: 7 });
  ctx.save(); ctx.strokeStyle = '#c9a46a'; ctx.lineWidth = s * 0.02; ctx.beginPath(); ctx.moveTo(x - s * 0.5, y - s * 0.4); ctx.lineTo(x + s * 0.55, y - s * 0.4); ctx.stroke(); ctx.restore();
  return [x + s * 0.7, y - s * 0.14];
 };
 // Trabajador (silueta estilizada, de perfil mirando a la derecha). o.pose: 'pull' (inclinado tirando de una cuerda), 'walk', 'pour'
 // (vierte agua con una vasija), 'stand', 'chisel'. ph = fase de la marcha (0..1 se repite). Devuelve la posición de las manos.
 P.worker = (ctx, x, y, h, ph = 0, o = {}) => {
  const pose = o.pose || 'walk', c = o.c || '#4a2f1c', lean = pose === 'pull' ? 0.42 : pose === 'pour' ? 0.12 : 0.05, sw = Math.sin(ph * TAU);
  ctx.save(); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineCap = 'round'; ctx.lineWidth = h * 0.09;
  const hip = [x, y - h * 0.48], sh = [x + Math.sin(lean) * h * 0.32, hip[1] - Math.cos(lean) * h * 0.32], head = [sh[0] + Math.sin(lean) * h * 0.12, sh[1] - Math.cos(lean) * h * 0.12];
  const st = pose === 'stand' || pose === 'pour' || pose === 'chisel' ? 0.15 : 1; for (const s of [1, -1]) { const k = sw * s * st; ctx.beginPath(); ctx.moveTo(...hip); ctx.lineTo(x + k * h * 0.14 + h * 0.02, y - h * 0.24); ctx.lineTo(x + k * h * 0.22 - (pose === 'pull' ? h * 0.12 : 0), y); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(...hip); ctx.lineTo(...sh); ctx.stroke(); ctx.fillStyle = o.cloth || '#efe6d2'; ctx.beginPath(); ctx.moveTo(hip[0] - h * 0.08, hip[1] - h * 0.02); ctx.lineTo(hip[0] + h * 0.09, hip[1] - h * 0.02); ctx.lineTo(hip[0] + h * 0.11, hip[1] + h * 0.12); ctx.lineTo(hip[0] - h * 0.1, hip[1] + h * 0.12); ctx.closePath(); ctx.fill();
  ctx.fillStyle = c; ctx.beginPath(); ctx.arc(head[0], head[1], h * 0.075, 0, TAU); ctx.fill();
  let hand; if (pose === 'pull') hand = [sh[0] + h * 0.28, sh[1] + h * 0.12]; else if (pose === 'pour') hand = [sh[0] + h * 0.26, sh[1] + h * 0.02]; else if (pose === 'chisel') hand = [sh[0] + h * 0.22, sh[1] + h * 0.1 + Math.abs(sw) * h * 0.05]; else hand = [sh[0] + sw * h * 0.12, sh[1] + h * 0.25];
  ctx.lineWidth = h * 0.07; ctx.beginPath(); ctx.moveTo(...sh); ctx.lineTo(...hand); ctx.stroke();
  if (pose === 'pour') { ctx.fillStyle = '#b5653a'; ctx.beginPath(); ctx.ellipse(hand[0] + h * 0.06, hand[1], h * 0.09, h * 0.07, 0.9, 0, TAU); ctx.fill(); }
  ctx.restore(); return hand;
 };
 // Cuerda (trenzada) por una polilínea
 P.rope = (ctx, pts, w = 4, o = {}) => { P.strokePath(ctx, pts, w, o.c || '#b8935a'); ctx.save(); ctx.setLineDash([w * 0.8, w * 1.2]); P.strokePath(ctx, pts, w * 0.45, 'rgba(90,60,30,0.6)', { cap: 'butt' }); ctx.restore(); };
 // Rampa de construcción sobre la pirámide (esquema): 'recta' (frontal), 'zigzag', 'espiral' (envolvente), 'interna'. p 0..1 = cuánto se ha dibujado.
 P.ramp = (ctx, pyr, type, p = 1, o = {}) => {
  const c = o.c || 'rgba(160,110,60,0.92)', ub = o.top ?? 0.8; let pts = [];
  if (type === 'recta') { const a = pyr.base.L, top = pyr.at('left', ub, 0.55); pts = [[a[0] - (o.len || 260), a[1] + 30], top]; ctx.save(); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(top[0], top[1]); ctx.lineTo(top[0], a[1] + 30); ctx.closePath(); ctx.globalAlpha *= cl(p * 1.5); ctx.fill(); ctx.restore(); return P.path(pts); }
  if (type === 'zigzag') { const N = 6; for (let i = 0; i <= N; i++) { const u = i / N * ub; pts.push(pyr.at('left', u, i % 2 ? 0.85 : 0.15)); } }
  else if (type === 'espiral') { const N = 16; for (let i = 0; i <= N; i++) { const u = i / N * ub, f = (i % 4) < 2 ? 'left' : 'right', v = (i % 2) ? 0.95 : 0.05; pts.push(pyr.at(f, u, v)); } }
  else { const N = 8; for (let i = 0; i <= N; i++) { const u = i / N * ub; pts.push(pyr.at('left', u, i % 2 ? 0.7 : 0.3)); } }
  const L = P.path(pts), part = [pts[0]]; let acc = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (acc + d >= L.L * p) { const q = L.at(L.L * p); part.push([q[0], q[1]]); break; } acc += d; part.push(pts[i]); }
  ctx.save(); if (type === 'interna') ctx.setLineDash([12, 10]); P.strokePath(ctx, part, o.w || 12, c); ctx.restore(); return L;
 };
 // Papiro (rollo) con signos estilizados (no es texto real). o: { rows, seed, c }
 P.papyrus = (ctx, x, y, w, h, o = {}) => {
  ctx.save(); const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#e6cf98'); g.addColorStop(0.5, '#f1dfb0'); g.addColorStop(1, '#dcc086'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#c8a86c'; ctx.fillRect(x - 12, y - 6, 16, h + 12); ctx.fillRect(x + w - 4, y - 6, 16, h + 12);
  const R = H.rng(o.seed || 4); ctx.fillStyle = o.c || '#4a3220'; const rows = o.rows || 6; for (let r = 0; r < rows; r++) { const yy = y + 20 + r * (h - 30) / rows; for (let xx = x + 20; xx < x + w - 24; xx += R.range(16, 26)) { const k = R(); if (k < 0.3) ctx.fillRect(xx, yy, 10, 3); else if (k < 0.55) { ctx.beginPath(); ctx.arc(xx + 5, yy + 2, 4, 0, TAU); ctx.fill(); } else if (k < 0.8) ctx.fillRect(xx + 3, yy - 6, 3, 12); else { ctx.beginPath(); ctx.moveTo(xx, yy + 4); ctx.lineTo(xx + 5, yy - 6); ctx.lineTo(xx + 10, yy + 4); ctx.fill(); } } }
  ctx.restore();
 };
 // Herramientas: 'cincel' (cobre), 'mazo', 'codo' (vara de medir), 'plomada' (nivel en A con plomada), 'escuadra', 'sierra'
 P.tool = (ctx, kind, x, y, s, rot = 0) => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.lineCap = 'round';
  if (kind === 'cincel') { ctx.fillStyle = '#c47a3a'; ctx.fillRect(-s * 0.06, -s * 0.5, s * 0.12, s * 0.85); ctx.beginPath(); ctx.moveTo(-s * 0.06, s * 0.35); ctx.lineTo(s * 0.06, s * 0.35); ctx.lineTo(0, s * 0.5); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(-s * 0.04, -s * 0.48, s * 0.03, s * 0.8); }
  else if (kind === 'mazo') { ctx.fillStyle = '#8a5a32'; ctx.fillRect(-s * 0.04, -s * 0.1, s * 0.08, s * 0.6); ctx.beginPath(); ctx.ellipse(0, -s * 0.25, s * 0.18, s * 0.22, 0, 0, TAU); ctx.fill(); }
  else if (kind === 'codo') { ctx.fillStyle = '#6b4a2b'; ctx.fillRect(-s * 0.6, -s * 0.05, s * 1.2, s * 0.1); ctx.fillStyle = '#e6cf98'; for (let i = 0; i <= 7; i++) ctx.fillRect(-s * 0.6 + i * s * 1.2 / 7 - 1, -s * 0.05, 2, s * 0.06); }
  else if (kind === 'plomada') { ctx.strokeStyle = '#6b4a2b'; ctx.lineWidth = s * 0.07; ctx.beginPath(); ctx.moveTo(-s * 0.4, s * 0.4); ctx.lineTo(0, -s * 0.45); ctx.lineTo(s * 0.4, s * 0.4); ctx.moveTo(-s * 0.2, 0); ctx.lineTo(s * 0.2, 0); ctx.stroke(); ctx.strokeStyle = '#e6cf98'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -s * 0.45); ctx.lineTo(0, s * 0.05); ctx.stroke(); ctx.fillStyle = '#c47a3a'; ctx.beginPath(); ctx.arc(0, s * 0.1, s * 0.06, 0, TAU); ctx.fill(); }
  else if (kind === 'escuadra') { ctx.strokeStyle = '#6b4a2b'; ctx.lineWidth = s * 0.1; ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.4); ctx.lineTo(-s * 0.4, s * 0.4); ctx.lineTo(s * 0.4, s * 0.4); ctx.stroke(); }
  else if (kind === 'sierra') { ctx.fillStyle = '#c47a3a'; ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.08); ctx.lineTo(s * 0.4, -s * 0.08); for (let i = 0; i < 10; i++) { ctx.lineTo(s * 0.4 - i * s * 0.09 - s * 0.045, s * 0.06); ctx.lineTo(s * 0.4 - (i + 1) * s * 0.09, -s * 0.0); } ctx.closePath(); ctx.fill(); ctx.fillStyle = '#6b4a2b'; ctx.fillRect(s * 0.38, -s * 0.12, s * 0.2, s * 0.16); }
  ctx.restore();
 };
 // Palmera (de perfil) que se mece con t
 P.palm = (ctx, x, y, h, t = 0) => {
  ctx.save(); const sw = Math.sin(t * 1.2) * h * 0.02, tx = x + h * 0.08 + sw, ty = y - h; ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = h * 0.05; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + h * 0.1, y - h * 0.5, tx, ty); ctx.stroke();
  ctx.strokeStyle = '#3d6b3a'; ctx.lineWidth = h * 0.035; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.55 + Math.sin(t + i) * 0.04; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * h * 0.25, ty + Math.sin(a) * h * 0.2 - h * 0.05, tx + Math.cos(a) * h * 0.38, ty + Math.sin(a) * h * 0.25 + h * 0.12); ctx.stroke(); } ctx.restore();
 };
 // Signo de interrogación flotante (dudas, hipótesis abiertas)
 P.qmark = (ctx, x, y, s, t = 0, c = '#FFD447') => { ctx.save(); ctx.translate(x, y + Math.sin(t * 2 + x) * s * 0.08); ctx.rotate(Math.sin(t + y) * 0.1); ctx.font = `800 ${s}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillText('?', 3, 4); ctx.fillStyle = c; ctx.fillText('?', 0, 0); ctx.restore(); };

 // ======================= v1.9 · FLOTACIÓN Y BARCOS (hidrostática, ingeniería naval, puertos) =======================
 // Mar de perfil completo: cielo (o.sky), sol, agua bajo la superficie con cáusticas cerca de la superficie y oleaje.
 // o: { x0, x1 (ancho del mundo), bottom, depth (0..1 oscuridad del fondo), sun [x, y], caustics }
 P.seaProfile = (ctx, y, t, o = {}) => {
  const x0 = o.x0 ?? -600, x1 = o.x1 ?? W + 600, bot = o.bottom ?? HH + 600, sk = o.sky || ['#0e3554', '#8cc6e6'];
  const g = ctx.createLinearGradient(0, y - 1400, 0, y); g.addColorStop(0, sk[0]); g.addColorStop(1, sk[1]); ctx.fillStyle = g; ctx.fillRect(x0, y - 2600, x1 - x0, 2600);
  if (o.sun) { P.glow(ctx, o.sun[0], o.sun[1], 260, '255,236,190', 0.55); P.circle(ctx, o.sun[0], o.sun[1], 48, '#fff4d8'); }
  P.ocean(ctx, t, o.depth ?? 0.5, { x: x0, y, w: x1 - x0, h: bot - y, snow: o.snow ?? 70, rays: 1 });
  if (o.caustics !== false) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(160,230,255,0.10)'; ctx.lineWidth = 3; for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let x = x0; x <= x1; x += 16) { const yy = y + 30 + k * 26 + Math.sin(x * 0.02 + t * 1.3 + k) * 8 + Math.sin(x * 0.047 - t * 0.9 + k * 2) * 5; x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); } ctx.restore(); }
  return P.waves(ctx, y, t, { x: x0, w: x1 - x0, amp: o.amp ?? 6 });
 };
 // Velo de agua sobre lo que está sumergido (se dibuja DESPUÉS del objeto): tiñe de azul y oscurece con la profundidad
 P.underwater = (ctx, y, t, o = {}) => { const x0 = o.x0 ?? -600, x1 = o.x1 ?? W + 600, bot = o.bottom ?? HH + 600; ctx.save(); const g = ctx.createLinearGradient(0, y, 0, y + 900); g.addColorStop(0, `rgba(19,120,168,${o.a0 ?? 0.22})`); g.addColorStop(1, `rgba(3,24,39,${o.a1 ?? 0.6})`); ctx.fillStyle = g; ctx.fillRect(x0, y + 2, x1 - x0, bot - y); ctx.restore(); P.waves(ctx, y, t, { x: x0, w: x1 - x0, amp: o.amp ?? 6, c: 'rgba(230,248,255,0.55)' }); };
 // Contenedor (caja con nervios) y pila de contenedores
 const CONT = ['#B7473C', '#2f6f9f', '#3f8f7a', '#d6a33a', '#7d8a99', '#8e4f7a', '#c8653a', '#4a6b8a'];
 P.container = (ctx, x, y, w, h, c) => { ctx.save(); ctx.fillStyle = c; ctx.fillRect(x, y, w, h); ctx.strokeStyle = 'rgba(0,0,0,0.28)'; ctx.lineWidth = 1; for (let k = 1; k < 6; k++) { ctx.beginPath(); ctx.moveTo(x + w * k / 6, y + 1); ctx.lineTo(x + w * k / 6, y + h - 1); ctx.stroke(); } ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); ctx.restore(); };
 // Portacontenedores de perfil (proa a la DERECHA). y = línea de flotación; draft = calado en px (cuánto está bajo el agua).
 // o: { H (puntal), rows (pisos de contenedores), cut 0..1 (corte longitudinal: muestra mamparos, cubiertas y espacios con aire),
 //      flood [0..1 por compartimento] (agua dentro), comps (nº de compartimentos), extra (contenedores añadidos), plimsoll, trim (rad) }
 // Devuelve { x0, x1, deck, keel, bay(i) → [x, y] de la pila i, comps: [[xa, xb]…] }
 P.cargoShip = (ctx, x, y, L, draft, t, o = {}) => {
  const Hh = o.H ?? L * 0.09, keel = y + draft, deck = keel - Hh, x0 = x - L / 2, x1 = x + L / 2, bob = Math.sin(t * 0.9) * 2;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.trim || 0); ctx.translate(-x, -y + bob);
  const hullPts = [[x0, deck - Hh * 0.05], [x1 - L * 0.04, deck], [x1 + L * 0.01, deck - Hh * 0.12], [x1 - L * 0.005, keel - Hh * 0.45], [x1 + L * 0.012, keel - Hh * 0.28], [x1 - L * 0.02, keel - Hh * 0.05], [x1 - L * 0.08, keel], [x0 + L * 0.07, keel], [x0 + L * 0.01, keel - Hh * 0.35], [x0, deck - Hh * 0.05]];
  const poly = (pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
  // casco: obra muerta oscura y obra viva roja (antiincrustante) por debajo de la línea de flotación de diseño
  const dwl = keel - (o.design ?? draft) ; ctx.save(); poly(hullPts); ctx.clip(); ctx.fillStyle = '#26394a'; ctx.fillRect(x0 - 20, deck - Hh, L + 40, Hh * 2); ctx.fillStyle = '#B7473C'; ctx.fillRect(x0 - 20, dwl, L + 40, Hh * 2); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x0 - 20, deck, L + 40, Hh * 0.18);
  // corte longitudinal: interior con mamparos y cubiertas
  const nc = o.comps || 7, comps = []; for (let i = 0; i < nc; i++) comps.push([x0 + L * 0.1 + i * L * 0.8 / nc, x0 + L * 0.1 + (i + 1) * L * 0.8 / nc]);
  const cut = o.cut || 0; if (cut > 0) { ctx.globalAlpha = cut; const th = Math.max(4, Hh * 0.06); ctx.fillStyle = '#0d2233'; ctx.fillRect(x0 + th, deck + th, L - 2 * th, Hh - 2 * th); const ag = ctx.createLinearGradient(0, deck, 0, keel); ag.addColorStop(0, 'rgba(244,250,255,0.22)'); ag.addColorStop(1, 'rgba(57,217,255,0.12)'); ctx.fillStyle = ag; ctx.fillRect(x0 + th, deck + th, L - 2 * th, Hh - 2 * th);
   ctx.fillStyle = '#A9C2D1'; for (const [a] of comps) ctx.fillRect(a - th / 2, deck, th, Hh); ctx.fillRect(comps[nc - 1][1] - th / 2, deck, th, Hh); ctx.fillRect(x0, keel - Hh * 0.14, L, th * 0.8); ctx.fillRect(x0, deck + Hh * 0.45, L * 0.1, th * 0.6);
   (o.flood || []).forEach((f, i) => { if (!f || !comps[i]) return; const [a, b] = comps[i], top = lerp(keel - th, deck + th, cl(f)); const wg = ctx.createLinearGradient(0, top, 0, keel); wg.addColorStop(0, 'rgba(57,217,255,0.85)'); wg.addColorStop(1, 'rgba(19,120,168,0.95)'); ctx.fillStyle = wg; ctx.fillRect(a + th / 2, top, b - a - th, keel - th - top); ctx.strokeStyle = 'rgba(244,250,255,0.8)'; ctx.lineWidth = 2; ctx.beginPath(); for (let xx = a + th; xx < b - th; xx += 6) { const yy = top + Math.sin(xx * 0.1 + t * 5) * 2; xx === a + th ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); } ctx.stroke(); });
   ctx.globalAlpha = 1; }
  if (o.disp) { ctx.fillStyle = `rgba(57,217,255,${0.4 * o.disp})`; ctx.fillRect(x0 - 20, y - bob, L + 40, Hh * 3); ctx.strokeStyle = `rgba(57,217,255,${o.disp})`; ctx.lineWidth = 4; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.moveTo(x0 - 20, y - bob); ctx.lineTo(x1 + 20, y - bob); ctx.stroke(); ctx.setLineDash([]); }
  ctx.restore();
  ctx.strokeStyle = '#A9C2D1'; ctx.lineWidth = Math.max(2, L / 500); poly(hullPts); ctx.stroke();
  // marca Plimsoll (línea de carga) en el centro del costado
  if (o.plimsoll) { const px = x - L * 0.05, py = keel - (o.plimsollDraft ?? draft); ctx.save(); ctx.strokeStyle = '#FFD447'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px, py, Hh * 0.13, 0, TAU); ctx.moveTo(px - Hh * 0.22, py); ctx.lineTo(px + Hh * 0.22, py); ctx.stroke(); ctx.restore(); }
  // superestructura (habilitación y puente) cerca de popa
  const sx = x0 + L * 0.13, sw = L * 0.06; ctx.fillStyle = '#e9eef3'; ctx.fillRect(sx, deck - Hh * 1.25, sw, Hh * 1.25); ctx.fillStyle = '#c9d3dc'; ctx.fillRect(sx - sw * 0.25, deck - Hh * 1.32, sw * 1.5, Hh * 0.1); ctx.fillStyle = '#16283a'; for (let r = 0; r < 5; r++) for (let c2 = 0; c2 < 3; c2++) ctx.fillRect(sx + sw * 0.12 + c2 * sw * 0.29, deck - Hh * 1.18 + r * Hh * 0.22, sw * 0.18, Hh * 0.09); ctx.fillStyle = '#B7473C'; ctx.fillRect(sx - L * 0.035, deck - Hh * 1.0, L * 0.022, Hh * 1.0);
  // pilas de contenedores sobre cubierta
  const rows = o.rows ?? 5, bays = Math.floor((L * 0.66) / (L * 0.04)), bw = L * 0.04, ch = Hh * 0.26; const R = H.rng(o.seed || 11);
  const bay = (i) => [x0 + L * 0.22 + i * bw, deck];
  for (let i = 0; i < bays; i++) { const [bx] = bay(i); const n = rows - (i < 2 || i > bays - 3 ? 1 : 0) + (o.extraBay && o.extraBay[i] ? o.extraBay[i] : 0); for (let r = 0; r < n; r++) P.container(ctx, bx + 1, deck - (r + 1) * ch, bw - 2, ch - 1, CONT[Math.floor(R() * CONT.length)]); }
  ctx.restore();
  return { x0, x1, deck: deck + bob, keel: keel + bob, bay: (i) => { const [bx] = bay(i); return [bx + bw / 2, deck + bob]; }, bw, ch, bays, comps };
 };
 // Sección transversal del casco (forma en U) a escala de diagrama: paredes y doble fondo de acero, interior con aire
 // (luz suave) y contenedores. sink = cuánto está bajo el agua (px). Muestra el volumen desplazado (cian) si o.disp > 0.
 // o: { disp 0..1, sep 0..1 (separa el volumen desplazado a un lado), cargo (pisos de contenedores en bodega), flood 0..1 }
 // Devuelve { bottom, top, wl (y de la línea de agua en el casco), cob [x, y] (centro de empuje), area (px² sumergidos) }
 P.hullSection = (ctx, cx, wl, w, h, sink, t, o = {}) => {
  const bottom = wl + sink, top = bottom - h, r = w * 0.16, x0 = cx - w / 2, x1 = cx + w / 2;
  const shape = (pad = 0) => { ctx.beginPath(); ctx.moveTo(x0 - pad, top); ctx.lineTo(x0 - pad, bottom - r); ctx.quadraticCurveTo(x0 - pad, bottom + pad, x0 + r, bottom + pad); ctx.lineTo(x1 - r, bottom + pad); ctx.quadraticCurveTo(x1 + pad, bottom + pad, x1 + pad, bottom - r); ctx.lineTo(x1 + pad, top); };
  const sub = Math.max(0, Math.min(h, sink)), area = sub * w;
  // volumen desplazado (cian), en su sitio o separado hacia un lado
  const dA = o.disp || 0; if (dA > 0) { const dx = (o.sep || 0) * (o.sepX ?? 0), dy = (o.sep || 0) * (o.sepY ?? h * 0.75); ctx.save(); ctx.translate(dx, dy); ctx.beginPath(); ctx.rect(x0 - 4, wl, w + 8, sub + 6); ctx.clip(); shape(4); ctx.closePath(); ctx.fillStyle = `rgba(57,217,255,${0.42 * dA})`; ctx.fill(); ctx.strokeStyle = `rgba(57,217,255,${0.95 * dA})`; ctx.lineWidth = 4; ctx.setLineDash([12, 8]); ctx.stroke(); ctx.restore(); }
  // casco
  ctx.save(); shape(0); ctx.lineTo(x1, top); ctx.closePath(); const sg = ctx.createLinearGradient(x0, 0, x1, 0); sg.addColorStop(0, '#5d7a8f'); sg.addColorStop(0.5, '#A9C2D1'); sg.addColorStop(1, '#3D5669'); ctx.fillStyle = sg; ctx.fill(); ctx.clip();
  const th = Math.max(8, w * 0.035); ctx.fillStyle = '#0b2131'; ctx.beginPath(); ctx.moveTo(x0 + th, top - 2); ctx.lineTo(x0 + th, bottom - r - th * 0.4); ctx.quadraticCurveTo(x0 + th, bottom - th * 1.6, x0 + r, bottom - th * 1.6); ctx.lineTo(x1 - r, bottom - th * 1.6); ctx.quadraticCurveTo(x1 - th, bottom - th * 1.6, x1 - th, bottom - r - th * 0.4); ctx.lineTo(x1 - th, top - 2); ctx.closePath(); ctx.fill();
  const ag = ctx.createRadialGradient(cx, bottom - h * 0.45, 10, cx, bottom - h * 0.45, w * 0.6); ag.addColorStop(0, 'rgba(244,250,255,0.28)'); ag.addColorStop(1, 'rgba(244,250,255,0.04)'); ctx.fillStyle = ag; ctx.fillRect(x0, top, w, h);
  ctx.fillStyle = '#A9C2D1'; ctx.fillRect(x0, bottom - th * 3.2, w, th * 0.5); // doble fondo
  if (o.flood) { const fy = lerp(bottom - th * 1.6, top + th, cl(o.flood)); ctx.fillStyle = 'rgba(19,120,168,0.92)'; ctx.fillRect(x0 + th, fy, w - 2 * th, bottom - fy); }
  const cg = o.cargo || 0, cw = (w - 2 * th - 20) / 6, chh = cw * 0.45; const R = H.rng(5); for (let r2 = 0; r2 < cg; r2++) for (let k = 0; k < 6; k++) P.container(ctx, x0 + th + 10 + k * cw, bottom - th * 3.2 - (r2 + 1) * chh, cw - 3, chh - 2, CONT[Math.floor(R() * CONT.length)]);
  ctx.restore();
  ctx.fillStyle = '#B7473C'; ctx.save(); shape(0); ctx.lineTo(x1, top); ctx.closePath(); ctx.clip(); ctx.globalAlpha = 0.9; ctx.beginPath(); shape(0); ctx.lineTo(x1, top); ctx.closePath(); ctx.restore();
  ctx.strokeStyle = '#d6e3ec'; ctx.lineWidth = 3; shape(0); ctx.stroke();
  return { bottom, top, wl, cob: [cx, wl + sub / 2], area, x0, x1 };
 };
 // Flecha de fuerza vertical (o horizontal) gruesa con etiqueta: dir 1 = arriba, -1 = abajo. len en px (∝ magnitud).
 P.forceArrow = (ctx, x, y, len, dir, c, label, o = {}) => {
  if (len <= 2) return; const w = o.w || 22, hw = w * 1.9, hl = Math.min(len * 0.45, w * 2.2), ey = y - dir * len; ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 12; ctx.fillStyle = c;
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, ey + dir * hl); ctx.lineTo(x - hw / 2, ey + dir * hl); ctx.lineTo(x, ey); ctx.lineTo(x + hw / 2, ey + dir * hl); ctx.lineTo(x + w / 2, ey + dir * hl); ctx.lineTo(x + w / 2, y); ctx.closePath(); ctx.fill(); ctx.restore();
  if (label) { ctx.save(); ctx.font = `800 ${o.px || 34}px Nunito`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 10; ctx.fillText(label, x + (o.align === 'right' ? -w * 1.4 : w * 1.4), (y + ey) / 2); ctx.restore(); }
 };
 // Flechas de presión normales a una superficie sumergida (pts en orden), longitud ∝ profundidad bajo y0.
 P.pressureArrows = (ctx, pts, y0, t, o = {}) => {
  const a = o.a ?? 1; if (a <= 0) return; const k = o.k || 0.25, step = o.step || 46, c = o.c || '57,217,255'; const L = P.path(pts); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = `rgba(${c},0.95)`; ctx.fillStyle = `rgba(${c},0.95)`; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let s = step / 2; s < L.L; s += step) { const [x, y, ang] = L.at(s); const d = y - y0; if (d <= 2) continue; const nx = Math.sin(ang), ny = -Math.cos(ang), len = (10 + d * k) * (0.92 + 0.08 * Math.sin(t * 4 + s)); const sx = x + nx * (len + 8), sy = y + ny * (len + 8), ex = x + nx * 8, ey = y + ny * 8; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + nx * 12 - ny * 7, ey + ny * 12 + nx * 7); ctx.lineTo(ex + nx * 12 + ny * 7, ey + ny * 12 - nx * 7); ctx.closePath(); ctx.fill(); }
  ctx.restore();
 };
 // Salpicadura determinista (corona de gotas + anillo) en (x, y) desde t0. o: { s (tamaño), c }
 P.splash = (ctx, x, y, t, t0, o = {}) => {
  const u = t - t0; if (u < 0 || u > 1.6) return; const s = o.s || 120, R = H.rng(o.seed || 9); ctx.save();
  ctx.strokeStyle = `rgba(244,250,255,${0.8 * (1 - u / 1.6)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y, s * (0.4 + u * 1.6), s * 0.12 * (0.4 + u), 0, 0, TAU); ctx.stroke();
  for (let i = 0; i < 26; i++) { const ang = -Math.PI / 2 + R.range(-1.2, 1.2), v = R.range(0.6, 1.4) * s * 3.2, gx = x + Math.cos(ang) * v * u * 0.6, gy = y + Math.sin(ang) * v * u + 0.5 * 1800 * u * u; if (gy > y + 4) continue; ctx.fillStyle = `rgba(220,245,255,${0.9 * (1 - u / 1.6)})`; ctx.beginPath(); ctx.arc(gx, gy, R.range(3, 8), 0, TAU); ctx.fill(); }
  ctx.restore();
 };
 // Grúa portuaria de muelle (pórtico) de perfil, con el brazo hacia la DERECHA. trolley 0..1 recorre el brazo; hoist = bajada en px.
 // Devuelve [x, y] del spreader (donde cuelga el contenedor).
 P.gantryCrane = (ctx, x, y, h, trolley = 0.5, hoist = 100, o = {}) => {
  const c = o.c || '#d6a33a', reach = h * 1.1, by = y - h; ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = Math.max(3, h * 0.025); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - h * 0.2, y); ctx.lineTo(x - h * 0.16, by); ctx.moveTo(x + h * 0.2, y); ctx.lineTo(x + h * 0.16, by); ctx.moveTo(x - h * 0.19, y - h * 0.45); ctx.lineTo(x + h * 0.19, y - h * 0.45); ctx.moveTo(x - h * 0.19, y - h * 0.45); ctx.lineTo(x + h * 0.17, by + h * 0.02); ctx.stroke();
  ctx.fillStyle = c; ctx.fillRect(x - h * 0.5, by - h * 0.05, reach + h * 0.5, h * 0.05); ctx.beginPath(); ctx.moveTo(x, by - h * 0.05); ctx.lineTo(x, by - h * 0.3); ctx.lineTo(x + reach * 0.75, by - h * 0.05); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, by - h * 0.3); ctx.lineTo(x - h * 0.45, by - h * 0.05); ctx.stroke();
  ctx.fillStyle = '#e9eef3'; ctx.fillRect(x - h * 0.08, by + h * 0.02, h * 0.1, h * 0.07);
  const tx = x + h * 0.1 + trolley * (reach - h * 0.15); ctx.fillStyle = '#3D5669'; ctx.fillRect(tx - h * 0.04, by, h * 0.08, h * 0.03); ctx.strokeStyle = '#3D5669'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx - h * 0.03, by + h * 0.03); ctx.lineTo(tx - h * 0.03, by + hoist); ctx.moveTo(tx + h * 0.03, by + h * 0.03); ctx.lineTo(tx + h * 0.03, by + hoist); ctx.stroke(); ctx.fillStyle = '#FFD447'; ctx.fillRect(tx - h * 0.06, by + hoist, h * 0.12, h * 0.015);
  ctx.restore(); return [tx, by + hoist + h * 0.015];
 };
 // Vaso de laboratorio (o recipiente antiguo) con agua y rebosadero. level 0..1; obj(ctx) dibuja algo dentro; o: { spout, overflow 0..1 }
 P.beaker = (ctx, x, y, w, h, level, t, o = {}) => {
  ctx.save(); const wl = y + h - h * level; P.waterBody(ctx, [[x + 6, wl], [x + w - 6, wl], [x + w - 6, y + h - 6], [x + 6, y + h - 6]], t, { surf: [x + 6, x + w - 6, wl], top: wl, bottom: y + h }); if (o.obj) o.obj(wl);
  ctx.strokeStyle = o.c || 'rgba(230,240,250,0.9)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y); if (o.spout) { ctx.moveTo(x + w, y + h * 0.12); ctx.lineTo(x + w + w * 0.22, y + h * 0.2); } ctx.stroke();
  if (o.spout && (o.overflow || 0) > 0) { ctx.strokeStyle = 'rgba(57,217,255,0.9)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let k = 0; k < 3; k++) { const u = (t * 2 + k / 3) % 1; ctx.beginPath(); ctx.moveTo(x + w + w * 0.2, y + h * 0.2 + u * h * 0.5); ctx.lineTo(x + w + w * 0.21, y + h * 0.2 + u * h * 0.5 + 16); ctx.stroke(); } }
  ctx.restore(); return wl;
 };
 // Figura clásica estilizada (túnica griega, de perfil mirando a la derecha) — referencia histórica sin dramatizar
 P.greek = (ctx, x, y, h, o = {}) => {
  ctx.save(); ctx.fillStyle = o.c || '#e9e2d0'; ctx.beginPath(); ctx.moveTo(x - h * 0.16, y); ctx.lineTo(x - h * 0.12, y - h * 0.62); ctx.quadraticCurveTo(x, y - h * 0.72, x + h * 0.12, y - h * 0.62); ctx.lineTo(x + h * 0.18, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(120,100,70,0.5)'; ctx.lineWidth = 2; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - h * 0.1 + k * h * 0.06, y - h * 0.58); ctx.lineTo(x - h * 0.12 + k * h * 0.08, y); ctx.stroke(); }
  ctx.fillStyle = o.skin || '#c08a5a'; ctx.beginPath(); ctx.arc(x + h * 0.02, y - h * 0.8, h * 0.1, 0, TAU); ctx.fill(); ctx.fillStyle = '#d9d9d9'; ctx.beginPath(); ctx.ellipse(x + h * 0.06, y - h * 0.72, h * 0.06, h * 0.07, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = o.skin || '#c08a5a'; ctx.lineWidth = h * 0.05; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + h * 0.08, y - h * 0.58); ctx.lineTo(x + h * 0.26, y - h * (0.5 + (o.point || 0) * 0.15)); ctx.stroke(); ctx.restore();
 };
 // Columna clásica (fondos históricos)
 P.column = (ctx, x, y, h, w = 60, c = '#e9e2d0') => { ctx.save(); ctx.fillStyle = c; ctx.fillRect(x - w / 2, y - h, w, h); ctx.fillRect(x - w * 0.7, y - h - w * 0.25, w * 1.4, w * 0.25); ctx.fillRect(x - w * 0.7, y - w * 0.2, w * 1.4, w * 0.2); ctx.strokeStyle = 'rgba(120,100,70,0.35)'; ctx.lineWidth = 2; for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.moveTo(x - w / 2 + k * w / 5, y - h); ctx.lineTo(x - w / 2 + k * w / 5, y - w * 0.2); ctx.stroke(); } ctx.restore(); };

 // ======================= v1.10 · ESPACIO Y RELATIVIDAD (galaxias, naves, relojes, espacio-tiempo) =======================
 // Física relativista de aceleración propia constante (unidades: años y años luz; c = 1 al/año; 1 g ≈ 1,0323 al/año²).
 // REL.trip(D, a) → { tauTot, tTot, at(tauFrac) → { tau, t, x, beta, gamma, eta } } para ida acelerando la 1.ª mitad y frenando la 2.ª.
 P.REL = (() => {
  const G1 = 9.80665 * (365.25 * 86400) ** 2 / 9.4607304725808e15; // 1 g en al/año² ≈ 1,0323
  const trip = (D, a = G1) => { const tauH = Math.acosh(1 + a * D / 2) / a, tauTot = 2 * tauH, tH = Math.sinh(a * tauH) / a, tTot = 2 * tH;
   const at = (f) => { const tau = cl(f) * tauTot; let t, x, eta; if (tau <= tauH) { eta = a * tau; t = Math.sinh(eta) / a; x = (Math.cosh(eta) - 1) / a; } else { const r = tauTot - tau; eta = a * r; t = tTot - Math.sinh(eta) / a; x = D - (Math.cosh(eta) - 1) / a; } return { tau, t, x, eta, beta: Math.tanh(eta), gamma: Math.cosh(eta), oneMinusBeta: 2 / (Math.exp(2 * eta) + 1) }; };
   return { D, a, tauH, tauTot, tTot, at }; };
  return { G1, trip, gammaOf: (beta) => 1 / Math.sqrt(1 - beta * beta) };
 })();
 // v/c como texto con los nueves necesarios (nunca llega a 1): oneMinus = 1 − v/c
 P.betaText = (oneMinus) => { if (oneMinus >= 0.1) return (1 - oneMinus).toFixed(3).replace('.', ',') + ' c'; const n = Math.min(14, Math.floor(-Math.log10(oneMinus))); const digits = 1 - oneMinus; let s = '0,' + '9'.repeat(n); const rest = Math.floor((digits * 10 ** (n + 1)) % 10); return s + rest + ' c'; };
 // Campo de estrellas «hacia delante» con aberración relativista ESTILIZADA: proyección estereográfica cuyo radio se escala por e^(−η)
 // (las estrellas se agrupan al frente y se azulan; detrás se enrojecen). o: { n, eta (rapidez visual), cx, cy, F, drift, seed, a }
 let STARS3 = null;
 P.starfield = (ctx, t, o = {}) => {
  const n = o.n || 900; if (!STARS3 || STARS3.n !== n) { const R = H.rng(o.seed || 42), arr = []; for (let i = 0; i < n; i++) { const z = R() * 2 - 1, ph = R() * TAU, m = R(); arr.push([Math.acos(z), ph, Math.pow(m, 3), R()]); } STARS3 = { n, arr }; }
  const cx = o.cx ?? W / 2, cy = o.cy ?? HH * 0.42, F = o.F || 520, k = Math.exp(-(o.eta || 0)), a0 = o.a ?? 1, dr = (o.drift || 0) * t;
  ctx.save(); for (const [th, ph0, m, tw] of STARS3.arr) { const r = F * Math.tan(Math.min(th, 3.05) / 2) * k, ph = ph0 + dr * 0.02; const x = cx + Math.cos(ph) * r, y = cy + Math.sin(ph) * r; if (x < -10 || x > W + 10 || y < -10 || y > HH + 10) continue;
   const fwd = Math.cos(2 * Math.atan(Math.tan(th / 2) * k)), dop = (o.eta || 0) > 0 ? cl(0.5 + 0.5 * fwd * Math.tanh(o.eta)) : 0.5; const col = dop > 0.5 ? [lerp(255, 170, (dop - 0.5) * 2), lerp(250, 205, (dop - 0.5) * 2), 255] : [255, lerp(200, 250, dop * 2), lerp(170, 240, dop * 2)];
   const b = (0.35 + 0.65 * m) * (0.8 + 0.2 * Math.sin(t * 2 + tw * 9)) * a0 * (1 + ((o.eta || 0) > 0 ? cl(fwd) * 0.6 : 0)); ctx.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${cl(b)})`; const s = 0.8 + m * 2.2; ctx.fillRect(x - s / 2, y - s / 2, s, s); if (m > 0.85) P.glow(ctx, x, y, s * 5, `${col[0] | 0},${col[1] | 0},${col[2] | 0}`, 0.35 * b); }
  ctx.restore();
 };
 // Fondo de espacio profundo (degradado + neblina tenue) — sin nebulosas exageradas
 P.space = (ctx, o = {}) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, o.top || '#02040D'); g.addColorStop(1, o.bot || '#081B42'); ctx.fillStyle = g; ctx.fillRect(-2000, -2000, W + 4000, HH + 4000); if (o.haze !== false) { P.glow(ctx, W * 0.7, HH * 0.3, 700, '87,52,166', 0.12); P.glow(ctx, W * 0.2, HH * 0.75, 600, '37,139,255', 0.08); } };
 // Galaxia espiral (partículas en brazos logarítmicos + bulbo), pre-renderizada en caché. Dibujo: posición, radio, ángulo de giro, inclinación.
 // o: { arms, tilt (0..1: 1 = de frente), rot, seed, core ('255,200,107'), arm ('140,180,255'), dust }
 const GAL = {};
 P.galaxy = (ctx, x, y, r, o = {}) => {
  const key = [o.seed || 1, o.arms || 2, o.core || '', o.arm || '', o.dust ?? 1].join('|'); if (!GAL[key]) { const S = 900, c = H.layer(S, S), g = c.getContext('2d'), R = H.rng(o.seed || 1), arms = o.arms || 2; g.globalCompositeOperation = 'lighter';
   const core = o.core || '255,200,107', arm = o.arm || '140,180,255';
   const bg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.5); bg.addColorStop(0, `rgba(${core},0.9)`); bg.addColorStop(0.08, `rgba(${core},0.55)`); bg.addColorStop(0.3, `rgba(${arm},0.12)`); bg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = bg; g.fillRect(0, 0, S, S);
   for (let i = 0; i < 26000; i++) { const k = Math.floor(R() * arms), u = Math.pow(R(), 0.7), th = u * 4.2 + k * TAU / arms + R.gauss() * 0.28 * (1 - u * 0.5), rr = (0.05 + u * 0.45) * S + R.gauss() * 10; const px = S / 2 + Math.cos(th) * rr, py = S / 2 + Math.sin(th) * rr, col = R() < 0.25 + 0.6 * (1 - u) ? core : arm; g.fillStyle = `rgba(${col},${R.range(0.05, 0.28)})`; const s = R.range(0.8, 2.6); g.fillRect(px, py, s, s); }
   if ((o.dust ?? 1) > 0) { g.globalCompositeOperation = 'source-over'; for (let i = 0; i < 2500; i++) { const k = Math.floor(R() * arms), u = R(), th = u * 4.2 + k * TAU / arms + 0.35 + R.gauss() * 0.12, rr = (0.08 + u * 0.4) * S; g.fillStyle = `rgba(10,6,18,${R.range(0.05, 0.18)})`; g.beginPath(); g.arc(S / 2 + Math.cos(th) * rr, S / 2 + Math.sin(th) * rr, R.range(2, 6), 0, TAU); g.fill(); } }
   GAL[key] = c; }
  const im = GAL[key]; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(1, o.tilt ?? 1); ctx.globalAlpha *= o.a ?? 1; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(im, -r, -r, r * 2, r * 2); ctx.restore();
 };
 // Nave interestelar de perfil (proa a la DERECHA): casco, anillo habitable, depósitos, escudo frontal y tobera con chorro (thrust 0..1).
 // ang: rotación (π = proa a la izquierda, p. ej. para frenar). o: { cut (muestra el interior por zonas), labels }
 P.spaceship = (ctx, x, y, s, ang = 0, t = 0, o = {}) => {
  const th = o.thrust ?? 0; ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  if (th > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const L = s * (0.9 + 1.6 * th) * (0.95 + 0.05 * Math.sin(t * 30)); const g = ctx.createLinearGradient(-s * 0.95, 0, -s * 0.95 - L, 0); g.addColorStop(0, `rgba(230,255,255,${0.95 * th})`); g.addColorStop(0.25, `rgba(105,243,255,${0.7 * th})`); g.addColorStop(1, 'rgba(37,139,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-s * 0.95, -s * 0.09); ctx.lineTo(-s * 0.95 - L, -s * 0.02); ctx.lineTo(-s * 0.95 - L, s * 0.02); ctx.lineTo(-s * 0.95, s * 0.09); ctx.closePath(); ctx.fill(); P.glow(ctx, -s * 0.97, 0, s * 0.35, '105,243,255', 0.8 * th); ctx.restore(); }
  const hull = ctx.createLinearGradient(0, -s * 0.12, 0, s * 0.12); hull.addColorStop(0, '#dfe8f2'); hull.addColorStop(0.5, '#8ea3b8'); hull.addColorStop(1, '#3b4b5e');
  ctx.fillStyle = '#3b4b5e'; ctx.beginPath(); ctx.moveTo(-s * 0.95, -s * 0.12); ctx.lineTo(-s * 0.78, -s * 0.06); ctx.lineTo(-s * 0.78, s * 0.06); ctx.lineTo(-s * 0.95, s * 0.12); ctx.closePath(); ctx.fill();
  ctx.fillStyle = hull; ctx.beginPath(); ctx.moveTo(-s * 0.8, -s * 0.06); ctx.lineTo(s * 0.62, -s * 0.06); ctx.quadraticCurveTo(s * 0.98, -s * 0.05, s * 1.0, 0); ctx.quadraticCurveTo(s * 0.98, s * 0.05, s * 0.62, s * 0.06); ctx.lineTo(-s * 0.8, s * 0.06); ctx.closePath(); ctx.fill();
  for (const dx of [-0.6, -0.42, -0.24]) { ctx.fillStyle = '#6f8296'; ctx.beginPath(); ctx.ellipse(s * dx, 0, s * 0.08, s * 0.1, 0, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = '#cfdbe6'; ctx.lineWidth = s * 0.025; ctx.beginPath(); ctx.ellipse(s * 0.15, 0, s * 0.05, s * 0.26, 0, 0, TAU); ctx.stroke(); ctx.lineWidth = s * 0.012; for (const sgn of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 0.15, sgn * s * 0.06); ctx.lineTo(s * 0.15, sgn * s * 0.25); ctx.stroke(); }
  ctx.fillStyle = '#c9d6e2'; ctx.beginPath(); ctx.ellipse(s * 0.93, 0, s * 0.05, s * 0.14, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(54,217,255,0.9)'; for (let i = 0; i < 6; i++) ctx.fillRect(s * (0.35 + i * 0.04), -s * 0.035, s * 0.018, s * 0.012);
  if ((o.cut || 0) > 0) { ctx.globalAlpha = o.cut; const zones = [[-0.95, -0.78, '#69F3FF'], [-0.7, -0.16, '#FFC86B'], [0.05, 0.26, '#46E6D2'], [0.86, 1.0, '#FF695F']]; zones.forEach(([a, b, c2]) => { ctx.fillStyle = H.rgba(H.hex(c2), 0.45); ctx.fillRect(s * a, -s * 0.07, s * (b - a), s * 0.14); }); ctx.globalAlpha = 1; }
  ctx.restore();
 };
 // Reloj de misión (panel): etiqueta, valor grande y barra de progreso. o: { sub, prog 0..1, w, px }
 P.missionClock = (ctx, x, y, label, value, color, o = {}) => {
  const w = o.w || 440, h = o.h || 150, px = o.px || 58; ctx.save(); P.rr(ctx, x - w / 2, y - h / 2, w, h, 22, 'rgba(2,4,13,0.82)'); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 22); ctx.stroke();
  ctx.fillStyle = color; ctx.font = '700 22px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, x, y - h * 0.3); ctx.font = `700 ${px}px "Space Grotesk"`; ctx.fillStyle = '#F6FAFF'; ctx.fillText(value, x, y + h * 0.04);
  if (o.sub) { ctx.font = '600 18px "IBM Plex Mono"'; ctx.fillStyle = 'rgba(246,250,255,0.7)'; ctx.fillText(o.sub, x, y + h * 0.33); }
  if (o.prog != null) { ctx.fillStyle = 'rgba(246,250,255,0.15)'; ctx.fillRect(x - w / 2 + 20, y + h / 2 - 14, w - 40, 5); ctx.fillStyle = color; ctx.fillRect(x - w / 2 + 20, y + h / 2 - 14, (w - 40) * cl(o.prog), 5); }
  ctx.restore();
 };
 // Velocímetro en fracción de c: aguja que se acerca a c sin tocarla (escala logarítmica en 1 − v/c). o: { label }
 P.speedGauge = (ctx, x, y, r, oneMinus, o = {}) => {
  const p = cl(Math.log10(Math.max(1e-14, Math.min(1, oneMinus))) / -14); ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(246,250,255,0.15)'; ctx.lineWidth = r * 0.12; ctx.beginPath(); ctx.arc(x, y, r, Math.PI * 0.8, Math.PI * 2.2); ctx.stroke();
  ctx.strokeStyle = '#36D9FF'; ctx.beginPath(); ctx.arc(x, y, r, Math.PI * 0.8, Math.PI * 0.8 + Math.PI * 1.4 * p * 0.985); ctx.stroke();
  ctx.strokeStyle = '#FF695F'; ctx.lineWidth = r * 0.05; const ea = Math.PI * 2.2; ctx.beginPath(); ctx.moveTo(x + Math.cos(ea) * r * 0.82, y + Math.sin(ea) * r * 0.82); ctx.lineTo(x + Math.cos(ea) * r * 1.18, y + Math.sin(ea) * r * 1.18); ctx.stroke();
  ctx.fillStyle = '#FF695F'; ctx.font = `700 ${r * 0.16}px "IBM Plex Mono"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('c', x + Math.cos(ea) * r * 1.32, y + Math.sin(ea) * r * 1.32);
  const bt = P.betaText(oneMinus), fs = Math.min(r * 0.2, (r * 1.55) / (bt.length * 0.56)); ctx.fillStyle = '#F6FAFF'; ctx.font = `700 ${fs}px "Space Grotesk"`; ctx.fillText(bt, x, y + r * 0.05); ctx.font = `600 ${r * 0.11}px "IBM Plex Mono"`; ctx.fillStyle = 'rgba(246,250,255,0.75)'; ctx.fillText(o.label || 'velocidad / c', x, y + r * 0.35); ctx.restore();
 };
 // Diagrama de espacio-tiempo (Minkowski): x horizontal, t hacia arriba, conos de luz a 45°, líneas de universo con marcas de tiempo propio.
 // lines: [{ pts: [[x, t]…] (unidades del diagrama 0..1), c, ticks: [[x, t]…], label }]. Devuelve map(x, t) → [px, py].
 P.spacetime = (ctx, x, y, w, h, lines = [], o = {}) => {
  const map = (u, v) => [x + u * w, y + h - v * h]; ctx.save(); P.rr(ctx, x - 20, y - 20, w + 40, h + 40, 20, 'rgba(2,4,13,0.75)');
  ctx.strokeStyle = 'rgba(246,250,255,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...map(0, 0)); ctx.lineTo(...map(1, 0)); ctx.moveTo(...map(0, 0)); ctx.lineTo(...map(0, 1)); ctx.stroke();
  ctx.fillStyle = 'rgba(246,250,255,0.75)'; ctx.font = '600 20px "IBM Plex Mono"'; ctx.textAlign = 'left'; ctx.fillText(o.xLabel || 'distancia →', x + w - 150, y + h + 4 + 22); ctx.save(); ctx.translate(x - 8, y + 10); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'right'; ctx.fillText(o.tLabel || 'tiempo (Tierra) →', 0, 0); ctx.restore();
  if (o.light !== false) { ctx.setLineDash([8, 8]); ctx.strokeStyle = 'rgba(255,212,71,0.6)'; ctx.beginPath(); ctx.moveTo(...map(0, 0)); ctx.lineTo(...map(Math.min(1, h / w), Math.min(1, w / h))); ctx.stroke(); ctx.setLineDash([]); }
  for (const L of lines) { if (!L.pts || L.pts.length < 2) continue; P.strokePath(ctx, L.pts.map((p) => map(p[0], p[1])), o.lw || 5, L.c); for (const tk of L.ticks || []) { const [px, py] = map(tk[0], tk[1]); P.circle(ctx, px, py, 6, L.c); } if (L.label) { const [lx, ly] = map(...L.pts[L.pts.length - 1]); ctx.fillStyle = L.c; ctx.font = '800 24px Nunito'; ctx.textAlign = 'center'; ctx.fillText(L.label, lx, ly - 16); } }
  ctx.restore(); return map;
 };
 // Cabina vista desde atrás del astronauta: ventana panorámica (view(x, y, w, h) dibuja el exterior), consolas y silueta.
 P.cockpit = (ctx, t, view, o = {}) => {
  const wx = 90, wy = o.wy ?? 360, ww = W - 180, wh = o.wh ?? 700; ctx.save(); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, HH);
  ctx.save(); ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 60); ctx.clip(); view(wx, wy, ww, wh); const gl = ctx.createLinearGradient(wx, wy, wx + ww, wy + wh); gl.addColorStop(0, 'rgba(255,255,255,0.06)'); gl.addColorStop(0.5, 'rgba(255,255,255,0)'); gl.addColorStop(1, 'rgba(255,255,255,0.04)'); ctx.fillStyle = gl; ctx.fillRect(wx, wy, ww, wh); ctx.restore();
  ctx.strokeStyle = '#3d4f66'; ctx.lineWidth = 26; ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 60); ctx.stroke(); ctx.strokeStyle = '#5c7088'; ctx.lineWidth = 4; ctx.stroke();
  const cy = wy + wh + 40; const cg = ctx.createLinearGradient(0, cy, 0, HH); cg.addColorStop(0, '#1b2a40'); cg.addColorStop(1, '#070d18'); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(0, cy + 60); ctx.quadraticCurveTo(W / 2, cy - 30, W, cy + 60); ctx.lineTo(W, HH); ctx.lineTo(0, HH); ctx.closePath(); ctx.fill();
  const R = H.rng(12); for (let i = 0; i < 14; i++) { const x = 90 + i * 66, on = Math.sin(t * (1 + R() * 3) + i) > 0; ctx.fillStyle = on ? ['#36D9FF', '#46E6D2', '#FFC86B'][i % 3] : 'rgba(246,250,255,0.15)'; ctx.fillRect(x, cy + 70 + (i % 2) * 18, 30, 8); }
  if (o.pilot !== false) { const px = W / 2 + (o.pilotX || 0), py = cy + 230; ctx.fillStyle = '#05080f'; ctx.beginPath(); ctx.ellipse(px, py - 150, 70, 78, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(px - 190, py + 200); ctx.quadraticCurveTo(px - 170, py - 60, px, py - 70); ctx.quadraticCurveTo(px + 170, py - 60, px + 190, py + 200); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(105,243,255,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px, py - 150, 74, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  ctx.restore(); return { wx, wy, ww, wh };
 };
 // Silueta de científico (perfil, pelo alborotado) para referencias históricas breves (sin parecido fotográfico)
 P.scientist = (ctx, x, y, h, o = {}) => {
  ctx.save(); ctx.fillStyle = o.c || '#F6FAFF'; ctx.globalAlpha *= o.a ?? 1; ctx.beginPath(); ctx.ellipse(x, y - h * 0.78, h * 0.11, h * 0.13, 0, 0, TAU); ctx.fill(); const R = H.rng(3); for (let i = 0; i < 26; i++) { const a = -Math.PI * 0.95 + R() * Math.PI * 1.15, rr = h * R.range(0.12, 0.2); ctx.beginPath(); ctx.arc(x - h * 0.02 + Math.cos(a) * rr, y - h * 0.8 + Math.sin(a) * rr * 0.85, h * R.range(0.02, 0.04), 0, TAU); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(x - h * 0.1, y - h * 0.66); ctx.quadraticCurveTo(x - h * 0.26, y - h * 0.5, x - h * 0.24, y); ctx.lineTo(x + h * 0.24, y); ctx.quadraticCurveTo(x + h * 0.26, y - h * 0.5, x + h * 0.1, y - h * 0.66); ctx.closePath(); ctx.fill(); ctx.restore();
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
  // v1.7 · agua, energía y electricidad
  compuerta: (k, t, d = 1.6) => { k.play('click', t, { gain: 0.6 }); k.tone(t, { f: [[0, 60], [d, 75]], type: 'sawtooth', dur: d, gain: 0.04, filter: 'lowpass', f2: 380, a: 0.1, hold: d * 0.8 }); for (let x = 0.1; x < d; x += 0.18) k.play('tick', t + x, { f: 1300, gain: 0.1, minor: true }); k.play('thud', t + d, { f: 90, gain: 0.4 }); },
  corriente: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'lowpass', f: [[0, 300], [Math.min(1.2, d * 0.4), 900], [d, 700]], gain: 0.13 * g, a: Math.min(1, d * 0.3), hold: d * 0.6 }); k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: 160, gain: 0.1 * g, a: 0.5, hold: d * 0.7 }); },
  turbina: (k, t, d, g = 1, f0 = 90, f1 = 220) => { k.tone(t, { f: [[0, f0], [Math.min(2.5, d * 0.6), f1], [d, f1]], type: 'sawtooth', dur: d, gain: 0.035 * g, filter: 'lowpass', f2: 900, a: 0.4, hold: d * 0.75 }); k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 500], [Math.min(2.5, d * 0.6), 1400]], q: 2, gain: 0.05 * g, a: 0.5, hold: d * 0.7 }); },
  generador: (k, t, d, g = 1) => { for (const [f, gg] of [[60, 0.06], [120, 0.035], [180, 0.015]]) k.tone(t, { f, dur: d, gain: gg * g, a: 0.4, hold: d * 0.8 }); },
  induccion: (k, t, d = 1.2, g = 1) => { const R = H.rng(Math.round(t * 100)); for (let x = 0; x < d; x += 0.06) k.tone(t + x, { f: 1200 + R() * 1800, dur: 0.35, gain: 0.018 * g, a: 0.02, verb: 0.4, pan: R() - 0.5, minor: true }); k.play('riser', t, { dur: d, gain: 0.2 * g }); },
  transformador: (k, t, d, g = 1) => { k.tone(t, { f: 100, type: 'square', dur: d, gain: 0.012 * g, filter: 'lowpass', f2: 500, a: 0.3, hold: d * 0.8 }); k.tone(t, { f: 200, dur: d, gain: 0.03 * g, a: 0.3, hold: d * 0.8 }); },
  lineas: (k, t, d, g = 1) => { const R = H.rng(Math.round(t * 10) + 9); k.noise(t, { dur: d, color: 'white', filter: 'bandpass', f: 3500, q: 3, gain: 0.025 * g, a: 0.3, hold: d * 0.7 }); for (let x = 0; x < d; x += 0.2 + R() * 0.3) k.noise(t + x, { dur: 0.015, filter: 'highpass', f: 5000, gain: 0.08 * g, minor: true }); },
  bombilla: (k, t) => { k.play('click', t, { gain: 0.8 }); k.tone(t + 0.04, { f: 'E6', dur: 0.9, gain: 0.06, verb: 0.35 }); k.tone(t + 0.04, { f: 'B6', dur: 0.6, gain: 0.03, verb: 0.35, minor: true }); },
  lluvia: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'white', filter: 'highpass', f: 2500, gain: 0.04 * g, a: 0.4, hold: d * 0.6 }); k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: 1200, q: 0.6, gain: 0.04 * g, a: 0.4, hold: d * 0.6 }); },
  // v1.8 · historia antigua y construcción
  arrastre: (k, t, d, g = 1, f = 700) => { k.noise(t, { dur: d, color: 'brown', filter: 'bandpass', f, q: 0.8, gain: 0.1 * g, a: 0.3, hold: d * 0.7 }); const R = H.rng(Math.round(t * 10) + 1); for (let x = 0; x < d; x += 0.15 + R() * 0.2) k.noise(t + x, { dur: 0.06, color: 'pink', filter: 'bandpass', f: 1800 + R() * 900, q: 1, gain: 0.04 * g, minor: true }); },
  cuerda: (k, t, g = 1) => { k.tone(t, { f: [[0, 180], [0.35, 140]], type: 'sawtooth', dur: 0.4, gain: 0.03 * g, filter: 'bandpass', f2: 700, q: 4, a: 0.05 }); k.noise(t, { dur: 0.3, filter: 'bandpass', f: 1200, q: 2, gain: 0.05 * g, a: 0.05 }); },
  esfuerzo: (k, t, n = 4, gap = 0.9, g = 1) => { for (let i = 0; i < n; i++) { k.play('thud', t + i * gap, { f: 70, gain: 0.25 * g }); k.noise(t + i * gap, { dur: 0.25, color: 'brown', filter: 'bandpass', f: 400, q: 1.5, gain: 0.06 * g, a: 0.02 }); FX.cuerda(k, t + i * gap + 0.05, 0.6 * g); } },
  vertido: (k, t, d = 1.2, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 900], [d, 1500]], q: 1.2, gain: 0.08 * g, a: 0.1, hold: d * 0.7 }); FX.goteo(k, t + 0.1, Math.round(d * 6), 0.15, Math.round(t * 10)); },
  cincel: (k, t, n = 4, gap = 0.32) => { for (let i = 0; i < n; i++) { k.tone(t + i * gap, { f: 2400, dur: 0.12, gain: 0.05, a: 0.001, verb: 0.2 }); k.noise(t + i * gap, { dur: 0.04, filter: 'highpass', f: 2500, gain: 0.25, minor: true }); k.play('tock', t + i * gap, { f: 600, gain: 0.25, minor: true }); } },
  piedra: (k, t, g = 1) => { k.play('thud', t, { f: 55, gain: 0.6 * g }); k.noise(t, { dur: 0.6, color: 'brown', filter: 'lowpass', f: [[0, 900], [0.6, 120]], gain: 0.2 * g, a: 0.005 }); k.noise(t + 0.02, { dur: 0.4, color: 'pink', filter: 'bandpass', f: 2500, q: 0.8, gain: 0.04 * g, a: 0.01 }); },
  viento: (k, t, d, g = 1) => k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 500], [d * 0.4, 900], [d, 600]], q: 1.4, gain: 0.05 * g, a: Math.min(1.5, d * 0.3), hold: d * 0.5 }),
  // v1.9 · flotación y barcos
  chapuzon: (k, t, g = 1) => { k.play('thud', t, { f: 90, gain: 0.5 * g }); k.noise(t, { dur: 1.2, color: 'pink', filter: 'lowpass', f: [[0, 4000], [1.2, 600]], gain: 0.28 * g, a: 0.005 }); FX.burbujas(k, t + 0.1, 1.2, 14, Math.round(t * 10), 1.2 * g); },
  hundirse: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: [[0, 400], [d, 120]], gain: 0.12 * g, a: 0.2, hold: d * 0.6 }); FX.burbujas(k, t, d, 3, Math.round(t * 10) + 2, 0.8 * g); },
  casco: (k, t, g = 1, f = 70) => k.tone(t, { f: [[0, f], [0.6, f * 0.85], [1.2, f * 1.05]], type: 'sawtooth', dur: 1.3, gain: 0.04 * g, filter: 'bandpass', f2: f * 3, q: 4, a: 0.2 }),
  grua: (k, t, d, g = 1) => { k.tone(t, { f: [[0, 90], [d * 0.5, 120], [d, 95]], type: 'sawtooth', dur: d, gain: 0.03 * g, filter: 'lowpass', f2: 500, a: 0.15, hold: d * 0.7 }); k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: 1600, q: 3, gain: 0.02 * g, a: 0.2, hold: d * 0.6 }); },
  contenedor: (k, t, g = 1) => { k.play('thud', t, { f: 75, gain: 0.45 * g }); k.tone(t, { f: 310, dur: 0.6, gain: 0.04 * g, a: 0.002, verb: 0.3 }); k.tone(t, { f: 523, dur: 0.4, gain: 0.02 * g, a: 0.002, minor: true }); },
  inundacion: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'lowpass', f: [[0, 1800], [d, 500]], gain: 0.16 * g, a: 0.1, hold: d * 0.7 }); FX.burbujas(k, t, d, 10, Math.round(t * 10) + 5, g); },
  bocina: (k, t, d = 1.6, g = 1) => { for (const [f, gg] of [[73, 0.09], [110, 0.05], [146, 0.03]]) k.tone(t, { f, type: 'sawtooth', dur: d, gain: gg * g, filter: 'lowpass', f2: 700, a: 0.08, hold: d * 0.8, verb: 0.4 }); },
  equilibrio: (k, t, g = 1) => { k.tone(t, { f: 'C5', dur: 1.6, gain: 0.07 * g, verb: 0.4 }); k.tone(t + 0.12, { f: 'G5', dur: 1.5, gain: 0.06 * g, verb: 0.4 }); k.tone(t + 0.24, { f: 'C6', dur: 1.4, gain: 0.05 * g, verb: 0.4 }); },
  // v1.10 · espacio y relatividad (recursos cinematográficos: en el vacío no se propaga el sonido)
  espacio: (k, t, d, g = 1) => { k.tone(t, { f: 55, dur: d, gain: 0.05 * g, a: Math.min(2, d * 0.3), hold: d * 0.6, verb: 0.4 }); k.tone(t, { f: 82.4, dur: d, gain: 0.03 * g, a: Math.min(2.5, d * 0.4), hold: d * 0.5, verb: 0.5 }); k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 300], [d, 700]], q: 2, gain: 0.02 * g, a: d * 0.4, hold: d * 0.4 }); },
  propulsion: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: [[0, 120], [Math.min(1, d * 0.3), 400], [d, 350]], gain: 0.16 * g, a: 0.3, hold: d * 0.7 }); k.tone(t, { f: 41, type: 'sawtooth', dur: d, gain: 0.03 * g, filter: 'lowpass', f2: 200, a: 0.4, hold: d * 0.7 }); },
  aceleracion: (k, t, d, g = 1) => { k.tone(t, { f: [[0, 110], [d, 880]], type: 'sawtooth', dur: d, gain: 0.025 * g, filter: 'lowpass', f2: 1800, a: d * 0.5 }); k.play('riser', t, { dur: d, gain: 0.3 * g }); },
  frenado: (k, t, d, g = 1) => { k.tone(t, { f: [[0, 880], [d, 110]], type: 'sawtooth', dur: d, gain: 0.025 * g, filter: 'lowpass', f2: 1600, a: 0.1, hold: d * 0.6 }); k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 3000], [d, 400]], q: 1, gain: 0.08 * g, a: 0.1 }); },
  reloj: (k, t, n = 6, gap = 0.12, g = 1, f = 2200) => { for (let i = 0; i < n; i++) k.tone(t + i * gap, { f, type: 'square', dur: 0.02, gain: 0.03 * g, a: 0.001, hold: 0.012, filter: 'lowpass', f2: 4000, minor: true }); },
  galaxia: (k, t, g = 1) => { FX.campo(k, t, 1.6, 0.8 * g); k.play('whoosh', t, { dur: 1.4, top: 1400, gain: 0.3 * g }); k.tone(t + 0.4, { f: 'E5', dur: 2, gain: 0.04 * g, verb: 0.5 }); },
  contraer: (k, t, d = 1.2, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 600], [d, 3200]], q: 1.5, gain: 0.12 * g, a: d * 0.7 }); k.tone(t, { f: [[0, 300], [d, 1200]], dur: d, gain: 0.03 * g, a: d * 0.6 }); k.play('thud', t + d, { f: 120, gain: 0.25 * g }); },
  llegada: (k, t, g = 1) => { for (const [n, dt] of [['D4', 0], ['A4', 0.15], ['F#5', 0.3], ['D6', 0.5]]) k.tone(t + dt, { f: n, dur: 2.4, gain: 0.045 * g, verb: 0.5 }); },
 };
 window.PLANTILLA = { make, SKINS, P, FX, TRANS_SFX, setSkin: (n) => (SK = SKINS[n]), W, HH };
})();
