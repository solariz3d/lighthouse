# Hand-back: js-suite kills gen-consumer.test.js at 120 s

Commit `592ba1e` on `main` in this worktree (not pushed).

## What changed
- `consonance/tools/js-suite.js`: a test file can now set its own time limit with a header line, `// JS-SUITE: TIMEOUT-MS <n>`. It follows the same rules as the other markers: a `//` or `#` line of its own, within the first 40 lines. The declared value is capped at `TIMEOUT_CAP` (5) × the default, so 600 s with the 120 s default. Any declaration still kills a hang at the cap, and the hang is still reported CRASHED. Files without a declaration behave exactly as before.
- `consonance/tools/gen-consumer.test.js`: one header line, `// JS-SUITE: TIMEOUT-MS 300000`. That is about 2× the slowest run measured alone (157 s).
- `consonance/tools/js-suite.test.js`: 3 new tests, all using a 1 s default limit:
  - A slow file within its declared budget is green. This was red on base.
  - The same file with no declaration is still killed.
  - A hang that declares 999999999 is still killed at the cap, well under 30 s.

## Tests run (all through hr.js)
- `node js-suite.test.js`: before the fix, 47 passed and 1 failed (the new budget test was red, as intended). After the fix, **48 passed, 0 failed**.
- `node scratch.test.js` (its timeout test exercises the same kill path): 11 pass, 2 fail. **Base gives the same 11/2** (checked with `git stash`), and the 2 failures are gen-consumer staging-folder tests.
- `node gen-consumer.test.js`: 66 pass, 41 fail, 69 s. **Base gives the same 66/41** (checked with `git stash`).
- Full `node consonance/tools/js-suite.js`, 504 s, exit 1: 94 green · 33 failed · 9 crashed · 1 canary · 2 not-run (of 139). gen-consumer.test.js now shows **FAIL** (it reached its summary) instead of being killed. None of the 9 crashes is a timeout: every one is `exit 1`, none is `timeout/signal`.

## Not done
- I did not fix the 41 failures in gen-consumer.test.js or the other reds in the full suite. They are outside this task. checked for gen-consumer.test.js and scratch.test.js (same counts on base, via `git stash` + rerun). inferred for the rest: I did not run the full suite on base.
- There is no mutation harness for js-suite.js (`ls consonance/tools/*.mutants.js` lists none), so none was run.
- Usage/README text is unchanged. The new marker is documented only in the comment at its constant.

## Limits
- A real hang in gen-consumer.test.js now takes 300 s to be killed instead of 120 s. A hang in any file that declares a budget takes up to 600 s. Undeclared files are unchanged. inferred, from the code.
- gen-consumer.test.js took 69 s this session, faster than the 123–157 s in the task. That is probably because 41 tests fail early. Once those are fixed, its runtime should return to the measured range, which is still inside the 300 s budget. inferred.
- The killed child's own subprocesses (for example cargo) are not tree-killed on timeout. That behaviour predates this change and was not checked.
