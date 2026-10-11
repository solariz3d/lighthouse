# p-soakclean-E · D300 part 3 of 3 (plan part 4): T-180's t180-soak- temp folders · pane E, on D, 2026-10-11

Plan: `exo_memory/loop/plan_queue_sweep_d300_2026-10-11.md`, part 4 (lighthouse main `700128c8`).
**Result: T-180 `b593422` + `a19798e` on `f5a5f56`, branch `d300-e`, worktree `G:\worktrees\e-d300-t180`, not pushed.** `a19798e` only corrects the new
test's header, which had claimed that mutation harnesses run the file, unchecked. Re-run after it: 7/7. Three files:
- `test/perf_soak.test.js`: the fix;
- `test/perf_soak_tempclean.test.js`: new;
- `CHANGELOG.md`: an Unreleased → Fixed entry.

Nothing in lighthouse changed except this hand-back and my map line. **No existing folder was deleted.** Every run was under the heavy-run lock, through
main's `heavy-run.js` by absolute path.

T-180 has no CLAUDE.md. Its README says how to run the tests (`node --test --test-concurrency=4 "test/*.test.js" "app/test/*.test.js"`) and its
CHANGELOG keeps Keep a Changelog under `[Unreleased]`. I followed both.

## 1. What creates them: one creator
- `git grep -n "t180-soak"` at `f5a5f56` → one hit: `test/perf_soak.test.js:53`, the `--progress` row (D181). It did
  `fs.mkdtempSync(path.join(os.tmpdir(), 't180-soak-'))`, wrote `progress.txt` into it, and never removed it: **one folder per run of the file.**
  The default suite runs that file every time.
- `git log -S "t180-soak-"` → introduced once, `8868531` (D182). No other creator in history.
- `grep -rni soak` over `src/`, `app/`, `scripts/`, `test/`, `tools/` and `src-tauri/` (`.js` `.mjs` `.cjs` `.json` `.ps1` `.rs`): `scripts/soak.js` writes
  `progress` only to the path it is GIVEN and makes no folder itself. No Rust or PowerShell source names the prefix.
- inferred: the count is high because the full suite runs many times a day, in the two-lane suite, the harnesses and the panes' runs. I did not
  attribute the 1,260 to particular callers.

## 2. The fix: finally
- The row now makes its folder, runs the soak and the assertion inside `try`, and removes the folder in `finally`
  (`fs.rmSync(dir, { recursive: true, force: true })`). A failed assertion or a thrown error no longer leaves it.
- **One test hook was added to that row, and only there.** If `T180_SOAK_TEMPCHECK_THROW` is set, the row throws AFTER the folder is made. Nothing else
  reads it, and only the new test sets it.

## 3. The test: counts what is left (delta 0, including on a failing run)
`test/perf_soak_tempclean.test.js` runs the `--progress` row in a child `node --test` whose `TEMP`, `TMP` and `TMPDIR` are a private folder, then counts
the `t180-soak-*` entries left in it. It has two rows:
- **after a passing run:** expects exit 0, and a control that `# pass 1` appears (the row really ran); then **0 left**.
- **after a run made to fail:** expects a non-zero exit, and a control that the failure is the planted one; then **0 left**.
- The private folder itself is removed in a `finally`.

**Red first, three states:**

| tree | row 1 (passing run) | row 2 (failing run) |
|---|---|---|
| `f5a5f56` (base) | **red: 1 left** (`t180-soak-eX4M8r`) | red, but only on its control (the base has no planted failure) |
| base plus only the planted-failure hook, no `finally` | **red: 1 left** (`t180-soak-xLoQug`) | **red: 1 left** (`t180-soak-ONyh6K`): the leak on failure, for the right reason |
| `b593422` (the fix) | green | green |

**Green, the covering tests:** `node --test --test-concurrency=1 --test-reporter=tap test/perf_soak_tempclean.test.js test/perf_soak.test.js` → **7/7 pass, 0 fail,
1.2 s.** That includes the short soak (60 seeded edits) and the `--progress` row, which in that run used the REAL temp folder: the real
`t180-soak-*` count was **1,260 before and 1,260 after.**

**Corrections to my own test before any green counted:**
- **The first base run was red for the wrong reason.** The child inherited `NODE_TEST_CONTEXT` from the runner and skipped its file ("run() is being
  called recursively"). The `# pass 1` control caught it, and the child's environment now drops that variable.
- **The second run's control failed because the child printed with the spec reporter.** The child now uses `--test-reporter=tap`.

**The full soak was not run.** `T180_SOAK=10000 node --test --test-concurrency=4 test/perf_soak.test.js` took 22.5 min when last recorded
(`handback/p-d176-read-B_2026-09-27.md:115`). This change does not touch the soak itself; only the 12-op `--progress` row changed, and it runs the
same in the full soak. C's d300 runs held the lock for most of this lap.

## 4. The folders already there (not deleted)
Counted in `%TEMP%` (`/tmp` in Git Bash) with `find`:

| | |
|---|---:|
| `t180-soak-*` folders | **1,260** |
| holding a `progress.txt` | 1,099 |
| empty | 161 |
| total size of the files | **67,911 B** (about 66 KB) |
| on disk, by `du` (4 KB clusters) | 1,099 KB |
| folder dates (mtime) | 896 on 2026-10-09, 364 on 2026-10-10 |

inferred: the 161 empty ones are runs killed between `mkdtemp` and the soak's first progress write, for example by a test timeout or a stopped
suite. I did not check which.

## 5. What it would take for the janitor to cover t180-soak- (not done, a separate ruling)
`consonance/tools/janitor.js` class (a) sweeps a `%TEMP%` folder only when its name starts with one of the room's OWN test prefixes. Those are read
from THIS repository's source by `sourcePrefixes(repo)` (`:56-77`), never hand-kept, so `t180-soak-` lands in "not the room's" (`:341`).

To cover it:
1. **A config key** for further source repos, read like `worktrees_dir` and `archive_dir`, e.g. `"janitor_source_repos": ["<t180 checkout>"]`.
   `sourcePrefixes` would run over each, and `t180-soak-` would be found by the existing rule (a literal ending in `-`; the mkdtemp suffix matches).
2. **Its tests:**
   - a row that a prefix from a second repo is swept and that one absent from both is not;
   - a row that the key unset leaves today's behaviour;
   - the mutants extended to match.
3. **The keeper's word that the room's janitor may delete files belonging to another repo's tests.** T-180 is his public project, not the room.

Once that holds, the existing 1,260 go at the next run (all are older than the 2-day floor), and the fix above stops new ones. Without it they
stay; at about 66 KB of data they cost inodes, not space.

NEXT: librarian collate D300 part 3 when this hand-back is read; the janitor coverage (§5) is a ruling for the keeper
