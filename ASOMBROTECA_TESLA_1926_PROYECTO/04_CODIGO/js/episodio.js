// =====================================================================================================
// episodio.js — «Nikola Tesla imaginó el celular en 1926» · Serie «Predicciones del pasado que se hicieron realidad» · Ep. 01
// Asombroteca · PLANTILLA v1.18 (módulo comunicaciones y épocas).
// Dos mundos y UNA transformación progresiva: 1926 (sepia: calle con cables, teléfono de candelero, centralita con operadoras,
// torre de radio, revista Collier's reconstruida, Tesla anciano estilizado) → idea → inalámbrico → bolsillo → smartphone →
// videollamada (hoy: azul tecnológico, estación base, fibra, datos, Tierra nocturna). La gradación sepia se retira poco a poco.
// Rigor: Tesla NO inventó el teléfono, ni internet, ni el celular; la señal no cruza el planeta en una sola onda; el teléfono habla
// con una estación base y los datos viajan por fibra y otras partes de la red. Sin fotos falsas, sin citas inventadas, sin labios
// animados. Reloj = voz original. Determinista (H.rng). Datos y decisiones en FUENTES_Y_DECISIONES.md.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS, O = P.ERA.old, N = P.ERA.now;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  y1926: wt(0, '1926'), cables0: wt(0, 'cables'), tesla1: wt(1, 'tesla'), hoy1: wt(1, 'hoy'), bolsillo1: wt(1, 'bolsillo'),
  hablar: wt(2, 'hablar'), ver2: wt(2, 'ver'), persona: wt(2, 'persona'), miles: wt(2, 'miles'), km: wt(2, 'kilómetros'),
  pero3: SG(3).s, como4: SG(4).s, cien: wt(4, 'cien'), resp: SG(5).s, inalam5: wt(5, 'inalámbricas'),
  en6: SG(6).s, telefono6: wt(6, 'teléfono'), pero7: SG(7).s, llamadas: wt(7, 'llamadas'), redes7: wt(7, 'redes'), cables7: wt(7, 'cables'),
  tesla8: SG(8).s, senales8: wt(8, 'señales'), conectar: wt(8, 'conectar'), distancias: wt(8, 'distancias'),
  y9: SG(9).s, lejos: wt(9, 'lejos'), imagino10: SG(10).s, ver10: wt(10, 'ver'), escuchar: wt(10, 'escuchar'), acontec: wt(10, 'acontecimientos'), presentes: wt(10, 'presentes'),
  incluso: SG(11).s, describio: wt(11, 'describió'), pequeno: wt(11, 'pequeño'), bolsillo11: wt(11, 'bolsillo'), chaleco: wt(11, 'chaleco'),
  te12: SG(12).s, familiar: wt(12, 'familiar'), es13: SG(13).s, parecido: wt(13, 'parecido'), celulares: wt(13, 'celulares'),
  act14: SG(14).s, convierten: wt(14, 'convierten'), imagenes14: wt(14, 'imágenes'), sonidos14: wt(14, 'sonidos'), info14: wt(14, 'información'), digital: wt(14, 'digital'),
  esa15: SG(15).s, viaja: wt(15, 'viaja'), radio15: wt(15, 'radio'), redes15: wt(15, 'redes'), llegar: wt(15, 'llegar'), dispositivo15: wt(15, 'dispositivo'),
  y16: SG(16).s, vuelve: wt(16, 'vuelve'), imagenes16: wt(16, 'imágenes'), sonidos16: wt(16, 'sonidos'),
  tesla17: SG(17).s, smartphone: wt(17, 'smartphone'), predijo: wt(17, 'predijo'), detalles: wt(17, 'detalles'),
  pero18: SG(18).s, algunas: wt(18, 'algunas'), funciones: wt(18, 'funciones'), decadas: wt(18, 'décadas'), realidad18: wt(18, 'realidad'),
  y19: SG(19).s, utilizamos: wt(19, 'utilizamos'), tecnologia: wt(19, 'tecnología'), sorprender: wt(19, 'sorprendernos'),
  sigue: SG(20).s, asombroteca: wt(20, 'asombroteca'), ideas: wt(20, 'ideas'), end: A.speech_end,
 };
 const TB = { b2: T.tesla1 - 0.2, b3: SG(2).s - 0.2, b4: T.pero3 - 0.2, b5: T.resp - 0.2, b6: T.en6 - 0.2, b6b: T.pero7 - 0.18, b7: T.tesla8 - 0.2, b8: T.y9 - 0.2, b8b: T.imagino10 - 0.2, b9: T.incluso - 0.2, b10: T.te12 - 0.2, b11: T.es13 - 0.2, b12: T.act14 - 0.2, b13: T.esa15 - 0.2, b14: T.y16 - 0.2, b15: T.tesla17 - 0.2, b16: T.pero18 - 0.2, b17: T.y19 - 0.2, b18: T.sigue - 0.2 };
 // gradación de época: 1926 (sepia) hasta «¿Te suena familiar?»; luego se retira progresivamente durante el paso al smartphone
 const ERA = (t) => 1 - E.inOut(win(t, TB.b10 + 0.1, TB.b11 + 0.5));

 // ---------------- utilidades ----------------
 const title = (ctx, s, t, t0, era, o = {}) => P.eraLabel(ctx, s, 540, o.y || 200, o.px || 54, t, t0, era, o);
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.fillStyle = c; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
 const tag = (ctx, s, x, y, t, t0, era = 0) => { const a = sm(t0, t0 + 0.3, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = '700 32px "IBM Plex Mono"'; const tw = ctx.measureText(s).width; ctx.fillStyle = era < 0.5 ? 'rgba(32,32,33,0.85)' : 'rgba(12,20,33,0.85)'; ctx.fillRect(x - tw / 2 - 16, y - 25, tw + 32, 50); ctx.fillStyle = era < 0.5 ? O.papel : N.oro; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + 1); ctx.restore(); };
 const pill = (ctx, s, x, y, t, t0, era, o = {}) => P.eraLabel(ctx, s, x, y, o.px || 36, t, t0, era, o);
 const lead = (ctx, x0, y0, x1, y1, a, c) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, E.out(a)), lerp(y0, y1, E.out(a))); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 6, 0, TAU); ctx.fill(); ctx.restore(); };
 const zoomS = (ctx, t, t0, t1, z0, z1, cx = 540, cy = 960) => { const z = lerp(z0, z1, E.inOut(win(t, t0, t1))); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); };
 const scrimTop = (ctx, a = 0.45) => { const g = ctx.createLinearGradient(0, 0, 0, 420); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 420); };
 const scrimBot = (ctx, a = 0.55) => { const g = ctx.createLinearGradient(0, 1380, 0, HH); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 1380, W, HH - 1380); };
 // iconos ojo / oído / altavoz
 const eye = (ctx, x, y, s, c) => { ctx.save(); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 40 * s, y); ctx.quadraticCurveTo(x, y - 34 * s, x + 40 * s, y); ctx.quadraticCurveTo(x, y + 34 * s, x - 40 * s, y); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 12 * s, 0, TAU); ctx.fill(); ctx.restore(); };
 const ear = (ctx, x, y, s, c) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y - 6 * s, 22 * s, Math.PI * 1.0, Math.PI * 2.25); ctx.quadraticCurveTo(x + 4 * s, y + 24 * s, x - 6 * s, y + 34 * s); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y - 4 * s, 9 * s, Math.PI, Math.PI * 2); ctx.stroke(); ctx.restore(); };
 const speaker = (ctx, x, y, s, c, t) => { ctx.save(); ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 30 * s, y - 12 * s); ctx.lineTo(x - 14 * s, y - 12 * s); ctx.lineTo(x + 4 * s, y - 28 * s); ctx.lineTo(x + 4 * s, y + 28 * s); ctx.lineTo(x - 14 * s, y + 12 * s); ctx.lineTo(x - 30 * s, y + 12 * s); ctx.closePath(); ctx.fill(); for (let k = 1; k <= 3; k++) { ctx.globalAlpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 6 - k)); ctx.beginPath(); ctx.arc(x + 4 * s, y, k * 16 * s, -0.7, 0.7); ctx.stroke(); } ctx.restore(); };

 // ---------------- escenarios ----------------
 // habitación de 1926 (hotel de Nueva York, recreación): pared, zócalo, ventana con la ciudad, suelo de madera; mesa apoyada en el suelo
 function room1926(ctx, t, o = {}) { const fy = o.floor ?? 1400; const g = ctx.createLinearGradient(0, 0, 0, fy); g.addColorStop(0, '#b89a74'); g.addColorStop(1, '#d6bd95'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, fy);
  ctx.strokeStyle = 'rgba(73,54,39,0.12)'; ctx.lineWidth = 2; for (let x = 30; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, fy - 240); ctx.stroke(); }
  const wx = o.winX ?? 600, wy = 330, ww = 380, wh = 560; ctx.fillStyle = '#e9d8b8'; ctx.fillRect(wx, wy, ww, wh); ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip(); const R = H.rng(5); let x = wx - 20; while (x < wx + ww) { const bw = 40 + R() * 60, bh = 160 + R() * 360; ctx.fillStyle = '#a88a66'; ctx.fillRect(x, wy + wh - bh, bw, bh); ctx.fillStyle = 'rgba(255,240,205,0.35)'; for (let yy = wy + wh - bh + 12; yy < wy + wh - 10; yy += 20) for (let xx = x + 6; xx < x + bw - 8; xx += 14) if (R() < 0.5) ctx.fillRect(xx, yy, 6, 9); x += bw + 4; } ctx.restore();
  ctx.fillStyle = '#5a4130'; ctx.fillRect(wx - 16, wy - 16, ww + 32, 16); ctx.fillRect(wx - 16, wy + wh, ww + 32, 22); ctx.fillRect(wx - 16, wy, 16, wh); ctx.fillRect(wx + ww, wy, 16, wh); ctx.fillRect(wx + ww / 2 - 6, wy, 12, wh); ctx.fillRect(wx, wy + wh * 0.45, ww, 10);
  ctx.fillStyle = '#7a5c42'; ctx.fillRect(0, fy - 240, W, 240); ctx.fillStyle = '#5a4130'; ctx.fillRect(0, fy - 244, W, 12); ctx.fillStyle = '#4a3627'; ctx.fillRect(0, fy, W, HH - fy); ctx.strokeStyle = 'rgba(0,0,0,0.18)'; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.moveTo(0, fy + 20 + k * 70); ctx.lineTo(W, fy + 20 + k * 70); ctx.stroke(); } }
 function desk(ctx, x, w, topY, fy) { ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x - 10, fy - 6, w + 20, 12); ctx.fillStyle = '#4b3424'; ctx.fillRect(x + 20, topY + 24, 24, fy - topY - 24); ctx.fillRect(x + w - 44, topY + 24, 24, fy - topY - 24); ctx.fillStyle = '#5a3e2b'; ctx.fillRect(x + 40, topY + 24, w - 80, 120); ctx.fillStyle = '#6b4a33'; ctx.fillRect(x, topY, w, 26); ctx.fillStyle = 'rgba(255,235,200,0.18)'; ctx.fillRect(x, topY, w, 4); }
 // ciudad moderna de noche (genérica)
 function cityNow(ctx, t, o = {}) { const gy = o.gy ?? 1500; const g = ctx.createLinearGradient(0, 0, 0, gy); g.addColorStop(0, '#0C1421'); g.addColorStop(1, '#16304f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  for (const L of [{ c: '#132840', hm: 500, hx: 1000, sd: 4, a: 0.35 }, { c: '#0d1d31', hm: 300, hx: 760, sd: 8, a: 0.6 }]) { const R = H.rng(L.sd); let x = -20; while (x < W + 20) { const bw = 80 + R() * 130, bh = L.hm + R() * (L.hx - L.hm); ctx.fillStyle = L.c; ctx.fillRect(x, gy - bh, bw, bh); for (let wy = gy - bh + 16; wy < gy - 16; wy += 24) for (let wx = x + 8; wx < x + bw - 10; wx += 16) { const r = R(); if (r < 0.32) { ctx.fillStyle = r < 0.08 ? `rgba(255,212,71,${L.a})` : `rgba(106,216,232,${L.a * 0.8})`; ctx.fillRect(wx, wy, 7, 10); } } if (R() < 0.3) { ctx.fillStyle = (Math.floor(t * 1.5 + x) % 2) ? '#e8505b' : '#5a1f28'; ctx.beginPath(); ctx.arc(x + bw / 2, gy - bh - 6, 4, 0, TAU); ctx.fill(); } x += bw + 8; } }
  ctx.fillStyle = '#0a1320'; ctx.fillRect(0, gy, W, HH - gy); }

 const B = [];
 // 1 · 1926: CALLE CON CABLES — «En 1926, cuando los teléfonos todavía necesitaban cables»
 B.push({ t0: 0, t1: TB.b2, in: { type: 'cut' }, draw(ctx, t) {
  ctx.save(); zoomS(ctx, t, 0, TB.b2, 1.06, 1.0, 540, 700); const c = P.city1926(ctx, t, { gy: 1380 });
  const hl = sm(T.cables0 - 0.1, T.cables0 + 0.4, t); if (hl > 0) { const xs = [-80, ...c.poles, W + 80]; ctx.save(); ctx.strokeStyle = '#FFD447'; ctx.lineWidth = 3.5; ctx.shadowColor = '#ffcf6a'; ctx.shadowBlur = 10; ctx.globalAlpha = hl * (0.6 + 0.4 * Math.sin(t * 8)); for (let s = 0; s < xs.length - 1; s++) for (let ai = 0; ai < 3; ai++) for (const k of [0, 3, 5]) { const ox = (k - 2.5) * 24, mid = (xs[s] + xs[s + 1]) / 2, sag = 40 + k * 3 + ai * 6, y = c.wireY[ai]; ctx.beginPath(); ctx.moveTo(xs[s] + ox, y); ctx.quadraticCurveTo(mid + ox, y + sag * 2, xs[s + 1] + ox, y); ctx.stroke(); } ctx.restore(); }
  ctx.restore(); P.eraGrade(ctx, 1, t); scrimTop(ctx, 0.35);
  title(ctx, 'NUEVA YORK · 1926', t, T.y1926 - 0.1, 0, { px: 56 }); if (hl > 0) pill(ctx, 'TELÉFONOS CON CABLES', 540, 1000, t, T.cables0, 0);
 }, sfx(k) { FX.calle1920(k, 0, TB.b2 + 0.3, 1); FX.aparece(k, T.y1926, 520); FX.etiqueta(k, T.cables0); } });

 // 2 · TESLA (≈70 años) en su habitación — «Nikola Tesla imaginó algo que hoy llevas en tu bolsillo»
 B.push({ t0: TB.b2, t1: TB.b3, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.save(); zoomS(ctx, t, TB.b2, TB.b3, 1.0, 1.07, 420, 900); room1926(ctx, t, { floor: 1400, winX: 620 }); desk(ctx, 600, 400, 1130, 1400); P.candlestick(ctx, 830, 1130, 0.8, t, { wireTo: [1100, 1180] });
  const ts = P.teslaOld(ctx, 330, 1400, 1.25, t, { hand: 'chin', look: 0.3 }); ctx.restore();
  P.eraGrade(ctx, 1, t); scrimTop(ctx, 0.35);
  title(ctx, '¡LO IMAGINÓ EN 1926!', t, T.tesla1, 0); tag(ctx, 'RECONSTRUCCIÓN', 330, 330, t, T.tesla1 + 0.3, 0);
  // destello del futuro (fuera de la gradación sepia): un teléfono de hoy aparece como idea junto al bolsillo
  const a = sm(T.hoy1 - 0.1, T.bolsillo1, t); if (a > 0) { const px = 700, py = 640; ctx.save(); ctx.globalAlpha = a; const g = ctx.createRadialGradient(px, py, 10, px, py, 200); g.addColorStop(0, 'rgba(72,213,242,0.45)'); g.addColorStop(1, 'rgba(72,213,242,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 200, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(245,247,250,0.8)'; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.arc(px, py, 150, 0, TAU); ctx.stroke(); ctx.setLineDash([]); for (const [bx, by, r] of [[560, 790, 12], [520, 830, 8]]) { ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.stroke(); } P.smartphone(ctx, px, py, 220 * (0.9 + 0.1 * E.back(a)), t, { glow: 1, screen: (c, x, y, w, h) => { const gg = c.createLinearGradient(x, y, x, y + h); gg.addColorStop(0, '#176EAF'); gg.addColorStop(1, '#48D5F2'); c.fillStyle = gg; c.fillRect(x, y, w, h); } }); ctx.restore(); }
 }, sfx(k) { FX.oficina(k, TB.b2, TB.b3 - TB.b2, 0.8); FX.sello(k, T.tesla1 + 0.05); k.play('sparkle', T.hoy1, { gain: 0.45 }); FX.encender(k, T.bolsillo1 - 0.1, 0.8); } });

 // 3 · VER Y HABLAR A DISTANCIA — dos personas en extremos de la curvatura terrestre (enlace conceptual)
 B.push({ t0: TB.b3, t1: TB.b4, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = '#d9c29c'; ctx.fillRect(0, 0, W, HH); const R = H.rng(3); ctx.fillStyle = 'rgba(73,54,39,0.12)'; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(R() * W, R() * 1200, 1 + R() * 2, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#9D7954'; ctx.beginPath(); ctx.arc(540, 3300, 2300, 0, TAU); ctx.fill(); ctx.strokeStyle = '#493627'; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = 'rgba(73,54,39,0.25)'; for (let k = 0; k < 9; k++) { ctx.beginPath(); ctx.ellipse(140 + k * 110, 1080 + Math.abs(k - 4) * 26, 50, 14, 0, 0, TAU); ctx.fill(); }
  const fr = (x, y, a, who) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(0.9 + 0.1 * E.out(a), 0.9 + 0.1 * E.out(a)); ctx.fillStyle = '#493627'; ctx.beginPath(); ctx.ellipse(0, 0, 175, 215, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#E1C9A1'; ctx.beginPath(); ctx.ellipse(0, 0, 155, 195, 0, 0, TAU); ctx.fill(); ctx.save(); ctx.clip(); P.persona(ctx, 0, 30, 0.75, t, who); ctx.restore(); ctx.restore(); };
  const a1 = sm(TB.b3 + 0.1, TB.b3 + 0.5, t), a2 = sm(T.hablar - 0.2, T.hablar + 0.3, t); fr(250, 740, a1, { skin: '#c8a27c', hair: '#3a2a1c', shirt: '#73736E', style: 'short' }); fr(830, 740, a2, { skin: '#d3ae86', hair: '#2b1d14', shirt: '#A77C45', style: 'bun', ph: 2 });
  const ln = sm(T.hablar, T.ver2 + 0.4, t); if (ln > 0) { ctx.save(); ctx.strokeStyle = '#493627'; ctx.lineWidth = 6; ctx.setLineDash([14, 12]); ctx.lineDashOffset = -t * 50; ctx.beginPath(); const n = 40; for (let i = 0; i <= n * ln; i++) { const u = i / n, x = lerp(420, 660, u), y = 620 - Math.sin(Math.PI * u) * 150; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); }
  const ea = sm(T.hablar, T.hablar + 0.3, t), ey = sm(T.ver2, T.ver2 + 0.3, t); if (ea > 0) { ctx.save(); ctx.globalAlpha *= ea; speaker(ctx, 470, 440, 1, '#202021', t); ctx.restore(); } if (ey > 0) { ctx.save(); ctx.globalAlpha *= ey; eye(ctx, 610, 440, 1, '#202021'); ctx.restore(); }
  const ka = sm(T.miles - 0.1, T.miles + 0.4, t); if (ka > 0) { ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = '#202021'; ctx.lineWidth = 5; const yb = 1010; ctx.beginPath(); ctx.moveTo(250, yb - 20); ctx.lineTo(250, yb + 20); ctx.moveTo(830, yb - 20); ctx.lineTo(830, yb + 20); ctx.moveTo(250, yb); ctx.lineTo(lerp(250, 830, E.out(ka)), yb); ctx.stroke(); ctx.restore(); pill(ctx, 'A MILES DE KILÓMETROS', 540, 1110, t, T.miles, 0); }
  P.eraGrade(ctx, 1, t); title(ctx, 'VER Y HABLAR A DISTANCIA', t, TB.b3 + 0.2, 0); tag(ctx, 'IDEA DE TESLA · RECREACIÓN', 540, 300, t, TB.b3 + 0.5, 0);
 }, sfx(k) { FX.aparece(k, TB.b3 + 0.15, 500); FX.aparece(k, T.hablar - 0.15, 600); FX.senalRadio(k, T.hablar + 0.1, 3, 0.7); FX.flecha(k, T.miles, 0.6); } });

 // 4 · ¿CÓMO PUDO IMAGINARLO? — Tesla pensativo; 1926 → 2026 = cien años
 B.push({ t0: TB.b4, t1: TB.b5, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.save(); zoomS(ctx, t, TB.b4, TB.b5, 1.0, 1.08, 420, 700); room1926(ctx, t, { floor: 1600, winX: 640 }); P.teslaOld(ctx, 420, 1600 + 380, 2.0, t, { hand: 'chin', look: -0.4 }); ctx.restore();
  P.eraGrade(ctx, 1, t); scrimTop(ctx, 0.4);
  const q = sm(T.como4 - 0.1, T.como4 + 0.3, t); if (q > 0) { ctx.save(); ctx.globalAlpha *= q; ctx.font = '700 230px Fraunces'; ctx.fillStyle = 'rgba(225,201,161,0.9)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 830, 560 + Math.sin(t * 2) * 8); ctx.restore(); }
  title(ctx, '¿CÓMO PUDO IMAGINARLO?', t, T.como4 - 0.1, 0);
  const y = sm(T.cien - 0.4, T.cien, t); if (y > 0) { ctx.save(); ctx.globalAlpha *= y; ctx.fillStyle = 'rgba(32,32,33,0.86)'; ctx.beginPath(); ctx.roundRect(330, 1080, 420, 220, 24); ctx.fill(); ctx.strokeStyle = '#C6A06B'; ctx.lineWidth = 3; ctx.stroke(); P.yearRoll(ctx, 540, 1160, 110, 1926, 2026, win(t, T.cien - 0.3, T.cien + 0.9), { col: '#E1C9A1', font: '700 110px Fraunces' }); txt(ctx, '100 AÑOS', 540, 1262, 40, '#C6A06B', { f: 'Fraunces', w: 700 }); ctx.restore(); }
 }, sfx(k) { k.play('whoosh', TB.b4 + 0.05, { dur: 0.6, top: 900, gain: 0.25 }); FX.aparece(k, T.como4, 440); FX.contador(k, T.cien - 0.3, T.cien + 0.9, 1926, 2026); } });

 // 5 · COMUNICACIÓN INALÁMBRICA — torre de radio de los años 20 emitiendo (concepto)
 B.push({ t0: TB.b5, t1: TB.b6, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, 1300); g.addColorStop(0, '#c4a57c'); g.addColorStop(1, '#ead6b2'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  ctx.fillStyle = '#a88a66'; ctx.beginPath(); ctx.moveTo(0, 1300); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 1240 - Math.sin(x * 0.006) * 40 - Math.sin(x * 0.017) * 14); ctx.lineTo(W, 1300); ctx.fill(); ctx.fillStyle = '#7e6750'; ctx.fillRect(0, 1300, W, HH - 1300);
  const wv = sm(T.resp, T.inalam5 - 0.2, t); P.radioTower(ctx, 540, 1300, 760, t, { waves: wv, r1: 520, wcol: '#493627' });
  ctx.fillStyle = '#5a4130'; ctx.fillRect(760, 1210, 170, 90); ctx.beginPath(); ctx.moveTo(745, 1212); ctx.lineTo(845, 1150); ctx.lineTo(945, 1212); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#e9d8b8'; ctx.fillRect(790, 1236, 30, 30);
  ctx.strokeStyle = '#493627'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(545, 560); ctx.quadraticCurveTo(700, 900, 845, 1160); ctx.stroke();
  P.eraGrade(ctx, 1, t); scrimTop(ctx, 0.3); title(ctx, 'COMUNICACIÓN INALÁMBRICA', t, T.inalam5 - 0.5, 0); tag(ctx, 'TORRE DE RADIO · AÑOS 20', 540, 1400, t, TB.b5 + 0.4, 0);
 }, sfx(k) { FX.radio1920(k, TB.b5 + 0.2, 2.2, 1); FX.senalRadio(k, T.inalam5 - 0.2, 4, 0.8); FX.aparece(k, T.inalam5 - 0.5, 520); } });

 // 6a · EL TELÉFONO YA EXISTÍA — teléfono de candelero sobre un escritorio; suena y se descuelga
 B.push({ t0: TB.b6, t1: TB.b6b, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.save(); zoomS(ctx, t, TB.b6, TB.b6b, 1.0, 1.06, 540, 1000); room1926(ctx, t, { floor: 1500, winX: 60 }); desk(ctx, 120, 840, 1180, 1500);
  ctx.fillStyle = '#e4cfa6'; ctx.save(); ctx.translate(330, 1172); ctx.rotate(-0.05); ctx.fillRect(-90, -8, 180, 10); ctx.restore(); P.candlestick(ctx, 620, 1180, 1.75, t, { ring: (t > T.telefono6 - 0.2 && t < T.telefono6 + 0.9) ? 1 : 0, wireTo: [1100, 1230] }); ctx.restore();
  P.eraGrade(ctx, 1, t); scrimTop(ctx, 0.35); title(ctx, 'EL TELÉFONO YA EXISTÍA', t, T.telefono6 - 0.1, 0);
 }, sfx(k) { FX.oficina(k, TB.b6, TB.b6b - TB.b6, 1); FX.timbre(k, T.telefono6 - 0.2, 1.1, 0.9); } });

 // 6b · COMUNICACIONES POR CABLE — centralita manual con operadoras que conectan clavijas
 const plugT = (i, c) => T.llamadas + 0.25 * (i * 4 + c) * 0.55;
 B.push({ t0: TB.b6b, t1: TB.b7, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  ctx.save(); zoomS(ctx, t, TB.b6b, TB.b7, 1.05, 1.0, 540, 900); ctx.fillStyle = '#b89a74'; ctx.fillRect(0, 0, W, HH); ctx.fillStyle = '#7a5c42'; ctx.fillRect(0, 1180, W, 260); ctx.fillStyle = '#4a3627'; ctx.fillRect(0, 1440, W, HH - 1440);
  const sb = P.switchboard(ctx, 40, 1440, 1000, t, { n: 3, plug: (i, c, tt) => (c % 2 ? sm(plugT(i, c), plugT(i, c) + 0.35, tt) : 0) });
  const cb = sm(T.cables7 - 0.3, T.cables7 + 0.2, t); if (cb > 0) { ctx.save(); ctx.globalAlpha *= cb; ctx.strokeStyle = '#202021'; ctx.lineWidth = 5; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.moveTo(60 + k * 150, sb.top - 26); ctx.bezierCurveTo(60 + k * 150, sb.top - 160, 540 + (k - 3) * 30, 300, 540 + (k - 3) * 30, -20); ctx.stroke(); } ctx.restore(); }
  ctx.restore(); P.eraGrade(ctx, 1, t); scrimTop(ctx, 0.4);
  title(ctx, 'COMUNICACIONES POR CABLE', t, T.redes7 - 0.3, 0); tag(ctx, 'CENTRALITA MANUAL', 540, 330, t, TB.b6b + 0.3, 0);
 }, sfx(k) { FX.oficina(k, TB.b6b, TB.b7 - TB.b6b, 1.1); for (let i = 0; i < 3; i++) for (const c of [1, 3]) FX.clavija(k, plugT(i, c) + 0.33, 0.9); FX.aparece(k, T.redes7 - 0.3, 520); } });

 // 7 · SEÑALES SIN CABLES — los cables de la calle se desvanecen y se convierten en ondas (la idea de Tesla)
 B.push({ t0: TB.b7, t1: TB.b8, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cut = E.inOut(win(t, T.senales8 - 0.1, T.distancias)); const c = P.city1926(ctx, t, { gy: 1380, cut, cars: true, seed: 2 });
  for (const px of c.poles) { const a = sm(T.senales8 + 0.3, T.senales8 + 1.0, t); if (a > 0) { P.radioWaves(ctx, px, c.top - 10, t, { dir: px < 540 ? -0.15 : Math.PI + 0.15, spread: 1.2, n: 4, col: '#202021', r1: 640, a, w: 6 }); } }
  const pa = sm(T.conectar - 0.2, T.conectar + 0.3, t); if (pa > 0) { ctx.save(); ctx.globalAlpha *= pa; for (const [x, s] of [[300, 1], [780, -1]]) { ctx.fillStyle = '#202021'; ctx.beginPath(); ctx.arc(x, 1250, 22, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 34, 1380); ctx.lineTo(x - 26, 1280); ctx.lineTo(x + 26, 1280); ctx.lineTo(x + 34, 1380); ctx.closePath(); ctx.fill(); } ctx.restore(); }
  P.eraGrade(ctx, 1, t); scrimTop(ctx, 0.35); title(ctx, 'SEÑALES SIN CABLES', t, T.senales8 - 0.1, 0); pill(ctx, 'CONECTAR PERSONAS A DISTANCIA', 540, 1010, t, T.conectar, 0, { px: 34 });
 }, sfx(k) { FX.calle1920(k, TB.b7, TB.b8 - TB.b7, 0.8); FX.saltoTiempo(k, T.senales8 - 0.1, 1.0, 0.6); FX.senalRadio(k, T.senales8 + 0.4, 4, 0.8); FX.etiqueta(k, T.conectar); } });

 // 8a · LA REVISTA (Collier's, 30-ene-1926) — página reconstruida, sin citas
 B.push({ t0: TB.b8, t1: TB.b8b, in: { type: 'rise', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = '#4a3627'; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 3; for (let y = 40; y < HH; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y + 30); ctx.stroke(); }
  ctx.save(); zoomS(ctx, t, TB.b8, TB.b8b, 1.0, 1.1, 540, 760); P.magazine1926(ctx, 540, 760, 1.12, t, { title: "COLLIER'S", date: '30 DE ENERO DE 1926', head: '«When Woman Is Boss»', by: 'Entrevista de John B. Kennedy', rot: -0.03, page: win(t, TB.b8 + 0.05, TB.b8 + 0.6) > 0 && t < TB.b8 + 0.6 ? 1 - win(t, TB.b8 + 0.05, TB.b8 + 0.6) : 0, hi: sm(T.lejos - 0.3, T.lejos + 0.3, t), tag: false }); ctx.restore();
  P.eraGrade(ctx, 1, t); tag(ctx, 'RECONSTRUCCIÓN CONCEPTUAL · SIN CITAS', 540, 1300, t, TB.b8 + 0.4, 0); title(ctx, 'Y FUE MÁS LEJOS', t, T.lejos - 0.4, 0, { y: 170 });
 }, sfx(k) { FX.paginas(k, TB.b8 + 0.05, 2, 0.9); FX.aparece(k, T.lejos - 0.4, 520); } });

 // 8b · VER EL MUNDO A DISTANCIA — Tesla imagina presenciar un acontecimiento lejano (ver + escuchar)
 B.push({ t0: TB.b8b, t1: TB.b9, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  room1926(ctx, t, { floor: 1450, winX: 700 }); P.teslaOld(ctx, 250, 1450, 1.15, t, { hand: 'point', look: 0.6 });
  const v = sm(T.ver10 - 0.3, T.ver10 + 0.3, t); if (v > 0) { const fx = 640, fy = 720, fw = 380, fh = 300; ctx.save(); ctx.globalAlpha *= v; ctx.fillStyle = '#e4cfa6'; ctx.beginPath(); ctx.ellipse(fx, fy, fw, fh, 0, 0, TAU); ctx.fill(); ctx.save(); ctx.clip();
   const g = ctx.createLinearGradient(0, fy - fh, 0, fy + fh); g.addColorStop(0, '#d8bf98'); g.addColorStop(1, '#b8996f'); ctx.fillStyle = g; ctx.fillRect(fx - fw, fy - fh, 2 * fw, 2 * fh);
   ctx.fillStyle = '#7a5c42'; ctx.fillRect(fx - 200, fy - 70, 400, 120); ctx.fillStyle = '#5a4130'; ctx.fillRect(fx - 230, fy + 50, 460, 30); for (const sx of [-160, 160]) { ctx.fillRect(fx + sx - 3, fy - 200, 6, 130); ctx.fillStyle = '#C6A06B'; ctx.beginPath(); ctx.moveTo(fx + sx + 3, fy - 200); ctx.lineTo(fx + sx + 3 + 70, fy - 200 + 20 + Math.sin(t * 4 + sx) * 6); ctx.lineTo(fx + sx + 3, fy - 160); ctx.fill(); ctx.fillStyle = '#5a4130'; }
   ctx.fillStyle = '#202021'; ctx.beginPath(); ctx.arc(fx, fy - 100, 16, 0, TAU); ctx.fill(); ctx.fillRect(fx - 18, fy - 84, 36, 50 + Math.sin(t * 3) * 2);
   const R = H.rng(9); for (let row = 0; row < 4; row++) for (let k = 0; k < 16; k++) { const hx = fx - fw + 30 + k * 48 + (row % 2) * 24 + R() * 8, hy = fy + 120 + row * 42 + Math.sin(t * 5 + k + row) * (row === 0 ? 3 : 1.5); ctx.fillStyle = row % 2 ? '#3a2a1c' : '#493627'; ctx.beginPath(); ctx.arc(hx, hy, 17, 0, TAU); ctx.fill(); ctx.fillRect(hx - 20, hy + 12, 40, 60); }
   ctx.restore(); ctx.strokeStyle = '#493627'; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(fx, fy, fw, fh, 0, 0, TAU); ctx.stroke(); for (const [bx, by, r] of [[420, 1060, 22], [370, 1120, 14]]) { ctx.fillStyle = '#e4cfa6'; ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fill(); } ctx.restore(); }
  P.eraGrade(ctx, 1, t); scrimTop(ctx, 0.4); title(ctx, 'VER EL MUNDO A DISTANCIA', t, T.ver10 - 0.3, 0);
  const e1 = sm(T.ver10, T.ver10 + 0.3, t), e2 = sm(T.escuchar, T.escuchar + 0.3, t); if (e1 > 0) { ctx.save(); ctx.globalAlpha *= e1; ctx.fillStyle = 'rgba(32,32,33,0.85)'; ctx.beginPath(); ctx.arc(780, 1150, 70, 0, TAU); ctx.fill(); eye(ctx, 780, 1150, 1, '#E1C9A1'); ctx.restore(); txt(ctx, 'VER', 780, 1262, 36, '#202021', { f: 'Fraunces', w: 700 }); }
  if (e2 > 0) { ctx.save(); ctx.globalAlpha *= e2; ctx.fillStyle = 'rgba(32,32,33,0.85)'; ctx.beginPath(); ctx.arc(960, 1150, 70, 0, TAU); ctx.fill(); ear(ctx, 960, 1146, 1.3, '#E1C9A1'); ctx.restore(); ctx.save(); ctx.globalAlpha *= e2; txt(ctx, 'ESCUCHAR', 960, 1262, 36, '#202021', { f: 'Fraunces', w: 700 }); ctx.restore(); }
  tag(ctx, 'IDEA · RECREACIÓN', 250, 330, t, TB.b8b + 0.3, 0);
 }, sfx(k) { FX.oficina(k, TB.b8b, TB.b9 - TB.b8b, 0.6); k.play('riser', T.ver10 - 0.6, { dur: 0.6, gain: 0.25 }); FX.aparece(k, T.ver10, 560); FX.aparece(k, T.escuchar, 640); k.noise(T.acontec, { dur: 2.6, color: 'pink', filter: 'bandpass', f: 900, q: 0.7, gain: 0.03, a: 0.6, hold: 1.2 }); } });

 // 9 · ¡CABRÍA EN UN BOLSILLO! — chaleco en primer plano; un aparato conceptual asoma del bolsillo
 B.push({ t0: TB.b9, t1: TB.b10, in: { type: 'zoom', d: 0.45, x: 680, y: 900 }, draw(ctx, t) {
  const d = E.out(win(t, T.pequeno, T.chaleco + 0.2)); P.vestPocket(ctx, 0, 0, W, HH, t, { dev: d * 0.75, glow: sm(T.bolsillo11, T.chaleco + 0.4, t) });
  P.eraGrade(ctx, 1, t); scrimTop(ctx, 0.4); title(ctx, '¡CABRÍA EN UN BOLSILLO!', t, T.bolsillo11 - 0.3, 0); tag(ctx, 'RECREACIÓN CONCEPTUAL', 670, 1320, t, T.pequeno, 0); pill(ctx, 'BOLSILLO DE CHALECO', 670, 1200, t, T.chaleco - 0.1, 0, { px: 34 });
 }, sfx(k) { k.play('paper', T.pequeno, { dur: 0.5, gain: 0.35 }); FX.aparece(k, T.bolsillo11 - 0.3, 520); FX.etiqueta(k, T.chaleco); } });

 // 10 · ¿TE RESULTA FAMILIAR? — el aparato sale del bolsillo, crece y se transforma en smartphone; 1926 → hoy
 B.push({ t0: TB.b10, t1: TB.b11, in: { type: 'cut' }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.b10, TB.b11 + 0.1)), era = ERA(t);
  ctx.save(); ctx.translate(0, u * 900); P.vestPocket(ctx, 0, 0, W, HH, t, { dev: 0, glow: 0 }); ctx.restore();
  ctx.save(); ctx.globalAlpha = u; cityNow(ctx, t, { gy: 1500 }); ctx.restore();
  const px = lerp(670, 540, u), py = lerp(800, 900, u), h = lerp(300, 860, u); P.smartphone(ctx, px, py, h, t, { glow: u, body: P.mixc('#3b3530', '#1c2636', u), screen: (c, x, y, w, hh) => { const g = c.createLinearGradient(x, y, x, y + hh); g.addColorStop(0, P.mixc('#5a4a38', '#176EAF', u)); g.addColorStop(1, P.mixc('#E1C9A1', '#48D5F2', u)); c.fillStyle = g; c.fillRect(x, y, w, hh); } });
  P.eraGrade(ctx, era, t); P.techGrade(ctx, 1 - era); scrimTop(ctx, 0.4); title(ctx, '¿TE RESULTA FAMILIAR?', t, T.te12 - 0.05, 1 - era > 0.5 ? 1 : 0);
 }, sfx(k) { FX.saltoTiempo(k, TB.b10, 1.3, 1); FX.encender(k, TB.b11 - 0.1, 1); } });

 // 11 · UNA IDEA ADELANTADA A SU ÉPOCA — cadena de evolución y videollamada en la mano
 B.push({ t0: TB.b11, t1: TB.b12, in: { type: 'cut' }, draw(ctx, t) {
  cityNow(ctx, t, { gy: 1500 }); const ph = sm(T.celulares - 0.6, T.celulares, t), kk = lerp(0, 6, E.inOut(win(t, TB.b11 + 0.1, T.parecido + 0.9)));
  if (ph < 1) { ctx.save(); ctx.globalAlpha *= 1 - ph; P.evoGrid(ctx, 540, 420, t, kk); ctx.restore(); }
  P.eraGrade(ctx, ERA(t), t); P.techGrade(ctx, 1 - ERA(t));
  if (ph > 0) { ctx.save(); ctx.translate(0, (1 - E.out(ph)) * 1150); P.handHold(ctx, 540, 900, 820, 'back'); P.smartphone(ctx, 540, 900, 820, t, { glow: 1, screen: (c, x, y, w, h) => P.videoCall(c, x, y, w, h, t, { t0: T.celulares - 0.6, remote: { style: 'long', shirt: '#6AD8E8', hair: '#3b2416', skin: '#b98060' }, self: { skin: '#e0b48e', hair: '#5a3a22' } }) }); P.handHold(ctx, 540, 900, 820, 'front'); ctx.restore(); }
  scrimTop(ctx, 0.5); title(ctx, 'UNA IDEA ADELANTADA A SU ÉPOCA', t, TB.b11 + 0.05, 1, { px: 48 }); if (ph > 0) pill(ctx, 'VIDEOLLAMADA', 540, 330, t, T.celulares, 1, { px: 36 });
 }, sfx(k) { for (let i = 1; i <= 6; i++) FX.etiqueta(k, TB.b11 + 0.1 + (T.parecido + 0.9 - TB.b11 - 0.1) * (i - 0.5) / 6); FX.llamada(k, T.celulares - 0.4, 1); } });

 // 12 · IMAGEN + SONIDO → DATOS — vista de corte del teléfono: cámara y micrófono convierten en bits
 B.push({ t0: TB.b12, t1: TB.b13, in: { type: 'cut' }, draw(ctx, t) {
  ctx.fillStyle = N.fondo; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = 'rgba(72,213,242,0.06)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); } for (let y = 0; y < HH; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const bgA = 1 - sm(TB.b12, TB.b12 + 0.5, t); if (bgA > 0) { ctx.save(); ctx.globalAlpha = bgA; cityNow(ctx, t, { gy: 1500 }); ctx.restore(); }
  const gl = E.inOut(win(t, TB.b12, TB.b12 + 0.7)), hx = lerp(540, 330, gl), hy = lerp(900, 860, gl), hh = lerp(820, 800, gl);
  const cut = sm(T.convierten - 0.2, T.convierten + 0.5, t); P.handHold(ctx, hx, hy, hh, 'back'); const r = P.smartphone(ctx, hx, hy, hh, t, { cut, screen: (c, x, y, w, h) => P.videoCall(c, x, y, w, h, t, { t0: T.celulares - 0.6, remote: { style: 'long', shirt: '#6AD8E8', hair: '#3b2416', skin: '#b98060' }, self: { skin: '#e0b48e', hair: '#5a3a22' } }) }); P.handHold(ctx, hx, hy, hh, 'front');
  if (cut > 0.6) { const a1 = sm(T.imagenes14 - 0.1, T.imagenes14 + 0.3, t), a2 = sm(T.sonidos14 - 0.1, T.sonidos14 + 0.3, t), a3 = sm(T.info14 - 0.1, T.info14 + 0.3, t);
   lead(ctx, r.camera[0], r.camera[1], 640, 420, a1, N.cian); if (a1 > 0) pill(ctx, 'CÁMARA → IMAGEN', 820, 420, t, T.imagenes14, 1, { px: 34 });
   lead(ctx, r.mic[0], r.mic[1], 640, 1290, a2, N.cian); if (a2 > 0) pill(ctx, 'MICRÓFONO → SONIDO', 830, 1290, t, T.sonidos14, 1, { px: 34 });
   lead(ctx, r.chip[0], r.chip[1], 640, 700, a3, N.oro); if (a3 > 0) pill(ctx, 'PROCESADOR', 820, 700, t, T.info14, 1, { px: 34 });
   if (a1 > 0) P.dataPackets(ctx, r.camera[0], r.camera[1], r.chip[0], r.chip[1], t, { n: 3, size: 22, speed: 0.9, a: a1 }); if (a2 > 0) P.dataPackets(ctx, r.mic[0], r.mic[1], r.chip[0], r.chip[1], t, { n: 4, size: 22, speed: 0.8, a: a2, arc: 40 });
   const dg = sm(T.digital - 0.1, T.digital + 0.4, t); if (dg > 0) { P.dataPackets(ctx, r.chip[0] + 60, r.chip[1], 960, 960, t, { n: 7, size: 34, speed: 0.7, a: dg, col: N.oro, arc: -120 }); pill(ctx, 'DATOS DIGITALES', 820, 1000, t, T.digital, 1, { px: 34 }); } }
  scrimTop(ctx, 0.4); title(ctx, 'IMAGEN + SONIDO → DATOS', t, TB.b12 + 0.1, 1);
 }, sfx(k) { k.play('whoosh', T.convierten - 0.2, { dur: 0.6, top: 2200, gain: 0.3 }); k.play('shutter', T.imagenes14, { gain: 0.6 }); FX.etiqueta(k, T.sonidos14); FX.flujoDatos(k, T.info14, 1.6, 0.9); FX.aparece(k, T.digital, 700); } });

 // 13 · DATOS QUE VIAJAN POR REDES — teléfono → estación base → fibra → red → estación base → teléfono
 const GY = 900;
 B.push({ t0: TB.b13, t1: TB.b14, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, GY); g.addColorStop(0, '#0C1421'); g.addColorStop(1, '#16304f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, GY); ctx.fillStyle = '#0a1320'; ctx.fillRect(0, GY, W, HH - GY); ctx.fillStyle = '#1b2b40'; ctx.fillRect(0, GY, W, 8); ctx.fillStyle = 'rgba(142,158,169,0.12)'; const R = H.rng(4); for (let i = 0; i < 70; i++) { ctx.beginPath(); ctx.arc(R() * W, GY + 30 + R() * 500, 2 + R() * 5, 0, TAU); ctx.fill(); }
  const inset = (x, y, a, lit) => { if (a <= 0) return; ctx.save(); const sc = E.back(cl(a)); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y); ctx.fillStyle = '#132840'; ctx.beginPath(); ctx.arc(x, y, 130, 0, TAU); ctx.fill(); ctx.strokeStyle = N.cian; ctx.lineWidth = 4; ctx.stroke(); ctx.save(); ctx.clip(); P.handHold(ctx, x, y + 10, 200, 'back'); P.smartphone(ctx, x, y + 10, 200, t, { glow: lit, screen: (c, sx, sy, w, h) => { c.fillStyle = lit > 0.5 ? '#176EAF' : '#101F37'; c.fillRect(sx, sy, w, h); P.persona(c, sx + w / 2, sy + h * 0.55, w / 520, t, { style: 'short' }); } }); P.handHold(ctx, x, y + 10, 200, 'front'); ctx.restore(); ctx.restore(); };
  inset(170, 410, sm(TB.b13 + 0.1, TB.b13 + 0.4, t), 1); const tA = P.cellTower(ctx, 330, GY, 400, t, { waves: 0 }), tB = P.cellTower(ctx, 760, GY, 400, t, { waves: 0 });
  const w1 = sm(T.radio15 - 0.4, T.radio15, t); if (w1 > 0) { P.radioWaves(ctx, 230, 470, t, { dir: 0.35, spread: 0.8, n: 3, r0: 40, r1: 140, a: w1, w: 5 }); P.dataPackets(ctx, 250, 470, tA.ant[0] - 20, tA.ant[1], t, { n: 3, size: 20, speed: 0.9, a: w1 }); }
  const fp = sm(T.redes15 - 0.2, T.redes15 + 0.8, t), path = [[330, GY], [330, 1160], [450, 1160]], path2 = [[630, 1160], [760, 1160], [760, GY]];
  if (fp > 0) { P.fiberPath(ctx, path, t, { prog: fp, pulses: 3, speed: 300 }); ctx.save(); ctx.globalAlpha *= fp; ctx.fillStyle = '#132840'; ctx.beginPath(); ctx.roundRect(450, 1090, 180, 140, 14); ctx.fill(); ctx.strokeStyle = N.cian; ctx.lineWidth = 3; ctx.stroke(); for (let k = 0; k < 4; k++) { ctx.fillStyle = '#1e3a5a'; ctx.fillRect(470, 1106 + k * 30, 140, 20); ctx.fillStyle = (Math.floor(t * 4 + k) % 3) ? N.cian : N.oro; ctx.fillRect(590, 1112 + k * 30, 8, 8); } ctx.restore(); }
  const fp2 = sm(T.llegar - 0.6, T.llegar, t); if (fp2 > 0) P.fiberPath(ctx, path2, t, { prog: fp2, pulses: 3, speed: 300 });
  const w2 = sm(T.llegar - 0.1, T.llegar + 0.3, t); if (w2 > 0) { P.radioWaves(ctx, tB.ant[0] + 20, tB.ant[1], t, { dir: -0.6, spread: 0.8, n: 3, r0: 40, r1: 160, a: w2, w: 5 }); P.dataPackets(ctx, tB.ant[0] + 20, tB.ant[1], 860, 470, t, { n: 3, size: 20, speed: 0.9, a: w2 }); }
  inset(910, 410, sm(T.dispositivo15 - 0.3, T.dispositivo15, t), sm(T.dispositivo15, T.dispositivo15 + 0.3, t));
  const l1 = sm(T.radio15 - 0.1, T.radio15 + 0.3, t); if (l1 > 0) { pill(ctx, 'ESTACIÓN BASE', 330, 960, t, T.radio15, 1, { px: 32 }); pill(ctx, 'ESTACIÓN BASE', 760, 960, t, T.llegar - 0.2, 1, { px: 32 }); }
  if (fp > 0.3) { pill(ctx, 'FIBRA ÓPTICA', 250, 1250, t, T.redes15 + 0.2, 1, { px: 32 }); pill(ctx, 'RED DE COMUNICACIÓN', 620, 1320, t, T.redes15 + 0.5, 1, { px: 32 }); }
  pill(ctx, 'SEÑALES DE RADIO', 545, 780, t, T.radio15, 1, { px: 32 });
  scrimTop(ctx, 0.4); title(ctx, 'DATOS QUE VIAJAN POR REDES', t, TB.b13 + 0.1, 1, { px: 50 });
 }, sfx(k) { FX.senalRadio(k, T.radio15 - 0.3, 3, 0.9); FX.flujoDatos(k, T.redes15, 1.2, 0.7); k.play('whoosh', T.redes15, { dur: 0.8, top: 1600, gain: 0.25 }); FX.senalRadio(k, T.llegar, 3, 0.9); FX.encender(k, T.dispositivo15 + 0.1, 0.7); } });

 // 14 · DATOS → IMAGEN + SONIDO — el teléfono receptor reconstruye la imagen (mosaico → rostro) y el sonido
 B.push({ t0: TB.b14, t1: TB.b15, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  cityNow(ctx, t, { gy: 1520 }); ctx.fillStyle = 'rgba(12,20,33,0.55)'; ctx.fillRect(0, 0, W, HH);
  const con = sm(T.vuelve - 0.1, T.imagenes16 + 0.4, t); P.dataPackets(ctx, 540, -20, 540, 480, t, { n: 6, size: 30, speed: 0.9, a: 1 - con * 0.8, col: N.oro });
  P.handHold(ctx, 540, 940, 860, 'back'); const r = P.smartphone(ctx, 540, 940, 860, t, { glow: 1, screen: (c, x, y, w, h) => { P.videoCall(c, x, y, w, h, t, { t0: T.celulares - 0.6, connect: 1, remote: { style: 'long', shirt: '#6AD8E8', hair: '#3b2416', skin: '#b98060' }, self: { skin: '#e0b48e', hair: '#5a3a22' } }); const cs = lerp(70, 4, con); if (con < 0.97) { const R = H.rng(Math.floor(t * 8)); for (let yy = y; yy < y + h; yy += cs) for (let xx = x; xx < x + w; xx += cs) { c.fillStyle = `rgba(${16 + R() * 40 | 0},${40 + R() * 90 | 0},${80 + R() * 120 | 0},${(1 - con) * 0.95})`; c.fillRect(xx, yy, cs - 1, cs - 1); } } } }); P.handHold(ctx, 540, 940, 860, 'front');
  const sa = sm(T.sonidos16 - 0.1, T.sonidos16 + 0.3, t); if (sa > 0) { ctx.save(); ctx.globalAlpha *= sa; speaker(ctx, 880, 1100, 1.3, N.cian, t); ctx.restore(); }
  scrimTop(ctx, 0.5); title(ctx, 'DATOS → IMAGEN + SONIDO', t, TB.b14 + 0.1, 1); pill(ctx, 'IMAGEN', 380, 330, t, T.imagenes16, 1, { px: 36 }); pill(ctx, 'SONIDO', 700, 330, t, T.sonidos16, 1, { px: 36 });
 }, sfx(k) { FX.flujoDatos(k, TB.b14, 1.0, 0.8); k.play('sparkle', T.imagenes16, { gain: 0.4 }); FX.etiqueta(k, T.sonidos16); k.tone(T.sonidos16 + 0.1, { f: 'A4', dur: 0.5, gain: 0.03, a: 0.05, verb: 0.3 }); } });

 // 15 · NO INVENTÓ EL SMARTPHONE — tarjeta 1926 (sepia) frente a tarjeta de hoy
 B.push({ t0: TB.b15, t1: TB.b16, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = N.fondo; ctx.fillRect(0, 0, W, HH);
  const L = { x: 50, y: 400, w: 470, h: 780 }, Rr = { x: 560, y: 400, w: 470, h: 780 }, a1 = sm(TB.b15 + 0.1, TB.b15 + 0.5, t), a2 = sm(TB.b15 + 0.3, TB.b15 + 0.7, t);
  if (a1 > 0) { ctx.save(); ctx.translate(-(1 - E.out(a1)) * 600, 0); ctx.beginPath(); ctx.roundRect(L.x, L.y, L.w, L.h, 24); ctx.clip(); room1926(ctx, t, { floor: L.y + L.h - 80, winX: L.x + 260 }); P.teslaOld(ctx, L.x + 200, L.y + L.h - 80, 0.82, t, { hand: 'down', look: 0.3 }); P.eraGrade(ctx, 1, t, { dust: false }); ctx.restore(); ctx.save(); ctx.translate(-(1 - E.out(a1)) * 600, 0); ctx.strokeStyle = O.ocre; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(L.x, L.y, L.w, L.h, 24); ctx.stroke(); ctx.restore(); }
  if (a2 > 0) { ctx.save(); ctx.translate((1 - E.out(a2)) * 600, 0); ctx.beginPath(); ctx.roundRect(Rr.x, Rr.y, Rr.w, Rr.h, 24); ctx.clip(); cityNow(ctx, t, { gy: Rr.y + Rr.h }); ctx.translate(Rr.x + Rr.w / 2 - 540, 0); P.handHold(ctx, 540, 820, 560, 'back'); P.smartphone(ctx, 540, 820, 560, t, { glow: 1, screen: (c, x, y, w, h) => { const g = c.createLinearGradient(x, y, x, y + h); g.addColorStop(0, '#176EAF'); g.addColorStop(1, '#101F37'); c.fillStyle = g; c.fillRect(x, y, w, h); } }); P.handHold(ctx, 540, 820, 560, 'front'); ctx.restore(); ctx.save(); ctx.translate((1 - E.out(a2)) * 600, 0); ctx.strokeStyle = N.cian; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(Rr.x, Rr.y, Rr.w, Rr.h, 24); ctx.stroke(); ctx.restore(); }
  pill(ctx, '1926', L.x + L.w / 2, L.y + L.h + 70, t, TB.b15 + 0.3, 0, { px: 40 }); pill(ctx, 'HOY', Rr.x + Rr.w / 2, Rr.y + Rr.h + 70, t, TB.b15 + 0.5, 1, { px: 40 });
  scrimTop(ctx, 0.3); title(ctx, 'NO INVENTÓ EL SMARTPHONE', t, T.smartphone - 0.2, 1, { px: 52 }); pill(ctx, 'NI PREDIJO TODOS SUS DETALLES', 540, 310, t, T.predijo, 1, { px: 36 });
 }, sfx(k) { FX.aparece(k, TB.b15 + 0.2, 480); FX.aparece(k, TB.b15 + 0.4, 600); FX.tachado(k, T.smartphone - 0.1); FX.etiqueta(k, T.predijo); } });

 // 16 · TRES IDEAS QUE SÍ ANTICIPÓ — comunicación instantánea, ver y escuchar a distancia, dispositivo de bolsillo; décadas después
 B.push({ t0: TB.b16, t1: TB.b17, in: { type: 'rise', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = N.fondo; ctx.fillRect(0, 0, W, HH); const g = ctx.createRadialGradient(540, 800, 100, 540, 800, 900); g.addColorStop(0, 'rgba(23,110,175,0.35)'); g.addColorStop(1, 'rgba(23,110,175,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const items = [['COMUNICACIÓN INSTANTÁNEA', T.algunas], ['VER Y ESCUCHAR A DISTANCIA', T.funciones - 0.1], ['DISPOSITIVO DE BOLSILLO', T.decadas - 0.15]];
  items.forEach(([s, t0], i) => { const a = sm(t0, t0 + 0.35, t); if (a <= 0) return; const y = 400 + i * 230; ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - E.out(a)) * 120, 0); ctx.fillStyle = '#101F37'; ctx.beginPath(); ctx.roundRect(70, y, 940, 190, 28); ctx.fill(); ctx.strokeStyle = N.cian; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = '#176EAF'; ctx.beginPath(); ctx.arc(175, y + 95, 66, 0, TAU); ctx.fill();
   if (i === 0) { ctx.fillStyle = N.oro; ctx.beginPath(); ctx.moveTo(185, y + 40); ctx.lineTo(150, y + 102); ctx.lineTo(178, y + 102); ctx.lineTo(165, y + 150); ctx.lineTo(205, y + 84); ctx.lineTo(177, y + 84); ctx.closePath(); ctx.fill(); } else if (i === 1) { eye(ctx, 150, y + 95, 0.6, N.blanco); ear(ctx, 205, y + 92, 0.8, N.blanco); } else { ctx.strokeStyle = N.blanco; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(135, y + 70); ctx.lineTo(140, y + 140); ctx.lineTo(210, y + 140); ctx.lineTo(215, y + 70); ctx.stroke(); ctx.beginPath(); ctx.roundRect(160, y + 46, 30, 60, 6); ctx.stroke(); }
   txt(ctx, s, 600, y + 97, 40, N.blanco, { w: 800 }); ctx.restore(); });
  const d = sm(T.decadas, T.realidad18, t); if (d > 0) { ctx.save(); ctx.globalAlpha *= sm(T.decadas, T.decadas + 0.3, t); const y = 1210; ctx.strokeStyle = N.gris; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(140, y); ctx.lineTo(940, y); ctx.stroke(); ctx.strokeStyle = N.oro; ctx.beginPath(); ctx.moveTo(140, y); ctx.lineTo(lerp(140, 940, E.inOut(d)), y); ctx.stroke(); ctx.fillStyle = O.ocre; ctx.beginPath(); ctx.arc(140, y, 14, 0, TAU); ctx.fill(); ctx.fillStyle = N.cian; ctx.beginPath(); ctx.arc(lerp(140, 940, E.inOut(d)), y, 14, 0, TAU); ctx.fill(); txt(ctx, '1926', 140, y + 60, 36, O.ocre, { f: 'Fraunces', w: 700 }); ctx.globalAlpha *= sm(T.realidad18 - 0.3, T.realidad18, t); txt(ctx, 'HOY', 940, y + 60, 36, N.cian, { w: 900 }); txt(ctx, 'DÉCADAS DESPUÉS', 540, y - 50, 36, N.blanco, { w: 800 }); ctx.restore(); }
  scrimTop(ctx, 0.3); title(ctx, 'LO QUE SÍ IMAGINÓ', t, TB.b16 + 0.1, 1);
 }, sfx(k) { FX.aparece(k, T.algunas, 520); FX.aparece(k, T.funciones - 0.1, 600); FX.aparece(k, T.decadas - 0.15, 680); k.play('riser', T.decadas, { dur: T.realidad18 - T.decadas, gain: 0.25 }); FX.correcto(k, T.realidad18); } });

 // 17 · LO EXTRAORDINARIO SE VOLVIÓ COTIDIANO — Tierra nocturna con enlaces conceptuales entre ciudades
 B.push({ t0: TB.b17, t1: TB.b18, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = '#060b14'; ctx.fillRect(0, 0, W, HH); const R = H.rng(12); for (let i = 0; i < 160; i++) { ctx.fillStyle = `rgba(245,247,250,${0.2 + R() * 0.6})`; ctx.fillRect(R() * W, R() * HH, 2, 2); }
  const lon0 = lerp(-75, -35, win(t, TB.b17, TB.b18)), s0 = TB.b17 + 0.4; P.earthNight(ctx, 540, 840, 430, t, { lon0, lat0: 18, arcs: [[40.7, -74, 51.5, -0.1, s0], [4.7, -74.1, 19.4, -99.1, s0 + 0.5], [-23.5, -46.6, 40.4, -3.7, s0 + 1.0], [34, -118, 41.9, -87.6, s0 + 1.4], [-34.6, -58.4, 4.7, -74.1, s0 + 1.8], [10.5, -66.9, 25.8, -80.2, s0 + 2.2]] });
  scrimTop(ctx, 0.3); title(ctx, 'LO EXTRAORDINARIO SE VOLVIÓ COTIDIANO', t, TB.b17 + 0.1, 1, { px: 44 }); tag(ctx, 'ENLACES CONCEPTUALES · LA SEÑAL VIAJA POR REDES', 540, 1360, t, TB.b17 + 0.8, 1);
 }, sfx(k) { FX.saltoTiempo(k, TB.b17, 0.8, 0.4); for (let i = 0; i < 6; i++) FX.senalRadio(k, TB.b17 + 0.4 + i * 0.45, 1, 0.6); } });

 // 18 · CIERRE — en la pantalla del teléfono: 1926 → 2026; ASOMBROTECA
 B.push({ t0: TB.b18, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  cityNow(ctx, t, { gy: 1500 }); const ry = win(t, TB.b18 + 0.2, TB.b18 + 1.8), up = (1 - E.out(win(t, TB.b18 + 0.2, TB.b18 + 0.8))) * 1150;
  ctx.save(); ctx.translate(0, up); P.handHold(ctx, 540, 1000, 760, 'back'); P.smartphone(ctx, 540, 1000, 760, t, { glow: 1, screen: (c, x, y, w, h) => { const g = c.createLinearGradient(x, y, x, y + h); g.addColorStop(0, P.mixc('#9D7954', '#176EAF', ry)); g.addColorStop(1, P.mixc('#493627', '#0C1421', ry)); c.fillStyle = g; c.fillRect(x, y, w, h); P.yearRoll(c, x + w / 2, y + h * 0.3, 92, 1926, 2026, ry, { col: '#F5F7FA' }); c.font = '700 30px Nunito'; c.fillStyle = '#D9E9F0'; c.textAlign = 'center'; c.fillText(ry < 1 ? 'VIAJANDO EN EL TIEMPO…' : 'HOY', x + w / 2, y + h * 0.42); c.fillStyle = 'rgba(245,247,250,0.4)'; c.beginPath(); c.roundRect(x + w * 0.35, y + h * 0.95, w * 0.3, 6, 3); c.fill(); } }); P.handHold(ctx, 540, 1000, 760, 'front'); ctx.restore();
  const a = sm(T.asombroteca, T.asombroteca + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(245,247,250,0.75)'; ctx.lineWidth = 2; const lw = 280 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 230); ctx.lineTo(540 + lw, 230); ctx.moveTo(540 - lw, 350); ctx.lineTo(540 + lw, 350); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 292, 64, N.blanco, { w: 800, ls: 10 }); ctx.restore(); }
  const b = sm(T.ideas, T.ideas + 0.5, t); if (b > 0) { ctx.save(); ctx.globalAlpha *= b; txt(ctx, 'LA CIENCIA OCULTA DE LO IMPOSIBLE', 540, 400, 34, N.oro, { w: 700, ls: 3 }); ctx.restore(); }
 }, sfx(k) { FX.contador(k, TB.b18 + 0.2, TB.b18 + 1.8, 1926, 2026); FX.encender(k, TB.b18 + 1.9, 0.8); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.end + 0.6); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['1926', 'cables,', 'Tesla', 'bolsillo!', 'hablar', 'ver', 'kilómetros!', 'cien', 'inalámbricas!', 'teléfono', 'cables.', 'señales', 'distancias.', 'lejos.', 'escuchar', 'presentes!', 'pequeño', 'chaleco.', 'familiar?', 'celulares!', 'imágenes', 'sonidos', 'digital.', 'radio', 'redes', 'dispositivo.', 'sonidos.', 'smartphone', 'detalles.', 'funciones', 'décadas', 'realidad!', 'sorprendernos.', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.012, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   // 1926: piano y cuerdas (nostalgia) → descubrimiento → transición temporal → pulsos electrónicos (futuro) → resolución
   const C1 = [['D3', 'F3', 'A3', 'D4'], ['A#2', 'D3', 'F3', 'A#3'], ['G2', 'A#2', 'D3', 'G3'], ['A2', 'C#3', 'E3', 'A3']];
   const C2 = [['F2', 'A2', 'C3', 'F3'], ['C3', 'E3', 'G3', 'C4'], ['D3', 'F3', 'A3', 'D4'], ['A#2', 'D3', 'F3', 'A#3']];
   const ME = [[[0, 'A4'], [1.5, 'D5'], [3, 'F5', 1.2]], [[0, 'F5'], [1.5, 'D5'], [3, 'A#4', 1.2]], [[0, 'G4'], [1.5, 'A#4'], [3, 'D5', 1.2]], [[0, 'E5'], [2, 'C#5', 2]]];
   MUS.piano(k, 0, TB.b8, { bpm: 72, chords: C1, gain: 0.9, strings: 0.6, melody: ME });
   MUS.piano(k, TB.b8, TB.b10, { bpm: 80, chords: C2, gain: 0.85, strings: 0.9 });
   MUS.golpe(k, TB.b11, { gain: 0.5, chord: ['F3', 'C4', 'F4', 'A4'] });
   const P1 = [['F2', 'A2', 'C3', 'F3'], ['D2', 'F2', 'A2', 'D3'], ['A#1', 'D2', 'F2', 'A#2'], ['C2', 'E2', 'G2', 'C3']];
   MUS.pulso(k, TB.b11, TB.b15, { bpm: 108, chords: P1, gain: 0.9, kick: 0.5, arp: 0.8, pad: 0.7 });
   MUS.pulso(k, TB.b15, TB.b17, { bpm: 108, chords: P1, gain: 0.7, kick: 0.25, arp: 0.5, pad: 0.8 });
   MUS.piano(k, TB.b15, TB.b17, { bpm: 108, chords: P1.map((c) => c.map((n) => n.replace(/(\d)/, (d) => String(+d + 1)))), gain: 0.45, strings: 0 });
   MUS.pulso(k, TB.b17, TB.b18, { bpm: 108, chords: [['F2', 'A2', 'C3', 'F3'], ['C2', 'E2', 'G2', 'C3']], gain: 0.8, kick: 0.15, arp: 0.6, pad: 1 });
   MUS.piano(k, TB.b18, DURATION, { bpm: 66, chords: [['F2', 'A2', 'C3', 'F3'], ['C3', 'E3', 'G3', 'C4'], ['F2', 'A2', 'C3', 'F3']], gain: 0.8, strings: 1 });
   MUS.pulso(k, TB.b18, DURATION - 1.5, { bpm: 66, chords: [['F2', 'A2', 'C3', 'F3']], gain: 0.4, kick: 0, arp: 0.3, pad: 0.6 });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
