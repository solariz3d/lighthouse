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

## Corrected 18:1x, in his words (the keeper, 18:11, answering when I asked)
"the pit and apron geometry clip through each other... I want it to look exactly how it does on the rest of the track like the pit IS the track". And on the bank ramp: "Nope, just how the apron is different on increased CUpping, it was my bad for that." So the D521 bank-ramp lap is DROPPED (plan_bank_ramp_smooth_not_a_slice_2026-10-31.md is void).
The pit ask, as he states it:
1. No geometry clipping through other geometry. The pit lane, the infill and the apron must not intersect. His screenshot "as well it doesnt connect to the pits seemlessly with the edges.png" shows the apron's wedge stepping into the lane.
2. The pit lane is built and looks EXACTLY like the rest of the track: the same road surface, the same edge treatment, the same lip in darker asphalt, the same apron physics under it. The join to the main road is one continuous surface. The 150 m taper above is one way to get there, not a requirement of his. O chooses the construction that meets 1 and 2 and says why.
Proof as above, plus: zero triangle intersections between the pit lane, the infill, the road and the apron meshes in the export (a mesh-intersection count, 0 before landing), and renders from his "pits" spot with textures at 2560x1440.

## His marked-up shot, 18:13 ("look how its smooth in red before but then in after orange there is a big gap for some reason its not good.png", Pictures\Screenshots)
This is O's view pit-leave-under, before and after (97ab62e). Before, the underside under the lane's leave is one smooth sheet from the road's underside to the lane's tip. After, the new underside stops short of the lane and leaves a bite: a curved notch, open between the road's underside and the lane's underside, with a stepped sliver. The defect to fix: no gap and no notch under the leave or the rejoin. The underside is one continuous surface under road plus lane, as smooth as before, and in the darker asphalt from below. The proof adds a view of pit-leave-under and pit-rejoin-under at 2560x1440 with textures, and an open-edge count of 0 on the undersides' join.

## His read of A's D596 renders, 18:25 (https://claude.ai/artifact/YNU5tK6qdHwUzu48FcFTiB)
"where did the pit lane go lmfao? Most of it is gone, and the side of it doesnt look like the rest of the apron on the track". Checked against pit-lane-top, base and new: in base, a separate strip runs beside the main road for the lane's whole length. In new, that strip is mostly folded into the main road's outline, and the lane no longer reads as its own lane. My slip: I called the shape "a clear improvement" from the close taper views, without opening the whole-lane view.
The fix, in his terms:
- The pit lane keeps its FULL length and width as its own lane, beside the road, for everything between the taper ends. Only the first and last stretch blend, and the taper must never shorten or narrow the lane's straight. The top-down view must show the lane as long as before.
- The pit lane's outer side carries exactly the main road's lip and apron: O's d593-o lip, in the shade he asked for. A therefore builds on top of d593-o, not on a93ae51, so the lane gets the same edge with no second version.
- Renders: textured, with ambient light, 2560x1440, including the whole-lane top-down. I check the whole-lane view before it reaches him.

## His read of O's pit (ae6d262/18b1774), 18:54, and what I see in the same renders
His words: "its getting closer, but there are still geometry clipping inconsistencies, and also, from the pics it looks like the pit is banked, if the track is cupped, the pit is still flat and has an apron that would look the part with a flat piece".
Seen by me, in G:\Consonance-tools\scratch-O-d593\tex at 2000 px wide:
- after-pit-leave-low.png, about x 780-850, y 540-580: spikes, or slivers of triangles, poking out of the edge where the lane leaves.
- after-pit-rejoin-above.png, about x 820-1100, y 90-700: a striped band along the lane's inner edge where two surfaces overlap in the same place (z-fighting), plus a small square notch at the top, about x 820-870, y 90-110.
- after-pit-leave-above.png, about x 810-870, y 620-680: a small square step where the lip starts.
O's count says 0 intersections, but coplanar overlaps and slivers are not intersections, so the count missed what he sees. The count must add both: overlapping coplanar triangles, and triangles thinner than 1 cm.
The pit must be FLAT. The lane carried the road's cup and bank over the diverge, so it reads as banked. Correct: the pit lane is flat across, as it was. Where it leaves a cupped road, the road keeps its cup, the lane stays flat, and the surface between them blends without the lane tilting. The lane's outer edge takes the lip and apron of a FLAT road (the plain flat-edge case), not the cupped-road lip.
