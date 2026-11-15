# D675: C's lighting filter LANDED on the game's main, 8249d58, off by default. Every program exited 0, read directly (pane E, machine D, landing pane, 2026-11-13)

Ruling: the chair's D675 at 03:27Z (the landing), 04:07Z (each program's own exit code and passed line), 04:14Z (GO: the
tip c9209c3 is rung), 05:05Z (the interrupt: the relaunch had not run).

## The pushed sha

**main `8249d580a67df0646a22821b432c3711bf1310bb`** on the game's private remote.
- checked: `git ls-remote origin refs/heads/main` after the push → `8249d58`; the push printed `e0fcdec..8249d58`; the
  push gate allowed it at 05:20:48Z.
- It is the landing merge: first parent main `e0fcdec40a7029965889b4e269cef13b41e9a7a6`, second `d675-filter-c`
  `c9209c35920257fa6abc23d314cd57a7050bff94`, the tip C rang. A fast-forward of the remote's main.
- **Edited nothing.** checked: `git diff --stat c9209c3 8249d58` → empty: the merge's tree is C's tip exactly. No
  conflict (C had already merged `e0fcdec` in).
- **The scan:** 0 hits over the 10 commits not on main, added lines, the push scan's shapes.
- **No hook was touched.** The repository's hooks (post-checkout, post-commit, post-merge, pre-push) are as they were; I
  did not install or edit any.
- **His play clone is untouched:** `Desktop\dreamzone-3` at `31d1c6d`, `git status --short` empty.

## The two defaults, read off on the merged tree

checked: `grep -n "^light_filter \|^gi_bounces" game/config/world.txt` on `8249d58` →

    32:light_filter       = 0   (passes of the edge-aware filter over the raytraced light; 0: none)
    35:gi_bounces         = 1   (bounces of light off surfaces; 1 or 2)

Both are off. It goes on by default only at his word.

## The proof at landing: each program's own exit code, read directly, and its own passed line

How it ran:
- `landfilter.cmd` (beside this file) in `G:\consonance-scratch\dz3-e-landfilter`, under the ordinary heavy-run lock;
- at BelowNormal (checked: `Get-Process` → cl ×4, ninja and cmake all BelowNormal) and offscreen;
- each program's output in its own log, and **its exit code printed by `echo EXIT <name> %errorlevel%` on the very next
  line, never after a pipe, never by `if errorlevel 1`** (which reads a crash's negative code as green).

checked: `wrapper.log` → the EXIT lines; the three logs → each program's own passed line.

| program | its own exit code | its own passed line |
|---|---|---|
| `git submodule update --init --recursive` | 0 | (no output) |
| `build.bat test` | **0** | "100% tests passed, 0 tests failed out of 14" (Total Test time 542.53 s) |
| `dz-gym --selftest` | **0** | "selftest: passed (26 of 26 checks passed)" |
| `dz-world --selftest` | **0** | "selftest: passed (60 of 60 checks passed)" |

- **The world self-test exited 0, not 3 or a crash code.** No re-read under the exclusive hold was needed. Both Dark rows
  read ok.
- **The view self-test was not run;** the room's landing check does not run it. C's own count on the branch was view 30.
- The rows themselves, in `…_logs/`:
  - `build_test_summary.txt`: CTest's 14;
  - `gym_selftest_rows.txt`: 26 ok;
  - `world_selftest_rows.txt`: 60 ok.

## Corrections, said plainly: the first 50 minutes were a run that never started

1. **The first launch (22:14:52 local) left out BelowNormal,** so I stopped it within seconds, during cmake's configure.
   Its two logs are kept, moved to `G:\consonance-scratch\e-landfilter-logs\first-launch-stopped-2215\`.
2. **The relaunch (22:15:13 local) never ran the check.**
   - I put the BelowNormal `start ""` line inline in a PowerShell command, and its empty title quotes arrived mangled
     (`start \" /belownormal …`), so `start` ran nothing.
   - Its `cmd` (pid 32344) and heavy-run's node (pid 25928) held lock slot 2 for 50 minutes with no child and 0 s of CPU.
   - **I then misread the first launch's log ("Detecting CXX compile features - done") as the relaunch configuring,** and
     reported "still configuring". It was a stale file. My background wait for `cl.exe` was waiting on nothing.
   - **The chair caught it at 05:05Z,** reading the pids, their children and the logs' times. I confirmed each myself (the
     creation times 22:15:13 and 22:15:14 local, the command lines, no child), stopped exactly those two pids, and saw slot
     2 released (C's run then took it over).
3. **The second relaunch (23:06 local) put the `start` line in its own `.cmd` (`landfilter_bn.cmd`)** so no shell had to
   pass its quotes through.
   - Confirmed within a minute: `build_test.log` appeared at 05:06:25Z and grew from 9,387 to 27,166 bytes in 25 s, with
     the compiler at BelowNormal.
   - This run's results are the ones above.

**For the room:** a check of "is it running" must read a file or a process that was created by THIS launch. A log by
the same name from an earlier launch reads as progress and is not. Moving the old logs aside before a relaunch is what
made the 23:06 confirmation honest.

## After this push

P merges this main into `d675-timer-p` and rings it ready; then C runs row C again (the chair's order).

## WHERE IT STOPS (close of 2026-11-13)

- **The filter is landed (`8249d58`), off by default;** on only at his word.
- **The path of record's L1 (the fair clip tool), L8 (motion checks) and L7 (pose bench) are NOT started.** What
  `613c9ba`'s `--lean-film` already meets of L1 is in `handback/p-l185-refilm-E_2026-11-13.md`'s addendum.
- **Research for the game goes under `exo_memory/loop/`,** never `exo_memory/research/`.
- **Every branch of mine is on the game's private remote.**
  - checked: `git branch -r --contains` for each local branch and each worktree's head.
  - Pushed tonight, after that check: `l192-footsteps-e` `367fe1c` and `tell-row-kit-e` `535e152` (the tell row's kit
    scratch, which was on D only).
- **Nothing of mine is running or holding a lock.**
  - checked: `Get-CimInstance Win32_Process` over my scratch path, trees and labels;
  - the stalled pids 25928 and 32344 are gone;
  - neither lock nor the hold is mine.
- One process I did not start is still alive: a `grep.exe` (pid 19484) from 13:18 local, reading six seats' transcripts,
  its parent gone. I left it.
