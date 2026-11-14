# Registration: the landing train reads `dz-world --selftest`'s exit 3 itself (pane B, D675, 2026-11-14, before any code)

**The ruling.** The chair's D675 order of 02:30Z, (a): "THE LANDING TRAIN READS EXIT 3 ITSELF (one re-run under the exclusive hold; exit 0
there lands with BOTH readings in its board line). REGISTER IT BEFORE CODE, AFTER the index-window row. Tier: PROVE IT."

- The index-window row is done: `exo_memory/handback/p-index-window-B_2026-11-14.md`, branch `index-window-b` at `1e6fe1f3`.
- The proposal: `exo_memory/handback/p-fall-row-B_2026-11-14.md` §4.
- The exit contract it reads: dreamzone-3 `fall-row-b`, pushed at `0a27786`. `selftest_exit_code` (`game/world/modes.h:107-108`) returns
  0 when every check passed, 3 when the only reds are machine-bound, and 1 for any other red.

**Base and files.** Base: lighthouse main, origin/main `c5311e1b` when read. The files:
- `consonance/tools/landing-train.js`
- `consonance/tools/landing-train-dz3-check.cmd`
- `consonance/tools/landing-train.test.js`
- `consonance/tools/landing-train.mutants.js`

## 0. What the train does today (read at origin/main `c5311e1b`)

- **The exclusive hold.** Every attempt's build and check already runs under the EXCLUSIVE heavy-run hold (`landing-train.js:45-46`,
  `check()` at `:187-209`, `defaultHold` at `:391`). So the train's FIRST reading is already quiet as far as the room's own runs go. A hold
  does not stop his game or a program outside the room.
- **The check script loses the 3.** `landing-train-dz3-check.cmd:19-20` runs `build\bin\dz-world.exe --selftest` and then
  `if errorlevel 1 (echo SELFTEST RED: dz-world & exit /b 1)`. So exit 3 leaves the script as exit 1, the same as any red.
- **The script's other exits.** Everything before line 19 leaves with 1 (`SUITES RED`, `SELFTEST RED: dz-gym`) or 2 (`BUILD FAILED`,
  `:9`, `:12`). So a 3 can only come from the world self-test.
- **What `failingRows` reads (`:103-110`).** It already names the self-test's machine-bound row, `FAIL  [machine-bound] <what>: <detail>`
  (`modes.h:102`, matched by `^FAIL\b`). It does NOT name the summary line, `selftest: machine-bound red only: re-read once under the
  exclusive hold before it counts (…)` (`selftest.cpp:653`).
- **How a result travels.** `runTrain` (`:241`) reads only `c.green`, `c.gated` and `c.failing`. `land()` records the rows. `boardLine`
  (`:401-410`) names what landed and what was sent back, and nothing about how the check went green.

## 1. The change

1. **The check script passes the 3 through.** After `dz-world --selftest`, `if errorlevel 3 (echo SELFTEST MACHINE-BOUND: dz-world & exit
   /b 3)` comes FIRST, and `if errorlevel 1 …` stays after it as it is. `errorlevel N` means "N or more", so the order matters (mutant 4
   below). `dz-gym` and the suites are unchanged.
2. **`check()` reads a 3.** On exit 3, before `h.release()` and so inside the same exclusive hold, it re-runs ONE command, `cfg.reread`,
   once. For dreamzone-3 that command is `build\bin\dz-world.exe --selftest` in the worktree, with the hold's env.
   - **Re-read exits 0:** green, and the result carries `reread: { first, second }`. `first` is the first reading's failing rows; `second`
     is the re-read's own summary line.
   - **Re-read exits anything else:** red, and `failing` names both readings.
   - **No `cfg.reread`:** a 3 is red, exactly as today, so a repository that has not opted in cannot go green on a 3.
   - **Any exit other than 3 never triggers a re-read.**
3. **The record.** `land()` keeps the re-read on the landing: in `result.rereads` and in the `landed` log event. `boardLine` then says
   "green on a machine-bound re-read: first <rows>; second <summary>" beside what landed. A batch that goes red after a re-read takes the
   train's existing path (set the newest aside, or "red alone on main") with both readings in its `failing`.
