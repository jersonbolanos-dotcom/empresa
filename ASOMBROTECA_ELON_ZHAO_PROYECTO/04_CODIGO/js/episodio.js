// =====================================================================================================
// episodio.js — «Musk vs Zhao» · Editorial Essay Collage vertical 1080x1920 (Asombroteca)
// Motor: window.EditorCollageCore (02_REFERENCIA_KIT/styles/editorial-collage-core-adaptado.js, sin modificar)
// + lib/harness.js (H) y lib/sound.js (SOUND) sin modificar.
// Reloj global = segundos de la voz original (window.ALIGN). Determinista: azar solo con H.rng/H.makeNoise.
// Recortes a 12 fps (q12/arrive); cámara continua a 30 fps; latigazos (whip) solo en cambios de argumento.
// =====================================================================================================
(function () {
 const EC = window.EditorCollageCore, A = window.ALIGN;
 const { PALETTE: PAL, q12, edgePoly, sprite, drawSpr, shadowFill, texture, treat, makePrint, makeStrip, arrive, hilite, tape, marker, loopPts, inkArrow, finish, fibre } = EC;
 // ADAPTACIÓN VERTICAL (documentada): el place() del núcleo desplaza cada capa por cam.x*depth en coordenadas absolutas,
 // lo que descoloca regiones alejadas del origen. Aquí el parallax es relativo a la cámara: desplazamiento = (pos - cam)*depth.
 function place(c, cam, depth, x, y, rot, s, fn) { c.save(); c.translate(W / 2, HH / 2); const k = Math.pow(cam.z, depth); c.scale(k, k); c.translate((x - cam.x) * depth, (y - cam.y) * depth); if (rot) c.rotate(rot); if (s !== 1) c.scale(s, s); fn(c); c.restore(); }
 function putSpr(c, cam, depth, spr, x, y, rot, s, tq, a, kind = 'drop', extra) { const A2 = arrive(tq, a, kind); if (!A2) return false; place(c, cam, depth, x + A2.dx, y + A2.dy, rot + A2.r, s * A2.s, (cc) => { drawSpr(cc, spr); if (extra) extra(cc); }); return true; }
 function block(c, cam, d, x, y, w, h, rot, col, seed, torn = [0, 0, 0, 0]) { place(c, cam, d, x, y, rot, 1, (cc) => { const p = edgePoly(w, h, torn, seed); shadowFill(cc, p, col); texture(cc, p, 0.55, seed * 40 % 300); }); }
 function bgPaper(c, cam) { c.fillStyle = PAL.PAPER; c.fillRect(0, 0, W, HH); const fx = ((-cam.x * 0.2) % 640 + 640) % 640, fy = ((-cam.y * 0.2) % 640 + 640) % 640; c.save(); c.globalCompositeOperation = 'multiply'; const f = fibre(); c.drawImage(f, fx - 640, fy - 640); c.drawImage(f, fx - 640 + f.width, fy - 640); c.drawImage(f, fx - 640, fy - 640 + f.height); c.drawImage(f, fx - 640 + f.width, fy - 640 + f.height); c.restore(); }
 const W = 1080, HH = 1920, TAU = Math.PI * 2;
 const DURATION = +(A.duration + 1.0).toFixed(3); // audio + cola visual de 1 s (la voz no se modifica)
 const sm = (a, b, x) => H.smooth(a, b, x), io = (x) => H.ease.inOut(H.clamp(x)), eo = (x) => H.ease.out(H.clamp(x));
 const F = { anton: (px) => `400 ${px}px "Anton"`, osw: (px, w = 700) => `${w} ${px}px "Oswald"`, bask: (px, w = 700) => `${w} ${px}px "Libre Baskerville"`, baskI: (px) => `italic 400 ${px}px "Libre Baskerville"` };
 const BIN = '#f0b90b';

 // ---------- tiempos desde la voz ----------
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0, end = false) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return end ? w.e : w.s; k++; } throw new Error('palabra no encontrada ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  elon: wt(0, 'elon'), burlo: wt(0, 'burló'), robo: wt(0, 'robo'), binance0: wt(0, 'binance'),
  fundador1: wt(1, 'fundador'), respondio: wt(1, 'respondió'), inversion1: wt(1, 'inversión'), mil1: wt(1, 'mil'), dolares1: wt(1, 'dólares'),
  todo: SG(2).s, binance2: wt(2, 'binance'), ataque: wt(2, 'ataque'), seis: wt(2, 'seis'), dolares2: wt(2, 'dólares'),
  mientras: SG(3).s, prometia: wt(3, 'prometía'), usuarios: wt(3, 'usuarios'), comparo: wt(3, 'comparó'), quiebra: wt(3, 'quiebra'), ftx: wt(3, 'ftx'),
  musk4: SG(4).s, mueca: wt(4, 'mueca'), despues: wt(4, 'después'), emojis4: wt(4, 'emojis'), risa: wt(4, 'risa'), fuego: wt(4, 'fuego'),
  pero5: SG(5).s, changpeng: wt(5, 'changpeng'), fundador5: wt(5, 'fundador'), callado: wt(5, 'callado'),
  escribio: SG(6).s, q1: SG(7).s, q2: SG(8).s, momento: wt(8, 'momento'), burlarte: wt(8, 'burlarte'), q3: SG(9).s, detente: wt(9, 'detente'),
  sorpresa0: SG(10).s, sorpresa: wt(10, 'sorpresa'),
  recordo: SG(11).s, invertido: wt(11, 'invertido'), quinientos: wt(11, 'quinientos'), ayudar: wt(11, 'ayudar'), twitter: wt(11, 'twitter'),
  segun: SG(12).s, vinculada: wt(12, 'vinculada'), acciones: wt(12, 'acciones'), spacex: wt(12, 'spacex'), valoradas: wt(12, 'valoradas'), mil12: wt(12, 'mil'),
  aunque: SG(13).s, aseguro: wt(13, 'aseguró'), venderlas: wt(13, 'venderlas'), cubrir: wt(13, 'cubrir'), perdidas: wt(13, 'pérdidas'),
  lo14: SG(14).s, emojis14: wt(14, 'emojis'), termino: wt(14, 'terminó'), discusion: wt(14, 'discusión'), multi: wt(14, 'multimillonarios'),
  lado0: SG(15).s, lado: wt(15, 'lado'), end: A.speech_end,
 };
 // cortes de argumento (latigazo con desenfoque) y deslizamiento de hoja
 const WHIPS = [T.todo - 0.36, T.musk4 - 0.2, T.aunque - 0.2, T.lo14 - 0.25];
 const SHEET = [T.pero5 - 0.4, T.pero5 + 0.1]; // hoja nueva que sube a 12 fps

 // ---------- recursos (logos SVG oficiales, emojis Twemoji, fotos si existen) ----------
 const IMG = {};
 const LP = {}; const logoPath = (k) => LP[k] || (LP[k] = new Path2D(window.LOGOS[k]));
 async function init() {
  const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  for (const k in window.EMOJI) IMG[k] = await load(window.EMOJI[k]);
  const FO = window.FOTOS || {};
  for (const k in FO) if (FO[k]) IMG['foto_' + k] = await load(FO[k].src);
 }
 const C = {}; const cache = (k, fn) => C[k] || (C[k] = fn());

 // ---------- sprites del episodio (todos con edgePoly/shadowFill/texture/treat/makePrint del motor) ----------
 function logoChip(key, col, size, seed, bg) {
  return cache('chip' + key + size, () => sprite(size, size, 30, (c) => {
   const p = edgePoly(size, size, [1, 1, 1, 1], seed, 4); shadowFill(c, p, bg || PAL.CARD); texture(c, p, 0.5, seed * 31 % 300);
   c.save(); const s = size * 0.62 / 24; c.translate(-12 * s, -12 * s); c.scale(s, s); c.fillStyle = col; c.fill(logoPath(key)); c.restore();
  }));
 }
 // retrato: foto real tratada (halftone duotono + borde rasgado) o, si no hay foto con licencia, ficha tipográfica (sin rostro inventado)
 function portrait(who) {
  return cache('por' + who, () => {
   const info = who === 'musk' ? { name: ['ELON', 'MUSK'], handle: '@elonmusk', role: 'empresario', seed: 41 } : { name: ['CHANGPENG', 'ZHAO'], handle: '@cz_binance', role: 'fundador de Binance', seed: 57 };
   const img = IMG['foto_' + who];
   if (img) {
    const fo = (window.FOTOS || {})[who] || {};
    const w = 400, h = Math.round(w * (fo.crop ? fo.crop[3] / fo.crop[2] : img.height / img.width));
    const src = H.layer(w, h), sc = src.getContext('2d');
    if (fo.crop) sc.drawImage(img, fo.crop[0], fo.crop[1], fo.crop[2], fo.crop[3], 0, 0, w, h); else sc.drawImage(img, 0, 0, w, h);
    const pr = makePrint(treat(src, w, h, info.seed, { cell: 4, mix: 0.4, con: 1.2 }), info.seed, [0, 1, 1, 0], 14, 7);
    pr.photo = true; pr.info = info; return pr;
   }
   const w = 400, h = 520;
   const s = sprite(w, h, 34, (c) => {
    const p = edgePoly(w, h, [0, 1, 1, 0], info.seed, 6); shadowFill(c, p, '#f8f5ee'); texture(c, p, 0.35, info.seed * 13 % 400);
    c.save(); c.beginPath(); p.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.clip();
    // trama halftone abstracta (no es un rostro)
    const r = H.rng(info.seed);
    for (let y = -h / 2 + 14; y < h / 2 - 120; y += 9) for (let x = -w / 2 + 14; x < w / 2 - 14; x += 9) { const v = 0.5 + 0.5 * Math.sin(x * 0.012 + y * 0.009 + info.seed) * Math.cos(y * 0.014); const rad = 1 + 3.2 * v * (0.8 + 0.2 * r()); c.fillStyle = 'rgba(26,24,22,0.55)'; c.beginPath(); c.arc(x, y, rad, 0, TAU); c.fill(); }
    c.fillStyle = 'rgba(240,233,217,0.82)'; c.fillRect(-w / 2, -h / 2 + 60, w, 250);
    c.fillStyle = PAL.INK; c.textAlign = 'center';
    info.name.forEach((ln, i) => { let px = 104; c.font = F.anton(px); while (c.measureText(ln).width > w - 50) { px -= 4; c.font = F.anton(px); } c.fillText(ln, 0, -h / 2 + 170 + i * 112); });
    c.fillStyle = PAL.INK; c.fillRect(-w / 2, h / 2 - 110, w, 110);
    c.fillStyle = '#f3efe5'; c.font = F.osw(40); c.fillText(info.handle, 0, h / 2 - 60); c.font = F.baskI(24); c.fillText(info.role, 0, h / 2 - 24);
    c.restore();
   });
   s.photo = false; s.info = info; return s;
  });
 }
 function nameTag(who) { return cache('tag' + who, () => makeStrip(who === 'musk' ? 'ELON MUSK' : 'CHANGPENG ZHAO', F.anton(54), { bg: PAL.INK, fg: '#f3efe5', seed: who === 'musk' ? 5 : 6 })); }
 // tarjeta de publicación: EXTRACTO EDITORIAL (no imita la interfaz de X: sin avatar, likes ni verificaciones)
 function post(key, o) {
  return cache('post' + key, () => {
   const w = o.w || 860, lines = o.body || [], bodyPx = o.bodyPx || 50, lh = bodyPx * 1.42;
   const emH = o.emoji ? 190 : 0, h = 130 + 70 + emH + lines.length * lh + 150;
   const rects = {};
   const spr = sprite(w, h, 36, (c) => {
    const p = edgePoly(w, h, [0, 1, 1, 1], o.seed || 9, 5); shadowFill(c, p, PAL.NEWS); texture(c, p, 0.7, (o.seed || 9) * 17 % 300);
    let y = -h / 2;
    c.fillStyle = PAL.INK; c.fillRect(-w / 2 + 20, y + 20, w - 40, 86);
    c.fillStyle = '#f3efe5'; c.font = F.osw(50); c.textAlign = 'left'; c.fillText(o.title, -w / 2 + 44, y + 82);
    y += 150; c.fillStyle = PAL.INK; c.font = F.osw(42); c.fillText(o.handle, -w / 2 + 44, y);
    c.fillStyle = PAL.RED; c.font = F.osw(36, 500); c.textAlign = 'right'; c.fillText(o.date, w / 2 - 44, y); c.textAlign = 'left';
    c.fillStyle = PAL.RED; c.fillRect(-w / 2 + 44, y + 18, w - 88, 3);
    y += 40;
    if (o.emoji) { const n = o.emoji.length, sz = 160; o.emoji.forEach((k, i) => { const ex = (i - (n - 1) / 2) * 200; rects['emo' + i] = [ex - sz / 2, y + 10, sz, sz]; if (!o.emojiLate) c.drawImage(IMG[k], ex - sz / 2, y + 10, sz, sz); }); y += emH; }
    c.fillStyle = PAL.INK; c.font = o.bodyFont || F.bask(bodyPx);
    lines.forEach((ln) => { y += lh; c.fillText(ln, -w / 2 + 50, y); (o.marks || []).forEach((mk) => { const i = ln.indexOf(mk); if (i >= 0) rects[mk] = [-w / 2 + 50 + c.measureText(ln.slice(0, i)).width - 6, y - bodyPx * 0.92, c.measureText(mk).width + 12, bodyPx * 1.12]; }); });
    y += 40;
    if (o.band) { c.fillStyle = 'rgba(255,226,38,0.85)'; c.fillRect(-w / 2 + 40, y - 34, w - 80, 48); c.fillStyle = PAL.INK; c.font = F.osw(30, 500); c.fillText(o.band, -w / 2 + 54, y); }
    y += 58; c.fillStyle = PAL.RED; c.font = F.osw(30, 700); c.fillText(o.tag, -w / 2 + 44, y);
    y += 36; c.fillStyle = 'rgba(26,24,22,0.75)'; c.font = F.osw(24, 400); c.fillText(o.url, -w / 2 + 44, y);
   });
   spr.rects = rects; return spr;
  });
 }
 function news(key, o) {
  return cache('news' + key, () => {
   const w = o.w || 760, h = o.h || 560, rects = {};
   const spr = sprite(w, h, 34, (c) => {
    const p = edgePoly(w, h, [0, 1, 1, 1], o.seed || 25, 5); shadowFill(c, p, PAL.NEWS); texture(c, p, 0.8);
    c.save(); c.beginPath(); p.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.clip();
    let y = -h / 2 + 52; const left = -w / 2 + 34;
    c.font = F.osw(30, 500); c.fillStyle = PAL.INK; c.fillText(o.kicker, left, y); y += 22; c.fillRect(left, y, w - 68, 3); y += 74;
    c.font = F.bask(o.headPx || 62);
    for (const ln of o.head) { c.fillText(ln, left, y); (o.marks || []).forEach((mk) => { const i = ln.indexOf(mk); if (i >= 0) rects[mk] = [left + c.measureText(ln.slice(0, i)).width - 8, y - (o.headPx || 62) * 0.9, c.measureText(mk).width + 16, (o.headPx || 62) * 1.1]; }); y += (o.headPx || 62) * 1.18; }
    c.font = F.baskI(30); for (const ln of o.deck || []) { c.fillText(ln, left, y + 12); y += 42; }
    c.fillStyle = 'rgba(50,45,40,0.6)'; for (let col = 0; col < 2; col++) for (let i = 0; i < 9; i++) { const rr = H.rng((o.seed || 25) + col * 17 + i); c.fillRect(left + col * (w - 60) / 2, y + 40 + i * 18, (w - 90) / 2 * (0.45 + rr() * 0.55), 5); }
    c.restore();
   });
   spr.rects = rects; return spr;
  });
 }
 const strip = (key, text, font, o) => cache('strip' + key, () => makeStrip(text, font, o || {}));
 function emojiChip(k, size, seed) { return cache('emo' + k + size, () => sprite(size, size, 26, (c) => { const p = edgePoly(size, size, [1, 1, 1, 1], seed, 4); shadowFill(c, p, PAL.CARD); texture(c, p, 0.4); c.drawImage(IMG[k], -size * 0.4, -size * 0.4, size * 0.8, size * 0.8); })); }
 function shareDoc() {
  return cache('share', () => sprite(560, 380, 34, (c) => {
   const p = edgePoly(560, 380, [1, 0, 1, 0], 77, 5); shadowFill(c, p, '#efe6c9'); texture(c, p, 0.6);
   c.strokeStyle = PAL.INK; c.lineWidth = 4; c.strokeRect(-250, -160, 500, 320); c.lineWidth = 1.5; c.strokeRect(-238, -148, 476, 296);
   c.fillStyle = PAL.INK; c.textAlign = 'center'; c.font = F.osw(30, 500); c.fillText('CERTIFICADO DE ACCIONES · ILUSTRATIVO', 0, -100);
   c.font = F.anton(96); c.fillText('SPCX', 0, 10);
   c.save(); c.translate(0, 80); const s = 120 / 24; c.translate(-12 * s, -12 * s); c.scale(s, s); c.fill(logoPath('spacex')); c.restore();
  }));
 }

 // ---------- cámara: regiones del «escritorio» + latigazos ----------
 const RX = [0, 1500, 3000, 4500, 6000, 7500];
 const KEYS = [
  { t: 0, x: 0, y: -40, z: 1.02 }, { t: T.mil1 - 0.4, x: 0, y: -20, z: 1.08 }, { t: WHIPS[0], x: 10, y: -10, z: 1.1 },
  { t: WHIPS[0] + 0.32, x: RX[1], y: -260, z: 1.06 }, { t: T.dolares2 + 0.3, x: RX[1], y: -200, z: 1.12 },
  { t: T.prometia, x: RX[1], y: 360, z: 1.02 }, { t: T.comparo, x: RX[1], y: 560, z: 0.9 }, { t: WHIPS[1], x: RX[1], y: 620, z: 0.9 },
  { t: WHIPS[1] + 0.32, x: RX[2], y: -160, z: 1.0 }, { t: T.fuego + 0.3, x: RX[2], y: -120, z: 1.03 },
  { t: SHEET[1], x: RX[3], y: -480, z: 1.0 }, { t: T.callado + 0.3, x: RX[3], y: -420, z: 1.03 },
  { t: T.escribio + 0.3, x: RX[3], y: 40, z: 1.0 }, { t: T.q3 + 1.0, x: RX[3], y: 60, z: 1.05 },
  { t: T.sorpresa, x: RX[3], y: 360, z: 1.0 }, { t: T.quinientos, x: RX[3], y: 660, z: 1.02 }, { t: T.ayudar, x: RX[3], y: 900, z: 1.0 }, { t: T.twitter + 0.5, x: RX[3], y: 920, z: 1.0 },
  { t: T.spacex - 0.4, x: RX[3], y: 1440, z: 1.0 }, { t: WHIPS[2], x: RX[3], y: 1470, z: 1.03 },
  { t: WHIPS[2] + 0.32, x: RX[4], y: -80, z: 1.0 }, { t: T.perdidas, x: RX[4], y: -40, z: 1.04 },
  { t: WHIPS[3], x: RX[4], y: -30, z: 1.05 }, { t: WHIPS[3] + 0.32, x: RX[5], y: -120, z: 1.08 }, { t: T.multi + 0.5, x: RX[5], y: -100, z: 0.94 },
  { t: T.lado0 + 0.1, x: RX[5], y: -60, z: 1.0 }, { t: DURATION, x: RX[5], y: -40, z: 1.04 },
 ];
 KEYS.sort((a, b) => a.t - b.t);
 function camAt(t) {
  if (t <= KEYS[0].t) return Object.assign({}, KEYS[0]);
  for (let i = 0; i < KEYS.length - 1; i++) { const a = KEYS[i], b = KEYS[i + 1]; if (t <= b.t) { const e = io((t - a.t) / (b.t - a.t)); return { x: H.lerp(a.x, b.x, e), y: H.lerp(a.y, b.y, e), z: H.lerp(a.z, b.z, e) }; } }
  return Object.assign({}, KEYS[KEYS.length - 1]);
 }
 const alive = (t, a, b) => t >= a && t < b;
 const fadeIO = (t, a, b, f = 0.3) => sm(a, a + f, t) * (1 - sm(b - f, b, t));

 // ================= ESCENAS =================
 function scene(c, cam, t) {
  const tq = q12(t);
  bgPaper(c, cam);
  // bloques de color planos por región (fondo kraft / tinta), parallax 0.5
  // ---------- R0 · gancho y respuesta ----------
  if (t < WHIPS[0] + 0.4) {
   block(c, cam, 0.6, 0, -120, 960, 1500, -0.015, PAL.KRAFT, 14, [1, 1, 1, 1]);
   // cifra oculta (se insinúa y se tapa): «US$1.000 MILLONES»
   const hid = strip('hid', 'US$1.000 MILLONES', F.anton(118), { bg: PAL.CARD, fg: PAL.INK, seed: 11 });
   putSpr(c, cam, 0.8, hid, 0, 330, 0.02, 1, tq, 0.25, 'drop');
   const peek = sm(T.mil1 - 0.15, T.mil1 + 0.3, tq) * (1 - sm(T.dolares1 + 0.7, T.dolares1 + 1.1, tq));
   place(c, cam, 0.82, -40 + 520 * peek * 0.55, 330, 0.03, 1, (cc) => { const p = edgePoly(980, 220, [1, 1, 1, 1], 19, 6); shadowFill(cc, p, PAL.NEWS); texture(cc, p, 0.6); cc.fillStyle = 'rgba(26,24,22,0.7)'; cc.font = F.osw(34, 500); cc.textAlign = 'center'; cc.fillText('¿CUÁNTO VALE LA RESPUESTA?', 0, 12); });
   // retratos enfrentados
   const pm = portrait('musk');
   putSpr(c, cam, 1.0, pm, -215, -260 + Math.sin(t * 0.8) * 4, -0.05, 1.0, tq, T.elon - 0.05, 'slideL', (cc) => tape(cc, 0, -pm.h / 2 + 4, 130, 36, -0.12, 3));
   const pz = portrait('zhao');
   putSpr(c, cam, 1.04, pz, 225, -190 + Math.sin(t * 0.7 + 1) * 4, 0.05, 1.0, tq, T.fundador1, 'slideR', (cc) => tape(cc, 0, -pz.h / 2 + 4, 130, 36, 0.1, 4));
   // emblema de Binance (trazado oficial) aterriza con «Binance»
   putSpr(c, cam, 1.08, logoChip('binance', BIN, 150, 21, PAL.INK), 330, -560, 0.08, 1, tq, T.binance0, 'drop');
   // titular recortado
   const hl = strip('hl0', 'MUSK vs BINANCE', F.anton(116), { bg: PAL.INK, fg: '#f3efe5', seed: 10, hl: 'MUSK' });
   putSpr(c, cam, 1.1, hl, 0, -720, -0.01, 1, tq, 0.05, 'drop', (cc) => { if (tq > T.burlo) marker(cc, loopPts(hl.hl[0] + hl.hl[2] / 2, hl.hl[1] + hl.hl[3] / 2, hl.hl[2] * 0.62, hl.hl[3] * 0.85, 2.3), (t - T.burlo) / 0.6, PAL.RED, 8); });
   // la respuesta: flecha de tinta de Zhao hacia Musk
   const ap = sm(T.respondio, T.respondio + 0.6, t);
   if (ap > 0) place(c, cam, 1.05, 0, 0, 0, 1, (cc) => inkArrow(cc, curve([180, 40], [60, 160], [-80, 150], [-170, 60]), ap, 6, PAL.RED));
   const st = strip('resp', 'LE RESPONDIÓ', F.osw(46), { seed: 15, hl: 'RESPONDIÓ' });
   putSpr(c, cam, 1.12, st, 0, 160, 0.015, 1, tq, T.respondio + 0.2, 'drop', (cc) => hilite(cc, st.hl, (t - T.respondio - 0.3) / 0.5, 5));
  }
  // ---------- R1 · el hackeo y la comparación con FTX ----------
  if (t > WHIPS[0] - 0.4 && t < WHIPS[1] + 0.4) {
   const ox = RX[1];
   block(c, cam, 0.6, ox, 0, 1000, 2600, 0.01, '#d8cfb8', 31, [1, 1, 1, 1]);
   const nw = news('hack', { kicker: 'NOTICIAS · 29-30 OCT 2026', head: ['BINANCE SUFRE', 'UN HACKEO'], marks: ['BINANCE'], deck: ['Retiros no autorizados desde', 'sus billeteras calientes'], w: 820, h: 600, seed: 26 });
   putSpr(c, cam, 1.0, nw, ox, -430, -0.02, 1, tq, T.todo + 0.05, 'drop', (cc) => { tape(cc, -300, -300, 120, 36, -0.2, 7); hilite(cc, nw.rects.BINANCE, (t - T.binance2) / 0.45, 9); });
   const num = strip('num6', '+US$6.000 MILLONES', F.anton(98), { bg: PAL.INK, fg: '#f3efe5', seed: 33 });
   putSpr(c, cam, 1.12, num, ox, -40, 0.02, 1, tq, T.seis, 'drop');
   const note = strip('note6', 'reportes: unos US$6.300 millones', F.osw(36, 500), { seed: 34 });
   putSpr(c, cam, 1.1, note, ox + 120, 70, -0.02, 1, tq, T.dolares2 + 0.2, 'slideR');
   const prom = strip('prom', 'PROMESA: CUBRIR A LOS USUARIOS', F.osw(50), { seed: 35, hl: 'CUBRIR A LOS USUARIOS', bg: PAL.CARD });
   putSpr(c, cam, 1.06, prom, ox, 330, -0.015, 1, tq, T.prometia, 'slideL', (cc) => hilite(cc, prom.hl, (t - T.prometia - 0.3) / 0.6, 12));
   const ftx = news('ftx', { kicker: 'ARCHIVO · NOVIEMBRE 2022', head: ['FTX SE DECLARA', 'EN QUIEBRA'], marks: ['QUIEBRA'], deck: ['Otro caso, otro año'], w: 700, h: 470, seed: 44, headPx: 58 });
   putSpr(c, cam, 1.0, ftx, ox + 40, 860, 0.03, 0.92, tq, T.quiebra - 0.2, 'slideU', (cc) => { tape(cc, 260, -220, 110, 34, 0.25, 8); if (tq > T.ftx) marker(cc, loopPts(ftx.rects.QUIEBRA[0] + ftx.rects.QUIEBRA[2] / 2, ftx.rects.QUIEBRA[1] + ftx.rects.QUIEBRA[3] / 2, ftx.rects.QUIEBRA[2] * 0.62, ftx.rects.QUIEBRA[3] * 0.8, 4.1), (t - T.ftx) / 0.6); });
   // línea de comparación (nunca «=»)
   const cp = sm(T.comparo, T.comparo + 0.7, t);
   if (cp > 0) place(c, cam, 1.04, ox, 0, 0, 1, (cc) => { cc.save(); cc.setLineDash([14, 12]); inkArrow(cc, curve([-360, -200], [-470, 200], [-430, 520], [-300, 700]), cp, 5); cc.restore(); });
   const cmpS = strip('cmp', 'COMPARACIÓN EN X', F.anton(64), { bg: PAL.RED, fg: '#f8f1e4', seed: 36 });
   putSpr(c, cam, 1.14, cmpS, ox - 120, 560, -0.05, 1, tq, T.comparo + 0.25, 'drop');
  }
  // ---------- R2 · reacciones de Musk en X ----------
  if (t > WHIPS[1] - 0.4 && t < SHEET[1] + 0.2) {
   const ox = RX[2];
   block(c, cam, 0.6, ox, 0, 1000, 2200, -0.01, PAL.KRAFT, 52, [1, 1, 1, 1]);
   const hd = strip('reac', 'REACCIONES EN X', F.anton(96), { bg: PAL.INK, fg: '#f3efe5', seed: 53 });
   putSpr(c, cam, 1.1, hd, ox + 90, -760, -0.012, 1, tq, T.musk4 + 0.05, 'drop');
   const pm = portrait('musk');
   putSpr(c, cam, 1.0, pm, ox - 300, -440, -0.06, 0.62, tq, T.musk4 + 0.1, 'slideL', (cc) => tape(cc, 0, -pm.h / 2, 120, 34, -0.1, 3));
   const p1 = post('x01', { title: 'MUSK REACCIONA', handle: '@elonmusk', date: '30 OCT 2026', emoji: ['grimace'], body: [], band: 'Ante la comparación pública con FTX', tag: 'EXTRACTO EDITORIAL · NO ES CAPTURA DE X', url: 'x.com/elonmusk/status/2116025797400236362', w: 700, seed: 61 });
   putSpr(c, cam, 1.04, p1, ox + 140, -400, 0.025, 0.84, tq, T.mueca - 0.15, 'drop', (cc) => { const r = p1.rects.emo0; if (tq > T.mueca + 0.25) marker(cc, loopPts(r[0] + r[2] / 2, r[1] + r[3] / 2, r[2] * 0.66, r[3] * 0.62, 1.7), (t - T.mueca - 0.25) / 0.6, PAL.RED, 8); });
   const p2 = post('x02', { title: 'OTRA REACCIÓN', handle: '@elonmusk', date: '30 OCT 2026', emoji: ['fire', 'joy'], emojiLate: true, body: [], band: 'Respuesta a un aviso de CZ del 28 oct · otro hilo', tag: 'EXTRACTO EDITORIAL · NO ES CAPTURA DE X', url: 'x.com/elonmusk/status/2116034884393213964', w: 740, seed: 63 });
   putSpr(c, cam, 1.08, p2, ox - 20, 110, -0.02, 0.84, tq, T.despues, 'slideU', (cc) => {
    // emojis en el orden en que la voz los nombra: risa, luego fuego
    [['joy', T.risa, 1], ['fire', T.fuego, 0]].forEach(([k, ta, i]) => { const A2 = arrive(tq, ta, 'drop'); if (!A2) return; const r = p2.rects['emo' + i]; cc.save(); cc.translate(r[0] + r[2] / 2, r[1] + r[3] / 2); cc.rotate(A2.r); cc.scale(A2.s, A2.s); cc.drawImage(IMG[k], -r[2] / 2, -r[3] / 2, r[2], r[3]); cc.restore(); });
   });
  }
  // ---------- R3 · Zhao responde (y el mismo post revela la inversión) ----------
  if (t > SHEET[0] - 0.1 && t < WHIPS[2] + 0.4) {
   const ox = RX[3];
   block(c, cam, 0.6, ox, 300, 1000, 3200, 0.008, '#d9cdb2', 71, [1, 1, 1, 1]);
   // Zhao entra desde detrás de la hoja y desplaza a Musk
   const push = io(sm(T.changpeng - 0.1, T.changpeng + 0.5, t));
   const pm = portrait('musk');
   if (push < 1) place(c, cam, 1.0, ox - 260 - 700 * push, -520, -0.06 - 0.2 * push, 0.7, (cc) => drawSpr(cc, pm));
   const pz = portrait('zhao');
   putSpr(c, cam, 1.02, pz, ox - 170, -520 + Math.sin(t * 0.7) * 3, -0.03, 0.86, tq, T.changpeng - 0.1, 'slideR', (cc) => tape(cc, 0, -pz.h / 2, 130, 36, 0.08, 5));
   const fz = strip('fz', 'FUNDADOR DE BINANCE', F.osw(54), { seed: 72, hl: 'FUNDADOR' });
   putSpr(c, cam, 1.1, fz, ox + 230, -600, 0.03, 1, tq, T.fundador5 - 0.1, 'drop', (cc) => hilite(cc, fz.hl, (t - T.fundador5) / 0.5, 14));
   putSpr(c, cam, 1.12, logoChip('binance', BIN, 140, 73, PAL.INK), ox + 300, -420, -0.06, 1, tq, wt(5, 'binance'), 'drop');
   const nq = strip('nq', 'NO SE QUEDÓ CALLADO', F.anton(70), { bg: PAL.RED, fg: '#f8f1e4', seed: 74 });
   putSpr(c, cam, 1.14, nq, ox + 210, -280, -0.03, 1, tq, T.callado - 0.2, 'drop');
   // X-03 y X-04: UN SOLO post de Zhao. La parte superior aterriza; después la hoja se despliega y revela la segunda parte.
   const q = post('x03', { title: 'ZHAO RESPONDE', handle: '@cz_binance', date: '30 OCT 2026', body: ['“Elon, have a lot of respect', 'for you, but bad time to', 'troll. Please stop.”'], marks: ['Elon, have a lot of respect', 'bad time to', 'troll.', 'Please stop.'], band: 'Fragmento del post original (inglés) · traducción en subtítulos', tag: 'EXTRACTO EDITORIAL · FRAGMENTO REAL', url: 'x.com/cz_binance/status/2116097554882728341', w: 900, bodyPx: 50, seed: 81 });
   putSpr(c, cam, 1.0, q, ox, 60, -0.012, 1, tq, T.escribio, 'slideU', (cc) => {
    tape(cc, -380, -q.h / 2 + 6, 130, 36, -0.15, 9); tape(cc, 380, -q.h / 2 + 6, 130, 36, 0.12, 10);
    hilite(cc, q.rects['Elon, have a lot of respect'], (t - T.q1) / 0.7, 3);
    hilite(cc, q.rects['bad time to'], (t - T.momento) / 0.4, 4); hilite(cc, q.rects['troll.'], (t - T.momento - 0.4) / 0.3, 5);
    if (tq > T.q3) { const r = q.rects['Please stop.']; hilite(cc, r, (t - T.q3) / 0.5, 6); if (tq > T.detente) marker(cc, loopPts(r[0] + r[2] / 2, r[1] + r[3] / 2, r[2] * 0.6, r[3] * 0.95, 3.3), (t - T.detente) / 0.5, PAL.RED, 7); }
   });
   // pliegue: la misma hoja se despliega hacia abajo (12 fps)
   const unf = q12(sm(T.sorpresa0 + 0.2, T.sorpresa + 0.3, t));
   if (unf > 0) {
    const q4 = post('x04', { title: 'EL MISMO POST, MÁS ABAJO', handle: '@cz_binance', date: '30 OCT 2026', body: ['“Our SPCX shares (from our', '$500m investment in your', 'Twitter takeover) are worth', 'more than a billion.”'], marks: ['$500m investment in your', 'Twitter takeover)', 'more than a billion.'], band: 'Cifra según Zhao · no es una valoración auditada', tag: 'EXTRACTO · MISMO POST QUE EL ANTERIOR', url: 'x.com/cz_binance/status/2116097554882728341', w: 900, bodyPx: 50, seed: 83 });
    const top = 60 + q.h / 2 - 6;
    place(c, cam, 1.0, ox, top, -0.012, 1, (cc) => {
     cc.save(); cc.scale(1, Math.max(0.02, unf)); cc.translate(0, q4.h / 2); drawSpr(cc, q4);
     hilite(cc, q4.rects['$500m investment in your'], (t - T.quinientos) / 0.6, 7); hilite(cc, q4.rects['Twitter takeover)'], (t - T.quinientos - 0.6) / 0.5, 8);
     hilite(cc, q4.rects['more than a billion.'], (t - T.mil12) / 0.6, 11);
     cc.restore();
     if (unf < 1) { cc.fillStyle = `rgba(40,28,15,${0.25 * (1 - unf)})`; cc.fillRect(-450, 0, 900, 30); }
    });
   }
   // tira de US$500 MILLONES que se desdobla + logos Binance -> Twitter (2022)
   const y5 = 1040;
   const s5 = strip('s500', 'US$500 MILLONES', F.anton(124), { bg: PAL.INK, fg: '#f3efe5', seed: 85 });
   const op = q12(sm(T.quinientos - 0.1, T.quinientos + 0.35, t));
   if (op > 0 && t < T.spacex + 0.2) place(c, cam, 1.1, ox, y5, 0.015, 1, (cc) => { cc.scale(Math.max(0.03, op), 1); drawSpr(cc, s5); });
   putSpr(c, cam, 1.12, logoChip('binance', BIN, 150, 86, PAL.INK), ox - 300, y5 + 170, -0.05, 1, tq, T.invertido, 'drop');
   putSpr(c, cam, 1.12, logoChip('twitter', '#1d9bf0', 150, 87), ox + 300, y5 + 170, 0.05, 1, tq, T.twitter, 'drop');
   const lp = sm(T.ayudar, T.twitter + 0.2, t);
   if (lp > 0) place(c, cam, 1.12, ox, y5 + 170, 0, 1, (cc) => inkArrow(cc, curve([-205, -10], [-80, -90], [80, -90], [205, -10]), lp, 7));
   const lb = strip('tw22', 'compra de Twitter · 2022', F.osw(40, 500), { seed: 88 });
   putSpr(c, cam, 1.12, lb, ox, y5 + 300, 0.01, 1, tq, T.twitter + 0.3, 'slideU');
   // la misma inversión, ahora vinculada a acciones de SpaceX (persistencia justificada: la tira de 500M se transforma)
   const ys = 1520;
   const thread = sm(T.vinculada, T.acciones + 0.4, t);
   if (thread > 0) place(c, cam, 1.08, ox, 0, 0, 1, (cc) => inkArrow(cc, curve([0, y5 + 60], [-260, y5 + 260], [-200, ys - 220], [0, ys - 120]), thread, 5, PAL.RED));
   const sg = strip('segun', 'SEGÚN ZHAO', F.anton(64), { bg: PAL.RED, fg: '#f8f1e4', seed: 89 });
   putSpr(c, cam, 1.16, sg, ox + 200, ys - 250, 0.08, 1, tq, T.segun, 'drop');
   putSpr(c, cam, 1.1, logoChip('spacex', PAL.INK, 220, 90), ox - 220, ys - 60, -0.04, 1, tq, T.spacex, 'drop', (cc) => { cc.fillStyle = PAL.INK; cc.font = F.osw(40); cc.textAlign = 'center'; cc.fillText('SPCX', 0, 140); });
   const sb = strip('s1000', '+US$1.000 MILLONES', F.anton(92), { bg: PAL.INK, fg: '#f3efe5', seed: 91 });
   putSpr(c, cam, 1.14, sb, ox, ys + 160, 0.02, 1, tq, T.mil12, 'drop');
   const vn = strip('valz', 'valoración declarada por Zhao · no auditada', F.osw(34, 500), { seed: 92 });
   putSpr(c, cam, 1.12, vn, ox, ys + 270, -0.01, 1, tq, wt(12, 'dólares'), 'slideU');
  }
  // ---------- R4 · Binance aclara: no necesita vender ----------
  if (t > WHIPS[2] - 0.4 && t < WHIPS[3] + 0.4) {
   const ox = RX[4];
   block(c, cam, 0.6, ox, 0, 1000, 2200, -0.012, PAL.KRAFT, 101, [1, 1, 1, 1]);
   const p5 = post('x05', { title: 'BINANCE ACLARA', handle: '@heyibinance · Yi He, cofundadora', date: '30 OCT 2026', body: ['No necesitan vender', 'las acciones de SpaceX'], bodyFont: F.bask(56), bodyPx: 56, band: 'Según Reuters: sus ingresos anuales cubrirían las pérdidas', tag: 'RESUMEN EDITORIAL · NO ES CITA LITERAL', url: 'x.com/heyibinance/status/2116101170079076558', w: 900, seed: 103 });
   putSpr(c, cam, 1.0, p5, ox, -500, 0.015, 1, tq, T.aunque + 0.05, 'drop', (cc) => tape(cc, 0, -p5.h / 2 + 4, 150, 38, 0.05, 11));
   const sd = shareDoc();
   putSpr(c, cam, 1.06, sd, ox - 60, -20, -0.04, 0.9, tq, T.aseguro + 0.2, 'slideL', (cc) => {
    const vs = strip('vender', 'VENDER', F.anton(84), { bg: PAL.CARD, fg: PAL.INK, seed: 105 });
    if (tq > T.venderlas - 0.1) { cc.save(); cc.translate(150, 120); cc.rotate(-0.12); drawSpr(cc, vs); cc.restore(); if (tq > T.venderlas + 0.25) { const w2 = vs.w / 2, h2 = vs.h / 2; marker(cc, [[150 - w2, 120 - h2], [150 + w2, 120 + h2]], (t - T.venderlas - 0.25) / 0.25, PAL.RED, 10); marker(cc, [[150 + w2, 120 - h2], [150 - w2, 120 + h2]], (t - T.venderlas - 0.5) / 0.25, PAL.RED, 10); } }
   });
   const nn = strip('nonec', 'NO NECESITAN VENDER', F.anton(92), { bg: PAL.INK, fg: '#f3efe5', seed: 106, hl: 'NO NECESITAN' });
   putSpr(c, cam, 1.12, nn, ox + 30, 240, 0.012, 1, tq, T.cubrir - 0.1, 'drop');
  }
  // ---------- R5 · mosaico (motivo / respuesta / inversión) y pregunta final ----------
  if (t > T.lo14 - 0.6) {
   const ox = RX[5];
   block(c, cam, 0.6, ox, -100, 1000, 2200, 0.01, '#d6ccb4', 121, [1, 1, 1, 1]);
   const out = io(sm(T.lado0 - 0.4, T.lado0 + 0.2, t)); // el mosaico se aparta para la pregunta
   const m1 = cache('m1', () => sprite(420, 300, 30, (cc) => { const p = edgePoly(420, 300, [1, 1, 1, 1], 131, 5); shadowFill(cc, p, PAL.NEWS); texture(cc, p, 0.6); cc.fillStyle = PAL.INK; cc.font = F.anton(52); cc.textAlign = 'center'; cc.fillText('MOTIVO', 0, -80); ['grimace', 'joy', 'fire'].forEach((k, i) => cc.drawImage(IMG[k], -165 + i * 115, -40, 100, 100)); cc.font = F.osw(26, 500); cc.fillText('@elonmusk · reacciones en X', 0, 110); }));
   const m2 = cache('m2', () => sprite(460, 300, 30, (cc) => { const p = edgePoly(460, 300, [1, 1, 1, 1], 132, 5); shadowFill(cc, p, PAL.CARD); texture(cc, p, 0.6); cc.fillStyle = PAL.INK; cc.font = F.anton(52); cc.textAlign = 'center'; cc.fillText('RESPUESTA', 0, -80); cc.font = F.bask(42); cc.fillText('“Please stop.”', 0, 10); cc.font = F.osw(26, 500); cc.fillText('@cz_binance · 30 oct', 0, 100); }));
   const m3 = cache('m3', () => sprite(520, 320, 30, (cc) => { const p = edgePoly(520, 320, [1, 1, 1, 1], 133, 5); shadowFill(cc, p, PAL.NEWS); texture(cc, p, 0.6); cc.fillStyle = PAL.INK; cc.font = F.anton(52); cc.textAlign = 'center'; cc.fillText('INVERSIÓN', 0, -90); cc.font = F.anton(64); cc.fillText('500M → +1.000M', 0, 10); cc.font = F.osw(26, 500); cc.fillText('cifra actual según Zhao', 0, 100); }));
   putSpr(c, cam, 1.0, m1, ox - 230 - 600 * out, -600, -0.05, 1, tq, T.lo14 + 0.05, 'slideL');
   putSpr(c, cam, 1.04, m2, ox + 220 + 600 * out, -260, 0.04, 1, tq, T.termino, 'slideR');
   putSpr(c, cam, 1.08, m3, ox - 120, 120 + 900 * out, -0.02, 1, tq, T.discusion - 0.1, 'slideU');
   const a1 = sm(T.termino + 0.2, T.termino + 0.7, t) * (1 - out), a2 = sm(T.discusion + 0.1, T.discusion + 0.6, t) * (1 - out);
   if (a1 > 0) place(c, cam, 1.02, ox, 0, 0, 1, (cc) => inkArrow(cc, curve([-60, -560], [80, -540], [140, -460], [160, -400]), a1, 5));
   if (a2 > 0) place(c, cam, 1.06, ox, 0, 0, 1, (cc) => inkArrow(cc, curve([240, -110], [260, 0], [160, 60], [60, 0]), a2, 5));
   // cierre: ambos frente a frente + pregunta
   if (t > T.lado0 - 0.3) {
    const pm = portrait('musk'), pz = portrait('zhao');
    putSpr(c, cam, 1.0, pm, ox - 250, -520, -0.05, 0.8, tq, T.lado0 - 0.2, 'slideL', (cc) => tape(cc, 0, -pm.h / 2, 120, 34, -0.1, 3));
    putSpr(c, cam, 1.0, pz, ox + 250, -520, 0.05, 0.8, tq, T.lado0 - 0.2, 'slideR', (cc) => tape(cc, 0, -pz.h / 2, 120, 34, 0.1, 4));
    putSpr(c, cam, 1.04, nameTag('musk'), ox - 250, -220, -0.03, 0.8, tq, T.lado0, 'drop');
    putSpr(c, cam, 1.04, nameTag('zhao'), ox + 250, -220, 0.03, 0.8, tq, T.lado0, 'drop');
    const qa = strip('q1', '¿TÚ DE QUÉ', F.anton(140), { bg: PAL.INK, fg: '#f3efe5', seed: 141 }), qb = strip('q2', 'LADO ESTÁS?', F.anton(140), { bg: PAL.RED, fg: '#f8f1e4', seed: 142, hl: 'LADO' });
    putSpr(c, cam, 1.1, qa, ox, 40, -0.015, 1, tq, wt(15, 'tú'), 'drop');
    putSpr(c, cam, 1.12, qb, ox, 230, 0.015, 1, tq, T.lado, 'drop');
    const br = strip('brand', 'ASOMBROTECA', F.osw(34, 500), { seed: 143, bg: PAL.CARD });
    putSpr(c, cam, 1.06, br, ox, 420, 0, 1, tq, T.end + 0.2, 'slideU');
   }
  }
 }
 // curva bezier muestreada (para flechas de tinta)
 function curve(p0, p1, p2, p3, n = 30) { return Array.from({ length: n + 1 }, (_, i) => { const u = i / n, v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; }); }

 // ---------- hoja nueva que sube a pasos (transición R2 -> R3) ----------
 function sheetWipe(c, t) {
  const p = q12(sm(SHEET[0], SHEET[1], t)); if (p <= 0 || p >= 1) return;
  const y = HH * (1 - io(p)) + 0;
  c.save(); c.translate(W / 2, y + HH / 2 - 40); const pts = edgePoly(W + 140, HH + 80, [1, 0, 0, 0], 151, 10); shadowFill(c, pts, PAL.PAPER, 1.4); texture(c, pts, 0.6); c.restore();
 }

 // ---------- subtítulos: blancos con contorno de tinta, sin caja; subrayado amarillo en la palabra activa ----------
 function subtitles(c, t) {
  const ph = A.phrases.find((p) => t >= p.s && t < p.e); if (!ph) return;
  const a = sm(ph.s - 0.02, ph.s + 0.1, t) * (1 - sm(ph.e - 0.1, ph.e, t));
  let px = 66; c.font = F.osw(px, 600); const maxW = 900;
  const widest = Math.max(...ph.lines.map((l) => c.measureText(l).width)); if (widest > maxW) { px = Math.floor(px * maxW / widest); c.font = F.osw(px, 600); }
  const lh = px * 1.24, y0 = 1490 - (ph.lines.length - 1) * lh / 2, sp = c.measureText(' ').width;
  const boxes = []; let wi = 0;
  ph.lines.forEach((ln, li) => { const lw = c.measureText(ln).width; let cx = 540 - lw / 2; ln.split(' ').forEach((w) => { const ww = c.measureText(w).width; boxes.push({ w, x: cx, y: y0 + li * lh, ww, s: ph.w[wi] ? ph.w[wi].s : ph.s, e: ph.w[wi] ? ph.w[wi].e : ph.e }); wi++; cx += ww + sp; }); });
  let act = boxes.findIndex((b) => t >= b.s && t < b.e); if (act < 0) act = t >= boxes[boxes.length - 1].s ? boxes.length - 1 : 0;
  const b0 = boxes[act], nb = boxes[act + 1]; let bx = b0.x, bw = b0.ww;
  if (nb && nb.y === b0.y) { const f = io(sm(b0.e - 0.08, b0.e, t)); bx = H.lerp(b0.x, nb.x, f); bw = H.lerp(b0.ww, nb.ww, f); }
  c.save(); c.globalAlpha = a; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  c.fillStyle = '#ffe226'; c.beginPath(); c.roundRect(bx - 2, b0.y + px * 0.14, bw + 4, Math.max(7, px * 0.11), 3); c.fill();
  c.lineJoin = 'round'; c.strokeStyle = 'rgba(26,24,22,0.92)'; c.lineWidth = px * 0.16; c.shadowColor = 'rgba(26,24,22,0.5)'; c.shadowBlur = 10; c.shadowOffsetY = 3;
  for (const b of boxes) c.strokeText(b.w, b.x, b.y);
  c.shadowBlur = 0; c.shadowOffsetY = 0; c.fillStyle = '#ffffff';
  for (const b of boxes) c.fillText(b.w, b.x, b.y);
  c.restore();
 }

 // ---------- latigazo: desenfoque direccional que oculta el corte ----------
 let WL = null;
 function explainer(ctx, Wd, Hd, t) {
  const cam = Object.assign({ W, H: HH }, camAt(t));
  const whip = WHIPS.map((w) => 1 - Math.min(1, Math.abs(t - (w + 0.16)) / 0.2)).reduce((a, b) => Math.max(a, b), 0);
  if (whip > 0.02) {
   if (!WL) WL = H.layer(W, HH);
   const l = WL.getContext('2d'); l.setTransform(1, 0, 0, 1, 0, 0); l.clearRect(0, 0, W, HH);
   scene(l, cam, t);
   ctx.save(); ctx.fillStyle = PAL.PAPER; ctx.fillRect(0, 0, W, HH);
   const n = 7, d = 90 * whip;
   for (let i = 0; i < n; i++) { ctx.globalAlpha = 1 / (i + 1); ctx.drawImage(WL, (i - (n - 1) / 2) * d / n * 2, 0); }
   ctx.globalAlpha = 1; ctx.filter = `blur(${(10 * whip).toFixed(1)}px)`; ctx.globalAlpha = 0.5; ctx.drawImage(WL, 0, 0); ctx.restore();
  } else scene(ctx, cam, t);
  sheetWipe(ctx, t);
  finish(ctx, t, W, HH);
  subtitles(ctx, t);
 }
 window.EPISODIO = { explainer, init, T, DURATION, wt, WHIPS, SHEET, KEYS, camAt };
})();
