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

## AMENDMENT (librarian, 08:0x): one CROSS-SECTION lap = edge curve + TUBE + spiral. The keeper, 07:59: "id like that, since i like the idea of spiraling through it".
- **Why one lap:** both change the cross-section function. Doing them together gives one seal, one fixture re-baseline and one suite.
- **The keeper's screenshot** (`C:\Users\nname\Pictures\Screenshots\max cup doesnt complete cylinder.png`, cup 150, width 60, a straight):
  the 60° gap at the top is the cup working as built. Its walls meet at 159.681° (D190 seal), so CUP_MAX is 150. The cup's bowl curve
  cannot close.
- **TUBE:** a new cross-section family, a CIRCULAR ARC (constant curvature) with a sweep angle `t` from 0 to 360°.
  - At 360° the section closes into a cylinder of circumference = width; the road is the whole inner wall.
  - A circle never self-intersects below closure, so there is no 159° wall.
  - The tube composes with the edge curve only when open (`t` < 360); closed, the edge curve is moot.
  - Transitions between cup and tube pieces blend over the piece, like the cup morph zones (D190 morphZone/tailZone), with joints C1
    and seams ≤ 1 mm.
- **SPIRAL (what the keeper wants to do in it):** inside a closed tube, the driving line is where "down" points, and that is bank. To
  spiral, bank must WIND through ±180° continuously along a piece (e.g. 360° over 300 m) instead of being clamped.
  - That needs bank unwrapping in the core: a continuous angle, no wrap at ±180.
  - It needs the queued INVERSION geometry: roll about the heartline, not the centreline, so the car's path does not jump when it
    goes inverted. Plus a ROLL-RATE check in the validator: the roll rate the car feels at design speed, red above a limit sealed by E
    from a real track (Centrifuge's inverted sections).
- **Seal additions (E):**
  - tube closure (the 360° seam meets itself within 1 mm);
  - bank winding (continuity across ±180);
  - the heartline path stays smooth through an inversion;
  - the roll-rate bar;
  - the export: the ceiling of a closed tube is road, physics-solid, CSP raycast on;
  - the camera inside a closed tube (no clipping, chase cam rolls with the road).
- **Owners as above.** It stays QUEUED behind D222, then: E seal → A core (tube family, unwrapped bank, heartline roll) → C fields (tube
  sweep, edge angle, edge start; bank accepting > ±180) → B non-author → ONE suite → install → the keeper spirals it in AC.

## C's test-track measurement, collated (librarian, 09:0x): `loop/t180_testtrack_profile_2026-10-03.md` (handback `p-testtrack-C_2026-10-03.md`)
- The real T-180 test track (1,912 sections, a 7,852 m lap): a flat middle (ψ ≈ 3° at u 0.26, 5° at 0.50), a CREASE at u ≈ 0.64 (+~10° in one
  step), a steep outer band at ψ ≈ 19–20° from u 0.66 to 0.88, then a LIP that rolls back ~9° over the last ~10% (ψ ≈ 10.7° at the edge).
  It is symmetric (turn outside = inside = straights) and faceted (median 4 flat facets a side), not smooth.
- By C's pre-registered rule it is "one curve" (only 72/1,912 sections met the smooth two-zone bar), because smooth models can't follow
  facets. Read the facets, and the keeper's shape is there: middle → steeper outer band.
- **Seal defaults from it:** `s` = 0.64, `e` ≈ +15° (outer ~20° vs inner ~5°). The keeper asked for SMOOTH, so G stays smooth (G1/G2). The
  author's version is a kinked smoothing of the same idea.
- **NEW, from the data, offered to the keeper and NOT added without his word:** the outer LIP roll-back (the last ~10% eases back ~9°).
  It would be a third optional control, "lip", later.
