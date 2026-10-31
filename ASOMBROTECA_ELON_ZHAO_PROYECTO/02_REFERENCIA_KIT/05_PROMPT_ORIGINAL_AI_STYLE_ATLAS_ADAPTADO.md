# EDITORIAL ESSAY COLLAGE — PROMPT BASE DE AI STYLE ATLAS (adaptación para Asombroteca)

Original introduction in the user-provided reference:

> I want an animated explainer made in the "Editorial Essay Collage" visual style (Popular Explainer Looks). Below is the complete source code of a reference animation in this exact style, plus a small sound-effects kit. Use them as your style guide and rebuild it around my content.

## Original storyboard-first contract

Before building animation, create one HTML page with 8–12 Canvas storyboard panels. Each panel must use the reference's own drawing, texture and finishing methods. Under each frame show beat, real time start/end, on-screen words, continuous transition or scene-change rationale, and key sound. List assumptions under the grid. Wait for storyboard approval before full production. Reuse the storyboard drawing code once approved.

## Original implementation contract

A self-contained HTML Canvas player with play/pause, scrubbing, current time, sound toggle, loop; `explainer(ctx,W,H_,t)`, deterministic frame drawing with `H.rng`/`H.makeNoise`, `scoreSound(k)` using SOUND, `window.seek(t)`, `window.DURATION`, `window.scoreSound`. Load fonts Anton, Libre Baskerville and Oswald. Run all finish passes including paper grain, halftone, ink effects and misregistration at reference strength. Key visuals fill most of viewport and remain readable on a phone. Full reference used 1280x720; Asombroteca overrides to native 1080x1920 with actual voiceover length.

## Original motion and finishing

- Cutouts drop and slide in with 12 fps stepped placements, while the camera glides smoothly through parallax layers.
- Torn white frames, soft paper shadows, masking tape, newsprint panels and archival duotone halftone photographs.
- Yellow highlighter physically sweeps from left to right; red marker rings/crosses the critical detail.
- Thin ink route arrows and hand-cut condensed numerical typography.
- Camera whips hide genuine editorial scene changes; a new sheet slides upward over the preceding scene.
- Style-driven tactile sound: paper placements, tear/tape, pen strokes, highlighter and brief camera swishes.

## Critical override: original 'no voiceover' vs. Asombroteca narrated format

The example said `voiceover:false` and had 15 s duration. This project has a user-supplied fixed narration and duration determined by its real waveform. Preserve that voice exactly; do not synthesize. If `SOUND.kit(...,{voiceover:true})` is used, `k.bed` and `k.music` will not play: render and duck a separate music track. Never silently drop music while claiming a full mix.

## Essential files from supplied template

The H and SOUND source kits are shipped in `lib/` and pass JavaScript syntax validation. The unique original `styles/editorial-collage.js` was pasted in the ChatGPT conversation but **is not stored verbatim in this ZIP**. For exact-source reuse, it must be provided to Claude Code alongside this kit. This limitation is intentional and explicit, not a claim of code completeness.

## Narrative content

Use `02_GUION_APROBADO_NO_MODIFICAR.txt`. It is complete and approved. Do not ask the user to restate the script or replace it with `[Describe your topic]`.
