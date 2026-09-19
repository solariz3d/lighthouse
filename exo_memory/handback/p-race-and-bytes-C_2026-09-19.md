# P-RACE-AND-BYTES — C (CHARLIE), D083 (unattended), on D — DRAFT, appended as the lap runs

**Packet:** the chair's D083 dispatch. **Source:** B's `handback/p-six-reds-B_2026-09-19.md` §3 (state-sync, the race)
and §2.4 (forget-rate, the bytes), read at source. **Start:** HEAD `5c97769`. The keeper is asleep, so no question is
put to anyone; see "Questions for the morning".

**Two items:**

1. `state-sync.test.js`: `deleter()` gets a readiness signal before the install starts. The test file only.
   **Bar:** B's load recipe gives 0 of 24 failures, where B measured 19 of 24.
2. `forget-rate.js`: `lastBlob` uses `--full-history`, with a fixture repo holding a merge after a deletion, red first.
   **Bar:** `--to HEAD` gives 172,048 B for the two departed files. The stale `FORGOTTEN 0 files` pin at
   `forget-rate.test.js:209` is NOT re-pinned.

## Log

- 11:4x — read the dispatch and B §2.4 and §3. Draft opened.
- 11:5x — **Item 1, the control first.** B left outputs but no script, so I wrote B's §3 recipe as `SCR/race/recipe.js`
  (3 rounds × 8 parallel `node consonance/tools/state-sync.test.js`, 6 CPU burners of 45 s each per round) and ran it on
  the UNCHANGED test (sha256 `cbf411aaad906a93…`).
  `node SCR/race/recipe.js baseline 3 8 6` → `SCR/race/baseline.txt`: **15 of 24 runs failed** (B: 19 of 24). Only
  the two `deleter` tests failed: "a shortfall records installed:false…" 11×, and "--pull --install EXITS NON-ZERO…" 6×.
  The race reproduces, so a 0 of 24 after the fix is evidence.
- 12:0x — **The readiness signal alone did NOT fix it.** The child writes `ready` after its first unlink pass, and
  `deleter()` waits for that (Atomics.wait, 5 ms naps, a 30 s bound that fails by name). Idle run 75/0.
  `node SCR/race/recipe.js fixed 3 8 6` → `SCR/race/fixed.txt`: **17 of 24 failed**, still only the two deleter tests.
  A failed run's own output (`SCR/race/fixed/r1-*.txt`) shows the install and the reconcile both COMPLETE, 2 of 2, so the
  file was never taken, even though the deleter had signalled it was running.
  **B's inferred mechanism (the child not yet started) is not the one that fires here, or not the only one.**
  Next hypothesis: the deleter's loop has a hard 6 s lifetime (`end=Date.now()+6000`), and under this load the
  git-backed pull (clone, verify, install) reaches the write later than that.
- 12:1x — **Second hypothesis REFUTED by its own premise check.** The deleter's lifetime is now a 120 s safety bound
  (killed as the install returns), and both tests now assert, before any product assertion, that the deleter was
  still running when the install returned (`alive = child.exitCode === null && child.signalCode === null`).
  `node SCR/race/recipe.js fixed2 3 8 6` → `SCR/race/fixed2.txt`: **16 of 24 failed**. In every failure the PREMISE
  assertion passed and a product assertion fired (`installed: true`, exit 0; `grep -A2 FAIL SCR/race/fixed2/*.txt`).
  So the deleter was alive and looping for the whole install, and still did not take the file.
  **Third hypothesis: starvation.** The window is the few ms between the install writing A.txt and the reconcile
  stat-ing it; a loop that gets intermittent slices under 6 burners + 8 tests + 8 deleters on 16 cores misses it. Idle,
  it owns a core, hence 75/0 idle.
