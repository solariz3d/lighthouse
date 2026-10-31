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

## FINAL AIM: the entry over the edge (the chair's ring of 00:01Z, plan at 8058214c)

**The keeper:** "IT STARTS on the edge, but then can clip further into the road"; "it drops below the track if the wheel falls off the edge". The frames agree. **The rear right falls off the right edge, drops below the edge row while it is outside, and comes back inside below the road.**

**Measured against the MESH's own edge, not the AI line's footprint.**
- `S\d560\entry.js` → `S\d560\entry-w3.txt` works per frame. It projects the wheel centre onto the AI line, interpolating the station's frame between the two nearest AI points. It finds the road's outermost top-surface hit on that side, stepping 0.01 m. It reports the wheel against that edge and against the edge row's height.
- **The mesh's edge here is u −17.10 m on every frame** (s 9,329–9,414), with the edge row 2.54–2.57 m over the line's plane.
- **The AI line's footprint (±17.5 m) is 0.40 m outside the real edge.** My first read, "0.1–0.5 m past the edge", was against that footprint and understated the excursion by 0.40 m.

| | value | how measured, and the error |
|---|---|---|
| **leaves the road** | t 66.2874 s (lap 52.277), s 9,354 | the crossing interpolated between frames at −0.030 and +0.161 m past; ±0.002 s |
| its centre against the edge row as it leaves | **+0.34 m above** | interpolated; ±0.01 m |
| **farthest past the edge** | **0.856 m**, at t 66.391 s (lap 52.381), s 9,373 | a parabola through the three frames around it (0.803, 0.856, 0.812) also gives 0.856 m |
| its centre against the edge row there | **−0.335 m (below)** | the frame itself |
| **back across the edge, inward** | t 66.4837 s (lap 52.474), s 9,391 | interpolated; ±0.002 s |
| its centre against the edge row as it comes back | **−0.32 m (below)** | interpolated between −0.290 and −0.411 |
| **time outside the road** | **0.196 s** (13 frames) | ±0.004 s |
| its drop against the edge row while outside | **0.68 m** (+0.34 → −0.34) | — |
| lateral speed out / back | −10 to −12 m/s out; +10 to +16 m/s back | the inter-frame term |
| **first frame with road over it** | t 66.495 s (lap 52.485), u −16.92 m: **0.308 m under the top surface** | the down-ray over the 1ROAD meshes |
| **inward under the road** | from u −16.92 to **+10.64 m**: **27.6 m across**, carried **1,236 m along** (s 9,395 → 10,631) | `wheels.csv`, 439 frames under |
| depth under the top surface | 0.21–0.31 m (0.08–0.13 in the last frames, as the jack lifted) | as above |
| **how it ended** | the jump jack, lap 59.04 s; landed with all four wheels on top at lap 59.76 s | the body-height step; the "Re-aimed" table below |

**The error on the excursion,** the number the fix gets sized by: **0.86 m ± 0.03 m (inferred).**
- **Frame sampling:** under 0.01 m. The parabola's peak equals the sampled peak; the wheel was slowing to 3.6 m/s laterally at the turn-round.
- **Edge position:** ±0.005 m (the 0.01 m step). It reads the same −17.10 m on all 32 frames, so the interpolated station frame does not wobble it.
- **The wheel centre itself:** this is blackbox's recorded wheel position from the replay. That it equals the physics wheel centre to a centimetre or two is inferred, not checked. It sits a consistent +0.25 m over the surface when on the road, which fits a 0.395 m tyre under load. I put ±0.02–0.03 m on it.
- inferred: **a fix sized to catch a wheel 0.86 m past the edge, whose centre has dropped 0.34 m below the edge row, covers this event with about 3 cm to spare on the measurement.** Other events, other speeds and other angles will differ. This is one excursion, at 655 km/h, returning at 10–16 m/s.

**Separating it from D341's mid-road sink** (the per-wheel depth reads, kept from the re-aimed pass below):
- **This event:** one wheel, at full droop, 0.21–0.31 m under, no load on it, the other three normal, entered over the edge.
- **D341's kind:** the whole car pushed through at 50–62 g. The reference lap has one: s 17,584, a 50 g landing on a 67° bank, all wheels to −3.8 m, then a reset.
- **Nowhere else** in any of the three laps is a wheel more than a tyre radius under.

