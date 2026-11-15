# Packet F1 (pane C): the dark patch on a long floor (his item 226), fixed in the renderer

Written by the librarian on D, the night of 2026-11-14, at the collation of B1b. It comes before B2 because it is a fault he
reported. Tier: prove it (a fault in how every long surface in every world is shaded, which nobody sees until he does).

**SOURCE: what produces this, and what limits it.** Pane B's three reads, each in its own file:
- `handback/p-d677-floor-r0-B_2026-11-14.md`: one floor slab under the patch, 3.0 m by 32.8 m, nothing overlapping; one
  triangle drawn at the point.
- `handback/p-d677-floor-light-B_2026-11-14.md`: the patch's outline (x -45.2 to -42.1, z -3.9 to about 0, its near-left
  corner cut on a diagonal) lies on that slab's own edges; four points inside and four outside all have a clear line to the
  room's two lamps.
- `handback/p-d677-floor-exp-B_2026-11-14.md`: the same held view three ways. As it is, the dark block. With that slab's top
  cut into 3 m pieces, plain floor. With the top emitted from its other end, plain floor. Luminance along one row: 57 inside
  the patch, 96 in both changed frames. Looked at by me: `G:\consonance-scratch\b-floor-exp\three_frames.png`.
- **What limits it:** which step of the shading fails is not traced. Your own first reading of the afternoon (two surfaces in
  one plane) is refuted by pane B's list; your pictures of it stand.

## His words (verbatim in `briefs/dreamzone2_the_game.md`, item 226)

"also, to find the room for u to see the screen shot better which i couldnt do, look in the most recent run to see where i
last died to precisly pin point down the exact area you will see the lighting bug right in the middle of the room from
different angles"

## What is known in the shader, read by me in his clone (`render/shaders/dz.hlsl`), not traced

- Secondary rays leave the surface from a fixed distance off it: `O = P + Ng * 0.01` (`:388`) and `O = s.P + s.Ng * 0.02`
  (`:501`), with `TMin = 0.0` (`:127`, `:264`, `:511`).
- A streamed chunk keeps no vertices on the card once its structure is built (`:70`); the hit's position can be rebuilt from
  the view ray and its distance (`:747`).
- The patch starts at a sharp line about 29 m along a 32.8 m triangle from its first corner (pane B's triangle T1, its
  corners in order in its `:14-21`). **My guess, marked as a guess:** a sharp line at a distance is what a stored number does
  when it passes a power of two and its step doubles.

## The steps

**R0, trace before any change.** At one pixel inside the patch and one on the same triangle a metre nearer his feet, on pane
B's scratch build of the held view (its edits are saved: `G:\consonance-scratch\b-floor-exp\scratch_edits.patch`, with your
own capture hook in it): what the shader has at each. The hit's position and how far it is off the slab's plane; the geometric
and the shading normal; the texture coordinate, the tile and the mip; the material; for each of the room's two lamps, whether
its shadow ray is blocked and by which instance and primitive; the ambient term. Print the first quantity that differs where
it should not. That names the cause, or says the two pixels differ in none of these.

**R1, the red row, registered before the fix.** One flat floor top of the slab's own size and corner order, one lamp over its
far end, nothing else: its far end reads within 5 per cent of the same place on the same top cut into 3 m pieces. Red on main.
State the 5 per cent's reason or register your own figure before the run.

**R2, the fix, at the cause R0 names,** in the renderer or in what it is handed. Not in the generator: no world's solids or
drawn tops change.

**R3, how many worlds had it.** Over 12 seeds, the number of drawn triangles long enough to reach the distance at which the
fault begins, and how many of them are floors a player can stand on. A count, printed; it says how many dark patches there
were.

**R4, his view.** Pane B's "as it is" frame, rendered again on the fix, set beside its "cut" frame: the luminance along its
row 700 within the row's own noise of the cut frame's. And his held view from your afternoon's capture, fix off beside fix on.

**R5, what else moved.**
- Picture only: his kept runs replay with the same fingerprints.
- The whole frame elsewhere: on three settled views with no long surface in them, the picture is the same as main's within
  the renderer's own run-to-run noise. Print the measure you use.
- **The cost:** the shader changes, so the frame time is read again as D675's table was (seven runs under the exclusive hold,
  defaults first and last, the card's other users written down). No game of his is on the card tonight.

## Registered with this packet

- **This lap is wrong if** R1 goes green by a change to the generator, or by a change that only moves the distance at which
  the fault begins.
- **The unwelcome outcome, named now:** R0 finds the two pixels differ in nothing the shader computes, so the fault is under
  the shader (the structure the card builds, or the driver). Then say so with the trace; the answer is to cut long triangles
  where the renderer takes a chunk's mesh in, which is the renderer's side and changes no world, and it is rung before it is
  built.

## For his eye

Two pictures for his page: his paused view before and after, on the build with the noise fix as landed.

## Rules that hold

Trees and builds on G:, never his clone. His run files are copied. `node consonance/tools/heavy-run.js --status` before a heavy
run; pane A's M3 has the lock's first place tonight. His words stay out of the game's repository. Pane B lands it. One
hand-back with its digest and a `BASE:` line, rung once.
