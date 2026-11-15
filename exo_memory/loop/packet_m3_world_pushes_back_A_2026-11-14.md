# Packet M3 for pane A: the world pushes back (a refused step is a contact; a drop is a fall)

Written by the librarian on D, 2026-11-14, at the collation of M2c and M2b (`handback/p-m2c-m2b-A_2026-11-14.md`, git-blob
b062250a, read whole). Plan: `loop/plan_new_system_2026-11-14.md`. Night's order: `loop/night_order_2026-11-14-D.md`.
Tier: prove it.

**SOURCE: what produces this, and what limits it.** Two lines of the chase produce both faults you read:
- **The refused step.** `chase/chaser.cpp:529` (his clone at 32b9126): when the mesh refuses a step the speed goes to zero in
  one tick, or brakes with `refuse_brake`. Your read 1: every fall of the root's speed to 0 on the ten routes is that line
  (15 in way b, 17 in way a, 5 today; `m3_read1.txt`, read by me).
- **The drop link.** A link moves the body on a straight line with its height as `t²` from the start, and reports speed 0.
  Your read 2: on his run that line meets solid on 18 of 18 casts, at the feet at path ticks 38 and 99 and 1 m up at 103
  (`m3_read2.txt:20-24`, read by me).

## His words (verbatim in `briefs/dreamzone2_the_game.md`, items 223, 225, 227, 159)

- "90 degree turns for sure tons of slow down, or they could like full speed into the wall to slow down instead like how
  the physics proc gen animations should just be"
- "i just did a run, it has lots of good telemetry, but it let it get me at the end, bc i think it cheated by clipping to
  the floor below when i jumped down this area"
- "and remember, its not just for the hunter, but all mobs we will make and even the players character animations as seen
  from first person view, but also consistent from the outside as well."
- "the character must interact with the world dynamically too"

## Ruled at the collation of M2c and M2b

1. **M2c did its job:** the scripted 15 and 22 degree bends keep 9.19 and 9.18 of 9.20 m/s. **M2b did its job:** any kind
   takes the root by its bit, a new kind is a row, and no line of the root names a kind.
2. **The three red rows (G1 on the routes, H1, H2) stay red and stay as registered.** Their cause is this lap's.
3. **Way (b)'s 16 head-on ticks** (11 at hard corners) are a report, by his words. They are read again after M3a.
4. **The branch does not land until its suite is green.**
5. **The sprinter row cannot rule the Park kit on the root,** as you say: care is not something the root reads. The kit stays
   held. Not this lap's.
6. **The root reads no mass,** and none is added until two bodies push each other.

## M3a, a refused step is a contact

**Build, for the root only (kinds off the root keep line 529 as it is):**
- When the mesh refuses a step, the body keeps the part of its velocity that runs along the edge it met and loses the part
  that runs into it. It slides; it does not stop dead unless it met the edge nearly square.
- What it loses along the edge (a scrape) is one number in the kind's row.
- Its heading follows its velocity, eased as the root eases everything else. No re-point.
- From memory, not opened by me: Detour has a query that moves a point along the mesh and slides it on the boundary
  (`moveAlongSurface`); the nav module does not use it today (no match under `nav/` in his clone). Open the header before
  you choose between it and your own edge normal. Mark what is ours.

**Rows, registered before code, each seen red on `b3ade8e` first:**
- **H1 as registered:** no route's low under the creep floor. Red today (6 routes in way b, 4 in way a).
- **H2 as registered:** red today in way (b), worst 49.9 times its bar.
- **The contact itself:** at a refused step met at more than 30 degrees off square, the speed along the edge after it is at
  least 0.8 of the speed along the edge before it, and the speed into the edge is zero. Derive the 0.8 from the scrape number
  you register, or register your own figure with its reason.
- **Read 1 again:** falls to 0 m/s from above 0.3 on the ten routes. Registered: none, except contacts met within 30 degrees
  of square, each printed.
- **G1 on the routes, read again and printed.** Two of its four failing bends are refused steps (your `:51-52`). The other
  two are route 0's points 3 and 5, at a doorway with legs of 0.30 m.
- **For those two, a rule registered now, before anything is counted:** a bend is gentle when the path's total turn within
  3.3 m of it (the arc of a 22 degree bend at grip, 1.65 m each side) is 22 degrees or less. Print the total turn at each of
  the six route bends. If route 0's two points are gentle by that rule, G1 stays red there and it is a finding. If they are
  not, G1's list is amended by name with this rule and they move to the middle band. This amends my own line in the last
  packet ("a bend removed from its list"); the rule comes before the count so that the count cannot choose it.
- **W1 as a report,** beside 16 and 0. **The crawl guard, R1 to R4, off means off, the hunter's fingerprints with the root
  on reported as changed (they will change; say by how much the ten routes' time moves).**

## M3b, a drop is a fall

**Build, for any kind on the root:**
- The body leaves the edge with the velocity it has. Its height does not change before its feet are past the edge.
- From there it is under gravity (9.81) and moves across by its own speed. Its speed reads what it is, not 0.
- It is stopped by what is solid: the fall is swept through the simulation's collision, the one your read 2 cast through.
- It lands where that puts it. If that is not on the mesh within reach of the link's landing, the drop is not taken; the
  plan picks a take-off it can make or another way down.
- `drop_s` in a kind's row is not read on the root. Recovery after landing stays a number in the row.

**Rows, registered before code:**
- **Red first on his run** (`run-20261114-184949.txt`, ticks 35760 on): on the root, the hunter's feet are never more than
  1 cm inside a solid during the drop. Today the link's line is inside one at path ticks 38 and 99.
- **The fall's shape:** no descent before the feet pass the edge; then the height follows free fall within 2 cm a tick. The
  3.5 m takes no less than 0.845 s less one tick.
- **The speed is carried:** across the fall the flat speed never reads 0, and at landing it is within 10 per cent of the
  take-off's.
- **The landing:** on the mesh, not inside a solid, for every drop taken on the ten routes and in the sweep below.
- **The count, before the fix, by his rule that the generator is fixed and not the one room** (`loop/plan_l189_no_unintended_drops_2026-11-12.md:3`):
  over the 12 seeds, how many drop links there are and how many have a straight line that meets a solid, as his did. Print
  it; it says whether the links themselves are placed wrong. If most are, say so and ring before building further: then
  where a link starts is the upstream fault and it belongs to the mesh's builder.
- **Every kind:** the same rows with the sprinter's bit.
- **Off means off:** md5 and his kept runs. With the root off, his run replays as its record, clipping included.

## For his eye

Give pane E's film tool the exact lines for: route 0's hard corner, today, way (b) and way (a) after M3a; and his own drop
(run, ticks, the camera's place below the ledge), today and on the root.

## Registered with this packet

- **M3a is wrong if** H1 goes green because the creep floor was lowered, or a contact is counted as square to excuse a stop.
- **M3b is wrong if** his run's drop, replayed on the root, still shows any part of the body inside a solid.
- **The lap is wrong for the plan if** either step names a kind in the root's code.

## Rules that hold

Trees and builds on G:. `node consonance/tools/heavy-run.js --status` before a heavy run. His words stay out of the game's
repository. Pane B lands the branch once its suite is green. One hand-back with its digest and a `BASE:` line, rung once.
