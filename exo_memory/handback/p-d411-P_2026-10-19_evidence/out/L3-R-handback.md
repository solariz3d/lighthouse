# Hand-back: D411 L3-R, a side brought from below back to 0 lands at exactly 0

Commit `ab6e581` on `d411-L3-R` (not pushed).

## What changed
- `src/core/extend.js`, the edge clamp loop: the existing `[max(lo, floor), cap]` line is left as it was (KE2-6 anchors it). After it come two new lines:
  - the mirror bound: when a side starts at or below 0 and is asked to go to a value at or below 0 (no target counts as 0, the same rule `lo` uses), every control point is capped at 0.
  - a side asked to 0 gets its last control point set to exactly 0. The existing "ends at 0 ends flat" line then copies that 0 to the second-to-last point, so the end slope is 0.
- `test/core_edgeneg.test.js` row 5c (with its header line): cup 20 at -45.5, then back to `e: 0` over 60 m / 40 m (the reported case: control +8.277, end +0.670, slope 0.585) and 100 m / 50 m (where the raw fit ends a hair *under* 0, at -0.018). It asserts every e ≤ 0, the end value and slope are both exactly 0, and the next piece is not an edge piece.

## Tests
- checked: on the base, row 5c fails (`60/40: e -45.5,-45.5,-21.42519,8.277116,-3.227323,0.670077`); after the fix, `node --test test/core_edgeneg.test.js` gives 10/10. Both runs went through hr.js.
- checked: `node --test test/core_edgeneg.test.js test/core_xsec_mutation.test.js test/core_cup_mutation.test.js test/core_ramp_mutation.test.js test/core_xsec.test.js test/core_edgesplit.test.js test/core_piece.test.js test/core_ramp.test.js` (via hr.js) gives 244 tests, 244 pass, 0 fail. The three mutation harnesses that anchor extend.js still apply every mutant and catch each one.

## Not done
- The full `npm test` did not finish. It was stopped at the 10-minute background limit after 151 passing tests and no failures (checked: /tmp/all.txt). The rest of the suite was not run.
- I did not add a mutant for the new mirror lines. Row 5c is the only check on them.

## Limits
- inferred: the mirror cap also stops a side that starts negative with no target from continuing past 0. It stops at 0, the same way a positive side with no target already stops at 0 on the way down through `lo`.
- inferred: like the existing `lo` clamp, the mirror cap can move the joint's second control point if a negative side arrives near 0 with a rising slope, which would put a small kink at the joint. That case was not tested.
- inferred: the exact-0 end applies to any target of 0, from above too. The fit for a target of 0 approached from above could previously end a hair above 0; it now ends at exactly 0. The suites above stayed green.
