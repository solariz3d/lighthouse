# P-FIXEDTEMP-B: fixed-name temp files, and the gates-mode row (pane B, machine D, 2026-10-11, lap D300 part 3)

Plan: `loop/plan_queue_sweep_d300_2026-10-11.md`, "Part 3 REPLACED" (main `0d08cec7`). Branch `d300-b`, worktree `G:\b-d300-wt`, from `0d08cec7`; not pushed. Code commit `10376635`: `consonance/tools/guard-census.js`, `consonance/tools/guard-census.test.js`, `consonance/src-tauri/src/mcp.rs` (only `trailer_gate_tests`; nothing in `dirs_guard_tests`), and this file.

## The answer first
- **One LIVE collision, fixed: `consonance/tools/guard-census.js`.** Its crash-restore record was one fixed `inflight.json` in the OS temp dir, shared by every run on the machine whatever tree it mutated. A second run starting mid-sweep "restored" the first run's mutated file under it, so that mutant was scored SURVIVED. Two runs inside `withRestore` also unlinked each other's record. Its four work copies (`work-blackbox`, `work-canfail`, `work-selfcheck`, `wt-blackbox`) are fixed names too, and every arm deletes its copy before rebuilding it.
  - Fix: one record per run, `inflight-<pid>.json`, restored only when its pid is dead; the pre-D300 bare name is still restored. Every arm that touches a work copy takes the tool's own visible, pid-checked lock on the scratch folder, so a second run refuses (exit 3) instead of deleting the first one's copy. The names stay, because `--skip` resumes reuse the copy and `cleanup` names them.
  - Red first: 3 of the 4 new rows FAILED on `0d08cec7`'s code (the 4th, the pre-D300 record, is a compatibility row and is green on old code by design). Mutants: **applied 11 / caught 11 / NOT APPLIED 0**, control survived.
- **(b) the gates-mode row: added and shown catching.** The guard now lives in a tagged helper, `gates_mode_dir(tag)` in `mcp.rs` `trailer_gate_tests`, which returns a `Scratch` that owns the folder. The switch test takes its folder from it, and the new row `the_gates_mode_folder_is_gone_after_the_test` holds one, drops it, and asserts the folder is gone. Mutants on the guard: **applied 2 / caught 2 / NOT APPLIED 0** (B1 the helper removes a sibling instead; B2 the helper owns a holder it never made), both failing at the row's assert, `mcp.rs:3809`.
  - The tag matters: inside one cargo process every test shares a pid, so the row and the switch test must not share one `gates-mode-<pid>` folder (§3).
  - What it does not pin: the switch test leaks again only if someone replaces its `gates_mode_dir("switch")` call with an unguarded path. That is a visible edit, not a one-line deletion, and no row can watch another test's folder while the two run in parallel.
- **Two more live fixed names are listed, not changed:** `mutant-harness` (a second run refuses loudly; the fixed `target/` is the cargo cache by design) and `second-vantage`'s `vantage_cell` (clock-fired once a day; the name is load-bearing). **Every other fixed-name site is test-only.** All are in §2, with why each is safe or how it can collide.

