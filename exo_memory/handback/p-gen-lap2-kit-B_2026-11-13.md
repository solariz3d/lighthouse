# p-gen-lap2-kit-B: generator Lap 2, the Park kit and his door rate (L201)

## WHERE IT STOPS (L, 13:5xZ)

- **Branch:** dreamzone-3 `gen-lap2-kit` **c9ad588**, pushed (checked: `git ls-remote origin refs/heads/gen-lap2-kit`). It is:
  - main cc8eea8;
  - the kit (`origin/d665-variety-b` 151aead, merged; two conflicts kept the kit's side, nothing of main's lost);
  - C's drop harness, merged before it landed;
  - **his door rate 0.15** (07106bb: the apartment and the default, so the school and the hospital; the hotel's 0 stays).
- **NOT READY** for the train: four suites red (below), and A has not yet answered what the run record carries for a
  changed generator (asked on the board at 13:0xZ, two options laid out).
- **The check on c9ad588** (`build.bat test`, three suites at a time, both self-tests): **10 of 14 suites pass**, 711.83 s.
  - world_app_tests passes on the kit's world, and so does the gym self-test (26/26).
  - **The world self-test FAILS, 50 of 52** (`Downloads\l201_world.txt`, 13:18:04Z).
  - The suite numbers were transcribed at 13:15–13:17Z. The log `scratchpad/l201_check2.log` was then overwritten by an
    unintended rerun of mine, stopped at 13:27Z.
  - Red:

| suite | row | number | whose call |
|---|---|---|---|
| gen_tests | `the_default_world_equals_the_pin` | 300 of 384 chunks moved | **expected**: re-capture the pin on purpose (empty `kPin`, run, paste), and the landing says so |
| gen_tests | `the_two_park_kinds_of_today_have_their_own_shape_names` (range_tests.cpp:295) | the kit's Parks are chutes now | **expected**: amend by name to the kit's shapes |
| **gen_drop_tests** | the whole suite | **SegFault after 111 s** | **NEW and the most serious**: C's drop harness crashes on the kit's world. Not investigated (close-out: no new build). C's harness, B's kit |
| nav_tests | `the_way_there_is_about_as_quick_as_the_way_back` | worst pair **22.9%** against 20%; 2,943 pairs, mean 0.96%, over 2% in 471, over 5% in 104 | **an owner's ruling** (as at 151aead) |
| chase_tests | `a_sprinter_that_does_not_brake_for_corners...` | the careful body sooner on **70 of 96** routes; the row needs 72 (`careful_sooner * 4 >= tried * 3`) | **an owner's ruling** (red since D665 step 1) |
| chase_tests | `the_hunter_always_reaches_a_player_who_stands_still...` (proof_tests.cpp:241) | 10 of 10 reached; the slowest took **2.68x** the planned time, against 2.5 | **NEW** with the kit (or the door rate): not split |
| dz-world --selftest | "a reprieve holds for its time, and then the hunter comes in" and "its tell is a light that was not there and a sound that grows" | "found 1, inside 0, phase 3, 5 events": the self-test's player never gets inside the Park, so the tell never comes | **NEW**: inferred, the kit's chutes change how the self-test's scripted player enters a Park. Not investigated |

- **Next, in order, on the desktop:**
  1. The segfault: `build\bin\gen_drop_tests.exe` in a worktree of `gen-lap2-kit`, under a debugger or with its seed narrowed.
  2. The two rulings (nav, sprinter) to the librarian with these numbers.
  3. Split the new hunter-reach red between the kit and the door rate: build with door_rate back at 0.25 once.
  4. A's record answer.
  5. Re-capture the pin.
  6. The same-seed pictures before and after for him (the before are `Downloads\dreamzone-3-lap1-review\page_*.png`, made on
     main's generator).
  7. V8 on main + the kit: bots 20 seeds x flee/line/juke in units of 5 seeds; main's side is `scratchpad/l196_main/`.
- **Only on L:**
  - the worktree `Downloads\dz3-wt-gen-lap2`, with its full build;
  - the check's log `scratchpad/l201_check2.log`, and the self-test outputs `Downloads\l201_gym.txt` and
    `Downloads\l201_world.txt`;
  - Lap 1's measurement folders `scratchpad/l196_main`, `l196_151aead` and `l196_pages`;
  - the review folders `Downloads\dreamzone-3-lap1-review`, `dreamzone-3-l188-review`.
  - The numbers that matter are in this file and in `p-gen-lap1-measure-B_2026-11-13.md`.
- **The sameness calibration** waits for his 5-minute run on a pinned build (his pick world_gen-13). His 11-11 run is not
  on L.

**`node consonance/tools/leftovers.js`, as printed at 13:29Z** (read-only):

```
leftovers · 2026-11-13T13:29:02.021Z · read-only
tab proxies          UNCALIBRATED (read 0, and the control made none (0 → 0 → 0))
worktrees            Consonance/lighthouse 9 linked + main
strays               not scanned (give --strays <folder> --prefix <name>-)
fake roots           0
orphan browsers      0 headless roots whose parent is gone
our long-running     7 (older than 120 min, infrastructure left out)
  pid 24748  7h 17m  node.exe  C:\Program Files\nodejs\node.exe "C:\Program Files\nodejs\node.exe"  "C:\Consonance\lighthouse\consonance\tools\head-watch.js"
  pid 5368  7h 13m  tail.exe  C:\Program Files\Git\usr\bin\tail.exe "C:\Program Files\Git\usr\bin\tail.exe" -n0 -F C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b…
  pid 36804  6h 21m  node.exe  C:\Program Files\nodejs\node.exe "C:\Program Files\nodejs\node.exe" C:/Consonance/lighthouse/exo_memory/loop/memwatch_2026-11-13.js --watch …
  pid 29132  6h 21m  bash.exe  C:\Program Files\Git\bin\bash.exe "C:\Program Files\Git\bin\bash.exe" -c "source /c/Users/zackn/.claude/shell-snapshots/snapshot-bash-179455…
  pid 28664  6h 21m  bash.exe  C:\Program Files\Git\bin\..\usr\bin\bash.exe "C:\Program Files\Git\bin\..\usr\bin\bash.exe" -c "source /c/Users/zackn/.claude/shell-snapshot…
  pid 40772  6h 13m  bash.exe  C:\Program Files\Git\bin\bash.exe "C:\Program Files\Git\bin\bash.exe" -c "source /c/Users/zackn/.claude/shell-snapshots/snapshot-bash-179455…
  pid 41260  6h 13m  bash.exe  C:\Program Files\Git\bin\..\usr\bin\bash.exe "C:\Program Files\Git\bin\..\usr\bin\bash.exe" -c "source /c/Users/zackn/.claude/shell-snapshot…
```

## His picks in this lap (brief item 183)

- **world_gen-2 / -3:** the Parks as the kit builds them: pieces mirrored and joined by the seed, of varying length.
- **The door rate to 0.15:** built (07106bb), his note being the later word.
  - Measured at D658: the rate moves doorways per corridor cell by only 3–4% a step (0.202 / 0.194 / 0.188 at
    0.30 / 0.25 / 0.20), because each room's two guaranteed doorways dominate. So 0.15 may cut fewer doors than he
    expects.
  - The same-seed pictures will show it. NOT yet measured on this branch.

## What was done

- **The kit merged onto main:** two conflicts, both resolved to the kit's side, with main's side empty or repeated in the
  kit's (CHANGELOG.md, dz-chase main.cpp `--parks`).
- **C's harness (`l189-drops-on-c9d520e` 018ec8a) as the guard:** at C's word, the train landed it first. It found 0
  classes on main.
- **The check:** the table above.
- **V8 is NOT measured here.** My 151aead bots were confounded by its old chase base; main's side is in Lap 1's folders.
