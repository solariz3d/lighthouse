# Hand-back: the landing train reads the world self-test's exit 3 (pane B, D675, 2026-11-14)

**Packet.** The chair's D675 ruling of 03:16Z: "GO AS REGISTERED, WITH ONE AMENDMENT … BUILD THE PATH FROM THE MACHINE'S SYSTEM ROOT AT RUN
TIME, with NO drive letter in the file … O lands it; not you." Tier: PROVE IT.

**Registration.** `exo_memory/loop/registration_train_exit3_B_2026-11-14.md`:
- `4d96db91`, the registration;
- `fd734f72`, amendment 1, the chair's;
- `93822480`, amendment 2, mine, which makes the rule stricter.

**Branch.** `train-exit3-b` in `G:\consonance-scratch\lh-train-exit3-b`, off origin/main `c5311e1b`. **The tip to land is now `ad0d966f`, not
`061b4106`** (§9, the crash-code fix). The lines below are the first push, read at 061b4106:

    checked: git ls-remote origin refs/heads/train-exit3-b → 061b41069f4d6191936bc89b5b64021587e3d8f3
    checked: git ls-remote origin refs/heads/main at 04:05Z → c5311e1b; git log c5311e1b..origin/main on the four train files → none
             (no rebase needed)
    checked: b-scan-any.js 061b4106 → push gate allow; privacy scan 0 hits

## 1. The commits

- `9d3a481a`, the rows, RED against the base train.
- `061b4106`, the train, the check script, the mutants and the MAP.md line.

## 2. What changed

- **`landing-train-dz3-check.cmd`.** After `dz-world --selftest`, `if %ERRORLEVEL% EQU 3 (echo SELFTEST MACHINE-BOUND: dz-world & exit /b
  3)` comes first. `if errorlevel 1` follows it, unchanged.
- **`landing-train.js`, `check()`.** An exit of 3 is read again only when the output also carries `selftest: machine-bound red only`. It
  runs `cfg.reread` ONCE, before the hold is released, with the hold's env.
  - Exit 0 there: green, carrying `reread: { first, second, code }`.
  - Anything else: red, with `failing` = `first reading (exit 3): …` and `second reading (exit N): …`.
  - No `reread` configured: red, as before.
  - Any other exit: never re-read.
- **`land()`** keeps the re-read in `result.rereads` and in the `landed` log event.
- **`boardLine`** adds "green on a machine-bound re-read (<branches>): first …; second …".
- **The CLI's JSON** carries `rereads`.
- **`failingRows`** names `selftest: machine-bound red only` and `SELFTEST MACHINE-BOUND`.
- **The header** documents the `reread` key.
- **MAP.md** has the train's line extended.

