// =====================================================================================================
// episodio.js — «Una bacteria mientras ves esto» · FORMATO: CONTADOR IMPOSIBLE · Plantilla Asombroteca SIN_VOZ
// Un número sube en vivo con un clic en cada salto. Aquí: una bacteria que se duplica cada 20 minutos (condiciones ideales
// de laboratorio) → 30 duplicaciones = 10 horas = 1.073.741.824 bacterias. Datos y fuentes en FUENTES_Y_DECISIONES.md.
// Los tiempos salen de 03_GUION/tiempos.txt: R.t('clave'). Todo es función pura de t (H.rng, nunca Math.random).
// =====================================================================================================
(function () {
 const R = window.REEL, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const { TL, cl, sm, E, lerp, win, TAU } = R, D = TL.dur;
 const ESTILO = 'asombroteca', MARCA = 'ASOMBROTECA';

 // ---------- 1 · TIEMPOS ----------
 const T0 = R.t('divide'), FIN = R.t('final'), UNA = R.t('una'), NSAL = 30;
 const SALTOS = Array.from({ length: NSAL }, (_, k) => Math.round((T0 + (FIN - T0) * (k + 1) / NSAL) * 30) / 30);   // en fotogramas exactos
 const rebobina = (t) => E.inOut(win(t, UNA, UNA + 1.0));   // al final todo vuelve a UNA bacteria (enlaza con el inicio)

 // ---------- 2 · BACTERIAS EN LA PLACA (vista cenital: apoyadas sobre el agar) ----------
 const NMAX = 1024, CX = 540, CY = 1135, RD = 315, RCOL = 280;
 const RG = H.rng(7), ANG = [], JIT = [], HUE = [];
 for (let i = 0; i < NMAX; i++) { ANG.push(RG() * TAU); JIT.push([RG() - 0.5, RG() - 0.5]); HUE.push(RG()); }
 const pos = (i, c) => { const r = c * Math.sqrt(i + 0.5), a = i * 2.39996; return [CX + Math.cos(a) * r + JIT[i][0] * c * 0.5, CY + Math.sin(a) * r * 0.98 + JIT[i][1] * c * 0.5]; };
 function rod(ctx, x, y, len, ang, a, glow) { if (a <= 0.01) return; const w = len * 0.42; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = 'rgba(10,30,20,0.35)'; ctx.beginPath(); ctx.roundRect(-len / 2 + 2, -w / 2 + 3, len, w, w / 2); ctx.fill();
  const g = ctx.createLinearGradient(0, -w / 2, 0, w / 2); g.addColorStop(0, '#9af5be'); g.addColorStop(0.5, '#4fcf86'); g.addColorStop(1, '#2a9a5c'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-len / 2, -w / 2, len, w, w / 2); ctx.fill();
  if (len > 22) { ctx.strokeStyle = 'rgba(20,70,45,0.7)'; ctx.lineWidth = Math.max(1, len * 0.04); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.roundRect(-len * 0.32, -w * 0.32, len * 0.5, w * 0.18, w * 0.09); ctx.fill(); }
  if (glow) P.glow(ctx, 0, 0, len * 1.6, '255,213,74', 0.35 * glow);
  ctx.restore(); }
 function placa(ctx, t) {
  // mesa (la placa se apoya en ella) + sombra de contacto
  ctx.save(); const sh = ctx.createRadialGradient(CX, CY + 26, RD * 0.8, CX, CY + 26, RD * 1.18); sh.addColorStop(0, 'rgba(0,0,0,0.5)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(CX, CY + 26, RD * 1.2, 0, TAU); ctx.fill();
  // vidrio y agar
  ctx.fillStyle = 'rgba(210,230,255,0.18)'; ctx.beginPath(); ctx.arc(CX, CY, RD + 18, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(230,240,255,0.65)'; ctx.lineWidth = 5; ctx.stroke();
  const ag = ctx.createRadialGradient(CX - 80, CY - 90, 20, CX, CY, RD); ag.addColorStop(0, '#f3d58a'); ag.addColorStop(1, '#c98f3c'); ctx.fillStyle = ag; ctx.beginPath(); ctx.arc(CX, CY, RD, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(CX, CY, RD + 9, -2.6, -1.4); ctx.stroke(); ctx.restore(); }
 function colonia(ctx, t) {
  const s = R.saltos(t, SALTOS), k = s.i + 1, rb = rebobina(t);           // k duplicaciones ya hechas
  const kVis = Math.min(10, k), n = 1 << kVis, nPrev = kVis ? n >> 1 : 1, u = k <= 10 ? E.out(s.u) : 1;
  const nEff = Math.pow(2, Math.min(10, (k ? k - 1 : 0) + (k ? u : 0))) * (1 - rb) + rb;
  const c = Math.min(RCOL / Math.sqrt(Math.max(1, nEff)), 40), len = Math.min(64, c * 1.45);
  ctx.save(); ctx.beginPath(); ctx.arc(CX, CY, RD - 4, 0, TAU); ctx.clip();
  // césped bacteriano cuando ya no caben (k > 10): la placa se va llenando
  const lawn = cl((k - 10) / 18) * (1 - rb); if (lawn > 0) { const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, RD); g.addColorStop(0, `rgba(80,200,130,${0.85 * lawn})`); g.addColorStop(Math.min(0.98, 0.55 + 0.45 * lawn), `rgba(60,170,105,${0.7 * lawn})`); g.addColorStop(1, 'rgba(60,170,105,0)'); ctx.fillStyle = g; ctx.fillRect(CX - RD, CY - RD, RD * 2, RD * 2); }
  const wig = Math.sin(t * 2.1) * 0.12;
  for (let i = 0; i < n; i++) { let [x, y] = pos(i, c); let a = 1;
   if (i >= nPrev && kVis === k) { const [px, py] = pos(i - nPrev, c); x = lerp(px, x, u); y = lerp(py, y, u); }
   if (i > 0) a = 1 - rb; if (a <= 0.01) continue;
   const L = i === 0 ? lerp(len, 64, rb) : len; if (i === 0) { x = lerp(x, CX, rb); y = lerp(y, CY, rb); }
   rod(ctx, x, y, L, ANG[i] + wig * (i % 2 ? -1 : 1) + (i === 0 ? Math.sin(t * 1.3) * 0.25 : 0), a, i === 0 && (k === 0 || rb > 0) ? 0.6 + 0.4 * Math.sin(t * 3) : 0); }
  ctx.restore(); return k; }

 // ---------- 3 · ESCENA (una sola, continua) ----------
 const valor = (t) => { const k = R.saltos(t, SALTOS).i + 1, rb = rebobina(t); return rb > 0 ? Math.round(Math.pow(2, NSAL * (1 - rb))) : Math.pow(2, k); };
 const B = [{ t0: 0, t1: D, in: { type: 'cut' }, draw(ctx, t) {
  R.fondo(ctx, t, { gy: 1000 });
  placa(ctx, t); const k = colonia(ctx, t);
  const v = valor(t), rb = rebobina(t), min = (rb > 0 ? Math.round(NSAL * (1 - rb)) : k) * 20, h = Math.floor(min / 60), m = min % 60;
  const et = (v === 1 ? '1 bacteria' : 'bacterias') + ' · ' + (h ? h + ' h ' : '') + (m || !h ? m + ' min' : '');
  R.contador(ctx, t, { valor: v, y: 600, px: 150, bump: R.saltos(t, SALTOS).u < 1 && t >= SALTOS[0] && t < FIN + 0.3 ? R.saltos(t, SALTOS).u : 0, etiqueta: et });
  R.titulares(ctx, t, { y: 330, pos: { una: { y: 440, px: 68 } } });
 }, sfx(k) { R.contadorSfx(k, SALTOS); k.play('tape', UNA + 0.05, { dur: 0.9, gain: 0.5 }); } }];

 // ---------- 4 · MONTAJE ----------
 const EP = R.make({ estilo: ESTILO, marca: MARCA, beats: B, loop: 0.5, marcaY: 285, marcaAntes: 1.6 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, DURATION: EP.DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
