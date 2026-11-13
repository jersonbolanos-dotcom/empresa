// =====================================================================================================
// episodio.js — ¿Por qué el cocodrilo casi no ha cambiado en millones de años? · PLANTILLA ASOMBROTECA v1.39 · «noche»
// UN solo vídeo con UN gancho (v1.34): el A. Voz: ElevenLabs Eleven v4, Dan, UNA toma (1.051 caracteres, 72,6 s); el tramo
// «Hace siglos que casi no cambia…» va con [QUITAR] (v1.39) → 70,5 s montados, voz intacta. Metáfora sostenida: la CUCHARA.
// Dirección visual del vídeo del rayo: planos que cambian con cada idea (río, ojos, boca, escamas, bajo el agua, desde arriba),
// cámara que se mueve (zoom y paneo), movimiento siempre (agua, cola, parpadeo, juncos), impactos (mordida, asteroide) con
// fogonazo, sacudida y golpe de sonido, viaje en el tiempo con contador grande. Todo dibujado; sin fotos ni marcas.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, DURATION, txt } = K;
 const S = (i) => A.segments[i].s;
 const YE = '#ffd23f', RD = '#ff4d5e', GR = '#22d27a', CY = '#8fd8ff';
 const PORTADA = typeof window !== 'undefined' && !!window.__SIN_SUBTITULOS;
 const Tk = {
  ojos: wt(1, 'ojos'), agua: wt(1, 'agua.'), sorprender: wt(2, 'sorprender.'), cuchara: wt(3, 'cuchara.'), funciona: wt(4, 'funciona.'), mismo: wt(5, 'mismo.'),
  doscientos: wt(6, 'doscientos'), dinos: wt(6, 'dinosaurios,'), parecidos: wt(7, 'parecidos'), arma: wt(8, 'arma'), lista: wt(8, 'lista:'), mordida: wt(9, 'mordida'), animal: wt(9, 'animal.'),
  evolucionado: wt(10, 'evolucionado…'), despacio: wt(11, 'despacio.'), cuchara2: wt(12, 'cuchara:'), detalles: wt(13, 'detalles.'),
  sesenta: wt(14, 'sesenta'), asteroide: wt(14, 'asteroide.'), desaparecieron: wt(15, 'desaparecieron…'), nadando: wt(16, 'nadando.'), sobrevivio: wt(17, 'sobrevivió?'),
  fria: wt(18, 'fría:'), sol: wt(19, 'sol'), menos: wt(19, 'menos…'), meses: wt(20, 'meses'), aguaT: wt(22, 'agua'), tierra: wt(22, 'tierra'), todo: wt(22, 'todo:'), sobrevivieron: wt(23, 'sobrevivieron.'),
  cuerpo: wt(25, 'cuerpo'), cambiar: wt(25, 'cambiar.'), hoy: wt(26, 'hoy,'), igual: wt(26, 'igual'), envia: S(27),
 };
 const T_ATAQUE = 1.55, T_MORDIDA = Tk.mordida - 0.05, T_IMPACTO = Tk.asteroide - 0.05;

 // ---------- cámara (igual que en el episodio del rayo): plano = centro (cx, cy) y zoom z; paneos y zooms suaves ----------
 const SY = 950;
 const camK = (t, Kf) => { if (t <= Kf[0][0]) return Kf[0].slice(1); for (let i = 0; i < Kf.length - 1; i++) { const [t0, x0, y0, z0] = Kf[i], [t1, x1, y1, z1] = Kf[i + 1]; if (t < t1) { const u = E.inOut(cl((t - t0) / Math.max(0.01, t1 - t0))); return [lerp(x0, x1, u), lerp(y0, y1, u), Math.exp(lerp(Math.log(z0), Math.log(z1), u))]; } } return Kf[Kf.length - 1].slice(1); };
 const sacude = (t, golpes, amp = 30) => { let x = 0, y = 0; for (const [g, f] of golpes) { const d = t - g; if (d >= 0 && d < 0.6) { const k = amp * f * Math.exp(-d * 7); x += Math.sin(d * 97) * k; y += Math.cos(d * 83) * k * 0.8; } } return [x, y]; };
 const vista = (ctx, cam, sh = [0, 0], sy = SY) => { ctx.translate(540 + sh[0], sy + sh[1]); ctx.scale(cam[2], cam[2]); ctx.translate(-cam[0], -cam[1]); };
 const fogonazo = (ctx, t, golpes, col = '255,255,255') => { let a = 0; for (const [g, f] of golpes) { const d = t - g; if (d >= 0 && d < 0.7) a = Math.max(a, Math.min(1, f) * (d < 0.07 ? 1 : Math.exp(-(d - 0.07) * 8))); } if (a > 0) { ctx.fillStyle = `rgba(${col},${0.95 * a})`; ctx.fillRect(-60, -60, W + 120, HH + 120); } };
 const fondoPlano = (ctx, c0, c1) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(-60, -60, W + 120, HH + 120); };

 // ---------- cielo de atardecer, sol, agua del río, juncos (mundo: superficie del agua y = 0) ----------
 const cieloTarde = (c, o = {}) => { const g = c.createLinearGradient(0, -1700, 0, 0); g.addColorStop(0, o.c0 || '#2a1d4a'); g.addColorStop(0.55, o.c1 || '#c2507a'); g.addColorStop(1, o.c2 || '#ffb35c'); c.fillStyle = g; c.fillRect(-4000, -2600, 8000, 2600);
  if (o.sol !== false) { const sx = o.sx ?? 380, sy = o.sy ?? -260; P.glow(c, sx, sy, 520, '255,200,120', 0.55); c.fillStyle = '#fff1c4'; c.beginPath(); c.arc(sx, sy, 120, 0, TAU); c.fill(); } };
 const orillaLejana = (c, t) => { c.fillStyle = '#3b2448'; c.beginPath(); c.moveTo(-4000, -10); for (let x = -4000; x <= 4000; x += 160) c.lineTo(x, -70 - 60 * Math.abs(Math.sin(x * 0.004 + 2)) - 30 * Math.sin(x * 0.013)); c.lineTo(4000, -10); c.closePath(); c.fill();
  c.fillStyle = '#2a1736'; for (let x = -3800; x < 4000; x += 260) { const h = 160 + 90 * Math.abs(Math.sin(x * 0.01)); c.beginPath(); c.ellipse(x, -70 - h * 0.6, 70, h * 0.45, 0, 0, TAU); c.fill(); c.fillRect(x - 6, -80 - h * 0.3, 12, h * 0.3 + 60); } };
 const agua = (c, t, o = {}) => { const g = c.createLinearGradient(0, 0, 0, 1600); g.addColorStop(0, o.top || '#8a4a6e'); g.addColorStop(0.15, '#3c3354'); g.addColorStop(1, '#0d1420'); c.fillStyle = g; c.fillRect(-4000, 0, 8000, 2400);
  if (o.sol !== false) { const sx = o.sx ?? 380; for (let k = 0; k < 14; k++) { const y = 20 + k * k * 6, w = 200 - k * 9 + Math.sin(t * 3 + k) * 30; c.fillStyle = `rgba(255,214,150,${0.5 - k * 0.03})`; c.fillRect(sx - w / 2 + Math.sin(t * 2 + k * 1.7) * 18, y, w, 6); } }
  const R = H.rng(71); c.lineWidth = 4; for (let i = 0; i < 70; i++) { const x0 = -2400 + R() * 4800, y = 12 + Math.pow(R(), 1.6) * 900, l = 60 + R() * 140 * (1 + y / 400), ph = t * (0.6 + R()) + R() * 6; c.strokeStyle = `rgba(255,220,190,${0.12 + 0.18 * (1 - y / 900)})`; c.beginPath(); c.moveTo(x0 + Math.sin(ph) * 30, y); c.quadraticCurveTo(x0 + l / 2, y - 6 * Math.sin(ph * 1.3), x0 + l, y); c.stroke(); } };
 const ondas = (c, x, y, t, t0, n = 3, r = 220, a = 1) => { for (let k = 0; k < n; k++) { const ph = ((t - t0) * 0.7 + k / n) % 1; if (t < t0) return; c.strokeStyle = `rgba(255,230,210,${0.6 * a * (1 - ph)})`; c.lineWidth = 5; c.beginPath(); c.ellipse(x, y, r * (0.2 + ph), r * 0.12 * (0.2 + ph), 0, 0, TAU); c.stroke(); } };
 const juncos = (c, t, x0, y0, n = 9, h = 520, seed = 3, col = '#1f2a1c') => { const R = H.rng(seed); c.save(); c.lineCap = 'round'; for (let i = 0; i < n; i++) { const x = x0 + (R() - 0.5) * 260, hh = h * (0.6 + R() * 0.5), sw = Math.sin(t * 1.6 + i * 0.7) * 30 + 20; c.strokeStyle = col; c.lineWidth = 10 + R() * 6; c.beginPath(); c.moveTo(x, y0); c.quadraticCurveTo(x + sw * 0.3, y0 - hh * 0.5, x + sw, y0 - hh); c.stroke();
   if (R() > 0.4) { c.fillStyle = '#4a2f1d'; c.save(); c.translate(x + sw, y0 - hh); c.rotate(sw * 0.004); c.beginPath(); c.roundRect(-11, -10, 22, 90, 11); c.fill(); c.restore(); } } c.restore(); };
 const salpicon = (c, x, y, t, t0, n = 30, r = 380, dur = 1.1) => { const d = t - t0; if (d < 0 || d > dur) return; const R = H.rng(Math.round(t0 * 100) + 9), q = d / dur; c.save(); for (let i = 0; i < n; i++) { const a = -Math.PI * (0.1 + R() * 0.8), v = (0.5 + R()) * r, px = x + Math.cos(a) * v * q * 1.3, py = y + Math.sin(a) * v * q * 1.6 + 900 * q * q; c.fillStyle = `rgba(220,235,255,${0.85 * (1 - q)})`; c.beginPath(); c.ellipse(px, py, 10 + R() * 14, 14 + R() * 18, a, 0, TAU); c.fill(); } c.restore(); };
 const pajaro = (c, x, y, s, t, vuela) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#1b1220'; if (!vuela) { c.beginPath(); c.ellipse(0, -60, 34, 22, -0.3, 0, TAU); c.fill(); c.lineWidth = 6; c.strokeStyle = '#1b1220'; c.beginPath(); c.moveTo(-6, -40); c.lineTo(-10, 0); c.moveTo(6, -40); c.lineTo(10, 0); c.moveTo(20, -74); c.quadraticCurveTo(40, -120, 36, -130); c.stroke(); c.beginPath(); c.moveTo(36, -130); c.lineTo(76, -120); c.lineTo(36, -122); c.fill(); }
  else { const al = Math.sin(t * 18) * 0.9; c.beginPath(); c.ellipse(0, 0, 36, 14, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-10, 0); c.lineTo(-80, -70 * al); c.lineTo(10, -6); c.closePath(); c.fill(); c.beginPath(); c.moveTo(10, 0); c.lineTo(80, -70 * al); c.lineTo(20, -6); c.closePath(); c.fill(); c.beginPath(); c.moveTo(34, -4); c.lineTo(70, 2); c.lineTo(34, 4); c.fill(); } c.restore(); };

 // primer término (pantalla): nenúfares con flor que se mecen en el agua y juncos grandes a los lados, para llenar la parte baja
 const primerTermino = (ctx, t, y0 = 1250, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const R = H.rng(64);
  for (let i = 0; i < 7; i++) { const x = ((R() * 1300 + t * 18) % 1300) - 110, y = y0 + R() * 220, r = 70 + R() * 60, bob = Math.sin(t * 1.6 + i) * 6;
   ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(x + 8, y + 12 + bob, r, r * 0.32, 0, 0, TAU); ctx.fill(); ctx.fillStyle = i % 2 ? '#3e6b33' : '#4a7a3a'; ctx.beginPath(); ctx.ellipse(x, y + bob, r, r * 0.32, 0, 0.25, TAU - 0.05); ctx.lineTo(x, y + bob); ctx.closePath(); ctx.fill();
   ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y + bob, r * 0.7, r * 0.22, 0, 3.6, 5.6); ctx.stroke();
   if (R() > 0.5) { ctx.fillStyle = '#f6c6d8'; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(x + Math.cos(k) * 12, y + bob - 16 + Math.sin(k) * 4, 9, 22, k, 0, TAU); ctx.fill(); } ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, y + bob - 16, 7, 0, TAU); ctx.fill(); } }
  ctx.lineCap = 'round'; for (const [x0, sd] of [[-20, 1], [1100, -1]]) for (let i = 0; i < 6; i++) { const x = x0 + sd * i * 26, h = 420 + (i % 3) * 120, sw = Math.sin(t * 1.5 + i) * 26 * sd; ctx.strokeStyle = '#16200f'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x, HH + 20); ctx.quadraticCurveTo(x + sw * 0.4, HH - h * 0.5, x + sw, HH - h); ctx.stroke(); if (i % 2 === 0) { ctx.fillStyle = '#3a2416'; ctx.save(); ctx.translate(x + sw, HH - h); ctx.beginPath(); ctx.roundRect(-14, -10, 28, 110, 14); ctx.fill(); ctx.restore(); } }
  ctx.restore(); };
 // bandada de aves que cruza el cielo (pantalla, franja alta de la escena)
 const bandada = (ctx, t, y0 = 600, n = 9, col = '#1b1220', a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = 'round'; const R = H.rng(46); for (let i = 0; i < n; i++) { const x = ((R() * 1400 + t * (70 + R() * 30)) % 1400) - 160, y = y0 + R() * 160 + Math.sin(t * 2 + i) * 8, w = 26 + R() * 16, al = Math.sin(t * 9 + i * 1.7) * 0.6; ctx.beginPath(); ctx.moveTo(x - w, y - w * al); ctx.quadraticCurveTo(x - w * 0.4, y - w * 0.5, x, y); ctx.quadraticCurveTo(x + w * 0.4, y - w * 0.5, x + w, y - w * al); ctx.stroke(); } ctx.restore(); };
 // nenúfares vistos desde arriba (mundo)
 const nenufaresTop = (c, t) => { const R = H.rng(88); for (let i = 0; i < 26; i++) { const x = -900 + R() * 1800, y = -1600 + R() * 3200, r = 50 + R() * 70; c.fillStyle = i % 2 ? '#3e6b33' : '#4a7a3a'; c.beginPath(); c.arc(x, y + Math.sin(t + i) * 4, r, 0.3, TAU - 0.1); c.lineTo(x, y); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 3; for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(k * 1.2 + 0.5) * r * 0.9, y + Math.sin(k * 1.2 + 0.5) * r * 0.9); c.stroke(); } } };
 // ---------- COCODRILO de lado (mira a la derecha; local: bisagra de la mandíbula en (420, -60); vientre en y ≈ 40) ----------
 // o.boca 0…1 · o.ola amplitud de la cola · o.parpado 0…1 · o.antiguo 0…1 (patas largas, hocico corto, pardo) · o.patas
 const piel = (a) => ({ top: H.rgba(H.mix('#3f5a2b', '#6b5530', a)), mid: H.rgba(H.mix('#4e6b33', '#7d6438', a)), panza: H.rgba(H.mix('#c9bf86', '#c8a979', a)), osc: H.rgba(H.mix('#2a3d1d', '#4a3a22', a)) });
 const perfil = (x, a) => { if (x > 300) return [-130 + 10 * a, 20]; if (x > -250) { const u = (x + 250) / 550; return [-150 + 25 * a + 10 * Math.sin(u * Math.PI) * -1, 40 - 12 * a]; } const u = cl((-x - 250) / 750); return [lerp(-140 + 20 * a, -16, Math.pow(u, 0.9)), lerp(30 - 10 * a, -2, u)]; };
 const cocoLado = (c, t, o = {}) => { const a = o.antiguo || 0, Pl = piel(a), amp = o.ola ?? 40, b = o.boca || 0, blink = o.parpado ?? ((t % 3.7) > 3.55 ? 1 : 0);
  const off = (x) => (x < -200 ? amp * Math.sin(t * 2.6 + x * 0.008) * cl((-x - 200) / 800) : 0);
  c.save();
  // patas (detrás del cuerpo); en el agua van recogidas
  const pata = (x, fase, lejos) => { const L = lerp(70, 150, a), sw = Math.sin(t * 3 + fase) * (o.camina ? 18 : 4); c.save(); c.translate(x, 18); c.fillStyle = lejos ? Pl.osc : Pl.mid; c.beginPath(); c.moveTo(-28, -10); c.lineTo(28, -10); c.lineTo(18 + sw, L); c.lineTo(-18 + sw, L); c.closePath(); c.fill(); c.beginPath(); c.ellipse(sw + 14, L, 40, 13, 0, 0, TAU); c.fill(); c.strokeStyle = Pl.osc; c.lineWidth = 6; for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(sw + 26 + k * 10, L + 4); c.lineTo(sw + 48 + k * 12, L + 14); c.stroke(); } c.restore(); };
  if (o.patas !== false) { pata(-120, 0, true); pata(280, 1.5, true); }
  // cuerpo y cola
  const xs = []; for (let x = 330; x >= -1000; x -= 25) xs.push(x);
  const cg = c.createLinearGradient(0, -160, 0, 40); cg.addColorStop(0, Pl.top); cg.addColorStop(0.6, Pl.mid); cg.addColorStop(1, Pl.panza);
  c.fillStyle = cg; c.beginPath(); xs.forEach((x, i) => { const [tp] = perfil(x, a), y = tp + off(x); i ? c.lineTo(x, y) : c.moveTo(x, y); }); for (let i = xs.length - 1; i >= 0; i--) { const x = xs[i], [, bt] = perfil(x, a); c.lineTo(x, bt + off(x)); } c.closePath(); c.fill();
  // manchas y bandas
  const Rm = H.rng(13); c.fillStyle = Pl.osc; c.globalAlpha = 0.45; for (let i = 0; i < 26; i++) { const x = 300 - Rm() * 1150, [tp, bt] = perfil(x, a), y = lerp(tp, bt, 0.25 + Rm() * 0.4) + off(x); c.beginPath(); c.ellipse(x, y, 22 + Rm() * 26, 9 + Rm() * 8, 0, 0, TAU); c.fill(); } c.globalAlpha = 1;
  for (let x = -300; x > -980; x -= 85) { const [tp, bt] = perfil(x, a); c.strokeStyle = Pl.osc; c.lineWidth = 9; c.beginPath(); c.moveTo(x, tp + off(x) + 4); c.lineTo(x + 8, lerp(tp, bt, 0.6) + off(x)); c.stroke(); }
  // escudos (osteodermos) en el lomo
  c.fillStyle = Pl.osc; for (let x = 300; x > -960; x -= 42) { const [tp] = perfil(x, a), y = tp + off(x), h = (x > -250 ? 20 : 26 * (1 - cl((-x - 250) / 750)) + 6); c.beginPath(); c.moveTo(x - 16, y + 4); c.lineTo(x, y - h); c.lineTo(x + 16, y + 4); c.closePath(); c.fill(); }
  if (o.patas !== false) { pata(-60, 3, false); pata(340, 4.5, false); }
  // cabeza (dos mandíbulas que giran en la bisagra)
  c.save(); c.translate(420, -60); const hs = lerp(1, 0.82, a); c.scale(hs, 1);
  if (b > 0.02) { c.fillStyle = '#c96a6a'; c.beginPath(); c.moveTo(-10, 0); c.lineTo(Math.cos(-b * 0.75) * 300, Math.sin(-b * 0.75) * 300); c.lineTo(Math.cos(b * 0.15) * 290, Math.sin(b * 0.15) * 290); c.closePath(); c.fill(); c.fillStyle = '#e8a0a0'; c.beginPath(); c.ellipse(80, 0, 90, 26, -b * 0.3, 0, TAU); c.fill(); }
  const dientes = (x0, x1, dir) => { c.fillStyle = '#f2ead2'; for (let x = x0; x < x1; x += 22) { const h = 16 + 6 * Math.sin(x * 0.3); c.beginPath(); c.moveTo(x - 7, 0); c.lineTo(x, dir * h); c.lineTo(x + 7, 0); c.closePath(); c.fill(); } };
  c.save(); c.rotate(b * 0.15); dientes(40, 270, -1); c.fillStyle = Pl.mid; c.beginPath(); c.moveTo(-40, -6); c.lineTo(285, 2); c.quadraticCurveTo(300, 18, 280, 30); c.lineTo(200, 44); c.lineTo(60, 62); c.lineTo(-40, 60); c.closePath(); c.fill(); c.fillStyle = Pl.panza; c.beginPath(); c.moveTo(-30, 40); c.lineTo(200, 34); c.lineTo(60, 60); c.closePath(); c.fill(); c.restore();
  c.save(); c.rotate(-b * 0.75); dientes(40, 285, 1); c.fillStyle = Pl.top; c.beginPath(); c.moveTo(-50, 10); c.lineTo(-30, -98); c.quadraticCurveTo(40, -122, 90, -100); c.lineTo(160, -78); c.lineTo(270, -56); c.quadraticCurveTo(305, -46, 300, -16); c.lineTo(290, -2); c.lineTo(0, -2); c.closePath(); c.fill();
  c.fillStyle = Pl.osc; c.globalAlpha = 0.5; for (let x = 110; x < 270; x += 34) { c.beginPath(); c.ellipse(x, -50, 12, 6, 0, 0, TAU); c.fill(); } c.globalAlpha = 1;
  c.fillStyle = Pl.top; c.beginPath(); c.ellipse(272, -56, 22, 16, 0, 0, TAU); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.ellipse(276, -60, 6, 3, 0.3, 0, TAU); c.fill();   // narina
  // ojo saliente: iris amarillo, pupila vertical, párpado
  c.fillStyle = Pl.top; c.beginPath(); c.ellipse(52, -104, 36, 30, 0, 0, TAU); c.fill(); c.fillStyle = '#e7c23a'; c.beginPath(); c.ellipse(58, -108, 20, 17, 0, 0, TAU); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.ellipse(60, -108, 4.5, 15, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(52, -114, 4, 0, TAU); c.fill();
  if (blink > 0) { c.fillStyle = Pl.top; c.beginPath(); c.ellipse(58, -108, 23, 20 * blink, 0, Math.PI, TAU); c.fill(); c.fillRect(35, -108, 46, 20 * blink - 2); }
  c.restore(); c.restore(); c.restore(); };

 // ---------- COCODRILO desde arriba (nada hacia arriba; ondula) ----------
 const anchoTop = (y) => { if (y < -560) return lerp(36, 96, cl((y + 700) / 140)); if (y < -380) return lerp(96, 120, cl((y + 560) / 180)); if (y < 220) return 200 - 60 * Math.abs((y + 80) / 300); return lerp(140, 8, cl((y - 220) / 700)); };
 const cocoTop = (c, t, o = {}) => { const Pl = piel(0), amp = o.ola ?? 60, xo = (y) => amp * Math.sin(t * 2.6 - y * 0.007) * cl((y + 300) / 1200);
  const pata = (y, lado, f) => { const sw = Math.sin(t * 2.6 + f) * 0.5; c.save(); c.translate(xo(y) + lado * 110, y); c.rotate(lado * (0.9 + sw)); c.fillStyle = Pl.mid; c.beginPath(); c.roundRect(-20, -10, 140, 40, 18); c.fill(); c.beginPath(); c.ellipse(140, 10, 34, 26, 0, 0, TAU); c.fill(); c.restore(); };
  pata(-280, -1, 0); pata(-280, 1, Math.PI); pata(160, -1, Math.PI); pata(160, 1, 0);
  const ys = []; for (let y = -700; y <= 920; y += 20) ys.push(y);
  c.fillStyle = Pl.mid; c.beginPath(); ys.forEach((y, i) => { const x = xo(y) - anchoTop(y) / 2; i ? c.lineTo(x, y) : c.moveTo(x, y); }); for (let i = ys.length - 1; i >= 0; i--) { const y = ys[i]; c.lineTo(xo(y) + anchoTop(y) / 2, y); } c.closePath(); c.fill();
  c.fillStyle = Pl.osc; for (let y = -340; y < 860; y += 46) { const w = anchoTop(y); for (const k of [-1, 1]) { c.beginPath(); c.roundRect(xo(y) + k * w * 0.18 - 14, y - 16, 28, 30, 7); c.fill(); } if (y < 200) for (const k of [-1, 1]) { c.beginPath(); c.roundRect(xo(y) + k * w * 0.36 - 11, y - 12, 22, 24, 6); c.fill(); } }
  for (const k of [-1, 1]) { c.fillStyle = Pl.top; c.beginPath(); c.ellipse(xo(-470) + k * 42, -470, 26, 30, 0, 0, TAU); c.fill(); c.fillStyle = '#e7c23a'; c.beginPath(); c.ellipse(xo(-470) + k * 46, -474, 12, 14, 0, 0, TAU); c.fill(); c.fillStyle = '#111'; c.fillRect(xo(-470) + k * 46 - 2, -486, 4, 24); }
  c.fillStyle = '#111'; for (const k of [-1, 1]) { c.beginPath(); c.ellipse(xo(-680) + k * 9, -680, 5, 3, 0, 0, TAU); c.fill(); } };

 // ---------- dinosaurios (siluetas con reacción), helechos, volcán ----------
 const sauropodo = (c, x, y, s, t, o = {}) => { const mira = o.mira || 0; c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = o.col || '#2c2340';
  c.beginPath(); c.ellipse(0, -260, 330, 160, 0, 0, TAU); c.fill(); for (const lx of [-200, -90, 110, 210]) c.fillRect(lx - 36, -200, 72, 200);
  c.beginPath(); c.moveTo(-300, -280); c.quadraticCurveTo(-650, -200, -820, -60); c.lineTo(-800, -40); c.quadraticCurveTo(-620, -150, -280, -200); c.fill();
  const nx = 520, ny = -700 - 140 * mira, sw = Math.sin(t * 1.2) * 20; c.lineWidth = 90; c.lineCap = 'round'; c.strokeStyle = c.fillStyle; c.beginPath(); c.moveTo(230, -330); c.quadraticCurveTo(470, -460, nx + sw, ny); c.stroke();
  c.beginPath(); c.ellipse(nx + sw + 40, ny - 10 - 20 * mira, 80, 46, -0.3 - mira * 0.8, 0, TAU); c.fill(); if (o.ojo) { c.fillStyle = '#fff'; c.beginPath(); c.arc(nx + sw + 60, ny - 30 - 30 * mira, 9 + 8 * mira, 0, TAU); c.fill(); } c.restore(); };
 const teropodo = (c, x, y, s, t, o = {}) => { const m = o.susto || 0, paso = Math.sin(t * 4) * 18 * (o.camina ? 1 : 0); c.save(); c.translate(x, y); c.scale(s, s); const col = o.col || '#3a2433'; c.fillStyle = col; c.strokeStyle = col;
  c.lineWidth = 50; c.lineCap = 'round'; c.beginPath(); c.moveTo(-30, -320); c.lineTo(-60 + paso, -150); c.lineTo(-20 + paso, 0); c.moveTo(40, -320); c.lineTo(60 - paso, -150); c.lineTo(30 - paso, 0); c.stroke();
  c.beginPath(); c.ellipse(0, -380, 170, 110, -0.25, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-150, -400); c.quadraticCurveTo(-420, -420, -620, -300 + Math.sin(t * 2) * 20); c.lineTo(-600, -280); c.quadraticCurveTo(-400, -360, -150, -320); c.fill();
  c.save(); c.translate(120, -470); c.rotate(-0.5 * m); c.lineWidth = 70; c.beginPath(); c.moveTo(0, 30); c.lineTo(40, -60); c.stroke(); c.translate(40, -80); c.beginPath(); c.moveTo(-40, -50); c.lineTo(170, -40); c.lineTo(180, 0); c.lineTo(-20, 20); c.closePath(); c.fill();
  c.save(); c.translate(-10, 18); c.rotate(0.5 * m); c.beginPath(); c.moveTo(0, 0); c.lineTo(160, 6); c.lineTo(150, 30); c.lineTo(0, 30); c.closePath(); c.fill(); c.restore();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(40, -22, 10 + 9 * m, 0, TAU); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(42 + 3 * m, -24, 4, 0, TAU); c.fill(); c.restore();
  c.lineWidth = 16; c.beginPath(); c.moveTo(110, -380); c.lineTo(170 + 30 * m, -330 - 60 * m); c.stroke(); c.restore(); };
 const helecho = (c, x, y, s, t, col = '#1e3a24') => { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.lineCap = 'round'; for (let k = -3; k <= 3; k++) { const a = -Math.PI / 2 + k * 0.32 + Math.sin(t * 1.4 + k) * 0.05, L = 300 - Math.abs(k) * 30; c.lineWidth = 9; c.beginPath(); c.moveTo(0, 0); const ex = Math.cos(a) * L, ey = Math.sin(a) * L; c.quadraticCurveTo(ex * 0.5, ey * 0.7, ex, ey); c.stroke(); c.lineWidth = 5; for (let j = 0.25; j < 1; j += 0.12) { const px = ex * j, py = ey * j * (0.7 + 0.3 * j); c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(a - 1.2) * 50 * (1.1 - j), py + Math.sin(a - 1.2) * 50 * (1.1 - j)); c.moveTo(px, py); c.lineTo(px + Math.cos(a + 1.2) * 50 * (1.1 - j), py + Math.sin(a + 1.2) * 50 * (1.1 - j)); c.stroke(); } } c.restore(); };
 const volcan = (c, x, y, s, t) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#2a1a2e'; c.beginPath(); c.moveTo(-500, 0); c.lineTo(-90, -520); c.lineTo(90, -520); c.lineTo(500, 0); c.closePath(); c.fill(); c.fillStyle = '#ff7a3a'; c.beginPath(); c.ellipse(0, -520, 90, 18, 0, 0, TAU); c.fill(); for (let k = 0; k < 6; k++) { const ph = (t * 0.25 + k / 6) % 1; c.fillStyle = `rgba(90,70,90,${0.5 * (1 - ph)})`; c.beginPath(); c.arc(Math.sin(k * 2 + t * 0.3) * 60 * ph, -560 - ph * 600, 60 + ph * 160, 0, TAU); c.fill(); } c.restore(); };
 const ptero = (c, x, y, s, t) => { const al = Math.sin(t * 5) * 0.5; c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#2a1626'; c.beginPath(); c.moveTo(0, 0); c.lineTo(-160, -60 * al - 20); c.lineTo(-60, 10); c.lineTo(60, 10); c.lineTo(160, -60 * al - 20); c.closePath(); c.fill(); c.beginPath(); c.moveTo(20, -6); c.lineTo(90, -20); c.lineTo(30, 6); c.fill(); c.restore(); };
 const jurasico = (c, t, o = {}) => { cieloTarde(c, { c0: '#3a1d33', c1: '#b5543d', c2: '#f2a54a', sx: -200, sy: -420 }); for (let k = 0; k < 6; k++) ptero(c, -1000 + k * 380 + ((t * 60) % 400), -760 + (k % 2) * 180 + Math.sin(t + k) * 30, 0.9, t + k); volcan(c, 700, -40, 1.1, t); orillaLejana(c, t); sauropodo(c, -650, -40, 0.75, t, { col: '#2a1c33', mira: o.mira || 0, ojo: o.mira > 0 }); if (o.tero !== false) teropodo(c, 980, -30, 0.7, t, { susto: o.susto || 0 }); agua(c, t, { top: '#7a3b45', sx: -200 }); helecho(c, -900, 40, 1.3, t); helecho(c, 950, 60, 1.5, t); };
 const asteroideDib = (c, x, y, r, t) => { c.save(); const tr = c.createLinearGradient(x, y, x - 900, y - 900); tr.addColorStop(0, 'rgba(255,200,120,0.9)'); tr.addColorStop(1, 'rgba(255,120,60,0)'); c.fillStyle = tr; c.beginPath(); c.moveTo(x - r * 0.8, y + r * 0.6); c.lineTo(x - 900, y - 900); c.lineTo(x + r * 0.6, y - r * 0.8); c.closePath(); c.fill(); P.glow(c, x, y, r * 4, '255,170,90', 0.8); c.fillStyle = '#5a3a2a'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.fillStyle = '#ffcf80'; c.beginPath(); c.arc(x + r * 0.3, y + r * 0.3, r * 0.55, 0, TAU); c.fill(); c.restore(); };

 // ---------- cuchara, sopa y calendario ----------
 const cuchara = (c, x, y, s, ang, o = {}) => { c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s); const g = c.createLinearGradient(-60, -40, 60, 40); g.addColorStop(0, o.c0 || '#f4f6fa'); g.addColorStop(0.5, o.c1 || '#9aa3b2'); g.addColorStop(1, o.c0 || '#e1e6ee'); c.fillStyle = g;
  c.beginPath(); c.ellipse(0, 0, 70, 100, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-14, 90); c.lineTo(-22, 470); c.quadraticCurveTo(0, 500, 22, 470); c.lineTo(14, 90); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(-22, -30, 14, 40, 0.2, 0, TAU); c.fill(); if (o.sopa) { c.fillStyle = '#e39a3a'; c.beginPath(); c.ellipse(0, 10, 55, 70, 0, 0, TAU); c.fill(); } c.restore(); };
 const mesa = (c, y) => { const g = c.createLinearGradient(0, y, 0, y + 900); g.addColorStop(0, '#7a4a2a'); g.addColorStop(1, '#3a2213'); c.fillStyle = g; c.fillRect(-3000, y, 6000, 1200); c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 4; for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(-3000, y + 60 + k * 130); c.lineTo(3000, y + 60 + k * 130); c.stroke(); } };

 // pez, cangrejo, ave y fruta (dibujo propio) para «come casi de todo»
 const comida = (c, n, x, y, s, t) => { c.save(); c.translate(x, y); c.scale(s, s);
  if (n === 'pez') { c.fillStyle = '#7fb7d6'; c.beginPath(); c.ellipse(0, 0, 70, 32, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-60, 0); c.lineTo(-110, -34 + Math.sin(t * 12) * 8); c.lineTo(-110, 34 + Math.sin(t * 12) * 8); c.closePath(); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(40, -8, 6, 0, TAU); c.fill(); }
  else if (n === 'cangrejo') { c.fillStyle = '#e0603a'; c.beginPath(); c.ellipse(0, 0, 60, 40, 0, 0, TAU); c.fill(); c.strokeStyle = '#e0603a'; c.lineWidth = 10; for (const k of [-1, 1]) { c.beginPath(); c.moveTo(k * 40, -20); c.lineTo(k * 80, -60); c.stroke(); c.beginPath(); c.arc(k * 88, -70, 18, 0, TAU); c.fill(); for (let j = 0; j < 3; j++) { c.beginPath(); c.moveTo(k * 40, 10 + j * 10); c.lineTo(k * 85, 30 + j * 14); c.stroke(); } } }
  else if (n === 'ave') { pajaro(c, 0, 0, 1.2, t, true); }
  else { c.fillStyle = '#e04a3a'; c.beginPath(); c.arc(-18, 0, 44, 0, TAU); c.arc(18, 0, 44, 0, TAU); c.fill(); c.fillStyle = '#4a7a2a'; c.beginPath(); c.ellipse(16, -54, 22, 10, -0.5, 0, TAU); c.fill(); }
  c.restore(); };
 // ---------- contador del viaje en el tiempo ----------
 const contador = (ctx, t, t0, t1, desde, hasta, o = {}) => { const a = sm(t0 - 0.1, t0 + 0.2, t) * (1 - sm(t1 - 0.25, t1, t)); if (a <= 0) return; const v = Math.round(lerp(desde, hasta, E.inOut(win(t, t0 + 0.1, t0 + (o.dur || 1.6))))), y = o.y ?? 560;
  ctx.save(); ctx.globalAlpha *= a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.font = '900 150px Fredoka'; const s = v === 0 ? 'HOY' : `−${v}`; ctx.lineWidth = 22; ctx.strokeStyle = 'rgba(8,10,16,0.9)'; ctx.strokeText(s, 470, y); ctx.fillStyle = o.col || YE; ctx.fillText(s, 470, y);
  if (v !== 0) { ctx.font = '900 54px Fredoka'; ctx.lineWidth = 12; ctx.strokeText('MILLONES DE AÑOS', 470, y + 110); ctx.fillStyle = '#fff'; ctx.fillText('MILLONES DE AÑOS', 470, y + 110); } ctx.restore();
  if (P.safeLog) P.safeLog('cifra', 130, y - 80, 810, y + 150); };
 const lineaTiempo = (ctx, t, a, u, o = {}) => { if (a <= 0) return; const y = o.y ?? 1310, x0 = 130, x1 = 850; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  for (const [p, lab] of [[0, '−200'], [0.67, '−66'], [1, 'HOY']]) { const x = lerp(x0, x1, p); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fill(); ctx.font = '800 38px Fredoka'; ctx.textAlign = 'center'; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(8,10,16,0.9)'; ctx.strokeText(lab, x, y + 56); ctx.fillText(lab, x, y + 56); }
  const xc = lerp(x0, x1, u); ctx.fillStyle = YE; ctx.beginPath(); ctx.moveTo(xc, y - 16); ctx.lineTo(xc - 22, y - 50); ctx.lineTo(xc + 22, y - 50); ctx.closePath(); ctx.fill(); ctx.restore(); if (P.safeLog) P.safeLog('cifra', x0 - 20, y - 60, x1 + 20, y + 80); };

 // =====================================================================================================
 // ESCENAS (un plano por idea; transiciones de cámara —zoom, paneo—, nunca corte seco salvo el fotograma 0; ninguna toma > 4 s)
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO A: estás en la orilla… y dos ojos te miran desde el agua (ataque a 1,55 s) ----------
 B.push({ t0: 0, t1: S(2), in: { type: 'cut' }, draw(ctx, t) {
  if (PORTADA) { fondoPlano(ctx, '#2a1d4a', '#0d1420'); ctx.save(); vista(ctx, [80, -120, 0.78], [0, 0], 1330); cieloTarde(ctx, { sx: -260, sy: -380 }); orillaLejana(ctx, 0.5); agua(ctx, 0.5, { sx: -260 }); ctx.save(); ctx.translate(-80, 130); ctx.rotate(-0.42); cocoLado(ctx, 0.5, { boca: 1, ola: 0, patas: false, parpado: 0 }); ctx.restore(); ctx.fillStyle = 'rgba(70,52,84,0.55)'; ctx.fillRect(-3000, 30, 6000, 2000); salpicon(ctx, 420, 0, 0.35, 0, 40, 520); juncos(ctx, 0.5, -820, 120, 10, 700); juncos(ctx, 0.5, 980, 120, 10, 760, 7); ctx.restore(); return; }
  const qB = P.pregunta(ctx, '¿POR QUÉ EL COCODRILO / CASI NO HA CAMBIADO?', t, 0, S(2) - 0.15, { capY: 330, px: 60, clave: 'COCODRILO', x: 540, dy: 110 });
  const golpes = [[T_ATAQUE, 1.0]], sh = sacude(t, golpes, 34), at = sm(T_ATAQUE - 0.15, T_ATAQUE + 0.12, t) * (1 - sm(T_ATAQUE + 0.9, T_ATAQUE + 1.6, t)), boca = sm(T_ATAQUE - 0.1, T_ATAQUE + 0.1, t) * (1 - sm(T_ATAQUE + 0.7, T_ATAQUE + 1.1, t));
  const ax = lerp(-500, 40, E.out(win(t, 0, T_ATAQUE))) + lerp(0, 60, sm(T_ATAQUE + 1.2, S(2), t)), sube = at * 300, rot = -0.55 * at, ex = ax + 472;
  const o = camK(t, [[0, 0, -40, 1.45], [T_ATAQUE - 0.25, 0, -40, 1.6], [T_ATAQUE + 0.05, -120, -260, 0.95], [T_ATAQUE + 0.8, -120, -240, 0.98], [T_ATAQUE + 1.5, 0, -50, 1.9], [S(2), 0, -50, 2.3]]), cam = [ex + o[0], o[1], o[2]];
  fondoPlano(ctx, '#2a1d4a', '#0d1420'); ctx.save(); vista(ctx, cam, sh, 1000); cieloTarde(ctx); orillaLejana(ctx, t); agua(ctx, t);
  ctx.save(); ctx.translate(ax, 110 - sube); ctx.rotate(rot); cocoLado(ctx, t, { boca, ola: 50, patas: false }); ctx.restore();
  ctx.fillStyle = 'rgba(70,52,84,0.62)'; ctx.fillRect(-3000, 18, 6000, 2000);   // agua por delante: tapa lo sumergido
  ondas(ctx, ax + 480, 4, t, 0, 3, 260); salpicon(ctx, ax + 500, 0, t, T_ATAQUE - 0.05, 40, 520);
  const vuela = t > T_ATAQUE + 0.05, pv = cl((t - T_ATAQUE - 0.05) / 1.6); pajaro(ctx, 780 + pv * 600, -20 - pv * 900, 1.3, t, vuela);
  juncos(ctx, t, -720, 120, 10, 700); juncos(ctx, t, 1100, 120, 10, 760, 7);
  ctx.restore(); primerTermino(ctx, t, 1270); fogonazo(ctx, t, golpes);
 }, sfx(k) { k.noise(0, { dur: S(2), color: 'pink', filter: 'lowpass', f: 900, gain: 0.05, a: 0.05, hold: S(2) - 0.3 }); FX.burbujas(k, 0.2, 1.2, 6, 3, 0.8); k.play('riser', 0.5, { dur: 1.0, gain: 0.25, minor: true }); FX.chapuzon(k, T_ATAQUE, 1.6); k.play('thud', T_ATAQUE, { f: 50, gain: 0.8 }); k.noise(T_ATAQUE + 0.02, { dur: 0.6, color: 'brown', filter: 'bandpass', f: 600, q: 0.8, gain: 0.25, a: 0.01 }); k.noise(T_ATAQUE + 0.1, { dur: 0.5, color: 'pink', filter: 'highpass', f: 3000, gain: 0.08, a: 0.05 }); } });

 // ---------- 2 · y la razón por la que siguen ahí te va a sorprender → VISTA DESDE ARRIBA del río, el cocodrilo nadando ----------
 B.push({ t0: S(2), t1: S(3), in: { type: 'zoom', d: 0.45, x: 540, y: 900 }, draw(ctx, t) {
  const cam = camK(t, [[S(2), 0, 0, 0.95], [S(3), 0, -60, 1.1]]); ctx.fillStyle = '#16221f'; ctx.fillRect(0, 0, W, HH); ctx.save(); vista(ctx, cam); ctx.rotate(-0.55 + Math.sin(t * 0.3) * 0.04);
  const g = ctx.createLinearGradient(-900, 0, 900, 0); g.addColorStop(0, '#2b3a2a'); g.addColorStop(0.18, '#3a4f5a'); g.addColorStop(0.5, '#2d4a5c'); g.addColorStop(0.82, '#3a4f5a'); g.addColorStop(1, '#2b3a2a'); ctx.fillStyle = g; ctx.fillRect(-1600, -2600, 3200, 5200);
  ctx.fillStyle = '#2b3d22'; ctx.fillRect(-2200, -2600, 1200, 5200); ctx.fillRect(1000, -2600, 1200, 5200); const R = H.rng(21); for (let i = 0; i < 40; i++) { const y = -2400 + R() * 4800, x = (R() > 0.5 ? 1 : -1) * (1020 + R() * 300); ctx.fillStyle = '#1f2e18'; ctx.beginPath(); ctx.arc(x, y, 40 + R() * 70, 0, TAU); ctx.fill(); }
  ctx.lineWidth = 4; for (let i = 0; i < 40; i++) { const x = -900 + R() * 1800, y0 = -2400 + R() * 4800, y = ((y0 + t * 120) % 4800) - 2400; ctx.strokeStyle = 'rgba(255,220,200,0.18)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 50, y - 10, x + 100, y); ctx.stroke(); }
  nenufaresTop(ctx, t);
  const yc = -(t - S(2)) * 90 + 120; ctx.save(); ctx.translate(0, yc); for (let k = 0; k < 4; k++) { const ph = (t * 0.6 + k / 4) % 1; ctx.strokeStyle = `rgba(255,240,220,${0.45 * (1 - ph)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-60 - ph * 260, -640 + ph * 900); ctx.lineTo(0, -720); ctx.lineTo(60 + ph * 260, -640 + ph * 900); ctx.stroke(); } cocoTop(ctx, t, { ola: 70 }); ctx.restore();
  ctx.restore(); P.tag(ctx, 'TE VA A SORPRENDER', 470, 520, t, Tk.sorprender - 0.5, S(3), { mono: true, col: YE, px: 56 });
 }, sfx(k) { k.play('whoosh', S(2), { dur: 0.6, top: 1600, gain: 0.3, minor: true }); k.noise(S(2), { dur: S(3) - S(2), color: 'pink', filter: 'lowpass', f: 700, gain: 0.05, a: 0.2, hold: 2 }); FX.etiqueta(k, Tk.sorprender - 0.5); } });

 // ---------- 3 · piensa en una cuchara… porque ya funciona → primer plano de la cuchara en la sopa ----------
 B.push({ t0: S(3), t1: S(5), in: { type: 'zoom', d: 0.45, x: 540, y: 900 }, draw(ctx, t) {
  const cam = camK(t, [[S(3), 0, -150, 0.95], [S(5), 40, -220, 1.15]]); fondoPlano(ctx, '#2a1a12', '#140c08'); ctx.save(); vista(ctx, cam); ctx.fillStyle = '#d9cfbf'; ctx.fillRect(-2000, -2000, 4000, 2100); ctx.strokeStyle = 'rgba(120,100,80,0.45)'; ctx.lineWidth = 6; for (let x = -2000; x <= 2000; x += 150) { ctx.beginPath(); ctx.moveTo(x, -2000); ctx.lineTo(x, 80); ctx.stroke(); } for (let y = -2000; y <= 80; y += 150) { ctx.beginPath(); ctx.moveTo(-2000, y); ctx.lineTo(2000, y); ctx.stroke(); } mesa(ctx, 80); ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 5; for (let x = -2000; x <= 2000; x += 220) { ctx.beginPath(); ctx.moveTo(x, 80); ctx.lineTo(x + 60, 1300); ctx.stroke(); }
  P.glow(ctx, -200, -700, 900, '255,200,140', 0.25); ctx.fillStyle = '#e9e2d6'; ctx.beginPath(); ctx.ellipse(0, 70, 420, 110, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#d0c6b6'; ctx.beginPath(); ctx.ellipse(0, 40, 380, 90, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#d98a2e'; ctx.beginPath(); ctx.ellipse(0, 40, 340, 72, 0, 0, TAU); ctx.fill();
  for (let k = 0; k < 3; k++) { const ph = (t * 0.5 + k / 3) % 1; ctx.strokeStyle = `rgba(255,220,160,${0.5 * (1 - ph)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(60, 40, 40 + ph * 220, 8 + ph * 46, 0, 0, TAU); ctx.stroke(); }
  for (let k = 0; k < 4; k++) { const ph = (t * 0.35 + k / 4) % 1; ctx.strokeStyle = `rgba(255,255,255,${0.25 * Math.sin(ph * Math.PI)})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-120 + k * 80, -20 - ph * 400); ctx.quadraticCurveTo(-80 + k * 80 + Math.sin(t * 2 + k) * 40, -120 - ph * 400, -120 + k * 80, -220 - ph * 400); ctx.stroke(); }
  const sube = E.inOut(win(t, S(4) - 0.2, Tk.funciona + 0.3)); cuchara(ctx, 60 + 40 * sube, lerp(10, -420, sube), 1.2, lerp(0.5, 0.15, sube), { sopa: sube > 0.2 });
  ctx.restore(); if (t > Tk.funciona - 0.1) P.icon(ctx, 'check', 760, 760, 170 * E.out(sm(Tk.funciona - 0.1, Tk.funciona + 0.2, t)), { mode: 'flat', col: GR, col2: '#fff' });
  P.tag(ctx, 'YA FUNCIONA', 470, 520, t, Tk.funciona - 0.2, S(5), { mono: true, col: GR, px: 60 });
 }, sfx(k) { k.play('ding', S(3) + 0.3, { f: 'E6', gain: 0.12, minor: true }); k.play('swish', S(4) - 0.1, { gain: 0.25 }); FX.correcto(k, Tk.funciona); } });

 // ---------- 4 · al cocodrilo le pasó lo mismo → la cuchara se aparta y aparece el cocodrilo de cuerpo entero en la orilla ----------
 B.push({ t0: S(5), t1: S(6), in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const cam = camK(t, [[S(5), -260, -150, 0.6], [S(6), -200, -150, 0.66]]); fondoPlano(ctx, '#2a1d4a', '#0d1420'); ctx.save(); vista(ctx, cam); cieloTarde(ctx); orillaLejana(ctx, t);
  ctx.fillStyle = '#5a4630'; ctx.beginPath(); ctx.moveTo(-3000, 40); ctx.lineTo(500, 40); ctx.quadraticCurveTo(700, 60, 800, 140); ctx.lineTo(-3000, 140); ctx.closePath(); ctx.fill(); agua(ctx, t, { sol: true }); ctx.fillStyle = '#5a4630'; ctx.beginPath(); ctx.moveTo(-3000, -20); ctx.lineTo(420, -20); ctx.quadraticCurveTo(700, 0, 820, 120); ctx.lineTo(-3000, 900); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.translate(-80 + (t - S(5)) * 20, -90); cocoLado(ctx, t, { ola: 25, camina: true }); ctx.restore(); juncos(ctx, t, -1100, 0, 12, 760, 11); ctx.restore(); primerTermino(ctx, t, 1260); bandada(ctx, t, 520);
 }, sfx(k) { k.play('whoosh', S(5), { dur: 0.5, top: 1400, gain: 0.25, minor: true }); k.noise(S(5) + 0.4, { dur: 1.2, color: 'brown', filter: 'bandpass', f: 400, q: 1, gain: 0.05, a: 0.2 }); } });

 // ---------- 5 · VIAJE EN EL TIEMPO: hace doscientos millones de años, cuando vivían los dinosaurios… ----------
 B.push({ t0: S(6), t1: S(8), in: { type: 'zoom', d: 0.45, x: 540, y: 900 }, draw(ctx, t) {
  const via = E.inOut(win(t, S(6), Tk.dinos - 0.2)), cam = camK(t, [[S(6), -300, -120, 0.55], [Tk.dinos, -300, -100, 0.58], [S(7), -300, 0, 0.64], [S(8), -280, 10, 0.7]]);
  fondoPlano(ctx, '#3a1d33', '#140c10'); ctx.save(); vista(ctx, cam);
  if (via < 1) { ctx.save(); ctx.globalAlpha *= 1 - via; cieloTarde(ctx); orillaLejana(ctx, t); agua(ctx, t); ctx.restore(); }
  if (via > 0) { ctx.save(); ctx.globalAlpha *= via; jurasico(ctx, t, {}); ctx.restore(); }
  // el cocodrilo antiguo (pardo) y, a su lado, la silueta del de hoy: casi iguales
  const cmp = sm(Tk.parecidos - 0.4, Tk.parecidos + 0.2, t); ctx.save(); ctx.translate(-150, 40); cocoLado(ctx, t, { antiguo: 1, ola: 30, camina: true }); ctx.restore();
  if (cmp > 0) { ctx.save(); ctx.globalAlpha *= 0.55 * cmp; ctx.translate(-150, 40); ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = CY; ctx.lineWidth = 10; ctx.setLineDash([24, 16]); ctx.beginPath(); for (let x = 330; x >= -1000; x -= 25) { const [tp] = perfil(x, 0); x === 330 ? ctx.moveTo(x, tp) : ctx.lineTo(x, tp); } ctx.lineTo(420, -60 - 100); ctx.lineTo(720, -100); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
  // remolino del viaje (antes: primer término y aves/pterosaurios en pantalla)
  const rem = win(t, S(6), Tk.dinos) > 0 && t < Tk.dinos ? Math.sin(Math.PI * win(t, S(6), Tk.dinos)) : 0; ctx.restore();
  if (rem > 0) { ctx.save(); ctx.globalAlpha = rem * 0.8; ctx.translate(540, 940); for (let k = 0; k < 14; k++) { ctx.rotate(t * 2 + k); ctx.strokeStyle = k % 2 ? 'rgba(255,210,63,0.6)' : 'rgba(143,216,255,0.5)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, 120 + k * 60, 0, 1.6); ctx.stroke(); } ctx.restore(); }
  primerTermino(ctx, t, 1280, 0.5 + 0.5 * via); bandada(ctx, t, 560, 7, '#2a1626');
  contador(ctx, t, S(6), Tk.parecidos - 0.5, 0, 200, { dur: Tk.dinos - S(6) });
  lineaTiempo(ctx, t, sm(S(6), S(6) + 0.3, t), 1 - E.inOut(win(t, S(6), Tk.dinos)));
  P.tag(ctx, 'MUY PARECIDO', 470, 520, t, Tk.parecidos - 0.3, S(8), { mono: true, col: CY, px: 60 });
 }, sfx(k) { k.play('riser', S(6) - 0.1, { dur: 1.6, gain: 0.35, minor: true }); FX.reloj(k, S(6) + 0.1, 14, 0.1, 0.8); k.play('whoosh', Tk.dinos - 0.3, { dur: 0.9, top: 1800, gain: 0.35 }); k.play('thud', Tk.dinos, { f: 50, gain: 0.4 }); FX.revelar(k, Tk.parecidos - 0.3); } });

 // ---------- 6 · y su arma ya estaba lista: LA MORDIDA → primer plano de la boca que se abre y ¡CLAC! ----------
 B.push({ t0: S(8), t1: S(10), in: { type: 'zoom', d: 0.4, x: 700, y: 900 }, draw(ctx, t) {
  const abre = sm(Tk.arma - 0.2, Tk.lista + 0.2, t), cierra = sm(T_MORDIDA - 0.08, T_MORDIDA, t), boca = abre * (1 - cierra), golpes = [[T_MORDIDA, 1.1]], sh = sacude(t, golpes, 40);
  const cam = camK(t, [[S(8), 560, -40, 1.5], [Tk.lista, 600, -30, 1.9], [T_MORDIDA, 620, -20, 2.15], [S(10), 600, -20, 2.0]]);
  fondoPlano(ctx, '#2a1d4a', '#0d1420'); ctx.save(); vista(ctx, cam, sh, 1000); cieloTarde(ctx, { sx: 900, sy: -320 }); orillaLejana(ctx, t); agua(ctx, t, { sx: 900 });
  ctx.save(); ctx.translate(0, 60); cocoLado(ctx, t, { boca, ola: 20, patas: false }); ctx.restore();
  // tronco que cruje entre los dientes
  const tr = sm(T_MORDIDA, T_MORDIDA + 0.1, t); ctx.save(); ctx.translate(640, -20); ctx.rotate(-0.1); ctx.fillStyle = '#5c3b22'; if (tr < 1) { ctx.beginPath(); ctx.roundRect(-40, -200 + 120 * (1 - abre), 80, 300, 20); ctx.fill(); } else { const R = H.rng(4); for (let i = 0; i < 12; i++) { const d = t - T_MORDIDA, a = -Math.PI * R(); ctx.save(); ctx.translate(Math.cos(a) * 400 * d, Math.sin(a) * 300 * d + 500 * d * d); ctx.rotate(d * 6 * (R() - 0.5)); ctx.fillRect(-30, -8, 60, 16); ctx.restore(); } } ctx.restore();
  ctx.fillStyle = 'rgba(70,52,84,0.5)'; ctx.fillRect(-3000, 40, 6000, 2000); salpicon(ctx, 700, 30, t, T_MORDIDA, 26, 360);
  ctx.restore(); primerTermino(ctx, t, 1300); bandada(ctx, t, 520, 7); fogonazo(ctx, t, golpes);
  P.tag(ctx, 'LA MORDIDA MÁS FUERTE', 470, 520, t, T_MORDIDA, S(10), { mono: true, col: RD, px: 56 });
 }, sfx(k) { k.noise(Tk.arma - 0.2, { dur: 0.9, color: 'pink', filter: 'bandpass', f: 1800, q: 1.5, gain: 0.06, a: 0.3 }); k.play('riser', Tk.lista, { dur: T_MORDIDA - Tk.lista, gain: 0.3, minor: true }); k.play('thud', T_MORDIDA, { f: 45, gain: 0.95 }); k.noise(T_MORDIDA, { dur: 0.25, filter: 'highpass', f: 1800, gain: 0.45, a: 0.001 }); FX.rotura(k, T_MORDIDA + 0.02); FX.golpeSordo(k, T_MORDIDA + 0.05); FX.etiqueta(k, T_MORDIDA + 0.1); } });

 // ---------- 7 · sí ha evolucionado… pero muy despacio → PRIMER PLANO DE LA PIEL (escamas), paneo lento ----------
 B.push({ t0: S(10), t1: S(12), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const cam = camK(t, [[S(10), 300, 0, 1.0], [S(12), -300, 40, 1.1]]); fondoPlano(ctx, '#22301a', '#0d1408'); ctx.save(); vista(ctx, cam);
  // escamas y escudos (osteodermos) a pantalla completa, con el ojo asomando a un lado
  const respira = 1 + 0.015 * Math.sin(t * 1.8); ctx.save(); ctx.scale(1, respira);
  for (let r = -12; r <= 12; r++) for (let q = -16; q <= 16; q++) { const x = q * 120 + (r % 2) * 60, y = r * 96, Rq = H.rng(500 + r * 40 + q), lomo = Math.abs(r) < 4;
   const gq = ctx.createLinearGradient(x, y - 44, x, y + 44); gq.addColorStop(0, lomo ? '#5b7a3c' : '#6b8746'); gq.addColorStop(1, lomo ? '#2c3f1c' : '#3b5326'); ctx.fillStyle = gq; ctx.beginPath(); ctx.roundRect(x - 54, y - 42, 108, 84, 22); ctx.fill();
   if (lomo) { ctx.fillStyle = '#26361a'; ctx.beginPath(); ctx.moveTo(x - 30, y + 20); ctx.lineTo(x, y - 34 - Rq() * 10); ctx.lineTo(x + 30, y + 20); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,240,200,0.18)'; ctx.beginPath(); ctx.moveTo(x - 8, y - 10); ctx.lineTo(x, y - 30); ctx.lineTo(x + 4, y - 8); ctx.fill(); }
   if (Rq() > 0.6) { ctx.fillStyle = 'rgba(20,30,12,0.35)'; ctx.beginPath(); ctx.ellipse(x, y, 30, 18, 0, 0, TAU); ctx.fill(); } }
  ctx.restore();
  ctx.save(); ctx.translate(-760, -520); ctx.fillStyle = '#4e6b33'; ctx.beginPath(); ctx.ellipse(0, 0, 200, 170, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#e7c23a'; ctx.beginPath(); ctx.ellipse(10, -6, 120, 100, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(16, -6, 24, 90, 0, 0, TAU); ctx.fill(); const bl = (t % 2.8) > 2.62 ? 1 : 0; if (bl) { ctx.fillStyle = '#4e6b33'; ctx.beginPath(); ctx.ellipse(10, -6, 130, 110, 0, 0, TAU); ctx.fill(); } ctx.restore();
  // brillo húmedo que recorre las escamas
  const gx = lerp(600, -900, (t - S(10)) / (S(12) - S(10))); const gg = ctx.createLinearGradient(gx - 220, 0, gx + 220, 0); gg.addColorStop(0, 'rgba(255,230,190,0)'); gg.addColorStop(0.5, 'rgba(255,230,190,0.22)'); gg.addColorStop(1, 'rgba(255,230,190,0)'); ctx.fillStyle = gg; ctx.fillRect(gx - 220, -1300, 440, 2600);
  const Rg = H.rng(33); ctx.fillStyle = 'rgba(200,230,255,0.7)'; for (let i = 0; i < 40; i++) { const x = 900 - Rg() * 1800, y = -1000 + Rg() * 2000 + ((t * 30 + Rg() * 80) % 80); ctx.beginPath(); ctx.ellipse(x, y, 4, 7, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
  // caracol del «muy despacio»: barra de cambio que casi no avanza
  const a = sm(Tk.despacio - 0.4, Tk.despacio, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(8,10,16,0.8)'; ctx.beginPath(); ctx.roundRect(150, 1240, 720, 110, 55); ctx.fill(); ctx.fillStyle = GR; ctx.beginPath(); ctx.roundRect(170, 1260, 40 + 30 * win(t, Tk.despacio, S(12)), 70, 35); ctx.fill(); ctx.font = '800 46px Fredoka'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText('CAMBIO', 560, 1296); ctx.restore(); }
  P.tag(ctx, 'MUY DESPACIO', 470, 520, t, Tk.despacio - 0.3, S(12), { mono: true, col: GR, px: 60 });
 }, sfx(k) { k.play('whoosh', S(10), { dur: 0.6, top: 1200, gain: 0.25, minor: true }); k.noise(S(10) + 0.2, { dur: 2.6, color: 'pink', filter: 'bandpass', f: 1200, q: 2, gain: 0.03, a: 0.5 }); FX.etiqueta(k, Tk.despacio - 0.3); } });

 // ---------- 8 · como tu cuchara: solo cambian los detalles → cucharas antiguas y modernas al lado de los cocodrilos ----------
 B.push({ t0: S(12), t1: S(14), in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const cam = camK(t, [[S(12), 0, -260, 0.6], [S(14), 0, -240, 0.64]]); fondoPlano(ctx, '#20142a', '#0c0a12'); ctx.save(); vista(ctx, cam);
  ctx.fillStyle = '#2d2238'; ctx.beginPath(); ctx.roundRect(-900, -1050, 1800, 1500, 60); ctx.fill();
  const det = sm(Tk.detalles - 0.4, Tk.detalles, t);
  cuchara(ctx, -560, -900, 0.6, -1.3, { c0: '#c7a76a', c1: '#8a6a3a' }); cuchara(ctx, 560, -900, 0.6, 1.3, { c0: '#f4f6fa', c1: '#b0b8c6' });
  ctx.save(); ctx.translate(120, -230); ctx.scale(0.72, 0.72); cocoLado(ctx, t, { antiguo: 1, ola: 30 }); ctx.restore(); ctx.save(); ctx.translate(120, 200); ctx.scale(0.72, 0.72); cocoLado(ctx, t, { ola: 30 }); ctx.restore();
  if (det > 0) { ctx.save(); ctx.globalAlpha = det; ctx.strokeStyle = YE; ctx.lineWidth = 10; ctx.setLineDash([20, 14]); for (const [x, y, r] of [[-560, -900, 100], [400, -270, 110], [400, 160, 110]]) { ctx.beginPath(); ctx.arc(x, y, r + Math.sin(t * 6) * 6, 0, TAU); ctx.stroke(); } ctx.setLineDash([]); ctx.restore(); }
  ctx.font = '900 64px Fredoka'; ctx.textAlign = 'left'; ctx.fillStyle = '#c8a979'; ctx.fillText('ANTES', -820, -440); ctx.fillStyle = GR; ctx.fillText('HOY', -820, -10);
  ctx.restore(); P.tag(ctx, 'SOLO LOS DETALLES', 470, 520, t, Tk.detalles - 0.4, S(14), { mono: true, col: YE, px: 58 });
 }, sfx(k) { k.play('swish', S(12), { gain: 0.3 }); k.play('ding', Tk.cuchara2, { f: 'G6', gain: 0.12, minor: true }); FX.etiqueta(k, Tk.detalles - 0.4); } });

 // ---------- 9 · −66 millones: cae el asteroide → los dinosaurios miran arriba (susto), IMPACTO, desaparecen… ----------
 B.push({ t0: S(14), t1: S(16), in: { type: 'zoom', d: 0.45, x: 540, y: 900 }, draw(ctx, t) {
  const golpes = [[T_IMPACTO, 1.3]], sh = sacude(t, golpes, 46), susto = sm(Tk.sesenta, Tk.sesenta + 0.6, t), ap = sm(T_IMPACTO + 0.3, Tk.desaparecieron + 0.4, t), q = cl((t - S(14) - 0.4) / (T_IMPACTO - S(14) - 0.4));
  const cam = camK(t, [[S(14), 0, -230, 0.5], [T_IMPACTO, 60, -240, 0.56], [S(16), 0, -200, 0.52]]); fondoPlano(ctx, '#3a1414', '#120808'); ctx.save(); vista(ctx, cam, sh, 1080);
  cieloTarde(ctx, { c0: '#2a0e18', c1: '#a8392e', c2: '#ff8a3a', sol: false }); if (t < T_IMPACTO) asteroideDib(ctx, lerp(900, 250, q), lerp(-1900, -300, q), 70 + 40 * q, t);
  volcan(ctx, -800, -40, 0.9, t); orillaLejana(ctx, t);
  ctx.save(); ctx.globalAlpha *= 1 - ap; sauropodo(ctx, -380, -40, 0.75, t, { col: '#2a1622', mira: susto, ojo: true }); teropodo(ctx, 520, -30, 0.8, t, { susto, col: '#3a1a22' }); ctx.restore();
  agua(ctx, t, { top: '#8a3324', sol: false }); helecho(ctx, -950, 40, 1.4, t, '#2a1a12'); helecho(ctx, 1000, 60, 1.5, t, '#2a1a12');
  if (t > T_IMPACTO) { const d = t - T_IMPACTO; ctx.fillStyle = `rgba(120,80,70,${Math.min(0.75, d * 0.6)})`; ctx.beginPath(); ctx.ellipse(250, -40, 300 + d * 1600, 120 + d * 700, 0, Math.PI, TAU); ctx.fill(); }
  ctx.restore(); bandada(ctx, t, 560, 8, '#2a0e14', 1 - sm(T_IMPACTO, T_IMPACTO + 0.3, t)); fogonazo(ctx, t, golpes);
  contador(ctx, t, S(14), T_IMPACTO - 0.1, 200, 66, { dur: 1.2 }); lineaTiempo(ctx, t, sm(S(14), S(14) + 0.3, t) * (1 - sm(T_IMPACTO - 0.3, T_IMPACTO, t)), lerp(0, 0.67, E.inOut(win(t, S(14), S(14) + 1.2))));
  P.tag(ctx, 'DESAPARECIERON', 470, 520, t, Tk.desaparecieron - 0.3, S(16), { mono: true, col: RD, px: 60 });
 }, sfx(k) { FX.reloj(k, S(14), 8, 0.12, 0.6); k.play('riser', S(14) + 0.3, { dur: T_IMPACTO - S(14) - 0.3, gain: 0.4 }); k.play('whoosh', T_IMPACTO - 1.0, { dur: 1.0, top: 2600, gain: 0.45 }); k.play('thud', T_IMPACTO, { f: 32, gain: 1.0 }); k.play('thud', T_IMPACTO + 0.1, { f: 48, gain: 0.6, minor: true }); k.noise(T_IMPACTO, { dur: 3.5, color: 'brown', filter: 'lowpass', f: [[0, 1600], [3.5, 60]], gain: 0.45, a: 0.003 }); k.noise(T_IMPACTO - 0.01, { dur: 0.2, filter: 'highpass', f: 2000, gain: 0.4, a: 0.001 }); FX.etiqueta(k, Tk.desaparecieron - 0.3); } });

 // ---------- 10 · …y el cocodrilo siguió nadando → PLANO BAJO EL AGUA: arriba arde el cielo, abajo nada tranquilo ----------
 B.push({ t0: S(16), t1: S(17), in: { type: 'zoom', d: 0.45, x: 540, y: 1100 }, draw(ctx, t) {
  const cam = camK(t, [[S(16), -220, 330, 0.78], [S(17), -110, 340, 0.86]]); fondoPlano(ctx, '#0b2a33', '#04121a'); ctx.save(); vista(ctx, cam);
  const g = ctx.createLinearGradient(0, -900, 0, 0); g.addColorStop(0, '#5a1a14'); g.addColorStop(1, '#d0602e'); ctx.fillStyle = g; ctx.fillRect(-3000, -1800, 6000, 1800); for (let k = 0; k < 8; k++) { const ph = (t * 0.2 + k / 8) % 1; ctx.fillStyle = `rgba(60,40,40,${0.5 * (1 - ph)})`; ctx.beginPath(); ctx.arc(-1200 + k * 340, -300 - ph * 700, 120 + ph * 200, 0, TAU); ctx.fill(); }
  const w = ctx.createLinearGradient(0, 0, 0, 1400); w.addColorStop(0, '#2e6a6a'); w.addColorStop(1, '#06222c'); ctx.fillStyle = w; ctx.fillRect(-3000, 0, 6000, 2400);
  ctx.strokeStyle = 'rgba(255,190,140,0.7)'; ctx.lineWidth = 8; ctx.beginPath(); for (let x = -3000; x <= 3000; x += 40) ctx.lineTo(x, 6 * Math.sin(x * 0.02 + t * 3)); ctx.stroke();
  for (let k = 0; k < 7; k++) { const x = -900 + k * 300 + Math.sin(t * 0.7 + k) * 60; ctx.fillStyle = 'rgba(255,200,150,0.08)'; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 140, 0); ctx.lineTo(x + 340, 1400); ctx.lineTo(x + 140, 1400); ctx.closePath(); ctx.fill(); }
  const R = H.rng(81); for (let i = 0; i < 40; i++) { const x = -1200 + R() * 2400, y0 = R() * 1400, y = 1400 - ((1400 - y0 + t * (60 + R() * 80)) % 1400); ctx.strokeStyle = 'rgba(200,240,255,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + Math.sin(t * 2 + i) * 10, y, 4 + R() * 8, 0, TAU); ctx.stroke(); }
  ctx.fillStyle = '#123a2c'; for (let k = 0; k < 14; k++) { const x = -1400 + k * 210; ctx.beginPath(); ctx.moveTo(x, 1400); ctx.quadraticCurveTo(x + 40 + Math.sin(t * 1.5 + k) * 40, 1000, x + 20 + Math.sin(t * 1.5 + k) * 70, 820); ctx.lineTo(x + 40, 1400); ctx.fill(); }
  ctx.save(); ctx.translate(-80 + (t - S(16)) * 90, 420); cocoLado(ctx, t, { ola: 70, patas: false }); ctx.restore();
  ctx.restore();
 }, sfx(k) { k.noise(S(16), { dur: S(17) - S(16), color: 'brown', filter: 'lowpass', f: 300, gain: 0.12, a: 0.1, hold: 1.4 }); FX.burbujas(k, S(16) + 0.2, 1.6, 10, 5, 0.9); FX.inmersion(k, S(16), 0.9); } });

 // ---------- 11 · ¿Cómo sobrevivió? → PRIMER PLANO DE LOS OJOS asomando (parpadeo), la pausa larga ----------
 B.push({ t0: S(17), t1: S(18), in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  const cam = camK(t, [[S(17), 480, -40, 2.4], [S(18), 480, -40, 2.9]]); fondoPlano(ctx, '#2a1d4a', '#0d1420'); ctx.save(); vista(ctx, cam, [0, 0], 1000); cieloTarde(ctx, { sx: 760, sy: -200 }); orillaLejana(ctx, t); agua(ctx, t, { sx: 760 });
  ctx.save(); ctx.translate(0, 105); cocoLado(ctx, t, { ola: 10, patas: false, parpado: (t > S(17) + 0.9 && t < S(17) + 1.05) ? 1 : 0 }); ctx.restore(); ctx.fillStyle = 'rgba(70,52,84,0.7)'; ctx.fillRect(-3000, 14, 6000, 2000); ondas(ctx, 480, 6, t, S(17), 3, 200);
  const q = sm(S(17) + 0.2, S(17) + 0.5, t); if (q > 0) { ctx.save(); ctx.globalAlpha *= q; txt(ctx, '?', 560, -260, 120 * E.out(q), YE, { w: 900, f: 'Fredoka' }); ctx.restore(); }
  ctx.restore();
 }, sfx(k) { FX.aparece(k, S(17) + 0.2, 480); k.noise(S(17), { dur: S(18) - S(17), color: 'pink', filter: 'lowpass', f: 600, gain: 0.04, a: 0.2 }); } });

 // ---------- 12 · primero, la sangre fría: el sol lo calienta… come mucho menos… meses sin comer ----------
 B.push({ t0: S(18), t1: S(21), in: { type: 'zoom', d: 0.45, x: 540, y: 900 }, draw(ctx, t) {
  const cal = sm(Tk.sol - 0.2, Tk.sol + 0.4, t), mes = t >= Tk.meses - 0.3, cam = camK(t, [[S(18), -250, -40, 0.6], [Tk.sol, -230, -80, 0.62], [Tk.menos + 0.2, 380, -60, 1.25], [S(20), 400, -60, 1.3], [Tk.meses, 0, -200, 0.62], [S(21), 0, -200, 0.64]]);
  fondoPlano(ctx, '#3a2a40', '#141018'); ctx.save(); vista(ctx, cam); cieloTarde(ctx, { c0: '#3a5a8a', c1: '#f0a050', c2: '#ffe08a', sx: 520, sy: -820 });
  for (let k = 0; k < 10; k++) { const a = k / 10 * TAU + t * 0.2; ctx.strokeStyle = `rgba(255,230,140,${0.35 * cal})`; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(520 + Math.cos(a) * 170, -820 + Math.sin(a) * 170); ctx.lineTo(520 + Math.cos(a) * 280, -820 + Math.sin(a) * 280); ctx.stroke(); }
  orillaLejana(ctx, t); agua(ctx, t, { sx: 520 }); ctx.fillStyle = '#6a5436'; ctx.beginPath(); ctx.moveTo(-3000, -10); ctx.lineTo(600, -10); ctx.quadraticCurveTo(800, 20, 900, 160); ctx.lineTo(-3000, 900); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.translate(-100, -90); cocoLado(ctx, t, { ola: 6, boca: 0.35 * sm(Tk.fria, Tk.fria + 0.5, t) }); if (cal > 0) P.glow(ctx, -150, -100, 700, '255,170,80', 0.35 * cal); ctx.restore();
  if (cal > 0) { for (let k = 0; k < 6; k++) { const ph = (t * 0.6 + k / 6) % 1; ctx.strokeStyle = `rgba(255,190,120,${0.4 * cal * Math.sin(ph * Math.PI)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-500 + k * 160, -260 - ph * 260); ctx.quadraticCurveTo(-470 + k * 160, -300 - ph * 260, -500 + k * 160, -340 - ph * 260); ctx.stroke(); } }
  // calendario: los meses pasan
  if (mes) { const a = sm(Tk.meses - 0.3, Tk.meses, t), nm = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'], k = Math.min(5, Math.floor((t - Tk.meses) * 4)), fl = ((t - Tk.meses) * 4) % 1;
   ctx.save(); ctx.globalAlpha *= a; ctx.translate(520, -620); ctx.fillStyle = '#f4efe2'; ctx.beginPath(); ctx.roundRect(-170, -150, 340, 300, 24); ctx.fill(); ctx.fillStyle = RD; ctx.beginPath(); ctx.roundRect(-170, -150, 340, 80, [24, 24, 0, 0]); ctx.fill(); ctx.font = '900 110px Fredoka'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#222'; ctx.fillText(nm[Math.max(0, k)], 0, 40);
   if (k < 5) { ctx.save(); ctx.globalAlpha *= 1 - fl; ctx.translate(0, -70); ctx.rotate(-fl * 1.2); ctx.fillStyle = '#e8e0cc'; ctx.fillRect(-170, 0, 340, 220 * (1 - fl)); ctx.restore(); } ctx.restore(); }
  ctx.restore(); primerTermino(ctx, t, 1290); bandada(ctx, t, 540, 7);
  P.tag(ctx, 'SANGRE FRÍA', 470, 520, t, Tk.fria - 0.4, Tk.menos - 0.2, { mono: true, col: YE, px: 60 });
  P.tag(ctx, 'COME MUCHO MENOS', 470, 520, t, Tk.menos - 0.2, Tk.meses - 0.35, { mono: true, col: YE, px: 56 });
  P.tag(ctx, 'MESES SIN COMER', 470, 520, t, Tk.meses - 0.3, S(21), { mono: true, col: YE, px: 58 });
 }, sfx(k) { FX.etiqueta(k, Tk.fria - 0.4); k.tone(Tk.sol - 0.1, { f: [[0, 300], [0.8, 600]], dur: 0.9, gain: 0.04, a: 0.3 }); FX.etiqueta(k, Tk.menos - 0.2); FX.paginas(k, Tk.meses, 5, 0.8); FX.etiqueta(k, Tk.meses - 0.3); } });

 // ---------- 13 · segundo, vive entre el agua y la tierra y come casi de todo → plano MITAD BAJO EL AGUA / MITAD FUERA ----------
 B.push({ t0: S(21), t1: S(24), in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const sale = E.inOut(win(t, Tk.aguaT - 0.2, Tk.tierra + 0.6)), com = sm(Tk.todo - 0.6, Tk.todo, t), sob = sm(Tk.sobrevivieron - 0.6, Tk.sobrevivieron, t);
  const px = lerp(-300, 380, sale), py = lerp(200, -170, sale), zz = camK(t, [[S(21), 0, 0, 0.6], [Tk.todo, 0, 0, 0.62], [S(24), 0, 0, 0.58]])[2], cam = [px - 100, py - 150, zz]; fondoPlano(ctx, '#2a1d4a', '#06222c'); ctx.save(); vista(ctx, cam);
  cieloTarde(ctx, { sx: -500, sy: -500 }); orillaLejana(ctx, t); ctx.fillStyle = '#6a5436'; ctx.beginPath(); ctx.moveTo(300, 0); ctx.quadraticCurveTo(600, -60, 3000, -80); ctx.lineTo(3000, 900); ctx.lineTo(500, 900); ctx.closePath(); ctx.fill();
  const w = ctx.createLinearGradient(0, 0, 0, 1200); w.addColorStop(0, 'rgba(46,106,106,0.9)'); w.addColorStop(1, 'rgba(6,34,44,1)'); ctx.fillStyle = w; ctx.beginPath(); ctx.moveTo(-3000, 0); ctx.lineTo(300, 0); ctx.quadraticCurveTo(500, 300, 900, 1200); ctx.lineTo(-3000, 1200); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,220,200,0.7)'; ctx.lineWidth = 6; ctx.beginPath(); for (let x = -3000; x <= 330; x += 40) ctx.lineTo(x, 5 * Math.sin(x * 0.03 + t * 3)); ctx.stroke();
  ctx.fillStyle = '#123a2c'; for (let k = 0; k < 16; k++) { const x = -1600 + k * 130; ctx.beginPath(); ctx.moveTo(x, 1200); ctx.quadraticCurveTo(x + 30 + Math.sin(t * 1.5 + k) * 40, 900, x + 20 + Math.sin(t * 1.5 + k) * 60, 640 + (k % 3) * 60); ctx.lineTo(x + 40, 1200); ctx.fill(); }
  { const Rb = H.rng(82); for (let i = 0; i < 30; i++) { const x = -1500 + Rb() * 1800, y = 1100 - ((Rb() * 1000 + t * (60 + Rb() * 60)) % 1000); ctx.strokeStyle = 'rgba(200,240,255,0.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 5 + Rb() * 8, 0, TAU); ctx.stroke(); } }
  ctx.save(); ctx.translate(px, py); ctx.rotate(lerp(0.1, -0.08, sale)); cocoLado(ctx, t, { ola: 40, camina: sale > 0.5, boca: 0.5 * com * (1 - sm(Tk.todo + 0.4, Tk.todo + 0.8, t)) }); ctx.restore();
  // «come casi de todo»: un pez, un cangrejo, un ave y una fruta entran hacia la boca
  if (com > 0) { const items = [['pez', -100, 300], ['cangrejo', 900, 60], ['ave', 1100, -500], ['manzana', 700, -620]]; items.forEach(([n, x, y], i) => { const u = cl((t - Tk.todo + 0.6 - i * 0.12) / 0.9); if (u <= 0 || u >= 1) return; const bx = lerp(x, 980, u), by = lerp(y, -200, u); ctx.save(); ctx.globalAlpha *= 1 - u * 0.7; comida(ctx, n, bx, by, 1.1, t); ctx.restore(); }); }
  ctx.restore();
  bandada(ctx, t, 540, 8);
  if (sob > 0) { ctx.save(); ctx.globalAlpha = sob; ctx.fillStyle = 'rgba(8,10,16,0.72)'; ctx.beginPath(); ctx.roundRect(150, 1170, 720, 230, 36); ctx.fill(); ctx.font = '800 50px Fredoka'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = GR; ctx.fillText('AGUA + TIERRA', 510, 1235); ctx.fillStyle = '#fff'; ctx.fillText('= SOBREVIVIERON', 510, 1325); ctx.restore(); if (P.safeLog) P.safeLog('cifra', 150, 1170, 870, 1400); }
  P.tag(ctx, 'AGUA Y TIERRA', 470, 520, t, Tk.aguaT - 0.3, Tk.todo - 0.6, { mono: true, col: CY, px: 60 });
  P.tag(ctx, 'COME DE TODO', 470, 520, t, Tk.todo - 0.6, S(24), { mono: true, col: YE, px: 60 });
 }, sfx(k) { FX.chapuzon(k, Tk.aguaT, 0.8); FX.etiqueta(k, Tk.aguaT - 0.3); k.noise(Tk.tierra, { dur: 1, color: 'brown', filter: 'bandpass', f: 400, q: 1, gain: 0.08, a: 0.2 }); FX.etiqueta(k, Tk.todo - 0.6); for (let i = 0; i < 4; i++) k.play('pop', Tk.todo - 0.3 + i * 0.12, { f: 500 + i * 120, gain: 0.25, minor: true }); FX.correcto(k, Tk.sobrevivieron); } });

 // ---------- 14 · y tercero, su cuerpo ya funcionaba tan bien → VISTA DESDE ARRIBA con ojos, narinas y coraza resaltados ----------
 B.push({ t0: S(24), t1: S(26), in: { type: 'zoom', d: 0.45, x: 540, y: 900 }, draw(ctx, t) {
  const cam = camK(t, [[S(24), 0, 0, 0.95], [Tk.cuerpo + 0.4, 278, -500, 1.4], [Tk.cuerpo + 1.0, 278, -500, 1.4], [Tk.cuerpo + 1.5, 0, 0, 1.0], [S(26), 0, 0, 1.0]]); ctx.fillStyle = '#16221f'; ctx.fillRect(0, 0, W, HH); ctx.save(); vista(ctx, cam); ctx.rotate(0.5);
  const g = ctx.createLinearGradient(-900, 0, 900, 0); g.addColorStop(0, '#2b3a2a'); g.addColorStop(0.5, '#2d4a5c'); g.addColorStop(1, '#2b3a2a'); ctx.fillStyle = g; ctx.fillRect(-1600, -2600, 3200, 5200);
  const R = H.rng(23); ctx.lineWidth = 4; for (let i = 0; i < 40; i++) { const x = -900 + R() * 1800, y0 = -2400 + R() * 4800, y = ((y0 + t * 120) % 4800) - 2400; ctx.strokeStyle = 'rgba(255,220,200,0.18)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 50, y - 10, x + 100, y); ctx.stroke(); }
  nenufaresTop(ctx, t); cocoTop(ctx, t, { ola: 50 });
  const h1 = sm(Tk.cuerpo - 0.2, Tk.cuerpo + 0.2, t), h2 = sm(Tk.cuerpo + 1.0, Tk.cuerpo + 1.4, t); ctx.lineWidth = 10; ctx.setLineDash([20, 12]);
  if (h1 > 0) { ctx.strokeStyle = `rgba(255,210,63,${h1})`; ctx.beginPath(); ctx.ellipse(0, -580, 150, 190, 0, 0, TAU); ctx.stroke(); }
  if (h2 > 0) { ctx.strokeStyle = `rgba(143,216,255,${h2})`; ctx.beginPath(); ctx.roundRect(-150, -330, 300, 620, 60); ctx.stroke(); }
  ctx.setLineDash([]); ctx.restore();
  P.tag(ctx, 'OJOS Y NARINAS FUERA', 470, 520, t, Tk.cuerpo - 0.2, Tk.cuerpo + 1.0, { mono: true, col: YE, px: 52 });
  P.tag(ctx, 'CORAZA', 470, 520, t, Tk.cuerpo + 1.0, S(26), { mono: true, col: CY, px: 62 });
 }, sfx(k) { k.play('whoosh', S(24), { dur: 0.7, top: 1400, gain: 0.3, minor: true }); FX.etiqueta(k, Tk.cuerpo - 0.2); FX.etiqueta(k, Tk.cuerpo + 1.0); FX.correcto(k, Tk.cambiar); } });

 // ---------- 15 · por eso hoy, en tu río, nada uno casi igual que entonces → vuelta a HOY: el antiguo y el de hoy, superpuestos ----------
 B.push({ t0: S(26), t1: S(27), in: { type: 'zoom', d: 0.45, x: 540, y: 960 }, draw(ctx, t) {
  const vuelve = E.inOut(win(t, S(26), Tk.hoy + 0.2)), ig = sm(Tk.igual - 0.5, Tk.igual, t), cam = camK(t, [[S(26), -170, -120, 0.6], [Tk.hoy + 0.3, -140, -90, 0.66], [S(27), -120, -90, 0.7]]);
  fondoPlano(ctx, '#2a1d4a', '#0d1420'); ctx.save(); vista(ctx, cam);
  if (vuelve < 1) { ctx.save(); ctx.globalAlpha *= 1 - vuelve; jurasico(ctx, t, { tero: false }); ctx.restore(); } ctx.save(); ctx.globalAlpha *= vuelve; cieloTarde(ctx); orillaLejana(ctx, t); agua(ctx, t); ctx.restore();
  ctx.save(); ctx.translate(-120, 50); cocoLado(ctx, t, { ola: 50, patas: false }); ctx.restore();
  ctx.fillStyle = 'rgba(70,52,84,0.45)'; ctx.fillRect(-3000, 20, 6000, 2000);
  if (ig > 0) { ctx.save(); ctx.globalAlpha *= 0.6 * ig; ctx.translate(-120 + 16 * Math.sin(t * 2), 46); cocoLado(ctx, t, { antiguo: 1, ola: 50, patas: false }); ctx.restore(); } ondas(ctx, 400, 6, t, S(26), 3, 300); juncos(ctx, t, -1000, 120, 10, 700); juncos(ctx, t, 1100, 120, 10, 760, 7);
  ctx.restore(); primerTermino(ctx, t, 1250); contador(ctx, t, S(26), Tk.igual - 0.6, 66, 0, { dur: 1.0, col: GR });
  P.tag(ctx, 'CASI IGUAL', 470, 520, t, Tk.igual - 0.4, S(27), { mono: true, col: GR, px: 62 });
 }, sfx(k) { k.play('whoosh', S(26), { dur: 1.0, top: 1800, gain: 0.35 }); FX.reloj(k, S(26), 8, 0.1, 0.6); FX.revelar(k, Tk.igual - 0.4); } });

 // ---------- 16 · CIERRE ----------
 B.push({ t0: S(27), t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  fondoPlano(ctx, '#2a1d4a', '#0d1420');
  P.ctaShare(ctx, t, S(27) + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { fondoPlano(cc, '#2a1d4a', '#0d1420'); cc.save(); vista(cc, [300, -120, 1.0], [0, 0], 1100); cieloTarde(cc); orillaLejana(cc, t); agua(cc, t); cc.save(); cc.translate(0, 60); cc.rotate(-0.3); cocoLado(cc, t, { boca: 0.8, patas: false }); cc.restore(); cc.fillStyle = 'rgba(70,52,84,0.6)'; cc.fillRect(-3000, 20, 6000, 2000); cc.restore(); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'], manoImg: 'frente' });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, S(27) + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'noche', capBorde: true, marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['ojos', 'sorprender.', 'cuchara.', 'funciona.', 'doscientos', 'dinosaurios,', 'parecidos', 'mordida', 'evolucionado…', 'despacio.', 'detalles.', 'asteroide.', 'desaparecieron…', 'nadando.', 'sobrevivió?', 'fría:', 'meses', 'agua', 'todo:', 'cuerpo', 'igual', 'amigo'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 900, gain: 0.03, a: 0.05, hold: DURATION - 2.5 }); for (let x = 0.5; x < DURATION - 3; x += 3.7) k.noise(x, { dur: 1.6, color: 'pink', filter: 'bandpass', f: 2600, q: 2, gain: 0.012, a: 0.6 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 80, gain: 0.45, chords: [['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3'], ['C2', 'G2', 'C3', 'E3'], ['A1', 'E2', 'A2', 'C#3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
