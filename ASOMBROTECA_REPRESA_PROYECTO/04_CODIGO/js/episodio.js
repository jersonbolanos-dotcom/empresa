// =====================================================================================================
// episodio.js — «¿Cómo una represa convierte el agua en electricidad?» · Asombroteca · PLANTILLA v1.7
// Arco: represa monumental → embalse (energía potencial, presión con la profundidad) → el desnivel → compuerta y
// tubería forzada LLENA → turbina Francis (carcasa, álabes directrices fijos, rodete que gira) → rueda de molino
// (misma idea, otra escala) → eje → generador → inducción (rotor con electroimanes, estator con bobinas, corriente
// alterna) → cadena agua → movimiento → electricidad → el agua vuelve al río / transformador elevador → líneas,
// subestación, ciudad → sin combustión (ciclo del agua) → impactos ambientales → bombilla y regreso por la cadena
// → «Sigue a Asombroteca». Cifras verificadas en FUENTES_Y_DECISIONES.md. Reloj = voz original. Determinista.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const C = { fondo: '#061522', embalse: '#1268A8', agua: '#38C9FF', cian: '#55E8FF', concreto: '#778A99', metal: '#293F52', acero: '#B8CCD8', energia: '#FFD447', verde: '#46C98A', blanco: '#F5FAFF', naranja: '#FF9D4D', rojo: '#FF5D5D' };
 const T = {
  enorme: wt(0, 'enorme'), pared: wt(0, 'pared'), concreto: wt(0, 'concreto'), electricidad0: wt(0, 'electricidad'), ciudades0: wt(0, 'ciudades'), pero1: SG(1).s, como2: SG(2).s, solamente: wt(2, 'solamente'), agua2: wt(2, 'agua'),
  todo3: SG(3).s, embalse: wt(3, 'embalse'), represa3: wt(3, 'represa'), almacena: wt(3, 'almacena'), millones: wt(3, 'millones'), agua3: wt(3, 'agua'),
  y4: SG(4).s, secreto: wt(4, 'secreto'), cuanto: SG(5).s, altura: wt(5, 'altura'), caer: wt(5, 'caer'), mas5: wt(5, 'más'), energia5: wt(5, 'energía'), aprovecharse: wt(5, 'aprovecharse'),
  cuando6: SG(6).s, abren: wt(6, 'abren'), compuertas: wt(6, 'compuertas'), paso: wt(6, 'paso'), desciende: wt(6, 'desciende'), tuberias: wt(6, 'tuberías'), presion: wt(6, 'presión'),
  pero7: SG(7).s, cae7: wt(7, 'cae'), generador7: wt(7, 'generador'), primero: SG(8).s, turbina8: wt(8, 'turbina'), maquina: wt(9, 'máquina'), alabes: wt(9, 'álabes'), girar: wt(9, 'girar'), agua9: wt(9, 'agua'),
  es10: SG(10).s, rueda: wt(10, 'rueda'), molino: wt(10, 'molino'), pero10: wt(10, 'pero'), potente: wt(10, 'potente'),
  la11: SG(11).s, conectada: wt(11, 'conectada'), generador11: wt(11, 'generador'), y12: SG(12).s, sorprendente: wt(12, 'sorprendente'),
  dentro: SG(13).s, movimiento13: wt(13, 'movimiento'), imanes: wt(13, 'imanes'), bobinas: wt(13, 'bobinas'), produce: wt(13, 'produce'), electricidad13: wt(13, 'electricidad'), induccion: wt(13, 'inducción'),
  es14: SG(14).s, el15: SG(15).s, movimiento15: wt(15, 'movimiento'), agua15: wt(15, 'agua'), energia15: wt(15, 'energía'),
  despues: SG(16).s, agua16: wt(16, 'agua'), rio: wt(16, 'río'), mientras: SG(17).s, electricidad17: wt(17, 'electricidad'), transformadores: wt(17, 'transformadores'), voltaje: wt(17, 'voltaje'), distancias: wt(17, 'distancias'),
  finalmente: SG(18).s, lineas: wt(18, 'líneas'), ciudades18: wt(18, 'ciudades'), fabricas: wt(18, 'fábricas'), hogares: wt(18, 'hogares'),
  y19: SG(19).s, increible: wt(19, 'increíble'), quemar: wt(19, 'quemar'), combustible: wt(19, 'combustible'),
  aunque: SG(20).s, represa20: wt(20, 'represa'), generar20: wt(20, 'generar'), impactos: wt(20, 'impactos'),
  asi21: SG(21).s, enciendas: wt(21, 'enciendas'), bombilla: wt(21, 'bombilla'), recuerda: wt(21, 'recuerda'), electricidad21: wt(21, 'electricidad'), comenzado: wt(21, 'comenzado'), agua21: wt(21, 'agua'), detras: wt(21, 'detrás'), represa21: wt(21, 'represa'),
  sigue: SG(22).s, asombroteca: wt(22, 'asombroteca'), end: A.speech_end,
 };
 const TB = { embalse: T.todo3 - 0.2, altura: T.y4 - 0.15, tuberia: T.cuando6 - 0.2, turbina: T.pero7 - 0.15, molino: T.es10 - 0.12, eje: T.la11 - 0.2, gen: T.dentro - 0.15, cadena: T.es14 - 0.15, caminos: T.despues - 0.15, red: T.finalmente - 0.15, limpia: T.y19 - 0.15, ambiente: T.aunque - 0.15, casa: T.asi21 - 0.15, final: T.detras - 0.25 };

 // ---------------- utilidades ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, px, a, c = 'rgba(232,242,252,0.95)') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `600 ${px}px "IBM Plex Mono"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 10; ctx.fillText(s, x, y); ctx.restore(); };
 const callout = (ctx, x0, y0, x1, y1, s, sub, a, c = C.blanco, al = 'left') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 7, 0, TAU); ctx.fill(); ctx.font = '800 32px Nunito'; ctx.textAlign = al; ctx.textBaseline = 'middle'; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 8; const dx = al === 'left' ? 10 : -10; ctx.fillText(s, x1 + dx, y1 - (sub ? 14 : 0)); if (sub) { ctx.font = '600 22px "IBM Plex Mono"'; ctx.fillStyle = 'rgba(220,235,250,0.9)'; ctx.fillText(sub, x1 + dx, y1 + 20); } ctx.restore(); };
 const card = (ctx, x, y, w, h, a, fn) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x, y, w, h, 28, 'rgba(245,250,255,0.96)', { sy: 10 }); fn(); ctx.restore(); };
 // ángulo de un giro que arranca en t0, acelera durante ramp y queda a w rad/s
 const spin = (t, t0, ramp, w) => (t <= t0 ? 0 : t < t0 + ramp ? w * (t - t0) * (t - t0) / (2 * ramp) : w * (t - t0 - ramp / 2));
 const sky = (ctx, y1 = 600, top = '#0b2238', bot = '#3d6f96') => { const g = ctx.createLinearGradient(0, 0, 0, y1); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, y1 + 2); };
 const mountains = (ctx, y, c, seed, amp = 220, x0 = -200, x1 = W + 200) => { const R = H.rng(seed); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x0, y + 400); let x = x0; ctx.lineTo(x, y); while (x < x1) { x += R.range(90, 200); ctx.lineTo(x, y - R.range(0.3, 1) * amp); x += R.range(90, 200); ctx.lineTo(x, y - R.range(0, 0.3) * amp); } ctx.lineTo(x1, y + 400); ctx.closePath(); ctx.fill(); };
 const flame = (ctx, x, y, s) => { ctx.save(); ctx.fillStyle = '#FF9D4D'; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.bezierCurveTo(x + s * 0.7, y - s * 0.3, x + s * 0.6, y + s * 0.5, x, y + s * 0.5); ctx.bezierCurveTo(x - s * 0.6, y + s * 0.5, x - s * 0.7, y - s * 0.3, x, y - s); ctx.fill(); ctx.fillStyle = '#FFD447'; ctx.beginPath(); ctx.ellipse(x, y + s * 0.15, s * 0.25, s * 0.35, 0, 0, TAU); ctx.fill(); ctx.restore(); };
 const person = (ctx, x, y, h, c = '#FF9D4D') => { ctx.save(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y - h * 0.88, h * 0.11, 0, TAU); ctx.fill(); ctx.fillRect(x - h * 0.11, y - h * 0.75, h * 0.22, h * 0.42); ctx.fillRect(x - h * 0.1, y - h * 0.35, h * 0.08, h * 0.35); ctx.fillRect(x + h * 0.02, y - h * 0.35, h * 0.08, h * 0.35); ctx.restore(); };

 const scrim = (ctx) => { const g = ctx.createLinearGradient(0, 1400, 0, 1760); g.addColorStop(0, 'rgba(6,21,34,0)'); g.addColorStop(0.5, 'rgba(6,21,34,0.7)'); g.addColorStop(1, 'rgba(6,21,34,0.7)'); ctx.fillStyle = g; ctx.fillRect(0, 1400, W, 520); };
 // ---------------- VISTA FRONTAL MONUMENTAL (gancho y cierre) ----------------
 function frontDam(ctx, t, o = {}) {
  sky(ctx, 700, '#071a2c', '#2d5878'); P.glow(ctx, 930, 600, 260, '255,212,71', 0.25 * (o.city ?? 1));
  P.skyline(ctx, 820, 1080, 620, o.city ?? 1, 12, { maxH: 90, c: '#14283a' });
  mountains(ctx, 640, '#1a3346', 4, 160); P.waterBody(ctx, [[150, 600], [930, 600], [930, 700], [150, 700]], t, { surf: [150, 930, 604], c1: '#4fb8e6', c2: '#1d6fa6', c3: '#124f7c' });
  mountains(ctx, 760, '#20384a', 8, 120, -200, 260); mountains(ctx, 760, '#20384a', 9, 120, 820, 1300);
  ctx.fillStyle = '#1a2d3c'; ctx.beginPath(); ctx.moveTo(-50, 640); ctx.lineTo(230, 640); ctx.lineTo(330, 1400); ctx.lineTo(-50, 1500); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(1130, 640); ctx.lineTo(850, 640); ctx.lineTo(750, 1400); ctx.lineTo(1130, 1500); ctx.closePath(); ctx.fill();
  P.concrete(ctx, [[220, 660], [860, 660], [760, 1330], [320, 1330]], { joints: 40, stains: 30, seed: 5 });
  ctx.fillStyle = '#9fb0bd'; ctx.fillRect(210, 646, 660, 18); for (let x = 230; x < 860; x += 40) ctx.fillRect(x, 636, 6, 12);
  // casa de máquinas al pie y río aguas abajo
  P.concrete(ctx, [[360, 1250], [720, 1250], [720, 1340], [360, 1340]], { c: '#8a9aa7', joints: 30, stains: 4, seed: 2, light: 'right' });
  for (let i = 0; i < 6; i++) { ctx.fillStyle = `rgba(255,212,71,${0.5 + 0.4 * (o.city ?? 1)})`; ctx.fillRect(385 + i * 56, 1275, 30, 20); }
  P.waterBody(ctx, [[340, 1340], [740, 1340], [900, 1920], [180, 1920]], t, { surf: [340, 740, 1344], c1: '#5ec8ef', c2: '#2585bd', c3: '#0f4a74' });
  ctx.save(); ctx.strokeStyle = 'rgba(245,250,255,0.45)'; ctx.lineWidth = 3; for (let i = 0; i < 14; i++) { const u = ((t * 0.35 + i / 14) % 1), x = lerp(420 + (i % 5) * 60, 300 + (i % 5) * 110, u), y = 1350 + u * 560; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 26); ctx.stroke(); } ctx.restore();
  // líneas hacia la ciudad
  const pa = P.pylon(ctx, 800, 1180, 160, { c: '#9fb0bd' }), pb = P.pylon(ctx, 930, 900, 110, { c: '#9fb0bd' });
  for (let k = 0; k < 2; k++) { P.powerLine(ctx, [720, 1260], pa[k], 20, t); P.powerLine(ctx, pa[k], pb[k], 18, t, { dots: o.dots ?? 0, speed: 160 }); P.powerLine(ctx, pb[k], [990, 640], 10, t, { dots: o.dots ?? 0, speed: 120 }); }
 }

 // ---------------- CORTE TÉCNICO DE LA CENTRAL (escenas 2-4, 9, 10) ----------------
 const SURF = 470, INTAKE = [430, 1045], PEN = [[400, 1045], [520, 1045], [790, 1195], [880, 1262]], TURB = [935, 1268], GEN = [935, 1162], DRAFT = [[935, 1290], [990, 1310], [1100, 1312]], TRAFO = [1010, 1050];
 function section(ctx, t, st) {
  sky(ctx, SURF + 10); mountains(ctx, SURF + 20, '#183247', 21, 140);
  P.waterBody(ctx, [[-40, SURF], [430, SURF], [430, 1300], [-40, 1200]], t, { surf: [-40, 430, SURF + 2], top: SURF, bottom: 1300 });
  // presión que aumenta con la profundidad (gradiente didáctico + flechas sobre el paramento)
  if (st.press > 0) { ctx.save(); ctx.globalAlpha = st.press; for (let y = 540; y <= 1230; y += 70) { const l = 18 + (y - SURF) * 0.11; P.arrow(ctx, 430 - l - 16, y, 422, y, 1, 'rgba(245,250,255,0.85)', 8); } ctx.restore(); }
  // roca y lecho
  ctx.fillStyle = '#2a2a26'; ctx.beginPath(); ctx.moveTo(-40, 1200); ctx.lineTo(430, 1300); ctx.lineTo(880, 1300); ctx.lineTo(1100, 1320); ctx.lineTo(1100, HH); ctx.lineTo(-40, HH); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3a372f'; ctx.fillRect(-40, 1360, 1200, 600);
  // río aguas abajo
  P.waterBody(ctx, [[860, 1292], [1100, 1292], [1100, 1350], [860, 1350]], t, { surf: [860, 1100, 1294], c1: '#5ec8ef', c3: '#155a88' });
  P.concrete(ctx, [[430, 440], [520, 440], [880, 1300], [430, 1300]], { joints: 44, stains: 18, seed: 3 });
  // tubería forzada (en el corte, a través de la represa) y compuerta de toma
  P.pipe(ctx, PEN, 46, t, { fill: st.fill ?? 1, flow: st.flow ?? 1, speed: 340 });
  P.gate(ctx, 392, 1022, 22, 46, st.gate ?? 1);
  // casa de máquinas: generador arriba, eje, turbina abajo, tubo de aspiración
  P.concrete(ctx, [[860, 1060], [1080, 1060], [1080, 1290], [860, 1290]], { c: '#8a9aa7', joints: 40, stains: 3, seed: 8, light: 'right' });
  ctx.fillStyle = 'rgba(6,21,34,0.88)'; ctx.fillRect(878, 1085, 186, 196);
  const ang = st.ang || 0;
  // tubo de aspiración: el agua sale hacia el río
  P.pipe(ctx, DRAFT, 32, t, { fill: 1, flow: st.out ?? (st.flow ?? 1), speed: 200 });
  // turbina (perfil): rodete con álabes que pasan
  ctx.save(); ctx.fillStyle = '#3b5266'; ctx.beginPath(); ctx.ellipse(TURB[0], TURB[1], 48, 18, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#d6e3ec'; ctx.lineWidth = 4; for (let i = 0; i < 8; i++) { const a = ang + i / 8 * TAU, c = Math.cos(a); if (Math.sin(a) < 0) continue; ctx.beginPath(); ctx.moveTo(TURB[0] + c * 44, TURB[1] - 12); ctx.lineTo(TURB[0] + c * 30, TURB[1] + 14); ctx.stroke(); } ctx.restore();
  // eje
  ctx.fillStyle = '#B8CCD8'; ctx.fillRect(GEN[0] - 7, GEN[1], 14, TURB[1] - GEN[1] - 14); ctx.fillStyle = '#FF9D4D'; for (let k = 0; k < 4; k++) { const yy = GEN[1] + 20 + ((k * 22 + ang * 18) % 88); ctx.fillRect(GEN[0] - 7, yy, 14, 4); }
  // generador (tambor)
  ctx.fillStyle = '#5d7387'; ctx.fillRect(GEN[0] - 60, GEN[1] - 50, 120, 70); ctx.fillStyle = '#c47a3a'; for (let k = 0; k < 5; k++) ctx.fillRect(GEN[0] - 52 + k * 22, GEN[1] - 40 + 0, 12, 50);
  if ((st.genGlow || 0) > 0) P.glow(ctx, GEN[0], GEN[1] - 15, 110, '255,212,71', 0.5 * st.genGlow);
  // transformador en el patio y salida eléctrica
  ctx.fillStyle = '#5d6f80'; ctx.fillRect(TRAFO[0] - 34, TRAFO[1] - 48, 68, 48); ctx.fillStyle = '#8a97a4'; for (let k = 0; k < 3; k++) ctx.fillRect(TRAFO[0] - 26 + k * 22, TRAFO[1] - 70, 8, 22);
  if ((st.elec || 0) > 0) { const pts = [[GEN[0] + 60, GEN[1] - 20], [985, GEN[1] - 20], [985, 1075], [TRAFO[0], 1075], [TRAFO[0], TRAFO[1]]]; P.cableRoute(ctx, pts, st.elec, t, { c: '255,212,71', w: 5, smooth: false, dots: 3, speed: 160 }); if (st.elec >= 1 && (st.line || 0) > 0) P.cableRoute(ctx, [[TRAFO[0], TRAFO[1] - 70], [TRAFO[0], 860], [1120, 760]], st.line, t, { c: '255,212,71', w: 4, smooth: false, dots: 2, speed: 220 }); }
 }

 // ================= BEATS =================
 const B = [];
 // 1 · gancho: la enorme pared de concreto… ¿electricidad con agua?
 B.push({ t0: 0, t1: TB.embalse, draw(ctx, t) {
  const cam = P.camAt([[0, 540, 1250, 3.4], [1.9, 540, 760, 2.4], [T.electricidad0 + 0.3, 540, 860, 1.05], [T.como2, 560, 900, 1.0], [TB.embalse, 540, 880, 1.12]], t);
  ctx.save(); P.camApply(ctx, cam); frontDam(ctx, t, { city: sm(T.ciudades0 - 0.4, T.ciudades0 + 0.4, t), dots: t > T.ciudades0 ? 3 : 0 }); ctx.restore(); scrim(ctx);
  pill(ctx, 'CIUDADES ENTERAS', 760, 330, 34, t, T.ciudades0, C.energia, C.fondo, T.como2);
  pill(ctx, '¿ELECTRICIDAD CON AGUA?', 540, 330, 46, t, T.como2 - 0.05, C.agua, C.fondo);
  tag(ctx, 'la pared no la produce: lo hacen turbinas y generadores', 540, 420, 23, sm(T.solamente, T.solamente + 0.4, t));
 }, sfx(k) { FX.corriente(k, 0, TB.embalse, 0.7); k.play('riser', 0.2, { dur: 1.7, gain: 0.35 }); k.play('whoosh', 1.7, { dur: 1.6, top: 1400, gain: 0.4 }); FX.lineas(k, T.ciudades0, 2.2, 0.8); k.play('sparkle', T.ciudades0, { gain: 0.3, n: 6 }); FX.sello(k, T.como2); } });
 // 2 · el embalse: agua almacenada (energía potencial) y presión que aumenta con la profundidad
 B.push({ t0: TB.embalse, t1: TB.altura, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  const cam = P.camAt([[TB.embalse, 260, 620, 1.9], [T.represa3, 380, 820, 1.35], [T.millones, 540, 960, 1.0]], t);
  ctx.save(); P.camApply(ctx, cam); section(ctx, t, { fill: 0, flow: 0, gate: 0, press: sm(T.millones, T.millones + 0.6, t), out: 0.25 }); ctx.restore();
  pill(ctx, 'EMBALSE', 540, 330, 50, t, T.embalse, C.agua, C.fondo);
  const la = sm(T.almacena, T.almacena + 0.4, t); tag(ctx, 'agua guardada en altura = energía almacenada', 540, 420, 24, la);
  callout(ctx, 410, 1045, 160, 1380, 'TOMA DE AGUA', 'cerrada por una compuerta', sm(T.agua3 - 0.2, T.agua3 + 0.2, t));
  tag(ctx, 'más profundidad → más presión', 220, 1180, 22, sm(T.millones + 0.3, T.millones + 0.8, t));
 }, sfx(k) { FX.olas(k, TB.embalse, TB.altura - TB.embalse, 0.8); FX.revelar(k, T.embalse - 0.1); FX.etiqueta(k, T.almacena); FX.aparece(k, T.millones + 0.1, 520); FX.etiqueta(k, T.agua3); } });
 // 3 · el secreto: el desnivel (altura de caída)
 B.push({ t0: TB.altura, t1: TB.tuberia, in: { type: 'cut' }, draw(ctx, t) {
  section(ctx, t, { fill: 0, flow: 0, gate: 0, out: 0.25 }); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const hp = E.inOut(win(t, T.altura - 0.1, T.altura + 0.8)), hy = lerp(SURF, TURB[1], hp);
  if (hp > 0) { ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = 'rgba(245,250,255,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(250, SURF); ctx.lineTo(430, SURF); ctx.moveTo(250, TURB[1]); ctx.lineTo(TURB[0], TURB[1]); ctx.stroke(); ctx.restore(); P.glow(ctx, 250, hy, 40, '85,232,255', 0.8); P.strokePath(ctx, [[250, SURF], [250, hy]], 8, C.cian); tag(ctx, 'DESNIVEL', 250, (SURF + hy) / 2, 26, sm(T.altura + 0.4, T.altura + 0.8, t), C.cian); }
  pill(ctx, 'EL SECRETO: LA ALTURA', 540, 330, 44, t, T.secreto - 0.1, C.energia, C.fondo, T.caer);
  // comparación: menor y mayor desnivel → energía por cada litro
  const ca = sm(T.caer - 0.2, T.caer + 0.3, t); card(ctx, 70, 280, 940, 300, ca, () => {
   [[300, 0.45, 'MENOR DESNIVEL'], [760, 1, 'MAYOR DESNIVEL']].forEach(([cx, hh, s], i) => { const top = 530 - 190 * hh; ctx.fillStyle = '#1268A8'; ctx.fillRect(cx - 170, top, 90, 530 - top); ctx.fillStyle = '#778A99'; ctx.fillRect(cx - 80, top - 8, 22, 538 - top); ctx.fillStyle = '#293F52'; ctx.fillRect(cx - 58, 518, 120, 12);
    const e = hh * E.out(win(t, T.mas5 - 0.1, T.energia5 + 0.4)); ctx.fillStyle = '#e8edf2'; ctx.fillRect(cx + 40, 340, 50, 190); ctx.fillStyle = C.energia; ctx.fillRect(cx + 40, 530 - 190 * e, 50, 190 * e); P.text(ctx, s, cx - 30, 312, 22, C.fondo); P.text(ctx, 'energía', cx + 65, 555, 18, '#3a5368'); });
   P.text(ctx, 'por cada litro de agua', 540, 555, 20, '#3a5368'); });
  pill(ctx, 'LA ALTURA ALMACENA ENERGÍA', 540, 640, 36, t, T.energia5, C.energia, C.fondo);
  tag(ctx, 'la potencia también depende del caudal y de la eficiencia', 540, 1400, 22, sm(T.aprovecharse, T.aprovecharse + 0.4, t));
 }, sfx(k) { FX.onomatopeya(k, T.secreto - 0.1); k.play('riser', T.altura - 0.1, { dur: 0.9, gain: 0.35 }); k.play('stroke', T.altura, { material: 'marker', dur: 0.8, gain: 0.25 }); FX.aparece(k, T.caer - 0.1, 560); FX.contador(k, T.mas5 - 0.1, T.energia5 + 0.4, 0, 10); FX.sello(k, T.energia5); } });
 // 4 · compuertas y tubería forzada (la tubería va LLENA)
 B.push({ t0: TB.tuberia, t1: TB.turbina, in: { type: 'cut' }, draw(ctx, t) {
  const cam = P.camAt([[TB.tuberia, 540, 960, 1], [T.abren - 0.1, 430, 1040, 2.4], [T.desciende, 470, 1060, 2.2], [T.tuberias + 0.3, 700, 1150, 1.9], [T.presion + 0.5, 880, 1230, 2.3]], t);
  const g = E.inOut(win(t, T.abren, T.paso)), fill = E.inOut(win(t, T.paso - 0.2, T.tuberias + 0.4));
  ctx.save(); P.camApply(ctx, cam); section(ctx, t, { gate: g, fill, flow: sm(T.paso, T.desciende, t), ang: spin(t, T.tuberias + 0.3, 1.5, 3), out: 0.25 }); ctx.restore();
  pill(ctx, 'COMPUERTAS', 540, 330, 44, t, T.compuertas, C.naranja, C.fondo, T.tuberias);
  pill(ctx, 'TUBERÍA FORZADA', 540, 330, 48, t, T.tuberias, C.agua, C.fondo);
  tag(ctx, 'va LLENA de agua: la empuja el peso del agua de arriba', 540, 420, 22, sm(T.presion - 0.2, T.presion + 0.2, t));
 }, sfx(k) { FX.compuerta(k, T.abren, T.paso - T.abren + 0.2); FX.corriente(k, T.paso - 0.1, TB.turbina - T.paso + 0.3, 1.1); k.play('whoosh', T.desciende, { dur: 1.2, top: 900, gain: 0.35 }); FX.etiqueta(k, T.tuberias); k.play('thud', T.presion, { f: 70, gain: 0.3 }); } });
 // 5 · no cae sobre el generador: primero la turbina Francis
 const TX = 470, TY = 860, TR = 250;
 B.push({ t0: TB.turbina, t1: TB.molino, in: { type: 'zoom', d: 0.6, x: 540, y: 1250 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 860, 700, '18,104,168', 0.2);
  // «no cae directamente sobre un generador»
  const na = sm(TB.turbina, TB.turbina + 0.3, t) * (1 - sm(T.primero - 0.2, T.primero + 0.2, t));
  if (na > 0) { ctx.save(); ctx.globalAlpha = na; P.genSection(ctx, 540, 960, 200, t * 0.2, {}); P.pipe(ctx, [[160, 560], [320, 700], [400, 820]], 40, t, { flow: 1 }); if (t > T.cae7) P.cross(ctx, 540, 960, 260, E.out(win(t, T.cae7, T.cae7 + 0.4)), C.rojo); ctx.restore(); tag(ctx, 'el agua NO toca las bobinas', 540, 1260, 26, na * sm(T.generador7, T.generador7 + 0.3, t)); }
  const ta = sm(T.primero - 0.1, T.primero + 0.4, t); if (ta <= 0) return;
  const w = 2.6, ang = spin(t, T.girar - 0.2, 1.6, w) - 0.4 + 0.12 * Math.sin(t * 0.5) * (1 - sm(T.girar - 0.2, T.girar, t));
  ctx.save(); ctx.globalAlpha = ta; P.francis(ctx, TX, TY, TR, ang, { open: lerp(0.15, 0.8, sm(T.maquina, T.alabes, t)), flow: sm(T.primero, T.maquina, t), t }); ctx.restore();
  callout(ctx, TX + TR * 1.6, TY - TR * 1.1, 760, 400, 'CARCASA ESPIRAL', 'reparte el agua', sm(T.turbina8, T.turbina8 + 0.3, t));
  callout(ctx, TX + TR * 0.62, TY + TR * 0.62, 600, 1250, 'ÁLABES DIRECTRICES', 'fijos: orientan el agua', sm(T.maquina, T.maquina + 0.3, t));
  callout(ctx, TX - TR * 0.4, TY + TR * 0.3, 120, 1260, 'RODETE', 'gira con el agua', sm(T.alabes, T.alabes + 0.3, t), C.cian);
  callout(ctx, TX, TY, 150, 560, 'EJE', '', sm(T.girar, T.girar + 0.3, t), C.naranja);
  pill(ctx, 'NO CAE SOBRE EL GENERADOR', 540, 330, 38, t, T.pero7 + 0.1, C.rojo, C.blanco, T.primero);
  pill(ctx, 'TURBINA HIDRÁULICA', 540, 330, 46, t, T.turbina8, C.agua, C.fondo);
  tag(ctx, 'turbina tipo Francis · vista desde arriba', 540, 1390, 22, ta * 0.85);
 }, sfx(k) { FX.revelar(k, TB.turbina + 0.1); FX.tachado(k, T.cae7); FX.corriente(k, TB.turbina, TB.molino - TB.turbina, 0.8); FX.aparece(k, T.turbina8 - 0.2, 520); FX.etiqueta(k, T.turbina8); FX.etiqueta(k, T.maquina); FX.etiqueta(k, T.alabes); FX.turbina(k, T.girar - 0.3, TB.molino - T.girar + 0.6, 1); } });
 // 6 · como una rueda de molino… pero muchísimo más potente
 B.push({ t0: TB.molino, t1: TB.eje, in: { type: 'cut' }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 860, 700, '18,104,168', 0.2);
  const m = sm(T.es10 + 0.1, T.rueda, t) * (1 - sm(T.pero10 - 0.1, T.pero10 + 0.3, t)), f = 1 - m;
  if (f > 0.01) { const big = sm(T.pero10, T.potente + 0.3, t); ctx.save(); ctx.globalAlpha = f; const s = lerp(1, 0.78, big), cx = lerp(TX, 600, big); ctx.translate(cx, TY); ctx.scale(s, s); ctx.translate(-cx, -TY); P.francis(ctx, cx, TY, TR, spin(t, TB.molino - 3, 0.1, 2.6), { open: 0.8, flow: 1, t }); ctx.restore(); if (big > 0) { ctx.save(); ctx.globalAlpha = big; person(ctx, 175, 1150, 120); tag(ctx, 'persona (escala)', 175, 1185, 20, big); ctx.restore(); } }
  if (m > 0.01) { ctx.save(); ctx.globalAlpha = m; ctx.fillStyle = '#3d6f96'; ctx.fillRect(0, 300, W, 900); ctx.fillStyle = '#5a4630'; ctx.fillRect(0, 1060, W, 300); P.waterBody(ctx, [[0, 1050], [W, 1050], [W, 1200], [0, 1200]], t, { surf: [0, W, 1052] }); ctx.fillStyle = '#7a5a3a'; ctx.fillRect(80, 530, 380, 40); P.pipe(ctx, [[60, 500], [440, 560], [470, 640], [470, 700]], 26, t, { flow: 1, glass: false }); P.waterwheel(ctx, 540, 860, 230, spin(t, TB.molino, 0.8, 1.6)); ctx.restore(); }
  pill(ctx, 'COMO UNA RUEDA DE MOLINO', 540, 330, 40, t, T.rueda - 0.1, C.blanco, C.fondo, T.pero10);
  pill(ctx, 'EL MISMO PRINCIPIO, A OTRA ESCALA', 540, 330, 36, t, T.pero10, C.energia, C.fondo);
  tag(ctx, 'comparación conceptual: el rodete Francis es otra máquina', 540, 1390, 21, sm(T.molino, T.molino + 0.4, t));
 }, sfx(k) { k.play('whoosh', T.es10, { dur: 0.6, gain: 0.35 }); FX.corriente(k, T.rueda - 0.4, 2, 0.6); for (let i = 0; i < 5; i++) k.play('tock', T.rueda + i * 0.4, { f: 300, gain: 0.3, minor: true }); k.play('whoosh', T.pero10, { dur: 0.6, gain: 0.35 }); FX.turbina(k, T.pero10, TB.eje - T.pero10 + 0.2, 1.3, 180, 260); FX.sello(k, T.potente); } });
 // 7 · el eje conecta la turbina con el generador (unidad vertical, corte)
 B.push({ t0: TB.eje, t1: TB.gen, in: { type: 'rise', d: 0.55 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); const ang = t * 2.6, lit = sm(T.generador11 - 0.2, T.generador11 + 0.3, t);
  const cam = P.camAt([[TB.eje, 540, 1150, 1.25], [T.conectada, 540, 980, 1.05], [T.y12, 540, 900, 1.0]], t); ctx.save(); P.camApply(ctx, cam);
  // fosa de hormigón
  P.concrete(ctx, [[60, 1080], [1020, 1080], [1020, 1420], [60, 1420]], { c: '#5f6f7c', joints: 50, stains: 6, seed: 11 });
  // turbina (corte lateral): carcasa espiral a los lados y rodete
  ctx.fillStyle = '#293F52'; ctx.beginPath(); ctx.ellipse(540, 1230, 330, 95, 0, 0, TAU); ctx.fill(); P.waterBody(ctx, [[230, 1200], [850, 1200], [850, 1260], [230, 1260]], t, { c1: '#2a8fd0', c3: '#124f7c' });
  ctx.fillStyle = '#3b5266'; ctx.beginPath(); ctx.moveTo(400, 1185); ctx.lineTo(680, 1185); ctx.lineTo(620, 1300); ctx.lineTo(460, 1300); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#d6e3ec'; ctx.lineWidth = 7; for (let i = 0; i < 10; i++) { const a = ang + i / 10 * TAU; if (Math.sin(a) < 0) continue; const c = Math.cos(a); ctx.beginPath(); ctx.moveTo(540 + c * 130, 1195); ctx.quadraticCurveTo(540 + c * 120, 1250, 540 + c * 70, 1295); ctx.stroke(); }
  // eje que gira (franjas que pasan)
  ctx.fillStyle = '#B8CCD8'; ctx.fillRect(515, 700, 50, 490); ctx.fillStyle = 'rgba(41,63,82,0.6)'; for (let k = 0; k < 10; k++) { const ph = ((ang / TAU * 2 + k / 10) % 1); ctx.fillRect(515 + 50 * ph - 3, 700, 6, 490); }
  // generador (tambor): estator fijo, rotor que gira (franjas), corte parcial
  ctx.fillStyle = '#5d7387'; ctx.fillRect(170, 470, 740, 260); ctx.fillStyle = '#293F52'; ctx.fillRect(220, 500, 640, 200); ctx.fillStyle = '#c47a3a'; ctx.fillRect(230, 510, 50, 180); ctx.fillRect(800, 510, 50, 180);
  for (let k = 0; k < 12; k++) { const ph = ((ang / TAU + k / 12) % 1), x = 300 + 480 * (0.5 - 0.5 * Math.cos(ph * TAU)), vis = Math.sin(ph * TAU) > 0; if (!vis) continue; ctx.fillStyle = k % 2 ? '#3f7fd1' : '#d9534f'; ctx.fillRect(x - 16, 520, 32, 160); }
  if (lit > 0) P.glow(ctx, 540, 600, 420, '255,212,71', 0.35 * lit);
  person(ctx, 960, 1080, 120); ctx.restore();
  callout(ctx, 540, 1250, 760, 1360, 'TURBINA', '', sm(TB.eje, TB.eje + 0.4, t), C.agua);
  callout(ctx, 565, 900, 640, 960, 'EJE', 'gira junto con el rodete', sm(T.conectada - 0.2, T.conectada + 0.2, t), C.naranja);
  pill(ctx, 'GENERADOR ELÉCTRICO', 540, 330, 46, t, T.generador11, C.energia, C.fondo);
  tag(ctx, 'persona a escala →', 860, 1040, 20, sm(T.conectada, T.conectada + 0.4, t));
  P.onoma(ctx, '¡ALGO SORPRENDENTE!', 540, 430, 54, t, T.sorprendente - 0.2, TB.gen + 0.2, { c: C.cian, rot: -0.06 });
 }, sfx(k) { FX.turbina(k, TB.eje, TB.gen - TB.eje, 1, 220, 230); FX.corriente(k, TB.eje, TB.gen - TB.eje, 0.5); k.play('whoosh', TB.eje + 0.1, { dur: 0.9, top: 1200, gain: 0.35 }); FX.etiqueta(k, T.conectada); FX.sello(k, T.generador11); FX.generador(k, T.generador11, TB.gen - T.generador11 + 0.5, 0.8); k.play('sparkle', T.sorprendente, { gain: 0.35, n: 6 }); } });
 // 8 · inducción electromagnética: rotor (electroimanes que giran) + estator (bobinas fijas) → corriente alterna
 const GX = 540, GY = 790, GR = 330;
 B.push({ t0: TB.gen, t1: TB.cadena, in: { type: 'zoom', d: 0.6, x: 540, y: 600 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); P.glow(ctx, GX, GY, 600, '85,232,255', 0.1);
  const ang = spin(t, TB.gen, 0.01, 0.9), cur = sm(T.produce - 0.2, T.electricidad13 + 0.3, t), field = sm(T.imanes, T.imanes + 0.5, t) * 0.6 + 0.4 * sm(T.induccion - 0.2, T.induccion + 0.3, t);
  P.genSection(ctx, GX, GY, GR, ang, { poles: 8, slots: 36, field, current: cur, t });
  callout(ctx, GX + GR * 0.35, GY - GR * 0.35, 690, 400, 'ROTOR', 'gira (lo mueve la turbina)', sm(T.movimiento13 - 0.1, T.movimiento13 + 0.3, t), C.blanco, 'left');
  callout(ctx, GX - GR * 0.45, GY + GR * 0.1, 80, 1170, 'IMANES', 'electroimanes del rotor', sm(T.imanes, T.imanes + 0.3, t), C.rojo);
  callout(ctx, GX + GR * 0.8, GY + GR * 0.4, 690, 1170, 'BOBINAS', 'en el estator (fijo)', sm(T.bobinas, T.bobinas + 0.3, t), C.naranja);
  const sa = sm(T.produce, T.electricidad13, t); if (sa > 0) { ctx.save(); ctx.globalAlpha = sa; P.rr(ctx, 120, 1240, 840, 150, 24, 'rgba(6,21,34,0.92)'); P.sine(ctx, 150, 1320, 780, 100, t, { cycles: 3, speed: 7.2, c: C.energia }); ctx.restore(); tag(ctx, 'CORRIENTE ALTERNA', 540, 1255, 20, sa, C.energia); }
  pill(ctx, 'DENTRO DEL GENERADOR', 540, 330, 40, t, T.dentro, C.blanco, C.fondo, T.induccion);
  pill(ctx, 'INDUCCIÓN ELECTROMAGNÉTICA', 540, 330, 42, t, T.induccion, C.cian, C.fondo);
  tag(ctx, 'la energía viene del giro que entrega la turbina', 540, 1415, 21, sm(T.induccion + 0.6, T.induccion + 1.0, t));
 }, sfx(k) { FX.revelar(k, TB.gen + 0.1); FX.generador(k, TB.gen, TB.cadena - TB.gen, 1); FX.etiqueta(k, T.movimiento13); FX.etiqueta(k, T.imanes); FX.etiqueta(k, T.bobinas); FX.zumbido(k, T.produce, TB.cadena - T.produce, 0.6); FX.induccion(k, T.induccion - 0.1, 1.3); FX.sello(k, T.induccion + 0.1); } });
 // 9 · agua → movimiento → electricidad (toda la central en corte)
 B.push({ t0: TB.cadena, t1: TB.caminos, in: { type: 'iris', d: 0.6, x: 935, y: 1180 }, draw(ctx, t) {
  const ang = t * 3; section(ctx, t, { ang, genGlow: sm(T.energia15 - 0.3, T.energia15, t), elec: sm(T.energia15 - 0.2, T.energia15 + 0.6, t), out: 0.25 }); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // cadena luminosa
  const a1 = sm(T.agua15 - 0.3, T.agua15 + 0.3, t), a2 = sm(T.movimiento15 - 0.2, T.movimiento15 + 0.3, t);
  if (a1 > 0) { ctx.save(); ctx.globalAlpha = a1; P.cableRoute(ctx, [[200, 900], [430, 1045], ...PEN.slice(1)], 1, t, { c: '85,232,255', w: 4, smooth: false, dots: 4, speed: 300 }); ctx.restore(); }
  if (a2 > 0) { ctx.save(); ctx.globalAlpha = a2; P.rings(ctx, TURB[0], TURB[1], t, { r: 80, n: 2, period: 0.9, c: '255,157,77', a: 0.9, w: 4 }); ctx.restore(); }
  const x0 = 210; ['AGUA', 'MOVIMIENTO', 'ELECTRICIDAD'].forEach((s, i) => { const t0 = [T.agua15 - 0.15, T.movimiento15 + 0.9, T.energia15][i], c = [C.agua, C.naranja, C.energia][i]; if (t < t0) return; P.pill(ctx, s, x0 + i * 330, 330, 34, t, t0, { bg: c, fg: C.fondo }); if (i < 2 && t > t0 + 0.3) P.text(ctx, '→', x0 + i * 330 + 165, 332, 40, C.blanco); });
  tag(ctx, 'el agua no se convierte en electricidad: le cede parte de su energía', 540, 420, 21, sm(T.energia15 + 0.3, T.energia15 + 0.7, t));
 }, sfx(k) { FX.revelar(k, TB.cadena + 0.1); FX.corriente(k, TB.cadena, TB.caminos - TB.cadena, 0.7); FX.etiqueta(k, T.agua15 - 0.15); FX.turbina(k, T.movimiento15, 2.5, 0.7, 200, 210); FX.etiqueta(k, T.movimiento15 + 0.9); FX.induccion(k, T.energia15 - 0.3, 0.9, 0.8); FX.sello(k, T.energia15); } });
 // 10 · dos caminos: el agua vuelve al río · la electricidad pasa por el transformador elevador
 B.push({ t0: TB.caminos, t1: TB.red, in: { type: 'cut' }, draw(ctx, t) {
  const cam = P.camAt([[TB.caminos, 540, 960, 1], [T.agua16 + 0.2, 930, 1250, 2.0], [T.rio + 0.4, 950, 1240, 2.0], [T.electricidad17 + 0.3, 980, 1080, 1.9], [T.transformadores, 900, 1000, 1.3]], t);
  ctx.save(); P.camApply(ctx, cam); section(ctx, t, { ang: t * 3, out: 1, genGlow: 0.6, elec: sm(T.electricidad17 - 0.2, T.electricidad17 + 0.8, t), line: sm(T.distancias - 1.0, T.distancias, t) }); ctx.restore();
  pill(ctx, 'EL AGUA REGRESA AL RÍO', 540, 330, 40, t, T.rio - 0.2, C.agua, C.fondo, T.electricidad17 - 0.1);
  pill(ctx, 'LA ELECTRICIDAD CONTINÚA', 540, 330, 40, t, T.electricidad17, C.energia, C.fondo);
  // transformador elevador (esquema): pocas vueltas → muchas vueltas
  const ta = sm(T.transformadores - 0.1, T.transformadores + 0.3, t);
  card(ctx, 90, 400, 900, 420, ta, () => { P.transformer(ctx, 540, 590, 190, { n1: 4, n2: 14, flux: 1, t, glow1: 0.5 + 0.5 * Math.sin(t * 8), glow2: 0.5 + 0.5 * Math.sin(t * 8), bg: '#f5faff' }); P.text(ctx, 'TRANSFORMADOR ELEVADOR', 540, 440, 32, C.fondo, { kind: 'title' });
   const va = sm(T.voltaje - 0.2, T.voltaje + 0.2, t); ctx.globalAlpha *= 1; P.text(ctx, 'pocas vueltas', 300, 730, 22, '#3a5368'); P.text(ctx, 'muchas vueltas', 780, 730, 22, '#3a5368'); if (va > 0) { ctx.globalAlpha = ta * va; P.text(ctx, '≈ 18.000 V', 250, 590, 30, '#c0582a', { kind: 'title' }); P.text(ctx, '500.000 V', 830, 590, 30, '#c0582a', { kind: 'title' }); P.text(ctx, 'eleva el voltaje; no crea energía', 540, 785, 22, C.fondo); } });
  tag(ctx, 'ejemplo real: central Paulo Afonso IV (Brasil)', 540, 850, 20, ta * sm(T.voltaje, T.voltaje + 0.4, t));
  tag(ctx, 'más voltaje = menos corriente = menos pérdidas en el viaje', 540, 1390, 22, sm(T.distancias - 0.2, T.distancias + 0.3, t));
 }, sfx(k) { FX.corriente(k, TB.caminos, T.mientras - TB.caminos + 0.5, 1); k.play('whoosh', T.agua16, { dur: 1.0, top: 800, gain: 0.35 }); FX.etiqueta(k, T.rio - 0.2); FX.generador(k, T.mientras, TB.red - T.mientras, 0.6); k.play('whoosh', T.electricidad17, { dur: 0.8, top: 2400, gain: 0.3 }); FX.etiqueta(k, T.electricidad17); FX.aparece(k, T.transformadores, 520); FX.transformador(k, T.transformadores, TB.red - T.transformadores, 1); FX.contador(k, T.voltaje - 0.1, T.voltaje + 0.4, 0, 8); FX.etiqueta(k, T.distancias - 0.2); } });
 // 11 · líneas de transmisión → subestación → distribución → ciudades, fábricas y hogares (travelling lateral)
 const WX = 3300, PYL = [520, 900, 1280, 1660, 2040];
 B.push({ t0: TB.red, t1: TB.limpia, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const cx = lerp(540, WX - 540, E.inOut(win(t, TB.red + 0.1, T.hogares + 0.2)));
  sky(ctx, 1300, '#0a2034', '#4a7aa0');
  ctx.save(); ctx.translate(-cx + 540, 0);
  mountains(ctx, 1050, '#1d3a50', 31, 260, -200, WX + 200); mountains(ctx, 1200, '#24465c', 32, 180, -200, WX + 200);
  ctx.fillStyle = '#20382a'; ctx.fillRect(-200, 1250, WX + 400, 700);
  // central (pequeña) al inicio
  P.concrete(ctx, [[120, 1000], [240, 1000], [300, 1250], [120, 1250]], { joints: 30, stains: 4, seed: 6 }); P.waterBody(ctx, [[-200, 1010], [120, 1010], [120, 1250], [-200, 1250]], t, { surf: [-200, 120, 1012] });
  const lift = [[330, 1170], [360, 1170], [390, 1170]]; ctx.fillStyle = '#5d6f80'; ctx.fillRect(310, 1180, 100, 70);
  let prev = lift; PYL.forEach((x, i) => { const yb = 1250 - (i % 2) * 40; const arms = P.pylon(ctx, x, yb, 300, { c: '#B8CCD8' }); for (let k = 0; k < 3; k++) P.powerLine(ctx, prev[k], arms[k], 40, t, { dots: 2, speed: 260 }); prev = arms; });
  // subestación
  const SX = 2350; ctx.fillStyle = '#3b4a58'; ctx.fillRect(SX - 130, 1180, 260, 80); for (let k = 0; k < 3; k++) P.transformer(ctx, SX - 80 + k * 80, 1140, 45, { n1: 6, n2: 3, flux: 1, t, bg: '#3b4a58' }); for (let k = 0; k < 3; k++) P.powerLine(ctx, prev[k], [SX - 100 + k * 80, 1110], 30, t, { dots: 1, speed: 260 });
  ctx.strokeStyle = 'rgba(184,204,216,0.6)'; ctx.lineWidth = 2; for (let x = SX - 140; x <= SX + 140; x += 14) { ctx.beginPath(); ctx.moveTo(x, 1260); ctx.lineTo(x, 1215); ctx.stroke(); }
  // distribución: postes más bajos hasta la ciudad
  let dprev = [SX + 120, 1150]; [2560, 2780, 3000, 3200].forEach((x) => { ctx.fillStyle = '#6b5640'; ctx.fillRect(x - 5, 1120, 10, 140); ctx.fillRect(x - 30, 1120, 60, 8); P.powerLine(ctx, dprev, [x, 1124], 14, t, { dots: 1, speed: 180 }); dprev = [x, 1124]; });
  P.factory(ctx, 2600, 1255, 150, sm(T.fabricas - 0.2, T.fabricas + 0.2, t)); P.skyline(ctx, 2700, 3000, 1255, sm(T.ciudades18 - 0.3, T.ciudades18 + 0.4, t), 7, { maxH: 280 });
  [3060, 3150, 3240].forEach((x, i) => P.house(ctx, x, 1255, 80, sm(T.hogares - 0.2 + i * 0.12, T.hogares + 0.1 + i * 0.12, t)));
  ctx.restore();
  // rótulos en pantalla según por dónde va la cámara
  pill(ctx, 'LÍNEAS DE ALTA TENSIÓN', 540, 330, 40, t, T.lineas, C.energia, C.fondo, T.ciudades18 - 0.3);
  tag(ctx, 'SUBESTACIÓN: baja el voltaje', 540, 420, 24, sm(1650, 1850, cx) * (1 - sm(2550, 2650, cx)));
  pill(ctx, 'DE LA REPRESA A TU CASA', 540, 330, 42, t, T.ciudades18 - 0.2, C.energia, C.fondo);
  tag(ctx, 'en casa llega con un voltaje mucho menor (p. ej. 120 o 220 V)', 540, 420, 21, sm(T.hogares, T.hogares + 0.3, t));
 }, sfx(k) { FX.lineas(k, TB.red, TB.limpia - TB.red, 1); k.play('whoosh', TB.red + 0.1, { dur: 2.5, top: 900, gain: 0.25 }); FX.etiqueta(k, T.lineas); FX.transformador(k, T.ciudades18 - 1.6, 1.6, 0.8); FX.aparece(k, T.ciudades18, 640); FX.aparece(k, T.fabricas, 720); [0, 0.12, 0.24].forEach((d, i) => FX.aparece(k, T.hogares + d, 780 + i * 60)); FX.correcto(k, T.hogares + 0.5); } });
 // 12 · sin quemar combustible: el ciclo del agua la repone
 B.push({ t0: TB.limpia, t1: TB.ambiente, in: { type: 'iris', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  sky(ctx, 1000, '#16395a', '#7fb3d6'); P.sun(ctx, 170, 470, 60, t);
  mountains(ctx, 950, '#2d5068', 41, 280); P.cloud(ctx, 640, 560, 120, { rain: t > T.increible, t, seed: 3 });
  ctx.fillStyle = '#2f5a3a'; ctx.fillRect(0, 950, W, HH - 950);
  P.waterBody(ctx, [[480, 950], [760, 950], [760, 1150], [480, 1100]], t, { surf: [480, 760, 952] }); P.concrete(ctx, [[760, 930], [800, 930], [880, 1150], [760, 1150]], { joints: 30, stains: 3, seed: 9 });
  P.waterBody(ctx, [[880, 1130], [1100, 1130], [1100, 1170], [880, 1170]], t, { surf: [880, 1100, 1132] });
  ctx.save(); ctx.strokeStyle = 'rgba(56,201,255,0.85)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(150, 960); ctx.bezierCurveTo(280, 1010, 380, 930, 480, 990); ctx.stroke(); ctx.restore();
  // evaporación (flechas onduladas)
  const ea = sm(TB.limpia + 0.3, TB.limpia + 1, t); ctx.save(); ctx.globalAlpha = ea * 0.8; ctx.strokeStyle = C.blanco; ctx.lineWidth = 3; for (let i = 0; i < 3; i++) { const x = 300 + i * 60, u = (t * 0.4 + i / 3) % 1; ctx.beginPath(); for (let y = 0; y < 160; y += 8) { const yy = 900 - y - u * 40; y ? ctx.lineTo(x + Math.sin(y * 0.08) * 8, yy) : ctx.moveTo(x, yy); } ctx.stroke(); } ctx.restore();
  // la central funcionando: rótulo
  P.rings(ctx, 840, 1120, t, { r: 60, n: 2, period: 1, c: '255,212,71', a: 0.7, w: 3 });
  const fa = sm(T.quemar - 0.2, T.quemar + 0.2, t); if (fa > 0) { ctx.save(); ctx.globalAlpha = fa; P.circle(ctx, 540, 1270, 105, 'rgba(6,21,34,0.85)'); flame(ctx, 540, 1285, 75); P.cross(ctx, 540, 1270, 170, E.out(win(t, T.quemar, T.quemar + 0.4)), C.rojo); ctx.restore(); }
  pill(ctx, 'EL CICLO DEL AGUA LLENA EL EMBALSE', 540, 330, 34, t, T.increible, C.agua, C.fondo, T.quemar - 0.1);
  pill(ctx, 'ELECTRICIDAD SIN QUEMAR COMBUSTIBLE', 540, 330, 34, t, T.quemar, C.verde, C.fondo);
  tag(ctx, 'construirla y mantenerla sí genera emisiones', 540, 1400, 22, sm(T.combustible + 0.5, T.combustible + 0.9, t));
 }, sfx(k) { FX.revelar(k, TB.limpia + 0.1); FX.lluvia(k, T.increible, TB.ambiente - T.increible, 1); k.play('sparkle', T.increible, { gain: 0.3, n: 5 }); FX.tachado(k, T.quemar + 0.05); FX.sello(k, T.combustible); } });
 // 13 · impactos ambientales (sobrio): barrera, sedimentos, caudal aguas abajo
 B.push({ t0: TB.ambiente, t1: TB.casa, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  sky(ctx, 700, '#0d2a40', '#4a7a96'); mountains(ctx, 720, '#25455a', 51, 160);
  ctx.fillStyle = '#3a3a2f'; ctx.beginPath(); ctx.moveTo(-20, 900); ctx.lineTo(600, 1250); ctx.lineTo(700, 1250); ctx.lineTo(1100, 1300); ctx.lineTo(1100, HH); ctx.lineTo(-20, HH); ctx.closePath(); ctx.fill();
  P.waterBody(ctx, [[-20, 760], [620, 760], [620, 1250], [-20, 900]], t, { surf: [-20, 620, 762] });
  // sedimentos que se acumulan detrás de la represa
  const sd = sm(T.aunque, T.impactos, t); ctx.fillStyle = '#8a6a44'; ctx.beginPath(); ctx.moveTo(250, 1040); ctx.quadraticCurveTo(450, 1180 - 120 * sd, 620, 1250 - 150 * sd); ctx.lineTo(620, 1250); ctx.lineTo(250, 1100); ctx.closePath(); ctx.fill();
  const R = H.rng(5); for (let i = 0; i < 30; i++) { const x = R.range(0, 600), y0 = R.range(780, 1000), y = y0 + ((t * 30 + R() * 200) % 200); ctx.fillStyle = 'rgba(160,120,80,0.6)'; ctx.beginPath(); ctx.arc(x, Math.min(y, 1230), 3, 0, TAU); ctx.fill(); }
  P.concrete(ctx, [[620, 730], [680, 730], [800, 1260], [620, 1260]], { joints: 34, stains: 6, seed: 4 });
  P.waterBody(ctx, [[800, 1235], [1100, 1260], [1100, 1300], [800, 1262]], t, { surf: [800, 1100, 1240], c1: '#6ccdf0' });
  // peces que suben el río y se topan con el muro
  [[0, 900], [1, 960], [2, 1020]].forEach(([i, y]) => { const x = Math.min(590, ((t * 60 + i * 180) % 700) - 60); P.fish(ctx, x, y, 50, 1, '#9fd4c8'); });
  callout(ctx, 450, 1150, 90, 1330, 'SEDIMENTOS ATRAPADOS', '', sm(T.represa20, T.represa20 + 0.3, t), C.naranja);
  callout(ctx, 640, 950, 670, 600, 'BARRERA PARA PECES', '', sm(T.generar20, T.generar20 + 0.3, t), C.naranja, 'left');
  callout(ctx, 950, 1255, 560, 1400, 'CAMBIA EL RÍO AGUAS ABAJO', '', sm(T.impactos - 0.2, T.impactos + 0.2, t), C.naranja, 'left');
  pill(ctx, 'TAMBIÉN EXISTEN IMPACTOS AMBIENTALES', 540, 330, 34, t, T.impactos, C.naranja, C.fondo);
 }, sfx(k) { FX.corriente(k, TB.ambiente, TB.casa - TB.ambiente, 0.5); FX.burbujas(k, TB.ambiente + 0.5, 3, 4, 7, 0.8); FX.etiqueta(k, T.represa20); FX.etiqueta(k, T.generar20); FX.etiqueta(k, T.impactos - 0.2); FX.campana(k, T.impactos); } });
 // 14 · la bombilla y el viaje de regreso por toda la cadena
 const NODES = [['BOMBILLA', (ctx, x, y) => P.bulb(ctx, x, y, 26, 1)], ['DISTRIBUCIÓN', (ctx, x, y) => P.house(ctx, x, y + 22, 50, 1)], ['SUBESTACIÓN', (ctx, x, y) => P.transformer(ctx, x, y, 26, { n1: 5, n2: 3, bg: '#061522' })], ['LÍNEAS', (ctx, x, y) => P.pylon(ctx, x, y + 30, 64, {})], ['TRANSFORMADOR', (ctx, x, y) => P.transformer(ctx, x, y, 26, { n1: 3, n2: 6, bg: '#061522' })], ['GENERADOR', (ctx, x, y, t) => P.genSection(ctx, x, y, 30, t, {})], ['TURBINA', (ctx, x, y, t) => P.francis(ctx, x, y, 18, t * 3, { casing: false })], ['EMBALSE', (ctx, x, y, t) => P.waterBody(ctx, [[x - 34, y - 12], [x + 34, y - 12], [x + 34, y + 22], [x - 34, y + 22]], t, { surf: [x - 34, x + 34, y - 10] })]];
 B.push({ t0: TB.casa, t1: TB.final, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const on = t >= T.enciendas + 0.25, go = sm(T.recuerda - 0.2, T.recuerda + 0.4, t);
  if (go < 1) { ctx.save(); ctx.globalAlpha = 1 - go; ctx.fillStyle = on ? '#3a3326' : '#16202a'; ctx.fillRect(0, 0, W, HH); ctx.fillStyle = on ? '#4a4030' : '#1d2833'; ctx.fillRect(0, 1250, W, 700);
   ctx.strokeStyle = '#8a97a4'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(540, 0); ctx.lineTo(540, 470); ctx.stroke(); const z = 1 + 3 * sm(T.recuerda - 0.6, T.recuerda + 0.3, t); ctx.save(); ctx.translate(540, 560); ctx.scale(z, z); ctx.translate(-540, -560); P.bulb(ctx, 540, 560, 80, on ? sm(T.enciendas + 0.25, T.enciendas + 0.45, t) : 0); ctx.restore();
   P.switchWall(ctx, 820, 950, 120, on); const fy = lerp(1300, 1010, E.out(win(t, T.asi21 + 0.2, T.enciendas))); const press = win(t, T.enciendas, T.enciendas + 0.2) * (1 - win(t, T.enciendas + 0.4, T.enciendas + 0.7)); P.finger(ctx, 850, fy, 110, press);
   ctx.restore(); }
  if (go > 0) { ctx.save(); ctx.globalAlpha = go; ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 260, 500, '255,226,140', 0.5 * (1 - sm(T.recuerda + 0.3, T.recuerda + 1.2, t)));
   const y0 = 420, dy = 120; ctx.strokeStyle = 'rgba(245,250,255,0.25)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(300, y0); ctx.lineTo(300, y0 + dy * 7); ctx.stroke();
   NODES.forEach(([s, fn], i) => { const ti = T.recuerda + 0.4 + i * (T.agua21 + 0.35 - T.recuerda - 0.4) / 7, a = sm(ti - 0.15, ti + 0.1, t), y = y0 + i * dy; ctx.save(); ctx.globalAlpha = go * (0.25 + 0.75 * a); P.circle(ctx, 300, y, 48, a > 0.5 ? (i === 7 ? '#1268A8' : '#132b40') : '#0d1d2b'); fn(ctx, 300, y, t); ctx.font = '800 34px Nunito'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = a > 0.5 ? (i === 0 ? C.energia : i === 7 ? C.agua : C.blanco) : 'rgba(245,250,255,0.4)'; ctx.fillText(s, 380, y); ctx.restore(); if (a > 0.5 && a < 1) P.glow(ctx, 300, y, 80, '255,212,71', 0.6 * (1 - a)); });
   const k = win(t, T.recuerda + 0.4, T.agua21 + 0.35); P.glow(ctx, 300, y0 + k * dy * 7, 40, '255,212,71', 0.9);
   ctx.restore(); }
  pill(ctx, '¡CLIC!', 820, 760, 40, t, T.enciendas, C.energia, C.fondo, T.recuerda);
  pill(ctx, 'EL CAMINO AL REVÉS', 540, 300, 38, t, T.recuerda + 0.3, C.energia, C.fondo);
 }, sfx(k) { FX.aparece(k, TB.casa + 0.2, 500); FX.bombilla(k, T.enciendas + 0.25); k.play('whoosh', T.recuerda - 0.2, { dur: 0.8, top: 3000, gain: 0.4 }); for (let i = 0; i < 8; i++) { const ti = T.recuerda + 0.4 + i * (T.agua21 + 0.35 - T.recuerda - 0.4) / 7; k.play('pop', ti, { f: 900 - i * 70, gain: 0.3, minor: true }); } FX.corriente(k, T.agua21 - 0.2, 1.5, 0.6); } });
 // 15 · todo comenzó con el agua → «Sigue a Asombroteca» (misma toma monumental, sin pantalla negra)
 B.push({ t0: TB.final, t1: DURATION + 1, in: { type: 'iris', d: 0.6, x: 300, y: 1260 }, draw(ctx, t) {
  const cam = P.camAt([[TB.final, 540, 980, 1.4], [T.sigue, 540, 900, 1.08], [DURATION, 540, 880, 1.0]], t);
  ctx.save(); P.camApply(ctx, cam); frontDam(ctx, t, { city: 1, dots: 3 }); ctx.restore(); scrim(ctx);
  pill(ctx, 'TODO COMENZÓ CON EL AGUA', 540, 330, 44, t, T.represa21 - 0.1, C.agua, C.fondo, T.sigue + 0.2);
  P.withPop(ctx, t, T.sigue + 0.1, 540, 420, () => { P.rr(ctx, 230, 360, 620, 120, 30, 'rgba(6,21,34,0.78)'); P.text(ctx, 'ASOMBROTECA', 540, 422, 64, C.blanco, { kind: 'title' }); });
  const press = win(t, T.asombroteca + 1.0, T.asombroteca + 1.2), done = t > T.asombroteca + 1.15;
  P.withPop(ctx, t, T.asombroteca + 0.2, 540, 560, () => { P.rr(ctx, 380, 515, 320, 86, 43, done ? '#2fbf71' : C.energia, { sy: 8 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 560, 36, C.fondo); });
  if (t > T.asombroteca + 0.4) P.finger(ctx, 600, lerp(900, 580, E.out(win(t, T.asombroteca + 0.4, T.asombroteca + 1.0))), 90, press * (1 - win(t, T.asombroteca + 1.3, T.asombroteca + 1.6)));
 }, sfx(k) { FX.revelar(k, TB.final + 0.1); FX.corriente(k, TB.final, DURATION - TB.final, 0.7); FX.sello(k, T.represa21); FX.aparece(k, T.sigue + 0.1, 600); FX.clic(k, T.asombroteca + 1.15); k.play('ding', T.asombroteca + 1.2, { f: 'A5', gain: 0.3 }); FX.fin(k, T.asombroteca + 1.5); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['concreto', 'electricidad', 'agua', 'embalse', 'altura', 'energía', 'compuertas', 'tuberías', 'turbina', 'álabes', 'molino', 'generador', 'imanes', 'bobinas', 'inducción', 'electromagnética', 'río', 'transformadores', 'voltaje', 'transmisión', 'hogares', 'combustible', 'ambientales', 'bombilla', 'represa', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 220, gain: 0.03, a: 1, hold: DURATION - 2 }); },
  music(k) {
   k.music('pad', 0, T.cuando6, { bpm: 84, gain: 0.42, chords: [['D2', 'A2', 'F3', 'C4'], ['Bb1', 'F2', 'D3', 'A3'], ['G2', 'D3', 'Bb3', 'F4'], ['A2', 'E3', 'C#4', 'E4']] });
   k.music('pulse', T.cuando6, T.dentro, { bpm: 100, gain: 0.24, chords: [['D3', 'A3', 'F4', 'C5'], ['Bb2', 'F3', 'D4', 'A4'], ['C3', 'G3', 'E4', 'G4'], ['A2', 'E3', 'C#4', 'E4']] });
   k.music('pad', T.dentro, T.despues, { bpm: 92, gain: 0.38, chords: [['F2', 'C3', 'A3', 'E4'], ['G2', 'D3', 'B3', 'D4'], ['A2', 'E3', 'C4', 'G4']] });
   k.music('pulse', T.despues, T.aunque, { bpm: 108, gain: 0.25, chords: [['D3', 'A3', 'F#4', 'C#5'], ['B2', 'F#3', 'D4', 'A4'], ['G2', 'D3', 'B3', 'F#4'], ['A2', 'E3', 'C#4', 'E4']] });
   k.music('pad', T.aunque, T.asi21, { bpm: 76, gain: 0.32, chords: [['B1', 'F#2', 'D3', 'A3'], ['G1', 'D2', 'B2', 'F#3']] });
   k.music('pad', T.asi21, DURATION, { bpm: 88, gain: 0.4, chords: [['G2', 'D3', 'B3', 'F#4'], ['A2', 'E3', 'C#4', 'E4'], ['D3', 'A3', 'F#4', 'A4']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
