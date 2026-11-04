# CROSS-SECTION (lap D225): the EDGE CURVE, the TUBE and the SPIRAL — the seal, registered before anyone builds (pane E, 2026-10-03, D)

**Packet:** the chair's D225 step 1, GEOMETRY tier, docs only.
**Base:**
- t180 main `b3364df` (D222 landed). Read from a clean `git archive b3364df` copy, with the git-ignored `reads/` copied beside it for one probe.
- The plan: lighthouse `d86aac20`, `exo_memory/loop/plan_t180_edge_curve_2026-10-03.md`, sha256 `bc2c0b67cff9fe3f730167f2aa241792accc76c5d208b36caa7a5f2df9d62cdb`. I read all of it, including the AMENDMENT and C's test-track collation.
- C's measurement: `exo_memory/loop/t180_testtrack_profile_2026-10-03.md`, sha256 `f51ffe980242307c3bae67971dbabfa6482f4e8bcb9d80cb1d313fea84635961`.

**Who scores it:** B, as non-author, scores every row except G against A's core and C's fields in one combined worktree. Row G is the keeper's.

**What a row is**, as in D190:
- a CHECK;
- its FAIL condition, written before the code exists;
- PLANTED controls that B plants in the combined tree and the row's test must catch. An uncaught control means the TEST is broken; that row is then unscored until it catches.

**Evidence labels:**
- `checked:` measured at `b3364df` by a probe named in §6.
- `inferred:` read from the code, not run.

---

## §0 Verdicts on the plan

**V1 · G is named: the cubic smoothstep, G(t) = 3t² − 2t³.** It is not t².
- **It meets the plan's three conditions** (DERIVED; the source is in §4):
  - G(0) = 0, G′(0) = 0 and G(1) = 1.
  - It is monotone, because G′(t) = 6t(1 − t) ≥ 0 on [0, 1].
  - **It adds G′(1) = 0.** The extra turning fades out at the very edge, so the outer band arrives at the edge at a held angle. That matches C's read: a steep band holding about 19–20° from u 0.66 to 0.88.
- **Why not t².** Its G′(1) = 2, so the edge ends at its fastest turning. That is a curl at the lip, which neither the keeper nor the data asked for.
- **Already used in this codebase:**
  - the roll ramp (ref 02 §4);
  - the mesh's blend weight (`src/geom/profile.js` `smoothstep`);
  - the legacy→cup morph (ref 09 §9).
- **Its steepest slope is G′(½) = 1.5** (ref 02 §4). So the edge term's steepest rise across the road is 1.5·e/((1 − s)·w/2).
  - checked (`edgeprobe.txt` E_peakRise), at w 31, e 15: s 0.5 → 2.90°/m, s 0.64 → 4.03°/m, s 0.8 → 7.26°/m, s 0.95 → 29.03°/m.
  - At e 60 and s 0.95 it is 116°/m. That is a near-kink 0.78 m wide, and it is why s is bounded (V4).
- **Slice continuity is exact on the analytic function.** checked (C_sliceContinuity): |Δψ| at u = s is 0. The one-sided slope difference of the edge term is 3·10⁻⁶ of what G = t gives, for every s ∈ {0.5, 0.64, 0.95} and w ∈ {12, 31}.
  - G = t gives exactly 1 (a kink).
  - t² and 1 − cos(πt/2) also pass. Any G with G′(0) = 0 passes; only V1's choice is sealed.

**V2 · The cap: "total edge angle ≤ CUP_MAX (150°)" is KEPT, now with a measured reason.**
- **The walls never meet anywhere on the grid.** checked (A_wallsMeet), with a fine render (600 t-intervals):
  - for bowl, half-pipe and flat cups, c ∈ {0, 15.5, 45, 90, 120, 140, 149} and s ∈ {0.5, 0.64, 0.7, 0.8, 0.9, 0.95};
  - the first e at which the left tip's X(w/2) reaches 0 was searched up to e = 400°;
  - **no combination meets.**
- **Why:** for s ≥ 0.5 the flat-or-cupped middle is at least as wide as the outer zone, and an outer zone of length (1 − s)·w/2 cannot pull the tip back across the centreline.
- **For ψ monotone and ≤ 180° the tip criterion is exact** (DERIVED):
  - Y rises along each side, so the two mirror-image sides can cross only where a side reaches X ≤ 0;
  - once ψ > 90° the side's X only falls, so the tip is the minimum.
- **Moving angle outward never makes the gap at 150° smaller.** checked (A_tipRatioAt150): over every split of 150 into c + e on that grid, the smallest tip gap X_tip/(w/2) is **0.0578**, at bowl c = 150, e = 0. That is D190's number: the edge curve is never tighter than the plain bowl.
- So 150 stays, as the D190 bound, and for its D190 reason.

**V3 · The schema: RULED `t180b.core/4`, not an additive optional field.** The reason is measured. checked (`schemaprobe.txt`):
- Today's reader (b3364df, the keeper's installed line, and machine L until it updates) ACCEPTS a /3 file that carries channels `e` and `s`.
- It **silently drops both on the next save**: `eSurvivesASave: false`, and the schema is written back as /3.
- The same file labelled /4 is **refused by name**: `BAD_DOC … a newer file needs a newer builder`.
- An additive field would therefore let an older builder destroy an edge curve, or a tube, without a word. A version bump makes the old builder refuse instead.
- **Migration:** /1, /2 and /3 load with `e` = 0, `s` = 0.64, and no tube on any piece. That is inert by row E3.
- **Canonical text:** /4 writes `e` and `s` only for a piece that carries an edge, the way `c` is written only for a cup piece (`document.js` `cupOf`), and the tube's channel only for a tube piece. So a /3 document saved as /4 differs ONLY in the schema string (row E3c).

