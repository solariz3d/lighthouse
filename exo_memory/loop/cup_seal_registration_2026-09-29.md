# D190 CUP — the seal, registered before anyone builds (pane E, 2026-09-29 14:4x, D)

**Packet:** D190 packet 1 of 5, GEOMETRY tier, docs only.
**Base:**
- t180 main `c964c2d`, read from a clean `git archive c964c2d` copy, not from the Desktop t180 folder, which holds stale mixed files.
- The plan: lighthouse `1add173`, `exo_memory/loop/plan_t180_cup_2026-09-29_D.md`, sha256 `265eab1505d337ef8089513fb5b84feb20b2a48c1627dd84913f98d74fdf81e6`.

**Who scores it:** B, as non-author, scores rows 1–7 against A's core and C's UI in one combined worktree. Row 8 is the keeper's.
**What a row is:**
- a CHECK;
- its FAIL condition, written before the code exists;
- one or more PLANTED CONTROLS: deliberate breakages B plants in the combined tree, each of which the row's test must catch. A control that goes uncaught means the TEST is broken, not the code.

**Evidence labels:** `checked:` means measured at c964c2d by a probe named in §6. `inferred:` means reasoned from the code or FINDINGS and not run.

---

## §0 Verdicts on the plan: three kept, one refused, two things it lacked

**V1 · The migration definition is REFUSED.**
- The plan says: "A /2 doc loads with c set per piece so its profile is UNCHANGED (c = the family floor's effective edge after the old r cap)", with the shape ψᵢ = c·Fᵢ/F_edge.
- That cannot render old tracks byte-identically, for three measured reasons:
  1. **Where the r cap binds, the shape is different, not only the edge.** checked (`migprobe.js`):
     - The cap binds on the default rate below **18.443 m** (bowl), **29.011 m** (half-pipe) and **32 m** (flat).
     - Worst quarter difference between the capped shape and the proportional shape with the same edge: bowl 12 m **0.7095°**, bowl 18 m **0.092°**, half-pipe 24 m **1.3132°**, half-pipe 12 m **4.4581°**, flat 20 m **0.0333°**.
  2. **Where no cap binds, the arithmetic still differs in the last bit.** checked:
     - The default half-pipe's legacy edge is `30.600000000000005` (a running sum). `c·Fᵢ/F_edge` is bit-equal on only **1 of 4** quarters.
     - flat `c·F/E` is bit-equal on 3 of 4 quarters. bowl is 4 of 4.
  3. **A constant c channel does not evaluate to its constant.** checked: all control points 15.5 on a 137.3 m piece → `channelAt` differs from 15.5 at **764 of 1,374** stations, by at most 7.1e-15.
- **Planted proof:** the plan's rule wired into a copy of c964c2d's `profileAt` → **6 of 9** registered fixtures render differently. That includes the default half-pipe lap's kn5 (§2 row 5, checked, `fixtures-check-planted.txt`).
- **The replacement (sealed):** a /2 road piece loads as a **LEGACY piece**.
  - Its cross-section is produced by today's `profileAt(family, w, r)` arithmetic, unchanged, at every segment.
  - Nothing about `c` reaches its render.
  - "Byte-identical" is then true by construction, and row 5 tests it.
  - The plan's "c = the effective edge" survives in one place only: it is what the READOUT shows for a legacy piece, and what a cup piece extended after it starts from (rows 5c and 7).

**V2 · MAX = 150° is SEALED, with its reason.**
- The two walls of a cup meet (the section self-intersects) at an edge angle that depends only on the family's shape, not on the width, because the whole profile scales with w. checked (`maxprobe.js`, bisection on the left side's lateral extent):
  - **bowl 159.681°**;
  - **half-pipe 286.48°**;
  - **flat 180.000°**;
  - the circle control (ψ linear in u) is 180.0000°, as it must be.
- The tightest family is the bowl, whose last quarter is a flat plank (F¾ = F_edge = 15.5), so its walls turn in early.
- **150° leaves 9.68° to the bowl's touch.** The gap between the two wall tips at 150°, as a fraction of the road's width: bowl **0.0578**, flat **0.1876**, half-pipe **0.4737**. So a 31 m bowl at 150° is a tube with a 1.79 m slot at the top.
- **Why not higher:**
  - At 159° the bowl's tips are 0.1 m apart and the export already reds (`downforce-ray-gap`).
  - The fit that makes a channel can overshoot its target by up to **24.65°** (V5), so a nominal MAX needs a guard on the document, not on the typed value.
- **Why not lower:** real T-180 roads are ridden at road tilts of 100–133° (FINDINGS §3), and the plan asked for "a partial tube". 150° is inside every family's geometry.
- **Domain:** c ∈ [0, 150]. Refusing c < 0 (a crowned road) is a scope decision, not geometry: nobody asked for it. Allowing it later is a new decision, not a bug.

**V3 · The shape rule ψᵢ = c·Fᵢ/F_edge is KEPT, for cup pieces only.**
- It is monotone for c ≥ 0 because every FLOORS row is non-decreasing (checked, row 2).
- It keeps each family's character: where along the half-width the rise happens.
- The bowl's last quarter is a constant-ψ plank, so at c = 90 the bowl's outer eighth of the width is a vertical board. That is the measured bowl, scaled; it is not a defect. G2 names it so the keeper sees it coming.

