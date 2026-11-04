# p-tempclean-A — D287 part 1: every harness deletes what it makes; seat A, 2026-10-10

Worktree `C:\Users\nname\Desktop\worktrees\a-d287-wt`, branch `d287-a` from main `e9488fc5`. **Three commits, local, named paths, not pushed:** `964f53b0` (scratch.js, gen-consumer.js, js-suite.js, scratch.test.js), `91ae4167` (121 files: every other creator), `62e776c7` (js-suite removes a KILLED file's folders too). 123 files, +566 −287 against `e9488fc5`. Heavy runs went through **main's** `heavy-run.js` by absolute path (the chair's rule), from a runner in my scratchpad.

## What it does
- **`consonance/tools/scratch.js` (new).** `scratchRoot()`: `CONSONANCE_SCRATCH` if set, else `G:\consonance-scratch` when a G: drive exists (`CONSONANCE_SCRATCH_DRIVE` picks another letter), else the OS temp dir. `mkdtemp(prefix[, root])` makes a folder there and **removes it at process exit** (normal end, uncaught throw, `process.exit(n)`); `keep`, `rm`, `withDir` (a `finally`), `tempEnv`.
- **gen-consumer.js (the 21 GB one).** `build()` removes its staging folder if it throws; the CLI removes it as soon as the build is done, including on a refusal. `--keep-staging` keeps it and prints where. (The old refusal text said "staging kept for inspection"; it kept it by leaving it behind.)
- **js-suite.js — the move that reaches every creator.** Each test file runs with its own `TEMP`/`TMP`/`TMPDIR` **and** `CONSONANCE_SCRATCH` inside a fresh folder under the scratch root, removed in a `finally` whether the file passed, failed, crashed or was killed by the timeout. So the creators nobody looked at are covered too. It also passes the machine's real temp dir as `CONSONANCE_OS_TMP`.
- **Creators converted to `scratch.mkdtemp` (mechanical, by a codemod in my scratchpad, every file `node --check`ed):** 263 sites in 111 test files, the 8 `*.mutants.js` runners, `identity-diff.js` (its `--generate` path left a folder on a refusal), `second-vantage.js`. A direct `node --test file` now cleans up too, not only js-suite.
- **Leaks the grep could not see, found by running the suite:** `dream-dirs` and `stick-dirs` write `<home>-probe.ps1` BESIDE the home folder; `jev-shadow-runner` writes a `-sibling` folder beside its store. Removing the home never removed them. Each now removes its own in a `finally`.

## Before / after counts, per prefix
Method (`scratchpad/d287_measure.js`): each of 13 files that leaked is run **directly** (`node --test <file>`) with `TEMP`/`TMP` and `CONSONANCE_SCRATCH` pointed at private empty folders; whatever is in them afterwards is what that file leaked. BEFORE = a fresh detached worktree at `e9488fc5` (`a-d287-base`, since removed); AFTER = my tree. Same files, same pass counts.

| file | pass | left BEFORE | left AFTER |
|---|---|---|---|
| sources-gate.test.js | 58 | 51 (`sg-test-`) | 0 |
| reply-slot.test.js | 36 | 28 (`rs-test-`) | 0 |
| second-reader.test.js | 29 | 30 (`sr-test-`) | 0 |
| actors.test.js | 20 | 13 (`actors-*`) | 0 |
| jev-judge.test.js | 42 | 69 (`jev-judge-`, `-home-`, `-inst-`) | 0 |
| js-suite.test.js | 1 | 56 (`jssuite-` 45, `-corpus-` 6, `js-suite-deny-` 5) | 0 |
| usage.test.js | 27 | 28 (`usage-`) | 0 |
| dream-dirs.test.js | 2 | 5 (`dream-home-*-probe.ps1`) | 0 |
| stick-dirs.test.js | 2 | 5 (`stick-home-*-probe.ps1`) | 0 |
| board-compact.test.js | 22 | 13 (`board-compact-`) | 0 |
| blind.test.js | 24 | 20 (`blind-`, `blindboard-`, `blind-data-`, `sealed-`) | 0 |
| lap-row.test.js | 135 | 14 (`lap-rec-`, `lap-emptyrec-`, `lap-norepo-`) | 0 |
| gen-consumer.build.test.js | 6 | 1 (`build-gate-`) | 0 |
| **total** | | **333** | **0** |

Rows (`consonance/tools/scratch.test.js`, 13 rows, `node --test scratch.test.js`): the root choice (env, G: when it exists, fallback, off-Windows, malformed drive, a probe that throws); `withDir` on return and on throw; a child process ending normal / uncaught throw / `process.exit(3)` leaves no folder; gen-consumer **refused run** delta 0, **`--keep-staging`** keeps one, **`build()` throwing after staging** delta 0; js-suite with a passing, a failing, a throwing and a **timeout-killed** file delta 0, and the child's `TEMP` really is redirected. Each gen-consumer / js-suite row counts BOTH a private OS-temp dir and the scratch root, so an unfixed creator leaks into a place that is counted (my first draft counted only the root and passed vacuously on the old code; caught and rewritten). **Red first:** against the old gen-consumer.js and js-suite.js, 6 of the 12 rows then written were red (the other 6 test scratch.js itself); the 13th (killed file) was added later and goes red when its one word is reverted.

## Checks (all run this lap)
- **Full js-suite, final tree `62e776c7`, under a heavy-run slot, `JS_SUITE_TIMEOUT_MS=400000`:** `node consonance/tools/js-suite.js --quiet` → **172 green · 0 failed · 0 crashed · 0 silent · 1 canary · 1 not-run (of 174)**, exit 0, 1040 s; the scratch root was **empty** afterwards (0 entries). Earlier full runs found and I fixed: 4 reds in run 1 (delete-gate, push-gate — their MSYS `/tmp/…` rows need the folder Git Bash maps `/tmp` to, now `CONSONANCE_OS_TMP`; dispatch-gate — its self-copy mutation row needed an absolute scratch require; portable-paths — two drive-letter constants in my own test); 1 in run 2 (**ledger-union**, below); 2 timeouts in run 3.
- **Mutants on scratch.js** (`scratchpad/d287_mut.js`, 8 mutants, run against `scratch.test.js`): **7 caught, 1 survived** — "`rm` leaves the folder tracked in the exit set", an equivalent mutant (the exit hook's `force` removal of an already-gone folder is a no-op). Caught: no exit hook, folder not registered, G: never chosen, `withDir` without `finally`, `keep` that does not keep, env override ignored, an explicit root silently swapped.
- `node consonance/tools/portable-paths.js` → green (375 files, 420 known sites, 0 new). `node consonance/tools/carrier-drift.js` → GREEN. `node consonance/tools/gen-consumer.js --dry --json` → refused null, leaks 0, declareDrift 0, unclassified 0, staged 406, unportable 35 (so scratch.js ships and the generator is not disturbed).

## Where I did NOT follow the plan, and why — say so if wrong
- **ledger-union.test.js keeps its folders on the real OS temp dir, not G:.** Its "hot writer" rows race a tight append loop against the union's rename+`linkSync` placement and lose **50 placements in a row** (`could not place the union … (EEXIST)`). Measured: **2 of 8 direct runs failed with the scratch root on G:, 0 of 8 with it on C:**; with `OS_TMP` back on C: it passed 4/4 and the final suite. So the test (and maybe `ledger-union.js`'s placement loop) is timing-sensitive to the disk. **I held the disk as it was and did not touch `ledger-union.js`.** It is still removed at exit. Worth a look by whoever owns ledger-union: on a fast drive a real hot writer could do the same.
- **delete-gate.test.js and push-gate.test.js** also keep real-OS-temp (their MSYS `/tmp` rows need it), still removed at exit.
- **`--keep-staging` is new behaviour:** the CLI used to leave staging behind on every run; it now removes it. `identity-diff.js --generate` and anything else that read `report.staging` AFTER the CLI returned would break; I grepped the call sites in the repo (the tests read `r.staging` in-process, which still exists because `build()` returns it) but did not check scripts outside the repo.

## What I did not check
- **Rust.** 29 `temp_dir()` uses in `cochlea_service.rs` (3), `main.rs` (20), `mcp.rs` (3), `sync_launch.rs` (3) were not looked at or changed; `cargo test` leakage is unmeasured. (Not asked as JS-only grep; flagged.)
- **A process killed outright (`kill -9`, power loss, a Stop-Process)** runs no exit hook. Only js-suite's runner-side `finally` covers that (a timeout-killed child), and only for files run through js-suite. The janitor (part 2, E) is the cover for the rest.
- **Creators the codemod did not match**, left as they were: `mkdtemp(path.join(tmp, …))` inside an already-scratch parent (cleaned with the parent); `score-portable.test.js` (honours `DIVERSITY_RUN_DIR`); fixed-name temp files and folders such as `dream-gate.test.js`'s `TMP_INSTANCES`, `ask.test.js`'s `askprov-store-<pid>.md`, `*.test.js` that `writeFileSync` straight into `os.tmpdir()`. I did not enumerate those.
- **Non-JS creators:** `.ps1`/`.py` — a grep for `mkdtemp|tmpdir|gettempdir|tempfile` over `*.py` found none; I did not grep `.ps1` for `[IO.Path]::GetTempPath()` / `$env:TEMP`.
- **The ~93,000 folders already in `%TEMP%`** are untouched (the janitor's job; another seat was sweeping while I worked, so a TEMP-wide before/after cannot be mine — the per-file table above is the clean measurement).
- **mutants runners** were converted by one regex and `node --check`ed; I did not run the nine mutant harnesses.
- **Cargo and `CARGO_TARGET_DIR`:** I ran no cargo.
- **gen-consumer.test.js takes 152 s standalone on the OLD tree (174 s on mine; same 107/107)** — over js-suite's 120 s per-file default. It timed out once in a loaded run (with state-sync.test.js) and passed in two others. Pre-existing, not a regression of this change; raising `JS_SUITE_TIMEOUT_MS` or splitting the file is not mine to do.
- The first full run died silently (the runner I detached from a shell was killed with it; it left 11 files in the scratch root, which I removed since they were mine). Not a repo defect.

## Landing notes for the chair
- `consonance/tools/scratch.js` is new and imported by 120 files; it ships in the consumer tree (the dry run shows it staged). `G:\consonance-scratch` is created on first use.
- If part 2's janitor learns the scratch root, its class (a) should also sweep `G:\consonance-scratch` (and older `js-suite-tmp-*` folders in it) — I am not doing that, it is E's file.
- The worktree `a-d287-wt` can go after landing; the scratch measuring folders are in my scratchpad.

NEXT: chair cherry-pick 964f53b0 91ae4167 62e776c7 onto main (or merge d287-a) and run the full js-suite once; E reads the "Landing notes" for the janitor
