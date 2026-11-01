// =====================================================================================================
// episodio.js — «¿Cómo lograron los vikingos llegar a América antes que Colón?» · Asombroteca · PLANTILLA v1.13.1 · V2 (revisión maestra)
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
  P.rr(ctx, x0, y - h / 2, w, h, px * 0.6, 'rgba(13,24,32,0.82)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; L.forEach((l, i) => ctx.fillText(l, x0 + w / 2, y + 1 + (i - (L.length - 1) / 2) * lh)); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 8; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
 // rótulo con línea de referencia: el texto lleva cápsula oscura y nunca sale del lienzo
 const callout = (ctx, x0, y0, x1, y1, s, a, c = C.blanco, al = 'left') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = '800 42px Nunito'; const tw = ctx.measureText(s).width; let tx = al === 'left' ? x1 + 14 : x1 - 14 - tw; tx = cl(tx, 24, W - 24 - tw);
  ctx.strokeStyle = 'rgba(13,24,32,0.7)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 10, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(13,24,32,0.8)'; ctx.lineWidth = 3; ctx.stroke();
  P.rr(ctx, tx - 14, y1 - 32, tw + 28, 64, 32, 'rgba(13,24,32,0.82)'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, tx, y1 + 2); ctx.restore(); };
 const scrim = (ctx) => { const g = ctx.createLinearGradient(0, 1400, 0, 1760); g.addColorStop(0, 'rgba(13,24,32,0)'); g.addColorStop(0.5, 'rgba(13,24,32,0.62)'); g.addColorStop(1, 'rgba(13,24,32,0.62)'); ctx.fillStyle = g; ctx.fillRect(0, 1400, W, 520); };
 const bgTech = (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#13293a'); g.addColorStop(1, C.fondo); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = 'rgba(167,200,212,0.06)'; ctx.lineWidth = 2; for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); } for (let y = 0; y <= HH; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } };
 const crossX = (ctx, x, y, r, p) => { if (p <= 0) return; ctx.save(); ctx.strokeStyle = C.rojo; ctx.lineWidth = r * 0.2; ctx.lineCap = 'round'; const a = r * 0.75; ctx.beginPath(); ctx.moveTo(x - a, y - a); ctx.lineTo(x - a + 2 * a * cl(p * 2), y - a + 2 * a * cl(p * 2)); if (p > 0.5) { ctx.moveTo(x + a, y - a); ctx.lineTo(x + a - 2 * a * cl(p * 2 - 1), y - a + 2 * a * cl(p * 2 - 1)); } ctx.stroke(); ctx.restore(); };
 const disc = (ctx, x, y, r, a) => { ctx.save(); ctx.globalAlpha *= a; P.circle(ctx, x, y, r, 'rgba(244,247,247,0.95)'); ctx.restore(); };
 const icoMotor = (ctx, x, y, r) => { ctx.save(); ctx.fillStyle = '#5b6770'; ctx.fillRect(x - r * 0.5, y - r * 0.35, r * 0.9, r * 0.7); ctx.fillRect(x - r * 0.35, y - r * 0.55, r * 0.5, r * 0.2); ctx.fillRect(x + r * 0.4, y - r * 0.15, r * 0.2, r * 0.3); ctx.fillStyle = '#87949e'; for (let i = 0; i < 3; i++) ctx.fillRect(x - r * 0.42 + i * r * 0.26, y - r * 0.25, r * 0.16, r * 0.5); ctx.restore(); };
 const icoGPS = (ctx, x, y, r) => { P.pin(ctx, x, y + r * 0.45, r * 1.1, '#3f8fd2'); };
 const icoBrujula = (ctx, x, y, r) => { ctx.save(); ctx.fillStyle = '#c9cfd4'; ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, TAU); ctx.fill(); ctx.strokeStyle = '#5b6770'; ctx.lineWidth = r * 0.08; ctx.stroke(); ctx.fillStyle = '#d9534f'; ctx.beginPath(); ctx.moveTo(x, y - r * 0.5); ctx.lineTo(x + r * 0.1, y); ctx.lineTo(x - r * 0.1, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#3a4248'; ctx.beginPath(); ctx.moveTo(x, y + r * 0.5); ctx.lineTo(x + r * 0.1, y); ctx.lineTo(x - r * 0.1, y); ctx.closePath(); ctx.fill(); ctx.restore(); };
 const camPt = (cam, p) => [(p[0] - cam[0]) * cam[2] + 540, (p[1] - cam[1]) * cam[2] + 960]; // mundo → pantalla (sin rotación)

 // ---------------- toma marítima: mar (2 pasadas) + costa + knarr (cabeceo, balanceo) + espuma/estela ----------------
 // Estados del mar: 'calma' (navegación tranquila), 'fresco' (oleaje oceánico), 'tormenta' (Atlántico Norte), 'costa' (cerca de tierra)
 const MOODS = { calma: { mood: 'calma', amp: 0.8 }, fresco: { mood: 'fresco', amp: 1.1 }, tormenta: { mood: 'tormenta', amp: 1.7, sky: ['#33434e', '#5d7381'] }, costa: { mood: 'calma', amp: 0.7, sky: ['#7b9fb2', '#d0dee2'] } };
 function seaShot(ctx, t, o = {}) {
  const sx = o.sx ?? 540, sy = o.sy ?? 1120, ss = o.ss ?? 620, M = MOODS[o.state || 'fresco'];
  const so = { hor: o.hor ?? 760, sun: o.sun === null ? null : (o.sun || [820, 520]), sunA: o.sunA, sky: o.sky || M.sky, mood: M.mood, seed: o.seed ?? 3, flow: o.flow ?? 70, x0: -2400, x1: 3500, bottom: 3000, clouds: o.clouds ?? 12, fogA: o.fogA || 0, split: sy, amp: (o.amp ?? 1) * M.amp, flash: o.flash || 0 };
  ctx.save(); if (o.cam) P.camApply(ctx, o.cam);
  const sea = P.seaHD(ctx, t, { ...so, part: 'back' });
  if (o.night) P.nightSky(ctx, t, { a: o.night, y0: so.hor - 2600, y1: so.hor, n: 420 });
  if (o.coast) P.coast(ctx, so.hor + 2, t, { x0: -2400, x1: 3500, ...o.coast });
  if (o.before) o.before(ctx, sea);
  let K = null; if (o.knarr !== false) { const f = sea.float(sx, sy, ss), rl = (o.roll ?? 1) * so.amp * 0.55 * Math.sin(t * 1.15 + (o.seed || 0)); K = P.knarr(ctx, sx, f.y, ss, t, { ang: f.ang + (o.angAdd || 0), roll: rl, ...(o.knarr || {}) }); }
  P.seaHD(ctx, t, { ...so, part: 'front' });
  if (K) P.knarrWater(ctx, K, t, { speed: o.speed ?? 0.6, spray: o.spray });
  if (o.rain) P.rainSheet(ctx, t, { a: o.rain, n: 220, seed: 5, x: -2400, w: 5900, y: so.hor - 2600, h: 5000 });
  if (o.after) o.after(ctx, K, sea);
  ctx.restore(); return K;
 }
 const B = [];

 // 1 · GANCHO: cámara pegada al casco que corta la espuma; se abre y revela el Atlántico; comparación con Colón
 const camHook = (t) => P.camAt([[0, 790, 1095, 3.1, 0.035], [1.7, 640, 1060, 2.1, 0.015], [T.cruzado, 560, 1000, 1.15, 0], [T.oceano1 + 0.3, 560, 930, 0.82, 0], [TB.sin, 560, 870, 0.62, 0]], t);
 B.push({ t0: 0, t1: TB.sin, draw(ctx, t) {
  const cam = camHook(t);
  seaShot(ctx, t, { cam, sx: 540, sy: 1120, ss: 640, state: 'fresco', flow: 130, speed: 1, spray: 1, knarr: { sail: 1, billow: 0.95, crew: 4 }, coast: { kind: 'fiordo', h: 150, x0: -2400, x1: -300, seed: 4 }, fogA: 0.2 + 0.4 * (1 - sm(0, 2, t)), sun: [880, 520] });
  P.glow(ctx, 880, 300, 700, '255,226,180', 0.1);
  pill(ctx, '¡ANTES QUE COLÓN!', 540, 260, 66, t, T.colon0 - 0.1, C.oro, C.fondo);
  const ca = sm(T.america0 - 0.2, T.america0 + 0.2, t) * (1 - sm(T.oceano1 - 0.2, T.oceano1 + 0.2, t));
  if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; P.rr(ctx, 90, 330, 420, 110, 30, 'rgba(13,24,32,0.82)'); P.rr(ctx, 570, 330, 420, 110, 30, 'rgba(13,24,32,0.82)'); txt(ctx, 'VIKINGOS', 300, 365, 34, C.blanco); txt(ctx, '≈ AÑO 1000', 300, 410, 38, C.oro, { w: 900 }); txt(ctx, 'COLÓN', 780, 365, 34, C.blanco); txt(ctx, '1492', 780, 410, 38, C.blanco, { w: 900 }); ctx.restore(); }
  pill(ctx, 'OCÉANO ATLÁNTICO', 540, 380, 48, t, T.oceano1, C.blanco, C.fondo);
  tag(ctx, 'en América ya vivían pueblos indígenas desde hacía milenios', 540, 1340, 32, sm(T.vikingos1, T.vikingos1 + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, 0, TB.sin + 0.5, 1.2); k.play('whoosh', 0.02, { dur: 1.4, top: 1500, gain: 0.4 }); k.noise(0.1, { dur: 1.6, color: 'white', filter: 'bandpass', f: 2600, q: 0.8, gain: 0.05, a: 0.05 }); FX.madera(k, 0.8, 3, 1); FX.sello(k, T.colon0); FX.etiqueta(k, T.america0); FX.viento(k, T.cruzado - 0.3, 3, 1); MUS.golpe(k, T.america0, { gain: 0.8 }); } });

 // 2 · SIN TECNOLOGÍA MODERNA: nueva perspectiva (rumbo opuesto, cerca de la cubierta)
 const cam2 = (t) => P.camAt([[TB.sin, 470, 1010, 1.55], [TB.como, 560, 980, 1.35]], t);
 B.push({ t0: TB.sin, t1: TB.como, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = cam2(t);
  const K = seaShot(ctx, t, { cam, sx: 540, sy: 1160, ss: 760, state: 'fresco', seed: 6, flow: 90, knarr: { flip: true, sail: 1, billow: 0.85, crew: 5, oars: sm(T.madera2, T.madera2 + 0.5, t) * 0.9, oarN: 4, oarPhase: t * 0.55 } });
  const hb = camPt(cam, K.hull(0.25, 0.45)), mt = camPt(cam, K.mastTop), sl = camPt(cam, K.sailC);
  const ka = 1 - sm(T.motores - 0.1, T.motores + 0.2, t);
  callout(ctx, hb[0], hb[1], 640, 1330, 'CASCO DE MADERA', sm(T.madera2 - 0.2, T.madera2 + 0.2, t) * ka, C.oro);
  callout(ctx, sl[0], sl[1], 120, 560, 'VELA', sm(T.barcos2, T.barcos2 + 0.3, t) * ka, C.blanco);
  callout(ctx, mt[0], mt[1] + 30, 760, 560, 'MÁSTIL', sm(T.barcos2 + 0.25, T.barcos2 + 0.55, t) * ka, C.blanco);
  const icons = [[T.motores, icoMotor, 260, 'MOTOR'], [T.gps, icoGPS, 540, 'GPS'], [T.brujulas, icoBrujula, 820, 'BRÚJULA']];
  icons.forEach(([t0, f, x, s]) => { const a = sm(t0 - 0.2, t0 + 0.1, t); if (a <= 0) return; disc(ctx, x, 470, 100, a); ctx.save(); ctx.globalAlpha *= a; f(ctx, x, 470, 100); ctx.restore(); crossX(ctx, x, 470, 100, win(t, t0 + 0.15, t0 + 0.45)); ctx.save(); ctx.globalAlpha *= a; txt(ctx, s, x, 610, 36, C.blanco); ctx.restore(); });
  pill(ctx, 'SIN MOTORES · SIN GPS', 540, 270, 54, t, T.motores - 0.1, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.sin, TB.como - TB.sin, 1); FX.madera(k, TB.sin + 0.3, 3); FX.cuerdas(k, T.barcos2); FX.etiqueta(k, T.madera2); FX.tachado(k, T.motores + 0.15); FX.tachado(k, T.gps + 0.15); FX.tachado(k, T.brujulas + 0.15); FX.remo(k, T.madera2 + 0.6, 2, 1 / 0.55, 0.7); } });

 // 3 · EL GRAN DESAFÍO: el barco diminuto en un mar abierto que se oscurece; relámpago lejano
 B.push({ t0: TB.como, t1: TB.inge, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = P.camAt([[TB.como, 540, 1100, 1.2], [T.distancias, 540, 900, 0.5], [TB.inge, 540, 820, 0.36]], t);
  const fl = Math.max(0, 1 - Math.abs(t - (T.enormes + 0.2)) * 6);
  seaShot(ctx, t, { cam, sx: 540, sy: 1120, ss: 300, state: 'tormenta', sun: [900, 300], sunA: 0.3, seed: 8, knarr: { sail: 1, billow: 0.9, crew: 3 }, coast: { kind: 'glaciar', h: 300, x0: -2400, x1: -900, seed: 9 }, fogA: 0.4, clouds: 16, flash: fl, rain: 0.35 });
  const a = sm(T.distancias, T.distancias + 0.5, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.oro; ctx.lineWidth = 7; ctx.setLineDash([24, 16]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(100, 1000); ctx.lineTo(980, 1000); ctx.stroke(); ctx.setLineDash([]); for (const x of [100, 980]) { ctx.beginPath(); ctx.moveTo(x, 965); ctx.lineTo(x, 1035); ctx.stroke(); } ctx.restore(); tag(ctx, 'cientos de kilómetros de mar abierto entre costas', 540, 1090, 34, a); }
  pill(ctx, '¿CÓMO CRUZARON EL OCÉANO?', 540, 270, 52, t, T.como4 - 0.1, C.blanco, C.fondo);
  pill(ctx, 'HACE MÁS DE 1.000 AÑOS', 540, 380, 44, t, T.mil4 - 0.1, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.como, TB.inge - TB.como, 1.3); FX.viento(k, TB.como, TB.inge - TB.como, 1.2); k.play('thud', T.enormes + 0.35, { f: 45, gain: 0.45 }); k.noise(T.enormes + 0.3, { dur: 2.2, color: 'brown', filter: 'lowpass', f: 220, gain: 0.25, a: 0.05 }); FX.aparece(k, T.como4); FX.etiqueta(k, T.mil4); } });

 // 4 · INGENIERÍA NAVAL: rayos X (quilla, cuadernas, tablas, mástil, vela)
 B.push({ t0: TB.inge, t1: TB.oceano, in: { type: 'zoom', d: 0.5, x: 540, y: 1000 }, draw(ctx, t) {
  const cam = [560, 1010, 1.25 + 0.05 * win(t, TB.inge, TB.oceano)];
  const xr = sm(T.conocimientos5 - 0.3, T.conocimientos5 + 0.6, t), gk = sm(T.construccion5, T.construccion5 + 0.3, t), gr = sm(T.construccion5 + 0.3, T.construccion5 + 0.6, t);
  const K = seaShot(ctx, t, { cam, sx: 540, sy: 1180, ss: 800, state: 'calma', seed: 11, flow: 40, speed: 0.3, knarr: { sail: 1, billow: 0.6, crew: 0, cargo: false, xray: xr, glow: { keel: gk, ribs: gr * (1 - sm(T.naval5, T.naval5 + 0.3, t)), mast: sm(T.naval5 + 0.3, T.naval5 + 0.6, t) } } });
  const kc = camPt(cam, K.keelC), rb = camPt(cam, K.hull(-0.45, 0.55)), pl = camPt(cam, K.hull(0.62, 0.35)), mt = camPt(cam, K.mastTop), sl = camPt(cam, K.sailR);
  callout(ctx, kc[0], kc[1] - 6, 640, 1330, 'QUILLA', gk, C.oro);
  callout(ctx, rb[0], rb[1], 330, 1240, 'CUADERNAS', gr, C.blanco, 'right');
  callout(ctx, pl[0], pl[1], 760, 1180, 'TABLAS', sm(T.naval5, T.naval5 + 0.3, t), C.blanco);
  callout(ctx, mt[0], mt[1] + 60, 700, 530, 'MÁSTIL', sm(T.naval5 + 0.3, T.naval5 + 0.6, t), C.blanco);
  callout(ctx, sl[0] - 60, sl[1] + 140, 800, 650, 'VELA', sm(T.navegacion5, T.navegacion5 + 0.3, t), C.blanco);
  pill(ctx, 'INGENIERÍA NAVAL', 540, 270, 58, t, T.respuesta, C.oro, C.fondo);
  tag(ctx, 'reconstrucción de un knarr, barco mercante nórdico', 540, 380, 32, sm(T.respuesta + 0.4, T.respuesta + 0.8, t));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.inge, TB.oceano - TB.inge, 0.7); FX.revelar(k, T.conocimientos5 - 0.2); FX.etiqueta(k, T.construccion5); FX.etiqueta(k, T.construccion5 + 0.35); FX.etiqueta(k, T.naval5); FX.etiqueta(k, T.navegacion5); FX.madera(k, TB.inge + 0.4, 3, 0.7); } });

 // 5 · UN BARCO PARA EL ATLÁNTICO NORTE: travelling lateral; el tiempo empeora (lluvia, cielo oscuro, relámpago)
 B.push({ t0: TB.oceano, t1: TB.tablas, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const u = win(t, TB.oceano, TB.tablas), w = sm(T.dificiles - 0.4, T.dificiles + 0.8, t), cam = [470 + u * 160, 1010 + Math.sin(t * 0.9) * 14, 1.12, Math.sin(t * 0.7) * 0.012 * w];
  const fl = Math.max(0, 1 - Math.abs(t - (T.atlantico6 + 0.1)) * 5);
  seaShot(ctx, t, { cam, sx: 560, sy: 1130, ss: 720, state: w > 0.5 ? 'tormenta' : 'fresco', amp: 1 + 0.25 * w, sun: [880, 420], sunA: 1 - 0.8 * w, seed: 13, flow: 130, speed: 1, spray: 0.6 + 0.6 * w, knarr: { sail: 1, billow: 1, crew: 4 }, fogA: 0.2 + 0.3 * w, rain: 0.55 * w, flash: fl });
  pill(ctx, 'UN BARCO PARA EL OCÉANO', 540, 270, 52, t, T.embarcaciones6 - 0.1, C.oro, C.fondo, T.dificiles);
  pill(ctx, 'ATLÁNTICO NORTE: FRÍO, VIENTO Y OLAS', 540, 270, 44, t, T.dificiles, C.blanco, C.fondo);
  tag(ctx, 'knarr: casco ancho y hondo para carga y pasajeros', 540, 380, 32, sm(T.embarcaciones6, T.embarcaciones6 + 0.4, t) * (1 - sm(T.dificiles, T.dificiles + 0.3, t)));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.oceano, TB.tablas - TB.oceano, 1.2); FX.madera(k, TB.oceano + 0.5, 5, 1.1); FX.viento(k, T.dificiles - 0.3, TB.tablas - T.dificiles + 0.3, 1.3); FX.lluviaFuerte(k, T.dificiles, TB.tablas - T.dificiles + 0.2, 0.5); k.noise(T.atlantico6 + 0.2, { dur: 2.4, color: 'brown', filter: 'lowpass', f: 200, gain: 0.25, a: 0.04 }); FX.aparece(k, T.embarcaciones6); } });

 // 6 · TABLAS SUPERPUESTAS: del casco al corte; las tablas encajan una a una, se solapan y se remachan
 const overlapZoom = (ctx, cx, cy, r, t, a, rv) => { // lupa: dos tablas solapadas atravesadas por un remache con su arandela (rove)
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = '#13293a'; ctx.fill(); ctx.save(); ctx.clip();
  const th = r * 0.28; ctx.translate(cx, cy); ctx.rotate(-0.35);
  ctx.fillStyle = '#94683f'; ctx.fillRect(-r * 1.2, 0, r * 1.5, th); ctx.fillStyle = '#A4774F'; ctx.fillRect(-r * 0.2, -th + th * 0.15, r * 1.5, th); // tabla inferior / superior (solapa por fuera)
  ctx.strokeStyle = 'rgba(30,18,10,0.7)'; ctx.lineWidth = 3; ctx.strokeRect(-r * 1.2, 0, r * 1.5, th); ctx.strokeRect(-r * 0.2, -th + th * 0.15, r * 1.5, th);
  ctx.fillStyle = 'rgba(255,230,190,0.25)'; ctx.fillRect(-r * 0.2, -th + th * 0.15, r * 1.5, 4);
  if (rv > 0) { const e = E.out(cl(rv)); ctx.fillStyle = '#4a4540'; ctx.fillRect(r * 0.05 - 5, -th * 1.25 + (1 - e) * -r * 0.6, 10, th * 2.2); ctx.fillStyle = '#6a6560'; ctx.beginPath(); ctx.ellipse(r * 0.05, -th * 0.85 + th * 0.0 + (1 - e) * -r * 0.6, 18, 8, 0, 0, TAU); ctx.fill(); if (rv > 0.6) { ctx.fillStyle = '#5b5650'; ctx.fillRect(r * 0.05 - 16, th * 0.95, 32, 10); } }
  ctx.restore(); ctx.restore(); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.oro; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); ctx.restore(); };
 B.push({ t0: TB.tablas, t1: TB.flex, in: { type: 'zoom', d: 0.45, x: 540, y: 1100 }, draw(ctx, t) {
  const sw = sm(T.cascos + 0.4, T.tablas + 0.3, t);
  if (sw < 1) { ctx.save(); ctx.globalAlpha = 1 - sw; seaShot(ctx, t, { cam: [560, 1140, 2.2 + 0.5 * win(t, TB.tablas, T.tablas + 0.3)], sx: 540, sy: 1180, ss: 780, state: 'calma', seed: 14, flow: 40, knarr: { sail: 1, crew: 0, glow: { planks: sm(T.cascos, T.cascos + 0.3, t) } } }); ctx.restore(); }
  if (sw > 0) { ctx.save(); ctx.globalAlpha = sw; bgTech(ctx);
   const asm = 7 * sm(T.tablas, T.superpuestas + 0.5, t), rvt = 7 * win(t, T.unidas, T.unidas + 1.3), ass = sm(T.resistencia - 0.3, T.resistencia + 0.2, t), fx = sm(T.flexibilidad, T.flexibilidad + 0.4, t) * Math.sin((t - T.flexibilidad) * 3.2) * 0.55;
   const pts = P.clinkerSection(ctx, 540, 1320, 780, 600, t, { assemble: asm, rivets: rvt, glow: { overlap: sm(T.superpuestas, T.superpuestas + 0.3, t) * (1 - sm(T.unidas, T.unidas + 0.4, t)), keel: ass, rib: ass }, flex: fx });
   const ov = pts.overlaps[3] || [800, 900];
   overlapZoom(ctx, 790, 480, 150, t, sm(T.superpuestas, T.superpuestas + 0.4, t), win(t, T.unidas, T.unidas + 0.6));
   if (sm(T.superpuestas, T.superpuestas + 0.4, t) > 0) { ctx.save(); ctx.globalAlpha *= sm(T.superpuestas, T.superpuestas + 0.4, t); ctx.strokeStyle = C.oro; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(ov[0], ov[1]); ctx.lineTo(790 - 100, 480 + 112); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.arc(ov[0], ov[1], 26, 0, TAU); ctx.stroke(); ctx.restore(); }
   tag(ctx, 'cada tabla se solapa sobre la de abajo', 540, 680, 32, sm(T.superpuestas + 0.2, T.superpuestas + 0.5, t) * (1 - sm(T.unidas, T.unidas + 0.3, t)));
   tag(ctx, 'remache de hierro + arandela por dentro', 540, 680, 32, sm(T.unidas + 0.2, T.unidas + 0.5, t));
   callout(ctx, pts.keel[0], pts.keel[1] + 30, 330, 1370, 'QUILLA', ass, C.oro, 'right');
   callout(ctx, pts.rib[0] - 260, pts.rib[1], 70, 860, 'CUADERNA', ass, C.oro);
   ctx.restore(); }
  pill(ctx, 'TABLAS SUPERPUESTAS', 540, 270, 56, t, T.tablas, C.oro, C.fondo, T.resistencia);
  pill(ctx, 'RESISTENCIA', 320, 270, 48, t, T.resistencia, C.blanco, C.fondo);
  pill(ctx, 'FLEXIBILIDAD', 760, 270, 48, t, T.flexibilidad, C.oro, C.fondo);
  tag(ctx, 'corte transversal · casco trincado («clinker»)', 300, 360, 32, sm(T.tablas, T.tablas + 0.4, t) * (1 - sm(T.superpuestas, T.superpuestas + 0.3, t)));
  scrim(ctx);
 }, sfx(k) { FX.madera(k, TB.tablas, 2, 0.8); FX.revelar(k, T.tablas - 0.1); for (let i = 0; i < 7; i++) k.play('tock', T.tablas + (T.superpuestas + 0.5 - T.tablas) * (i + 0.6) / 7, { f: 300 + i * 20, gain: 0.35, minor: true }); FX.martillo(k, T.unidas + 0.1, 7, 1.3 / 7); FX.etiqueta(k, T.resistencia); FX.etiqueta(k, T.flexibilidad); FX.madera(k, T.flexibilidad, 2, 1); } });

 // 7 · FLEXIBILIDAD FRENTE A LAS OLAS: la ola pasa bajo el casco; el corte se deforma al mismo ritmo (poco)
 B.push({ t0: TB.flex, t1: TB.vela, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const ph = (t - TB.flex) * 2.2, fl = Math.sin(ph) * 0.55;
  seaShot(ctx, t, { cam: [560, 1060, 1.0], sx: 560, sy: 1150, ss: 640, state: 'tormenta', seed: 17, flow: 120, speed: 1, spray: 1, knarr: { sail: 1, billow: 1, crew: 4, flex: fl }, fogA: 0.3, rain: 0.25, sun: null });
  const a = sm(T.esto8 + 0.2, T.esto8 + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, 60, 330, 960, 470, 30, 'rgba(13,24,32,0.88)'); ctx.save(); ctx.beginPath(); ctx.rect(60, 330, 960, 470); ctx.clip();
   // ola esquemática que pasa por debajo, al mismo ritmo
   ctx.strokeStyle = C.agua; ctx.lineWidth = 6; ctx.beginPath(); for (let x = 80; x <= 1000; x += 10) { const y = 730 + Math.sin((x - 540) / 140 - ph) * 26; x === 80 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
   P.clinkerSection(ctx, 300, 700, 330, 300, t, { flex: fl, n: 6 });
   // casco de perfil sobre la ola (la quilla sigue la curva)
   P.knarr(ctx, 760, 690 + Math.sin(-ph) * 10, 380, t, { ang: Math.cos(-ph) * 0.07, sail: 0.05, crew: 0, cargo: false, flex: fl, roll: 0 });
   ctx.restore(); txt(ctx, 'el casco cede un poco y recupera su forma', 540, 375, 36, C.blanco, { w: 800 }); ctx.restore(); }
  pill(ctx, 'RESISTENCIA Y FLEXIBILIDAD', 540, 270, 48, t, T.esto8, C.oro, C.fondo);
  tag(ctx, 'la flexión real es pequeña: el casco no se dobla como goma', 540, 1340, 32, sm(T.olas8 - 0.2, T.olas8 + 0.2, t));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.flex, TB.vela - TB.flex, 1.5); FX.madera(k, TB.flex + 0.2, 4, 1.3); k.play('thud', T.olas8, { f: 60, gain: 0.4 }); FX.aparece(k, T.esto8); } });

 // 8 · LA FUERZA DEL VIENTO: nueva toma (de la aleta); la vela se iza, se llena y el barco acelera
 B.push({ t0: TB.vela, t1: TB.remos, in: { type: 'rise', d: 0.45 }, draw(ctx, t) {
  const up = sm(T.velas - 0.3, T.velas + 0.6, t), fill = sm(T.aprovechar, T.fuerza + 0.4, t);
  const cam = P.camAt([[TB.vela, 600, 740, 1.6], [T.velas + 0.6, 560, 860, 1.2], [TB.remos, 540, 950, 1.0]], t);
  seaShot(ctx, t, { cam, sx: 540, sy: 1150, ss: 720, state: 'fresco', seed: 19, flow: 30 + 160 * fill, speed: 0.2 + 0.8 * fill, sun: [860, 460], knarr: { sail: 0.05 + 0.95 * up, billow: 0.15 + 0.85 * fill, crew: 4 } });
  const a = sm(T.fuerza - 0.4, T.fuerza, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; for (let i = 0; i < 7; i++) { const y = 520 + i * 70, x = ((t * 420 + i * 230) % 1300) - 300; ctx.strokeStyle = 'rgba(244,247,247,0.85)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 150, y); ctx.lineTo(x + 128, y - 18); ctx.moveTo(x + 150, y); ctx.lineTo(x + 128, y + 18); ctx.stroke(); } ctx.restore(); callout(ctx, 220, 470, 260, 420, 'VIENTO', a, C.blanco); }
  pill(ctx, 'ENERGÍA DEL VIENTO', 540, 270, 56, t, T.velas, C.oro, C.fondo);
  tag(ctx, 'la vela cuadrada rinde mejor con viento de popa o de costado', 540, 1340, 32, sm(T.viento9, T.viento9 + 0.3, t));
  scrim(ctx);
 }, sfx(k) { FX.vela(k, T.velas - 0.1); FX.cuerdas(k, T.velas + 0.4); FX.viento(k, T.aprovechar - 0.2, TB.remos - T.aprovechar + 0.4, 1.5); FX.oleaje(k, TB.vela, TB.remos - TB.vela, 0.9); FX.aparece(k, T.velas); } });

 // 9 · LOS REMOS: vela recogida, cámara baja junto al casco; las palas entran al agua y empujan
 B.push({ t0: TB.remos, t1: TB.salto, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const ph = (t - TB.remos) * 0.62, oa = sm(T.desplazarse - 0.7, T.desplazarse - 0.1, t);
  const cam = P.camAt([[TB.remos, 720, 1140, 1.7], [TB.salto, 600, 1110, 1.45]], t);
  seaShot(ctx, t, { cam, sx: 540, sy: 1160, ss: 740, state: 'calma', seed: 21, flow: 30 + 60 * oa, speed: 0.2 + 0.4 * oa, knarr: { flip: true, sail: 0.02, crew: 5, oars: oa, oarN: 4, oarPhase: ph, glow: { oars: sm(T.remos, T.remos + 0.3, t) } }, after: (c, K) => { if (oa <= 0) return; K.oarTips.forEach((p, i) => { const dip = Math.cos(ph * TAU - i * 0.2); if (dip < -0.3) return; c.save(); c.globalAlpha = oa * 0.8; c.strokeStyle = '#eef5f5'; c.lineWidth = 3; for (let r = 0; r < 2; r++) { const u = ((ph + r * 0.5) % 1); c.globalAlpha = oa * 0.7 * (1 - u); c.beginPath(); c.ellipse(p[0], p[1] + 6, 14 + u * 60, 4 + u * 12, 0, 0, TAU); c.stroke(); } c.restore(); }); } });
  const ar = sm(T.remos - 0.2, T.remos + 0.3, t); if (ar > 0) { ctx.save(); ctx.globalAlpha *= ar; ctx.strokeStyle = C.oro; ctx.fillStyle = C.oro; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(600, 560); ctx.lineTo(320, 560); ctx.stroke(); ctx.beginPath(); ctx.moveTo(290, 560); ctx.lineTo(340, 530); ctx.lineTo(340, 590); ctx.closePath(); ctx.fill(); txt(ctx, 'AVANCE', 650, 562, 38, C.oro, { al: 'left' }); ctx.restore(); }
  pill(ctx, 'PROPULSIÓN CON REMOS', 540, 270, 54, t, T.desplazarse - 0.2, C.oro, C.fondo);
  tag(ctx, 'en el knarr, pocos remos: para maniobrar o sin viento', 540, 380, 32, sm(T.remos, T.remos + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.remo(k, T.desplazarse - 0.5, 4, 1 / 0.62, 1.1); FX.oleaje(k, TB.remos, TB.salto - TB.remos, 0.6); FX.aparece(k, T.desplazarse - 0.2); FX.flecha(k, T.remos - 0.2); } });

 // ---------------- MAPA GRANDE DEL ATLÁNTICO NORTE (rutas aproximadas, asentamientos documentados) ----------------
 const MAP = { x: 20, y: 210, w: 1040, h: 1180, lon0: -68, lon1: 20, lat0: 45, lat1: 84, latRef: 62 };
 const LEG1 = [[5.2, 61.0], [1, 61.6], [-4, 62.1], [-9, 63.3], [-13.3, 65.0]];
 const LEG2 = [[-24.6, 64.6], [-30, 63.5], [-38, 61.6], [-42.8, 59.3], [-45.4, 60.0], [-46.3, 60.65]];
 const LEG3 = [[-47.5, 60.9], [-50, 61.6], [-54, 63.6], [-60.5, 64.2], [-61.5, 61.5], [-59.8, 58], [-57.6, 55.4], [-55.2, 53], [-55.1, 52.1], [-55.45, 51.7]];
 const SITES = [[[-21.9, 64.15], 'ISLANDIA', 'asentamientos ≈ 870'], [[-46.3, 60.65], 'GROENLANDIA', 'asentamientos ≈ 985'], [[-55.53, 51.6], "L'ANSE AUX MEADOWS", 'asentamiento nórdico']];
 function mapShot(ctx, t, o = {}) {
  bgTech(ctx); const pr = P.northAtlantic(ctx, MAP.x, MAP.y, MAP.w, MAP.h, t, MAP);
  const lab = (ll, s, a, dy, c = C.blanco, px = 40) => { if (a <= 0) return; const p = pr(ll); ctx.save(); ctx.globalAlpha *= a; ctx.font = `900 ${px}px Nunito`; const tw = ctx.measureText(s).width, tx = cl(p[0], tw / 2 + 30, W - tw / 2 - 30); txt(ctx, s, tx, p[1] + dy, px, c, { w: 900 }); ctx.restore(); };
  const L = o.labels || {}; lab([12, 64], 'ESCANDINAVIA', L.e ?? 0, 0); lab([-18.5, 65], 'ISLANDIA', L.i ?? 0, -70); lab([-40, 74], 'GROENLANDIA', L.g ?? 0, 0, C.fondo); lab([-64, 56.5], 'AMÉRICA', L.a ?? 0, -20); lab([-64, 56.5], 'DEL NORTE', L.a ?? 0, 26);
  const rp = o.route || [0, 0, 0]; [LEG1, LEG2, LEG3].forEach((leg, i) => { if (rp[i] > 0) P.seaRoute(ctx, leg.map(pr), rp[i], t, { w: 8, shipS: 32, ship: rp[i] < 0.999, dash: [16, 12] }); });
  (o.sites || []).forEach((sa, i) => { if (sa <= 0) return; const [ll, s, sub] = SITES[i], p = pr(ll); ctx.save(); ctx.globalAlpha *= sa; ctx.translate(p[0], p[1]); ctx.rotate(Math.PI / 4); ctx.fillStyle = C.oro; ctx.fillRect(-13, -13, 26, 26); ctx.strokeStyle = C.fondo; ctx.lineWidth = 4; ctx.strokeRect(-13, -13, 26, 26); ctx.restore(); if (o.siteLabels) { const dy = i === 2 ? 70 : 60; tag(ctx, sub, cl(p[0], 230, 850), p[1] + dy, 30, sa); } });
  if (o.legend) { ctx.save(); ctx.globalAlpha *= o.legend; P.rr(ctx, 600, 240, 440, 140, 24, 'rgba(13,24,32,0.85)'); ctx.strokeStyle = C.oro; ctx.lineWidth = 7; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.moveTo(630, 285); ctx.lineTo(720, 285); ctx.stroke(); ctx.setLineDash([]); txt(ctx, 'ruta aproximada', 735, 287, 32, C.blanco, { al: 'left', w: 700 }); ctx.translate(675, 340); ctx.rotate(Math.PI / 4); ctx.fillStyle = C.oro; ctx.fillRect(-11, -11, 22, 22); ctx.setTransform(1, 0, 0, 1, 0, 0); txt(ctx, 'sitio documentado', 735, 342, 32, C.blanco, { al: 'left', w: 700 }); ctx.restore(); }
  ctx.save(); ctx.globalAlpha *= 0.9; txt(ctx, 'mapa simplificado · rutas esquemáticas', MAP.x + MAP.w - 20, MAP.y + MAP.h - 26, 28, 'rgba(244,247,247,0.85)', { al: 'right', w: 600 }); ctx.restore();
  return pr;
 }
 // ventana de paisaje sobre el océano del mapa (zona abierta al sur de Groenlandia)
 function vista(ctx, t, a, draw, label) { if (a <= 0) return; const x = 300, y = 960, w = 480, h = 330; ctx.save(); ctx.globalAlpha *= a; const sc = 0.55 + 0.45 * E.out(cl(a)); ctx.translate(x + w / 2, y + h / 2); ctx.scale(sc, sc); ctx.translate(-(x + w / 2), -(y + h / 2)); ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 24); ctx.clip(); ctx.translate(x, y); ctx.scale(w / 1080, w / 1080); ctx.translate(0, -560); draw(ctx); ctx.restore(); ctx.strokeStyle = 'rgba(244,247,247,0.85)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x, y, w, h, 24); ctx.stroke(); if (label) { P.rr(ctx, x + 14, y + 14, 300, 52, 26, 'rgba(13,24,32,0.85)'); txt(ctx, label, x + 164, y + 41, 30, C.oro, { w: 800 }); } ctx.restore(); }

 // 10 · LA REVELACIÓN DE LA RUTA: la cámara sube; el océano se convierte en el mapa del Atlántico Norte
 B.push({ t0: TB.salto, t1: TB.rutas, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  const m = sm(T.pero11 + 0.5, T.sorprendente + 0.3, t);
  if (m < 1) { ctx.save(); seaShot(ctx, t, { cam: [540, 900 - 260 * win(t, TB.salto, T.sorprendente), 1 / (1 + 2.2 * win(t, TB.salto, T.sorprendente))], sx: 540, sy: 1120, ss: 500, seed: 23, state: 'fresco', knarr: { sail: 1, crew: 3 } }); ctx.restore(); }
  if (m > 0) { ctx.save(); ctx.globalAlpha *= m; const z = 1.25 - 0.25 * E.out(m); ctx.translate(540, 800); ctx.scale(z, z); ctx.translate(-540, -800);
   mapShot(ctx, t, { labels: { e: sm(T.no12, T.no12 + 0.3, t), i: sm(T.cruzar12, T.cruzar12 + 0.3, t), g: sm(T.cruzar12 + 0.4, T.cruzar12 + 0.7, t), a: sm(T.sola - 0.3, T.sola, t) }, legend: sm(T.vez, T.vez + 0.4, t) }); ctx.restore(); }
  pill(ctx, 'PERO AQUÍ VIENE LO SORPRENDENTE', 540, 150, 40, t, T.pero11 + 0.2, C.blanco, C.fondo, T.no12);
  pill(ctx, '¡NO FUE UN SOLO SALTO!', 540, 150, 56, t, T.no12, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { k.play('riser', T.pero11, { dur: 1.6, gain: 0.3 }); FX.mapa(k, T.pero11 + 0.5); MUS.golpe(k, T.no12, { gain: 0.9 }); FX.etiqueta(k, T.no12 + 0.1); FX.etiqueta(k, T.cruzar12); FX.etiqueta(k, T.cruzar12 + 0.4); FX.etiqueta(k, T.sola); } });

 // 11-12 · ESCANDINAVIA → ISLANDIA → GROENLANDIA: rutas que avanzan, sitios documentados y ventanas de paisaje
 B.push({ t0: TB.rutas, t1: TB.america, in: { type: 'cut' }, draw(ctx, t) {
  const r1 = sm(T.escandinavia, T.islandia + 0.2, t), r2 = sm(T.despues14, T.groenlandia + 0.3, t);
  mapShot(ctx, t, { labels: { e: 1, i: 1, g: 1, a: 1 }, route: [r1, r2, 0], sites: [sm(T.islandia, T.islandia + 0.3, t), sm(T.asentamientos14, T.asentamientos14 + 0.3, t), 0], siteLabels: true, legend: 1 });
  const vI = sm(T.islandia - 0.2, T.islandia + 0.2, t) * (1 - sm(T.despues14 + 0.3, T.despues14 + 0.7, t));
  vista(ctx, t, vI, (c) => { seaShot(c, t, { hor: 880, sun: [820, 700], sx: 640, sy: 975, ss: 300, seed: 25, state: 'costa', coast: { kind: 'volcanica', h: 280, x0: -100, x1: 1200, seed: 6 }, knarr: { sail: 1, crew: 2 } }); }, 'COSTA DE ISLANDIA');
  const vG = sm(T.asentamientos14, T.asentamientos14 + 0.4, t);
  vista(ctx, t, vG, (c) => { seaShot(c, t, { hor: 870, sun: [200, 700], sx: 830, sy: 985, ss: 210, seed: 27, state: 'costa', coast: { kind: 'glaciar', h: 320, x0: -100, x1: 1200, seed: 11 }, knarr: { sail: 1, crew: 2 }, before: (cc) => { cc.fillStyle = '#5f7d4c'; cc.beginPath(); cc.moveTo(-100, 905); cc.quadraticCurveTo(250, 840, 600, 868); cc.lineTo(620, 880); cc.lineTo(-100, 915); cc.closePath(); cc.fill(); P.longhouse(cc, 200, 890, 190, 90, 40, t, { smoke: 1, seed: 2 }); P.longhouse(cc, 440, 874, 120, 60, 28, t, { seed: 3 }); } }); }, 'FIORDO DE GROENLANDIA');
  pill(ctx, 'ESCANDINAVIA → ISLANDIA', 540, 150, 48, t, T.escandinavia, C.oro, C.fondo, T.despues14);
  pill(ctx, 'ISLANDIA → GROENLANDIA', 540, 150, 48, t, T.despues14, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.mapa(k, T.escandinavia - 0.1); FX.flecha(k, T.escandinavia + 0.2, 2.5); FX.sello(k, T.islandia); FX.revelar(k, T.islandia - 0.2); FX.flecha(k, T.despues14 + 0.2, 2); FX.sello(k, T.asentamientos14); FX.oleaje(k, T.islandia - 0.3, 1.6, 0.5); FX.costa(k, T.asentamientos14, 2.4, 0.6); } });

 // 13 · HACIA AMÉRICA DEL NORTE: última etapa por la costa (sin cruzar tierra) y llegada entre la niebla
 B.push({ t0: TB.america, t1: TB.orienta, in: { type: 'cut' }, draw(ctx, t) {
  const r3 = sm(T.y15, T.expediciones + 1.0, t), sw = sm(T.expediciones + 1.0, T.expediciones + 1.25, t);
  if (sw < 1) { ctx.save(); ctx.globalAlpha = 1 - sw; const z = 1 + 0.6 * sm(T.expediciones + 0.6, T.expediciones + 1.4, t); ctx.translate(250, 1100); ctx.scale(z, z); ctx.translate(-250, -1100); mapShot(ctx, t, { labels: { e: 1, i: 1, g: 1, a: 1 }, route: [1, 1, r3], sites: [1, 1, sm(T.expediciones + 0.8, T.expediciones + 1.0, t)], legend: 1 }); ctx.restore(); pill(ctx, 'GROENLANDIA → AMÉRICA', 540, 150, 48, t, T.y15, C.oro, C.fondo); }
  if (sw > 0) { ctx.save(); ctx.globalAlpha = sw; const u = win(t, T.expediciones + 0.9, TB.orienta);
   seaShot(ctx, t, { cam: [540, 1000, 1.1 + 0.15 * u], sx: 640 - 120 * u, sy: 1180, ss: 560, state: 'costa', sky: ['#7b95a3', '#c9d6dc'], sun: [300, 560], sunA: 0.5, seed: 29, flow: 60, fogA: 0.9 - 0.5 * u, coast: { kind: 'baja', h: 120, c: '#4e5f52', seed: 21 }, knarr: { flip: true, sail: 1, billow: 0.7, crew: 4 } });
   pill(ctx, 'AMÉRICA DEL NORTE', 540, 270, 58, t, T.costas15 - 0.2, C.oro, C.fondo);
   tag(ctx, 'tierras habitadas desde hacía milenios por pueblos indígenas', 540, 380, 32, sm(T.america15, T.america15 + 0.4, t));
   ctx.restore(); }
  scrim(ctx);
 }, sfx(k) { FX.flecha(k, T.y15 + 0.2, 2.2); FX.descubrir(k, T.costas15 - 0.2); FX.costa(k, T.expediciones + 1, TB.orienta - T.expediciones - 0.8, 1); FX.aparece(k, T.costas15 - 0.2); MUS.golpe(k, T.america15, { gain: 0.7, chord: ['F3', 'C4', 'F4', 'A4'] }); } });

 // 14-15 · ¿CÓMO SE ORIENTABAN?: el navegante observa; cada observación tiene su propio momento y su rótulo
 const deck = (ctx) => { ctx.save(); ctx.fillStyle = '#4a3020'; ctx.beginPath(); ctx.moveTo(-50, 1200); ctx.quadraticCurveTo(540, 1160, 1130, 1200); ctx.lineTo(1130, 1262); ctx.quadraticCurveTo(540, 1222, -50, 1262); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,225,185,0.25)'; ctx.fillRect(-50, 1192, W + 100, 4);
  const g = ctx.createLinearGradient(0, 1250, 0, HH); g.addColorStop(0, '#6b4a33'); g.addColorStop(1, '#2e1f15'); ctx.fillStyle = g; ctx.fillRect(-50, 1250, W + 100, HH - 1250);
  ctx.strokeStyle = 'rgba(25,15,8,0.55)'; ctx.lineWidth = 3; for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 40, 1255); ctx.lineTo(540 + i * 170, HH); ctx.stroke(); } ctx.restore(); };
 B.push({ t0: TB.orienta, t1: TB.conoc, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const ph = (a, b) => sm(a - 0.25, a + 0.15, t) * (1 - sm(b - 0.2, b + 0.1, t));
  const pSol = ph(T.sol, T.estrellas), pEst = ph(T.estrellas, T.vientos), pVie = ph(T.vientos, T.condiciones17), pMar = sm(T.condiciones17 - 0.25, T.condiciones17 + 0.15, t);
  const nt = pEst, sunY = lerp(760, 540, win(t, TB.orienta, T.sol + 0.4));
  seaShot(ctx, t, { hor: 1000, cam: [540, 960, 1], sun: [820, sunY], sunA: 1 - nt, sky: nt > 0.5 ? ['#0b1626', '#24384a'] : ['#5f8aa0', '#e2cfa8'], state: pMar > 0 ? 'fresco' : 'calma', seed: 31, flow: 50, knarr: false, night: nt, clouds: 6 });
  deck(ctx);
  const look = sm(T.como16, T.como16 + 0.6, t), N = P.navigator(ctx, 330, 1720, 900, t, { look, turn: nt * -0.4, wind: 0.4 + 0.6 * pVie, rim: 1 - nt * 0.7 });
  // SOL: arco de su recorrido y su altura sobre el horizonte
  if (pSol > 0) { ctx.save(); ctx.globalAlpha *= pSol; ctx.strokeStyle = C.oro; ctx.lineWidth = 5; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.arc(820, 1000, 460, Math.PI * 1.08, Math.PI * 1.5); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(820, 1000); ctx.lineTo(820, sunY + 70); ctx.stroke(); ctx.restore(); callout(ctx, 800, sunY + 60, 640, 400, 'SOL: altura y rumbo', pSol, C.oro, 'right'); }
  // ESTRELLAS: constelación resaltada sobre el cielo nocturno
  if (pEst > 0) { ctx.save(); ctx.globalAlpha *= pEst; const st = [[620, 360], [700, 330], [780, 360], [840, 420], [900, 470]]; ctx.strokeStyle = 'rgba(244,247,247,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); st.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); st.forEach((p) => { P.glow(ctx, p[0], p[1], 30, '240,246,255', 0.6); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, TAU); ctx.fill(); }); ctx.restore(); callout(ctx, 700, 340, 560, 520, 'ESTRELLAS', pEst, C.blanco, 'right'); }
  // VIENTO: rachas y la capa que se mueve
  if (pVie > 0) { ctx.save(); ctx.globalAlpha *= pVie; for (let i = 0; i < 6; i++) { const y = 560 + i * 70, x = ((t * 420 + i * 260) % 1400) - 300; ctx.strokeStyle = 'rgba(244,247,247,0.85)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 140, y); ctx.lineTo(x + 118, y - 16); ctx.moveTo(x + 140, y); ctx.lineTo(x + 118, y + 16); ctx.stroke(); } ctx.restore(); callout(ctx, 760, 700, 760, 470, 'VIENTO: dirección y fuerza', pVie, C.blanco, 'right'); }
  // MAR: oleaje de fondo (mar de leva) que indica de dónde viene
  if (pMar > 0) { ctx.save(); ctx.globalAlpha *= pMar; ctx.strokeStyle = C.agua; ctx.lineWidth = 7; for (let i = 0; i < 4; i++) { const x = 560 + i * 120, y = 1080 + (i % 2) * 40; ctx.beginPath(); ctx.moveTo(x - 60, y); ctx.quadraticCurveTo(x, y - 36, x + 60, y); ctx.stroke(); } ctx.restore(); callout(ctx, 760, 1070, 760, 900, 'MAR: oleaje y color', pMar, C.agua, 'right'); }
  pill(ctx, '¿CÓMO SE ORIENTABAN?', 540, 200, 54, t, T.como16, C.oro, C.fondo, T.obs17);
  pill(ctx, 'OBSERVACIÓN DEL ENTORNO', 540, 200, 48, t, T.obs17, C.oro, C.fondo);
  tag(ctx, 'sin brújula magnética ni GPS', 540, 310, 34, sm(T.instrumentos, T.instrumentos + 0.3, t) * (1 - sm(T.sol - 0.4, T.sol - 0.1, t)));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.orienta, TB.conoc - TB.orienta, 0.6); FX.pasos(k, TB.orienta + 0.2, 3); FX.madera(k, TB.orienta + 1.5, 2, 0.6); FX.aparece(k, T.como16); FX.etiqueta(k, T.sol); FX.campana(k, T.estrellas); FX.viento(k, T.vientos - 0.2, 2.2, 1.2); FX.etiqueta(k, T.vientos); FX.etiqueta(k, T.condiciones17); } });

 // 16 · CONOCIMIENTO DE LAS RUTAS: mapa ampliado con referencias costeras (nombres de las sagas)
 B.push({ t0: TB.conoc, t1: TB.prueba, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  bgTech(ctx); const Z = { lon0: -68, lon1: -12, lat0: 49, lat1: 70, latRef: 60 }; const pr = P.northAtlantic(ctx, 20, 220, 1040, 1160, t, Z);
  P.seaRoute(ctx, [...LEG2, ...LEG3.slice(1)].map(pr), sm(T.tambien18, T.rutas + 0.6, t), t, { w: 8, shipS: 32, dash: [16, 12] });
  const marks = [[[-23.8, 64.8], 'glaciar visible desde el mar', T.costas18, [700, 470]], [[-43.9, 59.8], 'cabo sur de Groenlandia', T.costas18 + 0.35, [610, 1060]], [[-63, 66.5], 'Helluland: costa de piedras planas', T.puntos, [380, 330]], [[-60.5, 55.5], 'Markland: costa boscosa', T.referencia - 0.2, [430, 1180]]];
  marks.forEach(([ll, s, t0, lp]) => { const a = sm(t0 - 0.1, t0 + 0.3, t); if (a <= 0) return; const p = pr(ll); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.oro; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(p[0], p[1], 24, 0, TAU); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lp[0], lp[1]); ctx.stroke(); ctx.restore(); tag(ctx, s, lp[0], lp[1], 30, a); });
  pill(ctx, 'EXPERIENCIA Y CONOCIMIENTO', 540, 150, 50, t, T.tambien18, C.oro, C.fondo);
  tag(ctx, 'mapa explicativo: los vikingos no usaban cartas así · nombres según las sagas', 540, 1330, 30, sm(T.acumulados, T.acumulados + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.mapa(k, TB.conoc + 0.1); FX.flecha(k, T.tambien18 + 0.3, 3); FX.etiqueta(k, T.costas18); FX.etiqueta(k, T.costas18 + 0.35); FX.etiqueta(k, T.puntos); FX.etiqueta(k, T.referencia - 0.2); } });

 // 17-18 · L'ANSE AUX MEADOWS: costa de Terranova, casas largas de madera y turba → restos excavados
 const meadows = (ctx, t, ruin, o = {}) => {
  P.seaHD(ctx, t, { hor: 800, sky: ['#7fa2b5', '#d3e0e4'], sun: [860, 520], sunA: 0.7, mood: 'calma', amp: 0.6, seed: 33, x0: -700, x1: 1800, clouds: 8 });
  P.coast(ctx, 802, t, { kind: 'baja', h: 80, c: '#4e5f52', x0: -700, x1: 1800, seed: 30 });
  // terreno irregular en capas (lomas), playa y ciénaga
  const layer = (y0, amp, c, seed) => { const R = H.rng(seed); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-700, 2400); for (let x = -700; x <= 1800; x += 50) ctx.lineTo(x, y0 + Math.sin(x * 0.006 + seed) * amp + Math.sin(x * 0.017 + seed * 2) * amp * 0.4); ctx.lineTo(1800, 2400); ctx.closePath(); ctx.fill(); };
  ctx.fillStyle = 'rgba(214,201,160,0.9)'; ctx.fillRect(-700, 800, 2500, 60); layer(850, 14, '#6d8c56', 1); layer(960, 22, '#5f7d4c', 2); layer(1180, 30, '#56723f', 3);
  const g = ctx.createLinearGradient(0, 900, 0, 1900); g.addColorStop(0, 'rgba(48,66,44,0)'); g.addColorStop(1, 'rgba(38,52,34,0.75)'); ctx.fillStyle = g; ctx.fillRect(-700, 900, 2500, 1500);
  // senderos de tierra entre las casas
  ctx.strokeStyle = 'rgba(140,112,78,0.75)'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-200, 1500); ctx.quadraticCurveTo(260, 1300, 470, 1110); ctx.quadraticCurveTo(600, 1010, 820, 980); ctx.stroke(); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(470, 1110); ctx.quadraticCurveTo(700, 1150, 950, 1130); ctx.stroke();
  const R = H.rng(5); ctx.strokeStyle = 'rgba(160,190,115,0.55)'; ctx.lineWidth = 2; for (let i = 0; i < 220; i++) { const x = R.range(-600, 1700), y = R.range(880, 1900); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + R.range(-4, 4), y - R.range(6, 18)); ctx.stroke(); }
  // casas largas (bases apoyadas en el terreno), de fondo a primer plano
  P.longhouse(ctx, 820, 985, 300, 120, 52, t, { ruin, smoke: ruin < 0.5 ? 1 : null, seed: 7, glow: o.glow, door: 0.6 });
  P.longhouse(ctx, 980, 1135, 260, 110, 50, t, { ruin, seed: 8, glow: o.glow });
  P.longhouse(ctx, 330, 1210, 470, 180, 78, t, { ruin, seed: 9, glow: o.glow, door: 0.3 });
  if (ruin < 0.6) { ctx.save(); ctx.globalAlpha *= 1 - ruin / 0.6;
   // trabajo: pila de leña, barca varada y dos personas
   ctx.fillStyle = 'rgba(25,35,20,0.45)'; ctx.beginPath(); ctx.ellipse(790, 1262, 90, 14, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#5d3d29'; ctx.fillRect(712, 1196, 150, 62); for (let i = 0; i < 8; i++) { const lx = 730 + (i % 4) * 38 + (Math.floor(i / 4) % 2) * 19, ly = 1240 - Math.floor(i / 4) * 30; if (lx > 860) continue; ctx.fillStyle = '#7a5a3a'; ctx.beginPath(); ctx.arc(lx, ly, 17, 0, TAU); ctx.fill(); ctx.fillStyle = '#c49a68'; ctx.beginPath(); ctx.arc(lx, ly, 11, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(110,72,40,0.7)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(lx, ly, 6, 0, TAU); ctx.stroke(); }
   P.knarr(ctx, 140, 846, 210, t, { sail: 0, crew: 0, cargo: false, ang: -0.03 });
   P.norse(ctx, 590, 1320, 150, t * 0.5, { pose: 'walk', cloak: '#6b4a35' }); P.norse(ctx, 680, 1300, 140, 0, { pose: 'stand' }); ctx.restore(); }
 };
 B.push({ t0: TB.prueba, t1: TB.lanse, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  const u = win(t, TB.prueba, TB.lanse);
  if (u < 0.6) seaShot(ctx, t, { cam: [540, 1000, 1 + 0.5 * win(t, TB.prueba, TB.prueba + 2.4)], hor: 900, sun: [860, 620], sunA: 0.7, state: 'costa', seed: 35, sx: 540, sy: 1220, ss: 440, coast: { kind: 'baja', h: 130, c: '#4e5f52', seed: 30 }, knarr: { sail: 1, crew: 3 } });
  const m = sm(0.5, 0.7, u); if (m > 0) { ctx.save(); ctx.globalAlpha = m; ctx.save(); P.camApply(ctx, [560, 1080, 1.45 - 0.25 * u]); meadows(ctx, t, 0); ctx.restore(); ctx.restore(); }
  pill(ctx, '¡EXISTE EVIDENCIA ARQUEOLÓGICA!', 540, 270, 46, t, T.prueba - 0.1, C.oro, C.fondo);
  scrim(ctx);
 }, sfx(k) { FX.costa(k, TB.prueba, TB.lanse - TB.prueba, 0.8); MUS.golpe(k, T.arqueologica, { gain: 0.8 }); FX.revelar(k, T.prueba); } });
 B.push({ t0: TB.lanse, t1: TB.ano, in: { type: 'cut' }, draw(ctx, t) {
  const ruin = sm(T.restos - 0.3, T.restos + 0.9, t);
  ctx.save(); P.camApply(ctx, P.camAt([[TB.lanse, 560, 1080, 1.2], [TB.ano, 540, 1120, 1.02]], t)); meadows(ctx, t, ruin, { glow: sm(T.asentamiento21, T.asentamiento21 + 0.3, t) * 0.9 }); ctx.restore();
  pill(ctx, "L'ANSE AUX MEADOWS", 540, 250, 56, t, T.lanse, C.oro, C.fondo);
  pill(ctx, 'TERRANOVA · CANADÁ', 540, 360, 44, t, T.terranova, C.blanco, C.fondo);
  tag(ctx, ruin < 0.5 ? 'reconstrucción moderna basada en las excavaciones' : 'evidencia original: bases de muros de turba excavadas', 540, 470, 32, sm(T.lanse + 0.4, T.lanse + 0.8, t));
  tag(ctx, 'un pequeño enclave, no una ciudad', 540, 1340, 34, sm(T.nordico21 - 0.3, T.nordico21 + 0.1, t));
  scrim(ctx);
 }, sfx(k) { FX.costa(k, TB.lanse, TB.ano - TB.lanse, 0.6); FX.aparece(k, T.lanse); FX.etiqueta(k, T.terranova); FX.tiempo(k, T.restos - 0.3, 1.2, 0.8); FX.etiqueta(k, T.nordico21 - 0.3); } });

 // 19 · EL AÑO 1021: pieza de madera del yacimiento → anillos → pico de radiocarbono (993) → conteo hasta la corteza → 1021
 B.push({ t0: TB.ano, t1: TB.linea, in: { type: 'zoom', d: 0.45, x: 540, y: 900 }, draw(ctx, t) {
  bgTech(ctx);
  const sw = sm(T.identificaron - 0.2, T.identificaron + 0.4, t);
  if (sw < 1) { ctx.save(); ctx.globalAlpha *= 1 - sw; P.timber(ctx, 560, 800, 820, 170, t, { glowEnd: sm(T.investigadores + 0.4, T.investigadores + 0.8, t) }); ctx.restore(); callout(ctx, 600, 760, 760, 560, 'cortes de hoja de metal', sm(T.investigadores, T.investigadores + 0.3, t) * (1 - sw), C.blanco); tag(ctx, 'madera trabajada hallada en el yacimiento', 540, 1080, 32, sm(TB.ano + 0.2, TB.ano + 0.6, t) * (1 - sw)); }
  if (sw > 0) { ctx.save(); ctx.globalAlpha *= sw;
   const hi = sm(T.actividad - 0.2, T.actividad + 0.2, t), cnt = win(t, T.actividad + 0.5, T.n1021 - 0.05);
   const RG = P.treeRings(ctx, 400, 760, 330, t, { n: 46, hi: hi > 0 ? 28 : null, count: cnt, cut: 1, seed: 12 });
   // gráfico de radiocarbono por anillo: el pico marca el año 993
   const ga = sm(T.actividad - 0.3, T.actividad + 0.1, t); if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; P.rr(ctx, 760, 520, 290, 300, 22, 'rgba(13,24,32,0.85)'); txt(ctx, 'carbono-14', 905, 556, 30, C.blanco, { w: 800 }); for (let i = 0; i < 12; i++) { const v = i === 6 ? 1 : 0.22 + 0.08 * Math.sin(i * 1.7); ctx.fillStyle = i === 6 ? C.oro : 'rgba(167,200,212,0.75)'; ctx.fillRect(785 + i * 21, 790 - v * 190, 15, v * 190); } txt(ctx, '993', 785 + 6 * 21 + 7, 600 - 4, 30, C.oro, { w: 900 }); ctx.restore(); }
   const p0 = RG.at(28, 2.4); callout(ctx, p0[0], p0[1], 90, 1140, 'anillo del año 993', hi, C.oro);
   if (cnt > 0 && t < T.n1021 - 0.1) tag(ctx, 'contando anillos hasta la corteza…', 700, 1220, 32, 1);
   const fa = sm(T.n1021 - 0.15, T.n1021 + 0.15, t); if (fa > 0) { const pb = RG.at(0, -0.55); ctx.save(); ctx.globalAlpha *= fa; P.rr(ctx, 600, 980, 440, 150, 30, 'rgba(13,24,32,0.9)'); txt(ctx, 'AÑO DE TALA', 820, 1020, 32, C.blanco); txt(ctx, '1021', 820, 1080, 70, C.oro, { w: 900 }); ctx.strokeStyle = C.oro; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(pb[0], pb[1]); ctx.lineTo(640, 1000); ctx.stroke(); ctx.restore(); }
   ctx.restore(); }
  pill(ctx, 'AÑO 1021', 540, 250, 70, t, T.n1021 - 0.1, C.oro, C.fondo);
  tag(ctx, 'tormenta solar de 993: dejó una señal de radiocarbono en los árboles de todo el mundo', 540, 1320, 30, sm(T.actividad, T.actividad + 0.4, t) * (1 - sm(T.n1021, T.n1021 + 0.3, t)));
  tag(ctx, 'confirma actividad nórdica en 1021; no fecha la primera llegada', 540, 1320, 30, sm(T.n1021 + 0.1, T.n1021 + 0.5, t));
  scrim(ctx);
 }, sfx(k) { FX.revelar(k, TB.ano + 0.2); k.play('thud', T.investigadores, { f: 120, gain: 0.3 }); FX.etiqueta(k, T.investigadores); k.play('whoosh', T.identificaron - 0.2, { dur: 0.5, top: 1800, gain: 0.3, minor: true }); FX.etiqueta(k, T.actividad); for (let i = 0; i < 10; i++) k.play('tick', T.actividad + 0.5 + i * (T.n1021 - T.actividad - 0.6) / 10, { f: 2200, gain: 0.25, minor: true }); MUS.golpe(k, T.n1021, { gain: 0.9 }); FX.sello(k, T.n1021); } });

 // 20 · 470 AÑOS ANTES DE COLÓN: línea temporal 1000 → 1500
 B.push({ t0: TB.linea, t1: TB.mas, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  bgTech(ctx); const sp = sm(T.n470 - 0.2, T.n470 + 1.4, t);
  P.timeline(ctx, 110, 970, 1000, t, { from: 1000, to: 1500, step: 100, p: sm(TB.linea, T.aprox, t), px: 34, marks: [{ v: 1021, label: '1021', sub: 'presencia nórdica', a: sm(T.eso23, T.eso23 + 0.3, t), up: true }, { v: 1492, label: '1492', sub: 'primer viaje de Colón', c: C.blanco, a: sm(T.colon23 - 0.3, T.colon23, t), up: false }], span: [1021, 1492], spanP: sp });
  if (sp > 0) { txt(ctx, sp < 1 ? '…' : '471', 540, 620, 200, C.oro, { w: 900 }); txt(ctx, 'AÑOS DE DIFERENCIA', 540, 760, 50, C.blanco); }
  pill(ctx, '≈ 470 AÑOS ANTES', 540, 250, 56, t, T.n470 - 0.1, C.oro, C.fondo);
  tag(ctx, '1492 − 1021 = 471 ≈ «470 años»', 540, 1320, 34, sm(T.america23, T.america23 + 0.4, t));
  scrim(ctx);
 }, sfx(k) { FX.flecha(k, TB.linea + 0.2, 1.4); FX.aparece(k, T.eso23); k.play('riser', T.n470 - 0.2, { dur: 1.6, gain: 0.25 }); FX.aparece(k, T.colon23 - 0.2, 400); FX.sello(k, T.n470 + 1.4); } });

 // 21 · MÁS QUE GUERREROS: el knarr con carga entra a un fiordo (comercio y navegación)
 B.push({ t0: TB.mas, t1: TB.final, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const cam = P.camAt([[TB.mas, 640, 1080, 1.35], [TB.final, 560, 1040, 1.15]], t);
  seaShot(ctx, t, { cam, sx: 560, sy: 1180, ss: 660, state: 'calma', sun: [820, 540], seed: 37, flow: 50, coast: { kind: 'fiordo', h: 260, x0: -2400, x1: 700, seed: 15 }, knarr: { sail: 1, billow: 0.7, crew: 4, cargo: true } });
  const lab = [['GUERREROS', T.guerreros, 0.5, 220], ['COMERCIANTES', T.comerciantes, 1, 540], ['NAVEGANTES', T.comerciantes + 0.5, 1, 860]];
  lab.forEach(([s, t0, al, x]) => { const a = sm(t0 - 0.15, t0 + 0.15, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a * al; P.rr(ctx, x - 160, 250, 320, 90, 45, s === 'GUERREROS' ? 'rgba(13,24,32,0.8)' : C.oro); txt(ctx, s, x, 296, 34, s === 'GUERREROS' ? C.blanco : C.fondo); ctx.restore(); });
  tag(ctx, 'llevaban carga y pasajeros entre asentamientos', 540, 400, 32, sm(T.comerciantes + 0.3, T.comerciantes + 0.6, t));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.mas, TB.final - TB.mas, 0.7); FX.etiqueta(k, T.guerreros); FX.etiqueta(k, T.comerciantes); FX.etiqueta(k, T.comerciantes + 0.5); FX.cuerdas(k, TB.mas + 0.8); } });

 // 22-23 · FINAL: el knarr navega hacia la costa al atardecer; la cámara sube; cierre limpio y discreto
 const finale = (ctx, t) => { const cam = P.camAt([[TB.final, 600, 1110, 1.45], [T.continente, 560, 980, 1.0], [DURATION, 560, 900, 0.82]], t);
  seaShot(ctx, t, { cam, sx: 560, sy: 1150, ss: 620, state: 'fresco', amp: 0.8, sun: [300, 640], sky: ['#5d86a0', '#f0c99a'], seed: 41, flow: 90, speed: 0.9, coast: { kind: 'baja', h: 170, c: '#4a5a4e', x0: -1400, x1: 3500, seed: 22 }, fogA: 0.15, knarr: { sail: 1, billow: 0.95, crew: 4 } });
  P.glow(ctx, 300, 560, 900, '255,200,140', 0.14); };
 B.push({ t0: TB.final, t1: TB.cierre, in: { type: 'fade', d: 0.45 }, draw(ctx, t) {
  finale(ctx, t);
  pill(ctx, 'NAVEGANTES', 540, 270, 56, t, T.navegantes25 - 0.1, C.oro, C.fondo, T.continente);
  pill(ctx, 'LLEGARON A AMÉRICA', 540, 250, 56, t, T.continente, C.oro, C.fondo);
  pill(ctx, 'HACE MIL AÑOS', 540, 360, 52, t, T.continente + 0.3, C.blanco, C.fondo);
  tag(ctx, 'siglos antes de los grandes viajes europeos de exploración', 540, 470, 32, sm(T.siglos + 0.3, T.siglos + 0.7, t));
  scrim(ctx);
 }, sfx(k) { FX.oleaje(k, TB.final, DURATION - TB.final, 0.9); FX.viento(k, TB.final, 3, 0.8); FX.aparece(k, T.navegantes25); FX.descubrir(k, T.continente); MUS.golpe(k, T.exploracion, { gain: 0.8 }); } });
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'cut' }, draw(ctx, t) {
  finale(ctx, t);
  const a = sm(T.sigue, T.sigue + 0.6, t);
  if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(244,247,247,0.75)'; ctx.lineWidth = 2; const lw = 280 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 300); ctx.lineTo(540 + lw, 300); ctx.moveTo(540 - lw, 420); ctx.lineTo(540 + lw, 420); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 362, 64, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
  scrim(ctx);
 }, sfx(k) { k.play('whoosh', T.sigue, { dur: 0.8, top: 1200, gain: 0.25, minor: true }); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.asombroteca + 1.2); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['vikingos', 'América', 'Colón', 'Atlántico', 'barcos', 'madera', 'construcción', 'naval', 'tablas', 'superpuestas', 'flexibilidad', 'olas', 'velas', 'viento', 'remos', 'Escandinavia', 'Islandia', 'Groenlandia', 'Sol', 'estrellas', 'arqueológica', "L'Anse", 'aux', 'Meadows', 'Terranova', '1021', '470', 'navegantes', 'continente', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 420, gain: 0.03, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   const Dm = [['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3'], ['C2', 'G2', 'C3', 'E3'], ['A1', 'E2', 'A2', 'C#3']];
   const Dor = [['D2', 'A2', 'D3', 'F3'], ['C2', 'G2', 'C3', 'E3'], ['G1', 'D2', 'G2', 'B2'], ['D2', 'A2', 'D3', 'F3']];
   const Up = [['F2', 'C3', 'F3', 'A3'], ['C2', 'G2', 'C3', 'E3'], ['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3']];
   MUS.epica(k, 0, TB.inge, { bpm: 72, chords: Dm, gain: 1, drums: 0.55, strings: 1, ostinato: 0.4 });
   MUS.epica(k, TB.inge, TB.salto, { bpm: 84, chords: Dor, gain: 0.85, drums: 0.35, strings: 0.8, ostinato: 0.8 });
   MUS.epica(k, TB.salto, TB.orienta, { bpm: 88, chords: Up, gain: 0.95, drums: 0.7, strings: 1, ostinato: 1 });
   MUS.epica(k, TB.orienta, TB.prueba, { bpm: 66, chords: Dor, gain: 0.8, drums: 0, strings: 0.9, ostinato: 0.4 });
   MUS.epica(k, TB.prueba, TB.mas, { bpm: 76, chords: Dm, gain: 0.85, drums: 0.4, strings: 1, ostinato: 0.6 });
   MUS.epica(k, TB.mas, T.sigue, { bpm: 80, chords: [['F2', 'C3', 'F3', 'A3'], ['C2', 'G2', 'C3', 'E3'], ['A#1', 'F2', 'A#2', 'D3'], ['D2', 'A2', 'D3', 'F#3']], gain: 1, drums: 0.8, strings: 1, ostinato: 0.8 });
   MUS.epica(k, T.sigue, DURATION, { bpm: 60, chords: [['D2', 'A2', 'D3', 'F#3']], gain: 0.9, drums: 0, strings: 1, ostinato: 0 }); // resolución final en re mayor
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
