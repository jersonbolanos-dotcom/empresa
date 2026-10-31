// =====================================================================================================
// estilo_flat.js — funciones del estilo Flat-Vector Science tomadas de la referencia del kit
// (02_REFERENCIA_KIT/04_AI_STYLE_ATLAS/styles/flat-vector-helicopter-reference.js) y ADAPTADAS a 1080x1920:
//  glow, crescent, ball, rr, pill(label), bez, arrow, finish -> sin cambios de lógica (solo tamaños por parámetro).
//  sky -> degradado vertical crepuscular + partículas atmosféricas (no estrellas espaciales) para 9:16.
//  helicopter -> reconstruido: rotor principal con 2 palas proyectadas en perspectiva, desenfoque de giro,
//                rotor de cola, compuerta de rayos X opcional (motor/transmisión), morro inclinable (flare).
// H y SOUND se cargan sin modificar. Determinista: H.rng(semilla), nunca Math.random.
// =====================================================================================================
(function () {
 const TAU = Math.PI * 2, clamp = H.clamp, mix = H.mix, lerp = H.lerp;
 const C = {
  sky0: '#090b2c', sky1: '#18134f', sky2: '#3a1a6c', dusk0: '#233b75', dusk1: '#7250b2',
  ink: '#141846', visor: '#10164a', teal: ['#a4fbef', '#3ccbdc', '#1d64b0'], orange: ['#ffcc7a', '#ff8d3f', '#d24a2a'],
  yellow: '#ffd23f', red: '#ff3b5c', green: '#38e08e', cyan: '#56e8ff', cyan2: '#a4fbef', violet: '#8b5cff', txt: '#f6faff', txt2: '#bde5f8',
 };
 const F = { fr: (px, w = 700) => `${w} ${px}px "Fredoka"`, nu: (px, w = 900) => `${w} ${px}px "Nunito"` };
 function glow(ctx, x, y, r, col, a) {
  if (r < 1 || a <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, H.rgba(col, a)); g.addColorStop(0.4, H.rgba(col, a * 0.4)); g.addColorStop(1, H.rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
 }
 function crescent(ctx, x, y, r, dx, dy, color) {
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  ctx.beginPath(); ctx.rect(x - r - 2, y - r - 2, r * 2 + 4, r * 2 + 4); ctx.arc(x + dx, y + dy, r * 1.02, 0, TAU);
  ctx.fillStyle = color; ctx.fill('evenodd'); ctx.restore();
 }
 function ball(ctx, x, y, r, colors, o = {}) {
  if (r < 0.5) return;
  const la = o.la == null ? -2.25 : o.la, lx = Math.cos(la), ly = Math.sin(la);
  const g = ctx.createLinearGradient(x + lx * r, y + ly * r, x - lx * r, y - ly * r);
  g.addColorStop(0, colors[0]); g.addColorStop(0.48, colors[1]); g.addColorStop(1, H.rgba(mix(colors[1], colors[2], 0.65)));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  crescent(ctx, x, y, r, lx * r * 0.35, ly * r * 0.35, H.rgba(colors[2], 0.5));
  crescent(ctx, x, y, r, lx * r * 0.7, ly * r * 0.7, H.rgba(colors[2], 0.2));
  crescent(ctx, x, y, r, -lx * r * 0.075, -ly * r * 0.075, 'rgba(255,255,255,.37)');
 }
 function rr(ctx, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
 // píldora de rótulo (label() de la referencia) con escala/alpha para la aparición con rebote
 function pill(ctx, str, x, y, px = 40, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); const s = o.s == null ? 1 : o.s; ctx.scale(s, s);
  ctx.font = F.nu(px, 900); const tw = ctx.measureText(str).width, w = tw + px * 1.1, h = px * 1.65;
  ctx.fillStyle = 'rgba(9,11,44,.43)'; rr(ctx, -w / 2 + 3, -h / 2 + 6, w, h, h / 2); ctx.fill();
  ctx.fillStyle = o.bg || '#e7fbff'; rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = o.fg || C.ink; ctx.fillText(str, 0, 2);
  ctx.restore();
 }
 function text(ctx, str, x, y, font, col, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.font = font; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'alphabetic';
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.blur || 24; }
  ctx.fillStyle = col; ctx.fillText(str, x, y); ctx.restore();
 }
 // ---- cielo vertical crepuscular + partículas atmosféricas (reinterpretación de las estrellas) ----
 const PART = (() => { const r = H.rng(77); return Array.from({ length: 220 }, () => ({ x: r.range(-60, 1140), y: r.range(-60, 1980), r: r.range(0.8, 2.6), ph: r.range(0, TAU), z: r.range(0.2, 1) })); })();
 function sky(ctx, W, Hh, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, W * 0.2, Hh);
  g.addColorStop(0, C.sky0); g.addColorStop(0.38, C.sky1); g.addColorStop(0.68, C.sky2); g.addColorStop(1, o.warm ? '#7250b2' : C.dusk0);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
  glow(ctx, 900, 260, 720, '#6f41be', 0.26); glow(ctx, 150, 1500, 820, '#294caa', 0.34);
  if (o.sun != null) { glow(ctx, 760, o.sun, 520, '#ff8d3f', 0.22); glow(ctx, 760, o.sun, 160, '#ffcc7a', 0.35); }
  const vx = o.vx || 0, vy = o.vy || 0;
  for (const p of PART) {
   const x = ((p.x + vx * p.z * 0.6 + t * 6 * p.z) % 1200 + 1200) % 1200 - 60, y = ((p.y + vy * p.z * 0.6) % 2040 + 2040) % 2040 - 60;
   ctx.globalAlpha = (0.25 + 0.35 * Math.sin(t * 1.1 + p.ph)) * (0.3 + 0.7 * p.z);
   ctx.fillStyle = '#eaf7ff'; ctx.beginPath(); ctx.arc(x, y, p.r, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
 }
 function finish(ctx, W, Hh, t) {
  const tex = window.__flatVectorGrain || (window.__flatVectorGrain = (() => { const c = H.layer(128, 128), k = c.getContext('2d'), img = k.createImageData(128, 128), r = H.rng(4242); for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r() + r() + r() - 1.5) * 80; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; } k.putImageData(img, 0, 0); return c; })());
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.075;
  const p = ctx.createPattern(tex, 'repeat'); if (typeof DOMMatrix !== 'undefined' && p.setTransform) p.setTransform(new DOMMatrix().translateSelf(Math.floor(t * 24) * 47 % 128, Math.floor(t * 24) * 71 % 128));
  ctx.fillStyle = p; ctx.fillRect(0, 0, W, Hh); ctx.restore();
  // viñeta suave para profundidad (el original usa glows; esta pasada no satura color)
  const v = ctx.createRadialGradient(W / 2, Hh / 2, Hh * 0.35, W / 2, Hh / 2, Hh * 0.78); v.addColorStop(0, 'rgba(9,11,44,0)'); v.addColorStop(1, 'rgba(9,11,44,0.35)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, Hh);
 }
 function bez(P, u) { const v = 1 - u; return [v * v * v * P[0][0] + 3 * v * v * u * P[1][0] + 3 * v * u * u * P[2][0] + u * u * u * P[3][0], v * v * v * P[0][1] + 3 * v * v * u * P[1][1] + 3 * v * u * u * P[2][1] + u * u * u * P[3][1]]; }
 function arrow(ctx, P, prog, col, width = 9, options = {}) {
  if (prog <= 0) return; prog = clamp(prog);
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (options.alpha != null) ctx.globalAlpha *= options.alpha;
  if (options.dots) ctx.setLineDash([0.01, width * 1.9]);
  ctx.beginPath(); ctx.moveTo(...bez(P, 0)); for (let i = 1; i <= 50; i++) ctx.lineTo(...bez(P, prog * i / 50)); ctx.stroke(); ctx.setLineDash([]);
  if (options.head !== false) { const p = bez(P, prog), b = bez(P, Math.max(0, prog - 0.02)), a = Math.atan2(p[1] - b[1], p[0] - b[0]); ctx.translate(...p); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(width * 2, 0); ctx.lineTo(-width * 1.2, width * 1.3); ctx.lineTo(-width * 1.2, -width * 1.3); ctx.closePath(); ctx.fill(); }
  ctx.restore();
 }

 // ---- helicóptero (vista lateral, morro a la izquierda) ----
 // o: { phase (giro rotor, rad), spin (0..1 velocidad visual para desenfoque), power (0..1), fail (0..1), nose (rad, + = morro arriba), xray (0..1), tail (fase rotor cola) }
 function helicopter(ctx, x, y, s, o) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-(o.nose || 0)); ctx.scale(s, s);
  // cono de cola
  const tb = ctx.createLinearGradient(20, -40, 280, 40); tb.addColorStop(0, '#2a6fc0'); tb.addColorStop(1, '#173c86');
  ctx.fillStyle = tb; ctx.beginPath(); ctx.moveTo(40, -30); ctx.lineTo(290, -28); ctx.lineTo(292, -6); ctx.lineTo(40, 44); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(9,20,70,.35)'; ctx.beginPath(); ctx.moveTo(40, 20); ctx.lineTo(292, -12); ctx.lineTo(292, -6); ctx.lineTo(40, 44); ctx.fill();
  // deriva y estabilizador
  ctx.fillStyle = '#5acbd8'; ctx.beginPath(); ctx.moveTo(268, -26); ctx.lineTo(300, -92); ctx.lineTo(312, -90); ctx.lineTo(300, -10); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3ccbdc'; ctx.beginPath(); ctx.moveTo(250, -6); ctx.lineTo(296, -2); ctx.lineTo(292, 6); ctx.lineTo(246, 4); ctx.closePath(); ctx.fill();
  // rotor de cola (disco que gira)
  { const tp = o.tail || 0; ctx.save(); ctx.translate(304, -56); ctx.fillStyle = 'rgba(164,251,239,.18)'; ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fill(); ctx.strokeStyle = '#a4fbef'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.rotate(tp); ctx.beginPath(); ctx.moveTo(-38, 0); ctx.lineTo(38, 0); ctx.stroke(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, TAU); ctx.fill(); ctx.restore(); }
  // fuselaje: degradado de 3 paradas + sombra en media luna
  const g = ctx.createLinearGradient(-165, -105, 130, 120); g.addColorStop(0, '#a4fbef'); g.addColorStop(0.42, '#3ccbdc'); g.addColorStop(1, '#1d64b0');
  const body = () => { ctx.beginPath(); ctx.moveTo(-205, 14); ctx.bezierCurveTo(-206, -78, -110, -116, 30, -98); ctx.bezierCurveTo(140, -82, 150, 6, 92, 76); ctx.bezierCurveTo(20, 114, -162, 80, -205, 14); ctx.closePath(); };
  body(); ctx.fillStyle = g; ctx.fill();
  ctx.save(); body(); ctx.clip(); ctx.fillStyle = 'rgba(17,39,104,.38)'; ctx.beginPath(); ctx.ellipse(36, 74, 172, 62, -0.15, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.beginPath(); ctx.ellipse(-40, -96, 150, 22, -0.05, 0, TAU); ctx.fill(); ctx.restore();
  // capó del motor (encima del fuselaje)
  const hg = ctx.createLinearGradient(-10, -130, 120, -80); hg.addColorStop(0, '#7fe3ee'); hg.addColorStop(1, '#2a7fc4');
  ctx.fillStyle = hg; rr(ctx, -30, -126, 150, 36, 16); ctx.fill();
  // motor: brillo (potencia) o alerta (falla)
  const pw = o.power == null ? 1 : o.power, fl = o.fail || 0;
  if (pw > 0.01) glow(ctx, 70, -108, 120, '#ff8d3f', 0.3 * pw);
  if (fl > 0.01) glow(ctx, 70, -108, 130, '#ff3b5c', 0.32 * fl * (0.7 + 0.3 * Math.sin((o.t || 0) * 9)));
  // rayos X: tren de potencia visible dentro del capó
  if (o.xray > 0.01) {
   ctx.save(); ctx.globalAlpha *= o.xray; ctx.fillStyle = 'rgba(9,11,44,.75)'; rr(ctx, -24, -122, 138, 28, 12); ctx.fill();
   ctx.fillStyle = pw > 0.05 ? '#ff8d3f' : '#6c7aa0'; rr(ctx, 40, -118, 64, 20, 8); ctx.fill();
   ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(40, -108); ctx.lineTo(-6, -108); ctx.stroke();
   ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(-10, -108, 10, 0, TAU); ctx.fill(); ctx.restore();
  }
  // cabina
  const cg = ctx.createLinearGradient(-170, -87, -13, 65); cg.addColorStop(0, '#17368c'); cg.addColorStop(1, '#0a1a55');
  ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(-180, -12); ctx.quadraticCurveTo(-152, -96, -58, -84); ctx.quadraticCurveTo(-22, -20, -49, 62); ctx.quadraticCurveTo(-136, 78, -180, -12); ctx.fill();
  ctx.fillStyle = 'rgba(173,244,255,.3)'; ctx.beginPath(); ctx.moveTo(-154, -46); ctx.quadraticCurveTo(-126, -74, -86, -67); ctx.lineTo(-104, -57); ctx.lineTo(-154, -4); ctx.fill();
  // patines
  ctx.strokeStyle = '#b9f5fc'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-150, 136); ctx.quadraticCurveTo(-170, 136, -176, 124); ctx.moveTo(-150, 136); ctx.lineTo(78, 136); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-108, 82); ctx.lineTo(-96, 136); ctx.moveTo(36, 84); ctx.lineTo(46, 136); ctx.stroke();
  // mástil + cubo
  ctx.strokeStyle = '#a4fbef'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-10, -126); ctx.lineTo(-10, -156); ctx.stroke();
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(-10, -158, 13, 0, TAU); ctx.fill();
  // rotor principal: disco en perspectiva + 2 palas proyectadas (el rotor nunca se detiene en vuelo)
  rotorSide(ctx, -10, -160, 300, o.phase || 0, o.spin == null ? 1 : o.spin);
  ctx.restore();
 }
 function rotorSide(ctx, cx, cy, R, phase, spin) {
  const ry = R * 0.075;
  ctx.save();
  ctx.fillStyle = `rgba(164,251,239,${0.07 + 0.08 * spin})`; ctx.beginPath(); ctx.ellipse(cx, cy, R, ry, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = `rgba(164,251,239,${0.22 + 0.2 * spin})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, cy, R, ry, 0, 0, TAU); ctx.stroke();
  // estela de giro (arcos que siguen a cada pala)
  for (let b = 0; b < 2; b++) {
   const a0 = phase + b * Math.PI;
   for (let k = 1; k <= 5; k++) { const a = a0 - k * 0.09 * spin; ctx.strokeStyle = `rgba(164,251,239,${0.16 * (1 - k / 6) * spin})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * ry); ctx.stroke(); }
  }
  for (let b = 0; b < 2; b++) {
   const a = phase + b * Math.PI, ex = cx + Math.cos(a) * R, ey = cy + Math.sin(a) * ry, front = Math.sin(a) > 0;
   const gg = ctx.createLinearGradient(cx, cy, ex, ey); gg.addColorStop(0, '#a4fbef'); gg.addColorStop(0.6, '#3ccbdc'); gg.addColorStop(1, '#1d64b0');
   ctx.strokeStyle = gg; ctx.lineWidth = front ? 13 : 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
  }
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(cx, cy, 12, 0, TAU); ctx.fill();
  ctx.restore();
 }
 // rotor visto desde arriba (disco y palas)
 function rotorTop(ctx, cx, cy, R, phase, spin, o = {}) {
  ctx.save();
  glow(ctx, cx, cy, R * 1.35, o.glowCol || '#56e8ff', 0.18 + 0.1 * spin);
  ctx.fillStyle = 'rgba(164,251,239,.08)'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(164,251,239,.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
  for (let b = 0; b < 2; b++) {
   const a = phase + b * Math.PI;
   for (let k = 1; k <= 7; k++) { ctx.fillStyle = `rgba(164,251,239,${0.07 * (1 - k / 8) * spin})`; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 0.98, a - k * 0.07, a - (k - 1) * 0.07); ctx.closePath(); ctx.fill(); }
   ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
   const g = ctx.createLinearGradient(0, -14, R, 14); g.addColorStop(0, '#a4fbef'); g.addColorStop(0.45, '#3ccbdc'); g.addColorStop(1, '#1d64b0');
   ctx.fillStyle = g; rr(ctx, 10, -16, R - 10, 32, 14); ctx.fill(); ctx.fillStyle = 'rgba(5,16,62,.3)'; rr(ctx, 10, 2, R - 14, 12, 6); ctx.fill();
   ctx.restore();
  }
  ball(ctx, cx, cy, R * 0.09, ['#ffe9a0', '#ffd23f', '#c78a00']);
  ctx.restore();
 }
 // perfil (corte transversal) de pala con ángulo de paso
 function airfoil(ctx, x, y, s, ang) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-ang);
  const g = ctx.createLinearGradient(-160, -60, 170, 80); g.addColorStop(0, '#a4fbef'); g.addColorStop(0.5, '#3ccbdc'); g.addColorStop(1, '#1d64b0');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-180, 4); ctx.bezierCurveTo(-170, -44, -60, -54, 60, -34); ctx.bezierCurveTo(120, -24, 170, -6, 190, 4); ctx.bezierCurveTo(120, 18, -60, 36, -150, 30); ctx.bezierCurveTo(-176, 26, -184, 16, -180, 4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(17,39,104,.35)'; ctx.beginPath(); ctx.moveTo(-150, 30); ctx.bezierCurveTo(-60, 36, 120, 18, 190, 4); ctx.bezierCurveTo(100, 8, -60, 18, -150, 22); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-150, -20); ctx.quadraticCurveTo(-40, -50, 120, -24); ctx.stroke();
  ctx.restore();
 }
 window.FV = { C, F, TAU, glow, crescent, ball, rr, pill, text, sky, finish, bez, arrow, helicopter, rotorSide, rotorTop, airfoil };
})();
