# M3b amended before its code (2026-11-15 ~01:0x)

Amends `p-m3-world-A_2026-11-14_evidence/registration_m3b.md` (registered before the count; the librarian ruled "build the fall" at the collation of M3).

## One correction to the law, found reading the code before writing it
**Registered:** "its height does not change while its feet are over the mesh it left (the first `e` metres)". **That would sink the feet into the
upper floor:** the mesh stops a body's radius short of the solid's edge, so the first `e` metres end before the slab does. **Amended:** the height
is held while something solid is still within 15 cm under its feet (a short cast down through the world's collision each tick); once nothing is,
it falls under gravity. Without a world to cast through (a test with no collision), the mesh it left stands in for it.

## How the rows run (no bar moved)
- **The count again, on the root:** over gen seeds 1–12, every drop link of the arena: a hunter body on the root is placed at the link's foot,
  facing the landing, given the link as its path at the take-off speed its plan would ask (`drop_takeoffs`), and stepped with the arena's own
  collision until it has landed. Every tick-to-tick segment of its feet (+5 cm) and of 1 m up is cast through that collision. **Registered: no drop's
  swept fall meets a solid.** Printed: how many landed at the link's landing, landed elsewhere on the mesh, and were put back (not taken).
- **The fall's shape, the speed carried, the landing,** read on those same drops: no descent while held; then the height within 2 cm of free fall
  from the moment it left; the time down no less than `sqrt(2h/g)` less a tick; the flat speed never 0 across the fall unless a wall took it (counted
  and printed), and at landing within 10 % of the take-off's; the landing on the mesh.
- **Every kind:** the same count with the sprinter's numbers.
- **His run's drop:** a scratch tool (never committed) replays his run to tick 35760 on the game's own world, places a hunter body on the root at the
  link's foot (−67.64, 3.54, −484.27) with the link as its path, steps it with that world's collision, and casts its path as read 2 did: the feet
  never more than 1 cm inside a solid (no segment meeting one).
- **Off means off:** md5, D's kept runs; today's drop is unchanged off the root.
