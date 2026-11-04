# p-levelsnap-E · D271 "Level" and "To floor" · pane E, on D, 2026-10-08 · BAR MET

**Commit `1e258d1`** on t180 main `0014555`, branch `d271-levelsnap`, worktree `C:/Users/nname/Desktop/worktrees/e-level-wt`.
- 7 files, +239/−1. Not pushed.
- **Shared files named:**
  - `app/core/coreshell.js`: +5, two actions after `extend`;
  - `app/core/panel.js`: +7, the two buttons after Straight, in the same actions row;
  - `app/test/core-readout-display.test.js`: one row, before D242's Straight row.
- `handles.js` is not touched (A's D270).

**The track:** a COPY of `tracks/eq-FIRST TRACK.t180track` (sha256 `739b5653…`, read only, his file never written). The head is at s 7300, pitch +3.21872°, height −187.3163 m. Scratch `level/probe.js` → `probe3.txt`.

## What it does (`src/core/level.js`)
- **The design point the plan's item 1 did not register:** a single climb value cannot end a piece STRAIGHT and level. The climb is a rate, so any non-zero value ends the piece still curving.
  - So Level solves the piece's climb SHAPE.
  - The piece is Extend's own with climb 0 (its easing, the fields' other values as typed). Then ONLY its kv control points are corrected by close.js's least-norm step (ref 04 §3), with the joint's first two held (C1 from the head) and the last two at 0 (it ends with climb rate 0, flat).
  - The end pitch is linear in them on the adapter's trapezoid rule, so Level is exact in one step.
  - The fields therefore show the piece as placed (climb ending at 0); the shape is in the piece, so the handles and brushes work on it like any other.
