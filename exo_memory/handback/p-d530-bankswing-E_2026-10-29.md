# D530 part 1, bank the bend: the core (pane E, machine D), 2026-10-29

Tier: prove it. Branch `d530-e` off t180-fresh main `c1396b9`, worktree `C:\Users\nname\Downloads\t180-wt-e530`. Not pushed.

## 1. What landed

t180 `90c0490` "Bank the bend: swingBank lays the bank over a stretch as one swing" (+422 lines in 3 files):
- `src/core/bankswing.js` (new): `swingBank(doc, { s0, s1, peakS, peakDeg, exitDeg = null, shape = 'rounded' }) -> doc`. This is the signature exactly as the plan states it, so A's stub carries over.
- `test/core_bankswing.test.js` (new): 15 rows.
- `test/core_ramp_mutation.test.js`: 16 bankswing mutants (B1–B12, B14–B17) on the harness's own frame. The file list is now one `FILES` const, and core_bankswing.test.js was added to it.

checked: `git -C C:/Users/nname/Downloads/t180-wt-e530 log --oneline c1396b9..d530-e` → `90c0490` only.

## 2. How it works (the file header holds the full story)

- **The fit.** The swing's control points are fitted by least squares on each piece's OWN knots. No knot, length or other channel is touched.
- **The constraints**, solved with the fit (Lagrange multipliers, dense pivoted elimination):
  - phi is held exactly at s0, peakS and s1;
  - every road-road joint a free point reaches is C1 (value and slope);
  - joints inside [s0, s1] are also C2, where both pieces have 6 or more points;
  - a landing keeps its first point at its flight's bank.
- **Free points** are the ones whose support meets (s0, s1). Every other point keeps its value, so a joint the swing does not reach keeps its bytes.
- **After quantising**, each joint's two points are re-set from the other side, on pitflat.js's pattern. checkDoc has the last word (SWING_REFUSED with its cause).
- **Closed laps.** The pieces are unrolled three times round, so a stretch past the seam wraps and the seam joint is held like any other.

## 3. Choices I made that the plan did not fix: please rule

1. **What happens after s1 when the exit bank differs from the road's bank there.** The plan says only "ends at exitDeg".
   - My rule: the road after s1 keeps its own bank shape, moved by the same amount (every downstream joint stays C1), up to the next jump or the open end.
   - On a closed lap with no jump, that move would come all the way round to s0, so it is refused (SWING_REFUSED, naming the exit bank).
   - **Consequence for Part 2:** on a closed lap without a jump, A's "exit bank" field can only be left blank.
   - The alternative, if you want exit banks on laps: shift the whole lap outside the stretch by the same amount, so the swing starts from the shifted bank. It is consistent, but it moves the bank of the entire lap.
2. **The rounded shape rounds its rate over max(10 m, the largest knot span under the half).** It never rounds over more than a quarter of the half.
   - Why: a cubic on 20 m spans cannot turn its rate in 10 m. The measurements are on three 100 m straights, 40° over 100 m each way:
     - rounding over 10 m: roll 0.511 °/m against the ideal's 0.444, and a ripple of 0.031 °/m before the stretch;
     - rounding over 20 m: roll 0.508 against 0.500, and a ripple of 0.012.
   - inferred, from `S/d530/probe2.js` (an RM sweep on an instrumented copy; not in the repo).
3. **Weight on the road either side of the stretch: 10.** The fit's ripple outside [s0, s1] is a change nobody asked for.
   - At weight 1, the worst change before s0 was 0.148° (rounded) and 0.174° (quintic).
   - At 10, it was 0.062° and 0.041°, with the error inside unchanged (0.370° / 0.316°).
   - inferred, from `S/d530/probe5.js` WO sweep.
