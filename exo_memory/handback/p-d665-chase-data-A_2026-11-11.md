# D665 measure (1): his long run, the chase in numbers (pane A, machine D, 2026-11-11 16:43 local, `date`). Tier: JUST DO IT

Packet: chair D665 (22:22Z, delivered 22:40Z). Plan: `librarian/2026-11-11.md` 16:21, "PLAN D665".

His words (16:21, brief item 91): *"the proc gen does get way too repetitive over time … for most of it i cant see how its keeping up with me,
how is the data"*.

**The run:** `game/runs/run-20261111-221301`
- brutal, seed 1, built from `b212ae8`;
- caught by the pack (#64) after 450.85 s;
- the hunter's two close calls: 1.4 m at 418.7 s and 2.3 m at 431.6 s (from the run's own file).

**How it was measured, and what changed (no code):**
- A read-only worktree at `b212ae8` (`G:\consonance-scratch\a-d665-dz3`, detached).
- A 14-line probe, environment-guarded and **never committed**, printed him and every chaser every 0.1 s, and every 10 s the director's
  own reckoning of the hunter's travel time to him.
- checked: `dz-world --replay-run …221301.txt` → "the same run to the bit (both fingerprints match)".
- The numbers come from `scratchpad\d665\d665.js` over that log; its output is `scratchpad\d665\d665_out.txt`.

## The table: every 10 s

"Distance" is straight-line over the ground plan, and floors are counted at 3 m. The travel time is the director's (`Run::hunter_eta`, by the
mesh). The lesser chasers listed are those within 60 m at that moment.

| t (s) | his speed, mean (m/s) | hunter: mode | distance (m) | travel time (s) | speed / top (m/s) | top over his speed | lesser chasers within 60 m |
|---|---|---|---|---|---|---|---|
| 10 | 7.7 | pursue | 43 | 5.5 | 10.3 / 10.7 | 1.39 | interceptor 29 m (investigating) |
| 30 | 9.9 | pursue | 40 | 3.9 | 2.3 / 10.9 | 1.10 | sprinter 53 m (investigating) |
| 60 | 7.5 | pursue | 51 | 6.0 | 7.2 / 11.2 | 1.50 | interceptor 28 m (investigating) |
| 90 | 9.8 | pursue | 76 | 7.3 | 11.8 / 11.6 | 1.18 | interceptor 14 m (pursuing) |
| 120 | 9.2 | pursue | 47 | 4.3 | 12.9 / 11.9 | 1.29 | - |
| **135** | | | | | | | *the speed model's overtake on normal* |
| 150 | 9.9 | pursue | 20 | 1.7 | 0.6 / 12.3 | 1.24 | 2 pack, ~43 m (pursuing) |
| 160 | 9.8 | pursue | 12 | 1.0 | 12.7 / 12.4 | 1.26 | - |
| 180 | 9.8 | pursue | 36 | 2.9 | 2.3 / 12.6 | 1.29 | 2 sprinters, 36-56 m (investigating) |
| 210 | 9.9 | pursue | 31 | 2.8 | 9.6 / 13.0 | 1.32 | 2 sprinters (investigating, leaving) |
| 240 | 9.9 | pursue | 66 | 5.4 | 1.4 / 13.4 | 1.36 | interceptor 29 m (pursuing) |
| 270 | 9.8 | pursue | 66 | 5.0 | 14.7 / 13.8 | 1.40 | - |
| 300 | 9.9 | pursue | 57 | 4.3 | 5.9 / 14.2 | 1.43 | interceptor 45 m (pursuing) |
| 330 | 9.8 | pursue | 44 | 3.1 | 5.0 / 14.5 | 1.49 | 2 pack, 20-56 m |
| 360 | 6.8 | pursue | 8 (a floor apart) | 3.9 | 4.5 / 14.6 | 2.15 | sprinter 48 m, interceptor 28 m |
| 390 | 8.3 | pursue | 77 | 5.8 | 4.4 / 14.7 | 1.77 | 2 pack, 13-44 m (pursuing) |
| 420 | 9.8 | pursue | 2 | 0.1 | 14.2 / 14.8 | 1.52 | 2 pack, 32-57 m (pursuing) |
| 430 | 9.7 | pursue | 7 | 0.5 | 4.9 / 14.9 | 1.53 | - |
| 450 | 9.9 | pursue | 29 | 2.2 | 15.5 / 14.9 | 1.50 | 3 pack, 17-45 m (pursuing: #64 catches him at 450.85 s) |

The full 45-row table, every 10 s, is in `d665_out.txt`.

**Where the hunter's gap opened** (the hunter in pursuit, 423 s of the run; every 0.1 s, by what the hunter was doing):

| where | seconds | gap he opened (m) | gap it closed (m) | net, + is him pulling away (m) |
|---|---|---|---|---|
| the hunter at a corner (under 80 % of its top) | 202 | 858 | 81 | **+777** |
| the hunter on stairs | 9 | 67 | 1 | +66 |
| the hunter on a link (ladder, drop, climb) | 3 | 20 | 0 | +20 |
| the hunter on a straight (80 % of its top or more) | 210 | 137 | 882 | **−745** |

## The reading

**How it keeps up:** the hunter was behind him the whole run, 2 to 7 s by the director's reckoning and 20 to 77 m away. It came within 2 m
only at 418.7 s and 431.6 s. He covered 4.17 km at a mean 9.25 m/s.

**Why the speed model's ~135 s overtake did not end it:**
- **That 135 s is the moment the hunter's *top speed* passes the player's on *normal*** (`chase/SPEED_MODEL.md`, the table at 10 m/s, ref 8).
  - **On brutal its top was above his from the first second:** 1.09 to 1.55 times his speed (`start_minutes 5`, `pace 1.6`).
  - **So the overtake in speed happened at once, and was never the limit.**
- **What the hunter wins on the straights it gives back at the corners:**
  - It closed 882 m on straights and lost 858 m at corners.
  - It spent **202 s of its 423 s of pursuit, 48 %, under 80 % of its top**, and **147 s (35 %) under half of it**.
  - It slowed under 1 m/s **226 times** (28 s in all, the longest 2.6 s), every time on the mesh or a ladder and never standing after a wall.
  - That is the model's corner rule working as registered (a turn costs speed, "at least a fifth"), on a route through apartments and a
    school that turns all the time.
  - Net over the run, he pulled away by about 120 m: the four rows of the second table summed.
- **The lesser chasers rarely found him.**
  - 63 were sent: one every 8 s or so, near him.
  - **The 21 sprinters pursued him for 6 s in all.** The rest of their lives were spent investigating and then leaving.
  - The interceptors pursued for 9 to 19 s each, the packs 0 to 19 s.
  - The catch came from a pack sent 4 s earlier, at 447 s, with 2 s of pursuit.
- **So "how is it keeping up":** the hunter is never more than a few seconds behind, because it is faster everywhere but at corners. What he
  meets is mostly what the director drops near him every few seconds, and those mostly do not find him.

**What this does not measure** (plan step (2), B's): the repetition of the generator, which is the other half of his sentence.

**Measures, not causes:**
- The distance is straight-line, so it reads wrong round walls. The travel time is the mesh's.
- The categories are the hunter's own state: "a corner" means under 80 % of its top, which also counts the braking before and the
  speeding-up after.

**For D664 (the same code):** the corner braking measured here is the same mechanism D664's cause names. D664 changes how the turn is
steered, not how much speed a corner costs. The sweep before and after (D664 §2) will say whether it changes the chase's reach.
