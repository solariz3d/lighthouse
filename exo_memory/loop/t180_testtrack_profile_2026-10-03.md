# The T-180 test track's cross-section, measured (pane C, D223, 2026-10-03, on D)

Plan: `loop/plan_t180_testtrack_profile_2026-10-03.md`. Track: the T-180 author's own test track
(`ohyeah2389_t180testtrack`, read-only, nothing written to the AC install, no AC launch). **This file holds derived summary numbers and
methods only.** The raw extraction, the per-section values and the plots are in
`C:\Users\nname\Desktop\t180-track-builder\reads\testtrack_profile_2026-10-03\`, which is git-ignored there
(`git check-ignore -v` → `.gitignore:1:reads/`).

## The answer

**The real profile is TWO zones, but they are joined by a CREASE, not a smooth curve.** Across the half-width:
- a nearly flat middle, ψ ≈ 3° at u = 0.26 and ≈ 5° at u = 0.50;
- a jump of about 10° in one 0.02-wide step at **u ≈ 0.64**;
- a steep outer band at **ψ ≈ 19–20° from u ≈ 0.66 to 0.88**;
- then a **lip that rolls back by about 9°** over the last ~10% (ψ ≈ 10.7° at the edge).

That shape holds on straights and turns alike, and it is **symmetric**: the outside of a turn is not steeper than the inside.

Neither smooth model fits it:
- **By the decision rule registered before the run, the track is "one curve"**: only 72 of 1,912 sections met the two-zone bar.
- Both models leave a median **~5° RMS**, because the real section is a polygon of flat facets (median 4 a side). Neither a smooth
  cup nor a smooth G = t² edge term can follow those steps.
- The edge-curve model's best smooth fit puts the slice at s ≈ 0.88 with **e ≈ −7°**. That negative e is fitting the rolled lip, not
  a flatter edge band.

**For the edge-curve seal, read the facets, not the fit.** The real track's middle-to-outer transition sits at s ≈ 0.64 (by half-width,
measured from the centre). The extra angle there is about +15°: ~20° outer against ~5° inner, against a cup whose shape is ~15.5° at
u ≥ 0.75. And it is a KINK, not G1/G2-smooth. The keeper's smooth edge curve is therefore a smoothed version of what the author built,
not a copy of it.

## Numbers (all from `summary.json`, `facets.json`, `paired.json` in the reads/ folder)

**Coverage:**
- The walk (`tools/read_track.cjs`, unchanged, `READ_PROFILE=1`) closed its lap at **7,852 m** with 1,932 stations every 4 m and 1 jump.
  (`ui_track.json` claims a length of 50,000 m.)
- **1,912 sections** were cut (stations within 30 m of the jump excluded) and 1,912 fitted.
- **Classes by |k|:** straight 284 (|k| < 0.0003 rad/m), turn 1,381 (|k| > 0.001), between 247.
- **Road mesh:** `1ROAD_TrackTop_Metal*`, 285,596 triangles.

**Fit errors (median RMS of ψ in degrees; p10–p90 in brackets), registered models, all 1,912 sections:**

| | cup-only | two-zone (G = t²) | two-zone with G = t (kinked) |
|---|---|---|---|
| all | 5.00 (3.50–7.33) | 4.65 (3.31–7.15) | 4.62 |
| straight | 4.98 | 4.38 | 4.29 |
| turn | 5.01 | 4.76 | 4.74 |

**Two-zone counts:**
- Sections meeting the bar (two-zone RMS ≤ 0.7 × cup-only AND ≥ 0.5° lower): **72 of 1,912** (straight 25, turn 22, between 25).
- Sections where BIC prefers two-zone: 529 of 1,912. The points are correlated, so BIC is lenient here.

**Fitted parameters:**
- **Cup-only:** the best family is bowl in 1,406 sections, flat in 394 and half-pipe in 112. Median c = 16.5°.
- **Two-zone:** median s = 0.88 (range 0.30–0.96); median e = −6.7° (range −54 to +39).
- **G = t² vs G = t:** G = t² beat G = t in only 271 of 1,912 sections. So where the edge differs, a kinked join fits slightly better
  than a smooth one.

**Facet structure.** This analysis was exploratory: it was written after seeing the first plots. It uses 1,320 sections whose width is
within 0.7–1.3 × the median of 27.48 m; the other 592 are cuts through wide junctions or narrow points. Medians, with p10–p90 in
brackets:

| | u = 0.26 | 0.50 | 0.76 | 0.90 | 1.00 (edge) |
|---|---|---|---|---|---|
| ψ, all 2,640 sides (°) | 2.9 | 4.9 | 19.4 | 18.9 | 10.7 |
| straight sides | 2.9 | 4.9 | 19.4 | 19.3 | 10.6 |
| turn, outside | 3.0 | 5.0 | 19.5 | 19.0 | 10.7 |
| turn, inside | 2.8 | 4.8 | 19.1 | 18.7 | 10.6 |

- **Facets per side:** 4 (4–6).
- **The steepest facet** runs from u = 0.66 (0.64–0.80) to u = 0.88 (0.80–0.90), at a peak ψ of 20.0° (16.1–24.6).
- **The jump:** the largest single-step rise is 10.1° (7.5–10.6), at u = 0.64 (0.62–0.64). The halfway crossing is also at u = 0.64.
- **The lip:** it rolls back by 9.1° (8.5–12.1) over the last ~10%.
- **Symmetry, paired per turn section (920):**
  - outside minus inside, peak ψ: **+0.02°** (−7.7 to +8.4);
  - outside steeper by more than 1° in 402 sections, inside steeper in 385;
  - at u = 0.76: +0.23°; at the edge: −0.10°.
  - So there is no outside-steeper pattern. Side-to-side differences of ~5° exist, but in both directions.
- **Lip-excluded refit** (u ≤ 0.90, the same models; exploratory): cup-only 4.98° and two-zone 4.17°, with s ≈ 0.32 and e ≈ +14°
  (positive in 1,316 of 1,320 sections). Only 15 sections meet the bar. A smooth t² term spread from s ≈ 0.3 is how a smooth model
  approximates a crease at 0.64.

## Method

1. **The walk:** the repo's `tools/read_track.cjs`, unchanged. It reads the road mesh (surfaces.ini valid keys plus ROAD, never PIT),
   walks from AC_START_0, re-centres every 4 m, and gives each station's centre, forward vector, normal and curvature k. The track's
   `ai\` folder is empty, so no AI line was used.
2. **Each section** (`sections.js`):
   - walk the road surface from the station centre, perpendicular to the path, in 0.5 m steps;
   - stop at the edge: no road surface, or a fold of more than 20° in one step;
   - θ = the local normal's rotation about the path direction, relative to the centre normal;
   - re-centre on the arc midpoint and subtract θ there (bank removed);
   - ψ on each side is + where the surface rises outward; u = arc distance / half-width, sampled at 0.02 steps.
3. **The models:**
   - cup-only = c × the D190 `cupProfile` shape (F_i / F_edge at u = 0.25, 0.5, 0.75, 1, linear between; best of bowl, half-pipe and
     flat);
   - two-zone = the same plus e × G((|u| − s)/(1 − s)) for |u| > s, with G = t²;
   - (c, e) by least squares, s on a 0.02 grid from 0.30 to 0.96, symmetric.
4. **Registered before the run** (`sections.js` sha256 `ea8ad6e1204b38a8…`, hashed before it first ran): the two-zone bar, the
   track-level majority rule, the straight/turn |k| cut-offs, the asymmetric fit, and the t² vs t comparison.
5. **Exploratory, after the plots:** `facets.js` (sha256 `e8f976e25a595b06…`) and `paired.js` (sha256 `d8fe7419f30d3b10…`).

## Limits

- **ψ comes from per-triangle normals**, so it is a staircase where the mesh has flat facets. That is real geometry here, and it is
  also why both smooth models carry ~5° of error.
- **u is normalised to each section's own half-width.** A section that runs onto a wider apron reads as a wide section; the 592 cuts
  outside 0.7–1.3 × the median width are excluded from the facet table only.
- **The lip's roll-back could include an edge bevel** that physics treats differently. The surface used is the visual road mesh, with
  no physics mesh checked.
- **The edge stop rule (20° per 0.5 m) is my choice.** A sharper fold than that ends the section.