4. **Two refusals the plan does not list:** BAD_SHAPE (shape not 'rounded'/'quintic', extend's word) and BAD_TARGET (peak or exit not finite).

## 4. The fit is not the ideal swing, in numbers

The ends and the peak are exact. In between, a cubic on the existing knots follows the ideal to within a few tenths of a degree:
- worst error inside the stretch: 0.37° (rounded) / 0.32° (quintic);
- before s0, up to one support back: under 0.1°.

The default A will offer (80 m in, 80 m out) rolls at about the shape's plateau: row "the rounded swing rolls" holds 0.5 ± 0.025 °/m mid-half, with the worst roll within 5% of it. Per the plan's falsifier, the user's own bend is the real test.

## 5. Tests: red, then green

- **Red:** `node --test test/core_bankswing.test.js` before the module existed → `Cannot find module '../src/core/bankswing.js'`, all rows failing.
- **First green attempt, three rows red. Each red was a real bug:**
  1. A held point read from the wrong store. A piece outside the stretch crashed with "Cannot read properties of undefined".
  2. The closed lap was refused as singular. Columns were keyed by piece index, so the three unrolled copies shared columns, and each joint row appeared three times.
  3. A short stretch was refused as singular. Joint rows kept zero weights, which made an all-zero row.
- **Corrections to my own new rows before they first went green** (not plan anchors):
  - "the road after the exit holds 20°" was 0.01° at 260–300 m. It is now 0.5° inside the fit's reach and 1e-6° at 300 m, where no moved point reaches. Measured 19.77° at 260 m.
  - "before the stretch the bank is as it was" was 1e-9 at 20 m. It is now under 0.1° before s0 and 1e-9 at 0 m. A free point's support reaches 4 spans back.
- **Final:** core_bankswing 15/15. checked: `S/d530/core_bankswing.tap` → `# tests 15 # pass 15 # fail 0`.
- **The plan's anchors, all held as written:**
  - 0 / 40 / 0 at 50 / 150 / 250, within 0.001° and 0.01°;
  - C1 at both joints within 1e-9 (rad, rad/m), and C2 within 1e-6 rad/m²;
  - other channels byte-equal; centreline within 1e-9 m;
  - exit 20 ends at 20; a road banked 30° starts from 30;
  - BAD_RANGE (s1 ≤ s0, peak at s0, peak at s1, and more);
  - NOT_ROAD for a jump inside; TOO_SHORT for a 3 m half;
  - closed lap wrapping, with a C1 seam.

## 6. Mutation: the whole harness, under the lock at BelowNormal

The run used `S/d530/run530.sh`, which waits out any timing lock, then gate.js + belownormal.js. gate.log: "no timing session in any slot; taking the lock" at 14:17:13Z; done 14:18:03Z.

- `core_bankswing`: exit 0.
- `core_ramp_mutation`, whole: `# tests 54 # pass 54 # fail 0`. That is the CONTROL, the crash stand-in, and 52 mutants: the 36 that were there plus 16 new.
- **Bankswing mutants: applied 16 / caught 16 / NOT APPLIED 0.**
- **Whole harness: applied 52 / caught 52 / NOT APPLIED 0.**
- checked: `grep -c "^ok .*mutant" S/d530/core_ramp_mutation.tap` → 52; `grep -c "NOT APPLIED"` → 0.
- **Left out as equivalent:** "quantising re-sets no joint from the other side". The fit holds both sides of a joint to about 1e-15, so they round alike, and a quantum is inside checkDoc's tolerance. It was not caught in my pre-check, and a comment in the harness says so.
- **Corrected before the locked run:** B3 (C1 rows dropped from the fit) and B17 (the rounded plateau swapped for the quintic) were NOT CAUGHT by their first patterns. B3 is now aimed at the joint-C2 row. B17 and B15 are aimed at the new roll-rate row, which was added for them.
- **Said plainly:** that pre-check ran OUTSIDE the lock. It was 17 then 16 runs of core_bankswing.test.js alone, one file each, on temp copies, after checking that no timing lock existed.

Afterwards: `node consonance/tools/leftovers.js` → 0 orphan browsers, 0 long-running. No build was made; Cargo.toml was untouched.

## 7. Scans of 90c0490

- The three credential patterns and the forbidden word: 0 each.
- Lap ids (`D5nn`), "librarian", "study", "reference", "private": 0.
- "lap": 11 hits, every one the track's own "closed lap" / "lap distance".
- `perterm.js c1396b9..HEAD`: 13 terms, total 0 (422 added lines).
- No comment names a lap id or the study's source.

## 8. Not done

- **CHANGELOG:** left to A's one [Unreleased] line for the tool, so the record carries one entry, not two.
- **Full suite:** not run (it is the landing pane's job).

SOURCES: plan_d530 (read whole), t180 c1396b9 extend.js/pitflat.js/smoothramps.js/sculpt.js/document.js/jump.js/core_ramp_mutation.test.js (read), S/d530/*.tap, run.log, gate.log, probe1–5.js, precheck.js, perterm.js output, leftovers.js
