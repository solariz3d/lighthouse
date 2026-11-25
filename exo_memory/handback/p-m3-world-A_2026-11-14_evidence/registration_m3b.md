# M3b, a drop is a fall: registered before code

Pane A on D, ledger D677, the packet's "M3b". Written ~20:5x local, after M3a's registration and **before the count has printed** (the count is the
gate: if most drop links' straight lines meet a solid, this is rung before anything is built, and the links' placement is the mesh builder's).

## The law (any body on the root; every other body keeps `cross()`'s drop as it is)
- **Take-off:** the plan at a drop's foot asks, instead of 1 m/s, the speed that carries it from the edge to the landing in the fall's own time:
  `v = max(1.0, (d − e) / sqrt(2 h / g))`, `d` the link's flat length, `e` the mesh's room from the foot toward the landing (`open_along`), `h` the
  drop's height. It is taken from within the link's foot radius whatever its speed.
- **The fall:** its height does not change while its feet are over the mesh it left (the first `e` metres); then it is under gravity (9.81), height
  `y_from − g t²/2` from the moment it leaves the edge, and it moves across at its take-off speed toward the landing. **Its speed reads its flat
  speed, never 0.**
- **Swept through the simulation's collision** (the probe read 2 cast through: the chase's `Sight` gains a cast that returns where a line meets a
  solid; the arena's and the streamed world's are the simulation's own `raycast`): each tick the flat move is cast at the feet (+0.05 m) and 1 m up,
  and if either meets a solid the flat speed is lost; the fall is cast at the feet, and where it meets a solid it lands there.
- **The landing:** on the mesh within reach (0.6 m) of where the fall put it. If that is within 1.5 m of the link's landing, the leg is done and the
  body recovers for its row's `drop_recover_s`; anywhere else on the mesh, it lands there and plans again; off the mesh, it is put back where it
  left (today's rule for a link with no landing). `drop_s` is not read on the root.
- **Not built in M3b, said now:** "the plan picks a take-off it can make or another way down" before a drop that cannot land. A drop that lands
  elsewhere replans from there; a drop that cannot land at all is put back and replans (and may choose the same link again; counted, not looped
  over: the hand-back prints how often).

## Rows
- **Red first on his run** (`run-20261114-184949.txt`, from tick 35760): on the root, the hunter's feet are never more than 1 cm inside a solid
  during the drop (read as: no feet-high or 1 m-high tick-to-tick segment of its path meets a solid, as read 2 cast). Today the link's line meets one
  at path ticks 38 and 99 (read 2). **If his run's drop is not reached on the root** (the root's hunter takes another way, or is elsewhere at that
  tick), the row is run on his drop's link by itself: the hunter placed at its foot on the root, sent across it.
- **The fall's shape:** no descent before the feet pass the edge; then the height within 2 cm a tick of free fall; the 3.5 m takes no less than
  0.845 s less one tick.
- **The speed is carried:** the flat speed never reads 0 across the fall, and at landing it is within 10 % of the take-off's.
- **The landing:** on the mesh, not inside a solid, for every drop taken on the ten routes (which today hold no drop: said if so) and in the sweep.
- **The count, before the fix:** over gen seeds 1–12, drop links and those whose straight line meets a solid.
- **Every kind:** the same with the sprinter's bit. **Off means off:** md5, D's kept runs; his run with the root off replays as its record.
- **M3b is wrong if** his run's drop, on the root, still shows any part of the body inside a solid.
