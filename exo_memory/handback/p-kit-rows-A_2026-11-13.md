# B's kit: two chase rows red. What blocks, named before any change (pane A, D, Friday 10:48 local, `date` by the shell). Tier: PROVE IT

Packet: chair 16:43Z. Ruling: `exo_memory/librarian/2026-11-13.md:445` (10:43). B's finding: `exo_memory/handback/p-gen-lap2-kit-B_2026-11-13.md:182`.
The kit: dreamzone-3 `gen-lap2-kit` `9150ddf`, where a default `ArenaParams` is the kit's world (`chase/arena.h:32`, `gen = gen::shipped_gen()`), so the
committed rows run on it. My scratch branch `a-door` at `9150ddf`, in `G:\consonance-scratch\a-gen-dz3`; nothing committed.

## 1. The hunter-reach row (`the_hunter_always_reaches_a_player_who_stands_still_in_connected_space`): reproduced, and what blocks

**Reproduced exactly.** checked: `p-kit-rows-A_2026-11-13_evidence/door_trace.log` (sha256 `adc3be7a`), from a scratch row
(`diag_door.cpp.txt`, never committed) that runs the row's own loop and traces the two slow cases every 0.05 s within 8 m:
- the row: "the slowest took 2.68 times the planned time", FAIL, as B's;
- seed 3, case k 14: the player at (4.50, −3.48, 49.50), caught at 19.85 s (B: 19.9);
- seed 9, case k 5: the player at (−40.50, −6.98, −43.50), caught at 36.00 s (B: 36.0).

**What blocks is not a doorway the hunter cannot pass. It is where the hunter is SENT.**
- The hunter is told where a player is "roughly": a point up to `hunter_error_m` off, **6 m at the start of a run**, redrawn every
  `hunter_update_s`, **1.5 s** (`chase/dials.h:32-33`; `run.cpp:770-777`, the angle and radius drawn from the tick). The point is snapped to
  the nearest mesh.
- For a player **standing in a room**, the snapped point often lies **outside the room, on the other side of a wall**: in the lane, or
  round the corner.
- So the hunter is sent there and arrives 3–5 m from him with a wall between. 1.5 s later a new point may lie on another side, and its
  route flips to the other way in. It does not close until it sees him, and only then does it know exactly.

**In the traces:**
- **Seed 3:**
  - It arrives at 9.25 m/s at 9.4 s.
  - From 10.0 to about 15.4 s each replan alternates between the way in by (5.81, 46.66) → (2.62, 47.51) or (0.46, 47.51) and the way
    round by (8.51, 49.01) → (9.16, 49.31). For example, at 13.6 s it runs west toward (0.46, 47.51), and at 14.0 s it is sent back east.
  - Each reversal is a slow eased turn (up to ~340°/s, 0.5–2.5 m/s, scraping), and line of sight stays 0 throughout.
  - At 17.6 s it has a clear line, and it catches at 19.85 s.
- **Seed 9:**
  - The same alternation from 21 s.
  - At 29.05–29.30 s it **stands still, speed 0, at (−38.41, −40.20), 3.9 m from the player, no line of sight, at the end of a path whose
    last point is (−38.41, −40.06): the drawn point, not the player.**
  - It closes once it sees him (35.05 s) and catches at 36.0 s.

