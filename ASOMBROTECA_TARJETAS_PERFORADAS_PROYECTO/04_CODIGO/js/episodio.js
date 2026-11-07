// =====================================================================================================
// episodio.js — «Cuando las computadoras utilizaban tarjetas perforadas» · Asombroteca · Ep. 05 · PLANTILLA v1.23 (tarjetas)
// Progresión: TARJETA → PERFORACIONES → CÓDIGO → LECTOR → SEÑAL → LÍNEAS DE PROGRAMA → MAZOS → CENSO DE 1890 → COMPUTACIÓN
// ELECTRÓNICA → MEMORIA FLASH. Tarjeta protagonista: IBM de 80 columnas con agujeros REALES (P.punchCard3), código de tarjeta real
// (dígito = 1 perforación; letra = zona 12/11/0 + dígito), lector de escobillas elegido como único mecanismo de lectura del s. XX,
// y el sistema de Hollerith de 1890 (agujas, mercurio, diales) como OTRA época y OTRA tarjeta. Reloj = voz original (87,72 s).
// Las tres imágenes auténticas aparecen como planos flotantes breves (P.floatPhoto) con crédito y licencia.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS, IMG = {};
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = { usb: wt(0, 'usb'), agujeros: wt(2, 'agujeros'), papel: wt(4, 'papel'), posicion: wt(5, 'posición'), columnas: wt(6, 'columnas'), agujeros7: wt(7, 'agujeros'), lector: wt(7, 'lector'), numeros: wt(7, 'números'), letras: wt(7, 'letras'), instrucciones: wt(7, 'instrucciones'),
  impresas: wt(8, 'impresas'), perforaciones: wt(11, 'perforaciones'), tarjeta13: wt(13, 'tarjeta'), linea: wt(13, 'línea'), programa13: wt(13, 'programa'), miles: wt(14, 'miles'), preparar: wt(14, 'preparar'), ordenar: wt(14, 'ordenar'), desordenaban: wt(15, 'desordenaban'), problema: wt(15, 'problema'),
  antes: wt(16, 'antes'), hollerith: wt(17, 'hollerith'), procesar: wt(17, 'procesar'), censo: wt(17, 'censo'), programas: wt(18, 'programas'), datos18: wt(18, 'datos'), fotografias: wt(19, 'fotografías'), memoria: wt(19, 'memoria'), pila: wt(20, 'pila'), asombroteca: wt(22, 'asombroteca'), end: A.speech_end };
 for (let i = 0; i < A.segments.length; i++) T['s' + i] = SG(i).s;
 const B0 = { b1b: T.s2 - 0.22, b2: T.s3 - 0.18, b3: T.s5 - 0.2, b4: T.s6 - 0.2, b5: T.s7 - 0.2, b6: T.s8 - 0.2, b7: T.s9 - 0.2, b8: T.s10 - 0.2, b9: T.s12 - 0.2, b10: T.s13 - 0.2, b11: T.s14 - 0.2, b12: T.preparar - 0.55, b13: T.s15 - 0.2, b15: T.s16 - 0.2, b16: T.s17 - 0.2, b17: T.procesar + 0.3, b18: T.s18 - 0.2, b19: T.s19 - 0.2, b20: T.s20 - 0.2, b21: T.s21 - 0.2, b22: T.s22 - 0.2 };

 // ---------------- utilidades ----------------
 const C = { oro: '#FFD447', blanco: '#F5F7FA', sepia: '#A67A54', papel: '#DEC9A8', cian: '#53C5E8', fuego: '#FF9A42', espacio: '#050B18' };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.fillStyle = c; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; if (o.ls) ctx.letterSpacing = o.ls + 'px'; if (o.sh) { ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 14; } ctx.fillText(s, x, y); ctx.restore(); };
 // título breve de escena: barra amarilla y texto blanco grande, arriba, con fundido
 const title = (ctx, s, t, t0, t1, o = {}) => { const a = sm(t0, t0 + 0.3, t) * (1 - sm(t1 - 0.3, t1, t)); if (a <= 0) return; const y = o.y || 230, e = E.out(cl((t - t0) / 0.5)); ctx.save(); ctx.globalAlpha *= a; const g = ctx.createLinearGradient(0, 0, 0, y + 170); g.addColorStop(0, 'rgba(0,0,0,0.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, y + 170); ctx.font = `900 ${o.px || 62}px Nunito`; const tw = ctx.measureText(s).width; ctx.fillStyle = C.oro; ctx.fillRect(540 - tw / 2 * e - 10, y + 44, (tw + 20) * e, 8); txt(ctx, s, 540, y, o.px || 62, C.blanco, { w: 900, sh: 1 }); ctx.restore(); };
 const lab = (ctx, s, anchor, x, y, t, t0, t1, o = {}) => P.ykLabel(ctx, s, anchor, x, y, t, t0, t1, o);
 const recon = (ctx, s, t, t0, t1) => P.ykRecon(ctx, t, t0, t1, { s });
 const vign = (ctx, a = 0.4) => { const g = ctx.createRadialGradient(540, 900, 500, 540, 900, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 const shot = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++; const a = keys[i], b = keys[i + 1], u = E.inOut(win(t, a[0], b[0])), L = (p, q) => p.map((v, j) => lerp(v, q[j], u)); return P.cam3(L(a[1], b[1]), L(a[2], b[2]), lerp(a[3] || 900, b[3] || 900, u)); };
 const stars = (ctx, t, n = 260, seed = 4, drift = 0) => { const R = H.rng(seed); ctx.save(); for (let i = 0; i < n; i++) { const x = R() * W, y = ((R() * HH + drift * (0.3 + R())) % HH + HH) % HH, s = R() < 0.08 ? 3 : 1.8; ctx.globalAlpha = 0.35 + R() * 0.65; ctx.fillStyle = '#e8f0ff'; ctx.fillRect(x, y, s, s); } ctx.restore(); };
 const space = (ctx, t, drift = 0) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#02050d'); g.addColorStop(1, '#0a1630'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); stars(ctx, t, 300, 4, drift); };
 const bill = (ctx, cam, foot, h, f) => { const a = cam.clip([foot], 1)[0], b = cam.clip([[foot[0], foot[1] + h, foot[2]]], 1)[0]; if (!a || !b) return null; return f(a[0], a[1], a[1] - b[1]); };
 const actor = (cam, p, f) => ({ d: cam.depth(p), f });
 const sepiaWarm = (ctx, a) => { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = a; ctx.fillStyle = '#E7B56E'; ctx.fillRect(0, 0, W, HH); ctx.restore(); };
 const blueTech = (ctx, a) => P.techGrade(ctx, a);

 // ---------------- datos de la tarjeta protagonista (ejemplo FORTRAN; solo letras, dígitos, espacio y coma: mismo código en 026 y 029) ----------------
 const F = P.CARDF.ibm, pad = (s, n) => (s + ' '.repeat(80)).slice(0, n), seqN = (i) => String(i * 10).padStart(8, '0');
 const LINE = pad('      READ 5, A, B', 72) + seqN(1), HOLES = P.cardHoles(LINE);
 const PROG = ['      READ 5, A, B', '      PRINT 6, A, B', '   10 CONTINUE', '      GO TO 10', '      STOP', '      END'];
 const progLine = (i) => pad(PROG[i % PROG.length], 72) + seqN(i + 1);
 const colX = (c) => -F.w / 2 + F.c0 + (c - 1) * F.dc;
 const techBg = (ctx, t, a = 1) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#0A1621'); g.addColorStop(1, '#0d2436'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.save(); ctx.globalAlpha = 0.07 * a; ctx.strokeStyle = '#4CD3E8'; ctx.lineWidth = 1; for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); } for (let y = 0; y <= HH; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore(); };
 const roomBg = (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#151C21'); g.addColorStop(1, '#263238'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 // mesa de madera (superficie y = 0) en la que se apoyan mazos y tarjetas sueltas
 const table = (ctx, cam, o = {}) => { const x0 = o.x0 ?? -900, x1 = o.x1 ?? 900, z0 = o.z0 ?? -700, z1 = o.z1 ?? 700; P.box3(ctx, cam, x0, x1, -40, 0, z0, z1, '#6B4D35', {}); for (let z = z0; z < z1; z += 120) { const p = cam.pr([x0, 0.1, z]), q = cam.pr([x1, 0.1, z]); if (p[2] > 1 && q[2] > 1) { ctx.strokeStyle = 'rgba(40,25,15,0.25)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); } } const L = cam.pr([-200, 600, -200]); if (L[2] > 1) { const g = ctx.createRadialGradient(L[0], L[1], 20, L[0], L[1], 1100); g.addColorStop(0, 'rgba(223,183,127,0.22)'); g.addColorStop(1, 'rgba(223,183,127,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); } };
 // soporte de mesa para una tarjeta vertical (pinza metálica sobre una base): la tarjeta NO flota
 const stand = (ctx, cam, cd) => { const a = P.cardPt(cd, 14, F.h), b = P.cardPt(cd, F.w - 14, F.h), y = a[1]; P.box3(ctx, cam, -130, 130, y - 26, y - 14, -60, 60, '#465258', {}); for (const p of [a, b]) P.box3(ctx, cam, p[0] - 7, p[0] + 7, y - 14, y + 9, p[2] - 5, p[2] + 5, '#899397', {}); };
 // tarjeta vista de frente a escala fija: (cx, cy) centro en pantalla, k = px por mm
 const flatCard = (ctx, cd, cx, cy, k, t, o = {}) => { const D = 400, cam = P.cam3([0, 0, D], [0, 0, 0], k * D); ctx.save(); ctx.translate(cx - 540, cy - 960); const r = P.punchCard3(ctx, cam, cd, t, o); ctx.restore(); return r; };
 const cardAt = (c, o = {}) => Object.assign(P.cardFrame(c, o), { holes: o.holes || HOLES, text: o.text ?? LINE });
 // contactos de las escobillas (z = 0) para una tarjeta boca abajo con centro en z = zc (fila 9 delante, hacia −z)
 const contactsAt = (holes, zc) => holes.filter(([c, r]) => Math.abs(zc + F.h / 2 - P.holeUV('ibm', c, r)[1]) < F.hh / 2).map(([c]) => c);
 const crossTimes = (fz, a, b, holes) => { const out = [], vs = [...new Set(holes.map(([c, r]) => P.holeUV('ibm', c, r)[1]))]; for (const v of vs) { let prev = null; for (let i = 0; i <= 400; i++) { const t = lerp(a, b, i / 400), d = fz(t) + F.h / 2 - v; if (prev != null && Math.sign(d) !== Math.sign(prev)) { out.push(t); break; } prev = d; } } return out.sort((p, q) => p - q); };
 // tira de decodificación horizontal: las 12 posiciones de una columna, las detectadas encendidas y el símbolo
 const rowStrip = (ctx, x, y, rows, sym, a, t, o = {}) => { const cw = 58; ctx.save(); ctx.fillStyle = 'rgba(10,22,33,0.92)'; ctx.beginPath(); ctx.roundRect(x - 20, y - 70, 12 * cw + 250, 150, 22); ctx.fill(); ctx.strokeStyle = 'rgba(76,211,232,0.35)'; ctx.lineWidth = 2; ctx.stroke(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  P.CROWS.forEach((r, i) => { const on = rows.includes(r), cx = x + i * cw + cw / 2; ctx.fillStyle = on ? '#FFD447' : 'rgba(228,215,186,0.16)'; ctx.fillRect(cx - 9, y - 4, 18, 40); if (on) P.glow(ctx, cx, y + 16, 46, '255,212,71', 0.45); ctx.font = '700 32px "IBM Plex Mono"'; ctx.fillStyle = on ? '#FFD447' : 'rgba(245,247,247,0.6)'; ctx.fillText(String(r), cx, y - 38); });
  if (a > 0 && sym) { ctx.globalAlpha *= cl(a); ctx.fillStyle = '#4CD3E8'; ctx.font = '900 56px Nunito'; ctx.fillText('→', x + 12 * cw + 50, y); ctx.fillStyle = '#F5F7F7'; ctx.font = `900 ${o.px || 92}px "IBM Plex Mono"`; ctx.fillText(sym, x + 12 * cw + 160, y + 2); }
  ctx.restore(); };
 const holeLight = (holes, cols, t0, dt, t) => holes.filter(([c]) => cols.includes(c)).map(([c, r], i) => ({ c, r, a: sm(t0 + i * dt, t0 + i * dt + 0.2, t) }));

 const B = [];
 // 1 · GANCHO — una tarjeta real avanza hacia el lector; la cámara la sigue a centímetros; las escobillas detectan sus agujeros
 const zc1 = (t) => lerp(300, -46, E.out(win(t, 0, B0.b1b + 0.3)));
 B.push({ t0: 0, t1: B0.b1b, in: { type: 'cut' }, draw(ctx, t) {
  roomBg(ctx); const zc = zc1(t), u = win(t, 0, B0.b1b), cd = { ...P.cardFrame([0, 900.6, zc], { pitch: Math.PI / 2 }), holes: HOLES }, ct = contactsAt(HOLES, zc);
  const cam = P.cam3([lerp(150, 110, E.inOut(u)), lerp(985, 975, E.inOut(u)), lerp(zc + 150, 150, E.inOut(sm(0.35, 0.9, u)))], [lerp(-20, 0, u), 902, lerp(zc - 25, -10, E.inOut(sm(0.35, 0.9, u)))], 1000);
  P.cardReader3(ctx, cam, t, { card: cd, contacts: ct, hopper: 0, stacker: 60, cover: 0 }); vign(ctx, 0.45);
  title(ctx, '¡COMPUTADORAS QUE LEÍAN CARTÓN!', t, 0.2, 4.4, { px: 50 }); lab(ctx, 'UNA ESCOBILLA POR COLUMNA', null, 540, 1320, t, 4.4, B0.b1b + 0.2, { col: C.oro, sub: 'donde hay agujero, toca el rodillo' }); recon(ctx, 'RECONSTRUCCIÓN ANIMADA · LECTOR', t, 0.6, B0.b1b);
 }, sfx(k) { FX.tarjetaRoce(k, 0.15, 5.5, 0.9); k.play('roller', 0.3, { dur: 6.5, gain: 0.25 }); crossTimes(zc1, 0.2, B0.b1b, HOLES).forEach((tt) => FX.escobilla(k, tt)); } });
 // 1b · la cámara atraviesa un agujero y entra en el mecanismo
 B.push({ t0: B0.b1b, t1: B0.b2, in: { type: 'cut' }, draw(ctx, t) {
  const zc = zc1(t), cd = { ...P.cardFrame([0, 900.6, zc], { pitch: Math.PI / 2 }), holes: HOLES }, [hu, hv] = P.holeUV('ibm', 15, 5), hp = P.cardPt(cd, hu, hv), d = E.in(win(t, B0.b1b, T.agujeros + 0.35));
  const cam = P.cam3([lerp(hp[0] + 60, hp[0], d), lerp(1010, 901.4, d), lerp(hp[2] + 120, hp[2] + 0.35, d)], [hp[0], 900, hp[2] - lerp(40, 0.1, d)], 1000);
  roomBg(ctx); P.cardReader3(ctx, cam, t, { card: cd, contacts: contactsAt(HOLES, zc), hopper: 0, stacker: 60, cover: 0 });
  const q = [[hu - F.hw / 2, hv - F.hh / 2], [hu + F.hw / 2, hv - F.hh / 2], [hu + F.hw / 2, hv + F.hh / 2], [hu - F.hw / 2, hv + F.hh / 2]].map(([a, b]) => cam.pr(P.cardPt(cd, a, b))), full = t > T.agujeros + 0.36;
  const inner = (ia) => { techBg(ctx, t); P.readerSection(ctx, 60, 430, 960, 780, t, { u: lerp(0.18, 0.36, win(t, T.agujeros, B0.b2 + 0.6)), rows: [12, 1] }); lab(ctx, 'DENTRO DEL LECTOR', null, 540, 1320, t, T.agujeros + 0.4, B0.b2 + 0.3, { col: C.cian }); void ia; };
  if (full) inner(1); else if (q.every((p) => p[2] > 0.5)) { ctx.save(); ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.clip(); inner(1); ctx.restore(); }
  if (!full) { vign(ctx, 0.4); lab(ctx, 'TARJETAS LLENAS DE AGUJEROS', null, 540, 1320, t, B0.b1b + 0.1, T.agujeros, { col: C.oro }); }
 }, sfx(k) { k.play('whoosh', T.agujeros - 0.2, { dur: 0.7, top: 2400, gain: 0.3 }); } });
 // 2 · la gran pregunta: la tarjeta en su soporte, la cámara la rodea
 B.push({ t0: B0.b2, t1: B0.b3, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  techBg(ctx, t); const u = win(t, B0.b2, B0.b3), az = lerp(-0.55, 0.45, E.inOut(u)), cd = cardAt([0, 0, 0]), cam = P.cam3([Math.sin(az) * 330, lerp(60, 25, u), Math.cos(az) * 330], [0, -6, 0], 1500);
  stand(ctx, cam, cd); P.punchCard3(ctx, cam, cd, t, {}); title(ctx, '¿CÓMO LO ENTENDÍA?', t, B0.b2 + 0.25, B0.b3 + 0.3, {}); lab(ctx, 'SOLO CARTÓN', null, 540, 1320, t, T.papel - 0.3, B0.b3 + 0.2, { col: C.papel, sub: 'sin electricidad ni magnetismo: solo agujeros' });
 }, sfx(k) { k.play('whoosh', B0.b2 + 0.1, { dur: 1.2, gain: 0.2 }); FX.etiqueta(k, T.papel - 0.3); } });
 // 3 · el secreto: macro sobre las columnas; las posiciones perforadas se iluminan una a una + FOTO 01 (tarjeta real)
 B.push({ t0: B0.b3, t1: B0.b4, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  techBg(ctx, t); const u = win(t, B0.b3, B0.b4), cx = colX(lerp(6, 18, E.inOut(u))), cd = cardAt([0, 0, 0]), cam = P.cam3([cx + 34, 22, 92], [cx - 4, 8, 0], 1050);
  ctx.save(); ctx.translate(0, 370); P.punchCard3(ctx, cam, cd, t, { thk: 3, hl: holeLight(HOLES, [7, 8, 9, 10, 12, 13, 15, 16, 18], T.posicion - 0.3, 0.16, t) }); ctx.restore();
  title(ctx, 'LA POSICIÓN IMPORTABA', t, B0.b3 + 0.2, B0.b4 + 0.2, {});
  P.floatPhoto(ctx, IMG.tarjeta, 540, 540, 760, t, B0.b3 + 0.5, B0.b4 + 0.25, { tag: 'TARJETA IBM REAL', label: 'PROGRAMA FORTRAN · AÑOS 70', sub: 'Universidad de Stuttgart', credit: 'Foto: Harke · CC BY-SA 3.0', from: 1, rotY: -0.1 });
 }, sfx(k) { HOLES.filter(([c]) => [7, 8, 9, 10, 12, 13, 15, 16, 18].includes(c)).forEach((_, i) => k.play('blip', T.posicion - 0.3 + i * 0.16, { f: 1100 + i * 40, dur: 0.05, gain: 0.18, minor: i > 0 })); FX.revelar(k, B0.b3 + 0.5); } });
 // 4 · 80 columnas: la tarjeta completa, se marcan sus columnas y la cámara se acerca a una
 B.push({ t0: B0.b4, t1: B0.b5, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  techBg(ctx, t); const z = E.inOut(win(t, T.columnas - 0.3, B0.b5 + 0.3)), cd = cardAt([0, 0, 0]), x15 = colX(15), cam = P.cam3([lerp(0, x15, z), lerp(0, 4, z), lerp(400, 140, z)], [lerp(0, x15, z), lerp(0, 4, z), 0], 2040);
  const r = P.punchCard3(ctx, cam, cd, t, { band: z > 0.05 ? { c: 15, a: z } : null });
  const sw = win(t, B0.b4 + 0.3, T.columnas); if (r && z < 0.6) { ctx.save(); ctx.globalAlpha = 1 - z / 0.6; for (let c = 1; c <= 80; c++) { if (c / 80 > sw) break; const p = r.proj(F.c0 + (c - 1) * F.dc, -2), tall = c === 1 || c % 10 === 0; ctx.strokeStyle = tall ? C.oro : 'rgba(76,211,232,0.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0], p[1] - (tall ? 34 : 16)); ctx.stroke(); if (c === 1 || c % 20 === 0) txt(ctx, String(c), p[0], p[1] - 62, 32, C.oro, { f: '"IBM Plex Mono"', w: 700 }); } ctx.restore(); }
  if (z > 0.4) { ctx.save(); ctx.globalAlpha = sm(0.4, 0.7, z); P.CROWS.forEach((rr, i) => { const p = r ? r.proj(F.c0 + 13 * F.dc - 2.2, F.r0 + i * F.dr) : null; if (p) txt(ctx, String(rr), p[0], p[1], 32, C.oro, { f: '"IBM Plex Mono"', w: 700, al: 'right' }); }); ctx.restore(); }
  title(ctx, '80 COLUMNAS', t, B0.b4 + 0.2, B0.b5 + 0.2, {}); lab(ctx, 'TARJETA IBM DE 80 COLUMNAS', null, 540, 1320, t, B0.b4 + 0.4, T.columnas - 0.2, { col: C.cian, sub: 'formato de 1928: muy usado, no el único' }); lab(ctx, '12 POSICIONES POR COLUMNA', null, 540, 1320, t, T.columnas, B0.b5 + 0.2, { col: C.oro });
 }, sfx(k) { FX.leer(k, B0.b4 + 0.3, 1.6, 0.6); k.play('whoosh', T.columnas - 0.3, { dur: 0.8, gain: 0.22 }); } });
 // 5 · números, letras e instrucciones: código real de tarjeta (dígito = 1 agujero · letra = zona + dígito)
 B.push({ t0: B0.b5, t1: B0.b6, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  techBg(ctx, t); const cd = cardAt([0, 0, 0]), ph = t < T.letras - 0.3 ? 0 : t < T.instrucciones - 0.1 ? 1 : 2, cs = [12, 15, 8.5][ph], pv = [12, 15, 8.5], u1 = E.inOut(win(t, T.letras - 0.5, T.letras - 0.1)), u2 = E.inOut(win(t, T.instrucciones - 0.3, T.instrucciones + 0.1)), cxv = colX(lerp(lerp(pv[0], pv[1], u1), pv[2], u2)), cam = P.cam3([cxv, 0, 110], [cxv, 0, 0], 1000);
  const band = ph < 2 ? { c: cs, a: sm(B0.b5 + 0.4, B0.b5 + 0.8, t) } : null, hl = ph === 0 ? [{ c: 12, r: 5, a: sm(T.agujeros7 - 0.4, T.agujeros7, t) }] : ph === 1 ? [{ c: 15, r: 12 }, { c: 15, r: 1 }] : HOLES.filter(([c]) => c >= 7 && c <= 10).map(([c, r]) => ({ c, r }));
  ctx.save(); ctx.translate(0, -180); P.punchCard3(ctx, cam, cd, t, { band, hl }); ctx.restore();
  const rows = ph === 0 ? (t > T.agujeros7 ? [5] : []) : ph === 1 ? [12, 1] : [], sym = ph === 0 ? '5' : 'A', sa = ph === 0 ? sm(T.lector, T.lector + 0.3, t) : sm(T.letras, T.letras + 0.25, t);
  if (ph < 2) rowStrip(ctx, 75, 1235, rows, sym, sa, t); else { ctx.save(); ctx.globalAlpha = sm(T.instrucciones - 0.1, T.instrucciones + 0.2, t); ctx.fillStyle = 'rgba(10,22,33,0.92)'; ctx.beginPath(); ctx.roundRect(55, 1165, 970, 150, 22); ctx.fill(); txt(ctx, 'R E A D', 280, 1240, 64, C.blanco, { f: '"IBM Plex Mono"', w: 700 }); txt(ctx, '→', 560, 1240, 56, C.cian, { w: 900 }); txt(ctx, 'instrucción', 810, 1220, 40, C.oro, { w: 900 }); txt(ctx, '«leer datos»', 810, 1268, 34, C.blanco, { w: 700 }); ctx.restore(); }
  lab(ctx, 'NÚMERO: UNA PERFORACIÓN', null, 540, 1362, t, T.numeros - 0.1, T.letras - 0.3, { col: C.oro }); lab(ctx, 'LETRA: ZONA (12, 11, 0) + DÍGITO', null, 540, 1362, t, T.letras, T.instrucciones - 0.1, { col: C.oro }); lab(ctx, 'VARIAS COLUMNAS: UNA PALABRA', null, 540, 1362, t, T.instrucciones + 0.1, B0.b6 + 0.2, { col: C.oro });
  title(ctx, 'AGUJEROS → SÍMBOLOS', t, B0.b5 + 0.2, B0.b6 + 0.2, {}); recon(ctx, 'CÓDIGO REAL DE TARJETA IBM', t, B0.b5 + 0.5, T.numeros - 0.3);
 }, sfx(k) { FX.etiqueta(k, T.agujeros7); FX.correcto(k, T.lector); k.play('whoosh', T.letras - 0.5, { dur: 0.4, gain: 0.18 }); FX.correcto(k, T.letras); FX.etiqueta(k, T.instrucciones); } });
 // 6 · el lector: no lee la tinta, solo detecta el patrón de agujeros
 const zc6 = (t) => lerp(150, -70, win(t, B0.b6 + 0.2, B0.b7 + 0.2));
 B.push({ t0: B0.b6, t1: B0.b7, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  roomBg(ctx); const zc = zc6(t), u = win(t, B0.b6, B0.b7), cd = { ...P.cardFrame([0, 900.6, zc], { pitch: Math.PI / 2 }), holes: HOLES };
  const cam = P.cam3([lerp(260, 200, u), lerp(990, 960, u), lerp(190, 130, u)], [0, 908, -8], 1150); P.cardReader3(ctx, cam, t, { card: cd, contacts: contactsAt(HOLES, zc), hopper: 0, stacker: 80, cover: 0.35 }); vign(ctx, 0.4);
  title(ctx, 'LECTURA DEL PATRÓN', t, B0.b6 + 0.2, B0.b7 + 0.2, {}); lab(ctx, 'NO LEE LA TINTA', null, 540, 1320, t, T.impresas - 0.2, B0.b7 + 0.2, { col: C.oro, sub: 'solo detecta dónde hay agujeros' }); recon(ctx, 'RECONSTRUCCIÓN · LECTOR DE ESCOBILLAS', t, B0.b6 + 0.3, T.impresas - 0.4);
 }, sfx(k) { FX.tarjetaRoce(k, B0.b6 + 0.2, 3.4, 0.8); crossTimes(zc6, B0.b6, B0.b7, HOLES).forEach((tt) => FX.escobilla(k, tt)); } });
 // 7 · de agujero a señal (corte): escobilla, tarjeta, rodillo, impulso eléctrico y decodificación
 const S7 = { a: B0.b7 + 0.25, b: B0.b8 - 0.15 }, u7 = (t) => win(t, S7.a, S7.b);
 B.push({ t0: B0.b7, t1: B0.b8, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  techBg(ctx, t); const r = P.readerSection(ctx, 60, 400, 960, 760, t, { u: u7(t), rows: [12, 1] });
  rowStrip(ctx, 75, 1290, r.passed, 'A', r.passed.length === 2 ? sm(0, 0.01, 1) : 0, t);
  title(ctx, 'PATRÓN FÍSICO → SEÑAL', t, B0.b7 + 0.2, B0.b8 + 0.2, {}); recon(ctx, 'VISUALIZACIÓN CONCEPTUAL', t, B0.b7 + 0.3, B0.b8);
 }, sfx(k) { k.play('roller', S7.a, { dur: S7.b - S7.a, gain: 0.2 }); for (const rr of [1, 12]) { const uu = P.readerSectionU(60, 960, rr), tt = lerp(S7.a, S7.b, uu); FX.escobilla(k, tt, 1.3); k.play('blip', tt + 0.05, { f: 700, dur: 0.12, gain: 0.2 }); } } });
 // 8 · no era magia: otra posición = otro símbolo (código válido)
 B.push({ t0: B0.b8, t1: B0.b9, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  techBg(ctx, t); const mv = E.inOut(win(t, T.perforaciones - 0.4, T.perforaciones + 0.2)), ha = [[15, 12], [15, 1]];
  flatCard(ctx, cardAt([0, 0, 0], { holes: ha, text: pad('', 14) + 'A' }), 540, 520, 3.7, t, { band: { c: 15, a: 1 }, hl: ha.map(([c, r]) => ({ c, r })) }); rowStrip(ctx, 75, 770, [12, 1], 'A', 1, t);
  const hb = mv < 0.5 ? ha : [[15, 12], [15, 2]], r2 = flatCard(ctx, cardAt([0, 0, 0], { holes: hb, text: pad('', 14) + (mv < 0.5 ? 'A' : 'B') }), 540, 1010, 3.7, t, { band: { c: 15, a: 1, col: mv > 0 ? '#FFD447' : '#4CD3E8' }, hl: hb.map(([c, r]) => ({ c, r })) });
  if (mv > 0 && mv < 1 && r2) { const p = P.holeUV('ibm', 15, 1), q = P.holeUV('ibm', 15, 2), a2 = r2.proj(p[0] + 4, p[1]), b2 = r2.proj(q[0] + 4, q[1]); ctx.strokeStyle = C.oro; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(a2[0] + 20, a2[1]); ctx.quadraticCurveTo(a2[0] + 60, (a2[1] + b2[1]) / 2, b2[0] + 20, b2[1]); ctx.stroke(); }
  rowStrip(ctx, 75, 1255, mv < 0.5 ? [12, 1] : [12, 2], mv < 0.5 ? 'A' : 'B', 1, t, { px: 80 });
  title(ctx, 'CADA POSICIÓN TIENE SIGNIFICADO', t, B0.b8 + 0.2, B0.b9 + 0.2, { px: 46 }); lab(ctx, 'OTRA POSICIÓN = OTRO SÍMBOLO', null, 540, 1372, t, T.perforaciones + 0.3, B0.b9 + 0.2, { col: C.oro, sub: 'un código válido, no un error' });
 }, sfx(k) { FX.perforar(k, T.perforaciones); FX.correcto(k, T.perforaciones + 0.3); } });
 // 9 · revelación: de una tarjeta a una fila de tarjetas y una gran pila
 B.push({ t0: B0.b9, t1: B0.b10, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  roomBg(ctx); const u = E.inOut(win(t, B0.b9, B0.b10 + 0.3)), cam = P.cam3([lerp(40, 200, u), lerp(110, 430, u), lerp(240, 860, u)], [0, lerp(0, 60, u), lerp(0, -160, u)], 1000);
  table(ctx, cam, {}); const items = []; for (let i = -3; i <= 3; i++) { const cd = cardAt([i * 205, 0.2, 40 + Math.abs(i) * 18], { pitch: -Math.PI / 2, yaw: i * 0.04, holes: P.cardHoles(progLine(i + 3)), text: progLine(i + 3) }); items.push({ d: cam.depth([i * 205, 0, 40]), f: () => P.punchCard3(ctx, cam, cd, t, {}) }); }
  items.push({ d: cam.depth([0, 120, -330]), f: () => P.cardDeck3(ctx, cam, 0, 0, -330, 1500, t, { topCard: { holes: P.cardHoles(progLine(0)), text: progLine(0) } }) }); items.sort((a, b) => b.d - a.d).forEach((x) => x.f());
  title(ctx, '¡UNA TARJETA PODÍA SER UNA LÍNEA!', t, B0.b9 + 0.15, B0.b10 + 0.3, { px: 44 });
 }, sfx(k) { FX.revelar(k, B0.b9 + 0.1); k.play('whoosh', B0.b9 + 0.2, { dur: 1.4, gain: 0.25 }); } });
 // 10 · una línea de programa: el texto se convierte en su patrón de perforaciones y la tarjeta entra al lector
 B.push({ t0: B0.b10, t1: B0.b11, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  techBg(ctx, t); const ty = win(t, B0.b10 + 0.3, T.tarjeta13 - 0.1), n = Math.round(18 * ty), hp = win(t, T.tarjeta13, T.linea + 0.2), hn = Math.round(18 * hp), go = E.in(win(t, T.programa13 - 0.2, B0.b11)), s = PROG[0];
  ctx.save(); ctx.fillStyle = 'rgba(10,22,33,0.9)'; ctx.beginPath(); ctx.roundRect(60, 400, 960, 170, 22); ctx.fill(); txt(ctx, s.slice(0, n).trim() + (n < 18 && Math.floor(t * 3) % 2 ? '_' : ''), 540, 470, 72, C.blanco, { f: '"IBM Plex Mono"', w: 700 }); txt(ctx, 'ejemplo en FORTRAN', 540, 535, 32, C.oro, { w: 700 }); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 900, HH); if (go > 0) ctx.clip(); const cd = cardAt([0, 0, 0], { holes: P.cardHoles(LINE, { n: hn }) }); const r = flatCard(ctx, cd, 540 + go * 700, 860, 5.0, t, { textN: hn, band: hn > 0 && hn < 18 ? { c: hn, a: 1 } : null }); ctx.restore();
  if (go > 0) { ctx.save(); ctx.globalAlpha = sm(T.programa13 - 0.3, T.programa13, t); ctx.fillStyle = '#465258'; ctx.fillRect(900, 640, 180, 440); ctx.fillStyle = '#0e1214'; ctx.fillRect(895, 690, 14, 340); txt(ctx, 'LECTOR', 990, 1110, 32, C.blanco, { w: 800 }); ctx.restore(); }
  if (r && hn >= 18 && go < 0.2) { const p = r.proj(F.c0 + 75.5 * F.dc, 2.35); lab(ctx, 'COLUMNAS 73–80: NÚMERO DE ORDEN', [p[0], p[1] + 8], 540, 1180, t, T.linea + 0.3, T.programa13, { col: C.cian }); }
  title(ctx, '1 TARJETA = 1 LÍNEA', t, B0.b10 + 0.2, B0.b11 + 0.2, {}); lab(ctx, 'EN MUCHOS SISTEMAS', null, 540, 1320, t, T.tarjeta13, B0.b11 + 0.2, { col: C.oro, sub: 'una práctica común, no una regla universal' });
 }, sfx(k) { FX.escribir(k, B0.b10 + 0.3, T.tarjeta13 - B0.b10 - 0.4, 0.7); FX.tecleo(k, T.tarjeta13, 18, (T.linea + 0.2 - T.tarjeta13) / 18, 0.6); FX.tarjetaRoce(k, T.programa13 - 0.2, 0.6); } });
 // 11 · miles de tarjetas: el mazo crece sobre la mesa; travelling lateral
 B.push({ t0: B0.b11, t1: B0.b12, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  roomBg(ctx); const u = win(t, B0.b11, B0.b12), n = Math.round(lerp(1, 2400, E.in(win(t, B0.b11 + 0.1, B0.b12 - 0.1)))), hgt = n * F.th, cam = P.cam3([lerp(-330, 300, E.inOut(u)), lerp(110, 220, u) + hgt * 0.5, lerp(380, 470, u)], [0, hgt * 0.45 + 15, 0], 1000);
  table(ctx, cam, {}); P.cardDeck3(ctx, cam, 0, 0, 0, n, t, { topCard: { holes: P.cardHoles(progLine(n)), text: progLine(n) } });
  title(ctx, 'MILES DE TARJETAS', t, B0.b11 + 0.2, B0.b12 + 0.2, {}); lab(ctx, 'UN PROGRAMA LARGO = UN MAZO ENORME', null, 540, 1320, t, T.miles + 0.2, B0.b12 + 0.2, { col: C.oro });
 }, sfx(k) { FX.cascadaTarjetas(k, B0.b11 + 0.2, 2.0, 0.5); } });
 // 12 · preparación: perforadora de teclado (tipo IBM 026); el operador pulsa, el punzón perfora y la tarjeta avanza + FOTO 02
 const K0 = B0.b12 + 0.15, KD = 0.2, kcol = (t) => (t - K0) / KD;
 B.push({ t0: B0.b12, t1: B0.b13, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  roomBg(ctx); const kf = Math.max(0, kcol(t)), col = Math.min(19, 1 + Math.floor(kf)), ph = kf % 1, press = kf > 0 && col < 19 ? Math.pow(Math.max(0, Math.sin(Math.min(1, ph * 2) * Math.PI)), 2) : 0, adv = col + (col < 19 ? E.inOut(cl((ph - 0.5) * 2)) : 0) - 1;
  const kp = { punchX: 70, bedY: 1040, bedZ: -66 }, cx = kp.punchX - (F.c0 + (adv) * F.dc) + F.w / 2, cd = cardAt([cx, kp.bedY + 20, kp.bedZ + 1], { holes: P.cardHoles(LINE, { n: col - 1 }) }), close = t > T.ordenar;
  const cam = close ? P.cam3([kp.punchX - 40, kp.bedY + 70, kp.bedZ + 420], [kp.punchX - 80, kp.bedY + 15, kp.bedZ], 1000) : P.cam3([lerp(640, 480, win(t, B0.b12, T.ordenar)), 1650, 1900], [0, 1050, -60], 1000);
  P.keypunch3(ctx, cam, t, { card: cd, cardOpts: { textN: col - 1 }, press, key: (col * 7) % 44 });
  if (!close) { const s = bill(ctx, cam, [-330, 0, 520], 1250, (x, y, h) => [x, y, h]); if (s) P.operatorSeated(ctx, s[0], s[1], s[2], t, { press }); }
  else if (press > 0.6) { const p = cam.pr([kp.punchX, kp.bedY, kp.bedZ - 6]); for (let i = 0; i < 3; i++) { ctx.fillStyle = '#E4D7BA'; ctx.fillRect(p[0] - 4 + i * 6, p[1] + 20 + ph * 140 + i * 18, 6, 12); } }
  title(ctx, 'PREPARACIÓN DEL PROGRAMA', t, B0.b12 + 0.2, B0.b13 + 0.2, { px: 48 });
  P.floatPhoto(ctx, IMG.perforadora, 560, 480, 520, t, T.preparar - 0.2, T.ordenar + 0.1, { tag: 'PERFORADORA IBM 026', label: 'MÁQUINA REAL · DEUTSCHES MUSEUM', sub: 'mediados del siglo XX', credit: 'Foto: Ben Franske · CC BY-SA 4.0', from: 1, rotY: -0.12 });
  lab(ctx, 'LA PERFORADORA HACE LOS AGUJEROS', null, 540, 1320, t, T.ordenar + 0.1, B0.b13 + 0.2, { col: C.oro, sub: 'el lector, después, los interpreta' }); recon(ctx, 'RECONSTRUCCIÓN ANIMADA', t, B0.b12 + 0.3, T.preparar - 0.3);
 }, sfx(k) { for (let i = 0; i < 18; i++) { const tt = K0 + i * KD; FX.perforar(k, tt + KD * 0.25, 0.7); } FX.revelar(k, T.preparar - 0.2); } });
 // 13–14 · ¡y si se desordenaban! el mazo se vuelca y se reordena gracias a los números de secuencia
 const NL = 26, LOOSE = (() => { const R = H.rng(51); return [...Array(NL).keys()].map((i) => ({ i, x: R.range(-420, 420), z: R.range(-240, 200), yaw: R.range(-1.3, 1.3), ts: B0.b13 + 0.35 + (NL - 1 - i) * 0.035 + R() * 0.05 })); })();
 B.push({ t0: B0.b13, t1: B0.b15, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  roomBg(ctx); const u = win(t, B0.b13, B0.b15), base = 700, cam = P.cam3([lerp(430, 260, E.inOut(u)), lerp(470, 600, u), lerp(600, 470, E.inOut(u))], [0, 30, 0], 1000), back = E.inOut(win(t, T.problema - 0.25, B0.b15 - 0.05));
  table(ctx, cam, {}); const items = [{ d: cam.depth([0, 60, -60]), f: () => P.cardDeck3(ctx, cam, 0, 0, -60, base, t, { topCard: { holes: P.cardHoles(progLine(base)), text: progLine(base) }, topOpts: { print: true } }) }];
  const hgt0 = base * F.th; for (const L of LOOSE) { const p = E.inOut(win(t, L.ts, L.ts + 0.7)); if (p <= 0) continue; const order = L.i, yS = hgt0 + order * F.th, q = p * (1 - back), xs = lerp(0, L.x, q), zs = lerp(-60, L.z, q), ys = back > 0 ? lerp(0.2 + order * 0.15, yS + 0.2, back) : lerp(yS + 0.2, 0.2 + order * 0.15, E.in(p)) + Math.sin(p * Math.PI) * 60, tilt = Math.sin(p * Math.PI) * 0.5 * (1 - back);
   const cd = cardAt([xs, ys, zs], { pitch: -Math.PI / 2 + tilt, yaw: L.yaw * q, holes: P.cardHoles(progLine(order)), text: progLine(order) });
   items.push({ d: cam.depth([xs, ys, zs]) - order * 0.01, f: () => { const r = P.punchCard3(ctx, cam, cd, t, { print: false }); const ha = sm(T.problema - 1.1, T.problema - 0.8, t) * (1 - back); if (r && ha > 0) { const pts = [[F.c0 + 71.4 * F.dc, 0.6], [F.c0 + 79.6 * F.dc, 0.6], [F.c0 + 79.6 * F.dc, 4.6], [F.c0 + 71.4 * F.dc, 4.6]].map(([a, b]) => r.proj(a, b)); ctx.save(); ctx.globalAlpha *= ha; ctx.strokeStyle = C.oro; ctx.lineWidth = 3; ctx.beginPath(); pts.forEach((pp, j) => (j ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1]))); ctx.closePath(); ctx.stroke(); ctx.restore(); } } }); }
  items.sort((a, b) => b.d - a.d).forEach((x) => x.f());
  title(ctx, '¡ORDEN ALTERADO!', t, B0.b13 + 0.2, T.problema - 0.3, {}); title(ctx, 'EL ORDEN ERA IMPORTANTE', t, T.problema - 0.2, B0.b15 + 0.2, {});
  lab(ctx, 'NÚMEROS DE SECUENCIA (COL. 73–80)', null, 540, 1320, t, T.problema - 1.0, B0.b15 + 0.2, { col: C.oro, sub: 'permitían volver a ordenar el mazo' });
 }, sfx(k) { FX.cascadaTarjetas(k, B0.b13 + 0.35, 1.2, 1); FX.alarma ? FX.etiqueta(k, T.desordenaban) : 0; FX.etiqueta(k, T.problema - 1.0); FX.tarjetaRoce(k, T.problema - 0.25, 0.6, 1); } });
 // 15 · la idea venía de mucho antes: la cámara entra en la tarjeta y el cartón se convierte en una tarjeta de 1890
 B.push({ t0: B0.b15, t1: B0.b16, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const m = sm(T.antes - 0.6, T.antes, t); techBg(ctx, t); ctx.save(); ctx.globalAlpha = m; const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#3a2b1e'); g.addColorStop(1, '#1f1710'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.restore();
  const u = win(t, B0.b15, B0.b16), cam = P.cam3([Math.sin(lerp(-0.3, 0.25, u)) * lerp(360, 280, u), 30, Math.cos(lerp(-0.3, 0.25, u)) * lerp(360, 280, u)], [0, -4, 0], 1500);
  const a = cardAt([0, 0, 0]), b = { ...P.cardFrame([0, 0, 0], { fmt: 'h1890' }), holes: [[2, 1], [2, 6], [4, 3], [5, 9], [7, 0], [8, 4], [10, 7], [11, 2], [13, 10], [14, 5], [16, 8], [17, 1], [19, 11], [20, 3], [22, 6], [23, 9]] };
  stand(ctx, cam, a); if (m < 1) P.punchCard3(ctx, cam, a, t, { alpha: 1 - m }); if (m > 0) P.punchCard3(ctx, cam, b, t, { alpha: m, print: false });
  sepiaWarm(ctx, 0.4 * m); title(ctx, 'ANTES DE LAS COMPUTADORAS ELECTRÓNICAS', t, B0.b15 + 0.2, B0.b16 + 0.2, { px: 40 }); lab(ctx, 'TARJETA DE HOLLERITH', null, 540, 1320, t, T.antes, B0.b16 + 0.2, { col: C.papel, sub: 'otro formato: agujeros redondos' });
 }, sfx(k) { FX.saltoTiempo(k, T.antes - 0.6, 1.2, 0.5); } });
 // 16 · 1890: oficina del censo, tabuladora de Hollerith con diales y mesa de clasificación + FOTO 03 (grabado)
 const press16 = (t) => { const ph = ((t - B0.b16) / 1.6) % 1; return sm(0.15, 0.3, ph) * (1 - sm(0.7, 0.85, ph)); };
 B.push({ t0: B0.b16, t1: B0.b17, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = win(t, B0.b16, B0.b17), cam = P.cam3([lerp(2500, 1100, E.inOut(u)), lerp(1750, 1350, u), lerp(4300, 2300, E.inOut(u))], [lerp(300, 300, u), lerp(1150, 1000, u), -200], 950), cnt = Math.floor((t - B0.b16) / 1.6);
  P.office1890(ctx, cam, t, {}); const items = [{ d: cam.depth([0, 900, -100]), f: () => P.tabulator1890(ctx, cam, t, { press: press16(t), counts: [...Array(40).keys()].map((i) => (i * 7 + cnt * ((i % 3) + 1)) % 20), lid: cnt % 12, lidA: sm(0.75, 0.9, ((t - B0.b16) / 1.6) % 1) }) }];
  for (const [x, z, v, pose] of [[-620, 380, 1, 'talk'], [1520, -380, 2, 'point'], [-1150, 700, 0, 'stand']]) items.push({ d: cam.depth([x, 900, z]), f: () => bill(ctx, cam, [x, 0, z], 1750, (X, Y, h) => P.traveler1865(ctx, X, Y, h, t, { var: v, pose, dir: -1 })) });
  items.sort((a, b) => b.d - a.d).forEach((x) => x.f()); sepiaWarm(ctx, 0.25); vign(ctx, 0.45);
  title(ctx, '1890 · CENSO DE ESTADOS UNIDOS', t, B0.b16 + 0.2, T.hollerith - 0.2, { px: 46 });
  P.floatPhoto(ctx, IMG.grabado, 540, 640, lerp(700, 780, win(t, T.hollerith - 0.4, B0.b17)), t, T.hollerith - 0.4, B0.b17 + 0.2, { tag: 'CENSO DE 1890 · GRABADO HISTÓRICO', label: 'MÁQUINAS DE HOLLERITH', sub: 'Scientific American, 30 de agosto de 1890', credit: 'Ilustración · dominio público', from: 1, rotY: -0.08 });
  lab(ctx, 'HERMAN HOLLERITH', null, 540, 1320, t, T.hollerith, T.censo - 0.3, { col: C.oro, sub: 'diseñó el sistema de tabulación' }); lab(ctx, 'DATOS DEL CENSO EN TARJETAS', null, 540, 1320, t, T.censo - 0.2, B0.b17 + 0.2, { col: C.papel }); recon(ctx, 'RECONSTRUCCIÓN ANIMADA · 1890', t, B0.b16 + 0.4, T.hollerith - 0.5);
 }, sfx(k) { for (let tt = B0.b16; tt < B0.b17; tt += 1.6) { k.play('press', tt + 0.3, { gain: 0.35 }); FX.dialHollerith(k, tt + 0.5, 0.7); } FX.revelar(k, T.hollerith - 0.4); } });
 // 17 · la máquina de Hollerith por dentro: agujas, mercurio, circuito, diales y timbre
 B.push({ t0: B0.b17, t1: B0.b18, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#2a2018'); g.addColorStop(1, '#1a130d'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  const pr = sm(B0.b17 + 0.3, B0.b17 + 0.9, t) * (1 - sm(B0.b18 - 0.7, B0.b18 - 0.3, t)), hit = t > B0.b17 + 0.9 ? 1 : 0;
  P.hollerithPress(ctx, 60, 380, 960, 880, t, { press: pr, holes: [true, false, true, false, false, true], counts: [6 + hit, 0, 11 + hit, 0, 0, 3 + hit], bell: sm(B0.b17 + 0.9, B0.b17 + 1.0, t) * (1 - sm(B0.b17 + 1.8, B0.b17 + 2.1, t)) });
  title(ctx, 'TABULACIÓN ELECTROMECÁNICA', t, B0.b17 + 0.2, B0.b18 + 0.2, { px: 46 }); lab(ctx, 'NO ERA UNA COMPUTADORA ELECTRÓNICA', null, 540, 1350, t, B0.b17 + 1.2, B0.b18 + 0.2, { col: C.papel, sub: 'contaba: cada circuito cerrado avanzaba un dial' }); recon(ctx, 'VISUALIZACIÓN CONCEPTUAL', t, B0.b17 + 0.3, B0.b17 + 1.1);
 }, sfx(k) { k.play('press', B0.b17 + 0.85, { gain: 0.45 }); FX.dialHollerith(k, B0.b17 + 0.92, 1); FX.campana(k, B0.b17 + 1.0); } });
 // 18 · computadoras electrónicas: las tarjetas entran al lector y los datos viajan por el cable hasta el computador
 const zc18 = (t) => lerp(250, -80, ((t - B0.b18) / 1.5) % 1);
 B.push({ t0: B0.b18, t1: B0.b19, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const u = win(t, B0.b18, B0.b19), cam = P.cam3([lerp(-500, 1500, E.inOut(u)), lerp(1450, 1500, u), lerp(700, 2300, E.inOut(u))], [lerp(-1400, 200, E.inOut(u)), lerp(950, 1000, u), lerp(-100, -700, u)], 950), zc = zc18(t), cd = { ...P.cardFrame([0, 900.6, zc], { pitch: Math.PI / 2 }), holes: HOLES };
  P.computerRoom60(ctx, cam, t, { pulse: t * 0.7, lights: 1, reader: { card: cd, contacts: contactsAt(HOLES, zc), hopper: 500, stacker: 200 } }); vign(ctx, 0.35);
  title(ctx, 'PROGRAMAS Y DATOS', t, B0.b18 + 0.3, B0.b19 + 0.2, {}); lab(ctx, 'LECTOR DE TARJETAS', cam.pr([-1400, 1010, -100]), 70, 1240, t, T.programas - 0.8, B0.b19 + 0.2, { al: 'left', col: C.cian }); lab(ctx, 'COMPUTADORA ELECTRÓNICA', cam.pr([800, 1820, -1500]), 1010, 460, t, T.datos18, B0.b19 + 0.2, { al: 'right', col: C.oro, sub: 'mediados del siglo XX' }); recon(ctx, 'RECONSTRUCCIÓN GENÉRICA', t, B0.b18 + 0.4, B0.b19);
 }, sfx(k) { for (let tt = B0.b18; tt < B0.b19; tt += 1.5) FX.tarjetaRoce(k, tt, 0.9, 0.6); FX.flujoDatos ? FX.flujoDatos(k, T.datos18, 1.6) : FX.datos(k, T.datos18); } });
 // 19 · hoy: miles de fotografías en una microSD sobre la yema de un dedo (otra tecnología: celdas electrónicas, sin agujeros)
 B.push({ t0: B0.b19, t1: B0.b20, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const sw = sm(T.fotografias - 0.7, T.fotografias - 0.2, t); if (sw < 1) { techBg(ctx, t); const u = win(t, B0.b19, T.fotografias), d = lerp(330, 120, E.in(u)), az = 0.4 - u * 0.5, cd = cardAt([0, 0, 0]), cam = P.cam3([Math.sin(az) * d, 10, Math.cos(az) * d], [0, -4, 0], 1500); stand(ctx, cam, cd); P.punchCard3(ctx, cam, cd, t, {}); }
  if (sw > 0) { ctx.save(); ctx.globalAlpha = sw; ctx.fillStyle = '#0D1424'; ctx.fillRect(0, 0, W, HH); const ph = sm(T.fotografias, T.memoria + 0.3, t), ty = 900, fw = 230, tiles = [...Array(10).keys()].map((i) => { const a = t * 0.5 + (i * TAU) / 10; return [i, a]; });
   const tile = ([i, a]) => { const r = 390 * ph, x = 540 + Math.cos(a) * r, y = ty + 240 + Math.sin(a) * r * 0.32, s = 110 * (0.75 + 0.25 * (Math.sin(a) + 1) / 2) * ph; if (s > 2) P.photoTile(ctx, x, y, s, i, { rot: Math.cos(a) * 0.15 }); };
   tiles.filter(([, a]) => Math.sin(a) < 0).forEach(tile); P.fingertip(ctx, 540, ty, fw, t, { glow: 0.4 + 0.3 * Math.sin(t * 2), cardRot: -0.12 + Math.sin(t * 0.6) * 0.04 }); tiles.filter(([, a]) => Math.sin(a) >= 0).forEach(tile); ctx.restore(); }
  title(ctx, 'MILES DE FOTOGRAFÍAS', t, T.fotografias - 0.2, B0.b20 + 0.2, {}); lab(ctx, 'MEMORIA FLASH (MICROSD)', null, 540, 1360, t, T.memoria, B0.b20 + 0.2, { col: C.cian, sub: 'guarda datos de forma electrónica, sin agujeros' });
 }, sfx(k) { k.play('whoosh', T.fotografias - 0.7, { dur: 0.7, top: 2600, gain: 0.3 }); FX.chipFlash(k, T.fotografias - 0.15); FX.miniaturizar ? FX.miniaturizar(k, T.memoria) : 0; } });
 // 20 · antes una enorme pila de cartón era un programa (comparación sin cifras inventadas)
 B.push({ t0: B0.b20, t1: B0.b21, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  roomBg(ctx); const u = win(t, B0.b20, B0.b21), n = 3000, hgt = n * F.th, up = Math.sin(Math.PI * cl(u * 1.15)), cam = P.cam3([360, lerp(100, hgt + 140, up), 620], [0, lerp(60, hgt * 0.9, up), 0], 1000);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 540, HH); ctx.clip(); ctx.translate(-270, 0); table(ctx, cam, {}); P.cardDeck3(ctx, cam, 0, 0, 0, n, t, { topCard: { holes: P.cardHoles(progLine(9)), text: progLine(9) } }); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(540, 0, 540, HH); ctx.clip(); ctx.fillStyle = '#0D1424'; ctx.fillRect(540, 0, 540, HH); P.fingertip(ctx, 810, 940, 150, t, { glow: 0.5, cardRot: -0.1 }); ctx.restore(); ctx.fillStyle = C.blanco; ctx.fillRect(536, 0, 8, HH);
  title(ctx, 'DEL CARTÓN A LOS CHIPS', t, B0.b20 + 0.2, B0.b21 + 0.2, {}); lab(ctx, 'PILA DE TARJETAS', null, 270, 1330, t, T.pila - 0.2, B0.b21 + 0.2, { col: C.papel, sub: 'un programa' }); lab(ctx, 'MICROSD', null, 810, 1330, t, T.pila + 0.3, B0.b21 + 0.2, { col: C.cian, sub: 'memoria flash' });
 }, sfx(k) { k.play('whoosh', B0.b20 + 0.2, { dur: 1.6, gain: 0.22 }); FX.etiqueta(k, T.pila - 0.2); FX.etiqueta(k, T.pila + 0.3); } });
 // 21 · pregunta: la tarjeta real gira lentamente en su soporte, macro
 B.push({ t0: B0.b21, t1: B0.b22, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  techBg(ctx, t); const u = win(t, B0.b21, B0.b22), az = lerp(0.6, -0.4, E.inOut(u)), d = lerp(300, 220, u), cd = cardAt([0, 0, 0]), cam = P.cam3([Math.sin(az) * d, 18, Math.cos(az) * d], [lerp(-20, 10, u), -4, 0], 1500);
  stand(ctx, cam, cd); P.punchCard3(ctx, cam, cd, t, { thk: 2 }); title(ctx, '¿CONOCÍAS ESTA TECNOLOGÍA?', t, B0.b21 + 0.2, B0.b22 + 0.2, { px: 46 });
 }, sfx(k) { k.play('whoosh', B0.b21 + 0.1, { dur: 1.2, gain: 0.18 }); } });
 // 22 · cierre: tarjeta → disco duro → memoria flash → microSD; ASOMBROTECA discreto
 B.push({ t0: B0.b22, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  ctx.fillStyle = '#0D1424'; ctx.fillRect(0, 0, W, HH); const u = E.inOut(win(t, B0.b22, DURATION)), sc = lerp(1.08, 0.98, u); ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  const ap = (i) => sm(B0.b22 + 0.2 + i * 0.55, B0.b22 + 0.6 + i * 0.55, t), pos = [[280, 640], [800, 700], [290, 1120], [800, 1140]], names = ['TARJETA', 'DISCO DURO', 'FLASH', 'MICROSD'];
  for (let i = 0; i < 3; i++) { const a = ap(i + 1); if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.oro; ctx.lineWidth = 5; ctx.setLineDash([12, 10]); const [x0, y0] = pos[i], [x1, y1] = pos[i + 1]; ctx.beginPath(); ctx.moveTo(lerp(x0, x1, 0.28), lerp(y0, y1, 0.28)); ctx.lineTo(lerp(x0, x1, 0.72), lerp(y0, y1, 0.72)); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
  for (let i = 0; i < 4; i++) { const a = ap(i); if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a; const [x, y] = pos[i]; if (i === 0) flatCard(ctx, cardAt([0, 0, 0]), x, y, 1.7, t, { print: false }); else if (i === 1) P.hdd35(ctx, x, y, 1.5, t, {}); else if (i === 2) P.flashChip(ctx, x, y, 6, t, {}); else P.microSD(ctx, x, y, 9, { glow: 0.5 }); txt(ctx, names[i], x, y + (i === 1 ? 160 : i === 3 ? 120 : 130), 34, C.blanco, { w: 800 }); ctx.restore(); }
  ctx.restore();
  const a = sm(T.asombroteca, T.asombroteca + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(245,247,250,0.75)'; ctx.lineWidth = 2; const lw = 230 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 230); ctx.lineTo(540 + lw, 230); ctx.moveTo(540 - lw, 338); ctx.lineTo(540 + lw, 338); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 285, 54, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
 }, sfx(k) { for (let i = 0; i < 4; i++) FX.etiqueta(k, B0.b22 + 0.2 + i * 0.55); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.end + 0.6); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['tarjetas', 'cartón', 'agujeros!', 'posición', 'columnas.', 'números,', 'letras', 'instrucciones.', 'patrón', 'información.', 'magia:', 'lugar.', 'sorprendente!', 'línea', 'miles', 'tarjetas.', 'desordenaban,', 'problema!', 'antes.', '1890,', 'Hollerith', 'censo', 'electrónicas.', 'fotografías', 'dedo.', 'pila', 'programa!', 'perforada?', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 420, q: 0.6, gain: 0.007, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   MUS.pulso(k, 0, B0.b9, { bpm: 96, gain: 0.72, chords: [['A2', 'E3', 'A3', 'C4'], ['F2', 'C3', 'F3', 'A3'], ['D2', 'A2', 'D3', 'F3'], ['E2', 'B2', 'E3', 'G#3']] });
   MUS.industrial(k, B0.b9, B0.b15, { bpm: 100, gain: 0.7, perc: 0.6, strings: 0.5 });
   MUS.epica(k, B0.b15, B0.b19, { bpm: 84, gain: 0.7, drums: 0.35, strings: 0.9, ostinato: 0.4, chords: [['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3'], ['F2', 'C3', 'F3', 'A3'], ['C2', 'G2', 'C3', 'E3']] });
   MUS.piano(k, B0.b19, B0.b22, { bpm: 70, gain: 0.75, strings: 0.7, chords: [['C3', 'E3', 'G3', 'C4'], ['A2', 'C3', 'E3', 'A3'], ['F2', 'A2', 'C3', 'F3'], ['G2', 'B2', 'D3', 'G3']] });
   MUS.epica(k, B0.b22, DURATION, { bpm: 76, gain: 0.65, drums: 0, strings: 0.9, ostinato: 0.2, chords: [['F2', 'C3', 'F3', 'A3'], ['G2', 'D3', 'G3', 'B3'], ['C2', 'G2', 'C3', 'E3'], ['C2', 'G2', 'C3', 'E3']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { for (const k of Object.keys(window.FOTOS || {})) { IMG[k] = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = window.FOTOS[k]; }); } }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
