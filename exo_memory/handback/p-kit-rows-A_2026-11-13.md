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