**V4 · MISSING from the plan, and sealed here (row 1b): the cross-section must be continuous along the road.**
- The adapter emits ONE profile per 2 m segment, evaluated at the segment's middle, with `blend: null` (`src/core/adapter.js` toSegments). The mesh then zips consecutive segments that differ with a SEAM (`src/geom/mesh.js` "SEAMS").
- For a cup that changes along the piece, that is a stair-step. checked (`stepprobe.js`, w = 31 m, at the Bloss blend's steepest point) — the wall tip jumps at every 2 m boundary by:

  | family | ramp | step at the edge | tip jump |
  |---|---|---|---|
  | bowl | 15.5 → 90 over 100 m | 2.235° | 0.327 m |
  | bowl | 15.5 → 90 over 40 m | 5.588° | 0.817 m |
  | bowl | 15.5 → 150 over 40 m | 10.088° | 1.412 m |
  | half-pipe | 15.5 → 90 over 40 m | — | 0.55 m |
  | half-pipe | 15.5 → 150 over 40 m | — | 0.954 m |

- Nothing checks it today:
  - inferred: validate's seam-angle check compares stations of ONE segment only (`src/validate/index.js`, `S[i + 1].seg === p.seg`);
  - raygap skips faces that face along the road, which is what a zip is (`src/validate/raygap.js` FACING).
- A car riding the wall would hit a face up to 1.4 m tall every 2 m.

**V5 · MISSING from the plan: the Extend fit rings past its target.** checked (`overshoot.js`, r channel, 15.5 → 150, the same fit every channel gets):

| piece length | transition | peak value | end value | largest control point |
|---|---|---|---|---|
| 100 m | 100 m | 150 | 150 | 150 |
| 100 m | 40 m | 153.750 | 150.871 | 167.18 |
| 60 m | 20 m | 163.019 | 144.499 | 220.93 |
| 30 m | 10 m | **174.653** | 165.475 | 296.94 |
| 200 m | 15 m | 172.303 | 150.115 | 234.69 |

- The ringing happens whenever the transition is short against the 20 m knot spacing.
- The typed 150 therefore becomes a document past the bowl's 159.68° touch. The MAX guard must bind the DOCUMENT (row 2), and the readout must report the document, not the typed value (row 7).
- inferred: the same ringing exists today for bank, width and the others. It is outside D190 except where it breaks MAX, and it is named here so nobody is surprised.

**V6 · Which pieces are cup pieces (sealed, the least-change reading of the plan's "the r rate cap … stays for legacy docs and the brush").**
- A road piece is a **cup piece** when:
  - a cup was set on it explicitly (an Extend `c` target, or a brush on `c`); or
  - it was extended after a cup piece.
- Otherwise it is **legacy**: rendered by `profileAt(family, w, r)` exactly as at c964c2d, and that includes a new track whose user never types a cup.
- So a user who never touches cup sees nothing change, and the whole existing suite keeps its expected values.
- **This is a choice the chair may overrule** (e.g. "new tracks start as cup pieces at the family's edge"). If overruled, rows 5d and 5e change and nothing else does.

---

## §1 Definitions (the words every row uses)

- **The `c` channel.** It is named `c` in the document, the readout and the brush (the UI may label it "cup °").
  - A clamped cubic B-spline in the piece's own s, like the others, with shared knots. Its value is the cross-section's edge angle ψ at u = +w/2 AND at u = −w/2, in DEGREES.
  - Its quantum must be ≤ 1e-4° so it cannot eat the 0.05° tolerance (`DEC.c`; 6 decimals, like r, is the obvious choice). inferred.
- **A cup piece's profile at a station:** ψ at AT = [¼, ½, ¾, 1] of each half-width = c(s)·FLOORS[family][i]/FLOORS[family][3], in degrees, both sides.
  - Linear in u between, ψ(0) = 0, symmetric.
  - The r cap does NOT apply to it.
- **Rendered:**
  - the adapter's segments (`toSegments`);
  - the lifted path (`toPath`);
  - the mesh (`buildMesh`);
  - for a closed lap, the export's kn5 (`buildFromSegments`).
  - This is the chain the app uses (`app/core/coreshell.js` exportTo).
- **Edge ψ of a mesh row:** the angle between the row's outermost vertex normal on a side and its centre-vertex normal, `acos(n_edge · n_centre)`. It is readable from the mesh alone, so B does not have to trust A's profile code to measure it.

---

## §2 The rows

### Row 1 · The edge ψ equals c

**1a · The rule.**
- **CHECK:** for every family, w ∈ {8, 12, 31, 50} m and c ∈ {0, 15.5, 30.6, 45, 90, 120, 150}, the profile the core builds for a cup piece has edge ψ = c on BOTH sides, |Δ| ≤ 0.05°. Expect ~1e-12; 0.05 is the plan's bound.
- **FAIL:** any side off by more than 0.05°; the r cap binding on a cup piece (visible at w = 8 and 12); degrees and radians crossed.
- **PLANTED:**
  - K1a-1: apply the r cap to a cup piece. At bowl w = 12, c = 90 the edge comes out capped, not 90.
  - K1a-2: set only the left edge.
  - K1a-3: treat c as radians.
  - All three must be caught.

**1b · Along the piece, on the rendered road (V4).**
- **CHECK:** on a cup piece whose c ramps 15.5 → 90 over 40 m, and 15.5 → 150 over 40 m (bowl and half-pipe, w = 31), for every mesh row:
  - (i) its edge ψ (§1) lies within [min c, max c] over [s − 2 m, s + 2 m], widened by 0.05°;
  - (ii) consecutive rows' edge ψ differ by ≤ 1.0°, the mesh's own `maxSeamDeg` (FINDINGS §2: seams under about 1°);
  - (iii) no SEAM zip mesh is emitted between two segments of one cup piece.
- **FAIL:** any of (i)–(iii).
- **PLANTED:**
  - K1b-1: today's adapter behaviour, one profile per segment with `blend: null`, on the 15.5 → 90 over 40 m ramp. The step is 5.588° (checked), so (ii) must fire.
  - K1b-2: evaluate c at the segment's START instead of its middle, which violates (i) by up to one segment of slope. Caught when the slope is ≥ 0.05°/m, which the 40 m ramps are.
- inferred, and A's to choose: one way to pass is to give each cup segment `blend: { from: the previous segment's profile, s0: 0, length }`. The mesh then places rows by its seam-angle rule inside the blend, and the rows coincide at segment boundaries, so no zip is emitted.

### Row 2 · Monotone, non-self-intersecting, and bounded by MAX = 150°

- **CHECK:**
  - (i) For every family, w ∈ {8, 12, 31, 50} and c ∈ {0, 15.5, 30.6, 45, 90, 120, 150}: ψ is non-decreasing from the centre out on both sides, and each wall tip's lateral offset X(w/2) is **> 0**, i.e. the walls do not meet. At c = 150 the tip ratio X_tip/(w/2) must be ≥ 0.05 (measured bowl 0.0578, flat 0.1876, half-pipe 0.4737).
  - (ii) A document holding ANY c control point outside [0, 150] is refused by name at `checkDoc`/`parse`.
  - (iii) No operation produces one. That covers extend (including the ringing cases in V5: 30 m piece, 10 m transition, target 150), the brush on c, close and migration: each either stays inside [0, 150] or is refused by name, never silently past it.
  - (iv) The bound on c(s) comes from its control points, which needs the B-spline basis's NON-NEGATIVITY (with partition of unity, already on the shelf, ref 03 §1). That property must be written on the shelf with its source before it is used (§4).
- **FAIL:**
  - a profile below MAX whose walls meet (the plan's stop rule, NOT GREEN);
  - ψ decreasing anywhere outward;
  - a document with c > 150 or c < 0 accepted;
  - extend(target 150, length 30, transition 10) leaving any c value > 150.
- **PLANTED:**
  - K2-1: raise MAX to 165. (i) must fire: bowl tip X < 0 at 165. checked: the tip ratio is −0.0018 at 160 and −0.0517 at 170. (ii) must fire on a c = 165 document.
  - K2-2: remove the document guard, keeping only a typed-value clamp in the UI. (iii) must fire on the V5 ringing case (today 174.653°).
  - K2-3: a non-cumulative shape, ψᵢ = c·(Fᵢ − Fᵢ₋₁)/F_edge. It is not monotone for the bowl (5.9, 6.9, then 0), so (i) must fire.
- checked, and the reason this row cannot lean on the export: with the cup profile at c = 165 on a bowl, **today's export does not report a self-intersection.** The mesh's `selfCheck` skips pairs closer than 25 m along the road, so the two walls of ONE station are never compared. The only red is an incidental `downforce-ray-gap` (`wallprobe.js`: "bowl c=165" → reds `{downforce-ray-gap: 1}`). The guard has to be the cup's own.

### Row 3 · Continuity across joints: c and dc/ds

- **CHECK:**
  - (i) `c` is in `CHANNELS`, so every road joint's `jointProblem` holds it to C1: value within 1.01 quantum, slope within the existing tolerance.
  - (ii) After a flight, c is CARRIED like φ, w and r, not reset like κh, κv, h and l (`endState` and `checkDoc`'s after-flight state).
  - (iii) On a closed lap the seam holds c(L) = c(0) and c′(L) = c′(0), as close.js holds every channel at the seam (ref 10 §3).
  - (iv) At a LEGACY → CUP joint, the rendered edge ψ is continuous (≤ 0.05° across the joint) and the step between the two rows at the joint is ≤ 1.0° (row 1b's bound), with no zip.
- **FAIL:** a document with a 1° step in c at a joint accepted; c reset to 0 after a jump; a closed lap with c(0) ≠ c(L); a legacy → cup joint whose rendered edge steps by more than 0.05°.
- **PLANTED:**
  - K3-1: leave `c` out of the channel list `jointProblem` walks. A hand-built doc with a 5° step in c must still be refused `JOINT`.
  - K3-2: reset c in `endState` after a flight (copy the κh line).
  - K3-3: leave c out of close's seam rows.
  - K3-4: start the cup piece after a legacy F3 piece at the family's nominal edge (15.5) instead of the rendered one (11.679 at w = 12). (iv) must fire. checked: that is a 3.82° step.

### Row 4 · Mesh, export and validate accept c = 90 and c = MAX; what AC does at vertical walls

- **CHECK:** a closed lap (the fixture F1 lap) with the four turns at c = 90 and at c = 150, for each family at w = 31, and the start straight left uncupped, goes through the app's export route (`buildFromSegments`, `csp: true`, the default):
  - (i) mesh, markers, kn5 write and read-back, and AI line all complete, with **no red**;
  - (ii) with `csp: false`, validate reds `steep-without-raycast`, which is the correct refusal and must fire;
  - (iii) with the start straight itself cupped to 150, the export is refused by NAME at the grid ("the start straight's floor is … m wide, too narrow for a two-column grid"), not by a crash.
- **FAIL:** any throw that is not a named refusal; a red other than those named; `csp: false` passing with walls past 50°; NaN in any mesh buffer; a kn5 that does not read back.
- checked, on c964c2d with a hand-built cup profile put on the segments (`wallprobe.js`, 1,491 m lap):
  - `csp: true` passes for bowl, half-pipe and flat at 90 and at 150, and half-pipe at 180;
  - `csp: false` gives exactly one red kind, `steep-without-raycast`, in every cupped case;
  - bowl 159 and 165 → `downforce-ray-gap`;
  - export time 1.2 s uncupped, 3.2–3.9 s at 90, 5.4–6.3 s at 150 (the cross-section is sampled at ≤ 1° of ψ, so the rows get wider);
  - a cupped start straight at 150 is refused by name (floor 4.45 m bowl, 4.23 m half-pipe, 3.32 m flat).
- **PLANTED:**
  - K4-1: drop the `csp === false` steep check. (ii) must fire.
  - K4-2: K2's guard removed, and a bowl at c = 165 exported. The row must see it refused AT THE DOCUMENT (BAD_CUP or the name A chooses), never reaching the export's incidental raygap red.
- **What the AC surface does at vertical walls:**
  - inferred, from ARCHITECTURE.md:87 (community-reported): vanilla AC tyres ignore surfaces steeper than ~50°. Walls past that need CSP's wall raycasting. The export writes CSP's extended physics by default (`WAV_PITCH=extended-0`, `src/export/trackfiles.js:68`) and warns that it is CSP-only.
  - inferred, from FINDINGS §4c: every road surface, walls included, gets the soft-collision block (`SOFT_ERP 0.8`, `MAX_DEPTH 4`).
  - checked, in FINDINGS §3 and §1: real T-180 cars ride road tilts of 100–133° in turns at speed, and the steepest point across real sections reaches 86–90° in the top 10%. Overhangs are unmeasured (§1: triangle winding is inconsistent).
  - inferred, from `validate` lines 199–205: on a STRAIGHT (κ = 0) nothing presses a car into a wall. At ψ ≥ 90° the normal load there is gravity's component alone, ≤ 0, so a car cannot stay on it. The validator flags high loads but has no check for a NEGATIVE normal load, so such a wall exports green. That is physics, not a D190 defect; G names it for the keeper.
  - inferred: the downforce ray (`raygap.js`, 1.0 m) reds wall tips closer than ~1 m, so a bowl at 150° on a road narrower than ~17.3 m (tip gap 0.0578·w) will be refused at export by name. Not run.
  - inferred: a pit lane joins only an edge of at most 35° (`src/geom/pitlane.js` JOIN_MAX), so it cannot join a cupped stretch past that. It is refused by name. Not run.

### Row 5 · Migration: every /2 fixture renders identically as /3

- **THE FIXTURES:**
  - Nine documents, generated at c964c2d by `fixtures.js` (Appendix A, verbatim) and registered in the manifest (Appendix B, verbatim). They are F1–F9.
  - checked, as a count of keeper's files on disk: `%APPDATA%\com.solariz3d.t180-track-builder\tracks` holds **0** files. There is no saved /2 track to migrate on D.
  - checked: no /2 fixture file exists in the t180 repo. Every /2 document the tests use is built in code.
  - So these nine ARE the /2 corpus. A copies them into `test/fixtures/` (generated from a c964c2d tree: `git archive c964c2d`, then `node fixtures.js <that tree> <out>`) together with the manifest.
  - What they cover:

    | fixture | what it covers |
    |---|---|
    | F1 | default bowl lap, closed, kn5 |
    | F2 | default half-pipe lap, closed, kn5: the last-bit case |
    | F3 | bowl at 12 m, where the cap binds |
    | F4 | half-pipe with width 31.5 → 12 along s |
    | F5 | flat 20 m with bank 30 |
    | F6 | r brushed |
    | F7 | a hill (h), a flight, and the road after it |
    | F8 | three families in a row |
    | F9 | empty |

- **"IDENTICALLY" means these bytes** (`fixtures.js`, header): for each fixture FILE, parsed by the new code (the /2 → /3 migration), sha256 must equal the manifest's for every key present:
  - `segs`: the JSON of every segment `toSegments` emits, keys sorted. JSON prints a double so that it reads back bit-equal, so this covers every profile u/ψ, k0/k1, kp0/kp1, roll and length. A NEW key on a legacy segment is a difference.
  - `path`: Float64 bytes of every sample's s, pos, T, L, U, kvec, roll, bankG, grade.
  - `mesh`: every mesh's name plus the raw bytes of each typed array, in walk order.
  - `kn5`: the exported kn5's bytes (F1 and F2).
  - `F9`: the adapter's refusal code, "refused EMPTY".
- **CHECK:**
  - 5a: `node fixtures.js <new tree> <fixtures dir> --check` → "0 of 9 differ".
  - 5b: each fixture parsed, serialised (schema now `t180b.core/3`) and parsed again renders to the same digests (the /3 round trip).
  - 5c: extending a migrated F3 with an explicit cup target starts c at the legacy piece's rendered end edge (row 3 iv).
  - 5d: extending a migrated F3 with NO cup typed renders the new piece exactly as c964c2d's extend would (legacy continues; V6).
  - 5e: a brush on c whose window covers part of a legacy piece either leaves every segment outside the window bit-identical (ref 10 §2's locality rule) or is refused by name.
  - checked, 5a on c964c2d itself in a fresh process: **0 of 9 differ** (`fixtures-check-c964.txt`). The digests are deterministic across processes on D.
- **FAIL:** any fixture differing in any key (the plan's stop rule, NOT GREEN); a /3 file that does not round-trip; a migrated track whose next piece's shape changes without a cup being typed.
- **PLANTED:**
  - K5-1: the plan's own migration, the capped edge used as c with the proportional shape. checked: **6 of 9 differ** (F2 in segs, mesh and kn5; F3, F4, F5, F6 and F8 in segs and mesh). F1, F7 and F9 stay identical because the bowl default is bit-exact. `fixtures-check-planted.txt`.
  - K5-2: serialise still writing `t180b.core/2`. 5b must fire.
  - K5-3: migration that fills c and then renders legacy pieces from c at c = the nominal family edge. 5a must fire on F3.

### Row 6 · Cup ⟂ bank: bank 30 + cup 60 = cup-then-roll

- **CHECK:** at a level straight station with φ = +30° (left side up), c = 60°, w = 30, for each family:
  - the left edge's surface is at **90°** to gravity, the right edge at **30°**, the centre at **30°**, and bankG is **30°**, each ± 0.05°;
  - and φ = −30° mirrors it (right 90, left 30).
- **Also:** typing a cup changes none of turn, climb or bank in the readout. The same Extend with and without a c target gives identical `turnDeg`, `climbDeg`, `bankFromDeg`, `bankToDeg` and `pitchFrom/To`, and an identical path digest, because cup does not move the centreline.
- **FAIL:** any edge off by more than 0.05°; the centreline or bank readout changed by a cup.
- checked (`bankprobe.js`, a cup profile on a segment rolled 30°): bowl, half-pipe and flat each give left 90.000000, centre 30.000000, right 30.000000, bankG 30.000000.
- **PLANTED** (both checked caught):
  - K6-1: cup applied in the world frame, "roll then cup", ψ_left = c − φ and ψ_right = c + φ. Gives left 60, right 60.
  - K6-2: the roll not applied to a cup piece. Gives 60 / 0 / 60.
  - K6-3, inferred: a cup piece that feeds c into the roll channel (bank changes with cup). The "also" check must fire.

### Row 7 · The readout matches

- **CHECK (core, A):** `pieceReadout(doc, i)` gains `cupFromDeg` and `cupToDeg`:
  - for a cup piece: c(0) and c(L), in degrees, |Δ| ≤ 1e-9 against `channelAt`;
  - for a legacy piece: the edge ψ of `profileAt(family, w(0), r(0))` and of `profileAt(family, w(L), r(L))`, which is what the road renders;
  - for a flight: carried from the previous road piece's end, like bank.
  - `candidateReadout` equals the placed piece's readout, bit for bit (the existing rule).
- **CHECK (UI, C):** the Extend panel has a `cup °` field (an empty field means no target, i.e. continue). The readout box shows cup from→to with the bank cell's rounding, and each shown number equals the core readout rounded the same way. The brush's channel list gains `cup` (channel `c`). The on-track labels stay as they are.
- **FAIL:** a cell that differs from the core readout after rounding; a legacy piece reading the family's nominal edge instead of its rendered one; cupToDeg that is the typed target when the document holds something else.
- **PLANTED:**
  - K7-1: cupToDeg returns the typed target. Caught where the document differs from it: a brushed c near a piece's end moves the document, and the readout must move with it.
  - K7-2: legacy readout from FLOORS alone, ignoring w and r. On F3 it reads 15.5 where the road renders 11.679.
  - K7-3: radians shown.
  - K7-4 (UI): the cup cell wired to the bank values.

### Row 8 · G: what "closer to a half pipe" must look like in the keeper's hands

The keeper's words (plan, 14:2x): *"not an increased level of banking in a straight like turning it closer to a half pipe"*. Scored by the keeper in the installed app, not by B.

- **G1:** on a straight, Extend 100 m with cup 90 and nothing else typed. The road does not turn, climb or tilt (row 6's "also" makes this checkable beforehand). Looking down the road, the cross-section deepens symmetrically: both walls rise together, the floor's centre stays level, and at the end both edges stand vertical. Bank still does what it did: it rotates the whole section.
- **G2:** the dial reads as depth.
  - c = 0 is a flat ribbon.
  - ~15 is today's bowl.
  - ~31 is today's half-pipe.
  - 90 is a U.
  - 150 is a partial tube open at the top, with a slot of about 6% of the width on a bowl and 47% on a half-pipe.
  - The bowl's outer eighth is a straight board (V3). Said now so it is not read as a glitch.
- **G3:** bank 30 on a cup-60 piece rolls the whole U, and the left wall stands exactly vertical (row 6).
- **G4, the falsifier, registered now:** if the keeper, trying it, says it tilts the road, feels like more banking, steps, or "is not what I meant", D190 is NOT GREEN whatever rows 1–7 say.
- **Said in advance so it is not a surprise:** a vertical wall on a STRAIGHT has nothing holding a car to it (row 4, inferred). Walls are ridden through turns at speed, as on the real tracks (FINDINGS §3).

---

## §3 Stop rules

- The plan's two stand: any /2 fixture that renders differently = NOT GREEN; a profile that self-intersects below MAX = NOT GREEN.
- Added:
  - Any document holding c outside [0, 150] = NOT GREEN.
  - A zip seam or a > 1° edge step inside a cup piece (row 1b) = NOT GREEN.
  - A planted control that is NOT caught = the test is broken; the row is unscored until it catches.

## §4 Maths the builders must shelve before use (the math rule)

- **The cup shape rule** (§1). It is a normalisation of the MEASURED floors, not a derived law. It goes into ref 09 as a new section, sourced to `src/geom/fonts.js` FLOORS / `fontshape.json` and to this seal, the way ref 09 §3 sources the rate cap.
- **Non-negativity of the B-spline basis**, hence c(s) ∈ [min, max] of its control points (the convex-hull property). This is NOT on the shelf: ref 03 §1 lists partition of unity only. checked: `grep -i "non-negative\|convex"` in `references/` finds nothing on it. It is to be added with its source (WIKI-BSPLINE or LYCHE-MORKEN) before row 2 (ii)/(iv) leans on it.
- Row 6 uses no new formula: it uses profile.js's normal n = cos ψ·U − sign(u)·sin ψ·L with path.js's frame.

## §5 What this seal does not establish

- Nothing was built, and no AC was launched. Every AC statement in row 4 is inferred from FINDINGS, ARCHITECTURE and the code.
- The probes put a hand-built cup profile on c964c2d's segments. They measure today's mesh, validate and export on that profile, not A's code.
- The fixture digests are proven stable across processes on D (0 of 9 differ). They are not proven stable across machines or node versions: Math.sin and Math.cos are not guaranteed correctly rounded. If L or another node version is ever used for 5a, it is re-baselined from c964c2d there first, and that is said.
- 17.3 m (the narrow-bowl raygap width) and the pit-lane refusal are inferred, not run.
- V6 is a reading of the plan, and the chair may overrule it (see V6).

## §6 Instruments and evidence (scratchpad, not committed)

- Directory: `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\d190\`.
- `t/` is a clean `git archive c964c2d`. `tmut/` is the K5-1 plant.
- Each probe runs under the heavy-run lock: `node --max-old-space-size=4096 -e "require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({cmd}); require('./<probe>')"`.

| file | sha256 | output |
|---|---|---|
| `maxprobe.js` | `631e873410d86b59…` | `maxprobe.txt` |
| `migprobe.js` | `1b25be1ff3859e3d…` | `migprobe.txt` |
| `wallprobe.js` | `6fba3217e5d74ee1…` | `wallprobe.txt` |
| `bankprobe.js` | `a4228d12cbe8ff94…` | `bankprobe.txt` |
| `overshoot.js` | `1980ad1a4af8ba87…` | `overshoot.txt` |
| `stepprobe.js` | `6215ba158309749f…` | `stepprobe.txt` |
| `fixtures.js` | `d24dcf49f8826d2b366df0ea33d393445cb0828a5053419901556cce15de1352` | `fixtures-make.txt`, `fixtures-check-c964.txt`, `fixtures-check-planted.txt` |
| `fixtures/manifest.json` | `05be6acc0351a7fc191b73233c7e9e92aaf10e055cfbdd71b513e7c5e940b59a` | — |

Corrections I made to myself while measuring:
- The first wall-probe run never reached validate: my test lap's close had bent the start straight (22 m longest straight). Fixed with `close(doc, { edited: [0] })`, as the app's lap test does.
- The first planted run of K5-1 was not planted at all. Python is absent, the edit silently did nothing, the grep count said 0, and the run said "0 of 9 differ". Re-applied with node: count 1, 6 of 9 differ.

---

## Appendix A · `fixtures.js` (verbatim; sha256 d24dcf49f8826d2b366df0ea33d393445cb0828a5053419901556cce15de1352)

```js
// D190 row 5 (pane E): the /2 MIGRATION FIXTURES and their RENDER DIGESTS, made at t180 c964c2d (the last code that writes /2).
//   node fixtures.js <t180 tree> <out dir>          writes <name>.core2.json per fixture and manifest.json
//   node fixtures.js <t180 tree> <out dir> --check  re-renders every fixture FILE in <out dir> with <t180 tree>'s code (after
//                                                   parse, i.e. after the /2 → /3 migration) and compares every digest
// A digest is sha256 over canonical BYTES, never over a float printed short:
//   segs  JSON of every segment the adapter emits (toSegments), keys sorted; JSON prints a double so it reads back bit-equal
//   path  Float64 little-endian bytes of every path sample's s, pos, T, L, U, kvec, roll, bankG, grade (toPath, lifted)
//   mesh  every mesh of buildMesh's scene, in walk order: its name, then the raw bytes of each typed array it carries
//   kn5   the exported kn5's bytes (closed fixtures only; buildFromSegments with its defaults)
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [, , TREE, OUT, flag] = process.argv;
const T = path.resolve(TREE) + '/';
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), { close } = require(T + 'src/core/close.js');
const AD = require(T + 'src/core/adapter.js'), SC = require(T + 'src/core/sculpt.js'), { buildMesh } = require(T + 'src/geom/mesh.js');
const { walkScene } = require(T + 'src/export/markers.js'), FW = require(T + 'src/export/fromwords.js'), { startLayout } = require(T + 'app/core/coreshell.js');
const DEG = Math.PI / 180, sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

