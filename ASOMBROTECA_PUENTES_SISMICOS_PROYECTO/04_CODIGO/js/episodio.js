// =====================================================================================================
// episodio.js — «¿Cómo pueden los puentes resistir los terremotos?» · Asombroteca · PLANTILLA v1.15.1 · V2 (supervisión cinematográfica)
// UN SOLO PUENTE (P.bridge) visto desde varias cámaras con profundidad variable (tres cuartos, lateral, bajo el tablero),
// más primeros planos de las MISMAS piezas a escala de detalle (P.isolatorHD, P.damperHD), la vista desde la calzada (P.roadView)
// y el corte transversal por una pila (P.bridgeSection).
// Física: suelo P.quakeGround (pulsos al ritmo del guion) → respuesta P.sdof. Aislado: T≈2,5 s, ζ≈20 % (el tablero se desplaza
// sobre los aisladores y la pila recibe una fuerza ∝ deformación del aislador). Rígido: T≈0,6 s, ζ≈5 % (la pila se flexiona).
// Datos verificados en FUENTES_Y_DECISIONES.md. Reloj = voz original. Determinista (sin aleatoriedad del navegador).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const C = { fondo: '#0C1720', cielo: '#25445A', hor: '#A8B1B5', horD: '#68767D', acero: '#596B77', aceroL: '#C4D0D5', caucho: '#30383C', disip: '#D9A35C', fuerza: '#FF674F', control: '#38C6D0', terreno: '#786A59', veg: '#425D50', oro: '#FFD447', blanco: '#F6F8F7', plomo: '#B2BAC0' };
 const T = {
  terremoto0: wt(0, 'terremoto'), puente0: wt(0, 'puente'), moverse0: wt(0, 'moverse'), lado: wt(0, 'lado'), aun: wt(1, 'aun'), derrumbarse: wt(1, 'derrumbarse'),
  pero2: SG(2).s, como3: wt(3, 'cómo'), miles: wt(3, 'miles'), toneladas: wt(3, 'toneladas'), resista: wt(3, 'resista'),
  la4: SG(4).s, ingenieria: wt(4, 'ingeniería'), controlar4: wt(4, 'controlar'), fuerzas4: wt(4, 'fuerzas'),
  cuando5: SG(5).s, suelo: wt(5, 'suelo'), temblar: wt(5, 'temblar'), bases: wt(5, 'bases'), mueven: wt(5, 'mueven'),
  y6: SG(6).s, transmite: wt(6, 'transmite'), fuerzas6: wt(6, 'fuerzas'), columnas: wt(6, 'columnas'), estructura6: wt(6, 'estructura'),
  si7: SG(7).s, rigido7: wt(7, 'rígido'), algunas: wt(7, 'algunas'), partes7: wt(7, 'partes'), danos7: wt(7, 'daños'),
  por8: SG(8).s, modernos: wt(8, 'modernos'), deformarse: wt(8, 'deformarse'), desplazarse: wt(8, 'desplazarse'), controlada: wt(8, 'controlada'),
  algunos9: SG(9).s, apoyos: wt(9, 'apoyos'), sismicos: wt(9, 'sísmicos'), especiales: wt(9, 'especiales'), permiten9: wt(9, 'permiten'), movimiento9: wt(9, 'movimiento'), tablero: wt(9, 'tablero'), soportes: wt(9, 'soportes'),
  otros10: SG(10).s, dispositivos10: wt(10, 'dispositivos'), disipadores: wt(10, 'disipadores'), energia10: wt(10, 'energía'),
  funcionan: SG(11).s, sorprendente: wt(11, 'sorprendente'),
  cuando12: SG(12).s, mueve12: wt(12, 'mueve'), transforman: wt(12, 'transforman'), parte12: wt(12, 'parte'), energia12: wt(12, 'energía'), calor: wt(12, 'calor'),
  reduciendo: SG(13).s, fuerzas13: wt(13, 'fuerzas'), estructura13: wt(13, 'estructura'),
  ademas: SG(14).s, juntas: wt(15, 'juntas'), espacios: wt(15, 'espacios'), permiten15: wt(15, 'permiten'), desplacen: wt(15, 'desplacen'), golpearse: wt(15, 'golpearse'), inmediatamente: wt(15, 'inmediatamente'),
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
 const TB = { como: T.pero2 - 0.15, ing: T.la4 - 0.2, suelo: T.cuando5 - 0.2, fuerzas: T.y6 - 0.15, rigido: T.si7 - 0.15, ctrl: T.por8 - 0.15, apoyos: T.algunos9 - 0.15, apoyosHD: T.apoyos + 0.1, disip: T.otros10 - 0.15, disipHD: T.disipadores - 0.1, calor: T.cuando12 - 0.15, vuelta: T.reduciendo - 0.1, juntas: T.ademas - 0.15, juntaCU: T.golpearse - 0.15, imp: T.pero16 - 0.15, mover: T.el17 - 0.15, ctrl2: T.es18 - 0.12, diseno: T.aunque - 0.15, final: T.asi21 - 0.15, final2: T.a22 - 0.2, cierre: T.sigue - 0.15 };

 // ---------------- sismo de referencia (reloj = voz) y respuesta física ----------------
 // calma entre 39 y 42 s para enseñar el aislador sin deformar; el mismo sismo alimenta todas las escenas y la comparación.
 const Q = P.quakeGround({ t0: 0, t1: T.sigue, amp: 10, seed: 4, floor: 0, pulses: [[0.2, TB.como - 0.2, 1], [T.cuando5 + 0.3, TB.apoyos - 0.6, 1], [T.permiten9 + 0.2, TB.imp + 0.2, 0.8], [T.el17, TB.diseno + 0.5, 0.9], [T.a22, T.sigue - 0.4, 0.7]] });
 const RIG = P.sdof(Q.ag, 0.6, 0.05, 0, DURATION), ISO = P.sdof(Q.ag, 2.5, 0.2, 0, DURATION);
 let mUg = 0, mV = 0; for (let t = 0; t < DURATION; t += 1 / 60) { mUg = Math.max(mUg, Math.abs(Q.ug(t))); mV = Math.max(mV, Math.abs(ISO.vel(t))); }
 // MOVIMIENTO AMPLIFICADO PARA VISUALIZACIÓN: factores de escala de pantalla (se rotula al inicio de cada escena con sismo)
 const kG = 20 / mUg, kR = 14 / RIG.max, kI = 15 / ISO.max;
 // aislado: la pila recibe la fuerza del aislador (∝ su deformación) → deriva pequeña; rígido: la pila sigue al oscilador corto
 const st = (t, mode = 'aislado') => { const ug = Q.ug(t) * kG; if (mode === 'rigido') { const up = RIG(t) * kR; return { ug, up, ud: ug + up, ui: 0, vel: 0 }; } const ui = ISO(t) * kI, up = ui * 0.22; return { ug, up, ud: ug + up + ui, ui, vel: cl(ISO.vel(t) / mV, -1, 1) }; };
 const shaking = (t) => Q.env(t);

 // ---------------- utilidades de texto y gráficos ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const title = (ctx, s, t, t0, t1, y = 250) => pill(ctx, s, 540, y, s.length > 18 ? 52 : 60, t, t0, C.oro, C.fondo, t1);
 const tag = (ctx, s, x, y, px, a, c = 'rgba(246,248,247,0.98)') => { if (a <= 0.01) return; px = Math.max(px, 32); ctx.save(); ctx.globalAlpha *= a; ctx.font = `600 ${px}px "IBM Plex Mono"`; let L = [s];
  if (ctx.measureText(s).width + px * 1.2 > 1000) { const m = s.length / 2; let k = -1; for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (k < 0 || Math.abs(i - m) < Math.abs(k - m))) k = i; if (k > 0) L = [s.slice(0, k), s.slice(k + 1)]; }
  const lw = Math.max(...L.map((l) => ctx.measureText(l).width)); if (lw + px * 1.2 > 1000) { px *= 980 / (lw + px * 1.2); ctx.font = `600 ${px}px "IBM Plex Mono"`; }
  const w = Math.max(...L.map((l) => ctx.measureText(l).width)) + px * 1.2, lh = px * 1.25, h = px * 0.45 + lh * L.length, x0 = Math.min(Math.max(x - w / 2, 40), 1040 - w);
  P.rr(ctx, x0, y - h / 2, w, h, px * 0.6, 'rgba(12,23,32,0.86)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; L.forEach((l, i) => ctx.fillText(l, x0 + w / 2, y + 1 + (i - (L.length - 1) / 2) * lh)); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 8; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
 // rótulo con línea de llamada: punto sobre la pieza real → etiqueta dentro de los márgenes seguros (40..1040)
 const callout = (ctx, x0, y0, x1, y1, s, a, c = C.blanco, al = 'left') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = '800 40px Nunito'; const tw = ctx.measureText(s).width; let tx = al === 'left' ? x1 + 14 : x1 - 14 - tw; tx = cl(tx, 56, W - 56 - tw);
  ctx.strokeStyle = 'rgba(12,23,32,0.75)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 10, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(12,23,32,0.9)'; ctx.lineWidth = 3; ctx.stroke(); P.rr(ctx, tx - 16, y1 - 32, tw + 32, 64, 32, 'rgba(12,23,32,0.88)'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, tx, y1 + 2); ctx.restore(); };
 const scrim = (ctx) => { const g = ctx.createLinearGradient(0, 1420, 0, 1760); g.addColorStop(0, 'rgba(12,23,32,0)'); g.addColorStop(0.5, 'rgba(12,23,32,0.6)'); g.addColorStop(1, 'rgba(12,23,32,0.6)'); ctx.fillStyle = g; ctx.fillRect(0, 1420, W, 500); };
 const vign = (ctx, a) => { if (a <= 0) return; const g = ctx.createRadialGradient(540, 900, 300, 540, 900, 1250); g.addColorStop(0, 'rgba(12,23,32,0)'); g.addColorStop(1, `rgba(12,23,32,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 const camPt = (cam, p) => [(p[0] - cam[0]) * cam[2] + 540, (p[1] - cam[1]) * cam[2] + 960];
 // rótulo de amplificación: solo con sismo y solo los primeros segundos de cada plano (no compite con la narración)
 const ampTag = (ctx, t, t0) => tag(ctx, 'MOVIMIENTO AMPLIFICADO PARA VISUALIZACIÓN', 540, 1385, 32, sm(0.05, 0.2, shaking(t)) * sm(t0, t0 + 0.4, t) * (1 - sm(t0 + 3.2, t0 + 3.8, t)), 'rgba(246,248,247,0.9)');
 const dblArrow = (ctx, x, y, half, c, a, w = 18) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; P.hArrow(ctx, x + 8, y, half, c, w); P.hArrow(ctx, x - 8, y, -half, c, w); ctx.restore(); };
 const zoomS = (k, t, d) => { k.play('riser', t - 0.2, { dur: d + 0.2, gain: 0.22, minor: true }); k.play('whoosh', t, { dur: d, top: 2600, gain: 0.32, minor: true }); };

 // ---------------- mundo: cielo, montañas con paralaje y el puente con cámara de profundidad variable ----------------
 const MT = (() => { const R = H.rng(21), a = [], b = []; for (let x = -1800; x <= 4200; x += 60) { a.push([x, 690 - 170 * Math.abs(Math.sin(x * 0.0021 + 1.3)) - 60 * Math.sin(x * 0.0067) - R.range(0, 25)]); b.push([x, 820 - 110 * Math.abs(Math.sin(x * 0.0031 + 0.4)) - 40 * Math.sin(x * 0.011) - R.range(0, 18)]); } return [a, b]; })();
 function sky(ctx, cam, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, C.fondo); g.addColorStop(0.45, C.cielo); g.addColorStop(1, '#2f5168'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  if (o.sun) { const sg = ctx.createLinearGradient(0, 300, 0, 900); sg.addColorStop(0, 'rgba(217,163,92,0)'); sg.addColorStop(1, `rgba(217,163,92,${0.35 * o.sun[2]})`); ctx.fillStyle = sg; ctx.fillRect(0, 300, W, 600); P.glow(ctx, o.sun[0], o.sun[1], 640, '217,163,92', 0.45 * o.sun[2]); }
  [[0.2, '#1c3343'], [0.4, '#203b4c']].forEach(([f, c], i) => { const pc = [1200 + (cam[0] - 1200) * f, 1000 + (cam[1] - 1000) * f, Math.pow(cam[2] / 0.5, f) * 0.5]; ctx.save(); P.camApply(ctx, pc); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-1800, 2600); for (const p of MT[i]) ctx.lineTo(p[0], p[1] + 160 - i * 40); ctx.lineTo(4200, 2600); ctx.closePath(); ctx.fill(); ctx.restore(); });
 }
 // cámara con profundidad: claves [t, x, y, zoom, Dx, Dy]; D es la dirección de profundidad del puente (vista lateral ↔ tres cuartos)
 const shot = (keys, t) => { const c = P.camAt(keys.map((k) => [k[0], k[1], k[2], k[3]]), t); let D = keys[0].slice(4, 6); for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t >= a[0] && t <= b[0]) { const u = E.inOut(win(t, a[0], b[0])); D = [lerp(a[4], b[4], u), lerp(a[5], b[5], u)]; } } if (t > keys[keys.length - 1][0]) D = keys[keys.length - 1].slice(4, 6); return { cam: c, D }; };
 const TQ = [150, -105], SIDE = [44, -30], LOW = [80, -14], MID = [100, -70];
 const CARS = (t, run = 1) => [{ x: 160 + t * 34 * run, c: '#c94f4f', lane: 0.28 }, { x: 980 + t * 34 * run, c: '#3f7fb0', lane: 0.28 }, { x: 1500 - t * 30 * run, c: '#d9a35c', lane: 0.7 }, { x: 420 - t * 30 * run, c: '#e8ecef', lane: 0.7 }];
 function scene(ctx, t, sh, o = {}) {
  const cam = sh.cam; sky(ctx, cam, o); const s = st(t, o.mode); ctx.save(); P.camApply(ctx, cam);
  const out = P.bridge(ctx, t, { D: sh.D, mode: o.mode || 'aislado', ug: s.ug, up: s.up, ud: s.ud, section: o.section || 0, forces: o.forces || 0, demand: o.demand || 0, xray: o.xray || 0, cut: o.cut || 0, heat: o.heat || 0, vel: s.vel || 0, glow: o.glow || {}, cars: o.cars === false ? [] : CARS(t, o.carsRun ?? 1) });
  if (o.world) o.world(ctx, out, s);
  ctx.restore(); return { out, s, cam };
 }
 const GND = (x) => { const d = Math.min(x - 290, 2110 - x); if (d <= 0) return 1006; const u = Math.min(1, d / 720), b = 1006 + 520 * u * u * (3 - 2 * u); return d < 40 ? lerp(1006, 1242, d / 40) : Math.max(b, 1242); };

 const B = [];
 // 1 · ¡EL PUENTE SE MUEVE! — primer plano del cabezal (el tablero oscila sobre sus apoyos) → plano general de tres cuartos (escala)
 B.push({ t0: 0, t1: TB.como, draw(ctx, t) {
  const sh = shot([[0, 1262, 1062, 2.3, ...TQ], [1.4, 1262, 1066, 2.0, ...TQ], [4.4, 1260, 1180, 0.56, ...TQ], [TB.como, 1240, 1170, 0.6, ...TQ]], t); const { s, cam } = scene(ctx, t, sh, { glow: { bearings: 0.6 * (1 - sm(3, 4.2, t)) } });
  const dk = camPt(cam, [1200 + s.ud + TQ[0] * 0.5, 960 + TQ[1] * 0.5]); dblArrow(ctx, dk[0], dk[1] - 70, 140, C.control, sm(T.lado - 0.2, T.lado + 0.3, t) * (1 - sm(T.aun, T.aun + 0.4, t)), 20);
  title(ctx, '¡EL PUENTE SE MUEVE!', t, T.puente0 - 0.1);
  tag(ctx, '…Y NO SE DERRUMBA', 540, 370, 42, sm(T.aun, T.aun + 0.3, t), C.control);
  ampTag(ctx, t, 0.3); scrim(ctx);
 }, sfx(k) { FX.temblor(k, 0.3, TB.como - 0.6, 0.8); FX.trafico(k, 0, TB.como, 0.7); FX.estructura(k, 1.2, 2, 0.35); FX.aparece(k, T.puente0 - 0.1); k.play('whoosh', 1.6, { dur: 2.6, top: 700, gain: 0.25 }); FX.etiqueta(k, T.aun); MUS.golpe(k, T.derrumbarse, { gain: 0.6, chord: ['D3', 'A3', 'D4', 'F4'] }); } });

 // 2 · ¿CÓMO RESISTE? — órbita lenta de tres cuartos; el peso de miles de toneladas
 B.push({ t0: TB.como, t1: TB.ing, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const sh = shot([[TB.como, 1240, 1170, 0.6, ...TQ], [TB.ing, 1180, 1150, 0.66, ...MID]], t); const { cam } = scene(ctx, t, sh, { carsRun: 0.4 });
  const a = sm(T.miles - 0.1, T.miles + 0.4, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; for (const x of [420, 650, 925, 1200, 1475, 1750, 1980]) { const p = camPt(cam, [x + sh.D[0] * 0.5, 990 + sh.D[1] * 0.5]); P.forceArrow(ctx, p[0], p[1] - 140, 110 * E.out(a), -1, C.fuerza, null, { w: 18 }); } ctx.restore(); }
  tag(ctx, 'MILES DE TONELADAS', 540, 380, 46, a, C.blanco);
  title(ctx, '¿CÓMO RESISTE?', t, T.como3 - 0.1); vign(ctx, 0.35); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.como, { dur: 1.2, top: 900, gain: 0.25, minor: true }); FX.aparece(k, T.como3 - 0.1); FX.etiqueta(k, T.miles); FX.estructura(k, T.toneladas, 2, 0.5); } });

 // 3 · INGENIERÍA SÍSMICA — rayos X de tres cuartos: cada mecanismo en su sitio
 B.push({ t0: TB.ing, t1: TB.suelo, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const sh = shot([[TB.ing, 1180, 1150, 0.66, ...MID], [T.ingenieria + 0.6, 1200, 1130, 0.55, ...TQ], [TB.suelo, 1200, 1140, 0.57, ...TQ]], t);
  const ga = sm(T.ingenieria + 0.2, T.ingenieria + 0.7, t), gd = sm(T.ingenieria + 0.5, T.ingenieria + 1, t), gj = sm(T.ingenieria + 0.8, T.ingenieria + 1.3, t);
  const { out, cam } = scene(ctx, t, sh, { xray: 0.7 * ga, carsRun: 0.4, glow: { bearings: ga, dampers: gd, joints: gj } });
  const bp = camPt(cam, out.bearings[1].top), dp = camPt(cam, out.dampers[0].body), jp = camPt(cam, [out.joints[1].x + sh.D[0] * 0.5, out.joints[1].y + sh.D[1] * 0.5]);
  callout(ctx, bp[0], bp[1], bp[0] - 60, bp[1] + 260, 'APOYOS', ga, C.control, 'right');
  callout(ctx, dp[0], dp[1], dp[0] + 40, dp[1] + 330, 'DISIPADORES', gd, C.disip);
  callout(ctx, jp[0], jp[1], jp[0] - 60, jp[1] - 200, 'JUNTAS', gj, C.control, 'right');
  title(ctx, 'INGENIERÍA SÍSMICA', t, T.ingenieria - 0.1);
  tag(ctx, 'CONTROLAR LAS FUERZAS', 540, 370, 42, sm(T.controlar4 - 0.3, T.controlar4, t), C.oro); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.ing, { dur: 1.0, top: 1400, gain: 0.25, minor: true }); FX.aparece(k, T.ingenieria - 0.1); FX.etiqueta(k, T.ingenieria + 0.25); FX.etiqueta(k, T.ingenieria + 0.55); FX.etiqueta(k, T.ingenieria + 0.85); FX.etiqueta(k, T.controlar4); MUS.golpe(k, T.ingenieria, { gain: 0.6, chord: ['A2', 'E3', 'A3', 'C#4'] }); } });

 // 4 · EL SUELO SE MUEVE — plano lateral con corte del terreno: ondas desde el foco, las bases se desplazan con el suelo
 const waves = (ctx, cam, t, a) => { if (a <= 0) return; ctx.save(); P.camApply(ctx, cam); ctx.beginPath(); ctx.moveTo(-1400, 3200); for (let x = -1400; x <= 3800; x += 20) ctx.lineTo(x, GND(x) + 2); ctx.lineTo(3800, 3200); ctx.closePath(); ctx.clip();
  const f = [1650, 2700]; for (let i = 0; i < 6; i++) { const r = ((t * 260 + i * 330) % 1980); ctx.strokeStyle = `rgba(255,103,79,${0.6 * a * (1 - r / 1980)})`; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(f[0], f[1], r, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
  P.glow(ctx, f[0], f[1], 260, '255,103,79', 0.5 * a); ctx.restore(); };
 B.push({ t0: TB.suelo, t1: TB.fuerzas, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const sh = shot([[TB.suelo, 1200, 1330, 0.52, ...SIDE], [TB.fuerzas, 1200, 1360, 0.56, ...SIDE]], t), sec = sm(TB.suelo, TB.suelo + 0.6, t);
  const { out, cam } = scene(ctx, t, sh, { section: sec, carsRun: 0.3 });
  waves(ctx, cam, t, sec);
  const ab = sm(T.bases - 0.1, T.bases + 0.3, t); for (const p of out.piers) { const q = camPt(cam, p.base); P.glow(ctx, q[0], q[1] + 10, 120, '255,212,71', 0.55 * ab); }
  const g = camPt(cam, [1200, 1800]); dblArrow(ctx, g[0], g[1], 170, C.fuerza, sm(T.suelo, T.suelo + 0.4, t), 24);
  title(ctx, 'EL SUELO SE MUEVE', t, T.suelo - 0.1); tag(ctx, 'LAS BASES SE MUEVEN CON ÉL', 540, 370, 40, ab, C.oro);
  ampTag(ctx, t, TB.suelo); scrim(ctx);
 }, sfx(k) { FX.temblor(k, T.cuando5 + 0.2, TB.apoyos - T.cuando5 - 0.6, 1); FX.aparece(k, T.suelo - 0.1); FX.etiqueta(k, T.bases); } });

 // 5 · FUERZAS SÍSMICAS — corte transversal por una pila: el camino de cargas del suelo al tablero
 B.push({ t0: TB.fuerzas, t1: TB.rigido, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, C.fondo); g.addColorStop(1, '#2f5168'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const s = st(t), K = 2.2, zs = 1 + 0.05 * win(t, TB.fuerzas, TB.rigido); ctx.save(); ctx.translate(540, 1300); ctx.scale(zs, zs); ctx.translate(-540, -1300);
  const p = P.bridgeSection(ctx, 540, 1300, 125, t, { ug: s.ug * K, up: s.up * K * 2.2, ud: s.ud * K, flow: sm(T.transmite, T.fuerzas6 + 0.4, t), hl: { column: 0.9 * sm(T.columnas - 0.1, T.columnas + 0.3, t), deck: 0.9 * sm(T.estructura6 - 0.1, T.estructura6 + 0.3, t), foundation: 0.7 * sm(TB.fuerzas, TB.fuerzas + 0.5, t) * (1 - sm(T.transmite, T.transmite + 0.5, t)) } }); ctx.restore();
  const P2 = (q) => [540 + (q[0] - 540) * zs, 1300 + (q[1] - 1300) * zs];
  callout(ctx, ...P2(p.footing), 860, 1250, 'CIMENTACIÓN', sm(TB.fuerzas + 0.2, TB.fuerzas + 0.5, t), C.blanco, 'right');
  callout(ctx, ...P2(p.column), 820, 900, 'COLUMNA', sm(T.columnas - 0.1, T.columnas + 0.2, t), C.oro);
  callout(ctx, ...P2(p.bearing), 860, 560, 'APOYOS', sm(T.columnas + 0.2, T.columnas + 0.5, t), C.control, 'right');
  callout(ctx, ...P2(p.girder), 200, 470, 'TABLERO', sm(T.estructura6 - 0.1, T.estructura6 + 0.2, t), C.oro);
  title(ctx, 'FUERZAS SÍSMICAS', t, T.fuerzas6 - 0.1); tag(ctx, 'CORTE TRANSVERSAL POR UNA PILA', 540, 370, 34, sm(TB.fuerzas, TB.fuerzas + 0.4, t) * (1 - sm(T.fuerzas6 - 0.3, T.fuerzas6, t)), C.blanco);
  tag(ctx, 'FUERZAS ENORMES', 540, 370, 40, sm(T.fuerzas6 + 0.3, T.fuerzas6 + 0.6, t), C.fuerza);
  ampTag(ctx, t, TB.fuerzas); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.fuerzas, { dur: 0.8, top: 1600, gain: 0.25, minor: true }); FX.etiqueta(k, TB.fuerzas + 0.2); FX.aparece(k, T.fuerzas6 - 0.1); FX.etiqueta(k, T.fuerzas6 + 0.35); FX.estructura(k, T.columnas, 2, 0.6); FX.etiqueta(k, T.columnas + 0.2); FX.etiqueta(k, T.estructura6); } });

 // 6 · DEMANDA ESTRUCTURAL — escenario A (más rígido, apoyos fijos): la pila se flexiona y la base recibe más fuerza
 const baseForce = (ctx, q, up, a, scale = 12) => { if (a <= 0.01) return; const s = Math.sign(up || 1), L = 30 + Math.abs(up) * scale; ctx.save(); ctx.globalAlpha *= a; P.hArrow(ctx, q[0] - s * (L + 60), q[1] - 40, s * L, C.fuerza, 22); ctx.restore(); };
 B.push({ t0: TB.rigido, t1: TB.ctrl, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const sh = shot([[TB.rigido, 1200, 1250, 0.62, ...MID], [T.algunas, 1200, 1290, 0.82, 64, -24], [TB.ctrl, 1200, 1300, 0.86, 64, -24]], t);
  const dm = sm(T.algunas, T.danos7, t); const { out, s, cam } = scene(ctx, t, sh, { mode: 'rigido', demand: dm, carsRun: 0 });
  const qb = camPt(cam, out.piers[1].base); baseForce(ctx, qb, s.up, sm(T.rigido7, T.rigido7 + 0.4, t), 14);
  const bt = camPt(cam, out.bearings[1].top); callout(ctx, bt[0], bt[1], 820, 560, 'APOYOS FIJOS', sm(T.si7 + 0.4, T.si7 + 0.7, t), C.aceroL);
  tag(ctx, 'SI FUERA COMPLETAMENTE RÍGIDO', 540, 370, 38, sm(T.si7, T.si7 + 0.3, t), C.blanco);
  title(ctx, 'DEMANDA ESTRUCTURAL', t, T.rigido7 + 0.2);
  callout(ctx, qb[0] + 30, qb[1] - 20, 760, qb[1] - 250, 'POSIBLES DAÑOS', sm(T.danos7 - 0.1, T.danos7 + 0.2, t), C.fuerza);
  ampTag(ctx, t, TB.rigido); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.rigido, { dur: 1, top: 1000, gain: 0.25, minor: true }); FX.etiqueta(k, T.si7); FX.etiqueta(k, T.si7 + 0.4); FX.aparece(k, T.rigido7 + 0.2); FX.estructura(k, T.algunas, 3, 0.9); FX.etiqueta(k, T.danos7); } });

 // 7 · MOVIMIENTO CONTROLADO — A (rígido) frente a B (aislado + disipadores): mismo sismo, misma escala, respuesta distinta
 const panel = (ctx, t, y0, h, mode, label, sub, col) => { ctx.save(); ctx.beginPath(); ctx.rect(40, y0, W - 80, h); ctx.clip(); ctx.translate(0, y0 + h / 2 - 960); const sh = { cam: [1200, 1124, 0.6], D: [64, -24] };
  const { out, s, cam } = scene(ctx, t, sh, { mode, carsRun: 0.4, demand: mode === 'rigido' ? 0.6 : 0, glow: mode === 'aislado' ? { bearings: 0.9, dampers: 0.9 } : {} });
  const qb = camPt(cam, out.piers[1].base); baseForce(ctx, qb, s.up, 1, 14); const dk = camPt(cam, [1200 + s.ud, 990]); const rel = s.ud - s.ug; if (Math.abs(rel) > 1) { ctx.save(); P.hArrow(ctx, dk[0], dk[1] - 50, rel * 9, C.control, 16); ctx.restore(); }
  ctx.restore(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.strokeRect(40, y0 + 2, W - 80, h - 4);
  P.rr(ctx, 44, y0 + 6, W - 88, 150, 0, 'rgba(12,23,32,0.86)'); txt(ctx, label, 70, y0 + 40, 44, col, { al: 'left', w: 900 }); txt(ctx, sub, 70, y0 + 84, 32, C.blanco, { al: 'left', w: 700 });
  // leyenda de flechas (indicadores cualitativos)
  P.hArrow(ctx, 70, y0 + 126, 60, C.fuerza, 14); txt(ctx, 'fuerza en la base', 150, y0 + 126, 32, C.blanco, { al: 'left', w: 700 }); P.hArrow(ctx, 520, y0 + 126, 60, C.control, 14); txt(ctx, 'desplazamiento del tablero', 600, y0 + 126, 32, C.blanco, { al: 'left', w: 700 }); };
 B.push({ t0: TB.ctrl, t1: TB.apoyos, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH);
  const a1 = sm(TB.ctrl, TB.ctrl + 0.4, t), a2 = sm(T.modernos - 0.2, T.modernos + 0.2, t);
  ctx.save(); ctx.globalAlpha *= a1; panel(ctx, t, 330, 520, 'rigido', 'A · MÁS RÍGIDO', 'apoyos fijos: más fuerza llega a la pila', C.fuerza); ctx.restore();
  ctx.save(); ctx.globalAlpha *= a2; panel(ctx, t, 868, 520, 'aislado', 'B · AISLADO + DISIPADORES', 'el tablero se desplaza más; la pila recibe menos', C.control); ctx.restore();
  title(ctx, 'MOVIMIENTO CONTROLADO', t, T.deformarse - 0.1, 0, 200);
  tag(ctx, 'MISMO SISMO · INDICADORES CUALITATIVOS · CASO ILUSTRADO', 540, 1416, 32, sm(T.desplazarse, T.desplazarse + 0.4, t), 'rgba(246,248,247,0.9)'); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.ctrl, { dur: 0.8, top: 1600, gain: 0.3, minor: true }); FX.aparece(k, T.modernos - 0.2, 480); FX.aparece(k, T.deformarse - 0.1); MUS.golpe(k, T.controlada, { gain: 0.6, chord: ['D3', 'A3', 'D4', 'F#4'] }); } });

 // 8a · APOYOS SÍSMICOS — acercamiento por debajo del tablero hacia el cabezal de la pila central
 B.push({ t0: TB.apoyos, t1: TB.apoyosHD, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const sh = shot([[TB.apoyos, 1060, 1180, 0.8, ...LOW], [TB.apoyosHD, 1215, 1085, 2.6, ...LOW]], t); scene(ctx, t, sh, { glow: { bearings: 0.7 * sm(T.algunos9 + 0.3, T.apoyos, t) } });
  title(ctx, 'APOYOS SÍSMICOS', t, T.apoyos - 0.1); scrim(ctx);
 }, sfx(k) { zoomS(k, TB.apoyos + 0.1, 1.2); FX.aparece(k, T.apoyos - 0.1); } });

 // 8b · el aislador elastomérico con núcleo de plomo en detalle: reposo → la subestructura se mueve → deformación relativa
 const HDK = 3.6;
 B.push({ t0: TB.apoyosHD, t1: TB.disip, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#132330'); g.addColorStop(1, '#22394a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const s = st(t), base = (s.ug + s.up) * HDK, sh = cl(s.ui * HDK, -80, 80), cut = sm(T.especiales - 0.1, T.especiales + 0.6, t);
  const p = P.isolatorHD(ctx, 540, 960, 300, t, { base, top: base + sh, cut, glow: 0 });
  const L = (q, x, y, s2, t0, c, al) => callout(ctx, q[0], q[1], x, y, s2, sm(t0, t0 + 0.3, t), c, al);
  L(p.topPlate, 760, 640, 'PLACA SUPERIOR', TB.apoyosHD + 0.15, C.aceroL); L(p.bottomPlate, 120, 1250, 'PLACA INFERIOR', TB.apoyosHD + 0.45, C.aceroL);
  L(p.rubber, 120, 820, 'CAUCHO', T.especiales + 0.3, C.blanco); L(p.shim, 640, 1110, 'LÁMINAS DE ACERO', T.especiales + 0.6, C.aceroL); L(p.lead, 640, 860, 'NÚCLEO DE PLOMO', T.especiales + 0.9, C.plomo);
  L(p.bolt, 700, 1330, 'ANCLAJES', T.permiten9 - 0.15, C.oro);
  L(p.deck, 120, 470, 'VIGA DEL TABLERO', T.tablero - 0.1, C.oro); L(p.cap, 600, 1400, 'CABEZAL DE PILA', T.soportes - 0.1, C.oro);
  // movimiento relativo: la base sigue a la pila (suelo); el tablero se mueve menos
  const am = sm(T.permiten9, T.permiten9 + 0.4, t) * (1 - sm(T.tablero - 0.3, T.tablero, t)); if (am > 0) { ctx.save(); ctx.globalAlpha *= am; P.hArrow(ctx, 540 + base, 1210, Math.sign(base || 1) * 110, C.fuerza, 18); P.hArrow(ctx, 540 + base + sh, 720, Math.sign(base + sh || 1) * (40 + Math.abs(base + sh) * 0.6), C.control, 16); ctx.restore(); }
  tag(ctx, 'NO TODOS LOS PUENTES LOS TIENEN', 540, 370, 36, sm(TB.apoyosHD + 0.1, TB.apoyosHD + 0.4, t) * (1 - sm(T.especiales + 0.2, T.especiales + 0.5, t)), C.blanco);
  tag(ctx, 'AISLADOR CON NÚCLEO DE PLOMO', 540, 370, 36, sm(T.especiales + 0.3, T.especiales + 0.6, t) * (1 - sm(T.permiten9 + 0.2, T.permiten9 + 0.5, t)), C.control);
  tag(ctx, 'PERMITE UN MOVIMIENTO RELATIVO', 540, 370, 38, sm(T.permiten9 + 0.3, T.permiten9 + 0.6, t), C.control);
  title(ctx, 'APOYOS SÍSMICOS', t, TB.apoyosHD); ampTag(ctx, t, T.permiten9 + 0.2); scrim(ctx);
 }, sfx(k) { FX.etiqueta(k, TB.apoyosHD + 0.15); FX.etiqueta(k, TB.apoyosHD + 0.45); k.play('whoosh', T.especiales - 0.1, { dur: 0.6, top: 2200, gain: 0.25, minor: true }); for (const d of [0.3, 0.6, 0.9]) FX.etiqueta(k, T.especiales + d); FX.etiqueta(k, T.permiten9 - 0.15); FX.temblor(k, T.permiten9 + 0.1, TB.imp - T.permiten9, 0.7); FX.estructura(k, T.movimiento9, 2, 0.3); FX.etiqueta(k, T.tablero - 0.1); FX.etiqueta(k, T.soportes - 0.1); } });

 // 9a · DISIPADORES — la cámara viaja al estribo izquierdo (tres cuartos)
 B.push({ t0: TB.disip, t1: TB.disipHD, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const sh = shot([[TB.disip, 900, 1150, 0.6, ...TQ], [TB.disipHD, 220, 1075, 2.6, 90, -40]], t); scene(ctx, t, sh, { glow: { dampers: 0.8 * sm(T.dispositivos10, T.dispositivos10 + 0.4, t) } });
  ampTag(ctx, t, TB.disip); scrim(ctx);
 }, sfx(k) { zoomS(k, TB.disip + 0.2, 1.5); } });

 // 9b · el disipador viscoso en detalle: anclaje al estribo, articulaciones, cilindro, vástago y ménsula del tablero; corte interior
 const DK = 6.6, DS = 106; const damp = (t) => { const s = st(t), ax = 170 + s.ug * 2.2; return { s, ax, bx: ax + 648 * DS / 96 + s.ui * DK }; };
 B.push({ t0: TB.disipHD, t1: TB.calor, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#132330'); g.addColorStop(1, '#22394a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const { s, ax, bx } = damp(t), cut = sm(T.energia10, T.energia10 + 0.6, t); const p = P.damperHD(ctx, ax, 980, bx, DS, t, { cut, vel: s.vel, heat: 0.15 * cut });
  const L = (q, x, y, s2, t0, c, al) => callout(ctx, q[0], q[1], x, y, s2, sm(t0, t0 + 0.3, t), c, al);
  L(p.cyl, 700, 760, 'CILINDRO', TB.disipHD + 0.2, C.aceroL); L(p.rod, 760, 1200, 'VÁSTAGO', TB.disipHD + 0.5, C.blanco);
  L(p.plateA, 120, 1300, 'ANCLAJE AL ESTRIBO', TB.disipHD + 0.8, C.oro); L(p.bracketB, 640, 560, 'MÉNSULA DEL TABLERO', T.energia10 - 0.2, C.oro, 'right');
  L(p.piston, 380, 700, 'PISTÓN', T.funcionan - 0.2, C.blanco, 'right'); L(p.fluid, 300, 1160, 'FLUIDO', T.funcionan + 0.3, C.disip); L(p.pinA, 120, 1060, 'ARTICULACIÓN', T.sorprendente - 0.3, C.aceroL);
  title(ctx, 'DISIPADORES DE ENERGÍA', t, TB.disipHD); ampTag(ctx, t, TB.disipHD); scrim(ctx);
 }, sfx(k) { FX.aparece(k, TB.disipHD); for (const d of [0.2, 0.5, 0.8]) FX.etiqueta(k, TB.disipHD + d); k.play('whoosh', T.energia10, { dur: 0.6, top: 2200, gain: 0.25, minor: true }); FX.etiqueta(k, T.funcionan - 0.2); FX.etiqueta(k, T.funcionan + 0.3); FX.etiqueta(k, T.sorprendente - 0.3); FX.hidraulico(k, T.funcionan, 2.4, 0.5); } });

 // 10a · DISIPACIÓN DE ENERGÍA — el fluido pasa por los orificios, la fuerza se opone al movimiento y PARTE de la energía se vuelve calor
 const energyBar = (ctx, t, a) => { if (a <= 0) return; const p = sm(T.parte12, T.calor + 0.8, t) * 0.4; ctx.save(); ctx.globalAlpha *= a; const x = 80, y = 430, w = 920, h = 54;
  P.rr(ctx, x - 20, y - 76, w + 40, 200, 24, 'rgba(12,23,32,0.88)'); txt(ctx, 'ENERGÍA DEL MOVIMIENTO', x, y - 40, 34, C.blanco, { al: 'left', w: 800 }); txt(ctx, 'indicador cualitativo', x + w, y - 40, 32, 'rgba(246,248,247,0.7)', { al: 'right', w: 600 });
  P.rr(ctx, x, y, w, h, h / 2, '#22313b'); P.rr(ctx, x, y, w * (1 - p), h, h / 2, C.control); if (p > 0.02) P.rr(ctx, x + w * (1 - p), y, w * p, h, h / 2, '#ff8a4c');
  txt(ctx, 'RESTANTE', x + 20, y + 88, 32, C.control, { al: 'left', w: 800 }); if (p > 0.05) txt(ctx, 'DISIPADA EN CALOR (UNA PARTE)', x + w, y + 88, 32, '#ffb27a', { al: 'right', w: 800 }); ctx.restore(); };
 B.push({ t0: TB.calor, t1: TB.vuelta, in: { type: 'cut' }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#132330'); g.addColorStop(1, '#22394a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const { s, ax, bx } = damp(t), heat = cl(0.15 + 0.7 * sm(T.transforman - 0.4, T.calor + 0.6, t) * (0.55 + 0.45 * Math.abs(s.vel)));
  const p = P.damperHD(ctx, ax, 1000, bx, DS, t, { cut: 1, vel: s.vel, heat, force: sm(T.mueve12, T.mueve12 + 0.4, t) });
  callout(ctx, p.force[0], p.force[1], 700, 1300, 'RESISTENCIA AL MOVIMIENTO', sm(T.mueve12 + 0.1, T.mueve12 + 0.4, t), C.fuerza, 'right');
  energyBar(ctx, t, sm(T.transforman - 0.1, T.transforman + 0.3, t));
  title(ctx, 'DISIPACIÓN DE ENERGÍA', t, T.transforman - 0.2, 0, 230);
  ampTag(ctx, t, TB.calor); scrim(ctx);
 }, sfx(k) { FX.hidraulico(k, T.cuando12, 2.4, 0.8); FX.hidraulico(k, T.parte12, 2.6, 0.7); FX.etiqueta(k, T.mueve12 + 0.1); FX.aparece(k, T.transforman - 0.2); FX.descubrir(k, T.calor - 0.1, 0.7); } });

 // 10b · regreso al plano general: con disipación, menos fuerza llega a la estructura
 B.push({ t0: TB.vuelta, t1: TB.juntas, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  const sh = shot([[TB.vuelta, 700, 1120, 1.0, ...MID], [TB.juntas, 1150, 1160, 0.58, ...TQ]], t); scene(ctx, t, sh, { forces: 0.45 * sm(T.fuerzas13 - 0.2, T.fuerzas13 + 0.3, t), glow: { dampers: 0.9 } });
  title(ctx, 'DISIPACIÓN DE ENERGÍA', t, TB.vuelta);
  tag(ctx, 'MENOS FUERZA EN LA ESTRUCTURA', 540, 370, 40, sm(T.fuerzas13, T.fuerzas13 + 0.3, t), C.control);
  ampTag(ctx, t, TB.vuelta); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.vuelta, { dur: 1.0, top: 900, gain: 0.3 }); FX.etiqueta(k, T.fuerzas13); } });

 // 11a · ESPACIO PARA MOVERSE — vista desde la calzada: estado normal (se circula sobre la junta) → estado sísmico (se mueve dentro de su capacidad)
 const G0 = 0.07, GK = 0.0042; // abertura nominal y conversión del desplazamiento relativo a unidades de calzada (siempre < longitud de los dientes)
 const roadCars = (t, tStop) => { const tt = Math.min(t, tStop); return [{ X: 0.5, z: 1.3 + ((tt * 1.15) % 9), c: '#c94f4f' }, { X: 0.5, z: 1.3 + ((tt * 1.15 + 4.5) % 9), c: '#e8ecef' }, { X: -0.5, z: 9.5 - ((tt * 1.3 + 2) % 8.7), c: '#3f7fb0', front: true }, { X: -0.5, z: 9.5 - ((tt * 1.3 + 6.1) % 8.7), c: '#d9a35c', front: true }]; };
 const JZ = 2.2; let T_STOP = T.permiten15 + 0.4; for (let tt = T.permiten15 - 0.4; tt < T.permiten15 + 2; tt += 0.05) { if (roadCars(tt, 1e9).every((c) => c.z < JZ - 0.8 || c.z > JZ + 0.5)) { T_STOP = tt; break; } }
 B.push({ t0: TB.juntas, t1: TB.juntaCU, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, 760); g.addColorStop(0, C.fondo); g.addColorStop(1, C.cielo); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const s = st(t), seis = sm(T_STOP + 0.05, T_STOP + 0.6, t), gap = G0 + seis * cl((s.ud - s.ug) * GK, -0.055, 0.055);
  const r = P.roadView(ctx, t, { vy: 820, jz: JZ, gap, finger: 0.16, glow: 0.8 * sm(T.juntas, T.juntas + 0.4, t), cars: roadCars(t, T_STOP), speed: 0 });
  callout(ctx, r.joint[0], r.joint[1], 720, 1000, 'JUNTA DE PEINE', sm(T.juntas + 0.2, T.juntas + 0.5, t), C.control);
  tag(ctx, 'ESTADO NORMAL: SE CIRCULA SOBRE ELLA', 540, 370, 36, sm(T.juntas + 0.3, T.juntas + 0.6, t) * (1 - sm(T.permiten15 - 0.3, T.permiten15, t)), C.blanco);
  tag(ctx, 'SISMO: SE ABRE Y SE CIERRA DENTRO DE SU CAPACIDAD', 540, 370, 34, sm(T.permiten15, T.permiten15 + 0.3, t), C.control);
  title(ctx, 'ESPACIO PARA MOVERSE', t, T.espacios - 0.1); ampTag(ctx, t, T.permiten15); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.juntas, { dur: 1, top: 1200, gain: 0.25, minor: true }); FX.trafico(k, TB.juntas, T.permiten15 - TB.juntas + 0.6, 0.8); FX.etiqueta(k, T.juntas + 0.2); FX.etiqueta(k, T.juntas + 0.3); FX.aparece(k, T.espacios - 0.1); FX.etiqueta(k, T.permiten15); FX.metal(k, T.desplacen, 0.5); } });

 // 11b · la misma junta en el puente: peines sobre el estribo, sin golpearse
 B.push({ t0: TB.juntaCU, t1: TB.imp, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const s = st(t), sh0 = shot([[TB.juntaCU, 180, 1010, 2.6, ...TQ], [TB.imp, 186, 1010, 2.8, ...TQ]], t), sh = { cam: [sh0.cam[0] + s.ug, sh0.cam[1], sh0.cam[2]], D: sh0.D };
  const { out, cam } = scene(ctx, t, sh, { glow: { joints: 0.8 } }); const j = out.joints[0], jp = camPt(cam, [j.x + TQ[0] * 0.5, j.y + TQ[1] * 0.5]);
  callout(ctx, jp[0], jp[1], 640, 520, 'HOLGURA PREVISTA', sm(TB.juntaCU + 0.2, TB.juntaCU + 0.5, t), C.control);
  tag(ctx, 'SIN GOLPEARSE DE INMEDIATO', 540, 370, 38, sm(TB.juntaCU, TB.juntaCU + 0.3, t), C.control);
  tag(ctx, 'CADA JUNTA TIENE UN LÍMITE DE MOVIMIENTO', 540, 1300, 34, sm(T.inmediatamente, T.inmediatamente + 0.4, t), C.blanco);
  title(ctx, 'ESPACIO PARA MOVERSE', t, TB.juntaCU); scrim(ctx);
 }, sfx(k) { FX.etiqueta(k, TB.juntaCU + 0.2); FX.metal(k, T.golpearse + 0.4, 0.4); FX.etiqueta(k, T.inmediatamente); } });

 // 12 · «Pero aquí viene lo más importante» — calma, travelling de tres cuartos
 B.push({ t0: TB.imp, t1: TB.mover, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const sh = shot([[TB.imp, 1450, 1150, 0.62, ...TQ], [TB.mover, 1300, 1160, 0.66, ...MID]], t); scene(ctx, t, sh, { carsRun: 0.6 }); vign(ctx, 0.5);
  title(ctx, 'LO MÁS IMPORTANTE', t, T.importante - 0.2); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.imp, { dur: 1.2, top: 800, gain: 0.25 }); FX.aparece(k, T.importante - 0.2, 440); } });

 // 13 · ¡MOVERSE NO ES FALLAR! — plano medio: el tablero se desplaza sobre los aisladores y todo sigue conectado
 B.push({ t0: TB.mover, t1: TB.ctrl2, in: { type: 'cut' }, draw(ctx, t) {
  const sh = shot([[TB.mover, 1230, 1110, 1.0, ...MID], [TB.ctrl2, 1215, 1100, 1.15, ...MID]], t); const { s, cam } = scene(ctx, t, sh, { glow: { bearings: 0.8, deck: 0.5 } });
  const dk = camPt(cam, [1200 + s.ud + MID[0] * 0.5, 950 + MID[1] * 0.5]); dblArrow(ctx, dk[0], dk[1] - 40, 130, C.control, sm(T.impedir, T.impedir + 0.3, t));
  title(ctx, '¡MOVERSE NO ES FALLAR!', t, T.no17 - 0.1); ampTag(ctx, t, TB.mover); scrim(ctx);
 }, sfx(k) { FX.temblor(k, T.el17, TB.diseno - T.el17, 0.7); FX.aparece(k, T.no17 - 0.1); MUS.golpe(k, T.no17, { gain: 0.7, chord: ['D3', 'A3', 'D4', 'F#4'] }); } });

 // 14 · CONTROLAR EL MOVIMIENTO — lo aprendido, pieza por pieza, sobre el mismo puente
 B.push({ t0: TB.ctrl2, t1: TB.diseno, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const sh = shot([[TB.ctrl2, 1150, 1150, 0.6, ...TQ], [TB.diseno, 1000, 1150, 0.66, ...TQ]], t), t0 = TB.ctrl2;
  const { out, cam } = scene(ctx, t, sh, { glow: { bearings: sm(t0 + 0.2, t0 + 0.5, t), dampers: sm(t0 + 0.9, t0 + 1.2, t), joints: sm(t0 + 1.6, t0 + 1.9, t), piers: 0.6 * sm(t0 + 2.3, t0 + 2.6, t) } });
  const bp = camPt(cam, out.bearings[1].top), dp = camPt(cam, out.dampers[0].body), jp = camPt(cam, [out.joints[0].x + TQ[0] * 0.5, out.joints[0].y + TQ[1] * 0.5]), pp = camPt(cam, out.piers[2].base);
  callout(ctx, bp[0], bp[1], 600, 640, 'APOYOS: ACOMODAN', sm(t0 + 0.2, t0 + 0.5, t), C.control);
  callout(ctx, dp[0], dp[1], 120, 1240, 'DISIPADORES: DISIPAN', sm(t0 + 0.9, t0 + 1.2, t), C.disip);
  callout(ctx, jp[0], jp[1], 120, 520, 'JUNTAS: DAN HOLGURA', sm(t0 + 1.6, t0 + 1.9, t), C.control);
  callout(ctx, pp[0], pp[1] - 120, 560, 1330, 'PILAS: MENOS DEMANDA', sm(t0 + 2.3, t0 + 2.6, t), C.oro);
  title(ctx, 'CONTROLAR EL MOVIMIENTO', t, T.controlar18 - 0.1);
  tag(ctx, 'REDUCIR DAÑOS', 300, 370, 38, sm(T.reducir18, T.reducir18 + 0.3, t), C.control); tag(ctx, 'EVITAR EL COLAPSO', 780, 370, 38, sm(T.evitar, T.evitar + 0.3, t), C.oro);
  scrim(ctx);
 }, sfx(k) { FX.aparece(k, T.controlar18 - 0.1); for (const d of [0.2, 0.9, 1.6, 2.3]) FX.etiqueta(k, TB.ctrl2 + d); FX.etiqueta(k, T.reducir18); FX.etiqueta(k, T.evitar); } });

 // 15 · DISEÑO PARA REDUCIR DAÑOS — travelling bajo el tablero (rayos X): vigas, apoyos y pilas; honestidad sobre los límites
 B.push({ t0: TB.diseno, t1: TB.final, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const sh = shot([[TB.diseno, 1550, 1150, 0.95, ...LOW], [TB.final, 850, 1140, 0.95, ...LOW]], t), x = sm(TB.diseno, TB.diseno + 0.8, t);
  scene(ctx, t, sh, { xray: 0.55 * x, glow: { bearings: x, dampers: x, joints: x, piers: 0.4 * x }, carsRun: 0.6 });
  title(ctx, 'DISEÑO PARA REDUCIR DAÑOS', t, T.diseno - 0.1);
  tag(ctx, 'NINGÚN DISEÑO ES INFALIBLE', 540, 370, 40, sm(T.garantiza, T.garantiza + 0.3, t), C.blanco);
  tag(ctx, 'PUEDE MEJORAR MUCHO LA SEGURIDAD', 540, 460, 38, sm(T.mejorar, T.mejorar + 0.3, t), C.control);
  ampTag(ctx, t, TB.diseno); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.diseno, { dur: 1, top: 1400, gain: 0.25, minor: true }); FX.aparece(k, T.diseno - 0.1); FX.etiqueta(k, T.garantiza); FX.etiqueta(k, T.mejorar); } });

 // 16a · «la próxima vez que veas un puente gigantesco» — vista desde la calzada al atardecer, con tráfico normal
 B.push({ t0: TB.final, t1: TB.final2, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, 820); g.addColorStop(0, C.fondo); g.addColorStop(0.6, '#3a4a5a'); g.addColorStop(1, '#a8794a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 800, 600, '217,163,92', 0.5);
  P.roadView(ctx, t, { vy: 820, jz: 4.5, gap: G0, cars: roadCars(t, 1e9), dusk: true });
  scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.final, { dur: 1.6, top: 900, gain: 0.25 }); FX.trafico(k, TB.final, TB.final2 - TB.final + 0.4, 0.8); } });

 // 16b · LA INGENIERÍA TAMBIÉN SABE MOVERSE — plano general de tres cuartos al atardecer con movimiento controlado
 B.push({ t0: TB.final2, t1: TB.cierre, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  const sh = shot([[TB.final2, 1500, 1120, 0.9, ...MID], [T.saber, 1260, 1160, 0.6, ...TQ], [TB.cierre, 1220, 1170, 0.56, ...TQ]], t); const { s, cam } = scene(ctx, t, sh, { sun: [820, 700, 1], glow: { bearings: 0.6 * sm(T.a22, T.a22 + 1, t) } });
  tag(ctx, 'NO PERMANECER COMPLETAMENTE RÍGIDO…', 540, 380, 38, sm(T.rigido22 - 0.8, T.rigido22 - 0.2, t) * (1 - sm(T.sino - 0.2, T.sino, t)), C.blanco);
  const a = sm(T.saber - 0.2, T.saber + 0.4, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; txt(ctx, 'LA INGENIERÍA', 540, 330, 68, C.blanco, { w: 900 }); txt(ctx, 'TAMBIÉN SABE MOVERSE', 540, 412, 68, C.oro, { w: 900 }); ctx.restore(); }
  const dk = camPt(cam, [1200 + s.ud + sh.D[0] * 0.5, 950 + sh.D[1] * 0.5]); dblArrow(ctx, dk[0], dk[1] - 60, 120, C.control, sm(T.moverse23 - 0.2, T.moverse23 + 0.2, t));
  ampTag(ctx, t, TB.final2); scrim(ctx);
 }, sfx(k) { FX.temblor(k, T.a22, T.sigue - T.a22 - 0.4, 0.5); FX.etiqueta(k, T.rigido22 - 0.8); FX.descubrir(k, T.saber - 0.2); MUS.golpe(k, T.moverse23, { gain: 0.8, chord: ['D3', 'A3', 'D4', 'F#4'] }); } });

 // 17 · ASOMBROTECA (único rótulo de marca, discreto, al final) sobre el plano general
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  scene(ctx, t, shot([[TB.cierre, 1220, 1170, 0.56, ...TQ], [DURATION, 1200, 1160, 0.52, ...TQ]], t), { sun: [820, 700, 1] }); vign(ctx, 0.55);
  const a = sm(T.sigue, T.sigue + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(246,248,247,0.75)'; ctx.lineWidth = 2; const lw = 280 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 300); ctx.lineTo(540 + lw, 300); ctx.moveTo(540 - lw, 420); ctx.lineTo(540 + lw, 420); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 362, 64, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
  scrim(ctx);
 }, sfx(k) { k.play('whoosh', T.sigue, { dur: 0.8, top: 1200, gain: 0.25, minor: true }); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.asombroteca + 1.0); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['terremoto', 'puente', 'moverse', 'derrumbarse', 'toneladas', 'ingeniería', 'controlar', 'fuerzas', 'suelo', 'temblar', 'columnas', 'rígido', 'daños', 'controlada', 'apoyos', 'sísmicos', 'tablero', 'disipadores', 'energía', 'calor', 'juntas', 'espacios', 'golpearse', 'importante', 'colapso', 'ningún', 'seguridad', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 420, q: 0.7, gain: 0.018, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   // banda sonora original: tensión contenida (sin sonidos de catástrofe) que se vuelve luminosa al llegar al «control»
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