- **To floor** adds height 0 (inferred, as registered: the start's ground). It runs Gauss–Newton, with the residual read on `toPath` (offsets included) and the quantised document measured, as close.js does.
- **The limit for the refusal, sourced:** the validator's own D256 open-track check (`leaves-surface`: g·cos p + v²·kv ≥ 0 on the centreline at vmax 970 km/h, `src/validate/limits.js`). So To floor never places a piece the export would red.
  - Too short is `FLOOR_TOO_SHORT` with `needM`: the shortest whole-metre length, searched on the model, then CONFIRMED on the adapter's path a metre at a time.
  - Never clamped.
- **Tolerances:** pitch 1e-6 rad. Height 5 mm, not tighter, because the climb is stored to 1e-9 rad/m, and over several km that rounding alone moves the end height by millimetres (measured: an 8 km solution stalled at 4 mm under a 1 mm tolerance). The bar is 1 cm.
- A closed loop is refused by name (`CLOSED`).

## The registered bar, on the FIRST TRACK copy
| registered | result |
|---|---|
| Level on a 500 m head piece: \|end pitch\| ≤ 0.01° | **−0.00001°**, no red in the piece (`V.validate` fullSpeed); 285 ms |
| To floor on a long enough piece: \|pitch\| ≤ 0.01°, \|y\| ≤ 1 cm | at **2,503 m**: pitch **0.00000°**, height **0.0000 m**, no red in the piece |
| too short: the refusal names a length that then succeeds | 500 m → **"FLOOR_TOO_SHORT: a 500 m piece would lift the car off its crest at 970 km/h: it needs at least 2503 m"**; 2,503 m succeeds; **2,501 m is refused** (the named length is the shortest, to the metre or two); the refusal takes ~1.0 s |

- **Also:** Straight 200 m then Level 500 m ends at −0.00001°.
- **For the keeper (numbers, not a ruling):** reaching the floor from his head (+3.2°, 187 m below) needs at least 2.5 km. The crest at 970 km/h is what limits it.
  - A steeper head needs far more: my first synthetic track at +13° needed more than 4 km (the crest still lifted the car off at 4 km).
  - If 2.5 km reads as "broken" to him, the lever is the speed the crest is judged at (970, the export's), not the solver.

## Tests (all under the lock, serial shim)
- **`test/core_level.test.js`, 5 rows**, on a synthetic tilted track (+3.5°, above the floor), not his file:
  1. Level ends straight and level, joined C1, every other channel Extend's own;
  2. To floor ends level at height 0 on the adapter's path, and the validator finds no red in the piece;
  3. too short is refused with a length that works, and 2 m shorter is refused;
  4. saved text reads back to the same climb points, still level;
  5. closed is refused.
- **`app/test/core-readout-display.test.js`, the D271 row:** the real buttons. Level, then Undo is one step; To floor at 100 m shows the length, typing it places the piece at pitch ≤ 0.01° and height ≤ 1 cm; Undo is one step.
- **Red first on `0014555`:** the core file fails (no `level.js`) and the panel row fails (no Level button), so 2 fail of 39. `level/base.tap` sha256 `81a74010…`. On the branch: 43/43 (`new.tap` `c755f7c2…`).
  - **My own fixes on the way:**
    - the closed check came after `headOf` built the path (it now comes first);
    - my first synthetic track was too steep for any length under the crest limit;
    - the 1 mm height tolerance was below the stored precision.
- **Targeted:** every `test/core_*` but the harnesses, plus app `core-xsec`, core-shell, core-readout-display, core-pieces-ui, core-eqonly, core-sculpt, core-close-preview, core-widthlike, preview-async, cheap-ghost and every app test that loads panel.js or coreshell.js. 53 files: **786 tests, 784 pass, 0 fail, 2 old skips**. `level/build.tap` sha256 `326fe5e7…`.
- **Not run:** the full suite and the core harnesses (the librarian's at landing), and the real window.

Scratch base worktree `level/base-wt` (detached `0014555`) is mine to remove.

## M12 + anchor sweep (the chair's 05:0x packet, on 0.3.3 = t180 6a799cb)
**Commit `a6cee64`** (test-only) on `6a799cb`, branch `anchors-sweep`, worktree `C:/Users/nname/Desktop/worktrees/e-anchors-wt`. 2 files, +6/−2. Not pushed. Meanings unchanged; no row touched.

**`test/core_cup_mutation` ONCE: 51 tests, 51 pass, 0 fail** (M12 "applied, and caught"; scratch `anchors/cup.tap` sha256 `dd7c0bb4…`, 98 s).

**The sweep:**
- **How it ran:** apply-only, no mutant run (scratch `anchors/sweep.js`), over all 15 `*mutation.test.js` files on `6a799cb`.
  - Each harness's top lines, up to the end of its mutant array, are evaluated in a VM sandbox (real path/fs/os for its ROOT and SRC constants; node:test and child_process stubbed, so no test runs).
  - Then every anchor is counted in its target file, raw and with CRLF read as LF.
- **The result (≠ 1 occurrence is a finding):**

| harness | mutant | finding | action |
|---|---|---|---|
| test/core_cup_mutation | **M12 (K3-2)** c reset after a flight | 0: the anchor left document.js with D258 (`1e76d35`) | **re-anchored** to `afterFlight` (`…, phi: { v: F.bank, m: 0 } });`, which occurs once), the same meaning, as KE4-2 in `0014555`. Caught by row 3 |
| test/core_piece_mutation | **P29** a flight with no gap is accepted | 0: `if (!(P.gap > 0)) bad(` left piece.js with D258 (a saved flight is a landing pose since) | **re-anchored** to the check that now refuses a flight that goes nowhere: `document.js` `if (!(d >= FLIGHT_MIN_M)) throw new CoreError('FLIGHT_TOO_SHORT',` (once). Row 8 asks for FLIGHT_TOO_SHORT by name. **Caught** (`anchors/piece.tap`, mutant 28) |
| app/test/mutation | A11 the renderer never deletes a stale buffer | 2 occurrences | **not stale.** The harness checks `includes` and replaces the FIRST, as it always has (99/99 before). Left alone |
| app/test/mutation | A21, A22 (prove_render.js) and T2 (texmaker) | my sweep's resolver missed their roots | checked by hand: 1 occurrence each (`scripts/prove_render.js` via `root: 'scripts'`; `app/texmaker/index.js`). Not stale |

- Every other mutant of the 15 harnesses occurs exactly once in its target (563 mutants in all, summed from the sweep's per-harness counts, `anchors/sweep2.txt`).

**NOT anchors, found on the way, reported and not changed:**
- `test/core_piece_mutation` (run once to confirm P29): **65/67**. **P49** ("a jump before the road does not zero the turn, climb and offsets") and **P51** ("the road after a leading jump is not what carries the head on") are applied but NOT CAUGHT by "row 6" ("2 tests ran … and all passed").
- My commit changes only P29's edit, and each mutant runs on its own copy, so they survive on `6a799cb` the same.
- inferred: since D258 the document's own `afterFlight` sets a landing's state when the piece is placed, so `piece.js`'s own adjustment for a leading jump may now be redundant (equivalent mutants), or row 6 lost its reach. That needs a ruling, or a lap that proves which. It's outside this packet (stale anchors only).
- `anchors/piece.tap` sha256 `5d47a668…`, 411 s.

## P49/P51 (the librarian's ruling: prove it, don't infer it)
**Not a bug in piece.js.** P49 and P51 survive because the code they change is never run: they are EQUIVALENT, shown. The branch is dead code, the code owner's call to remove.

**Commit `85fafff`** (test-only) on `a6cee64`, branch `p49-p51`, worktree `C:/Users/nname/Desktop/worktrees/e-p49-wt`. 2 files, +28/−2. Not pushed.

**`test/core_piece_mutation` ONCE: 65 tests, 65 pass, 0 fail.** That is the control plus 64 mutants; P49 and P51 are marked EQUIVALENT and not run, as P9/P13 were. Scratch `p49/harness.tap` sha256 `48621a71…`, 360 s.

**Why the code never runs:**
- `insert()` calls `continued()` (where P49 and P51 live) only when the as-saved run throws `JOINT`. For a run that starts with a jump it cannot:
  - `checkPiece` has already judged the run's own joints on the same arrays;
  - a flight has no joint with the head;
  - a landing that does not start level throws `LANDING`;
  - a flight right after a flight throws `JUMP_AFTER_JUMP`.
- So `continued()` is only ever entered with runs that start with a road, where `after` is false and `i0` is 0, which is exactly P51's edit. P49 changes only the `after` branch.
- **And that is the intended behaviour, not a gap.** Row 6 already states it (D258: "the landing keeps its own saved width … it is not joined to the take-off").

**The evidence (measured; scratch `p49/prove.js` → `prove.txt` sha256 `cc7acb2a…`):**
- **Method:** temp copies of `a6cee64`'s src/, tools/, app/ and the test file, as the harness makes them. Each copy gets one edit: none, P49, P51, or a **SENTINEL** that throws if `continued()` is ever entered with a leading jump.

| copy | row 6c's insert after a curving, climbing, banked head (sha256 of the document) | mirrored | rows 6, 6b, 6c, 7 | sentinel |
|---|---|---|---|---|
| base | `2e36ecbd…` | `4411e85a…` | 4/4 | — |
| P49 | `2e36ecbd…` | `4411e85a…` | 4/4 | — |
| P51 | `2e36ecbd…` | `4411e85a…` | 4/4 | — |
| SENTINEL | `2e36ecbd…` | `4411e85a…` | 4/4 | **never hit** |

- Row 7 runs every kind of saved run (a jump-led one included) against every kind of head. That is why the never-hit sentinel covers more than the one case.

**The row the chair asked for:** the chair's case (a jump-led run after a curving AND climbing head) was ALREADY in the file as "row 6b", written earlier, and P49/P51 survived it. That is consistent with the above.
- My new **row 6c** adds the banked head and the mirror, and pins the result **byte for byte to the run as saved**: the landing starts with turn, climb and offsets at 0 and at its flight's bank.
- Row 6c also pins that a landing damaged to start turning is refused by name (`LANDING`).
- It stays: it holds the as-saved behaviour, though no mutant of `continued()` can fail it.

**My own fixes on the way:**
- my first damaged file broke a joint inside the run, so `parse` refused it as `JOINT` (shift every road instead, which keeps the joint);
- my first row name collided with the existing "row 6b";
- a `sed` dropped CRLF, which I restored.
