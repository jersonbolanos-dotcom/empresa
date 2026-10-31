// =====================================================================================================
// binance.js (V3) — explainer(ctx, W, H_, t) vertical 1080x1920 para "El robo de Binance" (Asombroteca)
// Reloj global = segundos de la grabación de voz original. Todos los tiempos salen de window.ALIGN (alineacion.json)
// mediante wt(tramo, palabra). Determinista: sin Math.random; azar sólo con H.rng(semilla).
// =====================================================================================================
(function () {
 const S = window.PLR, A = window.ALIGN;
 const { PI, sm, io, eo, GV, GT, GG, GOLD, RED, INK, GREY, DIM, CYAN, TEAL, BGOLD, THICK, DIE } = S;
 const W0 = 1080, H0 = 1920;
 const DURATION = A.duration;

 // ---------- tiempos desde la alineación ----------
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0, end = false) {
  let k = 0;
  for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return end ? w.e : w.s; k++; }
  throw new Error('palabra no encontrada: ' + seg + ' ' + word);
 }
 const SG = (i) => A.segments[i];
 const T = {
  date: wt(0, '29'), binance: wt(0, 'binance'), plat: wt(1, 'plataformas'), mundo: wt(2, 'mundo'),
  veinte: wt(3, 'veinte'), minutos: wt(3, 'minutos'), atac: wt(3, 'atacantes'), mayor: wt(3, 'mayor'), fortuna: wt(3, 'fortuna'),
  seis: wt(3, 'seis'), dolares: wt(3, 'dólares'), dolaresE: wt(3, 'dólares', 0, true),
  boveda: wt(4, 'bóveda'), b4: SG(4).s, billetes: wt(5, 'billetes'), b5: SG(5).s, entonces: SG(6).s, como: SG(7).s, dinero: wt(7, 'dinero'),
  todo: SG(8).s, billeteras: wt(8, 'billeteras'), calientes: wt(8, 'calientes'),
  sistemas: wt(9, 'sistemas'), internet: wt(9, 'internet'), mover: wt(9, 'mover'), rapid: wt(9, 'rápidamente'),
  pero10: SG(10).s, movs: wt(10, 'movimientos'), autoriz: wt(10, 'autorizaciones'), seguras: wt(10, 'seguras'),
  durante: SG(11).s, delinc: wt(11, 'delincuentes'), retiros: wt(11, 'retiros'), noaut: wt(11, 'no'), autorizado: wt(11, 'autorizado'),
  empresa: SG(12).s, investiga: wt(12, 'investiga'), comprom: wt(12, 'comprometidos'),
  sorpr0: SG(13).s, sorpr: wt(13, 'sorprendente'),
  transf: wt(14, 'transferencia'), confirmada: wt(14, 'confirmada'), bloques: wt(14, 'bloques'), normalmente: wt(14, 'normalmente'), boton: wt(14, 'botón'), deshacer: wt(14, 'deshacerla'),
  fondos: SG(15).s, distrib: wt(15, 'distribuirse'), direcc: wt(15, 'direcciones'), redes: wt(15, 'redes'),
  cada: SG(16).s, rastro: wt(16, 'rastro'), seguir: wt(17, 'seguir'), nosig: wt(17, 'significa'), recuperar: wt(17, 'recuperar'),
  carrera0: SG(18).s, carrera: wt(18, 'carrera'), tiempo: wt(18, 'tiempo'),
  invest: SG(19).s, localizar: wt(19, 'localizar'), congelar: wt(19, 'congelar'), bloquearse: wt(19, 'bloquearse'),
  cubrir0: SG(20).s, cubriria: wt(20, 'cubriría'), recursos: wt(20, 'recursos'),
  oct31: wt(21, '31'), repuesto: wt(21, 'repuesto'), noventa: wt(21, 'noventa'), afectados: wt(21, 'afectados'),
  atencion: wt(22, 'atención'), eso: SG(23).s, recuperado: wt(23, 'recuperado'), noventa2: wt(23, 'noventa'), robado: wt(23, 'robado'),
  leccion0: SG(24).s, leccion: wt(24, 'lección'), mundoD: SG(25).s, autoriz2: wt(25, 'autorización'), miles: wt(25, 'miles'), minutos2: wt(25, 'minutos'),
  asombro: SG(26).s, tag: SG(27).s, end: A.speech_end,
 };
 // escenas (intervalos de voz reales)
 const B = [
  [0, SG(3).s], [SG(3).s, SG(4).s], [SG(4).s, SG(8).s], [SG(8).s, SG(10).s], [SG(10).s, SG(11).s], [SG(11).s, SG(13).s],
  [SG(13).s, SG(15).s], [SG(15).s, SG(18).s], [SG(18).s, SG(20).s], [SG(20).s, SG(21).s], [SG(21).s, SG(24).s], [SG(24).s, DURATION],
 ];
 const sweep0 = T.asombro - 0.35, sweep1 = T.asombro + 0.2;
 function glowDot(x, X, Y, r, col, a) {
  const g = x.createRadialGradient(X, Y, 0, X, Y, r * 4); g.addColorStop(0, `rgba(${col},${0.55 * a})`); g.addColorStop(1, `rgba(${col},0)`);
  x.fillStyle = g; x.beginPath(); x.arc(X, Y, r * 4, 0, 7); x.fill();
  x.fillStyle = `rgba(${col},${a})`; x.beginPath(); x.arc(X, Y, r, 0, 7); x.fill();
 }
 function chipTag(x, s, X, Y, px, col, a, o) {
  o = o || {};
  if (a <= 0) return;
  x.save(); S.setF(x, 600, px); try { x.letterSpacing = (o.ls || 2) + 'px'; } catch (e) {}
  const w = x.measureText(s).width + px * 1.1, h = px * 1.7;
  const X0 = o.align === 'left' ? X : X - w / 2;
  x.globalAlpha *= a; x.beginPath(); x.roundRect(X0, Y - h / 2, w, h, h / 2);
  x.fillStyle = o.bg || 'rgba(8,9,12,0.72)'; x.fill(); x.strokeStyle = col; x.lineWidth = 1.5; x.stroke();
  x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s, X0 + w / 2, Y + 1);
  x.restore();
 }
 const rgbOf = (hex) => H.hex(hex).join(',');

 // ---------- capa de texto: cabeceras por beat ----------
 function kicker(x, s, Y, a, col) { if (a <= 0) return; x.save(); S.setF(x, 600, 34); try { x.letterSpacing = '6px'; } catch (e) {} x.globalAlpha = a; x.fillStyle = col || GREY; x.textAlign = 'center'; x.fillText(s, 540, Y); x.restore(); }
 function fadeIO(t, a, b, f = 0.35) { return sm(a, a + f, t) * (1 - sm(b - f, b, t)); }

 // ================= V3: protagonistas por concepto =================
 const PR = window.PROT;
 const GREY2 = '#c7c7cc';

 // ---------- cámara: una sola cámara de estudio continua que DESCUBRE, ATRAVIESA, SIGUE y RETROCEDE ----------
 const KEYS = [
  // 01 emblema de Binance: órbita lenta + push-in
  { t: 0, cx: 540, cy: 1150, s: 1.0, yaw: -0.55, pitch: 0.16 },
  { t: T.binance, cx: 540, cy: 1170, s: 1.1, yaw: -0.3, pitch: 0.2 },
  { t: T.mundo, cx: 540, cy: 1180, s: 1.0, yaw: -0.12, pitch: 0.24 },
  // 02 la cámara penetra en el sistema de custodia y baja para ver el anillo temporal en el suelo
  { t: T.veinte - 0.4, cx: 540, cy: 1200, s: 1.12, yaw: -0.05, pitch: 0.36 },
  { t: T.dolaresE, cx: 540, cy: 1230, s: 1.0, yaw: 0.1, pitch: 0.46 },
  // 03 metáfora física: bóveda y fajos
  { t: T.b4 + 0.4, cx: 600, cy: 1200, s: 1.0, yaw: 0.0, pitch: 0.2 },
  { t: T.dinero, cx: 600, cy: 1200, s: 1.05, yaw: 0.06, pitch: 0.22 },
  // 04 billetera caliente: rodear y atravesar el cristal hasta la pantalla
  { t: T.billeteras, cx: 540, cy: 1270, s: 1.0, yaw: -0.32, pitch: 0.16 },
  { t: T.sistemas + 0.2, cx: 540, cy: 1330, s: 1.2, yaw: -0.12, pitch: 0.12 },
  { t: T.internet, cx: 540, cy: 1610, s: 2.0, yaw: 0.0, pitch: 0.08 },
  { t: T.rapid + 0.2, cx: 540, cy: 1640, s: 2.06, yaw: 0.04, pitch: 0.08 },
  // 05 retroceder: módulo de autorización arriba, billetera, cadena (capa de red) delante
  { t: T.movs, cx: 540, cy: 1200, s: 0.84, yaw: 0.22, pitch: 0.3 },
  { t: T.seguras + 0.3, cx: 540, cy: 1200, s: 0.84, yaw: 0.3, pitch: 0.32 },
  // 06 subir para seguir la operación roja hacia direcciones externas
  { t: T.retiros + 0.2, cx: 600, cy: 1120, s: 0.6, yaw: 0.1, pitch: 0.6 },
  { t: T.comprom + 0.4, cx: 620, cy: 1110, s: 0.58, yaw: -0.02, pitch: 0.64 },
  // 07 la operación se convierte en registro: travelling a lo largo de la cadena de bloques
  { t: T.sorpr0 + 0.6, cx: 640, cy: 880, s: 1.0, yaw: 0.0, pitch: 0.34 },
  { t: T.confirmada, cx: 540, cy: 880, s: 1.06, yaw: 0.0, pitch: 0.34 },
  { t: T.deshacer + 0.5, cx: 500, cy: 880, s: 1.08, yaw: -0.08, pitch: 0.36 },
  // 08-09 cenital: viajar por el grafo
  { t: T.distrib, cx: 540, cy: 950, s: 0.45, yaw: -0.2, pitch: 1.05 },
  { t: T.redes + 0.4, cx: 540, cy: 910, s: 0.38, yaw: -0.45, pitch: 1.18 },
  { t: T.rastro + 0.3, cx: 600, cy: 900, s: 0.43, yaw: -0.62, pitch: 1.16 },
  { t: T.recuperar, cx: 540, cy: 910, s: 0.4, yaw: -0.75, pitch: 1.18 },
  { t: T.congelar, cx: 560, cy: 920, s: 0.43, yaw: -1.0, pitch: 1.12 },
  { t: T.bloquearse + 0.5, cx: 560, cy: 930, s: 0.41, yaw: -1.08, pitch: 1.1 },
  // 10-11 fuente independiente: retroceso que muestra reservas, billetera y rutas del robo separadas
  { t: T.recursos, cx: 400, cy: 1280, s: 0.72, yaw: -0.05, pitch: 0.34 },
  { t: T.noventa, cx: 420, cy: 1360, s: 0.64, yaw: 0.0, pitch: 0.32 },
  { t: T.robado + 0.4, cx: 430, cy: 1370, s: 0.62, yaw: 0.05, pitch: 0.32 },
  // 12 regreso al mecanismo de autorización y custodia
  { t: T.leccion, cx: 540, cy: 1380, s: 0.72, yaw: -0.22, pitch: 0.28 },
  { t: T.minutos2, cx: 540, cy: 1370, s: 0.76, yaw: 0.02, pitch: 0.26 },
  { t: DURATION, cx: 540, cy: 1300, s: 0.86, yaw: 0.2, pitch: 0.26 },
 ];
 KEYS.sort((a, b) => a.t - b.t);

 // ---------- grafo de direcciones (V2, conservado) ----------
 const GRAPH = (() => {
  const r = H.rng(2026), nodes = [];
  const root = { x: 0, z: 0, hop: 0 };
  const N1 = 7;
  for (let i = 0; i < N1; i++) {
   const an = H.lerp(PI * 0.62, PI * 1.62, i / (N1 - 1)) + r.range(-0.08, 0.08), rad = r.range(1.9, 2.3);
   const t0 = H.lerp(T.retiros - 0.1, T.autorizado + 0.3, i / (N1 - 1));
   nodes.push({ x: Math.cos(an) * rad, z: Math.sin(an) * rad, hop: 1, parent: root, t0, t1: t0 + 0.55, an });
  }
  const h1 = nodes.slice();
  let ci = 0;
  h1.forEach((p, i) => {
   const n2 = r.int(2, 3);
   for (let k = 0; k < n2; k++) {
    const an = p.an + (k - (n2 - 1) / 2) * 0.32 + r.range(-0.06, 0.06), rad = r.range(3.2, 3.7);
    const t0 = H.lerp(T.distrib, T.direcc + 0.6, (i * 3 + k) / (h1.length * 3)) + r.range(0, 0.2);
    const q = { x: Math.cos(an) * rad, z: Math.sin(an) * rad, hop: 2, parent: p, t0, t1: t0 + 0.6, an, chain: ci++ % 10 };
    nodes.push(q);
    if (r.chance(0.7)) {
     const an3 = an + r.range(-0.18, 0.18), rad3 = r.range(4.5, 5.2), t3 = H.lerp(T.direcc, T.redes + 0.3, r());
     nodes.push({ x: Math.cos(an3) * rad3, z: Math.sin(an3) * rad3, hop: 3, parent: q, t0: t3, t1: t3 + 0.6, an: an3, chain: q.chain });
    }
   }
  });
  nodes.filter((n) => n.hop >= 2).forEach((n) => { n.freeze = r.chance(0.45); n.freezeT = H.lerp(T.congelar - 0.3, T.bloquearse + 0.5, r()); });
  return { nodes };
 })();

 // ---------- cadena de bloques (capa de red) ----------
 const BLOCKS = Array.from({ length: 5 }, (_, i) => ({ x: -1.56 + i * 0.78, z: 1.5 }));
 const SEALB = 2;

 // ---------- luz ----------
 function lighting(t) {
  const L = {
   key: (0.5 + 0.5 * sm(0.3, 2.0, t)) * (1 - 0.35 * sm(T.b4, T.b4 + 0.6, t) * (1 - sm(T.todo - 0.4, T.todo + 0.4, t))) * (1 - 0.3 * sm(T.sorpr0, T.sorpr, t) * (1 - sm(T.confirmada, T.confirmada + 1, t))),
   rim: 0.45 + 0.55 * sm(0.0, 0.9, t), spec: -1, white: 0,
  };
  const sw = [[0.4, 2.2], [T.binance - 0.2, T.binance + 1.2], [T.billeteras - 0.2, T.calientes + 0.6], [T.confirmada, T.confirmada + 1.1], [T.recursos, T.recursos + 1.2], [T.leccion, T.leccion + 1.6]];
  for (const [a, b] of sw) if (t > a - 0.3 && t < b + 0.3) L.spec = H.map(t, a, b, -0.25, 1.25);
  return L;
 }
 function balance(t) {
  const out = 0.82 * io(sm(T.retiros, T.autorizado + 0.8, t));
  const refill = 0.9 * 0.82 * io(sm(T.recursos - 0.4, T.repuesto + 0.4, t));
  return 1 - out + refill;
 }

 // ---------- estados / presencias ----------
 const embA = (t) => 1 - sm(T.b4 - 0.25, T.b4 + 0.45, t);
 const vaultA = (t) => sm(T.b4 - 0.2, T.b4 + 0.35, t) * (1 - sm(T.como + 0.6, T.como + 0.8, t));
 const devA = (t) => Math.max(fadeIO(t, T.todo - 0.3, T.sorpr0 + 0.9, 0.7), fadeIO(t, T.cubrir0 - 0.3, sweep1 + 0.02, 0.6));
 const devScale = (t) => H.lerp(1, 0.86, sm(T.rapid + 0.2, T.movs, t)) * (t > T.cubrir0 - 0.4 ? 0.82 / 0.86 : 1);
 const tilesA = (t) => Math.max(fadeIO(t, T.pero10 - 0.1, T.sorpr0 + 0.4, 0.5), fadeIO(t, T.leccion0 - 0.2, sweep1, 0.6));
 const chainA = (t) => fadeIO(t, T.pero10, T.fondos + 0.6, 0.6);
 const towerA = (t) => fadeIO(t, T.cubrir0 - 0.2, T.leccion0 + 0.3, 0.5);
 const VAULT = { x: -0.45, y: 0.04, z: 0, R: 0.95 };
 const devObj = (t) => ({ x: 0, y: 0.05, z: 0, ry: 0.0, scale: devScale(t) });
 const TILES = (t) => ({ x: 0, y: 2.25, z: 0.25, ry: 0, scale: 0.9, t });

 function deviceState(t) {
  let state = 'idle', icon = 'dot', col = null, lockOpen = 0;
  if (t > T.autoriz && t < T.retiros) { state = 'idle'; icon = 'key'; col = BGOLD; }
  if (t >= T.retiros && t < T.cubrir0) { state = 'alert'; icon = 'x'; col = RED; }
  if (t >= T.cubrir0) { state = 'gold'; icon = 'check'; col = BGOLD; }
  if (t >= T.leccion0) { state = 'idle'; icon = 'lock'; col = BGOLD; lockOpen = 1 - sm(T.minutos2, T.minutos2 + 0.5, t); if (t > T.autoriz2 && t < T.minutos2) { col = RED; } }
  const flow = Math.max(sm(T.mover - 0.4, T.mover + 0.2, t) * (1 - sm(T.movs - 0.6, T.movs, t)), fadeIO(t, T.retiros, T.autorizado + 1.0, 0.3));
  return { state, ringIcon: icon, ringCol: col, lockOpen, flow, online: fadeIO(t, T.sistemas - 0.3, T.movs, 0.4) };
 }

 // ================= ESCENA OSCURA =================
 function darkScene(x, W, Hh, t, c, L) {
  S.stage(x, W, Hh, c, Object.assign({ bokeh: 1 }, L), t);
  const ctx = { W, Hh };
  // --- 01-02 emblema de Binance
  const ea = embA(t);
  let emb = null;
  if (ea > 0.003) {
   const rec = io(sm(T.b4 - 0.25, T.b4 + 0.5, t));
   const spin = io(sm(T.binance - 0.1, T.binance + 1.1, t)) * PI * 2;
   const glitch = Math.exp(-Math.max(0, t - wt(0, 'ocurrió')) * 5) * (t > wt(0, 'ocurrió') ? 1 : 0) + Math.exp(-Math.max(0, t - wt(0, 'increíble')) * 6) * (t > wt(0, 'increíble') ? 0.7 : 0);
   emb = { x: 0, y: 0.18 + 0.03 * Math.sin(t * 1.3), z: -3.2 * rec, size: 2.05, depth: 0.34, ry: 0.32 * Math.sin(t * 0.32) + spin, a: ea, key: L.key, rim: L.rim, spec: L.spec, glow: 0.35 + 0.5 * sm(T.seis, T.dolares, t) + 0.6 * Math.exp(-Math.max(0, t - T.binance - 1.1) * 2) * (t > T.binance + 1.1 ? 1 : 0), glitch: Math.min(1, glitch), t };
   PR.contact(x, c, 0, emb.z, 1.3, ea);
   PR.reflect(x, c, W, Hh, (r) => PR.emblem3D(r, c, emb, true), 0.32 * ea * Math.max(0.3, L.key), c.P(0, 0, emb.z)[1]);
   // anillo temporal en el suelo (02)
   timeRing(x, c, t, emb, 'back');
   PR.emblem3D(x, c, emb, false);
   timeRing(x, c, t, emb, 'front');
   coinsOrbit(x, c, t, emb);
  }
  // --- 03 bóveda + fajos (metáfora) y dial
  b03(x, c, t);
  // --- capa de red: cadena de bloques
  const ca = chainA(t);
  if (ca > 0) drawChain(x, c, t, ca);
  // --- grafo
  if (t > T.retiros - 0.3) drawGraph(x, c, t);
  // --- reservas de Binance (fuente independiente)
  const ta = towerA(t);
  if (ta > 0) drawTower(x, c, t, ta, W, Hh, L);
  // --- billetera caliente
  const da = devA(t);
  let dev = null;
  if (da > 0.003) {
   const o = Object.assign(devObj(t), deviceState(t), { a: da, bal: balance(t), t, key: L.key, spec: L.spec });
   // materialización: sube desde el suelo y se ensambla
   const mat = sm(T.todo - 0.3, T.billeteras + 0.2, t);
   if (t < T.billeteras + 0.3) { o.y -= (1 - eo(mat)) * 0.6; o.a *= mat; }
   o.ringA = t < T.cubrir0 - 0.5 ? sm(T.billeteras - 0.05, T.billeteras + 0.15, t) : 1;
   PR.contact(x, c, o.x, o.z, 1.0 * o.scale, o.a);
   PR.reflect(x, c, W, Hh, (r) => PR.device(r, c, o, true), 0.35 * o.a * Math.max(0.3, L.key), c.P(o.x, 0, o.z)[1]);
   dev = PR.device(x, c, o, false);
   if (dev) dev.o = o;
  }
  // dial volando del match cut (03 -> 04)
  matchDial(x, c, t, dev);
  // --- módulo de autorización
  const tA = tilesA(t);
  let tiles = null;
  if (tA > 0.003) tiles = drawTiles(x, c, t, tA, dev);
  // --- flujos de oro de reservas a la billetera
  if (ta > 0 && dev) goldFlow(x, c, t, ta, dev);
  overlays(x, W, Hh, t, c, L, { emb, dev, tiles });
 }

 // anillo de 20 minutos en el suelo alrededor del emblema: flujo de valor
 function timeRing(x, c, t, emb, half) {
  const a = fadeIO(t, T.veinte - 0.3, T.b4 + 0.2, 0.4) * emb.a;
  if (a <= 0) return;
  const R = 1.75, N = 120, p = io(sm(T.veinte, T.minutos + 0.8, t)) / 3;
  const cd = c.P(0, 0, emb.z)[2];
  x.save(); x.globalAlpha *= a; x.lineCap = 'round';
  // pista completa (60 min) tenue + marcas de 5 min
  for (let i = 0; i < N; i++) {
   const a0 = -PI / 2 + i / N * PI * 2, a1 = -PI / 2 + (i + 1) / N * PI * 2;
   const P0 = c.P(Math.cos(a0) * R, 0.01, emb.z + Math.sin(a0) * R), P1 = c.P(Math.cos(a1) * R, 0.01, emb.z + Math.sin(a1) * R);
   if ((P0[2] > cd) !== (half === 'front')) continue;
   const lit = i / N < p;
   x.strokeStyle = lit ? 'rgba(240,185,11,0.95)' : 'rgba(255,255,255,0.14)'; x.lineWidth = lit ? 6 : 3;
   if (lit) { x.shadowColor = 'rgba(240,185,11,0.8)'; x.shadowBlur = 12; } else x.shadowBlur = 0;
   x.beginPath(); x.moveTo(P0[0], P0[1]); x.lineTo(P1[0], P1[1]); x.stroke();
   if (i % 10 === 0) { const Q = c.P(Math.cos(a0) * (R + 0.12), 0.01, emb.z + Math.sin(a0) * (R + 0.12)); x.fillStyle = 'rgba(255,255,255,0.4)'; x.beginPath(); x.arc(Q[0], Q[1], 3, 0, 7); x.fill(); }
  }
  // partículas: el valor sale del emblema y recorre el anillo; tras "atacantes" se vuelve rojo y abandona el sistema
  if (half === 'front') {
   const red = sm(T.atac, T.atac + 0.6, t), r = H.rng(88);
   for (let k = 0; k < 26; k++) {
    const ph = ((t - T.veinte) * 0.35 + r()) % 1; if (t < T.veinte) break;
    const an = -PI / 2 + ph * p * PI * 2, out = red * Math.max(0, ph - 0.6) * 2.5;
    const P0 = c.P(Math.cos(an) * (R + out * 1.2), 0.05 + 0.05 * Math.sin(k), emb.z + Math.sin(an) * (R + out * 1.2));
    glowDot(x, P0[0], P0[1], 4, red > 0.5 && ph > 0.5 ? '255,69,58' : '240,185,11', 0.9 * (1 - out * 0.5));
   }
  }
  x.restore();
 }
 // ecosistema: fichas genuinas de BTC, ETH, USDT y BNB orbitando (ejemplos, no activos robados)
 function coinsOrbit(x, c, t, emb) {
  const a = fadeIO(t, T.plat - 0.3, T.veinte - 0.2, 0.5) * emb.a;
  if (a <= 0) return;
  const kinds = ['btc', 'eth', 'usdt', 'bnb'];
  const items = kinds.map((k, i) => { const an = t * 0.55 + i / 4 * PI * 2, P = c.P(Math.cos(an) * 1.75, 1.15 + 0.25 * Math.sin(an * 2), emb.z + Math.sin(an) * 1.75); return { k, P, i }; });
  items.sort((u, v) => u.P[2] - v.P[2]);
  items.forEach((it) => { const ap = sm(T.plat - 0.3 + it.i * 0.22, T.plat + 0.2 + it.i * 0.22, t); PR.coin(x, it.P[0], it.P[1], 62 * (0.8 + 0.25 * (it.P[2] + 2) / 4), it.k, { a: a * ap, glow: 0.6, squash: 0.96, spin: Math.sin(t * 1.4 + it.i) * 0.5 }); });
 }

 // 03: bóveda y fajos -> desintegración -> el dial sobrevive
 function vaultHub(c) { return PR.xf(c, VAULT)(0, VAULT.R, 0.27); }
 function b03(x, c, t) {
  const va = vaultA(t);
  if (va <= 0.003) return;
  const rise = eo(sm(T.b4 - 0.2, T.b4 + 0.5, t));
  const dis = sm(T.entonces, T.como + 0.6, t);
  const o = Object.assign({}, VAULT, { y: VAULT.y - (1 - rise) * 0.5, a: va, wheel: t * 0.6 + io(sm(T.boveda, T.boveda + 0.6, t)) * 1.2, dissolve: dis, target: vaultHub(c) });
  if (dis <= 0) { PR.contact(x, c, VAULT.x, VAULT.z, 1.1, va); }
  PR.vault(x, c, o);
  // fajos de billetes (aparecen con "billetes")
  const ba = sm(T.b5 - 0.1, T.b5 + 0.4, t);
  if (ba > 0) {
   if (dis <= 0) { PR.contact(x, c, 1.25, 0.7, 0.8, ba); PR.cash(x, c, { x: 1.25, y: (1 - eo(ba)) * 0.4, z: 0.7, ry: -0.3, a: ba }); }
   else { // fajos se desintegran en partículas hacia el dial
    const r = H.rng(91), hub = vaultHub(c);
    for (let i = 0; i < 160; i++) { const j = r(), d = H.clamp((dis - j * 0.45) / 0.55); if (d >= 1) continue; const p0 = c.P(1.25 + r.range(-0.9, 0.9), r.range(0, 0.6), 0.7 + r.range(-0.2, 0.2)); const dd = io(d); x.save(); x.globalAlpha *= ba * (1 - dd * 0.85); x.fillStyle = d > 0.05 ? '#ffd76a' : '#c4ccbe'; x.beginPath(); x.arc(H.lerp(p0[0], hub[0], dd), H.lerp(p0[1], hub[1], dd), 2.4, 0, 7); x.fill(); x.restore(); }
   }
  }
  // tachones rojos sincronizados
  const st1 = sm(T.boveda, T.boveda + 0.35, t) * (1 - dis), st2 = sm(T.billetes, T.billetes + 0.35, t) * (1 - dis);
  const vb = PR.xf(c, VAULT), A0 = vb(-1.1, 0.2, 0.3), A1 = vb(1.1, 2.0, 0.3);
  const cb0 = c.P(0.5, 0.0, 0.7), cb1 = c.P(2.0, 0.9, 0.7);
  x.save(); x.strokeStyle = RED; x.lineWidth = 10; x.lineCap = 'round'; x.shadowColor = 'rgba(255,69,58,0.7)'; x.shadowBlur = 16;
  if (st1 > 0) { x.beginPath(); x.moveTo(A0[0], A0[1]); x.lineTo(H.lerp(A0[0], A1[0], io(st1)), H.lerp(A0[1], A1[1], io(st1))); x.stroke(); }
  if (st2 > 0) { x.beginPath(); x.moveTo(cb0[0], cb0[1]); x.lineTo(H.lerp(cb0[0], cb1[0], io(st2)), H.lerp(cb0[1], cb1[1], io(st2))); x.stroke(); }
  x.restore();
  // dial de la cerradura: se ilumina en oro al desintegrarse el metal
  if (dis > 0) { const hub = vaultHub(c); PR.dial(x, hub[0], hub[1], 0.3 * c.unit, { a: sm(T.entonces, T.entonces + 0.5, t), col: BGOLD, icon: 'dot', rot: t * 0.6, p: 1 }); }
 }
 function matchDial(x, c, t, dev) {
  if (t < T.como + 0.6 || t > T.billeteras + 0.2 || !dev) {
   if (t >= T.como + 0.6 && t < T.billeteras + 0.2 && !dev) { const hub = vaultHub(c); PR.dial(x, hub[0], hub[1], 0.3 * c.unit, { a: 1, col: BGOLD, rot: t * 0.6 }); }
   return;
  }
  const hub = vaultHub(c), tg = dev.ringAt();
  const e = io(sm(T.todo - 0.4, T.billeteras, t));
  const rad = H.lerp(0.3 * c.unit, 62 * Math.hypot(dev.screen[1][0] - dev.screen[0][0], dev.screen[1][1] - dev.screen[0][1]) / 600, e);
  PR.dial(x, H.lerp(hub[0], tg[0], e), H.lerp(hub[1], tg[1], e) - Math.sin(e * PI) * 120, rad, { a: 1 - sm(T.billeteras - 0.05, T.billeteras + 0.15, t), col: BGOLD, rot: t * 0.6 });
 }

 // capa de red: bloques con registros; la operación se convierte en anotación y se confirma
 function drawChain(x, c, t, a) {
  x.save(); x.globalAlpha *= a;
  const seal = sm(T.confirmada, T.confirmada + 0.5, t), stamp = t > T.confirmada ? Math.exp(-(t - T.confirmada) * 4) : 0;
  const tops = [];
  BLOCKS.forEach((b, i) => {
   const appear = sm(T.pero10 + i * 0.12, T.pero10 + 0.5 + i * 0.12, t);
   const isS = i === SEALB, isNew = i > SEALB;
   const ex = isNew ? 1 - sm(T.transf - 0.6, T.transf, t) * 0 : 1;
   const top = isS ? (seal > 0 ? `rgba(56,189,248,${0.25 + 0.45 * seal})` : 'rgba(40,44,56,0.7)') : 'rgba(40,44,56,0.92)';
   const r = PR.box3r(x, c, { x: b.x, y: 0.02, z: b.z }, 0.6, 0.42 * appear + 0.001, 0.6, { alpha: appear * ex, top, edge: isS && seal > 0 ? `rgba(160,225,255,${0.55 + 0.45 * stamp})` : 'rgba(235,238,255,0.35)', lw: isS ? 2.2 : 1.3 });
   // anotaciones del registro en la cara frontal
   if (appear > 0.6) PR.onFace(x, r.front, 100, 70, (u) => {
    u.globalAlpha = appear;
    for (let k = 0; k < 4; k++) { const w = 30 + ((i * 7 + k * 13) % 40); u.fillStyle = 'rgba(200,210,240,0.35)'; u.fillRect(14, 12 + k * 13, w, 6); }
    if (isS) { const rec = sm(T.transf + 0.4, T.confirmada, t); if (rec > 0) { u.fillStyle = `rgba(255,69,58,${rec})`; u.fillRect(14, 12 + 4 * 13 - 2, 72 * rec, 8); } }
   });
   tops.push(r.c);
  });
  // enlaces criptográficos entre bloques (cada bloque referencia al anterior)
  for (let i = 0; i < BLOCKS.length - 1; i++) {
   const p = c.P(BLOCKS[i].x + 0.3, 0.21, BLOCKS[i].z), q = c.P(BLOCKS[i + 1].x - 0.3, 0.21, BLOCKS[i + 1].z);
   const lit = i < SEALB || (i === SEALB && seal > 0) ? 1 : 0.35;
   x.strokeStyle = `rgba(160,225,255,${0.25 + 0.5 * lit})`; x.lineWidth = 3; x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(q[0], q[1]); x.stroke();
   glowDot(x, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 4, '160,225,255', 0.4 + 0.5 * lit);
  }
  // la operación (roja) entra al bloque como anotación
  const tp = sm(T.transf, T.confirmada, t);
  if (tp > 0 && tp < 1) { const from = c.P(-2.6, 0.9, 0.2), to = tops[SEALB]; glowDot(x, H.lerp(from[0], to[0], io(tp)), H.lerp(from[1], to[1], io(tp)) - Math.sin(tp * PI) * 90, 8, '255,69,58', 1); }
  // confirmaciones: 6 marcas sobre el bloque
  const cf = sm(T.confirmada - 0.1, T.bloques + 0.6, t);
  if (cf > 0) {
   const top = tops[SEALB];
   for (let k = 0; k < 6; k++) { const on = cf * 6 > k + 0.5 ? 1 : 0.15, X = top[0] - 75 + k * 30, Y = top[1] - 70; x.fillStyle = on > 0.5 ? CYAN : 'rgba(255,255,255,0.2)'; if (on > 0.5) { x.shadowColor = CYAN; x.shadowBlur = 10; } x.beginPath(); x.roundRect(X - 9, Y - 9, 18, 18, 4); x.fill(); x.shadowBlur = 0; }
   if (seal > 0) { const cx = top[0], cy = top[1] - 140 - 20 * (1 - eo(seal)); PR.dial(x, cx, cy, 42, { a: seal, col: CYAN, icon: 'lock', p: 1, rot: 0 }); }
  }
  x.restore();
 }

 function drawGraph(x, c, t) {
  const fade = (1 - 0.65 * sm(T.cubrir0 - 0.3, T.cubrir0 + 0.6, t)) * (1 - 0.5 * sm(T.leccion0, T.leccion0 + 1, t));
  const traceGlow = sm(T.rastro - 0.2, T.rastro + 0.5, t);
  const P0 = (n) => c.P(n.x, 0.02, n.z);
  x.save(); x.globalAlpha = fade * (1 - sm(sweep0, sweep1, t));
  // origen de las salidas (no un objeto genérico): anillo rojo pulsante
  if (t > T.fondos - 0.5 && t < T.cubrir0) {
   const o = c.P(0, 0.02, 0), pu = 0.5 + 0.5 * Math.sin(t * 4);
   x.strokeStyle = `rgba(255,69,58,${0.6 + 0.3 * pu})`; x.lineWidth = 4; x.beginPath(); x.ellipse(o[0], o[1], 34 + 6 * pu, (34 + 6 * pu) * Math.max(0.3, Math.sin(c.pitch)), 0, 0, 7); x.stroke();
   glowDot(x, o[0], o[1], 8, '255,69,58', 0.9);
  }
  for (const n of GRAPH.nodes) {
   const p = sm(n.t0, n.t1, t); if (p <= 0) continue;
   const A = n.parent.hop === 0 ? c.P(0, 0.02, 0) : P0(n.parent), Bp = P0(n);
   const red = n.hop === 1;
   const fr = n.freeze ? sm(n.freezeT, n.freezeT + 0.4, t) : 0;
   const base = red ? '255,69,58' : '56,189,248';
   const col = fr > 0 ? rgbOf(TEAL) : (traceGlow > 0 && !red ? '125,211,252' : base);
   const lw = (red ? 3.5 : 2.4) + traceGlow * 1.5;
   const mid = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2 - 18];
   const pts = S.bez(A, mid, mid, Bp, 18);
   x.save(); if (traceGlow > 0 && !red) { x.shadowColor = 'rgba(56,189,248,0.8)'; x.shadowBlur = 12 * traceGlow; }
   S.arrow(x, pts, p, `rgba(${col},${0.55 + 0.35 * traceGlow})`, lw, false); x.restore();
   if (p < 1) { const hp = pts[Math.min(pts.length - 1, Math.round(p * (pts.length - 1)))]; glowDot(x, hp[0], hp[1], 5, base, 1); }
   if (p > 0.9) {
    const fill = sm(n.t1 - 0.1, n.t1 + 0.4, t), rad = n.hop === 1 ? 14 : 11;
    x.fillStyle = 'rgba(6,7,10,0.9)'; x.beginPath(); x.arc(Bp[0], Bp[1], rad + 3, 0, 7); x.fill();
    x.strokeStyle = `rgba(${col},0.95)`; x.lineWidth = 3.5; x.beginPath(); x.arc(Bp[0], Bp[1], rad, -PI / 2, -PI / 2 + fill * PI * 2); x.stroke();
    if (fr > 0) {
     x.save(); x.globalAlpha *= fr; x.strokeStyle = TEAL; x.lineWidth = 3.5; x.shadowColor = 'rgba(45,212,191,0.9)'; x.shadowBlur = 16;
     x.beginPath(); for (let k = 0; k <= 6; k++) { const an = k / 6 * PI * 2 + PI / 6, rr = rad + 9 + 6 * (1 - fr); k ? x.lineTo(Bp[0] + rr * Math.cos(an), Bp[1] + rr * Math.sin(an)) : x.moveTo(Bp[0] + rr * Math.cos(an), Bp[1] + rr * Math.sin(an)); }
     x.stroke();
     // candado mínimo dentro del hexágono
     x.lineWidth = 2.5; x.beginPath(); x.roundRect(Bp[0] - 6, Bp[1] - 2, 12, 9, 2); x.stroke(); x.beginPath(); x.arc(Bp[0], Bp[1] - 2, 4.5, PI, 0); x.stroke();
     x.restore();
    } else if (!red && t > T.carrera0) {
     // sigue moviéndose: un pulso escapa hacia fuera
     const ph = ((t * 0.8 + n.x * 0.37) % 1), out = c.P(n.x * (1 + ph * 0.25), 0.02, n.z * (1 + ph * 0.25));
     glowDot(x, out[0], out[1], 4, '56,189,248', 0.8 * (1 - ph));
    }
   }
  }
  // indicadores de rastreo: retícula que salta de nodo en nodo
  if (t > T.rastro - 0.3 && t < T.cubrir0) {
   const list = GRAPH.nodes.filter((n) => n.hop >= 2 && t > n.t1);
   if (list.length) {
    const k = Math.floor((t - T.rastro) * 2.2) % list.length, n = list[(k + list.length) % list.length], P = P0(n), f = ((t - T.rastro) * 2.2) % 1;
    x.strokeStyle = 'rgba(56,189,248,0.95)'; x.lineWidth = 2.5; const r0 = 30 - 10 * eo(f);
    for (let q = 0; q < 4; q++) { const an = q * PI / 2 + PI / 4; x.beginPath(); x.arc(P[0], P[1], r0, an - 0.35, an + 0.35); x.stroke(); }
   }
  }
  x.restore();
 }

 // módulo de autorización: solicitud -> verificación -> firma; luego haz hacia la billetera y la red
 function drawTiles(x, c, t, a, dev) {
  const o = TILES(t);
  const st = [sm(T.pero10 + 0.5, T.pero10 + 0.8, t), sm(T.movs, T.movs + 0.3, t), sm(T.autoriz, T.autoriz + 0.3, t)];
  let cols = [BGOLD, BGOLD, BGOLD], mark = [0, 'v', 0];
  if (t > T.retiros) { cols = [RED, RED, RED]; mark = [0, 'x', 0]; }
  if (t > T.leccion0) { const red = sm(T.autoriz2, T.autoriz2 + 0.3, t) * (1 - sm(T.minutos2, T.minutos2 + 0.4, t)); cols = red > 0.5 ? [RED, RED, RED] : [BGOLD, BGOLD, BGOLD]; mark = red > 0.5 ? [0, 'x', 0] : [0, 'v', 0]; st[0] = st[1] = st[2] = sm(T.leccion0, T.leccion0 + 0.6, t); }
  const r = PR.tiles(x, c, Object.assign(o, { a, st, cols, mark }));
  // pulso que recorre las losetas
  const sp = sm(T.pero10 + 0.5, T.autoriz + 0.3, t);
  if (sp > 0 && sp < 1 && r.length === 3) { const seg = Math.min(1.999, sp * 2), i = Math.floor(seg), f = seg - i; const A = r[i].c, B = r[i + 1].c; glowDot(x, H.lerp(A[0], B[0], f), H.lerp(A[1], B[1], f) - 10, 7, '240,185,11', 1); }
  // haz desde la firma hasta la billetera; después la billetera emite la transacción a la red
  if (dev && r.length === 3) {
   const red = t > T.retiros && t < T.leccion0;
   const bp = sm(T.autoriz + 0.3, T.autoriz + 0.9, t) * (1 - sm(T.sorpr0, T.sorpr0 + 0.4, t));
   if (bp > 0) { const A = r[2].c, B = dev.ringAt(); x.save(); x.globalAlpha *= a; S.arrow(x, S.bez(A, [A[0] + 40, A[1] + 60], [B[0] + 120, B[1] - 120], B, 26), bp, red ? 'rgba(255,69,58,0.9)' : 'rgba(240,185,11,0.9)', 3.5); x.restore(); }
   const np = sm(T.seguras - 0.2, T.seguras + 0.5, t) * (1 - sm(T.retiros - 0.2, T.retiros, t));
   if (np > 0) { const A = c.P(0.4, 0.3, 0.2), B = c.P(BLOCKS[SEALB].x, 0.55, BLOCKS[SEALB].z); x.save(); x.globalAlpha *= a; S.arrow(x, S.bez(A, [A[0] + 80, A[1] + 30], [B[0] + 60, B[1] - 80], B, 26), np, 'rgba(56,189,248,0.9)', 3.5); x.restore(); }
  }
  return r;
 }

 // reservas corporativas: torre de lingotes digitales con el emblema; fuente independiente de las rutas del robo
 const TOWER = { x: 1.75, z: 0.3 };
 function drawTower(x, c, t, a, W, Hh, L) {
  PR.contact(x, c, TOWER.x, TOWER.z, 0.9, a);
  for (let k = 0; k < 4; k++) {
   const up = eo(sm(T.cubrir0 + k * 0.18, T.cubrir0 + 0.5 + k * 0.18, t));
   if (up <= 0) continue;
   PR.box3r(x, c, { x: TOWER.x, y: k * 0.3 + (1 - up) * 0.8, z: TOWER.z, ry: 0.35 }, 0.95, 0.27, 0.95, { alpha: a * up, top: 'rgba(240,185,11,0.55)', front: 'rgba(150,108,8,0.85)', side: 'rgba(104,74,6,0.85)', edge: 'rgba(255,224,138,0.75)', lw: 1.6 });
  }
  const ea = sm(T.cubriria - 0.2, T.cubriria + 0.4, t);
  if (ea > 0) PR.emblem3D(x, c, { x: TOWER.x, y: 1.25 + 0.04 * Math.sin(t * 1.5), z: TOWER.z, size: 0.8, depth: 0.16, ry: 0.35 + t * 0.4, a: a * ea, key: 1, rim: 1, spec: L.spec, glow: 0.7 }, false);
 }
 function goldFlow(x, c, t, a, dev) {
  const fp = sm(T.recursos - 0.3, T.repuesto + 0.4, t);
  if (fp <= 0) return;
  const from = c.P(TOWER.x, 1.25, TOWER.z), to = dev.ringAt();
  const pts = S.bez(from, [from[0], from[1] - 200], [to[0] + 160, to[1] - 220], to, 40);
  x.save(); x.globalAlpha *= a; x.shadowColor = 'rgba(240,185,11,0.8)'; x.shadowBlur = 14;
  S.arrow(x, pts, Math.min(1, fp * 1.6), 'rgba(240,185,11,0.95)', 4); x.restore();
  if (fp > 0.5) for (let i = 0; i < 6; i++) { const u = ((t * 0.9 + i / 6) % 1); const q = pts[Math.round(u * (pts.length - 1))]; glowDot(x, q[0], q[1], 6, '240,185,11', a * 0.9); }
 }

 // ================= RÓTULOS (no repiten el subtítulo salvo énfasis deliberado) =================
 function overlays(x, W, Hh, t, c, L, ob) {
  const { emb, dev, tiles } = ob;
  // ---- 01 acontecimiento
  {
   const a = 1 - sm(T.veinte - 0.6, T.veinte - 0.1, t);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    const pu = 0.65 + 0.35 * Math.sin(t * 5);
    kicker(x, 'ALERTA DE SEGURIDAD', 250, (1 - sm(T.plat - 0.4, T.plat, t)) * pu + sm(T.plat - 0.4, T.plat, t) * 0, RED);
    S.words(x, [{ s: '29', t: T.date - 0.62, fill: 'grad' }, { s: 'OCT', t: T.date + 0.7, fill: 'grad' }, { s: '2026', t: wt(0, '2026,'), fill: 'grad' }], 540, 360, 800, 112, t, { align: 'center', stops: GOLD });
    const ba = sm(T.binance, T.binance + 0.5, t);
    if (ba > 0) { x.save(); x.globalAlpha *= ba; S.setF(x, 800, 52); try { x.letterSpacing = '14px'; } catch (e) {} x.fillStyle = BGOLD; x.textAlign = 'center'; x.fillText('BINANCE', 548, 450); x.restore(); }
    S.label(x, 'fichas: ejemplos del ecosistema cripto', 540, 520, 600, 34, GREY2, 'center', fadeIO(t, T.plat, T.veinte - 0.2, 0.4));
    x.restore();
   }
  }
  // ---- 02 veinte minutos y miles de millones
  {
   const a = sm(T.veinte - 0.3, T.veinte + 0.2, t) * (1 - sm(T.b4 - 0.1, T.b4 + 0.4, t));
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    const cx = 330, cy = 300, R = 62, p = io(sm(T.veinte, T.minutos + 0.8, t));
    x.strokeStyle = 'rgba(255,255,255,0.14)'; x.lineWidth = 9; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
    x.strokeStyle = BGOLD; x.lineCap = 'round'; x.shadowColor = 'rgba(240,185,11,0.7)'; x.shadowBlur = 16;
    x.beginPath(); x.arc(cx, cy, R, -PI / 2, -PI / 2 + p * PI * 2 / 3); x.stroke(); x.shadowBlur = 0;
    x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.sin(p * PI * 2 / 3) * R * 0.7, cy - Math.cos(p * PI * 2 / 3) * R * 0.7); x.stroke();
    S.label(x, '≈20 min', cx + R + 24, cy + 22, 800, 72, INK, 'left', sm(T.veinte, T.veinte + 0.4, t));
    S.label(x, 'la mayor parte de los fondos · TRM Labs', 540, 412, 600, 32, GREY2, 'center', sm(T.minutos, T.minutos + 0.5, t));
    x.restore();
    const np = eo(sm(T.seis, T.dolares + 0.2, t)), lk = t > T.dolares ? Math.exp(-(t - T.dolares) * 2.2) : 0, na = sm(T.seis - 0.25, T.seis + 0.1, t);
    if (na > 0) {
     const val = Math.round(6300 * np), s = 'US$' + String(val).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' M';
     x.save(); x.globalAlpha = a * na; S.setF(x, 800, 124);
     const w = x.measureText(s).width + 124 * 0.62, X0 = 540 - w / 2, Y = 545, zoom = 1 + 0.04 * lk;
     x.translate(540, Y); x.scale(zoom, zoom); x.translate(-540, -Y);
     x.shadowColor = `rgba(240,185,11,${0.45 + 0.4 * lk})`; x.shadowBlur = 40 + 60 * lk;
     S.approx(x, X0, Y - 124 * 0.36, 124 * 0.56, '#ffe08a');
     x.fillStyle = S.grad(x, X0, X0 + w, GOLD); x.textAlign = 'left'; x.fillText(s, X0 + 124 * 0.62, Y); x.shadowBlur = 0; x.fillText(s, X0 + 124 * 0.62, Y);
     x.restore();
     S.label(x, 'cálculo de Binance · TRM: ≈6.360 M en 10 redes', 540, 605, 400, 32, GREY2, 'center', a * sm(T.dolares, T.dolares + 0.5, t));
     // el valor sube del emblema a la cifra (flujo integrado con el número)
     if (emb && t < T.dolares + 0.6) { const from = c.P(0, emb.y + emb.size * 0.6, emb.z), r = H.rng(12); for (let k = 0; k < 14; k++) { const ph = ((t - T.seis) * 0.9 + r()) % 1; if (t < T.seis) break; const X = H.lerp(from[0] + (r() - 0.5) * 160, 540 + (r() - 0.5) * 300, io(ph)), Y2 = H.lerp(from[1], 560, io(ph)); glowDot(x, X, Y2, 3.5, '240,185,11', a * (1 - ph) * na); } }
    }
   }
  }
  // ---- 03 no fue un robo físico
  {
   const a = fadeIO(t, T.b4 - 0.1, T.todo, 0.3);
   if (a > 0) {
    kicker(x, 'NO FUE UN ROBO FÍSICO', 250, a * sm(T.b4, T.b4 + 0.4, t) * (1 - sm(T.como - 0.3, T.como, t)), GREY2);
    const qa = sm(T.como - 0.05, T.como + 0.35, t) * (1 - sm(T.todo - 0.3, T.todo, t));
    if (qa > 0) S.words(x, [{ s: '¿Cómo?', t: T.como, fill: 'grad' }], 540, 380, 800, 150, t, { align: 'center', stops: GOLD });
   }
  }
  // ---- 04 billetera caliente
  {
   const a = fadeIO(t, T.todo, T.pero10 + 0.2, 0.5);
   if (a > 0) {
    const ha = a * (1 - sm(T.sistemas + 0.2, T.sistemas + 0.7, t));
    x.save(); x.globalAlpha = ha;
    S.words(x, [{ s: 'Billetera', t: T.billeteras }, { s: 'caliente', t: T.calientes, fill: 'grad' }], 540, 330, 800, 100, t, { align: 'center', stops: GOLD });
    S.label(x, 'hot wallet: fondos listos para mover', 540, 395, 600, 36, GREY2, 'center', sm(T.calientes, T.calientes + 0.5, t));
    x.restore();
    // dentro de la pantalla: conexiones a internet que salen por los bordes
    if (dev && t > T.internet - 0.8) {
     const na = a * sm(T.internet - 0.8, T.internet, t) * (1 - sm(T.movs - 0.5, T.movs, t));
     const [TL, TR, BL, BR] = dev.screen, r = H.rng(31);
     x.save(); x.globalAlpha = na;
     for (let i = 0; i < 14; i++) {
      const side = i % 4, u = r();
      const P0 = side === 0 ? [H.lerp(TL[0], TR[0], u), H.lerp(TL[1], TR[1], u)] : side === 1 ? [H.lerp(TR[0], BR[0], u), H.lerp(TR[1], BR[1], u)] : side === 2 ? [H.lerp(BL[0], BR[0], u), H.lerp(BL[1], BR[1], u)] : [H.lerp(TL[0], BL[0], u), H.lerp(TL[1], BL[1], u)];
      const an = Math.atan2(P0[1] - 960, P0[0] - 540), E = [540 + Math.cos(an) * 1300, 960 + Math.sin(an) * 1300];
      const pts = S.bez(P0, P0, E, E, 20);
      S.arrow(x, pts, sm(T.internet - 0.8 + i * 0.03, T.internet + 0.2 + i * 0.03, t), 'rgba(56,189,248,0.55)', 2, false);
      if (t > T.mover) { const ph = ((t - T.mover) * 1.3 + i * 0.17) % 1, q = pts[Math.round(ph * (pts.length - 1))]; if (i % 3 === 0) PR.coin(x, q[0], q[1], 22, ['btc', 'eth', 'usdt', 'bnb'][i % 4], { a: na * (1 - ph), th: 0.1 }); else glowDot(x, q[0], q[1], 4, '56,189,248', na * (1 - ph)); }
     }
     x.restore();
     S.label(x, 'EN LÍNEA · CONECTADA A INTERNET', 540, 250, 800, 40, CYAN, 'center', na * (1 - sm(T.mover - 0.2, T.mover + 0.2, t)));
     S.label(x, 'MOVIMIENTOS RÁPIDOS', 540, 250, 800, 40, CYAN, 'center', na * sm(T.mover, T.mover + 0.3, t));
     S.label(x, 'activos de ejemplo', 540, 300, 600, 32, GREY2, 'center', na * sm(T.mover, T.mover + 0.3, t));
    }
   }
  }
  // ---- 05 autorización digital: dos capas
  {
   const a = fadeIO(t, T.pero10 + 0.1, T.durante + 0.3, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    S.words(x, [{ s: 'Autorización', t: T.autoriz, fill: 'grad' }, { s: 'digital', t: T.autoriz + 0.35 }], 540, 300, 800, 84, t, { align: 'center', stops: GOLD });
    x.restore();
    if (tiles && tiles.length === 3) {
     const names = [['1', 'Solicitud', T.pero10 + 0.5], ['2', 'Verificación', T.movs], ['3', 'Firma', T.autoriz]];
     tiles.forEach((r, i) => { const bl = r.front[2], br = r.v[r.id(1, 0, 1)]; S.label(x, names[i][0] + ' · ' + names[i][1], (bl[0] + br[0]) / 2, Math.max(bl[1], br[1]) + 38, 600, 30, BGOLD, 'center', a * sm(names[i][2], names[i][2] + 0.4, t)); });
     S.label(x, 'CAPA 1 · BINANCE (interna)', 540, 420, 800, 36, BGOLD, 'center', a * sm(T.pero10 + 0.4, T.pero10 + 0.9, t));
    }
    const ch = c.P(0, 0, BLOCKS[0].z + 0.5);
    S.label(x, 'CAPA 2 · RED BLOCKCHAIN (pública)', 540, Math.min(1380, ch[1] + 40), 800, 36, CYAN, 'center', a * sm(T.seguras - 0.3, T.seguras + 0.4, t));
    S.label(x, 'la red acepta transacciones bien firmadas', 540, Math.min(1420, ch[1] + 84), 400, 32, GREY2, 'center', a * sm(T.seguras, T.seguras + 0.5, t));
   }
  }
  // ---- 06 retiros no autorizados
  {
   const a = fadeIO(t, T.durante, T.sorpr0 + 0.2, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    S.words(x, [{ s: 'Retiros', t: T.retiros }, { s: 'no', t: T.noaut, fill: RED }, { s: 'autorizados', t: T.autorizado, fill: RED }], 540, 300, 800, 84, t, { align: 'center' });
    x.restore();
    chipTag(x, 'RECREACIÓN CONCEPTUAL', 540, 380, 28, GREY2, a * sm(T.durante, T.durante + 0.5, t));
    const ia = sm(T.investiga, T.investiga + 0.5, t);
    if (ia > 0) { x.save(); x.globalAlpha = a * ia; S.label(x, 'Mecanismo: en investigación', 540, 470, 600, 42, INK, 'center'); S.label(x, 'según Binance, 30-31 oct 2026', 540, 515, 400, 32, GREY2, 'center'); x.restore(); }
   }
  }
  // ---- 07 confirmación en blockchain
  {
   const a = fadeIO(t, T.sorpr0, T.fondos + 0.2, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    kicker(x, 'REGISTRO DISTRIBUIDO', 250, sm(T.sorpr0, T.sorpr0 + 0.6, t), INK);
    S.words(x, [{ s: 'Confirmada', t: T.confirmada, fill: 'grad' }], 540, 350, 800, 96, t, { align: 'center', stops: GT });
    S.label(x, 'confirmaciones (ilustrativo)', 540, 405, 600, 32, GREY2, 'center', sm(T.confirmada + 0.3, T.confirmada + 0.8, t));
    x.restore();
    const ba = sm(T.normalmente, T.normalmente + 0.5, t);
    if (ba > 0) {
     const cx = 540, cy = 1215, w = 400, h = 100;
     x.save(); x.globalAlpha = a * ba;
     x.beginPath(); x.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2); x.fillStyle = 'rgba(29,32,40,0.92)'; x.fill(); x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 2; x.stroke();
     x.strokeStyle = INK; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.arc(cx - 110, cy, 22, PI * 1.15, PI * 2.75); x.stroke();
     const ae = PI * 1.15, hx = cx - 110 + 22 * Math.cos(ae), hy = cy + 22 * Math.sin(ae);
     x.beginPath(); x.moveTo(hx - 12, hy - 2); x.lineTo(hx, hy); x.lineTo(hx + 2, hy - 13); x.stroke();
     S.label(x, 'Deshacer', cx + 30, cy + 15, 600, 44, INK, 'center');
     const st = sm(T.boton, T.deshacer + 0.25, t);
     if (st > 0) { x.strokeStyle = RED; x.lineWidth = 8; x.shadowColor = 'rgba(255,69,58,0.6)'; x.shadowBlur = 14; x.beginPath(); x.moveTo(cx - w / 2 - 10, cy + 6); x.lineTo(cx - w / 2 - 10 + (w + 20) * io(st), cy - 6); x.stroke(); x.shadowBlur = 0; }
     x.restore();
     S.label(x, '*normalmente no hay reversión automática', 540, 1312, 600, 32, GREY2, 'center', a * sm(T.deshacer, T.deshacer + 0.5, t));
    }
   }
  }
  // ---- 08 dispersión y rastreo
  {
   const a = fadeIO(t, T.fondos, T.carrera0 + 0.2, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    S.words(x, [{ s: 'Rastro', t: T.distrib }, { s: 'público', t: T.distrib + 0.4, fill: 'grad' }], 540, 290, 800, 88, t, { align: 'center', stops: GT });
    S.label(x, 'direcciones de los atacantes · varias redes', 540, 350, 600, 32, GREY2, 'center', sm(T.direcc, T.direcc + 0.5, t) * (1 - sm(T.seguir - 0.4, T.seguir, t)));
    const va = sm(T.nosig - 0.1, T.nosig + 0.4, t);
    if (va > 0) {
     x.globalAlpha = a * va;
     S.label(x, 'SEGUIR UNA TRANSACCIÓN', 540, 400, 800, 52, CYAN, 'center');
     S.setF(x, 800, 52); const s2 = 'RECUPERAR EL DINERO', w2 = x.measureText(s2).width, X0 = 540 - (w2 + 70) / 2;
     S.neq(x, X0, 470 - 19, 46, RED); x.fillStyle = INK; x.textAlign = 'left'; x.fillText(s2, X0 + 70, 470);
    }
    x.restore();
   }
  }
  // ---- 09 rastreo + congelamiento
  {
   const a = fadeIO(t, T.carrera0, T.cubrir0 + 0.1, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    S.words(x, [{ s: 'Rastrear', t: T.carrera, fill: CYAN }, { s: 'y', t: T.carrera + 0.3 }, { s: 'congelar', t: T.localizar, fill: TEAL }], 540, 290, 800, 84, t, { align: 'center' });
    const cx = 540, cy = 380, R = 30, sp = (t - T.carrera0) * 0.9;
    x.strokeStyle = 'rgba(255,255,255,0.25)'; x.lineWidth = 5; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
    x.strokeStyle = CYAN; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + R * 0.8 * Math.sin(sp * PI * 2), cy - R * 0.8 * Math.cos(sp * PI * 2)); x.stroke();
    x.restore();
    const fa = sm(T.congelar - 0.1, T.congelar + 0.6, t);
    if (fa > 0) {
     x.save(); x.globalAlpha = a * fa; S.setF(x, 800, 100);
     const s = 'US$3.000 M', w = x.measureText(s).width + 100 * 0.62, X0 = 540 - w / 2;
     x.shadowColor = 'rgba(45,212,191,0.6)'; x.shadowBlur = 40;
     S.approx(x, X0, 520 - 100 * 0.36, 100 * 0.56, '#7cf0b8');
     x.fillStyle = S.grad(x, X0, X0 + w, GG); x.textAlign = 'left'; x.fillText(s, X0 + 100 * 0.62, 520); x.shadowBlur = 0; x.fillText(s, X0 + 100 * 0.62, 520);
     S.label(x, 'congelados on-chain: solo una parte', 540, 575, 600, 38, TEAL, 'center');
     S.label(x, 'Binance, 30 oct', 540, 615, 400, 32, GREY2, 'center');
     x.restore();
    }
    chipTag(x, 'CONGELADO', 370, 690, 30, TEAL, a * sm(T.congelar, T.congelar + 0.4, t));
    chipTag(x, 'SIGUE MOVIÉNDOSE', 710, 690, 30, CYAN, a * sm(T.congelar + 0.2, T.congelar + 0.6, t));
   }
  }
  // ---- 10 reposición desde fuente independiente
  {
   const a = fadeIO(t, T.cubrir0, T.oct31, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    S.words(x, [{ s: 'Fuente', t: T.cubrir0 + 0.2 }, { s: 'independiente', t: T.cubriria, fill: 'grad' }], 540, 300, 800, 84, t, { align: 'center', stops: GOLD });
    S.label(x, 'no viene de los atacantes', 540, 365, 600, 38, GREY2, 'center', sm(T.cubriria + 0.2, T.cubriria + 0.7, t));
    x.restore();
    const tp = c.P(TOWER.x, 1.7, TOWER.z);
    S.callout(x, [tp, [tp[0] - 30, tp[1] - 160], [Math.min(tp[0] - 70, 760), tp[1] - 160]], sm(T.cubriria, T.cubriria + 0.8, t) * a, 'Reservas de Binance', 'SAFU · tesorería · seguros', 'l', { px: 38, ink: '240,185,11', subFill: GREY2 });
    S.label(x, 'rutas del robo: siguen fuera', 280, 1310, 600, 34, RED, 'center', a * sm(T.recursos, T.recursos + 0.5, t));
   }
  }
  // ---- 11 el 90 %
  {
   const a = fadeIO(t, T.oct31 - 0.2, T.leccion0 + 0.2, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    kicker(x, '31 OCT 2026', 230, 1, BGOLD);
    const gp = io(sm(T.noventa - 0.3, T.noventa + 0.7, t)) * 0.9, cx = 540, cy = 430, R = 170;
    const lk = t > T.noventa + 0.7 ? Math.exp(-(t - T.noventa - 0.7) * 2.2) : 0, at = t > T.atencion ? Math.exp(-(t - T.atencion) * 3) : 0;
    // indicador: llega a su valor definitivo (sin etapas numéricas intermedias)
    x.strokeStyle = 'rgba(255,255,255,0.12)'; x.lineWidth = 18; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
    if (gp > 0) { x.strokeStyle = S.grad(x, cx - R, cx + R, GOLD); x.lineCap = 'round'; x.shadowColor = 'rgba(240,185,11,0.8)'; x.shadowBlur = 24 + 30 * lk; x.beginPath(); x.arc(cx, cy, R, -PI / 2, -PI / 2 + gp * PI * 2); x.stroke(); x.shadowBlur = 0; }
    // el 10 % restante, en rojo tenue: aún por reponer
    if (gp >= 0.89) { x.strokeStyle = 'rgba(255,69,58,0.55)'; x.lineWidth = 18; x.beginPath(); x.arc(cx, cy, R, -PI / 2 + 0.9 * PI * 2 + 0.06, PI * 1.5 - 0.06); x.stroke(); }
    const na = sm(T.noventa + 0.2, T.noventa + 0.6, t);
    if (na > 0) { x.save(); x.globalAlpha = a * na; x.filter = na < 0.95 ? `blur(${((1 - na) * 10).toFixed(1)}px)` : 'none'; S.setF(x, 800, 150); x.textAlign = 'center'; x.fillStyle = S.grad(x, cx - 160, cx + 160, GOLD); x.shadowColor = `rgba(240,185,11,${0.5 + 0.4 * lk})`; x.shadowBlur = 40 + 50 * lk; x.fillText('90 %', cx, cy + 52); x.shadowBlur = 0; x.fillText('90 %', cx, cy + 52); x.restore(); }
    S.label(x, 'REPUESTO CON RECURSOS PROPIOS', 540, 670, 800, 46, INK, 'center', sm(T.repuesto, T.repuesto + 0.4, t));
    if (at > 0.01) { x.globalAlpha = a * at * 0.5; const g = x.createRadialGradient(cx, cy, 0, cx, cy, 560); g.addColorStop(0, 'rgba(255,69,58,0.55)'); g.addColorStop(1, 'rgba(255,69,58,0)'); x.fillStyle = g; x.fillRect(0, 0, W, 1100); x.globalAlpha = a; }
    const ra = sm(T.recuperado - 0.1, T.recuperado + 0.4, t);
    if (ra > 0) {
     x.globalAlpha = a * ra;
     S.label(x, 'NO SIGNIFICA', 540, 735, 800, 40, RED, 'center');
     S.label(x, '90 % RECUPERADO DEL ROBO', 540, 790, 800, 50, RED, 'center');
     chipTag(x, '90 % REPUESTO', 330, 870, 30, BGOLD, sm(T.noventa2, T.noventa2 + 0.4, t));
     chipTag(x, '≈3.000 M CONGELADOS', 750, 870, 30, TEAL, sm(T.noventa2 + 0.2, T.noventa2 + 0.6, t));
    }
    x.restore();
   }
  }
  // ---- 12 conclusión
  {
   const a = fadeIO(t, T.leccion0, sweep0 + 0.2, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    kicker(x, 'LA LECCIÓN', 250, sm(T.leccion0 + 0.2, T.leccion + 0.2, t), GREY2);
    S.words(x, [{ s: 'Autorización', t: T.autoriz2, fill: 'grad' }], 540, 345, 800, 84, t, { align: 'center', stops: GOLD });
    S.words(x, [{ s: 'comprometida', t: wt(25, 'comprometida'), fill: RED }], 540, 432, 800, 84, t, { align: 'center' });
    S.words(x, [{ s: 'miles', t: T.miles }, { s: 'de', t: T.miles + 0.25 }, { s: 'millones', t: wt(25, 'millones') }, { s: '·', t: wt(25, 'cuestión'), fill: GREY2 }, { s: 'minutos', t: T.minutos2, fill: 'grad' }], 540, 525, 800, 56, t, { align: 'center', stops: GT });
    x.restore();
    // rastro luminoso: firma -> billetera -> salidas no autorizadas (consecuencia)
    if (tiles && tiles.length === 3 && dev) {
     const tp = sm(T.autoriz2, T.miles + 0.4, t) * (1 - sm(T.minutos2 + 0.3, T.minutos2 + 0.9, t));
     if (tp > 0) {
      const A0 = tiles[2].c, B0 = dev.ringAt(), base = c.P(0, 0.05, 0.1);
      const pts = S.bez(A0, [A0[0] + 60, A0[1] + 80], [B0[0] + 140, B0[1] - 120], B0, 20).concat(S.bez(B0, [B0[0], B0[1] + 60], [base[0], base[1] - 40], base, 10));
      GRAPH.nodes.filter((n) => n.hop === 1).slice(0, 4).forEach((n) => { const E = c.P(n.x * 0.8, 0.02, n.z * 0.8); pts.push(...S.bez(base, base, E, E, 6)); pts.push(base); });
      x.save(); x.globalAlpha = a; x.shadowColor = 'rgba(255,120,90,0.9)'; x.shadowBlur = 18; S.arrow(x, pts, tp, 'rgba(255,140,110,0.9)', 4, false); x.restore();
     }
    }
   }
  }
 }

 // ================= ESCENA BLANCA (barrido de luz propio del estilo) =================
 function whiteScene(x, W, Hh, t, c, L) {
  const Lw = Object.assign({}, L, { white: 1, key: 1, rim: 1 });
  S.stage(x, W, Hh, c, Lw, t);
  // el rastro permanece: trazas finas en el suelo
  x.save(); x.globalAlpha = 0.45; x.strokeStyle = 'rgba(14,165,233,0.7)'; x.lineWidth = 2.5;
  for (const n of GRAPH.nodes) if (n.hop === 1) { const a = c.P(0, 0.01, 0), b = c.P(n.x, 0.01, n.z); x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
  x.restore();
  // el acceso queda cerrado: dial-candado en oro sobre el escenario blanco
  const p = c.P(0, 1.2, 0);
  PR.contact(x, c, 0, 0, 0.8, 0.5);
  PR.dial(x, p[0], p[1] + 40, 150, { a: 1, col: '#d9a400', icon: 'lock', rot: t * 0.2, glow: 0.4, lockOpen: 0 });
  S.words(x, [{ s: 'La', t: wt(27, 'la'), fill: '#1d1d1f' }, { s: 'ciencia', t: wt(27, 'ciencia'), fill: '#1d1d1f' }, { s: 'oculta', t: wt(27, 'oculta'), fill: '#1d1d1f' }], 540, 400, 800, 92, t, { align: 'center' });
  S.words(x, [{ s: 'de', t: wt(27, 'de'), fill: '#1d1d1f' }, { s: 'lo', t: wt(27, 'lo'), fill: '#1d1d1f' }, { s: 'imposible.', t: wt(27, 'imposible'), fill: 'grad' }], 540, 510, 800, 92, t, { align: 'center', stops: ['#c99400', '#f0b90b', '#ff7a2f'] });
 }

 function subtitles(x, W, Hh, t) {
  const ph = A.phrases.find((p) => t >= p.s && t < p.e);
  if (!ph) return;
  { // sombra suave detrás de la franja de subtítulos (degradado, sin caja sólida)
   const white0 = t >= sweep1, g = x.createLinearGradient(0, 1330, 0, 1680);
   const c0 = white0 ? '255,255,255' : '3,3,4';
   g.addColorStop(0, `rgba(${c0},0)`); g.addColorStop(0.35, `rgba(${c0},0.55)`); g.addColorStop(0.7, `rgba(${c0},0.55)`); g.addColorStop(1, `rgba(${c0},0)`);
   x.save(); x.fillStyle = g; x.fillRect(0, 1330, W, 350); x.restore();
  }
  const a = sm(ph.s - 0.02, ph.s + 0.12, t) * (1 - sm(ph.e - 0.12, ph.e, t));
  const white = t >= sweep1;
  let px = 64; S.setF(x, 600, px);
  const maxW = 900;
  let widest = Math.max(...ph.lines.map((l) => x.measureText(l).width));
  if (widest > maxW) { px = Math.floor(px * maxW / widest); S.setF(x, 600, px); }
  const lh = px * 1.22, y0 = 1500 - (ph.lines.length - 1) * lh / 2;
  x.save(); x.globalAlpha = a; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
  // posiciones de palabra
  const sp = x.measureText(' ').width;
  let wi = 0; const boxes = [];
  ph.lines.forEach((ln, li) => {
   const ws = ln.split(' '), lw = x.measureText(ln).width; let cx = 540 - lw / 2;
   ws.forEach((w) => { const ww = x.measureText(w).width; boxes.push({ w, x: cx, y: y0 + li * lh, ww, s: ph.w[wi] ? ph.w[wi].s : ph.s, e: ph.w[wi] ? ph.w[wi].e : ph.e }); wi++; cx += ww + sp; });
  });
  // barra amarilla viva bajo la palabra activa (interpolada entre palabras)
  let act = boxes.findIndex((b) => t >= b.s && t < b.e); if (act < 0) act = t >= boxes[boxes.length - 1].s ? boxes.length - 1 : 0;
  const b0 = boxes[act], nb = boxes[act + 1];
  let bx = b0.x, bw = b0.ww, by = b0.y;
  if (nb && nb.y === b0.y) { const f = io(sm(b0.e - 0.08, b0.e, t)); bx = H.lerp(b0.x, nb.x, f); bw = H.lerp(b0.ww, nb.ww, f); }
  x.save(); x.fillStyle = BGOLD; x.shadowColor = 'rgba(240,185,11,0.8)'; x.shadowBlur = 12; x.beginPath(); x.roundRect(bx, by + px * 0.16, bw, Math.max(5, px * 0.09), 3); x.fill(); x.restore();
  for (const b of boxes) {
   x.shadowColor = white ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.8)'; x.shadowBlur = 14; x.shadowOffsetY = 3;
   x.fillStyle = white ? '#1d1d1f' : '#ffffff'; x.fillText(b.w, b.x, b.y);
  }
  x.restore();
 }
 function brand(x, t) {
  const white = t >= sweep1;
  x.save(); x.font = '600 30px "Inter"'; try { x.letterSpacing = '7px'; } catch (e) {}
  x.globalAlpha = 0.62; x.fillStyle = white ? '#6e6e73' : '#a1a1a6'; x.textAlign = 'left'; x.fillText('ASOMBROTECA', 64, 150); x.restore();
 }

 // ================= ENTRADA =================

 // ================= ENTRADA =================
 function explainer(ctx, W, Hh, t) {
  const c = S.cam(S.keyed(KEYS, t));
  const L = lighting(t);
  if (t < sweep1) darkScene(ctx, W, Hh, t, c, L);
  if (t >= sweep0) {
   const by = H.lerp(Hh + 300, -300, io(sm(sweep0, sweep1, t)));
   ctx.save();
   if (t < sweep1) { ctx.beginPath(); ctx.rect(0, Math.max(0, by), W, Hh); ctx.clip(); }
   whiteScene(ctx, W, Hh, t, c, L);
   ctx.restore();
   if (t < sweep1 + 0.05) {
    const g = ctx.createLinearGradient(0, by + 300, 0, by - 140);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.7, 'rgba(255,255,255,0.9)'); g.addColorStop(0.85, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, by - 140, W, 440); ctx.restore();
   }
  }
  S.finish(ctx, W, Hh, t, t >= sweep1);
  brand(ctx, t);
  subtitles(ctx, W, Hh, t);
 }

 window.BINANCE = { explainer, T, B, KEYS, DURATION, wt, sweep0, sweep1, GRAPH, balance, BLOCKS, TOWER };
})();
