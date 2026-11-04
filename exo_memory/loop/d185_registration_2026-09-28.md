# D185 REGISTRATION · tests 2–5 of the new core, with exact numbers (pane B, 2026-09-28, sealed BEFORE any D185 code lands)

**Master:** `exo_memory/loop/spec_t180_equation_core_2026-09-28.md` (fd5b06c), "How we know it works" and GO §1–§6.
**Base:** t180 origin/main 77cdb5e.

**Measured through the ADAPTER wherever possible.** GO §6 says the core emits path samples
`{ s, pos, T, L, U, kvec, roll, bankG, grade }`, so geometry is judged from those samples, and from positions recomputed by the
skill's own formulas.
- Channel values (κh, κv, φ, w, r) are read through whatever evaluation function the document exposes. The reader names it.
- Units: metres, radians, seconds. g = 9.81 m/s².

**Sealed with this file** (all in `exo_memory/loop/d185/`, sha256 in the hand-back):
- `gen_tracks.js`, and its output `gen_tracks.json` (the 20 random tracks of test 4, and test 3's base track);
- `water_theory.js`, and its output `water_theory.json` (test 5's theory, computed now from references/06 §7).

**A reader first re-runs both scripts and checks the outputs are byte-identical to the sealed JSON; otherwise the test is void.**

**The formulas used here, and where they come from** (the skill's `references/`, at 77cdb5e):
- **02 §3, discrete curvature from three points:** κᵢ ≈ ∠(pᵢ − pᵢ₋₁, pᵢ₊₁ − pᵢ) / ((|u| + |w|)/2).
- **02 §4, the clothoid:** κ(s) is linear in s; and the Bloss smoothstep S(u) = 3u² − 2u³.
- **06 §7, the frictionless particle on a graph:** q, D, ẍ = −f_x q/D, z̈ = −f_z q/D, and N/m = q/√D.
- **05 §1:** energy along a frictionless path.
- **NOT on the shelf yet, and so DERIVED here from 06 §7 (derivation in §5):**
  - the banked-turn balance speed v² = gR·tanθ;
  - the constant-acceleration spill estimate.
- **The quintic smoothstep** (GO §3's brush falloff) is not on the shelf either. Test 3 does not depend on its formula, only on its
  C2 property, which it measures.
- Per the spec's rule, the builders add any formula they use to `references/`, with its source, first.

---

## TEST 2 · EXTEND: a continued curve keeps its law (GO §2, "with no handle touched")
**Setup.** A document whose last piece has a known law. The core's extend is called with NO handle touched, and the new piece is
judged from its adapter samples at ≤ 1 m spacing.
- Curvature is computed from the samples' POSITIONS by 02 §3, at 1 m chords.
- It is also read from the adapter's `kvec` (|kvec|). **Both must pass.**

**2a · The circle.** The last piece is a circle: κh = 1/R constant, κv = 0, φ = 0, length 300 m. It is extended by 500 m, with no
handle, **for R ∈ {50, 200, 1000} m, turning left AND right** (6 cases).
- **PASS, every case, every interior sample of the extension:**
  - |κᵢ − 1/R| / (1/R) < **1%**, by BOTH measures;
  - R̂ = 1 / mean(κ) has |R̂ − R| / R < **1%** (the spec's "radius error < 1%");
  - the extension stays level: every sample's height is within **0.01 m** of the join's height;
  - the heading at the join is continuous: the tangent angle between the last old sample and the first new one is below
    **1e-6 rad** beyond the circle's own turn over that step.
- **FAIL:** any case breaks any of these. In particular, a continuation that relaxes toward straight (κ decaying), or that
  overshoots.

**2b · The clothoid.** The last piece is a clothoid: κh(s) = s/A² from 0 to 1/200 m⁻¹ over 400 m, so A² = R·L = 80,000 m²
(02 §4); κv = 0, φ = 0. It is extended by 200 m, with no handle, **left AND right** (2 cases).
- **THE MEASURE:** over the extension's interior samples (s′ = distance past the join, 1 m chords):
  - fit κ(s′) = a + b·s′ by least squares (03 §2 normal equations). The slope and the residual are the measure; both κ sources.
- **PASS:**
  - **slope:** |b − 1/A²| / (1/A²) < **1%** (1/A² = 1.25e-5 m⁻²);
  - **intercept (continuity):** |a − 1/200| < **1e-5 m⁻¹**;
  - **shape:** max |κ(s′) − (a + b·s′)| < **1% of the extension's κ range** (1% × b × 200 m = **2.5e-5 m⁻¹**), with a floor of
    **2e-6 m⁻¹** for the chord discretisation.
- **FAIL:** any of these missed, in either case. That includes a continuation that holds κ CONSTANT (a circle, not a spiral: the
  slope error would be 100%), or one that keeps growing at a rate other than 1/A².

## TEST 3 · SCULPT: local, bit for bit outside, no kink (GO §3)
**Base track:** `gen_tracks.json` track 0 (11 pieces, 4,100 m), built with the core's extend, piece by piece, as listed. It is left
OPEN (not closed), so no closure solve can move anything.

**The brushes (30):** each of the 5 channels × s₀ at 25%, 50% and 75% of the length × radius r ∈ {20, 100} m, each applied
alone to a fresh copy of the base, with:
- Δ(κh) = +0.002 m⁻¹;
- Δ(κv) = +0.001 m⁻¹;
- Δ(φ) = +10° (0.17453 rad);
- Δ(w) = +5 m;
- Δ(r) = +0.5 of that channel's own unit per metre (the reader records the unit A's document uses).

**THE WINDOW.** W = [s₀ − r, s₀ + r]. Because a cubic B-spline control point has support over 4 knot spans, the region that CAN
change is W⁺ = W widened by **2 knot spans on each side**, using the document's local knot spacing h (read from the document and
recorded).

**3a · BIT FOR BIT outside.** Checked on the adapter's samples and on the document's control points.
- **Control points** whose support does not meet W: `===` their old values, in every channel (no tolerance: identical doubles).
- **Channel values** at every adapter sample with s outside W⁺: `===` the old values.
- **Geometry:**
  - **Brushes on φ, w, r** (which do not move the centreline): every sample outside W⁺ has `pos`, `T`, `L`, `U`, `kvec`, `roll`,
    `bankG` and `grade` all `===` the old values.
  - **Brushes on κh, κv:**
    - every sample BEFORE W⁺ is `===` the old;
    - the samples AFTER W⁺ must be the old ones moved RIGIDLY. For every pair i, j of after-samples taken every 10 m, | |pᵢ − pⱼ| −
      |pᵢ′ − pⱼ′| | < **1e-6 m** (distances preserved ⇔ rigid; no fitting needed).
- **FAIL:** any single double differs where it must be identical, or any after-pair's distance changes by ≥ 1e-6 m.

**3b · NO KINK across the brush edges** (the four points s₀ ± r and the two edges of W⁺).
- **Channel continuity (C0 and C1).** δ = 1e-4 m:
  - the value jump |f(e + δ) − f(e − δ)| < **1e-9 × |Δ|** beyond what the slope explains;
  - the one-sided derivatives (f(e ± 2δ) − f(e ± δ))/δ differ by < **1e-4 × max |f′ − f′_old|** over W (the bump's own steepest
    slope). Unit-free.
- **Geometric (curvature continuous).** Take the 02 §3 discrete κ from positions at 0.5 m chords. Within ±5 m of each edge, the
  largest step between consecutive κ samples must be ≤ the largest such step inside W's middle half (where the bump is steepest):
  the edge is no rougher than the brush's own interior.
- **FAIL:** any edge breaks either rule, on any of the 30 brushes.

## TEST 4 · CLOSE: < 1 cm after one click, on 20 random tracks (GO §4)
**The generator:** `gen_tracks.js`, **seed 185** (mulberry32), 20 tracks.
- Each track: 6–12 pieces, each 150–600 m long.
- Targets per piece, uniform:
  - κh ∈ [−1/150, 1/150] m⁻¹;
  - κv ∈ [−1/3000, 1/3000] m⁻¹;
  - φ ∈ [−35°, 35°];
  - w ∈ [25, 35] m.
- Each piece goes from the previous end to its targets by the Bloss ramp (the extend primitive).
- Then the heading targets are scaled so the net heading is 2π(1 + ε), with ε ∈ [−0.1, 0.1] per track (a user's nearly-closed loop),
  and the pitch targets are shifted to zero net pitch change.
- The start is level, straight and 30 m wide. The output is `gen_tracks.json` (lengths 1.9–4.7 km).

**Procedure:** build each track with the core's extend. The LAST piece is the "stretch edited last". Then call the core's close
ONCE.

**PASS, on ALL 20** (19 of 20 is a FAIL):
- **position:** |pos_end − pos_start| < **0.01 m**;
- **direction:** the angle between T_end and T_start is < **1e-3 rad**;
- **frame:** the bank at the end equals the start's within **0.1°** (mod 2π), and L_end · L_start > cos(1e-3);
- **the user's work is not moved:** the change to the LAST piece's control points is ≤ **10%** of the total control-point change
  (in the channels' own units, per channel: ‖ΔcLast‖ / ‖Δc_all‖ ≤ 0.10);
- **honesty:** close REPORTS its residual. A close that returns without convergence must say so; a silent non-converged return is a
  FAIL even if a later check happens to pass.

**FAIL:** any track misses any bound. Or close takes more than one call. Or it errors, or it reports convergence it did not
reach. (The checks re-measure it from the adapter samples, not from close's own report.)

## TEST 5 · WATER: the textbook banked circle (GO §5)
**Surface:** a closed FLAT banked circle: centre radius **R = 500 m**, width **30 m** measured along the surface, flat
cross-section (no rise, no dish), level (no climb), bank θ constant. Built by the core, and emitted through the adapter.

**Particles:** at lateral offsets **d₀ ∈ {−14, −7, 0, +7, +14} m** along the surface (outward +). Each starts with its velocity
tangent to the circle through its start point, at speed **v**. The spec's water: frictionless, gravity, RK4 in 3-D projected onto
the surface each step, with N < 0 as lift-off and beyond the edge as a spill.

**THE THEORY** (`water_theory.js`, sealed, run before any water code). It is the skill's 06 §7 law, integrated in its GRAPH form on
the cone f(x, z) = tanθ·(√(x² + z²) − R), with fixed-step RK4 at dt = 1e-4 s: a different form and a different integrator from the
core's, so agreement is evidence.

**The balance speed, DERIVED from 06 §7.** On the cone, at radius R moving tangentially at v:
- f_r = tanθ;
- the tangential second derivative is f_r / R (the level circle's curvature);
- so q = g + v²·tanθ/R, and the radial acceleration is −tanθ·q/(1 + tan²θ).

Setting that equal to −v²/R gives **v² = g·R·tanθ** (the textbook banked turn).

**5a · BALANCED:** θ = **45°**, v = √(gR tan45°) = **70.0357 m/s (252.1 km/h)**, for one lap (3,141.593 m).
- The theory: the centre particle keeps d = 0.0000. The others swing but stay on the road: −14 → [−14, −4.69]; −7 → [−7, −2.34];
  +7 → [2.33, 7]; +14 → [4.65, 14]. N/g ≥ 1.40 for all 5, and there is no spill.
- **PASS:**
  - **the centre particle rides one height:** |d| ≤ **0.10 m** for the whole lap (so its height stays within 0.10·sin45° = 0.071 m);
  - **no particle spills** (|d| < 15 m throughout), and **none lifts off** (N > 0 throughout);
  - **each off-centre particle's lateral range** matches the theory's [dMin, dMax] within **±0.5 m**;
  - **energy:** ½|v|² + g·height is conserved within **0.5%** over the lap, for every particle (the spec's integrator check; the
    theory holds it to 1e-13).
- **FAIL:** any of these. That includes the centre particle drifting more than 0.10 m, which would be the integrator or the
  projection failing on the one case with a known exact answer.

**5b · TOO SHALLOW:** θ = **10°** at the SAME v = 70.0357 m/s (balance at 10° would need √(gR tan10°) = 29.41 m/s).
- **The theory** (06 §7, integrated): EVERY particle spills over the OUTER lip, at these centreline stations:

| d₀ (m) | −14 | −7 | 0 | +7 | +14 |
|---|---|---|---|---|---|
| spill station (m) | 187.24 | 163.02 | **134.56** | 98.23 | 34.72 |
| time (s) | 2.702 | 2.363 | 1.959 | 1.437 | 0.510 |

- **Cross-check, closed form** (the constant lateral acceleration from 06 §7 at the start):
  - a_lat = (v²/R)·cosθ − g·sinθ = 7.9575 m/s²;
  - t = √(2·15 / a_lat) = 1.9417 s;
  - station ≈ v·t = **135.99 m**, within 1.1% of the integrated 134.56.
- **PASS:**
  - every particle spills, on the **OUTER** side;
  - each spill station is within **±5% or ±5 m (whichever is larger)** of the table: the centre particle in **[127.83, 141.29] m**;
  - the spill is flagged RED by the water tool;
  - no lift-off before the spill (the theory's N/g ≥ 1.13).
- **FAIL:** any particle spills inside, or never spills, or spills outside its band, or the red flag is missing.

**Shocks (paths crossing) are REPORTED, not judged, in 5a and 5b.** The textbook cases say nothing about crossings between
particles started at different offsets, so no number is registered for them.

---
**Sealed by B.** The time and sha256 are in `exo_memory/handback/p-d185-reg-B_2026-09-28.md`. Any change after the seal is a NEW
dated amendment, never an edit to this file.
