# D433: TEST 10, the second fly-off, a bump and a centre line "off a smidge" (librarian, 2026-10-22)

## The report

The keeper, 2026-10-22 09:37: "also look at the two min replay newest, towards the end after the second run when i fell off, there is a bump in the road, and if you look at the geometry there is a bug we never seen before, like the center line is off like a smidge." Then: "My car flys off the track, look for the second time it does".

## The evidence (copied; the originals untouched)

All of these are in this session's scratchpad, folder `d431\`:
`C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-librarian\0c0c0c0b-0000-4000-8000-00000000115b\scratchpad\d431\`

| file | what | source |
|---|---|---|
| `r.acreplay` | 3,119,271 B; 9,234 frames at 0.015 s, 138.5 s | `Documents\Assetto Corsa\replay\temp\AC_221026-093632_O_ohyeah2389_t180_mach6_t180b_test_10_.acreplay` |
| `eq-TEST 10.t180track` | sha256 da31c0b7…7a57 | the keeper's saved track |
| `out\t180b_test_10\` | the forced, textured export he drove: kn5 sha256 90177bf7…, `ai\fast_lane.ai` | installed in AC as `content\tracks\t180b_test_10` |
| `rp.js` | replay → AI-line distance s, distance from the line d, height above it dy, speed | (WIN=a,b sets a time window) |
| `surf.js` | kn5 road surface under the AI line, and the surface's lateral extent | |

## What the librarian measured (checked)

- **Five runs; each but the first ends with a reset to the pit (AI s 852):**

  | run | time (s) | ended at AI s | how |
  |---|---|---|---|
  | 1 | 11–33.5 | 2,874 | d 15 m |
  | 2 | 34.5–58.6 | 3,347 | **the second fly-off** |
  | 3 | 59.5–67.6 | 1,314 | reset |
  | 4 | 68.6–96.2 | 3,449 | d 15.4 m |
  | 5 | 97.2–134.4 | 3,767 | fell: dy −97 to −140 m |

- **Run 2, in detail:** speed is 486 km/h at AI 3,222 and falls to 303 km/h at 3,347. Over AI 3,300 → 3,347 the car rises from 1.4 m to 8.4 m above the AI line while d grows from 8.5 m to 17.3 m. It is thrown up and out.
- **AI s is not document s.** The mesh named `1ROAD_p6` starts at AI ≈ 3,401, and the document's p6 starts at 3,300, so AI s ≈ document s + 101 m. inferred: the AI line starts at the start line, not at the document's origin. So run 2 leaves at document s ≈ 3,246, which is p5's last ~55 m: the coil is unwinding there, with bank 60° → 0 and the turn tightening to −540° over p5.
- **The surface under the AI line is at 0.000** at every station from AI 3,246 to 3,419. There is no step or gap under the line itself.
- **The road's lateral extent drifts:** its centre measured against the AI line moves from −0.38 m (AI 3,246–3,312) to −1.50 m (3,347), then to −1.75 m (3,401–3,407). At AI 3,359–3,371 a surface 25 m to one side is within reach of the ray (the coil's next pass). inferred: part of the drift is the cup and the bank, not a bug; this is the "centre line off" lead, not yet a finding.

## Part 1, pane P: find the bump and the centre-line offset. Tier: check it (diagnosis; nothing in t180 is changed)

1. Map AI s to document s exactly (from the AI line's start and the document's start line; spawns along 899.2).
2. Read the drivable surface along the car's own path in run 2, not only under the AI line, over AI 3,150–3,350:
   - the road's height under each frame's wheel positions (`extractCar` has the wheel centres);
   - each wheel's height above the road;
   - the surface's vertical curvature along that path.
   That finds a bump that lies off the centre line.
3. **The centre line:** compare the built road's cross-section centre with the document's centreline over the same stretch. Use the core's own positions (`src/geom` buildPath and mesh), not the AI line. Say whether the offset comes from the cup, the bank, the edge or the mesh, and whether it jumps at a chunk or piece seam (`1ROAD_p5_chunk_7` → `p6_chunk_8`).
4. **Shots:** headless with `--mute-audio`, of the builder's preview and of the kn5 at the place, looking along the road. Mark the bump and the offset.
5. **Hand back:**
   - where the bump is (document s, lateral u), what makes it, and how high it is;
   - whether the centre-line offset is a defect, with its cause file:line if it is;
   - what would fix it, with a pane to do it.
   - Note whether the forced reds at 2,574 and 2,928 are involved; they are earlier, in document s.
6. Don't edit the keeper's track (his rule for D431 holds).

**Part 2:** the librarian rules and names the build pane.

NEXT: chair route D433 Part 1 to P now (reviewer seat, free); P hands back to the librarian.
