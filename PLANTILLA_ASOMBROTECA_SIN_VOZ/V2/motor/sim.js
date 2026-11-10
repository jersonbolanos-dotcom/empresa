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
 // → { n(f), x(f,i), y(f,i), radio(f,i), gen[i], born[i], tLleno, eventos: [{ t, tipo: 'inicio'|'borde'|'choque'|'nace'|'lleno', v, n, ang }] }
 // =====================================================================================================
 SIM.rebote = (cfg) => { const fps = cfg.fps || 30, sub = cfg.sub || 8, dt = 1 / (fps * sub), NF = Math.round(cfg.dur * fps), R = cfg.R, rMin = cfg.r, cx = cfg.cx, cy = cfg.cy, nMax = cfg.nMax;
  // radio de cada bola según su generación: al dividirse, el área se reparte entre las dos hijas (radio / √2), hasta rMin
  const r0 = cfg.r0 ?? rMin, rad = (g) => Math.max(rMin, r0 * Math.pow(2, -g / 2));
  const rng = H.rng(cfg.seed ?? 1), x = new Float64Array(nMax), y = new Float64Array(nMax), vx = new Float64Array(nMax), vy = new Float64Array(nMax), age = new Float64Array(nMax), gen = new Uint16Array(nMax), born = new Float32Array(nMax), rr = new Float64Array(nMax);
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
      const ang = Math.atan2(vy[i], vx[i]) + rot; vx[j] = Math.cos(ang) * sp; vy[j] = Math.sin(ang) * sp; age[i] = 0; age[j] = 0; born[j] = t;
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
  return { NF, fps, R, r: rMin, r0, rad, cx, cy, gen, born, tLleno, eventos: ev, nMax,
   n: (f) => nAt(cl(f, 0, NF - 1)), x: (f, i) => P[off[cl(f, 0, NF - 1)] + 2 * i], y: (f, i) => P[off[cl(f, 0, NF - 1)] + 2 * i + 1], radio: (f, i) => rad(genF[cl(f, 0, NF - 1)][i] ?? 0) };
 };

 // =====================================================================================================
 // 2 · GALTON: bolitas que caen por una red triangular de clavos (choques reales con gravedad y rebote) y se apilan en casillas
 // cfg = { dur, fps, sub, x0 (centro), yPeg0 (primera fila), filas, dx, dy, pegR, r, nBolas, tIni, tFin (última salida del grueso),
 //   pre (s de precarga antes del fotograma 0), tUltima (salida de la última bola, que cae sola), yFondo (fondo de las casillas), g, e (restitución), fric (velocidad lateral que queda
 //   tras un choque), drag (rozamiento lateral con el aire, 1/s), vMax (velocidad de caída máxima), seed }
 // → { NF, activas(f) → [x,y,id,…], cuenta(f) → bolas ya apiladas, pila(k) → posiciones de la casilla k, casilla[id], orden[id],
 //   llegada[id] (t), slot(k, s) → [x, y], eventos: [{ t, tipo: 'clavo'|'casilla', fila, k, v }] }
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
    while (lanz < nB && sal[lanz] <= t) { const i = lanz++; bx[i] = x0 + (rng() - 0.5) * 3.0; by[i] = y0 - dy * 1.6; bvx[i] = (rng() - 0.5) * 30; bvy[i] = 60 + rng() * 20; est[i] = 1; act.push(i); }
    for (let a = act.length - 1; a >= 0; a--) { const i = act[a];
     bvy[i] += G * dt; if (est[i] === 1) { bvx[i] *= Math.exp(-(cfg.drag ?? 0) * dt); if (bvy[i] > (cfg.vMax ?? 1e9)) bvy[i] = cfg.vMax; } bx[i] += bvx[i] * dt; by[i] += bvy[i] * dt;
     if (est[i] === 1) {
      // clavos cercanos (fila y columnas vecinas)
      const ri = Math.round((by[i] - y0) / dy); for (let rr = ri - 1; rr <= ri + 1; rr++) { if (rr < 0 || rr >= rows) continue; const py = y0 + rr * dy, cj = Math.round((bx[i] - x0) / dx + rr / 2);
       for (let j = cj - 1; j <= cj + 1; j++) { if (j < 0 || j > rr) continue; const px = x0 + (j - rr / 2) * dx, ddx = bx[i] - px, ddy = by[i] - py, d = Math.hypot(ddx, ddy);
        if (d < pegR + r && d > 1e-9) { const nx = ddx / d, ny = ddy / d; bx[i] = px + nx * (pegR + r); by[i] = py + ny * (pegR + r); const vn = bvx[i] * nx + bvy[i] * ny;
         if (vn < 0) { bvx[i] -= (1 + e) * vn * nx; bvy[i] -= (1 + e) * vn * ny; bvx[i] *= (cfg.fric ?? 0.96); if (-vn > 40 && t >= 0) ev.push({ t, tipo: 'clavo', fila: rr, col: j, v: -vn }); } } } }
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
 // cfg = { trazo: [[x,y]…] (cerrado, en el orden en que se dibuja), N (muestras, 2048), K (términos guardados, 600) }
 // → { coef: [{ k, re, im, r }] ordenados de mayor a menor radio (sin el término 0), c0, punto(n, tau) → [x, y], cadena(n, tau) → [[x,y]…] }
 // =====================================================================================================
 SIM.fourier = (cfg) => { const N = cfg.N || 2048, pts = SIM.resample(cfg.trazo, N), K = cfg.K || 600;
  const coef = []; let c0 = [0, 0];
  for (let k = -K; k <= K; k++) { let re = 0, im = 0; for (let n = 0; n < N; n++) { const a = -TAU * k * n / N, c = Math.cos(a), s = Math.sin(a); re += pts[n][0] * c - pts[n][1] * s; im += pts[n][0] * s + pts[n][1] * c; } re /= N; im /= N; if (k === 0) c0 = [re, im]; else coef.push({ k, re, im, r: Math.hypot(re, im) }); }
  coef.sort((a, b) => b.r - a.r);
  const cadena = (n, tau) => { let x = c0[0], y = c0[1]; const out = [[x, y]]; for (let j = 0; j < n; j++) { const c = coef[j], a = TAU * c.k * tau, ca = Math.cos(a), sa = Math.sin(a); x += c.re * ca - c.im * sa; y += c.re * sa + c.im * ca; out.push([x, y]); } return out; };
  const punto = (n, tau) => { let x = c0[0], y = c0[1]; for (let j = 0; j < n; j++) { const c = coef[j], a = TAU * c.k * tau; x += c.re * Math.cos(a) - c.im * Math.sin(a); y += c.re * Math.sin(a) + c.im * Math.cos(a); } return [x, y]; };
  return { coef, c0, punto, cadena, muestras: pts };
 };

 root.SIM = SIM;
})(typeof window !== 'undefined' ? window : globalThis);
