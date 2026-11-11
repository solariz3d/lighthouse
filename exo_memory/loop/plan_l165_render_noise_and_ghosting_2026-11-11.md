# L165: grain and ghost trails in the raytraced light. Librarian, 2026-11-11 07:3x (L)

His words: `briefs/dreamzone2_the_game.md` item 63. **C, who built the body that now moves through the light.**

**Part 1: diagnose, read-only, now (L162's landing is still running).**
- Read `render/` on main: `renderer.h`, `renderer.cpp`, `shaders/dz.hlsl`, `CHANGES.md`. From E's look hand-back: one ray per pixel, then soft shadows, AO and one bounce, then TAA (`taaHistory 0.9`, `taaClip 1.25`).
- **The grain:**
  - which terms are stochastic (the soft-shadow, AO and bounce samples per pixel);
  - what denoises them today, if anything beyond TAA.
- **The ghost trails:**
  - does the body, or any moving instance (chasers, the body), write motion vectors?
  - Or does TAA reproject everything by the camera alone, so a moving limb leaves its old light behind?
  - Is there neighbourhood clamping or variance clipping, and a reactive or disocclusion mask?
- **Captures** of both artifacts from `dz-world`/`dz-gym` capture modes. A short burst of consecutive frames shows the trail; stills cannot.

**Part 2: the fix (after the diagnosis is read, and after L162 lands).** Register before building.
- Likely candidates: per-instance motion vectors for the body and chasers; variance clipping in TAA; and a cheap spatial or à-trous denoise on the stochastic terms, guided by depth and normal.
- **Cost:** no timing runs on L (since 11-07). State the extra passes and samples in words. The frame-cost check goes to D, under the 2.78 ms budget.
- Before and after bursts for his eye.

Hand-back: `handback/p-l165-render-C_2026-11-11.md`.
