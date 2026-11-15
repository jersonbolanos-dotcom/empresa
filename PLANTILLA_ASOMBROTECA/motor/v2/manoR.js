
 // ==================================================================================================================
 // v1.44 · P.manoR — MANO SEMIRREALISTA VECTORIAL (esqueleto 3D + perspectiva suave + degradados), original, nítida a cualquier tamaño.
 //  P.manoR(ctx, pose, x, y, alto, o) — alto = largo de la mano (muñeca → punta del medio) en px; (x, y) = el punto de anclaje.
 //   pose: ver MANO_POSES (señalar, tocar, celular, pinza, palma, alto, saludo, puño, pulgar, ok, agarrar, perilla, llave, botón,
 //         golpecito, espolvorear, contar1..5, relajada).
 //   o: { vista: 'dorso' | 'palma' | 'lado' (según la pose), lado: 'derecha' | 'izquierda', piel: 'claro' | 'medio' | 'oscuro' | '#hex',
 //        guante (true: guante de moto), ancla: 'punta' | 'muneca' | 'palma' | 'objeto', ang (giro extra en radianes), t (tiempo,
 //        para saludar/deslizar/espolvorear), objeto (forzar: 'celular' | 'tarjeta' | 'grano' | 'moneda' | 'bola' | 'manubrio' | 'taza' |
 //        'cuchara' | 'perilla' | 'llave' | 'boton' | null), pantalla (color), dibujoPantalla(ctx, quad) }.
 //   Devuelve { punta, muneca, palma, objeto } en px.
 // ==================================================================================================================
 {
  const D2R = Math.PI / 180, cl01 = (v) => Math.max(0, Math.min(1, v));
  const hexRgb = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const tonoR = (h, f) => { const c = hexRgb(h).map((v) => Math.round(Math.max(0, Math.min(255, f < 0 ? v * (1 + f) : v + (255 - v) * f)))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
  const PIEL = { claro: '#f0c8a4', medio: '#d29a70', oscuro: '#8c5a3a' };
  const nrm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const orto = (p, v) => nrm(add(p, v, -dot(p, v)));
  // ---------- ESQUELETO (mano derecha, vista de dorso: x hacia el meñique, y hacia los dedos, z hacia el que mira = dorso) ----------
  const DEDO = [ // base (nudillo), largos de falanges, radios [base, medio, distal, punta], abertura de reposo (°)
   { b: [-29, 97, 2], L: [43, 25, 20], r: [9.6, 8.8, 8.0, 7.2], ab: -6 },
   { b: [-9.5, 101, 3], L: [48, 29, 21], r: [10, 9.2, 8.3, 7.4], ab: -1 },
   { b: [10, 98, 2], L: [45, 27, 21], r: [9.4, 8.6, 7.8, 7.0], ab: 4 },
   { b: [27.5, 90, 0], L: [35, 21, 18], r: [8.2, 7.4, 6.8, 6.1], ab: 10 }];
  const PULGAR = { b: [-22, 28, -6], L: [33, 28, 24], r: [15, 11, 9.8, 8.6] };
  // cadena: base, dirección inicial v, dirección de flexión p, ángulos (°) → puntos y marcos
  const cadena = (B, v, p, L, ang) => { const pts = [B], fr = []; let P = B; for (let i = 0; i < L.length; i++) { const a = (ang[i] || 0) * D2R, v2 = add(v.map((q) => q * Math.cos(a)), p, Math.sin(a)), p2 = add(p.map((q) => q * Math.cos(a)), v, -Math.sin(a)); v = nrm(v2); p = nrm(p2); P = add(P, v, L[i]); pts.push(P); fr.push({ v, p }); } return { pts, fr }; };
  // pose → geometría en espacio de la mano
  const geom = (ps) => { const F = DEDO.map((d, i) => { const f = ps.f[i] || [0, 0, 0, 0], ab = (d.ab * (ps.sp ?? 1) + (f[3] || 0)) * D2R, v = [Math.sin(ab), Math.cos(ab), 0]; return cadena(d.b, v, [0, 0, -1], d.L, [f[0], f[1], f[2]]); });
   const th = ps.th || {}, rest = nrm([-0.5, 0.82, -0.28]), opp = nrm([0.3, 0.58, -0.76]), v = th.dir ? nrm(th.dir) : nrm(add(rest.map((q) => q * (1 - (th.o ?? 0.2))), opp, th.o ?? 0.2)), p = orto(nrm(th.flex || [0.62, 0.15, -0.77]), v);
   const T = cadena(PULGAR.b, v, p, PULGAR.L, [th.a0 ?? 0, th.a1 ?? 10, th.a2 ?? 10]); return { F, T }; };
  // rotación global (yaw y, pitch x, roll z) y proyección con perspectiva suave
  const rot = (P, R) => { let [x, y, z] = P; const [cy, sy, cx, sx, cz, sz] = R; let x1 = x * cy + z * sy, z1 = -x * sy + z * cy; x = x1; z = z1; let y1 = y * cx - z * sx, z2 = y * sx + z * cx; y = y1; z = z2; let x2 = x * cz - y * sz, y2 = x * sz + y * cz; return [x2, y2, z]; };
  const PERS = 640;
  // ---------- POSES ----------
  // f: por dedo [nudillo, medio, punta, abertura extra] en grados (flexión hacia la palma); th: pulgar { o: oposición 0..1, a0, a1, a2 }
  const CURL = [86, 100, 58, 0], MEDIO = [40, 55, 30, 0];
  const MP = {
   senala: { f: [[0, 4, 2, 0], CURL, CURL, CURL], th: { o: 0.75, a0: 12, a1: 30, a2: 20 }, sp: 0.6 },
   toca: { f: [[18, 14, 6, 0], CURL, CURL, CURL], th: { o: 0.75, a0: 12, a1: 30, a2: 20 }, sp: 0.6 },
   celular: { f: [[12, 34, 22, -2], [12, 36, 22, 0], [14, 38, 22, 2], [16, 40, 22, 4]], th: { o: 0.25, a0: 0, a1: 6, a2: 6 }, sp: 0.25, obj: 'celular' },
   celular_pulgar: { f: [[12, 34, 22, -2], [12, 36, 22, 0], [14, 38, 22, 2], [16, 40, 22, 4]], th: { dir: [0.3, 0.92, -0.45], flex: [0.2, 0.3, -0.9], a0: 8, a1: 12, a2: 8 }, sp: 0.25, obj: 'celular', pulgarPantalla: true },
   pinza: { f: [[38, 44, 20, 3], [40, 52, 30, 0], [48, 58, 32, 0], [55, 60, 34, 0]], th: { o: 0.82, a0: 10, a1: 18, a2: 10 }, sp: 0.5, obj: 'tarjeta' },
   palma: { f: [[8, 14, 8, 0], [8, 14, 8, 0], [10, 16, 10, 0], [12, 18, 10, 0]], th: { o: 0.1, a0: 0, a1: 6, a2: 6 }, sp: 0.6, obj: 'bola' },
   alto: { f: [[0, 2, 1, 0], [0, 2, 1, 0], [0, 2, 1, 0], [0, 2, 1, 0]], th: { o: 0.05, a0: -6, a1: 4, a2: 4 }, sp: 1.25 },
   puno: { f: [CURL, CURL, CURL, CURL], th: { o: 0.8, a0: 18, a1: 34, a2: 26 }, sp: 0.4 },
   pulgar: { f: [CURL, CURL, CURL, CURL], th: { dir: [-0.95, 0.3, 0.1], a0: -4, a1: 0, a2: 0 }, sp: 0.4 },
   ok: { f: [[40, 58, 34, 4], [6, 6, 4, 0], [6, 8, 4, 0], [8, 10, 6, 0]], th: { o: 0.85, a0: 16, a1: 24, a2: 16 }, sp: 1.1 },
   agarrar: { f: [[70, 80, 46, 0], [72, 82, 48, 0], [74, 82, 48, 0], [76, 80, 46, 0]], th: { o: 0.7, a0: 14, a1: 30, a2: 20 }, sp: 0.2, obj: 'manubrio' },
   perilla: { f: [[30, 50, 26, -6], [32, 52, 28, -2], [34, 52, 28, 3], [36, 50, 26, 8]], th: { o: 0.9, a0: 16, a1: 14, a2: 12 }, sp: 1.0, obj: 'perilla' },
   llave: { f: [[36, 42, 20, 3], CURL, CURL, CURL], th: { o: 0.8, a0: 10, a1: 16, a2: 10 }, sp: 0.5, obj: 'llave' },
   boton: { f: [[24, 18, 6, 0], CURL, CURL, CURL], th: { o: 0.75, a0: 12, a1: 30, a2: 20 }, sp: 0.6, obj: 'boton' },
   golpecito: { f: [CURL, CURL, CURL, CURL], th: { o: 0.8, a0: 18, a1: 34, a2: 26 }, sp: 0.4 },
   espolvorear: { f: [[40, 48, 22, 4], [44, 50, 24, 0], [52, 56, 28, -2], [58, 58, 30, -4]], th: { o: 0.9, a0: 14, a1: 20, a2: 12 }, sp: 0.3, obj: 'sal' },
   relajada: { f: [[14, 20, 10, 0], [18, 26, 12, 0], [22, 30, 14, 0], [26, 34, 16, 0]], th: { o: 0.25, a0: 4, a1: 14, a2: 12 }, sp: 0.5 },
   contar1: { f: [[0, 2, 1, 0], CURL, CURL, CURL], th: { o: 0.85, a0: 18, a1: 34, a2: 26 }, sp: 0.8 },
   contar2: { f: [[0, 2, 1, -4], [0, 2, 1, 4], CURL, CURL], th: { o: 0.85, a0: 18, a1: 34, a2: 26 }, sp: 0.8 },
   contar3: { f: [[0, 2, 1, -4], [0, 2, 1, 0], [0, 2, 1, 4], CURL], th: { o: 0.85, a0: 18, a1: 34, a2: 26 }, sp: 0.8 },
   contar4: { f: [[0, 2, 1, -4], [0, 2, 1, 0], [0, 2, 1, 4], [0, 2, 1, 8]], th: { o: 0.85, a0: 18, a1: 34, a2: 26 }, sp: 0.9 },
   contar5: { f: [[0, 2, 1, -4], [0, 2, 1, 0], [0, 2, 1, 4], [0, 2, 1, 8]], th: { o: 0.05, a0: -6, a1: 4, a2: 4 }, sp: 1.15 },
  };
  // vista → giro de la mano (yaw, pitch, roll en grados)
  const VISTA = { dorso: [0, 0, 0], palma: [180, 0, 0], lado: [-80, 0, 0] };
  // ---------- OBJETOS (en espacio de la mano; cada uno con su profundidad para el orden de dibujo) ----------
  const OBJ = {
   celular: { c: [6, 126, -30], w: 74, h: 152, t: 9, ux: [0, 1, 0], uy: [1, 0, 0] },
   tarjeta: { c: [-36, 168, -18], w: 64, h: 40 }, moneda: { c: [-36, 162, -18], r: 16 }, grano: { c: [-34, 158, -16], r: 6 },
   bola: { c: [0, 72, -46], r: 30 }, boton: { c: [-29, 186, -24], r: 22 }, perilla: { c: [0, 120, -60], r: 46 },
  };
  // ---------- DIBUJO ----------
  const polyFinger = (S, rr) => { // S: puntos 2D de la cadena; rr: radios 2D por punto → contorno (lado izq + punta + lado der)
   const n = S.length, L = [], Rr = []; for (let i = 0; i < n; i++) { const a = S[Math.max(0, i - 1)], b = S[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; L.push([S[i][0] + nx * rr[i], S[i][1] + ny * rr[i]]); Rr.push([S[i][0] - nx * rr[i], S[i][1] - ny * rr[i]]); }
   const e = S[n - 1], d = S[n - 2], ang = Math.atan2(e[1] - d[1], e[0] - d[0]); return { L, R: Rr, tip: e, ang, rt: rr[n - 1] }; };
  const trazaDedo = (ctx, g, conBase) => { ctx.beginPath(); ctx.moveTo(g.L[0][0], g.L[0][1]); for (let i = 1; i < g.L.length; i++) { const a = g.L[i - 1], b = g.L[i]; ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); } ctx.lineTo(g.L[g.L.length - 1][0], g.L[g.L.length - 1][1]); ctx.arc(g.tip[0], g.tip[1], g.rt, g.ang - Math.PI / 2, g.ang + Math.PI / 2); for (let i = g.R.length - 1; i > 0; i--) { const a = g.R[i], b = g.R[i - 1]; ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); } ctx.lineTo(g.R[0][0], g.R[0][1]); if (conBase) ctx.closePath(); };
  const hull = (pts) => { const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], up = []; for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); } for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); } return lo.slice(0, -1).concat(up.slice(0, -1)); };
  const trazaSuave = (ctx, H) => { const n = H.length; ctx.beginPath(); for (let i = 0; i <= n; i++) { const a = H[i % n], b = H[(i + 1) % n], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; if (i === 0) ctx.moveTo(m[0], m[1]); else ctx.quadraticCurveTo(a[0], a[1], m[0], m[1]); } ctx.closePath(); };

  P.manoR = (ctx, pose, x, y, alto, o = {}) => { const ps0 = MP[pose] || MP.relajada, t = o.t || 0; let ps = ps0;
   const vista = o.vista || (pose === 'alto' || pose === 'palma' || pose === 'saludo' || pose.startsWith('contar') || pose.startsWith('celular') ? 'palma' : 'dorso');
   const izq = o.lado === 'izquierda', guante = !!o.guante, base = guante ? '#2d2f36' : (PIEL[o.piel] || o.piel || PIEL.medio);
   const hl = guante ? '#565a66' : tonoR(base, 0.16), sh = guante ? '#1b1c21' : tonoR(base, -0.2), lin = guante ? '#101114' : tonoR(base, -0.38), cre = guante ? 'rgba(255,255,255,0.18)' : tonoR(base, -0.28);
   // giro según pose y vista
   let [yw, pt, rl] = VISTA[vista] || VISTA.dorso; const R0 = o.giro || {};
   if (pose === 'senala' || pose === 'toca' || pose === 'boton') { const dir = o.dir || 'arriba'; rl += { arriba: 0, derecha: -90, izquierda: 90, abajo: 180, camara: 0 }[dir]; if (dir === 'camara') { pt -= 50; yw -= 18; } if (pose === 'toca' || pose === 'boton') pt -= 18; }
   const TQ = { puno: [-38, 12, 0], pinza: [-48, 6, 0], golpecito: [-30, 8, 0], perilla: [-20, 0, 0], llave: [-46, 6, 0], espolvorear: [-40, 0, 0] }; if (!o.vista && TQ[pose]) { yw += TQ[pose][0]; pt += TQ[pose][1]; }
   if (pose === 'pulgar') { rl -= 90; if (!o.vista) yw -= 20; }
   if (pose === 'golpecito') { rl -= 90; yw += 20; }
   if (pose === 'palma') { pt -= 58; }
   if (pose === 'saludo') { rl += 14 * Math.sin(t * 9); ps = MP.alto; }
   if (pose === 'relajada') { rl += 180; }
   if (pose === 'espolvorear') { rl += 180; pt -= 20; }
   if (pose.startsWith('celular')) { rl -= 90; }
   if (pose === 'agarrar') { pt += 10; }
   if (pose === 'perilla') { pt -= 60; }
   yw += R0.yaw || 0; pt += R0.pitch || 0; rl += R0.roll || 0;
   const R = [Math.cos(yw * D2R), Math.sin(yw * D2R), Math.cos(pt * D2R), Math.sin(pt * D2R), Math.cos(rl * D2R), Math.sin(rl * D2R)];
   const G = geom(ps), k = alto / 190, mir = izq ? -1 : 1;
   const pr = (P) => { const q = rot(P, R), s = PERS / (PERS - q[2]); return [q[0] * s * mir, -q[1] * s, q[2], s]; };
   // ancla
   const tipI = G.F[0].pts[3], palmC = [0, 52, 0], objName = o.objeto === undefined ? ps.obj : o.objeto, ob = objName && OBJ[objName];
   const ancW = o.ancla === 'muneca' ? [0, 0, 0] : o.ancla === 'palma' ? palmC : (o.ancla === 'objeto' && ob) ? ob.c : tipI, A = pr(ancW);
   ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang || 0); ctx.scale(k, k); ctx.translate(-A[0], -A[1]);
   const ow = Math.max(1.1, 1.5 / Math.sqrt(k)) ; // contorno fino (en unidades de la mano)
   const items = [];
   // antebrazo + palma (una sola masa: primero el antebrazo, luego la palma por encima)
   const palmPts3 = []; for (const zz of [-12, 12]) { for (const q of [[-30, 2], [-40, 40], [-33, 70], [-31, 92], [-10, 103], [10, 100], [30, 92], [37, 48], [31, 3]]) palmPts3.push([q[0], q[1], zz + (q[1] > 80 ? 1 : 0)]); }
   const palmZ = palmPts3.reduce((s, q) => s + pr(q)[2], 0) / palmPts3.length;
   items.push({ z: palmZ + 0.1, draw: () => { const a = pr([0, 14, 0]), b = pr([0, -150, 0]), wa = 30.5 * a[3], wb = 37 * b[3], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; const P1 = [a[0] + nx * wa, a[1] + ny * wa], P2 = [b[0] + nx * wb, b[1] + ny * wb], P3 = [b[0] - nx * wb, b[1] - ny * wb], P4 = [a[0] - nx * wa, a[1] - ny * wa];
     const g = ctx.createLinearGradient(P1[0], P1[1], P4[0], P4[1]); g.addColorStop(0, hl); g.addColorStop(0.45, base); g.addColorStop(1, sh); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(P1[0], P1[1]); ctx.lineTo(P2[0], P2[1]); ctx.lineTo(P3[0], P3[1]); ctx.lineTo(P4[0], P4[1]); ctx.closePath(); ctx.fill(); ctx.strokeStyle = lin; ctx.lineWidth = ow; ctx.beginPath(); ctx.moveTo(P1[0], P1[1]); ctx.lineTo(P2[0], P2[1]); ctx.moveTo(P3[0], P3[1]); ctx.lineTo(P4[0], P4[1]); ctx.stroke(); if (guante) { ctx.fillStyle = '#1c1d22'; const c1 = [a[0] + (b[0] - a[0]) * 0.12, a[1] + (b[1] - a[1]) * 0.12]; ctx.save(); ctx.translate(c1[0], c1[1]); ctx.rotate(Math.atan2(dy, dx)); ctx.fillRect(-6, -wa * 1.05, 12, wa * 2.1); ctx.restore(); } } });
   items.push({ z: palmZ, draw: () => { const H = hull(palmPts3.map((q) => pr(q))); const c = pr(palmC); const g = ctx.createRadialGradient(c[0] - 20, c[1] - 26, 6, c[0], c[1], 90); g.addColorStop(0, hl); g.addColorStop(0.55, base); g.addColorStop(1, sh); ctx.fillStyle = g; trazaSuave(ctx, H); ctx.fill(); ctx.strokeStyle = lin; ctx.lineWidth = ow; ctx.stroke();
     // palma a la vista: líneas de la palma; dorso: tendones suaves y nudillos
     const nZ = rot([0, 0, 1], R)[2]; if (!guante) { if (nZ < -0.2) { ctx.strokeStyle = cre; ctx.lineWidth = ow * 0.9; ctx.lineCap = 'round'; for (const ln of [[[-30, 62], [-6, 70], [24, 66]], [[-31, 50], [-8, 46], [14, 30]], [[-18, 28], [-14, 50], [-6, 78]]]) { const q = ln.map((v) => pr([v[0], v[1], -12])); ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.quadraticCurveTo(q[1][0], q[1][1], q[2][0], q[2][1]); ctx.stroke(); } } else if (nZ > 0.2) { ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = ow * 1.6; for (const xb of [-24, -8, 9, 25]) { const q0 = pr([xb * 0.55, 18, 12]), q1 = pr([xb, 86, 13]); ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(q1[0], q1[1]); ctx.stroke(); } } }
     if (guante && nZ > 0.2) { ctx.fillStyle = '#1a1b20'; const q = [pr([-30, 84, 14]), pr([30, 80, 14]), pr([30, 92, 14]), pr([-30, 96, 14])]; ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); for (const v of q.slice(1)) ctx.lineTo(v[0], v[1]); ctx.closePath(); ctx.fill(); } } });
   // dedos y pulgar
   const dedoItem = (ch, rads, i, esPulgar) => { const S = ch.pts.map(pr), zA = S.reduce((s, q) => s + q[2], 0) / S.length;
    items.push({ pulgar: esPulgar, z: zA + (esPulgar && ps.pulgarPantalla ? 60 : 0), draw: () => { const rr = rads.map((r, j) => r * S[j][3]); const S2 = S.map((q) => [q[0], q[1]]);
     // base metida en la palma: se alarga hacia atrás para que no se vea una costura
     const b0 = S2[0], b1 = S2[1], dx = b1[0] - b0[0], dy = b1[1] - b0[1], l = Math.hypot(dx, dy) || 1; const ext = [b0[0] - dx / l * rr[0] * 0.9, b0[1] - dy / l * rr[0] * 0.9]; const Sx = [ext].concat(S2), rx = [rr[0]].concat(rr);
     const g = polyFinger(Sx, rx); const m = Sx[Math.floor(Sx.length / 2)], nx = -dy / l, ny = dx / l, grd = ctx.createLinearGradient(m[0] + nx * rr[1], m[1] + ny * rr[1], m[0] - nx * rr[1], m[1] - ny * rr[1]); grd.addColorStop(0, hl); grd.addColorStop(0.5, base); grd.addColorStop(1, sh);
     const flexT = esPulgar ? 0 : (ps.f[i] || [0, 0, 0]).slice(0, 3).reduce((s, v) => s + v, 0);
     if (flexT > 150) { const cp = []; S2.forEach((q, j) => { for (let a = 0; a < 12; a++) cp.push([q[0] + Math.cos(a * Math.PI / 6) * rr[j], q[1] + Math.sin(a * Math.PI / 6) * rr[j]]); }); const Hh = hull(cp); ctx.fillStyle = grd; trazaSuave(ctx, Hh); ctx.fill(); ctx.strokeStyle = lin; ctx.lineWidth = ow; ctx.stroke(); }
     else { ctx.fillStyle = grd; trazaDedo(ctx, g, true); ctx.fill(); ctx.strokeStyle = lin; ctx.lineWidth = ow; trazaDedo(ctx, g, false); ctx.stroke(); }
     // pliegues en las articulaciones y uña
     const dorZ = (j) => rot(ch.fr[j].p.map((q) => -q), R)[2];
     for (let j = 1; j < S2.length - 1; j++) { const a = S2[j - 1], b = S2[j + 1], ddx = b[0] - a[0], ddy = b[1] - a[1], ll = Math.hypot(ddx, ddy) || 1, px = -ddy / ll, py = ddx / ll, r = rr[j] * 0.62, vis = dorZ(Math.min(j, ch.fr.length - 1)); if (Math.abs(vis) < 0.15) continue; ctx.strokeStyle = cre; ctx.lineWidth = ow * 0.75; for (const off of (vis > 0 ? [-1.3, 1.3] : [0])) { ctx.beginPath(); ctx.moveTo(S2[j][0] + px * r + ddx / ll * off, S2[j][1] + py * r + ddy / ll * off); ctx.quadraticCurveTo(S2[j][0] + ddx / ll * (off + (vis > 0 ? 1.6 : 0)), S2[j][1] + ddy / ll * (off + (vis > 0 ? 1.6 : 0)), S2[j][0] - px * r + ddx / ll * off, S2[j][1] - py * r + ddy / ll * off); ctx.stroke(); } }
     const nv = dorZ(ch.fr.length - 1); if (!guante && nv > 0.2) { const e = S2[S2.length - 1], d = S2[S2.length - 2], ddx = e[0] - d[0], ddy = e[1] - d[1], ll = Math.hypot(ddx, ddy) || 1, ang = Math.atan2(ddy, ddx), rt = rr[rr.length - 1], len = Math.min(ll * 0.62, rt * 2.1); const cx = e[0] - ddx / ll * (len * 0.48), cy = e[1] - ddy / ll * (len * 0.48); ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.scale(1, cl01(nv * 1.2)); const ng = ctx.createLinearGradient(0, -rt, 0, rt); ng.addColorStop(0, '#f7ddd2'); ng.addColorStop(1, '#e2b8a6'); ctx.fillStyle = ng; ctx.beginPath(); ctx.roundRect(-len / 2, -rt * 0.66, len, rt * 1.32, rt * 0.62); ctx.fill(); ctx.strokeStyle = tonoR(base, -0.3); ctx.lineWidth = ow * 0.7; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.ellipse(len * 0.05, -rt * 0.28, len * 0.28, rt * 0.12, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
     if (guante && nv > 0.2) { ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.setLineDash([2.4, 2.4]); ctx.lineWidth = ow * 0.7; ctx.beginPath(); ctx.moveTo(S2[1][0], S2[1][1]); ctx.lineTo(S2[S2.length - 2][0], S2[S2.length - 2][1]); ctx.stroke(); ctx.setLineDash([]); }
     if (!esPulgar && dorZ(0) > 0.3 && (ps.f[i] || [0])[0] > 45) { ctx.fillStyle = guante ? '#17181c' : 'rgba(255,255,255,0.22)'; ctx.beginPath(); ctx.ellipse(S2[1][0], S2[1][1], rr[1] * 0.7, rr[1] * 0.5, 0, 0, Math.PI * 2); ctx.fill(); }
    } }); };
   G.F.forEach((ch, i) => dedoItem(ch, DEDO[i].r, i, false)); dedoItem(G.T, PULGAR.r, 4, true);
   // objeto
   if (ob) { const zc = pr(ob.c)[2]; let zo = zc; if (objName === 'celular') zo = pr([ob.c[0], ob.c[1], ob.c[2] - ob.t / 2])[2] - 0.5; if (objName === 'perilla' || objName === 'boton' || objName === 'bola') zo = palmZ - 50; if (objName === 'tarjeta' || objName === 'moneda' || objName === 'grano' || objName === 'llave') zo = (pr(G.F[0].pts[3])[2] + pr(G.T.pts[3])[2]) / 2;
    items.push({ z: zo, draw: () => objetoR(ctx, objName, ob, pr, o, ow, t, G) }); }
   if (objName === 'manubrio') items.push({ z: palmZ - 40, draw: () => manubrioR(ctx, pr, ow, t, o) });
   if (objName === 'cuchara') items.push({ z: palmZ - 40, draw: () => { const a = pr([-70, 62, -26]), b = pr([150, 62, -26]); ctx.strokeStyle = '#aab2bf'; ctx.lineCap = 'round'; ctx.lineWidth = 9 * a[3]; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); const g = ctx.createRadialGradient(b[0] - 6, b[1] - 6, 2, b[0], b[1], 28); g.addColorStop(0, '#f2f4f8'); g.addColorStop(1, '#8a93a3'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(b[0] + 18, b[1], 28, 18, Math.atan2(b[1] - a[1], b[0] - a[0]), 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#6b7383'; ctx.lineWidth = ow; ctx.stroke(); } });
   if (objName === 'taza') items.push({ z: palmZ - 40, draw: () => { const h0 = pr([40, 62, -30]), cx = h0[0] + 70, cy = h0[1]; ctx.strokeStyle = '#e9e4da'; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(h0[0] + 18, cy, 26, 34, 0, 0, Math.PI * 2); ctx.stroke(); const g = ctx.createLinearGradient(cx - 50, 0, cx + 50, 0); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#cfc8bb'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(cx - 46, cy - 62, 92, 120, [6, 6, 22, 22]); ctx.fill(); ctx.strokeStyle = '#a89f90'; ctx.lineWidth = ow; ctx.stroke(); ctx.fillStyle = '#6b3d22'; ctx.beginPath(); ctx.ellipse(cx, cy - 60, 44, 9, 0, 0, Math.PI * 2); ctx.fill(); } });
   if (pose === 'espolvorear' || objName === 'sal') items.push({ z: 999, draw: () => salR(ctx, pr, G, t) });
   items.sort((a, b) => a.z - b.z); for (const it of items) { if (o.capa === 'detras' && it.pulgar) continue; if (o.capa === 'pulgar' && !it.pulgar) continue; it.draw(); }
   ctx.restore();
   const toS = (P) => { const q = pr(P); return [x + (q[0] - A[0]) * k * Math.cos(o.ang || 0) - (q[1] - A[1]) * k * Math.sin(o.ang || 0), y + (q[0] - A[0]) * k * Math.sin(o.ang || 0) + (q[1] - A[1]) * k * Math.cos(o.ang || 0)]; };
   return { punta: toS(tipI), muneca: toS([0, 0, 0]), palma: toS(palmC), objeto: ob ? toS(ob.c) : null, pulgar: toS(G.T.pts[3]) }; };

  // ---------- objetos ----------
  const quadR = (pr, c, ux, uy, w, h) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => pr([c[0] + ux[0] * a * w / 2 + uy[0] * b * h / 2, c[1] + ux[1] * a * w / 2 + uy[1] * b * h / 2, c[2] + ux[2] * a * w / 2 + uy[2] * b * h / 2]));
  const poly = (ctx, Q) => { ctx.beginPath(); ctx.moveTo(Q[0][0], Q[0][1]); for (const q of Q.slice(1)) ctx.lineTo(q[0], q[1]); ctx.closePath(); };
  const objetoR = (ctx, n, ob, pr, o, ow, t, G) => { ctx.lineJoin = 'round';
   if (n === 'celular') { const c = ob.c, ux = ob.ux, uy = ob.uy, F = quadR(pr, [c[0], c[1], c[2] - ob.t / 2], ux, uy, ob.w, ob.h), Bk = quadR(pr, [c[0], c[1], c[2] + ob.t / 2], ux, uy, ob.w, ob.h); ctx.fillStyle = '#2a2d35'; poly(ctx, Bk); ctx.fill(); ctx.fillStyle = '#16181d'; poly(ctx, F); ctx.fill(); ctx.strokeStyle = '#3c404a'; ctx.lineWidth = ow * 1.4; ctx.stroke();
    const S = quadR(pr, [c[0], c[1], c[2] - ob.t / 2 - 0.1], ux, uy, ob.w - 8, ob.h - 12); const g = ctx.createLinearGradient(S[0][0], S[0][1], S[2][0], S[2][1]); g.addColorStop(0, o.pantalla || '#6fc8f7'); g.addColorStop(1, tonoR(o.pantalla || '#6fc8f7', -0.35)); ctx.fillStyle = g; poly(ctx, S); ctx.fill(); if (o.dibujoPantalla) { ctx.save(); poly(ctx, S); ctx.clip(); o.dibujoPantalla(ctx, S); ctx.restore(); } ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.moveTo(S[0][0], S[0][1]); ctx.lineTo((S[0][0] + S[1][0]) / 2, (S[0][1] + S[1][1]) / 2); ctx.lineTo((S[0][0] + S[3][0]) / 2, (S[0][1] + S[3][1]) / 2); ctx.closePath(); ctx.fill(); return; }
   if (n === 'tarjeta') { const tp = G.F[0].pts[3], th = G.T.pts[3], c = [(tp[0] + th[0]) / 2, (tp[1] + th[1]) / 2 + 22, (tp[2] + th[2]) / 2]; const Q = quadR(pr, c, [1, 0, 0], [0, 1, 0], ob.w, ob.h); ctx.fillStyle = o.colObjeto || '#f4f4f2'; poly(ctx, Q); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = ow; ctx.stroke(); ctx.fillStyle = '#d8b04a'; const Q2 = quadR(pr, [c[0] - 14, c[1], c[2] - 0.2], [1, 0, 0], [0, 1, 0], 14, 11); poly(ctx, Q2); ctx.fill(); return; }
   const C = pr((n === 'moneda' || n === 'grano') ? [(G.F[0].pts[3][0] + G.T.pts[3][0]) / 2, (G.F[0].pts[3][1] + G.T.pts[3][1]) / 2 + 2, (G.F[0].pts[3][2] + G.T.pts[3][2]) / 2] : ob.c), r = (ob.r || 10) * C[3];
   if (n === 'moneda') { const g = ctx.createLinearGradient(C[0] - r, C[1] - r, C[0] + r, C[1] + r); g.addColorStop(0, '#ffe08a'); g.addColorStop(1, '#c08a2a'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(C[0], C[1], r, r * 0.85, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#9a6a1a'; ctx.lineWidth = ow; ctx.stroke(); ctx.beginPath(); ctx.ellipse(C[0], C[1], r * 0.72, r * 0.6, 0, 0, Math.PI * 2); ctx.stroke(); return; }
   if (n === 'grano') { ctx.fillStyle = '#f2ead6'; ctx.beginPath(); ctx.ellipse(C[0], C[1], r * 1.1, r * 0.8, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#b9a77a'; ctx.lineWidth = ow; ctx.stroke(); return; }
   if (n === 'bola') { const g = ctx.createRadialGradient(C[0] - r * 0.4, C[1] - r * 0.4, r * 0.1, C[0], C[1], r); g.addColorStop(0, '#ff9a8a'); g.addColorStop(1, '#c0392b'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(C[0], C[1], r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#7a1a12'; ctx.lineWidth = ow; ctx.stroke(); return; }
   if (n === 'boton') { const Q = quadR(pr, [ob.c[0], ob.c[1] + 8, ob.c[2] - 6], [1, 0, 0], [0, 0, 1], ob.r * 3.2, ob.r * 2.2); ctx.fillStyle = '#9aa3b2'; poly(ctx, Q); ctx.fill(); ctx.fillStyle = '#e8463c'; ctx.beginPath(); ctx.ellipse(C[0], C[1] + r * 0.2, r, r * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#7a1a12'; ctx.lineWidth = ow; ctx.stroke(); return; }
   if (n === 'perilla') { const g = ctx.createRadialGradient(C[0] - r * 0.3, C[1] - r * 0.3, r * 0.1, C[0], C[1], r); g.addColorStop(0, '#d8dce4'); g.addColorStop(1, '#6b7280'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(C[0], C[1], r, r * 0.95, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#3a3f48'; ctx.lineWidth = ow; ctx.stroke(); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 18; i++) { const a = i * Math.PI / 9 + t; ctx.beginPath(); ctx.moveTo(C[0] + Math.cos(a) * r * 0.85, C[1] + Math.sin(a) * r * 0.8); ctx.lineTo(C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r * 0.95); ctx.stroke(); } return; }
   if (n === 'llave') { const tp = G.F[0].pts[3], th = G.T.pts[3], c = [(tp[0] + th[0]) / 2, (tp[1] + th[1]) / 2, (tp[2] + th[2]) / 2], h0 = pr([c[0], c[1] - 6, c[2]]), h1 = pr([c[0], c[1] + 52, c[2]]); ctx.fillStyle = '#c9a54a'; ctx.beginPath(); ctx.arc(h0[0], h0[1], 16 * h0[3], 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#8a6a1a'; ctx.lineWidth = ow; ctx.stroke(); ctx.lineWidth = 9 * h0[3]; ctx.strokeStyle = '#c9a54a'; ctx.beginPath(); ctx.moveTo(h0[0], h0[1]); ctx.lineTo(h1[0], h1[1]); ctx.stroke(); return; }
  };
  const manubrioR = (ctx, pr, ow, t, o) => { const a = pr([-80, 60, -26]), b = pr([110, 60, -26]), r = 20 * a[3]; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * r, ny = dx / l * r; const g = ctx.createLinearGradient(a[0] + nx, a[1] + ny, a[0] - nx, a[1] - ny); g.addColorStop(0, '#4a4d56'); g.addColorStop(0.5, '#1f2026'); g.addColorStop(1, '#0e0f12'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(a[0] + nx, a[1] + ny); ctx.lineTo(b[0] + nx, b[1] + ny); ctx.lineTo(b[0] - nx, b[1] - ny); ctx.lineTo(a[0] - nx, a[1] - ny); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = ow; const ph = (o.gas || 0) * 12; for (let i = 0; i < 16; i++) { const u = ((i * 12 + ph) % 190) / 190; const px = a[0] + dx * u, py = a[1] + dy * u; ctx.beginPath(); ctx.moveTo(px + nx * 0.9, py + ny * 0.9); ctx.lineTo(px - nx * 0.9, py - ny * 0.9); ctx.stroke(); } ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.moveTo(b[0] + nx * 0.6, b[1] + ny * 0.6); ctx.lineTo(b[0] + dx / l * 60 + nx * 0.6, b[1] + dy / l * 60 + ny * 0.6); ctx.lineTo(b[0] + dx / l * 60 - nx * 0.6, b[1] + dy / l * 60 - ny * 0.6); ctx.lineTo(b[0] - nx * 0.6, b[1] - ny * 0.6); ctx.closePath(); ctx.fill(); };
  const salR = (ctx, pr, G, t) => { const tp = G.F[1].pts[3], th = G.T.pts[3], c = pr([(tp[0] + th[0]) / 2, (tp[1] + th[1]) / 2, (tp[2] + th[2]) / 2]); for (let i = 0; i < 16; i++) { const ph = ((t * 1.2 + i / 16) % 1), sx = c[0] + (((i * 37) % 11) - 5) * 1.6 + ph * 6 * Math.sin(i), sy = c[1] + ph * 120 + 4; ctx.globalAlpha = 1 - ph * 0.7; ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#b9c0c9'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.rect(sx - 2, sy - 2, 4, 4); ctx.fill(); ctx.stroke(); } ctx.globalAlpha = 1; };
  P.MANO_POSES = Object.keys(MP).concat(['saludo']);
 }
