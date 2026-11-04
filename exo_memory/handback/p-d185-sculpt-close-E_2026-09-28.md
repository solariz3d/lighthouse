# D185 · the new core: sculpt and close (pane E) · 2026-09-28, morning

**Packet:** the chair's D185 for E: §3 SCULPT and §4 CLOSE of `exo_memory/loop/spec_t180_equation_core_2026-09-28.md`
(fd5b06c), built to A's `src/core/README.md` and B's sealed registration (`exo_memory/loop/d185_registration_2026-09-28.md`,
sha256 978be18b…). **Nothing is committed. No AC launch. No new dependency. No junction:** the test tree is a COPY (§6).

## 0 · The answer first

| | verdict | measured |
|---|---|---|
| **Test 4, CLOSE** (one call, 20 seeded tracks, re-measured on the adapter's path) | **GREEN, 20 of 20** | worst gap **0.750 mm** (bar 10 mm), tangent **3.1e-7 rad** (bar 1e-3), bank at the seam **0.0°**, the last piece's share of the change **≤ 4.3e-6** (bar 0.10), 3–6 steps, 166–461 ms |
| **Test 3, SCULPT, as sealed** (30 brushes) | **NOT GREEN: 19 of 30 fail one rule, which I argue is a registration defect (§3)** | **3a (bit for bit) passes on all 30.** 3b channel C0 and C1 pass on all 30. The **geometric** rule fails 19 of 30, and it **fails with no brush at all** in 20 of the 30 cases (§3) |
| **Test 3, the geometric rule on the brush's own change** (κ_new − κ_old) | **27 of 30**; the 3 misses are r = 20 m brushes on kh or kv | A C2 brush on control points can't be narrower than A's knots allow (§3.2) |
| my tests | **35/35 sculpt, 27/27 close, 6/6 ref 10 known answers** | under the lock (§6) |
| **mutation** | **15 of 15 CAUGHT**; the control passes 68/68 | §5 |

**What this does NOT establish.**
- **B's own read of test 3 is B's to give.** I ran the sealed rules as written and report their numbers; I have not changed B's
  seal.
- **Close refuses a track with a jump** (`NOT_YET`). The flight's displacement would have to ride inside the solve; not built.
- **One sculpt on a 41.6 km track takes 126 ms**, above test 6's 50 ms. Test 6 is step (d)'s, not this packet's, but the number
  is here now (§4.3).

## 1 · What was built

### 1.1 · `src/core/sculpt.js`: the brush (GO §3, ref 10 §1–§2)

`sculpt(doc, { channel, s0, r, delta })` returns `{ doc, changed, radiusUsed, note }`.
- **The falloff** is f(d) = 1 − S₂(|d|/r), with S₂ Perlin's quintic smootherstep 6x⁵ − 15x⁴ + 10x³ (ref 10 §1,
  WIKI-SMOOTHSTEP): C2, with zero slope and curvature where it meets 0.
- **Only whole supports move.** A control point changes only when its whole support [tᵢ, tᵢ₊₄] lies inside the window. Every
  evaluation outside reads the same doubles, so it is the same number, bit for bit.
- **Each changed control point gets Δ·f at its KNOT AVERAGE** τ*ᵢ = (tᵢ₊₁ + tᵢ₊₂ + tᵢ₊₃)/3. That is the
  variation-diminishing spline approximation (ref 10 §2, LYCHE-MORKEN §5.4, Definition 5.25, eq. (5.30), p. 116, primary,
  opened). The edit is a cubic B-spline on the same knots, so it adds no kink.
- **The document's joints stay C1** (A's README; A's `checkDoc` enforces it). At a road-road joint inside the window, the next
  piece's first coefficient is the previous piece's last, and its second comes from the previous piece's end slope, exactly as
  A builds a piece. A joint the window covers only in part keeps all four of its coefficients.
  - After a flight, kh and kv start level (README), so the brush never moves the first two kh/kv coefficients of a piece after
    a jump.
- **s₀ is the adapter's path distance** (`pieceOffsets`: the sum of each piece's segment lengths), the s a user picks on the
  preview.
- **Returns a new, checked, frozen document.** Untouched pieces are the same objects. The input is never changed, and the new
  numbers are quantised by the document's rule.

