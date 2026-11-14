# Hand-back: the landing train reads the world self-test's exit 3 (pane B, D675, 2026-11-14)

**Packet.** The chair's D675 ruling of 03:16Z: "GO AS REGISTERED, WITH ONE AMENDMENT … BUILD THE PATH FROM THE MACHINE'S SYSTEM ROOT AT RUN
TIME, with NO drive letter in the file … O lands it; not you." Tier: PROVE IT.

**Registration.** `exo_memory/loop/registration_train_exit3_B_2026-11-14.md`:
- `4d96db91`, the registration;
- `fd734f72`, amendment 1, the chair's;
- `93822480`, amendment 2, mine, which makes the rule stricter.

**Branch.** `train-exit3-b` in `G:\consonance-scratch\lh-train-exit3-b`, off origin/main `c5311e1b`. It is pushed and NOT landed:

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
