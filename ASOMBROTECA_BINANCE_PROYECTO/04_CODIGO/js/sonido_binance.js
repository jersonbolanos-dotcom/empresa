// =====================================================================================================
// sonido_binance.js — partitura de efectos (scoreSound) y música original (scoreMusic), ambas con el kit
// SOUND original sin modificar (lib/sound.js).
//  · scoreSound(k): efectos puntuales. Se renderiza con { voiceover: true } (efectos algo más bajos, "minor" al 60 %).
//  · scoreMusic(k): música instrumental original en su propio stem. Se renderiza APARTE con { voiceover: false },
//    porque en modo voiceover el kit suprime k.music/k.bed por diseño (no se altera lib/sound.js).
// Tiempos = segundos de la grabación de voz (los mismos de explainer()).
// =====================================================================================================
(function () {
 const S = window.PLR, BN = window.BINANCE, T = BN.T, D = BN.DURATION;
 const { sm, io, eo } = S;
 const when = (f, v, a, b) => { for (let t = a; t <= b; t += 0.001) if (f(t) >= v) return t; return b; };

 function kitHelpers(k) {
  const bwoom = (t, g, dur = 1.4, f = 58) => {
   k.tone(t, { f: [[0, f * 1.7], [0.1, f], [dur, f * 0.72]], dur, gain: 0.5 * g, a: 0.012, hold: dur * 0.15 });
   k.tone(t, { f: f * 2, dur: dur * 0.45, gain: 0.07 * g, a: 0.012 });
   k.noise(t, { dur: 0.6, color: 'brown', filter: 'lowpass', f: [[0, 420], [0.6, 80]], gain: 0.22 * g, a: 0.008, verb: 0.25 });
  };
  const air = (t, dur, g) => { k.noise(t, { dur, color: 'pink', filter: 'bandpass', f: [[0, 450], [dur, 4200]], q: 0.7, gain: 0.13 * g, a: dur * 0.92, verb: 0.35 }); k.tone(t, { f: [[0, 'D3'], [dur, 'D4']], type: 'triangle', dur, gain: 0.025 * g, a: dur * 0.9, filter: 'lowpass', f2: 900 }); };
  const click = (t, g = 1, pan = 0, minor = true) => { k.noise(t, { dur: 0.014, filter: 'bandpass', f: 2300, q: 1.6, gain: 0.2 * g, pan, minor }); k.tone(t, { f: [[0, 420], [0.03, 260]], dur: 0.04, gain: 0.07 * g, pan, minor }); };
  const glide = (t, dur, g, pan = 0, minor = true) => k.noise(t, { dur, color: 'pink', filter: 'lowpass', f: [[0, 160], [dur * 0.5, 720], [dur, 190]], q: 0.9, gain: 0.26 * g, a: dur * 0.45, pan, verb: 0.15, minor });
  const chord = (t, notes, dur, g, minor = false) => notes.forEach((n, i) => {
   const pan = (i - (notes.length - 1) / 2) * 0.22;
   k.tone(t, { f: n, type: 'triangle', dur, gain: 0.05 * g, a: 0.03, hold: dur * 0.3, filter: 'lowpass', f2: [[0, 2200], [dur, 700]], pan, verb: 0.4, minor });
   k.tone(t, { f: k.hz(n) * 1.003, dur, gain: 0.04 * g, a: 0.05, hold: dur * 0.3, pan: -pan, verb: 0.4, minor });
  });
  const ticks = (val, a, b, gap, g, pan) => { let last = -1, prev = val(a); for (let t = a; t <= b; t += 0.002) { const v = val(t); if (v !== prev && t - last >= gap) { click(t, g, pan); last = t; } prev = v; } };
  return { bwoom, air, click, glide, chord, ticks };
 }

 // ---------------- efectos ----------------
 function scoreSound(k) {
  const { bwoom, air, click, glide, chord, ticks } = kitHelpers(k);
  // B01: la luz encuentra el objeto; fecha palabra a palabra
  air(0.05, 1.1, 0.8);
  bwoom(0.9, 0.6, 1.6);
  [T.date, T.date + 0.7, BN.wt(0, '2026,')].forEach((t, i) => click(t, 0.8, (i - 1) * 0.2));
  chord(1.25, ['A3', 'E4'], 1.0, 0.5, true); // anillo se enciende
  click(when((t) => sm(0.6, 1.6, t), 0.6, 0.6, 1.6), 0.6, -0.4); // callout "custodia digital"
  click(T.binance, 0.7, 0.2);
  // B02: reloj + cifra monumental
  glide(T.veinte - 0.6, 0.9, 0.8);
  k.noise(T.veinte, { dur: 0.9, color: 'pink', filter: 'bandpass', f: [[0, 600], [0.9, 2400]], q: 1.4, gain: 0.07, a: 0.6, minor: true });
  click(T.minutos, 0.7, 0);
  ticks((t) => Math.round(6300 * eo(sm(T.seis, T.dolares + 0.2, t)) / 100), T.seis + 0.02, T.dolares + 0.15, 0.085, 0.55, 0);
  air(T.seis - 0.4, 0.6, 0.6);
  bwoom(T.dolares, 1.2, 2.0, 50); chord(T.dolares, ['D3', 'A3', 'D4', 'F4', 'A4'], 1.6, 0.9);
  // B03: no bóveda, no billetes, ¿cómo?
  glide(T.b4 - 0.2, 0.7, 0.7);
  k.noise(T.boveda, { dur: 0.26, filter: 'bandpass', f: [[0, 900], [0.26, 2600]], q: 0.9, gain: 0.13, a: 0.08, pan: -0.4 });
  k.tone(T.boveda + 0.22, { f: 'E3', type: 'triangle', dur: 0.22, gain: 0.18, hold: 0.1, filter: 'lowpass', f2: 900, pan: -0.4 });
  k.noise(T.billetes, { dur: 0.26, filter: 'bandpass', f: [[0, 900], [0.26, 2600]], q: 0.9, gain: 0.13, a: 0.08, pan: 0.4 });
  k.tone(T.billetes + 0.22, { f: 'C3', type: 'triangle', dur: 0.4, gain: 0.18, hold: 0.12, filter: 'lowpass', f2: 800, pan: 0.4 });
  k.play('sparkle', T.entonces + 0.1, { gain: 0.5, n: 8, minor: true }); // desmaterialización
  k.noise(T.entonces, { dur: 1.4, color: 'pink', filter: 'bandpass', f: [[0, 3000], [1.4, 400]], q: 0.8, gain: 0.08, a: 0.2, minor: true });
  bwoom(T.como, 0.6, 1.2, 66);
  // B04: atravesar el cristal; red; tráfico rápido
  air(T.todo, T.billeteras - T.todo + 0.2, 0.9);
  glide(T.billeteras - 0.5, 1.6, 1.0, 0, false);
  click(T.billeteras, 0.8, -0.1); click(T.calientes, 0.8, 0.1);
  for (let i = 0; i < 12; i++) k.play('blip', T.internet - 0.4 + i * 0.07, { f: ['E6', 'B5', 'G6', 'D6'][i % 4], gain: 0.35, pan: Math.sin(i) * 0.6, minor: true });
  for (let i = 0; i < 10; i++) k.play('tick', T.mover + i * 0.11, { gain: 0.35, pan: (i % 2 ? 0.4 : -0.4), minor: true });
  // B05: capas; firma
  glide(T.pero10 - 0.3, 1.0, 0.9);
  click(when((t) => sm(T.movs - 0.2, T.movs + 0.6, t), 0.6, T.movs - 0.2, T.movs + 0.6), 0.7, -0.4);
  k.play('stamp', T.autoriz + 0.05, { gain: 0.45 });
  chord(T.autoriz + 0.05, ['F4', 'C5'], 0.8, 0.4, true);
  click(when((t) => sm(T.seguras - 0.3, T.seguras + 0.5, t), 0.6, T.seguras - 0.3, T.seguras + 0.5), 0.7, 0.4);
  // B06: retiros no autorizados
  glide(T.durante - 0.3, 1.1, 0.9);
  k.noise(T.retiros, { dur: 0.5, color: 'pink', filter: 'bandpass', f: [[0, 1800], [0.5, 500]], q: 1, gain: 0.1, a: 0.1, pan: -0.3 });
  k.play('error', T.autorizado, { gain: 0.55, pan: -0.2 });
  bwoom(T.autorizado, 0.6, 1.2, 46);
  k.tone(T.investiga, { f: [[0, 'A3'], [0.5, 'G#3']], type: 'triangle', dur: 0.8, gain: 0.08, a: 0.2, filter: 'lowpass', f2: 900, minor: true });
  // B07: silencio dramático -> sellado -> deshacer tachado
  air(T.sorpr0 + 0.3, 1.4, 0.7);
  glide(T.sorpr0 + 0.2, 1.4, 0.8);
  k.noise(T.transf, { dur: 0.7, color: 'pink', filter: 'bandpass', f: [[0, 500], [0.7, 2000]], q: 1.2, gain: 0.07, a: 0.5, minor: true });
  k.play('stamp', T.confirmada + 0.02, { gain: 0.8 });
  bwoom(T.confirmada + 0.02, 0.8, 1.6, 54);
  click(T.normalmente + 0.1, 0.7);
  k.noise(T.boton, { dur: 0.45, filter: 'bandpass', f: [[0, 900], [0.45, 2600]], q: 0.9, gain: 0.13, a: 0.15 });
  k.tone(T.deshacer + 0.15, { f: 'E3', type: 'triangle', dur: 0.22, gain: 0.2, hold: 0.1, filter: 'lowpass', f2: 900 });
  k.tone(T.deshacer + 0.29, { f: 'C3', type: 'triangle', dur: 0.45, gain: 0.2, hold: 0.15, filter: 'lowpass', f2: 800 });
  // B08: dispersión: cada llegada = pequeño "tock" (cambio de saldo), rastro = barrido cian
  glide(T.fondos - 0.2, 1.4, 1.0, 0, false);
  BN.GRAPH.nodes.filter((n) => n.hop >= 2).sort((a, b) => a.t1 - b.t1).forEach((n, i, arr) => { if (i % 2 === 0) k.tone(n.t1, { f: [[0, 260 + (n.chain || 0) * 18], [0.1, 140]], dur: 0.14, gain: 0.07, pan: Math.max(-0.7, Math.min(0.7, n.x / 5)), minor: true }); });
  BN.GRAPH.nodes.filter((n) => n.hop === 1).forEach((n) => k.tone(n.t1, { f: [[0, 200], [0.12, 90]], dur: 0.16, gain: 0.1, pan: Math.max(-0.7, Math.min(0.7, n.x / 3)), minor: true }));
  k.noise(T.rastro - 0.2, { dur: 0.9, color: 'pink', filter: 'bandpass', f: [[0, 700], [0.45, 3200], [0.9, 1200]], q: 1.4, gain: 0.08, a: 0.4 });
  chord(T.rastro, ['A3', 'E4', 'B4'], 1.2, 0.5, true);
  click(T.nosig + 0.1, 0.8, 0);
  k.tone(T.recuperar, { f: 'D3', type: 'triangle', dur: 0.5, gain: 0.14, hold: 0.15, filter: 'lowpass', f2: 800, minor: true });
  // B09: carrera: tic-tac del cronómetro; congelamientos
  glide(T.carrera0 - 0.2, 0.9, 0.8);
  for (let t = T.carrera0 + 0.2; t < T.cubrir0 - 0.3; t += 0.5) k.play('tock', t, { f: 900, gain: 0.12, pan: 0.2, minor: true });
  BN.GRAPH.nodes.filter((n) => n.freeze).sort((a, b) => a.freezeT - b.freezeT).forEach((n, i) => { if (i % 2 === 0) k.play('ding', n.freezeT, { f: ['E6', 'G6', 'B6', 'D7'][i % 4], gain: 0.25, pan: Math.max(-0.7, Math.min(0.7, n.x / 5)), minor: true }); });
  bwoom(T.congelar + 0.1, 0.8, 1.4, 62);
  click(T.congelar + 0.4, 0.7, -0.3); click(T.congelar + 0.6, 0.7, 0.3);
  // B10: reservas propias entran (oro)
  glide(T.cubrir0 - 0.3, 1.2, 0.9, 0, false);
  k.play('riser', T.cubriria - 0.2, { dur: 0.9, gain: 0.4 });
  bwoom(T.recursos, 0.7, 1.4, 58);
  k.noise(T.recursos, { dur: 1.6, color: 'pink', filter: 'bandpass', f: [[0, 600], [1.6, 1800]], q: 1, gain: 0.06, a: 0.6, minor: true });
  // B11: 90 % repuesto; atención; ≠ recuperado
  click(T.oct31, 0.8);
  ticks((t) => Math.round(90 * eo(sm(T.noventa - 0.4, T.noventa + 0.5, t)) / 5), T.noventa - 0.38, T.noventa + 0.48, 0.085, 0.55, 0);
  bwoom(T.noventa + 0.5, 1.1, 2.0, 52); chord(T.noventa + 0.5, ['D3', 'A3', 'D4', 'F#4', 'A4'], 1.6, 0.9);
  click(T.repuesto, 0.7, -0.2);
  k.tone(T.atencion, { f: 'A2', type: 'sawtooth', dur: 0.5, gain: 0.08, hold: 0.2, filter: 'lowpass', f2: 700 });
  bwoom(T.atencion, 0.8, 1.0, 44);
  k.play('error', T.recuperado + 0.1, { gain: 0.45 });
  click(T.noventa2, 0.7, -0.4); click(T.noventa2 + 0.2, 0.7, 0.4);
  // B12: lección; el acceso se cierra; barrido a blanco; resolución
  glide(T.leccion0 - 0.2, 1.4, 0.9, 0, false);
  air(T.leccion0 + 0.2, 1.2, 0.6);
  click(T.autoriz2, 0.7, -0.2); click(BN.wt(25, 'comprometida'), 0.8, 0.2);
  click(T.miles, 0.6); click(T.minutos2, 0.8);
  k.play('stamp', T.minutos2 + 0.35, { gain: 0.5 }); // candado
  air(BN.sweep0 - 0.6, 0.7, 0.8);
  k.noise(BN.sweep0, { dur: 0.55, color: 'pink', filter: 'bandpass', f: [[0, 380], [0.27, 3000], [0.55, 900]], q: 0.8, gain: 0.24, a: 0.24, pan: -0.3, verb: 0.3 });
  bwoom(BN.sweep1, 0.55, 1.2, 60);
  ['la', 'ciencia', 'oculta', 'de', 'lo', 'imposible'].forEach((w, i) => click(BN.wt(27, w), 0.6, (i - 2.5) * 0.12));
  chord(BN.wt(27, 'imposible'), ['D2', 'A2', 'D3', 'F#3', 'A3', 'E4'], Math.min(1.6, D - BN.wt(27, 'imposible') - 0.05), 0.9);
 }

 // ---------------- música original (stem aparte) ----------------
 function scoreMusic(k) {
  const Dm = [['D3', 'A3', 'C4', 'F4'], ['Bb2', 'F3', 'A3', 'D4'], ['G2', 'D3', 'F3', 'Bb3'], ['A2', 'E3', 'G3', 'C#4']];
  const DmB = [['D3', 'F3', 'A3', 'E4'], ['Bb2', 'D3', 'F3', 'C4'], ['F2', 'C3', 'A3', 'E4'], ['C3', 'G3', 'Bb3', 'E4']];
  const GOLDC = [['D3', 'F#3', 'A3', 'E4'], ['B2', 'F#3', 'D4', 'A4'], ['G2', 'D3', 'B3', 'F#4'], ['A2', 'E3', 'C#4', 'E4']];
  const fadeTail = (t0, t1) => Math.max(0.2, t1 - t0);
  // gancho: pad oscuro
  k.music('pad', 0.0, T.veinte - 0.6, { bpm: 64, gain: 0.5, chords: [Dm[0], Dm[1]] });
  // magnitud: pulso
  k.music('pulse', T.veinte - 0.6, T.b4 - 0.1, { bpm: 64, gain: 0.32, chords: [Dm[0], Dm[3]] });
  // misterio: solo un dron grave (silencio con intención)
  k.tone(T.b4, { f: 'D2', type: 'sine', dur: fadeTail(T.b4, T.todo), gain: 0.06, a: 0.6, hold: (T.todo - T.b4) * 0.6, bus: 'music' });
  // billetera caliente -> autorización -> ataque
  k.music('pad', T.todo - 0.3, T.pero10, { bpm: 72, gain: 0.42, chords: [DmB[0], DmB[1]] });
  k.music('pulse', T.pero10, T.sorpr0 - 0.2, { bpm: 72, gain: 0.3, chords: [DmB[2], DmB[3], Dm[3]] });
  // "lo más sorprendente": hueco; vuelve con el sellado
  k.music('pulse', T.transf, T.carrera0 - 0.2, { bpm: 72, gain: 0.3, chords: [Dm[0], Dm[2], Dm[1], Dm[3]] });
  // carrera contra el tiempo: más rápido
  k.music('pulse', T.carrera0, T.cubrir0 - 0.1, { bpm: 96, gain: 0.3, chords: [Dm[0], Dm[1], Dm[3]] });
  // reposición con fondos propios: cálido (mayor)
  k.music('pad', T.cubrir0, T.atencion - 0.05, { bpm: 64, gain: 0.42, chords: [GOLDC[0], GOLDC[1], GOLDC[2]] });
  // "Pero atención": corte seco; luego pad oscuro hasta la lección
  k.music('pad', T.eso, T.asombro - 0.1, { bpm: 64, gain: 0.4, chords: [Dm[0], Dm[1], Dm[2], Dm[3]] });
  // cierre: resolución en mayor
  k.music('pad', T.asombro - 0.2, D, { bpm: 64, gain: 0.45, chords: [GOLDC[0]] });
 }

 window.scoreSound = scoreSound;
 window.scoreMusic = scoreMusic;
})();
