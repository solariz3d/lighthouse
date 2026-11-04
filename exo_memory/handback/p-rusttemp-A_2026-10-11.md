# p-rusttemp-A — D299 part 4: the Rust temp_dir() sites; seat A, 2026-10-11

Worktree `G:\consonance-worktrees\a-d299-wt`, branch `d299-a` from main `613921a9`. **One commit, local, named paths, not pushed: `02be494c`** — new `consonance/src-tauri/src/test_scratch.rs`; `main.rs` (+2 lines for the `mod`, and two helpers); `mcp.rs` (two helpers + `b_checkout`'s return type). No edit near `index_title`/`index_entry_line`.

## Classification (checked: a script over the four files, then the test run)
`grep -c "temp_dir()"` on `613921a9`: main.rs 21, cochlea_service.rs 3, mcp.rs 3, sync_launch.rs 3 = **30**. **All 30 are inside `#[cfg(test)]` code. None is live; no running app, hook or other seat reads any of these paths.** (inferred for "no seat reads them": they are per-pid or per-test names created and used by one test, and none is mentioned outside its own file; I did not grep other repos.)

The measure, not the grep: `cargo test --bin consonance` with TEMP/TMP pointed at an empty folder on G:, then count what is left. **Before: 1026 passed / 1 failed, 29 folders left.** They come from four helpers:
| helper | site | left per run | why |
|---|---|---|---|
| `tmp` (config merge) | main.rs:22015 | 7 `cfgmerge-<pid>-*` | removes the file, never the folder |
| `scratch` (seed tests) | main.rs:4977 | 4 `consonance_seed_test_*` | four callers never clean up (a fixed name, so it is overwritten next run, but not removed) |
| `fixture` (digest at ring) | mcp.rs:3256 | 17 `digest-at-ring-*` | no cleanup anywhere |
| inline (gates mode) | mcp.rs:3791 | 1 `gates-mode-<pid>` | file removed, folder left |

**Fix: cleanup on drop, not routing through the scratch root.** New `Scratch` guard (derefs to a path, so the helpers that returned a `PathBuf` return it and their callers did not change; one signature, `b_checkout`, followed). Root is `CONSONANCE_SCRATCH` if set, else the OS temp dir; **no `G:` literal** (D287 measured a timing difference on G: for ledger-union's race, and a drive literal is a portable-paths finding). A runner that wants G: sets the variable or TEMP, as js-suite already does. Why drop rather than janitor: it removes on a failing test too, so the janitor has nothing to sweep.

## The other 26 sites: left alone, with the reason
They create a folder (or only name a path) and remove it at the end of the same test: cochlea_service.rs 632/737/758; main.rs 1973, 2088, 4145, 6020, 6285, 8415, 12890, 13113, 14917, 15134, 15173, 15611, 15740, 16208 (`Room` already has a `Drop`), 18125; mcp.rs 2555 (`Fx` already has a `Drop`); sync_launch.rs 1919, 2363, 2986. Four more: main.rs 2308 (`tmp` writes one fixed-name FILE; its callers remove it, read at 2324-2354) and 9482 (`tmp` makes a folder; its callers remove it, the `remove_dir_all` calls after 9556), and 14936 and 15222, which only NAME a path that is never created. **The remaining exposure: a test that panics before its last line leaves its folder.** That is evidence of a failure, and the cost is one folder per failed test, so I left it.

## Checks
- Red first, by measure: the baseline above (29 left). New rows, one per helper (`the_cfgmerge_helper_leaves_no_folder_behind`, `the_seed_scratch_helper_leaves_no_folder_behind`, `the_digest_fixture_leaves_no_folder_behind`) plus 5 rows in `test_scratch.rs` (drop removes contents, a panicking test still cleans, `inside` removes the holder, derefs to a path, root honours the env var). They were not run on the old helpers: they need the new `Scratch` and `root`. The no-op-drop mutant stands in for red (below).
- After: `cargo test --bin consonance` (all 1035): **1035 passed, 0 failed, 5 ignored; 0 folders left.** Run through a runner that calls `heavy-run.hold()`, `CARGO_TARGET_DIR=G:/consonance-cargo-target-a299`.
- Mutants (seven, on the helpers): **applied 7 / caught 7 / NOT APPLIED 0.** Drop a no-op; `inside` removes the file not the holder; root ignores the env var; digest fixture, seed scratch and cfgmerge each remove a sibling instead of their folder; gates-mode guard deleted. **The last was caught only by the leftover COUNT (1), not by a row**: the test itself still passes. There is no row for it, only the measure.
- `portable-paths` exit 0, `carrier-drift` exit 0, after committing.

## Disclosed
- **One failure in the BASELINE run, not in the after run:** `dirs_guard_tests::a_panicking_writer_still_puts_dirs_back` (main.rs:4876, "a panicking writer left the slot set"). It passed in the after run with my change, and I did not touch that module. It reads like a parallel-test race on the shared `DIRS` slot. I did not run it repeatedly or on `613921a9` in isolation; **so it is unexplained, not cleared.**
- The 5 `ignored` tests were not run.
- Targeted run, not the collator's full suite.

## Not covered
`kill -9` leaks of a cargo test process (a killed run still leaves its folders, only now fewer), non-Rust temp creators, the `.ps1` ones.

NEXT: librarian collate; chair cherry-pick 02be494c onto main and watch dirs_guard_tests::a_panicking_writer_still_puts_dirs_back in the next full cargo test
