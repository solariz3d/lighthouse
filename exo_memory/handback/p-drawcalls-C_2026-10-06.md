# D260 draw calls: hand-back from C (WIP, paused for the BIOS flash)

Branch `drawcalls-c` in `C:\Users\nname\Desktop\worktrees\c-drawcalls-wt`, commit **877e974** (WIP) on base main 5caf5c6. Not pushed. Status: **code done, measured on copies; tests NOT run, fixture manifest NOT done.**

## 1. Why the export splits so finely
`src/geom/mesh.js` `assemble()` (~214–217) writes one mesh node per (piece, cell). On an equation track every adapter segment is at most 2 m long (`src/core/adapter.js` toSegments, segM = 2), so the 150 m cellLength never binds and every segment becomes its own mesh. `src/export/underskin.js` then mirrors each road cell with a skin mesh. The result is about two meshes for every 2 m of road.

## 2. The change
`src/export/acready.js` `mergeForAc(scene, {maxVerts=65536, chunkM=400})` joins consecutive root meshes of one class into a chunk. The classes are `1ROAD_` (the pit is excluded) and `UNDERSKIN_`, and the meshes must share a material and the castShadows/visible/transparent/renderable flags.
- A chunk closes before it would pass 65,536 vertices (kn5write writes 16-bit indices, `src/export/kn5write.js:96-97`) or a 400 m bbox diagonal.
- Positions, normals and uvs are concatenated unchanged, and indices are offset.
- A one-member chunk is the original node.
- The names are `1ROAD_chunk_<n>` (a physics name, so `MESHES=1ROAD?` in trackfiles still matches) and `UNDERSKIN_chunk_<n>` (still not physics).
- Markers, walls, paint and the pit stay in place.

`src/export/fromwords.js` runs `ensureDiffuse(mergeForAc(weldSeams(flattenForAc(scene))))`. The merge must come after the weld, because weldSeams finds seams by name. `o.mergeMeshes === false` gives the old output.

## 3. Before/after on COPIES (inferred-from-scratch: `scratchpad/dc/run1.log`, `cmp-*.json`; base = git archive of 5caf5c6)

| | TEST 1 recovered (open, test export) | T-180 TUBE OVAL (closed) |
|---|---|---|
| meshes | **15,271 → 70** (road 7,630→31, max 65,520 verts; skin 7,633→31; other 8→8) | **6,008 → 60** (road 3,000→38, max 65,124; skin 3,001→15) |
| triangles | 1,457,224 = 1,457,224 | 2,593,082 = 2,593,082 |
| triangle set (float32 bits, winding, material) | EQUAL, 0 missing / 0 extra | EQUAL |
| other meshes, dummies | 0 changed; 13 = 13 | 7 unchanged; 9 = 9 |
| kn5 bytes | 75,401,394 → 74,212,551 | 130,654,651 → 130,191,695 |
| other export files | 9 hashes identical (AI line included) | 8 identical |

The keeper's copy of TEST 1 recovered has sha256 cd97c6ef…. Target "under ~1,000 meshes": met (70; Hazen Loop has 965).

**Not established:** the FPS gain. Nobody has driven it, and AC was not launched. Triangle density may still be higher than Hazen's (1.46M against 1.90M, lengths not measured). Skin is about 26% of TEST 1's triangles.

## 4. Still to do (after the flash)
1. Run `test/export_merge.test.js` (4 rows, written but never run) plus export_acready, export_words, kn5write, core_cup_fixtures and the app export tests, under the lock.
2. Write `manifest.d260.json` for F1/F2. `scratchpad/dc/fxmeasure.js` is written, but its run was stopped by the flash. Then the core_cup_fixtures amendment (AMEND4, the header, a d260 record row and the manifest sha line).
3. Add a CHANGELOG entry, the final commit, this hand-back's final form and the ring.

## 5. Touched files (E's D258 touches src/export)
`src/export/acready.js`, `src/export/fromwords.js`, `test/export_merge.test.js` (new). The test fixtures and CHANGELOG are next.

## Corrections to myself
- cmp.js first compared dummies by `d.matrix`, but readKn5 gives `pos` and `fwd`. Fixed before the numbers above.
- Row 4 of the test first asserted a tautology. I replaced it with an equal road-triangle count plus a check that a chunk exists.
