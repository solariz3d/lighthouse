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
