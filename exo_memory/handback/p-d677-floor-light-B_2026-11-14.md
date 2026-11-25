# Hand-back: the floor patch's light read (H1 or H2?), and item 224's hall (pane B, D677, read only)

**Packet.** `exo_memory/loop/packet_gen_floor_patch_B_2026-11-14.md`, "AMENDED at R1 green" (`:86-107`), steps 1 to 3 and 5, and item 224.
Read only, on the processor, on main `32b9126`'s generator, by probes in `gen_tests` that are never committed (in
`G:\consonance-scratch\dz3-lookback-b`). The registered bar: a cause is named only from three or more points inside the outline and three
or more outside. I used four and four.

## 1. The outline on the floor (step 1)

**How it was read.** From C's held view at 11.00 s, `G:\consonance-scratch\c-d676\block\frames3-on\fp_D_no_body_no_flashlight.png`
(his body and the flashlight both off; the patch is there).
- **The edges:** brightness scanned along 15 rows (PowerShell, System.Drawing). The patch reads about 55 to 80 against 90 to 145 on the
  floor beside it, and its edges were read to about 20 px.
- **The cast:** each corner pixel through his camera onto y = 0, by `scratchpad\outline_cast.js`. The camera: the eye 1.65 m above his
  feet (sim `eye_height`) at (-42.36, 0, -5.53), looking at C's centre point (-43.85, 0, -1.74), 100 degrees across (his `gym.txt`),
  vertical by `vertical_fov`.
- **Assumed, not measured:** no stride bob, no speed widening, no roll.

    checked: outline_cast.js → the picture's centre lands on (-43.85, -1.74), C's point; a pixel right of centre lands at greater x
    checked: the corners (pixel → world x, z): (665, 555) → (-45.20, -2.50); (850, 470) → (-45.03, -0.82); (1310, 470) → (-42.06, 0.34);
             (1305, 940) → (-42.11, -3.86); (670, 780) → (-43.96, -3.94)

**Its shape.** Roughly 3 m across (x -45.2 to -42.1) and 4 m deep (z -3.9 to about 0). The near-left corner is cut on a diagonal.
- **Its long sides lie on the edges of the one slab under it:** that slab runs x -45.10 to -42.10, and its far end is z -0.10
  (`handback/p-d677-floor-r0-B_2026-11-14.md` §2). The match is within the read's precision, about 0.1 m in x and 0.4 m at the far end,
  where the view is most oblique.

## 2. The lights within reach (step 2)

    checked: G:\consonance-scratch\b-floor-out\r0c_probe.txt (probe_d677_floor_patch_light): 7 lights within 15 m across and y -1 to 4,
             every one a lamp (no beam), range 0 (the renderer derives it), radius 0.30 m:
      0 (-40.50, -0.90, 10.50) chunk -2 -1 0    12.72 m      4 (-43.50, 2.60, -4.50) chunk -2 0 -1   3.75 m   <- the room's own
      1 (-37.50, -0.90, 10.50) chunk -2 -1 0    13.76 m      5 (-40.50, 2.60, -4.50) chunk -2 0 -1   4.86 m   <- the room's own
      2 (-43.50,  2.60, -13.50) chunk -2 0 -1   11.99 m      6 (-49.50, 2.60,  1.50) chunk -2 0 0    7.24 m
      3 (-55.50,  2.60, -7.50) chunk -2 0 -1    13.45 m
      (distances from (-43.6, 0, -1.8), inside the patch)

Lights 0 and 1 are on the storey below. Lights 4 and 5 hang in the patch's own room, 2.6 m up, 3 to 6 m from every point read.

## 3. The lines of sight (step 3): through every solid of chunks x -3..-1, y -1..0, z -2..0

The points are at 2 cm above the floor; the segment to each light is cast through the boxes, shortened 1 cm at each end.
- **Inside the outline:** a (-43.60, -1.80), b (-44.50, -1.20), c (-42.60, -3.20), d (-44.00, -2.90).
- **Just outside it:** e (-43.20, -4.80) beyond the near edge; f (-46.00, -2.00) on the slab to the left; g (-41.40, -1.80) on the slab to
  the right; h (-43.40, 1.20) beyond the far end.

