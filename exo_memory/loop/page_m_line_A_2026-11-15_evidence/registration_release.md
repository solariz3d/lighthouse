# The solve's release, and the rows that judge it: registered before code (2026-11-15 ~11:20 local, seat A)

Ruling: `exo_memory/loop/packet_m_line_A_2026-11-15.md`, "RULED at the ring for the solve" (git-blob 366fb4cd), items 1 to 4.

## The release (item 2)
After each solve: an offset past a bound is held there (as now); and **a held offset whose energy slope points back inside its bounds is
released**. The slope is its row of the full normal equations, `(A a - b)_i`: held at the low bound, a negative slope releases it (the energy
falls as it moves up); held at the high bound, a positive one. Solve again; stop when nothing is past a bound and nothing asks to be released.
**The guard against flipping for ever (my choice):** in a round that holds nothing new, only the one held offset with the steepest slope back
inside is released (the classic one-at-a-time active set, which cannot cycle on a strictly convex problem); and the rounds are capped at
`kBendRounds` (raised to 400) times the effort, a cap that the row below would show being reached.

## The rows that judge it (replacing the effort row, which the ruling withdrew as a poor check)
- **The energy:** on each of pane E's three bends, the solve's energy (the sum of squared second differences of the line's samples) is no
  higher than that of the passes' line at 600,000 passes on the same samples and bounds. **Red first on b2fc99d (registered by the ruling: the
  solve's is higher).**
- **No held offset asks to be let go:** at the end, no held offset's slope points back inside its bounds (beyond 1e-6). Red first on b2fc99d.
- **The gate stands:** one plan_to under 1,000 us (mean and largest printed).
- **Check 2 restated by name (item 4):** a tick counts only when the slide holds before **and after** it, and when `|wanted - current|` is at
  least **0.1 m/s**; then the acceleration along it is no less than 0.9 of what grip allows, less the wall's part.

## The fork (item 3), registered by the ruling and taken
With the true bounded least: if the 90 degree bend is taken in no more than today's 0.846 s **and** the ten routes are no slower than the one
law's 82.17 and 78.41 s, the least-bending line stays. **If not, the next build is straights and the widest arc at each bend** (the three hand
lines), with the side chosen by the price.
