# Continuity at a joint: why the Bloss ramp bumped, and what order every ramp has now (D459, 2026-10-25)

The user, 2026-10-25, on TEST 10 at 0.4.19: *"it is a tad bit better but still broken, doesnt send me off, but there is still a bump its not
smooth"*, and the frame for the fix: *"it isnt just about fixing the track, but understanding it so the generation system never does it again"*.
This note is the understanding, for the class of fault and not the track. The measurements are in the room's record,
`exo_memory/handback/p-d459-find-P_2026-10-25.md` and `p-d459-c2-P_2026-10-25.md` (the lighthouse repository); the test is `test/core_joint_c2.test.js`;
the instrument is `src/core/continuity.js`. The seam's other fault, the vertical sheet a mis-paired zipper stood up at some joints, is C's note
(`docs/SEAMS.md` or its neighbour; `src/geom/mesh.js meshSeam`).

## 1. The class of fault: a ramp that is C1 and not C2

A piece's channels are cubic B-splines. A piece that CONTINUES a channel starts from the previous piece's end value and slope (`document.js pieceEnd`,
`extend.js channelFn`'s `cont`), so every joint is C1 by construction: the value and the first derivative never step. That is the whole of the old
guarantee, and it is all `checkDoc` enforces (`JOINT`: "every road joint is C1 in every channel").

A ramp word (a bank change, a cup from → to, an edge from → to) reached its target by the Bloss blend, S(u) = 3u² − 2u³ (IFC's Bloss transition,
`docs/math/04a_bank_ramp.md`), applied as (1 − S)·cont(s) + S·target. S′(0) = S′(1) = 0, so the ramp's ends have no slope step. But S″(0) = 6/L² and
S″(1) = −6/L², so a ramp of Δ over L metres has a curvature of ±6·Δ/L² at its two ends, against 0 in the piece on either side: **the channel is C1 and
not C2 at both ends of every ramp**. The Bloss curve is the railway's cant ramp; a railway does not mind, because its rails are the centre line. Here
the channel is a roll, a cup or an edge angle, and a wheel 8.4 m from the centre rides at height ≈ 8.4·sin φ: a step of Δφ″ in the roll's curvature
along s is a step of 8.4·Δφ″ in the road's vertical curvature under that wheel, arriving all at once at the joint.

Measured on TEST 10 (the figures are 6·Δ/L² exactly, to the fit's smoothing):

| joint | the word | Δφ″ or Δc″, Δe″ (°/m²) | under a wheel at 8.4 m (°/100 m) | at 300 km/h |
|---|---|---|---|---|
| p1\|p2, p2\|p3 and the hairpin's four | a 30° bank over 100 m, on and off | 0.0178 | 15 | 1.8 g |
| p10\|p11, p11\|p12 | the right edge 0 → 35° over 50 m, with a 10° roll | 0.0823 (er), 0.0235 (φ) | 20 | 2.5 g |
| p9\|p10 | the edge 30 → 0 over 50 m | 0.0706 | – | – |
| p23\|p1, the seam | the closer's cup 15 → 0 over its last 40 m | 0.1085 (c) | 10 | 1.2 g |

The centre line, the preview's drawn line and the exported surface held at every one of these joints (position to 0.09 mm, heading to 0.005°, the
surface on the core to 0.5 mm). The bump was never a gap or a step in the road: it was the road's curvature under the outer wheels changing at once.

## 2. What continuity order every ramp has now

| who lays it | channels | the blend | order at the ramp's ends | where |
|---|---|---|---|---|
| `extend` (a target) | the bank φ, the cup c, the edges e and er | the C2 quintic 6u⁵ − 15u⁴ + 10u³ (`smoother`), fitted by least squares with the hold and the last two control points pinned to the target (`fitWithHold`: the ramp reaches its value at the transition and holds it exactly), then the one free control point at each end is moved so the curvature there is exactly 0 (`c2Ends`); such a piece has at least three interior knots | **C2** both ends, by `continuity.c2Breaks` | `src/core/extend.js` |
| `extend` (a target) | the route: kh, kv, w, r, s, t, h, l | the Bloss cubic, as before | C1 (a curvature step of 6·Δ/L² at each end). kh and kv are the path's own curvature; their step is the path's C3 and is not a step under the wheels. Out of D459's ruling | `src/core/extend.js` |
| `extend` (a short ramp, `transition: { ch: 'start' }` or metres in a map) | any | the same blend per channel, read at the Greville abscissae instead of fitted (`rampControl`); a C2 channel's short ramp gets 8 subdivisions instead of 4 (with 4, the zero-curvature start left the whole change to one span), then `c2Ends` | as above per channel | `src/core/extend.js` |
| `extendTurnBy`, `extendSharp` | kh (and kv for a climb corner) | the Bloss blend up and down (a symmetric ease), or a 4 m ramp | C1 at the piece's ends; the rate is 0 there | `src/core/turnby.js`, `sharp.js` |
| Close: the cup home (`cupHome`) | c, over the closer's new road | the C2 quintic where its peak, 1.875·Δ/L, stays under 0.021 °/m; the linear fade where it would not (the slowest a closer of that length allows), as D438 built it | C2 at the user's last joint and at the start line under the quintic (0.00001–0.00002 °/m² read); C1 under the linear fade (the stored spline bends over one span to meet the line: ≤ 2 × 0.021 / span, 0.0008–0.0013 °/m² read) | `src/core/finish.js` |
| Close: the roll straight (`finishToStart`) | φ | laid by `extend`, so the quintic; sized so the checker's 20 m-chord roll rate stays under amber, from a first guess at 1/1.875 of it | C2 where it meets the user's last piece. Its exit joint is bankLap's | `src/core/finish.js` |
| Close: the closure itself (`close.js close`, the local or whole-lap bend that makes the end meet the start) | every channel of the pieces it moves, and the seam | the closure system's rows pin each channel's VALUE and SLOPE at the seam to p1's and keep the joints it moves C1; D459 3c adds a CURVATURE row for each of φ, c, e, er at the seam and across every joint the close moves (a free control point on either side), linear in the first and last three control points by the closed forms of continuity.js, so the least-norm step meets them like the others | **C2** at the seam and at every moved joint for the Close button's bends and any plain close (before 3c: C1 only, 19 of 20 closed sweep laps stepped at the seam by 0.002–0.34 °/m²; after: 0 of 40). Finish asks for the edges' rows only (`finish.js FINISH_C2`): its bank plan owns the bank at the closer's joints and the seam (the row above, D447's C1 bound; a curvature row there moved the plan's points 0.46° off their share), and cupHome owns the cup (C2 by its quintic where the rate allows; a row steepened the linear fallback past the rate it reports). A window whose pieces have too few free points for the extra rows is refused by name, as a too-small window always was | `src/core/close.js` |
| Close: the bank plan (`bankLap`, `bankPlan`) | φ on the lap's curves | the plan's own rate and acceleration bounds on the control polygon | C1 by construction; the curvature step at a joint is bounded by BANK_ACCEL, 2e-4 rad/m² = 0.0115 °/m² (D447's ruling: 21.7 °/100 m at the wheel, the user's own joints' 90th percentile) | `src/core/finish.js` |
| Sculpt: Grab's lift | h, l | Perlin's smootherstep falloff on the control points the window covers | the lift is C2 along s by its falloff; its joints are the pieces' (C1 continued) | `src/core/sculpt.js` |

The rule for a new ramp maker: if wheels ride on the channel, blend it with `smoother` and pin its ends with `c2Ends` (or lay it through `extend`, which
does both); add the channel to `extend.js C2_CHANNELS` and `continuity.js C2_CHANNELS`; and let `test/core_joint_c2.test.js` or the seeded sweep read
it. A ramp that only ends with slope 0 is not smooth under the wheels.

The price of the quintic, so it is not rediscovered. The Bloss cubic was a cubic in s, so the cubic B-spline carried it EXACTLY: the fit ended on the
target to the quantum, the hold was flat, the mesher's smoothstep blend between a segment's two ends reproduced the cup's ramp row for row, and every test
that pinned a document's bytes, a readout's "20.00°" or a rim's "−10" was pinned to that exactness. The quintic is only approximated by the spline, which
is why the ramp's hold and end are pinned in the fit (above), why a 50 m piece gets three interior knots, and why the mesher's rows between stations now sit
up to 0.1° off the cup's own value on the steepest ramp allowed (150° over 40 m; the fix that brings that to 0 is per-row weights read from the channel in
`src/geom/mesh.js`, for the ruling). One accident the exactness hid: a fitted Bloss ramp whose end rang (53.9, 54.1, 53.9, 54 on a 54° bank) handed the
next piece a slope, and a closer "on its own bank" drifted from 55° to 70° over 1,400 m (core_finish_bank row 8); the hold is exact now, and that row
reads the user's 54°. Over the same length the quintic is steeper through its middle, 1.875·Δ/L against the cubic's 1.5·Δ/L,
and its fitted spline reads 1.07–1.09× that peak with three interior knots (1.20–1.24× with two, which is why a cross-section ramp gets three). On
TEST 10 re-laid with it, no roll-rate amber fires (the 30° bank over 100 m peaks at 0.57 °/m against the amber's 0.93; the hairpin's 30° over 100 m the
same); Finish's rolls come out about 25% longer for the same angle.

## 3. Why the checks missed it, and the instrument that does not

Every check the room had sampled a line or a mesh:

- `kstep436.js` and `core_finish_joints.test.js` read the vertical curvature of a surface line by second differences over 2 m and listed its change
  over 2 m. A curvature step at a joint reads there as a finite "change", one number among the hairpin's and the loops', ranked and judged against a bar
  that was chosen from the user's own joints (21.7 °/100 m, their 90th percentile). The bank joints at 15 °/100 m were under that bar, so they read as
  "his own words' shape", three times (D433, D436, D459 part 1), and the closer's seam was measured against them instead of against zero.
- `surf436.js` and the preview-line check cast rays down at the mesh, or read the drawn line's points. A C2 step has no signature in either: the
  surface is where the geometry says, to the millimetre, on both sides of the joint.

So nothing ever asked what a ramp joint's curvature OUGHT to be. The answer is 0, and the instrument reads it from the document itself:
`src/core/continuity.js endDerivatives` gives a channel's value, slope and second derivative at a piece's two ends in closed form from its first and
last three control points and knot spans (de Boor's derivative rule; `jointSteps` takes the difference across every joint, the seam included;
`c2Breaks` lists the joints where a C2 channel steps by more than 1e-5 per m²). No path is sampled, no bar is judged: the assertion is "no joint steps",
and it is exact to rounding. On 0.4.19's generator it lists every bank, cup and edge joint of a track laid from those words with the exact 6·Δ/L²; on
this one it lists none. `test/core_joint_c2.test.js` row 0 checks the closed forms against a four-point reading of `valuesAt` on the end span, which
is exact for the cubic the span is; rows 1–8 are the words, Close and the shape; row 9 is the closure itself (a whole-lap close and a local one). The seeded
sweep's C2 part (`test/sweep_c2.test.js`, C's generator) runs `c2Breaks` on every generated track, open and closed: the joints the words laid (red on
0.4.19, green with the quintic) and the seam and the joints Close moved (red before the closure's curvature rows, green with them).

What would still be missed: a channel this rule does not cover (the route's kh and kv ramps keep their Bloss ends, and a C3 step of the path is
felt as a jerk in the turn, not as a vertical step under the wheels), a bank laid by the plan to its own C1 bound, and anything the mesh does between
two stations (that is C's instrument, the fin guard). Each of those is named here so the next reader starts from the list, not from the track.