## 1. How the sites were found (checked)
- Rust: `grep -n "temp_dir()" consonance/src-tauri/src/*.rs` (27 sites outside `test_scratch.rs`) plus `test_scratch::root().join(` (3 sites: A's D299 helpers). `grep '"TEMP"\|"TMP"\|%TEMP%\|$env:TEMP\|GetTempPath\|tempfile'` over the crate: 0. So no live Rust code writes into the temp dir by any route this grep sees; A's D299 count (all 30 `temp_dir()` uses in `#[cfg(test)]`) stands.
- JS: every line in `consonance/**/*.js` (node_modules excluded) matching `os.tmpdir()`, `tmpdir()`, `process.env.TEMP|TMP|TMPDIR` or `scratchRoot(`, minus `mkdtemp`: 116 lines in 31 files. Each read in context.
- **A name counts as FIXED** when two runs compute the same path: no pid, uuid, timestamp or mkdtemp suffix. A pid-only name is unique across runs; see §3 for where it is not.

## 2. Every fixed-name site, classified
### Live (tools a seat runs)
| site | name | collides? | outcome |
|---|---|---|---|
| `tools/guard-census.js:71`, `inflightPath` | `<tmp>/guard-census/inflight.json` | **yes**: any two runs on the machine, any trees (the tree lock is per tree) | **FIXED** (above) |
| `tools/guard-census.js` work copies | `work-blackbox`, `work-canfail`, `work-selfcheck`, `wt-blackbox` | **yes**: two runs of the blackbox arms; each `rmSync`s the copy first | **FIXED**: `lockScratch` |
| `tools/mutant-harness.js:107` | `<tmp>/mutant-harness-<label>/{wt,target}` | two runs of the SAME config at once (heavy-run allows 2 slots) | **listed, not changed.** The second run's `git worktree add` onto the existing `wt` fails and it returns 2 before its `try`, so it refuses loudly and never removes the first run's tree. The fixed `target/` is the cargo cache on purpose (a per-run name would rebuild the crate every run). A run killed by `kill -9` leaves `wt` registered, and the next run refuses until it is removed: loud, not silent |
| `tools/second-vantage.js:116`, `DEFAULT_CELL` | `<tmp>/consonance/vantage_cell` | only two concurrent runs: it is clock-fired once a day (`cron '5 9 * * *'`, header `:4-5`) and runs its readers one after another | **listed, not changed.** `prepareCell` empties the cell before each reader and refuses, recorded as READER-FAILED, if it will not empty. inferred: a manual run during the clock run could empty a live reader's cwd. The name is load-bearing (`:114`: the transcripts' project folder is named from it), so a per-run name is not a free fix. The chair's call whether a second lock is worth it |
| `hooks/second-reader-worker.js:190` | `cwd: os.tmpdir()` | no: a cwd, nothing written by name | safe |

