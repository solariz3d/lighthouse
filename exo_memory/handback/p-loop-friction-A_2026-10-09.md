# p-loop-friction-A — D276, item 3 (lap speed before/after the gates) and H2 (split vs single-pane), seat A, 2026-10-09

MEASURE ONLY. Nothing changed in any repo or ledger. Written: `exo_memory/loop/loop_friction_A_2026-10-09.md` (the measurement file, every number with its
section and command), `exo_memory/loop/loop_friction_A_2026-10-09_evidence/` (`loop_friction_A.js`, the program; `out_A.txt`, its output, sha256 79c36b54…), this hand-back,
and my map line. Reproduce: `node exo_memory/loop/loop_friction_A_2026-10-09_evidence/loop_friction_A.js` (reads machine-local `C:\Consonance\data\lap.jsonl` and `board.jsonl`).

## Item 3 — lap speed before vs after the gates
- Round time (dispatch → the chair retakes the chain), median: **14.4 min before (n=430), 12.0 after (n=210)**; difference −2.5, 95% bootstrap [−6.5, +3.6].
  Against only the 14 days before the SOURCES gate: 11.5 vs 12.0, +0.4 [−3.8, +6.3]. No change detectable; shifts beyond about 6 min either way are excluded. The upper quartile rose, 30.5 → 40.8 min.
- Per pane (single-pane rounds): A 9.8→13.5, B 12.5→8.0, C 12.5→17.4, E 10.7→13.0; no intervals, wide IQRs, and the sign of A, C, E reverses when co-dispatched rounds are included, so no pane-level effect is claimed.
- **The strict "last hand-back arrived" time cannot be compared across the gates:** the last `handbacks-in` row is 2026-09-28T14:25Z and the last letter-attributed committee post is 2026-09-28T17:57Z, four days before the first gate.
  Before the gates only: dispatch → last hand-back median 16.5 min (n=43 of 407 rounds, 364 censored).
- Cycles (first dispatch → filed): 30.3 min before, 128.1 after, **but cycle size changed** (rounds per cycle median 1.0 → 4.5), so it is not a speed comparison.

## H2 — registered falsifier fires, and the test cannot decide the question
- As registered (split vs single-pane cycles, median dispatch → close): split is **longer**: 55.0 vs 14.6 min pooled, +40.4 [+25.3, +60.8]; split ≥ 3 panes 65.5, +50.9 [+25.8, +102.8]. By the letter, **H2 is FALSE on this ledger.**
- Confounders named, none adjusted: the ledger has **no part count**, and the chair splits the bigger tasks, so the split group is the bigger-task group (bias against H2, size unknown); rounds-per-cycle is partly an outcome of splitting;
  15 of 134 split cycles exceed 8 h against 0 of 86 single (a cycle is not always one task); kind of work was not coded; the gates and a practice change (fewer single-pane cycles: 80 of 237 before, 5 of 32 after) overlap.
- **The merge is not measurable here:** chair-retake → filed is a median 0.0–0.1 min in every class, because collation and landing are text and commits, not timed ledger rows. H2's "merge included" is untestable from lap.jsonl.
- The other in-ledger read points the opposite way: a round's time by panes dispatched, median min: **K=1 11.2, K=2 15.8, K=3 13.3, K=4 17.0**, i.e. a 3–4 pane round is about 1.2–1.5× a one-pane round, not 3–4×. Weak step: it assumes equal-size parts, and E1 is a chair retake.
- I report both and choose neither. What would settle it: a `parts` field recorded when the plan is written, or a retrospective coding of the 65 split≥3 and 86 single cycles by independent-part count from their hand-back files, by a seat that does not hold the answer.

## Corrections I made to my own pass
My first cycle table labelled 106 cycles "single"; 20 named no lettered pane (dispatches to the librarian etc.). They are now their own row; the pooled test already used the 86. My first board-based hand-back time found only 565 letter-attributed posts of 8,289
committee rows, which is why the strict time is before-era only.

## Does not establish
That the gates have no cost (E's refusal-to-resend time is item 2, not here); that splitting is slower for comparable work; that the merge is free; anything about the quality of work. `lap.jsonl` is machine-local (D). This seat's own rounds are in the data measured.

NEXT: librarian merge A's item 3 and H2 with E, C and B, and score H against its falsifier when all four are in
