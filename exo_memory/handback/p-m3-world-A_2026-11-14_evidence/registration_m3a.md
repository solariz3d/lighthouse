# M3a, a refused step is a contact: registered before code

Pane A on D, ledger D677, packet `loop/packet_m3_world_pushes_back_A_2026-11-14.md` (git-blob `d68af7ef`, 104 lines, read whole). Written
2026-11-14 ~20:2x local, before any line of M3a. Base: `a-m1-root` `b3ade8e` merged with the game's main `32b9126` (**a merge, not a
rebase**: the branch is on the remote) as `d278b23`.

## Detour, opened (the packet's ask)
`DetourNavMeshQuery.h:378-390` and its source's notes (`DetourNavMeshQuery.cpp`, before `moveAlongSurface`): it "moves from the start to the end
position constrained to the navigation mesh"; "resultPos will equal the endPos if the end is reached. Otherwise the closest reachable position
will be returned"; "optimized for small delta movement"; the result is "not projected onto the surface" (`getPolyHeight` for that). A tick's
step is centimetres, so it fits. **Chosen over an edge normal of my own:** it is the mesh's own answer to "where does this step end against the
edge", and its slide is the projection onto the boundary. One added nav query, `nav::Query::move_along(from, to, profile)`, in a nav-only commit
with its own row (the same answer twice; the result on the mesh; never further than asked; against an edge, a point on the edge).

## The law (root only; every other body keeps `chaser.cpp`'s refused step as it is)
- **A contact:** where today the mesh refuses a root body's step, the body moves to `move_along(from, proposed)` instead, and its velocity keeps the
  part along the edge it met and loses the part into it: the edge's direction `ê` is the slide's own direction (`from` to the result), and the
  velocity after is `ê · (v·ê) · (1 − scrape·dt)`. It stops dead only when it met the edge square (`v·ê` near 0).
- **Sliding:** a body whose velocity is not along its heading (after a contact) travels along its velocity, not its heading; its heading turns
  toward the velocity at the root's own turn rate and ease (no re-point); once they agree within 3 degrees it travels along its heading again.
  A second contact while sliding takes only the part into the new edge. So the wall takes the normal part once, not again each tick.
- **The scrape:** `Limits::scrape`, the share of its speed along the edge a body loses per second of contact; **1.0 for every kind** (ours:
  half a second against a wall costs 39 %, a tick 0.42 %). The 0.8 of the contact row is therefore `1 − scrape·dt` (0.9958) less room for the
  slide's own geometry.

## Rows (each seen red on the present tip `d278b23`, which is `b3ade8e` plus main's four game files; printed)
- **H1 as registered** (the creep floor, re-point 0): red today.
- **H2 as registered:** red today in way (b).
- **The contact:** at a contact met more than 30 degrees off square, the speed along the edge after is at least 0.8 of the speed along the edge
  before, and the body does not move into the edge (the result is on the mesh). Red today: a refused step's speed is 0.
- **Read 1 again:** falls to 0 m/s from above 0.3 on the ten routes: none, except contacts within 30 degrees of square, each printed.
- **G1 on the routes, read again and printed,** with the packet's rule registered now, before counting: **a bend is gentle when the path's total
  turn within 3.3 m of it (1.65 m each side) is 22 degrees or less.** Printed for each of the six route bends. If route 0's points 3 and 5 are
  gentle by it, G1 stays red there and it is a finding; if not, G1's list is amended by name with the rule and they move to the middle band.
- **W1 report** beside 16 and 0; **crawl guard**; **R1–R4**; **off means off** (the 12-seed md5 re-measured on main `32b9126`, and D's kept runs
  as on main); **the hunter's fingerprints with the root on reported as changed, with the ten routes' time.**
- **M3a is wrong if** H1 goes green because the creep floor was lowered, or a contact is counted as square to excuse a stop.
