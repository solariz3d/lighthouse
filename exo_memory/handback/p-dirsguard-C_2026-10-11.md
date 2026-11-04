# p-dirsguard-C — D300 part 2: the dirs_guard flake. Pane C (sibling-0845a868), 2026-10-11.

Branch `d300-c` in `G:/worktrees/c-d300-wt`, on main 700128c8. Not pushed.
- **931a9359**: the fix (test-only, `consonance/src-tauri/src/main.rs`, the `dirs_guard_tests` module).
- **c8c0404a**: the evidence folder `exo_memory/handback/p-dirsguard-C_2026-10-11_evidence/` (11 files: the runner, the dose patch, the mutant list and every log below).

## Verdict
**It reds, the cause is found, and it is fixed.** It was a race between the guard's own two test rows, not a race on the real `DIRS`.
- `a_writer_puts_dirs_back_when_it_finishes` and `a_panicking_writer_still_puts_dirs_back` shared one test-local pair, `TEST_LOCK`/`TEST_SLOT`.
- Each row asserts on the slot *after* its guard has released the lock.
- When both run at once, the row that finishes first can assert while the other row holds the lock with the slot set. So **either** row can go red.
- Its message is A's message exactly: "a panicking writer left the slot set".
- A's guess ("the shared `DIRS` slot") was one level off. `TEST_SLOT` is private to the module, and only these two rows touch it: checked: `git show 613921a9:consonance/src-tauri/src/main.rs | grep -n TEST_SLOT` → 6 lines, all in :4840-4871.
- `DirsGuard` itself is correct. The fix gives each row its own lock/slot pair (`WRITER_*`, `PANICKER_*`), with a comment saying why.

## Counts
The test binaries are built once per tree with `cargo test --bin consonance --no-run`, CARGO_TARGET_DIR on G: (`G:/ctarget/c-d296-{base,new,mut}`). Each binary is copied to `G:/consonance-scratch/c-d300/t*.exe`; the sha256s are in `job1.log`. Every run goes under the heavy-run lock via `lockrun.js`, and `runs.js` counts each run from the row's own `test … ok|FAILED` line.

Command: `node runs.js <exe> <src-tauri dir> <full|module> <N>`.
- `full` = the whole parallel binary, as `cargo test` runs it.
- `module` = filter `dirs_guard_tests`: its three rows in parallel, the same pairing the full binary schedules side by side.

| tree | mode | runs | the row red | the sibling row red | log |
|---|---|---|---|---|---|
| 613921a9 | module | 2000 | **4** | 0 | mod.log |
| a0ee8d16 | module | 2000 | **2** | **3** | mod.log |
| 613921a9 | full | 1 + 5 | 0 | 0 | time1.log, job1.log (1027 passed each) |
| a0ee8d16 | full | 5 | 0 | 0 | job1.log (1035 passed each) |
| **931a9359 (fix)** | module | 2000 | **0** | **0** | job1.log |
| 931a9359 (fix) | full | 5 | 0 | 0 | job1.log (1035 passed each) |

**Natural rate on the old pair, module mode: 11 reds in 4000 runs (~0.3%), in both directions.** Seeing the sibling row red too is what pins the shared pair: no other competitor exists.

**Why I didn't count it in the full binary alone:**
- A full run takes 78–113 s. At ~0.3% a run, one expected red takes ~350 full runs, about 10 h of the lock.
- So my 11 old-tree full runs at 0 red are **uninformative, not clearing**. The expectation was ~0.03 reds.
- Module mode puts the same two rows on parallel threads in ~70 ms, so 2000 runs fit in ~140 s.
- inferred: A's one red in one full run was a ~0.3% draw, or a higher rate under that run's load. I have not measured the rate under load.

## Red first: the dose
`dose.js` patches a **copy** of the module, never the commit tree; `build-dose.js` restores the source and checks its sha.
- The patch adds a 20 ms sleep inside each row's critical section, after it sets the slot.
- It also adds a 2 ms sleep between each row releasing its guard and its after-guard assertion.
- On the old shared pair, whichever row finishes first then asserts while the other holds the slot.

| binary | runs | either row red |
|---|---|---|
| a0ee8d16 + dose (old pair) | 200 | **200** (the row 182, the sibling 18) |
| 931a9359 + dose (a pair per row) | 200 | **0** |

The dose is the red-first row. The defect lives in a test's fixture, so a committed row would have to race on purpose to show it. Instead, the same dose goes red on the old tree and stays green on the fixed one.

## Mutants on the fix
Copy tree `G:/worktrees/c-d300-mut` at 931a9359; dose on; 200 module runs each (`mut.log`).

**applied 3 / caught 3 / NOT APPLIED 0; control F0: 0/200 red.**

| mutant | result |
|---|---|
| F1: the panicking row shares the writer row's pair again | caught, 200/200 red (the row 194, the sibling 6) |
| F2: the guard's Drop restores nothing | caught, both rows 200/200 |
| F3: Drop restores only when not panicking | caught by the panicking row, 200/200 |

F3 shows the panicking row still pins the unwind path on its own pair.

## Checks
- portable-paths on the worktree after both commits: green, 383 files in scope / 455 known sites / 0 new (`scratchpad/d300/portable.log`; run after the evidence copy, so not in the folder).
- Credential scan of the evidence folder: 0 hits (pattern grep).
- All three worktrees: 0 dirty after the runs (job1.log tail; `mut.log` "tree after: 0 dirty").

## Disclosed
- **Lock slot, my mistake.** My first runs started from the scratchpad, which puts them in heavy-run's shared "(not in a git tree)" bucket. So my mutant job sat behind E's T-180 suite for 30 min, then gave up as designed. I re-ran it from my own worktree, which is its own tree's slot by D286's rule, and it ran at once.
- **My scratch folder.** The 613921a9 full runs leaked 125 `cfgmerge-*` folders into my redirected TEMP, `G:/consonance-scratch/c-d300/tmp`. That is the pre-A-fix helper leak. I removed them; the folder was my own and held nothing else.
- **Not fixed: the global panic hook.** `a_panicking_writer_still_puts_dirs_back` swaps the process-wide panic hook. Any other test that panics in that window loses its panic message, but it is still marked FAILED. This was left as is, out of the race's scope. It needs a second hook-swapping test before it can misrestore a hook, and there is none.
- I did not run the full suite. The chair runs it before landing.

NEXT: librarian collate; chair lands 931a9359 + c8c0404a (d300-c) with the full cargo test. The row can come off the watch list.
