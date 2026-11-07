// =====================================================================================================
// episodio.js — «El hombre que imaginó los satélites de comunicación en 1945» (Arthur C. Clarke) · Asombroteca · Ep. 07 · PLANTILLA v1.25
// Física: TODA la geometría orbital comparte el convenio de P.earth3 (P.orbView). La Tierra gira de oeste a este (rot disminuye con el
// tiempo); un satélite geoestacionario tiene LONGITUD FIJA, así que en las vistas externas recorre su órbita a la vez que gira la Tierra
// (nunca está quieto en el espacio). Las coberturas salen del horizonte geométrico con la altura REAL (k = 6,61 radios) y elevación
// mínima de 5°; los enlaces solo se dibujan si la estación ve el satélite sobre su horizonte (nada atraviesa la Tierra). Cuando la
// distancia se comprime se rotula «DISTANCIAS ESQUEMÁTICAS». Reloj = voz (87,17 s).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS, IMG = {};
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3), RAD = Math.PI / 180;
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const T = { doce: wt(0, 'doce'), artificial: wt(0, 'artificial'), imagino: wt(1, 'imaginó'), television: wt(1, 'televisión'), espacio: wt(1, 'espacio'), clarke: wt(2, 'clarke'), ficcion: wt(3, 'ficción'),
  estaciones: wt(4, 'estaciones'), repetidoras: wt(4, 'repetidoras'), orbita4: wt(4, 'órbita'), tierra4: wt(4, 'tierra'), antena6: wt(6, 'antena'), satelite6: wt(6, 'satélite'), secreto: wt(7, 'secreto'),
  treinta: wt(8, 'treinta'), km: wt(8, 'kilómetros'), ecuador: wt(8, 'ecuador'), gira: wt(9, 'gira'), vuelta: wt(9, 'vuelta'), quieto: wt(10, 'quieto'), cielo: wt(10, 'cielo'), geo: wt(11, 'geoestacionaria'),
  inmovil: wt(12, 'inmóvil'), velocidad: wt(13, 'velocidad'), rotacion: wt(14, 'rotación'), senal: wt(15, 'señal'), satelite15: wt(15, 'satélite'), retrans: wt(16, 'retransmitirla'), region: wt(16, 'región'),
  tres: wt(17, 'tres'), cobertura: wt(17, 'cobertura'), y1945: wt(18, '1945'), sputnik: wt(19, 'sputnik'), y1957: wt(19, '1957'), invento: wt(20, 'inventó'), primero: wt(20, 'primero'), influyente: wt(21, 'influyente'),
  globales: wt(21, 'globales'), antena22: wt(22, 'antena'), parabolica: wt(22, 'parabólica'), historia: wt(22, 'historia'), idea: wt(23, 'idea'), asombroteca: wt(24, 'asombroteca'), end: A.speech_end };
 for (let i = 0; i < A.segments.length; i++) T['s' + i] = A.segments[i].s;
 const B0 = {}; for (const i of [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]) B0['b' + i] = T['s' + i] - 0.2;

 // ---------------- utilidades ----------------
 const C = { oro: '#FFD447', blanco: '#F5F7FA', sepia: '#A67A54', papel: '#DEC9A8', cian: '#53C5E8', fuego: '#FF9A42', espacio: '#050B18', coral: '#FF7A6B' };
 const txt = (ctx, s, x, y, px, c, o = {}) => { ctx.save(); ctx.font = `${o.w || 800} ${px}px ${o.f || 'Nunito'}`; ctx.fillStyle = c; ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle'; if (o.ls) ctx.letterSpacing = o.ls + 'px'; if (o.sh) { ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 14; } ctx.fillText(s, x, y); ctx.restore(); };
 const title = (ctx, s, t, t0, t1, o = {}) => { const a = sm(t0, t0 + 0.3, t) * (1 - sm(t1 - 0.3, t1, t)); if (a <= 0) return; const y = o.y || 230, e = E.out(cl((t - t0) / 0.5)); ctx.save(); ctx.globalAlpha *= a; const g = ctx.createLinearGradient(0, 0, 0, y + 170); g.addColorStop(0, 'rgba(0,0,0,0.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, y + 170); ctx.font = `900 ${o.px || 62}px Nunito`; const tw = ctx.measureText(s).width; ctx.fillStyle = C.oro; ctx.fillRect(540 - tw / 2 * e - 10, y + 44, (tw + 20) * e, 8); txt(ctx, s, 540, y, o.px || 62, C.blanco, { w: 900, sh: 1 }); ctx.restore(); };
 const lab = (ctx, s, anchor, x, y, t, t0, t1, o = {}) => P.ykLabel(ctx, s, anchor, x, y, t, t0, t1, { px: 38, ...o });
 const recon = (ctx, s, t, t0, t1) => P.ykRecon(ctx, t, t0, t1, { s, y: 1330 });
 const vign = (ctx, a = 0.4) => { const g = ctx.createRadialGradient(540, 900, 500, 540, 900, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); };
 const stars = (ctx, n = 300, seed = 4) => { const R = H.rng(seed); ctx.save(); for (let i = 0; i < n; i++) { const x = R() * W, y = R() * HH, s = R() < 0.08 ? 3 : 1.8; ctx.globalAlpha = 0.3 + R() * 0.6; ctx.fillStyle = R() < 0.15 ? '#ffe7c4' : '#e8f0ff'; ctx.fillRect(x, y, s, s); } ctx.restore(); };
 // fondo espacial: degradado profundo, Vía Láctea tenue en diagonal y estrellas fijas (las estrellas NO se mueven con la Tierra)
 const space = (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#02040b'); g.addColorStop(1, '#081429'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.save(); ctx.translate(540, 900); ctx.rotate(-0.55); const mw = ctx.createLinearGradient(0, -260, 0, 260); mw.addColorStop(0, 'rgba(120,140,190,0)'); mw.addColorStop(0.5, 'rgba(120,140,190,0.10)'); mw.addColorStop(1, 'rgba(120,140,190,0)'); ctx.fillStyle = mw; ctx.fillRect(-1400, -260, 2800, 520); ctx.restore(); stars(ctx, 340, 4); };
 const bill = (ctx, cam, foot, h, f) => { const a = cam.clip([foot], 1)[0], b = cam.clip([[foot[0], foot[1] + h, foot[2]]], 1)[0]; if (!a || !b) return null; return f(a[0], a[1], a[1] - b[1]); };
 const sepiaWarm = (ctx, a) => { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = a; ctx.fillStyle = '#E7B56E'; ctx.fillRect(0, 0, W, HH); ctx.restore(); };
 const fadeIn = (ctx, t, t0, d = 0.4) => { const a = 1 - sm(t0, t0 + d, t); if (a > 0) { ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, HH); } };
 const arrowHead = (ctx, x, y, ang, s, col) => { ctx.save(); ctx.fillStyle = col; ctx.translate(x, y); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s * 0.7, -s * 0.6); ctx.lineTo(-s * 0.7, s * 0.6); ctx.closePath(); ctx.fill(); ctx.restore(); };
 const schem = (ctx, t, t0, t1) => lab(ctx, 'DISTANCIAS ESQUEMÁTICAS', null, 540, 345, t, t0, t1, { col: 'rgba(245,247,250,0.75)', px: 32 });

 // ---------------- física orbital (comprobada en comprobaciones.js) ----------------
 const ORB = P.ORB, KS = 2.15; // KS: radio ESQUEMÁTICO de la órbita (en radios terrestres) cuando no cabe a escala
 // ¿ve la estación (lat, lon) al satélite GEO (lon s) con elevación ≥ emin? (geometría real: k = 6,61)
 const elev = (lat, lon, lonS, k = ORB.k) => { const c = Math.cos(lat * RAD) * Math.cos((lon - lonS) * RAD), num = c - 1 / k, den = Math.sqrt(Math.max(1e-9, 1 - c * c)); return Math.atan2(num, den) / RAD; };
 const sees = (lat, lon, lonS, k = ORB.k, emin = 5) => elev(lat, lon, lonS, k) >= emin && elev(lat, lon, lonS, KS) >= 0;
 const FP = 0.94; // huella con elevación mínima de 5°: ψ = acos(cos5°/k) − 5° = 76,3° frente a 81,3° del horizonte geométrico
 const CITY = { lon: [51.5, -0.13, 'LONDRES'], ny: [40.7, -74.0, 'NUEVA YORK'], cap: [-33.9, 18.4, 'CIUDAD DEL CABO'], tok: [35.7, 139.7, 'TOKIO'], syd: [-33.9, 151.2, 'SÍDNEY'], rio: [-22.9, -43.2, 'RÍO'], nai: [-1.3, 36.8, 'NAIROBI'], mum: [19.1, 72.9, 'BOMBAY'], sf: [37.8, -122.4, 'SAN FRANCISCO'] };
 const faceTo = (V, p) => Math.atan2(V.cy - p.y, V.cx - p.x);
 // marcador de estación terrena: solo si está en la cara visible
 const pin = (ctx, V, c, o = {}) => { const p = V.pt(c[0], c[1], 1); if (p.z < 0.08) return null; const a = (o.a ?? 1) * cl((p.z - 0.08) / 0.15); ctx.save(); ctx.globalAlpha *= a; P.glow(ctx, p.x, p.y, 26, o.rgb || '255,212,71', 0.7); ctx.fillStyle = o.col || C.oro; ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, TAU); ctx.fill(); ctx.strokeStyle = '#1b1b1b'; ctx.lineWidth = 2; ctx.stroke(); if (o.label) { const dx = o.dx ?? 18, al = dx < 0 ? 'right' : 'left'; ctx.font = '900 34px Nunito'; ctx.textAlign = al; ctx.textBaseline = 'middle'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.strokeText(c[2], p.x + dx, p.y + (o.dy ?? -26)); ctx.fillStyle = C.blanco; ctx.fillText(c[2], p.x + dx, p.y + (o.dy ?? -26)); } ctx.restore(); return p; };
 // inclined orbit (Sputnik): puntos en el marco ecuatorial inercial de la vista
 const incPt = (V, k, inc, th) => V.fromVec(k * Math.cos(th), k * Math.sin(th) * Math.sin(inc), k * Math.sin(th) * Math.cos(inc));
 const incRing = (ctx, V, k, inc, part, col) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); let st = false; for (let i = 0; i <= 200; i++) { const p = incPt(V, k, inc, (i / 200) * TAU), keep = part === 'front' ? p.z >= 0 : p.z < 0 && !V.hidden(p); if (!keep) { st = false; continue; } if (!st) { ctx.moveTo(p.x, p.y); st = true; } else ctx.lineTo(p.x, p.y); } ctx.stroke(); ctx.restore(); };
 // escena orbital completa: anillo (detrás) → satélites ocultos → Tierra → ecuador/huellas/estaciones → anillo (delante) → satélites
 // o: { cx, cy, r, rot, tilt, k, ring 0..1, glow, equator, fp: [{lon, col, a}], sats: [{lon, s, kind, a, trail}], under(ctx,V), over(ctx,V,S) }
 const orbScene = (ctx, t, o) => { const V = P.orbView(o.cx ?? 540, o.cy ?? 860, o.r, o.rot, o.tilt ?? 0.35), k = o.k ?? KS, ring = o.ring ?? 1;
  const S = (o.sats || []).map((s) => ({ ...s, p: V.pt(0, s.lon, k) }));
  if (ring > 0) P.orbRing(ctx, V, k, { part: 'back', col: `rgba(111,202,222,${0.45 * ring})`, lw: 2.5 });
  const drawSat = (s) => { const a = s.a ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; if (s.trail) { ctx.lineCap = 'round'; for (let i = 0; i < 24; i++) { const q0 = V.pt(0, s.lon - (i + 1) * s.trail / 24, k), q1 = V.pt(0, s.lon - i * s.trail / 24, k); if (V.hidden(q0) || V.hidden(q1)) continue; ctx.strokeStyle = `rgba(255,212,71,${0.75 * (1 - i / 24)})`; ctx.lineWidth = 6 * (1 - i / 24) + 1; ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.lineTo(q1.x, q1.y); ctx.stroke(); } } const sc = (s.s ?? 0.4) * (1 + 0.1 * s.p.z / k); P.glow(ctx, s.p.x, s.p.y, 60 * sc + 20, s.rgb || '255,230,170', 0.45); if (s.kind === 'st45') P.station1945(ctx, s.p.x, s.p.y, sc, t, { face: faceTo(V, s.p) }); else P.satGEO3(ctx, s.p.x, s.p.y, sc * 0.78, t, { face: faceTo(V, s.p), yaw: cl(0.3 + 0.6 * (s.p.x - V.cx) / (k * V.r), -0.8, 0.8), rx: s.rx, tx: s.tx }); ctx.restore(); };
  S.filter((s) => s.p.z < 0).forEach(drawSat);
  P.earthHQ(ctx, V.cx, V.cy, V.r, t, { rot: o.rot, tilt: V.tilt, light: o.light || [-0.5, 0.35, 0.8], clip: [0, 0, W, HH] });
  if (o.equator) P.orbLat(ctx, V, 0, { dash: [12, 9], col: `rgba(255,212,71,${0.85 * o.equator})` });
  (o.fp || []).forEach((f) => { if ((f.a ?? 0.4) > 0.005) P.orbFootprint(ctx, V, f.lon, { col: f.col, a: f.a, shrink: FP }); });
  if (o.under) o.under(ctx, V, S);
  if (ring > 0) P.orbRing(ctx, V, k, { part: 'front', col: `rgba(111,202,222,${0.85 * ring})`, glow: o.glow ?? 8 });
  S.filter((s) => s.p.z >= 0).forEach(drawSat);
  if (o.over) o.over(ctx, V, S);
  return { V, S }; };
 // enlace estación ↔ satélite solo si hay visibilidad real (nunca a través de la Tierra)
 const link = (ctx, V, c, s, t, u, o = {}) => { if (u <= 0 || !sees(c[0], c[1], s.lon)) return; const p = V.pt(c[0], c[1], 1); if (p.z < 0.05) return; const A2 = o.down ? [s.p.x, s.p.y] : [p.x, p.y], B2 = o.down ? [p.x, p.y] : [s.p.x, s.p.y]; P.orbBeam(ctx, A2, B2, t, { u, col: o.col || (o.down ? '255,212,71' : '84,216,240'), w: o.w || 22 }); };
 // reloj de tiempo acelerado (arriba a la derecha)
 const clock = (ctx, x, y, hours, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(10,18,30,0.8)'; ctx.beginPath(); ctx.roundRect(x - 150, y - 70, 300, 200, 22); ctx.fill(); ctx.strokeStyle = 'rgba(245,247,250,0.85)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x - 70, y + 30, 46, 0, TAU); ctx.stroke(); const ah = (hours / 12) * TAU - Math.PI / 2, am = ((hours % 1) * TAU) - Math.PI / 2; ctx.lineCap = 'round'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 70, y + 30); ctx.lineTo(x - 70 + Math.cos(ah) * 26, y + 30 + Math.sin(ah) * 26); ctx.stroke(); ctx.strokeStyle = C.oro; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 70, y + 30); ctx.lineTo(x - 70 + Math.cos(am) * 38, y + 30 + Math.sin(am) * 38); ctx.stroke(); txt(ctx, '+' + Math.floor(hours) + ' h', x + 60, y + 30, 46, C.blanco, { w: 900 }); txt(ctx, 'TIEMPO ACELERADO', x, y - 36, 32, C.oro, { w: 900 }); ctx.restore(); };
 // rótulo «tarjeta» con aspa o visto (escena 18)
 const card = (ctx, x, y, w, s, sub, ok, a, e) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - e) * 80, 0); ctx.fillStyle = 'rgba(12,20,34,0.88)'; const h = sub ? 150 : 100; ctx.beginPath(); ctx.roundRect(x, y - h / 2, w, h, 22); ctx.fill(); ctx.strokeStyle = ok ? 'rgba(120,220,140,0.85)' : 'rgba(255,122,107,0.85)'; ctx.lineWidth = 3; ctx.stroke(); const cx = x + 56, cy = y - (sub ? 20 : 0); ctx.strokeStyle = ok ? '#78DC8C' : C.coral; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); if (ok) { ctx.moveTo(cx - 20, cy); ctx.lineTo(cx - 5, cy + 16); ctx.lineTo(cx + 22, cy - 18); } else { ctx.moveTo(cx - 18, cy - 18); ctx.lineTo(cx + 18, cy + 18); ctx.moveTo(cx + 18, cy - 18); ctx.lineTo(cx - 18, cy + 18); } ctx.stroke(); txt(ctx, s, x + 106, cy, 40, C.blanco, { w: 900, al: 'left' }); if (sub) txt(ctx, sub, x + 106, y + 40, 32, 'rgba(245,247,250,0.8)', { w: 700, al: 'left' }); ctx.restore(); };

 const B = [];
 // 1 · GANCHO — Tierra grande; una antena de Lisboa se activa, la señal sube al satélite, este la reenvía a Río de Janeiro y la cámara se
 // aleja hasta revelar la órbita. Después, la idea de 1945: señales de televisión desde el espacio.
 const CL1 = { lis: [38.7, -9.1, 'LISBOA'], rio: [-22.9, -43.2, 'RÍO DE JANEIRO'] };
 B.push({ t0: 0, t1: B0.b2, in: { type: 'cut' }, draw(ctx, t) {
  space(ctx); const z = E.inOut(win(t, 3.5, 6.4)), r = lerp(440, 250, z) * (1 + 0.035 * (1 - win(t, 0, 3.5))), cy = lerp(980, 860, z), k = lerp(1.5, KS, z), rot = 1.6 - 22 * RAD - t * 0.02, up = sm(0.9, 2.1, t), dn = sm(2.3, 3.5, t);
  orbScene(ctx, t, { cy, r, rot, tilt: 0.3, k, ring: sm(3.8, 5.2, t), sats: [{ lon: -30, s: lerp(0.75, 0.45, z), trail: 18 * z, rx: up * (1 - dn), tx: dn }], fp: [{ lon: -30, a: 0.15 * sm(5.0, 6.0, t), col: '84,216,240' }],
   under(ctx, V) { const p = pin(ctx, V, CL1.lis, { label: t > 0.6 ? 1 : 0, a: sm(0.4, 0.8, t) }); if (p && t > 0.5 && t < 2.2) { const q = (t * 2.5) % 1; P.glow(ctx, p.x, p.y, 30 + 60 * q, '84,216,240', 0.8 * (1 - q)); } pin(ctx, V, CL1.rio, { label: t > 2.9 ? 1 : 0, dx: -18, dy: -28, a: sm(2.7, 3.1, t) }); },
   over(ctx, V, S) { link(ctx, V, CL1.lis, S[0], t, up); link(ctx, V, CL1.rio, S[0], t, dn, { down: true }); } });
  const ia = sm(T.television - 0.3, T.television + 0.3, t); if (ia > 0) { ctx.save(); ctx.globalAlpha *= ia; const x0 = 70, y0 = 960, w0 = 400, h0 = 420; ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.roundRect(x0 + 8, y0 + 10, w0, h0, 26); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.roundRect(x0, y0, w0, h0, 26); ctx.clip(); ctx.fillStyle = '#6b5a45'; ctx.fillRect(x0, y0, w0, h0); ctx.fillStyle = 'rgba(40,28,18,0.25)'; for (let i = 0; i < 12; i++) ctx.fillRect(x0 + i * 34, y0, 3, h0 * 0.7); ctx.fillStyle = '#4a3324'; ctx.fillRect(x0, y0 + h0 * 0.72, w0, h0 * 0.28); ctx.fillStyle = '#3a271a'; ctx.fillRect(x0 + 60, y0 + h0 * 0.62, 280, 22); ctx.fillRect(x0 + 74, y0 + h0 * 0.62 + 22, 16, 70); ctx.fillRect(x0 + 310, y0 + h0 * 0.62 + 22, 16, 70); P.tv1950(ctx, x0 + 200, y0 + h0 * 0.62, 0.95, t, { on: sm(T.television + 0.2, T.television + 0.7, t) }); ctx.restore(); ctx.strokeStyle = 'rgba(245,247,250,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x0, y0, w0, h0, 26); ctx.stroke(); ctx.restore(); }
  title(ctx, '¡LO IMAGINÓ EN 1945!', t, 0.15, 5.4, { px: 64 });
  lab(ctx, '12 AÑOS ANTES DEL PRIMER SATÉLITE', null, 540, 350, t, T.doce - 0.1, T.imagino - 0.1);
  lab(ctx, 'SEÑALES DE TELEVISIÓN DESDE EL ESPACIO', null, 540, 1320, t, T.television - 0.2, B0.b2, { col: C.oro });
 }, sfx(k) { FX.espacio(k, 0, B0.b2, 0.8); FX.encender(k, 0.5, 0.5); FX.enlaceSube(k, 0.9, 0.9); FX.enlaceBaja(k, 2.3, 0.9); FX.orbitaPulso(k, 3.6, 2.2, 0.5); FX.etiqueta(k, T.doce - 0.1); FX.encender(k, T.television + 0.2, 0.7); FX.etiqueta(k, T.television - 0.2); } });

 // 2 · 1945: despacho; Arthur C. Clarke, de pie junto a la mesa, revisa y anota un documento + FOTO real (1965, rotulada con su fecha)
 const officeShot = (ctx, t, cam) => { P.office1945(ctx, cam, t); const pen = cam.pr([0.27 + 0.03 * Math.sin(t * 7), 0.8, 0.02 + 0.015 * Math.sin(t * 11)]), hold = cam.pr([0.1, 0.8, -0.02]); const ft = cam.pr([-0.12, 0, 0.5]); if (ft[2] > 0.3) { ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(ft[0] + 10, ft[1], 160 / ft[2] * 2.2, 26 / ft[2] * 2.2, 0, 0, TAU); ctx.fill(); } bill(ctx, cam, [-0.12, 0, 0.5], 1.78, (X, Y, h) => P.figure1945(ctx, X, Y, h, t, { dir: 1, reach: [pen[0], pen[1]], reachL: [hold[0], hold[1]], glasses: 1 })); };
 B.push({ t0: B0.b2, t1: B0.b3, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const u = E.inOut(win(t, B0.b2, B0.b3)), cam = P.cam3([lerp(1.9, 1.45, u), lerp(1.6, 1.5, u), lerp(2.6, 2.0, u)], [lerp(0.0, 0.1, u), 0.95, -0.1], 1000);
  officeShot(ctx, t, cam); sepiaWarm(ctx, 0.22); vign(ctx, 0.45);
  txt(ctx, 'INGLATERRA · 1945', 540, 210, 50, C.blanco, { w: 900, sh: 1 });
  P.floatPhoto(ctx, IMG.clarke, 690, 560, 560, t, T.clarke - 0.75, B0.b3 + 0.25, { tag: 'FOTOGRAFÍA DE 1965', label: 'ARTHUR C. CLARKE', sub: 'escritor y divulgador británico', credit: 'ITU Pictures · CC BY 2.0', from: 1, rotY: -0.08 });
  recon(ctx, 'RECREACIÓN ANIMADA', t, B0.b2 + 0.3, T.clarke - 0.8);
 }, sfx(k) { FX.oficina(k, B0.b2, B0.b3 - B0.b2, 0.5); FX.escribir(k, B0.b2 + 0.3, 1.6, 0.5); FX.revelar(k, T.clarke - 0.75); } });
 // 3 · «parecía ciencia ficción»: el boceto (Tierra, órbita, 3 estaciones a 120°) se dibuja sobre el papel, en la mesa
 B.push({ t0: B0.b3, t1: B0.b4, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, W, HH); g.addColorStop(0, '#5b4231'); g.addColorStop(1, '#3a281c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = 'rgba(30,18,10,0.25)'; ctx.lineWidth = 2; for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.moveTo(0, i * 80 + 20); ctx.bezierCurveTo(300, i * 80 + 40, 700, i * 80, 1080, i * 80 + 30); ctx.stroke(); }
  const z = 1 + 0.06 * win(t, B0.b3, B0.b4); ctx.save(); ctx.globalAlpha *= sm(B0.b3 + 0.3, B0.b3 + 0.65, t); ctx.translate(540, 820); ctx.scale(z, z); ctx.rotate(-0.03); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-405 + 14, -470 + 16, 810, 940); P.paperSketch(ctx, 0, 0, 270, t, { u: E.inOut(win(t, B0.b3 + 0.2, T.ficcion + 0.3)) });
  // pluma apoyada en el papel siguiendo el trazo
  const pu = win(t, B0.b3 + 0.2, T.ficcion + 0.3); if (pu < 1) { const ang = -Math.PI / 2 + TAU * (pu * 3 % 1), rr = pu < 0.25 ? 0.42 : 1.15, px = Math.cos(ang) * 270 * rr, py = Math.sin(ang) * 270 * rr; ctx.save(); ctx.translate(px, py); ctx.rotate(-0.7); ctx.fillStyle = '#1d1d22'; ctx.beginPath(); ctx.roundRect(-8, -230, 16, 210, 6); ctx.fill(); ctx.fillStyle = '#c9a54a'; ctx.fillRect(-8, -60, 16, 10); ctx.fillStyle = '#2b2b2b'; ctx.beginPath(); ctx.moveTo(-6, -20); ctx.lineTo(6, -20); ctx.lineTo(0, 0); ctx.fill(); ctx.restore(); }
  ctx.restore(); const oa = 1 - sm(B0.b3 + 0.3, B0.b3 + 0.65, t); if (oa > 0) { ctx.save(); ctx.globalAlpha *= oa; const v = E.in(win(t, B0.b3, B0.b3 + 0.65)), cam = P.cam3([lerp(1.45, 0.42, v), lerp(1.5, 1.2, v), lerp(2.0, 0.55, v)], [lerp(0.1, 0.3, v), lerp(0.95, 0.79, v), lerp(-0.1, 0.05, v)], 1000); officeShot(ctx, t, cam); sepiaWarm(ctx, 0.22); ctx.restore(); } vign(ctx, 0.5);
  title(ctx, '¿CIENCIA FICCIÓN?', t, T.ficcion - 0.6, B0.b4 + 0.2, { px: 64 }); recon(ctx, 'BOCETO ILUSTRATIVO (RECREACIÓN)', t, B0.b3 + 0.2, B0.b4);
 }, sfx(k) { FX.escribir(k, B0.b3 + 0.2, 2.0, 0.8); FX.paginas(k, B0.b3, 1, 0.5); } });

 // 4 · «estaciones repetidoras en órbita para conectar lugares muy alejados»: estación CONCEPTUAL de 1945 enlaza Londres y Ciudad del Cabo
 B.push({ t0: B0.b4, t1: B0.b5, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  space(ctx); const u = E.inOut(win(t, B0.b4, B0.b5)), rot = 1.6 + 12 * RAD - (t - B0.b4) * 0.02, st = { lon: 12, s: 0.95, kind: 'st45', a: sm(T.estaciones - 0.2, T.estaciones + 0.4, t) };
  orbScene(ctx, t, { cy: 840, r: lerp(250, 270, u), rot, tilt: 0.25, k: 2.15, ring: sm(T.orbita4 - 0.4, T.orbita4 + 0.3, t), sats: [st], under(ctx, V) { pin(ctx, V, CITY.lon, { label: 1, a: sm(T.repetidoras, T.repetidoras + 0.4, t) }); pin(ctx, V, CITY.cap, { label: 1, dx: 18, dy: 30, a: sm(T.orbita4 + 0.6, T.orbita4 + 1.0, t) }); },
   over(ctx, V, S) { link(ctx, V, CITY.lon, S[0], t, sm(T.repetidoras + 0.1, T.orbita4 + 0.4, t)); link(ctx, V, CITY.cap, S[0], t, sm(T.orbita4 + 0.8, T.tierra4 + 0.2, t), { down: true }); } });
  const ga = 1 - sm(B0.b4 + 0.25, B0.b4 + 1.0, t); if (ga > 0) { const e = E.inOut(win(t, B0.b4, B0.b4 + 0.8)), rr = lerp(270 * 0.42 * 1.06, 250, e), kk = lerp(1.15 / 0.42, 2.15, e), ry = lerp(1, Math.sin(0.25), e); ctx.save(); ctx.globalAlpha *= ga; ctx.strokeStyle = C.oro; ctx.shadowColor = 'rgba(255,212,71,0.9)'; ctx.shadowBlur = 14; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(540, 840, rr, 0, TAU); ctx.stroke(); ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.ellipse(540, 840, rr * kk, rr * kk * ry, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]); for (const a of [-90, 30, 150]) { const x = 540 + Math.cos(a * RAD) * rr * kk, y = 840 + Math.sin(a * RAD) * rr * kk * ry; P.glow(ctx, x, y, 40, '255,212,71', 0.9); } ctx.restore(); }
  title(ctx, 'ESTACIONES REPETIDORAS EN ÓRBITA', t, T.estaciones - 0.2, B0.b5, { px: 48 });
  lab(ctx, 'ESTACIÓN CONCEPTUAL DE 1945', null, 540, 430, t, T.estaciones + 0.2, T.orbita4 + 1.5, { sub: 'ilustración, no un diseño de Clarke' });
  lab(ctx, 'LUGARES MUY ALEJADOS · ≈ 9.700 KM', null, 540, 1310, t, T.tierra4 - 0.9, B0.b5, { col: C.oro, px: 36 }); schem(ctx, t, B0.b4 + 0.5, B0.b5);
 }, sfx(k) { FX.espacio(k, B0.b4, B0.b5 - B0.b4, 0.7); FX.aparece(k, T.estaciones); FX.enlaceSube(k, T.repetidoras + 0.1, 0.9); FX.enlaceBaja(k, T.orbita4 + 0.8, 0.9); FX.etiqueta(k, T.tierra4 - 0.9); } });

 // 5 · «Pero… ¿cómo lograr que una antena apunte siempre al mismo satélite?»: un satélite de órbita baja cruza el cielo y se pierde
 const leo = (t) => { const u = win(t, T.antena6 - 0.6, T.satelite6 + 0.6), th = Math.PI * (1 - u) + 0.05 * (u - 0.5); return { x: 540 + 600 * Math.cos(th), y: 1150 - 820 * Math.sin(th), up: Math.sin(th) > 0.05 && u < 1 }; };
 B.push({ t0: B0.b5, t1: B0.b7, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const s = leo(t), dxp = 1080 * 0.34, dyp = 1500 * 0.78 + 4 - 88 * (1500 / 520), el = s.up ? Math.atan2(dyp - s.y, s.x - dxp) : (t > T.satelite6 ? 0.12 : 2.9);
  const G = P.groundStation(ctx, 0, 0, 1080, 1500, t, { day: 0.9, sun: [900, 260], el, tx: s.up ? 1 : 0 }); ctx.fillStyle = '#26382d'; ctx.fillRect(0, 1500, W, HH - 1500);
  if (s.up) { P.satLEO(ctx, s.x, s.y, 1.6, t); P.orbBeam(ctx, G.dish.feed, [s.x, s.y], t, { u: 1, w: 18 }); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.setLineDash([6, 10]); ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const q = leo(T.antena6 - 0.6 + (i / 40) * (t - T.antena6 + 0.6)); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); } ctx.stroke(); ctx.restore(); }
  const lost = sm(T.satelite6 + 0.55, T.satelite6 + 0.8, t); if (lost > 0) lab(ctx, 'SE PIERDE LA SEÑAL', null, 540, 860, t, T.satelite6 + 0.55, B0.b7, { col: C.coral, px: 44 });
  title(ctx, 'PERO…', t, B0.b5 + 0.1, T.s6 + 0.1, { px: 70 }); title(ctx, '¿CÓMO APUNTAR SIEMPRE AL MISMO SATÉLITE?', t, T.s6 + 0.1, B0.b7, { px: 40 });
  lab(ctx, 'EJEMPLO: SATÉLITE EN ÓRBITA BAJA', null, 540, 1320, t, T.antena6 - 0.2, T.satelite6 + 0.5, { px: 34, sub: 'cruza el cielo en minutos y la antena debe seguirlo' });
 }, sfx(k) { FX.viento(k, B0.b5, B0.b7 - B0.b5, 0.35); FX.motor(k, T.antena6 - 0.4, 3.0, 0.35); FX.pasada(k, T.antena6, 2.0, 0.5); FX.senal(k, T.satelite6 + 0.6, 0.6, 600); FX.tachado(k, T.satelite6 + 0.6); } });

 // 6 · «¡Aquí estaba el secreto!»: aparece una órbita especial sobre el ecuador
 B.push({ t0: B0.b7, t1: B0.b8, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  space(ctx); const rot = 0.9 - (t - B0.b7) * 0.05, rg = sm(B0.b7 + 0.1, T.secreto + 0.3, t);
  orbScene(ctx, t, { cy: 860, r: 235, rot, tilt: 0.33, k: KS, ring: rg, glow: 8 + 20 * Math.sin(Math.PI * win(t, T.secreto - 0.2, B0.b8)), equator: rg });
  title(ctx, '¡AQUÍ ESTABA EL SECRETO!', t, B0.b7 + 0.1, B0.b8, { px: 56 }); lab(ctx, 'UNA ÓRBITA MUY ESPECIAL', null, 540, 1320, t, T.secreto, B0.b8, { col: C.cian, px: 36 });
 }, sfx(k) { FX.orbitaPulso(k, B0.b7 + 0.1, 1.6, 1); FX.revelar(k, T.secreto); } });

 // 7 · A ESCALA REAL: órbita de radio 6,61 radios terrestres; cota de 35.786 km medida DESDE LA SUPERFICIE, sobre el ecuador
 B.push({ t0: B0.b8, t1: B0.b9, in: { type: 'cut' }, draw(ctx, t) {
  space(ctx); const m = E.inOut(win(t, B0.b8, B0.b8 + 1.6)), r = lerp(235, 74, m), k = lerp(KS, ORB.k, m), rot = 0.9 - (t - B0.b7) * 0.05, tilt = lerp(0.33, 0.2, m), lonR = (rot - 1.6) / RAD + 90;
  const { V } = orbScene(ctx, t, { cy: 860, r, rot, tilt, k, equator: sm(T.ecuador - 0.4, T.ecuador, t), sats: [{ lon: lonR, s: lerp(0.4, 0.2, m), a: sm(B0.b8 + 1.2, B0.b8 + 1.6, t) }] });
  const d = sm(T.treinta - 0.6, T.treinta, t); if (d > 0) { const a = V.pt(0, lonR, 1), b = V.pt(0, lonR, ORB.k), y = a.y - 70, xe = lerp(a.x, b.x, E.out(d)); ctx.save(); ctx.strokeStyle = C.oro; ctx.fillStyle = C.oro; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(a.x, a.y - 14); ctx.lineTo(a.x, y - 22); ctx.moveTo(a.x, y); ctx.lineTo(xe, y); ctx.stroke(); arrowHead(ctx, a.x + 4, y, Math.PI, 16, C.oro); if (d > 0.95) { ctx.beginPath(); ctx.moveTo(b.x, b.y - 30); ctx.lineTo(b.x, y - 22); ctx.stroke(); arrowHead(ctx, b.x - 4, y, 0, 16, C.oro); } ctx.restore(); txt(ctx, '≈ 36.000 KM', (a.x + b.x) / 2, y - 64, 60, C.blanco, { w: 900, sh: 1 }); txt(ctx, '35.786 km de altitud', (a.x + b.x) / 2, y + 36, 34, C.oro, { w: 800, sh: 1 }); }
  lab(ctx, 'A ESCALA REAL', null, 540, 430, t, B0.b8 + 1.6, B0.b9, { px: 40, sub: 'Tierra 6.378 km de radio · satélite ampliado' }); title(ctx, 'UNA ÓRBITA MUY ALTA', t, B0.b8 + 0.2, T.treinta - 0.4, { px: 54 });
  lab(ctx, 'SOBRE EL ECUADOR', null, 540, 1150, t, T.ecuador - 0.3, B0.b9, { col: C.oro, px: 40 });
 }, sfx(k) { FX.contraer(k, B0.b8, 1.4, 0.7); FX.escala(k, T.treinta - 0.6, 1.0); FX.etiqueta(k, T.ecuador - 0.3); } });

 // 8 · co-rotación (vista externa, tiempo acelerado): la Tierra gira y el satélite RECORRE su órbita sin despegarse de su punto del ecuador
 const R8 = (t) => 1.0 - 0.62 * Math.max(0, t - (B0.b9 + 0.9)), L8 = -8;
 B.push({ t0: B0.b9, t1: B0.b10, in: { type: 'cut' }, draw(ctx, t) {
  space(ctx); const m = E.inOut(win(t, B0.b9, B0.b9 + 1.0)), r = lerp(74, 222, m), k = lerp(ORB.k, KS, m), rot = R8(t), tl = E.inOut(win(t, B0.b9, B0.b9 + 1.0)), sat = { lon: L8, s: lerp(0.2, 0.42, m), trail: 40 * sm(B0.b9 + 1.0, B0.b9 + 1.8, t) };
  orbScene(ctx, t, { cy: 860, r, rot, tilt: lerp(0.2, 0.42, tl), k, equator: 1, sats: [sat], under(ctx, V) { const p = V.pt(0, L8, 1); if (p.z > 0) { P.glow(ctx, p.x, p.y, 30, '255,212,71', 0.9); ctx.fillStyle = C.oro; ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, TAU); ctx.fill(); } },
   over(ctx, V, S) { const p = V.pt(0, L8, 1), s = S[0].p; if (p.z > 0 && s.z > 0) { ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = 'rgba(255,212,71,0.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(s.x, s.y); ctx.stroke(); ctx.restore(); }
    // flechas de sentido: ecuador (Tierra) y órbita (satélite), ambas de oeste a este
    const ga = sm(T.gira - 0.3, T.gira + 0.2, t); if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; for (const [kk, col] of [[1.0, C.oro], [k * 1.0, C.cian]]) { const q0 = V.pt(0, (V.rot - 1.6) / RAD - 25, kk), q1 = V.pt(0, (V.rot - 1.6) / RAD + 20, kk); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); for (let i = 0; i <= 20; i++) { const q = V.pt(0, (V.rot - 1.6) / RAD - 25 + i * 2.25, kk); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); } ctx.stroke(); const qa = V.pt(0, (V.rot - 1.6) / RAD + 18, kk); arrowHead(ctx, q1.x, q1.y, Math.atan2(q1.y - qa.y, q1.x - qa.x), 18, col); } ctx.restore(); } } });
  clock(ctx, 880, 500, Math.max(0, (1.0 - rot) / TAU * 24), sm(B0.b9 + 1.0, B0.b9 + 1.4, t));
  lab(ctx, 'MISMO SENTIDO DE GIRO', null, 540, 1240, t, T.gira - 0.2, T.vuelta - 0.4, { col: C.cian, px: 38, sub: 'de oeste a este, como la Tierra' }); lab(ctx, 'UNA VUELTA ≈ 24 H', null, 540, 1240, t, T.vuelta - 0.3, B0.b10, { col: C.oro, px: 40, sub: 'exactamente un día sidéreo: 23 h 56 min' });
  lab(ctx, 'SU PUNTO DEL ECUADOR', null, 60, 1240, t, B0.b9 + 1.6, T.gira - 0.3, { al: 'left', sub: 'siempre debajo del satélite' }); schem(ctx, t, B0.b9 + 1.0, B0.b10);
 }, sfx(k) { FX.expansion(k, B0.b9, 0.9); FX.tiempo(k, B0.b9 + 0.9, 2.5, 0.6); FX.reloj(k, B0.b9 + 1.2, 10, 0.32, 0.4); FX.etiqueta(k, T.gira - 0.2); FX.etiqueta(k, T.vuelta - 0.3); } });

 // 9 · DOS PERSPECTIVAS A LA VEZ (tiempo acelerado: pasa un día). La cámara entra desde el espacio siguiendo la línea satélite → antena
 // hasta el suelo; allí el Sol cruza, cae la noche y el satélite sigue en el MISMO punto del cielo. En el círculo, la vista espacial
 // simultánea: la Tierra gira, el satélite recorre su órbita sobre la misma longitud, y la estación pasa del lado diurno al nocturno.
 const SKY = [800, 720], STN9 = [10, -62, ''], LS9 = -60, ROT9 = (ph) => 2.647 - ph * TAU;
 const mini9 = (ctx, t, cx, cy, r, ph) => orbScene(ctx, t, { cx, cy, r, rot: ROT9(ph), tilt: 0.35, k: KS, equator: 0.5, sats: [{ lon: LS9, s: r / 260 }], under(ctx, V) { pin(ctx, V, STN9, {}); }, over(ctx, V, S) { const p = V.pt(STN9[0], STN9[1], 1), q = S[0].p; if (p.z > 0.05 && sees(STN9[0], STN9[1], LS9)) { ctx.save(); ctx.setLineDash([8, 8]); ctx.strokeStyle = 'rgba(255,212,71,0.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.restore(); } } });
 B.push({ t0: B0.b10, t1: B0.b11, in: { type: 'cut' }, draw(ctx, t) {
  const ph = win(t, B0.b10 + 0.15, B0.b11 - 0.05), sa = Math.PI * (0.15 + ph * 1.7), day = cl(0.5 + 0.9 * Math.sin(sa)), sun = [540 - 620 * Math.cos(sa), 1170 - 900 * Math.sin(sa)];
  const dxp = 1080 * 0.34, dyp = 1500 * 0.78 + 4 - 88 * (1500 / 520), el = Math.atan2(dyp - SKY[1], SKY[0] - dxp);
  const G = P.groundStation(ctx, 0, 0, 1080, 1500, t, { day, sun: Math.sin(sa) > -0.1 ? sun : null, el, tx: 1 }); ctx.fillStyle = H.rgba(H.mix('#101a14', '#26382d', day)); ctx.fillRect(0, 1500, W, HH - 1500);
  ctx.save(); ctx.setLineDash([10, 10]); ctx.strokeStyle = 'rgba(255,212,71,0.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(G.dish.feed[0], G.dish.feed[1]); ctx.lineTo(SKY[0], SKY[1]); ctx.stroke(); ctx.restore(); P.glow(ctx, SKY[0], SKY[1], 50, '255,230,170', 0.8); P.satGEO3(ctx, SKY[0], SKY[1], 0.22, t, { face: Math.atan2(dyp - SKY[1], dxp - SKY[0]), yaw: 0.2 });
  clock(ctx, 850, 330, ph * 24, sm(B0.b10 + 0.6, B0.b10 + 0.9, t));
  const pa = sm(B0.b10 + 0.55, B0.b10 + 0.85, t); if (pa > 0) { const cx = 250, cy = 420, Rr = 185; ctx.save(); ctx.globalAlpha *= pa; ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, TAU); ctx.fillStyle = '#030810'; ctx.fill(); ctx.save(); ctx.clip(); stars(ctx, 60, 12); mini9(ctx, t, cx, cy, 72, ph); ctx.restore(); ctx.strokeStyle = 'rgba(245,247,250,0.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, TAU); ctx.stroke(); txt(ctx, 'VISTA DESDE EL ESPACIO', cx, cy + Rr + 36, 32, C.blanco, { w: 900, sh: 1 }); ctx.restore(); }
  // entrada: desde el espacio, zoom hacia la estación siguiendo la línea del satélite
  const za = 1 - sm(B0.b10 + 0.3, B0.b10 + 0.6, t); if (za > 0) { ctx.save(); ctx.globalAlpha *= za; space(ctx); const zz = E.in(win(t, B0.b10, B0.b10 + 0.6)), V0 = P.orbView(540, 860, 235, ROT9(0), 0.35), sp = V0.pt(STN9[0], STN9[1], 1); ctx.translate(sp.x, sp.y); ctx.scale(1 + zz * 6, 1 + zz * 6); ctx.translate(-sp.x, -sp.y); mini9(ctx, t, 540, 860, 235, 0); ctx.restore(); }
  lab(ctx, 'PARECE QUIETO EN EL CIELO', null, 540, 1320, t, T.quieto - 0.3, B0.b11, { col: C.oro, px: 42, sub: 'de día y de noche: la antena no se mueve' });
 }, sfx(k) { FX.pasada(k, B0.b10, 0.7, 0.5); FX.tiempo(k, B0.b10 + 0.4, 1.8, 0.5); FX.campo(k, B0.b10 + 0.5, 1.4, 0.3); FX.correcto(k, T.quieto); } });

 // 10 · «Por eso se llama órbita geoestacionaria»: PRIMER PLANO del satélite (modelo ilustrativo) sobre el limbo terrestre
 B.push({ t0: B0.b11, t1: B0.b12, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  space(ctx); const u = win(t, B0.b11, B0.b12), rot = 0.9 - (t - B0.b11) * 0.05; P.earthHQ(ctx, 540, 2480, 1260, t, { rot, tilt: 0.3, light: [-0.6, 0.5, 0.6], clip: [0, 0, W, HH] });
  ctx.save(); ctx.strokeStyle = 'rgba(111,202,222,0.7)'; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(111,202,222,0.9)'; ctx.shadowBlur = 10 + 14 * sm(T.geo - 0.5, T.geo, t) * (0.5 + 0.5 * Math.sin((t - B0.b11) * 5)); ctx.beginPath(); ctx.ellipse(540, 960, 1500, 300, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke(); ctx.restore();
  const sx = lerp(470, 610, u), sy = 960 - 300 * Math.sqrt(Math.max(0, 1 - ((sx - 540) / 1500) ** 2)); P.glow(ctx, sx, sy, 300, '255,230,170', 0.12); P.satGEO3(ctx, sx, sy, 1.45, t, { face: Math.atan2(2480 - sy, 540 - sx), yaw: 0.28 + 0.12 * u, sun: -2.5 });
  title(ctx, 'ÓRBITA GEOESTACIONARIA', t, T.geo - 0.5, B0.b12, { px: 58 }); lab(ctx, '«GEO» = TIERRA · «ESTACIONARIA» = QUIETA', null, 540, 1110, t, T.geo + 0.2, B0.b12, { sub: 'quieta respecto al suelo, no en el espacio' }); recon(ctx, 'MODELO ILUSTRATIVO', t, B0.b11 + 0.2, T.geo);
 }, sfx(k) { FX.orbitaPulso(k, T.geo - 0.5, 2.0, 0.9); FX.campana(k, T.geo); FX.espacio(k, B0.b11, B0.b12 - B0.b11, 0.6); } });

 // 11 · «no era que estuviera inmóvil: viajaba a gran velocidad» — vector velocidad tangente a la órbita
 B.push({ t0: B0.b12, t1: B0.b14, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  space(ctx); const rot = 0.9 - (t - B0.b12) * 0.32, LS = -20, sat = { lon: LS, s: 0.5, trail: 55 };
  orbScene(ctx, t, { cy: 880, r: 205, rot, tilt: 0.14, k: KS, equator: 0.5, sats: [sat], over(ctx, V, S) { const p = S[0].p, q = V.pt(0, LS + 6, KS), ang = Math.atan2(q.y - p.y, q.x - p.x), va = sm(T.velocidad - 0.5, T.velocidad, t); if (va > 0 && p.z > 0) { const L = 230 * E.out(va), x2 = p.x + Math.cos(ang) * L, y2 = p.y + Math.sin(ang) * L; ctx.save(); ctx.strokeStyle = C.oro; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(x2, y2); ctx.stroke(); arrowHead(ctx, x2, y2, ang, 26, C.oro); ctx.restore(); } } });
  title(ctx, '¡NO ESTABA INMÓVIL!', t, B0.b12 + 0.1, T.velocidad - 0.4, { px: 62 }); title(ctx, 'VIAJA MUY RÁPIDO', t, T.velocidad - 0.4, B0.b14, { px: 62 });
  lab(ctx, '≈ 3,07 KM/S', null, 540, 1290, t, T.velocidad - 0.2, B0.b14, { col: C.oro, px: 52, sub: '≈ 11.000 km/h, sin parar' }); schem(ctx, t, B0.b12, B0.b14);
 }, sfx(k) { FX.espacio(k, B0.b12, B0.b14 - B0.b12, 0.6); FX.pasada(k, T.velocidad - 0.6, 1.6, 0.8); FX.flecha(k, T.velocidad - 0.4); } });

 // 12 · «pero acompañaba la rotación terrestre»: vista desde el norte; el ecuador y el satélite barren el MISMO ángulo
 B.push({ t0: B0.b14, t1: B0.b15, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  space(ctx); const r0 = 1.4, rot = r0 - (t - B0.b14) * 0.5, LS = 40, swept = (r0 - rot) / RAD;
  orbScene(ctx, t, { cy: 840, r: 210, rot, tilt: 1.15, k: KS, equator: 1, sats: [{ lon: LS, s: 0.42 }], over(ctx, V, S) {
   const wedge = (kk, col, w) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const q = V.pt(0, LS - swept + (i / 30) * swept, kk); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); } ctx.stroke(); ctx.setLineDash([8, 8]); ctx.lineWidth = 2.5; for (const lon of [LS - swept, LS]) { const q = V.pt(0, lon, kk); ctx.beginPath(); ctx.moveTo(V.cx, V.cy - 0); ctx.lineTo(q.x, q.y); ctx.stroke(); } ctx.restore(); };
   const wa = sm(B0.b14 + 0.3, B0.b14 + 0.6, t); if (wa > 0) { ctx.save(); ctx.globalAlpha *= wa; wedge(KS, 'rgba(84,216,240,0.9)', 7); wedge(1, 'rgba(255,212,71,0.95)', 7); ctx.restore(); }
   const p = V.pt(0, LS, 1); P.glow(ctx, p.x, p.y, 26, '255,212,71', 0.9); ctx.fillStyle = C.oro; ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, TAU); ctx.fill(); } });
  title(ctx, 'ACOMPAÑA LA ROTACIÓN', t, B0.b14 + 0.1, B0.b15, { px: 58 });
  lab(ctx, 'MISMO ÁNGULO EN EL MISMO TIEMPO', null, 540, 1250, t, T.rotacion - 0.6, B0.b15, { col: C.cian, px: 38, sub: 'ecuador ≈ 0,46 km/s · satélite ≈ 3,07 km/s' }); schem(ctx, t, B0.b14, B0.b15);
 }, sfx(k) { FX.tiempo(k, B0.b14, 1.8, 0.5); FX.etiqueta(k, T.rotacion - 0.6); } });

 // 13 · ENLACE ASCENDENTE en continuidad: estación de Londres en primer plano → la cámara sube con el haz → el satélite lo capta con
 // su antena receptora (resaltada). 14 · corte esquemático del repetidor → enlace descendente hasta Nueva York (otra zona de cobertura),
 // donde una segunda antena recibe la señal (vídeo/voz). Satélite fijo en lon −30: ambas ciudades lo ven (comprobaciones.js).
 const ROT13 = 1.6 - 35 * RAD, SAT13 = { lon: -30, s: 0.5 }, SKY13 = [870, 480];
 const scene13 = (ctx, t, upU, downU, fpA) => { space(ctx); const rot = ROT13 - (t - B0.b15) * 0.012; return orbScene(ctx, t, { cy: 600, r: 225, rot, tilt: 0.62, k: KS, sats: [{ ...SAT13, tx: downU }], fp: [{ lon: -30, a: fpA, col: '84,216,240' }], under(ctx, V) { pin(ctx, V, CITY.lon, { label: 1, dx: 16 }); pin(ctx, V, CITY.ny, { label: 1, dx: -16 }); }, over(ctx, V, S) { link(ctx, V, CITY.lon, S[0], t, upU); link(ctx, V, CITY.ny, S[0], t, downU, { down: true }); } }); };
 const satPt = (x, y, s, face, lx, ly) => { const a = face - Math.PI / 2; return [x + s * (lx * Math.cos(a) - ly * Math.sin(a)), y + s * (lx * Math.sin(a) + ly * Math.cos(a))]; };
 B.push({ t0: B0.b15, t1: B0.b16, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const sw = sm(T.senal + 0.25, T.senal + 0.6, t);
  if (sw < 1) { const pan = E.inOut(win(t, T.senal - 0.5, T.senal + 0.6)) * 650, dxp = 1080 * 0.34, dyp = 1500 * 0.78 + 4 - 88 * (1500 / 520), el = Math.atan2(dyp - SKY13[1], SKY13[0] - dxp); ctx.save(); ctx.translate(0, pan); const sg = ctx.createLinearGradient(0, -700, 0, 2); sg.addColorStop(0, '#081429'); sg.addColorStop(1, H.rgba(H.mix('#0b1424', '#5d9fd0', 0.85))); ctx.fillStyle = sg; ctx.fillRect(0, -700, W, 704);
   const G = P.groundStation(ctx, 0, 0, 1080, 1500, t, { day: 0.85, sun: [180, 330], el, tx: sm(B0.b15 + 0.4, B0.b15 + 0.8, t) }); ctx.fillStyle = '#26382d'; ctx.fillRect(0, 1500, W, HH);
   P.glow(ctx, SKY13[0], SKY13[1], 40, '255,230,170', 0.7); P.satGEO3(ctx, SKY13[0], SKY13[1], 0.2, t, { face: Math.atan2(dyp - SKY13[1], dxp - SKY13[0]) }); P.orbBeam(ctx, G.dish.feed, SKY13, t, { u: sm(B0.b15 + 0.6, T.senal + 0.2, t), w: 24 }); ctx.restore();
   lab(ctx, 'ESTACIÓN TERRENA · LONDRES', null, 540, 1320, t, B0.b15 + 0.3, T.senal - 0.2, { col: C.cian, sub: 'su antena envía la señal' }); }
  if (sw > 0) { ctx.save(); ctx.globalAlpha *= sw; space(ctx); P.earthHQ(ctx, 380, 2360, 1150, t, { rot: ROT13 - 0.25, tilt: 0.45, clip: [0, 0, W, HH] }); const sx = 640, sy = 640, face = Math.atan2(2360 - sy, 380 - sx), rxp = satPt(sx, sy, 1.3, face, -54, 62), rxOn = sm(T.satelite15 - 0.35, T.satelite15, t);
   P.orbBeam(ctx, [250, 1218], rxp, t, { u: sm(T.senal + 0.3, T.satelite15, t), w: 24 }); P.satGEO3(ctx, sx, sy, 1.3, t, { face, yaw: 0.3, rx: rxOn }); lab(ctx, 'ANTENA RECEPTORA', null, 330, 760, t, T.satelite15 - 0.1, B0.b16 + 0.2, { col: C.cian }); ctx.restore(); }
  title(ctx, 'ENLACE ASCENDENTE', t, B0.b15 + 0.2, B0.b16 + 0.3, { px: 58 });
 }, sfx(k) { FX.motor(k, B0.b15 + 0.2, 0.8, 0.25); FX.enlaceSube(k, B0.b15 + 0.6, 1); FX.pasada(k, T.senal - 0.4, 1.0, 0.4); FX.revelar(k, T.satelite15 - 0.3); } });
 const DN14 = T.retrans + 0.75;
 B.push({ t0: B0.b16, t1: B0.b17, in: { type: 'fade', d: 0.3 }, draw(ctx, t) {
  const ca = 1 - sm(DN14 - 0.2, DN14 + 0.15, t);
  if (ca < 1) { scene13(ctx, t, 0, sm(DN14, T.region + 0.25, t), 0.22 + 0.12 * sm(T.region, T.region + 0.4, t));
   const ra = sm(T.region - 0.15, T.region + 0.2, t); if (ra > 0) { ctx.save(); ctx.globalAlpha *= ra; const x0 = 140, y0 = 1000, w0 = 800, h0 = 300; ctx.beginPath(); ctx.roundRect(x0, y0, w0, h0, 24); ctx.save(); ctx.clip(); P.groundStation(ctx, x0, y0 - 80, w0, 400, t, { day: 0.8, el: 2.2, tx: 0, dishX: 0.3, dishS: 0.85 }); const mx = x0 + 600, my = y0 + 120; ctx.fillStyle = '#1b2026'; ctx.beginPath(); ctx.roundRect(mx - 70, my - 50, 140, 96, 10); ctx.fill(); ctx.fillStyle = 'rgba(84,216,240,0.85)'; ctx.fillRect(mx - 60, my - 40, 120, 76); ctx.fillStyle = '#F5F7FA'; ctx.beginPath(); ctx.moveTo(mx - 14, my - 22); ctx.lineTo(mx + 20, my - 2); ctx.lineTo(mx - 14, my + 18); ctx.closePath(); ctx.fill(); ctx.restore(); ctx.strokeStyle = 'rgba(245,247,250,0.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x0, y0, w0, h0, 24); ctx.stroke(); txt(ctx, 'NUEVA YORK RECIBE', x0 + w0 / 2, y0 + h0 + 36, 34, C.oro, { w: 900, sh: 1 }); ctx.restore(); } }
  if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; ctx.fillStyle = '#061322'; ctx.fillRect(0, 0, W, HH); const R2 = P.satCutaway(ctx, 40, 360, 1000, 1000, t, { u: win(t, B0.b16 + 0.15, T.retrans + 0.6) }); P.orbBeam(ctx, [R2.rx[0] - 90, R2.rx[1] + 190], [R2.rx[0], R2.rx[1] + 26], t, { u: 1, w: 18 }); P.orbBeam(ctx, [R2.tx[0], R2.tx[1] + 26], [R2.tx[0] + 90, R2.tx[1] + 190], t, { u: sm(T.retrans + 0.3, T.retrans + 0.75, t), col: '255,212,71', w: 18 }); ctx.restore(); }
  title(ctx, 'REPITE LA SEÑAL, NO LA CREA', t, B0.b16, DN14, { px: 50 }); title(ctx, 'ENLACE DESCENDENTE', t, DN14, T.region + 0.2, { px: 58 }); title(ctx, 'TIERRA → SATÉLITE → TIERRA', t, T.region + 0.2, B0.b17, { px: 54 });
  recon(ctx, 'CORTE ESQUEMÁTICO', t, B0.b16 + 0.2, DN14 - 0.2); schem(ctx, t, DN14 + 0.3, T.region + 0.1);
 }, sfx(k) { FX.revelar(k, B0.b16); FX.datos(k, B0.b16 + 0.3, 6, 0.4); FX.amplifica(k, T.retrans + 0.1, 0.7); FX.enlaceBaja(k, DN14, 1); FX.correcto(k, T.region + 0.2); } });

 // 15 · tres satélites a 120°: la vista se eleva sobre el norte, aparecen las tres coberturas; los polos quedan fuera
 const L3 = [-30, 90, -150], COL3 = ['84,216,240', '255,212,71', '255,122,107'];
 B.push({ t0: B0.b17, t1: B0.b18, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  space(ctx); const tl = E.inOut(win(t, T.tres + 1.0, B0.b18)), rot = 1.2 - (t - B0.b17) * 0.16, ap = [B0.b17 + 0.3, T.tres, T.tres + 0.6].map((x) => sm(x, x + 0.4, t)), fa = sm(T.cobertura - 1.4, T.cobertura - 0.4, t);
  orbScene(ctx, t, { cy: 800, r: 210, rot, tilt: lerp(0.22, 1.2, tl), k: KS, sats: L3.map((lon, i) => ({ lon, s: 0.45, a: ap[i] })), fp: L3.map((lon, i) => ({ lon, col: COL3[i], a: 0.15 * fa })), under(ctx, V) { const pa = sm(T.cobertura, T.cobertura + 0.5, t); if (pa > 0) { P.orbLat(ctx, V, 75, { col: `rgba(245,247,250,${0.9 * pa})`, lw: 3, dash: [8, 6] }); const np = V.pt(90, 0, 1); if (np.z > 0) { ctx.save(); ctx.globalAlpha *= pa; ctx.fillStyle = C.blanco; ctx.beginPath(); ctx.arc(np.x, np.y, 7, 0, TAU); ctx.fill(); ctx.restore(); } } }, over(ctx, V, S) {
   const aa = sm(T.tres + 0.9, T.tres + 1.4, t) * (1 - fa * 0.7); if (aa > 0) { ctx.save(); ctx.globalAlpha *= aa; ctx.setLineDash([8, 8]); ctx.strokeStyle = 'rgba(245,247,250,0.6)'; ctx.lineWidth = 2.5; S.forEach((s) => { ctx.beginPath(); ctx.moveTo(V.cx, V.cy); ctx.lineTo(s.p.x, s.p.y); ctx.stroke(); }); ctx.setLineDash([]); [30, 150, -90].forEach((lon) => { const q = V.pt(0, lon, KS * 0.62); if (q.z > -0.4) txt(ctx, '120°', q.x, q.y, 40, C.blanco, { w: 900, sh: 1 }); }); ctx.restore(); } } });
  title(ctx, '120° — 120° — 120°', t, T.tres - 0.3, T.cobertura - 0.5, { px: 60 }); title(ctx, 'COBERTURA CASI GLOBAL', t, T.cobertura - 0.5, B0.b18, { px: 58 });
  lab(ctx, 'LOS POLOS QUEDAN FUERA', null, 540, 1290, t, T.cobertura + 0.1, B0.b18, { px: 36, sub: 'por encima de ~75° de latitud (elevación mínima 5°)' }); schem(ctx, t, B0.b17 + 0.5, B0.b18);
 }, sfx(k) { FX.espacio(k, B0.b17, B0.b18 - B0.b17, 0.6); FX.aparece(k, B0.b17 + 0.3); FX.aparece(k, T.tres, 640); FX.aparece(k, T.tres + 0.6, 720); FX.expansion(k, T.cobertura - 1.4, 1.0); FX.etiqueta(k, T.cobertura + 0.1); } });

 // 16 · «¡Y lo escribió en 1945!»: recreación editorial (NO es la página original). La cámara se acerca al diagrama triangular, las tres
 // posiciones se iluminan y el esquema se transforma en tres satélites alrededor de la Tierra 3D (vista desde el norte, misma geometría).
 B.push({ t0: B0.b18, t1: B0.b19, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  const MW = 520, MH = MW * 1.36, mx = 540, e = E.out(win(t, B0.b18, B0.b18 + 0.8)), my = lerp(1000, 800, e), ix = 0, iy = MH * 0.24, zp = E.inOut(win(t, B0.b18 + 0.9, T.y1945 + 1.3)), Z = lerp(1, 2.3, zp), F = [mx + ix * zp, my + iy * zp], Ps = [540, lerp(800, 820, zp)], tr = sm(B0.b19 - 0.75, B0.b19 - 0.15, t);
  const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#3a2a20'); g.addColorStop(1, '#22181a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  ctx.save(); ctx.globalAlpha *= 1 - tr; ctx.translate(Ps[0], Ps[1]); ctx.scale(Z, Z); ctx.translate(-F[0], -F[1]); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2; for (let i = -6; i < 30; i++) { ctx.beginPath(); ctx.moveTo(-600, i * 85); ctx.bezierCurveTo(400, i * 85 + 30, 700, i * 85 - 20, 1700, i * 85 + 10); ctx.stroke(); }
   P.magazine1945(ctx, mx, my, MW, t, { rot: lerp(-0.12, 0, e) }); const la = sm(T.y1945 + 0.6, T.y1945 + 1.1, t); if (la > 0) for (const a of [-90, 30, 150]) { const R0 = MW * 0.2 * 1.15; P.glow(ctx, mx + Math.cos(a * RAD) * R0, my + iy + Math.sin(a * RAD) * R0, 26, '255,212,71', la); } ctx.restore();
  sepiaWarm(ctx, 0.15 * (1 - tr)); vign(ctx, 0.5);
  if (tr > 0) { ctx.save(); ctx.globalAlpha *= tr; space(ctx); orbScene(ctx, t, { cy: 820, r: 100, rot: -2.065, tilt: 1.5, k: 1.15 / 0.42, sats: L3.map((lon) => ({ lon, s: 0.32 })) }); ctx.restore(); }
  title(ctx, '¡Y LO ESCRIBIÓ EN 1945!', t, B0.b18 + 0.1, B0.b18 + 1.2, { px: 58 }); lab(ctx, 'WIRELESS WORLD · OCTUBRE DE 1945', null, 540, 1190, t, T.y1945 - 0.2, T.y1945 + 1.2, { sub: '«Extra-Terrestrial Relays»' }); recon(ctx, 'RECREACIÓN EDITORIAL · NO ES LA PÁGINA ORIGINAL', t, B0.b18 + 0.3, B0.b19 - 0.6);
 }, sfx(k) { FX.paginas(k, B0.b18 + 0.1, 2, 0.8); FX.sello(k, T.y1945); FX.aparece(k, T.y1945 + 0.7); FX.expansion(k, B0.b19 - 0.75, 0.8); } });

 // 17 · Sputnik 1 (1957): órbita BAJA e inclinada, da la vuelta muy rápido; no era geoestacionario ni retransmitía TV + FOTO (réplica)
 B.push({ t0: B0.b19, t1: B0.b20, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  space(ctx); const V = P.orbView(330, 1000, 200, 1.0 - (t - B0.b19) * 0.03, 0.35), inc = 65 * RAD, ks = 1.16, th = (t - B0.b19) * 2.2 + 0.4, sp = incPt(V, ks, inc, th), sa = sm(T.sputnik - 0.6, T.sputnik - 0.1, t);
  incRing(ctx, V, ks, inc, 'back', `rgba(245,247,250,${0.5 * sa})`); if (sp.z < 0 && !V.hidden(sp)) P.sputnik1(ctx, sp.x, sp.y, 0.95 * sa, t, { ang: th });
  P.earthHQ(ctx, V.cx, V.cy, V.r, t, { rot: V.rot, tilt: V.tilt, light: [-0.5, 0.35, 0.8] }); incRing(ctx, V, ks, inc, 'front', `rgba(245,247,250,${0.85 * sa})`);
  if (sp.z >= 0 && sa > 0) { ctx.save(); ctx.globalAlpha *= sa; P.glow(ctx, sp.x, sp.y, 30, '255,255,255', 0.5); P.sputnik1(ctx, sp.x, sp.y, 0.95, t, { ang: th }); ctx.restore(); }
  const ya = sm(T.y1957 - 0.2, T.y1957 + 0.3, t); if (ya > 0) { ctx.save(); ctx.globalAlpha *= ya; txt(ctx, '12 AÑOS', 540, 276, 44, C.oro, { w: 900, sh: 1 }); ctx.restore(); }
  P.timelineBar(ctx, 140, 330, 800, 1945, 1957, [[1945, 'ARTÍCULO'], [1957, 'SPUTNIK 1']], E.inOut(win(t, B0.b19 + 0.3, T.y1957)), t);
  P.floatPhoto(ctx, IMG.sputnik, 760, 700, 440, t, T.sputnik - 0.2, B0.b20 + 0.2, { tag: 'RÉPLICA · FOTO NASA', label: 'SPUTNIK 1 · 1957', sub: 'primer satélite artificial', credit: 'NASA / NSSDC · dominio público', from: 1, rotY: -0.1 });
  lab(ctx, 'ÓRBITA BAJA (ESQUEMA) · ≈ 96 MIN', null, 60, 1290, t, T.y1957 + 0.3, B0.b20, { al: 'left', px: 34, sub: 'no era geoestacionario ni retransmitía TV' }); 
 }, sfx(k) { FX.saltoTiempo(k, B0.b19 + 0.2, 1.2, 0.8); FX.revelar(k, T.sputnik - 0.2); for (let i = 0; i < 6; i++) FX.pitido(k, T.sputnik + 0.2 + i * 0.6, 'C6', 1); FX.etiqueta(k, T.y1957 + 0.3); } });

 // 18 · matiz histórico sobre un plano técnico: un esquema orbital anterior (Potočnik «Noordung», 1929) y dos aclaraciones sin cajas
 const note = (ctx, x, y, s, sub, ok, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - E.out(a)) * 60, 0); ctx.strokeStyle = ok ? '#78DC8C' : C.coral; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); if (ok) { ctx.moveTo(x - 20, y); ctx.lineTo(x - 5, y + 16); ctx.lineTo(x + 22, y - 18); } else { ctx.moveTo(x - 18, y - 18); ctx.lineTo(x + 18, y + 18); ctx.moveTo(x + 18, y - 18); ctx.lineTo(x - 18, y + 18); } ctx.stroke(); txt(ctx, s, x + 50, y, 46, C.blanco, { w: 900, al: 'left', sh: 1 }); ctx.font = '900 46px Nunito'; const tw = ctx.measureText(s).width; ctx.fillStyle = ok ? 'rgba(120,220,140,0.8)' : 'rgba(255,122,107,0.8)'; ctx.fillRect(x + 50, y + 34, tw * E.out(a), 4); if (sub) txt(ctx, sub, x + 50, y + 76, 34, 'rgba(245,247,250,0.85)', { w: 700, al: 'left', sh: 1 }); ctx.restore(); };
 B.push({ t0: B0.b20, t1: B0.b21, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  ctx.fillStyle = '#061322'; ctx.fillRect(0, 0, W, HH); ctx.strokeStyle = 'rgba(69,199,232,0.08)'; ctx.lineWidth = 1; for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); } for (let y = 0; y <= HH; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const d = E.inOut(win(t, B0.b20 + 0.1, T.primero + 0.6)), cx = 540, cy = 1000; ctx.save(); ctx.strokeStyle = 'rgba(69,199,232,0.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 130, -Math.PI / 2, -Math.PI / 2 + TAU * cl(d * 2)); ctx.stroke(); ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.arc(cx, cy, 330, -Math.PI / 2, -Math.PI / 2 + TAU * cl(d * 2 - 0.6)); ctx.stroke(); ctx.setLineDash([]); if (d > 0.75) { const a = sm(0.75, 0.9, d); ctx.globalAlpha *= a; ctx.fillStyle = C.cian; ctx.beginPath(); ctx.arc(cx + 330, cy, 12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx + 130, cy); ctx.lineTo(cx + 318, cy); ctx.stroke(); txt(ctx, 'ESTACIÓN ESPACIAL A ÓRBITA DE 24 H', cx, cy + 400, 32, 'rgba(69,199,232,0.95)', { w: 800 }); } ctx.restore();
  txt(ctx, 'ANTECEDENTE · H. POTOČNIK «NOORDUNG», 1929', cx, 1320 - 4, 32, 'rgba(245,247,250,0.8)', { w: 800 }); 
  note(ctx, 90, 400, 'NO INVENTÓ LOS SATÉLITES', null, false, sm(T.invento - 0.3, T.invento, t)); note(ctx, 90, 560, 'NI FUE EL PRIMERO', 'en imaginar esa órbita', false, sm(T.primero - 0.4, T.primero - 0.1, t));
 }, sfx(k) { FX.espacio(k, B0.b20, B0.b21 - B0.b20, 0.4); FX.escribir(k, B0.b20 + 0.1, 1.5, 0.4); FX.tachado(k, T.invento); FX.tachado(k, T.primero - 0.1); } });
 const NET = [['lon', -30], ['ny', -30], ['rio', -30], ['nai', 90], ['mum', 90], ['tok', -150], ['syd', 90], ['sf', -150]];
 B.push({ t0: B0.b21, t1: B0.b22, in: { type: 'fade', d: 0.35 }, draw(ctx, t) {
  space(ctx); const rot = 1.25 - (t - B0.b21) * 0.22, na = sm(T.influyente, T.globales, t);
  orbScene(ctx, t, { cy: 920, r: 225, rot, tilt: 0.55, k: KS, sats: L3.map((lon) => ({ lon, s: 0.4 })), fp: L3.map((lon, i) => ({ lon, col: COL3[i], a: 0.14 })), under(ctx, V) { NET.forEach(([c]) => pin(ctx, V, CITY[c], { a: na })); }, over(ctx, V, S) { NET.forEach(([c, lon], i) => { const s = S[L3.indexOf(lon)]; if (s.p.z > -0.2) link(ctx, V, CITY[c], s, t + i * 0.13, na, { down: i % 2 === 1, w: 16 }); }); } });
  const ma = sm(B0.b21, B0.b21 + 0.4, t) * (1 - sm(T.globales - 1.2, T.globales - 0.8, t)); if (ma > 0) { ctx.save(); ctx.globalAlpha *= ma; P.magazine1945(ctx, 190, 520, 200, t, { rot: -0.06 }); ctx.setLineDash([10, 8]); ctx.strokeStyle = 'rgba(255,212,71,0.75)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(250, 600); ctx.lineTo(430, 760); ctx.stroke(); ctx.restore(); }
  const ea = sm(T.globales - 1.0, T.globales - 0.6, t); if (ea > 0) { ctx.save(); ctx.globalAlpha *= ea; P.glow(ctx, 860, 520, 120, '255,230,170', 0.35); P.earlyBird(ctx, 860, 540, 1.25, t, { ang: 0.12 }); ctx.restore(); }
  title(ctx, 'DESCRIBIÓ CÓMO USARLA', t, T.influyente - 0.5, T.globales - 1.0, { px: 56 }); title(ctx, 'COMUNICACIONES GLOBALES', t, T.globales - 1.0, B0.b22, { px: 54 });
  lab(ctx, 'INTELSAT I «EARLY BIRD» · 1965', null, 540, 1320, t, T.globales - 0.9, B0.b22, { col: C.oro, sub: 'primer comercial geoestacionario (antes: Syncom, 1963-64)' });
 }, sfx(k) { FX.correcto(k, T.influyente - 0.3); FX.flujoDatos(k, T.influyente, 2.5, 0.5); FX.enlaceSube(k, T.influyente + 0.4, 0.5); FX.etiqueta(k, T.globales - 0.9); FX.espacio(k, B0.b21, B0.b22 - B0.b21, 0.5); } });

 // 19 · casa contemporánea al atardecer con antena parabólica offset en el tejado. La cámara empieza junto a la antena, se aleja y
 // asciende siguiendo su línea de puntería hasta revelar el satélite geoestacionario (la antena de cada casa apunta al SUYO).
 const F19 = [365, 935];
 B.push({ t0: B0.b22, t1: B0.b23, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const zp = E.inOut(win(t, B0.b22 + 0.2, T.historia - 0.3)), Z = lerp(2.3, 1.0, zp), up = E.inOut(win(t, T.historia - 0.5, B0.b23 + 0.15)) * 560, Ps = [lerp(540, F19[0], zp), lerp(1000, F19[1], zp) + up];
  const g = ctx.createLinearGradient(0, -600 + up * 0.5, 0, 1500 + up); g.addColorStop(0, '#0b1630'); g.addColorStop(0.4, '#1b2a4a'); g.addColorStop(0.75, '#c86b4a'); g.addColorStop(1, '#f2b46a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); ctx.save(); ctx.globalAlpha *= 0.5 + 0.5 * sm(0, 400, up); stars(ctx, 120, 9); ctx.restore();
  ctx.save(); ctx.translate(Ps[0], Ps[1]); ctx.scale(Z, Z); ctx.translate(-F19[0], -F19[1]);
  P.glow(ctx, 150, 1230, 240, '255,200,140', 0.6); ctx.fillStyle = '#ffe2b0'; ctx.beginPath(); ctx.arc(150, 1230, 46, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a2230'; ctx.beginPath(); ctx.moveTo(-800, 1400); for (let x = -800; x <= 1900; x += 20) ctx.lineTo(x, 1330 - 40 * Math.sin(x / 140) - 20 * Math.sin(x / 53)); ctx.lineTo(1900, 2600); ctx.lineTo(-800, 2600); ctx.fill(); ctx.fillStyle = '#1f2a22'; ctx.fillRect(-800, 1350, 2700, 1300);
  const Hs = P.modernHouse(ctx, 180, 1020, 600, t, { day: 0.55 }), rp = Hs.roof(0.28, 0.55), D = P.homeDish(ctx, rp[0], rp[1], 1.25, 0.62, t, {}); ctx.restore();
  const toS = (p) => [Ps[0] + (p[0] - F19[0]) * Z, Ps[1] + (p[1] - F19[1]) * Z], f = toS(D.feed), L = Math.min((f[1] - 400) / Math.max(0.2, -D.dir[1]), (960 - f[0]) / Math.max(0.2, D.dir[0])), sat = [f[0] + D.dir[0] * L, f[1] + D.dir[1] * L]; const la = sm(T.parabolica - 0.2, T.parabolica + 0.4, t); if (la > 0) { ctx.save(); ctx.globalAlpha *= la; ctx.setLineDash([12, 10]); ctx.strokeStyle = 'rgba(255,212,71,0.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(f[0], f[1]); ctx.lineTo(sat[0], sat[1]); ctx.stroke(); ctx.restore(); }
  const sa = sm(T.historia - 0.3, T.historia + 0.3, t); if (sa > 0) { ctx.save(); ctx.globalAlpha *= sa; P.glow(ctx, sat[0], sat[1], 80, '255,230,170', 0.8); P.satGEO3(ctx, sat[0], sat[1], 0.42, t, { face: Math.atan2(-D.dir[1], -D.dir[0]), yaw: 0.3 }); ctx.restore(); }
  title(ctx, 'LA PRÓXIMA VEZ QUE VEAS UNA…', t, B0.b22 + 0.1, T.parabolica - 0.2, { px: 50 }); title(ctx, '…ANTENA PARABÓLICA', t, T.parabolica - 0.2, B0.b23, { px: 60 });
  lab(ctx, 'APUNTA FIJA A SU SATÉLITE GEOESTACIONARIO', null, 540, 1320, t, T.historia - 0.6, B0.b23, { sub: 'por eso no necesita moverse' });
 }, sfx(k) { FX.viento(k, B0.b22, B0.b23 - B0.b22, 0.4); FX.senalRadio(k, T.parabolica + 0.2, 2, 0.5); FX.pasada(k, T.historia - 0.5, 1.4, 0.4); FX.etiqueta(k, T.historia - 0.6); } });

 // 20 · cierre: subimos desde el tejado hasta ver la Tierra con los tres satélites; ASOMBROTECA discreto
 B.push({ t0: B0.b23, t1: DURATION, in: { type: 'fade', d: 0.5 }, draw(ctx, t) {
  space(ctx); const z = E.inOut(win(t, B0.b23, B0.b23 + 2.2)), r = lerp(120, 235, z), rot = 1.0 - (t - B0.b23) * 0.08 * (1 - 0.6 * sm(T.end - 1.5, T.end, t)), sats = L3.map((lon, i) => ({ lon, s: 0.4, a: i === 0 ? sm(B0.b23 + 1.4, B0.b23 + 1.6, t) : sm(B0.b23 + 1.2, B0.b23 + 2.0, t) }));
  const { S } = orbScene(ctx, t, { cy: 860, r, rot, tilt: 0.45, k: KS, ring: sm(B0.b23 + 0.6, B0.b23 + 1.8, t), sats, fp: L3.map((lon, i) => ({ lon, col: COL3[i], a: 0.12 * sm(B0.b23 + 1.6, B0.b23 + 2.4, t) })) });
  const ca = 1 - sm(B0.b23 + 1.3, B0.b23 + 1.6, t); if (ca > 0) { const q = E.inOut(win(t, B0.b23, B0.b23 + 1.5)), p = S[0].p, x = lerp(540, p.x, q), y = lerp(700, p.y, q); ctx.save(); ctx.globalAlpha *= ca; P.glow(ctx, x, y, 200 * (1 - q) + 40, '255,230,170', 0.3); P.satGEO3(ctx, x, y, lerp(1.6, 0.31, q), t, { face: Math.atan2(860 - y, 540 - x), yaw: 0.3 }); ctx.restore(); }
  title(ctx, '¿CONOCÍAS ESTA IDEA?', t, T.idea - 0.5, T.asombroteca - 0.5, { px: 60 });
  const a = sm(T.asombroteca - 0.6, T.asombroteca, t); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(245,247,250,0.75)'; ctx.lineWidth = 2; const lw = 230 * E.out(a); ctx.beginPath(); ctx.moveTo(540 - lw, 230); ctx.lineTo(540 + lw, 230); ctx.moveTo(540 - lw, 338); ctx.lineTo(540 + lw, 338); ctx.stroke(); txt(ctx, 'ASOMBROTECA', 540, 285, 54, C.blanco, { w: 800, ls: 10, sh: 1 }); ctx.restore(); }
 }, sfx(k) { FX.aceleracion(k, B0.b23, 2.0, 0.5); FX.espacio(k, B0.b23, DURATION - B0.b23, 0.6); FX.campana(k, T.asombroteca + 0.1); FX.fin(k, T.end + 0.6); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['1945,', 'satélite', 'televisión', 'Arthur', 'Clarke.', 'repetidoras', 'antena', 'secreto!', 'treinta', 'ecuador.', 'quieto', 'geoestacionaria.', 'inmóvil:', 'velocidad,', 'rotación', 'señal', 'tres', 'cobertura', '1945!', 'Sputnik,', '1957.', 'influyente', 'parabólica,', 'Asombroteca!'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 500, gain: 0.005, a: 0.8, hold: DURATION - 2.2 }); },
  music(k) {
   MUS.piano(k, 0, B0.b5, { bpm: 72, gain: 0.8, strings: 0.7, chords: [['E3', 'G3', 'B3', 'E4'], ['C3', 'E3', 'G3', 'C4'], ['G2', 'B2', 'D3', 'G3'], ['D3', 'F#3', 'A3', 'D4']] });
   MUS.pulso(k, B0.b5, B0.b8, { bpm: 96, gain: 0.62, chords: [['E3', 'G3', 'B3', 'E4'], ['C3', 'E3', 'G3', 'C4'], ['A2', 'C3', 'E3', 'A3'], ['B2', 'D#3', 'F#3', 'B3']] });
   MUS.epica(k, B0.b8, B0.b15, { bpm: 84, gain: 0.66, drums: 0.35, strings: 1, ostinato: 0.6, chords: [['E2', 'B2', 'E3', 'G3'], ['C2', 'G2', 'C3', 'E3'], ['G2', 'D3', 'G3', 'B3'], ['D2', 'A2', 'D3', 'F#3']] });
   MUS.pulso(k, B0.b15, B0.b18, { bpm: 100, gain: 0.6, chords: [['A2', 'C3', 'E3', 'A3'], ['F2', 'A2', 'C3', 'F3'], ['C3', 'E3', 'G3', 'C4'], ['G2', 'B2', 'D3', 'G3']] });
   MUS.piano(k, B0.b18, B0.b21, { bpm: 64, gain: 0.72, strings: 0.9, chords: [['E3', 'G3', 'B3', 'E4'], ['C3', 'E3', 'G3', 'C4'], ['A2', 'C3', 'E3', 'A3'], ['B2', 'D#3', 'F#3', 'B3']] });
   MUS.epica(k, B0.b21, DURATION, { bpm: 78, gain: 0.64, drums: 0.2, strings: 0.9, ostinato: 0.35, chords: [['E2', 'B2', 'E3', 'G3'], ['C2', 'G2', 'C3', 'E3'], ['G2', 'D3', 'G3', 'B3'], ['E2', 'B2', 'E3', 'G#3']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { for (const k of Object.keys(window.FOTOS || {})) { IMG[k] = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = window.FOTOS[k]; }); } }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
