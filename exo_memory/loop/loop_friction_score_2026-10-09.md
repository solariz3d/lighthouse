# D276 loop friction: SCORE. Librarian, the scorer, on D, 2026-10-09 11:2x.

Plan and registrations: `loop/plan_loop_friction_2026-10-09.md` (H, its falsifier, and H2). Inputs, all four in:
E `loop/loop_friction_measure_2026-10-09.md` (items 1+2) · A `loop/loop_friction_A_2026-10-09.md` (item 3 + H2) · C `loop/loop_friction_C_2026-10-09.md`
(item 4) · B `loop/loop_friction_B_2026-10-09.md` (item 5).

## H, scored against its registered falsifier: FALSIFIED as written
The falsifier: "H is FALSE if ≥ 30% of paperwork-gate refusals were followed by a re-send whose CONTENT changed." E, 201 refusals since each gate went
live: **38.3%** changed content (SOURCES 33.1%, reply slot 67.6%, trailer 30.0%). The letter is met, so **H as registered is FALSE.** The scorer does
not move the line after seeing the data.

## What the data says instead (the registered unit was too coarse; that is the lesson, not a rescue)
- **What the content changes were:** E read every changed pair. **4.0% fixed or re-grounded a claim; 10.0% REMOVED or BLURRED a specific** ("56%
  faster" → "much faster", a `path:line` dropped, a "(checked with …)" note dropped); the rest was rewording, narration about the refusal, and unrelated
  additions. **Blurring outnumbers fixing 20 to 8.** (Post-hoc and unregistered, but read pair by pair with the labels on disk.)
- **B, since 2026-10-08:** the WORK checks made **132 distinct catches**, each cited (tests, parity, identity diff, cold reads, the release build). The
  PAPERWORK gates made **0 catches in 38 refusals** (SOURCES 31: 20 identical re-sends, 11 changed, none correcting a wrong claim, one losing its whole
  body; reply slot 6; trailer 1).
- **Time:** ~7–11 s median per refusal (E). Round time did not move at the gates: −2.5 min, 95% [−6.5, +3.6] (A). So the cost is not the clock.
- **Defensive text did not grow:** NV 5.6% → 5.0% of lines, SD 6.3% → 4.8%; hand-backs got SHORTER (median 126 → 65.5 lines); the share of files with
  a self-correction section rose 36.1% → 56.1% (C). The keeper's "effort to not be called out" does not show as padding. It shows as blurring.

## H2 (split vs single-pane): FALSE as registered, and UNDECIDED in substance
Split cycles' median 55.0 min vs single 14.6, +40.4 [+25.3, +60.8] (A). But the ledger records no part count, and the chair splits the BIGGER tasks, so
"split" mostly means "big"; within one round the gap shrinks (+18.5), and the merge is invisible in `lap.jsonl`. **H2 cannot answer the keeper's
question from this ledger.** It needs a controlled test: the same kind of multi-part task run both ways, timed end to end including the merge.

## The scorer's reading, for the keeper's decision
The paperwork gates cost little time and catch nothing, and when they bite, seats blur their claims far more often than they fix them. The work
checks carry the catches. That is the input to D277 (`loop/plan_lighten_the_load_2026-10-09.md`), whose H3 is registered with a revert condition.
