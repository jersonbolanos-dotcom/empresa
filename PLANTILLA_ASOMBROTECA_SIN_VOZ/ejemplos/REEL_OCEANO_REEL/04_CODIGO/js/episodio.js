// =====================================================================================================
// episodio.js — «¿El Everest cabe en el océano?» · FORMATO: COMPARACIÓN DE TAMAÑOS · Plantilla Asombroteca SIN_VOZ
// Barras que bajan desde la superficie, una a una, con un pop (R.tamanos, escala real: 0,08 px por metro). Al final el Everest
// crece apoyado en el fondo de la fosa y sobra agua por encima. Datos y fuentes en FUENTES_Y_DECISIONES.md.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;
 const ESTILO = 'asombroteca', MARCA = 'ASOMBROTECA';

 // ---------- 1 · ESCALA Y TIEMPOS ----------
 const SUP = 500, ESC = 0.084, FOSA = 10935, EVEREST = 8849, yM = (m) => SUP + m * ESC;
 const tEv = R.t('everest'), tSob = R.t('sobra');
 // iconos (todos dibujados en el extremo de su barra)
 const buzo = (ctx, x, y, w, u) => { if (u < 0.6) return; ctx.save(); ctx.globalAlpha *= cl((u - 0.6) * 3); ctx.translate(x + 70, y + 14); ctx.rotate(-0.25); ctx.fillStyle = '#ffd54a'; ctx.beginPath(); ctx.roundRect(-34, -10, 56, 20, 10); ctx.fill(); ctx.fillStyle = '#1b2440'; ctx.beginPath(); ctx.arc(30, -2, 13, 0, TAU); ctx.fill(); ctx.fillStyle = '#9fd8ff'; ctx.beginPath(); ctx.arc(33, -4, 7, 0, TAU); ctx.fill(); ctx.fillStyle = '#1b2440'; ctx.beginPath(); ctx.moveTo(-34, -8); ctx.lineTo(-62, -18); ctx.lineTo(-58, 6); ctx.lineTo(-34, 8); ctx.fill(); ctx.fillStyle = '#ff9f43'; ctx.fillRect(-20, -18, 30, 9); ctx.restore(); };
 const ballena = (ctx, x, y, w, u, t) => { if (u < 0.6) return; ctx.save(); ctx.globalAlpha *= cl((u - 0.6) * 3); ctx.translate(x - 120, y - 6); const s = Math.sin(t * 2) * 0.12; ctx.fillStyle = '#8fa3c7'; ctx.beginPath(); ctx.ellipse(0, 0, 62, 20, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-56, 0); ctx.lineTo(-92, -18 + s * 60); ctx.lineTo(-88, 18 + s * 60); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#c9d6ee'; ctx.beginPath(); ctx.ellipse(10, 8, 44, 9, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#1b2440'; ctx.beginPath(); ctx.arc(38, -4, 3.5, 0, TAU); ctx.fill(); ctx.restore(); };
 const roca = (ctx, x, y, half) => { ctx.save(); ctx.fillStyle = '#4a3f38'; ctx.beginPath(); ctx.moveTo(x - half, y + 26); ctx.lineTo(x - half + 18, y); ctx.lineTo(x + half - 14, y); ctx.lineTo(x + half, y + 26); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#6b5b4e'; ctx.fillRect(x - half + 18, y, half * 2 - 32, 5); ctx.restore(); };
 const titanic = (ctx, x, y, w, u) => { roca(ctx, x, y, 90); if (u < 0.85) return; ctx.save(); ctx.globalAlpha *= cl((u - 0.85) * 6); ctx.translate(x, y); ctx.rotate(-0.06); ctx.fillStyle = '#20232e'; ctx.beginPath(); ctx.moveTo(-74, -2); ctx.lineTo(70, -2); ctx.lineTo(80, -28); ctx.lineTo(-80, -28); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#7a3b2e'; ctx.fillRect(-72, -8, 144, 6); ctx.fillStyle = '#d9d2c0'; ctx.fillRect(-56, -40, 100, 12); ctx.fillStyle = '#c7a23a'; for (let i = 0; i < 4; i++) ctx.fillRect(-46 + i * 24, -60, 12, 20); ctx.restore(); };
 const ITEMS = [
  { v: 40, valor: '40 m', t0: R.t('buzo'), d: 0.6, icon: buzo },
  { v: 2992, valor: '2.992 m', t0: R.t('ballena'), d: 0.9 },
  { v: 3800, valor: '3.800 m', t0: R.t('titanic'), d: 0.9, icon: titanic },
  { v: FOSA, valor: '10.935 m', t0: R.t('fosa'), d: 2.2, col: '#ff9f43', col2: 'rgba(255,159,67,0.45)', labelDy: 4 },
 ];
 const OPT = { items: ITEMS, x0: 80, x1: 920, base: SUP, esc: ESC, dir: 'abajo', ancho: 0.46, px: 46, mark: 1000 };

 // ---------- 2 · MAR ----------
 function mar(ctx, t) {
  R.fondo(ctx, t, { gy: 300 });
  const g = ctx.createLinearGradient(0, SUP, 0, 1920); g.addColorStop(0, '#2f7fc4'); g.addColorStop(0.25, '#1b4f8f'); g.addColorStop(0.6, '#0e2a5a'); g.addColorStop(1, '#050d24'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, SUP); for (let x = 0; x <= 1080; x += 12) ctx.lineTo(x, SUP + Math.sin(x * 0.02 + t * 2.2) * 6 + Math.sin(x * 0.047 - t * 1.4) * 3); ctx.lineTo(1080, 1920); ctx.lineTo(0, 1920); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(220,240,255,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); for (let x = 0; x <= 1080; x += 12) { const y = SUP + Math.sin(x * 0.02 + t * 2.2) * 6 + Math.sin(x * 0.047 - t * 1.4) * 3; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  // partículas en suspensión que bajan muy despacio («nieve marina»)
  const RS = H.rng(4); ctx.fillStyle = 'rgba(220,235,255,0.35)'; for (let i = 0; i < 70; i++) { const x = RS() * 1080, y = SUP + ((RS() * 1400 + t * (8 + RS() * 10)) % 1400); ctx.beginPath(); ctx.arc(x, y, 1.5 + RS() * 2, 0, TAU); ctx.fill(); }
  // reglas de profundidad a la izquierda (cada 1000 m)
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2; for (let m = 1000; m <= 11000; m += 1000) { const y = yM(m); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); }
 }
 function everest(ctx, t, x) {
  const u = E.out(win(t, tEv, tEv + 1.6)); if (u <= 0) return; const base = yM(FOSA), h = EVEREST * ESC * u, half = 150;
  roca(ctx, x, base, 175);
  ctx.save(); const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, '#9aa3b5'); g.addColorStop(1, '#4b4f5e'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x - half, base); ctx.lineTo(x - half * 0.45, base - h * 0.55); ctx.lineTo(x - half * 0.2, base - h * 0.7); ctx.lineTo(x, base - h); ctx.lineTo(x + half * 0.25, base - h * 0.78); ctx.lineTo(x + half * 0.5, base - h * 0.6); ctx.lineTo(x + half, base); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f5f7fa'; ctx.beginPath(); ctx.moveTo(x, base - h); ctx.lineTo(x - half * 0.2, base - h * 0.84); ctx.lineTo(x - half * 0.06, base - h * 0.87); ctx.lineTo(x + half * 0.08, base - h * 0.83); ctx.lineTo(x + half * 0.2, base - h * 0.86); ctx.closePath(); ctx.fill();
  ctx.restore();
  if (u > 0.9) R.texto(ctx, '8.849 m', t, tEv + 1.4, null, { x, y: base - h * 0.3, px: 46, font: 'Nunito', fw: 900, anim: 'sube', fadeOut: false });
  // lo que sobra: corchete entre la cima y la superficie
  const s = E.out(win(t, tSob, tSob + 0.6)); if (s > 0) { const top = base - EVEREST * ESC, xx = x + 60; ctx.save(); ctx.strokeStyle = '#ffd54a'; ctx.lineWidth = 5; ctx.setLineDash([12, 9]); ctx.beginPath(); ctx.moveTo(xx, top); ctx.lineTo(xx, lerp(top, SUP + 6, s)); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(xx - 18, top); ctx.lineTo(xx + 18, top); ctx.moveTo(xx - 18, SUP + 6); ctx.lineTo(xx + 18, SUP + 6); ctx.globalAlpha = s; ctx.stroke(); ctx.restore();
   }
 }

 // ---------- 3 · ESCENA ----------
 const B = [{ t0: 0, t1: D, in: { type: 'cut' }, draw(ctx, t) {
  mar(ctx, t);
  const bars = R.tamanos(ctx, t, OPT);
  ballena(ctx, bars[1].x, bars[1].yEnd, 0, bars[1].u, t);
  everest(ctx, t, bars[3].x - 20);
  R.titulares(ctx, t, { y: 330, pos: { comenta: { x: 300, y: 1060, px: 76, maxW: 470 } } });
 }, sfx(k) { R.tamanosSfx(k, OPT); k.play('thud', tEv + 1.5, { f: 70, gain: 0.6 }); } }];

 // ---------- 4 · MONTAJE ----------
 const EP = R.make({ estilo: ESTILO, marca: MARCA, beats: B, loop: 0.5, marcaY: 285 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
