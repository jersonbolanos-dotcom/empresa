// =====================================================================================================
// episodio.js — «¿Cómo viaja internet de un continente a otro por el fondo del océano?» · Asombroteca
// PLANTILLA ASOMBROTECA v1.6. Arco: mensaje que sale del celular → no por satélite: por cables → red mundial
// (mapa ESTILIZADO) → descenso al fondo → corte del cable → fibra (núcleo y revestimiento) → datos a luz
// modulada → pérdida y repetidores (amplificación óptica) → un océano en ≈ 0,03 s → barco cablero → enterrado
// cerca de la costa → rotura por ancla y reparación → regreso al celular → «Sigue a Asombroteca».
// Cifras verificadas en FUENTES_Y_DECISIONES.md. Reloj = segundos de la voz original. Determinista (H.rng).
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX;
 const W = 1080, HH = 1920, TAU = Math.PI * 2, DURATION = +(A.duration + 1.0).toFixed(3);
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sm = (a, b, x) => H.smooth(a, b, x), E = H.ease, lerp = H.lerp;
 const win = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 // paleta del episodio
 const C = { abismo: '#031322', mar: '#062A46', azul: '#167BFF', cian: '#49E6FF', verde: '#46F5BC', blanco: '#F4FAFF', gris: '#8799A8', oro: '#FFD447', naranja: '#FF9B45', rojo: '#FF5D5D' };
 const T = {
  envias0: wt(0, 'envías'), mensaje0: wt(0, 'mensaje'), otro0: wt(0, 'otro'), continente0: wt(0, 'continente'), miles0: wt(0, 'miles'), fondo0: wt(0, 'fondo'), oceano0: wt(0, 'océano'),
  y1: SG(1).s, trafico: wt(1, 'tráfico'), internacional: wt(1, 'internacional'), no1: wt(1, 'no', 1), satelites1: wt(1, 'satélites'),
  viaja2: SG(2).s, cables2: wt(2, 'cables'), submarinos: wt(2, 'submarinos'), pero3: SG(3).s, como4: SG(4).s,
  bajo5: SG(5).s, enorme: wt(5, 'enorme'), red5: wt(5, 'red'), conecta: wt(5, 'conecta'), continentes5: wt(5, 'continentes'),
  algunos: SG(6).s, miles6: wt(6, 'miles'), atraviesan: wt(6, 'atraviesan'), varios: wt(6, 'varios'), metros: wt(6, 'metros'), profundidad6: wt(6, 'profundidad'),
  pero7: SG(7).s, sorprendente: wt(7, 'sorprendente'), interior: wt(7, 'interior'),
  estos8: SG(8).s, contienen: wt(8, 'contienen'), fibras8: wt(8, 'fibras'), opticas: wt(8, 'ópticas'),
  unos9: SG(9).s, filamentos: wt(9, 'filamentos'), vidrio: wt(9, 'vidrio'), delgados: wt(9, 'delgados'), transportan: wt(9, 'transportan'), pulsos: wt(9, 'pulsos'), luz9: wt(9, 'luz'),
  cuando10: SG(10).s, mensaje10: wt(10, 'mensaje'), equipos: wt(10, 'equipos'), convierten: wt(10, 'convierten'), datos: wt(10, 'datos'), senales10: wt(10, 'señales'), luminosas: wt(10, 'luminosas'), viajan10: wt(10, 'viajan'),
  y11: SG(11).s, pierde: wt(11, 'pierde'), intensidad: wt(11, 'intensidad'), recorrido: wt(11, 'recorrido'),
  los12: SG(12).s, repetidores: wt(12, 'repetidores'), amplifican: wt(12, 'amplifican'), camino12: wt(12, 'camino'),
  asi13: SG(13).s, cruzar: wt(13, 'cruzar'), oceano13: wt(13, 'océano'), fraccion: wt(13, 'fracción'), segundo: wt(13, 'segundo'),
  pero14: SG(14).s, colocan: wt(14, 'colocan'), profundidad14: wt(14, 'profundidad'),
  utilizan: SG(15).s, barcos: wt(15, 'barcos'), desenrollando: wt(15, 'desenrollando'), cuidadosamente: wt(15, 'cuidadosamente'), fondo15: wt(15, 'fondo'),
  en16: SG(16).s, costa: wt(16, 'costa'), riesgo: wt(16, 'riesgo'), danos: wt(16, 'daños'),
  muchas: SG(17).s, entierran: wt(17, 'entierran'), lecho: wt(17, 'lecho'), protegerlos: wt(17, 'protegerlos'),
  y18: SG(18).s, increible: wt(18, 'increíble'),
  si19: SG(19).s, rompe: wt(19, 'rompe'), necesario: wt(19, 'necesario'), barco19: wt(19, 'barco'), localizarlo: wt(19, 'localizarlo'), recuperarlo: wt(19, 'recuperarlo'), repararlo: wt(19, 'repararlo'), medio: wt(19, 'medio'), oceano19: wt(19, 'océano'),
  asi20: SG(20).s, proxima: wt(20, 'próxima'), envies: wt(20, 'envíes'), mensaje20: wt(20, 'mensaje'), otro20: wt(20, 'otro'), mundo: wt(20, 'mundo'), recuerda: wt(20, 'recuerda'),
  detras: SG(21).s, simple: wt(21, 'simple'), clic: wt(21, 'clic'), gigantesca: wt(21, 'gigantesca'), cables21: wt(21, 'cables'), escondida: wt(21, 'escondida'), mar: wt(21, 'mar'),
  sigue: SG(22).s, asombroteca: wt(22, 'asombroteca'), end: A.speech_end,
 };
 const TB = { satel: T.y1 - 0.2, red: T.bajo5 - 0.15, baja: T.atraviesan - 0.1, corte: T.pero7 - 0.15, fibra: T.unos9 - 0.15, luz: T.cuando10 - 0.15, rep: T.y11 - 0.15, cruce: T.asi13 - 0.15, barco: T.pero14 - 0.15, costa: T.en16 - 0.15, rotura: T.y18 - 0.15, vuelta: T.asi20 - 0.15, cierre: T.sigue - 0.15 };

 // ---------------- utilidades del episodio ----------------
 const pill = (ctx, s, x, y, px, t, t0, bg, fg, t1) => { const a = t1 ? 1 - sm(t1 - 0.25, t1, t) : 1; if (a <= 0 || t < t0) return; ctx.save(); ctx.globalAlpha *= a; P.pill(ctx, s, x, y, px, t, t0, { bg, fg }); ctx.restore(); };
 const tag = (ctx, s, x, y, px, a, c = 'rgba(230,242,255,0.92)', al = 'center') => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `600 ${px}px "IBM Plex Mono"`; ctx.textAlign = al; ctx.textBaseline = 'middle'; ctx.fillStyle = c; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 10; ctx.fillText(s, x, y); ctx.restore(); };
 const bg = (ctx, c = C.abismo) => { ctx.fillStyle = c; ctx.fillRect(0, 0, W, HH); };
 // etiqueta con línea guía (para rotular capas y piezas)
 const callout = (ctx, x0, y0, x1, y1, s, sub, a, c = C.blanco) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - 10, y1); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y0, 7, 0, TAU); ctx.fill(); ctx.font = '800 34px Nunito'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8; ctx.fillText(s, x1, y1 - (sub ? 14 : 0)); if (sub) { ctx.font = '600 23px "IBM Plex Mono"'; ctx.fillStyle = 'rgba(220,235,250,0.85)'; ctx.fillText(sub, x1, y1 + 22); } ctx.restore(); };
 // cable visto de perfil (negro con brillo) sobre una polilínea
 const cableLine = (ctx, pts, w = 14, glow = 0) => { if (glow > 0) P.strokePath(ctx, pts, w * 3, `rgba(73,230,255,${0.25 * glow})`); P.strokePath(ctx, pts, w, '#1a2129'); P.strokePath(ctx, pts.map(([x, y]) => [x, y - w * 0.22]), w * 0.25, 'rgba(160,190,210,0.5)'); };
 // sobre / paquete de mensaje
 const envelope = (ctx, x, y, s, a = 1, c = C.oro) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; P.glow(ctx, x, y, s * 1.4, '255,212,71', 0.45); ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x - s * 0.6, y - s * 0.4, s * 1.2, s * 0.8, s * 0.1); ctx.fill(); ctx.strokeStyle = C.abismo; ctx.lineWidth = s * 0.08; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - s * 0.55, y - s * 0.33); ctx.lineTo(x, y + s * 0.08); ctx.lineTo(x + s * 0.55, y - s * 0.33); ctx.stroke(); ctx.restore(); };
 // pantalla de chat: el mensaje se escribe y se envía en ts
 const chat = (ctx, x, y, w, h, t, ts, msg) => {
  ctx.fillStyle = '#0d2236'; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#123a58'; ctx.fillRect(x, y, w, h * 0.12);
  P.circle(ctx, x + w * 0.14, y + h * 0.065, w * 0.06, C.cian); ctx.fillStyle = C.blanco; ctx.font = `800 ${w * 0.065}px Nunito`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('Ana · Madrid', x + w * 0.24, y + h * 0.065);
  // mensaje recibido antes
  ctx.fillStyle = '#1d4466'; ctx.beginPath(); ctx.roundRect(x + w * 0.06, y + h * 0.2, w * 0.6, h * 0.085, w * 0.05); ctx.fill(); ctx.fillStyle = C.blanco; ctx.font = `700 ${w * 0.055}px Nunito`; ctx.fillText('¿Cómo estás?', x + w * 0.1, y + h * 0.243);
  const typed = Math.floor(msg.length * win(t, ts - 0.9, ts - 0.15)), sent = t >= ts;
  if (sent) { const u = E.out(win(t, ts, ts + 0.3)); ctx.fillStyle = C.azul; ctx.beginPath(); ctx.roundRect(x + w * 0.3, y + h * lerp(0.82, 0.34, u), w * 0.64, h * 0.085, w * 0.05); ctx.fill(); ctx.fillStyle = C.blanco; ctx.fillText(msg, x + w * 0.34, y + h * (lerp(0.82, 0.34, u) + 0.043)); ctx.font = `700 ${w * 0.04}px Nunito`; ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(244,250,255,0.75)'; ctx.fillText('enviado ✓', x + w * 0.93, y + h * (lerp(0.82, 0.34, u) + 0.115)); ctx.textAlign = 'left'; }
  ctx.fillStyle = '#123a58'; ctx.beginPath(); ctx.roundRect(x + w * 0.05, y + h * 0.88, w * 0.7, h * 0.07, h * 0.035); ctx.fill(); ctx.fillStyle = sent ? 'rgba(244,250,255,0.4)' : C.blanco; ctx.font = `700 ${w * 0.05}px Nunito`; ctx.fillText(sent ? 'Mensaje' : msg.slice(0, typed) + (Math.floor(t * 3) % 2 ? '|' : ''), x + w * 0.09, y + h * 0.915);
  const press = win(t, ts - 0.12, ts) * (1 - win(t, ts, ts + 0.15)); P.circle(ctx, x + w * 0.86, y + h * 0.915, w * 0.075 * (1 - 0.15 * press), C.verde); ctx.fillStyle = C.abismo; ctx.beginPath(); const bx = x + w * 0.86, by = y + h * 0.915, bs = w * 0.035; ctx.moveTo(bx - bs, by - bs); ctx.lineTo(bx + bs * 1.2, by); ctx.lineTo(bx - bs, by + bs); ctx.lineTo(bx - bs * 0.5, by); ctx.closePath(); ctx.fill();
 };
 // ventanas de mapa
 const MAP_ATL = { x: -60, y: 400, w: 1200, h: 900, o: { lon0: -110, lon1: 40, lat0: -40, lat1: 70, sea: C.mar, land: '#11405f' } };
 const MAP_MUNDO = { x: -30, y: 560, w: 1140, h: 600, o: { lon0: -130, lon1: 165, lat0: -50, lat1: 72, sea: C.mar, land: '#11405f' } };
 const drawMap = (ctx, M) => P.worldMap(ctx, M.x, M.y, M.w, M.h, M.o);
 // rutas ESTILIZADAS (corredores reales simplificados; no son trazados exactos)
 const ROUTES = [
  { id: 'atl-n', p: [[-74, 40.5], [-55, 43], [-35, 47], [-15, 50], [-5, 50.5]] },
  { id: 'atl-m', p: [[-76, 36.8], [-55, 38], [-30, 41], [-12, 44.5], [-2.9, 43.4]] },
  { id: 'atl-s', p: [[-38.5, -3.7], [-30, 5], [-22, 20], [-14, 32], [-9.1, 38.7]] },
  { id: 'sur', p: [[-38.5, -13], [-20, -12], [0, -10], [13.2, -8.8]] },
  { id: 'car', p: [[-80, 26], [-75, 18], [-75.5, 10.4], [-79.9, 9.3]] },
  { id: 'sam', p: [[-79.9, 9.3], [-81, 0], [-78, -12], [-71.6, -33]] },
  { id: 'sam-e', p: [[-75.5, 10.4], [-62, 12], [-48, 0], [-38.5, -3.7], [-38.5, -13], [-43.2, -23], [-56, -35]] },
  { id: 'afr-o', p: [[-9.1, 38.7], [-17, 26], [-17.5, 14.7], [-8, 4], [3.4, 6.4], [10, -3], [13.2, -8.8], [12, -20], [18.4, -33.9]] },
  { id: 'afr-e', p: [[18.4, -33.9], [30, -33], [35, -26], [41, -15], [45, 0], [52, 11]] },
  { id: 'med', p: [[-9.1, 38.7], [-5.5, 36], [5.4, 43.3], [12, 38], [22, 34], [29.9, 31.2]] },
  { id: 'asia', p: [[32.5, 29.5], [37, 22], [43.5, 12.6], [55, 13], [65, 18], [72.8, 19], [79, 7], [92, 6], [103.8, 1.3], [110, 10], [114.2, 22.3], [122, 26], [139.8, 35.4]] },
  { id: 'aus', p: [[103.8, 1.3], [108, -8], [112, -18], [115.8, -32]] },
  { id: 'pac-w', p: [[139.8, 35.4], [150, 33], [165, 30]] },
  { id: 'pac-e', p: [[-118.2, 34], [-125, 32], [-130, 30]] },
  { id: 'pac-n', p: [[-122.5, 37.7], [-128, 39], [-130, 40]] },
 ];
 const routePx = (proj, r) => r.p.map(proj);
 // corte de la orilla y el mar para escenas de perfil
 const SURF = 560;

 // ================= BEATS =================
 const B = [];
 // 1 · gancho: el mensaje sale del celular y viaja a otro continente por el fondo del océano
 const R1 = [[-74.1, 4.7], [-75.5, 10.4], [-65, 17], [-50, 26], [-32, 34], [-16, 38], [-9.1, 38.7], [-3.7, 40.4]];
 B.push({ t0: 0, t1: TB.satel, draw(ctx, t) {
  bg(ctx);
  const ma = sm(T.otro0 - 0.3, T.continente0 + 0.2, t);
  if (ma > 0) { ctx.save(); ctx.globalAlpha = ma; const z = lerp(1.25, 1, E.out(ma)); ctx.translate(540, 850); ctx.scale(z, z); ctx.translate(-540, -850); const proj = drawMap(ctx, MAP_ATL);
   const pts = R1.map(proj), prog = E.inOut(win(t, T.continente0, T.oceano0 + 0.5));
   ctx.save(); ctx.setLineDash([16, 14]); P.strokePath(ctx, pts.slice(0, 2), 5, 'rgba(244,250,255,0.6)'); ctx.restore();
   const L = P.cableRoute(ctx, pts.slice(1, 7), prog, t, { c: '73,230,255', w: 6, dots: 3 });
   ctx.save(); ctx.setLineDash([16, 14]); P.strokePath(ctx, pts.slice(6), 5, `rgba(244,250,255,${0.6 * sm(0.95, 1, prog)})`); ctx.restore();
   P.dot(ctx, pts[0][0], pts[0][1], 12, t, C.azul); P.pin(ctx, pts[7][0], pts[7][1], 64 * sm(T.continente0, T.continente0 + 0.3, t), C.naranja);
   if (L) { const [ex, ey] = L.at(L.L * prog); envelope(ctx, ex, ey - 36, 52); }
   ctx.restore();
   pill(ctx, 'OTRO CONTINENTE', 790, 520, 34, t, T.continente0, C.naranja, C.abismo);
   pill(ctx, 'MILES DE KILÓMETROS', 540, 1290, 36, t, T.miles0, C.blanco, C.abismo, T.fondo0);
   pill(ctx, 'POR EL FONDO DEL OCÉANO', 540, 1290, 38, t, T.fondo0, C.cian, C.abismo);
   tag(ctx, 'MAPA ESTILIZADO · RUTA ILUSTRATIVA', 540, 1380, 22, ma * 0.8); }
  // el celular: grande, envía y se encoge hacia Colombia
  const sh = E.inOut(win(t, T.mensaje0 + 0.2, T.otro0 + 0.4)), ps = lerp(1, 0.18, sh), px = lerp(540, 238, sh), py = lerp(840, 905, sh);
  if (ps > 0.19 || t < T.continente0 + 0.5) { ctx.save(); ctx.globalAlpha = 1 - sm(T.otro0 + 0.2, T.otro0 + 0.5, t); ctx.translate(px, py); ctx.scale(ps, ps); ctx.translate(-540, -840); P.phone(ctx, 540, 840, 440, (x, y, w, h) => chat(ctx, x, y, w, h, t, T.mensaje0, '¡Hola desde Colombia!')); ctx.restore(); }
  if (t > T.mensaje0 && t < T.otro0 + 0.6) envelope(ctx, lerp(540, 238, sh), lerp(560, 860, sh), 70 * lerp(1, 0.6, sh));
 }, sfx(k) {
  k.play('typing', T.envias0 - 0.3, { n: 9, rate: 0.08, gain: 0.5 }); k.play('whoosh', T.mensaje0, { dur: 0.5, top: 3000, gain: 0.5 }); FX.datos(k, T.mensaje0 + 0.1, 8);
  FX.revelar(k, T.otro0 - 0.1); FX.ubicacion(k, T.continente0); FX.etiqueta(k, T.miles0); k.play('whoosh', T.fondo0 - 0.2, { dur: 1.0, top: 900, gain: 0.35 }); FX.bajoAgua(k, T.fondo0, 1.6, 0.7);
 } });
 // 2 · no por satélites: por cables submarinos (más del 99 % del tráfico intercontinental)
 B.push({ t0: TB.satel, t1: TB.red, in: { type: 'rise', d: 0.55 }, draw(ctx, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, SURF); sky.addColorStop(0, '#0b1d3a'); sky.addColorStop(1, '#2b5c8f'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, SURF + 20);
  P.ocean(ctx, t, 0.45, { y: SURF, h: HH - SURF, snow: 60 }); P.waves(ctx, SURF, t, { amp: 9 });
  const yAt = P.seabed(ctx, 1290, t, { seed: 4 });
  // satélite (la minoría del tráfico) que se tacha
  const sx = lerp(160, 920, win(t, TB.satel, T.viaja2 + 1)), sa = 1 - 0.55 * sm(T.no1, T.no1 + 0.4, t);
  ctx.save(); ctx.globalAlpha = sa; P.satellite(ctx, sx, 300, 70, 0.25); ctx.restore(); P.rings(ctx, sx, 340, t, { r: 120, n: 2, period: 1.3, a: 0.6 * sa, dir: Math.PI / 2, spread: 0.5, w: 4 });
  if (t > T.no1) P.cross(ctx, sx, 300, 110, E.out(win(t, T.no1, T.no1 + 0.35)), C.rojo);
  pill(ctx, 'TRÁFICO INTERNACIONAL', 540, 150 + 0, 34, t, T.trafico, C.blanco, C.abismo, T.no1);
  pill(ctx, 'LA MAYORÍA NO VA POR SATÉLITE', 540, 150, 34, t, T.no1, C.rojo, C.blanco);
  // el cable en el fondo, que se ilumina
  const ca = sm(T.viaja2 - 0.2, T.cables2, t), pts = []; for (let x = -20; x <= W + 20; x += 20) pts.push([x, yAt(x) - 8]);
  cableLine(ctx, pts, 16, ca); if (ca > 0) P.cableRoute(ctx, pts, 1, t, { c: '73,230,255', w: 4, a: ca, smooth: false, dots: 5, speed: 420 });
  pill(ctx, 'CABLES SUBMARINOS', 540, 1080, 50, t, T.cables2, C.cian, C.abismo, T.pero3 + 0.1);
  if (t > T.submarinos) { const a = sm(T.submarinos, T.submarinos + 0.3, t) * (1 - sm(T.pero3, T.pero3 + 0.3, t)); ctx.save(); ctx.globalAlpha = a; P.rr(ctx, 200, 770, 680, 190, 30, 'rgba(3,19,34,0.82)'); P.text(ctx, 'MÁS DEL 99 %', 540, 840, 64, C.oro, { kind: 'title' }); P.text(ctx, 'del tráfico intercontinental', 540, 905, 32, C.blanco); ctx.restore(); tag(ctx, 'fuente: TeleGeography', 540, 1000, 22, a * 0.85); }
  P.onoma(ctx, '¿CÓMO ES POSIBLE?', 540, 900, 92, t, T.pero3 + 0.1, TB.red + 0.2, { c: C.oro });
 }, sfx(k) {
  FX.bajoAgua(k, TB.satel, T.pero3 - TB.satel, 0.6); FX.olas(k, TB.satel, 4, 0.8); FX.senal(k, T.y1 + 0.3, 0.6); FX.etiqueta(k, T.trafico); FX.tachado(k, T.no1);
  k.play('whoosh', T.viaja2 - 0.3, { dur: 0.8, top: 1200, gain: 0.35 }); FX.revelar(k, T.cables2); FX.pulsoLuz(k, T.cables2 + 0.1, 5); FX.sello(k, T.submarinos + 0.05); FX.onomatopeya(k, T.pero3 + 0.1); k.play('riser', T.como4 - 0.3, { dur: 1.2, gain: 0.25 });
 } });
 // 3 · la red mundial (mapa estilizado): ≈ 600 sistemas en servicio; algunos recorren miles de km
 B.push({ t0: TB.red, t1: TB.baja, in: { type: 'iris', d: 0.6, x: 540, y: 860 }, draw(ctx, t) {
  bg(ctx); const proj = drawMap(ctx, MAP_MUNDO);
  ROUTES.forEach((r, i) => { const t0 = T.enorme - 0.4 + i * 0.14, prog = E.inOut(win(t, t0, t0 + 1.1)); const hl = r.id === 'asia' || r.id === 'afr-o' ? sm(T.algunos, T.algunos + 0.4, t) : 0; P.cableRoute(ctx, routePx(proj, r), prog, t, { c: hl > 0 ? '255,212,71' : '73,230,255', w: 3 + 2 * hl, dots: 2, speed: 160, a: 1 - 0.5 * sm(T.algunos, T.algunos + 0.4, t) * (1 - hl) }); });
  const ca = sm(T.conecta - 0.1, T.conecta + 0.3, t); if (ca > 0) [[-74, 40.5], [-2.9, 43.4], [-38.5, -3.7], [13.2, -8.8], [72.8, 19], [103.8, 1.3], [139.8, 35.4], [115.8, -32], [18.4, -33.9]].forEach(([lo, la], i) => { const [x, y] = proj([lo, la]); ctx.save(); ctx.globalAlpha = ca; P.circle(ctx, x, y, 7, C.verde); P.rings(ctx, x, y, t + i * 0.2, { r: 30, n: 1, period: 1.4, c: '70,245,188', a: 0.7, w: 3 }); ctx.restore(); });
  pill(ctx, 'UNA RED QUE CONECTA CONTINENTES', 540, 360, 36, t, T.enorme, C.cian, C.abismo, T.algunos);
  if (t > T.red5) { const a = sm(T.red5, T.red5 + 0.3, t) * (1 - sm(T.algunos - 0.2, T.algunos + 0.1, t)); ctx.save(); ctx.globalAlpha = a; P.rr(ctx, 230, 1210, 620, 150, 28, 'rgba(244,250,255,0.95)'); P.text(ctx, '≈ 600 SISTEMAS', 540, 1262, 50, C.abismo, { kind: 'title' }); P.text(ctx, 'de cables en servicio (2025)', 540, 1315, 28, '#3a5368'); ctx.restore(); tag(ctx, 'fuente: TeleGeography', 540, 1390, 22, a * 0.85); }
  pill(ctx, 'ALGUNOS: MILES DE KILÓMETROS', 540, 360, 36, t, T.algunos, C.oro, C.abismo);
  tag(ctx, 'MAPA ESTILIZADO · RUTAS SIMPLIFICADAS, NO EXACTAS', 540, 1180, 22, 0.75 * sm(T.bajo5, T.bajo5 + 0.5, t));
 }, sfx(k) { FX.revelar(k, TB.red + 0.2); for (let i = 0; i < ROUTES.length; i++) k.play('stroke', T.enorme - 0.4 + i * 0.14, { material: 'pen', dur: 0.5, gain: 0.12, minor: true }); FX.contador(k, T.red5, T.red5 + 0.6, 0, 6); FX.ubicacion(k, T.conecta); FX.etiqueta(k, T.algunos); k.play('whoosh', T.miles6, { dur: 1.2, top: 1500, gain: 0.3, minor: true }); } });
 // 4 · descenso: zonas de varios miles de metros de profundidad
 B.push({ t0: TB.baja, t1: TB.corte, in: { type: 'fade', d: 0.4 }, draw(ctx, t) {
  const d = E.inOut(win(t, TB.baja + 0.1, T.profundidad6 + 0.4)), depthM = 4000 * d;
  P.ocean(ctx, t, d, { dy: d * 2400, snow: 120 });
  // superficie que se aleja hacia arriba y fondo que aparece abajo
  if (d < 0.35) P.waves(ctx, lerp(300, -400, d / 0.35), t, { sky: '#2b5c8f' });
  const by = lerp(2600, 1250, sm(0.7, 1, d)); if (by < HH) { const yAt = P.seabed(ctx, by, t, { seed: 9 }); const pts = []; for (let x = -20; x <= W + 20; x += 20) pts.push([x, yAt(x) - 8]); cableLine(ctx, pts, 16, 0.4); }
  P.depthGauge(ctx, 110, 300, 1200, depthM, 4000, { step: 1000 });
  P.counter(ctx, 620, 560, 96, t, T.varios - 0.2, T.profundidad6 + 0.3, 0, 4000, { box: C.oro, c: C.abismo, prefix: '− ', suffix: ' m', fmt: (v) => v.toLocaleString('es-CO') });
  tag(ctx, 'profundidad media del océano ≈ 3.700 m', 620, 680, 25, sm(T.metros, T.metros + 0.4, t));
  tag(ctx, 'algunos cables pasan por fosas aún más hondas', 620, 725, 22, sm(T.profundidad6, T.profundidad6 + 0.4, t), 'rgba(200,225,245,0.8)');
 }, sfx(k) { FX.inmersion(k, TB.baja, 1.4); FX.bajoAgua(k, TB.baja + 0.8, T.pero7 - TB.baja, 1); FX.contador(k, T.varios - 0.2, T.profundidad6 + 0.3, 0, 40); FX.sonar(k, T.profundidad6 + 0.5, 0.6); } });
 // 5 · el interior del cable: corte transversal (de fuera hacia dentro)
 B.push({ t0: TB.corte, t1: TB.fibra, in: { type: 'zoom', d: 0.6, x: 540, y: 1240 }, draw(ctx, t) {
  P.ocean(ctx, t, 1, { snow: 70 }); P.glow(ctx, 420, 820, 520, '73,230,255', 0.12);
  const op = 0.26 + 0.74 * E.inOut(win(t, T.sorprendente, T.fibras8 + 0.2)), x = 360, y = 820, r = 270;
  const L = P.cableSection(ctx, x, y, r, { p: op, armor: false });
  const g = (id) => L.find((l) => l.id === id);
  callout(ctx, x + g('polietileno').r * 0.7, y - g('polietileno').r * 0.7, 680, 430, 'AISLANTE', 'polietileno', sm(T.sorprendente + 0.1, T.sorprendente + 0.4, t));
  callout(ctx, x + g('cobre').r, y, 680, 640, 'COBRE', 'energía p/ repetidores', sm(T.interior, T.interior + 0.3, t));
  callout(ctx, x + g('acero').r * 0.7, y + g('acero').r * 0.7, 680, 860, 'HILOS DE ACERO', 'resistencia', sm(T.estos8, T.estos8 + 0.3, t));
  callout(ctx, x, y + g('fibras').r * 0.4, 680, 1080, 'FIBRAS ÓPTICAS', 'en gel, dentro de un tubo', sm(T.fibras8, T.fibras8 + 0.3, t), C.cian);
  pill(ctx, 'LO MÁS SORPRENDENTE: SU INTERIOR', 540, 300, 36, t, T.pero7 + 0.1, C.oro, C.abismo, T.estos8 + 0.1);
  pill(ctx, 'FIBRA ÓPTICA', 540, 300, 48, t, T.fibras8, C.cian, C.abismo);
  tag(ctx, 'cable de aguas profundas · grosor parecido a una manguera de jardín', 540, 1250, 22, sm(T.contienen, T.contienen + 0.4, t));
  tag(ctx, 'cerca de la costa se añade armadura de acero', 540, 1295, 22, sm(T.contienen + 0.3, T.contienen + 0.7, t), 'rgba(200,225,245,0.8)');
 }, sfx(k) { FX.revelar(k, TB.corte + 0.1); k.play('sparkle', T.sorprendente, { gain: 0.35, n: 6 }); [T.sorprendente + 0.1, T.interior, T.estos8].forEach((x) => FX.etiqueta(k, x)); k.play('swish', T.contienen, { dur: 0.5, gain: 0.3 }); FX.aparece(k, T.fibras8, 820); FX.pulsoLuz(k, T.opticas, 3); } });
 // 6 · la fibra: vidrio finísimo; la luz va guiada en el núcleo como pulsos
 B.push({ t0: TB.fibra, t1: TB.luz, in: { type: 'zoom', d: 0.55, x: 360, y: 820 }, draw(ctx, t) {
  bg(ctx); P.glow(ctx, 540, 820, 700, '22,123,255', 0.12);
  const fa = sm(TB.fibra, TB.fibra + 0.5, t), la = sm(T.pulsos - 0.2, T.pulsos + 0.2, t);
  ctx.save(); ctx.globalAlpha = fa; P.fiber(ctx, -20, W + 20, 820, 300, t, { bits: la > 0 ? '1101001011' : '0', gap: 70, speed: 520, core: 0.3, a: 1 }); ctx.restore();
  callout(ctx, 220, 730, 120, 520, 'REVESTIMIENTO', 'vidrio (cladding)', sm(T.vidrio, T.vidrio + 0.3, t));
  callout(ctx, 760, 820, 640, 520, 'NÚCLEO', 'aquí viaja la luz', sm(T.filamentos + 0.2, T.filamentos + 0.5, t), C.cian);
  // comparación con un cabello
  const ca = sm(T.delgados - 0.1, T.delgados + 0.3, t); if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; P.rr(ctx, 150, 1060, 780, 230, 30, 'rgba(244,250,255,0.95)'); ctx.strokeStyle = '#6b4a2b'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(200, 1120); ctx.bezierCurveTo(400, 1100, 600, 1140, 880, 1110); ctx.stroke(); ctx.strokeStyle = C.azul; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(200, 1160); ctx.lineTo(880, 1160); ctx.stroke(); P.text(ctx, 'cabello', 230, 1095, 24, '#6b4a2b', { align: 'left' }); P.text(ctx, 'fibra', 230, 1185, 24, C.azul, { align: 'left' }); P.text(ctx, '≈ 0,125 mm de vidrio', 540, 1235, 40, C.abismo, { kind: 'title' }); ctx.restore(); }
  pill(ctx, 'VIDRIO FINÍSIMO', 540, 300, 44, t, T.vidrio, C.blanco, C.abismo, T.pulsos);
  pill(ctx, 'PULSOS DE LUZ', 540, 300, 50, t, T.pulsos, C.cian, C.abismo);
  tag(ctx, 'la luz queda atrapada en el núcleo y avanza guiada', 540, 1000, 24, la);
 }, sfx(k) { FX.revelar(k, TB.fibra + 0.1); k.play('ding', T.vidrio, { f: 'A6', gain: 0.12, minor: true }); FX.etiqueta(k, T.filamentos + 0.2); FX.etiqueta(k, T.vidrio); FX.aparece(k, T.delgados, 700); FX.sello(k, T.pulsos); FX.pulsoLuz(k, T.pulsos + 0.05, 8, 0.13); } });
 // 7 · los datos se convierten en luz modulada (no una letra por destello)
 const BITS = '0100100001101111011011000110000100100001';
 B.push({ t0: TB.luz, t1: TB.rep, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  bg(ctx);
  P.phone(ctx, 170, 640, 190, (x, y, w, h) => chat(ctx, x, y, w, h, t, T.mensaje10, '¡Hola!'));
  // bits que salen del celular
  const ba = sm(T.datos - 0.3, T.datos, t);
  if (ba > 0) { ctx.save(); ctx.globalAlpha = ba; ctx.font = '600 30px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; for (let i = 0; i < 9; i++) { const u = ((t - T.datos) * 0.7 + i / 9) % 1, bx = lerp(300, 470, u), by = 640 + Math.sin(i * 2.1) * 60; ctx.fillStyle = `rgba(255,212,71,${Math.sin(u * Math.PI)})`; ctx.fillText(BITS.slice(i * 4, i * 4 + 4), bx, by); } ctx.restore(); tag(ctx, 'DATOS (bits)', 385, 790, 24, ba); }
  // transmisor
  const ta = sm(T.equipos - 0.2, T.equipos + 0.2, t); if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; P.rr(ctx, 480, 540, 260, 200, 26, '#e9eef4', { sy: 10 }); P.text(ctx, 'TRANSMISOR', 610, 600, 30, C.abismo, { kind: 'title' }); P.text(ctx, 'láser + modulador', 610, 645, 24, '#3a5368'); P.circle(ctx, 610, 700, 14, t > T.convierten ? C.verde : C.gris); ctx.restore(); tag(ctx, 'EQUIPOS DE COMUNICACIÓN', 610, 500, 24, ta); }
  // salida: luz por la fibra
  const fa = sm(T.convierten, T.senales10, t); if (fa > 0) P.fiber(ctx, 740, W + 20, 640, 90, t, { bits: '1101001011', gap: 40, speed: 380, a: fa });
  // forma de onda: la intensidad / fase de la luz cambia
  const wa = sm(T.luminosas - 0.2, T.luminosas + 0.3, t); if (wa > 0) { ctx.save(); ctx.globalAlpha = wa; P.rr(ctx, 90, 860, 900, 330, 30, 'rgba(6,42,70,0.9)'); ctx.strokeStyle = C.cian; ctx.lineWidth = 5; ctx.beginPath(); for (let x = 0; x <= 820; x += 3) { const bi = BITS[Math.floor(((x + t * 160) / 41) % BITS.length)], amp = bi === '1' ? 90 : 30, yy = 1040 - Math.sin((x + t * 160) * 0.16) * amp; x ? ctx.lineTo(130 + x, yy) : ctx.moveTo(130 + x, yy); } ctx.stroke(); P.text(ctx, 'la luz se MODULA: cambia su intensidad y su fase', 540, 905, 27, C.blanco); ctx.restore(); tag(ctx, 'miles de millones de cambios por segundo, no una letra por destello', 540, 1235, 22, wa); }
  pill(ctx, 'DATOS → SEÑALES LUMINOSAS', 540, 300, 40, t, T.senales10, C.cian, C.abismo);
 }, sfx(k) { FX.aparece(k, TB.luz + 0.2, 600); k.play('typing', T.mensaje10 - 0.7, { n: 6, rate: 0.08, gain: 0.4 }); k.play('whoosh', T.mensaje10, { dur: 0.4, top: 3000, gain: 0.35 }); FX.datos(k, T.datos - 0.2, 16); FX.aparece(k, T.equipos, 520); k.play('boot', T.convierten, { gain: 0.6 }); FX.etiqueta(k, T.senales10); FX.pulsoLuz(k, T.luminosas, 10, 0.12, 0.8); } });
 // 8 · la luz pierde intensidad → repetidores (amplificadores ópticos) a lo largo del cable
 const REP = [380, 760];
 B.push({ t0: TB.rep, t1: TB.cruce, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  P.ocean(ctx, t, 1, { snow: 60 }); const yAt = P.seabed(ctx, 1150, t, { seed: 12 });
  const ra = sm(T.repetidores - 0.2, T.repetidores + 0.2, t), boost = ra > 0.5 ? REP : [];
  // cable con la fibra «a la vista» (ventana) para ver la luz
  const pts = []; for (let x = -20; x <= W + 20; x += 20) pts.push([x, yAt(x) - 12]); cableLine(ctx, pts, 18);
  P.fiber(ctx, -20, W + 20, 760, 120, t, { bits: '1110110101', gap: 44, speed: 330, att: 0.92 * sm(T.pierde - 0.2, T.intensidad, t), boost });
  ctx.save(); ctx.strokeStyle = 'rgba(244,250,255,0.35)'; ctx.setLineDash([8, 10]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 830); ctx.lineTo(W, 830); ctx.stroke(); ctx.restore();
  tag(ctx, 'VISTA INTERIOR DE LA FIBRA', 540, 670, 22, 0.8);
  // intensidad (barra) que cae a lo largo del tramo
  const ia = sm(T.pierde, T.intensidad + 0.3, t) * (1 - ra); if (ia > 0) { ctx.save(); ctx.globalAlpha = ia; ctx.fillStyle = C.naranja; ctx.beginPath(); ctx.moveTo(60, 920); ctx.lineTo(1020, 1000); ctx.lineTo(1020, 1010); ctx.lineTo(60, 1010); ctx.closePath(); ctx.fill(); ctx.restore(); tag(ctx, 'brillo de la señal: se debilita', 540, 1050, 24, ia); }
  if (ra > 0) REP.forEach((x, i) => { const a = sm(T.repetidores - 0.2 + i * 0.25, T.repetidores + 0.1 + i * 0.25, t); const g = 0.5 + 0.5 * Math.sin(t * 6 + i); ctx.save(); ctx.globalAlpha = a; P.repeater(ctx, x, yAt(x) - 14, 60, 0, sm(T.amplifican - 0.1, T.amplifican + 0.2, t) * g); ctx.strokeStyle = 'rgba(70,245,188,0.6)'; ctx.setLineDash([6, 8]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, yAt(x) - 40); ctx.lineTo(x, 830); ctx.stroke(); ctx.restore(); });
  pill(ctx, 'LA LUZ PIERDE INTENSIDAD', 540, 300, 40, t, T.pierde, C.naranja, C.abismo, T.repetidores);
  pill(ctx, 'REPETIDORES', 540, 300, 52, t, T.repetidores, C.verde, C.abismo);
  const ka = sm(T.amplifican - 0.1, T.amplifican + 0.3, t); if (ka > 0) { ctx.save(); ctx.globalAlpha = ka; P.rr(ctx, 120, 380, 840, 230, 30, 'rgba(244,250,255,0.95)'); P.text(ctx, 'AMPLIFICADOR ÓPTICO', 540, 440, 42, C.abismo, { kind: 'title' }); P.text(ctx, 'refuerza la luz sin pasarla a electricidad', 540, 500, 28, '#3a5368'); P.text(ctx, 'uno cada varias decenas de kilómetros', 540, 555, 28, '#3a5368'); ctx.restore(); }
  tag(ctx, 'ilustración: separación no a escala', 540, 1340, 22, ra * 0.8);
 }, sfx(k) { FX.bajoAgua(k, TB.rep, TB.cruce - TB.rep, 0.7); FX.pulsoLuz(k, TB.rep + 0.3, 6, 0.2, 0.7); k.play('riser', T.pierde, { dur: 1.2, gain: 0.15 }); k.tone(T.pierde, { f: [[0, 1200], [1.4, 500]], dur: 1.5, gain: 0.03, a: 0.1 }); FX.etiqueta(k, T.pierde); FX.aparece(k, T.repetidores, 600); FX.aparece(k, T.repetidores + 0.25, 680); FX.amplifica(k, T.amplifican); FX.amplifica(k, T.amplifican + 0.5, 0.7); FX.sello(k, T.repetidores + 0.05); } });
 // 9 · un océano en una fracción de segundo: ≈ 6.600 km ÷ ≈ 200.000 km/s ≈ 0,03 s → estación de aterrizaje
 const R9 = ROUTES.find((r) => r.id === 'atl-m').p;
 B.push({ t0: TB.cruce, t1: TB.barco, in: { type: 'iris', d: 0.6, x: 540, y: 760 }, draw(ctx, t) {
  bg(ctx); const proj = drawMap(ctx, MAP_ATL), pts = R9.map(proj);
  const go = E.inOut(win(t, T.cruzar - 0.1, T.oceano13 + 0.5)), L = P.cableRoute(ctx, pts, 1, t, { c: '73,230,255', w: 4, dots: 0 });
  if (L) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 6; k++) { const s = L.L * go - k * 18; if (s < 0) continue; const [x, y] = L.at(s); P.glow(ctx, x, y, 40 - k * 5, '244,250,255', 0.9 - k * 0.14); } ctx.restore(); }
  P.station(ctx, pts[0][0] - 20, pts[0][1] + 10, 70, { on: true }); P.station(ctx, pts[4][0] + 25, pts[4][1] + 6, 70, { on: go >= 1 });
  const ka = sm(T.fraccion - 0.2, T.fraccion + 0.2, t); if (ka > 0) { ctx.save(); ctx.globalAlpha = ka; P.rr(ctx, 110, 1000, 860, 280, 32, 'rgba(244,250,255,0.96)'); P.text(ctx, '≈ 6.600 km ÷ ≈ 200.000 km/s', 540, 1060, 38, '#3a5368'); P.text(ctx, '≈ 0,03 s', 540, 1140, 86, C.abismo, { kind: 'title' }); P.text(ctx, 'luz en la fibra ≈ 2/3 de su velocidad en el vacío', 540, 1225, 26, '#3a5368'); ctx.restore(); }
  pill(ctx, 'CRUZA EL OCÉANO', 540, 330, 44, t, T.cruzar, C.cian, C.abismo, T.fraccion);
  pill(ctx, 'EN UNA FRACCIÓN DE SEGUNDO', 540, 330, 40, t, T.fraccion, C.oro, C.abismo);
  tag(ctx, 'EE. UU. → ESPAÑA (cable transatlántico de ≈ 6.600 km)', 540, 420, 22, sm(T.cruzar, T.cruzar + 0.4, t));
  tag(ctx, 'llega a una estación en la costa y sigue por redes terrestres', 540, 1330, 22, sm(T.segundo + 0.1, T.segundo + 0.4, t));
 }, sfx(k) { FX.revelar(k, TB.cruce + 0.2); k.play('whoosh', T.cruzar - 0.1, { dur: 1.4, top: 3500, gain: 0.45 }); FX.pulsoLuz(k, T.cruzar, 4, 0.1); FX.ubicacion(k, T.oceano13 + 0.5); FX.aparece(k, T.fraccion - 0.1, 640); FX.tictac(k, T.fraccion, 2, 0.3); FX.sello(k, T.segundo); } });
 // 10 · barco cablero: suelta el cable de forma controlada hasta el fondo
 B.push({ t0: TB.barco, t1: TB.costa, in: { type: 'rise', d: 0.55 }, draw(ctx, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, SURF); sky.addColorStop(0, '#0b1d3a'); sky.addColorStop(1, '#3a6ea5'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, SURF + 20);
  P.ocean(ctx, t, 0.6, { y: SURF, h: HH - SURF, snow: 70 }); P.waves(ctx, SURF, t, { amp: 8 });
  const yAt = P.seabed(ctx, 1300, t, { seed: 21 });
  const adv = (t - TB.barco) * 14, shx = 470 - adv;
  // el cable: sale de la roldana de popa, baja en curva suave y queda en el fondo detrás del barco
  const [sx, sy] = P.ship(ctx, shx, SURF + 8, 190, t, { tanks: true });
  const td = sx + 360, pts = [[sx, sy], [sx + 40, sy + 120], [sx + 140, 900], [sx + 260, 1150], [td, yAt(td) - 8]]; const sp = P.spline(pts, 10); for (let x = td + 20; x <= W + 40; x += 20) sp.push([x, yAt(x) - 8]);
  cableLine(ctx, sp, 12);
  // movimiento del cable (marcas que bajan)
  const L = P.path(sp); for (let i = 0; i < 6; i++) { const s = ((t * 60 + i * L.L / 6) % L.L); const [mx, my] = L.at(s); P.circle(ctx, mx, my, 4, 'rgba(255,212,71,0.8)'); }
  pill(ctx, '¿CÓMO LOS COLOCAN?', 540, 300, 42, t, T.pero14 + 0.1, C.blanco, C.abismo, T.barcos);
  pill(ctx, 'BARCOS CABLEROS', 540, 300, 50, t, T.barcos, C.oro, C.abismo);
  callout(ctx, shx + 10, SURF - 80, 640, 400, 'TANQUES', 'el cable va enrollado', sm(T.barcos + 0.6, T.barcos + 0.9, t));
  callout(ctx, sx + 130, 900, 640, 980, 'SALIDA CONTROLADA', 'velocidad y tensión vigiladas', sm(T.cuidadosamente, T.cuidadosamente + 0.3, t), C.cian);
  tag(ctx, 'ESCALA NO REAL · el fondo está a kilómetros', 540, 1380, 22, sm(T.fondo15, T.fondo15 + 0.4, t));
 }, sfx(k) { FX.olas(k, TB.barco, TB.costa - TB.barco, 1); FX.motor(k, TB.barco + 0.3, TB.costa - TB.barco - 0.3, 0.8); FX.onomatopeya(k, T.pero14 + 0.1); FX.sello(k, T.barcos); FX.cabrestante(k, T.desenrollando - 0.2, 3.2, 0.8); FX.etiqueta(k, T.barcos + 0.9); FX.etiqueta(k, T.cuidadosamente); } });
 // 11 · cerca de la costa: más riesgo (anclas, pesca) → a menudo se entierra bajo el lecho marino
 B.push({ t0: TB.costa, t1: TB.rotura, in: { type: 'slide', d: 0.45 }, draw(ctx, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, SURF); sky.addColorStop(0, '#0b1d3a'); sky.addColorStop(1, '#3a6ea5'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, SURF + 20);
  P.ocean(ctx, t, 0.3, { y: SURF, h: HH - SURF, snow: 50 }); P.waves(ctx, SURF, t, { amp: 7, w: 900 });
  // costa a la derecha (playa y estación) y lecho que sube
  const bed = (x) => lerp(1250, 600, sm(560, 1000, x)) + Math.sin(x * 0.02) * 5;
  ctx.fillStyle = '#8a7650'; ctx.beginPath(); ctx.moveTo(0, HH); for (let x = 0; x <= W; x += 10) ctx.lineTo(x, bed(x)); ctx.lineTo(W, 560); ctx.lineTo(W, HH); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4a3f2c'; ctx.beginPath(); ctx.moveTo(0, HH); for (let x = 0; x <= W; x += 10) ctx.lineTo(x, bed(x) + 50); ctx.lineTo(W, HH); ctx.closePath(); ctx.fill();
  { const g = ctx.createLinearGradient(0, 1380, 0, 1700); g.addColorStop(0, 'rgba(3,19,34,0)'); g.addColorStop(1, 'rgba(3,19,34,0.85)'); ctx.fillStyle = g; ctx.fillRect(0, 1380, W, HH - 1380); }
  ctx.fillStyle = '#2f6b3a'; ctx.fillRect(960, 540, 140, 30); P.station(ctx, 1010, 545, 90, { on: true });
  // arado avanza hacia la costa; detrás, el cable queda enterrado (línea discontinua bajo el lecho)
  const px = lerp(80, 600, E.inOut(win(t, TB.costa + 0.3, T.protegerlos))), dug = sm(T.muchas - 0.3, T.entierran, t);
  const back = []; for (let x = -20; x <= px; x += 20) back.push([x, bed(x) + 30 * dug]); const front = []; for (let x = px; x <= W; x += 20) front.push([x, bed(x) + (x > 960 ? 30 : 0)]);
  ctx.save(); if (dug > 0.2) ctx.setLineDash([18, 10]); cableLine(ctx, back, 12); ctx.restore(); ctx.save(); ctx.globalAlpha = 0.35; cableLine(ctx, front, 10); ctx.restore();
  if (dug > 0) { ctx.save(); ctx.globalAlpha = dug; P.plow(ctx, px, bed(px), 120, t); ctx.strokeStyle = 'rgba(244,250,255,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px + 50, bed(px) - 60); ctx.lineTo(px + 120, SURF + 20); ctx.stroke(); P.ship(ctx, px + 220, SURF + 6, 110, t, { tanks: false, flip: true }); ctx.restore(); }
  // riesgos: ancla y red de pesca
  const ra = sm(T.riesgo - 0.2, T.riesgo + 0.2, t) * (1 - sm(T.muchas, T.muchas + 0.4, t)); if (ra > 0) { ctx.save(); ctx.globalAlpha = ra; P.anchor(ctx, 360, 900, 90, 0.3); ctx.strokeStyle = 'rgba(244,250,255,0.6)'; ctx.lineWidth = 2; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(560 + i * 30, 760); ctx.lineTo(540 + i * 34, 960); ctx.stroke(); } for (let j = 0; j < 6; j++) { ctx.beginPath(); ctx.moveTo(560, 760 + j * 34); ctx.lineTo(740, 760 + j * 34); ctx.stroke(); } ctx.restore(); tag(ctx, 'anclas y redes de pesca', 540, 1010, 26, ra, C.oro); }
  pill(ctx, 'CERCA DE LA COSTA: MÁS RIESGO', 540, 300, 38, t, T.costa, C.naranja, C.abismo, T.entierran);
  pill(ctx, 'ENTERRADO BAJO EL LECHO MARINO', 540, 300, 38, t, T.entierran, C.verde, C.abismo);
  callout(ctx, px, bed(px) + 20, 120, 1080, 'ARADO SUBMARINO', 'abre una zanja y entierra el cable', sm(T.lecho, T.lecho + 0.3, t));
  tag(ctx, 'en aguas profundas suele quedar apoyado en el fondo', 540, 1380, 22, sm(T.protegerlos, T.protegerlos + 0.4, t));
 }, sfx(k) { FX.olas(k, TB.costa, TB.rotura - TB.costa, 1.1); FX.etiqueta(k, T.costa); FX.alarma(k, T.riesgo, 2); FX.ancla(k, T.riesgo); FX.sello(k, T.entierran); FX.motor(k, T.muchas, T.protegerlos - T.muchas + 0.6, 1); k.noise(T.entierran, { dur: 2.2, color: 'brown', filter: 'lowpass', f: 500, gain: 0.12, a: 0.2, hold: 1.5 }); FX.etiqueta(k, T.lecho); } });
 // 12 · rotura y reparación: localizar → recuperar → empalmar → probar → devolver al fondo
 const STEPS = [['LOCALIZAR', () => T.localizarlo], ['RECUPERAR', () => T.recuperarlo], ['EMPALMAR', () => T.repararlo], ['PROBAR', () => T.medio], ['DEVOLVER', () => T.oceano19 + 0.2]];
 B.push({ t0: TB.rotura, t1: TB.vuelta, in: { type: 'iris', d: 0.6, x: 540, y: 900 }, draw(ctx, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, SURF); sky.addColorStop(0, '#0b1d3a'); sky.addColorStop(1, '#3a6ea5'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, SURF + 20);
  P.ocean(ctx, t, 0.75, { y: SURF, h: HH - SURF, snow: 70 }); P.waves(ctx, SURF, t, { amp: 8 });
  const yAt = P.seabed(ctx, 1300, t, { seed: 33 }), FXX = 540;
  const broke = t >= T.rompe, lift = E.inOut(win(t, T.recuperarlo, T.repararlo - 0.1)), fixed = t >= T.repararlo + 0.8, back = E.inOut(win(t, T.oceano19, T.oceano19 + 0.8));
  // cable: entero / roto / extremos que suben hasta el barco / reparado
  const shipX = lerp(-300, 540, E.out(win(t, T.barco19 - 0.2, T.barco19 + 0.9)));
  const liftY = (x) => { const d = Math.abs(x - FXX); const k = Math.max(0, 1 - d / 420); return lerp(yAt(x) - 8, SURF + 40 + d * 0.2, lift * (1 - back) * k * k * (3 - 2 * k)); };
  const left = [], right = []; for (let x = -20; x <= FXX - (broke && !fixed ? 18 : 0); x += 15) left.push([x, liftY(x)]); for (let x = FXX + (broke && !fixed ? 18 : 0); x <= W + 20; x += 15) right.push([x, liftY(x)]);
  const sig = !broke || fixed; cableLine(ctx, left, 14, sig ? 0.6 : 0); cableLine(ctx, right, 14, sig ? 0.6 : 0);
  if (sig) { P.cableRoute(ctx, left.concat(right), 1, t, { c: '73,230,255', w: 3, smooth: false, dots: 4, speed: 300, a: fixed ? sm(T.medio, T.medio + 0.3, t) : 1 }); }
  else P.cableRoute(ctx, left, 1, t, { c: '73,230,255', w: 3, smooth: false, dots: 2, speed: 300, a: 0.6 });
  if (fixed) { const [jx, jy] = [FXX, liftY(FXX)]; P.rr(ctx, jx - 34, jy - 18, 68, 36, 12, '#c9d2dc'); P.glow(ctx, jx, jy, 60, '70,245,188', 0.5 * (1 - back)); }
  // el ancla que se arrastra y rompe el cable
  const aa = sm(T.si19 - 0.2, T.si19 + 0.1, t) * (1 - sm(T.rompe + 0.8, T.rompe + 1.3, t)); if (aa > 0) { const ax = lerp(120, FXX + 40, E.inOut(win(t, T.si19, T.rompe))), ay = yAt(ax) - 40; ctx.save(); ctx.globalAlpha = aa; ctx.strokeStyle = 'rgba(200,210,220,0.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ax, ay - 70); ctx.lineTo(ax - 260, SURF); ctx.stroke(); P.anchor(ctx, ax, ay, 80, -0.6); ctx.restore(); }
  if (broke && t < T.rompe + 0.5) { const u = win(t, T.rompe, T.rompe + 0.5); P.glow(ctx, FXX, yAt(FXX), 160 * u + 30, '255,155,69', 0.9 * (1 - u)); }
  if (broke && !fixed) { const a = sm(T.rompe, T.rompe + 0.2, t) * (1 - sm(T.localizarlo, T.localizarlo + 0.3, t)); pill(ctx, 'SIN SEÑAL', 540, 1100, 40, t, T.rompe, C.rojo, C.blanco, T.localizarlo + 0.3); }
  // localizar: pulso de prueba desde la costa (izquierda) que vuelve desde la falla
  const la = sm(T.localizarlo - 0.2, T.localizarlo, t) * (1 - sm(T.recuperarlo, T.recuperarlo + 0.3, t)); if (la > 0) { ctx.save(); ctx.globalAlpha = la; const u = ((t - T.localizarlo) * 1.4) % 1, px = u < 0.5 ? lerp(0, FXX, u * 2) : lerp(FXX, 0, (u - 0.5) * 2); P.glow(ctx, px, yAt(px) - 8, 40, '255,212,71', 0.9); P.pin(ctx, FXX, yAt(FXX) - 30, 80, C.naranja); ctx.restore(); tag(ctx, 'pruebas desde tierra indican dónde está la falla', 540, 1380, 22, la * (1 - sm(T.recuperarlo - 0.4, T.recuperarlo - 0.1, t))); }
  // barco y garfio de recuperación
  if (t > T.barco19 - 0.3) { P.ship(ctx, shipX, SURF + 8, 170, t, { tanks: false }); }
  const ga = sm(T.localizarlo + 0.2, T.recuperarlo, t) * (1 - sm(T.repararlo - 0.3, T.repararlo, t)); if (ga > 0) { const gy = lerp(SURF + 40, yAt(FXX) - 30, sm(T.localizarlo + 0.2, T.recuperarlo, t) * (1 - lift)) ; ctx.save(); ctx.globalAlpha = ga; ctx.strokeStyle = 'rgba(230,236,244,0.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(shipX + 170, SURF - 20); ctx.lineTo(FXX, gy - 40); ctx.stroke(); P.grapnel(ctx, FXX, gy, 50); ctx.restore(); tag(ctx, 'a esa profundidad no bajan buzos: se usa un garfio o un ROV', 540, 1380, 22, ga * sm(T.recuperarlo, T.recuperarlo + 0.3, t)); }
  // empalme en cubierta (lupa)
  const ea = sm(T.repararlo - 0.1, T.repararlo + 0.2, t) * (1 - sm(T.oceano19, T.oceano19 + 0.4, t)); if (ea > 0) { ctx.save(); ctx.globalAlpha = ea; P.lens(ctx, 780, 840, 170, 1, () => { ctx.fillStyle = '#e9eef4'; ctx.fillRect(560, 620, 440, 440); cableLine(ctx, [[600, 850], [745, 850]], 22); cableLine(ctx, [[815, 850], [960, 850]], 22); const j = sm(T.repararlo + 0.2, T.repararlo + 0.8, t); ctx.fillStyle = '#8799A8'; ctx.fillRect(780 - 70 * j, 826, 140 * j, 48); if (j < 1 && j > 0) { const R = H.rng(Math.floor(t * 20)); for (let i = 0; i < 6; i++) P.glow(ctx, 780 + R.range(-20, 20), 850 + R.range(-20, 20), 20, '255,212,71', 0.8); } if (t > T.medio) P.check(ctx, 780, 960, 60, E.out(win(t, T.medio, T.medio + 0.4)), '#2fbf71'); }); ctx.restore(); }
  // pasos
  if (t > T.localizarlo - 0.3) STEPS.forEach(([s, f], i) => { const x = 116 + i * 212, on = t >= f(), a = sm(T.localizarlo - 0.3, T.localizarlo, t); ctx.save(); ctx.globalAlpha = a * (on ? 1 : 0.45); P.rr(ctx, x - 100, 270, 200, 64, 32, on ? C.oro : 'rgba(244,250,255,0.2)'); P.text(ctx, (i + 1) + '. ' + s, x, 304, 23, on ? C.abismo : C.blanco); ctx.restore(); });
  pill(ctx, '¡ALGO INCREÍBLE!', 540, 300, 46, t, T.y18 + 0.15, C.oro, C.abismo, T.si19 + 0.3);
  pill(ctx, 'REPARACIÓN', 540, 385, 40, t, T.repararlo, C.verde, C.abismo);
 }, sfx(k) {
  FX.bajoAgua(k, TB.rotura, TB.vuelta - TB.rotura, 0.6); FX.olas(k, TB.rotura, TB.vuelta - TB.rotura, 0.6); FX.onomatopeya(k, T.y18 + 0.15); k.play('sparkle', T.increible, { gain: 0.3, n: 5 });
  k.noise(T.si19, { dur: T.rompe - T.si19, color: 'brown', filter: 'lowpass', f: 400, gain: 0.14, a: 0.2 }); FX.ancla(k, T.si19 - 0.3); FX.rotura(k, T.rompe); FX.alarma(k, T.rompe + 0.3, 2);
  FX.motor(k, T.barco19 - 0.2, 1.4, 1); FX.olas(k, T.barco19 - 0.2, 1.5, 1.2); FX.etiqueta(k, T.localizarlo); FX.sonar(k, T.localizarlo + 0.1, 0.5); FX.cabrestante(k, T.recuperarlo, 1.1, 0.9);
  FX.etiqueta(k, T.recuperarlo); FX.etiqueta(k, T.repararlo); FX.empalme(k, T.repararlo + 0.2, 0.6); FX.correcto(k, T.medio); FX.etiqueta(k, T.oceano19 + 0.2); k.play('whoosh', T.oceano19, { dur: 0.8, top: 900, gain: 0.25, minor: true });
 } });
 // 13 · regreso: el mensaje, el clic y la red gigantesca escondida bajo el mar
 B.push({ t0: TB.vuelta, t1: TB.cierre, in: { type: 'zoom', d: 0.6, x: 540, y: 860 }, draw(ctx, t) {
  bg(ctx);
  const ma = sm(T.mundo - 0.3, T.mundo + 0.4, t);
  if (ma > 0) { ctx.save(); ctx.globalAlpha = ma; const proj = drawMap(ctx, MAP_MUNDO); const all = sm(T.gigantesca - 0.3, T.gigantesca + 0.3, t);
   ROUTES.forEach((r, i) => P.cableRoute(ctx, routePx(proj, r), E.inOut(win(t, T.mundo + i * 0.08, T.mundo + 0.8 + i * 0.08)), t, { c: '73,230,255', w: 3 + 2 * all, dots: 2, speed: 180 }));
   const [ax, ay] = proj([-74.1, 4.7]), [bx, by] = proj([-3.7, 40.4]); P.dot(ctx, ax, ay, 10, t, C.azul); P.pin(ctx, bx, by, 50, C.naranja); ctx.restore();
   const ea = sm(T.escondida - 0.2, T.escondida + 0.4, t); if (ea > 0) { ctx.save(); ctx.globalAlpha = ea * 0.55; const g = ctx.createLinearGradient(0, 560, 0, 1160); g.addColorStop(0, 'rgba(22,123,255,0)'); g.addColorStop(1, 'rgba(22,123,255,0.5)'); ctx.fillStyle = g; ctx.fillRect(0, 560, W, 600); ctx.restore(); }
  }
  // el celular: envía y luego pasa a esquina; el dedo hace «clic»
  const sh = E.inOut(win(t, T.otro20, T.mundo + 0.4)), ps = lerp(1, 0.42, sh), px = lerp(540, 850, sh), py = lerp(840, 1330, sh);
  ctx.save(); ctx.translate(px, py); ctx.scale(ps, ps); ctx.translate(-540, -840); P.phone(ctx, 540, 840, 420, (x, y, w, h) => chat(ctx, x, y, w, h, t, T.mensaje20, '¡Ya llegué!')); ctx.restore();
  if (t > T.mensaje20 && t < T.mundo + 0.5) envelope(ctx, lerp(540, 500, sh), lerp(520, 700, sh), 60 * (1 - sh * 0.4), 1 - sm(T.mundo, T.mundo + 0.5, t));
  // clic: el dedo pulsa el botón de enviar del celular pequeño
  const fa = sm(T.detras, T.detras + 0.3, t) * (1 - sm(T.gigantesca, T.gigantesca + 0.3, t)); if (fa > 0) { const bxp = px + (540 + 420 * 0.86 / 1 - 540 - 420 * 0.5 + 420 * 0.045) * ps, byp = py + (840 + 420 * 2.05 * 0.415) * ps - 840 * ps; const press = win(t, T.clic - 0.15, T.clic) * (1 - win(t, T.clic + 0.05, T.clic + 0.3)); ctx.save(); ctx.globalAlpha = fa; P.finger(ctx, bxp + 30, byp + 10 + 30 * (1 - press), 90, press); ctx.restore(); if (t > T.clic) P.rings(ctx, bxp, byp, t, { r: 90, n: 2, period: 0.9, c: '70,245,188', a: 0.8 * (1 - sm(T.clic + 0.8, T.clic + 1.4, t)) }); }
  pill(ctx, 'AL OTRO LADO DEL MUNDO', 540, 340, 40, t, T.otro20, C.cian, C.abismo, T.detras);
  pill(ctx, 'DETRÁS DE UN SIMPLE CLIC…', 540, 340, 40, t, T.simple, C.blanco, C.abismo, T.gigantesca);
  pill(ctx, 'UNA RED GIGANTESCA DE CABLES', 540, 340, 40, t, T.gigantesca, C.oro, C.abismo);
  pill(ctx, 'ESCONDIDA BAJO EL MAR', 540, 440, 40, t, T.escondida, C.cian, C.abismo);
 }, sfx(k) { FX.aparece(k, TB.vuelta + 0.2, 560); k.play('typing', T.envies - 0.3, { n: 8, rate: 0.08, gain: 0.45 }); k.play('whoosh', T.mensaje20, { dur: 0.6, top: 3000, gain: 0.45 }); FX.revelar(k, T.mundo - 0.2); FX.pulsoLuz(k, T.mundo, 6, 0.15, 0.8); FX.clic(k, T.clic); FX.ubicacion(k, T.clic + 0.1); k.play('riser', T.gigantesca - 0.5, { dur: 1.0, gain: 0.3 }); FX.sello(k, T.gigantesca + 0.4); FX.inmersion(k, T.escondida, 1.2); } });
 // 14 · cierre: «Sigue a Asombroteca»
 B.push({ t0: TB.cierre, t1: DURATION + 1, in: { type: 'iris', d: 0.6, x: 540, y: 960 }, draw(ctx, t) {
  P.ocean(ctx, t, 0.85, { snow: 80 }); const yAt = P.seabed(ctx, 1450, t, { seed: 5 }); const pts = []; for (let x = -20; x <= W + 20; x += 20) pts.push([x, yAt(x) - 8]); cableLine(ctx, pts, 14, 0.8); P.cableRoute(ctx, pts, 1, t, { c: '73,230,255', w: 3, smooth: false, dots: 5, speed: 300 });
  P.withPop(ctx, t, T.sigue + 0.1, 540, 820, () => { P.rr(ctx, 110, 720, 860, 220, 40, C.blanco, { sy: 16 }); P.text(ctx, 'ASOMBROTECA', 540, 810, 96, C.abismo, { kind: 'title' }); P.text(ctx, 'la ciencia oculta de lo cotidiano', 540, 888, 34, '#3a5368'); });
  const press = win(t, T.asombroteca + 1.0, T.asombroteca + 1.2), done = t > T.asombroteca + 1.15;
  P.withPop(ctx, t, T.asombroteca + 0.2, 540, 1080, () => { P.rr(ctx, 330, 1030, 420, 100, 50, done ? '#2fbf71' : C.oro, { sy: 10 * (1 - press) }); P.text(ctx, done ? 'SIGUIENDO ✓' : 'SEGUIR', 540, 1082, 44, C.abismo); });
  if (t > T.asombroteca + 0.4) P.finger(ctx, 610, lerp(1500, 1100, E.out(win(t, T.asombroteca + 0.4, T.asombroteca + 1.0))), 110, press * (1 - win(t, T.asombroteca + 1.3, T.asombroteca + 1.6)));
 }, sfx(k) { FX.sello(k, T.sigue + 0.1); FX.aparece(k, T.asombroteca + 0.2, 700); FX.clic(k, T.asombroteca + 1.15); k.play('ding', T.asombroteca + 1.2, { f: 'A5', gain: 0.3 }); FX.fin(k, T.asombroteca + 1.5); } });

 const EP = PL.make({
  skin: 'plana', align: A, duration: DURATION, beats: B, capStyle: 'barra', capY: 1540,
  keywords: ['continente', 'océano', 'satélites', ['cables', T.cables2 - 0.1, T.submarinos + 0.6], 'submarinos', 'profundidad', 'fibras', 'ópticas', 'vidrio', 'pulsos', 'luz', 'luminosas', 'repetidores', 'amplifican', 'segundo', 'barcos', 'entierran', 'rompe', 'repararlo', 'clic', 'mar', 'Asombroteca'],
  ambience(k) { k.noise(0, { dur: DURATION, color: 'brown', filter: 'lowpass', f: 180, gain: 0.035, a: 1, hold: DURATION - 2 }); },
  music(k) {
   const C1 = [['D3', 'A3', 'F4', 'C5'], ['Bb2', 'F3', 'D4', 'A4'], ['F2', 'C3', 'A3', 'E4'], ['C3', 'G3', 'E4', 'G4']];
   k.music('pad', 0, T.pero7, { bpm: 92, gain: 0.4, chords: C1 });
   k.music('pulse', T.pero7, T.pero14, { bpm: 104, gain: 0.22, chords: [['A2', 'E3', 'C4', 'G4'], ['F2', 'C3', 'A3', 'E4'], ['C3', 'G3', 'E4', 'B4'], ['G2', 'D3', 'B3', 'D4']] });
   k.music('pad', T.pero14, T.y18, { bpm: 96, gain: 0.36, chords: C1 });
   k.music('pulse', T.y18, T.asi20, { bpm: 110, gain: 0.24, chords: [['D3', 'A3', 'F4', 'C5'], ['C3', 'G3', 'E4', 'G4'], ['Bb2', 'F3', 'D4', 'A4'], ['A2', 'E3', 'C#4', 'E4']] });
   k.music('pad', T.asi20, DURATION, { bpm: 96, gain: 0.38, chords: [['F2', 'C3', 'A3', 'E4'], ['G2', 'D3', 'B3', 'D4'], ['D3', 'A3', 'F4', 'C5']] });
  },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => {}, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
