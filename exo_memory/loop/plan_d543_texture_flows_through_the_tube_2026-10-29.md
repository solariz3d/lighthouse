# D543: the road texture flows through a tube and a bend without stepping. Librarian, 2026-10-29 18:1x

The user, 18:11, with a screenshot from the game (`C:\Users\nname\Pictures\Screenshots\look at this cool screen shot but also look at how the track texture deforms when it curves it needs to not do that some how and flow more like perhaps we should do a whole track texture feature.png`): inside a closed tube on a bend, the texture's lines along the road are continuous on the floor under the car but break into short dashes on the walls and the roof, each dash offset sideways from the next at every row, a staircase that grows away from the floor. His words: "look at how the track texture deforms when it curves it needs to not do that some how and flow more like".

## What the mapping does today (checked in t180-fresh at the 0.4.31 tip, `src/texture/flow.js`, `src/geom/mesh.js:237-249`)

- Along the road, v is the row's own path arc length over tileLength (`flow.js` build: `v = (rowS[r] + offset) / tileLength`), continuous through every cell and seam. Good.
- Across the road, u comes from the mesh's own across-arc, which `mesh.js:242` lays ONCE PER CELL (`Us[k]` of the run), so within a 2 m cell every row has the same u, and the next cell has its own.
- On a CLOSED RING (a tube at 360°) `rowU` wraps u to a whole number of repeats round the circumference: `u = n · arc / w`, n = round(w / tileWidth), w the row's circumference, floor at u = 0, the seam at the ceiling. So wherever w differs from one cell to the next (the sweep or the width easing, the blend from one section to the next, or the ring's own discretisation), u at the same physical point on the wall shifts between cells by about n · arc · Δw / w², zero at the floor and largest at the roof. Within a cell nothing changes; at the cell boundary it jumps: the staircase, growing away from the floor. This is the inferred cause; Part 0 measures it before anything is built.
- A plain road and an open tube take `u = arc / tileWidth` (metres, no wrap), so they do not step this way; a bend only stretches v on the outside and compresses it inside, which is right.

## Part 0 (pane E, measure first, read only): is it the per-cell wrap?

On the user's own tube track (his saved `eq-T-180 TUBE OVAL` or `eq-T180 TUBE V2`, or CRAZY TEST's tube stretch: whichever the screenshot's tube is, E reads the file names and picks the one with a closed tube on a bend) export the mesh headless and, for a wall column and a roof column, list u row by row through 20 cells of the tube's bend: the jump in u at each cell boundary against the change within the cell, and w per cell. If the boundary jumps are of the order n·arc·Δw/w² and the within-cell change is 0, the cause is confirmed. If u is continuous across cells there, the cause is NOT the mapping: then look at the texture image (the asphalt preset's lines) and at the kn5's uvs as written, and say so. Figures in the hand-back; no fix before this.

## Part 1 (pane E, PROVE IT: export data): one scale per tube run, u per row

If Part 0 confirms: a closed ring's u is laid with ONE scale for the whole run of ring cells (the run's reference circumference W and its n, from the run's first full ring row, or the piece's nominal width), `u = n · arc / W`, so u at a fixed point on the wall is the same number in every cell and the lines run straight; and u is laid PER ROW from that row's own arc (the mesh gives the arc per run today; flow.js reads `uvs[(r·K+k)·2]·10` per row already, so the per-row part is the mesh's to give: E checks whether `Us` is per run or per row and makes it per row if it is not, in `mesh.js` or in flow.js from the segment's section at the row). The cost: where w drifts from W the seam at the ceiling meets itself only to within n·(w − W)/(2W) of a repeat; E measures that on his track and reports it (a seam line on the roof against stairs on every wall is the trade, and the plan takes the straight lines). Open tubes, cups and plain roads: bytes unchanged. A word document's coordinates and every untextured export: byte for byte (the nine fixtures: textured ones will differ; E lists which, with the reason, and the untextured read 0 of N differ).

Tests first, red before green (`test/texture_flow.test.js` extended or a sibling): on a closed tube whose circumference eases 31 → 32 m over 10 cells, u at the roof column is continuous across every cell boundary (jump < 1e-6 repeat) where today it jumps; u at the floor column is 0 throughout; the seam mismatch at the roof equals n·(w − W)/(2W) within 1e-6; a plain road's and an open tube's uvs byte-identical; a tube of constant w byte-identical (W = w). Mutation: the harness that reaches flow.js (E names it; `core_xsec_mutation` or `export` harnesses) whole.

## Part 2 (pane A, CHECK IT): the preview and the game

Render the preview at the screenshot's spot before and after (headless, `--mute-audio`) and hand the two shots to me for his page; export the fixed track into the game's folder as a `_test` copy (never over his track) so he can drive it and see the walls. His eye in the game is the judge.

Kept out: a "whole track texture feature" (his phrase; what he wants in it is his to say after this: lines, lanes, layers, per-piece textures); the texture image itself; CSP's rendering.

Falsifier: if Part 0 finds u continuous across cells on the wall, this plan's cause is wrong and Part 1 does not run; the lap turns to the texture image and the kn5.

Branch from the 0.4.31 tip's line (d541-a / d542-a as C lands them); plain commit message, co-author line allowed; no lap ids in new comments; it rides the release after 0.4.31 unless Part 1 is small and green before C builds 0.4.31, in which case it rides that.

surfaced: flow.js:1-20 (why), rowU, build, flowCell; mesh.js:237-249; test/texture_flow.test.js; the tube tracks in his saved files.