const sortKeys = (x) => (Array.isArray(x) ? x.map(sortKeys) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, sortKeys(x[k])])) : x);
function digests(doc) {
  if (!doc.pieces.length) return { segs: refusal(() => AD.toSegments(doc)) };   // an empty track: the adapter's refusal is the render
  const segs = AD.toSegments(doc), { path: p } = AD.toPath(doc);
  const f = []; for (const m of p.samples) f.push(m.s, ...m.pos, ...m.T, ...m.L, ...m.U, ...m.kvec, m.roll, m.bankG, m.grade);
  const mesh = buildMesh(p, segs), parts = [];
  for (const m of walkScene(mesh.scene).meshes) { parts.push(Buffer.from(String(m.name))); for (const k of Object.keys(m).sort()) { const v = m[k]; if (ArrayBuffer.isView(v)) parts.push(Buffer.from(k), Buffer.from(v.buffer, v.byteOffset, v.byteLength)); } }
  const out = { segs: sha(JSON.stringify(sortKeys(segs))), path: sha(Buffer.from(Float64Array.from(f).buffer)), mesh: sha(Buffer.concat(parts)), meshParts: parts.length };
  if (doc.closed) {
    const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift = (q) => AD.offsetPath(doc, segs, q);
    const ex = FW.buildFromSegments(segs, { name: 'fixture', via: 'fixture', liftPath: lift, start }, { markers: startLayout(segs, lift, start) });
    out.kn5 = sha(Buffer.from(ex.kn5.buffer ? Buffer.from(ex.kn5.buffer, ex.kn5.byteOffset, ex.kn5.byteLength) : ex.kn5));
  }
  return out;
}
function refusal(fn) { try { fn(); return 'NOT_REFUSED'; } catch (e) { return `refused ${e.code}`; } }

