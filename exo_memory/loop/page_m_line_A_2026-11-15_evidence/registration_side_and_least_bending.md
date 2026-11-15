# The side by the line's time, and the least-bending line: registered before code (2026-11-15 ~09:15 local, seat A)

Ruling: `exo_memory/loop/packet_m_line_A_2026-11-15.md`, "RULED at the stop on the line from the corridor" (git-blob 780096a3), items 1 to 5.
The arc fitter of eb577fc is removed, not built on.

## The line (item 2), as the opened source makes it
The walked stretch of the string is resampled every 0.25 m. Each sample keeps its normal and its free width either side at its own place
(`open_along`, up to 6 m). Its sideways offset is moved, pass after pass (300 passes, Gauss-Seidel), to where the squared second difference
with its neighbours is least: `(-p[i-2] + 4 p[i-1] + 4 p[i+1] - p[i+2]) / 6`, projected on its normal. It is clamped inside its width less a
room of `min(0.2 m, half the free width)`, so a doorway pins the line by its own width and the room is taken only where there is width for it.
The ends and the points beside a link stay. **Theirs** (Heilmeier et al., as read through arXiv 2309.09186 and TUM's README): lateral offsets
along a reference line's normals, the squared curvature least, inside the track's widths. **Ours:** the string as the reference line, the room,
and a projected relaxation in place of a QP solver (no new library).

## The side (item 1)
- **The line's time:** `v(s) = min(top, sqrt(mu g / kappa(s)))` on the line's own curvature (three points 0.5 m apart), then a backward pass
  for braking and a forward pass for acceleration at the kind's limits; the time is the sum of `ds / v`.
- **Two ways round:** the narrowest throat on the string within 25 m of path ahead (free width under 1.0 m) gives the polygons to avoid. A
  second search is run with those polygons priced as if 1000 times as long (a new `nav::Query::find_path_avoiding`, the same exact search). If it
  finds a way, both lines are made and **the faster is taken**.
- **Not left at a replan:** the polygons that force the side taken are kept on the chaser. A replan searches with them still avoided, and keeps
  the side while that search still reaches the goal (not partial). Otherwise it chooses afresh.

## Rows, red first (root_line back to the string, the side not chosen)
- **Pane E's three bends** (no replans): the line's time printed beside the string's (the red run) and the hand line's 0.321 s. The plan's bar
  checked (22 degrees: 0.889 s, never under 1.2 m/s). My predictions printed (22: 0.60 s, 6.0; 45: 0.60 s, 8.0; 90: 0.70 s, 7.5).
- **The open side at the 22 degree bend, at replans:** walked with a replan to the target every 120 ticks, the body crosses z 42 within the 2 m
  gap (x -74.6 to -72.4) and never passes the doorway at x -75 (within 0.3 m of (-75.0, 40.5)). Registered: **taken, and not left**.
- **The room:** no point of the line closer to an edge than `min(0.18 m, half the free width)`.
- **The cost:** the wall-clock time of one `plan_to` for one root chaser (both searches and lines), mean and largest over the bends and the
  routes, printed and not gated.
- **The routes' contacts:** the existing row (at most 10 an arm, my prediction), unchanged.

## Unwelcome, named now
- The 45 and 90 degree bends may be slower than the string's if the relaxation over a string reference folds at a sharp corner (the string's
  normals there fan). If a bend comes out slower than the string's and the build would be kept, that is the degenerating sign, and this would be
  the second build not kept in a row: then I ring before a third.
