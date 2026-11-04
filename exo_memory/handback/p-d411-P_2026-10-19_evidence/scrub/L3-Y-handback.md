# Hand-back: <worktree> — a side brought back to 0 from below lands at exactly 0

## What changed (commit 67e2626 on <worktree>, not pushed)
- `src/core/extend.js`, the edge clamp loop:
  - If a side starts at or below 0 and is asked to a target at or below 0, its upper bound is now 0 instead of `max(0, cap)`. This mirrors the lower bound, which already let a side ring below 0 only when it was asked below 0.
  - A side asked to a target of 0 now has its last control point set to exactly 0. The existing "ends at 0 → ends flat" line then zeroes the point before it, so the end slope is 0. This also covers a fit that ends just under 0 when coming up from below (−0.209 measured with L 30 / T 20), which the lower bound does not catch.
- `test/core_edgeneg.test.js`, new row 5c: a bowl with `first: { e: -45.5 }`, then a piece taken to e 0 with these length/transition pairs: 60/40 (your exact case: ringing peak +8.277116, end +0.670077, slope 0.585), 50/30, 30/20, 150/60 and 200/40. For each pair it checks: every e/er control point ≤ 0, both sides end at 0 with slope 0, and the next piece is not an edge piece.

## Tests run (all through hr.js)
- `node --test test/core_edgeneg.test.js` on the base code with the new row: 9 pass, 1 fail (row 5c fails on the 60/40 case at the +8.277 control point).
- After the fix, same file: 10 pass, 0 fail.
- `node --test test/core_extend.test.js test/core_piece.test.js test/core_edgesplit.test.js test/core_cup_seam.test.js test/core_tube_open.test.js test/core_cup.test.js`: 132 pass, 0 fail.

## Not done / Limits
- A wider run (`test/core_*.test.js` + roundtrip + corpus) hit its 10-minute background limit and was killed before it reported. Those suites, the app tests and the rest of `test/` have not been run against this change.
- I did not test the "lap refused at the seam" symptom directly. I only checked what causes it: the next piece is plain because the end is exactly 0 with slope 0.
- Pinning the end to 0 applies whenever the target is 0, including when coming down from above. From above, the end was already clamped up to at least 0, so the pin only changes a fit that ends above 0. No test I ran showed such a case.
- A target below 0 reached from further below (for example −45.5 → −10) can still ring between the target and 0. That is unchanged and was outside this task.
