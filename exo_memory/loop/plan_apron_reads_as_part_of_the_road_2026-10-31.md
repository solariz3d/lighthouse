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

## Amended 17:2x: the pit lane in the same pass (the keeper, 17:18: "what about the pit lane included into the apron generation and track all at once")
How it is built today, from a93ae51: the pit lane is built on its own (src/export/pitlane.js with src/geom/pitlane.js buildPitLane, plus an infill between the road's edge and the lane's inner edge). Then withApron (fromwords.js:310) walks MAIN-ROAD cells only, and skips the lane's side over the lane's span plus PIT_PAD_M = 5 m each way (apron.js:43, :110-113, :144). So the pit lane's own outer edge has no apron at all, and the main apron stops square at the span's ends.
His ask is the right shape: one outline. The apron is generated along the open outer edge of road + infill + lane taken together, so it runs from the main road's edge, around the lane's leave, along the lane's outer edge, and back at the rejoin, as one continuous strip with no square stops.
- Physics: the main road's apron outside the lane span stays byte-equal (the 17:1x amendment). New physics is added only where none exists today: along the lane's outer edge and through the leave and rejoin. It uses the same width, slope and naming, so the soft-collision MESHES cover it.
- Visual: the separate visual mesh of the 17:1x amendment follows the same one outline.
- Same pane and branch as the apron's look (O), in this order: the outline first, then the physics along the lane, then the visual mesh over everything. One file (apron.js) and one design, so it is not split.
- Proof adds: a wheel 0.86 m off the lane's outer edge has the apron under it within 0.1 m; the main apron outside the span is byte-equal; renders of the leave and the rejoin from his "pits" spot, before and after, in the artifact.

## Amended 18:0x: the colour, and the pictures (the keeper, 18:04)
"i liked the look of the original, it worked and was functional, BUT IT WAS JUST A THIN 1 PIXEL SLICE, NOT THE WHOLE THING IN REALITY... It should be darker shades asphalt on the sides or carry like the shadow if it needs be out of the light being darker than the same color of base of the track texture... the artifact images are too damn small cant even see or zoom in".
Reading: from above, the original edge read as a thin line, and he liked that. Up close, the side is a whole surface in a different, light colour. So:
- The lip and its underside carry the ROAD'S OWN asphalt texture, shaded DARKER than the road: one darker variant of the road material, as if in shadow, applied to the lip and the underside. They are not the old tan, not the skin's slate, and not a light colour. From above it then still reads as a thin dark edge line, and up close as darker asphalt rolling over.
- Renders: from his kn5 WITH the game's textures (the road's DDS), at 2560x1440. The page shows each picture full width, one per row, and opens the full-size image on click.

## Amended 18:1x: the shade (the keeper, 18:17, on the textured renders)
"I think thats it, but make the sides not so dark, perhaps the same base as the regular texture, but have it able to be affected by shadows you know? Or perhaps slightly darker not like crazy dark". So the lip uses the road's own material at the same base colour, or at most slightly darker (about 10 to 15 percent, never the near-black of fbc089e). It is lit by the game's own lighting and shadows like the road: normal shading, not a baked dark shade. The underside follows the same rule. That is his named yes on the shape of the main-road lip.

## 21:5x, his drive of ELYSIUM 0435 SCIFI: the lip is a blade
The keeper, 21:54: "the edges are ruined, they were perfect the first time, BUT just needed to not be the singular slice but filled in". 21:55: "the edges are this thin blade it comes to a point LOOK AT THE GEOMETRY".
Seen by me, rendered from his game folder (blade/sci-cup-side.png in my scratchpad, O's render2.js, cup-side camera): the lip's top rolls down 25 deg, the underside rises from the skin's edge to the lip's outer row, and the two meet in a knife edge 2 m out. In cross-section the edge is a wedge that comes to a point: the blade.
What he wants, in his words: the original edge (before any lip: the road's own edge as it was), with the thin slice between the road's top edge and its underside FILLED, so the edge has real thickness. So:
- DRAWN: no lip and no 2 m blade. The road ends at its own edge row as before the apron. A filled side face runs from the road's edge row down to the underskin's edge row (the existing width-0 SIDE FACE in apron.js), in the road's asphalt about 12 percent darker and lit normally, so from the side the edge reads as a solid band with the road's thickness.
- PHYSICS: the hidden apron stays exactly as it is (57 meshes byte-equal, hidden). His drive tells whether the hidden surface catches wheels; asked.
- PIT: the same rule along the lane's outer edge: a filled side face, no lip.
- Proof: a cross-section render at the cupped spot from the side, showing a blunt filled edge; renders checked by me at every spot before he sees them.

## 21:58, his verdict on 0.4.35 in the game: revert the apron, keep the pit
His shots: "look how the car falls through visible geometry.png" and "same time top down.png", both in Pictures\Screenshots. The car's wheels sink into the drawn lip while the hidden physics plank carries them lower: the 0.3 m mismatch O named in D593 section 5 is visible in play. His words: "the pit changes are decent, but we need to somehow revert back to what we had originally with the apron".
So:
- The APRON returns to 0.4.34's: the physics plank DRAWN, so what you see is what the wheels ride. Same vertices, so no sinking. No separate lip and no blade.
- It keeps two things he asked for tonight: the road's own asphalt texture at 0.88 (instead of the tan material), lit normally, and the "slice filled in", meaning the join under the plank is a closed face back to the underskin, as in 0.4.34, in the darker asphalt.
- The PIT stays as O built it (flat lane, taper, 0 clips, 0 open edges), with the same plank-style apron along its outer edge, drawn.
- Proof: drawn equals physics vertex for vertex on every apron mesh (count 0 differ); the clipping counts stay 0; renders of a wheel's view at the cup and bank spots plus the pit, checked by me first.
