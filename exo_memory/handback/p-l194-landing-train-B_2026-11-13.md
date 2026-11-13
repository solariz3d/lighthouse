# p-l194-landing-train-B: the landing train (L194)

## WHERE IT STOPS (L, 13:5xZ)

- **State: built, landed, in use.** The code is on lighthouse main (`consonance/tools/landing-train.js`, last change
  12832fad). Batches it landed:
  - c9d520e (mine, 11:21Z);
  - cc8eea8 (four branches, 13:00:53Z, run by A).
- **Green:** rows 17 of 17 (`node --test consonance/tools/landing-train.test.js`). Mutants 20 of 20 at 6de66034. The 21st
  (12832fad, "a timeout waiting for the hold crashes the train") is written and NOT yet run.
- **Next command:** `node consonance/tools/landing-train.mutants.js`, about 6 min. It holds the lighthouse tree's lock;
  setting CONSONANCE_DATA to a scratch folder gives it its own.
- **Open, named, not built:**
  - a branch red alone is not checked against main alone, so a broken check or a red main sends an innocent branch back;
  - there is no withdraw verb (edit `landing-ready.jsonl`);
  - the train's exclusive hold parks the room while it waits for slots. My scratch `l194_waitfree.sh` waits for both slots
    free, no hold and the memory gate clear BEFORE starting the train. It is not in the train itself, and should be.
- **Only on L, needed again on the desktop in its own form:**
  - the train's worktree `Downloads\dz3-train`, with its build;
  - its staging folder `Downloads\dz3-train.promote`;
  - the config `C:\Consonance\data\landing-train.config.dreamzone-3.json` (L's paths);
  - the READY list and log, `C:\Consonance\data\landing-ready.jsonl` and `landing-train.jsonl`.
  - **On the desktop:** `git worktree add --detach <dir> main` in its dreamzone-3, then
    `git submodule update --init --reference <main checkout>\.git\modules\third_party\<name> -- third_party\<name>` for each
    of the four, then a config with that machine's paths (the keys are in the train's header).
- The check and the guard live in the repo (`consonance/tools/landing-train-dz3-check.cmd`, `-guard.cmd`). The memory gate
  is `exo_memory/loop/memwatch_2026-11-13.js`.

Packet: `[chair:MAIN]` 08:50:04Z (L194), from `loop/plan_l194_landing_train_2026-11-13.md` (560cb1ee). His pick, brief
item 183, `tech_foundation-4`: "Land green branches, drop the red one". Tier: prove it.

**State: built, proven, and its first batch is LANDED.** At 11:21Z it landed change 1 (the suites three at a time) and
generator Lap 1 as dreamzone-3 main **c9d520e**, pushed, read back and promoted.

## For his eye

- **Landings no longer wait for his game.** The train builds and tests in its own copy of the game folder
  (`Downloads\dz3-train`). It copies the new `dz-world.exe` and `dz-gym.exe` into his folder only when no game is running,
  and waits while one is.
- **Tests take half the time.** `build.bat test` runs three test programs at a time: 520 s instead of 1,088 s, at the
  same commit.
- **A branch that breaks the tests is sent back** with its failing lines named. The others land.

## What was built (all in lighthouse `consonance/tools/`)

- **`landing-train.js`**, with the verbs `ready`, `list`, `run`, `promote` and `reconcile`. A pane marks a branch READY
  (branch, sha, pane, lap). `run` then does this:
  1. merges every READY branch onto main in the train's worktree, aborting and naming a conflict by file;
  2. under the memory gate and the exclusive hold (taken per attempt, BelowNormal), runs the check;
  3. if red, sets the newest branch aside and retries the rest. A branch is named red, and leaves the list, only when it
     is red alone on main;
  4. if green: the credential scan (the push-gate hook's own `decide()`, failing CLOSED, its row written to
     `push-gate.jsonl`), then the privacy scan (below), then a fast-forward of main, the push, and a read-back by
     `ls-remote`. Then it stages the checked build and promotes it when no game runs;
  5. prints one `BOARD:` line for the seat to post. There is no path from a script to the board.
