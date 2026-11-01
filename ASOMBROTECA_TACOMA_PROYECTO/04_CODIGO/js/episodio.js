// =====================================================================================================
// episodio.js — «El puente que se destruyó por el viento · Tacoma Narrows, 7-nov-1940» · Asombroteca · PLANTILLA v1.17
// UN SOLO PUENTE MAESTRO en 3D (P.tacBridge + P.tacWorld, cámara P.cam3): vano central 853 m, tablero de 11,9 m, vigas laterales de
// alma llena de 2,4 m, dos torres. Movimiento por modos: vertical (semiondas) y torsión con un nodo en el centro del vano. Sección
// transversal derivada del mismo tablero (P.tacSection) con flujo didáctico, remolinos y momento aerodinámico en fase con el giro.
// Arco: torsión (gancho) → no hubo terremoto → el viento no era extraordinario → anticipo del colapso → ¿qué falló? → Tacoma Narrows
// → 4 meses → ondas verticales → diseño (largo, estrecho, flexible; vigas laterales) → paso a torsión → bordes opuestos → interacción
// viento–giro → energía → crecimiento → inestabilidad aeroelástica (flutter torsional) → límite → colapso progresivo → túnel de viento
// → el peligro estaba en la interacción → Asombroteca. Datos en FUENTES_Y_DECISIONES.md. Reloj = voz original. Determinista.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS, TK = P.TK, TAC = P.TAC;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const C = { ...TK };
 const T = {
  noviembre: wt(0, 'noviembre'), y1940: wt(0, '1940'), puente1: wt(1, 'puente'), retorcerse1: wt(1, 'retorcerse'), goma: wt(1, 'goma'),
  no2: SG(2).s, terremoto: wt(2, 'terremoto'), y3: SG(3).s, viento3: wt(3, 'viento'), fuerte: wt(3, 'fuerte'), pero4: SG(4).s, el5: SG(5).s, desplomandose: wt(5, 'desplomándose'),
  como6: SG(6).s, ocurrir: wt(6, 'ocurrir'), era7: SG(7).s, tacoma: wt(7, 'tacoma'), estados: wt(7, 'estados'), habia8: SG(8).s, inaugurado: wt(8, 'inaugurado'), cuatro: wt(8, 'cuatro'),
  y9: SG(9).s, extrano: wt(9, 'extraño'), cuando10: SG(10).s, viento10: wt(10, 'viento'), subia10: wt(10, 'subía'), ondas: wt(10, 'ondas'),
  pero11: SG(11).s, peligro11: wt(11, 'peligro'), diseno: wt(11, 'diseño'), su12: SG(12).s, largo: wt(12, 'largo'), estrecho: wt(12, 'estrecho'), flexible: wt(12, 'flexible'), movimientos12: wt(12, 'movimientos'),
  ademas: SG(13).s, vigas: wt(13, 'vigas'), modificaban: wt(13, 'modificaban'), aire13: wt(13, 'aire'), circulaba: wt(13, 'circulaba'),
  entonces: SG(14).s, decisivo: wt(14, 'decisivo'), el15: SG(15).s, retorcerse15: wt(15, 'retorcerse'), un16: SG(16).s, subia16: wt(16, 'subía'), bajaba: wt(16, 'bajaba'),
  y17: SG(17).s, extraordinario: wt(17, 'extraordinario'), al18: SG(18).s, girar: wt(18, 'girar'), cambiaba: wt(18, 'cambiaba'), flujo18: wt(18, 'flujo'),
  ese19: SG(19).s, fuerzas19: wt(19, 'fuerzas'), reforzar: wt(19, 'reforzar'), giro19: wt(19, 'giro'), cada20: SG(20).s, energia20: wt(20, 'energía'),
  en21: SG(21).s, crecia: wt(21, 'crecía'), los22: SG(22).s, inestabilidad: wt(22, 'inestabilidad'), aeroelastica: wt(22, 'aeroelástica'),
  el23: SG(23).s, tanto: wt(23, 'tanto'), partes: wt(23, 'partes'), soportar: wt(23, 'soportar'), fuerzas23: wt(23, 'fuerzas'),
  y24: SG(24).s, rompio: wt(24, 'rompió'), cayo: wt(24, 'cayó'), agua24: wt(24, 'agua'),
  aquel: SG(25).s, desastre: wt(25, 'desastre'), ingenieria25: wt(25, 'ingeniería'), desde: SG(26).s, interactuan: wt(26, 'interactúan'), fundamental: wt(26, 'fundamental'),
  porque: SG(27).s, peligro27: wt(27, 'peligro'), fuerza27: wt(27, 'fuerza'), sino: SG(28).s, estructura28: wt(28, 'estructura'), empiece: wt(28, 'empiece'),
  asombroteca: SG(29).s, ciencia: SG(30).s, end: A.speech_end,
 };
 const TB = { b2: T.no2 - 0.2, b3: T.y3 - 0.2, b4: T.pero4 - 0.2, b5: T.como6 - 0.25, b6: T.era7 - 0.2, b7: T.habia8 - 0.2, b8: T.y9 - 0.2, b9: T.cuando10 - 0.2, b10: T.pero11 - 0.2, b11: T.su12 - 0.2, b12: T.ademas - 0.2, b13: T.entonces - 0.2, b14: T.el15 - 0.2, b15: T.un16 - 0.2, b16: T.y17 - 0.2, b17: T.al18 - 0.2, b18: T.ese19 - 0.2, b19: T.cada20 - 0.2, b20: T.en21 - 0.2, b21: T.los22 - 0.2, b22: T.el23 - 0.2, b23: T.y24 - 0.2, b24: T.aquel - 0.2, b25: T.desde - 0.2, b26: T.porque - 0.2, b27: T.sino - 0.2, b28: T.asombroteca - 0.3 };

 // ---------------- utilidades de texto ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const title = (ctx, s, t, t0, t1, y = 250) => pill(ctx, s, 540, y, s.length > 20 ? 46 : s.length > 16 ? 52 : 58, t, t0, C.oro, C.fondo, t1);
 const tag = (ctx, s, x, y, px, a, c = 'rgba(245,247,247,0.98)') => { if (a <= 0.01) return; px = Math.max(px, 32); ctx.save(); ctx.globalAlpha *= a; ctx.font = `600 ${px}px "IBM Plex Mono"`; let L = [s];
  if (ctx.measureText(s).width + px * 1.2 > 1000) { const m = s.length / 2; let k = -1; for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (k < 0 || Math.abs(i - m) < Math.abs(k - m))) k = i; if (k > 0) L = [s.slice(0, k), s.slice(k + 1)]; }
  const lw = Math.max(...L.map((l) => ctx.measureText(l).width)); if (lw + px * 1.2 > 1000) { px *= 980 / (lw + px * 1.2); ctx.font = `600 ${px}px "IBM Plex Mono"`; }
  const w = Math.max(...L.map((l) => ctx.measureText(l).width)) + px * 1.2, lh = px * 1.25, h = px * 0.45 + lh * L.length, x0 = Math.min(Math.max(x - w / 2, 40), 1040 - w);
  P.rr(ctx, x0, y - h / 2, w, h, px * 0.6, 'rgba(11,21,32,0.86)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; L.forEach((l, i) => ctx.fillText(l, x0 + w / 2, y + 1 + (i - (L.length - 1) / 2) * lh)); ctx.restore(); };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 8; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
 const callout = (ctx, x0, y0, x1, y1, s, a, c = C.blanco, al = 'left') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = '800 40px Nunito'; const tw = ctx.measureText(s).width; let tx = al === 'left' ? x1 + 14 : x1 - 14 - tw; tx = cl(tx, 56, W - 56 - tw);
  ctx.strokeStyle = 'rgba(11,21,32,0.75)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 10, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(11,21,32,0.9)'; ctx.lineWidth = 3; ctx.stroke(); P.rr(ctx, tx - 16, y1 - 32, tw + 32, 64, 32, 'rgba(11,21,32,0.88)'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.fillText(s, tx, y1 + 2); ctx.restore(); };
 const scrim = (ctx) => { const g = ctx.createLinearGradient(0, 1420, 0, 1760); g.addColorStop(0, 'rgba(11,21,32,0)'); g.addColorStop(0.5, 'rgba(11,21,32,0.6)'); g.addColorStop(1, 'rgba(11,21,32,0.6)'); ctx.fillStyle = g; ctx.fillRect(0, 1420, W, 500); };
 const vign = (ctx, a) => { if (a <= 0) return; const g = ctx.createRadialGradient(540, 900, 300, 540, 900, 1250); g.addColorStop(0, 'rgba(11,21,32,0)'); g.addColorStop(1, `rgba(11,21,32,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 const ampTag = (ctx, a) => tag(ctx, 'DEFORMACIÓN AMPLIFICADA PARA VISUALIZACIÓN', 540, 1385, 32, a, 'rgba(245,247,247,0.9)');
 const recon = (ctx, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = '700 32px "IBM Plex Mono"'; const w = ctx.measureText('RECONSTRUCCIÓN').width + 30; P.rr(ctx, 40, 140, w, 46, 23, 'rgba(11,21,32,0.75)'); ctx.fillStyle = 'rgba(245,247,250,0.9)'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('RECONSTRUCCIÓN', 55, 164); ctx.restore(); };
 const IMG = {};
 const zoomS = (k, t, d) => { k.play('riser', t - 0.2, { dur: d + 0.2, gain: 0.2, minor: true }); k.play('whoosh', t, { dur: d, top: 2400, gain: 0.3, minor: true }); };

 // ---------------- estado físico del puente (modos) ----------------
 // vertical: 6 semiondas a 0,5 Hz (amplitud visual ×4, rotulada); torsión: un nodo en el centro, ~0,2 Hz, hasta ~0,48 rad (~28°, registros)
 const COL = [[-95, 88, T.rompio - 0.6, 0.30, 0.06], [88, 262, T.rompio + 0.9, -0.25, 0.05], [-268, -95, T.aquel + 0.2, 0.32, 0.07], [262, 402, T.aquel + 1.6, -0.2, 0.04], [-402, -268, T.desde + 0.4, 0.22, 0.05]];
 const SNAP = [[-6, T.partes], [6, T.partes + 0.4], [22, T.partes + 0.8], [-38, T.soportar], [52, T.soportar + 0.3], [-70, T.fuerzas23]].map(([x, t]) => [Math.round(x / TAC.hs) * TAC.hs, t]);
 const thAmp = (t) => { if (t < TB.b5) return 0.42; if (t < TB.b13) return 0; if (t < TB.b14) return 0.16 * win(t, TB.b13, TB.b14); if (t < TB.b16) return 0.16 + 0.1 * win(t, TB.b14, TB.b16); if (t < TB.b20) return 0.26; if (t < TB.b22) return 0.26 + 0.2 * win(t, TB.b20, TB.b22); return 0.48; };
 const avAmp = (t) => { if (t < TB.b8) return 0; if (t < TB.b9) return 6 * win(t, TB.b8, TB.b9); if (t < TB.b10) return 12; if (t < TB.b13) return 9; if (t < TB.b14) return 9 * (1 - win(t, TB.b13, TB.b14 + 0.6)); return 0; };
 const M = (t, o = {}) => ({ t: o.freeze ?? t, Av: o.Av ?? avAmp(t), nv: 6, fv: 0.5, Th: o.Th ?? thAmp(t), ft: 0.2, fail: o.fail ?? (t > TB.b23 - 1 ? COL : []), snap: SNAP, lift: 12, sideSag: o.sideSag ?? 9 * sm(T.rompio, T.desde + 2, t) });
 const cam = (pos, tgt, f) => P.cam3(pos, tgt, f);
 const shot = (keys, t) => { if (t <= keys[0][0]) return cam(keys[0][1], keys[0][2], keys[0][3]); for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t <= b[0]) { const u = E.inOut(win(t, a[0], b[0])), L3 = (p, q) => p.map((v, j) => lerp(v, q[j], u)); return cam(L3(a[1], b[1]), L3(a[2], b[2]), lerp(a[3], b[3], u)); } } const z = keys[keys.length - 1]; return cam(z[1], z[2], z[3]); };
 const world = (ctx, t, c, o = {}) => { P.tacWorld(ctx, t, { cam: c, warm: o.warm }); const r = P.tacBridge(ctx, t, { cam: c, m: o.m || M(t), cars: o.cars, xray: o.xray, glow: o.glow }); if (o.wind) P.tacWind(ctx, t, c, { k: o.wind }); return r; };
 // salpicaduras donde caen los tramos (en el plano del agua, con espuma que se abre)
 const splashes = (ctx, t, c, m) => { for (const s of (m.fail || [])) { const ti = s[2] + Math.sqrt((2 * TAC.deckY) / 9.81), tau = t - ti; if (tau < 0 || tau > 6) continue; const xc = (s[0] + s[1]) / 2, len = s[1] - s[0], R = H.rng(Math.round(xc)); for (let i = 0; i < 160; i++) { const x = xc + R.range(-len / 2, len / 2), z = R.range(-12, 12), v = R.range(12, 34), y = v * tau - 4.9 * tau * tau; if (y < 0) continue; const p = c.pr([x, y, z]); if (p[2] < 2) continue; ctx.fillStyle = `rgba(214,231,233,${0.85 * (1 - tau / 6)})`; ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(2, (2.2 * c.f) / p[2]), 0, TAU); ctx.fill(); } const ring = c.clip([[xc - len / 2 - tau * 8, 0.2, -12 - tau * 10], [xc + len / 2 + tau * 8, 0.2, -12 - tau * 10], [xc + len / 2 + tau * 8, 0.2, 12 + tau * 10], [xc - len / 2 - tau * 8, 0.2, 12 + tau * 10]]); if (ring.length > 2) { ctx.fillStyle = `rgba(214,231,233,${0.45 * (1 - tau / 6)})`; ctx.beginPath(); ring.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); } } };
 const CARS = (t, run = 1) => [{ x: -300 + (t - 21) * 9 * run, lane: -1, c: '#2b3a2e' }, { x: -150 - (t - 21) * 8 * run, lane: 1, c: '#3a2e2b' }, { x: -230 + (t - 21) * 8 * run, lane: -1, c: '#1f2a33' }];

 const B = [];
 // 1 · GANCHO: el puente se retuerce — vuelo rasante sobre el agua → plano bajo junto al borde → ascenso
 B.push({ t0: 0, t1: TB.b2, draw(ctx, t) {
  const c = shot([[0, [-980, 300, -780], [0, 50, 0], 900], [2.4, [-520, 140, -200], [-150, 56, 0], 860], [4.6, [-345, 64, -3], [-100, 56, 0], 720], [TB.b2, [-330, 64, -3], [-90, 56, 0], 720]], t); world(ctx, t, c, { wind: 0.4 });
  pill(ctx, '7 DE NOVIEMBRE DE 1940', 540, 250, 44, t, T.noviembre - 0.1, C.oro, C.fondo); recon(ctx); scrim(ctx);
 }, sfx(k) { FX.viento(k, 0, TB.b3, 1.1); FX.aleteo(k, 0.2, TB.b5 - 0.2, 5, 0.9); FX.crujido(k, 1.6); FX.estructura(k, 3.0, 3, 0.6); FX.aparece(k, T.noviembre - 0.1); MUS.golpe(k, T.puente1, { gain: 0.6, chord: ['D2', 'A2', 'D3', 'F3'] }); } });
 // 2 · NO HUBO TERREMOTO — la cámara baja a la pila: el suelo no se mueve; arriba el tablero sigue retorciéndose
 B.push({ t0: TB.b2, t1: TB.b3, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const c = shot([[TB.b2, [-520, 14, -120], [-426, 20, 0], 700], [TB.b3, [-520, 26, -150], [-426, 52, 0], 700]], t); world(ctx, t, c);
  title(ctx, 'NO FUE UN TERREMOTO', t, T.terremoto - 0.2); tag(ctx, 'CIMENTACIÓN SIN MOVIMIENTO', 540, 370, 36, sm(T.terremoto, T.terremoto + 0.3, t), C.blanco); scrim(ctx);
 }, sfx(k) { FX.aparece(k, T.terremoto - 0.2); FX.etiqueta(k, T.terremoto); } });
 // 3 · EL VIENTO NO ERA EXTRAORDINARIO — corrientes de aire cruzando el estrecho
 B.push({ t0: TB.b3, t1: TB.b4, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const c = shot([[TB.b3, [-600, 130, -70], [0, 30, 0], 900], [TB.b4, [-560, 120, -60], [0, 28, 0], 900]], t); world(ctx, t, c, { wind: 1 });
  title(ctx, 'EL VIENTO NO ERA EXTRAORDINARIO', t, T.viento3 - 0.1); tag(ctx, '≈ 68 KM/H MEDIDOS CERCA DE UN EXTREMO', 540, 370, 34, sm(T.fuerte, T.fuerte + 0.3, t), C.viento); scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.b3, TB.b4 - TB.b3 + 0.4, 1.3); FX.aparece(k, T.viento3 - 0.1); FX.etiqueta(k, T.fuerte); } });
 // 4 · ANTICIPO DEL COLAPSO — un tramo se fractura y empieza a caer… y el tiempo vuelve atrás
 const PRE = [[-95, 88, T.el5 - 0.1, 0.3, 0.06]];
 B.push({ t0: TB.b4, t1: TB.b5, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const c = shot([[TB.b4, [-400, 115, -40], [0, 22, 0], 900], [TB.b5, [-380, 110, -40], [0, 18, 0], 900]], t); const rew = sm(T.desplomandose + 0.3, TB.b5, t), tt = t - rew * 3; const m = M(tt, { fail: PRE, sideSag: 0 }); world(ctx, tt, c, { m }); splashes(ctx, tt, c, m);
  if (rew > 0) { ctx.fillStyle = `rgba(245,247,247,${0.5 * Math.sin(Math.PI * rew)})`; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = `rgba(245,247,247,${0.4 * rew})`; ctx.lineWidth = 2; for (let y = 0; y < HH; y += 24) { ctx.beginPath(); ctx.moveTo(0, y + (t * 900) % 24); ctx.lineTo(W, y + (t * 900) % 24); ctx.stroke(); } }
  title(ctx, 'EL PUENTE COLAPSÓ', t, T.desplomandose - 0.2, TB.b5); scrim(ctx);
 }, sfx(k) { FX.desgarro(k, T.el5 - 0.1, 0.8); FX.salpicadura(k, T.el5 - 0.1 + 3.44, 0.6); FX.aparece(k, T.desplomandose - 0.2); k.play('riser', T.desplomandose + 0.3, { dur: 0.7, gain: 0.25, minor: true }); } });
 // 5 · ¿QUÉ FALLÓ? — el puente intacto, inmóvil; órbita que revela sus proporciones
 B.push({ t0: TB.b5, t1: TB.b6, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const u = win(t, TB.b5, TB.b6), a = lerp(-2.6, -2.1, E.inOut(u)), c = cam([Math.cos(a) * 470, 115, Math.sin(a) * 470], [0, 58, 0], 820); world(ctx, t, c, { m: M(t, { Th: 0, Av: 0, fail: [], sideSag: 0 }) });
  title(ctx, '¿QUÉ FALLÓ?', t, T.como6 - 0.1); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.b5, { dur: 1.4, top: 900, gain: 0.25 }); FX.aparece(k, T.como6 - 0.1); } });
 // 6–7 · TACOMA NARROWS (EE. UU.) — fotografía de archivo como tarjeta documental sobre la reconstrucción; bandera al decir «Estados Unidos»;
 // después, la línea de tiempo de los cuatro meses (1-jul → 7-nov-1940)
 B.push({ t0: TB.b6, t1: TB.b8, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.b6, TB.b8)), c = cam([lerp(-760, -620, u), lerp(260, 200, u), lerp(-700, -560, u)], [0, 50, 0], 860); world(ctx, t, c, { m: M(t, { Th: 0, Av: 0, fail: [], sideSag: 0 }), cars: CARS(t) }); vign(ctx, 0.6); ctx.fillStyle = 'rgba(11,20,36,0.35)'; ctx.fillRect(0, 0, W, HH);
  P.docPhoto(ctx, IMG.torsion, 540, 640, 940, 620, t, T.era7 + 0.2, TB.b8 - 0.15, { label: 'TACOMA NARROWS · 1940', zoom: [0.5, 0.55, 1.0, 0.5, 0.62, 1.07] });
  P.flagPill(ctx, 'TACOMA, WASHINGTON · EE. UU.', 540, 1060, t, T.estados - 0.05, TB.b8 - 0.3, { px: 34 });
  const a = sm(T.inaugurado, T.inaugurado + 0.4, t) * (1 - sm(TB.b8 - 0.5, TB.b8 - 0.1, t)), b = sm(T.cuatro, T.cuatro + 0.4, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, 70, 1170, 940, 200, 26, 'rgba(11,21,32,0.9)'); ctx.strokeStyle = C.aceroL; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(150, 1250); ctx.lineTo(150 + 780 * E.out(b), 1250); ctx.stroke(); ctx.fillStyle = C.oro; ctx.beginPath(); ctx.arc(150, 1250, 12, 0, TAU); ctx.fill(); txt(ctx, '1 JULIO 1940 — INAUGURACIÓN', 120, 1312, 34, C.blanco, { al: 'left', w: 800 }); if (b > 0.9) { ctx.fillStyle = C.peligro; ctx.beginPath(); ctx.arc(930, 1250, 12, 0, TAU); ctx.fill(); txt(ctx, '7 NOVIEMBRE 1940 — COLAPSO', 960, 1205, 34, C.peligro, { al: 'right', w: 800 }); } ctx.restore(); }
  title(ctx, 'TACOMA NARROWS · EE. UU.', t, T.tacoma - 0.1, TB.b8 - 0.1, 230); scrim(ctx);
 }, sfx(k) { k.play('whoosh', T.era7 + 0.2, { dur: 0.8, top: 1400, gain: 0.25, minor: true }); FX.aparece(k, T.tacoma - 0.1); FX.etiqueta(k, T.estados); FX.motor(k, TB.b7, TB.b8 - TB.b7, 0.25); FX.etiqueta(k, T.inaugurado); FX.etiqueta(k, T.cuatro + 0.4); } });
 // 8 · ALGO EXTRAÑO — en la calzada aparecen pequeñas ondulaciones
 B.push({ t0: TB.b8, t1: TB.b9, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const c = shot([[TB.b8, [-300, 63, -2], [200, 60, 0], 640], [TB.b9, [-280, 64, -3], [200, 59, 0], 640]], t); world(ctx, t, c, { cars: CARS(t, 0.4) });
  title(ctx, 'EL PUENTE SE ONDULABA', t, T.extrano - 0.1); ampTag(ctx, sm(TB.b8 + 1, TB.b8 + 1.4, t)); scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.b8, TB.b9 - TB.b8, 0.6); FX.aparece(k, T.extrano - 0.1); FX.estructura(k, T.extrano, 2, 0.4); } });
 // 9 · OSCILACIÓN VERTICAL — plano lateral amplio: diferentes tramos suben y bajan
 B.push({ t0: TB.b9, t1: TB.b10, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const c = shot([[TB.b9, [-230, 66, -340], [-230, 62, 0], 820], [TB.b10, [-200, 70, -320], [-200, 62, 0], 820]], t); world(ctx, t, c, { cars: CARS(t, 0.3) });
  const tw = c.pr([-TAC.xT, 100, -8]); callout(ctx, tw[0], tw[1], 120, 470, 'TORRE: NO SE MUEVE', sm(T.subia10 + 0.3, T.subia10 + 0.6, t), C.aceroL);
  title(ctx, 'OSCILACIÓN VERTICAL', t, T.subia10 - 0.2); tag(ctx, 'SUBE Y BAJA · NO GIRA', 540, 370, 36, sm(T.ondas - 0.4, T.ondas, t), C.viento); recon(ctx); ampTag(ctx, 0.9); scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.b9, TB.b10 - TB.b9, 0.8); FX.aleteo(k, TB.b9, TB.b10 - TB.b9, 2, 0.6); FX.aparece(k, T.subia10 - 0.2); FX.etiqueta(k, T.ondas - 0.4); } });
 // 10 · EL DISEÑO ERA CLAVE — bajo el tablero, estructura parcialmente transparente
 B.push({ t0: TB.b10, t1: TB.b11, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const c = shot([[TB.b10, [-260, 40, -40], [-150, 58, 0], 620], [TB.b11, [-230, 50, -26], [-120, 58, 0], 660]], t); const r = world(ctx, t, c, { xray: sm(T.diseno - 0.4, T.diseno, t) });
  const g = c.pr(r.sect(-160).P3(-TAC.W / 2, -0.6)); callout(ctx, g[0], g[1], 120, 1240, 'VIGA LATERAL DE ALMA LLENA', sm(T.diseno, T.diseno + 0.3, t), C.aceroL);
  title(ctx, 'EL DISEÑO ERA CLAVE', t, T.peligro11 - 0.1); ampTag(ctx, 0.8); scrim(ctx);
 }, sfx(k) { zoomS(k, TB.b10, 1.0); FX.aparece(k, T.peligro11 - 0.1); FX.etiqueta(k, T.diseno); FX.metal(k, T.diseno + 0.3, 0.5); } });
 // 11 · LARGO, ESTRECHO Y FLEXIBLE — recorrido longitudinal (proporción vano/ancho) → sección 2,5D del mismo tablero: sección abierta, poca rigidez a torsión
 B.push({ t0: TB.b11, t1: TB.b12, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const v = sm(T.flexible - 0.4, T.flexible + 0.2, t); if (v < 1) { ctx.save(); ctx.globalAlpha *= 1 - v; const c = shot([[TB.b11, [-700, 110, 0], [0, 58, 0], 1000], [T.flexible, [-600, 100, -40], [0, 58, 0], 1000]], t); world(ctx, t, c, { m: M(t, { Av: 2, Th: 0 }) }); recon(ctx); ctx.restore(); }
  if (v > 0) { ctx.save(); ctx.globalAlpha *= v; ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); const th = 0.1 * Math.sin(TAU * 0.3 * t) * sm(T.movimientos12 - 0.6, T.movimientos12, t); const r = P.tacSection3D(ctx, 470, 860, 52, th, t, { rot: sm(T.movimientos12 - 0.4, T.movimientos12, t) });
   ctx.strokeStyle = C.blanco; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(r.width[0][0], r.width[0][1] - 40); ctx.lineTo(r.width[1][0], r.width[1][1] - 40); ctx.stroke(); txt(ctx, '11,9 M', (r.width[0][0] + r.width[1][0]) / 2, (r.width[0][1] + r.width[1][1]) / 2 - 76, 36, C.blanco, { w: 800 });
   callout(ctx, r.girder[0], r.girder[1], 640, 1180, 'VIGA DE ALMA LLENA (2,4 M)', 1, C.aceroL, 'right'); callout(ctx, r.slab[0], r.slab[1], 120, 560, 'LOSA', sm(T.flexible + 0.3, T.flexible + 0.6, t), C.hormigon); callout(ctx, r.beams[0], r.beams[1], 120, 1270, 'VIGAS TRANSVERSALES', sm(T.flexible + 0.6, T.flexible + 0.9, t), C.aceroL);
   tag(ctx, 'SECCIÓN ABIERTA: POCA RIGIDEZ A TORSIÓN', 540, 370, 34, sm(T.movimientos12 - 0.3, T.movimientos12, t), C.energia); ctx.restore(); }
  const a = sm(T.largo, T.largo + 0.3, t) * (1 - v); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, 70, 1180, 940, 170, 24, 'rgba(11,21,32,0.88)'); ctx.fillStyle = C.aceroL; ctx.fillRect(110, 1250, 860, 8); ctx.fillStyle = C.oro; ctx.fillRect(110, 1250, 860 / 72, 30); txt(ctx, 'VANO CENTRAL 853 M', 110, 1215, 34, C.blanco, { al: 'left', w: 800 }); txt(ctx, 'ANCHO 11,9 M  (≈ 1 : 72)', 970, 1310, 34, C.oro, { al: 'right', w: 800 }); ctx.restore(); }
  title(ctx, 'POCA RIGIDEZ TORSIONAL', t, T.flexible - 0.1); scrim(ctx);
 }, sfx(k) { k.play('whoosh', TB.b11, { dur: 1.6, top: 800, gain: 0.25 }); FX.etiqueta(k, T.largo); FX.aparece(k, T.flexible - 0.1); k.play('whoosh', T.flexible - 0.4, { dur: 0.6, top: 2200, gain: 0.25, minor: true }); FX.etiqueta(k, T.flexible + 0.3); FX.etiqueta(k, T.flexible + 0.6); FX.etiqueta(k, T.movimientos12 - 0.3); } });
 // 12 · LAS VIGAS LATERALES Y EL VIENTO — primer plano de la viga → sección transversal con líneas de corriente que se separan
 B.push({ t0: TB.b12, t1: TB.b13, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const v = sm(T.modificaban - 0.2, T.modificaban + 0.4, t); if (v < 1) { ctx.save(); ctx.globalAlpha *= 1 - v; const c = shot([[TB.b12, [-180, 58, -40], [-150, 57, -6], 900], [T.modificaban, [-168, 58, -26], [-150, 57, -6], 1000]], t); const r = world(ctx, t, c, { m: M(t, { Av: 1, Th: 0 }) }); const g = c.pr(r.sect(-150).P3(-TAC.W / 2, -0.6)); callout(ctx, g[0], g[1], 120, 1240, 'VIGA LATERAL MACIZA', sm(T.vigas, T.vigas + 0.3, t), C.aceroL); ctx.restore(); }
  if (v > 0) { ctx.save(); ctx.globalAlpha *= v; ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); P.tacSection(ctx, 540, 900, 34, 0.0, t, { flow: sm(T.modificaban, T.aire13, t), vortex: sm(T.circulaba, T.circulaba + 0.5, t) }); callout(ctx, 760, 900, 640, 1200, 'FLUJO SEPARADO', sm(T.circulaba, T.circulaba + 0.3, t), C.viento, 'right'); txt(ctx, 'VIENTO →', 120, 560, 40, C.viento, { al: 'left', w: 800 }); ctx.restore(); }
  title(ctx, 'EL AIRE CAMBIABA DE DIRECCIÓN', t, T.aire13 - 0.1); scrim(ctx);
 }, sfx(k) { zoomS(k, TB.b12, 0.8); FX.etiqueta(k, T.vigas); FX.viento(k, T.modificaban, TB.b13 - T.modificaban, 0.9); FX.aparece(k, T.aire13 - 0.1); FX.etiqueta(k, T.circulaba); } });
 // 13 · EL MOMENTO DECISIVO — la ondulación vertical da paso a la torsión (transición dinámica); cámara frontal y elevada
 B.push({ t0: TB.b13, t1: TB.b14, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const c = shot([[TB.b13, [-600, 160, -420], [0, 58, 0], 900], [TB.b14, [-760, 120, -40], [0, 58, 0], 1050]], t); world(ctx, t, c);
  title(ctx, 'EL MOVIMIENTO CAMBIÓ', t, T.decisivo - 0.2); tag(ctx, 'ANTES SE AFLOJÓ UNA ABRAZADERA DEL CABLE EN EL CENTRO', 540, 370, 32, sm(T.decisivo + 0.2, T.decisivo + 0.5, t), C.blanco); recon(ctx); scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.b13, TB.b14 - TB.b13, 1); FX.aparece(k, T.decisivo - 0.2); MUS.golpe(k, T.decisivo, { gain: 0.7, chord: ['D2', 'A2', 'D3', 'F3'] }); FX.crujido(k, T.decisivo + 0.6); } });
 // 14 · OSCILACIÓN TORSIONAL — desde la calzada se ve la anchura: eje longitudinal (discontinuo) y dos mitades que giran en sentidos opuestos
 const edgeArrows = (ctx, c, r, x, a) => { if (a <= 0) return; const s0 = r.sect(x), dth = TAC.th(x, { ...M(0), t: 0 }); void dth; const L0 = c.pr(s0.P3(-TAC.W / 2, 0.6)), R0 = c.pr(s0.P3(TAC.W / 2, 0.6)), up = s0.th; ctx.save(); ctx.globalAlpha *= a; for (const [p, sg] of [[L0, -1], [R0, 1]]) { const dir = Math.sign(up * sg) || 1; ctx.save(); ctx.translate(p[0], p[1] - 30 * dir); ctx.rotate(dir > 0 ? -Math.PI / 2 : Math.PI / 2); P.hArrow(ctx, 0, 0, 46, C.oro, 12); ctx.restore(); } ctx.restore(); };
 const axisLine = (ctx, c, r, x0, x1, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.oro; ctx.lineWidth = 3; ctx.setLineDash([16, 12]); ctx.beginPath(); let f = true; for (let x = x0; x <= x1; x += 8) { const p = c.pr(r.sect(x).P3(0, 0.15)); if (p[2] < 2) continue; f ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); f = false; } ctx.stroke(); ctx.setLineDash([]); ctx.restore(); };
 B.push({ t0: TB.b14, t1: TB.b15, in: { type: 'cut' }, draw(ctx, t) {
  const c = shot([[TB.b14, [-360, 65, -3], [-60, 57, 0], 760], [TB.b15, [-340, 66, -3], [-50, 57, 0], 760]], t); const r = world(ctx, t, c);
  axisLine(ctx, c, r, -330, 200, sm(T.retorcerse15, T.retorcerse15 + 0.4, t)); const ex = c.pr(r.sect(-150).P3(0, 0.2)); callout(ctx, ex[0], ex[1], 640, 1220, 'EJE LONGITUDINAL', sm(T.retorcerse15 + 0.2, T.retorcerse15 + 0.5, t), C.oro, 'right'); edgeArrows(ctx, c, r, -213, sm(T.retorcerse15 + 0.5, T.retorcerse15 + 0.8, t));
  title(ctx, 'OSCILACIÓN TORSIONAL', t, T.retorcerse15 - 0.2); tag(ctx, 'NODO EN EL CENTRO DEL VANO', 540, 370, 34, sm(T.retorcerse15 + 0.4, T.retorcerse15 + 0.7, t), C.blanco); recon(ctx); scrim(ctx);
 }, sfx(k) { FX.aleteo(k, TB.b14, TB.b16 - TB.b14, 5, 1); FX.aparece(k, T.retorcerse15 - 0.2); FX.estructura(k, T.retorcerse15, 2, 0.6); FX.etiqueta(k, T.retorcerse15 + 0.2); } });
 // 15 · UN BORDE SUBE Y EL OTRO BAJA — acercamiento a una sección del tablero (cuarto del vano), bordes marcados
 B.push({ t0: TB.b15, t1: TB.b16, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const c = shot([[TB.b15, [-290, 66, -10], [-213, 58, 0], 900], [TB.b16, [-280, 70, -40], [-213, 58, 0], 950]], t); const r = world(ctx, t, c);
  const s = r.sect(-213), L = c.pr(s.P3(-TAC.W / 2, 0.6)), R = c.pr(s.P3(TAC.W / 2, 0.6)); callout(ctx, L[0], L[1], 120, 560, 'BORDE IZQUIERDO', sm(T.un16, T.un16 + 0.3, t), C.oro); callout(ctx, R[0], R[1], 640, 1200, 'BORDE DERECHO', sm(T.subia16, T.subia16 + 0.3, t), C.oro, 'right'); edgeArrows(ctx, c, r, -213, sm(T.subia16, T.subia16 + 0.3, t)); recon(ctx);
  title(ctx, 'TORSIÓN DEL TABLERO', t, T.un16 - 0.1); scrim(ctx);
 }, sfx(k) { FX.etiqueta(k, T.un16); FX.etiqueta(k, T.subia16); FX.crujido(k, T.bajaba); } });
 // 16 · LA GRAN REVELACIÓN — congelado, tablero transparente; aparece el viento alrededor
 B.push({ t0: TB.b16, t1: TB.b17, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const fz = TB.b16, c = shot([[TB.b16, [-280, 70, -40], [-213, 58, 0], 950], [TB.b17, [-230, 62, -60], [-213, 58, 0], 1300]], t); world(ctx, t, c, { m: M(fz), xray: sm(TB.b16, TB.b16 + 0.6, t), wind: sm(T.extraordinario - 0.4, T.extraordinario + 0.4, t) });
  const v = sm(TB.b17 - 0.5, TB.b17, t); if (v > 0) { ctx.fillStyle = `rgba(11,21,32,${v})`; ctx.fillRect(0, 0, W, HH); }
  title(ctx, 'EL VIENTO Y EL PUENTE INTERACTUABAN', t, T.extraordinario - 0.2); scrim(ctx);
 }, sfx(k) { k.play('riser', TB.b16, { dur: 1.6, gain: 0.25, minor: true }); FX.aparece(k, T.extraordinario - 0.2); FX.viento(k, T.extraordinario - 0.4, 1.8, 0.7); } });
 // 17–19 · MECANISMO: sección derivada del tablero; el giro cambia el flujo; momento aerodinámico en fase con la velocidad de giro; energía creciente
 const secTh = (t) => { const a = t < TB.b18 ? 0.12 : t < TB.b19 ? 0.15 : 0.1 + 0.22 * win(t, TB.b19, TB.b20); return a * Math.sin(TAU * 0.33 * (t - TB.b17)); };
 const secW = (t) => (secTh(t + 0.02) - secTh(t - 0.02)) / 0.04 / 0.7;
 const energyBar = (ctx, t, a, lvl) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.rr(ctx, 90, 1210, 900, 140, 24, 'rgba(11,21,32,0.88)'); txt(ctx, 'ENERGÍA DE LA OSCILACIÓN', 120, 1245, 34, C.blanco, { al: 'left', w: 800 }); txt(ctx, 'cualitativo', 960, 1245, 32, 'rgba(245,247,247,0.7)', { al: 'right', w: 600 }); P.rr(ctx, 120, 1285, 840, 36, 18, '#22313b'); P.rr(ctx, 120, 1285, Math.max(36, 840 * lvl), 36, 18, C.energia); ctx.restore(); };
 B.push({ t0: TB.b17, t1: TB.b20, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); const zs = t < TB.b19 ? 36 : lerp(36, 26, E.inOut(win(t, TB.b19, TB.b19 + 1))), th = secTh(t), wv = secW(t);
  const r = P.tacSection(ctx, 540, 880, zs, th, t, { flow: 1, vortex: sm(T.cambiaba, T.cambiaba + 0.5, t), moment: sm(T.fuerzas19, T.fuerzas19 + 0.4, t), w: wv, edges: true });
  for (let k = 0; k < 4; k++) P.hArrow(ctx, 60, 760 + k * 60, 70, 'rgba(81,196,229,0.85)', 12); txt(ctx, 'VIENTO', 60, 700, 36, C.viento, { al: 'left', w: 800 });
  callout(ctx, r.center[0] + 220, r.center[1] - 250, 640, 470, 'MOMENTO AERODINÁMICO', sm(T.fuerzas19, T.fuerzas19 + 0.3, t) * (1 - sm(TB.b19, TB.b19 + 0.3, t)), C.peligro, 'right');
  tag(ctx, 'EMPUJA EN EL MISMO SENTIDO DEL GIRO', 540, 370, 34, sm(T.reforzar, T.reforzar + 0.3, t) * (1 - sm(TB.b19, TB.b19 + 0.3, t)), C.peligro);
  energyBar(ctx, t, sm(T.reforzar, T.reforzar + 0.4, t), 0.15 + 0.15 * win(t, T.reforzar, TB.b19) + 0.6 * win(t, TB.b19, TB.b20));
  const steps = [['1 · EL VIENTO LLEGA', TB.b17], ['2 · EL TABLERO GIRA', T.girar], ['3 · CAMBIA EL FLUJO', T.cambiaba], ['4 · FUERZA EN EL SENTIDO DEL GIRO', T.fuerzas19], ['5 · MÁS AMPLITUD SI LA DISIPACIÓN NO BASTA', T.cada20]]; { const bgA = sm(TB.b17, TB.b17 + 0.3, t); if (bgA > 0) { ctx.save(); ctx.globalAlpha *= bgA; P.rr(ctx, 50, 978, 980, 212, 22, 'rgba(11,21,32,0.88)'); ctx.restore(); } } steps.forEach(([lab, t0], i) => { const a = sm(t0, t0 + 0.3, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a * (i === steps.filter((q) => t >= q[1]).length - 1 ? 1 : 0.55); txt(ctx, lab, 80, 1004 + i * 40, 32, i === 3 ? C.peligro : i === 4 ? C.energia : C.blanco, { al: 'left', w: 800 }); ctx.restore(); });
  title(ctx, 'EL GIRO ALTERA EL AIRE', t, T.girar - 0.1, TB.b18); title(ctx, 'EL VIENTO ALIMENTA LA TORSIÓN', t, T.fuerzas19 - 0.2, TB.b19); title(ctx, 'MÁS ENERGÍA · MÁS OSCILACIÓN', t, T.energia20 - 0.4);
  ampTag(ctx, 0.85); scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.b17, TB.b20 - TB.b17, 0.8); FX.aleteo(k, TB.b17, TB.b20 - TB.b17, 3, 0.7); FX.aparece(k, T.girar - 0.1); FX.aparece(k, T.fuerzas19 - 0.2); FX.etiqueta(k, T.reforzar); FX.aparece(k, T.energia20 - 0.4); k.play('riser', TB.b19, { dur: TB.b20 - TB.b19, gain: 0.2, minor: true }); } });
 // 20 · OSCILACIONES CRECIENTES — de vuelta al puente completo, ángulo bajo
 B.push({ t0: TB.b20, t1: TB.b21, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const c = shot([[TB.b20, [-420, 66, -6], [-100, 56, 0], 800], [TB.b21, [-400, 68, -8], [-80, 56, 0], 800]], t); world(ctx, t, c, { wind: 0.5 });
  title(ctx, 'OSCILACIONES CRECIENTES', t, T.crecia - 0.3); scrim(ctx);
 }, sfx(k) { FX.aleteo(k, TB.b20, TB.b22 - TB.b20, 5, 1.1); FX.estructura(k, T.crecia, 3, 0.8); FX.aparece(k, T.crecia - 0.3); } });
 // 21 · INESTABILIDAD AEROELÁSTICA — sección + flujo + giro + momento, con el bucle de realimentación
 const loop = (ctx, t, a) => { if (a <= 0) return; const items = ['VIENTO', 'GIRO', 'CAMBIO DE FLUJO', 'FUERZA AERODINÁMICA', 'MÁS GIRO'], cx = 540, cy = 1140, R = 230; ctx.save(); ctx.globalAlpha *= a; for (let i = 0; i < 5; i++) { const an = -Math.PI / 2 + (i * TAU) / 5, x = cx + Math.cos(an) * R * 1.55, y = cy + Math.sin(an) * R * 0.62, on = sm(T.los22 + i * 0.35, T.los22 + i * 0.35 + 0.3, t); ctx.globalAlpha = a * on; ctx.font = '800 32px Nunito'; const tw = ctx.measureText(items[i]).width; P.rr(ctx, x - tw / 2 - 16, y - 26, tw + 32, 52, 26, i === 4 ? 'rgba(241,124,86,0.9)' : 'rgba(11,21,32,0.9)'); txt(ctx, items[i], x, y + 1, 32, i === 4 ? C.fondo : C.blanco, { w: 800 }); const an2 = -Math.PI / 2 + ((i + 0.5) * TAU) / 5; ctx.fillStyle = C.viento; ctx.beginPath(); ctx.arc(cx + Math.cos(an2) * R * 1.4, cy + Math.sin(an2) * R * 0.56, 7, 0, TAU); ctx.fill(); } ctx.restore(); };
 B.push({ t0: TB.b21, t1: TB.b22, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); const th = 0.3 * Math.sin(TAU * 0.33 * t), wv = (0.3 * Math.cos(TAU * 0.33 * t) * TAU * 0.33) / 0.7;
  P.tacSection(ctx, 540, 640, 26, th, t, { flow: 1, vortex: 1, moment: 1, w: wv }); loop(ctx, t, sm(T.los22, T.los22 + 0.3, t)); tag(ctx, 'CRECE SI EL APORTE DEL VIENTO SUPERA LA DISIPACIÓN', 540, 1385, 32, sm(T.aeroelastica + 0.4, T.aeroelastica + 0.7, t), C.blanco);
  title(ctx, 'INESTABILIDAD AEROELÁSTICA', t, T.inestabilidad - 0.2); tag(ctx, 'FLUTTER TORSIONAL · NO ES RESONANCIA FORZADA', 540, 340, 32, sm(T.aeroelastica + 0.2, T.aeroelastica + 0.5, t), C.energia); scrim(ctx);
 }, sfx(k) { FX.aleteo(k, TB.b21, TB.b22 - TB.b21, 3, 0.8); for (let i = 0; i < 5; i++) FX.etiqueta(k, T.los22 + i * 0.35); FX.aparece(k, T.inestabilidad - 0.2); MUS.golpe(k, T.aeroelastica, { gain: 0.8, chord: ['D2', 'A2', 'D3', 'F3'] }); FX.etiqueta(k, T.aeroelastica + 0.2); } });
 // 22 · EL LÍMITE — torsión extrema (~28°, registros), fallos localizados progresivos: péndolas que se rompen cerca del centro
 B.push({ t0: TB.b22, t1: TB.b23, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const c = shot([[TB.b22, [-280, 80, -10], [0, 58, 0], 820], [T.partes, [-110, 82, -60], [0, 72, 0], 900], [TB.b23, [-420, 120, -40], [0, 24, 0], 880]], t); const r = world(ctx, t, c);
  const s0 = SNAP[0], p = c.pr([s0[0], r.cableY(s0[0], -1) - 6, -TAC.W / 2]); callout(ctx, p[0], p[1], 120, 470, 'FALLAS LOCALES: PÉNDOLAS Y CONEXIONES', sm(T.partes, T.partes + 0.3, t), C.peligro); recon(ctx);
  title(ctx, 'LA ESTRUCTURA LLEGÓ A SU LÍMITE', t, T.tanto - 0.1); tag(ctx, 'GIRO DE HASTA ≈ 28° · SEGÚN TESTIMONIOS DE LA ÉPOCA', 540, 1385, 32, sm(TB.b22 + 0.4, TB.b22 + 0.8, t), C.energia); scrim(ctx);
 }, sfx(k) { FX.aleteo(k, TB.b22, TB.b23 - TB.b22, 5, 1.2); FX.aparece(k, T.tanto - 0.1); for (const s of SNAP) FX.desgarro(k, s[1], 0.6); FX.crujido(k, T.partes - 0.6); } });
 // 23 · EL COLAPSO — plano general: el tramo central se rompe primero y cae; luego otros tramos; las torres siguen en pie
 B.push({ t0: TB.b23, t1: TB.b24, in: { type: 'fade', d: 0.3 }, draw(ctx, t) { recon(ctx, 0);
  const c = shot([[TB.b23, [-420, 120, -40], [0, 24, 0], 880], [T.agua24 + 0.5, [-390, 100, -70], [0, 8, 0], 880], [TB.b24, [-420, 170, -200], [0, 30, 0], 840]], t); const m = M(t); world(ctx, t, c, { m }); splashes(ctx, t, c, m);
  pill(ctx, '7 DE NOVIEMBRE DE 1940', 540, 250, 44, t, T.rompio - 0.2, C.oro, C.fondo); recon(ctx); scrim(ctx);
 }, sfx(k) { FX.desgarro(k, COL[0][2], 1.2); FX.golpeSordo(k, COL[0][2] + 0.2); FX.salpicadura(k, COL[0][2] + 3.44, 1.1); FX.desgarro(k, COL[1][2], 0.9); FX.aparece(k, T.rompio - 0.2); } });
 // 23b · COLAPSO REAL — la fotografía de archivo aparece como evidencia sobre la reconstrucción atenuada; acercamiento lento al tablero dañado
 const TPH = T.agua24 + 0.25, TPH1 = T.ingenieria25 + 0.9;
 B.push({ t0: TB.b24, t1: TB.b25, in: { type: 'cut' }, draw(ctx, t) {
  const c = shot([[TB.b24, [-420, 170, -200], [0, 30, 0], 840], [TB.b25, [-640, 520, -700], [0, 30, 0], 840]], t); const m = M(t); world(ctx, t, c, { m }); splashes(ctx, t, c, m);
  const ph = sm(TPH, TPH + 0.6, t) * (1 - sm(TPH1 - 0.5, TPH1, t)); if (ph > 0) { ctx.fillStyle = `rgba(11,20,36,${0.55 * ph})`; ctx.fillRect(0, 0, W, HH); }
  P.docPhoto(ctx, IMG.colapso, 540, 820, 960, 860, t, TPH, TPH1, { label: 'COLAPSO REAL · 7 NOV 1940', zoom: [0.5, 0.5, 1.0, 0.28, 0.62, 1.22] });
  const g = sm(TB.b25 - 1.0, TB.b25, t); if (g > 0) { ctx.fillStyle = `rgba(11,21,32,${0.8 * g})`; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = `rgba(81,196,229,${0.25 * g})`; ctx.lineWidth = 1; for (let x = 0; x < W; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); } for (let y = 0; y < HH; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
  if (ph < 0.5) recon(ctx, 1 - ph * 2);
  title(ctx, 'UNA LECCIÓN PARA LA INGENIERÍA', t, T.desastre - 0.1, 0, 200); tag(ctx, 'LAS TORRES SIGUIERON EN PIE', 540, 1385, 32, sm(TPH1, TPH1 + 0.3, t) * (1 - sm(TB.b25 - 1.0, TB.b25 - 0.6, t)), C.blanco); scrim(ctx);
 }, sfx(k) { FX.desgarro(k, COL[2][2], 0.7); FX.salpicadura(k, COL[1][2] + 3.44, 0.9); FX.salpicadura(k, COL[2][2] + 3.44, 0.8); FX.oleaje(k, TB.b24, TB.b25 - TB.b24 + 1, 0.5); k.play('whoosh', TPH, { dur: 0.8, top: 1200, gain: 0.22, minor: true }); FX.aparece(k, T.desastre - 0.1); } });
 // 25 · INGENIERÍA AERODINÁMICA — ensayos y análisis: la sección de 1940 (la oscilación crece) frente a dos enfoques más estables (ejemplos)
 B.push({ t0: TB.b25, t1: TB.b26, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = 'rgba(81,196,229,0.16)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); } for (let y = 0; y < HH; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const a1 = sm(TB.b25, TB.b25 + 0.4, t), a2 = sm(T.interactuan, T.interactuan + 0.4, t), a3 = sm(T.interactuan + 0.8, T.interactuan + 1.2, t), grow = 0.06 + 0.24 * win(t, TB.b25, TB.b26);
  const row = (y, type, th, lab, col, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.windTunnel(ctx, 540, y, 940, 290, th, t, { type }); txt(ctx, lab, 540, y - 168, 32, col, { w: 800 }); ctx.restore(); };
  row(520, 'H', grow * Math.sin(TAU * 0.4 * t), 'SECCIÓN DE 1940 · LA OSCILACIÓN CRECE', C.peligro, a1); row(890, 'cajon', 0.02 * Math.sin(TAU * 0.4 * t), 'SECCIÓN CERRADA AERODINÁMICA (EJEMPLO)', C.viento, a2); row(1260, 'celosia', 0.025 * Math.sin(TAU * 0.4 * t), 'CELOSÍA PROFUNDA, COMO EL PUENTE DE 1950', C.viento, a3);
  title(ctx, 'INGENIERÍA AERODINÁMICA', t, T.interactuan - 0.3, 0, 230); tag(ctx, 'ENSAYOS Y ANÁLISIS AERODINÁMICOS · NO HAY UNA ÚNICA SOLUCIÓN', 540, 1440, 32, sm(T.fundamental, T.fundamental + 0.3, t), C.blanco); scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.b25, TB.b26 - TB.b25, 0.7); FX.aparece(k, T.interactuan - 0.3); FX.etiqueta(k, T.interactuan); FX.etiqueta(k, T.interactuan + 0.8); FX.etiqueta(k, T.fundamental); } });
 // 26 · NO ERA SOLO LA FUERZA DEL VIENTO — el puente original intacto; viento sobre el agua; la cámara se acerca al tablero
 B.push({ t0: TB.b26, t1: TB.b27, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const c = shot([[TB.b26, [-640, 140, -220], [0, 52, 0], 860], [TB.b27, [-330, 70, -60], [-213, 58, 0], 860]], t); world(ctx, t, c, { m: M(t, { Th: 0, Av: 0, fail: [], sideSag: 0 }), wind: 0.9 });
  title(ctx, 'NO ERA SOLO LA FUERZA DEL VIENTO', t, T.peligro27 - 0.2); scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.b26, TB.b27 - TB.b26, 1.0); FX.aparece(k, T.peligro27 - 0.2); } });
 // 27 · EL PELIGRO ESTABA EN LA INTERACCIÓN — último corte: el tablero empieza a girar y el flujo cambia → alejamiento al puente completo
 B.push({ t0: TB.b27, t1: TB.b28, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const v = sm(T.empiece + 0.1, TB.b28 - 0.2, t); if (v < 1) { ctx.save(); ctx.globalAlpha *= 1 - v; ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, HH); const a = 0.04 + 0.14 * win(t, TB.b27, T.empiece), th = a * Math.sin(TAU * 0.33 * t), wv = (a * Math.cos(TAU * 0.33 * t) * TAU * 0.33) / 0.7; P.tacSection(ctx, 540, 880, 34, th, t, { flow: 1, vortex: 0.8, moment: sm(T.estructura28, T.estructura28 + 0.4, t), w: wv }); ctx.restore(); }
  if (v > 0) { ctx.save(); ctx.globalAlpha *= v; const c = cam([-640, 140, -120], [0, 50, 0], 880); world(ctx, t, c, { m: M(t, { Th: 0.08, Av: 0, fail: [], sideSag: 0 }) }); ctx.restore(); }
  title(ctx, 'EL PELIGRO ESTABA EN LA INTERACCIÓN', t, T.fuerza27 ? T.sino + 0.2 : T.sino); scrim(ctx);
 }, sfx(k) { FX.aleteo(k, TB.b27, TB.b28 - TB.b27, 3, 0.6); FX.aparece(k, T.sino + 0.2); k.play('whoosh', T.empiece + 0.1, { dur: 1.2, top: 800, gain: 0.25 }); } });
 // 28 · ASOMBROTECA — vista aérea del estrecho, luz más cálida
 B.push({ t0: TB.b28, t1: DURATION + 1, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const u = E.inOut(win(t, TB.b28, DURATION)), an = lerp(-2.45, -2.05, u), c = cam([Math.cos(an) * lerp(900, 1100, u), lerp(220, 340, u), Math.sin(an) * lerp(900, 1100, u)], [0, 50, 0], 860); world(ctx, t, c, { m: M(t, { Th: 0, Av: 0, fail: [], sideSag: 0 }), warm: 1 }); vign(ctx, 0.5);
  const a = sm(T.asombroteca, T.asombroteca + 0.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(245,247,247,0.75)'; ctx.lineWidth = 2; const lw = 280 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 300); ctx.lineTo(540 + lw, 300); ctx.moveTo(540 - lw, 420); ctx.lineTo(540 + lw, 420); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 362, 64, C.blanco, { w: 800, ls: 10 }); ctx.restore(); }
  const b = sm(T.ciencia, T.ciencia + 0.5, t); if (b > 0) { ctx.save(); ctx.globalAlpha *= b; txt(ctx, 'LA CIENCIA OCULTA DE LO IMPOSIBLE', 540, 470, 34, C.oro, { w: 700, ls: 3 }); ctx.restore(); }
  scrim(ctx);
 }, sfx(k) { FX.viento(k, TB.b28, DURATION - TB.b28, 0.5); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.ciencia + 1.0); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['1940', 'retorcerse', 'goma', 'terremoto', 'viento', 'desplomándose', 'Tacoma', 'Narrows', 'cuatro', 'ondas', 'diseño', 'flexible', 'vigas', 'aire', 'decisivo', 'retorcerse.', 'borde', 'extraordinario', 'flujo', 'reforzar', 'energía', 'crecía', 'inestabilidad', 'aeroelástica', 'fuerzas', 'agua', 'desastre', 'fundamental', 'peligro', 'Asombroteca', 'imposible'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.02, a: 0.6, hold: DURATION - 2.2 }); },
  music(k) {
   // banda sonora original: misterio → curiosidad → inquietud → descubrimiento → tensión creciente → clímax → pausa → resolución
   const Dm = [['D2', 'A2', 'D3', 'F3'], ['A#1', 'F2', 'A#2', 'D3'], ['G1', 'D2', 'G2', 'A#2'], ['A1', 'E2', 'A2', 'C#3']];
   const Am = [['A1', 'E2', 'A2', 'C3'], ['F1', 'C2', 'F2', 'A2'], ['D2', 'A2', 'D3', 'F3'], ['E1', 'B1', 'E2', 'G#2']];
   const DM = [['D2', 'A2', 'D3', 'F#3'], ['B1', 'F#2', 'B2', 'D3'], ['G1', 'D2', 'G2', 'B2'], ['A1', 'E2', 'A2', 'C#3']];
   MUS.epica(k, 0, TB.b5, { bpm: 78, chords: Dm, gain: 0.9, drums: 0.4, strings: 1, ostinato: 0.6 });
   MUS.epica(k, TB.b5, TB.b9, { bpm: 72, chords: Am, gain: 0.75, drums: 0.15, strings: 0.9, ostinato: 0.3 });
   MUS.epica(k, TB.b9, TB.b13, { bpm: 80, chords: Dm, gain: 0.8, drums: 0.3, strings: 0.9, ostinato: 0.6 });
   MUS.epica(k, TB.b13, TB.b22, { bpm: 92, chords: Dm, gain: 0.85, drums: 0.6, strings: 1, ostinato: 0.9 });
   MUS.epica(k, TB.b22, TB.b24, { bpm: 100, chords: Dm, gain: 0.95, drums: 0.9, strings: 1, ostinato: 1 });
   MUS.epica(k, TB.b24, TB.b26, { bpm: 66, chords: Am, gain: 0.7, drums: 0.1, strings: 1, ostinato: 0.2 });
   MUS.epica(k, TB.b26, TB.b28, { bpm: 76, chords: DM, gain: 0.9, drums: 0.4, strings: 1, ostinato: 0.6 });
   MUS.epica(k, TB.b28, DURATION, { bpm: 60, chords: [['D2', 'A2', 'D3', 'F#3']], gain: 0.9, drums: 0, strings: 1, ostinato: 0 });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { for (const k of Object.keys(window.FOTOS || {})) { IMG[k] = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = window.FOTOS[k]; }); } }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
