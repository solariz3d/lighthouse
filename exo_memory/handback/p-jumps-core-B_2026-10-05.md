# D243 jumps, core half: non-author look at E's 6d2ce06, pane B

**Packet:** the chair's look, EXPORT/GEOMETRY tier, items 1–4. E's hand-back: `handback/p-jumps-core-E_2026-10-05.md`.
- **Tree:** a fresh worktree `C:\Users\nname\Desktop\worktrees\b-jumps-wt` at `6d2ce06` (0 links), read only. Base for the control: `b-jbase-wt` at `12ab427`.
- Every run was under the heavy-run lock, one at a time, `--test-concurrency=1`.
- Nothing committed, nothing pushed, no AC.
- Scratchpad `jumps/`: `battack.js` and `battack.out`, `bctl.js`, `steps.json`, `run.out`.

## Verdict: GREEN, land 6d2ce06 after the D240 UI + keys landing. No defect found. Two notes, neither blocking

## 1. The position Jacobian across a jump: J8's siblings
checked (`battack.js`, A1 and A2: the model's `positionJacobian` against a finite difference of the adapter's path end, ε 1e-7):

| case | point | rel. error |
|---|---|---|
| one jump, **pitched take-off** (+4° kick, −3° landing) | kh before the jump, far from the lip (`p0[3]`) | 4.1e-6 |
| | kv mid take-off piece (`p1[6/9]`) | 1.9e-6 |
| | kh and kv after the jump (`p3[5]`, `p4[4]`) | ≤ 6.9e-6 |
| **two jumps**, a turn between, landings −2° and −4° | kh before jump 1; kv between the jumps; kh and kv after jump 2 | ≤ 9.9e-6 |
| | kv `p4[9/11]`, two points before jump 2 | 8.3e-5 |
| **the last 1–2 control points before a lip** | kh and kv `p1[7,8/9]`, `p0[16,17/18]`, `p4[10/11]` | **5.5e-3 to 3.0e-2** |

**The lip error is NOT a jump sibling. It's the model's existing end-of-piece error.** checked (`bctl.js`, the control):
- At the **lap's last control point**, with no jump anywhere near: kh and kv `p4[17/18]` are **2.92e-2**, `p4[16/18]` are 2.3e-4 and 8.4e-5.
- **The same on E's tree and on base `12ab427`, identical to 3 figures.** The midpoint quadrature of the last basis function is coarse at a piece's end.
- Before a road piece those points are joined C1 to the next piece, so they aren't independent columns. Before a jump (or at the lap's end) they are, which is the only reason the error shows there.
- It affects only the Gauss–Newton step direction. The residual is the adapter's exact path, so convergence and the closed result are unaffected: every close below converges.
- E's row-4 bound (1e-3) is checked at a mid-piece point, where it holds. **Owner: the model's author. Optional:** a finer quadrature at piece ends would make the model exact there too.

**A jump at the edge of MY local close** (`battack.js` B: a near-closed lap whose last piece is cut and given a jump plus landing road):

| window | jump then 100 m | jump then 40 m |
|---|---|---|
| the landing road ALONE | **refused by name, CLOSE_WINDOW** ("no closer than 131.9 m") | **refused by name, CLOSE_WINDOW** ("no closer than 163.3 m") |
| the road before + the jump + the landing road | **converged**, 0.015 mm; the 5 outside pieces are the same objects | **converged**, 0.58 mm; the 5 outside pieces are the same objects |
| the default ~20% | **converged**, 0.122 mm; 5 of 5 kept | **converged**, 0.009 mm; 5 of 5 kept |

The landing road alone can't close: its first two κh, κv, h and l points are held level by the jump. That's honest, and the refusal is by name.

## 2. isCoreFlight's edges: real holes stay red
checked (`battack.js` C: F7's real segments, one field changed, then `validate`):
- the real F7 flight: **no `gap-in-road`** (control);
- the gap's next segment is NOT its land ramp (`part: 'body'`): **red at s 200**;
- a land ramp of **another id**: **red at s 200**;
- the gap's word is not `core`: **red at s 200**;
- the next segment is itself a gap: **red at s 200**.

**Consecutive flights:**
- A hand-made document `road, flight, flight` is **accepted by `checkDoc`**. Its segments read `gap, land, gap, land`, each gap followed by its own ramp, so both are exempt.
- `jump()` refuses `JUMP_AFTER_JUMP`, but **an opened or hand-edited file can hold two flights in a row**.
- **Note (owner E, design, not a defect):** a take-off from the first jump's landing ramp is then validated only by `checkJump`. If "land on road first" is a rule and not just a UI convenience, `checkDoc` is where to enforce it.

## 3. The two changed tests: honest restatements, not weakenings
read (`git show 6d2ce06`):
- **`core_close.test.js`:** the same turnless track with a jump. Its assertion moves from `/NOT_YET/` to `CLOSE_SINGULAR` **and** `!/NOT_YET/`. That's the refusal every turnless track meets (C's `80752f5`), and it keeps the test's subject.
- **`export_test_unfinished.test.js`:** the row's rule (a red is LISTED and doesn't block) is unchanged, and its example red moves from F7's jump to a real hole planted in F7's landing road.
  - The planted gap's next segment is road body, not a land ramp, so `isCoreFlight` can't excuse it.
  - It asserts `gap-in-road` in the TEST file plus the warning.
- Both carry a comment saying why.

## 4. FLIGHT_AT_END, jump()'s named refusals, the round trip
checked (`battack.js` D):
- **jump() refusals, all by name:**
  - empty → `NO_TAKEOFF`;
  - gap 0 or NaN, landing 90°, drop ∞ → `BAD_JUMP`;
  - a jump after a jump → `JUMP_AFTER_JUMP`;
  - drop −500 m over 5 m → `JUMP_UNSOLVABLE`;
  - closed → `CLOSED`.
- **A lap ending in a jump:** whole-lap close and local close both → `FLIGHT_AT_END`.
- **Round trip:** serialize → parse → serialize is **byte-identical**, and the segments are equal.

## Tests
- targeted at `6d2ce06`: 12 files, **147 of 147 pass**:
  - core_jump 13, core_close 27, core_close_local 6, core_close_refusal 3, doc-jump 16;
  - validate 25, validate_jumps 17, validate_head 9, validate_raygap 10;
  - export_test_unfinished 6, **core_cup_fixtures 8 incl. "0 of 9 differ"**, core-close-preview 7.
- **Mutants: not re-run.** Nothing I found needed one. The one doubt (the lip error) is settled by the base control, not by a mutant. E reports `core_jump_mutation` 16/16, `core_cup_mutation` 51/51, and my `core-close-mutation` 32/32.

## What this does NOT establish
- Driving a jump in AC.
- The UI half.
- Whether the design-speed ramp should be sized at the lap's speed (the keeper's call, E §"not establish").
- The merged full suite.

## Corrections to myself
- **My first control was invalid.** It bumped the last control point of a piece followed by ROAD, which breaks the C1 joint (`JOINT` thrown), because those points aren't independent there. The valid control is the lap's last piece, re-run above.
- Two `node -e` and `sed` edits to my own scripts ran outside the lock (text only).
