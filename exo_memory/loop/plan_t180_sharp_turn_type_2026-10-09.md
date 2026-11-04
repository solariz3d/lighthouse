# T-180: a SHARP turn type, Thunderhead's 90°, beside today's broad curve. Librarian, on D, 2026-10-09 20:4x. Lap D282.

The keeper, 18:55: "i also want to be able to make thunderhead 90 degrees too", while "THERE is nothign wrong with the 90 degree curves that can be made
now". The measured basis is `loop/sharp_turns_measure_B_2026-10-09.md` §3 (the knots table and the limits table). The keeper at 20:43, "only 1 shell
working": this lap starts now on top of E's Turn by (`bf0f333`, branch `d280-turnby`), not after its install.

## The design (from B §3, no new research needed)
A new turn option, **Sharp**, beside the existing turn. It builds a corner from three parts:
1. a short ramp `tr` up to rate 1/R;
2. a hold at radius R for exactly the typed angle;
3. a ramp back to rate 0, so the corner exits dead straight.

The fields are the angle, the radius R, and the ramp (default 4 m). Its pieces carry their own knot spacing, `knotM` ≤ the ramp (default 2 m; `extend.js:27`
already takes `knotM`). With the ramp at 4 m and `knotM` at 2 m, B measured −89.99° at R 22 / width 24 and at R 24.25 / width 45, a 1.9 m entry and a 2 m exit, 0.000° over the last
50 m, and no red or amber. The broad curve and the "at start" ease (`panel.js:47`) are untouched.

**The minimum radius rule:** the geometry fails, not a speed cap (B §2 L5: the fold 1 − κ·o ≤ 0 and the stacked-within-2m check). So Sharp refuses
a radius below the smallest one that stays green for the road's width and cross-section. The refusal says that radius ("tightest at this width: 15.0 m").
Measured anchors: bowl, width 45: R ≥ 24.25 m; width 24: R ≥ 15 m (13 amber, ≤ 11 fold).

## The lap: two parts, in parallel
**Part 1 (E, who wrote Turn by): build Sharp.**
Work on a branch from `bf0f333`, with the field, the core call, the minimum-radius refusal and Undo in one step.

**Part 2 (B, who measured it): register the bar BEFORE E's code lands, and check it independently.**
Write the rows below into a registration file, then run them with B's own harness (`d280/knots.js`) against E's branch when it is ready, without
reading E's tests first.

**The bar (each row a test):**
- Sharp 90°, R 22, width 24, ramp 4: |heading − 90°| ≤ 0.05°; heading change over the last 50 m of a following Straight ≤ 0.01°; entry and exit
  10–90% each ≤ 8 m (Thunderhead's 0–8 m); no red, no amber at 970 km/h.
- The same at R 24.25, width 45.
- Angles 45°, 90°, 135° and 180° at R 22, width 24: each within 0.05° and exiting straight.
- Minimum radius: at width 45 (bowl), R 24.0 is refused, and the message names the tightest radius, within 0.25 m of 24.25. At width 24,
  R 14 is refused (within 0.5 m of 15). The refusal leaves the track unchanged.
- Today's curve unchanged: every existing saved track rebuilds identical to its build on `bf0f333` (shape and position), and the full suite stays
  green.
- Save, close and reopen a track with a Sharp corner: identical geometry, and Undo still steps back over it (D272).
- Exported to AC: the corner's road has no ray gaps (the D279 check) and the track loads in CM (`cmcheck.js`).

**Checks at landing:** this is geometry, so run the full suite and the core harnesses (core, core_cup, app mutation), as for 0.3.4.

NEXT: chair dispatch D282 part 1 to E and part 2 to B when this plan is read
