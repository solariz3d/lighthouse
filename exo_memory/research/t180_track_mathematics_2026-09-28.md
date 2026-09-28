# The mathematics of a sculptable closed high-speed track

*A research agent briefed by the librarian (on D), 2026-09-28 00:1x, after the keeper said: "when you research, it has to
do with mathematics and how that relates to the tracks". This is the agent's report, lightly restructured. Its findings
and sources are as it returned them, and every "(mine)" marks a derivation of its own, not a quote from a source. The
librarian's notes are at the end.*

## Summary

- **Almost every piece of the keeper's vision has a mature mathematical tradition behind it:**
  - rail and highway alignment: transition curves, and cant versus speed;
  - roller-coaster force vector design (FVD): specify the forces, integrate for the geometry;
  - curve fairing: the elastica, Minimum Variation Curves, and Levien's Euler-spiral splines, which make "flow"
    mathematical;
  - differential geometry: frames, the Gaussian curvature of swept surfaces, and the Jacobi metric, which makes
    "natural line ≈ geodesic" exact;
  - discrete differential geometry: closure as a projection onto a few integral constraints.
- **Two unifying identities (mine):**
  - at constant speed, lateral jerk = v³·dκ/ds, so the railway jerk limit, the Moreton–Séquin MVC functional and
    "flow" are one quantity;
  - cant deficiency is the geodesic curvature the tyres must supply beyond gravity.
- **No prior art was found for the combination:** sculpting the intrinsic parameter functions of a wide swept surface,
  with automatic least-norm re-closure, while the car's line is free on the surface.

## 1. Railway and highway alignment

- **The balance:** tan θ = v²/(gR) (in highway form e + f = V²/(127R)); cant deficiency = unbalanced lateral
  acceleration.
- **Transition shapes:**
  - the clothoid has κ linear in s, so constant jerk, and L = v³/(R·J);
  - the cubic parabola approximates it;
  - Bloss (κ ∝ 3u² − 2u³) and sinusoidal transitions have zero dκ/ds at their ends, which removes the jerk step (G3-like).
