# D421 Part 1 (the Sculpt build, core): Stretch and Smooth, and the sharp brush's zero-width range (pane C)

Seat: pane C (sibling-0845a868). Tier: prove it. The packet is the chair's of 20:56:01Z, and the plan is
`exo_memory/loop/plan_d421_sculpt_build_2026-10-20.md:29-49`. The design is P's,
`exo_memory/loop/design_d421_sculpt_P_2026-10-20.md`, §3.2, §3.7 and §4.4 rows 5 and 6. The keeper's GO took
all four calls on their defaults.

## 1. What to merge

- worktree `C:\Users\nname\Downloads\t180-wt-c28`, branch **d421b-c**, from **ea54ac3**
- one commit: **5b1c49a** "D421b Part 1 (Sculpt build, core): Stretch and Smooth in src/core/sculpt.js; the sharp
  brush's zero-width range"
- paths: `src/core/sculpt.js` (+193 −11), `test/core_sculpt_stretch.test.js` (new, 213 lines), `CHANGELOG.md`
  (Added and Fixed under [Unreleased]), and `src/core/README.md:12` (the sculpt.js row)

checked: `git -C C:/Users/nname/Downloads/t180-wt-c28 log --oneline -2` → 5b1c49a on ea54ac3; `git diff ea54ac3 --stat` →
4 files changed, 400 insertions(+), 12 deletions(-); `git status --short` → clean.

## 2. The signatures O codes against

