# p-driftevidence-A — D296 landing blocker: carrier-drift scans the evidence copies; seat A, 2026-10-11

Worktree `G:\consonance-worktrees\a-d296-wt`, branch `d296-a` from main `4b37a5e4`. **One commit, local, named paths, not pushed: `572d8c56`** — `consonance/tools/carrier-drift.js` (+14 −2), `carrier-drift.test.js` (+3 rows).

## The fix (as the packet argued it; no objection)
`isEvidenceCopy(rel)`: any DIRECTORY segment ending `_evidence` makes the file a TRACE, through the one predicate `isTraceFile`, so it is counted and printed in the "traces skipped" line (`any directory named *_evidence`), not dropped silently. Whole-suffix on a directory segment: `foo_evidencex/`, `foo_evidence_old/` and a bare `evidence/` stay carriers.

## Checks
- Red first: `carrier-drift.test.js` before the change → 54 pass / 6 fail: the chair's three (`THE BAR half one`, the cant-lose mutation row, the census row) reproduced on this tree, plus my three new rows.
- After: 60 pass / 0 fail (through `heavy-run.hold()`). `node consonance/tools/carrier-drift.js` exit 0; its corpus line now ends "…, any directory named *_evidence)" (248 traces).
- Mutants on `carrier-drift.js`: **applied 4 / caught 3 / NOT APPLIED 0.** Caught: `includes` for `endsWith`, predicate dropped from `isTraceFile`, `startsWith`. Survivor `slice(0,-1)`→`slice(0)` (also tests the filename) is equivalent: a scanned file ends `.md`/`.html`, never `_evidence`.
- `node consonance/tools/portable-paths.js` exit 0, after committing.
- The tree holds C's dumps (`handback/p-shelfbudget-C_2026-10-11_evidence/dumps/new/`), so the green is over the failing case.

## Risk, disclosed
Position confers trace status here, which carrier-drift's own header refuses for `exo_memory/map/`. I followed the packet's rule; the exposure is a live carrier written inside a `*_evidence` folder. Today there is none (the 20 findings were all copies). The skipped count is printed on every run, so a jump in it is visible.

## Corrections to myself
First mutant loop was vacuous: its pass/fail grep did not match node's coloured output, so every mutant read "CAUGHT". I found it when the unmutated baseline printed nothing, fixed the parse and re-ran; the figures above are from the second run.

NEXT: librarian collate; chair cherry-pick 572d8c56 onto main and push D296
