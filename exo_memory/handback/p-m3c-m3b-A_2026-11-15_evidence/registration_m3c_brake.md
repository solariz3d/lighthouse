# The slide that cannot reverse along a wall: brake and leave the other way. Registered before code (2026-11-15 ~06:25 local, seat A)

Ruling: `exo_memory/loop/packet_m3c_m3b_A_2026-11-15.md`, "RULED at the collation of the fall" (git-blob ecfb72d7), item 4.

## The law
At a contact the body records the wall's outward side (`Chaser::wall_n`: the part of the attempted step the edge refused, reversed, made
unit; kept from the last contact when a contact is too grazing to read one). While it slides, the aim is read along the wall:
- **if it points the way the body slides** (`aim . u >= 0`, `u` the velocity's direction), or the turn toward it swings away from the wall,
  the corrected law (3fb9f21) holds: the velocity turns toward the aim at the root law's allowed rate.
- **if it points the other way and the turn toward it swings into the wall** (`aim . u < 0` and the turn's side `. wall_n < 0`), the wall
  refuses the turn: the body spends its grip on braking, `min(brake, mu g)` (the hunter: min(12, 9.81)), with no turn. When it comes to rest,
  its velocity's direction is the wall's other way (a zero velocity has no direction to keep) and it leaves that way, its speed growing only by
  the root law's acceleration; the heading eases round after it as in any slide.

**Why a case and not the one rule** ("acceleration toward the velocity it wants, no larger than grip, less what a wall refuses"): read
literally, the one rule brakes whenever the wanted velocity is behind, including when the turn is free of the wall, and there check 2 (kept,
ruled right) asks the velocity to turn at no less than 0.9 of its allowed rate. The case keeps both: the wall refuses only the part of the
turn that points into it. The creep floor in `root_tick` is not touched; the brake sets the speed after it, by the ruling's words ("comes
to rest against the wall").

## Rows, by name, red first on 3fb9f21 (the fields are added and computed first, the law left as it is)
- **New row, `m3c_along_a_wall_with_the_aim_behind_the_body_brakes_at_its_grip_and_leaves_the_other_way`**, over the ten corner routes and the
  three scripted bends, both ways. On each sliding tick with no new contact, with the aim behind along the wall and the turn toward it into
  the wall: it brakes by at least 0.9 x `min(brake, mu g)` x dt, or is at rest. **Bar: no such tick that does not brake; and at least one such
  tick seen** (a row that sees none is red).
- **The falsifier, registered:** wrong if the body is turned about by hand at a wall: printed as the ticks where the velocity's direction
  changes by more than 90 degrees while its speed is above 0.05 m/s before and after. **Bar: 0.** Also wrong if the creep floor is lowered
  (`kCreep`, read in the diff).
- **Check 2, amended by name before the run:** the ticks where the wall refuses the turn and the body brakes (`Chaser::slide_brake`) are not
  turning ticks and are left out of it; every other qualifying tick still turns at no less than 0.9 of the allowed rate.
- **Pane E's 22 degree bend, ticks 1068 to 1122 on 3fb9f21:** the velocity put back along the wall pointing about 150 degrees from the aim at
  1.2 m/s. Read from the TICK/AIM lines with the law: no run of ticks sliding with the aim more than 90 degrees off where the speed does not
  fall by 0.9 x 9.81 x dt a tick (before it is at rest).
- Printed beside them: H1's lowest (0.09 on 3fb9f21, way (b)), H2 way (b) (5.87 of its bar), the staged bend's time and lowest.

**Unwelcome, named by the ruling and taken:** the staged 22 degree bend is still slower than today's 0.889 s. Then the path's flip at the
post is the larger cause, M3d's.
**Also possible, named now:** H1's lowest falls to 0 by design wherever the body rests to turn about, so H1 can read worse; that is printed,
not turned.
