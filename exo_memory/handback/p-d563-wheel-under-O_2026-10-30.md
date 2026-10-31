# D563 Part 1: the wheel that went under the road, measured (pane O, check it, measurement only)

**Brief:** the chair's ring of 2026-10-30T23:53:17Z. **Plan:** `exo_memory/loop/plan_wheel_under_the_road_2026-10-30.md` (e265c1f4), Part 1. No fix in this packet.

**Labels:** D551's. **C19** is the car whose lap had the event (D551 group A: the reference's physics byte for byte). **C03** is the car of the first fleet replay. **The reference** is the 10-17 lap of the car the profile was measured on. Names stay in my scratchpad's key.

**The car's D560 row,** with its helix line, is in `exo_memory/handback/p-d560-fleet-elysium-O_2026-10-30.md` ("C19, saved 17:48"), done in the same pass.

**He is still driving, so:**
- Every file was read from scratchpad copies made in Windows background mode (`S\d560\bgcopy.ps1`).
- Nothing was opened or written in the game or replay folders, and no window.
- Everything ran at BelowNormal.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad\`.

**Evidence:** `p-d563-wheel-under-O_2026-10-30_evidence/wheel-under-path.png`, three panels:
1. the path against the edges, C19 with C03 and the reference;
2. each wheel's height over the top surface along t;
3. the cross-section at the entry station.

## The answer

**A wheel WAS under the road: the falsifier does not fire.**
- **Which wheel, how long:** C19's rear-right wheel (w3) was under the road's top surface, inside the footprint, for **6.57 s** (t 66.495–73.065 s, 439 frames), 0.23–0.31 m under it, while the car ran across the road and back on its other three wheels.
- **Not an exit-only event:** it was the only long one in the lap. Apart from it, there were 10 frames of the rear-left at s 9,118 (0.21 m) and the car's final exit off the road at s 10,829 onwards.
- **The same mechanism on the reference car:** its rear-left was under the surface for about 0.5 s at s 1,926–1,992 (t 373.41–373.87 s, 0.23–0.32 m), and came back up on a small hop. It is not one car's quirk.

**What the wheel met, from the mesh and the exporter's own words:**
- **The road is one single-sided physics surface** (`1ROAD_p20`, facing up). Under it is the underskin (`UNDERSKIN_p19#21`, facing down, 0.51–0.57 m below the top at the entry station), and **the underskin is not a physics surface** (`src/export/underskin.js` header: "THE SKIN IS NOT A PHYSICS SURFACE … AC reads them as scenery").
- **No catch skin on this piece:** the kn5's three `1ROAD_CATCH` meshes are elsewhere.
- **The trapped wheel was hanging, not resting:** it sat at its full droop all the time it was under, 0.49 m below the plane of the other three wheels (p50 −0.339 m from the body point, p5 −0.370). That is the same place every wheel sat when the car was airborne a second before (−0.28 to −0.33 m).
- inferred: a wheel at full droop has nothing under it. **So it was not held by a surface. It hung under a road it could not get back through,** and gave no grip: the "slide" he felt.

**So, against Part 2's candidates (the librarian's to write; noted here only so the measurement can tell them apart):**
- **A ("the slot", the underskin holds it):** the slot is there, a 0.5 m open gap at the edge between the physics road and the scenery skin. But the skin does not hold the wheel, because it is not physical.
- **B ("the underside collides"):** ruled out for this car and road, since nothing under the road collides.
- **C ("neither; the body caught an edge or a wall"):** ruled out. There is no wall at the entry, and a wheel, not the body, was under.
- What the data shows is a fourth shape: **the wheel goes under the single-sided road at its edge and hangs there with nothing under it.**
- inferred: anything that gives a wheel below the edge a physical surface that leads it back up would answer it: an apron, a physical underside, or a closed edge. Which one is Part 2's call.

## The event, step by step (C19; `S\d560\out\C19\wheels.csv`, every frame, every wheel)

