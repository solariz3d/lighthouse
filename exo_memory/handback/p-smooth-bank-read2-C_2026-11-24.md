# Second read of O's flowing bank, lap 2 (t180 o-smooth-bank 513cd93..57e4b1c), pane C, 2026-11-24

Seat: pane C (sibling-0845a868). A read only, tier PROVE IT. No edit to t180, and O's worktree was not touched.
BASE: C:\Users\nname\Downloads\t180-fresh 513cd93..57e4b1c (fetched; `origin/o-smooth-bank` = 57e4b1c9…).
O's hand-back (blob 804b2072) was read after my pass over the diff and after probes q1-q5.

## How it was read

- `git diff 513cd93 57e4b1c -- src/ tools/` read in full: extend.js flowWrong :643, flowSolve :657, flowInside :739, flowDependent :786, flowBank :805,
  flowRefusal :817, flowRoom :829, flowBuiltWrong :852, the call :1054-1061, checkBankAsBuilt, and turnby.js `checked`. The head of
  test/core_bank_flow_drawn.test.js was read too.
- The probes ran on `git archive 57e4b1c src tools test package.json` at G:\consonance-scratch\c-flowread2\t, at BelowNormal. q3 runs on `t2`, which is the same
  copy with four logging lines added at flowInside's four exits (`ok:<steps>`, `infeasible`, `cycle`, `max`). Sources and outputs are in
  `p-smooth-bank-read2-C_2026-11-24_evidence/`. To re-run, put a probe beside such a `t/` and run `node qN.js` (q3 also takes arguments, given in its output's first line).
- The three touched test files, with no lock, at BelowNormal: `node --test test/core_bank_flow_drawn.test.js test/core_bank_flow_qp.test.js test/core_bank_flow.test.js`.
  checked: evidence/tests_3files.txt → tests 32, pass 31, fail 0, todo 1 (the straight-road row, failing as registered: 3.819° at 360, 9.583° at 673).
- The lead is a 300 m straight and the flowing piece is 300 m, with per-channel transitions, unless a row says otherwise. Marks are written `at:degrees`, and the first is the
  first target at its transition.

## Findings, worst first

### 1. A list that LAYS can miss its marks on the built road by tens of degrees, with the wrong sign at a mark (extend.js:852 flowBuiltWrong, :643 flowWrong)

The bar on the built road is range and side only: inside {the start, every mark} ± 0.5°, and no wrong sign between two marks of ONE sign. Nothing reads the built
road AT a mark. The document meets every mark (q3: 0 marks missed over 291 laid lists). The road the adapter builds does not.

checked: q5.txt (seed 11 lists, laid ones only, the built road read at each mark):
- **gap 5 m: 88 laid. The worst mark miss per list has a median of 18.63° and a max of 51.18°**. 82 lists miss a mark by > 1°, 73 by > 5°, and 61 by > 10°.
- gap 20 m: 142 laid. Median 13.25°, max 49.78°. 127 lists miss by > 1°, 81 by > 10°.
- Example: `72.2:18.5 110.5:-10.8 131:10.9` lays. At 131 m the road reads **−9.73°** where +10.9° is asked. Another: `85.1:-29.1 120:8.2` reads −25.71° at the 8.2° mark.

checked: q5b.txt, the same lists with a turn (`kh: 0.004`): median 3.80° and max 40.56° at gap 5; median 0.87° and max 42.63° at gap 20. So turning helps,
but it does not cure the miss.

checked: q4.txt. In `90.4:30.9 137.5:12.4 193.2:-42.5 …` the built road runs 10-14° under the document from 120 m on, and crosses zero at about 137.3 m, in
the half-metre before the +12.4° mark. q3 run d reads it **−0.25° the wrong way between 30.9° and 12.4°**. flowWrong reads every 0.5 m from the piece's start, so it
reads 137.0 (still positive) and then 137.5, where the next stretch's signs already apply (12.4 → −42.5, so no side check). The same blind half-metre shows in
q3 run e (`48.1:-2.5 67.6:-14.9`, 0.03° on the wrong side).

This is O's held item (e), the adapter re-rounding straight road, now measured on drawn lists rather than the one S: on the S it was 3.8° and 9.6°; over
drawn lists it is a median of 18.6° and the wrong sign at the mark. **What breaks it:** `72.2:18.5 110.5:-10.8 131:10.9` on the straight lead. Drawn 3 and 4 pass
it because `checkList` asserts range and side on the road, not the marks. inferred: either the marks belong in the built-road bar (refuse, or lay what the adapter
keeps), or flow is offered only where (e) is decided. That call is the keeper's, through (e).

### 2. The room a refusal names is not "at least": a smaller move lays, and a larger one is refused (extend.js:829-838 flowRoom, :824 the message)

`flowRoom` steps the move up by 5 m from 0 until a trial lays, then backs down by the metre while it still lays. That finds the least move only if "lays" is
monotone in the move. It is not.

checked: q2.txt. In `23.2:29.2 40.9:-11.2 70.6:25.2 88:20.6`, marks 2 on are moved by 0..80 m, one metre a step (`#` = lays):
`...........................#.....................................###.....########`
It lays at +27, and again at +65..+67, and from +72 on. The refusal says **"needs at least 94.7 m (it has 29.7 m)"**, which is +65. 56.7 m (+27) lays,
and 98-101 m (+68..+71) are refused. So "at least" is false in both directions.

checked: q1b.txt, seed 11, 160 lists at 5 m (drawn 3's set): 72 refused. 68 name a room, and **all 68 rooms lay** (so drawn 6 holds). **50 of 68** lay with a
smaller move, mostly within the metre the search steps back by. **7 of 68 over-ask by more than 1 m**:
- `90.6:19.1 126.2:-19.6 148.7:8.5 193.5:19.2`: named +58 m, lays at **+0.5**.
- `61.7:11.1 102.1:5.4 111:-19.9 141.1:13.8`: named +10, lays at +1.
- `23.2:29.2 40.9:-11.2 70.6:25.2 88:20.6`: named +65, lays at +27.

**What breaks it:** the first list above. Its refusal tells a hand to move a mark 58 m when half a metre does. In a drag the panel would show that figure.

### 3. The refusal is not the least that would lay: a finer knot grid lays most refused lists with no mark moved (extend.js:657, the knots at the marks only)

flowSolve adds knots only at the marks. 'mark' refusals (two conditions on one free point) and many 'range' ones are short of free points, not short of metres.

checked: q1.txt. Of the 72 refused, **43 lay as drawn with `knotM: 5`** and **53 with `knotM: 2.5`** (extend's own documented option, extend.js:11). They lay
through the same flowWrong and built-road reads, since extend did not throw. Example: `21.2:4.2 40.8:20.8 56.6:-0.7` is refused ("needs +5 m") and lays unmoved
at knotM 5. So for the question "are the named rooms the least that would lay": no. The room is the least on one axis (moving the marks), and the axis that keeps
the marks where the hand put them is not tried. inferred: adding knots between close marks before refusing would cut the 72 to about 19-29. I have not checked
what finer knots do to the S's bytes, the C2 joint or the save size.

### 4. The solver: no failure mode found that lets a bad curve through

checked: q3_a..e.txt, 540 drawn lists across five settings (gap 5, 20 and 1 m; targets to ±30°, ±45° and ±60°; up to 6 marks; one run with a numeric transition):
- **0 untyped throws.** Every refusal is a CoreError BAD_SECOND. Run e also hit flowMarks' own 5 m refusals.
- flowInside ended `ok` 754 times, after **at most 29 steps** (FLOW_GI_MAX is 4000), and `infeasible` 2,030 times (the room search's trials count here too).
  **`cycle` 0 times, `max` 0 times.** So no non-convergence was seen. If it happened, it would return null and be refused as 'range', which fails closed but under the wrong name.
- **Infeasible read as feasible: none found.** Every laid list was read again by me every 0.1 m on the document. Range and side were out 0 times, and 0 marks were missed.
  The core's own final read (flowWrong at 0.5 m, after rounding) also stands behind flowInside.
- Not checked: the reverse, a feasible problem read as infeasible (a 'range' refusal that some curve could meet). qp 3's brute force covers 4-unknown problems, not
  the piece's. Finding 3 shows that more knots meet many of these refusals. That is a different problem, not a solver fault.
- Small: flowInside calls `denseSolve` (tools/piecewise.cjs) on M = N G⁻¹ Nᵀ. If an active set ever went singular, that throws a plain Error again. G-I's add-step
  test (zn > 1e-10·nᵀG⁻¹n, :760) should keep a dependent row out, and none was seen in 2,784 runs. inferred, not shown.

### 5. Cost: a laid list fits a frame; a refused one does not (extend.js:1054 the trial, :829 flowRoom, :852 the built read)

checked: q3 times per `extend` (BelowNormal, nothing else of mine running for a-e):
- **laid: median 5-6 ms, p95 6-9 ms, max 22-28 ms** (this includes the built-road read, A.toPath at 0.5 m).
- **refused: median 30-61 ms, p95 107-400 ms, max 549 ms** (run c). The room search re-lays the whole list through `extend` (and the built road) at
  every trial: up to 300/5 steps up plus the metres back, and that repeats for every stretch when the first gives no room.
- checked: q6.txt. A drag of one mark from 45 to 125 m by 1 m, 81 frames, all refused: **median 35 ms, max 76 ms, 2.85 s in all**. This ran while the test
  files ran beside it, so it is an upper side.
- inferred: at 60 fps (16.7 ms) a drag across a refused region stalls every frame. A drag could ask the solve alone (5 ms) and leave the room search for the
  release. I did not time flowSolve without extend; it is not exported.

### 6. Other: nothing found

- The joint: drawn 7 (refuse by name) and drawn 8 (C2) pass here. The lap-1 finding 3 case is closed.
- No-flow invariance: lap 2 adds nothing on the no-flow path. `checkBankAsBuilt`'s new branch runs only for `bankShape === 'flow'`, and turnby's relay only
  reaches flowRoom through it. inferred from the diff; O's 36/36 unmoved was not repeated.

## Agrees with O

- Lap 1's findings 2 and 3 are closed as O states (q3: 0 untyped throws; drawn 7/8).
- Lap 1's finding 1 is closed **on the document** and for range and side on the built road. Finding 1 above is the part of it that the ruling's bar leaves open on the road.

## Not done

- No mutation harness (it needs the lock, and this is a read). O's 36/36 unmoved and full suite were not repeated.
- The term sweep tool is gone (as in lap 1). This file was checked by eye: no track names and no credentials.

## Corrections to myself

- q3's first sweep flagged the two wrong-way spots as possible grid escapes in the core's own read. q4 shows they are symptoms of finding 1: the road misses the
  mark, and the half-metre grid is only where it shows.