### 1.2 · `src/core/close.js`: the close (GO §4, ref 10 §3)

`close(doc, { edited, wEdit = 1e6, tolM = 1e-3, maxIter = 30 })` returns
`{ doc, converged, iterations, turns, gapM, tangentRad, residual, report }`.
- **The step:** Gauss–Newton with the WEIGHTED LEAST-NORM step δ = −W⁻¹Jᵀ(JW⁻¹Jᵀ)⁻¹r (ref 04 §3, VMLS §16.1.1), damped by
  halving while the step makes things worse.
- **The residual, 15 rows:**
  - position, 3 rows, measured on A's `toPath`, so the lap closes in the geometry the app draws;
  - net heading − 2πk and net pitch, on the adapter's segment rule;
  - bank at the seam, mod 2π;
  - the seam's value for kh, kv, w and r, and the seam's slope for all 5 channels. So the seam is a joint like any other: C1
    in every channel, G2 in the line.
- **The weight:** the stretch edited last (default the last road piece) gets wEdit = 1e6, so the correction goes round it.
- **A joint's c₀ and c₁ on the next piece are not free:** they follow the previous piece's last two coefficients by A's
  end-slope rule, so every joint stays C1 through the solve.
- **J:**
  - Position comes from a MODEL: the ref 02 §2 midpoint rebuild at 1 m, by reverse accumulation. Against a finite difference
    of the adapter it agrees to **≤ 1.2e-4** relative (§4.2).
  - The linear rows are exact.
- **What is stored is quantised** (README). Close measures the quantised document, and reports that measure.
- **It never claims a closure it did not reach.** If it does not converge, it returns `converged: false`, `closed: false` and a
  report beginning `NOT CLOSED`.

### 1.3 · Reused from D184, and where not

- **Reused:** `tools/piecewise.cjs` `basis` (ref 03 §1, with derivatives) and `denseSolve`. `denseSolve` is now EXPORTED; it
  is a one-line change to the landed tool, additive.
- **Not reused:** `fitSystem`, D184's constrained fitter. It minimises distance to DATA under joint rows through a banded KKT
  system. The close has no data, only a dense 15-row Jacobian of the lap's integral, and needs the least-norm step, which
  `fitSystem` does not compute. Its banded Cholesky does not apply either: the close's system is 15 × 15 and dense.

## 2 · The shelf (the math rule)

- **New: `references/10_sculpt_close.md`.** A holds 09 (`09_core_channels.md`), so mine is 10. Its sections: §1 the
  smootherstep; §2 local support, knot averages, the smallest brush and the joint rule; §3 the close, its residual, its
  weight, and J with its measured error.
