// =====================================================================================================
// sonido.js — efectos (scoreSound, kit SOUND con voiceover:true) y música original (scoreMusic, stem aparte,
// voiceover:false porque el kit suprime k.music/k.bed en modo voz). lib/sound.js no se modifica.
// Paleta propia del medio: papel, cinta, rotulador, subrayador, sello; latigazos solo en cambios de argumento.
// =====================================================================================================
(function () {
 const E = window.EPISODIO, T = E.T, D = E.DURATION, wt = E.wt;
 const drop = (k, t, g = 1, pan = 0) => { k.play('paper', t, { dur: 0.16, gain: 0.5 * g, pan, minor: true }); k.play('slap', t + 0.04, { gain: 0.45 * g, pan }); };
 const tapeOn = (k, t, pan = 0) => k.play('tape', t, { dur: 0.35, gain: 0.35, pan, minor: true });
 const marker = (k, t, dur = 0.55, pan = 0) => k.play('stroke', t, { material: 'sharpie', dur, gain: 0.55, pan });
 const hl = (k, t, dur = 0.5, pan = 0) => k.play('stroke', t, { material: 'marker', dur, gain: 0.45, pan, minor: true });
 const whip = (k, t) => { k.play('whoosh', t, { dur: 0.36, top: 3400, gain: 0.6 }); k.play('swish', t + 0.12, { dur: 0.16, gain: 0.4 }); };
 const big = (k, t, g = 1) => { k.play('stamp', t, { gain: 0.7 * g }); k.play('thud', t + 0.01, { f: 110, gain: 0.45 * g }); };
 const ink = (k, t, dur = 0.6, pan = 0) => k.play('stroke', t, { material: 'pen', dur, gain: 0.6, pan, minor: true });

 function scoreSound(k) {
  // 01 gancho
  drop(k, 0.05, 1.1); big(k, 0.06, 0.6);
  drop(k, T.elon, 0.9, -0.4); tapeOn(k, T.elon + 0.12, -0.4);
  marker(k, T.burlo, 0.6, -0.2);
  drop(k, wt(0, 'binance…'), 0.8, 0.4); k.play('ding', wt(0, 'binance…') + 0.05, { f: 'B5', gain: 0.25, minor: true });
  drop(k, T.fundador1, 0.9, 0.4); tapeOn(k, T.fundador1 + 0.12, 0.4);
  ink(k, T.respondio, 0.6, 0); drop(k, T.respondio + 0.2, 0.6); hl(k, T.respondio + 0.3, 0.5);
  k.play('paper', T.mil1 - 0.15, { dur: 0.4, gain: 0.5 }); // la solapa deja ver la cifra
  k.play('paper', T.dolares1 + 0.7, { dur: 0.3, gain: 0.45 }); // y la vuelve a tapar
  // 02 ataque
  whip(k, E.WHIPS[0]);
  drop(k, T.todo + 0.05, 1); tapeOn(k, T.todo + 0.15, -0.3); hl(k, T.binance2, 0.45, -0.2);
  big(k, T.seis, 1.1);
  drop(k, T.dolares2 + 0.2, 0.5, 0.4);
  // 03 promesa y comparación FTX
  drop(k, T.prometia, 0.7, -0.4); hl(k, T.prometia + 0.3, 0.6, -0.3);
  ink(k, T.comparo, 0.7, -0.3); big(k, T.comparo + 0.25, 0.6);
  drop(k, T.quiebra - 0.2, 0.9, 0.2); tapeOn(k, T.quiebra - 0.05, 0.4); marker(k, T.ftx, 0.6, 0.2);
  // 04 reacciones en X
  whip(k, E.WHIPS[1]);
  drop(k, T.musk4 + 0.05, 0.9); drop(k, T.musk4 + 0.1, 0.6, -0.5);
  drop(k, T.mueca - 0.15, 1, 0.3); k.play('pop', T.mueca, { f: 520, gain: 0.5, pan: 0.3 }); marker(k, T.mueca + 0.25, 0.6, 0.3);
  drop(k, T.despues, 0.8, -0.2);
  k.play('pop', T.risa, { f: 700, gain: 0.5, pan: 0.2 }); k.play('pop', T.fuego, { f: 440, gain: 0.5, pan: -0.2 });
  // 05 Zhao responde: la hoja nueva sube y su recorte desplaza a Musk
  k.play('paper', E.SHEET[0], { dur: 0.5, gain: 0.7 }); k.play('swish', E.SHEET[0] + 0.2, { dur: 0.2, gain: 0.35 });
  k.play('paper', T.changpeng - 0.1, { dur: 0.3, gain: 0.6, pan: 0.4 }); drop(k, T.changpeng - 0.1, 0.9, 0.3); tapeOn(k, T.changpeng + 0.05, 0.3);
  drop(k, T.fundador5 - 0.1, 0.7, 0.4); hl(k, T.fundador5, 0.5, 0.4);
  drop(k, wt(5, 'binance,'), 0.6, 0.5);
  big(k, T.callado - 0.2, 0.7);
  // 06 la cita, subrayada al compás de la voz (pausas respetadas)
  drop(k, T.escribio, 1); tapeOn(k, T.escribio + 0.1, -0.4); tapeOn(k, T.escribio + 0.2, 0.4);
  hl(k, T.q1, 0.7); hl(k, T.momento, 0.4); hl(k, T.momento + 0.4, 0.3);
  hl(k, T.q3, 0.5); marker(k, T.detente, 0.5);
  // 07 sorpresa: la misma hoja se despliega
  k.play('paper', T.sorpresa0 + 0.2, { dur: 0.7, gain: 0.7 }); k.play('riser', T.sorpresa0 + 0.1, { dur: 1.2, gain: 0.35 });
  // 08 500 M -> Twitter
  drop(k, T.invertido, 0.7, -0.4); k.play('tape', T.quinientos - 0.1, { dur: 0.45, gain: 0.5 }); big(k, T.quinientos + 0.35, 1);
  hl(k, T.quinientos, 0.6, 0.2); hl(k, T.quinientos + 0.6, 0.5, 0.2);
  ink(k, T.ayudar, T.twitter - T.ayudar + 0.2, 0); drop(k, T.twitter, 0.8, 0.4); drop(k, T.twitter + 0.3, 0.5);
  // 09 SpaceX > 1.000 M (según Zhao)
  ink(k, T.vinculada, T.acciones + 0.4 - T.vinculada, -0.2); k.play('stamp', T.segun, { gain: 0.55, pan: 0.4 });
  drop(k, T.spacex, 0.9, -0.3); big(k, T.mil12, 1.2); hl(k, T.mil12, 0.6, 0.2); drop(k, wt(12, 'dólares.'), 0.5, 0.2);
  // 10 no necesitan vender
  whip(k, E.WHIPS[2]);
  drop(k, T.aunque + 0.05, 1); tapeOn(k, T.aunque + 0.15);
  drop(k, T.aseguro + 0.2, 0.8, -0.3); drop(k, T.venderlas - 0.1, 0.6, 0.3);
  marker(k, T.venderlas + 0.25, 0.25, 0.3); marker(k, T.venderlas + 0.5, 0.25, 0.3); k.play('error', T.venderlas + 0.3, { gain: 0.35, pan: 0.3 });
  big(k, T.cubrir - 0.1, 0.8);
  // 11 mosaico
  whip(k, E.WHIPS[3]);
  drop(k, T.lo14 + 0.05, 0.8, -0.4); drop(k, T.termino, 0.8, 0.4); drop(k, T.discusion - 0.1, 0.8, -0.1);
  ink(k, T.termino + 0.2, 0.5, 0); ink(k, T.discusion + 0.1, 0.5, 0.2);
  // 12 la pregunta
  k.play('paper', T.lado0 - 0.4, { dur: 0.5, gain: 0.6 });
  drop(k, T.lado0 - 0.2, 0.8, -0.4); drop(k, T.lado0 - 0.2, 0.8, 0.4);
  big(k, wt(15, '¿tú'), 0.9); big(k, T.lado, 1.1);
  k.play('typebar', T.end + 0.2, { gain: 0.4 });
 }

 // música propia: ambiente de investigación editorial, pulso contenido (stem separado, se mezcla bajo la voz)
 function scoreMusic(k) {
  const A = [['A2', 'E3', 'G3', 'C4'], ['F2', 'C3', 'E3', 'A3'], ['D3', 'F3', 'A3', 'C4'], ['E2', 'B2', 'E3', 'G#3']];
  const Bm = [['A2', 'E3', 'A3', 'C4'], ['G2', 'D3', 'G3', 'B3'], ['F2', 'C3', 'F3', 'A3'], ['E2', 'B2', 'E3', 'G#3']];
  k.bed('room', 0, D, { gain: 0.6 });
  k.music('pad', 0, E.WHIPS[0], { bpm: 84, gain: 0.5, chords: [A[0], A[1]] });
  k.music('pulse', E.WHIPS[0], E.SHEET[0], { bpm: 84, gain: 0.32, chords: A });
  k.music('pad', E.SHEET[0], T.sorpresa0, { bpm: 84, gain: 0.45, chords: [A[2], A[3]] });
  // la sorpresa: silencio breve y entrada con más cuerpo
  k.music('pulse', T.sorpresa + 0.4, E.WHIPS[2], { bpm: 92, gain: 0.34, chords: Bm });
  k.music('pad', E.WHIPS[2], T.lado0 - 0.4, { bpm: 84, gain: 0.45, chords: [A[1], A[3]] });
  k.music('pad', T.lado0 - 0.3, D, { bpm: 84, gain: 0.5, chords: [['A2', 'E3', 'A3', 'C#4']] });
 }
 window.scoreSound = scoreSound; window.scoreMusic = scoreMusic;
})();
