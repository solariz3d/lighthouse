# D416 — every night sky drawn at the monitor's own pixels, and a new sky for Glass (2026-10-19)

Ordered by the keeper, 15:59: "still low res, use a different sky, aurora and skyline night have different sky, i swear it should be native to the resolution of the users monitor to not be blury, all night skys can be more precise".
Lap type: the keeper's own order, and a fix on D410 (his eye says the sky is still soft). Inside the freeze.
Pane: **B** (holds D410's context and its crisp test). Branch from `d410-b` @ 68e505c, so D410's `uPx` comes along.

## What he was looking at (checked)

- His installed builder is local-0.4.9 install 4, sha256 7c70d946…bb55. **D410 is not in it**: it's queued as merge 5, behind A's D407b timing window. So the Glass sky he judged is 0.4.8's soft prism sky.
- The canvas itself IS native: `app/preview/preview.js:336` sizes the backing store at css × devicePixelRatio (`backingSize`, :492-502), and the sky is drawn per pixel over the full viewport (`renderer.js:400-405`). The softness is in the sky shaders' own sizes, not a low-res buffer.
- Why: every star and edge is sized in sky angles or grid-cell units, never in screen pixels:
  - `sky/aurora.js:26` and `sky/city.js:19`: stars are gaussians `exp(-d²/(2·0.13²))` in CELL units. The header says "about a pixel across", but a cell's size on screen depends on the field of view and the window size, so it is a pixel only by luck.
  - `sky/caustics.js:33`: the same shape (0.12).
  - prism (Glass) was fixed this way in D410: stars as 1.25-device-px cones, a 1.5-px moon limb, using the new `uPx` uniform (one device pixel's angle, `renderer.js`).

## Parts

1. **Native pixels for every night sky (B).** Aurora, city (Skyline Night) and the caustics motes take D410's `uPx`. Every star, moon edge and other fine feature is sized in device pixels, as prism now is. Their looks stay theirs (colours, curtains, glow).
2. **A new sky for Glass (B).** The keeper asked for a different sky, unlike aurora's and Skyline Night's. B designs it for Glass's identity, pixel-native from the start, keeps it calm behind the work (the ±10° band rule, sky-dither row 2), and shows it in shots. It's a look, so the keeper judges it in the local build. It's not a test gate.
3. **The local build (E).** As soon as D416 is green, it replaces D410 in merge 5 (D416 contains D410). E runs only the touched test files, the 15:53 rule.

## Tests (red first on 68e505c for part 1)

- Generalise `app/test/sky-prism-crisp.test.js` (D410's) to every night style: star FWHM ≤ 1.5 px median and ≤ 1.8 p90, and any limb/edge ≤ 2 px, measured at 2560×1440 at DPR 1 **and** at DPR 1.5 (a scaled monitor), so "native" is proved at more than one pixel density.
- Red on 68e505c for aurora and city (expected from the cell-unit gaussians), green after.
- The new Glass sky gets the same rows from its first commit.
- theme-mutation: one mutant per new row (B's D410 pattern). sky, sky-dither, sky-caustics-aurora and theme whole.
- No drag-frame timing session (the 15:53 rule); B notes the sky pass's cost from one ordinary run.

## Bar

- Every night style passes the crisp rows at both pixel densities.
- Shots: each night look looking up, at full size, before and after, plus the new Glass sky. The librarian views them before E merges.
- Hand-back: `exo_memory/handback/p-d416-skies-B_2026-10-19.md`. Commit by named paths, no push.
