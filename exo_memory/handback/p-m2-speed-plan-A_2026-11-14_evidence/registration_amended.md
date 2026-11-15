# M2 amended (his words of 12:13 and 12:15): registered before the amended code

Pane A on D, ledger D676. The packet's "AMENDED 12:2x" and "CORRECTED 12:2x" (`loop/packet_m2_speed_plan_A_2026-11-14.md`, git-blob
`45615d59`, 133 lines, committed at lighthouse `d1e1afed`; read whole from :94). Written ~12:3x local, AFTER the first M2 build
(`4e66b99`) had run its registered rows and BEFORE any of what follows is coded or run. Where this disagrees with `registration.md`,
this holds.

## What the first build already read (so the amendments below are written knowing it)
On `4e66b99` (the plan as first registered): W1 25 head-on wall ticks against today's 6; W2 route 0 still met its wall, 12 ticks, at a
bend of about 15 degrees the plan rightly read as one grip carries at the top speed, because the next path point came 2.75 m ahead at
18 degrees off the heading at 8.8 m/s (a turn of about 17 m/s^2 against grip's 9.81); W3 0 of 12; and with the root on the hunter stops
dead at four corners. So, before any change below: **the corner reading is not what failed; the turn to the next point is, and so is the
root's forward law, which brakes to a stop when its aim falls behind it.**

## The changes, registered
1. **The turn to the next point (for G1 and W2).** The plan also caps the speed now at the one grip can turn to its aim on:
   `sqrt(grip_mu g · dist / (2 sin|err|))` for `0.05 < |err| < π/2` (dist the distance to the point it heads for), the grip form of the
   facing-away cap the root stopped using (`chaser.cpp:411-420` today uses the turn-rate law there). With the aim at or behind its side
   (`|err| ≥ π/2`), the creep speed.
2. **Never all of it (for H1).** In `root_tick`, while going, the forward target along the heading is never below the lesser of `want`
   and the creep speed (`kCreep`, 1.2 m/s: the chase's own "slowest a corner ever asks for"): `max(want cos err, min(want, kCreep))`.
   So a body whose aim falls behind it keeps moving while it turns; turning at 1.2 m/s it turns on its feet at most at `turn_slow`,
   and its heading still moves only by its turn rate.
3. **The two ways at a hard corner** (a speed-model field `corner_feel`, root only, default 0):
   - **0, way (b):** the plan brakes only as far as grip can make the bend on the mesh's room, as built in `4e66b99`, and the wall takes the rest.
   - **1, way (a), his feel:** each point's speed is also at most `top · feel(θ)`, with `feel = 1` for θ ≤ 22°, falling linearly to
     **0.30 at 90°**, and 0.30 beyond. Reason for 0.30: "90 degree turns for sure tons of slow down ... losing some speed but not all
     of it"; today's body's lowest speeds at the ten routes' 70°+ corners run 1.19 to 4.36 m/s (W3's print on `4e66b99`, root off) on a
     top of 8, about 0.15 to 0.55; 0.30 sits inside that. 22° from "like half that" (12:15). His choice of feel; a number to move.

## The rows (red first where red; each printed root off, way (b) and way (a))
- **W1, amended by name (his words of 12:13 the reason): a REPORT, no bar.** Head-on wall ticks and contacts (a run of consecutive head-on
  ticks), split by the bend at the contact (≤ 22°, 22 to 67°, ≥ 67°).
- **G1 (the gentle bend, ≤ 22°):** on the ten routes, at every bend of 5 to 22 degrees (the sharpest point of each, by the chord reading)
  and on two scripted bends of 15 and 22 degrees entered at 9 m/s: no wall tick within a second of it, and the lowest speed within a
  second of it at least 0.8 of the lesser of the entry speed (a second before) and grip's speed for the room there. Scripted bends: a
  polyline with one corner point, every room 3.0 m, a body of top 9.2 m/s (the chase's speed at brutal), the law and the plan alone (no
  mesh, so no wall reading there).
- **G2 (the order), scripted, the same bends plus 45 and 90:** the lowest speed through the bend does not rise as the bend grows (15, 22,
  45, 90), and 45's is strictly between 22's and 90's. Printed beside what grip alone could carry at each (the plan's grip speed for the
  bend) and what the plan asked. Way (a) and way (b).
- **H1 (the hard corner, ≥ 67°), with W3 amended by name to it:** at each of the walk's corners (70° or more), from a second before to a
  second after, and for a second after any wall tick, the speed is never below **the creep speed, 1.2 m/s** (reason: the chase's own
  slowest corner speed; "not all of it"), leaving out the walk's first and last second (a start from rest and an arrival are not a
  corner). And no re-point: the heading never moves by more than its turn rate times the tick (the M1 reading, ≤ 1e-4 rad).
- **H2 (running again after a wall):** from the first tick of each contact, the seconds until the speed is back to half the body's top.
  **Bar: no root recovery longer than twice the old body's longest on the same ten routes** (reason: the old body meets walls on one
  route only, so its longest is one sample; twice it is the margin). If the old body has no contact, the bar is 1.0 s and said so.
- **W2 stands** (route 0's corner; it is a G1 bend). **"Wrong if it crawls" stands** for both ways (≤ 1.25 times today's total time).
- **Both ways printed** for his eye: total time over the ten routes, contacts and lowest speeds by bend class.
- **The film of the same 90 degree corner both ways: not possible in this lap.** `--capture-corner` stages the hunter on a scripted curve at
  6 m/s (`game/world/offscreen_models.cpp`), and no offscreen mode films a live hunter at a corner (only `--capture-run`'s HUD and results
  card run the chase); `--chase-speed` there would change no frame. Said in the hand-back with the smallest real form.
