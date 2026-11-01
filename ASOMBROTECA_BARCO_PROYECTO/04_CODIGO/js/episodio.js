// =====================================================================================================
// episodio.js — «¿Por qué un barco de acero de miles de toneladas no se hunde?» · Asombroteca · PLANTILLA v1.9
// Arco: bloque de acero que cae y se hunde → bajo el agua aparece un casco gigante → portacontenedores → presión
// sobre el casco (fuerza invisible) → agua desplazada → empuje → Arquímedes → macizo vs hueco (el mismo acero
// convertido en casco) → corte longitudinal (gran volumen interior) → densidad promedio → el casco baja y desplaza
// más → más empuje → EMPUJE = PESO (equilibrio) → más carga con grúa (más calado, marca Plimsoll) → vía de agua y
// compartimentos estancos → el barco navegando: no es el acero, es su forma → «Sigue a Asombroteca».
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
 const C = { fondo: '#071522', profundo: '#031827', sub: '#063A5B', sup: '#1378A8', cian: '#39D9FF', aceroO: '#3D5669', aceroL: '#A9C2D1', rojo: '#B7473C', empuje: '#37E6C0', peso: '#FF7D65', oro: '#FFD447', blanco: '#F4FAFF' };
 const T = {
  lanzas: wt(0, 'lanzas'), bloque0: wt(0, 'bloque'), acero0: wt(0, 'acero'), agua0: wt(0, 'agua'), hunde0: wt(0, 'hunde'), inmediatamente: wt(0, 'inmediatamente'),
  entonces: SG(1).s, como2: SG(2).s, barco2: wt(2, 'barco'), gigantesco2: wt(2, 'gigantesco'), miles: wt(2, 'miles'), toneladas: wt(2, 'toneladas'), flotar: wt(2, 'flotar'),
  la3: SG(3).s, fuerza3: wt(3, 'fuerza'), invisible: wt(3, 'invisible'),
  cuando4: SG(4).s, entra4: wt(4, 'entra'), desplaza4: wt(4, 'desplaza'), parte: wt(4, 'parte'), ella: wt(4, 'ella'),
  y5: SG(5).s, ejerce: wt(5, 'ejerce'), arriba5: wt(5, 'arriba'), conocida: wt(5, 'conocida'), empuje5: wt(5, 'empuje'),
  este6: SG(6).s, explicado: wt(6, 'explicado'), dosmil: wt(6, '2.000'), cientifico: wt(6, 'científico'), arquimedes: wt(6, 'arquímedes'),
  pero7: SG(7).s, sorprendente: wt(7, 'sorprendente'), bloque8: wt(8, 'bloque'), macizo8: wt(8, 'macizo'), denso: wt(8, 'denso'), por9: SG(9).s, hunde9: wt(9, 'hunde'),
  sin10: SG(10).s, barco10: wt(10, 'barco'), macizo10: wt(10, 'macizo'),
  su11: SG(11).s, casco: wt(11, 'casco'), enorme: wt(11, 'enorme'), interior11: wt(11, 'interior'), aire: wt(11, 'aire'),
  esto12: SG(12).s, densidad: wt(12, 'densidad'), promedio: wt(12, 'promedio'), espacios: wt(12, 'espacios'), menor: wt(13, 'menor'), agua13: wt(13, 'agua'),
  a14: SG(14).s, hunde14: wt(14, 'hunde'), desplaza14: wt(14, 'desplaza'), volumen: wt(14, 'volumen'), mayor14: wt(14, 'mayor'),
  y15: SG(15).s, desplaza15: wt(15, 'desplaza'), mayor15: wt(15, 'mayor'), empuje15: wt(15, 'empuje'),
  hasta16: SG(16).s, increible: wt(16, 'increíble'), el17: SG(17).s, empuje17: wt(17, 'empuje'), iguala: wt(17, 'iguala'), peso17: wt(17, 'peso'), abajo: wt(17, 'abajo'),
  en18: SG(18).s, flota18: wt(18, 'flota'), equilibrio: wt(18, 'equilibrio'),
  y19: SG(19).s, carga: wt(19, 'carga'), hunde19: wt(19, 'hunde'), desplazar19: wt(19, 'desplazar'), peso19: wt(19, 'peso'), adicional: wt(19, 'adicional'),
  pero20: SG(20).s, entra20: wt(20, 'entra'), interior20: wt(20, 'interior'), perder: wt(20, 'perder'), flotabilidad: wt(20, 'flotabilidad'), hundiendose: wt(20, 'hundiéndose'),
  asi21: SG(21).s, barco21: wt(21, 'barco'), navegando: wt(21, 'navegando'), recuerda: wt(21, 'recuerda'),
  no22: SG(22).s, acero22: wt(22, 'acero'), ligero: wt(22, 'ligero'), sino: SG(23).s, forma: wt(23, 'forma'), desplazar23: wt(23, 'desplazar'), agua23: wt(23, 'agua'), sostener: wt(23, 'sostener'), peso23: wt(23, 'peso'),
  sigue: SG(24).s, asombroteca: wt(24, 'asombroteca'), end: A.speech_end,
 };
 const TB = { barco: T.entonces - 0.1, presion: T.la3 - 0.2, desplazada: T.cuando4 - 0.2, empuje: T.y5 - 0.2, arq: T.este6 - 0.2, macizo: T.pero7 - 0.2, interior: T.su11 - 0.2, densidad: T.esto12 - 0.2, baja: T.a14 - 0.2, carga: T.y19 - 0.2, inunda: T.pero20 - 0.2, final: T.asi21 - 0.2 };

 // ---------------- utilidades ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, px, a, c = 'rgba(244,250,255,0.98)') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `600 ${px}px "IBM Plex Mono"`; const w = ctx.measureText(s).width + px * 1.2; P.rr(ctx, x - w / 2, y - px * 0.85, w, px * 1.7, px * 0.85, 'rgba(7,21,34,0.72)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, x, y + 1); ctx.restore(); };
 const card = (ctx, x, y, w, h, a, fn) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, x, y, w, h, 28, 'rgba(244,250,255,0.96)', { sy: 10 }); fn(); ctx.restore(); };
 const steelBlock = (ctx, x, y, s) => { const g = ctx.createLinearGradient(x - s / 2, y - s / 2, x + s / 2, y + s / 2); g.addColorStop(0, '#c9d8e2'); g.addColorStop(0.5, '#7f98aa'); g.addColorStop(1, '#3D5669'); ctx.fillStyle = g; ctx.fillRect(x - s / 2, y - s / 2, s, s); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2; ctx.strokeRect(x - s / 2 + 1, y - s / 2 + 1, s - 2, s - 2); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(x - s / 2 + 6, y - s / 2 + 6, s * 0.18, s - 12); };

 // ================= MUNDO DE PERFIL (gancho y regreso) =================
 const SURF = 900, SHIP_L = 1400, DRAFT = 95;
 const blockY = (t) => { const t0 = T.bloque0, ti = T.hunde0, y0 = 260, yi = SURF; if (t <= t0) return y0; if (t <= ti) { const u = (t - t0) / (ti - t0); return lerp(y0, yi, u * u); } return yi + 240 * (t - ti) - 40 * Math.exp(-(t - ti) * 3) + 40; };
 function world(ctx, t, st) {
  P.seaProfile(ctx, SURF, t, { x0: -900, x1: 2000, bottom: 4200, depth: 0.7, sun: st.sun || [880, 360], sky: st.sky });
  if ((st.ship ?? 0) > 0) { ctx.save(); ctx.globalAlpha *= st.ship; const g = P.cargoShip(ctx, st.shipX ?? 540, SURF, SHIP_L, DRAFT, t, { H: 150, rows: 5, cut: st.cut || 0, disp: st.disp || 0, seed: 11 }); ctx.restore(); st.geo = g; }
  if (st.block) { const by = blockY(t); steelBlock(ctx, 540, by, 110); if (t > T.hunde0) P.bubbles(ctx, 470, by - 160, 140, 220, t, 3, 14, 0.9); }
  P.underwater(ctx, SURF, t, { x0: -900, x1: 2000, bottom: 4200, a0: 0.18, a1: 0.75 });
  if (st.block) P.splash(ctx, 540, SURF, t, T.hunde0, { s: 120 });
 }

 // ================= SECCIÓN TRANSVERSAL (física) =================
 const WL = 960, HW = 560, HHt = 420, SEQ = 210, LW = 300; // equilibrio: SEQ px sumergidos; flecha de peso LW px
 const outline = (cx, wl, sink) => { const bottom = wl + sink, w = HW, r = w * 0.16, x0 = cx - w / 2, x1 = cx + w / 2, pts = []; pts.push([x1, wl]); pts.push([x1, bottom - r]); for (let k = 1; k <= 6; k++) { const a = k / 6 * Math.PI / 2; pts.push([x1 - r + Math.cos(a) * r, bottom - r + Math.sin(a) * r]); } pts.push([x0 + r, bottom]); for (let k = 1; k <= 6; k++) { const a = Math.PI / 2 + k / 6 * Math.PI / 2; pts.push([x0 + r + Math.cos(a) * r, bottom - r + Math.sin(a) * r]); } pts.push([x0, wl]); return pts; };
 function section(ctx, t, st) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH);
  const sky = ctx.createLinearGradient(0, 0, 0, WL); sky.addColorStop(0, '#0b2a44'); sky.addColorStop(1, '#4a8ab0'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, WL);
  P.ocean(ctx, t, 0.55, { y: WL, h: HH - WL, snow: 50 });
  const sink = st.sink, g = P.hullSection(ctx, 540, WL, HW, HHt, sink, t, { disp: st.disp || 0, sep: st.sep || 0, cargo: 3, flood: st.flood || 0 });
  P.underwater(ctx, WL, t, { x0: 0, x1: W, bottom: HH, a0: 0.16, a1: 0.5 });
  if ((st.press || 0) > 0) P.pressureArrows(ctx, outline(540, WL, sink), WL, t, { a: st.press, k: 0.22, step: 44 });
  
  const cob = [540, WL + Math.min(sink, HHt) / 2], cg = [540, g.bottom - HHt * 0.42];
  if ((st.buoy || 0) > 0) { P.glow(ctx, cob[0], cob[1], 60, '55,230,192', 0.6 * st.buoy); P.forceArrow(ctx, cob[0] - 40, cob[1], st.buoy, 1, C.empuje, st.buoyLabel ?? 'EMPUJE', { w: 30, align: 'right', px: 32 }); }
  if ((st.weight || 0) > 0) P.forceArrow(ctx, cg[0] + 40, cg[1], st.weight, -1, C.peso, 'PESO', { w: 30, px: 32 });
  return g;
 }
 // calado del barco en la escena «se hunde un poco y desplaza más»: sale alto y se asienta en SEQ (amortiguado)
 const sinkAt = (t) => { if (t < TB.baja) return SEQ; const u = t - TB.baja - 0.2; if (u < 0) return 60; return SEQ - (SEQ - 60) * Math.exp(-0.36 * u); };

 // ================= BEATS =================
 const B = [];
 // 1 · gancho: el bloque de acero cae y se hunde
 B.push({ t0: 0, t1: TB.barco, draw(ctx, t) {
  const by = blockY(t), cy = t < T.hunde0 ? lerp(760, 820, win(t, 0, T.hunde0)) : Math.max(820, by - 260);
  const z = t < T.hunde0 ? lerp(1.35, 1.15, win(t, 0, T.hunde0)) : 1.05;
  ctx.save(); P.camApply(ctx, [540, cy, z]); world(ctx, t, { block: true, ship: 0 }); ctx.restore();
  pill(ctx, '¡EL ACERO SE HUNDE!', 540, 330, 50, t, T.hunde0, C.peso, C.blanco);
  tag(ctx, 'bloque macizo de acero', 540, 420, 24, sm(T.bloque0, T.bloque0 + 0.3, t) * (1 - sm(T.hunde0, T.hunde0 + 0.4, t)));
 }, sfx(k) { k.play('whoosh', T.bloque0, { dur: 1.4, top: 900, gain: 0.35 }); FX.chapuzon(k, T.hunde0, 1.2); FX.hundirse(k, T.hunde0 + 0.5, TB.barco - T.hunde0 + 1.5, 1); k.play('thud', T.inmediatamente, { f: 50, gain: 0.3 }); } });
 // 2 · la gran contradicción: sobre nosotros, un casco gigantesco → portacontenedores
 B.push({ t0: TB.barco, t1: TB.presion, in: { type: 'cut' }, draw(ctx, t) {
  const cam = P.camAt([[TB.barco, 540, blockY(TB.barco) - 260, 1.05], [T.como2 + 0.3, 540, 1450, 1.0], [T.barco2 + 0.2, 540, 1150, 0.85], [T.miles, 540, 820, 0.72], [TB.presion, 640, 830, 0.72]], t);
  ctx.save(); P.camApply(ctx, cam); world(ctx, t, { block: true, ship: sm(T.entonces, T.como2 + 0.4, t), shipX: 540 + (t - TB.barco) * 6 }); ctx.restore();
  pill(ctx, 'MILES DE TONELADAS DE ACERO', 540, 330, 38, t, T.miles, C.blanco, C.fondo, T.flotar);
  pill(ctx, '¿POR QUÉ ESTE NO SE HUNDE?', 540, 330, 42, t, T.flotar - 0.1, C.oro, C.fondo);
  tag(ctx, 'los mayores portacontenedores: ≈ 400 m de eslora', 540, 420, 22, sm(T.gigantesco2, T.gigantesco2 + 0.4, t) * (1 - sm(T.flotar, T.flotar + 0.3, t)));
 }, sfx(k) { FX.hundirse(k, TB.barco, 2.5, 0.8); FX.casco(k, T.como2, 1, 60); k.play('riser', T.barco2 - 0.4, { dur: 1.6, gain: 0.35 }); FX.olas(k, T.barco2 + 0.5, TB.presion - T.barco2, 1); FX.bocina(k, T.gigantesco2 + 0.4, 1.8, 0.9); FX.onomatopeya(k, T.flotar - 0.1); } });
 // 3 · una fuerza invisible: la presión del agua sobre el casco (aumenta con la profundidad)
 B.push({ t0: TB.presion, t1: TB.desplazada, in: { type: 'zoom', d: 0.6, x: 540, y: 1000 }, draw(ctx, t) {
  section(ctx, t, { sink: SEQ, press: sm(T.fuerza3 - 0.3, T.fuerza3 + 0.2, t), buoy: LW * E.out(win(t, T.invisible, T.invisible + 0.6)), buoyLabel: '' });
  pill(ctx, 'UNA FUERZA INVISIBLE', 540, 330, 46, t, T.la3, C.cian, C.fondo, T.invisible + 0.2);
  pill(ctx, 'UNA FUERZA HACIA ARRIBA', 540, 330, 44, t, T.invisible + 0.2, C.empuje, C.fondo);
  tag(ctx, 'más profundidad → más presión · las de los lados se compensan', 540, 1400, 21, sm(T.fuerza3, T.fuerza3 + 0.4, t));
  tag(ctx, 'CORTE TRANSVERSAL DEL CASCO', 540, 420, 22, 0.85);
 }, sfx(k) { FX.bajoAgua(k, TB.presion, TB.desplazada - TB.presion, 0.8); FX.revelar(k, TB.presion + 0.1); FX.campo(k, T.fuerza3 - 0.2, 1.2, 0.8); k.play('riser', T.invisible - 0.2, { dur: 0.8, gain: 0.3 }); FX.sello(k, T.invisible + 0.3); } });
 // 4 · el agua desplazada: el volumen sumergido ocupa el lugar del agua
 B.push({ t0: TB.desplazada, t1: TB.empuje, in: { type: 'cut' }, draw(ctx, t) {
  const sep = sm(T.parte - 0.2, T.parte + 0.5, t) * (1 - sm(T.ella + 0.4, TB.empuje, t));
  section(ctx, t, { sink: SEQ, disp: sm(T.desplaza4 - 0.3, T.desplaza4, t), sep });
  pill(ctx, 'AGUA DESPLAZADA', 540, 330, 50, t, T.desplaza4, C.cian, C.fondo);
  tag(ctx, 'el casco ocupa el lugar donde antes había agua', 540, 420, 22, sm(T.parte, T.parte + 0.4, t));
  tag(ctx, 'volumen desplazado = volumen de la parte sumergida', 540, 1400, 21, sm(T.ella, T.ella + 0.3, t));
 }, sfx(k) { FX.bajoAgua(k, TB.desplazada, TB.empuje - TB.desplazada, 0.7); FX.aparece(k, T.desplaza4, 520); k.play('whoosh', T.parte - 0.1, { dur: 0.7, top: 1400, gain: 0.3 }); k.play('whoosh', T.ella + 0.4, { dur: 0.6, top: 1000, gain: 0.25, minor: true }); } });
 // 5 · el empuje: igual al peso del agua desplazada
 B.push({ t0: TB.empuje, t1: TB.arq, in: { type: 'cut' }, draw(ctx, t) {
  section(ctx, t, { sink: SEQ, disp: 1, buoy: LW * E.out(win(t, T.arriba5 - 0.3, T.arriba5 + 0.6)) });
  pill(ctx, 'EMPUJE', 540, 330, 56, t, T.empuje5, C.empuje, C.fondo);
  card(ctx, 140, 400, 800, 120, sm(T.empuje5 + 0.2, T.empuje5 + 0.5, t), () => { P.text(ctx, 'EMPUJE = PESO DEL AGUA DESPLAZADA', 540, 460, 32, C.fondo, { kind: 'title' }); });
  tag(ctx, 'el agua ejerce la fuerza hacia arriba', 540, 1400, 22, sm(T.ejerce, T.ejerce + 0.4, t) * (1 - sm(T.empuje5, T.empuje5 + 0.3, t)));
 }, sfx(k) { FX.bajoAgua(k, TB.empuje, TB.arq - TB.empuje, 0.7); k.play('riser', T.arriba5 - 0.3, { dur: 0.9, gain: 0.35 }); FX.sello(k, T.empuje5); FX.etiqueta(k, T.empuje5 + 0.3); } });
 // 6 · Arquímedes (referencia breve, sin dramatizar la bañera)
 B.push({ t0: TB.arq, t1: TB.macizo, in: { type: 'iris', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#2a2016'); g.addColorStop(1, '#120c07'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 600, 900, 600, '255,210,150', 0.2);
  for (const x of [120, 960]) P.column(ctx, x, 1300, 760, 70); ctx.fillStyle = '#3b2c1c'; ctx.fillRect(0, 1300, W, 620);
  P.greek(ctx, 330, 1300, 380, { point: sm(T.cientifico, T.cientifico + 0.4, t) });
  const d = E.inOut(win(t, T.explicado, T.dosmil + 0.4)); const lvl = 0.55 + 0.1 * d; P.beaker(ctx, 560, 900, 260, 360, lvl, t, { spout: true, overflow: d > 0.6 && d < 1 ? 1 : 0, obj: (wl) => { const oy = lerp(830, 1120, d); ctx.fillStyle = '#9a8f80'; ctx.beginPath(); ctx.ellipse(690, oy, 70, 55, 0, 0, TAU); ctx.fill(); } });
  P.beaker(ctx, 880, 1150, 120, 150, 0.1 + 0.5 * sm(0.6, 1, d), t, {});
  P.counter(ctx, 540, 480, 80, t, T.dosmil - 0.2, T.dosmil + 0.4, 0, 2000, { box: C.oro, c: C.fondo, prefix: '+ ', suffix: ' años', fmt: (v) => v.toLocaleString('es-CO') });
  pill(ctx, 'PRINCIPIO DE ARQUÍMEDES', 540, 330, 44, t, T.arquimedes, C.oro, C.fondo);
  tag(ctx, 'Arquímedes de Siracusa (s. III a. C.) · «Sobre los cuerpos flotantes»', 540, 1400, 20, sm(T.arquimedes, T.arquimedes + 0.4, t));
  tag(ctx, 'ilustración conceptual', 540, 600, 20, sm(TB.arq + 0.3, TB.arq + 0.8, t) * 0.8);
 }, sfx(k) { FX.revelar(k, TB.arq + 0.1); FX.chapuzon(k, T.explicado + 0.4, 0.5); FX.contador(k, T.dosmil - 0.2, T.dosmil + 0.4, 0, 20); FX.goteo(k, T.dosmil + 0.3, 5, 0.18); FX.sello(k, T.arquimedes); } });
 // 7 · macizo frente a hueco: el mismo acero, otra forma
 B.push({ t0: TB.macizo, t1: TB.interior, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const wl = 980; ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); const sk = ctx.createLinearGradient(0, 0, 0, wl); sk.addColorStop(0, '#0b2a44'); sk.addColorStop(1, '#3d7aa0'); ctx.fillStyle = sk; ctx.fillRect(0, 0, W, wl); P.ocean(ctx, t, 0.6, { y: wl, h: HH - wl, snow: 40 });
  // izquierda: bloque macizo (cae al decir «por eso se hunde»)
  const lb = t < T.por9 ? 720 : Math.min(1360, 720 + (wl - 720) * Math.min(1, Math.pow((t - T.por9) / 0.5, 2)) + Math.max(0, t - T.por9 - 0.5) * 300);
  steelBlock(ctx, 290, lb, 130); if (t > T.por9 + 0.5) P.bubbles(ctx, 230, lb - 150, 120, 160, t, 7, 10, 0.8);
  // derecha: el mismo acero se transforma en un casco hueco que flota
  const m = E.inOut(win(t, T.barco10 - 0.3, T.macizo10 + 0.2));
  if (m <= 0) steelBlock(ctx, 790, 720, 130);
  else { const w = lerp(130, 300, m), h = lerp(130, 170, m), cy = lerp(720, wl - h / 2 + 50, sm(0.6, 1, m)); const th = lerp(65, 12, m); ctx.save(); const g2 = ctx.createLinearGradient(790 - w / 2, 0, 790 + w / 2, 0); g2.addColorStop(0, '#9fb6c6'); g2.addColorStop(1, '#3D5669'); ctx.fillStyle = g2; ctx.beginPath(); ctx.moveTo(790 - w / 2, cy - h / 2); ctx.lineTo(790 - w / 2, cy + h / 2); ctx.lineTo(790 + w / 2, cy + h / 2); ctx.lineTo(790 + w / 2, cy - h / 2); ctx.lineTo(790 + w / 2 - th, cy - h / 2); ctx.lineTo(790 + w / 2 - th, cy + h / 2 - th); ctx.lineTo(790 - w / 2 + th, cy + h / 2 - th); ctx.lineTo(790 - w / 2 + th, cy - h / 2); ctx.closePath(); ctx.fill(); ctx.fillStyle = `rgba(244,250,255,${0.18 * m})`; ctx.fillRect(790 - w / 2 + th, cy - h / 2, w - 2 * th, h - th); ctx.restore(); }
  P.underwater(ctx, wl, t, { x0: 0, x1: W, bottom: HH, a0: 0.15, a1: 0.5 });
  pill(ctx, 'MACIZO', 290, 560, 36, t, T.macizo8, C.peso, C.blanco);
  pill(ctx, m > 0.3 ? 'HUECO' : 'MACIZO', 790, 560, 36, t, m > 0.3 ? T.barco10 + 0.2 : T.macizo8, m > 0.3 ? C.empuje : C.peso, m > 0.3 ? C.fondo : C.blanco);
  pill(ctx, 'LO SORPRENDENTE', 540, 330, 42, t, T.pero7 + 0.1, C.blanco, C.fondo, T.macizo10);
  pill(ctx, 'MACIZO ≠ HUECO', 540, 330, 50, t, T.macizo10, C.oro, C.fondo);
  tag(ctx, 'el acero es ≈ 7,85 veces más denso que el agua dulce', 540, 420, 22, sm(T.denso, T.denso + 0.4, t) * (1 - sm(T.macizo10, T.macizo10 + 0.3, t)));
  tag(ctx, 'misma cantidad de acero, otra forma', 790, 1400, 22, sm(T.macizo10, T.macizo10 + 0.4, t));
 }, sfx(k) { FX.revelar(k, TB.macizo + 0.1); k.play('sparkle', T.sorprendente, { gain: 0.3, n: 5 }); FX.etiqueta(k, T.macizo8); FX.chapuzon(k, T.por9 + 0.5, 0.8); FX.hundirse(k, T.por9 + 0.7, 2, 0.8); k.play('stamp', T.barco10, { gain: 0.3 }); FX.casco(k, T.barco10, 0.8, 90); FX.olas(k, T.macizo10 - 0.2, 1.5, 0.7); FX.sello(k, T.macizo10); } });
 // 8 · el interior: un enorme espacio con aire (corte longitudinal)
 B.push({ t0: TB.interior, t1: TB.densidad, in: { type: 'zoom', d: 0.6, x: 790, y: 980 }, draw(ctx, t) {
  const cut = E.inOut(win(t, T.casco - 0.1, T.enorme + 0.3));
  ctx.save(); P.camApply(ctx, [540, 960, 1]); P.seaProfile(ctx, 980, t, { x0: -100, x1: 1200, bottom: HH + 100, depth: 0.5 }); const g = P.cargoShip(ctx, 540, 980, 1000, 150, t, { H: 230, rows: 3, cut, comps: 7, seed: 4 }); P.underwater(ctx, 980, t, { x0: -100, x1: 1200, bottom: HH + 100 }); ctx.restore();
  const la = sm(T.interior11, T.interior11 + 0.3, t); if (la > 0) { const [a, b] = g.comps[3]; tag(ctx, 'AIRE', (a + b) / 2, g.keel - 115, 26, la, C.blanco); tag(ctx, 'MAMPAROS', g.comps[1][0], g.deck - 300, 22, la); ctx.save(); ctx.globalAlpha = la; ctx.strokeStyle = C.blanco; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(g.comps[1][0], g.deck - 285); ctx.lineTo(g.comps[1][0], g.deck + 20); ctx.stroke(); ctx.restore(); }
  pill(ctx, 'UN ENORME VOLUMEN INTERIOR', 540, 330, 40, t, T.enorme, C.cian, C.fondo);
  tag(ctx, 'el aire no empuja como un globo: da mucho volumen con poca masa', 540, 1420, 20, sm(T.aire, T.aire + 0.4, t));
 }, sfx(k) { FX.olas(k, TB.interior, TB.densidad - TB.interior, 0.7); k.play('whoosh', T.casco, { dur: 1.0, top: 2000, gain: 0.35 }); FX.revelar(k, T.enorme - 0.1); FX.etiqueta(k, T.interior11); FX.casco(k, T.aire, 0.6, 80); } });
 // 9 · densidad promedio: masa total ÷ volumen total (acero + espacios) < agua
 B.push({ t0: TB.densidad, t1: TB.baja, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); P.glow(ctx, 540, 800, 700, '57,217,255', 0.08);
  pill(ctx, 'DENSIDAD PROMEDIO', 540, 330, 46, t, T.densidad, C.blanco, C.fondo, T.menor);
  pill(ctx, 'MENOR DENSIDAD PROMEDIO', 540, 330, 42, t, T.menor, C.empuje, C.fondo);
  const bars = [['ACERO', 7.85, C.peso, T.densidad, '≈ 7,85'], ['AGUA', 1, C.cian, T.promedio, '1'], ['BARCO (promedio)', 0.55, C.empuje, T.espacios, 'menos de 1']];
  bars.forEach(([s, v, c, t0, val], i) => { const y = 520 + i * 160, a = sm(t0 - 0.2, t0 + 0.2, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; P.text(ctx, s, 110, y - 34, 30, C.blanco, { align: 'left', kind: 'title' }); const len = 820 * Math.min(1, v / 7.85) * E.out(win(t, t0, t0 + 0.6)) + (v < 1.5 ? 820 * v / 7.85 * 0 : 0); ctx.fillStyle = 'rgba(244,250,255,0.1)'; ctx.fillRect(110, y, 860, 46); ctx.fillStyle = c; ctx.fillRect(110, y, Math.max(8, len), 46); P.text(ctx, val, 130 + Math.max(8, len) + 10, y + 24, 26, C.blanco, { align: 'left' }); ctx.restore(); });
  const wa = sm(T.promedio + 0.3, T.promedio + 0.7, t); if (wa > 0) { const x = 110 + 820 / 7.85; ctx.save(); ctx.globalAlpha = wa; ctx.setLineDash([10, 8]); ctx.strokeStyle = C.cian; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 470); ctx.lineTo(x, 1000); ctx.stroke(); ctx.restore(); tag(ctx, 'agua', x, 1020, 20, wa); }
  card(ctx, 110, 1090, 860, 230, sm(T.espacios, T.espacios + 0.4, t), () => { P.text(ctx, 'densidad promedio =', 540, 1145, 30, '#3a5368'); P.text(ctx, 'MASA TOTAL ÷ VOLUMEN TOTAL', 540, 1205, 38, C.fondo, { kind: 'title' }); P.text(ctx, '(acero + carga + espacios interiores)', 540, 1265, 26, '#3a5368'); });
  tag(ctx, 'el acero no cambia: cambia el volumen que ocupa el barco', 540, 1400, 20, sm(T.agua13, T.agua13 + 0.4, t));
 }, sfx(k) { FX.revelar(k, TB.densidad + 0.1); FX.aparece(k, T.densidad, 500); FX.aparece(k, T.promedio, 640); FX.aparece(k, T.espacios, 780); FX.etiqueta(k, T.espacios + 0.2); FX.correcto(k, T.menor + 0.1); } });
 // 10–12 · el casco baja, desplaza más, el empuje crece… hasta igualar el peso (equilibrio)
 const eqState = (t) => { const s = sinkAt(t), bob = t > T.iguala ? Math.sin((t - T.iguala) * 1.6) * 3 * Math.exp(-(t - T.iguala) * 0.4) : 0; return { sink: s + bob, disp: 1, buoy: LW * (s + bob) / SEQ }; };
 B.push({ t0: TB.baja, t1: T.y15 - 0.2, in: { type: 'iris', d: 0.6, x: 540, y: 960 }, draw(ctx, t) {
  const st = eqState(t); section(ctx, t, { sink: st.sink, disp: 1, buoy: st.buoy * sm(T.desplaza14, T.desplaza14 + 0.4, t) });
  pill(ctx, 'MÁS VOLUMEN SUMERGIDO', 540, 330, 42, t, T.volumen, C.cian, C.fondo);
  tag(ctx, 'el casco se asienta: cada vez más agua desplazada', 540, 420, 22, sm(T.hunde14, T.hunde14 + 0.4, t));
 }, sfx(k) { FX.chapuzon(k, TB.baja + 0.3, 0.6); FX.bajoAgua(k, TB.baja, T.y15 - TB.baja, 0.7); FX.casco(k, T.hunde14, 0.6, 70); FX.etiqueta(k, T.volumen); } });
 B.push({ t0: T.y15 - 0.2, t1: T.hasta16 - 0.2, in: { type: 'cut' }, draw(ctx, t) {
  const st = eqState(t); section(ctx, t, { sink: st.sink, disp: 1, buoy: st.buoy });
  pill(ctx, 'MÁS AGUA = MÁS EMPUJE', 540, 330, 44, t, T.mayor15, C.empuje, C.fondo);
  tag(ctx, 'mientras el agua no entre en el casco', 540, 1400, 21, sm(T.empuje15, T.empuje15 + 0.4, t));
 }, sfx(k) { FX.bajoAgua(k, T.y15, T.hasta16 - T.y15, 0.6); k.play('riser', T.desplaza15, { dur: 1.5, gain: 0.3 }); FX.etiqueta(k, T.mayor15); } });
 B.push({ t0: T.hasta16 - 0.2, t1: TB.carga, in: { type: 'cut' }, draw(ctx, t) {
  const st = eqState(t), wv = LW * E.out(win(t, T.empuje17, T.iguala));
  section(ctx, t, { sink: st.sink, disp: 1, buoy: st.buoy, weight: wv });
  pill(ctx, 'ALGO INCREÍBLE', 540, 330, 44, t, T.increible - 0.1, C.blanco, C.fondo, T.iguala);
  pill(ctx, 'EMPUJE = PESO', 540, 330, 56, t, T.iguala, C.oro, C.fondo, T.flota18);
  pill(ctx, 'FLOTA EN EQUILIBRIO', 540, 330, 48, t, T.flota18, C.empuje, C.fondo);
  tag(ctx, 'suma de fuerzas verticales = 0', 540, 420, 24, sm(T.abajo, T.abajo + 0.4, t));
  tag(ctx, 'no volcar depende además del reparto de pesos y de la forma', 540, 1400, 20, sm(T.equilibrio, T.equilibrio + 0.4, t));
 }, sfx(k) { FX.bajoAgua(k, T.hasta16, TB.carga - T.hasta16, 0.6); k.play('sparkle', T.increible, { gain: 0.35, n: 6 }); k.play('riser', T.empuje17, { dur: T.iguala - T.empuje17, gain: 0.3 }); FX.sello(k, T.iguala); FX.equilibrio(k, T.iguala + 0.2); FX.correcto(k, T.equilibrio); } });
 // 13 · más carga: la grúa añade contenedores, el barco se hunde un poco más (marca Plimsoll)
 const LIFTS = [0, 1, 2, 3].map((i) => ({ t0: T.y19 + 0.2 + i * 1.75, bay: 7 + i }));
 B.push({ t0: TB.carga, t1: TB.inunda, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const wl = 980, L = 1100, base = 92;
  let added = 0, extra = {}; LIFTS.forEach((l) => { if (t >= l.t0 + 1.1) { added++; extra[l.bay] = 1; } });
  const dr = base + 10 * added - 10 * (1 - sm(0, 1, ((t - (LIFTS[Math.max(0, added - 1)] || LIFTS[0]).t0 - 1.1) / 0.5))) * (added > 0 ? 1 : 0);
  ctx.save(); P.camApply(ctx, [540, 960, 1]); P.seaProfile(ctx, wl, t, { x0: -100, x1: 1200, bottom: HH + 100, depth: 0.45, sun: [900, 380] });
  ctx.fillStyle = '#5f6b78'; ctx.fillRect(-100, wl - 30, 240, 90); ctx.fillStyle = '#3D5669'; ctx.fillRect(-100, wl + 60, 240, 900);
  const g = P.cargoShip(ctx, 620, wl, L, dr, t, { H: 150, rows: 3, extraBay: extra, plimsoll: true, plimsollDraft: base + 50, design: base + 50, disp: sm(T.desplazar19 - 0.3, T.desplazar19 + 0.2, t), seed: 6 });
  P.underwater(ctx, wl, t, { x0: -100, x1: 1200, bottom: HH + 100 });
  const ky = g.keel; ctx.save(); ctx.globalAlpha = sm(T.hunde19, T.hunde19 + 0.4, t); ctx.strokeStyle = C.oro; ctx.lineWidth = 3; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(g.x0 + 60, ky - base); ctx.lineTo(g.x1 - 60, ky - base); ctx.stroke(); ctx.restore(); tag(ctx, 'línea de flotación inicial', 330, ky - base + 26, 18, sm(T.hunde19, T.hunde19 + 0.4, t));
  // grúa: ciclo por contenedor
  let tr = 0.05, ho = 120, carrying = false; for (const l of LIFTS) { const u = t - l.t0; if (u >= 0 && u < 1.75) { const bx = g.bay(l.bay)[0], target = cl((bx - (40 + 520 * 0.1)) / (520 * 1.1 - 520 * 0.15)); const topY = g.deck - g.ch * 4; if (u < 0.6) { tr = lerp(0.05, target, E.inOut(u / 0.6)); ho = 120; carrying = true; } else if (u < 1.1) { tr = target; ho = lerp(120, topY - (wl - 520) + 4, E.inOut((u - 0.6) / 0.5)); carrying = true; } else { tr = lerp(target, 0.05, E.inOut((u - 1.1) / 0.65)); ho = 120; carrying = false; } } }
  const sp = P.gantryCrane(ctx, 40, wl - 30, 520, tr, ho, {}); if (carrying) P.container(ctx, sp[0] - g.bw / 2 + 1, sp[1], g.bw - 2, g.ch - 1, '#d6a33a');
  ctx.restore();
  pill(ctx, 'MÁS CARGA', 540, 330, 48, t, T.carga, C.oro, C.fondo, T.desplazar19);
  pill(ctx, 'MÁS CARGA → MÁS AGUA DESPLAZADA', 540, 330, 38, t, T.desplazar19, C.cian, C.fondo);
  tag(ctx, 'la marca Plimsoll (círculo amarillo) indica el límite de carga', 540, 1420, 20, sm(T.peso19, T.peso19 + 0.4, t));
 }, sfx(k) { FX.olas(k, TB.carga, TB.inunda - TB.carga, 0.8); LIFTS.forEach((l) => { FX.grua(k, l.t0, 1.1, 0.9); FX.contenedor(k, l.t0 + 1.1, 0.9); }); FX.etiqueta(k, T.desplazar19); } });
 // 14 · si entra demasiada agua: inundación de compartimentos (estancos)
 B.push({ t0: TB.inunda, t1: TB.final, in: { type: 'iris', d: 0.6, x: 540, y: 1000 }, draw(ctx, t) {
  const f1 = E.inOut(win(t, T.entra20, T.perder + 0.6)), f2 = E.inOut(win(t, T.interior20 + 0.3, T.hundiendose + 0.4)) * 0.85, dr = 140 + 70 * (f1 + f2) / 1.85, trim = 0.03 * (f1 + f2) / 1.85;
  ctx.save(); P.camApply(ctx, [540, 960, 1]); P.seaProfile(ctx, 980, t, { x0: -100, x1: 1200, bottom: HH + 100, depth: 0.55 }); const g = P.cargoShip(ctx, 540, 980, 1000, dr, t, { H: 230, rows: 3, cut: 1, comps: 7, flood: [0, 0, 0, 0, f2, f1, 0], trim, seed: 4 }); P.underwater(ctx, 980, t, { x0: -100, x1: 1200, bottom: HH + 100 });
  // vía de agua en el costado del compartimento 6
  if (t > T.entra20 - 0.2) { const [a, b] = g.comps[5], hx = (a + b) / 2 + 30, hy = g.keel - 40; ctx.save(); ctx.translate(540, 980); ctx.rotate(trim); ctx.translate(-540, -980); ctx.strokeStyle = C.peso; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hx - 16, hy - 10); ctx.lineTo(hx, hy + 6); ctx.lineTo(hx + 14, hy - 8); ctx.stroke(); ctx.strokeStyle = 'rgba(57,217,255,0.9)'; ctx.lineWidth = 6; for (let k = 0; k < 3; k++) { const u = (t * 2.4 + k / 3) % 1; ctx.beginPath(); ctx.moveTo(hx, hy - u * 60); ctx.lineTo(hx - 6, hy - u * 60 - 16); ctx.stroke(); } ctx.restore(); }
  ctx.restore();
  pill(ctx, 'VÍA DE AGUA', 540, 330, 46, t, T.entra20, C.peso, C.blanco, T.hundiendose - 0.2);
  pill(ctx, 'SI SE INUNDA DEMASIADO, PUEDE HUNDIRSE', 540, 330, 34, t, T.hundiendose - 0.2, C.peso, C.blanco);
  tag(ctx, 'el agua ocupa el lugar del aire: más peso, menos reserva de flotabilidad', 540, 420, 19, sm(T.perder, T.perder + 0.4, t));
  tag(ctx, 'los mamparos estancos frenan la inundación', 540, 1420, 21, sm(T.flotabilidad, T.flotabilidad + 0.4, t));
 }, sfx(k) { FX.olas(k, TB.inunda, TB.final - TB.inunda, 0.7); FX.rotura(k, T.entra20 - 0.1); FX.alarma(k, T.entra20 + 0.3, 3); FX.inundacion(k, T.entra20, TB.final - T.entra20, 1); FX.casco(k, T.perder, 1, 55); FX.casco(k, T.hundiendose, 0.8, 50); } });
 // 15–16 · regreso al barco navegando: no es el acero, es su forma (y el empuje) · Asombroteca
 const finalWorld = (ctx, t) => {
  const cam = P.camAt([[TB.final, 540, 1700, 1.0], [T.barco21 + 0.4, 540, 1200, 0.85], [T.navegando + 0.3, 600, 840, 0.72], [T.forma, 600, 900, 0.72], [DURATION, 640, 860, 0.74]], t);
  const cut = sm(T.forma - 0.2, T.forma + 0.5, t) * (1 - sm(T.sigue - 0.3, T.sigue + 0.4, t)), disp = sm(T.desplazar23 - 0.2, T.desplazar23 + 0.4, t) * (1 - sm(T.sigue - 0.3, T.sigue + 0.4, t));
  ctx.save(); P.camApply(ctx, cam); const st = { ship: 1, shipX: 540 + (t - TB.final) * 8, cut, disp, sky: ['#3a3a6a', '#f2b07a'], sun: [1050, 520] }; world(ctx, t, st);
  const g = st.geo, fa = sm(T.peso23 - 0.4, T.peso23, t) * (1 - sm(T.sigue - 0.3, T.sigue + 0.3, t)); if (fa > 0 && g) { const cx = (g.x0 + g.x1) / 2; ctx.save(); ctx.globalAlpha = fa; P.forceArrow(ctx, cx - 60, SURF + 80, 380, 1, C.empuje, 'EMPUJE', { w: 46, px: 54, align: 'right' }); P.forceArrow(ctx, cx + 60, SURF - 120, 380, -1, C.peso, 'PESO', { w: 46, px: 54 }); ctx.restore(); }
  ctx.restore();
 };
 B.push({ t0: TB.final, t1: T.sigue - 0.15, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  finalWorld(ctx, t);
  pill(ctx, 'NO ES PORQUE EL ACERO SEA LIGERO', 540, 330, 36, t, T.no22, C.blanco, C.fondo, T.sino);
  if (t > T.ligero) { ctx.save(); ctx.globalAlpha = 1 - sm(T.sino - 0.2, T.sino, t); P.cross(ctx, 540, 330, 90, E.out(win(t, T.ligero, T.ligero + 0.3)), C.peso); ctx.restore(); }
  pill(ctx, 'ES SU FORMA', 540, 330, 54, t, T.forma - 0.1, C.oro, C.fondo, T.desplazar23);
  pill(ctx, 'DESPLAZA SUFICIENTE AGUA', 540, 330, 44, t, T.desplazar23, C.cian, C.fondo, T.peso23 - 0.3);
  pill(ctx, 'EMPUJE = PESO', 540, 330, 56, t, T.peso23 - 0.3, C.oro, C.fondo);
 }, sfx(k) { FX.bajoAgua(k, TB.final, 2.5, 0.7); k.play('riser', TB.final + 0.3, { dur: 2.2, gain: 0.35 }); FX.olas(k, T.barco21, T.sigue - T.barco21 + 3, 1); FX.bocina(k, T.navegando + 0.2, 1.6, 0.8); FX.tachado(k, T.ligero); FX.sello(k, T.forma - 0.1); FX.aparece(k, T.desplazar23, 600); FX.equilibrio(k, T.peso23 - 0.2); } });
 B.push({ t0: T.sigue - 0.15, t1: DURATION + 1, in: { type: 'cut' }, draw(ctx, t) {
  finalWorld(ctx, t);
  P.withPop(ctx, t, T.sigue + 0.1, 540, 420, () => { P.rr(ctx, 210, 355, 660, 130, 32, 'rgba(7,21,34,0.78)'); P.text(ctx, 'ASOMBROTECA', 540, 421, 68, C.blanco, { kind: 'title' }); });
  const press = win(t, T.asombroteca + 1.0, T.asombroteca + 1.2), done = t > T.asombroteca + 1.15;
  P.withPop(ctx, t, T.asombroteca + 0.2, 540, 565, () => { P.rr(ctx, 380, 520, 320, 86, 43, done ? '#2fbf71' : C.oro, { sy: 8 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 565, 36, C.fondo); });
  if (t > T.asombroteca + 0.4) P.finger(ctx, 600, lerp(900, 585, E.out(win(t, T.asombroteca + 0.4, T.asombroteca + 1.0))), 90, press * (1 - win(t, T.asombroteca + 1.3, T.asombroteca + 1.6)));
 }, sfx(k) { FX.sello(k, T.sigue + 0.1); FX.aparece(k, T.asombroteca + 0.2, 700); FX.clic(k, T.asombroteca + 1.15); k.play('ding', T.asombroteca + 1.2, { f: 'A5', gain: 0.3 }); FX.fin(k, T.asombroteca + 1.5); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['acero', 'hunde', 'flotar', 'invisible', 'desplaza', 'empuje', 'Arquímedes', 'macizo', 'denso', 'aire', 'promedio', 'menor', 'volumen', 'iguala', 'peso', 'equilibrio', 'carga', 'flotabilidad', 'ligero', 'forma', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 260, gain: 0.03, a: 1, hold: DURATION - 2 }); },
  music(k) {
   k.music('pad', 0, T.la3, { bpm: 84, gain: 0.42, chords: [['D2', 'A2', 'F3', 'C4'], ['Bb1', 'F2', 'D3', 'A3'], ['C2', 'G2', 'E3', 'G3']] });
   k.music('pulse', T.la3, T.pero7, { bpm: 96, gain: 0.22, chords: [['D3', 'A3', 'F4', 'C5'], ['Bb2', 'F3', 'D4', 'A4'], ['F2', 'C3', 'A3', 'E4'], ['C3', 'G3', 'E4', 'G4']] });
   k.music('pad', T.pero7, T.a14, { bpm: 90, gain: 0.38, chords: [['F2', 'C3', 'A3', 'E4'], ['G2', 'D3', 'B3', 'D4'], ['A2', 'E3', 'C4', 'G4']] });
   k.music('pulse', T.a14, T.y19, { bpm: 100, gain: 0.24, chords: [['D3', 'A3', 'F4', 'A4'], ['Bb2', 'F3', 'D4', 'F4'], ['C3', 'G3', 'E4', 'G4'], ['F2', 'C3', 'A3', 'C4']] });
   k.music('pulse', T.y19, T.asi21, { bpm: 92, gain: 0.22, chords: [['A2', 'E3', 'C4', 'E4'], ['F2', 'C3', 'A3', 'C4'], ['D2', 'A2', 'F3', 'A3'], ['E2', 'B2', 'G#3', 'B3']] });
   k.music('pad', T.asi21, DURATION, { bpm: 86, gain: 0.42, chords: [['F2', 'C3', 'A3', 'E4'], ['G2', 'D3', 'B3', 'D4'], ['C3', 'G3', 'E4', 'G4']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