4. **`failingRows`** also names `SELFTEST MACHINE-BOUND` and the `selftest: machine-bound red only` summary line.
5. **The dreamzone-3 config** gets its `reread` entry. That config is the live one the train is run with, so I will name its path at build
   time and change only the one key.

## 2. Why re-read at all, when the first reading is already in the hold

- **Load the hold does not stop.** The hold quiets the room's own heavy runs, not the machine. The three reds of 2026-11-13 came with other
  seats' runs beside them, which the hold already prevents. But his game, a bench or a system task can still share the card and the CPU.
- **Passing load, or a held lag.** A second sample, taken right after inside the same hold, tells a passing load from a lag that holds.
  **A 3 twice in the hold is the branch's red.**
- **The unwelcome outcome, said before the run:** "a re-read is never green when the first reading was a 3 under the hold". If that is
  what the log shows, the train's first reading is already as quiet as a re-read can be. The re-read then buys nothing, and the honest
  rule is that a 3 in the train is red (falsifier 2).

## 3. Its tests, red first

All in `landing-train.test.js`, on the throwaway world the file already builds (`world()`, `:46-80`). The stand-in check gains one mode:
a file named `MB3` in the merged tree makes it print `FAIL  [machine-bound] the fall` and the summary line, then exit 3. The re-read
stand-in exits with the code written in a file the row controls, so one row can choose 0 or 3. A hold stand-in records each acquire,
release and run, in order.

**The rows:**
- **3, then a re-read of 0:** the branch lands, and `result.rereads`, the `landed` log event and `boardLine` all name both readings. Red
  today: the 3 is a red branch.
- **3, then a re-read of 3:** not landed. The branch is named "red alone on main" with both readings in `failing`.
- **3 with no `reread` configured:** red, as today. This row guards against an unconfigured repository going green on a 3.
- **1:** red, and the re-read is NOT run, so a re-read never launders an ordinary red.
- **Inside the hold:** the hold stand-in's record reads acquire, check, re-read, release. There is one hold, not two, and the re-read is
  not outside it.
- **The check script itself:** `landing-train-dz3-check.cmd` is run in a scratch dir holding a stub `build.bat` that exits 0, and stub
  `build\bin\dz-gym.exe` and `build\bin\dz-world.exe`. The stubs are compiled for the row by the .NET Framework's own
  `C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe` (present on D, checked by `ls`) and exit with a code the row chooses.
  - When the world stub exits 3, the script exits 3 and prints `SELFTEST MACHINE-BOUND`. Red today: it exits 1.
  - When the world stub exits 1, the script still exits 1 with `SELFTEST RED: dz-world`.
  - When the gym stub exits 3, the script exits 1: only the world self-test can produce a 3.
  - **If csc.exe is missing, the row FAILS and names the path; it does not skip.** I chose this over adding a test seam to the script.
- **`failingRows`:** it names the new lines.

**Hand mutants,** each added to `landing-train.mutants.js`, and each must turn a row red:
1. the re-read runs on any red, not only on 3;
2. a 3 counts green with no re-read;
3. the hold is released before the re-read;
4. the script's `errorlevel 3` check is placed after `errorlevel 1`, so it never fires;
5. `boardLine` drops the re-read.

I will report them as applied / caught / NOT APPLIED.

## 4. Falsifiers, before the run

1. **The re-read launders a real lag.** If a branch lands on a second-reading green, and the next train's first reading on main shows the
   same machine-bound row red under the hold, the re-read let a real lag through, and a 3 in the train is red. The train's own log can show
   this, because both readings are kept.
2. **Degenerating:** if, three dreamzone-3 train landings on, no re-read has ever been needed, or every one stayed 3, the change bought
   nothing. Say so, and keep it only if its cost is a few lines.

## 5. Not in it

- No change to `dz-world`, the hold, the push gate or the privacy scan.
- No other repository gets a re-read until its config names one.

## 6. My bias

I wrote the exit-3 contract and proposed this re-read, so I have a stake in it being needed. That is why falsifier 2 is written to fire on
"never needed", and not only on "harmful".
