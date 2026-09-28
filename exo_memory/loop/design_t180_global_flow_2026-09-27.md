# The track as geometry: global flow, surfaces, geodesics and grip. A design draft from the keeper's thinking, 2026-09-27 23:3x–23:4x (on D). Librarian. NOT BUILT: for the keeper's read before any pane builds it.

## The keeper's words, in order

1. 23:38: *"building these flowing tracks is a lot harder than just sequencing pieces together, its like crafting the
   global flow of the track all at once"*
2. 23:41: *"what about thinking about it from a purely mathematical standpoint, understanding the track to be a
   geometric value vs a physical object we are used to."*
3. 23:43: *"it isnt also just a single line that goes into the loop, that line has width that becomes the track, and
   then curves like a geodesic … sort of reminds me of hyperbolic geometry"*
4. 23:45: *"some tracks are sort of flatter, like look at thunderhead"*
5. 23:46: *"you can also change the friction value per track to change the feel of it!"*

## 1. The track is a set of periodic functions (the curve)

A lap is a closed framed curve γ(s), s ∈ [0, Λ). By the fundamental theorem of curves, it is determined up to a rigid
motion by functions of s alone:
- the heading rate κ_h(s) and the pitch rate κ_v(s) (in the builder's gravity frame, ruled 2026-09-27, option 2);
- the bank φ(s).

Every one of these is **periodic on the circle of length Λ**.
- **Flow is spectral.** Low frequencies are the global shape and rhythm; high frequencies are detail.
- FINDINGS §7's Sakura grammar (`sweep → turn → tight → turn → sweep`) says curvature changes in steps, never spikes,
  which is a spectral statement.
- **Pieces are local basis functions** (wavelet-like). A global editor shapes the low-frequency content. These are two
  bases of ONE function space, so the pieces built on 09-27 stay.

## 2. Physics as a constraint on the functions, and load-space design

Specific force along the path: f(s) = v(s)²·κ(s) − (the gravity term).
- **Inverse design:** draw the load profile wanted (the ride's rhythm) and a speed profile; solve
  κ = (f + gravity term) / v².
- The red/amber limits (FINDINGS §4–5: about 20 g where the suspension runs out, about 90 g proven) become bounds on
  that graph.

## 3. Closing the loop is a projection

A loop closes when a few integrals vanish (about 5 scalars):
- ∮ T ds = 0 (it returns to its start);
- the net heading is 2πk;
- the net climb is 0;
- the frame closes.

"Close the loop" becomes the **least-norm smooth correction** to the whole lap in a smoothness metric: spread
invisibly, not a connector patched onto the end. This also avoids Planet Coaster's documented closing spike
(ARCHITECTURE §2).

## 4. The track is a SURFACE: X(s, u) = γ(s) + the profile in the frame

- It has **Gaussian curvature K(s, u)**.
  - **K > 0** (elliptic): the road dishes the same way both directions.
  - **K < 0** (hyperbolic, saddle): a half-pipe or bowl sweeping through a turn, concave across and bent the other way
    along. **Parts of T-180 tracks are locally hyperbolic surfaces**, as the keeper felt.
- **Drivability:**
  - in K < 0 regions neighbouring geodesics diverge: entry errors grow, and the stretch is demanding;
  - in K > 0 regions they converge: forgiving, it funnels the car back to the line.

  A K colour layer is a map of where the track bites.

## 5. The line is nearly a geodesic, and why (CORRECTED 23:4x)

- A path's curvature splits into **normal curvature** (the surface pushing the car, felt as load, taken by the road)
  and **geodesic curvature** (sideways turning, which needs tyre grip).
- **Tyre grip supplies at most about μ × the normal load.** T-180 loads run from about 20 g (Thunderhead, FINDINGS §3c)
  to about 90 g (Centrifuge). So on high-load corners most of the turning must come from the surface: the line rides
  close to a geodesic of the surface. With gravity included, it is the geodesic of the speed-weighted (Jacobi) metric.
- **Flow, stated mathematically:** a near-geodesic exists that runs the whole lap at design speed without leaving the
  road.
- **Correction recorded:** at 23:43 I said T-180s "can barely turn by grip" because friction is 0.05. That 0.05 is the
  soft-collision CHASSIS friction (FINDINGS §4c), not tyre grip. Thunderhead's `data/surfaces.ini` has tyre-surface
  FRICTION 0.82 (checked on D). The conclusion survives on the load ratio, not on ice.

## 6. The style spectrum: Thunderhead to Centrifuge, and friction as a knob

- **Grip-and-bank (Thunderhead):** about 50% flat road (FINDINGS §1), p99 loads about 20 g, planar bank, K ≈ 0 (a
  developable ribbon), a larger geodesic share of the turning. A planar bank is tuned to one speed.
- **Surface-riding (Centrifuge, Sakura):** bowls and half-pipes, K swinging in sign, the line nearly geodesic. A bowl
  lets the car choose its height, and so its bank, at any speed.
- **Style measure:** the ratio of geodesic to normal curvature along the racing line, as a profile per track.
- **Friction is a design handle** (keeper, 23:46):
  - μ bounds the admissible geodesic curvature;
  - per track, and per painted stretch through AC's surface keys (`[SURFACE_n]` per mesh name), so grip can vary along
    the lap;
  - the chassis collision friction is a separate knob (the soft-road feel).

## 7. What the program becomes (proposal, for the keeper to rule)

1. **Global level:**
   - sketch the lap overhead as one curve;
   - shape elevation as a profile;
   - paint cross-section, bank and friction along s;
   - the program fairs everything, curvature, loads and the line, and shows the load rhythm as a graph;
   - closure by projection.
2. **Local level:** the build head and pieces, for detail. Every local edit re-flows into the global functions.
3. **New checks and layers:**
   - the design-speed geodesic line drawn on the road, turning RED where it leaves the road;
   - a K (forgiving/demanding) layer;
   - the geodesic-share (style) profile;
   - the load-rhythm graph;
   - load-space design as an input mode.
4. **The style dial** (Thunderhead ↔ Centrifuge): the defaults, fonts, friction and red limits follow it.

## 8. Checkable before anything is built (measurements from files; no AC launch)

- **M1, the spectrum:** κ_h, κ_v and bank as functions of s from `read_track.cjs` for every T-180 layout on D, plus the
  two normal circuits; their spectra. **Prediction:** T-180 tracks share a spectral signature (falloff and load-rhythm
  period) distinct from the normal circuits. **It fails if** the T-180 spectra are no closer to each other than to the
  normal circuits.
- **M2, the geodesic share:** from the T-180 replays (blackbox's parser), split the car's path curvature into geodesic
  and normal against the road surface. **Prediction:** the share tracks load (small on Centrifuge's high-g corners,
  larger on Thunderhead). **It fails if** the geodesic share does not fall as load rises.
- **M3, K on the meshes:** discrete Gaussian curvature (angle defect) on Sakura's and Centrifuge's road meshes, with a
  map of the hyperbolic regions against the corners.

## 9. The keeper, 23:48: "I wonder if it is even posssible to create this intelligent system that understands the nuance with awareness how to generate these tracks. We might need to research more with what we already know about how assetto works"

**The layers:**
1. AC's physics: what decides drivability;
2. the measured corpus;
3. the keeper's feel, learnable only from his labels;
4. **the EVALUATOR**, the hard layer: predict how a T-180 rides a given surface without launching AC.

A generator is a search once 4 exists.

- **R1, research:** how AC and CSP decide what a car does on a surface.
  - Tyre contact against the physics mesh, and how normals come from triangles; seams.
  - The soft-collision block; CSP's wall raycasting.
  - The T-180 car's open config (github.com/ohyeah2389/Assetto-T-180: suspension, aero, the turbine script).
  - Written with sources, as a model of drivability; unverified items marked.
- **R2, the evaluator prototype:** a rider that follows the near-geodesic under load and grip limits.
  - It is calibrated ONLY on geometry.
  - **The test (registered here):** from Sakura's geometry alone, predict the line and loads of a real Sakura replay
    (blackbox's parser) within tolerances stated before the run. Then Centrifuge. Then Thunderhead, the grip-heavy case.
  - **It fails if** the predicted line leaves 25 m of the replay's line on more than 10% of the lap, or the predicted
    p50/p99 loads miss the replay's by more than 25%.

## 10. The keeper, 00:11 (09-28): sculpt from a base loop, and extend by extrapolation

*"what about starting from a base track flat track, and then like blender, being able to sculpt the track, then extend
it outward from where it needs to go say like you make a curve, you can continue to extrapolate it out and then change
it when the curve or spiral is over … when you research, it has to do with mathematics and how that relates to the
tracks vs researching how to make a track. Like, AHHH idk if this is possible"*

- **The base loop:** a flat circle has constant κ_h, κ_v = 0 and φ = 0.
- **The sculpt brush:** an operation on the functions over an s-window with soft falloff. It is Blender's proportional
  editing in s-space.
- **Extend:** carry κ forward along its trend (constant κ is a circle; a linear κ is a clothoid, the Euler spiral)
  until the user ends it with an ease-out.
- **Research redirected to the MATHEMATICS**, by the librarian's own research agent (not a pane):
  - rail and highway transition curves and cant;
  - Stengel's force-vector coaster design;
  - elastica and minimum-variation fairing;
  - Bishop frames;
  - periodic representations and closure;
  - swept surfaces, geodesics and the Jacobi metric;
  - parameter-space sculpting.

  Output due into `research/` with sources.

## 11. The keeper, 00:17: "BE like water"

*"Think of it like this as well, fluid dynamics through a pipe as well, usually flowing like water is the best lines, and
also the best way to make a t-180 track, BE like water"*

- **One principle, from four sides:**
  - water in a bend climbs until its free surface tilts at tan θ = v²/(gR), the balanced bank. Water finds zero cant
    deficiency by itself;
  - a free stream takes the least-action path, which is the geodesic of the Jacobi metric (research §6);
  - smooth flow has no separation, i.e. no jerk (research §3);
  - so the water line = the natural line = the near-geodesic = zero cant deficiency.
  - **"Be like water" is the design rule.**
- **What water reads off a track:**
  - separation and splash mark kinks;
  - converging streams mark K > 0 (forgiving);
  - spreading streams mark K < 0 (demanding);
  - spilling over the lip means the wall is too low or the bank too shallow for the speed. That is a better RED than
    a load number.
- **The feature, "pour water down the track":** a particle sheet across the width at design speed rides the surface
  with gravity and no steering, drawn in the preview. **It is R2's first form,** checked against the replays: does
  Sakura's water run where the real T-180 drove?
- **Where the analogy breaks:**
  - water has pressure, viscosity and interaction; a car has grip, aero and a driver;
  - it holds at the single-free-particle level, which is the geodesic level;
  - grip-heavy tracks (Thunderhead) depart from it most.
- **A research agent is sent** to bobsleigh/luge, water-slide and open-channel design (superelevation, supercritical
  bends, particle trajectories). Output due into `research/`.

## 12. The track as ONE equation, and reverse-engineering the known tracks (the keeper, 00:25 and 00:29)

*"what about a system, that just makes the whole track one shot. It would allow you to map out the entire track as an
equation????"* then *"can you reverse engineer the equations for the tracks we know? Then we would have exampls to work
off of"*

- **The equation.** Each periodic function (heading rate, pitch rate, bank, width, the cross-section parameters,
  friction) is a Fourier series along s. The heading rate's constant term 2π/Λ fixes one full turn. A whole lap is a
  coefficient list.
  - **Generate in one shot:** by hand (sliders on the low coefficients), by sampling from the library's spectra (M1), or
    by optimising toward a load rhythm.
  - **Close** by the projection step. **Test** by pouring water.
  - **Local terms** (jumps, abrupt features) sit on top of the smooth series.
- **M4, "the length of each track's equation" (registered here, before any fit):**
  - For every T-180 layout in `reads/` (13, as in M1), fit each function with an increasing number of Fourier terms N.
  - Rebuild the centreline and frame from the fitted functions (the builder's own geometry core), with the closure
    projection.
  - Report, per track, the smallest N at which the rebuilt line stays within **5 m** of the read line on ≥ 95% of the lap
    and the bank within **5°** on ≥ 95%.
  - **Prediction:** N ≤ 200 per function for most tracks (the smooth-equation idea holds). **It fails if** most tracks
    need N > 1,000, or never converge because jumps and discontinuities dominate. In that case the local terms are the
    main representation, not the series.
- **The examples stay LOCAL.** An equation that rebuilds Sakura within 5 m IS Sakura's layout, another author's work.
  - The coefficient files live in `reads/` (gitignored) on the keeper's PC, as examples to work from and to load into
    the builder.
  - The public repo gets only the summary per track (N, error, spectrum shape), never the coefficients.
  - Sharing a derived equation needs the keeper's stance on other authors' work (ARCHITECTURE §11.6).

## 13. Results so far (scored against §8 by the librarian, 2026-09-28 03:0x)

- **M1 (E, p-d182-m1-E): PASS.** W 0.808 < B 1.215 (B/W 1.50); robust to the choice of circuit pair.
  - Limits: the separation is mostly vertical (the circuits are flat); turning alone is weak (B/W 1.13); there is no
    rhythm peak (the dominant wavelength sits at the band edge, 512 m).
- **M2 (C, p-d182-m2m3-C): PASS, WEAKENED.** Pooled ρ(load, geodesic share) = −0.50, CI [−0.563, −0.433]; it holds on
  every replay (−0.41 to −0.56). The per-bin median share falls monotonically: 0.925 → 0.029 from < 3 g to ≥ 40 g.
  - At ≥ 40 g the car turns almost entirely by the surface.
  - **The weakness, named by C after the run:** load along N contains v²κn, so a falling share with rising load is
    partly the same fact twice. The registration missed this coupling.
  - The clean version (bin by speed, or by the surface's own κn) is owed, NOT run.
- **M3 (C): FAILS AS REGISTERED.** Sakura passes (K < 0 area 14.4% in corners vs 5.9% on straights). **Centrifuge fails
  (18.0% vs 21.0%).**
  - **The design's "parts of T-180 tracks are locally hyperbolic" claim is not supported as registered.**
  - C's own inference (both signs rise in corners) holds for K > 0 on both tracks, and for K < 0 on Sakura only.
  - Limit: per-vertex K is dominated by triangulation texture (5.9–21% K < 0 even on straights). A smoothed K over a
    few metres is owed, NOT run.
  - **The FAIL stands. A re-measure is a NEW registration, never a rescue of this one.**
- **M2b (C, p-m2b-m3b-C; NEW registration `loop/m2b_m3b_registration_2026-09-28.md`, digested before any code): PASS,
  clean.** ρ(speed, geodesic share) = −0.478 [−0.536, −0.419]. The confound check makes it stronger in tighter curves:
  ρ = −0.32 / −0.56 / −0.74 by |κ| tercile. **The faster the car, the less it turns by grip, without the load coupling.**
- **M3b (C): FAILS, in the OPPOSITE direction.** K smoothed at the scored radius (6 m):
  - T-180 corners carry LESS K < 0 area than straights: Sakura 20.7% vs 31.6%, Centrifuge 16.3% vs 24.1%;
  - they carry MORE K > 0 area: Sakura 78.8% vs 63.0%, Centrifuge 83.5% vs 73.4%.
  - **Corners are ELLIPTIC (dished, sphere-like), not hyperbolic.** In the geodesic picture (§4), elliptic regions make
    neighbouring lines CONVERGE: corners funnel the car back to its line.
  - The pane's inner-half inference also fails (43.5%, 10.0%).
  - At r = 12 m Centrifuge flips; that radius was not scored, and reads as sensitivity, not rescue.
  - **The "locally hyperbolic" claim (§4, and the librarian's 23:4x wording to the keeper) is REFUTED for corners on
    both tracks.** WRONG, mine, as a claim; it was the keeper's intuition that I dressed as geometry without a check.
