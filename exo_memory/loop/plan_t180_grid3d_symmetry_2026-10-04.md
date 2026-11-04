# T-180: a grid that goes 3D with the track, and symmetry guides. Librarian, on D, 2026-10-04 13:2x. Lap D237.

The keeper, 13:18: "I wonder if we could some how make like, a 3D grid to some how see the track and make it all symmetrical if you need it
to be … It will be a 2D Grid if the track has no height, but as soon as the track turns up or downward the grid becomes 3D."

## Checked (main 510510e9, worktree `lib-speed2-build`)
- A faint GROUND grid already exists: `app/preview/look.js:78` `gridLines(bounds)`, lines at y = 0 over the track's box + 50 m, a 10 m
  spacing that widens ×5 until each axis has ≤ 200 lines. It's flat only, and it has no vertical lines, no axes and no symmetry aid.
- No mirror or symmetry code anywhere in `app/` or `src/core` (grep).

## The lap (A, FEEL tier: preview only, nothing in `src/` or the export; targeted tests + a real-window look + the keeper's hands)
1. **The grid grows into 3D with the track:**
   - A flat track (height range under ~0.5 m) shows today's ground grid only.
   - **Once the track has height,** the grid becomes a lattice over the track's box:
     - the ground grid at the lowest point;
     - vertical lines at the grid corners, rising to the highest point;
     - faint horizontal height rings (contour levels) at the same spacing up the box;
     - labels at a few levels (e.g. "+20 m").
   - Faint enough not to fight the track; the spacing uses today's rule, so a 14 km track stays a few hundred lines.
   - A toggle: off / ground / 3D (auto by default).
   - **Height drop lines (optional, if cheap):** from the track down to the ground grid every N m, so you can read each point's height and
     its position over the ground.
2. **Symmetry guides:**
   - **Axes through the track's centre** (the box's middle, or the centreline's centroid), drawn bold on the grid: the X and Z centre lines,
     and the vertical through their crossing.
   - **A mirror ghost:** the track's centreline reflected across a chosen axis (X, Z or both: left/right, front/back, point-symmetric),
     drawn as a faint dashed line. Where the real track and its mirror overlap, it's symmetric. Where they part, you see exactly where
     and by how much.
   - **A symmetry readout:** the largest and the average gap between the track and its mirror, in metres, so "make it symmetrical" has a
     number to drive to zero.
   - **The centre** the axes sit on is shown and can be dragged or reset, so the keeper picks what to be symmetric about.
3. **Not in this lap (said so, the next step if the keeper wants it):** a MIRROR tool that rebuilds one half of the track from the other.
   That edits the document (EXPORT tier). The guides come first, so we can see whether the keeper wants the tool.
- **Tests:** flat → ground only; a lifted track → the lattice spans its min to max height; the line count stays bounded on a long track;
  the mirror ghost of a symmetric fixture (an oval) reads gap ≈ 0, and of an asymmetric one reads the known offset; the export is
  byte-identical (fixtures 0 of 9, since nothing reaches it).
- **The real-window look** at the keeper's size, as A did for the scroll bar (Chromium over CDP is fine): a screenshot of a flat and a hilly
  track, for B and the keeper.

NEXT: chair dispatch D237 to A when this plan is read