**V4 · Domains, sealed.**
- **e ∈ [0, 150 − ψ_mid(edge)]** on a non-tube piece. On an open tube piece the bound is **t/2 + e ≤ 180** (T3).
  - e < 0 (the outer zone flattening) is not asked for. It is the "lip" C offered the keeper, a later decision.
- **s ∈ [0.5, 0.95].** These are the plan's own extremes.
  - Below 0.5 the "outer" zone is most of the road: a re-shaped cup, not an edge.
  - Above 0.95 the zone is under 0.78 m on a 31 m road, and V1's rise rate passes 116°/m at e 60.
- **Defaults:** `s` = **0.64** (C's crease, the chair's packet), not the plan's earlier 0.70. The collation supersedes it, and the plan's own schema line is the stale one. An empty edge field means "continue", as for cup.

**V5 · REFUSED: "bank unwrapping in the core" as new work. It is already there.** checked (`spiralprobe.txt`):
- `extend` with a bank target of 360° over 300 m is ACCEPTED.
- The φ channel runs 0 → 359.99999999° continuously; its control points are monotone from 0 to 360.
- The readout says `bankToDeg 359.99999999`, the adapter's roll steps 0 at every segment joint, and the path's position has no excess.
- `parse` even unwraps a real track's bank as it loads it (`document.js` around :297).
- **What remains:** a regression row (S1), and C's bank FIELD accepting values outside ±180, which is inferred to be true already (`app/core/panel.js`: the bank input has no min/max).

