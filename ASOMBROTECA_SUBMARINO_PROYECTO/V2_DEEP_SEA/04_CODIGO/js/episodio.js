// =====================================================================================================
// episodio.js — «El submarino que no volvió» · V2 en estilo Bioluminescent Deep Sea · 1080x1920
// Misma historia, voz y tiempos que la V1 (Engineering Blueprint); cambia el medio: la zona de medianoche, sólo luz viva.
// Reloj = segundos de la voz original. Determinista: todo azar viene de H.rng / H.makeNoise; nunca Math.random.
// =====================================================================================================
(function () {
 const X = window.ABISAL, A = window.ALIGN;
 const { TAU, cl, sm, E, lerp, WH, C, F, hash, dot, water, snow, sparkles, jelly, siph, comb, angler, textPts, swarm, gather, gtext, tw, gstroke, ring, current, hud, flick, comp, subSil, subGlow, subGeom, poly, rrect, farLayer } = X;
 const W = 1080, HH = 1920, DURATION = +(A.duration + 1.0).toFixed(3);
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  cientos: wt(0, 'cientos'), oceano: wt(0, 'océano'), repente: SG(1).s, falla1: wt(1, 'falla'), comienza: SG(2).s, hundirse: wt(2, 'hundirse'),
  trip: SG(3).s, regresar: wt(3, 'regresar'), superficie: wt(3, 'superficie'), noresp: wt(3, 'no'),
  entender: SG(4).s, tanques4: wt(4, 'tanques'), sumergirse: wt(5, 'sumergirse'), permite: wt(5, 'permite'), agua5: wt(5, 'agua'), aumentando: wt(5, 'aumentando'), peso: wt(5, 'peso'),
  subir: wt(6, 'subir'), aire6: wt(6, 'aire'), comprimido: wt(6, 'comprimido'), expulsar6: wt(6, 'expulsar'),
  pero7: SG(7).s, emergencia7: wt(7, 'emergencia'), falla7: wt(7, 'falla'),
  en1963: SG(8).s, y1963: wt(8, '1963'), nuclear: wt(8, 'nuclear'), uss: wt(8, 'uss'), thresher: wt(8, 'thresher'), hundio: wt(8, 'hundió'), pruebas: wt(8, 'pruebas'), atlantico: wt(8, 'atlántico'),
  invest: SG(9).s, posible: wt(9, 'posible'), cadena: wt(9, 'cadena'), propulsion: wt(9, 'propulsión'), dificult: wt(9, 'dificultades'), expulsar9: wt(9, 'expulsar'), lastre9: wt(9, 'lastre'),
  medida: SG(10).s, presion: wt(10, 'presión'), aumentaba: wt(10, 'aumentaba'), hasta: SG(11).s, casco: wt(11, 'casco'), soportarla: wt(11, 'soportarla'),
  las12: SG(12).s, n129: wt(12, '129'), personas: wt(12, 'personas'), vida: wt(12, 'vida'),
  oceano13: SG(13).s, grieta: wt(13, 'grieta'), amenaza: wt(13, 'amenaza'),
  aveces: SG(14).s, sistema14: wt(14, 'sistema'), nofunc: wt(14, 'no'), necesita: wt(14, 'necesita'),
  asombro: SG(15).s, tag: SG(16).s, end: A.speech_end,
 };
 // escenas y transiciones (todas ancladas a la voz)
 const TR = {
  push: [T.entender - 0.1, T.tanques4 - 0.2],          // continuo: la cámara entra en el casco y la silueta se vuelve sección luminosa
  dark: [T.pero7 + 3.0, T.en1963 + 0.15],               // las luces del corte se apagan (¿y si falla?)
  fish: [T.en1963 - 0.15, T.en1963 + 0.75],             // el señuelo del rape abisal ilumina agua nueva: 1963
  reveal: [T.en1963 + 0.1, T.y1963 + 0.6],
  sink1: [T.invest - 0.2, T.posible - 0.1],             // continuo: descenso a lo largo de la cadena (sifonóforo)
  sink2: [T.medida - 0.5, T.medida + 0.4],              // continuo: más hondo, la presión
  out: [T.soportarla + 0.5, T.las12 + 0.1],             // la luz se apaga
  bloom: [T.oceano13 - 0.25, T.oceano13 + 0.45],        // floración de plancton barre la escena: la lección
  close: [T.asombro - 0.35, T.asombro + 0.2],
 };
 const LBL = H.mix(C.ice, C.cyan, 0.45);
 // cámara: profundidad acumulada (sólo para la nieve marina, los rayos y el HUD)
 const camYOf = (t) => 7 * t + 650 * E.inOut(sm(0.15, 3.6, t)) + 420 * sm(T.comienza, T.noresp + 0.8, t) + 300 * E.inOut(sm(TR.push[0], TR.push[1], t))
  + 900 * E.inOut(sm(TR.sink1[0], TR.sink1[1], t)) + 700 * E.inOut(sm(TR.sink2[0], TR.sink2[1], t)) + 900 * sm(T.medida, T.soportarla, t);
 const land = (t, t0, d) => { const p = sm(t0, t0 + (d || 0.3), t); return { a: p, dy: (1 - E.out(p)) * -16 }; };

 // ---------- escena 1: la zona de medianoche (0 – 13 s) ----------
 const SUB1 = (t) => ({ x: 540 + Math.sin(t * 0.4) * 6, y: 880 + 300 * E.inOut(sm(T.comienza, T.noresp + 0.8, t)) + Math.sin(t * 0.7) * 5, L: 900, rot: 0.11 * sm(T.comienza, T.hundirse + 0.9, t) });
 function scene1Back(ctx, t) {
  // un ctenóforo y una medusa lejana acompañan el descenso (como el gancho de la referencia)
  comb(ctx, 880, 430 - 40 * sm(0, 6, t) + Math.sin(t) * 8, 70, t, sm(0.2, 0.9, t) * (1 - sm(T.hundirse, T.hundirse + 1.2, t)), -0.4);
  jelly(ctx, { x: 190, y: 1260 - 120 * sm(0, 8, t), s: 52, t: t + 2, ph: 0.6, on: 0.5 * sm(0.3, 1.2, t) * (1 - sm(TR.push[0], TR.push[1], t)), col: C.blue, tent: 8, tl: 120, tilt: 0.25 });
 }
 function scene1(ctx, t) {
  const S = SUB1(t), push = sm(TR.push[0], TR.push[1], t);
  if (push >= 1) return;
  const fail = sm(T.falla1 - 0.05, T.falla1 + 0.25, t);
  // luz viva que lo ilumina: un enjambre de plancton bajo el casco
  const lt = { x: S.x - 220, y: S.y + 260, r: 900, k: 0.75 + 0.25 * Math.sin(t * 1.3), col: H.mix(C.cyan, C.red, fail * 0.45) };
  sparkles(ctx, S.x - 120, S.y + 230, 380, 120, t, 41, 60, 0.75, C.cyan, 2.4);
  const nav = flick(t, 0.4, 1.0, 2) * (1 - fail);
  subSil(ctx, S.x, S.y, S.L * (1 + push * 0.12), S.rot, lt, 1 - push, t, { nav, warn: fail });
  // gancho: «cientos de metros» se forma con plancton y sube a la esquina
  const g = sm(T.cientos - 0.3, T.cientos + 0.6, t), crisp = sm(T.cientos + 0.4, T.cientos + 0.8, t), up = E.inOut(sm(T.repente - 0.2, T.repente + 0.4, t));
  const f1 = F.titleI(84);
  if (t < T.repente + 0.5) gather(ctx, textPts('cientos de metros', f1, 3, 84), 540, 470, g, t, C.cyan, 1 - crisp * 0.85);
  gtext(ctx, 'cientos de metros', lerp(540, 300, up), lerp(470, 140, up), F.titleI(lerp(84, 46, up)), H.mix(C.cyan, C.ice, up * 0.5), crisp * (1 - sm(T.trip - 0.2, T.trip + 0.3, t)), 'center', lerp(18, 12, up));
  // algo falla: luz de alarma, anillo rojo y la palabra
  const fa = sm(T.falla1 - 0.05, T.falla1 + 0.2, t) * (1 - sm(T.trip - 0.1, T.trip + 0.4, t));
  const shake = t > T.falla1 && t < T.falla1 + 0.35 ? Math.sin(t * 70) * 7 * (1 - (t - T.falla1) / 0.35) : 0;
  gtext(ctx, 'FALLA', 540 + shake, 560, F.num(150), C.red, fa, 'center', 22);
  const er = (t - T.falla1) / 0.7;
  if (er > 0 && er < 1) { const G = subGeom(S.x, S.y, S.L, 0.13, S.rot); ring(ctx, G.sailTop[0], G.sailTop[1], 60 + er * 200, C.red, (1 - er) * 0.9, 3); }
  // se hunde: corriente de plancton hacia abajo
  const hd = E.inOut(sm(T.hundirse - 0.2, T.hundirse + 0.5, t)) , ha = 1 - sm(T.trip + 0.4, T.trip + 1.0, t);
  current(ctx, [[S.x + 260, S.y + 120], [S.x + 280, S.y + 220], [S.x + 290, S.y + 320], [S.x + 300, S.y + 420]], hd, t, C.amber, 0.9 * ha);
  const hl = land(t, T.hundirse + 0.1);
  gtext(ctx, 'se hunde', S.x + 300, S.y + 470 + hl.dy, F.label(44), C.amber, hl.a * ha, 'center', 12);
  // intento de volver a la superficie: corriente hacia los últimos rayos de luz… que se rompe
  const up2 = E.inOut(sm(T.regresar - 0.1, T.superficie + 0.4, t)), dead = sm(T.noresp, T.noresp + 0.5, t), ua = (1 - 0.7 * dead) * (1 - push);
  const G = subGeom(S.x, S.y, S.L, 0.13, S.rot);
  current(ctx, [[G.sailTop[0], G.sailTop[1] - 30], [G.sailTop[0] - 40, G.sailTop[1] - 250], [G.sailTop[0] + 20, 420], [G.sailTop[0] + 60, 250]], up2, t, C.cyan, ua);
  const sl = land(t, T.superficie);
  gtext(ctx, 'superficie ↑', G.sailTop[0] + 70, 210 + sl.dy, F.label(44), LBL, sl.a * (1 - push), 'center', 12);
  // ✗ roja sobre el rumbo
  const cx = G.sailTop[0] - 20, cy = 520, xm = sm(T.noresp, T.noresp + 0.18, t), xm2 = sm(T.noresp + 0.12, T.noresp + 0.3, t), xa = 1 - push;
  gstroke(ctx, () => { ctx.beginPath(); ctx.moveTo(cx - 50, cy - 50); ctx.lineTo(cx - 50 + 100 * xm, cy - 50 + 100 * xm); }, C.red, xm * xa, 7);
  gstroke(ctx, () => { ctx.beginPath(); ctx.moveTo(cx + 50, cy - 50); ctx.lineTo(cx + 50 - 100 * xm2, cy - 50 + 100 * xm2); }, C.red, xm2 * xa, 7);
  const nr = land(t, T.noresp + 0.2);
  gtext(ctx, 'NO RESPONDE', 540, 720 + nr.dy, F.label(64), C.red, nr.a * xa, 'center', 16);
 }

 // ---------- escena 2: los tanques de lastre, en luz (13 – 31 s) ----------
 const CX = 540, CY = 800, L2 = 1000, HR2 = 0.34;
 const TANKS = [[CX - 452, CY - 112, 190, 224], [CX + 282, CY - 100, 160, 200]];
 function waterLevel(t) {
  const fill = E.inOut(sm(T.permite, T.aumentando + 0.4, t)), blow = E.inOut(sm(T.aire6 + 0.1, T.expulsar6 + 0.9, t));
  return fill * (1 - 0.88 * blow);
 }
 function scene2(x, t) {
  const push = E.inOut(sm(TR.push[0], TR.push[1], t)), S = SUB1(t);
  const sx = lerp(S.x, CX, push), sy = lerp(S.y, CY, push), L = lerp(S.L, L2, push), hr = lerp(0.13, HR2, push), rot = lerp(S.rot, 0, push);
  const dy = (y) => y; // escena estática tras la entrada
  const rise = (t > T.peso - 0.5 ? -60 * E.inOut(sm(T.aire6, T.expulsar6 + 1, t)) + 40 * E.inOut(sm(T.aumentando - 0.2, T.peso + 0.4, t)) : 40 * E.inOut(sm(T.aumentando - 0.2, T.peso + 0.4, t)));
  const oy = push >= 1 ? rise : 0;
  x.save(); x.translate(0, oy);
  const dead = sm(T.falla7 - 0.1, T.falla7 + 0.5, t) * 0.0; // el corte sigue visible hasta el apagón
  const G = subGlow(x, sx, sy, L, hr, rot, C.cyan, 0.9 * push, 3.2);
  if (push < 1) { x.restore(); return; }
  // casco resistente (interior)
  const px0 = CX - 240, px1 = CX + 250, ph = L2 * HR2 * 0.72;
  const ia = sm(T.tanques4 - 0.6, T.tanques4 - 0.1, t);
  gstroke(x, () => rrect(x, px0, CY - ph / 2, px1 - px0, ph, 60), C.blue, 0.85 * ia, 2.6);
  gtext(x, 'CASCO RESISTENTE', CX, CY - ph / 2 + 50, F.label(32), C.blue, ia, 'center', 8);
  // tanques de lastre (fuera del casco resistente)
  TANKS.forEach(([tx, ty, w, h], i) => { const a = sm(T.tanques4 + i * 0.15, T.tanques4 + 0.3 + i * 0.15, t); gstroke(x, () => rrect(x, tx, ty, w, h, 26), C.teal, a, 3.4); });
  const tl = land(t, T.tanques4, 0.35);
  gtext(x, 'TANQUES DE LASTRE', CX, CY - 380 + tl.dy, F.label(56), C.teal, tl.a, 'center', 14);
  const ar = E.inOut(sm(T.tanques4 + 0.3, T.tanques4 + 0.8, t));
  current(x, [[CX - 260, CY - 350], [CX - 300, CY - 310], [CX - 330, CY - 250], [CX - 357, CY - 150]], ar, t, C.teal, 0.85);
  current(x, [[CX + 260, CY - 350], [CX + 300, CY - 310], [CX + 340, CY - 250], [CX + 362, CY - 140]], ar, t, C.teal, 0.85);
  // agua dentro de los tanques: plancton verde-azulado que sube y baja con el nivel
  const lvl = waterLevel(t);
  TANKS.forEach(([tx, ty, w, h], i) => {
   const top = ty + 8 + (h - 16) * (1 - lvl), R = H.rng(70 + i);
   for (let yy = ty + h - 14; yy > top; yy -= 17) for (let xx = tx + 14; xx < tx + w - 8; xx += 17) { const j = R(); dot(x, xx + Math.sin(t * 2 + j * 9) * 2, yy, 9, C.teal, 0.42 * (0.6 + 0.4 * Math.sin(t * 4 + j * 20)), 'soft'); }
   if (lvl > 0.03 && lvl < 0.98) gstroke(x, () => { x.beginPath(); for (let xx = tx + 10; xx <= tx + w - 10; xx += 6) x.lineTo(xx, top + Math.sin(xx * 0.08 + t * 6) * 3); }, C.teal, 0.8, 2);
  });
  // ventilación: válvulas arriba; sale aire en burbujas mientras entra agua por abajo
  const vOpen = sm(T.sumergirse, T.sumergirse + 0.3, t) * (1 - sm(T.aire6 - 0.4, T.aire6, t));
  const vl = land(t, T.sumergirse + 0.1);
  TANKS.forEach(([tx, ty, w, h], i) => {
   const vx = tx + w / 2, vy = ty - 34, an = vOpen * Math.PI / 2;
   gstroke(x, () => { x.beginPath(); x.moveTo(vx, ty); x.lineTo(vx, vy + 18); }, C.teal, sm(T.sumergirse - 0.4, T.sumergirse, t), 2.4);
   gstroke(x, () => { x.beginPath(); x.arc(vx, vy, 18, 0, TAU); }, vOpen > 0.5 ? C.cyan : C.teal, sm(T.sumergirse - 0.4, T.sumergirse, t), 2);
   gstroke(x, () => { x.beginPath(); x.moveTo(vx - Math.cos(an) * 26, vy - Math.sin(an) * 26); x.lineTo(vx + Math.cos(an) * 26, vy + Math.sin(an) * 26); }, C.ice, sm(T.sumergirse - 0.4, T.sumergirse, t), 3);
   const fl = sm(T.permite, T.permite + 0.3, t) * (1 - sm(T.aumentando + 0.6, T.aumentando + 1.0, t));
   if (fl > 0) {
    for (let k = 0; k < 7; k++) { const ph2 = (t * 0.8 + k / 7 + i * 0.3) % 1; dot(x, vx + Math.sin(k * 2 + t * 3) * 16, vy - 30 - ph2 * 230, 8 + 6 * ph2, C.ice, fl * (1 - ph2) * 0.9, 'core'); }
    current(x, [[vx - 30, ty + h + 110], [vx - 30, ty + h + 80], [vx - 30, ty + h + 50], [vx - 30, ty + h + 10]], 1, t, C.teal, fl * 0.85);
    current(x, [[vx + 30, ty + h + 110], [vx + 30, ty + h + 80], [vx + 30, ty + h + 50], [vx + 30, ty + h + 10]], 1, t, C.teal, fl * 0.85);
   }
  });
  gtext(x, 'VENTILACIÓN', 60, CY - 320 + vl.dy, F.label(36), C.ice, vl.a * (1 - sm(T.subir, T.subir + 0.4, t)), 'left', 10);
  const el = land(t, T.agua5);
  gtext(x, 'ENTRADA DE AGUA', 60, CY + 300 + el.dy, F.label(36), C.teal, el.a * (1 - sm(T.subir, T.subir + 0.4, t)), 'left', 10);
  // aire comprimido: botellas dentro del casco resistente, tuberías hasta los tanques
  const ax = CX - 120, ay = CY + 10, ba = sm(T.subir, T.subir + 0.4, t), alive = 1 - sm(T.falla7, T.falla7 + 0.25, t) * 0.85;
  for (let k = 0; k < 3; k++) gstroke(x, () => rrect(x, ax + k * 80, ay, 60, 120, 28), C.amber, ba * (0.5 + 0.5 * alive), 2.6);
  const blow = sm(T.aire6, T.aire6 + 0.25, t) * (1 - sm(T.expulsar6 + 0.9, T.expulsar6 + 1.3, t));
  const pipeL = [[ax + 30, ay], [ax + 30, CY - 30], [CX - 200, CY - 30], [CX - 262, CY - 30]], pipeR = [[ax + 190, ay], [ax + 190, CY - 20], [CX + 220, CY - 20], [CX + 282, CY - 20]];
  const pp = E.inOut(sm(T.subir + 0.2, T.aire6 + 0.1, t));
  const sig = blow > 0 ? (t * 1.4) % 1 : null;
  current(x, pipeL, pp, t, C.amber, 0.85 * alive, sig, C.ice, true); current(x, pipeR, pp, t, C.amber, 0.85 * alive, sig != null ? (sig + 0.5) % 1 : null, C.ice, true);
  const al = land(t, T.aire6);
  gtext(x, 'AIRE COMPRIMIDO', CX, CY + 230 + al.dy, F.label(40), C.amber, al.a, 'center', 12);
  // el agua sale por abajo al soplar
  if (blow > 0) TANKS.forEach(([tx, ty, w, h]) => { for (let k = 0; k < 2; k++) { const vx = tx + w / 2 + (k ? 30 : -30); current(x, [[vx, ty + h + 8], [vx, ty + h + 50], [vx, ty + h + 90], [vx, ty + h + 130]], 1, t, C.teal, blow * 0.85); } });
  // PESO y EMPUJE: flechas de luz cuyo largo sigue al estado del lastre
  const wa = sm(T.aumentando - 0.4, T.aumentando, t), wl = 100 + 130 * lvl;
  current(x, [[CX, CY + 265], [CX, CY + 265 + wl * 0.33], [CX, CY + 265 + wl * 0.66], [CX, CY + 265 + wl]], wa, t, C.amber, 0.95);
  gtext(x, 'PESO', CX + 34, CY + 350, F.label(44), C.amber, wa, 'left', 12);
  const ea = sm(T.aumentando - 0.2, T.aumentando + 0.2, t), el2 = 80 + 100 * (1 - lvl);
  current(x, [[CX + 70, CY - 172], [CX + 70, CY - 172 - el2 * 0.33], [CX + 70, CY - 172 - el2 * 0.66], [CX + 70, CY - 172 - el2]], ea, t, C.cyan, 0.95);
  gtext(x, 'EMPUJE', CX + 100, CY - 215, F.label(44), C.cyan, ea, 'left', 12);
  // comparación
  const c1 = sm(T.peso, T.peso + 0.3, t) * (1 - sm(T.subir, T.subir + 0.3, t)), c2 = sm(T.expulsar6 + 0.3, T.expulsar6 + 0.6, t) * (1 - sm(T.pero7, T.pero7 + 0.3, t));
  gtext(x, 'peso > empuje · desciende', CX, CY + 560, F.titleI(56), C.amber, c1, 'center', 16);
  gtext(x, 'empuje > peso · asciende', CX, CY + 560, F.titleI(56), C.cyan, c2, 'center', 16);
  // ¿y si el sistema de emergencia falla? ✗ roja sobre las tuberías y la pregunta
  const jx = ax + 110, jy = CY - 25, xm = sm(T.falla7, T.falla7 + 0.18, t), xm2 = sm(T.falla7 + 0.12, T.falla7 + 0.3, t);
  gstroke(x, () => { x.beginPath(); x.moveTo(jx - 60, jy - 60); x.lineTo(jx - 60 + 120 * xm, jy - 60 + 120 * xm); }, C.red, xm, 7);
  gstroke(x, () => { x.beginPath(); x.moveTo(jx + 60, jy - 60); x.lineTo(jx + 60 - 120 * xm2, jy - 60 + 120 * xm2); }, C.red, xm2, 7);
  const q = land(t, T.emergencia7, 0.35);
  gtext(x, '¿y si falla?', CX, CY + 560 + q.dy, F.titleI(84), C.mag, q.a, 'center', 20);
  const er = (t - T.falla7) / 0.6;
  if (er > 0 && er < 1) ring(x, jx, jy, 60 + er * 160, C.red, (1 - er) * 0.9, 3);
  x.restore();
 }

 // ---------- escena 3: 1963 · USS Thresher (rape abisal ilumina agua nueva) ----------
 function scene3(x, t) {
  const s1 = E.inOut(sm(TR.sink1[0], TR.sink1[1], t)), oy = -1400 * s1;
  x.save(); x.translate(0, oy);
  const n = land(t, T.y1963, 0.35);
  gtext(x, '1963', 540, 470 + n.dy, F.num(230), C.cyan, n.a, 'center', 26);
  const u = land(t, T.uss, 0.35);
  gtext(x, 'USS Thresher', 540, 620 + u.dy, F.titleI(92), C.ice, u.a, 'center', 18);
  const u2 = land(t, T.thresher + 0.1);
  gtext(x, 'SSN-593 · SUBMARINO NUCLEAR · EE. UU.', 540, 690 + u2.dy, F.label(34), LBL, u2.a, 'center', 10);
  const p = land(t, T.pruebas);
  gtext(x, 'pruebas de inmersión', 540, 1050 + p.dy, F.titleI(60), C.cyan, p.a, 'center', 14);
  const at = land(t, T.atlantico);
  gtext(x, '10 DE ABRIL · OCÉANO ATLÁNTICO', 540, 1108 + at.dy, F.label(36), LBL, at.a, 'center', 10);
  x.restore();
 }
 // el submarino del Thresher se dibuja directo (silueta que tapa la nieve)
 function thresherSub(ctx, t, lureW, lureK) {
  const s1 = E.inOut(sm(TR.sink1[0], TR.sink1[1], t)), oy = -1400 * s1;
  const a = sm(T.uss - 0.2, T.uss + 0.5, t);
  if (a <= 0 || oy < -1400) return;
  const sinkp = sm(T.hundio, T.hundio + 1.4, t);
  const lt = { x: lureW[0], y: lureW[1], r: 1000, k: lureK, col: C.amber };
  subSil(ctx, 560, 900 + oy + 20 * sinkp, 820, 0.06 * sinkp, lt, a, t, { nav: 0.6 * (1 - sinkp) });
  sparkles(ctx, 560, 990 + oy, 380, 70, t, 63, 30, a * 0.6, C.amber, 2);
 }

 // ---------- escena 4: posible cadena de fallos (sifonóforo) ----------
 const LINKS = [
  { t: () => T.posible + 0.4, l1: 'FALLO INICIAL', l2: 'probable fuga en una tubería', i0: 0, i1: 5 },
  { t: () => T.propulsion - 0.2, l1: 'PÉRDIDA DE PROPULSIÓN', l2: null, i0: 6, i1: 11 },
  { t: () => T.dificult + 0.2, l1: 'SOPLADO DE LASTRE', l2: 'no logró expulsar el agua', i0: 12, i1: 17 },
 ];
 function chainPts(t, oy) { const o = []; for (let i = 0; i < 18; i++) { const f = i / 17; o.push([170 + Math.sin(f * 4.2) * 60 + Math.sin(t * 0.8 + i * 0.5) * 4, oy + 440 + f * 820 + Math.cos(t * 0.7 + i * 0.4) * 4]); } return o; }
 function scene4(x, t) {
  const s1 = E.inOut(sm(TR.sink1[0], TR.sink1[1], t)), s2 = E.inOut(sm(TR.sink2[0], TR.sink2[1], t)), oy = 1400 * (1 - s1) - 1500 * s2;
  const shown = sm(T.posible - 0.5, T.posible, t);
  if (shown <= 0) return;
  const pts = chainPts(t, oy);
  const litT = (i) => { const k = LINKS.findIndex((L) => i >= L.i0 && i <= L.i1), L = LINKS[k], f = (i - L.i0) / (L.i1 - L.i0 + 1); return L.t() - 0.35 + f * 0.5; };
  siph(x, pts, t, (i) => flick(t, litT(i), litT(i) + 0.25, i), 1.6, shown, C.violet, C.cyan, (i) => (i >= 12 ? H.mix(C.mag, C.red, 0.4) : i >= 6 ? C.amber : C.cyan));
  const ti = land(t, T.posible, 0.4);
  gtext(x, 'posible cadena', 540, oy + 250 + ti.dy, F.titleI(74), C.mag, ti.a, 'center', 18);
  gtext(x, 'de fallos', 540, oy + 335 + ti.dy, F.titleI(74), C.mag, ti.a, 'center', 18);
  LINKS.forEach((L, k) => {
   const p = pts[Math.round((L.i0 + L.i1) / 2)], la = land(t, L.t() + 0.15, 0.3), col = k === 2 ? C.mag : k === 1 ? C.amber : C.cyan;
   gtext(x, L.l1, 330, p[1] + la.dy, F.label(48), col, la.a, 'left', 12);
   if (L.l2) gtext(x, L.l2, 330, p[1] + 56 + la.dy, F.label(34), LBL, la.a, 'left', 8);
   current(x, [[p[0] + 40, p[1] - 14], [p[0] + 80, p[1] - 14], [p[0] + 110, p[1] - 14], [p[0] + 140, p[1] - 14]], E.out(sm(L.t(), L.t() + 0.3, t)), t, col, 0.7, null, null, true);
  });
  const er = (t - T.lastre9) / 0.7;
  if (er > 0 && er < 1) ring(x, pts[15][0], pts[15][1], 50 + er * 200, C.mag, (1 - er) * 0.8, 3);
 }

 // ---------- escena 5: presión y casco ----------
 function scene5(x, t) {
  const s2 = E.inOut(sm(TR.sink2[0], TR.sink2[1], t)), oy = 1500 * (1 - s2);
  const a = sm(TR.sink2[0], TR.sink2[1], t) * (1 - sm(TR.out[0], TR.out[1], t));
  if (a <= 0) return;
  x.save(); x.globalAlpha = 1; x.translate(0, oy);
  const cx = 540, cy = 840, R = 250, dep = E.inOut(sm(T.medida, T.soportarla, t)), crack = sm(T.soportarla - 0.05, T.soportarla + 0.35, t);
  const hc = H.mix(C.cyan, C.red, crack);
  // sección del casco: doble anillo con plancton atrapado en la corona
  ring(x, cx, cy, R, hc, a * 0.95, 3.4); ring(x, cx, cy, R - 30, hc, a * 0.7, 2.2);
  const Rr = H.rng(593);
  for (let i = 0; i < 90; i++) { const an = Rr() * TAU, rr = R - 4 - Rr() * 22; dot(x, cx + Math.cos(an) * rr, cy + Math.sin(an) * rr, 5, hc, a * 0.45 * (0.6 + 0.4 * Math.sin(t * 5 + i)), 'core'); }
  gtext(x, 'SECCIÓN DEL CASCO', cx, cy + 12, F.label(34), LBL, a * sm(T.medida, T.medida + 0.5, t), 'center', 8);
  // presión del océano: corrientes que convergen y crecen con la profundidad (la luz se vuelve más intensa)
  const pr = 0.25 + 0.75 * dep, pa = a * sm(T.presion - 0.3, T.presion + 0.2, t);
  for (let k = 0; k < 12; k++) {
   const an = (k + 0.5) / 12 * TAU, L2 = 90 + 150 * pr, r0 = R + 24 + L2, r1 = R + 22;
   const P = [[cx + Math.cos(an) * r0, cy + Math.sin(an) * r0], [cx + Math.cos(an) * lerp(r0, r1, 0.33), cy + Math.sin(an) * lerp(r0, r1, 0.33)], [cx + Math.cos(an) * lerp(r0, r1, 0.66), cy + Math.sin(an) * lerp(r0, r1, 0.66)], [cx + Math.cos(an) * r1, cy + Math.sin(an) * r1]];
   current(x, P, 1, t, H.mix(C.blue, C.ice, dep * 0.6), pa * (0.6 + 0.4 * pr));
  }
  const pt = land(t, T.presion, 0.35);
  gtext(x, 'presión del océano', cx, 300 + pt.dy, F.titleI(74), C.ice, pt.a * a, 'center', 18);
  const au = land(t, T.aumentaba);
  gtext(x, 'AUMENTA CON LA PROFUNDIDAD', cx, 372 + au.dy, F.label(36), LBL, au.a * a, 'center', 10);
  // el límite: fracturas rojas, sin explosión
  if (crack > 0) { const r = H.rng(63); for (let k2 = 0; k2 < 6; k2++) { const an = -0.5 + k2 * 0.36 + r.range(-0.1, 0.1); gstroke(x, () => { x.beginPath(); x.moveTo(cx + Math.cos(an) * (R + 14), cy + Math.sin(an) * (R + 14)); let rr = R + 14; for (let j = 0; j < 6; j++) { rr -= 22 * crack; x.lineTo(cx + Math.cos(an + r.range(-0.06, 0.06)) * rr, cy + Math.sin(an + r.range(-0.06, 0.06)) * rr); } }, C.red, crack * a, 3); } }
  const li = land(t, T.soportarla + 0.2, 0.3);
  gtext(x, 'LÍMITE DEL CASCO', cx, 1260 + li.dy, F.label(56), C.red, li.a * a, 'center', 16);
  x.restore();
 }

 // ---------- escena 6: 129 (silencio) ----------
 function scene6(ctx, t) {
  const a = sm(T.las12 - 0.2, T.las12 + 0.3, t) * (1 - sm(TR.bloom[0], TR.bloom[1], t));
  if (a <= 0) return;
  const p = sm(T.n129 - 0.1, T.n129 + 0.9, t), crisp = sm(T.n129 + 0.7, T.n129 + 1.1, t);
  const f = F.num(300);
  gather(ctx, textPts('129', f, 4, 300), 540, 820, p, t, C.ice, a * (1 - crisp * 0.8), { x: 540, y: 1300, r: 600 });
  gtext(ctx, '129', 540, 820, f, C.ice, crisp * a, 'center', 24);
  const pl = land(t, T.personas, 0.4);
  gtext(ctx, 'personas a bordo', 540, 950 + pl.dy, F.titleI(68), C.cyan, pl.a * a, 'center', 16);
  // 129 luces que suben despacio, una por persona
  const up = sm(T.vida - 0.4, T.vida + 1.6, t);
  if (up > 0) { const R = H.rng(129); for (let i = 0; i < 129; i++) { const x0 = 100 + R() * 880, y0 = 1180 + R() * 220, sp = 0.6 + R() * 0.8; dot(ctx, x0 + Math.sin(t * 0.6 + i) * 6, y0 - up * 260 * sp, 5, C.ice, a * up * (0.35 + 0.35 * Math.sin(t * 2 + i)), 'core'); } }
 }

 // ---------- escena 7: la lección ----------
 function scene7(x, t) {
  const a = 1 - sm(TR.close[0], TR.close[1], t);
  const t1 = land(t, T.oceano13 + 0.2, 0.4);
  gtext(x, 'el océano no necesita', 540, 330 + t1.dy, F.titleI(70), C.ice, t1.a * a, 'center', 16);
  const t2 = land(t, T.grieta - 0.1, 0.35);
  gtext(x, 'una grieta', 540, 420 + t2.dy, F.titleI(84), C.cyan, t2.a * a, 'center', 18);
  // el casco puede estar intacto: un arco de casco sano (sin grieta) que se aparta cuando llega el esquema
  const hk = sm(T.grieta, T.grieta + 0.6, t) * (1 - sm(T.aveces - 0.3, T.aveces + 0.2, t));
  if (hk > 0) { ring(x, 540, 820, 230, C.cyan, hk * 0.9, 3.2); ring(x, 540, 820, 202, C.cyan, hk * 0.6, 2);
   const ok = land(t, T.grieta + 0.5); gtext(x, 'CASCO INTACTO', 540, 832 + ok.dy, F.label(40), C.green, ok.a * hk, 'center', 12);
   const am = land(t, T.amenaza - 0.1); gtext(x, 'y aun así, una amenaza', 540, 1180 + am.dy, F.titleI(60), C.amber, am.a * hk, 'center', 16); }
  // sistema de emergencia: aire comprimido → válvula → tanque de lastre
  const y = 800, s0 = sm(T.aveces, T.aveces + 0.5, t), dead = sm(T.nofunc, T.nofunc + 0.4, t);
  gstroke(x, () => rrect(x, 90, y - 110, 130, 230, 60), C.amber, s0 * a, 3);
  gtext(x, 'AIRE', 155, y + 175, F.label(32), C.amber, s0 * a, 'center', 8);
  gtext(x, 'COMPRIMIDO', 155, y + 213, F.label(32), C.amber, s0 * a, 'center', 8);
  const vx = 540, vs = sm(T.sistema14, T.sistema14 + 0.4, t);
  gstroke(x, () => { x.beginPath(); x.moveTo(vx - 60, y - 40); x.lineTo(vx + 60, y + 40); x.lineTo(vx + 60, y - 40); x.lineTo(vx - 60, y + 40); x.closePath(); }, C.ice, vs * a, 3);
  gtext(x, 'VÁLVULA', vx, y - 80, F.label(34), LBL, vs * a, 'center', 8);
  current(x, [[230, y], [320, y], [400, y], [470, y]], E.inOut(sm(T.aveces + 0.3, T.sistema14, t)), t, C.amber, a, (t * 1.3) % 1, C.ice, true);
  const ts = sm(T.sistema14 + 0.4, T.sistema14 + 0.9, t);
  gstroke(x, () => rrect(x, 780, y - 110, 210, 220, 28), C.teal, ts * a, 3);
  const R = H.rng(81); for (let yy = y + 96; yy > y - 80; yy -= 17) for (let xx = 796; xx < 980; xx += 17) { const j = R(); dot(x, xx, yy, 9, C.teal, ts * a * 0.4 * (0.6 + 0.4 * Math.sin(t * 4 + j * 20)), 'soft'); }
  gtext(x, 'TANQUE DE LASTRE', 885, y + 175, F.label(32), C.teal, ts * a, 'center', 8);
  current(x, [[610, y], [670, y], [720, y], [770, y]], E.inOut(sm(T.sistema14 + 0.3, T.sistema14 + 0.8, t)), t, C.amber, a * (1 - 0.85 * dead), null, null, false);
  const xm = sm(T.nofunc, T.nofunc + 0.18, t), xm2 = sm(T.nofunc + 0.12, T.nofunc + 0.3, t);
  gstroke(x, () => { x.beginPath(); x.moveTo(vx - 80, y - 80); x.lineTo(vx - 80 + 160 * xm, y - 80 + 160 * xm); }, C.red, xm * a, 8);
  gstroke(x, () => { x.beginPath(); x.moveTo(vx + 80, y - 80); x.lineTo(vx + 80 - 160 * xm2, y - 80 + 160 * xm2); }, C.red, xm2 * a, 8);
  const ne = land(t, T.necesita - 0.3, 0.35);
  gtext(x, 'cuando más se necesita', 540, 1110 + ne.dy, F.titleI(68), C.mag, ne.a * a, 'center', 18);
  const sf = land(t, T.necesita + 0.2, 0.4);
  gtext(x, 'Tras el Thresher, la Marina de EE. UU.', 540, 1222 + sf.dy, F.label(32), LBL, sf.a * a, 'center', 8);
  gtext(x, 'creó el programa de seguridad SUBSAFE', 540, 1266 + sf.dy, F.label(32), LBL, sf.a * a, 'center', 8);
 }

 // ---------- escena 8: cierre ----------
 function scene8(ctx, t) {
  const p = sm(T.asombro - 0.2, T.asombro + 0.8, t), crisp = sm(T.asombro + 0.55, T.asombro + 0.95, t);
  const f = F.title(118);
  gather(ctx, textPts('ASOMBROTECA', f, 3, 118), 540, 760, p, t, C.cyan, 1 - crisp * 0.85, { x: 540, y: 1100, r: 700 });
  gtext(ctx, 'ASOMBROTECA', 540, 760, f, C.cyan, crisp, 'center', 20);
  const tg = land(t, T.tag + 0.1, 0.5);
  gtext(ctx, 'la ciencia oculta de lo imposible', 540, 860 + tg.dy, F.titleI(56), C.ice, tg.a, 'center', 14);
  const ry = E.out(sm(T.asombro - 0.3, DURATION, t));
  jelly(ctx, { x: 540, y: lerp(1900, 1180, ry), s: 150, t, ph: 0.3, col: C.cyan, gon: 0.8, tent: 14, tl: 300, on: sm(T.asombro - 0.3, T.asombro + 0.4, t), net: { act: (i) => 0.6 + 0.4 * Math.sin(t * 3 - i), ew: (e) => e.w1 } });
  sparkles(ctx, 540, 800, 460, 180, t, 777, 50, crisp * 0.7, C.cyan, 2.2);
 }

 // ================= EXPLAINER =================
 function explainer(ctx, Wd, Hd, t) {
  const camY = camYOf(t), vel = (camYOf(t + 0.02) - camYOf(t - 0.02)) / 0.04;
  const depth = cl(0.25 + camY / 4200);
  const rays = (1 - sm(0.3, 3.4, t)) + 0.45 * sm(T.regresar - 0.2, T.superficie + 0.3, t) * (1 - sm(T.noresp, T.noresp + 0.8, t));
  water(ctx, W, HH, t, depth, rays);
  // apagones (antes del rape y tras el casco)
  const dk = sm(TR.dark[0], TR.dark[1], t) * (1 - sm(TR.reveal[0], TR.reveal[1], t)) + sm(TR.out[0], TR.out[1], t) * (1 - sm(T.las12 + 0.4, T.n129 + 0.6, t)) * 0.6;
  const fishOn = sm(TR.fish[0], TR.fish[0] + 0.1, t) * (1 - sm(TR.sink1[0], TR.sink1[1] + 0.6, t));
  const fx = lerp(-320, 190, E.out(sm(TR.fish[0], TR.fish[1], t))), fy = 1360 - 400 * E.inOut(sm(TR.sink1[0], TR.sink1[1], t));
  const lureW = [fx + 98 * 1.6, fy - 100 * 1.6], lureK = flick(t, TR.fish[0] + 0.05, TR.fish[0] + 0.35, 5) * fishOn;
  const lights = [];
  if (t < TR.push[1]) { const S = SUB1(t); lights.push({ x: S.x - 120, y: S.y + 230, r: 420, k: 0.45, col: C.cyan }); }
  if (t > TR.push[0] && t < TR.dark[1]) lights.push({ x: 540, y: 800, r: 520, k: 0.35, col: C.teal });
  if (fishOn > 0) lights.push({ x: lureW[0], y: lureW[1], r: 380, k: 0.8 * fishOn, col: C.amber });
  if (t > T.posible - 0.5 && t < TR.sink2[1]) lights.push({ x: 200, y: 850, r: 420, k: 0.4, col: C.violet });
  snow(ctx, W, HH, t, camY, 0, vel, lights, 1 - 0.35 * dk);
  farLayer(ctx, t, camY, sm(0.2, 1.2, t) * (1 - 0.8 * dk));

  // 1 · la zona de medianoche: el submarino, la falla, se hunde, no responde
  if (t < TR.push[1]) { scene1Back(ctx, t); scene1(ctx, t); }
  // 2 · los tanques (entrada continua en el casco), se apaga con «¿y si falla?»
  if (t > TR.push[0] && t < TR.dark[1] + 0.05) comp(ctx, W, HH, 0, (x) => scene2(x, t), { alpha: 1 - sm(TR.dark[0], TR.dark[1], t) });
  // 3 · el señuelo del rape abisal ilumina agua nueva: 1963
  if (t > TR.fish[0] && t < TR.sink1[1] + 0.1) {
   const rr = 2400 * E.in(sm(TR.reveal[0], TR.reveal[1], t));
   thresherSub(ctx, t, lureW, lureK + 0.25 * sm(TR.reveal[0], TR.reveal[1], t));
   comp(ctx, W, HH, 1, (x) => scene3(x, t), { mask: t < TR.reveal[1] ? (x) => { const g = x.createRadialGradient(lureW[0], lureW[1], 0, lureW[0], lureW[1], Math.max(1, rr)); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.6, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); return g; } : null });
   angler(ctx, fx, fy, 160, t, lureK, fishOn, false);
  }
  // 4 · posible cadena de fallos (descenso continuo a lo largo del sifonóforo)
  if (t > T.invest - 0.3 && t < TR.sink2[1] + 0.05) comp(ctx, W, HH, 0, (x) => scene4(x, t));
  // 5 · presión del océano y límite del casco (descenso continuo)
  if (t > TR.sink2[0] && t < TR.out[1] + 0.05) comp(ctx, W, HH, 1, (x) => scene5(x, t));
  // 6 · 129 (silencio, oscuridad)
  if (t > T.las12 - 0.3 && t < TR.bloom[1] + 0.05) comp(ctx, W, HH, 0, (x) => scene6(x, t), { clip: t > TR.bloom[0] ? (c) => c.rect(bloomX(t), 0, W + 400, HH) : null });
  // 7 · la floración de plancton barre la escena: la lección
  if (t > TR.bloom[0] && t < TR.close[1] + 0.05) comp(ctx, W, HH, 1, (x) => scene7(x, t), { clip: t < TR.bloom[1] ? (c) => c.rect(-10, 0, bloomX(t) + 10, HH) : null });
  if (t > TR.bloom[0] && t < TR.bloom[1]) bloomWall(ctx, t);
  // 8 · cierre
  if (t > TR.close[0] - 0.3) comp(ctx, W, HH, 0, (x) => scene8(x, t), { mask: (x) => { const g = x.createLinearGradient(0, 1250, 0, HH); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0.08)'); return g; } });

  // viñeta antes del HUD (como la referencia), luego subtítulos y grano
  H.vignette(ctx, W, HH, 0.6, '0,0,4');
  hud(ctx, W, camY, t, 0.9 * (1 - sm(T.asombro - 0.3, T.asombro + 0.3, t)), t > T.las12 - 0.3 && t < T.oceano13 ? 'SILENCIO' : null);
  subtitles(ctx, t);
  H.grain(ctx, W, HH, 0.035, 1 + Math.floor(t * 24), true);
 }
 const bloomX = (t) => lerp(-200, W + 200, E.inOut(sm(TR.bloom[0], TR.bloom[1], t)));
 function bloomWall(ctx, t) {
  const bf = bloomX(t);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(bf - 260, 0, bf + 40, 0);
  g.addColorStop(0, 'rgba(40,200,220,0)'); g.addColorStop(0.75, 'rgba(60,220,240,0.22)'); g.addColorStop(1, 'rgba(60,220,240,0)');
  ctx.fillStyle = g; ctx.fillRect(bf - 260, 0, 300, HH);
  const R = H.rng(606);
  for (let i = 0; i < 620; i++) {
   const off = Math.abs(R.gauss()) * 110, yy = R() * HH, ph = R() * TAU, col = R() < 0.08 ? C.mag : R() < 0.5 ? C.cyan : C.teal;
   const fl = 0.5 + 0.5 * Math.sin(t * 16 + ph);
   dot(ctx, bf - off + Math.sin(yy * 0.03 + t * 3) * 20, yy, R.range(3, 8), col, fl * (1 - off / 360), 'core');
  }
  ctx.restore();
 }
 // ---------- subtítulos: blancos sin caja, barra amarilla fina bajo la palabra activa ----------
 function subtitles(c, t) {
  const ph = A.phrases.find((p) => t >= p.s && t < p.e); if (!ph) return;
  const a = sm(ph.s - 0.02, ph.s + 0.1, t) * (1 - sm(ph.e - 0.1, ph.e, t));
  let px = 60; c.font = `700 ${px}px "Space Grotesk"`; const maxW = 920;
  const widest = Math.max(...ph.lines.map((l) => c.measureText(l).width)); if (widest > maxW) { px = Math.floor(px * maxW / widest); c.font = `700 ${px}px "Space Grotesk"`; }
  const lh = px * 1.25, y0 = 1530 - (ph.lines.length - 1) * lh / 2, sp = c.measureText(' ').width;
  const boxes = []; let wi = 0;
  ph.lines.forEach((ln, li) => { const lw = c.measureText(ln).width; let cx = 540 - lw / 2; ln.split(' ').forEach((w) => { const ww = c.measureText(w).width; boxes.push({ w, x: cx, y: y0 + li * lh, ww, s: ph.w[wi] ? ph.w[wi].s : ph.s, e: ph.w[wi] ? ph.w[wi].e : ph.e }); wi++; cx += ww + sp; }); });
  let act = boxes.findIndex((b) => t >= b.s && t < b.e); if (act < 0) act = t >= boxes[boxes.length - 1].s ? boxes.length - 1 : 0;
  const b0 = boxes[act], nb = boxes[act + 1]; let bx = b0.x, bw = b0.ww;
  if (nb && nb.y === b0.y) { const f = E.inOut(sm(b0.e - 0.08, b0.e, t)); bx = lerp(b0.x, nb.x, f); bw = lerp(b0.ww, nb.ww, f); }
  c.save(); c.globalAlpha = a; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  c.fillStyle = '#f0b90b'; c.beginPath(); c.roundRect(bx, b0.y + px * 0.2, bw, Math.max(6, px * 0.09), 3); c.fill();
  c.shadowColor = 'rgba(0,4,12,0.95)'; c.shadowBlur = 18; c.shadowOffsetY = 3; c.fillStyle = '#ffffff';
  for (const b of boxes) c.fillText(b.w, b.x, b.y);
  c.restore();
 }
 window.EPISODIO = { explainer, init: async () => {}, T, TR, DURATION, camYOf };
})();
