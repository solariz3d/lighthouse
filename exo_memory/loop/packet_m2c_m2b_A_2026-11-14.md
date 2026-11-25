# Packet for pane A: the aim ahead (M2c), then the root for every kind (M2b), then two reads for M3

Written by the librarian on D, 2026-11-14 19:1x, at the collation of M2 (`handback/p-m2-speed-plan-A_2026-11-14.md`, git-blob
dbc118d3, read whole). Plan: `loop/plan_new_system_2026-11-14.md`, "AMENDED 18:5x". Night's order:
`loop/night_order_2026-11-14-D.md`. Tier: prove it.

**SOURCE: what produces this, and what limits it.** The root's speed is set by a plan over the path ahead and by a cap on
the turn to its aim. Your M2 read what limits it: the aim is the next path point, a metre or less ahead, so a small offset
from the line reads as a large angle at a short distance, and the cap brakes a 15 degree bend to the creep speed (your `:82-86`,
marked inferred).

## His words (verbatim in `briefs/dreamzone2_the_game.md`, items 223 and 227)

- "anything like 45 degrees under is like smooth banking turns"; then "i think 45 is too generous right, what am i thinking
  like half that"
- "90 degree turns for sure tons of slow down, or they could like full speed into the wall to slow down instead"
- "and remember, its not just for the hunter, but all mobs we will make and even the players character animations as seen
  from first person view, but also consistent from the outside as well."

## Ruled at the collation of M2

1. **G1 stands red as a finding.** The scripted 15 degree bend was entered at 9.20 m/s and the plan asked 1.25 where grip
   allows 9.20 (your `am_chase_tests.txt:294`, read by me). That is the opposite of his banked turn. Your question "for a
   ruling" is answered: yes, read the turn to a point further ahead. It is step M2c below.
2. **H2 is a defect of its registration, as you say** (a bar of 0.00 s). It is registered again below from the body's own
   numbers, not from the old body's reading.
3. **W2's entry check is amended by name:** it compares the entry speed with what the plan allows at that point for the body
   as it arrives, run-up included. Its subject, the contact at route 0's corner, is gone and stays a row.
4. **H1's zeros go to M3,** after a counter says where they come from (the last section here).
5. **`a-m1-root` does not land while its own rows are red** (chase_tests 89, 5 failed). The chair is told; pane B waits for
   your next ring.

## M2c, the aim ahead

**R0, print before the change.** For the scripted bends of 15, 22, 45 and 90 degrees, at each tick: the distance to the aim,
the angle to it, and the sideways pull the cap computes. It turns your inferred cause into a checked one, or it does not;
either way it is printed first.

**The change.**
- The aim is a point on the path a distance ahead that grows with speed: `d = max(d_min, T * speed)`. Register `T` and
  `d_min` with their derivation before the run. A place to start from, as arithmetic and not as a bar: at 9.2 m/s grip's
  radius is 8.63 m, and a 22 degree bend at that radius is 3.3 m of arc.
- The cap on the turn is computed to that aim.
- **The aim is pulled in until the mesh is open along the line to it** (your `open_along`), so a longer aim never points
  through a corner.
- From memory, not opened by me: this is the pure-pursuit law of path tracking (curvature `2 sin(angle) / d`), usually
  credited to Coulter's 1992 report from Carnegie Mellon, with the distance scaled by speed as common practice. Open a source
  or mark it ours.

**The corner's room, said as two limits.** Your formula, `room * cos(h) / sin(h)` with `h` half the bend, is the limit set
by the length of the straight legs. My arithmetic of 12:1x was the limit set by the corridor's width, `w / (1 - cos(h))`,
and it left the legs out, so it overstated what a short leg allows. The radius a body can take is the lesser of the two.
Run by me (one node line, 19:0x), for a width of 3 m:

