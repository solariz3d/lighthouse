# The track-equations SKILL: read a track, fit its equation, rebuild it, check it. Librarian, on D, 2026-09-28 05:3x. Lap D184.

**The keeper, 05:28:** *"is the math md shit even working? What if we had to research and make our own skill to truly make
and recreate the equations for a track"*, then *"unfreeze it... pleaese bro"*.

**Honest status first:** the math shelf was never built (it was parked at the freeze). What worked tonight was TESTED CODE:
E's `tools/fourier.cjs` reverse-engineered all 13 layouts (M4). So the skill packages the code-plus-checks, not prose.

## What the skill is

A Claude Code skill in the t180 repo at `.claude/skills/track-equations/`. Public-safe: general maths and our own code,
never another author's track equation.

1. **`SKILL.md`, the method, written once:**
   - read the track (`tools/read_track.cjs`);
   - fit its functions: heading rate, pitch rate, bank, width, cross-section;
   - rebuild through the builder's own geometry core, with the closure projection;
   - check against the original: line within 5 m and bank within 5° on ≥ 95% (M4's bar);
   - report N and the error.
   - **Never skip the check; never quote a formula that is not in `references/`.**
2. **`scripts/`:** thin wrappers over the repo's tested tools (fourier, reader, closure), so a seat RUNS the maths.
3. **`references/`:**
   - the math primers, CITED not copied (`MATH_SOURCES.md`), plus the permitted extracts (Wikipedia CC BY-SA, attributed;
     Clothoids BSD-2);
   - each formula with its source and the measurement that showed it (M1–M4, M2b/M3b);
   - what FAILED (M3/M3b: corners are elliptic, not hyperbolic).

   Sources: `exo_memory/research/t180_track_mathematics_2026-09-28.md`, `t180_math_tools_2026-09-28.md`,
   `t180_be_like_water_2026-09-28.md`.
4. **`evals/`, the pass bar (the skill-creator's eval format if available, else node tests):**
   - known answers: a sphere's K = 1/R²; a cylinder and a cone have K = 0; the torus formula; a circle's heading rate is
     1/R; a clothoid's κ is linear in s; Gauss–Bonnet 2πχ; frictionless energy conservation; closure < ε;
   - **regressions from tonight:** Serpents rebuilds at N = 12, the Bowltrack at 30, Eagleton at 75, Thunderhead and the
     Test Track at 200, each within M4's bar. The equations stay LOCAL (reads/), so these evals run only on a machine that
     has the tracks installed, and say so when skipped.

## Rules

- **No new dependency without the keeper's OK.** fast-check, a Python oracle venv, sympy-mcp and ml-matrix are all still
  unanswered.
- **No AC launch.** Every node run under the lock with --max-old-space-size=4096.
- **Nothing else starts:** D182's landing finishes first (chair), and the other parked items stay parked.

## The lap (strict wait-for-all)

| seat | job |
|---|---|
| E | `scripts/` and the regression evals (E owns fourier.cjs and the reads) |
| C | `references/` (primers, citation index, permitted extracts) and the known-answer evals |
| A | `SKILL.md`, and the skill wiring (loads in a Claude Code session in the t180 repo) |
| B | the non-author test: a FRESH session given only the skill must reproduce Serpents' N = 12 and a sphere's K. Then the read and the privacy gate |

## Addendum 05:3x: the keeper's corrections to the method (they change what the skill does)

1. *"I know its possible to take the data from a track as its shape, what seems to be the problem?"* M4's long-lap blowup
   came from the METHOD, not the idea:
   - it fitted the reader's walk (4 m steps, about ±20 m smoothing, glitches: Rainbow 282), not the mesh's exact geometry;
   - it rebuilt the line by integrating heading, and drift accumulates (0.25 mrad is 5 m over 20 km).

   **The skill fits the centreline POSITION taken from the mesh itself** (x, y, z along s, which closes by construction and
   cannot drift). Curvature, bank and cross-section are fitted as functions for the feel.
2. *"could it be possible that the bigger tracks with jumps, or where its separated, would be split into seperate equations
   that then are connected to each other?"* **Yes, PIECEWISE:**
   - split at jumps (a gap, not road) and, on long laps, at long straights;
   - each open stretch gets its own equation (an open basis: Chebyshev or B-spline, NOT a periodic Fourier series);
   - joints are CONDITIONS: position, tangent and curvature agree (G1/G2);
   - a jump joint is the flight: a ballistic arc from take-off to landing, as the two-landing check already models;
   - the lap closes with the least-norm projection spread over all pieces.
3. **New regression evals, stated before any run:**
   - **Rainbow**, which never converged in M4, must rebuild within 5 m / 5° on ≥ 95% once split.
   - **Sakura and Centrifuge** must need FEWER total terms than M4's 2,000 and 4,000.
   - **It fails if** Rainbow still misses the bar, or the piecewise totals exceed M4's.

## The method, thought through (librarian, 05:3x): so E builds it rather than inventing it

**1. Getting the TRUE centreline (the input M4 lacked).**
- Keep the reader's s-stations for ORDER only.
- At each station, cast a ray across the road in the station's cross-plane against the actual road triangles
  (Möller–Trumbore, cited). Take the exact left and right edge hits; the centre is their midpoint, and the cross-section
  is the exact hit polyline.
- No ±20 m smoothing. Where the cross-ray hits nothing (a gap), that station is a JUMP gap, not bad data.
- **Check before fitting:** station spacing and the width (right − left) must be smooth. Any jump in width > 20% between
  neighbours is flagged as a seam or reader glitch and shown, never silently kept.

**2. Splitting.**
- **Jumps:** a run of stations with no hit, between a take-off (the last hit) and a landing (the first hit after).
- **Long laps only:** also split at straights (|κ| < 1/1500 m for ≥ 200 m), at their midpoint, so each joint sits where
  the curvature is ~0 and G2 is trivially satisfied.
- A piece never starts inside a corner.

**3. Fitting each open piece: an adaptive cubic B-spline in s, the position (x, y, z) and the bank.**
- Start with a knot every 200 m.
- Least squares, then insert a knot at the midpoint of every span whose max deviation exceeds the tolerance.
- Repeat until everything is inside, or a per-piece cap (500 control points) is reached; hitting the cap is reported.
- **Why B-spline, not Chebyshev:** local support, so a tight corner adds knots only where it is; Chebyshev spreads it
  over the whole piece.
- **The term count is the number of control points.**

**4. Joints as constraints, not averages.**
- Adjacent road pieces share an end control-point structure, forced by constrained least squares (KKT, equality rows)
  so that position, tangent and curvature match (G2).
- At a jump joint, no position constraint. Instead the take-off tangent and the landing point must be joined by the
  ballistic arc at the replay-measured flight (FINDINGS §8 / §7d), reported as a check: does the arc land within the
  landing's tolerance at the design speed?

**5. Closure:** the last road piece's end is constrained to equal the first piece's start (G2), inside the same KKT
system. So closure is exact by construction; no after-the-fact projection is needed for position.

**6. What is reported per track** (this is the result, never a single number):
- pieces (road, jumps);
- control points per piece and in total;
- line deviation: p95, max, and % within 5 m;
- bank: p95 and % within 5°;
- **the N-versus-tolerance curve** (at 10, 5, 2 and 1 m), so "how long is the equation" is shown as a function, not
  cherry-picked at one tolerance;
- every flagged glitch, by station.

**7. The traps, named in advance:**
- (a) **Overfitting reader glitches.** Step 1's width check is the guard; a flagged station is excluded from the fit
  AND listed.
- (b) **Roads that cross over or under** (Rainbow): the cross-ray must take the road surface nearest the previous
  station's height, never the first hit.
- (c) **Twisted / inverted sections:** the cross-plane uses the frame, not world-up, or a loop's cross-ray points into
  the ground.
- (d) **Comparison with M4 must be like-for-like:** M4 counted Fourier terms per function, B-splines count control
  points. **Report both in DEGREES OF FREEDOM** (numbers stored), or the "fewer terms" eval is apples to oranges.