**Why the kit shows it more (inferred, from B's split, not measured by me):** the kit's world puts more walls near more rooms (the chutes and
their runs where the buy rule keeps them), so more drawn points land on the wrong side. The rough knowledge is the chase's own: a designed
dial ("the hunter knows where the player is as precisely as its dial says", its own row).

**The fix this points at (NOT made; for the ruling):** the drawn point must be a place from which the player can be found, not merely the
nearest mesh.
- **Option 1:** draw the error along the walk, not across walls: the nearest mesh point that is connected to the player's own point within
  a short walk (the error's radius plus a margin).
- **Option 2:** once the hunter is within the error's radius of its drawn point and does not see the player, it is told exactly. "You are
  close; it finds you".
- Option 1 keeps the dial's meaning ("how far off its knowledge may be") and removes only the wrong-side-of-a-wall case. I would take it.
- What would change my mind: if the rough knowledge is meant to let a standing player be missed for a while. His item list does not say so,
  and the row says the opposite.

**L162's lever (`close_range`), as the ruling asks me to try first:** NOT yet run. Read off the code, it pursues the knowledge's observed point
(`obs.pos`), which is this drawn point, and only with a clear line to it. So I expect it not to help here (inferred). It is run on both recorded
cases next, as ruled, and reported either way.

## 2. The sprinter row: not yet reproduced

It walks fixed routes with no hunter and no knowledge, so section 1's cause cannot be its cause. Its own reproduction, by seed, comes next:
which routes the careful body loses on the kit's world, and why.

## 3. L162's lever on both recorded cases, as ruled (D, 11:02 local, `date` by the shell): it does NOT help the reach row; it DOES close the dark one's orbit

**How:**
- abe8237's `close_pursue` was applied by hand to `9150ddf` on the scratch branch, never committed (`l162_lever.js`; the cherry-pick conflicted in
  four files, so only its code, its field and its count went in).
- The hunter's call is as abe8237 had it. The dark one, which runs through the same function now, takes reaction 0, as its body does.
- **Not carried over:** the lesser chasers' call (neither case has one).
- The scratch row `diag_lever_both_cases` (`diag_door.cpp.txt`) runs the reach row's own loop on seeds 3 and 9, and seed 8's juke run in the world it
  was recorded in (`GenParams{}`), at 0 m (the control) and 10 m (L162's setting).

checked: `lever_both.log` (sha256 `dd98615b`):

| case | off (0 m, the control) | the lever at 10 m |
|---|---|---|
| reach, seed 3, case k 14 | 19.85 s, ratio 2.68 | 19.08 s, ratio 2.57 (1,253 close ticks) |
| reach, seed 3, the row's slowest | 2.68 (bar 2.5) | **2.57: still red** |
| reach, seed 9, case k 5 | 36.00 s, ratio 2.98 | 36.17 s, ratio 2.99 (1,519 close ticks) |
| reach, seed 9, the row | 10 of 10 reached, slowest 2.98 | **9 of 10 reached: one case never reached** |
| the dark one, seed 8 juke, timer 30 s | not caught in 370 s of overtime | **caught by the dark one after 13.6 s** (739 close ticks) |

- **The control reproduces all three recorded figures exactly.** The setup is the recorded one, and the dark one's case reproduces at
  `9150ddf` in the old world.
- **The reach row: the lever does not help, and it does harm.**
  - Seed 3 goes from 2.68 to 2.57, still over the bar. Seed 9's case k 5 is unchanged, and one more of its cases is no longer reached in 150 s.
  - This fits section 1: the lever pursues the knowledge's point, and the knowledge's point is the drawn one across a wall.
- **The dark one: the lever closes the orbit.** See the correction in `p-d673-overtime-A_2026-11-13.md` ("10:00", the claim that the orbit is
  the turn).

## 4. The fix, as ruled (item 65 the specification), measured each way on seeds 3 and 9, red first (D, 11:26 local, `date` by the shell)

**The ruling** (`librarian/2026-11-13.md:449`): option 2's guarantee is required; option 1 may go in with it; each is measured on the two
traced cases; the reach row and its bar stay; a new row holds the guarantee.

**The new row, registered before it was written:**
- `a_hunter_near_where_it_was_sent_that_cannot_see_the_player_is_told_exactly` (`chase/tests/proof_tests.cpp`), on the two traced cases.
- **The condition:** the hunter in Pursue has been within its error's radius of its aim for a quarter of a second, without sight of the player.
- **What must follow:** within a second its aim is the player's own place (0.5 m).
- **Why a second:** it acts on what it knew `hunter_reaction_s` (0.4 s) ago.

**The two parts** (`told_code.js`; scratch switches for the measurement, hard-coded after):
- **(1)** the drawn point is kept only if a walk of at most 1.5 x the error + 1.5 m joins it to the player. Up to four draws, the first being
  the draw as it always was; else the player's own place.
- **(2)** the guarantee: each sense tick, a hunter in Pursue, without contact, within the error's radius of its aim (same storey, 1.5 m), is
  told the player's exact place.

checked: `told_none.log` (`2d56f30c`), `told_opt2.log` (`7dbeec5c`), `told_opt1.log` (`c6815799`),
`told_opt1_opt2.log` (`e1f59147`), one build:

| | seed 3, case k 14 | seed 9, case k 5 | the new row | the reach row, slowest (bar 2.5) |
|---|---|---|---|---|
| neither (the code as it was: RED) | 19.85 s | 36.00 s | 0 of 7 held, FAIL | 2.68, FAIL |
| (2) the guarantee alone | 11.01 s | 27.52 s | 2 of 2, ok | 1.73, ok |
| (1) the walk-checked draw alone | 19.85 s | 19.93 s | 0 of 3, FAIL | 2.68, FAIL |
| **both** | **11.01 s** | **19.93 s** | 1 of 1, ok | **1.73**, ok |

- **The librarian's inference is CONFIRMED:** option 1 alone still leaves seed 3 as it was, at 19.85 s. A point within a short walk can still
  lie in the lane outside the doorway.
- **The guarantee is what makes the rows green.**
- **Both together are quickest,** so both went in. The cleaner draw saves seed 9 another 7.6 s over the guarantee alone.
- The every-distance form is not built, as ruled.

**Committed:** dreamzone-3 branch `a-kit-told`, **`dcbfd3c`** on `9150ddf` (`chase/run.cpp`, `chase/tests/proof_tests.cpp`). The
scratch trace file and its CMake line are not committed. Nothing is pushed.

**The chase binary on it.** checked: `kit_fix_chase.log` (`52152450`) → "78 tests, 1 failed": the one red is the sprinter row (section 5),
which has no hunter. The reach row reads 1.73, and the new row holds.
- **Not yet run:** the whole suite and both self-tests on this commit. The fix changes every hunter's knowledge, so every chase fingerprint
  moves with the kit as it is.

## 5. The sprinter row: reproduced, and PARTLY explained; its cause is NOT yet named (D, 11:33 local, `date` by the shell)

**Reproduced:** 70 of 96 with the kit on (bar 72), B's figure. checked: `kit_fix_chase.log` (`52152450`), the row itself.
- The row walks routes with no hunter and no knowledge, so section 4's fix does not touch it (it reads 70 on `dcbfd3c` as before).
- The sprinter walks only (`archetype.cpp:46`), so it never takes a chute itself. The kit can only change which routes it walks.

**Split by what the routes are.** A scratch dump (`diag_door.cpp.txt`, `diag_sprinter_routes`) runs the row's own routes, seeds 1–8, in the kit's world
and in `GenParams{}`. Each route's real corners are counted whole (turns within 3 m summed, 45° or more). checked: `sprinter_split.log` (`24c94fc7`):

| world | routes with one real corner or none | careful sooner on them | routes with two or more | careful sooner on them | all | near-ties (0.05 s) |
|---|---|---|---|---|---|---|
| kit ON | 30 | 16 (53 %) | 66 | 54 (82 %) | 70 of 96 | 4 |
| kit OFF | 23 | 17 (74 %) | 73 | 68 (93 %) | 85 of 96 | 0 |

**What it says:**
- **The route mix is a small part.** The kit gives the row more near-straight routes (30 against 23), where braking for a corner has
  little to win.
  - Had the kit's routes kept the off world's win rates by class, the careful body would be sooner on about 30 x 0.74 + 66 x 0.93 ≈ 83.
  - So the mix accounts for about 2 of the 15 routes. inferred: a weighted sum, not a run.
- **Most of the drop is within each class.** On comparable routes the careful body wins less often in the kit's world: 53 % against 74 % with one
  corner or none, and 82 % against 93 % with two or more. **That part is not named.**
  - B's split says it needs the chutes, the buy rule and the kit's hunter together, so it is the kept chutes' geometry. Which feature of a
    route makes the careful body lose there, I have not found.
- The routes it lost on in the kit's world are in the earlier dump (`kit_fix_chase.log`, the LOST lines).
  - Many are near-straight and lost by 0.02–0.3 s.
  - Some have three or more real corners where the careless body scraped hundreds of ticks and still won: seed 8, 480 scrape ticks against
    57, 7.82 s against 8.01 s.

**What I would do next (not started; the order puts (a) before it unless ruled otherwise):** take the routes with two or more corners that the
careful body loses in the kit's world (12) and trace the two bodies tick by tick on the worst three (seed 4, 79 m: 9.68 s against 10.84 s; seed 5,
71 m; seed 8, 77 m), to see where the careful one gives the time away: braking for a corner it then does not need, or a run it slows into.

## 6. The sprinter row's three worst routes, traced: WHERE the careful body gives the time away (D, 12:44 local, `date` by the shell)

**How:** a scratch row (`diag_sprint.cpp.txt`, never committed) on `a-kit-told` `dcbfd3c` finds the three routes by the row's own loop and
length, and walks both bodies, sampling every half metre of travel. Times are compared at equal distance. The run waited out P's GPU timing session
before it started. checked: `sprint_trace.log` (sha256 `7dbbd43c`). Seed 8 matched two routes of 77 m; the one in question is 77.5 m.

| route | careless / careful (s) | where the gap is made |
|---|---|---|
| seed 4, 79.3 m, 9 path points | 9.66 / 10.82 | **0.44 s** at the start turn (at 3 m: 3.96 m/s against 5.99); **~0.9 s** at a double corner, two turns of about 70° within 7 m around (−47.99, −17.99) → (−45.19, −11.54): the careful body brakes to 5.5 m/s, the careless one goes through at 6–10 m/s scraping the wall (its scrape count 40 → 327) and loses far less; then 45 m of straight at 10.15 m/s for both, the gap flat |
| seed 5, 71.4 m, 11 points | 11.01 / 12.04 | 0.70 s at the start turn (at 3 m: 3.32 against 5.99); +0.52 s at 21 m, where both meet a wall; the careless body gives some back at 52–54 m; +0.33 s at 58 m (the careful one at 1.79 m/s) |
| seed 8, 77.5 m, 21 points | 12.45 / 13.25 | the careful body brakes to **2.2–2.8 m/s** before the corners at 8, 15, 21, 30 and 35 m. The careless one takes the same corners at **7.5–10.15 m/s** and scrapes 56 ticks on the whole route. Its one loss is one wall hit at 11 m (2.86 m/s), where the careful one gains 0.87 s |

**Named:**
- **The careful body gives its time away braking for the path's turns, often to a speed far below what the floor there needs.** It loses at the
  start turn and at each corner.
- The braking is the corner rule: `corner_speed` of the turn ahead, summed within 3 m (my D665 change, `cab3530`). The careless body shows,
  route by route, that a body can go through most of those corners at 7.5–10 m/s, touching a wall rarely or sliding along it cheaply.
- **So in these corners braking costs more than not braking:** the rule reads the polyline's turn, not the room the body has to turn in.

**What I have NOT established:**
- **Why the kit's world has more such corners.** inferred: its kept chutes stand in junction columns, and the path's turns round them in open
  floor are cuttable at speed. Not checked: I have not looked up which cells those corners stand in.
- **Whether the off world's losses have the same shape.** Section 5's table says it loses fewer.

**What would fix the role without moving the row** (for the ruling; not started):
- the corner rule asks for the speed the body's own line needs, not the path's angle; for example, its turning room: the free distance across
  the corner, read off the mesh;
- or a corner is braked for only when the turn's room is narrow.
- Either is a change to every chaser's braking: a hunter fingerprint and catch-power change. It needs its own registration and sweep. Not a
  tuning of this row.

## 7. The whole suite and both self-tests on `a-kit-told` `dcbfd3c`, and which fingerprints moved (D, 15:20 local, `date` by the shell)

checked: `kit_told_suite.log` (sha256 `7c374e3d`): `build.bat test`, `dz-gym --selftest`, `dz-world --selftest`, `world_app_tests`, under the ordinary
lock, while **his game was running on this GPU** (the Riot client, from 14:04), with C's stomp run and P's mutants in the other slot.

**Totals:**
- ctest: 10 of 14 suites passed;
- gym self-test 26 of 26;
- world self-test 50 of 52;
- `world_app_tests` 51 of 51.

**Every red, by name, and why it is not this fix's:**

| red | what it measures | reading |
|---|---|---|
| `gen_tests` `generation_time_and_triangle_counts_are_recorded` (`total / chunks < 5.0` ms) | time | **load-sensitive, under his game**; not retried |
| `audio_tests` `a_full_scene_with_a_room_and_eight_place_sounds_…` (`best < 0.25` ms) | time | **load-sensitive**; not retried |
| `nav_tests` `the_same_requests_give_the_same_paths_whatever_the_workers_do` (`in_time.counts.waits < flat_out.counts.waits`) | worker timing | **load-sensitive**; not retried |
| world self-test "a fall at terminal speed … 1 waits (3.6 ms)" | time | **load-sensitive** (B flagged the same row at 10:43) |
| `nav_tests` `the_way_there_is_about_as_quick_as_the_way_back` (`worst < 0.20`) | the kit's world | B's known red, its bound left to its owner (ruled 10:43) |
| `chase_tests` the sprinter row (70 of 96) | the corner rule | known; its own lap, ruled |
| world self-test "its tell is a light … a sound that grows" | the chute route | **red at the base too** (`kit_base_fp.log`, `8118f3c4`: 51 of 52, this row alone); B fixes the route |

**The fingerprints that moved** (the base `9150ddf` built in the same worktree, `kit_base_fp.log`):
- the world self-test's flee bot: chase `980067e8ed74213a` → **`d9f000c3d8df1d44`**; simulation `643620b6fbd1f5b7`, unchanged.
- `world_app_tests`' flee bot: chase `c5fb2b3e0165f6d1` → **`e14a93fe53887f37`**; simulation `87bb91eb43102d0e` → **`49dfe0821d55d70d`**. The simulation moves too,
  because the bot runs from a hunter that now finds a standing player.
- **Every hunter's chase fingerprint moves with this fix,** as section 4 said. No chase row other than the sprinter's (already red) went red.

**Correction to §7 (D, 15:24 local, `date` by the shell):** the tell row's reading "B fixes the route" is WRONG and superseded. E answered that the row measures
the whole mix; E owns it and has re-registered it. It is neither the kit's fault nor B's route until E's one run says so (the chair's 21:23Z note). The
four timing rows are load, not verdicts, and are owed a quiet re-read before the kit's suite counts toward its landing.
