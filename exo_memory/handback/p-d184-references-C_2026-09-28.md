# D184 · packet C: the track-equations skill's references and known-answer evals (pane C, 2026-09-28)

This answers the chair's D184 packet C. The plan is `exo_memory/loop/plan_t180_equation_skill_2026-09-28.md`. The base is
t180 main 8868531.

**Nothing is committed.** All files land dirty, under `.claude/skills/track-equations/` (untracked).

## 1 · What was written (t180 repo, `.claude/skills/track-equations/`)
| file | sha256 (16) | bytes |
|---|---|---|
| references/README.md (the index, labels, conventions, how to run the evals) | 4c68b97a02bae114 | 2,959 |
| references/MATH_SOURCES.md (the citation index; "opened": primary / secondary / not opened) | b83726461f1bae22 | 5,278 |
| references/01_centreline.md (Möller–Trumbore, nearest-height hit, midpoint, the traps, E's equal chords) | 93e69779d4c5b137 | 3,832 |
| references/02_curvature.md (κ from position, the builder's tangent, midpoint rebuild, discrete κ, clothoid, smoothstep) | 0c96da4e35d7df51 | 3,068 |
| references/03_bsplines.md (Cox–de Boor, the LSQ fit, adaptive midpoint knots, DoF vs M4) | 3b8f3ea6e369956f | 3,005 |
| references/04_joints_closure.md (KKT G2 joints and closure, least-norm, what closure needs in 3-D) | d8eeb5a6d3a92e0b | 3,933 |
| references/05_flight.md (the projectile, the later root; T-180's fall of 3.2–6.3 g) | e95eb4d6a0c06a0d | 2,316 |
| references/06_surfaces.md (angle defect, known surfaces, torus, Gauss–Bonnet, the per-vertex bias, ELLIPTIC corners, the particle on a graph) | afb8b43ef2f43441 | 6,169 |
| references/07_fourier.md (the series, 1/k at a jump, M1, M4's table) | b4da4a13d454378f | 2,566 |
| references/08_what_failed.md (M3/M3b, the per-vertex bias, M2's coupling, M4's method, the control-less mutation run, the wrong car, the agent corrections) | 32fcbce228d34fd8 | 4,311 |
| evals/mathref.cjs (the reference implementations) | fb86d63c2324ca3f | 13,598 |
| evals/checks.js (25 known-answer checks, tagged by reference section) | ed8472bd90edca4b | 16,948 |
| evals/known_answers.test.js | efbf8412bf61169e | 582 |
| evals/mutation.test.js (24 mutants plus a CONTROL) | 8150b42413bf3c33 | 5,491 |

`evals/checks.js` requires `tools/meshcurv.cjs` from the repo root, and **that file is UNTRACKED** (sha256 ae13edda26ac6eea, from
M3/M3b). **It must be committed with the skill, or the surface checks cannot load.**

## 2 · The evals (the result)
**Run under the lock:**
- held from 2026-09-28T12:10:19.295Z, with `--max-old-space-size=4096`, via the scratchpad `lockrun.js`;
- the command: `node --test --test-concurrency=4 .claude/skills/track-equations/evals/known_answers.test.js .claude/skills/track-equations/evals/mutation.test.js`;
- the log: `scratchpad/d184/evals3.log`, sha256 07a647574f1222e2.

**50 tests, 50 pass, 0 fail:** the 25 checks, the CONTROL, and 24 mutants.

**The required known answers, each exercised:**

| required | check |
|---|---|
| sphere K = 1/R² | 06 §2 |
| cylinder and cone K = 0 | 06 §2 |
| torus K = cos v/(r(R + r cos v)) | 06 §3 |
| circle heading rate 1/R | 02 §2, 02 §3 |
| clothoid κ linear in s | 02 §4 |
| Σ defect = 2πχ | 06 §4 |
| ½v² + gz conserved | 05 §1; 06 §7 on a surface |
| closure after projection < ε | 04 §3 (< 1e-9·L); also 04 §2 (KKT, exact) |

**Plus the formulas the method uses:** Möller–Trumbore, nearest hit, midpoint, κ from position, the tangent, discrete κ,
smoothstep, Cox–de Boor, the LSQ fit, knot refinement, KKT G2 joints, least-norm, the later-root landing, the dished-corner K,
the particle on a graph, and Fourier with 1/k.

**Mutation: applied 24, caught 24, NOT APPLIED 0, not caught 0.** The control passes, so every catch is by a check green on the
original.

| mutant | caught by |
|---|---|
| K1 ray u + v ≤ 2 | 01 §1 |
| K2 hits behind the origin | 01 §1 |
| K3 first hit | 01 §2 |
| K4 ‖r′‖² | 02 §1 |
| K5 sin/cos swap | 02 §2 ×2 |
| K6 Euler | 02 §2 |
| K7 sum of arcs | 02 §3 |
| K8 κ ∝ s² | 02 §4 |
| K9 2u² − u³ | 02 §4 |
| K10 Cox–de Boor right term | 03 §1, 03 §2 |
| K11 refine every span | 03 §3 |
| K12 LSQ no Aᵀ | 03 §2, 04 §1 |
| K13 KKT no constraints | 04 §2 ×2 |
| K14 least-norm sign | 04 §3 ×2 |
| K15 no weights | 04 §3 |
| K16 no correction | 04 §3 |
| K17 g not halved | 05 §1 |
| K18 earlier root | 05 §2 |
| K19 sphere 1/R | 06 §2 |
| K20 torus sin v | 06 §3 |
| K21 cos β | 06 §6 |
| K22 gravity sign | 06 §7 |
| K23 no 1/D | 06 §7 |
| K24 Fourier 1/M | 07 §1 |

**The run before, `d184/evals1.log`** (12:04:26Z): 47/50.
- The torus per-vertex check failed, the control failed with it, and **K20 was NOT CAUGHT.**
- The fix is §3 below. The same numbers as the current run were first seen at 12:05:04Z (`evals2.log`).

## 3 · Corrections, including mine
1. **The torus diagnosis was wrong.**
   - I first blamed the anisotropic grid for the per-vertex K̄ being 8.7% off (0.0249 against 0.0229 at v = 0.52).
   - But it stayed off on a near-square grid (208 × 48). The triangulation biases how the defect is SHARED between vertices
     (Borrelli 2003, not opened).
   - The check is now the ring integral: Σδ per ring against ∫K dA over the band. It is exact by Gauss–Bonnet, and still
     exercises the formula (K20 is caught).
   - Written into references/06 §5 and 08 §2 as a rule: **K is an integral or smoothed, never a vertex's value.**
2. **A rule slip:** one sub-second node smoke check of the B-spline code ran OUTSIDE the heavy-run lock, before the first eval
   run. It was not a test or a bench, but the rule says every node run.
3. **The parked shelf's first mutation run was invalid.** Failing checks "caught" every mutant. There is a CONTROL now.
   - Its test data had a wrong null-space vector, [−1, 1, 0, 1], replaced by [3, −1, 0, 1]. That test was verifiably wrong.
4. **Fixed while writing 08 §6:** my first draft said FINDINGS §4d's "~20 g" "holds only for the GitHub car".
   - §4d says it was registered from the GitHub car's springs and measured on replays of `ohyeah2389_t180_mach6`, whose springs
     were not read.
   - Corrected to that before this hand-back.
5. **The research agents' corrections are listed in 08 §7.** Each was checked or dropped: the rates fix a line only up to a
   rigid motion; 3-D closure needs position; Crane's orthogonality; Meyer's mixed area; Borrelli, not Surazhsky; the jerk limit
   dropped.

## 4 · What this does NOT establish
- **The references test the MATHS, not E's scripts.**
  - The method rules without a formula of their own are NOT tested here, and are named as such in 01 §4: the frame-based
    cross-plane (trap c), the 20% width flag, and gap-means-jump.
  - They must be tested in `scripts/`.
- **B-spline evaluation is by the basis directly.** de Boor's algorithm, Boehm insertion and derivative control points are
  "not on the shelf" (03).
- **Not tested, cited only:** the natural frame not closing (Wang), Crane's condition, Jacobi fields and the J–M metric. Each
  is marked in its primer.
- **The dished-corner K is DERIVED and held to 25% at the centre** of one synthetic corner. It shows the sign and the scale,
  not an exact law on real meshes.
- **Sources marked "not opened" stay UNVERIFIED:** do Carmo, de Boor, Meyer, Borrelli, Stein–Shakarchi and Welch.

## 5 · Notes for other seats
- **A (SKILL.md, line 96)** says the known-answer tests are "listed in references/MATH_SOURCES.md". They are listed in
  **references/README.md**; MATH_SOURCES is the citation index. It is A's file, so I have not edited it.
- **`docs/math/*` (the parked shelf) is superseded by `references/`.**
  - It is NOT deleted: it holds A's 04a bank ramp and E's additions (01 §5, 02, 03), and 02_curvature cites 04a by path.
  - Whether to retire it is the chair's call.
- **E:** I asked on the board for any further formulas your scripts use. No answer was seen. Yours that are already tested in
  `test/fourier.test.js` are pointed at from 01 §5 and 07 §2. Anything new needs a check added to `evals/checks.js` before it
  is quoted.
- **The torus bias matters for M3b's reading:** the per-vertex sign on real meshes is unreliable, so only smoothed K̄ figures
  are cited as T-180 facts.

## 6 · Privacy
Only measurement summaries from FINDINGS and the hand-backs appear: shares, ρ, N counts, g ranges. There is no mesh, no
coefficient and no layout. No text is vendored from any source.

## 7 · GAPS G2 and G6 fixed (2026-09-28, 12:2x Z; from B's p-d184-read-B)
- **G2:** `references/README.md:11` now reads "one heavy job at a time, with `--max-old-space-size=4096`", as SKILL.md does. There
  is no room machinery named in the t180 skill. `grep -rn "heavy-run\|lock" references/ SKILL.md` returns nothing. README.md
  is now sha256 847cd5c83d88b538.
- **G6:** `evals/checks.js` now EXPORTS `meshes`, `params`, `meshCurvature` and `smoothK`, alongside the checks array. The
  runners are unchanged. checks.js is now sha256 07388ac3c81b5bbe.
  - **`meshes`:** `sphere`, `cylinder`, `cone`, `torus` (returns `{ mesh, vs }`) and `dishedCorner`, which was extracted from
    the 06 §6 check that built it inline. Each takes NAMED parameters, and each default is what its check uses.
  - **`params.<name>`:** each check's parameters, with the averaging radius named `smoothRadius`: the sphere 1 m, the dished
    corner 6 m, and `null` where the check reads raw defects or their sums.
  - **The checks read the same `params` object,** so the exported values and the checked values cannot drift apart.
  - **`references/06` §1 now shows the call** (sha256 743c51d069ff27b1).
- **A new test was added, so the count is now 51, not 50:** "06: the exported meshes and parameters rebuild what the checks
  use". It checks:
  - all five builders exist;
  - the sphere's vertex count, and its smoothed K at the exported radius, is 1/R² within the exported tolerance;
  - the torus's `vs` length.

  It is in `evals/known_answers.test.js` (sha256 85615298e26e1d84).
- **Under the lock**, held from 2026-09-28T12:25:38.763Z, with `--max-old-space-size=4096`: **51 tests, 51 pass, 0 fail.** All
  24 mutants were applied and caught, and the control passed. The log is `scratchpad/d184/evals4.log`, sha256 22cac1af18d3223f.
- **Standing rule (links):** I made no worktree tonight. My scratch trees are copies:
  - `find <scratchpad> -type l` returns 0;
  - `dir /AL /S` finds no reparse points.
  - `git worktree list` shows `C:/Users/nname/AppData/Local/Temp/b-d184-wt`. That is B's, and I did not touch it.