// ── the fixtures (each a pure function of c964c2d's core; names say what each one covers) ──
const R = 180, Q = Math.PI * R / 2;
const lap = (family, width) => {
  let d = D.createDoc(`F lap ${family}`);
  d = extend(d, { length: 300, family, first: width ? { w: width } : undefined });
  for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
  d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } });
  const r = close(d, { edited: [0] }); return r.doc || r;
};
const FIX = {
  'F1-bowl-default-lap-closed': () => lap('bowl'),
  'F2-halfpipe-default-lap-closed': () => lap('half-pipe'),
  'F3-bowl-narrow-12m-cap-binds': () => { let d = D.createDoc('F3'); d = extend(d, { length: 120, family: 'bowl', first: { w: 12 } }); d = extend(d, { length: 150, transition: 60, targets: { kh: 1 / 90, phi: 25 * DEG } }); return extend(d, { length: 150, transition: 60, targets: { kh: -1 / 120, phi: -20 * DEG } }); },
  'F4-halfpipe-width-31.5-to-12-along-s': () => { let d = D.createDoc('F4'); d = extend(d, { length: 100, family: 'half-pipe' }); return extend(d, { length: 200, transition: 200, targets: { w: 12, kv: 0.002 } }); },
  'F5-flat-20m-bank-30': () => { let d = D.createDoc('F5'); d = extend(d, { length: 80, family: 'flat', first: { w: 20 } }); return extend(d, { length: 160, transition: 80, targets: { phi: 30 * DEG, kh: 1 / 150 } }); },
  'F6-bowl-r-brushed': () => { let d = D.createDoc('F6'); d = extend(d, { length: 200, family: 'bowl' }); d = extend(d, { length: 200 }); return SC.brush(d, { mode: 'value', channel: 'r', s0: 210, r: 60, delta: -2.2 }).doc; },
  'F7-hill-then-jump': () => { let d = D.createDoc('F7'); d = extend(d, { length: 200, family: 'bowl' }); d = SC.brush(d, { mode: 'hill', s0: 90, r: 50, delta: 4 }).doc; d = D.appendPiece(d, D.flightPiece({ gap: 30, drop: 2, land: -0.05 })); return extend(d, { length: 120 }); },
  'F8-mixed-families': () => { let d = D.createDoc('F8'); d = extend(d, { length: 100, family: 'flat' }); d = extend(d, { length: 100, family: 'bowl', transition: 50, targets: { w: 31 } }); return extend(d, { length: 100, family: 'half-pipe', transition: 50, targets: { w: 31.5, r: 4.55 } }); },
  'F9-empty': () => D.createDoc('F9 empty'),
};

