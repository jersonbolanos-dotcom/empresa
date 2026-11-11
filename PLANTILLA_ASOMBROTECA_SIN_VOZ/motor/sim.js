// =====================================================================================================
// SIM · simulaciones físicas PRECALCULADAS y deterministas (Plantilla Asombroteca SIN_VOZ v2.0)
// ------------------------------------------------------------------------------------------------------
// Cada simulación corre UNA vez al cargar (paso fijo, H.rng con semilla, nunca Math.random) y guarda el estado de cada
// fotograma + una lista de EVENTOS (choques, nacimientos, caídas…). Después, dibujar(t) solo LEE el fotograma ⇒ seek(t)
// sigue siendo función pura de t (render en paralelo, determinismo). Los eventos alimentan el sonido (R.asmr).
// Funciona también en Node (para ajustar parámetros): node -e "…" cargando lib/harness.js con un window simulado.
//   SIM.rebote({...})  bolas que se dividen al tocar el borde de un círculo (crecimiento exponencial)
//   SIM.galton({...})  tablero de Galton: miles de bolitas que chocan con clavos y se apilan en casillas
//   SIM.fourier({...}) epiciclos de Fourier que dibujan una silueta (DFT de un trazo cerrado)
// =====================================================================================================
(function (root) {
 const H = root.H, TAU = Math.PI * 2;
 const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
 const SIM = {};

 // ---------------- utilidades ----------------
 // Rejilla espacial para choques entre bolas (celdas de lado `cell`)
 SIM.grid = (cell, W, Hh) => { const nx = Math.ceil(W / cell) + 2, ny = Math.ceil(Hh / cell) + 2, head = new Int32Array(nx * ny), next = new Int32Array(1 << 16);
  return { nx, ny, cell, head, next, clear() { head.fill(-1); }, key(x, y) { return (Math.floor(y / cell) + 1) * nx + Math.floor(x / cell) + 1; },
   add(i, x, y) { if (i >= next.length) { const n2 = new Int32Array(next.length * 2); n2.set(next); this.next = n2; } const k = this.key(x, y); this.next[i] = head[k]; head[k] = i; } }; };
 // Remuestrea un trazo cerrado [[x,y]…] por longitud de arco con Catmull-Rom (curva suave que pasa por los puntos)
 SIM.resample = (pts, N) => { const n = pts.length, P = (i) => pts[((i % n) + n) % n], dense = [];
  for (let i = 0; i < n; i++) { const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2); for (let s = 0; s < 16; s++) { const u = s / 16, u2 = u * u, u3 = u2 * u;
   dense.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * u + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3), 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3)]); } }
  const L = [0]; for (let i = 1; i <= dense.length; i++) { const a = dense[i - 1], b = dense[i % dense.length]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const out = [], tot = L[L.length - 1]; let j = 0; for (let k = 0; k < N; k++) { const s = tot * k / N; while (L[j + 1] < s) j++; const a = dense[j], b = dense[(j + 1) % dense.length], u = (s - L[j]) / Math.max(1e-9, L[j + 1] - L[j]); out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]); }
  return out; };

 // =====================================================================================================
 // 1 · REBOTE: bolas que se dividen al tocar el borde (como bacterias que se dividen)
 // cfg = { dur, fps (30), sub (8 pasos por fotograma), cx, cy, R (radio del círculo), r (radio mínimo de bola), r0 (radio de la bola inicial;
 //   cada división lo divide por √2), v0 (px/s), tDiv (edad mínima para dividirse, s), age0 (edad inicial), nMax, seed, x0, y0, ang0,
 //   inicio (true: arranca tocando el borde con un evento 'inicio' en t = 0), tColapso (s antes del final sin más divisiones) }
 // → { n(f), x(f,i), y(f,i), radio(f,i), genF(f,i) (generación en el fotograma f), gen[i], born[i], madre[i], tLleno, eventos: [{ t, tipo: 'inicio'|'borde'|'choque'|'nace'|'lleno', v, n, ang }] }
 // =====================================================================================================
 SIM.rebote = (cfg) => { const fps = cfg.fps || 30, sub = cfg.sub || 8, dt = 1 / (fps * sub), NF = Math.round(cfg.dur * fps), R = cfg.R, rMin = cfg.r, cx = cfg.cx, cy = cfg.cy, nMax = cfg.nMax;
  // radio de cada bola según su generación: al dividirse, el área se reparte entre las dos hijas (radio / √2), hasta rMin
  const r0 = cfg.r0 ?? rMin, rad = (g) => Math.max(rMin, r0 * Math.pow(2, -g / 2));
  const rng = H.rng(cfg.seed ?? 1), x = new Float64Array(nMax), y = new Float64Array(nMax), vx = new Float64Array(nMax), vy = new Float64Array(nMax), age = new Float64Array(nMax), gen = new Uint16Array(nMax), born = new Float32Array(nMax), rr = new Float64Array(nMax), madre = new Int32Array(nMax).fill(-1);
  const genF = []; // generación de cada bola en cada fotograma (para el radio): se guarda como Uint8 por fotograma
  let n = 1; x[0] = cfg.x0 ?? cx; y[0] = cfg.y0 ?? cy - R * 0.35; const a0 = cfg.ang0 ?? 0.9; vx[0] = Math.cos(a0) * cfg.v0; vy[0] = Math.sin(a0) * cfg.v0; age[0] = cfg.age0 ?? 0; born[0] = -10; rr[0] = rad(0);
  if (cfg.inicio) { const d = Math.hypot(x[0] - cx, y[0] - cy) || 1; x[0] = cx + (x[0] - cx) / d * (R - rr[0]); y[0] = cy + (y[0] - cy) / d * (R - rr[0]); }   // arranca tocando el borde
  const ev = cfg.inicio ? [{ t: 0, tipo: 'inicio', v: cfg.v0, ang: Math.atan2(y[0] - cy, x[0] - cx), n: 1 }] : [], off = new Int32Array(NF + 1), pos = []; let tLleno = null, total = 0, g = null, gCell = 0;
  const tStop = cfg.dur - (cfg.tColapso ?? 1.2);
  for (let f = 0; f < NF; f++) {
   off[f] = total; const gf = new Uint8Array(n); for (let i = 0; i < n; i++) { pos.push(x[i], y[i]); gf[i] = Math.min(255, gen[i]); } genF.push(gf); total += 2 * n;   // estado del fotograma f
   for (let s = 0; s < sub; s++) { const t = (f * sub + s) * dt;
    for (let i = 0; i < n; i++) { x[i] += vx[i] * dt; y[i] += vy[i] * dt; age[i] += dt; }
    // borde del círculo: rebote especular y, si la bola ya «maduró», división en dos hijas
    const nNow = n; for (let i = 0; i < nNow; i++) { const lim = R - rr[i], dx = x[i] - cx, dy = y[i] - cy, d = Math.hypot(dx, dy); if (d <= lim) continue;
     const nx = dx / d, ny = dy / d, vn = vx[i] * nx + vy[i] * ny; x[i] = cx + nx * lim; y[i] = cy + ny * lim; if (vn <= 0) continue;
     vx[i] -= 2 * vn * nx; vy[i] -= 2 * vn * ny; ev.push({ t, tipo: 'borde', v: vn, ang: Math.atan2(ny, nx), n, r: rr[i] });
     if (age[i] >= cfg.tDiv && n < nMax && t < tStop) { const j = n++, tx = -ny, ty = nx, sp = Math.hypot(vx[i], vy[i]), rot = (rng() - 0.5) * 1.4;
      gen[i]++; gen[j] = gen[i]; rr[i] = rr[j] = rad(gen[i]);
      x[j] = x[i] + tx * rr[i] * 2.05; y[j] = y[i] + ty * rr[i] * 2.05; const lj = R - rr[j], dj = Math.hypot(x[j] - cx, y[j] - cy); if (dj > lj) { x[j] = cx + (x[j] - cx) / dj * lj; y[j] = cy + (y[j] - cy) / dj * lj; }
      const ang = Math.atan2(vy[i], vx[i]) + rot; vx[j] = Math.cos(ang) * sp; vy[j] = Math.sin(ang) * sp; age[i] = 0; age[j] = 0; born[j] = t; madre[j] = i;
      ev.push({ t, tipo: 'nace', n, v: sp }); if (n === nMax && tLleno == null) { tLleno = t; ev.push({ t, tipo: 'lleno', n }); } } }
    // choques entre bolas (elásticos, masa ∝ área), con rejilla espacial de celda = diámetro mayor
    let rM = 0; for (let i = 0; i < n; i++) if (rr[i] > rM) rM = rr[i]; if (!g || Math.abs(2 * rM - gCell) > 0.5) { gCell = 2 * rM; g = SIM.grid(gCell, 1080, 1920); }
    g.clear(); for (let i = 0; i < n; i++) g.add(i, x[i], y[i]);
    for (let i = 0; i < n; i++) { const gx = Math.floor(x[i] / g.cell) + 1, gy = Math.floor(y[i] / g.cell) + 1;
     for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) { let j = g.head[(gy + oy) * g.nx + gx + ox]; while (j >= 0) { if (j > i) { const dx = x[j] - x[i], dy = y[j] - y[i], d2 = dx * dx + dy * dy, sr = rr[i] + rr[j];
       if (d2 < sr * sr && d2 > 1e-9) { const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, mi = rr[i] * rr[i], mj = rr[j] * rr[j], ov = sr - d; x[i] -= nx * ov * mj / (mi + mj); y[i] -= ny * ov * mj / (mi + mj); x[j] += nx * ov * mi / (mi + mj); y[j] += ny * ov * mi / (mi + mj);
        const rv = (vx[j] - vx[i]) * nx + (vy[j] - vy[i]) * ny; if (rv < 0) { const k = 2 * rv / (mi + mj); vx[i] += k * mj * nx; vy[i] += k * mj * ny; vx[j] -= k * mi * nx; vy[j] -= k * mi * ny; if (-rv > (cfg.vChoque ?? 120)) ev.push({ t, tipo: 'choque', v: -rv, n }); } } } j = g.next[j]; } } }
   }
  }
  off[NF] = total; const P = Float32Array.from(pos);
  const nAt = (f) => (off[cl(f + 1, 0, NF)] - off[cl(f, 0, NF - 1)]) / 2;
  return { NF, fps, R, r: rMin, r0, rad, cx, cy, gen, born, madre, tLleno, eventos: ev, nMax, genF: (f, i) => genF[cl(f, 0, NF - 1)][i] ?? 0,
   n: (f) => nAt(cl(f, 0, NF - 1)), x: (f, i) => P[off[cl(f, 0, NF - 1)] + 2 * i], y: (f, i) => P[off[cl(f, 0, NF - 1)] + 2 * i + 1], radio: (f, i) => rad(genF[cl(f, 0, NF - 1)][i] ?? 0) };
 };

 // =====================================================================================================
 // 2 · GALTON: bolitas que caen por una red triangular de clavos (choques reales con gravedad y rebote) y se apilan en casillas
 // cfg = { dur, fps, sub, x0 (centro), yPeg0 (primera fila), filas, dx, dy, pegR, r, nBolas, tIni, tFin (última salida del grueso),
 //   pre (s de precarga antes del fotograma 0), tUltima (salida de la última bola, que cae sola), xUltima (desvío inicial de la última), yFondo (fondo de las casillas), g, e (restitución), fric (velocidad lateral que queda
 //   tras un choque), drag (rozamiento lateral con el aire, 1/s), vMax (velocidad de caída máxima), seed }
 // → { NF, activas(f) → [x,y,id,…], cuenta(f) → bolas ya apiladas, pila(k) → posiciones de la casilla k, casilla[id], orden[id],
 //   llegada[id] (t), slot(k, s) → [x, y], eventos: [{ t, tipo: 'clavo' {fila, col, v, id, lado ±1}|'casilla' {k, capa, v} }] }
 // =====================================================================================================
 SIM.galton = (cfg) => { const fps = cfg.fps || 30, sub = cfg.sub || 8, dt = 1 / (fps * sub), NF = Math.round(cfg.dur * fps);
  const rows = cfg.filas, dx = cfg.dx, dy = cfg.dy, x0 = cfg.x0, y0 = cfg.yPeg0, pegR = cfg.pegR, r = cfg.r, G = cfg.g ?? 1400, e = cfg.e ?? 0.42, nB = cfg.nBolas, rng = H.rng(cfg.seed ?? 3);
  const nBins = rows + 1, halfW = nBins * dx / 2, binL = x0 - halfW, yLast = y0 + (rows - 1) * dy, yBin = yLast + dy * 0.9, yF = cfg.yFondo;
  const per = Math.max(1, Math.floor(dx / (2 * r * 1.04))), sx = dx / per, sy = 2 * r * 0.9;
  const slot = (k, s) => { const L = Math.floor(s / per), q = s % per; return [binL + k * dx + sx * (q + 0.5) + (L % 2 ? sx * 0.25 : -sx * 0.25) * (per > 1 ? 1 : 0), yF - r - L * sy]; };
  // horario de salida: el grueso entre tIni y tFin (ritmo que acelera un poco) y la ÚLTIMA bola sola en tUltima
  const sal = new Float64Array(nB); for (let i = 0; i < nB - 1; i++) { const u = i / (nB - 2); sal[i] = cfg.tIni + (cfg.tFin - cfg.tIni) * Math.pow(u, 0.85); } sal[nB - 1] = cfg.tUltima;
  const bx = new Float64Array(nB), by = new Float64Array(nB), bvx = new Float64Array(nB), bvy = new Float64Array(nB), est = new Uint8Array(nB), casilla = new Int16Array(nB).fill(-1), sl = new Int32Array(nB), lleg = new Float64Array(nB).fill(1e9);
  const reserva = new Int32Array(nBins), ev = [], act = []; let lanz = 0;
  const wallL = [[x0 - dx * 0.75, y0 - dy * 1.2], [binL - 2, yBin]], wallR = [[x0 + dx * 0.75, y0 - dy * 1.2], [x0 + halfW + 2, yBin]];
  const segHit = (i, A, B) => { const ux = B[0] - A[0], uy = B[1] - A[1], L2 = ux * ux + uy * uy, u = cl(((bx[i] - A[0]) * ux + (by[i] - A[1]) * uy) / L2), px = A[0] + ux * u, py = A[1] + uy * u, ddx = bx[i] - px, ddy = by[i] - py, d = Math.hypot(ddx, ddy);
   if (d < r && d > 1e-9) { const nx = ddx / d, ny = ddy / d; bx[i] = px + nx * r; by[i] = py + ny * r; const vn = bvx[i] * nx + bvy[i] * ny; if (vn < 0) { bvx[i] -= (1 + e) * vn * nx; bvy[i] -= (1 + e) * vn * ny; } } };
  const frames = [], cuentaF = new Int32Array(NF), PF = Math.round((cfg.pre ?? 0) * fps); let asent = 0;
  for (let f = -PF; f < NF; f++) {
   // fotograma f: bolas en vuelo o cayendo dentro de su casilla (con «pre» s de precarga: en el fotograma 0 ya hay bolas cayendo)
   if (f >= 0) { const fr = []; for (const i of act) fr.push(bx[i], by[i], i); frames.push(Float32Array.from(fr)); cuentaF[f] = asent; }
   for (let s = 0; s < sub; s++) { const t = (f * sub + s) * dt;
    while (lanz < nB && sal[lanz] <= t) { const i = lanz++; bx[i] = x0 + (rng() - 0.5) * 3.0 + (i === nB - 1 ? (cfg.xUltima ?? 0) : 0); by[i] = y0 - dy * 1.6; bvx[i] = (rng() - 0.5) * 30; bvy[i] = 60 + rng() * 20; est[i] = 1; act.push(i); }
    for (let a = act.length - 1; a >= 0; a--) { const i = act[a];
     bvy[i] += G * dt; if (est[i] === 1) { bvx[i] *= Math.exp(-(cfg.drag ?? 0) * dt); if (bvy[i] > (cfg.vMax ?? 1e9)) bvy[i] = cfg.vMax; } bx[i] += bvx[i] * dt; by[i] += bvy[i] * dt;
     if (est[i] === 1) {
      // clavos cercanos (fila y columnas vecinas)
      const ri = Math.round((by[i] - y0) / dy); for (let rr = ri - 1; rr <= ri + 1; rr++) { if (rr < 0 || rr >= rows) continue; const py = y0 + rr * dy, cj = Math.round((bx[i] - x0) / dx + rr / 2);
       for (let j = cj - 1; j <= cj + 1; j++) { if (j < 0 || j > rr) continue; const px = x0 + (j - rr / 2) * dx, ddx = bx[i] - px, ddy = by[i] - py, d = Math.hypot(ddx, ddy);
        if (d < pegR + r && d > 1e-9) { const nx = ddx / d, ny = ddy / d; bx[i] = px + nx * (pegR + r); by[i] = py + ny * (pegR + r); const vn = bvx[i] * nx + bvy[i] * ny;
         if (vn < 0) { bvx[i] -= (1 + e) * vn * nx; bvy[i] -= (1 + e) * vn * ny; bvx[i] *= (cfg.fric ?? 0.96); if (-vn > 40 && t >= 0) ev.push({ t, tipo: 'clavo', fila: rr, col: j, v: -vn, id: i, lado: Math.sign(ddx) || 1 }); } } } }
      segHit(i, wallL[0], wallL[1]); segHit(i, wallR[0], wallR[1]);
      if (by[i] >= yBin) { const k = cl(Math.floor((bx[i] - binL) / dx), 0, nBins - 1); casilla[i] = k; sl[i] = reserva[k]++; est[i] = 2; bvx[i] *= 0.3; }
     } else if (est[i] === 2) { const [tx, ty] = slot(casilla[i], sl[i]); bx[i] += (tx - bx[i]) * Math.min(1, dt * 14); bvx[i] = 0;
      if (by[i] >= ty) { by[i] = ty; bx[i] = tx; est[i] = 3; lleg[i] = t; asent++; act.splice(a, 1); if (t >= 0) ev.push({ t, tipo: 'casilla', k: casilla[i], v: Math.min(1, bvy[i] / 900), capa: Math.floor(sl[i] / per) }); } }
    }
   }
  }
  const pilas = Array.from({ length: nBins }, () => []); for (let i = 0; i < nB; i++) if (est[i] === 3) pilas[casilla[i]].push(i);
  return { NF, fps, x0, y0, rows, dx, dy, pegR, r, nBins, binL, yBin, yF, per, slot, casilla, sl, llegada: lleg, sal, nB, eventos: ev, pilas, ultima: nB - 1,
   activas: (f) => frames[cl(f, 0, NF - 1)], cuenta: (f) => cuentaF[cl(f, 0, NF - 1)] };
 };

 // =====================================================================================================
 // 3 · FOURIER: epiciclos que dibujan un trazo cerrado
 // cfg = { trazo: [[x,y]…] (cerrado, en el orden en que se dibuja), N (muestras, 2048), K (términos guardados, 600), muestras (ya remuestreadas:
 //   p. ej. [[x, 0]…] para la DFT de una señal real; así se hacen dos cadenas, una para x(t) y otra para y(t)) }
 // → { coef: [{ k, re, im, r }] ordenados de mayor a menor radio (sin el término 0), c0, punto(n, tau) → [x, y], cadena(n, tau) → [[x,y]…] }
 // =====================================================================================================
 SIM.fourier = (cfg) => { const N = cfg.N || (cfg.muestras ? cfg.muestras.length : 2048), pts = cfg.muestras || SIM.resample(cfg.trazo, N), K = cfg.K || 600;
  const coef = []; let c0 = [0, 0];
  for (let k = -K; k <= K; k++) { let re = 0, im = 0; for (let n = 0; n < N; n++) { const a = -TAU * k * n / N, c = Math.cos(a), s = Math.sin(a); re += pts[n][0] * c - pts[n][1] * s; im += pts[n][0] * s + pts[n][1] * c; } re /= N; im /= N; if (k === 0) c0 = [re, im]; else coef.push({ k, re, im, r: Math.hypot(re, im) }); }
  coef.sort((a, b) => b.r - a.r);
  const cadena = (n, tau) => { let x = c0[0], y = c0[1]; const out = [[x, y]]; for (let j = 0; j < n; j++) { const c = coef[j], a = TAU * c.k * tau, ca = Math.cos(a), sa = Math.sin(a); x += c.re * ca - c.im * sa; y += c.re * sa + c.im * ca; out.push([x, y]); } return out; };
  const punto = (n, tau) => { let x = c0[0], y = c0[1]; for (let j = 0; j < n; j++) { const c = coef[j], a = TAU * c.k * tau; x += c.re * Math.cos(a) - c.im * Math.sin(a); y += c.re * Math.sin(a) + c.im * Math.cos(a); } return [x, y]; };
  return { coef, c0, punto, cadena, muestras: pts };
 };

 // =====================================================================================================
 // 4 · INCENDIO (v2.2): bosque en cuadrícula; el fuego pasa de un árbol a sus 4 vecinos con un retraso al azar (percolación de sitios).
 // cfg = { cols, rows, densidad(c, r) → probabilidad de árbol, corte(c, r) → true si el árbol se cortó (cortafuegos), focos: [[c, r]…],
 //   dMin, dMax (retraso de contagio, s), arde (s que arde un árbol), seed }
 // → { cols, rows, arbol (Uint8: 0 vacío, 1 árbol, 2 tocón), tIgn (Float64, Infinity si no arde), orden (índices por tiempo), tFin, escala(k) }
 // =====================================================================================================
 SIM.incendio = (cfg) => { const C = cfg.cols, Rw = cfg.rows, N = C * Rw, rng = H.rng(cfg.seed ?? 5), arbol = new Uint8Array(N), tIgn = new Float64Array(N).fill(Infinity);
  for (let r = 0; r < Rw; r++) for (let c = 0; c < C; c++) { const i = r * C + c; if (rng() < cfg.densidad(c, r)) arbol[i] = cfg.corte && cfg.corte(c, r, rng) ? 2 : 1; }
  const del = new Float32Array(N * 4); for (let i = 0; i < N * 4; i++) del[i] = (cfg.dMin ?? 0.1) + rng() * ((cfg.dMax ?? 0.3) - (cfg.dMin ?? 0.1));
  // Dijkstra con montículo binario: el primer árbol vecino que arde enciende al siguiente
  const heap = [], push = (t, i) => { heap.push([t, i]); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; k = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const a = 2 * k + 1, b = a + 1; let m = k; if (a < heap.length && heap[a][0] < heap[m][0]) m = a; if (b < heap.length && heap[b][0] < heap[m][0]) m = b; if (m === k) break; [heap[m], heap[k]] = [heap[k], heap[m]]; k = m; } } return top; };
  for (const [c, r] of cfg.focos) { const i = r * C + c; if (arbol[i] === 1) { tIgn[i] = 0; push(0, i); } }
  const orden = [];
  while (heap.length) { const [t, i] = pop(); if (t > tIgn[i]) continue; orden.push(i); const c = i % C, r = (i / C) | 0;
   const vec = [c > 0 ? i - 1 : -1, c < C - 1 ? i + 1 : -1, r > 0 ? i - C : -1, r < Rw - 1 ? i + C : -1];
   for (let d = 0; d < 4; d++) { const j = vec[d]; if (j < 0 || arbol[j] !== 1) continue; const tj = t + del[i * 4 + d]; if (tj < tIgn[j]) { tIgn[j] = tj; push(tj, j); } } }
  const tFin = orden.length ? tIgn[orden[orden.length - 1]] : 0;
  // escala(k): multiplica todos los tiempos (Dijkstra es lineal en los retrasos: el orden no cambia)
  const escala = (k) => { for (const i of orden) tIgn[i] *= k; return tIgn[orden[orden.length - 1]]; };
  return { cols: C, rows: Rw, arbol, tIgn, orden, tFin, escala, arde: cfg.arde ?? 1.2 };
 };

 // =====================================================================================================
 // 5 · MONTECARLO (v2.2): puntos al azar en el cuadrado [-1, 1]²; los que caen dentro del círculo unidad cuentan para estimar π ≈ 4·dentro/total
 // cfg = { n, seed } → { x, y (Float32), dentro (Uint8), acum (Int32: dentro acumulado), pi(k) → estimación con los k primeros }
 // =====================================================================================================
 SIM.montecarlo = (cfg) => { const n = cfg.n, rng = H.rng(cfg.seed ?? 1), x = new Float32Array(n), y = new Float32Array(n), dentro = new Uint8Array(n), acum = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) { x[i] = rng() * 2 - 1; y[i] = rng() * 2 - 1; dentro[i] = x[i] * x[i] + y[i] * y[i] <= 1 ? 1 : 0; acum[i + 1] = acum[i] + dentro[i]; }
  return { n, x, y, dentro, acum, pi: (k) => (k > 0 ? 4 * acum[Math.min(k, n)] / Math.min(k, n) : 0) };
 };

 // =====================================================================================================
 // 6 · PÉNDULOS (v2.2): onda de péndulos (Berg 1991). En `gamma` s, el péndulo n completa K + n oscilaciones ⇒ T_n = gamma / (K + n),
 // L_n = g·(T_n / 2π)². Aproximación de ángulo pequeño: θ_n(t) = θ0·cos(2π t / T_n) (todos sueltos a la vez desde θ0).
 // cfg = { n (15), gamma (s), K, g (9,81), theta0 (rad) } → { T[], L[], theta(n, t), cruces: [{ t, n }] (pasos por la vertical hasta gamma + extra) }
 // =====================================================================================================
 SIM.pendulos = (cfg) => { const n = cfg.n ?? 15, G = cfg.gamma, K = cfg.K, g = cfg.g ?? 9.81, th0 = cfg.theta0 ?? 0.25, T = [], L = [], cruces = [];
  for (let k = 0; k < n; k++) { T.push(G / (K + k)); L.push(g * Math.pow(T[k] / TAU, 2)); }
  const hasta = G + (cfg.extra ?? 5);
  for (let k = 0; k < n; k++) for (let q = 0; ; q++) { const t = T[k] / 4 + q * T[k] / 2; if (t > hasta) break; cruces.push({ t, n: k, sentido: q % 2 ? 1 : -1 }); }
  cruces.sort((a, b) => a.t - b.t);
  return { n, T, L, gamma: G, K, theta: (k, t) => th0 * Math.cos(TAU * t / T[k]), oscilaciones: (k, t) => Math.floor(t / T[k] + 1e-9), cruces };
 };

 // =====================================================================================================
 // 7 · HORMIGA DE LANGTON (v2.3): en casilla vacía gira 90° a la derecha, en casilla llena a la izquierda; invierte la casilla y avanza.
 // Sin azar. cfg = { pasos, W (lado de la rejilla, 512) } → { N, px, py (posición ANTES del paso k; px[N] = final), dir[k],
 //   celda[k] (casilla invertida en el paso k), celdas (lista de casillas tocadas), estado(i, K) (0/1 tras K pasos), primero[i],
 //   caja(K) → [x0, y0, x1, y1] (rectángulo de casillas tocadas hasta K), autopista (paso desde el que el movimiento es periódico, 104 pasos) }
 // =====================================================================================================
 SIM.hormiga = (cfg) => { const N = cfg.pasos, W = cfg.W || 512, g = new Uint8Array(W * W), px = new Int16Array(N + 1), py = new Int16Array(N + 1), dir = new Uint8Array(N + 1), celda = new Int32Array(N);
  let x = W >> 1, y = W >> 1, d = 0; const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
  const bx0 = new Int16Array(N + 1), by0 = new Int16Array(N + 1), bx1 = new Int16Array(N + 1), by1 = new Int16Array(N + 1); let a0 = x, b0 = y, a1 = x, b1 = y;
  for (let k = 0; k < N; k++) { px[k] = x; py[k] = y; dir[k] = d; bx0[k] = a0; by0[k] = b0; bx1[k] = a1; by1[k] = b1; const i = y * W + x;
   d = g[i] ? (d + 3) & 3 : (d + 1) & 3; g[i] ^= 1; celda[k] = i; x += DX[d]; y += DY[d];
   if (x < 1 || y < 1 || x >= W - 1 || y >= W - 1) throw new Error('SIM.hormiga: la rejilla es pequeña');
   a0 = Math.min(a0, x); b0 = Math.min(b0, y); a1 = Math.max(a1, x); b1 = Math.max(b1, y); }
  px[N] = x; py[N] = y; dir[N] = d; bx0[N] = a0; by0[N] = b0; bx1[N] = a1; by1[N] = b1;
  // inversiones por casilla (CSR): el estado tras K pasos es la paridad de las inversiones con paso < K
  const cnt = new Map(); for (let k = 0; k < N; k++) cnt.set(celda[k], (cnt.get(celda[k]) || 0) + 1);
  const celdas = [...cnt.keys()], idx = new Map(celdas.map((c, j) => [c, j])), off = new Int32Array(celdas.length + 1); celdas.forEach((c, j) => { off[j + 1] = off[j] + cnt.get(c); });
  const lst = new Int32Array(N), fill = off.slice(0, -1); for (let k = 0; k < N; k++) { const j = idx.get(celda[k]); lst[fill[j]++] = k; }
  const estado = (j, K) => { let lo = off[j], hi = off[j + 1]; while (lo < hi) { const m = (lo + hi) >> 1; if (lst[m] < K) lo = m + 1; else hi = m; } return (lo - off[j]) & 1; };
  const primero = (j) => lst[off[j]], ultimo = (j, K) => { let lo = off[j], hi = off[j + 1]; while (lo < hi) { const m = (lo + hi) >> 1; if (lst[m] < K) lo = m + 1; else hi = m; } return lo > off[j] ? lst[lo - 1] : -1; };
  // autopista: desde qué paso el desplazamiento cada 104 pasos es siempre el mismo
  let autopista = -1; if (N > 400) { const P = 104, ex = px[N] - px[N - P], ey = py[N] - py[N - P]; let s = N - P; while (s > 0 && px[s - 1 + P] - px[s - 1] === ex && py[s - 1 + P] - py[s - 1] === ey) s--; if (s < N - 3 * P) autopista = s; }
  const K_ = (K) => Math.max(0, Math.min(N, K | 0));
  return { N, W, px, py, dir, celda, celdas, estado, primero, ultimo, autopista, caja: (K) => { K = K_(K); return [bx0[K], by0[K], bx1[K], by1[K]]; } };
 };

 // =====================================================================================================
 // 8 · AGREGACIÓN LIMITADA POR DIFUSIÓN, DLA (v2.3; Witten y Sander 1981): partículas que caminan al azar por una rejilla fina y se pegan
 // al tocar el cúmulo (4 vecinos). Lanzamiento en un círculo justo fuera del cúmulo, saltos largos lejos de él y se relanzan si se alejan.
 // cfg = { n, G (lado de la rejilla, 801), seed, r0 (radio de lanzamiento de la primera, para verla caminar), cola (pasos guardados) }
 // → { n, x, y (relativas al núcleo), r (distancia), rMax[i] (radio del cúmulo con i pegadas), camino0 ([x, y…] de la primera), cola[i] }
 // =====================================================================================================
 SIM.dla = (cfg) => { const n = cfg.n, G = cfg.G || 801, C = G >> 1, rng = H.rng(cfg.seed ?? 1), occ = new Uint8Array(G * G), CO = cfg.cola ?? 24;
  const x = new Int16Array(n), y = new Int16Array(n), r = new Float32Array(n), rMax = new Float32Array(n + 1), colas = []; occ[C * G + C] = 1; let RM = 1, camino0 = [];
  const vecino = (a, b) => occ[(b + C) * G + a + C + 1] || occ[(b + C) * G + a + C - 1] || occ[(b + C + 1) * G + a + C] || occ[(b + C - 1) * G + a + C];
  for (let i = 0; i < n; i++) { rMax[i] = RM; let hecho = false, tray;
   while (!hecho) { const rl = i === 0 && cfg.r0 ? cfg.r0 : RM + 6, an = rng() * Math.PI * 2; let a = Math.round(rl * Math.cos(an)), b = Math.round(rl * Math.sin(an)); tray = [a, b]; const rk = Math.max(RM * 2 + 20, rl + 40);
    for (let paso = 0; paso < 2e6; paso++) { const dd = Math.hypot(a, b);
     if (dd > rk || Math.abs(a) > C - 3 || Math.abs(b) > C - 3) break;                                   // se alejó: se relanza
     if (dd > RM + 6 && !(i === 0 && cfg.r0)) { const L = dd - RM - 4, t2 = rng() * Math.PI * 2; a = Math.round(a + L * Math.cos(t2)); b = Math.round(b + L * Math.sin(t2)); }   // salto largo (no puede tocar el cúmulo)
     else { const q = (rng() * 4) | 0; if (q === 0) a++; else if (q === 1) a--; else if (q === 2) b++; else b--; }
     if (occ[(b + C) * G + a + C]) continue;
     tray.push(a, b); if (i > 0 && tray.length > CO * 2 + 40) tray.splice(0, tray.length - CO * 2);
     if (Math.hypot(a, b) <= RM + 2 && vecino(a, b)) { occ[(b + C) * G + a + C] = 1; x[i] = a; y[i] = b; r[i] = Math.hypot(a, b); RM = Math.max(RM, r[i]); hecho = true; break; } } }
   if (i === 0) camino0 = tray; colas.push(Int16Array.from(tray.slice(-CO * 2))); }
  rMax[n] = RM; return { n, x, y, r, rMax, camino0, cola: colas };
 };

 // =====================================================================================================
 // 9 · PÉNDULO DOBLE (v2.3): dos brazos rígidos sin rozamiento (ecuaciones de Lagrange, RK4). Dos copias, A y B, salen casi iguales:
 // B tiene `delta` rad más en el segundo brazo. cfg = { th1, th2, w1, w2, L1, L2, m1, m2, g, delta, dur, fps (30), sub (40) }
 // → { NF, A: { t1, t2 } y B: { t1, t2 } (ángulos por fotograma, Float64), w2A, w2B (velocidades del 2.º brazo), sep(f) (distancia
 //   entre las bolas de abajo / (L1 + L2)), tSep(umbral) (primer instante en que la separación supera el umbral), energia }
 // =====================================================================================================
 SIM.pendulo2 = (cfg) => { const fps = cfg.fps || 30, sub = cfg.sub || 40, dt = 1 / (fps * sub), NF = Math.round(cfg.dur * fps) + 1;
  const L1 = cfg.L1 ?? 1, L2 = cfg.L2 ?? 1, m1 = cfg.m1 ?? 1, m2 = cfg.m2 ?? 1, g = cfg.g ?? 9.81;
  const acc = (a1, a2, w1, w2) => { const dl = a1 - a2, den = 2 * m1 + m2 - m2 * Math.cos(2 * dl);
   return [(-g * (2 * m1 + m2) * Math.sin(a1) - m2 * g * Math.sin(a1 - 2 * a2) - 2 * Math.sin(dl) * m2 * (w2 * w2 * L2 + w1 * w1 * L1 * Math.cos(dl))) / (L1 * den),
           (2 * Math.sin(dl) * (w1 * w1 * L1 * (m1 + m2) + g * (m1 + m2) * Math.cos(a1) + w2 * w2 * L2 * m2 * Math.cos(dl))) / (L2 * den)]; };
  const corre = (s0) => { let [a1, a2, w1, w2] = s0; const T1 = new Float64Array(NF), T2 = new Float64Array(NF), W2 = new Float64Array(NF);
   for (let f = 0; f < NF; f++) { T1[f] = a1; T2[f] = a2; W2[f] = w2;
    for (let s = 0; s < sub; s++) { const k1 = acc(a1, a2, w1, w2), k1a = [w1, w2];
     const k2 = acc(a1 + k1a[0] * dt / 2, a2 + k1a[1] * dt / 2, w1 + k1[0] * dt / 2, w2 + k1[1] * dt / 2), k2a = [w1 + k1[0] * dt / 2, w2 + k1[1] * dt / 2];
     const k3 = acc(a1 + k2a[0] * dt / 2, a2 + k2a[1] * dt / 2, w1 + k2[0] * dt / 2, w2 + k2[1] * dt / 2), k3a = [w1 + k2[0] * dt / 2, w2 + k2[1] * dt / 2];
     const k4 = acc(a1 + k3a[0] * dt, a2 + k3a[1] * dt, w1 + k3[0] * dt, w2 + k3[1] * dt), k4a = [w1 + k3[0] * dt, w2 + k3[1] * dt];
     a1 += dt / 6 * (k1a[0] + 2 * k2a[0] + 2 * k3a[0] + k4a[0]); a2 += dt / 6 * (k1a[1] + 2 * k2a[1] + 2 * k3a[1] + k4a[1]);
     w1 += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); w2 += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); } }
   return { t1: T1, t2: T2, w2: W2 }; };
  const s0 = [cfg.th1, cfg.th2, cfg.w1 ?? 0, cfg.w2 ?? 0], A = corre(s0), B = corre([s0[0], s0[1] + (cfg.delta ?? 1e-6), s0[2], s0[3]]);
  const pos = (P, f) => [L1 * Math.sin(P.t1[f]) + L2 * Math.sin(P.t2[f]), L1 * Math.cos(P.t1[f]) + L2 * Math.cos(P.t2[f])];
  const sep = (f) => { f = Math.max(0, Math.min(NF - 1, f | 0)); const [ax, ay] = pos(A, f), [bx, by] = pos(B, f); return Math.hypot(ax - bx, ay - by) / (L1 + L2); };
  const tSep = (u) => { for (let f = 0; f < NF; f++) if (sep(f) > u) return f / fps; return Infinity; };
  const energia = -(m1 + m2) * g * L1 * Math.cos(s0[0]) - m2 * g * L2 * Math.cos(s0[1]);
  return { NF, fps, A, B, L1, L2, sep, tSep, energia };
 };

 // =====================================================================================================
 // 10 · BANDADA, BOIDS 3D (v2.4; Reynolds 1987): cada pájaro sigue 3 reglas con sus vecinos (radio `rv`): separación, alineación y
 // cohesión. Además: límites suaves del cielo (no salirse de la caja), huida de un halcón (`halcon`) y, desde `tPercha`, bajada a la
 // percha (los árboles). cfg = { n, dur, fps (30), sub (2), seed, caja: [x0, x1, y0, y1, z0, z1], rv, rs, vMin, vMax, wS, wA, wC, wB,
 //   vecinos (máx. que mira cada uno, 10), margen (0,2), anillo ([k0, k1]: de dónde llegan, en semiejes de la caja), halcon: { t0, t1, v, rHuida, wH }, percha: { t, x, y, z, w } } → { n, NF, pos (Float32 NF·n·3), hal (Float32 NF·3, NaN si no está),
 //   giros (Float32 NF: fracción de pájaros que giran bruscamente en cada fotograma) }
 // =====================================================================================================
 SIM.boids = (cfg) => { const n = cfg.n, fps = cfg.fps || 30, sub = cfg.sub || 2, dt = 1 / (fps * sub), NF = Math.round(cfg.dur * fps) + 1, rng = H.rng(cfg.seed ?? 1);
  const [X0, X1, Y0, Y1, Z0, Z1] = cfg.caja, rv = cfg.rv ?? 4, rs = cfg.rs ?? 1.3, vMin = cfg.vMin ?? 8, vMax = cfg.vMax ?? 15;
  const wS = cfg.wS ?? 30, wA = cfg.wA ?? 2.2, wC = cfg.wC ?? 1.2, wB = cfg.wB ?? 6, MV = cfg.vecinos ?? 10, MB = cfg.margen ?? 0.2;   // vecinos que mira cada pájaro (los estorninos reales, ~7: Ballerini 2008)
  const P = new Float32Array(n * 3), V = new Float32Array(n * 3), pos = new Float32Array(NF * n * 3), hal = new Float32Array(NF * 3).fill(NaN), giros = new Float32Array(NF);
  // salida: repartidos en un anillo justo fuera de la caja, volando hacia dentro (van llegando)
  for (let i = 0; i < n; i++) { const a = rng() * Math.PI * 2, cx = (X0 + X1) / 2, cy = (Y0 + Y1) / 2, rx = (X1 - X0) / 2, ry = (Y1 - Y0) / 2, k = (cfg.anillo ? cfg.anillo[0] + rng() * (cfg.anillo[1] - cfg.anillo[0]) : 0.85 + rng() * 0.6);
   P[3 * i] = cx + Math.cos(a) * rx * k; P[3 * i + 1] = cy + Math.sin(a) * ry * k; P[3 * i + 2] = Z0 + rng() * (Z1 - Z0);
   const tx = cx + (rng() - 0.5) * rx * 0.6 - P[3 * i], ty = cy + (rng() - 0.5) * ry * 0.6 - P[3 * i + 1], m = Math.hypot(tx, ty) || 1, sp = vMin + rng() * (vMax - vMin);
   V[3 * i] = tx / m * sp; V[3 * i + 1] = ty / m * sp; V[3 * i + 2] = (rng() - 0.5) * 2; }
  const cs = rv, gx = (x) => Math.floor(x / cs), key = (a, b, c) => ((a * 73856093) ^ (b * 19349663) ^ (c * 83492791)) & 0xffff;
  const head = new Int32Array(65536), next = new Int32Array(n), HV = cfg.halcon, hp = [NaN, NaN, NaN], hv = [0, 0, 0];
  for (let f = 0; f < NF; f++) { const t = f / fps;
   pos.set(P, f * n * 3); if (!isNaN(hp[0])) hal.set(hp, f * 3);
   let giro = 0;
   for (let s = 0; s < sub; s++) { const tt = t + s * dt;
    // halcón: entra en t0 por la izquierda, persigue el centro de la bandada y sigue de largo hasta t1
    if (HV) { if (tt >= HV.t0 && tt <= HV.t1) { if (isNaN(hp[0])) { hp[0] = X0 - 15; hp[1] = (Y0 + Y1) * 0.62; hp[2] = (Z0 + Z1) / 2; }
      if (tt < (HV.t0 + HV.t1) / 2) { let mx = 0, my = 0, mz = 0; for (let i = 0; i < n; i += 7) { mx += P[3 * i]; my += P[3 * i + 1]; mz += P[3 * i + 2]; } const c = Math.ceil(n / 7); mx /= c; my /= c; mz /= c;
       const dx = mx - hp[0], dy = my - hp[1], dz = mz - hp[2], m = Math.hypot(dx, dy, dz) || 1; hv[0] = dx / m * HV.v; hv[1] = dy / m * HV.v; hv[2] = dz / m * HV.v; }
      hp[0] += hv[0] * dt; hp[1] += hv[1] * dt; hp[2] += hv[2] * dt; } else if (tt > HV.t1) { hp[0] = hp[1] = hp[2] = NaN; } }
    head.fill(-1); for (let i = 0; i < n; i++) { const h = key(gx(P[3 * i]), gx(P[3 * i + 1]), gx(P[3 * i + 2])); next[i] = head[h]; head[h] = i; }
    const PS = cfg.percha, wp = PS && tt > PS.t ? Math.min(1, (tt - PS.t) / 1.5) * PS.w : 0;
    for (let i = 0; i < n; i++) { const x = P[3 * i], y = P[3 * i + 1], z = P[3 * i + 2], vx = V[3 * i], vy = V[3 * i + 1], vz = V[3 * i + 2];
     let sx = 0, sy = 0, sz = 0, ax = 0, ay = 0, az = 0, cx = 0, cy = 0, cz = 0, nn = 0; const a0 = gx(x), b0 = gx(y), c0 = gx(z);
     for (let da = -1; da <= 1; da++) for (let db = -1; db <= 1; db++) for (let dc = -1; dc <= 1; dc++) { for (let j = head[key(a0 + da, b0 + db, c0 + dc)]; j >= 0; j = next[j]) { if (j === i) continue;
       const dx = P[3 * j] - x, dy = P[3 * j + 1] - y, dz = P[3 * j + 2] - z, d2 = dx * dx + dy * dy + dz * dz; if (d2 > rv * rv) continue;
       if (d2 < rs * rs) { const w = 1 / Math.max(0.05, d2); sx -= dx * w; sy -= dy * w; sz -= dz * w; }            // separación: con TODOS los muy cercanos
       if (nn < MV) { nn++; ax += V[3 * j]; ay += V[3 * j + 1]; az += V[3 * j + 2]; cx += dx; cy += dy; cz += dz; } } }   // alineación y cohesión: con unos pocos vecinos
     let fx = 0, fy = 0, fz = 0;
     if (nn) { fx += wS * sx + wA * (ax / nn - vx) + wC * cx / nn; fy += wS * sy + wA * (ay / nn - vy) + wC * cy / nn; fz += wS * sz + wA * (az / nn - vz) + wC * cz / nn; }   // las 3 reglas
     // límites suaves del cielo
     const bnd = (p, lo, hi) => { const m = (hi - lo) * MB; return p < lo + m ? (lo + m - p) : p > hi - m ? (hi - m - p) : 0; }; fx += wB * bnd(x, X0, X1); fy += wB * bnd(y, Y0, Y1) * (wp ? 0 : 1); fz += wB * bnd(z, Z0, Z1);
     // huida del halcón
     if (!isNaN(hp[0])) { const dx = x - hp[0], dy = y - hp[1], dz = z - hp[2], d = Math.hypot(dx, dy, dz); if (d < HV.rHuida) { const w = HV.wH * (1 - d / HV.rHuida) / Math.max(0.5, d); fx += dx * w; fy += dy * w; fz += dz * w; } }
     // bajada a la percha (al final)
     if (wp) { fx += (PS.x - x) * wp * 0.15; fy += (PS.y - y) * wp; fz += (PS.z - z) * wp * 0.15; }
     let nx = vx + fx * dt, ny = vy + fy * dt, nz = vz + fz * dt, sp = Math.hypot(nx, ny, nz) || 1, cl = Math.min(vMax * (wp ? 1.6 : 1), Math.max(vMin, sp));
     nx *= cl / sp; ny *= cl / sp; nz *= cl / sp;
     if (s === 0) { const c = (vx * nx + vy * ny + vz * nz) / ((Math.hypot(vx, vy, vz) || 1) * cl); if (c < 0.9985) giro++; }
     V[3 * i] = nx; V[3 * i + 1] = ny; V[3 * i + 2] = nz; }
    for (let i = 0; i < n * 3; i++) P[i] += V[i] * dt; }
   giros[f] = giro / n; }
  return { n, NF, fps, pos, hal, giros };
 };

 // =====================================================================================================
 // 11 · REACCIÓN-DIFUSIÓN DE GRAY-SCOTT (v2.4; Pearson 1993): u + 2v → 3v, con alimentación F y retirada k. Rejilla periódica W × H,
 // Du, Dv (por celda), paso dt = 1. Semillas pequeñas de v sobre una «piel» lisa (u = 1) con ruido mínimo (H.rng).
 // cfg = { W, H, F, k, Du, Dv, pasos (por fotograma, función del fotograma), NF, semillas, seed } → { W, H, NF, v (Uint8 NF·W·H: v·255·2),
 //   manchas (Int32 NF: grupos conectados con v > umbral) }
 // =====================================================================================================
 SIM.grayscott = (cfg) => { const W = cfg.W, Hh = cfg.H, N = W * Hh, rng = H.rng(cfg.seed ?? 1), NF = cfg.NF;
  let u = new Float32Array(N).fill(1), v = new Float32Array(N), u2 = new Float32Array(N), v2 = new Float32Array(N); const F = cfg.F, k = cfg.k, Du = cfg.Du ?? 0.2, Dv = cfg.Dv ?? 0.1;
  for (let i = 0; i < N; i++) { u[i] = 1 - rng() * 0.02; v[i] = rng() * 0.02; }
  for (let q = 0; q < (cfg.semillas ?? 30); q++) { const cx = (rng() * W) | 0, cy = (rng() * Hh) | 0, r = 2 + ((rng() * 2) | 0); for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) { if (x * x + y * y > r * r) continue; const i = ((cy + y + Hh) % Hh) * W + (cx + x + W) % W; u[i] = 0.5; v[i] = 0.25 + rng() * 0.05; } }
  const out = new Uint8Array(NF * N), manchas = new Int32Array(NF), lab = new Int32Array(N), stack = new Int32Array(N), UM = cfg.umbral ?? 0.18;
  const cuenta = (off) => { lab.fill(0); let c = 0; const m = Math.round(UM * 510);
   for (let i = 0; i < N; i++) { if (lab[i] || out[off + i] < m) continue; c++; let sp = 0, area = 0; stack[sp++] = i; lab[i] = c;
    while (sp) { const j = stack[--sp]; area++; const x = j % W, y = (j / W) | 0; const nb = [y * W + (x + 1) % W, y * W + (x - 1 + W) % W, ((y + 1) % Hh) * W + x, ((y - 1 + Hh) % Hh) * W + x];
     for (const q of nb) if (!lab[q] && out[off + q] >= m) { lab[q] = c; stack[sp++] = q; } }
    if (area < (cfg.areaMin ?? 6)) c--; } return c; };
  for (let f = 0; f < NF; f++) { const np = cfg.pasos(f);
   for (let s = 0; s < np; s++) {
    for (let y = 0; y < Hh; y++) { const yu = ((y - 1 + Hh) % Hh) * W, yd = ((y + 1) % Hh) * W, yc = y * W;
     for (let x = 0; x < W; x++) { const xl = (x - 1 + W) % W, xr = (x + 1) % W, i = yc + x;
      const lu = u[yc + xl] + u[yc + xr] + u[yu + x] + u[yd + x] - 4 * u[i], lv = v[yc + xl] + v[yc + xr] + v[yu + x] + v[yd + x] - 4 * v[i], uvv = u[i] * v[i] * v[i];
      u2[i] = u[i] + Du * lu - uvv + F * (1 - u[i]); v2[i] = v[i] + Dv * lv + uvv - (F + k) * v[i]; } }
    let tmp = u; u = u2; u2 = tmp; tmp = v; v = v2; v2 = tmp; }
   const off = f * N; for (let i = 0; i < N; i++) out[off + i] = Math.max(0, Math.min(255, v[i] * 510)); manchas[f] = cuenta(off); }
  return { W, H: Hh, NF, v: out, manchas };
 };

 // =====================================================================================================
 // 12 · MANDELBROT (v2.4): z → z² + c. Núcleo de la componente de periodo p más cercana a c0 (Newton) y su tamaño y giro respecto al
 // conjunto entero (s = 1 / (β·λ²), Munafo). Y `iter(cx, cy, maxIt)` con escape continuo y detección de órbitas periódicas.
 // =====================================================================================================
 SIM.mandel = {
  nucleo: (cr, ci, p, it = 60) => { for (let q = 0; q < it; q++) { let zr = 0, zi = 0, dr = 0, di = 0;
    for (let j = 0; j < p; j++) { const ndr = 2 * (zr * dr - zi * di) + 1, ndi = 2 * (zr * di + zi * dr); dr = ndr; di = ndi; const nzr = zr * zr - zi * zi + cr; zi = 2 * zr * zi + ci; zr = nzr; }
    const m = dr * dr + di * di; if (!m) break; const sr = (zr * dr + zi * di) / m, si = (zi * dr - zr * di) / m; cr -= sr; ci -= si; if (Math.hypot(sr, si) < 1e-17) break; } return [cr, ci]; },
  tamano: (cr, ci, p) => { let zr = 0, zi = 0, lr = 1, li = 0, br = 1, bi = 0;
   for (let j = 1; j < p; j++) { const nzr = zr * zr - zi * zi + cr; zi = 2 * zr * zi + ci; zr = nzr; const nlr = 2 * (zr * lr - zi * li), nli = 2 * (zr * li + zi * lr); lr = nlr; li = nli;
    const m = lr * lr + li * li; br += lr / m; bi -= li / m; }
   const l2r = lr * lr - li * li, l2i = 2 * lr * li, dr = br * l2r - bi * l2i, di = br * l2i + bi * l2r, m = dr * dr + di * di; return [dr / m, -di / m]; },
  periodo: (cr, ci, pMax) => { let zr = 0, zi = 0, best = 1, bm = Infinity; for (let j = 1; j <= pMax; j++) { const nzr = zr * zr - zi * zi + cr; zi = 2 * zr * zi + ci; zr = nzr; const m = zr * zr + zi * zi; if (m > 4) break; if (m < bm) { bm = m; best = j; } } return best; },
 };

 root.SIM = SIM;
})(typeof window !== 'undefined' ? window : globalThis);
