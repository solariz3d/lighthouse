# D678 stage 2: Sculpt's Even tool, the build (pane A, D, 2026-11-27)

Packet: `exo_memory/loop/packet_t180_sculpt_even_build_on_D_2026-11-27.md` (room 36853222). It amends
`loop/packet_t180_sculpt_even_build_2026-11-27.md`, whose Stage 2 stands except where the new file says otherwise.
Builder base: `landing-1127-l263` c522ea6, branch `d678-even-a`, worktree `G:/consonance-scratch/a-d678-build/wt`.
Tier: prove it.

## 1. Registration (written and committed before any code or run of this stage)

### 1.1 What will be built

- **Core: `src/core/even.js`, `even(doc, { from, to, value, hold, ramp, margin })`.**
  - It brings the WIDTH of the run of pieces `from`..`to` to `value`.
  - The ramps are outside the run: a 20 m margin at the value beyond each end, then a 30 m smootherstep ramp (calls 2 and 3).
    The window is [run start − 50, run end + 50], clamped at an open track's ends. At an open end the head takes the value.
  - `hold` is 'left', 'right' or 'centre'.
    - A rim held stays where the untouched road has it, read from the section at the new width. This is C1b's `l`, with the
      control point taken at its knot average.
    - 'centre' moves both rims by half.
  - The centre's height comes from Alt F: a least-squares fit, every 0.25 m, to the in-plane target on the BUILT bank (call
    10: `adapter.js` `bankPlan`), with the eased height on the run.
  - The bank is not touched (call 11).
  - The joints follow `sculpt.js` `settle`, exported for this; it is not changed.