- **dreamzone-3's check and game guard:** `landing-train-dz3-check.cmd` (build at 4 jobs, `build.bat test`, both
  self-tests) and `landing-train-dz3-guard.cmd` (the L168 guard). `.gitattributes` keeps `*.cmd` and `*.bat` CRLF.
- **The config** is the data dir's `landing-train.config.dreamzone-3.json`, a machine's paths, so it is not in the public
  repo. `state-manifest.json` places the train's four data files (STAYS).
- **Rows:** `landing-train.test.js`, 16 rows (the plan's four and twelve more). `landing-train.mutants.js`: every row seen
  red by a mutant (below).

## The plan's three changes

1. **The suites in parallel** (dreamzone-3 `build.bat`, `ctest -j 3`).
   - Registered before its first run in its own commit message (7c13d77, rebased as 9a117a4): the count, the bar, the
     clock rows named in advance, and the expected wall time.
   - **The count, from measured memory** (private peak, 1-second samples of every suite's process during the L188
     landing): chase 2546 MB, nav 1260, world_app 1211, world 774, the rest under 160. Three together, about 5017 MB, stay
     under the 6144 MB of free commit memwatch's gate asks for. Four would be about 5791 MB.
   - **Shared things checked first:** no suite opens the renderer, a port, a named object or another process. sim_tests'
     fixed scratch files are its own, and CTest never runs two copies of one suite.
   - **The bar, checked at c9d520e:** 12 of 12 pass. Each suite's own count equals E's serial run at 682e699 (core 15,
     sim 154, model 16, world 24, nav 32, chase 64, audio 81, game 175, ragdoll 4, gen_walk 11, world_app 45), except
     gen_tests 36 → 61, which is Lap 1's own 25 rows in the same batch. Self-tests 26/26 and 52/52.
     - Main gained a twelfth suite, ragdoll_tests (E's L185), after the registration said 11. The bar is the same suites
       as main's.
   - **Wall time:** 520.55 s at `-j 3` (`Total Test time (real)`), against 1,087.7 s one after another at 682e699 (E's
     landing). My L188 landing took 1,092 s on a busy machine, and L174's 11 suites took 644 s on a quiet one.
     - This first run had no cost data, so chase and world_app started 51 s and 86 s in. Later runs order the longest
       first.
     - No separate timing run.
   - **Memory seen at -j 3:** the most at once was chase 2556 + world_app 1219 + gen_walk 137, about 3.9 GB.
   - **Clock rows named in advance** (nav stream_tests:95-100, audio device_tests:72): both passed. Neither needed
     RUN_SERIAL.
2. **The train.** Above, and proven below.
3. **Promotion without stopping his game.**
   - checked, the bar: `launch.ps1 world -Check` and `gym -Check` read "up to date" after the promotion. His
     `dz-world.exe` = the staged copy = the train-built one (sha256 5647642deb561e79…).
   - checked, **a stand-in game on the real machine** (11:24Z): a copy of `ping.exe` named `dz-world.exe`.
     - The guard said "dz-world.exe IS RUNNING".
     - `promote --wait` waited from 11:24:21 to 11:25:23, then promoted (byte-identical) once the stand-in had ended.
     - "up to date" afterwards.
   - The promoted build is the one that was CHECKED: it is staged at the landing, so the next batch can build in the same
     worktree without reaching his folder. A staged build is not promoted once main has moved past it, because a stale
     exe under a fresh stamp would read "up to date".

## Proven

- **The rows** (`node --test consonance/tools/landing-train.test.js`), 16 of 16. checked:
  - the plan's four: a red branch in a batch of three, a conflict (with a branch after it), a stand-in game, and a killed
    train (taskkill /T /F mid-check);
  - the scan refusing a planted key shape, a refused push, the scan failing closed, the privacy scan;
  - the checked build staged, a stale staged build refused, the board line;
  - the CLI as a pane types it, the check script under `NoDefaultCurrentDirectoryInExePath`, and the failing-row reader
    on dreamzone-3's lines and on a command cmd could not run.
- **The rows were written after the code, so each was SEEN red by a mutant:** `landing-train.mutants.js` (copies of the
  code in a temporary tree; the live file is never edited). Applied 20 / caught 20 / survived 0 / NOT APPLIED 0. The
  first run had one survivor (a conflict not aborted, hidden by the end-of-run clean); its row now has a branch after the
  conflict.
- **The push gate does not see a script's push. Proved on the real repo:**
  - a throwaway branch with a fake AWS key SHAPE, assembled at runtime, was READY alone;
  - the train ran with a no-op check, said plainly here, so that no build was spent on a branch that must never land;
  - it stopped with "the scan refused the push (deny: 2 credential-shaped line(s), e.g. l194_planted.txt:1 in
    d73db82); nothing landed";
  - main and origin did not move (682e699 / 8dda6d9), the deny row is at 10:20:33Z, and the key's text is in the ledger
    0 times;
  - the branch was never on origin (`ls-remote` empty), it is deleted, and the READY list is emptied.
- **The planted proof was also made through the hook itself** (L198, 10:38Z), once the push gate was installed on L.

## Found by the train's first real run (and fixed red first)

- **10:41Z, l194-ctest-j was sent back as "red alone on main: SUITES RED". It was not red.**
  - The check's `call build.bat test` was "not recognized".
  - A Claude Code shell sets `NoDefaultCurrentDirectoryInExePath=1`, so cmd does not search the current directory for a
    bare name, though `if exist build.bat` had just found the file. checked, in a probe from this shell: `call x.bat`
    not recognized, `call "%CD%\x.bat"` ran.
  - Fixed in 60e40f1f: the check calls `"%CD%\build.bat"`. Rows: the real check script on a stub `build.bat` with the
    variable set (red, then green), and the failing-row reader naming "is not recognized" (red, then green).
- **The batch ran the credential scan only, and the plan keeps "the credential and privacy scan".**
  - checked by hand over 682e699..c9d520e: clean.
  - Added before the next batch: `privacyScan` (an email address, an account path, an AppData path, a private folder) over
    the added lines and the messages. It fails closed and names file:line:commit:kind, never the text. Row red, then
    green; mutant caught.
- **The CLI read `--config` as the branch** (`ready --config FILE <branch>`). Found on its first use, fixed red-first
  (e74c3fcb).
- **`build.bat` leaves Ninja its default, about 34 jobs.** The check now builds at 4 (6c078d41), the room's rule against
  the low-memory reaper.

## Different from the plan, and why

- **"Drops the newest down to one ... The dropped branches go back"** would contradict its own test ("the other two
  land"). The train sets the newest ASIDE, still READY, and sends a branch back only when it is red alone on main.
- **The hold is per attempt,** not per train: a hold over 90 minutes is ignored by the lock, and a train of several
  passes can outlive one.
- **"One board line"** is printed, and the seat that ran the train posts it. A script has no path to the board.
- **No withdraw verb.** Taking a branch off READY means editing `landing-ready.jsonl`, as I did after the planted proof.
- **A gap, named not built:** a branch red alone on main is not checked against main by itself. A broken check (as at
  10:41Z) or a red main sends an innocent branch back. A control run of main costs one more check, only when a branch is
  red alone.

## The batch, in full

- **READY:** l194-ctest-j 9a117a4 (B, L194) and gen-lap1-measure ed0c765 (B, L196), both rebased on 682e699. The CHANGELOG
  conflicts were resolved by hand at rebase, keeping both entries.
- **Run:** started 11:02:16Z and waited for the exclusive hold behind C's and E's runs. Full first build of the worktree:
  354 steps at 4 jobs. Suites 05:09–05:18 local; self-tests green; "CHECK GREEN".
- **Land:**
  - credential scan allow (the train's own row 11:21:13.698Z) and privacy clean by hand;
  - main fast-forwarded 682e699 → c9d520e (merges ad89dd8 and c9d520e by the train);
  - pushed; checked: `ls-remote` = c9d520e.
- **Promote:** dz-world.exe and dz-gym.exe, byte-identical; stamp 11:21:20.83Z; -Check "up to date" for both.
- **Untouched:** his `game\config\world.local.txt` (sha256 e065fdad…, before and after).

## Could be wrong

- That three at a time stays under the gate when HE is playing. The gate checks memory at the start of each attempt, not
  during it. memwatch samples, and the train does not stop a run that has started.
- The 520 s against 1,088 s compares two different moments of a shared machine. It is the runs we made anyway, not a
  timing run.
