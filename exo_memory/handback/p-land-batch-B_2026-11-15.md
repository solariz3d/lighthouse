# Hand-back: the D677 batch landed on dreamzone-3 main (b7m4-chaser-b and b2-clock-c), one suite, and his copy built (pane B, D677)

**Packets.** The chair's orders of 09:48:29Z (one batch, one suite), 10:49:30Z and 11:00:57Z (the batch is b7m4-chaser-b 17434d9 and
b2-clock-c 4830bfe, on the main O's E3 landing leaves), and the ruling of 12:31:22Z (three streaming rows beside his game). Tier: prove
it.

**THE PUSHED SHA: dreamzone-3 main `48ad21d` → `564ce1f46515cd4351bd135dc29225c063c4439a`.**

    checked: git ls-remote origin refs/heads/main before → 48ad21d2…; after the push (12:45:43Z) → 564ce1f46515cd4351bd135dc29225c063c4439a

## 1. The merges

| commit | parents | what |
|---|---|---|
| `731722a` | `48ad21d`, `17434d9` | b7m4-chaser-b: the world self-test row reading a chaser's look through the law (1 file, +58) |
| `564ce1f` | `731722a`, `4830bfe` | b2-clock-c: one stride clock for every body behind `stride_clock` (off); under body_lean the wall read ahead |

Both merges were clean. No settings conflict; the CHANGELOG merged by union.

    checked: git merge --no-commit → "Automatic merge went well" twice; conflict markers in CHANGELOG.md, world.txt, world_settings.h → 0
    checked: world.txt at 564ce1f → view_on_head (41), body_look (42), stride_clock (45), each "= 0"
    checked: git diff --numstat 731722a 564ce1f against C's own diff (48ad21d...4830bfe) → equal but CHANGELOG.md, 22 against 23 added
             lines: the one line C has and the merge does not is a blank one (the union dropped a trailing blank); every code line equal

**The batch's files** (git diff --name-only 48ad21d 564ce1f), for the 12:31Z ruling:
- `CHANGELOG.md`, `game/CMakeLists.txt`;
- `game/body.cpp` and `.h`, `game/body_lean.cpp` and `.h`, `game/camera.cpp` and `.h`, `game/stride_clock.cpp` and `.h`;
- `game/config/world.txt`;
- `game/tests/body_tests.cpp`, `game/tests/world_app_tests.cpp`;
- `game/world/selftest_run.cpp`, `game/world/stage.cpp` and `.h`, `game/world/world_app.cpp` and `.h`, `game/world/world_settings.h`.

None is generation, streaming, navigation or audio code.

## 2. The suite: ONE red, NOT one of the ruling's three, read again on a quiet card: GREEN

**How it ran:** `G:\consonance-scratch\b-batch-land.cmd`, under the ordinary lock from 11:13:52Z, BelowNormal, on G:'s tree. Star
Citizen was running at its start.

    checked: G:\consonance-scratch\b-batch-land-out\head.txt → 564ce1f, tree clean
    checked: tasks_start.txt → StarCitizen present; tasks_end.txt → not present
    checked: suite.txt → "93% tests passed, 1 tests failed out of 14", "11 - audio_tests (Failed)", suite exit 1. The failing check:
             room_tests.cpp(118) "CHECK failed: best < 0.25", after "16 sources, every cue, a room, 8 place sounds voiced: 0.3340 ms for each 10 ms of sound"
    checked: view.txt → 32 of 32, exit 0; gym.txt → 26 of 26, exit 0; world.txt → "selftest: passed (65 of 65 checks passed)", exit 0
             (the 12:31Z ruling's three streaming rows were GREEN here, so the ruling is not used)
    checked: game_tests.txt → "200 tests, 0 failed", exit 0; world_app_tests.txt → "85 tests, 0 failed", exit 0
    checked: replays.txt → HIS SEVEN KEPT RUNS (copies in G:\consonance-scratch\b-lookback-runs, records unchanged), each "the same run to
             the bit", exit 0: 7 OF 7

**The red is a wall-clock bound on the sound mixer:** `room_tests.cpp:118`, the best of seven seconds of mixing must be under
0.25 ms per 10 ms of sound. It was read beside his game, on a batch that touches no audio code.
- The 12:31Z ruling names only the three streaming rows, so it does not cover this red, and by its last line any other red stops the
  landing.
- I held the landing and, by the standing rule for load-sensitive rows, read the row again under the exclusive hold.

      checked: G:\consonance-scratch\b-batch-land-out\audio_quiet.txt (12:45:1x, under the exclusive hold) → "16 sources, every cue, a room,
               8 place sounds voiced: 0.2416 ms for each 10 ms of sound"; "81 tests, 0 failed"; audio_tests exit 0
      checked: audio_quiet_tasks.txt → no StarCitizen, dz-world, dz-gym or compiler running

**Both readings, named:**

| reading | conditions | the row | audio_tests |
|---|---|---|---|
| 1 | beside his game, BelowNormal, in the suite | 0.3340 ms | RED |
| 2 | quiet card, under the exclusive hold, normal priority | 0.2416 ms | GREEN |

**The margin on the quiet card is narrow:** 0.2416 against 0.25, 3.4 %. The row will go red under almost any load; this is said, not
changed.

**A slip of mine:** the first exclusive re-read (12:32Z) ran nothing. From Git Bash, `cmd /c` has `/c` rewritten as a path, so cmd
opened and closed, and the hold was released unread. The second used `cmd //c`. It is in my memory now.

## 3. The scan, the push, his clone

    checked: b-scan-any.js 564ce1f → push gate allow; privacy scan 0 hits
    checked: Get-CimInstance at 12:45Z → no dz-world, dz-gym or StarCitizen; his clone clean at 48ad21d; git merge --ff-only → HEAD 564ce1f

## 4. HIS COPY BUILT AT 564ce1f, nothing launched

Built as launch.ps1 builds it, by `G:consonance-scratch-his-build.ps1` (the launcher's own -Check reason, build.bat into
`buildlaunch-build.log`, the stamp at the build's start), under the lock with his clone as the tree. Its check now holds only for a
dz-world or dz-gym of his from that folder (the chair's 09:56:52Z rule). My B8 film had taken slot 1 at 12:45:27Z, just before this build
reached the lock; I stopped the film by its handles (start times checked) so his build went first. The film runs again later.

    checked: G:consonance-scratch-his-build-out.txt → "before: build needed: gameworldworld_settings.h is newer than the last build";
             "build.bat exit 0, started 2026-11-15T12:47:11.2636416Z, ended …12:48:24.6277676Z"; "stamp written: 2026-11-15T12:47:11.2636416Z"
    checked: buildindz-world.exe → contains "564ce1f46515cd4351bd135dc29225c063c4439a", written 12:48:24Z
    checked: launch.ps1 world -Check → "up to date", exit 0; launch.ps1 gym -Check → "up to date", exit 0
    checked: no dz-world or dz-gym from Desktopdreamzone-3 afterwards. NOTHING LAUNCHED.

**His copy now:** main 564ce1f, every switch at its default (off): main as played plus the chaser row (a self-test only) and C's
stride clock behind stride_clock (off).
