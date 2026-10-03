# T-180 — the EDGE CURVE: two slices through the road, a middle curve and a steeper outer curve. Librarian, on D, 2026-10-03 07:5x. QUEUED behind D222.

The keeper, 07:51–07:53: "an increased banking on the edges of the tracks so that the sides can be banked a little more" … "its not like a wall
rather a smooth curve, and then the length of it can be tweaked too, so its like putting two slices through the track, there is the middle curve
and then the outer curve".

## What it is
- **Two slice lines, one each side, symmetric about the centreline.** They cut the cross-section into a MIDDLE zone and two OUTER zones.
- **The middle zone keeps today's profile** (bank rotates the section; cup curves it, D190).
- **The outer zones curve MORE**, adding an extra edge angle `e` on top of whatever the middle gives at the slice.
- **Smooth, not a wall.** At the slice the road keeps its angle (no kink) AND its curvature (no sudden change in how fast it bends).
  The outer curve eases in from the slice and steepens toward the edge.
- **Two new controls in Extend, like the others** (typed value, blended along the piece, with the "at start" box once D222 lands):
  - **edge angle** `e`: how much MORE the very edge tilts than the plain profile would there. 0 = off (today's road, exactly).
  - **edge start** `s`: where the slice sits, as a share of the half-width from the centreline (e.g. 0.70 = the outer 30% each side curves
    more). This is the keeper's "the length of it can be tweaked".

## The maths (for A and E; the profile in the D190 cup's terms)
- Surface angle across the road, at lateral position `u` ∈ [−1, 1] (centre 0, edges ±1): ψ(u) = ψ_mid(u) + sign(u) · e · G((|u| − s) / (1 − s)) for |u| > s, else ψ_mid(u).
- **G(0) = 0, G'(0) = 0, G(1) = 1**, monotone (e.g. G(t) = t², or the smoothstep half that keeps G'(0) = 0). G(0)=0 keeps the angle
  continuous at the slice (no kink), and G'(0)=0 keeps the curvature continuous there. The end value G(1) = 1 puts the full `e` at the edge.
- **Composition:** ψ_mid is the existing bank + cup profile. The edge term adds to it, and bank still rotates the whole thing. The total
  edge angle stays capped by CUP_MAX (150°); the validator reds anything past it.
- **e = 0 is the identity.** Every existing document, legacy or core, renders byte-identically. That is the strongest registered check.

## Channels and the document
- Two new core channels, `e` (degrees) and `s` (share), cubic B-splines on the same knots, C1 at joints like every channel (`jointProblem`/`JOINT`).
- **Schema:** absent channels read as `e = 0`, `s = 0.70` (inert while e = 0). Either an additive optional field (no version bump if the
  reader tolerates absence) or `t180b.core/4`, migrating /3 unchanged. Rule at registration. No stored document changes.
- Close(): holds `e` and `s` at the seam, as for cup (refused with a clear code otherwise).

## Seal BEFORE build (E, as for D190's cup seal)
- Profile values at a grid of (e, s, cup, bank), and the slice continuity checked numerically: |Δψ| and |Δψ'| at u = s below tolerance.
- **e = 0: all fixtures byte-identical** (after D222's re-baseline).
- Mesh validity at extremes (e max with cup max; s near 0.5 and near 0.95), and seams ≤ 1 mm.
- The camera and labels with a deep edge (no clipping into the lip), and export in AC (the edge surface is road and physics-solid,
  checked the D222 way).

## Owners and order (GEOMETRY tier)
1. **D222 lands first.** It carries the at-start UI and the transition map this builds on.
2. E registers the seal → A builds core + adapter + export → C builds the two Extend fields → B is the non-author (seal re-run plus
   unscripted cases) → ONE serialized full suite → land → the librarian installs. The keeper's hands are the last check, at 900+ km/h in AC.
3. **Not in v1:** outside-of-turn-only (asymmetric), a different G shape per side, and the full-pipe tube. Each is a later option.
