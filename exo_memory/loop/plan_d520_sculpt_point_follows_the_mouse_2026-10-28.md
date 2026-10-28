# D520: Sculpt, the grabbed point follows the mouse. Librarian, 2026-10-28 15:1x

The keeper, 15:12, after trying D519 as installed (a39de16a…, C's d519-c e2922e7): "its still not what I had in mind, think of it like, the mouse click gives a singular point you then drag to sculpt the track simple as that".

So the rule is one sentence: **the point of road you press on stays under the mouse while you drag, and the road around it follows with the radius as the softness.** No tool key, no axis to pick, no channel to know. Like a vertex drag with proportional falloff in a 3-D program.

## What D519 built that stays (checked at d519-c e2922e7)

- The pick across the road: `app/preview/preview.js:600` pickAcross gives `s`, `pos`, `u` (signed share across, + left, ±1 the rims), `at` (the hit's world point), `axes` (the on-screen directions of the road's up and across). `app/core/zonegrab.js:87` acrossAt gives at a sample the surface point, its normal U and across direction L as unit world vectors.
- The dots on the selected run (zonegrab.js:55 dotStations; handles.js) stay: his answer of 11:2x was "both".
- Pieces, undo per drag, radius control, the strip's cues: unchanged.

## What changes

1. **The drag reads the world, not pixels.** Every mouse position during the drag is unprojected onto the plane through `at` that faces the camera (the standard 3-D grab plane); Δ = P′ − at in world, so the pressed point lands exactly where the cursor is. zonegrab's `axisOf` (the first-motion U-or-L lock, :41) is no longer used by Grab: both components apply on every step.
2. **Δ becomes channel deltas by where the press was** (a pure function, tested; the figures are C's to tune, the invariant is "the pressed point follows, the rest of the section stays where it can"). With up = world up (h's axis, document.js:30) and left = the gravity frame's horizontal left (l's axis), e = Δ·left, z = Δ·up, w the FULL width (coreshell.js sculptInfo halfAt = w/2):
   - anywhere between the rims, sideways: `l += e` (the road slides under the point);
   - centre (|u| small): up: `h += z`;
   - cup zone (a cup piece): up: `c` changes so the surface at u rises by z (C inverts the cup profile linearly per step; a piece with no cup lifts h);
   - a rim (|u| ≥ the rim band), sideways: the touched edge moves and the far edge stays: `w += side·e`, `l += e/2` (side = +1 left, −1 right; check: left rim = l + w/2 moves by e, right rim = l − w/2 does not);
   - a rim, up: the touched side rises and the far rim stays: bank `phi += δ` with δ = asin(z / w), and `h += z/2` (the far rim's fall under the bank is cancelled by the lift).
   - The forward component of Δ is dropped (no re-route, no stretch: those stay on their keys).
3. **The brush steps several channels in one drag.** Today `src/core/sculpt.js` brushControls and the shell's brush state carry ONE channel (sculpt.js:1-2, coreshell.js:550-588 `brush: { channel, … }`). The step takes a set `{ h: dh, l: dl, … }` over the same window, one undo step, each channel brushed exactly as a single one is today (a single-channel call must give the same doubles as before). This is the one core change, and it is small: a loop over the set where there was one channel.

## Tier and parts

One pane, **C** (holds d519-c and wrote zonegrab): build on d519-c, in one go.
- The core multi-channel step: **prove it** in the small (sculpt.js's own tests `test/core_sculpt*.test.js` plus one new row: a two-channel step equals two single steps, and a single step is byte-for-byte what it was). No whole-harness run.
- The app layer (the grab plane, follow(), panel's drag, the strip's cue): **check it**: the pure follow() rows (one per bullet above, with the rim checks), zonegrab.test.js and handles.test.js, the skin test. Nothing else.
- Install as D519 was: builder closed, `.before-d520`, sha256 compare; the keeper tries it on CRAZY TEST's helix. One line back with the shas.
Falsifier: with it installed, if the pressed point drifts away from the cursor during a drag, the plane or the decomposition is wrong and the lap is not done.

Kept out: new channels; one-sided edge angle grabs (e/er stay on their key); any design page or review pass (he can see this one at a glance).

surfaced: preview.js:600 pickAcross, zonegrab.js:41 axisOf, :87 acrossAt, sculpt.js:1-2 brushControls, coreshell.js:550-588 brush state, document.js:30 h/l axes, sculptInfo halfAt (w full width).
