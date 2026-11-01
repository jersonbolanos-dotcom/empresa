// =====================================================================================================
// episodio.js — «¿Cómo construyeron las pirámides sin máquinas?» · Asombroteca · PLANTILLA ASOMBROTECA v1.8
// Arco: Gran Pirámide (≈ 146 m, sin grúas ni motores) → millones de bloques de varias toneladas → el primer reto:
// transportarlos → trineos y cuerdas → arena húmeda (menos fuerza) → ¿cómo subían? → rampas (hipótesis principal)
// → los arqueólogos debaten (recta, zigzag, espiral, interna) → lo que sí sabemos (trabajadores, cobre, medición,
// organización) → planificación y años de trabajo → preguntas abiertas → una hazaña de ingeniería → Asombroteca.
// Cifras verificadas en FUENTES_Y_DECISIONES.md. Reloj = voz original. Determinista (H.rng).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const C = { noche: '#1b1430', arena: '#d9a865', oro: '#FFD447', ocre: '#c98a3a', tinta: '#2a1a0e', blanco: '#FFF8EC', azul: '#2f80ed', agua: '#38C9FF', rojo: '#e8505b', verde: '#2fbf71', papel: '#f6ead0' };
 const T = {
  anos: wt(0, '4.500'), anos2: wt(0, 'años'), egipcios: wt(1, 'egipcios'), piramide1: wt(1, 'pirámide'), m150: wt(1, '150'), metros: wt(1, 'metros'), sin1: wt(1, 'sin'), gruas: wt(1, 'grúas'), excavadoras: wt(1, 'excavadoras'), motores: wt(1, 'motores'),
  como2: SG(2).s, hazana: wt(2, 'hazaña'),
  la3: SG(3).s, giza: wt(3, 'giza'), cantidades: wt(3, 'cantidades'), bloques3: wt(3, 'bloques'), piedra3: wt(3, 'piedra'), algunos: SG(4).s, toneladas: wt(4, 'toneladas'),
  pero5: SG(5).s, desafio: wt(5, 'desafío'), no5: wt(5, 'no'), levantarlos: wt(5, 'levantarlos'), era6: SG(6).s, transportarlos: wt(6, 'transportarlos'),
  los7: SG(7).s, trabajadores7: wt(7, 'trabajadores'), bloques7: wt(7, 'bloques'), trineos: wt(7, 'trineos'), madera: wt(7, 'madera'), arrastrarlos: wt(7, 'arrastrarlos'), cuerdas: wt(7, 'cuerdas'),
  y8: SG(8).s, detalle: wt(8, 'detalle'), sorprendente: wt(8, 'sorprendente'),
  humedecer: SG(9).s, arena: wt(9, 'arena'), delante: wt(9, 'delante'), reducir: wt(9, 'reducir'), fuerza: wt(9, 'fuerza'), moverlo: wt(9, 'moverlo'),
  algo10: SG(10).s, sencillo: wt(10, 'sencillo'), agua: wt(10, 'agua'), facilitaba: wt(10, 'facilitaba'), gigantescas: wt(10, 'gigantescas'),
  pero11: SG(11).s, problema: wt(11, 'problema'), dificil: wt(11, 'difícil'), como12: SG(12).s, subian: wt(12, 'subían'), crecia: wt(12, 'crecía'),
  una13: SG(13).s, explicaciones: wt(13, 'explicaciones'), rampas13: wt(13, 'rampas'), arrastraban: wt(13, 'arrastraban'), niveles: wt(13, 'niveles'), altos: wt(13, 'altos'),
  sin14: SG(14).s, arqueologos: wt(14, 'arqueólogos'), debaten: wt(14, 'debaten'), exactamente: wt(14, 'exactamente'), construidas: wt(14, 'construidas'), organizadas: wt(14, 'organizadas'), rampas14: wt(14, 'rampas'),
  tambien: SG(15).s, sabemos: wt(15, 'sabemos'), trabajadores15: wt(15, 'trabajadores'), herramientas: SG(16).s, cobre: wt(16, 'cobre'), instrumentos: SG(17).s, medicion: wt(17, 'medición'), y18: SG(18).s, capacidad: wt(18, 'capacidad'), organizacion: wt(18, 'organización'),
  no19: SG(19).s, improvisada: wt(19, 'improvisada'), fue20: SG(20).s, planificacion: wt(20, 'planificación'), conocimientos: wt(20, 'conocimientos'), anos20: wt(20, 'años'), coordinado: wt(20, 'coordinado'),
  y21: SG(21).s, preguntas: wt(21, 'preguntas'), detalles: wt(21, 'detalles'), algo22: SG(22).s, claro: wt(22, 'claro'),
  las23: SG(23).s, necesitaban: wt(23, 'necesitaban'), tecnologia: wt(23, 'tecnología'), moderna: wt(23, 'moderna'), mayores: wt(23, 'mayores'), hazanas: wt(23, 'hazañas'), ingenieria: wt(23, 'ingeniería'), historia: wt(23, 'historia'),
  sigue: SG(24).s, asombroteca: wt(24, 'asombroteca'), end: A.speech_end,
 };
 const TB = { bloques: T.la3 - 0.2, reto: T.pero5 - 0.15, trineo: T.los7 - 0.2, agua: T.y8 - 0.15, subir: T.pero11 - 0.15, rampa: T.una13 - 0.2, debate: T.sin14 - 0.15, sabemos: T.tambien - 0.15, plan: T.no19 - 0.15, dudas: T.y21 - 0.15, final: T.las23 - 0.2, cierre: T.sigue - 0.15 };

 // ---------------- utilidades ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, px, a, c = 'rgba(255,248,236,0.98)') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `600 ${px}px "IBM Plex Mono"`; const w = ctx.measureText(s).width + px * 1.2; P.rr(ctx, x - w / 2, y - px * 0.85, w, px * 1.7, px * 0.85, 'rgba(42,26,14,0.72)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, x, y + 1); ctx.restore(); };
 const card = (ctx, x, y, w, h, a, fn) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x, y, w, h, 28, 'rgba(255,248,236,0.96)', { sy: 10 }); fn(); ctx.restore(); };
 const callout = (ctx, x0, y0, x1, y1, s, sub, a, c = C.tinta) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 7, 0, TAU); ctx.fill(); ctx.font = '800 32px Nunito'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.shadowColor = 'rgba(255,240,220,0.95)'; ctx.shadowBlur = 8; ctx.fillText(s, x1 + 10, y1 - (sub ? 14 : 0)); if (sub) { ctx.font = '600 22px "IBM Plex Mono"'; ctx.fillText(sub, x1 + 10, y1 + 20); } ctx.restore(); };
 const scrim = (ctx) => { const g = ctx.createLinearGradient(0, 1400, 0, 1760); g.addColorStop(0, 'rgba(40,22,8,0)'); g.addColorStop(0.5, 'rgba(40,22,8,0.6)'); g.addColorStop(1, 'rgba(40,22,8,0.6)'); ctx.fillStyle = g; ctx.fillRect(0, 1400, W, 520); };
 // iconos de maquinaria moderna (para tachar)
 const crane = (ctx, x, y, s) => { ctx.save(); ctx.strokeStyle = '#f0b90b'; ctx.lineWidth = s * 0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - s * 0.2, y + s * 0.5); ctx.lineTo(x - s * 0.2, y - s * 0.5); ctx.lineTo(x + s * 0.55, y - s * 0.5); ctx.moveTo(x - s * 0.45, y - s * 0.5); ctx.lineTo(x - s * 0.2, y - s * 0.5); ctx.moveTo(x + s * 0.4, y - s * 0.5); ctx.lineTo(x + s * 0.4, y - s * 0.1); ctx.stroke(); ctx.fillStyle = '#f0b90b'; ctx.fillRect(x - s * 0.4, y + s * 0.42, s * 0.4, s * 0.1); ctx.restore(); };
 const excavator = (ctx, x, y, s) => { ctx.save(); ctx.fillStyle = '#f0b90b'; ctx.fillRect(x - s * 0.45, y - s * 0.05, s * 0.55, s * 0.3); ctx.fillStyle = '#333'; ctx.fillRect(x - s * 0.5, y + s * 0.25, s * 0.65, s * 0.15); ctx.strokeStyle = '#f0b90b'; ctx.lineWidth = s * 0.08; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + s * 0.05, y); ctx.lineTo(x + s * 0.3, y - s * 0.35); ctx.lineTo(x + s * 0.5, y + s * 0.15); ctx.stroke(); ctx.restore(); };
 const gear = (ctx, x, y, s, a = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#9aa7b6'; for (let i = 0; i < 8; i++) { ctx.rotate(TAU / 8); ctx.fillRect(-s * 0.08, -s * 0.48, s * 0.16, s * 0.15); } ctx.beginPath(); ctx.arc(0, 0, s * 0.36, 0, TAU); ctx.fill(); ctx.fillStyle = '#4a4a55'; ctx.beginPath(); ctx.arc(0, 0, s * 0.14, 0, TAU); ctx.fill(); ctx.restore(); };
 const person = (ctx, x, y, h, c = C.tinta) => { ctx.save(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y - h * 0.88, h * 0.11, 0, TAU); ctx.fill(); ctx.fillRect(x - h * 0.11, y - h * 0.75, h * 0.22, h * 0.42); ctx.fillRect(x - h * 0.1, y - h * 0.35, h * 0.08, h * 0.35); ctx.fillRect(x + h * 0.02, y - h * 0.35, h * 0.08, h * 0.35); ctx.restore(); };

 // escena del arrastre (trineo + cuerdas + trabajadores), compartida por los beats 4 y 5
 const GY = 1180;
 function haul(ctx, t, st) {
  const yAt = P.desert(ctx, GY, t, { sunX: 160, sunY: 420 });
  P.pyramid(ctx, 860, GY - 120, 380, 240, { built: 0.55, courses: 12, joints: 0.5 }); P.palm(ctx, 120, GY + 10, 200, t); P.palm(ctx, 1010, GY + 30, 160, t + 1);
  const sx = st.x; // posición del trineo
  // arena húmeda delante del trineo
  if (st.wet > 0) { ctx.save(); ctx.globalAlpha = st.wet; ctx.fillStyle = 'rgba(120,80,40,0.55)'; ctx.beginPath(); ctx.ellipse(sx + 300, GY + 26, 330, 22, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  const ph = st.walk; // fase de la marcha
  const anchor = P.sled(ctx, sx, GY + 18, 300, {});
  const N = 6, gap = 70, x0 = sx + 240; const hands = [];
  for (let i = 0; i < N; i++) { const wx = x0 + 80 + i * gap; hands.push(P.worker(ctx, wx, GY + 22, 140, ph + i * 0.13, { pose: 'pull' })); }
  P.rope(ctx, [anchor, ...hands.map((h) => [h[0], h[1]])], 5);
  // aguador delante del trineo
  if (st.pour > 0) { ctx.save(); ctx.globalAlpha = st.pour; const hp = P.worker(ctx, sx + 250, GY + 22, 130, 0, { pose: 'pour', c: '#5a3a22' }); ctx.strokeStyle = 'rgba(56,201,255,0.85)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; for (let k = 0; k < 4; k++) { const u = ((t * 2.2 + k / 4) % 1); ctx.beginPath(); ctx.moveTo(hp[0] + 16, hp[1] + 4 + u * 90); ctx.lineTo(hp[0] + 18, hp[1] + 14 + u * 90); ctx.stroke(); } ctx.restore(); }
  return yAt;
 }

 // ================= BEATS =================
 const B = [];
 // 1 · gancho: hace más de 4.500 años · casi 150 m · sin grúas, excavadoras ni motores · ¿cómo?
 B.push({ t0: 0, t1: TB.bloques, draw(ctx, t) {
  const cam = P.camAt([[0, 600, 1180, 2.4], [2.2, 560, 860, 1.6], [T.m150 - 0.2, 540, 960, 1.0], [TB.bloques, 540, 960, 1.04]], t);
  ctx.save(); P.camApply(ctx, cam); P.desert(ctx, 1250, t, { sunX: 860, sunY: 470 });
  P.pyramid(ctx, 300, 1180, 320, 200, { courses: 10, joints: 0.4 }); const pyr = P.pyramid(ctx, 560, 1250, 860, 560, { courses: 30 });
  person(ctx, 160, 1262, 26, '#3a2410'); ctx.restore();
  // regla de altura (≈ 146 m) con persona a escala
  const ha = sm(T.m150 - 0.2, T.m150 + 0.3, t) * (1 - sm(T.sin1 + 0.2, T.sin1 + 0.6, t));
  if (ha > 0) { const y0 = 1250 + 0, y1 = 1250 - 560 * 1.04 * 0 - 560; ctx.save(); ctx.globalAlpha = ha; ctx.strokeStyle = C.blanco; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1000, 1250); ctx.lineTo(1000, 690); ctx.moveTo(980, 690); ctx.lineTo(1020, 690); ctx.moveTo(980, 1250); ctx.lineTo(1020, 1250); ctx.stroke(); ctx.restore(); P.counter(ctx, 820, 760, 70, t, T.m150, T.metros + 0.3, 0, 146, { box: C.oro, c: C.tinta, prefix: '≈ ', suffix: ' m' }); tag(ctx, 'altura original', 820, 840, 24, ha); tag(ctx, '↙ una persona', 260, 1300, 22, ha); }
  P.counter(ctx, 540, 380, 84, t, T.anos - 0.1, T.anos2, 0, 4500, { box: C.oro, c: C.tinta, prefix: '+ ', suffix: ' años', fmt: (v) => v.toLocaleString('es-CO') });
  // sin grúas · excavadoras · motores
  const ia = sm(T.sin1 - 0.1, T.sin1 + 0.2, t) * (1 - sm(T.como2 - 0.1, T.como2 + 0.2, t));
  if (ia > 0) { ctx.save(); ctx.globalAlpha = ia; [[270, crane, T.gruas], [540, excavator, T.excavadoras], [810, (c, x, y, s) => gear(c, x, y, s, t), T.motores]].forEach(([x, fn, tt]) => { P.circle(ctx, x, 560, 95, 'rgba(255,248,236,0.92)'); fn(ctx, x, 560, 120); if (t > tt) P.cross(ctx, x, 560, 150, E.out(win(t, tt, tt + 0.3)), C.rojo); }); ctx.restore(); }
  P.onoma(ctx, '¿CÓMO LO LOGRARON?', 540, 560, 84, t, T.como2, TB.bloques + 0.2, { c: C.oro });
  scrim(ctx);
 }, sfx(k) { FX.viento(k, 0, TB.bloques, 1); k.play('riser', 0.1, { dur: 2, gain: 0.35 }); FX.contador(k, T.anos - 0.1, T.anos2, 0, 45); k.play('whoosh', 2.0, { dur: 1.4, top: 1200, gain: 0.35 }); FX.contador(k, T.m150, T.metros + 0.3, 0, 30); [T.gruas, T.excavadoras, T.motores].forEach((x) => FX.tachado(k, x)); FX.onomatopeya(k, T.como2); } });
 // 2 · la Gran Pirámide de Giza: millones de bloques, algunos de varias toneladas
 B.push({ t0: TB.bloques, t1: TB.reto, in: { type: 'zoom', d: 0.6, x: 600, y: 900 }, draw(ctx, t) {
  const cam = P.camAt([[TB.bloques, 540, 960, 1], [T.cantidades, 620, 980, 1.8], [T.algunos, 650, 1060, 3.2]], t);
  ctx.save(); P.camApply(ctx, cam); P.desert(ctx, 1250, t, { sunX: 860, sunY: 470 }); const pyr = P.pyramid(ctx, 560, 1250, 860, 560, { courses: 30 });
  const hl = sm(T.bloques3, T.bloques3 + 0.3, t); if (hl > 0) { const a = pyr.at('left', 0.2, 0.62), b = pyr.at('left', 0.233, 0.62); ctx.save(); ctx.globalAlpha = hl; ctx.strokeStyle = C.oro; ctx.lineWidth = 3; ctx.strokeRect(a[0] - 6, b[1], 18, a[1] - b[1]); ctx.restore(); }
  ctx.restore();
  pill(ctx, 'GRAN PIRÁMIDE DE GIZA', 540, 330, 44, t, T.giza, C.oro, C.tinta);
  const ca = sm(T.cantidades - 0.1, T.cantidades + 0.3, t) * (1 - sm(T.algunos, T.algunos + 0.3, t)); if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; P.counter(ctx, 540, 470, 80, t, T.cantidades, T.piedra3 + 0.3, 0, 23, { box: C.blanco, c: C.tinta, prefix: '≈ ', suffix: ' millones', fmt: (v) => (v / 10).toFixed(1).replace('.', ',') }); ctx.restore(); tag(ctx, 'de bloques de piedra (estimación)', 540, 560, 26, ca); }
  const ba = sm(T.algunos - 0.1, T.algunos + 0.3, t); card(ctx, 110, 400, 860, 330, ba, () => { P.block(ctx, 170, 520, 250, 150, { seed: 3 }); person(ctx, 470, 670, 110); P.text(ctx, '≈ 2,5 t', 720, 520, 62, C.tinta, { kind: 'title' }); P.text(ctx, 'de media por bloque', 720, 580, 26, '#6b4a2b'); P.text(ctx, 'algunos de granito: más de 50 t', 720, 640, 24, '#a0391f'); P.text(ctx, '1 t = 1.000 kg', 540, 700, 20, '#6b4a2b'); });
 }, sfx(k) { FX.viento(k, TB.bloques, TB.reto - TB.bloques, 0.8); FX.sello(k, T.giza); k.play('whoosh', T.cantidades - 0.2, { dur: 0.9, top: 1000, gain: 0.3 }); FX.etiqueta(k, T.bloques3); FX.piedra(k, T.algunos, 0.8); FX.etiqueta(k, T.toneladas); } });
 // 3 · el primer desafío: no era levantarlos, era transportarlos
 B.push({ t0: TB.reto, t1: TB.trineo, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  P.desert(ctx, 1180, t, { sunX: 870, sunY: 430 });
  P.pyramid(ctx, 860, 1150, 300, 200, { built: 0.5, courses: 10, joints: 0.5 });
  // cantera a la izquierda
  ctx.fillStyle = '#b78a52'; ctx.beginPath(); ctx.moveTo(0, 1180); ctx.lineTo(0, 960); ctx.lineTo(140, 980); ctx.lineTo(220, 1060); ctx.lineTo(260, 1180); ctx.closePath(); ctx.fill(); for (let i = 0; i < 3; i++) P.block(ctx, 40 + i * 60, 1120 - (i % 2) * 40, 60, 40, { seed: i });
  tag(ctx, 'CANTERA', 130, 930, 26, 1, C.tinta); tag(ctx, 'OBRA', 860, 900, 26, 1, C.tinta);
  P.block(ctx, 300, 1080, 120, 80, { seed: 9 });
  // levantar: flecha hacia arriba (no era el primer reto)
  const ua = sm(T.desafio, T.desafio + 0.3, t); if (ua > 0) { ctx.save(); ctx.globalAlpha = ua * (1 - 0.5 * sm(T.no5, T.no5 + 0.3, t)); P.arrow(ctx, 360, 1050, 360, 760, E.out(win(t, T.desafio, T.levantarlos)), C.blanco, 26); ctx.restore(); tag(ctx, 'levantarlos', 360, 720, 26, ua); }
  // transportar: flecha larga hasta la obra
  const ta = sm(T.era6 - 0.1, T.transportarlos, t); if (ta > 0) P.arrow(ctx, 440, 1120, 760, 1120, E.out(ta), C.oro, 30);
  pill(ctx, 'EL PRIMER DESAFÍO', 540, 330, 44, t, T.pero5 + 0.1, C.blanco, C.tinta, T.era6);
  pill(ctx, 'TRANSPORTARLOS', 540, 330, 50, t, T.era6, C.oro, C.tinta);
  tag(ctx, 'caliza fina de Tura y granito de Asuán llegaban por el Nilo', 540, 1380, 22, sm(T.transportarlos, T.transportarlos + 0.4, t));
 }, sfx(k) { FX.viento(k, TB.reto, TB.trineo - TB.reto, 0.7); FX.etiqueta(k, T.pero5 + 0.1); k.play('riser', T.desafio, { dur: 0.8, gain: 0.25 }); FX.tachado(k, T.levantarlos + 0.2); FX.flecha(k, T.era6, 0.8); FX.sello(k, T.era6 + 0.05); } });
 // 4 · trineos de madera y cuerdas
 B.push({ t0: TB.trineo, t1: TB.agua, in: { type: 'iris', d: 0.6, x: 300, y: 1100 }, draw(ctx, t) {
  const x = lerp(170, 260, win(t, TB.trineo, TB.agua)); haul(ctx, t, { x, walk: t * 0.55, wet: 0, pour: 0 });
  callout(ctx, x + 40, GY - 10, 140, 900, 'TRINEO DE MADERA', '', sm(T.trineos, T.trineos + 0.3, t));
  callout(ctx, x + 420, GY - 70, 520, 820, 'CUERDAS', '', sm(T.cuerdas - 0.1, T.cuerdas + 0.2, t));
  pill(ctx, 'ARRASTRE CON TRINEOS', 540, 330, 44, t, T.trineos, C.oro, C.tinta);
  scrim(ctx);
 }, sfx(k) { FX.arrastre(k, TB.trineo, TB.agua - TB.trineo + 0.2, 1); FX.esfuerzo(k, TB.trineo + 0.4, 6, 0.9, 0.9); FX.etiqueta(k, T.trineos); FX.etiqueta(k, T.cuerdas); } });
 // 5 · el detalle sorprendente: humedecer la arena reduce la fuerza (hasta la mitad en el laboratorio)
 B.push({ t0: TB.agua, t1: TB.subir, in: { type: 'cut' }, draw(ctx, t) {
  const fast = sm(T.moverlo, T.agua, t), x = 260 + (t - TB.agua) * 6 + fast * (t - T.moverlo) * 14;
  haul(ctx, t, { x, walk: t * (0.55 + 0.35 * fast), wet: sm(T.humedecer, T.arena + 0.4, t), pour: sm(T.humedecer - 0.3, T.humedecer, t) });
  pill(ctx, 'UN DETALLE SORPRENDENTE', 540, 330, 40, t, T.detalle - 0.1, C.blanco, C.tinta, T.humedecer);
  pill(ctx, 'ARENA HÚMEDA', 540, 330, 50, t, T.humedecer, C.agua, C.tinta, T.agua - 0.1);
  pill(ctx, '¡AGUA!', 540, 330, 56, t, T.agua - 0.05, C.agua, C.tinta);
  // fuerza necesaria (barra) que baja
  const fa = sm(T.reducir - 0.4, T.reducir, t); card(ctx, 110, 420, 860, 210, fa, () => { const f = 1 - 0.5 * E.inOut(win(t, T.reducir, T.moverlo)); P.text(ctx, 'FUERZA PARA ARRASTRAR', 540, 465, 30, C.tinta, { kind: 'title' }); ctx.fillStyle = '#eadcc0'; ctx.fillRect(170, 510, 740, 52); ctx.fillStyle = f > 0.6 ? C.rojo : C.verde; ctx.fillRect(170, 510, 740 * f, 52); P.text(ctx, Math.round(f * 100) + ' %', 540, 538, 32, C.blanco, { kind: 'title' }); P.text(ctx, 'arena seca → arena húmeda', 540, 598, 22, '#6b4a2b'); });
  tag(ctx, 'en laboratorio: con 2–5 % de agua, hasta la mitad de fuerza (U. de Ámsterdam, 2014)', 540, 665, 19, fa);
  // granos de arena: secos vs húmedos (puentes de agua)
  const la = sm(T.arena - 0.1, T.arena + 0.3, t) * (1 - sm(T.reducir - 0.5, T.reducir - 0.2, t)); if (la > 0) { ctx.save(); ctx.globalAlpha = la; [[300, false, 'SECA: se hunde'], [780, true, 'HÚMEDA: más firme']].forEach(([cx, wet, s]) => { P.lens(ctx, cx, 560, 150, 1, () => { ctx.fillStyle = '#f3dcae'; ctx.fillRect(cx - 160, 400, 320, 320); const R = H.rng(wet ? 4 : 5); const gr = []; for (let i = 0; i < 22; i++) gr.push([cx + R.range(-120, 120), 560 + R.range(-110, 110), R.range(14, 22)]); if (wet) { ctx.strokeStyle = 'rgba(56,201,255,0.8)'; ctx.lineWidth = 8; gr.forEach((a, i) => gr.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < a[2] + b[2] + 10) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } })); } gr.forEach(([x, y, r]) => P.circle(ctx, x, y, r, '#c99a5a')); }); tag(ctx, s, cx, 750, 24, 1); }); ctx.restore(); }
  tag(ctx, 'una pintura de la tumba de Djehutihotep muestra a alguien vertiendo agua delante de un trineo', 540, 1390, 17, sm(T.facilitaba, T.facilitaba + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.arrastre(k, TB.agua, TB.subir - TB.agua, 0.9); FX.esfuerzo(k, TB.agua + 0.3, 5, 0.9, 0.7); k.play('sparkle', T.sorprendente, { gain: 0.35, n: 6 }); FX.vertido(k, T.humedecer, 2.2, 1); FX.aparece(k, T.arena, 600); k.play('riser', T.reducir, { dur: 1.4, gain: 0.25 }); FX.correcto(k, T.moverlo + 0.1); FX.sello(k, T.agua - 0.05); FX.arrastre(k, T.facilitaba, TB.subir - T.facilitaba, 0.5, 900); } });
 // 6 · el problema más difícil: ¿cómo subían los bloques mientras la pirámide crecía?
 B.push({ t0: TB.subir, t1: TB.rampa, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  P.desert(ctx, 1260, t, { sunX: 880, sunY: 420 });
  const b = lerp(0.42, 0.56, E.inOut(win(t, T.crecia - 0.6, T.crecia + 0.4))); const pyr = P.pyramid(ctx, 560, 1260, 820, 540, { built: b, courses: 26 });
  P.block(ctx, 150, 1180, 110, 70, { seed: 2 }); const top = pyr.at('left', b, 0.6);
  const aa = sm(T.subian - 0.2, T.subian + 0.3, t); if (aa > 0) { ctx.save(); ctx.globalAlpha = aa; ctx.setLineDash([16, 12]); ctx.strokeStyle = C.blanco; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(205, 1170); ctx.quadraticCurveTo(220, top[1] - 120, top[0] - 20, top[1] - 20); ctx.stroke(); ctx.restore(); [[260, 900], [460, 780], [700, 860]].forEach(([x, y], i) => P.qmark(ctx, x, y, 90 + i * 10, t)); }
  pill(ctx, 'EL PROBLEMA MÁS DIFÍCIL', 540, 330, 42, t, T.problema - 0.1, C.rojo, C.blanco, T.como12);
  pill(ctx, '¿CÓMO SUBÍAN LOS BLOQUES?', 540, 330, 42, t, T.como12, C.oro, C.tinta);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.subir, TB.rampa - TB.subir, 0.7); FX.etiqueta(k, T.problema - 0.1); FX.onomatopeya(k, T.como12); k.play('riser', T.subian, { dur: 1.4, gain: 0.3 }); FX.piedra(k, T.crecia, 0.5); } });
 // 7 · rampas: una de las principales explicaciones
 B.push({ t0: TB.rampa, t1: TB.debate, in: { type: 'cut' }, draw(ctx, t) {
  P.desert(ctx, 1260, t, { sunX: 880, sunY: 420 });
  const b = lerp(0.56, 0.74, E.inOut(win(t, T.niveles - 0.3, T.altos + 0.6))); const pyr = P.pyramid(ctx, 620, 1260, 820, 540, { built: b, courses: 26 });
  const rp = E.out(win(t, T.rampas13 - 0.6, T.rampas13 + 0.3)); const L = P.ramp(ctx, pyr, 'recta', rp, { top: b, len: 300 });
  if (rp > 0.9) for (let i = 0; i < 3; i++) { const u = ((t - T.rampas13) * 0.06 + i / 3) % 1; const [x, y, a] = L.at(L.L * u); ctx.save(); ctx.translate(x, y); ctx.rotate(a); P.sled(ctx, 0, -2, 70, {}); for (let j = 0; j < 3; j++) P.worker(ctx, 60 + j * 22, 0, 40, t * 0.6 + j * 0.2, { pose: 'pull' }); ctx.restore(); }
  pill(ctx, 'RAMPAS', 540, 330, 54, t, T.rampas13, C.oro, C.tinta);
  tag(ctx, 'una de las explicaciones principales (hipótesis)', 540, 420, 24, sm(T.explicaciones, T.explicaciones + 0.4, t));
  tag(ctx, 'la rampa crece junto con la pirámide', 540, 1390, 22, sm(T.niveles, T.niveles + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.rampa, TB.debate - TB.rampa, 0.6); FX.etiqueta(k, T.explicaciones); FX.arrastre(k, T.rampas13 - 0.6, 1.0, 0.8, 500); FX.sello(k, T.rampas13); FX.esfuerzo(k, T.arrastraban, 4, 0.8, 0.7); FX.piedra(k, T.altos, 0.6); } });
 // 8 · los arqueólogos todavía debaten: recta, zigzag, espiral, interna
 const RAMPS = [['recta', 'RECTA'], ['zigzag', 'ZIGZAG'], ['espiral', 'EN ESPIRAL'], ['interna', 'INTERNA']];
 B.push({ t0: TB.debate, t1: TB.sabemos, in: { type: 'iris', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  ctx.fillStyle = '#3a2412'; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 900, 700, '255,200,120', 0.15);
  RAMPS.forEach(([k, s], i) => { const cx = 290 + (i % 2) * 500, cy = 640 + Math.floor(i / 2) * 430, t0 = T.debaten + i * 0.45; const a = sm(t0 - 0.2, t0 + 0.2, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; P.rr(ctx, cx - 230, cy - 200, 460, 390, 26, '#f3dcae'); const pyr = P.pyramid(ctx, cx + (k === 'recta' ? 60 : 0), cy + 120, 300, 220, { built: 0.85, courses: 10, joints: 0.4 }); P.ramp(ctx, pyr, k, E.out(win(t, t0, t0 + 0.8)), { top: 0.85, len: 110, w: 7, c: k === 'interna' ? '#a0391f' : 'rgba(150,95,45,0.95)' }); P.text(ctx, s, cx, cy - 160, 32, C.tinta, { kind: 'title' }); P.qmark(ctx, cx + 180, cy - 140, 60, t + i, '#a0391f'); ctx.restore(); });
  pill(ctx, 'LOS ARQUEÓLOGOS AÚN DEBATEN', 540, 330, 40, t, T.arqueologos, C.oro, C.tinta);
  tag(ctx, 'quizá combinaron varias · Hatnub (2018): rampa con postes para cuerdas en una cantera', 540, 1390, 18, sm(T.organizadas, T.organizadas + 0.4, t));
 }, sfx(k) { FX.revelar(k, TB.debate + 0.1); RAMPS.forEach((_, i) => { FX.aparece(k, T.debaten + i * 0.45, 500 + i * 80); k.play('stroke', T.debaten + i * 0.45, { material: 'pencil', dur: 0.7, gain: 0.2, minor: true }); }); FX.onomatopeya(k, T.rampas14); } });
 // 9 · lo que sí sabemos: trabajadores especializados, herramientas de cobre, medición, organización
 const KNOW = [
  [() => T.trabajadores15, 'TRABAJADORES ESPECIALIZADOS', 'vivían en una aldea junto a la obra', (ctx, x, y, t) => { for (let i = 0; i < 3; i++) P.worker(ctx, x - 50 + i * 50, y + 60, 110, t * 0.5 + i * 0.3, { pose: 'walk' }); }],
  [() => T.herramientas, 'HERRAMIENTAS DE COBRE', 'cinceles y sierras (con arena como abrasivo)', (ctx, x, y) => { P.tool(ctx, 'cincel', x - 40, y, 110, -0.4); P.tool(ctx, 'sierra', x + 30, y + 10, 120, 0.2); }],
  [() => T.instrumentos, 'INSTRUMENTOS DE MEDICIÓN', 'codo real (≈ 52 cm), plomada, escuadra', (ctx, x, y) => { P.tool(ctx, 'codo', x, y + 40, 150, 0); P.tool(ctx, 'plomada', x - 40, y - 20, 80, 0); P.tool(ctx, 'escuadra', x + 50, y - 20, 70, 0); }],
  [() => T.capacidad, 'ORGANIZACIÓN', 'papiros de Merer: registro del transporte', (ctx, x, y) => P.papyrus(ctx, x - 70, y - 40, 140, 90, { rows: 4 })],
 ];
 B.push({ t0: TB.sabemos, t1: TB.plan, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  ctx.fillStyle = '#3a2412'; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 900, 700, '255,200,120', 0.15);
  pill(ctx, 'LO QUE SÍ SABEMOS', 540, 330, 44, t, T.sabemos - 0.1, C.oro, C.tinta);
  KNOW.forEach(([f, s, sub, icon], i) => { const t0 = f(), y = 470 + i * 235, a = sm(t0 - 0.2, t0 + 0.1, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const dx = (1 - E.out(a)) * 200; P.rr(ctx, 80 + dx, y, 920, 205, 26, '#f3dcae', { sy: 8 }); ctx.save(); ctx.beginPath(); ctx.rect(90 + dx, y + 10, 220, 185); ctx.clip(); icon(ctx, 200 + dx, y + 100, t); ctx.restore(); P.text(ctx, s, 330 + dx, y + 75, 34, C.tinta, { kind: 'title', align: 'left' }); ctx.font = '600 22px "IBM Plex Mono"'; ctx.fillStyle = '#6b4a2b'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(sub, 330 + dx, y + 135); ctx.restore(); });
 }, sfx(k) { FX.revelar(k, TB.sabemos + 0.1); FX.aparece(k, T.trabajadores15, 520); FX.esfuerzo(k, T.trabajadores15 + 0.2, 1, 0.5, 0.5); FX.aparece(k, T.herramientas, 600); FX.cincel(k, T.cobre, 3, 0.25); FX.aparece(k, T.instrumentos, 680); FX.tictac(k, T.medicion, 2, 0.3); FX.aparece(k, T.capacidad, 760); k.play('paper', T.organizacion, { dur: 0.6, gain: 0.4 }); } });
 // 10 · no fue improvisada: planificación, conocimientos técnicos y años de trabajo coordinado
 B.push({ t0: TB.plan, t1: TB.dudas, in: { type: 'zoom', d: 0.6, x: 540, y: 700 }, draw(ctx, t) {
  ctx.fillStyle = '#123a5a'; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = 'rgba(200,230,255,0.12)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); } for (let y = 0; y < HH; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // plano de la base (cuadrado con diagonales) que se traza, y la brújula
  const pa = E.inOut(win(t, T.no19, T.planificacion + 0.4)); ctx.save(); ctx.strokeStyle = '#e8f4ff'; ctx.lineWidth = 4; const sq = [[300, 420], [780, 420], [780, 900], [300, 900], [300, 420]]; const L = P.path(sq), part = [sq[0]]; let acc = 0; for (let i = 1; i < sq.length; i++) { const d = 480; if (acc + d >= L.L * pa) { const q = L.at(L.L * pa); part.push([q[0], q[1]]); break; } acc += d; part.push(sq[i]); } P.strokePath(ctx, part, 4, '#e8f4ff'); if (pa >= 1) { ctx.globalAlpha = sm(T.planificacion, T.planificacion + 0.4, t); ctx.beginPath(); ctx.moveTo(300, 420); ctx.lineTo(780, 900); ctx.moveTo(780, 420); ctx.lineTo(300, 900); ctx.stroke(); } ctx.restore();
  const na = sm(T.improvisada, T.improvisada + 0.3, t); if (na > 0) { ctx.save(); ctx.globalAlpha = na; P.arrow(ctx, 900, 760, 900, 480, 1, C.oro, 20); P.text(ctx, 'N', 900, 440, 40, C.oro, { kind: 'title' }); ctx.restore(); tag(ctx, 'lados alineados con los puntos cardinales', 540, 960, 22, na); }
  ['PLANIFICACIÓN', 'CONOCIMIENTOS TÉCNICOS', 'TRABAJO COORDINADO'].forEach((s, i) => pill(ctx, s, 540, 1040 + i * 80, 34, t, [T.planificacion, T.conocimientos, T.coordinado - 0.3][i], [C.oro, C.agua, C.verde][i], C.tinta));
  // línea de tiempo: ≈ 20 años · la pirámide crece
  const ya = sm(T.anos20 - 0.3, T.anos20, t); if (ya > 0) { ctx.save(); ctx.globalAlpha = ya; const p = E.inOut(win(t, T.anos20, T.coordinado + 0.6)); ctx.fillStyle = 'rgba(232,244,255,0.25)'; ctx.fillRect(140, 1330, 800, 14); ctx.fillStyle = C.oro; ctx.fillRect(140, 1330, 800 * p, 14); P.text(ctx, '≈ 20 años de obra (estimación)', 540, 1380, 24, C.blanco); ctx.restore(); }
  pill(ctx, 'NO FUE IMPROVISADA', 540, 330, 44, t, T.no19 + 0.1, C.blanco, C.tinta);
 }, sfx(k) { FX.revelar(k, TB.plan + 0.1); k.play('stroke', T.no19, { material: 'chalk', dur: 1.6, gain: 0.3 }); FX.etiqueta(k, T.improvisada); FX.sello(k, T.planificacion); FX.etiqueta(k, T.conocimientos); FX.tictac(k, T.anos20, 4, 0.25); FX.sello(k, T.coordinado - 0.3); } });
 // 11 · todavía hay preguntas… pero algo está claro
 B.push({ t0: TB.dudas, t1: TB.final, in: { type: 'iris', d: 0.6, x: 540, y: 1000 }, draw(ctx, t) {
  P.desert(ctx, 1260, t, { sky: ['#e59a5a', '#f8d49a'], sunX: 220, sunY: 560 }); P.pyramid(ctx, 560, 1260, 860, 560, { courses: 30 });
  const qa = sm(T.preguntas - 0.2, T.preguntas + 0.3, t) * (1 - sm(T.algo22, T.claro, t)); if (qa > 0) { ctx.save(); ctx.globalAlpha = qa; [[250, 820, 100], [460, 640, 80], [720, 760, 110], [880, 980, 80], [380, 1050, 70]].forEach(([x, y, s], i) => P.qmark(ctx, x, y, s, t + i)); ctx.restore(); }
  pill(ctx, 'AÚN HAY PREGUNTAS', 540, 330, 44, t, T.preguntas, C.blanco, C.tinta, T.algo22);
  pill(ctx, 'ALGO ESTÁ CLARO', 540, 330, 50, t, T.algo22, C.oro, C.tinta);
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.dudas, TB.final - TB.dudas, 0.8); for (let i = 0; i < 5; i++) k.play('pop', T.preguntas + i * 0.15, { f: 500 + i * 80, gain: 0.25, minor: true }); FX.sello(k, T.algo22 + 0.1); } });
 // 12 · una de las mayores hazañas de ingeniería (así lucía con su revestimiento blanco) + 13 · Asombroteca
 const finale = (ctx, t) => { const cam = P.camAt([[TB.final, 540, 1050, 1.3], [T.mayores, 540, 960, 1.06], [DURATION, 540, 960, 1.0]], t); ctx.save(); P.camApply(ctx, cam); P.desert(ctx, 1260, t, { sky: ['#e8935a', '#fbd7a0'], sunX: 200, sunY: 640 }); P.pyramid(ctx, 300, 1200, 300, 190, { courses: 10, joints: 0.4, casing: 0.5 * sm(T.mayores, T.hazanas, t) }); P.pyramid(ctx, 590, 1260, 860, 560, { courses: 30, casing: sm(T.mayores - 0.3, T.hazanas + 0.2, t) }); P.palm(ctx, 1000, 1290, 240, t); ctx.restore(); };
 B.push({ t0: TB.final, t1: TB.cierre, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  finale(ctx, t);
  pill(ctx, 'SIN TECNOLOGÍA MODERNA', 540, 330, 42, t, T.tecnologia, C.blanco, C.tinta, T.mayores);
  pill(ctx, 'UNA DE LAS MAYORES HAZAÑAS', 540, 330, 40, t, T.mayores, C.oro, C.tinta);
  pill(ctx, 'DE LA INGENIERÍA', 540, 420, 40, t, T.ingenieria, C.oro, C.tinta);
  tag(ctx, 'así lucía: revestida de caliza blanca y pulida', 540, 510, 22, sm(T.hazanas, T.hazanas + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.final, TB.cierre - TB.final, 0.6); FX.revelar(k, T.tecnologia); k.play('sparkle', T.mayores, { gain: 0.4, n: 8 }); FX.sello(k, T.mayores + 0.05); k.play('riser', T.hazanas - 0.5, { dur: 1.2, gain: 0.3 }); FX.etiqueta(k, T.ingenieria); } });
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'cut' }, draw(ctx, t) {
  finale(ctx, t);
  P.withPop(ctx, t, T.sigue + 0.1, 540, 420, () => { P.rr(ctx, 210, 355, 660, 130, 32, 'rgba(42,26,14,0.78)'); P.text(ctx, 'ASOMBROTECA', 540, 421, 68, C.blanco, { kind: 'title' }); });
  const press = win(t, T.asombroteca + 1.0, T.asombroteca + 1.2), done = t > T.asombroteca + 1.15;
  P.withPop(ctx, t, T.asombroteca + 0.2, 540, 565, () => { P.rr(ctx, 380, 520, 320, 86, 43, done ? '#2fbf71' : C.oro, { sy: 8 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 565, 36, C.tinta); });
  if (t > T.asombroteca + 0.4) P.finger(ctx, 600, lerp(900, 585, E.out(win(t, T.asombroteca + 0.4, T.asombroteca + 1.0))), 90, press * (1 - win(t, T.asombroteca + 1.3, T.asombroteca + 1.6)));
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.cierre, DURATION - TB.cierre, 0.6); FX.sello(k, T.sigue + 0.1); FX.aparece(k, T.asombroteca + 0.2, 700); FX.clic(k, T.asombroteca + 1.15); k.play('ding', T.asombroteca + 1.2, { f: 'A5', gain: 0.3 }); FX.fin(k, T.asombroteca + 1.5); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['4.500', '150', 'grúas', 'motores', 'hazaña', 'Giza', 'toneladas', 'transportarlos', 'trineos', 'cuerdas', 'humedecer', 'arena', 'agua', 'subían', 'rampas', 'arqueólogos', 'debaten', 'cobre', 'medición', 'organización', 'planificación', 'coordinado', 'claro', 'ingeniería', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 600, q: 0.8, gain: 0.025, a: 1.5, hold: DURATION - 3 }); },
  music(k) {
   // modo frigio dominante (sabor «antiguo»), sin clichés exagerados
   const M = [['D3', 'A3', 'D4', 'F#4'], ['Eb3', 'Bb3', 'Eb4', 'G4'], ['D3', 'A3', 'D4', 'F#4'], ['C3', 'G3', 'C4', 'Eb4']];
   k.music('pad', 0, T.los7, { bpm: 80, gain: 0.42, chords: M });
   k.music('pulse', T.los7, T.sin14, { bpm: 96, gain: 0.24, chords: M });
   k.music('pad', T.sin14, T.no19, { bpm: 84, gain: 0.36, chords: [['G2', 'D3', 'G3', 'Bb3'], ['Ab2', 'Eb3', 'Ab3', 'C4'], ['G2', 'D3', 'G3', 'B3']] });
   k.music('pulse', T.no19, T.y21, { bpm: 104, gain: 0.25, chords: M });
   k.music('pad', T.y21, DURATION, { bpm: 80, gain: 0.42, chords: [['D3', 'A3', 'D4', 'F#4'], ['G2', 'D3', 'B3', 'D4'], ['A2', 'E3', 'C#4', 'E4'], ['D3', 'A3', 'D4', 'F#4']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
