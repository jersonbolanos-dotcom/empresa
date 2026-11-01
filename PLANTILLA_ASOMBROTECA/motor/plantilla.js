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

 // ======================= v1.11 · MALLA 3D, NAVE CINEMATOGRÁFICA, ESPACIO PROFUNDO Y GRÁFICAS CIENTÍFICAS =======================
 // Motor 3D mínimo para Canvas: mallas de caras (polígonos) con sombreado lambert + luz de contorno, orden por profundidad (pintor)
 // y descarte de caras traseras. Ejes del objeto: +x hacia delante, +y arriba, +z hacia la cámara. Rotaciones: yaw (eje y), pitch (eje z), roll (eje x).
 P.M3 = (() => {
  const rot = (v, yaw, pitch, roll) => { let [x, y, z] = v; let c = Math.cos(roll), s = Math.sin(roll); [y, z] = [y * c - z * s, y * s + z * c]; c = Math.cos(pitch); s = Math.sin(pitch); [x, y] = [x * c - y * s, x * s + y * c]; c = Math.cos(yaw); s = Math.sin(yaw); [x, z] = [x * c + z * s, -x * s + z * c]; return [x, y, z]; };
  // loft: estaciones [[x, ry, rz]] con «sides» lados → caras; color base; caps cierra los extremos
  const loft = (st, sides, col, o = {}) => { const ring = st.map(([x, ry, rz]) => { const r = []; for (let k = 0; k < sides; k++) { const a = (k + 0.5) / sides * TAU + (o.rot || 0); r.push([x, Math.cos(a) * ry + (o.oy || 0), Math.sin(a) * rz + (o.oz || 0)]); } return r; }); const F = [];
   for (let i = 0; i < st.length - 1; i++) for (let k = 0; k < sides; k++) { const k2 = (k + 1) % sides; F.push({ v: [ring[i][k], ring[i + 1][k], ring[i + 1][k2], ring[i][k2]], c: (o.bands && i % o.bands === 0) ? (o.c2 || col) : col, line: o.line, tag: o.tag }); }
   if (o.caps !== false) { F.push({ v: ring[0].slice().reverse(), c: o.capC || col, tag: o.tag, cap: 'back' }); F.push({ v: ring[st.length - 1].slice(), c: o.capC2 || o.capC || col, tag: o.tag, cap: 'front' }); } return F; };
  const box = (cx, cy, cz, sx, sy, sz, col, tag, two) => { const p = (a, b, c) => [cx + a * sx, cy + b * sy, cz + c * sz]; const V = [p(-1, -1, -1), p(1, -1, -1), p(1, 1, -1), p(-1, 1, -1), p(-1, -1, 1), p(1, -1, 1), p(1, 1, 1), p(-1, 1, 1)]; const q = (a, b, c, d) => ({ v: [V[a], V[b], V[c], V[d]], c: col, tag, two }); return [q(0, 3, 2, 1), q(4, 5, 6, 7), q(0, 1, 5, 4), q(2, 3, 7, 6), q(1, 2, 6, 5), q(0, 4, 7, 3)]; };
  // dibuja: o = { x, y, s (px por unidad), yaw, pitch, roll, light [x,y,z], persp (0 = ortográfica), xf(v, face) transformación previa por cara }
  const draw = (ctx, faces, o) => { const L = o.light || [-0.45, 0.55, 0.7], ln = Math.hypot(...L), Ln = L.map((q) => q / ln), d = o.persp ?? 6, out = [];
   for (const f of faces) { const vs = f.v.map((v) => rot(o.xf ? o.xf(v, f) : v, o.yaw || 0, o.pitch || 0, o.roll || 0)); const a = vs[0], b = vs[1], c = vs[2]; const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]; let n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]; const nl = Math.hypot(...n) || 1; n = n.map((q) => q / nl);
    if (!f.two && n[2] < 0) continue; if (f.two && n[2] < 0) n = n.map((q) => -q); const zc = vs.reduce((s2, v) => s2 + v[2], 0) / vs.length;
    const pts = vs.map(([x, y, z]) => { const k = d ? d / (d - z) : 1; return [o.x + x * o.s * k, o.y - y * o.s * k]; });
    const lam = Math.max(0, n[0] * Ln[0] + n[1] * Ln[1] + n[2] * Ln[2]), rim = Math.pow(1 - Math.abs(n[2]), 3); out.push({ pts, z: zc, lam, rim, f }); }
   out.sort((p, q) => p.z - q.z);
   for (const it of out) { const base = H.hex(it.f.c), amb = it.f.emit ? 1 : 0.32, k = amb + (it.f.emit ? 0 : 0.78 * it.lam), sp = Math.pow(it.lam, 18) * 0.5; const col = [base[0] * k + 255 * sp + 90 * it.rim * 0.35, base[1] * k + 255 * sp + 150 * it.rim * 0.35, base[2] * k + 255 * sp + 255 * it.rim * 0.35].map((q) => Math.min(255, q | 0));
    ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`; ctx.beginPath(); it.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); ctx.strokeStyle = it.f.line ? `rgba(10,16,24,${it.f.line})` : ctx.fillStyle; ctx.lineWidth = it.f.line ? 1 : 0.8; ctx.stroke(); }
   return out; };
  const project = (v, o) => { const [x, y, z] = rot(v, o.yaw || 0, o.pitch || 0, o.roll || 0), d = o.persp ?? 6, k = d ? d / (d - z) : 1; return [o.x + x * o.s * k, o.y - y * o.s * k, z]; };
  return { rot, loft, box, draw, project };
 })();
 // NAVE INTERESTELAR «ASOMBROTECA» (diseño original): escudo frontal lenticular contra polvo, espina de titanio, anillo habitable giratorio
 // con radios, depósitos blancos, radiadores térmicos, bloque de propulsión con 3 toberas y chorro de partículas. Unidades: largo 2 (x −1…+1).
 // P.starship(ctx, x, y, s, t, { yaw, pitch, roll, thrust 0..1, light, ring (giro), persp, glow }) — s = px por unidad (la nave mide 2s).
 let SHIP = null;
 const buildShip = () => { const M = P.M3, F = [];
  const TI = '#5d6b78', TI2 = '#46525e', WH = '#d8e1e9', DK = '#2c343d';
  F.push(...M.loft([[0.84, 0.03, 0.03], [0.9, 0.2, 0.2], [0.93, 0.21, 0.21], [0.97, 0.1, 0.1], [1.0, 0.035, 0.035]], 24, '#c9d4de', { line: 0.05, tag: 'shield' }));
  F.push(...M.loft([[1.0, 0.02, 0.02], [1.12, 0.004, 0.004]], 6, '#9aa7b4', { tag: 'probe' }));
  F.push(...M.loft([[-0.62, 0.07, 0.07], [-0.4, 0.075, 0.075], [-0.1, 0.07, 0.07], [0.15, 0.06, 0.06], [0.45, 0.055, 0.055], [0.7, 0.05, 0.05], [0.86, 0.04, 0.04]], 10, TI, { bands: 2, c2: TI2, line: 0.35, tag: 'spine' }));
  F.push(...M.loft([[0.48, 0.09, 0.09], [0.52, 0.13, 0.13], [0.66, 0.13, 0.13], [0.7, 0.09, 0.09]], 12, WH, { line: 0.3, tag: 'cmd' }));
  F.push(...M.loft([[-0.14, 0.05, 0.05], [-0.08, 0.095, 0.085], [0.12, 0.1, 0.09], [0.38, 0.085, 0.075], [0.47, 0.06, 0.055]], 8, '#4f5d6a', { line: 0.45, bands: 2, c2: '#66778a', tag: 'fairing' }));
  for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + Math.PI / 4, oy = Math.cos(a) * 0.14, oz = Math.sin(a) * 0.14; F.push(...M.loft([[-0.5, 0.0, 0.0], [-0.47, 0.055, 0.055], [-0.12, 0.055, 0.055], [-0.09, 0.0, 0.0]], 10, WH, { oy, oz, line: 0.2, tag: 'tank', bands: 3, c2: '#b9c6d2' })); }
  // anillo habitable (toro) + radios — marcado «spin» para girar sobre el eje x
  const R0 = 0.3, r0 = 0.04, NU = 32, NV = 6, xr = 0.25; const tor = (u, v) => [xr + Math.cos(v) * r0, (R0 + Math.sin(v) * r0) * Math.cos(u), (R0 + Math.sin(v) * r0) * Math.sin(u)];
  for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) { const u0 = i / NU * TAU, u1 = (i + 1) / NU * TAU, v0 = j / NV * TAU, v1 = (j + 1) / NV * TAU; F.push({ v: [tor(u0, v0), tor(u0, v1), tor(u1, v1), tor(u1, v0)], c: i % 4 === 0 ? '#9fb2c2' : WH, spin: true, line: i % 4 === 0 ? 0.3 : 0, tag: 'ring' }); }
  for (let k = 0; k < 4; k++) { const a = k / 4 * TAU; const ca = Math.cos(a), sa = Math.sin(a), w = 0.012; F.push({ v: [[xr - w, 0.06 * ca, 0.06 * sa], [xr - w, (R0 - 0.03) * ca, (R0 - 0.03) * sa], [xr + w, (R0 - 0.03) * ca, (R0 - 0.03) * sa], [xr + w, 0.06 * ca, 0.06 * sa]], c: '#8ea0b0', two: true, spin: true, tag: 'spoke' }); }
  // radiadores (dos pares, finos, ligeramente en V)
  for (const sg of [1, -1]) { const y0 = 0.07 * sg, y1 = 0.42 * sg; F.push({ v: [[-0.42, y0, 0.0], [-0.02, y0, 0.0], [-0.08, y1, 0.06], [-0.38, y1, 0.06]], c: '#3a4652', two: true, line: 0.5, tag: 'rad' }); for (let i = 1; i < 6; i++) { const x0 = -0.42 + i * 0.066; F.push({ v: [[x0 - 0.004, y0, 0.001], [x0 + 0.004, y0, 0.001], [x0 + 0.004 - 0.01, y1, 0.061], [x0 - 0.004 - 0.01, y1, 0.061]], c: '#ff9a5a', two: true, emit: true, tag: 'radline' }); } }
  // bloque de propulsión y 3 toberas
  F.push(...M.loft([[-0.78, 0.15, 0.15], [-0.74, 0.17, 0.17], [-0.6, 0.16, 0.16], [-0.56, 0.1, 0.1]], 12, TI2, { line: 0.4, tag: 'engblock', bands: 1, c2: DK }));
  for (let k = 0; k < 3; k++) { const a = k / 3 * TAU + Math.PI / 2, oy = Math.cos(a) * 0.085, oz = Math.sin(a) * 0.085; F.push(...M.loft([[-0.78, 0.045, 0.045], [-0.86, 0.06, 0.06], [-0.93, 0.08, 0.08]], 12, '#7b8794', { oy, oz, caps: false, line: 0.3, tag: 'bell' })); F.push(...M.loft([[-0.93, 0.075, 0.075], [-0.931, 0.0, 0.0]], 12, '#bff8ff', { oy, oz, caps: false, tag: 'core', two: true }).map((f) => ({ ...f, emit: true, two: true }))); }
  // franjas de acento cian (emisivas) en el módulo de mando
  F.push(...M.loft([[0.585, 0.132, 0.132], [0.595, 0.132, 0.132]], 12, '#46E6D2', { caps: false, tag: 'accent' }).map((f) => ({ ...f, emit: true })));
  return F; };
 P.starship = (ctx, x, y, s, t, o = {}) => {
  if (!SHIP) SHIP = buildShip(); const ringA = (o.ring ?? t * 0.35), cr = Math.cos(ringA), sr = Math.sin(ringA);
  const view = { x, y, s, yaw: o.yaw || 0, pitch: o.pitch || 0, roll: o.roll || 0, light: o.light, persp: o.persp ?? 5, xf: (v, f) => (f.spin ? [v[0], v[1] * cr - v[2] * sr, v[1] * sr + v[2] * cr] : v) };
  const th = o.thrust ?? 0;
  // chorro: partículas deterministas detrás de cada tobera (se dibujan antes si la cola está hacia atrás, después si apunta a cámara)
  const plume = () => { if (th <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 3; k++) { const a = k / 3 * TAU + Math.PI / 2, oy = Math.cos(a) * 0.085, oz = Math.sin(a) * 0.085; const ex = P.M3.project([-0.95, oy, oz], view); P.glow(ctx, ex[0], ex[1], s * 0.22 * (0.8 + 0.4 * th), '105,243,255', 0.85 * th); const R = H.rng(77 + k); for (let i = 0; i < 70; i++) { const u = ((t * (1.6 + R() * 0.8) + R()) % 1), len = 0.25 + 1.4 * th, px = -0.95 - u * len, sp = 0.008 + u * 0.035 * (0.4 + 0.6 * th); const p = P.M3.project([px, oy + R.gauss() * sp, oz + R.gauss() * sp], view); const a2 = th * (1 - u) * 0.6; ctx.fillStyle = `rgba(${lerp(230, 60, u) | 0},${lerp(255, 160, u) | 0},255,${a2})`; const rr = s * (0.004 + 0.008 * (1 - u)); ctx.beginPath(); ctx.arc(p[0], p[1], rr, 0, TAU); ctx.fill(); } const tail = P.M3.project([-0.95 - (0.6 + 1.2 * th), oy, oz], view); const g = ctx.createLinearGradient(ex[0], ex[1], tail[0], tail[1]); g.addColorStop(0, `rgba(200,255,255,${0.55 * th})`); g.addColorStop(1, 'rgba(37,139,255,0)'); ctx.strokeStyle = g; ctx.lineWidth = s * 0.09 * (0.6 + 0.4 * th); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex[0], ex[1]); ctx.lineTo(tail[0], tail[1]); ctx.stroke(); } ctx.restore(); };
  const tailZ = P.M3.project([-1.3, 0, 0], view)[2]; if (tailZ < 0) plume();
  if (o.glow !== false) P.glow(ctx, x, y, s * 1.3, '40,90,180', 0.12);
  P.M3.draw(ctx, SHIP, view);
  if (tailZ >= 0) plume();
  // luces de navegación: roja (babor), verde (estribor), blanca intermitente en la proa
  const nav = [[[-0.38, 0.42, 0.06], '255,80,70', 0.9], [[-0.38, -0.42, 0.06], '70,255,140', 0.9], [[1.12, 0, 0], '255,255,255', (Math.sin(t * 6) > 0.6 ? 1 : 0.15)]]; ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [v, c, a] of nav) { const p = P.M3.project(v, view); P.glow(ctx, p[0], p[1], s * 0.05, c, a); } ctx.restore();
 };
 // ESPACIO PROFUNDO con paralaje: degradado azul-violeta-negro, nebulosa tenue en caché, 3 capas de estrellas que se desplazan distinto
 // con la cámara (o.px, o.py en px de «mundo»), polvo cercano opcional y estelas de movimiento ESTILIZADAS (o.streak 0..1, o.dir rad).
 let NEB = null, DSTAR = null;
 P.deepSpace = (ctx, t, o = {}) => {
  const g = ctx.createLinearGradient(0, 0, W * 0.3, HH); g.addColorStop(0, o.top || '#03050f'); g.addColorStop(0.55, o.mid || '#070d26'); g.addColorStop(1, o.bot || '#0a0a1f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  if (!NEB) { const S = 240, c = H.layer(S, S * 1.8 | 0), q = c.getContext('2d'), nz = H.makeNoise(19), img = q.createImageData(S, S * 1.8 | 0); for (let j = 0; j < c.height; j++) for (let i = 0; i < S; i++) { const v = nz.fbm3(i * 0.012, j * 0.012, 0.3, 5), w2 = nz.fbm3(i * 0.02 + 5, j * 0.02, 1.7, 4), k = (j * S + i) * 4, a = Math.max(0, v - 0.05) * 1.9, b = Math.max(0, w2 + 0.1) * 0.9; img.data[k] = 70 * a + 20 * b; img.data[k + 1] = 40 * a + 50 * b; img.data[k + 2] = 140 * a + 110 * b; img.data[k + 3] = Math.min(255, 255 * (0.55 * a + 0.35 * b)); } q.putImageData(img, 0, 0); NEB = c; }
  ctx.save(); ctx.globalAlpha = o.neb ?? 0.55; ctx.globalCompositeOperation = 'lighter'; ctx.imageSmoothingEnabled = true; const nx = -((o.px || 0) * 0.05) % 200, ny = -((o.py || 0) * 0.05) % 200; ctx.drawImage(NEB, nx - 100, ny - 100, W + 200, HH + 200); ctx.restore();
  if (!DSTAR) { const R = H.rng(23), L = []; for (const [n, z, s0, s1] of [[520, 0.08, 0.6, 1.4], [220, 0.25, 1.0, 2.2], [70, 0.6, 1.6, 3.4]]) { const arr = []; for (let i = 0; i < n; i++) arr.push([R() * W, R() * HH, R.range(s0, s1), R(), R()]); L.push({ z, arr }); } DSTAR = L; }
  const st = o.streak || 0, dir = o.dir ?? Math.PI / 2; ctx.save();
  for (const { z, arr } of DSTAR) { const ox = ((-(o.px || 0) * z) % W + W) % W, oy = ((-(o.py || 0) * z) % HH + HH) % HH; for (const [sx, sy, r, tw, hue] of arr) { const x = (sx + ox) % W, y = (sy + oy) % HH, b = 0.45 + 0.5 * Math.sin(t * 1.3 + tw * 9); const col = hue < 0.15 ? '255,214,170' : hue < 0.3 ? '170,200,255' : '246,250,255';
    if (st > 0 && z > 0.2) { const L2 = st * 120 * z; ctx.strokeStyle = `rgba(${col},${0.7 * b})`; ctx.lineWidth = r * 0.8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(dir) * L2, y - Math.sin(dir) * L2); ctx.stroke(); }
    ctx.fillStyle = `rgba(${col},${b})`; ctx.fillRect(x - r / 2, y - r / 2, r, r); if (r > 2.6) P.glow(ctx, x, y, r * 5, col, 0.35 * b); } }
  ctx.restore();
 };
 // GALAXIA HD: ~90.000 partículas con color por radio, cúmulos rosados (regiones HII), carriles de polvo, halo y bloom (en caché).
 const GALHD = {};
 P.galaxyHD = (ctx, x, y, r, o = {}) => {
  const key = (o.seed || 1) + '|' + (o.arms || 2); if (!GALHD[key]) { const S = 1400, c = H.layer(S, S), g = c.getContext('2d'), R = H.rng(o.seed || 1), arms = o.arms || 2, C0 = S / 2;
   g.globalCompositeOperation = 'lighter';
   const halo = g.createRadialGradient(C0, C0, 0, C0, C0, S * 0.5); halo.addColorStop(0, 'rgba(255,236,200,0.8)'); halo.addColorStop(0.05, 'rgba(255,214,160,0.45)'); halo.addColorStop(0.18, 'rgba(200,190,230,0.16)'); halo.addColorStop(0.45, 'rgba(110,140,220,0.05)'); halo.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = halo; g.fillRect(0, 0, S, S);
   const star = (px, py, u, al, s2) => { const warm = cl(1 - u * 1.6); g.fillStyle = `rgba(${lerp(165, 255, warm) | 0},${lerp(190, 224, warm) | 0},${lerp(255, 178, warm) | 0},${al})`; g.fillRect(px, py, s2, s2); };
   for (let i = 0; i < 120000; i++) { const m = R(); let rr, th; if (m < 0.36) { rr = Math.min(0.5, -Math.log(1 - R() * 0.97) * 0.11) * S; th = R() * TAU; star(C0 + Math.cos(th) * rr, C0 + Math.sin(th) * rr, rr / (0.5 * S), R.range(0.03, 0.12), R.range(0.7, 1.8)); } else if (m < 0.9) { const k = Math.floor(R() * arms), u = Math.pow(R(), 0.95); rr = (0.05 + u * 0.43) * S + R.gauss() * S * 0.025 * (0.6 + u); th = u * 3.8 + k * TAU / arms + R.gauss() * 0.3 * (0.7 + 0.5 * u); star(C0 + Math.cos(th) * rr, C0 + Math.sin(th) * rr, u, R.range(0.1, 0.34), R.range(0.8, 2.4)); } else { rr = Math.abs(R.gauss()) * 0.045 * S; th = R() * TAU; star(C0 + Math.cos(th) * rr, C0 + Math.sin(th) * rr * 0.85, 0, R.range(0.08, 0.3), R.range(0.8, 2)); } }
   for (let i = 0; i < 160; i++) { const k = Math.floor(R() * arms), u = 0.12 + Math.pow(R(), 1.2) * 0.7, th = u * 3.8 + k * TAU / arms + R.gauss() * 0.12, rr = (0.05 + u * 0.43) * S; const px = C0 + Math.cos(th) * rr, py = C0 + Math.sin(th) * rr, rad = R.range(3, 9); const hg = g.createRadialGradient(px, py, 0, px, py, rad); hg.addColorStop(0, 'rgba(255,150,200,0.35)'); hg.addColorStop(1, 'rgba(255,140,190,0)'); g.fillStyle = hg; g.fillRect(px - rad, py - rad, rad * 2, rad * 2); }
   g.globalCompositeOperation = 'source-over'; for (let i = 0; i < 5200; i++) { const k = Math.floor(R() * arms), u = R(), th = u * 3.8 + k * TAU / arms - 0.25 + R.gauss() * 0.08, rr = (0.06 + u * 0.42) * S; g.fillStyle = `rgba(8,5,14,${R.range(0.04, 0.14)})`; g.beginPath(); g.arc(C0 + Math.cos(th) * rr, C0 + Math.sin(th) * rr, R.range(2, 7), 0, TAU); g.fill(); }
   const b = H.layer(S, S), bg = b.getContext('2d'); bg.filter = 'blur(18px)'; bg.drawImage(c, 0, 0); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.55; g.drawImage(b, 0, 0); g.globalAlpha = 1; GALHD[key] = c; }
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(1, o.tilt ?? 1); ctx.rotate(o.spin || 0); ctx.globalAlpha *= o.a ?? 1; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(GALHD[key], -r, -r, r * 2, r * 2); ctx.restore();
 };
 // RELOJ HOLOGRÁFICO: anillo con 60 marcas, arco de segundero que barre con el tiempo LOCAL, valor digital grande y etiqueta.
 P.holoClock = (ctx, x, y, r, secs, color, label, value, o = {}) => {
  const rgb = H.hex(color).join(','); ctx.save(); P.glow(ctx, x, y, r * 1.5, rgb, 0.18); ctx.fillStyle = 'rgba(3,6,16,0.82)'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = `rgba(${rgb},0.9)`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); for (let k = 0; k < 60; k++) { const a = k / 60 * TAU - Math.PI / 2, l = k % 5 ? 0.06 : 0.12; ctx.lineWidth = k % 5 ? 2 : 4; ctx.strokeStyle = `rgba(${rgb},${k % 5 ? 0.45 : 0.9})`; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9); ctx.lineTo(x + Math.cos(a) * r * (0.9 - l), y + Math.sin(a) * r * (0.9 - l)); ctx.stroke(); }
  const sa = ((secs % 60) / 60) * TAU; ctx.strokeStyle = color; ctx.lineWidth = r * 0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r * 0.97, -Math.PI / 2, -Math.PI / 2 + sa); ctx.stroke(); const hx = x + Math.cos(sa - Math.PI / 2) * r * 0.97, hy = y + Math.sin(sa - Math.PI / 2) * r * 0.97; P.glow(ctx, hx, hy, r * 0.12, rgb, 0.9);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.font = `700 ${r * 0.13}px "IBM Plex Mono"`; ctx.fillText(label, x, y - r * 0.38); ctx.fillStyle = '#F6FAFF'; const fs = Math.min(r * 0.34, r * 1.6 / Math.max(4, value.length * 0.6)); ctx.font = `700 ${fs}px "Space Grotesk"`; ctx.fillText(value, x, y + r * 0.02); if (o.sub) { ctx.font = `600 ${r * 0.1}px "IBM Plex Mono"`; ctx.fillStyle = 'rgba(246,250,255,0.75)'; ctx.fillText(o.sub, x, y + r * 0.36); }
  ctx.restore();
 };
 // GRÁFICA CIENTÍFICA genérica (ejes con etiquetas grandes, rejilla, curvas con brillo que se dibujan con p 0..1, escala log en Y opcional).
 // series: [{ f(u) → [xv, yv] (u 0..1), c, w, label, dash }]. o: { xr [min,max], yr [min,max], logY, xLabel, yLabel, xTicks [[v, txt]], yTicks [[v, txt]], p }
 P.chart = (ctx, x, y, w, h, series, o = {}) => {
  const [x0, x1] = o.xr || [0, 1], [y0, y1] = o.yr || [0, 1], ly = (v) => (o.logY ? Math.log10(Math.max(v, 1e-12)) : v), Y0 = ly(y0), Y1 = ly(y1);
  const map = (xv, yv) => [x + (xv - x0) / (x1 - x0) * w, y + h - (ly(yv) - Y0) / (Y1 - Y0) * h]; ctx.save(); const a = o.a ?? 1; ctx.globalAlpha *= a;
  P.rr(ctx, x - 70, y - 40, w + 110, h + 130, 26, 'rgba(3,6,16,0.82)'); ctx.strokeStyle = 'rgba(54,217,255,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 70, y - 40, w + 110, h + 130, 26); ctx.stroke();
  ctx.strokeStyle = 'rgba(246,250,255,0.1)'; ctx.lineWidth = 1.5; ctx.font = '600 22px "IBM Plex Mono"'; ctx.fillStyle = 'rgba(246,250,255,0.8)'; ctx.textBaseline = 'middle';
  for (const [v, s] of o.yTicks || []) { const [, py] = map(x0, v); ctx.beginPath(); ctx.moveTo(x, py); ctx.lineTo(x + w, py); ctx.stroke(); ctx.textAlign = 'right'; ctx.fillText(s, x - 10, py); }
  for (const [v, s] of o.xTicks || []) { const [px] = map(v, y0); ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y + h); ctx.stroke(); ctx.textAlign = 'center'; ctx.fillText(s, px, y + h + 26); }
  ctx.strokeStyle = 'rgba(246,250,255,0.75)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke();
  ctx.font = '700 24px "Space Grotesk"'; ctx.fillStyle = '#F6FAFF'; ctx.textAlign = 'center'; ctx.fillText(o.xLabel || '', x + w / 2, y + h + 66); ctx.save(); ctx.translate(x - 58, y + h / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(o.yLabel || '', 0, -0); ctx.restore();
  const p = o.p ?? 1; for (const S of series) { const n = 160, pts = []; for (let i = 0; i <= n * p; i++) { const [xv, yv] = S.f(i / n); pts.push(map(xv, yv)); } if (pts.length < 2) continue; if (S.dash) ctx.setLineDash(S.dash); P.strokePath(ctx, pts, (S.w || 5) * 3, H.rgba(H.hex(S.c), 0.18)); P.strokePath(ctx, pts, S.w || 5, S.c); ctx.setLineDash([]); const e = pts[pts.length - 1]; P.glow(ctx, e[0], e[1], 24, H.hex(S.c).join(','), 0.9); if (S.label && p > 0.98) { ctx.font = '800 26px Nunito'; ctx.fillStyle = S.c; ctx.textAlign = S.al || 'right'; ctx.fillText(S.label, e[0] + (S.dx || -10), e[1] + (S.dy || -24)); } }
  ctx.restore(); return map;
 };

 // ======================= v1.12 · ANDES, MAMPOSTERÍA, TERRAZAS, DRENAJE Y AGUA (ingeniería histórica en montaña) =======================
 // Paisaje de montaña por capas con perspectiva atmosférica (lejos = más azulado y claro). o: { sky [arriba, abajo], sun [x, y], layers, seed, base }
 P.andes = (ctx, t, o = {}) => {
  const sk = o.sky || ['#5d8fb0', '#c9dbe2'], g = ctx.createLinearGradient(0, 0, 0, HH * 0.7); g.addColorStop(0, sk[0]); g.addColorStop(1, sk[1]); ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, HH + 800);
  if (o.sun) { P.glow(ctx, o.sun[0], o.sun[1], 420, '255,236,200', 0.55); P.circle(ctx, o.sun[0], o.sun[1], 46, '#fff6e4'); }
  const nz = H.makeNoise(o.seed || 5), L = o.layers || [['#9db3bd', 620, 260, 0.003], ['#7d9a95', 760, 300, 0.004], ['#5f7f68', 920, 320, 0.005]];
  L.forEach(([c, y, amp, fq], i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-400, HH + 400); for (let x = -400; x <= W + 400; x += 12) { const v = nz.fbm2(x * fq + i * 7.3, i * 3.1, 4); ctx.lineTo(x, y - Math.abs(v) * amp * 1.6 - (o.peaks ? Math.max(0, 1 - Math.abs(x - o.peaks[i % o.peaks.length]) / 220) * amp * 0.7 : 0)); } ctx.lineTo(W + 400, HH + 400); ctx.closePath(); ctx.fill(); });
 };
 // Banda de niebla que deriva (nubes bajas entre montañas). o: { a, seed, speed }
 let FOGC = null;
 P.fog = (ctx, y, h, t, o = {}) => {
  if (!FOGC) { const S = 256, c = H.layer(S * 2, S / 2), q = c.getContext('2d'), nz = H.makeNoise(41), img = q.createImageData(S * 2, S / 2); for (let j = 0; j < S / 2; j++) for (let i = 0; i < S * 2; i++) { const v = nz.fbm2(i * 0.02, j * 0.05, 4), fall = Math.sin(j / (S / 2) * Math.PI), k = (j * S * 2 + i) * 4, a = Math.max(0, (v + 0.35)) * fall; img.data[k] = 236; img.data[k + 1] = 242; img.data[k + 2] = 236; img.data[k + 3] = Math.min(255, a * 300); } q.putImageData(img, 0, 0); FOGC = c; }
  const a = o.a ?? 0.8; if (a <= 0) return; const off = ((t * (o.speed ?? 18) + (o.seed || 0) * 137) % (W * 2)); ctx.save(); ctx.globalAlpha *= a; for (let k = -1; k <= 1; k++) ctx.drawImage(FOGC, -off + k * W * 2, y, W * 2, h); ctx.restore();
 };
 // Lluvia en diagonal sobre un área. o: { x, y, w, h, a, n, ang, seed }
 P.rainSheet = (ctx, t, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; const x0 = o.x ?? 0, y0 = o.y ?? 0, w = o.w ?? W, h = o.h ?? HH, n = o.n || 220, ang = o.ang ?? 0.18, R = H.rng(o.seed || 3); ctx.save(); ctx.strokeStyle = `rgba(210,232,245,${0.55 * a})`; ctx.lineWidth = 2; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const sp = R.range(1100, 1700), L = R.range(22, 40), x = x0 + ((R() * w + t * sp * Math.sin(ang)) % w), y = y0 + ((R() * h + t * sp) % h); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.sin(ang) * L, y - L); ctx.stroke(); } ctx.restore(); };
 // Relleno de granito (motas claras y oscuras) para cualquier polígono
 P.granite = (ctx, pts, o = {}) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  ctx.save(); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, o.c1 || '#c3c8bd'); g.addColorStop(1, o.c2 || '#858d86'); ctx.fillStyle = g; ctx.fill(); ctx.clip();
  const R = H.rng(o.seed || Math.round(x0 * 7 + y0)); const n = Math.min(160, ((x1 - x0) * (y1 - y0)) / 220); for (let i = 0; i < n; i++) { ctx.fillStyle = R() < 0.5 ? 'rgba(40,45,42,0.25)' : 'rgba(255,255,250,0.28)'; ctx.fillRect(x0 + R() * (x1 - x0), y0 + R() * (y1 - y0), R.range(1, 3), R.range(1, 3)); }
  ctx.restore();
  if (o.bevel !== false) { ctx.save(); ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(255,255,250,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); for (let i = 0; i < Math.ceil(pts.length / 2); i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); ctx.strokeStyle = 'rgba(30,34,32,0.55)'; ctx.lineWidth = o.joint ?? 2; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke(); ctx.restore(); }
 };
 // Muro de piedra. o.style: 'poligonal' (bloques irregulares que comparten vértices → encajan sin huecos), 'sillar' (hiladas rectangulares
 // finas), 'rustica' (piedras de campo con juntas de barro). o: { seed, rows, cols, skip (índice de bloque que NO se dibuja: hueco), gap }
 // Devuelve la lista de bloques (polígonos) para animar uno de ellos o hacer zoom a una junta.
 P.stoneWall = (ctx, x, y, w, h, o = {}) => {
  const st = o.style || 'poligonal', R = H.rng(o.seed || 9), cells = [];
  if (st === 'rustica') { ctx.save(); ctx.fillStyle = o.mortar || '#6b5a44'; ctx.fillRect(x, y, w, h); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); const rows = o.rows || Math.round(h / 36); for (let r = 0; r < rows; r++) { let cx = x - R() * 30; const rh = h / rows; while (cx < x + w) { const sw = R.range(rh * 0.9, rh * 2), pts = []; for (let k = 0; k < 7; k++) { const a = k / 7 * TAU, rx = sw / 2 - 3, ry = rh / 2 - 3; pts.push([cx + sw / 2 + Math.cos(a) * rx * R.range(0.8, 1.05), y + r * rh + rh / 2 + Math.sin(a) * ry * R.range(0.8, 1.05)]); } P.granite(ctx, pts, { seed: cells.length + 3, c1: '#b6bbb1', c2: '#7c847d', joint: 1 }); cells.push(pts); cx += sw + R.range(2, 6); } } ctx.restore(); return cells; }
  if (st === 'sillar') { const rows = o.rows || 5, rh = h / rows; for (let r = 0; r < rows; r++) { let cx = x - (r % 2) * R.range(10, 40); while (cx < x + w) { const bw = R.range(rh * 1.4, rh * 2.6), x2 = Math.min(x + w, cx + bw), x1 = Math.max(x, cx); const pts = [[x1, y + r * rh], [x2, y + r * rh], [x2, y + (r + 1) * rh], [x1, y + (r + 1) * rh]]; cells.push(pts); cx += bw; } } }
  else { const nx = o.cols || 5, ny = o.rows || 4, nodes = []; for (let j = 0; j <= ny; j++) { nodes.push([]); for (let i = 0; i <= nx; i++) { const ex = i === 0 || i === nx, ey = j === 0 || j === ny; nodes[j].push([x + i * w / nx + (ex ? 0 : R.range(-0.28, 0.28) * w / nx), y + j * h / ny + (ey ? 0 : R.range(-0.25, 0.25) * h / ny)]); } }
   for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const a = nodes[j][i], b = nodes[j][i + 1], c2 = nodes[j + 1][i + 1], d = nodes[j + 1][i], pts = [a]; if (R() < 0.5 && i < nx - 1) { const m = [lerp(b[0], c2[0], 0.45) + R.range(-8, 8), lerp(b[1], c2[1], 0.45)]; pts.push(b, m, c2); } else pts.push(b, c2); pts.push(d); cells.push(pts); } }
  cells.forEach((pts, k) => { if (k === o.skip) return; const gp = o.gap || 0; let q = pts; if (gp) { const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length; q = pts.map(([px, py]) => [cx + (px - cx) * (1 - gp), cy + (py - cy) * (1 - gp)]); } P.granite(ctx, q, { seed: k * 13 + 1, joint: st === 'poligonal' ? 1.4 : 2 }); });
  return cells;
 };
 // TERRAZAS en corte (de abajo-izquierda a arriba-derecha sobre una ladera). Cada terraza: muro de contención y relleno por capas
 // (de abajo arriba: piedras grandes → grava → arena → suelo cultivable). o: { build 0..1, cut 0..1 (muestra capas), water 0..1
 // (gotas que se infiltran y salen al pie del muro), crops, seed }. Devuelve { tops: [[x0, x1, y]…], walls: [[x, yBase, yTop]…] }.
 P.terraces = (ctx, x0, y0, sw, sh, n, t, o = {}) => {
  const b = o.build ?? 1, cut = o.cut ?? 0, tops = [], walls = [], wt = sw * 0.09;
  // roca y subsuelo bajo la ladera original
  ctx.save(); ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.moveTo(x0 - 400, y0 + 900); ctx.lineTo(x0 - 400, y0 + 40); ctx.lineTo(x0, y0); ctx.lineTo(x0 + n * sw, y0 - n * sh); ctx.lineTo(x0 + n * sw + 600, y0 - n * sh - 120); ctx.lineTo(x0 + n * sw + 600, y0 + 900); ctx.closePath(); ctx.fill();
  const Rr = H.rng(o.seed || 4); ctx.fillStyle = 'rgba(133,141,134,0.5)'; for (let i = 0; i < 60; i++) { const px = x0 - 300 + Rr() * (n * sw + 800), py = y0 + 40 + Rr() * 600 - (px - x0) * sh / sw * 0.9; ctx.beginPath(); ctx.ellipse(px, py, Rr.range(8, 22), Rr.range(5, 12), Rr() * 3, 0, TAU); ctx.fill(); } ctx.restore();
  for (let i = 0; i < n; i++) { const p = cl((b * n - i) * 1.2); if (p <= 0) break; const xi = x0 + i * sw, base = y0 - i * sh, top = y0 - (i + 1) * sh, xn = xi + sw;
   walls.push([xi, base, top]); tops.push([xi, xn, top]);
   const tri = [[xi + wt, top], [xn, top], [xi + wt, base]];
   ctx.save(); ctx.globalAlpha *= p; ctx.beginPath(); tri.forEach((q, k) => (k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.clip();
   const layers = [[0, 0.16, '#5b4330', 'suelo'], [0.16, 0.3, '#c7b18a', 'arena'], [0.3, 0.55, '#a6a79b', 'grava'], [0.55, 1.01, '#7c7f78', 'piedras']];
   if (cut > 0) { for (const [d0, d1, c] of layers) { ctx.fillStyle = c; ctx.fillRect(xi, top + d0 * sh, sw, (d1 - d0) * sh + 1); } const R = H.rng(i * 31 + 7); for (let k = 0; k < 90; k++) { const px = xi + R() * sw, py = top + (0.3 + R() * 0.25) * sh; ctx.fillStyle = 'rgba(80,82,76,0.6)'; ctx.beginPath(); ctx.arc(px, py, R.range(2, 4.5), 0, TAU); ctx.fill(); } for (let k = 0; k < 26; k++) { const px = xi + R() * sw, py = top + (0.58 + R() * 0.4) * sh; P.granite(ctx, [[px - 14, py - 8], [px + 12, py - 10], [px + 16, py + 8], [px - 10, py + 10]], { seed: k + i * 50, bevel: false }); } for (let k = 0; k < 60; k++) { ctx.fillStyle = 'rgba(150,130,95,0.6)'; ctx.fillRect(xi + R() * sw, top + (0.17 + R() * 0.12) * sh, 2, 2); } }
   ctx.fillStyle = `rgba(88,115,72,${1 - cut})`; ctx.fillRect(xi, top, sw, sh);
   if ((o.water || 0) > 0 && cut > 0.3) { const R = H.rng(i * 7 + 2); ctx.globalCompositeOperation = 'source-over'; for (let k = 0; k < 18; k++) { const u = ((t * 0.35 + R()) % 1), dx = R() * sw * 0.8, px = xn - dx - u * sw * 0.15, py = top + u * (base - top - 6) * (1 - dx / sw * 0.2); if (px < xi + wt) continue; ctx.fillStyle = `rgba(55,185,217,${0.9 * o.water})`; ctx.beginPath(); ctx.ellipse(px, py, 3.5, 5.5, 0, 0, TAU); ctx.fill(); } }
   ctx.restore();
   // superficie: cultivo
   ctx.save(); ctx.globalAlpha *= p; ctx.fillStyle = '#87a46b'; ctx.fillRect(xi, top - 6, sw, 8); if (o.crops !== false) { const R = H.rng(i + 90); ctx.strokeStyle = '#587348'; ctx.lineWidth = 3; for (let x = xi + wt + 10; x < xn - 6; x += 16) { const hh = R.range(10, 22); ctx.beginPath(); ctx.moveTo(x, top - 4); ctx.lineTo(x + R.range(-3, 3), top - 4 - hh); ctx.stroke(); } } ctx.restore();
   // muro de contención (piedra) con ligera inclinación
   ctx.save(); ctx.globalAlpha *= p; ctx.beginPath(); ctx.moveTo(xi - wt * 0.3, base); ctx.lineTo(xi + wt * 0.2, top); ctx.lineTo(xi + wt, top); ctx.lineTo(xi + wt, base); ctx.closePath(); ctx.clip(); P.stoneWall(ctx, xi - wt * 0.4, top, wt * 1.5, sh, { style: 'rustica', seed: i + 3, rows: Math.round(sh / 26) }); ctx.restore();
   // salida del agua al pie del muro
   if ((o.water || 0) > 0) { const R = H.rng(i + 5); for (let k = 0; k < 6; k++) { const u = (t * 0.9 + R()) % 1; ctx.fillStyle = `rgba(122,230,242,${o.water * (1 - u)})`; ctx.beginPath(); ctx.arc(xi - u * 26, base - 8 + u * u * 30, 4, 0, TAU); ctx.fill(); } }
  }
  return { tops, walls };
 };
 // CORTE DETALLADO DE UNA TERRAZA (diagrama grande): muro de contención a la izquierda, relleno por capas horizontales (suelo, arena,
 // grava, piedras), ladera natural (roca) debajo en diagonal, gotas que se infiltran y salen por el pie del muro.
 // o: { layers [[nombre, fracción, color]…], water 0..1, rain 0..1, labels 0..1 (fracción de capas rotuladas), reveal 0..1 }
 P.terraceCut = (ctx, x, y, w, h, t, o = {}) => {
  const L = o.layers || [['SUELO CULTIVABLE', 0.16, '#5b4330'], ['ARENA', 0.14, '#c7b18a'], ['GRAVA', 0.26, '#a6a79b'], ['PIEDRAS', 0.44, '#7c7f78']], wt = w * 0.13, rv = o.reveal ?? 1;
  const bed = (xx) => y + h + 40 - (xx - x) / w * h * 0.55; // roca natural (ladera) bajo el relleno
  ctx.save(); ctx.beginPath(); ctx.rect(x - 60, y - 40, w + 120, h + 400); ctx.clip();
  ctx.fillStyle = '#4a3c30'; ctx.beginPath(); ctx.moveTo(x - 60, y + h + 400); ctx.lineTo(x - 60, bed(x - 60)); ctx.lineTo(x + w + 60, bed(x + w + 60)); ctx.lineTo(x + w + 60, y + h + 400); ctx.closePath(); ctx.fill();
  const Rb = H.rng(3); for (let i = 0; i < 30; i++) { const px = x + Rb() * w, py = bed(px) + 20 + Rb() * 200; ctx.fillStyle = 'rgba(133,141,134,0.45)'; ctx.beginPath(); ctx.ellipse(px, py, Rb.range(10, 30), Rb.range(6, 14), 0, 0, TAU); ctx.fill(); }
  // relleno por capas (por encima de la roca)
  ctx.save(); ctx.beginPath(); ctx.moveTo(x + wt, y); ctx.lineTo(x + w + 60, y); ctx.lineTo(x + w + 60, bed(x + w + 60)); ctx.lineTo(x + wt, bed(x + wt)); ctx.closePath(); ctx.clip();
  let yy = y; const R = H.rng(o.seed || 12); L.forEach(([s, f, c], k) => { const lh = f * h; const a = cl(rv * L.length - k); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(x, yy, w + 60, lh + 1);
   if (s === 'GRAVA') for (let i = 0; i < 260; i++) { ctx.fillStyle = R() < 0.5 ? 'rgba(80,82,76,0.6)' : 'rgba(220,222,214,0.6)'; ctx.beginPath(); ctx.arc(x + R() * (w + 40), yy + R() * lh, R.range(2.5, 6), 0, TAU); ctx.fill(); }
   if (s === 'ARENA') for (let i = 0; i < 400; i++) { ctx.fillStyle = 'rgba(140,118,84,0.55)'; ctx.fillRect(x + R() * (w + 40), yy + R() * lh, 2, 2); }
   if (s === 'PIEDRAS') for (let i = 0; i < 34; i++) { const px = x + wt + R() * w, py = yy + 20 + R() * (lh - 30), sz = R.range(26, 48); P.granite(ctx, [[px - sz, py - sz * 0.6], [px + sz * 0.8, py - sz * 0.7], [px + sz, py + sz * 0.5], [px - sz * 0.7, py + sz * 0.6]], { seed: i + 3, bevel: false, c1: '#a8ada4', c2: '#6f766f' }); }
   if (s.startsWith('SUELO')) { for (let i = 0; i < 200; i++) { ctx.fillStyle = 'rgba(40,28,18,0.5)'; ctx.fillRect(x + R() * (w + 40), yy + R() * lh, 3, 2); } }
   yy += lh; }); ctx.globalAlpha = 1;
  // agua que se infiltra (rápida en grava/piedras, más lenta arriba) y sale por la base del muro
  const wa = o.water || 0; if (wa > 0) { const Rw = H.rng(8); for (let i = 0; i < 70; i++) { const u = ((t * Rw.range(0.18, 0.3) + Rw()) % 1), px0 = x + wt + 40 + Rw() * (w - wt - 60); const py = y + u * h * 1.05, px = px0 - Math.max(0, u - 0.75) * 4 * (px0 - x - wt) * 0.9; const yb = bed(px); if (py > yb - 6) continue; ctx.fillStyle = `rgba(55,185,217,${0.9 * wa})`; ctx.beginPath(); ctx.ellipse(px, py, 4, 6.5, 0, 0, TAU); ctx.fill(); }
   ctx.save(); ctx.globalAlpha = wa; ctx.setLineDash([12, 12]); ctx.lineDashOffset = t * 50; ctx.strokeStyle = 'rgba(122,230,242,0.9)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + w, bed(x + w) - 14); ctx.lineTo(x + wt, bed(x + wt) - 14); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  // superficie: cultivo
  ctx.fillStyle = '#87a46b'; ctx.fillRect(x + wt, y - 10, w + 60, 12); const Rc = H.rng(90); ctx.strokeStyle = '#587348'; ctx.lineWidth = 4; for (let xx2 = x + wt + 14; xx2 < x + w + 50; xx2 += 22) { const hh = Rc.range(18, 40); ctx.beginPath(); ctx.moveTo(xx2, y - 8); ctx.lineTo(xx2 + Rc.range(-4, 4), y - 8 - hh); ctx.stroke(); }
  // muro de contención
  ctx.save(); ctx.beginPath(); ctx.moveTo(x - wt * 0.25, bed(x)); ctx.lineTo(x + wt * 0.15, y - 12); ctx.lineTo(x + wt, y - 12); ctx.lineTo(x + wt, bed(x + wt)); ctx.closePath(); ctx.clip(); P.stoneWall(ctx, x - wt * 0.4, y - 14, wt * 1.5, bed(x) - y + 20, { style: 'rustica', seed: 6, rows: Math.round(h / 46) }); ctx.restore();
  // salida del agua al pie del muro
  if (wa > 0) { const ox = x - wt * 0.1, oy = bed(x + wt) - 16; ctx.fillStyle = '#2b2620'; ctx.fillRect(ox, oy - 10, wt * 0.9, 20); const Rs = H.rng(5); for (let k = 0; k < 14; k++) { const u = (t * 0.8 + Rs()) % 1; ctx.fillStyle = `rgba(122,230,242,${wa * (1 - u)})`; ctx.beginPath(); ctx.arc(ox - u * 80, oy + u * u * 160, 5, 0, TAU); ctx.fill(); } }
  ctx.restore();
  // rótulos dentro de cada capa
  const lb = o.labels ?? 0; if (lb > 0) { let y2 = y; L.forEach(([s, f, c], k) => { const a = cl(lb * L.length - k); if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.font = '800 34px Nunito'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(s).width; P.rr(ctx, x + wt + 30, y2 + f * h / 2 - 26, tw + 30, 52, 26, 'rgba(17,26,25,0.75)'); ctx.fillStyle = '#F4F7F3'; ctx.fillText(s, x + wt + 45, y2 + f * h / 2 + 1); ctx.restore(); } y2 += f * h; }); }
  return { bed, wt };
 };
 // Canal de piedra (en planta o perfil) con agua que fluye por una polilínea. o: { fill 0..1, speed, w }
 P.channel = (ctx, pts, t, o = {}) => {
  const w = o.w || 22, L = P.path(pts); P.strokePath(ctx, pts, w + 14, '#858d86', { cap: 'butt' }); P.strokePath(ctx, pts, w + 14, 'rgba(30,34,32,0.25)', { cap: 'butt', a: 0.4 }); P.strokePath(ctx, pts, w, '#3c4a46', { cap: 'butt' });
  const f = cl(o.fill ?? 1); if (f <= 0) return L; const part = [pts[0]]; let acc = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (acc + d >= L.L * f) { const q = L.at(L.L * f); part.push([q[0], q[1]]); break; } acc += d; part.push(pts[i]); }
  P.strokePath(ctx, part, w * 0.8, '#37b9d9', { cap: 'butt' }); ctx.save(); ctx.setLineDash([14, 22]); ctx.lineDashOffset = -t * (o.speed || 90); P.strokePath(ctx, part, w * 0.25, 'rgba(244,247,243,0.75)', { cap: 'round' }); ctx.restore(); return L;
 };
 // Fuente inca (bloque tallado con caño, chorro parabólico y pila). on 0..1
 P.incaFountain = (ctx, x, y, s, t, on = 1) => {
  P.granite(ctx, [[x - s * 0.5, y - s * 0.9], [x + s * 0.5, y - s * 0.9], [x + s * 0.5, y], [x - s * 0.5, y]], { seed: Math.round(x) });
  ctx.fillStyle = '#3c4a46'; ctx.fillRect(x - s * 0.06, y - s * 0.95, s * 0.12, s * 0.1);
  P.granite(ctx, [[x - s * 0.45, y + s * 0.02], [x + s * 0.45, y + s * 0.02], [x + s * 0.4, y + s * 0.32], [x - s * 0.4, y + s * 0.32]], { seed: Math.round(x) + 9 }); ctx.fillStyle = 'rgba(55,185,217,0.85)'; ctx.fillRect(x - s * 0.36, y + s * 0.08, s * 0.72, s * 0.14);
  if (on > 0) { ctx.save(); ctx.strokeStyle = `rgba(122,230,242,${0.9 * on})`; ctx.lineWidth = s * 0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y - s * 0.88); ctx.quadraticCurveTo(x + s * 0.08, y - s * 0.6, x + s * 0.05, y + s * 0.1); ctx.stroke(); for (let k = 0; k < 3; k++) { const u = (t * 1.5 + k / 3) % 1; ctx.strokeStyle = `rgba(244,247,243,${0.7 * (1 - u) * on})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x + s * 0.05, y + s * 0.12, s * 0.06 + u * s * 0.25, s * 0.02 + u * s * 0.05, 0, 0, TAU); ctx.stroke(); } ctx.restore(); }
 };
 // CIUDADELA DE MONTAÑA (inspirada en Machu Picchu, estilizada y no a escala). El perfil superior del terreno se CONSTRUYE a partir de
 // las plataformas: cada tramo es una superficie horizontal sostenida por un muro de contención de piedra, así que todo edificio apoya
 // por construcción sobre una plataforma. Huayna Picchu se dibuja detrás y separado (más claro por la perspectiva atmosférica).
 // o.age 0 = reconstrucción (techos de paja) → 1 = estado actual (sin techos, pasto); o.canal 0..1; o.glow { walls, drain, water }.
 // Devuelve { plats: [{x0, x1, y, urban}], ground(x) } en coordenadas de dibujo, para colocar personas u objetos SOBRE el terreno.
 P.citadel = (ctx, cx, cy, s, t, o = {}) => {
  const age = o.age ?? 1, gl = o.glow || {}, X = (u) => cx + u * s, Y = (v) => cy + v * s;
  // plataformas [x0, x1, y, tipo] en unidades de s (y crece hacia abajo)
  const P0 = [];
  for (let i = 0; i < 16; i++) P0.push([-1.62 + i * 0.075, -1.62 + (i + 1) * 0.075, 1.02 - i * 0.068, 'agri']);
  P0.push([-0.42, -0.25, -0.09, 'urb'], [-0.25, -0.1, -0.16, 'urb'], [-0.1, 0.04, -0.22, 'urb'], [0.04, 0.34, 0.03, 'plaza'], [0.34, 0.5, -0.05, 'urb'], [0.5, 0.67, -0.11, 'urb'], [0.67, 0.83, -0.05, 'urb'], [0.83, 0.98, 0.02, 'urb'], [0.98, 1.12, 0.1, 'urb']);
  for (let i = 0; i < 8; i++) P0.push([1.12 + i * 0.075, 1.12 + (i + 1) * 0.075, 0.2 + i * 0.09, 'agri']);
  const plats = P0.map(([a, b, y, k]) => ({ x0: X(a), x1: X(b), y: Y(y), kind: k }));
  const ground = (x) => { for (const p of plats) if (x >= p.x0 && x <= p.x1) return p.y; return x < plats[0].x0 ? Y(1.3) : Y(1.2); };
  // Huayna Picchu y Huchuy Picchu (detrás, más claros)
  ctx.save(); const hg = ctx.createLinearGradient(0, Y(-1.35), 0, Y(0.4)); hg.addColorStop(0, '#6d8b78'); hg.addColorStop(1, '#4b6857'); ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(X(-0.05), Y(0.6)); ctx.bezierCurveTo(X(0.18), Y(-0.2), X(0.3), Y(-1.2), X(0.56), Y(-1.33)); ctx.bezierCurveTo(X(0.82), Y(-1.25), X(0.98), Y(-0.4), X(1.35), Y(0.6)); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(40,60,48,0.35)'; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(X(0.42 + k * 0.06), Y(-1.1 + k * 0.12)); ctx.lineTo(X(0.47 + k * 0.07), Y(-0.6 + k * 0.1)); ctx.lineTo(X(0.44 + k * 0.06), Y(-0.55 + k * 0.1)); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = '#5a7a66'; ctx.beginPath(); ctx.moveTo(X(-0.2), Y(0.5)); ctx.quadraticCurveTo(X(0.05), Y(-0.38), X(0.2), Y(-0.36)); ctx.quadraticCurveTo(X(0.32), Y(-0.2), X(0.42), Y(0.5)); ctx.closePath(); ctx.fill(); ctx.restore();
  P.fog(ctx, Y(-0.3), s * 0.5, t, { a: 0.35 * (o.fogA ?? 1), seed: 7, speed: 10 });
  // masa del cerro (la cresta): su borde superior ES el perfil de las plataformas
  ctx.save(); const mg = ctx.createLinearGradient(0, Y(-0.2), 0, Y(2)); mg.addColorStop(0, '#587348'); mg.addColorStop(0.5, '#3e5640'); mg.addColorStop(1, '#2a3b30'); ctx.fillStyle = mg; ctx.beginPath(); ctx.moveTo(X(-2.2), Y(3)); ctx.lineTo(X(-2.2), Y(1.45)); ctx.lineTo(plats[0].x0, Y(1.3)); for (const p of plats) { ctx.lineTo(p.x0, p.y); ctx.lineTo(p.x1, p.y); } ctx.lineTo(X(1.9), Y(1.15)); ctx.lineTo(X(2.4), Y(1.6)); ctx.lineTo(X(2.4), Y(3)); ctx.closePath(); ctx.fill();
  // terrazas frontales que bajan por la ladera bajo la ciudad (muros de piedra + franja de cultivo), recortadas a la masa
  ctx.save(); ctx.clip(); const Rf = H.rng(91), rows = o.frontRows ?? 5; for (let r = 0; r < rows; r++) { const yy = Y(0.24 + r * 0.16), hw = s * 0.024; let xa = X(-1.45 + Rf() * 0.3);
   while (xa < X(1.7)) { const xb = Math.min(X(1.75), xa + s * Rf.range(0.3, 0.62)), dy = s * Rf.range(-0.02, 0.02);
    ctx.fillStyle = 'rgba(30,45,34,0.35)'; ctx.fillRect(xa, yy + dy + hw, xb - xa, s * 0.012);
    P.granite(ctx, [[xa, yy + dy], [xb, yy + dy], [xb, yy + dy + hw], [xa, yy + dy + hw]], { seed: 300 + r * 9 + Math.round(xa), c1: '#9aa096', c2: '#6c736c', joint: 1, bevel: false });
    ctx.fillStyle = r % 2 ? '#6f8f58' : '#678a52'; ctx.fillRect(xa, yy + dy - s * 0.01, xb - xa, s * 0.01);
    xa = xb + s * Rf.range(0.18, 0.4); } }
  ctx.restore();
  const R0 = H.rng(17); for (let i = 0; i < 26; i++) { const u = R0.range(-1.6, 1.8), x = X(u), y = ground(x) + s * R0.range(0.25, 1.1); ctx.fillStyle = 'rgba(133,141,134,0.35)'; ctx.beginPath(); ctx.ellipse(x, y, s * R0.range(0.03, 0.08), s * R0.range(0.015, 0.035), -0.3, 0, TAU); ctx.fill(); } ctx.restore();
  // muros de contención (frentes de cada desnivel) y superficies superiores con espesor
  const d = s * 0.022; plats.forEach((p, i) => {
   const below = i === 0 ? Y(1.3) : Math.max(plats[i - 1].y, p.y); const prev = plats[i - 1]; const wallH = (prev ? Math.max(0, prev.y - p.y) : 0);
   // superficie (franja con profundidad aparente)
   ctx.fillStyle = p.kind === 'plaza' ? '#7fa060' : p.kind === 'agri' ? (age < 0.5 ? '#87a46b' : '#7fa060') : (age > 0.6 ? '#8aa86e' : '#a89a7c'); ctx.fillRect(p.x0, p.y - d * 0.9, p.x1 - p.x0, d * 0.9);
   // muro hacia la izquierda (cuando la plataforma está más alta que la anterior)
   if (prev && prev.y > p.y) { const wx = p.x0 - (p.kind === 'agri' ? s * 0.012 : s * 0.018); const pts = [[wx, p.y - d * 0.9], [p.x0 + s * 0.004, p.y - d * 0.9], [p.x0 + s * 0.004, prev.y], [wx - s * 0.006, prev.y]]; P.granite(ctx, pts, { seed: i * 7 + 3, c1: '#b8bdb2', c2: '#7c847d', joint: 1 }); if (gl.walls) { ctx.strokeStyle = `rgba(212,172,100,${gl.walls})`; ctx.lineWidth = 3; ctx.strokeRect(wx, p.y - d, p.x0 - wx, prev.y - p.y + d); } }
   // muro hacia la derecha (plataforma más alta que la siguiente)
   const nx = plats[i + 1]; if (nx && nx.y > p.y) { const pts = [[p.x1 - s * 0.004, p.y - d * 0.9], [p.x1 + s * 0.014, p.y - d * 0.9], [p.x1 + s * 0.02, nx.y], [p.x1 - s * 0.004, nx.y]]; P.granite(ctx, pts, { seed: i * 11 + 5, c1: '#a9aea4', c2: '#6f766f', joint: 1 }); if (gl.walls) { ctx.strokeStyle = `rgba(212,172,100,${gl.walls})`; ctx.lineWidth = 3; ctx.strokeRect(p.x1 - 2, p.y - d, s * 0.02, nx.y - p.y + d); } }
   // drenaje bajo la superficie (resaltado)
   if (gl.drain) { ctx.save(); ctx.setLineDash([8, 8]); ctx.lineDashOffset = -t * 30; ctx.strokeStyle = `rgba(55,185,217,${gl.drain})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x0 + 6, p.y + s * 0.03); ctx.lineTo(p.x1 - 6, p.y + s * 0.03); ctx.stroke(); ctx.restore(); }
  });
  // escalinatas entre la plaza y los sectores
  ctx.save(); ctx.strokeStyle = 'rgba(220,214,190,0.8)'; ctx.lineWidth = 2; const st = (xa, ya, xb, yb) => { for (let k = 0; k <= 6; k++) { const u = k / 6, x = lerp(xa, xb, u), y = lerp(ya, yb, u); ctx.beginPath(); ctx.moveTo(x - s * 0.012, y); ctx.lineTo(x + s * 0.012, y); ctx.stroke(); } }; st(X(0.05), Y(0.05), X(0.0), Y(-0.06)); st(X(0.35), Y(0.05), X(0.39), Y(-0.02)); ctx.restore();
  // edificios: apoyados en las plataformas urbanas (base = superficie de la plataforma)
  const R = H.rng(o.seed || 21); const BACK = s * 0.04; for (const row of [0, 1]) plats.forEach((p, i) => { if (p.kind !== 'urb') return; const sc = row === 0 ? 0.85 : 1;
   if (row === 0) { const bx0 = p.x0 + s * 0.01, bx1 = p.x1 - s * 0.01, by = p.y - d * 0.9 - BACK; P.granite(ctx, [[bx0, by], [bx1, by], [bx1, p.y - d * 0.9], [bx0, p.y - d * 0.9]], { seed: i * 5 + 1, c1: '#b2b7ac', c2: '#7c847d', joint: 1 }); ctx.fillStyle = age > 0.6 ? '#8aa86e' : '#a89a7c'; ctx.fillRect(bx0, by - d * 0.6, bx1 - bx0, d * 0.6); }
   let x = p.x0 + s * (row === 0 ? 0.03 : 0.014); while (x < p.x1 - s * 0.05) { const bw = Math.min(s * R.range(0.05, 0.08) * sc, p.x1 - s * 0.014 - x), bh = s * R.range(0.06, 0.08) * sc, base = row === 0 ? p.y - d * 0.9 - BACK - d * 0.3 : p.y - d * 0.2; if (bw < s * 0.04) break; const ruin = age > 0.5 && R() < 0.3 ? R.range(0.55, 0.8) : 1, ht = bh * ruin, top = base - ht, dd = s * 0.02;
    ctx.fillStyle = 'rgba(20,30,25,0.35)'; ctx.fillRect(x - 2, base - 2, bw + dd + 4, 5); // sombra de contacto
    P.granite(ctx, [[x + bw, top], [x + bw + dd, top - dd * 0.55], [x + bw + dd, base - dd * 0.55], [x + bw, base]], { seed: Math.round(x) + 1, c1: '#8f968e', c2: '#656d66', bevel: false });
    P.granite(ctx, [[x, top], [x + bw, top], [x + bw, base], [x, base]], { seed: Math.round(x + base), c1: '#c8c4b0', c2: '#9a9a8c', joint: 1 });
    ctx.strokeStyle = 'rgba(60,62,55,0.35)'; ctx.lineWidth = 1; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x, top + k * ht / 4); ctx.lineTo(x + bw, top + k * ht / 4); ctx.stroke(); }
    const dw = bw * 0.2, dh = ht * 0.62; ctx.fillStyle = '#2c3530'; ctx.beginPath(); ctx.moveTo(x + bw * 0.4, base); ctx.lineTo(x + bw * 0.4 + dw * 0.14, base - dh); ctx.lineTo(x + bw * 0.4 + dw * 0.86, base - dh); ctx.lineTo(x + bw * 0.4 + dw, base); ctx.closePath(); ctx.fill(); if (ruin === 1 && bw > s * 0.1) { ctx.beginPath(); ctx.moveTo(x + bw * 0.12, top + ht * 0.55); ctx.lineTo(x + bw * 0.14, top + ht * 0.3); ctx.lineTo(x + bw * 0.22, top + ht * 0.3); ctx.lineTo(x + bw * 0.24, top + ht * 0.55); ctx.closePath(); ctx.fill(); }
    if (ruin === 1) { P.granite(ctx, [[x + bw, top], [x + bw + dd * 0.5, top - bh * 0.5 - dd * 0.3], [x + bw + dd, top - dd * 0.55]], { seed: Math.round(x) + 9, c1: '#a9aea4', c2: '#7c847d', bevel: false }); }
    if (age < 1 && ruin === 1) { ctx.save(); ctx.globalAlpha *= 1 - age; ctx.fillStyle = '#a07f48'; ctx.beginPath(); ctx.moveTo(x - s * 0.01, top + 1); ctx.lineTo(x + bw * 0.12, top - bh * 0.55); ctx.lineTo(x + bw + dd * 0.5, top - bh * 0.55 - dd * 0.3); ctx.lineTo(x + bw + dd + s * 0.006, top - dd * 0.55); ctx.lineTo(x + bw + s * 0.01, top + 1); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(90,66,32,0.55)'; for (let q = 1; q < 7; q++) { ctx.beginPath(); ctx.moveTo(x + q * bw / 7, top + 1); ctx.lineTo(x + bw * 0.12 + q * (bw * 0.88 + dd * 0.5) / 7, top - bh * 0.55); ctx.stroke(); } ctx.restore(); }
    if (age > 0.6) { ctx.fillStyle = `rgba(110,140,80,${(age - 0.6) * 1.5})`; ctx.fillRect(x, base - 3, bw, 3); }
    if (gl.walls) { ctx.strokeStyle = `rgba(212,172,100,${gl.walls})`; ctx.lineWidth = 2; ctx.strokeRect(x, top, bw, base - top); }
    x += bw + dd + s * R.range(0.012, 0.025); } });
  // árboles y arbustos en las laderas (vegetación moderada)
  const Rt = H.rng(55); for (let i = 0; i < 22; i++) { const u = Rt() < 0.5 ? Rt.range(-1.6, -0.5) : Rt.range(1.15, 1.75), x = X(u), y = ground(x) + s * Rt.range(0.12, 0.6); ctx.fillStyle = Rt() < 0.5 ? '#3d5a3f' : '#4f6e48'; ctx.beginPath(); ctx.arc(x, y, s * Rt.range(0.02, 0.04), 0, TAU); ctx.arc(x + s * 0.025, y + s * 0.01, s * Rt.range(0.018, 0.03), 0, TAU); ctx.fill(); }
  // canal de abastecimiento: desde la ladera de la derecha, bajando suavemente hasta el sector urbano (y fuentes)
  if ((o.canal ?? 0) > 0) { const pts = [[X(-0.11), Y(-0.235) - d * 0.5], [X(0.035), Y(-0.235) - d * 0.5], [X(0.05), Y(-0.12)], [X(0.065), Y(0.0)], [X(0.07), Y(0.03) - d * 0.5], [X(0.2), Y(0.03) - d * 0.5]]; ctx.save(); ctx.globalAlpha *= o.canal; P.strokePath(ctx, pts, 9, '#858d86'); ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t * 40; P.strokePath(ctx, pts, 4, gl.water ? `rgba(122,230,242,${0.6 + 0.4 * gl.water})` : '#37b9d9'); ctx.setLineDash([]); for (let k = 0; k < 4; k++) { const y = lerp(Y(-0.2), Y(0.0), k / 3), x = lerp(X(0.04), X(0.065), k / 3); P.circle(ctx, x + s * 0.02, y, s * 0.012, '#7AE6F2'); } ctx.restore(); }
  return { plats, ground };
 };
 // ================= v1.13 · NAVEGACIÓN NÓRDICA (episodio «Vikingos en América») =================
 // Mar cinematográfico por filas en perspectiva. o: { hor, sky:[arriba, horizonte], sun:[x,y], sunA, clouds, mood
 // ('calma'|'fresco'|'tormenta'), amp, fogA, seed, x0, x1, part ('back'|'front'), split (y), flow (px/s: el mar pasa junto al barco), crest, flash (relámpago 0..1) }.
 // Devuelve { waveY(x, yBase), float(x, yBase, len) → {y, ang} } para posar barcos sobre el agua.
 const SEA_ROWS = 30;
 const seaRow = (o, z) => { const amp = (o.amp ?? 1) * (o.mood === 'tormenta' ? 1.8 : o.mood === 'calma' ? 0.55 : 1); return { A: amp * (2 + 46 * z * z), L: 90 + 760 * z, w: 1.1 + 0.4 * (1 - z) }; };
 P.seaWave = (o, x, yb, t) => { const hor = o.hor ?? 760, bot = o.bottom ?? HH + 400, z = cl(Math.pow(Math.max(0, yb - hor) / (bot - hor), 1 / 1.7)); const r = seaRow(o, z), k = TAU / r.L, ph = (o.seed || 0) * 1.7 + z * 37;
  x += t * (o.flow || 0) * (0.3 + z); return yb + r.A * (Math.sin(k * x - r.w * t * 1.6 + ph) * 0.7 + Math.sin(k * 2.3 * x + r.w * t * 1.1 + ph * 2) * 0.3); };
 P.seaHD = (ctx, t, o = {}) => {
  const hor = o.hor ?? 760, bot = o.bottom ?? HH + 400, x0 = o.x0 ?? -600, x1 = o.x1 ?? W + 600, part = o.part, split = o.split ?? 1e9, storm = o.mood === 'tormenta';
  const deep = o.deep || (storm ? '#0c2230' : '#102C3A'), lit = o.lit || (storm ? '#3b5866' : '#2D6274'), foam = o.foam || '#DCE8E9';
  if (part !== 'front') {
   const sky = o.sky || (storm ? ['#3c4d58', '#647C8B'] : ['#5f8aa0', '#A7C8D4']); const g = ctx.createLinearGradient(0, hor - 1400, 0, hor); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); ctx.fillStyle = g; ctx.fillRect(x0, hor - 3000, x1 - x0, 3000 + 2);
   if (o.sun) { const sa = o.sunA ?? 1; P.glow(ctx, o.sun[0], o.sun[1], 520, '255,228,190', 0.45 * sa); P.glow(ctx, o.sun[0], o.sun[1], 120, '255,245,225', 0.9 * sa); }
   const R = H.rng(o.seed || 5), nc = o.clouds ?? 9; for (let i = 0; i < nc; i++) { const cy = hor - R.range(120, 900), cs = R.range(140, 340) * (1 - (hor - cy) / 1600 * 0.3), cx = x0 + ((R() * (x1 - x0) + t * R.range(4, 12)) % (x1 - x0)); ctx.save(); ctx.globalAlpha *= (storm ? 0.8 : 0.55) * R.range(0.6, 1); const top = storm ? '98,112,122' : '246,250,251', bt = storm ? '52,64,72' : '170,192,204'; for (let q = 0; q < 9; q++) { const px = cx + (q - 4) * cs * 0.24 + R.range(-0.08, 0.08) * cs, py = cy - Math.sin((q + 0.5) / 9 * Math.PI) * cs * 0.2, pr = cs * R.range(0.18, 0.3); const cg = ctx.createRadialGradient(px, py - pr * 0.3, pr * 0.1, px, py, pr); cg.addColorStop(0, `rgba(${top},0.95)`); cg.addColorStop(0.7, `rgba(${top},0.6)`); cg.addColorStop(1, `rgba(${top},0)`); ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(px, py, pr, 0, TAU); ctx.fill(); } const bg2 = ctx.createLinearGradient(0, cy - cs * 0.05, 0, cy + cs * 0.12); bg2.addColorStop(0, `rgba(${bt},0)`); bg2.addColorStop(1, `rgba(${bt},0.35)`); ctx.fillStyle = bg2; ctx.beginPath(); ctx.ellipse(cx, cy + cs * 0.03, cs * 1.0, cs * 0.1, 0, 0, TAU); ctx.fill(); ctx.restore(); }
   // brillo del sol en el agua cerca del horizonte
   const sg = ctx.createLinearGradient(0, hor, 0, bot); sg.addColorStop(0, lit); sg.addColorStop(0.35, deep); sg.addColorStop(1, '#081822'); ctx.fillStyle = sg; ctx.fillRect(x0, hor, x1 - x0, bot - hor + 400);
   ctx.fillStyle = 'rgba(220,232,233,0.25)'; ctx.fillRect(x0, hor - 2, x1 - x0, 4);
   if ((o.flash || 0) > 0) { ctx.fillStyle = `rgba(235,242,255,${0.55 * o.flash})`; ctx.fillRect(x0, hor - 3000, x1 - x0, 3000 + (bot - hor)); }
  }
  const R2 = H.rng((o.seed || 5) + 11);
  for (let r = 0; r <= SEA_ROWS; r++) {
   const z = r / SEA_ROWS, yr = hor + (bot - hor) * Math.pow(z, 1.7); if (r === 0) continue; if (part === 'back' && yr >= split) break; if (part === 'front' && yr < split) continue;
   const rw = seaRow(o, z), step = Math.max(6, rw.L / 18); const yAt = (x) => P.seaWave(o, x, yr, t);
   const mix = (a, b, u) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const ch = (s) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, u)); return `rgb(${ch(16)},${ch(8)},${ch(0)})`; };
   ctx.beginPath(); ctx.moveTo(x0, bot + 400); for (let x = x0; x <= x1 + step; x += step) ctx.lineTo(x, yAt(x)); ctx.lineTo(x1, bot + 400); ctx.closePath(); { const rg = ctx.createLinearGradient(0, yr - rw.A, 0, yr + rw.A + (bot - hor) * 0.06 * (0.3 + z)); rg.addColorStop(0, mix(o.crest || '#4f8796', lit, cl(0.3 + z * 0.8))); rg.addColorStop(0.45, mix(lit, deep, cl(z * 1.1))); rg.addColorStop(1, mix(lit, deep, cl(z * 1.25 + 0.2))); ctx.fillStyle = rg; } ctx.fill();
   if (o.sun && (o.sunA ?? 1) > 0.05) { const sxp = o.sun[0], spread = 40 + 520 * z, ga = (o.sunA ?? 1) * (storm ? 0.25 : 0.7) * (1 - z * 0.6); ctx.fillStyle = 'rgba(255,240,215,1)'; for (let q = 0; q < 10; q++) { const gx = sxp + (R2() - 0.5) * spread * 2, sh2 = Math.sin(t * 2.5 + q * 1.7 + r); if (sh2 < 0.2) continue; ctx.globalAlpha = ga * sh2 * (1 - Math.abs(gx - sxp) / (spread * 1.1)); if (ctx.globalAlpha <= 0) continue; ctx.beginPath(); ctx.ellipse(gx, yAt(gx) + 2, 6 + 30 * z, 1 + 2.5 * z, 0, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
   ctx.save(); ctx.strokeStyle = `rgba(200,225,230,${0.06 + 0.12 * (1 - z)})`; ctx.lineWidth = 1 + 2 * z; ctx.beginPath(); for (let x = x0; x <= x1 + step; x += step) (x === x0 ? ctx.moveTo(x, yAt(x)) : ctx.lineTo(x, yAt(x))); ctx.stroke(); ctx.restore();
   // espuma en las crestas
   const fa = (storm ? 0.9 : o.mood === 'calma' ? 0.25 : 0.55) * (0.4 + z); const kk = TAU / rw.L, ph = (o.seed || 0) * 1.7 + z * 37; ctx.fillStyle = foam;
   for (let x = x0; x <= x1; x += step) { const s1 = Math.sin(kk * (x + t * (o.flow || 0) * (0.3 + z)) - rw.w * t * 1.6 + ph); if (s1 > 0.82) { const fy = yAt(x); ctx.globalAlpha = fa * (s1 - 0.82) * 5; ctx.beginPath(); ctx.ellipse(x, fy + 1, step * 0.9, 1.5 + 5 * z, 0, 0, TAU); ctx.fill(); } }
   ctx.globalAlpha = 1;
   if (z > 0.25 && R2() < 0.9) { ctx.save(); ctx.globalAlpha = 0.12 * z; ctx.fillStyle = '#9fc4cc'; for (let q = 0; q < 6; q++) { const sx = x0 + ((R2() * (x1 - x0) + t * 20 * z) % (x1 - x0)); ctx.fillRect(sx, yAt(sx) + 8 + R2() * 20 * z, 40 + 120 * z, 2 + 2 * z); } ctx.restore(); }
  }
  if (part !== 'back' && (o.fogA ?? 0) > 0) P.fog(ctx, hor - 220, 420, t, { a: o.fogA, seed: 4, speed: 14 });
  return { waveY: (x, yb) => P.seaWave(o, x, yb, t), float: (x, yb, len) => { const a = P.seaWave(o, x - len / 2, yb, t), b = P.seaWave(o, x + len / 2, yb, t), m = P.seaWave(o, x, yb, t); return { y: (a + b + m * 2) / 4, ang: Math.atan2(b - a, len) * 0.8 }; } };
 };
 // Knarr nórdico (barco mercante oceánico) de perfil, casco trincado (tablas superpuestas con remaches).
 // (x, y) = centro en la línea de flotación; s = eslora en px. o: { ang, sail (0 recogida → 1 izada), billow (0..1 viento),
 // reef, oars (0..1), oarN, oarPhase, xray (0..1: casco transparente, se ven quilla, cuadernas y bancos), flex (−1..1, sutil),
 // crew, flip, wake (0..1), spray, stripes, glow:{keel, planks, mast, sail, oars} }. Devuelve puntos clave en coordenadas de lienzo.
 P.knarr = (ctx, x, y, s, t, o = {}) => {
  // v1.13.1: casco con volumen (cara interior de la borda opuesta, cuadernas y bancos visibles), tracas con vetas y
  // variaciones de tono, remaches, juntas de empalme, quilla marcada, timón lateral con caña y soporte, jarcia con
  // obenques y vigotas, braza y escotas tensas; balanceo (roll) y vela que respira con el viento.
  const ang = o.ang || 0, fl = o.flip ? -1 : 1, L = s / 2, fb = s * 0.088, dr = s * 0.05, xr = o.xray || 0, flex = (o.flex || 0) * s * 0.006, gl = o.glow || {}, roll = o.roll || 0;
  const sheer = (u) => -(fb + s * 0.07 * Math.pow(Math.abs(u), 4.2)) + flex * (1 - u * u);
  const keel = (u) => dr * (1 - Math.pow(Math.abs(u), 5)) + flex * (1 - u * u);
  const dep = s * (0.03 + 0.012 * roll); // profundidad aparente de la borda (cara interior de la banda opuesta)
  const farS = (u) => sheer(u) - dep * (1 - Math.pow(Math.abs(u), 6));
  const P2 = (lx, ly) => { const c = Math.cos(ang), si = Math.sin(ang); return [x + (lx * fl) * c - ly * si, y + (lx * fl) * si + ly * c]; };
  const R = H.rng(o.seed || 41), seg = 56, N = 8, line = (f, u) => lerp(keel(u), sheer(u), f);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(fl, 1);
  // sombra/oscurecimiento del agua bajo el casco
  ctx.save(); ctx.globalAlpha *= 0.35; const sg0 = ctx.createRadialGradient(0, dr, 0, 0, dr, L * 1.1); sg0.addColorStop(0, 'rgba(5,15,22,0.9)'); sg0.addColorStop(1, 'rgba(5,15,22,0)'); ctx.fillStyle = sg0; ctx.beginPath(); ctx.ellipse(0, dr * 0.6, L * 1.15, s * 0.06, 0, 0, TAU); ctx.fill(); ctx.restore();
  // --- cara interior de la banda opuesta (da profundidad a la borda) ---
  ctx.save(); ctx.globalAlpha *= 1 - xr * 0.6;
  ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, farS(u)); } for (let k = seg; k >= 0; k--) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, sheer(u)); } ctx.closePath();
  const ig = ctx.createLinearGradient(0, -fb - dep, 0, -fb); ig.addColorStop(0, '#8a603e'); ig.addColorStop(1, '#4e3322'); ctx.fillStyle = ig; ctx.fill();
  ctx.strokeStyle = 'rgba(40,25,14,0.55)'; ctx.lineWidth = Math.max(1, s * 0.002); for (let i = 1; i < 3; i++) { ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -0.97 + 1.94 * k / seg; ctx.lineTo(L * u, lerp(farS(u), sheer(u), i / 3)); } ctx.stroke(); }
  ctx.fillStyle = 'rgba(60,38,22,0.75)'; for (let i = -7; i <= 7; i++) { const u = i / 8.2; ctx.fillRect(L * u - s * 0.004, farS(u) + 1, s * 0.008, sheer(u) - farS(u)); }
  // bancos y carga
  ctx.fillStyle = '#6d4a30'; for (const u of [-0.62, -0.35, 0.36, 0.62]) ctx.fillRect(L * u - s * 0.035, sheer(u) - dep * 0.35, s * 0.07, s * 0.008);
  if (o.cargo !== false) { const cu = -0.05; ctx.fillStyle = '#7a5a3a'; ctx.fillRect(L * (cu - 0.2), sheer(cu) - dep * 0.9, s * 0.09, dep * 0.9); ctx.fillStyle = '#8b6a45'; ctx.fillRect(L * (cu + 0.12), sheer(cu) - dep * 0.75, s * 0.07, dep * 0.75); ctx.strokeStyle = 'rgba(35,22,12,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(L * (cu - 0.2), sheer(cu) - dep * 0.9, s * 0.09, dep * 0.9); }
  ctx.strokeStyle = '#3e2718'; ctx.lineWidth = s * 0.006; ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, farS(u)); } ctx.stroke();
  ctx.restore();
  // --- remo de gobierno (detrás del casco: banda de estribor lejana si flip; aquí siempre en la aleta de estribor) ---
  const rudder = () => { const u0 = -0.84, bx = L * u0, by = sheer(u0); ctx.save(); ctx.globalAlpha *= 1 - xr * 0.5; ctx.strokeStyle = '#4a2f1f'; ctx.lineCap = 'round'; ctx.lineWidth = s * 0.014; ctx.beginPath(); ctx.moveTo(bx + s * 0.01, by - s * 0.05); ctx.lineTo(bx - s * 0.03, dr * 1.7); ctx.stroke();
   ctx.fillStyle = '#5D3D29'; ctx.beginPath(); ctx.moveTo(bx - s * 0.012, dr * 0.6); ctx.quadraticCurveTo(bx - s * 0.055, dr * 1.4, bx - s * 0.038, dr * 2.2); ctx.lineTo(bx - s * 0.018, dr * 2.1); ctx.quadraticCurveTo(bx - s * 0.01, dr * 1.2, bx + s * 0.004, dr * 0.6); ctx.closePath(); ctx.fill();
   ctx.strokeStyle = '#3a2416'; ctx.lineWidth = s * 0.006; ctx.beginPath(); ctx.moveTo(bx + s * 0.01, by - s * 0.045); ctx.lineTo(bx + s * 0.09, by - s * 0.06); ctx.stroke(); // caña
   ctx.fillStyle = '#3a2416'; ctx.beginPath(); ctx.ellipse(bx, by + s * 0.018, s * 0.012, s * 0.016, 0, 0, TAU); ctx.fill(); ctx.restore(); }; // soporte (tojo)
  // remos (pocos: el knarr navegaba sobre todo a vela), por la banda cercana
  const oa = o.oars || 0, on = o.oarN ?? 4; const oarTips = [];
  const drawOars = () => { if (oa <= 0) return; ctx.save(); ctx.globalAlpha *= oa; for (let i = 0; i < on; i++) { const u = i < on / 2 ? 0.5 + i * 0.13 : -0.48 - (i - on / 2) * 0.13, ph = (o.oarPhase || 0) * TAU - i * 0.2, sw = Math.sin(ph), lift = Math.max(0, Math.cos(ph)); const px = L * u, py = sheer(u) + s * 0.02; const ex = px - sw * s * 0.13, ey = dr * 0.7 - lift * s * 0.05; oarTips.push(P2(ex, ey));
    ctx.strokeStyle = gl.oars ? `rgba(255,212,71,${0.6 + 0.4 * gl.oars})` : '#8a6a46'; ctx.lineWidth = s * 0.008; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px + sw * s * 0.05, py - s * 0.05); ctx.lineTo(ex, ey); ctx.stroke(); ctx.fillStyle = gl.oars ? '#FFD447' : '#8a6a46'; ctx.beginPath(); ctx.ellipse(ex, ey, s * 0.008, s * 0.026, -0.4 - sw * 0.3, 0, TAU); ctx.fill(); } ctx.restore(); };
  // --- casco (banda cercana): tracas superpuestas de abajo arriba con vetas y tonos variables ---
  ctx.save(); ctx.globalAlpha *= 1 - xr * 0.75;
  const tones = []; for (let i = 0; i < N; i++) tones.push(R.range(-14, 14));
  const shade = (base, d) => { const c = parseInt(base.slice(1), 16), f = (v) => Math.max(0, Math.min(255, v + d)); return `rgb(${f(c >> 16)},${f((c >> 8) & 255)},${f(c & 255)})`; };
  for (let i = 0; i < N; i++) { const f0 = i / N, f1 = (i + 1) / N + 0.022;
   ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, line(f1, u)); } for (let k = seg; k >= 0; k--) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, line(f0, u)); } ctx.closePath();
   const lit = 0.35 + 0.65 * (i / (N - 1)); const g = ctx.createLinearGradient(0, line(f1, 0), 0, line(f0, 0)); g.addColorStop(0, shade('#a4774f', tones[i] + 18 * lit)); g.addColorStop(0.8, shade('#7b5436', tones[i] - 10 + 10 * lit)); g.addColorStop(1, shade('#4a2f1f', tones[i])); ctx.fillStyle = g; ctx.fill();
   // vetas
   ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(55,33,18,0.22)'; ctx.lineWidth = Math.max(0.8, s * 0.0013); for (let q = 0; q < 3; q++) { const fq = lerp(f0, f1, 0.25 + q * 0.22), ph = R.range(0, 6); ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, line(fq, u) + Math.sin(u * 9 + ph) * s * 0.0015); } ctx.stroke(); }
   ctx.strokeStyle = 'rgba(35,20,10,0.55)'; ctx.lineWidth = Math.max(1, s * 0.002); for (const uj of [-0.55 + i * 0.13, 0.2 + ((i * 0.37) % 0.5)]) { const u = uj > 0.95 ? uj - 1.6 : uj; ctx.beginPath(); ctx.moveTo(L * u, line(f0, u)); ctx.lineTo(L * u + s * 0.012, line(f1, u)); ctx.stroke(); } ctx.restore();
   // sombra que proyecta la traca superior sobre la inferior (solape) y luz en el canto
   ctx.strokeStyle = 'rgba(25,14,6,0.6)'; ctx.lineWidth = Math.max(1.2, s * 0.004); ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, line(f0, u) - 1); } ctx.stroke();
   ctx.strokeStyle = 'rgba(255,228,190,0.22)'; ctx.lineWidth = Math.max(1, s * 0.002); ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, line(f1, u) + s * 0.003); } ctx.stroke();
   if (s > 220) { ctx.fillStyle = gl.rivets ? '#FFD447' : 'rgba(45,32,24,0.85)'; const nR = Math.round(s / 26); for (let k = 1; k < nR; k++) { const u = -0.96 + 1.92 * k / nR; ctx.beginPath(); ctx.arc(L * u, line(f0, u) - s * 0.006, Math.max(1, s * 0.0026), 0, TAU); ctx.fill(); } }
   if (gl.planks) { ctx.strokeStyle = `rgba(255,212,71,${gl.planks})`; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, line(f0, u)); } ctx.stroke(); }
  }
  // oscurecimiento junto a la línea de flotación y brillo del sol en la parte alta
  ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, keel(u)); } for (let k = seg; k >= 0; k--) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, sheer(u)); } ctx.closePath(); ctx.save(); ctx.clip(); const ag = ctx.createLinearGradient(0, -fb, 0, dr); ag.addColorStop(0, 'rgba(255,235,200,0.10)'); ag.addColorStop(0.55, 'rgba(0,0,0,0)'); ag.addColorStop(1, 'rgba(8,16,22,0.55)'); ctx.fillStyle = ag; ctx.fillRect(-L * 1.1, -fb * 2, s * 1.1, fb * 2 + dr * 2); ctx.restore();
  // quilla
  ctx.strokeStyle = '#3a2416'; ctx.lineWidth = s * 0.012; ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -0.97 + 1.94 * k / seg; ctx.lineTo(L * u, keel(u) + s * 0.004); } ctx.stroke();
  // roda y codaste
  ctx.strokeStyle = '#4a2f1f'; ctx.lineWidth = s * 0.017; ctx.lineCap = 'round'; for (const sd of [1, -1]) { ctx.beginPath(); ctx.moveTo(L * sd * 0.96, keel(0.96)); ctx.bezierCurveTo(L * sd * 1.06, keel(1) - s * 0.02, L * sd * 1.07, sheer(1), L * sd * 1.04, sheer(1) - s * 0.035); ctx.stroke(); ctx.strokeStyle = 'rgba(255,228,190,0.25)'; ctx.lineWidth = s * 0.004; ctx.stroke(); ctx.strokeStyle = '#4a2f1f'; ctx.lineWidth = s * 0.017; }
  // regala (borda cercana) con brillo
  ctx.strokeStyle = '#3e2718'; ctx.lineWidth = s * 0.01; ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, sheer(u)); } ctx.stroke(); ctx.strokeStyle = 'rgba(255,230,195,0.35)'; ctx.lineWidth = s * 0.0025; ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -1 + 2 * k / seg; ctx.lineTo(L * u, sheer(u) - s * 0.004); } ctx.stroke();
  ctx.restore();
  rudder(); drawOars();
  // estructura interna (rayos X)
  if (xr > 0) { ctx.save(); ctx.globalAlpha *= xr;
   ctx.strokeStyle = gl.keel ? `rgba(255,212,71,${0.7 + 0.3 * gl.keel})` : '#c9925a'; ctx.lineWidth = s * 0.018; ctx.beginPath(); for (let k = 0; k <= seg; k++) { const u = -0.98 + 1.96 * k / seg; ctx.lineTo(L * u, keel(u) - s * 0.006); } ctx.stroke();
   ctx.strokeStyle = gl.ribs ? `rgba(255,212,71,${0.7 + 0.3 * gl.ribs})` : '#d9a46b'; ctx.lineWidth = s * 0.008; for (let i = -6; i <= 6; i++) { const u = i / 7.2; ctx.beginPath(); ctx.moveTo(L * u, keel(u) - s * 0.01); ctx.quadraticCurveTo(L * u * 1.02, (keel(u) + sheer(u)) / 2, L * u, sheer(u) + s * 0.006); ctx.stroke(); }
   ctx.strokeStyle = '#b07a48'; ctx.lineWidth = s * 0.007; for (let i = -3; i <= 3; i++) { const u = i / 4.2; ctx.beginPath(); ctx.moveTo(L * u - s * 0.02, line(0.62, u)); ctx.lineTo(L * u + s * 0.02, line(0.62, u)); ctx.stroke(); }
   ctx.fillStyle = '#8b5a33'; ctx.fillRect(L * 0.05 - s * 0.03, keel(0.05) - s * 0.03, s * 0.06, s * 0.025);
   ctx.restore(); }
  // --- mástil, verga, vela cuadrada y jarcia ---
  const lean = roll * s * 0.03, mx = L * 0.06, mTop = -s * 0.6, yardY = mTop + s * 0.045, sail = o.sail ?? 1, gust = 1 + 0.05 * Math.sin(t * 1.7) + 0.03 * Math.sin(t * 4.3), bil = cl((o.billow ?? 0.7) * gust, 0, 1.1), yw = s * 0.33;
  const MX = (yy) => mx + lean * (yy / mTop); // el mástil se inclina con el balanceo
  ctx.save(); ctx.lineCap = 'round';
  // obenques con vigotas (banda cercana) y estay de proa / popa
  ctx.strokeStyle = 'rgba(158,131,94,0.95)'; ctx.lineWidth = Math.max(1.2, s * 0.0035); ctx.beginPath(); ctx.moveTo(MX(mTop), mTop + s * 0.01); ctx.lineTo(L * 1.02, sheer(1) - s * 0.03); ctx.moveTo(MX(mTop), mTop + s * 0.01); ctx.lineTo(-L * 1.0, sheer(-1) - s * 0.03); ctx.stroke();
  for (const du of [0.16, 0.24, -0.14, -0.22]) { const u = 0.06 + du, bx = L * u, by = sheer(u); ctx.beginPath(); ctx.moveTo(MX(mTop + s * 0.04), mTop + s * 0.04); ctx.lineTo(bx, by - s * 0.03); ctx.stroke(); ctx.fillStyle = '#4a2f1f'; ctx.beginPath(); ctx.arc(bx, by - s * 0.03, Math.max(2, s * 0.005), 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(bx, by - s * 0.03); ctx.lineTo(bx, by); ctx.stroke(); }
  ctx.strokeStyle = gl.mast ? `rgba(255,212,71,${0.6 + 0.4 * gl.mast})` : '#5D3D29'; ctx.lineWidth = s * 0.017; ctx.beginPath(); ctx.moveTo(mx, sheer(0.06) + s * 0.01); ctx.lineTo(MX(mTop), mTop); ctx.stroke(); ctx.strokeStyle = 'rgba(255,228,190,0.25)'; ctx.lineWidth = s * 0.004; ctx.beginPath(); ctx.moveTo(mx - s * 0.004, sheer(0.06)); ctx.lineTo(MX(mTop) - s * 0.004, mTop); ctx.stroke();
  const sh = s * 0.37 * sail, bel = bil * s * 0.055 * sail, ymx = MX(yardY);
  ctx.lineWidth = s * 0.012; ctx.strokeStyle = '#4a3020'; ctx.beginPath(); ctx.moveTo(ymx - yw, yardY + s * 0.006); ctx.quadraticCurveTo(ymx, yardY - s * 0.004, ymx + yw, yardY + s * 0.006); ctx.stroke();
  if (sail > 0.02) { const top = yardY, b = yardY + sh, flap = Math.sin(t * 6) * s * 0.003 * (1 - Math.min(1, bil));
   const shape = () => { ctx.beginPath(); ctx.moveTo(ymx - yw, top); ctx.lineTo(ymx + yw, top); ctx.bezierCurveTo(ymx + yw + bel * 0.7, top + sh * 0.35, ymx + yw + bel * 0.5, top + sh * 0.75, ymx + yw * 0.95 + flap, b); ctx.quadraticCurveTo(ymx, b + bel * 0.55, ymx - yw * 0.95 - flap, b); ctx.bezierCurveTo(ymx - yw - bel * 0.5, top + sh * 0.75, ymx - yw - bel * 0.7, top + sh * 0.35, ymx - yw, top); ctx.closePath(); };
   ctx.save(); shape(); ctx.clip(); const sgr = ctx.createLinearGradient(ymx - yw, 0, ymx + yw, 0); sgr.addColorStop(0, '#a8946f'); sgr.addColorStop(0.4, '#ded0b0'); sgr.addColorStop(0.7, '#d2c19f'); sgr.addColorStop(1, '#a8946f'); ctx.fillStyle = sgr; ctx.fillRect(ymx - yw * 1.4, top - 4, yw * 2.8, sh + bel + 10);
   if (o.stripes !== false) { ctx.fillStyle = 'rgba(143,59,42,0.86)'; for (let i = -2; i <= 2; i += 2) { const cx0 = ymx + i * yw * 0.33; ctx.beginPath(); ctx.moveTo(cx0 - yw * 0.1, top - 4); ctx.lineTo(cx0 + yw * 0.1, top - 4); ctx.quadraticCurveTo(cx0 + yw * 0.1 + i * bel * 0.12, top + sh * 0.5, cx0 + yw * 0.1 + i * bel * 0.05, b + bel); ctx.lineTo(cx0 - yw * 0.1 + i * bel * 0.05, b + bel); ctx.quadraticCurveTo(cx0 - yw * 0.1 + i * bel * 0.12, top + sh * 0.5, cx0 - yw * 0.1, top - 4); ctx.closePath(); ctx.fill(); } }
   const vg = ctx.createLinearGradient(0, top, 0, b + bel); vg.addColorStop(0, 'rgba(255,245,225,0.18)'); vg.addColorStop(0.5, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(60,40,25,0.28)'); ctx.fillStyle = vg; ctx.fillRect(ymx - yw * 1.4, top - 4, yw * 2.8, sh + bel + 10);
   ctx.strokeStyle = 'rgba(80,60,40,0.22)'; ctx.lineWidth = 1; for (let k = 1; k < 7; k++) { ctx.beginPath(); ctx.moveTo(ymx - yw * 1.2, top + sh * k / 7); ctx.quadraticCurveTo(ymx, top + sh * k / 7 + bel * 0.45 * Math.sin(Math.PI * k / 7), ymx + yw * 1.2, top + sh * k / 7); ctx.stroke(); }
   ctx.restore(); shape(); ctx.strokeStyle = gl.sail ? `rgba(255,212,71,${0.6 + 0.4 * gl.sail})` : 'rgba(90,70,45,0.75)'; ctx.lineWidth = gl.sail ? 5 : Math.max(1.5, s * 0.003); ctx.stroke();
   // escotas y brazas tensas
   ctx.strokeStyle = 'rgba(158,131,94,0.95)'; ctx.lineWidth = Math.max(1.2, s * 0.0035); ctx.beginPath(); ctx.moveTo(ymx + yw * 0.95, b); ctx.lineTo(L * 0.66, sheer(0.66)); ctx.moveTo(ymx - yw * 0.95, b); ctx.lineTo(-L * 0.62, sheer(-0.62)); ctx.moveTo(ymx - yw, top); ctx.lineTo(-L * 0.9, sheer(-0.9) - s * 0.02); ctx.stroke();
  } else { ctx.fillStyle = '#c4b190'; ctx.beginPath(); ctx.ellipse(ymx, yardY + s * 0.01, yw * 0.95, s * 0.014, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(90,70,45,0.6)'; ctx.lineWidth = 1.5; for (let k = -4; k <= 4; k++) { ctx.beginPath(); ctx.moveTo(ymx + k * yw * 0.2, yardY); ctx.lineTo(ymx + k * yw * 0.2 + 3, yardY + s * 0.022); ctx.stroke(); } }
  ctx.restore();
  // tripulación (ropa de lana; sin cascos con cuernos) de pie tras la borda
  const cr = o.crew ?? 4; for (let i = 0; i < cr; i++) { const u = [-0.66, -0.4, 0.34, 0.58, -0.16, 0.46][i % 6], cx = L * u, cy = sheer(u) + s * 0.004, hh = s * 0.08; ctx.fillStyle = ['#6b4a35', '#4f5d4a', '#7a5a3a', '#55606a'][i % 4]; ctx.beginPath(); ctx.moveTo(cx - hh * 0.2, cy); ctx.quadraticCurveTo(cx - hh * 0.22, cy - hh * 0.55, cx - hh * 0.1, cy - hh * 0.66); ctx.lineTo(cx + hh * 0.1, cy - hh * 0.66); ctx.quadraticCurveTo(cx + hh * 0.22, cy - hh * 0.55, cx + hh * 0.2, cy); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#d2ab85'; ctx.beginPath(); ctx.arc(cx, cy - hh * 0.8, hh * 0.13, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a4030'; ctx.beginPath(); ctx.arc(cx, cy - hh * 0.84, hh * 0.135, Math.PI * 1.05, Math.PI * 1.95); ctx.fill(); ctx.fillStyle = '#6a4a32'; ctx.beginPath(); ctx.ellipse(cx + hh * 0.03, cy - hh * 0.7, hh * 0.08, hh * 0.06, 0, 0, Math.PI); ctx.fill(); }
  ctx.restore();
  const wl = []; for (let k = 0; k <= 16; k++) { const u = -0.98 + 1.96 * k / 16; wl.push(P2(L * u, -s * 0.002)); }
  return { s, ang, flip: fl, bow: P2(L * 1.05, sheer(1) - s * 0.035), stern: P2(-L * 1.05, sheer(-1) - s * 0.035), bowWL: P2(L * 0.99, 0), sternWL: P2(-L * 0.97, 0), mastTop: P2(mx + lean, mTop), mastFoot: P2(mx, sheer(0.06)), sailC: P2(ymx, yardY + sh / 2), sailL: P2(ymx - yw, yardY), sailR: P2(ymx + yw, yardY), keelC: P2(0, keel(0)), hull: (u, f) => P2(L * u, lerp(keel(u), sheer(u), f)), oar: oarTips[0] || P2(L * 0.55, dr * 0.6), oarTips, wl };
 };
 // Agua alrededor del knarr (se dibuja DESPUÉS del mar delantero): espuma en la línea de flotación, bigote de proa,
 // estela, reflejo oscuro y destellos. o: { speed (0..1), spray (0..1) }
 P.knarrWater = (ctx, K, t, o = {}) => { if (!K) return; const s = K.s, sp = o.speed ?? 0.6, R = H.rng(5);
  ctx.save();
  // reflejo / sombra del casco sobre el agua
  ctx.globalAlpha = 0.28; ctx.fillStyle = '#081620'; ctx.beginPath(); K.wl.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + s * 0.012) : ctx.moveTo(p[0], p[1] + s * 0.012))); for (let i = K.wl.length - 1; i >= 0; i--) { const p = K.wl[i], u = i / (K.wl.length - 1); ctx.lineTo(p[0], p[1] + s * (0.03 + 0.03 * Math.sin(u * Math.PI))); } ctx.closePath(); ctx.fill();
  // espuma pegada al casco
  ctx.globalAlpha = 0.85; ctx.strokeStyle = '#eef5f5'; ctx.lineCap = 'round'; K.wl.forEach((p, i) => { if (i === 0) return; const q = K.wl[i - 1], w = 0.3 + 0.7 * Math.abs(Math.sin(t * 2.2 + i * 1.3)); ctx.lineWidth = Math.max(1.5, s * 0.006 * w); ctx.beginPath(); ctx.moveTo(q[0], q[1] + Math.sin(t * 3 + i) * 1.5); ctx.lineTo(p[0], p[1] + Math.sin(t * 3 + i + 1) * 1.5); ctx.stroke(); });
  // bigote de proa y salpicaduras
  const bw = K.bowWL, dir = K.flip; ctx.fillStyle = '#f4fafa'; for (let i = 0; i < 14; i++) { const u = (t * (1.2 + sp) + i / 14) % 1, a = (1 - u) * 0.8 * (0.4 + sp); ctx.globalAlpha = a; ctx.beginPath(); ctx.ellipse(bw[0] - dir * u * s * 0.25, bw[1] + u * s * 0.03 - Math.sin(u * Math.PI) * s * 0.03 * (o.spray ?? sp), s * 0.02 * (1 - u * 0.5), s * 0.006, 0, 0, TAU); ctx.fill(); }
  // estela tras la popa
  const st = K.sternWL; for (let i = 0; i < 18; i++) { const u = i / 17, a = (1 - u) * 0.55 * sp; ctx.globalAlpha = a; const xx = st[0] - dir * u * s * 1.1, sp2 = s * 0.02 * (1 + u * 3); ctx.beginPath(); ctx.ellipse(xx + Math.sin(t * 2 + i) * 4, st[1] + u * s * 0.025, sp2, s * 0.005 * (1 + u), 0, 0, TAU); ctx.fill(); }
  ctx.restore(); };
 // Corte transversal del casco trincado: quilla, tracas que se solapan, remaches, cuaderna y bao.
 // o: { flex (−1..1), explode (0..1 separa las tablas para ver el solape), assemble (0..n: las tablas entran una a una),
 // rivets (0..n: aparecen los remaches), glow:{overlap, rivets, keel, rib}, n }
 P.clinkerSection = (ctx, cx, cy, w, h, t, o = {}) => {
  const n = o.n || 7, ex = o.explode || 0, fl = o.flex || 0, gl = o.glow || {}, pts = { overlaps: [] };
  const curve = (u) => { const a = u * Math.PI * 0.5; return [Math.sin(a) * w * 0.5, -h * 0.05 - (1 - Math.cos(a)) * h * 0.95 + (u > 0.6 ? 0 : 0)]; };
  ctx.save(); ctx.translate(cx, cy);
  for (const sd of [-1, 1]) for (let i = 0; i < n; i++) {
   const u0 = 0.08 + i / n * 0.92, u1 = 0.08 + (i + 1) / n * 0.92 + 0.035, a = curve(u0), b = curve(u1), dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), nx = dy / len, ny = -dx / len, th = Math.max(8, w * 0.022);
   const vis = cl((o.assemble ?? n) - i); if (vis <= 0) continue; const off = ex * 26 * (i % 2 ? 1 : 0.4) + i * 2 * ex + (1 - E.out(vis)) * w * 0.4, bend = fl * i * 0.012 * sd;
   ctx.save(); ctx.globalAlpha *= cl(vis * 2); ctx.scale(sd, 1); ctx.translate(a[0] + nx * (th * 0.5 * (i % 2) + off), a[1] + ny * off); ctx.rotate(Math.atan2(dy, dx) + bend);
   ctx.fillStyle = i % 2 ? '#A4774F' : '#94683f'; ctx.fillRect(0, -th / 2, len, th); ctx.fillStyle = 'rgba(255,230,190,0.25)'; ctx.fillRect(0, -th / 2, len, 2); ctx.strokeStyle = 'rgba(30,18,10,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(0, -th / 2, len, th);
   ctx.strokeStyle = 'rgba(70,45,25,0.35)'; ctx.lineWidth = 1; for (let g = 0; g < 3; g++) { ctx.beginPath(); ctx.moveTo(4, -th / 2 + th * (g + 1) / 4); ctx.lineTo(len - 4, -th / 2 + th * (g + 1) / 4 + Math.sin(g + i) * 2); ctx.stroke(); }
   const rv = cl((o.rivets ?? n) - i + 1); if (i > 0 && rv > 0) { const rr = th * 0.34 * E.back(rv); ctx.fillStyle = gl.rivets ? `rgba(255,212,71,${0.6 + 0.4 * gl.rivets})` : '#3a3530'; for (const fx of [0.06, 0.5, 0.94]) { ctx.beginPath(); ctx.arc(len * fx, 0, rr, 0, TAU); ctx.fill(); } }
   ctx.restore();
   if (i > 0 && sd === 1) pts.overlaps.push([cx + a[0], cy + a[1]]);
   if (i > 0 && gl.overlap) { ctx.save(); ctx.scale(sd, 1); ctx.strokeStyle = `rgba(255,212,71,${gl.overlap})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(a[0], a[1], th * 1.6, 0, TAU); ctx.stroke(); ctx.restore(); }
  }
  // quilla
  ctx.fillStyle = gl.keel ? '#c9925a' : '#5D3D29'; ctx.beginPath(); ctx.moveTo(-w * 0.07, -h * 0.02); ctx.lineTo(w * 0.07, -h * 0.02); ctx.lineTo(w * 0.035, h * 0.12); ctx.lineTo(-w * 0.035, h * 0.12); ctx.closePath(); ctx.fill(); if (gl.keel) { ctx.strokeStyle = `rgba(255,212,71,${gl.keel})`; ctx.lineWidth = 4; ctx.stroke(); }
  pts.keel = [cx, cy + h * 0.05];
  // cuaderna (costilla interior) y bao (viga transversal)
  ctx.save(); ctx.globalAlpha *= 1 - ex * 0.6; ctx.strokeStyle = gl.rib ? `rgba(255,212,71,${0.7 + 0.3 * gl.rib})` : '#c9925a'; ctx.lineWidth = Math.max(10, w * 0.03); ctx.lineCap = 'round'; ctx.beginPath(); for (let k = 0; k <= 30; k++) { const u = -0.82 + 1.64 * k / 30, p = curve(Math.abs(u)); ctx.lineTo(Math.sign(u) * p[0] * 0.9, p[1] * 0.92 - w * 0.03); } ctx.stroke();
  const by = curve(0.72)[1]; ctx.fillStyle = '#8b5a33'; ctx.fillRect(-curve(0.72)[0] * 0.93, by - 12, curve(0.72)[0] * 1.86, 22); ctx.restore();
  pts.rib = [cx + curve(0.45)[0] * 0.9, cy + curve(0.45)[1] * 0.92 - w * 0.03]; pts.beam = [cx, cy + by]; pts.top = [cx + curve(1)[0], cy + curve(1)[1]];
  ctx.restore(); return pts;
 };
 // Mapa ESTILIZADO del Atlántico Norte (Escandinavia, Islandia, Groenlandia, Terranova). Proyección cilíndrica con escala
 // cos(60°). o: { lon0, lon1, lat0, lat1, sea, land, ice, grid, coastGlow }. Devuelve proj([lon, lat]) → [px, py].
 const NATL = { // v1.13.1: costas más fieles (contornos simplificados a mano a partir de mapas físicos)
  groenlandia: [[-43.9, 59.8], [-42.5, 60.5], [-41.5, 61.6], [-40.4, 63.3], [-39.6, 64.6], [-37.5, 65.6], [-35.5, 66.2], [-33, 67.7], [-31, 68.2], [-27, 68.6], [-24.5, 69.8], [-23, 70.5], [-22, 71.8], [-21.8, 73.5], [-20, 74.5], [-18.8, 76.5], [-18.2, 78.5], [-17, 80], [-20, 81.5], [-30, 82.6], [-40, 83.3], [-50, 82.5], [-58, 81.8], [-63, 81.2], [-66, 80], [-71, 78.6], [-72.5, 77.5], [-68, 76.2], [-62, 75.9], [-58, 75.3], [-56.5, 74], [-55.5, 72.5], [-54.5, 71], [-52.5, 70.2], [-54, 69.5], [-51.5, 68.7], [-53.5, 67], [-53, 66], [-52, 64.5], [-50.5, 63], [-49, 61.8], [-48, 61], [-46.5, 60.6], [-45, 60.1]],
  islandia: [[-24.5, 65.5], [-23.6, 65.9], [-22.8, 66.4], [-21.5, 65.6], [-20.5, 66.1], [-18.8, 66.2], [-16.5, 66.5], [-15, 66.2], [-14.5, 65.8], [-13.6, 65.3], [-14.3, 64.6], [-15.4, 64.3], [-17, 63.9], [-18.8, 63.4], [-20.5, 63.7], [-22.7, 63.85], [-21.9, 64.15], [-22.5, 64.55], [-24.0, 64.85], [-22.2, 65.1]],
  escandinavia: [[5.0, 58.9], [5.2, 59.8], [4.9, 61.2], [5.4, 62.2], [6.8, 62.7], [8.3, 63.3], [9.8, 63.8], [11.0, 64.6], [12.3, 65.7], [13.3, 66.8], [14.5, 67.6], [15.8, 68.4], [17.5, 69.2], [19.5, 69.9], [22.5, 70.4], [25.0, 71.1], [28, 71.0], [30.5, 70.4], [31.2, 69.8], [30, 68], [29.7, 66.5], [28.6, 64.5], [29.8, 62.5], [28, 61], [25, 60.3], [22.5, 60.0], [21.4, 61.2], [21.4, 63], [24.5, 64.8], [25.4, 65.3], [22.5, 65.8], [21, 64.6], [19, 63.5], [17.6, 62.5], [17.2, 61.2], [18.4, 60.2], [17.8, 59.3], [16.6, 58.1], [16.4, 57], [14.5, 56.1], [12.9, 55.4], [12.5, 56.5], [11.6, 58.1], [10.5, 59.2], [9.8, 59.0], [8.3, 58.2], [7.0, 58.0], [5.8, 58.4]],
  dinamarca: [[8.1, 55.1], [8.6, 57.1], [10.6, 57.7], [10.4, 56.2], [12.3, 55.4], [9.8, 54.8]],
  britania: [[-5.7, 50.1], [1.4, 51.1], [1.7, 52.8], [0.2, 53.5], [-1.6, 55.1], [-2.1, 57.1], [-1.8, 57.6], [-3.1, 58.6], [-5, 58.6], [-6.2, 57.2], [-5.6, 56.3], [-5.2, 55.6], [-3.2, 54.6], [-4.6, 53.3], [-3.1, 51.6], [-5.2, 51.7]],
  irlanda: [[-10, 51.6], [-6.2, 52.1], [-6, 54.1], [-7.4, 55.3], [-8.5, 54.8], [-10, 54.2]],
  baffin: [[-62, 66.8], [-63.5, 65], [-64.7, 63.3], [-68, 62.5], [-71.5, 63.3], [-74, 64.8], [-77.5, 64.3], [-78.5, 66.5], [-75, 68.5], [-70, 70.6], [-73, 72], [-80, 73.7], [-90, 73.8], [-90, 69], [-82, 69], [-73, 67.5], [-66, 67.5]],
  america: [[-100, 62], [-94, 61], [-78, 62.4], [-77.5, 60.5], [-76.5, 58], [-77, 56], [-79, 54], [-78.5, 51.5], [-80, 51], [-79, 52.5], [-75, 59], [-70, 61.1], [-67.5, 58.4], [-64.3, 60.3], [-63.3, 59], [-62, 57.6], [-61.2, 56.2], [-60, 55.2], [-57.9, 54.4], [-56.2, 53.6], [-55.7, 52.4], [-56.9, 51.45], [-58.7, 51.1], [-60.3, 50.3], [-64, 50.2], [-66.6, 50.1], [-68.5, 49.2], [-70.5, 47.5], [-69, 48.3], [-66.5, 49.1], [-64.3, 48.9], [-64.8, 47.4], [-63.8, 46.1], [-61, 45.6], [-60, 46.0], [-61.4, 45.1], [-64, 44.5], [-66, 43.8], [-70, 43.2], [-71, 41.6], [-100, 41]],
  terranova: [[-59.4, 47.6], [-58.4, 47.6], [-56, 47.6], [-55.4, 46.9], [-54, 47.2], [-53.6, 46.6], [-52.6, 47.5], [-53.1, 47.8], [-53.6, 48.5], [-53.0, 49.0], [-54.5, 49.6], [-55.6, 49.9], [-55.9, 50.8], [-55.5, 51.6], [-56.2, 51.6], [-57.1, 51.0], [-58, 49.9], [-59.2, 48.5]],
 };
 P.NATL = NATL;
 P.northAtlantic = (ctx, x, y, w, h, t, o = {}) => {
  const lon0 = o.lon0 ?? -80, lon1 = o.lon1 ?? 25, lat0 = o.lat0 ?? 43, lat1 = o.lat1 ?? 78, k = Math.cos((o.latRef ?? 60) * Math.PI / 180);
  const sx = w / ((lon1 - lon0) * k), sy = h / (lat1 - lat0), sc = Math.min(sx, sy), ox = x + (w - (lon1 - lon0) * k * sc) / 2, oy = y + (h - (lat1 - lat0) * sc) / 2;
  const proj = (p) => [ox + (p[0] - lon0) * k * sc, oy + (lat1 - p[1]) * sc];
  ctx.save(); const sg = ctx.createLinearGradient(0, y, 0, y + h); sg.addColorStop(0, o.sea || '#163847'); sg.addColorStop(1, '#0D1820'); ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
  if (o.grid !== false) { ctx.strokeStyle = 'rgba(167,200,212,0.10)'; ctx.lineWidth = 1.5; for (let la = 45; la <= 75; la += 10) { const a = proj([lon0, la]), b = proj([lon1, la]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } for (let lo = -80; lo <= 20; lo += 20) { const a = proj([lo, lat0]), b = proj([lo, lat1]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const poly = (pts) => { ctx.beginPath(); P.spline(pts.map(proj), 4).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
  for (const [name, pts] of Object.entries(NATL)) { poly(pts); ctx.fillStyle = o.land || '#49664B'; ctx.fill(); ctx.strokeStyle = 'rgba(220,232,233,0.55)'; ctx.lineWidth = 2; ctx.stroke();
   if (name === 'groenlandia' && o.ice !== false) { const c = proj([-41, 72.5]); ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(0.84, 0.88); ctx.translate(-c[0], -c[1]); poly(pts); ctx.fillStyle = 'rgba(201,229,237,0.92)'; ctx.fill(); ctx.restore(); }
   if (name === 'islandia' || name === 'baffin') { const c = proj(name === 'islandia' ? [-18.5, 64.9] : [-74, 68]); ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(0.45, 0.45); ctx.translate(-c[0], -c[1]); poly(pts); ctx.fillStyle = 'rgba(201,229,237,0.55)'; ctx.fill(); ctx.restore(); } }
  for (const p of [[-7, 62], [-1.3, 60.4], [-3, 59]]) { const q = proj(p); ctx.fillStyle = o.land || '#49664B'; ctx.beginPath(); ctx.arc(q[0], q[1], sc * 0.35, 0, TAU); ctx.fill(); }
  ctx.restore(); return proj;
 };
 // Ruta marítima: curva suave por puntos, se dibuja con p (0..1), trazo discontinuo que fluye y barquito en la punta.
 // o: { c, w, dash, ship (true), glow, speed }. Devuelve P.path de la curva completa.
 P.seaRoute = (ctx, pts, p, t, o = {}) => {
  const cv = P.spline(pts, 14), pa = P.path(cv), end = pa.L * cl(p); if (p <= 0) return pa; const c = o.c || '#FFD447', w = o.w || 7;
  const sub = [cv[0]]; for (let s = 10; s < end; s += 10) { const q = pa.at(s); sub.push([q[0], q[1]]); } const e = pa.at(end); sub.push([e[0], e[1]]);
  ctx.save(); if (o.glow !== false) P.strokePath(ctx, sub, w * 3.2, 'rgba(255,212,71,0.18)'); ctx.setLineDash(o.dash || [w * 2.6, w * 1.8]); ctx.lineDashOffset = -t * (o.speed ?? 40); P.strokePath(ctx, sub, w, c); ctx.setLineDash([]); ctx.restore();
  if (o.ship !== false && p < 1.0001) { ctx.save(); ctx.translate(e[0], e[1]); ctx.rotate(e[2]); const z = o.shipS || w * 3.4; ctx.fillStyle = '#5D3D29'; ctx.beginPath(); ctx.moveTo(-z, -z * 0.15); ctx.quadraticCurveTo(0, z * 0.55, z, -z * 0.15); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#D7C6A5'; ctx.fillRect(-z * 0.45, -z * 1.05, z * 0.9, z * 0.8); ctx.fillStyle = 'rgba(143,59,42,0.9)'; ctx.fillRect(-z * 0.1, -z * 1.05, z * 0.2, z * 0.8); ctx.restore(); }
  return pa;
 };
 // Costa del Atlántico Norte en la distancia (sobre la línea y). o: { x0, x1, h, c, snow, ice, green, seed, kind: 'fiordo'|'volcanica'|'glaciar'|'baja' }
 P.coast = (ctx, y, t, o = {}) => {
  const x0 = o.x0 ?? -200, x1 = o.x1 ?? W + 200, hh = o.h ?? 260, R = H.rng(o.seed || 3), kind = o.kind || 'fiordo'; const pts = []; const n = 34;
  for (let i = 0; i <= n; i++) { const u = i / n, base = kind === 'baja' ? 0.25 + 0.12 * Math.sin(u * 7 + 1) : kind === 'volcanica' ? 0.45 + 0.35 * Math.sin(u * 3.2 + 0.5) : 0.5 + 0.4 * Math.sin(u * 5.3 + R() * 0.5); pts.push([lerp(x0, x1, u), y - hh * cl(base + R.range(-0.12, 0.12), 0.05, 1)]); }
  ctx.save(); ctx.fillStyle = o.c || (kind === 'volcanica' ? '#3f4844' : '#68736C'); ctx.beginPath(); ctx.moveTo(x0, y + 4); pts.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(x1, y + 4); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); const gg = ctx.createLinearGradient(0, y - hh, 0, y); gg.addColorStop(0, 'rgba(255,255,255,0.08)'); gg.addColorStop(1, 'rgba(0,0,0,0.25)'); ctx.fillStyle = gg; ctx.fillRect(x0, y - hh - 10, x1 - x0, hh + 20);
   if (o.green ?? (kind !== 'glaciar')) { ctx.fillStyle = 'rgba(73,102,75,0.85)'; ctx.beginPath(); ctx.moveTo(x0, y + 4); pts.forEach((p) => ctx.lineTo(p[0], lerp(p[1], y, 0.55))); ctx.lineTo(x1, y + 4); ctx.closePath(); ctx.fill(); }
   if (o.snow ?? (kind !== 'baja')) { ctx.fillStyle = kind === 'glaciar' ? 'rgba(201,229,237,0.95)' : 'rgba(236,244,246,0.85)'; pts.forEach((p, i) => { if (i === 0 || y - p[1] < hh * (kind === 'glaciar' ? 0.3 : 0.62)) return; const q = pts[i - 1]; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + 26, p[1] + hh * 0.12); ctx.lineTo(q[0] + 10, Math.max(p[1], q[1]) + hh * 0.06); ctx.closePath(); ctx.fill(); }); }
   if (kind === 'glaciar' && o.ice !== false) { ctx.fillStyle = 'rgba(201,229,237,0.75)'; ctx.fillRect(x0, y - hh * 0.95, x1 - x0, hh * 0.12); }
  ctx.restore();
  ctx.fillStyle = 'rgba(220,232,233,0.5)'; ctx.fillRect(x0, y - 1, x1 - x0, 3); ctx.restore();
 };
 P.iceberg = (ctx, x, y, s, t, o = {}) => { const R = H.rng(o.seed || 2), b = Math.sin(t * 0.8 + (o.seed || 0)) * s * 0.01; const top = [[-0.5, 0], [-0.38, -0.3], [-0.18, -0.42], [0.02, -0.7], [0.16, -0.5], [0.34, -0.46], [0.5, 0]].map(([u, v]) => [x + u * s + R.range(-2, 2), y + v * s + b]);
  ctx.save(); ctx.globalAlpha *= 0.25; ctx.fillStyle = '#7fb6c6'; ctx.beginPath(); ctx.ellipse(x, y + s * 0.25, s * 0.62, s * 0.3, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#C9E5ED'; ctx.beginPath(); top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(120,170,190,0.45)'; ctx.beginPath(); ctx.moveTo(top[3][0], top[3][1]); ctx.lineTo(top[4][0], top[4][1]); ctx.lineTo(top[5][0], top[5][1]); ctx.lineTo(top[6][0], top[6][1]); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(220,232,233,0.8)'; ctx.fillRect(x - s * 0.52, y - 2, s * 1.04, 4); };
 // Casa nórdica de césped y madera (L'Anse aux Meadows, Groenlandia). (x, y) = centro de la base.
 // o: { ruin (0 casa → 1 restos: montículos bajos de césped), smoke (t), door, glow }
 P.sodHouse = (ctx, x, y, w, h, t, o = {}) => {
  const ru = o.ruin || 0; ctx.save();
  if (ru < 1) { ctx.save(); ctx.globalAlpha *= 1 - ru;
   ctx.fillStyle = 'rgba(20,30,25,0.3)'; ctx.beginPath(); ctx.ellipse(x, y + 2, w * 0.56, h * 0.08, 0, 0, TAU); ctx.fill();
   // muros de turba (bloques en espiga) y techo redondeado cubierto de hierba
   ctx.fillStyle = '#6a5a3c'; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2 + w * 0.02, y - h * 0.42); ctx.lineTo(x + w / 2 - w * 0.02, y - h * 0.42); ctx.lineTo(x + w / 2, y); ctx.closePath(); ctx.fill();
   ctx.strokeStyle = 'rgba(40,30,18,0.5)'; ctx.lineWidth = 2; for (let r = 0; r < 4; r++) { const yy = y - h * 0.1 * (r + 0.5); for (let c = 0; c < 14; c++) { const xx = x - w / 2 + w * (c + 0.5) / 14; ctx.beginPath(); ctx.moveTo(xx - w * 0.025, yy + (r % 2 ? -1 : 1) * h * 0.035); ctx.lineTo(xx + w * 0.025, yy - (r % 2 ? -1 : 1) * h * 0.035); ctx.stroke(); } }
   const rg = ctx.createLinearGradient(0, y - h, 0, y - h * 0.4); rg.addColorStop(0, '#6f8f58'); rg.addColorStop(1, '#49664B'); ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(x - w * 0.53, y - h * 0.4); ctx.quadraticCurveTo(x - w * 0.45, y - h * 1.02, x, y - h); ctx.quadraticCurveTo(x + w * 0.45, y - h * 1.02, x + w * 0.53, y - h * 0.4); ctx.closePath(); ctx.fill();
   ctx.strokeStyle = 'rgba(150,180,110,0.6)'; ctx.lineWidth = 2; const Rg = H.rng(o.seed || 4); for (let i = 0; i < 40; i++) { const u = Rg.range(-0.48, 0.48), yy = y - h * (0.42 + (1 - Math.pow(Math.abs(u) / 0.53, 2)) * 0.55) + 3; ctx.beginPath(); ctx.moveTo(x + u * w, yy); ctx.lineTo(x + u * w + Rg.range(-4, 4), yy - Rg.range(5, 12)); ctx.stroke(); }
   // hastial de madera con puerta
   const dx = x + w * (o.doorX ?? 0.18); ctx.fillStyle = '#5D3D29'; ctx.fillRect(dx - w * 0.06, y - h * 0.38, w * 0.12, h * 0.38); ctx.fillStyle = '#2b1d13'; ctx.fillRect(dx - w * 0.035, y - h * 0.3, w * 0.07, h * 0.3); ctx.strokeStyle = 'rgba(164,119,79,0.6)'; ctx.lineWidth = 2; for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(dx - w * 0.06 + w * 0.04 * k, y - h * 0.38); ctx.lineTo(dx - w * 0.06 + w * 0.04 * k, y - h * 0.3); ctx.stroke(); }
   if (o.smoke != null) { for (let i = 0; i < 6; i++) { const u = ((t * 0.25 + i / 6) % 1); ctx.fillStyle = `rgba(220,226,228,${0.35 * (1 - u)})`; ctx.beginPath(); ctx.arc(x - w * 0.1 + Math.sin(u * 5 + i) * 10 + u * 40, y - h - u * h * 1.2, 8 + u * 22, 0, TAU); ctx.fill(); } }
   if (o.glow) { ctx.strokeStyle = `rgba(255,212,71,${o.glow})`; ctx.lineWidth = 4; ctx.strokeRect(x - w / 2 - 6, y - h - 6, w + 12, h + 10); }
   ctx.restore(); }
  if (ru > 0) { ctx.save(); ctx.globalAlpha *= ru; ctx.fillStyle = '#5f7d4c'; ctx.beginPath(); ctx.moveTo(x - w / 2 - 10, y); ctx.quadraticCurveTo(x - w / 2, y - h * 0.2, x - w / 2 + w * 0.08, y - h * 0.16); ctx.lineTo(x + w / 2 - w * 0.08, y - h * 0.16); ctx.quadraticCurveTo(x + w / 2, y - h * 0.2, x + w / 2 + 10, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#7d9a5f'; ctx.fillRect(x - w / 2 + w * 0.1, y - h * 0.1, w * 0.8, h * 0.1); ctx.strokeStyle = 'rgba(40,55,35,0.6)'; ctx.lineWidth = 3; ctx.strokeRect(x - w / 2 + w * 0.08, y - h * 0.16, w * 0.84, h * 0.16); ctx.beginPath(); ctx.moveTo(x - w * 0.1, y - h * 0.16); ctx.lineTo(x - w * 0.1, y); ctx.moveTo(x + w * 0.2, y - h * 0.16); ctx.lineTo(x + w * 0.2, y); ctx.stroke(); ctx.restore(); }
  ctx.restore();
 };
 // Corte de madera con anillos de crecimiento. o: { n, hi (índice del anillo destacado contando desde la corteza),
 // count (0..1: recuento de anillos del destacado a la corteza), cut (marca de herramienta de metal), seed, glowC }
 P.treeRings = (ctx, x, y, r, t, o = {}) => {
  const n = o.n || 40, R = H.rng(o.seed || 12), wob = []; for (let i = 0; i < 6; i++) wob.push([R.range(0, TAU), R.range(0.01, 0.03), 2 + Math.floor(R() * 4)]);
  const rr = (i, a) => { const base = r * 0.92 * (1 - Math.pow(1 - (n - i) / n, 1.05) * 0) * ((n - i) / n); let k = 1; for (const [p, amp, f] of wob) k += amp * Math.sin(a * f + p); return Math.max(2, base * k); };
  const shape = (i) => { ctx.beginPath(); for (let k = 0; k <= 72; k++) { const a = k / 72 * TAU, q = rr(i, a); ctx.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q * 0.96); } ctx.closePath(); };
  ctx.save(); shape(-3); ctx.fillStyle = '#4a3324'; ctx.fill(); shape(0); const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, '#d9b98a'); g.addColorStop(1, '#c49a68'); ctx.fillStyle = g; ctx.fill();
  for (let i = 1; i < n; i++) { shape(i); ctx.strokeStyle = `rgba(110,72,40,${0.35 + 0.25 * ((i * 7) % 3) / 2})`; ctx.lineWidth = 1.2 + ((i * 13) % 4) * 0.5; ctx.stroke(); }
  if (o.hi != null) { shape(o.hi); ctx.strokeStyle = o.glowC || 'rgba(255,212,71,0.95)'; ctx.lineWidth = 6; ctx.shadowColor = 'rgba(255,212,71,0.8)'; ctx.shadowBlur = 14; ctx.stroke(); ctx.shadowBlur = 0; }
  const cnt = o.count || 0; if (cnt > 0 && o.hi != null) { const a = -0.55, m = Math.floor(o.hi * cl(cnt)); ctx.fillStyle = '#ffffff'; for (let i = 0; i <= m; i++) { const q = rr(o.hi - i, a); ctx.beginPath(); ctx.arc(x + Math.cos(a) * q, y + Math.sin(a) * q * 0.96, 4, 0, TAU); ctx.fill(); } }
  if (o.cut) { ctx.strokeStyle = 'rgba(60,40,25,0.9)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + r * 0.55, y + r * 0.7); ctx.lineTo(x + r * 0.95, y + r * 0.2); ctx.stroke(); ctx.strokeStyle = 'rgba(255,240,210,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + r * 0.57, y + r * 0.66); ctx.lineTo(x + r * 0.93, y + r * 0.18); ctx.stroke(); }
  ctx.restore(); return { ringR: (i, a = -0.55) => rr(i, a), at: (i, a = -0.55) => [x + Math.cos(a) * rr(i, a), y + Math.sin(a) * rr(i, a) * 0.96] };
 };
 // Línea temporal cinematográfica. o: { from, to, step, p (0..1 dibujo), marks:[{v, label, sub, c, up}], span:[a, b, texto], spanP, px }
 P.timeline = (ctx, x0, x1, y, t, o = {}) => {
  const f = o.from ?? 900, to = o.to ?? 1600, map = (v) => lerp(x0, x1, (v - f) / (to - f)), p = o.p ?? 1, xe = lerp(x0, x1, p), px = o.px || 32;
  ctx.save(); ctx.strokeStyle = 'rgba(244,247,247,0.85)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xe, y); ctx.stroke();
  ctx.font = `700 ${px}px "IBM Plex Mono"`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(244,247,247,0.75)'; for (let v = Math.ceil(f / (o.step || 100)) * (o.step || 100); v <= to; v += o.step || 100) { const xx = map(v); if (xx > xe) break; ctx.fillRect(xx - 2, y - 14, 4, 28); if (!(o.marks || []).some((m) => Math.abs(map(m.v) - xx) < px * 2.2)) ctx.fillText(String(v), xx, y + 60); }
  if (o.span && (o.spanP ?? 0) > 0) { const a = map(o.span[0]), b = lerp(a, map(o.span[1]), cl(o.spanP)); ctx.save(); ctx.shadowColor = 'rgba(255,212,71,0.9)'; ctx.shadowBlur = 20; ctx.strokeStyle = '#FFD447'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(a, y); ctx.lineTo(b, y); ctx.stroke(); ctx.restore(); }
  for (const m of o.marks || []) { const xx = map(m.v); if (xx > xe + 1 || (m.a ?? 1) <= 0) continue; ctx.save(); ctx.globalAlpha *= m.a ?? 1; ctx.fillStyle = m.c || '#FFD447'; ctx.beginPath(); ctx.arc(xx, y, 18, 0, TAU); ctx.fill(); ctx.strokeStyle = '#0D1820'; ctx.lineWidth = 5; ctx.stroke();
   const up = m.up ?? true, ly = up ? y - 120 : y + 150; ctx.strokeStyle = m.c || '#FFD447'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xx, y + (up ? -20 : 20)); ctx.lineTo(xx, ly + (up ? 30 : -50)); ctx.stroke();
   ctx.font = `800 ${px}px Nunito`; const sw = m.sub ? ctx.measureText(m.sub).width : 0; ctx.font = `900 ${Math.round(px * 1.9)}px Nunito`; const hw = Math.max(sw, ctx.measureText(String(m.label)).width) / 2 + 24, tx = cl(xx, hw, W - hw); ctx.fillStyle = m.c || '#FFD447'; ctx.fillText(String(m.label), tx, ly); if (m.sub) { ctx.font = `800 ${px}px Nunito`; ctx.fillStyle = '#F4F7F7'; ctx.fillText(m.sub, tx, ly + px * 1.3); } ctx.restore(); }
  ctx.restore(); return map;
 };
 // Cielo nocturno con estrellas que titilan (determinista). o: { a, y0, y1, n, seed, band (vía láctea), mark:[x,y] }
 P.nightSky = (ctx, t, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; const y0 = o.y0 ?? -400, y1 = o.y1 ?? 900, R = H.rng(o.seed || 31); ctx.save(); ctx.globalAlpha *= a; const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#060d18'); g.addColorStop(1, '#1b3346'); ctx.fillStyle = g; ctx.fillRect(-600, y0, W + 1200, y1 - y0);
  if (o.band !== false) { ctx.save(); ctx.translate(540, (y0 + y1) / 2); ctx.rotate(-0.5); const bg = ctx.createLinearGradient(0, -120, 0, 120); bg.addColorStop(0, 'rgba(200,215,235,0)'); bg.addColorStop(0.5, 'rgba(200,215,235,0.12)'); bg.addColorStop(1, 'rgba(200,215,235,0)'); ctx.fillStyle = bg; ctx.fillRect(-1400, -120, 2800, 240); ctx.restore(); }
  for (let i = 0; i < (o.n || 260); i++) { const sx = R.range(-500, W + 500), sy = R.range(y0, y1), m = R(), tw = 0.6 + 0.4 * Math.sin(t * R.range(1, 4) + i); ctx.fillStyle = `rgba(240,246,255,${(0.35 + 0.65 * m) * tw})`; ctx.beginPath(); ctx.arc(sx, sy, 0.8 + m * m * 2.6, 0, TAU); ctx.fill(); }
  if (o.mark) { P.glow(ctx, o.mark[0], o.mark[1], 60, '255,240,200', 0.6); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(o.mark[0], o.mark[1], 5, 0, TAU); ctx.fill(); }
  ctx.restore(); };
 // Persona nórdica estilizada (túnica, capa, gorro; sin cascos con cuernos). pose: 'stand' | 'look' (mano a la frente) | 'row' | 'point' | 'walk'
 P.norse = (ctx, x, y, h, ph = 0, o = {}) => { const pose = o.pose || 'stand'; const hand = P.worker(ctx, x, y, h, ph, { pose: pose === 'row' ? 'pull' : pose === 'walk' ? 'walk' : 'stand', c: o.c || '#3a2c22', cloth: o.cloth || '#6b4a35' });
  const lean = pose === 'row' ? 0.42 : 0.05, hip = [x, y - h * 0.48], sh = [x + Math.sin(lean) * h * 0.32, hip[1] - Math.cos(lean) * h * 0.32], head = [sh[0] + Math.sin(lean) * h * 0.12, sh[1] - Math.cos(lean) * h * 0.12];
  ctx.save(); ctx.fillStyle = o.cloak || '#55606a'; ctx.beginPath(); ctx.moveTo(sh[0] - h * 0.06, sh[1] - h * 0.02); ctx.lineTo(sh[0] + h * 0.07, sh[1] - h * 0.02); ctx.lineTo(hip[0] + h * 0.1, hip[1] + h * 0.08); ctx.lineTo(hip[0] - h * 0.14, hip[1] + h * 0.1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = o.cap || '#4a3a2c'; ctx.beginPath(); ctx.arc(head[0], head[1] - h * 0.01, h * 0.08, Math.PI, TAU); ctx.fill();
  if (pose === 'look' || pose === 'point') { ctx.strokeStyle = o.c || '#3a2c22'; ctx.lineWidth = h * 0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); if (pose === 'look') { ctx.lineTo(sh[0] + h * 0.14, sh[1] - h * 0.05); ctx.lineTo(head[0] + h * 0.09, head[1] - h * 0.02); } else ctx.lineTo(sh[0] + h * 0.3, sh[1] - h * 0.2); ctx.stroke(); }
  ctx.restore(); return hand; };
 // ---- v1.13.1 · figuras y arquitectura nórdica más fieles ----
 // Navegante nórdico de espaldas en 3/4 mirando a la derecha (horizonte). (x, y) = pies; h = altura.
 // o: { look (0..1 mano a la frente), turn (−1..1 giro de cabeza), wind (0..1 capa al viento), rim (0..1 luz de contorno), tunic, cloak }
 P.navigator = (ctx, x, y, h, t, o = {}) => {
  const lk = E.inOut(cl(o.look ?? 1)), wd = o.wind ?? 0.6, rim = o.rim ?? 0.8, tn = o.turn || 0, U = h, sw = Math.sin(t * 2.1) * wd, sw2 = Math.sin(t * 3.3 + 1) * wd;
  const tun = o.tunic || '#6b4a35', clo = o.cloak || '#3f4a52', trou = '#463c33', wrap = '#7b6a55', boot = '#2b1f17', skin = '#c99c78', hair = '#6a4a32';
  const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(x + p[0] * U, y + p[1] * U) : ctx.moveTo(x + p[0] * U, y + p[1] * U))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
  const limb = (pts, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w * U; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(x + p[0] * U, y + p[1] * U) : ctx.moveTo(x + p[0] * U, y + p[1] * U))); ctx.stroke(); };
  ctx.save();
  ctx.fillStyle = 'rgba(10,8,6,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 0.005 * U, 0.2 * U, 0.025 * U, 0, 0, TAU); ctx.fill();
  // capa (parte trasera, al viento)
  poly([[-0.13, -0.8], [-0.2 - 0.03 * sw, -0.62], [-0.27 - 0.06 * sw, -0.4], [-0.24 - 0.05 * sw2, -0.33], [-0.12, -0.36], [0.02, -0.4], [0.06, -0.78]], clo);
  // piernas: pantalón, vendas de lana (polainas) y botas
  limb([[-0.06, -0.5], [-0.075, -0.28], [-0.08, -0.05]], 0.075, trou); limb([[0.05, -0.5], [0.07, -0.28], [0.065, -0.05]], 0.08, trou);
  ctx.strokeStyle = wrap; ctx.lineWidth = 0.008 * U; for (const lx of [-0.078, 0.067]) for (let k = 0; k < 6; k++) { const yy = -0.24 + k * 0.032; ctx.beginPath(); ctx.moveTo(x + (lx - 0.035) * U, y + (yy + 0.012) * U); ctx.lineTo(x + (lx + 0.035) * U, y + yy * U); ctx.stroke(); }
  poly([[-0.12, -0.06], [-0.04, -0.06], [-0.03, 0], [-0.13, 0]], boot); poly([[0.03, -0.06], [0.11, -0.06], [0.14, 0], [0.03, 0]], boot);
  // túnica hasta la rodilla con cinturón
  const tg = ctx.createLinearGradient(x - 0.18 * U, 0, x + 0.18 * U, 0); tg.addColorStop(0, '#3e2a1d'); tg.addColorStop(0.6, tun); tg.addColorStop(1, '#8a6446'); poly([[-0.13, -0.8], [0.12, -0.8], [0.15, -0.6], [0.18, -0.37], [0.04, -0.35], [-0.17, -0.37], [-0.15, -0.6]], tg);
  ctx.strokeStyle = 'rgba(30,18,10,0.35)'; ctx.lineWidth = 0.006 * U; for (const fx of [-0.08, 0.0, 0.09]) { ctx.beginPath(); ctx.moveTo(x + fx * U, y - 0.53 * U); ctx.lineTo(x + (fx * 1.3) * U, y - 0.37 * U); ctx.stroke(); }
  poly([[-0.155, -0.56], [0.155, -0.56], [0.158, -0.525], [-0.158, -0.525]], '#2b1d13'); poly([[0.06, -0.565], [0.1, -0.565], [0.1, -0.52], [0.06, -0.52]], '#b08a3e');
  // brazo izquierdo (lejano) relajado
  limb([[-0.12, -0.77], [-0.16, -0.62], [-0.13, -0.49]], 0.06, '#5a3e2b'); ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(x - 0.13 * U, y - 0.475 * U, 0.025 * U, 0, TAU); ctx.fill();
  // capa sobre los hombros y broche
  poly([[-0.15, -0.81], [0.13, -0.82], [0.15, -0.74], [0.05, -0.7], [-0.16, -0.66]], clo); ctx.fillStyle = '#c9a24a'; ctx.beginPath(); ctx.arc(x + 0.11 * U, y - 0.77 * U, 0.018 * U, 0, TAU); ctx.fill(); ctx.strokeStyle = '#7a5a20'; ctx.lineWidth = 0.004 * U; ctx.stroke();
  // cabeza: cuello, nuca, oreja, mejilla y barba hacia la derecha; gorro de lana
  const hx = 0.01 + 0.015 * tn, hy = -0.905; poly([[-0.03, -0.83], [0.04, -0.83], [0.035, -0.87], [-0.025, -0.87]], '#a87e5e');
  ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(x + hx * U, y + hy * U, 0.058 * U, 0.068 * U, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(x + (hx + 0.03) * U, y + (hy + 0.01) * U, 0.03 * U, 0.05 * U, 0.1, -Math.PI / 2, Math.PI / 2); ctx.fill();
  ctx.fillStyle = '#b5876a'; ctx.beginPath(); ctx.ellipse(x + (hx + 0.012) * U, y + (hy + 0.005) * U, 0.012 * U, 0.02 * U, 0, 0, TAU); ctx.fill();
  poly([[hx + 0.02, hy + 0.03], [hx + 0.07, hy + 0.025], [hx + 0.06, hy + 0.08], [hx + 0.02, hy + 0.07]], '#7a5536');
  ctx.fillStyle = '#5a4030'; ctx.beginPath(); ctx.ellipse(x + hx * U, y + (hy - 0.03) * U, 0.064 * U, 0.05 * U, 0, Math.PI, TAU); ctx.fill(); ctx.fillRect(x + (hx - 0.064) * U, y + (hy - 0.035) * U, 0.128 * U, 0.018 * U);
  // brazo derecho: de colgar a la mano sobre la frente (protege los ojos del sol)
  const el = [lerp(0.15, 0.22, lk), lerp(-0.62, -0.83, lk)], hd = [lerp(0.13, hx + 0.07, lk), lerp(-0.49, hy - 0.025, lk)];
  limb([[0.12, -0.77], el, hd], 0.058, '#5a3e2b'); ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(x + hd[0] * U, y + hd[1] * U, 0.035 * U, 0.017 * U, -0.25 * lk, 0, TAU); ctx.fill();
  // luz de contorno (sol a la derecha)
  if (rim > 0) { ctx.strokeStyle = `rgba(255,214,150,${0.55 * rim})`; ctx.lineWidth = 0.008 * U; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + 0.13 * U, y - 0.8 * U); ctx.lineTo(x + 0.155 * U, y - 0.6 * U); ctx.lineTo(x + 0.18 * U, y - 0.38 * U); ctx.moveTo(x + (hx + 0.058) * U, y + (hy - 0.03) * U); ctx.lineTo(x + (hx + 0.06) * U, y + (hy + 0.03) * U); ctx.stroke(); }
  ctx.restore(); return { eye: [x + (hx + 0.06) * U, y + (hy - 0.005) * U], hand: [x + hd[0] * U, y + hd[1] * U] };
 };
 // Casa larga nórdica de madera y turba en vista 3/4. (x, y) = centro de la base del muro largo delantero (apoya en el suelo).
 // w = largo, d = fondo, h = alto del muro, o: { roof (alto del tejado), ruin (0 → 1 restos excavados), smoke (t), door (0..1 posición), seed, glow }
 P.longhouse = (ctx, x, y, w, d, h, t, o = {}) => {
  const rh = o.roof ?? h * 0.95, dx = d * 0.62, dy = -d * 0.34, ru = cl(o.ruin || 0), R = H.rng(o.seed || 3);
  const A = [x - w / 2, y], B = [x + w / 2, y], Cb = [x + w / 2 + dx, y + dy], Db = [x - w / 2 + dx, y + dy];
  const pg = (pts, f) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = f; ctx.fill(); };
  ctx.save();
  // sombra de contacto sobre el terreno
  ctx.fillStyle = 'rgba(20,30,18,0.35)'; pg([[A[0] - 8, A[1] + 4], [B[0] + 14, B[1] + 6], [Cb[0] + 22, Cb[1] + 4], [Db[0], Db[1]]], 'rgba(20,30,18,0.35)');
  if (ru < 1) { ctx.save(); ctx.globalAlpha *= 1 - ru;
   const turf = (pts, base, dark) => { pg(pts, base); ctx.save(); ctx.clip(); ctx.strokeStyle = dark; ctx.lineWidth = 2; const ys = Math.min(...pts.map((p) => p[1])), ye = Math.max(...pts.map((p) => p[1])), xs = Math.min(...pts.map((p) => p[0])), xe = Math.max(...pts.map((p) => p[0])); for (let yy = ys + 10, r = 0; yy < ye; yy += 16, r++) { for (let xx = xs + (r % 2) * 14; xx < xe; xx += 28) { ctx.beginPath(); ctx.moveTo(xx, yy + (r % 2 ? 7 : -7)); ctx.lineTo(xx + 14, yy - (r % 2 ? 7 : -7)); ctx.stroke(); } } ctx.restore(); };
   // muro del hastial (derecha), muro largo delantero
   turf([B, Cb, [Cb[0], Cb[1] - h], [B[0], B[1] - h]], '#5d4c33', 'rgba(35,25,14,0.45)');
   turf([A, B, [B[0], B[1] - h], [A[0], A[1] - h]], '#6e5a3c', 'rgba(35,25,14,0.5)');
   const sg = ctx.createLinearGradient(0, y - h, 0, y); sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(20,14,8,0.35)'); pg([A, B, [B[0], B[1] - h], [A[0], A[1] - h]], sg);
   // tejado de turba con hierba: faldón delantero y extremo redondeado
   const ridgeL = [A[0] + dx * 0.5, A[1] + dy * 0.5 - h - rh], ridgeR = [B[0] + dx * 0.5, B[1] + dy * 0.5 - h - rh];
   const rg = ctx.createLinearGradient(0, ridgeL[1], 0, y - h); rg.addColorStop(0, '#7f9d5f'); rg.addColorStop(1, '#4d6a42');
   ctx.beginPath(); ctx.moveTo(A[0] - 10, A[1] - h + 6); ctx.quadraticCurveTo(A[0] - 6, ridgeL[1] + rh * 0.3, ridgeL[0], ridgeL[1]); ctx.lineTo(ridgeR[0], ridgeR[1]); ctx.quadraticCurveTo(B[0] + dx * 0.95 + 8, ridgeR[1] + rh * 0.35, Cb[0] + 10, Cb[1] - h + 4); ctx.lineTo(B[0] + 10, B[1] - h + 6); ctx.closePath(); ctx.fillStyle = rg; ctx.fill();
   ctx.fillStyle = 'rgba(40,58,34,0.45)'; pg([[B[0] + 10, B[1] - h + 6], [ridgeR[0], ridgeR[1]], [ridgeR[0] + 6, ridgeR[1] + 8], [Cb[0] + 10, Cb[1] - h + 4]], 'rgba(40,58,34,0.45)');
   ctx.strokeStyle = 'rgba(160,190,110,0.65)'; ctx.lineWidth = 2; for (let i = 0; i < Math.round(w / 6); i++) { const u = R(), v = R(), px = lerp(lerp(A[0], ridgeL[0], v), lerp(B[0], ridgeR[0], v), u), py = lerp(lerp(A[1] - h, ridgeL[1], v), lerp(B[1] - h, ridgeR[1], v), u); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + R.range(-4, 4), py - R.range(5, 11)); ctx.stroke(); }
   ctx.strokeStyle = 'rgba(40,55,30,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(A[0] - 10, A[1] - h + 6); ctx.lineTo(B[0] + 10, B[1] - h + 6); ctx.stroke();
   // puerta con marco de madera en el muro largo
   const dxp = lerp(A[0] + w * 0.15, B[0] - w * 0.15, o.door ?? 0.35), dw = Math.max(18, w * 0.09), dh = h * 0.82;
   ctx.fillStyle = '#4a2f1f'; ctx.fillRect(dxp - dw * 0.62, y - dh - h * 0.08, dw * 1.24, dh + h * 0.08); ctx.fillStyle = '#1e140d'; ctx.fillRect(dxp - dw / 2, y - dh, dw, dh); ctx.fillStyle = '#6b4a30'; ctx.fillRect(dxp - dw / 2, y - dh, dw * 0.45, dh); ctx.strokeStyle = 'rgba(30,18,10,0.6)'; ctx.lineWidth = 1.5; for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(dxp - dw / 2 + dw * 0.15 * k, y - dh); ctx.lineTo(dxp - dw / 2 + dw * 0.15 * k, y); ctx.stroke(); }
   ctx.fillStyle = '#7a5a3a'; ctx.fillRect(dxp - dw * 0.7, y - 4, dw * 1.4, 6);
   if (o.smoke != null) { for (let i = 0; i < 6; i++) { const u = (t * 0.22 + i / 6) % 1, sx = lerp(ridgeL[0], ridgeR[0], 0.4); ctx.fillStyle = `rgba(225,230,232,${0.32 * (1 - u)})`; ctx.beginPath(); ctx.arc(sx + Math.sin(u * 5 + i) * 10 + u * 50, ridgeL[1] - 6 - u * h * 1.6, 7 + u * 24, 0, TAU); ctx.fill(); } }
   if (o.glow) { ctx.strokeStyle = `rgba(255,212,71,${o.glow})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(A[0] - 12, A[1] + 6); ctx.lineTo(B[0] + 12, B[1] + 6); ctx.lineTo(Cb[0] + 14, Cb[1]); ctx.stroke(); }
   ctx.restore(); }
  if (ru > 0) { ctx.save(); ctx.globalAlpha *= ru; // restos excavados: crestas bajas de turba que marcan los muros
   const k = 0.14, rid = (p, q) => { ctx.strokeStyle = '#4f6b3f'; ctx.lineWidth = Math.max(10, d * 0.16); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.strokeStyle = 'rgba(150,180,105,0.8)'; ctx.lineWidth = Math.max(4, d * 0.05); ctx.beginPath(); ctx.moveTo(p[0], p[1] - d * 0.05); ctx.lineTo(q[0], q[1] - d * 0.05); ctx.stroke(); };
   pg([A, B, Cb, Db], 'rgba(95,125,76,0.85)'); rid(Db, Cb); rid(A, Db); rid(B, Cb); rid(A, [lerp(A[0], B[0], 0.3), A[1]]); rid([lerp(A[0], B[0], 0.42), A[1]], B); rid([lerp(A[0], B[0], 0.55), lerp(A[1], Cb[1], 0.0)], [lerp(Db[0], Cb[0], 0.55), Db[1]]);
   if (o.glow) { ctx.strokeStyle = `rgba(255,212,71,${o.glow})`; ctx.lineWidth = 4; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(Cb[0], Cb[1]); ctx.lineTo(Db[0], Db[1]); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]); }
   ctx.restore(); }
  ctx.restore(); return { door: [lerp(A[0] + w * 0.15, B[0] - w * 0.15, o.door ?? 0.35), y], top: [x + dx * 0.5, y + dy * 0.5 - h - rh], A, B, Cb, Db };
 };
 // Pieza de madera arqueológica (listón trabajado con borde de corteza y marcas de corte). o: { glowEnd, cuts }
 P.timber = (ctx, x, y, w, h, t, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.12);
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#9c7650'); g.addColorStop(0.5, '#7d5a3b'); g.addColorStop(1, '#4e3523'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-w / 2, -h * 0.45); ctx.lineTo(w / 2 - h * 0.2, -h / 2); ctx.lineTo(w / 2, h * 0.1); ctx.lineTo(w / 2 - h * 0.1, h / 2); ctx.lineTo(-w / 2 + h * 0.05, h * 0.48); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(45,28,15,0.4)'; ctx.lineWidth = 2; const R = H.rng(9); for (let i = 0; i < 9; i++) { const yy = -h * 0.4 + i * h * 0.1; ctx.beginPath(); ctx.moveTo(-w / 2 + 6, yy); for (let xx = -w / 2; xx < w / 2 - h * 0.2; xx += 30) ctx.lineTo(xx, yy + Math.sin(xx * 0.02 + i) * 3); ctx.stroke(); }
  ctx.fillStyle = '#3d2a1c'; ctx.fillRect(-w / 2, -h * 0.47, w * 0.85, h * 0.07); // borde de corteza (último anillo)
  ctx.strokeStyle = 'rgba(240,220,190,0.8)'; ctx.lineWidth = 3; for (const cx of o.cuts || [0.25, 0.32, 0.6]) { ctx.beginPath(); ctx.moveTo(-w / 2 + w * cx, -h * 0.3); ctx.lineTo(-w / 2 + w * cx + h * 0.25, h * 0.35); ctx.stroke(); }
  ctx.fillStyle = '#c49a68'; ctx.beginPath(); ctx.ellipse(-w / 2, 0, h * 0.18, h * 0.47, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(110,72,40,0.7)'; ctx.lineWidth = 1.5; for (let k = 1; k < 7; k++) { ctx.beginPath(); ctx.ellipse(-w / 2 + k * 0.6, h * 0.05, h * 0.18 * (1 - k / 8), h * 0.47 * (1 - k / 8), 0, 0, TAU); ctx.stroke(); }
  if (o.glowEnd) { ctx.strokeStyle = `rgba(255,212,71,${o.glowEnd})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(-w / 2, 0, h * 0.22, h * 0.52, 0, 0, TAU); ctx.stroke(); }
  ctx.restore(); return { end: [x - Math.cos(o.rot ?? -0.12) * w / 2, y - Math.sin(o.rot ?? -0.12) * w / 2] }; };
 // ================= v1.14 · MURALLAS, TIERRA APISONADA Y LOGÍSTICA (episodio «Gran Muralla») =================
 const sn = (x, s) => Math.sin(x * 0.0071 + s) * 0.5 + Math.sin(x * 0.0173 + s * 1.7) * 0.3 + Math.sin(x * 0.041 + s * 2.3) * 0.2;
 // Cordilleras por capas con crestas rocosas. o: { hor, sky:[arriba, horizonte], sun, sunA, layers, seed, arid (0..1), fogA, x0, x1, front:{y, amp},
 // part: 'back' (cielo y capas lejanas) | 'front' (solo la capa delantera) para dibujarlas con cámaras distintas (paralaje) }
 // Devuelve { ridge(x) } = altura (y) de la cresta delantera, para apoyar la muralla.
 // capa L de una cordillera: misma función para dibujar y para consultar la cresta (rugged 0..1: crestas rocosas y picos más marcados)
 const rangeLayer = (o, L) => { const hor = o.hor ?? 900, ar = o.arid || 0, seed = o.seed ?? 3, nL = o.layers ?? 5, fr = o.front || {}, rg = o.rugged || 0; const u = L / (nL - 1), base = lerp(hor - 60, fr.y ?? hor + 380, u), amp = lerp(140, fr.amp ?? 420, u) * (1 - ar * 0.35), s = seed + L * 3.1, sc = lerp(0.6, 1.25, u);
  const yAt = (x) => base - amp * (0.55 + 0.45 * sn(x / sc, s)) + amp * 0.18 * Math.abs(Math.sin(x * 0.011 / sc + s)) - rg * (amp * 0.2 * Math.pow(1 - Math.abs(Math.sin(x * 0.0042 / sc + s * 0.7)), 4) - (3 * Math.sin(x * 0.071 + s) + 1.6 * Math.sin(x * 0.19 + s * 2.1) + 0.8 * Math.sin(x * 0.43 + s)) * (0.4 + 0.6 * u));
  return { u, base, amp, yAt }; };
 P.rangeRidge = (o) => rangeLayer(o, (o.layers ?? 5) - 1).yAt;
 P.ranges = (ctx, t, o = {}) => {
  const hor = o.hor ?? 900, x0 = o.x0 ?? -800, x1 = o.x1 ?? W + 800, ar = o.arid || 0, seed = o.seed ?? 3, nL = o.layers ?? 5;
  const part = o.part; if (part !== 'front') { const sky = o.sky || ['#6f97ad', '#d7d6c4']; const g = ctx.createLinearGradient(0, hor - 1500, 0, hor); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); ctx.fillStyle = g; ctx.fillRect(x0, hor - 3000, x1 - x0, 3000 + 2400);
  if (o.sun) { P.glow(ctx, o.sun[0], o.sun[1], 520, '255,226,180', 0.5 * (o.sunA ?? 1)); P.glow(ctx, o.sun[0], o.sun[1], 110, '255,244,220', 0.95 * (o.sunA ?? 1)); } }
  const mix = (a, b, u) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), c = (s) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, u)); return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1); };
  const far = mix(o.farC || '#8fa6a8', '#c9b48e', ar), near = mix(o.nearC || '#425A39', '#8a6a45', ar), fr = o.front || {};
  let ridge = null;
  for (let L = 0; L < nL; L++) { const { u, base, amp, yAt } = rangeLayer(o, L), s = seed + L * 3.1;
   if ((part === 'back' && L === nL - 1) || (part === 'front' && L < nL - 1)) { if (L === nL - 1) ridge = yAt; continue; }
   ctx.beginPath(); ctx.moveTo(x0, HH + 1600); for (let x = x0; x <= x1; x += 12) ctx.lineTo(x, yAt(x)); ctx.lineTo(x1, HH + 1600); ctx.closePath();
   const lg = ctx.createLinearGradient(0, base - amp, 0, base + 400); lg.addColorStop(0, mix(far, near, u * 0.9 + 0.05)); lg.addColorStop(1, mix(far, near, Math.min(1, u * 1.1 + 0.2))); ctx.fillStyle = lg; ctx.fill();
   // luz en las laderas que miran al sol y vetas de roca
   ctx.save(); ctx.clip(); { const sunR = !(o.sun && o.sun[0] < 540); for (let x = x0 + 30; x <= x1 - 30; x += 18) { const y = yAt(x); if (!(y < yAt(x - 30) && y <= yAt(x + 30))) continue; const len = (base + 420 - y) * (0.8 + 0.4 * u), sp = 90 * (0.5 + u);
     const lit = ctx.createLinearGradient(x, y, x + (sunR ? sp : -sp), y + len); lit.addColorStop(0, `rgba(255,236,200,${0.1 + 0.06 * u})`); lit.addColorStop(1, 'rgba(255,236,200,0)'); ctx.fillStyle = lit; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (sunR ? sp * 1.4 : -sp * 1.4), y + len); ctx.lineTo(x + (sunR ? sp * 0.2 : -sp * 0.2), y + len); ctx.closePath(); ctx.fill();
     const dk = ctx.createLinearGradient(x, y, x - (sunR ? sp : -sp), y + len); dk.addColorStop(0, `rgba(20,30,20,${0.12 + 0.06 * u})`); dk.addColorStop(1, 'rgba(20,30,20,0)'); ctx.fillStyle = dk; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (sunR ? sp * 0.2 : -sp * 0.2), y + len); ctx.lineTo(x - (sunR ? sp * 1.2 : -sp * 1.2), y + len); ctx.closePath(); ctx.fill(); } }
   ctx.strokeStyle = `rgba(255,240,215,${0.15 + 0.2 * u})`; ctx.lineWidth = 1.5 + 2 * u; ctx.beginPath(); for (let x = x0; x <= x1; x += 12) (x === x0 ? ctx.moveTo(x, yAt(x) + 2) : ctx.lineTo(x, yAt(x) + 2)); ctx.stroke();
   if (u > 0.5) { const R = H.rng(seed + L); ctx.fillStyle = ar > 0.5 ? 'rgba(120,90,60,0.5)' : 'rgba(40,60,36,0.6)'; for (let i = 0; i < 160 * u; i++) { const x = R.range(x0, x1), y = yAt(x) + R.range(10, 600); ctx.beginPath(); ctx.arc(x, y, R.range(3, 9) * u, 0, TAU); ctx.fill(); } }
   ctx.restore();
   if (L < nL - 1 && (o.fogA ?? 0.6) > 0) { const fg = ctx.createLinearGradient(0, base - amp * 0.2, 0, base + 160); fg.addColorStop(0, 'rgba(216,217,201,0)'); fg.addColorStop(1, `rgba(216,217,201,${0.55 * (o.fogA ?? 0.6)})`); ctx.fillStyle = fg; ctx.fillRect(x0, base - amp * 0.2, x1 - x0, 400); }
   if (L === nL - 1) ridge = yAt; }
  return { ridge };
 };
 // ================= v1.14.1 · revisión maestra «Gran Muralla»: figuras, muralla con volumen, torres y cortes =================
 // IK de dos segmentos: devuelve el codo/rodilla entre a (origen) y t (objetivo) con longitudes l1, l2; side = ±1 elige el lado del pliegue
 const ik2 = (a, t, l1, l2, side) => { let dx = t[0] - a[0], dy = t[1] - a[1], d = Math.hypot(dx, dy); const dm = Math.min(Math.max(d, 1e-3), l1 + l2 - 1e-3); if (d > dm) { t = [a[0] + dx / d * dm, a[1] + dy / d * dm]; dx = t[0] - a[0]; dy = t[1] - a[1]; d = dm; } const ca = cl((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1), ang = Math.atan2(dy, dx) + side * Math.acos(ca); return [[a[0] + Math.cos(ang) * l1, a[1] + Math.sin(ang) * l1], t]; };
 const FIG_TUNIC = ['#6b5a46', '#4f5d58', '#7a5a3a', '#5b4a5e', '#857055', '#3f4d5a', '#6e4b3a', '#55603f'], FIG_SKIN = ['#b98a62', '#a87a55', '#c49a72', '#9c6f4c'];
 // Persona estilizada con proporciones (cabeza, torso, brazos y piernas articulados), ropa de trabajo (túnica cruzada con faja,
 // pantalón, calzado de tela) y sombrero o pañuelo variados. (x, y) = suelo bajo los pies: la figura se ajusta para que el pie más bajo
 // toque y. pose: 'walk' | 'stand' | 'carry' (pértiga al hombro) | 'ram' (pisón con las dos manos; o.lift 0..1) | 'chisel' | 'look' | 'lead'.
 // ph = fase de la marcha (usar distancia recorrida / zancada para que no patine). o: { var, dir, lift, target, scale }
 P.figure = (ctx, x, y, h, ph = 0, o = {}) => {
  const pose = o.pose || 'walk', v = o.var ?? 0, d = o.dir ?? 1, LT = h * 0.245, LS = h * 0.24, LU = h * 0.17, LF = h * 0.165, f = ph * TAU, lift = cl(o.lift ?? 0);
  const tun = FIG_TUNIC[v % FIG_TUNIC.length], tunD = '#2f2a24', trou = ['#3d3a35', '#4a4136', '#2f3538'][v % 3], sash = ['#a4473a', '#2f4a5e', '#8a7a4a', '#5a3d5a'][v % 4], skin = FIG_SKIN[v % FIG_SKIN.length];
  // piernas (ángulos desde la vertical; la rodilla se dobla hacia atrás)
  let legs; if (pose === 'walk' || pose === 'carry' || pose === 'lead') legs = [0, Math.PI].map((o2) => { const a = Math.sin(f + o2) * 0.42; return [a, 0.1 + 0.55 * Math.max(0, Math.sin(f + o2 + 1.9))]; });
  else if (pose === 'ram') legs = [[0.16, 0.12 + 0.12 * (1 - lift)], [-0.12, 0.12 + 0.12 * (1 - lift)]]; else if (pose === 'chisel') legs = [[0.3, 0.9], [-0.25, 0.25]]; else legs = [[0.05, 0.03], [-0.05, 0.03]];
  const hip0 = [0, 0], knees = [], ankles = [], toes = []; legs.forEach(([a, k]) => { const kn = [Math.sin(a) * LT, Math.cos(a) * LT], an = [kn[0] + Math.sin(a - k) * LS, kn[1] + Math.cos(a - k) * LS]; knees.push(kn); ankles.push(an); toes.push([an[0] + h * 0.07, an[1] + h * 0.012]); });
  const low = Math.max(ankles[0][1], ankles[1][1]) + h * 0.03, P_ = (p) => [x + d * p[0], y - low + p[1]]; // pie más bajo en el suelo
  const lean = pose === 'carry' ? 0.07 : pose === 'ram' ? 0.12 + 0.12 * (1 - lift) : pose === 'chisel' ? 0.55 : pose === 'walk' ? 0.05 : 0.02;
  const S = [Math.sin(lean) * h * 0.3, -Math.cos(lean) * h * 0.3], Hd = [S[0] + Math.sin(lean) * h * 0.11, S[1] - Math.cos(lean) * h * 0.115];
  // objetivos de las manos
  let tf, tb; if (pose === 'walk' || pose === 'lead') { tf = [S[0] + Math.sin(-f) * h * 0.13, S[1] + h * 0.29]; tb = [S[0] + Math.sin(-f + Math.PI) * h * 0.13, S[1] + h * 0.29]; if (pose === 'lead') tf = [S[0] + h * 0.28, S[1] + h * 0.12]; }
  else if (pose === 'carry') { tf = [S[0] + h * 0.15, S[1] + h * 0.02]; tb = [S[0] + Math.sin(-f + Math.PI) * h * 0.12, S[1] + h * 0.28]; }
  else if (pose === 'ram') { const px = h * 0.22, pb = low - lift * h * 0.24; tf = [px, pb - h * 0.5]; tb = [px, pb - h * 0.68]; }
  else if (pose === 'chisel') { tf = o.target ? [(o.target[0] - x) * d, o.target[1] - y + low] : [S[0] + h * 0.3, S[1] + h * 0.42]; tb = [S[0] + h * 0.18, S[1] + h * (0.12 + 0.14 * Math.abs(Math.sin(f * 2)))]; }
  else if (pose === 'look') { tf = [Hd[0] + h * 0.07, Hd[1] - h * 0.02]; tb = [S[0] - h * 0.02, S[1] + h * 0.3]; } else { tf = [S[0] + h * 0.03, S[1] + h * 0.31]; tb = [S[0] - h * 0.03, S[1] + h * 0.31]; }
  const [ef, hf] = ik2(S, tf, LU, LF, d > 0 ? 1 : 1), [eb, hb] = ik2(S, tb, LU, LF, 1);
  const L = (pts, w, c) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => { const q = P_(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); };
  ctx.save();
  const g0 = P_([0, low]); ctx.fillStyle = 'rgba(20,18,14,0.3)'; ctx.beginPath(); ctx.ellipse(g0[0], y + 2, h * 0.16, h * 0.025, 0, 0, TAU); ctx.fill(); // sombra de contacto
  // pierna y brazo traseros (más oscuros)
  L([hip0, knees[1], ankles[1]], h * 0.075, '#262320'); L([ankles[1], toes[1]], h * 0.05, '#1f1b17');
  L([S, eb, hb], h * 0.062, '#3a3229'); { const q = P_(hb); ctx.fillStyle = '#8a6a50'; ctx.beginPath(); ctx.arc(q[0], q[1], h * 0.026, 0, TAU); ctx.fill(); }
  // pierna delantera (pantalón y calzado)
  L([hip0, knees[0], ankles[0]], h * 0.08, trou); L([ankles[0], toes[0]], h * 0.055, '#241f1a');
  // túnica cruzada hasta medio muslo con faja
  const tp = [[S[0] - h * 0.075, S[1] + h * 0.01], [S[0] + h * 0.07, S[1] + h * 0.01], [h * 0.1, h * 0.03], [h * 0.12, h * 0.16], [-h * 0.11, h * 0.16], [-h * 0.085, h * 0.02]];
  ctx.fillStyle = tun; ctx.beginPath(); tp.forEach((p, i) => { const q = P_(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.closePath(); ctx.fill();
  { const a = P_([S[0] + h * 0.05, S[1] + h * 0.02]), b = P_([h * 0.02, -h * 0.02]); ctx.strokeStyle = tunD; ctx.lineWidth = h * 0.012; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  { const a = P_([-h * 0.095, -h * 0.01]), b = P_([h * 0.105, -h * 0.01]); ctx.strokeStyle = sash; ctx.lineWidth = h * 0.035; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  // cuello, cabeza (perfil con nariz) y cabello
  L([[S[0], S[1] + h * 0.01], [lerp(S[0], Hd[0], 0.6), lerp(S[1], Hd[1], 0.6)]], h * 0.045, skin);
  const hq = P_(Hd), hr = h * 0.066; ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(hq[0], hq[1], hr, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(hq[0] + d * hr * 0.9, hq[1] - hr * 0.1); ctx.lineTo(hq[0] + d * hr * 1.22, hq[1] + hr * 0.18); ctx.lineTo(hq[0] + d * hr * 0.85, hq[1] + hr * 0.3); ctx.fill();
  ctx.fillStyle = '#1f1a16'; ctx.beginPath(); ctx.arc(hq[0] - d * hr * 0.15, hq[1] - hr * 0.15, hr * 0.95, Math.PI * (d > 0 ? 0.55 : -0.55) + Math.PI, Math.PI * (d > 0 ? 1.95 : 0.05) + Math.PI * (d > 0 ? 0 : 1)); ctx.fill();
  const hat = v % 4; if (hat === 0) { ctx.fillStyle = '#c9b07a'; ctx.beginPath(); ctx.moveTo(hq[0] - hr * 2.1, hq[1] - hr * 0.35); ctx.lineTo(hq[0], hq[1] - hr * 1.55); ctx.lineTo(hq[0] + hr * 2.1, hq[1] - hr * 0.35); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(90,70,40,0.6)'; ctx.lineWidth = 1.2; ctx.stroke(); }
  else if (hat === 1) { ctx.fillStyle = ['#d8cfb8', '#5a4a3a', '#7a8a8a'][v % 3]; ctx.beginPath(); ctx.ellipse(hq[0] - d * hr * 0.1, hq[1] - hr * 0.55, hr * 1.02, hr * 0.55, 0, Math.PI, TAU); ctx.fill(); ctx.fillRect(hq[0] - hr, hq[1] - hr * 0.62, hr * 2, hr * 0.3); }
  else if (hat === 2) { ctx.fillStyle = '#1f1a16'; ctx.beginPath(); ctx.arc(hq[0] - d * hr * 0.1, hq[1] - hr * 1.05, hr * 0.38, 0, TAU); ctx.fill(); }
  else { ctx.fillStyle = '#3d3a35'; ctx.beginPath(); ctx.ellipse(hq[0] - d * hr * 0.05, hq[1] - hr * 0.6, hr * 0.9, hr * 0.45, 0, Math.PI, TAU); ctx.fill(); }
  // brazo delantero (manga) y mano
  L([S, ef, hf], h * 0.065, tun); { const q = P_(hf); ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(q[0], q[1], h * 0.028, 0, TAU); ctx.fill(); }
  ctx.restore();
  return { hf: P_(hf), hb: P_(hb), head: hq, sh: P_(S), feet: [P_(ankles[0]), P_(ankles[1])], low };
 };
 // laborer y porter (v1.14) pasan a usar la figura proporcionada (misma firma)
 P.laborer = (ctx, x, y, h, ph, o = {}) => { const pm = { walk: 'walk', chisel: 'chisel', stand: 'stand', pull: 'lead', look: 'look' }; const r = P.figure(ctx, x, y, h, ph, { pose: pm[o.pose || 'walk'] || 'walk', var: o.var, dir: o.dir, target: o.target });
  if ((o.pose || 'walk') === 'chisel') { ctx.save(); ctx.strokeStyle = '#4a3a2a'; ctx.lineWidth = h * 0.02; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(r.hb[0], r.hb[1]); ctx.lineTo(r.hb[0] + (o.dir ?? 1) * h * 0.04, r.hb[1] - h * 0.1); ctx.stroke(); ctx.fillStyle = '#5b5b58'; ctx.fillRect(r.hb[0] + (o.dir ?? 1) * h * 0.02 - h * 0.035, r.hb[1] - h * 0.13, h * 0.07, h * 0.04); ctx.strokeStyle = '#8a8f8a'; ctx.lineWidth = h * 0.015; ctx.beginPath(); ctx.moveTo(r.hf[0], r.hf[1]); ctx.lineTo(r.hf[0] + (o.dir ?? 1) * h * 0.02, r.hf[1] + h * 0.07); ctx.stroke(); ctx.restore(); }
  return r.hf; };
 P.porter = (ctx, x, y, h, ph, o = {}) => { const d = o.dir ?? 1, r = P.figure(ctx, x, y, h, ph, { pose: 'carry', var: o.var, dir: d }), sh = [r.sh[0], r.sh[1] - h * 0.02], bob = Math.sin(ph * TAU * 2) * h * 0.012;
  ctx.save(); ctx.strokeStyle = '#6b4a2e'; ctx.lineWidth = h * 0.028; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sh[0] - h * 0.4, sh[1] + h * 0.035 + bob); ctx.quadraticCurveTo(sh[0], sh[1] - h * 0.025 + bob, sh[0] + h * 0.4, sh[1] + h * 0.035 + bob); ctx.stroke();
  for (const sd of [-1, 1]) { const bx = sh[0] + sd * h * 0.38, by = Math.min(y - h * 0.08, sh[1] + h * 0.36 + bob + Math.sin(ph * TAU * 2 + sd) * h * 0.01); ctx.strokeStyle = 'rgba(80,60,40,0.9)'; ctx.lineWidth = h * 0.008; ctx.beginPath(); ctx.moveTo(bx - h * 0.07, by - h * 0.06); ctx.lineTo(bx, sh[1] + h * 0.035 + bob); ctx.lineTo(bx + h * 0.07, by - h * 0.06); ctx.stroke(); ctx.fillStyle = '#9a7b4f'; ctx.beginPath(); ctx.moveTo(bx - h * 0.09, by - h * 0.06); ctx.lineTo(bx + h * 0.09, by - h * 0.06); ctx.lineTo(bx + h * 0.07, by + h * 0.06); ctx.lineTo(bx - h * 0.07, by + h * 0.06); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(70,50,30,0.5)'; ctx.lineWidth = 1; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(bx - h * 0.085, by - h * 0.03 + k * h * 0.03); ctx.lineTo(bx + h * 0.08, by - h * 0.03 + k * h * 0.03); ctx.stroke(); }
   if (o.load === 'piedra') { ctx.fillStyle = '#8f958e'; ctx.beginPath(); ctx.ellipse(bx - h * 0.025, by - h * 0.075, h * 0.045, h * 0.03, 0.2, 0, TAU); ctx.ellipse(bx + h * 0.035, by - h * 0.07, h * 0.04, h * 0.028, -0.2, 0, TAU); ctx.fill(); } else if (o.load === 'ladrillos') { ctx.fillStyle = '#a45c42'; ctx.fillRect(bx - h * 0.08, by - h * 0.1, h * 0.075, h * 0.035); ctx.fillRect(bx + h * 0.005, by - h * 0.1, h * 0.075, h * 0.035); ctx.fillStyle = '#93503a'; ctx.fillRect(bx - h * 0.045, by - h * 0.13, h * 0.075, h * 0.033); } else { ctx.fillStyle = '#8a6440'; ctx.beginPath(); ctx.ellipse(bx, by - h * 0.065, h * 0.085, h * 0.032, 0, Math.PI, TAU); ctx.fill(); } }
  ctx.restore(); };
 // ================= v1.14.2 · SISTEMA ÚNICO TERRENO + MURALLA + TORRES (corrección geométrica definitiva) =================
 // Proyección oblicua común: un punto de planta (X, profundidad d) se dibuja en (X + d·Dx, y + d·Dy), con D hacia arriba a la derecha.
 // El terreno a profundidad d se aproxima como gy(X) + d·Dy (el plano de la cresta inclinado con la profundidad).
 // Picos de una cresta (para colocar torres en los puntos altos), con separación mínima
 P.ridgePeaks = (gy, xa, xb, gap = 260) => { const sm2 = (x) => { let s = 0; for (let k = -3; k <= 3; k++) s += gy(x + k * 14); return s / 7; }; const c = []; for (let x = xa; x <= xb; x += 8) { const y = sm2(x); if (y <= sm2(x - 40) && y <= sm2(x + 40)) c.push([x, y]); } c.sort((a, b) => a[1] - b[1]); const out = []; for (const [x] of c) if (out.every((q) => Math.abs(q - x) >= gap)) out.push(x); return out.sort((a, b) => a - b); };
 const WS_COL = {
  ladrillo: { f: '#9c7764', fd: '#6e5242', s: '#b8a08b', sd: '#5f4636', t: '#c9b39e', pl: '#a3a69b', pld: '#6f736b', m: '#8d6b59' },
  piedra: { f: '#a4aaa0', fd: '#70766e', s: '#c2c6bc', sd: '#62695f', t: '#ccd0c6', pl: '#959b92', pld: '#626860', m: '#8e948b' },
  tierra: { f: '#b08758', fd: '#7d5a3a', s: '#c99f70', sd: '#6e4e33', t: '#d3ab7c', pl: '#9a7650', pld: '#6e4e33', m: '#a07a50' },
 };
 const quadP = (ctx, pp, c) => { ctx.beginPath(); pp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
 // Torre en la proyección común. T: { x, F (nivel del adarve en el plano frontal del muro), smoke, fire, pavilion }
 function wsTower(ctx, gy, T, g, t) {
  const { D, tw, tdp, pro, thH, h, st, sunL, ru } = g, C0 = WS_COL[st], dx0 = -pro * D[0], dy0 = -pro * D[1];
  const xl = T.x - tw / 2, xr = T.x + tw / 2, fl = xl + dx0, fr = xr + dx0, top = T.F + dy0 - thH * (1 - ru * 0.4), taper = st === 'tierra' ? tw * 0.12 : 0;
  const gF = (sx) => gy(sx - dx0) + dy0 + 4, gS = (d) => gy(xr) + d * D[1] + 4; // suelo bajo la cara frontal / lateral
  const cS = sunL ? C0.sd : C0.s, cF = sunL ? C0.f : C0.fd;
  // sombra proyectada de la torre sobre la ladera
  const Sx = (sunL ? 1 : -1) * h * 1.5; ctx.save(); ctx.globalAlpha *= 0.22; quadP(ctx, [[fl, gF(fl)], [fr, gF(fr)], [fr + Sx, gF(fr) + h * 0.45], [fl + Sx, gF(fl) + h * 0.45]], '#0e140c'); ctx.restore();
  // cara lateral derecha (de -pro a tdp-pro de profundidad); base sobre el terreno
  const sideTop0 = [fr - taper, top], sideTop1 = [fr - taper + tdp * D[0], top + tdp * D[1]];
  const sp = [sideTop0, sideTop1]; const nB = 8; for (let k = nB; k >= 0; k--) { const d = -pro + tdp * k / nB; sp.push([xr + d * D[0], gS(d)]); } ctx.beginPath(); sp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); const sg = ctx.createLinearGradient(0, top, 0, gS(0)); sg.addColorStop(0, cS); sg.addColorStop(1, C0.sd); ctx.fillStyle = sg; ctx.fill();
  // cara frontal: cuerpo (sobre el adarve) + zócalo de piedra hasta el terreno
  const fp = [[fl + taper, top], [fr - taper, top]]; for (let k = 0; k <= 10; k++) { const sx = fr - (fr - fl) * k / 10; fp.push([sx, gF(sx)]); } ctx.beginPath(); fp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); const fg = ctx.createLinearGradient(0, top, 0, T.F + dy0 + h); fg.addColorStop(0, C0.f); fg.addColorStop(1, cF); ctx.fillStyle = fg; ctx.fill();
  ctx.save(); ctx.clip(); const plTop = T.F + dy0 + h * 0.05; if (st === 'ladrillo') { ctx.fillStyle = C0.pl; ctx.fillRect(fl - 4, plTop, fr - fl + 8, 2000); ctx.strokeStyle = 'rgba(40,44,40,0.35)'; ctx.lineWidth = 1.2; for (let y = plTop + h * 0.22; y < plTop + 600; y += h * 0.22) { ctx.beginPath(); ctx.moveTo(fl, y); ctx.lineTo(fr, y); ctx.stroke(); for (let x = fl + ((y / (h * 0.22)) % 2) * h * 0.25; x < fr; x += h * 0.5) { ctx.beginPath(); ctx.moveTo(x, y - h * 0.22); ctx.lineTo(x, y); ctx.stroke(); } } }
   ctx.strokeStyle = 'rgba(45,32,24,0.28)'; ctx.lineWidth = 1; const ch = st === 'tierra' ? h * 0.2 : h * 0.09; for (let y = top + ch; y < plTop; y += ch) { ctx.beginPath(); ctx.moveTo(fl, y); ctx.lineTo(fr, y); ctx.stroke(); }
   const ao = ctx.createLinearGradient(0, top, 0, top + h * 0.25); ao.addColorStop(0, 'rgba(0,0,0,0.12)'); ao.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = ao; ctx.fillRect(fl, top, fr - fl, h * 0.25);
   const bo = ctx.createLinearGradient(0, gF(T.x) - h * 0.4, 0, gF(T.x)); bo.addColorStop(0, 'rgba(0,0,0,0)'); bo.addColorStop(1, 'rgba(10,12,8,0.35)'); ctx.fillStyle = bo; ctx.fillRect(fl - 4, gF(T.x) - h * 0.6, fr - fl + 8, h * 1.2); ctx.restore();
  // arista iluminada
  ctx.strokeStyle = sunL ? 'rgba(255,238,210,0.5)' : 'rgba(255,238,210,0.35)'; ctx.lineWidth = Math.max(1.5, h * 0.03); ctx.beginPath(); ctx.moveTo(sunL ? fl + taper : fr - taper, top); ctx.lineTo(sunL ? fl : fr, gF(sunL ? fl : fr)); ctx.stroke();
  // azotea
  quadP(ctx, [[fl + taper, top], [fr - taper, top], sideTop1, [fl + taper + tdp * D[0], top + tdp * D[1]]], C0.t);
  if (st !== 'tierra') {
   // ventanas arqueadas (frontal) y puerta al nivel del adarve en la cara lateral, donde entra el tramo de la derecha
   const arch = (pts, c) => quadP(ctx, pts, c), aw = tw * 0.12, ah = thH * 0.32, wy = top + thH * 0.32;
   for (const fx of [-0.28, 0, 0.28]) { const cx = (fl + fr) / 2 + fx * tw; const p = [[cx - aw / 2, wy + ah / 2], [cx - aw / 2, wy - ah / 2 + aw / 2]]; for (let k = 0; k <= 8; k++) { const a = Math.PI + Math.PI * k / 8; p.push([cx + Math.cos(a) * aw / 2, wy - ah / 2 + aw / 2 + Math.sin(a) * aw / 2]); } p.push([cx + aw / 2, wy + ah / 2]); arch(p, '#241a14'); }
   if (ru < 0.7) { const SP = (d, z) => [xr + d * D[0], T.F + d * D[1] - z]; const d0 = 0.28, d1 = 0.72, dz = h * 0.62; const p = [SP(d0, 0), SP(d0, dz * 0.7)]; for (let k = 0; k <= 8; k++) { const u = k / 8, d = lerp(d0, d1, u); p.push(SP(d, dz * 0.7 + Math.sin(u * Math.PI) * dz * 0.3)); } p.push(SP(d1, 0)); quadP(ctx, p, '#1b130e'); }
   // almenas con volumen en los bordes frontal y lateral de la azotea
   if (ru < 0.5) { const mw = tw / 9, mh = h * 0.24, dd = [D[0] * 0.14, D[1] * 0.14]; const merl = (x0, y0) => { quadP(ctx, [[x0 + mw, y0], [x0 + mw + dd[0], y0 + dd[1]], [x0 + mw + dd[0], y0 - mh + dd[1]], [x0 + mw, y0 - mh]], cS); quadP(ctx, [[x0, y0 - mh], [x0 + mw, y0 - mh], [x0 + mw + dd[0], y0 - mh + dd[1]], [x0 + dd[0], y0 - mh + dd[1]]], C0.t); quadP(ctx, [[x0, y0], [x0 + mw, y0], [x0 + mw, y0 - mh], [x0, y0 - mh]], C0.m); };
    for (let k = 1; k <= 3; k++) { const u = k / 4; merl(fr - mw + tdp * D[0] * u, top + tdp * D[1] * u); }
    for (let i = 0; i < 5; i++) merl(fl + i * mw * 2, top); }
   if (T.pavilion && ru < 0.3) { const cx = (fl + fr) / 2 + tdp * D[0] * 0.5, cy = top + tdp * D[1] * 0.5, pw = tw * 0.55, ph = thH * 0.32; quadP(ctx, [[cx - pw / 2, cy], [cx + pw / 2, cy], [cx + pw / 2, cy - ph], [cx - pw / 2, cy - ph]], '#7a3a2e'); ctx.fillStyle = '#3f4a46'; ctx.beginPath(); ctx.moveTo(cx - pw * 0.8, cy - ph + 4); ctx.quadraticCurveTo(cx - pw * 0.5, cy - ph - 6, cx - pw * 0.3, cy - ph - thH * 0.24); ctx.lineTo(cx + pw * 0.3, cy - ph - thH * 0.24); ctx.quadraticCurveTo(cx + pw * 0.5, cy - ph - 6, cx + pw * 0.8, cy - ph + 4); ctx.closePath(); ctx.fill(); }
  }
  const roof = [(fl + fr) / 2 + tdp * D[0] * 0.5, top + tdp * D[1] * 0.5];
  const sm3 = T.smoke || 0; if (sm3 > 0) { for (let i = 0; i < 16; i++) { const u = (t * 0.32 + i / 16) % 1, a = sm3 * (1 - u) * 0.8 * cl(u * 6); ctx.fillStyle = `rgba(72,68,64,${a})`; ctx.beginPath(); ctx.arc(roof[0] + Math.sin(u * 4 + i) * h * 0.25 + u * h, roof[1] - h * 0.2 - u * h * 6 * cl(sm3 * 1.5), h * (0.18 + u * 0.8), 0, TAU); ctx.fill(); } }
  const fi = T.fire || 0; if (fi > 0) { P.glow(ctx, roof[0], roof[1] - h * 0.2, h * 2.4, '255,170,60', 0.6 * fi); for (let i = 0; i < 6; i++) { const u = (t * 2 + i / 6) % 1; ctx.fillStyle = `rgba(255,${180 - u * 120},40,${fi * (1 - u)})`; ctx.beginPath(); ctx.ellipse(roof[0] + Math.sin(t * 9 + i) * h * 0.12, roof[1] - h * 0.2 - u * h * 0.9, h * 0.18 * (1 - u * 0.6), h * 0.36 * (1 - u * 0.4), 0, 0, TAU); ctx.fill(); } }
  return { x: T.x, top: [roof[0], top], roof, door: [xr + 0.5 * D[0], T.F + 0.5 * D[1]], F: T.F };
 }
 // Sistema de muralla sobre el terreno gy(x) entre xa y xb. o: { style, h, thick, build (0..1), towersX:[x…], towerSmoke:[…], towerFire:[…],
 // pavilionX:[x…], ruin, sunLeft, crenel, glow }. Devuelve { towers:[{x, top, roof, door, F}], walk(x) }
 P.wallSystem = (ctx, gy, xa, xb, t, o = {}) => {
  const st = o.style || 'ladrillo', C0 = WS_COL[st], h = o.h ?? 48, th0 = o.thick ?? h * 0.8, D = [th0 * 0.6, -th0 * 0.48], ru = cl(o.ruin || 0), sunL = !!o.sunLeft;
  const xe = lerp(xa, xb, cl(o.build ?? 1)), g = { D, tw: o.towerW ?? h * 1.8, tdp: 1.5, pro: 0.25, thH: o.towerH ?? h * 1.4, h, st, sunL, ru };
  const crest = (x) => { let s = 0; for (let k = -2; k <= 2; k++) s += gy(x + k * 10); return s / 5; }, floor = (x) => crest(x) - h * 0.92;
  const TX = (o.towersX || []).filter((x) => x > xa + g.tw * 0.6 && x < xb - g.tw * 0.6).sort((a, b) => a - b);
  const towers = TX.map((x, i) => ({ x, F: floor(x), smoke: (o.towerSmoke || [])[(o.towersX || []).indexOf(x)] || 0, fire: (o.towerFire || [])[(o.towersX || []).indexOf(x)] || 0, pavilion: (o.pavilionX || []).some((p) => Math.abs(p - x) < g.tw) }));
  // tramos entre torres (cada tramo termina en las caras de las torres)
  const segs = []; let a = xa, Fa = null; towers.forEach((T) => { segs.push({ a, b: T.x - g.tw / 2, Fa, Fb: T.F }); a = T.x + g.tw / 2; Fa = T.F; }); segs.push({ a, b: xb, Fa, Fb: null });
  // perfil del adarve: rampa si la pendiente es suave; escalones si es fuerte; enlazado al nivel de las torres
  const profile = (sg) => { const { a: x0, b: x1 } = sg, fa = sg.Fa ?? floor(x0), fb = sg.Fb ?? floor(x1), corr = (x) => lerp(fa - floor(x0), fb - floor(x1), cl((x - x0) / Math.max(1, x1 - x0))), slope = Math.abs(fb - fa) / Math.max(1, x1 - x0), pts = [];
   const er = (x) => ru * h * 0.45 * (0.5 + 0.5 * Math.sin(x * 0.045)) + (st === 'tierra' ? h * 0.06 * Math.sin(x * 0.11) : 0);
   // por tramos de la longitud de un escalón: pendiente local suave → rampa; fuerte → peldaño horizontal (el parapeto se escalona)
   const n = Math.max(1, Math.round((x1 - x0) / (h * 0.6))); for (let k = 0; k < n; k++) { const u0 = x0 + (x1 - x0) * k / n, u1 = x0 + (x1 - x0) * (k + 1) / n, mid = (u0 + u1) / 2;
    const lv = (x) => (k === 0 && sg.Fa != null && x - x0 < h * 0.6 ? fa : k === n - 1 && sg.Fb != null && x1 - x < h * 0.6 ? fb : floor(x) + corr(x));
    if (Math.abs(floor(u1) - floor(u0)) / Math.max(1, u1 - u0) > 0.1 || k === 0 || k === n - 1) { const y = lv(mid); pts.push([u0, y + er(u0)], [u1, y + er(u1)]); }
    else { for (let x = u0; x <= u1 + 0.1; x += 6) { const xx = Math.min(x, u1); pts.push([xx, lv(xx) + er(xx)]); } } }
   return pts; };
  const walkAll = []; segs.forEach((sg) => { if (sg.b > sg.a) sg.pts = profile(sg); });
  const clipPts = (pts) => { const out = []; for (const p of pts) { if (p[0] <= xe) out.push(p); else { if (out.length) out.push([xe, out[out.length - 1][1]]); break; } } return out; };
  const S = [(sunL ? 1 : -1) * h * 0.9, h * 0.8];
  ctx.save();
  // 1) sombras proyectadas de todos los tramos sobre la ladera
  segs.forEach((sg) => { if (!sg.pts) return; const pts = clipPts(sg.pts); if (pts.length < 2) return; const top = pts.map(([x, y]) => [x + S[0], Math.max(gy(x + S[0]) + 2, y + S[1] - h * 0.2)]); ctx.save(); ctx.globalAlpha *= 0.2; quadP(ctx, [...pts.map(([x]) => [x, gy(x) + 2]), ...top.reverse()], '#0e140c'); ctx.restore(); });
  // 2) tramo → torre → tramo (orden de dibujo correcto en la proyección oblicua)
  const drawSeg = (sg) => { if (!sg.pts) return; const pts = clipPts(sg.pts); if (pts.length < 2) return; const xs = pts[0][0], xf = pts[pts.length - 1][0], ph = st === 'tierra' ? 0 : h * 0.22;
   // adarve (superficie con anchura) y pretil interior
   quadP(ctx, [...pts, ...pts.slice().reverse().map(([x, y]) => [x + D[0], y + D[1]])], C0.t);
   for (let i = 1; i < pts.length; i++) if (Math.abs(pts[i][1] - pts[i - 1][1]) > 1 && Math.abs(pts[i][0] - pts[i - 1][0]) < 0.5) { const [x, y] = pts[i]; ctx.strokeStyle = 'rgba(60,45,35,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, Math.min(y, pts[i - 1][1])); ctx.lineTo(x + D[0], Math.min(y, pts[i - 1][1]) + D[1]); ctx.stroke(); }
   if (st !== 'tierra') { const ip = pts.map(([x, y]) => [x + D[0], y + D[1]]); quadP(ctx, [...ip.map(([x, y]) => [x, y - h * 0.16]), ...ip.slice().reverse()], C0.m); }
   // cara frontal: del parapeto al terreno (la base sigue el relieve)
   const front = [...pts.map(([x, y]) => [x, y - ph])]; for (let x = xf; x >= xs - 0.1; x -= 8) front.push([Math.max(x, xs), gy(Math.max(x, xs)) + 4]);
   ctx.beginPath(); front.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); const ymin = Math.min(...pts.map((p) => p[1])) - ph, fg = ctx.createLinearGradient(0, ymin, 0, ymin + h * 2.2); fg.addColorStop(0, C0.f); fg.addColorStop(1, C0.fd); ctx.fillStyle = fg; ctx.fill();
   ctx.save(); ctx.clip(); const R = H.rng(Math.round(xs) + 3);
   if (st === 'ladrillo') { ctx.fillStyle = C0.pl; ctx.beginPath(); ctx.moveTo(xs, 3000); for (let x = xs; x <= xf; x += 8) ctx.lineTo(x, Math.max(gy(x) - h * 0.55, pts[0][1] + h * 0.35)); ctx.lineTo(xf, 3000); ctx.closePath(); ctx.fill(); }
   ctx.strokeStyle = st === 'tierra' ? 'rgba(80,52,30,0.4)' : 'rgba(45,32,24,0.3)'; ctx.lineWidth = st === 'tierra' ? 2 : 1; const ch = st === 'tierra' ? h * 0.22 : st === 'piedra' ? h * 0.3 : h * 0.1;
   for (let k = 1; k < 26; k++) { ctx.beginPath(); for (let i = 1; i < pts.length; i++) { const [xa2, ya2] = pts[i - 1], [xb2, yb2] = pts[i]; if (Math.abs(xb2 - xa2) < 0.5) continue; ctx.moveTo(xa2, ya2 - ph + k * ch); ctx.lineTo(xb2, yb2 - ph + k * ch); } ctx.stroke(); }
   if (st !== 'tierra') { const jw = st === 'piedra' ? h * 0.42 : h * 0.24; for (let k = 0; k < 26; k++) for (let x = xs + (k % 2) * jw * 0.5 + (st === 'piedra' ? R.range(0, 8) : 0); x < xf; x += jw) { const y0 = lerp(pts[0][1], pts[pts.length - 1][1], (x - xs) / Math.max(1, xf - xs)) - ph + k * ch; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + ch); ctx.stroke(); } }
   const ao = ctx.createLinearGradient(0, ymin, 0, ymin + h * 0.4); ao.addColorStop(0, 'rgba(0,0,0,0.14)'); ao.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = ao; ctx.fillRect(xs - 5, ymin, xf - xs + 10, h * 0.4);
   ctx.fillStyle = 'rgba(10,12,8,0.28)'; ctx.beginPath(); ctx.moveTo(xs, 3000); for (let x = xs; x <= xf; x += 8) ctx.lineTo(x, gy(x) - h * 0.25); ctx.lineTo(xf, 3000); ctx.closePath(); ctx.fill(); ctx.restore();
   // remate del parapeto y almenas con volumen
   ctx.strokeStyle = 'rgba(255,238,210,0.4)'; ctx.lineWidth = Math.max(1.5, h * 0.035); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y - ph) : ctx.moveTo(x, y - ph))); ctx.stroke();
   if ((o.crenel ?? st === 'ladrillo') && ru < 0.6) { const mw = h * 0.26, mh = h * 0.26, dd = [D[0] * 0.13, D[1] * 0.13]; for (let x = xs + mw * 0.5; x < xf - mw; x += mw * 2.1) { let y = pts[0][1]; for (let i = 1; i < pts.length; i++) if (pts[i][0] >= x + mw / 2) { y = pts[i][1]; break; } const y0 = y - ph; quadP(ctx, [[x + mw, y0], [x + mw + dd[0], y0 + dd[1]], [x + mw + dd[0], y0 - mh + dd[1]], [x + mw, y0 - mh]], sunL ? C0.sd : C0.s); quadP(ctx, [[x, y0 - mh], [x + mw, y0 - mh], [x + mw + dd[0], y0 - mh + dd[1]], [x + dd[0], y0 - mh + dd[1]]], C0.t); quadP(ctx, [[x, y0], [x + mw, y0], [x + mw, y0 - mh], [x, y0 - mh]], C0.m); ctx.fillStyle = 'rgba(25,18,12,0.7)'; ctx.fillRect(x + mw * 0.42, y0 - mh * 0.66, mw * 0.16, mh * 0.34); } }
   // cara final donde se detiene la obra (muestra el grosor y el relleno)
   if (xf >= xe - 0.5 && xe < xb - 1) { const yT = pts[pts.length - 1][1] - ph; quadP(ctx, [[xf, yT], [xf + D[0], yT + D[1]], [xf + D[0], gy(xf) + D[1]], [xf, gy(xf) + 4]], sunL ? C0.sd : C0.s); ctx.save(); ctx.globalAlpha *= 0.5; P.matFill(ctx, [[xf + D[0] * 0.2, yT + D[1] * 0.2 + h * 0.1], [xf + D[0] * 0.8, yT + D[1] * 0.8 + h * 0.1], [xf + D[0] * 0.8, gy(xf) + D[1] * 0.8], [xf + D[0] * 0.2, gy(xf) + D[1] * 0.2]], st === 'tierra' ? 'tierra' : 'grava', { layer: h * 0.2 }); ctx.restore(); }
   if (o.glow) { ctx.strokeStyle = `rgba(255,212,71,${o.glow})`; ctx.lineWidth = 5; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y - ph) : ctx.moveTo(x, y - ph))); ctx.stroke(); }
  };
  const outT = []; segs.forEach((sg, i) => { drawSeg(sg); const T = towers[i]; if (T && T.x - g.tw / 2 <= xe) outT.push(wsTower(ctx, gy, T, g, t)); });
  ctx.restore();
  return { towers: outT, walk: (x) => { for (const sg of segs) if (sg.pts && x >= sg.a && x <= sg.b) { for (let i = 1; i < sg.pts.length; i++) if (sg.pts[i][0] >= x) return sg.pts[i][1]; } return floor(x); } };
 };
 // Compatibilidad: muralla a partir de puntos (x creciente) → sistema único. towers = fracciones del recorrido en x.
 P.wallPath = (ctx, pts, t, o = {}) => { const gy = (x) => { if (x <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (pts[i][0] >= x) { const a = pts[i - 1], b = pts[i]; return lerp(a[1], b[1], (x - a[0]) / Math.max(1e-6, b[0] - a[0])); } return pts[pts.length - 1][1]; };
  const xa = pts[0][0], xb = pts[pts.length - 1][0], fr = o.towers || [], towersX = fr.map((f) => lerp(xa, xb, f));
  return P.wallSystem(ctx, gy, xa, xb, t, { ...o, h: o.h, towerH: o.towerS ? o.towerS * 0.5 : undefined, towersX, towerSmoke: fr.map((f) => (f === o.smokeAt ? o.smoke : 0)), towerFire: fr.map((f) => (f === o.fireAt ? o.fire : 0)), pavilionX: (o.pavilion || []).map((f) => lerp(xa, xb, f)) }); };
 // Torre aislada sobre suelo plano (catálogo y usos sueltos), con la misma geometría
 P.watchtower = (ctx, x, y, s, t, o = {}) => { const h = s * 0.42; return wsTower(ctx, () => y, { x, F: y - h, smoke: o.smoke, fire: o.fire, pavilion: o.pavilion }, { D: [h * 0.8 * 0.6, -h * 0.8 * 0.48], tw: h * 1.8, tdp: 1.5, pro: 0.25, thH: s - h, h, st: o.style || 'ladrillo', sunL: !!o.sunLeft, ru: o.ruin || 0 }, t); };
 // Texturas de materiales para cortes: tierra compactada (capas), grava/cascajo, piedra, ladrillo (aparejo con juntas), madera
 P.matFill = (ctx, pts, mat, o = {}) => { const R = H.rng(o.seed || 9); ctx.save(); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const base = { tierra: '#A4774C', grava: '#8d8a7c', piedra: '#9ca29b', ladrillo: '#A45C42', madera: '#8f6643', cana: '#8a8a52' }[mat] || '#888'; ctx.fillStyle = o.glow ? '#d0a070' : base; ctx.fill(); ctx.clip();
  if (mat === 'tierra') { const lh = o.layer || 22; for (let y = y1; y > y0; y -= lh) { ctx.fillStyle = 'rgba(70,46,26,0.45)'; ctx.fillRect(x0, y - 2, x1 - x0, 2); ctx.fillStyle = 'rgba(255,230,190,0.08)'; ctx.fillRect(x0, y - lh, x1 - x0, lh * 0.4); } ctx.fillStyle = 'rgba(80,55,32,0.4)'; for (let i = 0; i < (x1 - x0) * (y1 - y0) / 120; i++) ctx.fillRect(R.range(x0, x1), R.range(y0, y1), 2, 2); if (o.reeds) { for (let y = y1 - lh * 3; y > y0; y -= lh * 3) { ctx.fillStyle = 'rgba(130,140,70,0.9)'; ctx.fillRect(x0, y - 4, x1 - x0, 5); ctx.strokeStyle = 'rgba(80,90,40,0.8)'; ctx.lineWidth = 1; for (let x = x0; x < x1; x += 7) { ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x + 5, y); ctx.stroke(); } } } }
  else if (mat === 'grava') { for (let i = 0; i < (x1 - x0) * (y1 - y0) / 140; i++) { ctx.fillStyle = ['#6f6c60', '#a8a596', '#7c827d', '#5f5a50'][i % 4]; ctx.beginPath(); ctx.ellipse(R.range(x0, x1), R.range(y0, y1), R.range(3, 9), R.range(2, 6), R.range(0, 3), 0, TAU); ctx.fill(); } }
  else if (mat === 'piedra') { for (let i = 0; i < (x1 - x0) * (y1 - y0) / 1400; i++) { const cx = R.range(x0, x1), cy = R.range(y0, y1), r = R.range(12, 26); ctx.fillStyle = ['#a8aea6', '#8f958e', '#b6bab0'][i % 3]; ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + R() * 0.4; ctx.lineTo(cx + Math.cos(a) * r * R.range(0.7, 1.1), cy + Math.sin(a) * r * 0.7 * R.range(0.7, 1.1)); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(50,52,48,0.6)'; ctx.lineWidth = 1.5; ctx.stroke(); } }
  else if (mat === 'ladrillo') { const bh = o.bh || 14, bw = bh * 2.6; for (let y = y1, r = 0; y > y0 - bh; y -= bh, r++) for (let x = x0 - (r % 2) * bw / 2; x < x1; x += bw) { ctx.fillStyle = (Math.round(x * 7 + y * 3) % 3) ? '#A45C42' : '#96523c'; ctx.fillRect(x + 1, y - bh + 1, bw - 2, bh - 2); } ctx.fillStyle = 'rgba(220,214,196,0.35)'; }
  else if (mat === 'madera') { ctx.strokeStyle = 'rgba(60,40,24,0.45)'; ctx.lineWidth = 1.5; for (let y = y0 + 4; y < y1; y += 6) { ctx.beginPath(); ctx.moveTo(x0, y); for (let x = x0; x < x1; x += 20) ctx.lineTo(x, y + Math.sin(x * 0.05 + y) * 1.5); ctx.stroke(); } }
  ctx.restore(); ctx.save(); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.strokeStyle = o.glow ? 'rgba(255,212,71,0.95)' : 'rgba(30,22,16,0.6)'; ctx.lineWidth = o.glow ? 5 : 2; ctx.stroke(); ctx.restore(); };
 // Cortes comparables de tres tipos de muro. kind: 'tierra' (apisonada, con capas de cañas opcionales), 'piedra' (mampostería
 // con relleno), 'ming' (núcleo de tierra compactada y cascajo, paramentos de ladrillo sobre cimiento de piedra, adarve y parapeto).
 // Devuelve puntos para rótulos. o: { reeds, glow:{…}, build (0..1, solo ming: hiladas) }
 P.wallSection = (ctx, x, y, w, h, t, kind, o = {}) => { const gl = o.glow || {}, pts = {}; ctx.save(); ctx.fillStyle = 'rgba(20,18,14,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 6, w * 0.62, h * 0.05, 0, 0, TAU); ctx.fill();
  if (kind === 'tierra') { const tw = w * 0.62; P.matFill(ctx, [[x - w / 2, y], [x + w / 2, y], [x + tw / 2, y - h], [x - tw / 2, y - h]], 'tierra', { layer: h / 14, reeds: o.reeds, glow: gl.earth }); pts.earth = [x, y - h * 0.45]; pts.reed = [x + w * 0.2, y - h * (3 / 14) - 2]; }
  else if (kind === 'piedra') { const tw = w * 0.7, bt = w * 0.16; P.matFill(ctx, [[x - w / 2 + bt, y], [x + w / 2 - bt, y], [x + tw / 2 - bt * 0.8, y - h], [x - tw / 2 + bt * 0.8, y - h]], 'grava', { glow: gl.fill }); P.matFill(ctx, [[x - w / 2, y], [x - w / 2 + bt, y], [x - tw / 2 + bt * 0.8, y - h], [x - tw / 2, y - h]], 'piedra', { seed: 3, glow: gl.stone }); P.matFill(ctx, [[x + w / 2 - bt, y], [x + w / 2, y], [x + tw / 2, y - h], [x + tw / 2 - bt * 0.8, y - h]], 'piedra', { seed: 5, glow: gl.stone }); pts.fill = [x, y - h * 0.5]; pts.stone = [x + w * 0.4, y - h * 0.35]; }
  else { const tw = w * 0.78, bt = w * 0.1, fh = h * 0.15, bd = o.build ?? 1; P.matFill(ctx, [[x - w / 2 - 12, y], [x + w / 2 + 12, y], [x + w / 2 + 12, y - fh], [x - w / 2 - 12, y - fh]], 'piedra', { seed: 2, glow: gl.stone });
   const cL = (u) => lerp(x - w / 2 + bt, x - tw / 2 + bt * 0.8, u), cR = (u) => lerp(x + w / 2 - bt, x + tw / 2 - bt * 0.8, u), hy = (u) => y - fh - u * (h - fh - h * 0.05);
   P.matFill(ctx, [[cL(0), hy(0)], [cR(0), hy(0)], [cR(0.55), hy(0.55)], [cL(0.55), hy(0.55)]], 'tierra', { layer: h / 16, glow: gl.earth }); P.matFill(ctx, [[cL(0.55), hy(0.55)], [cR(0.55), hy(0.55)], [cR(1), hy(1)], [cL(1), hy(1)]], 'grava', { glow: gl.fill });
   for (const sd of [-1, 1]) { const ub = Math.max(0.02, bd); const ox = (u) => sd < 0 ? lerp(x - w / 2, x - tw / 2, u) : lerp(x + w / 2, x + tw / 2, u), ix = (u) => ox(u) - sd * bt; P.matFill(ctx, [[ox(0), hy(0)], [ix(0), hy(0)], [ix(ub), hy(ub)], [ox(ub), hy(ub)]], 'ladrillo', { bh: h / 34, glow: gl.brick }); }
   if (bd >= 1) { P.matFill(ctx, [[x - tw / 2, hy(1)], [x + tw / 2, hy(1)], [x + tw / 2, hy(1) - h * 0.035], [x - tw / 2, hy(1) - h * 0.035]], 'ladrillo', { bh: h * 0.035 }); const ph = h * 0.15; P.matFill(ctx, [[x + tw / 2 - bt * 0.7, hy(1) - h * 0.035], [x + tw / 2, hy(1) - h * 0.035], [x + tw / 2, hy(1) - ph], [x + tw / 2 - bt * 0.7, hy(1) - ph]], 'ladrillo', { bh: h / 34 }); P.matFill(ctx, [[x + tw / 2 - bt * 0.7, hy(1) - ph - h * 0.02], [x + tw / 2, hy(1) - ph - h * 0.02], [x + tw / 2, hy(1) - ph * 1.45], [x + tw / 2 - bt * 0.7, hy(1) - ph * 1.45]], 'ladrillo', { bh: h / 34 }); P.matFill(ctx, [[x - tw / 2, hy(1) - h * 0.035], [x - tw / 2 + bt * 0.6, hy(1) - h * 0.035], [x - tw / 2 + bt * 0.6, hy(1) - ph * 0.6], [x - tw / 2, hy(1) - ph * 0.6]], 'ladrillo', { bh: h / 34 }); }
   pts.earth = [x - w * 0.05, hy(0.25)]; pts.fill = [x + w * 0.05, hy(0.78)]; pts.brick = [lerp(x + w / 2, x + tw / 2, 0.5) - bt * 0.5, hy(0.5)]; pts.stone = [x + w * 0.32, y - fh / 2]; pts.parapet = [x + tw / 2 - bt * 0.35, hy(1) - h * 0.15]; }
  ctx.restore(); return pts; };
 // Carro de dos ruedas tirado por un buey. (x, y) = suelo bajo el centro. s = largo total. o: { load, phase (giro de ruedas), dir (1 derecha) }
 P.oxcart = (ctx, x, y, s, t, o = {}) => { const d = o.dir ?? 1, ph = o.phase || 0; ctx.save(); ctx.translate(x, y); ctx.scale(d, 1);
  ctx.fillStyle = 'rgba(20,20,15,0.3)'; ctx.beginPath(); ctx.ellipse(0, 4, s * 0.5, s * 0.04, 0, 0, TAU); ctx.fill();
  // buey
  const ox = s * 0.24, oy = -s * 0.2, lg = Math.sin(ph * TAU) * s * 0.025; ctx.fillStyle = '#5a4532'; ctx.beginPath(); ctx.ellipse(ox, oy, s * 0.17, s * 0.09, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(ox + s * 0.19, oy - s * 0.02, s * 0.06, s * 0.045, 0.3, 0, TAU); ctx.fill(); ctx.strokeStyle = '#d8ccb0'; ctx.lineWidth = s * 0.012; ctx.beginPath(); ctx.moveTo(ox + s * 0.17, oy - s * 0.06); ctx.quadraticCurveTo(ox + s * 0.15, oy - s * 0.11, ox + s * 0.2, oy - s * 0.12); ctx.stroke();
  ctx.strokeStyle = '#4a3828'; ctx.lineWidth = s * 0.025; ctx.lineCap = 'round'; for (const [lx, sg] of [[-0.11, 1], [-0.06, -1], [0.1, -1], [0.14, 1]]) { ctx.beginPath(); ctx.moveTo(ox + lx * s, oy + s * 0.05); ctx.lineTo(ox + lx * s + sg * lg, y * 0 - s * 0.005); ctx.stroke(); }
  // varas y caja
  ctx.strokeStyle = '#6b4a2e'; ctx.lineWidth = s * 0.015; ctx.beginPath(); ctx.moveTo(-s * 0.05, -s * 0.16); ctx.lineTo(ox + s * 0.05, oy - s * 0.04); ctx.stroke();
  ctx.fillStyle = '#795335'; ctx.fillRect(-s * 0.45, -s * 0.24, s * 0.4, s * 0.09); ctx.strokeStyle = 'rgba(40,25,15,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(-s * 0.45, -s * 0.24, s * 0.4, s * 0.09);
  const ld = o.load || 'tierra'; if (ld === 'ladrillos') { ctx.fillStyle = '#a45c42'; for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { ctx.fillRect(-s * 0.44 + i * s * 0.064, -s * 0.28 - r * s * 0.035, s * 0.058, s * 0.032); } } else if (ld === 'piedra') { ctx.fillStyle = '#8f958e'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(-s * 0.4 + i * s * 0.1, -s * 0.27, s * 0.055, s * 0.04, 0, 0, TAU); ctx.fill(); } } else { ctx.fillStyle = '#8a6440'; ctx.beginPath(); ctx.ellipse(-s * 0.25, -s * 0.24, s * 0.2, s * 0.06, 0, Math.PI, TAU); ctx.fill(); }
  // rueda de radios
  const wr = s * 0.13, wx = -s * 0.25, wy = -wr; ctx.strokeStyle = '#4a3020'; ctx.lineWidth = s * 0.018; ctx.beginPath(); ctx.arc(wx, wy, wr, 0, TAU); ctx.stroke(); ctx.lineWidth = s * 0.008; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + ph * TAU; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + Math.cos(a) * wr, wy + Math.sin(a) * wr); ctx.stroke(); } ctx.fillStyle = '#3a2416'; ctx.beginPath(); ctx.arc(wx, wy, s * 0.02, 0, TAU); ctx.fill();
  ctx.restore(); };
 // Animal de carga (burro/mula) con alforjas. o: { load, dir }
 P.packAnimal = (ctx, x, y, s, ph, o = {}) => { const d = o.dir ?? 1; ctx.save(); ctx.translate(x, y); ctx.scale(d, 1); const lg = Math.sin(ph * TAU) * s * 0.06;
  ctx.fillStyle = 'rgba(20,20,15,0.3)'; ctx.beginPath(); ctx.ellipse(0, 3, s * 0.45, s * 0.05, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#6a5a4c'; ctx.lineWidth = s * 0.06; ctx.lineCap = 'round'; for (const [lx, sg] of [[-0.25, 1], [-0.18, -1], [0.2, -1], [0.27, 1]]) { ctx.beginPath(); ctx.moveTo(lx * s, -s * 0.38); ctx.lineTo(lx * s + sg * lg, 0); ctx.stroke(); }
  ctx.fillStyle = '#7d6c5c'; ctx.beginPath(); ctx.ellipse(0, -s * 0.48, s * 0.36, s * 0.16, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(s * 0.28, -s * 0.55); ctx.lineTo(s * 0.48, -s * 0.78); ctx.lineTo(s * 0.6, -s * 0.66); ctx.lineTo(s * 0.4, -s * 0.44); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.ellipse(s * 0.6, -s * 0.66, s * 0.08, s * 0.06, 0.6, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(s * 0.47, -s * 0.86, s * 0.025, s * 0.08, -0.2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#8a6a45'; ctx.fillRect(-s * 0.2, -s * 0.66, s * 0.36, s * 0.08); ctx.fillStyle = o.load === 'ladrillos' ? '#a45c42' : o.load === 'piedra' ? '#8f958e' : '#9a7b4f'; ctx.fillRect(-s * 0.18, -s * 0.6, s * 0.14, s * 0.2); ctx.fillRect(s * 0.0, -s * 0.6, s * 0.14, s * 0.2);
  ctx.restore(); };
 // Muro de tierra apisonada en construcción (alzado frontal). (x, y) = base centro. o: { total (capas objetivo), done (capas terminadas),
 // loose (0..1 vertido de la capa actual), compact (0..1), form (0..1 encofrado visible; tablones delanteros en corte, semitransparentes),
 // workers (n), hit (fase de golpes), cut (0..1 corte con capas marcadas), glowLayer }. Devuelve { surf, th, top, hits }
 P.rammedEarth = (ctx, x, y, w, h, t, o = {}) => {
  const n = o.total ?? 8, th = h / n, done = Math.floor(o.done ?? 0), lo = cl(o.loose ?? 0), cp = cl(o.compact ?? 0), fm = o.form ?? 1, R = H.rng(o.seed || 4);
  const x0 = x - w / 2, x1 = x + w / 2; ctx.save();
  ctx.fillStyle = 'rgba(25,20,15,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 4, w * 0.58, th * 0.5, 0, 0, TAU); ctx.fill();
  // capas terminadas: cada una con su tono y textura de grano; líneas de junta visibles
  for (let i = 0; i < done; i++) { const yt = y - (i + 1) * th; const g = ctx.createLinearGradient(0, yt, 0, yt + th); const tone = (i % 2 ? 6 : -6) + R.range(-5, 5); g.addColorStop(0, `rgb(${170 + tone},${124 + tone},${80 + tone})`); g.addColorStop(1, `rgb(${136 + tone},${96 + tone},${60 + tone})`); ctx.fillStyle = g; ctx.fillRect(x0, yt, w, th + 0.5);
   ctx.fillStyle = 'rgba(80,55,32,0.35)'; for (let k = 0; k < w * th / 90; k++) ctx.fillRect(x0 + R() * w, yt + R() * th, 2, 2); ctx.fillStyle = 'rgba(70,46,26,0.55)'; ctx.fillRect(x0, yt + th - 2, w, 2); if (o.glowLayer === i) { ctx.strokeStyle = 'rgba(255,212,71,0.95)'; ctx.lineWidth = 4; ctx.strokeRect(x0, yt, w, th); } }
  // capa actual: tierra suelta que, al compactarse, baja de altura y se vuelve más densa
  let surf = y - done * th; if (lo > 0) { const hl = th * lerp(1.35, 1, cp) * lo, yt = surf - hl; ctx.fillStyle = cp > 0.5 ? '#9c7046' : '#a9845a'; ctx.beginPath(); ctx.moveTo(x0, surf); for (let k = 0; k <= 30; k++) { const xx = x0 + w * k / 30, bump = (1 - cp) * th * 0.25 * (0.5 + 0.5 * Math.sin(k * 1.7 + done)); ctx.lineTo(xx, yt + bump); } ctx.lineTo(x1, surf); ctx.closePath(); ctx.fill();
   ctx.fillStyle = `rgba(90,62,36,${0.25 + 0.4 * cp})`; for (let k = 0; k < w * hl / (70 - 40 * cp); k++) { ctx.beginPath(); ctx.arc(x0 + R() * w, yt + th * 0.15 + R() * (hl - th * 0.15), (1 - cp) * 2.5 + 1, 0, TAU); ctx.fill(); } surf = yt; }
  // encofrado: postes verticales y tablones horizontales que rodean las capas superiores
  if (fm > 0) { ctx.save(); ctx.globalAlpha *= fm; const fy0 = Math.min(surf, y - done * th) - th * 0.4, fy1 = y - Math.max(0, done - 1) * th; ctx.fillStyle = '#795335'; for (const px of [x0 - 14, x1 + 2]) { ctx.fillRect(px, fy0 - th * 1.2, 12, (y - fy0) + th * 1.2); } for (let b = 0; b < 3; b++) { const by = fy0 + b * th * 0.75; if (by > y) break; ctx.fillStyle = 'rgba(143,102,67,0.28)'; ctx.fillRect(x0 - 20, by, w + 40, th * 0.5); ctx.strokeStyle = 'rgba(121,83,53,0.95)'; ctx.lineWidth = 3; ctx.strokeRect(x0 - 20, by, w + 40, th * 0.5); } ctx.strokeStyle = '#5a3d29'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0 - 20, fy0 - th * 1.15); ctx.lineTo(x1 + 20, fy0 - th * 1.15); ctx.stroke(); ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 3; for (const px of [x0 - 8, x1 + 8]) { ctx.beginPath(); ctx.moveTo(px - 8, fy0 - th * 1.25); ctx.lineTo(px + 8, fy0 - th * 1.05); ctx.moveTo(px + 8, fy0 - th * 1.25); ctx.lineTo(px - 8, fy0 - th * 1.05); ctx.stroke(); } ctx.restore(); }
  // trabajadores con pisones: el pisón toca la superficie en cada golpe y levanta polvo
  const nw = o.workers ?? 0, wh = Math.min(th * 3.4, w * 0.36), hits = []; for (let i = 0; i < nw; i++) { const wx = x0 + w * (i + 0.5) / nw - wh * 0.12, ph = (o.hit || 0) + i * 0.37, lift = Math.pow(Math.max(0, Math.sin(ph * TAU)), 0.7), feet = surf;
   const fr = P.figure(ctx, wx, feet, wh, 0, { pose: 'ram', lift, var: i + 1 }); const px = wx + wh * 0.22, pb = feet - lift * wh * 0.24;
   ctx.strokeStyle = '#6b4a2e'; ctx.lineWidth = wh * 0.035; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px, pb - wh * 0.86); ctx.lineTo(px, pb - wh * 0.06); ctx.stroke(); ctx.fillStyle = '#4e3a28'; ctx.beginPath(); ctx.moveTo(px - wh * 0.07, pb); ctx.lineTo(px + wh * 0.07, pb); ctx.lineTo(px + wh * 0.05, pb - wh * 0.08); ctx.lineTo(px - wh * 0.05, pb - wh * 0.08); ctx.closePath(); ctx.fill();
   // manos sobre el mango (se vuelven a dibujar encima del palo)
   ctx.fillStyle = FIG_SKIN[(i + 1) % FIG_SKIN.length]; for (const hh of [fr.hf, fr.hb]) { ctx.beginPath(); ctx.arc(px, hh[1], wh * 0.03, 0, TAU); ctx.fill(); }
   const frp = ((ph % 1) + 1) % 1, contact = frp >= 0.5 ? 1 - Math.min(1, (frp - 0.5) * 4) : 0; if (contact > 0.2) { hits.push([px, feet]); ctx.strokeStyle = `rgba(255,236,200,${0.6 * contact})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(px, feet, wh * 0.12 * (1.4 - contact), wh * 0.03, 0, 0, TAU); ctx.stroke(); for (let q = 0; q < 6; q++) { const a = q / 5 * Math.PI, rr = wh * 0.05 * (1.5 - contact); ctx.fillStyle = `rgba(196,168,126,${0.55 * contact})`; ctx.beginPath(); ctx.arc(px + Math.cos(a) * rr * 2.2, feet - Math.sin(a) * rr, rr * 0.6 + 3, 0, TAU); ctx.fill(); } } }
  // corte: capas marcadas
  const ct = o.cut || 0; if (ct > 0) { ctx.save(); ctx.globalAlpha *= ct; ctx.strokeStyle = 'rgba(255,240,210,0.9)'; ctx.lineWidth = 3; for (let i = 1; i <= done; i++) { const yy = y - i * th; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); ctx.stroke(); } ctx.restore(); }
  ctx.restore(); return { surf, th, top: y - done * th, hits };
 };
 // Corte de un muro Ming: cimiento de grandes piedras, paramentos de ladrillo, núcleo de tierra y cascajo, adarve enladrillado y parapeto almenado.
 // o: { core (0..1 revela el núcleo), build (0..1 hiladas de ladrillo colocadas), glow:{core, brick, stone} }. Devuelve puntos para rótulos.
 P.mingSection = (ctx, x, y, w, h, t, o = {}) => {
  const bt = w * 0.1, tw = w * 0.78, gl = o.glow || {}, bd = o.build ?? 1, R = H.rng(6);
  const L0 = [x - w / 2, y], R0 = [x + w / 2, y], L1 = [x - tw / 2, y - h], R1 = [x + tw / 2, y - h];
  ctx.save(); ctx.fillStyle = 'rgba(25,20,15,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 6, w * 0.6, h * 0.05, 0, 0, TAU); ctx.fill();
  // cimiento de piedra
  const fh = h * 0.16; ctx.fillStyle = gl.stone ? '#c9cfc4' : '#9ca29b'; ctx.fillRect(x - w / 2 - 10, y - fh, w + 20, fh); ctx.strokeStyle = 'rgba(40,40,36,0.6)'; ctx.lineWidth = 2; for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) ctx.strokeRect(x - w / 2 - 10 + i * (w + 20) / 7 + (r % 2) * 20 - 10, y - fh + r * fh / 2, (w + 20) / 7, fh / 2);
  // núcleo (tierra apisonada y cascajo por capas)
  const coreP = [[L0[0] + bt, y - fh], [R0[0] - bt, y - fh], [R1[0] - bt * 0.8, y - h + h * 0.06], [L1[0] + bt * 0.8, y - h + h * 0.06]];
  ctx.beginPath(); coreP.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = gl.core ? '#c49562' : '#A4774C'; ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(80,52,30,0.5)'; ctx.lineWidth = 2; for (let yy = y - fh - h * 0.07; yy > y - h; yy -= h * 0.07) { ctx.beginPath(); ctx.moveTo(x - w, yy); ctx.lineTo(x + w, yy); ctx.stroke(); } ctx.fillStyle = 'rgba(124,130,125,0.85)'; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.ellipse(x + R.range(-w * 0.35, w * 0.35), R.range(y - h + h * 0.1, y - fh - 6), R.range(5, 14), R.range(4, 9), R.range(0, 3), 0, TAU); ctx.fill(); } ctx.restore();
  // paramentos de ladrillo (ataludados), hiladas que se colocan de abajo arriba
  const courses = 16, ch = (h - fh) / courses; for (const sd of [-1, 1]) for (let c = 0; c < courses; c++) { if (c / courses > bd) break; const yy = y - fh - (c + 1) * ch, uo = (c + 0.5) / courses, xo = sd < 0 ? lerp(L0[0], L1[0], uo) : lerp(R0[0], R1[0], uo), xi = xo - sd * bt; const bw = bt / 2; for (let k = 0; k < 2; k++) { const bx = Math.min(xo, xi) + k * bw + ((c % 2) ? bw * 0.5 : 0) * 0; ctx.fillStyle = gl.brick ? '#d07a5a' : (c + k) % 3 ? '#A45C42' : '#9a5540'; ctx.fillRect(bx, yy, bw - 1.5, ch - 1.5); } }
  // adarve y parapetos
  if (bd >= 1) { ctx.fillStyle = '#8f5a46'; ctx.fillRect(L1[0], y - h, tw, h * 0.04); ctx.fillStyle = '#A45C42'; const ph = h * 0.16; ctx.fillRect(R1[0] - bt * 0.7, y - h - ph, bt * 0.7, ph); for (let i = 0; i < 1; i++) ctx.fillRect(R1[0] - bt * 0.7, y - h - ph * 1.45, bt * 0.7, ph * 0.3); ctx.fillRect(L1[0], y - h - ph * 0.6, bt * 0.6, ph * 0.6); }
  ctx.restore(); return { core: [x, y - h * 0.5], brick: [lerp(R0[0], R1[0], 0.5) - bt * 0.5, y - h * 0.5], stone: [x + w * 0.3, y - fh / 2], parapet: [R1[0] - bt * 0.35, y - h - h * 0.12], walk: [x, y - h] };
 };
 // Mapa ESQUEMÁTICO del norte de China: costa (Bohai, Shandong, Liaodong), río Amarillo, desiertos (Gobi, Ordos) y relieve.
 // o: { lon0, lon1, lat0, lat1, latRef }. Devuelve proj([lon, lat]). P.CNWALLS: tramos aproximados por periodo.
 const CN = {
  mar: [[124.6, 40.1], [122.9, 39.6], [121.2, 38.8], [121.6, 39.5], [122.2, 40.4], [121.1, 40.9], [119.8, 40.0], [118.2, 39.2], [117.7, 38.4], [118.9, 37.5], [119.9, 37.2], [120.7, 37.8], [122.6, 37.4], [121.6, 36.8], [120.3, 36.0], [119.2, 35.0], [120.3, 34.3], [121.0, 32.0], [130, 32], [130, 41]],
  rio: [[96.5, 34.5], [100.5, 36.2], [103.8, 36.06], [105.2, 37.4], [106.3, 38.5], [106.8, 39.7], [108.5, 40.8], [110.0, 40.6], [111.3, 40.3], [110.9, 39.2], [110.6, 38.0], [110.4, 36.6], [110.3, 34.6], [112.5, 34.8], [113.6, 34.9], [115.5, 35.6], [116.9, 36.6], [118.9, 37.7]],
  gobi: [[96, 41.5], [102, 41.8], [108, 42.6], [112, 43.5], [114, 44.5], [104, 45.2], [95, 44]], ordos: [[107.5, 39.2], [109.5, 39.4], [110.2, 38.6], [108.7, 37.9], [107.3, 38.2]], badain: [[100, 39.6], [103.5, 40.5], [104.2, 39.2], [101.5, 38.8]],
 };
 P.CNWALLS = { // esquemas aproximados (simplificados) de algunos sistemas; no son trazados exactos
  estados: [[[111.0, 41.3], [113.5, 41.6], [116.5, 41.9], [119.5, 42.2], [122.5, 42.0]], [[104.0, 35.6], [106.5, 37.0], [109.8, 39.2], [110.6, 40.3]]],
  qin: [[[103.9, 35.4], [105.5, 36.5], [107.6, 38.9], [109.9, 41.2], [112.5, 41.4], [116.0, 41.8], [119.5, 42.1], [123.0, 41.6], [124.8, 40.8]]],
  han: [[[90.6, 40.4], [93.0, 40.3], [94.8, 40.3], [97.5, 40.1], [99.5, 39.6], [101.0, 39.0], [103.5, 38.2], [105.6, 38.6], [107.6, 39.3]], [[107.6, 41.4], [110.0, 41.9], [113.0, 42.4]]],
  ming: [[[98.2, 39.8], [100.4, 38.9], [102.6, 37.9], [103.9, 37.3], [105.2, 37.5], [106.2, 38.5], [107.2, 38.0], [108.7, 37.6], [109.7, 38.3], [111.3, 39.6], [113.3, 40.4], [114.9, 40.6], [116.0, 40.35], [117.2, 40.7], [118.6, 40.3], [119.8, 40.0]], [[119.8, 40.0], [121.0, 41.2], [122.6, 41.9], [124.4, 40.1]]],
 };
 P.chinaMap = (ctx, x, y, w, h, t, o = {}) => {
  const lon0 = o.lon0 ?? 88, lon1 = o.lon1 ?? 126, lat0 = o.lat0 ?? 32, lat1 = o.lat1 ?? 46, k = Math.cos((o.latRef ?? 39) * Math.PI / 180), sc = Math.min(w / ((lon1 - lon0) * k), h / (lat1 - lat0)), ox = x + (w - (lon1 - lon0) * k * sc) / 2, oy = y + (h - (lat1 - lat0) * sc) / 2;
  const proj = (p) => [ox + (p[0] - lon0) * k * sc, oy + (lat1 - p[1]) * sc];
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); const lg = ctx.createLinearGradient(0, y, 0, y + h); lg.addColorStop(0, '#7f8a6a'); lg.addColorStop(1, '#6a7a58'); ctx.fillStyle = lg; ctx.fillRect(x, y, w, h);
  const poly = (pts, fill) => { ctx.beginPath(); P.spline(pts.map(proj), 4).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
  poly(CN.gobi, 'rgba(201,180,142,0.85)'); poly(CN.badain, 'rgba(214,190,140,0.85)'); poly(CN.ordos, 'rgba(201,180,142,0.75)');
  // relieve: sombreado de cordilleras (Qilian, Yin, Taihang, Yan)
  ctx.strokeStyle = 'rgba(60,70,50,0.35)'; ctx.lineWidth = 3; for (const rg of [[[96, 38.5], [101, 37.8], [103, 36.8]], [[107, 41.1], [111, 41.3], [114, 41.6]], [[112.6, 39.8], [113.4, 37.5], [113.8, 35.5]], [[115.2, 40.6], [117.5, 40.9], [119, 40.6]]]) { const pp = rg.map(proj); for (let i = 0; i < 18; i++) { const u = i / 17, a = pp[Math.min(pp.length - 2, Math.floor(u * (pp.length - 1)))], b = pp[Math.min(pp.length - 1, Math.floor(u * (pp.length - 1)) + 1)], f = (u * (pp.length - 1)) % 1, px = lerp(a[0], b[0], f), py = lerp(a[1], b[1], f); ctx.beginPath(); ctx.moveTo(px - 10, py + 7); ctx.lineTo(px, py - 8); ctx.lineTo(px + 10, py + 7); ctx.stroke(); } }
  poly(CN.mar, '#2d5466'); ctx.strokeStyle = 'rgba(220,232,233,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); P.spline(CN.mar.slice(0, 18).map(proj), 4).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  ctx.strokeStyle = '#4f8fb0'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); P.spline(CN.rio.map(proj), 6).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  ctx.restore(); return proj;
 };
 // Tramo de muralla en un mapa: línea con dientes (símbolo cartográfico) que se dibuja con p. o: { w, c, glow }
 P.mapWall = (ctx, pts, p, t, o = {}) => { if (p <= 0) return; const cv = P.spline(pts, 10), pa = P.path(cv), end = pa.L * cl(p), c = o.c || '#A45C42', w = o.w || 7; const sub = [cv[0]]; for (let s = 6; s < end; s += 6) { const q = pa.at(s); sub.push([q[0], q[1]]); } const e = pa.at(end); sub.push([e[0], e[1]]);
  ctx.save(); if (o.glow !== false) P.strokePath(ctx, sub, w * 3, 'rgba(255,240,200,0.25)'); P.strokePath(ctx, sub, w, c); ctx.fillStyle = c; for (let s = 10; s < end; s += 18) { const q = pa.at(s); ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(q[2]); ctx.fillRect(-w * 0.4, -w * 1.25, w * 0.8, w * 0.75); ctx.restore(); } ctx.restore(); return pa; };
 // Polvo que se levanta (determinista). o: { s, c }
 P.dust = (ctx, x, y, t, t0, o = {}) => { const u = t - t0; if (u < 0 || u > 1.4) return; const s = o.s || 40, R = H.rng(o.seed || 3); ctx.save(); for (let i = 0; i < 10; i++) { const a = -Math.PI * R(), v = R.range(0.4, 1); ctx.fillStyle = o.c || `rgba(196,168,126,${0.55 * (1 - u / 1.4)})`; ctx.beginPath(); ctx.arc(x + Math.cos(a) * s * v * u * 1.6, y + Math.sin(a) * s * v * u * 0.6 - u * s * 0.3, s * (0.15 + u * 0.35) * v, 0, TAU); ctx.fill(); } ctx.restore(); };
 // ================= v1.15 · INGENIERÍA SÍSMICA: sismo, respuesta dinámica y puente con mecanismos integrados =================
 // Movimiento del terreno determinista: ug(t) desplazamiento y ag(t) aceleración (unidades de dibujo). o: { t0, t1, amp, seed, freqs, pulses:[[ta, tb, k]] }
 P.quakeGround = (o = {}) => { const t0 = o.t0 ?? 0, t1 = o.t1 ?? 20, A = o.amp ?? 10, R = H.rng(o.seed || 7), fs = o.freqs || [0.85, 1.3, 1.9, 2.6, 3.4], comps = fs.map((f) => ({ f, b: A / Math.pow(f, 1.1) / fs.length * 2.2, p: R.range(0, TAU) }));
  const env = (t) => { let e = sm(t0, t0 + 1.4, t) * (1 - sm(t1 - 2.5, t1, t)); if (o.pulses) { let m = o.floor ?? 0.25; for (const [a, b, k] of o.pulses) m = Math.max(m, k * sm(a - 0.8, a + 0.6, t) * (1 - sm(b - 0.8, b + 0.4, t))); e *= m; } return e; };
  return { env, ug: (t) => { const e = env(t); if (e <= 0) return 0; let s = 0; for (const c of comps) s += c.b * Math.sin(TAU * c.f * t + c.p); return e * s; }, ag: (t) => { const e = env(t); if (e <= 0) return 0; let s = 0; for (const c of comps) s -= c.b * Math.pow(TAU * c.f, 2) * Math.sin(TAU * c.f * t + c.p); return e * s; } }; };
 // Oscilador de 1 grado de libertad bajo aceleración de base: ü + 2ζωu̇ + ω²u = −ag(t). Integración de Newmark (aceleración media), determinista.
 // Devuelve u(t) (desplazamiento relativo) interpolado y su máximo. Tn = periodo (s), zeta = amortiguamiento.
 P.sdof = (ag, Tn, zeta, tA, tB, dt = 1 / 240) => { const w = TAU / Tn, n = Math.ceil((tB - tA) / dt) + 1, U = new Float32Array(n); let u = 0, v = 0, a = -ag(tA); const k = w * w, c = 2 * zeta * w, kh = k + 2 * c / dt + 4 / (dt * dt); let mx = 0;
  for (let i = 1; i < n; i++) { const t = tA + i * dt, p = -ag(t) + (4 / (dt * dt)) * u + (4 / dt) * v + a + c * ((2 / dt) * u + v); const un = p / kh, vn = (2 / dt) * (un - u) - v, an = (4 / (dt * dt)) * (un - u) - (4 / dt) * v - a; u = un; v = vn; a = an; U[i] = u; mx = Math.max(mx, Math.abs(u)); }
  const f = (t) => { const x = (t - tA) / dt; if (x <= 0) return 0; if (x >= n - 1) return U[n - 1]; const i = Math.floor(x), r = x - i; return U[i] * (1 - r) + U[i + 1] * r; }; f.max = mx; f.vel = (t) => (f(t + dt) - f(t - dt)) / (2 * dt); return f; };
 const SEC = { hor: '#A8B1B5', horD: '#68767D', horL: '#c3cbce', acero: '#596B77', aceroL: '#C4D0D5', caucho: '#30383C', disip: '#D9A35C', fuerza: '#FF674F', control: '#38C6D0', terreno: '#786A59', veg: '#425D50' };
 P.SEC = SEC;
 // Aislador elastomérico laminado (con núcleo de plomo opcional) en sección. (cx, cy) = centro; shear = desplazamiento de la placa superior respecto
 // de la inferior. Capas de caucho y láminas de acero que se deforman como un paralelogramo (sin separarse). o: { layers, lead, glow, bolts }
 P.isolatorDetail = (ctx, cx, cy, w, h, shear, t, o = {}) => { const n = o.layers ?? 6, pt = h * 0.14, core = h - 2 * pt, gl = o.glow || 0, x0 = cx - w / 2, yT = cy - h / 2, yB = cy + h / 2;
  ctx.save(); const quad = (pp, c) => { ctx.beginPath(); pp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
  // placa inferior (anclada a la subestructura) y superior (anclada al tablero), con pernos
  quad([[x0 - w * 0.08, yB], [x0 + w * 1.08, yB], [x0 + w * 1.08, yB - pt], [x0 - w * 0.08, yB - pt]], SEC.acero); quad([[x0 - w * 0.08 + shear, yT + pt], [x0 + w * 1.08 + shear, yT + pt], [x0 + w * 1.08 + shear, yT], [x0 - w * 0.08 + shear, yT]], SEC.acero);
  if (o.bolts !== false) { ctx.fillStyle = SEC.aceroL; for (const fx of [0.0, 1.0]) { ctx.fillRect(x0 + w * fx - w * 0.05, yB - pt * 0.5, w * 0.03, pt * 1.6); ctx.fillRect(x0 + w * fx - w * 0.05 + shear, yT - pt * 0.6, w * 0.03, pt * 1.6); } }
  // capas (caucho y láminas de acero) que se cortan lateralmente
  for (let i = 0; i < n; i++) { const u0 = i / n, u1 = (i + 1) / n, ya = yB - pt - core * u0, yb = yB - pt - core * u1, sa = shear * u0, sb = shear * u1; quad([[x0 + sa, ya], [x0 + w + sa, ya], [x0 + w + sb, yb], [x0 + sb, yb]], gl ? '#3c464b' : SEC.caucho); if (i > 0) { ctx.strokeStyle = SEC.aceroL; ctx.lineWidth = Math.max(1, h * 0.025); ctx.beginPath(); ctx.moveTo(x0 + sa + w * 0.04, ya); ctx.lineTo(x0 + w + sa - w * 0.04, ya); ctx.stroke(); } }
  // bordes del caucho ligeramente abombados
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = Math.max(1, h * 0.02); ctx.beginPath(); ctx.moveTo(x0, yB - pt); ctx.quadraticCurveTo(x0 - w * 0.04 + shear * 0.5, cy, x0 + shear, yT + pt); ctx.moveTo(x0 + w, yB - pt); ctx.quadraticCurveTo(x0 + w + w * 0.04 + shear * 0.5, cy, x0 + w + shear, yT + pt); ctx.stroke();
  if (o.lead) { const lw = w * 0.16; quad([[cx - lw / 2, yB - pt], [cx + lw / 2, yB - pt], [cx + lw / 2 + shear, yT + pt], [cx - lw / 2 + shear, yT + pt]], o.leadGlow ? '#9aa3a8' : '#7d868c'); }
  if (gl) { ctx.strokeStyle = `rgba(56,198,208,${gl})`; ctx.lineWidth = Math.max(2, h * 0.05); ctx.beginPath(); ctx.moveTo(x0 - w * 0.1, yB + 2); ctx.lineTo(x0 + w * 1.1, yB + 2); ctx.lineTo(x0 + w * 1.1 + shear, yT - 2); ctx.lineTo(x0 - w * 0.1 + shear, yT - 2); ctx.closePath(); ctx.stroke(); }
  ctx.restore(); return { top: [cx + shear, yT], bottom: [cx, yB], rubber: [x0 + w * 0.82 + shear * 0.5, cy], shim: [x0 + w * 0.2 + shear * 0.45, yB - pt - core * 0.5], lead: [cx + shear * 0.5, cy] }; };
 // Disipador viscoso entre dos anclajes a (cuerpo) y b (vástago). o: { cut (0..1 corte), heat (0..1), vel (signo/magnitud de velocidad relativa), r }
 P.damperDetail = (ctx, a, b, t, o = {}) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ang = Math.atan2(dy, dx), r = o.r ?? L * 0.09, cut = o.cut || 0, heat = cl(o.heat || 0), body = o.body ?? L * 0.6, rodL = o.rod ?? L * 0.55, pist = cl(L - rodL, r * 0.8, body + r * 0.2);
  ctx.save(); ctx.translate(a[0], a[1]); ctx.rotate(ang);
  const clevis = (x) => { ctx.fillStyle = SEC.acero; ctx.fillRect(x - r * 0.5, -r * 0.9, r, r * 1.8); ctx.fillStyle = SEC.aceroL; ctx.beginPath(); ctx.arc(x, 0, r * 0.32, 0, TAU); ctx.fill(); };
  clevis(0); clevis(L);
  // vástago
  ctx.fillStyle = SEC.aceroL; ctx.fillRect(pist, -r * 0.22, L - pist - r * 0.4, r * 0.44);
  // cuerpo (cilindro) con brillo; en corte se ve el fluido, la cabeza del pistón y los orificios
  const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, '#7e909b'); g.addColorStop(0.35, '#b9c6cc'); g.addColorStop(1, '#4a5964'); ctx.fillStyle = g; ctx.fillRect(r * 0.4, -r, body, r * 2);
  if (cut > 0) { ctx.save(); ctx.globalAlpha *= cut; const fg = ctx.createLinearGradient(r * 0.5, 0, r * 0.4 + body, 0); const hc = `rgba(${Math.round(217 + 38 * heat)},${Math.round(163 - 60 * heat)},${Math.round(92 - 50 * heat)},0.95)`; fg.addColorStop(0, hc); fg.addColorStop(1, `rgba(217,163,92,0.95)`); ctx.fillStyle = fg; ctx.fillRect(r * 0.55, -r * 0.78, body - r * 0.3, r * 1.56);
   const px = pist; ctx.fillStyle = SEC.aceroL; ctx.fillRect(px - r * 0.18, -r * 0.78, r * 0.36, r * 1.56); ctx.fillStyle = 'rgba(20,24,28,0.85)'; for (const oy of [-0.45, 0, 0.45]) ctx.fillRect(px - r * 0.18, oy * r - r * 0.06, r * 0.36, r * 0.12);
   const v = o.vel || 0; if (Math.abs(v) > 0.05) { ctx.strokeStyle = 'rgba(255,240,210,0.8)'; ctx.lineWidth = Math.max(1, r * 0.06); for (const oy of [-0.45, 0, 0.45]) { const ph = (t * 3) % 1; for (let k = 0; k < 2; k++) { const x0 = px - Math.sign(v) * r * (0.3 + (ph + k * 0.5) % 1 * 0.9); ctx.beginPath(); ctx.moveTo(x0, oy * r); ctx.lineTo(x0 - Math.sign(v) * r * 0.25, oy * r); ctx.stroke(); } } }
   if (heat > 0.05) P.glow(ctx, pist, 0, r * 2.4, '255,120,60', 0.35 * heat); ctx.restore(); }
  ctx.strokeStyle = 'rgba(20,24,28,0.6)'; ctx.lineWidth = Math.max(1, r * 0.06); ctx.strokeRect(r * 0.4, -r, body, r * 2);
  ctx.restore(); const P2 = (lx, ly) => [a[0] + Math.cos(ang) * lx - Math.sin(ang) * ly, a[1] + Math.sin(ang) * lx + Math.cos(ang) * ly]; return { body: P2(r * 0.4 + body * 0.3, 0), piston: P2(pist, 0), rod: P2((pist + L) / 2, 0), a, b }; };
 // Junta de dilatación de peines (alzado lateral): dos bordes de tablero con dientes de acero que se entrecruzan; gap = separación actual.
 P.jointDetail = (ctx, x, y, w, h, gap, t, o = {}) => { ctx.save(); const tw = h * 0.5, n = 5;
  ctx.fillStyle = SEC.hor; ctx.fillRect(x - w, y, w - gap / 2, h); ctx.fillRect(x + gap / 2, y, w - gap / 2, h); ctx.fillStyle = SEC.horD; ctx.fillRect(x - w, y + h * 0.8, w - gap / 2, h * 0.2); ctx.fillRect(x + gap / 2, y + h * 0.8, w - gap / 2, h * 0.2);
  for (let i = 0; i < n; i++) { const yy = y - h * 0.02 + i * 0; ctx.fillStyle = i % 2 ? SEC.acero : SEC.aceroL; } ctx.fillStyle = SEC.aceroL; ctx.fillRect(x - gap / 2 - tw * 0.1, y - h * 0.12, tw * 1.6 + gap * 0.5, h * 0.12); ctx.fillStyle = SEC.acero; ctx.fillRect(x + gap / 2 - tw * 1.5 - gap * 0.5 + tw * 0.1, y - h * 0.24, tw * 1.5 + gap * 0.5, h * 0.12);
  ctx.fillStyle = '#20262a'; ctx.beginPath(); ctx.moveTo(x - gap / 2, y + h * 0.2); ctx.quadraticCurveTo(x, y + h * 0.2 + gap * 0.3 + h * 0.1, x + gap / 2, y + h * 0.2); ctx.lineTo(x + gap / 2, y + h * 0.3); ctx.quadraticCurveTo(x, y + h * 0.3 + gap * 0.3 + h * 0.1, x - gap / 2, y + h * 0.3); ctx.closePath(); ctx.fill();
  if (o.glow) { ctx.strokeStyle = `rgba(56,198,208,${o.glow})`; ctx.lineWidth = 4; ctx.strokeRect(x - gap / 2 - 6, y - h * 0.3, gap + 12, h * 1.4); }
  ctx.restore(); return { gap: [x, y + h * 0.5] }; };
 // Flecha horizontal (fuerza o desplazamiento) anclada en (x, y); len con signo
 P.hArrow = (ctx, x, y, len, c, w = 14) => { if (Math.abs(len) < 3) return; const d = Math.sign(len), L = Math.abs(len), hl = Math.min(L * 0.5, w * 2); ctx.save(); ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.moveTo(x, y - w / 2); ctx.lineTo(x + d * (L - hl), y - w / 2); ctx.lineTo(x + d * (L - hl), y - w); ctx.lineTo(x + d * L, y); ctx.lineTo(x + d * (L - hl), y + w); ctx.lineTo(x + d * (L - hl), y + w / 2); ctx.lineTo(x, y + w / 2); ctx.closePath(); ctx.fill(); ctx.restore(); };
 // Coche estilizado de perfil (escala del puente)
 P.car = (ctx, x, y, s, c = '#c94f4f') => { ctx.save(); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - s * 0.5, y - s * 0.12); ctx.lineTo(x - s * 0.48, y - s * 0.3); ctx.lineTo(x - s * 0.2, y - s * 0.32); ctx.lineTo(x - s * 0.08, y - s * 0.5); ctx.lineTo(x + s * 0.26, y - s * 0.5); ctx.lineTo(x + s * 0.42, y - s * 0.3); ctx.lineTo(x + s * 0.5, y - s * 0.26); ctx.lineTo(x + s * 0.5, y - s * 0.12); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(200,225,235,0.85)'; ctx.fillRect(x - s * 0.04, y - s * 0.46, s * 0.12, s * 0.13); ctx.fillRect(x + s * 0.12, y - s * 0.46, s * 0.12, s * 0.13); ctx.fillStyle = '#1b1f22'; for (const fx of [-0.3, 0.3]) { ctx.beginPath(); ctx.arc(x + fx * s, y - s * 0.1, s * 0.11, 0, TAU); ctx.fill(); } ctx.restore(); };
 // PUENTE con mecanismos integrados (alzado 2,5D en proyección oblicua). Geometría en coordenadas de mundo; los mecanismos se dibujan siempre
 // con detalle (se ven al acercar la cámara). o: { x0, x1, deckTop, deckH, piers:[x…], ground(x), D, mode ('aislado'|'rigido'),
 // ug (terreno), up (deriva de las pilas), ud (tablero, absoluto), stroke (disipador), heat, xray (0..1), section (0..1 corte del terreno),
 // forces (0..1), demand (0..1 zonas de alta demanda), glow:{bearings, dampers, joints, piers, deck}, cars:[{x, c}], sunLeft }
 P.bridge = (ctx, t, o = {}) => {
  const x0 = o.x0 ?? 100, x1 = o.x1 ?? 2300, top = o.deckTop ?? 1000, dh = o.deckH ?? 64, D = o.D || [44, -30], piers = o.piers || [650, 1200, 1750], SEAT = 190, GW = 26, plat = o.plateau ?? (top + 6), deep = o.valley ?? 520, gnd = o.ground || ((x) => { const d = Math.min(x - (x0 + SEAT), (x1 - SEAT) - x); if (d <= 0) return plat; const u = Math.min(1, d / 720), toeY = plat + 236, base = plat + deep * u * u * (3 - 2 * u); return d < 40 ? lerp(plat, toeY, d / 40) : Math.max(base, toeY); });
  const ug = o.ug || 0, up = o.up || 0, ud = o.ud ?? 0, iso = (o.mode || 'aislado') === 'aislado', gl = o.glow || {}, xr = o.xray || 0, bh = o.bearH ?? 34, bw = 44, capH = 34, capW = 120, colW = 62, gap0 = 26, wide = Math.abs(D[0]) > 70;
  const quad = (pp, c) => { ctx.beginPath(); pp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
  const deckBot = top + dh, ds = dh * 0.36, bearTop = deckBot, bearBot = bearTop + (iso ? bh : 14), capTop = bearBot, capBot = capTop + capH;
  const out = { piers: [], bearings: [], dampers: [], joints: [] };
  const sec = o.section || 0, XA = x0 - 1400, XB = x1 + 1400, rx = (x0 + x1) / 2;
  const prof = (k, xa = XA, xb = XB) => { const pts = []; for (let x = xa; x <= xb; x += 20) pts.push([x + ug + D[0] * k, gnd(x) + D[1] * k]); return pts; };
  const under = (pts, c) => { ctx.beginPath(); ctx.moveTo(pts[0][0], 3200); pts.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(pts[pts.length - 1][0], 3200); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
  ctx.save();
  // terreno con profundidad: franjas del fondo del valle de lejos a cerca (el valle es un volumen, no una silueta)
  const KF = o.depth ?? 4; for (let k = KF; k >= 0; k -= 0.5) { const f = k / KF; under(prof(k), `rgb(${Math.round(lerp(124, 92, f))},${Math.round(lerp(110, 92, f))},${Math.round(lerp(90, 84, f))})`); ctx.strokeStyle = `rgba(66,93,80,${0.55 - f * 0.3})`; ctx.lineWidth = 10; ctx.beginPath(); prof(k).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] - 4) : ctx.moveTo(p[0], p[1] - 4))); ctx.stroke(); }
  // río que cruza el valle en profundidad
  if (o.river !== false) { const yb = gnd(rx) + 3, pr = (k, s) => [rx + s * 120 + ug + D[0] * k, yb + D[1] * k]; quad([pr(-1.4, -1), pr(-1.4, 1), pr(KF, 1), pr(KF, -1)], '#3c6f86'); ctx.strokeStyle = 'rgba(200,230,240,0.25)'; ctx.lineWidth = 3; for (let k = -1; k < KF; k += 0.7) { const a = pr(k + 0.1, -0.5), b = pr(k + 0.35, 0.3); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  // corte del terreno (estratos) en la cara delantera cuando se pide sección
  if (sec > 0) { ctx.save(); ctx.globalAlpha *= sec; const p0 = prof(0); under(p0, '#6b5d4c'); ctx.beginPath(); ctx.moveTo(p0[0][0], 3200); p0.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(p0[p0.length - 1][0], 3200); ctx.closePath(); ctx.clip(); for (let k = 0; k < 7; k++) { ctx.strokeStyle = 'rgba(30,24,18,0.4)'; ctx.lineWidth = 3; ctx.beginPath(); for (let x = XA; x <= XB; x += 20) { const y = Math.max(gnd(x) + 40, plat + 160 + k * 110 + Math.sin(x * 0.004 + k) * 16); x === XA ? ctx.moveTo(x + ug, y) : ctx.lineTo(x + ug, y); } ctx.stroke(); } ctx.restore(); }
  // vegetación detrás del puente (apoyada en el terreno a su profundidad)
  if (o.trees !== false) { const R = H.rng(o.treeSeed || 11); for (let i = 0; i < 70; i++) { const x = R.range(XA + 100, XB - 100), k = R.range(1.4, KF), hh = R.range(45, 90); if (Math.abs(x - rx) < 200 || (k < 1.9 && piers.some((p) => Math.abs(x - p) < 90))) continue; const xx = x + ug + D[0] * k, y = gnd(x) + D[1] * k + 3; ctx.fillStyle = '#3a2f26'; ctx.fillRect(xx - 3, y - hh * 0.32, 6, hh * 0.32 + 2); ctx.fillStyle = R() < 0.5 ? '#425D50' : '#38524a'; ctx.beginPath(); ctx.moveTo(xx - hh * 0.28, y - hh * 0.28); ctx.lineTo(xx, y - hh); ctx.lineTo(xx + hh * 0.28, y - hh * 0.28); ctx.closePath(); ctx.fill(); } }
  // sombra del tablero sobre el fondo del valle (luz alta desde la izquierda)
  { const rel0 = cl(ud - ug, -gap0 + 3, gap0 - 3), a = x0 + SEAT, b = x1 - SEAT; ctx.save(); ctx.fillStyle = 'rgba(12,23,32,0.28)'; ctx.beginPath(); let first = true; for (let x = a; x <= b; x += 20) { const p = [x + rel0 + ug + 70 + D[0] * 0.1, gnd(x) + D[1] * 0.1]; first ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); first = false; } for (let x = b; x >= a; x -= 20) ctx.lineTo(x + rel0 + ug + 70 + D[0] * 1.05, gnd(x) + D[1] * 1.05); ctx.closePath(); ctx.fill(); ctx.restore(); }
  // estribos (fijos al terreno): muro frontal encajado en el talud, asiento, muro de guarda y losa de acceso sobre el terraplén
  const abut = (xa, dir) => { const xb = xa + ug, seatEnd = xb + dir * SEAT, yS = capTop, toe = Math.max(gnd(xa + dir * SEAT) + 50, yS + 150), back = xb - dir * 30, xs = [back, seatEnd].sort((p, q) => p - q), gx = dir > 0 ? xb - GW : xb;
   quad([[gx, top], [seatEnd, top], [seatEnd, yS], [gx, yS]], '#4a4136');
   quad([[xs[0], toe], [xs[1], toe], [xs[1], yS], [xs[0], yS]], SEC.hor); const fx = dir > 0 ? xs[1] : xs[0]; if (dir > 0) quad([[fx, yS], [fx + D[0], yS + D[1]], [fx + D[0], toe + D[1]], [fx, toe]], SEC.horD); quad([[xs[0], yS], [xs[1], yS], [xs[1] + D[0], yS + D[1]], [xs[0] + D[0], yS + D[1]]], SEC.horL);
   // muro de guarda y aleta (relleno contenido)
   quad([[gx, yS], [gx + GW, yS], [gx + GW, top + 4], [gx, top + 4]], SEC.horL); if (dir > 0) quad([[gx + GW, top + 4], [gx + GW + D[0], top + 4 + D[1]], [gx + GW + D[0], yS + D[1]], [gx + GW, yS]], SEC.horD);
   ctx.strokeStyle = 'rgba(30,36,40,0.35)'; ctx.lineWidth = 2; for (let y = yS + 30; y < toe; y += 34) { ctx.beginPath(); ctx.moveTo(xs[0], y); ctx.lineTo(xs[1], y); ctx.stroke(); }
   // losa de acceso con pretil
   const ra = dir > 0 ? xb - 1400 : xb, rb = dir > 0 ? xb : xb + 1400; quad([[ra, top], [rb, top], [rb + D[0], top + D[1]], [ra + D[0], top + D[1]]], '#4a5257'); quad([[ra, top], [rb, top], [rb, top + 18], [ra, top + 18]], SEC.horD);
   ctx.strokeStyle = 'rgba(240,240,220,0.7)'; ctx.setLineDash([26, 22]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ra + D[0] * 0.5, top + D[1] * 0.5); ctx.lineTo(rb + D[0] * 0.5, top + D[1] * 0.5); ctx.stroke(); ctx.setLineDash([]);
   rail(ra, rb, 0); rail(ra, rb, 1);
   return { seat: yS, guard: dir > 0 ? gx + GW : gx, xb, dir, seatEnd }; };
  // pretil de hormigón + baranda metálica a la profundidad u (0 = borde delantero, 1 = trasero)
  function rail(a, b, u) { const ox = D[0] * u, oy = D[1] * u; quad([[a + ox, top + oy], [b + ox, top + oy], [b + ox, top + oy - 12], [a + ox, top + oy - 12]], u ? '#8f999e' : SEC.horL); ctx.strokeStyle = SEC.aceroL; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a + ox, top + oy - 26); ctx.lineTo(b + ox, top + oy - 26); ctx.stroke(); ctx.lineWidth = 2; for (let x = a; x <= b; x += 46) { ctx.beginPath(); ctx.moveTo(x + ox, top + oy - 12); ctx.lineTo(x + ox, top + oy - 26); ctx.stroke(); } }
  const A0 = abut(x0, 1), A1 = abut(x1, -1);
  // cimentaciones y pilas (la base sigue al terreno; la cabeza se desplaza up; la pila se flexiona como una ménsula)
  piers.forEach((px) => { const gb = gnd(px), bx = px + ug, tx = px + ug + up * (0.55 + 0.45 * cl((gb - capBot) / Math.max(1, gnd(rx) - capBot)));
   if (sec > 0) { ctx.save(); ctx.globalAlpha *= sec; ctx.fillStyle = SEC.horD; for (const ofx of [-48, -16, 16, 48]) ctx.fillRect(bx + ofx - 7, gb + 36, 14, 280); ctx.restore(); }
   const fb = Math.max(gb, gnd(px - 80), gnd(px + 80)) + 40, fd = 0.85; quad([[bx - 80, gb - 4], [bx + 80, gb - 4], [bx + 80 + D[0] * fd, gb - 4 + D[1] * fd], [bx - 80 + D[0] * fd, gb - 4 + D[1] * fd]], '#8a959a'); quad([[bx - 80, fb], [bx + 80, fb], [bx + 80, gb - 4], [bx - 80, gb - 4]], SEC.horD); quad([[bx + 80, gb - 4], [bx + 80 + D[0] * fd, gb - 4 + D[1] * fd], [bx + 80 + D[0] * fd, fb + D[1] * fd], [bx + 80, fb]], '#55626a');
   const N = 12, cd = 0.45, col = (s) => { const pts = []; for (let k = 0; k <= N; k++) { const u = k / N, y = lerp(gb - 4, capBot, u), dxu = (tx - bx) * (3 * u * u - 2 * u * u * u); pts.push([bx + dxu + s * colW / 2 + D[0] * 0.2, y + D[1] * 0.2]); } return pts; };
   const L = col(-1), Rr = col(1); quad([...Rr, ...Rr.slice().reverse().map(([x, y]) => [x + D[0] * cd, y + D[1] * cd])], '#7b878d'); const cg = ctx.createLinearGradient(bx - colW / 2, 0, bx + colW / 2, 0); cg.addColorStop(0, SEC.horD); cg.addColorStop(0.5, SEC.hor); cg.addColorStop(1, '#929da2'); quad([...L, ...Rr.slice().reverse()], cg);
   if (gl.piers) { ctx.strokeStyle = `rgba(255,212,71,${gl.piers})`; ctx.lineWidth = 4; ctx.beginPath(); L.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); Rr.slice().reverse().forEach((p) => ctx.lineTo(p[0], p[1])); ctx.closePath(); ctx.stroke(); }
   const dm = o.demand || 0; if (dm > 0) { const qb = [bx + D[0] * 0.2, gb - 30 + D[1] * 0.2]; P.glow(ctx, qb[0], qb[1], 90, '255,103,79', 0.55 * dm); ctx.strokeStyle = `rgba(255,103,79,${0.9 * dm})`; ctx.lineWidth = 2.5; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(qb[0] - colW / 2 + 6 + k * 14, gb - 8 + D[1] * 0.2); ctx.lineTo(qb[0] - colW / 2 + 12 + k * 14, gb - 30 - (k % 2) * 10 + D[1] * 0.2); ctx.stroke(); } }
   // cabezal: ocupa toda la anchura del tablero
   quad([[tx - capW / 2, capBot], [tx + capW / 2, capBot], [tx + capW / 2, capTop], [tx - capW / 2, capTop]], SEC.hor); quad([[tx + capW / 2, capTop], [tx + capW / 2 + D[0], capTop + D[1]], [tx + capW / 2 + D[0], capBot + D[1]], [tx + capW / 2, capBot]], SEC.horD); quad([[tx - capW / 2, capTop], [tx + capW / 2, capTop], [tx + capW / 2 + D[0], capTop + D[1]], [tx - capW / 2 + D[0], capTop + D[1]]], SEC.horL);
   // apoyos: una fila delantera y, en vistas de tres cuartos, una trasera (bajo cada viga)
   let bpt = null; const rows = wide ? [0.72, 0.18] : [0.12]; for (const u of rows) for (const ofx of [-30, 30]) { const cx = tx + ofx + D[0] * u, cyB = capTop + D[1] * u; if (iso) { const p = P.isolatorDetail(ctx, cx, cyB - bh / 2, bw * 0.95, bh, cl(ud - (tx - px), -bh * 0.5, bh * 0.5), t, { glow: gl.bearings, lead: true, layers: 5 }); if (ofx > 0 && u === rows[rows.length - 1]) bpt = p; } else { quad([[cx - 16, cyB], [cx + 16, cyB], [cx + 16, cyB - 14], [cx - 16, cyB - 14]], SEC.acero); quad([[cx - 10, cyB - 14], [cx + 10, cyB - 14], [cx + 10, cyB - 22], [cx - 10, cyB - 22]], SEC.aceroL); if (ofx > 0 && u === rows[rows.length - 1]) bpt = { top: [cx, cyB - 14], bottom: [cx, cyB] }; } }
   out.piers.push({ base: [bx + D[0] * 0.2, gb + D[1] * 0.2], top: [tx, capTop], cap: [tx, capBot] }); out.bearings.push(bpt);
   const fo = o.forces || 0; if (fo > 0) { const s = Math.sign(tx - bx || 1), mag = Math.min(1, Math.abs(tx - bx) / 14); ctx.save(); ctx.globalAlpha *= fo; P.hArrow(ctx, bx - s * 140, gb - 70, s * (60 + 90 * mag), SEC.fuerza, 18); P.hArrow(ctx, tx - s * 120, capBot + 34, s * (36 + 70 * mag), SEC.fuerza, 14); ctx.restore(); }
  });
  // tablero: losa de hormigón sobre vigas longitudinales (rigidizadores y diafragmas), que se desplaza ud
  const rel = cl(ud - ug, -gap0 + 3, gap0 - 3), dl = A0.guard + gap0 + rel, dr = A1.guard - gap0 + rel;
  for (const A of [A0, A1]) for (const u of (wide ? [0.7, 0.25] : [0.3])) { const cx = (A.dir > 0 ? A.guard + 150 : A.guard - 150) + D[0] * u, cyB = capTop + D[1] * u; if (iso) P.isolatorDetail(ctx, cx, cyB - bh / 2, bw * 0.95, bh, cl(ud - ug, -bh * 0.5, bh * 0.5), t, { glow: gl.bearings, lead: true, layers: 5 }); else quad([[cx - 16, cyB], [cx + 16, cyB], [cx + 16, cyB - 14], [cx - 16, cyB - 14]], SEC.acero); }
  ctx.save(); ctx.globalAlpha *= 1 - xr * 0.65;
  // vigas (retranqueadas respecto al borde de la losa) y vuelo de la losa
  const gi = 0.1, gx0 = dl + D[0] * gi, gx1 = dr + D[0] * gi, gy0 = top + ds + D[1] * gi, gy1 = deckBot + D[1] * gi; quad([[gx0, gy0], [gx1, gy0], [gx1, gy1], [gx0, gy1]], '#6c7a82'); quad([[gx1, gy0], [gx1 + D[0] * 0.8, gy0 + D[1] * 0.8], [gx1 + D[0] * 0.8, gy1 + D[1] * 0.8], [gx1, gy1]], '#56636a');
  ctx.strokeStyle = 'rgba(196,208,213,0.45)'; ctx.lineWidth = 2; for (let x = gx0 + 26; x < gx1; x += 52) { ctx.beginPath(); ctx.moveTo(x, gy0 + 3); ctx.lineTo(x, gy1 - 4); ctx.stroke(); } ctx.fillStyle = '#56636a'; ctx.fillRect(gx0, gy1 - 6, gx1 - gx0, 6);
  for (const px of piers) { const xx = px + ud + D[0] * gi; ctx.fillStyle = '#4d5960'; ctx.fillRect(xx - 6, gy0, 12, gy1 - gy0); }
  // calzada (cara superior) con líneas de carril
  quad([[dl, top], [dr, top], [dr + D[0], top + D[1]], [dl + D[0], top + D[1]]], '#4a5257');
  ctx.strokeStyle = 'rgba(240,240,220,0.7)'; ctx.lineWidth = 3; ctx.setLineDash([26, 22]); ctx.beginPath(); ctx.moveTo(dl + D[0] * 0.5, top + D[1] * 0.5); ctx.lineTo(dr + D[0] * 0.5, top + D[1] * 0.5); ctx.stroke(); ctx.setLineDash([]); if (wide) { ctx.strokeStyle = 'rgba(240,240,220,0.45)'; ctx.lineWidth = 2; for (const u of [0.1, 0.9]) { ctx.beginPath(); ctx.moveTo(dl + D[0] * u, top + D[1] * u); ctx.lineTo(dr + D[0] * u, top + D[1] * u); ctx.stroke(); } }
  for (const c of o.cars || []) { const span = dr - dl - 80, cx = dl + ((c.x % span) + span) % span + 40; P.car(ctx, cx + D[0] * (c.lane ?? 0.35), top + D[1] * (c.lane ?? 0.35) + 1, 46, c.c); }
  // canto de la losa (cara frontal) con juntas de dovelas
  const dg = ctx.createLinearGradient(0, top, 0, top + ds); dg.addColorStop(0, SEC.horL); dg.addColorStop(1, SEC.hor); quad([[dl, top], [dr, top], [dr, top + ds], [dl, top + ds]], dg); ctx.fillStyle = 'rgba(12,23,32,0.35)'; ctx.fillRect(dl, top + ds, dr - dl, 4);
  quad([[dr, top], [dr + D[0], top + D[1]], [dr + D[0], top + ds + D[1]], [dr, top + ds]], SEC.horD);
  ctx.strokeStyle = 'rgba(30,36,40,0.35)'; ctx.lineWidth = 2; for (let x = dl + 220; x < dr; x += 220) { ctx.beginPath(); ctx.moveTo(x, top + 2); ctx.lineTo(x, top + ds - 2); ctx.stroke(); }
  rail(dl, dr, 1); rail(dl, dr, 0);
  if (gl.deck) { ctx.strokeStyle = `rgba(255,212,71,${gl.deck})`; ctx.lineWidth = 4; ctx.strokeRect(dl, top - 26, dr - dl, dh + 26); }
  ctx.restore();
  if (xr > 0) { ctx.save(); ctx.globalAlpha *= xr; ctx.strokeStyle = SEC.aceroL; ctx.lineWidth = 3; ctx.strokeRect(dl, top, dr - dl, dh); ctx.strokeStyle = 'rgba(196,208,213,0.6)'; for (let x = dl + 55; x < dr; x += 110) { ctx.beginPath(); ctx.moveTo(x, top + ds); ctx.lineTo(x + 50, deckBot - 4); ctx.stroke(); } ctx.restore(); }
  // juntas de dilatación: peines sobre la calzada; bajo la losa se ve el muro de guarda (no un agujero)
  const jL = dl - A0.guard, jR = A1.guard - dr; out.joints.push({ x: (dl + A0.guard) / 2, y: top + 6, gap: jL }, { x: (dr + A1.guard) / 2, y: top + 6, gap: jR });
  for (const [j, ga, gb2] of [[out.joints[0], A0.guard, dl], [out.joints[1], dr, A1.guard]]) { const n = 8, Lt = gap0 * 0.85, sk = (xa, xb, u0, u1, c) => quad([[xa + D[0] * u0, top + D[1] * u0], [xb + D[0] * u0, top + D[1] * u0], [xb + D[0] * u1, top + D[1] * u1], [xa + D[0] * u1, top + D[1] * u1]], c);
   sk(ga, gb2, 0, 1, '#2a3034'); sk(ga - 14, ga, 0, 1, '#7d8a91'); sk(gb2, gb2 + 14, 0, 1, '#7d8a91'); for (let k = 0; k < 2 * n; k++) { const u0 = k / (2 * n) + 0.01, u1 = (k + 1) / (2 * n) - 0.01; if (k % 2) sk(ga - 6, ga + Lt, u0, u1, SEC.aceroL); else sk(gb2 - Lt, gb2 + 6, u0, u1, '#a9b8bf'); }
   ctx.fillStyle = '#56626a'; ctx.fillRect(ga, top, gb2 - ga, ds); ctx.strokeStyle = '#20262a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ga, top + 6); ctx.quadraticCurveTo((ga + gb2) / 2, top + 6 + Math.max(2, (gb2 - ga) * 0.25), gb2, top + 6); ctx.stroke();
   if (gl.joints) { ctx.strokeStyle = `rgba(56,198,208,${gl.joints})`; ctx.lineWidth = 3; ctx.strokeRect(ga - 16, top + D[1] - 6, gb2 - ga + 32 + D[0], ds - D[1] + 12); } }
  // disipadores viscosos en los estribos: del asiento del estribo (fijo) a una ménsula bajo el extremo del tablero
  for (const [A, dir] of [[A0, 1], [A1, -1]]) { const ya = capTop - bh * 0.5, ax = A.guard + dir * 4, bx2 = (dir > 0 ? dl : dr) + dir * 86, L0 = 82 + gap0;
   ctx.fillStyle = SEC.acero; ctx.fillRect(ax - (dir > 0 ? 10 : 0), ya - 12, 10, 24); ctx.fillRect(bx2 - 7, deckBot - 2, 14, ya - deckBot + 12);
   const p = P.damperDetail(ctx, [ax, ya], [bx2, ya], t, { cut: o.cut || 0, heat: o.heat || 0, vel: (o.vel || 0) * dir, body: L0 * 0.62, rod: L0 * 0.58, r: bh * 0.3 }); if (gl.dampers) { ctx.strokeStyle = `rgba(217,163,92,${gl.dampers})`; ctx.lineWidth = 3; ctx.strokeRect(Math.min(ax, bx2) - 8, ya - 16, Math.abs(bx2 - ax) + 16, 32); } out.dampers.push(p); }
  // terreno cercano (delante de las zapatas): las cimentaciones quedan enterradas, nunca flotando
  if (sec < 1) { ctx.save(); ctx.globalAlpha *= 1 - sec; const a = x0 + SEAT + 4, b = x1 - SEAT - 4, p = [...prof(0, a, b)]; ctx.fillStyle = '#5c5246'; ctx.beginPath(); ctx.moveTo(p[0][0], 3200); p.forEach((q) => ctx.lineTo(q[0], q[1])); ctx.lineTo(p[p.length - 1][0], 3200); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(66,93,80,0.8)'; ctx.lineWidth = 12; ctx.beginPath(); p.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1] - 3) : ctx.moveTo(q[0], q[1] - 3))); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  return out;
 };
 // ---------------- v1.15.1 · primeros planos mecánicos (misma pieza que en el puente, a escala de detalle) ----------------
 // Aislador elastomérico con núcleo de plomo (LRB) en 2,5D con su contexto: viga del tablero arriba y cabezal de pila abajo.
 // (cx, cy) centro del cuerpo; s = diámetro. o: { base (desplazamiento de la placa inferior = subestructura), top (placa superior = tablero),
 //   cut 0..1 (corte axial que muestra capas y núcleo), n (capas de caucho), glow, ctxDeck, ctxCap }
 // El núcleo de plomo se deforma por cortante con las capas (paralelogramo); no es un pistón.
 P.isolatorHD = (ctx, cx, cy, s, t, o = {}) => {
  const r = s / 2, ry = r * 0.26, Hh = s * 0.62, pt = s * 0.075, pw = s * 1.32, n = o.n ?? 8, b0 = o.base || 0, b1 = o.top ?? b0, cut = o.cut || 0, gl = o.glow || 0;
  const yB = cy + Hh / 2, yT = cy - Hh / 2, xs = (u) => cx + lerp(b0, b1, u), ys = (u) => lerp(yB, yT, u);
  const quad = (pp, c) => { ctx.beginPath(); pp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
  // caja 2,5D (cara frontal + cara superior en perspectiva leve)
  const box = (x, y, w, h, dep, cF, cT) => { const k = dep * 0.18; quad([[x - w / 2, y], [x + w / 2, y], [x + w / 2 - k, y - dep], [x - w / 2 + k, y - dep]], cT); quad([[x - w / 2, y], [x + w / 2, y], [x + w / 2, y + h], [x - w / 2, y + h]], cF); };
  ctx.save();
  // cabezal de pila (contexto, se mueve con la subestructura)
  if (o.ctxCap !== false) { const xc = cx + b0, yc = yB + pt; box(xc, yc, s * 3.4, s * 1.4, ry * 2.6, (() => { const g = ctx.createLinearGradient(0, yc, 0, yc + s * 1.4); g.addColorStop(0, SEC.hor); g.addColorStop(1, SEC.horD); return g; })(), SEC.horL); ctx.strokeStyle = 'rgba(30,36,40,0.25)'; ctx.lineWidth = 2; for (let y = yc + s * 0.35; y < yc + s * 1.4; y += s * 0.35) { ctx.beginPath(); ctx.moveTo(xc - s * 1.7, y); ctx.lineTo(xc + s * 1.7, y); ctx.stroke(); } }
  // placa inferior anclada al cabezal (pernos de anclaje)
  const plate = (x, y, top) => { box(x, y - pt, pw, pt, ry * 2.1, SEC.acero, '#7d8f9a'); ctx.fillStyle = SEC.aceroL; for (const fx of [-0.42, 0.42]) { const bx = x + pw * fx; ctx.fillRect(bx - s * 0.035, top ? y - pt - s * 0.03 : y - pt - s * 0.05, s * 0.07, s * 0.05); ctx.fillStyle = '#3d4a52'; ctx.fillRect(bx - s * 0.012, top ? y - pt - s * 0.09 : y - pt - s * 0.07, s * 0.024, s * 0.03); ctx.fillStyle = SEC.aceroL; } };
  plate(cx + b0, yB + pt, false);
  // anclajes embebidos (visibles en corte)
  if (cut > 0) { ctx.save(); ctx.globalAlpha *= cut; ctx.strokeStyle = '#3d4a52'; ctx.lineWidth = s * 0.03; for (const fx of [-0.42, 0.42]) { ctx.beginPath(); ctx.moveTo(cx + b0 + pw * fx, yB + pt); ctx.lineTo(cx + b0 + pw * fx, yB + pt + s * 0.5); ctx.stroke(); } ctx.restore(); }
  // cuerpo: capas de caucho y láminas de acero (bandas frontales de un cilindro que se corta lateralmente)
  const tr = 1 / (n + (n - 1) * 0.28), ts = tr * 0.28; let u = 0; const bands = [];
  for (let i = 0; i < n; i++) { bands.push([u, u + tr, 'r']); u += tr; if (i < n - 1) { bands.push([u, u + ts, 's']); u += ts; } }
  const band = (u0, u1, fill) => { const xa = xs(u0), xb = xs(u1), ya = ys(u0), yb = ys(u1); ctx.beginPath(); ctx.moveTo(xa - r, ya); ctx.ellipse(xa, ya, r, ry, 0, Math.PI, 0, true); ctx.lineTo(xb + r, yb); ctx.ellipse(xb, yb, r, ry, 0, 0, Math.PI, false); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
  for (const [u0, u1, k] of bands) { const g = ctx.createLinearGradient(xs(u0) - r, 0, xs(u0) + r, 0); if (k === 'r') { g.addColorStop(0, '#22292c'); g.addColorStop(0.45, gl ? '#4a565c' : '#3e484d'); g.addColorStop(1, '#1d2326'); } else { g.addColorStop(0, '#6f818c'); g.addColorStop(0.45, '#d5dfe3'); g.addColorStop(1, '#5d6d77'); } band(u0, u1, g); }
  // corte axial: capas en sección y núcleo de plomo central
  if (cut > 0) { ctx.save(); ctx.globalAlpha *= cut; const sx = (u, f) => xs(u) + r * f; for (const [u0, u1, k] of bands) quad([[sx(u0, -1), ys(u0)], [sx(u0, 1), ys(u0)], [sx(u1, 1), ys(u1)], [sx(u1, -1), ys(u1)]], k === 'r' ? '#363f44' : '#c4d0d5');
   ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1; for (const [u0, u1, k] of bands) if (k === 'r') for (let f = -0.9; f < 0.9; f += 0.16) { ctx.beginPath(); ctx.moveTo(sx(u0, f), ys(u0)); ctx.lineTo(sx(u1, f + 0.08), ys(u1)); ctx.stroke(); }
   const lw = 0.13; const lg = ctx.createLinearGradient(cx - r * lw, 0, cx + r * lw, 0); lg.addColorStop(0, '#7f878d'); lg.addColorStop(0.5, '#b2bac0'); lg.addColorStop(1, '#757d83'); quad([[sx(0, -lw), ys(0)], [sx(0, lw), ys(0)], [sx(1, lw), ys(1)], [sx(1, -lw), ys(1)]], lg);
   ctx.restore(); }
  // borde abombado del caucho
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = Math.max(1, s * 0.008); ctx.beginPath(); ctx.moveTo(xs(0) - r, ys(0)); ctx.quadraticCurveTo(xs(0.5) - r * 1.04, ys(0.5), xs(1) - r, ys(1)); ctx.moveTo(xs(0) + r, ys(0)); ctx.quadraticCurveTo(xs(0.5) + r * 1.04, ys(0.5), xs(1) + r, ys(1)); ctx.stroke();
  // placa superior unida al tablero
  plate(cx + b1, yT, true);
  // ala inferior de la viga del tablero + alma + rigidizador sobre el apoyo (contexto, se mueve con el tablero)
  if (o.ctxDeck !== false) { const xd = cx + b1, yf = yT - pt, wd = s * 3.4; box(xd, yf - s * 0.1, wd, s * 0.1, ry * 1.6, '#5d6b73', '#8696a0'); const wg = ctx.createLinearGradient(0, yf - s * 1.1, 0, yf - s * 0.1); wg.addColorStop(0, '#7d8b93'); wg.addColorStop(1, '#5f6d75'); ctx.fillStyle = wg; ctx.fillRect(xd - wd / 2, yf - s * 1.1, wd, s * 1.0); ctx.fillStyle = '#4d5960'; for (const fx of [-0.42, -0.3, 0.3, 0.42]) ctx.fillRect(xd + s * fx - s * 0.025, yf - s * 1.1, s * 0.05, s * 1.0); ctx.strokeStyle = 'rgba(196,208,213,0.35)'; ctx.lineWidth = 2; for (let x = xd - wd / 2 + s * 0.4; x < xd + wd / 2; x += s * 0.55) if (Math.abs(x - xd) > s * 0.5) { ctx.beginPath(); ctx.moveTo(x, yf - s * 1.08); ctx.lineTo(x, yf - s * 0.12); ctx.stroke(); } ctx.fillStyle = '#5d6b73'; ctx.fillRect(xd - wd / 2, yf - s * 1.2, wd, s * 0.1); box(xd, yf - s * 1.52, wd * 1.08, s * 0.32, ry * 1.6, SEC.hor, SEC.horL); }
  if (gl) { ctx.strokeStyle = `rgba(56,198,208,${gl})`; ctx.lineWidth = Math.max(3, s * 0.02); ctx.beginPath(); ctx.moveTo(xs(0) - r * 1.12, ys(0) + ry * 1.2); ctx.lineTo(xs(0) + r * 1.12, ys(0) + ry * 1.2); ctx.lineTo(xs(1) + r * 1.12, ys(1) - ry * 1.2); ctx.lineTo(xs(1) - r * 1.12, ys(1) - ry * 1.2); ctx.closePath(); ctx.stroke(); }
  ctx.restore();
  return { topPlate: [cx + b1 + pw * 0.3, yT - pt * 0.5], bottomPlate: [cx + b0 - pw * 0.3, yB + pt * 0.5], rubber: [xs(0.48) - r * 0.75, ys(0.48)], shim: [xs(0.62) + r * 0.6, ys(0.62)], lead: [xs(0.5), ys(0.5)], bolt: [cx + b0 + pw * 0.42, yB - s * 0.02], deck: [cx + b1 - s * 1.2, yT - pt - s * 0.7], cap: [cx + b0 - s * 1.3, yB + pt + s * 0.7] };
 };
 // Disipador viscoso en detalle: placa de anclaje atornillada al estribo, articulaciones (rótulas/pasadores), cilindro con dos cámaras,
 // pistón con orificios y vástago unido a una ménsula del tablero. (ax, ay) pasador fijo; bx = pasador móvil (misma altura). s = diámetro.
 // o: { cut 0..1, vel (−1..1, velocidad relativa), heat 0..1, force (0..1 resistencia), cyl, rod, wall, girder }
 P.damperHD = (ctx, ax, ay, bx, s, t, o = {}) => {
  const r = s / 2, L = bx - ax, cyl = o.cyl ?? s * 4.4, rodL = o.rod ?? s * 3.8, c0 = ax + s * 0.75, c1 = c0 + cyl, pist = cl(bx - rodL, c0 + s * 0.35, c1 - s * 0.35), cut = o.cut || 0, v = o.vel || 0, heat = cl(o.heat || 0);
  const quad = (pp, c) => { ctx.beginPath(); pp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
  const metal = (y0, y1, a, b, c) => { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); g.addColorStop(0.35, b); g.addColorStop(1, c); return g; };
  ctx.save();
  // estribo (contexto fijo) y placa de anclaje con pernos
  const wx = ax - s * 1.25; if (o.wall !== false) { const g = ctx.createLinearGradient(wx - s * 3, 0, wx, 0); g.addColorStop(0, SEC.horD); g.addColorStop(1, SEC.hor); ctx.fillStyle = g; ctx.fillRect(wx - s * 4, ay - s * 3.2, s * 4, s * 6.4); }
  quad([[wx, ay - s * 1.3], [wx + s * 0.28, ay - s * 1.3], [wx + s * 0.28, ay + s * 1.3], [wx, ay + s * 1.3]], SEC.acero); for (const dy of [-1, 1]) { ctx.fillStyle = SEC.aceroL; ctx.beginPath(); ctx.arc(wx + s * 0.14, ay + dy * s * 1.0, s * 0.08, 0, TAU); ctx.fill(); }
  quad([[wx + s * 0.28, ay - s * 0.5], [ax, ay - s * 0.42], [ax, ay + s * 0.42], [wx + s * 0.28, ay + s * 0.5]], '#66798a');
  // tablero (contexto móvil): ala de viga y ménsula atornillada que baja hasta el pasador móvil
  if (o.girder !== false) { quad([[bx - s * 3, ay - s * 2.5], [bx + s * 3, ay - s * 2.5], [bx + s * 3, ay - s * 2.2], [bx - s * 3, ay - s * 2.2]], '#6c7a82'); ctx.fillStyle = '#5d6b73'; ctx.fillRect(bx - s * 3, ay - s * 3.4, s * 6, s * 0.9); ctx.fillStyle = SEC.horL; ctx.fillRect(bx - s * 3, ay - s * 3.6, s * 6, s * 0.22); }
  quad([[bx - s * 0.32, ay - s * 2.2], [bx + s * 0.32, ay - s * 2.2], [bx + s * 0.2, ay], [bx - s * 0.2, ay]], '#66798a'); ctx.fillStyle = SEC.aceroL; for (const dx of [-0.16, 0.16]) { ctx.beginPath(); ctx.arc(bx + dx * s, ay - s * 2.05, s * 0.06, 0, TAU); ctx.fill(); }
  // vástago cromado
  ctx.fillStyle = metal(ay - r * 0.24, ay + r * 0.24, '#9fb0b8', '#f2f6f7', '#7a8b94'); ctx.fillRect(pist, ay - r * 0.24, bx - s * 0.3 - pist, r * 0.48);
  // cilindro con tapas
  ctx.fillStyle = metal(ay - r, ay + r, '#6f818c', '#c6d2d7', '#44535d'); ctx.beginPath(); ctx.roundRect(c0, ay - r, cyl, 2 * r, r * 0.25); ctx.fill(); ctx.fillStyle = metal(ay - r * 1.08, ay + r * 1.08, '#56656f', '#9fb0b8', '#3b4851'); ctx.fillRect(c0 - s * 0.05, ay - r * 1.08, s * 0.16, r * 2.16); ctx.fillRect(c1 - s * 0.11, ay - r * 1.08, s * 0.16, r * 2.16);
  // corte: cámaras con fluido, pistón con orificios, flujo esquemático en sentido contrario al pistón, calor (parte de la energía)
  if (cut > 0) { ctx.save(); ctx.globalAlpha *= cut; const ix0 = c0 + s * 0.12, ix1 = c1 - s * 0.12, ir = r * 0.78; const hc = `rgb(${Math.round(217 + 30 * heat)},${Math.round(163 - 55 * heat)},${Math.round(92 - 45 * heat)})`; const fg = ctx.createLinearGradient(0, ay - ir, 0, ay + ir); fg.addColorStop(0, hc); fg.addColorStop(1, '#b07a3c'); ctx.fillStyle = fg; ctx.fillRect(ix0, ay - ir, ix1 - ix0, ir * 2);
   ctx.fillStyle = metal(ay - ir, ay + ir, '#9fb0b8', '#e8eef0', '#7a8b94'); ctx.fillRect(pist - s * 0.11, ay - ir, s * 0.22, ir * 2); ctx.fillStyle = '#1d2326'; for (const oy of [-0.5, 0.5]) ctx.fillRect(pist - s * 0.11, ay + oy * ir - s * 0.03, s * 0.22, s * 0.06); ctx.fillStyle = '#2e3a40'; ctx.fillRect(pist - s * 0.12, ay - ir, s * 0.02, ir * 2); ctx.fillRect(pist + s * 0.1, ay - ir, s * 0.02, ir * 2);
   if (Math.abs(v) > 0.04) { const d = -Math.sign(v); ctx.strokeStyle = 'rgba(255,245,225,0.9)'; ctx.lineWidth = Math.max(2, s * 0.025); ctx.lineCap = 'round'; for (const oy of [-0.5, 0.5]) for (let k = 0; k < 3; k++) { const ph = ((t * (1.5 + 2.5 * Math.abs(v)) + k / 3) % 1); const xx = pist + d * s * (0.15 + ph * 0.8); if (xx < ix0 + s * 0.05 || xx > ix1 - s * 0.05) continue; ctx.beginPath(); ctx.moveTo(xx, ay + oy * ir); ctx.lineTo(xx + d * s * 0.16, ay + oy * ir); ctx.lineTo(xx + d * s * 0.1, ay + oy * ir - s * 0.05); ctx.moveTo(xx + d * s * 0.16, ay + oy * ir); ctx.lineTo(xx + d * s * 0.1, ay + oy * ir + s * 0.05); ctx.stroke(); } }
   if (heat > 0.03) P.glow(ctx, pist, ay, s * 1.6, '255,128,64', 0.42 * heat); ctx.restore(); }
  ctx.strokeStyle = 'rgba(20,24,28,0.6)'; ctx.lineWidth = Math.max(1, s * 0.02); ctx.beginPath(); ctx.roundRect(c0, ay - r, cyl, 2 * r, r * 0.25); ctx.stroke();
  // articulaciones (horquilla + pasador) en ambos extremos
  for (const [x, ear] of [[ax, c0], [bx, null]]) { quad([[x - s * 0.36, ay - s * 0.36], [x + s * 0.36, ay - s * 0.36], [x + s * 0.36, ay + s * 0.36], [x - s * 0.36, ay + s * 0.36]], '#56656f'); ctx.fillStyle = metal(ay - s * 0.16, ay + s * 0.16, '#c4d0d5', '#ffffff', '#8e9fa8'); ctx.beginPath(); ctx.arc(x, ay, s * 0.16, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2e3a40'; ctx.lineWidth = Math.max(1, s * 0.02); ctx.stroke(); if (ear) { ctx.fillStyle = '#66798a'; ctx.fillRect(x + s * 0.36, ay - s * 0.22, ear - x - s * 0.36, s * 0.44); } }
  // resistencia: fuerza del disipador contra el movimiento relativo (cualitativa, ∝ |v|^0,5)
  const f = o.force ?? 0; if (f > 0 && Math.abs(v) > 0.05) { ctx.save(); ctx.globalAlpha *= f; P.hArrow(ctx, bx + Math.sign(v) * s * 0.6, ay + s * 1.25, -Math.sign(v) * s * (0.6 + 1.6 * Math.sqrt(Math.abs(v))), SEC.fuerza, s * 0.2); ctx.restore(); }
  ctx.restore();
  return { cyl: [c0 + cyl * 0.75, ay - r], rod: [(pist + bx) / 2, ay], piston: [pist, ay], fluid: [(c0 + pist) / 2, ay + r * 0.4], pinA: [ax, ay], pinB: [bx, ay], plateA: [wx + s * 0.14, ay + s * 1.2], bracketB: [bx, ay - s * 1.6], force: [bx, ay + s * 1.25] };
 };
 // Vista desde la calzada (perspectiva con punto de fuga): carriles, pretiles, farolas y una junta de peines a la profundidad jz.
 // o: { vy (horizonte), gap (abertura en unidades de calzada; la capacidad es la longitud de los dientes), cars:[{X, z, c, front}], shake, glow, dusk }
 P.roadView = (ctx, t, o = {}) => {
  const vy = o.vy ?? 760, F = 760, cxp = 540 + (o.shake || 0), pr = (X, z, h = 0) => [cxp + X * F / z, vy + (1920 - vy) / z - h * F / z];
  const quad = (pp, c) => { ctx.beginPath(); pp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
  ctx.save();
  // valle a ambos lados (bajo el horizonte) y cordillera lejana
  const vg = ctx.createLinearGradient(0, vy, 0, 1920); vg.addColorStop(0, o.dusk ? '#4d5560' : '#3d4f55'); vg.addColorStop(1, '#5c5246'); ctx.fillStyle = vg; ctx.fillRect(0, vy, 1080, 1920 - vy);
  ctx.fillStyle = o.dusk ? '#2a3a48' : '#203b4c'; ctx.beginPath(); ctx.moveTo(0, vy + 2); for (let x = 0; x <= 1080; x += 30) ctx.lineTo(x, vy - 40 - 50 * Math.abs(Math.sin(x * 0.006 + 1)) - 20 * Math.sin(x * 0.021)); ctx.lineTo(1080, vy + 2); ctx.closePath(); ctx.fill();
  const z0 = 0.92, zf = 80, jz = o.jz ?? 3.2, g = o.gap ?? 0.07, Lf = o.finger ?? 0.16;
  // tablero (cerca) y estribo/acceso (más allá de la junta)
  quad([pr(-1, z0), pr(1, z0), pr(1, zf), pr(-1, zf)], '#4a5257');
  quad([pr(-1.22, z0), pr(-1, z0), pr(-1, zf), pr(-1.22, zf)], '#7f8a90'); quad([pr(1, z0), pr(1.22, z0), pr(1.22, zf), pr(1, zf)], '#7f8a90');
  for (const sgn of [-1, 1]) { quad([pr(sgn * 1.0, z0, 0), pr(sgn * 1.0, zf, 0), pr(sgn * 1.0, zf, 0.12), pr(sgn * 1.0, z0, 0.12)], sgn < 0 ? '#a7b0b4' : '#8e989d'); ctx.strokeStyle = SEC.aceroL; ctx.lineWidth = 3; ctx.beginPath(); for (let z = z0; z < 40; z *= 1.0) { const a = pr(sgn * 1.0, z, 0.26); z === z0 ? ctx.moveTo(a[0], a[1]) : ctx.lineTo(a[0], a[1]); z += 0.5; } ctx.stroke(); for (let z = 1; z < 30; z += 0.7) { const a = pr(sgn * 1.0, z, 0.12), b = pr(sgn * 1.0, z, 0.26); ctx.lineWidth = Math.max(1, 6 / z); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } for (let z = 1.6; z < 40; z += 3.5) { const a = pr(sgn * 1.12, z, 0.12), b = pr(sgn * 1.12, z, 1.0), c = pr(sgn * 0.92, z, 1.0); ctx.strokeStyle = '#8b979d'; ctx.lineWidth = Math.max(1, 10 / z); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.stroke(); if (o.dusk) P.glow(ctx, c[0], c[1] + 4, 60 / z * 3, '255,220,160', 0.35); } }
  // líneas de carril
  ctx.fillStyle = 'rgba(240,240,220,0.8)'; for (let z = z0 + ((t * (o.speed ?? 0)) % 1.2); z < 40; z += 1.2) { const a = pr(-0.02, z), b = pr(0.02, z), c = pr(0.02, z + 0.6), d = pr(-0.02, z + 0.6); quad([a, b, c, d], 'rgba(240,240,220,0.8)'); }
  for (const X of [-0.94, 0.94]) { ctx.strokeStyle = 'rgba(240,240,220,0.6)'; ctx.lineWidth = 3; const a = pr(X, z0), b = pr(X, zf); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  // junta de peines: hueco oscuro, dientes del tablero (cerca) y del estribo (lejos) que se solapan mientras g < Lf
  const zA = jz, zB = jz + g; quad([pr(-1, zA - 0.12), pr(1, zA - 0.12), pr(1, zA), pr(-1, zA)], '#8796a0'); quad([pr(-1, zB), pr(1, zB), pr(1, zB + 0.12), pr(-1, zB + 0.12)], '#8796a0'); quad([pr(-1, zA), pr(1, zA), pr(1, zB), pr(-1, zB)], '#14181b');
  const nf = 20; for (let i = 0; i < nf; i++) { const X0 = -1 + (2 * i) / nf + 0.012, X1 = -1 + (2 * (i + 1)) / nf - 0.012; if (i % 2) quad([pr(X0, zA), pr(X1, zA), pr(X1, zA + Lf), pr(X0, zA + Lf)], '#b8c6cc'); else quad([pr(X0, zB - Lf), pr(X1, zB - Lf), pr(X1, zB), pr(X0, zB)], '#9fb0b8'); }
  if (o.glow) { ctx.strokeStyle = `rgba(56,198,208,${o.glow})`; ctx.lineWidth = 4; const a = pr(-1.04, zA - 0.16), b = pr(1.04, zA - 0.16), c = pr(1.04, zB + 0.16), d = pr(-1.04, zB + 0.16); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); ctx.stroke(); }
  // vehículos (de lejos a cerca): traseras (alejándose) o frontales (acercándose)
  for (const c of (o.cars || []).slice().sort((p, q) => q.z - p.z)) { if (c.z < z0 + 0.05 || c.z > 40) continue; const w = 0.34, h = 0.24, a = pr(c.X - w, c.z), b = pr(c.X + w, c.z, h); const W = b[0] - a[0], Hh = a[1] - b[1]; ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(a[0] - W * 0.04, a[1] - Hh * 0.08, W * 1.08, Hh * 0.12); ctx.fillStyle = c.c; ctx.beginPath(); ctx.roundRect(a[0], a[1] - Hh * 0.7, W, Hh * 0.62, W * 0.06); ctx.fill(); ctx.beginPath(); ctx.roundRect(a[0] + W * 0.14, a[1] - Hh, W * 0.72, Hh * 0.36, W * 0.08); ctx.fill(); ctx.fillStyle = 'rgba(30,40,50,0.8)'; ctx.fillRect(a[0] + W * 0.2, a[1] - Hh * 0.94, W * 0.6, Hh * 0.26); ctx.fillStyle = c.front ? '#fff6d8' : '#ff4a3a'; ctx.fillRect(a[0] + W * 0.05, a[1] - Hh * 0.5, W * 0.16, Hh * 0.1); ctx.fillRect(a[0] + W * 0.79, a[1] - Hh * 0.5, W * 0.16, Hh * 0.1); if (c.front) { P.glow(ctx, a[0] + W * 0.13, a[1] - Hh * 0.45, W * 0.5, '255,240,200', 0.3); P.glow(ctx, a[0] + W * 0.87, a[1] - Hh * 0.45, W * 0.5, '255,240,200', 0.3); } ctx.fillStyle = '#15191c'; ctx.fillRect(a[0] + W * 0.06, a[1] - Hh * 0.1, W * 0.18, Hh * 0.1); ctx.fillRect(a[0] + W * 0.76, a[1] - Hh * 0.1, W * 0.18, Hh * 0.1); }
  ctx.restore();
  const jp = pr(0.5, jz + g / 2); return { joint: jp, jointL: pr(-0.5, jz + g / 2), gapPx: pr(0, zA)[1] - pr(0, zB)[1], pr };
 };
 // Corte transversal por una pila: tablero (losa + 4 vigas + pretiles), apoyos, cabezal, fuste, zapata, pilotes y estratos.
 // (cx, gy) = eje y nivel del terreno; s = escala. o: { ug, up, ud (desplazamientos laterales), flow 0..1 (camino de cargas), hl:{deck, bearings, column, foundation}, iso }
 P.bridgeSection = (ctx, cx, gy, s, t, o = {}) => {
  const ug = o.ug || 0, up = o.up || 0, ud = o.ud ?? ug + up, hl = o.hl || {}, colH = s * 4.0, fH = s * 0.6, capH = s * 0.7, bH = s * 0.32, gH = s * 0.7, slab = s * 0.24;
  const quad = (pp, c) => { ctx.beginPath(); pp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
  const hlS = (pts, a, c = '255,212,71') => { if (!a) return; ctx.strokeStyle = `rgba(${c},${a})`; ctx.lineWidth = 5; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke(); };
  ctx.save();
  // estratos (se mueven con el suelo)
  const bands = ['#7c6d5b', '#6e604f', '#625545', '#55493b']; bands.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(-200, gy + i * s * 1.3, 1480, s * 1.3 + 2); }); ctx.strokeStyle = 'rgba(30,24,18,0.35)'; ctx.lineWidth = 3; for (let i = 1; i < 4; i++) { ctx.beginPath(); for (let x = -200; x <= 1280; x += 30) { const y = gy + i * s * 1.3 + Math.sin((x - ug) * 0.01 + i) * 8; x === -200 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.fillStyle = '#425D50'; ctx.fillRect(-200, gy - 6, 1480, 12);
  const bx = cx + ug, fy = gy + s * 0.15;
  // pilotes y zapata enterrados
  ctx.fillStyle = SEC.horD; for (const f of [-1.1, 0, 1.1]) ctx.fillRect(bx + f * s - s * 0.17, fy + fH, s * 0.34, s * 3.6);
  quad([[bx - s * 1.6, fy], [bx + s * 1.6, fy], [bx + s * 1.6, fy + fH], [bx - s * 1.6, fy + fH]], '#7d888d');
  hlS([[bx - s * 1.6, fy], [bx + s * 1.6, fy], [bx + s * 1.6, fy + fH + s * 3.6], [bx - s * 1.6, fy + fH + s * 3.6]], hl.foundation);
  // fuste (flexión de ménsula moderada) y cabezal en martillo
  const yTop = fy - colH, N = 10, pts = (sg) => { const a = []; for (let k = 0; k <= N; k++) { const u = k / N, y = lerp(fy, yTop, u); a.push([bx + up * (3 * u * u - 2 * u * u * u) + sg * s * 0.38, y]); } return a; }; const Lc = pts(-1), Rc = pts(1); const cg = ctx.createLinearGradient(bx - s * 0.4, 0, bx + s * 0.4, 0); cg.addColorStop(0, SEC.horD); cg.addColorStop(0.5, SEC.hor); cg.addColorStop(1, '#8c979c'); quad([...Lc, ...Rc.slice().reverse()], cg); hlS([...Lc, ...Rc.slice().reverse()], hl.column);
  const tx = bx + up, cB = yTop, cT = yTop - capH; quad([[tx - s * 0.6, cB], [tx + s * 0.6, cB], [tx + s * 1.9, cT + capH * 0.45], [tx + s * 1.9, cT], [tx - s * 1.9, cT], [tx - s * 1.9, cT + capH * 0.45]], SEC.hor);
  // apoyos bajo cada viga
  const gxs = [-1.45, -0.5, 0.5, 1.45]; const bearings = gxs.map((f) => { const x = tx + f * s; return o.iso === false ? (quad([[x - s * 0.22, cT], [x + s * 0.22, cT], [x + s * 0.22, cT - bH * 0.5], [x - s * 0.22, cT - bH * 0.5]], SEC.acero), [x, cT - bH * 0.25]) : (P.isolatorDetail(ctx, x, cT - bH / 2, s * 0.46, bH, cl(ud - ug - up, -bH * 0.5, bH * 0.5), t, { lead: true, layers: 4, glow: hl.bearings }), [x, cT - bH / 2]); });
  // tablero: vigas en I, diafragma, losa y pretiles
  const dx = tx - cx + (o.iso === false ? 0 : cl(ud - ug - up, -bH * 0.5, bH * 0.5)), yG = cT - (o.iso === false ? bH * 0.5 : bH); gxs.forEach((f) => { const x = cx + dx + f * s; quad([[x - s * 0.22, yG], [x + s * 0.22, yG], [x + s * 0.22, yG - s * 0.07], [x - s * 0.22, yG - s * 0.07]], '#5d6b73'); ctx.fillStyle = '#6c7a82'; ctx.fillRect(x - s * 0.04, yG - gH, s * 0.08, gH); quad([[x - s * 0.18, yG - gH], [x + s * 0.18, yG - gH], [x + s * 0.18, yG - gH + s * 0.06], [x - s * 0.18, yG - gH + s * 0.06]], '#5d6b73'); });
  ctx.fillStyle = 'rgba(77,89,96,0.85)'; ctx.fillRect(cx + dx - s * 1.45, yG - gH * 0.8, s * 2.9, gH * 0.55);
  const yS = yG - gH; quad([[cx + dx - s * 2.3, yS], [cx + dx + s * 2.3, yS], [cx + dx + s * 2.3, yS - slab], [cx + dx - s * 2.3, yS - slab]], SEC.horL); ctx.fillStyle = '#4a5257'; ctx.fillRect(cx + dx - s * 2.0, yS - slab - s * 0.05, s * 4.0, s * 0.05);
  for (const sg of [-1, 1]) { const x = cx + dx + sg * s * 2.15; quad([[x - s * 0.15, yS - slab], [x + s * 0.15, yS - slab], [x + s * 0.09, yS - slab - s * 0.42], [x - s * 0.09, yS - slab - s * 0.42]], SEC.hor); ctx.strokeStyle = SEC.aceroL; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, yS - slab - s * 0.42); ctx.lineTo(x, yS - slab - s * 0.62); ctx.stroke(); }
  hlS([[cx + dx - s * 2.3, yS - slab - s * 0.05], [cx + dx + s * 2.3, yS - slab - s * 0.05], [cx + dx + s * 2.3, yG + 4], [cx + dx - s * 2.3, yG + 4]], hl.deck);
  // camino de cargas: del suelo a la cimentación, el fuste, el cabezal, los apoyos y el tablero (chevrones animados)
  const fl = o.flow || 0; if (fl > 0) { const path = [[bx, gy + s * 3.4], [bx, fy + fH * 0.5], [bx + up * 0.5, (fy + yTop) / 2], [tx, cT + capH * 0.4], [tx, cT - bH / 2], [cx + dx, yS - slab * 0.5]]; const seg = []; let Lt = 0; for (let i = 0; i < path.length - 1; i++) { const l = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]); seg.push(l); Lt += l; } ctx.save(); ctx.globalAlpha *= fl; for (let k = 0; k < 14; k++) { let d = ((t * 0.32 + k / 14) % 1) * Lt * fl, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; } const a = path[i], b = path[i + 1], u = Math.min(1, d / seg[i]), x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u), an = Math.atan2(b[1] - a[1], b[0] - a[0]); ctx.save(); ctx.translate(x, y); ctx.rotate(an); ctx.fillStyle = SEC.fuerza; ctx.beginPath(); ctx.moveTo(s * 0.16, 0); ctx.lineTo(-s * 0.08, -s * 0.13); ctx.lineTo(-s * 0.02, 0); ctx.lineTo(-s * 0.08, s * 0.13); ctx.closePath(); ctx.fill(); ctx.restore(); } ctx.restore(); }
  ctx.restore();
  return { deck: [cx + dx + s * 2.0, yS - slab * 0.5], girder: [cx + dx - s * 1.45, yG - gH * 0.5], bearing: bearings[3], cap: [tx - s * 1.5, cT + capH * 0.3], column: [bx + up * 0.5 + s * 0.38, (fy + yTop) / 2], footing: [bx + s * 1.6, fy + fH * 0.5], piles: [bx + s * 1.1, fy + fH + s * 2], ground: [bx - s * 2.6, gy + s * 0.6] };
 };
 // ---------------- v1.16 · túneles bajo ríos: río, geología, tuneladora EPB, dovelas, juntas y túnel terminado ----------------
 // UN SOLO SISTEMA DE COORDENADAS (P.TUN): x a lo largo del eje del túnel (sección longitudinal) o a lo largo del río (sección transversal),
 // y vertical hacia abajo. El túnel va bajo el lecho, en la capa de arcilla (compatible con una tuneladora EPB), nunca dentro del agua abierta.
 const TC = { fondo: '#0B1821', aguaP: '#123D54', aguaL: '#2987A7', espuma: '#D7EDF0', sup: '#76624D', arcilla: '#A27B59', arena: '#C2A67C', grava: '#8E8B80', roca: '#626C71', acero: '#354751', aceroL: '#A9BCC5', corte: '#E4A33B', hormigon: '#B4BEC0', sello: '#303C43', presion: '#FF735A', protegida: '#43D0C6', oro: '#FFD447', blanco: '#F4F7F8', lechada: '#9a948a', marina: '#7a6248' };
 P.TC = TC;
 const TUN = { GS: 600, WS: 650, xa: 760, xb: 2240, TY: 1330, R: 96, x0: 300, x1: 2700, w: 24, ti: 12 };
 TUN.bed = (x) => { const a = TUN.xa, b = TUN.xb; if (x <= a - 160 || x >= b + 160) return TUN.GS; const e = Math.min(x - (a - 160), (b + 160) - x), u = Math.min(1, e / 300), s = u * u * (3 - 2 * u); return TUN.GS + (965 + 22 * Math.sin(x * 0.011) - TUN.GS) * s; };
 // techos de capa (y absoluta): arena/limo bajo el lecho, arcilla (donde va el túnel), grava y roca
 TUN.layers = [{ k: 'arena', c: TC.arena, top: (x) => TUN.bed(x) }, { k: 'arcilla', c: TC.arcilla, top: (x) => Math.max(TUN.bed(x) + 50, 1150 + 28 * Math.sin(x * 0.004)) }, { k: 'grava', c: TC.grava, top: (x) => 1505 + 22 * Math.sin(x * 0.003 + 1) }, { k: 'roca', c: TC.roca, top: (x) => 1650 + 30 * Math.sin(x * 0.0025 + 2) }];
 P.TUN = TUN;
 const tq = (ctx, pp, c) => { ctx.beginPath(); pp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
 // estado de avance de la tuneladora a partir de un número continuo de anillos: excava (0–0,6) y luego monta el anillo (0,6–1)
 // edificios de la ciudad en las orillas (deterministas)
 const CITY = (() => { const R = H.rng(31), a = []; for (let x = -900; x < 3700; x += R.range(60, 120)) { if (x > TUN.xa - 220 && x < TUN.xb + 220) continue; a.push({ x, w: R.range(40, 90), h: R.range(60, 260), k: R.range(0.3, 2.2), c: R() < 0.5 ? '#2a3d4a' : '#33495a' }); } return a.sort((p, q) => q.k - p.k); })();
 // Sección longitudinal por el eje del túnel (corte técnico 2,5D): cielo, ciudad, río en sección, capas, nivel freático, pozo de ataque,
 // revestimiento de anillos, relleno anular, tuneladora EPB (P.tbmSide) o túnel terminado con vías y tren.
 // o: { st (P.tbmState), mode 'obra'|'terminado', D, t, rot (giro cabeza), press 0..1, support 0..1, flow 0..1, train (x frente), boats, glow{}, xray }
 P.tunWorld = (ctx, t, o = {}) => {
  const { GS, WS, TY, R, x0, x1, w, ti } = TUN, D = o.D || [40, -30], XA = -1400, XB = 4200, mode = o.mode || 'obra', S = o.st || P.tbmState(o.cyc ?? 40), gl = o.glow || {};
  ctx.save();
  // cielo y luz natural
  const sg = ctx.createLinearGradient(0, -900, 0, GS); sg.addColorStop(0, '#0B1821'); sg.addColorStop(1, o.dusk ? '#8a6a52' : '#3d6680'); ctx.fillStyle = sg; ctx.fillRect(XA, -2400, XB - XA, WS + 2440);
  // ciudad en profundidad (dos orillas)
  for (const b of CITY) { const ox = D[0] * b.k, oy = D[1] * b.k, y0 = GS + oy; tq(ctx, [[b.x + ox, y0], [b.x + b.w + ox, y0], [b.x + b.w + ox, y0 - b.h], [b.x + ox, y0 - b.h]], b.c); ctx.fillStyle = o.dusk ? 'rgba(255,214,150,0.55)' : 'rgba(215,237,240,0.18)'; for (let yy = y0 - b.h + 10; yy < y0 - 8; yy += 16) for (let xx = b.x + 6; xx < b.x + b.w - 6; xx += 12) if (((xx * 7 + yy * 3) | 0) % 5) ctx.fillRect(xx + ox, yy, 5, 7); }
  // superficie superior del terreno (franja en profundidad) y del agua
  const bedPts = []; for (let x = XA; x <= XB; x += 20) bedPts.push([x, TUN.bed(x)]);
  tq(ctx, [[XA, GS], [TUN.xa - 160, GS], [TUN.xa - 160 + D[0] * 2.4, GS + D[1] * 2.4], [XA + D[0] * 2.4, GS + D[1] * 2.4]], '#5f6b4f'); tq(ctx, [[TUN.xb + 160, GS], [XB, GS], [XB + D[0] * 2.4, GS + D[1] * 2.4], [TUN.xb + 160 + D[0] * 2.4, GS + D[1] * 2.4]], '#5f6b4f');
  const wa = TUN.xa - 110, wb = TUN.xb + 110; const wg = ctx.createLinearGradient(0, WS + D[1] * 2.4, 0, WS); wg.addColorStop(0, '#1f5f78'); wg.addColorStop(1, TC.aguaL); tq(ctx, [[wa, WS], [wb, WS], [wb + D[0] * 2.4, WS + D[1] * 2.4], [wa + D[0] * 2.4, WS + D[1] * 2.4]], wg);
  ctx.strokeStyle = 'rgba(215,237,240,0.35)'; ctx.lineWidth = 2; for (let k = 0; k < 9; k++) { const u = ((k / 9 + t * 0.05) % 1) * 2.4, xs = wa + D[0] * u, ys = WS + D[1] * u; ctx.beginPath(); for (let x = 0; x <= wb - wa; x += 30) ctx.lineTo(xs + x, ys + 2 * Math.sin(x * 0.03 + t * 2 + k)); ctx.stroke(); }
  // muros de ribera
  for (const [x, s] of [[TUN.xa - 160, 1], [TUN.xb + 160, -1]]) tq(ctx, [[x - s * 8, GS - 10], [x + s * 8, GS - 10], [x + s * 8, GS + 20], [x - s * 8, GS + 20]], '#7f8a8c');
  // capas geológicas (sección frontal)
  TUN.layers.forEach((L) => { ctx.beginPath(); ctx.moveTo(XA, 3400); for (let x = XA; x <= XB; x += 20) ctx.lineTo(x, L.top(x)); ctx.lineTo(XB, 3400); ctx.closePath(); ctx.fillStyle = L.c; ctx.fill(); }); { const dg = ctx.createLinearGradient(0, 900, 0, 2100); dg.addColorStop(0, 'rgba(11,24,33,0)'); dg.addColorStop(1, 'rgba(11,24,33,0.55)'); ctx.fillStyle = dg; ctx.beginPath(); ctx.moveTo(XA, 3400); for (let x = XA; x <= XB; x += 20) ctx.lineTo(x, TUN.bed(x)); ctx.lineTo(XB, 3400); ctx.closePath(); ctx.fill(); }
  // textura de capas: puntos/estratos deterministas
  { const Rr = H.rng(5); ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let i = 0; i < 900; i++) { const x = Rr.range(XA, XB), y = Rr.range(TUN.bed(x) + 6, 2300); ctx.fillRect(x, y, 3, 2); } ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 2; TUN.layers.slice(1).forEach((L) => { ctx.beginPath(); for (let x = XA; x <= XB; x += 20) x === XA ? ctx.moveTo(x, L.top(x)) : ctx.lineTo(x, L.top(x)); ctx.stroke(); }); }
  // suelo superficial en las orillas
  ctx.fillStyle = TC.sup; ctx.beginPath(); ctx.moveTo(XA, GS); bedPts.forEach((p) => ctx.lineTo(p[0], p[1])); for (let i = bedPts.length - 1; i >= 0; i--) ctx.lineTo(bedPts[i][0], bedPts[i][1] + (bedPts[i][1] <= GS + 1 ? 46 : 14)); ctx.closePath(); ctx.fill();
  // agua del río en sección (de la superficie al lecho): degradado, rayos de luz y partículas en suspensión
  ctx.save(); ctx.beginPath(); ctx.moveTo(wa, WS); bedPts.filter((p) => p[0] >= wa && p[0] <= wb).forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(wb, WS); ctx.closePath(); const ag = ctx.createLinearGradient(0, WS, 0, 990); ag.addColorStop(0, TC.aguaL); ag.addColorStop(1, TC.aguaP); ctx.fillStyle = ag; ctx.fill(); ctx.clip();
   ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 7; k++) { const x = wa + 120 + k * 210 + 30 * Math.sin(t * 0.4 + k); const g = ctx.createLinearGradient(0, WS, 0, 980); g.addColorStop(0, 'rgba(120,200,220,0.10)'); g.addColorStop(1, 'rgba(120,200,220,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, WS); ctx.lineTo(x + 50, WS); ctx.lineTo(x + 130, 990); ctx.lineTo(x + 60, 990); ctx.closePath(); ctx.fill(); } ctx.globalCompositeOperation = 'source-over';
   const Rp = H.rng(9); ctx.fillStyle = 'rgba(215,237,240,0.35)'; for (let i = 0; i < 120; i++) { const x = Rp.range(wa, wb), y = Rp.range(WS + 10, 980), r = Rp.range(0.8, 2.2); ctx.beginPath(); ctx.arc(x + Math.sin(t * 0.7 + i) * 6, y + Math.cos(t * 0.5 + i) * 4, r, 0, TAU); ctx.fill(); } ctx.restore();
  // sedimentos del lecho en el cauce
  { const bp = bedPts.filter((p) => p[0] >= wa && p[0] <= wb && p[1] > WS + 20); if (bp.length > 2) { ctx.fillStyle = '#8f7d63'; ctx.beginPath(); ctx.moveTo(bp[0][0], bp[0][1]); bp.forEach((p) => ctx.lineTo(p[0], p[1] - 2 + 2 * Math.sin(p[0] * 0.09))); for (let i = bp.length - 1; i >= 0; i--) ctx.lineTo(bp[i][0], bp[i][1] + 14); ctx.closePath(); ctx.fill(); } }
  // superficie del agua (línea con oleaje) y barcos que cruzan
  ctx.strokeStyle = TC.espuma; ctx.lineWidth = 3; ctx.beginPath(); for (let x = wa; x <= wb; x += 12) { const y = WS + 2.5 * Math.sin(x * 0.04 + t * 2.2); x === wa ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
  if (o.boats !== false) for (const [x, k, c] of [[1150 + 40 * Math.sin(t * 0.2), 1.2, '#c9cfd2'], [1800 - 30 * Math.sin(t * 0.17), 0.5, '#d4a24e']]) { const bx = x + D[0] * k, by = WS + D[1] * k + 2 * Math.sin(t * 1.5 + x); tq(ctx, [[bx - 70, by - 6], [bx + 80, by - 6], [bx + 60, by + 12], [bx - 60, by + 12]], c); tq(ctx, [[bx - 30, by - 30], [bx + 30, by - 30], [bx + 30, by - 6], [bx - 30, by - 6]], '#e8ecef'); }
  // nivel freático en las orillas (línea discontinua al nivel del río)
  if (o.watertable) { ctx.save(); ctx.globalAlpha *= o.watertable; ctx.strokeStyle = TC.aguaL; ctx.setLineDash([14, 10]); ctx.lineWidth = 3; for (const [a, b] of [[XA, TUN.xa - 160], [TUN.xb + 160, XB]]) { ctx.beginPath(); ctx.moveTo(a, WS); ctx.lineTo(b, WS); ctx.stroke(); } ctx.setLineDash([]); ctx.restore(); }
  // pozos de ataque y de salida
  const shaft = (x) => { tq(ctx, [[x - 90, GS], [x + 10, GS], [x + 10, TY + R + 30], [x - 90, TY + R + 30]], '#2b3a44'); tq(ctx, [[x - 100, GS - 4], [x - 90, GS - 4], [x - 90, TY + R + 40], [x - 100, TY + R + 40]], TC.hormigon); tq(ctx, [[x + 10, GS - 4], [x + 20, GS - 4], [x + 20, TY - R - 10], [x + 10, TY - R - 10]], TC.hormigon); tq(ctx, [[x - 100, TY + R + 30], [x + 20, TY + R + 30], [x + 20, TY + R + 44], [x - 100, TY + R + 44]], TC.hormigon); ctx.strokeStyle = TC.oro; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 110, GS - 4); ctx.lineTo(x - 110, GS - 120); ctx.lineTo(x + 40, GS - 120); ctx.lineTo(x + 40, GS - 4); ctx.moveTo(x - 40, GS - 120); ctx.lineTo(x - 40, GS + 60); ctx.stroke(); };
  shaft(x0); if (mode === 'terminado' || S.xm > x1 - 500) shaft(x1 + 100);
  // túnel: perforación, relleno anular, cara interior (media caña) y revestimiento cortado
  const xEnd = mode === 'terminado' ? x1 : S.rf, xBore = mode === 'terminado' ? x1 : S.xm;
  tq(ctx, [[x0 + 10, TY - R], [xBore, TY - R], [xBore, TY + R], [x0 + 10, TY + R]], TC.lechada);
  const Ro = R - 10, Ri = Ro - ti; const lining = (xa, xb, nRing0) => { const ig = ctx.createLinearGradient(0, TY - Ri, 0, TY + Ri); ig.addColorStop(0, '#6f7a7d'); ig.addColorStop(0.5, '#c7cfd1'); ig.addColorStop(1, '#5c6669'); tq(ctx, [[xa, TY - Ri], [xb, TY - Ri], [xb, TY + Ri], [xa, TY + Ri]], ig);
   ctx.strokeStyle = 'rgba(48,60,67,0.55)'; ctx.lineWidth = 1.5; for (let x = xa, i = nRing0; x < xb - 0.5; x += w, i++) { ctx.beginPath(); ctx.moveTo(x, TY - Ri); ctx.lineTo(x, TY + Ri); ctx.stroke(); const off = (i % 2) * 0.39; for (let k = 0; k < 7; k++) { const a = off + (k * TAU) / 7, y = TY - Ri * Math.cos(a); if (Math.sin(a) > 0.15) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(Math.min(xb, x + w), y); ctx.stroke(); } } }
   for (const s of [-1, 1]) { tq(ctx, [[xa, TY + s * Ri], [xb, TY + s * Ri], [xb, TY + s * Ro], [xa, TY + s * Ro]], TC.hormigon); ctx.fillStyle = TC.sello; for (let x = xa; x <= xb + 0.5; x += w) { ctx.fillRect(x - 1, TY + s * Ri, 2, s * ti); ctx.fillRect(x - 2, TY + s * (Ro - 3), 4, s * 2.5); } } };
  if (xEnd > x0 + 10) lining(x0 + 10, xEnd, 0);
  if (mode === 'terminado') { // solera, andén, vías, luces e instalaciones
   tq(ctx, [[x0 + 10, TY + Ri * 0.55], [x1, TY + Ri * 0.55], [x1, TY + Ri], [x0 + 10, TY + Ri]], '#8e979a'); ctx.fillStyle = '#3a3f42'; for (let x = x0 + 14; x < x1; x += 9) ctx.fillRect(x, TY + Ri * 0.55 - 3, 5, 3); ctx.fillStyle = '#c9d2d6'; ctx.fillRect(x0 + 10, TY + Ri * 0.55 - 6, x1 - x0 - 10, 2.5);
   ctx.strokeStyle = 'rgba(40,46,50,0.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 10, TY - Ri * 0.6); ctx.lineTo(x1, TY - Ri * 0.6); ctx.stroke(); for (let x = x0 + 30; x < x1; x += 70) P.glow(ctx, x, TY - Ri * 0.78, 22, '255,236,200', 0.55);
   if (o.train != null) { const tx = o.train, L = 520, y1 = TY + Ri * 0.55 - 6, y0 = y1 - Ri * 1.05; for (let c = 0; c < 4; c++) { const a = tx - c * (L / 4) - 4, b = a - L / 4 + 8; if (b > x1 || a < x0) continue; ctx.fillStyle = '#d9dee0'; ctx.beginPath(); ctx.roundRect(b, y0, a - b, y1 - y0 - 4, c === 0 ? [4, 16, 4, 4] : 4); ctx.fill(); ctx.fillStyle = TC.protegida; ctx.fillRect(b, y0 + (y1 - y0) * 0.62, a - b, 4); ctx.fillStyle = 'rgba(40,60,75,0.85)'; for (let x = b + 8; x < a - 14; x += 18) ctx.fillRect(x, y0 + 8, 12, 12); ctx.fillStyle = '#2a2f33'; ctx.fillRect(b + 8, y1 - 6, 14, 5); ctx.fillRect(a - 22, y1 - 6, 14, 5); } P.glow(ctx, tx + 4, y1 - 14, 40, '255,240,200', 0.7); } }
  if (mode === 'obra' && o.tbm !== false) P.tbmSide(ctx, S, t, o); else if (mode === 'obra') { tq(ctx, [[S.rf, TY - R], [S.xm, TY - R], [S.xm, TY + R], [S.rf, TY + R]], '#1a2328'); tq(ctx, [[S.xm - 4, TY - R], [S.xm + 4, TY - R], [S.xm + 4, TY + R], [S.xm - 4, TY + R]], '#6b5039'); }
  // presiones: del terreno y del agua sobre el frente y la perforación (rojo) / soporte en la cámara (turquesa)
  const pr = o.press || 0; if (pr > 0 && mode === 'obra') { ctx.save(); ctx.globalAlpha *= pr; for (let k = -2; k <= 2; k++) { const y = TY + k * R * 0.36; P.hArrow(ctx, S.xm + 70, y, -46, TC.presion, 10); } for (let x = S.xm - 300; x < S.xm + 60; x += 60) { for (const s of [-1, 1]) { ctx.save(); ctx.translate(x, TY + s * (R + 50)); ctx.rotate(s > 0 ? -Math.PI / 2 : Math.PI / 2); P.hArrow(ctx, 0, 0, 36, TC.presion, 9); ctx.restore(); } } ctx.restore(); }
  const su = o.support || 0; if (su > 0 && mode === 'obra') { ctx.save(); ctx.globalAlpha *= su; for (let k = -1; k <= 1; k++) P.hArrow(ctx, S.xm - 58, TY + k * R * 0.42, 34, TC.protegida, 10); ctx.restore(); }
  ctx.restore();
  return { st: S, face: [S.xm, TY], chamber: [S.xm - 41, TY - R * 0.45], screwIn: [S.xm - 34, TY + R - 26], screwOut: [S.xm - 300, TY - R * 0.18 - 26], belt: [S.xm - 420, TY - R * 0.18], cyl: [S.xm - 180, TY - R + 26], erector: [S.rf + w / 2, TY], tail: [S.xm - 360, TY + R - 6], bulkhead: [S.xm - 68, TY + R * 0.3], shaftH: [S.xm - 80, TY], ring: [S.rf - w * 2, TY - (R - 10 - ti)], crown: [S.xm - 600, TY - R], grout: [S.xm - 420, TY + R - 5], bed: [1500, TUN.bed(1500)], water: [1500, 820], shaft: [x0 - 40, GS + 200] };
 };
 // v1.16.1 · ciclo completo: excavar (0–0,6) → retraer cilindros (0,6–0,66) → montar 7 dovelas (0,66–0,94) → apoyar cilindros en el anillo nuevo (0,94–1)
 P.tbmState = (cyc, base = 900) => { const n = Math.floor(cyc), f = cyc - n, w = TUN.w, adv = f < 0.6 ? (f / 0.6) * w : w, build = f < 0.66 ? -1 : f < 0.94 ? Math.min(6.999, ((f - 0.66) / 0.28) * 7) : 7, retr = f < 0.6 ? 0 : f < 0.66 ? E.inOut((f - 0.6) / 0.06) : f < 0.94 ? 1 : 1 - E.inOut((f - 0.94) / 0.06); return { n, f, adv, build, retr, xm: base + n * w + adv, rf: base - 270 + n * w, excavating: f < 0.6 }; };
 // Tuneladora EPB en sección longitudinal, como UN SOLO SISTEMA: todas las piezas se colocan respecto al frente xm y al eje TY.
 // Cabeza (gira; sus aberturas dejan pasar el terreno) → árbol al rodamiento principal → mamparo → cámara llena de terreno acondicionado
 // → tornillo sinfín (entrada en la cámara, hélice que gira, motor y compuerta de salida) → cinta → vagonetas.
 // Cilindros: cuerpo fijo al anillo de empuje del escudo; vástago y zapata apoyados en la cara del último anillo (se extienden al excavar,
 // se retraen para montar y vuelven a apoyarse en el anillo nuevo). Erector con viga giratoria, brazo telescópico y pinza.
 P.tbmSide = (ctx, S, t, o = {}) => {
  const { TY, R, w, ti } = TUN, xm = S.xm, rot = o.rot ?? t * 1.2, flow = o.flow ?? 1, gl = o.glow || {}, Ro = R - 10, Ri = Ro - ti, xt = xm - 360, xH = xm - 18, xB = xm - 72, xC = xm - 64;
  ctx.save();
  // --- escudo: piel delantera, articulación y cola ---
  for (const s of [-1, 1]) { const g = ctx.createLinearGradient(0, TY + s * (R - 8), 0, TY + s * R); g.addColorStop(0, '#2a3a44'); g.addColorStop(1, TC.acero); tq(ctx, [[xt, TY + s * (R - 8)], [xH, TY + s * (R - 8)], [xH, TY + s * R], [xt, TY + s * R]], g); ctx.fillStyle = 'rgba(169,188,197,0.4)'; ctx.fillRect(xt, TY + s * R - (s > 0 ? 2 : 0), xH - xt, 2); ctx.fillStyle = '#1b262d'; ctx.fillRect(xm - 170, TY + s * (R - 8), 3, s * 8); }
  // interior del escudo (penumbra con estructura): de la cola al mamparo
  const x0i = S.rf + (S.build >= 0 ? w : 0); { const bg = ctx.createLinearGradient(0, TY - R, 0, TY + R); bg.addColorStop(0, '#18222a'); bg.addColorStop(0.5, '#27353e'); bg.addColorStop(1, '#141c22'); tq(ctx, [[x0i, TY - R + 8], [xB, TY - R + 8], [xB, TY + R - 8], [x0i, TY + R - 8]], bg); ctx.strokeStyle = 'rgba(169,188,197,0.12)'; ctx.lineWidth = 2; for (let x = xB - 30; x > x0i; x -= 30) { ctx.beginPath(); ctx.moveTo(x, TY - R + 8); ctx.lineTo(x, TY + R - 8); ctx.stroke(); } }
  // anillo de empuje (estructura donde se anclan los cilindros)
  for (const s of [-1, 1]) tq(ctx, [[xm - 150, TY + s * (R - 8)], [xm - 136, TY + s * (R - 8)], [xm - 136, TY + s * (R - 40)], [xm - 150, TY + s * (R - 40)]], '#4a5d69');
  // --- equipos posteriores (pórticos sobre ruedas), cinta y vagonetas ---
  const by = TY - R * 0.18; for (let x = xt - 20; x > xt - 760; x -= 150) { ctx.strokeStyle = '#4b5d68'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, TY + Ri - 10); ctx.lineTo(x, by - 14); ctx.lineTo(x - 120, by - 14); ctx.lineTo(x - 120, TY + Ri - 10); ctx.moveTo(x, TY + Ri - 10); ctx.lineTo(x - 120, by - 14); ctx.stroke(); tq(ctx, [[x - 100, TY + 10], [x - 30, TY + 10], [x - 30, TY + Ri - 14], [x - 100, TY + Ri - 14]], '#3c4d57'); ctx.fillStyle = '#20282d'; for (const wx of [x - 10, x - 110]) { ctx.beginPath(); ctx.arc(wx, TY + Ri - 6, 5, 0, TAU); ctx.fill(); } }
  // cinta: rodillos y marina que viaja hacia atrás
  ctx.fillStyle = '#20282d'; ctx.fillRect(xt - 780, by, (xm - 300) - (xt - 780), 4); for (let x = xm - 300; x > xt - 780; x -= 26) { ctx.beginPath(); ctx.arc(x, by + 6, 2.5, 0, TAU); ctx.fill(); }
  if (flow > 0) { ctx.fillStyle = TC.marina; const ph = (t * 55) % 20; for (let x = xm - 304 - ph; x > xt - 780; x -= 20) { ctx.beginPath(); ctx.ellipse(x, by - 3, 8, 4, 0, Math.PI, 0); ctx.fill(); } }
  for (let c = 0; c < 3; c++) { const x = xt - 820 - c * 70; tq(ctx, [[x - 30, TY + Ri - 42], [x + 30, TY + Ri - 42], [x + 26, TY + Ri - 10], [x - 26, TY + Ri - 10]], '#56636b'); ctx.fillStyle = TC.marina; ctx.beginPath(); ctx.ellipse(x, TY + Ri - 42, 28, 9, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#20282d'; ctx.beginPath(); ctx.arc(x - 16, TY + Ri - 6, 5, 0, TAU); ctx.arc(x + 16, TY + Ri - 6, 5, 0, TAU); ctx.fill(); }
  // --- dovelas en montaje dentro de la cola (vistas de canto: arriba/abajo cuando su ángulo lo permite) ---
  // mismo orden y ángulos que P.ringBuild: solera (abajo) primero; la clave (arriba) se cierra al final. En el plano de corte solo se ven
  // la solera y la clave; la dovela que lleva el erector se ve más o menos según lo cerca que pase del plano.
  const ORD = [3, 2, 4, 1, 5, 6, 0], AM = (j) => -Math.PI / 2 + (j + 0.5) * TAU / 7, kB = S.build >= 0 ? Math.floor(S.build) : -1;
  const slab = (y, up, c) => { ctx.fillStyle = c; ctx.fillRect(S.rf + 1, up ? y - ti : y, w - 2, ti); ctx.fillStyle = TC.sello; ctx.fillRect(S.rf + 1, up ? y - 3 : y, 2, 3); };
  if (kB >= 1) slab(TY + Ro - ti, false, TC.hormigon); if (kB >= 6) slab(TY - Ro + ti, true, TC.hormigon);
  // --- cilindros de empuje (varios, arriba y abajo): cuerpo fijo, vástago y zapata ---
  const rodEnd = S.excavating ? S.rf : lerp(S.rf, S.rf + w + 6, S.retr) + (S.build >= 7 ? 0 : 0); for (const s of [-1, 1]) for (const dy of [26, 46]) { const y = TY + s * (R - dy), xb0 = xm - 140, xb1 = xm - 215; const g = ctx.createLinearGradient(0, y - 8, 0, y + 8); g.addColorStop(0, '#6b8292'); g.addColorStop(0.5, '#8ea4b2'); g.addColorStop(1, '#425663'); tq(ctx, [[xb1, y - 8], [xb0, y - 8], [xb0, y + 8], [xb1, y + 8]], g); const re = S.build >= 7 && S.retr < 1 ? lerp(S.rf + w, S.rf + w + 6, S.retr) : rodEnd; ctx.fillStyle = '#d9e2e6'; ctx.fillRect(re, y - 4, xb1 - re, 8); ctx.fillStyle = '#2f3d46'; ctx.fillRect(re - 4, y - 11, 6, 22); if (gl.cyl) { ctx.strokeStyle = `rgba(255,212,71,${gl.cyl})`; ctx.lineWidth = 3; ctx.strokeRect(re - 7, y - 13, xb0 - re + 10, 26); } }
  // --- erector: viga giratoria, brazo telescópico y pinza que sostiene la dovela actual ---
  { const ex = S.rf + w / 2; ctx.fillStyle = '#3e505c'; ctx.fillRect(ex - 10, TY - 30, 20, 60); ctx.beginPath(); ctx.arc(ex, TY, 16, 0, TAU); ctx.fillStyle = '#5c7180'; ctx.fill(); ctx.strokeStyle = '#2c3a42'; ctx.lineWidth = 3; ctx.stroke();
   if (S.build >= 0 && S.build < 7) { const k = Math.floor(S.build), u = S.build - k, am = AM(ORD[k]); let d = am - Math.PI / 2; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; const a = Math.PI / 2 + d * E.inOut(cl((u - 0.22) / 0.48)), rr = lerp(Ro * 0.6, Ro * 0.7, E.inOut(cl(u / 0.22))) + Ro * 0.3 * E.inOut(cl((u - 0.7) / 0.3)), sn = Math.sin(a), vis = Math.pow(Math.abs(sn), 2), y = TY + rr * sn, down = sn > 0, yi = down ? y - ti : y + ti; ctx.save(); ctx.globalAlpha *= 0.35 + 0.65 * vis; ctx.strokeStyle = '#8a9aa4'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(ex, TY); ctx.lineTo(ex, (TY + yi) / 2); ctx.stroke(); ctx.strokeStyle = TC.oro; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex, (TY + yi) / 2); ctx.lineTo(ex, yi); ctx.stroke(); ctx.fillStyle = TC.hormigon; ctx.fillRect(S.rf + 1, down ? y - ti : y, w - 2, ti); ctx.fillStyle = TC.oro; ctx.fillRect(ex - 9, yi - 3, 18, 6); ctx.restore(); }
   else { ctx.strokeStyle = '#8a9aa4'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(ex, TY); ctx.lineTo(ex, TY + Ro * 0.45); ctx.stroke(); }
   if (gl.erector) P.glow(ctx, ex, TY, 80, '255,212,71', 0.45 * gl.erector); }
  // alimentador de dovelas (abajo, detrás del erector) con la siguiente dovela esperando
  tq(ctx, [[S.rf - 60, TY + Ri - 26], [S.rf - 4, TY + Ri - 26], [S.rf - 4, TY + Ri - 16], [S.rf - 60, TY + Ri - 16]], '#4f6470'); ctx.fillStyle = '#9aa4a7'; ctx.fillRect(S.rf - 56, TY + Ri - 36, 48, 10);
  // --- tornillo sinfín: entrada dentro de la cámara (por debajo), atraviesa el mamparo, sube hacia atrás; motor arriba; compuerta y tolva a la cinta ---
  const sa = [xm - 34, TY + R - 26], sb = [xm - 300, by - 26], SL = Math.hypot(sb[0] - sa[0], sb[1] - sa[1]), an = Math.atan2(sb[1] - sa[1], sb[0] - sa[0]);
  ctx.save(); ctx.translate(sa[0], sa[1]); ctx.rotate(an); const tg = ctx.createLinearGradient(0, -13, 0, 13); tg.addColorStop(0, '#5f7582'); tg.addColorStop(0.5, '#86a0ad'); tg.addColorStop(1, '#3f525e'); tq(ctx, [[0, -13], [SL, -13], [SL, 13], [0, 13]], tg);
  ctx.fillStyle = '#2a2018'; ctx.fillRect(3, -10, SL - 6, 20); // interior (corte)
  const ph = (t * 1.4 * flow) % 1; ctx.strokeStyle = '#c9d2d6'; ctx.lineWidth = 2.5; for (let x = -16 + ph * 16; x < SL - 4; x += 16) { if (x < 4) continue; ctx.beginPath(); ctx.moveTo(x, -10); ctx.quadraticCurveTo(x + 6, 0, x + 10, 10); ctx.stroke(); } ctx.fillStyle = '#9fb0b8'; ctx.fillRect(4, -2, SL - 8, 4);
  if (flow > 0) { ctx.fillStyle = TC.marina; for (let x = 6 + ((t * 48 * flow) % 16); x < SL - 6; x += 16) { ctx.beginPath(); ctx.ellipse(x, 4, 6, 4, 0, 0, TAU); ctx.fill(); } }
  ctx.restore();
  tq(ctx, [[sb[0] - 26, sb[1] - 20], [sb[0] + 4, sb[1] - 20], [sb[0] + 4, sb[1] + 8], [sb[0] - 26, sb[1] + 8]], '#5c7180'); ctx.fillStyle = '#2c3a42'; ctx.fillRect(sb[0] - 22, sb[1] - 16, 22, 4);
  tq(ctx, [[sb[0] - 2, sb[1] + 8], [sb[0] + 14, sb[1] + 8], [sb[0] + 8, by], [sb[0] - 6, by]], '#4f6470'); if (flow > 0) { ctx.fillStyle = TC.marina; const fy = sb[1] + 10 + ((t * 40) % (by - sb[1] - 12)); ctx.fillRect(sb[0] + 1, fy, 6, 5); }
  if (gl.screw) { ctx.save(); ctx.translate(sa[0], sa[1]); ctx.rotate(an); ctx.strokeStyle = `rgba(255,212,71,${gl.screw})`; ctx.lineWidth = 3; ctx.strokeRect(-6, -18, SL + 12, 36); ctx.restore(); }
  // --- accionamiento principal y árbol que une la cabeza con el rodamiento ---
  for (const s of [-1, 1]) { tq(ctx, [[xm - 122, TY + s * 18], [xB, TY + s * 18], [xB, TY + s * 44], [xm - 122, TY + s * 44]], '#5c7180'); ctx.fillStyle = '#3e505c'; ctx.fillRect(xm - 118, TY + s * 24 - (s < 0 ? 14 : 0), 40, 14); }
  tq(ctx, [[xm - 92, TY - 16], [xB, TY - 16], [xB, TY + 16], [xm - 92, TY + 16]], '#7c8e99');
  // --- mamparo de presión con sensores ---
  { const g = ctx.createLinearGradient(xB, 0, xC, 0); g.addColorStop(0, '#556b79'); g.addColorStop(1, '#7a92a1'); tq(ctx, [[xB, TY - R + 8], [xC, TY - R + 8], [xC, TY + R - 8], [xB, TY + R - 8]], g); for (const k of [-0.6, 0, 0.55]) { ctx.fillStyle = TC.protegida; ctx.beginPath(); ctx.arc(xC + 2, TY + k * R, 4, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(67,208,198,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xC + 2, TY + k * R); ctx.lineTo(xB - 6, TY + k * R); ctx.stroke(); } }
  // --- cámara de excavación LLENA de terreno acondicionado (con espuma) ---
  { ctx.save(); ctx.beginPath(); ctx.rect(xC, TY - R + 8, xH - xC, 2 * R - 16); ctx.clip(); const cg = ctx.createLinearGradient(0, TY - R, 0, TY + R); cg.addColorStop(0, '#8d6d4f'); cg.addColorStop(1, '#6b5039'); ctx.fillStyle = cg; ctx.fillRect(xC, TY - R, xH - xC, 2 * R); const Rr = H.rng(17); for (let i = 0; i < 90; i++) { const ph2 = (Rr() + t * 0.18 * flow) % 1, x = xC + 2 + Rr() * (xH - xC - 4), y = TY - R + 8 + ph2 * (2 * R - 16); ctx.fillStyle = Rr() < 0.25 ? 'rgba(235,225,205,0.5)' : 'rgba(45,32,22,0.5)'; ctx.beginPath(); ctx.arc(x, y, Rr.range(1.2, 3), 0, TAU); ctx.fill(); } ctx.restore(); if (gl.chamber) { ctx.strokeStyle = `rgba(67,208,198,${gl.chamber})`; ctx.lineWidth = 3; ctx.strokeRect(xC, TY - R + 8, xH - xC, 2 * R - 16); } }
  // boca de entrada del tornillo en la parte baja de la cámara: el terreno entra en el tubo
  { const ix = xm - 34, iy = TY + R - 26; ctx.fillStyle = '#5f7582'; ctx.beginPath(); ctx.ellipse(ix, iy, 9, 15, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#1a120c'; ctx.beginPath(); ctx.ellipse(ix + 1, iy, 6, 11, 0, 0, TAU); ctx.fill(); if (flow > 0) { ctx.fillStyle = TC.marina; for (let i = 0; i < 4; i++) { const ph5 = ((t * 0.9 + i / 4) % 1); ctx.beginPath(); ctx.arc(ix + 14 - ph5 * 14, iy - 20 + ph5 * 18, 2.6, 0, TAU); ctx.fill(); } } }
  // árbol de la cabeza atravesando la cámara hasta el rodamiento
  ctx.fillStyle = '#8a7a5c'; ctx.fillRect(xC, TY - 10, xH - xC, 20); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(xC, TY + 4, xH - xC, 6);
  // --- cabeza de corte en sección: placa con aberturas que giran (por ellas pasa el terreno) y herramientas en contacto con el frente ---
  { const op = [0, 1, 2].map((k) => TY + R * 0.62 * Math.sin(rot + (k * TAU) / 3)), gh = R * 0.2; const g = ctx.createLinearGradient(xH, 0, xm, 0); g.addColorStop(0, '#9c6a1e'); g.addColorStop(1, TC.corte); ctx.fillStyle = g; ctx.beginPath(); ctx.rect(xH, TY - R + 2, xm - xH, 2 * R - 4); for (const y of op) ctx.rect(xm, y - gh / 2, -(xm - xH), gh); ctx.fill('evenodd');
   ctx.fillStyle = '#6a4815'; ctx.fillRect(xH, TY - R + 2, 3, 2 * R - 4); for (let k = 0; k < 18; k++) { const a = rot + (k * TAU) / 9 + (k > 8 ? 0.35 : 0), rr = (k > 8 ? 0.42 : 0.84) * R, y = TY + rr * Math.sin(a), fr = Math.cos(a); if (fr < 0 || op.some((oy) => Math.abs(oy - y) < gh / 2 + 3)) continue; ctx.fillStyle = `rgba(53,71,81,${0.55 + 0.45 * fr})`; ctx.beginPath(); ctx.moveTo(xm, y - 5); ctx.lineTo(xm + 9 * fr, y - 1); ctx.lineTo(xm + 9 * fr, y + 1); ctx.lineTo(xm, y + 5); ctx.closePath(); ctx.fill(); }
   ctx.fillStyle = '#7a5212'; ctx.beginPath(); ctx.moveTo(xm, TY - 12); ctx.lineTo(xm + 14, TY); ctx.lineTo(xm, TY + 12); ctx.closePath(); ctx.fill();
   // terreno cortado que entra por las aberturas hacia la cámara (trayectoria física: frente → abertura → cámara)
   if (flow > 0) { const Rr = H.rng(23); ctx.fillStyle = 'rgba(110,80,52,0.9)'; for (let i = 0; i < 24; i++) { const k = i % 3, ph3 = (Rr() + t * 1.1 * flow) % 1, yy = op[k] + (Rr() - 0.5) * gh * 0.7, x = xm + 6 - ph3 * (xm + 6 - xC - 6); ctx.beginPath(); ctx.arc(x, yy + (x < xH ? (ph3 - 0.5) * 18 : 0), 2.4, 0, TAU); ctx.fill(); } }
   if (gl.head) { ctx.strokeStyle = `rgba(255,212,71,${gl.head})`; ctx.lineWidth = 3; ctx.strokeRect(xH - 4, TY - R - 4, 30, 2 * R + 8); } }
  // --- cepillos de cola e inyección de lechada al hueco anular detrás del escudo ---
  ctx.strokeStyle = '#1d262c'; ctx.lineWidth = 1.5; for (const s of [-1, 1]) for (let x = xt + 4; x < xt + 46; x += 4) { ctx.beginPath(); ctx.moveTo(x, TY + s * (R - 8)); ctx.lineTo(x + 3, TY + s * Ro); ctx.stroke(); }
  for (const s of [-1, 1]) { ctx.fillStyle = '#c0b49c'; ctx.fillRect(xt - 4, TY + s * (R - 6) - (s < 0 ? 0 : 4), 10, 4); }
  ctx.restore();
 };
 // Cabeza de corte EPB vista de frente (2,5D): aro robusto con cortadores perimetrales, 6 brazos en cajón con cara lateral (profundidad),
 // rascadores y rippers a lo largo de los brazos, grandes aberturas por las que entra el terreno, refuerzos y centro con cortador central.
 P.cutterFace = (ctx, cx, cy, R, ang, t, o = {}) => {
  ctx.save(); const dz = R * 0.035, rng = H.rng(77);
  // terreno del frente detrás (visible por las aberturas) que se desplaza hacia el interior
  const sg = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R); sg.addColorStop(0, '#3b2a1d'); sg.addColorStop(1, '#5a4330'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
  const Rr = H.rng(11); for (let i = 0; i < 160; i++) { const a = Rr() * TAU, ph = (Rr() + t * 0.5) % 1, rr = R * (0.95 - ph * 0.7); ctx.fillStyle = Rr() < 0.5 ? 'rgba(162,123,89,0.85)' : 'rgba(95,70,48,0.85)'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, R * 0.012 * (1 + Rr()), 0, TAU); ctx.fill(); }
  // placas frontales entre brazos: dejan ranuras de entrada junto a cada brazo (relación de apertura parcial, típica de una EPB)
  for (let i = 0; i < 6; i++) { const a0 = ang + (i * TAU) / 6 + 0.2, a1 = ang + ((i + 1) * TAU) / 6 - 0.2; ctx.beginPath(); ctx.arc(cx + dz * 0.6, cy + dz * 0.6, R * 0.92, a0, a1); ctx.arc(cx + dz * 0.6, cy + dz * 0.6, R * 0.2, a1, a0, true); ctx.closePath(); ctx.fillStyle = '#6a4815'; ctx.fill(); const pg = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.2, cx, cy, R); pg.addColorStop(0, '#dca246'); pg.addColorStop(1, '#a36c1f'); ctx.beginPath(); ctx.arc(cx, cy, R * 0.92, a0, a1); ctx.arc(cx, cy, R * 0.2, a1, a0, true); ctx.closePath(); ctx.fillStyle = pg; ctx.fill(); ctx.fillStyle = 'rgba(60,40,20,0.22)'; for (let k = 0; k < 8; k++) { const aa = lerp(a0, a1, rng()), rr2 = R * (0.25 + 0.6 * rng()); ctx.fillRect(cx + Math.cos(aa) * rr2, cy + Math.sin(aa) * rr2, R * 0.03, R * 0.008); } for (let r2 = 0.34; r2 < 0.9; r2 += 0.18) { const aa = (a0 + a1) / 2 + (r2 * 7 % 0.3) - 0.15; ctx.fillStyle = TC.acero; ctx.beginPath(); ctx.arc(cx + Math.cos(aa) * R * r2, cy + Math.sin(aa) * R * r2, R * 0.022, 0, TAU); ctx.fill(); } }
  // anillo interior de refuerzo
  ctx.strokeStyle = '#7a5212'; ctx.lineWidth = R * 0.05; ctx.beginPath(); ctx.arc(cx + dz, cy + dz, R * 0.56, 0, TAU); ctx.stroke(); ctx.strokeStyle = '#c98d2e'; ctx.beginPath(); ctx.arc(cx, cy, R * 0.56, 0, TAU); ctx.stroke();
  // brazos en cajón (cara lateral oscura = profundidad) con herramientas
  for (let i = 0; i < 6; i++) { const a = ang + (i * TAU) / 6, ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca, w0 = R * 0.075, r0 = R * 0.16, r1 = R * 0.97;
   const P4 = (r, s) => [cx + ca * r + nx * s, cy + sa * r + ny * s]; tq(ctx, [P4(r0, w0), P4(r1, w0), [P4(r1, w0)[0] + dz, P4(r1, w0)[1] + dz], [P4(r0, w0)[0] + dz, P4(r0, w0)[1] + dz]], '#6a4815');
   const g = ctx.createLinearGradient(P4(r0, -w0)[0], P4(r0, -w0)[1], P4(r0, w0)[0], P4(r0, w0)[1]); g.addColorStop(0, '#f0b955'); g.addColorStop(1, '#b97a22'); tq(ctx, [P4(r0, -w0), P4(r1, -w0), P4(r1, w0), P4(r0, w0)], g);
   ctx.fillStyle = 'rgba(60,40,20,0.25)'; for (let k = 0; k < 6; k++) ctx.fillRect(...P4(r0 + (r1 - r0) * rng(), (rng() - 0.5) * w0), R * 0.02, R * 0.006);
   // rascadores a ambos bordes y rippers en el eje
   for (let r = r0 + R * 0.06; r < r1 - R * 0.04; r += R * 0.085) { for (const s of [-1, 1]) { const p = P4(r, s * (w0 + R * 0.012)); ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(a); ctx.fillStyle = '#d7dde0'; ctx.fillRect(-R * 0.022, -R * 0.012, R * 0.044, R * 0.024); ctx.fillStyle = TC.acero; ctx.fillRect(-R * 0.022, s * R * 0.006, R * 0.044, R * 0.006); ctx.restore(); } }
   for (let r = r0 + R * 0.12; r < r1; r += R * 0.17) { const p = P4(r, 0); ctx.fillStyle = TC.acero; ctx.beginPath(); ctx.arc(p[0], p[1], R * 0.03, 0, TAU); ctx.fill(); ctx.fillStyle = TC.aceroL; ctx.beginPath(); ctx.arc(p[0] - R * 0.006, p[1] - R * 0.006, R * 0.012, 0, TAU); ctx.fill(); } }
  // aro exterior robusto con cortadores perimetrales (gálibo)
  ctx.strokeStyle = '#6a4815'; ctx.lineWidth = R * 0.09; ctx.beginPath(); ctx.arc(cx + dz, cy + dz, R * 0.95, 0, TAU); ctx.stroke(); const rg = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.5, cx, cy, R); rg.addColorStop(0, '#f2bd5c'); rg.addColorStop(1, '#a8701e'); ctx.strokeStyle = rg; ctx.lineWidth = R * 0.08; ctx.beginPath(); ctx.arc(cx, cy, R * 0.95, 0, TAU); ctx.stroke();
  for (let k = 0; k < 30; k++) { const a = ang + (k * TAU) / 30, p = [cx + Math.cos(a) * R * 0.99, cy + Math.sin(a) * R * 0.99]; ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(a); ctx.fillStyle = TC.acero; ctx.fillRect(-R * 0.012, -R * 0.022, R * 0.04, R * 0.044); ctx.restore(); }
  // centro: cubo con cortador central (cola de pez)
  ctx.fillStyle = '#7a5212'; ctx.beginPath(); ctx.arc(cx + dz, cy + dz, R * 0.17, 0, TAU); ctx.fill(); const cg = ctx.createRadialGradient(cx - R * 0.05, cy - R * 0.05, 1, cx, cy, R * 0.17); cg.addColorStop(0, '#f2c068'); cg.addColorStop(1, '#a8701e'); ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, R * 0.17, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.fillStyle = TC.acero; ctx.beginPath(); ctx.moveTo(-R * 0.12, -R * 0.03); ctx.lineTo(R * 0.12, -R * 0.03); ctx.lineTo(R * 0.15, 0); ctx.lineTo(R * 0.12, R * 0.03); ctx.lineTo(-R * 0.12, R * 0.03); ctx.lineTo(-R * 0.15, 0); ctx.closePath(); ctx.fill(); ctx.restore();
  P.glow(ctx, cx - R * 0.4, cy - R * 0.5, R * 0.9, '255,220,150', 0.12);
  ctx.restore(); const am = ang + 0.12; return { tool: [cx + Math.cos(ang) * R * 0.7, cy + Math.sin(ang) * R * 0.7], opening: [cx + Math.cos(am) * R * 0.75, cy + Math.sin(am) * R * 0.75], rim: [cx + Math.cos(ang + 0.1) * R * 0.95, cy + Math.sin(ang + 0.1) * R * 0.95], center: [cx, cy] };
 };
 // Montaje de un anillo visto de frente dentro de la cola del escudo. Dovelas con volumen (cara frontal + canto), anillo anterior con juntas
 // longitudinales ESCALONADAS respecto al actual, erector con corona giratoria, brazo telescópico y pinza de dos patines, alimentador abajo.
 // o: { placed (0..7 continuo) }. Orden: solera → laterales alternos → clave (llave al final).
 P.ringBuild = (ctx, cx, cy, R, t, o = {}) => {
  const Ro = R, Ri = R * 0.84, n = 7, gap = 0.012, pl = o.placed ?? 0, k = Math.floor(pl), u = pl - k, dep = 0.955, stag = Math.PI / n;
  const ann = (a0, a1, r0, r1, sc, c) => { ctx.beginPath(); ctx.arc(cx, cy, r1 * sc, a0, a1); ctx.arc(cx, cy, r0 * sc, a1, a0, true); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
  const seg = (a0, a1, rOut, front, back, glow) => { const s = rOut / Ro; ann(a0, a1, Ri * s, Ro * s, dep, back); ctx.beginPath(); ctx.moveTo(cx + Math.cos(a0) * Ri * s, cy + Math.sin(a0) * Ri * s); ctx.lineTo(cx + Math.cos(a0) * Ri * s * dep, cy + Math.sin(a0) * Ri * s * dep); ctx.arc(cx, cy, Ri * s * dep, a0, a1); ctx.lineTo(cx + Math.cos(a1) * Ri * s, cy + Math.sin(a1) * Ri * s); ctx.arc(cx, cy, Ri * s, a1, a0, true); ctx.closePath(); ctx.fillStyle = '#7e8789'; ctx.fill(); ann(a0, a1, Ri * s, Ro * s, 1, front); ctx.strokeStyle = 'rgba(48,60,67,0.9)'; ctx.lineWidth = Math.max(1.5, R * 0.006); ctx.beginPath(); ctx.arc(cx, cy, (Ri + (Ro - Ri) * 0.78) * s, a0 + 0.02, a1 - 0.02); ctx.stroke(); if (glow) { ctx.strokeStyle = `rgba(255,212,71,${glow})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, Ro * s, a0, a1); ctx.arc(cx, cy, Ri * s, a1, a0, true); ctx.closePath(); ctx.stroke(); } };
  ctx.save();
  // escudo (piel de acero con bisel interior)
  ctx.fillStyle = TC.acero; ctx.beginPath(); ctx.arc(cx, cy, R * 1.12, 0, TAU); ctx.arc(cx, cy, R * 1.01, 0, TAU, true); ctx.fill(); ctx.strokeStyle = 'rgba(169,188,197,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R * 1.11, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke(); ctx.fillStyle = '#151d22'; ctx.beginPath(); ctx.arc(cx, cy, R * 1.01, 0, TAU); ctx.fill();
  // anillo anterior (ya montado, más atrás): juntas desfasadas media dovela
  for (let i = 0; i < n; i++) { const a0 = -Math.PI / 2 + stag + (i * TAU) / n + gap, a1 = -Math.PI / 2 + stag + ((i + 1) * TAU) / n - gap; seg(a0, a1, Ro * 0.985, '#7d878a', '#646c6e'); }
  const order = [3, 2, 4, 1, 5, 6, 0], ang = (j) => [-Math.PI / 2 + (j * TAU) / n + gap, -Math.PI / 2 + ((j + 1) * TAU) / n - gap];
  for (let i = 0; i < Math.min(k, n); i++) { const [a0, a1] = ang(order[i]); seg(a0, a1, Ro, TC.hormigon, '#8f989b', o.glowPlaced ? o.glowPlaced : 0); }
  // erector: corona giratoria, contrapeso, brazo telescópico y pinza
  const j = k < n ? order[k] : order[n - 1], [b0, b1] = ang(j), am = (b0 + b1) / 2, start = Math.PI / 2; let d = am - start; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
  const p1 = E.inOut(cl(u / 0.22)), p2 = E.inOut(cl((u - 0.22) / 0.48)), p3 = E.inOut(cl((u - 0.7) / 0.3)), a = k < n ? start + d * p2 : am, rr = k < n ? lerp(Ro * 0.6, Ro * 0.7, p1) + (Ro - Ro * 0.7) * p3 : Ro * 0.6;
  ctx.strokeStyle = '#4b5d68'; ctx.lineWidth = R * 0.05; ctx.beginPath(); ctx.arc(cx, cy, R * 0.42, 0, TAU); ctx.stroke(); ctx.strokeStyle = '#6f8592'; ctx.lineWidth = R * 0.014; ctx.beginPath(); ctx.arc(cx, cy, R * 0.44, 0, TAU); ctx.stroke();
  const ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca; tq(ctx, [[cx - ca * R * 0.42 + nx * R * 0.09, cy - sa * R * 0.42 + ny * R * 0.09], [cx - ca * R * 0.3 + nx * R * 0.09, cy - sa * R * 0.3 + ny * R * 0.09], [cx - ca * R * 0.3 - nx * R * 0.09, cy - sa * R * 0.3 - ny * R * 0.09], [cx - ca * R * 0.42 - nx * R * 0.09, cy - sa * R * 0.42 - ny * R * 0.09]], '#3a4851');
  const rIn = rr - (Ro - Ri) - R * 0.04; for (const s of [-1, 1]) tq(ctx, [[cx + nx * s * R * 0.06, cy + ny * s * R * 0.06], [cx + ca * R * 0.46 + nx * s * R * 0.06, cy + sa * R * 0.46 + ny * s * R * 0.06], [cx + ca * R * 0.46 + nx * s * R * 0.03, cy + sa * R * 0.46 + ny * s * R * 0.03], [cx + nx * s * R * 0.03, cy + ny * s * R * 0.03]], '#5c7180');
  tq(ctx, [[cx + ca * R * 0.3 + nx * R * 0.035, cy + sa * R * 0.3 + ny * R * 0.035], [cx + ca * rIn + nx * R * 0.035, cy + sa * rIn + ny * R * 0.035], [cx + ca * rIn - nx * R * 0.035, cy + sa * rIn - ny * R * 0.035], [cx + ca * R * 0.3 - nx * R * 0.035, cy + sa * R * 0.3 - ny * R * 0.035]], TC.oro);
  for (const s of [-1, 1]) { const px = cx + ca * (rIn + R * 0.02) + nx * s * R * 0.07, py = cy + sa * (rIn + R * 0.02) + ny * s * R * 0.07; ctx.save(); ctx.translate(px, py); ctx.rotate(a + Math.PI / 2); ctx.fillStyle = '#2c3a42'; ctx.fillRect(-R * 0.035, -R * 0.02, R * 0.07, R * 0.04); ctx.restore(); }
  ctx.fillStyle = '#4b5d68'; ctx.beginPath(); ctx.arc(cx, cy, R * 0.14, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2c3a42'; ctx.lineWidth = R * 0.02; ctx.stroke();
  if (k < n) seg(b0 + (a - am), b1 + (a - am), rr, '#cfd6d8', '#9aa3a6', 0.7);
  // alimentador (abajo, delante de la solera) con la dovela siguiente
  if (k < n - 1 && o.feeder !== false) { ctx.fillStyle = '#4f6470'; ctx.fillRect(cx - R * 0.32, cy + R * 0.66, R * 0.64, R * 0.06); }
  ctx.restore();
  const [c0, c1] = ang(order[Math.max(0, Math.min(k, n) - 1)]); return { erector: [cx + ca * R * 0.38, cy + sa * R * 0.38], held: [cx + Math.cos(a) * (rr - (Ro - Ri) / 2), cy + Math.sin(a) * (rr - (Ro - Ri) / 2)], ring: [cx + Math.cos((c0 + c1) / 2) * (Ro + Ri) / 2, cy + Math.sin((c0 + c1) / 2) * (Ro + Ri) / 2], prev: [cx + Math.cos(-Math.PI / 2 + stag + 0.02) * Ro * 0.92, cy + Math.sin(-Math.PI / 2 + stag + 0.02) * Ro * 0.92], shield: [cx + R * 0.76, cy - R * 0.76] };
 };
 // Sección transversal del revestimiento en el terreno: terreno excavado (con agua en los poros), hueco anular que se rellena de lechada
 // (inyección desde abajo hacia arriba), anillo de 7 dovelas con juntas y sellos comprimidos, superficie interior seca.
 // o: { grout 0..1, press 0..1, glowJoint }
 P.ringSection = (ctx, cx, cy, R, t, o = {}) => {
  const Rb = R * 1.08, Ro = R, Ri = R * 0.86, n = 7, off = -Math.PI / 2 + Math.PI / n, gr = cl(o.grout ?? 1);
  ctx.save();
  const sg = ctx.createRadialGradient(cx, cy, Rb, cx, cy, Rb * 2.4); sg.addColorStop(0, '#9c7656'); sg.addColorStop(1, '#6e523b'); ctx.fillStyle = sg; ctx.fillRect(cx - 1200, cy - 1400, 2400, 2800);
  const Rr = H.rng(19); for (let i = 0; i < 420; i++) { const a = Rr() * TAU, r = Rb * (1.04 + Rr() * 1.6), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; ctx.fillStyle = Rr() < 0.3 ? 'rgba(41,135,167,0.45)' : 'rgba(0,0,0,0.12)'; ctx.beginPath(); ctx.arc(x, y, R * 0.008 * (1 + Rr()), 0, TAU); ctx.fill(); }
  // hueco anular (oscuro) y lechada que lo va llenando desde la solera hacia la clave por ambos lados
  ctx.fillStyle = '#20282c'; ctx.beginPath(); ctx.arc(cx, cy, Rb, 0, TAU); ctx.arc(cx, cy, Ro, 0, TAU, true); ctx.fill();
  if (gr > 0) { const sp = Math.PI * gr; ctx.fillStyle = TC.lechada; ctx.beginPath(); ctx.arc(cx, cy, Rb, Math.PI / 2 - sp, Math.PI / 2 + sp); ctx.arc(cx, cy, Ro, Math.PI / 2 + sp, Math.PI / 2 - sp, true); ctx.closePath(); ctx.fill(); if (gr < 1) for (const s of [-1, 1]) { const a = Math.PI / 2 + s * sp; P.glow(ctx, cx + Math.cos(a) * (Ro + Rb) / 2, cy + Math.sin(a) * (Ro + Rb) / 2, R * 0.08, '214,207,194', 0.6); } }
  // dovelas con juntas y sellos (en la ranura cerca de la cara exterior)
  for (let i = 0; i < n; i++) { const a0 = off + (i * TAU) / n + 0.008, a1 = off + ((i + 1) * TAU) / n - 0.008; const g = ctx.createRadialGradient(cx, cy, Ri, cx, cy, Ro); g.addColorStop(0, '#9aa4a7'); g.addColorStop(1, '#c4ccce'); ctx.beginPath(); ctx.arc(cx, cy, Ro, a0, a1); ctx.arc(cx, cy, Ri, a1, a0, true); ctx.closePath(); ctx.fillStyle = g; ctx.fill(); }
  for (let i = 0; i < n; i++) { const a = off + (i * TAU) / n, rS = Ro - (Ro - Ri) * 0.22; ctx.save(); ctx.translate(cx + Math.cos(a) * rS, cy + Math.sin(a) * rS); ctx.rotate(a); ctx.fillStyle = TC.sello; ctx.fillRect(-R * 0.025, -R * 0.016, R * 0.05, R * 0.032); ctx.restore(); if (o.glowJoint && i === 3) { P.glow(ctx, cx + Math.cos(a) * rS, cy + Math.sin(a) * rS, R * 0.12, '255,212,71', 0.5 * o.glowJoint); } }
  // interior seco
  const ig = ctx.createRadialGradient(cx, cy - R * 0.2, 4, cx, cy, Ri); ig.addColorStop(0, '#3e4b52'); ig.addColorStop(1, '#232d32'); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(cx, cy, Ri, 0, TAU); ctx.fill();
  const pr = o.press || 0; if (pr > 0) { ctx.save(); ctx.globalAlpha *= pr; for (let k = 0; k < 10; k++) { const a = (k * TAU) / 10 + 0.3; ctx.save(); ctx.translate(cx + Math.cos(a) * (Rb + R * 0.32), cy + Math.sin(a) * (Rb + R * 0.32)); ctx.rotate(a + Math.PI); P.hArrow(ctx, 0, 0, R * 0.2, TC.presion, R * 0.045); ctx.restore(); } ctx.restore(); }
  ctx.restore(); const aj = off + (3 * TAU) / n; return { grout: [cx + Math.cos(-0.6) * (Ro + Rb) / 2, cy + Math.sin(-0.6) * (Ro + Rb) / 2], seg: [cx + Math.cos(0.2) * (Ro + Ri) / 2, cy + Math.sin(0.2) * (Ro + Ri) / 2], joint: [cx + Math.cos(aj) * (Ro - (Ro - Ri) * 0.22), cy + Math.sin(aj) * (Ro - (Ro - Ri) * 0.22)], soil: [cx + Rb * 1.4, cy - Rb * 0.9], inside: [cx, cy + Ri * 0.4], top: [cx + Math.cos(off + (5 * TAU) / n) * Ro, cy + Math.sin(off + (5 * TAU) / n) * Ro] };
 };
 // Sección transversal: río que fluye a lo ancho, columna de agua, lecho, capas y el túnel (círculo) bajo el lecho.
 // o: { mode 'obra'|'terminado', cx, train 0..1 (tren visto de frente), boats, flow, press, xray (corte transparente), dusk, ring (dovelas visibles) }
 P.tunCross = (ctx, t, o = {}) => {
  const { GS, WS, TY, R, ti } = TUN, cx = o.cx ?? 540, XA = -1500, XB = 2600, yb = (x) => 965 + 16 * Math.sin(x * 0.006 + 1) + 8 * Math.sin(x * 0.021), Ro = R - 10, Ri = Ro - ti;
  ctx.save();
  const sg = ctx.createLinearGradient(0, -1200, 0, WS); sg.addColorStop(0, '#0B1821'); sg.addColorStop(1, o.dusk ? '#9a7458' : '#5d8aa4'); ctx.fillStyle = sg; ctx.fillRect(XA, -3000, XB - XA, WS + 3000);
  // orilla lejana con ciudad
  ctx.fillStyle = '#4d5a52'; ctx.fillRect(XA, WS - 40, XB - XA, 40); for (const b of CITY) { const x = (b.x * 1.3) % 4000 - 1500; ctx.fillStyle = b.c; ctx.fillRect(x, WS - 40 - b.h * 0.7, b.w * 0.8, b.h * 0.7); ctx.fillStyle = o.dusk ? 'rgba(255,214,150,0.6)' : 'rgba(215,237,240,0.18)'; for (let yy = WS - 40 - b.h * 0.7 + 8; yy < WS - 48; yy += 14) for (let xx = x + 5; xx < x + b.w * 0.8 - 5; xx += 11) if (((xx * 7 + yy * 3) | 0) % 5) ctx.fillRect(xx, yy, 4, 6); }
  // agua: columna con degradado, rayos, partículas y corriente que fluye hacia +x
  const ag = ctx.createLinearGradient(0, WS, 0, 1000); ag.addColorStop(0, TC.aguaL); ag.addColorStop(1, TC.aguaP); ctx.fillStyle = ag; ctx.fillRect(XA, WS, XB - XA, 1100 - WS);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = -3; k < 9; k++) { const x = k * 260 + 40 * Math.sin(t * 0.3 + k); const g = ctx.createLinearGradient(0, WS, 0, 990); g.addColorStop(0, 'rgba(120,200,220,0.12)'); g.addColorStop(1, 'rgba(120,200,220,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, WS); ctx.lineTo(x + 60, WS); ctx.lineTo(x + 150, 990); ctx.lineTo(x + 70, 990); ctx.closePath(); ctx.fill(); } ctx.restore();
  const fl = o.flow ?? 1; { const Rr = H.rng(13); for (let i = 0; i < 160; i++) { const y = Rr.range(WS + 10, 960), sp = Rr.range(30, 90) * fl, x = XA + ((Rr.range(0, XB - XA) + t * sp) % (XB - XA)); ctx.fillStyle = 'rgba(215,237,240,0.3)'; ctx.fillRect(x, y, 2 + sp * 0.06, 1.6); } }
  ctx.strokeStyle = TC.espuma; ctx.lineWidth = 3; ctx.beginPath(); for (let x = XA; x <= XB; x += 12) { const y = WS + 3 * Math.sin(x * 0.03 - t * 2.4); x === XA ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
  if (o.boats !== false) for (const [x0, sp, c, sc] of [[-100, 40, '#c9cfd2', 1], [700, 26, '#d4a24e', 0.8], [1300, 33, '#e8ecef', 0.6]]) { const x = -500 + ((x0 + 500 + t * sp) % 2100), y = WS + 2 * Math.sin(t * 1.4 + x0); tq(ctx, [[x - 90 * sc, y - 8], [x + 100 * sc, y - 8], [x + 78 * sc, y + 14], [x - 74 * sc, y + 14]], c); tq(ctx, [[x - 40 * sc, y - 40 * sc], [x + 36 * sc, y - 40 * sc], [x + 36 * sc, y - 8], [x - 40 * sc, y - 8]], '#e8ecef'); ctx.fillStyle = 'rgba(41,135,167,0.5)'; ctx.fillRect(x - 74 * sc, y + 14, 152 * sc, 6); }
  // lecho y capas
  const lay = [[(x) => yb(x), TC.arena], [(x) => Math.max(yb(x) + 50, 1150 + 20 * Math.sin(x * 0.004)), TC.arcilla], [(x) => 1505 + 18 * Math.sin(x * 0.003 + 1), TC.grava], [(x) => 1650 + 24 * Math.sin(x * 0.0025 + 2), TC.roca]];
  for (const [f, c] of lay) { ctx.beginPath(); ctx.moveTo(XA, 3400); for (let x = XA; x <= XB; x += 20) ctx.lineTo(x, f(x)); ctx.lineTo(XB, 3400); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 2; ctx.stroke(); }
  { const Rr = H.rng(6); ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let i = 0; i < 700; i++) { const x = Rr.range(XA, XB), y = Rr.range(yb(x) + 6, 2300); ctx.fillRect(x, y, 3, 2); } ctx.fillStyle = 'rgba(66,93,80,0.6)'; for (let x = XA; x < XB; x += 34) { const y = yb(x); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 3 + 4 * Math.sin(t + x), y - 14, x + 6, y); ctx.fill(); } }
  // lecho de sedimentos (limo) con ondulaciones y cáusticas de luz que se mueven sobre él
  { ctx.fillStyle = '#8f7d63'; ctx.beginPath(); ctx.moveTo(XA, yb(XA)); for (let x = XA; x <= XB; x += 16) ctx.lineTo(x, yb(x) - 2 + 2 * Math.sin(x * 0.09)); for (let x = XB; x >= XA; x -= 16) ctx.lineTo(x, yb(x) + 16); ctx.closePath(); ctx.fill(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(140,210,230,0.18)'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let x = XA; x <= XB; x += 14) { const y = yb(x) - 4 - k * 9 + 5 * Math.sin(x * 0.03 + t * 1.3 + k * 2); x === XA ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); } ctx.restore(); const hz = ctx.createLinearGradient(0, WS, 0, 990); hz.addColorStop(0, 'rgba(18,61,84,0)'); hz.addColorStop(1, 'rgba(18,61,84,0.35)'); ctx.fillStyle = hz; ctx.fillRect(XA, WS + 8, XB - XA, 980 - WS); }
  // corte transparente del terreno sobre el túnel
  if (o.xray) { ctx.save(); ctx.globalAlpha *= o.xray; ctx.fillStyle = 'rgba(244,247,248,0.12)'; ctx.fillRect(cx - R - 40, yb(cx), 2 * R + 80, TY - R - yb(cx)); ctx.strokeStyle = 'rgba(244,247,248,0.7)'; ctx.setLineDash([12, 10]); ctx.lineWidth = 3; ctx.strokeRect(cx - R - 40, yb(cx), 2 * R + 80, TY - R - yb(cx)); ctx.setLineDash([]); ctx.restore(); }
  // túnel: perforación, lechada, anillo de dovelas con juntas y sellos, interior
  ctx.fillStyle = TC.lechada; ctx.beginPath(); ctx.arc(cx, TY, R, 0, TAU); ctx.fill();
  const n = 7, off = o.ringOff ?? 0.2; for (let i = 0; i < n; i++) { const a0 = off + (i * TAU) / n + 0.012, a1 = off + ((i + 1) * TAU) / n - 0.012; ctx.beginPath(); ctx.arc(cx, TY, Ro, a0, a1); ctx.arc(cx, TY, Ri, a1, a0, true); ctx.closePath(); ctx.fillStyle = TC.hormigon; ctx.fill(); const am = off + (i * TAU) / n; ctx.fillStyle = TC.sello; ctx.beginPath(); ctx.arc(cx + Math.cos(am) * (Ro - 3), TY + Math.sin(am) * (Ro - 3), 2, 0, TAU); ctx.fill(); }
  const ig = ctx.createRadialGradient(cx, TY, 4, cx, TY, Ri); ig.addColorStop(0, o.mode === 'terminado' ? '#46555c' : '#1d272d'); ig.addColorStop(1, o.mode === 'terminado' ? '#2a353b' : '#10171b'); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(cx, TY, Ri, 0, TAU); ctx.fill();
  if (o.mode === 'terminado') { ctx.save(); ctx.beginPath(); ctx.arc(cx, TY, Ri, 0, TAU); ctx.clip(); ctx.fillStyle = '#8e979a'; ctx.fillRect(cx - Ri, TY + Ri * 0.55, 2 * Ri, Ri); ctx.fillStyle = '#c9d2d6'; ctx.fillRect(cx - Ri * 0.42, TY + Ri * 0.55 - 3, 5, 3); ctx.fillRect(cx + Ri * 0.38, TY + Ri * 0.55 - 3, 5, 3); for (const s of [-1, 1]) P.glow(ctx, cx + s * Ri * 0.6, TY - Ri * 0.55, 14, '255,236,200', 0.8);
   const tr = o.train ?? 0; if (tr > 0) { ctx.globalAlpha *= tr; const w2 = Ri * 0.62, h2 = Ri * 1.05, y1 = TY + Ri * 0.55 - 3; ctx.fillStyle = '#d9dee0'; ctx.beginPath(); ctx.roundRect(cx - w2, y1 - h2, 2 * w2, h2 - 2, [16, 16, 4, 4]); ctx.fill(); ctx.fillStyle = 'rgba(40,60,75,0.9)'; ctx.fillRect(cx - w2 * 0.75, y1 - h2 * 0.82, w2 * 1.5, h2 * 0.32); ctx.fillStyle = TC.protegida; ctx.fillRect(cx - w2, y1 - h2 * 0.32, 2 * w2, 3); for (const s of [-1, 1]) P.glow(ctx, cx + s * w2 * 0.6, y1 - h2 * 0.18, 14, '255,240,200', 0.9); } ctx.restore(); }
  const pr = o.press || 0; if (pr > 0) { ctx.save(); ctx.globalAlpha *= pr; for (let k = 0; k < 12; k++) { const a = (k * TAU) / 12; ctx.save(); ctx.translate(cx + Math.cos(a) * (R + 46), TY + Math.sin(a) * (R + 46)); ctx.rotate(a + Math.PI); P.hArrow(ctx, 0, 0, 34, TC.presion, 9); ctx.restore(); } for (let x = cx - 260; x <= cx + 260; x += 130) { ctx.save(); ctx.translate(x, WS + 60); ctx.rotate(Math.PI / 2); P.hArrow(ctx, 0, 0, 150, 'rgba(255,115,90,0.75)', 12); ctx.restore(); } ctx.restore(); }
  ctx.restore();
  return { tunnel: [cx, TY], crown: [cx, TY - Ro], ring: [cx + Ro * 0.7, TY - Ro * 0.7], bed: [cx, yb(cx)], water: [cx, (WS + yb(cx)) / 2], surface: [cx, WS], sand: [cx + 200, (yb(cx + 200) + 1150) / 2], clay: [cx + 260, 1250], gravel: [cx + 260, 1570] };
 };
 // Toma aérea de un río ancho atravesando una ciudad (perspectiva desde lo alto). o: { alt 0..1 (1 alto → 0 sobre el agua), dusk, tunnel (línea del trazado, 0..1) }
 P.riverAerial = (ctx, t, o = {}) => {
  const alt = o.alt ?? 1, hz = 360 - 260 * (1 - alt), f = 900, h = lerp(60, 600, alt), pr = (X, Z) => [540 + (X * f) / Z, hz + (h * f) / Z / 6 * 6 / 6 * 1 + 0], P3 = (X, Y, Z) => [540 + (X * f) / Z, hz + ((h - Y) * f) / Z];
  ctx.save();
  const sg = ctx.createLinearGradient(0, 0, 0, hz); sg.addColorStop(0, '#0B1821'); sg.addColorStop(1, o.dusk ? '#c08a5a' : '#7fa7bd'); ctx.fillStyle = sg; ctx.fillRect(0, 0, 1080, hz + 2);
  ctx.fillStyle = '#4e5a4c'; ctx.fillRect(0, hz, 1080, 1920 - hz);
  // río: banda curva que va hacia el horizonte
  const rX = (Z) => 80 * Math.sin(Z * 0.0018) - 40, rW = 380, zs = []; for (let Z = 220; Z < 9000; Z *= 1.06) zs.push(Z);
  ctx.beginPath(); zs.forEach((Z, i) => { const p = P3(rX(Z) - rW, 0, Z); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); zs.slice().reverse().forEach((Z) => { const p = P3(rX(Z) + rW, 0, Z); ctx.lineTo(p[0], p[1]); }); ctx.closePath(); const rg = ctx.createLinearGradient(0, hz, 0, 1920); rg.addColorStop(0, '#6f9fb2'); rg.addColorStop(0.3, TC.aguaL); rg.addColorStop(1, TC.aguaP); ctx.fillStyle = rg; ctx.fill();
  ctx.save(); ctx.clip(); const Rr = H.rng(41); ctx.strokeStyle = 'rgba(215,237,240,0.35)'; ctx.lineWidth = 2; for (let i = 0; i < 90; i++) { const X = Rr.range(-rW, rW), Z = 250 + ((Rr.range(0, 6000) - t * 160) % 6000 + 6000) % 6000, a = P3(rX(Z) + X, 0, Z), b = P3(rX(Z) + X, 0, Z + 60); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } ctx.restore();
  // trazado del túnel bajo el río (discontinuo)
  if (o.tunnel) { ctx.save(); ctx.globalAlpha *= o.tunnel; ctx.strokeStyle = TC.oro; ctx.lineWidth = 4; ctx.setLineDash([18, 12]); const Zt = 1500, a = P3(-1800, 0, Zt), b = P3(1800, 0, Zt); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); }
  // barcos
  for (const [X, Z0, sp, c] of [[-120, 1600, 90, '#e8ecef'], [140, 2600, -70, '#d4a24e'], [-40, 4200, 60, '#c9cfd2']]) { const Z = Z0 + ((t * sp) % 1200), p = P3(rX(Z) + X, 0, Z), s = f / Z; tq(ctx, [[p[0] - 14 * s, p[1] - 40 * s], [p[0] + 14 * s, p[1] - 40 * s], [p[0] + 16 * s, p[1] + 40 * s], [p[0] - 16 * s, p[1] + 40 * s]], c); ctx.strokeStyle = 'rgba(215,237,240,0.5)'; ctx.lineWidth = Math.max(1, 3 * s); ctx.beginPath(); ctx.moveTo(p[0] - 16 * s, p[1] + 40 * s); ctx.lineTo(p[0] - 40 * s, p[1] + 140 * s); ctx.moveTo(p[0] + 16 * s, p[1] + 40 * s); ctx.lineTo(p[0] + 40 * s, p[1] + 140 * s); ctx.stroke(); }
  // ciudad: bloques extruidos en ambas orillas (de lejos a cerca)
  const blocks = []; { const Rr = H.rng(43); for (let Z = 300; Z < 7000; Z += Rr.range(120, 220)) for (const s of [-1, 1]) for (let j = 0; j < 4; j++) { const X = rX(Z) + s * (rW + 90 + j * 260 + Rr.range(0, 60)), w = Rr.range(120, 200), d = Rr.range(100, 180), hb = Rr.range(80, 420) * (j === 0 ? 0.6 : 1); blocks.push({ X, Z, w, d, hb, c: Rr() < 0.5 ? '#3a4d5a' : '#465b68' }); } }
  blocks.sort((a, b) => b.Z - a.Z).forEach((b) => { const x0 = b.X - b.w / 2, x1 = b.X + b.w / 2, z0 = b.Z, z1 = b.Z + b.d; const F = [P3(x0, 0, z0), P3(x1, 0, z0), P3(x1, b.hb, z0), P3(x0, b.hb, z0)], T = [P3(x0, b.hb, z0), P3(x1, b.hb, z0), P3(x1, b.hb, z1), P3(x0, b.hb, z1)]; const side = b.X < 0 ? [P3(x1, 0, z0), P3(x1, 0, z1), P3(x1, b.hb, z1), P3(x1, b.hb, z0)] : [P3(x0, 0, z0), P3(x0, 0, z1), P3(x0, b.hb, z1), P3(x0, b.hb, z0)]; tq(ctx, side, '#2b3a44'); tq(ctx, F, b.c); tq(ctx, T, '#6f8592'); if (o.dusk) { ctx.fillStyle = 'rgba(255,214,150,0.5)'; const s = f / z0; for (let yy = 12; yy < b.hb - 10; yy += 26) { const p = P3(x0 + 10, yy, z0); ctx.fillRect(p[0], p[1] - 6 * s, (b.w - 20) * s, 6 * s); } } });
  ctx.restore();
 };
 // Junta entre dovelas en macro (corte por la junta): dos cantos de hormigón con ranura, sello elastomérico (perfil con huecos)
 // que se comprime al cerrar la junta; agua y terreno presionan desde fuera (arriba); la lechada rellena el espacio anular.
 P.gasketHD = (ctx, cx, cy, s, t, o = {}) => {
  const c = cl(o.close ?? 1), gap = lerp(s * 0.5, s * 0.06, c), th = s * 1.6, gw = s * 0.36, gh = lerp(s * 0.3, s * 0.2, c);
  ctx.save();
  // exterior: lechada y terreno con agua a presión
  ctx.fillStyle = TC.arcilla; ctx.fillRect(cx - s * 4, cy - th / 2 - s * 1.6, s * 8, s * 1.0); ctx.fillStyle = TC.lechada; ctx.fillRect(cx - s * 4, cy - th / 2 - s * 0.6, s * 8, s * 0.6);
  const wa = o.water ?? 1; if (wa > 0) { ctx.save(); ctx.globalAlpha *= wa; ctx.fillStyle = 'rgba(41,135,167,0.55)'; ctx.beginPath(); ctx.moveTo(cx - gap / 2 - s * 0.4, cy - th / 2 - s * 0.6); ctx.lineTo(cx + gap / 2 + s * 0.4, cy - th / 2 - s * 0.6); ctx.lineTo(cx + gap / 2, cy - th / 2); ctx.lineTo(cx + gap / 2, cy - th / 2 + s * 0.42); ctx.lineTo(cx - gap / 2, cy - th / 2 + s * 0.42); ctx.lineTo(cx - gap / 2, cy - th / 2); ctx.closePath(); ctx.fill(); for (const dx of [-1.6, 0, 1.6]) { ctx.save(); ctx.translate(cx + dx * s, cy - th / 2 - s * 1.5); ctx.rotate(Math.PI / 2); P.hArrow(ctx, 0, 0, s * 0.7, TC.presion, s * 0.16); ctx.restore(); } ctx.restore(); }
  // dos dovelas (cantos) con ranura para el sello
  for (const sg of [-1, 1]) { const x0 = sg < 0 ? cx - s * 4 : cx + gap / 2, x1 = sg < 0 ? cx - gap / 2 : cx + s * 4; const g = ctx.createLinearGradient(0, cy - th / 2, 0, cy + th / 2); g.addColorStop(0, '#c7cfd1'); g.addColorStop(1, '#949ea1'); ctx.fillStyle = g; ctx.fillRect(x0, cy - th / 2, x1 - x0, th); ctx.fillStyle = 'rgba(0,0,0,0.08)'; const Rr = H.rng(sg > 0 ? 3 : 4); for (let i = 0; i < 80; i++) ctx.fillRect(Rr.range(x0, x1), Rr.range(cy - th / 2, cy + th / 2), 2, 2);
   const ex = sg < 0 ? cx - gap / 2 : cx + gap / 2; ctx.fillStyle = '#2a3337'; ctx.fillRect(sg < 0 ? ex - gw * 0.55 : ex, cy - th / 2 + s * 0.42, gw * 0.55, gh + s * 0.04);
   // sello elastomérico con huecos (se comprime y ensancha)
   const gx0 = sg < 0 ? ex - gw * 0.55 : ex - (gw * 0.5 - gw * 0.55) * 0, gx = sg < 0 ? ex - gw * 0.5 : ex, wgt = gw * 0.5 + (c > 0.5 ? (c - 0.5) * 0.12 * s : 0); ctx.fillStyle = TC.sello; ctx.beginPath(); ctx.roundRect(sg < 0 ? ex - gw * 0.5 : ex, cy - th / 2 + s * 0.44, wgt, gh, s * 0.04); ctx.fill(); ctx.fillStyle = '#1b2226'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse((sg < 0 ? ex - gw * 0.5 : ex) + wgt * (0.2 + i * 0.3), cy - th / 2 + s * 0.44 + gh * 0.5, wgt * 0.08, gh * 0.25 * (1 - 0.5 * c), 0, 0, TAU); ctx.fill(); } void gx0; void gx; }
  // perno curvo de unión entre dovelas
  ctx.strokeStyle = '#5a6a73'; ctx.lineWidth = s * 0.12; ctx.beginPath(); ctx.moveTo(cx - s * 1.4, cy + th * 0.3); ctx.quadraticCurveTo(cx, cy + th * 0.05, cx + s * 1.4, cy + th * 0.3); ctx.stroke();
  // interior del túnel (seco)
  ctx.fillStyle = 'rgba(67,208,198,0.18)'; ctx.fillRect(cx - s * 4, cy + th / 2, s * 8, s * 0.9);
  ctx.restore();
  return { gasket: [cx, cy - th / 2 + s * 0.44 + gh / 2], water: [cx + s * 1.6, cy - th / 2 - s * 1.5], grout: [cx - s * 2.6, cy - th / 2 - s * 0.3], segL: [cx - s * 2.6, cy + th * 0.1], segR: [cx + s * 2.6, cy + th * 0.1], bolt: [cx + s * 1.0, cy + th * 0.22], inside: [cx - s * 2.8, cy + th / 2 + s * 0.45] };
 };
 // Interior de un túnel ferroviario terminado en perspectiva: anillos que se alejan, juntas, luminarias, bandejas de cables, andén de evacuación, vía y tren.
 // o: { train (z del frente del tren; null = sin tren), dir (1 se aleja / −1 se acerca), speed (para las luces), cam (desplazamiento lateral) }
 P.tunnelView = (ctx, t, o = {}) => {
  const vx = 540 + (o.cam || 0), vy = 900, F = 520, pr = (X, Y, z) => [vx + (X * F) / z, vy + (Y * F) / z];
  ctx.save(); ctx.fillStyle = '#0d1418'; ctx.fillRect(0, 0, 1080, 1920);
  // paredes: discos rellenos de cerca a lejos (más oscuros con la distancia) y juntas de anillo
  const zf = 60, sp = o.speed ?? 0, ph = (t * sp) % 0.6; for (let z = 0.3; z <= zf; z += 0.6) { const zz = z - ph; if (zz < 0.3) continue; const p = pr(0, 0, zz), rr = F / zz, sh = Math.max(0, Math.min(1, 1.1 / zz)); ctx.fillStyle = `rgb(${Math.round(26 + 104 * sh)},${Math.round(34 + 106 * sh)},${Math.round(38 + 106 * sh)})`; ctx.beginPath(); ctx.arc(p[0], p[1], rr, 0, TAU); ctx.fill(); ctx.strokeStyle = `rgba(20,26,30,${0.25 + 0.4 * sh})`; ctx.lineWidth = Math.max(1, 6 / zz); ctx.stroke(); for (let k = 0; k < 7; k++) { const a = ((Math.round(z / 0.6) % 2) * 0.45) + (k * TAU) / 7; ctx.beginPath(); ctx.moveTo(p[0] + Math.cos(a) * rr, p[1] + Math.sin(a) * rr); ctx.lineTo(p[0] + Math.cos(a) * F / (zz + 0.6), p[1] + Math.sin(a) * F / (zz + 0.6)); ctx.stroke(); } }
  ctx.fillStyle = '#0e1418'; ctx.beginPath(); ctx.arc(vx, vy, F / zf, 0, TAU); ctx.fill();
  // luminarias en la clave y bandejas
  for (let z = 1; z < 40; z += 2.4) { const zz = z - ((t * sp) % 2.4); if (zz < 0.7) continue; const a = pr(-0.55, -0.72, zz), b = pr(0.55, -0.72, zz); P.glow(ctx, a[0], a[1], 90 / zz, '255,236,200', 0.6); P.glow(ctx, b[0], b[1], 90 / zz, '255,236,200', 0.6); }
  ctx.strokeStyle = 'rgba(60,70,76,0.9)'; ctx.lineWidth = 6; for (const X of [-0.9, 0.9]) { const a = pr(X, -0.2, 0.3), b = pr(X, -0.2, zf); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  // solera, andén y vía
  tq(ctx, [pr(-0.84, 0.55, 0.28), pr(0.84, 0.55, 0.28), pr(0.84, 0.55, zf), pr(-0.84, 0.55, zf)], '#6f787b'); tq(ctx, [pr(0.55, 0.42, 0.28), pr(0.9, 0.42, 0.28), pr(0.9, 0.42, zf), pr(0.55, 0.42, zf)], '#8e979a'); tq(ctx, [pr(0.55, 0.42, 0.28), pr(0.55, 0.55, 0.28), pr(0.55, 0.55, zf), pr(0.55, 0.42, zf)], '#5c6669');
  for (let z = 0.3; z < 30; z += 0.35) { const zz = z - ((t * sp) % 0.35); if (zz < 0.29) continue; tq(ctx, [pr(-0.31, 0.55, zz), pr(0.21, 0.55, zz), pr(0.21, 0.55, zz + 0.07), pr(-0.31, 0.55, zz + 0.07)], '#3a3f42'); }
  { ctx.strokeStyle = '#b9c4c9'; ctx.lineWidth = 3; const a = pr(0.58, 0.18, 0.3), b = pr(0.58, 0.18, zf); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); for (let z = 0.4; z < 20; z += 1.2) { const zz = z - ((t * sp) % 1.2); if (zz < 0.32) continue; const p = pr(0.58, 0.42, zz), q = pr(0.58, 0.18, zz); ctx.lineWidth = Math.max(1, 4 / zz); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); } for (const [X, Y] of [[-0.92, -0.05], [-0.92, 0.08], [0.92, -0.3]]) { ctx.strokeStyle = 'rgba(70,80,86,0.95)'; ctx.lineWidth = 8; const a2 = pr(X, Y, 0.3), b2 = pr(X, Y, zf); ctx.beginPath(); ctx.moveTo(a2[0], a2[1]); ctx.lineTo(b2[0], b2[1]); ctx.stroke(); } const fg = ctx.createRadialGradient(vx, vy, 10, vx, vy, 420); fg.addColorStop(0, 'rgba(14,20,24,0.85)'); fg.addColorStop(1, 'rgba(14,20,24,0)'); ctx.fillStyle = fg; ctx.fillRect(vx - 420, vy - 420, 840, 840); }
  for (const X of [-0.195, 0.095]) { ctx.strokeStyle = '#c9d2d6'; ctx.lineWidth = 4; const a = pr(X, 0.54, 0.28), b = pr(X, 0.54, zf); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  // tren (frente visto de cara cuando se acerca)
  if (o.train != null && o.train > 0.6) { const z = o.train, w = 0.62, h = 1.0, a = pr(-0.05 - w / 2 - 0.0, 0.54 - h, z), b = pr(-0.05 + w / 2, 0.54, z); const W = b[0] - a[0], Hh = b[1] - a[1]; ctx.fillStyle = '#d9dee0'; ctx.beginPath(); ctx.roundRect(a[0], a[1], W, Hh, [W * 0.28, W * 0.28, W * 0.04, W * 0.04]); ctx.fill(); ctx.fillStyle = 'rgba(40,60,75,0.92)'; ctx.fillRect(a[0] + W * 0.12, a[1] + Hh * 0.14, W * 0.76, Hh * 0.3); ctx.fillStyle = TC.protegida; ctx.fillRect(a[0], a[1] + Hh * 0.66, W, Hh * 0.04); for (const s of [0.2, 0.8]) P.glow(ctx, a[0] + W * s, a[1] + Hh * 0.8, W * 0.35, '255,240,200', 0.85); }
  ctx.restore(); return { pr };
 };
 // ---------------- v1.17 · motor 3D ligero + puente colgante (Tacoma Narrows 1940): oscilación vertical, torsión, flujo y colapso ----------------
 // Cámara 3D: pos, tgt, f (focal en px). Proyección en perspectiva con orden del pintor y ocultación de caras traseras.
 P.cam3 = (pos, tgt, f = 900, roll = 0) => { const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], nrm = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const fw = nrm(sub(tgt, pos)); let rt = nrm(crs(fw, [0, 1, 0])), up = crs(rt, fw); if (roll) { const c = Math.cos(roll), s = Math.sin(roll), r2 = rt.map((v, i) => v * c + up[i] * s), u2 = up.map((v, i) => up[i] * c - rt[i] * s); rt = r2; up = u2; }
  const pr = (p) => { const v = sub(p, pos), z = dot(v, fw); return [540 + (f * dot(v, rt)) / Math.max(0.5, z), 960 - (f * dot(v, up)) / Math.max(0.5, z), z]; };
  // recorte de polígonos contra el plano cercano (z ≥ near) antes de proyectar: evita caras perdidas o invertidas cerca de la cámara
  const clip = (pts, near = 2) => { const C = pts.map((p) => { const v = sub(p, pos); return [dot(v, rt), dot(v, up), dot(v, fw)]; }), out = []; for (let i = 0; i < C.length; i++) { const a = C[i], b = C[(i + 1) % C.length], ia = a[2] >= near, ib = b[2] >= near; if (ia) out.push(a); if (ia !== ib) { const k = (near - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, near]); } } return out.map((c) => [540 + (f * c[0]) / c[2], 960 - (f * c[1]) / c[2], c[2]]); };
  return { pos, tgt, f, fw, rt, up, pr, clip, depth: (p) => dot(sub(p, pos), fw) }; };
 const hexRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
 const shade = (h, k, fog, fk) => { const a = hexRgb(h), b = hexRgb(fog); return `rgb(${a.map((v, i) => Math.round(lerp(Math.min(255, v * k), b[i], fk))).join(',')})`; };
 const TK = { fondo: '#0B1520', cielo: '#718797', tormenta: '#344956', nube: '#B6C5CA', acero: '#68777F', aceroS: '#34434B', aceroL: '#ADBCC2', hormigon: '#A5AAAB', calzada: '#474B4C', agua: '#274D61', espuma: '#D6E7E9', veg: '#455A46', viento: '#51C4E5', peligro: '#F17C56', energia: '#F4C466', oro: '#FFD447', blanco: '#F5F7F7' };
 P.TK = TK;
 // Geometría (metros): vano central 853, vanos laterales 335, tablero 11,9 de ancho con vigas laterales de alma llena de 2,4 m, torres de ~130 m.
 const TAC = { L: 853, Ls: 335, W: 11.9, Hg: 2.4, deckY: 58, towerTop: 130, sag: 71, hs: 15.24, xT: 426.5 }; TAC.xA = TAC.xT + TAC.Ls; P.TAC = TAC;
 // Estado del movimiento: { Av (amplitud vertical, m), nv (semiondas), fv (Hz), Th (amplitud de torsión, rad), ft (Hz), t, side (factor vanos laterales) }
 // Modo de torsión con un nodo en el centro del vano (las dos mitades giran en sentidos opuestos), como el 7-nov-1940.
 TAC.w = (x, m) => { if (Math.abs(x) >= TAC.xT) return 0; const u = (x + TAC.xT) / TAC.L; return (m.Av || 0) * Math.sin((m.nv || 6) * Math.PI * u) * Math.sin(TAU * (m.fv || 0.6) * m.t); };
 TAC.th = (x, m) => { if (Math.abs(x) >= TAC.xT) return 0; const u = (x + TAC.xT) / TAC.L; return (m.Th || 0) * Math.sin(TAU * u) * Math.sin(TAU * (m.ft || 0.2) * m.t + (m.ph || 0)); };
 // Colapso: tramos [xa, xb, tRotura]; después caen con gravedad y giro (cuerpo rígido), chocan con el agua y se hunden.
 const fallPose = (x, m, seg) => { const tau = m.t - seg[2]; if (tau <= 0) return null; const g = 9.81, y0 = TAC.deckY, ty = Math.max(0, y0 - 0.5 * g * tau * tau), th0 = TAC.th((seg[0] + seg[1]) / 2, { ...m, t: seg[2] }), xc = (seg[0] + seg[1]) / 2; const imp = Math.sqrt((2 * y0) / g), sink = Math.max(0, tau - imp); return { dy: ty - y0 - sink * 3, rot: th0 + (seg[3] || 0.35) * tau * (tau < imp ? 1 : 0.2), pitch: (seg[4] || 0.08) * tau * (x - xc) / 100, xc, tau, imp }; };
 TAC.segOf = (x, m) => (m.fail || []).find((s) => x >= s[0] && x <= s[1] && m.t > s[2]);
 // Puente completo en 3D. o: { m (estado), cam (P.cam3), cars:[{x, lane, c}], xray, wind (0..1 líneas de viento), glow:{girder, hangers}, fogK }
 P.tacBridge = (ctx, t, o = {}) => {
  const m = { t, ...(o.m || {}) }, cam = o.cam, pr = cam.pr, W2 = TAC.W / 2, fog = o.fog || '#8fa3ae', fogD = o.fogD || 6000, items = [], xr = o.xray || 0;
  const fk = (z) => cl(z / fogD) * 0.7;
  const poly = (pts, col, k = 1, cull = true, extra) => { const P2 = cam.clip(pts); if (P2.length < 3) return; if (cull) { let a = 0; for (let i = 0; i < P2.length; i++) { const p = P2[i], q = P2[(i + 1) % P2.length]; a += p[0] * q[1] - q[0] * p[1]; } if (a > 0) return; } const z = P2.reduce((s, p) => s + p[2], 0) / P2.length; items.push({ z, f: () => { ctx.beginPath(); P2.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = shade(col, k, fog, fk(z)); ctx.fill(); if (extra) extra(P2); } }); };
  const line = (a, b, col, wm, alpha = 1) => { const A2 = pr(a), B2 = pr(b); if (A2[2] < 1 || B2[2] < 1) return; const z = (A2[2] + B2[2]) / 2; items.push({ z: z - 0.01, f: () => { ctx.strokeStyle = shade(col, 1, fog, fk(z)); ctx.globalAlpha = alpha; ctx.lineWidth = Math.max(0.6, (wm * cam.f) / z); ctx.beginPath(); ctx.moveTo(A2[0], A2[1]); ctx.lineTo(B2[0], B2[1]); ctx.stroke(); ctx.globalAlpha = 1; } }); };
  const box = (x0, x1, y0, y1, z0, z1, col) => { const p = (x, y, z) => [x, y, z]; poly([p(x0, y1, z0), p(x1, y1, z0), p(x1, y1, z1), p(x0, y1, z1)].reverse(), col, 1.15); poly([p(x0, y0, z0), p(x1, y0, z0), p(x1, y1, z0), p(x0, y1, z0)], col, 0.95); poly([p(x1, y0, z1), p(x0, y0, z1), p(x0, y1, z1), p(x1, y1, z1)], col, 0.8); poly([p(x0, y0, z1), p(x0, y0, z0), p(x0, y1, z0), p(x0, y1, z1)], col, 0.7); poly([p(x1, y0, z0), p(x1, y0, z1), p(x1, y1, z1), p(x1, y1, z0)], col, 0.88); };
  // --- sección del tablero en x: centro, giro y puntos de borde (tras el colapso: pose de caída del tramo) ---
  const sect = (x) => { const seg = TAC.segOf(x, m); let yc = TAC.deckY + TAC.w(x, m), th = TAC.th(x, m), dx = 0; if (seg) { const fp = fallPose(x, m, seg); if (fp) { yc = TAC.deckY + TAC.w(x, { ...m, t: seg[2] }) + fp.dy + fp.pitch * 0; th = fp.rot * (x < fp.xc ? 1 : 1); yc += (x - fp.xc) * Math.sin(fp.pitch) ; } } const c = Math.cos(th), s = Math.sin(th); const P3 = (zz, yy) => [x + dx, yc + yy * c + zz * s, zz * c - yy * s]; return { yc, th, P3, seg }; };
  // --- tablero: segmentos entre estaciones; calzada, cara exterior de las vigas, coronación y fondo ---
  const inside = Math.abs(cam.pos[2]) < W2 + 1 && Math.abs(cam.pos[1] - TAC.deckY) < 25 && Math.abs(cam.pos[0]) < TAC.xA;
  const xs = []; for (let x = -TAC.xA; x <= TAC.xA + 0.1; x += TAC.hs / 2) xs.push(x);
  for (let i = 0; i < xs.length - 1; i++) { const a = sect(xs[i]), b = sect(xs[i + 1]); if ((a.seg || b.seg) && a.seg !== b.seg) continue; if (a.seg) { const fp = fallPose(xs[i], m, a.seg); if (fp && fp.tau > fp.imp + 2.5) continue; }
   const gT = 0.6, gB = -1.8, rw = W2 - 0.25;
   poly([a.P3(-rw, 0), b.P3(-rw, 0), b.P3(rw, 0), a.P3(rw, 0)], TK.calzada, 1.0, false, (Q) => { if (i % 6 === 0 && Q.length === 4) { ctx.strokeStyle = 'rgba(245,247,247,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo((Q[0][0] + Q[3][0]) / 2, (Q[0][1] + Q[3][1]) / 2); ctx.lineTo((Q[1][0] + Q[2][0]) / 2, (Q[1][1] + Q[2][1]) / 2); ctx.stroke(); } });
   for (const sg of [-1, 1]) { const zO = sg * W2, zI = sg * (W2 - 0.3); if (!inside) poly(sg < 0 ? [a.P3(zO, gB), b.P3(zO, gB), b.P3(zO, gT), a.P3(zO, gT)] : [b.P3(zO, gB), a.P3(zO, gB), a.P3(zO, gT), b.P3(zO, gT)], TK.acero, 1.0, true); poly([a.P3(zO, gT), b.P3(zO, gT), b.P3(zI, gT), a.P3(zI, gT)], TK.aceroL, 1.0, false); }
   poly([a.P3(W2, gB), b.P3(W2, gB), b.P3(-W2, gB), a.P3(-W2, gB)], TK.aceroS, 0.8, true);
   if (xr > 0 && i % 2 === 0) { line(a.P3(-W2, -0.4), a.P3(W2, -0.4), TK.aceroL, 0.25, xr); } }
  // --- cables principales (dos), con flecha parabólica, que acompañan a cada borde; en el tramo caído el cable sube al perder carga ---
  const cableY = (x, sg) => { const X = Math.abs(x); let y; if (X <= TAC.xT) { const u = x / TAC.xT; y = TAC.towerTop - TAC.sag * (1 - u * u); } else { const v = (X - TAC.xT) / TAC.Ls; y = TAC.towerTop - (TAC.towerTop - 22) * v - 38 * Math.sin(Math.PI * v) * 0.6 + (m.sideSag || 0) * Math.sin(Math.PI * v); } const sc = sect(x); if (!sc.seg) y += (TAC.w(x, m) + Math.sin(TAC.th(x, m)) * W2 * sg) * (X <= TAC.xT ? 0.92 : 0); else y += (m.lift || 10) * (1 - Math.exp(-(m.t - sc.seg[2]) / 1.2)) * (1 + 0.15 * Math.sin((m.t - sc.seg[2]) * 3)); return y; };
  for (const sg of [-1, 1]) { let prev = null; for (let x = -TAC.xA; x <= TAC.xA + 0.1; x += TAC.hs) { const p = [x, cableY(x, sg), sg * W2]; if (prev) line(prev, p, TK.aceroS, 0.9); prev = p; } }
  // --- péndolas: del cable al borde superior de la viga; si su tramo cayó, cuelgan sueltas ---
  for (let x = -TAC.xA + TAC.hs; x < TAC.xA; x += TAC.hs) { if (Math.abs(Math.abs(x) - TAC.xT) < 8) continue; const sc = sect(x); for (const sg of [-1, 1]) { const top = [x, cableY(x, sg), sg * W2]; if (sc.seg) { const tau = m.t - sc.seg[2], len = Math.min(18, top[1] - TAC.deckY); line(top, [x + Math.sin(tau * 2 + x) * 2, top[1] - len, sg * W2], TK.aceroL, 0.12, 0.8); continue; } if ((m.snap || []).some((s) => Math.abs(s[0] - x) < 1 && m.t > s[1])) { line(top, [x, top[1] - 10, sg * W2], TK.peligro, 0.14, 0.9); continue; } line(top, sc.P3(sg * W2, 0.6), o.glow && o.glow.hangers ? TK.energia : TK.aceroL, 0.12, 0.9); } }
  // --- torres: dos patas, travesaños y arriostramiento en X; pilas de hormigón en el agua ---
  for (const xt of [-TAC.xT, TAC.xT]) { box(xt - 18, xt + 18, -4, 9, -16, 16, TK.hormigon); for (const sg of [-1, 1]) box(xt - 2.4, xt + 2.4, 9, TAC.towerTop + 2, sg * W2 - 2.2, sg * W2 + 2.2, TK.acero); for (const yy of [TAC.deckY - 6, 92, TAC.towerTop - 3]) box(xt - 2, xt + 2, yy - 2.5, yy + 2.5, -W2 + 2, W2 - 2, TK.acero); for (const [ya, yb] of [[TAC.deckY - 4, 92], [92, TAC.towerTop - 4]]) { line([xt - 1.8, ya, -W2 + 2], [xt - 1.8, yb, W2 - 2], TK.aceroS, 0.6); line([xt - 1.8, yb, -W2 + 2], [xt - 1.8, ya, W2 - 2], TK.aceroS, 0.6); } box(xt - 2.6, xt + 2.6, TAC.towerTop + 2, TAC.towerTop + 6, -W2 - 2.4, W2 + 2.4, TK.aceroS); }
  // --- anclajes en tierra y pilas de los vanos laterales ---
  for (const s of [-1, 1]) { box(s * TAC.xA - 20, s * TAC.xA + 20, 0, 24, -14, 14, TK.hormigon); for (let k = 1; k <= 2; k++) { const x = s * (TAC.xT + (k * TAC.Ls) / 3); box(x - 2.5, x + 2.5, 0, TAC.deckY - 2, -W2 + 1, W2 - 1, TK.hormigon); } }
  // --- vehículos de 1940 sobre la calzada (siguen la sección) ---
  for (const c of o.cars || []) { const sc = sect(c.x); if (sc.seg) continue; const z0 = c.lane * W2 * 0.5, P3 = sc.P3; const L = 5, Wc = 1.9, H1 = 1.0, H2 = 1.6; const q = (dx, dz, y) => { const s2 = sect(c.x + dx); return s2.P3(z0 + dz, y); }; poly([q(-L / 2, -Wc / 2, H1), q(L / 2, -Wc / 2, H1), q(L / 2, Wc / 2, H1), q(-L / 2, Wc / 2, H1)].reverse(), c.c, 1.1, false); poly([q(-L / 2, -Wc / 2, 0.3), q(L / 2, -Wc / 2, 0.3), q(L / 2, -Wc / 2, H1), q(-L / 2, -Wc / 2, H1)], c.c, 0.9, false); poly([q(-1.2, -Wc / 2 + 0.1, H1), q(1.0, -Wc / 2 + 0.1, H1), q(0.8, -Wc / 2 + 0.2, H2), q(-1.0, -Wc / 2 + 0.2, H2)], '#2a3136', 1, false); void P3; }
  items.sort((a, b) => b.z - a.z); for (const it of items) it.f();
  return { sect, cableY, pr };
 };
 // Entorno del estrecho en 3D: cielo con nubes, colinas lejanas con bosque, orillas, agua con oleaje y espuma, niebla. Se dibuja antes del puente.
 P.tacWorld = (ctx, t, o = {}) => {
  const cam = o.cam, pr = cam.pr, fog = o.fog || '#8fa3ae', warm = o.warm || 0;
  // cielo
  const hz = pr([cam.pos[0] + cam.fw[0] * 20000, 0, cam.pos[2] + cam.fw[2] * 20000])[1]; const sg = ctx.createLinearGradient(0, 0, 0, Math.max(200, hz)); sg.addColorStop(0, warm ? '#4a5560' : TK.tormenta); sg.addColorStop(1, warm ? '#c9a27e' : TK.cielo); ctx.fillStyle = sg; ctx.fillRect(0, 0, 1080, 1920);
  const R = H.rng(12); for (let i = 0; i < 14; i++) { const x = ((R.range(-300, 1400) + t * R.range(4, 12)) % 1700) - 300, y = R.range(60, Math.max(120, hz - 120)), w = R.range(220, 520); ctx.fillStyle = `rgba(182,197,202,${R.range(0.10, 0.28)})`; ctx.beginPath(); ctx.ellipse(x, y, w, w * 0.16, 0, 0, TAU); ctx.fill(); }
  // agua (plano y=0)
  const wg = ctx.createLinearGradient(0, hz, 0, 1920); wg.addColorStop(0, shade(TK.agua, 1.45, fog, 0.35)); wg.addColorStop(1, shade(TK.agua, 0.9, fog, 0)); ctx.fillStyle = wg; ctx.fillRect(0, hz, 1080, 1920 - hz);
  // colinas y orillas (bosque de Washington) a ambos lados del estrecho y al fondo
  const ridge = (pts0, seed, col) => { const Rr = H.rng(seed), top = pts0.map((p, i) => [p[0], p[1] + 40 * Math.sin(i * 0.7 + seed) + Rr.range(0, 18), p[2]]), base = pts0.map((p) => [p[0], 0, p[2]]).reverse(); for (let i = 0; i < top.length - 1; i++) { const P2 = cam.clip([top[i], top[i + 1], base[base.length - 2 - i], base[base.length - 1 - i]]); if (P2.length < 3) continue; ctx.beginPath(); P2.forEach((p, j) => (j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); } };
  const line3 = (a, b, n, h) => { const r = []; for (let i = 0; i <= n; i++) r.push([lerp(a[0], b[0], i / n), h, lerp(a[1], b[1], i / n)]); return r; };
  const hc = shade(TK.veg, 0.85, fog, 0.55); ridge(line3([-9000, 5200], [9000, 5200], 60, 170), 3, hc); ridge(line3([9000, -5200], [-9000, -5200], 60, 160), 5, hc); ridge(line3([4600, -5200], [4600, 5200], 40, 140), 6, hc); ridge(line3([-4600, 5200], [-4600, -5200], 40, 140), 9, hc);
  // orillas próximas: terreno con talud (bloques), a cada lado del vano central
  for (const s of [-1, 1]) { const x0 = s * 640, x1 = s * 4000, zz = 3000; const fillC = (pts, col) => { const P2 = cam.clip(pts); if (P2.length < 3) return; ctx.fillStyle = col; ctx.beginPath(); P2.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); };
   fillC([[x0, 0, -zz], [x0 + s * 120, 70, -zz], [x0 + s * 120, 70, zz], [x0, 0, zz]], shade(TK.veg, 0.7, fog, 0.25)); fillC([[x0 + s * 120, 70, -zz], [x1, 90, -zz], [x1, 90, zz], [x0 + s * 120, 70, zz]], shade(TK.veg, 0.95, fog, 0.2)); fillC([[x0 - s * 6, 0.2, -zz], [x0 + s * 14, 0.2, -zz], [x0 + s * 14, 0.2, zz], [x0 - s * 6, 0.2, zz]], 'rgba(214,231,233,0.6)');
   const Rt = H.rng(s > 0 ? 7 : 8); for (let i = 0; i < 260; i++) { const x = s * Rt.range(700, 2600), z = Rt.range(-2500, 2500), h = Rt.range(14, 30), b = pr([x, 72, z]), tp = pr([x, 72 + h, z]); if (b[2] < 2) continue; const w = Math.max(1, ((h * 0.35) * cam.f) / b[2]); ctx.fillStyle = shade('#3b5040', 1, fog, cl(b[2] / 4000) * 0.8); ctx.beginPath(); ctx.moveTo(b[0] - w, b[1]); ctx.lineTo(tp[0], tp[1]); ctx.lineTo(b[0] + w, b[1]); ctx.closePath(); ctx.fill(); } }
  // oleaje: destellos que se desplazan con el viento (eje z)
  const Rw = H.rng(21); ctx.strokeStyle = 'rgba(214,231,233,0.35)'; for (let i = 0; i < 420; i++) { const x = Rw.range(-1800, 1800), z = ((Rw.range(-1600, 1600) + t * 6) % 3200) - 1600, a = pr([x, 0, z]), b = pr([x + 8, 0, z]); if (a[2] < 2) continue; ctx.lineWidth = Math.max(0.6, 300 / a[2]); ctx.globalAlpha = cl(1 - a[2] / 3500) * 0.8; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } ctx.globalAlpha = 1;
  // niebla ligera sobre el estrecho
  const fgr = ctx.createLinearGradient(0, hz - 160, 0, hz + 120); fgr.addColorStop(0, 'rgba(182,197,202,0)'); fgr.addColorStop(0.6, 'rgba(182,197,202,0.35)'); fgr.addColorStop(1, 'rgba(182,197,202,0)'); ctx.fillStyle = fgr; ctx.fillRect(0, hz - 160, 1080, 280);
  return { hz };
 };
 // Viento visualizado en 3D: trazos semitransparentes que cruzan el estrecho (dirección +z), deterministas. o: { k (densidad 0..1), y0, y1 }
 P.tacWind = (ctx, t, cam, o = {}) => { const k = o.k ?? 1; if (k <= 0) return; const R = H.rng(31), n = Math.round(160 * k); ctx.save(); ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const x = R.range(-900, 900), y = R.range(o.y0 ?? 20, o.y1 ?? 130), sp = R.range(14, 22), z = ((R.range(0, 600) + t * sp) % 600) - 300, a = cam.pr([x, y, z]), b = cam.pr([x, y + Math.sin(t + i) * 0.5, z + 26]); if (a[2] < 2 || b[2] < 2) continue; const al = 0.45 * Math.sin(Math.PI * ((z + 300) / 600)); ctx.strokeStyle = `rgba(81,196,229,${al * k})`; ctx.lineWidth = Math.max(1, 900 / a[2]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } ctx.restore(); };
 // Sección transversal del tablero de 1940 (vigas laterales de alma llena + losa + vigas transversales) que gira th; flujo didáctico alrededor:
 // líneas de corriente que se desvían según el giro, separación detrás de las vigas y un remolino que recorre el tablero sincronizado con el giro;
 // momento aerodinámico (flecha curva) en fase con la velocidad de giro (aporta energía). o: { flow, vortex, moment, w (velocidad angular normalizada), type 'H'|'cajon', labels }
 P.tacSection = (ctx, cx, cy, s, th, t, o = {}) => {
  const W2 = TAC.W / 2, flow = o.flow ?? 1, type = o.type || 'H', c = Math.cos(th), sn = Math.sin(th), T2 = (z, y) => [cx + (z * c + y * sn) * s, cy - (y * c - z * sn) * s];
  ctx.save();
  // líneas de corriente (viento de izquierda a derecha)
  // línea de corriente que rodea el cuerpo girado (nunca lo atraviesa): y = yb ± (holgura + softplus(distancia))
  const sp = (x) => Math.log(1 + Math.exp(3 * x)) / 3, tn = Math.tan(th), env = (z) => Math.exp(-Math.pow(z / (W2 + 2.5), 4)), sline = (h, z) => { const e = env(z), yb = -tn * cl(z, -W2, W2) * e, sg2 = h >= 0 ? 1 : -1, gap = (type === 'H' ? 2.2 : 1.4) * e, d = sg2 * (h - yb); let y = yb + sg2 * (gap + sp(d - gap)) * e + h * (1 - e); if (type === 'H' && z > W2) { const k = Math.min(1, (z - W2) / 6) * Math.exp(-(z - W2) / 28); y += sg2 * 1.2 * Math.exp(-Math.abs(h) / 2.5) * k + 0.4 * Math.sin(z * 0.45 - t * 6 + h) * k * Math.exp(-Math.abs(h) / 1.8); } return y; };
  if (flow > 0) { const n = 14; for (let i = 0; i < n; i++) { const h = (i - (n - 1) / 2) * 1.3 + (i < n / 2 ? -0.2 : 0.2); ctx.beginPath(); for (let z = -40; z <= 46; z += 0.5) { const p = [cx + z * s, cy - sline(h, z) * s]; z === -40 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); } ctx.strokeStyle = `rgba(81,196,229,${0.55 * flow})`; ctx.lineWidth = 2.2; ctx.stroke(); }
   // partículas que viajan por el flujo
   const R = H.rng(4); ctx.fillStyle = `rgba(214,231,233,${0.8 * flow})`; for (let k = 0; k < 70; k++) { const h = R.range(-9, 9), z = ((R.range(0, 86) + t * 9) % 86) - 40; ctx.beginPath(); ctx.arc(cx + z * s, cy - sline(h, z) * s, 2.2, 0, TAU); ctx.fill(); } }
  // remolinos (zona de flujo separado) que recorren la cara superior/inferior según la fase del giro (representación didáctica, no sólidos)
  const vx = o.vortex ?? 0; if (vx > 0 && type === 'H') { for (let k = 0; k < 2; k++) { const ph = ((t * 0.2 + k * 0.5) % 1), z = lerp(-W2, W2 + 10, ph), up = (k === 0) === (Math.sin(t * TAU * 0.2) > 0) ? 1 : -1, p = [cx + z * s, cy - (up * 1.6) * s]; for (let r = 0; r < 3; r++) { ctx.strokeStyle = `rgba(81,196,229,${0.5 * vx * (1 - r * 0.25)})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p[0], p[1], (0.6 + r * 0.55) * s, t * 4 + r, t * 4 + r + Math.PI * 1.4); ctx.stroke(); } } }
  // sección
  const q = (pts, col) => { ctx.beginPath(); pts.forEach((p, i) => { const P2 = T2(p[0], p[1]); i ? ctx.lineTo(P2[0], P2[1]) : ctx.moveTo(P2[0], P2[1]); }); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  if (type === 'H') { for (const sg of [-1, 1]) q([[sg * W2 - 0.18, 0.6], [sg * W2 + 0.18, 0.6], [sg * W2 + 0.18, -1.8], [sg * W2 - 0.18, -1.8]], TK.acero); q([[-W2, 0.02], [W2, 0.02], [W2, -0.25], [-W2, -0.25]], TK.hormigon); q([[-W2, -0.25], [W2, -0.25], [W2, -0.55], [-W2, -0.55]], TK.aceroS); q([[-W2 + 0.3, 0.02], [W2 - 0.3, 0.02], [W2 - 0.3, 0.12], [-W2 + 0.3, 0.12]], TK.calzada); for (const sg of [-1, 1]) q([[sg * W2 - 0.6, 0.6], [sg * W2 + 0.6, 0.6], [sg * W2 + 0.6, 0.48], [sg * W2 - 0.6, 0.48]], TK.aceroL); }
  else { q([[-W2 - 2.5, -0.6], [-W2 + 0.5, 0.25], [W2 - 0.5, 0.25], [W2 + 2.5, -0.6], [W2 - 0.8, -2.0], [-W2 + 0.8, -2.0]], TK.aceroL); q([[-W2 + 0.3, 0.25], [W2 - 0.3, 0.25], [W2 - 0.3, 0.35], [-W2 + 0.3, 0.35]], TK.calzada); }
  // bordes marcados y eje de giro
  const eL = T2(-W2, 0.6), eR = T2(W2, 0.6), ce = T2(0, -0.5); if (o.edges) { ctx.fillStyle = TK.oro; for (const p of [eL, eR]) { ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, TAU); ctx.fill(); } ctx.fillStyle = TK.blanco; ctx.beginPath(); ctx.arc(ce[0], ce[1], 6, 0, TAU); ctx.fill(); }
  // momento aerodinámico: flecha curva cuyo sentido sigue a la velocidad de giro (en fase → aporta energía)
  const mo = o.moment ?? 0; if (mo > 0 && Math.abs(o.w || 0) > 0.05) { const dir = Math.sign(o.w), r = (W2 + 3) * s, a0 = -0.9, a1 = 0.9; ctx.save(); ctx.strokeStyle = `rgba(241,124,86,${mo})`; ctx.fillStyle = `rgba(241,124,86,${mo})`; ctx.lineWidth = 10 * Math.min(1, Math.abs(o.w) + 0.3); ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 + a0 * dir, -Math.PI / 2 + a1 * dir, dir < 0); ctx.stroke(); const ae = -Math.PI / 2 + a1 * dir, ex = cx + Math.cos(ae) * r, ey = cy + Math.sin(ae) * r, tg = ae + (dir > 0 ? Math.PI / 2 : -Math.PI / 2); ctx.beginPath(); ctx.moveTo(ex + Math.cos(tg) * 26, ey + Math.sin(tg) * 26); ctx.lineTo(ex + Math.cos(tg + 2.5) * 22, ey + Math.sin(tg + 2.5) * 22); ctx.lineTo(ex + Math.cos(tg - 2.5) * 22, ey + Math.sin(tg - 2.5) * 22); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.restore(); return { left: eL, right: eR, center: ce, girder: T2(W2, -0.6), slab: T2(-W2 * 0.4, -0.1) };
 };
 // Ensayo en túnel de viento de un modelo seccional (montado sobre muelles): sección tipo 'H' (1940) u otra; th = giro actual.
 P.windTunnel = (ctx, cx, cy, w, h, th, t, o = {}) => { ctx.save(); P.rr(ctx, cx - w / 2, cy - h / 2, w, h, 18, '#13202a'); ctx.strokeStyle = TK.aceroL; ctx.lineWidth = 4; ctx.strokeRect(cx - w / 2 + 10, cy - h / 2 + 10, w - 20, h - 20); ctx.fillStyle = '#2a3a46'; ctx.fillRect(cx - w / 2 + 10, cy - h / 2 + 10, w - 20, 18); ctx.fillRect(cx - w / 2 + 10, cy + h / 2 - 28, w - 20, 18);
  ctx.beginPath(); ctx.rect(cx - w / 2 + 12, cy - h / 2 + 30, w - 24, h - 60); ctx.clip(); const s = Math.min(w / 46, h / 16); P.tacSection(ctx, cx, cy, s, th, t, { flow: 1, vortex: o.type === 'H' ? 0.8 : 0, type: o.type || 'H', moment: 0 });
  for (const sg of [-1, 1]) { const ax = cx + sg * (TAC.W / 2 + 1) * s * Math.cos(th), ay = cy + sg * (TAC.W / 2 + 1) * s * Math.sin(th); ctx.strokeStyle = TK.energia; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k <= 12; k++) { const yy = lerp(ay, cy - h / 2 + 30, k / 12); ctx.lineTo(ax + (k % 2 ? 8 : -8), yy); } ctx.stroke(); }
  ctx.restore(); };
 // Mapa estilizado del estado de Washington con Puget Sound y el estrecho de Tacoma (no es un mapa de precisión).
 P.mapWA = (ctx, x, y, w, h, t, o = {}) => { const L0 = -124.9, L1 = -116.8, A0 = 45.4, A1 = 49.2, pr = (lo, la) => [x + ((lo - L0) / (L1 - L0)) * w, y + ((A1 - la) / (A1 - A0)) * h];
  const st = [[-124.7, 48.4], [-123.2, 48.25], [-122.75, 49.0], [-117.03, 49.0], [-117.03, 46.0], [-118.98, 46.0], [-119.3, 45.93], [-120.5, 45.7], [-121.2, 45.6], [-122.3, 45.55], [-122.76, 45.65], [-123.1, 46.15], [-123.9, 46.25], [-124.05, 46.3], [-124.1, 46.9], [-124.2, 47.4], [-124.6, 48.0]];
  const ps = [[-122.75, 48.35], [-122.45, 48.2], [-122.33, 47.95], [-122.38, 47.62], [-122.42, 47.4], [-122.5, 47.3], [-122.55, 47.25], [-122.68, 47.18], [-122.9, 47.12], [-122.95, 47.22], [-122.78, 47.3], [-122.62, 47.33], [-122.6, 47.5], [-122.62, 47.7], [-122.68, 47.9], [-122.85, 48.1], [-123.1, 48.15]];
  ctx.save(); ctx.fillStyle = 'rgba(69,90,70,0.85)'; ctx.beginPath(); st.forEach((p, i) => { const q = pr(...p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.closePath(); ctx.fill(); ctx.strokeStyle = TK.aceroL; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = TK.agua; ctx.beginPath(); ps.forEach((p, i) => { const q = pr(...p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.closePath(); ctx.fill();
  const tn = pr(-122.55, 47.27); P.glow(ctx, tn[0], tn[1], 60, '255,212,71', 0.6 + 0.3 * Math.sin(t * 4)); ctx.fillStyle = TK.oro; ctx.beginPath(); ctx.arc(tn[0], tn[1], 9, 0, TAU); ctx.fill(); ctx.restore(); return { tacoma: tn }; };
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
  // v1.11 · capas de sonido para naves (recursos cinematográficos)
  encendido: (k, t, d = 2.5, g = 1) => { k.tone(t, { f: [[0, 30], [d, 70]], type: 'sawtooth', dur: d + 1, gain: 0.05 * g, filter: 'lowpass', f2: 320, a: d * 0.7, hold: 0.8 }); k.noise(t, { dur: d + 1, color: 'brown', filter: 'lowpass', f: [[0, 80], [d, 520]], gain: 0.18 * g, a: d * 0.8, hold: 0.5 }); k.tone(t + d * 0.6, { f: [[0, 220], [0.8, 440]], dur: 1.2, gain: 0.03 * g, verb: 0.4, a: 0.3 }); k.play('thud', t + d, { f: 60, gain: 0.4 * g }); },
  pasada: (k, t, d = 1.6, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 200], [d * 0.5, 1200], [d, 180]], q: 0.8, gain: 0.25 * g, a: d * 0.5 }); k.tone(t, { f: [[0, 70], [d * 0.5, 110], [d, 55]], type: 'sawtooth', dur: d, gain: 0.03 * g, filter: 'lowpass', f2: 300, a: d * 0.5 }); },
  holo: (k, t, g = 1) => { k.tone(t, { f: [[0, 900], [0.25, 1800]], dur: 0.35, gain: 0.04 * g, a: 0.01, verb: 0.3 }); k.tone(t + 0.08, { f: 2600, dur: 0.25, gain: 0.02 * g, a: 0.005, minor: true }); k.noise(t, { dur: 0.3, filter: 'highpass', f: 5000, gain: 0.03 * g, a: 0.05 }); },
  // v1.12 · montaña, piedra y agua
  lluviaFuerte: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'white', filter: 'bandpass', f: 2800, q: 0.6, gain: 0.06 * g, a: Math.min(1.2, d * 0.3), hold: d * 0.6 }); k.noise(t, { dur: d, color: 'pink', filter: 'lowpass', f: 900, gain: 0.08 * g, a: Math.min(1.2, d * 0.3), hold: d * 0.6 }); },
  golpePiedra: (k, t, n = 4, gap = 0.4, g = 1) => { for (let i = 0; i < n; i++) { k.play('thud', t + i * gap, { f: 120, gain: 0.3 * g }); k.noise(t + i * gap, { dur: 0.06, filter: 'bandpass', f: 1800, q: 1.5, gain: 0.25 * g, a: 0.001 }); k.tone(t + i * gap, { f: 1600 + (i % 2) * 300, dur: 0.08, gain: 0.03 * g, a: 0.001, minor: true }); } },
  abrasion: (k, t, d, g = 1) => { const R = H.rng(Math.round(t * 10) + 4); for (let x = 0; x < d; x += 0.32) k.noise(t + x, { dur: 0.28, color: 'pink', filter: 'bandpass', f: 1400 + R() * 400, q: 0.9, gain: 0.07 * g, a: 0.1 }); },
  encaje: (k, t, g = 1) => { k.play('thud', t, { f: 70, gain: 0.5 * g }); k.noise(t, { dur: 0.08, filter: 'bandpass', f: 900, q: 2, gain: 0.25 * g }); k.tone(t + 0.02, { f: 'A4', dur: 0.8, gain: 0.04 * g, verb: 0.3, minor: true }); },
  arroyo: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 1200], [d * 0.5, 1700], [d, 1300]], q: 1.2, gain: 0.06 * g, a: Math.min(1, d * 0.3), hold: d * 0.6 }); FX.goteo(k, t, Math.round(d * 2), 0.5, Math.round(t * 10)); },
  tiempo: (k, t, d = 2, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 400], [d, 3000]], q: 1.5, gain: 0.1 * g, a: d * 0.6 }); for (let i = 0; i < 8; i++) k.tone(t + i * d / 8, { f: 1800 - i * 120, dur: 0.3, gain: 0.02 * g, verb: 0.4, minor: true }); },
  // v1.13 · navegación nórdica
  oleaje: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: [[0, 300], [d * 0.5, 650], [d, 300]], gain: 0.16 * g, a: Math.min(1.5, d * 0.3), hold: d * 0.5 }); const R = H.rng(Math.round(t * 7)); for (let x = 0.4; x < d - 0.6; x += R.range(1.6, 2.6)) k.noise(t + x, { dur: 1.4, color: 'pink', filter: 'bandpass', f: [[0, 600], [0.5, 1400], [1.4, 500]], q: 0.7, gain: 0.08 * g, a: 0.35, hold: 0.3 }); },
  madera: (k, t, n = 3, g = 1) => { const R = H.rng(Math.round(t * 13)); for (let i = 0; i < n; i++) { const tt = t + i * R.range(0.5, 1.1), f = R.range(70, 120); k.tone(tt, { f: [[0, f], [0.25, f * 0.86], [0.5, f * 1.08]], type: 'sawtooth', dur: 0.55, gain: 0.04 * g, filter: 'bandpass', f2: f * 5, q: 4, a: 0.06, minor: true }); } },
  vela: (k, t, g = 1) => { for (let i = 0; i < 3; i++) k.noise(t + i * 0.09, { dur: 0.12, color: 'pink', filter: 'bandpass', f: 900 + i * 300, q: 1, gain: 0.09 * g, a: 0.005 }); k.play('thud', t + 0.32, { f: 85, gain: 0.35 * g }); k.noise(t + 0.3, { dur: 1.2, color: 'pink', filter: 'lowpass', f: 700, gain: 0.07 * g, a: 0.05 }); },
  cuerdas: (k, t, g = 1) => { k.tone(t, { f: [[0, 340], [0.3, 300], [0.5, 360]], type: 'sawtooth', dur: 0.5, gain: 0.025 * g, filter: 'bandpass', f2: 1200, q: 6, a: 0.04 }); k.play('tick', t + 0.4, { f: 1600, gain: 0.15 * g, minor: true }); },
  remo: (k, t, n = 4, gap = 1, g = 1) => { for (let i = 0; i < n; i++) { const tt = t + i * gap; k.noise(tt, { dur: 0.35, color: 'pink', filter: 'bandpass', f: [[0, 1800], [0.35, 700]], q: 1, gain: 0.1 * g, a: 0.01 }); k.tone(tt + 0.02, { f: [[0, 260], [0.12, 140]], dur: 0.15, gain: 0.06 * g }); k.noise(tt + 0.45, { dur: 0.4, color: 'pink', filter: 'lowpass', f: 900, gain: 0.04 * g, a: 0.1 }); } },
  pasos: (k, t, n = 4, gap = 0.42, g = 1) => { for (let i = 0; i < n; i++) k.play('tock', t + i * gap, { f: 170 + (i % 2) * 30, gain: 0.3 * g, minor: true }); },
  martillo: (k, t, n = 4, gap = 0.28, g = 1) => { for (let i = 0; i < n; i++) { k.play('tock', t + i * gap, { f: 900, gain: 0.35 * g }); k.play('click', t + i * gap + 0.01, { gain: 0.3 * g, minor: true }); } },
  mapa: (k, t, g = 1) => { k.noise(t, { dur: 0.6, color: 'pink', filter: 'bandpass', f: [[0, 2500], [0.6, 1200]], q: 0.8, gain: 0.07 * g, a: 0.05 }); k.play('whoosh', t + 0.1, { dur: 0.7, top: 1600, gain: 0.3 * g, minor: true }); },
  descubrir: (k, t, g = 1) => { ['E5', 'B5', 'E6', 'G#6'].forEach((f, i) => k.tone(t + i * 0.08, { f, dur: 1.4, gain: 0.06 * g, verb: 0.45, a: 0.01 })); k.play('riser', t - 0.6, { dur: 0.6, gain: 0.2 * g, minor: true }); },
  costa: (k, t, d, g = 1) => { FX.oleaje(k, t, d, 0.7 * g); k.noise(t, { dur: d, color: 'pink', filter: 'highpass', f: 3000, gain: 0.015 * g, a: 1, hold: d * 0.6 }); },
  // v1.14 · construcción y logística
  apisonar: (k, t, n = 6, gap = 0.4, g = 1) => { for (let i = 0; i < n; i++) { const tt = t + i * gap; k.tone(tt, { f: [[0, 120], [0.08, 55]], dur: 0.16, gain: 0.32 * g, a: 0.002 }); k.noise(tt, { dur: 0.18, color: 'brown', filter: 'lowpass', f: 500, gain: 0.12 * g, a: 0.002 }); k.noise(tt + 0.01, { dur: 0.25, color: 'pink', filter: 'bandpass', f: 1800, q: 0.8, gain: 0.025 * g, a: 0.01, minor: true }); } },
  vertido: (k, t, d = 1, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 900], [d, 500]], q: 0.6, gain: 0.09 * g, a: 0.08, hold: d * 0.6 }); const R = H.rng(Math.round(t * 11)); for (let x = 0; x < d; x += 0.05) k.play('tick', t + x + R() * 0.03, { f: 900 + R() * 900, gain: 0.05 * g, minor: true }); },
  ruedas: (k, t, d = 2, g = 1) => { k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: 260, gain: 0.08 * g, a: 0.3, hold: d * 0.7 }); for (let x = 0; x < d; x += 0.9) k.tone(t + x, { f: [[0, 230], [0.3, 190], [0.5, 250]], type: 'sawtooth', dur: 0.5, gain: 0.02 * g, filter: 'bandpass', f2: 900, q: 5, a: 0.05, minor: true }); },
  cascos: (k, t, n = 6, gap = 0.32, g = 1) => { for (let i = 0; i < n; i++) k.play('tock', t + i * gap + (i % 2) * 0.06, { f: 520 + (i % 2) * 60, gain: 0.22 * g, minor: true }); },
  ladrillo: (k, t, n = 3, gap = 0.45, g = 1) => { for (let i = 0; i < n; i++) { k.play('tock', t + i * gap, { f: 1100 + (i % 2) * 140, gain: 0.3 * g }); k.noise(t + i * gap + 0.02, { dur: 0.12, color: 'white', filter: 'bandpass', f: 3500, q: 1, gain: 0.03 * g, a: 0.003, minor: true }); } },
  hoguera: (k, t, d = 2, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: 1200, q: 0.5, gain: 0.05 * g, a: 0.4, hold: d * 0.6 }); const R = H.rng(Math.round(t * 17)); for (let x = 0; x < d; x += 0.06 + R() * 0.12) k.play('click', t + x, { gain: 0.08 * g, minor: true }); },
  pasosTierra: (k, t, n = 6, gap = 0.4, g = 1) => { for (let i = 0; i < n; i++) k.noise(t + i * gap, { dur: 0.12, color: 'brown', filter: 'bandpass', f: 600 + (i % 2) * 120, q: 1, gain: 0.07 * g, a: 0.005 }); },
  // v1.15 · sismos y estructuras
  temblor: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: [[0, 90], [d * 0.3, 160], [d, 80]], gain: 0.26 * g, a: Math.min(1.2, d * 0.25), hold: d * 0.55 }); k.tone(t, { f: [[0, 38], [d, 30]], dur: d, gain: 0.12 * g, a: Math.min(1.2, d * 0.25), hold: d * 0.55 }); const R = H.rng(Math.round(t * 9)); for (let x = 0.3; x < d - 0.3; x += R.range(0.35, 0.8)) k.noise(t + x, { dur: 0.25, color: 'pink', filter: 'bandpass', f: 380 + R() * 300, q: 1.2, gain: 0.04 * g, a: 0.02, minor: true }); },
  estructura: (k, t, n = 3, g = 1) => { const R = H.rng(Math.round(t * 13)); for (let i = 0; i < n; i++) { const tt = t + i * R.range(0.4, 0.9), f = R.range(55, 90); k.tone(tt, { f: [[0, f], [0.4, f * 0.85]], type: 'sawtooth', dur: 0.6, gain: 0.035 * g, filter: 'bandpass', f2: f * 4, q: 3, a: 0.06, minor: true }); } },
  hidraulico: (k, t, d = 1.2, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 700], [d * 0.5, 1300], [d, 800]], q: 1.4, gain: 0.06 * g, a: 0.15, hold: d * 0.5 }); k.tone(t, { f: [[0, 110], [d, 140]], type: 'triangle', dur: d, gain: 0.03 * g, a: 0.2 }); },
  metal: (k, t, g = 1) => { k.play('tock', t, { f: 1500, gain: 0.3 * g }); k.tone(t, { f: 2300, dur: 0.6, gain: 0.03 * g, a: 0.002, minor: true }); },
  trafico: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: 600, q: 0.6, gain: 0.03 * g, a: 1, hold: d * 0.7 }); const R = H.rng(Math.round(t * 3)); for (let x = 0.5; x < d - 1; x += R.range(1.5, 3)) k.noise(t + x, { dur: 1.4, color: 'pink', filter: 'bandpass', f: [[0, 400], [0.7, 900], [1.4, 380]], q: 1, gain: 0.03 * g, a: 0.5, minor: true }); },
  // v1.16 · túneles
  corteTBM: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'brown', filter: 'bandpass', f: [[0, 160], [d * 0.5, 220], [d, 170]], q: 0.9, gain: 0.12 * g, a: Math.min(0.8, d * 0.2), hold: d * 0.7 }); k.tone(t, { f: 42, type: 'sawtooth', dur: d, gain: 0.04 * g, filter: 'lowpass', f2: 300, a: 0.4, hold: d * 0.7 }); const R = H.rng(Math.round(t * 13)); for (let x = 0.2; x < d - 0.2; x += R.range(0.18, 0.4)) k.noise(t + x, { dur: 0.09, color: 'pink', filter: 'bandpass', f: R.range(700, 1500), q: 2, gain: 0.05 * g, a: 0.004, minor: true }); },
  sinfin: (k, t, d, g = 1) => { k.tone(t, { f: 65, type: 'triangle', dur: d, gain: 0.05 * g, a: 0.3, hold: d * 0.7 }); for (let x = 0; x < d; x += 0.33) k.noise(t + x, { dur: 0.22, color: 'brown', filter: 'bandpass', f: 380, q: 1.2, gain: 0.06 * g, a: 0.02, minor: true }); },
  tren: (k, t, d, g = 1) => { k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: [[0, 200], [d * 0.6, 700], [d, 250]], gain: 0.14 * g, a: d * 0.4, hold: d * 0.3 }); for (let x = 0.3; x < d - 0.3; x += 0.24) k.play('tick', t + x, { f: 700, gain: 0.07 * g, minor: true }); },
  // v1.17 · puente colgante y viento
  aleteo: (k, t, d, per = 5, g = 1) => { for (let x = 0; x < d; x += per / 2) k.noise(t + x, { dur: per / 2, color: 'brown', filter: 'lowpass', f: [[0, 120], [per / 4, 260], [per / 2, 120]], gain: 0.09 * g, a: per / 6, hold: 0.1 }); },
  desgarro: (k, t, g = 1) => { k.noise(t, { dur: 0.7, color: 'white', filter: 'bandpass', f: [[0, 2600], [0.7, 900]], q: 3, gain: 0.07 * g, a: 0.01 }); k.tone(t, { f: [[0, 420], [0.6, 160]], type: 'sawtooth', dur: 0.6, gain: 0.03 * g, filter: 'lowpass', f2: 1200 }); k.play('thud', t + 0.05, { f: 60, gain: 0.3 * g }); },
  salpicadura: (k, t, g = 1) => { k.play('thud', t, { f: 50, gain: 0.5 * g }); k.noise(t, { dur: 2.4, color: 'pink', filter: 'lowpass', f: [[0, 3000], [2.4, 300]], gain: 0.22 * g, a: 0.02 }); FX.burbujas(k, t + 0.2, 1.6, 10, Math.round(t * 10), 0.8 * g); },
 };
 // ---------------- MÚSICA ORQUESTAL SINTÉTICA (v1.13) ----------------
 // MUS.epica(k, t0, t1, { bpm, chords, gain, drums (0..1), strings (0..1), drone, ostinato (0..1) }): cuerdas con ataque lento,
 // bordón grave, ostinato de cuerdas y percusión de tambor grave (toms y marco). Todo en el bus de música; no toca SOUND.
 const MUS = {
  epica(k, t0, t1, p = {}) {
   const g = p.gain ?? 1, bpm = p.bpm || 80, beat = 60 / bpm, bar = beat * 4, ch = p.chords || [['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3'], ['C2', 'G2', 'C3', 'E3'], ['A1', 'E2', 'A2', 'C#3']];
   const hz = (n) => (typeof n === 'number' ? n : k.hz(n)); let i = 0;
   for (let t = t0; t < t1 - 0.05; t += bar, i++) { const c = ch[i % ch.length], len = Math.min(bar, t1 - t);
    const st = p.strings ?? 1; if (st > 0) c.forEach((n, q) => { const f = hz(n) * (q > 1 ? 2 : 1); k.tone(t, { f, type: 'sawtooth', dur: len + 0.5, gain: 0.012 * g * st, a: Math.min(0.9, len * 0.3), hold: len - 0.5, filter: 'lowpass', f2: 1100, bus: 'music', verb: 0.4, pan: (q - 1.5) * 0.35 }); k.tone(t, { f: f * 1.006, type: 'sawtooth', dur: len + 0.5, gain: 0.008 * g * st, a: Math.min(0.9, len * 0.3), hold: len - 0.5, filter: 'lowpass', f2: 900, bus: 'music', verb: 0.4 }); });
    if ((p.drone ?? 1) > 0) k.tone(t, { f: hz(c[0]) / 2, type: 'triangle', dur: len + 0.3, gain: 0.05 * g * (p.drone ?? 1), a: 0.3, hold: len - 0.3, bus: 'music' });
    const os = p.ostinato || 0; if (os > 0) for (let s = 0; s < 8 && t + s * beat / 2 < t1 - 0.05; s++) { const n = c[[1, 2, 3, 2, 1, 2, 3, 2][s]]; k.tone(t + s * beat / 2, { f: hz(n) * 2, type: 'sawtooth', dur: beat * 0.42, gain: 0.014 * g * os, a: 0.01, hold: beat * 0.2, filter: 'lowpass', f2: 1800, bus: 'music', verb: 0.25 }); }
    const dr = p.drums || 0; if (dr > 0) for (let b = 0; b < 4 && t + b * beat < t1 - 0.05; b++) { const tb = t + b * beat;
     if (b === 0 || b === 2) { k.tone(tb, { f: [[0, 95], [0.25, 48]], dur: 0.6, gain: 0.3 * g * dr, a: 0.003, bus: 'music', verb: 0.3 }); k.noise(tb, { dur: 0.25, color: 'brown', filter: 'lowpass', f: 300, gain: 0.12 * g * dr, a: 0.002, bus: 'music' }); }
     if (b === 3) { k.tone(tb + beat / 2, { f: [[0, 150], [0.2, 90]], dur: 0.3, gain: 0.14 * g * dr, a: 0.003, bus: 'music' }); }
     k.noise(tb + beat / 2, { dur: 0.08, color: 'pink', filter: 'bandpass', f: 1800, q: 1, gain: 0.03 * g * dr, a: 0.002, bus: 'music' }); }
   }
  },
  // golpe orquestal para revelaciones: tambor grave + acorde de cuerdas
  golpe(k, t, p = {}) { const g = p.gain ?? 1; k.tone(t, { f: [[0, 80], [0.5, 40]], dur: 1.6, gain: 0.35 * g, a: 0.003, bus: 'music', verb: 0.5 }); (p.chord || ['D3', 'A3', 'D4', 'F4']).forEach((n, q) => k.tone(t, { f: n, type: 'sawtooth', dur: 2.2, gain: 0.016 * g, a: 0.02, hold: 0.4, filter: 'lowpass', f2: 1600, bus: 'music', verb: 0.5, pan: (q - 1.5) * 0.3 })); },
 };
 window.PLANTILLA = { make, SKINS, P, FX, MUS, TRANS_SFX, setSkin: (n) => (SK = SKINS[n]), W, HH };
})();
