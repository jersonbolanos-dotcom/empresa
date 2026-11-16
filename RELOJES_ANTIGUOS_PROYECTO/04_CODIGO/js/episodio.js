// =====================================================================================================
// episodio.js — Cuando una hora no duraba una hora · PLANTILLA ASOMBROTECA v2.1 (modo viral)
// Voz: ElevenLabs Eleven v4, Dan, UNA toma (1.078 caracteres, 70,7 s; 5 pausas de posproducción antes de las revelaciones).
// UN solo mundo en vista oblicua (una plaza de piedra): el reloj de sol (un palo y su sombra) → [corte 1: la barra de pan] → el reloj
// de sol → cae la noche → la cámara viaja al reloj de agua de Karnak y ENTRA en él (12 reglas, una por mes) → sale → el reloj mecánico
// → amanece: horas iguales → vuelve al fotograma 0 (la sombra barriendo las líneas talladas). Sin música; el «tin» 3 veces.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const K = PL.kit(A, { lead: 0.2, tail: 1.6 }), { W, HH, TAU, cl, sm, E, lerp, wt, T, DURATION } = K;
 const S = (i) => A.segments[i].s, RNG = (s) => H.rng(s);
 const ORO = '#f2b45a', AZ = '#5aa8ff', RO = '#ff3b3b';
 const PORTADA = typeof window !== 'undefined' && !!window.__SIN_SUBTITULOS;
 const Tk = { treinta: wt(1, 'treinta'), minutos: wt(1, 'minutos;'), ochenta: wt(2, 'ochenta'), tres: wt(2, 'tres.'), sombra: wt(4, 'sombra.'), gira: wt(5, 'gira'), doce: wt(6, 'doce'), horas: wt(6, 'horas.'),
  luz: wt(10, 'luz.'), noche: wt(12, 'noche.'), egipto: wt(14, 'Egipto'), agua: wt(14, 'agua.'), mil: wt(15, 'mil'), anos: wt(15, 'años.'), vasija: wt(16, 'vasija'), escapa: wt(17, 'escapa,'), marcas: wt(17, 'marcas.'),
  reglas: wt(19, 'reglas'), mes: wt(20, 'mes.'), estaciones: wt(21, 'estaciones.'), mecanicos: wt(23, 'mecánicos:'), iguales: wt(24, 'iguales.'), decidio: wt(25, 'decidió'), sombraF: wt(25, 'sombra.') };
 const C01 = (v) => Math.max(0, Math.min(1, v));
 const mixc = (a, b, k) => { const pa = [1, 3, 5].map((i) => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.substr(i, 2), 16)); return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(',')})`; };
 // ---------- LUZ DEL DÍA: 1 = día dorado, 0 = noche ----------
 const NOCHE0 = S(11) + 0.2, NOCHE1 = Tk.noche + 0.25, ALBA0 = Tk.iguales - 1.2, ALBA1 = Tk.iguales + 0.4;
 const luzDia = (t) => (t < NOCHE0 ? 1 : t < NOCHE1 ? 1 - E.inOut(sm(NOCHE0, NOCHE1, t)) : t < ALBA0 ? 0 : E.inOut(sm(ALBA0, ALBA1, t)));
 // ---------- EL MUNDO EN VISTA OBLICUA: suelo (gx, gz) → (gx, gz·0,5); la altura h sube en pantalla ----------
 const KZ = 0.5, G = (gx, gz, h = 0) => [gx, gz * KZ - h];
 const DIAL = { r: 760 }, PALO = { h: 360 };
 // dirección del sol a lo largo del vídeo (ángulo de la sombra sobre el suelo, desde el palo; 0 = hacia quien mira)
 const angSombra = (t) => (t < S(5) ? -0.95 + 0.05 * t : t < S(7) ? lerp(-0.6, 0.9, E.inOut(sm(S(5), Tk.horas, t))) : t < NOCHE1 ? 0.9 + 0.03 * (t - S(7)) : t < ALBA1 ? 1.4 : -0.95 + 0.05 * (t - DURATION));
 // las líneas de las horas se estiran y se encogen (horas de verano y de invierno) hasta que se vuelven iguales
 const estira = (t) => { if (t >= Tk.iguales - 0.4) return lerp(0.8 + 0.2 * Math.sin((Tk.iguales - 0.4) * 1.3), 1, E.inOut(sm(Tk.iguales - 0.4, Tk.iguales + 0.6, t))) * (t > DURATION - 2.2 ? 1 : 1); return 0.8 + 0.2 * Math.sin(t * 1.3); };
 const estiraF = (t) => (t > S(25) - 0.2 ? 0.8 + 0.2 * Math.sin((t - DURATION) * 1.3) : estira(t));   // el final vuelve al ritmo del fotograma 0
 const lineasHora = (e) => { const out = []; for (let k = 0; k <= 12; k++) out.push(((k - 6) / 6) * 1.25 * e); return out; };
 const suelo = (ctx, L) => { ctx.fillStyle = mixc('#13182b', '#b98a50', L); ctx.fillRect(-6000, -6000, 14000, 14000); ctx.save(); ctx.scale(1, KZ); ctx.strokeStyle = `rgba(0,0,0,${0.12 + 0.08 * L})`; ctx.lineWidth = 6; for (let x = -4000; x <= 6000; x += 420) { ctx.beginPath(); ctx.moveTo(x, -6000); ctx.lineTo(x, 6000); ctx.stroke(); } for (let z = -6000; z <= 6000; z += 420) { ctx.beginPath(); ctx.moveTo(-4000, z); ctx.lineTo(6000, z); ctx.stroke(); } ctx.restore(); };
 const relojSol = (ctx, t, L, e) => { const r = DIAL.r;
  ctx.save(); ctx.fillStyle = mixc('#1c2340', '#6e4f2c', L); ctx.beginPath(); ctx.ellipse(0, 60, r * 1.02, r * KZ * 1.02, 0, 0, TAU); ctx.fill(); ctx.fillRect(-r * 1.02, 0, r * 2.04, 60); ctx.restore();
  ctx.save(); ctx.scale(1, KZ); const g = ctx.createRadialGradient(-180, -220, 60, 0, 0, r); g.addColorStop(0, mixc('#4a5684', '#e9cf9e', L)); g.addColorStop(1, mixc('#2c3558', '#b88d55', L)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
   ctx.strokeStyle = mixc('#0e1222', '#8a6436', L); ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, r * 0.94, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * 0.62, -2.3, -0.84 + Math.PI * 0); ctx.stroke();
   const R0 = RNG(9); for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(0,0,0,${0.05 + 0.05 * R0()})`; ctx.beginPath(); ctx.arc((R0() - 0.5) * r * 1.8, (R0() - 0.5) * r * 1.8, 6 + R0() * 22, 0, TAU); ctx.fill(); }
   // las líneas talladas (surco oscuro + borde claro), desde el pie del palo hacia quien mira
   lineasHora(e).forEach((a, k) => { const x1 = Math.sin(a) * r * 0.9, y1 = Math.cos(a) * r * 0.9; ctx.lineCap = 'round'; ctx.strokeStyle = mixc('#090c18', '#5c3f1f', L); ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(Math.sin(a) * 90, Math.cos(a) * 90); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = `rgba(255,236,200,${0.12 + 0.35 * L})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(Math.sin(a) * 90 + 6, Math.cos(a) * 90 - 6); ctx.lineTo(x1 + 6, y1 - 6); ctx.stroke(); ctx.fillStyle = mixc('#090c18', '#5c3f1f', L); ctx.beginPath(); ctx.arc(Math.sin(a) * r * 0.96, Math.cos(a) * r * 0.96, k % 3 === 0 ? 16 : 9, 0, TAU); ctx.fill(); });
  ctx.restore(); };
 const cuna = (ctx, e, k, col, a) => { if (a <= 0) return; const L = lineasHora(e), r = DIAL.r * 0.9; ctx.save(); ctx.scale(1, KZ); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 0); for (let s = 0; s <= 12; s++) { const aa = lerp(L[k], L[k + 1], s / 12); ctx.lineTo(Math.sin(aa) * r, Math.cos(aa) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); };
 const sombraPalo = (ctx, t, L) => { if (L <= 0.02) return; const a = angSombra(t), len = DIAL.r * (0.86 + 0.08 * Math.sin(t * 0.3)); P.capaDesenfoque(ctx, 9, (c) => { c.save(); c.scale(1, KZ); c.globalAlpha = 0.7 * L; c.fillStyle = '#1e1208'; const nx = Math.cos(a), ny = -Math.sin(a); c.beginPath(); c.moveTo(nx * 30, ny * 30); c.lineTo(Math.sin(a) * len + nx * 60, Math.cos(a) * len + ny * 60); c.lineTo(Math.sin(a) * len - nx * 60, Math.cos(a) * len - ny * 60); c.lineTo(-nx * 30, -ny * 30); c.closePath(); c.fill(); c.restore(); }); };
 const palo = (ctx, L) => { const g = ctx.createLinearGradient(-14, 0, 14, 0); g.addColorStop(0, mixc('#0b0e1a', '#4a2f17', L)); g.addColorStop(0.45, mixc('#2a3150', '#a87443', L)); g.addColorStop(1, mixc('#0b0e1a', '#3a2412', L)); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-13, -PALO.h, 26, PALO.h, 6); ctx.fill(); ctx.fillStyle = mixc('#202640', '#d9a868', L); ctx.beginPath(); ctx.ellipse(0, -PALO.h, 13, 6, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 0, 30, 12, 0, 0, TAU); ctx.fill(); };
 // ---------- el reloj de agua de Karnak (de pie en la plaza, a la derecha) ----------
 const VAS = { x: 2500, z: 260, h: 900, rt: 520, rb: 390 };
 const vasija = (ctx, t, L, fuego) => { const [x, y] = G(VAS.x, VAS.z), h = VAS.h, rt = VAS.rt, rb = VAS.rb, lit = Math.max(L, fuego * 0.9), wAt = (f) => lerp(rt, rb, f);
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(x + 60, y + 14, rt * 1.25, rt * 0.36, 0, 0, TAU); ctx.fill();
  const cuerpo = () => { ctx.beginPath(); ctx.moveTo(x - rt, y - h); ctx.lineTo(x - rb, y); ctx.quadraticCurveTo(x, y + rb * 0.32, x + rb, y); ctx.lineTo(x + rt, y - h); ctx.closePath(); };
  const g = ctx.createLinearGradient(x - rt, 0, x + rt, 0); g.addColorStop(0, mixc('#3a2c1e', '#e6c088', lit)); g.addColorStop(0.3, mixc('#30251a', '#c9a271', lit)); g.addColorStop(0.75, '#3a2c1c'); g.addColorStop(1, '#17110b'); ctx.fillStyle = g; cuerpo(); ctx.fill();
  ctx.save(); cuerpo(); ctx.clip();
   const R0 = RNG(31); for (let i = 0; i < 520; i++) { const f = R0(), ww = wAt(f), xx = x + (R0() * 2 - 1) * ww, yy = y - h * (1 - f), r = 2 + R0() * 7; ctx.fillStyle = R0() < 0.5 ? `rgba(20,12,6,${0.12 + 0.18 * R0()})` : `rgba(255,236,200,${0.05 + 0.1 * R0() * lit})`; ctx.beginPath(); ctx.arc(xx, yy, r, 0, TAU); ctx.fill(); }
   // relieves tallados (sin escritura): banda de zigzag, discos solares, paneles con figuras geométricas y una banda de estrellas
   const banda = (f0, f1, dib) => { const y0 = y - h * (1 - f0), y1 = y - h * (1 - f1); ctx.strokeStyle = 'rgba(20,12,6,0.6)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - wAt(f0) - 10, y0); ctx.quadraticCurveTo(x, y0 + wAt(f0) * 0.28, x + wAt(f0) + 10, y0); ctx.stroke(); ctx.strokeStyle = `rgba(255,230,190,${0.25 * lit})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - wAt(f0), y0 + 6); ctx.quadraticCurveTo(x, y0 + 6 + wAt(f0) * 0.28, x + wAt(f0), y0 + 6); ctx.stroke(); dib(y0, y1, (f0 + f1) / 2); };
   const tallar = (path) => { ctx.save(); ctx.strokeStyle = 'rgba(18,10,5,0.65)'; ctx.lineWidth = 6; path(); ctx.stroke(); ctx.translate(-3, -3); ctx.strokeStyle = `rgba(255,232,195,${0.3 * lit})`; ctx.lineWidth = 2.5; path(); ctx.stroke(); ctx.restore(); };
   banda(0.1, 0.2, (y0, y1, fm) => { const ww = wAt(fm); tallar(() => { ctx.beginPath(); for (let k = 0; k <= 16; k++) { const xx = x - ww + k * ww / 8, yy = (k % 2 ? y0 + 18 : y1 - 18) + (xx - x) * (xx - x) / ww * 0.12; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } }); });
   banda(0.2, 0.48, (y0, y1, fm) => { const ww = wAt(fm), ym = (y0 + y1) / 2 + 20; for (let k = -2; k <= 2; k++) { const xx = x + k * ww * 0.42, yy = ym + (k * k) * 8; tallar(() => { ctx.beginPath(); ctx.arc(xx, yy - 30, 34, 0, TAU); ctx.moveTo(xx - 70, yy + 30); ctx.lineTo(xx + 70, yy + 30); ctx.moveTo(xx - 52, yy - 30); ctx.lineTo(xx - 76, yy - 30); ctx.moveTo(xx + 52, yy - 30); ctx.lineTo(xx + 76, yy - 30); }); } });
   banda(0.48, 0.78, (y0, y1, fm) => { const ww = wAt(fm); for (let k = -3; k <= 3; k++) { const xx = x + k * ww * 0.3, yy = y0 + 30 + k * k * 6; tallar(() => { ctx.beginPath(); ctx.rect(xx - 34, yy, 68, (y1 - y0) - 60); ctx.moveTo(xx, yy + 20); ctx.lineTo(xx, yy + (y1 - y0) - 80); ctx.moveTo(xx - 18, yy + 60); ctx.lineTo(xx + 18, yy + 60); ctx.moveTo(xx - 14, yy + 110); ctx.arc(xx, yy + 110, 14, Math.PI, 0); }); } });
   banda(0.78, 0.92, (y0, y1, fm) => { const ww = wAt(fm); for (let k = -6; k <= 6; k++) { const xx = x + k * ww / 7, yy = (y0 + y1) / 2 + k * k * 2.5; tallar(() => { ctx.beginPath(); for (let a = 0; a < 5; a++) { const an = -Math.PI / 2 + a * TAU / 5 * 2; a ? ctx.lineTo(xx + Math.cos(an) * 16, yy + Math.sin(an) * 16) : ctx.moveTo(xx + Math.cos(an) * 16, yy + Math.sin(an) * 16); } ctx.closePath(); }); } });
   for (let i = 0; i < 9; i++) { ctx.strokeStyle = 'rgba(15,9,4,0.5)'; ctx.lineWidth = 2; const f = R0(), xx = x + (R0() * 1.6 - 0.8) * wAt(f), yy = y - h * (1 - f); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + (R0() - 0.5) * 60, yy + 30 + R0() * 50); ctx.lineTo(xx + (R0() - 0.5) * 80, yy + 70 + R0() * 60); ctx.stroke(); }
   const gl = ctx.createLinearGradient(x - rt, 0, x + rt, 0); gl.addColorStop(0, `rgba(255,170,80,${0.28 * fuego})`); gl.addColorStop(0.5, 'rgba(255,170,80,0)'); ctx.fillStyle = gl; ctx.fillRect(x - rt - 20, y - h - 40, rt * 2 + 40, h + 120);
  ctx.restore(); ctx.strokeStyle = 'rgba(12,8,4,0.7)'; ctx.lineWidth = 4; cuerpo(); ctx.stroke();
  // borde gastado: contorno irregular con muescas
  const R1 = RNG(77), borde = []; for (let k = 0; k <= 64; k++) { const a = k / 64 * TAU, mella = R1() < 0.12 ? 10 + R1() * 16 : R1() * 4; borde.push([x + Math.cos(a) * (rt + 6 - mella), y - h + Math.sin(a) * (rt * 0.3 + 3 - mella * 0.3)]); }
  ctx.fillStyle = mixc('#3a2c1c', '#dcc08c', lit); ctx.beginPath(); borde.forEach((q, k) => (k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(12,8,4,0.6)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#0d2238'; ctx.beginPath(); ctx.ellipse(x, y - h + 12, rt * 0.84, rt * 0.24, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(150,200,255,0.18)'; ctx.beginPath(); ctx.ellipse(x - rt * 0.25, y - h + 8, rt * 0.3, rt * 0.06, 0, 0, TAU); ctx.fill();
  const hx = x - rb * 0.62, hy = y - 40; ctx.fillStyle = '#0a0806'; ctx.beginPath(); ctx.arc(hx, hy, 10, 0, TAU); ctx.fill();
  const gota = C01((t - Tk.escapa + 0.6) * 2); if (gota > 0) { ctx.strokeStyle = 'rgba(150,200,255,0.85)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx - 50, hy + 10, hx - 70, hy + 120); ctx.stroke(); }
  ctx.restore(); };
 const antorcha = (ctx, t, a) => { if (a <= 0) return; const [x, y] = G(VAS.x - 620, VAS.z - 80); ctx.save(); ctx.fillStyle = '#2b1c10'; ctx.fillRect(x - 10, y - 520, 20, 520); ctx.fillStyle = '#4a3420'; ctx.beginPath(); ctx.moveTo(x - 34, y - 520); ctx.lineTo(x + 34, y - 520); ctx.lineTo(x + 18, y - 470); ctx.lineTo(x - 18, y - 470); ctx.closePath(); ctx.fill();
  const f = a * (0.9 + 0.1 * Math.sin(t * 23) * Math.sin(t * 7)); P.resplandor(ctx, x, y - 560, 900 * f, '255,170,80', 0.55 * f); ctx.globalAlpha = f; for (let i = 0; i < 3; i++) { ctx.fillStyle = ['#ff7a1a', '#ffb43c', '#fff0b0'][i]; const s = 1 - i * 0.3; ctx.beginPath(); ctx.moveTo(x - 30 * s, y - 525); ctx.quadraticCurveTo(x - 36 * s, y - 590 * s - 10 * Math.sin(t * 17 + i), x + 6 * Math.sin(t * 11 + i), y - 525 - 120 * s); ctx.quadraticCurveTo(x + 36 * s, y - 590 * s, x + 30 * s, y - 525); ctx.closePath(); ctx.fill(); }
  ctx.restore(); P.particulas(ctx, t, { tipo: 'chispas', n: 14, area: [x - 60, y - 760, x + 60, y - 540], a: 0.8 * a, seed: 12 }); };
 // ---------- el reloj mecánico (rueda dentada y foliot), en la plaza, detrás ----------
 const MEC = { x: 1150, z: -1500 };
 const relojMec = (ctx, t, L) => { const [x, y] = G(MEC.x, MEC.z); ctx.save(); ctx.translate(x, y);
  const madera = (xx, yy, w, h) => { const g = ctx.createLinearGradient(xx, 0, xx + w, 0); g.addColorStop(0, '#1e140c'); g.addColorStop(0.4, '#4a321d'); g.addColorStop(1, '#1a110a'); ctx.fillStyle = g; ctx.fillRect(xx, yy, w, h); };
  madera(-330, -1080, 40, 1080); madera(290, -1080, 40, 1080); madera(-330, -1100, 660, 40); madera(-330, -40, 660, 40);
  const paso = Math.floor(t * 2), ang = (paso + E.out(C01((t * 2 - paso) * 5))) * TAU / 48, gR = 230;
  ctx.save(); ctx.translate(0, -560); ctx.rotate(ang); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.arc(14, 14, gR + 24, 0, TAU); ctx.fill();
   const gm = ctx.createRadialGradient(-80, -80, 20, 0, 0, gR + 30); gm.addColorStop(0, '#f2d08a'); gm.addColorStop(0.55, '#b8863e'); gm.addColorStop(1, '#5a3c18'); ctx.fillStyle = gm; ctx.beginPath(); for (let i = 0; i < 48; i++) { const a0 = i * TAU / 48; ctx.lineTo(Math.cos(a0) * gR, Math.sin(a0) * gR); ctx.lineTo(Math.cos(a0 + 0.035) * (gR + 28), Math.sin(a0 + 0.035) * (gR + 28)); ctx.lineTo(Math.cos(a0 + 0.095) * (gR + 28), Math.sin(a0 + 0.095) * (gR + 28)); ctx.lineTo(Math.cos(a0 + 0.13) * gR, Math.sin(a0 + 0.13) * gR); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#3a260f'; ctx.lineWidth = 3; ctx.stroke();
   ctx.fillStyle = '#2a1c0c'; ctx.beginPath(); ctx.arc(0, 0, gR * 0.8, 0, TAU); ctx.fill(); for (let i = 0; i < 4; i++) { ctx.save(); ctx.rotate(i * Math.PI / 2 + 0.785); const gr = ctx.createLinearGradient(-18, 0, 18, 0); gr.addColorStop(0, '#6a4a1e'); gr.addColorStop(0.5, '#d9ad5e'); gr.addColorStop(1, '#6a4a1e'); ctx.fillStyle = gr; ctx.fillRect(-18, 0, 36, gR * 0.82); ctx.restore(); }
   ctx.strokeStyle = 'rgba(255,230,170,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, gR * 0.8, -2.6, -1.2); ctx.stroke(); const ej = ctx.createRadialGradient(-10, -10, 4, 0, 0, 46); ej.addColorStop(0, '#fff0c0'); ej.addColorStop(1, '#7a5420'); ctx.fillStyle = ej; ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fill(); ctx.restore();
  // el escape: varilla con dos paletas que muerden los dientes y el foliot que oscila arriba
  const fo = 0.42 * Math.sin(t * Math.PI * 2); ctx.save(); ctx.translate(0, -560 - gR - 40); ctx.fillStyle = '#7a5a2a'; ctx.fillRect(-7, -330, 14, 330); ctx.save(); ctx.rotate(fo * 0.6); ctx.fillStyle = '#c99a4c'; ctx.fillRect(-40, -18, 30, 26); ctx.fillRect(10, -8, 30, 26); ctx.restore(); ctx.restore();
  ctx.save(); ctx.translate(0, -1000); ctx.rotate(fo); const fb = ctx.createLinearGradient(0, -14, 0, 14); fb.addColorStop(0, '#8a6a3a'); fb.addColorStop(1, '#3a2814'); ctx.fillStyle = fb; ctx.fillRect(-280, -14, 560, 28); for (const sx of [-1, 1]) { const gw = ctx.createRadialGradient(sx * 255 - 8, -10, 4, sx * 255, 0, 40); gw.addColorStop(0, '#b0b0b8'); gw.addColorStop(1, '#3a3a42'); ctx.fillStyle = gw; ctx.beginPath(); ctx.arc(sx * 255, 0, 36, 0, TAU); ctx.fill(); } ctx.restore();
  // la cuerda y el peso que baja despacio
  const baja = C01((t - S(22)) / (S(25) - S(22))), py = -420 + 180 * baja; ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-gR * 0.55, -560); ctx.lineTo(-gR * 0.55, py - 70); ctx.stroke(); const gp = ctx.createLinearGradient(-gR * 0.55 - 50, 0, -gR * 0.55 + 50, 0); gp.addColorStop(0, '#2a2a30'); gp.addColorStop(0.4, '#8a8a94'); gp.addColorStop(1, '#202026'); ctx.fillStyle = gp; ctx.beginPath(); ctx.roundRect(-gR * 0.55 - 50, py - 70, 100, 160, 12); ctx.fill();
  ctx.restore(); P.resplandor(ctx, x + 420, y - 760, 800, '255,190,110', 0.25 + 0.25 * (1 - L)); };
 // ---------- la barra de pan (analogía, corte 1) ----------
 const pan = (ctx, t) => { const u = E.inOut(sm(S(8) - 0.2, S(9) - 0.2, t)), largo = lerp(640, 860, u), alto = lerp(300, 280, u), n = 12, cortes = C01((t - S(7) - 0.3) / 1.0), sep = lerp(8, 12, u);
  ctx.fillStyle = '#2a190e'; ctx.fillRect(0, 0, W, HH); const gt = ctx.createLinearGradient(0, 520, 0, 1560); gt.addColorStop(0, '#7a4f2c'); gt.addColorStop(1, '#4a2e19'); ctx.fillStyle = gt; ctx.beginPath(); ctx.roundRect(-40, 560, 1160, 980, 30); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.16)'; ctx.lineWidth = 4; for (let y = 600; y < 1520; y += 30) { ctx.beginPath(); ctx.moveTo(-40, y); ctx.bezierCurveTo(400, y + 10, 700, y - 10, 1120, y + 6); ctx.stroke(); }
  P.resplandor(ctx, 260, 640, 1000, '255,200,140', 0.34); const tot = largo + sep * (n - 1) * cortes, x0 = 540 - tot / 2, sw = largo / n, y0 = 1050 - alto / 2;
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(540, y0 + alto + 18, tot / 2 + 30, 34, 0, 0, TAU); ctx.fill();
  for (let i = 0; i < n; i++) { const x = x0 + i * (sw + sep * cortes); const g = ctx.createLinearGradient(0, y0, 0, y0 + alto); g.addColorStop(0, '#f0c27a'); g.addColorStop(0.45, '#cf8f42'); g.addColorStop(1, '#8a5524'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y0, sw, alto, i === 0 ? [alto * 0.45, 16, 16, alto * 0.45] : i === n - 1 ? [16, alto * 0.45, alto * 0.45, 16] : 14); ctx.fill();
   if (cortes > 0.05 && i > 0) { ctx.fillStyle = `rgba(250,230,190,${0.9 * cortes})`; ctx.beginPath(); ctx.roundRect(x - 2, y0 + 8, 6, alto - 16, 3); ctx.fill(); }
   ctx.fillStyle = 'rgba(255,240,200,0.35)'; ctx.beginPath(); ctx.ellipse(x + sw * 0.5, y0 + alto * 0.22, sw * 0.3, alto * 0.06, -0.45, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(110,60,20,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + sw * 0.2, y0 + alto * 0.35); ctx.quadraticCurveTo(x + sw * 0.5, y0 + alto * 0.2, x + sw * 0.8, y0 + alto * 0.35); ctx.stroke(); }
  P.titular(ctx, u < 0.5 ? 'BARRA CORTA = INVIERNO' : 'BARRA LARGA = VERANO', 540, 760, t, S(7) + 0.6, S(9) - 0.1, { px: 64, clave: u < 0.5 ? 'INVIERNO' : 'VERANO', col: u < 0.5 ? AZ : ORO });
  P.particulas(ctx, t, { tipo: 'polvo', n: 40, a: 0.35, seed: 4 }); };
 // ---------- dentro de la vasija (corte transversal): el agua baja por las 12 reglas ----------
 const dentroVasija = (ctx, t) => { ctx.fillStyle = '#081322'; ctx.fillRect(0, 0, W, HH); P.resplandor(ctx, 540, 900, 900, '255,170,90', 0.2);
  const top = 380, bot = 1460, wt0 = 760, wb0 = 520, wAt = (y) => lerp(wt0, wb0, (y - top) / (bot - top));
  ctx.fillStyle = '#3b2c1c'; ctx.beginPath(); ctx.moveTo(540 - wt0 / 2 - 60, top); ctx.lineTo(540 - wb0 / 2 - 60, bot + 60); ctx.lineTo(540 + wb0 / 2 + 60, bot + 60); ctx.lineTo(540 + wt0 / 2 + 60, top); ctx.lineTo(540 + wt0 / 2, top); ctx.lineTo(540 + wb0 / 2, bot); ctx.lineTo(540 - wb0 / 2, bot); ctx.lineTo(540 - wt0 / 2, top); ctx.closePath(); ctx.fill();
  const nivel = lerp(470, 1180, E.inOut(sm(Tk.escapa - 0.3, S(22), t))), wl = wAt(nivel), g = ctx.createLinearGradient(0, nivel, 0, bot); g.addColorStop(0, 'rgba(90,168,255,0.78)'); g.addColorStop(1, 'rgba(20,70,140,0.9)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(540 - wl / 2, nivel); ctx.lineTo(540 - wb0 / 2, bot); ctx.lineTo(540 + wb0 / 2, bot); ctx.lineTo(540 + wl / 2, nivel); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(220,240,255,0.9)'; ctx.lineWidth = 4; ctx.beginPath(); for (let x = -wl / 2; x <= wl / 2; x += 12) ctx.lineTo(540 + x, nivel + 3 * Math.sin(x * 0.05 + t * 4)); ctx.stroke();
  // las 12 reglas en la pared del fondo: cada una con su separación (horas de la noche distintas cada mes)
  const enc = (i) => C01((t - Tk.reglas + 0.2 - i * 0.12) / 0.25), dest = (i) => (t > Tk.estaciones - 1.4 ? (i === 0 || i === 6 ? 1 : 0.25) : 1);
  for (let i = 0; i < 12; i++) { const yA = 470, yB = 1180, f = i / 11, xl = 540 - wAt(yA) / 2 + 60 + f * (wAt(yA) - 120), xb = 540 - wAt(yB) / 2 + 50 + f * (wAt(yB) - 100), sep = 1 + 0.45 * Math.cos(i / 12 * TAU), on = enc(i), base = 0.28 + 0.72 * on * dest(i);
   ctx.strokeStyle = `rgba(255,214,140,${base})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xl, yA); ctx.lineTo(xb, yB); ctx.stroke(); const n = 12; for (let k = 0; k <= n; k++) { const u = Math.pow(k / n, sep), x = lerp(xl, xb, u), y = lerp(yA, yB, u); ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x + 9, y); ctx.stroke(); }
   if (on > 0 && dest(i) === 1 && t > Tk.estaciones - 1.4) P.resplandor(ctx, (xl + xb) / 2, 820, 160, i === 0 ? '90,168,255' : '255,200,110', 0.35); }
  const hx = 540 - wb0 / 2, hy = bot - 50, go = C01((t - Tk.escapa + 0.6) * 2); if (go > 0) { ctx.strokeStyle = 'rgba(150,200,255,0.9)'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx - 90, hy + 6, hx - 120, hy + 260); ctx.stroke(); P.particulas(ctx, t, { tipo: 'lluvia', n: 10, area: [hx - 140, hy + 120, hx - 90, hy + 400], a: 0.6, col: '150,200,255', seed: 3 }); }
  P.particulas(ctx, t, { tipo: 'burbujas', n: 18, area: [540 - wb0 / 2 + 30, nivel + 40, 540 + wb0 / 2 - 30, bot - 20], a: 0.4, seed: 6 }); };
 // ---------- cámara del mundo ----------
 const P0 = (() => { const a = -0.95, r = DIAL.r * 0.52; return G(Math.sin(a) * r * 0.85, Math.cos(a) * r * 0.85 + 0); })();   // el borde de la sombra cruzando las líneas
 const VASC = G(VAS.x, VAS.z, VAS.h * 0.5), MECC = G(MEC.x, MEC.z, 720);
 const cam = (t) => P.camino(t, [[0, P0[0], P0[1] - 20, 3.1], [2.6, P0[0] + 10, P0[1] - 20, 3.3], [S(1), P0[0] + 30, P0[1] - 40, 2.6], [S(2) + 1.2, 0, 90, 1.35], [S(3), 0, 70, 1.2], [S(5), 0, 60, 1.12], [Tk.horas, 0, 70, 1.18], [S(7) - 0.05, 0, 80, 1.2],
  [S(9), 60, 90, 1.2], [S(11), 0, 70, 1.18], [NOCHE1, 0, 60, 1.15], [S(13) + 0.5, 0, 60, 1.18], [Tk.egipto, VASC[0] - 80, VASC[1] + 40, 1.0], [Tk.agua, VASC[0] - 60, VASC[1] + 40, 1.0], [S(16) - 0.2, VASC[0], VASC[1], 1.05],
  [S(22) + 0.2, VASC[0], VASC[1], 1.0], [S(23) - 0.1, MECC[0], MECC[1], 1.75], [S(24) - 0.2, MECC[0], MECC[1] + 20, 1.95], [Tk.iguales - 0.2, 0, 0, 1.0], [S(25) + 0.4, 0, 0, 1.2], [DURATION - 1.6, P0[0] + 10, P0[1] - 20, 3.3], [DURATION, P0[0], P0[1] - 20, 3.1]]);
 const mundo = (ctx, t, cm) => { const L = luzDia(t), e = estiraF(t);
  ctx.save(); P.aplicaCamara(ctx, cm); suelo(ctx, L); relojSol(ctx, t, L, e);
  const ah = C01((t - Tk.treinta + 0.1) / 0.3) * (1 - C01((t - S(3)) / 0.4)); if (ah > 0) { const kz = t < Tk.ochenta - 0.1 ? 5 : 5, ew = t < Tk.ochenta - 0.1 ? 0.62 : 1.18; cuna(ctx, ew, kz, t < Tk.ochenta - 0.1 ? 'rgba(90,168,255,0.55)' : 'rgba(255,190,90,0.6)', ah); }
  const doce = C01((t - Tk.doce + 0.2) / 1.2) * (1 - C01((t - S(7)) / 0.3)); for (let k = 0; k < 12; k++) cuna(ctx, e, k, k % 2 ? 'rgba(255,210,120,0.28)' : 'rgba(255,240,190,0.18)', C01(doce * 12 - k));
  const luzC = C01((t - Tk.luz + 0.5) / 0.4) * (1 - C01((t - S(11) - 0.2) / 0.5)); cuna(ctx, e, 6, 'rgba(255,214,110,0.55)', luzC);
  if (t > S(24) - 0.3 && t < S(25) + 1) for (let k = 0; k < 12; k++) cuna(ctx, e, k, k % 2 ? 'rgba(255,214,110,0.3)' : 'rgba(255,240,190,0.16)', C01((t - Tk.iguales + 0.6) * 2) * (1 - C01((t - S(25) - 0.4) / 0.6)));
  sombraPalo(ctx, t, L); palo(ctx, L); relojMec(ctx, t, L); vasija(ctx, t, L, C01((t - Tk.egipto) / 0.6)); antorcha(ctx, t, C01((t - Tk.egipto + 0.2) / 0.5));
  ctx.restore();
  if (L > 0.05) { const sx = 540 + 600 * Math.sin(angSombra(t) + Math.PI), sy = -200; P.resplandor(ctx, sx, sy, 1400, '255,200,120', 0.32 * L); P.particulas(ctx, t, { tipo: 'polvo', n: 50, a: 0.35 * L, col: '255,226,170', seed: 5 }); }
  if (L < 0.95) { const lu = 1 - L; P.resplandor(ctx, 860, 300, 1100, '150,180,255', 0.22 * lu); ctx.save(); ctx.globalAlpha = 1 - L; P.particulas(ctx, t, { tipo: 'polvo', n: 60, a: 0.6, tam: 2, col: '210,225,255', area: [0, 0, W, 700], seed: 17 }); ctx.restore(); } };
 const ENTRA = [S(16) - 0.15, S(16) + 0.9], SALE = [S(22) + 0.15, S(22) + 1.0], CORTE1 = [S(7), S(9) - 0.02];
 const TIT = (ctx, s, t, t0, t1, clave, px = 92, y = 480) => P.titular(ctx, s, 540, y, t, t0, t1, { px, clave, col: RO });
 const CNT = (ctx, t, x, v, fin, t0, o) => P.contador(ctx, t, x, 620, v, Object.assign({ t0, px: 104, final: fin }, o));

 const B = [];
 B.push({ t0: 0, t1: DURATION, in: { type: 'cut' }, draw(ctx, t) {
  if (PORTADA) { mundo(ctx, 0, cam(0)); P.vineta(ctx, 0.55); return; }
  if (t >= CORTE1[0] && t < CORTE1[1]) pan(ctx, t);
  else if (t >= ENTRA[0] && t < ENTRA[1]) { const c0 = cam(ENTRA[0]); P.atravesar(ctx, t, ENTRA[0], ENTRA[1], (c) => mundo(c, t, c0), (c) => dentroVasija(c, t), { centro: [540 + (VASC[0] - c0[0]) * c0[2], 960 + (VASC[1] - c0[1]) * c0[2]], zoom: 8 }); }
  else if (t >= ENTRA[1] && t < SALE[0]) dentroVasija(ctx, t);
  else if (t >= SALE[0] && t < SALE[1]) { const c1 = cam(SALE[1]); P.salir(ctx, t, SALE[0], SALE[1], (c) => dentroVasija(c, t), (c) => mundo(c, t, c1), { centro: [540 + (VASC[0] - c1[0]) * c1[2], 960 + (VASC[1] - c1[1]) * c1[2]], zoom: 8 }); }
  else mundo(ctx, t, cam(t));
  // textos: un solo texto en el gancho; titulares y contadores después
  TIT(ctx, 'UNA HORA NO', t, -0.3, S(1) - 0.1, '', 92, 450); TIT(ctx, 'DURABA UNA HORA', t, -0.3, S(1) - 0.1, 'DURABA', 92, 555);
  if (t > Tk.treinta - 0.3 && t < S(3) + 0.2) { const a = 1 - C01((t - S(3)) / 0.2), v1 = Math.round(39 * E.out(sm(Tk.treinta, Tk.minutos, t))), v2 = Math.round(83 * E.out(sm(Tk.ochenta, Tk.tres + 0.2, t)));
   CNT(ctx, t, 300, v1, 39, Tk.treinta - 0.1, { unidad: 'MIN', etiqueta: 'INVIERNO', colFinal: AZ, a }); if (t > Tk.ochenta - 0.3) CNT(ctx, t, 790, v2, 83, Tk.ochenta - 0.1, { unidad: 'MIN', etiqueta: 'VERANO', colFinal: ORO, a });
   if (v2 >= 83) P.fuenteCifra(ctx, 'Royal Museums Greenwich (Londres)', 540, 760, { a: 0.92 * a }); }
  if (t > Tk.doce - 0.3 && t < S(7)) { const a = 1 - C01((t - S(7) + 0.3) / 0.3), v = Math.round(12 * E.out(sm(Tk.doce, Tk.horas, t))); CNT(ctx, t, 540, v, 12, Tk.doce - 0.1, { unidad: 'HORAS', etiqueta: 'DE LUZ, SIEMPRE', a }); if (v >= 12) P.fuenteCifra(ctx, 'Royal Museums Greenwich · Museo Galileo', 540, 760, { a: 0.92 * a }); }
  P.tachado(ctx, 'EL RELOJ FALLABA', 540, 480, t, S(9) - 0.1, S(10) + 0.2, { px: 80 }); TIT(ctx, 'LA HORA ERA LUZ', t, Tk.luz - 0.45, S(11) - 0.1, 'LUZ', 96);
  TIT(ctx, 'SIN SOL, NO HAY SOMBRA', t, S(13) - 0.1, S(14) - 0.1, 'SOMBRA', 74);
  if (t > Tk.mil - 0.4 && t < S(16) + 0.2) { const a = 1 - C01((t - S(16)) / 0.2), v = Math.round(3400 * E.out(sm(Tk.mil - 0.2, Tk.anos, t))); CNT(ctx, t, 540, v, 3400, Tk.mil - 0.3, { unidad: 'AÑOS', etiqueta: 'EL MÁS ANTIGUO QUE SE CONSERVA', a }); if (v >= 3400) P.fuenteCifra(ctx, 'Science Museum Group · Universidad McMaster', 540, 760, { a: 0.92 * a }); }
  if (t > Tk.reglas - 0.4 && t < S(21) + 0.2) { const a = 1 - C01((t - S(21)) / 0.2), v = Math.round(12 * E.out(sm(Tk.reglas - 0.2, Tk.mes, t))); CNT(ctx, t, 540, v, 12, Tk.reglas - 0.3, { unidad: 'REGLAS', etiqueta: 'UNA PARA CADA MES', a }); if (v >= 12) P.fuenteCifra(ctx, 'Science Museum Group · Universidad McMaster', 540, 760, { a: 0.92 * a }); }
  TIT(ctx, 'CADA MES, OTRA HORA', t, S(21) + 0.3, S(22) - 0.1, 'HORA', 76);
  TIT(ctx, 'HORAS IGUALES', t, Tk.iguales - 0.35, S(25) - 0.1, 'IGUALES', 100); if (t > Tk.iguales && t < S(25)) { const a = 1 - C01((t - S(25) + 0.3) / 0.3), v = Math.round(60 * E.out(sm(Tk.iguales, Tk.iguales + 1.0, t))); CNT(ctx, t, 540, v, 60, Tk.iguales, { unidad: 'MIN', etiqueta: 'CADA HORA, TODO EL AÑO', a }); if (v >= 60) P.fuenteCifra(ctx, 'RMG · Britannica · Museo Galileo', 540, 760, { a: 0.92 * a }); }
  TIT(ctx, 'UNA HORA NO', t, DURATION - 1.15, 0, '', 92, 450); TIT(ctx, 'DURABA UNA HORA', t, DURATION - 1.15, 0, 'DURABA', 92, 555);
  P.vineta(ctx, 0.5); P.grano(ctx, t, 0.05); if (t > DURATION - 1.2) P.marca(ctx, t, DURATION - 0.9);
 }, sfx(k) {   // ≤ 3 sonidos por cada 10 s; el «tin» solo 3 veces (83, 3.400, iguales); el agua es un hilo continuo
  k.noise(0, { dur: 2.6, color: 'pink', filter: 'bandpass', f: [[0, 500], [2.6, 900]], q: 0.8, gain: 0.06, a: 0.3, hold: 1.8 });   // la sombra que barre (suave)
  k.play('thud', Tk.minutos, { f: 70, gain: 0.35 }); FX.clave(k, Tk.tres + 0.2);
  k.tone(S(5), { f: [[0, 220], [Tk.horas - S(5), 330]], dur: Tk.horas - S(5) + 0.4, gain: 0.025, a: 0.8, hold: Tk.horas - S(5) - 0.6, verb: 0.4 });   // el sol que cruza (continuo)
  k.play('thud', Tk.horas, { f: 64, gain: 0.4 });
  k.tone(Tk.noche - 0.05, { f: 62, dur: 3.2, gain: 0.07, a: 0.6, hold: 2 }); k.tone(Tk.noche - 0.05, { f: 93, dur: 3.2, gain: 0.03, a: 0.6, hold: 2 });   // cae la noche (zumbido grave estable)
  k.noise(Tk.egipto - 0.2, { dur: 1.2, color: 'pink', filter: 'bandpass', f: [[0, 400], [1.2, 1500]], q: 0.7, gain: 0.09, a: 0.08, hold: 0.6 });   // se enciende la antorcha
  k.play('thud', Tk.anos, { f: 60, gain: 0.45 }); FX.clave(k, Tk.anos + 0.05);
  const g0 = Tk.escapa - 0.4, gd = SALE[0] - g0; k.noise(g0, { dur: gd, color: 'pink', filter: 'bandpass', f: 2600, q: 3, gain: 0.04, a: 0.4, hold: gd - 0.8 });   // el agua que se escapa: UN hilo continuo
  k.play('thud', Tk.mes, { f: 66, gain: 0.35 });
  k.noise(S(23) - 0.1, { dur: S(24) - S(23) + 0.6, color: 'brown', filter: 'bandpass', f: 700, q: 4, gain: 0.05, a: 0.3, hold: 1 });   // la maquinaria (continua)
  FX.clave(k, Tk.iguales + 0.05);
  const f0 = 70.2, fd = DURATION - f0; if (fd > 0.5) k.noise(f0, { dur: fd, color: 'pink', filter: 'bandpass', f: 700, q: 0.8, gain: 0.05, a: 0.4, hold: fd - 0.4 });   // la sombra al final (fuera de la ventana 60-70)
 } });

 const EP = PL.make({
  estilo: 'cartoon', capBorde: true, marca: { nombre: 'ASOMBROTECA' }, align: A, duration: DURATION, beats: B,
  modo: 'viral', capOcultar: [[0, S(1) - 0.05], [DURATION - 1.2, DURATION + 1]],
  recuadro: [['sombra', S(4), S(5)], ['doce', S(6), S(7)], ['luz', S(10), S(11)], ['noche', S(12), S(13)], ['agua', S(14), S(15)], ['mes', S(20), S(21)], ['iguales', S(24), S(25)]],
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
