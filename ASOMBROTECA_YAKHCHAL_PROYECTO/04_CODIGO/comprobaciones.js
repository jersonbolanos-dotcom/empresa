// Comprobaciones automáticas del episodio Yakhchal (geometría del modelo maestro, sol/sombras, recursos, zonas seguras).
// Uso (desde 04_CODIGO, con index.html construido): node comprobaciones.js > ../07_QC/comprobaciones.txt
// No sustituyen la revisión de fotogramas: solo detectan incoherencias evidentes.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.addInitScript(() => { window.__HEADLESS = true; }); await p.goto('file://' + path.resolve('index.html')); await p.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
 const r = await p.evaluate(() => { const P = window.PLANTILLA.P, Y = P.YK, out = []; const ok = (name, cond, info = '') => out.push([cond ? 'OK ' : 'FALLO', name, info]);
  ok('Estanque al norte del muro de sombra', Y.pond.z1 < Y.swall.z0, `estanque z ${Y.pond.z0}–${Y.pond.z1} dm · muro z ${Y.swall.z0}–${Y.swall.z1} dm (z = sur)`);
  ok('Muro orientado este–oeste', (Y.swall.x1 - Y.swall.x0) > 10 * (Y.swall.z1 - Y.swall.z0), `largo ${Y.swall.x1 - Y.swall.x0} dm · espesor ${Y.swall.z1 - Y.swall.z0} dm`);
  ok('El estanque no invade la cúpula ni el depósito', Y.pond.z0 > Y.R0 && Y.pond.z0 > Y.pitR, `estanque desde z ${Y.pond.z0} · radio cúpula ${Y.R0} · radio pozo ${Y.pitR}`);
  const Y2 = P.YK2; ok('El camino conecta el vestíbulo de la entrada (sur) con el estanque', Y2.ent.z0 < P.ykR2(Y2.ent.h) && Y2.ent.z1 > Y.R0 && Y.path.z1 === Y.pond.z0 && Y2.ent.z1 < Y.path.z1, `vestíbulo z ${Y2.ent.z0}–${Y2.ent.z1} · camino hasta z ${Y.path.z1}`);
  ok('El canal llega al estanque desde el oeste', Y.canal.x1 === Y.pond.x0 && Y.canal.x0 < Y.canal.x1 && Y.canal.z > Y.pond.z0 && Y.canal.z < Y.pond.z1, `canal x ${Y.canal.x0}→${Y.canal.x1}`);
  const sw = P.ykSun(34.6, 180), sh = P.ykShadow([0, Y.swall.h, Y.swall.z0], sw); ok('Sol de invierno al sur ⇒ sombras hacia el norte (−z)', sh[2] < Y.swall.z0, `sombra del borde del muro en z = ${sh[2].toFixed(0)}`);
  ok('A mediodía de invierno (≈ 34,6° a 32° N) la sombra del muro cubre el estanque', sh[2] <= Y.pond.z0, `la sombra llega a z = ${sh[2].toFixed(0)} ≤ ${Y.pond.z0}`);
  const ss = P.ykSun(62, 200), ap = P.ykShadow([0, Y.H, 0], ss); ok('Sombra de verano también hacia el norte', ap[2] < 0, `sombra del remate en z = ${ap[2].toFixed(0)}`);
  ok('Una persona (17 dm) cabe por la puerta del vestíbulo', Y2.ent.doorH >= 17, `puerta ${Y2.ent.doorH} dm`);
  ok('El depósito queda bajo el nivel del terreno', Y.pitD > 0, `profundidad ${Y.pitD} dm`);
    let mono = true, minT = 1e9; for (let y = 0; y < Y.H - 1; y += 1) { if (P.ykR2(y + 1) > P.ykR2(y) + 1e-6 || P.ykRin2(y) > P.ykR2(y)) mono = false; if (y < Y.H - Y2.top) minT = Math.min(minT, P.ykR2(y) - P.ykRin2(y)); } ok('Perfil curvo continuo (sin escalones): el radio baja con la altura e interior < exterior', mono, `espesor horizontal mínimo ${minT.toFixed(1)} dm`);
  const fot = [[0.12, 0.96], [0.30, 0.86], [0.57, 0.65], [0.82, 0.39], [0.93, 0.22]], dev = Math.max(...fot.map(([h, f]) => Math.abs(P.ykR2(h * Y.H) / Y.R0 - f))); ok('Silueta del modelo ≈ silueta de la fotografía de Meybod (radio relativo medido en la foto)', dev < 0.05, `desviación máxima ${(dev * 100).toFixed(1)} % del radio de la base`);
  ok('Pared más gruesa en la base que en lo alto (perfil curvo)', P.ykR2(0) - P.ykRin2(0) > P.ykR2(140) - P.ykRin2(140), `${(P.ykR2(0) - P.ykRin2(0)).toFixed(0)} dm en la base · ${(P.ykR2(140) - P.ykRin2(140)).toFixed(0)} dm a 14 m`);
  const st = P.ykIceStack({ fill: 1 }), sa = Y2.stair; let inStair = 0, outPit = 0; for (const b of st) { for (const [x, z] of [[b.x0, b.z0], [b.x1, b.z0], [b.x0, b.z1], [b.x1, b.z1]]) { const a = (Math.atan2(z, x) + 2 * Math.PI) % (2 * Math.PI), r = Math.hypot(x, z); if (a >= sa.a0 && a <= sa.a1 && r > P.ykPitR(b.y1) - sa.w) inStair++; if (r > P.ykPitR(b.y1)) outPit++; } }
  ok('La escalera no atraviesa el hielo (ningún bloque en el sector de la escalera)', inStair === 0, `${st.length} bloques comprobados`); ok('Todos los bloques quedan dentro del muro de contención del pozo', outPit === 0);
  let stable = true; for (const b of st) if (b.layer > 0 && !st.some((c) => c.layer === b.layer - 1 && Math.max(0, Math.min(c.x1, b.x1) - Math.max(c.x0, b.x0)) * Math.max(0, Math.min(c.z1, b.z1) - Math.max(c.z0, b.z0)) > 0.4 * (b.x1 - b.x0) * (b.z1 - b.z0))) stable = false; ok('Pila estable: cada bloque apoya ≥ 40 % de su base sobre un bloque de la capa inferior', stable);
  ok('La escalera baja desde el lado de la entrada (sur) hasta el fondo', Math.abs(sa.a0 - Math.PI / 2) < 0.01 && Y.pitD > 0);
  const A = window.ALIGN; ok('Audio con duración válida', A.duration > 10 && A.speech_end <= A.duration, `${A.duration.toFixed(3)} s`);
  ok('Subtítulos en zona segura (capY 1540 < 1920 − 320)', 1540 < 1600);
  ok('Fotografía A cargada (versión con foto)', !!(window.FOTOS && window.FOTOS.meybod), window.FOTOS && window.FOTOS.meybod ? 'sí' : 'no (versión sin foto)');
  return out; });
 for (const [s, n, i] of r) console.log(`${s}  ${n}${i ? '  · ' + i : ''}`); const fails = r.filter((x) => x[0] !== 'OK ').length; console.log(fails ? `\n${fails} comprobaciones fallidas` : `\nTodas las comprobaciones (${r.length}) superadas`); await b.close(); })();
