// Catálogo visual de bloques de la plantilla, en las dos pieles (piezas estáticas en t = 5 s)
(function () {
 const PL = window.PLANTILLA, P = PL.P, TAU = Math.PI * 2;
 const items = [
  ['Píldora / etiqueta', (c, t) => P.pill(c, 'CIENTOS DE METROS', 200, 150, 30, t, 0)],
  ['Contador con caja', (c, t) => P.counter(c, 200, 150, 90, t, 0, 1, 0, 1963, { box: PL.SKINS[c.__sk].c.accent, c: '#1d1b3a' })],
  ['Bocadillo + ✗', (c, t) => P.bubble(c, 200, 130, 200, 160, t, 0, (x, y) => P.cross(c, x, y, 110, 1), { tailX: 0 })],
  ['Onomatopeya', (c, t) => P.onoma(c, '¡GLUB!', 200, 150, 90, t, 4.7, 9, { shake: false })],
  ['Flecha que se dibuja', (c, t) => P.arrow(c, 60, 200, 340, 100, 1, PL.SKINS[c.__sk].c.blue, 26)],
  ['Lupa', (c, t) => P.lens(c, 200, 150, 95, 1, () => { c.fillStyle = '#3fa9f5'; c.fillRect(0, 0, 400, 300); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(200, 150, 40, 0, TAU); c.fill(); })],
  ['Manómetro (sin cifras)', (c, t) => P.gauge(c, 200, 160, 100, 0.8, '')],
  ['Dominó (cadena de causas)', (c, t) => { [0, 1, 2].forEach((i) => { c.save(); c.translate(90 + i * 110 + 40, 260); c.rotate(i < 2 ? 0.35 : 0); P.rr(c, -80, -200, 80, 200, 14, ['#3fa9f5', '#ff9f43', '#e8505b'][i], { sy: 8 }); c.restore(); }); }],
  ['✓ correcto · escudo solución', (c, t) => { P.check(c, 120, 150, 110, 1); P.shield(c, 280, 150, 80, '#2fbf71', 1); }],
  ['Personas (respeto)', (c, t) => { for (let i = 0; i < 24; i++) P.person(c, 70 + (i % 8) * 38, 90 + Math.floor(i / 8) * 60, 34, '#cfe6ff'); }],
  ['Botón «Seguir» + dedo', (c, t) => { P.rr(c, 90, 110, 220, 80, 40, PL.SKINS[c.__sk].c.accent, { sy: 8 }); P.text(c, 'SEGUIR', 200, 152, 38, '#1d1b3a'); P.finger(c, 250, 170, 90, 1); }],
  ['Burbujas / partículas', (c, t) => P.bubbles(c, 40, 20, 320, 260, t, 4, 16, 1)],
  ['Onda electromagnética (v1.2)', (c, t) => P.wave(c, [[30, 150], [370, 150]], t, { amp: 40, lam: 140 })],
  ['Molécula de agua (v1.2)', (c, t) => { P.water(c, 130, 150, 60, -1.2); P.water(c, 280, 150, 60, 0.6, { hot: 1 }); }],
  ['Rampa térmica (v1.2)', (c, t) => { for (let i = 0; i < 300; i++) { c.fillStyle = H.rgba(P.heat(i / 299)); c.fillRect(50 + i, 120, 1, 60); } P.text(c, 'FRÍO → CALIENTE', 200, 220, 26, '#ffffff'); }],
  ['Fluido en tubo: fase ≠ temperatura (v1.4)', (c, t) => { const pa = P.path([[30, 100], [370, 100]]), pb = P.path([[30, 200], [370, 200]]); c.fillStyle = 'rgba(255,255,255,0.15)'; c.fillRect(20, 84, 360, 32); c.fillRect(20, 184, 360, 32); P.fluid(c, pa, t, { w: 26, phase: (u) => u, temp: () => 0.12, seed: 2 }); P.fluid(c, pb, t, { w: 26, phase: (u) => 1 - u, temp: () => 0.85, seed: 3 }); }],
  ['Trazadores de aire (v1.4)', (c, t) => { P.airStreaks(c, P.path([[20, 150], [200, 120], [380, 150]]), t, { n: 14, temp: 0.12, spread: 120, seed: 4 }); }],
  ['Ventilador axial (v1.4)', (c, t) => P.fanAxial(c, 200, 150, 120, t * 3)],
  ['Ventilador de flujo cruzado (v1.4)', (c, t) => P.fanCross(c, 50, 120, 300, 60, t * 4)],
  ['Celular con pantalla (v1.5)', (c, t) => P.phone(c, 200, 150, 120, (x, y, w, h) => { P.mapCity(c, x, y, w, h, 3, { block: 30, street: 7 }); P.dot(c, x + w / 2, y + h / 2, 8, t); })],
  ['Globo terrestre (v1.5)', (c, t) => P.globe(c, 200, 150, 110, t * 0.3)],
  ['Satélite + ondas de radio (v1.5)', (c, t) => { P.satellite(c, 200, 110, 60, 0.2); P.rings(c, 200, 140, t, { r: 120, dir: Math.PI / 2, spread: 0.6 }); }],
  ['Reloj analógico (v1.5)', (c, t) => P.clock(c, 200, 150, 100, 43200 + t * 60)],
  ['Mapa, pin y rango (v1.5)', (c, t) => { P.mapCity(c, 0, 0, 400, 300, 5, { block: 60, street: 12 }); P.rangeCircle(c, 170, 150, 90, 1, '#2f80ed'); P.pin(c, 170, 150, 60); }],
  ['Brillo / luz (v1.2)', (c, t) => { P.glow(c, 140, 150, 120, '255,190,120', 0.9); P.glow(c, 270, 150, 90, '80,220,255', 0.9); }],
 ];
 window.drawCatalog = function () {
  document.querySelectorAll('canvas[data-i]').forEach((cv) => {
   const sk = cv.dataset.sk, c = cv.getContext('2d'); c.__sk = sk; PL.setSkin(sk);
   const S = PL.SKINS[sk]; c.fillStyle = sk === 'plana' ? '#2b2f5e' : '#0b0c10'; c.fillRect(0, 0, 400, 300);
   items[+cv.dataset.i][1](c, 5);
   if (sk === 'oscura') H.grain(c, 400, 300, 0.05, 3, true);
  });
  PL.setSkin('plana');
 };
 window.CATALOG = items.map((x) => x[0]);
})();