| bend | by width | by a 6 m leg | by a 3 m leg | grip's speed on the lesser, 6 m leg |
|---|---|---|---|---|
| 15 degrees | 350.7 m | 45.6 m | 22.8 m | 9.20 m/s (its top) |
| 22 degrees | 163.3 m | 30.9 m | 15.4 m | 9.20 |
| 45 degrees | 39.4 m | 14.5 m | 7.2 m | 9.20 |
| 90 degrees | 10.2 m | 6.0 m | 3.0 m | 7.67 (5.42 on a 3 m leg) |

Say which of the two your `room` measures, and print both limits for the four scripted bends and for route 0's corner from
the mesh's own numbers.

**Rows, registered before the run.**
- **G1, unchanged:** on the routes' bends of 5 to 22 degrees and the scripted 15 and 22: no wall, and the lowest speed at
  least 0.8 of the lesser of entry speed and what grip allows. Red today; it is the row this step is for.
- **G2, unchanged:** the order 15, 22, 45, 90 never rises.
- **W2:** no head-on contact within 3 m of route 0's corner; the entry check as amended above.
- **W1, a report by size of bend,** beside M2's 2 and 0. **The unwelcome outcome, named now:** G1 goes green and the head-on
  ticks on the ten routes rise above M1's 9. Then the aim is too long, and it is rung before more is built on it.
- **H2, registered again:** after a wall contact, the time until the body is back at half its top is at most 1.5 times
  what its own forward gain needs from the speed it left the wall with. Derive the number before the run. Red on a stub
  that stands for two seconds.
- **The crawl guard** (ten routes' time over today's, at most 1.25), **R1 to R4, and off means off** (md5 `fa938de4…`, his
  kept runs) as before.
- Each row is seen red on the present tip before its code, and its number printed.

## M2b, the root for every kind

**Build.**
- The stepper and the speed plan take their numbers from a row for the kind: mass, top speed, grip, forward gain, braking,
  and whatever else the root reads. No line of the root's path names a kind.
- Any chaser kind can be switched to the root, kind by kind. Every kind is off by default.
- The hunter's row holds the numbers it has now, so the hunter on the root reads the same before and after this step.

**Rows, registered before the run.**
- **Off means off:** md5 `fa938de4…` and his kept runs.
- **The hunter unchanged:** with `root_law=1`, the ten routes and the scripted bends read the same to the bit as before
  M2b.
- **The sprinter on the root:** R1's bound with the sprinter's numbers; the ten routes as a report.
- **A new kind is a row.** A test adds a kind by its row alone and runs the ten routes. The test's diff touches no file of
  the root.
- **The sprinter row** (`chase/tests/body_tests.cpp:190`): print it with the sprinter on the root, in main's world and in
  the kit's (`a-l210-merge`). No bar is moved. The kit's landing is ruled from that print.
- **R5 as a report:** catches at normal and brutal with every kind on the root, beside main's 58 and 2.

## Two reads for M3, at the end, read only

1. **H1's zeros.** The counter you named: of the ticks where the root's speed reads 0.00 on the ten routes, how many follow a
   refused step.
2. **The drop of his run** (item 225; your trace is collated, and it corrects what I told him at 12:5x). The link ran from
   about (-67.64, 3.54, -484.27) to (-70.50, 0.04, -484.50) in 0.904 s. Print every solid of that world within 0.3 m of the
   straight line between them. That says whether the body came down through the ledge, which is what "clipping" would be.

## For his eye

The film of the same corner under today's rule, way (b) and way (a) is pane E's tool; its packet is amended tonight to film
a live chaser under a given speed model. Give in your hand-back the exact lines to run for each arm.

## Registered with this packet

- **This step is wrong if** G1 goes green by a bar moved, a row dropped, or a bend removed from its list.
- **M2b is wrong if** a second kind on the root needs a line of code that names it.

## Rules that hold

Trees and builds on G:. `node consonance/tools/heavy-run.js --status` before a heavy run. His words stay out of the game's
repository. Pane B lands it once the suite is green. The hand-back is one file with its digest and a `BASE:` line, rung once.
