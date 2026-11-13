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

## D, 2026-11-13 ~15:0xZ: THE QUESTION FOR A (the run record and a changed generator), routed through the librarian

**What the record carries today** (checked on `origin/main` 31d1c6d): `record_format = 1`, the build, the seed, the level and dials, `[speed]`,
`[params]` (movement) and `[world]` (world settings) (`game/world/run_record.cpp:107-176`). **Nothing of the generator's own parameters:** the game
builds `gen::GenParams{}` with the seed, its gen dials and `force_biome` (`game/world/world_app.cpp:136-147`), and the record says none of it.

**What the kit changes:** the worlds. 300 of the pin's 384 chunk fingerprints move on `gen-lap2-kit` (c9ad588): the chute, the true buy rule,
the path factor, the hunter model the generator rates with, and his door rate 0.15. So every run recorded before the kit lands, his kept runs among
them, would replay into a different world and not reach its fingerprint.

**The two answers I can see; the call is A's (the record's owner):**
- **Option 1, the scheme's own rule** ("a missing field means the behaviour of the day it was missing"; your line "a `[gen]` section before a
  generator lap flips a dial above 0"). Every world-changing part of the kit goes behind a generator dial whose OFF value is today's generator
  exactly. The record gains a `[gen]` section listing them, and a new run takes a `shipped_gen()` with the kit on, as `shipped_speed()` does. A
  record with no `[gen]` replays with the kit off, to the bit. **The pin stays as it is and becomes the proof of the off path** (its 384 values
  must not move with the dials off); a second pin holds the kit's world. Cost: the kit must keep the old generator reachable (chute rate 0, buy
  rule off, path factor 1, the old hunter model, door rate 0.25). Inferred, from the code: each is already a parameter, so this is mostly
  plumbing.
