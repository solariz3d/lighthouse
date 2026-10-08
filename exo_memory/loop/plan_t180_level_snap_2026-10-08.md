# T-180: one click to make the road truly level, and one to bring it back down to the floor. Librarian, on D, 2026-10-08 04:1x. Lap D271.

The keeper, 04:01: "there needs to be a way to snap the track to the floor to be true flat, chck out FIRST track, you will see what I mean on the straight
towards the end of the uncomplete track, i wanted the downhill to straighten out but its hard to calculate by hand".

## Measured (librarian, on a COPY of `tracks/eq-FIRST TRACK.t180track`, scratch `first/first.t180track`; t180 `0014555`, `src/core/adapter.js toPath`)
12 pieces, open, 7,300 m. Height and pitch at each piece's end:

| s (m) | 3300 | 3800 | 4300 | 4800 | 5300 | 6300 | 7300 (end) |
|---|---|---|---|---|---|---|---|
| height y (m) | 0.00 | 6.54 | 50.11 | 97.97 | −30.42 | −243.45 | −187.32 |
| pitch (°) | 0.000 | 2.500 | 7.500 | −2.500 | −27.500 | +3.044 | **+3.219** |

The last 1000 m piece eases its climb rate to 0 (`kv` 5.41e-4 → 0), so it ends **straight but still tilted 3.2° up**, 187 m below the start.
**Why it is hard by hand:** the climb field is a RATE (°/100 m). "climb 0" keeps whatever slope the road already has; it does not make the road level.
Levelling it means choosing a rate that cancels the inherited slope over exactly that piece's length.

## The lap (E, who owns the core's channels and the path; GEOMETRY/CORE tier: full checks at landing)
1. **"Level" (next to Straight):** the piece being extended ends with pitch exactly 0. The core solves the climb change that cancels the pitch at the
   head over the piece's length, with the same easing Extend uses, and the fields show the value it chose. Straight then Level gives a flat straight.
2. **"To floor" (snap down to the ground):** the piece ends level AND at the floor's height (y = 0, the start's ground plane, the grid the view
   draws). That is two conditions, so the core solves a smooth S (a vertical ease in and out) over the piece's length. If that length cannot do it
   within the road's steepness limits, the piece is refused by name with the shortest length that would work ("needs at least 640 m to reach the
   floor"). Never a silent clamp.
3. Both are ordinary Extend values: undo-able, visible in the fields and the big values strip, and the drag handles still work after.
- Registered before any code, on the FIRST TRACK copy: after Level on a 500 m piece at the head, the end pitch is |pitch| ≤ 0.01°. After To floor
  on a long enough piece, |pitch| ≤ 0.01° and |y| ≤ 1 cm at its end. On too short a piece, the refusal names a length that then succeeds.
- Rows red first; the full suite and the core harnesses at landing (it is core maths). Then install.
- inferred: "the floor" = height 0, the start's ground. If he means "level wherever it is", that is item 1 alone, and it is already in the lap.

NEXT: chair dispatch D271 to E when this plan is read
