// =====================================================================================================
// episodio.js — «¿Podrías llegar a otra galaxia en solo 29 años?» · Asombroteca · PLANTILLA ASOMBROTECA v1.10
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

 // ---------------- utilidades ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, px, a, c = 'rgba(246,250,255,0.98)') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `600 ${px}px "IBM Plex Mono"`; const w = ctx.measureText(s).width + px * 1.2; P.rr(ctx, x - w / 2, y - px * 0.85, w, px * 1.7, px * 0.85, 'rgba(2,4,13,0.72)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, x, y + 1); ctx.restore(); };
 const card = (ctx, x, y, w, h, a, fn) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x, y, w, h, 24, 'rgba(2,4,13,0.85)'); ctx.strokeStyle = 'rgba(54,217,255,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, w, h, 24); ctx.stroke(); fn(); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 700} ${px}px ${o.f || '"Space Grotesk"'}`; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, x, y); ctx.restore(); };
 const bg = (ctx, t, o = {}) => { P.space(ctx, o); P.starfield(ctx, t, { eta: o.eta || 0, cy: o.cy, drift: o.drift ?? 1, a: o.sa ?? 1 }); };
 // los dos relojes, siempre desde la simulación: f = fracción del tiempo propio de la nave
 const clocks = (ctx, f, y, a = 1, o = {}) => { if (a <= 0) return; const s = TRIP.at(f); ctx.save(); ctx.globalAlpha *= a; P.missionClock(ctx, 290, y, 'RELOJ DE LA NAVE', fmtTau(s.tau) + ' años', C.nave, { w: 440, px: 50, sub: 'tiempo propio', prog: f }); P.missionClock(ctx, 790, y, 'TIEMPO EN LA TIERRA', fmtY(s.t) + ' años', C.tierra, { w: 440, px: o.px || 42, sub: 'marco de partida', prog: s.t / TRIP.tTot }); ctx.restore(); };

 // ================= BEATS =================
 const B = [];
 // 1 · gancho: la nave hacia otra galaxia · los dos relojes (≈ 29 años / ≈ 2,5 millones)
 B.push({ t0: 0, t1: TB.posible, draw(ctx, t) {
  bg(ctx, t, { cy: 520 });
  P.galaxy(ctx, 560, 470, 300 + t * 12, { seed: 31, tilt: 0.36, rot: -0.5, core: '255,206,140', arm: '170,190,255' });
  const sx = lerp(-200, 420, E.out(win(t, 0, 2.5))); P.spaceship(ctx, sx, 1050 - t * 10, 330, -0.12, t, { thrust: 1 });
  const f = E.inOut(win(t, T.menos - 0.2, T.millones1 + 0.4)); clocks(ctx, f, 1290, sm(T.menos - 0.5, T.menos - 0.1, t));
  pill(ctx, '≈ 29 AÑOS EN LA NAVE', 300, 330, 32, t, T.t30, C.nave, C.espacio);
  pill(ctx, 'MILLONES EN LA TIERRA', 780, 410, 32, t, T.millones1, C.tierra, C.espacio);
  tag(ctx, 'relojes conceptuales: tiempo acumulado por cada uno', 540, 1410, 20, sm(T.millones1, T.millones1 + 0.4, t));
 }, sfx(k) { FX.espacio(k, 0, TB.posible + 0.5, 1); FX.propulsion(k, 0, 3, 0.8); k.play('whoosh', 0.2, { dur: 1.6, top: 1200, gain: 0.35 }); FX.reloj(k, T.menos, 14, 0.12, 0.9, 2200); FX.reloj(k, T.tierra1, 20, 0.07, 0.9, 1500); FX.sello(k, T.t30); FX.sello(k, T.millones1); } });
 // 2 · ¿imposible? Relatividad de Einstein: sin superar la velocidad de la luz
 B.push({ t0: TB.posible, t1: TB.escala, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  bg(ctx, t, { cy: 520 });
  // carrera conceptual: un rayo de luz siempre por delante; la nave se acerca a c sin alcanzarla
  const f = E.inOut(win(t, T.pero3, T.luz4)), om = Math.pow(10, -lerp(0.3, 6, f));
  const lx = 140 + 760 * ((t - TB.posible) * 0.18 % 1); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(255,212,71,0)'); g.addColorStop(1, 'rgba(255,212,71,0.9)'); ctx.fillStyle = g; ctx.fillRect(0, 836, W, 8); P.glow(ctx, W - 40, 840, 90, '255,212,71', 0.9); ctx.restore();
  txt(ctx, 'LUZ', 90, 800, 26, C.oro, { al: 'left', f: '"IBM Plex Mono"' });
  P.spaceship(ctx, lerp(250, 760, 1 - Math.sqrt(om)), 1000, 220, 0, t, { thrust: 1 }); txt(ctx, 'NAVE', 90, 940, 26, C.nave, { al: 'left', f: '"IBM Plex Mono"' });
  P.speedGauge(ctx, 540, 1260, 170, om, {});
  pill(ctx, '¿IMPOSIBLE?', 540, 330, 50, t, T.imposible - 0.1, C.blanco, C.espacio, T.relatividad);
  pill(ctx, 'RELATIVIDAD DE EINSTEIN', 540, 330, 42, t, T.relatividad, C.cian, C.espacio, T.superar4);
  pill(ctx, 'SIN SUPERAR LA VELOCIDAD DE LA LUZ', 540, 330, 34, t, T.superar4, C.oro, C.espacio);
  tag(ctx, 'la nave se acerca a c, pero nunca la alcanza', 540, 430, 22, sm(T.luz4, T.luz4 + 0.3, t));
 }, sfx(k) { FX.espacio(k, TB.posible, TB.escala - TB.posible, 0.8); FX.onomatopeya(k, T.imposible); FX.revelar(k, T.relatividad); FX.aceleracion(k, T.pero3, T.luz4 - T.pero3 + 0.2, 0.7); FX.sello(k, T.superar4); } });
 // 3 · la escala: Tierra → Vía Láctea → Andrómeda (2,5 millones de años luz)
 B.push({ t0: TB.escala, t1: TB.luz, in: { type: 'zoom', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  const z = E.inOut(win(t, TB.escala, T.andromeda5 + 0.4)); P.space(ctx, {}); P.starfield(ctx, t, { cy: 900, a: 0.8 });
  // 1) Tierra (se aleja)  2) Vía Láctea  3) Andrómeda
  const ea = 1 - sm(0.15, 0.45, z); if (ea > 0) { ctx.save(); ctx.globalAlpha = ea; const r = lerp(260, 8, sm(0, 0.45, z)); P.globe(ctx, 300, 1200, r, t * 0.3); ctx.restore(); tag(ctx, 'TIERRA', 300, 1200 + Math.max(40, lerp(300, 40, sm(0, 0.45, z))), 22, ea); }
  const mw = sm(0.2, 0.55, z); if (mw > 0) { P.galaxy(ctx, 300, 1200, lerp(900, 170, sm(0.25, 0.9, z)), { seed: 7, tilt: 0.9, rot: t * 0.02, core: '255,214,150', arm: '150,190,255', a: mw }); tag(ctx, 'VÍA LÁCTEA', 300, 1420, 22, sm(0.7, 1, z)); }
  const an = sm(0.55, 1, z); if (an > 0) { P.galaxy(ctx, 790, 560, 190, { seed: 31, tilt: 0.36, rot: -0.5, core: '255,206,140', arm: '170,190,255', a: an }); tag(ctx, 'ANDRÓMEDA', 790, 700, 22, an); }
  const la = sm(T.millones5 - 0.4, T.millones5, t); if (la > 0) { ctx.save(); ctx.globalAlpha = la; ctx.setLineDash([14, 12]); ctx.strokeStyle = C.cian; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(360, 1130); ctx.lineTo(730, 620); ctx.stroke(); ctx.restore(); }
  pill(ctx, '2,5 MILLONES DE AÑOS LUZ', 540, 330, 42, t, T.millones5, C.cian, C.espacio);
  tag(ctx, 'escala comprimida: la distancia real es ≈ 25 veces el diámetro de la Vía Láctea', 540, 430, 18, sm(T.luz5, T.luz5 + 0.4, t));
 }, sfx(k) { FX.galaxia(k, TB.escala + 0.3, 0.8); k.play('whoosh', T.andromeda5 - 0.3, { dur: 1.6, top: 900, gain: 0.35 }); FX.galaxia(k, T.andromeda5 + 0.2, 1); FX.sello(k, T.millones5); } });
 // 4 · incluso la luz tarda ≈ 2,5 millones de años (tiempo en el marco de las galaxias)
 B.push({ t0: TB.luz, t1: TB.cabina, in: { type: 'cut' }, draw(ctx, t) {
  P.space(ctx, {}); P.starfield(ctx, t, { cy: 900, a: 0.8 });
  P.galaxy(ctx, 300, 1200, 170, { seed: 7, tilt: 0.9, rot: t * 0.02, core: '255,214,150', arm: '150,190,255' }); P.galaxy(ctx, 790, 560, 190, { seed: 31, tilt: 0.36, rot: -0.5, core: '255,206,140', arm: '170,190,255' });
  ctx.save(); ctx.setLineDash([14, 12]); ctx.strokeStyle = 'rgba(54,217,255,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(360, 1130); ctx.lineTo(730, 620); ctx.stroke(); ctx.restore();
  const p = E.inOut(win(t, T.tarda, T.alli + 0.2)), px = lerp(360, 730, p), py = lerp(1130, 620, p); ctx.save(); ctx.globalCompositeOperation = 'lighter'; P.glow(ctx, px, py, 70, '255,212,71', 0.95); ctx.restore(); P.circle(ctx, px, py, 8, '#fff6d0');
  P.counter(ctx, 540, 1330, 66, t, T.tarda, T.alli + 0.2, 0, 2500000, { box: C.oro, c: C.espacio, suffix: ' años', fmt: fmtY });
  pill(ctx, 'LA LUZ TARDA 2,5 MILLONES DE AÑOS', 540, 330, 34, t, T.tarda, C.oro, C.espacio);
  tag(ctx, 'tiempo medido en el marco de las galaxias', 540, 430, 22, sm(T.tarda, T.tarda + 0.4, t));
 }, sfx(k) { FX.espacio(k, TB.luz, TB.cabina - TB.luz, 0.8); FX.senal(k, T.tarda, 0.8, 1800); FX.contador(k, T.tarda, T.alli + 0.2, 0, 40); FX.ubicacion(k, T.alli + 0.2); } });
 // 5 · ¿durante su propia vida? La respuesta está en el tiempo (cabina)
 B.push({ t0: TB.cabina, t1: TB.einstein, in: { type: 'iris', d: 0.6, x: 540, y: 700 }, draw(ctx, t) {
  P.cockpit(ctx, t, (x, y, w, h) => { P.space(ctx, { haze: false }); P.starfield(ctx, t, { cy: y + h / 2, a: 0.9 }); P.galaxy(ctx, x + w * 0.62, y + h * 0.4, 150, { seed: 31, tilt: 0.36, rot: -0.5, core: '255,206,140', arm: '170,190,255' }); });
  const ca = sm(T.la8 - 0.3, T.la8, t), z = 1 + 0.25 * sm(T.tiempo8 - 0.2, T.tiempo8 + 0.6, t); if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900); P.clock(ctx, 540, 900, 150, 43200 + (t - TB.cabina) * 60 * 8, { sec: C.nave }); ctx.restore(); }
  pill(ctx, '¿EN UNA VIDA HUMANA?', 540, 260, 40, t, T.persona, C.blanco, C.espacio, T.la8);
  pill(ctx, 'EL SECRETO ESTÁ EN EL TIEMPO', 540, 260, 38, t, T.tiempo8 - 0.1, C.nave, C.espacio);
 }, sfx(k) { FX.revelar(k, TB.cabina + 0.1); k.play('boot', TB.cabina + 0.4, { gain: 0.4 }); FX.etiqueta(k, T.persona); FX.tictac(k, T.la8, 5, 0.4); FX.sello(k, T.tiempo8); } });
 // 6 · Einstein (1905): el tiempo no transcurre igual para todos → dos líneas de universo
 const shipLine = (n = 60) => { const pts = []; for (let i = 0; i <= n; i++) { const s = TRIP.at(i / n); pts.push([s.x / TRIP.D * 0.82, s.t / TRIP.tTot * 0.92]); } return pts; };
 const SHIP_PTS = shipLine();
 B.push({ t0: TB.einstein, t1: TB.dilat, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  bg(ctx, t, { cy: 700, sa: 0.6 });
  const ea = 1 - sm(T.igual - 0.1, T.igual + 0.4, t); if (ea > 0) { P.scientist(ctx, 540, 1200, 600, { a: ea * 0.9, c: '#cfe6ff' }); tag(ctx, 'Albert Einstein · relatividad especial (1905)', 540, 1290, 22, ea * sm(TB.einstein, TB.einstein + 0.4, t)); }
  const da = sm(T.igual - 0.2, T.igual + 0.3, t); if (da > 0) { ctx.save(); ctx.globalAlpha = da; const p = E.inOut(win(t, T.igual, T.todos + 0.4)); P.spacetime(ctx, 150, 520, 780, 780, [{ pts: [[0, 0], [0, 0.92 * p]], c: C.tierra, label: p > 0.95 ? 'TIERRA' : '' }, { pts: SHIP_PTS.slice(0, Math.max(2, Math.round(SHIP_PTS.length * p))), c: C.nave, label: p > 0.95 ? 'NAVE' : '' }], { tLabel: 'tiempo (Tierra) →' }); ctx.restore(); }
  pill(ctx, 'RELATIVIDAD ESPECIAL', 540, 330, 44, t, T.descubrio, C.cian, C.espacio);
  tag(ctx, 'dos trayectorias por el espacio-tiempo → dos tiempos distintos', 540, 1400, 20, sm(T.todos, T.todos + 0.3, t));
 }, sfx(k) { FX.revelar(k, TB.einstein + 0.1); FX.sello(k, T.descubrio); k.play('stroke', T.igual, { material: 'chalk', dur: 1.2, gain: 0.25 }); } });
 // 7 · dilatación del tiempo: a bordo todo es normal; al comparar, la nave acumula menos tiempo
 B.push({ t0: TB.dilat, t1: TB.g, in: { type: 'cut' }, draw(ctx, t) {
  bg(ctx, t, { cy: 700, sa: 0.6 });
  // diagrama con marcas de tiempo propio: cada año de la nave cubre cada vez más tiempo terrestre
  const ticks = []; for (let k = 1; k <= 28; k++) { const s = TRIP.at(k / TRIP.tauTot); ticks.push([s.x / TRIP.D * 0.82, s.t / TRIP.tTot * 0.92]); }
  const tk = sm(T.ocupantes - 0.2, T.ocupantes + 0.6, t); P.spacetime(ctx, 150, 470, 780, 640, [{ pts: [[0, 0], [0, 0.92]], c: C.tierra, label: 'TIERRA' }, { pts: SHIP_PTS, c: C.nave, label: 'NAVE', ticks: tk > 0 ? ticks.slice(0, Math.round(ticks.length * tk)) : [] }]);
  tag(ctx, 'cada punto = 1 año a bordo', 540, 1160, 20, tk);
  const ca = sm(T.lentamente - 0.2, T.lentamente + 0.3, t); card(ctx, 110, 1210, 860, 180, ca, () => { txt(ctx, 'a 0,99 c:  1 año en la nave ≈ 7 años en la Tierra', 540, 1265, 28, C.blanco, { w: 600, f: '"IBM Plex Mono"' }); txt(ctx, 'a bordo, el reloj marca su ritmo normal (tiempo propio)', 540, 1335, 21, C.nave, { w: 600, f: '"IBM Plex Mono"' }); });
  pill(ctx, 'CERCA DE LA VELOCIDAD DE LA LUZ', 540, 330, 36, t, T.cercanas10, C.blanco, C.espacio, T.dilatacion);
  pill(ctx, 'DILATACIÓN DEL TIEMPO', 540, 330, 46, t, T.dilatacion, C.nave, C.espacio);
 }, sfx(k) { FX.espacio(k, TB.dilat, TB.g - TB.dilat, 0.7); FX.etiqueta(k, T.cercanas10); for (let i = 0; i < 12; i++) k.play('tick', T.ocupantes - 0.2 + i * 0.07, { f: 3000, gain: 0.25, minor: true }); FX.aparece(k, T.lentamente, 560); FX.sello(k, T.dilatacion); FX.campo(k, T.dilatacion + 0.2, 1, 0.6); } });
 // 8 · aceleración propia constante ≈ 1 g (a bordo se siente como el peso en la Tierra)
 B.push({ t0: TB.g, t1: TB.acel, in: { type: 'iris', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  bg(ctx, t, { cy: 700, eta: 0.3 });
  P.spaceship(ctx, 540, 640, 380, 0, t, { thrust: sm(T.acelerar12 - 0.3, T.acelerar12 + 0.3, t) });
  // interior: astronauta de pie sobre el «suelo» (la popa); la aceleración apunta hacia la proa
  card(ctx, 160, 860, 760, 470, sm(T.continuamente - 0.3, T.continuamente, t), () => { ctx.fillStyle = '#16243a'; ctx.fillRect(200, 900, 680, 380); ctx.fillStyle = '#3d4f66'; ctx.fillRect(200, 1240, 680, 40); txt(ctx, 'SUELO (hacia los motores)', 540, 1262, 18, C.blanco, { f: '"IBM Plex Mono"', w: 600 }); P.worker(ctx, 540, 1240, 220, 0, { pose: 'stand', c: '#cfe6ff', cloth: '#46E6D2' }); P.forceArrow(ctx, 760, 1180, 200, 1, C.nave, 'a', { w: 22, px: 30 }); P.forceArrow(ctx, 330, 1020, 140, -1, C.tierra, 'peso', { w: 22, px: 26, align: 'right' }); });
  pill(ctx, 'ACELERACIÓN CONSTANTE', 540, 330, 42, t, T.acelerar12, C.motor, C.espacio, T.gravedad);
  pill(ctx, 'ACELERACIÓN ≈ 1 g', 540, 330, 50, t, T.gravedad, C.oro, C.espacio);
  tag(ctx, 'aceleración propia: a bordo se siente como la gravedad de la Tierra', 540, 430, 19, sm(T.terrestre, T.terrestre + 0.4, t));
  tag(ctx, 'motor conceptual · no existe hoy', 540, 1400, 20, sm(T.acelerar12, T.acelerar12 + 0.4, t));
 }, sfx(k) { FX.propulsion(k, T.acelerar12 - 0.3, TB.acel - T.acelerar12 + 0.6, 1); FX.etiqueta(k, T.continuamente); FX.sello(k, T.gravedad); } });
 // 9 · primera mitad: acelerar hasta casi c (velocímetro desde la simulación; estrellas con aberración estilizada)
 const fAcel = (t) => 0.5 * E.inOut(win(t, T.durante13, T.luz13 + 0.2));
 B.push({ t0: TB.acel, t1: TB.fren, in: { type: 'cut' }, draw(ctx, t) {
  const f = fAcel(t), s = TRIP.at(f), etaVis = Math.min(s.eta, 3.2);
  P.space(ctx, { haze: false }); P.starfield(ctx, t, { eta: etaVis, cy: 640, F: 520 }); P.spaceship(ctx, 540, 640, 260, -Math.PI / 2, t, { thrust: 1 });
  P.speedGauge(ctx, 300, 1180, 150, s.oneMinusBeta, {});
  P.missionClock(ctx, 790, 1110, 'RELOJ DE LA NAVE', fmtTau(s.tau) + ' años', C.nave, { w: 380, px: 44, prog: f }); P.missionClock(ctx, 790, 1290, 'γ (factor de Lorentz)', s.gamma < 1000 ? s.gamma.toFixed(1).replace('.', ',') : fmtY(s.gamma), C.dorado, { w: 380, px: 40 });
  pill(ctx, 'PRIMERA MITAD: ACELERAR', 540, 330, 40, t, T.primera, C.motor, C.espacio, T.extremadamente);
  pill(ctx, 'VELOCIDAD → CASI c', 540, 330, 46, t, T.extremadamente, C.oro, C.espacio);
  tag(ctx, 'las estrellas se agrupan al frente y se azulan (aberración, efecto estilizado)', 540, 430, 17, sm(T.aceleraria, T.aceleraria + 0.4, t));
 }, sfx(k) { FX.propulsion(k, TB.acel, TB.fren - TB.acel, 0.9); FX.aceleracion(k, T.durante13, T.luz13 - T.durante13 + 0.2, 1); FX.etiqueta(k, T.primera); FX.sello(k, T.extremadamente); } });
 // 10 · segunda mitad: la nave gira y frena hacia el destino (sin inversión instantánea)
 B.push({ t0: TB.fren, t1: TB.revel, in: { type: 'cut' }, draw(ctx, t) {
  const flip = E.inOut(win(t, T.despues, T.frenar)), f = 0.5 + 0.5 * E.inOut(win(t, T.frenar, T.destino + 0.4)), s = TRIP.at(f);
  P.space(ctx, { haze: false }); P.starfield(ctx, t, { eta: Math.min(s.eta, 3.2), cy: 640, F: 520 }); P.spaceship(ctx, 540, 640, 260, -Math.PI / 2 + Math.PI * flip, t, { thrust: flip < 0.15 || flip > 0.85 ? 1 : 0.15 });
  P.speedGauge(ctx, 300, 1180, 150, s.oneMinusBeta, {}); P.missionClock(ctx, 790, 1110, 'RELOJ DE LA NAVE', fmtTau(s.tau) + ' años', C.nave, { w: 380, px: 44, prog: f });
  // esquema del trayecto: acelerar / frenar
  ctx.save(); ctx.fillStyle = 'rgba(246,250,255,0.15)'; ctx.fillRect(120, 1340, 840, 10); ctx.fillStyle = C.motor; ctx.fillRect(120, 1340, 420, 10); ctx.fillStyle = C.alerta; ctx.fillRect(540, 1340, 840 * Math.max(0, f - 0.5), 10); P.circle(ctx, 120 + 840 * (s.x / TRIP.D), 1345, 12, C.blanco); ctx.restore(); txt(ctx, 'ACELERAR', 330, 1380, 22, C.motor, { f: '"IBM Plex Mono"' }); txt(ctx, 'FRENAR', 750, 1380, 22, C.alerta, { f: '"IBM Plex Mono"' });
  pill(ctx, 'GIRA Y FRENA', 540, 330, 46, t, T.despues + 0.1, C.blanco, C.espacio, T.segunda);
  pill(ctx, 'ACELERAR → FRENAR', 540, 330, 46, t, T.segunda, C.alerta, C.blanco);
  tag(ctx, 'el motor apunta ahora hacia Andrómeda', 540, 430, 21, sm(T.frenar, T.frenar + 0.4, t));
 }, sfx(k) { FX.propulsion(k, TB.fren, 0.6, 0.6); k.play('whoosh', T.despues, { dur: T.frenar - T.despues, top: 900, gain: 0.3 }); FX.frenado(k, T.frenar, T.destino - T.frenar + 0.5, 1); FX.propulsion(k, T.frenar, TB.revel - T.frenar, 0.9); FX.sello(k, T.segunda); } });
 // 11 · ≈ 29 años a bordo (reloj de misión desde la simulación) · 12 · ≈ 2,5 millones en la Tierra
 const fRev = (t) => E.inOut(win(t, T.en16, T.t29 + 0.1));
 B.push({ t0: TB.revel, t1: TB.tierra, in: { type: 'iris', d: 0.6, x: 540, y: 800 }, draw(ctx, t) {
  const f = fRev(t), s = TRIP.at(f);
  P.cockpit(ctx, t, (x, y, w, h) => { P.space(ctx, { haze: false }); P.starfield(ctx, t, { cy: y + h / 2, eta: Math.min(s.eta, 2.2) * 0.6 }); P.galaxy(ctx, x + w / 2, y + h * 0.45, lerp(60, 300, f * f), { seed: 31, tilt: 0.36, rot: -0.5, core: '255,206,140', arm: '170,190,255' }); }, { wh: 620 });
  P.missionClock(ctx, 540, 1150, 'RELOJ DE MISIÓN · TIEMPO A BORDO', fmtTau(s.tau) + ' años', C.nave, { w: 700, h: 190, px: 88, prog: f, sub: f >= 1 ? 'llegada · escenario ideal' : 'viaje en curso' });
  pill(ctx, 'ALGO EXTRAORDINARIO', 540, 260, 40, t, T.extraordinario - 0.1, C.blanco, C.espacio, T.t29);
  pill(ctx, '≈ 29 AÑOS A BORDO', 540, 260, 50, t, T.t29, C.nave, C.espacio);
 }, sfx(k) { FX.revelar(k, TB.revel + 0.1); k.play('sparkle', T.extraordinario, { gain: 0.35, n: 7 }); FX.reloj(k, T.en16, 40, 0.12, 0.8, 2400); FX.llegada(k, T.t29); FX.sello(k, T.t29 + 0.1); } });
 B.push({ t0: TB.tierra, t1: TB.contr, in: { type: 'zoom', d: 0.6, x: 540, y: 1150 }, draw(ctx, t) {
  bg(ctx, t, { cy: 700, sa: 0.7 });
  const p = E.inOut(win(t, T.tierra17 - 0.2, T.anos17 + 0.3)); P.globe(ctx, 540, 760, 260, t * (0.3 + 30 * p));
  // el tiempo pasa: los continentes giran a toda velocidad; abstracto, sin inventar el futuro
  ctx.save(); ctx.globalAlpha = 0.25 * p; ctx.strokeStyle = C.tierra; ctx.lineWidth = 3; for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.arc(540, 760, 260 + k * 40 + (t * 80 % 40), 0, TAU); ctx.stroke(); } ctx.restore();
  clocks(ctx, p, 1180, sm(TB.tierra, TB.tierra + 0.3, t), { px: 40 });
  pill(ctx, '≈ 2.500.000 AÑOS EN LA TIERRA', 540, 330, 38, t, T.millones17, C.tierra, C.espacio);
  tag(ctx, 'tiempo del marco de partida · escenario idealizado', 540, 1400, 20, sm(T.millones17, T.millones17 + 0.4, t));
 }, sfx(k) { FX.espacio(k, TB.tierra, TB.contr - TB.tierra, 0.8); k.play('riser', T.tierra17 - 0.3, { dur: T.anos17 - T.tierra17 + 0.5, gain: 0.35 }); FX.contador(k, T.tierra17, T.anos17 + 0.3, 0, 50); FX.sello(k, T.millones17); } });
 // 13 · contracción de longitud (marco comóvil instantáneo): la distancia restante medida por la nave se encoge
 B.push({ t0: TB.contr, t1: TB.sinc, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  bg(ctx, t, { cy: 700, sa: 0.6 });
  const f = 0.5 * E.inOut(win(t, T.velocidades19 - 0.3, T.contraeria + 0.6)), s = TRIP.at(f), rem = TRIP.D - s.x, remShip = rem / s.gamma;
  // marco de las galaxias: barra completa (no cambia)
  P.galaxy(ctx, 150, 620, 80, { seed: 7, tilt: 0.9, rot: t * 0.02, core: '255,214,150', arm: '150,190,255' }); P.galaxy(ctx, 930, 620, 90, { seed: 31, tilt: 0.36, rot: -0.5, core: '255,206,140', arm: '170,190,255' });
  ctx.save(); ctx.strokeStyle = C.tierra; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(230, 620); ctx.lineTo(840, 620); ctx.stroke(); ctx.restore(); txt(ctx, 'MARCO DE LAS GALAXIAS: ' + fmtY(rem) + ' al restantes', 540, 700, 24, C.tierra, { f: '"IBM Plex Mono"', w: 600 });
  // marco comóvil instantáneo de la nave: la misma distancia restante, medida por la nave
  const frac = Math.max(0.004, remShip / TRIP.D), L = 610 * frac, ca = sm(T.contraeria - 0.5, T.contraeria, t);
  ctx.save(); ctx.globalAlpha = 0.4 + 0.6 * ca; ctx.strokeStyle = C.nave; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(840 - L, 980); ctx.lineTo(840, 980); ctx.stroke(); P.circle(ctx, 840 - L, 980, 10, C.nave); ctx.restore(); P.spaceship(ctx, 840 - L - 70, 980, 70, 0, t, { thrust: 0.6 });
  const rs = remShip >= 100 ? fmtY(remShip) + ' al' : remShip.toFixed(2).replace('.', ',') + ' al'; txt(ctx, 'MEDIDA POR LA NAVE: ' + rs, 540, 1060, 26, C.nave, { f: '"IBM Plex Mono"', w: 700 });
  card(ctx, 140, 1150, 800, 200, sm(T.contraeria, T.contraeria + 0.4, t), () => { txt(ctx, 'γ ≈ ' + fmtY(s.gamma) + ' a mitad del viaje', 540, 1210, 34, C.dorado, { w: 700 }); txt(ctx, 'distancia restante ÷ γ = distancia para la nave', 540, 1285, 24, C.blanco, { f: '"IBM Plex Mono"', w: 600 }); });
  pill(ctx, '¿CÓMO RECORREN TANTA DISTANCIA?', 540, 330, 36, t, T.y18, C.blanco, C.espacio, T.contraeria);
  pill(ctx, 'CONTRACCIÓN DE LONGITUD', 540, 330, 44, t, T.contraeria, C.nave, C.espacio);
  tag(ctx, 'las galaxias no se mueven: cambia la distancia que mide cada observador', 540, 430, 18, sm(T.viajeros, T.viajeros + 0.4, t));
 }, sfx(k) { FX.espacio(k, TB.contr, TB.sinc - TB.contr, 0.7); FX.onomatopeya(k, T.y18); FX.contraer(k, T.contraeria - 0.5, 1.2, 1); FX.sello(k, T.contraeria + 0.1); FX.etiqueta(k, T.viajeros); } });
 // 14 · sin viajar más rápido que la luz
 B.push({ t0: TB.sinc, t1: TB.energia, in: { type: 'cut' }, draw(ctx, t) {
  const f = 0.5 + 0.5 * E.inOut(win(t, TB.sinc, TB.energia)), s = TRIP.at(f);
  P.space(ctx, { haze: false }); P.starfield(ctx, t, { eta: Math.min(s.eta, 3.2), cy: 640 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,212,71,0.85)'; ctx.fillRect(0, 836, W, 6); P.glow(ctx, W - 30, 839, 80, '255,212,71', 0.9); ctx.restore(); txt(ctx, 'LUZ', 90, 805, 24, C.oro, { al: 'left', f: '"IBM Plex Mono"' });
  P.spaceship(ctx, 700, 960, 200, 0, t, { thrust: 0.2 }); txt(ctx, 'NAVE', 90, 925, 24, C.nave, { al: 'left', f: '"IBM Plex Mono"' });
  P.speedGauge(ctx, 300, 1230, 140, s.oneMinusBeta, {}); P.missionClock(ctx, 790, 1230, 'RELOJ DE LA NAVE', fmtTau(s.tau) + ' años', C.nave, { w: 380, px: 44, prog: f });
  pill(ctx, 'SIN VIAJAR MÁS RÁPIDO QUE LA LUZ', 540, 330, 36, t, T.superar21, C.oro, C.espacio);
 }, sfx(k) { FX.espacio(k, TB.sinc, TB.energia - TB.sinc, 0.7); FX.sello(k, T.superar21); FX.reloj(k, T.luz21, 10, 0.12, 0.7); } });
 // 15 · el problema gigantesco: energía y tecnologías que no existen (corte de nave conceptual)
 const MASS = Math.exp(TRIP.a * TRIP.tauTot); // cohete ideal de fotones: m0/m1 = e^(Δrapidez)
 B.push({ t0: TB.energia, t1: TB.llegada, in: { type: 'iris', d: 0.6, x: 540, y: 800 }, draw(ctx, t) {
  bg(ctx, t, { cy: 700, sa: 0.5 });
  P.spaceship(ctx, 540, 700, 420, 0, t, { thrust: 0.5, cut: sm(T.una23 - 0.2, T.una23 + 0.4, t) });
  const la = sm(T.una23 + 0.2, T.una23 + 0.6, t); if (la > 0) { [[-0.87, 'PROPULSIÓN', 'hipotética', C.motor, 480], [-0.43, 'ENERGÍA', '¿de dónde?', C.dorado, 560], [0.15, 'SOPORTE VITAL', '29 años', C.nave, 480], [0.93, 'ESCUDO', 'radiación y polvo', C.alerta, 560]].forEach(([dx, s, sub, c, yy]) => { const x = 540 + 420 * dx; ctx.save(); ctx.globalAlpha = la; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 700); ctx.lineTo(x, yy + 30); ctx.stroke(); ctx.restore(); txt(ctx, s, Math.max(110, Math.min(970, x)), yy - 12, 24, c, { w: 800 }); txt(ctx, sub, Math.max(110, Math.min(970, x)), yy + 14, 18, C.blanco, { f: '"IBM Plex Mono"', w: 500 }); }); }
  const ea = sm(T.energia - 0.3, T.energia + 0.2, t); card(ctx, 110, 920, 860, 380, ea, () => { txt(ctx, 'INCLUSO CON UN COHETE IDEAL DE FOTONES', 540, 975, 26, C.dorado, { w: 700 }); txt(ctx, 'por cada kg que llega a Andrómeda', 540, 1035, 24, C.blanco, { f: '"IBM Plex Mono"', w: 500 }); const p = E.out(win(t, T.energia, T.existen)); txt(ctx, '≈ ' + (MASS / 1e12 * p).toFixed(1).replace('.', ',') + ' billones de kg', 540, 1120, 56, C.alerta, { w: 700 }); txt(ctx, 'deberían partir de la Tierra (10¹² kg = un billón)', 540, 1195, 20, 'rgba(246,250,255,0.8)', { f: '"IBM Plex Mono"', w: 500 }); txt(ctx, 'masa inicial ÷ final = e^(a·τ/c)  (sin pérdidas)', 540, 1250, 20, 'rgba(246,250,255,0.6)', { f: '"IBM Plex Mono"', w: 500 }); });
  pill(ctx, 'UN PROBLEMA GIGANTESCO', 540, 330, 40, t, T.gigantesco - 0.2, C.alerta, C.blanco, T.energia);
  pill(ctx, 'EL DESAFÍO: LA ENERGÍA', 540, 330, 44, t, T.energia, C.oro, C.espacio);
  tag(ctx, 'tecnologías que todavía no existen', 540, 1400, 22, sm(T.existen - 0.2, T.existen + 0.2, t));
 }, sfx(k) { FX.alarma(k, T.gigantesco - 0.2, 2); FX.revelar(k, T.una23); [0, 0.2, 0.4, 0.6].forEach((d, i) => FX.etiqueta(k, T.una23 + 0.2 + d)); k.play('riser', T.energia - 0.3, { dur: T.existen - T.energia + 0.3, gain: 0.35 }); FX.contador(k, T.energia, T.existen, 0, 20); FX.tachado(k, T.existen); } });
 // 16 · llegada: todo lo conocido quedó millones de años en el pasado
 B.push({ t0: TB.llegada, t1: TB.final, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  P.cockpit(ctx, t, (x, y, w, h) => { P.space(ctx, { haze: false }); P.starfield(ctx, t, { cy: y + h / 2, a: 0.9 }); P.galaxy(ctx, x + w / 2, y + h * 0.5, 420 + (t - TB.llegada) * 6, { seed: 31, tilt: 0.36, rot: -0.5, core: '255,206,140', arm: '170,190,255' }); }, { wh: 640 });
  clocks(ctx, 1, 1320, sm(T.todo25 - 0.4, T.todo25, t), { px: 40 });
  pill(ctx, 'LLEGADA A ANDRÓMEDA', 540, 260, 40, t, TB.llegada + 0.3, C.dorado, C.espacio, T.precio);
  pill(ctx, 'UN PRECIO INCREÍBLE', 540, 260, 44, t, T.precio, C.alerta, C.blanco, T.todo25);
  pill(ctx, 'LA TIERRA QUEDÓ EN EL PASADO', 540, 260, 40, t, T.todo25, C.tierra, C.espacio);
  tag(ctx, 'y cualquier mensaje a la Tierra tardaría otros ≈ 2,5 millones de años', 540, 1440, 19, sm(T.pasado - 0.3, T.pasado + 0.2, t));
 }, sfx(k) { FX.llegada(k, TB.llegada + 0.3, 0.9); FX.espacio(k, TB.llegada, TB.final - TB.llegada, 0.9); FX.etiqueta(k, T.precio); FX.aparece(k, T.todo25, 480); FX.campana(k, T.pasado); } });
 // 17 · la física lo permite; la tecnología aún no · 18 · Asombroteca
 const finale = (ctx, t) => { const u = t - TB.final; P.space(ctx, {}); P.starfield(ctx, t, { cy: 800, a: 0.9 }); P.galaxy(ctx, 540 + Math.sin(u * 0.08) * 40, 820, 520 + u * 6, { seed: 31, tilt: 0.36 + 0.04 * Math.sin(u * 0.1), rot: -0.5 + u * 0.01, core: '255,206,140', arm: '170,190,255' }); P.spaceship(ctx, 300 + u * 6, 1250 - u * 2, 70, -0.25, t, { thrust: 0.4 }); };
 B.push({ t0: TB.final, t1: TB.cierre, in: { type: 'iris', d: 0.6, x: 540, y: 820 }, draw(ctx, t) {
  finale(ctx, t);
  pill(ctx, 'LA FÍSICA LO PERMITE.', 540, 330, 46, t, T.fisica - 0.1, C.nave, C.espacio);
  pill(ctx, 'LA TECNOLOGÍA AÚN NO.', 540, 420, 46, t, T.tecnologia27, C.alerta, C.blanco);
  tag(ctx, 'escenario idealizado: 1 g constante, trayecto recto, sin efectos cosmológicos', 540, 1420, 18, sm(T.asi26 + 0.5, T.asi26 + 1, t));
 }, sfx(k) { FX.galaxia(k, TB.final + 0.2, 1); FX.espacio(k, TB.final, DURATION - TB.final, 1); FX.sello(k, T.fisica - 0.1); FX.sello(k, T.tecnologia27); } });
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'cut' }, draw(ctx, t) {
  finale(ctx, t);
  P.withPop(ctx, t, T.sigue + 0.1, 540, 420, () => { P.rr(ctx, 210, 355, 660, 130, 32, 'rgba(2,4,13,0.78)'); P.text(ctx, 'ASOMBROTECA', 540, 421, 68, C.blanco, { kind: 'title' }); });
  const press = win(t, T.asombroteca + 1.0, T.asombroteca + 1.2), done = t > T.asombroteca + 1.15;
  P.withPop(ctx, t, T.asombroteca + 0.2, 540, 565, () => { P.rr(ctx, 380, 520, 320, 86, 43, done ? '#2fbf71' : C.oro, { sy: 8 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 565, 36, C.espacio); });
  if (t > T.asombroteca + 0.4) P.finger(ctx, 600, lerp(900, 585, E.out(win(t, T.asombroteca + 0.4, T.asombroteca + 1.0))), 90, press * (1 - win(t, T.asombroteca + 1.3, T.asombroteca + 1.6)));
 }, sfx(k) { FX.sello(k, T.sigue + 0.1); FX.aparece(k, T.asombroteca + 0.2, 700); FX.clic(k, T.asombroteca + 1.15); k.play('ding', T.asombroteca + 1.2, { f: 'A5', gain: 0.3 }); FX.fin(k, T.asombroteca + 1.5); } });

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
