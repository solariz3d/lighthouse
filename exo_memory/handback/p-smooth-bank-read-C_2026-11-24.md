# Second read of O's flowing bank (t180 o-smooth-bank 513cd93), pane C, 2026-11-24

Seat: pane C (sibling-0845a868). A read only, tier PROVE IT. No edit to t180.
BASE: C:\Users\nname\Downloads\t180-fresh 3b33b38 (origin/main), read against origin/o-smooth-bank 513cd93.
O's hand-back (blob a8ee910e) was read after my first pass over the diff and after the probes below.

## How it was read

- `git diff 3b33b38 513cd93`: 8 files, 603 lines in and 3 out. Read in full: src/core/extend.js (flowMarks :608, flowBank :623, the checks :671-680, the call :851-857) and test/core_bank_flow.test.js. Read in part: the unmoved, mutation and roll_profile files; document.js channelAt/endState; piece.js mirrored/insert/continued.
- Probes ran on a `git archive 513cd93 src tools test` copy at G:\consonance-scratch\c-flowread\t, not on the checkout. Their sources are in `p-smooth-bank-read-C_2026-11-24_evidence/`. To re-run one, put it beside such a `t/` folder and run `node probeN.js`.
- The three touched test files, with no lock, at BelowNormal: `node --test test/core_bank_flow.test.js test/core_bank_flow_unmoved.test.js test/roll_profile.test.js`. Result: tests 30, pass 29, fail 0, todo 1 (the straight-road row, failing as O registered it: 3.819° at 360 and 9.583° at 673). Output: evidence/tests_3files.txt. I did not run the mutation harness; it needs the lock and is O's.

Every probe below lays a 300 m straight lead and then one 300 m flowing piece, unless the row says otherwise. Targets are in degrees here; the probes pass radians.

## Findings, worst first

### 1. A bank list that flowMarks accepts can be laid far past every mark, wrong way first, and nothing refuses it (extend.js:623-663)

checked: probe4.js, then probe7.js for the built road.
- First target −26.5 at 72.9, then marks −25.5 at 123.7, −17.4 at 178.6, 29.6 at 193.3. The document's bank reaches **−93.76° at 157.5 m**, and its roll peaks at 8.52 °/m. The built road carries it too: **−93.77° at track m 457.5**. The road is banked past vertical. checkDoc passed it and the piece was laid.
- First target −30 at 88, then 7 at 102.6. The bank first goes **the wrong way, to +37.02° at 54 m**, on its way from 0 down to −30.
- First target 20.6 at 48.3, then −4.1 at 91.6, 0.6 at 115, −12.5 at 132.7. The bank dives to **−52.13° at 76.5 m**.