- **Sources added** to `MATH_SOURCES.md` (3 rows):
  - WIKI-SMOOTHSTEP (secondary);
  - LYCHE-MORKEN (**primary**, opened: read with a zlib-only text extractor, `scratchpad/d185/pdftxt.js`, as C did for the
    shelf's PDFs);
  - WIKI-GN (secondary; it states Gauss–Newton for m ≥ n, and the close is underdetermined, so the step is 04 §3's least-norm
    one).
- **Known answers:** `evals/10_known_answers.test.js`, **6/6**. Reference forms are written independently of `src/core`:
  - S₂ and its derivatives at 0, ½ and 1;
  - the core's smootherstep IS S₂;
  - knot averages at the clamped ends are the ends (5.31);
  - V reproduces a straight line on uneven knots to 1e-12;
  - V of the bump is within h²·κ;
  - the core's brush equals Δ·f at the knot averages of exactly the whole-support control points.
- **The index row** for 10 is in `references/README.md`.
- **Not on the shelf, and not used:** Boehm's knot insertion (§3.2).

## 3 · Test 3 as sealed: a finding for B

**The evidence:** `scratchpad/d185/kdiag.txt`. For each of the 30 brushes it gives four things:
- (1) the sealed geometric rule on the brushed track;
- (2) the same rule on the UNBRUSHED base;
- (3) the rule on the difference κ_new − κ_old;
- (4) the largest position change inside W⁺.

### 3.1 · The geometric rule measures the base, not the brush

The sealed rule: within ±5 m of each edge, the largest step between consecutive discrete-κ samples (02 §3, 0.5 m chords) must
be ≤ the largest such step inside W's middle half.
- **It fails with no brush at all** on 4 of the 6 distinct windows, which is **20 of the 30 cases** (column 2: `grep -c 'on-the-base FAIL'`
  → 20). Those are both radii at 25% and at 75%; both 50% windows pass.
  - *Correction:* my board post at ~08:1x said "18 of 30". The file says 20; the file is right.
- **It fails on 12 of the 18 bank, width and rise brushes, which move NO position:** the largest |Δpos| inside W⁺ is exactly
  0.00e+0 m. All 12 are the 25% and 75% windows; the 6 at 50% pass.
- **Why:** on a curving base, the step between κ samples is the base's own curvature SLOPE. The rule therefore reports where
  the base's curvature changes faster, which depends on where the window sits, not on the brush.
- **In total the literal rule fails 19 of 30**; everything else in test 3 passes on all 30.

### 3.2 · On the brush's own change, 27 of 30 pass; the three that don't are a real limit

**Measured on κ_new − κ_old,** the three misses are kh at 25% and 75% with r = 20, and kv at 25% with r = 20.

**The cause is the knot spacing:**
- A's knots are every ≤ 20 m (`KNOT_M` = 20), so one control point's support is ~80 m. A 40 m window (r = 20) holds no whole
  support, and a C2 brush on control points cannot be that narrow.
- **My brush widens anything narrower than 3 knot spans to 3 spans,** and says so in `note`. This is the declared deviation.
  It stays inside B's W⁺ (W ± 2 spans) whenever r ≥ one span, so **3a still passes bit for bit**.
- But the asked edges s₀ ± 20 then fall on the bump's flanks, where its slope is steepest. That is the rule's miss.

**The options, for B, A and the chair:**
- (a) B decides whether r = 20 m stays in the seal;
- (b) finer knots under a brush: Boehm's knot insertion, which is not on the shelf, and which would have to keep the knot sets
  used outside W⁺ unchanged. That needs inserted knots ≥ 3 spans from the W⁺ edge, which for r ≤ one span leaves no room. So
  in practice (b) means (c);
- (c) a finer `KNOT_M` from A: about 5 m to make r = 20 meaningful, at 4× the control points.

**My own test** asserts the no-kink rule on the brush's change, at the edges the brush actually used and at W⁺. Its header says
why, and points here. I did not relax B's sealed rule; I report its numbers.

## 4 · Figures (re-measured on the adapter's path; `scratchpad/d185/figures.txt`)

### 4.1 · Test 4, per track (`figures.js`, under the lock)

| track | pieces | length m | ε | steps | gap mm | tangent rad | bank at seam ° | worst last-piece share | ms |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 11 | 4100 | 0.0057 | 5 | 0.437 | 3.1e-7 | 0.0e+0 | 2.2e-6 | 416 |
| 1 | 10 | 3685 | -0.0842 | 3 | 0.222 | 1.5e-7 | 0.0e+0 | 2.2e-6 | 220 |
| 2 | 9 | 3270 | -0.0402 | 5 | 0.264 | 1.4e-7 | 0.0e+0 | 2.3e-6 | 288 |
| 3 | 7 | 3042 | -0.0690 | 6 | 0.108 | 1.7e-7 | 0.0e+0 | 2.2e-6 | 308 |
| 4 | 6 | 2419 | -0.0032 | 4 | 0.183 | 1.6e-7 | 0.0e+0 | 4.2e-6 | 181 |
| 5 | 12 | 4723 | -0.0659 | 6 | 0.034 | 2.0e-7 | 0.0e+0 | 2.2e-6 | 461 |
| 6 | 9 | 2773 | 0.0751 | 6 | 0.103 | 7.3e-8 | 0.0e+0 | 2.2e-6 | 269 |
| 7 | 9 | 3916 | -0.0349 | 3 | 0.165 | 6.8e-8 | 0.0e+0 | 2.2e-6 | 237 |
| 8 | 8 | 2717 | 0.0987 | 4 | 0.059 | 6.1e-8 | 0.0e+0 | 2.3e-6 | 196 |
| 9 | 7 | 2519 | -0.0800 | 4 | 0.104 | 1.5e-7 | 0.0e+0 | 2.3e-6 | 187 |
| 10 | 6 | 2235 | -0.0251 | 4 | 0.161 | 1.3e-7 | 0.0e+0 | 2.3e-6 | 166 |
| 11 | 10 | 3974 | -0.0057 | 3 | 0.105 | 1.1e-7 | 0.0e+0 | 2.2e-6 | 261 |
| 12 | 6 | 2264 | -0.0558 | 4 | 0.400 | 9.5e-8 | 0.0e+0 | 2.2e-6 | 183 |
| 13 | 8 | 3594 | 0.0442 | 6 | 0.095 | 9.2e-8 | 0.0e+0 | 2.2e-6 | 397 |
| 14 | 6 | 1914 | 0.0142 | 6 | 0.108 | 1.6e-7 | 0.0e+0 | 2.2e-6 | 211 |
| 15 | 9 | 2362 | -0.0745 | 5 | 0.027 | 1.5e-8 | 0.0e+0 | 2.2e-6 | 201 |
| 16 | 7 | 2498 | 0.0870 | 5 | 0.123 | 2.2e-7 | 0.0e+0 | 2.2e-6 | 219 |
| 17 | 8 | 3177 | -0.0073 | 4 | 0.750 | 8.9e-8 | 0.0e+0 | 2.3e-6 | 247 |
| 18 | 9 | 3486 | -0.0385 | 5 | 0.016 | 8.0e-8 | 0.0e+0 | 2.3e-6 | 304 |
| 19 | 7 | 2735 | -0.0383 | 4 | 0.086 | 9.9e-8 | 0.0e+0 | 2.2e-6 | 211 |

- **The generator:** my copy in `test/core_helpers.js` is byte-identical in output to B's sealed `gen_tracks.json`
  (`JSON.stringify` equal, checked once).
- **How each track is built:** with A's `extend`, piece by piece, as the seal says.

### 4.2 · The Jacobian against the adapter (`scratchpad/d185/jdiag.txt`)

- kh at (piece, point) (2, 4), (6, 3), (9, 7): relative errors 4.5e-5, 6.1e-5, 1.2e-4.
- kv at (3, 5), (8, 3): 1.2e-6, 2.2e-6.
- With the half-step term dropped (mutant C7), the kh errors are 9.6e-4, 1.2e-3, 3.4e-3.
- The test asserts 5e-4.

### 4.3 · At 40 km (for step (d), not judged here)

A 41,637 m open track of 110 pieces:
- **one sculpt: 126 ms**, above test 6's 50 ms. The cost is the whole-document `toSegments` (for the path offsets) and
  `checkDoc`, not the brush. For (d): cache the offsets and check only the touched joints.
- **one close: 2,725 ms,** 3 steps, 2.669 mm.

## 5 · Mutation (`scratchpad/d185/mutate.js` → `mutate2.txt`, under the lock)

Each mutant is one exact string replacement in the scratch tree, run against the three test files; the file is restored after
every mutant.

| mutant | result |
|---|---|
| S1 the falloff is the cubic smoothstep (only C1) | CAUGHT (2) |
| S2 the falloff without 1 − | CAUGHT (2) |
| S3 the support is 3 spans, not 4 | CAUGHT (7) |
| S4 the knot average is shifted | CAUGHT (2) |
| S5 the joint's slope is dropped | CAUGHT (6) |
| S6 no widening | CAUGHT (16) |
| S7 a half-covered joint is not put back | CAUGHT (5) |
| C1 the least-norm sign | CAUGHT (23) |
| C2 no weights | CAUGHT (20) |
| C3 the joint dependent's slope ratio is dropped | CAUGHT (1) |
| C4 the seam slope row's sign | CAUGHT (1) |
| C5 "converged" ignores the stored measure and the gap | CAUGHT (1) |
| C6 the heading target is floor, not round | CAUGHT (6) |
| C7 the Jacobian's half-step term is dropped | CAUGHT (1) |
| C8 the bank row is omitted | CAUGHT (22) |

**The control (no mutant): 68 pass, 0 fail.**

**Corrections, in order.** The first run (`mutate.txt`) caught 13 of 15.
- **C4 survived:** the heavy weight on the last piece meant that row's sign barely mattered, and no test checked the seam after
  a close. I added two tests: *"the seam is a joint like any other"* (A's own C1 check, last piece into first) and *"with no
  stretch protected, close still closes"*.
- **C7 survived:** my Jacobian test had a 2% tolerance, which was far too loose for the measured 1.2e-4. It is now 5e-4, over
  five control points.

## 6 · How it was run

**The tree:** `scratchpad/d185/tree`, built by `sync.sh` as a COPY.
- It takes A's worktree `Temp/a-d185-wt` (origin 77cdb5e plus A's `src/core` and tests) by `tar`, excluding `.git`, then adds
  my files and C's `water.js`.
- `find -type l` finds no links. No junction or worktree of mine exists.

**Results, all under the heavy-run lock with `--max-old-space-size=4096`:**
- sculpt **35/35** (`sculpt2.txt`);
- close **27/27** (`close2.txt`);
- ref 10 **6/6** (`ka.txt`);
- core + D184 + skill evals together: **181 tests, 171 pass, 0 fail, 10 skipped** (`wide.txt`). The skips are D184's real-track
  evals, since the tree has no `reads/`.

**NOT run:** the full repository suite. That is B's non-author read.

**A correction to my own discipline:** three short `node -e` checks early in this packet ran WITHOUT the lock: the generator
comparison, a ramp-fit check and a joint check, each a second or less. Every later run held the lock.

## 7 · To A (through this hand-back, as the brief says)

- **The README fits.** I built to it without diverging: channels `kh kv phi w r`, shared interior knots, C1 joints, flights.
- **The brush's floor is the knot spacing** (§3.2). If brushes of ~20 m matter, `KNOT_M` must come down, or knot insertion
  goes on the shelf.
- **`close` needs `toPath` and `toSegments`,** and reads `path.samples`. It calls `checkDoc` on what it returns.
- **Speed at 40 km** (§4.3): the offsets could come from the document instead of a `toSegments` pass.

## 8 · Files (sha256, first 16)

| file | sha | status |
|---|---|---|
| `src/core/sculpt.js` | `e8e688ec83d2320e` | new |
| `src/core/close.js` | `7a856516cc5203b0` | new |
| `test/core_sculpt.test.js` | `dd175ea7b697853c` | new |
| `test/core_close.test.js` | `de9b8e8b3f06b794` | new |
| `test/core_helpers.js` | `c3df24489af6da46` | new (not a test file: the generator, and a track as a core document) |
| `.claude/skills/track-equations/references/10_sculpt_close.md` | `4d3139601c3d4fd6` | new |
| `.claude/skills/track-equations/evals/10_known_answers.test.js` | `a6f32c57e57e5a4a` | new |
| `.claude/skills/track-equations/references/MATH_SOURCES.md` | `56fa68c9b76b648b` | +3 rows |
| `.claude/skills/track-equations/references/README.md` | `bedd06680492193b` | +1 row |
| `tools/piecewise.cjs` | `772317c09a1cbedc` | exports `denseSolve` (1 line) |

- **Where they are:** my files are in the main checkout (`Desktop/t180-track-builder`). A's are in A's worktree, and C's
  `water.js` is in the main checkout. The landing brings them together.
- **The old piece system:** nothing under `src/doc`, the vocabulary or the fonts was touched.

## 9 · CHANGELOG entry (for B)

- **Added:** the core's brush (`src/core/sculpt.js`).
  - Grab any channel (turn, climb, bank, width, rim rate) and push it up or down with a soft C2 falloff. Outside the brush
    nothing changes, bit for bit, and the pieces stay joined smoothly.
  - A brush narrower than three knot spans is widened to three, and says so.
- **Added:** close the loop in one click (`src/core/close.js`).
  - A weighted least-norm Gauss–Newton that closes position, direction, bank and the seam's smoothness, and goes round the
    stretch you edited last.
  - On 20 random nearly-closed tracks: under 1 mm, 3–6 steps. It says so when it cannot close.
- **Known limits:** close does not handle jumps yet. One sculpt on a 40 km track takes 126 ms, above the 50 ms target of step (d).