- 12:2x — **Third hypothesis CONFIRMED: starvation.** Test-only: `os.setPriority(child.pid, PRIORITY_HIGH)` on the
  deleter child (with the readiness wait and the 120 s bound kept). Idle `node consonance/tools/state-sync.test.js` →
  75/0. Under load, test sha256 `c2af5818db61675b…`:

  | run | command | failed |
  |---|---|---|
  | 1 | `node SCR/race/recipe.js fixed3 3 8 6` → `SCR/race/fixed3.txt` | **0 of 24** |
  | 2 | `… fixed3a …` → `SCR/race/fixed3a.txt` | **0 of 24** |
  | 3 | `… fixed3b …` → `SCR/race/fixed3b.txt` | **0 of 24** |
  | 4 | the mutant harness's pre-flight (unmutated copy, same recipe as its score) | **24/0** |

  **0 of 96 in total**, against 15 of 24 at baseline.
- 12:3x — **Item 2, red first, and the first red was the WRONG red.** A new `mergeFixture()` in
  `forget-rate.test.js`: base → `side` branch; main gives birth to `gone.md` (1,501 B) and then deletes it; `side` does
  its own `exo_memory/` edit and merges main, so the first parent never held `gone.md`. The fixture checks its own
  premise: plain `rev-list HEAD -- gone.md` is empty, `--full-history` is not.
  - **Draft 1 went red with "the departure itself was not found".** Main's `exo_memory/` changes netted to zero, so the
    merge was treesame for the DIRECTORY too, and the tool's directory log lost the file as well. That is a different
    shape from B's case (count right, bytes wrong).
  - **Fixed the fixture:** a surviving file on main, so the directory log follows both parents, as in the real repo.
  - Draft 2: **red for the right reason**, "the departed bytes are wrong". `node consonance/tools/forget-rate.test.js`
    → 10 passed, 2 failed (the new test, plus the stale real-corpus pin, which is out of scope).
- 12:3x — **Fix:** `lastBlob` → `git rev-list --full-history <to> -- <p>` (`forget-rate.js:115-119`).
  `node consonance/tools/forget-rate.test.js` → **11 passed, 1 failed**; the 1 is the stale pin at `:209`, NOT
  re-pinned as instructed. **Bar:** `node consonance/tools/forget-rate.js --to HEAD` → `DELETED 2` (the battery file,
  `exo_memory/astra/SHELL.md`), **`FORGOTTEN 2 files / 172,048 bytes`**. Independent re-derivation:
  `git show e5e1eeb~1:exo_memory/astra/SHELL.md | wc -c` → 161,665 and
  `git show 62a4f3a~1:exo_memory/loop/battery_run1_T2_text_2026-09-16.md | wc -c` → 10,383; the sum is 172,048.
- 12:1x (after the lap) — **Mutants, both via `consonance/tools/mutant-harness.js` on HEAD worktree copies**, with
  scratch score adapters.
  - **Item 1, scored UNDER LOAD.** `SCR/race/score-recipe.js` runs B's recipe in the worktree; a mutant counts as
    killed if any of the 24 runs fails. `node consonance/tools/mutant-harness.js SCR/race/rows-race.js` →
    `SCR/race/harness-race.txt`: pre-flight 24/0.

    | # | mutant | result |
    |---|---|---|
    | 1 | the priority boost removed | **killed** |
    | 2 | the readiness wait removed | **SURVIVED** |
    | 3 | the lifetime back to 6 s | **SURVIVED** |

    3 applied, 1 killed, 2 survived, 0 NOT APPLIED. Live file unchanged.
  - **Item 2.** `SCR/race/score-forget.js` copies the live test file in and excludes BY NAME the one stale pin (it
    reports whether that pin was red). `node consonance/tools/mutant-harness.js SCR/race/rows-forget.js` →
    `SCR/race/harness-forget.txt`: pre-flight 11/0.

    | # | mutant | result |
    |---|---|---|
    | 1 | `--full-history` removed | killed |
    | 2 | `lastBlob` always null | killed |
    | 3 | only the newest rev inspected | killed |

    3 applied, 3 killed, 0 survived, 0 NOT APPLIED. Live file unchanged.

---

## Result

### Item 1: the bar is met, but NOT by the fix as specified

