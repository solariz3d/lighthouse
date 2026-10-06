# T-180: Jump the keeper's way: a free landing piece you place by hand and tune by driving. Librarian, on D, 2026-10-06 15:1x. Lap D258.

The keeper, 15:09: "the user will initiate a jump by instead of clicking extend, it says jump, which then extends their piece which they most
likely also changed the climb angle to start the jump at the end of the piece extended, after the Jump is pressed, it then lets the user move
around a blank straight piece just like the first piece for them to then place down in the space they need it to be through testing in the
game trial and error driving it themselves … the landing of the jump is effectively the beginning of a "new" track but in reality is a
continuation of the same one … Usually in the beginning the piece is stuck in the middle, but after the jump is pressed the user can move the
piece in the world stage where it needs to be".
His answers (AskUserQuestion, 15:1x):
- **Moving it later:** "the user will make the landing and perfect it before expanding it on outward after the jump … there is no need for
  this idea of tweaking a jump that tweaks the rest of the track." → the landing is movable **while it is the head**; once you Extend from it,
  it is fixed (deleting back to it makes it the head, and movable, again).
- **How to move it:** drag in the 3D view **and** number boxes.
- **Direction:** free, starts lined up with the take-off (turn, tilt and bank it freely).
- **The current Add jump** (gap / drop / landing angle, ballistic arcs, generated ramp): **replaced**.

## What it is
1. **Jump** sits beside **Extend**. It places the current piece exactly as Extend would (the take-off; the user usually gave it climb), then
   adds a **free landing**: a plain straight road piece (default 60 m, the first piece's default width and cross-section), starting lined up
   with the take-off, a default distance ahead (say 40 m) at the same height.
2. **While the landing is the head** it can be moved anywhere: drag handles in the 3D view (forward/back, sideways, up/down, turn) and
   number boxes (forward, sideways, height in m; heading, pitch, bank in °). Shift fine, Ctrl snap, as the Extend handles. Undo covers each move.
3. **Extend from the landing** continues the track as usual; from then on the landing is fixed.
4. The track between take-off and landing is a flight: no road, no ramp generated, nothing computed about where the car lands. The user
   exports, drives, and moves the landing.

## The core (E, who built D243's core; GEOMETRY + EXPORT tier)
- A **free flight**: the flight carries the landing piece's START POSE relative to the take-off end (offset vector, heading, pitch, bank). The
  landing piece is ordinary road whose start state is that pose, not C1 with the take-off. It replaces `flightPiece({gap, drop, land})` and
  the generated landing ramp.
- **Every place D243 taught about flights is re-checked:** the adapter's segments, `checkDoc` (land on road first stays), validation
  (`isCoreFlight` → the gap is intended; the ramp-reach warning and the arcs go; a hole elsewhere stays red; a landing BEHIND the take-off
  becomes a warning, since he places it), Close across a free jump (the landing pose is fixed; `FLIGHT_AT_END` stays), saved pieces (a run
  with a free flight saves and re-adds; mirror flips the pose), export (AI line and markers across the gap), the overlap check.
- **The file format:** a new flight kind. Old `{gap, drop, land}` flights still OPEN (converted to the equivalent free pose, or refused by
  name: E's call, stated). Checked: no keeper track holds a flight (D243 follow-ups scan); fixture F7 does.

## The UI (A; FEEL tier on top of E's core)
- The Jump button, the landing's drag handles and number boxes, the "this is a jump: drive it and move the landing" note; the old Jump
  fields and arcs removed; the guide and README updated.
- **No real-window test that takes pointer lock or OS focus while the keeper may be at the PC** (rule of 2026-10-06); rows and fake hosts.

## Order and checks
E's core first (red rows first, targeted tests, fixtures 0 of 9 except F7's intended change, stated), then A's UI on it. One install. The
librarian runs the touched harnesses (core_jump, core-close, core_piece, core_cup, export) once at install.

NEXT: chair dispatch D258's core to E when this plan is read, and its UI to A when E hands back