| t (s) | s (m) | what happens |
|---|---|---|
| 63.6–64.8 | 8,879–9,089 | Leaving the helix on the left side of the road (body u +14 to +16 m), load falling 43 → 14 g, speed 662–670 km/h. |
| 64.65–65.25 | 9,065–9,173 | The rear-left wheel (w2) reaches the left edge (u 17.4 m, edge 17.5) and its ray finds no surface for a few frames. The load drops to about 0 g and the body rises 31 cm: **the car hops.** The 10-frame "w2 under" at 0.21 m is at t 64.97–65.10. |
| 65.25–66.30 | 9,173–9,359 | Heading −13° to −2° against the road, it **crosses the whole road to the right edge** (body u −16 m), roll swinging from −15° to +24°. |
| **66.33–66.45** | 9,365–9,383 | **w3 (rear right) leaves the footprint past the right edge, by 0.1–0.5 m, for 9 frames.** Its centre is at 2.25–2.77 m over the line's plane; the road's edge row there is 2.50 m. So the wheel is beside the edge, its centre near the edge row's height. Speed 655 km/h, load 11–20 g, heading −2° to +4°, roll +20° to +24°, pitch 0–2°. |
| **66.465–66.495** | 9,389–9,395 | **It comes back inside the footprint UNDER the top surface:** −0.31 m at the first frame with a surface over it (t 66.495, s 9,394.6, u −16.9 m). |
| 66.5–73.0 | 9,395–10,625 | **Trapped 6.57 s.** w3 stays 0.23–0.31 m under while the car is driven across to u +11 m and back to −14 m twice (the plot's panel 1). The other three wheels ride at their normal +0.25 m. Speed 650–738 km/h, load 15–24 g. |
| **73.00–73.65** | 10,619–10,733 | **The jump jack:** the load falls to 0 and the body rises from −4.5 cm to +31 cm in 0.2 s (+36 cm by 73.65). Every wheel drops to full droop (−0.31 m from the body) and the car is airborne for about 0.8 s, rolling to 72°. |
| 73.80 | 10,763 | **It lands with all four wheels on top, w3 included** (0.0–0.4 m over the surface), at 31.5 g. **The jack freed the wheel.** |
| 74.25 onward | 10,829 → | 0.45 s later, heading −10° to −14° at 580 km/h, the car crosses the road and **leaves it over the right edge.** All four wheels are outside the footprint by 74.4 s, falling, 32 m below the edge at the replay's end (75.08 s). |

**On his "the jump jack didn't free it here":** in this replay the jack freed the wheel after 6.6 s trapped. What followed was the car leaving the road over the right edge 0.45 s after it landed.
- inferred: it is the exit, not the jack, that ended the run. How much the jack's landing heading (−10° to −14° toward that edge) is the jack and how much the driver, the data cannot separate.

## The road there

- **Piece:** `p20` (mesh `1ROAD_p20_chunk_27`, the only physics mesh at the station). In the saved document it is index 19: 250 m, width 35 (±17.5 m, matching the AI line), cup 10°, edge 20° from 0.7 of the half-width, bank 0.62 rad → 0.
  - The saved document was written 2026-10-22, after the 10-17 export, and today's core refuses it on a joint check. So these handles are read raw and may differ from what was exported.
  - The mesh is the master for what was driven: at s 9,394.6 the top surface rises to 2.50 m over the line's plane at u −17.0 (the cup and edge lift).
- **The edge is a plain cupped edge, open: no wall, no lip mesh.** At u −17.25 there is underskin and no road; at −17.5 there is nothing.
- **The underskin:** `UNDERSKIN_OFFSET_M` = 0.5 m along the road's normal (`underskin.js:32`); measured 0.51–0.57 m below the top across u −17 to −14. It faces down, is scenery only, and runs 0.25 m past the road's edge.
- **Catch skin:** none on p20.
- **The slot:** the vertical gap between the road's edge row (2.50 m) and the skin's edge row (2.07 m at u −17.25): about 0.43–0.57 m, open to the side, with only scenery under it.

## The same stretch in the other two laps (s 8,900–11,000)

- **C03:** 708 frames; the widest wheel was at |u| 15.54 m, 2 m inside the edge; no wheel outside the footprint and none under the surface. **Not anywhere in its lap either** (0 events).
- **Reference:** 1,340 frames on this stretch; the widest wheel was at |u| 15.95 m; none outside, none under.
  - Elsewhere in its 11 minutes it had **the same mechanism at s 1,890–2,010**: its rear-left wheel went 0.1 m past the left edge at the edge row's height (t 373.23–373.28 s), came back in 0.32 m under the surface, stayed under for about 0.5 s while the car steered back toward the middle, and came back up at t 373.905 s on a small hop (the body rising from 6 to 21 cm, load down to 1.3 g).
  - It also had a 3–5 frame all-wheel dip at s 17,584, and its end-of-replay exit at s 1,938.

## How it was measured

- **`S\d560\wheel.js`** (new), per frame and wheel:
  - s and the lateral offset from the AI line (the footprint is the AI line's sideLeft / sideRight);
  - inside: the wheel centre's signed height over the top surface, by a ray along the road's normal over the 1ROAD meshes (the D515 table's set);
  - outside: the distance past the nearer edge and the height relative to that edge point;
  - plus speed, load, heading against the road's tangent, roll, pitch and h.
- **The wheel positions** are blackbox's recorded wheel centres (FL, FR, RL, RR: w0–w3), through `S\d560\acreplay-probe.js` (blackbox unchanged).
- **`S\d560\droop.js`:** each wheel against the plane of the others, per window. blackbox's contact normal comes from the wheel plane, so the measure is the fourth wheel against the other three.
- **`S\d560\xsec.js`:** every triangle a line along the normal crosses, at 0.25 m steps across.
- **`S\d560\wheelplot.py`:** the PNG.

## Corrections

- **The first run of `wheel.js` had the height's sign inverted** (`4 − t`; the hit is at `wheel + (4 − t)·n`, so the wheel is `t − 4` over it). Every wheel read about 0.39 m under the road all lap. Caught by checking the road normal against the car's, which agreed. Fixed and rerun.
- **My first reading of the mesh named no underskin on p20.** The underskin under p20 is the chunk `UNDERSKIN_p19#21`, which spans pieces 19–20. Found by the cross-section, which lists every surface.