### Test-only
Under `js-suite.js` every test file gets its OWN temp folder as TEMP/TMP/TMPDIR, removed in a `finally` (`js-suite.js:310-321`, D287), so a JS test's fixed name cannot meet another run's. The collision is only when a test file is run directly with `node`, two at once.
| site | name | note |
|---|---|---|
| `hooks/dream-gate.test.js:231` | `dreamgate-instances` | written, removed at the end of the file (`:387`) |
| `tools/guard-census.test.js:115/125/133` | `census_prod.rs`, `census_helper.js`, `census_reporter.js` | written, never removed (a leftover per direct run; under js-suite, inside the private temp) |
| `hooks/board-digest.test.js:128` | `roster-cwd` | inferred: a cwd value in a fixture; no write to it found |
| `tools/replay-check.test.js:162-163` | `rc-data`, `rc-cfg` | only resolved as paths, never created |
| name-only, never created | `jev-flags-nowhere`, `no-such-sound.wav`, `definitely-not-here-xyzzy.txt`, `no-such-tj1-transcript.jsonl`; Rust `no-such-room-at-all` (`main.rs:14948`), `night_table_no_such_bed` (`:15234`) | each test asserts on a path being ABSENT; one only changes if someone creates that exact path |
| Rust `main.rs:2310` `tmp()` | `consonance-test-<name>.txt` | written, each caller removes it. **Two concurrent `cargo test` runs** (two heavy-run slots, separate worktrees, same TEMP) can interleave on one name; cargo tests are not under js-suite's private temp. Outcome: a spurious red, not data harm |
| Rust `main.rs:4979` `scratch(tag)` (A's D299) | `consonance_seed_test_<tag>` | `remove_dir_all` first, removed on drop. Same two-cargo-runs exposure: the second run's `remove_dir_all` can delete the first run's folder mid-test. Spurious red |
| Rust `main.rs:15146`, `:15185` | `night_table_test_<tag>`, `night_table_test_aggregate` | `remove_dir_all` first, removed at the end. Same exposure |

inferred: the Rust test exposure needs two `cargo test` runs on one machine at once with the same TEMP. The heavy-run lock allows two slots, so it can happen. Not fixed: it is test-only and its outcome is a red that a re-run clears. A runner that sets TEMP per run, as js-suite does for node, would close all of them at once.

## 3. Pid-only names are not unique inside one cargo process
A cargo test binary runs its tests as threads of ONE process, so `<name>-<pid>` is shared by every test in the run. A helper called by two tests with the same name races with itself. That is why (b)'s helper takes a tag. checked: the other pid-named helpers take a per-test tag (`scratch("guard")`, `scratch("mapdir")`, …, main.rs:4168-6056). I did not audit every pid-named site for two tests sharing one tag.

## 4. Checks
- **(b), Rust** (checked: `scratchpad/d300b/rust.out`, `rustmut.js`):
  - `cargo test --bin consonance trailer_gate_tests::` → "test result: ok. 17 passed; 0 failed", including the new row and `d277_the_switch_reads_only_light_as_light`.
  - Red first: the row cannot run on `0d08cec7`, since the helper it calls is new. The mutants stand in: B1 and B2 each make it FAIL at `mcp.rs:3809` ("the gates-mode folder outlived the test"). `mcp.rs` restored after, sha256 unchanged: true.
  - Not run: the full cargo suite (the collator's) and the 5 ignored tests.
- **guard-census, red first** (checked: `scratchpad/d300b/red2.out`, the old `guard-census.js` from `0d08cec7` beside the new test, in a scratch copy with a runner that reports every row):
  - FAIL "a second run does not restore a LIVE run's mutation under it": "a second run put the original back mid-mutation";
  - FAIL "a killed run's mutation is restored by the next run, found by its pid": `false == true`;
  - FAIL "every arm that touches a fixed-name work copy refuses …": "canfail: the second run deleted the first run's work-canfail";
  - ok "a record left under the pre-D300 name is still restored" (compatibility, green by design).
  - The copy also fails three old rows that read repo files by relative path (ENOENT in a scratch copy); they pass in the worktree.
- **Green in the worktree:** `node consonance/tools/guard-census.test.js` → 44 passed (`green2.out`).
- **Mutants** (`scratchpad/d300b/mut.js`, `mut.out`, in the scratch copy, never the worktree): **applied 11 / caught 11 / NOT APPLIED 0**, control survived. M1 restore ignores liveness; M2 record name ignores the pid; M3 restore reads only the bare name; M4 pidAlive always false; M5 the bare pre-D300 name skipped; M6 lockScratch a no-op; M7–M11 each arm (canfail, selfcheck, cleanup, history, blackbox mutation) without its lock.
- Every node and cargo run went under the heavy-run lock through `scratchpad/d273/run.js` (main's `heavy-run.js` by absolute path); `CARGO_TARGET_DIR=G:/ctarget/b-d300`.
- **portable-paths after committing `10376635`:** "green — 383 files in scope, 455 known sites, 0 new" (`scratchpad/d300b/portable.out`).

## 5. Seen, not in scope
- `selfcheckTools` (`guard-census.js:1006`) mutates `tools/` in place with a bare `try/finally`: no `withRestore` record and no tree lock. A kill mid-control leaves a perturbation in the tree. Not a temp-dir name, so not changed.
- `.ps1` creators were not surveyed (the packet names Rust and JS).

## Corrections to myself
- My first red-first copy lost its runner patch to a shell quoting slip (the patched line broke on a `\n`), and the copy did not parse. I rebuilt it with a script file (`mkcopy.js`) and re-ran; no result came from the broken copy.
- I ran `node consonance/tools/guard-census.js --help` once outside the lock to see its usage. It is an unknown command there and exits 1 before doing anything.

NEXT: librarian read D300 part 3; the chair lands d300-b with the full suite