- `stretch(doc, which, L1, { keepRate = false })`
  - `which` is a piece index, or a run `{ from, to }`, inclusive. On a closed lap, from > to runs across the start line.
  - returns `{ doc, pieces: [indices changed], factor, lengthChange (m, 4 dp), reclose }`
  - refusals, by name: `NO_PIECE`, `BAD_RUN` (a backwards run on an open track, or a malformed run), `NOT_ROAD` (no road
    in the run), `BAD_LENGTH` (L1 not finite or ≤ 0, a piece under `STRETCH_MIN_M` = 1 m, or a knot span under
    `STRETCH_SPAN_MIN_M` = 0.01 m)
  - L1 equal to the current length returns the **same doc**, `pieces: []`.
  - On a closed lap the gap is left open and `reclose: true` (the plan's per-release re-close). Core never closes.
- `smooth(doc, channel, s0, r, lambda)`
  - returns `{ doc, changed: [{ piece, indices }], radiusUsed, passes, note, reclose }`
  - refusals: `BAD_CHANNEL`; `BAD_BRUSH` (r ≤ 0, a non-finite s0, or λ outside [0, `SMOOTH_MAX` = 64]); `NOT_CUP` (a cup
    channel on a legacy piece, through the brush's own checkReach)
  - λ = 0 returns the same doc, with the note "λ is 0: nothing changed".
  - λ > 1 runs ⌈λ⌉ passes of λ/⌈λ⌉ each.
  - The window is widened to `SMOOTH_SPANS` = 4 knot spans when narrower.
  - `reclose` is true only for kh or kv on a closed lap, when something changed.
- Both are pure: the base is never written, the result is frozen, and untouched pieces are the same objects.
- The exports added: `stretch`, `smooth`, `STRETCH_MIN_M`, `STRETCH_SPAN_MIN_M`, `SMOOTH_MAX`, `SMOOTH_SPANS`.

## 3. Red, then green

- red: `SC/d421b/red.log` → 0 pass / 13 fail, before any code. The leftover row reproduced the packet's refusal word
  for word: `BAD_RANGE: the range must have b > a, got [200, 200]` (r 500 on `longTrack(49)`, s0 5,000 m).
- the cause of the leftover: `brush()`'s piece filter used `<` / `>`, so a piece that only TOUCHES the sharp range at its
  end or start was handed to `refineKnots` with a zero-width range. It is now `<=` / `>=`, with a comment at the filter.
- green: `node --test test/core_sculpt_stretch.test.js` → 15/15 (the 13 rows plus the 2 survivor rows of §5).
  checked: the run just before the second mutant pass (`mutants2.out` written 22:40:34Z) → `ℹ pass 15 ℹ fail 0`.
- `sculpt()`'s body was split into helpers (`widened`, `checkReach`, `isLinked`, `settle`) so that smooth shares them.
  The two optional-channel throws in `checkReach` are kept verbatim; they are mutation anchors M10, M25 and KB1.

## 4. The rows (test/core_sculpt_stretch.test.js)

- the leftover: a sharp hill, r ∈ {500, 1000}, on 10 km: something moves, and checkDoc passes.
- **row 6:** L1 ∈ {260, 140, 200.1234}: checkDoc passes, the piece length is exact, and `lengthChange` = L1 − L0. The lap
  grows by L1 − L0 within 1e-9, and every other piece but i+1 is the same object.
- the bend is kept: the corner's ∫kh within 1e-6, both end values kept. keepRate keeps `kh.slice(2)` and turns
  more than 1.4×. phi, w and r are not scaled.
- **new for S3/S10:** the end slope of kh is kept (L1 300 and 120, within 1e-9), and so is an unlinked start's slope (a
  corner-first lap's piece 0).
- the same length gives the same doc (a piece, and a run of 3 to 600 m); stretched and stretched back gives the same
  length.
- the minimum and the refusals, including a 1 cm-refined piece squeezed (`/BAD_LENGTH.*span/`).
- a closed lap: `reclose` is true and the gap stays over 0.01 m. `close(…, {edited: [i]})` converges. A run across the
  start line works.
- a run with a flight: the flight is the same object, each road piece is scaled by one factor (within 5e-5), and checkDoc
  passes (the landing is still level).
- **row 5, the core half:** after warm-cache drag steps, the result deepEquals a fresh base's, for stretch and for smooth.
  The base is unwritten and the result is frozen.
- smooth:
  - the wobble's roughness falls below 0.6×. Outside the window everything is the same bit for bit, now at
    **r 80 and 150** (new for M6).
  - the outer four are held, now at **r 80 and 250** (new for M1); a joint moves value-then-slope (r 250).
  - **new for M2/M8:** one pass equals the design's rule exactly. This is checked on the wobble, and on a bump before the
    800 m joint, where the point past the joint is the later piece's second point.
  - λ = 0 gives the same doc; roughness is ordered by λ (0.3 > 1 > 4).
  - the refusals.
  - on a closed lap, kh asks for a re-close and phi does not.

## 5. Mutants: applied 19 / caught 19 / NOT APPLIED 0

`node SC/d421b/mutants.js C:/Users/nname/Downloads/t180-wt-c28` → `SC/d421b/mutants2.out`. Every anchor was checked to
occur exactly once (`SC/d421b/anchors.js`). sculpt.js was restored, and `sha256sum -c sculpt.pre.sha` printed OK.

- The first run was **applied 19 / caught 13 / NOT APPLIED 0** (`SC/d421b/mutants.out`). Six survived:
  - S3: the end does not keep its slope;
  - S10: an unlinked start loses its slope rule;
  - M1: the outer four are not held;
  - M2: no falloff;
  - M6: a point whose support leaves the window moves;
  - M8: a joint's point past it is its own value.
- Why they survived: my rows checked end values and the ∫, never the end slopes. My smooth windows (r 150 and 250) put
  the edge points where the bank is flat, so the falloff and the held points made no visible difference there.
- The fix: rows at r 80 (edge weight about 0.5, from probe `SC/d421b/probe.js`), the slope rows, and the one-pass rule
  row. Each new row passed on the real code first; all six mutants are now caught.
- The other mutants:
  - B1: the brush range fix;
  - S1, S2: keepRate and the middle scale;
  - S4: the joint rebuild;
  - S5: knot scaling;
  - S6, S7: the floors;
  - S8: the same doc;
  - S9: reclose;
  - M3: the passes;
  - M4: a negative λ;
  - M5: λ = 0;
  - M7: the re-close channel.

## 6. The harnesses whole, and the suite

All under the lock, through `SC/d421b/run.sh` (`SC/d421b/heavy.log`):

- the suite, `node --test --test-concurrency=4 "test/*.test.js" "app/test/*.test.js"`, on the tree before the two
  survivor rows: **3342 tests, 3321 pass, 1 fail**, 21:18:52Z to 21:49:13Z, with 13 skipped and 7 todo (`grep "^ℹ" heavy.log.suite.out`).
- `test/core_cup_mutation.test.js` **52/52**, 21:49:14Z to 22:16:30Z
- `test/core_xsec_mutation.test.js` **61/61**, 22:16:30Z to 22:24:05Z

The one failure is `app/test/release-frame.test.js` row 4, the timing row: "a number typed into the Turn field … at
most 6.0 ms at the 95th percentile". It measured p95 9.5 / 8.1 ms (`heavy.log.suite.out:3863`). **It is not this
change.** The same file was run alternately on base ea54ac3 (in a throwaway worktree, since removed) and on 5b1c49a,
under the lock, while two other seats' heavy runs held the slots (`SC/d421b/ab.log`):

| run | row 4 p95 (ms) | row 1 |
|---|---|---|
| base1 | 15.7 / 35.1 | pass |
| mine1 | 17.1 / 19.0 | fail |
| base2 | 17.8 / 17.2 | fail |
| mine2 | 15.8 / 15.2 | fail |

Row 4 fails on base at the same p95 as on mine, and row 1 fails on both. So these two rows cannot pass on this machine
while it is loaded like this, change or no change. inferred: they pass on an idle machine. That was not checked; there
was no idle window. The landing pane's full suite should run them when the slots are free.

## 7. Where the build differs from the design's literal text

1. **"Scaled by L0/L1" (§3.2) is the area-keeping factor instead.** The packet's call 1 is "Stretch keeps the bend".
   Plain L0/L1 on every point turned the 200 m → 300 m corner −0.3822 rad where −0.4009 was wanted (4.6% short),
   because the joint holds the first two control points. The middle points 2..n−3 are therefore scaled by the one g that
   keeps ∫kh (and ∫kv). Both ends keep their value **and** slope; holding only the values sent the end slope to about
   14 rad/m² on a corner shrunk to 1 m. Where the middle carries no net turn (an S), g falls back to L0/L1. A one-span
   piece (n < 5) keeps its rates.
2. **The knots are scaled, not re-spaced with `evenKnots(L1)`**, so a stretched piece keeps its knot count, and a value
   channel keeps its shape along the piece. Spans can therefore exceed KNOT_M (20 m) after a big stretch, and fall below
   it after a shrink, down to the 0.01 m floor.
3. **A run's pieces are quantised one by one** (4 dp), so a run's `lengthChange` is L1 − L0 within 3 × 5e-5 m, not
   exactly. A single piece is exact.

## 8. Corrections, mine

- My first smooth-joint row (r 150) put both joints inside the held outer four. That was my geometry, not the code's
  behaviour; r went to 250.
- My first minimum-length setup refined a steep 2 m corner, which broke its joint (refineKnots re-quantises every
  channel, its declared cost). The row moved to the straight, piece 0.
- I first drafted the commit message saying "the full suite passes"; it did not (§6). I corrected it to the two
  harnesses before committing.
- A heredoc mangled a mutant edit, and a `node -e` path came out `C:\c\…`. Both were redone with Write and Edit.
- The g2 run timed out at 600 s waiting on two held lock slots. Its lockrun child, and the stopped `rf` child (pid 27932),
  were killed by pid after their command lines were checked. Another seat's run (pid 2328, `../t180-d421b`) was left alone.

No install was made, AC was not touched, `%APPDATA%` was not touched, and nothing was pushed.