- **Limits:** EN 13803 lateral jerk ≈ 0.5 m/s³, often 0.35 (unverified against the standard's text).
- **Worked numbers (mine):** at 400 km/h an 80° bank balances at R ≈ 222 m, and 90 g means a curvature radius of
  about 14 m.
  - Human-rated limits do not apply to T-180; use the shapes, not the limits.
- **Gives the builder:** a live balanced-speed / cant-deficiency readout, and a menu of transition types.
- **Sources:**
  - [Bloss design guide](https://www.researchgate.net/profile/Constantin-Ciobanu/publication/282288817_Bloss_transition_-_a_short_design_guide/links/560a94ef08ae4d86bb13eb2f/Bloss-transition-a-short-design-guide.pdf)
  - [Transition curve review](https://www.researchgate.net/publication/341476435_Railway_Transition_Curves_A_Review_of_the_State-of-the-Art_and_Future_Research)
  - [Civil 3D transitions](https://help.autodesk.com/cloudhelp/2026/ENG/Civil3D-UserGuide/files/GUID-DD7C0EA1-8465-45BA-9A39-FC05106FD822.htm)
  - [EN 13803 limits summary](https://railwaytrackblog.com/2015/05/04/the-limits-of-the-track-alignment-design-parameters/)
  - [EN 13803 catalogue](https://standards.iteh.ai/catalog/standards/sist/f2d61b2d-6b37-466d-927a-715f1215b61d/sist-en-13803-2017)
  - [Superelevation formula](https://civilnotess.com/super-elevation-highway-design-formula-e-f-v2-127r/)

## 2. Roller-coaster force vector design (FVD)

- **The method:** specify vertical g, lateral g and roll along the track; integrate energy for speed, then the frame and
  the position.
- **Heartlining:** track = heart − h·up. The rider's head stays still through rolls (Stengel, 1976).
- **Tools:** FVD++/openFVD mix force and geometry sections and export to NoLimits 2. Pombo & Ambrósio model spatial
  track curves from splines with Frenet frames.
- **Not verified:** there is no primary Stengel publication; the descriptions are secondary.
- **Gives the builder:** a "force mode", where the user drags a g-profile and the geometry follows.
- **Sources:**
  - [Kopack, FVD Part II](https://iankopack.com/2021/05/12/force-vector-design-roller-coaster-centerline-modelling-part-ii/)
  - [Göteborg, Stengel](https://physics.gu.se/LISEBERG/eng/coasters.html)
  - [Coasterpedia](https://coasterpedia.net/wiki/Werner_Stengel)
  - [openFVD](https://github.com/altlenny/openFVD)
  - [FVD++ docs](http://lucasbosch.de/nolimits-tools/FVD++/older_versions/fvd++_0.5_documentation.pdf)
  - [Pombo & Ambrósio](https://www.researchgate.net/publication/264440523_Modelling_tracks_for_roller_coaster_dynamics)

## 3. Fairing: "flow" as optimisation

- **Two functionals:**
  - the elastica minimises ∫κ² ds;
  - Minimum Variation Curves minimise ∫(dκ/ds)² ds and reproduce circles and helices exactly.
- **(Mine):** at constant v, MVC is the integrated squared lateral jerk.
- **Levien:** G2 splines that are extensional and round must be built from Euler-spiral segments.
- **Closed curves:** discretise κ(s), minimise, and impose closure (§5).
- **Gives the builder:** a "fair" button, minimising Σ(Δκ)² + Σ(Δroll-rate)² under closure and pins; a jerk readout.
- **Sources:**
  - [Moreton & Séquin 1992](https://people.eecs.berkeley.edu/~sequin/CS284/TEXT/p167-moreton.pdf)
  - [Levien & Séquin 2009](https://people.eecs.berkeley.edu/~sequin/PAPERS/2009_CAD_Levien_Sequin.pdf)
  - [Levien thesis](https://levien.com/phd/thesis.pdf)
  - [Euler spiral history](https://levien.com/phd/euler_hist.pdf)

## 4. Frames on space curves

- **Frenet:** undefined where κ = 0, and it flips at inflections. A bad basis for roll.
- **Bishop / RMF:** parallel transport with zero twist, defined everywhere. The double-reflection method computes it
  cheaply and to fourth order. The discrete elastic rods paper stores the material frame as an angle relative to the
  Bishop frame.
- **Closed curves:** an RMF generally does NOT close. The holonomy must be absorbed by roll.
- **Gravity (yaw–pitch–roll) frame:** it is what the car feels, but it is singular at pitch ±90°.
- **Gives the builder:** store roll relative to the RMF so inversions are well defined, display it relative to gravity,
  and absorb the holonomy at closure.
- **Sources:**
  - [Bishop 1975](https://www.tandfonline.com/doi/abs/10.1080/00029890.1975.11993807)
  - [Wang et al. 2008](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/12/Computation-of-rotation-minimizing-frames.pdf)
  - [Bergou et al. 2008](https://dl.acm.org/doi/10.1145/1360612.1360662)

## 5. The closed track as periodic functions

- **The tangent:** from heading θ and pitch φ, T = (cos φ cos θ, cos φ sin θ, sin φ).
- **Closure:**
  - ∫₀ᴸ T ds = 0;
  - the net heading and pitch are 2π·k;
  - roll closes mod 2π, with the holonomy.
- **Least-norm correction:** δp = −Jᵀ(JJᵀ)⁻¹r, iterated. A weighted norm confines the correction to the regions the
  user is not editing.
- **Crane, Pinkall & Schröder:** a planar curvature flow kept closed by projecting onto the complement of {1, x, y}.
  (The constraint is as reported by a walkthrough; the primary PDF was not opened.)
- **Fourier:** elliptic Fourier descriptors close automatically but leave curvature uncontrolled. Fourier on κ(s) is the
  reverse.
- **Gives the builder:** "close the loop" as one projection step.
- **Sources:**
  - [Crane et al. 2013](https://dl.acm.org/doi/10.1145/2461912.2461986)
  - [walkthrough](https://kirilllykov.github.io/blog/2014/01/17/curvature-flow-in-curvature-space/)
  - [Kuhl & Giardina 1982](https://www.sci.utah.edu/~gerig/CS7960-S2010/handouts/Kuhl-Giardina-CGIP1982.pdf)

## 6. Swept surfaces, K, geodesics and the Jacobi metric

- **Gaussian curvature (textbook results, not fetched):**
  - a ruled cross-section has K ≤ 0, with K = 0 when the surface is developable;
  - a circular half-pipe of radius r swept along curvature κ is locally a torus, with
    K = −κ cos φ / (r(1 − rκ cos φ)). The inner half is hyperbolic and the outer half elliptic.
- **Splitting a path's curvature:** κ² = κ_g² + κ_n². Then κ_n·v² is the seat load, and κ_g·v² is what tyres and
  gravity must supply.
- **Jacobi metric:** frictionless trajectories are geodesics of (E − V)·g.
- **(Mine):** at 111 m/s the metric is nearly a constant multiple of the surface metric, and gravity bends a free path by
  at most g/v² ≈ 8×10⁻⁴ m⁻¹ (a radius of about 1.26 km or more). So the natural line is almost exactly a geodesic.
- **Zero-steer condition (mine):** κ_g·v² = the in-surface gravity component perpendicular to T.
- **Gives the builder:**
  - geodesic shooting for the natural line;
  - a K colour layer;
  - κ_n·v² and κ_g-residual plots.
- **Source:** [Jacobi–Maupertuis–Eisenhart](https://arxiv.org/pdf/1612.00375)

## 7. Interactive sculpting of parameter functions

- **Blender:** proportional editing applies a falloff kernel to control-point positions.
- **Coaster games:**
  - Planet Coaster: pieces, plus "smooth" and an auto-complete;
  - NoLimits 2 / FVD++: sections carrying roll and force functions, the closest existing thing.
- **Extrapolation:**
  - a linear κ gives an Euler spiral, which tightens to a point;
  - constant κ and τ give a helix, the natural "keep going" primitive.
- **Gives the builder:**
  - a brush Δp(s) = w(|s − s₀|/r)·Δ on κ, pitch rate or roll, followed by the closure projection;
  - "extend" holds each function's last value and slope.
- **Sources:**
  - [Blender manual](https://docs.blender.org/manual/en/2.81/scene_layout/object/editing/transform/control/proportional_edit.html)
  - [Planet Coaster 2 guide](https://www.planetcoaster.com/en-US/player-guides/coaster-ride-building)

## Tradeoffs

- **Transitions:** Bloss and sinusoidal beat the clothoid in software (no jerk step; staking out does not matter here).
- **Elastica vs MVC:** MVC and the Euler-spiral spline stay round, so use them for flow.
- **Frames:** store the robust one, display the felt one.
- **Intrinsic vs Cartesian editing:** intrinsic editing gives local flow control but non-local position effects.
  Closure projection is what makes it usable.

## What is genuinely unsolved or novel

1. **Surface-level force design.** Find a wide swept surface whose near-geodesic lines carry a prescribed g-profile.
   No prior art was found.
2. **Proportional editing of the intrinsic parameters of a closed 3-D track, with automatic least-norm re-closure.**
   The pieces exist separately; no tool combines them.
3. **Closing the frame through inversions** (RMF holonomy plus 2π roll wraps at the join). Standard mathematics,
   undocumented in any track tool.
4. **The numbers are beyond any standard.** Jerk, roll-rate and load thresholds for 20–90 g must be set by the keeper.
5. **Export to AC was not researched.** The geodesic line could seed the AI line.

## Librarian's notes (2026-09-28 00:1x)

- **§4's warning (the gravity frame is singular at ±90°) checked against the builder:** C's option-2 build carries the
  heading θ as integrated state. So left = H(θ) stays defined at exactly ±90°, and a loop-the-loop and a corkscrew test
  pass (`handback/p-d177-option2-C_2026-09-27.md` §2: "gravity frame at EXACTLY ±90° pitch: finite, orthonormal,
  right-handed"; 7/7 loop tests).
- **Still open:** whether a heading carried through a vertical loop stays meaningful for the user's banking display.
  This goes to the keeper with the design.
- **Item 1 is the heart of it, and the novel part:** designing the SURFACE so its natural lines carry the ride the
  keeper wants. R2's evaluator (design draft §9) is the forward half of that problem.