## Re-aimed: the chair's ring of 23:58 (plan at 402dbbb5), lap t 52.7 s

**Where his screenshot is in the replay.**
- checked: blackbox's lap clock (`lapMs`) resets at replay t 14.010 s (frame 934, from 14,022 ms to 3 ms), so lap t = replay t − 14.010.
- **His 0:52.673 is replay t 66.683 s, 0.19 s INTO the event below.** The rear right went under at lap 52.488 s (replay 66.495) and came up at lap 59.06 s.
- At his frame the car is at s ≈ 9,420, body 10.5 m right of the line, 7 m inside the right edge, on a road whose climb is about 16° and rising. That is the start of a vertical loop. So "the middle of the road, three wheels on, the rear right hanging under" is exactly what the data shows there.

**But the wheel went under AT THE EDGE, 0.2 s before his frame** (the frames are in `…_evidence/rear-right-frames.csv`):
- lap 52.32–52.44 s: the rear right is outside the footprint past the right edge, by 0.1–0.5 m (0.9 m past the mesh's own edge, which ends at u −17.1), its centre 0.25 m below the edge row's height;
- lap 52.488 s: the first frame with a surface over it, 0.31 m under.
- The screenshot comes after the car has already moved 7 m inward with the wheel caught. inferred: from the screenshot alone it looks like a mid-road event; the frames say the entry was at the edge.

**The rear right, frame by frame, lap 50.70 to 59.84 s** (609 frames, every frame in the CSV: lap t, replay t, s, speed, load, h, the contact normal, the road's bank and climb at the car, and all four wheels' height over the top surface):

| lap t (s) | what the data shows |
|---|---|
| 50.70–51.30 | Leaving the helix: bank −37° → −27°, load 15 → −3 → 11 g. The hop (load −2.9 g, the body 19 cm up at 51.12). All four wheels +0.27 to +0.95 m. |
| 51.30–52.30 | Across the road to the right edge on a road unbanking to 0°, load 2–11 g, all four wheels +0.25 to +0.40 m. |
| 52.32–52.44 | The rear right outside the right edge (above). |
| **52.488–59.055** | **Under: 6.57 s, 0.21–0.31 m under the top surface** (never deeper than 0.308 m). Over this stretch the road climbs from 6° through 90° to upside down (bank ±180°, s 9,701–10,343) and back down to −16°: a vertical loop. The contact normal turns through a full circle; load 15–24 g; speed 649–739 km/h. **The other three wheels ride at +0.24 to +0.26 m the whole time.** |
| 59.04–59.76 | **The jack:** load 2.6 → 0.7 g and the body (h) +0.04 → +0.36 m; all four wheels at full droop and 1–5 m over the surface, so airborne. It lands at lap 59.76 (27 g) with all four wheels on top. |

**How it came back:** a jump-jack step. Not a reset (no teleport until the car's later exit), and **not a restoring force.** The load stayed at 15–24 g for the whole 6.57 s and the depth stayed between 0.21 and 0.31 m regardless of it, round a loop that turned the road's normal through 360°.

**Is it the soft block?** On this evidence, no, not this event. The re-aim's mechanism is CSP soft collision (MAX_DEPTH 4 m, ERP 0.8, CFM 0.0002) letting a wheel sink.
- A wheel in a soft contact carries load and is pushed back harder the deeper it goes.
- This wheel sat at its full droop all along (0.49 m below the plane of the other three, the same place every wheel sat while the car was airborne), so it carried no load, and its depth did not follow the load.
- inferred: AC's tyre finds the road with a probe from the wheel downward, not through the soft contact the body uses, so a wheel whose centre is under a single-sided road sees nothing under it and hangs. That is the reading of a constant-depth, zero-load hang. It is not read from AC's source.

**Every frame in the three laps with a wheel more than a tyre radius (0.395 m) under the top surface, inside the footprint:**
- **C19:** 0 frames (deepest −0.308 m, the event above).
- **C03:** 0 frames (it never goes under at all; its lowest reading is +0.218 m).
- **The reference: 9 frames, all at s 17,578–17,590, t 337.20–337.32 s. A different event, and the soft block's kind.**
  - The car was airborne over a 67°-banked stretch (s 17,600–17,660: load −1 to −18 g, wheels 0.5–3.5 m over the road).
  - It landed at 383 km/h with the load rising 16 → 50 g in 0.06 s.
  - **It went through the road:** in 0.12 s the wheels went from −0.5 to −3.8 m, near MAX_DEPTH 4 m. The box was 0.8 m under the mesh, then nothing under the rays.
  - It fell, and the replay **reset the car to the pits** at t 337.68 s (s 360).
  - That is D341's pass-through, by a 50 g landing on a 67° bank. The soft block's depth cap and spring are the candidate for THAT, not for C19's hanging wheel.

## The answer (the first read, kept: the edge measurements, now context)

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

## Correction, 2026-10-30 (D565)

- "The saved document … today's core refuses it on a joint check" (the road-there section) is WRONG. The core's own `D.parse` opens it (44 pieces) and `toSegments` builds it (27,592 m). The refusal came from my probe calling `toSegments` on the raw JSON without `parse`, which derives the `edge` and `cup` flags the stored pieces lack. Its handles as read raw still stand. See `p-d565-gates-O_2026-10-30.md` §4.

## C07 through the helix: a high-load pass-through, not an edge event (the chair's re-aim of 00:39Z)

**The keeper, 18:38:** "went hard into the helix and the car clipped and went flying bc it glitched through the track". The frames agree.

- **Replay:** C07 (D551 group B), the 18:36 named save (sha256 `9a01897cbe0b21ff…`), not the 18:37 auto-save.
- **Compared with:** C05 (the 18:34 auto-save, sha256 `f449f0bb1c96a4e6…`, the keeper's "fine" lap) and the reference's two helix passes (10-17).
- **Scripts:** `S\d560\helixtrace.js` → `hx-*.txt`, `helixtrace-C07.txt`; `entry.js` → `entry-C07-w0..w3.txt`; `wheel.js` → `out\C07\wheels.csv`.
- **Raw positions, no smoothing:** helixtrace reads the replay's raw positions. Heights are wheel or body centres over the top surface along the AI station's normal; negative means under.
- **The `load` column is smoothed:** it is `table.js`'s second difference over ±4 frames (±0.06 s), so a sharp change shows in it up to 4 frames early. The onset below is timed from the raw velocity, not from `load`.

### The answer

**C07 went through the road with all four wheels on top, 1.5 m inside the edge.**
- **The onset:** about t 59.88 s, s 8,621. That is 0.22 s after the pass's peak load of 62.87 g (t 59.655, 786 km/h).
- **The load just before:** about 54–58 g.
- **The box at the onset:** −16 cm under the mesh (h −39 cm).
- **The wheels at the onset:** all four +0.24 to +0.26 m over the top surface. The outer pair is 1.53–1.72 m inside the mesh edge (u 17.27 m), per `entry.js`.

**What separates it from the passes that held is not the load, which overlaps (C07 54–63 g, reference 55–60 g). It is that C07 never settles:**

| pass | peak load | box: deepest, and how | h there | wheel centres | largest one-frame speed loss |
|---|---|---|---|---|---|
| reference, pass 1 (t 417.6–420.4) | 60.19 g | **−11.4 cm, a plateau**: −10.2 to −11.3 cm for 0.21 s at 55–58 g (t 418.95–419.16) | −34 to −35 cm, steady | ≥ +0.231 m, never under | 1.9 km/h |
| reference, pass 2 (t 563.7–566.6) | 58.24 g | −6.9 cm at 54.9 g | — | ≥ +0.223 m | 1.8 km/h |
| C05 (t 62.3–65.3) | 52.24 g | −3.0 cm at 52.0 g | — | ≥ +0.237 m | 0.4 km/h |
| **C07 (t 58.5–59.86, before the break)** | **62.87 g** | **sinking steadily**: −0.1 cm (t 59.76) → −16.1 cm (59.88), **about 1.6 m/s** | −23 → −39 cm | ≥ +0.235 m | 6.7 km/h |
| **C07 at the break** | — | −21.5, −50.9, −124, −269 cm (t 59.895–59.94) | −44 cm, then lost | **−0.50 to −3.9 m by t 59.955** | **68.5 km/h** (t 59.91) |

- **Where on the road:** every pass runs high on the bank, 12.5–15 m left of the AI line at ≥ 50 g. C07 is the highest, 14.1–15.0 m (per `helixtrace` u).
- **MAX_DEPTH 4 m** (the soft road's `surfaces.ini`) is not what gave: the box broke at 0.16 m, 4% of it. The body was 3.9 m under at t 59.97 and 5.0 m at 59.985, 0.10 s after the onset.

### The frames (C07; the velocity held in the station frame at t 59.82, s 8,609: n = the road's normal there, T = along)

| t | load (smoothed) | box | body over the top | wheels w0 / w1 / w2 / w3 over the top | v along n / T |
|---|---|---|---|---|---|
| 59.820 | 53.8 g | −5.1 cm | 0.00 m | +0.26 / +0.25 / +0.26 / +0.24 | +12.4 / 209.0 m/s |
| 59.850 | 15.8 | −9.7 | −0.05 | +0.26 / +0.24 / +0.26 / +0.24 | +27.7 / 207.0 |
| 59.880 | 1.9 | −16.1 | −0.12 | +0.25 / +0.24 / +0.26 / +0.25 | **+38.8 / 198.0** |
| 59.895 | −5.6 | −21.5 | −0.18 | +0.23 / +0.24 / +0.25 / +0.26 | +33.1 / 185.2 |
| 59.910 | −10.1 | −50.9 | −0.49 | +0.17 / +0.21 / +0.58 / +0.45 | +12.1 / 167.8 |
| 59.925 | −30.9 | −124.1 | −1.17 | **−1.26 / −0.50** / +0.14 / +0.35 | −8.6 / 153.7 |
| 59.940 | −46.0 | −268.6 | −2.02 | −2.83 / −1.78 / **−0.50 / −0.29** | **−14.7 / 150.0** |
| 59.955 | — | — | −2.93 | −3.92 / −3.15 / −1.70 / −1.21 | −15.9 / 150.3 |
| 59.985 | — | — | −4.99 | — / −5.42 / −4.00 / −3.43 | −17.3 / 150.0 |
| 60.015 | — | — | −7.29 | — / −7.85 / −6.46 / −5.73 | −17.0 / 149.6 |

- **The fronts went through first** (w0, w1; wheel order by position, `wheel.js`), at t 59.925, and the rears 15 ms later.
- **Before the break, the car follows the helix:** its velocity along the fixed n grows +5 → +39 m/s at about 60 g, the centripetal turn.
- **A plain release would keep that** (+39 m/s along n, 198 m/s along T) and fly straight from there.

### The exit: thrown, not released

- **In 4 frames (t 59.88 → 59.94), the velocity in the fixed frame changes by:**
  - −53.5 m/s along n, from +38.8 to −14.7, that is out through the road's underside;
  - −48 m/s along T, from 198.0 to 150.0;
  - −10 m/s laterally.
- **That is about 73 m/s in 0.06 s, about 125 g averaged**, directed down through the road and backwards.
- **After t 59.94 it is constant** (a free flight: −15 to −20 m/s along n as gravity adds, 145–150 m/s along T, 536–553 km/h).
- **Over the 0.5 s after (t 59.94–60.44):**
  - the body goes from 2.0 m under the top surface past 7.3 m by t 60.015, beyond the trace's reach after that;
  - from t 60.36 no AI station is within reach (over about 40 m from the line);
  - at t 60.6 it is 62.6 m from the line over s 3,870 (a lower part of the track);
  - then a reset at t 64.95.
- **Answer to "does the contact throw it on the way out": yes.** It is about 54 m/s outward along the road's normal plus 48 m/s of braking, both delivered while the body was 0.2–2.7 m into the road.
- inferred: the push outward reads like a contact pushing the car out the far side of a single-sided surface once it is in deep enough. That is not checked; the replay holds positions, not contact forces.

### For the fix

- **Not the D563 edge mechanism:** there is no wheel near an edge, and nothing fell off one. **The apron does not touch this event.** Its 2.0 m sizing stands or falls on the edge excursions (0.86 m in D563); this event is 1.5 m inside the road.
- **Its class:** the D341 / reference-s-17,584 class, a high-load pass-through of the soft road.
- **Its trigger is a sustained high load with the box still sinking** (about 1.6 m/s, about 0.2 s after a 62.9 g peak), not a landing.
- **The held case is the reference's plateau at −11 cm.** C07 crossed that depth at t 59.865 still moving and broke about 5 cm deeper.
- inferred: a guard on load alone would not separate C07 from the reference (54–63 g against 55–60 g). Box depth and its rate do: a plateau held at −11 cm, a box still sinking at −16 cm broke. Two passes that held and one that did not is thin; one more broken pass would test it.

## C09: the helix held, then the edge (the 18:45 save; D551 group B)

**Correction to "For the fix" above, from this lap:**
- **Depth alone does not separate held from through.** C09 held a plateau at the depth where C07 broke: box −14.5 to −15.9 cm, h −37 to −38 cm, at 58–62 g, for 0.24 s (t 64.53–64.77).
- **Every wheel stayed on top** (≥ +0.230 m), and no frame lost more than 2.6 km/h.
- **What still separates C07** is that it reached −16 cm still sinking at about 1.6 m/s, where every pass that held had settled.
- The set is now **four passes held** (the reference twice, C05, C09) **and one broken.**
- inferred: a guard on box depth would have to be placed past −16 cm and so would not separate them. The sinking rate still does, on this set.

**Then the D563 edge shape on the LEFT, with a worse ending** (`entry-C09-w2.txt`, `hx-C09-e1.txt`, `hx-C09-mid.txt`, `hx-C09-e2.txt`):

| | C09 w2 (a rear wheel, left side) | D563, C19 rear right |
|---|---|---|
| farthest past the mesh edge (u 17.27 here) | **0.595 m** at t 66.36, s 8,937 (the first frame read; the wheel was already out) | 0.856 m |
| its centre against the edge row while outside | +0.03 → −0.59 m | +0.34 → −0.34 m |
| back across inward | t ≈ 66.475, s 8,957, **0.82 m below the edge row** | 0.32 m below |
| under the top surface | **0.78–1.44 m**, from t 66.48, carried inward to u 12.5 (4.7 m in), 0.77 s | 0.21–0.31 m, 6.57 s |
| how it ended | **launched**: at t 67.11–67.23 (s 9,065–9,083) the load goes 0.8 → −25.3 g, the box from +0.02 to −2.73 m (under the top), and the car's velocity along the road's normal from −0.8 to **+24.7 m/s** (out the top) | the jump jack lifted it |

- **What the other laps do there:** at s 9,040–9,100 (a descending bank of 36–41°) they carry 12–18 g. C09 carried a wheel under the road while its w1 rose (+0.66 → +1.43 m).
- **After the launch:** the body rose past 10 m over the road (t 67.71), flew about 1.6 s across the road at 18–23 m/s to the right, and came down beyond the right edge at s 9,370–9,410. The right wheels read under the edge row there because they are past it, not through it. The replay ends at t ≈ 71.
- inferred: **the wheel trapped under the road, and the box reaching it from below, pushed the car out the top.** That is the throw this section's C07 case shows in the other direction. Contact forces are not in the replay.
- **For the apron:** C09's excursion (0.595 m past the edge, centre 0.59 m below the edge row) is smaller than D563's 0.86 m. Both fit inside 2.0 m.
- **This lap shows what the edge mechanism costs when it is not caught:** a wheel 1.4 m under for 0.77 s, then the car thrown off the track.

## C09 again: the keeper's "the body itself going underneath and causing a slide" (the chair's ring of 00:48Z)

**Answer: a third shape, the BOX-UNDER RIDE.**
- **What it is:** the chassis box rides deep under the top surface while all four wheels stay on top. It neither goes through (C07's shape) nor goes off an edge (D563's).
- **The "slide" begins as the box comes back out of the road, not while it is in.**
- Same replay as above: the 18:45 save, sha256 `e5c0fd08…`.
- New outputs in `S\d560\`: `hx-C09-slide.txt`, `hx-C09-yaw.txt`.
- **New columns in `helixtrace.js`:**
  - `yaw`: the car's axis (the front wheels' midpoint minus the rears') against the road's tangent;
  - `vel-dir`: the velocity's direction against the same tangent.

**How deep and how long the box rode under** (`out/*/table.csv`, the longest unbroken run of frames below each depth):

| pass | box < 0 | < −5 cm | < −10 cm | < −14 cm | deepest |
|---|---|---|---|---|---|
| **C09** | 1.09 s | 0.82 s | **0.58 s** (t 64.47–65.04) | **0.36 s** (64.55–64.89) | **−15.9 cm at 60.2 g** |
| reference, pass 1 | 1.51 s | 0.96 s | 0.30 s | 0 | −11.4 cm |
| reference, pass 2 | 1.74 s | 0.69 s | 0 | 0 | −6.9 cm |
| C05 | 1.27 s | 0 | 0 | 0 | −3.0 cm |

- **All four wheels stayed on top throughout:** every wheel centre ≥ +0.230 m, none under, and no frame lost more than 2.6 km/h.
- **This is D515's "box under the mesh from 47 g", but deeper and longer at depth than any other pass:** 0.58 s below −10 cm, against the reference's 0.30 s.
- **The load:** 58–62.8 g at the deepest, 787–796 km/h.
- **Placed against the other shapes:**
  - C07 reached the same depth still sinking (about 1.6 m/s) and went through;
  - C09 settled there (a plateau, −14.5 to −15.9 cm for 0.24 s);
  - **the box-under ride is the settled branch of the same stage.**

**How it ended: the box came out of the road and the car spun** (`hx-C09-yaw.txt`, every 6th frame):

| t | s | u | yaw | vel-dir | load | box |
|---|---|---|---|---|---|---|
| 64.950 | 8,681 | 11.45 | −21.3° | −1.8° | 53.8 g | −13.3 cm |
| 65.040 | 8,699 | 10.50 | −25.3° | −2.2° | 51.4 | −10.3 |
| 65.130 | 8,717 | 9.34 | −31.2° | −2.8° | 48.7 | −6.3 |
| **65.220** | 8,729 | 7.98 | **−38.7°** | −5.0° | 46.8 | −3.4 |
| 65.310 | 8,747 | 6.40 | −29.6° | −4.8° | 45.9 | −0.7 |
| 65.490 | 8,783 | 4.28 | −4.6° | +0.3° | 46.9 | +0.4 |
| 65.940 | 8,867 | 10.48 | −4.9° | +8.0° | 46.5 | +0.4 |
| 66.300 | 8,927 | 16.27 | −24.9° | +1.4° | 33.3 | +1.8 |
| **66.480** | 8,957 | 15.49 | **−43.3°** | −2.9° | 26.4 | −7.9 |

- **From t 64.95 to 65.22 the car rotates 17.4° against the road while its path turns 3.2°.** That is a yaw away from its direction of travel, a slide or spin.
- It happens over exactly the frames in which the box rose from −13 to −3 cm and the load fell from 54 to 47 g.
- **The reference over the same exit:** its yaw holds −8.6° to −15.3° (t 419.5–421.4; this column's zero carries an offset from the bank, so read the change, not the level). Its box comes out from −5 to +2.5 cm.
- **Then:**
  - the car recovers (−4.6° at t 65.49);
  - it crosses the road leftward at up to 25 m/s, 4.3 → 16.3 m in about 0.8 s;
  - it yaws −25° → −43° as its left rear goes 0.595 m past the edge (above);
  - the trapped wheel launches it (above);
  - it lands beyond the right edge: the crash.
- inferred: the box leaving the road at speed upsets the car. One case, and the cause is not separated from the driver's inputs; the replay holds no steering or throttle.
- **The chain is:** the box-under ride, a spin as the box comes out, the edge, the trapped wheel, the launch.

**For the fixes:**
- **Three shapes stand,** each with its own lever:
  1. **through:** C07, the box sinking and not settling;
  2. **off the edge:** D563 and C09's left rear; the apron's 2.0 m covers both measured excursions;
  3. **the box-under ride:** C09, settled at −16 cm for 0.36 s with the wheels on top, and the car upset as the box came out.
- **What would move the third:** a road whose soft contact settles shallower. That is STIFF's question too: the same C07 / C09 pace on STIFF should show a shallower plateau if the CFM is the lever.
- **Its falsifier:** STIFF's plateau at matched load (58–62 g) is −14 cm or deeper.
