// =====================================================================================================
// episodio.js — BASE PARA UN VIDEO NUEVO con la PLANTILLA ASOMBROTECA
// 1) Genera js/datos.js (window.ALIGN) con tools/preparar_voz.sh + alinear.py + subtitulos.py (ver 00_LEEME_PRIMERO.md).
// 2) Rellena la tabla T con las palabras de la voz donde debe pasar algo: wt(número_de_tramo, 'palabra').
// 3) Escribe un beat por idea: PROBLEMA → EXPLICACIÓN → CASO/CONSECUENCIA → SOLUCIÓN/LECCIÓN → CIERRE.
//    Cada beat: { t0, t1, in: {type:'iris'|'zoom'|'slide'|'rise'|'fade', d, x, y}, draw(ctx, t), sfx(k) }.
//    Regla: algo cambia cada 1–2 s, siempre en una palabra de la voz, y cada cambio tiene su sonido (FX.*).
// 4) Elige piel: 'plana' (ilustración cálida) u 'oscura' (editor técnico) y la lista de palabras clave.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 // tiempo (s) en que se dice una palabra: wt(tramo, 'palabra', n-ésima aparición)
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra no encontrada: ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const LAST = A.segments.length - 1;

 // ---------- 1 · TIEMPOS (cámbialos por palabras de TU voz) ----------
 const T = {
  inicio: SG(0).s,
  // ejemplo: dato: wt(2, 'millones'), giro: wt(5, 'pero'),
  cierre: SG(Math.max(0, LAST - 1)).s,   // normalmente «Asombroteca.»
  lema: SG(LAST).s,                       // «La ciencia oculta de lo imposible.»
 };
 const mitad = (SG(0).s + T.cierre) / 2;

 // ---------- 2 · BEATS ----------
 const B = [];
 // PROBLEMA / GANCHO (0–2 s ya debe pasar algo)
 B.push({ t0: 0, t1: mitad, draw(ctx, t) {
  ctx.fillStyle = PL.SKINS.plana.c.ink; ctx.fillRect(0, 0, W, HH);
  P.bubbles(ctx, 0, 0, W, HH, t, 1, 30, 0.6);
  P.pill(ctx, 'EL PROBLEMA', 540, 520, 40, t, 0.2, { bg: '#e8505b', fg: '#ffffff' });
  P.onoma(ctx, '¿POR QUÉ?', 540, 900, 120, t, 0.4, mitad, { c: '#f0b90b' });
  P.counter(ctx, 540, 1250, 120, t, 1.0, 2.0, 0, 100, { box: '#ffffff', c: '#1d1b3a', suffix: ' %' }); // ⚠ sólo cifras verificadas
 }, sfx(k) { FX.aparece(k, 0.2); FX.onomatopeya(k, 0.4); FX.contador(k, 1.0, 2.0, 0, 100); } });
 // EXPLICACIÓN → SOLUCIÓN (sustituye por tus escenas)
 B.push({ t0: mitad, t1: T.cierre - 0.3, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  ctx.fillStyle = '#25304a'; ctx.fillRect(0, 0, W, HH);
  const t0 = mitad + 0.4;
  P.arrow(ctx, 200, 960, 880, 960, win(t, t0, t0 + 0.5), '#3fa9f5', 30);
  P.bubble(ctx, 300, 700, 240, 190, t, t0 + 0.6, (x, y) => P.cross(ctx, x, y, 120, win(t, t0 + 0.8, t0 + 1.1)), { tailX: 0 });
  P.withPop(ctx, t, t0 + 1.4, 780, 700, () => P.shield(ctx, 780, 700, 90, '#2fbf71', win(t, t0 + 1.6, t0 + 2.0)));
  P.pill(ctx, 'LA SOLUCIÓN', 540, 1300, 40, t, t0 + 1.6, { bg: '#2fbf71', fg: '#ffffff' });
 }, sfx(k) { const t0 = mitad + 0.4; FX.flecha(k, t0); FX.aparece(k, t0 + 0.6); FX.tachado(k, t0 + 0.8); FX.aparece(k, t0 + 1.4); FX.correcto(k, t0 + 1.6); } });
 // CIERRE (igual en todos los videos)
 B.push({ t0: T.cierre - 0.3, t1: DURATION + 1, in: { type: 'iris', d: 0.6, x: 540, y: 960 }, draw(ctx, t) {
  ctx.fillStyle = '#1d1b3a'; ctx.fillRect(0, 0, W, HH);
  const R = H.rng(9); for (let i = 0; i < 20; i++) { ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.arc(R() * W, R() * HH, R.range(30, 110), 0, TAU); ctx.fill(); }
  P.withPop(ctx, t, T.cierre + 0.1, 540, 1000, () => { P.rr(ctx, 110, 900, 860, 220, 40, '#ffffff', { sy: 16 }); P.text(ctx, 'ASOMBROTECA', 540, 990, 96, '#1d1b3a', { kind: 'title' }); P.text(ctx, 'la ciencia oculta de lo imposible', 540, 1068, 34, '#5a5790'); });
  const press = win(t, T.lema + 1.3, T.lema + 1.5), done = t > T.lema + 1.45;
  P.withPop(ctx, t, T.lema + 0.4, 540, 1290, () => { P.rr(ctx, 330, 1240, 420, 100, 50, done ? '#2fbf71' : '#f0b90b', { sy: 10 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 1292, 44, '#1d1b3a'); });
  if (t > T.lema + 0.7) P.finger(ctx, 610, lerp(1700, 1310, E.out(win(t, T.lema + 0.7, T.lema + 1.3))), 110, press * (1 - win(t, T.lema + 1.6, T.lema + 1.9)));
 }, sfx(k) { FX.sello(k, T.cierre + 0.1); FX.aparece(k, T.lema + 0.4, 700); FX.clic(k, T.lema + 1.45); k.play('ding', T.lema + 1.5, { f: 'A5', gain: 0.3 }); } });

 // ---------- 3 · EPISODIO ----------
 const EP = PL.make({
  skin: 'plana',              // 'plana' | 'oscura'
  align: A, duration: DURATION, beats: B,
  keywords: ['Asombroteca'],  // palabras con recuadro de selección; ['palabra', t0, t1] limita el recuadro a un tramo
  capY: 300,
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 200, gain: 0.04, a: 1, hold: DURATION - 2 }); },
  music(k) { k.music('pad', 0, DURATION, { bpm: 80, gain: 0.35, chords: [['C3', 'G3', 'E4', 'B4'], ['A2', 'E3', 'C4', 'G4'], ['F2', 'C3', 'A3', 'E4'], ['G2', 'D3', 'B3', 'F4']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
