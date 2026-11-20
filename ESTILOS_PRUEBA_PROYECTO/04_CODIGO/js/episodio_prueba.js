// =====================================================================================================
// episodio_prueba.js — muestra de la BIBLIOTECA DE ESTILOS v2.2: el MISMO tema («el reloj de sol») pintado con cada piel.
// tools/muestra_estilos.py copia este archivo a episodio.js cambiando __ESTILO__ por cada nombre, compila y saca un fotograma.
// El dibujo solo usa la API de la piel (fondo, forma, linea, brillo), así que cada estilo lo pinta a su manera.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P;
 const K = PL.kit(A, { lead: 0.2, tail: 1.6 }), { DURATION } = K;
 const S = (i) => A.segments[i].s;
 const reloj = (ctx, t) => { const pl = PL.piel(), cx = 540, cy = 1130, rx = 410, ry = 150;
  pl.fondo(ctx, t, { luz: 1 });
  pl.forma(ctx, { tipo: 'poli', pts: [[-40, 1290], [200, 1205], [470, 1240], [760, 1170], [1120, 1230], [1120, 2000], [-40, 2000]] }, { rol: 'fondo', t });
  pl.forma(ctx, { tipo: 'poli', pts: [[-40, 1400], [330, 1340], [700, 1390], [1120, 1330], [1120, 2000], [-40, 2000]] }, { rol: 'fondo2', t });
  pl.brillo(ctx, 830, 700, 74, { t });
  pl.forma(ctx, { tipo: 'rect', x: cx - 150, y: cy + 40, w: 300, h: 330, r: 10 }, { rol: 'objeto2', t });
  pl.forma(ctx, { tipo: 'elipse', x: cx, y: cy + 26, rx: rx + 14, ry: ry + 14 }, { rol: 'objeto2', t });
  pl.forma(ctx, { tipo: 'elipse', x: cx, y: cy, rx, ry }, { rol: 'objeto', t });
  for (let k = 0; k <= 12; k++) { const a = ((k - 6) / 6) * 1.3; pl.linea(ctx, [[cx + Math.sin(a) * 50, cy + Math.cos(a) * 18], [cx + Math.sin(a) * rx * 0.9, cy + Math.cos(a) * ry * 0.9]], { rol: 'detalle', ancho: 5, t }); }
  pl.forma(ctx, { tipo: 'poli', pts: [[cx - 6, cy + 4], [cx - 330, cy + 92], [cx - 300, cy + 120], [cx + 8, cy + 12]] }, { rol: 'sombra', t });
  pl.forma(ctx, { tipo: 'poli', pts: [[cx - 22, cy + 8], [cx + 22, cy + 8], [cx + 14, cy - 300], [cx - 2, cy - 312]] }, { rol: 'objeto2', t });
  pl.linea(ctx, [[790, 730], [620, 860], [cx + 16, cy - 290]], { rol: 'rojo', ancho: 5, punteada: true, flecha: true, t });
  P.titular(ctx, 'UNA HORA NO', 540, 450, t, -0.3, 0, { px: 92 }); P.titular(ctx, 'DURABA UNA HORA', 540, 555, t, -0.3, 0, { px: 92, clave: 'DURABA' }); };
 const B = [{ t0: 0, t1: DURATION, in: { type: 'cut' }, draw(ctx, t) { reloj(ctx, t); } }];
 const EP = PL.make({ modo: 'viral', estilo: '__ESTILO__', align: A, duration: DURATION, beats: B, recuadro: [['sombra', S(4), S(5)]] });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T: K.T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