Rates over random valid lists. probe5.js draws 400 lists for each spacing: a transition at 20-100 m, then 1-3 marks with targets within ±30°. "Past" means past the largest |mark| (O's own bar in flow 5 is 0.5°).

| marks at least … apart | singular (finding 2) | past by > 2° | past by > 10° | wrong sign between two same-sign marks |
|---|---|---|---|---|
| 5 m (flowMarks' own floor) | 84 | 71 | 50 | 23 |
| 20 m | 3 | 25 | 9 | 8 |
| 40 m | 0 | 15 | 0 | 0 |
| 60 m | 0 | 19 | 1 | 0 |

inferred: the cause is the hold at the last mark (:630). Every control point whose support reaches past the anchor is fixed to the last target, and the last three are always fixed. When the last mark comes within about one or two knot spans of the mark before it, only one or two free points are left to make the whole change. They are pushed to large values, and the least-bending solve passes that bend back up the piece. The peak-at-rest rows (:648) add two constraints at a mark that gains only one point. Not traced point by point beyond probe3 (below).

**What breaks it:** any of the three lists above. **What is missing:** a check, before laying, that the solved bank stays inside the marks' range (flow 5's bar, applied to every piece and not only the banked S), with a named refusal or a longer hold. Also, the anchor's span count should be checked against the constraints.

### 2. A valid list can crash the solve with a plain Error, not a refusal by name (extend.js:661; tools/piecewise.cjs:232)

checked: probe1/probe4 runs (logs in this file); probe5.js counts.
- First target −20 at 80, then a mark of 20 at 100 (round numbers, one knot span apart): `Error: denseSolve: singular constraint system`. `e.code` is undefined.
- First target 25.4 at 58.4, then 10.4 at 67: the same error.
- After fixture F5, with `transition: 30` given as one number and a mark of 20 at 60: the same error (probe6.js).
- 84 of 400 random lists with marks at least 5 m apart; 3 of 400 at least 20 m apart (table above).

checked: probe3 (evidence/probe3.js) prints the free points against the rows. For 58.4 → 67, the knots are …, 51.1, 58.4, 67, 80 and the anchor is 67. The free points are 2-8. The mark at 58.4 has both its value row and its peak-rest row on points 8-11, and point 8 is the only free one. That gives two equations on one unknown. The case 80.5 / 99.5 / 120.5 has three rows on two free points.

flowMarks (:608-621) checks order, the 5 m gap and the length, but nothing about what the solve can carry. So the refusal that should be BAD_SECOND by name arrives as an untyped throw. The panel does not offer flow yet, so no user can reach this now. It will be the first thing the panel hits.

### 3. A joint silently loses C2 when the transition is one number (extend.js:650, the `live` filter)

checked: probe6.js. On fixture F5, which ends with roll acceleration −7.49e-5 rad/m²:
- `transition: { phi: 15 }`: joint dd2 2.0e-10 (C2, good);
- `transition: 15` (one number, so no short-ramp knots are added, :734/:759): joint **dd2 −6.8e-3**, about 90 times the head's own acceleration, and no error.

inferred: with a numeric transition, the only knot added is at the mark (15). The anchor is 15, so every point from P2 on is fixed, and the start's curvature row (:644) has no free point. `live` (:650) drops it without a word, and the same filter would drop any mark row that loses all its free points. O's C2 fix (flow 4b) holds only when the transition is given per channel. **What breaks it:** F5, then `{ length: 300, targets: { phi: 10° }, transition: 15, bankShape: 'flow' }`. A dropped row should be a refusal, not a skip.

### 4. The end conditions at the other joints: nothing found, with two limits

checked: probe6.js.
- **First piece of a track** (empty doc, `first.phi` 5°, marks −20@80, −27@145, 0@200): the start is 5.000°, d1 0, d2 0. Correct.
- **After a tube** (a tube piece, then a flowing piece with t 120): joint dv 0, dd1 0, dd2 1.3e-18. Nothing tube-specific touches phi.
- **After a flight**: flow 4c covers it, and a0 = 0 matches endState's m = 0 (document.js afterFlight). Agrees.
- **Mirror**: piece.js `mirrored` negates the raw phi array, so endState and channelAt read the same sign, and a flowing piece after a mirrored one meets it. flow 6 checks a mirrored flowing run inserted on a level lead.
  - Limit: a flowing run inserted after a head that ends ROLLING (F5) is re-joined by piece.js `continued`, which resets P0 and P1 only. The joint is C1 (probe6: dd2 1.8e-4 against the head's −7.49e-5). That is insert's documented contract (piece.js:21), not new in this diff. The CHANGELOG and MAP say "C2" without that limit.
- **The next piece after a flowing piece**: the flowing piece ends at rest (the last three points fixed), so the next piece starts clean. Agrees with flow 4.
- Small: the LAST mark is not a constraint row (:645 `slice(0, -1)`). Its value comes from the hold at the nearest knot, which may be up to FLOW_SNAP_M (1 m) after it. So the bank can reach its last mark up to 1 m late. Probe E (mark at 139.2, knot at 140) read 10.000° for 10 asked, so I found no case that shows it. Unmeasured beyond that.

### 5. A document without flow: no path found that changes it

checked: the diff. The only lines on the no-flow path are the bankShape check (adds 'flow' to the accepted list) and the `through` checks (:672-676), which throw only when `through` is given. `git grep` at 513cd93 finds no caller in src/ or app/ that passes `through` (searched `\bthrough\b\s*[:=,}]|opts\.through|\.through\b`), and nothing in the document records flow (serialize is unchanged). `require('../../tools/piecewise.cjs')` was already required by document.js:18, so no new module load. The unmoved rows passed here: 4/4 sha256 equal to O's base values read on 3b33b38. flow 10 passed too. I did not re-run O's 36/36 export comparison.

### 6. What the tests assert: mostly the document; the built road in four rows

- On the **built road** (RP.builtBank, the adapter's roll): flow 2 (no halt), flow 3 (rate bars), built 1 (crossing within 0.1°), and built 1 straight, which is a todo that fails by 3.82° / 9.58°.
- On the **document** only: flow 1 (the marks are passed), 4/4b/4c (joints), 5 (overshoot), 6 (mirror), 7 (save bytes), 9 (halts), 11 (peak), 12 (acceleration).
- Every flowing row lays ONE mark list, the banked S, plus F5 with one mark. No row draws lists, so findings 1-3 pass the suite: 29/0 + 1 todo, with the −93.77° bank available to any caller. The overshoot bar (flow 5) and the "marks passed" bar (flow 1) are the right outcomes. They are asserted on one list only.
- flow 5's no-overshoot bar is on the document. On straights the built road differs from it (the todo), so a flowing bank's overshoot on the built road is unasserted.

## Agrees with O

- The C1 defect O found and fixed (flow 4b) is fixed when the transition is given per channel. Finding 3 is the case it misses.
- The refusals O lists in flow 8 all fire by their codes, as read.

## Not done

- No mutation run (the lock is O's, and this lap is a read).
- The O hand-back's 36/36 export comparison was not repeated.
- The term sweep tool from earlier laps (scratch d555/sweep.js) is gone with its scratch folder. This file was written with no track names and no credentials, checked by eye.

## Corrections to myself

- My first guess for finding 2 was rows dropped near the start (my case A: transition 10, mark 15). It passed, because a per-channel short transition adds knots. The singular cases are at the hold end instead (probe3).
- In probe1, mark E read exactly 10.000°, so the 1 m late last mark (finding 4) stays unshown, not found.
