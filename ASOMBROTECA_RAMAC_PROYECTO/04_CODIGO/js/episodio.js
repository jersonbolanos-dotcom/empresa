// =====================================================================================================
// episodio.js — «El primer disco duro era una máquina gigantesca» · Serie «La evolución del almacenamiento» · Ep. 02
// Asombroteca · PLANTILLA v1.19 (módulo de almacenamiento).
// Transformación continua: microSD en la yema del dedo → 1956 → IBM 305 RAMAC y su unidad de discos IBM 350 (modelo 3D único, cm)
// → 50 discos de 61 cm sobre un eje → solo ≈ 3,75 MB → foto de ejemplo de 5 MB → recubrimiento magnético → carro y brazo
// de acceso → escribir / leer → mismo principio general que un HDD → miniaturización → memoria flash (celdas, sin discos)
// → de una sala a la punta de un dedo → disquete → Asombroteca. Reloj = voz original. Determinista (H.rng). Fuentes en FUENTES.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS, C = P.RM, R3 = P.R350;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  miles: wt(0, 'miles'), una: wt(0, 'uña'), y1956: wt(1, '1956'), megabytes1: wt(1, 'megabytes'), maquina1: wt(1, 'máquina'), tonelada: wt(1, 'tonelada'),
  como2: SG(2).s, todo3: SG(3).s, tecnologia3: wt(3, 'tecnología'), revoluciono: wt(3, 'revolucionó'), ibm: wt(4, 'ibm'), ramac: wt(4, 'ramac'),
  y5: SG(5).s, n50: wt(5, '50'), discos5: wt(5, 'discos'), giraban: wt(5, 'giraban'), cada6: SG(6).s, n60: wt(6, '60'), diametro: wt(6, 'diámetro'),
  pero7: SG(7).s, sorprendente: wt(7, 'sorprendente'), todo8: SG(8).s, equivalente: wt(8, 'equivalente'), n4: wt(8, '4'), actuales: wt(8, 'actuales'),
  para9: SG(9).s, fotografias9: wt(9, 'fotografías'), celular: wt(9, 'celular'), espacio9: wt(9, 'espacio'),
  pero10: SG(10).s, guardaba: wt(10, 'guardaba'), los11: SG(11).s, cubiertos: wt(11, 'cubiertos'), material: wt(11, 'material'), magnetico: wt(11, 'magnético'),
  un12: SG(12).s, mecanismo: wt(12, 'mecanismo'), movia: wt(12, 'movía'), cabezas: wt(12, 'cabezas'), escribir: wt(12, 'escribir'), leer: wt(12, 'leer'), superficies: wt(12, 'superficies'),
  era13: SG(13).s, principio: wt(13, 'principio'), duros: wt(13, 'duros'), decadas: wt(13, 'décadas'),
  con14: SG(14).s, reducir: wt(14, 'reducir'), componentes: wt(14, 'componentes'), almacenar14: wt(14, 'almacenar'), espacios: wt(14, 'espacios'), menores: wt(14, 'menores'),
  despues: SG(15).s, memorias15: wt(15, 'memorias'), flash: wt(15, 'flash'), sin15: wt(15, 'sin'), giratorios: wt(15, 'giratorios'),
  y16: SG(16).s, gigantescas: wt(16, 'gigantescas'), diminutas: wt(16, 'diminutas'), enormes16: wt(16, 'enormes'),
  lo17: SG(17).s, entera: wt(17, 'entera'), hoy17: wt(17, 'hoy'), punta: wt(17, 'punta'), dedo: wt(17, 'dedo'),
  conoces: SG(18).s, disquetes: wt(18, 'disquetes'), comparte: SG(19).s, asombroteca: wt(19, 'asombroteca'), tecnologia19: wt(19, 'tecnología'), end: A.speech_end,
 };
 const TB = { b2: T.y1956 - 0.45, b3: T.como2 - 0.2, b4: T.todo3 - 0.2, b5: SG(4).s - 0.2, b6: T.y5 - 0.2, b7: T.cada6 - 0.2, b8: T.pero7 - 0.2, b9: T.todo8 - 0.2, b10: T.para9 - 0.2, b11: T.pero10 - 0.2, b12: T.los11 - 0.2, b13: T.un12 - 0.2, b14: T.escribir - 0.35, b15: T.era13 - 0.2, b16: T.con14 - 0.2, b17: T.despues - 0.2, b18: T.y16 - 0.2, b19: T.lo17 - 0.2, b20: T.conoces - 0.2, b21: T.comparte - 0.2 };

 // ---------------- utilidades ----------------
 const title = (ctx, s, t, t0, era, o = {}) => P.eraLabel(ctx, s, 540, o.y || 200, o.px || 52, t, t0, era, o);
 const pill = (ctx, s, x, y, t, t0, era = 1, o = {}) => P.eraLabel(ctx, s, x, y, o.px || 36, t, t0, era, o);
 const tag = (ctx, s, x, y, t, t0, o = {}) => { const a = sm(t0, t0 + 0.3, t) * (o.t1 ? 1 - sm(o.t1 - 0.3, o.t1, t) : 1); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = '700 32px "IBM Plex Mono"'; const tw = ctx.measureText(s).width; ctx.fillStyle = 'rgba(11,20,36,0.86)'; ctx.fillRect(x - tw / 2 - 16, y - 25, tw + 32, 50); ctx.fillStyle = o.col || C.oro; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + 1); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.fillStyle = c; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
 const lead = (ctx, p, x1, y1, a, c = C.oro) => { if (!p || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], x1, E.out(a)), lerp(p[1], y1, E.out(a))); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, TAU); ctx.fill(); ctx.restore(); };
 const scrimTop = (ctx, a = 0.45) => { const g = ctx.createLinearGradient(0, 0, 0, 420); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 420); };
 const scrimBot = (ctx, a = 0.5) => { const g = ctx.createLinearGradient(0, 1400, 0, HH); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 1400, W, HH - 1400); };
 // gradación 1956: luz cálida y ligera desaturación (no sepia de película) · hoy: P.techGrade
 const warm = (ctx, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = 0.3 * a; ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, W, HH); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.35 * a; ctx.fillStyle = C.calida; ctx.fillRect(0, 0, W, HH); ctx.globalCompositeOperation = 'source-over'; const g = ctx.createRadialGradient(540, 900, 420, 540, 960, 1250); g.addColorStop(0, 'rgba(17,12,6,0)'); g.addColorStop(1, `rgba(17,12,6,${0.55 * a})`); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.restore(); };
 // cámara con fotogramas clave [t, pos, tgt, f] (interpolación suave entre claves)
 const shot = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++; const a = keys[i], b = keys[i + 1], u = E.inOut(win(t, a[0], b[0])), L = (p, q) => p.map((v, j) => lerp(v, q[j], u)); return P.cam3(L(a[1], b[1]), L(a[2], b[2]), lerp(a[3] || 900, b[3] || 900, u)); };
 const ROT = (t) => t * 2.1; // giro visual continuo (no literal: 1.200 rpm producirían aliasing a 30 fps)
 // escena de sala completa: sala + (305) + 350 + técnico, con orden de pintor por profundidad
 function room(ctx, t, cam, o = {}) { P.room1956(ctx, cam, t, { warm: 1 }); if (o.sys) P.ramac305(ctx, cam, t, { x: -330, z: -20, consoleDx: 170 }); const foot = o.foot || [118, 0, 26]; const wd = cam.depth(foot), md = cam.depth([0, 80, 0]); if (o.worker !== false && wd > md) P.worker1956(ctx, cam, foot, t, { pose: o.pose }); const r = P.ibm350(ctx, cam, t, { rot: ROT(t), ...(o.m || {}) }); let wk = null; if (o.worker !== false && wd <= md) wk = P.worker1956(ctx, cam, foot, t, { pose: o.pose }); return { r, wk }; }
 // frente simplificado del IBM 350 en 2D (para la línea de evolución), escala s px/mm, apoyado en baseY
 function front350(ctx, cx, baseY, s) { const w = 1520 * s, h = 1720 * s; ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(cx - w / 2 - 20 * s, baseY - 6 * s, w + 40 * s, 12 * s); ctx.fillStyle = C.metalD; ctx.fillRect(cx - w / 2 + 20 * s, baseY - 120 * s, w - 40 * s, 120 * s); ctx.fillStyle = C.metal; ctx.fillRect(cx - w / 2, baseY - h, w, h - 120 * s); const wx = cx - w / 2 + 120 * s, wy = baseY - 1400 * s, ww = 760 * s, wh = 900 * s; ctx.fillStyle = '#1c2124'; ctx.fillRect(wx, wy, ww, wh); for (let k = 0; k < 50; k++) { const yy = wy + wh * 0.18 + k * wh * 0.0126; ctx.fillStyle = k % 2 ? '#8a7766' : '#a7b3b9'; ctx.fillRect(wx + ww * 0.1, yy, ww * 0.62, Math.max(1, wh * 0.006)); } ctx.fillStyle = '#6d777c'; ctx.fillRect(wx + ww * 0.82, wy + wh * 0.12, ww * 0.05, wh * 0.72); ctx.strokeStyle = C.metalD; ctx.lineWidth = Math.max(2, 20 * s); ctx.strokeRect(wx, wy, ww, wh); for (let k = 0; k < 9; k++) { ctx.fillStyle = C.metalD; ctx.fillRect(cx + w * 0.18, baseY - 1300 * s + k * 90 * s, w * 0.26, 30 * s); } ctx.restore(); }

 const B = [];
 // 1 · GANCHO — microSD en la yema del dedo, con miniaturas de fotos orbitando (visualización conceptual)
 B.push({ t0: 0, t1: TB.b2, in: { type: 'cut' }, draw(ctx, t) {
  const g = ctx.createRadialGradient(540, 700, 50, 540, 900, 1200); g.addColorStop(0, '#16304f'); g.addColorStop(1, C.moderno); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const z = lerp(1, 1.18, E.inOut(win(t, 0, TB.b2))), fw = 330 * z, ty = lerp(560, 520, E.inOut(win(t, 0, TB.b2)));
  const ph = sm(0.3, T.miles + 0.2, t), behind = [], front = []; for (let i = 0; i < 10; i++) { const a = t * 0.5 + (i * TAU) / 10; (Math.sin(a) < 0 ? behind : front).push([i, a]); }
  const tile = ([i, a]) => { const r = 380 * ph, x = 540 + Math.cos(a) * r, y = ty + 240 + Math.sin(a) * r * 0.32, s = 110 * (0.75 + 0.25 * (Math.sin(a) + 1) / 2) * ph; if (s > 2) P.photoTile(ctx, x, y, s, i, { rot: Math.cos(a) * 0.15 }); };
  behind.forEach(tile); P.fingertip(ctx, 540, ty, fw, t, { glow: 0.4 + 0.3 * Math.sin(t * 2), cardRot: -0.12 + Math.sin(t * 0.6) * 0.04 }); front.forEach(tile);
  P.techGrade(ctx, 0.6); scrimTop(ctx, 0.4); title(ctx, '¡MILES DE FOTOGRAFÍAS!', t, T.miles - 0.1, 1); pill(ctx, 'microSD · 11 × 15 MM', 540, 1300, t, T.una - 0.6, 1, { px: 34 });
 }, sfx(k) { FX.aparece(k, 0.1, 700); k.play('sparkle', T.miles, { gain: 0.5 }); FX.etiqueta(k, T.una - 0.6); } });

 // 2 · 1956 — se entra en la tarjeta (transición temporal cálida) y la cámara se aleja de la ventana del IBM 350 hasta la sala completa
 B.push({ t0: TB.b2, t1: TB.b3, in: { type: 'cut' }, draw(ctx, t) {
  const tz = TB.b2 + 0.85, warmT = sm(TB.b2 + 0.5, tz, t) * (1 - sm(tz, tz + 0.5, t));
  if (t < tz) { const u = E.in(win(t, TB.b2, tz)); ctx.fillStyle = C.moderno; ctx.fillRect(0, 0, W, HH); P.microSD(ctx, 540, 960, lerp(26, 260, u), { rot: -0.12 * (1 - u), back: true }); P.techGrade(ctx, 0.6); }
  else { const cam = shot([[tz, [-30, 96, 95], [-38, 86, 0], 900], [tz + 2.6, [150, 135, 300], [-20, 90, 0], 900], [TB.b3, [250, 150, 390], [-10, 92, 0], 920]], t); room(ctx, t, cam, { foot: [118, 0, 26] }); warm(ctx, 1); }
  if (warmT > 0) { ctx.fillStyle = `rgba(255,230,180,${warmT * 0.95})`; ctx.fillRect(0, 0, W, HH); }
  scrimTop(ctx, 0.45); if (t > tz) { title(ctx, '1956', t, tz + 0.1, 0, { px: 64 }); pill(ctx, 'MÁS DE UNA TONELADA', 540, 320, t, T.tonelada - 0.15, 0, { px: 40 }); tag(ctx, 'UNIDAD DE DISCOS + COMPRESOR DE AIRE', 540, 400, t, T.tonelada + 0.2); tag(ctx, 'RECONSTRUCCIÓN', 160, 1360, t, tz + 0.3); }
 }, sfx(k) { FX.miniaturizar(k, TB.b2, 0.8, 0.8); FX.saltoTiempo(k, TB.b2 + 0.55, 0.9, 0.7); FX.sala1956(k, TB.b2 + 0.85, TB.b3 - TB.b2 - 0.6, 1); FX.motorDiscos(k, TB.b2 + 0.85, TB.b3 - TB.b2 - 0.6, 0.6); FX.sello(k, T.tonelada - 0.1); } });

 // 3 · ¿POR QUÉ ERA TAN GRANDE? — órbita alrededor de la máquina; las cubiertas empiezan a volverse transparentes
 B.push({ t0: TB.b3, t1: TB.b4, in: { type: 'cut' }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.b3, TB.b4)), an = lerp(0.62, 1.32, u), rr = lerp(400, 300, u), cam = P.cam3([Math.sin(an) * rr * 0.9 - 10, lerp(150, 175, u), Math.cos(an) * rr], [-15, 92, 0], 920);
  room(ctx, t, cam, { foot: [118, 0, 26], m: { xray: sm(TB.b4 - 1.1, TB.b4, t) * 0.55 } }); warm(ctx, 1); scrimTop(ctx, 0.45); title(ctx, '¿POR QUÉ ERA TAN GRANDE?', t, T.como2, 0);
 }, sfx(k) { FX.sala1956(k, TB.b3, TB.b4 - TB.b3, 0.9); FX.motorDiscos(k, TB.b3, TB.b4 - TB.b3, 0.6); k.play('whoosh', TB.b3 + 0.1, { dur: 1.4, top: 700, gain: 0.2 }); } });

 // 4 · ALMACENAMIENTO MAGNÉTICO — la cámara atraviesa la ventana; se revela el eje y los platos; la luz recorre la estructura
 B.push({ t0: TB.b4, t1: TB.b5, in: { type: 'cut' }, draw(ctx, t) {
  const cam = shot([[TB.b4, [130, 170, 270], [-15, 92, 0], 920], [TB.b4 + 2.4, [10, 118, 110], [-38, 86, 0], 900], [TB.b5, [-6, 102, 72], [-38, 84, 0], 880]], t);
  room(ctx, t, cam, { worker: false, m: { xray: lerp(0.55, 1, sm(TB.b4, TB.b4 + 1.2, t)) } });
  const sw = win(t, TB.b4 + 1.2, TB.b5 - 0.2); if (sw > 0 && sw < 1) { ctx.save(); const y = lerp(1500, 300, E.inOut(sw)), g = ctx.createLinearGradient(0, y - 120, 0, y + 120); g.addColorStop(0, 'rgba(216,173,114,0)'); g.addColorStop(0.5, 'rgba(255,225,170,0.22)'); g.addColorStop(1, 'rgba(216,173,114,0)'); ctx.fillStyle = g; ctx.globalCompositeOperation = 'screen'; ctx.fillRect(0, y - 120, W, 240); ctx.restore(); }
  warm(ctx, 1); scrimTop(ctx, 0.45); title(ctx, 'ALMACENAMIENTO MAGNÉTICO', t, T.tecnologia3 - 0.2, 0); tag(ctx, 'PRIMER DISCO DURO COMERCIAL · DISCOS DE ACCESO ALEATORIO', 540, 300, t, T.revoluciono);
 }, sfx(k) { FX.motorDiscos(k, TB.b4, TB.b5 - TB.b4, 0.8); k.play('whoosh', TB.b4 + 0.3, { dur: 1.6, top: 1200, gain: 0.3 }); k.play('riser', TB.b4 + 1.2, { dur: 1.8, gain: 0.25 }); FX.aparece(k, T.tecnologia3 - 0.2, 480); } });

 // 5 · IBM RAMAC — el sistema completo (305) y su unidad de discos (350): no son lo mismo
 B.push({ t0: TB.b5, t1: TB.b6, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = shot([[TB.b5, [-120, 230, 560], [-130, 100, 0], 900], [TB.b6, [-110, 175, 520], [-130, 90, 0], 900]], t), r = room(ctx, t, cam, { sys: true, foot: [118, 0, 40] }); warm(ctx, 1); scrimTop(ctx, 0.45);
  title(ctx, 'IBM 305 RAMAC', t, T.ibm - 0.1, 0, { px: 60 }); tag(ctx, 'EL SISTEMA INFORMÁTICO COMPLETO', 540, 290, t, T.ibm + 0.1);
  const a = sm(T.ramac, T.ramac + 0.4, t); if (a > 0 && r.r.top) { lead(ctx, r.r.top, 760, 470, a); pill(ctx, 'UNIDAD DE DISCOS IBM 350', 720, 470, t, T.ramac + 0.1, 0, { px: 36 }); }
 }, sfx(k) { FX.sala1956(k, TB.b5, TB.b6 - TB.b5, 1); FX.interruptor(k, T.ibm); FX.aparece(k, T.ibm - 0.1, 500); FX.etiqueta(k, T.ramac + 0.1); } });

 // 6 · 50 DISCOS — se retira el panel, los platos giran, se cuentan de abajo arriba, la cámara sube y entra entre dos discos
 const gapY = P.r350y(25) + R3.pitch / 2;
 B.push({ t0: TB.b6, t1: TB.b7, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const ti = T.giraban + 0.4, cam = shot([[TB.b6, [120, 70, 190], [-38, 80, 0], 900], [T.n50 - 0.3, [110, 125, 175], [-38, 88, 0], 900], [T.n50 + 1.2, [105, 140, 160], [-38, 90, 0], 900], [ti, [10, gapY, 70], [-38, gapY, 0], 760], [TB.b7, [-8, gapY, 40], [-38, gapY, 0], 700]], t);
  room(ctx, t, cam, { worker: false, m: { open: sm(TB.b6 + 0.2, TB.b6 + 1.2, t), count: lerp(0, 50, E.inOut(win(t, T.n50 - 0.3, T.n50 + 1.1))), arm: { k: 25, ext: sm(ti, TB.b7, t) * 0.55 } } });
  warm(ctx, 1); scrimTop(ctx, 0.45); title(ctx, '50 DISCOS MAGNÉTICOS', t, T.n50 - 0.2, 0);
  const c = sm(T.n50 - 0.3, T.n50, t) * (1 - sm(ti - 0.3, ti, t)); if (c > 0) { ctx.save(); ctx.globalAlpha *= c; ctx.fillStyle = 'rgba(17,26,33,0.85)'; ctx.beginPath(); ctx.roundRect(780, 560, 230, 170, 20); ctx.fill(); ctx.strokeStyle = C.calida; ctx.lineWidth = 3; ctx.stroke(); txt(ctx, String(Math.round(lerp(0, 50, E.inOut(win(t, T.n50 - 0.3, T.n50 + 1.1))))), 895, 630, 84, C.oro, { f: 'Fraunces', w: 700 }); txt(ctx, 'DISCOS', 895, 700, 32, C.blanco); ctx.restore(); }
  tag(ctx, 'UN SOLO EJE VERTICAL · GIRAN JUNTOS', 540, 300, t, T.giraban - 0.2, { t1: ti });
 }, sfx(k) { FX.panel(k, TB.b6 + 0.2); FX.motorDiscos(k, TB.b6 + 0.6, TB.b7 - TB.b6 - 0.6, 1, 1); FX.contador(k, T.n50 - 0.3, T.n50 + 1.1, 0, 50); k.play('whoosh', T.giraban + 0.4, { dur: 1.2, top: 900, gain: 0.3 }); } });

 // 7 · 61 CM — un disco sale de la pila y se muestra de frente junto a una regla
 B.push({ t0: TB.b7, t1: TB.b8, in: { type: 'cut' }, draw(ctx, t) {
  const tc = TB.b7 + 1.0; if (t < tc) { const cam = shot([[TB.b7, [130, 150, 230], [-38, 85, 20], 900], [tc, [120, 165, 260], [-38, 85, 50], 900]], t); room(ctx, t, cam, { worker: false, m: { open: 1, xray: 1, extract: { k: 40, u: win(t, TB.b7 + 0.1, tc) } } }); warm(ctx, 1); }
  else { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#2a2620'); g.addColorStop(1, '#141310'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const u = E.out(win(t, tc, tc + 0.6)), s = 12.6; P.platterFace(ctx, 540, 860, 30.5 * s, t, { tilt: lerp(0.3, 0.92, u) }); P.rulerCm(ctx, 540 - 35 * s, 1300, 70, s); const d = sm(T.n60 - 0.2, T.n60 + 0.4, t); P.dimLine(ctx, 540 - 30.5 * s, 860, 540 + 30.5 * s, 860, '≈ 61 CM', { a: d, px: 48, off: -60 }); warm(ctx, 1); }
  scrimTop(ctx, 0.45); title(ctx, '61 CM DE DIÁMETRO', t, T.n60 - 0.2, 0); tag(ctx, '24 PULGADAS = 60,96 CM', 540, 300, t, T.diametro);
 }, sfx(k) { FX.carro(k, TB.b7 + 0.1, 0.8, 0.7); k.play('whoosh', TB.b7 + 1.0, { dur: 0.5, top: 1400, gain: 0.3 }); FX.flecha(k, T.n60 - 0.2, 0.6); FX.aparece(k, T.diametro, 560); } });

 // 8 · ¡PERO MIRA SU CAPACIDAD! — vuelta al conjunto: la máquina llena la pantalla y la luz baja alrededor
 B.push({ t0: TB.b8, t1: TB.b9, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = shot([[TB.b8, [60, 110, 120], [-38, 86, 0], 880], [TB.b9, [150, 150, 250], [-20, 95, 0], 900]], t); room(ctx, t, cam, { worker: false, m: { open: 1, xray: 0.8 } });
  warm(ctx, 1); const dim = sm(TB.b8, TB.b9, t); const g = ctx.createRadialGradient(540, 960, 300, 540, 960, 1000); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${0.6 * dim})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  scrimTop(ctx, 0.45); title(ctx, '¡PERO MIRA SU CAPACIDAD!', t, T.pero7 + 0.1, 0);
 }, sfx(k) { FX.motorDiscos(k, TB.b8, TB.b9 - TB.b8, 0.7); k.play('riser', TB.b9 - 1.2, { dur: 1.2, gain: 0.3 }); } });

 // 9 · ¡SOLO 3,75 MB! — contador de capacidad junto a la máquina; una microSD a escala real sobre el armario (con lupa)
 B.push({ t0: TB.b9, t1: TB.b10, in: { type: 'cut' }, draw(ctx, t) {
  const cam = shot([[TB.b9, [190, 160, 330], [-10, 95, 0], 920], [TB.b10, [260, 170, 430], [-10, 92, 0], 920]], t), r = room(ctx, t, cam, { foot: [118, 0, 26], m: { xray: 0.25 } });
  warm(ctx, 1); scrimTop(ctx, 0.45);
  const c = sm(T.equivalente - 0.3, T.equivalente, t); if (c > 0) { ctx.save(); ctx.globalAlpha *= c; ctx.fillStyle = 'rgba(17,26,33,0.9)'; ctx.beginPath(); ctx.roundRect(140, 300, 800, 230, 26); ctx.fill(); ctx.strokeStyle = C.oro; ctx.lineWidth = 4; ctx.stroke(); const v = lerp(0, 3.75, E.out(win(t, T.equivalente, T.n4 + 0.2))); txt(ctx, v.toFixed(2).replace('.', ',') + ' MB', 540, 390, 100, C.oro, { w: 900 }); txt(ctx, '5 MILLONES DE CARACTERES DE 6 BITS', 540, 482, 32, C.blanco, { w: 700 }); ctx.restore(); }
  title(ctx, '¡SOLO 3,75 MB!', t, T.n4 - 0.1, 1, { px: 60 });
  const m = sm(T.actuales, T.actuales + 0.4, t); if (m > 0) { const cp = cam.clip([[30, R3.H + 0.1, 20]], 1)[0]; if (cp) { ctx.save(); ctx.globalAlpha *= m; P.microSD(ctx, cp[0], cp[1] - 2, Math.max(0.3, 920 / cp[2] * 0.1), {}); const lx = 820, ly = 900; ctx.strokeStyle = C.oro; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cp[0], cp[1]); ctx.lineTo(lx - 120, ly); ctx.stroke(); ctx.fillStyle = '#c9cec9'; ctx.beginPath(); ctx.arc(lx, ly, 125, 0, TAU); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, 120, 0, TAU); ctx.clip(); ctx.fillStyle = '#b4bab4'; ctx.fillRect(lx - 130, ly + 50, 260, 100); P.microSD(ctx, lx, ly - 10, 9, {}); ctx.restore(); ctx.strokeStyle = C.oro; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(lx, ly, 122, 0, TAU); ctx.stroke(); ctx.restore(); pill(ctx, 'microSD A ESCALA REAL', lx, ly + 175, t, T.actuales + 0.1, 1, { px: 32 }); } }
 }, sfx(k) { FX.contador(k, T.equivalente, T.n4 + 0.2, 0, 375); FX.sello(k, T.n4); FX.aparece(k, T.actuales + 0.05, 800); } });

 // 10 · UNA FOTO PUEDE OCUPAR MÁS — galería del celular; una foto de ejemplo de 5 MB frente a los 3,75 MB del IBM 350
 B.push({ t0: TB.b10, t1: TB.b11, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const g = ctx.createRadialGradient(540, 700, 50, 540, 900, 1200); g.addColorStop(0, '#16304f'); g.addColorStop(1, C.moderno); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const big = E.inOut(win(t, T.fotografias9 - 0.2, T.fotografias9 + 0.6)), up = (1 - E.out(win(t, TB.b10, TB.b10 + 0.6))) * 1100; ctx.save(); ctx.translate(0, up);
  P.handHold(ctx, 540, 770, 720, 'back'); P.smartphone(ctx, 540, 770, 720, t, { glow: 0.8, screen: (c, x, y, w, h) => { c.fillStyle = '#0f1724'; c.fillRect(x, y, w, h); const n = 3, s = (w - 24) / n; for (let i = 0; i < 12; i++) { const gx = x + 12 + (i % n) * s + s / 2, gy = y + 70 + Math.floor(i / n) * s + s / 2; if (i !== 4) P.photoTile(c, gx, gy, s * 0.86, i + 3); } const cx0 = x + 12 + s * 1.5, cy0 = y + 70 + s * 1.5, cx1 = x + w / 2, cy1 = y + h * 0.45, ss = lerp(s * 0.86, w * 0.92, big); if (big > 0) { c.fillStyle = `rgba(0,0,0,${0.6 * big})`; c.fillRect(x, y, w, h); } P.photoTile(c, lerp(cx0, cx1, big), lerp(cy0, cy1, big), ss, 7); if (big > 0.6) { c.save(); c.globalAlpha = sm(0.6, 1, big); c.font = '800 32px Nunito'; c.fillStyle = '#FFD447'; c.textAlign = 'center'; c.fillText('FOTO DE EJEMPLO', x + w / 2, y + h * 0.8); c.font = '900 44px Nunito'; c.fillText('5 MB', x + w / 2, y + h * 0.87); c.restore(); } } }); P.handHold(ctx, 540, 770, 720, 'front'); ctx.restore();
  const b = sm(T.espacio9 - 0.6, T.espacio9, t); if (b > 0) { ctx.save(); ctx.globalAlpha *= b; ctx.fillStyle = 'rgba(11,20,36,0.92)'; ctx.beginPath(); ctx.roundRect(70, 1180, 940, 240, 24); ctx.fill(); ctx.restore(); P.capBars(ctx, 110, 1255, 860, [{ label: 'IBM 350 COMPLETO · 3,75 MB', mb: 3.75, col: C.calida }, { label: 'UNA FOTO DE EJEMPLO · 5 MB', mb: 5, col: C.cian }], 5, win(t, T.espacio9 - 0.6, T.espacio9 + 0.6), { bh: 30, gap: 76 }); }
  P.techGrade(ctx, 0.5); scrimTop(ctx, 0.4); title(ctx, 'UNA FOTO PUEDE OCUPAR MÁS', t, T.celular - 0.4, 1); tag(ctx, 'EL TAMAÑO DEPENDE DEL FORMATO Y LA RESOLUCIÓN', 540, 300, t, T.celular, { col: C.datos });
 }, sfx(k) { FX.encender(k, TB.b10 + 0.3, 0.7); k.play('whoosh', T.fotografias9 - 0.2, { dur: 0.6, top: 2000, gain: 0.3 }); FX.etiqueta(k, T.fotografias9 + 0.6); FX.flecha(k, T.espacio9 - 0.5, 0.8); } });

 // 11 · ¿CÓMO ALMACENABA INFORMACIÓN? — de vuelta al RAMAC: la cámara baja hasta la superficie del disco superior
 B.push({ t0: TB.b11, t1: TB.b12, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const tm = TB.b12 - 0.5, cam = shot([[TB.b11, [110, 175, 200], [-38, 100, 0], 900], [tm, [-20, R3.top + 6, 12], [-26, R3.top, 4], 800]], t);
  if (t < tm + 0.05) { room(ctx, t, cam, { worker: false, m: { open: 1, xray: 1 } }); warm(ctx, 1); }
  const f = sm(tm - 0.4, tm + 0.3, t); if (f > 0) { ctx.save(); ctx.globalAlpha *= f; P.magSurface(ctx, 0, 0, W, HH, t, { rows: 9, speed: 160, a: sm(tm, TB.b12, t) }); ctx.restore(); }
  scrimTop(ctx, 0.45); title(ctx, '¿CÓMO ALMACENABA INFORMACIÓN?', t, T.guardaba - 0.3, 0, { px: 48 });
 }, sfx(k) { FX.motorDiscos(k, TB.b11, TB.b12 - TB.b11, 0.8); k.play('whoosh', TB.b11 + 0.3, { dur: 1.6, top: 800, gain: 0.3 }); } });

 // 12 · MATERIAL MAGNÉTICO — corte del disco: aluminio + recubrimiento magnético con regiones magnetizadas (didáctico)
 B.push({ t0: TB.b12, t1: TB.b13, in: { type: 'cut' }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); P.magSurface(ctx, 0, 330, W, 330, t, { rows: 4, speed: 160 }); ctx.fillStyle = 'rgba(17,26,33,0.5)'; ctx.fillRect(0, 330, W, 330);
  const sx = 60, sy = 760, sw = 960, sh = 440, sc = P.magSection(ctx, sx, sy, sw, sh, t, { n: 8, speed: 60 });
  pill(ctx, 'RECUBRIMIENTO MAGNÉTICO', 540, sy - 50, t, T.cubiertos, 0, { px: 36 }); pill(ctx, 'DISCO DE ALUMINIO', 540, sy + sh * 0.65, t, T.cubiertos + 0.4, 0, { px: 36 });
  tag(ctx, 'ÓXIDO DE HIERRO · REGIONES MAGNETIZADAS EN UN SENTIDO U OTRO', 540, sy + sh + 60, t, T.magnetico); tag(ctx, 'REPRESENTACIÓN DIDÁCTICA', 540, 700, t, T.material);
  warm(ctx, 0.6); scrimTop(ctx, 0.45); title(ctx, 'MATERIAL MAGNÉTICO', t, T.material - 0.2, 0);
 }, sfx(k) { FX.aparece(k, T.cubiertos, 480); FX.etiqueta(k, T.cubiertos + 0.4); FX.etiqueta(k, T.magnetico); k.noise(TB.b12, { dur: TB.b13 - TB.b12, color: 'pink', filter: 'bandpass', f: 1800, q: 2, gain: 0.015, a: 0.4, hold: 1.5 }); } });

 // 13 · EL MECANISMO DE ACCESO — el brazo se retira, el carro sube hasta otro disco y el brazo entra hasta la pista
 B.push({ t0: TB.b13, t1: TB.b14, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const t1 = TB.b13 + 0.5, t2 = T.movia + 0.3, t3 = T.cabezas + 0.3, ext = t < t1 ? lerp(0.6, 0, E.inOut(win(t, TB.b13, t1))) : t < t2 ? 0 : E.inOut(win(t, t2, t3)) * 0.7, kk = lerp(12, 34, E.inOut(win(t, t1, t2)));
  const cam = shot([[TB.b13, [125, 125, 120], [-15, 85, 0], 860], [TB.b14, [118, 140, 112], [-15, 92, 0], 860]], t); const r = room(ctx, t, cam, { worker: false, m: { open: 1, xray: 1, arm: { k: kk, ext } } });
  warm(ctx, 1); scrimTop(ctx, 0.45); title(ctx, 'LECTURA Y ESCRITURA', t, T.mecanismo - 0.2, 0);
  if (r.r.column) { const a1 = sm(t1, t1 + 0.3, t) * (1 - sm(t2 + 0.2, t2 + 0.5, t)); if (a1 > 0 && r.r.armTip) { ctx.save(); ctx.globalAlpha *= a1; ctx.strokeStyle = C.oro; ctx.fillStyle = C.oro; ctx.lineWidth = 6; const x = r.r.column[0] + 60, y = r.r.armTip[1]; ctx.beginPath(); ctx.moveTo(x, y + 90); ctx.lineTo(x, y - 90); ctx.stroke(); for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, y + s * 110); ctx.lineTo(x - 16, y + s * 84); ctx.lineTo(x + 16, y + s * 84); ctx.closePath(); ctx.fill(); } ctx.restore(); }
   pill(ctx, 'EL CARRO ELIGE EL DISCO', 540, 1290, t, t1 + 0.1, 0, { px: 34, t1: t2 + 0.4 }); pill(ctx, 'EL BRAZO ELIGE LA PISTA', 540, 1290, t, t2 + 0.45, 0, { px: 34 }); }
  tag(ctx, 'LAS CABEZAS FLOTAN SOBRE AIRE: NO TOCAN EL DISCO', 540, 300, t, T.cabezas);
 }, sfx(k) { FX.motorDiscos(k, TB.b13, TB.b14 - TB.b13, 0.6); FX.carro(k, TB.b13, 0.5, 0.6); FX.carro(k, TB.b13 + 0.55, T.movia + 0.3 - TB.b13 - 0.55, 1); FX.carro(k, T.movia + 0.3, T.cabezas - T.movia, 0.7); } });

 // 14 · ESCRIBIR / LEER — vista lateral: la cabeza magnetiza las regiones al pasar; después lee los cambios como señal y bits
 B.push({ t0: TB.b14, t1: TB.b15, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); const rd = t >= T.leer - 0.1, mode = rd ? 'read' : 'write'; P.headTrack(ctx, 20, 420, 1040, 760, t, { mode, speed: 150 });
  if (rd) { const b = sm(T.leer + 0.4, T.leer + 0.8, t); if (b > 0) { ctx.save(); ctx.globalAlpha *= b; const bits = '1011001110'; ctx.font = '800 56px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; for (let i = 0; i < bits.length; i++) { const sh = cl((t - T.leer - 0.4) * 6 - i); ctx.globalAlpha = b * sh; ctx.fillStyle = bits[i] === '1' ? C.datos : C.oro; ctx.fillText(bits[i], 135 + i * 90, 1300); } ctx.restore(); } }
  warm(ctx, 0.5); scrimTop(ctx, 0.45); title(ctx, rd ? 'LEER DATOS' : 'ESCRIBIR DATOS', t, rd ? T.leer - 0.1 : TB.b14 + 0.05, 0);
  tag(ctx, rd ? 'LOS CAMBIOS MAGNÉTICOS → SEÑAL ELÉCTRICA → DATOS' : 'LA BOBINA MAGNETIZA LA PISTA AL PASAR', 540, 300, t, rd ? T.leer : TB.b14 + 0.1, { t1: rd ? 99 : T.leer - 0.1 }); pill(ctx, 'COLCHÓN DE AIRE', 820, 650, t, TB.b14 + 0.4, 0, { px: 32 });
 }, sfx(k) { FX.escribir(k, TB.b14 + 0.1, T.leer - TB.b14 - 0.2, 0.9); FX.leer(k, T.leer, TB.b15 - T.leer - 0.2, 0.9); FX.motorDiscos(k, TB.b14, TB.b15 - TB.b14, 0.4); } });

 // 15 · EL MISMO PRINCIPIO GENERAL — el plato de 61 cm frente a un HDD de 3,5″ a la MISMA escala; luego acercamiento al HDD
 B.push({ t0: TB.b15, t1: TB.b16, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#16202a'); g.addColorStop(1, '#0B1424'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const z = lerp(1, 4.2, E.inOut(win(t, T.duros - 0.4, TB.b16 - 0.2))), pxmm = 1.45, hc = [700, 960]; ctx.save(); ctx.translate(hc[0], hc[1] - 180 * pxmm * 0); ctx.scale(z, z); ctx.translate(-hc[0], -hc[1]);
  P.platterFace(ctx, 470, 900, 305 * pxmm, t, { tilt: 0.92 }); const hd = P.hdd35(ctx, hc[0], hc[1], pxmm, t, {}); ctx.restore();
  const a = 1 - sm(T.duros - 0.4, T.duros, t); if (a > 0) { pill(ctx, 'DISCO DEL IBM 350 · 61 CM', 420, 1350, t, TB.b15 + 0.3, 0, { px: 34, t1: T.duros }); pill(ctx, 'HDD 3,5″ (MISMA ESCALA)', 760, 1250, t, T.principio, 1, { px: 32, t1: T.duros }); }
  const b = sm(T.decadas - 0.2, T.decadas + 0.2, t); if (b > 0) { tag(ctx, 'MISMA IDEA: DISCOS MAGNÉTICOS QUE GIRAN + CABEZAS', 540, 1300, t, T.decadas - 0.2); tag(ctx, '1956: CARRO QUE SUBE Y BAJA · HDD: BRAZO QUE GIRA', 540, 1370, t, T.decadas + 0.3, { col: C.datos }); }
  P.techGrade(ctx, sm(T.duros, TB.b16, t) * 0.5); warm(ctx, 1 - sm(T.duros - 0.4, T.duros + 0.6, t)); scrimTop(ctx, 0.45); title(ctx, 'EL MISMO PRINCIPIO GENERAL', t, T.principio - 0.3, sm(T.duros - 0.4, T.duros, t) > 0.5 ? 1 : 0, { px: 50 });
 }, sfx(k) { FX.aparece(k, TB.b15 + 0.3, 480); FX.miniaturizar(k, T.duros - 0.4, 1.4, 0.8); FX.motorDiscos(k, T.duros, TB.b16 - T.duros, 0.5); FX.etiqueta(k, T.decadas - 0.2); } });

 // 16 · MÁS CAPACIDAD · MENOS ESPACIO — línea de evolución con zoom logarítmico (escalas reales) y barra de capacidad creciente sin cifras
 const EVO = [{ x: 0, w: 1520, h: 1720, draw: (c, x, y, s) => front350(c, x, y, s), lab: '1956 · IBM 350' }, { x: 1250, w: 760, h: 1000, draw: (c, x, y, s, t) => P.driveBox(c, x, y, s, '1970', t), lab: 'AÑOS 60–70' }, { x: 1780, w: 146, h: 41, draw: (c, x, y, s, t) => P.driveBox(c, x, y, s, '525', t), lab: 'AÑOS 80 · PC 5,25″' }, { x: 1930, w: 102, h: 26, draw: (c, x, y, s, t) => P.driveBox(c, x, y, s, '35', t), lab: '3,5″' }, { x: 2030, w: 70, h: 9.5, draw: (c, x, y, s, t) => P.driveBox(c, x, y, s, '25', t), lab: 'PORTÁTIL 2,5″' }];
 B.push({ t0: TB.b16, t1: TB.b17, in: { type: 'cut' }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#1a2430'); g.addColorStop(1, '#0B1424'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const N = EVO.length, prog = (N - 1) * E.inOut(win(t, TB.b16 + 0.3, T.menores)), i0 = Math.floor(Math.min(prog, N - 1.0001)), fr = prog - i0, A2 = EVO[i0], B2 = EVO[Math.min(N - 1, i0 + 1)], spx = (it) => Math.min(700 / it.w, 900 / it.h);
  const s = Math.exp(lerp(Math.log(spx(A2)), Math.log(spx(B2)), E.inOut(fr))), cxw = lerp(A2.x, B2.x, E.inOut(fr)), baseY = 1180;
  ctx.fillStyle = '#2c3640'; ctx.fillRect(0, baseY, W, HH - baseY); for (const it of EVO) { const x = 540 + (it.x - cxw) * s; if (x + it.w * s / 2 < -50 || x - it.w * s / 2 > W + 50) continue; it.draw(ctx, x, baseY, s, t); }
  const cur = EVO[Math.round(prog)]; pill(ctx, cur.lab, 540, 1300, t, TB.b16 + 0.2, 1, { px: 36 });
  const bar = 10 ** Math.floor(Math.log10(250 / s)), bl = bar * s; ctx.save(); ctx.strokeStyle = C.blanco; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(90, 1390); ctx.lineTo(90 + bl, 1390); ctx.moveTo(90, 1376); ctx.lineTo(90, 1404); ctx.moveTo(90 + bl, 1376); ctx.lineTo(90 + bl, 1404); ctx.stroke(); txt(ctx, bar >= 1000 ? bar / 1000 + ' M' : bar >= 10 ? bar / 10 + ' CM' : bar + ' MM', 90 + bl + 20, 1390, 32, C.blanco, { al: 'left' }); ctx.restore();
  const cap = E.inOut(win(t, TB.b16 + 0.3, T.menores + 0.3)); ctx.save(); ctx.fillStyle = 'rgba(11,20,36,0.85)'; ctx.beginPath(); ctx.roundRect(930, 360, 100, 700, 20); ctx.fill(); const hh = 640 * (0.02 + 0.98 * cap ** 2); ctx.fillStyle = C.cian; ctx.beginPath(); ctx.roundRect(950, 1040 - hh, 60, hh, 10); ctx.fill(); ctx.restore(); txt(ctx, 'CAPACIDAD', 940, 1100, 32, C.datos, { w: 900 });
  scrimTop(ctx, 0.4); title(ctx, 'MÁS CAPACIDAD · MENOS ESPACIO', t, T.reducir - 0.3, 1, { px: 48 }); tag(ctx, 'ESCALAS REALES · CAPACIDAD ILUSTRATIVA, SIN CIFRAS', 540, 290, t, T.reducir);
 }, sfx(k) { for (let i = 1; i < EVO.length; i++) FX.miniaturizar(k, TB.b16 + 0.3 + (T.menores - TB.b16 - 0.3) * (i - 0.6) / (EVO.length - 1), 0.9, 0.6); FX.etiqueta(k, T.reducir); } });

 // 17 · MEMORIA FLASH — el plato del HDD desaparece (cambia la tecnología física) y aparece un chip; dentro, celdas que guardan carga
 B.push({ t0: TB.b17, t1: TB.b18, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.fillStyle = C.moderno; ctx.fillRect(0, 0, W, HH); const tf = T.memorias15 - 0.1, tc = T.sin15 - 0.3, pf = 1 - sm(tf, tf + 0.6, t);
  if (t < tc + 0.2) { ctx.save(); ctx.globalAlpha *= 1 - sm(tc - 0.2, tc + 0.2, t); P.hdd35(ctx, 540, 860, 5.2, t, { plate: pf }); if (pf < 1 && pf > 0) { ctx.strokeStyle = `rgba(75,212,241,${0.6 * (1 - pf)})`; ctx.lineWidth = 2; for (let y = 600; y < 1100; y += 12) { ctx.beginPath(); ctx.moveTo(300, y); ctx.lineTo(780, y); ctx.stroke(); } } const ca = sm(tf + 0.4, tf + 0.9, t); if (ca > 0) { ctx.globalAlpha = ca; P.flashChip(ctx, 540, 860, lerp(14, 22, sm(tf + 0.9, tc, t)), t, { die: sm(tf + 1.2, tc, t), glow: 0.6 }); } ctx.restore(); }
  const cc = sm(tc - 0.2, tc + 0.3, t); if (cc > 0) { ctx.save(); ctx.globalAlpha *= cc; P.flashCells(ctx, 60, 520, 960, 700, t, { cols: 4, rows: 3, prog: win(t, tc, tc + 1.2) }); ctx.restore(); pill(ctx, 'CELDAS QUE GUARDAN CARGA ELÉCTRICA', 540, 1290, t, tc + 0.3, 1, { px: 34 }); tag(ctx, 'NO VOLÁTIL: CONSERVA LOS DATOS SIN ENERGÍA (NO ES RAM)', 540, 1370, t, T.giratorios); }
  P.techGrade(ctx, 0.6); scrimTop(ctx, 0.45); title(ctx, t < tc ? 'MEMORIA FLASH' : 'SIN DISCOS GIRATORIOS', t, t < tc ? T.flash - 0.3 : tc, 1); if (t < tc) tag(ctx, 'OTRA TECNOLOGÍA: ALMACENAMIENTO ELECTRÓNICO', 540, 300, t, T.flash);
 }, sfx(k) { FX.motorDiscos(k, TB.b17, T.memorias15 - TB.b17 + 0.4, 0.4); k.play('glitch', T.memorias15, { gain: 0.4 }); FX.chipFlash(k, T.memorias15 + 0.4); k.play('whoosh', T.sin15 - 0.3, { dur: 0.6, top: 2400, gain: 0.3 }); FX.flujoDatos(k, T.sin15, 1.0, 0.6); } });

 // 18 · 70 AÑOS DE EVOLUCIÓN — de la sala de 1956 a la yema del dedo: los dispositivos se reducen sin cortes (año 1956 → 2026)
 const TL = [{ k: '350', w: 1520, fit: 640 }, { k: '1970', w: 760, fit: 520 }, { k: '525', w: 146, fit: 620 }, { k: '35', w: 102, fit: 560 }, { k: 'chip', w: 38, fit: 560 }, { k: 'sd', w: 11, fit: 330 }];
 B.push({ t0: TB.b18, t1: TB.b19, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const ta = T.gigantescas + 0.4, tb2 = T.enormes16 + 0.2;
  if (t < ta) { const cam = shot([[TB.b18, [230, 160, 360], [-10, 92, 0], 920], [ta, [300, 175, 460], [-10, 92, 0], 920]], t); room(ctx, t, cam, { foot: [118, 0, 26] }); warm(ctx, 1); }
  else if (t < tb2) { const u = win(t, ta, tb2), g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, P.mixc('#2a2620', '#16304f', u)); g.addColorStop(1, P.mixc('#141310', '#0B1424', u)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const pr = (TL.length - 1) * E.inOut(u), i0 = Math.floor(Math.min(pr, TL.length - 1.0001)), fr = pr - i0, cur = TL[i0], nx = TL[i0 + 1], s0 = cur.fit / cur.w, s1 = nx.fit / nx.w, s = Math.exp(lerp(Math.log(s0), Math.log(s1), E.inOut(fr))), base = 1260;
   const drawK = (it, sc, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; if (it.k === '350') front350(ctx, 540, base, sc); else if (it.k === 'chip') P.flashChip(ctx, 540, base - 9 * sc, sc, t, { glow: 0.5 }); else if (it.k === 'sd') P.microSD(ctx, 540, base - 7.5 * sc, sc, {}); else P.driveBox(ctx, 540, base, sc, it.k, t); ctx.restore(); };
   drawK(cur, s, 1 - sm(0.45, 0.9, fr)); drawK(nx, s, sm(0.1, 0.55, fr)); ctx.save(); ctx.fillStyle = 'rgba(11,20,36,0.88)'; ctx.beginPath(); ctx.roundRect(330, 1300, 420, 120, 24); ctx.fill(); ctx.restore(); P.yearRoll(ctx, 540, 1360, 80, 1956, 2026, E.inOut(u), { col: C.oro }); warm(ctx, 1 - u); P.techGrade(ctx, u * 0.5); }
  else { const u = E.out(win(t, tb2, TB.b19)); ctx.fillStyle = C.moderno; ctx.fillRect(0, 0, W, HH); P.fingertip(ctx, 540, lerp(700, 560, u), lerp(160, 330, u), t, { glow: 0.5 }); P.techGrade(ctx, 0.6); }
  scrimTop(ctx, 0.45); title(ctx, '70 AÑOS DE EVOLUCIÓN', t, T.y16 + 0.1, t < ta ? 0 : 1);
 }, sfx(k) { FX.sala1956(k, TB.b18, T.gigantescas + 0.4 - TB.b18, 0.7); FX.miniaturizar(k, T.gigantescas + 0.4, T.enormes16 - T.gigantescas - 0.2, 0.9); FX.contador(k, T.gigantescas + 0.5, T.enormes16, 1956, 2026); FX.encender(k, T.enormes16 + 0.25, 0.7); } });

 // 19 · COMPARACIÓN FINAL — la cámara viaja desde la máquina hasta la mano del técnico: la tarjeta en la punta del dedo
 B.push({ t0: TB.b19, t1: TB.b20, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const tz = T.hoy17 - 0.1, foot = [125, 0, 60], hand = [125 + 52, 134, 60];
  if (t < tz + 0.35) { const u = E.in(win(t, TB.b19 + 0.4, tz + 0.35)), cam = P.cam3([lerp(260, hand[0] + 6, u), lerp(165, hand[1] + 2, u), lerp(430, hand[2] + 40, u)], [lerp(-10, hand[0], u), lerp(95, hand[1], u), lerp(0, hand[2], u)], lerp(920, 1100, u)); const r = room(ctx, t, cam, { foot, pose: 'point' }); const hp = cam.clip([hand], 1)[0]; if (hp) P.microSD(ctx, hp[0], hp[1] - 8 * (920 / hp[2]), Math.max(0.15, (920 / hp[2]) * 0.1), {}); warm(ctx, 1); pill(ctx, '1956 · IBM 350 · ≈ 3,75 MB', 540, 330, t, TB.b19 + 0.1, 0, { px: 36, t1: tz }); }
  const f = sm(tz, tz + 0.35, t); if (f > 0) { ctx.save(); ctx.globalAlpha *= f; ctx.fillStyle = C.moderno; ctx.fillRect(0, 0, W, HH); P.fingertip(ctx, 540, 560, 360, t, { glow: 0.6 }); P.techGrade(ctx, 0.6); ctx.restore(); pill(ctx, 'microSD MODERNA', 540, 330, t, tz + 0.2, 1, { px: 40 }); tag(ctx, 'EJEMPLO: microSD DE 1 TB ≈ 266.000 VECES MÁS', 540, 1300, t, T.punta - 0.2); }
  scrimTop(ctx, 0.4); title(ctx, '¡EN LA PUNTA DE TU DEDO!', t, T.punta - 0.3, 1);
 }, sfx(k) { FX.sala1956(k, TB.b19, T.hoy17 - TB.b19, 0.6); k.play('whoosh', TB.b19 + 0.4, { dur: T.hoy17 - TB.b19, top: 1800, gain: 0.3 }); FX.chipFlash(k, T.hoy17 + 0.1, 0.8); FX.etiqueta(k, T.punta - 0.2); } });

 // 20 · ¿RECUERDAS LOS DISQUETES? — la microSD gira y aparece un disquete de 3,5″ a la misma escala
 B.push({ t0: TB.b20, t1: TB.b21, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  const g = ctx.createRadialGradient(540, 800, 50, 540, 900, 1200); g.addColorStop(0, '#1d2c44'); g.addColorStop(1, C.moderno); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const s = 7.4, fa = E.out(win(t, TB.b20 + 0.4, T.disquetes - 0.3)), sh = sm(T.disquetes, T.disquetes + 0.5, t);
  P.floppy35(ctx, lerp(1500, 420, fa), 820, s, { shutter: sh }); P.microSD(ctx, lerp(540, 900, fa), 820, s, { rot: (1 - fa) * t * 2.5 });
  if (fa > 0.9) { pill(ctx, 'DISQUETE 3,5″', 420, 1240, t, T.disquetes, 1, { px: 34 }); pill(ctx, 'microSD', 900, 1000, t, T.disquetes + 0.2, 1, { px: 34 }); tag(ctx, 'DISCO MAGNÉTICO FLEXIBLE · OTRA ETAPA', 540, 1330, t, T.disquetes + 0.4); }
  P.techGrade(ctx, 0.5); scrimTop(ctx, 0.4); title(ctx, '¿RECUERDAS LOS DISQUETES?', t, TB.b20 + 0.2, 1);
 }, sfx(k) { k.play('whoosh', TB.b20 + 0.1, { dur: 0.5, top: 2000, gain: 0.3 }); FX.disquete(k, T.disquetes); FX.etiqueta(k, T.disquetes + 0.4); } });

 // 21 · CIERRE — secuencia histórica (no a escala) y ASOMBROTECA
 B.push({ t0: TB.b21, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#16202a'); g.addColorStop(1, C.moderno); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const z = lerp(1.15, 0.92, E.inOut(win(t, TB.b21, DURATION))); ctx.save(); ctx.translate(540, 980); ctx.scale(z, z); ctx.translate(-540, -980);
  const items = [[150, (c, x, y) => front350(c, x, y, 0.13), '1956'], [400, (c, x, y) => P.driveBox(c, x, y, 1.3, '35', t), 'HDD'], [640, (c, x, y) => P.flashChip(c, x, y - 60, 5, t, { glow: 0.4 }), 'FLASH'], [880, (c, x, y) => P.microSD(c, x, y - 70, 6, { glow: 0.5 }), 'microSD']];
  items.forEach(([x, f, l], i) => { const a = sm(TB.b21 + 0.2 + i * 0.35, TB.b21 + 0.6 + i * 0.35, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(245,247,248,0.06)'; ctx.fillRect(x - 110, 1060, 220, 6); f(ctx, x, 1060); txt(ctx, l, x, 1120, 34, i ? C.datos : C.calida, { w: 800 }); ctx.restore(); if (i < 3) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = C.oro; ctx.beginPath(); ctx.moveTo(x + 112, 980); ctx.lineTo(x + 132, 990); ctx.lineTo(x + 112, 1000); ctx.fill(); ctx.restore(); } }); ctx.restore();
  tag(ctx, 'SECUENCIA HISTÓRICA · NO A ESCALA', 540, 1250, t, TB.b21 + 1.4, { col: C.datos });
  const a = sm(T.asombroteca, T.asombroteca + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(245,247,248,0.75)'; ctx.lineWidth = 2; const lw = 280 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 330); ctx.lineTo(540 + lw, 330); ctx.moveTo(540 - lw, 450); ctx.lineTo(540 + lw, 450); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 392, 64, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
  const b = sm(T.tecnologia19 - 0.6, T.tecnologia19 - 0.1, t); if (b > 0) { ctx.save(); ctx.globalAlpha *= b; txt(ctx, 'LA CIENCIA OCULTA DE LO IMPOSIBLE', 540, 500, 34, C.oro, { w: 700, ls: 3 }); ctx.restore(); }
  P.techGrade(ctx, 0.4);
 }, sfx(k) { for (let i = 0; i < 4; i++) FX.aparece(k, TB.b21 + 0.25 + i * 0.35, 500 + i * 90); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.end + 0.6); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['miles', 'fotografías', 'uña!', '1956', 'megabytes', 'tonelada!', 'diferencia?', 'revolucionó', 'IBM', 'RAMAC.', '50', 'discos', 'giraban', '60', 'centímetros', 'diámetro.', 'sorprendente.', '4', 'megabytes', 'celular', 'espacio', 'información?', 'magnético.', 'cabezas', 'escribir', 'leer', 'discos', 'duros', 'décadas!', 'reducir', 'menores.', 'memorias', 'flash,', 'giratorios.', 'gigantescas', 'diminutas', 'entera,', 'punta', 'dedo!', 'disquetes?', 'Asombroteca', 'tecnología!'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.01, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   // sorpresa → descubrimiento histórico → grandeza industrial → asombro mecánico → revelación → curiosidad científica → progreso → modernidad → resolución
   const Am = [['A1', 'E2', 'A2', 'C3'], ['F1', 'C2', 'F2', 'A2'], ['C2', 'G2', 'C3', 'E3'], ['G1', 'D2', 'G2', 'B2']];
   MUS.pulso(k, 0, TB.b2, { bpm: 104, chords: [['A2', 'C3', 'E3', 'A3'], ['F2', 'A2', 'C3', 'F3']], gain: 0.8, kick: 0.3, arp: 0.8, pad: 0.6 });
   MUS.industrial(k, TB.b2, TB.b6, { bpm: 84, chords: Am, gain: 0.85, perc: 0.5, strings: 0.8 });
   MUS.industrial(k, TB.b6, TB.b9, { bpm: 92, chords: Am, gain: 0.9, perc: 0.85, strings: 1 });
   MUS.golpe(k, T.n4, { gain: 0.7, chord: ['A2', 'E3', 'A3', 'C4'] });
   MUS.piano(k, TB.b9, TB.b11, { bpm: 92, chords: [['A2', 'C3', 'E3', 'A3'], ['F2', 'A2', 'C3', 'F3'], ['C3', 'E3', 'G3', 'C4'], ['G2', 'B2', 'D3', 'G3']], gain: 0.7, strings: 0.6 });
   MUS.piano(k, TB.b11, TB.b15, { bpm: 76, chords: [['D3', 'F3', 'A3', 'D4'], ['A#2', 'D3', 'F3', 'A#3'], ['F2', 'A2', 'C3', 'F3'], ['C3', 'E3', 'G3', 'C4']], gain: 0.75, strings: 0.8 });
   MUS.industrial(k, TB.b11, TB.b15, { bpm: 76, chords: [['D2', 'A2', 'D3', 'F3']], gain: 0.4, perc: 0.35, strings: 0 });
   MUS.pulso(k, TB.b15, TB.b18, { bpm: 108, chords: [['F2', 'A2', 'C3', 'F3'], ['C3', 'E3', 'G3', 'C4'], ['D3', 'F3', 'A3', 'D4'], ['A#2', 'D3', 'F3', 'A#3']], gain: 0.85, kick: 0.45, arp: 0.9, pad: 0.7 });
   MUS.epica(k, TB.b18, TB.b20, { bpm: 80, chords: [['F2', 'C3', 'F3', 'A3'], ['C2', 'G2', 'C3', 'E3'], ['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3']], gain: 0.85, drums: 0.4, strings: 1, ostinato: 0.6 });
   MUS.piano(k, TB.b20, DURATION, { bpm: 70, chords: [['F2', 'A2', 'C3', 'F3'], ['C3', 'E3', 'G3', 'C4'], ['F2', 'A2', 'C3', 'F3']], gain: 0.8, strings: 1 });
   MUS.pulso(k, TB.b20, DURATION - 1.5, { bpm: 70, chords: [['F2', 'A2', 'C3', 'F3']], gain: 0.35, kick: 0, arp: 0.4, pad: 0.6 });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
