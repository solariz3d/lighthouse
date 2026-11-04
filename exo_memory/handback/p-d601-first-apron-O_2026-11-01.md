# D601: which apron is "the first version" (pane O, 2026-11-01)

The chair's 08:30 ring: renders only, no code change, nothing installed or released. His words on 0.4.36 (laptop): the apron "comes to a knives edge instead of the first version"; he wants to "completely revert to the first version apron".

## The answer in one line

**The apron geometry is the same in all three, byte for byte.**
- (a) his first "ELYSIUM APRON", (b) his Oct 31 export, (c) a fresh 0.4.36 export: the same 57 planks and 57 joins, drawn the same.
- **What differs is the material:**
  - (a) and (b): flat dark grey, untextured;
  - (c), 0.4.36: the road's own asphalt at 0.88.
- (c) also has the pit lane's own plank and join.
- inferred: the "knife edge" he sees in 0.4.36 is the same wedge (a plank 2 m out and down, its join back to the skin, meeting at the outer row). In road asphalt it reads as the road running out to a point, where dark grey read as a separate band.
- The renders below are how to check that. inferred: if he means the **edge before any apron**, that is 0.4.31, rendered here as an extra set.

## The three sources (read only; copied out of the game folder)

| | source | written (its marker) | kn5 sha256 | size |
|---|---|---|---|---|
| (a) | `content\tracks\t180b_elysium_apron` | 2026-10-31T03:56:52Z (21:56 local, Oct 30) | `27321f34aa515bf7…` | 196,257,975 B |
| (b) | `content\tracks\t180b_elysium` | 2026-10-31T22:56:41Z (16:56 local, Oct 31) | `a7c986def7613643…` | — |
| (c) | fresh 0.4.36 (`f44f76e`) export of eq-ELYSIUM `2ab08386d2afb287…` | 2026-11-01, into `G:\Consonance-tools\scratch-O-d601\c\` (not content\tracks) | — | 196,417,347 B |

- Both markers name the same geometry, `sha256:e68a5224…49d3`, which is the document (c) was built from.
- (c) was built by `S\d593\spots.js`, the app's route (`buildFromSegments`), in a worktree at `f44f76e` (`v0.4.36`), with the asphalt texture as the page builds it.

## Mesh by mesh, the apron groups (`S\d593\apcmp.js`, test/fixtures/kn5nodes.js; output `S\d593\apcmp-d601.txt`)

| compare | planks `1ROAD_APRON*` | joins `APRONSIDE*` | lip `APRONLIP*` | `t180b_apron` material |
|---|---|---|---|---|
| (a) vs (c) | 57 same bytes, 0 changed; +1 in (c) (`1ROAD_APRON_PIT_R`) | 57 same bytes, 0 changed; +1 in (c) (`APRONSIDE_PIT_R`) | 0 / 0 | `24b8537e…` vs `df1734f7…` |
| (a) vs (b) | 57 same bytes | 57 same bytes | 0 / 0 | `24b8537e…` both |
| (b) vs (c) | 57 same bytes; +1 in (c) | 57 same bytes; +1 in (c) | 0 / 0 | `24b8537e…` vs `df1734f7…` |

- "Same bytes" means each node's whole record: name, vertices with normals, uvs and tangents, indices, material index, and flags.
- In all three, every plank and join is drawn (visible, renderable, casting shadows).
- 0.4.36's material is the road's texture with its ambient, diffuse and specular × 0.88 (D593); (a)'s and (b)'s is the plain dark `t180b_apron` (ambient 0.25, diffuse 0.3, no texture).

## Which build made (a)

- **Not 0.4.31.** The same document exported at `849e7db` ("Version 0.4.31", committed 21:13 local, Oct 30) has **no apron at all**: 0 planks, 0 joins, 5 materials (`S\d593\apcmp-d601.txt`, last block).
- **Not 0.4.32.** "Version 0.4.32" (`d08feea` / `4078884`) was committed 02:38 local on Oct 31, after (a)'s marker (21:56 local, Oct 30).
- inferred: (a) was made by a build carrying the D572 apron between those two versions: D572's own landing on the evening of Oct 30, before a version number covered it.
- The installed backups agree in order, though they don't settle the time:
  - `t180-track-builder.exe.before-0.4.32` has mtime 2026-10-30 22:12 local. It is the exe that 0.4.32 replaced, and its mtime looks like that exe's own build time, one minute before (a)'s folder (22:13).
  - `.before-0.4.33` 02:41, `.before-0.4.33-land` 11:17 (`803ba335`), `.before-0.4.33-final` 12:20 (`9e6e37b2`), `.before-0.4.34` 13:10 (`7373f150`), all Oct 31.
  - inferred: none of these can be (a)'s builder; all are later.
- Either way, the **apron (a) carries is the apron 0.4.34 carries and 0.4.36 carries**, in geometry: the mesh compare above settles that whatever the build.

## Renders

`G:\Consonance-tools\scratch-O-d601\renders\`, 2560×1440, textured, ambient and exposure ×1.8, one camera per spot across all sets (`S\d593\views-d601.json`):
- `a-*.png`, `b-*.png`, `c-*.png`;
- `extra-0431-no-apron-*.png`: 0.4.31, the edge before any apron, in case that is the "first version" he means.

The spots: `cup-side`, `cup-under`, `bank-side`, `bank-under`, `pit-leave-low`, `pit-rejoin-low`, and **`edge-section`**: a close cross-section of the outer edge on the cupped stretch. It looks straight along the road from 7 m back at the left edge (cup 57°, s ≈ 22,131 m), 1 m out, fov 25°. That is where a knife edge shows.

28 images: 7 spots × 4 sets.
- They waited for acs.exe: it came up mid-task, and the renders ran at 08:50 once it had been closed for two checks.
- I looked at `edge-section`, `cup-side` and `pit-leave-low` across the sets. inferred, for the rest: same cameras, same geometry; one look each at the others is owed by the librarian's check.

**What they show** (inferred, from the images; the geometry part is measured above):
- **`a-cup-side` against `c-cup-side`, and `a-edge-section` against `c-edge-section`:** the same shape.
  - In (a) the plank is flat light grey (the untextured `t180b_apron`), so it reads as a separate band between the road and the dark join below: an edge with thickness.
  - In (c) the plank wears the road's asphalt, so road and plank read as one surface running out over 2 m to the dark join. That is the knife edge, though no vertex moved.
- **`extra-0431-no-apron-*`:** the road ends at its edge, with the dark gap down to the skin (the "singular slice" of 21:54, if that is the version he means).
- **`a-pit-leave-low`:** (a)'s pit as it was. The apron stops square at the lane's span and a dark gap shows beside it. `c-pit-leave-low` has the current pit (the outline round the lane, no gap).

## Merge plan: the first apron with the current pit (the keeper, 08:33; WRITTEN, NOT BUILT)

No code until he picks which apron is "first". There are two readings, so two plans. Either way it is a PROVE IT lap:
- the main-road physics byte-equal to what he drove;
- clips, coplanar overlaps, slivers under 1 cm and open edges (strict) all 0;
- every render view, including the whole lane from above.

### If "first" is (a), the first ELYSIUM APRON (the D572 apron, flat dark grey)

The geometry needs no merge. Measured above, (a)'s 57 planks and 57 joins are byte-identical to 0.4.36's. What differs is the colour, so the merge is one material.

- **Main road, from (a):** the D572 apron as built in `src/export/apron.js`:
  - `apronOf` (plank and join per cell side) and the `withApron` loop that writes both, drawn, on `t180b_apron`. Both are already in 0.4.36 unchanged.
  - inferred: the same code as a93ae51's; row 17 pins the planks' bytes, and the compare above shows the joins equal.
  - The one thing to restore is **`apronMaterial`'s plain dark material**. Today `withApron` passes the road material (`apronMaterial(roadMat === null ? null : materials[roadMat])`, D593); passing none gives back (a)'s `t180b_apron` (ambient 0.25, diffuse 0.3, specular 0.05, no texture).
- **The pit, as it is now:**
  - `src/geom/pitlane.js`: `buildPitLane`, `TAPER_MIN_W` = 0.50, the flat lane, `widthAt`;
  - `src/export/pitlane.js`: `laneForExport`, `blendUvs`, `infill`;
  - `src/export/apron.js`: `pitSkins`, `outlineRows`, and `outlineMeshes`, with its across runs fanned from the lane row's outer point and their caps facing out (`capN`).
- **The first apron's shape round the pit outline:** already so. `outlineMeshes` lays the plank by `apronOf`'s own rule (out along X by `widthM`, down by `widthM · tan 25°`) and the join back to the skin's edge, on the same material index (`matIndex`), so it takes whichever `t180b_apron` the main road has. Nothing to add.
- **Where they collide:**
  1. **The material.** The one change. With (a)'s material, the lane's outline turns dark grey too, matching the main road's apron as in (a).
  2. **Tests that pin D593's material:**
     - `test/export_apron.test.js` row 15 (the apron is the road's shade) is amended by name to (a)'s material;
     - P9 and P13 in `test/apron_mutation.test.js` are re-aimed;
     - `test/fixtures/manifest.d593.json` and its row in `test/core_cup_fixtures.test.js` are remade. inferred: with (a)'s material, F1 and F2 go back to the D572 record's kn5 exactly (fixtures have no pit lane), so the D593 seal amendment could be retired rather than remade;
     - the export-isolated pins (`app/test/export-isolated*.test.js`): the open export goes back to `2b6ad34e…`; the lap keeps a pin that moves for its pit only.
  3. **Nothing else.** The pit's code doesn't touch the main road's apron (row 17 pins it), and the main road's code doesn't touch the pit's outline beyond the shared material.
- **Size:** one line of code, plus the test and record amendments above.

### If "first" is the edge BEFORE any apron (0.4.31: `extra-0431-no-apron-*.png`)

- **Main road, from 0.4.31:** no apron at all; the road's edge row and the underskin as `src/export/underskin.js` writes them. That is `withApron`'s width-0 path minus its side face, or `withApron` not called.
  - The D563 wheel case comes back: a wheel off the edge has nothing under it and can clip under the road (p-d563). The keeper's 17:17 on the first apron: "the sides work very well compared to hand made tracks for stopping wheel dropping off and clipping into the track".
- **The pit, as now:** the lane, its skins and its infill (`pitSkins`, `infill`).
- **The pit outline's apron:** none, or the plank alone without the main road's (`outlineMeshes`, which today runs only when `widthM > 0`).
- **Where they collide:**
  1. The pit outline was built to meet the main apron either side (row 14: "onto the main apron either side"). With no main apron its two ends stand alone, and the downforce-ray check over the lane's span (rows 9, 10, 14) would read the edge beside the lane as it read before D572.
  2. The physics would no longer be "byte-equal to what he drove" in 0.4.34–0.4.36 (no apron at all), so the pinned physics (row 17) would be retired, which is his call.
- **Size:** larger, and a choice about the wheel case first.

### What I would ask him to compare

His renders, side by side, before he picks:
- `a-cup-side` / `c-cup-side` and `a-edge-section` / `c-edge-section`: the same shape in two colours;
- `extra-0431-no-apron-edge-section`: the edge with no apron.

## What I did not do

- No code change.
- Nothing installed or released.
- Nothing written to the game folder; its files were copied out and read.
- The worktrees at `f44f76e` and `849e7db` were made on G: for the two exports and are removed after.
