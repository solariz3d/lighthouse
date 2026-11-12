# D665 step 1, shorter straights per biome (E's variety lever 1): B's hand-back (2026-11-11)

Packets: `[chair:MAIN] START the D665 build NOW` (00:04Z) and the queued order (23:07Z). His words: "the proc gen does get way too repetitive over time"
(item 91). Design: E's `handback/p-d665-variety-E_2026-11-11.md` (V1-V8 registered there before this build). Tier PROVE IT.
Branch **`d665-variety-b`**: built as `daeb2fe` on my floor branch 8ebf4a6, parked for D671, then rebased onto main **`955c4e1`** (the floor packet,
the HANDOFF list and D671 merged). The one conflict, in `void_tests.cpp`, was D671's new row beside this step's comment on the void-rate row: both kept.
Worktree `C:\Users\nname\Desktop\worktrees\dz3-d658-b`. **Commit `2d72bd2`**, NOT pushed. Scratch: `C:\Users\nname\AppData\Local\Temp\claude\fdb7d12f3434a8ed\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\scratchpad\d665b\`.

## 1. The change (numbers only, gen/src/biome.cpp)

| biome | lane_segment | lane_offsets |
|---|---|---|
| hotel | 36 → **16** | 2 → **3** |
| school | 24 → **12** | 1 → **2** |
| hospital | 30 → **14** | 1 → **2** |

E's lane_segment numbers. E gave the offsets as "up to 2-3 so lanes jog"; these are my pick. The school's halls are no longer straight on a grid, and the
hotel is no longer the biome of long corridors.

## 2. V1 and V2, measured

**On his route: not measurable after the change.** His run replays only in the world it was played in (his inputs drive the body; a changed
world sends it into walls). His route's numbers before are D665 (2)'s: 94% corridor, 2% room, median straight 49 cells.

**On the bots** (`bots.sh`, `measure_row.js`, `v12.awk`): `dz-chase run --world` (the game's streamed world, field biomes), seeds 1 to 20 × flee, line and
juke, normal level, 300 s at most, traced (a new `--trace` for the world run). The player's place every 5 s, read from the generator of that seed.
Before is 8ebf4a6 (`base/`), after is daeb2fe's numbers (`step1/`):

| | before | after | registered: the design is WRONG if |
|---|---|---|---|
| samples | 1,447 | 1,319 | |
| **V2** median corridor straight | 27 cells | **23 cells** | over 25 cells: **held** |
| straights of 100 m or more | 48% | 30% | |
| hospital / school / hotel median straight | 109 / 73 / 64 | 36 / 28 / 18 | |
| **V1** corridor | 68% | 71% | over 80%: held |
| **V1** rooms | 10% | **7%** | under 10%: **FAILED** |
| **V8** the bots' median survival | 41.8 s | 38.1 s (−9%) | moves over 25%: held |
| not caught in 300 s | 19 of 60 | 16 of 60 | |

- **V1 fails, as it was always likely to on this lever:** shorter straights don't put a runner into rooms. E's lever 2 (pass-through rooms) is the one
  aimed at rooms. The registered falsifier fired, and I report it as such.
- The bots spend most of their time near the spawn (the apartment 63% of the base samples), so their overall corridor share (68%) is lower than his
  run's (94%). The by-biome lines show the change where it was made.
- V8's other half (the hunter's ETA distribution, A's measure) was not measured here.

## 3. The rows the change moved (amended by name, the old and new rule in a comment)

Each was read before it was changed, with a scratch probe at step 1 and at base (`probe1_*`):
- **`layout_tests` `a_biome_is_data_and_the_two_built_ones_differ`:** "the hotel's sightline over 1.25 times the apartment's" (it was its long
  corridors) is now "no shorter than the apartment's": 53.6 m against 49.5 m. Its doors, rooms and atrium still tell it apart.
- **`dial_tests` the hotel's loops band 18-32 → 18-36:** with shorter jogging lanes its ways round per chunk went from a mean of 25.5 to 30.4 over 200
  seeds, and 30 seeds landed at 32.1 to 35.5. Every one of the 30 was out on loops alone; nothing else left its band.
- **`void_tests` `the_void_rate_dial_turns_voids_off_and_up`:** its block is built in the apartment. The field's biomes there hold few voids. The school and
  hospital hold **none at any rate, before D665 as after** (0 at 0.2 and at 1 over six seeds, forced), and the hotel fewer with jogging lanes (12 → 8 at
  rate 1). The apartment: 2 at 0.2, 15 at 1. The row is about the dial, so its block holds voids by construction.

**For him, from the probe:** voids (the wall-run gaps) are almost only in the apartment and the hotel. The school and hospital never had them (a void
needs one straight lane walled in mass), and the hotel has fewer now.

## 4. World fingerprints (the same 96 chunks a seed round the origin as D658's floor packet: `fp_step1.txt` after, against `d660m\fp_doors.txt`, the floor packet's generator before this step)

| seed | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| chunks moved by step 1 | 75 of 96 | 23 | 78 | 74 |

§2 to §4 were measured at `daeb2fe`, before the rebase. The rebase adds D671 only (the void box stops where a fall lands; it moves only chunks with
voids, and no cell or place). inferred: the bot and place measures would read the same at 2d72bd2.

## 5. The proof at 2d72bd2: ONE RED ROW, a chase mechanic at its margin; it needs a ruling

Run under the exclusive hold, after a wait for P's landing and C's timing bench (the first try gave up after heavy-run's 30 minutes, having run
nothing; `s1_err.txt`). Window at 01:48:09Z; `s1_head.txt` 2d72bd2; hidden, BelowNormal.
- `build.bat test`: **9 of 10 suites** pass; **chase_tests red, one row** (428.2 s; `s1_suite.txt`, `s1_chase.txt`).
- `dz-gym --selftest` **26 of 26**; `dz-world --selftest` **52 of 52**, the fall row 0 waits (922 chunks).
- `gen_tests` **35 tests, 0 failed** (D671's row after the rebase: 9 void boxes, 43 floors under them, 0 inside).
- **The red row:** `chase/tests/body_tests.cpp` `a_sprinter_that_does_not_brake_for_corners_meets_the_walls_and_one_that_does_gets_there_sooner`.
  It walks two sprinters, one that brakes for corners and one that doesn't, over 12 routes of three corners or more, and needs the braking one to be
  sooner on at least 9 of them and the other to scrape longer on at least 9.
  - In the shared arena at 2d72bd2: scraped longer on 8, **braking sooner on 8** (217.7 s against 208.5 s in all). Red on both checks.
  - **Tried in the apartment arena** (`plain_apartment_arena`, as D658 ruled for mechanics rows): scraped longer on 9, **braking sooner on 8** (128.7 s
    against 126.2 s). Still red. **Step 1 does not touch the apartment**, so this row reads 8 of 12 in a world step 1 never changed: its 3-in-4 bar is
    at the margin, not broken by this step. inferred: it passed before step 1 because the shared arena's routes happened to land on its side.
  - **Not changed:** I undid the pin, and I would not lower the bar or choose routes. It is a chase mechanics row (A's), so the ruling is the room's:
    route the bar to its owner, or rule what this step does with it.

NEXT for §5: librarian, rule on the sprinter row when this is read; then B finishes step 1 (or carries the ruling) and goes on to step 2.

## Corrections, mine

- My first comment on the void row said the field put school and hospital regions in its block "with D665's shorter straights". The field isn't changed by
  step 1; what changed is the voids inside the biomes. Corrected before the commit.