**V6 · The heartline is CORRECTED in its reason and kept in its effect.**
- **The plan says** roll about the heartline "so the car's path does not jump". Measured, nothing jumps either way. checked (`spiralprobe.txt`, a straight 300 m, roll 0 → 360°, w 31 closed tube):
  - **Heartline 0** (today's core): the road centre stays a straight line, and the TUBE corkscrews around it. Its axis swings up to **9.8676 m = 2R** off the line.
  - **Heartline R = w/2π** (the tube's axis): the tube stays straight, and the floor centre spirals round it at radius R. **That is the spiral the keeper described.**
- **What does jump:** a heartline that STEPS between segments. checked: 0 → R at a joint moves the road by **4.4591 m** (path.js applies `pos = x − heartline·U` per segment, :105).
- **So the rule is:** a closed tube rolls about its axis, and the heartline is continuous along the road (S2).

**V7 · The roll-rate bar: sealed from Centrifuge, as asked, with two parts of the plan's wording REFUSED** (S3).
- **(a) "From Centrifuge's inverted sections" is refused as the RED bar.**
  - Those sections give 175 windows. The whole lap gives 8,585.
  - A roll rate is felt the same upright or inverted.
  - The RED bar is the whole lap's maximum; the inverted-only maximum is AMBER.
- **(b) "The roll rate the car feels at design speed" in °/s is refused as the sealed unit.**
  - Centrifuge's speed AT those sections is not measured anywhere I could find. FINDINGS gives only its 745 km/h top speed and replay g's.
  - A °/s bar would multiply a measured number by an unmeasured one. The bar is geometric, °/m at a 20 m chord, the way it was measured. Its °/s at 460 and 970 km/h is given for information.

**V8 · Things the plan does not have, sealed here:**
- (i) The per-segment roll smoothstep (ref 09 §5) breaks the spiral's floor (S2(iii)).
- (ii) The validator's loads miss the spiral's centripetal load (S4).
- (iii) A tube that closes along the road passes through a slot narrower than the downforce ray (T2(iv)).
- (iv) Re-evaluating ψ at its own knots breaks the e = 0 identity (E3).
- (v) A moving slice is not linear in s (E4).
- (vi) water.js refuses any heartline offset (S2(iv)).

---

## §1 Definitions

- **u** is the cross-section's own arc length, 0 at the centreline, + to the left (`src/geom/profile.js`).
  - ψ(u) is its turning angle from the flat floor, **+ on BOTH sides**: a wall rises whichever edge it is on, as profile.js holds it.
  - The plan's "sign(u)·e·G" is written in a ±u convention. **In profile.js's convention the edge term is + e·G on both sides.**
- **The edge profile** (a piece with e > 0), at a station with base profile ψ_mid (the legacy `profileAt` or the cup `cupProfile`, as rendered today), half-width h = w/2, and t = (|u|/h − s)/(1 − s):
  - **ψ(u) = ψ_mid(u) + e·G(t)** for t > 0;
  - **ψ(u) = ψ_mid(u)** for t ≤ 0;
  - e in degrees and G as in V1.
- **Rendered** means exactly what D190 §1 means:
  - the adapter's segments (`toSegments`);
  - the lifted path (`toPath`);
  - the mesh (`buildMesh`);
  - for a closed lap, the export (`buildFromSegments`, the app's route).
- **The tube profile** (a tube piece, sweep t° ∈ [0, 360], width w): **ψ(u) = (t/2)·|u|/h.**
  - That is a circular arc of radius R = w/(t·π/180) (DERIVED: constant dψ/du is constant curvature, ref 02 §1 plane form).
  - The edge angle is t/2. At t = 360 it closes into a cylinder of circumference w, R = w/2π.
- **Edge ψ of a mesh row** is as D190 §1: the angle between the row's outermost vertex normal on a side and its centre-vertex normal.
- **The roll rate** at s is the angle between the surface normal U at s − 10 m and at s + 10 m, both projected onto the plane normal to T(s), divided by 20 m.
  - It is frame-intrinsic: rotation about the direction of travel only, so pitch through a loop is not counted.
  - It is readable from path samples alone. This is exactly how `rollprobe.js` measured Centrifuge.

---

## §2 The rows

### EDGE CURVE

#### Row E1 · The profile values on the grid, and the slice

- **CHECK, on the grid:** family ∈ {bowl, half-pipe, flat}; base ∈ {legacy at the family rate, cup c ∈ {0, 15.5, 45, 90, 135}}; w ∈ {8, 12, 31, 50}; s ∈ {0.5, 0.64, 0.7, 0.8, 0.95}; e ∈ {0, 5, 15, 30, 60, 90, 150 − ψ_mid(edge)} with e within V4.
  - (i) **Both** edges' ψ = ψ_mid(edge) + e, each within 0.05°.
  - (ii) **The analytic function** A exports for the edge term, at u = ±s·h:
    - |Δψ| ≤ 1e-9 rad;
    - the one-sided slope difference of ψ − ψ_mid, with step δ = 1e-6·(1 − s)·h, is ≤ 1e-4 · e_rad/((1 − s)·h).
    - G = t gives exactly 1 on that scale, and V1's G gives 3·10⁻⁶ (checked).
  - (iii) **The rendered profile** (the u/ψ the segment carries) is within 0.05° of the analytic ψ at every u. That is sampled at ≥ 4,000 points per side, so it includes between the knots.
    - Consecutive knots differ by ≤ 1° of ψ, the mesh's `maxSeam`.
    - inferred, A's to choose: n ≥ max(47, ⌈e/1°⌉·1.5) t-intervals meets both.
    - checked minima (B_samplesNeeded, s 0.64):

      | e | intervals for 0.05° | intervals for steps ≤ 1° |
      |---|---|---|
      | 1° | 4 | 1 |
      | 5° | 9 | 8 |
      | 15° | 15 | 23 |
      | 30° | 21 | 45 |
      | 60° | 30 | 90 |
      | 90° | 37 | 135 |
      | 150° | 47 | 225 |

  - (iv) **On the rendered profile, the slice is no kink:** the slope jump of (rendered ψ − rendered ψ_mid) at the slice knot is ≤ the largest slope change between two adjacent intervals inside the outer zone.
    - checked (C_discrete), smoothstep: n 16 → 0.00843 ≤ 0.01539; n 64 → 0.002176 ≤ 0.004261.
    - G = t: 0.04692 against about 1e-15. **Fires.**
  - (v) ψ is non-decreasing from the centre out on both sides.
- **FAIL:** any of (i)–(v).
- **PLANTED:**
  - **KE1-1:** G = t. (ii) and (iv) must fire.
  - **KE1-2:** the plan's sign(u)·e·G, read literally in profile.js's convention. checked: left 60°, right **30°** on a bowl c 45 + e 15. (i) must fire.
  - **KE1-3:** e treated as radians. (i) must fire.
  - **KE1-4:** a render with 4 t-intervals at e 60. (iii) must fire: 30 are needed for 0.05°.
  - **KE1-5:** the slice placed at s·w (the full width) instead of s·w/2. (i) must fire, because the edge is never reached.

#### Row E2 · The domain, the cap and the walls

- **CHECK:**
  - (i) A document holding any e control point < 0, or any s outside [0.5, 0.95], is refused by name (`BAD_EDGE`, or the name A chooses) at `checkDoc`/`parse`.
  - (ii) The total edge cap: ψ_mid(edge) + e ≤ 150 on every non-tube piece, bound on control points by the convex hull (ref 03 §1b) and refused by name otherwise.
  - (iii) Every operation either stays inside or is refused by name: extend (including D190 V5's ringing case: a 30 m piece, 10 m transition, e target 150 − c), the brush on e and s, close, and migration.
  - (iv) At every grid point of E1 with total ≤ 150, the left tip X(w/2) > 0, and X_tip/(w/2) ≥ 0.05.
- **FAIL:** an e < 0 or a total > 150 accepted; s 0.4 or 0.97 accepted; extend leaving a total > 150; a tip ratio below 0.05.
- **PLANTED:**
  - **KE2-1:** the cap applied to e alone (e ≤ 150) instead of the total. A bowl c 140 + e 30 must be refused, and that plant accepts it.
  - **KE2-2:** the guard removed, with only a typed-value clamp in the UI. (iii) must fire on the ringing case.
  - **KE2-3:** s's lower bound removed. A document with s = 0.2 must be refused.

#### Row E3 · e = 0 is the identity: every fixture byte-identical

- **THE BASELINE:**
  - The 9 fixture FILES in `test/fixtures/`.
  - The **effective** manifest after D222: the sealed `manifest.json` (sha256 `05be6acc…`) with `manifest.d196.json`'s `after_d196` and then `manifest.d222.json`'s `after_d222` laid over it, exactly as `test/core_cup_fixtures.test.js` builds it.
  - The two layers: d196 sha256 `399e0082…`, d222 sha256 `1d659a956ee31a6a25243da9d45401dd7cc243abdcee60de2ca1e75f04f88024`.
  - `effmanifest.js` writes that effective manifest; it is **sha256 `05c789a8ac70c94a056565dc26eddf7546373cc1b3af32d76ba6003c9bd09456`**.
  - checked, at b3364df in a fresh process: `node test/fixtures/fixtures.js <tree> <effective dir> --check` → **"0 of 9 differ"** (`fixtures-check-b3364df.txt`).
- **CHECK:**
  - **E3a:** the same command on the new tree → **0 of 9 differ** in every key (segs, path, mesh, kn5, F9's refusal).
  - **E3b:** a NEW segment key on a piece with e = 0 is a difference, as D190 row 5 says. inferred: the safest build returns the base profile object untouched when e = 0 everywhere on a piece.
  - **E3c:** each fixture parsed, serialised (/4) and parsed again renders to the same digests. The /4 text differs from a /3 serialisation of the same document ONLY in the `schema` string (V3).
- **FAIL:** any fixture differing in any key (the plan's own stop rule: NOT GREEN); E3c's text carrying `e`, `s` or the tube channel on a piece that does not use them.
- **PLANTED, all checked on b3364df copies by `plant.js` (`fixtures-check-tmut1/2/3.txt`):**
  - **KE3-1, the slice's knots inserted at e = 0** (u gains 34 points per profile, ψ interpolated, + 0·G): **8 of 9 differ** (segs and mesh everywhere, kn5 on F1/F2; F9 identical). Must be caught.
  - **KE3-2, ψ RE-EVALUATED at its own knots** by interpolation, + 0·G, no new knots: **7 of 9 differ.** psiAt at a knot returns ψᵢ₋₁ + (ψᵢ − ψᵢ₋₁)·1, which is not always ψᵢ bit for bit. Must be caught.
    - This is the trap in the plan's own formula "ψ_mid + e·G" if ψ_mid is recomputed.
  - **Control, NOT a defect:** + 0·G added to the STORED ψ values, no new knots → **0 of 9 differ.** x + 0 = x for every value the profiles hold. Said so B does not plant it and read "uncaught" as a broken test.
  - **KE3-3:** serialise still writes /3. E3c must fire.

#### Row E4 · Along the road: channels, joints, a moving slice, no zip

- **CHECK:**
  - (i) `e` and `s` are in `CHANNELS`, so every road joint's `jointProblem` holds them to C1, as for c (D190 row 3).
  - (ii) After a flight, e and s are CARRIED, like c.
  - (iii) close() holds e and s at the seam (value and slope), or refuses with a clear code, as for cup.
  - (iv) **Linear in e at a fixed s:** the fraction-matched blend of two edge profiles at the same s, e₁ and e₂, IS the edge profile at (1 − x)e₁ + x e₂. checked (D_linearInE): worst **2.2e-16 rad**. So an e ramp may share profile pairs across a run, as the cup does (ref 09 §9).
  - (v) **NOT linear in s.** A slice that moves along a piece is drawn segment by segment:
    - a pair from the profile at the segment's start to the one at its end (the D196 chord), never one pair shared across a run;
    - every mesh row at a segment boundary is within 0.05° of the analytic profile at that row's (e(s), s(s));
    - every row inside a segment is within **0.5°**.
    - checked (D_movingSlice), the fraction blend at weights ¼, ½, ¾ against the exact profile between:

      | case | Δs 0.03 | Δs 0.1 | Δs 0.4 |
      |---|---|---|---|
      | e 15 (flat c 0, and bowl c 15.5) | 0.036° | 0.324° | 5.06° |
      | bowl c 60 + e 90 | 0.218° | 1.943° | 30.4° |
      | flat c 0 + e 150 | 0.364° | 3.238° | 50.6° |

    - A 40 m ramp of s 0.5 → 0.95 moves the slice ≤ 0.034 per 2 m segment (inferred: Bloss peak 1.5 × 0.45/40 m × 2 m).
  - (vi) No SEAM zip mesh is emitted inside one edge piece, and the step between consecutive segments' rows (`stepBetween`) is ≤ 1 mm.
  - (vii) At a joint from a piece without an edge to one with it, the edge term starts from e = 0 and the row step at the joint is ≤ 1 mm.
- **FAIL:** a 1° step in e accepted at a joint; e reset after a flight; e(0) ≠ e(L) on a closed lap; a zip inside a piece; a moving-slice row off by more than (v)'s bounds.
- **PLANTED:**
  - **KE4-1:** e left out of the channel list `jointProblem` walks. A hand-built doc with a 5° step in e must be refused `JOINT`.
  - **KE4-2:** e reset in `endState` after a flight.
  - **KE4-3:** one blend pair shared across a whole s ramp (the cup's run trick applied to s): s 0.5 → 0.9. checked: 5.06° at e 15 — must fire (v).
  - **KE4-4:** today's per-segment `blend: null` for an edge ramp (one profile per segment at its middle). (vi) must fire; it is D190 V4's stair-step.

#### Row E5 · Mesh, export and validate at the extremes

- **CHECK:** the fixture F1 lap with its four turns carrying:
  - (a) bowl c 135 + e 15 at s 0.64;
  - (b) flat c 0 + e 150 at s 0.5;
  - (c) the same at s 0.95;
  - (d) half-pipe c 120 + e 30 at s 0.95.
  - The start straight is left plain (the grid needs a floor; see X1). It goes through the app's export route, `csp: true`:
    - (i) mesh, markers, kn5 write and read-back, and AI line complete with no red, and no NaN in any buffer;
    - (ii) with `csp: false` (passed in the export's OPTIONS, the third argument, not in meta), validate reds `steep-without-raycast`.
- **FAIL:** any throw that is not a named refusal; any red other than (ii)'s; a kn5 that does not read back.
- **PLANTED:**
  - **KE5-1:** drop the `csp === false` steep check. (ii) must fire.
- inferred: the edge does not move the centreline, so turn, climb and bank readouts and the path digest are unchanged by e. Row E6 checks it.

#### Row E6 · Edge ⟂ bank: edge-then-roll

- **CHECK:** at a level straight station with φ = +30°, bowl c 60 + e 15 at s 0.64, w 30:
  - the left edge's surface is at **105°** to gravity (60 + 15 + 30), and the right at **45°**, each ± 0.05°;
  - φ = −30° mirrors it;
  - the same Extend with and without an e target gives identical `turnDeg`, `climbDeg`, `bankFromDeg`, `bankToDeg`, `pitchFrom/To` and an identical path digest.
- **FAIL:** an edge off by more than 0.05°; any of those readouts, or the path, changed by e.
- **PLANTED:**
  - **KE6-1:** the edge applied in the world frame (ψ_left = c + e − φ). It gives 45 / 105 swapped.
  - **KE6-2:** e fed into the roll.

#### Row E7 · The readout and the fields

- **CHECK (core, A):** `pieceReadout` gains `edgeFromDeg`/`edgeToDeg` and `sliceFrom`/`sliceTo`: e(0), e(L), s(0), s(L) from the DOCUMENT, |Δ| ≤ 1e-9 against `channelAt`.
  - A piece without an edge reads 0 and the default 0.64.
  - `candidateReadout` equals the placed piece's, bit for bit.
- **CHECK (UI, C):** two Extend fields, `edge angle °` and `edge start`. Empty means continue; both work with the "at start" box. The readout box shows them with the bank cell's rounding, and each number equals the core readout rounded the same way.
- **FAIL:** a cell differing from the core after rounding; a typed target shown where the document holds something else (the fit rings, D190 V5).
- **PLANTED:**
  - **KE7-1:** edgeToDeg returns the typed target.
  - **KE7-2 (UI):** the edge cell wired to the cup values.

### TUBE

#### Row T1 · The tube profile, closure and its limits

- **CHECK:**
  - (i) For w ∈ {4, 8, 12, 31, 60} and t ∈ {0, 90, 180, 270, 340, 360}: ψ is linear in |u| with edge t/2, each within 0.05°. The rendered section is a circular arc: every rendered vertex is within 1 mm of the circle of radius w/(t·π/180) through the centreline point.
  - (ii) **Closure:** at t = 360 the left-edge vertex and the right-edge vertex of every mesh row are within **1 mm**.
    - checked on the profile: the gap is ≤ 2.34e-15 m for w ≤ 60, with the tip at Y = 2R (`edgeprobe.txt` F_tube).
    - The physics road has no boundary edge along the closure, so the export passes `downforce-ray-gap`. checked (`tubeexport.txt`): a 360° tube lap exports with no red.
  - (iii) **The slot.** An open tube whose two tips are closer than the downforce ray's 1.0 m reach (`raygap.js`) is refused **by name at the document** when it is HELD there: a piece whose sweep control points all lie in the band (t₁ₘ(w), 360). It is never left to the export's incidental red.
    - checked (F_tube), t₁ₘ: w 4 → 283.566°, w 8 → 319.241°, w 12 → 332.053°, w 31 → **348.732°**, w 60 → 354.096°.
    - The prediction held both ways on the export: w 31 at 352° → `downforce-ray-gap` ×2, and at 340° → green.
  - (iv) **The narrowest tube.** A closed tube narrower than the chase camera's 3 m eye height ×π (w < 9.43 m) is either refused by name or has its camera handled (X2). The plan does not say which; the chair's to rule. Either way it is never silent.
  - (v) Sweep domain [0, 360], refused by name outside.
- **FAIL:** any of (i)–(v).
- **PLANTED:**
  - **KT1-1:** a tube rendered with ψ at the edge = t instead of t/2. (i) must fire.
  - **KT1-2:** the slot guard removed: a held 352° w 31 tube reaches the export and reds there instead of at the document. (iii) must fire.
  - **KT1-3:** the closure rows offset by 2 mm. (ii) must fire.

#### Row T2 · Cup ↔ tube transitions

- **CHECK:**
  - (i) The tube's sweep channel is C1 at joints, like every channel.
  - (ii) A cup piece followed by a tube piece, and the reverse, is morphed over the transition the way legacy → cup is (ref 09 §9's morphZone), so the row step at the joint is **≤ 1 mm**.
  - (iii) Every intermediate row has X_tip ≥ 0, so it never self-intersects.
    - checked (F_cupToTube), the fraction-matched blend from bowl 150 / bowl 90 / bowl 15.5 / half-pipe 150 / flat 150 / flat 0 to a closed w 31 tube: the minimum tip ratio is 0, reached only at the closed end (weight 1). No intermediate row is negative.
    - With matched edges (tube sweep 2c), the minimum is that of the cup: bowl 150 → 0.0578.
  - (iv) **The closing slot, the unwelcome outcome named in advance.** A transition from an open section to a closed tube passes through rows whose slot is narrower than 1.0 m.
    - checked (`spiralprobe.txt` closingSlot), over a 40 m smoothstep transition at w 31: from bowl 150 it is **21.70 m**, from bowl 15.5 it is **4.46 m**, from flat 0 it is **4.24 m**.
    - The export reds `downforce-ray-gap` there, and that red is CORRECT: a car on the slot loses its downforce.
    - **The check:** the reds are exactly that kind, inside the predicted span ± 2 m, and none elsewhere.
    - **So a track with a closing tube does not export green under today's raygap.** Whether the slot zone is exempted, shortened or ridden is the keeper's and the librarian's call. This seal does not exempt it.
- **FAIL:** a joint step > 1 mm; a zip at a cup ↔ tube joint; a negative tip; a closing transition exporting green (the slot was hidden) or red outside its span.
- **PLANTED:**
  - **KT2-1:** a family change done as today's: a zip with no morph. inferred from D196: F8's bowl → half-pipe joint is still a 239 mm step. (ii) must fire.
  - **KT2-2:** raygap exempting tube pieces. (iv) must fire.

#### Row T3 · Tube with an edge curve

- **CHECK:**
  - (i) An OPEN tube piece may carry e, with t/2 + e ≤ 180, bound on control points.
    - checked (F_tubeWithEdge): for t ∈ {120 … 340} and s ∈ {0.5, 0.64, 0.95} the walls do not meet below t/2 + 400°. The 180 bound is V2's monotone-ψ exactness, not a touch.
  - (ii) A tube piece with any sweep control point ≥ 360 − 1e-9 and any e control point > 0 is refused by name: closed, the edge is moot.
- **FAIL:** either accepted wrongly, or a valid open-tube edge refused.
- **PLANTED:**
  - **KT3-1:** CUP_MAX (150) applied to a tube's t/2 + e. A tube 300 + e 20 (total 170) must be accepted.

### SPIRAL

#### Row S1 · Bank winds through ±180 (regression; V5)

- **CHECK:**
  - (i) extend(bank target 360° over 300 m) is accepted. The φ channel is monotone and continuous, with no step > 1e-9 rad in any 1 m.
  - (ii) The readout `bankToDeg` is 360 ± 1e-6, not 0 or −0.
  - (iii) The adapter's roll steps 0 at every joint.
  - (iv) C's bank field accepts 360 and −540, and the Extend it builds reads them back.
- **FAIL:** any wrap, clamp or refusal.
- **PLANTED:**
  - **KS1-1:** a wrap to (−180, 180] in the readout. (ii) must fire.
  - **KS1-2:** `max="180"` on the bank input. (iv) must fire.
- checked at b3364df: (i)–(iii) hold today (`spiralprobe.txt`).

#### Row S2 · The heartline: roll about the tube's axis, continuously

- **CHECK:**
  - (i) Every segment of a closed tube carries heartline = R = w/2π.
  - (ii) The heartline is continuous along the road: the road centre's position steps by **≤ 1 mm** at every segment joint, including the open → closed transition, where it must ramp, not step.
  - (iii) **The floor of a spiral is smooth** (V8 i). On a straight closed w 31 tube, 600 m, roll 0 → 360° (smoothstep in s):
    - the road centre's curvature at every 0.5 m sample is ≤ 1.1 × the helix value R·ω²/(1 + R²ω²) at the φ channel's own rate ω(s), plus 1e-3/m (ref 02 §1's helix);
    - its position is within 5 mm of that helix.
  - (iv) **water.js:** `water.js:101` throws on a heartline offset ("is there a heartline offset?"). A pour over a tube with heartline R must either handle it or be refused by name in the UI. It must never throw unnamed.
- **FAIL:** any of (i)–(iv).
- **The measured reason for (iii):** path.js rolls each segment by a smoothstep from roll₀ to roll₁ (ref 09 §5). The roll RATE returns to 0 at every joint, so a road centre at radius R from the roll axis is thrown sideways every segment. checked (`hlprobe.txt`), p50 / p99 / max of the road centre's curvature against the ideal helix peak **0.004755/m**:

  | segment length | p50 | p99 | max |
  |---|---|---|---|
  | 10 m | 0.0252 | 0.0864 | 0.0910 |
  | 2 m | 0.113 | 0.413 | 0.417 |
  | 0.5 m | 0.300 | 1.082 | 1.083 |

  - It grows as segments SHORTEN, so finer segments make it worse.
  - With heartline 0 the road centre's curvature is 0 at every n.
  - inferred: A changes the roll interpolation for heartline segments only (e.g. C1 across segments from the channel's slope). A change to every segment's roll would move the fixtures' path digests, and E3 catches that.
- **PLANTED:**
  - **KS2-1:** today's per-segment smoothstep roll with heartline R. (iii) must fire: 0.417 against 0.0048.
  - **KS2-2:** heartline stepped 0 → R at the transition. (ii) must fire. checked: 4.4591 m.
  - **KS2-3:** heartline 0 in a closed tube. (i) must fire. checked: the axis swings 9.8676 m.

#### Row S3 · The roll-rate bar (V7)

- **THE BAR,** from `reads/centrifuge.read.json`, read by `rollprobe.js`. That file stays git-ignored; only these derived numbers are sealed. Its sha256 is `1fae0ae1…`. It has 8,590 stations about 4 m apart, and the inverted and wall words come from its own reader tags.
  - **RED above 1.2144°/m** at the 20 m chord (§1): the maximum over the whole lap, 8,585 windows. That is the highest roll rate the load benchmark rides, and the keeper says it "flows so smooth … at max speed" (FINDINGS).
  - **AMBER above 0.9338°/m:** the maximum over the inverted words alone (175 windows).
  - For information, 1.2144°/m is about 155°/s at 460 km/h (the design speed, `limits.js`) and about 327°/s at 970 km/h.
  - checked, the other figures at the 20 m chord: inverted p50 0.331, p99 0.840; whole lap p50 0.082, p99 0.702.
  - At the 4 m chord the maximum is 4.26°/m on PLAIN sections too. That is facet noise in the read's normals, and it is why the bar uses the 20 m chord.
  - The largest roll accumulated through any inverted-or-wall run is 167°. **No Centrifuge section rolls a full turn.**
- **CHECK:** the validator computes §1's roll rate on the rendered path. It reds above 1.2144 and ambers above 0.9338, by name (`roll-rate`, or A's), at the stations where it holds.
- **The unwelcome outcome, named in advance:** the keeper's own example, **360° over 300 m, reds.** checked (`chordprobe.txt`, a core Extend, bank 0 → 360°):

  | spiral length | 20 m chord max | verdict |
  |---|---|---|
  | 300 m | **1.7973°/m** | red |
  | 443 m | 1.2191°/m | red |
  | 450 m | 1.1992°/m | amber |
  | 600 m | 0.8997°/m | green |

  - The Bloss ramp peaks at 1.5× its mean. The per-0.5 m sample peaks run higher still (2.47 at 300 m), which is ref 09 §5's per-segment pulse that the chord averages out.
  - **A full 360° needs about 450 m to pass the bar, and 600 m to stay out of amber.** If the keeper wants 300 m, the bar is the thing to revisit, with him, not quietly.
- **FAIL:** the 300 m case not red; the 600 m case red or amber; the bar read at a chord other than 20 m.
- **PLANTED:**
  - **KS3-1:** the rate read per 0.5 m sample. The 450 m case reads 1.65 and reds wrongly.
  - **KS3-2:** the bar raised to 2.0. The 300 m case must still red.
  - **KS3-3:** the gravity-frame φ′ used instead of the frame-intrinsic rate. On a climbing turn they differ (inferred). B builds one: 200 m at κh 1/150 with κv 0.002 and constant φ, so φ′ = 0 while the frame twists.

#### Row S4 · The spiral's load reaches the validator (V8 ii)

- **CHECK:** on the S2 spiral (w 31, 600 m, 360°), at 460 km/h, the floor centre's normal load fN equals 1 g·(gravity's component on the floor normal) + v²·κ_helix/g, ± 0.05 g. κ_helix is S2(iii)'s helix curvature at ω(s).
- **FAIL:** the helix term missing.
- **The measured reason:** with heartline R, the samples' `kvec` is the curvature of the integrated curve (the straight axis). checked (`kvecprobe.txt`): max |kvec| = **0**, while the floor rides a helix whose peak curvature 0.0012101/m needs **2.01 g** at 460 km/h. Today's validator therefore reports the spiral's floor at 1 g.
- **PLANTED:**
  - **KS4-1:** loads from the samples' kvec alone. It must fire.

### ALSO

#### Row X1 · The export: a closed tube's ceiling is road, physics-solid, CSP raycast on (offline only; NO AC launch)

- **CHECK:**
  - (i) Every mesh carrying a tube segment's ceiling is a drivable physics road (`isDrivable`: `1<KEY>…`, not WALL).
  - (ii) The kn5 reads back (`readback`).
  - (iii) `csp: true` (the default, with CSP's extended physics) exports with no red.
  - (iv) `csp: false` reds `steep-without-raycast`.
- **checked** (`tubeexport.txt`, `ceilprobe.txt`), today's export on the F1 lap with every turning segment's profile replaced by a closed w 31 tube:
  - (iii) passes: kn5 24,146,819 bytes, read back.
  - (iv) reds `steep-without-raycast` ×2, at s 306.0–877.4 and 883.4–1475.0.
  - (i): **every one of the 590 meshes** whose vertical extent is over 9 m (9.867 m = 2R: the ceiling) is named `1ROAD_…`.
    - Pieces p2–p5 give 566 of 571 meshes, and p6 gives 24 of 31. The rest are segments left as the bowl because they barely turn.
    - The only non-road meshes are paint (start line, grid, pit), 2.32 m tall at most.
    - So the ceiling is in the drivable road meshes.
  - The start straight was left as the bowl: a tube start straight is refused by name, `NO_START_STRAIGHT` ("the start straight's floor is 2.58 m wide"). That is the grid's refusal, correct, and it stays.
- **FAIL:** a ceiling in a non-drivable or WALL mesh; csp false not red; any other red.
- **PLANTED:**
  - **KX1-1:** the tube's ceiling given a WALL material. (i) must fire.
  - **KX1-2:** as KE5-1.
- **Correction I made to myself:** my first run passed `csp` inside `meta` (the second argument) and read "csp false: green". It was the default csp true. Re-run with `csp` in the options (the third argument): red as above. B: the option lives in the third argument.

#### Row X2 · Camera and labels inside a closed tube; the deep edge

- **CHECK:**
  - (i) **The chase camera** (`app/camera/cameras.js`: eye = pos + U·3 m·zoom, up = U): at zoom 1 in a closed tube with w ≥ the T1(iv) minimum, the eye's distance to the tube axis is < R − 0.1 m, and `up` is the road's U, so the view rolls with the spiral.
  - (ii) **The head marker** (`app/preview/look.js` `headMarker`: a mast 10 m up WORLD y and a 4.8 m cross) does not leave the tube. Today it does for every closed tube narrower than 31.4 m (2R < 10 m), and when inverted the mast points through the floor. inferred from the code; it is to be built against.
  - (iii) **Labels:** a DOM layer anchored at path points `m.pos` (`app/core/labels.js` `anchorsOf`), never clipped by geometry. inferred. With heartline R, `pos` must stay the ROAD centre (path.js:105 makes it so), so labels sit on the floor, not on the axis.
  - (iv) **The deep edge:** the chase and build eyes lie on the section's symmetry line (U from the centreline). The tips stay at X > 0.0578·h (E2 iv), so no eye is inside a wall. inferred from the pose code.
- **FAIL:** an eye outside the tube at zoom 1; the marker through the ceiling; a label anchored on the axis.
- **PLANTED:**
  - **KX2-1:** chase height 3 m in a w 8 m closed tube (2R = 2.55 m). (i) must fire.
  - **KX2-2:** chase `up` set to world y. (i) must fire on the inverted half of the spiral.

### Row G · What the keeper's hands must find (scored by the keeper in the installed app, and at 900+ km/h in AC; not by B)

- **G1, the edge:** on a straight, Extend 200 m with edge 15 and nothing else typed. The middle stays as it was. From about two-thirds out the road curves up more, smoothly, with no crease and no wall, holding a steeper angle at the edge. Bank still rolls the whole section.
- **G2, the dial:** edge start 0.5 is a wide outer band and 0.95 a narrow lip. Edge 15 at start 0.64 is about the test track's outer band (C: about 19–20° outside, about 5° inside).
- **G3, the tube:** sweep 360 on a 31 m road is a pipe about 9.87 m across. Between about 349° and 360° a held sweep is refused by name (T1 iii). Closing a tube along the road reds the slot zone (T2 iv), said now.
- **G4, the spiral:** 360° of bank inside a closed tube, over 600 m, drives as a spiral round the inside of a straight pipe. Over 300 m the validator reds the roll rate (S3), said now.
- **G5, the falsifier, registered now:** if the keeper says the edge "is a wall", "tilts the road", "steps", the tube "has a seam I feel", the spiral "jerks" or "is not what I meant", this lap is NOT GREEN whatever the other rows say.

---

## §3 Stop rules

- **The plan's:** any fixture differing at e = 0 = NOT GREEN.
- **Added:**
  - a document holding an edge outside V4, or a total past its cap = NOT GREEN;
  - a zip, or a > 1 mm row step, inside a piece or at a cup ↔ tube joint = NOT GREEN;
  - a heartline step > 1 mm, or a spiral floor failing S2(iii) = NOT GREEN;
  - a planted control that is NOT caught = the test is broken, and the row is unscored until it catches.

## §4 Maths the builders must shelve before use (the references/ rule: a formula is on the shelf only with its source and a test)

- **G, the edge shape** (V1): S(t) = 3t² − 2t³. It is ON the shelf as the roll ramp, ref 02 §4. The Bloss transition (IFC-BLOSS) is its source, derived in `docs/math/04a_bank_ramp.md`, and S′(½) = 1.5 is DERIVED there.
  - **To add:** a new ref 09 section "the edge curve", stating:
    - ψ = ψ_mid + e·S((|u|/h − s)/(1 − s));
    - DERIVED: S(0) = 0, S′(0) = 0, S(1) = 1, S′(1) = 0, S′ = 6t(1 − t) ≥ 0;
    - linear in e at a fixed s (E4 iv);
    - NOT linear in s (E4 v), with its known-answer test.
- **The tube's circle:** constant dψ/du is constant curvature 1/R (the plane form of WIKI-CURV, ref 02 §1). The closure Y = 2R at t = 360 is DERIVED from profile.js's closed form. To be added to the same section, with a test.
- **The helix curvature** a/(a² + b²) is ON the shelf (ref 02 §1, tested). S2(iii) and S4 use it in the form R·ω²/(1 + R²ω²), with a = R and b = 1/ω (DERIVED).
- **The convex hull** (ref 03 §1b) is ON the shelf, for E2(ii) and T3(i).
- **The roll-rate bar** is a MEASURED number. It goes in FINDINGS with its command (`rollprobe.js`) and the read's sha256, not in references/.

## §5 What this seal does not establish

- **Nothing was built, and no AC was launched.** Every statement about AC is inferred. The export probes ran offline through the app's route on hand-built profiles put on b3364df's segments. They measure today's mesh, validate and export, not A's code.
- **Centrifuge's speed at its inverted sections is not measured** (V7 b). The bar is geometric.
  - The 20 m chord smooths Centrifuge's own peaks. The bar is therefore, if anything, strict.
  - inferred: the read's 4 m normals are facet noise.
- **The fixture digests are proven stable across processes on D only**, as D190 §5 says. On L or another node version, re-baseline first and say so.
- **Not run:**
  - the narrowest-tube camera case (X2 i);
  - the head-marker mast (X2 ii);
  - the label anchors (X2 iii);
  - KS3-3's climbing-turn case.
- **V3's /4 reasoning covers today's reader;** I did not check machine L's installed build.
- **inferred, not decided here:** the cup → tube transition's slot red (T2 iv), and whether a closed tube narrower than 9.43 m is refused or camera-handled (T1 iv), are the chair's and the keeper's.

## §6 Instruments and evidence (scratchpad, not committed)

- Directory: `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\xsec\`.
  - `t/` is a clean `git archive b3364df`, with `reads/` copied in (untracked).
  - `tmut1/`, `tmut2/` and `tmut3/` are the E3 plants, made by `plant.js`.
  - `eff/` is the effective fixture baseline.
- Every probe ran under the heavy-run lock: `node --max-old-space-size=4096 -e "require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({cmd}); require('./<probe>')"`. `schemaprobe.js` and `kvecprobe.js` are pure and ran without it.

| file | sha256 | output (sha256) |
|---|---|---|
| `rollprobe.js` | `bc417400e3952f9b…` | `rollprobe.txt` `aab78e73f8bc37a9…` |
| `edgeprobe.js` | `4ca8391150044a18…` | `edgeprobe.txt` `cbbdce7c13d716f7…` |
| `spiralprobe.js` | `b3e7e4bed51ba5fc…` | `spiralprobe.txt` `39f702a6332a2fa7…` |
| `hlprobe.js` | `b98964f1cce61818…` | `hlprobe.txt` `11cdd9816f52ef4a…` |
| `chordprobe.js` | `2da58e120dc7383c…` | `chordprobe.txt` `f82ffe34415ce67d…` |
| `kvecprobe.js` | `2ed0266415be3863…` | `kvecprobe.txt` `9b6f50b4fede4be8…` |
| `tubeexport.js` | `e0c8b2671642a7850…` | `tubeexport.txt` `759bbc4645df04dd…` |
| `ceilprobe.js` | `df13aa4b60c5eadd…` | `ceilprobe.txt` `eca750a64882819e…` |
| `schemaprobe.js` | `dba56298c073b980…` | `schemaprobe.txt` `22e9e7ee47dffdc7…` |
| `effmanifest.js` | `8fb023f5e3421255…` | `eff/manifest.json` `05c789a8ac70c94a…` |
| `plant.js` | `ab2df15cbeb6b62a…` | `fixtures-check-tmut1.txt` `12769a39…`, `-tmut2.txt` `68486cae…`, `-tmut3.txt` `f6597519…` |
| (the kit's own `fixtures.js`, `d24dcf49…`) | — | `fixtures-check-b3364df.txt` `f6597519…` (the same bytes as tmut3's: "0 of 9 differ") |

**Corrections I made to myself while measuring:**
- **The first wall-touch scan read "never meets" for a bad reason.** It tested e = 400° first, and past 360° a tip can swing back to X > 0. Fixed to find the FIRST sign change, stepping e by 1°. The result is the same (no touch), now for the right reason.
- **The csp false export** (X1): the option was in the wrong argument. Re-run.
- **The first two export runs were refused at the grid, `NO_START_STRAIGHT`.** I had tubed the start straight's neighbouring segments, which the grid reads as straight. Fixed by tubing only segments turning faster than 1e-3/m.
- **I expected KE3-2 to be bit-neutral.** It is not (7 of 9 differ). The interpolation at a knot is the cause, and that is now the plant.

sha256 of every byte above this line (the file with this trailer line and the blank line before it removed): 3077ff16ce6be489bccba9d5725cfbbf58549c18f056266bf05735eea1add7e2
