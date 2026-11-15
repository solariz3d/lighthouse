# M3d, the count first: how often a replan moves the path to the other side of a solid near the body. Registered before it runs (2026-11-15 ~07:20 local, seat A)

Ruling: `exo_memory/loop/packet_m3c_m3b_A_2026-11-15.md`, M3c item 5 and the fall's item 5: "read first and print: on the ten routes and on
pane E's three bends, how often a replan moves the path to the other side of a solid the body is within a body's length of, under today's law
and under the root. Nothing is built for it in this lap." All of it is scratch (never committed); only the counts are reported.

## The test, at each replan of the hunter
- `old` = the path it was following, from its nearest point to the body onward; `new` = the path the replan gave.
- For each point `p` of `old` within 3 m of path ahead of the body (sampled every 0.25 m), the nearest point `q` on `new`. If the mesh is
  **not open** from `p` toward `q` (`nav::Query::open_along(p, q - p, |q - p|)` short of `|q - p|` by more than 5 cm), there is a solid
  between the two paths there; it is a **flip** if that solid (the point where the line stops) is within **1.0 m** of the body ("a body's
  length": the ruling's words, my number, stated now; also printed at 0.5 m and 2.0 m).
- One flip at most per replan. Printed: replans, flips, flips per replan, and for each flip the tick, the body's position and the solid's.

## Where it is read, both laws (today's: `root_law` 0; the root: way (b) grip only, way (a) slows for a bend; on e040a87's law)
1. **Pane E's three staged bends** (`dz-world --film-corner --corner 22|45|90`, E's staging, the hunter's own replans), in a throwaway tree.
2. **The ten corner routes**, walked to their fixed target with a replan to that target at the run's own cadence (`hunter_replan_s`): a
   stand-in, because the routes' walk plans once. A fixed target can only flip by the body's drift; expected low.
3. **Also read, beside the ruling's two:** the 12-seed sweep's chases (`dz-chase sweep --seeds 12 --levels 1`), every hunter replan, where the
   target moves as the flee bot runs.

## Registered expectations, and what would be unwelcome
- Expected: flips occur on E's 22 degree bend in every arm (the one read by hand at tick 691), rarer on the routes (fixed target).
- **Unwelcome, named now:** if the root's flips are no more frequent than today's law's, the flip is the planner's alone and the root's
  slowness at the bend is not its fault; if the routes show flips as often as the moving-target runs, the cause is drift, not the goal.
- Falsifier of the instrument: a flip printed where the two paths do not in fact pass on opposite sides (checked by reading the first three
  printed flips' points against the PATH lines by hand). If any of the three is wrong, the counts are withdrawn.
