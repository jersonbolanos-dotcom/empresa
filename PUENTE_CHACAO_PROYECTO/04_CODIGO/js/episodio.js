// =====================================================================================================
// episodio.js — ¿Cómo aguanta un terremoto un puente así? (Puente de Chacao) · PLANTILLA ASOMBROTECA v2.2
// modo viral + estilo 'engineering_blueprint' para las explicaciones; el mundo real con luz y profundidad.
// Voz: ElevenLabs Eleven v4, Dan, UNA toma (990 caracteres, 59,1 s; 4 pausas de posproducción antes de las revelaciones).
// UN solo mundo: la rueda sobre la junta (fotograma 0) → [corte 1: el plano de la falla de 1960] → [corte 2: el puente real en 3D]
// → la cámara baja al mar y atraviesa la superficie hasta los pilotes → sube → el puente se vuelve plano (sin corte) y tiembla
// → vuelve a ser real → la cámara baja al carro y entra en su rueda (= fotograma 0). Sin música; el «tin» 3 veces.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const K = PL.kit(A, { lead: 0.2, tail: 1.6 }), { W, HH, TAU, cl, sm, E, lerp, wt, T, DURATION } = K;
 const S = (i) => A.segments[i].s, Se = (i) => A.segments[i].e;
 const C01 = (v) => Math.max(0, Math.min(1, v)), RO = '#ff6a5c', AMA = '#ffd23f';
 const PORTADA = typeof window !== 'undefined' && !!window.__SIN_SUBTITULOS;
 const Tk = { tresKm: wt(0, 'tres'), falla: wt(1, 'falla'), mil: wt(2, 'mil'), canal: wt(3, 'canal'), dentro: wt(3, 'dentro.'), tramos: wt(5, 'tramos.'), ciento: wt(6, 'ciento'), edificio: wt(6, 'edificio'),
  mar: wt(7, 'mar?'), noventa: wt(9, 'noventa'), catorce: wt(9, 'catorce'), trotando: wt(9, 'trotando.'), tiembla: wt(11, 'tiembla?'), apoya: wt(12, 'apoya:'), cuelga: wt(13, 'cuelga.'),
  cables: wt(14, 'cables…'), mecerse: wt(14, 'mecerse'), quebrarse: wt(14, 'quebrarse.'), ruedas: wt(15, 'ruedas…'), mecerse2: wt(15, 'mecerse'), cruzarlo: wt(16, 'cruzarlo?') };

 // ---- la piel del plano solo en las explicaciones: el mundo real lleva su propia viñeta y grano (sin fibras de papel) ----
 const PB = PL.PIELES.engineering_blueprint, ACAB = PB.acabado; let PLANO = 0;
 PB.acabado = (ctx, t, o) => { if (PLANO > 0.5) ACAB(ctx, t, o); else { P.vineta(ctx, 0.5); P.grano(ctx, t, 0.045); } };
 const pl = () => PL.piel();

 // =================================================================================================
 // 1 · LA RUEDA SOBRE LA JUNTA DE DILATACIÓN (fotograma 0 y último plano). tl = tiempo local (0 en el fotograma 0)
 // =================================================================================================
 const rueda = (ctx, tl, o = {}) => { const fr = Math.round(tl * 30), R = H.rng(1000 + ((fr % 997) + 997) % 997), vib = o.vib ?? 1;
  const sx = (R() - 0.5) * 14 * vib, sy = (R() - 0.5) * 10 * vib, z = 1 + 0.035 * Math.sin(tl * 0.9) + (o.zoom || 0), rot = 0.012 * Math.sin(tl * 1.7) * vib + (o.mece || 0);
  // cielo y mar a contraluz (lejos, sin vibración)
  const g = ctx.createLinearGradient(0, 0, 0, 1500); g.addColorStop(0, '#1d2a4a'); g.addColorStop(0.32, '#c97a4a'); g.addColorStop(0.42, '#ffd08a'); g.addColorStop(0.43, '#8a6a5a'); g.addColorStop(0.62, '#2b3550'); g.addColorStop(1, '#0d1424'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  P.resplandor(ctx, 860, 640, 900, '255,200,130', 0.75); P.resplandor(ctx, 860, 640, 160, '255,245,220', 0.95);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R2 = H.rng(77); for (let i = 0; i < 160; i++) { const y = 680 + Math.pow(R2(), 1.6) * 760, x = 860 + (R2() - 0.5) * (120 + (y - 660) * 1.1), a = 0.5 * (0.4 + 0.6 * Math.abs(Math.sin(tl * 3 + i))) * (1 - (y - 680) / 900); ctx.fillStyle = `rgba(255,220,160,${a})`; ctx.fillRect(x, y, 10 + R2() * 26, 2); } ctx.restore();
  // la barandilla y una péndola (siluetas desenfocadas, detrás)
  P.capaDesenfoque(ctx, 6, (c) => { c.fillStyle = '#0a0d16'; c.fillRect(0, 1010, W, 16); c.fillRect(0, 1090, W, 10); for (let x = -40; x < W + 80; x += 150) c.fillRect(x, 1000, 14, 220); c.fillRect(300, 0, 9, 1010); });
  ctx.save(); ctx.translate(540 + sx, 1100 + sy); ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-540, -1100);
  // el tablero (asfalto) y la junta de dilatación de dientes de acero
  const ga = ctx.createLinearGradient(0, 1380, 0, HH); ga.addColorStop(0, '#2a2a30'); ga.addColorStop(1, '#141418'); ctx.fillStyle = ga; ctx.fillRect(-200, 1380, W + 400, 800);
  const R3 = H.rng(5); for (let i = 0; i < 700; i++) { ctx.fillStyle = R3() < 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.25)'; ctx.fillRect(-200 + R3() * 1480, 1380 + R3() * 560, 2 + R3() * 5, 2 + R3() * 4); }
  ctx.fillStyle = 'rgba(255,200,130,0.16)'; ctx.fillRect(-200, 1380, W + 400, 10);
  const jy = 1440, jh = 120; ctx.fillStyle = '#3b4048'; ctx.fillRect(-200, jy, W + 400, jh); const gj = ctx.createLinearGradient(0, jy, 0, jy + jh); gj.addColorStop(0, '#9aa3ad'); gj.addColorStop(0.5, '#4a515a'); gj.addColorStop(1, '#23272d'); ctx.fillStyle = gj;
  for (let x = -200; x < W + 200; x += 46) { ctx.beginPath(); ctx.moveTo(x, jy); ctx.lineTo(x + 30, jy); ctx.lineTo(x + 24, jy + jh * 0.62); ctx.lineTo(x + 6, jy + jh * 0.62); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + 23, jy + jh); ctx.lineTo(x + 53, jy + jh); ctx.lineTo(x + 47, jy + jh * 0.38); ctx.lineTo(x + 29, jy + jh * 0.38); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,215,150,0.5)'; ctx.fillRect(-200, jy, W + 400, 3);
  // la sombra de la rueda en el asfalto
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.ellipse(540, 1432, 470, 40, 0, 0, TAU); ctx.fill();
  // la rueda (neumático + llanta que gira)
  const cx = 540, cy = 980, r = 450, ang = tl * 9;
  ctx.fillStyle = '#121214'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.arc(cx, cy, r - 46, 0, TAU, true); ctx.clip(); ctx.fillStyle = '#26262a'; for (let k = 0; k < 44; k++) { const a = ang + (k / 44) * TAU; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.fillRect(r - 46, -13, 50, 26); ctx.restore(); } ctx.restore();
  const gs = ctx.createRadialGradient(cx, cy, r * 0.62, cx, cy, r - 40); gs.addColorStop(0, '#1b1b1f'); gs.addColorStop(0.7, '#2a2a2f'); gs.addColorStop(1, '#151517'); ctx.fillStyle = gs; ctx.beginPath(); ctx.arc(cx, cy, r - 46, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(cx, cy, r - 70 - k * 22, 0, TAU); ctx.stroke(); }
  const gl = ctx.createRadialGradient(cx - 60, cy - 80, 20, cx, cy, 270); gl.addColorStop(0, '#d9dde3'); gl.addColorStop(0.55, '#8b939c'); gl.addColorStop(1, '#3a3f46'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(cx, cy, 270, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1a1c20'; for (let k = 0; k < 5; k++) { const a = ang + (k / 5) * TAU; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(70, -40); ctx.quadraticCurveTo(170, -78, 245, -46); ctx.lineTo(245, 46); ctx.quadraticCurveTo(170, 78, 70, 40); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#9aa1aa'; ctx.beginPath(); ctx.arc(cx, cy, 70, 0, TAU); ctx.fill(); ctx.fillStyle = '#2b2f35'; for (let k = 0; k < 5; k++) { const a = ang + (k / 5) * TAU + 0.6; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * 42, cy + Math.sin(a) * 42, 9, 0, TAU); ctx.fill(); }
  // luz de contorno del sol (contraluz) en el borde derecho del neumático
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip(); const gr = ctx.createRadialGradient(cx + r * 0.9, cy - r * 0.5, 10, cx + r * 0.9, cy - r * 0.5, r * 0.9); gr.addColorStop(0, 'rgba(255,190,110,0.55)'); gr.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = gr; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); ctx.restore();
  ctx.strokeStyle = 'rgba(255,200,130,0.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r - 3, -1.25, 0.35); ctx.stroke();
  // el guardabarros y la carrocería (arriba, oscuros)
  ctx.fillStyle = '#5a0f12'; ctx.beginPath(); ctx.moveTo(-200, 300); ctx.lineTo(W + 200, 300); ctx.lineTo(W + 200, 520); ctx.lineTo(cx + r + 70, 520); ctx.arc(cx, cy, r + 70, -0.12, Math.PI + 0.12, true); ctx.lineTo(-200, 520); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,170,120,0.5)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, r + 70, -0.5, -Math.PI * 0.5, true); ctx.stroke(); ctx.fillStyle = 'rgba(255,190,140,0.25)'; ctx.fillRect(-200, 470, W + 400, 6);
  ctx.restore();
  // el polvo que salta de la junta (va con la vibración)
  P.particulas(ctx, tl + 50, { tipo: 'chispas', n: 46 * vib, area: [80, 1380, 1000, 1500], a: 0.55 * vib, col: '220,190,150', tam: 4, seed: 12 });
 };

 // =================================================================================================
 // 2 · EL PLANO DE LA FALLA DE 1960 (piel engineering_blueprint) — mapa esquemático del sur de Chile
 // =================================================================================================
 const MP = (lat, lon) => [140 + (lon + 76) * 165, 720 + (-37 - lat) * 100];
 const COSTA = [[-36.6, -73.1], [-37.2, -73.6], [-37.6, -73.66], [-38.0, -73.5], [-38.6, -73.48], [-39.4, -73.22], [-39.9, -73.42], [-40.5, -73.76], [-41.0, -73.9], [-41.55, -73.82], [-41.76, -73.6], [-41.78, -73.2], [-41.5, -72.95], [-41.85, -72.6], [-42.4, -72.75], [-43.2, -72.85], [-44.0, -73.05], [-44.8, -73.4], [-45.6, -73.9], [-46.2, -74.6], [-46.55, -75.45], [-46.9, -75.6], [-47.6, -74.9]];
 const TIERRA = COSTA.concat([[-49, -74.9], [-49, -66], [-33, -66], [-33, -72.6], [-36.6, -73.1]]).map((q) => MP(q[0], q[1]));
 const CHILOE = [[-41.84, -73.98], [-41.86, -73.55], [-42.1, -73.4], [-42.6, -73.65], [-43.1, -73.55], [-43.42, -73.85], [-43.3, -74.3], [-42.7, -74.2], [-42.2, -74.15]].map((q) => MP(q[0], q[1]));
 const RUPTURA = [[-37.9, -74.3], [-37.9, -73.4], [-40.0, -73.1], [-42.0, -73.3], [-44.5, -74.0], [-46.5, -75.2], [-46.5, -76.0], [-44.3, -75.4], [-41.9, -74.9], [-39.7, -74.6]].map((q) => MP(q[0], q[1]));
 const CHACAO = MP(-41.79, -73.52), EPI = MP(-38.14, -73.41);
 const nota = (ctx, s, x, y, o = {}) => { ctx.save(); ctx.font = `600 ${o.px || 34}px "IBM Plex Mono", monospace`; ctx.textAlign = o.al || 'left'; ctx.textBaseline = 'middle'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(8,30,70,0.85)'; ctx.globalAlpha *= o.a ?? 1; ctx.strokeText(s, x, y); ctx.fillStyle = o.col || '#eaf3ff'; ctx.fillText(s, x, y); ctx.restore(); };
 const mapa = (ctx, t) => { const L = pl(); L.fondo(ctx, t);
  const z = lerp(1.0, 1.9, E.inOut(sm(Tk.canal - 0.6, S(4) + 0.3, t))), cx = lerp(540, CHACAO[0], E.inOut(sm(Tk.canal - 0.6, S(4), t))), cy = lerp(1150 + 30 * Math.sin(t * 0.5), CHACAO[1] + 80, E.inOut(sm(Tk.canal - 0.6, S(4), t)));
  ctx.save(); ctx.translate(540, 1150); ctx.scale(z, z); ctx.translate(-cx, -cy - (z - 1) * 60); const d0 = S(2) + 0.1;
  L.forma(ctx, { tipo: 'poli', pts: TIERRA }, { rol: 'objeto', t }); L.forma(ctx, { tipo: 'poli', pts: CHILOE }, { rol: 'objeto', t }); nota(ctx, 'OCÉANO PACÍFICO', MP(0, -75.6)[0], MP(-40.2, 0)[1], { px: 30, a: 0.55 });
  // la ruptura de 1960: se dibuja de norte a sur mientras la voz dice «se rompió a lo largo de mil kilómetros»
  const pr = E.inOut(sm(d0 + 0.3, Tk.mil + 0.9, t)); if (pr > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-500, 0, 2200, MP(-37.9, 0)[1] + (MP(-46.6, 0)[1] - MP(-37.9, 0)[1]) * pr); ctx.clip(); L.forma(ctx, { tipo: 'poli', pts: RUPTURA }, { rol: 'sombra', t }); L.linea(ctx, RUPTURA.concat([RUPTURA[0]]), { rol: 'rojo', ancho: 6, t }); ctx.restore(); }
  // cota de la ruptura (1.000 km) a la izquierda
  const xa = MP(0, -75.9)[0] - 40, ya = MP(-37.9, 0)[1], yb = MP(-46.5, 0)[1]; if (pr > 0) L.linea(ctx, [[xa, ya], [xa, lerp(ya, yb, pr)]], { cota: pr > 0.98, ancho: 3, t });
  const ae = C01((t - d0) / 0.5); if (ae > 0) { ctx.save(); ctx.globalAlpha = ae; L.brillo(ctx, EPI[0], EPI[1], 16, { t }); nota(ctx, '1960 · M 9,5', EPI[0] + 50, EPI[1] - 6, { px: 32 }); ctx.restore(); }
  nota(ctx, 'ARAUCO', MP(0, -73.3)[0] + 40, ya + 70, { px: 32, a: 0.85 }); nota(ctx, 'TAITAO', MP(0, -75.2)[0] + 70, yb + 10, { px: 32, a: 0.85 * C01((t - Tk.mil) / 0.6) });
  const ac = C01((t - Tk.canal + 0.3) / 0.4); if (ac > 0) { ctx.save(); ctx.globalAlpha = ac; const pul = 1 + 0.25 * Math.sin(t * 6); L.brillo(ctx, CHACAO[0], CHACAO[1], 14 * pul, { t }); ctx.restore(); nota(ctx, 'CANAL DE CHACAO', CHACAO[0] + 46, CHACAO[1] - 26, { px: 32, a: ac, col: '#fff2b8' }); nota(ctx, 'CHILOÉ', MP(0, -74.0)[0] + 40, MP(-42.7, 0)[1], { px: 30, a: ac * 0.85 }); }
  ctx.restore();
  nota(ctx, 'ESQUEMA · FALLA DE 1960', 80, 1640, { px: 32, a: 0.8 });
 };

 // =================================================================================================
 // 3 · EL PUENTE EN 3D (metros). X a lo largo del puente (pila sur = 0, hacia el norte +), Y arriba, Z de lado.
 //     Pilas: sur 157 m (X 0), central 175 m (X 1.055), norte 199 m (X 2.210). Tableros colgantes de 1.055 y 1.155 m.
 // =================================================================================================
 const TORRES = [{ x: 0, h: 157, mar: false }, { x: 1055, h: 175, mar: true }, { x: 2210, h: 199, mar: true }], ANC = [-250, 2500], YD = 55, ZC = 13;
 const SOL = (() => { const v = [-0.25, 0.1, 1]; const n = Math.hypot(...v); return v.map((q) => q / n); })();
 const cam3 = (p, tg, f) => { const dx = tg[0] - p[0], dy = tg[1] - p[1], dz = tg[2] - p[2], yaw = Math.atan2(dx, dz), pit = Math.atan2(dy, Math.hypot(dx, dz)); return { p, yaw, pit, f, cy: Math.cos(yaw), sy: Math.sin(yaw), cp: Math.cos(pit), sp: Math.sin(pit) }; };
 const pr3 = (c, q) => { const dx = q[0] - c.p[0], dy = q[1] - c.p[1], dz = q[2] - c.p[2], xr = dx * c.cy - dz * c.sy, zf = dx * c.sy + dz * c.cy, yc = dy * c.cp - zf * c.sp, zc = dy * c.sp + zf * c.cp; return zc < 1 ? null : [540 + (c.f * xr) / zc, 960 - (c.f * yc) / zc, zc]; };
 const camino3 = (t, Kf) => { if (t <= Kf[0][0]) return Kf[0].slice(1); for (let i = 0; i < Kf.length - 1; i++) { const a = Kf[i], b = Kf[i + 1]; if (t < b[0]) { const u = E.inOut(C01((t - a[0]) / (b[0] - a[0]))); return a.slice(1).map((v, k) => lerp(v, b[k + 1], u)); } } return Kf[Kf.length - 1].slice(1); };
 // el cable principal: catenaria aproximada (parábola) entre apoyos; mínimo cerca del tablero
 const cableY = (x) => { const tramo = (xa, ya, xb, yb, ymin) => { const u = (x - xa) / (xb - xa), s = (ya + yb) / 2 - ymin; return ya + (yb - ya) * u - 4 * s * u * (1 - u); };
  if (x < 0) return tramo(ANC[0], YD + 6, 0, 157, YD + 2); if (x < 1055) return tramo(0, 157, 1055, 175, YD + 4); if (x < 2210) return tramo(1055, 175, 2210, 199, YD + 4); return tramo(2210, 199, ANC[1], YD + 6, YD + 2); };
 const carX = (t) => 380 + 21 * t;   // el carro avanza a ~75 km/h por el tablero
 // sismo: s = intensidad (0..1); el suelo se desplaza en X; el tablero colgado se mece con retraso
 const sismoDX = (t, s) => (s ? { suelo: s * 9 * Math.sin(t * TAU * 1.4) + s * 4 * Math.sin(t * TAU * 2.3 + 1), tablero: s * 14 * Math.sin(t * TAU * 0.45 - 1.2) } : { suelo: 0, tablero: 0 });
 const poli = (ctx, pts) => { if (pts.some((q) => !q)) return false; ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); return true; };
 const trazo3 = (ctx, c, pts) => { let on = false; ctx.beginPath(); for (const q of pts) { const s = pr3(c, q); if (!s) { on = false; continue; } on ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); on = true; } };
 // dibuja el puente; m = 'real' (luz, color) o 'plano' (líneas blancas de la piel)
 const puente = (ctx, c, t, m, o = {}) => { const sd = sismoDX(t, o.sismo || 0), L = pl(), plano = m === 'plano';
  const ink = (w, col) => { if (plano) { ctx.save(); ctx.strokeStyle = 'rgba(220,235,255,0.16)'; ctx.lineWidth = w * 3; ctx.stroke(); ctx.restore(); ctx.strokeStyle = col || 'rgba(235,244,255,0.95)'; ctx.lineWidth = w; ctx.stroke(); } };
  const xs = []; for (let x = ANC[0]; x <= ANC[1]; x += 20) xs.push(x);
  // pilotes y encepados (solo se ven bajo el agua o en el plano)
  // el tablero (cajón de acero): cara lateral + cara superior
  const dx = sd.tablero; const borde = (z, y) => xs.map((x) => [x + dx, y, z]);
  for (const z of [-12, 12]) { const top = borde(z, YD), bot = borde(z, YD - 4.5); for (let i = 0; i < xs.length - 1; i++) { const q = [pr3(c, top[i]), pr3(c, top[i + 1]), pr3(c, bot[i + 1]), pr3(c, bot[i])]; if (!poli(ctx, q)) continue; if (plano) ink(1.2, 'rgba(235,244,255,0.5)'); else { ctx.fillStyle = z < 0 ? '#3d4654' : '#2a313c'; ctx.fill(); } } }
  if (!plano && c.p[1] > YD) { for (let i = 0; i < xs.length - 1; i++) { const q = [pr3(c, [xs[i] + dx, YD, -12]), pr3(c, [xs[i + 1] + dx, YD, -12]), pr3(c, [xs[i + 1] + dx, YD, 12]), pr3(c, [xs[i] + dx, YD, 12])]; if (!poli(ctx, q)) continue; ctx.fillStyle = '#4b5260'; ctx.fill(); } ctx.strokeStyle = 'rgba(255,230,170,0.5)'; ctx.lineWidth = 1.5; for (const z of [-0.3, 0.3]) { ctx.setLineDash([18, 22]); trazo3(ctx, c, xs.map((x) => [x + dx, YD + 0.05, z])); ctx.stroke(); } ctx.setLineDash([]); }
  if (plano) { trazo3(ctx, c, borde(-12, YD)); ink(3); trazo3(ctx, c, borde(-12, YD - 4.5)); ink(3); }
  else { ctx.strokeStyle = 'rgba(255,214,150,0.55)'; ctx.lineWidth = 2; trazo3(ctx, c, borde(-12, YD)); ctx.stroke(); }
  // el carro (rojo) sobre el tablero
  if (o.carro !== false) { const cxw = carX(t) + dx, box = [[0, 0], [4.6, 0], [4.6, 1.5], [3.4, 1.5], [2.8, 2.6], [1.2, 2.6], [0.6, 1.5], [0, 1.5]].map((q) => pr3(c, [cxw + q[0], YD + q[1], -5])); if (poli(ctx, box)) { if (plano) ink(2); else { ctx.fillStyle = '#8a1a1e'; ctx.fill(); ctx.strokeStyle = 'rgba(255,190,140,0.6)'; ctx.lineWidth = 1.5; ctx.stroke(); } } }
  // torres
  TORRES.forEach((tr, k) => { const bx = tr.x + sd.suelo, tx = tr.x + sd.suelo * 1.15, h = tr.h;
   for (const z of [-ZC, ZC]) { const zl = z * 1.08, zt = z * 0.92, w = 6.5; const q = [pr3(c, [bx - w, 0, zl]), pr3(c, [bx + w, 0, zl]), pr3(c, [tx + w * 0.8, h, zt]), pr3(c, [tx - w * 0.8, h, zt])]; if (!poli(ctx, q)) continue;
    if (plano) { ctx.fillStyle = 'rgba(220,235,255,0.07)'; ctx.fill(); ink(3); } else { const gx = ctx.createLinearGradient(q[0][0], 0, q[1][0], 0); gx.addColorStop(0, '#7f8590'); gx.addColorStop(0.5, '#c9c3b8'); gx.addColorStop(1, '#585e69'); ctx.fillStyle = gx; ctx.fill(); ctx.fillStyle = 'rgba(255,200,130,0.18)'; ctx.fill(); } }
   for (const yb of [YD - 6, h * 0.62, h - 7]) { const f = yb / h, xb = lerp(bx, tx, f), zz = lerp(ZC * 1.08, ZC * 0.92, f); const q = [pr3(c, [xb - 3, yb, -zz]), pr3(c, [xb - 3, yb, zz]), pr3(c, [xb - 3, yb - 5, zz]), pr3(c, [xb - 3, yb - 5, -zz])]; if (!poli(ctx, q)) continue; if (plano) ink(2); else { ctx.fillStyle = '#8c8f96'; ctx.fill(); } }
   if (tr.mar && (plano || o.encepado)) { const q = [pr3(c, [bx - 24, 6, -24]), pr3(c, [bx + 24, 6, -24]), pr3(c, [bx + 24, -3, -24]), pr3(c, [bx - 24, -3, -24])]; if (poli(ctx, q)) { if (plano) ink(2); else { ctx.fillStyle = '#6d6a64'; ctx.fill(); } } }
  });
  // cables principales y péndolas
  for (const z of [-ZC, ZC]) { const pts = xs.map((x) => { const tdx = x < -5 || x > 2215 ? 0 : sd.suelo * 1.15; return [x + tdx, cableY(x), z]; });
   trazo3(ctx, c, pts); if (plano) ink(z < 0 ? 3.5 : 2, o.acentoCable ? '#fff2b8' : undefined); else { ctx.strokeStyle = z < 0 ? '#dcd6cc' : '#9fa4ab'; ctx.lineWidth = Math.max(1.5, 900 / Math.max(200, Math.hypot(c.p[0] - 1100, c.p[2]))); ctx.stroke(); }
   if (z < 0 || plano) for (let x = 10; x < 2200; x += 30) { if (Math.abs(x - 1055) < 12) continue; const a = pr3(c, [x + sd.suelo * 1.15, cableY(x), z]), b = pr3(c, [x + dx, YD, z]); if (!a || !b) continue; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); if (plano) ink(1.4, o.acentoPend ? `rgba(255,242,184,${0.6 + 0.4 * o.acentoPend})` : 'rgba(235,244,255,0.7)'); else { ctx.strokeStyle = 'rgba(200,200,205,0.55)'; ctx.lineWidth = 1; ctx.stroke(); } } }
 };
 // cielo, mar con brillo del sol y montes en el horizonte (Chiloé al sur, el continente al norte)
 const cielo = (ctx, c, t) => { const hy = 960 + c.f * Math.tan(c.pit), s = pr3(c, [c.p[0] + SOL[0] * 1e6, c.p[1] + SOL[1] * 1e6, c.p[2] + SOL[2] * 1e6]);
  const g = ctx.createLinearGradient(0, hy - 1400, 0, hy); g.addColorStop(0, '#16213d'); g.addColorStop(0.55, '#a8603f'); g.addColorStop(0.92, '#f2b277'); g.addColorStop(1, '#ffd9a0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Math.max(0, hy) + 2);
  if (s) { P.resplandor(ctx, s[0], s[1], 1000, '255,190,120', 0.7); P.resplandor(ctx, s[0], s[1], 120, '255,245,220', 1); }
  // montes (silueta por azimut)
  ctx.fillStyle = '#2a2638'; ctx.beginPath(); ctx.moveTo(0, hy); for (let px = 0; px <= W; px += 12) { const az = c.yaw + Math.atan((px - 540) / c.f), lado = Math.abs(Math.sin(az)), hm = (lado > 0.35 ? 60 + 140 * (lado - 0.35) : 0) * (0.7 + 0.3 * Math.sin(az * 9) + 0.15 * Math.sin(az * 23)); ctx.lineTo(px, hy - (hm * c.f) / 9000); } ctx.lineTo(W, hy); ctx.closePath(); ctx.fill();
  const gm = ctx.createLinearGradient(0, hy, 0, HH); gm.addColorStop(0, '#8d6a63'); gm.addColorStop(0.08, '#3b4766'); gm.addColorStop(1, '#0b1220'); ctx.fillStyle = gm; ctx.fillRect(0, Math.max(0, hy), W, HH);
  if (s && s[1] < hy + 40) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = H.rng(31); for (let i = 0; i < 220; i++) { const yy = hy + 4 + Math.pow(R(), 1.8) * (HH - hy), xx = s[0] + (R() - 0.5) * (40 + (yy - hy) * 0.9), a = 0.55 * (0.3 + 0.7 * Math.abs(Math.sin(t * 2.4 + i * 1.7))) * (1 - (yy - hy) / (HH - hy + 1)); ctx.fillStyle = `rgba(255,214,150,${a})`; ctx.fillRect(xx, yy, 6 + R() * 24 * (1 + (yy - hy) / 600), 2); } ctx.restore(); }
  // olas: rayas del agua que corren con la corriente
  ctx.strokeStyle = 'rgba(200,215,240,0.12)'; ctx.lineWidth = 2; const R2 = H.rng(8); for (let i = 0; i < 90; i++) { const wx = c.p[0] + (R2() - 0.5) * 3000 + ((t * 4) % 60), wz = c.p[2] + 40 + R2() * 2400, a = pr3(c, [wx, 0, wz]), b = pr3(c, [wx + 18, 0, wz]); if (a && b && a[1] > hy) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
 };
 // keyframes de cámara del mundo [t, px, py, pz, tx, ty, tz, f]
 const CAM = () => [
  [S(4) - 0.2, 985, 22, -150, 1060, 110, 0, 950], [S(5) - 0.2, 940, 40, -210, 1080, 150, 40, 950],
  [S(5) + 0.4, -330, 95, -75, 1300, 125, 15, 1250], [Se(5), -260, 90, -70, 1400, 125, 15, 1250],
  [S(6) + 0.3, 2075, 20, -300, 2210, 95, 0, 1000], [Se(6) - 0.3, 2095, 12, -280, 2210, 105, 0, 1000],
  [S(7) + 0.2, 2120, 30, -220, 2200, 10, -10, 1000], [Se(7) + 0.5, 2170, 8, -120, 2205, -5, -14, 1000],
  [S(10) - 0.4, 2120, 12, -300, 2160, 60, 0, 950], [Se(11), 1900, 70, -700, 2100, 90, 0, 950],
  [S(12) - 0.2, 1930, 80, -560, 1930, 80, 0, 1000], [Se(14), 1960, 80, -540, 1960, 80, 0, 1000],
  [S(15) + 0.2, 1500, 90, -460, 1700, 70, 0, 1000], [S(15) + 2.6, carX(S(15) + 2.6) - 14, YD + 6, -16, carX(S(15) + 2.6) + 2, YD + 1, -5, 1000], [S(15) + 3.4, carX(S(15) + 3.4) - 4, YD + 2.5, -8, carX(S(15) + 3.4) + 1, YD + 0.4, -5, 1000]];
 let CAMK = null; const camMundo = (t) => { CAMK = CAMK || CAM(); const v = camino3(t, CAMK); return cam3([v[0], v[1], v[2]], [v[3], v[4], v[5]], v[6]); };
 const SISMO = (t) => C01((t - Tk.cuelga) / 1.0) * (1 - C01((t - Se(14) - 0.2) / 0.8));
 const mundoReal = (ctx, t, o = {}) => { const c = o.cam || camMundo(t); cielo(ctx, c, t); P.capaDesenfoque(ctx, 0, (g) => puente(g, c, t, 'real', { sismo: o.sismo || 0, encepado: true }));
  if (!o.cam) cotaTorre(ctx, t, c, C01((t - Tk.ciento + 0.4) / 0.5) * (1 - C01((t - Se(6) + 0.1) / 0.3))); P.particulas(ctx, t, { tipo: 'polvo', n: 40, a: 0.3, col: '255,220,170', seed: 5 }); };
 const cotaTorre = (ctx, t, c, a) => { if (a <= 0) return; const b = pr3(c, [2210, 0, -16]), tp = pr3(c, [2210, 199, -16]); if (!b || !tp) return; const L = pl(), x = b[0] + 120, h = b[1] - tp[1];
  ctx.save(); ctx.globalAlpha = a; L.linea(ctx, [[x, b[1]], [x, lerp(b[1], tp[1], E.out(C01(a * 1.2)))]], { cota: a > 0.95, ancho: 4, t }); L.linea(ctx, [[b[0] + 40, tp[1]], [x + 30, tp[1]]], { ancho: 2, t }); L.linea(ctx, [[b[0] + 40, b[1]], [x + 30, b[1]]], { ancho: 2, t });
  const ae = C01((t - Tk.edificio + 0.2) / 0.5); if (ae > 0) { const bw = 150, bx = b[0] - 300; ctx.globalAlpha = a * ae; ctx.fillStyle = 'rgba(18,59,122,0.55)'; ctx.fillRect(bx, b[1] - h, bw, h); ctx.strokeStyle = 'rgba(235,244,255,0.95)'; ctx.lineWidth = 4; ctx.strokeRect(bx, b[1] - h, bw, h); ctx.strokeStyle = 'rgba(235,244,255,0.55)'; ctx.lineWidth = 1.5; for (let k = 1; k < 65; k++) { const y = b[1] - (h * k) / 65; ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx + (k % 5 ? bw * 0.35 : bw), y); ctx.stroke(); } nota(ctx, '65 PISOS', bx + bw / 2, b[1] + 40, { px: 32, al: 'center', a: 1 }); }
  ctx.restore(); };
 const mundoPlano = (ctx, t, o = {}) => { const c = o.cam || camMundo(t), L = pl(); L.fondo(ctx, t);
  // el agua y el fondo del mar en el plano (línea de agua punteada)
  const hy = 960 + c.f * Math.tan(c.pit); const a0 = pr3(c, [c.p[0] - 3000, 0, 0]), b0 = pr3(c, [c.p[0] + 3000, 0, 0]); if (a0 && b0) L.linea(ctx, [[a0[0], a0[1]], [b0[0], b0[1]]], { punteada: true, ancho: 2, t });
  const fy = pr3(c, [c.p[0], -35, 0]); if (fy) { ctx.save(); ctx.strokeStyle = 'rgba(235,244,255,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, fy[1]); ctx.lineTo(W, fy[1]); ctx.stroke(); ctx.restore(); L.forma(ctx, { tipo: 'rect', x: -20, y: fy[1], w: W + 40, h: 400 }, { rol: 'sombra', t }); }
  const sdp = sismoDX(t, o.sismo || 0); for (const tx of [1055, 2210]) for (let k = -2; k <= 2; k++) { const a = pr3(c, [tx + sdp.suelo + k * 9, -3, -24]), b = pr3(c, [tx + sdp.suelo + k * 9, -93, -24]); if (a && b) L.linea(ctx, [[a[0], a[1]], [b[0], b[1]]], { ancho: 2.5, t }); }
  puente(ctx, c, t, 'plano', { sismo: o.sismo || 0, carro: false, acentoPend: o.acentoPend, acentoCable: o.acentoCable });
  // columnas que NO tiene (el «se apoya»), punteadas y tachadas en rojo
  if (o.columnas > 0) { ctx.save(); ctx.globalAlpha = o.columnas; for (let x = 1350; x <= 2100; x += 150) { const a = pr3(c, [x, YD - 4.5, -12]), b = pr3(c, [x, -30, -12]); if (!a || !b) continue; L.linea(ctx, [[a[0], a[1]], [b[0], b[1]]], { punteada: true, ancho: 3, t }); } if (o.tache > 0) { const p1 = pr3(c, [1330, YD - 10, -12]), p2 = pr3(c, [2120, -30, -12]), p3 = pr3(c, [2120, YD - 10, -12]), p4 = pr3(c, [1330, -30, -12]); if (p1 && p2) { L.linea(ctx, [[p1[0], p1[1]], [p2[0], p2[1]]], { rol: 'rojo', ancho: 7, p: C01(o.tache * 2), t }); L.linea(ctx, [[p3[0], p3[1]], [p4[0], p4[1]]], { rol: 'rojo', ancho: 7, p: C01(o.tache * 2 - 1), t }); } } ctx.restore(); }
 };
 // la sección del tablero: cajón de acero aerodinámico (recuadro del plano)
 const seccion = (ctx, t, a) => { if (a <= 0) return; const L = pl(), x = 540, y = 1250, s = 13; ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(8,30,70,0.7)'; ctx.fillRect(110, 1060, 860, 360); ctx.strokeStyle = 'rgba(235,244,255,0.8)'; ctx.lineWidth = 3; ctx.strokeRect(110, 1060, 860, 360);
  L.forma(ctx, { tipo: 'poli', pts: [[x - 26 * s, y], [x - 30 * s, y - 2 * s], [x + 30 * s, y - 2 * s], [x + 26 * s, y], [x + 18 * s, y + 4 * s], [x - 18 * s, y + 4 * s]].map((q) => [q[0], q[1] - 20]) }, { rol: 'objeto2', t });
  L.linea(ctx, [[x - 30 * s, y - 2 * s - 60], [x - 30 * s, y - 2 * s - 20]], { ancho: 2, t }); L.linea(ctx, [[x + 30 * s, y - 2 * s - 60], [x + 30 * s, y - 2 * s - 20]], { ancho: 2, t });
  nota(ctx, 'TABLERO: CAJÓN DE ACERO', x, 1110, { px: 34, al: 'center', col: '#fff2b8' }); nota(ctx, 'colgado de las péndolas', x, 1370, { px: 32, al: 'center', a: 0.85 }); ctx.restore(); };

 // =================================================================================================
 // 4 · BAJO EL AGUA: el encepado de la pila norte, los pilotes y la corriente
 // =================================================================================================
 const bajoAgua = (ctx, t) => { const u = C01((t - S(8)) / (S(10) - S(8))), py = lerp(-120, 260, E.inOut(u)) + 20 * Math.sin(t * 0.7), sc = lerp(1.08, 0.9, u);
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#1d5c7a'); g.addColorStop(0.4, '#0d3350'); g.addColorStop(1, '#040f1e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 120 + i * 180 + 40 * Math.sin(t * 0.5 + i); const gr = ctx.createLinearGradient(x, 0, x + 140, 1400); gr.addColorStop(0, 'rgba(140,210,240,0.16)'); gr.addColorStop(1, 'rgba(140,210,240,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 70, 0); ctx.lineTo(x + 260, 1500); ctx.lineTo(x + 120, 1500); ctx.closePath(); ctx.fill(); } ctx.restore();
  ctx.save(); ctx.translate(540, 960); ctx.scale(sc, sc); ctx.translate(-540, -960 - py);
  // escala: 1 m = 13 px. superficie y = 200; encepado 200..330; fondo marino a 30 m (y 590); punta de los pilotes a 90 m bajo el encepado
  const m = 13, ys = 200, ye = 330, yf = ys + 30 * m + 100, yp = ye + 90 * m;
  ctx.fillStyle = 'rgba(200,235,255,0.35)'; ctx.fillRect(-400, ys - 4, 1900, 4);
  // fondo marino (corte con estratos)
  const gf = ctx.createLinearGradient(0, yf, 0, yp + 200); gf.addColorStop(0, '#4a4234'); gf.addColorStop(0.3, '#33302a'); gf.addColorStop(1, '#1b1a18'); ctx.fillStyle = gf; ctx.beginPath(); ctx.moveTo(-400, yf + 20); for (let x = -400; x <= 1500; x += 40) ctx.lineTo(x, yf + 14 * Math.sin(x * 0.01) + 8 * Math.sin(x * 0.037)); ctx.lineTo(1500, yp + 400); ctx.lineTo(-400, yp + 400); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 3; for (let k = 1; k < 6; k++) { ctx.beginPath(); for (let x = -400; x <= 1500; x += 40) ctx.lineTo(x, yf + k * 150 + 20 * Math.sin(x * 0.006 + k)); ctx.stroke(); }
  // la pata de la torre que baja hasta el encepado
  const gt = ctx.createLinearGradient(380, 0, 700, 0); gt.addColorStop(0, '#3e5566'); gt.addColorStop(0.5, '#7d93a0'); gt.addColorStop(1, '#2c3d4a'); ctx.fillStyle = gt; ctx.fillRect(400, -900, 280, ys + 902 - 902 + 900); ctx.fillRect(400, -900, 280, 1100);
  // encepado
  const ge = ctx.createLinearGradient(0, ys, 0, ye); ge.addColorStop(0, '#8aa1ad'); ge.addColorStop(1, '#3a4d59'); ctx.fillStyle = ge; ctx.fillRect(120, ys - 20, 840, ye - ys + 20);
  // pilotes (2,65 m de diámetro) hasta 90 m
  for (let k = 0; k < 6; k++) { const x = 170 + k * 148, w = 2.65 * m * 1.6; const gp = ctx.createLinearGradient(x, 0, x + w, 0); gp.addColorStop(0, '#2c3b45'); gp.addColorStop(0.45, '#8399a4'); gp.addColorStop(1, '#22303a'); ctx.fillStyle = gp; ctx.fillRect(x, ye, w, yp - ye); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x, yf, w, yp - yf); }
  // cota de 90 m (piel del plano: línea blanca con flechas)
  const L = pl(); const ac = C01((t - Tk.noventa + 0.4) / 0.5); if (ac > 0) { ctx.save(); ctx.globalAlpha = ac; L.linea(ctx, [[1030, ye], [1030, lerp(ye, yp, E.out(ac))]], { cota: ac > 0.98, ancho: 4, t }); L.linea(ctx, [[960, ye], [1060, ye]], { ancho: 2, t }); L.linea(ctx, [[960, yp], [1060, yp]], { ancho: 2, t }); ctx.restore(); }
  ctx.restore();
  // la corriente: rayas que cruzan rápido (14 km/h) — más fuertes desde «catorce»
  const k = 0.45 + 0.55 * C01((t - Tk.catorce + 0.3) / 0.5); ctx.save(); ctx.strokeStyle = `rgba(190,230,255,${0.35 * k})`; ctx.lineWidth = 3; const R = H.rng(44); for (let i = 0; i < 70; i++) { const y = 140 + R() * 1500, len = 60 + R() * 160, x = ((R() * 1400 + t * (380 + 300 * R()) * k) % 1500) - 200; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y + 6 * Math.sin(t * 3 + i)); ctx.stroke(); } ctx.restore();
  P.particulas(ctx, t, { tipo: 'burbujas', n: 30, a: 0.35, seed: 6 }); P.particulas(ctx, t * 6 * k, { tipo: 'polvo', n: 70, a: 0.35, col: '170,210,230', tam: 2, seed: 9 });
 };

 // =================================================================================================
 // 5 · TIEMPOS Y TRANSICIONES (máximo 3 cortes: rueda → plano de la falla → puente; lo demás, cámara continua)
 // =================================================================================================
 const AGUA = [S(8) - 0.75, S(8) + 0.25], SUBE = [S(10) - 0.15, S(10) + 0.75];
 const AP = [S(12) - 0.85, S(12) - 0.15], RE = [Se(14) + 0.05, S(15) - 0.05];   // real → plano y plano → real (mismo puente, sin corte)
 const RUEDA = [S(15) + 3.2, S(15) + 4.0];                                       // la cámara entra en la rueda del carro
 const TIT = (ctx, s, t, t0, t1, clave, px = 88, y = 560) => P.titular(ctx, s, 540, y, t, t0, t1, { px, clave, col: RO });
 const CNT = (ctx, t, v, t0, t1, o) => { if (t < t0 || t > t1) return; const a = 1 - C01((t - t1 + 0.25) / 0.25); P.contador(ctx, t, 540, 620, v, Object.assign({ t0, px: 112, final: v, a }, o)); if (t > t0 + 0.2) P.fuenteCifra(ctx, o.fuente, 540, 790, { a: 0.92 * a }); };

 const B = [];
 // --- beat 1: la rueda sobre la junta (gancho) ---
 B.push({ t0: 0, t1: S(2) - 0.05, in: { type: 'cut' }, draw(ctx, t) { PLANO = 0;
  rueda(ctx, t); TIT(ctx, '3 KM SOBRE LA', t, -0.3, S(2) - 0.3, '', 92, 500); TIT(ctx, 'FALLA', t, -0.3, S(2) - 0.3, 'FALLA', 120, 620);
 }, sfx(k) {
  k.noise(0, { dur: S(2), color: 'brown', filter: 'lowpass', f: [[0, 260], [S(2), 200]], gain: 0.07, a: 0.05, hold: S(2) - 0.6 });   // el rodar sobre la junta (continuo)
  k.play('thud', Tk.tresKm + 0.35, { f: 58, gain: 0.4 });                                                                      // el golpe de la junta
 } });
 // --- beat 2: el plano de la falla de 1960 (corte 1) ---
 B.push({ t0: S(2) - 0.05, t1: S(4) - 0.05, in: { type: 'piel', d: 0.6 }, draw(ctx, t) { PLANO = 1;
  mapa(ctx, t);
  CNT(ctx, t, 1000, Tk.mil - 0.05, S(3) + 0.9, { unidad: 'KM', etiqueta: 'SE ROMPIÓ LA FALLA', fuente: 'USGS · U. de Chile (900–1.000 km)' });
  TIT(ctx, 'JUSTO DENTRO', t, S(3) + 1.0, S(4) - 0.2, 'DENTRO', 104);
 }, sfx(k) { pl().sonidos.transicion(k, S(2) - 0.05, 0.6); k.play('thud', Tk.mil + 0.35, { f: 62, gain: 0.4 }); FX.clave(k, Tk.dentro); } });
 // --- beat 3: el puente (corte 2) y todo lo demás, con la cámara continua ---
 B.push({ t0: S(4) - 0.05, t1: DURATION, in: { type: 'piel', d: 0.6 }, draw(ctx, t) {
  if (PORTADA) { PLANO = 0; rueda(ctx, 0); return; }
  const sis = SISMO(t);
  if (t < AGUA[0]) { PLANO = 0; mundoReal(ctx, t); }
  else if (t < AGUA[1]) { PLANO = 0; const c0 = camMundo(AGUA[0]); P.atravesar(ctx, t, AGUA[0], AGUA[1], (c) => mundoReal(c, t, { cam: c0 }), (c) => bajoAgua(c, t), { centro: [540, 1000], zoom: 6 }); }
  else if (t < SUBE[0]) { PLANO = 0; bajoAgua(ctx, t); }
  else if (t < SUBE[1]) { PLANO = 0; const c1 = camMundo(SUBE[1]); P.salir(ctx, t, SUBE[0], SUBE[1], (c) => bajoAgua(c, t), (c) => mundoReal(c, t, { cam: c1 }), { centro: [540, 1000], zoom: 6 }); }
  else if (t < AP[0]) { PLANO = 0; mundoReal(ctx, t); }
  else if (t < AP[1]) { const u = E.inOut(C01((t - AP[0]) / (AP[1] - AP[0]))); PLANO = u; mundoReal(ctx, t); ctx.save(); ctx.globalAlpha = u; mundoPlano(ctx, t); ctx.restore(); }
  else if (t < RE[0]) { PLANO = 1; const col = C01((t - AP[1] + 0.1) / 0.3) * (1 - C01((t - S(13)) / 0.3)), tache = C01((t - Tk.apoya + 0.4) / 0.6);
   mundoPlano(ctx, t, { sismo: sis, columnas: col, tache, acentoPend: C01((t - S(13)) / 0.4) * (1 - C01((t - S(14) - 1.2) / 0.5)), acentoCable: t > S(13) && t < S(14) + 1.2 });
   seccion(ctx, t, C01((t - S(14) + 0.1) / 0.4) * (1 - C01((t - Tk.mecerse + 0.6) / 0.4))); }
  else if (t < RE[1]) { const u = E.inOut(C01((t - RE[0]) / (RE[1] - RE[0]))); PLANO = 1 - u; mundoPlano(ctx, t, { sismo: sis }); ctx.save(); ctx.globalAlpha = u; mundoReal(ctx, t, { sismo: sis }); ctx.restore(); }
  else if (t < RUEDA[0]) { PLANO = 0; mundoReal(ctx, t, { sismo: sis }); }
  else if (t < RUEDA[1]) { PLANO = 0; const c2 = camMundo(RUEDA[0]); P.atravesar(ctx, t, RUEDA[0], RUEDA[1], (c) => mundoReal(c, t, { cam: c2 }), (c) => rueda(c, t - DURATION, { vib: 0.35, mece: 0.03 * Math.sin(t * 1.6) }), { centro: [540, 1020], zoom: 7 }); }
  else { PLANO = 0; const fin = C01((t - (DURATION - 1.4)) / 1.2); rueda(ctx, t - DURATION, { vib: lerp(0.35, 1, fin), mece: 0.03 * Math.sin(t * 1.6) * (1 - fin) }); }
  // textos grandes (uno a la vez)
  TIT(ctx, '¿AQUÍ?', t, S(4) + 0.6, Se(4) + 0.3, 'AQUÍ?', 130);
  if (t > S(5) + 0.3 && t < Se(5) + 0.2) P.fuenteCifra(ctx, '2.750 m · apertura prevista 2028 (MOP)', 540, 1380, { a: 0.9 * C01((t - S(5) - 0.3) / 0.3) });
  CNT(ctx, t, 199, Tk.ciento - 0.05, Se(6) + 0.1, { unidad: 'M', etiqueta: '≈ 65 PISOS', fuente: 'MOP · UACh (pila norte)' });
  TIT(ctx, '¿QUÉ LAS SOSTIENE?', t, S(7) - 0.05, Se(7) + 0.4, 'SOSTIENE?', 80);
  CNT(ctx, t, 90, Tk.noventa - 0.05, Tk.catorce - 0.15, { unidad: 'M', etiqueta: 'PILOTES', fuente: 'MOP · UACh (hasta 90 m)' });
  CNT(ctx, t, 14, Tk.catorce - 0.05, Se(9) + 0.1, { unidad: 'KM/H', etiqueta: 'LA CORRIENTE', fuente: 'UC · UdeC (≈ 4 m/s)' });
  TIT(ctx, '¿Y SI TIEMBLA?', t, S(11) - 0.05, Se(11) + 0.5, 'TIEMBLA?', 96);
  P.tachado(ctx, 'SE APOYA', 540, 560, t, S(12) - 0.05, S(13) - 0.05, { px: 100 });
  TIT(ctx, 'CUELGA', t, S(13) - 0.02, S(14) + 0.2, 'CUELGA', 130);
  TIT(ctx, 'PUEDE MECERSE', t, Tk.mecerse - 0.3, Se(14) + 0.2, 'MECERSE', 92);
  if (t > Tk.mecerse && t < Se(14)) P.fuenteCifra(ctx, 'Principio general de los puentes colgantes', 540, 700, { a: 0.9 });
  TIT(ctx, '3 KM SOBRE LA', t, DURATION - 1.15, 0, '', 92, 500); TIT(ctx, 'FALLA', t, DURATION - 1.15, 0, 'FALLA', 120, 620);
  if (t > DURATION - 1.2) P.marca(ctx, t, DURATION - 0.9);
 }, sfx(k) {   // ≤ 3 sonidos por cada 10 s; «tin» (FX.clave) 3 veces: «dentro», 14 km/h, «quebrarse»
  pl().sonidos.transicion(k, S(4) - 0.05, 0.6);
  k.noise(S(4) + 0.5, { dur: Se(7) - S(4), color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.04, a: 1.0, hold: Se(7) - S(4) - 2 });   // viento sobre el canal (continuo)
  k.play('thud', Tk.ciento + 0.4, { f: 60, gain: 0.4 });                                                                                   // 199 m: golpe al final
  k.noise(AGUA[0] + 0.2, { dur: SUBE[1] - AGUA[0], color: 'brown', filter: 'lowpass', f: 420, gain: 0.09, a: 0.3, hold: SUBE[1] - AGUA[0] - 1 });   // bajo el agua: la corriente (continua)
  k.play('thud', Tk.noventa + 0.4, { f: 55, gain: 0.4 }); FX.clave(k, Tk.catorce + 0.45);
  k.play('thud', Tk.apoya, { f: 70, gain: 0.35 });                                                                                         // el tachado
  const r0 = Tk.cuelga + 0.1, rd = Se(14) + 0.8 - r0; k.tone(r0, { f: 38, dur: rd, gain: 0.14, a: 0.8, hold: rd - 1.6 }); k.tone(r0, { f: 57, dur: rd, gain: 0.05, a: 0.8, hold: rd - 1.6 });   // el sismo: UN retumbo grave continuo
  FX.clave(k, Tk.quebrarse + 0.1);
  k.noise(S(15) + 0.2, { dur: DURATION - S(15) - 0.2, color: 'brown', filter: 'lowpass', f: 240, gain: 0.06, a: 0.6, hold: DURATION - S(15) - 1.4 });   // de vuelta sobre las ruedas (continuo)
 } });

 const EP = PL.make({
  estilo: 'engineering_blueprint', modo: 'viral', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  capOcultar: [[0, S(2) - 0.05], [DURATION - 1.2, DURATION + 1]],
  recuadro: [['falla', S(2), S(3)], ['cuelga', S(13), S(14)], ['mecerse', S(14), S(15)]],
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
