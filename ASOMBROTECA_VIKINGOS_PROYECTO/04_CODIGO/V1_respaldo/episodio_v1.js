// =====================================================================================================
// episodio.js — «¿Cómo lograron los vikingos llegar a América antes que Colón?» · Asombroteca · PLANTILLA v1.13
// Arco: knarr en el Atlántico (antes que Colón) → sin motores, GPS ni brújulas → ¿cómo? → ingeniería naval (rayos X)
// → barco oceánico → tablas superpuestas (corte trincado, remaches) → flexibilidad ante las olas → vela → remos →
// no fue un solo salto (mapa) → Escandinavia → Islandia (≈ 870) → Groenlandia (985) → América del Norte (tierra habitada)
// → ¿cómo se orientaban? → Sol, estrellas, viento y mar → experiencia acumulada → evidencia arqueológica →
// L'Anse aux Meadows (pequeño enclave; reconstrucción → restos) → 1021 (anillos + evento solar de 993) → 471 años →
// comerciantes y navegantes → llegaron hace mil años → Asombroteca.
// Datos verificados en FUENTES_Y_DECISIONES.md. Reloj = voz original. Determinista.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const C = { mar: '#102C3A', marL: '#2D6274', espuma: '#DCE8E9', tormenta: '#647C8B', cielo: '#A7C8D4', madera: '#5D3D29', maderaL: '#A4774F', vela: '#D7C6A5', cuerda: '#9E835E', roca: '#68736C', veg: '#49664B', hielo: '#C9E5ED', dorado: '#D8B16B', oro: '#FFD447', fondo: '#0D1820', blanco: '#F4F7F7', rojo: '#d9534f', agua: '#37B9D9' };
 const T = {
  casi: wt(0, 'casi'), n500: wt(0, '500'), colon0: wt(0, 'colón'), america0: wt(0, 'américa'),
  vikingos1: wt(1, 'vikingos'), cruzado: wt(1, 'cruzado'), oceano1: wt(1, 'océano'), atlantico1: wt(1, 'atlántico'),
  y2: SG(2).s, barcos2: wt(2, 'barcos'), madera2: wt(2, 'madera'), motores: wt(2, 'motores'), gps: wt(2, 'gps'), brujulas: wt(2, 'brújulas'),
  pero3: SG(3).s, como4: wt(4, 'cómo'), navegar4: wt(4, 'navegar'), distancias: wt(4, 'distancias'), enormes: wt(4, 'enormes'), mil4: wt(4, 'mil'),
  la5: SG(5).s, respuesta: wt(5, 'respuesta'), conocimientos5: wt(5, 'conocimientos'), construccion5: wt(5, 'construcción'), naval5: wt(5, 'naval'), navegacion5: wt(5, 'navegación'),
  primero: SG(6).s, embarcaciones6: wt(6, 'embarcaciones'), dificiles: wt(6, 'difíciles'), atlantico6: wt(6, 'atlántico'),
  sus7: SG(7).s, cascos: wt(7, 'cascos'), tablas: wt(7, 'tablas'), superpuestas: wt(7, 'superpuestas'), unidas: wt(7, 'unidas'), resistencia: wt(7, 'resistencia'), flexibilidad: wt(7, 'flexibilidad'),
  esto8: SG(8).s, soportar: wt(8, 'soportar'), olas8: wt(8, 'olas'),
  ademas: SG(9).s, velas: wt(9, 'velas'), aprovechar: wt(9, 'aprovechar'), fuerza: wt(9, 'fuerza'), viento9: wt(9, 'viento'),
  y10: SG(10).s, algunas10: wt(10, 'algunas'), desplazarse: wt(10, 'desplazarse'), remos: wt(10, 'remos'),
  pero11: SG(11).s, sorprendente: wt(11, 'sorprendente'), no12: SG(12).s, cruzar12: wt(12, 'cruzar'), sola: wt(12, 'sola'), vez: wt(12, 'vez'),
  desde13: SG(13).s, escandinavia: wt(13, 'escandinavia'), nordicos13: wt(13, 'nórdicos'), islandia: wt(13, 'islandia'),
  despues14: SG(14).s, asentamientos14: wt(14, 'asentamientos'), groenlandia: wt(14, 'groenlandia'),
  y15: SG(15).s, expediciones: wt(15, 'expediciones'), costas15: wt(15, 'costas'), america15: wt(15, 'américa'),
  pero16: SG(16).s, como16: wt(16, 'cómo'), camino: wt(16, 'camino'), instrumentos: wt(16, 'instrumentos'),
  obs17: SG(17).s, sol: wt(17, 'sol'), estrellas: wt(17, 'estrellas'), vientos: wt(17, 'vientos'), condiciones17: wt(17, 'condiciones'), mar17: wt(17, 'mar'),
  tambien18: SG(18).s, acumulados: wt(18, 'acumulados'), rutas: wt(18, 'rutas'), costas18: wt(18, 'costas'), puntos: wt(18, 'puntos'), referencia: wt(18, 'referencia'),
  y19: SG(19).s, prueba: wt(19, 'prueba'), arqueologica: wt(19, 'arqueológica'), llegaron19: wt(19, 'llegaron'),
  en20: SG(20).s, lanse: wt(20, "l'anse"), terranova: wt(20, 'terranova'), canada: wt(20, 'canadá'),
  se21: SG(21).s, restos: wt(21, 'restos'), asentamiento21: wt(21, 'asentamiento'), nordico21: wt(21, 'nórdico'),
  y22: SG(22).s, investigadores: wt(22, 'investigadores'), identificaron: wt(22, 'identificaron'), actividad: wt(22, 'actividad'), ano: wt(22, 'año'), n1021: wt(22, '1021'),
  eso23: SG(23).s, aprox: wt(23, 'aproximadamente'), n470: wt(23, '470'), primer: wt(23, 'primer'), colon23: wt(23, 'colón'), america23: wt(23, 'américa'),
  asi24: SG(24).s, guerreros: wt(24, 'guerreros'), comerciantes: wt(24, 'comerciantes'),
  tambien25: SG(25).s, navegantes25: wt(25, 'navegantes'), alcanzar: wt(25, 'alcanzar'), continente: wt(25, 'continente'), siglos: wt(25, 'siglos'), exploracion: wt(25, 'exploración'),
  sigue: SG(26).s, asombroteca: wt(26, 'asombroteca'), end: A.speech_end,
 };
 const TB = { sin: T.y2 - 0.2, como: T.pero3 - 0.15, inge: T.la5 - 0.25, oceano: T.primero - 0.3, tablas: T.sus7 - 0.3, flex: T.esto8 - 0.3, vela: T.ademas - 0.25, remos: T.y10 - 0.2, salto: T.pero11 - 0.25, rutas: T.desde13 - 0.25, america: T.y15 - 0.2, orienta: T.pero16 - 0.25, obs: T.obs17 - 0.25, conoc: T.tambien18 - 0.25, prueba: T.y19 - 0.25, lanse: T.en20 - 0.25, ano: T.y22 - 0.25, linea: T.eso23 - 0.25, mas: T.asi24 - 0.25, final: T.tambien25 - 0.2, cierre: T.sigue - 0.15 };

 // ---------------- utilidades ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, px, a, c = 'rgba(244,247,247,0.98)') => { if (a <= 0.01) return; px = Math.max(px, 32); ctx.save(); ctx.globalAlpha *= a; ctx.font = `600 ${px}px "IBM Plex Mono"`; let L = [s];
  if (ctx.measureText(s).width + px * 1.2 > 1000) { const m = s.length / 2; let k = -1; for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (k < 0 || Math.abs(i - m) < Math.abs(k - m))) k = i; if (k > 0) L = [s.slice(0, k), s.slice(k + 1)]; }
  const lw = Math.max(...L.map((l) => ctx.measureText(l).width)); if (lw + px * 1.2 > 1020) { px *= 1000 / (lw + px * 1.2); ctx.font = `600 ${px}px "IBM Plex Mono"`; }
  const w = Math.max(...L.map((l) => ctx.measureText(l).width)) + px * 1.2, lh = px * 1.25, h = px * 0.45 + lh * L.length, x0 = Math.min(Math.max(x - w / 2, 30), 1050 - w);
  P.rr(ctx, x0, y - h / 2, w, h, px * 0.6, 'rgba(13,24,32,0.8)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; L.forEach((l, i) => ctx.fillText(l, x0 + w / 2, y + 1 + (i - (L.length - 1) / 2) * lh)); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 8; ctx.fillText(s, x, y); ctx.restore(); };
 const callout = (ctx, x0, y0, x1, y1, s, a, c = C.blanco, al = 'left') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 9, 0, TAU); ctx.fill(); ctx.restore(); ctx.save(); ctx.globalAlpha *= a; txt(ctx, s, x1 + (al === 'left' ? 12 : -12), y1, 38, c, { al }); ctx.restore(); };
 const scrim = (ctx) => { const g = ctx.createLinearGradient(0, 1400, 0, 1760); g.addColorStop(0, 'rgba(13,24,32,0)'); g.addColorStop(0.5, 'rgba(13,24,32,0.62)'); g.addColorStop(1, 'rgba(13,24,32,0.62)'); ctx.fillStyle = g; ctx.fillRect(0, 1400, W, 520); };
 const bgTech = (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#13293a'); g.addColorStop(1, C.fondo); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = 'rgba(167,200,212,0.06)'; ctx.lineWidth = 2; for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); } for (let y = 0; y <= HH; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } };
 const crossX = (ctx, x, y, r, p) => { if (p <= 0) return; ctx.save(); ctx.strokeStyle = C.rojo; ctx.lineWidth = r * 0.2; ctx.lineCap = 'round'; const a = r * 0.75; ctx.beginPath(); ctx.moveTo(x - a, y - a); ctx.lineTo(x - a + 2 * a * cl(p * 2), y - a + 2 * a * cl(p * 2)); if (p > 0.5) { ctx.moveTo(x + a, y - a); ctx.lineTo(x + a - 2 * a * cl(p * 2 - 1), y - a + 2 * a * cl(p * 2 - 1)); } ctx.stroke(); ctx.restore(); };
 const disc = (ctx, x, y, r, a) => { ctx.save(); ctx.globalAlpha *= a; P.circle(ctx, x, y, r, 'rgba(244,247,247,0.95)'); ctx.restore(); };
 // iconos sencillos: motor, GPS (satélite), brújula moderna
 const icoMotor = (ctx, x, y, r) => { ctx.save(); ctx.fillStyle = '#5b6770'; ctx.fillRect(x - r * 0.5, y - r * 0.35, r * 0.9, r * 0.7); ctx.fillRect(x - r * 0.35, y - r * 0.55, r * 0.5, r * 0.2); ctx.fillRect(x + r * 0.4, y - r * 0.15, r * 0.2, r * 0.3); ctx.fillStyle = '#87949e'; for (let i = 0; i < 3; i++) ctx.fillRect(x - r * 0.42 + i * r * 0.26, y - r * 0.25, r * 0.16, r * 0.5); ctx.restore(); };
 const icoGPS = (ctx, x, y, r) => { P.pin(ctx, x, y + r * 0.45, r * 1.1, '#3f8fd2'); };
 const icoBrujula = (ctx, x, y, r) => { ctx.save(); ctx.fillStyle = '#c9cfd4'; ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, TAU); ctx.fill(); ctx.strokeStyle = '#5b6770'; ctx.lineWidth = r * 0.08; ctx.stroke(); ctx.fillStyle = '#d9534f'; ctx.beginPath(); ctx.moveTo(x, y - r * 0.5); ctx.lineTo(x + r * 0.1, y); ctx.lineTo(x - r * 0.1, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#3a4248'; ctx.beginPath(); ctx.moveTo(x, y + r * 0.5); ctx.lineTo(x + r * 0.1, y); ctx.lineTo(x - r * 0.1, y); ctx.closePath(); ctx.fill(); ctx.restore(); };

 // ---------------- toma marítima compartida: mar + costa + knarr + mar delantero ----------------
 // o: { cam, hor, sun, sky, mood, seed, flow, sx, sy, ss, knarr:{...}, coast:{...}, fogA, clouds, before(ctx, sea), after(ctx, k), night }
 function seaShot(ctx, t, o = {}) {
  const sx = o.sx ?? 540, sy = o.sy ?? 1120, ss = o.ss ?? 620;
  const so = { hor: o.hor ?? 760, sun: o.sun === null ? null : (o.sun || [820, 520]), sunA: o.sunA, sky: o.sky, mood: o.mood || 'fresco', seed: o.seed ?? 3, flow: o.flow ?? 70, x0: -2400, x1: 3500, bottom: 3000, clouds: o.clouds ?? 12, fogA: o.fogA || 0, split: sy, amp: o.amp };
  ctx.save(); if (o.cam) P.camApply(ctx, o.cam);
  const sea = P.seaHD(ctx, t, { ...so, part: 'back' });
  if (o.night) P.nightSky(ctx, t, { a: o.night, y0: so.hor - 2600, y1: so.hor, n: 420 });
  if (o.coast) P.coast(ctx, so.hor + 2, t, { x0: -2400, x1: 3500, ...o.coast });
  if (o.before) o.before(ctx, sea);
  let K = null; if (o.knarr !== false) { const f = sea.float(sx, sy, ss); K = P.knarr(ctx, sx, f.y, ss, t, { ang: f.ang + (o.angAdd || 0), ...(o.knarr || {}) }); }
  P.seaHD(ctx, t, { ...so, part: 'front' });
  if (o.after) o.after(ctx, K, sea);
  ctx.restore(); return K;
 }
 const B = [];

 // 1 · GANCHO: vuelo rasante sobre las olas hasta el knarr; la cámara sube y revela el Atlántico
 B.push({ t0: 0, t1: TB.sin, draw(ctx, t) {
  const cam = P.camAt([[0, 560, 1060, 2.3], [2.2, 560, 1060, 1.5], [T.oceano1, 560, 1000, 1.0], [TB.sin, 560, 900, 0.62]], t);
  seaShot(ctx, t, { cam, sx: 540, sy: 1120, ss: 620, knarr: { sail: 1, billow: 0.85, crew: 4 }, coast: { kind: 'fiordo', h: 150, x0: -2400, x1: -200, seed: 4 }, fogA: 0.25 + 0.4 * (1 - sm(0, 2, t)) });
  P.glow(ctx, 540, 500, 700, '255,230,190', 0.12);
  pill(ctx, '¡ANTES QUE COLÓN!', 540, 300, 64, t, T.colon0, C.oro, C.fondo, T.oceano1);
  pill(ctx, 'OCÉANO ATLÁNTICO', 540, 300, 52, t, T.oceano1, C.blanco, C.fondo);
  tag(ctx, 'en América ya vivían pueblos indígenas desde hacía milenios', 540, 420, 32, sm(T.vikingos1, T.vikingos1 + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, 0, TB.sin + 0.5, 1.1); k.play('whoosh', 0.05, { dur: 1.6, top: 1200, gain: 0.35 }); FX.madera(k, 1.2, 2, 0.8); FX.sello(k, T.colon0); FX.viento(k, T.oceano1 - 0.5, 3, 0.9); MUS.golpe(k, T.america0, { gain: 0.8 }); } });

 // 2 · SIN TECNOLOGÍA MODERNA: la cámara baja junto al barco; madera, mástil, vela, remos y cuerdas
 B.push({ t0: TB.sin, t1: TB.como, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = P.camAt([[TB.sin, 640, 1040, 1.25], [TB.como, 470, 1000, 1.45]], t);
  const K = seaShot(ctx, t, { cam, sx: 540, sy: 1180, ss: 760, knarr: { sail: 1, billow: 0.8, crew: 5, oars: sm(T.madera2, T.madera2 + 0.5, t) * 0.8, oarPhase: t * 0.7 }, seed: 6, flow: 90 });
  const q = (p) => { const c = P.camAt([[TB.sin, 640, 1040, 1.25], [TB.como, 470, 1000, 1.45]], t); return [(p[0] - c[0]) * c[2] + 540, (p[1] - c[1]) * c[2] + 960]; };
  const hb = q(K.hull(0.3, 0.5)), mt = q(K.mastTop), sl = q(K.sailC);
  callout(ctx, hb[0], hb[1], 760, 1340, 'CASCO DE MADERA', sm(T.madera2 - 0.2, T.madera2 + 0.2, t) * (1 - sm(T.motores, T.motores + 0.3, t)), C.blanco);
  callout(ctx, mt[0], mt[1] + 40, 760, 560, 'MÁSTIL Y VELA', sm(T.barcos2, T.barcos2 + 0.3, t) * (1 - sm(T.motores, T.motores + 0.3, t)), C.blanco);
  const icons = [[T.motores, icoMotor, 260], [T.gps, icoGPS, 540], [T.brujulas, icoBrujula, 820]];
  icons.forEach(([t0, f, x]) => { const a = sm(t0 - 0.2, t0 + 0.1, t); if (a <= 0) return; disc(ctx, x, 470, 92, a); ctx.save(); ctx.globalAlpha *= a; f(ctx, x, 470, 92); ctx.restore(); crossX(ctx, x, 470, 92, win(t, t0 + 0.15, t0 + 0.45)); });
  pill(ctx, 'SIN MOTORES · SIN GPS', 540, 300, 54, t, T.motores - 0.1, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.sin, TB.como - TB.sin, 1); FX.madera(k, TB.sin + 0.3, 3); FX.cuerdas(k, T.barcos2); FX.etiqueta(k, T.madera2); FX.tachado(k, T.motores + 0.15); FX.tachado(k, T.gps + 0.15); FX.tachado(k, T.brujulas + 0.15); FX.remo(k, T.madera2 + 0.6, 2, 1.4, 0.7); } });

 // 3 · EL GRAN DESAFÍO: el barco diminuto frente al océano; la cámara asciende y mide la distancia
 B.push({ t0: TB.como, t1: TB.inge, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = P.camAt([[TB.como, 540, 1100, 1.2], [T.distancias, 540, 900, 0.5], [TB.inge, 540, 820, 0.36]], t);
  seaShot(ctx, t, { cam, sx: 540, sy: 1120, ss: 300, mood: 'tormenta', sky: ['#3c4d58', '#7d93a0'], sun: [900, 300], sunA: 0.4, seed: 8, knarr: { sail: 1, billow: 0.9, crew: 3 }, coast: { kind: 'glaciar', h: 300, x0: -2400, x1: -900, seed: 9 }, fogA: 0.4, clouds: 16 });
  const a = sm(T.distancias, T.distancias + 0.5, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.oro; ctx.lineWidth = 6; ctx.setLineDash([22, 16]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(110, 1000); ctx.lineTo(970, 1000); ctx.stroke(); ctx.setLineDash([]); for (const x of [110, 970]) { ctx.beginPath(); ctx.moveTo(x, 970); ctx.lineTo(x, 1030); ctx.stroke(); } ctx.restore(); tag(ctx, 'cientos de kilómetros de mar abierto entre costas', 540, 1080, 32, a); }
  pill(ctx, '¿CÓMO CRUZARON EL OCÉANO?', 540, 300, 52, t, T.como4 - 0.1, C.blanco, C.fondo);
  pill(ctx, 'HACE MÁS DE 1.000 AÑOS', 540, 410, 42, t, T.mil4 - 0.1, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.como, TB.inge - TB.como, 1.3); FX.viento(k, TB.como, TB.inge - TB.como, 1.2); k.play('riser', T.navegar4, { dur: 1.5, gain: 0.25 }); FX.aparece(k, T.como4); FX.etiqueta(k, T.mil4); } });

 // 4 · INGENIERÍA NAVAL: el casco se vuelve transparente: quilla, cuadernas, tablas, mástil y vela
 B.push({ t0: TB.inge, t1: TB.oceano, in: { type: 'zoom', d: 0.5, x: 540, y: 1000 }, draw(ctx, t) {
  const cam = [560, 1020, 1.25 + 0.04 * win(t, TB.inge, TB.oceano)];
  const xr = sm(T.conocimientos5 - 0.3, T.conocimientos5 + 0.6, t);
  const gk = sm(T.construccion5, T.construccion5 + 0.3, t);
  const K = seaShot(ctx, t, { cam, sx: 540, sy: 1180, ss: 780, mood: 'calma', seed: 11, flow: 40, knarr: { sail: 1, billow: 0.6, crew: 0, xray: xr, glow: { keel: gk, mast: sm(T.naval5 + 0.3, T.naval5 + 0.6, t) } } });
  const q = (p) => [(p[0] - cam[0]) * cam[2] + 540, (p[1] - cam[1]) * cam[2] + 960];
  const kc = q(K.keelC), rb = q(K.hull(-0.45, 0.5)), pl = q(K.hull(0.62, 0.35)), mt = q(K.mastTop), sl = q(K.sailR);
  callout(ctx, kc[0], kc[1], 700, 1330, 'QUILLA', gk, C.oro);
  callout(ctx, rb[0], rb[1], 120, 1260, 'CUADERNAS', sm(T.construccion5 + 0.3, T.construccion5 + 0.6, t), C.blanco);
  callout(ctx, pl[0], pl[1], 780, 1180, 'TABLAS', sm(T.naval5, T.naval5 + 0.3, t), C.blanco);
  callout(ctx, mt[0], mt[1] + 60, 700, 520, 'MÁSTIL', sm(T.naval5 + 0.3, T.naval5 + 0.6, t), C.blanco);
  callout(ctx, sl[0] - 40, sl[1] + 120, 820, 660, 'VELA', sm(T.navegacion5, T.navegacion5 + 0.3, t), C.blanco);
  pill(ctx, 'INGENIERÍA NAVAL', 540, 300, 58, t, T.respuesta, C.oro, C.fondo);
  tag(ctx, 'reconstrucción de un knarr, barco mercante nórdico', 540, 410, 32, sm(T.respuesta + 0.4, T.respuesta + 0.8, t));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.inge, TB.oceano - TB.inge, 0.7); FX.revelar(k, T.conocimientos5 - 0.2); FX.etiqueta(k, T.construccion5); FX.etiqueta(k, T.construccion5 + 0.35); FX.etiqueta(k, T.naval5); FX.etiqueta(k, T.navegacion5); FX.madera(k, TB.inge + 0.4, 3, 0.7); } });

 // 5 · UN BARCO PARA EL ATLÁNTICO NORTE: travelling lateral con mar picado; el casco sube y baja
 B.push({ t0: TB.oceano, t1: TB.tablas, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const u = win(t, TB.oceano, TB.tablas), cam = [500 + u * 80, 1000 + Math.sin(t * 0.9) * 12, 1.08];
  seaShot(ctx, t, { cam, sx: 560, sy: 1130, ss: 700, mood: sm(T.dificiles - 0.4, T.dificiles + 0.6, t) > 0.5 ? 'tormenta' : 'fresco', sky: sm(T.dificiles - 0.4, T.dificiles + 0.6, t) > 0.5 ? ['#3c4d58', '#647C8B'] : undefined, amp: 1 + 0.6 * sm(T.dificiles - 0.4, T.dificiles + 0.6, t), sun: [880, 420], sunA: 1 - 0.6 * sm(T.dificiles - 0.4, T.dificiles + 0.6, t), seed: 13, flow: 120, knarr: { sail: 1, billow: 0.95, crew: 4, wake: 1 }, fogA: 0.3 });
  if (sm(T.dificiles, T.dificiles + 0.6, t) > 0) P.rainSheet(ctx, t, { a: 0.5 * sm(T.dificiles, T.dificiles + 0.6, t), n: 160, seed: 5 });
  pill(ctx, 'UN BARCO PARA EL OCÉANO', 540, 300, 52, t, T.embarcaciones6 - 0.1, C.oro, C.fondo, T.dificiles);
  pill(ctx, 'ATLÁNTICO NORTE: FRÍO, VIENTO Y OLAS', 540, 300, 44, t, T.dificiles, C.blanco, C.fondo);
  tag(ctx, 'knarr: casco ancho y hondo para carga y pasajeros', 540, 420, 32, sm(T.embarcaciones6, T.embarcaciones6 + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.oceano, TB.tablas - TB.oceano, 1.2); FX.madera(k, TB.oceano + 0.5, 5, 1); FX.viento(k, T.dificiles - 0.3, TB.tablas - T.dificiles + 0.3, 1.3); FX.lluviaFuerte(k, T.dificiles, TB.tablas - T.dificiles + 0.2, 0.5); FX.aparece(k, T.embarcaciones6); } });

 // 6 · TABLAS SUPERPUESTAS: del casco al corte técnico; las tablas se separan y se vuelven a unir con remaches
 B.push({ t0: TB.tablas, t1: TB.flex, in: { type: 'zoom', d: 0.45, x: 540, y: 1100 }, draw(ctx, t) {
  const sw = sm(T.tablas + 0.2, T.tablas + 0.8, t);
  if (sw < 1) { ctx.save(); ctx.globalAlpha = 1 - sw; seaShot(ctx, t, { cam: [560, 1150, 2.3 + 0.4 * win(t, TB.tablas, T.tablas + 0.8)], sx: 540, sy: 1180, ss: 760, mood: 'calma', seed: 14, flow: 40, knarr: { sail: 1, crew: 0, glow: { planks: sm(T.cascos, T.cascos + 0.3, t) } } }); ctx.restore(); }
  if (sw > 0) { ctx.save(); ctx.globalAlpha = sw; bgTech(ctx);
   const ex = 1 - sm(T.unidas - 0.1, T.unidas + 0.6, t), gr = sm(T.unidas + 0.3, T.unidas + 0.7, t);
   const pts = P.clinkerSection(ctx, 540, 1250, 860, 720, t, { explode: ex * sm(T.superpuestas - 0.4, T.superpuestas, t), glow: { rivets: gr, overlap: sm(T.superpuestas, T.superpuestas + 0.3, t) * (1 - gr * 0.5) }, flex: sm(T.flexibilidad, T.flexibilidad + 0.4, t) * Math.sin((t - T.flexibilidad) * 4) * 0.8 });
   const ov = pts.overlaps[3] || [800, 900];
   callout(ctx, ov[0], ov[1], 830, 680, 'SOLAPE', sm(T.superpuestas, T.superpuestas + 0.3, t), C.oro, 'right');
   callout(ctx, pts.overlaps[1][0], pts.overlaps[1][1] + 6, 850, 1380, 'REMACHES DE HIERRO', gr, C.oro, 'right');
   callout(ctx, pts.keel[0], pts.keel[1] + 40, 380, 1390, 'QUILLA', sm(T.unidas + 0.6, T.unidas + 0.9, t), C.blanco, 'right');
   callout(ctx, pts.rib[0] - 280, pts.rib[1], 110, 760, 'CUADERNA', sm(T.resistencia - 0.6, T.resistencia - 0.3, t), C.blanco);
   ctx.restore(); }
  pill(ctx, 'TABLAS SUPERPUESTAS', 540, 300, 56, t, T.tablas, C.oro, C.fondo, T.resistencia);
  pill(ctx, 'RESISTENCIA', 330, 300, 48, t, T.resistencia, C.blanco, C.fondo);
  pill(ctx, 'FLEXIBILIDAD', 750, 300, 48, t, T.flexibilidad, C.oro, C.fondo);
  tag(ctx, 'corte transversal · técnica de casco trincado («clinker»)', 540, 420, 32, sm(T.superpuestas, T.superpuestas + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.madera(k, TB.tablas, 2, 0.8); FX.revelar(k, T.tablas); k.play('swish', T.superpuestas - 0.4, { dur: 0.4, gain: 0.4 }); FX.martillo(k, T.unidas + 0.2, 5, 0.18); FX.etiqueta(k, T.resistencia); FX.etiqueta(k, T.flexibilidad); FX.madera(k, T.flexibilidad, 2, 1); } });

 // 7 · FLEXIBILIDAD FRENTE A LAS OLAS: ola grande bajo el casco; el casco cede apenas y recupera su forma
 B.push({ t0: TB.flex, t1: TB.vela, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const fl = Math.sin((t - TB.flex) * 2.4) * 0.9;
  seaShot(ctx, t, { cam: [540, 1020, 1.05], sx: 540, sy: 1130, ss: 680, mood: 'tormenta', amp: 1.6, sky: ['#3c4d58', '#647C8B'], sun: null, seed: 17, flow: 110, knarr: { sail: 1, billow: 1, crew: 4, flex: fl, wake: 1 }, fogA: 0.3 });
  // detalle: corte con la flexión (ventana técnica)
  const a = sm(T.soportar - 0.4, T.soportar, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, 600, 470, 420, 400, 26, 'rgba(13,24,32,0.85)'); ctx.save(); ctx.beginPath(); ctx.rect(600, 470, 420, 400); ctx.clip(); P.clinkerSection(ctx, 810, 800, 330, 280, t, { flex: fl, n: 6 }); ctx.restore(); ctx.strokeStyle = C.oro; ctx.lineWidth = 3; ctx.strokeRect(600, 470, 420, 400); txt(ctx, 'cede un poco · no se rompe', 810, 515, 34, C.blanco, { w: 800 }); ctx.restore(); }
  pill(ctx, 'RESISTENCIA Y FLEXIBILIDAD', 540, 300, 48, t, T.esto8, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.flex, TB.vela - TB.flex, 1.5); FX.madera(k, TB.flex + 0.2, 4, 1.3); k.play('thud', T.olas8, { f: 60, gain: 0.4 }); FX.aparece(k, T.esto8); } });

 // 8 · LA FUERZA DEL VIENTO: la vela se iza, el viento la llena y el barco avanza (viento de popa o de través)
 B.push({ t0: TB.vela, t1: TB.remos, in: { type: 'rise', d: 0.45 }, draw(ctx, t) {
  const up = sm(T.velas - 0.3, T.velas + 0.6, t), fill = sm(T.aprovechar, T.fuerza + 0.4, t);
  const cam = P.camAt([[TB.vela, 600, 760, 1.5], [T.velas + 0.6, 560, 860, 1.2], [TB.remos, 540, 940, 1.05]], t);
  seaShot(ctx, t, { cam, sx: 540, sy: 1150, ss: 700, mood: 'fresco', seed: 19, flow: 30 + 140 * fill, sun: [860, 460], knarr: { sail: 0.05 + 0.95 * up, billow: fill, crew: 4, wake: 0.3 + 0.7 * fill } });
  const a = sm(T.fuerza - 0.4, T.fuerza, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; for (let i = 0; i < 7; i++) { const y = 520 + i * 70, x = ((t * 420 + i * 230) % 1300) - 300; ctx.strokeStyle = 'rgba(244,247,247,0.85)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 150, y); ctx.lineTo(x + 130, y - 16); ctx.moveTo(x + 150, y); ctx.lineTo(x + 130, y + 16); ctx.stroke(); } ctx.restore(); txt(ctx, 'VIENTO', 160, 470, 40, C.blanco); }
  pill(ctx, 'ENERGÍA DEL VIENTO', 540, 300, 56, t, T.velas, C.oro, C.fondo);
  tag(ctx, 'la vela cuadrada rinde mejor con viento de popa o de costado', 540, 1330, 32, sm(T.viento9, T.viento9 + 0.3, t));
  scrim(ctx);
 }, sfx(k) { FX.vela(k, T.velas - 0.1); FX.cuerdas(k, T.velas + 0.4); FX.viento(k, T.aprovechar - 0.2, TB.remos - T.aprovechar + 0.4, 1.5); FX.oleaje(k, TB.vela, TB.remos - TB.vela, 0.9); FX.aparece(k, T.velas); } });

 // 9 · LOS REMOS: junto al casco, los remos entran al agua (para maniobrar o cuando faltaba viento)
 B.push({ t0: TB.remos, t1: TB.salto, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const ph = (t - TB.remos) * 0.62, oa = sm(T.desplazarse - 0.6, T.desplazarse, t);
  const cam = P.camAt([[TB.remos, 700, 1130, 1.8], [TB.salto, 620, 1120, 1.55]], t);
  seaShot(ctx, t, { cam, sx: 540, sy: 1160, ss: 720, mood: 'calma', seed: 21, flow: 40 + 40 * oa, knarr: { sail: 0.05, crew: 5, oars: oa, oarN: 4, oarPhase: ph, glow: { oars: sm(T.remos, T.remos + 0.3, t) } }, after: (c, K) => { if (oa <= 0) return; for (let i = 0; i < 3; i++) { const tt = TB.remos + 0.4 + i / 0.62; if (t > T.desplazarse - 0.6) P.splash(c, K.oar[0], K.oar[1] + 5, t, Math.max(T.desplazarse - 0.5, tt), { s: 40, seed: i + 3 }); } } });
  pill(ctx, 'PROPULSIÓN CON REMOS', 540, 300, 54, t, T.desplazarse - 0.2, C.oro, C.fondo);
  tag(ctx, 'en el knarr, pocos remos: para maniobrar o sin viento', 540, 420, 32, sm(T.remos, T.remos + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.remo(k, T.desplazarse - 0.4, 4, 1 / 0.62, 1); FX.oleaje(k, TB.remos, TB.salto - TB.remos, 0.6); FX.aparece(k, T.desplazarse - 0.2); } });

 // ---------------- mapa del Atlántico Norte (rutas por etapas) ----------------
 const MAP = { x: 40, y: 240, w: 1000, h: 760 };
 const LEG1 = [[5.5, 61.3], [0, 61.9], [-7, 62.4], [-13.2, 64.9]];
 const LEG2 = [[-23.8, 64.9], [-30, 64.6], [-38, 62.6], [-45.6, 60.9]];
 const LEG3 = [[-47.5, 61.2], [-53, 62.4], [-59.5, 59.5], [-60.5, 56], [-56.8, 53.2], [-55.53, 51.6]];
 const PLACES = { escandinavia: [12, 62.5], islandia: [-18.5, 65], groenlandia: [-42, 70], america: [-68, 54], lanse: [-55.53, 51.6] };
 function mapShot(ctx, t, o = {}) {
  bgTech(ctx); const pr = P.northAtlantic(ctx, MAP.x, MAP.y, MAP.w, MAP.h, t, {}); ctx.save(); ctx.strokeStyle = 'rgba(167,200,212,0.45)'; ctx.lineWidth = 3; ctx.strokeRect(MAP.x, MAP.y, MAP.w, MAP.h); ctx.restore();
  const lab = (k, s, a, dx = 0, dy = 0, c = C.blanco) => { if (a <= 0) return; const p = pr(PLACES[k]); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, TAU); ctx.fill(); ctx.restore(); ctx.save(); ctx.globalAlpha *= a; txt(ctx, s, p[0] + dx, p[1] + dy, 34, c); ctx.restore(); };
  if (o.labels) { const L = o.labels; lab('escandinavia', 'ESCANDINAVIA', L.e ?? 0, -10, -50); lab('islandia', 'ISLANDIA', L.i ?? 0, 0, -48); lab('groenlandia', 'GROENLANDIA', L.g ?? 0, 0, 46, C.fondo); lab('america', 'AMÉRICA DEL NORTE', L.a ?? 0, 70, 90); }
  const rp = o.route || [0, 0, 0]; [LEG1, LEG2, LEG3].forEach((leg, i) => { if (rp[i] > 0) P.seaRoute(ctx, leg.map(pr), rp[i], t, { w: 7, shipS: 26, ship: rp[i] < 0.999 }); });
  ctx.save(); ctx.globalAlpha *= 0.85; txt(ctx, 'mapa estilizado · rutas simplificadas', MAP.x + MAP.w - 16, MAP.y + MAP.h - 28, 26, 'rgba(244,247,247,0.85)', { al: 'right', w: 600 }); ctx.restore();
  return pr;
 }
 // ventana de paisaje bajo el mapa (Islandia, Groenlandia…)
 function vista(ctx, t, a, draw, label) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const x = 40, y = 1030, w = 1000, h = 360; ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 26); ctx.clip(); ctx.translate(x, y); ctx.scale(w / 1080, w / 1080); ctx.translate(0, -620); draw(ctx); ctx.restore(); ctx.strokeStyle = 'rgba(244,247,247,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, h, 26); ctx.stroke(); if (label) tag(ctx, label, x + 230, y + 50, 32, 1); ctx.restore(); }

 // 10 · LA REVELACIÓN DE LA RUTA: el océano se convierte en mapa; no fue un solo salto
 B.push({ t0: TB.salto, t1: TB.rutas, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  const m = sm(T.pero11 + 0.4, T.sorprendente + 0.3, t);
  if (m < 1) { ctx.save(); seaShot(ctx, t, { cam: [540, 900 - 200 * win(t, TB.salto, T.sorprendente), 1 / (1 + 1.6 * win(t, TB.salto, T.sorprendente))], sx: 540, sy: 1120, ss: 500, seed: 23, knarr: { sail: 1, crew: 3 } }); ctx.restore(); }
  if (m > 0) { ctx.save(); ctx.globalAlpha *= m; mapShot(ctx, t, { labels: { e: sm(T.no12, T.no12 + 0.3, t), i: sm(T.cruzar12, T.cruzar12 + 0.3, t), g: sm(T.cruzar12 + 0.4, T.cruzar12 + 0.7, t), a: sm(T.sola - 0.3, T.sola, t) } });
   ctx.restore(); }
  pill(ctx, 'PERO AQUÍ VIENE LO SORPRENDENTE', 540, 150, 40, t, T.pero11 + 0.2, C.blanco, C.fondo, T.no12);
  pill(ctx, '¡NO FUE UN SOLO SALTO!', 540, 150, 56, t, T.no12, C.oro, C.fondo);
  tag(ctx, 'viajes por etapas, de costa en costa', 540, 1110, 34, sm(T.sola, T.sola + 0.4, t));
  scrim(ctx);
 }, sfx(k) { k.play('riser', T.pero11, { dur: 1.6, gain: 0.3 }); FX.mapa(k, T.pero11 + 0.5); MUS.golpe(k, T.no12, { gain: 0.9 }); FX.etiqueta(k, T.no12 + 0.1); FX.etiqueta(k, T.cruzar12); FX.etiqueta(k, T.cruzar12 + 0.4); FX.etiqueta(k, T.sola); } });

 // 11-13 · ESCANDINAVIA → ISLANDIA → GROENLANDIA → AMÉRICA (el mapa con ventanas de paisaje)
 B.push({ t0: TB.rutas, t1: TB.america, in: { type: 'cut' }, draw(ctx, t) {
  const r1 = sm(T.escandinavia, T.islandia + 0.3, t), r2 = sm(T.despues14, T.groenlandia + 0.4, t);
  mapShot(ctx, t, { labels: { e: 1, i: 1, g: 1, a: 1 }, route: [r1, r2, 0] });
  // ventanas
  const vI = sm(T.islandia - 0.4, T.islandia, t) * (1 - sm(T.despues14 + 0.2, T.despues14 + 0.6, t));
  vista(ctx, t, vI, (c) => { seaShot(c, t, { hor: 880, sun: [820, 700], sx: 640, sy: 975, ss: 300, seed: 25, coast: { kind: 'volcanica', h: 280, x0: -100, x1: 1200, seed: 6 }, knarr: { sail: 1, crew: 2 } }); }, 'ISLANDIA · desde ≈ 870');
  const vG = sm(T.asentamientos14, T.asentamientos14 + 0.4, t);
  vista(ctx, t, vG, (c) => { seaShot(c, t, { hor: 870, sun: [200, 700], sx: 830, sy: 985, ss: 210, seed: 27, mood: 'calma', coast: { kind: 'glaciar', h: 320, x0: -100, x1: 1200, seed: 11 }, knarr: { sail: 1, crew: 2 }, before: (cc) => { cc.fillStyle = '#5f7d4c'; cc.beginPath(); cc.moveTo(-100, 905); cc.quadraticCurveTo(250, 840, 600, 868); cc.lineTo(620, 880); cc.lineTo(-100, 915); cc.closePath(); cc.fill(); P.sodHouse(cc, 170, 888, 170, 78, t, { smoke: 1, seed: 2 }); P.sodHouse(cc, 400, 872, 130, 60, t, { seed: 3, doorX: -0.2 }); } }); }, 'GROENLANDIA · 985');
  pill(ctx, 'ESCANDINAVIA → ISLANDIA', 540, 150, 48, t, T.escandinavia, C.oro, C.fondo, T.despues14);
  pill(ctx, 'ISLANDIA → GROENLANDIA', 540, 150, 48, t, T.despues14, C.oro, C.fondo);
  tag(ctx, 'asentamientos en las costas del suroeste', 540, 1410, 32, sm(T.asentamientos14 + 0.4, T.asentamientos14 + 0.8, t));
  scrim(ctx);
 }, sfx(k) { FX.mapa(k, T.escandinavia - 0.1); FX.flecha(k, T.escandinavia + 0.2, 2.5); FX.revelar(k, T.islandia - 0.3); FX.flecha(k, T.despues14 + 0.2, 2); FX.revelar(k, T.asentamientos14); FX.oleaje(k, T.islandia - 0.3, 1.6, 0.5); FX.costa(k, T.asentamientos14, 2.4, 0.6); } });

 // 13 · HACIA AMÉRICA DEL NORTE: tercera etapa en el mapa y llegada entre la niebla a una costa baja
 B.push({ t0: TB.america, t1: TB.orienta, in: { type: 'cut' }, draw(ctx, t) {
  const r3 = sm(T.y15, T.expediciones + 1.0, t), sw = sm(T.expediciones + 0.9, T.expediciones + 1.4, t);
  if (sw < 1) { ctx.save(); ctx.globalAlpha = 1 - sw; mapShot(ctx, t, { labels: { e: 1, i: 1, g: 1, a: 1 }, route: [1, 1, r3] }); pill(ctx, 'GROENLANDIA → AMÉRICA', 540, 150, 48, t, T.y15, C.oro, C.fondo); ctx.restore(); }
  if (sw > 0) { ctx.save(); ctx.globalAlpha = sw; const u = win(t, T.expediciones + 0.9, TB.orienta);
   seaShot(ctx, t, { cam: [540, 1000, 1.1 + 0.15 * u], sx: 600 - 80 * u, sy: 1180, ss: 560, mood: 'calma', sky: ['#7b95a3', '#c9d6dc'], sun: [300, 560], sunA: 0.5, seed: 29, flow: 60, fogA: 0.9 - 0.5 * u, coast: { kind: 'baja', h: 110, c: '#4e5f52', seed: 21, a: 1 }, knarr: { sail: 1, billow: 0.7, crew: 4 } });
   pill(ctx, 'AMÉRICA DEL NORTE', 540, 300, 58, t, T.costas15 - 0.2, C.oro, C.fondo);
   tag(ctx, 'tierras habitadas desde hacía milenios por pueblos indígenas', 540, 420, 32, sm(T.america15, T.america15 + 0.4, t));
   ctx.restore(); }
  scrim(ctx);
 }, sfx(k) { FX.flecha(k, T.y15 + 0.2, 2.2); FX.descubrir(k, T.costas15 - 0.2); FX.costa(k, T.expediciones + 1, TB.orienta - T.expediciones - 0.8, 1); FX.aparece(k, T.costas15 - 0.2); MUS.golpe(k, T.america15, { gain: 0.7, chord: ['F3', 'C4', 'F4', 'A4'] }); } });

 // 14-15 · ¿CÓMO SE ORIENTABAN?: desde la cubierta, el navegante observa Sol, estrellas, viento y mar
 const deck = (ctx, t, lift = 0) => { // cubierta en primer plano (tablas de madera hacia el horizonte) y regala
  ctx.save(); ctx.fillStyle = '#4a3020'; ctx.beginPath(); ctx.moveTo(-50, 1200); ctx.quadraticCurveTo(540, 1160, 1130, 1200); ctx.lineTo(1130, 1260); ctx.quadraticCurveTo(540, 1220, -50, 1260); ctx.closePath(); ctx.fill();
  const g = ctx.createLinearGradient(0, 1250, 0, HH); g.addColorStop(0, '#6b4a33'); g.addColorStop(1, '#2e1f15'); ctx.fillStyle = g; ctx.fillRect(-50, 1250, W + 100, HH - 1250);
  ctx.strokeStyle = 'rgba(25,15,8,0.55)'; ctx.lineWidth = 3; for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 40, 1255); ctx.lineTo(540 + i * 170, HH); ctx.stroke(); }
  ctx.fillStyle = 'rgba(164,119,79,0.25)'; ctx.fillRect(-50, 1250, W + 100, 6); ctx.restore(); };
 B.push({ t0: TB.orienta, t1: TB.conoc, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const nt = sm(T.estrellas - 0.4, T.estrellas + 0.3, t) * (1 - sm(T.vientos + 0.1, T.vientos + 0.6, t));
  const sunA = (1 - nt);
  seaShot(ctx, t, { hor: 1000, cam: [540, 960, 1], sun: [800, lerp(780, 560, win(t, TB.orienta, T.sol + 0.5))], sunA: sunA * (t > T.obs17 ? 1 : 0.7), sky: ['#5f8aa0', '#d8c9a8'], mood: 'calma', seed: 31, flow: 50, knarr: false, night: nt, clouds: 6 });
  deck(ctx, t); P.norse(ctx, 360, 1700, 680, 0, { pose: 'look', cloak: '#3f4a52', cloth: '#7a5a3a' });
  // observaciones (las ilumina la voz)
  const sa = sm(T.sol - 0.2, T.sol + 0.2, t) * (1 - nt); if (sa > 0) { ctx.save(); ctx.globalAlpha *= sa; ctx.strokeStyle = C.oro; ctx.lineWidth = 4; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.arc(540, 1000, 420, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); callout(ctx, 800, 600, 700, 470, 'SOL: altura y dirección', sa, C.oro, 'right'); }
  if (nt > 0) callout(ctx, 640, 560, 560, 470, 'ESTRELLAS', nt, C.blanco, 'right');
  const va = sm(T.vientos - 0.2, T.vientos + 0.2, t); if (va > 0) { ctx.save(); ctx.globalAlpha *= va; for (let i = 0; i < 5; i++) { const y = 700 + i * 60, x = ((t * 380 + i * 260) % 1300) - 300; ctx.strokeStyle = 'rgba(244,247,247,0.85)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 130, y); ctx.stroke(); } ctx.restore(); }
  const ma = sm(T.condiciones17 - 0.2, T.condiciones17 + 0.2, t); if (ma > 0) { ctx.save(); ctx.globalAlpha *= ma; ctx.strokeStyle = C.agua; ctx.lineWidth = 6; for (let i = 0; i < 3; i++) { const x = 600 + i * 150, y = 1100 + (i % 2) * 30; ctx.beginPath(); ctx.moveTo(x - 50, y); ctx.quadraticCurveTo(x, y - 30, x + 50, y); ctx.stroke(); } ctx.restore(); }
  // fila de iconos-concepto
  const icons = [['SOL', T.sol, C.oro], ['ESTRELLAS', T.estrellas, C.blanco], ['VIENTO', T.vientos, C.blanco], ['MAR', T.mar17 - 0.3, C.agua]];
  icons.forEach(([s, t0, c], i) => { const a = sm(t0 - 0.15, t0 + 0.15, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, 50 + i * 250, 340, 230, 80, 40, 'rgba(13,24,32,0.8)'); txt(ctx, s, 165 + i * 250, 381, 36, c); ctx.restore(); });
  pill(ctx, '¿CÓMO SE ORIENTABAN?', 540, 200, 54, t, T.como16, C.oro, C.fondo, T.obs17);
  pill(ctx, 'OBSERVACIÓN DEL ENTORNO', 540, 200, 48, t, T.obs17, C.oro, C.fondo);
  tag(ctx, 'sin brújula magnética ni GPS', 540, 500, 32, sm(T.instrumentos, T.instrumentos + 0.3, t) * (1 - sm(T.sol - 0.4, T.sol - 0.1, t)));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.orienta, TB.conoc - TB.orienta, 0.6); FX.pasos(k, TB.orienta + 0.2, 3); FX.madera(k, TB.orienta + 1.5, 2, 0.6); FX.aparece(k, T.como16); FX.etiqueta(k, T.sol); FX.campana(k, T.estrellas); FX.viento(k, T.vientos - 0.2, 2.2, 1.2); FX.etiqueta(k, T.vientos); FX.etiqueta(k, T.mar17 - 0.3); } });

 // 16 · CONOCIMIENTO DE LAS RUTAS: del horizonte a un mapa conceptual con costas y puntos de referencia
 B.push({ t0: TB.conoc, t1: TB.prueba, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  bgTech(ctx); const pr = P.northAtlantic(ctx, 40, 300, 1000, 900, t, { lon0: -66, lon1: -8, lat0: 50, lat1: 70 }); ctx.save(); ctx.strokeStyle = 'rgba(167,200,212,0.45)'; ctx.lineWidth = 3; ctx.strokeRect(40, 300, 1000, 900); ctx.restore();
  P.seaRoute(ctx, [...LEG2, ...LEG3.slice(1)].map(pr), sm(T.tambien18, T.rutas + 0.6, t), t, { w: 7, shipS: 26 });
  const marks = [[[-21, 64.6], 'montañas y glaciares', T.costas18, -1], [[-44, 60.3], 'cabo al sur de Groenlandia', T.costas18 + 0.3, 1], [[-61, 57.5], 'costas que se siguen', T.puntos, 1], [[-55.6, 51.8], 'punto de llegada', T.referencia, -1]];
  marks.forEach(([ll, s, t0, side]) => { const a = sm(t0 - 0.1, t0 + 0.3, t); if (a <= 0) return; const p = pr(ll); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.oro; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], 20, 0, TAU); ctx.stroke(); ctx.restore(); tag(ctx, s, Math.min(860, Math.max(220, p[0] + side * 60)), p[1] + side * 70, 30, a); });
  pill(ctx, 'EXPERIENCIA Y CONOCIMIENTO', 540, 200, 50, t, T.tambien18, C.oro, C.fondo);
  tag(ctx, 'mapa explicativo para ti: los vikingos no usaban cartas así', 540, 1290, 32, sm(T.acumulados, T.acumulados + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.mapa(k, TB.conoc + 0.1); FX.flecha(k, T.tambien18 + 0.3, 3); FX.etiqueta(k, T.costas18); FX.etiqueta(k, T.costas18 + 0.3); FX.etiqueta(k, T.puntos); FX.etiqueta(k, T.referencia); } });

 // 17 · LA PRUEBA ARQUEOLÓGICA: la cámara abandona el océano y se acerca a la costa de Terranova
 const meadows = (ctx, t, ruin, o = {}) => { // L'Anse aux Meadows: pocas casas de césped junto a la costa (escala limitada)
  P.seaHD(ctx, t, { hor: 820, sky: ['#7fa2b5', '#cfdde2'], sun: [860, 560], sunA: 0.7, mood: 'calma', seed: 33, x0: -600, x1: 1700, clouds: 8 });
  P.coast(ctx, 822, t, { kind: 'baja', h: 90, c: '#4e5f52', x0: -600, x1: 1700, seed: 30 });
  ctx.fillStyle = '#5f7d4c'; ctx.beginPath(); ctx.moveTo(-600, 1000); ctx.quadraticCurveTo(300, 930, 1700, 960); ctx.lineTo(1700, 2400); ctx.lineTo(-600, 2400); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(214,201,160,0.8)'; ctx.beginPath(); ctx.moveTo(-600, 1000); ctx.quadraticCurveTo(300, 930, 1700, 960); ctx.lineTo(1700, 985); ctx.quadraticCurveTo(300, 955, -600, 1025); ctx.closePath(); ctx.fill();
  const g = ctx.createLinearGradient(0, 1000, 0, 1800); g.addColorStop(0, 'rgba(95,125,76,0)'); g.addColorStop(1, 'rgba(48,66,44,0.8)'); ctx.fillStyle = g; ctx.fillRect(-600, 1000, 2300, 1400);
  const R = H.rng(5); ctx.strokeStyle = 'rgba(150,180,110,0.5)'; ctx.lineWidth = 2; for (let i = 0; i < 160; i++) { const x = R.range(-500, 1600), y = R.range(1040, 1900); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + R.range(-4, 4), y - R.range(6, 16)); ctx.stroke(); }
  const houses = [[300, 1240, 420, 190], [760, 1190, 330, 150], [520, 1120, 260, 115]];
  houses.slice().reverse().forEach(([x, y, w, h], i) => P.sodHouse(ctx, x, y, w, h, t, { ruin, smoke: ruin < 0.5 && i === 2 ? 1 : null, seed: i + 7, glow: o.glow }));
  if (ruin < 0.6) { P.norse(ctx, 600, 1340, 150, t * 0.5, { pose: 'walk', cloak: '#6b4a35' }); P.norse(ctx, 140, 1300, 140, 0, { pose: 'stand' }); }
 };
 B.push({ t0: TB.prueba, t1: TB.lanse, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  const u = win(t, TB.prueba, TB.lanse);
  if (u < 0.55) seaShot(ctx, t, { cam: [540, 1000, 1 + 0.6 * win(t, TB.prueba, TB.prueba + 2.2)], hor: 900, sun: [860, 620], sunA: 0.7, sky: ['#7fa2b5', '#cfdde2'], mood: 'calma', seed: 35, sx: 540, sy: 1220, ss: 420, coast: { kind: 'baja', h: 120, c: '#4e5f52', seed: 30 }, knarr: { sail: 1, crew: 3 } });
  const m = sm(0.45, 0.65, u); if (m > 0) { ctx.save(); ctx.globalAlpha = m; ctx.save(); P.camApply(ctx, [540, 1100, 1.5 - 0.3 * u]); meadows(ctx, t, 0); ctx.restore(); ctx.restore(); }
  pill(ctx, '¡EXISTE EVIDENCIA ARQUEOLÓGICA!', 540, 300, 46, t, T.prueba - 0.1, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.costa(k, TB.prueba, TB.lanse - TB.prueba, 0.8); MUS.golpe(k, T.arqueologica, { gain: 0.8 }); FX.revelar(k, T.prueba); } });

 // 18 · L'ANSE AUX MEADOWS: reconstrucción del enclave → restos arqueológicos (montículos de césped)
 B.push({ t0: TB.lanse, t1: TB.ano, in: { type: 'cut' }, draw(ctx, t) {
  const ruin = sm(T.restos - 0.3, T.restos + 0.9, t);
  ctx.save(); P.camApply(ctx, P.camAt([[TB.lanse, 540, 1100, 1.2], [TB.ano, 520, 1150, 1.05]], t)); meadows(ctx, t, ruin, { glow: sm(T.asentamiento21, T.asentamiento21 + 0.3, t) * 0.8 }); ctx.restore();
  pill(ctx, "L'ANSE AUX MEADOWS", 540, 300, 56, t, T.lanse, C.oro, C.fondo);
  pill(ctx, 'TERRANOVA · CANADÁ', 540, 410, 44, t, T.terranova, C.blanco, C.fondo);
  tag(ctx, ruin < 0.5 ? 'reconstrucción: casas de madera y césped' : 'restos: bases de los muros bajo la hierba', 540, 520, 32, sm(T.lanse + 0.4, T.lanse + 0.8, t));
  tag(ctx, 'un pequeño enclave, no una ciudad', 540, 1330, 34, sm(T.nordico21 - 0.3, T.nordico21 + 0.1, t));
  scrim(ctx);
 }, sfx(k) { FX.costa(k, TB.lanse, TB.ano - TB.lanse, 0.6); FX.aparece(k, T.lanse); FX.etiqueta(k, T.terranova); FX.tiempo(k, T.restos - 0.3, 1.2, 0.8); FX.etiqueta(k, T.nordico21 - 0.3); } });

 // 19 · EL AÑO 1021: madera cortada con herramienta de metal; anillo del evento solar de 993 → corteza = año de corte
 B.push({ t0: TB.ano, t1: TB.linea, in: { type: 'zoom', d: 0.45, x: 540, y: 900 }, draw(ctx, t) {
  bgTech(ctx); const hi = sm(T.identificaron, T.identificaron + 0.4, t), cnt = win(t, T.actividad, T.ano);
  const RG = P.treeRings(ctx, 540, 800, 360, t, { n: 46, hi: hi > 0 ? 28 : null, count: cnt, cut: 1, seed: 12 });
  callout(ctx, 540 + 360 * 0.75, 800 + 360 * 0.45, 860, 1260, 'corte con metal', sm(T.investigadores, T.investigadores + 0.3, t), C.blanco, 'right');
  const p0 = RG.at(28, 2.4); callout(ctx, p0[0], p0[1], 120, 1180, 'anillo del año 993', hi, C.oro);
  const yr = Math.round(lerp(993, 1021, cnt)); if (cnt > 0) { const pb = RG.at(0); ctx.save(); P.rr(ctx, pb[0] + 20, pb[1] - 70, 250, 90, 22, 'rgba(13,24,32,0.85)'); txt(ctx, String(yr), pb[0] + 145, pb[1] - 25, 60, cnt >= 1 ? C.oro : C.blanco, { w: 900 }); ctx.restore(); }
  pill(ctx, 'AÑO 1021', 540, 260, 70, t, T.n1021 - 0.1, C.oro, C.fondo);
  tag(ctx, 'señal de radiocarbono de una tormenta solar de 993', 540, 1310, 32, hi);
  tag(ctx, 'fecha de un trabajo con madera; no de toda la ocupación', 540, 1390, 30, sm(T.n1021 + 0.3, T.n1021 + 0.7, t));
  scrim(ctx);
 }, sfx(k) { FX.revelar(k, TB.ano + 0.2); k.play('thud', T.investigadores, { f: 120, gain: 0.3 }); FX.etiqueta(k, T.identificaron); FX.contador(k, T.actividad, T.ano, 993, 1021); MUS.golpe(k, T.n1021, { gain: 0.9 }); FX.sello(k, T.n1021); } });

 // 20 · 470 AÑOS ANTES DE COLÓN: línea temporal 1000 → 1500
 B.push({ t0: TB.linea, t1: TB.mas, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  bgTech(ctx); const sp = sm(T.n470 - 0.2, T.n470 + 1.4, t);
  P.timeline(ctx, 110, 970, 980, t, { from: 1000, to: 1500, step: 100, p: sm(TB.linea, T.aprox, t), px: 32, marks: [{ v: 1021, label: '1021', sub: 'presencia nórdica', a: sm(T.eso23, T.eso23 + 0.3, t), up: true }, { v: 1492, label: '1492', sub: 'primer viaje de Colón', c: C.blanco, a: sm(T.colon23 - 0.3, T.colon23, t), up: false }], span: [1021, 1492], spanP: sp });
  const n = Math.round(lerp(0, 471, sp)); if (sp > 0) { txt(ctx, String(n), 540, 600, 190, C.oro, { w: 900 }); txt(ctx, 'AÑOS', 540, 730, 64, C.blanco); }
  pill(ctx, '471 AÑOS DE DIFERENCIA', 540, 260, 52, t, T.colon23, C.oro, C.fondo);
  tag(ctx, '1492 − 1021 = 471 ≈ «470 años»', 540, 1300, 34, sm(T.america23, T.america23 + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.flecha(k, TB.linea + 0.2, 1.4); FX.aparece(k, T.eso23); FX.contador(k, T.n470 - 0.2, T.n470 + 1.4, 0, 471); FX.aparece(k, T.colon23 - 0.2, 400); FX.sello(k, T.colon23 + 0.1); } });

 // 21 · MÁS QUE GUERREROS: comercio y navegación (sin centrarse en la violencia)
 B.push({ t0: TB.mas, t1: TB.final, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  seaShot(ctx, t, { cam: [560, 1060, 1.25], sx: 560, sy: 1180, ss: 640, mood: 'calma', sun: [820, 540], seed: 37, flow: 50, coast: { kind: 'fiordo', h: 200, x0: -2400, x1: 500, seed: 15 }, knarr: { sail: 1, billow: 0.7, crew: 4 }, after: (c, K) => { const p = K.hull(-0.2, 0.95); for (let i = 0; i < 4; i++) { c.fillStyle = i % 2 ? '#7a5a3a' : '#8b6a45'; c.fillRect(p[0] + i * 46 - 60, p[1] - 44, 40, 40); c.strokeStyle = 'rgba(40,25,15,0.7)'; c.lineWidth = 3; c.strokeRect(p[0] + i * 46 - 60, p[1] - 44, 40, 40); } } });
  const lab = [['GUERREROS', T.guerreros, 0.55, 220], ['COMERCIANTES', T.comerciantes, 1, 540], ['NAVEGANTES', T.comerciantes + 0.5, 1, 860]];
  lab.forEach(([s, t0, al, x]) => { const a = sm(t0 - 0.15, t0 + 0.15, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a * al; P.rr(ctx, x - 160, 300, 320, 86, 43, s === 'GUERREROS' ? 'rgba(13,24,32,0.8)' : C.oro); txt(ctx, s, x, 344, 34, s === 'GUERREROS' ? C.blanco : C.fondo); ctx.restore(); });
  tag(ctx, 'llevaban carga y pasajeros entre asentamientos', 540, 450, 32, sm(T.comerciantes + 0.3, T.comerciantes + 0.6, t));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.mas, TB.final - TB.mas, 0.7); FX.etiqueta(k, T.guerreros); FX.etiqueta(k, T.comerciantes); FX.etiqueta(k, T.comerciantes + 0.5); FX.cuerdas(k, TB.mas + 0.8); } });

 // 22 · REVELACIÓN FINAL: el barco avanza hacia la costa; la cámara sube y aparece la ruta completa
 const finale = (ctx, t) => { const cam = P.camAt([[TB.final, 560, 1100, 1.35], [T.continente, 560, 950, 0.9], [DURATION, 560, 880, 0.75]], t);
  seaShot(ctx, t, { cam, sx: 560, sy: 1150, ss: 600, mood: 'fresco', sun: [300, 480], sky: ['#6d93a8', '#e3cfa8'], seed: 41, flow: 90, coast: { kind: 'baja', h: 160, c: '#4e5f52', x0: -1400, x1: 3500, seed: 22 }, fogA: 0.2, knarr: { sail: 1, billow: 0.9, crew: 4, wake: 1 } });
  const m = sm(T.siglos - 0.3, T.siglos + 0.5, t); if (m > 0) { ctx.save(); ctx.globalAlpha *= m * 0.95; P.rr(ctx, 90, 470, 900, 560, 26, 'rgba(13,24,32,0.75)'); const pr = P.northAtlantic(ctx, 110, 490, 860, 520, t, { grid: false }); [LEG1, LEG2, LEG3].forEach((leg) => P.seaRoute(ctx, leg.map(pr), 1, t, { w: 6, ship: false })); const lp = pr(PLACES.lanse); P.glow(ctx, lp[0], lp[1], 60, '255,212,71', 0.6); ctx.restore(); } };
 B.push({ t0: TB.final, t1: TB.cierre, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  finale(ctx, t);
  pill(ctx, 'NAVEGANTES', 540, 300, 56, t, T.navegantes25 - 0.1, C.oro, C.fondo, T.continente);
  pill(ctx, 'LLEGARON A AMÉRICA', 540, 260, 56, t, T.continente, C.oro, C.fondo);
  pill(ctx, 'HACE MIL AÑOS', 540, 370, 52, t, T.continente + 0.3, C.blanco, C.fondo);
  tag(ctx, 'siglos antes de los grandes viajes europeos de exploración', 540, 1110, 32, sm(T.siglos + 0.3, T.siglos + 0.7, t));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.final, DURATION - TB.final, 0.9); FX.viento(k, TB.final, 3, 0.8); FX.aparece(k, T.navegantes25); FX.descubrir(k, T.continente); FX.mapa(k, T.siglos - 0.3); MUS.golpe(k, T.exploracion, { gain: 0.8 }); } });
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'cut' }, draw(ctx, t) {
  finale(ctx, t);
  P.withPop(ctx, t, T.sigue + 0.1, 540, 300, () => { P.rr(ctx, 210, 235, 660, 130, 32, 'rgba(13,24,32,0.8)'); P.text(ctx, 'ASOMBROTECA', 540, 301, 68, C.blanco, { kind: 'title' }); });
  const press = win(t, T.asombroteca + 1.0, T.asombroteca + 1.2), done = t > T.asombroteca + 1.15;
  P.withPop(ctx, t, T.asombroteca + 0.2, 540, 445, () => { P.rr(ctx, 380, 400, 320, 86, 43, done ? '#2fbf71' : C.oro, { sy: 8 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 445, 36, C.fondo); });
  if (t > T.asombroteca + 0.4) P.finger(ctx, 600, lerp(800, 465, E.out(win(t, T.asombroteca + 0.4, T.asombroteca + 1.0))), 90, press * (1 - win(t, T.asombroteca + 1.3, T.asombroteca + 1.6)));
  scrim(ctx);
 }, sfx(k) { FX.sello(k, T.sigue + 0.1); FX.aparece(k, T.asombroteca + 0.2, 700); FX.clic(k, T.asombroteca + 1.15); k.play('ding', T.asombroteca + 1.2, { f: 'A5', gain: 0.3 }); FX.fin(k, T.asombroteca + 1.5); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['vikingos', 'América', 'Colón', 'Atlántico', 'barcos', 'madera', 'construcción', 'naval', 'tablas', 'superpuestas', 'flexibilidad', 'olas', 'velas', 'viento', 'remos', 'Escandinavia', 'Islandia', 'Groenlandia', 'Sol', 'estrellas', 'arqueológica', "L'Anse", 'aux', 'Meadows', 'Terranova', '1021', '470', 'navegantes', 'continente', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 420, gain: 0.03, a: 2, hold: DURATION - 3 }); },
  music(k) {
   // banda sonora original: modo dórico/menor (sobria), cuerdas + bordón; percusión moderada en la aventura
   const Dm = [['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3'], ['C2', 'G2', 'C3', 'E3'], ['A1', 'E2', 'A2', 'C#3']];
   const Dor = [['D2', 'A2', 'D3', 'F3'], ['C2', 'G2', 'C3', 'E3'], ['G1', 'D2', 'G2', 'B2'], ['D2', 'A2', 'D3', 'F3']];
   const Up = [['F2', 'C3', 'F3', 'A3'], ['C2', 'G2', 'C3', 'E3'], ['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3']];
   MUS.epica(k, 0, TB.inge, { bpm: 72, chords: Dm, gain: 1, drums: 0.5, strings: 1 });
   MUS.epica(k, TB.inge, TB.salto, { bpm: 84, chords: Dor, gain: 0.85, drums: 0.35, strings: 0.8, ostinato: 0.8 });
   MUS.epica(k, TB.salto, TB.orienta, { bpm: 88, chords: Up, gain: 0.95, drums: 0.7, strings: 1, ostinato: 1 });
   MUS.epica(k, TB.orienta, TB.prueba, { bpm: 66, chords: Dor, gain: 0.8, drums: 0, strings: 0.9, ostinato: 0.4 });
   MUS.epica(k, TB.prueba, TB.mas, { bpm: 76, chords: Dm, gain: 0.85, drums: 0.4, strings: 1, ostinato: 0.6 });
   MUS.epica(k, TB.mas, DURATION, { bpm: 80, chords: [['F2', 'C3', 'F3', 'A3'], ['C2', 'G2', 'C3', 'E3'], ['A#1', 'F2', 'A#2', 'D3'], ['D2', 'A2', 'D3', 'F#3']], gain: 1, drums: 0.8, strings: 1, ostinato: 0.8 });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
