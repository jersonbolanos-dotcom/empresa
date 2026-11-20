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
 const Tk = { tresKm: wt(0, 'tres'), falla: wt(1, 'falla'), mil: wt(2, 'mil', 1), canal: wt(3, 'canal'), dentro: wt(3, 'dentro.'), tramos: wt(5, 'tramos.'), ciento: wt(6, 'ciento'), edificio: wt(6, 'edificio'),
  mar: wt(7, 'mar?'), noventa: wt(9, 'noventa'), catorce: wt(9, 'catorce'), trotando: wt(9, 'trotando.'), tiembla: wt(11, 'tiembla?'), apoya: wt(12, 'apoya:'), cuelga: wt(13, 'cuelga.'),
  cables: wt(14, 'cables…'), mecerse: wt(14, 'mecerse'), quebrarse: wt(14, 'quebrarse.'), ruedas: wt(15, 'ruedas…'), mecerse2: wt(15, 'mecerse'), cruzarlo: wt(16, 'cruzarlo?') };

 // ---- la piel del plano solo en las explicaciones: el mundo real lleva su propia viñeta y grano (sin fibras de papel) ----
 const PB = PL.PIELES.engineering_blueprint, ACAB = PB.acabado; let PLANO = 0;
 PB.acabado = (ctx, t, o) => { if (PLANO > 0.5) ACAB(ctx, t, o); else { P.vineta(ctx, 0.5); P.grano(ctx, t, 0.045); } };
 PB.sonidos = Object.assign({}, PB.sonidos, { transicion: (k, t, d = 0.6) => k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: 900, gain: 0.09, a: 0.08, hold: d * 0.7 }) });   // un solo evento por transición (regla 155)
 const pl = () => PL.piel();

 // =================================================================================================
 // 1 · LA RUEDA SOBRE LA JUNTA DE DILATACIÓN (fotograma 0 y último plano). tl = tiempo local (0 en el fotograma 0)
 // =================================================================================================
 const rueda = (ctx, tl, o = {}) => { const fr = Math.round(tl * 30), R = H.rng(1000 + ((fr % 997) + 997) % 997), vib = o.vib ?? 1;
  const sx = (R() - 0.5) * 14 * vib, sy = (R() - 0.5) * 10 * vib, z = 1 + 0.035 * Math.sin(tl * 0.9) + (o.zoom || 0), rot = 0.012 * Math.sin(tl * 1.7) * vib + (o.mece || 0);
  // FONDO (lejos, sin vibración): cielo, sol en el horizonte, montes, y el mar MUY abajo (olas diminutas y un bote con su estela)
  const hy = 330, g = ctx.createLinearGradient(0, 0, 0, hy); g.addColorStop(0, '#1d2a4a'); g.addColorStop(0.6, '#b8693f'); g.addColorStop(1, '#ffd08a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, hy + 1);
  P.resplandor(ctx, 900, hy - 10, 900, '255,200,130', 0.75); P.resplandor(ctx, 900, hy - 10, 110, '255,245,220', 0.95);
  ctx.fillStyle = '#2b2537'; ctx.beginPath(); ctx.moveTo(0, hy); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, hy - 18 - 22 * Math.sin(x * 0.006 + 1) - 10 * Math.sin(x * 0.021)); ctx.lineTo(W, hy); ctx.fill();
  const gm = ctx.createLinearGradient(0, hy, 0, 1300); gm.addColorStop(0, '#9a7466'); gm.addColorStop(0.08, '#43507a'); gm.addColorStop(1, '#16203a'); ctx.fillStyle = gm; ctx.fillRect(0, hy, W, 1000);
  ctx.strokeStyle = 'rgba(210,225,245,0.18)'; const R1 = H.rng(3); for (let i = 0; i < 160; i++) { const v = Math.pow(R1(), 1.6), y = hy + 6 + v * 700, l = 6 + v * 50, x = ((R1() * 1300 + tl * (6 + 30 * v)) % 1300) - 100; ctx.lineWidth = 1 + v * 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y); ctx.stroke(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R2 = H.rng(77); for (let i = 0; i < 150; i++) { const v = Math.pow(R2(), 1.5), y = hy + 4 + v * 640, x = 900 + (R2() - 0.5) * (60 + v * 700), a = 0.55 * (0.4 + 0.6 * Math.abs(Math.sin(tl * 3 + i))) * (1 - v * 0.8); ctx.fillStyle = `rgba(255,220,160,${a})`; ctx.fillRect(x, y, 6 + v * 30, 1.5 + v * 2); } ctx.restore();
  const bx = 170 + tl * 4, by = 405; ctx.strokeStyle = 'rgba(235,245,255,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - 120, by - 14); ctx.moveTo(bx, by + 2); ctx.lineTo(bx - 120, by + 18); ctx.stroke(); ctx.fillStyle = '#e9e2d6'; ctx.fillRect(bx - 4, by - 5, 16, 6); ctx.fillStyle = '#20232c'; ctx.fillRect(bx + 2, by - 10, 6, 5);
  // el puente detrás (desenfocado): cable principal arriba, péndolas que bajan al borde, baranda y viga del tablero
  P.capaDesenfoque(ctx, 5, (c) => { c.strokeStyle = '#151820'; c.lineCap = 'round'; c.lineWidth = 26; c.beginPath(); c.moveTo(-60, 40); c.quadraticCurveTo(520, 330, 1140, 120); c.stroke(); c.strokeStyle = 'rgba(255,190,120,0.5)'; c.lineWidth = 4; c.beginPath(); c.moveTo(-60, 30); c.quadraticCurveTo(520, 318, 1140, 108); c.stroke();
   const cyc = (x) => { const u = (x + 60) / 1200; return (1 - u) * (1 - u) * 40 + 2 * (1 - u) * u * 330 + u * u * 120; };
   for (const [x, w] of [[30, 11], [250, 10], [470, 9], [690, 8], [880, 7], [1050, 6]]) { c.fillStyle = '#12151c'; c.fillRect(x, cyc(x), w, 1300 - cyc(x)); c.fillStyle = 'rgba(255,190,120,0.4)'; c.fillRect(x + w - 2, cyc(x), 2, 1300 - cyc(x)); }
   c.fillStyle = '#1a1e27'; c.fillRect(-20, 1120, W + 40, 14); c.fillRect(-20, 1190, W + 40, 10); for (let x = -10; x < W + 40; x += 64) c.fillRect(x, 1110, 9, 200); c.fillStyle = 'rgba(255,200,140,0.45)'; c.fillRect(-20, 1120, W + 40, 3);
   const gv = c.createLinearGradient(0, 1280, 0, 1330); gv.addColorStop(0, '#2c323d'); gv.addColorStop(1, '#151a22'); c.fillStyle = gv; c.fillRect(-20, 1290, W + 40, 50); });
  ctx.save(); ctx.translate(540 + sx, 1100 + sy); ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-540, -1100);
  // el tablero (asfalto) y la junta de dilatación de dientes de acero
  const ga = ctx.createLinearGradient(0, 1330, 0, HH); ga.addColorStop(0, '#34343a'); ga.addColorStop(1, '#141418'); ctx.fillStyle = ga; ctx.fillRect(-200, 1330, W + 400, 800);
  const R3 = H.rng(5); for (let i = 0; i < 700; i++) { ctx.fillStyle = R3() < 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.25)'; ctx.fillRect(-200 + R3() * 1480, 1330 + R3() * 600, 2 + R3() * 5, 2 + R3() * 4); }
  ctx.fillStyle = 'rgba(255,200,130,0.2)'; ctx.fillRect(-200, 1330, W + 400, 6); ctx.fillStyle = '#e8e2d0'; ctx.fillRect(-200, 1352, W + 400, 8);
  const jy = 1440, jh = 110; ctx.fillStyle = '#3b4048'; ctx.fillRect(-200, jy, W + 400, jh); const gj = ctx.createLinearGradient(0, jy, 0, jy + jh); gj.addColorStop(0, '#9aa3ad'); gj.addColorStop(0.5, '#4a515a'); gj.addColorStop(1, '#23272d'); ctx.fillStyle = gj;
  for (let x = -200; x < W + 200; x += 46) { ctx.beginPath(); ctx.moveTo(x, jy); ctx.lineTo(x + 30, jy); ctx.lineTo(x + 24, jy + jh * 0.62); ctx.lineTo(x + 6, jy + jh * 0.62); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + 23, jy + jh); ctx.lineTo(x + 53, jy + jh); ctx.lineTo(x + 47, jy + jh * 0.38); ctx.lineTo(x + 29, jy + jh * 0.38); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,215,150,0.5)'; ctx.fillRect(-200, jy, W + 400, 3);
  // la rueda (neumático + llanta que gira), apoyada en la junta
  const cx = 470, r = 400, cy = jy + 6 - r, ang = tl * 9;
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.ellipse(cx, jy + 4, r * 1.05, 34, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#121214'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.arc(cx, cy, r - 42, 0, TAU, true); ctx.clip(); ctx.fillStyle = '#26262a'; for (let k = 0; k < 42; k++) { const a = ang + (k / 42) * TAU; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.fillRect(r - 42, -12, 46, 24); ctx.restore(); } ctx.restore();
  const gs = ctx.createRadialGradient(cx, cy, r * 0.62, cx, cy, r - 36); gs.addColorStop(0, '#1b1b1f'); gs.addColorStop(0.7, '#2a2a2f'); gs.addColorStop(1, '#151517'); ctx.fillStyle = gs; ctx.beginPath(); ctx.arc(cx, cy, r - 42, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(cx, cy, r - 62 - k * 20, 0, TAU); ctx.stroke(); }
  const rl = 240, gl = ctx.createRadialGradient(cx - 50, cy - 70, 20, cx, cy, rl); gl.addColorStop(0, '#d9dde3'); gl.addColorStop(0.55, '#8b939c'); gl.addColorStop(1, '#3a3f46'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(cx, cy, rl, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1a1c20'; for (let k = 0; k < 5; k++) { const a = ang + (k / 5) * TAU; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(62, -36); ctx.quadraticCurveTo(150, -70, 218, -42); ctx.lineTo(218, 42); ctx.quadraticCurveTo(150, 70, 62, 36); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#9aa1aa'; ctx.beginPath(); ctx.arc(cx, cy, 62, 0, TAU); ctx.fill(); ctx.fillStyle = '#2b2f35'; for (let k = 0; k < 5; k++) { const a = ang + (k / 5) * TAU + 0.6; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * 38, cy + Math.sin(a) * 38, 8, 0, TAU); ctx.fill(); }
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip(); const gr = ctx.createRadialGradient(cx + r * 0.9, cy - r * 0.3, 10, cx + r * 0.9, cy - r * 0.3, r * 0.9); gr.addColorStop(0, 'rgba(255,190,110,0.55)'); gr.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = gr; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); ctx.restore();
  ctx.strokeStyle = 'rgba(255,200,130,0.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r - 3, -1.0, 0.45); ctx.stroke();
  // LA CARROCERÍA: la esquina delantera del carro (guardabarros brillante, paso de rueda, faro, parachoques); a la derecha, abierto al puente
  const RA = r + 46, a0 = -0.22, a1 = Math.PI + 0.3, sill = cy - 60;
  const top = cy - RA - 120, cuerpo = () => { ctx.beginPath(); ctx.moveTo(-200, top - 30); ctx.quadraticCurveTo(cx, top - 26, cx + RA + 10, top + 6); ctx.bezierCurveTo(cx + RA + 70, top + 20, cx + RA + 95, top + 120, cx + RA + 88, cy - RA * 0.3); ctx.bezierCurveTo(cx + RA + 80, cy - 70, cx + RA + 40, cy - 20, cx + RA * Math.cos(a0), cy + RA * Math.sin(a0)); ctx.arc(cx, cy, RA, a0, a1, true); ctx.lineTo(-200, sill + 40); ctx.closePath(); };
  const gc = ctx.createLinearGradient(0, top - 30, 0, sill + 40); gc.addColorStop(0, '#f06a5a'); gc.addColorStop(0.08, '#b8242a'); gc.addColorStop(0.4, '#7e1418'); gc.addColorStop(0.56, '#d63a3a'); gc.addColorStop(0.64, '#7a1317'); gc.addColorStop(1, '#2a0506'); ctx.fillStyle = gc; cuerpo(); ctx.fill();
  ctx.save(); cuerpo(); ctx.clip();
   ctx.fillStyle = 'rgba(255,214,170,0.35)'; ctx.beginPath(); ctx.moveTo(-200, top + 70); ctx.lineTo(cx + RA + 160, top + 40); ctx.lineTo(cx + RA + 160, top + 62); ctx.lineTo(-200, top + 96); ctx.closePath(); ctx.fill();   // reflejo del cielo
   ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - RA - 60, top - 40); ctx.lineTo(cx - RA - 40, sill + 40); ctx.stroke();                                       // junta de la puerta
   ctx.fillStyle = '#0d0e10'; ctx.fillRect(-200, sill + 6, cx - RA + 160, 40);                                                                                                                    // estribo negro
   const hx = cx + RA - 40, hy2 = top + 60; ctx.fillStyle = '#20232a'; ctx.beginPath(); ctx.roundRect(hx - 90, hy2 - 30, 220, 74, 26); ctx.fill(); const gh = ctx.createRadialGradient(hx + 50, hy2, 4, hx + 50, hy2, 90); gh.addColorStop(0, '#fffbe8'); gh.addColorStop(0.5, '#ffd995'); gh.addColorStop(1, 'rgba(255,190,110,0.1)'); ctx.fillStyle = gh; ctx.beginPath(); ctx.roundRect(hx - 70, hy2 - 18, 185, 50, 20); ctx.fill();   // faro
  ctx.restore();
  ctx.strokeStyle = '#0b0b0d'; ctx.lineWidth = 34; ctx.beginPath(); ctx.arc(cx, cy, RA - 12, a0 + 0.05, a1 - 0.05, true); ctx.stroke();                                   // paso de rueda (plástico negro)
  ctx.strokeStyle = 'rgba(255,190,150,0.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, RA + 2, -0.35, -Math.PI * 0.62, true); ctx.stroke();                          // brillo del borde del guardabarros
  P.resplandor(ctx, hx + 50, hy2 + 6, 240, '255,225,170', 0.45); ctx.strokeStyle = 'rgba(255,225,190,0.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-200, top - 29); ctx.quadraticCurveTo(cx, top - 25, cx + RA + 10, top + 7); ctx.stroke();
  ctx.restore();
  // el polvo que salta de la junta (va con la vibración)
  P.particulas(ctx, tl + 50, { tipo: 'chispas', n: 46 * vib, area: [60, 1380, 1000, 1470], a: 0.55 * vib, col: '220,190,150', tam: 4, seed: 12 });
 };

 // =================================================================================================
 // 2 · EL PLANO DE LA FALLA DE 1960 (piel engineering_blueprint) — mapa esquemático del sur de Chile
 // =================================================================================================
 const MP = (lat, lon) => [140 + (lon + 76) * 165, 390 + (-37 - lat) * 112];
 const COSTA = [[-31.5, -71.6], [-33.0, -71.7], [-34.0, -72.0], [-35.0, -72.3], [-36.0, -72.8], [-36.6, -73.1], [-37.2, -73.6], [-37.6, -73.66], [-38.0, -73.5], [-38.6, -73.48], [-39.4, -73.22], [-39.9, -73.42], [-40.5, -73.76], [-41.0, -73.9], [-41.55, -73.82], [-41.76, -73.6], [-41.78, -73.2], [-41.5, -72.95], [-41.85, -72.6], [-42.4, -72.75], [-43.2, -72.85], [-44.0, -73.05], [-44.8, -73.4], [-45.6, -73.9], [-46.2, -74.6], [-46.55, -75.45], [-46.9, -75.6], [-47.6, -74.9]];
 const TIERRA = COSTA.concat([[-49, -74.9], [-49, -66], [-31.5, -66]]).map((q) => MP(q[0], q[1]));
 const CHILOE = [[-41.84, -73.98], [-41.86, -73.55], [-42.1, -73.4], [-42.6, -73.65], [-43.1, -73.55], [-43.42, -73.85], [-43.3, -74.3], [-42.7, -74.2], [-42.2, -74.15]].map((q) => MP(q[0], q[1]));
 const RUPTURA = [[-37.9, -74.3], [-37.9, -73.4], [-40.0, -73.1], [-42.0, -73.3], [-44.5, -74.0], [-46.5, -75.2], [-46.5, -76.0], [-44.3, -75.4], [-41.9, -74.9], [-39.7, -74.6]].map((q) => MP(q[0], q[1]));
 const CHACAO = MP(-41.79, -73.52), EPI = MP(-38.14, -73.41);
 const nota = (ctx, s, x, y, o = {}) => { ctx.save(); ctx.font = `600 ${o.px || 34}px "IBM Plex Mono", monospace`; ctx.textAlign = o.al || 'left'; ctx.textBaseline = 'middle'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(8,30,70,0.85)'; ctx.globalAlpha *= o.a ?? 1; ctx.strokeText(s, x, y); ctx.fillStyle = o.col || '#eaf3ff'; ctx.fillText(s, x, y); ctx.restore(); };
 const mapa = (ctx, t) => { const L = pl(); L.fondo(ctx, t);
  const z0 = 1 + 0.12 * E.inOut(sm(S(2), Tk.canal - 0.6, t)), z = lerp(z0, 1.9, E.inOut(sm(Tk.canal - 0.6, S(4) + 0.3, t))), cx = lerp(540, CHACAO[0], E.inOut(sm(Tk.canal - 0.6, S(4), t))), cy = lerp(1150 + 30 * Math.sin(t * 0.5), CHACAO[1] + 80, E.inOut(sm(Tk.canal - 0.6, S(4), t)));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 400, W, HH); ctx.clip(); ctx.translate(540, 1150); ctx.scale(z, z); ctx.translate(-cx, -cy - (z - 1) * 60); const d0 = S(2) + 0.1;
  for (let lat = -36; lat >= -47; lat--) { const yl = MP(lat, 0)[1]; L.linea(ctx, [[-200, yl], [1300, yl]], { punteada: true, ancho: 2, t }); nota(ctx, `${-lat}° S`, 925, yl - 18, { px: 30, a: 0.6, al: 'right' }); }
  L.forma(ctx, { tipo: 'poli', pts: TIERRA }, { rol: 'objeto', t }); L.forma(ctx, { tipo: 'poli', pts: CHILOE }, { rol: 'objeto', t }); nota(ctx, 'OCÉANO PACÍFICO', MP(0, -76)[0] - 60, MP(-44.2, 0)[1], { px: 30, a: 0.55 * (1 - C01((t - Tk.canal + 0.8) / 0.4)) });
  // la ruptura de 1960: se dibuja de norte a sur mientras la voz dice «se rompió a lo largo de mil kilómetros»
  const pr = E.inOut(sm(d0 + 0.3, Tk.mil + 0.9, t)); if (pr > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-500, 0, 2200, MP(-37.9, 0)[1] + (MP(-46.6, 0)[1] - MP(-37.9, 0)[1]) * pr); ctx.clip(); L.forma(ctx, { tipo: 'poli', pts: RUPTURA }, { rol: 'sombra', t }); L.linea(ctx, RUPTURA.concat([RUPTURA[0]]), { rol: 'rojo', ancho: 6, t }); ctx.restore(); }
  // cota de la ruptura (1.000 km) a la izquierda
  const xa = MP(0, -75.9)[0] - 40, ya = MP(-37.9, 0)[1], yb = MP(-46.5, 0)[1]; if (pr > 0) L.linea(ctx, [[xa, ya], [xa, lerp(ya, yb, pr)]], { cota: pr > 0.98, ancho: 3, t });
  const ae = C01((t - d0) / 0.5) * (1 - C01((t - Tk.mil + 0.7) / 0.3)); if (ae > 0) { ctx.save(); ctx.globalAlpha = ae; L.brillo(ctx, EPI[0], EPI[1], 16, { t }); nota(ctx, '1960 · M 9,5', EPI[0] + 50, EPI[1] - 6, { px: 32 }); ctx.restore(); }
  nota(ctx, 'ARAUCO', MP(0, -73.3)[0] + 40, ya + 70, { px: 32, a: 0.85 * (1 - C01((t - Tk.mil + 0.7) / 0.3)) }); nota(ctx, 'TAITAO', MP(0, -75.2)[0] + 70, yb + 10, { px: 32, a: 0.85 * C01((t - Tk.mil) / 0.6) });
  const ac = C01((t - Tk.canal + 0.3) / 0.4); if (ac > 0) { ctx.save(); ctx.globalAlpha = ac; const pul = 1 + 0.25 * Math.sin(t * 6); L.brillo(ctx, CHACAO[0], CHACAO[1], 14 * pul, { t }); ctx.restore(); nota(ctx, 'CANAL DE CHACAO', CHACAO[0] + 46, CHACAO[1] - 26, { px: 32, a: ac, col: '#fff2b8' }); nota(ctx, 'CHILOÉ', MP(0, -74.0)[0] + 40, MP(-42.7, 0)[1], { px: 30, a: ac * 0.85 }); }
  ctx.restore();
  nota(ctx, 'ESQUEMA · FALLA DE 1960', 80, 1640, { px: 32, a: 0.8 });
 };

 // =================================================================================================
 // 3 · EL PUENTE EN 3D (metros). X a lo largo del puente (pila sur = 0, hacia el norte +), Y arriba, Z de lado.
 //     Pilas: sur 157 m (X 0), central 175 m (X 1.055), norte 199 m (X 2.210). Tableros colgantes de 1.055 y 1.155 m.
 // =================================================================================================
 const TORRES = [{ x: 0, h: 157, mar: false, y: false }, { x: 1055, h: 175, mar: true, y: true }, { x: 2210, h: 199, mar: true, y: false }], ANC = [-250, 2500], YD = 55, ZC = 13;
 const SOL = (() => { const v = [-0.25, 0.1, 1]; const n = Math.hypot(...v); return v.map((q) => q / n); })();
 const cam3 = (p, tg, f) => { const dx = tg[0] - p[0], dy = tg[1] - p[1], dz = tg[2] - p[2], yaw = Math.atan2(dx, dz), pit = Math.atan2(dy, Math.hypot(dx, dz)); return { p, yaw, pit, f, cy: Math.cos(yaw), sy: Math.sin(yaw), cp: Math.cos(pit), sp: Math.sin(pit) }; };
 const pr3 = (c, q) => { const dx = q[0] - c.p[0], dy = q[1] - c.p[1], dz = q[2] - c.p[2], xr = dx * c.cy - dz * c.sy, zf = dx * c.sy + dz * c.cy, yc = dy * c.cp - zf * c.sp, zc = dy * c.sp + zf * c.cp; return zc < 0.5 ? null : [540 + (c.f * xr) / zc, 960 - (c.f * yc) / zc, zc]; };
 const camino3 = (t, Kf) => { if (t <= Kf[0][0]) return Kf[0].slice(1); for (let i = 0; i < Kf.length - 1; i++) { const a = Kf[i], b = Kf[i + 1]; if (t < b[0]) { const u = E.inOut(C01((t - a[0]) / (b[0] - a[0]))); return a.slice(1).map((v, k) => lerp(v, b[k + 1], u)); } } return Kf[Kf.length - 1].slice(1); };
 // el cable principal: catenaria aproximada (parábola) entre apoyos; mínimo cerca del tablero
 const cableY = (x) => { const tramo = (xa, ya, xb, yb, ymin) => { const u = (x - xa) / (xb - xa), s = (ya + yb) / 2 - ymin; return ya + (yb - ya) * u - 4 * s * u * (1 - u); };
  if (x < 0) return tramo(ANC[0], YD + 6, 0, 157, YD + 2); if (x < 1055) return tramo(0, 157, 1055, 175, YD + 4); if (x < 2210) return tramo(1055, 175, 2210, 199, YD + 4); return tramo(2210, 199, ANC[1], YD + 6, YD + 2); };
 const carX = (t) => 380 + 21 * t;   // el carro avanza a ~75 km/h por el tablero
 // sismo (s = 0..1): el suelo se desplaza en X; el tablero colgado se mece con retraso y ONDULA; los cables vibran
 const sismoDX = (t, s) => (s ? { suelo: s * 6 * Math.sin(t * TAU * 1.4) + s * 3 * Math.sin(t * TAU * 2.3 + 1), tablero: s * 9 * Math.sin(t * TAU * 0.45 - 1.2) } : { suelo: 0, tablero: 0 });
 const envVano = (x) => (x <= 0 || x >= 2210 || Math.abs(x - 1055) < 1 ? 0 : x < 1055 ? Math.sin((Math.PI * x) / 1055) : Math.sin((Math.PI * (x - 1055)) / 1155));
 const ondaD = (x, t, s) => (s ? s * 2.6 * envVano(x) * Math.sin(x * 0.011 - t * 3.2) : 0);
 const ondaC = (x, t, s) => (s ? s * 1.2 * envVano(x) * Math.sin(x * 0.045 + t * 11) : 0);
 const poli = (ctx, pts) => { if (pts.some((q) => !q)) return false; ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); return true; };
 const trazo3 = (ctx, c, pts) => { let on = false; ctx.beginPath(); for (const q of pts) { const s = pr3(c, q); if (!s) { on = false; continue; } on ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); on = true; } };
 const inkP = (ctx, w, col) => { ctx.save(); ctx.strokeStyle = 'rgba(220,235,255,0.16)'; ctx.lineWidth = w * 3; ctx.stroke(); ctx.restore(); ctx.strokeStyle = col || 'rgba(235,244,255,0.95)'; ctx.lineWidth = w; ctx.stroke(); };
 // prisma de concreto (pata de torre) entre dos centros p0 → p1, ancho en X (w0 → w1) y fondo en Z (d): cara frontal + cara lateral iluminada
 const prisma = (ctx, c, p0, p1, w0, w1, d, plano) => { const zf = p0[2] - d / 2, zb = p0[2] + d / 2, side = c.p[0] > (p0[0] + p1[0]) / 2 ? 1 : -1;
  const F = [pr3(c, [p0[0] - w0 / 2, p0[1], zf]), pr3(c, [p0[0] + w0 / 2, p0[1], zf]), pr3(c, [p1[0] + w1 / 2, p1[1], zf]), pr3(c, [p1[0] - w1 / 2, p1[1], zf])];
  const Sd = [pr3(c, [p0[0] + side * w0 / 2, p0[1], zf]), pr3(c, [p0[0] + side * w0 / 2, p0[1], zb]), pr3(c, [p1[0] + side * w1 / 2, p1[1], zb]), pr3(c, [p1[0] + side * w1 / 2, p1[1], zf])];
  if (plano) { if (poli(ctx, F)) { ctx.fillStyle = 'rgba(220,235,255,0.07)'; ctx.fill(); inkP(ctx, 3); } return; }
  if (poli(ctx, Sd)) { ctx.fillStyle = side > 0 ? '#5d636e' : '#9a8e80'; ctx.fill(); }
  if (poli(ctx, F)) { const gx = ctx.createLinearGradient(F[0][0], 0, F[1][0], 0); gx.addColorStop(0, '#8e8a84'); gx.addColorStop(0.55, '#d8cfc1'); gx.addColorStop(1, '#a39a8d'); ctx.fillStyle = gx; ctx.fill(); ctx.fillStyle = 'rgba(255,190,120,0.16)'; ctx.fill(); ctx.strokeStyle = 'rgba(40,36,34,0.35)'; ctx.lineWidth = 1; ctx.stroke(); } };
 // una torre: pórtico (sur y norte) o «Y invertida» de 4 apoyos (central, MOP); z = lado (-ZC cerca, +ZC lejos)
 const torre = (ctx, c, tr, sd, plano, z) => { const bx = tr.x + sd.suelo, tx = tr.x + sd.suelo * 1.15, h = tr.h, zl = z * 1.1, zt = z * 0.92;
  if (tr.y) { const hy = h * 0.42, xm = lerp(bx, tx, 0.42); prisma(ctx, c, [bx - 36, 0, zl], [xm - 3, hy, lerp(zl, zt, 0.42)], 13, 10, 10, plano); prisma(ctx, c, [bx + 36, 0, zl], [xm + 3, hy, lerp(zl, zt, 0.42)], 13, 10, 10, plano); prisma(ctx, c, [xm, hy - 4, lerp(zl, zt, 0.42)], [tx, h, zt], 15, 9, 9, plano); }
  else prisma(ctx, c, [bx, 0, zl], [tx, h, zt], 15, 9, 10, plano); };
 const vigas = (ctx, c, tr, sd, plano) => { const bx = tr.x + sd.suelo, tx = tr.x + sd.suelo * 1.15, h = tr.h;
  for (const yb of [YD - 7, h * 0.66, h - 8]) { if (tr.y && yb < h * 0.4) continue; const f = yb / h, xb = lerp(bx, tx, f), zz = lerp(ZC * 1.1, ZC * 0.92, f); const q = [pr3(c, [xb - 4, yb, -zz]), pr3(c, [xb - 4, yb, zz]), pr3(c, [xb - 4, yb - 6, zz]), pr3(c, [xb - 4, yb - 6, -zz])]; if (!poli(ctx, q)) continue; if (plano) inkP(ctx, 2); else { ctx.fillStyle = '#a69d90'; ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fill(); } }
  if (tr.mar) { const q = [pr3(c, [bx - 60, 6, -26]), pr3(c, [bx + 60, 6, -26]), pr3(c, [bx + 60, -3, -26]), pr3(c, [bx - 60, -3, -26])]; if (poli(ctx, q)) { if (plano) inkP(ctx, 2); else { ctx.fillStyle = '#6d6a64'; ctx.fill(); } } } };
 // el cable principal con su grosor real (más grueso cuanto más cerca) y vibración
 const cable = (ctx, c, xs, sd, z, t, s, plano, acento) => { const pts = xs.map((x) => { const tdx = x < -5 || x > 2215 ? 0 : sd.suelo * 1.15; return [x + tdx, cableY(x) + ondaC(x, t, s), z]; });
  if (plano) { trazo3(ctx, c, pts); inkP(ctx, z < 0 ? 3.5 : 2, acento ? '#fff2b8' : undefined); return; }
  ctx.lineCap = 'round'; for (let i = 0; i < pts.length - 1; i++) { const a = pr3(c, pts[i]), b = pr3(c, pts[i + 1]); if (!a || !b) continue; const w = Math.max(2.2, Math.min(26, (c.f * 1.4) / ((a[2] + b[2]) / 2))); ctx.strokeStyle = z < 0 ? '#e4ddd0' : '#a7a9ad'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); if (z < 0 && w > 4) { ctx.strokeStyle = 'rgba(255,200,140,0.55)'; ctx.lineWidth = w * 0.3; ctx.beginPath(); ctx.moveTo(a[0], a[1] - w * 0.25); ctx.lineTo(b[0], b[1] - w * 0.25); ctx.stroke(); } } };
 // el carro (vista lateral, lado del conductor hacia la cámara) con ruedas, ventanas y, de cerca, la mano en el volante
 const CARZ = -5.9, RUEDA_D = 3.75;
 const carro = (ctx, c, t, s, plano) => { const x0 = carX(t) + sismoDX(t, s).tablero, y0 = YD + ondaD(carX(t), t, s), P3 = (q) => pr3(c, [x0 + q[0], y0 + q[1], CARZ]);
  const perfil = [[0.05, 0.32], [0.05, 0.95], [0.25, 1.05], [1.0, 1.12], [1.35, 1.46], [2.75, 1.46], [3.35, 1.08], [4.45, 0.92], [4.6, 0.6], [4.55, 0.32]].map(P3);
  if (!poli(ctx, perfil)) return null; if (plano) { inkP(ctx, 2); return null; }
  const b0 = P3([0, 0]), b1 = P3([0, 1.5]); const g = ctx.createLinearGradient(0, b1[1], 0, b0[1]); g.addColorStop(0, '#f05a4e'); g.addColorStop(0.3, '#a81c22'); g.addColorStop(0.55, '#d8393a'); g.addColorStop(1, '#3a0709'); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(30,0,0,0.6)'; ctx.lineWidth = 1.5; ctx.stroke();
  const ven = [[1.12, 1.1], [1.42, 1.4], [2.68, 1.4], [3.12, 1.1]].map(P3); let volante = null;
  if (poli(ctx, ven)) { const gv = ctx.createLinearGradient(0, ven[1][1], 0, ven[0][1]); gv.addColorStop(0, '#2a3348'); gv.addColorStop(1, '#0d1018'); ctx.fillStyle = gv; ctx.fill();
   const largo = Math.hypot(perfil[0][0] - perfil[8][0], perfil[0][1] - perfil[8][1]);
   if (largo > 380) { ctx.save(); poli(ctx, ven); ctx.clip(); const fr = Math.round(t * 30), R = H.rng(500 + fr), j = s * 2.2; const v = P3([2.78 + (R() - 0.5) * 0.02 * s, 1.17 + (R() - 0.5) * 0.02 * s]), rv = Math.abs(P3([2.78, 1.36])[1] - P3([2.78, 1.17])[1]);
     ctx.strokeStyle = '#08090c'; ctx.lineWidth = rv * 0.18; ctx.beginPath(); ctx.ellipse(v[0] + (R() - 0.5) * j, v[1] + (R() - 0.5) * j, rv * 0.42, rv, -0.25, 0, TAU); ctx.stroke();
     P.manoR(ctx, 'agarrar', v[0] + rv * 0.05 + (R() - 0.5) * j, v[1] - rv * 0.35 + (R() - 0.5) * j, rv * 1.75, { t, ang: -0.25 });
     ctx.fillStyle = 'rgba(255,210,170,0.12)'; ctx.fillRect(ven[0][0], ven[1][1], ven[3][0] - ven[0][0], ven[0][1] - ven[1][1]); ctx.restore(); volante = v; }
   ctx.strokeStyle = 'rgba(255,220,190,0.4)'; ctx.lineWidth = 2; ctx.stroke(); }
  const fx = P3([4.38, 0.82]); ctx.fillStyle = '#ffe9b0'; ctx.beginPath(); ctx.arc(fx[0], fx[1], Math.max(2, Math.abs(P3([4.38, 0.9])[1] - fx[1])), 0, TAU); ctx.fill();
  for (const xw of [0.85, RUEDA_D]) { const cw = P3([xw, 0.34]), rw = Math.abs(P3([xw, 0.68])[1] - cw[1]); ctx.fillStyle = '#0d0d0f'; ctx.beginPath(); ctx.arc(cw[0], cw[1], rw, 0, TAU); ctx.fill(); ctx.fillStyle = '#8b939c'; ctx.beginPath(); ctx.arc(cw[0], cw[1], rw * 0.58, 0, TAU); ctx.fill(); ctx.fillStyle = '#1a1c20'; for (let k = 0; k < 5; k++) { const a = carX(t) * 2.9 + (k / 5) * TAU; ctx.beginPath(); ctx.arc(cw[0] + Math.cos(a) * rw * 0.33, cw[1] + Math.sin(a) * rw * 0.33, rw * 0.13, 0, TAU); ctx.fill(); } }
  return volante; };
 // dibuja el puente; m = 'real' (luz, color) o 'plano' (líneas blancas de la piel)
 const puente = (ctx, c, t, m, o = {}) => { const s = o.sismo || 0, sd = sismoDX(t, s), plano = m === 'plano', dx = sd.tablero;
  const xs = []; for (let x = ANC[0]; x <= ANC[1]; x += Math.max(0.5, Math.min(20, Math.abs(x - c.p[0]) * 0.06))) xs.push(x);
  const orden = TORRES.slice().sort((a, b) => Math.abs(b.x - c.p[0]) - Math.abs(a.x - c.p[0]));
  // 1) lo lejano: cable y patas del lado de atrás
  cable(ctx, c, xs, sd, ZC, t, s, plano, o.acentoCable); orden.forEach((tr) => torre(ctx, c, tr, sd, plano, ZC));
  // 2) el tablero (cajón de acero) con su onda
  const borde = (z, y) => xs.map((x) => [x + dx, y + ondaD(x, t, s), z]);
  const z0 = Math.abs(c.cy) > 0.7 ? Math.max(-12, Math.min(11, c.p[2] + 0.8)) : -12, BZ = borde(z0, YD), B12 = borde(12, YD);
  if (!plano && c.p[1] > YD + ondaD(c.p[0], t, s) + 0.2) { for (let i = 0; i < xs.length - 1; i++) { const q = [pr3(c, BZ[i]), pr3(c, BZ[i + 1]), pr3(c, B12[i + 1]), pr3(c, B12[i])]; if (!poli(ctx, q)) continue; ctx.fillStyle = '#4b5260'; ctx.fill(); } ctx.strokeStyle = 'rgba(255,230,170,0.5)'; ctx.lineWidth = 1.5; ctx.setLineDash([18, 22]); trazo3(ctx, c, borde(0, YD + 0.05)); ctx.stroke(); ctx.setLineDash([]); }
  if (c.p[2] < -12.5 || plano) { const top = borde(-12, YD), bot = borde(-12, YD - 4.5); for (let i = 0; i < xs.length - 1; i++) { const q = [pr3(c, top[i]), pr3(c, top[i + 1]), pr3(c, bot[i + 1]), pr3(c, bot[i])]; if (!poli(ctx, q)) continue; if (plano) { ctx.fillStyle = 'rgba(220,235,255,0.05)'; ctx.fill(); } else { ctx.fillStyle = '#39414e'; ctx.fill(); } }
   if (plano) { trazo3(ctx, c, top); inkP(ctx, 3); trazo3(ctx, c, bot); inkP(ctx, 3); } else { ctx.strokeStyle = 'rgba(255,214,150,0.6)'; ctx.lineWidth = 2; trazo3(ctx, c, top); ctx.stroke(); ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 3; trazo3(ctx, c, borde(-12.2, YD + 1.1)); ctx.stroke(); } }
  if (!plano) for (const zr of [-11.8, 11.8]) { const bt = borde(zr, YD + 1.15); ctx.strokeStyle = 'rgba(30,34,44,0.9)'; ctx.lineWidth = 2.5; trazo3(ctx, c, bt); ctx.stroke(); for (let i = 0; i < xs.length; i += 1) { if (Math.abs(xs[i] - c.p[0]) > 120 || i % 2) continue; const a = pr3(c, bt[i]), b = pr3(c, [bt[i][0], bt[i][1] - 1.15, zr]); if (a && b) { ctx.lineWidth = Math.max(1, Math.min(6, 300 / a[2])); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } } }
  // 3) el carro
  let vol = null; if (o.carro !== false) vol = carro(ctx, c, t, s, plano);
  // 4) lo cercano: patas, vigas, cable y péndolas del lado de la cámara
  orden.forEach((tr) => { torre(ctx, c, tr, sd, plano, -ZC); vigas(ctx, c, tr, sd, plano); });
  cable(ctx, c, xs, sd, -ZC, t, s, plano, o.acentoCable);
  for (let x = 10; x < 2200; x += 30) { if (Math.abs(x - 1055) < 12) continue; for (const z of plano ? [-ZC] : c.p[2] > -ZC - 1 && Math.abs(c.cy) > 0.7 ? [ZC] : [-ZC, ZC]) { const a = pr3(c, [x + sd.suelo * 1.15, cableY(x) + ondaC(x, t, s), z]), b = pr3(c, [x + dx, YD + ondaD(x, t, s), z]); if (!a || !b) continue; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); if (plano) inkP(ctx, 1.4, o.acentoPend ? `rgba(255,242,184,${0.6 + 0.4 * o.acentoPend})` : 'rgba(235,244,255,0.7)'); else { ctx.strokeStyle = z < 0 ? 'rgba(215,210,205,0.75)' : 'rgba(160,160,168,0.45)'; ctx.lineWidth = Math.max(1, Math.min(5, (c.f * 0.12) / ((a[2] + b[2]) / 2))); ctx.stroke(); } } }
  return vol; };
 // cielo, mar con brillo del sol y montes en el horizonte (Chiloé al sur, el continente al norte); s = agua agitada por el sismo
 const cielo = (ctx, c, t, s = 0) => { const hy = 960 + c.f * Math.tan(c.pit), sp = pr3(c, [c.p[0] + SOL[0] * 1e6, c.p[1] + SOL[1] * 1e6, c.p[2] + SOL[2] * 1e6]);
  const g = ctx.createLinearGradient(0, hy - 1400, 0, hy); g.addColorStop(0, '#16213d'); g.addColorStop(0.55, '#a8603f'); g.addColorStop(0.92, '#f2b277'); g.addColorStop(1, '#ffd9a0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Math.max(0, hy) + 2);
  if (sp) { P.resplandor(ctx, sp[0], sp[1], 1000, '255,190,120', 0.7); P.resplandor(ctx, sp[0], sp[1], 120, '255,245,220', 1); }
  { const Rn = H.rng(61); for (let i = 0; i < 44; i++) { const az = Rn() * TAU, el = 0.04 + Math.pow(Rn(), 1.1) * 0.9, sz = 0.6 + Rn() * 1.2, dv = [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)], q = pr3(c, [c.p[0] + dv[0] * 1e5, c.p[1] + dv[1] * 1e5, c.p[2] + dv[2] * 1e5]); if (!q || q[1] > hy - 6) continue;
    const rx = c.f * 0.14 * sz * (1 + el), ry = rx * 0.045; for (let k = 0; k < 3; k++) { const ox = (Rn() - 0.5) * rx * 0.8, oy = k * ry * 2.2, kx = rx * (0.45 + 0.4 * Rn()); ctx.fillStyle = 'rgba(96,56,66,0.5)'; ctx.beginPath(); ctx.ellipse(q[0] + ox, q[1] + oy, kx, ry, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,208,152,0.78)'; ctx.beginPath(); ctx.ellipse(q[0] + ox + kx * 0.06, q[1] + oy + ry * 0.6, kx * 0.85, ry * 0.5, 0, 0, TAU); ctx.fill(); } } }
  ctx.fillStyle = '#2a2638'; ctx.beginPath(); ctx.moveTo(0, hy); for (let px = 0; px <= W; px += 12) { const az = c.yaw + Math.atan((px - 540) / c.f), lado = Math.abs(Math.sin(az)), hm = (lado > 0.35 ? 60 + 140 * (lado - 0.35) : 0) * (0.7 + 0.3 * Math.sin(az * 9) + 0.15 * Math.sin(az * 23)); ctx.lineTo(px, hy - (hm * c.f) / 9000); } ctx.lineTo(W, hy); ctx.closePath(); ctx.fill();
  const gm = ctx.createLinearGradient(0, hy, 0, HH); gm.addColorStop(0, '#8d6a63'); gm.addColorStop(0.08, '#3b4766'); gm.addColorStop(1, '#0b1220'); ctx.fillStyle = gm; ctx.fillRect(0, Math.max(0, hy), W, HH);
  if (sp && sp[1] < hy + 40) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = H.rng(31); for (let i = 0; i < 220; i++) { const yy = hy + 4 + Math.pow(R(), 1.8) * (HH - hy), xx = sp[0] + (R() - 0.5) * (40 + (yy - hy) * 0.9) + s * 14 * Math.sin(t * 9 + i), a = 0.55 * (0.3 + 0.7 * Math.abs(Math.sin(t * (2.4 + 6 * s) + i * 1.7))) * (1 - (yy - hy) / (HH - hy + 1)); ctx.fillStyle = `rgba(255,214,150,${a})`; ctx.fillRect(xx, yy, 6 + R() * 24 * (1 + (yy - hy) / 600), 2); } ctx.restore(); }
  { const R3 = H.rng(19); ctx.strokeStyle = 'rgba(205,220,245,0.3)'; for (let i = 0; i < 140; i++) { const wx = c.p[0] + (R3() - 0.5) * 300 + ((t * 4) % 20), wz = c.p[2] + 3 + R3() * 160, jy = s * 1.2 * Math.sin(t * 13 + i), a = pr3(c, [wx, jy, wz]), b = pr3(c, [wx + 3 * c.cy, jy, wz - 3 * c.sy]); if (a && b && a[1] > hy) { ctx.lineWidth = Math.max(2, Math.min(7, 1200 / a[2])); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } } }
  // olas: rayas que corren con la corriente; con el sismo, el agua se agita (más rayas, espuma, temblor)
  const R2 = H.rng(8), n = 170 + Math.round(150 * s); for (let i = 0; i < n; i++) { const wx = c.p[0] + (R2() - 0.5) * 3000 + ((t * 4) % 60), wz = c.p[2] + 30 + Math.pow(R2(), 1.5) * 2400, jy = s * 1.6 * Math.sin(t * 13 + i * 2.1), a = pr3(c, [wx, jy, wz]), b = pr3(c, [wx + (14 + 10 * s) * c.cy, jy, wz - (14 + 10 * s) * c.sy]); if (a && b && a[1] > hy) { ctx.strokeStyle = s > 0.2 && i % 3 === 0 ? `rgba(235,242,255,${0.4 + 0.3 * s})` : 'rgba(205,220,245,0.36)'; ctx.lineWidth = Math.max(2.5, Math.min(9, 2400 / a[2])); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
 };
 // keyframes de cámara [t, px, py, pz, tx, ty, tz, f, rel]: con rel = 1, X y el objetivo X van pegados al carro (la cámara lo sigue)
 const CAM = () => [
  [S(4) - 0.2, 985, 26, -125, 1055, 120, 0, 950, 0], [S(5) - 0.2, 950, 40, -170, 1075, 150, 30, 950, 0],
  [S(5) + 0.4, -250, 85, -95, 1100, 120, 15, 1300, 0], [Se(5), -190, 80, -88, 1200, 120, 15, 1300, 0],
  [S(6) + 0.3, 2075, 20, -300, 2210, 72, 0, 1000, 0], [Se(6) - 0.3, 2095, 12, -280, 2210, 80, 0, 1000, 0],
  [S(7) + 0.2, 2120, 30, -220, 2200, 10, -10, 1000, 0], [Se(7) + 0.5, 2170, 8, -120, 2205, -5, -14, 1000, 0],
  [S(10) - 0.4, 36, 61, -30, -70, 92, 0, 1000, 1], [S(12) - 1.0, 26, 59.5, -26, -60, 96, 0, 1000, 1],
  [S(12) - 0.2, 2100, 106, -300, 2100, 106, 0, 1000, 0], [Se(14) + 0.3, 2115, 106, -290, 2115, 106, 0, 1000, 0],
  [S(15) + 0.6, 32, 61, -30, -60, 82, 0, 1000, 1], [S(15) + 1.7, 2.3, YD + 1.3, -10.6, 2.3, YD + 1.2, CARZ, 1000, 1],
  [S(15) + 3.75, 3.1, YD + 0.95, -10.6, 3.3, YD + 0.65, CARZ, 1000, 1], [S(15) + 4.3, RUEDA_D, YD + 0.42, -9.2, RUEDA_D, YD + 0.34, CARZ, 1000, 1]];
 let CAMK = null;
 const camMundo = (t) => { CAMK = CAMK || CAM(); const cx0 = carX(t), ab = (k) => { const v = k.slice(1, 8); if (k[8]) { v[0] += cx0; v[3] += cx0; } return v; };
  let v; if (t <= CAMK[0][0]) v = ab(CAMK[0]); else if (t >= CAMK[CAMK.length - 1][0]) v = ab(CAMK[CAMK.length - 1]); else for (let i = 0; i < CAMK.length - 1; i++) { const a = CAMK[i], b = CAMK[i + 1]; if (t < b[0]) { const u = E.inOut(C01((t - a[0]) / (b[0] - a[0]))), va = ab(a), vb = ab(b); v = va.map((q, k) => lerp(q, vb[k], u)); break; } }
  const s0 = SISMO(t), dist = Math.hypot(v[0] - cx0, v[2] - CARZ), wq = C01(1 - (dist - 20) / 80), oy = ondaD(cx0, t, s0) * wq, ox = sismoDX(t, s0).tablero * wq; v[1] += oy; v[4] += oy; v[0] += ox; v[3] += ox;
  const s = s0 * (PLANO > 0.5 ? 0 : 1), d = Math.max(4, Math.abs(v[2])) * 0.004 * s; v[0] += d * Math.sin(t * 37); v[1] += d * Math.sin(t * 29 + 1); return cam3([v[0], v[1], v[2]], [v[3], v[4], v[5]], v[6]); };
 const SISMO = (t) => C01((t - (S(11) - 0.3)) / 0.8); 
 const mundoReal = (ctx, t, o = {}) => { const c = o.cam || camMundo(t), s = o.sismo || 0; cielo(ctx, c, t, s); const v = puente(ctx, c, t, 'real', { sismo: s });
  if (!o.cam) cotaTorre(ctx, t, c, C01((t - Tk.ciento + 0.4) / 0.5) * (1 - C01((t - Se(6) + 0.1) / 0.3))); P.particulas(ctx, t, { tipo: 'polvo', n: 40, a: 0.3, col: '255,220,170', seed: 5 }); return v; };
 const cotaTorre = (ctx, t, c, a) => { if (a <= 0) return; const b = pr3(c, [2210, 0, -16]), tp = pr3(c, [2210, 199, -16]); if (!b || !tp) return; const L = pl(), x = b[0] + 120, h = b[1] - tp[1];
  ctx.save(); ctx.globalAlpha = a; L.linea(ctx, [[x, b[1]], [x, lerp(b[1], tp[1], E.out(C01(a * 1.2)))]], { cota: a > 0.95, ancho: 4, t }); L.linea(ctx, [[b[0] + 40, tp[1]], [x + 30, tp[1]]], { ancho: 2, t }); L.linea(ctx, [[b[0] + 40, b[1]], [x + 30, b[1]]], { ancho: 2, t });
  const ae = C01((t - Tk.edificio + 0.2) / 0.5); if (ae > 0) { const bw = 150, bx = b[0] - 300; ctx.globalAlpha = a * ae; ctx.fillStyle = 'rgba(18,59,122,0.55)'; ctx.fillRect(bx, b[1] - h, bw, h); ctx.strokeStyle = 'rgba(235,244,255,0.95)'; ctx.lineWidth = 4; ctx.strokeRect(bx, b[1] - h, bw, h); ctx.strokeStyle = 'rgba(235,244,255,0.55)'; ctx.lineWidth = 1.5; for (let k = 1; k < 65; k++) { const y = b[1] - (h * k) / 65; ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx + (k % 5 ? bw * 0.35 : bw), y); ctx.stroke(); } nota(ctx, '65 PISOS', bx + bw / 2, b[1] + 40, { px: 32, al: 'center', a: 1 }); }
  ctx.restore(); };
 const ventana = (c, t) => { const s = SISMO(t), q = pr3(c, [carX(t) + sismoDX(t, s).tablero + 2.15, YD + ondaD(carX(t), t, s) + 1.25, CARZ]); return q ? [q[0], q[1]] : [540, 960]; };
 // DENTRO DEL CARRO, desde los ojos del conductor: la mano grande aprieta el volante que vibra; por el parabrisas, el tablero ondulando y los cables
 const conductor = (ctx, t) => { const s = SISMO(t), x = carX(t) + sismoDX(t, s).tablero, y = YD + ondaD(carX(t), t, s), fr = Math.round(t * 30), R = H.rng(700 + fr), j = 10 * s;
  const c = cam3([x + 2.2 + (R() - 0.5) * 0.02 * s, y + 1.25 + (R() - 0.5) * 0.03 * s, CARZ + 0.55], [x + 60, y + 1.0, CARZ + 1.2], 760);
  cielo(ctx, c, t, s); puente(ctx, c, t, 'real', { sismo: s, carro: false });
  ctx.save(); ctx.translate((R() - 0.5) * j, (R() - 0.5) * j);
  ctx.fillStyle = '#0b0c10'; ctx.beginPath(); ctx.moveTo(-40, -40); ctx.lineTo(W + 40, -40); ctx.lineTo(W + 40, 300); ctx.quadraticCurveTo(540, 220, -40, 300); ctx.closePath(); ctx.fill();                    // techo
  ctx.beginPath(); ctx.moveTo(-40, 260); ctx.lineTo(130, 290); ctx.lineTo(10, 1300); ctx.lineTo(-40, 1300); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(W + 40, 260); ctx.lineTo(W - 130, 290); ctx.lineTo(W - 10, 1300); ctx.lineTo(W + 40, 1300); ctx.closePath(); ctx.fill();   // parantes
  ctx.fillStyle = '#16181e'; ctx.fillRect(440, 270, 200, 70); ctx.fillStyle = 'rgba(255,200,150,0.25)'; ctx.fillRect(450, 280, 180, 50);                                                                              // retrovisor
  const gd = ctx.createLinearGradient(0, 1180, 0, HH); gd.addColorStop(0, '#26272d'); gd.addColorStop(0.1, '#141519'); gd.addColorStop(1, '#08080a'); ctx.fillStyle = gd; ctx.beginPath(); ctx.moveTo(-40, 1260); ctx.quadraticCurveTo(540, 1150, W + 40, 1260); ctx.lineTo(W + 40, HH + 40); ctx.lineTo(-40, HH + 40); ctx.closePath(); ctx.fill();   // tablero del carro
  ctx.fillStyle = 'rgba(255,190,130,0.25)'; ctx.fillRect(-40, 1205, W + 80, 3);
  // el volante (vibra con el temblor) y la mano que lo aprieta
  const vx = 540 + (R() - 0.5) * j * 1.5, vy = 1640 + (R() - 0.5) * j * 1.5; ctx.strokeStyle = '#3b3e47'; ctx.lineWidth = 64; ctx.beginPath(); ctx.ellipse(vx, vy, 470, 330, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke(); ctx.strokeStyle = 'rgba(255,205,160,0.55)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(vx, vy - 26, 470, 330, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  ctx.fillStyle = '#2e3038'; ctx.beginPath(); ctx.ellipse(vx, vy + 40, 150, 100, 0, 0, TAU); ctx.fill(); ctx.fillRect(vx - 420, vy - 10, 840, 60);
  P.manoR(ctx, 'puno', vx - 330 + (R() - 0.5) * j, vy - 250 + (R() - 0.5) * j, 470, { t, ang: 0.5 });
  ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#ffd9b0'; ctx.beginPath(); ctx.moveTo(130, 290); ctx.lineTo(600, 290); ctx.lineTo(260, 1200); ctx.lineTo(60, 1200); ctx.closePath(); ctx.fill(); ctx.restore();   // reflejo del parabrisas
 };
 const mundoPlano = (ctx, t, o = {}) => { const c = o.cam || camMundo(t), L = pl(); L.fondo(ctx, t);
  // el agua y el fondo del mar en el plano (línea de agua punteada)
  const hy = 960 + c.f * Math.tan(c.pit); const a0 = pr3(c, [c.p[0] - 3000, 0, 0]), b0 = pr3(c, [c.p[0] + 3000, 0, 0]); if (a0 && b0) L.linea(ctx, [[a0[0], a0[1]], [b0[0], b0[1]]], { punteada: true, ancho: 2, t });
  const fy = pr3(c, [c.p[0], -35, 0]); if (fy) { ctx.save(); ctx.strokeStyle = 'rgba(235,244,255,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, fy[1]); ctx.lineTo(W, fy[1]); ctx.stroke(); ctx.restore(); L.forma(ctx, { tipo: 'rect', x: -20, y: fy[1], w: W + 40, h: 400 }, { rol: 'sombra', t }); }
  const sdp = sismoDX(t, o.sismo || 0); for (const tx of [1055, 2210]) for (let k = -2; k <= 2; k++) { const a = pr3(c, [tx + sdp.suelo + k * 9, -3, -24]), b = pr3(c, [tx + sdp.suelo + k * 9, -93, -24]); if (a && b) L.linea(ctx, [[a[0], a[1]], [b[0], b[1]]], { ancho: 2.5, t }); }
  puente(ctx, c, t, 'plano', { sismo: o.sismo || 0, carro: false, acentoPend: o.acentoPend, acentoCable: o.acentoCable });
  // columnas que NO tiene (el «se apoya»), punteadas y tachadas en rojo
  if (o.columnas > 0) { ctx.save(); ctx.globalAlpha = o.columnas; for (let x = 1960; x <= 2170; x += 70) { const a = pr3(c, [x, YD - 4.5, -12]), b = pr3(c, [x, -30, -12]); if (!a || !b) continue; L.linea(ctx, [[a[0], a[1]], [b[0], b[1]]], { punteada: true, ancho: 3, t }); } if (o.tache > 0) { const p1 = pr3(c, [1950, YD - 10, -12]), p2 = pr3(c, [2185, -30, -12]), p3 = pr3(c, [2185, YD - 10, -12]), p4 = pr3(c, [1950, -30, -12]); if (p1 && p2) { L.linea(ctx, [[p1[0], p1[1]], [p2[0], p2[1]]], { rol: 'rojo', ancho: 7, p: C01(o.tache * 2), t }); L.linea(ctx, [[p3[0], p3[1]], [p4[0], p4[1]]], { rol: 'rojo', ancho: 7, p: C01(o.tache * 2 - 1), t }); } } ctx.restore(); }
 };
 // la sección del tablero: cajón de acero aerodinámico (recuadro del plano)
 const seccion = (ctx, t, a) => { if (a <= 0) return; const L = pl(), x = 540, y = 1690, s = 13; ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(8,30,70,0.7)'; ctx.fillRect(110, 1500, 860, 360); ctx.strokeStyle = 'rgba(235,244,255,0.8)'; ctx.lineWidth = 3; ctx.strokeRect(110, 1500, 860, 360);
  L.forma(ctx, { tipo: 'poli', pts: [[x - 26 * s, y], [x - 30 * s, y - 2 * s], [x + 30 * s, y - 2 * s], [x + 26 * s, y], [x + 18 * s, y + 4 * s], [x - 18 * s, y + 4 * s]].map((q) => [q[0], q[1] - 20]) }, { rol: 'objeto2', t });
  L.linea(ctx, [[x - 30 * s, y - 2 * s - 60], [x - 30 * s, y - 2 * s - 20]], { ancho: 2, t }); L.linea(ctx, [[x + 30 * s, y - 2 * s - 60], [x + 30 * s, y - 2 * s - 20]], { ancho: 2, t });
  nota(ctx, 'TABLERO: CAJÓN DE ACERO', x, 1550, { px: 34, al: 'center', col: '#fff2b8' }); nota(ctx, 'colgado de las péndolas', x, 1810, { px: 32, al: 'center', a: 0.85 }); ctx.restore(); };

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
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 6; for (let k = 1; k < 6; k++) { ctx.beginPath(); for (let x = -400; x <= 1500; x += 40) ctx.lineTo(x, yf + k * 150 + 20 * Math.sin(x * 0.006 + k)); ctx.stroke(); }
  // la pata de la torre que baja hasta el encepado
  const gt = ctx.createLinearGradient(380, 0, 700, 0); gt.addColorStop(0, '#3e5566'); gt.addColorStop(0.5, '#7d93a0'); gt.addColorStop(1, '#2c3d4a'); ctx.fillStyle = gt; ctx.fillRect(400, -900, 280, ys + 902 - 902 + 900); ctx.fillRect(400, -900, 280, 1100);
  // encepado
  const ge = ctx.createLinearGradient(0, ys, 0, ye); ge.addColorStop(0, '#8aa1ad'); ge.addColorStop(1, '#3a4d59'); ctx.fillStyle = ge; ctx.fillRect(120, ys - 20, 840, ye - ys + 20);
  // pilotes (2,65 m de diámetro) hasta 90 m
  for (let k = 0; k < 6; k++) { const x = 170 + k * 148, w = 2.65 * m * 1.6; const gp = ctx.createLinearGradient(x, 0, x + w, 0); gp.addColorStop(0, '#2c3b45'); gp.addColorStop(0.45, '#8399a4'); gp.addColorStop(1, '#22303a'); ctx.fillStyle = gp; ctx.fillRect(x, ye, w, yp - ye); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x, yf, w, yp - yf); ctx.strokeStyle = '#030a14'; ctx.lineWidth = 7; ctx.strokeRect(x, ye, w, yp - ye); ctx.fillStyle = 'rgba(190,230,255,0.55)'; ctx.fillRect(x + w * 0.38, ye, 5, yp - ye); for (let yb = ye + 90; yb < yp; yb += 130) { ctx.fillStyle = 'rgba(3,10,20,0.6)'; ctx.fillRect(x, yb, w, 5); } }
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
 const RUEDA = [S(15) + 4.3, S(15) + 5.0], ENTRA = [S(15) + 1.7, S(15) + 2.2], SALE = [S(15) + 3.25, S(15) + 3.75];   // ventanilla → conductor → rueda                                       // la cámara entra en la rueda del carro
 const TIT = (ctx, s, t, t0, t1, clave, px = 88, y = 560) => P.titular(ctx, s, 540, y, t, t0, t1, { px, clave, col: RO });
 const CNT = (ctx, t, v, t0, t1, o) => { t0 -= 0.3; if (t < t0 || t > t1) return; const a = 1 - C01((t - t1 + 0.25) / 0.25); P.contador(ctx, t, 540, 620, v, Object.assign({ t0, px: 112, final: v, a, colFinal: '#fff2b8' }, o)); if (t > t0 + 0.2) P.fuenteCifra(ctx, o.fuente, 540, 790, { a: 0.92 * a }); };

 const B = [];
 // --- beat 1: la rueda sobre la junta (gancho) ---
 B.push({ t0: 0, t1: S(2) - 0.05, in: { type: 'cut' }, draw(ctx, t) { PLANO = 0; if (PORTADA) { rueda(ctx, 0); return; }
  rueda(ctx, t); TIT(ctx, '3 KM SOBRE LA', t, -0.3, S(2) - 0.3, '', 92, 500); TIT(ctx, 'FALLA', t, -0.3, S(2) - 0.3, 'FALLA', 120, 620);
 }, sfx(k) {
    k.play('thud', Tk.tresKm + 0.35, { f: 58, gain: 0.4 });                                                                      // el golpe de la junta
 } });
 // --- beat 2: el plano de la falla de 1960 (corte 1) ---
 B.push({ t0: S(2) - 0.05, t1: S(4) - 0.05, in: { type: 'piel', d: 0.6 }, draw(ctx, t) { PLANO = 1;
  mapa(ctx, t);
  CNT(ctx, t, 1000, Tk.mil - 0.05, S(3) + 0.9, { unidad: 'KM', etiqueta: 'SE ROMPIÓ LA FALLA', fuente: 'USGS · U. de Chile (900–1.000 km)' });
  TIT(ctx, 'JUSTO DENTRO', t, S(3) + 1.0, S(4) - 0.2, 'DENTRO', 104);
 }, sfx(k) { k.play('thud', Tk.mil + 0.35, { f: 62, gain: 0.4 }); FX.clave(k, Tk.dentro); } });
 // --- beat 3: el puente (corte 2) y todo lo demás, con la cámara continua ---
 B.push({ t0: S(4) - 0.05, t1: DURATION, in: { type: 'piel', d: 0.6 }, draw(ctx, t) {
  if (PORTADA) { PLANO = 0; rueda(ctx, 0); return; }
  const sis = SISMO(t);
  if (t < AGUA[0]) { PLANO = 0; mundoReal(ctx, t); }
  else if (t < AGUA[1]) { PLANO = 0; const c0 = camMundo(AGUA[0]); P.atravesar(ctx, t, AGUA[0], AGUA[1], (c) => mundoReal(c, t, { cam: c0 }), (c) => bajoAgua(c, t), { centro: [540, 1000], zoom: 6 }); }
  else if (t < SUBE[0]) { PLANO = 0; bajoAgua(ctx, t); }
  else if (t < SUBE[1]) { PLANO = 0; const c1 = camMundo(SUBE[1]); P.salir(ctx, t, SUBE[0], SUBE[1], (c) => bajoAgua(c, t), (c) => mundoReal(c, t, { cam: c1 }), { centro: [540, 1000], zoom: 6 }); }
  else if (t < AP[0]) { PLANO = 0; mundoReal(ctx, t, { sismo: sis }); }
  else if (t < AP[1]) { const u = E.inOut(C01((t - AP[0]) / (AP[1] - AP[0]))); PLANO = u; mundoReal(ctx, t, { sismo: sis }); ctx.save(); ctx.globalAlpha = u; mundoPlano(ctx, t, { sismo: sis }); ctx.restore(); }
  else if (t < RE[0]) { PLANO = 1; const col = C01((t - AP[1] + 0.1) / 0.3) * (1 - C01((t - S(13)) / 0.3)), tache = C01((t - Tk.apoya + 0.4) / 0.6);
   mundoPlano(ctx, t, { sismo: sis, columnas: col, tache, acentoPend: C01((t - S(13)) / 0.4) * (1 - C01((t - S(14) - 1.2) / 0.5)), acentoCable: t > S(13) && t < S(14) + 1.2 });
   seccion(ctx, t, C01((t - S(14) + 0.1) / 0.4) * (1 - C01((t - Tk.mecerse + 0.6) / 0.4))); }
  else if (t < RE[1]) { const u = E.inOut(C01((t - RE[0]) / (RE[1] - RE[0]))); PLANO = 1 - u; mundoPlano(ctx, t, { sismo: sis }); ctx.save(); ctx.globalAlpha = u; mundoReal(ctx, t, { sismo: sis }); ctx.restore(); }
  else if (t < ENTRA[0]) { PLANO = 0; mundoReal(ctx, t, { sismo: sis }); }
  else if (t < ENTRA[1]) { PLANO = 0; const c3 = camMundo(ENTRA[0]); P.atravesar(ctx, t, ENTRA[0], ENTRA[1], (c) => mundoReal(c, ENTRA[0], { cam: c3, sismo: SISMO(ENTRA[0]) }), (c) => conductor(c, t), { centro: ventana(c3, ENTRA[0]), zoom: 7 }); }
  else if (t < SALE[0]) { PLANO = 0; conductor(ctx, t); }
  else if (t < SALE[1]) { PLANO = 0; const c4 = camMundo(SALE[1]); P.salir(ctx, t, SALE[0], SALE[1], (c) => conductor(c, t), (c) => mundoReal(c, SALE[1], { cam: c4, sismo: SISMO(SALE[1]) }), { centro: ventana(c4, SALE[1]), zoom: 7 }); }
  else if (t < RUEDA[0]) { PLANO = 0; mundoReal(ctx, t, { sismo: sis }); }
  else if (t < RUEDA[1]) { PLANO = 0; const c2 = camMundo(RUEDA[0]), wc = pr3(c2, [carX(RUEDA[0]) + sismoDX(RUEDA[0], sis).tablero + RUEDA_D, YD + ondaD(carX(RUEDA[0]), RUEDA[0], sis) + 0.34, CARZ]) || [540, 960]; P.atravesar(ctx, t, RUEDA[0], RUEDA[1], (c) => mundoReal(c, RUEDA[0], { cam: c2, sismo: SISMO(RUEDA[0]) }), (c) => rueda(c, t - DURATION, { vib: 1, mece: 0.03 * Math.sin(t * 1.6) }), { centro: [wc[0], wc[1]], zoom: 7 }); }
  else { PLANO = 0; const fin = C01((t - (DURATION - 1.4)) / 1.2); rueda(ctx, t - DURATION, { vib: 1, mece: 0.03 * Math.sin(t * 1.6) * (1 - fin) }); }
  // textos grandes (uno a la vez)
  TIT(ctx, '¿AQUÍ?', t, S(4) + 0.6, Se(4) + 0.3, 'AQUÍ?', 130);
  if (t > S(5) + 0.3 && t < Se(5) + 0.2) P.fuenteCifra(ctx, '2.750 m · apertura prevista 2028 (MOP)', 540, 1380, { a: 0.9 * C01((t - S(5) - 0.3) / 0.3) });
  CNT(ctx, t, 199, Tk.ciento - 0.05, Se(6) + 0.1, { unidad: 'M', etiqueta: '≈ 65 PISOS', fuente: 'MOP · UACh (pila norte)' });
  TIT(ctx, '¿QUÉ LAS SOSTIENE?', t, S(7) - 0.05, Se(7) + 0.4, 'SOSTIENE?', 66);
  CNT(ctx, t, 90, Tk.noventa - 0.05, Tk.catorce - 0.5, { unidad: 'M', etiqueta: 'PILOTES', fuente: 'MOP · UACh (hasta 90 m)' });
  CNT(ctx, t, 14, Tk.catorce - 0.05, Se(9) + 0.1, { unidad: 'KM/H', etiqueta: 'LA CORRIENTE', fuente: 'UC · UdeC (≈ 4 m/s)' });
  TIT(ctx, '¿Y SI TIEMBLA?', t, S(11) - 0.05, Se(11) + 0.5, 'TIEMBLA?', 96);
  P.tachado(ctx, 'SE APOYA', 540, 560, t, S(12) - 0.05, S(13) - 0.05, { px: 100 });
  TIT(ctx, 'CUELGA', t, S(13) - 0.02, S(14) + 0.2, 'CUELGA', 130);
  TIT(ctx, 'PUEDE MECERSE', t, Tk.mecerse - 0.3, Se(14) + 0.2, 'MECERSE', 92);
  if (t > Tk.mecerse && t < Se(14)) P.fuenteCifra(ctx, 'Principio general de los puentes colgantes', 540, 700, { a: 0.9 });
  TIT(ctx, '3 KM SOBRE LA', t, DURATION - 1.15, 0, '', 92, 500); TIT(ctx, 'FALLA', t, DURATION - 1.15, 0, 'FALLA', 120, 620);
  if (t > DURATION - 1.2) P.marca(ctx, t, DURATION - 0.9);
 }, sfx(k) {   // ≤ 3 sonidos por cada 10 s; «tin» (FX.clave) 3 veces: «dentro», 14 km/h, «quebrarse»
  k.noise(S(4) + 0.5, { dur: Se(7) - S(4), color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.04, a: 1.0, hold: Se(7) - S(4) - 2 });   // viento sobre el canal (continuo)
  k.play('thud', Tk.ciento + 0.4, { f: 60, gain: 0.4 });                                                                                   // 199 m: golpe al final
  k.tone(AGUA[0] + 0.2, { f: 64, dur: SUBE[1] - AGUA[0], gain: 0.08, a: 0.3, hold: SUBE[1] - AGUA[0] - 1 }); k.tone(AGUA[0] + 0.2, { f: 96, dur: SUBE[1] - AGUA[0], gain: 0.03, a: 0.3, hold: SUBE[1] - AGUA[0] - 1 });   // bajo el agua: la corriente (continua)
  k.play('thud', Tk.noventa + 0.4, { f: 55, gain: 0.4 }); FX.clave(k, Tk.catorce + 0.45);
  k.play('thud', Tk.apoya, { f: 70, gain: 0.35 });                                                                                         // el tachado
  const r0 = S(11) - 0.3, rd = DURATION - 0.4 - r0; k.tone(r0, { f: 38, dur: rd, gain: 0.14, a: 0.8, hold: rd - 2.2 }); k.tone(r0, { f: 57, dur: rd, gain: 0.05, a: 0.8, hold: rd - 2.2 });   // el sismo: UN retumbo grave continuo
  FX.clave(k, Tk.quebrarse + 0.1);
 } });

 const EP = PL.make({
  estilo: 'engineering_blueprint', modo: 'viral', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  capOcultar: [[0, S(2) - 0.05], [DURATION - 1.2, DURATION + 1]],
  recuadro: [['falla', S(2), S(3)], ['cuelga', S(13), S(14)], ['mecerse', S(14), S(15)]],
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
