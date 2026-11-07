// =====================================================================================================
// episodio.js — «¿Por qué el café te quita el sueño?» · DEMO de la PLANTILLA ASOMBROTECA v1.26 (voz sintética Kokoro)
// Muestra en un solo vídeo los recursos nuevos: 3D de producto (taza torneada con sombra), personajes con cara, metáfora
// llave/cerradura, plano técnico «blueprint» con HUD, barras y reloj, subtítulos «ios» con iconos y el cierre de compartir.
// Fórmula de las referencias: gancho → giro → metáfora → mecanismo con cifras → consecuencia → remate → «Envíaselo a ese amigo…».
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const K = PL.kit(A), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, B0, DURATION } = K;
 // tiempos anclados a palabras de la voz
 const Tk = { sueno: wt(0, 'sueño'), no: wt(1, 'no'), energia: wt(1, 'energía'), trampa: wt(2, 'trampa'), cerebro: wt(2, 'cerebro'), mientras: wt(2, 'mientras'), despierto: wt(2, 'despierto'),
  neuronas: wt(2, 'neuronas'), acumulan: wt(2, 'acumulan'), adenosina: wt(2, 'adenosina'), molecula: wt(2, 'molécula'), cansancio: wt(2, 'cansancio'), cuanta: wt(2, 'cuanta'), encaja: wt(2, 'encaja'), cerraduras: wt(2, 'cerraduras'),
  suenoDa: wt(3, 'sueño'), cafeina: wt(3, 'cafeína'), misma: wt(3, 'misma'), entra: wt(3, 'entra'), pero: wt(3, 'pero'), abre: wt(3, 'abre'),
  asi: wt(4, 'así'), turno: wt(4, 'turno'), rapido: wt(4, 'rápido'), cinco: wt(4, 'cinco'), mitad: wt(4, 'mitad'), sangre: wt(4, 'sangre'), si: wt(4, 'si'), tarde: wt(4, 'tarde'), diez: wt(4, 'diez'), mitad2: wt(4, 'mitad', 1), envia: wt(4, 'envíaselo'), amigo: wt(4, 'amigo') };
 const S = { b2: T.s1 - 0.15, b3: Tk.trampa - 0.6, b4: Tk.mientras - 0.15, b5: Tk.cuanta - 0.2, b6: Tk.cafeina - 0.25, b7: Tk.asi - 0.2, b8: Tk.rapido - 0.35, b9: Tk.envia - 0.25 };
 const ADE = '#ffb347', CAF = '#9b6cff';

 // ---- 3D: taza de café sobre su plato, encima de una mesa de madera ----
 const taza = P.mesh.lathe([[0, 0], [0.34, 0], [0.38, 0.03], [0.46, 0.62], [0.47, 0.66], [0.43, 0.66], [0.36, 0.08], [0, 0.08]], { seg: 44 });
 const cafe = P.mesh.cyl(0.43, 0.012, { seg: 44 });
 const asa = P.mesh.extrude([[0, 0], [0.1, 0.04], [0.2, 0.18], [0.2, 0.36], [0.08, 0.5], [0, 0.48], [0.06, 0.42], [0.13, 0.33], [0.13, 0.2], [0.07, 0.1], [0, 0.07]], 0.07, { bevel: 0.015 });
 const plato = P.mesh.lathe([[0, 0], [0.7, 0], [0.82, 0.04], [0.9, 0.09], [0.86, 0.1], [0.55, 0.06], [0, 0.06]], { seg: 48 });
 const mesa = P.mesh.box(4.2, 0.3, 3, { bevel: 0.03 });
 const vetas = (c, pts, f) => { if (f.g !== 'frente' && f.g !== 'atras') { c.strokeStyle = 'rgba(80,40,15,0.22)'; c.lineWidth = 2; const y0 = Math.min(...pts.map((p) => p[1])); for (let k = 0; k < 60; k++) { const y = y0 + k * 9; c.beginPath(); c.moveTo(-50, y); c.bezierCurveTo(300, y + 8 * Math.sin(k), 700, y - 6, 1130, y + 4 * Math.cos(k)); c.stroke(); } } };
 const escenaTaza = (ctx, t, cam) => { P.fondo(ctx, t, 'producto', { ly: 700 }); P.render3(ctx, cam, [
  { mesh: mesa, pos: [0, -0.15, 0], col: '#a8703f', spec: 0.12, suelo: true, paint: vetas },
  { mesh: plato, pos: [0, 0, 0], col: '#f4f1ea', spec: 0.6, shin: 50, shadow: 0.85, shadowA: 0.4 },
  { mesh: taza, pos: [0, 0.06, 0], col: '#f7f5f0', spec: 0.7, shin: 60, rim: 0.18 },
  { mesh: cafe, pos: [0, 0.6, 0], col: '#3a2416', spec: 0.9, shin: 90 },
  { mesh: asa, pos: [-0.45, 0.18, 0.08], rot: [0, Math.PI + 0.25, 0], col: '#f2efe8', spec: 0.6 },
 ], { light: [-0.55, 0.9, 0.55] });
  // vapor (2D sobre la proyección del borde de la taza)
  const top = cam.pr([0, 0.72, 0]); ctx.save(); ctx.lineCap = 'round'; for (let k = 0; k < 3; k++) { const ph = t * 0.9 + k * 0.33, u = ph % 1; ctx.strokeStyle = `rgba(255,255,255,${0.32 * Math.sin(Math.PI * u)})`; ctx.lineWidth = 14 - k * 3; ctx.beginPath(); for (let j = 0; j <= 20; j++) { const q = j / 20, yy = top[1] - 30 - q * 340 - u * 120, xx = top[0] + (k - 1) * 46 + Math.sin(q * 6 + t * 2 + k) * 26 * q; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } ctx.restore(); return top; };

 // ---- neurona estilizada (soma + dendritas) ----
 const neurona = (ctx, x, y, s, t, glow) => { ctx.save(); ctx.strokeStyle = '#7ad7ff'; ctx.lineCap = 'round'; const R = H.rng(5); for (let i = 0; i < 7; i++) { const a = i * TAU / 7 + 0.3, L = s * (1.4 + R() * 0.8); ctx.lineWidth = s * 0.12; ctx.beginPath(); ctx.moveTo(x, y); const mx = x + Math.cos(a) * L * 0.6, my = y + Math.sin(a) * L * 0.6; ctx.quadraticCurveTo(x + Math.cos(a + 0.3) * L * 0.4, y + Math.sin(a + 0.3) * L * 0.4, mx, my); ctx.stroke(); ctx.lineWidth = s * 0.06; for (const d of [-0.4, 0.4]) { ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(a + d) * L * 0.45, my + Math.sin(a + d) * L * 0.45); ctx.stroke(); } } if (glow) P.glow(ctx, x, y, s * 2.4, '122,215,255', 0.35 * glow); P.character(ctx, 'celula', x, y, s, t, { col: '#5cc8ff', mood: 'contento', seed: 2 }); ctx.restore(); };
 // posiciones de las moléculas de adenosina que se acumulan (deterministas)
 const MOL = (() => { const R = H.rng(21), out = []; for (let i = 0; i < 14; i++) { const a = R() * TAU, d = 300 + R() * 160; out.push([540 + Math.cos(a) * d * 1.05, 980 + Math.sin(a) * d * 0.95, 0.3 + R() * 0.25]); } return out; })();

 const B = [];
 // 1 · GANCHO (3D de producto): la cámara rodea y se acerca a la taza humeante
 B.push({ t0: 0, t1: S.b2, in: { type: 'cut' }, draw(ctx, t) {
  const u = E.inOut(win(t, 0, S.b2)), a = lerp(-0.55, 0.15, u), d = lerp(3.4, 2.5, u), cam = P.cam3([Math.sin(a) * d, lerp(2.1, 1.65, u), Math.cos(a) * d], [0, 0.42, 0], 1050);
  const top = escenaTaza(ctx, t, cam); const la = sm(Tk.sueno - 0.1, Tk.sueno + 0.25, t); if (la > 0) { ctx.save(); ctx.globalAlpha *= la; P.character(ctx, 'nube', top[0] + 230, top[1] - 380, 70, t, { mood: 'dormido', bounce: 0.6 }); P.icon(ctx, 'luna', top[0] + 330, top[1] - 470, 70, { mode: 'flat', col: '#FFD447' }); ctx.restore(); }
 }, sfx(k) { k.noise(0, { dur: S.b2, color: 'pink', filter: 'lowpass', f: 900, gain: 0.02, a: 0.3, hold: S.b2 * 0.6 }); FX.personaje(k, Tk.sueno); } });
 // 2 · GIRO: «No te da energía» — el rayo se tacha
 B.push({ t0: S.b2, t1: S.b3, in: { type: 'zoom', d: 0.4, x: 540, y: 900 }, draw(ctx, t) {
  P.fondo(ctx, t, 'cartoon'); const e = E.out(win(t, S.b2, S.b2 + 0.45)); P.glow(ctx, 540, 960, 420, '255,212,71', 0.25 * e); P.icon(ctx, 'rayo', 540, 960, 420 * e, { mode: 'flat', col: '#FFD447' });
  const x = win(t, Tk.energia, Tk.energia + 0.3); if (x > 0) { ctx.save(); ctx.strokeStyle = '#ff5d73'; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.moveTo(330, 760); ctx.lineTo(lerp(330, 750, x), lerp(760, 1160, x)); if (x > 0.5) { const y2 = (x - 0.5) * 2; ctx.moveTo(750, 760); ctx.lineTo(lerp(750, 330, y2), lerp(760, 1160, y2)); } ctx.stroke(); ctx.restore(); }
  P.tag(ctx, 'NO ES ENERGÍA', 540, 1330, t, Tk.energia + 0.2, S.b3, { mono: true });
 }, sfx(k) { FX.aparece(k, S.b2 + 0.1, 520); FX.tachado(k, Tk.energia); } });
 // 3 · «Le hace trampa a tu cerebro»: el cerebro se marea; una molécula traviesa asoma
 B.push({ t0: S.b3, t1: S.b4, in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  P.fondo(ctx, t, 'cartoon'); const tramp = t > Tk.trampa + 0.15; P.character(ctx, 'cerebro', 540, 960, 250, t, { mood: tramp ? 'mareado' : 'feliz', bounce: 0.5 });
  const e = E.out(win(t, Tk.trampa, Tk.trampa + 0.4)); if (e > 0) P.character(ctx, 'molecula', 860, 1180 - e * 40, 90, t, { col: CAF, mood: 'contento', look: [-1, -0.5], seed: 4 });
  P.tag(ctx, 'CEREBRO', 540, 1310, t, Tk.cerebro - 0.1, S.b4, { mono: true });
 }, sfx(k) { FX.personaje(k, Tk.trampa + 0.1); FX.etiqueta(k, Tk.cerebro - 0.1); } });
 // 4 · despierto → las neuronas acumulan adenosina («la molécula del cansancio»)
 B.push({ t0: S.b4, t1: S.b5, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  P.fondo(ctx, t, 'cartoon', { c0: '#2a6fb8', c1: '#123a7a', glow: '120,220,255' }); const da = sm(Tk.mientras, Tk.mientras + 0.3, t) * (1 - sm(Tk.neuronas - 0.3, Tk.neuronas, t)); if (da > 0) { ctx.save(); ctx.globalAlpha *= da; P.character(ctx, 'sol', 820, 520, 110, t, { mood: 'feliz' }); P.tag(ctx, 'DESPIERTO', 820, 720, t, Tk.despierto - 0.2, Tk.neuronas, { mono: true }); ctx.restore(); }
  neurona(ctx, 540, 980, 120, t, sm(Tk.neuronas - 0.3, Tk.neuronas, t)); const n = Math.floor(lerp(0, MOL.length, win(t, Tk.acumulan, Tk.cansancio + 0.3)));
  for (let i = 0; i < n; i++) { const [x, y, s] = MOL[i], e = E.out(win(t, Tk.acumulan + i * 0.21, Tk.acumulan + i * 0.21 + 0.3)); P.character(ctx, 'molecula', lerp(540, x, e), lerp(980, y, e), 70 * s * 1.6 * (0.6 + 0.4 * e), t, { col: ADE, mood: 'dormido', seed: i, bounce: 0.4 }); }
  P.tag(ctx, 'ADENOSINA', MOL[0][0], MOL[0][1] + 110, t, Tk.adenosina, S.b5, { to: [[MOL[0][0], MOL[0][1] + 50]], mono: true }); P.tag(ctx, '= CANSANCIO', 540, 1380, t, Tk.molecula, S.b5, { mono: true, col: ADE });
 }, sfx(k) { FX.personaje(k, Tk.mientras); for (let i = 0; i < 6; i++) FX.aparece(k, Tk.acumulan + i * 0.42, 500 + i * 60); FX.etiqueta(k, Tk.adenosina); FX.etiqueta(k, Tk.molecula); } });
 // 5 · llave (adenosina) en la cerradura (receptor) → gira → «más sueño te da»
 B.push({ t0: S.b5, t1: S.b6, in: { type: 'iris', d: 0.4, x: 540, y: 900 }, draw(ctx, t) {
  P.fondo(ctx, t, 'cartoon', { c0: '#1aa3b8', c1: '#0d4f6b', glow: '120,255,230' }); const u = E.inOut(win(t, Tk.encaja - 0.35, Tk.cerraduras)), tr = win(t, Tk.cerraduras, Tk.cerraduras + 0.5);
  P.keyLock(ctx, 470, 860, 230, t, { u, turn: tr, ok: sm(Tk.cerraduras + 0.3, Tk.cerraduras + 0.7, t), keyCol: ADE }); P.tag(ctx, 'RECEPTOR', 470, 1150, t, Tk.cuanta, S.b6, { mono: true }); P.tag(ctx, 'ADENOSINA', 820, 700, t, Tk.cuanta + 0.3, Tk.cerraduras + 0.4, { mono: true, col: ADE });
  const z = sm(Tk.suenoDa - 0.3, Tk.suenoDa, t); if (z > 0) { ctx.save(); ctx.globalAlpha *= z; P.character(ctx, 'cerebro', 760, 1300, 120, t, { mood: 'dormido' }); ctx.font = '900 70px "Fredoka"'; ctx.fillStyle = '#ffffff'; for (let k = 0; k < 3; k++) { const q = ((t * 0.7 + k / 3) % 1); ctx.globalAlpha = z * Math.sin(Math.PI * q); ctx.fillText('z', 880 + q * 80 + k * 10, 1190 - q * 180); } ctx.restore(); }
 }, sfx(k) { FX.etiqueta(k, Tk.cuanta); k.play('whoosh', Tk.encaja - 0.35, { dur: 0.6, gain: 0.3, minor: true }); FX.llave(k, Tk.cerraduras - 0.25); FX.correcto(k, Tk.cerraduras + 0.35); FX.personaje(k, Tk.suenoDa); } });
 // 6 · la cafeína: casi la misma forma → entra, pero no abre (y bloquea a la adenosina)
 B.push({ t0: S.b6, t1: S.b7, in: { type: 'slide', d: 0.35 }, draw(ctx, t) {
  P.fondo(ctx, t, 'cartoon', { c0: '#5b2d9e', c1: '#24105c' }); const cmp = sm(Tk.cafeina, Tk.cafeina + 0.3, t) * (1 - sm(Tk.entra - 0.35, Tk.entra - 0.1, t));
  if (cmp > 0) { ctx.save(); ctx.globalAlpha *= cmp; P.character(ctx, 'molecula', 540, 700, 120, t, { col: CAF, mood: 'contento', bounce: 0.5 }); const m = sm(Tk.misma - 0.3, Tk.misma, t); P.icon(ctx, 'llave', 300, 1050, 380 * (0.6 + 0.4 * m), { mode: 'flat', col: ADE }); P.icon(ctx, 'llave', 780, 1050, 380 * (0.6 + 0.4 * m), { mode: 'flat', col: CAF }); P.tag(ctx, 'ADENOSINA', 300, 1230, t, Tk.misma - 0.2, Tk.entra, { mono: true, col: ADE }); P.tag(ctx, 'CAFEÍNA', 780, 1230, t, Tk.misma - 0.2, Tk.entra, { mono: true, col: CAF }); ctx.restore(); }
  const ka = sm(Tk.entra - 0.3, Tk.entra, t); if (ka > 0) { ctx.save(); ctx.globalAlpha *= ka; const u = E.inOut(win(t, Tk.entra, Tk.entra + 0.8)); P.keyLock(ctx, 540, 900, 230, t, { u, turn: 0, fake: true });
   const bo = win(t, Tk.pero, Tk.pero + 0.7), bx = 140 + Math.sin(Math.PI * bo) * 120; if (bo > 0 && bo < 1) { P.icon(ctx, 'llave', bx, 900, 180, { mode: 'flat', col: ADE }); }
   const no = sm(Tk.abre - 0.15, Tk.abre + 0.1, t); if (no > 0) P.icon(ctx, 'cruz', 820, 640, 150 * E.out(no), { mode: 'flat', col: '#ff5d73', col2: '#ffffff' }); P.tag(ctx, 'NO LA ABRE', 540, 1230, t, Tk.abre - 0.1, S.b7, { mono: true, col: '#ff5d73' }); ctx.restore(); }
 }, sfx(k) { FX.personaje(k, Tk.cafeina); FX.etiqueta(k, Tk.misma - 0.2); k.play('whoosh', Tk.entra, { dur: 0.7, gain: 0.3, minor: true }); FX.toque(k, Tk.entra + 0.8); k.play('thud', Tk.pero + 0.35, { f: 140, gain: 0.35 }); FX.tachado(k, Tk.abre); } });
 // 7 · «el cansancio sigue ahí, esperando su turno»: cola de moléculas adormiladas
 B.push({ t0: S.b7, t1: S.b8, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  P.fondo(ctx, t, 'cartoon', { c0: '#5b2d9e', c1: '#24105c' }); P.keyLock(ctx, 540, 640, 170, t, { u: 1, fake: true });
  for (let i = 0; i < 12; i++) { const r = Math.floor(i / 4), c = i % 4, e = E.out(win(t, S.b7 + 0.1 + i * 0.08, S.b7 + 0.4 + i * 0.08)); P.character(ctx, 'molecula', 220 + c * 215 + (r % 2) * 40, 980 + r * 150 + (1 - e) * 80, 52, t, { col: ADE, mood: i % 3 ? 'dormido' : 'serio', seed: i + 3, bounce: 0.3 }); }
  P.tag(ctx, 'ESPERANDO SU TURNO', 540, 1400, t, Tk.turno - 0.4, S.b8, { mono: true });
 }, sfx(k) { for (let i = 0; i < 4; i++) FX.aparece(k, S.b7 + 0.15 + i * 0.25, 420 + i * 40); FX.etiqueta(k, Tk.turno - 0.4); } });
 // 8 · PLANO TÉCNICO: la mitad sigue en sangre 5 h después; de las 17:00 a las 22:00
 B.push({ t0: S.b8, t1: S.b9, in: { type: 'rise', d: 0.4 }, draw(ctx, t) {
  PL.setSkin('blueprint'); P.fondo(ctx, t, 'blueprint');
  P.hud(ctx, t, [{ label: 'Cafeína en sangre', from: 100, to: 50, t0: Tk.cinco, t1: Tk.mitad + 0.4, suffix: '%', y: 470 }, { label: 'Horas', from: 0, to: 5, t0: Tk.cinco, t1: Tk.mitad + 0.4, x: 'right', hi: true, y: 470 }]);
  const ba = 1 - sm(Tk.si - 0.3, Tk.si, t); if (ba > 0) { ctx.save(); ctx.globalAlpha *= ba; P.barsGrow(ctx, 160, 640, 760, 560, [100, 50, 25], lerp(0, 3, win(t, Tk.cinco - 0.2, Tk.sangre + 0.2)), { labels: ['0 h', '5 h', '10 h'], hi: (i) => i === 1, fmt: (v) => v + ' %' }); ctx.restore(); }
  const ca = sm(Tk.si - 0.3, Tk.si, t); if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; const h = lerp(17, 22, E.inOut(win(t, Tk.tarde, Tk.diez + 0.2))); P.clockBP(ctx, 540, 920, 270, h, { hi: [17, h], label: 'Café a las 17:00' }); P.statBig(ctx, '50 %', 540, 1390, t, Tk.mitad2 - 0.2, S.b9, { px: 110, sub: 'sigue en tu sangre', col: '#F8CD45' }); ctx.restore(); }
  PL.setSkin('cartoon');
 }, sfx(k) { FX.contador(k, Tk.cinco, Tk.mitad + 0.4, 100, 50); FX.tictac(k, Tk.tarde, 4, 0.3); FX.aparece(k, Tk.mitad2 - 0.2, 660); } });
 // 9 · CIERRE: «Envíaselo a ese amigo…» (móvil, hoja de compartir, toque, enviado) + marca
 B.push({ t0: S.b9, t1: DURATION, in: { type: 'zoom', d: 0.4, x: 540, y: 960 }, draw(ctx, t) {
  P.fondo(ctx, t, 'producto'); P.ctaShare(ctx, t, S.b9 + 0.1, DURATION + 1, { preview: (c, x, y, w, h) => P.mini(c, x, y, w, h, (cc) => { P.fondo(cc, t, 'cartoon'); P.character(cc, 'cerebro', 540, 900, 250, t, { mood: 'mareado' }); }), names: ['Lucía', 'Javi', 'Marta', 'Dani'] });
  P.marca(ctx, t, T.end + 0.2, { y: 1765 });
 }, sfx(k) { FX.compartir(k, S.b9 + 0.1); FX.fin(k, T.end + 0.3); } });

 const EP = PL.make({
  estilo: 'cartoon', marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  keywords: ['café', 'sueño?', 'energía.', 'trampa', 'cerebro.', 'adenosina,', 'cansancio.', 'cerraduras,', 'cafeína', 'forma.', 'abre.', 'turno.', 'mitad', 'sangre.', 'diez', 'amigo'],
  capIcons: { café: 'cafe', cerebro: 'cerebro', sangre: 'gota' },
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 500, gain: 0.005, a: 0.8, hold: DURATION - 2.2 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 100, gain: 0.55, chords: [['C3', 'E3', 'G3', 'C4'], ['A2', 'C3', 'E3', 'A3'], ['F2', 'A2', 'C3', 'F3'], ['G2', 'B2', 'D3', 'G3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
