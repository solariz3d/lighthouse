# P-D108-RUNNERTEST — C (D108 fold-in, ON D, 2026-09-22 11:3x) — UNCOMMITTED

**`consonance/tools/jev-shadow-runner.test.js` now tests the L2-only contract.** I applied exactly the three edits in A's
`exo_memory/handback/p-d108-l2only-A_2026-09-22.md` §6, each with a one-line comment citing the
`exo_memory/librarian/2026-09-22.md` "11:0x" ruling (L3 dropped from Jev's judge mode). Nothing else in the file changed.
`git diff --stat`: 9 insertions, 6 deletions, all in the three tests below. sha256 `d35fcc43af19473e…`.

## Why the three assertions were verifiably wrong

Each one pinned the old contract, where one finished turn became two judge items (L2 and L3). Under 11:0x one turn is
one L2 item, and judge mode no longer reads `l3-overseer.js`.

| test | before | after |
|---|---|---|
| JUDGE MODE runs inside the runner … | title "L2 and L3"; `waitFor(>= 2)`; levels `.sort()` equal `['l2','l3']` | title "L2 only (D108)"; `>= 1`; levels equal `['l2']` (not sorted) |
| L078: a failed judge call is LOGGED once per item … | `>= 2`; `/seat-1:a1:l[23] failed \(503\)/` | `>= 1`; `/seat-1:a1:l2 failed \(503\)/` |
| a judge-mode REFUSAL mid-run (a hook function missing) … | breaks `l3-overseer.js` (`readTrajectoryView is gone`) | breaks `l2-overseer.js` (`readNarrowedView is gone`), so it still exercises the same intent: judge mode goes off and the shadow never stops |

## Results — run plain on D, with A's D108 files in the working tree

- `node --test consonance/tools/jev-shadow-runner.test.js`
  - **Before:** 35 pass / 3 fail. The three failures are exactly the tests above.
  - **After:** **38 pass / 0 fail**, 0 cancelled.
- `node consonance/tools/js-suite.js` → **119 green · 0 failed · 0 crashed · 0 silent · 1 canary · 1 not-run (of 121)**, exit 0.
  - The canary is `targetless-pull.test.js`, which is declared EXPECTED-RED.
  - The not-run is `actors.evidence.test.js`, which is declared MACHINE-BOUND.
  - A's §7 recorded 118 green · 1 failed; that one failure was this file.

## NOT verified

- **Machine L.**
- **Mutants over the changed assertions.** A proved the same edits 35/3 → 38/0 on a copy (§6); I did not re-run a harness.
- **The live runner.** It picks up L2-only only when it next restarts, which is the librarian's step, not mine.

NOT COMMITTED. I own only this file this lap.

NEXT: librarian collate D108 whole, then chair lands D108 and opens 4.3 (T-J1 re-registration on a larger universe) when C's hand-back is filed