- **Refusals by name** (CoreError, nothing changes):
  - a closed lap whose start line is in the run or in its window (call 7);
  - a jump (flight) inside the window;
  - a piece in the window whose right side has its own width (split);
  - a tube in the window;
  - a value that is not a number, or is outside 0.5–400 m (the width handle's range);
  - from/to that are not a run of road pieces.
- **Shell:** an `even` tool in `SCULPT_TOOLS` (family local).
  - A drag on a selected run's width handle evens the run to the dragged value, snapped to 0.5 m (call 5). The far rim from the
    handle's side is held (call 4). One drag is one undo step.
  - `evenRun({ value, hold })` takes a typed value: one undo step.
  - A pointer drag on the road with Even (no run) is refused by name.
  - At the release, the checker is run on the track before and after. A leaves-surface red in the window that the track before
    lacks is said in plain words, at its place, with three figures:
    - the shift;
    - that line's load on the road as it stood (the start road with its centre moved in-plane by the shift, width unchanged:
      its centre's load);
    - the old centre's load.
- **Panel:** Even in the Sculpt strip, with:
  - an "even to m" field and a hold choice (left edge, right edge, centre), and an Even button (typed);
  - two picks, the width just before the run and just after it;
  - the run's width handle in even mode (dragged, snapped).
- **Not built:** the grab (unchanged). Bank, cup and the other channels are not levelled (call 6: width first). The bank plan's
  roll acceleration and the checker's lateral lines are not changed.

### 1.2 Fixtures and starts

- **Flat:** his example as the plan's section 6 builds it: a 200 m lead easing from 31 m, then a left turn of 4 pieces of
  60 m × 30° (s 200–440), then a 150 m exit, 12 m wide.
  - **T1:** one grab at the turn's middle, the outer (right) rim pulled out to 16 m, grab radius 30 m.
  - **T2b:** 8 grabs every 30 m from s 215, each pulled until the width there reads 16 m.
  - Both are made through the shell's `beginFollow` / `brushTo` / `endBrush`, as `even265.js` made them.
  - The level takes the run (pieces 1–4) to 16 m with the inner (left) rim held, through the shell's even tool.
- **Banked:** probe 3's fixtures, built the same way (`even678c.js` `makeBase`):
  - **B−:** the plan layout, the turn's four pieces banked −20° (into the turn), the default cup;
  - **B−0:** the same with cup 0;
  - **Bhold:** the hold layout, −20° held from 80 m before the turn to 60 m after it.
- **Starts on a banked road** (the packet: made with the WIDTH BRUSH, and from the untouched road):
  - **U:** the untouched road;
  - **W1:** one width-brush stroke (the Sculpt Width tool on the road, `beginBrush({ tool: 'width', s0: 320, r: 30 })`), dragged
    until the width at 320 reads 16 m;
  - **W8:** 8 such strokes at s 215, 245, …, 425, each until the width there reads 16 m.
  - From each start, level the run to 16 m, left rim held.
- **B+ and B+0:** probe 3's fixtures banked +20° (away from the turn). Laid from U, left rim held.

### 1.3 The rows, each with what fails it

The bars are the packet's. A row is measured every 1 m unless it says otherwise. The run is 200–440; the window is
150–490.

**The flat rows (gates), from T1 and T2b.** These are the plan's section 6 rows, through the shell.

| row | measures | passes | fails |
|---|---|---|---|
| F1 | width over the run, max − min | ≤ 0.01 m | > 0.01 m |
| F2 | outer (right) edge over the run, the rim the section puts there (`frameAt`), max − min | ≤ 0.01 m | > 0.01 m |
| F3 | inner (left) edge over the run, against where the untouched road has it at each station | ≤ 0.01 m everywhere | > 0.01 m anywhere |
| F4 | outside the window | pieces wholly outside are the same objects, and w, l, h, phi are bit-identical at every 1 m outside | any difference |
| F5 | the document | `checkDoc` passes; `continuity.js` `jointSteps` reads no step in w, l or h at any joint the window touches; the level is one undo step (Undo gives the start back, byte for byte; Redo gives the level back) | otherwise |
| F6 | centre height over the run, max − min | ≤ 0.01 m | > 0.01 m |
| F7 | the checker (`createCheckJob().run({ doc, csp: true })`) | no red on the run, and no red in the window the untouched road lacks | any |

- A red "the untouched road lacks" means one whose [s, s1] is not inside a red of the same reason on the untouched road,
  widened by 2 m at each end.
- This is stricter than probe 3's overlap test, which was wrong.
- The plan's "did not fix it" thresholds (0.05 m) are kept as the line between "between" and "broken". The gate here is the
  0.01 m bar.

**The banked rows (gates), on Bhold, B− and B−0, from U, W1 and W8.**

| row | measures | passes | fails |
|---|---|---|---|
| K1 | no red the base lacks: the checker on the levelled road against the untouched road, in the window, as F7 | none | any |
| K2 | held (left) rim across: the levelled road's l + rim (`frameAt`, its horizontal part), against the untouched road's, every 1 m over the run | ≤ 0.01 m | > 0.01 m |
| K3 | the centre against its in-plane target on the built bank, every 1 m over the window (`even678c.js` `centreOffBuilt`, the start's h and l, its eased h and l) | ≤ 0.01 m | > 0.01 m: said with the figure, the bar not widened |
| K4 | outside the window | as F4 | as F4 |
| K5 | the bank as found | every piece's phi channel the same values; `bankPlan`'s built bank bit-identical every 1 m | any difference |
| K6 | width over the run, as F1 | ≤ 0.01 m | > 0.01 m |

- K3 is the packet's Alt F row: "within 0.01 m on B-, B-0 and Bhold. If it does not get there, say by how much; do not widen
  the bar."

**B+ and B+0 (gates on the tool, not the road), from U.**

- **P1:** the level is laid. The doc changes, and it is one undo step.
- **P2:** where the levelled road has a leaves-surface red in the window that the untouched road lacks, the shell's message
  carries:
  - the place (km);
  - the shift (m);
  - the line's load on the road as it stood (g);
  - the old centre's load (g).

  Each figure must agree with the same quantity computed in the test from the checker, to the shown precision.
- **P3:** the message has no jargon: none of `phi`, `fHold`, `leaves-surface`, `channel`, `l `/`h ` as channel names, `kh`.
- **P4:** on B−, B−0 and Bhold from U, no such sentence is said.
- **Fails:** no sentence where the row's new red exists, a sentence where none does, a figure that disagrees, or a jargon word.

**Reported, not a gate.** Today's grab on the banked roads: T1 and T2b made on Bhold, B− and B−0, levelled. Reported:

- K1 to K6;
- the bank the grab turned (the start's bank against the untouched road's, max, in degrees);
- the held rim's distance from the untouched road's.

This is the table for him, with the pictures (probe 2: 4.9984° and 5.0209°, 0.0964 m and 0.0968 m).

**The tool's other rows (gates), each through the shell:**

- a run of one piece;
- a run whose window crosses a joint, so the ramps sit in its neighbours;
- the open end (a run ending at the head: no ramp after it, and the head's width is the value);
- the typed value;
- Undo and Redo;
- each refusal by name, with nothing changed (the doc the same object).

**The panel (gates), through the handle host:**

- the Even tool in the strip;
- dragging the run's width handle evens the run to a value on the 0.5 m snap, the far rim held;
- the typed value with each hold;
- the picks fill the field with the width just outside the run;
- a road drag with Even refuses by name.

**His saved files (gate):** every track and undo document in his tracks directory, from copies named t01…, parses and
serializes to the same bytes on c522ea6 and on the branch.

**Mutation:**

- a new harness on `src/core/even.js`, at least 8 mutants;
- the harnesses that name `sculpt.js`, `coreshell.js` or `panel.js`, run whole;
- reported as applied N / caught N / NOT APPLIED N.

### 1.4 Predictions (mine, before any run)

- K3 (Alt F on the built bank): ≤ 0.003 m on B−, B−0 and Bhold from every start. inferred: C1b's 0.015 m was the
  control-point error a fit removes.
- K2 (the held rim, l at control points): ≤ 0.01 m on all three, but closest to the bar on B− (the rim's place across moves
  with the ramping bank). inferred.
- K1: no new red on B−, B−0 or Bhold from any start.
- F1–F7 pass from T1 and T2b, as E5 passed.
- On B+ and B+0, P2's sentence fires near s 208–224, as probe 3 found.

### 1.5 Unwelcome outcomes, in the words that would make them true

- **U1:** "Alt F does not reach 0.01 m on B−, B−0 or Bhold; it misses by X m." Reported with the figure; the bar is not
  widened.
- **U2:** "The held rim misses 0.01 m on a banked road: the l taken at control points is not enough."
- **U3:** "The level draws a red on B−, B−0 or Bhold that the untouched road lacks."
- **U4:** "The build fails a flat row from T1 or T2b that E5 passed: the build is not the prototype."
- **U5:** "One of his saved files does not save the same."
- **U6:** "The release's check takes more than 1 s on his largest saved track." The sentence would cost him a pause at every
  release.
- **U7:** "A mutant of even.js survives the rows and is not equivalent."

**Falsifier for the whole:** the build is not done if any gate row fails on any fixture and start, if U5 fires, or if U7
fires. A between figure (0.01–0.05 m) is a fail of the gate, said with its number.

### 1.6 State at registration

- checked: `git -C C:/Users/nname/Downloads/t180-fresh rev-parse origin/landing-1127-l263` → c522ea6, read by the chair
  (the packet's SOURCES).
- inferred: nothing of this stage has been run. No code is written on `d678-even-a` yet.
