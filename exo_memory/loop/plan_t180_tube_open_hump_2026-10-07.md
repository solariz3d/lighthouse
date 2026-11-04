# T-180: opening a full tube back to a flat road makes a hump (and a pinched fold at the top). Librarian, on D, 2026-10-07 10:2x. Lap D268.

The keeper, 10:20, with two screenshots (`C:\Users\nname\Pictures\Screenshots\there is a hump when making the tube back into a regular track undoing the tube sweep to 0.png`
and `…\second pic.png`): "when you make the full 360 degree tube, but then try to transition back into a flatter track, there is this weird hump jum[p]".

## What the screenshots show (his unsaved track; the readout as shown)
- 3 pieces, 2,300 m, open. The piece being extended: length 254.1 m, **tube from 360.0° → 0.0°, cup from 180.0° → 0.0°**, edge start 0.64 → 0.64,
  width 44 m, turn/climb/bank 0. The piece before it ends at 300.0 m, in a full tube.
- Side view (pic 1): the floor of the opening piece swells up into a ridge across the middle of the piece, then settles flat at the end.
- Looking down the tube (pic 2): as the tube opens, the top of the section folds into two lobes with a sharp spike between them; the road itself is
  pushed up inside.
- Nothing about tube OPENING is registered in `loop/cross_section_seal_registration_2026-10-03.md` (grep for opens/back/360 → 0 finds nothing). The seal
  covered closing a road into a tube.

## The lap (E, who wrote the cross-section seal and the tube; GEOMETRY tier: full checks + the xsec harness at landing)
1. **Reproduce headless** on a rebuilt copy: a straight, then the full tube, then 254.1 m with tube 360 → 0 and cup 180 → 0 (edge start 0.64, width 44).
   His track is unsaved; `track-backups/eq-unsaved.2026-10-06_150107.t180track` is older and may not have it. Rebuild it from the readout above.
2. **Find the cause** (inferred candidates, to be checked, not assumed): the width is held as the distance ROUND, so mid-opening a partly-open section
   with a 44 m arc length has a different radius or centre than the closed tube or the flat road. The section may be anchored at its edges instead of
   its centre, so the centre (u = 0) leaves the path. Or tube and cup ease on different curves, so for part of the piece the cup bends the floor up
   while the tube is still mostly closed.
3. **Registered before the fix:** on that shape,
   - the road's centre (u = 0) stays on the path at every station (≤ 1 cm);
   - no point of the floor (|u| ≤ the flat road's half-width at the end) rises above the path by more than it does at either end of the piece;
   - the section never folds over itself (the export's self-check reports no self-intersection in the piece).
   The closed-tube and flat-road ends are byte-identical to today's (they already export clean).
- Rows red first. Full suite + `core-xsec-mutation` and `test/core_xsec_mutation` at landing (geometry). Then install, and 0.3.2 with D267.

NEXT: chair dispatch D268 to E when this plan is read

## Amendment, 10:2x: the keeper saved it
The keeper, 10:22: "i saved track called hump bug". `tracks/eq-HUMP BUG.t180track` (4,566 B, sha256 `8dc7b717…`), copied read-only to the librarian's
scratch `humpbug/hump.t180track`. 3 pieces, open: 1000 m and 1000 m (the tube, w 45), then 300 m. **The opening piece is NOT in the file**: it was the
ghost. Reproduce by extending at the head with the screenshot's values: length 254.1, tube sweep 0, cup 0 (from 360 / 180), turn 0 and climb 0
with "at start" ticked, bank 0, width 44, edge 0, edge start 0.64. Work on a COPY; never write his file.
The keeper, 10:22, a third screenshot (side view, the file saved as HUMP BUG, width field 30): the hump is there at width 30 too. The opening ghost rises well above the path along most of its 254 m and comes down only at the far end. So width 44 is not needed to reproduce it; check both 30 and 44.

## Ruling on E's hand-back (librarian, 10:5x)
- **Bar item 2 as worded was WRONG (mine), and E's form replaces it.** Re-derived independently: a fixed-width circular arc's rise above its centre,
  (w/θ)(1 − cos θ/2), peaks at 0.3623·w near 267°, against a closed ceiling of w/π = 0.3183·w. So it overshoots by 0.0440·w = 1.94 m at w 44 (E
  measured 1.93). No circular opening of fixed width can meet the literal item. The bar is now "the walls rise no more than their own sweep's arc
  must" (E's row 3). A different opening shape stays the keeper's call, not owed.
- **Bar item 4 as worded was wrong too (mine): "byte-identical" holds for the cross-sections, not the position.** The closed-tube end moving up by hl IS
  the fix: the floor goes back onto the drawn curve.
- **The saved-track shift is accepted.** All-tube tracks move up rigidly by hl (6.366 m T-180 TUBE OVAL; 7.162 m TUBE V2 and FINAL TEST). Non-tube tracks
  move 0 samples, and the overlap answer is identical on all 8. Mixed tracks lose the false dips. AC folders already installed don't change until they
  are re-exported. The keeper is told plainly.
- Landing: on top of A's a47d40b chain (D267 + D269), then the 0.3.2 bump, the full suite and both xsec harnesses, install, push, release.

## Landing hold (librarian, 11:4x): two heartline mutants now survive
On ed97512 (0.3.2 = D267 + D269 + D268 + the bump): the full suite is 2022 tests, 0 fail. Harnesses: core-close 37/37, core 60/60, app core-xsec 31/31,
geom 37/37, and **test/core_xsec_mutation 57/60** (scratchpad `mut032-core_xsec_mutation.test.js.tap`):
- **KS2-2** (`path.js`: the heartline a constant per segment) is NOT CAUGHT by "S2 (i, ii)".
- **KS2-4** (`adapter.js`: `HEARTLINE_FROM = 180`) is NOT CAUGHT by "X1 and T2".
  Both are about how the heartline eases, and E's fix makes an unrolled tube's centre independent of hl (x + hl·(U0 − U)). So these two may now be
  EQUIVALENT where the tube is unrolled, or the rows lost their reach. **E: show each is equivalent (as P9/P13 were), or add or re-anchor a row that
  kills it (the rolled spiral, row 5's kind, is where hl still shows).**
- **KE4-2** NOT APPLIED: its anchor string left `src/core/document.js` in D258 (`1e76d35`, the free jump; 0 occurrences at e17a73e and e850c45). It
  predates 0.3.2. Re-anchor it or retire it with a reason, in the same commit.
Then: re-run test/core_xsec_mutation, and 0.3.2 publishes.
