# D524: the road lines break up on a bump in the preview. Librarian, 2026-10-28 16:0x

The keeper, 15:59, screenshot "test bump" (a 500 m straight, one Grab lift; the checker's red at 156–174 m): "test bump, it works good tested it in assetto, there is a bump and the car goes over it good, but in the previewer it looks glitchy from the white lines". File name: "could we make it so the previewer shows the track as it is when it is bumpy or those white lines occur".

## What is on disk (checked at t180 d522-c b8387c0, worktree t180-wt-c519)

- The white lines are the road lines of `app/preview/look.js` linesFor (:30-70): the two EDGES and the CENTRE along every mesh row, and a TIE across the road at the first row past each 10 m (TIE_M). Each vertex is lifted LIFT = 0.03 m along its normal "so the line never fights the surface" (:30, :36).
- They are drawn by `app/preview/renderer.js` drawRoadLines (:356-368) with the depth test ON and no depth bias: the only thing between a line and the surface it lies on is that 3 cm. The line shader (:72-79) writes gl_Position straight from uVP·uModel.
- The mesh steps adaptively along the road (`src/geom/mesh.js:24-31`: chord error 0.02 m, seam angle 1°, cap 4 m), so a bump packs the rows close and tilts them against the camera; the depth buffer's resolution at that distance is coarser than 3 cm of lift, and the ties and edges there come out dashed where the surface wins the depth test. That is the "glitchy" look; the geometry and the export are untouched (the car went over it fine).
- Export's lines are not involved: the kn5 has no such lines; this is editor UI.

## Decided: just do it (visible at a glance), pane E (C holds d522-c, O builds D521)

A depth bias for the road lines so they never lose the depth test to the surface they sit on, whatever the distance or the slope: in the line shader, pull gl_Position.z toward the camera by a small amount scaled with w (the usual line-over-surface bias), or raise LIFT with distance; E picks the one that keeps the lines crisp at the far end of a 10 km track and off the far side of a hill (a line must still hide behind a crest it is behind). The marker and grid passes (:380-383, :441) already run without depth and are not in this.

Build on d522-c (so the install is on top of D522). Check: E rebuilds the keeper's track headless (a 500 m straight, Sculpt Grab at the default 30 m radius lifting the road about 1 m at ~165 m, so the checker reds 156–174 m as his did), renders before and after from a free-view camera like his screenshot (looking along the road from near the start) and from a side view, muted headless Chrome BelowNormal; the renderer's own test files if any name the line shader; the skin test is not needed (no strip change). Install `.before-d524`, sha256; the hand-back names the two PNG pairs (before/after) by absolute path so the librarian can put them on one page for the keeper (the visuals rule). One line back.

surfaced: look.js:30-70, renderer.js:72-79/:356-368/:380-383, mesh.js:24-31.
