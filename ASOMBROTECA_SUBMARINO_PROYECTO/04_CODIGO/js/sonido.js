// =====================================================================================================
// sonido.js — efectos con el kit SOUND original (voiceover:true) + música original en stem aparte (voiceover:false).
// 1) Plotter: penDown / motor / plot / letter tomados del explainerSound() del estilo Engineering Blueprint;
//    se programan AUTOMÁTICAMENTE a partir de los trazos temporizados de la historia (cada línea = un movimiento).
// 2) Diseño sonoro del episodio (sintetizado, el kit no trae sonido submarino): ambiente oceánico, sonar,
//    alarma en «falla», válvulas, agua que entra, aire comprimido, burbujas, crujidos del casco, presión.
// 3) Silencio respetuoso en «129 personas… perdieron la vida»: sólo el plotter, muy bajo, sin golpes ni música.
// =====================================================================================================
(function () {
 const E = window.EPISODIO, T = E.T, D = E.DURATION;
 function scoreSound(k) {
  const LV = 0.5;
  const rnd = (i) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
  const penDown = (t, g = 1, pan = 0) => { k.noise(t, { dur: 0.02, filter: 'bandpass', f: 1300, q: 1.5, gain: 0.25 * g, a: 0.001, pan, minor: true }); k.tone(t, { f: [[0, 180], [0.03, 110]], dur: 0.045, gain: 0.1 * g, pan, minor: true }); };
  const penUp = (t, g = 1, pan = 0) => k.noise(t, { dur: 0.012, filter: 'bandpass', f: 1900, q: 2, gain: 0.12 * g, a: 0.001, pan, minor: true });
  const motor = (t, d, f, g = 1, pan = 0) => { k.tone(t, { f, type: 'square', dur: d, gain: 0.03 * g, a: 0.012, hold: d * 0.75, filter: 'lowpass', f2: 950, q: 0.7, pan, minor: true }); k.tone(t, { f: f / 2, type: 'triangle', dur: d, gain: 0.05 * g, a: 0.012, hold: d * 0.75, pan, minor: true }); };
  const plot = (a, b, g = 1, pan = 0) => { const d = Math.max(0.03, b - a); g *= LV; const f = 200 + Math.round(rnd(a * 100) * 6) * 25; penDown(a, g, pan); motor(a + 0.01, d, f, g, pan); k.noise(a, { dur: d, filter: 'bandpass', f: 2800, q: 0.9, gain: 0.03 * g, a: 0.02, hold: d * 0.7, pan, minor: true }); penUp(b, g, pan); };
  const letter = (s, a, b, g = 0.9, pan = 0) => { g *= LV; const n = s.length, step = (b - a) / n, stride = Math.max(1, Math.ceil(n / (b - a) / 20)); for (let i = 0; i < n; i++) { if (s[i] === ' ' || i % stride) continue; const t = a + step * i, c = s.charCodeAt(i); k.noise(t, { dur: 0.012, filter: 'bandpass', f: 1500, q: 1.6, gain: 0.2 * g, a: 0.001, pan, minor: true }); motor(t + 0.005, Math.min(0.06, step * stride * 0.75), 220 + (c % 5) * 30, 0.8 * g, pan); } };
  // ---- plotter automático: cada trazo temporizado de la lámina suena como un movimiento del plotter
  const quiet = (t) => (t > T.las12 - 0.2 && t < T.oceano13 - 0.1 ? 0.45 : 1); // respeto en «129»
  const items = E.story(D - 0.01).filter((it) => !it.inst && it.b > it.a && it.a >= 0);
  items.sort((x, y) => x.a - y.a);
  let lastA = -1;
  for (const it of items) {
   if (it.a - lastA < 0.035) continue; lastA = it.a; // no apilar movimientos simultáneos
   const g = quiet(it.a) * (it.role === 'water' || it.role === 'cl' ? 0.5 : 1);
   if (it.k === 'text') letter(it.s.toUpperCase(), it.a, it.b, 0.9 * g); else plot(it.a, it.b, g * (it.w >= 4 ? 1 : 0.75));
  }
  // ---- ambiente oceánico profundo (sustituye al bed 'room': en voiceover los beds se omiten)
  k.noise(0, { dur: T.las12 - 0.3, color: 'brown', filter: 'lowpass', f: 180, gain: 0.07, a: 1.5, hold: T.las12 - 2.4 });
  k.noise(T.oceano13 - 0.3, { dur: D - T.oceano13 + 0.3, color: 'brown', filter: 'lowpass', f: 160, gain: 0.05, a: 1.5, hold: D - T.oceano13 - 2.2 });
  // ---- sonar: pings con eco; dos al inicio, uno al presentar el Thresher
  const ping = (t, g = 1, pan = 0) => { for (let e = 0; e < 3; e++) k.tone(t + e * 0.42, { f: 1180, type: 'sine', dur: 1.1, gain: 0.12 * g * Math.pow(0.42, e), a: 0.004, pan: e ? -pan : pan, minor: e > 0 }); };
  ping(0.12, 1); ping(T.oceano + 0.3, 0.8, 0.2); ping(T.uss - 0.3, 0.7);
  // ---- algo falla: alarma de a bordo, corta (dos tonos)
  for (let i = 0; i < 3; i++) { k.tone(T.falla1 - 0.08 + i * 0.36, { f: [[0, 760], [0.16, 620]], type: 'square', dur: 0.3, gain: 0.05, filter: 'lowpass', f2: 1800, a: 0.01 }); }
  k.play('stamp', T.falla1 - 0.1, { gain: 0.45 });
  // ---- empieza a hundirse: barrido grave descendente + crujido
  k.tone(T.comienza, { f: [[0, 110], [1.6, 48]], type: 'triangle', dur: 1.7, gain: 0.14, a: 0.1 });
  k.play('whoosh', T.hundirse - 0.2, { dur: 1.0, top: 900, gain: 0.35 });
  // ---- no responde: dos intentos fallidos (clunk de mando sin efecto) + tachado
  k.play('tock', T.regresar + 0.2, { f: 300, gain: 0.4 }); k.play('tock', T.superficie + 0.2, { f: 280, gain: 0.35 });
  k.play('buzz', T.noresp, { f: 90, dur: 0.3, gain: 0.35 });
  // ---- transición a la sección B-B
  k.play('whoosh', T.entender - 0.3, { dur: 0.8, gain: 0.4 });
  k.play('pop', T.tanques4, { f: 520, gain: 0.35 });
  // ---- inmersión: válvulas de ventilación (clunk metálico), agua que entra, aire que sale burbujeando
  const clunk = (t, g = 1) => { k.play('thud', t, { f: 140, gain: 0.4 * g }); k.tone(t, { f: [[0, 900], [0.08, 620]], type: 'triangle', dur: 0.12, gain: 0.07 * g }); };
  clunk(T.sumergirse); clunk(T.sumergirse + 0.18, 0.8);
  k.noise(T.permite, { dur: T.aumentando + 1.0 - T.permite, color: 'pink', filter: 'lowpass', f: [[0, 400], [1.0, 1300], [T.aumentando + 1.0 - T.permite, 500]], gain: 0.12, a: 0.4, hold: T.aumentando - T.permite });
  const bubbles = (t0, t1, rate, g = 1, seed = 1) => { let i = 0; for (let t = t0; t < t1; t += 1 / rate) { const f = 380 + rnd(seed + i) * 700; k.tone(t + rnd(seed * 3 + i) * 0.05, { f: [[0, f], [0.06, f * 1.7]], type: 'sine', dur: 0.07, gain: 0.05 * g, a: 0.004, pan: rnd(i + seed) - 0.5, minor: true }); i++; } };
  bubbles(T.sumergirse + 0.3, T.peso + 0.6, 9, 1, 7);
  k.play('tock', T.peso, { f: 220, gain: 0.4 });
  // ---- subir: válvula de soplado, siseo de aire comprimido, agua expulsada
  clunk(T.aire6 - 0.15);
  k.noise(T.aire6, { dur: T.expulsar6 + 1.1 - T.aire6, color: 'white', filter: 'highpass', f: [[0, 2500], [0.3, 3800], [T.expulsar6 + 1.1 - T.aire6, 2000]], gain: 0.07, a: 0.05, hold: T.expulsar6 + 0.6 - T.aire6 });
  k.noise(T.expulsar6 - 0.2, { dur: 1.4, color: 'pink', filter: 'lowpass', f: [[0, 1200], [1.4, 300]], gain: 0.1, a: 0.1 });
  bubbles(T.expulsar6, T.expulsar6 + 1.2, 14, 1.1, 21);
  k.play('success', T.expulsar6 + 0.6, { gain: 0.2, minor: true });
  // ---- ¿y si falla?: el siseo se corta, tachado rojo
  k.play('error', T.falla7, { f: 'C4', gain: 0.35 });
  k.play('stamp', T.emergencia7, { gain: 0.35 });
  // ---- 1963: historia real
  k.play('whoosh', T.en1963 - 0.4, { dur: 0.9, gain: 0.4 });
  k.play('stamp', T.y1963, { gain: 0.55 });
  k.play('thud', T.hundio, { f: 70, gain: 0.35 });
  // ---- cadena de fallos: cada bloque, un relé; el último en rojo
  [T.posible + 0.3, T.propulsion - 0.1, T.dificult + 0.2].forEach((t, i) => k.play('tock', t, { f: 520 - i * 90, gain: 0.4 }));
  k.play('buzz', T.lastre9 - 0.1, { f: 80, dur: 0.35, gain: 0.3 });
  // ---- presión: retumbo creciente + crujidos del casco; al límite, golpe sordo (sin explosión)
  k.play('whoosh', T.medida - 0.3, { dur: 0.8, gain: 0.35 });
  k.noise(T.medida, { dur: T.soportarla + 0.4 - T.medida, color: 'brown', filter: 'lowpass', f: [[0, 120], [T.soportarla - T.medida, 320]], gain: 0.16, a: T.soportarla - T.medida - 0.5, hold: 0.2 });
  const creak = (t, g = 1, f = 90) => { k.tone(t, { f: [[0, f], [0.35, f * 0.8], [0.6, f * 1.05]], type: 'sawtooth', dur: 0.65, gain: 0.04 * g, filter: 'bandpass', f2: f * 4, q: 3, a: 0.08 }); };
  creak(T.presion + 0.2, 0.7, 110); creak(T.aumentaba + 0.2, 0.9, 85); creak(T.casco, 1.1, 70);
  k.play('impact', T.soportarla + 0.05, { gain: 0.35 });
  k.play('thud', T.soportarla + 0.05, { f: 55, gain: 0.5 });
  // ---- 129: silencio. Sólo una campana grave, muy baja, al final de la frase
  k.play('bell', T.vida + 0.4, { f: 'A3', gain: 0.18 });
  // ---- lección
  ping(T.oceano13 + 0.1, 0.55);
  k.play('pop', T.grieta, { f: 460, gain: 0.3 });
  clunk(T.sistema14 + 0.2, 0.6);
  k.play('buzz', T.nofunc, { f: 92, dur: 0.25, gain: 0.3 });
  k.play('stamp', T.necesita - 0.4, { gain: 0.4 });
  // ---- cierre
  k.play('whoosh', T.asombro - 0.7, { dur: 1.0, gain: 0.35 });
  k.play('ding', T.asombro + 0.05, { f: 'A5', gain: 0.3 });
  ping(T.tag + 1.4, 0.45);
 }
 function scoreMusic(k) {
  // tensión contenida en re menor; se retira en «129» y vuelve suave (acorde abierto) para la lección y el cierre
  const Dm = [['D2', 'A2', 'F3', 'C4'], ['Bb1', 'F2', 'D3', 'A3'], ['G1', 'D2', 'Bb2', 'F3'], ['A1', 'E2', 'C#3', 'G3']];
  k.music('pad', 0, T.entender, { bpm: 70, gain: 0.4, chords: [Dm[0], Dm[1]] });
  k.music('pad', T.entender, T.pero7, { bpm: 76, gain: 0.32, chords: [['F2', 'C3', 'A3', 'E4'], ['C2', 'G2', 'E3', 'B3']] });
  k.music('pad', T.pero7, T.las12 - 0.3, { bpm: 70, gain: 0.42, chords: [Dm[0], Dm[2], Dm[1], Dm[3]] });
  k.music('pad', T.oceano13 - 0.2, T.asombro, { bpm: 66, gain: 0.34, chords: [['D2', 'A2', 'F3', 'E4'], ['Bb1', 'F2', 'D3', 'C4']] });
  k.music('pad', T.asombro, D, { bpm: 66, gain: 0.38, chords: [['D2', 'A2', 'F#3', 'E4']] });
 }
 window.scoreSound = scoreSound; window.scoreMusic = scoreMusic;
})();
