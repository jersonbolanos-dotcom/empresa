// =====================================================================================================
// episodio.js — «¿Qué es más viejo: el fax o el teléfono?» · FORMATO: LÍNEA DEL TIEMPO · Plantilla Asombroteca SIN_VOZ
// Fichas tipo dossier (P.dossier) clavadas con chincheta a lo largo de una línea; un sello (P.stamp) golpea cada año.
// Las ilustraciones son reconstrucciones esquemáticas (no fotos), dibujadas con R.lamina. Fuentes en FUENTES_Y_DECISIONES.md.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;
 const ESTILO = 'asombroteca', MARCA = 'ASOMBROTECA';

 // ---------- 1 · ILUSTRACIONES (apoyadas en una mesa o en el suelo dentro de la lámina) ----------
 const suelo = (c, s) => { c.fillStyle = '#7d7468'; c.fillRect(0, s * 0.8, s, s * 0.2); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(0, s * 0.8, s, 4); };
 const sombra = (c, x, y, rx) => { c.fillStyle = 'rgba(0,0,0,0.3)'; c.beginPath(); c.ellipse(x, y, rx, rx * 0.12, 0, 0, TAU); c.fill(); };
 const LAM = {
  fax: (c, s) => { suelo(c, s); sombra(c, s / 2, s * 0.8, s * 0.36); c.fillStyle = '#4a3a2a'; c.fillRect(s * 0.16, s * 0.62, s * 0.68, s * 0.18); c.fillStyle = '#3a2c1f'; c.fillRect(s * 0.2, s * 0.22, s * 0.05, s * 0.4); c.fillRect(s * 0.75, s * 0.22, s * 0.05, s * 0.4); c.fillRect(s * 0.2, s * 0.2, s * 0.6, s * 0.05);
   c.strokeStyle = '#2a2018'; c.lineWidth = s * 0.012; c.beginPath(); c.moveTo(s * 0.5, s * 0.25); c.lineTo(s * 0.44, s * 0.5); c.stroke(); c.fillStyle = '#b08a3a'; c.beginPath(); c.arc(s * 0.44, s * 0.52, s * 0.04, 0, TAU); c.fill();
   c.fillStyle = '#efe9da'; c.fillRect(s * 0.3, s * 0.55, s * 0.4, s * 0.07); c.fillStyle = '#333'; for (let i = 0; i < 6; i++) c.fillRect(s * 0.33 + i * s * 0.06, s * 0.57, s * 0.03, s * 0.025); },
  telefono: (c, s) => { suelo(c, s); sombra(c, s / 2, s * 0.8, s * 0.3); c.fillStyle = '#5b4026'; c.fillRect(s * 0.25, s * 0.66, s * 0.5, s * 0.14); c.fillStyle = '#3a2a1a'; c.fillRect(s * 0.47, s * 0.32, s * 0.06, s * 0.34);
   c.fillStyle = '#2b2620'; c.beginPath(); c.moveTo(s * 0.5, s * 0.36); c.lineTo(s * 0.3, s * 0.22); c.lineTo(s * 0.3, s * 0.42); c.closePath(); c.fill(); c.fillStyle = '#8a7a60'; c.beginPath(); c.ellipse(s * 0.3, s * 0.32, s * 0.03, s * 0.1, 0, 0, TAU); c.fill();
   c.strokeStyle = '#222'; c.lineWidth = s * 0.012; c.beginPath(); c.moveTo(s * 0.75, s * 0.72); c.bezierCurveTo(s * 0.9, s * 0.72, s * 0.85, s * 0.8, s * 0.98, s * 0.79); c.stroke(); },
  auto: (c, s) => { suelo(c, s); sombra(c, s / 2, s * 0.8, s * 0.42); const wheel = (x, r) => { c.strokeStyle = '#222'; c.lineWidth = s * 0.018; c.beginPath(); c.arc(x, s * 0.8 - r, r, 0, TAU); c.stroke(); for (let k = 0; k < 8; k++) { const a = k * TAU / 8; c.beginPath(); c.moveTo(x, s * 0.8 - r); c.lineTo(x + Math.cos(a) * r, s * 0.8 - r + Math.sin(a) * r); c.lineWidth = s * 0.006; c.stroke(); } };
   c.fillStyle = '#3a3a3a'; c.fillRect(s * 0.22, s * 0.5, s * 0.5, s * 0.05); c.fillStyle = '#5b4026'; c.fillRect(s * 0.3, s * 0.4, s * 0.26, s * 0.1); c.fillStyle = '#2b2620'; c.fillRect(s * 0.32, s * 0.3, s * 0.04, s * 0.1); c.strokeStyle = '#2b2620'; c.lineWidth = s * 0.014; c.beginPath(); c.moveTo(s * 0.7, s * 0.52); c.lineTo(s * 0.66, s * 0.3); c.lineTo(s * 0.6, s * 0.3); c.stroke();
   wheel(s * 0.32, s * 0.17); wheel(s * 0.75, s * 0.1); },
  avion: (c, s) => { suelo(c, s); sombra(c, s / 2, s * 0.8, s * 0.42); c.strokeStyle = '#2a2a2a'; c.lineWidth = s * 0.01; c.fillStyle = '#d8d0bd'; c.fillRect(s * 0.12, s * 0.4, s * 0.62, s * 0.035); c.fillRect(s * 0.12, s * 0.56, s * 0.62, s * 0.035);
   for (let i = 0; i < 6; i++) { const x = s * (0.14 + i * 0.115); c.beginPath(); c.moveTo(x, s * 0.43); c.lineTo(x, s * 0.56); c.stroke(); } c.fillRect(s * 0.8, s * 0.44, s * 0.1, s * 0.03); c.beginPath(); c.moveTo(s * 0.74, s * 0.47); c.lineTo(s * 0.8, s * 0.46); c.stroke();
   c.fillRect(s * 0.04, s * 0.42, s * 0.025, s * 0.17); c.beginPath(); c.moveTo(s * 0.065, s * 0.5); c.lineTo(s * 0.12, s * 0.5); c.stroke(); c.beginPath(); c.moveTo(s * 0.3, s * 0.6); c.lineTo(s * 0.28, s * 0.8); c.moveTo(s * 0.6, s * 0.6); c.lineTo(s * 0.62, s * 0.8); c.moveTo(s * 0.2, s * 0.8); c.lineTo(s * 0.7, s * 0.8); c.stroke(); },
  internet: (c, s) => { suelo(c, s); const term = (x) => { sombra(c, x, s * 0.8, s * 0.17); c.fillStyle = '#c8c2b2'; c.fillRect(x - s * 0.15, s * 0.42, s * 0.3, s * 0.38); c.fillStyle = '#1c1f1c'; c.fillRect(x - s * 0.11, s * 0.47, s * 0.22, s * 0.16); c.fillStyle = '#9be59b'; c.fillRect(x - s * 0.08, s * 0.51, s * 0.1, s * 0.02); c.fillRect(x - s * 0.08, s * 0.55, s * 0.14, s * 0.02); c.fillStyle = '#8a8476'; c.fillRect(x - s * 0.12, s * 0.68, s * 0.24, s * 0.06); };
   term(s * 0.24); term(s * 0.76); c.strokeStyle = '#333'; c.lineWidth = s * 0.012; c.setLineDash([s * 0.03, s * 0.02]); c.beginPath(); c.moveTo(s * 0.39, s * 0.5); c.quadraticCurveTo(s * 0.5, s * 0.3, s * 0.61, s * 0.5); c.stroke(); c.setLineDash([]); },
 };
 const ITEMS = [['fax', 1843, 'El fax'], ['telefono', 1876, 'El teléfono'], ['auto', 1886, 'El automóvil'], ['avion', 1903, 'El avión'], ['internet', 1969, 'Internet']]
  .map(([k, anio, titulo]) => ({ anio, titulo, t0: R.t(k), img: R.lamina(LAM[k], 400) }));
 const LT = { items: ITEMS, x: 130, cx: 570, w: 540, gap: 1260, yFoco: 870, tFin: R.t('gana') - 0.1, dFin: 1.0 };

 // ---------- 2 · ESCENA ----------
 const B = [{ t0: 0, t1: D, in: { type: 'cut' }, draw(ctx, t) {
  R.fondo(ctx, t, { gy: 900 });
  const lt = R.lineaTiempo(ctx, t, LT);
  // al final: el fax (1843) contra el teléfono (1876): 33 años de diferencia
  const g = sm(R.t('gana') + 0.6, R.t('gana') + 1.0, t); if (g > 0) R.texto(ctx, '+33 años', t, R.t('gana') + 0.8, null, { x: 570, y: 1265, px: 64, font: 'Nunito', fw: 900, anim: 'golpe', col: '#ffd54a', fadeOut: false });
  R.titulares(ctx, t, { y: 340 });
 }, sfx(k) { R.lineaTiempoSfx(k, LT); FX.sello(k, R.t('gana') + 0.8); } }];

 // ---------- 3 · MONTAJE ----------
 const EP = R.make({ estilo: ESTILO, marca: MARCA, beats: B, loop: 0.5, marcaY: 1390 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
