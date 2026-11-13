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

## WHERE IT STOPS (D, Friday 15:41 local, `date` by the shell): the registration accepted; no code written yet

**Ruled at 21:24Z** (the chair, from the librarian's read):
- I add the one `nav/` query myself, in a commit that touches nothing else in `nav/`, with its own nav row. B reads that commit.
- The sprinter row is amended by name to run BOTH worlds against the same 72 of 96, and I report what the second world adds to its run time.
- The hand-back must state `corner_speed`'s law, where the grip figure lives, and how it stands against his H2.
- A corner's speed and radius must be printable from a run.

**State:**
- dreamzone-3 branch `a-corner-room` at `a-kit-told` `dcbfd3c`, in `G:\consonance-scratch\a-gen-dz3`. No commits of mine on it yet, and the tree is clean.
- The landing of o-run-frame came first and is done (`p-d675-land-o-A_2026-11-13.md`, origin/main `d8ef536`).

**The design, ready to write (nothing of it is built):**
1. **`nav::Query::open_along(Vec3 p, Vec3 dir, float max, const Profile&) const`** (`nav/nav.h` beside `nearest`; `nav/world.cpp` after `Query::nearest`, :442).
   - `nearest_within` the point (reach 0.5/1.0/0.5), then `impl_->full->raycast(ref, at, at + flat(dir)·max/|dir|, &filter, &t, normal, polys, &n, 64)`.
   - It returns `t ≥ 1 ? max : t·max` (Detour gives `FLT_MAX` when the ray reaches the end), and 0 when `p` is off the mesh or the call fails.
2. **Its nav row (`nav/tests/path_tests.cpp`):** a `Built` block (`params_for(10, gen::kBiomeApartment)`, as `:276`), with cells picked by rule, not by hand:
   - **an open cell:** the first graph node whose 8 grid neighbours are all present and walk-joined with no door;
   - **a corridor cell:** the first Lane node with no neighbour on either side across its run.
   - **The checks:** the same call twice gives the same float; the open cell reads at least 3 m in all four axis directions; the corridor cell reads
     under 1.6 m across.
   - Red first, against a stub returning 0.
3. **Then `chaser.cpp`:**
   - `corner_speed` takes the room: `radius = room · cos(θ/2) / sin(θ/2)`, with the room clamped to [0.9, 6] m.
   - The room is read once per path point, when the leg moves to it, along the corner's outer bisector.
   - Careful bodies only; care 0 is unchanged.
4. **Then the rows:** the sprinter row amended to both worlds (by name, the old and new rule in a comment); the open-against-corridor row;
   today's wall-hit and scrape totals measured first; the catch-power sweep both ways (seeds 1–96, against 52 and 62).
5. **Printable from a run:** `dz-chase run --trace` prints, for each chaser, its corner's room, radius and speed as it heads into one.

**The law, as it stands today** (for the hand-back's required statement; read at `dcbfd3c`):
- `corner_speed` → `speed_for_radius` (`chaser.cpp:47`, checked by grep; first written ":46-58", from memory): the fastest `v` with `v / turn_rate(v) ≤ radius`. `turn_rate` falls linearly from
  `turn_slow_deg` at rest to `turn_fast_deg` at top speed (`chaser.cpp:169`, checked by grep; first written ":160-163", from memory).
- So today it is a **turn-rate law**. **There is NO grip figure in the chase:** no μ, no lateral-acceleration limit.
- His choice, item 168, is **H2: `min(V, √(μ·g·R))`**, grip-bound only, μ 1.0–1.33 (E's L187 §9). Today's law and H2 differ in form. Whether the
  lap moves to H2 is not in this registration, and I would ask before changing the law itself.
