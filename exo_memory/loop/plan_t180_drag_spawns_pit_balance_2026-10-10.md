# T-180: drag the start line, the grid pack and the hotlap with the mouse; and centre the pit boxes in the pit lane. Librarian, on D, 2026-10-10 06:1x. Lap D285.

The keeper, 06:11: "i want to be able to just click the hotlap spawn and move it by mouse, also, the pit lane spacing starts half way through the pit,
it needs to be pushed more to the front of it to be balanced … Pit 1 starts half way to the back of the pits. Also click dragging the start line and
then the pack of cars at the start line too, so i can click and move both intuitively".

Base for both parts: B's `9bdd10d` (b-startline, D284). It touches `src/markers/layout.js` and the start line, so work on top of it, not 8639987.

## Part 1 (A, who fixed the jump handles in D278): drag the markers in the preview
Today the start line, the grid and the hotlap are set by numbers in the "Start & grid" panel (`app/core/spawnsui.js`) and drawn by
`app/core/spawnslayer.js`. The preview already has pointer-drag handles (`app/core/handles.js`, `app/preview/preview.js`). Reuse that pattern; add no new
library.
- **The start line:** click it and drag. It slides along the first piece (the same `spawns.line.along`, clamped to the piece) and follows the road under
  the cursor.
- **The grid pack:** click any grid slot and drag. It changes the gap from the line to the pole (moving the whole pack back or forward behind the line), and the pack
  stays in its two staggered columns. Dragging the line carries the pack with it. Spacing stays the panel's number.
- **The hotlap spawn:** click it and drag it anywhere on the track. It snaps to the piece and distance under the cursor (`spawns.hotlap.piece`/`along`).
- **First drag on an automatic track:** writes `spawns` from the automatic layout, then moves it ("start placed by hand"), the same as typing in the
  panel. The panel's numbers update live.
- **One drag = one Undo step.** No pointer-lock banner (D270). The camera does not move while dragging a marker.
- **Rows:** a drag of the line by N m moves `along` by N (±0.5 m) and the world line follows; the line stays clamped to the first piece; dragging a grid
  slot moves the pack and keeps its shape; dragging the hotlap to a later piece sets its piece and along; one Undo restores the pre-drag doc; the panel and
  the TEST export read the dragged positions.

## Part 2 (B, who just worked in this code in D284): the pit boxes balanced in the lane
- **Cause, read:** `src/markers/index.js:27` puts box 0 at `lane.path.lengthM / 2` (the lane's midpoint) and every next box `spacingM` BEHIND it. So
  the row runs from the middle of the lane backwards, and the front half of the lane is empty.
- **Fix:** centre the row of boxes on the lane's usable straight (the part between the entry and exit tapers, not the full arc length). Box 0 goes at the
  front of the centred row, so pit 1 is the first box the car reaches after it enters, and the last box sits as far from the exit as the first sits from the entry.
  Keep a hand-set `layout.pits.lane.along` as it is.
- **Rows:**
  - red first: today's row starts at the lane midpoint;
  - after the fix, the gaps before the first box and after the last box are equal within one spacing, for 2, 6 and 12 boxes;
  - no box sits on a taper;
  - the boxes stay on the lane, and the pit infill (D279) still has 0 ray gaps;
  - `cmcheck.js` passes.

## Landing (one build for both)
This is export geometry (the pit spawn positions), so run the full suite and the core harnesses. Then install with a `.before-drag` backup, after
D284 is installed. If the track builder is open, wait.

NEXT: chair dispatch D285 part 1 to A and part 2 to B, both from 9bdd10d, when this plan is read