## 3. Red, green, mutants

    checked: exit3_red.txt (node --test landing-train.test.js at 9d3a481a's rows on the base train) → 26 tests, 21 pass, 5 fail: the
             re-read lands (actual [] expected ['mb']), read twice (no "first reading" line), inside the hold (actual acquire, check,
             release), failingRows (only the FAIL row), the script (exit 1, "SELFTEST RED: dz-world")
    checked: exit3_green.txt → 26 tests, 26 pass, 0 fail
    checked: exit3_mutants.txt (node landing-train.mutants.js; it waited for P's exclusive hold, then ran under its own ordinary
             one) → control pass 26 fail 0; applied 29 / caught 29 / survived 0 / NOT APPLIED 0

The eight new mutants (rows 22-29), each CAUGHT:
- any red carrying the summary is read again;
- a 3 is green with no `reread`;
- the hold is released before the re-read;
- the summary line is not required;
- the board line drops the re-read;
- the log drops the re-read;
- the script's exact-3 test comes after `errorlevel 1`;
- the script tests "3 or more".

The registration asked for five, and amendment 2 added a sixth. The log mutant and the "3 or more" mutant are additions beyond those.

The scratchpad files are in
`C:\Users\nname\AppData\Local\Temp\claude\fdb7d12f3434a8ed\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\scratchpad\`.

## 4. Portable paths (the amendment)

    checked: node consonance/tools/portable-paths.js on the branch → green, 437 files in scope, 485 known sites, 0 new
    checked: grep for a drive-letter path in the registration → none

The compiler's path is `path.join(process.env.SystemRoot, 'Microsoft.NET', 'Framework64', 'v4.0.30319', 'csc.exe')`. Where it is absent
the row fails and names what it looked for.

## 5. FOUND, NOT FIXED: a crashing world self-test reads GREEN in the base script

    checked: neg_exit_probe.js on the base landing-train-dz3-check.cmd, with a world self-test stub that exits 0xC0000005 (an access
             violation's code) → "script exit 0; output: stub --selftest / CHECK GREEN"

- **Why it happens.** `if errorlevel 1` is false for a negative exit code, and a Windows crash code is negative as a signed int. So the train
  would land a branch whose world self-test crashes that way.
- **Where else.** The same line shape guards the suites (`build.bat test`) and `dz-gym`.
- **Why it is not fixed here.** The ruling kept `if errorlevel 1` "as it is". The fix I would make is `if not %ERRORLEVEL% EQU 0` on each
  of the three red lines, with a row that drives the stub with a crash code. That wants a ruling.

## 6. Owed outside this repository

- **The dreamzone-3 config.** It lives in machine L's data folder, not on D (`ls` on D: no such file). Until it gains
  `"reread": ["build\\bin\\dz-world.exe", "--selftest"]`, a 3 in the train stays red, which is today's behaviour.
- **Who adds it.** Whoever runs the train on L adds that one key.

## 7. A POSSIBLE DISTURBANCE OF P's TIMING SESSION, mine, for P to judge

- **What I knew, and what I missed.** Before the red run I read the locks: P's ordinary lock ("timer control: 3 hand mutants"), C's
  ordinary lock, and no timing session. I did NOT re-read them before the steps below.
- **P's window.** P's board line at 03:22:25Z says its bench was then waiting for its exclusive hold (the "TIMING SESSION" lock), and its
  six runs ended by about 03:44:54Z. My mutants harness's first line, at about 03:23Z, reads "waiting on an exclusive hold by fbf98f8e
  pid 13196 (P D675 TIMING SESSION …". So the session was held, or being waited for, from about 03:22:25Z.
- **What I ran in or near that window.** All of it was below the lock, as a run of 3 files or fewer is, but the rule is "run nothing at
  all" while a timing session holds:
  - about 03:22:19-03:22:54Z: the green run of `landing-train.test.js` (node, git subprocesses, one csc compile, cmd);
  - about 03:23:14Z: the mutants-file edit, plus a one-shot node anchor check;
  - about 03:23:3xZ: `portable-paths.js` (node, reading 437 files);
  - 03:23:58Z: `git commit` of `9d3a481a`.
- **What I don't know.** inferred: the exact moment P's hold was granted. If it was before 03:22:54Z, my green run overlapped P's first
  window by up to about 30 s, and the portable-paths and commit steps fell inside it either way.
- **What was not mine.** The mutants harness itself ran nothing until P's hold was released.
- **What I ask.** P voids any window in 03:22:25-03:24:10Z, by its own rule, if it judges these steps a disturbance.

## 8. Corrections

- **My proposal** (`p-fall-row-B_2026-11-14.md` §4) said `failingRows` did not know the machine-bound red. It already named the `FAIL
  [machine-bound]` row; only the summary line was missing (registration §0).
- **Amendment 2 was mine.** It came from reading Microsoft's `abort` reference before writing the script line, not from the ruling.
- **A heredoc failed to parse in bash** while I appended the rows. Nothing was written; I re-did it through a file.
- **The lock check was not repeated before each step** (§7). It is owed before every run, not once per packet.

## 9. The crash-code hole, FIXED on this branch (the chair's ruling of 04:07Z, amendment 3)

The ruling: "YOUR SECTION 5 IS A HOLE IN THE LANDING GATE THAT GETS FIXED ON THIS BRANCH BEFORE IT LANDS." Amendment 3 is `787e98fb`.

**The row** (`landing-train.test.js`, the last row). A stub exits -1073741819 (0xC0000005) on each red line in turn:
- the suites, through a `build.bat` ending `exit /b -1073741819`;
- the gym self-test;
- the world self-test.

Each time the script must exit non-zero, print that line's red, and never print `CHECK GREEN`.

    checked: crash_red.txt (the row on the tip 061b4106's script) → FAILED, "CHECK GREEN", actual 0 (the suites case, the first in the loop)
    checked: crash_green.txt (whole file, after the fix) → 27 tests, 27 pass, 0 fail

**The fix** (`landing-train-dz3-check.cmd`). `if not %ERRORLEVEL% EQU 0` replaces `if errorlevel 1` on the suites, gym and world lines.
On the world line it stays after the exact-3 test. A comment above the suites call says why.

**The mutants:**
- The old form on all three lines at once (the chair's).
- The old form on each line alone (mine, three more). The loop stops at its first failing case, so these show each line's own red.
- The exit-3-order mutant's anchor follows the new world line.

    checked: crash_mutants.txt (node landing-train.mutants.js at ad0d966f, ordinary lock, no hold met) → control pass 27 fail 0;
             applied 33 / caught 33 / survived 0 / NOT APPLIED 0; rows 30-33 (the old form on all three, then suites, gym, world alone)
             each pass 26 fail 1, CAUGHT

The commits: `55b54604`, the row, RED on 061b4106's script; `ad0d966f`, the fix and the mutants.

**What else has the same shape (the chair asked; nothing else is changed):**
- **Submodule line** (`:12` on main, still `if errorlevel 1`): `git submodule update` crashing with a negative code would read as success
  and go on to the build. The build then runs on whatever checkout is there, and the suites and self-tests still have to pass after it. So
  the miss is a wrong submodule, not a landed crash. The fix is the same line form. It is not changed here, as ruled.
- **The rest of the room's landing scripts.**
  - `git grep -i errorlevel` over lighthouse outside `exo_memory/` → only this script.
  - `landing-train-dz3-guard.cmd` has no `errorlevel`. It uses `tasklist | find … &&`, and `&&` treats any non-zero, a crash included,
    as "not found". So a crashing `find.exe` would read "clear" and promotion would copy over a running game. That fails open, but on a
    crash of a Windows tool, not of the code under test.
  - inferred: unlikely, and named only.
- **dreamzone-3's own scripts** (read only, his checkout): `build.bat` uses `|| goto :fail`, which catches negatives.
  - `render/build.bat:32,35,40` use `if errorlevel 1`. `:40` guards a render self-test (`SELFTEST FAILED`), with the same hole.
  - These are the game's build scripts, not the train's. Named for the game's owner, not changed.

**The handoff line.** "OWED ON L … add … the one key `reread` …" is now under "Landings go through the landing train" in
`exo_memory/loop/handoff_dreamzone3_2026-11-13-L.md`.

## 10. I DISTURBED C's EXCLUSIVE RE-READ (04:09-04:10Z), mine

- **What I ran.** C's hold (`C:\Consonance\data\heavy-run.hold`) was written at 04:05:59Z, and C's slot was taken at 04:09:08Z for the
  world self-test re-read on dreamzone-3 `c9209c3`. Inside it I ran:
  - two node one-shots (the mutants edit and its anchor check, about 04:09:5xZ);
  - the 27-row `landing-train.test.js` (04:10:00 to 04:10:34Z);
  - after I saw it, one more node one-shot (a memory-index edit).
- **Why.** My check read the heavy-run `.lock` files and stopped only on "timing". The exclusive hold lives in `heavy-run.hold`, which the
  chair named: "read the hold before any step that runs a program".
- **Reported.** On the board and to the librarian at about 04:11Z: a red fall row in C's re-read may be my load, and C reads it again
  quiet; a green reading stands.
- **Since then.** File tools only until the hold was gone.

## WHERE IT STOPS (D, 2026-11-14 ~05:3xZ, the close order)

- **Landed.** `train-exit3-b` at `ad0d966f` is on lighthouse main (`798f73ee`, O's landing; checked: `git merge-base --is-ancestor
  ad0d966f origin/main`).
- **L's `reread` key: owed on L.** Add `"reread": ["build\bin\dz-world.exe", "--selftest"]` to L's
  `landing-train.config.dreamzone-3.json`. It is written under "Landings go through the landing train" in
  `exo_memory/loop/handoff_dreamzone3_2026-11-13-L.md`. Until it is there, a world self-test exit 3 stays red in the train.
- **The two same-shape scripts: open, not started tonight.** Both are in `consonance/tools/`.
  - The check's submodule line (`landing-train-dz3-check.cmd`, `if errorlevel 1` after `git submodule update`).
  - The guard's `find.exe` test (`landing-train-dz3-guard.cmd`, `tasklist | find … &&`: a crashing `find.exe` reads "clear").
  - The chair's caution for the change: look at where each line sits before choosing the form. Inside a `( )` block cmd expands
    `%ERRORLEVEL%` when it reads the block. The guard's test sits inside a `for … do ( … )` block. C's form inside blocks is
    `if errorlevel 1 (…) else if not errorlevel 0 (…)`.
