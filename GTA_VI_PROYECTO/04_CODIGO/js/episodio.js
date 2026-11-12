// =====================================================================================================
// episodio.js — «13 años esperando GTA VI» · PLANTILLA ASOMBROTECA v1.29 · estilo «noche» con neón tropical
// Voz: ElevenLabs Eleven v4, Dan, UNA toma con 3 ganchos de un tramo cada uno ([GANCHO A/B/C]) → el cuerpo empieza en el tramo 1.
// Sin capturas, logos, personajes ni arte de Rockstar/GTA: todo dibujado y genérico (ciudad de neón, palmeras, autos, mandos y
// consolas sin marcas). Mapas REALES de Natural Earth (dominio público): Florida y el mundo (js/mapas.js).
// Metáfora sostenida: una MAQUETA DE CIUDAD que se construye pieza a pieza («no se programa un juego: se construye un país»).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A, { lead: 0.2, tail: 1.5 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, B0, DURATION, txt } = K;
 const GANCHO = window.GANCHO || 'A';
 const S = (i) => A.segments[i].s, Se = (i) => A.segments[i].e;
 const Tk = {
  g0e: Se(0),
  v2013: wt(1, '2013.'), diez: wt(2, '10'), veinti: wt(2, '23.'), tres: wt(3, 'tres'), consolas: wt(3, 'consolas.'), vi: wt(4, 'VI…'), llegaba: wt(5, 'llegaba.'),
  hicieran: wt(6, 'hicieran.'), programa: wt(7, 'programa'), construye: wt(8, 'construye'), pais: wt(8, 'país.'),
  leonida: wt(9, 'Leonida,'), florida: wt(10, 'Florida,'), vice: wt(10, 'Vice'),
  calle: wt(11, 'calle,'), tienda: wt(11, 'tienda,'), palmera: wt(11, 'palmera'), miles: wt(11, 'miles'), paises: wt(11, 'países.'),
  diciembre: wt(12, 'diciembre'), trailer: wt(12, 'tráiler,'), historia: wt(13, 'historia:'), n90: wt(14, '90'), h24: wt(14, '24'), ningun: S(15), youtube: wt(15, 'YouTube.'),
  retrasaron: wt(16, 'retrasaron'), veces: wt(16, 'veces…'), pulirlo: wt(17, 'pulirlo.'),
  fecha: wt(18, 'fecha:'), d19: wt(19, '19'), noviembre: wt(19, 'noviembre'), y2026: wt(19, '2026.'), trece: S(20), vuelves: wt(21, 'vuelves'), city: wt(21, 'City.'), envia: S(22),
 };
 const PINK = '#ff3fa4', CYAN = '#36e6ff', GOLD = '#FFC845', VIO = '#8b5cff', SKIN = '#c98b62', HAIR = '#2a1a10';
 const R = (a, b, t) => E.out(win(t, a, b));

 // =====================================================================================================
 // DIBUJO PROPIO (genérico)
 // =====================================================================================================
 // ---- fondo de neón tropical: cielo violeta → magenta, sol de neón con franjas, mar ----
 const cielo = (ctx, t, o = {}) => { const hz = o.hz ?? 1180, g = ctx.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, '#0b0620'); g.addColorStop(0.55, '#2a0b4a'); g.addColorStop(0.85, '#7a1a6e'); g.addColorStop(1, '#ff5f8a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, hz);
  if (o.sol !== false) { const sx = o.sx ?? 540, sy = hz - 40, r = 230; ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, r, Math.PI, 0); ctx.clip(); const gs = ctx.createLinearGradient(0, sy - r, 0, sy); gs.addColorStop(0, '#ffd166'); gs.addColorStop(1, '#ff3fa4'); ctx.fillStyle = gs; ctx.fillRect(sx - r, sy - r, 2 * r, r); ctx.fillStyle = '#2a0b4a'; for (let k = 0; k < 6; k++) ctx.fillRect(sx - r, sy - 18 - k * 34, 2 * r, 6 + k * 1.5); ctx.restore(); P.glow(ctx, sx, sy - 60, 420, '255,95,138', 0.35); }
  const gm = ctx.createLinearGradient(0, hz, 0, HH); gm.addColorStop(0, '#3a0f55'); gm.addColorStop(1, '#090418'); ctx.fillStyle = gm; ctx.fillRect(0, hz, W, HH - hz);
  ctx.strokeStyle = 'rgba(255,120,200,0.25)'; ctx.lineWidth = 3; for (let k = 0; k < 9; k++) { const yy = hz + 14 + k * k * 9, o2 = (t * 40 + k * 70) % 260; ctx.beginPath(); ctx.moveTo(380 + o2 - 130 - k * 8, yy); ctx.lineTo(700 + o2 - 130 + k * 8, yy); ctx.stroke(); } };
 const fondo = (ctx, t, c0 = '#0b0620', c1 = '#1d0a3a') => { P.fondo(ctx, t, 'noche', { c0, c1 }); };
 // ---- palmera ----
 const palmera = (ctx, x, y, h, t, o = {}) => { const sw = Math.sin(t * 1.3 + x) * 0.04, col = o.col || '#12061f'; ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineWidth = h * 0.045;
  const tx = x + h * 0.12 + Math.sin(sw) * h * 0.1, ty = y - h; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + h * 0.02, y - h * 0.6, tx, ty); ctx.stroke();
  ctx.fillStyle = col; for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.48 + sw, L = h * (0.42 + 0.06 * Math.cos(k)); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - h * 0.08, tx + Math.cos(a) * L, ty + Math.sin(a) * L + h * 0.12); ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.5, ty + Math.sin(a) * L * 0.4, tx, ty); ctx.fill(); }
  if (o.neon) { ctx.strokeStyle = o.neon; ctx.lineWidth = 3; ctx.shadowColor = o.neon; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + h * 0.02, y - h * 0.6, tx, ty); ctx.stroke(); }
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 4, h * 0.12, h * 0.02, 0, 0, TAU); ctx.fill(); ctx.restore(); };
 // ---- ciudad de neón (maqueta): b = cuánto se ha construido (0…1), luz = luces encendidas (0…1) ----
 const EDIF = (() => { const Rr = H.rng(77), out = []; let x = 40; while (x < 1040) { const w = 70 + Rr() * 90, h = 180 + Rr() * 420 + (Math.abs(x - 560) < 260 ? 160 : 0); out.push({ x, w, h, c: Rr() < 0.5 ? PINK : CYAN, sign: Rr() < 0.35, ord: Rr() }); x += w + 6 + Rr() * 10; } return out; })();
 const ciudad = (ctx, t, base, o = {}) => { const b = o.b ?? 1, luz = o.luz ?? 1, sc = o.sc ?? 1, cx = o.cx ?? 540; ctx.save(); ctx.translate(cx, base); ctx.scale(sc, sc); ctx.translate(-540, 0);
  EDIF.forEach((e, i) => { const q = E.out(cl((b * 1.25 - e.ord * 0.25 - (i / EDIF.length) * 0.0) / 1)); if (q <= 0) return; const h = e.h * q; ctx.fillStyle = '#160a2c'; ctx.fillRect(e.x, -h, e.w, h); ctx.strokeStyle = `rgba(${e.c === PINK ? '255,63,164' : '54,230,255'},${0.35 + 0.5 * luz})`; ctx.lineWidth = 3; ctx.strokeRect(e.x, -h, e.w, h);
   if (luz > 0) { const Rr = H.rng(i + 5); for (let yy = -h + 18; yy < -10; yy += 26) for (let xx = e.x + 10; xx < e.x + e.w - 12; xx += 18) { const on = Rr() < 0.55 && Math.sin(t * 0.7 + xx * 0.3 + yy) > -0.95; if (on) { ctx.fillStyle = `rgba(255,${200 + Rr() * 55 | 0},${150 + Rr() * 80 | 0},${0.75 * luz})`; ctx.fillRect(xx, yy, 8, 12); } } }
   if (e.sign && q > 0.95 && luz > 0) { const fl = Math.sin(t * 9 + i) > -0.85 ? 1 : 0.3; ctx.save(); ctx.globalAlpha *= luz * fl; ctx.strokeStyle = e.c; ctx.shadowColor = e.c; ctx.shadowBlur = 22; ctx.lineWidth = 6; ctx.strokeRect(e.x + e.w * 0.2, -h + 24, e.w * 0.6, 34); ctx.restore(); } });
  ctx.restore(); };
 // ---- auto deportivo genérico (lateral) ----
 const auto = (ctx, x, y, s, t, col = PINK) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 4, 120, 10, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-115, -14); ctx.lineTo(-108, -38); ctx.lineTo(-40, -44); ctx.lineTo(-10, -70); ctx.lineTo(50, -70); ctx.lineTo(85, -44); ctx.lineTo(118, -36); ctx.lineTo(120, -14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(160,230,255,0.85)'; ctx.beginPath(); ctx.moveTo(-28, -46); ctx.lineTo(-6, -64); ctx.lineTo(18, -64); ctx.lineTo(18, -46); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(26, -46); ctx.lineTo(26, -64); ctx.lineTo(46, -64); ctx.lineTo(72, -46); ctx.closePath(); ctx.fill();
  for (const wx of [-70, 72]) { ctx.fillStyle = '#0b0b12'; ctx.beginPath(); ctx.arc(wx, -12, 24, 0, TAU); ctx.fill(); ctx.save(); ctx.translate(wx, -12); ctx.rotate(t * 12); ctx.strokeStyle = '#9aa3b5'; ctx.lineWidth = 4; for (let k = 0; k < 5; k++) { ctx.rotate(TAU / 5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(13, 0); ctx.stroke(); } ctx.restore(); }
  P.glow(ctx, 118, -28, 60, '255,240,200', 0.6); ctx.restore(); };
 // ---- mando genérico (gen 1…3), sin marcas ni símbolos ----
 const mando = (ctx, x, y, s, gen = 3, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0); const body = gen === 3 ? '#eef0f5' : '#15171d', edge = gen === 3 ? '#1b1d24' : '#3a3f4b';
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 70, 120, 14, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = body; ctx.strokeStyle = edge; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-100, -30); ctx.quadraticCurveTo(0, -48 + gen * 4, 100, -30); ctx.quadraticCurveTo(135, -10, 128, 40 + gen * 4); ctx.quadraticCurveTo(118, 78, 92, 64); ctx.quadraticCurveTo(60, 30, 0, 32); ctx.quadraticCurveTo(-60, 30, -92, 64); ctx.quadraticCurveTo(-118, 78, -128, 40 + gen * 4); ctx.quadraticCurveTo(-135, -10, -100, -30); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (gen === 3) { ctx.fillStyle = '#1b1d24'; ctx.beginPath(); ctx.roundRect(-40, -34, 80, 46, 10); ctx.fill(); }
  if (gen === 2) { ctx.fillStyle = 'rgba(54,230,255,0.85)'; ctx.fillRect(-36, -36, 72, 6); }
  ctx.fillStyle = '#2a2d36'; for (const sx of [-34, 34]) { ctx.beginPath(); ctx.arc(sx, 22, 16, 0, TAU); ctx.fill(); }
  ctx.fillStyle = gen === 3 ? '#9aa3b5' : '#6b7180'; for (const [bx, by] of [[-82, -6], [-96, 8], [-68, 8], [-82, 22]]) { ctx.beginPath(); ctx.roundRect(bx - 7, by - 7, 14, 14, 3); ctx.fill(); }
  const cb = ['#ff5d73', '#36e6ff', '#5fd38d', '#ffc845']; [[82, -6], [96, 8], [68, 8], [82, 22]].forEach(([bx, by], k) => { ctx.fillStyle = cb[k]; ctx.beginPath(); ctx.arc(bx, by, 8, 0, TAU); ctx.fill(); });
  ctx.restore(); };
 // ---- consola genérica (gen 1…3), apoyada sobre su base ----
 const consola = (ctx, x, y, s, gen, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 4, 150, 14, 0, 0, TAU); ctx.fill();
  if (gen === 1) { const g = ctx.createLinearGradient(0, -110, 0, 0); g.addColorStop(0, '#3a3f4b'); g.addColorStop(1, '#0e0f14'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(-160, -60, -120, -100); ctx.lineTo(120, -100); ctx.quadraticCurveTo(160, -60, 150, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(-110, -92, 220, 8); }
  if (gen === 2) { ctx.fillStyle = '#16181f'; ctx.beginPath(); ctx.moveTo(-160, 0); ctx.lineTo(-150, -70); ctx.lineTo(150, -70); ctx.lineTo(160, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#0b0c10'; ctx.fillRect(-150, -38, 300, 6); ctx.fillStyle = 'rgba(54,230,255,0.9)'; ctx.shadowColor = '#36e6ff'; ctx.shadowBlur = 16; ctx.fillRect(-150, -40, 300 * (o.luz ?? 1), 4); ctx.shadowBlur = 0; }
  if (gen === 3) { ctx.fillStyle = '#f2f3f7'; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.quadraticCurveTo(-90, -160, -50, -300); ctx.lineTo(-20, -300); ctx.lineTo(-20, 0); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(60, 0); ctx.quadraticCurveTo(90, -160, 50, -300); ctx.lineTo(20, -300); ctx.lineTo(20, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#16181f'; ctx.fillRect(-20, -296, 40, 296); ctx.fillStyle = 'rgba(54,230,255,0.85)'; ctx.fillRect(-20, -296, 4, 296); }
  ctx.restore(); };
 // ---- persona genérica con mando (niño o adulto) ----
 const persona = (ctx, x, y, h, t, o = {}) => { const kid = !!o.kid, r = h * (kid ? 0.09 : 0.07), shirt = o.shirt || '#2a9df4', shY = y - h * (kid ? 0.76 : 0.8), hipY = y - h * 0.46, sw = h * (kid ? 0.1 : 0.13);
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 4, h * 0.18, h * 0.025, 0, 0, TAU); ctx.fill(); ctx.lineCap = 'round';
  for (const sg of [-1, 1]) { ctx.strokeStyle = '#1d2238'; ctx.lineWidth = h * 0.06; ctx.beginPath(); ctx.moveTo(x + sg * sw * 0.45, hipY); ctx.lineTo(x + sg * sw * 0.55, y - h * 0.02); ctx.stroke(); ctx.fillStyle = '#f2f3f7'; ctx.beginPath(); ctx.ellipse(x + sg * sw * 0.55 + sg * h * 0.015, y - h * 0.005, h * 0.045, h * 0.02, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = shirt; ctx.beginPath(); ctx.moveTo(x - sw, shY); ctx.lineTo(x + sw, shY); ctx.lineTo(x + sw * 0.85, hipY + h * 0.03); ctx.lineTo(x - sw * 0.85, hipY + h * 0.03); ctx.closePath(); ctx.fill();
  // brazos hacia el mando, a la altura del pecho
  const hy = shY + h * 0.2; for (const sg of [-1, 1]) { ctx.strokeStyle = shirt; ctx.lineWidth = h * 0.055; ctx.beginPath(); ctx.moveTo(x + sg * sw * 0.95, shY + h * 0.02); ctx.lineTo(x + sg * sw * 1.15, shY + h * 0.17); ctx.stroke(); ctx.strokeStyle = SKIN; ctx.lineWidth = h * 0.045; ctx.beginPath(); ctx.moveTo(x + sg * sw * 1.15, shY + h * 0.17); ctx.lineTo(x + sg * h * 0.06, hy); ctx.stroke(); }
  mando(ctx, x, hy + h * 0.005, h * (kid ? 0.0011 : 0.00095), o.gen || 1);
  ctx.fillStyle = SKIN; ctx.fillRect(x - r * 0.35, shY - r * 0.5, r * 0.7, r * 0.6); const cy = y - h + r; ctx.beginPath(); ctx.ellipse(x, cy, r * 0.95, r * 1.05, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = HAIR; ctx.beginPath(); ctx.ellipse(x, cy - r * 0.55, r * 1.0, r * 0.6, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.ellipse(x - r * 0.1, cy - r * 0.7, r * 0.9, r * 0.45, -0.2, 0, TAU); ctx.fill();
  if (o.barba) { ctx.fillStyle = 'rgba(42,26,16,0.55)'; ctx.beginPath(); ctx.ellipse(x, cy + r * 0.55, r * 0.7, r * 0.4, 0, 0, Math.PI); ctx.fill(); }
  for (const sg of [-1, 1]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x + sg * r * 0.36, cy, r * 0.15, r * 0.12, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#1b1210'; ctx.beginPath(); ctx.arc(x + sg * r * 0.36, cy + r * 0.04, r * 0.075, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = '#5a2418'; ctx.lineWidth = r * 0.08; ctx.beginPath(); ctx.arc(x, cy + r * 0.38, r * 0.22, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  // reflejo de la pantalla en la cara
  P.glow(ctx, x, cy, r * 2.2, '54,230,255', 0.18); ctx.restore(); };
 // ---- hoja de calendario ----
 const hojaCal = (ctx, x, y, w, h, top, big, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 12, w, h, 22); ctx.fill();
  ctx.fillStyle = '#f4f2fb'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.fill(); ctx.fillStyle = o.col || PINK; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h * 0.26, [22, 22, 0, 0]); ctx.fill();
  txt(ctx, top, 0, -h / 2 + h * 0.13, h * 0.13, '#ffffff', { w: 900, f: 'Fredoka' }); txt(ctx, big, 0, h * 0.14, h * (o.bigPx || 0.4), '#1a1430', { w: 900, f: 'Fredoka' });
  ctx.fillStyle = '#2a2f3d'; for (const fx of [-0.3, 0.3]) { ctx.beginPath(); ctx.roundRect(fx * w - 9, -h / 2 - 18, 18, 42, 9); ctx.fill(); } ctx.restore(); };
 // ---- tachado rojo animado ----
 const tacha = (ctx, x0, y0, x1, y1, q) => { if (q <= 0) return; ctx.save(); ctx.strokeStyle = '#ff3b5c'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.shadowColor = '#ff3b5c'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, cl(q * 2)), lerp(y0, y1, cl(q * 2))); if (q > 0.5) { ctx.moveTo(x1, y0); ctx.lineTo(lerp(x1, x0, (q - 0.5) * 2), lerp(y0, y1, (q - 0.5) * 2)); } ctx.stroke(); ctx.restore(); };
 // ---- letrero de neón con texto ----
 const neon = (ctx, s, x, y, px, col, t, a = 1) => { ctx.save(); ctx.globalAlpha *= a * (Math.sin(t * 11) > -0.9 ? 1 : 0.4); ctx.font = `900 ${px}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = px * 0.06; ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.strokeText(s, x, y); ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillText(s, x, y); ctx.restore(); };
 const movil = (ctx, x, y, w, h, on, t, i) => { ctx.fillStyle = '#0d0b1c'; ctx.strokeStyle = '#3a3360'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 12); ctx.fill(); ctx.stroke();
  if (on > 0) { ctx.save(); ctx.globalAlpha *= on; P.glow(ctx, x, y, h * 0.8, '255,63,164', 0.35); const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, '#ff3fa4'); g.addColorStop(1, '#7a1a6e'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - w / 2 + 6, y - h / 2 + 10, w - 12, h - 20, 7); ctx.fill();
   ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(x, y - h * 0.05, w * 0.2, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#1a0a2e'; const Rr = H.rng(i + 40); for (let k = 0; k < 5; k++) { const bw = (w - 12) / 5, bh = h * (0.12 + Rr() * 0.22); ctx.fillRect(x - w / 2 + 6 + k * bw, y + h / 2 - 10 - bh, bw - 2, bh); } ctx.restore(); } };
 const fmtMil = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
 // ---- mapas reales (Natural Earth, dominio público) ----
 const MERC = (lat) => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
 const proyM = (cx, cy, esc, lonC, latC) => (lon, lat) => [cx + (lon - lonC) * Math.PI / 180 * esc, cy - (MERC(lat) - MERC(latC)) * esc];
 const PF = proyM(470, 1040, 5600, -83.6, 27.7);   // Florida (Mercator)
 const florida = (ctx, t, a, o = {}) => { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#1d1240'; ctx.strokeStyle = PINK; ctx.lineWidth = 4; ctx.shadowColor = PINK; ctx.shadowBlur = 18 * (o.glow ?? 1); ctx.lineJoin = 'round';
  for (const r of window.MAPA_FL || []) { ctx.beginPath(); r.forEach(([lo, la], k) => { const q = PF(lo, la); k ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.closePath(); ctx.fill(); ctx.stroke(); } ctx.restore(); };
 const PW = (lon, lat) => [540 + (lon - 8) * 3.4, 1080 - lat * 3.4];   // mundo (equirrectangular, centrado en 8° E)
 const mundo = (ctx, a) => { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#1d1a3c'; ctx.strokeStyle = 'rgba(54,230,255,0.55)'; ctx.lineWidth = 2;
  for (const r of window.MAPA_MUNDO || []) { if (r.every(([, la]) => la < -58)) continue; ctx.beginPath(); r.forEach(([lo, la], k) => { const q = PW(lo, Math.max(-58, la)); k ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.closePath(); ctx.fill(); ctx.stroke(); } ctx.restore(); };
 // estudios de Rockstar (Reino Unido, EE. UU., Canadá, India, Australia); India: punto aproximado del país (ciudad no confirmada)
 const ESTUDIOS = [[-3.19, 55.95], [-2.97, 56.46], [-1.55, 53.8], [-0.54, 53.23], [-0.13, 51.5], [-74.0, 40.71], [-117.35, 33.16], [-71.14, 42.66], [-79.69, 43.45], [78.5, 20.0], [151.21, -33.87]];

 // =====================================================================================================
 // ESCENAS
 // =====================================================================================================
 const B = [];
 // ---------- 1 · GANCHO ----------
 B.push({ t0: 0, t1: B0.b1, in: { type: 'cut' }, draw(ctx, t) {
  if (GANCHO === 'A') {
   // el calendario arranca hojas 2013 → 2026 y amanece una ciudad de neón
   const u = E.inOut(win(t, 0, Math.max(0.8, Tk.g0e - 0.2))), y = Math.round(lerp(2013, 2026, u));
   cielo(ctx, t, { hz: 1240 }); ciudad(ctx, t, 1240, { b: 0.2 + 0.8 * u, luz: u }); palmera(ctx, 120, 1300, 420, t); palmera(ctx, 980, 1320, 380, t);
   for (let k = 0; k < 3; k++) { const q = (t * 3.2 + k / 3) % 1; if (u < 0.98) { ctx.save(); ctx.globalAlpha *= 1 - q; ctx.translate(540 + q * 260, 860 + q * 380); ctx.rotate(q * 1.6); ctx.fillStyle = '#f4f2fb'; ctx.fillRect(-180, -150, 360, 300); ctx.restore(); } }
   hojaCal(ctx, 540, 860, 420, 380, u >= 0.98 ? '19 NOV' : 'AÑO', String(y), { bigPx: 0.36 });
  } else if (GANCHO === 'B') {
   // contador 0 → 90.000.000 y una cuadrícula de pantallas que se encienden en rosa
   fondo(ctx, t); const u = E.out(win(t, 0, Math.max(0.8, Tk.g0e - 0.1))), n = 90000000 * u, cols = 6, rows = 4;
   for (let i = 0; i < cols * rows; i++) { const c = i % cols, r = Math.floor(i / cols), x = 120 + c * 168, y = 920 + r * 150, th = H.rng(i + 3)(); movil(ctx, x, y, 92, 136, cl((u * 1.05 - th) * 8), t, i); }
   P.statBig(ctx, fmtMil(n), 540, 700, t, 0, null, { px: 130, sub: 'VISITAS EN 1 DÍA', col: GOLD });
  } else {
   // tres consolas genéricas caen y se apilan; el mando en la mano cambia con cada una
   fondo(ctx, t); const g = Math.min(3, 1 + Math.floor(win(t, 0.15, Math.max(0.9, Tk.g0e - 0.3)) * 3));
   ctx.fillStyle = '#1d1636'; ctx.fillRect(40, 1400, 1000, 26);
   [[1, 210, 0.15], [2, 540, 0.15 + (Tk.g0e - 0.45) / 3], [3, 880, 0.15 + 2 * (Tk.g0e - 0.45) / 3]].forEach(([gen, x, t0]) => { const q = E.out(win(t, t0, t0 + 0.35)); if (q <= 0) return; consola(ctx, x, 1400 - (1 - q) * 500, gen === 3 ? 1.3 : 1.1, gen); });
   mando(ctx, 540, 790, 2.3, g, { rot: Math.sin(t * 2) * 0.05 }); P.glow(ctx, 540, 790, 300, '54,230,255', 0.15);
  }
 }, sfx(k) {
  if (GANCHO === 'A') { for (let i = 0; i < 12; i++) FX.pasarPagina(k, 0.05 + i * Math.max(0.06, (Tk.g0e - 0.3) / 12)); FX.revelar(k, Tk.g0e - 0.2); }
  else if (GANCHO === 'B') { FX.contador(k, 0, Math.max(0.8, Tk.g0e - 0.1), 0, 90); for (let i = 0; i < 6; i++) k.play('blip', 0.1 + i * 0.3, { gain: 0.2, f: 600 + i * 50 }); }
  else { for (let i = 0; i < 3; i++) k.play('thud', 0.15 + i * (Tk.g0e - 0.45) / 3 + 0.3, { f: 120, gain: 0.45 }); FX.toque(k, 0.05); }
 } });

 // ---------- 2 · GTA V salió en 2013 · si tenías 10, hoy tienes 23 ----------
 B.push({ t0: B0.b1, t1: B0.b3, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t); const g = sm(Tk.veinti - 0.4, Tk.veinti, t), age = Math.round(lerp(10, 23, E.inOut(win(t, Tk.diez + 0.2, Tk.veinti + 0.1))));
  hojaCal(ctx, 200, 760, 280, 260, 'GTA V', '2013', { bigPx: 0.34, col: CYAN });
  ctx.fillStyle = '#1d1636'; ctx.fillRect(0, 1440, W, 20);
  ctx.save(); ctx.globalAlpha *= 1 - g; persona(ctx, 600, 1440, 680, t, { kid: true, gen: 1, shirt: '#ff7a3d' }); ctx.restore();
  ctx.save(); ctx.globalAlpha *= g; persona(ctx, 600, 1440, 880, t, { gen: 3, shirt: '#2a9df4', barba: true }); ctx.restore();
  P.statBig(ctx, String(age), 820, 760, t, Tk.diez - 0.1, B0.b3, { px: 150, sub: 'AÑOS', col: GOLD });
 }, sfx(k) { FX.aparece(k, B0.b1 + 0.1, 600); FX.contador(k, Tk.diez + 0.2, Tk.veinti + 0.1, 10, 23); FX.revelar(k, Tk.veinti - 0.4); } });

 // ---------- 3 · tres generaciones de consolas ----------
 B.push({ t0: B0.b3, t1: B0.b4, in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  fondo(ctx, t); ctx.fillStyle = '#1d1636'; ctx.fillRect(20, 1300, 1040, 26); const t0 = Tk.tres - 0.4;
  [[1, 190, '2013'], [2, 540, '2014'], [3, 900, '2022']].forEach(([gen, x, y], i) => { const q = E.out(win(t, t0 + i * 0.35, t0 + i * 0.35 + 0.35)); if (q <= 0) return; ctx.save(); ctx.globalAlpha *= q; consola(ctx, x, 1300 + (1 - q) * 60, gen === 3 ? 1.5 : 1.08, gen); txt(ctx, y, x, 1380, 52, i === 2 ? GOLD : '#c9c1ff', { w: 900, f: 'Fredoka' }); ctx.restore(); });
  P.statBig(ctx, '×3', 540, 760, t, Tk.consolas - 0.1, B0.b4, { px: 150, sub: 'GENERACIONES', col: GOLD });
 }, sfx(k) { for (let i = 0; i < 3; i++) k.play('thud', Tk.tres - 0.4 + i * 0.35, { f: 110 + i * 20, gain: 0.4 }); FX.aparece(k, Tk.consolas - 0.1, 700); } });

 // ---------- 4 · Y GTA VI… no llegaba (letrero que no termina de encenderse; cargando) ----------
 B.push({ t0: B0.b4, t1: B0.b6, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  fondo(ctx, t, '#07040f', '#120826'); const on = sm(Tk.vi - 0.2, Tk.vi + 0.1, t), parp = t > Tk.llegaba - 0.1 ? (Math.sin(t * 23) > 0.2 ? 0.25 : 0.05) : 1;
  ctx.fillStyle = '#1b1530'; ctx.beginPath(); ctx.roundRect(170, 720, 740, 330, 30); ctx.fill(); ctx.strokeStyle = '#2e2650'; ctx.lineWidth = 8; ctx.stroke();
  neon(ctx, 'GTA VI', 540, 885, 190, PINK, t, on * parp);
  const sp = t * 6; ctx.save(); ctx.translate(540, 1240); for (let k = 0; k < 10; k++) { const a = sp + k * TAU / 10; ctx.fillStyle = `rgba(54,230,255,${0.15 + 0.85 * ((k / 10 + (sp / TAU) % 1) % 1)})`; ctx.beginPath(); ctx.arc(Math.cos(a) * 70, Math.sin(a) * 70, 14, 0, TAU); ctx.fill(); } ctx.restore();
  P.tag(ctx, 'CARGANDO…', 540, 1380, t, Tk.llegaba - 0.2, B0.b6, { mono: true, col: CYAN });
 }, sfx(k) { FX.encender ? FX.encender(k, Tk.vi - 0.2) : FX.aparece(k, Tk.vi - 0.2); k.play('error', Tk.llegaba, { f: 'C3', gain: 0.2, minor: true }); FX.etiqueta(k, Tk.llegaba - 0.2); } });

 // ---------- 5 · no se programa un juego: se construye un país (código tachado → maqueta que se levanta) ----------
 B.push({ t0: B0.b6, t1: B0.b9, in: { type: 'zoom', d: 0.4, x: 540, y: 1000 }, draw(ctx, t) {
  const bu = sm(Tk.construye - 0.3, Tk.construye, t);
  if (bu < 1) { ctx.save(); ctx.globalAlpha *= 1 - bu; fondo(ctx, t, '#07040f', '#120826'); ctx.fillStyle = '#0f0c1e'; ctx.beginPath(); ctx.roundRect(120, 660, 840, 640, 24); ctx.fill(); const Rr = H.rng(14); ctx.font = '600 34px "IBM Plex Mono"'; for (let l = 0; l < 13; l++) { const ind = Math.floor(Rr() * 4), w2 = 160 + Rr() * 420, show = win(t, B0.b6 + l * 0.12, B0.b6 + l * 0.12 + 0.3); ctx.fillStyle = [CYAN, PINK, '#c9c1ff', GOLD][l % 4]; ctx.globalAlpha = (1 - bu) * show; ctx.fillRect(170 + ind * 40, 700 + l * 44, w2 * show, 18); } ctx.globalAlpha = 1 - bu; tacha(ctx, 160, 690, 920, 1270, win(t, Tk.programa - 0.1, Tk.programa + 0.35)); ctx.restore(); }
  if (bu > 0) { ctx.save(); ctx.globalAlpha *= bu; cielo(ctx, t, { hz: 1300, sol: false }); const b = E.inOut(win(t, Tk.construye - 0.2, B0.b9 + 0.3)); ctiudadBloques(ctx, t, b); ctx.restore(); }
 }, sfx(k) { FX.tecleo(k, B0.b6 + 0.1, 6, 0.18); FX.tachado(k, Tk.programa - 0.1); for (let i = 0; i < 6; i++) k.play('thud', Tk.construye + i * 0.22, { f: 140 + i * 15, gain: 0.3 }); } });
 // maqueta: la ciudad crece bloque a bloque sobre una base de mesa (nada flota)
 function ctiudadBloques(ctx, t, b) { ctx.fillStyle = '#2a1d4a'; ctx.beginPath(); ctx.moveTo(60, 1300); ctx.lineTo(1020, 1300); ctx.lineTo(980, 1360); ctx.lineTo(100, 1360); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#1a1230'; ctx.fillRect(100, 1360, 880, 40); ciudad(ctx, t, 1300, { b, luz: b * 0.8, sc: 0.9 }); }

 // ---------- 6 · Leonida (silueta real de Florida) y Vice City ----------
 B.push({ t0: B0.b9, t1: B0.b11, in: { type: 'iris', d: 0.4, x: 540, y: 1000 }, draw(ctx, t) {
  fondo(ctx, t, '#06051a', '#0c1030'); const a = R(S(9) - 0.1, S(9) + 0.6, t), mi = PF(-80.19, 25.76);
  const g = ctx.createLinearGradient(0, 600, 0, 1460); g.addColorStop(0, 'rgba(20,40,90,0.0)'); g.addColorStop(1, 'rgba(20,40,90,0.35)'); ctx.fillStyle = g; ctx.fillRect(0, 600, W, 860);
  florida(ctx, t, a, { glow: 1 });
  const vc = sm(Tk.vice - 0.2, Tk.vice + 0.2, t); if (vc > 0) { P.glow(ctx, mi[0], mi[1], 120, '54,230,255', 0.7 * vc); ctx.fillStyle = CYAN; ctx.beginPath(); ctx.arc(mi[0], mi[1], 14 * vc, 0, TAU); ctx.fill(); const pr = (t * 1.2) % 1; ctx.strokeStyle = `rgba(54,230,255,${(1 - pr) * vc})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(mi[0], mi[1], 20 + pr * 70, 0, TAU); ctx.stroke(); }
  P.tag(ctx, 'LEONIDA', 420, 760, t, Tk.leonida, B0.b11, { mono: true, col: PINK }); P.tag(ctx, 'VICE CITY', mi[0] - 60, mi[1] + 90, t, Tk.vice, B0.b11, { mono: true, col: CYAN });
 }, sfx(k) { FX.revelar(k, S(9) - 0.1); FX.etiqueta(k, Tk.leonida); FX.etiqueta(k, Tk.vice); } });

 // ---------- 7 · Cada calle, cada tienda, cada palmera… miles de personas en varios países ----------
 B.push({ t0: B0.b11, t1: B0.b12, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const wm = sm(Tk.miles - 0.3, Tk.miles, t);
  if (wm < 1) { ctx.save(); ctx.globalAlpha *= 1 - wm; fondo(ctx, t); ctx.fillStyle = '#2a1d4a'; ctx.beginPath(); ctx.moveTo(60, 1300); ctx.lineTo(1020, 1300); ctx.lineTo(980, 1360); ctx.lineTo(100, 1360); ctx.closePath(); ctx.fill();
   const c1 = R(Tk.calle - 0.1, Tk.calle + 0.3, t), c2 = R(Tk.tienda - 0.1, Tk.tienda + 0.3, t), c3 = R(Tk.palmera - 0.1, Tk.palmera + 0.3, t);
   if (c1 > 0) { ctx.fillStyle = '#3a3150'; ctx.fillRect(100, 1240, 880 * c1, 60); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.setLineDash([40, 30]); ctx.beginPath(); ctx.moveTo(110, 1270); ctx.lineTo(110 + 860 * c1, 1270); ctx.stroke(); ctx.setLineDash([]); auto(ctx, lerp(150, 760, c1), 1262, 0.9, t, CYAN); }
   if (c2 > 0) { ctx.save(); ctx.translate(320, 1240); ctx.scale(1, c2); ctx.fillStyle = '#1b1032'; ctx.fillRect(-220, -460, 440, 460); ctx.strokeStyle = PINK; ctx.lineWidth = 8; ctx.shadowColor = PINK; ctx.shadowBlur = 20; ctx.strokeRect(-220, -460, 440, 460); ctx.fillStyle = 'rgba(255,200,120,0.7)'; ctx.fillRect(-180, -220, 360, 180); ctx.fillStyle = '#3a2a5a'; ctx.fillRect(-40, -170, 80, 170); ctx.restore(); if (c2 > 0.9) neon(ctx, 'TIENDA', 320, 860, 70, CYAN, t); }
   if (c3 > 0) palmera(ctx, 760, 1240, 440 * c3, t, { col: '#2b1450', neon: '#5fd38d' });
   // cursores/manos que colocan las piezas
   for (const [tt, x, y] of [[Tk.calle, 540, 1220], [Tk.tienda, 320, 760], [Tk.palmera, 820, 820]]) { const q = win(t, tt - 0.2, tt + 0.4); if (q > 0 && q < 1) { ctx.save(); ctx.globalAlpha *= Math.sin(Math.PI * q); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 36, y + 90); ctx.lineTo(x + 14, y + 80); ctx.lineTo(x + 30, y + 116); ctx.lineTo(x + 18, y + 120); ctx.lineTo(x + 4, y + 86); ctx.lineTo(x - 12, y + 100); ctx.closePath(); ctx.fill(); ctx.restore(); } }
   ctx.restore(); }
  if (wm > 0) { ctx.save(); ctx.globalAlpha *= wm; fondo(ctx, t, '#06051a', '#0c1030'); mundo(ctx, 1);
   ESTUDIOS.forEach(([lo, la], i) => { const q = R(Tk.miles + i * 0.09, Tk.miles + 0.3 + i * 0.09, t); if (q <= 0) return; const [x, y] = PW(lo, la), pr = (t * 1.1 + i * 0.13) % 1; P.glow(ctx, x, y, 50, '255,63,164', 0.6 * q); ctx.fillStyle = PINK; ctx.beginPath(); ctx.arc(x, y, 9 * q, 0, TAU); ctx.fill(); ctx.strokeStyle = `rgba(255,63,164,${(1 - pr) * q})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 12 + pr * 40, 0, TAU); ctx.stroke(); });
   const Rr = H.rng(8), n = Math.floor(lerp(0, 220, win(t, Tk.miles, Tk.paises + 0.3))); for (let i = 0; i < n; i++) { const [lo, la] = ESTUDIOS[Math.floor(Rr() * ESTUDIOS.length)], [x, y] = PW(lo, la); ctx.fillStyle = 'rgba(255,200,230,0.8)'; ctx.beginPath(); ctx.arc(x + (Rr() - 0.5) * 70, y + 30 + Rr() * 60, 3.5, 0, TAU); ctx.fill(); }
   P.tag(ctx, 'VARIOS PAÍSES', 540, 1290, t, Tk.paises - 0.3, B0.b12, { mono: true, col: PINK }); ctx.restore(); }
 }, sfx(k) { FX.toque(k, Tk.calle); FX.toque(k, Tk.tienda); FX.toque(k, Tk.palmera); for (let i = 0; i < ESTUDIOS.length; i++) k.play('blip', Tk.miles + i * 0.09, { gain: 0.15, f: 500 + i * 40 }); FX.etiqueta(k, Tk.paises - 0.3); } });

 // ---------- 8 · el primer tráiler (diciembre de 2023): 90 millones en 24 horas · récord en YouTube ----------
 B.push({ t0: B0.b12, t1: B0.b16, in: { type: 'zoom', d: 0.4, x: 540, y: 1000 }, draw(ctx, t) {
  fondo(ctx, t); const u = E.out(win(t, Tk.n90 - 0.3, Tk.h24 + 0.4)), cols = 6, rows = 4, rec = sm(Tk.ningun - 0.1, Tk.ningun + 0.3, t);
  hojaCal(ctx, 250, 760, 260, 240, 'DIC', '2023', { bigPx: 0.32, col: PINK }); P.glow(ctx, 760, 760, 200, '255,63,164', 0.3 * R(Tk.trailer - 0.2, Tk.trailer + 0.3, t));
  if (t > Tk.trailer - 0.2) { ctx.save(); ctx.globalAlpha *= R(Tk.trailer - 0.2, Tk.trailer + 0.3, t); ctx.fillStyle = '#121026'; ctx.beginPath(); ctx.roundRect(600, 660, 320, 200, 18); ctx.fill(); ctx.fillStyle = PINK; ctx.beginPath(); ctx.moveTo(735, 715); ctx.lineTo(805, 760); ctx.lineTo(735, 805); ctx.closePath(); ctx.fill(); ctx.restore(); }
  for (let i = 0; i < cols * rows; i++) { const c = i % cols, r = Math.floor(i / cols), x = 120 + c * 168, y = 1110 + r * 100, th = H.rng(i + 3)(); movil(ctx, x, y, 80, 88, cl((u * 1.05 - th) * 8), t, i); }
  if (rec > 0) { ctx.save(); ctx.globalAlpha *= rec; ctx.fillStyle = 'rgba(8,4,20,0.7)'; ctx.fillRect(0, 940, W, 520); ctx.restore(); P.icon(ctx, 'trofeo', 540, 1160, 300 * E.out(rec), { mode: 'flat', col: GOLD }); }
  P.statBig(ctx, fmtMil(90000000 * u), 540, 940 - 0, t, Tk.n90 - 0.3, Tk.ningun - 0.15, { px: 120, sub: 'VISITAS · 24 H', col: GOLD });
  P.tag(ctx, 'RÉCORD EN YOUTUBE', 540, 1400, t, Tk.ningun + 0.1, B0.b16, { mono: true, col: GOLD });
 }, sfx(k) { FX.aparece(k, B0.b12 + 0.1, 600); FX.toque(k, Tk.trailer - 0.2); FX.contador(k, Tk.n90 - 0.3, Tk.h24 + 0.4, 0, 90); FX.descubrir(k, Tk.ningun); FX.etiqueta(k, Tk.ningun + 0.1); } });

 // ---------- 9 · lo retrasaron dos veces… para pulirlo ----------
 B.push({ t0: B0.b16, t1: B0.b18, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const pu = sm(Tk.pulirlo - 0.35, Tk.pulirlo - 0.05, t);
  if (pu < 1) { ctx.save(); ctx.globalAlpha *= 1 - pu; fondo(ctx, t); const c1 = R(B0.b16 + 0.1, B0.b16 + 0.4, t), c2 = R(Tk.retrasaron, Tk.retrasaron + 0.3, t);
   if (c1 > 0) { hojaCal(ctx, 290, 1000, 360, 330, 'OTOÑO', '2025', { bigPx: 0.32, rot: -0.06 }); tacha(ctx, 130, 860, 450, 1150, win(t, Tk.retrasaron - 0.1, Tk.retrasaron + 0.25)); }
   if (c2 > 0) { hojaCal(ctx, 780, 1060, 360, 330, '26 MAYO', '2026', { bigPx: 0.32, rot: 0.05 }); tacha(ctx, 620, 920, 940, 1210, win(t, Tk.veces - 0.1, Tk.veces + 0.25)); }
   ctx.restore(); }
  if (pu > 0) { ctx.save(); ctx.globalAlpha *= pu; cielo(ctx, t, { hz: 1300, sol: false }); ctiudadBloques(ctx, t, 1);
   const pq = win(t, Tk.pulirlo - 0.1, B0.b18 + 0.2), px = lerp(160, 920, pq), py = 900 + Math.sin(pq * 18) * 60; ctx.fillStyle = '#f4f2fb'; ctx.beginPath(); ctx.roundRect(px - 60, py - 40, 120, 80, 14); ctx.fill(); ctx.fillStyle = 'rgba(54,230,255,0.4)'; ctx.fillRect(px - 60, py - 10, 120, 12);
   const Rr = H.rng(5); for (let k = 0; k < 24; k++) { const sx = 120 + Rr() * 840, sy = 760 + Rr() * 520; if (sx > px) continue; const tw = Math.max(0, Math.sin(t * 6 + k)); ctx.fillStyle = `rgba(255,255,255,${tw})`; ctx.beginPath(); ctx.moveTo(sx, sy - 14 * tw); ctx.lineTo(sx + 4, sy); ctx.lineTo(sx, sy + 14 * tw); ctx.lineTo(sx - 4, sy); ctx.closePath(); ctx.fill(); }
   ctx.restore(); }
 }, sfx(k) { FX.aparece(k, B0.b16 + 0.1, 520); FX.tachado(k, Tk.retrasaron - 0.1); FX.aparece(k, Tk.retrasaron, 560); FX.tachado(k, Tk.veces - 0.1); k.play('sparkle', Tk.pulirlo - 0.1, { gain: 0.3 }); } });

 // ---------- 10 · Ahora sí tiene fecha: 19 de noviembre de 2026 ----------
 B.push({ t0: B0.b18, t1: B0.b20, in: { type: 'zoom', d: 0.4, x: 540, y: 1000 }, draw(ctx, t) {
  fondo(ctx, t); const a = R(Tk.d19 - 0.3, Tk.d19 + 0.2, t); P.glow(ctx, 540, 1000, 520, '255,63,164', 0.3 * a);
  hojaCal(ctx, 540, 1120, 680 * (0.75 + 0.25 * a), 500 * (0.75 + 0.25 * a), t > Tk.noviembre - 0.1 ? 'NOVIEMBRE' : '…', t > Tk.d19 - 0.1 ? '19' : '?', { bigPx: 0.46 });
  P.statBig(ctx, '2026', 540, 680, t, Tk.y2026 - 0.15, B0.b20, { px: 120, col: GOLD });
  P.stamp(ctx, 'CONFIRMADO', 760, 1330, 340, t, Tk.y2026 + 0.3, { col: '#36e6ff', rot: -0.15 });
 }, sfx(k) { FX.aparece(k, Tk.d19 - 0.3, 640); FX.pasarPagina(k, Tk.noviembre - 0.1); FX.aparece(k, Tk.y2026 - 0.15, 720); FX.sello(k, Tk.y2026 + 0.3); } });

 // ---------- 11 · Trece años después… vuelves a Vice City ----------
 B.push({ t0: B0.b20, t1: B0.b22, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  cielo(ctx, t, { hz: 1180 }); const lit = sm(Tk.vuelves - 0.2, Tk.city, t); ciudad(ctx, t, 1180, { b: 1, luz: 0.25 + 0.75 * lit, sc: 0.9 + 0.08 * lit });
  ctx.fillStyle = '#1a0f2e'; ctx.fillRect(0, 1300, W, 120); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.setLineDash([50, 40]); ctx.lineDashOffset = -t * 300; ctx.beginPath(); ctx.moveTo(0, 1360); ctx.lineTo(W, 1360); ctx.stroke(); ctx.setLineDash([]);
  for (let k = 0; k < 5; k++) palmera(ctx, ((k * 260 - t * 220) % 1300 + 1300) % 1300 - 110, 1300, 420, t);
  auto(ctx, 420 + Math.sin(t * 2) * 10, 1388, 1.6, t, PINK);
  neon(ctx, 'VICE CITY', 540, 760, 120, CYAN, t, sm(Tk.vuelves, Tk.city, t));
 }, sfx(k) { k.noise(B0.b20, { dur: B0.b22 - B0.b20, color: 'brown', filter: 'lowpass', f: 300, gain: 0.05, a: 0.4 }); FX.revelar(k, Tk.vuelves - 0.2); } });

 // ---------- 12 · CIERRE: «Envíaselo a ese amigo…» ----------
 B.push({ t0: B0.b22, t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  fondo(ctx, t); P.ctaShare(ctx, t, B0.b22 + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { cielo(cc, t, { hz: 1180 }); ciudad(cc, t, 1180, { b: 1, luz: 1, sc: 0.95 }); for (let k = 0; k < 3; k++) palmera(cc, 120 + k * 420, 1300, 420, t); auto(cc, 420, 1388, 1.6, t, PINK); }), names: ['Mateo', 'Valentina', 'Santiago', 'Camila'] });
  P.marca(ctx, t, T.end + 0.95);
 }, sfx(k) { FX.compartir(k, B0.b22 + 0.1); FX.fin(k, T.end + 0.3); } });

 // ---------- MONTAJE ----------
 const EP = PL.make({
  estilo: 'noche', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['13', '90', 'consola', '2013.', '23.', 'tres', 'VI…', 'programa', 'país.', 'Leonida,', 'Vice', 'palmera', 'países.', 'tráiler,', 'historia:', '24', 'YouTube.', 'veces…', 'pulirlo.', 'fecha:', 'noviembre', 'después…', 'City.', 'amigo'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 600, gain: 0.006, a: 0.05, hold: DURATION - 2.2 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 100, gain: 0.6, chords: [['A2', 'C3', 'E3', 'A3'], ['F2', 'A2', 'C3', 'F3'], ['D2', 'F2', 'A2', 'D3'], ['E2', 'G#2', 'B2', 'E3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
