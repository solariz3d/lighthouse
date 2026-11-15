# p-l206-game-current-B: his copy of the game on L made current (L206)

Packet: `[chair:MAIN]` 2026-11-14 06:41:15Z, "ONE JOB, LEDGER L206. MAKE HIS COPY OF THE GAME ON L CURRENT". Tier: check it. A local
build of what is already on the remote: nothing landed, nothing pushed to the game's remote.

## WHERE IT STOPS (L, 07:0xZ): done

- **His clone** `Downloads\dreamzone-3`: on main at **99b6045**, clean, by fast-forward from **31d1c6d**.
- **His programs:** `build\bin\dz-world.exe` and `dz-gym.exe` there are the 99b6045 build that read green below, copied byte for
  byte.
- **His launcher:** `launch.ps1 world -Check` and `launch.ps1 gym -Check` both print **"up to date"**. launch.ps1 was never run
  without -Check.
- **The train config on L has its `reread` key** (item 6 of "What L owes").
- **Nothing is left running:** no build, test or dz process; the exclusive hold and both slots are free.
- **Untouched:**
  - his `game\config\world.local.txt` (sha256 e065fdad…, the same after);
  - his run files;
  - `Downloads\dreamzone-2`.
  - No AC launch.
- **Left behind, all mine and none needed:**
  - `build\l206-before\` in his clone (5,794,896 bytes). It holds the two programs and the stamp this replaced (sha256 below), in case
    he wants 31d1c6d back.
  - The train's worktree `Downloads\dz3-train`, detached at 99b6045 with its build. The train's next run resets it.
  - The config's backup beside it in `C:\Consonance\data`.
- **Next:** none from this job. The plan default: the other owed steps on L wait for the desktop's close.

## 1. Which way: (b), the train's worktree

- **Where it was built:** `Downloads\dz3-train`, which was clean and detached at 31d1c6d, moved to 99b6045 by
  `git checkout --detach`.
- **His clone was not touched until every reading was green.** His launcher stayed on the working 31d1c6d build for the whole
  build and check (06:46-07:01Z).
- **The last 1.1 seconds** (07:01:27.8-07:01:28.9Z), in `scratchpad/l206_promote.ps1`, it:
  1. re-read the game guard;
  2. checked the clone clean at 31d1c6d and the worktree at 99b6045 with both programs built;
  3. backed up what it would replace;
  4. fast-forwarded the clone;
  5. copied the two programs, each checked by sha256;
  6. wrote the stamp.
- **It mirrors** `landing-train.js` `promote` (`:363-393`: the guard, the head check, a byte check on each copy). It adds the
  backup first (the DOSSIER row, `p-lib-cap` §8: "a named landmine does not generalise; a backup does").

**The one change from the packet, said on the board before I started (06:45Z):**
- **What the packet asked:** that `build\launch.stamp` carry the time the build STARTED (launch.ps1:89-91).
- **What I did:** in way (b) the build ran in the worktree BEFORE his code files changed. The fast-forward writes them at
  07:01:28Z, so a stamp at 06:46:06Z would be older than they are, and the launcher would read "build needed".
- **So the stamp's time is the fast-forward's END** (07:01:28.676Z), taken right after `git merge --ff-only` returned.
- **Why that keeps launch.ps1's purpose** ("so a file saved while it ran still counts as newer next time"):
  - the build is of 99b6045 from git, not of his working files;
  - the clone was checked clean at 31d1c6d before the fast-forward, and clean at 99b6045 after;
  - so anything written to his clone after that moment is newer than the stamp and triggers a build.
- `landing-train.js` promote stamps with the time of promotion, later still.

## 2. The fast-forward

checked (`scratchpad/l206_promote.log`): `fast-forward done: 31d1c6df16f99005e515d0e45c56b898f8d053f0 ->
99b6045308912d47d4696b3ad924b297ee804c09 (ended 2026-11-14T07:01:28.6764529Z)`.
- **Before:** clean (`git status --porcelain` empty), and 99b6045 a descendant (`merge-base --is-ancestor`).
- **After:** `git rev-parse HEAD` = 99b6045…, `git status --short` empty.
- **Unchanged between the two:** `launch.ps1` and `build.bat` (`git diff --stat 31d1c6d 99b6045 --` both empty). No
  `third_party` pin moved, so no submodule HEAD changed for the launcher.

## 3. The three exit codes, as printed

The run: `scratchpad/l206_run.cmd`, under `heavy-run.js --run --exclusive` through `scratchpad/exclbn.js` (BelowNormal,
inherited by every child), `CMAKE_BUILD_PARALLEL_LEVEL=4`, in the background. Each code was echoed on the line after its program;
none went through a pipe. From `scratchpad/l206_run.log`:

```
L206 START 2026-11-14  0:46:06.64 in <user folder>\Downloads\dz3-train
99b6045308912d47d4696b3ad924b297ee804c09
L206 SUBMODULE UPDATE EXIT 0
100% tests passed, 0 tests failed out of 14
Total Test time (real) = 620.51 sec
L206 BUILD.BAT TEST EXIT 0
selftest: passed (26 of 26 checks passed)
L206 DZ-GYM SELFTEST EXIT 0
selftest: passed (61 of 61 checks passed)
L206 DZ-WORLD SELFTEST EXIT 0
L206 END 2026-11-14  1:01:11.75
exclbn exit 0
```

- **The same counts as D's reading of 99b6045:** suite 14/14, gym 26/26, world 61/61 (`handback/p-land-timer-errlvl-B_2026-11-14.md`;
  my map line of 05:5xZ). L reads green what D read green.
- **No re-read:** the world self-test exited 0, not 3. On L its machine-bound row read `0 waits (0.0 ms)` over 916 chunks,
  and the timer row `power throttling control mask 4, state mask 0`.
- **Per suite (s):**

  | suite | s | | suite | s |
  |---|---|---|---|---|
  | world_app | 620.49 | | gen | 52.17 |
  | chase | 421.31 | | world | 22.65 |
  | gen_walk | 126.27 | | audio | 6.25 |
  | gen_drop | 125.07 | | game | 3.45 |
  | nav | 64.39 | | | |

  The rest were under 3 s each.
- **The build was incremental** in the worktree's existing build folder (67 steps). Both programs linked by 06:46:28Z.

**The gates first** (06:45:40Z):
- `node consonance/tools/heavy-run.js --status`: "EXCLUSIVE HOLD: none; slot 1: free; slot 2: free", exit 0.
- `node exo_memory/loop/memwatch_2026-11-13.js --gate`: "free 19870 of 32537 MB, commit free 15222 of 35865 MB; room
  programs: none … gate: clear", exit 0.
- No dz-world.exe or dz-gym.exe running (tasklist).

**`heavy-run.js --status` after the run** (07:01Z): "EXCLUSIVE HOLD: none / slot 1: free / slot 2: free", exit 0.

## 4. The programs in his clone, and the stamp

| file | sha256 now (= the worktree's 99b6045 build) | sha256 before (kept in `build\l206-before\`) |
|---|---|---|
| `build\bin\dz-world.exe` | d4f2605b1fe380651cd647e60ab61c5e8d128314b0335a0926356405981a2324 | 71becfc05b59ab833d466840fce7b10dd1e6155735d83c9eb63e45bfebe403b5 |
| `build\bin\dz-gym.exe` | aa8d2f27f2b6a15495d5b093a9435bbb8c34d2bb95482ab0918b4806625fac5c | acf0eb32166e0f41e93d8f3e08d30d981c030185d1e701fda02ee7b18e3ab9eb |
| `build\launch.stamp` | (rewritten, below) | 37a1ace6601e9d90aa0c2063d96e83cb452bc6d6d3b839736245338c26de56e1 |

- **Proof that the copies are 99b6045:** `grep -c -a 99b6045 build/bin/dz-world.exe` gives 1, and `31d1c6d` gives 0 (its
  `build_commit.h`). dz-gym embeds no commit, so its proof is the byte match to the worktree's build above.
- **Nothing else is needed beside them:** the shaders compile into headers inside the programs (`render/CMakeLists.txt:23-44`),
  and `build\bin` holds no DLLs.
- **The other tool programs** in his `build\bin` (dz-view, dz-chase, dz-gen, dz-nav, dz-sim) stay at 31d1c6d. His shortcut
  starts neither; the packet's end state names the two.
- **The stamp:**
  - LastWriteTimeUtc `2026-11-14T07:01:28.6764529Z`;
  - its text: "built for the launcher by pane B (L206): 99b6045 built in the train's worktree from 2026-11-14T06:46:06.497Z;
    stamped at the fast-forward's end, 2026-11-14T07:01:28.6764529Z".

**Both -Check lines, as printed** (the script ran each in a child `powershell -File launch.ps1 <prog> -Check`):

```
[2026-11-14T07:01:29.3206537Z] launch.ps1 world -Check: up to date
[2026-11-14T07:01:29.6780157Z] launch.ps1 gym -Check: up to date
```

## 5. The train config

`C:\Consonance\data\landing-train.config.dreamzone-3.json`:
- **Before:** sha256 `20dfa8034e9fd42cbe6cb2452a792730b6a189a73e770674d1325c2c9db766a7`, copied aside first to
  `landing-train.config.dreamzone-3.json.bak-l206-20261114T064454Z` (the same sha256).
- **After:** sha256 `3ba2886e5b6b8f7e239893ae7fc7ff494ef8c0d98636170853f2f2814dfd4968`.
- **The whole diff** (`diff backup config`): `7a8 >   "reread": ["build\\bin\\dz-world.exe", "--selftest"],`
- **It parses:** `JSON.parse` printed `reread = ["build\\bin\\dz-world.exe","--selftest"]`.
- **`landing-train.js list --config <it>` reads it:** exit 0, no rows (the ready queue `landing-ready.jsonl` holds 0 lines).
  To show that `list` does parse the config, a copy with one trailing comma added made `list` exit 1. The copy was removed.
- **Why:** `handback/p-train-exit3-B_2026-11-14.md` §6. Without the key, a world self-test exit 3 stays red in the train.

## 6. The board line posted for him (07:0xZ, `[B] L206 DONE`)

Read from the ten first-parent merges (`git log --first-parent 31d1c6d..99b6045`) and the CHANGELOG's diff (+135 lines), not from
memory. The bullets, as posted:
- **A run lasts 10 minutes.** Nothing says so until the last minute; then one amber line under the score, "It is coming",
  and a countdown.
- **Two endings.** Caught before the timer: LOST, a cut to dark, and the points shown with "none of them are kept". Still
  running in overtime: SAVED, white light instead of dark, every point kept, and the overtime bonus on its own line.
- **The window and prompt are titled "The Absolute".**
- **F.** A tap switches the light in his hand; held, it tightens the flashlight's beam.
- **The hunter no longer bobs up and down when he runs.** His hips now rise and fall like a recorded runner's, his legs at
  speed are refit to that runner, and the small pop of his toe and ankle as a foot leaves the floor is gone.
- **In overtime the Dark is visible,** in the hunter's shape. Before, it was there and drawn as nothing.
- **Small fixes.** The score line no longer says "normal". The clock reads 1:00.0, not 0:60.0. The game keeps its 1 ms timer
  even when not in view, which fixes frames dropped by Windows' timer (it costs power while minimised, not frames).
- **Not seen unless he turns them on:** the lighting smoother and the second light bounce, two settings, both off by default.
- **And:** old run records replay as before; only the two programs were replaced; what they replaced is kept in
  `build\l206-before`.

**Not named for him, because he cannot see them:**
- the yardstick's toe measure (a tool);
- the tell row;
- the fall row and the self-test's exit 3;
- render/build.bat's crash-code fix.

The start line (06:45Z) said the rebuild and its end time, about 07:35Z. It ended at 07:01Z.

## 7. My fault on the way

- **What happened:** the first background start, at 06:45:54Z, ran nothing.
- **Why:** `MSYS_NO_PATHCONV=1` (set so that `cmd /c` reaches cmd intact) also kept my POSIX path to `exclbn.js`, so node
  looked for `C:\c\Users\…\exclbn.js` and exited before taking any lock.
- checked: `heavy-run --status` straight after showed no hold.
- **Restarted** at 06:46:06Z with Windows-form paths. Nothing was built or held twice.

## Could be wrong

- **That nobody edited his clone between 07:01:28.676Z and the stamp write about 0.2 s later:** inferred. A file written then
  would be older than the stamp and missed. The packet made me the only pane working on L.
- **That his shortcut needs only the two programs:** read from launch.ps1 (`build\bin\dz-$Program.exe`, world or gym) and from
  the train config's own `promote.files`. Not tested by starting the game, which this job forbids.
