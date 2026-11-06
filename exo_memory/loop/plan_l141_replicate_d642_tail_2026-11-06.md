# L141: rebuild D's two unpushed fixes on L, so they can be compared fork against fork. Librarian, on L, 2026-11-06 01:3x

**His words:** "we could try replicate it, but then it has to be decided which fork to take after and which is better. Desktops fix vs ours
here."
**Why:** D's handoff names two fixes that exist only on D (`loop/handoff_t180_2026-11-05-D.md`, brief state 19:1x):
- B's tight bank minimum `d87ba99`;
- C's drag-cost fold `d642-c4` `212e78d`.

## Base
t180 `origin/second-change-additive` `5d17a9c` (tree = d642-p a924f1b). New branch `l141-tail` off it.

## What to rebuild (from the reports, not from memory; read them whole)
1. **B, the bank minimum:** `handback/p-d642-tip-review-E_2026-11-05.md` §5 (the fault), `handback/p-d642-b3-review-E_2026-11-05.md` (the
   review of D's fix), and D's own B note in `handback/p-d642-core-B_2026-11-05.md`, if it describes the fix. The minimum checks the
   built peak per case, not a fixed share.
2. **C, the drag cost:** `handback/p-d642-drag-cost-C_2026-11-05.md` (the fold, and where the 13 asks a move came from), plus B's probe
   memo, as described there.

## The same bars as D's, so the forks compare on one instrument
- His p2 bank-back (88.45 → −88.45 from 500 m on his S) lays, and its built peak is ≤ 1.05× BANK_BAR (E's `p2bar.js` / `r2bar.js` in
  `handback/p-d642-b3-review-E_2026-11-05_evidence/`).
- Dragging the extra bank toward level costs ≤ 2× the flat drag's p95, using E's `dragbench-full.js` (same evidence folder), with
  the red run first on 5d17a9c.
- `core_additive`, the ramp mutants and the touched set, all green.

## Then, the fork choice (his words: "which is better")
- When D pushes its `d87ba99` / `212e78d` (squashed, per the 11-06 handoff rule), E runs the same scripts on both tips, the same day, on
  one machine.
- E reports, side by side:
  - his p2 peak;
  - the drag p95 ratio, rolling and early;
  - the minimums on E's §5 cases;
  - mutants;
  - lines changed.
- The keeper picks, or the two merge where they differ. Neither fork lands on main until then.

## Packet
- **B:** the minimum (core). **C:** the fold (panel). In parallel, on `l141-tail`; C rebases on B.
- **E:** the review, on its own scripts.
- **C:** renders of his S through the panel, for his look, then an install on L with no launch.
- Rules: heavy-run lock at 4096; own CARGO_TARGET_DIR; commit by named paths; plain squashable messages; push the branch at the end.

NEXT: chair dispatch B (minimum) and C (fold) on l141-tail now; E reviews when C rings; librarian collates
