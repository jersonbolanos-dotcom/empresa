// =====================================================================================================
// binance.js — explainer(ctx, W, H_, t) vertical 1080x1920 para "El robo de Binance" (Asombroteca)
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

 // ---------- cámara: una sola cámara de estudio continua ----------
 const KEYS = [
  { t: 0, cx: 540, cy: 1170, s: 1.101, yaw: -0.95, pitch: 0.30 },
  { t: T.binance, cx: 540, cy: 1180, s: 1.178, yaw: -0.72, pitch: 0.34 },
  { t: T.veinte - 0.6, cx: 540, cy: 1200, s: 1.229, yaw: -0.5, pitch: 0.38 },
  { t: T.dolaresE, cx: 540, cy: 1220, s: 1.152, yaw: -0.3, pitch: 0.40 },
  { t: T.b4 + 0.3, cx: 540, cy: 1280, s: 1.024, yaw: -0.18, pitch: 0.36 },
  { t: T.dinero, cx: 540, cy: 1260, s: 1.05, yaw: -0.1, pitch: 0.40 },
  // atravesar el cristal: dolly-in hasta el die, cámara casi cenital
  { t: T.billeteras, cx: 540, cy: 1190, s: 1.344, yaw: 0.0, pitch: 0.62 },
  { t: T.internet, cx: 540, cy: 1060, s: 1.9, yaw: 0.12, pitch: 1.12 },
  { t: T.rapid + 0.3, cx: 540, cy: 1050, s: 1.95, yaw: 0.22, pitch: 1.14 },
  // salir: objeto + ledger detrás
  { t: T.movs, cx: 470, cy: 1300, s: 0.998, yaw: 0.35, pitch: 0.48 },
  { t: T.seguras + 0.3, cx: 460, cy: 1310, s: 0.973, yaw: 0.42, pitch: 0.50 },
  // ataque: subir para ver las direcciones externas en el suelo
  { t: T.retiros, cx: 560, cy: 1190, s: 0.794, yaw: 0.25, pitch: 0.72 },
  { t: T.comprom + 0.4, cx: 560, cy: 1180, s: 0.768, yaw: 0.15, pitch: 0.74 },
  // sellado del bloque: macro sobre la cadena de bloques
  { t: T.sorpr0 + 0.4, cx: 540, cy: 1260, s: 0.794, yaw: 0.0, pitch: 0.48 },
  { t: T.deshacer + 0.6, cx: 540, cy: 1250, s: 0.845, yaw: -0.08, pitch: 0.48 },
  // dispersión: cenital, red en el suelo
  { t: T.distrib, cx: 540, cy: 950, s: 0.448, yaw: -0.2, pitch: 1.05 },
  { t: T.redes + 0.4, cx: 540, cy: 910, s: 0.381, yaw: -0.45, pitch: 1.18 },
  { t: T.recuperar, cx: 540, cy: 910, s: 0.403, yaw: -0.7, pitch: 1.18 },
  { t: T.congelar, cx: 560, cy: 920, s: 0.426, yaw: -1.0, pitch: 1.12 },
  { t: T.bloquearse + 0.5, cx: 560, cy: 930, s: 0.414, yaw: -1.08, pitch: 1.1 },
  // cobertura desde reservas: vuelta al objeto
  { t: T.recursos, cx: 540, cy: 1270, s: 0.896, yaw: -0.7, pitch: 0.5 },
  { t: T.noventa, cx: 540, cy: 1340, s: 0.794, yaw: -0.55, pitch: 0.44 },
  { t: T.robado + 0.4, cx: 540, cy: 1350, s: 0.768, yaw: -0.45, pitch: 0.44 },
  // cierre: regreso al héroe
  { t: T.leccion, cx: 540, cy: 1210, s: 1.075, yaw: -0.3, pitch: 0.4 },
  { t: T.minutos2, cx: 540, cy: 1180, s: 1.178, yaw: 0.05, pitch: 0.38 },
  { t: DURATION, cx: 540, cy: 1200, s: 1.203, yaw: 0.3, pitch: 0.36 },
 ];
 KEYS.sort((a, b) => a.t - b.t);

 // ---------- grafo de direcciones (mundo, plano del suelo) ----------
 const GRAPH = (() => {
  const r = H.rng(2026), nodes = [], edges = [];
  const root = { x: 0, z: 0, hop: 0 };
  // hop 1: retiros no autorizados hacia direcciones externas (lado izquierdo/fondo, lejos de la cadena de bloques)
  const N1 = 7;
  for (let i = 0; i < N1; i++) {
   const an = H.lerp(PI * 0.62, PI * 1.62, i / (N1 - 1)) + r.range(-0.08, 0.08), rad = r.range(1.9, 2.3);
   const t0 = H.lerp(T.retiros - 0.1, T.autorizado + 0.3, i / (N1 - 1));
   nodes.push({ x: Math.cos(an) * rad, z: Math.sin(an) * rad, hop: 1, parent: root, t0, t1: t0 + 0.55, an });
  }
  const h1 = nodes.slice();
  // hop 2/3: distribución por distintas redes
  const chainCols = ['#38bdf8', '#7dd3fc', '#60a5fa', '#22d3ee', '#93c5fd', '#38bdf8', '#67e8f9', '#0ea5e9', '#a5b4fc', '#5eead4'];
  let ci = 0;
  h1.forEach((p, i) => {
   const n2 = r.int(2, 3);
   for (let k = 0; k < n2; k++) {
    const an = p.an + (k - (n2 - 1) / 2) * 0.32 + r.range(-0.06, 0.06), rad = r.range(3.2, 3.7);
    const t0 = H.lerp(T.distrib, T.direcc + 0.6, (i * 3 + k) / (h1.length * 3)) + r.range(0, 0.2);
    const q = { x: Math.cos(an) * rad, z: Math.sin(an) * rad, hop: 2, parent: p, t0, t1: t0 + 0.6, an, chain: ci++ % 10 };
    nodes.push(q);
    if (r.chance(0.7)) {
     const an3 = an + r.range(-0.18, 0.18), rad3 = r.range(4.5, 5.2), t3 = H.lerp(T.direcc, T.redes + 0.3, r()) ;
     nodes.push({ x: Math.cos(an3) * rad3, z: Math.sin(an3) * rad3, hop: 3, parent: q, t0: t3, t1: t3 + 0.6, an: an3, chain: q.chain });
    }
   }
  });
  // algunos se pueden congelar (emisores de stablecoins, etc.), otros no
  const fz = nodes.filter((n) => n.hop >= 2);
  fz.forEach((n, i) => { n.freeze = r.chance(0.45); n.freezeT = H.lerp(T.congelar - 0.3, T.bloquearse + 0.5, r()); });
  return { nodes, chainCols };
 })();

 // ---------- cadena de bloques (mundo) ----------
 const BLOCKS = Array.from({ length: 6 }, (_, i) => ({ x: -1.0 + i * 0.95, z: -2.55 }));
 const SEALB = 3; // bloque que se sella en el beat 07

 // ---------- luz ----------
 function lighting(t) {
  const L = {
   key: (0.45 + 0.55 * sm(0.4, 2.2, t)) * (1 - 0.35 * sm(T.b4, T.b4 + 0.6, t) * (1 - sm(T.todo - 0.4, T.todo + 0.4, t))) * (1 - 0.3 * sm(T.sorpr0, T.sorpr, t) * (1 - sm(T.confirmada, T.confirmada + 1, t))),
   rim: 0.35 + 0.65 * sm(0.0, 0.9, t),
   hover: 0.36 + 0.015 * Math.sin(t * 1.2),
   ringRot: t * 0.3, act: sm(1.5, 3, t),
   spec: -1,
  };
  // barridos especulares motivados: revelación inicial, entrada al cristal, sellado, regreso final
  const sw = [[1.6, 3.4], [T.billeteras - 0.2, T.calientes + 0.6], [T.confirmada, T.confirmada + 1.1], [T.leccion, T.leccion + 1.6]];
  for (const [a, b] of sw) if (t > a - 0.3 && t < b + 0.3) L.spec = H.map(t, a, b, -0.25, 1.25);
  // anillo: encendido en el gancho; rojo en el ataque; cian rastreo; oro reposición; se cierra al final
  const pulses = [T.binance, T.dolares, T.calientes, T.seguras, T.retiros, T.confirmada, T.rastro, T.recursos, T.noventa, T.minutos2];
  L.ring = t < 1.2 ? 0 : S.ringGlow(sm(1.2, 1.8, t) * 0.85, t, pulses) * (1 - 0.6 * sm(T.leccion, T.minutos2, t));
  if (t > T.durante - 0.2 && t < T.sorpr0) { L.ringCols = ['#ff453a', '#ff9a4d', '#ff453a', '#e879f9', '#ff453a']; L.ringGlow = 'rgba(255,69,58,0.9)'; L.spill = '255,69,58'; }
  else if (t >= T.fondos && t < T.cubrir0) { L.ringCols = ['#38bdf8', '#5eead4', '#6d7cff', '#38bdf8']; L.ringGlow = 'rgba(56,189,248,0.9)'; L.spill = '56,189,248'; }
  else if (t >= T.cubrir0 && t < T.leccion0) { L.ringCols = ['#ffe08a', '#f0b90b', '#ff9a4d', '#f0b90b', '#ffe08a']; L.ringGlow = 'rgba(240,185,11,0.9)'; L.spill = '240,185,11'; }
  return L;
 }
 // saldo (contable) de la billetera caliente: baja con los retiros, se repone con reservas propias
 function balance(t) {
  const out = 0.82 * io(sm(T.retiros, T.autorizado + 0.8, t));
  const refill = 0.9 * 0.82 * io(sm(T.recursos - 0.4, T.repuesto + 0.4, t));
  return 1 - out + refill;
 }
 // contenido del die: libro de saldos (filas), puertos de red, llave de autorización
 function dieDraw(t, L) {
  return (x, P, yT, sc) => {
   const bal = balance(t), act = L.act;
   // filas del libro de saldos
   const r = H.rng(55);
   for (let i = 0; i < 7; i++) {
    const z = -0.42 + i * 0.14, wmax = r.range(0.45, 0.95);
    const w = wmax * H.clamp(bal * 1.05 - r.range(0, 0.15));
    const a = P(-0.5, yT, z), b = P(-0.5 + w, yT, z);
    const gold = t >= T.cubrir0 && t < T.leccion0 ? 1 : 0;
    x.strokeStyle = gold ? `rgba(240,185,11,${0.35 + 0.4 * act})` : `rgba(190,200,235,${0.12 + 0.25 * act})`;
    x.lineWidth = 4 * sc; x.lineCap = 'round';
    x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke();
   }
   // puertos conectados a internet (beat 04): nodos en el borde del die que laten
   const net = sm(T.sistemas - 0.3, T.internet + 0.3, t) * (1 - sm(T.movs, T.movs + 0.6, t));
   if (net > 0) for (let i = 0; i < 12; i++) {
    const an = i / 12 * PI * 2, p = P(Math.cos(an) * 0.56, yT, Math.sin(an) * 0.56);
    const pulse = 0.5 + 0.5 * Math.sin(t * 6 - i);
    x.fillStyle = `rgba(56,189,248,${net * (0.4 + 0.6 * pulse)})`; x.beginPath(); x.arc(p[0], p[1], 6 * sc, 0, 7); x.fill();
   }
  };
 }

 // ---------- utilidades de dibujo nuevas ----------
 // caja 3D (bloques de la cadena, capa de autorización, reservas): caras ordenadas por profundidad
 function box3(x, c, cx, y0, cz, w, h, d, o) {
  o = o || {};
  const X = [cx - w / 2, cx + w / 2], Y = [y0, y0 + h], Z = [cz - d / 2, cz + d / 2];
  const v = []; for (const xx of X) for (const yy of Y) for (const zz of Z) v.push(c.P(xx, yy, zz));
  const id = (i, j, k) => i * 4 + j * 2 + k;
  const faces = [
   { q: [id(0, 0, 0), id(0, 1, 0), id(0, 1, 1), id(0, 0, 1)], n: 'side' }, { q: [id(1, 0, 0), id(1, 0, 1), id(1, 1, 1), id(1, 1, 0)], n: 'side' },
   { q: [id(0, 0, 0), id(1, 0, 0), id(1, 1, 0), id(0, 1, 0)], n: 'back' }, { q: [id(0, 0, 1), id(0, 1, 1), id(1, 1, 1), id(1, 0, 1)], n: 'front' },
   { q: [id(0, 1, 0), id(1, 1, 0), id(1, 1, 1), id(0, 1, 1)], n: 'top' },
  ];
  faces.forEach((f) => { f.dep = f.q.reduce((s, i) => s + v[i][2], 0) / 4; });
  faces.sort((a, b) => a.dep - b.dep);
  const a = o.alpha == null ? 1 : o.alpha;
  for (const f of faces) {
   const pts = f.q.map((i) => v[i]);
   S.poly(x, pts);
   const base = f.n === 'top' ? (o.top || 'rgba(40,44,56,0.92)') : f.n === 'front' ? (o.front || 'rgba(22,24,32,0.95)') : (o.side || 'rgba(14,15,20,0.95)');
   x.save(); x.globalAlpha *= a; x.fillStyle = base; x.fill();
   x.strokeStyle = o.edge || 'rgba(235,238,255,0.35)'; x.lineWidth = o.lw || 1.2; x.stroke(); x.restore();
  }
  return { top: [v[id(0, 1, 0)], v[id(1, 1, 0)], v[id(1, 1, 1)], v[id(0, 1, 1)]], c: c.P(cx, y0 + h, cz) };
 }
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

 // ================= ESCENA OSCURA =================
 function darkScene(x, W, Hh, t, c, L) {
  S.stage(x, W, Hh, c, L, t);
  const yT = L.hover + THICK / 2;
  // ---- suelo: cadena de bloques detrás del objeto (beats 05-07)
  const chainA = fadeIO(t, T.pero10 - 0.2, T.fondos + 0.4, 0.6);
  if (chainA > 0) drawChain(x, c, t, chainA);
  // ---- suelo: grafo de direcciones (beats 06-09, rastro tenue hasta el cierre)
  if (t > T.retiros - 0.3) drawGraph(x, c, t);
  // ---- capa de autorización flotando sobre el objeto (beat 05)
  const authA = fadeIO(t, T.pero10 + 0.2, T.sorpr0 + 0.2, 0.5);
  L.dieDraw = dieDraw(t, L);
  S.chip(x, c, L, W, Hh);
  if (authA > 0) drawAuth(x, c, t, authA, yT);
  // ---- reservas propias de Binance (beat 10-11): bloque oro independiente que repone el saldo
  const resA = fadeIO(t, T.cubrir0 - 0.2, T.leccion0, 0.5);
  if (resA > 0) drawReserves(x, c, t, resA, yT);
  overlays(x, W, Hh, t, c, L, yT);
 }

 function drawChain(x, c, t, a) {
  x.save(); x.globalAlpha = a;
  // enlaces entre bloques
  for (let i = 0; i < BLOCKS.length - 1; i++) {
   const p = c.P(BLOCKS[i].x + 0.32, 0.18, BLOCKS[i].z), q = c.P(BLOCKS[i + 1].x - 0.32, 0.18, BLOCKS[i + 1].z);
   x.strokeStyle = 'rgba(200,210,240,0.35)'; x.lineWidth = 2; x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(q[0], q[1]); x.stroke();
  }
  const seal = sm(T.confirmada, T.confirmada + 0.5, t), stamp = t > T.confirmada ? Math.exp(-(t - T.confirmada) * 4) : 0;
  BLOCKS.forEach((b, i) => {
   const appear = sm(T.pero10 + i * 0.12, T.pero10 + 0.5 + i * 0.12, t);
   const isS = i === SEALB;
   const inco = isS ? sm(T.transf, T.transf + 0.6, t) : 1;
   const top = isS ? (seal > 0 ? `rgba(${Math.round(H.lerp(40, 56, seal))},${Math.round(H.lerp(44, 189, seal))},${Math.round(H.lerp(56, 248, seal))},${0.35 + 0.4 * seal})` : 'rgba(40,44,56,0.6)') : 'rgba(40,44,56,0.92)';
   const r = box3(x, c, b.x, 0.02, b.z, 0.62, 0.32 * appear * (isS ? H.lerp(0.4, 1, inco) : 1) + 0.001, 0.62, { alpha: appear, top, edge: isS && seal > 0 ? `rgba(160,225,255,${0.5 + 0.5 * stamp})` : 'rgba(235,238,255,0.3)', lw: isS ? 2 : 1.2 });
   if (isS && t > T.transf) {
    // transacción entrando al bloque
    const tp = sm(T.transf, T.confirmada, t);
    const from = c.P(0, 0.45, 0), to = r.c;
    if (tp < 1) glowDot(x, H.lerp(from[0], to[0], io(tp)), H.lerp(from[1], to[1], io(tp)) - Math.sin(tp * PI) * 80, 7, '56,189,248', 1);
    if (seal > 0) {
     // candado de sellado
     const cx = r.c[0], cy = r.c[1] - 50 - 30 * (1 - eo(seal));
     x.save(); x.globalAlpha *= seal; x.strokeStyle = '#a5e4ff'; x.lineWidth = 5; x.shadowColor = 'rgba(56,189,248,0.8)'; x.shadowBlur = 20 + 40 * stamp;
     x.beginPath(); x.roundRect(cx - 26, cy - 8, 52, 40, 8); x.stroke();
     x.beginPath(); x.arc(cx, cy - 8, 15, PI, 0); x.stroke(); x.restore();
    }
   }
  });
  x.restore();
 }

 function drawGraph(x, c, t) {
  const fadeEnd = 1 - 0.75 * sm(T.leccion0, T.leccion0 + 1, t) * (1 - sm(T.leccion, T.minutos2, t) * 0) ;
  const traceGlow = sm(T.rastro - 0.2, T.rastro + 0.5, t);
  const P0 = (n) => c.P(n.x, 0.02, n.z);
  x.save(); x.globalAlpha = fadeEnd * (1 - sm(sweep0, sweep1, t));
  for (const n of GRAPH.nodes) {
   const p = sm(n.t0, n.t1, t); if (p <= 0) continue;
   const A = n.parent.hop === 0 ? c.P(0, 0.02, 0) : P0(n.parent), Bp = P0(n);
   const red = n.hop === 1;
   const fr = n.freeze ? sm(n.freezeT, n.freezeT + 0.4, t) : 0;
   const base = red ? '255,69,58' : '56,189,248';
   const col = fr > 0 ? rgbOf(TEAL) : (traceGlow > 0 && !red ? '125,211,252' : base);
   const lw = (red ? 3 : 2) + traceGlow * 1.5;
   // trazo con ligera curva
   const mid = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2 - 18];
   const pts = S.bez(A, mid, mid, Bp, 18);
   x.save(); if (traceGlow > 0 && !red) { x.shadowColor = 'rgba(56,189,248,0.8)'; x.shadowBlur = 12 * traceGlow; }
   S.arrow(x, pts, p, `rgba(${col},${0.55 + 0.35 * traceGlow})`, lw, false); x.restore();
   // paquete viajando (cambio de saldo, no monedas físicas)
   if (p < 1) { const hp = pts[Math.min(pts.length - 1, Math.round(p * (pts.length - 1)))]; glowDot(x, hp[0], hp[1], 5, base, 1); }
   if (p > 0.9) {
    // nodo dirección con saldo acreditado (anillo que se llena)
    const fill = sm(n.t1 - 0.1, n.t1 + 0.4, t);
    const rad = n.hop === 1 ? 13 : 10;
    x.fillStyle = 'rgba(6,7,10,0.9)'; x.beginPath(); x.arc(Bp[0], Bp[1], rad + 3, 0, 7); x.fill();
    x.strokeStyle = `rgba(${col},0.95)`; x.lineWidth = 3; x.beginPath(); x.arc(Bp[0], Bp[1], rad, -PI / 2, -PI / 2 + fill * PI * 2); x.stroke();
    if (fr > 0) {
     // congelado: hexágono teal + escarcha
     x.save(); x.globalAlpha *= fr; x.strokeStyle = TEAL; x.lineWidth = 3; x.shadowColor = 'rgba(45,212,191,0.9)'; x.shadowBlur = 16;
     x.beginPath(); for (let k = 0; k <= 6; k++) { const an = k / 6 * PI * 2 + PI / 6, rr = rad + 9 + 6 * (1 - fr); k ? x.lineTo(Bp[0] + rr * Math.cos(an), Bp[1] + rr * Math.sin(an)) : x.moveTo(Bp[0] + rr * Math.cos(an), Bp[1] + rr * Math.sin(an)); }
     x.stroke(); x.restore();
    } else if (!red && t > T.carrera0) {
     // sigue moviéndose: latido cian
     const pu = 0.5 + 0.5 * Math.sin(t * 5 + n.x * 3);
     glowDot(x, Bp[0], Bp[1], 3 + 2 * pu, '56,189,248', 0.6);
    }
   }
  }
  x.restore();
 }

 function drawAuth(x, c, t, a, yT) {
  // capa 1: autorización (empresa) — placa de vidrio flotando sobre el objeto
  const y0 = yT + 0.55 + 0.03 * Math.sin(t * 1.5);
  const sig = sm(T.autoriz, T.autoriz + 0.6, t);
  const broken = sm(T.retiros, T.retiros + 0.5, t);
  const edge = broken > 0 ? `rgba(255,69,58,${0.5 + 0.4 * broken})` : `rgba(240,185,11,${0.35 + 0.5 * sig})`;
  const r = box3(x, c, 0, y0, 0, 1.3, 0.06, 1.3, { alpha: a * 0.9, top: 'rgba(30,32,42,0.55)', front: 'rgba(20,22,30,0.6)', side: 'rgba(16,18,24,0.6)', edge, lw: 2 });
  // llave / firma en la placa
  const k = r.c;
  x.save(); x.globalAlpha = a * (0.4 + 0.6 * sig);
  x.strokeStyle = broken > 0 ? RED : BGOLD; x.lineWidth = 5; x.shadowColor = broken > 0 ? 'rgba(255,69,58,0.8)' : 'rgba(240,185,11,0.8)'; x.shadowBlur = 18 * sig;
  x.beginPath(); x.arc(k[0] - 30, k[1], 18, 0, 7); x.stroke();
  x.beginPath(); x.moveTo(k[0] - 12, k[1]); x.lineTo(k[0] + 40, k[1]); x.moveTo(k[0] + 24, k[1]); x.lineTo(k[0] + 24, k[1] + 14); x.moveTo(k[0] + 36, k[1]); x.lineTo(k[0] + 36, k[1] + 10); x.stroke();
  x.restore();
  // flecha: autorización -> objeto -> cadena (capa 2)
  const ap = sm(T.seguras - 0.2, T.seguras + 0.5, t) * (1 - broken);
  if (ap > 0) {
   const from = c.P(0.6, y0, 0.2), mid = c.P(0.9, yT, 0), to = c.P(BLOCKS[SEALB].x, 0.4, BLOCKS[SEALB].z);
   x.save(); x.globalAlpha = a; S.arrow(x, S.bez(from, [from[0] + 120, from[1]], [to[0] + 60, to[1] - 140], to, 30), ap, 'rgba(240,185,11,0.85)', 3); x.restore();
   void mid;
  }
  // desvío: orden que sale hacia direcciones externas (rojo)
  if (broken > 0) {
   const from = c.P(-0.4, y0, 0), to = c.P(-1.4, 0.3, 0.8);
   x.save(); x.globalAlpha = a; S.arrow(x, S.bez(from, [from[0] - 80, from[1] - 30], [to[0] - 20, to[1] - 120], to, 30), sm(T.retiros, T.retiros + 0.6, t), 'rgba(255,69,58,0.9)', 3.5); x.restore();
  }
  return r;
 }

 function drawReserves(x, c, t, a, yT) {
  // reservas propias: bloque oro independiente a la derecha, NO conectado con las rutas del robo
  const rise = eo(sm(T.cubrir0, T.cubriria + 0.3, t));
  const rx = 2.25, rz = 0.4;
  const r = box3(x, c, rx, 0.02, rz, 0.95, 0.75 * rise + 0.01, 0.95, { alpha: a, top: 'rgba(240,185,11,0.30)', front: 'rgba(120,90,10,0.45)', side: 'rgba(80,60,8,0.45)', edge: `rgba(255,224,138,${0.6})`, lw: 2 });
  // flujo oro: reservas -> saldo de usuarios
  const fp = sm(T.recursos - 0.3, T.repuesto + 0.4, t);
  if (fp > 0) {
   const from = r.c, to = c.P(0.3, yT, 0.1);
   const pts = S.bez(from, [from[0], from[1] - 160], [to[0] + 140, to[1] - 180], to, 40);
   x.save(); x.globalAlpha = a; x.shadowColor = 'rgba(240,185,11,0.8)'; x.shadowBlur = 14;
   S.arrow(x, pts, Math.min(1, fp * 1.6), 'rgba(240,185,11,0.9)', 3.5); x.restore();
   for (let i = 0; i < 4; i++) { const u = ((t * 0.9 + i / 4) % 1); if (fp > 0.5) { const q = pts[Math.round(u * (pts.length - 1))]; glowDot(x, q[0], q[1], 5, '240,185,11', a * 0.9); } }
  }
  return r;
 }

 // ================= RÓTULOS Y DATOS =================
 function overlays(x, W, Hh, t, c, L, yT) {
  // ---- B01: fecha + nombre (sincronizados con la locución)
  {
   const a = 1 - sm(T.veinte - 0.5, T.veinte, t);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    S.words(x, [{ s: '29', t: T.date - 0.62, fill: 'grad' }, { s: 'OCT', t: T.date + 0.7, fill: 'grad' }, { s: '2026', t: wt(0, '2026,'), fill: 'grad' }], 540, 350, 800, 112, t, { align: 'center', stops: GOLD });
    S.words(x, [{ s: 'Algo', t: wt(0, 'algo') }, { s: 'increíble', t: wt(0, 'increíble') }, { s: 'ocurrió', t: wt(0, 'ocurrió') }], 540, 470, 800, 76, t, { align: 'center' });
    kicker(x, 'BINANCE · PLATAFORMA DE CRIPTOMONEDAS', 560, sm(T.binance, T.binance + 0.5, t), BGOLD);
    kicker(x, 'ROBO DE CRIPTOMONEDAS', 250, 1 - sm(T.binance - 0.4, T.binance, t), RED);
    x.restore();
    // callout al objeto: billetera de custodia (dato que engancha desde el inicio)
    const an = c.P(DIE[2][0], yT, DIE[2][1]);
    S.callout(x, [an, [an[0] + 30, an[1] - 170], [560, an[1] - 170]], sm(0.6, 1.6, t) * a, 'custodia digital', 'billetera de la plataforma', 'r', { px: 38 });
   }
  }
  // ---- B02: ≈20 min (TRM) + ≈US$6.300 M (Binance)
  {
   const a = sm(T.veinte - 0.3, T.veinte + 0.2, t) * (1 - sm(T.b4 - 0.1, T.b4 + 0.4, t));
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    // reloj: arco de 20 minutos (1/3 de vuelta)
    const cx = 540, cy = 330, R = 92, p = io(sm(T.veinte, T.minutos + 0.7, t));
    x.strokeStyle = 'rgba(255,255,255,0.14)'; x.lineWidth = 10; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
    x.strokeStyle = S.grad(x, cx - R, cx + R, GT); x.lineCap = 'round'; x.shadowColor = 'rgba(56,189,248,0.7)'; x.shadowBlur = 18;
    x.beginPath(); x.arc(cx, cy, R, -PI / 2, -PI / 2 + p * PI * 2 / 3); x.stroke(); x.shadowBlur = 0;
    S.label(x, '≈20 min', cx, cy + 22, 800, 64, INK, 'center', sm(T.veinte, T.veinte + 0.4, t));
    S.label(x, 'la mayor parte de los fondos · según TRM Labs', 540, 480, 400, 32, GREY, 'center', sm(T.minutos, T.minutos + 0.5, t));
    x.restore();
    // cifra monumental
    const np = eo(sm(T.seis, T.dolares + 0.2, t)), lk = t > T.dolares ? Math.exp(-(t - T.dolares) * 2.2) : 0;
    const na = sm(T.seis - 0.25, T.seis + 0.1, t);
    if (na > 0) {
     const val = Math.round(6300 * np), s = 'US$' + String(val).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' M';
     x.save(); x.globalAlpha = a * na; S.setF(x, 800, 132);
     const w = x.measureText(s).width + 132 * 0.62, X0 = 540 - w / 2, zoom = 1 + 0.04 * lk;
     x.translate(540, 700); x.scale(zoom, zoom); x.translate(-540, -700);
     const fill = S.grad(x, X0, X0 + w, GOLD);
     x.shadowColor = `rgba(240,185,11,${0.45 + 0.4 * lk})`; x.shadowBlur = 40 + 60 * lk;
     S.approx(x, X0, 700 - 132 * 0.36, 132 * 0.56, '#ffe08a');
     x.fillStyle = fill; x.textAlign = 'left'; x.fillText(s, X0 + 132 * 0.62, 700);
     x.shadowBlur = 0; x.fillText(s, X0 + 132 * 0.62, 700);
     x.restore();
     S.label(x, 'estimación de Binance · TRM Labs calcula ≈6.360 M', 540, 770, 400, 30, GREY, 'center', a * sm(T.dolares, T.dolares + 0.5, t));
     S.label(x, 'en 10 redes, al valor del momento', 540, 812, 400, 30, GREY, 'center', a * sm(T.dolares + 0.1, T.dolares + 0.6, t));
    }
   }
  }
  // ---- B03: no es una bóveda, no son billetes
  b03(x, t, c, yT);
  // ---- B04: billetera caliente
  {
   const a = fadeIO(t, T.todo, T.pero10 + 0.2, 0.5);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    kicker(x, 'TODO COMIENZA AQUÍ', 250, sm(T.todo, T.todo + 0.5, t));
    S.words(x, [{ s: 'Billetera', t: T.billeteras }, { s: 'caliente', t: T.calientes, fill: 'grad' }], 540, 350, 800, 100, t, { align: 'center', stops: GOLD });
    S.label(x, '(hot wallet)', 540, 410, 400, 36, GREY, 'center', sm(T.calientes, T.calientes + 0.5, t));
    x.restore();
    // red: líneas desde los puertos del die hacia "internet"
    const net = sm(T.internet - 0.6, T.internet + 0.6, t);
    if (net > 0) {
     const ctr = c.P(0, yT, 0);
     const r = H.rng(31);
     x.save(); x.globalAlpha = a;
     for (let i = 0; i < 12; i++) {
      const an = i / 12 * PI * 2, p = c.P(Math.cos(an) * 0.56, yT, Math.sin(an) * 0.56);
      const ex = 540 + Math.cos(an + 0.2) * r.range(430, 520), ey = 1000 + Math.sin(an + 0.2) * r.range(520, 640) * 0.9;
      const pts = S.bez(p, [p[0] + (p[0] - ctr[0]) * 1.5, p[1] + (p[1] - ctr[1]) * 1.5], [ex, ey], [ex, ey], 24);
      S.arrow(x, pts, sm(T.internet - 0.6 + i * 0.04, T.internet + 0.3 + i * 0.04, t), 'rgba(56,189,248,0.45)', 1.6, false);
      // tráfico rápido (beat "mover rápidamente")
      if (t > T.mover) { const u = ((t - T.mover) * 1.4 + i * 0.13) % 1; const q = pts[Math.round(u * (pts.length - 1))]; glowDot(x, q[0], q[1], 4, '56,189,248', 0.9 * (1 - sm(T.movs - 0.4, T.movs, t))); }
     }
     x.restore();
     S.label(x, 'conectada a internet', 540, 500, 600, 44, CYAN, 'center', a * sm(T.internet, T.internet + 0.5, t) * (1 - sm(T.mover - 0.2, T.mover + 0.2, t)));
     S.label(x, 'mueve fondos rápido', 540, 500, 600, 44, CYAN, 'center', a * sm(T.mover, T.mover + 0.4, t));
    }
   }
  }
  // ---- B05: dos capas distintas
  {
   const a = fadeIO(t, T.pero10 + 0.1, T.durante + 0.3, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    S.words(x, [{ s: 'Autorización', t: T.autoriz, fill: 'grad' }, { s: 'digital', t: T.autoriz + 0.35 }], 540, 330, 800, 92, t, { align: 'center', stops: GOLD });
    x.restore();
    const y0 = yT + 0.55;
    const p1 = c.P(-0.65, y0 + 0.06, 0.65), p2 = c.P(BLOCKS[0].x, 0.35, BLOCKS[0].z);
    S.callout(x, [p1, [p1[0] - 30, 560], [440, 560]], sm(T.movs - 0.2, T.movs + 0.6, t) * a, '1 · Orden firmada', 'capa de la empresa', 'l', { px: 38, ink: '240,185,11' });
    S.callout(x, [p2, [p2[0] + 20, 640], [640, 640]], sm(T.seguras - 0.3, T.seguras + 0.5, t) * a, '2 · Registro on-chain', 'capa de la red', 'r', { px: 38, ink: '125,211,252' });
   }
  }
  // ---- B06: retiros no autorizados (recreación conceptual)
  {
   const a = fadeIO(t, T.durante, T.sorpr0 + 0.2, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    S.words(x, [{ s: 'Retiros', t: T.retiros }, { s: 'no', t: T.noaut, fill: RED }, { s: 'autorizados', t: T.autorizado, fill: RED }], 540, 330, 800, 84, t, { align: 'center' });
    x.restore();
    chipTag(x, 'RECREACIÓN CONCEPTUAL', 540, 420, 26, '#a1a1a6', a * sm(T.durante, T.durante + 0.5, t));
    // la causa sigue en investigación
    const ia = sm(T.investiga, T.investiga + 0.5, t);
    if (ia > 0) {
     x.save(); x.globalAlpha = a * ia;
     const q = 0.5 + 0.5 * Math.sin(t * 4);
     S.label(x, '?', 540, 620, 800, 150, `rgba(255,69,58,${0.55 + 0.35 * q})`, 'center');
     S.label(x, 'Causa: en investigación', 540, 690, 600, 42, INK, 'center');
     S.label(x, 'Binance, 30-31 oct 2026', 540, 736, 400, 30, GREY, 'center');
     x.restore();
    }
   }
  }
  // ---- B07: confirmación irreversible
  {
   const a = fadeIO(t, T.sorpr0, T.fondos + 0.2, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    kicker(x, 'LO MÁS SORPRENDENTE', 260, sm(T.sorpr0, T.sorpr0 + 0.6, t), INK);
    S.words(x, [{ s: 'Confirmada', t: T.confirmada, fill: 'grad' }], 540, 360, 800, 96, t, { align: 'center', stops: GT });
    S.label(x, 'en una cadena de bloques', 540, 420, 400, 38, GREY, 'center', sm(T.bloques - 0.1, T.bloques + 0.4, t));
    x.restore();
    // botón deshacer, tachado
    const ba = sm(T.normalmente, T.normalmente + 0.5, t);
    if (ba > 0) {
     const cx = 540, cy = 590, w = 400, h = 104;
     x.save(); x.globalAlpha = a * ba;
     x.beginPath(); x.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2); x.fillStyle = 'rgba(29,32,40,0.9)'; x.fill(); x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 2; x.stroke();
     // flecha circular de deshacer (dibujada)
     x.strokeStyle = INK; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.arc(cx - 110, cy, 22, PI * 1.15, PI * 2.75); x.stroke();
     const ae = PI * 1.15, hx = cx - 110 + 22 * Math.cos(ae), hy = cy + 22 * Math.sin(ae);
     x.beginPath(); x.moveTo(hx - 12, hy - 2); x.lineTo(hx, hy); x.lineTo(hx + 2, hy - 13); x.stroke();
     S.label(x, 'Deshacer', cx + 30, cy + 15, 600, 44, INK, 'center');
     const st = sm(T.boton, T.deshacer + 0.25, t);
     if (st > 0) { x.strokeStyle = RED; x.lineWidth = 8; x.shadowColor = 'rgba(255,69,58,0.6)'; x.shadowBlur = 14; x.beginPath(); x.moveTo(cx - w / 2 - 10, cy + 6); x.lineTo(cx - w / 2 - 10 + (w + 20) * io(st), cy - 6); x.stroke(); x.shadowBlur = 0; }
     x.restore();
     S.label(x, '*normalmente: no existe una reversión automática', 540, 690, 400, 30, GREY, 'center', a * sm(T.deshacer, T.deshacer + 0.5, t));
    }
   }
  }
  // ---- B08: dispersión y rastro
  {
   const a = fadeIO(t, T.fondos, T.carrera0 + 0.2, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    S.words(x, [{ s: 'Fondos', t: T.fondos + 0.1 }, { s: 'dispersos', t: T.distrib, fill: 'grad' }], 540, 300, 800, 88, t, { align: 'center', stops: GT });
    S.label(x, 'hacia direcciones de los atacantes · varias redes', 540, 360, 400, 32, GREY, 'center', sm(T.direcc, T.direcc + 0.5, t) * (1 - sm(T.cada - 0.2, T.cada + 0.2, t)));
    S.label(x, 'cada movimiento deja un rastro público', 540, 360, 600, 36, CYAN, 'center', sm(T.rastro - 0.2, T.rastro + 0.4, t) * (1 - sm(T.seguir - 0.3, T.seguir, t)));
    // VER ≠ REVERTIR
    const va = sm(T.nosig - 0.1, T.nosig + 0.4, t);
    if (va > 0) {
     x.globalAlpha = a * va; S.setF(x, 800, 60);
     const s1 = 'Seguir', s2 = 'recuperar', w1 = x.measureText(s1).width, w2 = x.measureText(s2).width, gw = 64, tot = w1 + w2 + gw + 40, X0 = 540 - tot / 2;
     x.fillStyle = CYAN; x.textAlign = 'left'; x.fillText(s1, X0, 380);
     S.neq(x, X0 + w1 + 20, 380 - 22, 40, RED);
     x.fillStyle = INK; x.fillText(s2, X0 + w1 + gw + 20, 380);
    }
    x.restore();
    // saldo de la billetera: baja; receptores suben (contabilidad, no monedas creadas)
   }
  }
  // ---- B09: carrera + congelados
  {
   const a = fadeIO(t, T.carrera0, T.cubrir0 + 0.1, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    S.words(x, [{ s: 'Carrera', t: T.carrera }, { s: 'contra', t: T.carrera + 0.5 }, { s: 'el', t: T.carrera + 0.8 }, { s: 'tiempo', t: T.tiempo, fill: 'grad' }], 540, 300, 800, 80, t, { align: 'center', stops: GT });
    // cronómetro
    const cx = 540, cy = 430, R = 44, sp = (t - T.carrera0) * 0.9;
    x.strokeStyle = 'rgba(255,255,255,0.18)'; x.lineWidth = 6; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
    x.strokeStyle = CYAN; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + R * 0.8 * Math.sin(sp * PI * 2), cy - R * 0.8 * Math.cos(sp * PI * 2)); x.stroke();
    x.restore();
    const fa = sm(T.congelar - 0.1, T.congelar + 0.6, t);
    if (fa > 0) {
     x.save(); x.globalAlpha = a * fa; S.setF(x, 800, 110);
     const s = 'US$3.000 M', w = x.measureText(s).width + 110 * 0.62, X0 = 540 - w / 2;
     x.shadowColor = 'rgba(45,212,191,0.6)'; x.shadowBlur = 40;
     S.approx(x, X0, 600 - 110 * 0.36, 110 * 0.56, '#7cf0b8');
     x.fillStyle = S.grad(x, X0, X0 + w, GG); x.textAlign = 'left'; x.fillText(s, X0 + 110 * 0.62, 600); x.shadowBlur = 0; x.fillText(s, X0 + 110 * 0.62, 600);
     S.label(x, 'congelados on-chain', 540, 662, 600, 44, TEAL, 'center');
     S.label(x, 'solo algunos activos · Binance, 30 oct', 540, 708, 400, 30, GREY, 'center');
     x.restore();
    }
    // leyenda
    chipTag(x, 'CONGELADO', 380, 790, 28, TEAL, a * sm(T.congelar, T.congelar + 0.4, t));
    chipTag(x, 'SIGUE MOVIÉNDOSE', 700, 790, 28, CYAN, a * sm(T.congelar + 0.2, T.congelar + 0.6, t));
   }
  }
  // ---- B10/B11: cobertura con fondos propios; 90 % repuesto ≠ recuperado
  {
   const a = fadeIO(t, T.cubrir0, T.leccion0 + 0.2, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a * (1 - sm(T.oct31 - 0.3, T.oct31, t));
    S.words(x, [{ s: 'Cubre', t: T.cubriria }, { s: 'las', t: T.cubriria + 0.3 }, { s: 'pérdidas', t: wt(20, 'pérdidas') }], 540, 330, 800, 88, t, { align: 'center' });
    S.label(x, 'con recursos propios', 540, 400, 600, 44, BGOLD, 'center', sm(T.recursos, T.recursos + 0.4, t));
    x.restore();
    const rr = c.P(2.25, 0.8, 0.4);
    S.callout(x, [rr, [rr[0] - 30, rr[1] - 150], [Math.min(rr[0] - 70, 720), rr[1] - 150]], sm(T.cubriria, T.cubriria + 0.8, t) * a * (1 - sm(T.oct31 - 0.3, T.oct31, t)), 'reservas de Binance', 'SAFU + tesorería', 'l', { px: 36, ink: '240,185,11' });
    // 90 %
    const n9 = sm(T.oct31, T.oct31 + 0.4, t);
    if (n9 > 0) {
     x.save(); x.globalAlpha = a * n9;
     kicker(x, '31 OCT 2026', 250, 1, BGOLD);
     const p = eo(sm(T.noventa - 0.4, T.noventa + 0.5, t)), val = Math.round(90 * p), lk = t > T.noventa + 0.5 ? Math.exp(-(t - T.noventa - 0.5) * 2.2) : 0;
     const at = t > T.atencion ? Math.exp(-(t - T.atencion) * 3) : 0;
     const s = val + ' %';
     x.save(); x.translate(540, 470); const z = 1 + 0.05 * lk; x.scale(z, z); S.setF(x, 800, 190);
     const w = x.measureText(s).width; x.fillStyle = S.grad(x, -w / 2, w / 2, GOLD); x.textAlign = 'center';
     x.shadowColor = `rgba(240,185,11,${0.5 + 0.4 * lk})`; x.shadowBlur = 50 + 60 * lk; x.fillText(s, 0, 0); x.shadowBlur = 0; x.fillText(s, 0, 0); x.restore();
     S.label(x, 'REPUESTO', 540, 550, 800, 56, INK, 'center', sm(T.repuesto, T.repuesto + 0.4, t));
     S.label(x, 'de los activos afectados, con fondos propios', 540, 600, 400, 32, GREY, 'center', sm(T.afectados - 0.2, T.afectados + 0.3, t));
     // atención: pulso rojo
     if (at > 0.01) { x.globalAlpha = a * at * 0.5; const g = x.createRadialGradient(540, 470, 0, 540, 470, 520); g.addColorStop(0, 'rgba(255,69,58,0.5)'); g.addColorStop(1, 'rgba(255,69,58,0)'); x.fillStyle = g; x.fillRect(0, 0, W, 1100); x.globalAlpha = a * n9; }
     // ≠ RECUPERADO
     const ra = sm(T.recuperado - 0.1, T.recuperado + 0.4, t);
     if (ra > 0) {
      x.globalAlpha = a * ra;
      S.setF(x, 800, 64); const s2 = 'recuperado', w2 = x.measureText(s2).width, X0 = 540 - (w2 + 80) / 2;
      S.neq(x, X0, 690 - 23, 52, RED); x.fillStyle = RED; x.textAlign = 'left'; x.fillText(s2, X0 + 80, 690);
      S.label(x, 'del atacante', 540, 738, 400, 34, GREY, 'center');
      // comparación sin mezclar unidades
      chipTag(x, '90 % REPUESTO', 330, 820, 28, BGOLD, sm(T.noventa2, T.noventa2 + 0.4, t));
      chipTag(x, '≈3.000 M CONGELADOS', 750, 820, 28, TEAL, sm(T.noventa2 + 0.2, T.noventa2 + 0.6, t));
     }
     x.restore();
    }
   }
  }
  // ---- B12: lección
  {
   const a = fadeIO(t, T.leccion0, sweep0 + 0.2, 0.4);
   if (a > 0) {
    x.save(); x.globalAlpha = a;
    kicker(x, 'UNA LECCIÓN INQUIETANTE', 260, sm(T.leccion0 + 0.3, T.leccion + 0.3, t), GREY);
    S.words(x, [{ s: 'Una', t: wt(25, 'una') }, { s: 'autorización', t: T.autoriz2, fill: 'grad' }], 540, 370, 800, 84, t, { align: 'center', stops: GOLD });
    S.words(x, [{ s: 'comprometida', t: wt(25, 'comprometida'), fill: RED }], 540, 460, 800, 84, t, { align: 'center' });
    S.words(x, [{ s: 'miles', t: T.miles }, { s: 'de', t: T.miles + 0.3 }, { s: 'millones', t: wt(25, 'millones') }], 540, 580, 800, 70, t, { align: 'center' });
    S.words(x, [{ s: 'en', t: wt(25, 'cuestión') }, { s: 'minutos', t: T.minutos2, fill: 'grad' }], 540, 660, 800, 70, t, { align: 'center', stops: GT });
    x.restore();
    // el acceso seguro se cierra: candado sobre el die
    const lockA = sm(T.minutos2, T.minutos2 + 0.6, t);
    if (lockA > 0) {
     const p = c.P(0, yT + 0.25, 0);
     x.save(); x.globalAlpha = a * lockA; x.strokeStyle = INK; x.lineWidth = 6; x.shadowColor = 'rgba(255,255,255,0.6)'; x.shadowBlur = 16;
     const drop = 30 * (1 - eo(lockA));
     x.beginPath(); x.roundRect(p[0] - 34, p[1] - 10, 68, 54, 10); x.stroke();
     x.beginPath(); x.arc(p[0], p[1] - 10 - drop, 20, PI, 0); x.stroke(); x.restore();
    }
   }
  }
 }

 // ---- B03: bóveda y billetes (descartes), "¿Cómo?", desmaterialización hacia el die
 function b03(x, t, c, yT) {
  const a = fadeIO(t, T.b4 - 0.1, T.todo + 0.3, 0.3);
  if (a <= 0) return;
  const die = c.P(0, yT, 0);
  const dis = sm(T.entonces, T.como + 0.6, t);
  const r = H.rng(303);
  // bóveda (círculo con pernos) — izquierda
  const vA = sm(T.b4, T.b4 + 0.4, t), vx = 300, vy = 560, R = 150;
  const pts = [];
  for (let i = 0; i < 90; i++) { const an = i / 90 * PI * 2; pts.push([vx + R * Math.cos(an), vy + R * Math.sin(an)]); }
  for (let i = 0; i < 40; i++) { const an = i / 40 * PI * 2; pts.push([vx + R * 0.62 * Math.cos(an), vy + R * 0.62 * Math.sin(an)]); }
  for (let k = 0; k < 6; k++) { const an = k / 6 * PI * 2; for (let i = 0; i < 8; i++) pts.push([vx + (i / 8) * R * 0.6 * Math.cos(an), vy + (i / 8) * R * 0.6 * Math.sin(an)]); }
  // billetes (rectángulos apilados) — derecha
  const bA = sm(T.b5, T.b5 + 0.4, t), bx = 780, by = 560;
  const pts2 = [];
  for (let k = 0; k < 4; k++) { const oy = by + 50 - k * 26; for (let i = 0; i < 30; i++) { const u = i / 30; pts2.push([bx - 130 + u * 260, oy - 55]); pts2.push([bx - 130 + u * 260, oy + 55]); } for (let i = 0; i < 10; i++) { const u = i / 10; pts2.push([bx - 130, oy - 55 + u * 110]); pts2.push([bx + 130, oy - 55 + u * 110]); } }
  const drawPts = (list, A0, col, seed) => {
   const rr = H.rng(seed);
   x.save();
   for (const p of list) {
    const j = rr(), d = H.clamp((dis - j * 0.45) / 0.55);
    if (d >= 1) continue;
    const dd = io(d), sx = p[0] + rr.range(-60, 60) * Math.sin(d * PI), sy = p[1] + rr.range(-60, 60) * Math.sin(d * PI);
    const X = H.lerp(sx, die[0], dd), Y = H.lerp(sy, die[1], dd);
    x.globalAlpha = a * A0 * (d > 0 ? (1 - dd) * 0.9 + 0.1 : 0.85);
    x.fillStyle = d > 0 ? 'rgba(240,185,11,1)' : col; x.beginPath(); x.arc(X, Y, d > 0 ? 3 : 2.4, 0, 7); x.fill();
   }
   x.restore();
  };
  // contornos sólidos antes de desmaterializar
  if (dis <= 0) {
   x.save(); x.globalAlpha = a * vA; x.strokeStyle = 'rgba(245,245,247,0.8)'; x.lineWidth = 3;
   x.beginPath(); x.arc(vx, vy, R, 0, 7); x.stroke(); x.beginPath(); x.arc(vx, vy, R * 0.62, 0, 7); x.stroke();
   for (let k = 0; k < 6; k++) { const an = k / 6 * PI * 2 + t * 0.3; x.beginPath(); x.moveTo(vx, vy); x.lineTo(vx + R * 0.6 * Math.cos(an), vy + R * 0.6 * Math.sin(an)); x.stroke(); }
   for (let k = 0; k < 12; k++) { const an = k / 12 * PI * 2; x.beginPath(); x.arc(vx + R * 0.84 * Math.cos(an), vy + R * 0.84 * Math.sin(an), 6, 0, 7); x.stroke(); }
   x.restore();
   if (bA > 0) {
    x.save(); x.globalAlpha = a * bA; x.strokeStyle = 'rgba(245,245,247,0.8)'; x.lineWidth = 3;
    for (let k = 0; k < 4; k++) { const oy = by + 50 - k * 26 + (1 - eo(bA)) * 40; x.fillStyle = 'rgba(10,11,14,0.9)'; x.beginPath(); x.roundRect(bx - 130, oy - 55, 260, 110, 8); x.fill(); x.stroke(); x.beginPath(); x.arc(bx, oy, 26, 0, 7); x.stroke(); }
    x.restore();
   }
   S.label(x, 'bóveda', vx, vy + R + 56, 600, 38, GREY, 'center', a * vA);
   if (bA > 0) S.label(x, 'billetes', bx, by + 150, 600, 38, GREY, 'center', a * bA);
  } else {
   drawPts(pts, vA, 'rgba(245,245,247,0.8)', 1);
   drawPts(pts2, bA, 'rgba(245,245,247,0.8)', 2);
  }
  // tachones rojos sincronizados
  const st1 = sm(T.boveda, T.boveda + 0.35, t) * (1 - dis), st2 = sm(T.billetes, T.billetes + 0.35, t) * (1 - dis);
  x.save(); x.strokeStyle = RED; x.lineWidth = 9; x.lineCap = 'round'; x.shadowColor = 'rgba(255,69,58,0.6)'; x.shadowBlur = 14;
  if (st1 > 0) { x.globalAlpha = a; x.beginPath(); x.moveTo(vx - R - 20, vy + R * 0.7); x.lineTo(vx - R - 20 + (2 * R + 40) * io(st1), vy + R * 0.7 - (1.4 * R) * io(st1)); x.stroke(); }
  if (st2 > 0) { x.globalAlpha = a; x.beginPath(); x.moveTo(bx - 150, by + 110); x.lineTo(bx - 150 + 300 * io(st2), by + 110 - 200 * io(st2)); x.stroke(); }
  x.restore();
  // ¿Cómo?
  const qa = sm(T.como - 0.05, T.como + 0.35, t) * (1 - sm(T.todo - 0.3, T.todo, t));
  if (qa > 0) S.words(x, [{ s: '¿Cómo?', t: T.como, fill: 'grad' }], 540, 360, 800, 150, t, { align: 'center', stops: GOLD });
  void r;
 }

 // ================= ESCENA BLANCA (cierre, barrido de luz propio del estilo) =================
 function whiteScene(x, W, Hh, t, c, L) {
  const Lw = Object.assign({}, L, { white: 1, key: 1, rim: 1, ring: 0, dieDraw: null });
  S.stage(x, W, Hh, c, Lw, t);
  // rastro que permanece: traza cian fina en el suelo
  x.save(); x.globalAlpha = 0.5; x.strokeStyle = 'rgba(14,165,233,0.7)'; x.lineWidth = 2.5;
  for (const n of GRAPH.nodes) if (n.hop === 1) { const a = c.P(0, 0.01, 0), b = c.P(n.x, 0.01, n.z); x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
  x.restore();
  S.chip(x, c, Lw, W, Hh);
  S.words(x, [{ s: 'La', t: wt(27, 'la'), fill: '#1d1d1f' }, { s: 'ciencia', t: wt(27, 'ciencia'), fill: '#1d1d1f' }, { s: 'oculta', t: wt(27, 'oculta'), fill: '#1d1d1f' }], 540, 400, 800, 92, t, { align: 'center' });
  S.words(x, [{ s: 'de', t: wt(27, 'de'), fill: '#1d1d1f' }, { s: 'lo', t: wt(27, 'lo'), fill: '#1d1d1f' }, { s: 'imposible.', t: wt(27, 'imposible'), fill: 'grad' }], 540, 510, 800, 92, t, { align: 'center', stops: ['#c99400', '#f0b90b', '#ff7a2f'] });
 }

 // ================= SUBTÍTULOS + MARCA =================
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

 window.BINANCE = { explainer, T, B, KEYS, DURATION, wt, sweep0, sweep1, GRAPH, balance };
})();
