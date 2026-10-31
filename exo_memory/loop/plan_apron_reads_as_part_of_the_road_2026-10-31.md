# The apron reads as part of the road, up close and at the pits. Librarian, 2026-10-31 17:1x

The keeper, 17:09, driving the re-exported ELYSIUM (0.4.34), four screenshots in C:\Users\nname\Pictures\Screenshots: "Looks decent from the top down.png", "as well it doesnt connect to the pits seemlessly with the edges.png", "top down good.png", "flat flap.png". His words: "at a first glance, the sides of the track look decent, but when you look at it closer, the texture and geometry look bad... underneath that side its like a flat surface because of the cupping x banking... in the more banking last section from the top it looks good but under it looks like this".

## What the record says it is (src/export/apron.js at a93ae51, header)
- The apron leaves the road's edge row 2.0 m outward and 25 deg DOWN FROM THE ROAD'S LATERAL (APRON_WIDTH_M, APRON_SLOPE_DEG), not from the edge's own last segment. On a cupped or banked edge whose last segment curls up, the apron therefore sticks out as a flat plank from the top of the curl: the "flat flap" seen from below.
- Under it, a JOIN face (scenery) runs from the apron's outer row straight back to the underskin's edge row: a flat, dark, unshaded plane, which is the dark sheet in "flat flap.png".
- One material, plain uvs tiled every APRON_TILE_M, no texture continuity with the road: his "texture looks bad".
- Over the pit lane's span plus PIT_PAD_M each way, the side gets no apron, so at the lane's ends the apron starts and stops as a square step: the notch circled in "as well it doesnt connect to the pits...".

## The lap (one pane, PROVE IT: export geometry and the physics surface)
1. Measure first, from the exported ELYSIUM kn5 (G:\...\tracks\t180b_elysium, his 16:5x export): render the banked last section from above, the side and below, and the pit lane's two ends, headless, with the same camera spots as his shots where they can be found. Count where the apron's top meets the edge row at an angle (a crease) and by how much.
2. Shape: the apron leaves the edge along the EDGE'S OWN LAST SEGMENT's direction and rolls down to 25 deg below it over its width (a lip that continues the road, not a plank off the frame's lateral), so a cupped edge curls over instead of sticking out. The join under it becomes a curved underside that follows the apron and meets the underskin with matched normals, shaded like the underskin. Keep the wheel guarantee: a wheel 0.86 m out still has the apron under it within 0.1 m of where it falls (the D563 case), and steered back rides up with no lip above the edge row.
3. Texture: the apron's top carries the road's own material and uvs continued across the edge (v along s as the road's, u carried on past the edge), so the surface reads as one; the underside takes the underskin's.
4. Pits: at each end of the lane span the apron eases in over 20 m (width from 0 to 2.0 m) instead of a step, and where the lane's own outer edge is open it gets the same lip.
5. Proof: ELYSIUM and F1-F8 export byte-equal except the apron and its join (named diff); the soft-collision MESHES still cover the apron top; raygap reports no new gaps; the apron mutation rows plus new ones (direction from the lateral again; the ease dropped; the join flat again); renders before and after in an Artifact for him BEFORE landing (memory visuals-as-artifacts); fixtures 0 of 9; full suite at landing. Hidden desktop or headless only; check acs.exe before EVERY run, not once.

Falsifier: on his eye after the install, the underside still reads as a flat sheet from his "flat flap" spot, or a wheel off the edge on the banked last section catches on the lip instead of riding back: then the lip's roll is wrong, not the width.

Release: the apron is new in this release and this is his first close look, so recommend the publish waits for this and rides as 0.4.35 with the export banner and the overwrite warning. His veto stands.

surfaced: apron.js header (a93ae51); p-d563-wheel-under-O (the 0.86 m case); his four screenshots; memory visuals-as-artifacts; the standing rule on runs while AC is up (A's D591 correction 5).

## Amended 17:1x: his verdict on the physics comes first
The keeper, 17:17: "still needs more testing, but the sides work very well compared to hand made tracks for stopping wheel dropping off and clipping into the track, it will be revolutionary". The apron's PHYSICS is now approved by its user and must not change by accident. So:
- The physics apron stays exactly as exported today: the same vertices, the same names and the same collision. That is byte-equal by node for the 1ROAD_APRON_ and 1GRIPnnn_APRON_ meshes.
- The look is fixed in a separate VISUAL mesh: the curled lip, the curved underside, the road's texture carried across, and the 20 m pit ease. The physics apron is made not to render (the kn5 node's renderable flag off, the way AC tracks hide colliders), checked in his game.
- Step 2 of the lap above (the lip direction for physics) becomes a later, separate change, made only if his further testing asks for it.
- Falsifier added: if after the install a wheel behaves differently anywhere at the edge, the physics was touched. Diff the apron's physics nodes against today's export.
