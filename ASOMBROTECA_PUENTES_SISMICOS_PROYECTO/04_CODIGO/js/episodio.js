// =====================================================================================================
// episodio.js — «¿Cómo pueden los puentes resistir los terremotos?» · Asombroteca · PLANTILLA v1.15
// UN SOLO PUENTE (P.bridge) en todo el video: terreno → cimentaciones → pilas → apoyos → tablero → juntas → disipadores.
// El movimiento NO es decorativo: el suelo sigue P.quakeGround y la respuesta sale de osciladores P.sdof
// (aislado: T≈2,5 s, ζ≈20 % · rígido: T≈0,6 s, ζ≈5 %). Los primeros planos son zooms de cámara sobre la misma geometría.
// Arco: el puente se mueve → ¿cómo resiste? → ingeniería sísmica → el suelo se mueve → fuerzas → demanda (rígido)
// → movimiento controlado (comparación) → apoyos sísmicos → disipadores → disipación (parte → calor) → juntas
// → moverse no es fallar → controlar el movimiento → diseño para reducir daños → la ingeniería también sabe moverse.
// Datos verificados en FUENTES_Y_DECISIONES.md. Reloj = voz original. Determinista (sin Math.random).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const SEC = P.SEC;
 const C = { fondo: '#0C1720', cielo: '#25445A', hor: '#A8B1B5', horD: '#68767D', acero: '#596B77', aceroL: '#C4D0D5', caucho: '#30383C', disip: '#D9A35C', fuerza: '#FF674F', control: '#38C6D0', terreno: '#786A59', veg: '#425D50', oro: '#FFD447', blanco: '#F6F8F7' };
 const T = {
  terremoto0: wt(0, 'terremoto'), puente0: wt(0, 'puente'), moverse0: wt(0, 'moverse'), lado: wt(0, 'lado'), aun: wt(1, 'aun'), derrumbarse: wt(1, 'derrumbarse'),
  pero2: SG(2).s, como3: wt(3, 'cómo'), estructura3: wt(3, 'estructura'), miles: wt(3, 'miles'), toneladas: wt(3, 'toneladas'), resista: wt(3, 'resista'), movimiento3: wt(3, 'movimiento'),
  la4: SG(4).s, ingenieria: wt(4, 'ingeniería'), controlar4: wt(4, 'controlar'), fuerzas4: wt(4, 'fuerzas'),
  cuando5: SG(5).s, suelo: wt(5, 'suelo'), temblar: wt(5, 'temblar'), bases: wt(5, 'bases'), mueven: wt(5, 'mueven'),
  y6: SG(6).s, transmite: wt(6, 'transmite'), fuerzas6: wt(6, 'fuerzas'), columnas: wt(6, 'columnas'), estructura6: wt(6, 'estructura'),
  si7: SG(7).s, rigido7: wt(7, 'rígido'), algunas: wt(7, 'algunas'), partes7: wt(7, 'partes'), danos7: wt(7, 'daños'),
  por8: SG(8).s, modernos: wt(8, 'modernos'), deformarse: wt(8, 'deformarse'), desplazarse: wt(8, 'desplazarse'), controlada: wt(8, 'controlada'),
  algunos9: SG(9).s, apoyos: wt(9, 'apoyos'), sismicos: wt(9, 'sísmicos'), permiten9: wt(9, 'permiten'), tablero: wt(9, 'tablero'), soportes: wt(9, 'soportes'),
  otros10: SG(10).s, dispositivos10: wt(10, 'dispositivos'), disipadores: wt(10, 'disipadores'), energia10: wt(10, 'energía'),
  funcionan: SG(11).s, sorprendente: wt(11, 'sorprendente'),
  cuando12: SG(12).s, mueve12: wt(12, 'mueve'), transforman: wt(12, 'transforman'), parte12: wt(12, 'parte'), energia12: wt(12, 'energía'), calor: wt(12, 'calor'),
  reduciendo: SG(13).s, fuerzas13: wt(13, 'fuerzas'), estructura13: wt(13, 'estructura'),
  ademas: SG(14).s, juntas: wt(15, 'juntas'), espacios: wt(15, 'espacios'), desplacen: wt(15, 'desplacen'), golpearse: wt(15, 'golpearse'), inmediatamente: wt(15, 'inmediatamente'),
  pero16: SG(16).s, importante: wt(16, 'importante'),
  el17: SG(17).s, no17: wt(17, 'no'), impedir: wt(17, 'impedir'), mueva: wt(17, 'mueva'),
  es18: SG(18).s, controlar18: wt(18, 'controlar'), reducir18: wt(18, 'reducir'), danos18: wt(18, 'daños'), evitar: wt(18, 'evitar'), colapso: wt(18, 'colapso'),
  aunque: SG(19).s, ningun: wt(19, 'ningún'), diseno: wt(19, 'diseño'), garantiza: wt(19, 'garantiza'),
  estas20: SG(20).s, tecnologias: wt(20, 'tecnologías'), mejorar: wt(20, 'mejorar'), seguridad: wt(20, 'seguridad'),
  asi21: SG(21).s, gigantesco21: wt(21, 'gigantesco'), recuerda: wt(21, 'recuerda'),
  a22: SG(22).s, resistir22: wt(22, 'resistir'), no22: wt(22, 'no'), rigido22: wt(22, 'rígido'),
  sino: SG(23).s, saber: wt(23, 'saber'), moverse23: wt(23, 'moverse'),
  sigue: SG(24).s, asombroteca: wt(24, 'asombroteca'), end: A.speech_end,
 };
 const TB = { como: T.pero2 - 0.15, ing: T.la4 - 0.2, suelo: T.cuando5 - 0.2, fuerzas: T.y6 - 0.15, rigido: T.si7 - 0.15, ctrl: T.por8 - 0.15, apoyos: T.algunos9 - 0.15, disip: T.otros10 - 0.15, calor: T.cuando12 - 0.15, juntas: T.ademas - 0.15, imp: T.pero16 - 0.15, mover: T.el17 - 0.15, ctrl2: T.es18 - 0.12, diseno: T.aunque - 0.15, final: T.asi21 - 0.15, cierre: T.sigue - 0.15 };

 // ---------------- sismo (reloj = voz) y respuesta física ----------------
 // suelo: suma de senos con envolvente por pulsos; aislado: oscilador lento y amortiguado; rígido: oscilador corto y poco amortiguado.
 const Q = P.quakeGround({ t0: 0, t1: T.sigue, amp: 10, seed: 4, floor: 0, pulses: [[0.2, TB.como - 0.2, 1], [T.cuando5 + 0.3, TB.ctrl + 0.4, 1], [TB.ctrl + 0.4, TB.imp + 0.2, 0.75], [T.el17, TB.diseno + 0.5, 0.9], [T.a22, T.sigue - 0.4, 0.7]] });
 const RIG = P.sdof(Q.ag, 0.6, 0.05, 0, DURATION), ISO = P.sdof(Q.ag, 2.5, 0.2, 0, DURATION);
 let mUg = 0, mV = 0; for (let t = 0; t < DURATION; t += 1 / 60) { mUg = Math.max(mUg, Math.abs(Q.ug(t))); mV = Math.max(mV, Math.abs(ISO.vel(t))); }
 // MOVIMIENTO AMPLIFICADO PARA VISUALIZACIÓN: factores de escala de pantalla (se rotula en cada escena con sismo)
 const kG = 20 / mUg, kR = 22 / RIG.max, kI = 16 / ISO.max;
 const st = (t, mode = 'aislado') => { const ug = Q.ug(t) * kG; if (mode === 'rigido') { const up = RIG(t) * kR; return { ug, up, ud: ug + up, vel: 0 }; } const up = RIG(t) * kR * 0.3, ui = ISO(t) * kI; return { ug, up, ud: ug + up + ui, ui, vel: cl(ISO.vel(t) / mV, -1, 1) }; };
 const shaking = (t) => Q.env(t);

 // ---------------- utilidades ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const title = (ctx, s, t, t0, t1, y = 250) => pill(ctx, s, 540, y, s.length > 18 ? 52 : 60, t, t0, C.oro, C.fondo, t1);
 const tag = (ctx, s, x, y, px, a, c = 'rgba(246,248,247,0.98)') => { if (a <= 0.01) return; px = Math.max(px, 32); ctx.save(); ctx.globalAlpha *= a; ctx.font = `600 ${px}px "IBM Plex Mono"`; let L = [s];
  if (ctx.measureText(s).width + px * 1.2 > 1000) { const m = s.length / 2; let k = -1; for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (k < 0 || Math.abs(i - m) < Math.abs(k - m))) k = i; if (k > 0) L = [s.slice(0, k), s.slice(k + 1)]; }
  const lw = Math.max(...L.map((l) => ctx.measureText(l).width)); if (lw + px * 1.2 > 1020) { px *= 1000 / (lw + px * 1.2); ctx.font = `600 ${px}px "IBM Plex Mono"`; }
  const w = Math.max(...L.map((l) => ctx.measureText(l).width)) + px * 1.2, lh = px * 1.25, h = px * 0.45 + lh * L.length, x0 = Math.min(Math.max(x - w / 2, 30), 1050 - w);
  P.rr(ctx, x0, y - h / 2, w, h, px * 0.6, 'rgba(12,23,32,0.84)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; L.forEach((l, i) => ctx.fillText(l, x0 + w / 2, y + 1 + (i - (L.length - 1) / 2) * lh)); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 8; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
 const callout = (ctx, x0, y0, x1, y1, s, a, c = C.blanco, al = 'left') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = '800 38px Nunito'; const tw = ctx.measureText(s).width; let tx = al === 'left' ? x1 + 14 : x1 - 14 - tw; tx = cl(tx, 28, W - 28 - tw);
  ctx.strokeStyle = 'rgba(12,23,32,0.7)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 10, 0, TAU); ctx.fill(); P.rr(ctx, tx - 14, y1 - 30, tw + 28, 60, 30, 'rgba(12,23,32,0.86)'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, tx, y1 + 2); ctx.restore(); };
 const scrim = (ctx) => { const g = ctx.createLinearGradient(0, 1420, 0, 1760); g.addColorStop(0, 'rgba(12,23,32,0)'); g.addColorStop(0.5, 'rgba(12,23,32,0.6)'); g.addColorStop(1, 'rgba(12,23,32,0.6)'); ctx.fillStyle = g; ctx.fillRect(0, 1420, W, 500); };
 const vign = (ctx, a) => { if (a <= 0) return; const g = ctx.createRadialGradient(540, 900, 300, 540, 900, 1250); g.addColorStop(0, 'rgba(12,23,32,0)'); g.addColorStop(1, `rgba(12,23,32,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 const camPt = (cam, p) => [(p[0] - cam[0]) * cam[2] + 540, (p[1] - cam[1]) * cam[2] + 960];
 const ampTag = (ctx, t, a = 1) => tag(ctx, 'MOVIMIENTO AMPLIFICADO PARA VISUALIZACIÓN', 540, 1385, 32, a * sm(0.03, 0.15, shaking(t) + shaking(t - 0.8)), 'rgba(246,248,247,0.9)');
 const dblArrow = (ctx, x, y, half, c, a, w = 16) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; P.hArrow(ctx, x + 6, y, half, c, w); P.hArrow(ctx, x - 6, y, -half, c, w); ctx.restore(); };

 // ---------------- mundo: cielo, montañas lejanas (paralaje) y el puente ----------------
 const MT = (() => { const R = H.rng(21), a = [], b = []; for (let x = -1800; x <= 4200; x += 60) { a.push([x, 690 - 170 * Math.abs(Math.sin(x * 0.0021 + 1.3)) - 60 * Math.sin(x * 0.0067) - R.range(0, 25)]); b.push([x, 820 - 110 * Math.abs(Math.sin(x * 0.0031 + 0.4)) - 40 * Math.sin(x * 0.011) - R.range(0, 18)]); } return [a, b]; })();
 function sky(ctx, cam, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, C.fondo); g.addColorStop(0.5, C.cielo); g.addColorStop(1, '#2f5168'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  if (o.sun) P.glow(ctx, o.sun[0], o.sun[1], 700, '217,163,92', o.sun[2] ?? 0.35);
  // dos cordilleras con cámara atenuada (paralaje)
  [[0.25, '#1c3343'], [0.45, '#203b4c']].forEach(([f, c], i) => { const pc = [1200 + (cam[0] - 1200) * f, 1050 + (cam[1] - 1050) * f, Math.pow(cam[2] / 0.45, f) * 0.45]; ctx.save(); P.camApply(ctx, pc); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-1800, 2600); for (const p of MT[i]) ctx.lineTo(p[0], p[1] + 260); ctx.lineTo(4200, 2600); ctx.closePath(); ctx.fill(); ctx.restore(); });
 }
 const CARS = (t, run = 1) => [{ x: 160 + t * 34 * run, c: '#c94f4f', lane: 0.3 }, { x: 980 + t * 34 * run, c: '#3f7fb0', lane: 0.3 }, { x: 1500 - t * 30 * run, c: '#d9a35c', lane: 0.72 }, { x: 420 - t * 30 * run, c: '#e8ecef', lane: 0.72 }];
 // dibuja el mundo con la cámara cam; o: opciones de P.bridge + { mode, sun, carsRun, after(ctx, out, cam) }
 function scene(ctx, t, cam, o = {}) {
  sky(ctx, cam, o); const s = st(t, o.mode); ctx.save(); P.camApply(ctx, cam);
  const out = P.bridge(ctx, t, { mode: o.mode || 'aislado', ug: s.ug, up: s.up, ud: s.ud, section: o.section || 0, forces: o.forces || 0, demand: o.demand || 0, xray: o.xray || 0, cut: o.cut || 0, heat: o.heat || 0, vel: s.vel || 0, glow: o.glow || {}, cars: o.cars === false ? [] : CARS(t, o.carsRun ?? 1) });
  if (o.world) o.world(ctx, out, s);
  ctx.restore(); return { out, s };
 }
 // cámara que acompaña a una parte de la estructura (para ver el movimiento relativo, no el absoluto)
 const follow = (c, dx) => [c[0] + dx, c[1], c[2]];
 const GND = (x) => { const d = Math.min(x - 290, 2110 - x); if (d <= 0) return 1006; const u = Math.min(1, d / 720); return 1006 + 520 * u * u * (3 - 2 * u); };

 const zoomS = (k, t, d) => { k.play('riser', t - 0.2, { dur: d + 0.2, gain: 0.25, minor: true }); k.play('whoosh', t, { dur: d, top: 2600, gain: 0.35, minor: true }); };
 const B = [];
 // 1 · ¡EL PUENTE SE MUEVE! (plano general; el suelo empuja y el tablero responde)
 B.push({ t0: 0, t1: TB.como, draw(ctx, t) {
  const cam = P.camAt([[0, 1200, 1060, 0.47], [TB.como, 1150, 1040, 0.5]], t); const { s } = scene(ctx, t, cam);
  const dk = camPt(cam, [1200 + s.ud, 940]); dblArrow(ctx, dk[0], dk[1], 120, C.control, sm(T.lado - 0.2, T.lado + 0.3, t) * (1 - sm(T.aun, T.aun + 0.4, t)));
  title(ctx, '¡EL PUENTE SE MUEVE!', t, T.puente0 - 0.1);
  tag(ctx, '…Y NO SE DERRUMBA', 540, 370, 40, sm(T.aun, T.aun + 0.3, t), C.control);
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { FX.temblor(k, 0.3, TB.como - 0.6, 0.8); FX.trafico(k, 0, TB.como, 0.7); FX.aparece(k, T.puente0 - 0.1); FX.etiqueta(k, T.aun); MUS.golpe(k, T.derrumbarse, { gain: 0.6, chord: ['D3', 'A3', 'D4', 'F4'] }); } });

 // 2 · ¿CÓMO RESISTE? (miles de toneladas; calma)
 B.push({ t0: TB.como, t1: TB.ing, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = P.camAt([[TB.como, 1150, 1040, 0.5], [TB.ing, 1200, 1060, 0.62]], t); scene(ctx, t, cam, { carsRun: 0.4 });
  const a = sm(T.miles - 0.1, T.miles + 0.4, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; for (const x of [380, 650, 925, 1200, 1475, 1750, 2020]) { const p = camPt(cam, [x, 900]); P.forceArrow(ctx, p[0], p[1] - 120, 100 * E.out(a), -1, C.fuerza, null, { w: 16 }); } ctx.restore(); }
  tag(ctx, 'MILES DE TONELADAS', 540, 560, 44, a, C.blanco);
  title(ctx, '¿CÓMO RESISTE?', t, T.como3 - 0.1); vign(ctx, 0.4); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.como, { dur: 1.2, top: 900, gain: 0.25, minor: true }); FX.aparece(k, T.como3 - 0.1); FX.etiqueta(k, T.miles); FX.estructura(k, T.toneladas, 2, 0.5); } });

 // 3 · INGENIERÍA SÍSMICA (vista técnica: el sistema completo, cada mecanismo en su sitio)
 B.push({ t0: TB.ing, t1: TB.suelo, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = P.camAt([[TB.ing, 1200, 1060, 0.62], [T.ingenieria + 0.6, 1200, 1060, 0.48], [TB.suelo, 1200, 1080, 0.46]], t);
  const ga = sm(T.ingenieria + 0.2, T.ingenieria + 0.7, t), gb = sm(T.controlar4 - 0.3, T.controlar4, t);
  const { out } = scene(ctx, t, cam, { xray: 0.75 * ga, carsRun: 0.4, glow: { bearings: ga, dampers: sm(T.ingenieria + 0.5, T.ingenieria + 1, t), joints: sm(T.ingenieria + 0.8, T.ingenieria + 1.3, t) } });
  // rótulos de cada mecanismo sobre la geometría real
  const bp = camPt(cam, out.bearings[0].top), dp = camPt(cam, out.dampers[0].body), jp = camPt(cam, [out.joints[1].x, out.joints[1].y]);
  callout(ctx, bp[0], bp[1], bp[0] + 40, bp[1] - 190, 'APOYOS', ga, C.control);
  callout(ctx, dp[0], dp[1], dp[0] + 60, dp[1] + 170, 'DISIPADORES', sm(T.ingenieria + 0.5, T.ingenieria + 1, t), C.disip);
  callout(ctx, jp[0], jp[1], jp[0] - 40, jp[1] - 190, 'JUNTAS', sm(T.ingenieria + 0.8, T.ingenieria + 1.3, t), C.control, 'right');
  title(ctx, 'INGENIERÍA SÍSMICA', t, T.ingenieria - 0.1);
  tag(ctx, 'CONTROLAR LAS FUERZAS', 540, 370, 40, gb, C.oro); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.ing, { dur: 1.0, top: 1400, gain: 0.25, minor: true }); FX.aparece(k, T.ingenieria - 0.1); FX.etiqueta(k, T.ingenieria + 0.25); FX.etiqueta(k, T.ingenieria + 0.55); FX.etiqueta(k, T.ingenieria + 0.85); FX.etiqueta(k, T.controlar4); MUS.golpe(k, T.ingenieria, { gain: 0.6, chord: ['A2', 'E3', 'A3', 'C#4'] }); } });

 // 4 · EL SUELO SE MUEVE (corte del terreno, ondas desde el foco, las bases se desplazan)
 const waves = (ctx, cam, t, a) => { if (a <= 0) return; ctx.save(); P.camApply(ctx, cam); ctx.beginPath(); ctx.moveTo(-1400, 3200); for (let x = -1400; x <= 3800; x += 20) ctx.lineTo(x, GND(x) + 2); ctx.lineTo(3800, 3200); ctx.closePath(); ctx.clip();
  const f = [1650, 2900]; for (let i = 0; i < 6; i++) { const r = ((t * 260 + i * 330) % 1980); ctx.strokeStyle = `rgba(255,103,79,${0.55 * a * (1 - r / 1980)})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(f[0], f[1], r, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
  P.glow(ctx, f[0], f[1], 260, '255,103,79', 0.5 * a); ctx.restore(); };
 B.push({ t0: TB.suelo, t1: TB.fuerzas, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = P.camAt([[TB.suelo, 1200, 1250, 0.47], [TB.fuerzas, 1200, 1280, 0.48]], t); const sec = sm(TB.suelo, TB.suelo + 0.6, t);
  const { out, s } = scene(ctx, t, cam, { section: sec, carsRun: 0.3 });
  waves(ctx, cam, t, sec);
  const ab = sm(T.bases - 0.1, T.bases + 0.3, t); for (const p of out.piers) { const q = camPt(cam, p.base); P.glow(ctx, q[0], q[1] + 10, 110, '255,212,71', 0.5 * ab); }
  const g = camPt(cam, [1200, 1700]); dblArrow(ctx, g[0], g[1], 150, C.fuerza, sm(T.suelo, T.suelo + 0.4, t), 22);
  title(ctx, 'EL SUELO SE MUEVE', t, T.suelo - 0.1); tag(ctx, 'LAS BASES SE MUEVEN', 540, 370, 40, ab, C.oro); void s;
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { FX.temblor(k, T.cuando5 + 0.2, TB.ctrl - T.cuando5, 1); FX.aparece(k, T.suelo - 0.1); FX.etiqueta(k, T.bases); } });

 // 5 · FUERZAS SÍSMICAS (del suelo a las columnas y al tablero)
 B.push({ t0: TB.fuerzas, t1: TB.rigido, in: { type: 'cut' }, draw(ctx, t) {
  const cam = P.camAt([[TB.fuerzas, 1200, 1280, 0.48], [T.columnas, 1120, 1180, 0.52], [TB.rigido, 1100, 1160, 0.56]], t);
  scene(ctx, t, cam, { section: 1 - sm(TB.fuerzas, TB.fuerzas + 1.5, t), forces: sm(T.transmite, T.fuerzas6, t), carsRun: 0.3, glow: { piers: sm(T.columnas - 0.1, T.columnas + 0.3, t), deck: 0.8 * sm(T.estructura6 - 0.1, T.estructura6 + 0.3, t) } });
  title(ctx, 'FUERZAS SÍSMICAS', t, T.fuerzas6 - 0.1); tag(ctx, 'FUERZAS ENORMES', 540, 370, 40, sm(T.fuerzas6 + 0.3, T.fuerzas6 + 0.6, t), C.fuerza);
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { FX.aparece(k, T.fuerzas6 - 0.1); FX.etiqueta(k, T.fuerzas6 + 0.35); FX.estructura(k, T.columnas, 2, 0.6); } });

 // 6 · DEMANDA ESTRUCTURAL (si fuera completamente rígido: más fuerza en la base de las pilas)
 B.push({ t0: TB.rigido, t1: TB.ctrl, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam0 = P.camAt([[TB.rigido, 1150, 1200, 0.5], [T.algunas, 1200, 1330, 0.8], [TB.ctrl, 1200, 1360, 0.95]], t), s = st(t, 'rigido'), cam = follow(cam0, s.ug * 0.9);
  const dm = sm(T.algunas, T.danos7, t); scene(ctx, t, cam, { mode: 'rigido', demand: dm, forces: 0.8, carsRun: 0 });
  tag(ctx, 'SI FUERA COMPLETAMENTE RÍGIDO', 540, 370, 38, sm(T.si7, T.si7 + 0.3, t), C.blanco);
  title(ctx, 'DEMANDA ESTRUCTURAL', t, T.rigido7 + 0.2);
  const pb = camPt(cam, [1200 + s.ug, 1500]); callout(ctx, pb[0] + 40, pb[1], pb[0] + 150, pb[1] - 300, 'POSIBLES DAÑOS', sm(T.danos7 - 0.1, T.danos7 + 0.2, t), C.fuerza);
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.rigido, { dur: 1, top: 1000, gain: 0.25, minor: true }); FX.etiqueta(k, T.si7); FX.aparece(k, T.rigido7 + 0.2); FX.estructura(k, T.algunas, 3, 0.9); FX.etiqueta(k, T.danos7); } });

 // 7 · MOVIMIENTO CONTROLADO — comparación honesta: rígido (más fuerza) vs controlado (más desplazamiento, menos fuerza)
 const panel = (ctx, t, y0, h, mode, label, sub, col, cam) => { ctx.save(); ctx.beginPath(); ctx.rect(0, y0, W, h); ctx.clip(); ctx.translate(0, y0 + h / 2 - 960); const { s } = scene(ctx, t, cam, { mode, carsRun: 0.4, demand: mode === 'rigido' ? 0.7 : 0, glow: mode === 'aislado' ? { bearings: 0.9 } : {} }); ctx.restore();
  ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.strokeRect(22, y0 + 2, W - 44, h - 4);
  // medidor de demanda en las pilas (desplazamiento de la pila respecto a su base → fuerza en la pila)
  const dem = Math.abs(s.up) / 22, bx = 60, by = y0 + h - 70; P.rr(ctx, bx, by, 420, 34, 17, 'rgba(12,23,32,0.8)'); P.rr(ctx, bx + 4, by + 4, Math.max(26, 412 * cl(dem)), 26, 13, mode === 'rigido' ? C.fuerza : C.control);
  txt(ctx, 'DEMANDA EN PILAS', bx + 440, by + 17, 32, C.blanco, { al: 'left', w: 700 }); txt(ctx, label, 60, y0 + 50, 46, col, { al: 'left', w: 900 }); txt(ctx, sub, 60, y0 + 100, 32, C.blanco, { al: 'left', w: 700 }); };
 B.push({ t0: TB.ctrl, t1: TB.apoyos, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); const cam = [1200, 1180, 0.47];
  const a1 = sm(TB.ctrl, TB.ctrl + 0.4, t), a2 = sm(T.modernos - 0.2, T.modernos + 0.2, t);
  ctx.save(); ctx.globalAlpha *= a1; panel(ctx, t, 330, 520, 'rigido', 'MÁS RÍGIDO', 'más fuerza llega a las pilas', C.fuerza, cam); ctx.restore();
  ctx.save(); ctx.globalAlpha *= a2; panel(ctx, t, 870, 520, 'aislado', 'CONTROLADO', 'se desplaza más, con menos fuerza', C.control, cam); ctx.restore();
  title(ctx, 'MOVIMIENTO CONTROLADO', t, T.deformarse - 0.1, 0, 220);
  ampTag(ctx, t, 0); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.ctrl, { dur: 0.8, top: 1600, gain: 0.3, minor: true }); FX.aparece(k, T.modernos - 0.2, 480); FX.aparece(k, T.deformarse - 0.1); MUS.golpe(k, T.controlada, { gain: 0.6, chord: ['D3', 'A3', 'D4', 'F#4'] }); } });

 // 8 · APOYOS SÍSMICOS — zoom de cámara sobre el cabezal de la pila central (la cámara acompaña a la pila)
 B.push({ t0: TB.apoyos, t1: TB.disip, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const s = st(t), c0 = P.camAt([[TB.apoyos, 1200, 1100, 0.5], [T.apoyos + 0.3, 1200, 1095, 1.4], [T.permiten9, 1222, 1080, 4.6], [TB.disip, 1222, 1078, 4.9]], t), z = sm(TB.apoyos, T.permiten9, t), cam = follow(c0, (s.ug + s.up) * z);
  const { out } = scene(ctx, t, cam, { glow: { bearings: 0.6 * sm(T.apoyos, T.apoyos + 0.4, t) } }); const b = out.bearings[1];
  // la junta en el aislador: callouts sobre la geometría real
  const ca = sm(T.permiten9 + 0.2, T.permiten9 + 0.6, t); if (b && b.rubber) { const r = camPt(cam, b.rubber), sh = camPt(cam, b.shim), ld = camPt(cam, b.lead);
   callout(ctx, r[0], r[1], 700, 560, 'CAUCHO', ca, C.blanco); callout(ctx, sh[0], sh[1], 230, 1300, 'LÁMINAS DE ACERO', sm(T.permiten9 + 0.6, T.permiten9 + 1, t), C.aceroL); callout(ctx, ld[0], ld[1], 640, 1290, 'NÚCLEO DE PLOMO', sm(T.permiten9 + 1, T.permiten9 + 1.4, t), C.blanco); }
  const tb = camPt(cam, [1222 + s.ud, 1030]), sp = camPt(cam, [1222 + s.ug + s.up, 1120]);
  callout(ctx, tb[0] - 200, tb[1], 120, 470, 'TABLERO', sm(T.tablero - 0.1, T.tablero + 0.2, t), C.oro); callout(ctx, sp[0] - 260, sp[1], 120, 1180, 'SOPORTE', sm(T.soportes - 0.1, T.soportes + 0.2, t), C.oro);
  // desplazamiento relativo tablero–soporte
  dblArrow(ctx, 540, 700, 90, C.control, sm(T.permiten9 + 0.8, T.permiten9 + 1.2, t) * (1 - sm(T.tablero - 0.3, T.tablero, t)), 14);
  title(ctx, 'APOYOS SÍSMICOS', t, T.apoyos - 0.1); tag(ctx, 'NO TODOS LOS PUENTES LOS TIENEN', 540, 360, 34, sm(T.apoyos + 0.6, T.apoyos + 0.9, t) * (1 - sm(T.permiten9 + 0.1, T.permiten9 + 0.4, t)), C.blanco);
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { zoomS(k, T.apoyos + 0.3, 1.2); FX.aparece(k, T.apoyos - 0.1); FX.etiqueta(k, T.apoyos + 0.6); FX.etiqueta(k, T.permiten9 + 0.2); FX.etiqueta(k, T.permiten9 + 0.6); FX.etiqueta(k, T.permiten9 + 1); FX.etiqueta(k, T.tablero - 0.1); FX.etiqueta(k, T.soportes - 0.1); } });

 // 9 · DISIPADORES DE ENERGÍA — zoom al estribo izquierdo; el disipador se abre en corte
 B.push({ t0: TB.disip, t1: TB.calor, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const s = st(t), c0 = P.camAt([[TB.disip, 700, 1080, 0.7], [T.disipadores - 0.4, 210, 1070, 2.2], [T.disipadores + 0.4, 196, 1072, 4.4], [TB.calor, 196, 1072, 4.5]], t), cam = follow(c0, s.ug * sm(TB.disip, T.disipadores, t));
  const cut = sm(T.energia10, T.energia10 + 0.6, t); const { out } = scene(ctx, t, cam, { cut, glow: { dampers: 0.7 * sm(T.disipadores - 0.1, T.disipadores + 0.3, t) * (1 - cut * 0.7) } }); const d = out.dampers[0];
  if (d) { const pa = camPt(cam, d.a), pb = camPt(cam, d.piston), pf = camPt(cam, d.body), pr = camPt(cam, d.rod);
   callout(ctx, pb[0], pb[1], 640, 600, 'PISTÓN', sm(T.funcionan - 0.6, T.funcionan - 0.3, t), C.blanco); callout(ctx, pf[0], pf[1], 180, 1290, 'FLUIDO', sm(T.funcionan - 0.2, T.funcionan + 0.1, t), C.disip);
   callout(ctx, pf[0] + 30, pf[1] - 38, 130, 600, 'CÁMARA', sm(T.funcionan + 0.3, T.funcionan + 0.6, t), C.aceroL); callout(ctx, pa[0], pa[1], 160, 820, 'ANCLAJE', sm(T.funcionan + 0.8, T.funcionan + 1.1, t), C.oro);
   callout(ctx, pr[0], pr[1], 700, 1200, 'AL TABLERO', sm(T.sorprendente, T.sorprendente + 0.3, t), C.oro); }
  title(ctx, 'DISIPADORES DE ENERGÍA', t, T.disipadores - 0.1);
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { zoomS(k, T.disipadores - 0.4, 1.0); FX.aparece(k, T.disipadores - 0.1); k.play('whoosh', T.energia10, { dur: 0.6, top: 2200, gain: 0.25, minor: true }); for (const d of [-0.6, -0.2, 0.3, 0.8]) FX.etiqueta(k, T.funcionan + d); FX.hidraulico(k, T.funcionan, 2.4, 0.6); } });

 // 10 · DISIPACIÓN DE ENERGÍA — el fluido atraviesa los orificios: PARTE de la energía se convierte en calor
 const energyBar = (ctx, t, a) => { if (a <= 0) return; const p = sm(T.parte12, T.calor + 0.6, t) * 0.42; ctx.save(); ctx.globalAlpha *= a; const x = 90, y = 400, w = 900, h = 56;
  P.rr(ctx, x - 8, y - 70, w + 16, 150, 22, 'rgba(12,23,32,0.84)'); txt(ctx, 'ENERGÍA DEL MOVIMIENTO', x, y - 34, 34, C.blanco, { al: 'left', w: 800 });
  P.rr(ctx, x, y, w, h, h / 2, '#22313b'); P.rr(ctx, x, y, w * (1 - p), h, h / 2, C.control); if (p > 0.01) { P.rr(ctx, x + w * (1 - p), y, w * p, h, h / 2, '#ff8a4c'); txt(ctx, 'CALOR', x + w * (1 - p / 2), y + h / 2 + 2, 34, C.fondo, { w: 900 }); }
  txt(ctx, 'PARTE, NO TODA', x + w, y - 34, 32, '#ffb27a', { al: 'right', w: 700 }); ctx.restore(); };
 B.push({ t0: TB.calor, t1: TB.juntas, in: { type: 'cut' }, draw(ctx, t) {
  const s = st(t), c0 = P.camAt([[TB.calor, 196, 1072, 4.5], [T.reduciendo - 0.2, 214, 1068, 3.4], [T.reduciendo + 0.9, 1100, 1120, 0.52], [TB.juntas, 1150, 1120, 0.5]], t), z = 1 - sm(T.reduciendo - 0.1, T.reduciendo + 0.9, t), cam = follow(c0, s.ug * z);
  const ht = cl(0.25 + 0.75 * Math.abs(s.vel)) * sm(T.transforman - 0.4, T.calor, t);
  scene(ctx, t, cam, { cut: z, heat: ht, forces: 0.45 * sm(T.fuerzas13 - 0.2, T.fuerzas13 + 0.3, t), glow: { dampers: 0.8 * (1 - z) } });
  energyBar(ctx, t, sm(T.transforman - 0.1, T.transforman + 0.3, t) * (1 - sm(T.reduciendo + 0.4, T.reduciendo + 0.8, t)));
  title(ctx, 'DISIPACIÓN DE ENERGÍA', t, T.transforman - 0.2, 0, 230);
  tag(ctx, 'MENOS FUERZA EN LA ESTRUCTURA', 540, 400, 38, sm(T.fuerzas13, T.fuerzas13 + 0.3, t), C.control);
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { FX.hidraulico(k, T.cuando12, 2.4, 0.8); FX.hidraulico(k, T.parte12, 2.6, 0.7); FX.aparece(k, T.transforman - 0.2); FX.descubrir(k, T.calor - 0.1); k.play('whoosh', T.reduciendo - 0.1, { dur: 1.0, top: 900, gain: 0.3 }); FX.etiqueta(k, T.fuerzas13); } });

 // 11 · ESPACIO PARA MOVERSE — junta de dilatación en el estribo izquierdo (peines que se entrecruzan, sin golpearse)
 B.push({ t0: TB.juntas, t1: TB.imp, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const s = st(t), c0 = P.camAt([[TB.juntas, 1150, 1120, 0.5], [T.juntas + 0.6, 170, 1000, 3.4], [TB.imp, 170, 1000, 3.6]], t), z = sm(TB.juntas, T.juntas + 0.6, t), cam = follow(c0, s.ug * z);
  const { out } = scene(ctx, t, cam, { glow: { joints: 0.8 * sm(T.juntas, T.juntas + 0.4, t) } }); const j = out.joints[0];
  const jp = camPt(cam, [j.x, j.y]); callout(ctx, jp[0], jp[1], 600, 640, 'JUNTA DE DILATACIÓN', sm(T.juntas + 0.5, T.juntas + 0.8, t), C.control);
  // separación actual (se abre y se cierra sin llegar a cero)
  const ga = camPt(cam, [j.x - j.gap / 2, 1070]), gb = camPt(cam, [j.x + j.gap / 2, 1070]), am = sm(T.espacios, T.espacios + 0.4, t); if (am > 0) { ctx.save(); ctx.globalAlpha *= am; ctx.strokeStyle = C.control; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ga[0], ga[1] - 22); ctx.lineTo(ga[0], ga[1] + 22); ctx.moveTo(gb[0], gb[1] - 22); ctx.lineTo(gb[0], gb[1] + 22); ctx.moveTo(ga[0], ga[1]); ctx.lineTo(gb[0], gb[1]); ctx.stroke(); ctx.restore(); }
  title(ctx, 'ESPACIO PARA MOVERSE', t, T.espacios - 0.1); tag(ctx, 'SIN GOLPEARSE DE INMEDIATO', 540, 370, 38, sm(T.golpearse - 0.1, T.golpearse + 0.2, t), C.control);
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { zoomS(k, TB.juntas + 0.1, 1.0); FX.etiqueta(k, T.juntas + 0.5); FX.aparece(k, T.espacios - 0.1); FX.metal(k, T.desplacen, 0.6); FX.metal(k, T.golpearse + 0.4, 0.5); FX.etiqueta(k, T.golpearse - 0.1); } });

 // 12 · «Pero aquí viene lo más importante» (calma, plano general)
 B.push({ t0: TB.imp, t1: TB.mover, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = P.camAt([[TB.imp, 1200, 1060, 0.48], [TB.mover, 1200, 1050, 0.47]], t); scene(ctx, t, cam, { carsRun: 0.6 }); vign(ctx, 0.55);
  title(ctx, 'LO MÁS IMPORTANTE', t, T.importante - 0.2); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.imp, { dur: 1.2, top: 800, gain: 0.25 }); FX.aparece(k, T.importante - 0.2, 440); } });

 // 13 · ¡MOVERSE NO ES FALLAR!
 B.push({ t0: TB.mover, t1: TB.ctrl2, in: { type: 'cut' }, draw(ctx, t) {
  const cam = P.camAt([[TB.mover, 1200, 1050, 0.47], [TB.ctrl2, 1180, 1060, 0.55]], t); const { s } = scene(ctx, t, cam, { glow: { bearings: 0.8, deck: 0.5 } });
  const dk = camPt(cam, [1200 + s.ud, 930]); dblArrow(ctx, dk[0], dk[1], 120, C.control, sm(T.impedir, T.impedir + 0.3, t));
  title(ctx, '¡MOVERSE NO ES FALLAR!', t, T.no17 - 0.1); ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { FX.temblor(k, T.el17, TB.diseno - T.el17, 0.7); FX.aparece(k, T.no17 - 0.1); MUS.golpe(k, T.no17, { gain: 0.7, chord: ['D3', 'A3', 'D4', 'F#4'] }); } });

 // 14 · CONTROLAR EL MOVIMIENTO (reducir daños, evitar el colapso)
 B.push({ t0: TB.ctrl2, t1: TB.diseno, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = P.camAt([[TB.ctrl2, 1180, 1060, 0.55], [TB.diseno, 900, 1080, 0.8]], t); scene(ctx, t, cam, { glow: { bearings: 0.8, dampers: 0.8, joints: 0.8 } });
  title(ctx, 'CONTROLAR EL MOVIMIENTO', t, T.controlar18 - 0.1);
  tag(ctx, 'REDUCIR DAÑOS', 540, 380, 40, sm(T.reducir18, T.reducir18 + 0.3, t), C.control); tag(ctx, 'EVITAR EL COLAPSO', 540, 470, 40, sm(T.evitar, T.evitar + 0.3, t), C.oro);
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { FX.aparece(k, T.controlar18 - 0.1); FX.etiqueta(k, T.reducir18); FX.etiqueta(k, T.evitar); } });

 // 15 · DISEÑO PARA REDUCIR DAÑOS (honestidad: ningún diseño es infalible; sí mejora la seguridad)
 B.push({ t0: TB.diseno, t1: TB.final, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = P.camAt([[TB.diseno, 1200, 1080, 0.46], [TB.final, 1200, 1060, 0.47]], t); const x = sm(TB.diseno, TB.diseno + 0.8, t);
  scene(ctx, t, cam, { xray: 0.7 * x, glow: { bearings: x, dampers: x, joints: x, piers: 0.5 * x }, carsRun: 0.6 });
  title(ctx, 'DISEÑO PARA REDUCIR DAÑOS', t, T.diseno - 0.1);
  tag(ctx, 'NINGÚN DISEÑO ES INFALIBLE', 540, 370, 40, sm(T.garantiza, T.garantiza + 0.3, t), C.blanco);
  tag(ctx, 'PUEDE MEJORAR MUCHO LA SEGURIDAD', 540, 460, 38, sm(T.mejorar, T.mejorar + 0.3, t), C.control);
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.diseno, { dur: 1, top: 1400, gain: 0.25, minor: true }); FX.aparece(k, T.diseno - 0.1); FX.etiqueta(k, T.garantiza); FX.etiqueta(k, T.mejorar); } });

 // 16 · LA INGENIERÍA TAMBIÉN SABE MOVERSE (atardecer; el puente sigue en servicio)
 B.push({ t0: TB.final, t1: TB.cierre, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  const cam = P.camAt([[TB.final, 1500, 1040, 0.62], [T.a22, 1250, 1060, 0.48], [TB.cierre, 1200, 1060, 0.48]], t); const { s } = scene(ctx, t, cam, { sun: [820, 640, 0.45], glow: { bearings: 0.5 * sm(T.a22, T.a22 + 1, t) } });
  tag(ctx, 'NO SIEMPRE: RÍGIDO', 540, 380, 40, sm(T.rigido22 - 0.6, T.rigido22, t) * (1 - sm(T.sino - 0.2, T.sino, t)), C.blanco);
  const a = sm(T.saber - 0.2, T.saber + 0.4, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; txt(ctx, 'LA INGENIERÍA', 540, 330, 66, C.blanco, { w: 900 }); txt(ctx, 'TAMBIÉN SABE MOVERSE', 540, 410, 66, C.oro, { w: 900 }); ctx.restore(); }
  const dk = camPt(cam, [1200 + s.ud, 930]); dblArrow(ctx, dk[0], dk[1], 110, C.control, sm(T.moverse23 - 0.2, T.moverse23 + 0.2, t));
  ampTag(ctx, t); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.final, { dur: 1.6, top: 900, gain: 0.25 }); FX.trafico(k, TB.final, T.a22 - TB.final, 0.6); FX.temblor(k, T.a22, T.sigue - T.a22 - 0.4, 0.5); FX.etiqueta(k, T.rigido22 - 0.6); FX.descubrir(k, T.saber - 0.2); MUS.golpe(k, T.moverse23, { gain: 0.8, chord: ['D3', 'A3', 'D4', 'F#4'] }); } });

 // 17 · ASOMBROTECA (único rótulo de marca, discreto, al final)
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = [1200, 1060, 0.48]; scene(ctx, t, cam, { sun: [820, 640, 0.45] }); vign(ctx, 0.6);
  const a = sm(T.sigue, T.sigue + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(246,248,247,0.75)'; ctx.lineWidth = 2; const lw = 280 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 300); ctx.lineTo(540 + lw, 300); ctx.moveTo(540 - lw, 420); ctx.lineTo(540 + lw, 420); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 362, 64, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
  scrim(ctx);
 }, sfx(k) { k.play('whoosh', T.sigue, { dur: 0.8, top: 1200, gain: 0.25, minor: true }); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.asombroteca + 1.0); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['terremoto', 'puente', 'moverse', 'derrumbarse', 'toneladas', 'ingeniería', 'controlar', 'fuerzas', 'suelo', 'temblar', 'columnas', 'rígido', 'daños', 'controlada', 'apoyos', 'sísmicos', 'tablero', 'disipadores', 'energía', 'calor', 'juntas', 'espacios', 'golpearse', 'importante', 'colapso', 'ningún', 'seguridad', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 420, q: 0.7, gain: 0.018, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   // banda sonora original: tensión contenida (sin sonidos de catástrofe), que se vuelve luminosa al llegar al «control»
   const Dm = [['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3'], ['C2', 'G2', 'C3', 'E3'], ['A1', 'E2', 'A2', 'C#3']];
   const DM = [['D2', 'A2', 'D3', 'F#3'], ['B1', 'F#2', 'B2', 'D3'], ['G1', 'D2', 'G2', 'B2'], ['A1', 'E2', 'A2', 'C#3']];
   MUS.epica(k, 0, TB.como, { bpm: 84, chords: Dm, gain: 0.9, drums: 0.5, strings: 0.9, ostinato: 0.7 });
   MUS.epica(k, TB.como, TB.suelo, { bpm: 70, chords: Dm, gain: 0.8, drums: 0.15, strings: 1, ostinato: 0.3 });
   MUS.epica(k, TB.suelo, TB.ctrl, { bpm: 92, chords: Dm, gain: 0.85, drums: 0.6, strings: 0.8, ostinato: 0.9 });
   MUS.epica(k, TB.ctrl, TB.juntas, { bpm: 84, chords: DM, gain: 0.85, drums: 0.4, strings: 0.9, ostinato: 0.7 });
   MUS.epica(k, TB.juntas, TB.mover, { bpm: 76, chords: DM, gain: 0.8, drums: 0.25, strings: 1, ostinato: 0.4 });
   MUS.epica(k, TB.mover, TB.final, { bpm: 88, chords: DM, gain: 0.9, drums: 0.6, strings: 1, ostinato: 0.8 });
   MUS.epica(k, TB.final, T.sigue, { bpm: 76, chords: DM, gain: 1, drums: 0.5, strings: 1, ostinato: 0.6 });
   MUS.epica(k, T.sigue, DURATION, { bpm: 60, chords: [['D2', 'A2', 'D3', 'F#3']], gain: 0.9, drums: 0, strings: 1, ostinato: 0 });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
