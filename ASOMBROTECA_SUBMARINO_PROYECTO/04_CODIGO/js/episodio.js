// =====================================================================================================
// episodio.js — «El submarino que no pudo volver» · Engineering Blueprint (AI Style Atlas) vertical 1080x1920
// Motor de render ADAPTADO del explainer() original (02_REFERENCIA_ORIGINAL_RECONSTRUIDA/styles/engineering-blueprint.js):
//  lámina azul de Prusia moteada (textura en caché), retícula, trazos temporizados en espacio-mundo dibujados por un
//  plotter, exposición irregular + sangrado (2 pasadas de desenfoque), pliegues con fibras, cabezal del plotter,
//  H.grain y H.vignette a la misma intensidad. Cambios: lámina vertical 2160x5900, cámara por secciones,
//  rol 'red' (corrección en rojo, práctica real de planos) y elementos dinámicos (submarino, agua, burbujas).
// Reloj = segundos de la voz original. Determinista (H.rng / H.makeNoise; nunca Math.random).
// =====================================================================================================
(function () {
 const A = window.ALIGN;
 const W = 1080, HH = 1920, DURATION = +(A.duration + 1.0).toFixed(3);
 const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
 const win = (t, a, b) => clamp((t - a) / (b - a));
 const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
 const sm = (a, b, x) => H.smooth(a, b, x);
 const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
 function wt(seg, word, nth = 0) { let k = 0; for (const w of A.words) if (w.seg === seg && norm(w.w) === norm(word)) { if (k === nth) return w.s; k++; } throw new Error('palabra ' + seg + ' ' + word); }
 const SG = (i) => A.segments[i];
 const T = {
  imagina: 0.05, cientos: wt(0, 'cientos'), oceano: wt(0, 'océano'), repente: SG(1).s, falla1: wt(1, 'falla'), hundirse: wt(2, 'hundirse'), comienza: SG(2).s,
  trip: SG(3).s, regresar: wt(3, 'regresar'), superficie: wt(3, 'superficie'), pero3: wt(3, 'pero'), noresp: wt(3, 'no'),
  entender: SG(4).s, tanques4: wt(4, 'tanques'), sumergirse: wt(5, 'sumergirse'), permite: wt(5, 'permite'), agua5: wt(5, 'agua'), entre: wt(5, 'entre'), aumentando: wt(5, 'aumentando'), peso: wt(5, 'peso'),
  subir: wt(6, 'subir'), aire6: wt(6, 'aire'), comprimido: wt(6, 'comprimido'), expulsar6: wt(6, 'expulsar'),
  pero7: SG(7).s, emergencia7: wt(7, 'emergencia'), falla7: wt(7, 'falla'),
  en1963: SG(8).s, y1963: wt(8, '1963'), nuclear: wt(8, 'nuclear'), uss: wt(8, 'uss'), thresher: wt(8, 'thresher'), hundio: wt(8, 'hundió'), pruebas: wt(8, 'pruebas'), atlantico: wt(8, 'atlántico'),
  invest: SG(9).s, posible: wt(9, 'posible'), cadena: wt(9, 'cadena'), propulsion: wt(9, 'propulsión'), dificult: wt(9, 'dificultades'), expulsar9: wt(9, 'expulsar'), lastre9: wt(9, 'lastre'),
  medida: SG(10).s, presion: wt(10, 'presión'), aumentaba: wt(10, 'aumentaba'), hasta: SG(11).s, casco: wt(11, 'casco'), soportarla: wt(11, 'soportarla'),
  las12: SG(12).s, n129: wt(12, '129'), personas: wt(12, 'personas'), vida: wt(12, 'vida'),
  oceano13: SG(13).s, grieta: wt(13, 'grieta'), amenaza: wt(13, 'amenaza'),
  aveces: SG(14).s, sistema14: wt(14, 'sistema'), nofunc: wt(14, 'no'), necesita: wt(14, 'necesita'),
  asombro: SG(15).s, tag: SG(16).s, end: A.speech_end,
 };
 const RED = '#ff806e';

 // ---------- geometría (helpers del motor original) ----------
 const circ = (x, y, rx, ry, a0 = 0, a1 = Math.PI * 2, n = 0) => { n = n || Math.max(12, Math.ceil(Math.abs(a1 - a0) * Math.max(rx, ry) / 6)); const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([x + Math.cos(a) * rx, y + Math.sin(a) * ry]); } return o; };
 const cubic = (p0, p1, p2, p3, n = 40) => { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, m = 1 - t; o.push([m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0], m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1]]); } return o; };
 const rrect = (x, y, w, h, r) => { const o = [[x + r, y], [x + w - r, y]]; o.push(...circ(x + w - r, y + r, r, r, -Math.PI / 2, 0, 5).slice(1)); o.push([x + w, y + h - r]); o.push(...circ(x + w - r, y + h - r, r, r, 0, Math.PI / 2, 5).slice(1)); o.push([x + r, y + h]); o.push(...circ(x + r, y + h - r, r, r, Math.PI / 2, Math.PI, 5).slice(1)); o.push([x, y + r]); o.push(...circ(x + r, y + r, r, r, Math.PI, Math.PI * 1.5, 5).slice(1)); o.push([x + r + 2, y]); return o; };
 const head = (P, len = 22, spread = 0.5) => { const a = P[P.length - 1], b = P[Math.max(0, P.length - 4)], an = Math.atan2(a[1] - b[1], a[0] - b[0]); return [[a[0] - Math.cos(an - spread) * len, a[1] - Math.sin(an - spread) * len], a, [a[0] - Math.cos(an + spread) * len, a[1] - Math.sin(an + spread) * len]]; };
 // casco en lágrima (perfil lateral), proa a la izquierda; L = eslora en px de mundo
 function hullPts(x, y, L, Hh) {
  const o = []; for (let i = 0; i <= 60; i++) { const u = i / 60, xx = x - L / 2 + u * L; const r = u < 0.18 ? Math.sqrt(1 - Math.pow((0.18 - u) / 0.18, 2)) : u < 0.62 ? 1 : Math.pow(Math.max(0, 1 - (u - 0.62) / 0.38), 1.25) * 0.97 + 0.03; o.push([xx, y - r * Hh / 2]); }
  for (let i = 60; i >= 0; i--) { const u = i / 60, xx = x - L / 2 + u * L; const r = u < 0.18 ? Math.sqrt(1 - Math.pow((0.18 - u) / 0.18, 2)) : u < 0.62 ? 1 : Math.pow(Math.max(0, 1 - (u - 0.62) / 0.38), 1.25) * 0.97 + 0.03; o.push([xx, y + r * Hh / 2]); }
  o.push(o[0]); return o;
 }
 // perfil completo del submarino (casco, vela con timones de vela, timones de popa cruciformes, hélice, línea central)
 function subSide(x, y, L, rot = 0) {
  const Hh = L * 0.13, cs = Math.cos(rot), sn = Math.sin(rot), R = (p) => [x + (p[0] - x) * cs - (p[1] - y) * sn, y + (p[0] - x) * sn + (p[1] - y) * cs];
  const P = (arr) => arr.map(R);
  const sx = x - L * 0.2, sw = L * 0.14, sh = L * 0.1;
  return {
   hull: P(hullPts(x, y, L, Hh)),
   sail: P([[sx - sw / 2, y - Hh / 2], [sx - sw / 2 + sw * 0.12, y - Hh / 2 - sh], [sx + sw / 2 - sw * 0.05, y - Hh / 2 - sh], [sx + sw / 2, y - Hh / 2]]),
   fplanes: P([[sx - sw * 0.2, y - Hh / 2 - sh * 0.55], [sx + sw * 0.55, y - Hh / 2 - sh * 0.55]]),
   splanes: P([[x + L * 0.36, y], [x + L * 0.47, y - Hh * 0.05], [x + L * 0.47, y + Hh * 0.05], [x + L * 0.36, y]]),
   rudder: P([[x + L * 0.4, y - Hh * 0.62], [x + L * 0.46, y - Hh * 0.62], [x + L * 0.47, y + Hh * 0.62], [x + L * 0.41, y + Hh * 0.62]]),
   prop: P([[x + L * 0.5, y - Hh * 0.28], [x + L * 0.515, y], [x + L * 0.5, y + Hh * 0.28]]),
   cl: P([[x - L * 0.56, y], [x + L * 0.56, y]]),
   Hh,
  };
 }
 // rayado (hatch) de un rectángulo hasta un nivel (agua): devuelve segmentos
 function hatch(x0, y0, w, h, level, step = 14, ang = 1) {
  const segs = [], top = y0 + h * (1 - level);
  if (level <= 0.001) return segs;
  for (let o = -h; o < w + h; o += step) { let a = [x0 + o, y0 + h], b = [x0 + o + ang * h, y0]; // línea diagonal
   const clipY = (p, q, yy) => { const u = (yy - p[1]) / (q[1] - p[1]); return [p[0] + (q[0] - p[0]) * u, yy]; };
   if (b[1] < top) b = clipY(a, b, top);
   const clipX = (p, q, xx) => { const u = (xx - p[0]) / (q[0] - p[0]); return [xx, p[1] + (q[1] - p[1]) * u]; };
   if (a[0] < x0) a = clipX(a, b, x0); if (b[0] > x0 + w) b = clipX(a, b, x0 + w); if (a[0] > x0 + w || b[0] < x0 || b[1] > a[1]) continue;
   segs.push([a, b]); }
  return segs;
 }

 // ---------- cámara (centro x, centro y, zoom) ----------
 const S1 = [540, 960], S2 = [540, 2960], S3 = [1620, 960], S4 = [1620, 2960], S5 = [540, 4960], S6 = [1620, 4960];
 const CAM = [
  [0, 540, 900, 1.08], [T.oceano, 540, 940, 1.0], [T.hundirse, 540, 1010, 0.98], [T.noresp + 0.3, 540, 1060, 0.96],
  [T.entender - 0.2, 540, 1300, 0.9], [T.tanques4 + 0.3, S2[0], S2[1] + 330, 1.0], [T.peso, S2[0], S2[1] + 340, 1.02], [T.expulsar6 + 0.4, S2[0], S2[1] + 330, 1.02], [T.falla7 + 0.3, S2[0], S2[1] + 320, 1.04],
  [T.en1963 + 0.4, S3[0], S3[1] - 40, 1.0], [T.atlantico + 0.3, S3[0], S3[1] + 10, 1.02], [T.posible - 0.2, S3[0], 1480, 1.0], [T.lastre9 + 0.2, S3[0], 1540, 1.0],
  [T.medida + 0.4, S4[0], S4[1] + 130, 1.0], [T.soportarla + 0.4, S4[0], S4[1] + 150, 1.03],
  [T.las12 + 0.4, S5[0], S5[1] - 40, 1.0], [T.vida + 0.3, S5[0], S5[1] - 20, 1.02],
  [T.oceano13 + 0.4, S6[0], S6[1] - 40, 1.0], [T.necesita + 0.3, S6[0], S6[1], 1.02],
  [T.asombro + 0.2, 1080, 4100, 0.5], [T.tag + 0.6, 1080, 5380, 0.7], [DURATION, 1080, 5389, 0.7],
 ];
 const camAt = (t) => { if (t <= CAM[0][0]) return CAM[0].slice(1); for (let i = 0; i < CAM.length - 1; i++) { const a = CAM[i], b = CAM[i + 1]; if (t <= b[0]) { const u = eio((t - a[0]) / Math.max(1e-6, b[0] - a[0])); return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * u)]; } } return CAM[CAM.length - 1].slice(1); };

 // ================= HISTORIA: trazos temporizados en espacio-mundo =================
 function story(t) {
  const items = [];
  const line = (pts, role, w, a, b) => items.push({ k: 'line', pts, role, w, a, b });
  const lineI = (pts, role, w) => items.push({ k: 'line', pts, role, w, a: -1, b: 0, inst: true });
  const text = (s, x, y, size, font, role, a, b, opt = {}) => items.push({ k: 'text', s, x, y, size, font, role, a, b, align: opt.align || 'left', rot: opt.rot || 0, inst: opt.inst });
  const dot = (x, y, r, role, a) => items.push({ k: 'dot', x, y, r, role, a, b: a + 0.05 });
  const arrowL = (pts, role, w, a, b) => { line(pts, role, w, a, b); line(head(pts, 24), role, w, b, b + 0.06); };
  const dimV = (x, y0, y1, label, a, b, role = 'ink', size = 34) => { line([[x - 26, y0], [x + 26, y0]], role, 2, a, a + 0.08); line([[x - 26, y1], [x + 26, y1]], role, 2, a + 0.08, a + 0.16); const P = [[x, y0 + 4], [x, y1 - 4]]; line(P, role, 2.6, a + 0.1, b); line(head([[x, y1 - 60], [x, y1]], 18), role, 2.6, b, b + 0.05); line(head([[x, y0 + 60], [x, y0]], 18), role, 2.6, b, b + 0.05); text(label, x + 22, (y0 + y1) / 2, size, 'label', role, b, b + 0.4, { rot: -Math.PI / 2 / 0.3 * 0 }); };
  const stamp = (s, x, y, size, a, role = 'red') => { text(s, x, y, size, 'title', role, a, a + 0.25, { align: 'center' }); const w = s.length * size * 0.62; line(rrect(x - w / 2 - 22, y - size * 0.95, w + 44, size * 1.35, 10), role, 4, a, a + 0.2); };

  // ---------------- SECCIÓN 1: el gancho (0–12.6 s) ----------------
  // superficie del mar (línea de agua con olas) y escala de profundidad
  { const yS = 330; const wv = []; for (let x = 60; x <= 1020; x += 6) wv.push([x, yS + Math.sin(x * 0.03) * 7]); line(wv, 'ink', 3.5, 0.05, 0.7);
   text('SUPERFICIE', 70, yS - 26, 34, 'label', 'ink', 0.3, 0.7);
   for (let i = 0; i < 26; i++) { const x = 70 + i * 37; line([[x, yS + 16], [x - 14, yS + 30]], 'cl', 1.4, 0.4 + i * 0.01, 0.45 + i * 0.01); } }
  const subY0 = 980, subY = subY0 + 260 * eio(win(t, T.comienza, T.noresp + 0.8)) + 40 * eio(win(t, T.noresp + 0.8, T.entender + 0.6)), subRot = 0.07 * sm(T.comienza, T.hundirse + 0.6, t);
  // dimensión de profundidad (la cota crece mientras se hunde)
  { const x = 940; line([[x - 26, 340], [x + 26, 340]], 'ink', 2, T.cientos - 0.2, T.cientos); const yb = subY - 10; lineI([[x, 344], [x, yb]], 'ink', 2.6); lineI(head([[x, yb - 60], [x, yb]], 18), 'ink', 2.6); lineI(head([[x, 404], [x, 344]], 18), 'ink', 2.6); lineI([[x - 26, yb], [x + 26, yb]], 'ink', 2);
   if (t > T.cientos) items.push({ k: 'text', s: 'CIENTOS DE METROS', x: x - 18, y: (340 + yb) / 2 + 150, size: 34, font: 'label', role: 'ink', a: T.cientos, b: T.cientos + 0.6, rot: -Math.PI / 2, align: 'left', vert: true }); }
  // submarino (perfil) — se dibuja con el plotter y luego se hunde
  { const S = subSide(500, subY, 760, subRot), drawn = t < T.oceano + 0.6;
   const L = (pts, role, w, a, b) => (drawn ? line(pts, role, w, a, b) : lineI(pts, role, w));
   L(S.hull, 'ink', 4, 0.6, 2.2); L(S.sail, 'ink', 3.5, 2.2, 2.6); L(S.fplanes, 'ink', 3, 2.6, 2.75); L(S.splanes, 'ink', 3, 2.75, 2.9); L(S.rudder, 'ink', 3, 2.9, 3.05); L(S.prop, 'ink', 3, 3.05, 3.15); L(S.cl, 'cl', 1.4, 0.6, 1.4);
   text('SUBMARINO · VISTA LATERAL', 560, subY + 130, 32, 'label', 'ink', 3.1, 3.6); }
  // algo falla: corrección en rojo
  stamp('FALLA', 680, 760, 70, T.falla1 - 0.1);
  line(circ(700, subY - 20, 120, 70), 'red', 4, T.falla1, T.falla1 + 0.4);
  // trayectoria de hundimiento
  arrowL([[480, subY + 75], [480, subY + 120], [480, subY + 160], [480, subY + 210]], 'red', 4, T.hundirse - 0.1, T.hundirse + 0.5);
  text('SE HUNDE', 250, subY + 175, 40, 'label', 'red', T.hundirse + 0.2, T.hundirse + 0.6);
  // intento de subir (rumbo previsto) tachado
  const up = cubic([330, 900], [300, 760], [330, 560], [380, 420]);
  arrowL(up, 'cl', 4, T.regresar, T.superficie + 0.4);
  text('RUMBO A SUPERFICIE', 80, 470, 36, 'label', 'ink', T.regresar + 0.3, T.superficie + 0.5);
  line([[250, 540], [420, 700]], 'red', 7, T.noresp, T.noresp + 0.15); line([[420, 540], [250, 700]], 'red', 7, T.noresp + 0.15, T.noresp + 0.3);
  text('NO RESPONDE', 440, 650, 44, 'title', 'red', T.noresp + 0.2, T.noresp + 0.6);
  // puente (leader) que lleva la cámara a la sección de tanques
  arrowL([[540, 1560], [540, 1720], [540, 1880], [540, 2060]], 'ink', 4, T.entender - 0.3, T.entender + 0.4);
  text('VER SECCIÓN B-B', 570, 1800, 34, 'label', 'ink', T.entender, T.entender + 0.4);

  // ---------------- SECCIÓN 2: tanques de lastre (13–30 s) ----------------
  { const cx = S2[0], cy = S2[1] + 40, L = 980, Hh = 330;
   const ta = T.entender + 0.2;
   line(hullPts(cx, cy, L, Hh), 'ink', 5, ta, ta + 1.2);
   line([[cx - L * 0.56, cy], [cx + L * 0.56, cy]], 'cl', 1.4, ta, ta + 0.6);
   // casco resistente (cilindro interior)
   const px0 = cx - 240, px1 = cx + 250, ph = Hh * 0.72;
   line(rrect(px0, cy - ph / 2, px1 - px0, ph, 60), 'ink', 4, ta + 0.6, ta + 1.4);
   text('CASCO RESISTENTE', px0 + 40, cy - ph / 2 + 44, 32, 'label', 'ink', ta + 1.2, ta + 1.6);
   // tanques de lastre: proa y popa, FUERA del casco resistente
   const tanks = [[cx - 450, cy - 110, 190, 220], [cx + 280, cy - 100, 160, 200]];
   tanks.forEach(([x, y, w, h], i) => line(rrect(x, y, w, h, 26), 'ink', 4, T.tanques4 - 0.1 + i * 0.25, T.tanques4 + 0.4 + i * 0.25));
   stamp('TANQUES DE LASTRE', cx, cy - 430, 52, T.tanques4, 'ink');
   arrowL([[cx - 220, cy - 390], [cx - 280, cy - 250], [cx - 320, cy - 160], [cx - 350, cy - 118]], 'ink', 3, T.tanques4 + 0.4, T.tanques4 + 0.7);
   arrowL([[cx + 220, cy - 390], [cx + 280, cy - 250], [cx + 330, cy - 160], [cx + 355, cy - 108]], 'ink', 3, T.tanques4 + 0.5, T.tanques4 + 0.8);
   // nivel de agua en los tanques: se inundan al sumergirse y se vacían al soplar
   const fill = eio(win(t, T.permite, T.aumentando + 0.3)) * (1 - eio(win(t, T.aire6, T.expulsar6 + 0.8)) * 0.92) * (t > T.pero7 ? 1 : 1);
   // al fallar (sección 7) el soplado no consigue vaciarlos: lo representa la escena siguiente; aquí vuelve a estado parcial
   const lvl = t > T.falla7 ? Math.max(fill, 0.55 * sm(T.falla7, T.falla7 + 0.8, t) + fill * (1 - sm(T.falla7, T.falla7 + 0.8, t))) : fill;
   tanks.forEach(([x, y, w, h]) => hatch(x + 6, y + 6, w - 12, h - 12, lvl, 15).forEach((s) => lineI(s, 'water', 2)));
   if (lvl > 0.02 && lvl < 0.98) tanks.forEach(([x, y, w, h]) => { const yy = y + 6 + (h - 12) * (1 - lvl); const wv = []; for (let xx = x + 8; xx <= x + w - 8; xx += 6) wv.push([xx, yy + Math.sin(xx * 0.08 + t * 6) * 3]); lineI(wv, 'ink', 2.4); });
   // ventilación (válvulas arriba) y entrada de agua (rejillas abajo)
   tanks.forEach(([x, y, w, h], i) => { const vx = x + w / 2, vy = y - 40;
    line([[vx, y], [vx, vy - 20]], 'ink', 3, T.sumergirse, T.sumergirse + 0.2);
    const open = sm(T.sumergirse, T.sumergirse + 0.4, t) * (1 - sm(T.aire6 - 0.4, T.aire6, t)), r = 16;
    const ang = open * Math.PI / 2; lineI([[vx - Math.cos(ang) * r * 1.6, vy - Math.sin(ang) * r * 1.6], [vx + Math.cos(ang) * r * 1.6, vy + Math.sin(ang) * r * 1.6]], 'ink', 5);
    lineI(circ(vx, vy, r * 1.7, r * 1.7), 'ink', 2.2);
    for (let k2 = 0; k2 < 4; k2++) line([[x + 30 + k2 * (w - 60) / 3, y + h], [x + 30 + k2 * (w - 60) / 3, y + h + 26]], 'ink', 3, T.sumergirse + 0.1 + k2 * 0.04, T.sumergirse + 0.2 + k2 * 0.04);
   });
   text('VENTILACIÓN', 50, cy - 250, 34, 'label', 'ink', T.sumergirse + 0.2, T.sumergirse + 0.6);
   text('ENTRADA DE AGUA', 50, cy + 220, 34, 'label', 'ink', T.permite + 0.2, T.permite + 0.6);
   // flujo: agua entra por abajo, aire sale por arriba (inmersión)
   const fl = sm(T.permite, T.permite + 0.3, t) * (1 - sm(T.aumentando + 0.6, T.aumentando + 1.0, t));
   if (fl > 0) tanks.forEach(([x, y, w, h], i) => { for (let k2 = 0; k2 < 3; k2++) { const ph2 = ((t * 1.2 + k2 / 3 + i * 0.2) % 1); const yy = y + h + 70 - ph2 * 90, xx = x + 40 + k2 * (w - 80) / 2; lineI([[xx, yy], [xx, yy - 22]], 'ink', 3); lineI(head([[xx, yy + 10], [xx, yy - 22]], 10), 'ink', 3); }
     for (let k2 = 0; k2 < 4; k2++) { const ph2 = ((t * 0.9 + k2 / 4 + i * 0.3) % 1); items.push({ k: 'ring', x: x + w / 2 + Math.sin(k2 * 2 + t * 3) * 14, y: y - 60 - ph2 * 160, r: 6 + 4 * ph2, role: 'ink', inst: true, al: 1 - ph2 }); } });
   // aire comprimido: botellas en el casco resistente y tubería hasta los tanques (soplado)
   const ax = cx - 120, ay = cy + 30;
   [0, 1, 2].forEach((k2) => line(rrect(ax + k2 * 80, ay, 60, 120, 28), 'ink', 3.5, T.subir + k2 * 0.08, T.subir + 0.3 + k2 * 0.08));
   const pipeL = [[ax + 30, ay], [ax + 30, cy - 20], [cx - 270, cy - 20]], pipeR = [[ax + 190, ay], [ax + 190, cy - 10], [cx + 270, cy - 10]];
   line(pipeL, 'ink', 3, T.subir + 0.3, T.subir + 0.7); line(pipeR, 'ink', 3, T.subir + 0.4, T.subir + 0.8);
   text('AIRE COMPRIMIDO', ax - 20, ay + 175, 38, 'label', 'ink', T.aire6, T.comprimido + 0.4);
   const bl = sm(T.aire6, T.aire6 + 0.3, t) * (1 - sm(T.expulsar6 + 0.8, T.expulsar6 + 1.2, t));
   if (bl > 0) { [pipeL, pipeR].forEach((P, i) => { for (let k2 = 0; k2 < 5; k2++) { const u = ((t * 1.4 + k2 / 5) % 1); const seg2 = Math.min(P.length - 2, Math.floor(u * (P.length - 1))), f = u * (P.length - 1) - seg2; const pp = [P[seg2][0] + (P[seg2 + 1][0] - P[seg2][0]) * f, P[seg2][1] + (P[seg2 + 1][1] - P[seg2][1]) * f]; items.push({ k: 'dot', x: pp[0], y: pp[1], r: 7, role: 'ink', inst: true }); } });
    tanks.forEach(([x, y, w, h]) => { for (let k2 = 0; k2 < 3; k2++) { const ph2 = ((t * 1.3 + k2 / 3) % 1), xx = x + 40 + k2 * (w - 80) / 2, yy = y + h + 6 + ph2 * 80; lineI([[xx, yy], [xx, yy + 22]], 'ink', 3); lineI(head([[xx, yy - 10], [xx, yy + 22]], 10), 'ink', 3); } }); }
   // PESO y EMPUJE (flechas proporcionales al estado)
   const wgt = 0.6 + 0.4 * lvl, bu = 0.8;
   const wx = cx + 230, wy = cy + Hh / 2 + 30;
   if (t > T.aumentando - 0.4) { lineI([[wx, wy], [wx, wy + 150 * wgt]], 'ink', 6); lineI(head([[wx, wy], [wx, wy + 150 * wgt]], 22), 'ink', 6); text('PESO', wx + 22, wy + 120, 40, 'label', 'ink', T.aumentando - 0.4, T.peso, {}); }
   if (t > T.aumentando - 0.2) { const bx = cx - 40, by = cy - Hh / 2 - 20; lineI([[bx, by], [bx, by - 150 * bu]], 'ink', 6); lineI(head([[bx, by], [bx, by - 150 * bu]], 22), 'ink', 6); text('EMPUJE', bx + 24, by - 100, 40, 'label', 'ink', T.aumentando - 0.2, T.peso + 0.2); }
   text(lvl > 0.5 ? 'PESO > EMPUJE · DESCIENDE' : 'EMPUJE > PESO · ASCIENDE', cx, cy + 470, 40, 'title', 'ink', T.peso, T.peso + 0.6, { align: 'center', inst: false });
   // ¿y si el sistema de emergencia falla?
   line([[ax + 60, cy - 70], [ax + 160, cy + 25]], 'red', 8, T.falla7, T.falla7 + 0.15); line([[ax + 160, cy - 70], [ax + 60, cy + 25]], 'red', 8, T.falla7 + 0.15, T.falla7 + 0.3);
   stamp('¿Y SI FALLA?', cx, cy + 600, 60, T.emergencia7, 'red');
  }
  // puente a la sección 3 (historia real)
  arrowL([[1080, 2560], [1200, 2100], [1300, 1700], [1400, 1500]], 'ink', 4, T.en1963 - 0.4, T.en1963 + 0.4);

  // ---------------- SECCIÓN 3: USS Thresher (30.8–48.2 s) ----------------
  { const cx = S3[0], top = 330;
   stamp('1963', cx, top + 90, 130, T.y1963 - 0.1, 'ink');
   text('USS THRESHER (SSN-593)', cx, top + 250, 50, 'title', 'ink', T.uss, T.thresher + 0.6, { align: 'center' });
   text('SUBMARINO NUCLEAR · ESTADOS UNIDOS', cx, top + 320, 32, 'label', 'ink', T.nuclear, T.nuclear + 0.8, { align: 'center' });
   const S = subSide(cx, top + 520, 860, 0);
   line(S.hull, 'ink', 4, T.uss, T.hundio); line(S.sail, 'ink', 3.5, T.hundio, T.hundio + 0.3); line(S.fplanes, 'ink', 3, T.hundio + 0.3, T.hundio + 0.4); line(S.splanes, 'ink', 3, T.hundio + 0.4, T.hundio + 0.5); line(S.rudder, 'ink', 3, T.hundio + 0.5, T.hundio + 0.6); line(S.prop, 'ink', 3, T.hundio + 0.6, T.hundio + 0.7); line(S.cl, 'cl', 1.4, T.uss, T.uss + 0.6);
   text('10 ABR 1963 · PRUEBAS DE INMERSIÓN', cx, top + 700, 36, 'label', 'ink', T.pruebas, T.pruebas + 0.6, { align: 'center' });
   text('OCÉANO ATLÁNTICO', cx, top + 752, 36, 'label', 'ink', T.atlantico, T.atlantico + 0.5, { align: 'center' });
   // cadena de fallos (diagrama de bloques)
   const by0 = top + 880;
   text('POSIBLE CADENA DE FALLOS', cx, by0, 46, 'title', 'red', T.posible, T.cadena + 0.6, { align: 'center' });
   const box = (y, a, l1, l2) => { line(rrect(cx - 420, y, 840, 150, 18), 'ink', 4, a, a + 0.4); text(l1, cx, y + 64, 40, 'title', 'ink', a + 0.2, a + 0.6, { align: 'center' }); if (l2) text(l2, cx, y + 116, 30, 'label', 'ink', a + 0.4, a + 0.8, { align: 'center' }); };
   box(by0 + 50, T.posible + 0.3, 'FALLO INICIAL', 'investigación: probable fuga en tubería');
   arrowL([[cx, by0 + 205], [cx, by0 + 235], [cx, by0 + 255], [cx, by0 + 275]], 'ink', 4, T.propulsion - 0.3, T.propulsion - 0.1);
   box(by0 + 280, T.propulsion - 0.1, 'PÉRDIDA DE PROPULSIÓN', null);
   arrowL([[cx, by0 + 435], [cx, by0 + 465], [cx, by0 + 485], [cx, by0 + 505]], 'ink', 4, T.dificult, T.dificult + 0.2);
   box(by0 + 510, T.dificult + 0.2, 'SOPLADO DE LASTRE', 'no logró expulsar suficiente agua');
   line(circ(cx, by0 + 585, 470, 110), 'red', 4, T.lastre9 - 0.1, T.lastre9 + 0.5);
  }
  arrowL([[1620, 1980], [1620, 2080], [1620, 2160], [1620, 2260]], 'ink', 4, T.medida - 0.3, T.medida + 0.2);

  // ---------------- SECCIÓN 4: presión y casco (48.7–54.6 s) ----------------
  { const cx = S4[0] + 100, cy = S4[1] - 40, R = 240, th = 32;
   const ta = T.medida - 0.1;
   // regla de profundidad
   const rx = S4[0] - 440, ry0 = cy - 470, ry1 = cy + 480;
   line([[rx, ry0], [rx, ry1]], 'ink', 4, ta, ta + 0.5);
   for (let i = 0; i <= 12; i++) line([[rx, ry0 + i * (ry1 - ry0) / 12], [rx + (i % 4 ? 22 : 44), ry0 + i * (ry1 - ry0) / 12]], 'ink', 2.4, ta + 0.2 + i * 0.03, ta + 0.25 + i * 0.03);
   text('PROFUNDIDAD', rx - 26, ry0 - 36, 36, 'label', 'ink', ta + 0.4, ta + 0.8);
   const dep = eio(win(t, T.medida, T.soportarla)), my = ry0 + 80 + dep * (ry1 - ry0 - 160);
   if (t > ta + 0.4) { lineI([[rx + 56, my], [rx + 96, my - 20], [rx + 96, my + 20], [rx + 56, my]], 'ink', 3); }
   // sección del casco (anillo rayado, como la SECTION A-A del original)
   const crack = sm(T.soportarla - 0.1, T.soportarla + 0.4, t);
   const ringPts = circ(cx, cy, R, R), inner = circ(cx, cy, R - th, R - th);
   line(ringPts, 'ink', 4, ta + 0.2, ta + 0.9); line(inner, 'ink', 3, ta + 0.6, ta + 1.1);
   if (t > ta + 1.0) for (let o = -R; o <= R; o += 18) { for (const sgn of [-1, 1]) { // rayado del anillo (solo la corona)
     const pts = []; for (let u = 0; u <= 1; u += 0.02) { const x = cx + o + u * 30 - 15, yy = cy + sgn * (R - th / 2) + (u - 0.5) * th; if (Math.hypot(x - cx, yy - cy) < R - 2 && Math.hypot(x - cx, yy - cy) > R - th + 2) pts.push([x, yy]); } if (pts.length > 2) lineI(pts, 'cl', 1.4); } }
   text('SECCIÓN DEL CASCO', cx, cy + 12, 30, 'label', 'ink', ta + 0.8, ta + 1.3, { align: 'center' });
   // flechas de presión hacia dentro, crecen con la profundidad
   const pr = 0.25 + 0.75 * dep;
   if (t > T.presion - 0.2) for (let k2 = 0; k2 < 12; k2++) { const a = (k2 + 0.5) / 12 * Math.PI * 2, L2 = 30 + 80 * pr, x0 = cx + Math.cos(a) * (R + 24 + L2), y0 = cy + Math.sin(a) * (R + 24 + L2), x1 = cx + Math.cos(a) * (R + 18), y1 = cy + Math.sin(a) * (R + 18); lineI([[x0, y0], [x1, y1]], 'ink', 4 + 2 * pr); lineI(head([[x0, y0], [x1, y1]], 16 + 8 * pr), 'ink', 4); }
   text('PRESIÓN DEL OCÉANO', cx, cy - 560, 44, 'title', 'ink', T.presion, T.presion + 0.6, { align: 'center' });
   text('AUMENTA CON LA PROFUNDIDAD', cx, cy - 505, 32, 'label', 'ink', T.aumentaba, T.aumentaba + 0.6, { align: 'center' });
   // límite: el casco no pudo soportarla (fractura en rojo, sin dramatizar)
   if (crack > 0) { const r = H.rng(63); for (let k2 = 0; k2 < 5; k2++) { const a = -0.4 + k2 * 0.42 + r.range(-0.1, 0.1); const P = []; let rr = R + 10; for (let j = 0; j < 7; j++) { rr -= th * 0.55; P.push([cx + Math.cos(a + r.range(-0.05, 0.05)) * rr, cy + Math.sin(a + r.range(-0.05, 0.05)) * rr]); } line([[cx + Math.cos(a) * (R + 12), cy + Math.sin(a) * (R + 12)], ...P], 'red', 4, T.soportarla + k2 * 0.06, T.soportarla + 0.25 + k2 * 0.06); } }
   stamp('LÍMITE DEL CASCO', cx, cy + 500, 50, T.soportarla + 0.3, 'red');
  }
  arrowL([[1500, 3800], [1200, 4000], [900, 4150], [700, 4300]], 'ink', 4, T.las12 - 0.4, T.las12 + 0.2);

  // ---------------- SECCIÓN 5: 129 personas (55–58.6 s) ----------------
  { const cx = S5[0], top = S5[1] - 640;
   text('129', cx, top + 150, 170, 'num', 'ink', T.n129, T.n129 + 0.5, { align: 'center' });
   text('PERSONAS A BORDO', cx, top + 240, 46, 'title', 'ink', T.personas, T.personas + 0.6, { align: 'center' });
   // 129 trazos (en grupos de 5) dibujados por el plotter, en silencio
   const t0 = T.personas + 0.2, t1 = T.vida + 0.3;
   for (let i = 0; i < 129; i++) { const g = Math.floor(i / 5), k2 = i % 5, row = Math.floor(g / 6), col = g % 6, x = cx - 400 + col * 140 + k2 * 22, y = top + 360 + row * 120; const a = t0 + (t1 - t0) * i / 129;
    if (k2 < 4) line([[x, y], [x, y + 80]], 'ink', 3.4, a, a + 0.04); else line([[x - 92, y + 64], [x + 4, y + 14]], 'ink', 3.4, a, a + 0.04); }
   text('10 ABRIL 1963', cx, top + 880, 36, 'label', 'ink', T.vida, T.vida + 0.5, { align: 'center' });
  }
  arrowL([[1060, 4600], [1200, 4600], [1300, 4600], [1420, 4600]], 'ink', 4, T.oceano13 - 0.4, T.oceano13 + 0.1);

  // ---------------- SECCIÓN 6: la lección (59–68 s) ----------------
  { const cx = S6[0], top = S6[1] - 660;
   text('EL OCÉANO NO NECESITA', cx, top + 40, 48, 'title', 'ink', T.oceano13, T.oceano13 + 0.8, { align: 'center' });
   text('UNA GRIETA', cx, top + 110, 48, 'title', 'ink', T.grieta - 0.1, T.grieta + 0.4, { align: 'center' });
   // esquema del sistema de emergencia: aire comprimido -> válvula -> tanque de lastre
   const y = top + 420;
   line(rrect(cx - 440, y - 80, 110, 220, 50), 'ink', 4, T.aveces, T.aveces + 0.4);
   text('AIRE', cx - 385, y + 190, 34, 'label', 'ink', T.aveces + 0.2, T.aveces + 0.5, { align: 'center' });
   text('COMPRIMIDO', cx - 385, y + 230, 30, 'label', 'ink', T.aveces + 0.3, T.aveces + 0.6, { align: 'center' });
   line([[cx - 330, y + 30], [cx - 80, y + 30]], 'ink', 4, T.basta || T.aveces + 0.5, (T.basta || T.aveces + 0.5) + 0.4);
   const vx = cx - 20; line([[vx - 60, y], [vx + 60, y + 60], [vx + 60, y], [vx - 60, y + 60], [vx - 60, y]], 'ink', 4, T.sistema14, T.sistema14 + 0.4);
   text('VÁLVULA', vx, y - 40, 34, 'label', 'ink', T.sistema14 + 0.2, T.sistema14 + 0.6, { align: 'center' });
   line([[vx + 60, y + 30], [cx + 230, y + 30]], 'ink', 4, T.sistema14 + 0.4, T.sistema14 + 0.7);
   line(rrect(cx + 230, y - 80, 220, 220, 26), 'ink', 4, T.sistema14 + 0.6, T.sistema14 + 1.0);
   hatch(cx + 236, y - 74, 208, 208, 0.85, 15).forEach((s) => line(s, 'water', 2, T.sistema14 + 0.9, T.sistema14 + 1.1));
   text('TANQUE DE LASTRE', cx + 340, y + 200, 32, 'label', 'ink', T.sistema14 + 0.9, T.sistema14 + 1.3, { align: 'center' });
   // no funciona cuando más se necesita
   line([[vx - 90, y - 40], [vx + 90, y + 100]], 'red', 9, T.nofunc, T.nofunc + 0.15); line([[vx + 90, y - 40], [vx - 90, y + 100]], 'red', 9, T.nofunc + 0.15, T.nofunc + 0.3);
   stamp('CUANDO MÁS SE NECESITA', cx, y + 420, 44, T.necesita - 0.4, 'red');
   text('TRAS EL THRESHER, LA MARINA DE EE. UU.', cx, y + 560, 30, 'label', 'ink', T.necesita - 0.3, T.necesita + 0.3, { align: 'center' });
   text('CREÓ EL PROGRAMA DE SEGURIDAD SUBSAFE', cx, y + 604, 30, 'label', 'ink', T.necesita - 0.1, T.necesita + 0.5, { align: 'center' });
  }
  // ---------------- cajetín final (título de la lámina) ----------------
  { const x0 = 330, y0 = 5960, x1 = 1830, y1 = 6500;
   line([[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]], 'ink', 5, T.asombro - 0.6, T.asombro);
   line([[x0, y0 + 220], [x1, y0 + 220]], 'ink', 3, T.asombro, T.asombro + 0.2);
   line([[x0, y0 + 400], [x1, y0 + 400]], 'ink', 3, T.tag, T.tag + 0.2);
   line([[x0 + 500, y0 + 400], [x0 + 500, y1]], 'ink', 3, T.tag + 0.2, T.tag + 0.3); line([[x0 + 1000, y0 + 400], [x0 + 1000, y1]], 'ink', 3, T.tag + 0.3, T.tag + 0.4);
   text('ASOMBROTECA', (x0 + x1) / 2, y0 + 150, 120, 'title', 'ink', T.asombro, T.asombro + 0.7, { align: 'center' });
   text('LA CIENCIA OCULTA DE LO IMPOSIBLE', (x0 + x1) / 2, y0 + 330, 60, 'label', 'ink', T.tag, T.tag + 1.4, { align: 'center' });
   text('DWG NO. SUB-1963', x0 + 40, y1 - 50, 34, 'label', 'ink', T.tag + 0.4, T.tag + 0.9); text('ESCALA: SIN ESCALA', x0 + 540, y1 - 50, 34, 'label', 'ink', T.tag + 0.5, T.tag + 1.0); text('HOJA 1/1', x0 + 1040, y1 - 50, 34, 'label', 'ink', T.tag + 0.6, T.tag + 1.1);
  }
  return items;
 }

 // ================= RENDER (adaptado del explainer original) =================
 const XC = {};
 const PX0 = -40, PY0 = -40, PX1 = 2200, PY1 = 6760;
 function buildSheet() {
  const nz = H.makeNoise(88);
  const sw = 1150, sh = 3450, sl = H.layer(sw, sh), sc = sl.getContext('2d'), id = sc.createImageData(sw, sh), d = id.data, base = [22, 58, 112];
  const grid = (step, fn) => { const gw = Math.ceil(sw / step) + 2, gh = Math.ceil(sh / step) + 2, G = new Float32Array(gw * gh); for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) G[j * gw + i] = fn(i * step, j * step); return (x, y) => { const fx = x / step, fy = y / step, i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, o = j * gw + i; return (G[o] * (1 - u) + G[o + 1] * u) * (1 - v) + (G[o + gw] * (1 - u) + G[o + gw + 1] * u) * v; }; };
  const gA = grid(2, (x, y) => nz.fbm2(x * 0.006, y * 0.006, 4) * 0.24), gB = grid(4, (x, y) => Math.max(0, nz.fbm2(x * 0.003 + 40, y * 0.003, 3) - 0.15) * 0.55);
  const VN = 256, vl = new Float32Array(VN * VN), vr = H.rng(881); for (let i = 0; i < vl.length; i++) vl[i] = vr() * 2 - 1;
  const vn = (x, y) => { const ix = Math.floor(x), iy = Math.floor(y), u = x - ix, v = y - iy, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v); const x0 = ix & 255, x1 = (ix + 1) & 255, y0 = (iy & 255) * VN, y1 = ((iy + 1) & 255) * VN; const a = vl[y0 + x0], b = vl[y0 + x1], c2 = vl[y1 + x0], e = vl[y1 + x1]; return (a + (b - a) * su) * (1 - sv) + (c2 + (e - c2) * su) * sv; };
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
   const m = gA(x, y) + (vn(x * 0.06 + 10, y * 0.06) * 0.65 + vn(x * 0.14, y * 0.14 + 7) * 0.35) * 0.07 + gB(x, y);
   const fade = Math.max(0, 1 - Math.hypot(x - 160, y - 200) / 1400) * 0.16;
   const wx = x * 2 - 100, wy = y * 2 - 100, dE = Math.min(wx - PX0, PX1 - wx, wy - PY0, PY1 - wy), edge = (1 - H.smooth(0, 230, dE)) * 0.3;
   const k = 1 + m + fade - edge, i = (y * sw + x) * 4;
   d[i] = base[0] * k + fade * 40; d[i + 1] = base[1] * k + fade * 30; d[i + 2] = base[2] * k + fade * 25; d[i + 3] = 255;
  }
  sc.putImageData(id, 0, 0); XC.sheet = sl;
  const TS = 1024, tl = H.layer(TS, TS), tc = tl.getContext('2d'), rr = H.rng(4);
  for (let i = 0; i < 1900; i++) { tc.fillStyle = rr.chance(0.7) ? `rgba(160,190,230,${rr.range(0.05, 0.25)})` : `rgba(5,20,50,${rr.range(0.1, 0.3)})`; tc.fillRect(rr.range(0, TS - 2), rr.range(0, TS - 2), rr.range(0.6, 1.8), rr.range(0.6, 1.8)); }
  XC.speck = tl;
  const fr = H.rng(31), fib = (vert, len) => { const st = vert ? H.layer(24, len) : H.layer(len, 24), fc = st.getContext('2d'); for (let i = 0; i < len * 0.6; i++) { const a = fr.range(0, len), o = 12 + fr.gauss() * 1.8, sz = fr.range(0.6, 2.2); fc.fillStyle = `rgba(200,220,245,${fr.range(0.1, 0.45)})`; if (vert) fc.fillRect(o, a, sz * 0.7, sz); else fc.fillRect(a, o, sz, sz * 0.7); } return st; };
  XC.fibV = fib(true, 7000); XC.fibH = [fib(false, 2400), fib(false, 2400), fib(false, 2400)];
  XC.nz = nz;
 }
 const CREASES = { v: [1080], h: [1980, 3960, 5880] };
 const seg = (pts, step = 3) => { const out = []; for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step)); for (let j = 0; j < n; j++) out.push([x0 + (x1 - x0) * j / n, y0 + (y1 - y0) * j / n]); } out.push(pts[pts.length - 1]); return out; };
 let LL = null;
 function explainer(ctx, Wd, Hd, t) {
  if (!XC.sheet) buildSheet();
  const nz = XC.nz, items = story(t), cam = camAt(t), z = cam[2];
  const apply = (c) => { c.translate(W / 2, HH / 2); c.scale(z, z); c.translate(-cam[0], -cam[1]); };
  const toS = ([x, y]) => [(x - cam[0]) * z + W / 2, (y - cam[1]) * z + HH / 2];
  const vx0 = cam[0] - W / 2 / z, vx1 = cam[0] + W / 2 / z, vy0 = cam[1] - HH / 2 / z, vy1 = cam[1] + HH / 2 / z;
  ctx.save(); ctx.fillStyle = '#0a1c3a'; ctx.fillRect(0, 0, W, HH); apply(ctx);
  ctx.imageSmoothingEnabled = true; ctx.drawImage(XC.sheet, -100, -100, 2300, 6900);
  ctx.fillStyle = ctx.createPattern(XC.speck, 'repeat'); ctx.fillRect(vx0 - 4, vy0 - 4, vx1 - vx0 + 8, vy1 - vy0 + 8);
  for (let x = Math.floor(vx0 / 40) * 40; x < vx1; x += 40) { ctx.fillStyle = x % 200 === 0 ? 'rgba(200,220,255,0.10)' : 'rgba(200,220,255,0.045)'; ctx.fillRect(x, vy0, 1 / z, vy1 - vy0); }
  for (let y = Math.floor(vy0 / 40) * 40; y < vy1; y += 40) { ctx.fillStyle = y % 200 === 0 ? 'rgba(200,220,255,0.10)' : 'rgba(200,220,255,0.045)'; ctx.fillRect(vx0, y, vx1 - vx0, 1 / z); }
  ctx.restore();
  // ---------- line work ----------
  if (!LL) LL = H.layer(W, HH);
  const c = LL.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, HH);
  c.save(); apply(c);
  c.lineCap = 'round'; c.lineJoin = 'round';
  // borde de la lámina con zonas
  c.strokeStyle = '#eef4ff'; c.lineWidth = 4; c.strokeRect(20, 20, 2120, 6680); c.lineWidth = 1.5; c.strokeRect(2, 2, 2156, 6716);
  for (let y = 20; y <= 6700; y += 445) { c.beginPath(); c.moveTo(2, y); c.lineTo(20, y); c.moveTo(2140, y); c.lineTo(2158, y); c.stroke(); }
  const font = (it) => (it.font === 'label' ? `600 ${it.size * 0.86}px "IBM Plex Mono"` : `700 ${it.size * (it.font === 'num' ? 0.95 : 0.9)}px "Space Mono"`);
  const col = (role) => (role === 'red' ? RED : '#eef4ff');
  const measure = (it, p) => { c.save(); c.font = font(it); const s = it.s.toUpperCase(), w = c.measureText(s).width, x0 = it.align === 'center' ? it.x - w / 2 : it.x; const w2 = c.measureText(s.slice(0, Math.ceil(s.length * p))).width; c.restore(); return it.vert ? [it.x, it.y - w2] : [x0 + w2, it.y - it.size * 0.3]; };
  for (const it of items) {
   const p = it.inst ? 1 : win(t, it.a, it.b);
   if (p <= 0) continue;
   c.strokeStyle = c.fillStyle = col(it.role);
   c.globalAlpha = (it.role === 'cl' ? 0.7 : it.role === 'water' ? 0.55 : 0.95) * (it.al == null ? 1 : it.al);
   if (it.k === 'line') {
    let P = seg(it.pts, 3); if (p < 1) P = P.slice(0, Math.max(2, Math.ceil(P.length * p)));
    c.lineWidth = Math.max(1.8, it.w * 0.8);
    c.setLineDash(it.role === 'cl' ? [22, 5, 4, 5] : []);
    c.beginPath(); P.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke(); c.setLineDash([]);
    if (it.pts.length === 3 && it.w >= 3 && p >= 1 && Math.hypot(it.pts[0][0] - it.pts[2][0], it.pts[0][1] - it.pts[2][1]) < 60) { c.beginPath(); c.moveTo(...it.pts[0]); c.lineTo(...it.pts[1]); c.lineTo(...it.pts[2]); c.closePath(); c.fill(); }
   } else if (it.k === 'dot') { c.beginPath(); c.arc(it.x, it.y, it.r * 0.8, 0, 7); c.fill(); }
   else if (it.k === 'ring') { c.lineWidth = 2.4; c.beginPath(); c.arc(it.x, it.y, it.r, 0, 7); c.stroke(); }
   else {
    c.save(); c.font = font(it); const s = it.s.toUpperCase(), w = c.measureText(s).width;
    if (it.vert) { c.translate(it.x, it.y); c.rotate(-Math.PI / 2); c.fillText(s.slice(0, Math.ceil(s.length * p)), 0, 0); }
    else { c.translate(it.align === 'center' ? it.x - w / 2 : it.x, it.y); c.fillText(s.slice(0, Math.ceil(s.length * p)), 0, 0); }
    c.restore();
   }
  }
  c.globalAlpha = 1; c.restore();
  // exposición irregular: las líneas pierden un poco de tinta (anclado a la lámina) + motas sin exponer
  { const id = c.getImageData(0, 0, W, HH), d = id.data, iz = 1 / z;
   for (let i = 3, q = 0; i < d.length; i += 4, q++) { if (!d[i]) continue; const x = q % W, y = (q / W) | 0, wx = (x - W / 2) * iz + cam[0], wy = (y - HH / 2) * iz + cam[1]; const hx = (wx * 0.5) | 0, hy = (wy * 0.5) | 0, hh = Math.imul(hx * 73856093 ^ hy * 19349663, 0x9E3779B1) >>> 0; d[i] *= 0.74 + 0.26 * (0.5 + 0.5 * nz.n2(wx * 0.03, wy * 0.03)) - ((hh & 1023) < 70 ? 0.3 : 0); }
   c.putImageData(id, 0, 0); }
  ctx.save(); ctx.filter = 'blur(2.5px)'; ctx.globalAlpha = 0.45; ctx.drawImage(LL, 0, 0); ctx.restore();
  ctx.save(); ctx.filter = 'blur(0.5px)'; ctx.drawImage(LL, 0, 0); ctx.restore();
  // pliegues de la lámina con fibras
  ctx.save(); apply(ctx);
  const fold = (pos, vert) => { const g = vert ? ctx.createLinearGradient(pos - 40, 0, pos + 40, 0) : ctx.createLinearGradient(0, pos - 34, 0, pos + 34); g.addColorStop(0, 'rgba(0,10,30,0)'); g.addColorStop(0.48, 'rgba(0,10,30,0.22)'); g.addColorStop(0.5, 'rgba(190,210,240,0.22)'); g.addColorStop(0.56, 'rgba(190,210,240,0.06)'); g.addColorStop(1, 'rgba(190,210,240,0)'); ctx.fillStyle = g; if (vert) ctx.fillRect(pos - 40, vy0, 80, vy1 - vy0); else ctx.fillRect(vx0, pos - 34, vx1 - vx0, 68); };
  CREASES.v.forEach((p) => fold(p, true)); CREASES.h.forEach((p) => fold(p, false));
  if (vx0 < 1100 && vx1 > 1060) ctx.drawImage(XC.fibV, 1080 - 12, -100);
  CREASES.h.forEach((p, i) => { if (vy0 < p + 20 && vy1 > p - 20) ctx.drawImage(XC.fibH[i], -100, p - 12); });
  ctx.restore();
  // cabezal del plotter sobre el trazo en curso
  let tip = null; for (const it of items) { if (it.inst || it.k !== 'line' && it.k !== 'text') continue; const p = win(t, it.a, it.b); if (p > 0 && p < 1) tip = it.k === 'line' ? it.pts[Math.min(it.pts.length - 1, Math.floor(p * (it.pts.length - 1)))] : measure(it, p); }
  if (tip) { const [x, y] = toS(tip); const gl = ctx.createRadialGradient(x, y, 0, x, y, 30); gl.addColorStop(0, 'rgba(230,245,255,0.8)'); gl.addColorStop(1, 'rgba(230,245,255,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 30, y - 30, 60, 60); ctx.strokeStyle = 'rgba(240,248,255,0.9)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.moveTo(x - 22, y); ctx.lineTo(x - 6, y); ctx.moveTo(x + 6, y); ctx.lineTo(x + 22, y); ctx.moveTo(x, y - 22); ctx.lineTo(x, y - 6); ctx.moveTo(x, y + 6); ctx.lineTo(x, y + 22); ctx.stroke(); ctx.setLineDash([3, 4]); ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }
  H.grain(ctx, W, HH, 0.04, 6 + (Math.floor(t * 12) % 4));
  H.vignette(ctx, W, HH, 0.3, '0,8,25');
  subtitles(ctx, t);
  window.__lastItems = items;
 }
 // ---------- subtítulos: blancos sin caja, barra amarilla fina ----------
 function subtitles(c, t) {
  const ph = A.phrases.find((p) => t >= p.s && t < p.e); if (!ph) return;
  const a = sm(ph.s - 0.02, ph.s + 0.1, t) * (1 - sm(ph.e - 0.1, ph.e, t));
  let px = 58; c.font = `700 ${px}px "Space Mono"`; const maxW = 900;
  const widest = Math.max(...ph.lines.map((l) => c.measureText(l).width)); if (widest > maxW) { px = Math.floor(px * maxW / widest); c.font = `700 ${px}px "Space Mono"`; }
  const lh = px * 1.3, y0 = (ph.s >= A.segments[16].s - 0.05 ? 1210 : 1500) - (ph.lines.length - 1) * lh / 2, sp = c.measureText(' ').width;
  const boxes = []; let wi = 0;
  ph.lines.forEach((ln, li) => { const lw = c.measureText(ln).width; let cx = 540 - lw / 2; ln.split(' ').forEach((w) => { const ww = c.measureText(w).width; boxes.push({ w, x: cx, y: y0 + li * lh, ww, s: ph.w[wi] ? ph.w[wi].s : ph.s, e: ph.w[wi] ? ph.w[wi].e : ph.e }); wi++; cx += ww + sp; }); });
  let act = boxes.findIndex((b) => t >= b.s && t < b.e); if (act < 0) act = t >= boxes[boxes.length - 1].s ? boxes.length - 1 : 0;
  const b0 = boxes[act], nb = boxes[act + 1]; let bx = b0.x, bw = b0.ww;
  if (nb && nb.y === b0.y) { const f = eio(sm(b0.e - 0.08, b0.e, t)); bx = H.lerp(b0.x, nb.x, f); bw = H.lerp(b0.ww, nb.ww, f); }
  c.save(); c.globalAlpha = a; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  c.fillStyle = '#f0b90b'; c.beginPath(); c.roundRect(bx, b0.y + px * 0.18, bw, Math.max(6, px * 0.09), 3); c.fill();
  c.shadowColor = 'rgba(0,8,25,0.9)'; c.shadowBlur = 16; c.shadowOffsetY = 3; c.fillStyle = '#ffffff';
  for (const b of boxes) c.fillText(b.w, b.x, b.y);
  c.restore();
 }
 window.EPISODIO = { explainer, init: async () => {}, T, DURATION, wt, story };
})();
