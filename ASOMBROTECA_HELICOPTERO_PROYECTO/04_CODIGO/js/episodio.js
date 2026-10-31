// =====================================================================================================
// episodio.js — «¿Qué pasa si un helicóptero pierde su motor?» · Flat-Vector Science vertical 1080x1920
// Reloj = segundos de la voz original (window.ALIGN). Física según FAA Helicopter Flying Handbook (cap. 2 y 11):
// rueda libre, paso colectivo, flujo relativo ascendente, flare. Sin cifras inventadas (ni altura, ni RPM, ni grados).
// =====================================================================================================
(function () {
 const FV = window.FV, A = window.ALIGN;
 const { C, F, TAU, glow, ball, rr, pill, text, sky, finish, arrow, helicopter, rotorSide, rotorTop, airfoil } = FV;
 const W = 1080, HH = 1920, DURATION = +(A.duration + 1.0).toFixed(3);
 const sm = (a, b, x) => H.smooth(a, b, x), io = (x) => H.ease.inOut(H.clamp(x)), eo = (x) => H.ease.out(H.clamp(x)), back = (x) => H.ease.back(H.clamp(x));
 const fadeIO = (t, a, b, f = 0.3) => sm(a, a + f, t) * (1 - sm(b - f, b, t));
 const pop = (t, a, d = 0.45) => (t < a ? 0 : back((t - a) / d)); // aparición con rebote suave (overshoot del estilo)
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  cientos: wt(0, 'cientos'), altura: wt(0, 'altura'), repente: SG(1).s, motor: wt(2, 'motor'), apaga: wt(2, 'apaga'),
  desploma: SG(3).s, no: SG(4).s, necesar: wt(4, 'necesariamente'),
  aunque: SG(5).s, seguir: wt(5, 'seguir'), sin5: wt(5, 'sin'), motor5: wt(5, 'motor'), impulse: wt(5, 'impulse'), helices: wt(5, 'hélices'),
  secreto: SG(6).s, fenomeno: wt(6, 'fenómeno'), autorrot: wt(6, 'autorrotación'),
  cuando7: SG(7).s, piloto7: wt(7, 'piloto'), reducir: wt(7, 'reducir'), inclin: wt(7, 'inclinación'), palas: wt(7, 'palas'),
  desc0: SG(8).s, comienza: wt(8, 'comienza'), descender: wt(8, 'descender'), pero9: SG(9).s, sorpr: wt(9, 'sorprendente'),
  aire: SG(10).s, atraviesa: wt(10, 'atraviesa'), abajo: wt(10, 'abajo'), mantiene: wt(10, 'mantiene'), incluso: wt(10, 'incluso'), motor10: wt(10, 'motor'),
  otras: SG(11).s, energia: wt(12, 'energía'), descenso: wt(12, 'descenso'), rotor12: wt(12, 'rotor'), movim: wt(12, 'movimiento'),
  y13: SG(13).s, suelo: wt(13, 'suelo'), aprovechar: wt(13, 'aprovechar'), reducir13: wt(13, 'reducir'), caida: wt(13, 'caída'), amortiguar: wt(13, 'amortiguar'), aterrizaje: wt(13, 'aterrizaje'),
  pero14: SG(14).s, altura15: wt(15, 'altura'), velocidad: wt(15, 'velocidad'), reaccion: wt(15, 'reacción'), fundam: wt(15, 'fundamentales'),
  asi: SG(16).s, significa: wt(16, 'significa'), necesar16: wt(16, 'necesariamente'), control: wt(16, 'control'),
  esto: SG(17).s, asombro: wt(17, 'asombroteca'), end: A.speech_end,
 };
 // transiciones (inicio, fin)
 const TR = { dive: [T.necesar + 0.75, T.aunque + 0.35], match: [T.helices + 0.35, T.secreto + 0.3], wipe: [T.autorrot + 0.95, T.cuando7 + 0.15], pull: [T.palas + 0.45, T.desc0 + 0.25], energy: [T.otras - 0.25, T.otras + 0.35], field: [T.y13 - 0.3, T.y13 + 0.3] };

 // ---------- dinámica del rotor (cualitativa; sin RPM reales) ----------
 function omega(t) {
  let w = 1;
  w -= 0.14 * sm(T.motor, T.apaga + 0.5, t);                 // al fallar el motor las RPM caen
  w += 0.1 * sm(T.reducir, T.palas, t);                      // bajar el colectivo las preserva
  w += 0.06 * sm(T.aprovechar, T.aprovechar + 0.8, t);       // flare: el flujo aumenta las RPM un instante
  w -= 0.5 * sm(T.aprovechar + 0.8, T.aterrizaje + 0.2, t);  // la energía del rotor se gasta al amortiguar
  if (t > T.aterrizaje + 0.2) w *= Math.exp(-(t - T.aterrizaje - 0.2) * 0.22); // en tierra, se detiene poco a poco
  return Math.max(0, w);
 }
 const PH = (() => { const dt = 1 / 240, n = Math.ceil(DURATION / dt) + 2, a = new Float64Array(n); let p = 0; for (let i = 0; i < n; i++) { a[i] = p; p += omega(i * dt) * TAU * 1.35 * dt; } return { a, dt }; })();
 const phase = (t) => { const i = Math.min(PH.a.length - 1, Math.max(0, Math.floor(t / PH.dt))); return PH.a[i]; };
 const motorPow = (t) => 1 - sm(T.motor, T.apaga + 0.3, t);

 // ---------- exterior: posición del helicóptero, suelo y cámara ----------
 const EXT = [
  { t: 0, hx: 600, hy: 760, hs: 1.12, gy: 2150, nose: -0.06 },
  { t: T.repente, hx: 560, hy: 780, hs: 1.3, gy: 2150, nose: -0.06 },
  { t: T.apaga + 0.4, hx: 560, hy: 790, hs: 1.3, gy: 2150, nose: -0.03 },
  { t: T.desploma + 0.5, hx: 640, hy: 520, hs: 0.6, gy: 1640, nose: -0.02 },
  { t: TR.dive[0], hx: 640, hy: 540, hs: 0.62, gy: 1640, nose: -0.02 },
  { t: TR.pull[0], hx: 560, hy: 700, hs: 1.0, gy: 2050, nose: -0.03 },
  { t: T.descender, hx: 560, hy: 740, hs: 1.0, gy: 1940, nose: -0.04 },
  { t: T.aire, hx: 560, hy: 760, hs: 1.12, gy: 1860, nose: -0.04 },
  { t: TR.energy[1], hx: 560, hy: 760, hs: 1.12, gy: 1780, nose: -0.04 },
  { t: TR.field[0], hx: 790, hy: 430, hs: 0.58, gy: 1330, nose: -0.05 },
  { t: T.aprovechar, hx: 680, hy: 860, hs: 0.66, gy: 1330, nose: -0.03 },
  { t: T.caida, hx: 600, hy: 1080, hs: 0.68, gy: 1330, nose: 0.16 },
  { t: T.aterrizaje, hx: 560, hy: 1330 - 136 * 0.7, hs: 0.7, gy: 1330, nose: 0.0 },
  { t: T.fundam, hx: 560, hy: 1330 - 136 * 0.72, hs: 0.72, gy: 1330, nose: 0.0 },
  { t: DURATION, hx: 560, hy: 1330 - 136 * 0.8, hs: 0.8, gy: 1330, nose: 0.0 },
 ];
 function ext(t) {
  if (t <= EXT[0].t) return Object.assign({}, EXT[0]);
  for (let i = 0; i < EXT.length - 1; i++) { const a = EXT[i], b = EXT[i + 1]; if (t <= b.t) { const e = io((t - a.t) / (b.t - a.t)), o = {}; for (const k in a) o[k] = H.lerp(a[k], b[k], e); return o; } }
  return Object.assign({}, EXT[EXT.length - 1]);
 }
 function terrain(ctx, gy, scroll, field) {
  // cordilleras lejanas (degradados, sin contornos)
  const layers = [[gy - 520, '#2b2f7a', '#1b1f5c', 0.25, 11], [gy - 330, '#26408a', '#172a66', 0.5, 23], [gy - 150, '#1f5a8f', '#123b6b', 0.8, 37]];
  for (const [base, c0, c1, par, seed] of layers) {
   const r = H.rng(seed), g = ctx.createLinearGradient(0, base - 260, 0, base + 400); g.addColorStop(0, c0); g.addColorStop(1, c1);
   ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-50, HH + 50); let x = -50 - ((scroll * par) % 260 + 260) % 260;
   ctx.lineTo(x, base); while (x < W + 300) { const pk = base - r.range(80, 260), w2 = r.range(140, 260); ctx.lineTo(x + w2 / 2, pk); ctx.lineTo(x + w2, base - r.range(0, 60)); x += w2; }
   ctx.lineTo(W + 50, HH + 50); ctx.closePath(); ctx.fill();
  }
  // suelo / campo de aterrizaje
  const gg = ctx.createLinearGradient(0, gy - 40, 0, gy + 600); gg.addColorStop(0, field ? '#3f9b78' : '#2a6f7a'); gg.addColorStop(0.5, field ? '#2f7a64' : '#1e5266'); gg.addColorStop(1, '#173a52');
  ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(-50, gy); ctx.quadraticCurveTo(W / 2, gy - 30, W + 50, gy); ctx.lineTo(W + 50, HH + 50); ctx.lineTo(-50, HH + 50); ctx.closePath(); ctx.fill();
  if (field) {
   ctx.save(); ctx.translate(560, gy + 18); ctx.scale(1, 0.22);
   ctx.fillStyle = 'rgba(164,251,239,.18)'; ctx.beginPath(); ctx.arc(0, 0, 230, 0, TAU); ctx.fill();
   ctx.strokeStyle = 'rgba(246,250,255,.55)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 200, 0, TAU); ctx.stroke();
   ctx.restore();
   text(ctx, 'H', 560, gy + 34, F.fr(70), 'rgba(246,250,255,.55)');
   const r = H.rng(5); for (let i = 0; i < 40; i++) { const x = r.range(0, W), y = gy + r.range(30, 260); ctx.fillStyle = 'rgba(120,230,170,.25)'; ctx.beginPath(); ctx.ellipse(x, y, r.range(10, 30), 4, 0, 0, TAU); ctx.fill(); }
  }
 }
 // indicadores cualitativos (sin números): potencia del motor y giro del rotor
 function hud(ctx, t, a) {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= a;
  const dial = (x, y, val, col, lab, band) => {
   ctx.fillStyle = 'rgba(9,11,44,.55)'; ctx.beginPath(); ctx.arc(x, y, 70, 0, TAU); ctx.fill();
   ctx.lineCap = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.beginPath(); ctx.arc(x, y, 52, Math.PI * 0.8, Math.PI * 2.2); ctx.stroke();
   if (band) { ctx.strokeStyle = 'rgba(56,224,142,.55)'; ctx.beginPath(); ctx.arc(x, y, 52, Math.PI * 0.8 + 1.4 * Math.PI * 0.72, Math.PI * 0.8 + 1.4 * Math.PI * 0.95); ctx.stroke(); }
   ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x, y, 52, Math.PI * 0.8, Math.PI * 0.8 + 1.4 * Math.PI * H.clamp(val)); ctx.stroke();
   const an = Math.PI * 0.8 + 1.4 * Math.PI * H.clamp(val); ctx.strokeStyle = '#f6faff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an) * 40, y + Math.sin(an) * 40); ctx.stroke();
   ctx.fillStyle = '#f6faff'; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill();
   text(ctx, lab, x, y + 108, F.nu(30), '#bde5f8');
  };
  const mp = motorPow(t), w = omega(t) / 1.0;
  dial(140, 270, mp * 0.92, mp > 0.05 ? C.orange[1] : '#6c7aa0', 'MOTOR', false);
  dial(330, 270, w * 0.85, C.cyan, 'ROTOR', true);
  if (mp < 0.05 && t < TR.dive[0]) { ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(105, 235); ctx.lineTo(175, 305); ctx.moveTo(175, 235); ctx.lineTo(105, 305); ctx.stroke(); }
  ctx.restore();
 }
 // regla de altura (cualitativa)
 function altRuler(ctx, e, a) {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= a;
  const x = 1010, top = 420, bot = Math.min(1330, e.gy);
  ctx.strokeStyle = 'rgba(189,229,248,.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bot); ctx.stroke();
  for (let i = 0; i <= 8; i++) { const y = H.lerp(top, bot, i / 8); ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.lineTo(x, y); ctx.stroke(); }
  const fr = H.clamp((e.gy - e.hy) / 1700), my = H.lerp(bot, top, fr);
  ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.moveTo(x - 6, my); ctx.lineTo(x - 30, my - 14); ctx.lineTo(x - 30, my + 14); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.translate(x + 30, (top + bot) / 2); ctx.rotate(-Math.PI / 2); text(ctx, 'ALTURA', 0, 0, F.nu(30), '#bde5f8'); ctx.restore();
  ctx.restore();
 }
 function exterior(ctx, t) {
  const e = ext(t), field = t > TR.energy[0];
  sky(ctx, W, HH, t, { sun: field ? 1050 : 1350, vx: t * 60 * (field ? 0.3 : 1), vy: (2150 - e.gy) * 1.2, warm: field });
  terrain(ctx, e.gy, t * 90 * (field ? 0.25 : 1), field);
  // trayectorias del gancho: caída imposible (tachada) vs descenso en autorrotación
  const ta = fadeIO(t, T.desploma, TR.dive[0] + 0.2, 0.3);
  if (ta > 0) {
   const hx = e.hx, hy = e.hy + 90 * e.hs;
   arrow(ctx, [[hx, hy], [hx, hy + 250], [hx, hy + 600], [hx, e.gy - 30]], sm(T.desploma + 0.15, T.desploma + 0.9, t), C.red, 12, { dots: true, alpha: ta });
   const xp = sm(T.no, T.no + 0.3, t);
   if (xp > 0) { const cx = hx, cy = hy + 380, r = 70 * back(xp); ctx.save(); ctx.globalAlpha *= ta; ctx.strokeStyle = C.red; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - r, cy - r); ctx.lineTo(cx + r, cy + r); ctx.moveTo(cx + r, cy - r); ctx.lineTo(cx - r, cy + r); ctx.stroke(); ctx.restore(); }
   arrow(ctx, [[hx - 40, hy - 10], [hx - 330, hy + 160], [hx - 420, hy + 600], [hx - 380, e.gy - 40]], sm(T.necesar, T.necesar + 0.8, t), C.cyan, 12, { dots: true, alpha: ta });
   pill(ctx, 'DESCENSO CONTROLADO', 330, e.hy + 330, 40, { bg: C.cyan, a: ta * sm(T.necesar + 0.3, T.necesar + 0.6, t), s: pop(t, T.necesar + 0.3) });
  }
  // flujo relativo del aire (de abajo hacia arriba respecto al helicóptero en descenso)
  const fa = fadeIO(t, T.aire - 0.3, TR.energy[0] + 0.4, 0.5);
  const rotorY = e.hy - 160 * e.hs, R = 300 * e.hs;
  if (fa > 0) {
   const r = H.rng(808);
   for (let i = 0; i < 46; i++) {
    const lane = r.range(-0.95, 0.95), sp = r.range(0.6, 1.1), ph = ((t * 0.55 * sp + r()) % 1);
    const x = e.hx - 10 * e.hs + lane * R * (1 - 0.25 * Math.abs(ph - 0.5)), y = rotorY + 620 * e.hs - ph * 1150 * e.hs;
    const al = Math.sin(ph * Math.PI) * fa;
    glow(ctx, x, y, 22, C.cyan, 0.25 * al); ctx.fillStyle = H.rgba(C.cyan2, 0.85 * al); ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill();
   }
   [-0.6, 0, 0.6].forEach((l, i) => { const x0 = e.hx + l * R * 0.9; arrow(ctx, [[x0, rotorY + 560 * e.hs], [x0 - 20, rotorY + 200 * e.hs], [x0 + 10, rotorY - 120 * e.hs], [x0 + 30 * l, rotorY - 420 * e.hs]], sm(T.atraviesa + i * 0.2, T.atraviesa + 0.9 + i * 0.2, t), C.cyan, 10, { dots: true, alpha: fa }); });
  }
  // helicóptero
  const flair = fadeIO(t, T.mantiene, TR.energy[0], 0.4);
  if (flair > 0) glow(ctx, e.hx - 10 * e.hs, rotorY, R * 1.1, C.cyan, 0.18 * flair);
  if (t > T.aterrizaje - 0.1 && t < T.aterrizaje + 1.6) { const d = sm(T.aterrizaje - 0.1, T.aterrizaje + 1.6, t), r = H.rng(66); for (let i = 0; i < 16; i++) { const dir = i < 8 ? -1 : 1, sp = r.range(60, 200); ctx.fillStyle = `rgba(200,230,240,${0.35 * (1 - d)})`; ctx.beginPath(); ctx.ellipse(e.hx + dir * (40 + sp * d), e.gy + 6 - 30 * d * r(), 30 + 50 * d, 14 + 10 * d, 0, 0, TAU); ctx.fill(); } }
  helicopter(ctx, e.hx, e.hy + Math.sin(t * 1.6) * 6 * (t < T.aterrizaje ? 1 : 0), e.hs, { phase: phase(t), spin: Math.min(1, omega(t) * 1.1), power: motorPow(t), fail: fadeIO(t, T.motor, TR.dive[0], 0.2), nose: e.nose, t, tail: phase(t) * 4.5, xray: fadeIO(t, T.necesar + 0.2, TR.dive[1], 0.4) });
  // rótulos ligados a los mecanismos
  const eng = [e.hx + 70 * e.hs, e.hy - 108 * e.hs];
  pill(ctx, 'MOTOR APAGADO', eng[0] + 40, eng[1] - 150 * Math.max(0.7, e.hs), 44, { bg: C.red, fg: '#fff', a: fadeIO(t, T.apaga - 0.1, T.desploma + 0.4, 0.2), s: pop(t, T.apaga - 0.1) });
  pill(ctx, 'EL ROTOR SIGUE GIRANDO', e.hx, rotorY - 120 * e.hs - 40, 40, { bg: C.cyan, a: fadeIO(t, T.apaga + 0.35, T.desploma + 0.4, 0.2), s: pop(t, T.apaga + 0.35) });
  // descenso
  const da = fadeIO(t, T.comienza, T.aire + 0.3, 0.3);
  if (da > 0) { arrow(ctx, [[e.hx + 360, e.hy - 140], [e.hx + 360, e.hy - 20], [e.hx + 360, e.hy + 100], [e.hx + 360, e.hy + 240]], sm(T.comienza, T.descender + 0.5, t), C.yellow, 14, { alpha: da }); pill(ctx, 'DESCIENDE', 560, 480, 46, { bg: C.yellow, a: da, s: pop(t, T.comienza) }); }
  pill(ctx, 'FLUJO RELATIVO DEL AIRE', 540, 480, 44, { bg: C.cyan, a: fa * sm(T.atraviesa, T.atraviesa + 0.3, t), s: pop(t, T.atraviesa) });
  const nb = fa * sm(T.abajo, T.abajo + 0.4, t) * (1 - sm(T.incluso - 0.35, T.incluso - 0.05, t));
  if (nb > 0) { text(ctx, 'el helicóptero baja, así que el aire', 540, 568, F.nu(34, 800), C.txt, { a: nb }); text(ctx, 'lo atraviesa de abajo hacia arriba', 540, 610, F.nu(34, 800), C.txt, { a: nb }); }
  pill(ctx, 'SIN POTENCIA DEL MOTOR', eng[0] + 150, eng[1] - 30, 34, { bg: '#6c7aa0', fg: '#fff', a: fa * sm(T.incluso, T.incluso + 0.3, t), s: pop(t, T.incluso) });
  // aproximación: flare y contacto
  const la = fadeIO(t, T.aprovechar - 0.1, T.aterrizaje + 0.05, 0.3);
  if (la > 0) {
   pill(ctx, 'FLARE', 540, 490, 64, { bg: C.yellow, a: la, s: pop(t, T.aprovechar) });
   text(ctx, 'morro arriba: frena el descenso y el avance', 540, 590, F.nu(36, 800), C.txt, { a: la * sm(T.aprovechar + 0.4, T.aprovechar + 0.8, t) });
   const v = H.lerp(1, 0.25, sm(T.reducir13, T.amortiguar, t)) * (1 - sm(T.aterrizaje - 0.2, T.aterrizaje, t));
   if (v > 0.03) arrow(ctx, [[e.hx - 260 * e.hs, e.hy - 40], [e.hx - 260 * e.hs, e.hy + 40], [e.hx - 260 * e.hs, e.hy + 120], [e.hx - 260 * e.hs, e.hy + 60 + 260 * v]], 1, H.rgba(H.mix(C.cyan, C.red, v), 1), 14, { alpha: la });
   text(ctx, 'velocidad de caída', e.hx - 260 * e.hs, e.hy - 70, F.nu(30, 800), C.txt2, { a: la * sm(T.reducir13, T.reducir13 + 0.4, t) * (1 - sm(T.aterrizaje - 0.2, T.aterrizaje, t)) });
  }
  pill(ctx, 'CONTACTO AMORTIGUADO', 540, 490, 44, { bg: C.green, a: fadeIO(t, T.aterrizaje, T.pero14 + 0.1, 0.25), s: pop(t, T.aterrizaje) });
  text(ctx, 'recreación conceptual · no es garantía', 540, 580, F.nu(32, 800), C.txt2, { a: fadeIO(t, T.aterrizaje + 0.3, T.pero14 + 0.1, 0.25) });
  // límites
  const lim = fadeIO(t, T.pero14, T.asi + 0.2, 0.3);
  if (lim > 0) {
   const tri = pop(t, T.pero14);
   ctx.save(); ctx.globalAlpha *= lim; ctx.translate(540, 330); ctx.scale(tri, tri); ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.moveTo(0, -70); ctx.lineTo(80, 64); ctx.lineTo(-80, 64); ctx.closePath(); ctx.fill(); ctx.fillStyle = C.ink; ctx.fillRect(-7, -26, 14, 54); ctx.beginPath(); ctx.arc(0, 46, 8, 0, TAU); ctx.fill(); ctx.restore();
   [['ALTURA', T.altura15], ['VELOCIDAD', T.velocidad], ['REACCIÓN DEL PILOTO', T.reaccion]].forEach(([s, ta2], i) => pill(ctx, s, 540, 520 + i * 108, 48, { bg: '#e7fbff', a: lim * sm(ta2, ta2 + 0.2, t), s: pop(t, ta2) }));
  }
  // conclusión
  const ca = sm(T.asi + 0.2, T.asi + 0.6, t);
  if (ca > 0) {
   text(ctx, 'SIN MOTOR', 540, 420, F.fr(104), C.txt, { a: ca, glow: 'rgba(86,232,255,.6)' });
   const ne = pop(t, T.significa); ctx.save(); ctx.globalAlpha *= ca * sm(T.significa, T.significa + 0.2, t); ctx.translate(540, 488); ctx.scale(ne, ne); ctx.strokeStyle = C.yellow; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-60, -20); ctx.lineTo(60, -20); ctx.moveTo(-60, 20); ctx.lineTo(60, 20); ctx.moveTo(25, -55); ctx.lineTo(-25, 55); ctx.stroke(); ctx.restore();
   text(ctx, 'SIN CONTROL', 540, 640, F.fr(104), C.txt, { a: ca * sm(T.control - 0.2, T.control + 0.2, t), glow: 'rgba(86,232,255,.6)' });
   text(ctx, 'puede ser posible · no está garantizado', 540, 712, F.nu(36, 800), C.txt2, { a: ca * sm(T.necesar16, T.necesar16 + 0.4, t) });
   text(ctx, 'ASOMBROTECA', 540, 800, F.nu(34, 800), 'rgba(246,250,255,.6)', { a: sm(T.asombro, T.asombro + 0.5, t) });
  }
  const showHud = t < TR.dive[0] + 0.2 || (t > TR.pull[0] && t < TR.energy[1]) || t > TR.field[0];
  hud(ctx, t, showHud ? 1 - (t > T.pero14 ? sm(T.pero14, T.pero14 + 0.3, t) : 0) : 0);
  altRuler(ctx, e, (showHud ? 1 : 0) * (1 - sm(T.aterrizaje, T.aterrizaje + 0.5, t)));
 }

 // ---------- tren de potencia: motor | rueda libre | transmisión | mástil ----------
 function gear(ctx, x, y, r, teeth, ang, cols) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = cols[1]; ctx.beginPath(); for (let i = 0; i < teeth * 2; i++) { const a = i / (teeth * 2) * TAU, rr2 = i % 2 ? r : r * 1.16; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fill(); ctx.restore(); ball(ctx, x, y, r * 0.86, cols); }
 function drivetrain(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 300, HH); g.addColorStop(0, '#0b0e36'); g.addColorStop(0.6, '#1a1555'); g.addColorStop(1, '#2a1a62'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  glow(ctx, 640, 700, 700, '#3ccbdc', 0.12); glow(ctx, 260, 1200, 500, '#ff8d3f', 0.08);
  // silueta del fuselaje en «rayos X»
  ctx.save(); ctx.strokeStyle = 'rgba(164,251,239,.16)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-40, 1420); ctx.bezierCurveTo(-60, 820, 300, 640, 760, 700); ctx.bezierCurveTo(1060, 740, 1140, 1100, 1040, 1420); ctx.stroke(); ctx.restore();
  const ph = phase(t), y0 = 1000, fx = 400, gx = 700;
  // eje motor -> rueda libre (detenido, gris) ; eje rueda libre -> transmisión (gira, cian)
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#4b5784'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(280, y0); ctx.lineTo(fx - 70, y0); ctx.stroke();
  ctx.strokeStyle = '#3ccbdc'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(fx + 120, y0); ctx.lineTo(gx - 80, y0); ctx.stroke();
  // marcas de giro en el eje del rotor
  for (let i = 0; i < 6; i++) { const u = ((ph * 0.35 + i / 6) % 1); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 4; const xx = fx + 120 + u * (gx - 80 - fx - 120); ctx.beginPath(); ctx.moveTo(xx, y0 - 12); ctx.lineTo(xx, y0 + 12); ctx.stroke(); }
  // motor (apagado)
  const eg = ctx.createLinearGradient(80, y0 - 120, 300, y0 + 120); eg.addColorStop(0, '#8b95b8'); eg.addColorStop(1, '#3a4470'); ctx.fillStyle = eg; rr(ctx, 70, y0 - 110, 220, 220, 40); ctx.fill();
  for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(9,11,44,.3)'; rr(ctx, 95 + i * 32, y0 - 80, 14, 160, 7); ctx.fill(); }
  ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(130, y0 - 50); ctx.lineTo(230, y0 + 50); ctx.moveTo(230, y0 - 50); ctx.lineTo(130, y0 + 50); ctx.stroke();
  // rueda libre: aro exterior (lado rotor, gira) + cubo interior (lado motor, quieto) con rodillos
  const sepT = sm(T.sin5, T.motor5 + 0.3, t);
  ball(ctx, fx, y0, 150, ['#a4fbef', '#3ccbdc', '#1d64b0']);
  ctx.save(); ctx.translate(fx, y0); ctx.rotate(ph * 0.35); ctx.fillStyle = 'rgba(9,11,44,.75)'; ctx.beginPath(); ctx.arc(0, 0, 112, 0, TAU); ctx.fill();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.save(); ctx.rotate(a); ctx.translate(92, 0); ctx.rotate(0.5); ctx.fillStyle = '#ffd23f'; rr(ctx, -10, -18, 20, 36, 8); ctx.fill(); ctx.restore(); }
  ctx.restore();
  ball(ctx, fx, y0, 70, ['#c6cde6', '#7a85ad', '#3a4470']);
  glow(ctx, fx, y0, 260, C.yellow, 0.2 * sepT * (0.6 + 0.4 * Math.sin(t * 6)));
  // flechas de giro: aro (sí) / cubo (no)
  arrow(ctx, [[fx - 170, y0 - 80], [fx - 150, y0 - 190], [fx + 40, y0 - 230], [fx + 150, y0 - 150]], 0.4 + 0.6 * ((t * 0.8) % 1) * 0 + 0.6, C.cyan, 10, { alpha: 0.9 });
  // transmisión y mástil
  gear(ctx, gx, y0, 110, 14, ph * 0.5, ['#ffe9a0', '#ffd23f', '#c78a00']);
  gear(ctx, gx, y0 - 230, 70, 10, -ph * 0.8, ['#ffe9a0', '#ffd23f', '#c78a00']);
  ctx.strokeStyle = '#a4fbef'; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(gx, y0 - 300); ctx.lineTo(gx, 520); ctx.stroke();
  for (let i = 0; i < 5; i++) { const u = ((ph * 0.3 + i / 5) % 1); ctx.strokeStyle = 'rgba(9,11,44,.45)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(gx - 15, 520 + u * (y0 - 300 - 520)); ctx.lineTo(gx + 15, 520 + u * (y0 - 300 - 520) + 8); ctx.stroke(); }
  rotorSide(ctx, 540, 500, 470, ph, Math.min(1, omega(t) * 1.1)); ctx.strokeStyle = '#a4fbef'; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(gx, 520); ctx.lineTo(540, 500); ctx.stroke();
  // rótulos
  text(ctx, 'MOTOR', 180, y0 + 165, F.nu(42), '#c6cde6');
  pill(ctx, 'RUEDA LIBRE', fx, y0 + 235, 50, { bg: C.yellow, s: pop(t, T.seguir), a: sm(T.seguir, T.seguir + 0.2, t) });
  text(ctx, 'desacopla el motor del rotor', 540, y0 + 320, F.nu(38, 800), C.txt, { a: sm(T.sin5, T.sin5 + 0.4, t) });
  text(ctx, 'TRANSMISIÓN', gx + 90, y0 + 165, F.nu(38), C.txt2);
  pill(ctx, 'EL ROTOR SIGUE GIRANDO', 540, 410, 42, { bg: C.cyan, s: pop(t, T.aunque + 0.3), a: sm(T.aunque + 0.3, T.aunque + 0.5, t) });
  // MOTOR ≠ ROTOR
  const ne = sm(T.motor5, T.motor5 + 0.3, t);
  if (ne > 0) { const s2 = pop(t, T.motor5); text(ctx, 'MOTOR', 330, 290, F.fr(84), '#c6cde6', { a: ne }); ctx.save(); ctx.globalAlpha *= ne; ctx.translate(540, 260); ctx.scale(s2, s2); ctx.strokeStyle = C.yellow; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-45, -15); ctx.lineTo(45, -15); ctx.moveTo(-45, 15); ctx.lineTo(45, 15); ctx.moveTo(18, -42); ctx.lineTo(-18, 42); ctx.stroke(); ctx.restore(); text(ctx, 'ROTOR', 760, 290, F.fr(84), C.cyan, { a: ne, glow: 'rgba(86,232,255,.5)' }); }
 }
 // ---------- rotor visto desde arriba: AUTORROTACIÓN ----------
 function rotorScene(ctx, t, sc = 1) {
  sky(ctx, W, HH, t, { vy: t * 40 });
  const ph = phase(t);
  // anillos de aire que suben a través del disco (vistos desde arriba)
  const r = H.rng(3);
  for (let i = 0; i < 26; i++) { const a = r() * TAU, d = r.range(60, 400) * sc, p = ((t * 0.6 + r()) % 1); ctx.fillStyle = H.rgba(C.cyan2, 0.6 * Math.sin(p * Math.PI)); ctx.beginPath(); ctx.arc(540 + Math.cos(a) * d, 900 + Math.sin(a) * d, 3 + 7 * p, 0, TAU); ctx.fill(); }
  rotorTop(ctx, 540, 900, 430 * sc, ph, Math.min(1, omega(t) * 1.1));
  const ta = sm(T.autorrot - 0.05, T.autorrot + 0.25, t), s = pop(t, T.autorrot - 0.05);
  if (ta > 0) { ctx.save(); ctx.globalAlpha *= ta; ctx.translate(540, 360); ctx.scale(s, s); text(ctx, 'AUTORROTACIÓN', 0, 0, F.fr(112), C.txt, { glow: 'rgba(86,232,255,.8)', blur: 30 }); ctx.restore(); }
  text(ctx, 'el rotor gira sin la fuerza del motor', 540, 450, F.nu(38, 800), C.txt2, { a: sm(T.autorrot + 0.3, T.autorrot + 0.7, t) });
  pill(ctx, 'EL SECRETO', 540, 1420 - 80, 40, { bg: C.yellow, a: fadeIO(t, T.secreto, T.autorrot, 0.2), s: pop(t, T.secreto) });
 }
 // ---------- perfil de pala: BAJAR EL PASO COLECTIVO ----------
 function airfoilScene(ctx, t) {
  sky(ctx, W, HH, t, { vx: t * 30 });
  const ang = H.lerp(0.22, 0.07, io(sm(T.reducir, T.reducir + 1.0, t)));
  // plano de rotación
  ctx.save(); ctx.setLineDash([18, 16]); ctx.strokeStyle = 'rgba(189,229,248,.55)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(80, 860); ctx.lineTo(1000, 860); ctx.stroke(); ctx.restore();
  text(ctx, 'plano de giro', 860, 900, F.nu(30, 800), C.txt2);
  airfoil(ctx, 560, 860, 2.2, ang);
  // arco del ángulo de paso
  ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(560 - 360, 860, 300, -ang, 0); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(255,210,63,.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(560 - 380, 860 + 380 * Math.sin(ang) * 0); ctx.lineTo(560 + 440 * Math.cos(ang) * 1, 860 - 440 * Math.sin(ang) - 380 * Math.sin(ang) * 0); ctx.stroke(); ctx.restore();
  text(ctx, 'ÁNGULO DE PASO', 300, 760 - 300 * ang, F.nu(32), C.yellow);
  // flecha que rota la pala hacia abajo
  if (t > T.reducir) arrow(ctx, [[880, 640], [960, 700], [970, 780], [930, 840]], sm(T.reducir, T.reducir + 0.7, t), C.orange[1], 12);
  pill(ctx, 'BAJAR EL PASO COLECTIVO', 540, 380, 46, { bg: C.yellow, a: sm(T.reducir, T.reducir + 0.2, t), s: pop(t, T.reducir) });
  text(ctx, 'menor ángulo en todas las palas a la vez', 540, 470, F.nu(36, 800), C.txt, { a: sm(T.inclin, T.inclin + 0.4, t) });
  // palanca del colectivo
  const lv = H.lerp(-0.95, -0.35, io(sm(T.reducir, T.reducir + 1.0, t)));
  ctx.save(); ctx.translate(250, 1250);
  ctx.fillStyle = 'rgba(9,11,44,.5)'; rr(ctx, -110, -10, 300, 40, 18); ctx.fill();
  ctx.rotate(lv); const lg = ctx.createLinearGradient(0, -20, 240, 20); lg.addColorStop(0, '#a4fbef'); lg.addColorStop(1, '#1d64b0'); ctx.fillStyle = lg; rr(ctx, 0, -14, 240, 28, 14); ctx.fill(); ball(ctx, 240, 0, 30, ['#ffe9a0', '#ffd23f', '#c78a00']); ctx.restore();
  ball(ctx, 250, 1250, 22, ['#c6cde6', '#7a85ad', '#3a4470']);
  if (t > T.reducir) arrow(ctx, [[520, 1000], [560, 1060], [560, 1120], [520, 1170]], sm(T.reducir, T.reducir + 0.6, t), C.orange[1], 10);
  text(ctx, 'palanca del colectivo', 300, 1340, F.nu(32, 800), C.txt2);
  pill(ctx, 'PILOTO', 250, 600, 40, { bg: '#e7fbff', a: fadeIO(t, T.piloto7, T.reducir + 0.4, 0.2), s: pop(t, T.piloto7) });
 }
 // ---------- energía: altura -> aire -> giro ----------
 function energyScene(ctx, t) {
  sky(ctx, W, HH, t, { vy: t * 80 });
  const ph = phase(t);
  // helicóptero pequeño que desciende a la izquierda (identidad del protagonista)
  const hy = 520 + 600 * sm(T.otras, T.y13, t);
  ctx.save(); ctx.setLineDash([2, 22]); ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(164,251,239,.5)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(170, 460); ctx.lineTo(170, 1300); ctx.stroke(); ctx.restore();
  helicopter(ctx, 190, hy, 0.38, { phase: ph, spin: 1, power: 0, t, tail: ph * 4.5 });
  const nodes = [[620, 500, T.energia, 'ALTURA', ['#b9a6ff', '#7250b2', '#3a1a6c']], [620, 810, T.descenso, 'AIRE QUE ATRAVIESA EL ROTOR', ['#c6fbff', '#56e8ff', '#1d64b0']], [620, 1120, T.rotor12, 'GIRO DEL ROTOR', ['#ffe0a6', '#ff8d3f', '#d24a2a']]];
  nodes.forEach(([x, y, ta, lab, cols], i) => {
   const s = pop(t, ta); if (s <= 0) return;
   ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ball(ctx, 0, 0, 92, cols);
   if (i === 0) { const lvl = 1 - 0.7 * sm(T.energia, T.y13, t); ctx.fillStyle = 'rgba(255,255,255,.85)'; rr(ctx, -16, -70, 32, 140, 14); ctx.fill(); ctx.fillStyle = '#3a1a6c'; rr(ctx, -10, -64 + 128 * (1 - lvl), 20, 128 * lvl, 10); ctx.fill(); }
   if (i === 1) { for (let k = 0; k < 3; k++) { const yy = 40 - ((t * 60 + k * 33) % 100); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-34, yy + 18); ctx.lineTo(0, yy - 14); ctx.lineTo(34, yy + 18); ctx.stroke(); } }
   if (i === 2) rotorTop(ctx, 0, 0, 70, ph, 1, { glowCol: '#ff8d3f' });
   ctx.restore();
   pill(ctx, lab, x, y + 132, 36, { bg: '#e7fbff', a: sm(ta, ta + 0.2, t), s: s });
  });
  arrow(ctx, [[620, 660], [600, 680], [600, 690], [620, 705]], sm(T.descenso - 0.2, T.descenso + 0.3, t), C.cyan, 10, { dots: true });
  arrow(ctx, [[620, 970], [600, 990], [600, 1000], [620, 1015]], sm(T.rotor12 - 0.2, T.rotor12 + 0.3, t), C.orange[1], 10, { dots: true });
  pill(ctx, 'ENERGÍA DEL DESCENSO', 540, 300, 46, { bg: C.yellow, a: sm(T.energia, T.energia + 0.2, t), s: pop(t, T.energia) });
  text(ctx, 'no se crea energía: se transforma', 600, 1340, F.nu(36, 800), C.txt, { a: sm(T.movim, T.movim + 0.4, t) });
 }

 // ---------- subtítulos (Nunito, blanco sin caja, barra amarilla fina bajo la palabra activa) ----------
 function subtitles(c, t) {
  const ph = A.phrases.find((p) => t >= p.s && t < p.e); if (!ph) return;
  const a = sm(ph.s - 0.02, ph.s + 0.1, t) * (1 - sm(ph.e - 0.1, ph.e, t));
  let px = 64; c.font = F.nu(px, 900); const maxW = 900;
  const widest = Math.max(...ph.lines.map((l) => c.measureText(l).width)); if (widest > maxW) { px = Math.floor(px * maxW / widest); c.font = F.nu(px, 900); }
  const lh = px * 1.22, y0 = 1500 - (ph.lines.length - 1) * lh / 2, sp = c.measureText(' ').width;
  const boxes = []; let wi = 0;
  ph.lines.forEach((ln, li) => { const lw = c.measureText(ln).width; let cx = 540 - lw / 2; ln.split(' ').forEach((w) => { const ww = c.measureText(w).width; boxes.push({ w, x: cx, y: y0 + li * lh, ww, s: ph.w[wi] ? ph.w[wi].s : ph.s, e: ph.w[wi] ? ph.w[wi].e : ph.e }); wi++; cx += ww + sp; }); });
  let act = boxes.findIndex((b) => t >= b.s && t < b.e); if (act < 0) act = t >= boxes[boxes.length - 1].s ? boxes.length - 1 : 0;
  const b0 = boxes[act], nb = boxes[act + 1]; let bx = b0.x, bw = b0.ww;
  if (nb && nb.y === b0.y) { const f = io(sm(b0.e - 0.08, b0.e, t)); bx = H.lerp(b0.x, nb.x, f); bw = H.lerp(b0.ww, nb.ww, f); }
  c.save(); c.globalAlpha = a; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  c.fillStyle = C.yellow; c.beginPath(); rr(c, bx, b0.y + px * 0.15, bw, Math.max(6, px * 0.09), 4); c.fill();
  c.shadowColor = 'rgba(9,11,44,0.85)'; c.shadowBlur = 16; c.shadowOffsetY = 3; c.fillStyle = '#ffffff';
  for (const b of boxes) c.fillText(b.w, b.x, b.y);
  c.restore();
 }

 // ---------- composición con transiciones del propio estilo ----------
 const L = {}; const layer = (k) => L[k] || (L[k] = H.layer(W, HH));
 function into(k, fn) { const cv = layer(k), x = cv.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.clearRect(0, 0, W, HH); fn(x); return cv; }
 function zoomDraw(ctx, cv, cx, cy, z, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); ctx.drawImage(cv, 0, 0); ctx.restore(); }
 function sceneAt(ctx, t) {
  if (t < TR.dive[0]) return exterior(ctx, t);
  if (t < TR.dive[1]) { // inmersión: la cámara entra en el capó del motor y se abre el corte del tren de potencia
   const p = io(sm(TR.dive[0], TR.dive[1], t)), e = ext(t), ex = e.hx + 30 * e.hs, ey = e.hy - 108 * e.hs;
   const a = into('a', (x) => exterior(x, t)); zoomDraw(ctx, a, ex, ey, 1 + 5 * p);
   const b = into('b', (x) => drivetrain(x, t)); ctx.save(); ctx.beginPath(); ctx.arc(ex, ey, Math.max(1, 1250 * Math.pow(p, 1.6)), 0, TAU); ctx.clip(); zoomDraw(ctx, b, ex, ey, H.lerp(0.4, 1, p)); ctx.restore();
   return;
  }
  if (t < TR.match[0]) return drivetrain(ctx, t);
  if (t < TR.match[1]) { // match-cut: el aro de la rueda libre se convierte en el disco del rotor
   const p = io(sm(TR.match[0], TR.match[1], t));
   const a = into('a', (x) => drivetrain(x, t)); zoomDraw(ctx, a, 400, 1130, 1 + 2.2 * p, 1 - p);
   const b = into('b', (x) => rotorScene(x, t, H.lerp(0.33, 1, p))); ctx.save(); ctx.globalAlpha = p; ctx.drawImage(b, 0, 0); ctx.restore();
   return;
  }
  if (t < TR.wipe[0]) return rotorScene(ctx, t);
  if (t < TR.wipe[1]) { // barrido: una pala cruza la cámara y descubre el perfil
   const p = io(sm(TR.wipe[0], TR.wipe[1], t)), ang = -0.6 + p * 2.2;
   rotorScene(ctx, t);
   const b = into('b', (x) => airfoilScene(x, t));
   ctx.save(); ctx.beginPath(); ctx.moveTo(-400, -400); const L2 = 3200, nx = Math.cos(ang), ny = Math.sin(ang);
   ctx.moveTo(-200, 2200); ctx.lineTo(-200 + nx * L2, 2200 + ny * L2 * 0); ctx.closePath();
   ctx.restore();
   ctx.save(); ctx.beginPath(); const sweepX = H.lerp(-300, W + 300, p); ctx.moveTo(-300, -50); ctx.lineTo(sweepX + 260, -50); ctx.lineTo(sweepX - 260, HH + 50); ctx.lineTo(-300, HH + 50); ctx.closePath(); ctx.clip(); ctx.drawImage(b, 0, 0); ctx.restore();
   ctx.save(); ctx.translate(sweepX, 960); ctx.rotate(-0.26); const g = ctx.createLinearGradient(-90, 0, 90, 0); g.addColorStop(0, '#a4fbef'); g.addColorStop(0.5, '#3ccbdc'); g.addColorStop(1, '#1d64b0'); ctx.fillStyle = g; rr(ctx, -80, -1200, 160, 2400, 70); ctx.fill(); ctx.fillStyle = 'rgba(5,16,62,.3)'; rr(ctx, 10, -1200, 50, 2400, 25); ctx.fill(); ctx.restore();
   return;
  }
  if (t < TR.pull[0]) return airfoilScene(ctx, t);
  if (t < TR.pull[1]) { const p = io(sm(TR.pull[0], TR.pull[1], t)); const a = into('a', (x) => airfoilScene(x, t)); const b = into('b', (x) => exterior(x, t)); const e = ext(t); zoomDraw(ctx, b, e.hx, e.hy - 160 * e.hs, H.lerp(3, 1, p)); zoomDraw(ctx, a, 560, 860, H.lerp(1, 0.2, p), 1 - p); return; }
  if (t < TR.energy[0]) return exterior(ctx, t);
  if (t < TR.energy[1]) { const p = io(sm(TR.energy[0], TR.energy[1], t)); exterior(ctx, t); const b = into('b', (x) => energyScene(x, t)); ctx.save(); ctx.globalAlpha = p; ctx.drawImage(b, 0, 0); ctx.restore(); return; }
  if (t < TR.field[0]) return energyScene(ctx, t);
  if (t < TR.field[1]) { const p = io(sm(TR.field[0], TR.field[1], t)); energyScene(ctx, t); const b = into('b', (x) => exterior(x, t)); zoomDraw(ctx, b, 540, 960, H.lerp(1.3, 1, p), p); return; }
  return exterior(ctx, t);
 }
 function explainer(ctx, Wd, Hd, t) {
  sceneAt(ctx, t);
  finish(ctx, W, HH, t);
  subtitles(ctx, t);
 }
 window.EPISODIO = { explainer, init: async () => {}, T, TR, DURATION, wt, omega, motorPow };
})();
