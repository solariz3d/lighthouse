# Hand-back: js-suite per-file time budget (gen-consumer.test.js)

Commit `1dbb1d9` on `main` in this worktree (not pushed).

## What changed
- `consonance/tools/js-suite.js`: a test file can now set its own time limit with `// JS-SUITE: TIMEOUT-MS=<ms>`. It goes on its own line in the first 40 header lines, the same placement rule as the other markers. The 120 s default is unchanged for every other file. Four rules keep a real hang from being hidden:
  - A declared budget is still a kill. A file that runs past it is CRASHED, as before.
  - Every kill now prints `TIMED OUT after N ms` under CRASHED. Before, a hang looked like any other crash.
  - Budgets are capped at `MAX_TIMEOUT_MS` = 600 s (`JS_SUITE_MAX_TIMEOUT_MS`). A budget above the cap, or one that isn't a positive integer, is a CLASS ERROR and fails the run. It is never clamped down to the cap and never silently replaced by the default.
  - A raised budget is printed on the file's row along with how long the file took (`budget 300000 ms, took 78100 ms`), so a file creeping toward its limit shows up.
  - A new header section, THE TIME BUDGET, documents all of this.
- `consonance/tools/gen-consumer.test.js`: declares `TIMEOUT-MS=300000`, about twice its slowest measured run (157 s).
- `consonance/tools/js-suite.test.js`: 6 new BUDGET rows.

## Tests run (all through hr.js)
- `node consonance/tools/js-suite.test.js`, before the fix: 45 passed, 6 failed (all 6 new rows red). After: **51 passed, 0 failed**.
- `node consonance/tools/gen-consumer.test.js` alone, after the change: 107 tests, 66 pass, 41 fail, about 140 s. At the base commit (changes stashed) it gives the same 107/66/41 with the identical set of failing tests. The failures are not caused by this change: this checkout has no `exo_memory/` directory, which those tests read.
- Full `node consonance/tools/js-suite.js`, 876 s wall (part of that was waiting on the heavy-run lock behind L5-R's suite): 139 files, 94 green · 33 failed · 9 crashed · 0 silent · 1 canary · 0 sang · 2 not-run · 0 class-error. The run exits 1. gen-consumer.test.js is now **FAIL** (it reached its summary, taking 78 s inside the 300 s budget) instead of a timeout CRASH. No file timed out.

## Not done / Limits
- I did not run the full suite at the base commit. So I haven't shown that the other 33 failed and 9 crashed files are failing at base too. They look environmental (for example the missing `exo_memory/`), but that is unverified.
- gen-consumer.test.js is still red in this checkout for the `exo_memory/` reason above. This change only stops it being killed.
- The kill stops the direct node child only. Any grandchild processes a killed test started are not tracked, the same as before.
- The 300 s budget comes from the 123–157 s range given in the task plus this session's runs (140 s alone, 78 s inside the suite). If the file gets slower, the per-row timing will show it before it hits the limit.
