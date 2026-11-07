// =====================================================================================================
// episodio.js — «{{TITULO}}» · PLANTILLA ASOMBROTECA v{{VERSION}} · estilo «{{ESTILO}}»
// Generado por tools/nuevo_proyecto.py. Funciona desde el primer minuto: crea UNA escena provisional por tramo de voz
// (icono + etiqueta) y, si el último tramo dice «envíaselo / compártelo / sígueme», el cierre de compartir.
// Tu trabajo: sustituir las escenas provisionales por escenas reales (ver «CÓMO ESCRIBIR UNA ESCENA» abajo).
//
// FÓRMULA DE GUION Y PLANOS (extraída de vídeos virales de referencia):
//   gancho (pregunta o dato imposible, ≤ 2 s) → giro («no es X, es Y») → metáfora visual cotidiana → mecanismo en 2-4 pasos
//   con cifras concretas → consecuencia sorprendente → remate que vuelve al gancho → «Envíaselo a ese amigo que…»
//   Una idea visual por frase; algo cambia cada 1-2 s; cámara siempre en movimiento suave; texto en pantalla ≤ 3 palabras.
// =====================================================================================================
(function () {
 const A = window.ALIGN, PL = window.PLANTILLA, P = PL.P, FX = PL.FX, MUS = PL.MUS;
 // Kit: wt(tramo, 'palabra') = instante en que se dice · T.s3 = inicio del tramo 3 · B0.b3 = T.s3 − 0,2 · DURATION = voz + 1 s
 const K = PL.kit(A, { lead: 0.2, tail: 1.0 }), { W, HH, TAU, cl, sm, E, lerp, win, wt, T, B0, DURATION, txt, title, lab } = K;
 const ESTILO = '{{ESTILO}}';   // asombroteca · viral · cartoon · noche · blueprint · dossier · producto · tecno (ver GUIA_ESTILOS.md)

 // ---------- 1 · TIEMPOS CLAVE (palabras de TU voz donde pasa algo) ----------
 // Ejemplo: const Tk = { pregunta: wt(0, 'por'), llave: wt(3, 'llave'), cifra: wt(5, 'cien') };
 const N = A.segments.length;
 const texto = (i) => A.words.filter((w) => w.seg === i).map((w) => w.w).join(' ');

 // ---------- 2 · ESCENAS ----------
 // CÓMO ESCRIBIR UNA ESCENA (beat): { t0, t1, in: { type: 'cut'|'fade'|'zoom'|'iris'|'slide'|'rise', d, x, y }, draw(ctx, t), sfx(k) }
 //  · draw(ctx, t) pinta el fotograma completo en el instante t (función pura de t: sin estado, sin Math.random → usa H.rng).
 //  · Empieza con el fondo del estilo: P.fondo(ctx, t). Después, los bloques: P.character, P.keyLock, P.icon, P.iconGrid, P.hud,
 //    P.mapTop, P.dossier, P.stamp, P.layerStack, P.render3 (3D), P.smartphone + P.scrChat…, P.tag (etiquetas), P.statBig…
 //    Catálogo completo con capturas: catalogo/ y GUIA_ESTILOS.md. Tiempos SIEMPRE anclados a palabras: wt(tramo, 'palabra').
 //  · sfx(k): un sonido por cada cambio visual (FX.aparece, FX.etiqueta, FX.toque, FX.llave, FX.sello, FX.compartir…).
 const B = [];
 for (let i = 0; i < N; i++) {
  const t0 = i ? B0['b' + i] : 0, t1 = i < N - 1 ? B0['b' + (i + 1)] : DURATION, cta = i === N - 1 && /env[ií]a|compart|s[ií]gueme/i.test(texto(i)), ic = P.ICONOS[(i * 7 + 3) % P.ICONOS.length];
  B.push({ t0, t1, in: { type: i ? 'fade' : 'cut', d: 0.3 }, draw(ctx, t) {
   P.fondo(ctx, t);
   if (cta) { P.ctaShare(ctx, t, t0 + 0.15, t1); P.marca(ctx, t, T.end - 0.3); return; }
   // ESCENA PROVISIONAL — sustitúyela: icono que entra con rebote + etiqueta con el número de escena
   const e = E.out(win(t, t0, t0 + 0.45)); P.glow(ctx, 540, 900, 380, '255,255,255', 0.08 * e); P.icon(ctx, ic, 540, 900 + (1 - e) * 60, 320 * e, { mode: 'flat' });
   P.tag(ctx, 'ESCENA ' + (i + 1) + ' · ' + ic, 540, 1180, t, t0 + 0.25, t1, { mono: true });
  }, sfx(k) { if (cta) FX.compartir(k, t0 + 0.15); else { FX.aparece(k, t0 + 0.05); FX.etiqueta(k, t0 + 0.25); } } });
 }

 // ---------- 3 · MONTAJE ----------
 const EP = PL.make({
  estilo: ESTILO, marca: { nombre: '{{MARCA}}' }, align: A, duration: DURATION, beats: B,
  keywords: [],              // palabras que se resaltan en los subtítulos (tal como se escriben en tramos.txt, con su puntuación)
  // capIcons: { mojadas: 'gota' }, // icono vectorial junto a una palabra clave (estilos con subtítulos 'ios')
  ambience(k) { k.noise(0, { dur: DURATION, color: 'pink', filter: 'lowpass', f: 500, gain: 0.005, a: 0.8, hold: DURATION - 2.2 }); },
  music(k) { MUS.pulso(k, 0, DURATION, { bpm: 96, gain: 0.6, chords: [['A2', 'C3', 'E3', 'A3'], ['F2', 'A2', 'C3', 'F3'], ['C3', 'E3', 'G3', 'C4'], ['G2', 'B2', 'D3', 'G3']] }); },
 });
 window.EPISODIO = { explainer: EP.explainer, init: async () => { await K.fotos(); }, T, DURATION };
 window.scoreSound = EP.scoreSound; window.scoreMusic = EP.scoreMusic;
})();