fs.mkdirSync(OUT, { recursive: true });
if (flag !== '--check') {
  const manifest = { made_at: 't180 c964c2d', schema: D.SCHEMA, fixtures: {} };
  for (const [name, make] of Object.entries(FIX)) {
    const doc = make(), text = D.serialize(doc), file = `${name}.core2.json`;
    fs.writeFileSync(path.join(OUT, file), text);
    const d1 = digests(D.parse(text)), d2 = digests(D.parse(fs.readFileSync(path.join(OUT, file), 'utf8')));
    if (JSON.stringify(d1) !== JSON.stringify(d2)) throw new Error(`${name}: the render is not deterministic within one process`);
    manifest.fixtures[name] = { file, text_sha256: sha(text), pieces: doc.pieces.length, closed: doc.closed, render: d1 };
    console.log(name, JSON.stringify(manifest.fixtures[name]));
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
} else {
  const manifest = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8')); let bad = 0;
  for (const [name, m] of Object.entries(manifest.fixtures)) {
    const text = fs.readFileSync(path.join(OUT, m.file), 'utf8');
    if (sha(text) !== m.text_sha256) { console.log(`${name}: FIXTURE FILE CHANGED`); bad++; continue; }
    const got = digests(D.parse(text)), diff = Object.keys(m.render).filter((k) => got[k] !== m.render[k]);
    console.log(`${name}: ${diff.length ? `DIFFERS in ${diff.join(', ')}` : 'identical'}`); if (diff.length) bad++;
  }
  console.log(`${bad} of ${Object.keys(manifest.fixtures).length} differ`); process.exitCode = bad ? 1 : 0;
}
```

## Appendix B · `fixtures/manifest.json` (verbatim; sha256 05be6acc0351a7fc191b73233c7e9e92aaf10e055cfbdd71b513e7c5e940b59a)

```json
{
 "made_at": "t180 c964c2d",
 "schema": "t180b.core/2",
 "fixtures": {
  "F1-bowl-default-lap-closed": {
   "file": "F1-bowl-default-lap-closed.core2.json",
   "text_sha256": "0c8a78d1358ff21a733c5798896e0c780d3e1276a6a966320ee8e0d7ecb6d2af",
   "pieces": 6,
   "closed": true,
   "render": {
    "segs": "d816d7f7ec3d6fcddc434447553aa29f67b08d26336e1c84c79102b3486ad881",
    "path": "d689f782e32b2e454403aee4a07d3d21814d0b7db9cdb4257a42bc8ac005f8e5",
    "mesh": "60b99fb112d106a3eb80c5c3930aa4a0ac3164ac105e98eda3fbeeda4b6bfdb7",
    "meshParts": 3745,
    "kn5": "f3d6a3face7470effa1a57afbed02274e9fb80e6cf88d242759c4d5f4ff659dc"
   }
  },
  "F2-halfpipe-default-lap-closed": {
   "file": "F2-halfpipe-default-lap-closed.core2.json",
   "text_sha256": "465b8caadac60fc5f4eb0d05afd7a618b42e334585951bb14a0c21c03851ce1a",
   "pieces": 6,
   "closed": true,
   "render": {
    "segs": "5fdbc30e4e0e1854045ac025e5fdb817a9876b8246e5a32ccf0423691d19df8b",
    "path": "d689f782e32b2e454403aee4a07d3d21814d0b7db9cdb4257a42bc8ac005f8e5",
    "mesh": "d0e2806c49debfcf590d16714e92dd6ee97ff3dec54d4a9792ac802f93757ffa",
    "meshParts": 3745,
    "kn5": "9cef8b8bbb40272991884abc9980365a1c1335880db192656a5257ad4fe67f51"
   }
  },
  "F3-bowl-narrow-12m-cap-binds": {
   "file": "F3-bowl-narrow-12m-cap-binds.core2.json",
   "text_sha256": "83b83ace2b2c45ae5ab96a004cf3df04d7ccb4c3e10d598cfdd2e319ac33ed2d",
   "pieces": 3,
   "closed": false,
   "render": {
    "segs": "e4a0344fbaa24967b100880fe34b510c253624f977cb6aa32e6ce356575279e2",
    "path": "70907e693b630ed51e7ba0718d687ed5d42f7fdfc6c22435a95fd54b7cdd0501",
    "mesh": "26d5916b9c173962a8bdb41b28f075d74984ddbdaa1ea3ef2371810fec19c69e",
    "meshParts": 1050
   }
  },
  "F4-halfpipe-width-31.5-to-12-along-s": {
   "file": "F4-halfpipe-width-31.5-to-12-along-s.core2.json",
   "text_sha256": "e64f813c5f438b7bcb82e4763645ce1a9f1586b60c83169b84d8d3176750f770",
   "pieces": 2,
   "closed": false,
   "render": {
    "segs": "5642afa4319495f699031c795dd0c04a2acd298936caa84eecb21755c4fece5c",
    "path": "643f4b3f2e713b0eb7207f32558f676da1b29b8cec079bc694900a5a026bb318",
    "mesh": "5fea7a30e4026f1bdf841ffc5c8ccafab67b5eb7f6fb47c4495e921ea3415064",
    "meshParts": 1250
   }
  },
  "F5-flat-20m-bank-30": {
   "file": "F5-flat-20m-bank-30.core2.json",
   "text_sha256": "2b5adf2ed9ff7ed533bbbbd00f9483b608f4fad4050fb7078e5a60c0a3578797",
   "pieces": 2,
   "closed": false,
   "render": {
    "segs": "f37ef9665d37d73002a463129c01f97eeeaf8fa4fea44e25ac44861d7b91d2d4",
    "path": "e9a962198f3441169a9ad48dae3450287c736a1a61940be78d4c3abff5260669",
    "mesh": "829a4449e68f5697b4b2c124df942a390829ccd2151941e09d985703bf884a3a",
    "meshParts": 600
   }
  },
  "F6-bowl-r-brushed": {
   "file": "F6-bowl-r-brushed.core2.json",
   "text_sha256": "2e6af793422c085534a412e21d3feaca9a71271234cb8f441fe1448a7a7041ef",
   "pieces": 2,
   "closed": false,
   "render": {
    "segs": "35e85953972f2d5b6954aae89ed5bc783935fb5ac423d1658b652560e275f056",
    "path": "9326ec158697955fb3a6e00d4fab697164fee157fb1d879940d6af6421e88a27",
    "mesh": "5d3e2e51d52ea99ef0f9b11b2cc72fb84aaa52dc93d91edd6d92c4abf9dcff90",
    "meshParts": 1105
   }
  },
  "F7-hill-then-jump": {
   "file": "F7-hill-then-jump.core2.json",
   "text_sha256": "b071b48380a75a158df0cdaf89c62007710b9ee1a10ec364bfe3b8dd4d1f6755",
   "pieces": 3,
   "closed": false,
   "render": {
    "segs": "0da1ae2bd5f461de272f06caba70456f97240966975e9bff61aa8e8645d68f9e",
    "path": "710df38a2ae085543f6e7d7be9c48a8d1b6b8731950c3aa1667a38c510252014",
    "mesh": "6c45e85bd795922ce4dd11a686c597e1fd8ba465aadcdab8aa8ff7e5564d0883",
    "meshParts": 805
   }
  },
  "F8-mixed-families": {
   "file": "F8-mixed-families.core2.json",
   "text_sha256": "8090b467228d5f94672972eea590f995c0d52210811aeda2dd3e56988c509500",
   "pieces": 3,
   "closed": false,
   "render": {
    "segs": "f1cfb6970d512f4869bb9da9d539e4d233eea9640251386ae597f60fa1d4f8f7",
    "path": "447202421a049a3f82f40bc90a081300436c5b605bbfef4aeb242be31628f4f7",
    "mesh": "6dbabf747e7576dd4678af8547d036a79c1954a7a18e15c7c9b53e49d4965c89",
    "meshParts": 1250
   }
  },
  "F9-empty": {
   "file": "F9-empty.core2.json",
   "text_sha256": "f0eea64e97e55a17fdb9abb3491ef6cc29e2eb894e7016b55cede360c33ced84",
   "pieces": 0,
   "closed": false,
   "render": {
    "segs": "refused EMPTY"
   }
  }
 }
}
```

sha256 of every byte above this line (the file with this trailer line removed): 66344ea3285927d5808ebc09d267012a6eafa3d133cb453f2824c4fe56ee4c9d