- **Option 2, no way back.** The record gains a generator identity (for example the spawn chunk's fingerprint), and a replay whose world does not
  match refuses, saying the generator changed. Runs from before the kit stop replaying; the pin is re-captured.

**B's view:** Option 1. It is the rule the scheme already states. It keeps his recorded runs replayable, which your exploit search reads. And it
turns the pin's red into a proof instead of a re-capture. **What would change my mind:** if the record must stay free of generator fields for a
reason I can't see from the code, or if keeping the old generator path costs more than I estimate. I'll measure that cost before building.

**Until A answers,** B works on what does not depend on it: the drop harness's segfault, the world self-test's two rows, the hunter-reach row,
and the shape-names row.

## WHERE IT STOPS (D, 2026-11-13 ~14:5xZ), at the HOLD (his 08:51 word)

- **Branch:** dreamzone-3 `gen-lap2-kit`, local **`192b50c`** in my worktree `C:\Users\nname\Desktop\worktrees\dz3-d658-b`. It is the
  pushed `c9ad588` plus one merge of main **`31d1c6d`** (the hunter's legs, the overtime chase), with no conflict. **NOT pushed**; `origin/gen-lap2-kit`
  is still `c9ad588`. The tree is clean.
- **Nothing built or run on D.** My one queued run (build, then the drop harness unchanged) never started: it waited on P's lock and I
  ended it at the hold, its whole process tree, checked gone. So every suite count is still **L's at `c9ad588`** (the table above): 10 of 14
  suites green; red gen_tests (the pin; the shape names), gen_drop_tests (SegFault), nav_tests (the worst pair), chase_tests (the sprinter
  margin; the hunter's reach 2.68x against 2.5); **world self-test 50 of 52**. inferred: the sprinter row may now be green, since the chair says A's fix
  on main turned it green at 85 of 96, and the merge carries it; not run.
- **The record question** is filed above (e2740fdc) and rung. A answers in writing.
- **Found by reading, not yet run:**
  - **The drop harness's segfault, a likely cause:** `gen/tests/drop_tests.cpp:21-24` `link_name` has 7 names, but the kit added an eighth
    `LinkKind`, `Chute`. Any finding whose link is a chute indexes past the table and prints from a garbage pointer. So there ARE findings, and
    they are falls into a chute's top, a fall the kit designs. The harness's rule (`gen/src/drop_proof.cpp:20` `designed_void`: Void, Abyss,
    Shaft, Well) does not know a chute. **Planned fix:** the table grows with the enum (a static_assert, as `to_string` has), and the rule
    is amended by name to admit a chute's own cells. First reproduce the crash on D, then fix, then rerun.
  - **The world self-test's two Park rows:** its scripted player walks a route to the nearest Park cell (`game/world/selftest_run.cpp:290-293`,
    `kAllowOnFoot` allows Park edges). Before the kit that was a one-storey passage; now every Park is vertical. inferred: the route's last edge
    is a chute's fall or a duct's ladder, and the scripted walker does not complete it. To look at the route before changing anything.
  - **The shape-names row** (`range_tests.cpp:288`): ready to amend by name to the kit's kinds (duct, chute, chute with a run). The edit is in my
    scratchpad (`d665b\shapes_amend.js`), NOT applied.
- **Next, in order, when work resumes:** (1) build at `192b50c`, reproduce the segfault, fix it as above; (2) the self-test's route; (3) the
  shape-names amendment; (4) split the hunter-reach red between the kit and the door rate; (5) the pin, on A's answer; (6) the nav and sprinter
  rows with D's numbers.

- **A answered (14:53Z, read whole):** Option 1 with Option 2's identity as a tripwire. A's file: `C:\Users\nname\Desktop\worktrees\a-d673-lh\exo_memory\handback\p-record-owner-A_2026-11-13.md` line 83 (branch `a-d673-brutal-lh`). **My part when the hold lifts:** every world-changing part of the kit behind a generator dial whose off value is today's generator exactly; the pin kept as the off-path proof; a second pin for the kit's world; to A, the dial names, their off values and `shipped_gen()` (the kit on). A writes `[gen]`, `gen_world` and the refusal, red first. A's condition: a part that cannot be put behind a dial (a different code path, not a parameter) is named, and only that part takes Option 2, with his word. Build nothing on it until the librarian rings that the hold is lifted.

## D, 2026-11-13 ~15:4xZ: THE KIT'S DIAL LIST FOR A (Option 1), and the off path

**State when written:** the list is fixed by design and its code is written (my scratchpad `d665b\dials.js`, `pin_kit.js`). It is NOT yet built or
run: the run that builds it waits on the lock behind C's stomp run and A's brutal sweep. **The off path's proof, the existing pin, has not run
yet.** If it finds a world-changing part I missed, the list grows, and I ring again.

**One list, `gen/src/gen.h`, `DZ_GEN_KIT(X)`**, in the shape of `chase/speed.h`'s `DZ_SPEED_FIELDS`:
`X(name in the record, off value, on value, the GenParams field it sets, description)`.

| name (`[gen]`) | off: the generator before the kit (`GenParams{}`) | on: `shipped_gen()` | GenParams field |
|---|---|---|---|
| `chutes` | 0 | 1 | `kit_chutes` |
| `buy_rule` | 0 | 1 | `kit_buy_rule` |
| `path_factor` | 1 | 0.835 | `hunter.path_factor` |
| `hunter_walk` | 7.0 | 8.96 | `hunter.walk_speed` |
| `hunter_stairs` | 4.9 | 6.272 | `hunter.stair_speed` |
| `hunter_ladder` | 2.0 | 1.5 | `hunter.ladder_speed` |
| `hunter_drop` | 0.9 | 1.6 | `hunter.drop_time` |
| `door_rate` | 0.25 | 0.15 | `kit_door_rate` (applied to the apartment, the school and the hospital; the hotel's 0 is its own) |

- **`gen::GenParams gen::shipped_gen()`**: `GenParams{}` with every field at its on value. A new run's world: `world_app.cpp` `make_world` now
  starts from it (`gen_ = gen::shipped_gen();`). A replay's world is yours: start from `GenParams{}` and apply the record's `[gen]`.
- **`std::string gen::set_gen(GenParams&, std::string_view text)`**: name=value pairs separated by spaces, semicolons or newlines, as
  `chase::set_speed` reads its own. An unknown name or a malformed value is refused, the message returned, and nothing changed. For writing,
  iterate `DZ_GEN_KIT` as `[speed]` iterates its list.
- **`GenParams{}` is the off path,** as `SpeedModel{}` is: every field's default is its off value. My row
  `every_kit_field_is_off_by_default_and_on_in_the_shipped_world` (pin_tests) holds that, holds `shipped_gen()` to the on values, and holds
  `set_gen`'s round trip and its refusals.
- **The two pins:** `the_default_world_equals_the_pin` (kPin, unchanged, now built from `params_off()`) proves the off path. The new
  `the_shipped_world_equals_the_kit_pin` (kKitPin) holds the kit's world.
- **For your tripwire's row** ("a test that changes one generator constant with no dial must make a `[gen]` record refuse"): the generator's
  world-changing constants are all in `gen/` (salts, the band, the lane numbers in `biome.cpp`). A `force_biome` or a dial outside this list does
  NOT go in `[gen]` today: `force_biome` comes from the world settings the record already carries (`[world]`, `start_biome`), and the generator
  `Dials` are the game's `gen_dials_`. inferred: the record does not carry `gen_dials_` today; whether it must is your call.

**Not behind a dial, and why that holds:** the new record fields (`chute`, `run`, `storeys`, `crossing_s`), the new edge flag, `LinkKind::Chute`
and the `MoveReach` fields. None changes a world: the fingerprint reads none of them (`emit.cpp` `fingerprint`), and with `chutes` at 0 none is
ever set. The pin proves it when it runs.

- **BUILT and the off path PROVEN (D, ~15:5xZ):** the list above is dreamzone-3 `gen-lap2-kit` **`0df4c77`** (local; not pushed; A sees it in the shared repository). checked: `gen_tests` at its content, 64 of 65, `the_default_world_equals_the_pin` GREEN (all 384 chunks equal to the pin captured before any generator lap, so `GenParams{}` IS the generator before the kit) and `every_kit_field_is_off_by_default_and_on_in_the_shipped_world` green (my scratchpad `d665b\d4_gen.txt`). The one red was the new kit pin, empty by design; its printed values are now pasted into `kKitPin`. **The list did not grow.** The drop harness: crash reproduced at 192b50c (exit -1073741819), green after its fix (51,394 attempts, 0 unintended; `d4_drop_before.txt`, `d4_drop_after.txt`). The whole suite and both self-tests are running now.

## D, 2026-11-13 ~16:4xZ: what the kit's world does to three margin rows, split by part (for rulings); nav's pair; the self-test

Measured with scratch rows (never committed) that build arenas with the kit's fields set by `set_gen`. Outputs are in my scratchpad `d665b\`:
`d4_split.txt`, `d5_diag.txt`, `d6_sprint.txt`, `d6_cells.txt`, `d7_reach.txt`, `d7_sprint.txt`, `d7_nav.txt`, `d7_world.txt`.

**1. chase `the_hunter_always_reaches_a_player_who_stands_still_in_connected_space`** (bar: the slowest within 2.5x the planned time):

| arena seed | off | chutes only | rating only | door only | **all on** | all but chutes | all but rating | all but door | all but buy rule |
|---|---|---|---|---|---|---|---|---|---|
| 3 | 1.87 | 1.79 | 1.73 | 1.84 | **2.68** | 1.73 | 1.79 | **2.68** | 1.93 |
| 5 | 1.95 | 1.95 | 2.29 | 2.39 | 2.02 | | | | |
| 9 | 1.74 | 1.55 | 1.71 | 1.74 | **2.98** | 1.69 | 1.59 | **2.98** | 1.76 |

**2. chase `a_sprinter_that_does_not_brake_for_corners...`** (bar: the careful body sooner on 72 of 96):

| | off | chutes only | rating only | door only | **all on** | all but chutes | all but rating | all but door | all but buy rule |
|---|---|---|---|---|---|---|---|---|---|
| careful sooner | 85 | 85 | 81 | 85 | **70** | 80 | 85 | **70** | 84 |

**What the splits say:** both rows go red only when the chutes are kept by the true buy rule, that is, with the chutes, the buy rule and the
kit's hunter all on. Take any one of those out and both rows are back inside their bars. **His door rate plays no part** (all but door gives the
same numbers as all on). Chutes alone are judged by the old rule, keep few, and change nothing. So the cause is the number of kept chutes and
their runs in the world, not one bad piece. inferred, from the same numbers: it is the ruled kit as a whole.

**What the slow reach looks like** (seed 3, kit on, `d5_diag.txt`): the hunter covers the planned way in about the planned time, then stays
within 3 to 5 m of the standing player for 9 to 12 s with many blocked ticks before the catch (seed 3: 89 blocked ticks, 2.68x; seed 9: 125,
2.98x). The player there stands in a room whose way in is one doorway off a lane (`d6_cells.txt`), and **no Park cell lies within five cells on
three storeys.** So it is not a chute beside the spot. inferred: a chase-side weakness at a doorway into a room, which the kit's world exposes
more often. Not established.

**Not changed, for rulings:** both are chase rows (A's). Options as I see them:
- (a) the chase gets through that doorway (A's area);
- (b) the rows stand in a fixed world, as D658 pinned mechanics rows to the apartment arena, for example the off world they were made on;
- (c) his word on the kit as it is.

My view: (a) first. A hunter that stands blocked for ten seconds three metres from a standing player is something he would see.

**3. nav `the_way_there_is_about_as_quick_as_the_way_back`:** the worst pair **does not cross a chute** (`d7_nav.txt`): a (−1.5, 3.5, 10.5) to
b (1.5, 0, 22.5), there 6.25 s / 40.7 m in 10 points, back 5.09 s / 32.6 m in 24 points. Neither way uses a link, and no Park cell lies within a
cell of either path. Per the ruling: **reported, the bound left alone.** It stays red (22.9% against 20%), for its owner.

**4. The world self-test:** with the route fix, "a reprieve holds for its time, and then the hunter comes in" now passes. "Its tell is a light
... and a sound that grows" still fails, and the route print shows why (`d7_world.txt`): **the scripted player entered by a three-storey chute
fall** (from y 0 to −10.5), so the "quiet" second after entering still holds the landing. The row assumes "the sound of going in has died away by
then", which is true of walking in. **Fix (routing, not the check):** a route counts a chute's fall as a drop, so `kAllowOnFoot` ("what needs no
move but walking") does not take one (`world/route.cpp` `allowed`). Running now.

Also red in that run, and NOT the kit's: "a fall at terminal speed ... no tick had to wait for a chunk" (2 waits, 28.9 ms), the load-sensitive
row, with C's and A's heavy runs going.

## WHERE IT STOPS (D, 2026-11-13 ~17:0xZ)

- **Branch:** dreamzone-3 `gen-lap2-kit` local **`c05e074`**, NOT pushed, tree clean (worktree `C:\Users\nname\Desktop\worktrees\dz3-d658-b`).
  On top of L's `c9ad588`: `192b50c` (main 31d1c6d merged), `0df4c77` (the kit behind dials, the two pins, the drop harness, the route over a
  chute), `9150ddf` (A's overtime row in the passage arena; the changelog), `c05e074` (a route on foot does not fall down a chute).
- **Checked at `c05e074`'s content** (`build.bat test`, both self-tests, under the ordinary lock, hidden; my scratchpad `d665b\d8_*.txt`; the
  self-test also carried a scratch route print, since removed):
  - **12 of 14 suites pass**: gen_tests (both pins, the list, the kit's rows), gen_drop_tests (0 unintended), gen_walk_tests, world_tests,
    world_app_tests, the rest. Was 10 of 14 at `c9ad588` on L.
  - **dz-gym --selftest 26 of 26.**
  - **dz-world --selftest 51 of 52** (was 50). "A reprieve holds for its time, and then the hunter comes in" now passes.
- **Red, NOT amended, each routed for its owner's ruling** (evidence in the sections above):
  - nav `the_way_there_is_about_as_quick_as_the_way_back`: 22.9% against 20%. Its worst pair does not cross a chute, so per the ruling: reported,
    the bound left alone.
  - chase `the_hunter_always_reaches_a_player_who_stands_still_in_connected_space` (2.68x against 2.5) and chase `a_sprinter_that_does_not_brake...`
    (70 against 72): red only with the chutes kept by the buy rule; his door rate plays no part. The slow reach is the hunter blocked at a room's
    doorway, with no Park near. For A.
  - dz-world: "its tell is a light ... and a sound that grows": 0.0972 in the tell's last third against 0.1018 in the second before, in a chute's
    run. On main it read 0.1247 against 0.0945 in a one-storey passage (A's D656 hand-back). The tell's sound has no position (the mixer plays it
    from the run's tell value), so what differs is what else sounds there: the chasers or the room. For the sound lane.
- **For A** (the record): the dial list is built and its off path proven at `0df4c77`; `[gen]` and `gen_world` are A's.
- **Next, if no ruling comes back first:** the same-seed pictures before and after for him; V8 on bots, main against the kit.
