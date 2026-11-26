# Pit-gap repair round: refuse a gap only when it changes. Pane A, 2026-11-26, chair D677 (PROVE IT)

**Branch:** `l-pitgap-a`, `44c770f..7e42f02`, pushed (branch only; no merge, no install).
**The read it answers:** pane O's, `exo_memory/handback/p-pitgap-read-O_2026-11-26.md` (NOT CLEAN, §1; the nit, §5; the
correction, §2).

    checked: git ls-remote origin l-pitgap-a → 7e42f02fb75a792daf30b1081dfd830d9b035a24
    checked: C:/Consonance/data/push-gate.jsonl, row 2026-11-26T22:20:45.168Z → decision allow

## What changed (6 files, +88 / −10)

**1. The refusal judges only a gap that CHANGES.** This is O's shape.
- In `app/core/coreshell.js` `setPitLane`, `gapNow` is the stored lane's gap.
- A lane is refused only when `offsetM !== gapNow` and `offsetM < PIT_GAP_MIN_M`.
- So a lane saved under 0.1 m keeps taking its side, joins, width, peel-off, merge, boxes and spacing, with its gap as
  stored.
- Its gap, when changed, must go to 0.1 m or more.

**2. The rows.** Two are red first; the third is a guard.

| row | at 44c770f | at 7e42f02 |
|---|---|---|
| 6. a saved lane whose gap is under the smallest still takes a width edit in the panel, and keeps its gap (0.05 m, the pit panel mounted, width typed 10) | **red**: "the width edit was refused: PIT_GAP_TOO_SMALL: …" | green |
| 7. guard: a saved lane under the smallest, its gap changed to another value under it (0.06) is refused; raised to the smallest it is laid | green | green |
| 8. the panel: a refused gap puts the gap box back to the lane's stored gap (12, then 0 typed) | **red**: "the box still shows the refused gap" | green |
| 1–5, as before | green | green |

    checked: node --test app/test/core-pitgap.test.js on a git archive of 44c770f with the new test file copied in
             → tests 8, pass 6, fail 2 (rows 6 and 8); on the worktree at 7e42f02 → tests 8, pass 8, fail 0

**3. The CHANGELOG says exactly what is refused.** It reads: "the shell setting a pit lane whose gap is under 0.1 m AND
differs from the stored lane's gap (in the panel, typing such a gap)". It also gives:
- what still works on a saved lane under the floor;
- that 0.1 m is a margin, not the least gap that exports, with O's figures.

**4. O's display nit, `app/core/pitui.js:69`.**
- `put` now draws the stored lane again when the document did not change (`shownFor = null; update(…)`).
- So a refused gap no longer stays in its box. Row 8 pins this.

**5. The wording of my first hand-back.**
- `p-pitgap-fix-A_2026-11-26.md` §2 now carries two marked corrections, the old wording kept beside them:
  - 0.1 m is a margin, not the least gap that exports;
  - "a stored file under 0.1 m still exports red" was wrong from 0.012 m, and refusing its every later edit was the bug.
- The comment at `src/doc/pitlane.js:35-39` says the same: a margin, and refused only when changed.

## Mutants: applied 12 / caught 12 / NOT APPLIED 0, plus the control

    checked: G:/consonance-scratch/a-pitgap-r1/mutation.tap (through heavy-run --run) → tests 13, pass 13, fail 0

**New in this round:**

| mutant | the change | caught by |
|---|---|---|
| P9 | an unchanged gap is judged too | row 6 |
| P10 | the gap compared with the new lane's own | row 7 |
| P11 | no redraw after a refusal | row 8 |
| P12 | the redraw without clearing `shownFor` | row 8 |

**Re-anchored on the changed line:** P1 and P7. The others are as before.

## The pit lane's consumers: 227 / 227

    checked: G:/consonance-scratch/a-pitgap-r1/consumers.tap (the same 22 files as the first round, through heavy-run --run)
             → tests 227, pass 227, fail 0, skipped 0

- The extra three are rows 6–8.
- Every test that requires `pitui.js` is among the 22: core-pitlane, core-spawns-ui, core-trackmenu, and the new rows.

**Not re-run:**
- his tracks unmoved, 36 of 36 at 44c770f. This round changes nothing on the load or export path: `setPitLane` and the
  panel only.
- the seven older harnesses over coreshell.js, for the same reason as the first round.

## Corrections

- None in this round's own work.
- The two in my first hand-back are marked there, as above.
- My C1 read (rung 22:13Z) records my run inside P's timing hold. Every run in this round was gated on the hold's status
  or went through `heavy-run.js --run`.
