# A wheel that clips under the road: read the Demo lap, then make the underside give the wheel back. Librarian, 2026-10-30 17:5x

The keeper, 17:50, after saving the Demo T-180's ELYSIUM replay (`ohyeah2389_t180_demo_t180b_elysium__301026-174804.acreplay`, 17:50, 1.76 MB, a short one): past the test helix "had something interesting happen … on other tracks, the t-180s always had this issue, sometimes when drivers get close to the edge of the track and a wheel goes off, it clips into the track when the car drives further into it causing the car to slide making it almost impossible to drive, sometimes the jump jack can be engaged which could get the wheel back to normal and on the track, but here it did not. look at the telemetry to see if we could almost devise a way to make the under part of the track geometry make wheels gtfo back to the top of it whenever wheels clip into it."

This is his line of work by his word (track work is otherwise parked, 17:31). Two parts: measure the event, then design the geometry against what the event shows, not against a guess about it.

## Part 1 (pane O, CHECK IT: measurement only, the Demo replay)

The Demo row joins D560 as any other car (its table, its helix line). In addition, the clip event:

- **Per wheel, along s:** each wheel centre's height over the road mesh where the wheel is inside the road's footprint, and, where it is outside the footprint, its lateral distance past the nearer edge and its height relative to that edge's row. The rig already reads wheel centres (D560 §0's same-road check used them). A wheel UNDER the mesh inside the footprint is the event.
- **The event's shape:** the first frame a wheel reads under; which wheel; s and the lateral offset; the car's heading against the road's tangent, roll and pitch, speed and load in the 2 s before; how long the wheel stayed under; whether it came back up and how (a jump jack shows as a step in the body height; a reset as a teleport); the car's path over the stretch at 0.1 s, drawn against the road edges (a PNG from the rig, as D544's plots). If more than one event, each.
- **The road there:** the piece and its handles (width, bank, cup, edge angles, edge start) from the ELYSIUM document; whether the edge is a plain edge, a raised lip (cup/edge) or a wall; the underskin's offset below the road at that station (`src/export/underskin.js`: the caster's thickness) and whether a catch skin is present there (`catch.js`); the vertical gap between the road's edge row and the underskin's edge row, which is the slot a wheel can enter.
- **The same for the Augury lap and the reference lap at the same stretch,** so we know whether the Mach 6 and the Augury ever had a wheel outside the footprint there and what happened to them.

Hand-back: `p-d564-wheel-under-O_2026-10-30.md` (or the id the chair gives), the figures and the PNG; the car names stay as D551's labels in the repo copy. Falsifier for the measurement: if no wheel ever reads under the mesh in the Demo lap, the event is not "a wheel under the road" and the design in Part 2 is the wrong fix; then the next read is the body collider against the edge geometry.

## Part 2 (plan, after Part 1): the underside gives the wheel back

Written only once Part 1 says what the wheel met. The candidates, so the measurement can tell them apart:

- **A: the slot.** The road's edge row and the underskin's edge row are a vertical pair with a gap between them (the caster's thickness). A wheel that drops past the edge and is steered back enters that gap, and the road's underside, which AC collides with from below, holds it there. Fix: close the slot with an **edge apron**: a strip that runs from the road's edge row outward and DOWN at a fixed slope (20 to 30°), 1.5 to 2 m wide, joined to the underskin's edge so the cross-section is a closed wedge with no re-entrant face. A wheel that leaves the road rides the apron down; steered back, it rides up onto the road. This is the runoff kerb of a real track, and it changes no road vertex.
- **B: the underside collides.** If the wheel is fully under the road (not in a slot), the underskin's physical surface is what pins the car. Fix: the underskin's physics flags make it non-drivable and non-colliding for TYRES (a wall surface, `IS_VALID_TRACK=0`, or a surface the tyre raycast ignores) while the body collider still meets it, OR a one-way skin that is collidable only from above. What AC and CSP allow here is a research question (docs/research/04_ac_physics_drivability.md is the room's prior art; the CSP wiki on surfaces and `extended-0` the source) and comes before any geometry.
- **C: neither.** The wheel never went under; the body collider caught the edge or a wall. Then the fix is the edge's shape, not the underside.

The jump jack is a lift of the body; it frees the car in case A when the lift exceeds the slot's height and in case B rarely. His "here it did not" is itself a measurement for Part 1: how high the jack lifted (the body-height step in the replay) against the slot or the depth.

Tier for the eventual change: prove it (geometry and export), with the ramp harness and the export fixtures, and his drive of the same stretch in the Demo car as the live check. Falsifier for the fix: if, after the apron or the flag change, a wheel driven off the same edge still reads under the mesh for more than one frame on the return, the mechanism was not the one Part 1 named.

Questions for the keeper that the telemetry may not answer, asked now: whether on other tracks the pinned wheel is under the road surface itself or wedged against a wall or kerb; and whether this happened on the outside of a banked stretch (over the lip) or on a flat edge.

surfaced: p-d560 §0 (wheel centres over the mesh, the tool set), src/export/underskin.js header (the caster, thickness), catch.js header (the physical catch, D341), acready.js:7 (the fall-through at D260 and its cure), trackfiles.js surfaces (FRICTION, IS_VALID_TRACK, WAV_PITCH=extended-0), docs/research/04_ac_physics_drivability.md (in the private store / the archive clone; not in t180-fresh), the ELYSIUM document for the piece's handles.
