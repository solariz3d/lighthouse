# The bank ramp: smooth like the beginning, not a slice. Librarian, 2026-10-31 18:0x

The keeper, 18:01-18:02, looking at the D521 page (https://claude.ai/artifact/2GaB1FM6SuRMVa16z7R1ko, 10-28): "IDK if it looks good... it should look like how it did in the beginning, but NOT A FUCKING SLICE".

## What the two pictures show (read by me, r/before.png and r/after.png from that page)
- Before (the beginning): the road's edge leaves the straight in a smooth S. Bank 0.33 deg at 10 m, 2.68 at 20, 27.03 at 50; steepest roll 1.02 deg/m, which drew 1 amber (the checker's amber is over 0.93 deg/m).
- After (D521, installed since 0.4.28): the bank rises in a straight line from the joint, with a 10 m rounding at each end. The edge runs as a straight diagonal cut into the road from the joint: the slice. Steepest roll 0.60 deg/m, no amber.

## The change (pane C, PROVE IT: core geometry)
- An unticked bank change eases over the whole piece with a smooth S whose rate peaks in the middle: smoothstep, 3t^2 - 2t^3, or whichever smooth S keeps the peak rate under the amber line on his case. Smoothstep's peak is 1.5 times the average. On his piece (54.05 deg over 100 m) that is 0.81 deg/m, under the 0.93 amber and the 0.85 that real tracks reach at the 90th percentile. So it looks like the beginning, with no straight cut and no amber. A piece too short for that falls back to lengthening the roll the way the checker already advises.
- Saved tracks are untouched. Pieces keep the ramp they were laid with (D521 kept old pieces the same way), so ELYSIUM's geometry and its approved apron physics do not move.
- "Early" (F) is unchanged.
- Proof: his D521 piece renders before (today), after, and the 10-28 before, from the same camera as the D521 page, close up from the side and from behind, in an Artifact for him BEFORE landing. Bank at 10, 20, 50 and 90 m and the peak rate in a table. Saved documents byte-equal. The ramp's mutation harness, with a new mutant that reverts to the linear ramp. Checker 0 amber on his piece. Fixtures 0 of 9.
- Falsifier: if on his eye the new S still reads as a cut at the joint, the S must start slower (a quintic with zero second derivative at the ends), not run longer.