**This is wrong as specified, measured three ways.** The packet specified a readiness signal. **With the readiness
signal alone, B's recipe still failed 17 of 24** (`SCR/race/fixed.txt`). Adding a premise check (the deleter still
alive when the install returns) then showed that in every failure **the deleter was alive for the whole install and
still did not take the file** (`SCR/race/fixed2.txt`, 16 of 24). The mechanism is **CPU starvation of the deleter's
unlink loop:** it misses the few-ms window between the install's write and its reconcile.

The fix that meets the bar is **one test-only line: raise the deleter child's priority** (`os.setPriority(child.pid,
PRIORITY_HIGH)`). That gives **0 of 96** across four load runs, against 15 of 24 at baseline (B: 19 of 24). The
ablation agrees: only the priority boost is load-bearing (mutant #1 killed, #2 and #3 survived).

| mechanism | status |
|---|---|
| priority boost | **load-bearing** |
| readiness wait (`ready` marker, 5 ms `Atomics.wait` naps, a 30 s bound that fails by name) | **kept, not load-bearing under this recipe** |
| 120 s safety lifetime (the caller kills it at once) | **kept, not load-bearing under this recipe** |
| premise assertion (`alive`) at both call sites | kept: it turns "the product failed" into "the test's premise did not happen" whenever that is the truth |

**B's §3 inference ("the child's Node startup can take longer than the whole install") is not what fires on D under
this recipe.** B marked it "inferred, not proven". The readiness wait now guards that case anyway.

**The product is untouched.** Only `consonance/tools/state-sync.test.js` changed. Idle it gives 75 passed, 0 failed.

### Item 2: the bar is met

`lastBlob` now uses `--full-history`. `forget-rate.js --to HEAD` → **`FORGOTTEN 2 files / 172,048 bytes`**,
re-derived independently as 161,665 + 10,383. The new merge fixture went red first, **for the right reason** only on
its second draft (§Log 12:3x). `forget-rate.test.js` → 11 passed, 1 failed; the 1 is the stale `FORGOTTEN 0 files`
pin at `:209`, **not re-pinned** as instructed (its repair needs the pilot file first). Mutants 3 of 3 killed.

**Files touched (uncommitted):**
- `consonance/tools/state-sync.test.js`
- `consonance/tools/forget-rate.js`
- `consonance/tools/forget-rate.test.js`

## Questions for the morning (the keeper was asleep; the conservative default was taken)

1. **Keep or strip the two non-load-bearing deleter mechanisms?** The default is to keep them:
   - the readiness wait is what the packet asked for, and it guards the startup race B described, which may fire on
     another machine;
   - the 120 s lifetime is only a bound.

   Mutants #2 and #3 survive because B's recipe cannot tell them apart from their removal. Stripping them would
   leave only the one measured line.
2. **Is a raised scheduling priority acceptable in a test?** It models `gc_captures` running concurrently rather than
   queued behind burners. It changes no product code. `os.setPriority` failing is caught, and the premise check then
   speaks.

## What is NOT verified

- **Machines other than D.** L, or a slower or smaller-core machine, may starve differently. PRIORITY_HIGH on another
  OS or under a different scheduler was not tested.
- **Loads harsher than B's recipe:** 3 × 8 runs with 6 burners, on D's 16 cores. The test is still a race, made
  winnable rather than removed. A deterministic premise would need a product seam, such as a hook between install and
  reconcile, which is out of this packet's scope.
- **The two surviving mutants are untested behaviour** (see Question 1).
- **forget-rate, found not fixed:** `lastBlob` inspects at most 6 revisions (`.slice(0, 6)`). With `--full-history`, a
  path whose newest 6 matching commits all lack the blob (deletions or merges) would still return null. The real corpus
  gives 2 revisions for `SHELL.md` (B), so it does not bite today.
- **forget-rate, found not fixed:** a null `lastBlob` also MISCLASSIFIED demotions. With no blob, a demoted file
  cannot be matched in `attic/` and falls to DELETED. `--full-history` repairs this for the merge shape, but no test
  pins a demotion across such a merge.
- **forget-rate, the counts:** B's classification says the file count was never affected. I re-derived only the
  bytes figure and the `DELETED 2`.
