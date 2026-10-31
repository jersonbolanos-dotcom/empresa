# AI STYLE ATLAS — PROMPT DE LA PLANTILLA FLAT-VECTOR SCIENCE

**Fuente suministrada por el usuario en el chat de Asombroteca, 31 de octubre de 2026.**
**Nombre:** Flat-Vector Science  | **Familia:** Popular Explainer Looks

## Prompt base de la plantilla (instrucciones originales)

I want an animated explainer made in the "Flat-Vector Science" visual style (Popular Explainer Looks). Below is the complete source code of a reference animation in this exact style, plus a small sound-effects kit. Use them as your style guide and rebuild it around my content.

MY CONTENT:
[The user's approved helicopter autorotation narration in `03_GUION/GUION_ORIGINAL_APROBADO_INTOCABLE.txt`. Never generate a different script.]

STORYBOARD FIRST: before building the animation, make a VISUAL storyboard and wait for my OK.
- One HTML page with a grid of panels, one per beat (about 6-10). Each panel is a canvas showing that beat's key frame drawn in this style: use the H library and the reference's own drawing, texture and finishing functions so the panels already look like the finished piece. Still frames only, no animation or sound yet.
- Under each panel: beat number, start/end time, exact on-screen text, how it gets there from the previous panel (continuous carry-over, movement, transformation or scene-change transition), and key sounds.
- Below the grid, list any facts or numbers assumed.
- When approved, build the full animation exactly as storyboarded, reusing the storyboard drawing code.

WHAT TO BUILD:
- One self-contained HTML file with canvas and controls: play/pause, scrub slider, time, sound toggle, loop on.
- A new `explainer(ctx, W, H_, t)`, with `DURATION` derived from audio rather than arbitrary 12–30 seconds.
- A `scoreSound(k)` function using SOUND, exactly synced. Use `{voiceover:true}` in this narrated project, **not** the original `{voiceover:false}`; synthesize original music as a separate low-priority stem, because SOUND's voiceover mode by design drops beds and music.
- Include H library and SOUND kit unchanged; retain relevant functions from the reference.
- Load Fredoka and Nunito fonts before drawing:
  `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;700;900&display=block">`
- Expose `window.seek(t)`, `window.DURATION`, `window.scoreSound` for deterministic frame rendering.

HOW TO STAY IN THE STYLE:
- Reuse the reference's rendering techniques, palette, textures, lettering, line quality, arrows, number treatment, transitions, timing feel. Change only story, text and subjects. Do not change the medium.
- Accurately draw every scientific mechanism. **Never carry over robot, cats, dogs, planets, galaxy or AI training props unless the topic genuinely requires them; they do not fit helicopter autorotation.**
- Preserve the style's surface/finishing passes; do not flatten it to generic diagrams.
- Every frame is a pure function of t; H.rng(seed) and H.makeNoise(seed), never Math.random. Caching static textures is allowed.
- On original 1280×720 reference, headlines ≥44 px, essential annotations ≥28 px, key numbers ≥64 px; in this Asombroteca project adapt legibility proportionally to **native 1080×1920 vertical layout**.
- Keep frames efficient and export deterministically.

STRUCTURE:
- Real explainer, object/action in first second, change every 1–2 s, animations as explanation, labels attached to mechanisms, coherent emphasis and short conclusion.
- Continuous transitions when ideas are related; full scene change when narrative changes meaning, place or time. No mandatory cut every beat.
- Dotted, thick, rounded route arrows animated on real causal paths. Labels land where they refer.

SOUND:
- Event-synced, medium-true effects for actual moments, subordinate to provided narration. At most ~3 simultaneous prominent effects.
- Quiet original ambience/music in separately produced stem at restrained level.
- Do not change user narration. Audio priority: voice > SFX > music.

RENDER:
- Shell-capable Claude Code may use Puppeteer/Chromium to invoke `window.seek(i/30)` and pipe frames to FFmpeg; use `SOUND.renderOffline(scoreSound,DURATION,48000,{voiceover:true})` for FX, handling return object `{inter,peak,frames,sr}` correctly.
- Export vertical 1080×1920 and separate music/SFX. Report actual ffprobe details.

STYLE CARD:
- Name: Flat-Vector Science
- Family: Popular Explainer Looks
- Look: Deep navy-to-violet space gradients, chunky outline-free shapes with rich multi-stop gradients, flat crescent shadows and rim highlights, soft radial glows, sparkly star fields, banded ringed planets, cute big-eyed round characters.
- Motion: Smooth eased motion with gentle overshoot, continuous pullback across scales, parallax and soft pulses.
- How it explains: Camera move through scale, object sweeps as a wipe, camera dive through a meaningful object; rounded dotted arrows and huge rounded Nunito numerals.
- In this adaptation **reinterpret star fields as subtle airborne particles, rings as rotor diagrams, and scale pulls as helicopter→rotor→blade cross-section**. Do not use space as the setting.

## Código de referencia

- `04_AI_STYLE_ATLAS/lib/harness.js` — H original del paquete de Asombroteca (mismas funciones del texto pegado por usuario).
- `04_AI_STYLE_ATLAS/lib/sound.js` — SOUND original (mismas funciones del texto pegado por usuario).
- `04_AI_STYLE_ATLAS/styles/flat-vector-helicopter-reference.js` — **ADAPTACIÓN TÉCNICA funcional al tema**, con los trazos esenciales (fondos, gradientes, glows, crescent shadow, flechas, rotor, helicóptero) para que no se pierda el lenguaje visual.

**Transparencia:** el archivo `flat-vector-helicopter-reference.js` no es una copia literal íntegra del `styles/flat-space.js` largo que el usuario pegó en el chat. Si Claude dispone también de aquel archivo original, debe utilizarlo como base principal y conservar sus funciones; esta adaptación es referencia temática complementaria. Ningún archivo de este ZIP debe presentarse falsamente como ese original literal. El original fue facilitado en el chat, no como fichero adjunto. 
