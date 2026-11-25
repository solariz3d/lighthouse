# The least-bending line by a direct banded solve: registered before code (2026-11-15 ~11:10 local, seat A)

Ruling: `exo_memory/loop/packet_m_line_A_2026-11-15.md`, "RULED at the ring for the two reads" (git-blob 4cc57b7f): the passes check moved the
line with the passes (`pc.txt`), so the 90 degree gap and the cost are one cause, the solver, and item 3's lever is a direct banded solve.

## The solve (ours; the problem is Heilmeier's as read: offsets along normals, squared curvature least, inside widths)
Each walked stretch is resampled every 0.25 m as now; sample `i` keeps its place `q_i`, normal `n_i` and bounds `[lo_i, hi_i]` (its free width
less `min(0.2 m, half the width)`, as now). With `p_i = q_i + a_i n_i`, the energy is the sum over `i` of `|p_(i-1) - 2 p_i + p_(i+1)|^2`. Its
normal equations in the offsets `a` are a symmetric system with five entries a row (each `a_i` meets its neighbours to two either side through
dot products of the normals), solved directly by a banded Cholesky factorisation in time proportional to the samples. The ends, the points beside
a link, and samples with no normal are held at offset 0 (their rows made identities, their couplings moved to the right-hand side); a tiny
diagonal (1e-6) keeps it positive. **The bounds:** solve; every offset past its bound is held at that bound; solve the rest again; up to
`kBendRounds` = 20 rounds (an offset once held is not released: ours, simple, and the effort check below says whether it matters).

## Rows, red first on 6b4c015 (bend_least's passes as built)
- **New: the line is at its least.** On pane E's three bends, `root_line` at its effort and at ten times its effort (the passes times 10 on the
  old solver; the rounds times 10 on the solve) **differs by no more than 1 cm at any point**. Red on 6b4c015 (the passes check moved it 0.57 m).
- The bends row (today's law beside it): **the 90 degree bend no slower than today's 0.846 s**; the 22 and 45 no slower than 6b4c015's by more
  than 5 per cent (0.321 s; 0.492 / 0.500 s).
- **The gate: one plan_to under 1,000 us** (the cost row).
- Unchanged: the side row green; route contacts no worse than 9 and 4; off means off; the slide's rows.
- **Unwelcome, named now:** the bounds at doorways need many rounds and the cost stays over the gate; then keeping the line between plans comes
  back. Or the solved line, at its least, still does not reach the hand line's 0.575 s at the 90 (the energy's least is not the fastest line).
