# The corner rule reads the room the body has, not the path's angle: registered before any code (pane A, D, Friday 15:21 local, `date` by the shell). Tier: PROVE IT

Ruling: `exo_memory/librarian/2026-11-13.md:505` (the sprinter trace, `p-kit-rows-A_2026-11-13.md` §6). The order: after the `a-kit-told` suite (done, §7), before the
second grid. It stays on a branch: **this is a feel change to the chase he has driven** (how fast chasers take open corners), and it does not land or ride
a release without his look.

## What changes, registered

- **Today:** `corner_speed(body, angle)` (`chase/chaser.cpp:170-179`) turns the corner's summed turn into a radius with a FIXED room,
  `kCornerRoom = 0.9 m` ("about a third of a corridor", `:15`): `radius = 0.9 · cos(θ/2) / sin(θ/2)`. So a corner in open floor is braked for
  as if it were a corridor's.
- **The change:** the room is READ OFF THE MESH for each corner the body heads for: the free distance from the corner's path point outward
  along the corner's outer bisector, to the mesh's edge. It is clamped below at 0.9 m (never less room than today) and above at a cap
  (registered: 6 m).
  - **How:** a Detour raycast (`dtNavMeshQuery::raycast`), deterministic for one mesh, as `find_path` already is. It is computed once per
    path point when the body's leg moves to it, not every tick.
  - **It needs one small, additive query in `nav/`** (`nav::Query::open_along(from, dir, max, profile)`). **`nav/` is not my area:** the
    librarian is asked to name its owner, and no other `nav/` line changes.
- **Every chaser's corner braking changes, so EVERY hunter fingerprint will move.** It is still careful bodies only: `corner_care` 0, the
  careless body, does not read the room, so the careless sprinter's walks are unchanged by construction.
- **If the raycast cannot be done cheaply or deterministically,** the answer is "do not build this form", and it is reported with the case.

## The rows and the bars, red first, registered

1. **The sprinter row** (`body_tests.cpp`, seed-swept, bar 3/4 of 96, untouched):
   - **Green in BOTH worlds:** the kit's (the row as it runs today, 70 of 96 now: RED) and `GenParams{}` (85 of 96 now).
   - The off world is measured by the row's own loop in a scratch run. Whether the row itself should also run both worlds is the librarian's
     to rule; I do not amend it.
2. **The margin against wall contact** (a chaser still does not stand at a wall). On the row's 96 routes in the kit's world, the careful body's
   head-on wall hits and scrape ticks:
   - must not rise above **1.25 times today's**;
   - today's are measured first, on `dcbfd3c`, by the same scratch dump, before any code. The row's own print says 50 wall hits for the
     careful body in the kit's world today (`kit_fix_chase.log`, "123 times against 50").
3. **A new row, red first:** a corner in open floor is taken faster than a corner of the same angle in a corridor (the room read, not the
   angle). Two cases on one mesh, picked by a stated rule (the first 90° corner on the row's routes with a measured room over 3 m, and the first
   with under 1.2 m), not by hand.
4. **Catch power, reported BOTH ways, not tuned toward either.** The speed model's sweep: normal, 300 s, line/juke/cutback/flee, seeds 1–96,
   on `dcbfd3c` before and on the change after.
   - It reports the flee runner's never-caught count of 96 and the cutback median, beside his two open numbers: **52** and **62** never caught
     (11-11, before and after the corner fix of `cab3530`).
   - **Expected (inferred):** chasers quicker through open corners, so fewer flee runs survive and the cutback median falls. By how much, the
     sweep says.

## Falsifiers

- the sprinter row stays under 72 in either world;
- the careful body's wall hits or scrape ticks rise past 1.25 times today's;
- or the open-and-corridor row stays red.

**Any one: this form does not do what it claims, and I say so before another.** The unwelcome outcome, in its own words: "the corner room makes
the careful body faster than the careless one only by making it hit walls".
