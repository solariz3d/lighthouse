# D411 L3 review: X vs Y

Base `ac7ab4a`. Everything was run through `node review/hr.js -- …`. My probe scripts are in `/tmp/p411` (probe.js, scan.js, scan2.js).

## What both diffs do

The two fixes are nearly the same. Each has three parts:
1. **Mirror cap:** a side that starts at or below 0 and is asked to a value at or below 0 is capped at 0.
2. **Pin:** a side whose target is exactly 0 gets its last control point set to 0.
3. **Flat end:** the existing "ends at 0 → ends flat" line then copies that 0 to the second-to-last point, so the end slope is 0.

They differ in two ways:
- **How the cap is written.** X adds the cap as a separate line *after* the existing clamp line and leaves that line untouched. Y folds the cap into the existing line (`Math.min(below ? 0 : Math.max(0, cap(i)), …)`).
- **A side with no target.** X counts it as a target of 0, the same rule `lo` uses, so a negative side with no target also can't rise past 0. Y's cap needs a target to be given (`tg !== null`).

## Probes (base → X / Y)

| case | base | X | Y |
|---|---|---|---|
| cup 20, e −45.5 → 0, 60/40 (reported) | max +8.277, end +0.670, m 0.585, next piece is an edge piece | ≤0, end 0, m 0, next piece plain | same as X |
| same, 100/50 · 30/20 · 50/30 · 40/10 · 100/10 | ends −0.018 · −0.209 · +0.817 · +6.21 (max +55.4) · −1.08; next piece always an edge piece | all end 0 flat, next piece plain | same as X |
| **from above**: e +40 → 0, 100/50 · 30/20 | ends **+0.0159 · +0.184**, next piece is an edge piece | 0 flat, next piece plain | same as X |
| e −45.5 → 0 with a per-channel map `{e:40}` (rampControl path) | already correct | correct | correct |
| e 0 → −20, 60/40 | max 0 | unchanged | unchanged |
| e −45.5 → −0.5 or −2, short transition (30/10, 40/20, 60/40) | rings to +48, ends **+4.68** (m 5.6); the next piece with no e target runs off to **+130** | ends **0** flat, not at −0.5 / −2 | same as X |
| e −45.5 → −10, 40/10 | ends −5.15 (misses the target by ~5°) | max is now 0, still ends −5.15 | same as X |

The "from above" row matters: the task says "as it does from above", but on the base a short fit from above also misses 0 (it ends at +0.016 or +0.18 and the next piece is still an edge piece). Both pins fix that too, but neither diff tests it. X's hand-back calls this only an inference; Y's says "no test I ran showed such a case".

## Edge cases both miss
- **No test for the from-above pin.** On the base, e +40 → 0 over 100/50 ends +0.0159 with slope 0.0024, and the next piece is an edge piece. A row-5c case for it costs about two lines.
- **Small negative targets reached from below over a short transition** (−0.5, −2 at 30/10, 40/20, 60/40). The cap at 0 now flattens the end at 0 instead of the asked value. That is much better than the base (+4.68, then a runaway to +130), but the asked edge is lost silently: the piece ends plain. This is outside the task as written. It should be filed, not blocked on.
- **Negative target missed by the fit** (−10 at 40/10 ends −5.15). This was already wrong on the base, is unchanged by both, and is outside the task.
- **No mutant for the new lines in either diff.** I checked that row 5c alone fails if either new line (cap or pin) is removed in X. So the lines are covered, but only by that one row.
- **Where X and Y would differ** (a side with no target, starting ≤ 0 and rising, as an old document might carry): I could not produce this through `extend` after either fix. Every negative end I scanned had slope 0. It is theoretical. X's handling (the side stops at 0, like a positive side stops at 0 through `lo`) is the true mirror of the base rule.

## Tests: cut or weakened?
Neither diff deletes or loosens an assertion. Each adds row 5c to `core_edgeneg.test.js`. With the test alone (no fix), row 5c fails on the base: 9/10. With either diff's fix, both row-5c versions pass: 10/10, crossed both ways.

- **X's row 5c:** 2 cases (60/40, 100/50), left side only. The piece is held after a cup.
- **Y's row 5c:** 5 cases (60/40, 50/30, 30/20, 150/60, 200/40), both sides. This is the better test.

I ran the wider suite of 18 core files (edgeneg, edgesplit, extend, piece, piece_mutation, cup, cup_seam, cup_mutation, cup_fixtures, tube_open, tube_from_cup, ramp, ramp_mutation, xsec, xsec_mutation, adapter, doc, knots). 438 tests each:
- **X:** 437 pass, 0 fail, 1 skip. The skip happens on both diffs: the reads/ fixture isn't present here.
- **Y:** 436 pass, **1 fail**, 1 skip. The failure is `core_xsec_mutation.test.js`, mutant **KE2-6**: "NOT APPLIED: the string occurs 0 times in src/core/extend.js". Y rewrote the exact line that mutant edits. Y never ran that file, and its hand-back says nothing about it. X saw this coming and left the line alone on purpose.

Neither author ran the full `npm test`, and neither did I.

## Cost to land
- **X:** can land as is. Recommended additions (about 3 lines in the test): Y's other three length/transition pairs, the `er` checks, and a from-above case (e +40 → 0, 100/50).
- **Y:** a one-line test fix is needed. Point KE2-6's edit string in `test/core_xsec_mutation.test.js` at the new line (`Math.min(below ? 0 : Math.max(0, cap(i)), …`). I tried this: the mutant then applies and is caught by "ringing" (KE2 group 7/7 pass). Y also still lacks a from-above test, and its hand-back should not claim the suites are green.

## Verdict
**Land X.** It is equally correct, mirrors the base `lo` rule all the way (no-target counts as 0), and keeps the line that mutant KE2-6 targets, so the existing suite stays green.
Y as committed breaks an existing mutation test it never ran. Its wider row 5c is worth porting into X's test.
