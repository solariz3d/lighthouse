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
