# The pit lane grows out of the road, as one surface. Librarian, 2026-10-31 18:0x

The keeper, 18:02, on O's D593 renders (https://claude.ai/artifact/NqijRHG2XMh2dsFkZKbADX): "also the pit implementation looks like garbage straight up". Earlier, 17:18: "what about the pit lane included into the apron generation and track all at once".

## What the renders show (cut-pit-leave-above.png and cut-pit-leave-low.png, read by me)
The lane is a flat slab set beside the road. Its front end is square at full width, with rounded corners. The road and the slab meet along a straight seam, with a small square tab at the inside corner. From low, the lane's end sticks out past the road as a blunt plate. The apron's new lip runs round that box, which makes the box more visible, not less. This is the lane's own geometry (src/geom/pitlane.js buildPitLane, src/export/pitlane.js infill): the lane "leaves at full width" (D593 section 1), and the infill fills the gap between road and lane.

## The change (pane O, PROVE IT: geometry and the physics surface)
- The lane is born from the road's edge. At the leave, its width is 0 and its surface is the road's own cross-section continued, sharing the road's edge vertices. Over a taper (default 150 m, the length of a real pit entry taper; or the lane's own s0 to the box line, whichever is shorter), the lane widens to its full width and its surface eases from the road's bank and cup to the lane's own flat. Only then does it separate. The rejoin is the mirror. No square end, no seam, no infill slab, no concave corner.
- The road's outer edge over the taper is the lane's outer edge. The apron, as physics and lip, follows that one outer edge continuously, which is what his 17:18 ask means. The main road's apron outside the lane span stays byte-equal, as he approved it.
- The pit lane's surface name and its existing rules (the speed limit line, the boxes, the AI pit line) keep working: their tests run once.
- Proof: renders from the D593 pit spots, before (today), after, and a plain top-down of the whole lane, in an Artifact for him BEFORE landing. The lane's surface meets the road with no step over 1 cm and no crease over 5 deg along the taper. rayGaps finds no new gaps. The pit mutation rows plus new ones: the square end returns, the taper is dropped. Fixtures 0 of 9.
- D593 lands WITHOUT its pit outline (the main-road lip only), so the edges he liked are not held back. The pit outline returns with this lap.

Falsifier: if on his eye the lane still reads as a box set beside the road, the taper is too short or its surface does not carry the road's bank long enough. Lengthen the blend, do not add trim.
