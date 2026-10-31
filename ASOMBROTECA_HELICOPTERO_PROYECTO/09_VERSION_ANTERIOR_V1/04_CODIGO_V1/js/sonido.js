// =====================================================================================================
// sonido.js — efectos con el kit SOUND original (voiceover:true) y música original en stem aparte (voiceover:false).
// El kit no trae sonido de rotor: se sintetiza con pulsos graves (paso de pala) cuya cadencia sigue a omega(t),
// el silbido de turbina que se apaga en la falla, y el aire que atraviesa el disco en el descenso.
// =====================================================================================================
(function () {
 const E = window.EPISODIO, T = E.T, TR = E.TR, D = E.DURATION, om = E.omega;
 function scoreSound(k) {
  // --- rotor: pulsos de paso de pala; más presentes en exteriores, discretos en diagramas
  const exterior = (t) => t < TR.dive[0] || (t > TR.pull[0] && t < TR.energy[1]) || t > TR.field[0];
  let t = 0.02;
  while (t < D - 0.2) {
   const w = om(t); if (w < 0.04) break;
   const g = (exterior(t) ? 0.55 : 0.28) * Math.min(1, w * 1.2);
   k.noise(t, { dur: 0.075, color: 'brown', filter: 'lowpass', f: 260, gain: 0.32 * g, a: 0.006, minor: true });
   k.tone(t, { f: [[0, 92], [0.06, 58]], dur: 0.08, gain: 0.12 * g, minor: true });
   t += 1 / (8.5 * Math.max(0.25, w));
  }
  // --- turbina: silbido que se apaga con la falla (sin explosión)
  k.tone(0, { f: [[0, 1650], [T.motor - 0.05, 1650], [T.apaga + 0.6, 260]], type: 'sawtooth', dur: T.apaga + 0.7, gain: 0.035, a: 0.3, hold: T.motor, filter: 'lowpass', f2: 2600 });
  k.noise(0, { dur: T.apaga + 0.6, color: 'pink', filter: 'bandpass', f: [[0, 3000], [T.motor, 3000], [T.apaga + 0.5, 600]], q: 1.4, gain: 0.05, a: 0.3, hold: T.motor });
  k.play('error', T.apaga - 0.05, { gain: 0.5 }); // alerta breve de cabina
  k.play('blip', T.apaga + 0.35, { f: 'E6', gain: 0.4, minor: true }); // «el rotor sigue girando»
  // --- ¿se desploma? / no necesariamente
  k.play('whoosh', T.desploma - 0.3, { dur: 0.8, gain: 0.45 }); // la cámara se aleja
  k.tone(T.desploma + 0.2, { f: [[0, 700], [0.9, 180]], type: 'triangle', dur: 0.9, gain: 0.08, filter: 'lowpass', f2: 1600, minor: true }); // trayectoria de caída
  k.play('buzz', T.no, { f: 92, dur: 0.25, gain: 0.35 }); // tachado
  k.play('stroke', T.necesar, { material: 'marker', dur: 0.8, gain: 0.35, minor: true }); // trayectoria azul
  k.play('pop', T.necesar + 0.3, { f: 640, gain: 0.4 });
  // --- inmersión en el tren de potencia
  k.play('riser', TR.dive[0], { dur: TR.dive[1] - TR.dive[0], gain: 0.4 }); k.play('whoosh', TR.dive[0] + 0.1, { dur: 0.6, top: 3600, gain: 0.5 });
  k.play('pop', T.aunque + 0.3, { f: 700, gain: 0.35 });
  k.play('tock', T.seguir, { f: 900, gain: 0.45 }); k.play('click', T.seguir + 0.05, { gain: 0.6 });
  for (let i = 0; i < 10; i++) k.play('tick', T.sin5 + i * 0.12, { f: 3800, gain: 0.3, minor: true }); // trinquete de la rueda libre
  k.play('stamp', T.motor5 + 0.02, { gain: 0.5 }); // MOTOR ≠ ROTOR
  // --- match-cut al disco y revelación
  k.play('swish', TR.match[0] + 0.1, { dur: 0.3, gain: 0.45 }); k.play('whoosh', TR.match[0], { dur: 0.6, gain: 0.35 });
  k.play('pop', T.secreto, { f: 560, gain: 0.35 });
  k.play('riser', T.autorrot - 0.9, { dur: 0.9, gain: 0.35 });
  k.play('sparkle', T.autorrot, { gain: 0.6, n: 8 }); k.play('ding', T.autorrot + 0.02, { f: 'E6', gain: 0.45 });
  // --- barrido de pala y paso colectivo
  k.play('whoosh', TR.wipe[0], { dur: TR.wipe[1] - TR.wipe[0] + 0.1, top: 2200, gain: 0.6, pan: -0.4 });
  k.play('pop', T.piloto7, { f: 520, gain: 0.3 });
  k.play('roller', T.reducir, { dur: 0.7, gain: 0.35 }); k.play('tock', T.reducir + 0.75, { f: 600, gain: 0.45 }); // palanca baja y se asienta
  k.play('pop', T.reducir + 0.05, { f: 600, gain: 0.35 });
  // --- descenso: aire que atraviesa el disco
  k.play('whoosh', TR.pull[0], { dur: 0.7, gain: 0.45 });
  k.play('pop', T.comienza, { f: 480, gain: 0.35 });
  k.noise(T.desc0, { dur: TR.energy[1] - T.desc0, color: 'pink', filter: 'bandpass', f: [[0, 500], [T.aire - T.desc0, 700], [TR.energy[1] - T.desc0, 900]], q: 0.7, gain: 0.08, a: 1.2, hold: TR.energy[1] - T.desc0 - 2.5, minor: true });
  k.play('riser', T.aire - 0.2, { dur: 1.1, gain: 0.35 }); // el flujo relativo sube
  k.play('pop', T.atraviesa, { f: 700, gain: 0.35 });
  k.play('ding', T.mantiene, { f: 'B5', gain: 0.25, minor: true });
  k.play('pop', T.incluso, { f: 380, gain: 0.3 });
  // --- energía
  k.play('swish', TR.energy[0], { dur: 0.4, gain: 0.35 });
  [T.energia, T.descenso, T.rotor12].forEach((tt, i) => { k.play('pop', tt, { f: 520 + i * 140, gain: 0.45 }); k.play('stroke', tt - 0.2, { material: 'pen', dur: 0.4, gain: 0.25, minor: true }); });
  k.play('success', T.movim + 0.1, { gain: 0.35 });
  // --- aproximación, flare y contacto
  k.play('whoosh', TR.field[0], { dur: 0.7, gain: 0.4 });
  k.play('whoosh', T.aprovechar, { dur: 1.2, top: 1800, gain: 0.45 }); k.play('pop', T.aprovechar + 0.02, { f: 640, gain: 0.45 });
  k.play('thud', T.aterrizaje, { f: 110, gain: 0.55 }); k.noise(T.aterrizaje, { dur: 1.2, color: 'brown', filter: 'lowpass', f: [[0, 900], [1.2, 200]], gain: 0.12, a: 0.02 }); // patines + polvo
  k.play('pop', T.aterrizaje + 0.05, { f: 760, gain: 0.35 });
  // --- límites y cierre
  k.play('error', T.pero14, { f: 'C4', gain: 0.3 });
  [T.altura15, T.velocidad, T.reaccion].forEach((tt, i) => k.play('blip', tt, { f: ['C6', 'E6', 'G6'][i], gain: 0.45 }));
  k.play('stamp', T.significa, { gain: 0.45 });
  k.play('success', T.control + 0.1, { gain: 0.45 });
  k.play('ding', T.asombro, { f: 'A5', gain: 0.3, minor: true });
 }
 function scoreMusic(k) {
  const Am = [['A2', 'E3', 'C4', 'G4'], ['F2', 'C3', 'A3', 'E4'], ['C3', 'G3', 'E4', 'B4'], ['G2', 'D3', 'B3', 'F#4']];
  const Up = [['D3', 'A3', 'F#4', 'E5'], ['B2', 'F#3', 'D4', 'A4'], ['G2', 'D3', 'B3', 'F#4'], ['A2', 'E3', 'C#4', 'G#4']];
  k.music('pad', 0, T.motor, { bpm: 80, gain: 0.45, chords: [Am[0], Am[1]] });
  // silencio tenso tras la falla; vuelve con «no necesariamente»
  k.music('pad', T.necesar, T.autorrot - 0.2, { bpm: 80, gain: 0.4, chords: [Am[2], Am[3]] });
  k.music('pulse', T.autorrot, TR.field[0], { bpm: 88, gain: 0.3, chords: Up });
  k.music('pad', TR.field[0], T.pero14, { bpm: 80, gain: 0.42, chords: [Up[0], Up[1]] });
  k.music('pad', T.pero14 + 0.2, D, { bpm: 80, gain: 0.45, chords: [Am[1], Up[2], Up[0]] });
 }
 window.scoreSound = scoreSound; window.scoreMusic = scoreMusic;
})();
