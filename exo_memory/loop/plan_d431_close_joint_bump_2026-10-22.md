# D431: a bump at the joints of the closing pieces (librarian, 2026-10-22)

## The report

The keeper, 2026-10-22 09:17: "CHECK OUT TEST 10 track, intersting data for the closed loop feature. the last three pieces were the closing of the loop done by the system, it is better than i thought, however look at it, towards the end there is a bump as the gen came out a bit higher than the end of the track was so it made a hump".

The keeper, 09:20: "but remember not to fix the track itself, but the close loop generation itself to be more accurate and smooth".

- **Do not edit TEST 10 or any saved track.** The fix goes in the close generator (`src/core/close.js` and the seam tries).
- TEST 10's copy is the evidence and a test case only.

## What the data says (checked, librarian, on a copy)

- Copy: `scratchpad\d431\eq-TEST 10.t180track` (this session's scratchpad), sha256 da31c0b7…7a57, 35,641 B, saved 09:16. His tracks folder was only read.
- Scripts: `scratchpad\d431\z.js` (readouts) and `zint.js` (centreline integration, heading about world up and pitch about the local left). The lap closes to (0.0, 0.0, 0.0), so the integration matches the core.
- 23 pieces, 11,484 m. The closer is p21 (919 m, turn +175°, climb +8.0°), p22 (746 m, −0.2°, +0.1°) and p23 (919 m, −174.8°, −8.1°).
- **Height:** after the two loops (p18, p19) and p20 the road bottoms out at about −262 m (8,900 m). The closer climbs steadily back to 0 at the start line. There is no overshoot above the start: z is monotonic from 9,000 m to the end.
- **The bump is in the curvature at the closer's joints.** Each piece's spline matches its neighbour's end value but overshoots for one or two knots (20–40 m) beside the joint:

  | joint | channel | control points across the joint (°/100 m) |
  |---|---|---|
  | p21 → p22, 9,819 m | climb rate kv | … 0.42, 0.30, 0.02, **0.55 \| 0.55, 1.06**, 0.26, 0.33 … |
  | p22 → p23, 10,565 m | kv | … −0.26, 0.02, **−0.58 \| −0.58, −1.19**, −0.30, −0.42 … |
  | p21 → p22 | turn rate kh | … 0.23, −0.21, −0.03, **−0.76 \| −0.76, −1.48**, −0.36 … |
  | p22 → p23 | kh | … 0.36, −0.03, **0.81 \| 0.81, 1.65**, 0.21 … |

  - At 10,565 m the climb rate spikes to about −1.2 against a trend near −0.3, which is a short crest: a hump, "towards the end".
  - At 9,819 m it spikes positive, which is a short sag.
  - The turn rate kinks the same way at both joints, so the road also wiggles sideways there.
  - The seam into p1 (p23's last points: −1.44, −1.10, 0, 0) steps the climb rate to 0 within one knot.
- inferred: the closing solve (`src/core/close.js`, and the D421c seam tries) fits each piece with its end values and slopes pinned, and the spline meets those at the joint by overshooting the knots next to it.

## Part 1, pane O: measure, then fix. Tier: prove it (core geometry and stored data)

1. From local-0.4.13 6261a22, in your own worktree, on branch `d431-o`.
2. **Reproduce:** use the undo history copy (`eq-TEST 10.t180undo`, copied first, never written) to reach the open lap before the close. Close it with the core and confirm the same control points as above.
3. **Test first:** for a closed lap, the curvature across each closer joint (kh and kv) has no overshoot beyond its neighbours' trend.
   - TEST 10 is one case; add at least one other that closes with a climb.
   - The row is red now.
4. **The fix in the close**, so that the joints are smooth in kh and kv. Hold:
   - the lap still closes to its tolerance;
   - the release bytes of every non-closer piece are unchanged;
   - the close-harness and core mutation harnesses pass whole.
5. If the fix needs the closer to be one piece, or a different spline fit, stop and hand back the measure; the librarian rules.
6. Hand back the cause (file:line), red then green, the residuals before and after, and the sha.

**Part 2:** the librarian rules. A review by P follows, because this is the close solver. It rides the build after 0.4.14 unless it is accepted before Part 3 of D429 starts.

NEXT: chair route D431 Part 1 to O now; O hands back to the librarian.

## Amendment, 2026-10-22 09:5x: the keeper meant TEST TRACK 10 (librarian)

- The keeper, 09:49: "no i meant TEST TRACK 10". This plan was written against TEST 10.
- Both tracks have system-made closers with the same two faults, so the work at the generator stands.
- **TEST TRACK 10 is now the primary case.** Copy: `scratchpad\d434\eq-TEST TRACK 10.t180track`, sha256 4045b7b3…, saved 09:42. The closer is p42 (1,273 m), p43 (760 m) and p44 (1,744 m).
- **Joint overshoot (D431), larger here.** Control points across each joint, in °/100 m:
  - p42→p43 kh: −0.15 | −11.81, **−23.54** | −5.71, against a trend near −6 to −7;
  - p41→p42 kh: −0.10 | −5.99, −12.72 | −2.32, and kv −15.83 against a trend near −3 to −4;
  - p43→p44 kh: 13.20 against a trend near 3 to 5.
- **No bank (D434).** The closer holds the base bank −180° throughout. In the builder's flipped form (pitch about 180°) that is upright, so the road is flat.
  - Measured with `scratchpad\d434\lean.js`: the road's lean into the curve, asin(U·k̂), over the closer averages −0.6°; 373 stations lean into the curve and 405 lean out.
  - The keeper's own hand-banked p34–p39 just before it averages 53.2° into the curve, with 0 stations leaning out.
- TEST 10 stays as a second case. Both cases go in the test.
