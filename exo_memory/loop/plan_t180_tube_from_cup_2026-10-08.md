# T-180: projecting a tube off the end of FIRST TRACK "bugs the track, then eventually turns into a tube". Librarian, on D, 2026-10-08 13:3x. Lap D274.

The keeper, 13:33: "for some reason, it wont let me project and build a tube correctly, it bugs the track and then eventually turns into a tube".

## What is on disk (librarian, read only)
- `tracks/eq-FIRST TRACK.t180track`, saved 13:22 (39,060 B), copied to the librarian's scratch `tubebug/first2.t180track`: **23 pieces, open,
  NO tube piece.** So the tube he tried was the GHOST (the projection), not a placed piece.
- The head he extends from: pieces 15–22 are a **cup road**, cup 33.4°, width 35 m, bank 0 at the end, edge 0.
- His undo sidecar `eq-FIRST TRACK.t180undo` (339,369 B) was written at the 13:22 save, so D272's save side ran in the real app.
- This is the first tube built since 0.3.2's D268 (the heartline: an unrolled tube's centre now sits ON the drawn curve) and 0.3.1's cheap ghost
  (drawn at 12° steps while a handle is dragged).
- inferred candidates, NOT checked: (a) the cheap ghost while dragging the tube-sweep handle is faceted and only snaps to the full tube on release
  ("eventually turns into a tube"); (b) a cup → tube transition that folds or jumps mid-piece; (c) the D268 heartline change behaving differently when
  the piece STARTS from a cup instead of a flat road.

## The lap (E, who owns the tube and D268; GEOMETRY tier)
1. **Reproduce headless** on a copy: extend from that head with tube sweep 360 at a few lengths (125, 250, 500, 1000), at width 35. Report, along the
   piece: the self-check (folds or stacking), the centre's offset from the drawn curve, and the cheap ghost vs the full ghost at the same values.
2. **Name the cause** among (a)–(c) or something else, with numbers. If it is (a) only, say so: that is the drag preview, not the track.
3. **Fix** if it is the track (rows red first, a registered bar like D268's). If it is (a), propose the smallest change, e.g. never coarsen the
   cross-section of a tube piece in the cheap ghost.
- The keeper may send a screenshot. If one arrives, it is added here.

NEXT: chair dispatch D274 to E when this plan is read
