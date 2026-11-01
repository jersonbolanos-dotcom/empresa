// =====================================================================================================
// episodio.js — «¿Cómo funciona realmente un aire acondicionado?» · Asombroteca · PLANTILLA ASOMBROTECA v1.4
// Concepto: SEGUIR EL VIAJE DEL CALOR. Un único sistema split espacialmente coherente (corte del edificio):
//   habitación (izq.) con la unidad interior · muro exterior con ventana · unidad exterior en el suelo (der.).
// El refrigerante recorre SIEMPRE el mismo circuito: válvula de expansión → línea de líquido → evaporador →
// línea de succión → acumulador → compresor (rotativo) → descarga → condensador → línea de líquido → válvula.
// FASE (líquido / vapor / mezcla) y TEMPERATURA (rampa azul→rojo) se dibujan por separado (P.fluid).
// Reloj = segundos de la voz original (ElevenLabs, plan con licencia comercial). Todo determinista.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  no0: wt(0, 'no'), frio0: wt(0, 'frío'), realidad: SG(1).s, sacar: wt(1, 'sacar'), calor1: wt(1, 'calor'), expulsarlo: wt(1, 'expulsarlo'), exterior1: wt(1, 'exterior'),
  pero2: SG(2).s, como: SG(3).s, todo4: SG(4).s, sustancia: wt(4, 'sustancia'), refrigerante4: wt(4, 'refrigerante'),
  circula: wt(5, 'circula'), circuito: wt(5, 'circuito'), cerrado: wt(5, 'cerrado'),
  primero: SG(6).s, evaporador6: wt(6, 'evaporador'), dentro6: wt(6, 'dentro'),
  alli7: SG(7).s, absorbe: wt(7, 'absorbe'), calor7: wt(7, 'calor'), evapora: wt(7, 'evapora'), liquido7: wt(7, 'líquido'), gas: wt(7, 'gas'),
  un8: SG(8).s, ventilador8: wt(8, 'ventilador'), impulsa: wt(8, 'impulsa'), traves: wt(8, 'través'), devolviendolo: wt(8, 'devolviéndolo'), fresco: wt(8, 'fresco'),
  pero9: SG(9).s, absorbido: wt(9, 'absorbido'), energia9: wt(9, 'energía'), que10: SG(10).s,
  aqui11: SG(11).s, compresor: wt(11, 'compresor'), comprime: wt(11, 'comprime'), presion11: wt(11, 'presión'), temperatura11: wt(11, 'temperatura'),
  despues: SG(12).s, caliente12: wt(12, 'caliente'), viaja: wt(12, 'viaja'), condensador: wt(12, 'condensador'), unidad12: wt(12, 'unidad'),
  alli13: SG(13).s, ventilador13: wt(13, 'ventilador'), liberar: wt(13, 'liberar'), ambiente: wt(13, 'ambiente'), mientras: wt(13, 'mientras'), convierte: wt(13, 'convierte'), liquido13: wt(13, 'líquido'),
  pero14: SG(14).s, paso: wt(14, 'paso'),
  el15: SG(15).s, valvula: wt(15, 'válvula'), expansion: wt(15, 'expansión'), presion15: wt(15, 'presión'), bruscamente: wt(15, 'bruscamente'), permitiendo: wt(15, 'permitiendo'), evaporador15: wt(15, 'evaporador'), temperatura15: wt(15, 'temperatura'), baja: wt(15, 'baja'),
  y16: SG(16).s, ciclo: wt(16, 'ciclo'), nuevo: wt(16, 'nuevo'),
  asi17: SG(17).s, enciendas: wt(17, 'enciendas'), recuerda: wt(17, 'recuerda'),
  no18: SG(18).s, creando: wt(18, 'creando'), nada: wt(18, 'nada'),
  esta19: SG(19).s, transportando: wt(19, 'transportando'), calor19: wt(19, 'calor'), exterior19: wt(19, 'exterior'), vez: wt(19, 'vez'),
  sigue: SG(20).s, asombroteca: wt(20, 'asombroteca'), end: A.speech_end,
 };

 // ================= GEOMETRÍA DEL MUNDO (una sola escena coherente) =================
 const ROOM = { x0: -1000, x1: 0, y0: -1000, y1: 0 }, WALL = { x0: 0, x1: 90 };
 const IU = { x0: -470, x1: -70, y0: -880, y1: -720 };            // unidad interior
 const OU = { x0: 200, x1: 900, y0: 420, y1: 880 };              // unidad exterior
 const FAN = { x: 680, y: 650, r: 175 }, COMP = { x0: 290, x1: 380, y0: 580, y1: 850 }, ACC = { x0: 236, x1: 276, y0: 610, y1: 780 }, EEV = { x: 430, y0: 520, y1: 560 };
 const WINDOW = { y0: -620, y1: -300 };
 // circuito por tramos: [nombre, puntos, ancho, fase(v), temperatura(v), estilo de tubo]
 const serp = (x0, x1, ys) => { const o = []; ys.forEach((y, i) => { if (i % 2 === 0) { o.push([x0, y], [x1, y]); } else { o.push([x1, y], [x0, y]); } }); return o; };
 const EVAP = serp(-90, -450, [-795, -815, -835, -855]).map(([x, y]) => [x, y]);   // entra abajo-dcha, sale arriba-dcha
 const CONDR = serp(480, 875, [460, 507, 554, 601, 648, 695, 742, 789]);             // entra arriba-izq, sale abajo-izq
 const SEGS = [
  { n: 'liquido', pts: [[480, 789], [480, 850], [430, 850], [430, EEV.y1]], w: 9, ph: () => 0, tp: () => 0.62, pipe: 'cobre' },
  { n: 'valvula', pts: [[430, EEV.y1], [430, EEV.y0]], w: 9, ph: (v) => 0.25 * v, tp: (v) => lerp(0.62, 0.12, v), pipe: 'valvula' },
  { n: 'linea', pts: [[430, EEV.y0], [430, 500], [200, 500], [130, 500], [130, -800], [-50, -800], [-90, -795]], w: 9, ph: () => 0.25, tp: () => 0.12, pipe: 'cobre' },
  { n: 'evaporador', pts: EVAP, w: 8, ph: (v) => cl(0.25 + 0.75 * v / 0.85), tp: (v) => lerp(0.12, 0.17, v), pipe: 'serpentin' },
  { n: 'succion', pts: [[-90, -855], [-90, -860], [-50, -860], [0, -860], [110, -860], [110, 470], [200, 470], [256, 470], [256, ACC.y0]], w: 16, ph: () => 1, tp: (v) => lerp(0.18, 0.26, v), pipe: 'aislado' },
  { n: 'acumulador', pts: [[256, ACC.y0], [256, 790], [300, 805], [335, 805]], w: 14, ph: () => 1, tp: () => 0.26, pipe: 'cobre' },
  { n: 'compresor', pts: [[335, 805], [335, 600]], w: 16, ph: () => 1, tp: (v) => lerp(0.26, 0.95, E.inOut(v)), pipe: 'interno' },
  { n: 'descarga', pts: [[335, 600], [335, 460], [480, 460]], w: 10, ph: () => 1, tp: () => 0.95, pipe: 'cobre' },
  { n: 'condensador', pts: CONDR, w: 8, ph: (v) => (v < 0.15 ? 1 : v > 0.8 ? 0 : 1 - (v - 0.15) / 0.65), tp: (v) => (v < 0.15 ? lerp(0.95, 0.8, v / 0.15) : v < 0.8 ? 0.78 : lerp(0.78, 0.62, (v - 0.8) / 0.2)), pipe: 'serpentin' },
 ];
 SEGS.forEach((s) => (s.path = P.path(s.pts)));
 const CIRCUIT = P.path(SEGS.flatMap((s, i) => (i ? s.pts.slice(1) : s.pts)));
 const SPEED = 55; // px/s de recorrido visual del refrigerante (didáctico)

 // ================= DIBUJO DEL MUNDO =================
 let BG = null;
 function bgLayer() { // cielo, sol, suelo y ciudad lejana (estático, en caché a media resolución)
  if (BG) return BG; const c = H.layer(1300, 1200), x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 1200); g.addColorStop(0, '#2c6fb3'); g.addColorStop(0.6, '#8cc4e8'); g.addColorStop(1, '#f2d7a6'); x.fillStyle = g; x.fillRect(0, 0, 1300, 1200);
  const R = H.rng(12); x.fillStyle = 'rgba(70,95,125,0.45)'; for (let i = 0; i < 14; i++) { const w = R.range(40, 110), h = R.range(120, 380); x.fillRect(i * 95 + R.range(-10, 10), 1150 - h, w, h); }
  return (BG = c);
 }
 function world(ctx, t, st) {
  // ---- exterior: cielo y suelo (cubren todo el encuadre posible)
  { const sk = ctx.createLinearGradient(0, -3200, 0, 900); sk.addColorStop(0, '#163f73'); sk.addColorStop(0.6, '#2c6fb3'); sk.addColorStop(1, '#f2d7a6'); ctx.fillStyle = sk; ctx.fillRect(90, -3200, 3000, 4100); }
  ctx.drawImage(bgLayer(), 90, -1250, 1300, 2150);
  const sg = ctx.createRadialGradient(1000, -900, 10, 1000, -900, 420); sg.addColorStop(0, 'rgba(255,240,190,1)'); sg.addColorStop(0.15, 'rgba(255,220,140,0.8)'); sg.addColorStop(1, 'rgba(255,220,140,0)'); ctx.fillStyle = sg; ctx.fillRect(580, -1320, 840, 840);
  ctx.fillStyle = '#6f6253'; ctx.fillRect(90, 900, 3000, 2600); ctx.fillStyle = '#857766'; ctx.fillRect(90, 900, 1300, 10);
  // aire exterior caliente (calor expulsado)
  if (st.outHeat > 0) { const og = ctx.createRadialGradient(900, 620, 30, 900, 620, 520); og.addColorStop(0, `rgba(255,110,60,${0.32 * st.outHeat})`); og.addColorStop(1, 'rgba(255,110,60,0)'); ctx.fillStyle = og; ctx.fillRect(380, 100, 1040, 1040); }
  // ---- edificio: planta inferior, losa, techo
  ctx.fillStyle = '#2a2420'; ctx.fillRect(-3000, 60, 3000, 3400); ctx.fillStyle = '#231e1a'; ctx.fillRect(-3000, -3200, 3090, 2140);
  ctx.fillStyle = '#4a423b'; ctx.fillRect(-1400, 0, 1490, 60); ctx.fillRect(-1400, -1070, 1490, 70);
  // ---- habitación
  const rg = ctx.createLinearGradient(0, -1000, 0, 0); rg.addColorStop(0, '#d9c9b3'); rg.addColorStop(1, '#bfa98d'); ctx.fillStyle = rg; ctx.fillRect(-1400, -1000, 1400, 1000);
  ctx.fillStyle = '#8a6f55'; ctx.fillRect(-1400, -60, 1400, 60); // zócalo / suelo de madera
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let x = -1400; x < 0; x += 120) ctx.fillRect(x, -60, 2, 60);
  // muebles simples (sofá y planta) para escala cotidiana
  ctx.fillStyle = '#5b6b7d'; ctx.beginPath(); ctx.roundRect(-900, -260, 420, 200, 30); ctx.fill(); ctx.fillStyle = '#6d7f93'; ctx.beginPath(); ctx.roundRect(-920, -330, 460, 110, 30); ctx.fill();
  ctx.fillStyle = '#3e2f22'; ctx.fillRect(-300, -170, 90, 110); ctx.fillStyle = '#4f8a52'; ctx.beginPath(); ctx.ellipse(-255, -230, 70, 90, 0, 0, TAU); ctx.fill();
  // luz del sol entrando por la ventana
  const sun = st.sun;
  if (sun > 0) { ctx.save(); ctx.globalAlpha = 0.28 * sun; ctx.fillStyle = '#ffe2a0'; ctx.beginPath(); ctx.moveTo(0, WINDOW.y0); ctx.lineTo(0, WINDOW.y1); ctx.lineTo(-640, -60); ctx.lineTo(-980, -60); ctx.closePath(); ctx.fill(); ctx.restore(); }
  // tinte térmico de la habitación: caliente (naranja) → fresca (azul)
  const hot = st.roomHot;
  ctx.save(); ctx.globalAlpha = 0.28 * Math.abs(hot - 0.5) * 2; ctx.fillStyle = hot > 0.5 ? '#ff7a3d' : '#3da5ff'; ctx.fillRect(-1400, -1000, 1400, 940); ctx.restore();
  if (hot > 0.55) { ctx.save(); ctx.strokeStyle = `rgba(255,170,90,${0.25 * (hot - 0.5) * 2})`; ctx.lineWidth = 3; for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let j = 0; j <= 20; j++) { const y = -100 - j * 40, x = -880 + k * 120 + Math.sin(j * 0.6 + t * 2 + k) * 10; j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); } ctx.restore(); }
  // ---- muro exterior (corte con rayado de hormigón) y ventana
  ctx.fillStyle = '#9c958b'; ctx.fillRect(WALL.x0, -1070, WALL.x1 - WALL.x0, 2400);
  ctx.save(); ctx.beginPath(); ctx.rect(WALL.x0, -1070, WALL.x1 - WALL.x0, 2400); ctx.clip(); ctx.strokeStyle = 'rgba(60,55,50,0.35)'; ctx.lineWidth = 2; for (let y = -1100; y < 1400; y += 26) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(90, y - 40); ctx.stroke(); } ctx.restore();
  ctx.fillStyle = 'rgba(190,225,255,0.55)'; ctx.fillRect(WALL.x0, WINDOW.y0, WALL.x1 - WALL.x0, WINDOW.y1 - WINDOW.y0); ctx.fillStyle = '#e7e3dc'; ctx.fillRect(WALL.x0, WINDOW.y0 - 8, 90, 8); ctx.fillRect(WALL.x0, WINDOW.y1, 90, 8); ctx.fillRect(40, WINDOW.y0, 8, WINDOW.y1 - WINDOW.y0);
  // ---- unidad exterior (cuerpo, interior en corte técnico) y unidad interior
  outdoorUnit(ctx, t, st);
  pipes(ctx, t, st);
  indoorUnit(ctx, t, st);
  // flujos de aire
  if (st.on > 0) {
   P.airStreaks(ctx, P.path([[-270, -990], [-270, -930], [-270, -885]]), t, { n: 10, speed: 120, len: 40, temp: 0.72, spread: 300, a: 0.8 * st.airIn, seed: 4 });
   P.airStreaks(ctx, P.path([[-270, -705], [-300, -660], [-400, -600], [-560, -540], [-760, -500]]), t, { n: 16, speed: 230, len: 42, temp: 0.12, spread: 200, a: 0.75 * st.on * st.airOut, seed: 7, w: 3.5 });
   P.airStreaks(ctx, P.path([[FAN.x, FAN.y], [900, 600], [1200, 500]]), t, { n: 18, speed: 300, len: 80, temp: 0.85, spread: 260, a: st.on * st.airOutdoor, seed: 9, w: 5 });
  }
  // flechas de calor: aire → evaporador; condensador → aire exterior
  if (st.heatIn > 0) { ctx.save(); ctx.globalAlpha = st.heatIn; for (let k = 0; k < 4; k++) { const x = -420 + k * 100, y = -950 + ((t * 60 + k * 20) % 50); P.arrow(ctx, x, y, x, -885, 1, '#ff873b', 12); } ctx.restore(); }
  if (st.heatOut > 0) { ctx.save(); ctx.globalAlpha = st.heatOut; for (let k = 0; k < 4; k++) { const y = 480 + k * 100, o = (t * 70 + k * 23) % 60; P.arrow(ctx, 900 + o, y, 1010 + o, y, 1, '#ff4558', 12); } ctx.restore(); }
 }
 function indoorUnit(ctx, t, st) {
  const { x0, x1, y0, y1 } = IU, xr = st.xrIn;
  // interior visible con el corte técnico: serpentín con aletas + ventilador de flujo cruzado
  if (xr > 0.01) {
   ctx.save(); ctx.globalAlpha = xr;
   ctx.fillStyle = '#1b2533'; ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 22); ctx.fill();
   ctx.fillStyle = 'rgba(160,175,195,0.55)'; for (let x = -450; x <= -90; x += 7) ctx.fillRect(x, -868, 2, 80); // aletas
   P.fanCross(ctx, -430, -782, 320, 36, t * (st.on > 0 ? 6 : 0));
   ctx.restore();
  }
  // carcasa (blanca, brillante) que se vuelve transparente
  ctx.save(); ctx.globalAlpha = 1 - 0.85 * xr;
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#fbfcfd'); g.addColorStop(1, '#d9dee5'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 22); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(x0 + 14, y1 - 30, x1 - x0 - 28, 8);
  ctx.restore();
  ctx.strokeStyle = `rgba(85,233,255,${0.8 * xr})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 22); ctx.stroke();
  // deflector (se abre al encender) y piloto
  const op = st.on; ctx.fillStyle = '#c9d0d9'; ctx.beginPath(); ctx.moveTo(x0 + 24, y1 - 4); ctx.lineTo(x1 - 24, y1 - 4); ctx.lineTo(x1 - 34, y1 + 4 + 22 * op); ctx.lineTo(x0 + 34, y1 + 4 + 22 * op); ctx.closePath(); ctx.fill();
  ctx.fillStyle = op > 0.5 ? '#55e9ff' : '#3a4a5a'; ctx.beginPath(); ctx.arc(x1 - 40, y1 - 40, 6, 0, TAU); ctx.fill(); if (op > 0.5) P.glow(ctx, x1 - 40, y1 - 40, 24, '85,233,255', 0.6);
  // sombra de contacto en la pared
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(x0 + 10, y1 + 2, x1 - x0 - 20, 10);
 }
 function outdoorUnit(ctx, t, st) {
  const { x0, x1, y0, y1 } = OU, xr = st.xrOut;
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, 905, 380, 18, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#5a636e'; ctx.fillRect(x0 + 40, y1, 30, 22); ctx.fillRect(x1 - 70, y1, 30, 22);
  // interior (corte técnico): condensador, compresor, acumulador, válvula
  ctx.fillStyle = '#18202b'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.fillStyle = 'rgba(160,175,195,0.5)'; for (let x = 470; x <= 885; x += 8) ctx.fillRect(x, 435, 2, 430);
  const cg = ctx.createLinearGradient(COMP.x0, 0, COMP.x1, 0); cg.addColorStop(0, '#3b4350'); cg.addColorStop(0.5, '#6b7685'); cg.addColorStop(1, '#2e353f');
  ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(COMP.x0, COMP.y0, COMP.x1 - COMP.x0, COMP.y1 - COMP.y0, 40); ctx.fill();
  ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(ACC.x0, ACC.y0, ACC.x1 - ACC.x0, ACC.y1 - ACC.y0, 18); ctx.fill();
  if (st.compGlow > 0) P.glow(ctx, (COMP.x0 + COMP.x1) / 2, 700, 160, '255,135,59', 0.45 * st.compGlow);
  ctx.fillStyle = '#b8862f'; ctx.beginPath(); ctx.roundRect(EEV.x - 14, EEV.y0, 28, EEV.y1 - EEV.y0, 6); ctx.fill(); ctx.fillStyle = '#2b2f36'; ctx.fillRect(EEV.x - 18, EEV.y0 - 30, 36, 30);
  // ventilador axial (delante)
  P.fanAxial(ctx, FAN.x, FAN.y, FAN.r, t * (st.on > 0 ? 9 : 0), { bg: 'rgba(20,26,36,0.6)' });
  // carcasa que se vuelve transparente (deja ver el ventilador por su rejilla)
  ctx.save(); ctx.globalAlpha = 1 - 0.88 * xr;
  ctx.fillStyle = '#d6dbe1'; ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.arc(FAN.x, FAN.y, FAN.r + 6, 0, TAU, true); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(x0, y1 - 26, x1 - x0, 26); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(x0, y0, x1 - x0, 8);
  ctx.restore();
  ctx.strokeStyle = `rgba(85,233,255,${0.8 * xr})`; ctx.lineWidth = 3; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
 }
 function pipes(ctx, t, st) {
  const fv = st.fluid; // 0 = tubos opacos, 1 = tubos transparentes con el refrigerante visible
  SEGS.forEach((s, i) => {
   const vis = s.pipe === 'interno' ? st.xrOut : s.pipe === 'serpentin' ? (s.n === 'evaporador' ? Math.max(st.xrIn, 0.0) : st.xrOut) : 1;
   if (vis <= 0.01 && s.pipe !== 'serpentin') return;
   const outer = s.pipe === 'aislado' ? '#1d1f24' : '#b8733a';
   if (s.pipe !== 'interno') { P.strokePath(ctx, s.pts, s.w + 6, outer, { a: (1 - 0.65 * fv) * (s.pipe === 'serpentin' ? vis : 1) }); P.strokePath(ctx, s.pts, s.w + 6, 'rgba(255,255,255,0.18)', { a: fv * 0.8 * (s.pipe === 'serpentin' ? vis : 1) }); }
   if (fv > 0.01 && vis > 0.01) P.fluid(ctx, s.path, t, { w: s.w, speed: SPEED, phase: s.ph, temp: s.tp, a: fv * vis, seed: 10 + i });
  });
  if (st.draw > 0 && st.draw < 1.2) { // trazado progresivo del circuito cerrado
   const Lp = CIRCUIT.L * cl(st.draw), pts = []; for (let s = 0; s <= Lp; s += 10) { const [x, y] = CIRCUIT.at(s); pts.push([x, y]); }
   if (pts.length > 1) { P.strokePath(ctx, pts, 30, 'rgba(85,233,255,0.25)'); P.strokePath(ctx, pts, 8, '#c9f6ff'); const [hx, hy] = pts[pts.length - 1]; P.glow(ctx, hx, hy, 60, '85,233,255', 0.9 * (1 - win(st.draw, 1, 1.2))); }
  }
 }

 // ================= CÁMARA =================
 const K = (t, fx, fy, z, sy = 840) => [t, fx, fy + (960 - sy) / z, z];
 const CAM = [
  K(0, -430, -520, 0.95), K(1.0, -400, -560, 1.05), K(3.0, -270, -800, 2.1, 700), K(T.expulsarlo - 0.1, -260, -800, 2.1, 700), K(T.pero2 + 0.2, 70, -830, 2.0, 700),
  K(T.todo4 + 0.2, 120, -320, 3.2, 700), K(T.refrigerante4 + 0.8, 120, -260, 3.2, 700), K(T.circuito, 220, 0, 0.6, 860), K(T.primero + 0.2, 220, 0, 0.6, 860),
  K(T.evaporador6 + 0.2, -270, -820, 2.3, 600), K(T.un8 - 0.2, -270, -820, 2.3, 600), K(T.impulsa + 0.4, -300, -700, 1.45, 760), K(T.pero9, -300, -700, 1.45, 760),
  K(T.absorbido + 0.4, 50, -860, 2.0, 760), K(T.que10 + 0.6, 560, 640, 1.3, 760), K(T.compresor - 0.2, 320, 700, 2.2, 560), K(T.despues, 320, 700, 2.2, 560),
  K(T.condensador + 0.2, 680, 650, 1.45, 640), K(T.pero14, 680, 650, 1.45, 640), K(T.valvula, 430, 560, 2.6, 560), K(T.y16 - 0.1, 430, 560, 2.6, 560),
  K(T.ciclo + 0.3, 220, 0, 0.6, 860), K(T.creando, 220, 0, 0.6, 860), K(T.transportando + 2.6, -420, -560, 1.0, 820), K(DURATION, -330, -640, 1.12, 820),
 ];

 // ================= INSERTOS (lupa en espacio de pantalla) =================
 const LX = 540, LY = 1110, LR = 230;
 function tubeSection(ctx, t, kind) { // tubo horizontal en corte: evaporación o condensación
  ctx.fillStyle = '#101722'; ctx.fillRect(LX - LR, LY - LR, LR * 2, LR * 2);
  const y0 = LY - 70, y1 = LY + 70, x0 = LX - LR - 10, x1 = LX + LR + 10;
  ctx.fillStyle = '#b8733a'; ctx.fillRect(x0, y0 - 16, x1 - x0, 16); ctx.fillRect(x0, y1, x1 - x0, 16);
  const R = H.rng(kind === 'evap' ? 3 : 4);
  for (let x = x0; x < x1; x += 4) { const u = (x - x0) / (x1 - x0), f = kind === 'evap' ? cl(0.2 + u * 0.95) : cl(1 - u * 1.1), tp = kind === 'evap' ? 0.12 + 0.05 * u : 0.85 - 0.2 * u, lh = (y1 - y0) * (1 - f) * 0.9; ctx.fillStyle = H.rgba(P.heat(tp)); ctx.fillRect(x, y1 - lh, 4, lh); ctx.fillStyle = H.rgba(P.heat(tp), 0.18); ctx.fillRect(x, y0, 4, y1 - y0 - lh); }
  for (let i = 0; i < 60; i++) { const sp = 50 + R() * 40, u = ((R() + t * sp / (x1 - x0)) % 1), x = x0 + u * (x1 - x0), f = kind === 'evap' ? cl(0.2 + u * 0.95) : cl(1 - u * 1.1), lh = (y1 - y0) * (1 - f) * 0.9, inLiq = R() < 0.55 && lh > 10;
   const y = inLiq ? y1 - R() * lh : y0 + 8 + R() * Math.max(8, (y1 - y0 - lh - 16));
   if (kind === 'evap' && inLiq) { ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - ((t * 30 + i) % 20), 5 + R() * 4, 0, TAU); ctx.stroke(); }
   else if (!inLiq) { ctx.fillStyle = 'rgba(230,240,255,0.7)'; ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
   if (kind === 'cond' && R() < 0.3) { ctx.fillStyle = 'rgba(200,230,255,0.9)'; ctx.beginPath(); ctx.ellipse(x, y0 + 4 + (u * 40) % 30, 4, 6, 0, 0, TAU); ctx.fill(); } }
  // flechas de calor (dirección de la transferencia)
  for (let k = 0; k < 5; k++) { const x = LX - 180 + k * 90, o = (t * 50 + k * 13) % 40; if (kind === 'evap') { P.arrow(ctx, x, LY - 210 + o, x, y0 - 22, 1, '#ff873b', 12); } else { P.arrow(ctx, x, y0 - 22 - o * 0.2, x, LY - 200 - o, 1, '#ff4558', 12); } }
 }
 function rotary(ctx, t, prog) { // compresor rotativo: rodillo excéntrico + paleta; la cámara de compresión se achica
  ctx.fillStyle = '#101722'; ctx.fillRect(LX - LR, LY - LR, LR * 2, LR * 2);
  const Rc = 165, r = 120, e = Rc - r, th = -Math.PI / 2 + 0.05 + ((t * 0.55) % 1) * (TAU - 0.1), ex = Math.cos(th) * e, ey = Math.sin(th) * e;
  const top = -Math.PI / 2 + TAU; // posición de la paleta (arriba)
  const inner = (phi) => { const ux = Math.cos(phi), uy = Math.sin(phi), d = ex * ux + ey * uy; return d + Math.sqrt(Math.max(0, r * r - (ex * ex + ey * ey) + d * d)); };
  // aspiración (frío, baja presión) = resto de la corona
  ctx.save(); ctx.translate(LX, LY);
  ctx.fillStyle = H.rgba(P.heat(0.26), 0.55); ctx.beginPath(); ctx.arc(0, 0, Rc, 0, TAU); ctx.fill();
  // cámara de compresión: de la línea de contacto (th) hasta la paleta, en el sentido de giro
  const f = (top - th) / TAU; // 1 → recién cerrada, 0 → descarga
  ctx.fillStyle = H.rgba(P.heat(0.3 + 0.65 * (1 - f)), 0.9); ctx.beginPath();
  const N = 40; for (let i = 0; i <= N; i++) { const phi = th + (top - th) * i / N; ctx.lineTo(Math.cos(phi) * Rc, Math.sin(phi) * Rc); } for (let i = N; i >= 0; i--) { const phi = th + (top - th) * i / N, s = inner(phi); ctx.lineTo(Math.cos(phi) * s, Math.sin(phi) * s); } ctx.closePath(); ctx.fill();
  // moléculas de gas: mismo número, cada vez más apretadas
  const Rr = H.rng(21); ctx.fillStyle = 'rgba(255,255,255,0.9)'; for (let i = 0; i < 26; i++) { const phi = th + (top - th) * Rr(), s0 = inner(phi), s = s0 + (Rc - s0) * (0.15 + 0.7 * Rr()); ctx.beginPath(); ctx.arc(Math.cos(phi) * s, Math.sin(phi) * s, 4, 0, TAU); ctx.fill(); }
  // rodillo, eje, cilindro, paleta
  ctx.fillStyle = '#7c8796'; ctx.beginPath(); ctx.arc(ex, ey, r, 0, TAU); ctx.fill(); ctx.fillStyle = '#4d5664'; ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.fill(); ctx.fillStyle = '#c3cbd6'; ctx.beginPath(); ctx.arc(ex * 0.35, ey * 0.35, 10, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#c3cbd6'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, Rc + 5, 0, TAU); ctx.stroke();
  const vy = -inner(-Math.PI / 2); ctx.fillStyle = '#e6eaf0'; ctx.fillRect(-9, -Rc - 60, 18, Rc + 60 + vy);
  // puertos: aspiración (izq. de la paleta) y descarga (dcha.)
  ctx.fillStyle = '#3da5ff'; ctx.fillRect(-60, -Rc - 22, 32, 22); ctx.fillStyle = '#ff4558'; ctx.fillRect(28, -Rc - 22, 32, 22);
  ctx.restore();
 }
 function valveSection(ctx, t) { // válvula de expansión: orificio estrecho; alta presión → baja presión con evaporación parcial
  ctx.fillStyle = '#101722'; ctx.fillRect(LX - LR, LY - LR, LR * 2, LR * 2);
  const y0 = LY - 55, y1 = LY + 55, x0 = LX - LR - 10, x1 = LX + LR + 10, oc = LX;
  ctx.fillStyle = '#b8862f'; ctx.beginPath(); ctx.moveTo(x0, y0 - 18); ctx.lineTo(oc - 40, y0 - 18); ctx.lineTo(oc - 8, LY - 12); ctx.lineTo(oc + 8, LY - 12); ctx.lineTo(oc + 40, y0 - 18); ctx.lineTo(x1, y0 - 18); ctx.lineTo(x1, y0); ctx.lineTo(oc + 40, y0); ctx.lineTo(oc + 8, LY - 8); ctx.lineTo(oc - 8, LY - 8); ctx.lineTo(oc - 40, y0); ctx.lineTo(x0, y0); ctx.fill();
  ctx.save(); ctx.translate(0, 2 * LY); ctx.scale(1, -1); ctx.fill(); ctx.restore();
  // aguja de la válvula
  ctx.fillStyle = '#d9dee5'; ctx.beginPath(); ctx.moveTo(oc - 6, LY - 200); ctx.lineTo(oc + 6, LY - 200); ctx.lineTo(oc + 3, LY - 14); ctx.lineTo(oc - 3, LY - 14); ctx.fill();
  // fluido: izquierda líquido denso (más tibio), derecha mezcla fría con burbujas
  ctx.fillStyle = H.rgba(P.heat(0.62), 0.9); ctx.fillRect(x0, y0, oc - 40 - x0, y1 - y0);
  ctx.fillStyle = H.rgba(P.heat(0.12), 0.75); ctx.fillRect(oc + 40, y0 + (y1 - y0) * 0.35, x1 - oc - 40, (y1 - y0) * 0.65);
  const R = H.rng(8); for (let i = 0; i < 70; i++) { const u = (R() + t * 0.6) % 1, x = oc + 30 + u * (x1 - oc - 30), y = y0 + 6 + R() * (y1 - y0 - 12); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 3 + R() * 6 * u, 0, TAU); ctx.stroke(); }
  for (let i = 0; i < 30; i++) { const u = (R() + t * 0.25) % 1, x = x0 + u * (oc - 40 - x0), y = y0 + 6 + R() * (y1 - y0 - 12); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, TAU); ctx.fill(); }
 }
 function lensFrame(ctx, t, t0, t1, fn, label) {
  const s = E.back(win(t, t0, t0 + 0.35)) * (1 - sm(t1 - 0.3, t1, t)); if (s <= 0.01) return;
  P.lens(ctx, LX, LY, LR, s, () => fn());
  if (label) { ctx.save(); ctx.globalAlpha = s; tagT(ctx, label, LX, LY + LR + 52, 26); ctx.restore(); }
 }
 const tagT = (ctx, s, x, y, px = 26, c = 'rgba(230,240,255,0.92)', al = 'center') => { ctx.save(); ctx.font = `700 ${px}px "IBM Plex Mono"`; ctx.textAlign = al; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 10; ctx.fillText(s, x, y); ctx.restore(); };
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const worldToScreen = (cam, x, y) => [(x - cam[0]) * cam[2] + W / 2, (y - cam[1]) * cam[2] + HH / 2];

 // ================= ESTADO DEL SISTEMA EN EL TIEMPO =================
 function state(t) {
  return {
   on: sm(T.realidad - 0.1, T.realidad + 0.4, t), sun: 1 - 0.6 * sm(T.recuerda, T.transportando + 2, t),
   roomHot: lerp(0.95, 0.5, sm(T.realidad, T.como, t)) - 0.5 * sm(T.ciclo, T.transportando + 1.5, t) * 0.6,
   xrIn: sm(T.sacar - 0.3, T.calor1 + 0.4, t) * (1 - sm(T.transportando + 1.5, T.transportando + 2.8, t)),
   xrOut: sm(T.que10 - 0.6, T.que10 + 0.6, t) * (1 - sm(T.transportando + 1.5, T.transportando + 2.8, t)),
   fluid: sm(T.todo4 + 0.2, T.todo4 + 0.9, t) * (1 - sm(T.transportando + 1.5, T.transportando + 2.8, t)),
   draw: E.inOut(win(t, T.circula, T.cerrado + 0.4)) * (t < T.primero + 0.6 ? 1 : 0) + (t >= T.primero + 0.6 ? 2 : 0),
   heatIn: sm(T.calor1 + 0.2, T.calor1 + 0.6, t) * (1 - sm(T.pero2, T.pero2 + 0.4, t)) + sm(T.calor7 - 0.2, T.calor7 + 0.2, t) * (1 - sm(T.un8 + 0.5, T.un8 + 1, t)) + sm(T.ciclo, T.ciclo + 0.4, t) * (1 - sm(T.transportando + 1.4, T.transportando + 2, t)),
   heatOut: sm(T.liberar - 0.2, T.liberar + 0.2, t) * (1 - sm(T.pero14, T.pero14 + 0.4, t)) + sm(T.ciclo, T.ciclo + 0.4, t) * (1 - sm(T.transportando + 1.4, T.transportando + 2, t)),
   airIn: 1, airOut: sm(T.realidad, T.realidad + 0.6, t), airOutdoor: 1, outHeat: sm(T.liberar - 0.4, T.ambiente, t) * 0.8 + 0.2 * sm(T.realidad, T.como, t),
   compGlow: sm(T.comprime - 0.2, T.temperatura11 + 0.3, t) * (1 - sm(T.despues + 1, T.despues + 2, t)),
  };
 }

 // ================= BEAT ÚNICO (cámara continua) + rótulos =================
 const B = [{ t0: 0, t1: DURATION + 1, draw(ctx, t) {
  const st = state(t), cam = P.camAt(CAM, t);
  ctx.save(); P.camApply(ctx, cam); world(ctx, t, st); ctx.restore();
  // --- 1 · gancho
  if (t < T.realidad + 0.8) { ctx.save(); ctx.globalAlpha = sm(T.no0 - 0.05, T.no0 + 0.15, t) * (1 - sm(T.realidad + 0.4, T.realidad + 0.8, t)); P.bigText(ctx, 'NO PRODUCE FRÍO', 540, 380, 96, '#ffffff', { kind: 'title', strokeCol: '#081426', scale: P.popS(t, T.no0, 0.3) || 0.001 }); ctx.restore(); }
  if (t > T.no0 + 0.4 && t < T.realidad + 0.8) { ctx.save(); ctx.globalAlpha = 1 - sm(T.realidad + 0.4, T.realidad + 0.8, t); ctx.strokeStyle = '#ff4558'; ctx.lineWidth = 12; ctx.lineCap = 'round'; const p = win(t, T.frio0, T.frio0 + 0.3); ctx.beginPath(); ctx.moveTo(150, 385); ctx.lineTo(150 + 780 * p, 375); ctx.stroke(); ctx.restore(); }
  { const a = sm(T.sacar - 0.1, T.sacar + 0.2, t) * (1 - sm(T.como - 0.3, T.como + 0.1, t)); if (a > 0) { ctx.save(); ctx.globalAlpha = a; P.bigText(ctx, 'TRANSPORTA CALOR', 540, 380, 92, '#ffd166', { kind: 'title', strokeCol: '#081426', scale: P.popS(t, T.sacar - 0.1, 0.3) || 0.001 }); ctx.restore(); } }
  pill(ctx, 'AIRE CALIENTE', 300, 1290, 30, t, T.no0 + 0.3, '#ff873b', '#ffffff', T.realidad + 0.6);
  // flecha «al exterior» siguiendo la tubería
  { const a = sm(T.expulsarlo - 0.1, T.expulsarlo + 0.2, t) * (1 - sm(T.como, T.como + 0.4, t)); if (a > 0) { const [sx, sy] = worldToScreen(cam, -40, -860), [ex, ey] = worldToScreen(cam, 110, -860); ctx.save(); ctx.globalAlpha = a; P.arrow(ctx, sx, sy - 60, Math.min(1040, ex + 220), sy - 60, win(t, T.expulsarlo, T.exterior1 + 0.3), '#ff873b', 22); ctx.restore(); pill(ctx, 'AL EXTERIOR', 760, 560, 34, t, T.exterior1, '#ff873b', '#ffffff', T.como + 0.3); } }
  P.onoma(ctx, '¿CÓMO?', 540, 420, 120, t, T.como, T.todo4 + 0.1, { c: '#ffd166' });
  // --- 2 · refrigerante y circuito cerrado
  pill(ctx, 'REFRIGERANTE', 540, 380, 48, t, T.refrigerante4, '#55e9ff', '#081426', T.circula + 0.2);
  if (t > T.refrigerante4 && t < T.circula + 0.2) { const a = sm(T.refrigerante4 + 0.2, T.refrigerante4 + 0.5, t) * (1 - sm(T.circula - 0.2, T.circula + 0.2, t)); tagT(ctx, '○ vapor   ● líquido   ○● mezcla', 540, 470, 28, `rgba(230,240,255,${0.92 * a})`); tagT(ctx, 'color = temperatura (azul frío · rojo caliente)', 540, 515, 24, `rgba(200,220,240,${0.85 * a})`); }
  pill(ctx, 'CIRCUITO CERRADO', 540, 330, 46, t, T.circuito, '#55e9ff', '#081426', T.primero + 0.3);
  // --- 3 · evaporador
  pill(ctx, 'EVAPORADOR', 540, 330, 48, t, T.evaporador6, '#168bff', '#ffffff', T.un8 - 0.1);
  pill(ctx, 'ABSORBE CALOR', 540, 420, 36, t, T.absorbe, '#ff873b', '#ffffff', T.un8 - 0.1);
  lensFrame(ctx, t, T.alli7, T.un8, () => tubeSection(ctx, t, 'evap'), 'CORTE DEL TUBO · BAJA PRESIÓN');
  if (t > T.evapora && t < T.un8) { const a = sm(T.evapora, T.evapora + 0.3, t) * (1 - sm(T.un8 - 0.3, T.un8, t)); tagT(ctx, 'LÍQUIDO + VAPOR', LX - 120, LY + 115, 24, `rgba(255,255,255,${a})`); tagT(ctx, 'VAPOR', LX + 150, LY + 115, 24, `rgba(255,255,255,${a})`); tagT(ctx, 'CALOR DEL AIRE', LX, LY - 175, 24, `rgba(255,200,150,${a})`); }
  // --- 4 · el aire se enfría
  pill(ctx, 'VENTILADOR', 540, 330, 44, t, T.ventilador8, '#8998a8', '#ffffff', T.pero9);
  { const a = sm(T.impulsa, T.impulsa + 0.3, t) * (1 - sm(T.pero9 - 0.2, T.pero9 + 0.2, t)); if (a > 0) { const [ix, iy] = worldToScreen(cam, -270, -930), [ox, oy] = worldToScreen(cam, -470, -440); ctx.save(); ctx.globalAlpha = a; P.pill(ctx, 'ENTRA AIRE CALIENTE', cl(ix, 240, 840), Math.max(430, iy - 40), 28, t, T.impulsa, { bg: '#ff873b', fg: '#ffffff' }); P.pill(ctx, 'SALE AIRE MÁS FRESCO', cl(ox, 240, 840), Math.min(1340, oy), 28, t, T.devolviendolo, { bg: '#168bff', fg: '#ffffff' }); ctx.restore(); } }
  // --- 5 · compresor
  P.onoma(ctx, '¿?', 860, 420, 110, t, T.que10, T.aqui11 + 0.3, { c: '#ffd166' });
  pill(ctx, 'COMPRESOR', 540, 330, 50, t, T.compresor, '#ffd166', '#081426', T.despues + 0.2);
  pill(ctx, 'AUMENTA PRESIÓN Y TEMPERATURA', 540, 420, 32, t, T.presion11, '#ff873b', '#ffffff', T.despues + 0.2);
  lensFrame(ctx, t, T.compresor + 0.1, T.despues + 0.3, () => rotary(ctx, t), 'COMPRESOR ROTATIVO · CORTE');
  if (t > T.comprime && t < T.despues + 0.3) { const a = sm(T.comprime, T.comprime + 0.3, t) * (1 - sm(T.despues, T.despues + 0.3, t)); ctx.save(); ctx.globalAlpha = a; P.gauge(ctx, 940, 900, 80, 0.25 + 0.7 * sm(T.comprime, T.temperatura11 + 0.4, t), ''); ctx.restore(); tagT(ctx, 'PRESIÓN', 940, 1010, 22, `rgba(230,240,255,${a})`); tagT(ctx, 'ENTRA VAPOR FRÍO', LX - 150, LY - LR - 20, 22, `rgba(120,190,255,${a})`); tagT(ctx, 'SALE VAPOR CALIENTE', LX + 140, LY - LR - 20, 22, `rgba(255,140,120,${a})`); }
  // --- 6 · condensador
  pill(ctx, 'CONDENSADOR', 540, 330, 50, t, T.condensador, '#ff4558', '#ffffff', T.pero14);
  pill(ctx, 'EXPULSA CALOR', 540, 420, 36, t, T.liberar, '#ff873b', '#ffffff', T.pero14);
  lensFrame(ctx, t, T.mientras - 0.2, T.pero14, () => tubeSection(ctx, t, 'cond'), 'CORTE DEL TUBO · ALTA PRESIÓN');
  if (t > T.mientras && t < T.pero14) { const a = sm(T.mientras, T.mientras + 0.3, t) * (1 - sm(T.pero14 - 0.3, T.pero14, t)); tagT(ctx, 'VAPOR', LX - 150, LY + 115, 24, `rgba(255,255,255,${a})`); tagT(ctx, 'LÍQUIDO', LX + 140, LY + 115, 24, `rgba(255,255,255,${a})`); tagT(ctx, 'CALOR AL AIRE EXTERIOR', LX, LY - 170, 22, `rgba(255,170,160,${a})`); }
  // --- 7 · válvula de expansión
  pill(ctx, 'VÁLVULA DE EXPANSIÓN', 540, 330, 42, t, T.valvula, '#ffd166', '#081426', T.y16);
  lensFrame(ctx, t, T.expansion, T.y16, () => valveSection(ctx, t), 'CORTE DE LA VÁLVULA');
  if (t > T.presion15 && t < T.y16) { const a = sm(T.presion15, T.presion15 + 0.3, t) * (1 - sm(T.y16 - 0.3, T.y16, t)); ctx.save(); ctx.globalAlpha = a; P.pill(ctx, 'ALTA PRESIÓN', 270, 820, 28, t, T.presion15, { bg: '#ff873b', fg: '#ffffff' }); P.pill(ctx, 'BAJA PRESIÓN', 810, 820, 28, t, T.bruscamente, { bg: '#168bff', fg: '#ffffff' }); ctx.restore(); tagT(ctx, 'MEZCLA FRÍA: LÍQUIDO + VAPOR', LX + 40, LY + 110, 22, `rgba(200,230,255,${sm(T.permitiendo, T.permitiendo + 0.3, t) * a})`); }
  // --- 8 · ciclo completo: insignias numeradas sobre cada componente + leyenda en el cielo
  { const a = sm(T.ciclo - 0.2, T.ciclo + 0.4, t) * (1 - sm(T.transportando + 1.3, T.transportando + 2, t)); if (a > 0) {
   const lab = [['EVAPORACIÓN', -270, -900, '#168bff'], ['COMPRESIÓN', 335, 650, '#ffd166'], ['CONDENSACIÓN', 700, 470, '#ff4558'], ['EXPANSIÓN', 430, 505, '#55e9ff']];
   lab.forEach(([s2, x, y, c], i) => { const ai = a * sm(T.ciclo + i * 0.25, T.ciclo + i * 0.25 + 0.3, t); if (ai <= 0) return; const [sx, sy] = worldToScreen(cam, x, y); ctx.save(); ctx.globalAlpha = ai; P.circle(ctx, sx, sy, 26, c, { shadow: true }); ctx.font = '900 30px Nunito'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c === '#ffd166' || c === '#55e9ff' ? '#081426' : '#ffffff'; ctx.fillText(String(i + 1), sx, sy + 1);
    const ly = 350 + i * 66, lx = 830; P.circle(ctx, lx - 150, ly, 22, c); ctx.fillStyle = c === '#ffd166' || c === '#55e9ff' ? '#081426' : '#ffffff'; ctx.font = '900 26px Nunito'; ctx.fillText(String(i + 1), lx - 150, ly + 1); ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8; ctx.font = '900 28px Nunito'; ctx.fillText(s2, lx - 118, ly + 2); ctx.restore(); });
   tagT(ctx, 'ALTA PRESIÓN: compresor → condensador → válvula', 770, 650, 21, `rgba(255,190,160,${a})`); tagT(ctx, 'BAJA PRESIÓN: válvula → evaporador → compresor', 770, 684, 21, `rgba(160,210,255,${a})`);
  } }
  pill(ctx, 'CICLO DE REFRIGERACIÓN', 540, 260, 42, t, T.ciclo, '#f4f8ff', '#081426', T.asi17 + 0.6);
  // --- 9 · revelación
  pill(ctx, 'EL CALOR NO DESAPARECE', 540, 260, 42, t, T.creando, '#ff4558', '#ffffff', T.transportando + 2.4);
  pill(ctx, 'SE TRANSPORTA', 540, 340, 46, t, T.transportando, '#ffd166', '#081426', T.transportando + 2.4);
  { const a = sm(T.calor19, T.calor19 + 0.3, t) * (1 - sm(T.transportando + 2.0, T.transportando + 2.5, t)); if (a > 0) tagT(ctx, 'calor expulsado = calor de la habitación + trabajo del compresor', 540, 1470 - 70, 21, `rgba(255,230,200,${a})`); }
  // --- 10 · cierre discreto
  { const a = sm(T.asombroteca, T.asombroteca + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a * 0.95; ctx.font = '700 54px Fredoka'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 22; ctx.fillText('ASOMBROTECA', 540, 330); ctx.restore(); } }
  // aviso de visualización
  const vis = state(t).fluid; if (vis > 0.2) tagT(ctx, 'VISUALIZACIÓN DIDÁCTICA · SIMPLIFICADA', 540, 205, 20, `rgba(220,235,255,${0.75 * vis})`);
 }, sfx(k) {
  // ambiente y aparato
  k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 260, gain: 0.03, a: 1, hold: DURATION - 2 });
  FX.sello(k, T.no0); k.play('slap', T.frio0 + 0.05, { gain: 0.3, minor: true });
  FX.pitido(k, T.realidad - 0.05, 'E6', 2); k.play('roller', T.realidad + 0.1, { dur: 0.5, gain: 0.25 }); FX.ventilador(k, T.realidad, DURATION - T.realidad - 0.5, 0.8, 420);
  FX.aparece(k, T.sacar - 0.1, 520); FX.revelar(k, T.sacar - 0.2); FX.calor(k, T.calor1, 1.4, 0.8); FX.flecha(k, T.expulsarlo, 0.6); FX.etiqueta(k, T.exterior1);
  k.play('whoosh', T.pero2, { dur: 0.8, gain: 0.35 }); FX.onomatopeya(k, T.como);
  k.play('whoosh', T.todo4, { dur: 0.9, top: 2200, gain: 0.4 }); FX.campo(k, T.todo4 + 0.3, 1.4, 0.8); FX.sello(k, T.refrigerante4);
  k.play('whoosh', T.circula - 0.1, { dur: 1.2, top: 1500, gain: 0.35 }); k.tone(T.circula, { f: [[0, 220], [2.2, 660]], dur: 2.3, gain: 0.04, a: 0.4, filter: 'lowpass', f2: 1800 }); FX.aparece(k, T.circuito, 640);
  k.play('whoosh', T.primero, { dur: 0.9, gain: 0.35 }); FX.sello(k, T.evaporador6); FX.etiqueta(k, T.absorbe); FX.aparece(k, T.alli7, 600); FX.burbujas(k, T.evapora - 0.2, 2.2, 10, 3, 0.9); FX.calor(k, T.calor7, 1.6, 0.7);
  k.play('whoosh', T.ventilador8 - 0.3, { dur: 0.8, gain: 0.3 }); FX.etiqueta(k, T.ventilador8); FX.ventilador(k, T.impulsa, 4.5, 1.2, 600); FX.etiqueta(k, T.impulsa); FX.etiqueta(k, T.devolviendolo);
  k.play('whoosh', T.absorbido, { dur: 1.2, top: 1300, gain: 0.35 }); FX.onomatopeya(k, T.que10); k.play('whoosh', T.que10 + 0.2, { dur: 1.0, gain: 0.35 });
  FX.zumbido(k, T.que10 + 0.4, T.y16 + 2 - T.que10, 0.7); FX.sello(k, T.compresor); FX.aparece(k, T.compresor + 0.1, 480); FX.compresion(k, T.comprime, 1.6); FX.etiqueta(k, T.presion11);
  k.play('whoosh', T.despues + 0.2, { dur: 1.0, gain: 0.35 }); FX.sello(k, T.condensador); FX.etiqueta(k, T.liberar); FX.calor(k, T.liberar, 1.8, 0.9); FX.ventilador(k, T.ventilador13, 4, 1.1, 280);
  FX.aparece(k, T.mientras - 0.2, 560); FX.goteo(k, T.convierte, 7, 0.2, 9);
  k.play('whoosh', T.paso, { dur: 0.9, gain: 0.35 }); FX.sello(k, T.valvula); FX.aparece(k, T.expansion, 620); FX.expansion(k, T.bruscamente - 0.1, 1.0); FX.etiqueta(k, T.presion15); FX.etiqueta(k, T.bruscamente);
  k.play('whoosh', T.ciclo - 0.4, { dur: 1.2, top: 1500, gain: 0.4 }); [0, 1, 2, 3].forEach((i) => k.play('pop', T.ciclo + i * 0.25, { f: 500 + i * 120, gain: 0.35 })); k.play('success', T.nuevo + 0.2, { gain: 0.35 });
  FX.sello(k, T.creando); FX.correcto(k, T.transportando); k.play('whoosh', T.transportando + 2.2, { dur: 1.4, top: 1300, gain: 0.3, minor: true });
  FX.fin(k, T.asombroteca);
 } }];

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['refrigerante', 'evaporador', 'compresor', 'condensador', 'expansión', 'calor', 'frío', 'ciclo', 'Asombroteca'],
  music(k) {
   const Am = [['A2', 'E3', 'C4', 'G4'], ['F2', 'C3', 'A3', 'E4'], ['C3', 'G3', 'E4', 'B4'], ['G2', 'D3', 'B3', 'D4']];
   k.music('pad', 0, T.todo4, { bpm: 96, gain: 0.38, chords: Am });
   k.music('pulse', T.todo4, T.ciclo, { bpm: 104, gain: 0.22, chords: Am });
   k.music('pad', T.ciclo, DURATION, { bpm: 96, gain: 0.42, chords: [['F2', 'C3', 'A3', 'E4'], ['G2', 'D3', 'B3', 'D4'], ['C3', 'G3', 'E4', 'B4']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
