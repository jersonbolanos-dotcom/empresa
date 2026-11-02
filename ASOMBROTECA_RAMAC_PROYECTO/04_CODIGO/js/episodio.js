// =====================================================================================================
// episodio.js — «El primer disco duro era una máquina gigantesca» · Serie «La evolución del almacenamiento» · Ep. 02 — V2
// Asombroteca · PLANTILLA v1.19.1. Corrección final: IBM 350 rediseñado con la fotografía histórica (ventana de inspección, pila de
// 50 discos anulares con separación, mecanismo de acceso con guías, carro y brazo radial), técnico con anatomía y gesto, mano de la
// microSD natural y a escala, CUATRO FOTOGRAFÍAS REALES como tarjetas documentales (305 RAMAC, disco RAMAC, HDD abierto, microSD con
// adaptador), capacidad explicada sin cifras contradictorias, escritura/lectura magnética grande (cambio = 1 · sin cambio = 0,
// simplificado), HDD frente a flash como tecnologías distintas (celda de puerta flotante), comparaciones de TAMAÑO y de CAPACIDAD
// separadas. Reloj = voz original. Determinista (H.rng). Fuentes y créditos en FUENTES_Y_DECISIONES.md.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS, C = P.RM, R3 = P.R350, IMG = {};
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
  pero7: SG(7).s, sorprendente: wt(7, 'sorprendente'), todo8: SG(8).s, almacenaba: wt(8, 'almacenaba'), equivalente: wt(8, 'equivalente'), n4: wt(8, '4'), actuales: wt(8, 'actuales'),
  para9: SG(9).s, fotografias9: wt(9, 'fotografías'), celular: wt(9, 'celular'), espacio9: wt(9, 'espacio'),
  pero10: SG(10).s, guardaba: wt(10, 'guardaba'), los11: SG(11).s, cubiertos: wt(11, 'cubiertos'), material: wt(11, 'material'), magnetico: wt(11, 'magnético'),
  un12: SG(12).s, mecanismo: wt(12, 'mecanismo'), movia: wt(12, 'movía'), cabezas: wt(12, 'cabezas'), escribir: wt(12, 'escribir'), leer: wt(12, 'leer'), superficies: wt(12, 'superficies'),
  era13: SG(13).s, principio: wt(13, 'principio'), duros: wt(13, 'duros'), decadas: wt(13, 'décadas'),
  con14: SG(14).s, reducir: wt(14, 'reducir'), componentes: wt(14, 'componentes'), almacenar14: wt(14, 'almacenar'), espacios: wt(14, 'espacios'), menores: wt(14, 'menores'),
  despues: SG(15).s, memorias15: wt(15, 'memorias'), flash: wt(15, 'flash'), almacenan: wt(15, 'almacenan'), sin15: wt(15, 'sin'), giratorios: wt(15, 'giratorios'),
  y16: SG(16).s, gigantescas: wt(16, 'gigantescas'), diminutas: wt(16, 'diminutas'), enormes16: wt(16, 'enormes'),
  lo17: SG(17).s, entera: wt(17, 'entera'), hoy17: wt(17, 'hoy'), punta: wt(17, 'punta'), dedo: wt(17, 'dedo'),
  conoces: SG(18).s, disquetes: wt(18, 'disquetes'), comparte: SG(19).s, asombroteca: wt(19, 'asombroteca'), tecnologia19: wt(19, 'tecnología'), end: A.speech_end,
 };
 const TB = { b2: T.y1956 - 0.45, b3: T.como2 - 0.2, b4: T.todo3 - 0.2, b5: SG(4).s - 0.2, b6: SG(4).s + 3.45, b7: T.cada6 - 0.2, b8: T.pero7 - 0.2, b9: T.todo8 - 0.2, b10: T.para9 - 0.2, b11: T.pero10 - 0.2, b12: T.los11 - 0.2, b13: T.un12 - 0.2, b14: T.escribir - 0.35, b15: T.era13 - 0.2, b16: T.con14 + 1.9, b17: T.despues - 0.2, b18: T.y16 - 0.2, b19: T.lo17 - 0.2, b20: T.conoces - 0.2, b21: T.comparte - 0.2 };

 // ---------------- utilidades ----------------
 const title = (ctx, s, t, t0, era, o = {}) => P.eraLabel(ctx, s, 540, o.y || 200, o.px || 52, t, t0, era, o);
 const pill = (ctx, s, x, y, t, t0, era = 1, o = {}) => P.eraLabel(ctx, s, x, y, o.px || 36, t, t0, era, o);
 const tag = (ctx, s, x, y, t, t0, o = {}) => { const a = sm(t0, t0 + 0.3, t) * (o.t1 ? 1 - sm(o.t1 - 0.3, o.t1, t) : 1); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `700 ${o.px || 32}px "IBM Plex Mono"`; const tw = ctx.measureText(s).width; ctx.fillStyle = 'rgba(11,20,36,0.88)'; ctx.fillRect(x - tw / 2 - 16, y - 26, tw + 32, 52); ctx.fillStyle = o.col || C.oro; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + 1); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.fillStyle = c; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
 const lead = (ctx, p, x1, y1, a, c = C.oro) => { if (!p || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], x1, E.out(a)), lerp(p[1], y1, E.out(a))); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, TAU); ctx.fill(); ctx.restore(); };
 const scrimTop = (ctx, a = 0.45) => { const g = ctx.createLinearGradient(0, 0, 0, 420); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 420); };
 const dimAll = (ctx, a) => { if (a <= 0) return; ctx.fillStyle = `rgba(8,12,18,${a})`; ctx.fillRect(0, 0, W, HH); };
 const warm = (ctx, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = 0.3 * a; ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, W, HH); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.35 * a; ctx.fillStyle = C.calida; ctx.fillRect(0, 0, W, HH); ctx.globalCompositeOperation = 'source-over'; const g = ctx.createRadialGradient(540, 900, 420, 540, 960, 1250); g.addColorStop(0, 'rgba(17,12,6,0)'); g.addColorStop(1, `rgba(17,12,6,${0.55 * a})`); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.restore(); };
 const modernBg = (ctx) => { const g = ctx.createRadialGradient(540, 760, 50, 540, 900, 1200); g.addColorStop(0, '#16304f'); g.addColorStop(1, C.moderno); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 const shot = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++; const a = keys[i], b = keys[i + 1], u = E.inOut(win(t, a[0], b[0])), L = (p, q) => p.map((v, j) => lerp(v, q[j], u)); return P.cam3(L(a[1], b[1]), L(a[2], b[2]), lerp(a[3] || 900, b[3] || 900, u)); };
 const ROT = (t) => t * 2.1; // giro visual continuo (1.200 rpm reales producirían aliasing a 30 fps)
 const XS = R3.xs;
 function room(ctx, t, cam, o = {}) { P.room1956(ctx, cam, t, { warm: 1 }); if (o.sys) P.ramac305(ctx, cam, t, { x: -330, z: -20, consoleDx: 170 }); const foot = o.foot || [112, 0, 20], wo = o.w; const wd = cam.depth(foot), md = cam.depth([0, 80, 0]); let wk = null; if (wo && wd > md) wk = P.worker1956(ctx, cam, foot, t, wo); const r = P.ibm350(ctx, cam, t, { rot: ROT(t), ...(o.m || {}) }); if (wo && wd <= md) wk = P.worker1956(ctx, cam, foot, t, wo); return { r, wk }; }
 function front350(ctx, cx, baseY, s) { const w = 1520 * s, h = 1720 * s; ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(cx - w / 2 - 20 * s, baseY - 6 * s, w + 40 * s, 12 * s); ctx.fillStyle = '#2f3638'; ctx.fillRect(cx - w / 2 + 30 * s, baseY - 120 * s, w - 60 * s, 120 * s); ctx.fillStyle = C.gris; ctx.fillRect(cx - w / 2, baseY - h, w, h - 120 * s); ctx.fillStyle = C.metalD; ctx.fillRect(cx - w / 2, baseY - h, w, 200 * s); const wx = cx - w / 2 + 60 * s, wy = baseY - 1500 * s, ww = 1020 * s, wh = 980 * s; ctx.fillStyle = '#15191b'; ctx.fillRect(wx, wy, ww, wh); const sx = wx + ww * 0.1, sw = ww * 0.6; for (let k = 0; k < 50; k++) { const yy = wy + wh * 0.12 + k * wh * 0.0146; ctx.fillStyle = '#8a6a4a'; ctx.fillRect(sx, yy, sw, Math.max(1, wh * 0.006)); ctx.fillStyle = '#b9c2c6'; ctx.fillRect(sx, yy + Math.max(1, wh * 0.006), sw, Math.max(0.5, wh * 0.002)); } ctx.fillStyle = '#9aa3a6'; ctx.fillRect(wx + ww * 0.76, wy + wh * 0.05, ww * 0.02, wh * 0.85); ctx.fillRect(wx + ww * 0.82, wy + wh * 0.05, ww * 0.02, wh * 0.85); ctx.strokeStyle = C.metal; ctx.lineWidth = Math.max(2, 14 * s); ctx.strokeRect(wx, wy, ww, wh); for (let k = 0; k < 9; k++) { ctx.fillStyle = C.metalD; ctx.fillRect(cx + w * 0.22, baseY - 1400 * s + k * 90 * s, w * 0.24, 28 * s); } ctx.restore(); }
 function annulus(ctx, cx, cy, r, tilt) { ctx.save(); ctx.translate(cx, cy); ctx.scale(1, tilt); ctx.fillStyle = '#b9c2c6'; ctx.beginPath(); ctx.arc(0, 10 / tilt, r, 0, TAU); ctx.arc(0, 10 / tilt, r * 0.49, 0, TAU, true); ctx.fill('evenodd'); const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r); g.addColorStop(0, '#9c7a56'); g.addColorStop(1, '#7a5c3e'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.arc(0, 0, r * 0.49, 0, TAU, true); ctx.fill('evenodd'); ctx.strokeStyle = 'rgba(230,236,238,0.6)'; ctx.lineWidth = 3 / tilt; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * 0.49, 0, TAU); ctx.stroke(); ctx.restore(); }

 const B = [];
 // 1 · GANCHO — la microSD sobre la yema; la cámara se aleja y revela lo diminuta que es; miniaturas de fotos (conceptual)
 B.push({ t0: 0, t1: TB.b2, in: { type: 'cut' }, draw(ctx, t) {
  modernBg(ctx); const z = lerp(2.3, 1, E.inOut(win(t, 0.15, 3.4))), tip = [600, 760], fw = 150, oy = tip[1] + fw * 0.6; ctx.save(); ctx.translate(tip[0], oy); ctx.scale(z, z); ctx.translate(-tip[0], -oy); const r = P.fingertip(ctx, tip[0], tip[1], fw, t, { glow: 0.35 + 0.25 * Math.sin(t * 2), cardRot: -0.1 + Math.sin(t * 0.6) * 0.03 }); ctx.restore();
  const cp = [tip[0] + (r.card[0] - tip[0]) * z, oy + (r.card[1] - oy) * z], ph = sm(T.miles - 0.4, T.miles + 0.4, t); for (let i = 0; i < 10; i++) { const a = t * 0.45 + (i * TAU) / 10, rr = 330 * ph, x = cp[0] + Math.cos(a) * rr, y = cp[1] + Math.sin(a) * rr * 0.42 - 40, s = 92 * (0.75 + 0.25 * (Math.sin(a) + 1) / 2) * ph; if (s > 2) P.photoTile(ctx, x, y, s, i, { rot: Math.cos(a) * 0.15 }); }
  P.techGrade(ctx, 0.6); scrimTop(ctx, 0.4); title(ctx, '¡MILES DE FOTOGRAFÍAS!', t, T.miles - 0.1, 1); pill(ctx, 'microSD · 11 × 15 MM', 540, 1310, t, T.una - 0.7, 1, { px: 36 });
 }, sfx(k) { FX.aparece(k, 0.1, 700); FX.miniaturizar(k, 0.2, 3.0, 0.4); k.play('sparkle', T.miles, { gain: 0.45 }); FX.etiqueta(k, T.una - 0.7); } });

 // 2 · 1956 — se entra en la tarjeta (transición temporal cálida) y la cámara se aleja de la ventana del IBM 350; el técnico señala la máquina
 B.push({ t0: TB.b2, t1: TB.b3, in: { type: 'cut' }, draw(ctx, t) {
  const tz = TB.b2 + 0.85, warmT = sm(TB.b2 + 0.5, tz, t) * (1 - sm(tz, tz + 0.5, t));
  if (t < tz) { const u = E.in(win(t, TB.b2, tz)); ctx.fillStyle = C.moderno; ctx.fillRect(0, 0, W, HH); P.microSD(ctx, 540, 960, lerp(26, 260, u), { rot: -0.12 * (1 - u), back: true }); P.techGrade(ctx, 0.6); }
  else { const cam = shot([[tz, [-22, 100, 95], [XS, 95, 0], 900], [tz + 2.6, [140, 135, 270], [-15, 94, 0], 920], [TB.b3, [190, 145, 300], [2, 96, 0], 940]], t); room(ctx, t, cam, { foot: [102, 0, 28], w: { point: sm(T.maquina1 - 0.2, T.maquina1 + 0.5, t) } }); warm(ctx, 1); }
  if (warmT > 0) { ctx.fillStyle = `rgba(255,230,180,${warmT * 0.95})`; ctx.fillRect(0, 0, W, HH); }
  scrimTop(ctx, 0.45); if (t > tz) { title(ctx, '1956', t, tz + 0.1, 0, { px: 64 }); pill(ctx, 'MÁS DE UNA TONELADA', 540, 320, t, T.tonelada - 0.15, 0, { px: 40 }); tag(ctx, 'UNIDAD DE DISCOS + COMPRESOR DE AIRE', 540, 400, t, T.tonelada + 0.2); tag(ctx, 'RECONSTRUCCIÓN', 170, 1340, t, tz + 0.3); }
 }, sfx(k) { FX.miniaturizar(k, TB.b2, 0.8, 0.8); FX.saltoTiempo(k, TB.b2 + 0.55, 0.9, 0.7); FX.sala1956(k, TB.b2 + 0.85, TB.b3 - TB.b2 - 0.6, 1); FX.motorDiscos(k, TB.b2 + 0.85, TB.b3 - TB.b2 - 0.6, 0.6); FX.sello(k, T.tonelada - 0.1); } });

 // 3 · ¿POR QUÉ ERA TAN GRANDE? — órbita alrededor de la máquina; las cubiertas empiezan a volverse transparentes
 B.push({ t0: TB.b3, t1: TB.b4, in: { type: 'cut' }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.b3, TB.b4)), an = lerp(0.56, 1.25, u), rr = lerp(330, 255, u), cam = P.cam3([Math.sin(an) * rr * 0.9 - 10, lerp(148, 170, u), Math.cos(an) * rr], [-12, 94, 0], 940);
  room(ctx, t, cam, { foot: [102, 0, 28], w: { point: 1 - sm(TB.b3, TB.b3 + 0.8, t), var: 0 }, m: { xray: sm(TB.b4 - 1.1, TB.b4, t) * 0.55 } }); warm(ctx, 1); scrimTop(ctx, 0.45); title(ctx, '¿POR QUÉ ERA TAN GRANDE?', t, T.como2, 0);
 }, sfx(k) { FX.sala1956(k, TB.b3, TB.b4 - TB.b3, 0.9); FX.motorDiscos(k, TB.b3, TB.b4 - TB.b3, 0.6); k.play('whoosh', TB.b3 + 0.1, { dur: 1.4, top: 700, gain: 0.2 }); } });

 // 4 · ALMACENAMIENTO MAGNÉTICO — la cámara se acerca a la ventana; se revela el eje y los platos; la luz recorre la estructura
 B.push({ t0: TB.b4, t1: TB.b5, in: { type: 'cut' }, draw(ctx, t) {
  const cam = shot([[TB.b4, [120, 165, 250], [-12, 94, 0], 940], [TB.b4 + 2.4, [10, 118, 115], [XS, 92, 0], 900], [TB.b5, [-2, 104, 82], [XS, 92, 0], 880]], t);
  room(ctx, t, cam, { m: { xray: lerp(0.55, 1, sm(TB.b4, TB.b4 + 1.2, t)) } });
  const sw = win(t, TB.b4 + 1.2, TB.b5 - 0.2); if (sw > 0 && sw < 1) { ctx.save(); const y = lerp(1500, 300, E.inOut(sw)), g = ctx.createLinearGradient(0, y - 120, 0, y + 120); g.addColorStop(0, 'rgba(216,173,114,0)'); g.addColorStop(0.5, 'rgba(255,225,170,0.22)'); g.addColorStop(1, 'rgba(216,173,114,0)'); ctx.fillStyle = g; ctx.globalCompositeOperation = 'screen'; ctx.fillRect(0, y - 120, W, 240); ctx.restore(); }
  warm(ctx, 1); scrimTop(ctx, 0.45); title(ctx, 'ALMACENAMIENTO MAGNÉTICO', t, T.tecnologia3 - 0.2, 0); tag(ctx, 'PRIMER DISCO DURO COMERCIAL', 540, 300, t, T.revoluciono, { px: 34 });
 }, sfx(k) { FX.motorDiscos(k, TB.b4, TB.b5 - TB.b4, 0.8); k.play('whoosh', TB.b4 + 0.3, { dur: 1.6, top: 1200, gain: 0.3 }); k.play('riser', TB.b4 + 1.2, { dur: 1.8, gain: 0.25 }); FX.aparece(k, T.tecnologia3 - 0.2, 480); } });

 // 5 · IBM RAMAC — FOTOGRAFÍA REAL del IBM 305 RAMAC; 305 = sistema completo, 350 = unidad de discos
 B.push({ t0: TB.b5, t1: TB.b6, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const cam = shot([[TB.b5, [-120, 225, 560], [-130, 100, 0], 900], [TB.b6, [-105, 180, 500], [-120, 92, 0], 900]], t); room(ctx, t, cam, { sys: true, foot: [118, 0, 40], w: { var: 1, point: 0 } }); warm(ctx, 1);
  const t0 = TB.b5 + 0.15, t1 = TB.b6 - 0.15; dimAll(ctx, 0.62 * sm(t0, t0 + 0.5, t) * (1 - sm(t1 - 0.5, t1, t)));
  P.photoCard(ctx, IMG.ramac, 540, 700, 900, 620, t, t0, t1, { tag: 'FOTOGRAFÍA REAL', label: 'IBM 305 RAMAC · 1956', credit: 'Dominio público', zoom: [0.6, 0.5, 1.0, 0.68, 0.5, 1.08] });
  scrimTop(ctx, 0.45); title(ctx, 'LA MÁQUINA REAL', t, t0, 0); pill(ctx, 'IBM 305 RAMAC: SISTEMA INFORMÁTICO COMPLETO', 540, 1265, t, T.ramac + 0.05, 0, { px: 32, t1 }); pill(ctx, 'IBM 350: SU UNIDAD DE DISCOS', 540, 1345, t, T.ramac + 0.45, 0, { px: 32, t1 });
 }, sfx(k) { FX.sala1956(k, TB.b5, TB.b6 - TB.b5, 0.8); FX.aparece(k, TB.b5 + 0.2, 500); k.play('shutter', TB.b5 + 0.25, { gain: 0.4 }); FX.etiqueta(k, T.ramac + 0.05); FX.etiqueta(k, T.ramac + 0.45); } });

 // 6 · 50 DISCOS — se retira el cristal, la pila gira, el carro y el brazo cambian de disco de forma plausible, se cuentan y la cámara entra entre dos platos
 const gapK = 25, gapY = P.r350y(gapK) + R3.pitch / 2;
 const armB6 = (t) => { const a = TB.b6 + 0.3, b = a + 0.5, c = b + 0.8, d = T.giraban + 0.3; return { k: lerp(10, gapK, E.inOut(win(t, b, c))), ext: t < b ? lerp(0.5, 0, E.inOut(win(t, a, b))) : t < c ? 0 : 0.6 * E.inOut(win(t, c + 0.1, d)) }; };
 B.push({ t0: TB.b6, t1: TB.b7, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const ti = T.giraban + 0.45, cam = shot([[TB.b6, [105, 85, 175], [XS, 90, 0], 900], [T.n50 - 0.2, [100, 118, 160], [XS, 95, 0], 900], [T.n50 + 1.1, [95, 140, 150], [XS, 97, 0], 900], [ti, [16, gapY, 70], [XS, gapY, 0], 760], [TB.b7, [-1, gapY, 44], [XS, gapY, 0], 700]], t);
  room(ctx, t, cam, { m: { open: sm(TB.b6 + 0.1, TB.b6 + 1.0, t), count: lerp(0, 50, E.inOut(win(t, T.n50 - 0.3, T.n50 + 1.1))), arm: armB6(t) } });
  warm(ctx, 1); scrimTop(ctx, 0.45); title(ctx, '50 DISCOS MAGNÉTICOS', t, T.n50 - 0.2, 0);
  const c = sm(T.n50 - 0.3, T.n50, t) * (1 - sm(ti - 0.3, ti, t)); if (c > 0) { ctx.save(); ctx.globalAlpha *= c; ctx.fillStyle = 'rgba(17,26,33,0.88)'; ctx.beginPath(); ctx.roundRect(790, 300, 230, 170, 20); ctx.fill(); ctx.strokeStyle = C.calida; ctx.lineWidth = 3; ctx.stroke(); txt(ctx, String(Math.round(lerp(0, 50, E.inOut(win(t, T.n50 - 0.3, T.n50 + 1.1))))), 905, 370, 84, C.oro, { f: 'Fraunces', w: 700 }); txt(ctx, 'DISCOS', 905, 440, 32, C.blanco); ctx.restore(); }
  tag(ctx, 'UN SOLO EJE · GIRAN JUNTOS', 540, 1330, t, T.giraban - 0.2, { t1: ti, px: 34 });
 }, sfx(k) { FX.panel(k, TB.b6 + 0.1); FX.motorDiscos(k, TB.b6 + 0.5, TB.b7 - TB.b6 - 0.5, 1, 1); FX.carro(k, TB.b6 + 0.3, 0.5, 0.5); FX.carro(k, TB.b6 + 0.8, 0.8, 0.8); FX.carro(k, TB.b6 + 1.7, T.giraban + 0.3 - TB.b6 - 1.7, 0.5); FX.contador(k, T.n50 - 0.3, T.n50 + 1.1, 0, 50); k.play('whoosh', T.giraban + 0.45, { dur: 1.1, top: 900, gain: 0.3 }); } });

 // 7 · 61 CM — acercamiento a un disco; FOTOGRAFÍA REAL del disco RAMAC junto al gráfico de su diámetro
 B.push({ t0: TB.b7, t1: TB.b8, in: { type: 'cut' }, draw(ctx, t) {
  const tc = TB.b7 + 0.7; if (t < tc + 0.4) { const cam = shot([[TB.b7, [-1, gapY, 44], [XS, gapY, 0], 700], [tc + 0.4, [XS + 8, P.r350y(40) + 9, 26], [XS + 4, P.r350y(40), 8], 760]], t); room(ctx, t, cam, { m: { open: 1, xray: 1, hl: { k: 40, a: sm(TB.b7, tc, t) * 0.4 } } }); warm(ctx, 1); }
  const f = sm(tc, tc + 0.4, t); if (f > 0) { ctx.save(); ctx.globalAlpha *= f; const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#2a2620'); g.addColorStop(1, '#141310'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.restore();
   P.photoCard(ctx, IMG.disco, 540, 600, 560, 500, t, tc, TB.b8 - 0.1, { tag: 'PIEZA REAL', label: 'DISCO DEL IBM 350', credit: 'Foto: Mikaël Restoux · CC BY 2.5', zoom: [0.5, 0.5, 1, 0.5, 0.5, 1.04] });
   const d = sm(T.n60 - 0.2, T.n60 + 0.4, t); ctx.save(); ctx.globalAlpha *= f; annulus(ctx, 540, 1215, 235, 0.32); ctx.restore(); P.dimLine(ctx, 305, 1215, 775, 1215, '≈ 61 CM · 24″', { a: d, px: 40, off: -62 }); }
  scrimTop(ctx, 0.45); title(ctx, '61 CM DE DIÁMETRO', t, T.n60 - 0.2, 0);
 }, sfx(k) { FX.motorDiscos(k, TB.b7, 0.9, 0.6); k.play('whoosh', TB.b7 + 0.7, { dur: 0.5, top: 1400, gain: 0.3 }); k.play('shutter', TB.b7 + 0.75, { gain: 0.4 }); FX.flecha(k, T.n60 - 0.2, 0.6); FX.aparece(k, T.diametro, 560); } });

 // 8 · ¡PERO MIRA SU CAPACIDAD! — vuelta al conjunto: la máquina llena la pantalla y la luz baja alrededor
 B.push({ t0: TB.b8, t1: TB.b9, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const cam = shot([[TB.b8, [50, 112, 118], [XS, 94, 0], 880], [TB.b9, [125, 145, 225], [-15, 96, 0], 920]], t); room(ctx, t, cam, { m: { open: 1, xray: 0.8 } });
  warm(ctx, 1); const dim = sm(TB.b8, TB.b9, t); const g = ctx.createRadialGradient(540, 960, 300, 540, 960, 1000); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${0.6 * dim})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  scrimTop(ctx, 0.45); title(ctx, '¡PERO MIRA SU CAPACIDAD!', t, T.pero7 + 0.1, 0);
 }, sfx(k) { FX.motorDiscos(k, TB.b8, TB.b9 - TB.b8, 0.7); k.play('riser', TB.b9 - 1.2, { dur: 1.2, gain: 0.3 }); } });

 // 9 · ¡SOLO 3,75 MB! — 5.000.000 de caracteres de 6 bits = 30.000.000 bits = 3.750.000 bytes ≈ 3,75 MB; microSD a escala real con lupa
 B.push({ t0: TB.b9, t1: TB.b10, in: { type: 'cut' }, draw(ctx, t) {
  const cam = shot([[TB.b9, [170, 155, 300], [-8, 96, 0], 940], [TB.b10, [220, 165, 380], [-8, 94, 0], 940]], t); room(ctx, t, cam, { m: { xray: 0.25 } }); warm(ctx, 1); scrimTop(ctx, 0.45);
  const c = sm(TB.b9 + 0.2, TB.b9 + 0.5, t); if (c > 0) { ctx.save(); ctx.globalAlpha *= c; ctx.fillStyle = 'rgba(17,26,33,0.92)'; ctx.beginPath(); ctx.roundRect(110, 290, 860, 330, 26); ctx.fill(); ctx.strokeStyle = C.oro; ctx.lineWidth = 4; ctx.stroke();
   const cu = win(t, TB.b9 + 0.3, T.equivalente - 0.1), n = Math.round(lerp(0, 5000000, E.out(cu)) / 1000) * 1000, done = cu >= 1, ns = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); txt(ctx, ns, 540, 365, 72, done ? C.blanco : 'rgba(245,247,248,0.6)', { f: '"IBM Plex Mono"', w: 700 }); txt(ctx, done ? 'CARACTERES DE 6 BITS' : 'CONTANDO…', 540, 428, 32, C.datos, { w: 800 });
   const e1 = sm(T.equivalente, T.equivalente + 0.4, t); if (e1 > 0) { ctx.globalAlpha = c * e1; txt(ctx, '× 6 BITS = 30.000.000 BITS = 3.750.000 BYTES', 540, 490, 32, C.blanco, { w: 700 }); }
   const e2 = sm(T.n4 - 0.1, T.n4 + 0.3, t); if (e2 > 0) { ctx.globalAlpha = c * e2; txt(ctx, '≈ 3,75 MB', 540, 563, 64, C.oro, { w: 900 }); } ctx.restore(); }
  title(ctx, '¡SOLO 3,75 MB!', t, T.n4 - 0.1, 1, { px: 58 }); tag(ctx, 'MENOS DE 4 MB', 540, 680, t, T.n4 + 0.25, { px: 34 });
  const m = sm(T.actuales, T.actuales + 0.4, t); if (m > 0) { const cp = cam.clip([[30, R3.H + 0.1, 20]], 1)[0]; if (cp) { ctx.save(); ctx.globalAlpha *= m; P.microSD(ctx, cp[0], cp[1] - 2, Math.max(0.3, 920 / cp[2] * 0.1), {}); const lx = 820, ly = 1000; ctx.strokeStyle = C.oro; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cp[0], cp[1]); ctx.lineTo(lx - 115, ly - 40); ctx.stroke(); ctx.fillStyle = '#c9cec9'; ctx.beginPath(); ctx.arc(lx, ly, 125, 0, TAU); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, 120, 0, TAU); ctx.clip(); ctx.fillStyle = '#b4bab4'; ctx.fillRect(lx - 130, ly + 50, 260, 100); P.microSD(ctx, lx, ly - 10, 9, {}); ctx.restore(); ctx.strokeStyle = C.oro; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(lx, ly, 122, 0, TAU); ctx.stroke(); ctx.restore(); pill(ctx, 'microSD A ESCALA REAL', lx - 60, ly + 175, t, T.actuales + 0.1, 1, { px: 32 }); } }
 }, sfx(k) { FX.contador(k, TB.b9 + 0.3, T.equivalente - 0.1, 0, 60); FX.etiqueta(k, T.equivalente); FX.sello(k, T.n4); FX.aparece(k, T.actuales + 0.05, 800); } });

 // 10 · UNA FOTO PUEDE OCUPAR MÁS — galería del celular; una foto de ejemplo de 5 MB frente a los 3,75 MB del IBM 350
 B.push({ t0: TB.b10, t1: TB.b11, in: { type: 'slide', d: 0.4 }, draw(ctx, t) {
  modernBg(ctx); const big = E.inOut(win(t, T.fotografias9 - 0.2, T.fotografias9 + 0.6)), up = (1 - E.out(win(t, TB.b10, TB.b10 + 0.6))) * 1100; ctx.save(); ctx.translate(0, up);
  P.handHold(ctx, 540, 770, 720, 'back', { v2: true }); P.smartphone(ctx, 540, 770, 720, t, { glow: 0.8, screen: (c, x, y, w, h) => { c.fillStyle = '#0f1724'; c.fillRect(x, y, w, h); const n = 3, s = (w - 24) / n; for (let i = 0; i < 12; i++) { const gx = x + 12 + (i % n) * s + s / 2, gy = y + 70 + Math.floor(i / n) * s + s / 2; if (i !== 4) P.photoTile(c, gx, gy, s * 0.86, i + 3); } const cx0 = x + 12 + s * 1.5, cy0 = y + 70 + s * 1.5, cx1 = x + w / 2, cy1 = y + h * 0.45, ss = lerp(s * 0.86, w * 0.92, big); if (big > 0) { c.fillStyle = `rgba(0,0,0,${0.6 * big})`; c.fillRect(x, y, w, h); } P.photoTile(c, lerp(cx0, cx1, big), lerp(cy0, cy1, big), ss, 7); if (big > 0.6) { c.save(); c.globalAlpha = sm(0.6, 1, big); c.font = '800 32px Nunito'; c.fillStyle = '#FFD447'; c.textAlign = 'center'; c.fillText('FOTO DE EJEMPLO', x + w / 2, y + h * 0.8); c.font = '900 44px Nunito'; c.fillText('5 MB', x + w / 2, y + h * 0.87); c.restore(); } } }); P.handHold(ctx, 540, 770, 720, 'front', { v2: true }); ctx.restore();
  const b = sm(T.espacio9 - 0.6, T.espacio9, t); if (b > 0) { ctx.save(); ctx.globalAlpha *= b; ctx.fillStyle = 'rgba(11,20,36,0.92)'; ctx.beginPath(); ctx.roundRect(70, 1180, 940, 240, 24); ctx.fill(); ctx.restore(); P.capBars(ctx, 110, 1255, 860, [{ label: 'IBM 350 COMPLETO · ≈ 3,75 MB', mb: 3.75, col: C.calida }, { label: 'UNA FOTO DE EJEMPLO · 5 MB', mb: 5, col: C.cian }], 5, win(t, T.espacio9 - 0.6, T.espacio9 + 0.6), { bh: 30, gap: 76 }); }
  P.techGrade(ctx, 0.5); scrimTop(ctx, 0.4); title(ctx, 'UNA FOTO PUEDE OCUPAR MÁS', t, T.celular - 0.4, 1); tag(ctx, 'DEPENDE DEL FORMATO Y LA RESOLUCIÓN', 540, 300, t, T.celular, { col: C.datos });
 }, sfx(k) { FX.encender(k, TB.b10 + 0.3, 0.7); k.play('whoosh', T.fotografias9 - 0.2, { dur: 0.6, top: 2000, gain: 0.3 }); FX.etiqueta(k, T.fotografias9 + 0.6); FX.flecha(k, T.espacio9 - 0.5, 0.8); } });

 // 11 · ¿CÓMO ALMACENABA INFORMACIÓN? — de vuelta al RAMAC: la cámara baja hasta la superficie de un disco → la pista magnética
 B.push({ t0: TB.b11, t1: TB.b12, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const tm = TB.b12 - 0.55, cam = shot([[TB.b11, [100, 170, 190], [XS, 105, 0], 900], [tm, [XS + 10, R3.top + 7, 13], [XS + 16, R3.top, 5], 800]], t);
  if (t < tm + 0.05) { room(ctx, t, cam, { m: { open: 1, xray: 1 } }); warm(ctx, 1); }
  const f = sm(tm - 0.4, tm + 0.3, t); if (f > 0) { ctx.save(); ctx.globalAlpha *= f; ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); P.magTrack(ctx, 0, 420, W, 1000, t, { mode: 'read', speed: 90 }); ctx.restore(); }
  scrimTop(ctx, 0.45); title(ctx, '¿CÓMO ALMACENABA INFORMACIÓN?', t, T.guardaba - 0.3, 0, { px: 48 });
 }, sfx(k) { FX.motorDiscos(k, TB.b11, TB.b12 - TB.b11, 0.8); k.play('whoosh', TB.b11 + 0.3, { dur: 1.6, top: 800, gain: 0.3 }); } });

 // 12 · MATERIAL MAGNÉTICO — corte grande: disco de aluminio + recubrimiento de óxido de hierro con regiones magnetizadas
 B.push({ t0: TB.b12, t1: TB.b13, in: { type: 'cut' }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); const sx = 40, sy = 520, sw = 1000, sh = 640; P.magSection(ctx, sx, sy, sw, sh, t, { n: 5, speed: 50 });
  pill(ctx, 'RECUBRIMIENTO MAGNÉTICO', 540, sy - 60, t, T.cubiertos, 0, { px: 38 }); pill(ctx, 'DISCO DE ALUMINIO', 540, sy + sh * 0.68, t, T.cubiertos + 0.4, 0, { px: 38 });
  tag(ctx, 'REGIONES MAGNETIZADAS EN UN SENTIDO U OTRO', 540, sy + sh + 70, t, T.magnetico, { px: 32 }); tag(ctx, 'ÓXIDO DE HIERRO · REPRESENTACIÓN DIDÁCTICA', 540, 330, t, T.material, { col: C.datos });
  warm(ctx, 0.5); scrimTop(ctx, 0.45); title(ctx, 'MATERIAL MAGNÉTICO', t, T.material - 0.2, 0);
 }, sfx(k) { FX.aparece(k, T.cubiertos, 480); FX.etiqueta(k, T.cubiertos + 0.4); FX.etiqueta(k, T.magnetico); k.noise(TB.b12, { dur: TB.b13 - TB.b12, color: 'pink', filter: 'bandpass', f: 1800, q: 2, gain: 0.012, a: 0.4, hold: 1.5 }); } });

 // 13 · EL MECANISMO DE ACCESO — el brazo se retira, el carro sube hasta otro disco y el brazo entra hasta la pista
 B.push({ t0: TB.b13, t1: TB.b14, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const t1 = TB.b13 + 0.5, t2 = T.movia + 0.3, t3 = T.cabezas + 0.3, ext = t < t1 ? lerp(0.6, 0, E.inOut(win(t, TB.b13, t1))) : t < t2 ? 0 : E.inOut(win(t, t2, t3)) * 0.75, kk = lerp(12, 34, E.inOut(win(t, t1, t2)));
  const cam = shot([[TB.b13, [105, 128, 112], [-6, 95, 0], 880], [TB.b14, [98, 140, 104], [-6, 100, 0], 880]], t); const r = room(ctx, t, cam, { m: { open: 1, xray: 1, arm: { k: kk, ext } } });
  warm(ctx, 1); scrimTop(ctx, 0.45); title(ctx, 'LECTURA Y ESCRITURA', t, T.mecanismo - 0.2, 0);
  if (r.r.column && r.r.armTip) { const a1 = sm(t1, t1 + 0.3, t) * (1 - sm(t2 + 0.2, t2 + 0.5, t)); if (a1 > 0) { ctx.save(); ctx.globalAlpha *= a1; ctx.strokeStyle = C.oro; ctx.fillStyle = C.oro; ctx.lineWidth = 6; const x = r.r.column[0] + 70, y = r.r.armTip[1]; ctx.beginPath(); ctx.moveTo(x, y + 90); ctx.lineTo(x, y - 90); ctx.stroke(); for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, y + s * 110); ctx.lineTo(x - 16, y + s * 84); ctx.lineTo(x + 16, y + s * 84); ctx.closePath(); ctx.fill(); } ctx.restore(); }
   pill(ctx, 'EL CARRO ELIGE EL DISCO', 540, 1300, t, t1 + 0.1, 0, { px: 36, t1: t2 + 0.4 }); pill(ctx, 'EL BRAZO ELIGE LA PISTA', 540, 1300, t, t2 + 0.45, 0, { px: 36 }); }
 }, sfx(k) { FX.motorDiscos(k, TB.b13, TB.b14 - TB.b13, 0.6); FX.carro(k, TB.b13, 0.5, 0.6); FX.carro(k, TB.b13 + 0.55, T.movia + 0.3 - TB.b13 - 0.55, 1); FX.carro(k, T.movia + 0.3, T.cabezas - T.movia, 0.7); } });

 // 14 · ESCRIBIR / LEER — pista grande: la cabeza cambia la magnetización al escribir; al leer, los CAMBIOS dan pulsos eléctricos → bits
 B.push({ t0: TB.b14, t1: TB.b15, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); const rd = t >= T.leer - 0.1, r = P.magTrack(ctx, 0, 380, W, 980, t, { mode: rd ? 'read' : 'write', speed: 100 });
  warm(ctx, 0.4); scrimTop(ctx, 0.45); title(ctx, rd ? 'LEER DATOS' : 'ESCRIBIR DATOS', t, rd ? T.leer - 0.1 : TB.b14 + 0.05, 0, { px: 56 });
  tag(ctx, rd ? 'CAMBIO = 1 · SIN CAMBIO = 0 (SIMPLIFICADO)' : 'LA BOBINA CAMBIA LA MAGNETIZACIÓN', 540, 300, t, rd ? T.leer + 0.1 : TB.b14 + 0.15, { t1: rd ? 99 : T.leer - 0.1, px: 32 }); pill(ctx, 'HUECO DE AIRE: NO TOCA', 790, r.track[1] - 175, t, TB.b14 + 0.5, 0, { px: 32 });
 }, sfx(k) { FX.escribir(k, TB.b14 + 0.1, T.leer - TB.b14 - 0.2, 0.9); FX.leer(k, T.leer, TB.b15 - T.leer - 0.2, 0.9); FX.motorDiscos(k, TB.b14, TB.b15 - TB.b14, 0.4); } });

 // 15 · EL MISMO PRINCIPIO GENERAL — plato de 61 cm frente a un HDD de 3,5″ a la MISMA escala; partes del HDD; FOTOGRAFÍA REAL de un HDD abierto
 B.push({ t0: TB.b15, t1: TB.b16, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#16202a'); g.addColorStop(1, '#0B1424'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const tp = T.decadas + 0.3;
  const z = lerp(1, 4.0, E.inOut(win(t, T.principio + 0.5, T.duros - 0.2))), pxmm = 1.45, hc = [700, 960]; ctx.save(); ctx.translate(hc[0], hc[1]); ctx.scale(z, z); ctx.translate(-hc[0], -hc[1]); annulus(ctx, 470, 900, 305 * pxmm, 0.92); const hd = P.hdd35(ctx, hc[0], hc[1], pxmm, t, {}); ctx.restore();
  const a = 1 - sm(T.principio + 0.3, T.principio + 0.6, t); if (a > 0) { pill(ctx, 'DISCO DEL IBM 350 · 61 CM', 420, 1350, t, TB.b15 + 0.3, 0, { px: 34, t1: T.principio + 0.6 }); pill(ctx, 'HDD 3,5″ (MISMA ESCALA)', 760, 1250, t, TB.b15 + 0.5, 1, { px: 32, t1: T.principio + 0.6 }); }
  const P2 = (p) => [hc[0] + (p[0] - hc[0]) * z, hc[1] + (p[1] - hc[1]) * z], lb = sm(T.duros - 0.3, T.duros, t) * (1 - sm(tp - 0.2, tp, t)); if (lb > 0) { const pl = P2([hd.platter[0] - 25, hd.platter[1] - 30]), pv = P2(hd.pivot), mo = P2(hd.platter); lead(ctx, pl, 250, 420, lb); lead(ctx, pv, 830, 1330, lb); lead(ctx, mo, 250, 1250, lb); pill(ctx, 'PLATO MAGNÉTICO', 280, 420, t, T.duros - 0.3, 1, { px: 32, t1: tp }); pill(ctx, 'BRAZO ACTUADOR', 800, 1330, t, T.duros - 0.2, 1, { px: 32, t1: tp }); pill(ctx, 'MOTOR', 230, 1250, t, T.duros - 0.1, 1, { px: 32, t1: tp }); }
  const t0 = tp, t1 = TB.b16 - 0.1; dimAll(ctx, 0.62 * sm(t0, t0 + 0.5, t)); P.photoCard(ctx, IMG.hdd, 540, 760, 920, 680, t, t0, t1, { tag: 'FOTOGRAFÍA REAL', label: 'DISCO DURO ABIERTO', credit: 'Dominio público', zoom: [0.45, 0.4, 1, 0.55, 0.45, 1.06] }); tag(ctx, 'UNIDAD AVERIADA: NO MUESTRA SU FUNCIONAMIENTO', 540, 1360, t, t0 + 0.6, { col: C.datos });
  P.techGrade(ctx, sm(T.principio + 0.5, T.duros, t) * 0.5); warm(ctx, 1 - sm(T.principio + 0.5, T.duros, t)); scrimTop(ctx, 0.45); title(ctx, 'EL MISMO PRINCIPIO GENERAL', t, T.principio - 0.3, sm(T.principio + 0.5, T.duros, t) > 0.5 ? 1 : 0, { px: 50 });
  tag(ctx, '1956: CARRO QUE SUBE Y BAJA · HDD: BRAZO QUE GIRA', 540, 300, t, T.decadas - 0.4, { col: C.datos, t1: tp });
 }, sfx(k) { FX.aparece(k, TB.b15 + 0.3, 480); FX.miniaturizar(k, T.principio + 0.5, 1.4, 0.8); FX.motorDiscos(k, T.principio + 0.5, TB.b16 - T.principio - 0.5, 0.5); FX.etiqueta(k, T.duros - 0.3); FX.etiqueta(k, T.duros - 0.2); FX.etiqueta(k, T.duros - 0.1); k.play('shutter', T.decadas + 0.35, { gain: 0.4 }); } });

 // 16 · MÁS CAPACIDAD · MENOS ESPACIO — línea de evolución con zoom logarítmico (escalas reales) y barra de capacidad ilustrativa (sin cifras)
 const EVO = [{ x: 0, w: 1520, h: 1720, draw: (c, x, y, s) => front350(c, x, y, s), lab: '1956 · IBM 350' }, { x: 1250, w: 760, h: 1000, draw: (c, x, y, s, t) => P.driveBox(c, x, y, s, '1970', t), lab: 'AÑOS 60–70' }, { x: 1780, w: 146, h: 41, draw: (c, x, y, s, t) => P.driveBox(c, x, y, s, '525', t), lab: 'AÑOS 80 · PC 5,25″' }, { x: 1930, w: 102, h: 26, draw: (c, x, y, s, t) => P.driveBox(c, x, y, s, '35', t), lab: '3,5″' }, { x: 2030, w: 70, h: 9.5, draw: (c, x, y, s, t) => P.driveBox(c, x, y, s, '25', t), lab: 'PORTÁTIL 2,5″' }];
 B.push({ t0: TB.b16, t1: TB.b17, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#1a2430'); g.addColorStop(1, '#0B1424'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const N = EVO.length, prog = (N - 1) * E.inOut(win(t, TB.b16 + 0.2, T.menores)), i0 = Math.floor(Math.min(prog, N - 1.0001)), fr = prog - i0, A2 = EVO[i0], B2 = EVO[Math.min(N - 1, i0 + 1)], spx = (it) => Math.min(700 / it.w, 900 / it.h);
  const s = Math.exp(lerp(Math.log(spx(A2)), Math.log(spx(B2)), E.inOut(fr))), cxw = lerp(A2.x, B2.x, E.inOut(fr)), baseY = 1180;
  ctx.fillStyle = '#2c3640'; ctx.fillRect(0, baseY, W, HH - baseY); for (const it of EVO) { const x = 540 + (it.x - cxw) * s; if (x + it.w * s / 2 < -50 || x - it.w * s / 2 > W + 50) continue; it.draw(ctx, x, baseY, s, t); }
  const cur = EVO[Math.round(prog)]; pill(ctx, cur.lab, 540, 1300, t, TB.b16 + 0.1, 1, { px: 36 });
  const bar = 10 ** Math.floor(Math.log10(250 / s)), bl = bar * s; ctx.save(); ctx.strokeStyle = C.blanco; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(90, 1390); ctx.lineTo(90 + bl, 1390); ctx.moveTo(90, 1376); ctx.lineTo(90, 1404); ctx.moveTo(90 + bl, 1376); ctx.lineTo(90 + bl, 1404); ctx.stroke(); txt(ctx, bar >= 1000 ? bar / 1000 + ' M' : bar >= 10 ? bar / 10 + ' CM' : bar + ' MM', 90 + bl + 20, 1390, 32, C.blanco, { al: 'left' }); ctx.restore();
  const cap = E.inOut(win(t, TB.b16 + 0.2, T.menores + 0.3)); ctx.save(); ctx.fillStyle = 'rgba(11,20,36,0.85)'; ctx.beginPath(); ctx.roundRect(930, 360, 100, 700, 20); ctx.fill(); const hh = 640 * (0.02 + 0.98 * cap ** 2); ctx.fillStyle = C.cian; ctx.beginPath(); ctx.roundRect(950, 1040 - hh, 60, hh, 10); ctx.fill(); ctx.restore(); txt(ctx, 'CAPACIDAD', 940, 1100, 32, C.datos, { w: 900 });
  scrimTop(ctx, 0.4); title(ctx, 'MÁS CAPACIDAD · MENOS ESPACIO', t, TB.b16 + 0.1, 1, { px: 48 }); tag(ctx, 'TAMAÑO: ESCALA REAL · CAPACIDAD: ILUSTRATIVA', 540, 290, t, TB.b16 + 0.3);
 }, sfx(k) { for (let i = 1; i < EVO.length; i++) FX.miniaturizar(k, TB.b16 + 0.2 + (T.menores - TB.b16 - 0.2) * (i - 0.6) / (EVO.length - 1), 0.9, 0.6); } });

 // 17 · MEMORIA FLASH — mismo propósito, otra tecnología: HDD (magnético, gira) frente a microSD (electrónica, sin piezas móviles);
 // chip NAND y celda de puerta flotante que guarda carga eléctrica
 B.push({ t0: TB.b17, t1: TB.b18, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  modernBg(ctx); const ta = T.memorias15 + 0.2, tb2 = T.sin15 - 0.25;
  if (t < ta + 0.3) { const a = 1 - sm(ta, ta + 0.3, t); ctx.save(); ctx.globalAlpha *= a; P.hdd35(ctx, 290, 860, 3.0, t, {}); P.microSD(ctx, 800, 820, 24, { glow: 0.5 }); ctx.fillStyle = 'rgba(245,247,248,0.15)'; ctx.fillRect(538, 520, 4, 700); ctx.restore(); pill(ctx, 'HDD: MAGNÉTICO · GIRA', 290, 1180, t, TB.b17 + 0.3, 0, { px: 32, t1: ta + 0.3 }); pill(ctx, 'microSD: ELECTRÓNICA', 800, 1180, t, TB.b17 + 0.5, 1, { px: 32, t1: ta + 0.3 }); tag(ctx, 'SIN PIEZAS MÓVILES', 800, 1260, t, TB.b17 + 0.7, { col: C.datos, t1: ta + 0.3 }); }
  const c1 = sm(ta, ta + 0.3, t) * (1 - sm(tb2 - 0.2, tb2 + 0.1, t)); if (c1 > 0) { ctx.save(); ctx.globalAlpha *= c1; P.flashChip(ctx, 540, 860, lerp(16, 26, win(t, ta, tb2)), t, { die: sm(ta + 0.3, tb2 - 0.3, t), glow: 0.6 }); ctx.restore(); pill(ctx, 'CHIP DE MEMORIA NAND FLASH', 540, 1330, t, ta + 0.2, 1, { px: 34, t1: tb2 + 0.1 }); }
  const c2 = sm(tb2 - 0.1, tb2 + 0.3, t); if (c2 > 0) { ctx.save(); ctx.globalAlpha *= c2; const q = 0.5 + 0.5 * Math.sin((t - tb2) * 2.6 - Math.PI / 2); const fc = P.flashCell(ctx, 80, 500, 920, 740, t, { charge: q }); ctx.restore(); lead(ctx, fc.fg, 300, 420, c2); pill(ctx, 'PUERTA FLOTANTE', 300, 420, t, tb2 + 0.1, 1, { px: 32 }); lead(ctx, fc.ch, 780, 1220, c2, C.datos); pill(ctx, 'CANAL', 820, 1220, t, tb2 + 0.2, 1, { px: 32 }); const q2 = 0.5 + 0.5 * Math.sin((t - tb2) * 2.6 - Math.PI / 2); tag(ctx, q2 > 0.5 ? 'CON CARGA → 0' : 'SIN CARGA → 1', 540, 1300, t, tb2 + 0.2, { px: 36 }); tag(ctx, 'NO VOLÁTIL: CONSERVA LOS DATOS SIN ENERGÍA', 540, 1375, t, T.giratorios, { col: C.datos }); }
  P.techGrade(ctx, 0.6); scrimTop(ctx, 0.45); title(ctx, t < ta ? 'MISMO PROPÓSITO, OTRA TECNOLOGÍA' : t < tb2 ? 'MEMORIA FLASH' : 'SIN DISCOS GIRATORIOS', t, t < ta ? TB.b17 + 0.1 : t < tb2 ? ta : tb2, 1, { px: t < ta ? 44 : 52 });
 }, sfx(k) { FX.motorDiscos(k, TB.b17, T.memorias15 + 0.4 - TB.b17, 0.35); FX.etiqueta(k, TB.b17 + 0.3); FX.etiqueta(k, TB.b17 + 0.5); FX.chipFlash(k, T.memorias15 + 0.25); k.play('whoosh', T.sin15 - 0.25, { dur: 0.6, top: 2400, gain: 0.3 }); FX.flujoDatos(k, T.sin15, 1.2, 0.5); } });

 // 18 · 70 AÑOS DE EVOLUCIÓN — de la máquina de 1956 a la yema del dedo (cada paso con su tamaño real escrito; escala ajustada en cada paso)
 const TL = [{ k: '350', w: 1520, fit: 640, d: '1,52 M DE ANCHO' }, { k: '1970', w: 760, fit: 520, d: '≈ 76 CM' }, { k: '525', w: 146, fit: 620, d: '14,6 CM' }, { k: '35', w: 102, fit: 560, d: '10,2 CM' }, { k: 'chip', w: 38, fit: 560, d: 'CHIP ≈ 1,2 CM' }, { k: 'sd', w: 11, fit: 330, d: '1,1 CM' }];
 B.push({ t0: TB.b18, t1: TB.b19, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const ta = T.gigantescas + 0.4, tb2 = T.enormes16 + 0.2;
  if (t < ta) { const cam = shot([[TB.b18, [200, 155, 330], [-8, 94, 0], 940], [ta, [250, 168, 410], [-8, 94, 0], 940]], t); room(ctx, t, cam, {}); warm(ctx, 1); }
  else if (t < tb2) { const u = win(t, ta, tb2), g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, P.mixc('#2a2620', '#16304f', u)); g.addColorStop(1, P.mixc('#141310', '#0B1424', u)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); const pr = (TL.length - 1) * E.inOut(u), i0 = Math.floor(Math.min(pr, TL.length - 1.0001)), fr = pr - i0, cur = TL[i0], nx = TL[i0 + 1], s0 = cur.fit / cur.w, s1 = nx.fit / nx.w, s = Math.exp(lerp(Math.log(s0), Math.log(s1), E.inOut(fr))), base = 1180;
   const drawK = (it, sc, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; if (it.k === '350') front350(ctx, 540, base, sc); else if (it.k === 'chip') P.flashChip(ctx, 540, base - 9 * sc, sc, t, { glow: 0.5 }); else if (it.k === 'sd') P.microSD(ctx, 540, base - 7.5 * sc, sc, {}); else P.driveBox(ctx, 540, base, sc, it.k, t); ctx.restore(); };
   drawK(cur, s, 1 - sm(0.45, 0.9, fr)); drawK(nx, s, sm(0.1, 0.55, fr)); txt(ctx, fr < 0.5 ? cur.d : nx.d, 540, 1235, 36, C.blanco, { w: 800 }); ctx.save(); ctx.fillStyle = 'rgba(11,20,36,0.88)'; ctx.beginPath(); ctx.roundRect(330, 1290, 420, 120, 24); ctx.fill(); ctx.restore(); const YR = ['1956', '≈ 1970', '≈ 1980', '≈ 1990', '≈ 2005', 'HOY']; txt(ctx, fr < 0.5 ? YR[i0] : YR[i0 + 1], 540, 1352, 72, C.oro, { f: '"Space Grotesk"', w: 700 }); tag(ctx, 'ESCALA AJUSTADA EN CADA PASO', 540, 300, t, ta + 0.1, { col: C.datos, t1: tb2 }); warm(ctx, 1 - u); P.techGrade(ctx, u * 0.5); }
  else { const u = E.out(win(t, tb2, TB.b19)); modernBg(ctx); P.fingertip(ctx, 600, lerp(820, 760, u), lerp(100, 150, u), t, { glow: 0.5 }); P.techGrade(ctx, 0.6); }
  scrimTop(ctx, 0.45); title(ctx, '70 AÑOS DE EVOLUCIÓN', t, T.y16 + 0.1, t < ta ? 0 : 1);
 }, sfx(k) { FX.sala1956(k, TB.b18, T.gigantescas + 0.4 - TB.b18, 0.7); FX.miniaturizar(k, T.gigantescas + 0.4, T.enormes16 - T.gigantescas - 0.2, 0.9); for (let i = 1; i < 6; i++) FX.etiqueta(k, T.gigantescas + 0.4 + (T.enormes16 - T.gigantescas - 0.2) * (i - 0.5) / 5); FX.encender(k, T.enormes16 + 0.25, 0.7); } });

 // 19 · COMPARACIÓN FINAL — TAMAÑO (escala real: el técnico sostiene la tarjeta junto a la máquina, con lupa) y, por separado,
 // CAPACIDAD (ejemplo de 1 TB); FOTOGRAFÍA REAL de una microSD con su adaptador
 B.push({ t0: TB.b19, t1: TB.b20, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const tp = T.hoy17 - 0.15;
  if (t < tp + 0.5) { const cam = shot([[TB.b19, [215, 150, 330], [10, 100, 0], 940], [tp + 0.5, [190, 145, 285], [20, 100, 0], 940]], t), r = room(ctx, t, cam, { foot: [118, 0, 40], w: { var: 2, point: sm(TB.b19 + 0.2, TB.b19 + 0.8, t) } }); warm(ctx, 1);
   if (r.wk) { const hp = r.wk.hand, mm = r.wk.px / 1750; P.microSD(ctx, hp[0] + 3, hp[1] - 4, Math.max(0.12, mm), {}); const lx = 820, ly = 1030, la = sm(TB.b19 + 0.7, TB.b19 + 1.1, t); if (la > 0) { ctx.save(); ctx.globalAlpha *= la; ctx.strokeStyle = C.oro; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hp[0], hp[1]); ctx.lineTo(lx - 110, ly - 50); ctx.stroke(); ctx.fillStyle = '#0B1424'; ctx.beginPath(); ctx.arc(lx, ly, 125, 0, TAU); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, 120, 0, TAU); ctx.clip(); P.fingertip(ctx, lx + 10, ly - 40, 70, t, {}); ctx.restore(); ctx.strokeStyle = C.oro; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(lx, ly, 122, 0, TAU); ctx.stroke(); ctx.restore(); } }
   pill(ctx, 'TAMAÑO FÍSICO · ESCALA REAL', 540, 320, t, TB.b19 + 0.2, 0, { px: 36, t1: tp + 0.5 }); }
  const f = sm(tp, tp + 0.5, t); if (f > 0) { ctx.save(); ctx.globalAlpha *= f; modernBg(ctx); ctx.restore(); P.photoCard(ctx, IMG.sd, 540, 610, 860, 480, t, tp, TB.b20 + 0.05, { tag: 'FOTOGRAFÍA REAL', label: 'microSD CON ADAPTADOR', credit: 'Wikimedia Commons · CC0', zoom: [0.75, 0.5, 1, 0.8, 0.5, 1.05] });
   const ca = sm(T.punta - 0.3, T.punta + 0.1, t); if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; ctx.fillStyle = 'rgba(11,20,36,0.92)'; ctx.beginPath(); ctx.roundRect(90, 1080, 900, 330, 24); ctx.fill(); ctx.strokeStyle = C.cian; ctx.lineWidth = 3; ctx.stroke(); txt(ctx, 'CAPACIDAD · EJEMPLO', 540, 1130, 34, C.datos, { w: 900 }); txt(ctx, 'IBM 350: ≈ 3,75 MB', 540, 1195, 36, C.calida); txt(ctx, 'microSD DE 1 TB: 1.000.000 MB', 540, 1255, 36, C.blanco); txt(ctx, '≈ 266.667 VECES MÁS', 540, 1340, 52, C.oro, { w: 900 }); ctx.restore(); } }
  P.techGrade(ctx, f * 0.5); scrimTop(ctx, 0.4); title(ctx, t < tp ? 'DE UNA MÁQUINA ENTERA…' : '¡EN LA PUNTA DE TU DEDO!', t, t < tp ? TB.b19 + 0.1 : tp, t < tp ? 0 : 1);
 }, sfx(k) { FX.sala1956(k, TB.b19, T.hoy17 - TB.b19, 0.6); FX.aparece(k, TB.b19 + 0.8, 760); k.play('shutter', T.hoy17 - 0.1, { gain: 0.4 }); FX.chipFlash(k, T.hoy17 + 0.1, 0.6); FX.sello(k, T.punta + 0.15); } });

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
 window.EPISODIO = { explainer: EP.explainer, init: async () => { for (const k of Object.keys(window.FOTOS || {})) { IMG[k] = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = window.FOTOS[k]; }); } }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
