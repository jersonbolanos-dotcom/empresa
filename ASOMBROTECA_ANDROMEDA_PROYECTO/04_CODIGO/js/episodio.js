// =====================================================================================================
// episodio.js — «¿Podrías llegar a otra galaxia en solo 29 años?» · Asombroteca · PLANTILLA ASOMBROTECA v1.11 · V2 (rediseño cinematográfico)
// Modelo: aceleración propia constante 1 g la 1.ª mitad y frenado simétrico la 2.ª, D ≈ 2,5 millones de años luz,
// trayecto rectilíneo, sin efectos gravitatorios ni cosmológicos. P.REL.trip → τ ≈ 28,6 años (nave), t ≈ 2.500.002
// años (Tierra). TODOS los relojes, velocidades y distancias en pantalla salen de esa simulación (verificada aparte en
// FUENTES_Y_DECISIONES.md). Reloj del video = segundos de la voz original. Determinista.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const C = { espacio: '#02040D', cosmico: '#081B42', nebula: '#5734A6', cian: '#36D9FF', azul: '#258BFF', motor: '#69F3FF', blanco: '#F6FAFF', dorado: '#FFC86B', tierra: '#FFB45B', nave: '#46E6D2', oro: '#FFD447', alerta: '#FF695F' };
 // ---------------- simulación relativista (fuente única de todos los números) ----------------
 const TRIP = P.REL.trip(2.5e6); // τ ≈ 28,6 a · t ≈ 2.500.002 a
 const fmtY = (v) => Math.round(v).toLocaleString('es-CO');
 const fmtTau = (v) => v.toFixed(1).replace('.', ',');
 const T = {
  imagina: SG(0).s, galaxia0: wt(0, 'galaxia'), menos: wt(0, 'menos'), t30: wt(0, '30'), mientras: SG(1).s, tierra1: wt(1, 'tierra'), millones1: wt(1, 'millones'),
  parece: SG(2).s, imposible: wt(2, 'imposible'), pero3: SG(3).s, relatividad: wt(3, 'relatividad'), einstein3: wt(3, 'einstein'), existe: SG(4).s, superar4: wt(4, 'superar'), luz4: wt(4, 'luz'),
  la5: SG(5).s, andromeda5: wt(5, 'andrómeda'), millones5: wt(5, 'millones'), luz5: wt(5, 'luz'), nosotros: wt(5, 'nosotros'),
  eso6: SG(6).s, luz6: wt(6, 'luz'), tarda: wt(6, 'tarda'), millones6: wt(6, 'millones'), alli: wt(6, 'allí'),
  entonces: SG(7).s, persona: wt(7, 'persona'), vida7: wt(7, 'vida'), la8: SG(8).s, tiempo8: wt(8, 'tiempo'),
  einstein9: SG(9).s, descubrio: wt(9, 'descubrió'), igual: wt(9, 'igual'), todos: wt(9, 'todos'),
  cuando10: SG(10).s, nave10: wt(10, 'nave'), cercanas10: wt(10, 'cercanas'), ocupantes: wt(10, 'ocupantes'), lentamente: wt(10, 'lentamente'), tierra10: wt(10, 'tierra'),
  este11: SG(11).s, dilatacion: wt(11, 'dilatación'), tiempo11: wt(11, 'tiempo'),
  ahora12: SG(12).s, acelerar12: wt(12, 'acelerar'), continuamente: wt(12, 'continuamente'), gravedad: wt(12, 'gravedad'), terrestre: wt(12, 'terrestre'),
  durante13: SG(13).s, primera: wt(13, 'primera'), aceleraria: wt(13, 'aceleraría'), extremadamente: wt(13, 'extremadamente'), luz13: wt(13, 'luz'),
  despues: SG(14).s, frenar: wt(14, 'frenar'), segunda: wt(14, 'segunda'), destino: wt(14, 'destino'),
  y15: SG(15).s, extraordinario: wt(15, 'extraordinario'), en16: SG(16).s, astronautas16: wt(16, 'astronautas'), aproximadamente16: wt(16, 'aproximadamente'), t29: wt(16, '29'), anos16: wt(16, 'años'),
  pero17: SG(17).s, tierra17: wt(17, 'tierra'), millones17: wt(17, 'millones'), anos17: wt(17, 'años'),
  y18: SG(18).s, distancia18: wt(18, 'distancia'), porque: SG(19).s, velocidades19: wt(19, 'velocidades'), distancia19: wt(19, 'distancia'), contraeria: wt(19, 'contraería'), viajeros: wt(19, 'viajeros'),
  es20: SG(20).s, no21: SG(21).s, superar21: wt(21, 'superar'), luz21: wt(21, 'luz'), vida21: wt(21, 'vida'),
  pero22: SG(22).s, gigantesco: wt(22, 'gigantesco'), una23: SG(23).s, energia: wt(23, 'energía'), tecnologias: wt(23, 'tecnologías'), existen: wt(23, 'existen'),
  y24: SG(24).s, construirla: wt(24, 'construirla'), precio: wt(24, 'precio'), increible: wt(24, 'increíble'),
  todo25: SG(25).s, conocieron: wt(25, 'conocieron'), millones25: wt(25, 'millones'), pasado: wt(25, 'pasado'),
  asi26: SG(26).s, misterio: wt(26, 'misterio'), fisica: wt(26, 'física'), sino: SG(27).s, tecnologia27: wt(27, 'tecnología'), realidad: wt(27, 'realidad'),
  sigue: SG(28).s, asombroteca: wt(28, 'asombroteca'), end: A.speech_end,
 };
 const TB = { posible: T.parece - 0.15, escala: T.la5 - 0.2, luz: T.eso6 - 0.15, cabina: T.entonces - 0.2, einstein: T.einstein9 - 0.15, dilat: T.cuando10 - 0.2, g: T.ahora12 - 0.2, acel: T.durante13 - 0.15, fren: T.despues - 0.15, revel: T.y15 - 0.2, tierra: T.pero17 - 0.15, contr: T.y18 - 0.15, sinc: T.es20 - 0.15, energia: T.pero22 - 0.15, llegada: T.y24 - 0.2, final: T.asi26 - 0.2, cierre: T.sigue - 0.15 };

 // ---------------- utilidades (V2) ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, px, a, c = 'rgba(246,250,255,0.98)') => { if (a <= 0.01) return; px = Math.max(px, 22); ctx.save(); ctx.globalAlpha = a; ctx.font = `600 ${px}px "IBM Plex Mono"`; let w = ctx.measureText(s).width + px * 1.2; if (w > 1020) { px *= 1000 / w; ctx.font = `600 ${px}px "IBM Plex Mono"`; w = ctx.measureText(s).width + px * 1.2; } P.rr(ctx, x - w / 2, y - px * 0.85, w, px * 1.7, px * 0.85, 'rgba(2,4,13,0.75)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, x, y + 1); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 700} ${px}px ${o.f || '"Space Grotesk"'}`; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8; ctx.fillText(s, x, y); ctx.restore(); };
 const card = (ctx, x, y, w, h, a, fn) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x, y, w, h, 26, 'rgba(3,6,16,0.86)'); ctx.strokeStyle = 'rgba(54,217,255,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, w, h, 26); ctx.stroke(); fn(); ctx.restore(); };
 // fondo: espacio profundo con paralaje (la cámara «viaja» con px/py)
 const space = (ctx, t, o = {}) => P.deepSpace(ctx, t, { px: o.px ?? t * 14, py: o.py ?? t * 5, streak: o.streak || 0, dir: o.dir, neb: o.neb });
 const AND = (ctx, x, y, r, o = {}) => P.galaxyHD(ctx, x, y, r, { seed: 31, tilt: 0.36, rot: -0.55, spin: o.spin || 0, a: o.a });
 const MW = (ctx, x, y, r, o = {}) => P.galaxyHD(ctx, x, y, r, { seed: 7, tilt: o.tilt ?? 0.85, rot: 0.3, spin: o.spin || 0, a: o.a });
 const ship = (ctx, x, y, s, t, o = {}) => P.starship(ctx, x, y, s, t, o);
 // relojes holográficos de los dos observadores, SIEMPRE desde la simulación (f = fracción del tiempo propio)
 const clocks2 = (ctx, f, y, a = 1, r = 165) => { if (a <= 0) return; const s = TRIP.at(f); ctx.save(); ctx.globalAlpha *= a; P.holoClock(ctx, 280, y, r, 60 * f, C.nave, 'NAVE', fmtTau(s.tau) + ' años', { sub: 'tiempo propio' }); P.holoClock(ctx, 800, y, r, 60 * s.t / TRIP.tTot, C.tierra, 'TIERRA', fmtY(s.t), { sub: 'años · marco de partida' }); ctx.restore(); };

 // ================= BEATS (V2) =================
 const B = [];
 // 1 · gancho: primer plano de la nave cruzando hacia Andrómeda · relojes holográficos
 B.push({ t0: 0, t1: TB.posible, draw(ctx, t) {
  space(ctx, t, { px: t * 60 }); AND(ctx, 760, 420, 380 + t * 10);
  const k = E.out(win(t, 0, 3.2)); ship(ctx, lerp(-260, 470, k), lerp(1080, 880, k), lerp(420, 330, k), t, { yaw: lerp(-0.9, -0.45, k), pitch: 0.12, roll: 0.25, thrust: 1 });
  const f = E.inOut(win(t, T.menos - 0.2, T.millones1 + 0.4)); clocks2(ctx, f, 1290, sm(T.menos - 0.5, T.menos - 0.1, t), 160);
  pill(ctx, '≈ 29 AÑOS EN LA NAVE', 280, 1060, 30, t, T.t30, C.nave, C.espacio);
  pill(ctx, 'MILLONES EN LA TIERRA', 800, 1060, 30, t, T.millones1, C.tierra, C.espacio);
 }, sfx(k) { FX.espacio(k, 0, TB.posible + 0.5, 1); FX.pasada(k, 0.2, 2.6, 1); FX.propulsion(k, 0, 3.5, 0.7); FX.holo(k, T.menos - 0.4); FX.reloj(k, T.menos, 14, 0.12, 0.8, 2200); FX.reloj(k, T.tierra1, 20, 0.07, 0.8, 1500); FX.sello(k, T.t30); FX.sello(k, T.millones1); } });
 // 2 · ¿imposible? sin superar la luz: la nave persigue un rayo de luz que siempre va delante
 B.push({ t0: TB.posible, t1: TB.escala, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const f = E.inOut(win(t, T.pero3, T.luz4)), om = Math.pow(10, -lerp(0.3, 6, f));
  space(ctx, t, { px: t * 120, streak: 0.15 + 0.35 * f, dir: 0 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(255,212,71,0)'); g.addColorStop(1, 'rgba(255,212,71,0.95)'); ctx.fillStyle = g; ctx.fillRect(0, 618, W, 6); P.glow(ctx, W - 30, 621, 110, '255,212,71', 0.95); ctx.restore(); txt(ctx, 'LUZ', 70, 585, 30, C.oro, { al: 'left', f: '"IBM Plex Mono"' });
  ship(ctx, lerp(380, 640, 1 - Math.sqrt(om)), 830, 250, t, { yaw: -0.3, pitch: 0.05, roll: 0.2, thrust: 1 }); txt(ctx, 'NAVE', 70, 770, 30, C.nave, { al: 'left', f: '"IBM Plex Mono"' });
  P.speedGauge(ctx, 540, 1230, 190, om, {});
  pill(ctx, '¿IMPOSIBLE?', 540, 330, 54, t, T.imposible - 0.1, C.blanco, C.espacio, T.relatividad);
  pill(ctx, 'RELATIVIDAD DE EINSTEIN', 540, 330, 44, t, T.relatividad, C.cian, C.espacio, T.superar4);
  pill(ctx, 'SIN SUPERAR LA VELOCIDAD DE LA LUZ', 540, 330, 36, t, T.superar4, C.oro, C.espacio);
  tag(ctx, 'se acerca a c, pero nunca la alcanza', 540, 1415, 26, sm(T.luz4, T.luz4 + 0.3, t));
 }, sfx(k) { FX.espacio(k, TB.posible, TB.escala - TB.posible, 0.8); FX.onomatopeya(k, T.imposible); FX.revelar(k, T.relatividad); FX.aceleracion(k, T.pero3, T.luz4 - T.pero3 + 0.2, 0.7); FX.sello(k, T.superar4); } });
 // 3 · escala: de la Tierra a la Vía Láctea y a Andrómeda (zoom continuo hacia atrás)
 B.push({ t0: TB.escala, t1: TB.luz, in: { type: 'zoom', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  const z = E.inOut(win(t, TB.escala, T.andromeda5 + 0.5)); space(ctx, t, { px: z * 600, py: z * 200 });
  const ea = 1 - sm(0.12, 0.42, z); if (ea > 0) { ctx.save(); ctx.globalAlpha = ea; const r = lerp(380, 6, sm(0, 0.42, z)); P.globe(ctx, 330, 1150, r, t * 0.3); ctx.restore(); tag(ctx, 'TIERRA', 330, 1150 + Math.max(50, r + 40), 26, ea); }
  const mw = sm(0.18, 0.55, z); if (mw > 0) { MW(ctx, 330, 1150, lerp(1500, 260, sm(0.2, 0.92, z)), { a: mw, spin: t * 0.01 }); tag(ctx, 'VÍA LÁCTEA', 330, 1450, 26, sm(0.75, 1, z)); }
  const an = sm(0.55, 1, z); if (an > 0) { AND(ctx, 770, 560, 300, { a: an }); tag(ctx, 'ANDRÓMEDA', 770, 760, 26, an); }
  const la = sm(T.millones5 - 0.4, T.millones5, t); if (la > 0) { ctx.save(); ctx.globalAlpha = la; ctx.setLineDash([16, 14]); ctx.strokeStyle = C.cian; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(420, 1060); ctx.lineTo(700, 640); ctx.stroke(); ctx.restore(); }
  pill(ctx, '2,5 MILLONES DE AÑOS LUZ', 540, 330, 44, t, T.millones5, C.cian, C.espacio);
  tag(ctx, 'escala comprimida · real: ≈ 25 diámetros de la Vía Láctea', 540, 430, 22, sm(T.luz5, T.luz5 + 0.4, t));
 }, sfx(k) { FX.galaxia(k, TB.escala + 0.3, 0.8); k.play('whoosh', T.andromeda5 - 0.5, { dur: 2, top: 900, gain: 0.35 }); FX.galaxia(k, T.andromeda5 + 0.2, 1); FX.sello(k, T.millones5); } });
 // 4 · incluso la luz tarda ≈ 2,5 millones de años
 B.push({ t0: TB.luz, t1: TB.cabina, in: { type: 'cut' }, draw(ctx, t) {
  space(ctx, t, { px: 600 + (t - TB.luz) * 10, py: 200 }); MW(ctx, 330, 1150, 260, { spin: t * 0.01 }); AND(ctx, 770, 560, 300);
  ctx.save(); ctx.setLineDash([16, 14]); ctx.strokeStyle = 'rgba(54,217,255,0.45)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(420, 1060); ctx.lineTo(700, 640); ctx.stroke(); ctx.restore();
  const p = E.inOut(win(t, T.tarda, T.alli + 0.2)), px = lerp(420, 700, p), py = lerp(1060, 640, p); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const q = Math.max(0, p - i * 0.02); P.glow(ctx, lerp(420, 700, q), lerp(1060, 640, q), 70 - i * 9, '255,212,71', 0.9 - i * 0.13); } ctx.restore(); P.circle(ctx, px, py, 9, '#fff6d0');
  P.counter(ctx, 540, 1360, 72, t, T.tarda, T.alli + 0.2, 0, 2500000, { box: C.oro, c: C.espacio, suffix: ' años', fmt: fmtY });
  pill(ctx, 'LA LUZ TARDA ≈ 2,5 MILLONES DE AÑOS', 540, 330, 34, t, T.tarda, C.oro, C.espacio);
  tag(ctx, 'tiempo medido en el marco de las galaxias', 540, 430, 24, sm(T.tarda, T.tarda + 0.4, t));
 }, sfx(k) { FX.espacio(k, TB.luz, TB.cabina - TB.luz, 0.8); FX.senal(k, T.tarda, 0.8, 1800); FX.contador(k, T.tarda, T.alli + 0.2, 0, 40); FX.ubicacion(k, T.alli + 0.2); } });
 // 5 · ¿durante su propia vida? el secreto está en el tiempo (cabina, reloj holográfico)
 B.push({ t0: TB.cabina, t1: TB.einstein, in: { type: 'iris', d: 0.6, x: 540, y: 700 }, draw(ctx, t) {
  P.cockpit(ctx, t, (x, y, w, h) => { space(ctx, t, { px: t * 20 }); AND(ctx, x + w * 0.62, y + h * 0.42, 260); }, { wy: 300, wh: 760 });
  const ca = sm(T.la8 - 0.3, T.la8, t), z = 1 + 0.15 * sm(T.tiempo8 - 0.2, T.tiempo8 + 0.6, t); if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; ctx.translate(540, 700); ctx.scale(z, z); ctx.translate(-540, -700); P.holoClock(ctx, 540, 700, 200, (t - TB.cabina) * 6, C.nave, 'RELOJ DE A BORDO', 'su tiempo', { sub: 'avanza normal para ellos' }); ctx.restore(); }
  pill(ctx, '¿EN UNA VIDA HUMANA?', 540, 230, 40, t, T.persona, C.blanco, C.espacio, T.la8);
  pill(ctx, 'EL SECRETO ESTÁ EN EL TIEMPO', 540, 230, 38, t, T.tiempo8 - 0.1, C.nave, C.espacio);
 }, sfx(k) { FX.revelar(k, TB.cabina + 0.1); k.play('boot', TB.cabina + 0.4, { gain: 0.4 }); FX.etiqueta(k, T.persona); FX.holo(k, T.la8 - 0.2); FX.tictac(k, T.la8, 5, 0.4); FX.sello(k, T.tiempo8); } });
 // 6 · Einstein → diagrama espacio-tiempo de los 3 primeros años a bordo (la línea de la nave se curva hacia la de la luz)
 const early = (f) => TRIP.at(f * 3 / TRIP.tauTot);
 B.push({ t0: TB.einstein, t1: TB.dilat, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  space(ctx, t, { neb: 0.35 });
  const ea = 1 - sm(T.igual - 0.1, T.igual + 0.4, t); if (ea > 0) { P.scientist(ctx, 540, 1200, 620, { a: ea * 0.9, c: '#cfe6ff' }); tag(ctx, 'Albert Einstein · relatividad especial (1905)', 540, 1290, 24, ea * sm(TB.einstein, TB.einstein + 0.4, t)); }
  const da = sm(T.igual - 0.2, T.igual + 0.3, t); if (da > 0) { const p = E.inOut(win(t, T.igual, T.todos + 0.6)); ctx.save(); ctx.globalAlpha = da; const map = P.chart(ctx, 190, 520, 800, 700, [{ f: (u) => [0, u * 11], c: C.tierra, w: 7, label: 'TIERRA', al: 'left', dx: 16, dy: 0 }, { f: (u) => [u * 11, u * 11], c: C.oro, w: 3, dash: [12, 10], label: 'luz', dy: -20 }, { f: (u) => { const s = early(u); return [s.x, s.t]; }, c: C.nave, w: 7, label: 'NAVE', dy: 30, dx: 0 }], { xr: [0, 11], yr: [0, 11], p, xTicks: [[0, '0'], [5, '5'], [10, '10']], yTicks: [[0, '0'], [5, '5'], [10, '10']], xLabel: 'distancia (años luz)', yLabel: 'tiempo en la Tierra (años)' });
   for (let k = 1; k <= 3; k++) { const s = early(k / 3); if (p < k / 3) continue; const [x, y] = map(s.x, s.t); P.circle(ctx, x, y, 10, C.nave); txt(ctx, k + ' año' + (k > 1 ? 's' : '') + ' a bordo', x - 18, y + 4, 22, C.nave, { al: 'right', f: '"IBM Plex Mono"', w: 600 }); } ctx.restore(); }
  pill(ctx, 'RELATIVIDAD ESPECIAL', 540, 330, 46, t, T.descubrio, C.cian, C.espacio);
  tag(ctx, '3 años a bordo ≈ 10,7 años en la Tierra (a 1 g)', 540, 1415, 24, sm(T.todos, T.todos + 0.3, t));
 }, sfx(k) { FX.revelar(k, TB.einstein + 0.1); FX.sello(k, T.descubrio); k.play('stroke', T.igual, { material: 'chalk', dur: 1.4, gain: 0.25 }); FX.holo(k, T.igual); } });
 // 7 · dilatación: dos observadores, cada uno con su reloj normal → al comparar, la diferencia crece
 B.push({ t0: TB.dilat, t1: TB.g, in: { type: 'cut' }, draw(ctx, t) {
  const cmp = sm(T.lentamente - 0.3, T.lentamente + 0.3, t);
  if (cmp < 1) { ctx.save(); ctx.globalAlpha = 1 - cmp;
   // arriba: observador terrestre
   space(ctx, t, { neb: 0.4 }); P.globe(ctx, 300, 640, 230, t * 0.4); P.holoClock(ctx, 800, 640, 165, (t - TB.dilat) * 12, C.tierra, 'RELOJ EN LA TIERRA', fmtTimeLocal(t), { sub: 'ritmo normal' });
   // abajo: observador en la nave (cabina)
   ctx.save(); ctx.beginPath(); ctx.rect(0, 900, W, 560); ctx.clip(); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 900, W, 560); ctx.save(); ctx.beginPath(); ctx.roundRect(60, 940, 560, 480, 40); ctx.clip(); P.space(ctx, { haze: false }); P.starfield(ctx, t, { cy: 1180, eta: 1.2, F: 300 }); ctx.restore(); ctx.strokeStyle = '#3d4f66'; ctx.lineWidth = 16; ctx.beginPath(); ctx.roundRect(60, 940, 560, 480, 40); ctx.stroke(); P.holoClock(ctx, 840, 1180, 165, (t - TB.dilat) * 12, C.nave, 'RELOJ EN LA NAVE', fmtTimeLocal(t), { sub: 'ritmo normal' }); ctx.restore();
   ctx.fillStyle = 'rgba(54,217,255,0.5)'; ctx.fillRect(0, 898, W, 3); tag(ctx, 'cada uno ve su propio reloj avanzar normal', 540, 900, 24, sm(T.ocupantes - 0.4, T.ocupantes, t));
   ctx.restore(); }
  if (cmp > 0) { space(ctx, t, { neb: 0.35 }); ctx.save(); ctx.globalAlpha = cmp; const p = E.inOut(win(t, T.lentamente, T.dilatacion + 0.2));
   P.chart(ctx, 200, 520, 790, 640, [{ f: (u) => { const s = TRIP.at(u); return [s.tau, Math.max(1, s.t)]; }, c: C.tierra, w: 7, label: 'TIERRA', dy: -26 }, { f: (u) => [u * TRIP.tauTot, Math.max(1, u * TRIP.tauTot)], c: C.nave, w: 5, dash: [12, 10], label: 'NAVE (sin relatividad sería igual)', dy: 32, dx: -10 }], { xr: [0, TRIP.tauTot], yr: [1, 1e7], logY: true, p, xTicks: [[0, '0'], [10, '10'], [20, '20'], [TRIP.tauTot, '28,6']], yTicks: [[1, '1'], [100, '100'], [1e4, '10.000'], [1e6, '1 millón']], xLabel: 'años en el reloj de la nave', yLabel: 'años en la Tierra (escala log)' });
   ctx.restore(); card(ctx, 140, 1290, 800, 120, cmp, () => txt(ctx, 'a 0,99 c:  1 año a bordo ≈ 7 años en la Tierra', 540, 1350, 30, C.blanco, { f: '"IBM Plex Mono"', w: 600 })); }
  pill(ctx, 'CERCA DE LA VELOCIDAD DE LA LUZ', 540, 300, 36, t, T.cercanas10, C.blanco, C.espacio, T.dilatacion);
  pill(ctx, 'DILATACIÓN DEL TIEMPO', 540, 300, 48, t, T.dilatacion, C.nave, C.espacio);
 }, sfx(k) { FX.espacio(k, TB.dilat, TB.g - TB.dilat, 0.7); FX.etiqueta(k, T.cercanas10); FX.holo(k, TB.dilat + 0.3); FX.tictac(k, TB.dilat + 0.5, 8, 0.5); k.play('whoosh', T.lentamente - 0.3, { dur: 0.8, top: 1800, gain: 0.3 }); k.play('stroke', T.lentamente, { material: 'pen', dur: 2.5, gain: 0.2 }); FX.sello(k, T.dilatacion); FX.campo(k, T.dilatacion + 0.2, 1, 0.6); } });
 // 8 · 1 g: los motores se encienden gradualmente; a bordo se siente como el peso en la Tierra
 B.push({ t0: TB.g, t1: TB.acel, in: { type: 'iris', d: 0.6, x: 540, y: 700 }, draw(ctx, t) {
  const ig = sm(T.acelerar12 - 0.4, T.continuamente + 0.6, t); space(ctx, t, { px: 300 + (t - TB.g) * (10 + 50 * ig) });
  ship(ctx, 560, 660, 360, t, { yaw: -0.55 + (t - TB.g) * 0.05, pitch: 0.1, roll: 0.35, thrust: ig });
  card(ctx, 150, 930, 780, 460, sm(T.continuamente - 0.3, T.continuamente, t), () => { ctx.fillStyle = '#16243a'; ctx.fillRect(190, 970, 700, 360); ctx.fillStyle = '#3d4f66'; ctx.fillRect(190, 1290, 700, 40); txt(ctx, 'SUELO (hacia los motores)', 540, 1311, 22, C.blanco, { f: '"IBM Plex Mono"', w: 600 }); P.worker(ctx, 540, 1290, 240, 0, { pose: 'stand', c: '#cfe6ff', cloth: '#46E6D2' }); P.forceArrow(ctx, 780, 1230, 220, 1, C.nave, 'a', { w: 24, px: 32 }); P.forceArrow(ctx, 310, 1030, 160, -1, C.tierra, 'peso', { w: 24, px: 30, align: 'right' }); });
  pill(ctx, 'ACELERACIÓN CONSTANTE', 540, 300, 42, t, T.acelerar12, C.motor, C.espacio, T.gravedad);
  pill(ctx, 'ACELERACIÓN ≈ 1 g', 540, 300, 52, t, T.gravedad, C.oro, C.espacio);
  tag(ctx, 'a bordo se siente como la gravedad de la Tierra', 540, 1415, 24, sm(T.terrestre, T.terrestre + 0.4, t));
 }, sfx(k) { FX.encendido(k, T.acelerar12 - 0.4, 2.2, 1); FX.propulsion(k, T.continuamente, TB.acel - T.continuamente + 0.5, 1); FX.etiqueta(k, T.continuamente); FX.sello(k, T.gravedad); } });
 // 9 · primera mitad: acelerar hasta casi c — la nave sube, las estrellas se agrupan al frente (aberración)
 const fAcel = (t) => 0.5 * E.inOut(win(t, T.durante13, T.luz13 + 0.2));
 B.push({ t0: TB.acel, t1: TB.fren, in: { type: 'cut' }, draw(ctx, t) {
  const f = fAcel(t), s = TRIP.at(f), etaVis = Math.min(s.eta, 3.2);
  P.space(ctx, { haze: false }); P.starfield(ctx, t, { eta: etaVis, cy: 420, F: 560 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = H.rng(5); for (let i = 0; i < 40; i++) { const x = R() * W, sp = (300 + 2200 * cl(etaVis / 3.2)) * (0.5 + R()), y = ((R() * HH + t * sp) % (HH + 200)) - 100, L = 10 + 120 * cl(etaVis / 3.2); ctx.strokeStyle = `rgba(160,220,255,${0.25 + 0.3 * R()})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - L); ctx.stroke(); } ctx.restore();
  ship(ctx, 540, 720, 330, t, { pitch: Math.PI / 2, yaw: 0.35, roll: 0.5 + t * 0.05, thrust: 1 });
  P.speedGauge(ctx, 290, 1270, 165, s.oneMinusBeta, {});
  P.holoClock(ctx, 800, 1270, 165, 60 * f * 2, C.nave, 'NAVE', fmtTau(s.tau) + ' años', { sub: 'γ ≈ ' + (s.gamma < 1000 ? s.gamma.toFixed(1).replace('.', ',') : fmtY(s.gamma)) });
  pill(ctx, 'PRIMERA MITAD: ACELERAR', 540, 230, 40, t, T.primera, C.motor, C.espacio, T.extremadamente);
  pill(ctx, 'VELOCIDAD → CASI c', 540, 230, 48, t, T.extremadamente, C.oro, C.espacio);
  tag(ctx, 'estrellas agrupadas al frente: aberración (efecto estilizado)', 540, 320, 22, sm(T.aceleraria, T.aceleraria + 0.4, t));
 }, sfx(k) { FX.propulsion(k, TB.acel, TB.fren - TB.acel, 0.9); FX.aceleracion(k, T.durante13, T.luz13 - T.durante13 + 0.2, 1); FX.etiqueta(k, T.primera); FX.sello(k, T.extremadamente); } });
 // 10 · segunda mitad: gira 180° (motores hacia el destino) y frena gradualmente
 B.push({ t0: TB.fren, t1: TB.revel, in: { type: 'cut' }, draw(ctx, t) {
  const flip = E.inOut(win(t, T.despues, T.frenar)), f = 0.5 + 0.5 * E.inOut(win(t, T.frenar, T.destino + 0.4)), s = TRIP.at(f);
  P.space(ctx, { haze: false }); P.starfield(ctx, t, { eta: Math.min(s.eta, 3.2), cy: 420, F: 560 });
  ship(ctx, 540, 720, 330, t, { pitch: Math.PI / 2 + Math.PI * flip, yaw: 0.35, roll: 0.5, thrust: flip < 0.12 || flip > 0.88 ? 1 : 0.1 });
  P.speedGauge(ctx, 290, 1270, 165, s.oneMinusBeta, {}); P.holoClock(ctx, 800, 1270, 165, 60 * f, C.nave, 'NAVE', fmtTau(s.tau) + ' años', { sub: 'frenando' });
  ctx.save(); ctx.fillStyle = 'rgba(246,250,255,0.15)'; ctx.fillRect(120, 1075, 840, 12); ctx.fillStyle = C.motor; ctx.fillRect(120, 1075, 420, 12); ctx.fillStyle = C.alerta; ctx.fillRect(540, 1075, 840 * Math.max(0, f - 0.5), 12); P.circle(ctx, 120 + 840 * (s.x / TRIP.D), 1081, 14, C.blanco); ctx.restore();
  pill(ctx, 'GIRA Y FRENA', 540, 230, 48, t, T.despues + 0.1, C.blanco, C.espacio, T.segunda);
  pill(ctx, 'ACELERAR → FRENAR', 540, 230, 48, t, T.segunda, C.alerta, C.blanco);
  tag(ctx, 'los motores apuntan ahora hacia Andrómeda', 540, 320, 24, sm(T.frenar, T.frenar + 0.4, t));
 }, sfx(k) { FX.propulsion(k, TB.fren, 0.6, 0.6); FX.pasada(k, T.despues, T.frenar - T.despues + 0.3, 0.6); FX.frenado(k, T.frenar, T.destino - T.frenar + 0.5, 1); FX.propulsion(k, T.frenar, TB.revel - T.frenar, 0.9); FX.sello(k, T.segunda); } });
 // 11 · ≈ 29 años a bordo (reloj de misión desde la simulación) — Andrómeda crece en la ventana
 const fRev = (t) => E.inOut(win(t, T.en16, T.t29 + 0.1));
 B.push({ t0: TB.revel, t1: TB.tierra, in: { type: 'iris', d: 0.6, x: 540, y: 700 }, draw(ctx, t) {
  const f = fRev(t), s = TRIP.at(f);
  P.cockpit(ctx, t, (x, y, w, h) => { space(ctx, t, { px: t * 15 }); AND(ctx, x + w / 2, y + h * 0.45, lerp(80, 520, f * f)); }, { wy: 260, wh: 760 });
  P.holoClock(ctx, 540, 1250, 220, 60 * f, C.nave, 'RELOJ DE MISIÓN · A BORDO', fmtTau(s.tau) + ' años', { sub: f >= 1 ? 'llegada · escenario ideal' : 'viaje en curso' });
  pill(ctx, 'ALGO EXTRAORDINARIO', 540, 200, 40, t, T.extraordinario - 0.1, C.blanco, C.espacio, T.t29);
  pill(ctx, '≈ 29 AÑOS A BORDO', 540, 200, 52, t, T.t29, C.nave, C.espacio);
 }, sfx(k) { FX.revelar(k, TB.revel + 0.1); k.play('sparkle', T.extraordinario, { gain: 0.35, n: 7 }); FX.holo(k, T.en16 - 0.3); FX.reloj(k, T.en16, 40, 0.12, 0.8, 2400); FX.llegada(k, T.t29); FX.sello(k, T.t29 + 0.1); } });
 // 12 · ≈ 2,5 millones de años en la Tierra (mismo cálculo; el planeta gira a toda velocidad)
 B.push({ t0: TB.tierra, t1: TB.contr, in: { type: 'zoom', d: 0.6, x: 540, y: 1250 }, draw(ctx, t) {
  space(ctx, t, { neb: 0.4 }); const p = E.inOut(win(t, T.tierra17 - 0.2, T.anos17 + 0.3)); P.glow(ctx, 540, 700, 520, '80,140,255', 0.25); P.globe(ctx, 540, 700, 330, t * (0.3 + 30 * p));
  ctx.save(); ctx.globalAlpha = 0.25 * p; ctx.strokeStyle = C.tierra; ctx.lineWidth = 3; for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.arc(540, 700, 340 + k * 40 + (t * 80 % 40), 0, TAU); ctx.stroke(); } ctx.restore();
  clocks2(ctx, p, 1250, sm(TB.tierra, TB.tierra + 0.3, t), 175);
  pill(ctx, '≈ 2.500.000 AÑOS EN LA TIERRA', 540, 260, 40, t, T.millones17, C.tierra, C.espacio);
  tag(ctx, 'tiempo del marco de partida · escenario idealizado', 540, 1415, 22, sm(T.millones17, T.millones17 + 0.4, t));
 }, sfx(k) { FX.espacio(k, TB.tierra, TB.contr - TB.tierra, 0.8); FX.holo(k, TB.tierra + 0.2); k.play('riser', T.tierra17 - 0.3, { dur: T.anos17 - T.tierra17 + 0.5, gain: 0.35 }); FX.contador(k, T.tierra17, T.anos17 + 0.3, 0, 50); FX.sello(k, T.millones17); } });
 // 13 · contracción de longitud: misma distancia restante, medida desde dos marcos
 B.push({ t0: TB.contr, t1: TB.sinc, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  space(ctx, t, { neb: 0.4 });
  const f = 0.5 * E.inOut(win(t, T.velocidades19 - 0.3, T.contraeria + 0.6)), s = TRIP.at(f), rem = TRIP.D - s.x, remShip = rem / s.gamma;
  MW(ctx, 130, 560, 120, { spin: t * 0.01 }); AND(ctx, 950, 560, 140);
  ctx.save(); ctx.strokeStyle = C.tierra; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(240, 560); ctx.lineTo(830, 560); ctx.stroke(); ctx.restore(); txt(ctx, 'MARCO DE LAS GALAXIAS', 540, 640, 26, C.tierra, { f: '"IBM Plex Mono"', w: 600 }); txt(ctx, fmtY(rem) + ' años luz restantes', 540, 685, 34, C.blanco);
  const frac = Math.max(0.005, remShip / TRIP.D), L = 590 * frac, ca = sm(T.contraeria - 0.5, T.contraeria, t);
  ctx.save(); ctx.globalAlpha = 0.4 + 0.6 * ca; ctx.strokeStyle = C.nave; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(830 - L, 900); ctx.lineTo(830, 900); ctx.stroke(); ctx.restore(); ship(ctx, 830 - L - 110, 900, 90, t, { yaw: -0.3, roll: 0.3, thrust: 0.5 });
  txt(ctx, 'MEDIDA POR LA NAVE', 540, 990, 26, C.nave, { f: '"IBM Plex Mono"', w: 600 }); txt(ctx, (remShip >= 100 ? fmtY(remShip) : remShip.toFixed(2).replace('.', ',')) + ' años luz', 540, 1040, 40, C.blanco);
  card(ctx, 120, 1150, 840, 230, sm(T.contraeria, T.contraeria + 0.4, t), () => { txt(ctx, 'a mitad del viaje: γ ≈ ' + fmtY(s.gamma), 540, 1215, 36, C.dorado); txt(ctx, 'distancia restante ÷ γ', 540, 1285, 30, C.blanco, { f: '"IBM Plex Mono"', w: 600 }); txt(ctx, '= la distancia que mide la nave', 540, 1335, 26, C.nave, { f: '"IBM Plex Mono"', w: 600 }); });
  pill(ctx, '¿CÓMO RECORREN TANTA DISTANCIA?', 540, 300, 36, t, T.y18, C.blanco, C.espacio, T.contraeria);
  pill(ctx, 'CONTRACCIÓN DE LONGITUD', 540, 300, 46, t, T.contraeria, C.nave, C.espacio);
  tag(ctx, 'las galaxias no se mueven: cambia la distancia medida', 540, 1415, 22, sm(T.viajeros, T.viajeros + 0.4, t));
 }, sfx(k) { FX.espacio(k, TB.contr, TB.sinc - TB.contr, 0.7); FX.onomatopeya(k, T.y18); FX.contraer(k, T.contraeria - 0.5, 1.2, 1); FX.sello(k, T.contraeria + 0.1); FX.etiqueta(k, T.viajeros); } });
 // 14 · sin viajar más rápido que la luz
 B.push({ t0: TB.sinc, t1: TB.energia, in: { type: 'cut' }, draw(ctx, t) {
  const f = 0.5 + 0.5 * E.inOut(win(t, TB.sinc, TB.energia)), s = TRIP.at(f);
  space(ctx, t, { px: t * 140, streak: 0.4, dir: 0 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,212,71,0.9)'; ctx.fillRect(0, 618, W, 6); P.glow(ctx, W - 30, 621, 110, '255,212,71', 0.95); ctx.restore(); txt(ctx, 'LUZ', 70, 585, 30, C.oro, { al: 'left', f: '"IBM Plex Mono"' });
  ship(ctx, 640, 840, 250, t, { yaw: -0.3, roll: 0.2, thrust: 0.15 }); txt(ctx, 'NAVE', 70, 770, 30, C.nave, { al: 'left', f: '"IBM Plex Mono"' });
  P.speedGauge(ctx, 290, 1270, 165, s.oneMinusBeta, {}); P.holoClock(ctx, 800, 1270, 165, 60 * f, C.nave, 'NAVE', fmtTau(s.tau) + ' años', { sub: 'tiempo propio' });
  pill(ctx, 'SIN VIAJAR MÁS RÁPIDO QUE LA LUZ', 540, 300, 36, t, T.superar21, C.oro, C.espacio);
 }, sfx(k) { FX.espacio(k, TB.sinc, TB.energia - TB.sinc, 0.7); FX.sello(k, T.superar21); FX.reloj(k, T.luz21, 10, 0.12, 0.7); } });
 // 15 · el problema gigantesco: energía y tecnologías que no existen (la nave rotulada por sistemas)
 const MASS = Math.exp(TRIP.a * TRIP.tauTot);
 B.push({ t0: TB.energia, t1: TB.llegada, in: { type: 'iris', d: 0.6, x: 540, y: 700 }, draw(ctx, t) {
  space(ctx, t, { neb: 0.4 });
  const view = { x: 540, y: 640, s: 420, yaw: -0.25 + 0.06 * Math.sin(t * 0.3), pitch: 0.08, roll: 0.35, persp: 5 }; ship(ctx, view.x, view.y, view.s, t, { yaw: view.yaw, pitch: view.pitch, roll: view.roll, thrust: 0.4 });
  const la = sm(T.una23 - 0.2, T.una23 + 0.4, t); if (la > 0) { [[[-0.9, 0, 0], 'PROPULSIÓN', 'hipotética', C.motor, 120, 420], [[-0.28, 0.14, 0.14], 'COMBUSTIBLE', '¿cuánto?', C.dorado, 260, 900], [[-0.25, 0.4, 0.05], 'RADIADORES', 'disipar el calor', '#ff9a5a', 560, 420], [[0.25, 0.3, 0], 'SOPORTE VITAL', '29 años', C.nave, 790, 900], [[0.92, 0.2, 0], 'ESCUDO', 'radiación y polvo', C.alerta, 900, 420]].forEach(([v, s, sub, c, lx, ly], i) => { const a = la * sm(T.una23 + i * 0.25, T.una23 + i * 0.25 + 0.3, t); if (a <= 0) return; const [px, py] = P.M3.project(v, view); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(lx, ly + (ly < 640 ? 30 : -40)); ctx.stroke(); P.circle(ctx, px, py, 7, c); ctx.restore(); ctx.save(); ctx.globalAlpha = a; txt(ctx, s, lx, ly - 10, 28, c, { w: 800 }); txt(ctx, sub, lx, ly + 20, 22, C.blanco, { f: '"IBM Plex Mono"', w: 600 }); ctx.restore(); }); }
  const ea = sm(T.energia - 0.3, T.energia + 0.2, t); card(ctx, 100, 1020, 880, 400, ea, () => { txt(ctx, 'INCLUSO CON UN COHETE IDEAL DE FOTONES', 540, 1075, 28, C.dorado, { w: 700 }); txt(ctx, 'por cada kg que llega a Andrómeda', 540, 1135, 26, C.blanco, { f: '"IBM Plex Mono"', w: 500 }); const p = E.out(win(t, T.energia, T.existen)); txt(ctx, '≈ ' + (MASS / 1e12 * p).toFixed(1).replace('.', ',') + ' billones de kg', 540, 1225, 64, C.alerta, { w: 700 }); txt(ctx, 'deberían partir de la Tierra (sin pérdidas)', 540, 1305, 24, 'rgba(246,250,255,0.85)', { f: '"IBM Plex Mono"', w: 500 }); txt(ctx, 'masa inicial ÷ final = e^(a·τ/c)', 540, 1360, 22, 'rgba(246,250,255,0.6)', { f: '"IBM Plex Mono"', w: 500 }); });
  pill(ctx, 'UN PROBLEMA GIGANTESCO', 540, 250, 40, t, T.gigantesco - 0.2, C.alerta, C.blanco, T.energia);
  pill(ctx, 'EL DESAFÍO: LA ENERGÍA', 540, 250, 46, t, T.energia, C.oro, C.espacio);
  tag(ctx, 'tecnologías que todavía no existen', 540, 1415, 24, sm(T.existen - 0.2, T.existen + 0.2, t));
 }, sfx(k) { FX.alarma(k, T.gigantesco - 0.2, 2); FX.revelar(k, T.una23); for (let i = 0; i < 5; i++) FX.etiqueta(k, T.una23 + i * 0.25); k.play('riser', T.energia - 0.3, { dur: T.existen - T.energia + 0.3, gain: 0.35 }); FX.contador(k, T.energia, T.existen, 0, 20); FX.tachado(k, T.existen); } });
 // 16 · llegada: todo lo conocido quedó millones de años en el pasado
 B.push({ t0: TB.llegada, t1: TB.final, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  P.cockpit(ctx, t, (x, y, w, h) => { space(ctx, t, { px: t * 8 }); AND(ctx, x + w / 2, y + h * 0.5, 700 + (t - TB.llegada) * 8); }, { wy: 240, wh: 780 });
  clocks2(ctx, 1, 1235, sm(T.todo25 - 0.4, T.todo25, t), 160);
  pill(ctx, 'LLEGADA A ANDRÓMEDA', 540, 190, 40, t, TB.llegada + 0.3, C.dorado, C.espacio, T.precio);
  pill(ctx, 'UN PRECIO INCREÍBLE', 540, 190, 44, t, T.precio, C.alerta, C.blanco, T.todo25);
  pill(ctx, 'LA TIERRA QUEDÓ EN EL PASADO', 540, 190, 40, t, T.todo25, C.tierra, C.espacio);
  tag(ctx, 'un mensaje a la Tierra tardaría otros ≈ 2,5 millones de años', 540, 1425, 22, sm(T.pasado - 0.3, T.pasado + 0.2, t));
 }, sfx(k) { FX.llegada(k, TB.llegada + 0.3, 0.9); FX.espacio(k, TB.llegada, TB.final - TB.llegada, 0.9); FX.etiqueta(k, T.precio); FX.holo(k, T.todo25 - 0.3); FX.campana(k, T.pasado); } });
 // 17–18 · la física lo permite; la tecnología aún no · Asombroteca (órbita lenta alrededor de la nave frente a Andrómeda)
 const finale = (ctx, t) => { const u = t - TB.final; space(ctx, t, { px: 200 + u * 12, py: u * 4 }); AND(ctx, 560 + Math.sin(u * 0.08) * 40, 760, 760 + u * 8, { spin: u * 0.004 }); ship(ctx, 560 - u * 4, 1180 - u * 3, 250 - u * 3, t, { yaw: -0.9 + u * 0.06, pitch: 0.18, roll: 0.3, thrust: 0.35 }); };
 B.push({ t0: TB.final, t1: TB.cierre, in: { type: 'iris', d: 0.6, x: 540, y: 820 }, draw(ctx, t) {
  finale(ctx, t);
  pill(ctx, 'LA FÍSICA LO PERMITE.', 540, 300, 48, t, T.fisica - 0.1, C.nave, C.espacio);
  pill(ctx, 'LA TECNOLOGÍA AÚN NO.', 540, 395, 48, t, T.tecnologia27, C.alerta, C.blanco);
  tag(ctx, 'escenario idealizado: 1 g constante, sin efectos cosmológicos', 540, 1415, 22, sm(T.asi26 + 0.5, T.asi26 + 1, t));
 }, sfx(k) { FX.galaxia(k, TB.final + 0.2, 1); FX.espacio(k, TB.final, DURATION - TB.final, 1); FX.pasada(k, TB.final + 0.3, 3, 0.5); FX.sello(k, T.fisica - 0.1); FX.sello(k, T.tecnologia27); } });
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'cut' }, draw(ctx, t) {
  finale(ctx, t);
  P.withPop(ctx, t, T.sigue + 0.1, 540, 360, () => { P.rr(ctx, 210, 295, 660, 130, 32, 'rgba(2,4,13,0.78)'); P.text(ctx, 'ASOMBROTECA', 540, 361, 68, C.blanco, { kind: 'title' }); });
  const press = win(t, T.asombroteca + 1.0, T.asombroteca + 1.2), done = t > T.asombroteca + 1.15;
  P.withPop(ctx, t, T.asombroteca + 0.2, 540, 505, () => { P.rr(ctx, 380, 460, 320, 86, 43, done ? '#2fbf71' : C.oro, { sy: 8 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 505, 36, C.espacio); });
  if (t > T.asombroteca + 0.4) P.finger(ctx, 600, lerp(840, 525, E.out(win(t, T.asombroteca + 0.4, T.asombroteca + 1.0))), 90, press * (1 - win(t, T.asombroteca + 1.3, T.asombroteca + 1.6)));
 }, sfx(k) { FX.sello(k, T.sigue + 0.1); FX.aparece(k, T.asombroteca + 0.2, 700); FX.clic(k, T.asombroteca + 1.15); k.play('ding', T.asombroteca + 1.2, { f: 'A5', gain: 0.3 }); FX.fin(k, T.asombroteca + 1.5); } });
 // reloj local «hh:mm:ss» que avanza al ritmo normal del video (los dos observadores ven su reloj igual de normal)
 function fmtTimeLocal(t) { const s = Math.floor(8 * 3600 + (t - TB.dilat) * 60); const hh = String(Math.floor(s / 3600) % 24).padStart(2, '0'), mm = String(Math.floor(s / 60) % 60).padStart(2, '0'), ss = String(s % 60).padStart(2, '0'); return hh + ':' + mm + ':' + ss; }

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['30', 'millones', 'Einstein', 'relatividad', 'luz', 'Andrómeda', 'tiempo', 'dilatación', 'gravedad', 'frenar', '29', 'contraería', 'energía', 'pasado', 'física', 'tecnología', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 160, gain: 0.03, a: 2, hold: DURATION - 3 }); },
  music(k) {
   k.music('pad', 0, T.la5, { bpm: 76, gain: 0.42, chords: [['D2', 'A2', 'F3', 'E4'], ['Bb1', 'F2', 'D3', 'C4'], ['G1', 'D2', 'Bb2', 'A3'], ['A1', 'E2', 'C#3', 'E4']] });
   k.music('pad', T.la5, T.einstein9, { bpm: 70, gain: 0.45, chords: [['D2', 'A2', 'D3', 'F3'], ['C2', 'G2', 'C3', 'E3'], ['Bb1', 'F2', 'Bb2', 'D3']] });
   k.music('pulse', T.einstein9, T.y15, { bpm: 96, gain: 0.22, chords: [['D3', 'A3', 'F4', 'C5'], ['Bb2', 'F3', 'D4', 'A4'], ['G2', 'D3', 'Bb3', 'F4'], ['A2', 'E3', 'C#4', 'G4']] });
   k.music('pad', T.y15, T.pero22, { bpm: 84, gain: 0.44, chords: [['F2', 'C3', 'A3', 'E4'], ['G2', 'D3', 'B3', 'D4'], ['A2', 'E3', 'C4', 'G4'], ['D2', 'A2', 'F3', 'C4']] });
   k.music('pulse', T.pero22, T.y24, { bpm: 88, gain: 0.2, chords: [['B1', 'F#2', 'D3', 'A3'], ['G1', 'D2', 'B2', 'F#3']] });
   k.music('pad', T.y24, DURATION, { bpm: 72, gain: 0.46, chords: [['D2', 'A2', 'F#3', 'E4'], ['G2', 'D3', 'B3', 'D4'], ['E2', 'B2', 'G3', 'D4'], ['A2', 'E3', 'C#4', 'E4'], ['D2', 'A2', 'F#3', 'A3']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION, TRIP };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
