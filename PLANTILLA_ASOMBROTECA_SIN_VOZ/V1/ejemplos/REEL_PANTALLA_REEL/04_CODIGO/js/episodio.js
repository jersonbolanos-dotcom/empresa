// =====================================================================================================
// episodio.js — «¿Qué hay debajo del vidrio de tu celular?» · FORMATO: QUÉ HAY POR DENTRO · Plantilla Asombroteca SIN_VOZ
// Pila de una pantalla OLED (esquema simplificado) que se separa capa a capa con un whoosh (R.capas). Las placas suben guiadas
// por cuatro varillas que nacen del cuerpo del teléfono, apoyado en la mesa: nada flota. Al final todo vuelve a su sitio (bucle).
// Datos y simplificaciones en FUENTES_Y_DECISIONES.md.
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;
 const ESTILO = 'asombroteca', MARCA = 'ASOMBROTECA';

 // ---------- 1 · TIEMPOS Y CAPAS ----------
 const CORTES = ['vidrio', 'tactil', 'polar', 'oled', 'tft'].map((k) => R.t(k)), tPx = R.t('pixeles'), tJ = R.t('comenta');
 const CAPAS = { x: 520, y: 1430, W: 330, Lz: 680, gap: 96, d: 0.65, tJunta: tJ, dJunta: 1.4, cortes: CORTES,
  capas: [{ nombre: 'Vidrio', kind: 'vidrio', grosor: 9 }, { nombre: 'Táctil', kind: 'tactil', grosor: 4 }, { nombre: 'Polarizador', kind: 'polarizador', grosor: 4 },
   { nombre: 'OLED', kind: 'oled', grosor: 6 }, { nombre: 'TFT', kind: 'tft', grosor: 6 }, { nombre: 'Cuerpo', kind: 'base', grosor: 34 }] };
 const activa = (t) => { let a = -1; CORTES.forEach((tc, i) => { if (t >= tc) a = i; }); if (t >= tPx && t < CORTES[4]) a = 3; return t >= tJ ? -1 : a; };

 // ---------- 2 · LUPA DE SUBPÍXELES (rojo, verde y azul) ----------
 function lupa(ctx, t, from) { const a = sm(CORTES[3] + 0.5, CORTES[3] + 0.9, t) * (1 - sm(tPx + 2.6, tPx + 3.0, t)); if (a <= 0) return; const x = 870, y = 700, r = 115;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(255,213,74,0.8)'; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(x - r * 0.7, y + r * 0.7); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.save(); ctx.clip(); ctx.fillStyle = '#06060b'; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  const s = 46, on = 0.55 + 0.45 * Math.sin(t * 3); for (let yy = y - r; yy < y + r; yy += s) for (let xx = x - r - 10; xx < x + r; xx += s) { [['255,60,70', 4], ['60,255,120', 18], ['70,120,255', 32]].forEach(([c, dx], q) => { const b = q === Math.floor((t * 2) % 3) ? 1 : on; ctx.fillStyle = `rgba(${c},${0.35 + 0.65 * b})`; ctx.beginPath(); ctx.roundRect(xx + dx, yy + 6, 10, s - 12, 4); ctx.fill(); }); }
  ctx.restore(); ctx.lineWidth = 8; ctx.strokeStyle = '#ffd54a'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore(); }

 // ---------- 3 · ESCENA ----------
 const B = [{ t0: 0, t1: D, in: { type: 'cut' }, draw(ctx, t) {
  R.fondo(ctx, t, { gy: 1000, glow: '90,170,255' });
  // mesa
  const g = ctx.createLinearGradient(0, 1250, 0, 1920); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0.07)'); ctx.fillStyle = g; ctx.fillRect(0, 1250, 1080, 670);
  const a = activa(t), au = a >= 0 ? sm(CORTES[Math.min(a, 4)], CORTES[Math.min(a, 4)] + 0.4, t) : 0;
  const yaw = 0.62 + Math.sin(t * 0.45) * 0.08;
  const r = R.capas(ctx, t, { ...CAPAS, yaw, activa: a, activaU: au, pantalla: 0.85 + 0.15 * Math.sin(t * 1.5) });
  lupa(ctx, t, r.top[3]);
  // contador de píxeles: 1920 × 1080 = 2.073.600
  if (t >= tPx && t < tPx + 3.0) { const v = Math.round(2073600 * E.out(win(t, tPx + 0.2, tPx + 1.8))); R.contador(ctx, t, { valor: v, x: 400, y: 600, px: 110, maxW: 600, etiqueta: '1920 × 1080', bump: win(t, tPx + 1.8, tPx + 2.1) }); }
  R.titulares(ctx, t, { y: 330, pos: { comenta: { y: 450, px: 72 }, gancho: { px: 72 } } });
 }, sfx(k) { R.capasSfx(k, CAPAS); FX.contador(k, tPx + 0.2, tPx + 1.8, 0, 2073600); k.play('ding', tPx + 1.8, { f: 'E6', gain: 0.4 }); } }];

 // ---------- 4 · MONTAJE ----------
 const EP = R.make({ estilo: ESTILO, marca: MARCA, beats: B, loop: 0.5, marcaY: 285 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
