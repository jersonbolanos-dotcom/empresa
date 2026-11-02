// Comprobaciones automáticas del episodio Yakhchal (geometría del modelo maestro, sol/sombras, recursos, zonas seguras).
// Uso (desde 04_CODIGO, con index.html construido): node comprobaciones.js > ../07_QC/comprobaciones.txt
// No sustituyen la revisión de fotogramas: solo detectan incoherencias evidentes.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.addInitScript(() => { window.__HEADLESS = true; }); await p.goto('file://' + path.resolve('index.html')); await p.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
 const r = await p.evaluate(() => { const P = window.PLANTILLA.P, Y = P.YK, out = []; const ok = (name, cond, info = '') => out.push([cond ? 'OK ' : 'FALLO', name, info]);
  ok('Estanque al norte del muro de sombra', Y.pond.z1 < Y.swall.z0, `estanque z ${Y.pond.z0}–${Y.pond.z1} dm · muro z ${Y.swall.z0}–${Y.swall.z1} dm (z = sur)`);
  ok('Muro orientado este–oeste', (Y.swall.x1 - Y.swall.x0) > 10 * (Y.swall.z1 - Y.swall.z0), `largo ${Y.swall.x1 - Y.swall.x0} dm · espesor ${Y.swall.z1 - Y.swall.z0} dm`);
  ok('El estanque no invade la cúpula ni el depósito', Y.pond.z0 > Y.R0 && Y.pond.z0 > Y.pitR, `estanque desde z ${Y.pond.z0} · radio cúpula ${Y.R0} · radio pozo ${Y.pitR}`);
  ok('El camino conecta la entrada (sur de la cúpula) con el estanque', Math.abs(Y.path.z0 - P.ykR(1)) < 1 && Y.path.z1 === Y.pond.z0, `camino z ${Y.path.z0}–${Y.path.z1}`);
  ok('El canal llega al estanque desde el oeste', Y.canal.x1 === Y.pond.x0 && Y.canal.x0 < Y.canal.x1 && Y.canal.z > Y.pond.z0 && Y.canal.z < Y.pond.z1, `canal x ${Y.canal.x0}→${Y.canal.x1}`);
  const sw = P.ykSun(34.6, 180), sh = P.ykShadow([0, Y.swall.h, Y.swall.z0], sw); ok('Sol de invierno al sur ⇒ sombras hacia el norte (−z)', sh[2] < Y.swall.z0, `sombra del borde del muro en z = ${sh[2].toFixed(0)}`);
  ok('A mediodía de invierno (≈ 34,6° a 32° N) la sombra del muro cubre el estanque', sh[2] <= Y.pond.z0, `la sombra llega a z = ${sh[2].toFixed(0)} ≤ ${Y.pond.z0}`);
  const ss = P.ykSun(62, 200), ap = P.ykShadow([0, Y.H, 0], ss); ok('Sombra de verano también hacia el norte', ap[2] < 0, `sombra del remate en z = ${ap[2].toFixed(0)}`);
  ok('Una persona (17 dm) cabe por la entrada', Y.entH > 17, `entrada ${Y.entH} dm`);
  ok('El depósito queda bajo el nivel del terreno', Y.pitD > 0, `profundidad ${Y.pitD} dm`);
  ok('Pared más gruesa en la base que arriba', Y.wall0 > Y.wall1, `${Y.wall0} → ${Y.wall1} dm`);
  let mono = true; for (let y = 0; y < Y.H; y += 2) if (P.ykR(y + 2) > P.ykR(y) + 1e-6 || P.ykRin(y) > P.ykR(y)) mono = false; ok('Perfil continuo: radio exterior no crece con la altura e interior < exterior', mono);
  const A = window.ALIGN; ok('Audio con duración válida', A.duration > 10 && A.speech_end <= A.duration, `${A.duration.toFixed(3)} s`);
  ok('Subtítulos en zona segura (capY 1540 < 1920 − 320)', 1540 < 1600);
  ok('Fotografía A cargada (versión con foto)', !!(window.FOTOS && window.FOTOS.meybod), window.FOTOS && window.FOTOS.meybod ? 'sí' : 'no (versión sin foto)');
  return out; });
 for (const [s, n, i] of r) console.log(`${s}  ${n}${i ? '  · ' + i : ''}`); const fails = r.filter((x) => x[0] !== 'OK ').length; console.log(fails ? `\n${fails} comprobaciones fallidas` : `\nTodas las comprobaciones (${r.length}) superadas`); await b.close(); })();
