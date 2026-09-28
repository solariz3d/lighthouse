# M2b and M3b: a NEW registration, pane C, 2026-09-28 (the chair's queue after M2/M3 were scored in design §13)

Written BEFORE any M2b or M3b code exists or runs. This is not a rescue of M2 or M3, whose verdicts stand as scored:
- M2 PASS, WEAKENED;
- M3 FAILS as registered (p-d182-m2m3-C §0, sha256 e71c5555ecd1cb04).

This file is not edited after the first run. A change becomes a dated AMENDMENT at the bottom, saying what and why. Runs are
under the heavy-run lock with `--max-old-space-size=4096`. Numbers only go into FINDINGS; no image enters the repo.

## M2b: the geodesic share against SPEED
**Why speed and not κn.** The share is g = κg/|κ|, and |κ| = √(κg² + κn²) contains κn. Binning g by κn is therefore as
circular as binning it by load (load's curving part is v²κn), so κn is REJECTED as the axis. Speed does not appear in g at all.

**Physical reason, stated as the prediction's ground:**
- The in-plane (geodesic) turn needs grip: κg·v² ≤ a_max, the in-plane acceleration the tyres give.
- So the largest geodesic curvature a car can hold falls like 1/v².
- The normal curvature is the surface's and needs no grip, since the road pushes.

**Prediction:** the faster the car, the smaller the share of its turning done within the surface.

**Data and frames:** exactly as M2 (tools/geodesic.cjs's frames: the same five readable replays, the same smoothing, the same
filters: speed ≥ 30 m/s, |κ| ≥ 1/3000 m⁻¹), with speed |v| taken on each kept frame.

**Bins (m/s):** [30, 60), [60, 90), [90, 120), [120, 150), [150, 180), ≥ 180.

**THE SCORED STATISTIC:** Spearman ρ(speed, g) over all kept frames, pooled; 95% CI by moving-block bootstrap (blocks of
250 frames within a replay, 1,000 resamples, seed 1).

**PASS iff all three:**
1. the CI lies entirely below 0;
2. ρ(speed, g) < 0 on at least 4 of the 5 replays alone;
3. over bins holding ≥ 300 frames, the median g never rises by more than 0.02 from one bin to the next.

**FAILS if any of the three fails.**

**Named in advance as the confound:** speed and corner type co-vary on a track (tight corners are slow). Reported beside it,
not scored: ρ(speed, g) within the frames of each |κ| tercile, so a pass carried only by "slow corners are tight" is visible.

## M3b: K smoothed over a disc, before any sign is counted
**Method:**
- The meshes, welding, interior vertices and per-vertex angle defect δ and area A are exactly as M3 (tools/meshcurv.cjs).
- **SMOOTHING, before any sign:** at each interior vertex i, K̄(i) = Σ δ_j / Σ A_j over the interior vertices j within a
  Euclidean ball of radius r around vertex i. This is the Gauss–Bonnet mean curvature of the patch.
- **The scored radius: r = 6 m.** Road triangles are 1.6–2.3 m on these meshes (FINDINGS §6), so a 6 m disc holds several
  dozen triangles.
- Reported beside it, not scored: r = 3 m and r = 12 m.
- **Flat:** |K̄| < 1e-6 m⁻² (a principal-radius product above 1 km²), which counts as neither sign.
- **Stations, |k|, corners (|k| ≥ 1/500) and straights (|k| < 1/1500):** exactly as M3.

**Prediction** (design §4): K < 0 concentrates in the corners.

**THE SCORED STATISTIC** (at r = 6 m, per track):
- Spearman ρ(|k|, station K̄ < 0 area share) over stations holding ≥ 20 interior vertices;
- its 95% CI by moving-block bootstrap (blocks of 25 stations, 1,000 resamples, seed 1).

**PASS iff, on BOTH Sakura and Centrifuge:**
1. the CI lies above 0;
2. the K̄ < 0 share on corner stations is greater than on straights.

**FAILS otherwise.**

**The pane's own inference, registered and scored separately.** A dished road turning about a vertical axis is locally the
inside of a torus tube: the half nearer the turn's centre is K < 0, and the outer half is K > 0.
- **Test:** on corner stations, the inner half (the side the road turns toward: u > 0 for k > 0, with u along the reader's
  left, cross(f, n)) carries more K̄ < 0 area than the outer half.
- **PASS iff that holds on more than 60% of corner stations on BOTH tracks.**

**Named in advance as a way M3b can mislead:** if straights still carry ≥ 10% K̄ < 0 area at r = 6 m, the smoothing has not
removed the mesh texture. The result is then reported as "not separated from mesh texture at 6 m" beside its verdict. The
verdict is still scored as written; the radius is not changed after seeing it.
