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
