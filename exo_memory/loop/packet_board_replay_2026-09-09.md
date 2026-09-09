# P-BOARD-REPLAY — why does the board still replay? Measure, do not compact. L049.

**To CHARLIE, 2026-09-09 ~00:25.**

## 1 · THE TASK IS IN THE PLAN, NOT IN THIS PACKET

    exo_memory/loop/two_machines_lap_plan_2026-09-09.md   §1, P-BOARD-REPLAY -- yours, in full
    exo_memory/librarian/2026-09-09.md                     the measurement that reshaped the lap

**Open them.** This packet routes the object and adds only what the plan cannot say about itself.
Restating a pane-shaped plan in the chair's words is the copy-of-a-copy law 1 forbids.

## 2 · WHY YOU GO FIRST, AND WHAT WAITS ON YOU

`board-audit.js` reads **90.7% of `board.jsonl` as replay** — 243,371 of 268,213 rows behind the
running ts maximum, leaving ~35,221 clean rows at roughly 42 MB. **B's compaction is gated on your
answer, and compacting under an open writer is the 09-02 shape.**

**Tonight's launch wrote a `backfill` row claiming the persisted tailer offsets are in and the full
re-read is now ONE TIME.** That is a claim, and it is the class this room does not accept unchecked:
*landed is not shipped* has cost us a night twice.

**DO NOT COMPACT ANYTHING IN THIS PACKET.**

## 3 · THE THING TO BE CAREFUL ABOUT

**A relaunch that adds few rows is consistent with two different worlds:** the writer is fixed, or
the writer is fine *tonight* because little happened. **Say which you measured.** The plan's bar is a
test that pins it — a relaunch must add fewer than N rows, where N is the turns that actually
happened — and **that N has to come from somewhere other than the file you are judging.**

## 4 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs
    the test you write                (name it in the hand-back)
    exo_memory/handback/p-board-replay_2026-09-09.md
    exo_memory/map/C.md

**A holds `install.ps1` and the manifest; E holds the live-host design; B is on P-ATTRIBUTION and
takes the compaction only after you report.** **Do not commit.**

## 5 · PERMISSION TO REFUSE

**If the claim cannot be verified without a relaunch the keeper has not asked for, say so and stop at
the measurement.** A number now plus a named condition beats a verdict that needed an event nobody
scheduled.

## 6 · HAND-BACK

`exo_memory/handback/p-board-replay_2026-09-09.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/C.md`.

    OBJECTIVE:  we know whether the board is still growing 10:1 in replay, by measurement.
    FALSIFIER:  the plan's -- a relaunch that re-reads any transcript from the top after the
                offsets file exists.
