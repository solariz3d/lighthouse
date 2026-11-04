# T-180: remove the water sim from the builder. Librarian, on D, 2026-10-04 22:0x. Lap D238.

The keeper, 22:01: "can you remove the water sim feature?"

## Checked (main fa5fd937, worktree `lib-mirror-build`)
- **The app side:**
  - `app/core/coreshell.js` (`W = require('../../src/core/water.js')` at :32, `shell.pour`, `shell.clearWater`, `state.water`, and `water: null`
    on every edit);
  - `app/core/panel.js` (the WATER section: on, km/h, streams; the 120 ms pour debounce at :213);
  - `app/index.html`;
  - `app/preview/index.js`, `preview.js` and `renderer.js` (the stream overlay).
- **The export never uses it:** nothing under `src/export` or `src/validate` requires `src/core/water.js` (grep). So removing it can't change an
  export (the fixtures are the guard).
- `src/core/water.js` is also read by tests of OTHER features, as a reader of the road profile: `test/core_chord.test.js` row 4,
  `test/core_cup_readers.test.js`, `test/validate_xsec.test.js` S2 (iv). Its own suites are `test/core_water*.test.js`, and the mutation
  harnesses have water rows.

## The lap (A, FEEL tier for the app; targeted tests + the anchored app harnesses, whose anchors may move + the keeper's hands)
1. **Remove the water from the BUILDER entirely:** the WATER panel section, `shell.pour` / `clearWater` / `state.water` and the `water: null`
   resets, the debounce, the stream overlay in the preview and renderer, and the `require` in coreshell. Nothing about water shows anywhere
   in the app.
2. **Keep `src/core/water.js` and its own tests where they are, dormant (the librarian's default):** other features' tests read profiles
   through it, the module is self-contained, and keeping it makes the removal one revert away if the keeper ever wants it back.
   Deleting the module too is the keeper's call. Say in the hand-back what deleting it would take (the files and test rows).
3. **Tests:** the app's water tests are removed WITH the feature, by name in the hand-back (removing a feature's own tests is not weakening
   them). Any harness mutant whose anchor was a water line is retired by name. A new test asserts the panel has no water section and the
   shell no pour. The fixtures read 0 of 9 differ.
- Then B's quick look; land; install.

NEXT: chair dispatch D238 to A when this plan is read