| point | light 4 | light 5 | light 6 | lights 0, 1 | lights 2, 3 |
|---|---|---|---|---|---|
| a, b, c, d (inside) | CLEAR | CLEAR | blocked by a wall | blocked by the floor slab (0.3 m) | blocked by walls |
| e, f, g (outside) | CLEAR | CLEAR | blocked by a wall | blocked by the floor slab | blocked by walls |
| h (outside, beyond the far end) | CLEAR | CLEAR | CLEAR | blocked by the floor slab | blocked by walls |

All 56 segments are in r0c_probe.txt, with the blocking box named.

**The reading: NEITHER H1 NOR H2.**
- **Not H1, a real shadow.** Every point inside sees the room's two lamps with a clear line, exactly as every point outside does. No
  solid blocks the inside points that does not block the outside ones as well.
- **Not H2, as far as the generator goes.** Every light is in the generator's list for its chunk, and in range: range 0 means the
  renderer derives it, and the nearest lamp is 3.0 m away.
- **What this read could not see.** Whether the renderer hands that surface those lamps. The floor slab is listed by the generator in
  chunk **-2 -1 -1** (the storey below; its box runs down from y 0), while the room's lamps 4 and 5 belong to chunk **-2 0 -1**. If the
  renderer chooses lights per chunk, per instance or per box, the slab could be lit from the storey below's list.
  - inferred, not traced: this is the renderer's half of H2.
  - Against it, the slabs at f and g (outside the patch) also belong to chunk -2 -1 -1 and are lit.

**So, by the packet's step 5, this rings:** H3 and H4, and the renderer's half of H2, are pane C's. C starts with:
- the outline in §1, whose long sides are the slab's own edges;
- the light list in §2;
- the fact that the patch is part of one long surface, one 3 m x 32.8 m slab whose top is two triangles
  (`p-d677-floor-r0-B_2026-11-14.md` §4).

## 4. Item 224: his hall (read only)

    checked: G:\consonance-scratch\b-floor-out\hall_probe.txt (probe_d677_his_hall, seed 1 = run-20261114-184242's world)

- **Where he stood** at 102.5 s, (-381.8, 3.5, 280.4): cell -128 1 93 is **kind 8, the floor of an atrium (a hall)**, in the
  **hotel** biome, storey 1 (3.5 m up).
  - Below it, storey 0 is a hotel room. Storeys 2 and 3 above it are lanes (bridges) in the atrium's air.
- **The hall:**
  - Storey 1: 72 floor cells over cells x -134..-126, z 86..93, which is **27 x 24 m**.
  - Storey 2: 23 floor cells (a gallery ring round the open middle) and 30 cells of air.
  - Storey 3: 48 cells of air.
  - So it is three storeys tall with a mezzanine.
- **The rule that made it:** `Generator::Impl::atrium` (`gen/src/layout.cpp:20-49`), "Atria: rare, tall rooms. One site per biome
  region (72 m square, 8 storeys)".
  - A site holds one when a hash falls under `big_space_rate` (0.12) x the biome's `layout.big_spaces`: the hotel's is 2.5
    (`gen/src/biome.cpp:97`), so **0.30**.
  - Its footprint comes from the biome's templates: the hotel's minimum is 6 cells (`biome.cpp:101`) and its storeys start at 3
    (`:103`).
  - Its gallery comes by `mezzanine_share`.
  - The cells: `atrium_at` marks the floor storey 1 (the hall), the ring above it 3 (the gallery) and the rest of its height 2 (air),
    and a lane crossing the air becomes a bridge (`layout.cpp:252-258`).
- **How often:**
  - In the 8 x 8 regions round his, at his storeys 0 to 7, **4 of 10 hotel sites** hold an atrium (the rule's 0.30).
  - Apartment: 0 of 37 (0.12).
  - School: 0 of 7 (0.18).
  - Hospital: 1 of 10 (0.036).
  - So in a hotel stretch about every third 72 m region has one. In apartments, about one in eight.

No change was made.

## 5. Corrections

- **The first build of these probes failed:** `dist` is the game tests' helper, not the generator tests'. I replaced it with
  `length(a - b)`.
- **A shell edit of the run script wrote backspace characters** into two lines. I rewrote it whole with the Write tool before it ran.
