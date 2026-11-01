// =====================================================================================================
// episodio.js — «¿Cómo construyen túneles debajo de los ríos sin que se inunden?» · Asombroteca · PLANTILLA v1.16
// UN SOLO MUNDO (P.TUN): río, lecho, capas (arena, arcilla, grava, roca) y túnel bajo el lecho, visto en sección transversal
// (P.tunCross: el río fluye a lo ancho) y longitudinal (P.tunWorld: la tuneladora EPB avanza por el eje), con primeros planos de las
// mismas piezas: cabeza de corte (P.cutterFace), montaje del anillo (P.ringBuild), junta con sello (P.gasketHD) e interior terminado (P.tunnelView).
// Arco: río → descenso → túnel → ¿por qué no entra el agua? → ¿cómo excavan? → tuneladora → fábrica subterránea → presión controlada (EPB)
// → cabeza de corte → extracción (tornillo sinfín, cinta, vagonetas) → construye mientras avanza → dovelas → anillos → sellos
// → excava y reviste → presión del agua y del suelo → equilibrio de presiones → túnel terminado → el río sigue fluyendo → ¿qué hay encima?
// → ingeniería bajo el río → Asombroteca. Datos en FUENTES_Y_DECISIONES.md. Reloj = voz original. Determinista.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS, TC = P.TC, TUN = P.TUN;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const C = { ...TC, oro: '#FFD447', blanco: '#F4F7F8' };
 const T = {
  imagina: wt(0, 'imagina'), tunel0: wt(0, 'túnel'), rio0: wt(0, 'río'), millones: wt(0, 'millones'), agua0: wt(0, 'agua'), cabeza0: wt(0, 'cabeza'),
  y1: SG(1).s, tunel1: wt(1, 'túnel'), inundado: wt(1, 'inundado'),
  pero2: SG(2).s, como2: wt(2, 'cómo'), excavar2: wt(2, 'excavar'), agua2: wt(2, 'agua'), derrumbe: wt(2, 'derrumbe'),
  la3: SG(3).s, maquina3: wt(3, 'máquina'), extraordinaria: wt(3, 'extraordinaria'),
  se4: SG(4).s, tuneladora4: wt(4, 'tuneladora'),
  pero5: SG(5).s, excavadora: wt(5, 'excavadora'),
  en6: SG(6).s, especiales6: wt(6, 'especiales'), mantener: wt(6, 'mantener'), controlada: wt(6, 'controlada'), presion6: wt(6, 'presión'), terreno6: wt(6, 'terreno'), cabeza6: wt(6, 'cabeza'),
  mientras7: SG(7).s, avanza7: wt(7, 'avanza'), rueda: wt(7, 'rueda'), giratoria: wt(7, 'giratoria'), rompe: wt(7, 'rompe'), excava7: wt(7, 'excava'),
  el8: SG(8).s, material: wt(8, 'material'), retira: wt(8, 'retira'), sistemas8: wt(8, 'sistemas'), transporte: wt(8, 'transporte'),
  pero9: SG(9).s, sorprendente: wt(9, 'sorprendente'),
  detras: SG(10).s, instalando: wt(10, 'instalando'), segmentos10: wt(10, 'segmentos'), prefabricados: wt(10, 'prefabricados'), hormigon: wt(10, 'hormigón'),
  estos11: SG(11).s, unen: wt(11, 'unen'), anillos: wt(11, 'anillos'), paredes: wt(11, 'paredes'),
  y12: SG(12).s, juntas: wt(12, 'juntas'), sellos: wt(12, 'sellos'), impedir: wt(12, 'impedir'), agua12: wt(12, 'agua'),
  asi13: SG(13).s, avanzando: wt(13, 'avanzando'), revestido: wt(13, 'revestido'), protegido: wt(13, 'protegido'),
  pero14: SG(14).s, desafio: wt(14, 'desafío'),
  la15: SG(15).s, presion15: wt(15, 'presión'), agua15: wt(15, 'agua'), terreno15: wt(15, 'terreno'),
  por16: SG(16).s, controlan: wt(16, 'controlan'), presiones: wt(16, 'presiones'), evitar: wt(16, 'evitar'), estabilidad: wt(16, 'estabilidad'),
  y17: SG(17).s, termina: wt(17, 'termina'), recorrido: wt(17, 'recorrido'),
  queda: SG(18).s, estructura18: wt(18, 'estructura'), trenes: wt(18, 'trenes'), vehiculos: wt(18, 'vehículos'), personas: wt(18, 'personas'),
  todo19: SG(19).s, rio19: wt(19, 'río'), fluyendo: wt(19, 'fluyendo'),
  asi20: SG(20).s, atravieses: wt(20, 'atravieses'), recuerda: wt(20, 'recuerda'),
  sobre21: SG(21).s, toneladas: wt(21, 'toneladas'), tierra: wt(21, 'tierra'), masa: wt(21, 'masa'), agua21: wt(21, 'agua'), separadas: wt(21, 'separadas'), obra: wt(21, 'obra'), ingenieria21: wt(21, 'ingeniería'),
  sigue: SG(22).s, asombroteca: wt(22, 'asombroteca'), end: A.speech_end,
 };
 const TB = { inmersion: 2.7, bajo: 5.0, riesgo: T.y1 - 0.25, pregunta: T.pero2 - 0.3, maquina: T.la3 - 0.3, nombre: T.se4 - 0.2, fabrica: T.pero5 - 0.3, presion: T.en6 - 0.3, cabeza: T.mientras7 - 0.3, cabezaL: T.rompe - 0.1, extrae: T.el8 - 0.3, revela: T.pero9 - 0.3, dovelas: T.detras - 0.3, anillos: T.estos11 - 0.3, sellos: T.y12 - 0.3, reviste: T.asi13 - 0.3, desafio: T.pero14 - 0.3, equilibrio: T.por16 - 0.3, fin: T.y17 - 0.3, terminado: T.queda - 0.2, sube: T.todo19 - 0.3, encima: T.asi20 - 0.3, final: T.sobre21 - 0.3, cierre: T.sigue - 0.3 };

 // ---------------- utilidades ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const title = (ctx, s, t, t0, t1, y = 250) => pill(ctx, s, 540, y, s.length > 18 ? 50 : 58, t, t0, C.oro, C.fondo, t1);
 const tag = (ctx, s, x, y, px, a, c = 'rgba(244,247,248,0.98)') => { if (a <= 0.01) return; px = Math.max(px, 32); ctx.save(); ctx.globalAlpha *= a; ctx.font = `600 ${px}px "IBM Plex Mono"`; let L = [s];
  if (ctx.measureText(s).width + px * 1.2 > 1000) { const m = s.length / 2; let k = -1; for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (k < 0 || Math.abs(i - m) < Math.abs(k - m))) k = i; if (k > 0) L = [s.slice(0, k), s.slice(k + 1)]; }
  const lw = Math.max(...L.map((l) => ctx.measureText(l).width)); if (lw + px * 1.2 > 1000) { px *= 980 / (lw + px * 1.2); ctx.font = `600 ${px}px "IBM Plex Mono"`; }
  const w = Math.max(...L.map((l) => ctx.measureText(l).width)) + px * 1.2, lh = px * 1.25, h = px * 0.45 + lh * L.length, x0 = Math.min(Math.max(x - w / 2, 40), 1040 - w);
  P.rr(ctx, x0, y - h / 2, w, h, px * 0.6, 'rgba(11,24,33,0.86)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; L.forEach((l, i) => ctx.fillText(l, x0 + w / 2, y + 1 + (i - (L.length - 1) / 2) * lh)); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 8; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
 const callout = (ctx, x0, y0, x1, y1, s, a, c = C.blanco, al = 'left') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = '800 40px Nunito'; const tw = ctx.measureText(s).width; let tx = al === 'left' ? x1 + 14 : x1 - 14 - tw; tx = cl(tx, 56, W - 56 - tw);
  ctx.strokeStyle = 'rgba(11,24,33,0.75)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 10, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(11,24,33,0.9)'; ctx.lineWidth = 3; ctx.stroke(); P.rr(ctx, tx - 16, y1 - 32, tw + 32, 64, 32, 'rgba(11,24,33,0.88)'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, tx, y1 + 2); ctx.restore(); };
 const scrim = (ctx) => { const g = ctx.createLinearGradient(0, 1420, 0, 1760); g.addColorStop(0, 'rgba(11,24,33,0)'); g.addColorStop(0.5, 'rgba(11,24,33,0.6)'); g.addColorStop(1, 'rgba(11,24,33,0.6)'); ctx.fillStyle = g; ctx.fillRect(0, 1420, W, 500); };
 const vign = (ctx, a) => { if (a <= 0) return; const g = ctx.createRadialGradient(540, 900, 300, 540, 900, 1250); g.addColorStop(0, 'rgba(11,24,33,0)'); g.addColorStop(1, `rgba(11,24,33,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 const camPt = (cam, p) => [(p[0] - cam[0]) * cam[2] + 540, (p[1] - cam[1]) * cam[2] + 960];
 const zoomS = (k, t, d) => { k.play('riser', t - 0.2, { dur: d + 0.2, gain: 0.22, minor: true }); k.play('whoosh', t, { dur: d, top: 2600, gain: 0.3, minor: true }); };
 const world = (ctx, t, cam, o) => { ctx.save(); P.camApply(ctx, cam); const r = P.tunWorld(ctx, t, o); ctx.restore(); return r; };
 const cross = (ctx, t, cam, o) => { ctx.save(); P.camApply(ctx, cam); const r = P.tunCross(ctx, t, o); ctx.restore(); return r; };
 const flash = (ctx, a, c = '215,237,240') => { if (a <= 0) return; ctx.fillStyle = `rgba(${c},${a})`; ctx.fillRect(0, 0, W, HH); };
 // avance de la tuneladora (anillos): lento dentro de cada explicación; acelerado (y rotulado) en «excava y reviste»
 const cycAt = (t) => t < TB.reviste ? 25 + 0.55 * win(t, TB.maquina, TB.revela) + 0.25 * win(t, TB.revela, TB.dovelas + 2) : t < TB.desafio ? 25.8 + 2.2 * win(t, TB.reviste, TB.desafio) : t < TB.fin ? 28.15 + 0.3 * win(t, TB.desafio, TB.fin) : 74.6 + 0.4 * win(t, TB.fin, TB.terminado);
 const ST = (t) => P.tbmState(cycAt(t), 900);
 const TQ = [40, -30];

 const B = [];
 // 1 · ¡UN TÚNEL BAJO EL RÍO! — toma aérea → la cámara baja hasta el agua → la atraviesa → fondo → corte geológico → túnel iluminado
 B.push({ t0: 0, t1: TB.inmersion, draw(ctx, t) {
  const alt = 1 - E.inOut(win(t, 0.2, TB.inmersion)); P.riverAerial(ctx, t, { alt, tunnel: sm(T.tunel0, T.tunel0 + 0.5, t) * (1 - sm(TB.inmersion - 0.8, TB.inmersion - 0.3, t)) });
  flash(ctx, 0.9 * sm(TB.inmersion - 0.35, TB.inmersion, t)); title(ctx, '¡UN TÚNEL BAJO EL RÍO!', t, T.tunel0 - 0.1); scrim(ctx);
 }, sfx(k) { FX.viento(k, 0, TB.inmersion, 0.8); FX.corriente(k, 0.4, TB.inmersion, 0.7); FX.aparece(k, T.tunel0 - 0.1); k.play('whoosh', 1.2, { dur: 1.6, top: 900, gain: 0.3 }); MUS.golpe(k, T.tunel0, { gain: 0.6, chord: ['E2', 'B2', 'E3', 'G3'] }); } });
 B.push({ t0: TB.inmersion, t1: TB.riesgo, in: { type: 'cut' }, draw(ctx, t) {
  // descenso continuo por la sección transversal: superficie → agua → lecho → capas → túnel
  const u = E.inOut(win(t, TB.inmersion, T.cabeza0 + 0.3)), cy = lerp(TUN.WS + 40, TUN.TY - 90, u), z = lerp(1.3, 1.6, u); const cam = [540, cy, z];
  const r = cross(ctx, t, cam, { mode: 'terminado', train: sm(T.cabeza0 - 0.4, T.cabeza0, t) });
  flash(ctx, 0.9 * (1 - sm(TB.inmersion, TB.inmersion + 0.5, t)));
  const bed = camPt(cam, r.bed); if (bed[1] > 0 && bed[1] < 1400) callout(ctx, bed[0], bed[1], 640, bed[1] - 160, 'LECHO DEL RÍO', sm(4.0, 4.4, t) * (1 - sm(5.6, 6.0, t)), C.arena);
  const tn = camPt(cam, r.crown); callout(ctx, tn[0] + 30, tn[1] + 20, 720, tn[1] - 220, 'TÚNEL BAJO EL LECHO', sm(T.cabeza0 - 0.2, T.cabeza0 + 0.2, t), C.protegida);
  title(ctx, '¡UN TÚNEL BAJO EL RÍO!', t, 0); tag(ctx, 'MILLONES DE LITROS DE AGUA ENCIMA', 540, 370, 36, sm(T.millones, T.millones + 0.3, t) * (1 - sm(T.cabeza0, T.cabeza0 + 0.3, t)), C.blanco); scrim(ctx);
 }, sfx(k) { FX.chapuzon(k, TB.inmersion, 0.9); FX.bajoAgua(k, TB.inmersion + 0.2, TB.riesgo - TB.inmersion, 0.9); k.play('whoosh', TB.bajo, { dur: 1.4, top: 700, gain: 0.25 }); FX.etiqueta(k, 4.0); FX.etiqueta(k, T.millones); FX.etiqueta(k, T.cabeza0 - 0.2); } });

 // 2 · ¿POR QUÉ NO ENTRA EL AGUA? — presión exterior del agua y del terreno sobre el revestimiento
 B.push({ t0: TB.riesgo, t1: TB.pregunta, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.riesgo, TB.pregunta)), cam = [540, lerp(1060, 1250, u), lerp(0.82, 1.5, u)];
  const r = cross(ctx, t, cam, { mode: 'terminado', train: 1, press: sm(T.tunel1, T.tunel1 + 0.5, t) });
  const rg = camPt(cam, r.ring); callout(ctx, rg[0], rg[1], 700, rg[1] + 260, 'REVESTIMIENTO', sm(T.inundado - 0.2, T.inundado + 0.2, t), C.hormigon);
  title(ctx, '¿POR QUÉ NO ENTRA EL AGUA?', t, T.tunel1 - 0.1); tag(ctx, 'PRESIÓN DEL AGUA Y DEL TERRENO', 540, 370, 36, sm(T.tunel1 + 0.4, T.tunel1 + 0.7, t), C.presion); scrim(ctx);
 }, sfx(k) { FX.bajoAgua(k, TB.riesgo, TB.pregunta - TB.riesgo, 0.6); FX.aparece(k, T.tunel1 - 0.1); FX.etiqueta(k, T.tunel1 + 0.4); FX.etiqueta(k, T.inundado - 0.2); } });

 // 3 · ¿CÓMO EXCAVAN? — sección longitudinal: un frente de excavación sin soporte frente al terreno y al agua
 B.push({ t0: TB.pregunta, t1: TB.maquina, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const S = ST(TB.maquina), u = E.inOut(win(t, TB.pregunta, TB.maquina)), cam = [lerp(1500, S.xm + 60, u), lerp(1050, 1300, u), lerp(0.42, 1.1, u)];
  world(ctx, t, cam, { st: S, tbm: false, press: sm(T.excavar2, T.excavar2 + 0.5, t), watertable: 1 });
  const f = camPt(cam, [S.xm, TUN.TY]); if (t > T.derrumbe - 0.3) { ctx.save(); ctx.globalAlpha *= sm(T.derrumbe - 0.3, T.derrumbe, t); ctx.strokeStyle = C.presion; ctx.setLineDash([12, 10]); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(f[0] + 40 * cam[2], f[1], 60 * cam[2], TUN.R * 1.2 * cam[2], 0, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore(); }
  callout(ctx, f[0], f[1], 620, f[1] - 300, 'FRENTE SIN SOPORTE', sm(T.agua2, T.agua2 + 0.3, t), C.presion);
  title(ctx, '¿CÓMO EXCAVAN?', t, T.como2 - 0.1); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.pregunta, { dur: 1.2, top: 800, gain: 0.25 }); FX.aparece(k, T.como2 - 0.1); FX.crujido(k, T.derrumbe); FX.etiqueta(k, T.agua2); } });

 // 4 · TUNELADORA — de la oscuridad surge la cabeza de corte (de frente) y, al girar la cámara, la máquina en sección
 B.push({ t0: TB.maquina, t1: TB.nombre, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  ctx.fillStyle = '#05090c'; ctx.fillRect(0, 0, W, HH); const a = sm(TB.maquina, T.extraordinaria, t), R = lerp(260, 430, E.out(win(t, TB.maquina, TB.nombre)));
  ctx.save(); ctx.globalAlpha *= a; const g = ctx.createRadialGradient(540, 900, R, 540, 900, R * 2.2); g.addColorStop(0, '#5a4532'); g.addColorStop(1, '#05090c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); P.cutterFace(ctx, 540, 900, R, t * 0.9, t); ctx.restore(); vign(ctx, 0.7 * (1 - a * 0.5));
  title(ctx, 'UNA MÁQUINA EXTRAORDINARIA', t, T.maquina3 - 0.1); scrim(ctx);
 }, sfx(k) { FX.corteTBM(k, TB.maquina + 0.3, TB.nombre - TB.maquina, 0.8); FX.aparece(k, T.maquina3 - 0.1); MUS.golpe(k, T.extraordinaria, { gain: 0.7, chord: ['A2', 'E3', 'A3', 'C4'] }); } });
 B.push({ t0: TB.nombre, t1: TB.fabrica, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  const S = ST(t), u = E.inOut(win(t, TB.nombre, TB.fabrica)), cam = [lerp(S.xm - 60, S.xm - 150, u), TUN.TY, lerp(2.6, 1.9, u)];
  world(ctx, t, cam, { st: S, glow: { head: 0.8 * (1 - u) }, support: sm(T.tuneladora4 + 0.4, T.tuneladora4 + 0.8, t) });
  const h = camPt(cam, [S.xm, TUN.TY - TUN.R * 0.8]); callout(ctx, h[0], h[1], 640, 520, 'CABEZA DE CORTE', sm(T.tuneladora4, T.tuneladora4 + 0.3, t), C.corte, 'right');
  tag(ctx, 'FRENTE SOSTENIDO, NO ABIERTO', 540, 1330, 34, sm(T.tuneladora4 + 0.5, T.tuneladora4 + 0.8, t), C.protegida);
  title(ctx, 'TUNELADORA', t, T.tuneladora4 - 0.1); scrim(ctx);
 }, sfx(k) { FX.corteTBM(k, TB.nombre, TB.fabrica - TB.nombre, 0.7); FX.motor(k, TB.nombre, TB.fabrica - TB.nombre + 3, 0.6); FX.aparece(k, T.tuneladora4 - 0.1); MUS.golpe(k, T.tuneladora4, { gain: 0.8, chord: ['A2', 'E3', 'A3', 'C#4'] }); } });

 // 5 · UNA FÁBRICA SUBTERRÁNEA — la cámara se aleja a lo largo de la máquina: cabeza, escudo, erector, equipos posteriores
 B.push({ t0: TB.fabrica, t1: TB.presion, in: { type: 'cut' }, draw(ctx, t) {
  const S = ST(t), u = E.inOut(win(t, TB.fabrica, TB.presion)), cam = [lerp(S.xm - 150, S.xm - 520, u), TUN.TY + 20, lerp(1.9, 0.92, u)];
  const r = world(ctx, t, cam, { st: S });
  const L = (p, x, y, s, t0, c, al) => { const q = camPt(cam, p); callout(ctx, q[0], q[1], x, y, s, sm(t0, t0 + 0.25, t), c, al); };
  L([S.xm - 100, TUN.TY - TUN.R + 4], 700, 640, 'ESCUDO', T.pero5 + 0.1, C.aceroL); L(r.erector, 120, 1230, 'ERECTOR', T.excavadora, C.oro); L([S.xm - 560, TUN.TY + 10], 120, 640, 'EQUIPOS POSTERIORES', T.excavadora + 0.6, C.blanco);
  title(ctx, 'UNA FÁBRICA SUBTERRÁNEA', t, T.excavadora - 0.2); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.fabrica, { dur: 1.8, top: 700, gain: 0.25 }); FX.etiqueta(k, T.pero5 + 0.1); FX.etiqueta(k, T.excavadora); FX.etiqueta(k, T.excavadora + 0.6); FX.aparece(k, T.excavadora - 0.2); } });

 // 6 · PRESIÓN CONTROLADA — EPB: la cámara LLENA de terreno acondicionado sostiene el frente; rojo = presión exterior, cian = soporte
 B.push({ t0: TB.presion, t1: TB.cabeza, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const S = ST(t), c0 = P.camAt([[TB.presion, S.xm - 260, TUN.TY, 1.25], [T.mantener, S.xm - 40, TUN.TY, 2.6], [T.presion6, S.xm - 20, TUN.TY, 2.1], [TB.cabeza, S.xm - 30, TUN.TY, 2.2]], t), cam = [c0[0], c0[1], c0[2]];
  const r = world(ctx, t, cam, { st: S, press: sm(T.presion6, T.presion6 + 0.4, t), support: sm(T.mantener, T.controlada + 0.3, t), watertable: 1, glow: { chamber: 0.9 * sm(T.mantener, T.mantener + 0.3, t) * (1 - sm(T.presion6, T.presion6 + 0.5, t) * 0.6) } });
  const L = (p, x, y, s2, t0, c, al) => { const q = camPt(cam, p); callout(ctx, q[0], q[1], x, y, s2, sm(t0, t0 + 0.3, t), c, al); };
  L(r.chamber, 120, 470, 'MATERIAL ACONDICIONADO', T.mantener, C.arcilla); L(r.bulkhead, 120, 1200, 'SENSORES DE PRESIÓN', T.controlada + 0.2, C.protegida);
  tag(ctx, 'TUNELADORA EPB (PRESIÓN DE TIERRAS)', 540, 370, 34, sm(T.especiales6, T.especiales6 + 0.3, t) * (1 - sm(T.presion6 - 0.3, T.presion6, t)), C.blanco);
  const lg = sm(T.presion6 + 0.2, T.presion6 + 0.5, t); if (lg > 0) { ctx.save(); ctx.globalAlpha *= lg; P.rr(ctx, 60, 1290, 960, 110, 24, 'rgba(11,24,33,0.88)'); P.hArrow(ctx, 90, 1325, 60, C.presion, 14); txt(ctx, 'presión del terreno y del agua', 170, 1325, 32, C.blanco, { al: 'left', w: 700 }); P.hArrow(ctx, 90, 1368, 60, C.protegida, 14); txt(ctx, 'presión de soporte (cámara llena)', 170, 1368, 32, C.blanco, { al: 'left', w: 700 }); ctx.restore(); }
  tag(ctx, 'LAS FLECHAS SON FUERZAS, NO MOVIMIENTO', 540, 370, 32, sm(T.presion6 + 0.6, T.presion6 + 0.9, t), C.blanco);
  title(ctx, 'PRESIÓN CONTROLADA', t, T.controlada - 0.1); scrim(ctx);
 }, sfx(k) { FX.motor(k, TB.presion, TB.cabeza - TB.presion, 0.5); FX.etiqueta(k, T.especiales6); FX.etiqueta(k, T.mantener); FX.aparece(k, T.controlada - 0.1); FX.etiqueta(k, T.controlada + 0.2); FX.etiqueta(k, T.presion6 + 0.2); FX.compresion(k, T.presion6 - 0.4, 1.0); } });

 // 7 · CABEZA DE CORTE — de frente: herramientas contra el terreno y aberturas por donde entra; después en sección
 B.push({ t0: TB.cabeza, t1: TB.cabezaL, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = '#3a2b1f'; ctx.fillRect(0, 0, W, HH); const Rr = H.rng(3); for (let i = 0; i < 300; i++) { ctx.fillStyle = Rr() < 0.5 ? 'rgba(162,123,89,0.5)' : 'rgba(90,68,50,0.5)'; ctx.fillRect(Rr.range(0, W), Rr.range(0, HH), 6, 4); }
  const R = 470, ang = t * 1.1, fc = P.cutterFace(ctx, 540, 900, R, ang, t);
  callout(ctx, fc.tool[0], fc.tool[1], 600, 1330, 'HERRAMIENTAS DE CORTE', sm(T.giratoria, T.giratoria + 0.3, t), C.aceroL);
  callout(ctx, fc.opening[0], fc.opening[1], 120, 470, 'RANURAS DE ENTRADA', sm(T.rompe - 0.4, T.rompe - 0.1, t), C.arcilla);
  title(ctx, 'CABEZA DE CORTE', t, T.rueda - 0.1); tag(ctx, 'GIRA LA CABEZA; EL ESCUDO NO GIRA', 540, 370, 34, sm(T.avanza7, T.avanza7 + 0.3, t), C.blanco); scrim(ctx);
 }, sfx(k) { FX.corteTBM(k, TB.cabeza, TB.cabezaL - TB.cabeza + 0.2, 1); FX.aparece(k, T.rueda - 0.1); FX.etiqueta(k, T.avanza7); FX.etiqueta(k, T.giratoria); } });
 B.push({ t0: TB.cabezaL, t1: TB.extrae, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const S = ST(t), cam = [S.xm - 110, TUN.TY, lerp(2.4, 2.7, win(t, TB.cabezaL, TB.extrae))]; world(ctx, t, cam, { st: S, glow: { cyl: 0.8 } });
  const cy = camPt(cam, [S.xm - 180, TUN.TY - TUN.R + 26]); callout(ctx, cy[0], cy[1], 120, 470, 'CILINDROS: EMPUJAN CONTRA EL ÚLTIMO ANILLO', sm(TB.cabezaL + 0.1, TB.cabezaL + 0.4, t), C.oro);
  const fc = camPt(cam, [S.xm - 9, TUN.TY + TUN.R * 0.62 * Math.sin(t * 1.2)]); callout(ctx, fc[0], fc[1], 640, 1290, 'EL TERRENO PASA A LA CÁMARA', sm(T.excava7, T.excava7 + 0.3, t), C.arcilla, 'right');
  title(ctx, 'CABEZA DE CORTE', t, TB.cabezaL); scrim(ctx);
 }, sfx(k) { FX.corteTBM(k, TB.cabezaL, TB.extrae - TB.cabezaL, 0.8); FX.hidraulico(k, TB.cabezaL + 0.1, 1.2, 0.6); FX.etiqueta(k, TB.cabezaL + 0.1); FX.etiqueta(k, T.excava7); } });

 // 8 · EXTRACCIÓN DEL TERRENO — la cámara sigue a la marina: boca del tornillo en la cámara → hélice → motor y compuerta → cinta → vagonetas
 B.push({ t0: TB.extrae, t1: TB.revela, in: { type: 'cut' }, draw(ctx, t) {
  const S = ST(t), cam = P.camAt([[TB.extrae, S.xm - 60, TUN.TY + TUN.R - 40, 3.2], [T.retira, S.xm - 250, TUN.TY - 10, 2.5], [T.sistemas8, S.xm - 520, TUN.TY - 10, 2.0], [TB.revela, S.xm - 1120, TUN.TY + 20, 1.7]], t);
  const r = world(ctx, t, cam, { st: S, glow: { screw: 0.7 * sm(T.material, T.material + 0.4, t) * (1 - sm(T.sistemas8, T.sistemas8 + 0.4, t)) } });
  const L = (p, x, y, s2, t0, t1, c, al) => { const q = camPt(cam, p); if (q[0] > 20 && q[0] < W - 20 && q[1] > 300 && q[1] < 1400) callout(ctx, q[0], q[1], x, y, s2, sm(t0, t0 + 0.3, t) * (1 - sm(t1, t1 + 0.3, t)), c, al); };
  L(r.screwIn, 640, 1180, 'ENTRADA DEL TORNILLO', TB.extrae + 0.1, T.retira - 0.2, C.oro, 'right'); L([(r.screwIn[0] * 0.4 + r.screwOut[0] * 0.6), (r.screwIn[1] * 0.4 + r.screwOut[1] * 0.6)], 120, 1300, 'TORNILLO SINFÍN', T.material + 0.3, T.sistemas8, C.oro); L([r.screwOut[0] - 10, r.screwOut[1] - 18], 120, 470, 'MOTOR Y COMPUERTA', T.retira, T.sistemas8 + 0.4, C.aceroL);
  L([cam[0] + 40, TUN.TY - TUN.R * 0.18 - 4], 600, 470, 'CINTA TRANSPORTADORA', T.sistemas8, T.transporte + 0.2, C.blanco, 'right'); L([S.xm - 1180, TUN.TY + 50], 120, 1300, 'VAGONETAS', T.transporte, 99, '#d9b27c');
  title(ctx, 'EXTRACCIÓN DEL TERRENO', t, T.material - 0.1); scrim(ctx);
 }, sfx(k) { FX.sinfin(k, TB.extrae, TB.revela - TB.extrae, 0.9); FX.vertido(k, T.retira, 1.2, 0.6); FX.aparece(k, T.material - 0.1); FX.etiqueta(k, TB.extrae + 0.1); FX.etiqueta(k, T.material + 0.3); FX.etiqueta(k, T.retira); FX.etiqueta(k, T.sistemas8); FX.etiqueta(k, T.transporte); FX.ruedas(k, T.transporte - 0.2, 1.4, 0.6); } });

 // 9 · ¡CONSTRUYE MIENTRAS AVANZA! — de la cabeza a la cola: la luz revela el erector con una dovela
 B.push({ t0: TB.revela, t1: TB.dovelas, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const S = ST(t), u = E.inOut(win(t, TB.revela, TB.dovelas)), cam = [lerp(S.xm - 120, S.rf + 12, u), TUN.TY, lerp(2.2, 3.4, u)];
  world(ctx, t, cam, { st: S, glow: { erector: sm(T.sorprendente - 0.4, T.sorprendente, t) } }); const e = camPt(cam, [S.rf + TUN.w / 2, TUN.TY]); P.glow(ctx, e[0], e[1], 380, '255,236,200', 0.25 * sm(T.sorprendente - 0.5, T.sorprendente, t));
  title(ctx, '¡CONSTRUYE MIENTRAS AVANZA!', t, T.sorprendente - 0.2); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.revela, { dur: 1.6, top: 900, gain: 0.25 }); FX.descubrir(k, T.sorprendente - 0.3, 0.8); MUS.golpe(k, T.sorprendente, { gain: 0.8, chord: ['D3', 'A3', 'D4', 'F#4'] }); } });

 // 10–11 · DOVELAS y ANILLOS — vista de frente dentro de la cola: el erector toma, eleva, gira y coloca cada dovela; la llave cierra el anillo
 const ringAt = (t) => t < TB.anillos ? 2.6 * win(t, TB.dovelas + 0.6, TB.anillos) : 2.6 + 4.4 * win(t, TB.anillos, T.paredes - 0.2);
 B.push({ t0: TB.dovelas, t1: TB.sellos, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = '#0d1418'; ctx.fillRect(0, 0, W, HH); const pass = sm(T.paredes, TB.sellos, t), Rr = 410 * (1 + 2.6 * E.in(pass));
  const r = P.ringBuild(ctx, 540, 900, Rr, t, { placed: ringAt(t) }); if (pass > 0) vign(ctx, 0.5 * pass);
  callout(ctx, r.erector[0], r.erector[1], 640, 1240, 'ERECTOR', sm(T.instalando - 0.2, T.instalando + 0.1, t) * (1 - pass), C.oro);
  callout(ctx, r.held[0], r.held[1], 120, 1240, 'DOVELA', sm(T.segmentos10, T.segmentos10 + 0.3, t) * (1 - sm(TB.anillos, TB.anillos + 0.3, t)), C.hormigon); callout(ctx, r.prev[0], r.prev[1], 120, 470, 'ANILLO ANTERIOR', sm(T.unen, T.unen + 0.3, t) * (1 - pass), '#9aa4a7');
  callout(ctx, r.shield[0], r.shield[1], 700, 470, 'ESCUDO', sm(T.prefabricados, T.prefabricados + 0.3, t) * (1 - sm(TB.anillos, TB.anillos + 0.3, t)), C.aceroL);
  title(ctx, 'DOVELAS DE HORMIGÓN', t, T.segmentos10 - 0.2, TB.anillos + 0.2); title(ctx, 'ANILLOS ESTRUCTURALES', t, T.anillos - 0.1);
  tag(ctx, 'JUNTAS ESCALONADAS ENTRE ANILLOS', 540, 370, 34, sm(T.unen, T.unen + 0.3, t) * (1 - pass), C.blanco); scrim(ctx);
 }, sfx(k) { for (let i = 0; i < 7; i++) { const tt = i < 3 ? TB.dovelas + 0.6 + (i + 0.85) * (TB.anillos - TB.dovelas - 0.6) / 2.6 : TB.anillos + (i - 2.6 + 0.85) * (T.paredes - 0.2 - TB.anillos) / 4.4; FX.hidraulico(k, tt - 0.9, 0.8, 0.5); FX.encaje(k, tt, 0.7); } FX.aparece(k, T.segmentos10 - 0.2); FX.aparece(k, T.anillos - 0.1); FX.etiqueta(k, T.instalando - 0.2); FX.etiqueta(k, T.segmentos10); FX.etiqueta(k, T.unen); k.play('whoosh', T.paredes, { dur: 0.9, top: 2200, gain: 0.3 }); } });

 // 12a · relleno anular y sellos en contexto: sección del anillo en el terreno; la lechada llena el hueco exterior desde abajo
 const TJ = T.sellos + 0.5;
 B.push({ t0: TB.sellos, t1: TJ, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.fillStyle = '#0d1418'; ctx.fillRect(0, 0, W, HH); const z = 1 + 3.2 * E.in(win(t, TJ - 0.6, TJ)), jx = 540 + Math.cos(-Math.PI / 2 + Math.PI / 7 + (3 * TAU) / 7) * 380 * 0.95, jy = 880 + Math.sin(-Math.PI / 2 + Math.PI / 7 + (3 * TAU) / 7) * 380 * 0.95;
  ctx.save(); ctx.translate(jx, jy); ctx.scale(z, z); ctx.translate(-jx, -jy); const r = P.ringSection(ctx, 540, 880, 380, t, { grout: E.inOut(win(t, TB.sellos + 0.2, T.sellos)), press: sm(T.juntas, T.juntas + 0.4, t), glowJoint: sm(T.sellos, T.sellos + 0.3, t) }); ctx.restore();
  const k = 1 - sm(TJ - 0.6, TJ - 0.3, t); const L = (p, x, y, s2, t0, c, al) => callout(ctx, p[0], p[1], x, y, s2, sm(t0, t0 + 0.3, t) * k, c, al);
  L(r.grout, 640, 470, 'LECHADA (RELLENO ANULAR)', TB.sellos + 0.3, '#d6cfc2', 'right'); L(r.seg, 640, 1300, 'DOVELAS', T.juntas, C.hormigon, 'right'); L(r.joint, 120, 1300, 'SELLOS EN LAS JUNTAS', T.sellos - 0.1, C.blanco); L(r.soil, 120, 580, 'TERRENO CON AGUA', T.juntas + 0.2, C.presion);
  title(ctx, 'JUNTAS IMPERMEABLES', t, T.juntas - 0.1); scrim(ctx);
 }, sfx(k) { FX.vertido(k, TB.sellos + 0.2, 1.6, 0.5); FX.aparece(k, T.juntas - 0.1); FX.etiqueta(k, TB.sellos + 0.3); FX.etiqueta(k, T.juntas); FX.etiqueta(k, T.sellos - 0.1); k.play('whoosh', TJ - 0.6, { dur: 0.6, top: 2200, gain: 0.25, minor: true }); } });
 // 12b · macro de la junta: el sello elastomérico se comprime y frena el agua a presión
 B.push({ t0: TJ, t1: TB.reviste, in: { type: 'fade', d: 0.25 }, draw(ctx, t) {
  ctx.fillStyle = '#0d1418'; ctx.fillRect(0, 0, W, HH); const close = E.inOut(win(t, TJ, TJ + 0.6));
  const r = P.gasketHD(ctx, 540, 940, 150, t, { close, water: sm(T.impedir - 0.3, T.impedir + 0.2, t) });
  callout(ctx, r.gasket[0], r.gasket[1], 640, 650, 'SELLO COMPRIMIDO', sm(TJ + 0.3, TJ + 0.6, t), C.blanco);
  callout(ctx, r.water[0], r.water[1], 640, 470, 'AGUA A PRESIÓN', sm(T.impedir, T.impedir + 0.3, t), C.presion); callout(ctx, r.inside[0], r.inside[1], 120, 1330, 'INTERIOR SECO', sm(T.agua12, T.agua12 + 0.3, t), C.protegida);
  title(ctx, 'JUNTAS IMPERMEABLES', t, TJ); tag(ctx, 'DEPENDE DEL DISEÑO, LA INSTALACIÓN Y LA PRESIÓN', 540, 370, 32, sm(T.agua12 + 0.2, T.agua12 + 0.5, t), C.blanco); scrim(ctx);
 }, sfx(k) { FX.hidraulico(k, TJ, 0.8, 0.5); FX.encaje(k, TJ + 0.6, 0.8); FX.etiqueta(k, TJ + 0.3); FX.etiqueta(k, T.impedir); FX.agua(k, T.impedir - 0.3, 1.5); } });

 // 13 · EXCAVA Y REVISTE — travelling longitudinal: la máquina avanza (tiempo acelerado) y deja anillos y lechada detrás
 B.push({ t0: TB.reviste, t1: TB.desafio, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const S = ST(t), u = E.inOut(win(t, TB.reviste, TB.desafio)), cam = [S.xm - lerp(520, 300, u), TUN.TY + 10, lerp(1.25, 1.45, u)];
  const r = world(ctx, t, cam, { st: S, glow: {} });
  const g = camPt(cam, r.grout); callout(ctx, g[0], g[1] + 4, 140, 1250, 'LECHADA EN EL HUECO ANULAR', sm(T.revestido - 0.2, T.revestido + 0.1, t), '#d6cfc2');
  const rg = camPt(cam, r.ring); callout(ctx, rg[0], rg[1], 140, 560, 'ANILLOS TERMINADOS', sm(T.avanzando, T.avanzando + 0.3, t), C.hormigon);
  title(ctx, 'EXCAVA Y REVISTE', t, T.avanzando - 0.2); tag(ctx, 'TIEMPO ACELERADO', 540, 370, 34, sm(TB.reviste + 0.3, TB.reviste + 0.6, t), C.blanco); scrim(ctx);
 }, sfx(k) { FX.corteTBM(k, TB.reviste, TB.desafio - TB.reviste, 0.6); FX.sinfin(k, TB.reviste, TB.desafio - TB.reviste, 0.5); for (const d of [1.2, 3.4]) FX.encaje(k, TB.reviste + d, 0.6); FX.aparece(k, T.avanzando - 0.2); FX.etiqueta(k, T.avanzando); FX.etiqueta(k, T.revestido - 0.2); } });

 // 14 · PRESIÓN DEL AGUA Y DEL SUELO — la cámara sube de la máquina al lecho y al río, y vuelve a bajar
 B.push({ t0: TB.desafio, t1: TB.equilibrio, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const S = ST(t), u = E.inOut(win(t, TB.desafio, T.presion15)), d = E.inOut(win(t, T.terreno15, TB.equilibrio)), cam = [S.xm - 200, lerp(lerp(TUN.TY, 900, u), TUN.TY - 60, d), lerp(lerp(1.2, 0.62, u), 1.1, d)];
  world(ctx, t, cam, { st: S, press: sm(T.presion15, T.presion15 + 0.4, t), watertable: 1 });
  const a = sm(T.agua15, T.agua15 + 0.4, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; for (let x = S.xm - 700; x <= S.xm + 300; x += 160) { const q = camPt(cam, [x, 700]), q2 = camPt(cam, [x, TUN.bed(x) - 10]); ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(Math.PI / 2); P.hArrow(ctx, 0, 0, Math.max(30, q2[1] - q[1]), 'rgba(255,115,90,0.8)', 14); ctx.restore(); } ctx.restore(); }
  title(ctx, 'PRESIÓN DEL AGUA Y DEL SUELO', t, T.presion15 - 0.1); tag(ctx, 'OTRO DESAFÍO', 540, 370, 36, sm(T.desafio - 0.2, T.desafio + 0.1, t) * (1 - sm(T.presion15 - 0.3, T.presion15, t)), C.blanco); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.desafio + 0.3, { dur: 2, top: 700, gain: 0.25 }); FX.bajoAgua(k, TB.desafio + 0.6, 2.8, 0.5); FX.aparece(k, T.presion15 - 0.1); FX.compresion(k, T.agua15, 1.2); k.play('whoosh', T.terreno15, { dur: 1.2, top: 900, gain: 0.25, minor: true }); } });

 // 15 · EQUILIBRIO DE PRESIONES — frente en sección: empuje del terreno y del agua frente a la presión de soporte, regulada dentro de márgenes
 const gauge = (ctx, x, y, w2, v, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x - w2 / 2 - 30, y - 70, w2 + 60, 170, 24, 'rgba(11,24,33,0.9)'); txt(ctx, 'PRESIÓN DE SOPORTE', x, y - 38, 34, C.blanco, { w: 800 });
  const x0 = x - w2 / 2; P.rr(ctx, x0, y - 4, w2 * 0.22, 30, 15, 'rgba(255,115,90,0.6)'); P.rr(ctx, x0 + w2 * 0.78, y - 4, w2 * 0.22, 30, 15, 'rgba(255,115,90,0.6)'); P.rr(ctx, x0 + w2 * 0.24, y - 4, w2 * 0.52, 30, 15, C.protegida);
  const mx = x0 + w2 * (0.3 + 0.4 * v); ctx.fillStyle = C.blanco; ctx.beginPath(); ctx.moveTo(mx - 14, y - 22); ctx.lineTo(mx + 14, y - 22); ctx.lineTo(mx, y - 4); ctx.closePath(); ctx.fill(); ctx.fillRect(mx - 2, y - 4, 4, 30);
  txt(ctx, 'baja', x0 + w2 * 0.11, y + 60, 32, C.presion, { w: 700 }); txt(ctx, 'margen de diseño', x, y + 60, 32, C.protegida, { w: 700 }); txt(ctx, 'alta', x0 + w2 * 0.89, y + 60, 32, C.presion, { w: 700 }); ctx.restore(); };
 B.push({ t0: TB.equilibrio, t1: TB.fin, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const S = ST(t), cam = [S.xm - 110, TUN.TY + 90, 2.1]; const r = world(ctx, t, cam, { st: S, press: sm(T.controlan, T.controlan + 0.3, t), support: sm(T.controlan + 0.3, T.controlan + 0.6, t), glow: { chamber: 0.8, screw: 0.7 * sm(T.evitar - 0.3, T.evitar, t) } });
  gauge(ctx, 540, 520, 820, 0.5 + 0.45 * Math.sin(t * 1.3) * Math.sin(t * 0.37 + 1), sm(T.presiones - 0.2, T.presiones + 0.2, t));
  const sc = camPt(cam, [(r.screwIn[0] + r.screwOut[0]) / 2, (r.screwIn[1] + r.screwOut[1]) / 2]); callout(ctx, sc[0], sc[1], 140, 1260, 'EL TORNILLO REGULA LA SALIDA', sm(T.evitar - 0.2, T.evitar + 0.1, t), C.oro);
  title(ctx, 'EQUILIBRIO DE PRESIONES', t, T.controlan - 0.1, 0, 200); scrim(ctx);
 }, sfx(k) { FX.motor(k, TB.equilibrio, TB.fin - TB.equilibrio, 0.5); FX.aparece(k, T.controlan - 0.1); FX.etiqueta(k, T.presiones - 0.2); FX.sinfin(k, T.evitar - 0.3, 2.2, 0.6); FX.etiqueta(k, T.evitar - 0.2); FX.equilibrio(k, T.estabilidad); } });

 // 16a · fin del recorrido: la tuneladora llega al pozo de salida (tiempo acelerado)
 B.push({ t0: TB.fin, t1: TB.terminado, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const S = ST(t), cam = [TUN.x1 - 80, TUN.TY - 40, 1.1]; world(ctx, t, cam, { st: S });
  tag(ctx, 'LLEGADA AL POZO DE SALIDA', 540, 370, 36, sm(T.termina, T.termina + 0.3, t), C.blanco); scrim(ctx);
 }, sfx(k) { FX.corteTBM(k, TB.fin, 1.2, 0.6); FX.golpeSordo(k, T.recorrido); FX.etiqueta(k, T.termina); } });

 // 16b · TÚNEL TERMINADO — de obra civil a instalaciones: vía, luces y un tren que se acerca
 B.push({ t0: TB.terminado, t1: TB.sube, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  const z = lerp(14, 1.3, E.in(win(t, TB.terminado + 0.6, TB.sube + 0.1))); P.tunnelView(ctx, t, { train: z, speed: 0 });
  title(ctx, 'TÚNEL TERMINADO', t, T.queda - 0.1); tag(ctx, 'VÍAS E INSTALACIONES SE COLOCAN DESPUÉS', 540, 370, 34, sm(T.estructura18, T.estructura18 + 0.3, t) * (1 - sm(T.trenes - 0.2, T.trenes, t)), C.blanco);
  tag(ctx, 'TRENES · VEHÍCULOS · PERSONAS', 540, 370, 36, sm(T.trenes, T.trenes + 0.3, t), C.protegida); scrim(ctx);
 }, sfx(k) { FX.aparece(k, T.queda - 0.1); FX.etiqueta(k, T.estructura18); FX.etiqueta(k, T.trenes); FX.tren(k, TB.terminado + 0.8, TB.sube - TB.terminado, 0.9); MUS.golpe(k, T.queda, { gain: 0.7, chord: ['D3', 'A3', 'D4', 'F#4'] }); } });

 // 17 · EL RÍO SIGUE FLUYENDO — la cámara sube desde el tren, cruza el revestimiento, las capas y el agua, y emerge
 B.push({ t0: TB.sube, t1: TB.encima, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.sube, T.fluyendo)), cam = [540, lerp(TUN.TY, 800, u), lerp(1.8, 1.1, u)]; cross(ctx, t, cam, { mode: 'terminado', train: 1 });
  title(ctx, 'EL RÍO SIGUE FLUYENDO', t, T.fluyendo - 0.2); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.sube, { dur: 2.4, top: 700, gain: 0.3 }); FX.bajoAgua(k, TB.sube + 0.8, 1.6, 0.6); FX.corriente(k, T.rio19, TB.encima - T.rio19 + 0.5, 0.8); FX.aparece(k, T.fluyendo - 0.2); } });

 // 18 · ¿QUÉ HAY ENCIMA? — de nuevo dentro del túnel; la vista se abre hacia el techo con un corte transparente del terreno
 B.push({ t0: TB.encima, t1: TB.final, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const v = sm(T.atravieses, T.recuerda, t); if (v < 1) { ctx.save(); ctx.globalAlpha *= 1 - v; P.tunnelView(ctx, t, { train: null, speed: 1.6, cam: -40 }); ctx.restore(); }
  if (v > 0) { ctx.save(); ctx.globalAlpha *= v; const cam = [540, lerp(TUN.TY - 40, TUN.TY - 160, sm(T.recuerda, TB.final, t)), lerp(2.2, 1.6, sm(T.recuerda, TB.final, t))]; cross(ctx, t, cam, { mode: 'terminado', train: 1, xray: sm(T.recuerda, T.recuerda + 0.4, t) }); ctx.restore(); }
  title(ctx, '¿QUÉ HAY ENCIMA?', t, T.recuerda - 0.2); scrim(ctx);
 }, sfx(k) { FX.tren(k, TB.encima, 2.4, 0.5); k.play('whoosh', T.atravieses, { dur: 1.4, top: 1600, gain: 0.25, minor: true }); FX.aparece(k, T.recuerda - 0.2); } });

 // 19 · INGENIERÍA BAJO EL RÍO — vista vertical completa: superficie, agua, lecho, capas, revestimiento y tren
 B.push({ t0: TB.final, t1: TB.cierre, in: { type: 'cut' }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.final, T.obra)), cam = [540, lerp(TUN.TY - 160, 1030, u), lerp(1.9, 1.4, u)]; const r = cross(ctx, t, cam, { mode: 'terminado', train: 1, xray: 1 - sm(T.obra, T.obra + 0.6, t) });
  const L = (p, x, y, s, t0, c, al) => { const q = camPt(cam, p); callout(ctx, q[0], q[1], x, y, s, sm(t0, t0 + 0.3, t), c, al); };
  L(r.clay, 640, 1200, 'TONELADAS DE TIERRA', T.toneladas, C.arena, 'right'); L(r.water, 640, 560, 'MASA DE AGUA', T.masa, C.espuma, 'right'); L(r.ring, 140, 1330, 'REVESTIMIENTO', T.separadas, C.hormigon);
  title(ctx, 'INGENIERÍA BAJO EL RÍO', t, T.obra - 0.1); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.final, { dur: 2.2, top: 800, gain: 0.25 }); FX.etiqueta(k, T.toneladas); FX.etiqueta(k, T.masa); FX.etiqueta(k, T.separadas); FX.corriente(k, TB.final, TB.cierre - TB.final, 0.5); MUS.golpe(k, T.ingenieria21, { gain: 0.8, chord: ['D3', 'A3', 'D4', 'F#4'] }); } });

 // 20 · ASOMBROTECA — la cámara asciende, el río ocupa la pantalla
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.cierre, DURATION)); cross(ctx, t, [540, lerp(1030, 780, u), lerp(1.4, 1.0, u)], { mode: 'terminado', train: 1, dusk: true }); vign(ctx, 0.5);
  const a = sm(T.sigue, T.sigue + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(244,247,248,0.75)'; ctx.lineWidth = 2; const lw = 280 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 300); ctx.lineTo(540 + lw, 300); ctx.moveTo(540 - lw, 420); ctx.lineTo(540 + lw, 420); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 362, 64, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
  scrim(ctx);
 }, sfx(k) { k.play('whoosh', T.sigue, { dur: 0.8, top: 1200, gain: 0.25, minor: true }); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.asombroteca + 1.0); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['túnel', 'río', 'agua', 'inundado', 'excavar', 'máquina', 'tuneladora', 'presión', 'terreno', 'cabeza', 'corte', 'rueda', 'excava', 'material', 'transporte', 'sorprendente', 'segmentos', 'hormigón', 'anillos', 'juntas', 'sellos', 'revestido', 'estabilidad', 'trenes', 'fluyendo', 'tierra', 'ingeniería', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 260, gain: 0.02, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   // banda sonora original: misterio → tensión → revelación → energía mecánica → precisión → tensión técnica → resolución → asombro
   const Em = [['E2', 'B2', 'E3', 'G3'], ['C2', 'G2', 'C3', 'E3'], ['D2', 'A2', 'D3', 'F#3'], ['B1', 'F#2', 'B2', 'D#3']];
   const Am = [['A1', 'E2', 'A2', 'C3'], ['F1', 'C2', 'F2', 'A2'], ['G1', 'D2', 'G2', 'B2'], ['E1', 'B1', 'E2', 'G#2']];
   const DM = [['D2', 'A2', 'D3', 'F#3'], ['B1', 'F#2', 'B2', 'D3'], ['G1', 'D2', 'G2', 'B2'], ['A1', 'E2', 'A2', 'C#3']];
   MUS.epica(k, 0, TB.pregunta, { bpm: 66, chords: Em, gain: 0.9, drums: 0.2, strings: 1, ostinato: 0.3 });
   MUS.epica(k, TB.pregunta, TB.nombre, { bpm: 72, chords: Am, gain: 0.85, drums: 0.3, strings: 1, ostinato: 0.5 });
   MUS.epica(k, TB.nombre, TB.revela, { bpm: 96, chords: Am, gain: 0.85, drums: 0.75, strings: 0.8, ostinato: 0.9 });
   MUS.epica(k, TB.revela, TB.desafio, { bpm: 84, chords: DM, gain: 0.85, drums: 0.45, strings: 0.9, ostinato: 0.7 });
   MUS.epica(k, TB.desafio, TB.terminado, { bpm: 78, chords: Em, gain: 0.85, drums: 0.4, strings: 1, ostinato: 0.6 });
   MUS.epica(k, TB.terminado, T.sigue, { bpm: 76, chords: DM, gain: 1, drums: 0.5, strings: 1, ostinato: 0.6 });
   MUS.epica(k, T.sigue, DURATION, { bpm: 60, chords: [['D2', 'A2', 'D3', 'F#3']], gain: 0.9, drums: 0, strings: 1, ostinato: 0 });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
