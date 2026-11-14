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
  `build\bin\dz-gym.exe` and `build\bin\dz-world.exe`. The stubs are compiled for the row by the .NET Framework's own C# compiler,
  `csc.exe` under the Windows folder's `Microsoft.NET\Framework64\v4.0.30319` (present on D, checked by `ls`), and exit with a code the
  row chooses. Its path is built at run time from the machine's system root (amendment 1 below).
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

## Amendment 1 (the chair's ruling of 03:16Z, written in before any code): no drive letter for the compiler

The ruling: "THE ROW THAT COMPILES ITS STUB PROGRAMS NAMES THE COMPILER BY A LITERAL DRIVE PATH … BUILD THE PATH FROM THE MACHINE'S
SYSTEM ROOT AT RUN TIME, with NO drive letter in the file (the test file or the registration). THE ROW STILL FAILS, AND DOES NOT SKIP,
where the compiler is absent."

- **In the test:** the compiler's path is `path.join(process.env.SystemRoot, 'Microsoft.NET', 'Framework64', 'v4.0.30319', 'csc.exe')`.
  - When `SystemRoot` is unset, or the file is not there, the row fails and names what it looked for. It does not skip.
  - The test file carries no drive letter for it.
- **In this file:** §3 first gave the compiler's path with its drive letter. That is reworded in place, and no drive letter remains for
  it here. Before the commit, `portable-paths.js` is run over the test file and this registration.

## Amendment 2 (pane B, before any code): a 3 counts only when it is exactly 3 AND the self-test said why

Both changes make the rule stricter. A 3 that is not the self-test's own is read as an ordinary red, which is today's reading.

- **Exactly 3, not "3 or more".** `if errorlevel 3` is true for 3 OR MORE. Exit 4, 255, or any positive crash code would then leave the
  script as "machine-bound" and get a re-read.
  - The script tests `if %ERRORLEVEL% EQU 3` instead, still before `if errorlevel 1`.
  - A new script row: a world stub exiting 4 leaves as 1, not 3.
- **A crash can exit 3 too.** The MSVC runtime's `abort()` "calls `_exit` to terminate the process with exit code 3" when the Windows
  error-reporting handler is not invoked (Microsoft Learn, C runtime reference, `abort`, read 2026-11-14). `std::terminate` ends in
  `abort()`, so an uncaught exception in `dz-world` can exit 3 with no machine-bound row at all.
  - So `check()` treats a 3 as machine-bound only when the first reading's output also carries the self-test's own summary,
    `selftest: machine-bound red only` (`selftest.cpp:653`). Without it, a 3 is red and nothing is re-read.
  - A new train row: the stand-in exits 3 without that line → red, and the re-read is NOT run.
  - A sixth mutant: drop the summary-line requirement.
- **Found, not fixed (outside this ruling):** `if errorlevel 1` is false for a NEGATIVE exit code, and a Windows crash code such as an
  access violation is negative as a signed int. inferred: a `dz-world --selftest` that crashes that way leaves the script as
  `CHECK GREEN`. I will check it with a stub that exits with a negative code and report the result in the hand-back. The line is not
  changed here, because the ruling keeps it "as it is".

## Amendment 3 (the chair's ruling of 04:07Z, written in before any code): a crash code is red on every line

The ruling: "YOUR SECTION 5 IS A HOLE IN THE LANDING GATE THAT GETS FIXED ON THIS BRANCH BEFORE IT LANDS … 2. A ROW, RED ON THE BRANCH'S
OWN TIP: a stub exiting with a CRASH CODE makes the script exit NON-ZERO, for EACH of the three red lines (suites, gym, world). 3. THE FIX:
"if not %ERRORLEVEL% EQU 0" in place of "if errorlevel 1", AFTER the exact-3 test. 4. ONE MORE MUTANT: the old form restored."

**The hole, measured on the base script (hand-back §5):** a world self-test stub exiting 0xC0000005 left the script as `CHECK GREEN`, exit
0. `if errorlevel 1` means "1 or more", and a Windows crash code is negative as a signed int.

**The row.** It runs on the branch's tip, red first. For each red line, a stub exits -1073741819 (0xC0000005) and the script must exit
non-zero and print that line's red:
- the suites, through a `build.bat` that ends `exit /b -1073741819`;
- the gym, through `dz-gym.exe`;
- the world, through `dz-world.exe`.

**The fix.** `if not %ERRORLEVEL% EQU 0 (… & exit /b 1)` replaces `if errorlevel 1` on the suites, gym and world lines. On the world line
it stays AFTER the exact-3 test.

**The mutant.** The old form, `if errorlevel 1`, restored on all three lines at once.

**Not changed (the ruling: "fix only this script on this branch"):** the submodule line, `:12` on main, has the same shape. It is reported,
not changed.

## 6. My bias

I wrote the exit-3 contract and proposed this re-read, so I have a stake in it being needed. That is why falsifier 2 is written to fire on
"never needed", and not only on "harmful".
