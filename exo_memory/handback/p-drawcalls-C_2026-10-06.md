# D260 draw calls: hand-back from C (DONE)

Branch `drawcalls-c` in `C:\Users\nname\Desktop\worktrees\c-drawcalls-wt`:
- **42d7bd5** (final) on top of **b08ebcb** (the WIP, rebased from 877e974 onto main **cc177c5** with no conflict).
- Not pushed. EXPORT tier: targeted tests plus the fixture record; the harnesses run at the librarian's install.

## 1. Why the export splits so finely
`src/geom/mesh.js` `assemble()` (~214–217) writes one mesh node per (piece, cell). On an equation track every adapter segment is at most 2 m (`src/core/adapter.js` toSegments, segM = 2), so the 150 m cellLength never binds and each segment becomes its own mesh. `src/export/underskin.js` then mirrors each road cell with a skin, which gives about two meshes per 2 m of road.

## 2. The change
`src/export/acready.js` `mergeForAc(scene, {maxVerts=65536, chunkM=400})` runs after `weldSeams` in `src/export/fromwords.js`; it must come after, because the weld finds seams by name.
- It joins root meshes of one class into chunks: `1ROAD_` road cells (the pit lane `1ROAD_PIT_` excluded) and `UNDERSKIN_` skins. Members must share the material and the castShadows/visible/transparent/renderable flags.
- A chunk closes before it would pass 65,536 vertices (the kn5's 16-bit indices, `src/export/kn5write.js:96-97`) or a 400 m bbox diagonal.
- Vertices are copied byte for byte and the indices offset; a one-member chunk is the original node.
- Names: `1ROAD_<piece>_chunk_<n>` and `UNDERSKIN_<piece>_chunk_<n>`, after the first member's piece. The road keeps its physics prefix, so `MESHES=1ROAD?` still matches, and the skin stays non-physics.
- Markers, walls, paint, the pit lane and the AI line are untouched.
- `buildFromSegments(…, { mergeMeshes: false })` gives the old output.

## 3. Results, re-derived on the rebased tree (before = git archive of cc177c5, scratch `dc/base2`)

**Copies of the keeper's tracks.** Exported by `dc/measure.js` through the app route; compared by `dc/cmp.js` → `dc/cmp2-*.json`, log `dc/run4.log`. The track files are copies in `dc/docs/`.

| | TEST 1 recovered (open → test export) | T-180 TUBE OVAL (closed) |
|---|---|---|
| meshes | **15,271 → 70** (road 31, max 65,520 verts; skin 31; other 8 → 8) | **6,008 → 60** (road 38, max 65,124; skin 15; other 7 → 7) |
| triangles / vertices | 1,457,224 / 1,487,754, equal | 2,593,082 / 2,605,134, equal |
| triangle set (float32 bits, winding, material) | **EQUAL**, 0 missing / 0 extra | **EQUAL** |
| other meshes, dummies | 0 of 8 changed; 13 = 13, equal | 0 of 7; 9 = 9, equal |
| kn5 bytes | 75,401,394 → 74,212,789 | 130,654,651 → 130,191,854 |
| kn5 sha256 before / after | b9590210… / bc85e511… | 226c6079… / 5f56a325… |
| other export files | hashes identical (AI line, map, surfaces, models…) | identical |

The before hashes equal the pre-rebase ones on 5caf5c6, so D258 did not move these exports. The names come out as `1ROAD_p1_chunk_0` …, all unique (`dc/run5.log`). **Target "under ~1,000 meshes": met.** Hazen Loop has 965.

**Fixtures F1, F2.** `test/fixtures/manifest.d260.json`, sha256 58ce2577…, made by `dc/fxmeasure.js` + `dc/mkmanifest.js`.
- Before equals the D230 record in all six digests; mkmanifest refuses otherwise.
- segs, path and mesh are unchanged and the kn5 changed.
- Each fixture goes from 1,504 meshes to 15 (road 748 → 4, skin 749 → 4, other 7 → 7).
- Triangle sets are equal (F1 139,498 triangles, F2 185,936) and the markers are equal.
- The kn5 is 114,985 bytes smaller.

## 4. Tests (`dc/run3.log`, under the heavy-run lock, `--test-concurrency=1`, on 42d7bd5's tree)
**136/136 pass** over 16 files: export_merge (new, 4 rows), core_cup_fixtures (amended), export_acready, export_words, kn5write, core_cup_export, export_csp, export_tube_grid, export_width, export_test_unfinished, markers_export, export-layouts, export-textures, app/test/export, app/test/export-csp and app/test/export-selfcheck.

The 136 checks out: the static count is 129 `test(` calls, and the 7 loop-generated rows were also seen in run2.

**core_cup_fixtures, amended by name** (the d196/d222/d230/d258 pattern):
- a header paragraph and AMEND5;
- the sha line, the key and unchanged checks;
- amendedManifest takes after_d260;
- a new "D260 amendment record" row: the before digests are the D230 record's, segs/path/mesh are unchanged, the kn5 moved, the triangle set is equal with 0/0, the triangle count is equal, markers are equal, the "other" count is unchanged, there are 10× fewer meshes, and the byte change agrees.

Row 5a still reads "6 of 9 differ", with F1 and F2 differing in kn5 only.

## 5. Not established
- **The FPS gain.** No AC launch. The triangle count is unchanged (TEST 1: 1.46 M against Hazen's 1.90 M, track lengths not measured), so triangles per km may still be higher. If frames stay low after the keeper drives it, the next levers are coarser road tessellation or the skin (26% of TEST 1's triangles: SKIN_COLUMNS 32 → fewer, skin only in tubes, or shadow-only flags, unchecked).
- Whether AC culls 400 m chunks well. 400 is a judgment, not measured.
- No harness (mutation) run; that is the librarian's at install.

## 6. Touched files (for E's merge; E's D258 is already in cc177c5 and touched only `test/export_test_unfinished.test.js` under export)
`src/export/acready.js`, `src/export/fromwords.js`, `test/export_merge.test.js` (new), `test/core_cup_fixtures.test.js`, `test/fixtures/manifest.d260.json` (new), `CHANGELOG.md`.

## Corrections to myself
1. The first naming, `1ROAD_chunk_<n>`, failed `app/test/export.test.js:158` (run2, 126/127). That test finds w1's textured floor on a `1ROAD_w1_` mesh, a real behaviour that the anonymous names erased. I fixed the implementation by naming each chunk after its first piece; a textured piece's floor is its own material, so it is a chunk of its own. That test was not edited. My own new test's expected names were updated.
2. cmp.js first compared dummies by `d.matrix`, but readKn5 gives `pos` and `fwd`. Fixed before any number.
3. Row 4 of export_merge first asserted a tautology. Replaced with an equal road-triangle count plus a check that a chunk exists.
4. Twice this lap I lost a backslash in an escaped anchor (`\'`, `\d`) passed through a template literal or `node -e`. Both threw before writing, so no file was harmed; redone with the Edit tool.
5. My name-print step in run4 failed on a `/c/` path given to node (MODULE_NOT_FOUND); run5 redid it.

## Follow-up (the chair, after the librarian's full suite on aa150a8 had 2 fails)
Branch `drawcalls-fix-c`, worktree `C:\Users\nname\Desktop\worktrees\c-drawcalls-fix-wt`, **one commit 49f3dff on aa150a8**. Not pushed. Touched: `app/test/aclook.test.js`, `test/doc-e2e.test.js`. No source file changed.

**The two fails** (librarian TAP `fullaa1.tap` lines 123 and 7086):
1. `app/test/aclook.test.js:182` "every mesh the preview draws is in the kn5, under the same name, with the same material". 24 cells (`1ROAD_w1_in_0` …) read "t180b_road vs undefined", because the cell names are gone from the merged kn5.
2. `test/doc-e2e.test.js:61` "the ramp is meshed into the kn5". It finds the ramp by `/w3/` in a mesh name.

**Judgment: (a) for both.** The subject is "this geometry reaches the kn5", and the name was the join key. I checked for (b), a consumer needing per-piece names in the kn5 AC loads:
- the exporter writes only `MESHES=1ROAD?`, a wildcard (`src/export/trackfiles.js:22`);
- the pit stays `1ROAD_PIT_`, which is not merged;
- `app/preview/kn5look.js` and `tools/kn5.cjs` are readers for tests and tools;
- we write no CSP or CM config that names a mesh (grep of src/app for `MESHES=`/`MATERIALS=` and per-piece names).

So none was found. A keeper hand-writing a CSP config per mesh would be the case; none exists.

**Restated by geometry, marked CHANGED D260, nothing loosened.** In both tests:
- The name-for-name check is kept, against the SAME export written unmerged (`buildExport(doc, { mergeMeshes: false })`). For aclook, this is the preview's cells against the export's cells, by name and material, exactly as before.
- Then every triangle of those cells (exact vertex positions, winding, material; a multiset with counts) must be in the kn5 AC loads.

**Teeth.** `dc/run6.log` ran a mutant in a copy (`dc/mut`) where the merge drops its index offset (`+ v` → `+ 0`, so every part lands on the first part's vertices). Both restated tests FAIL on it (2 fail / 32 pass over the two files), and both PASS on the fix (34 pass, 0 fail, 1 todo, the existing paint todo).

**The whole non-mutation suite on 49f3dff's tree.** 149 files (`test/*.test.js` + `app/test/*.test.js` minus `*mutation*`), under the lock, `--test-concurrency=1`, TAP `dc/whole.tap`:

| tests | pass | fail | cancelled | skipped | todo | time |
|---|---|---|---|---|---|---|
| 1,978 | **1,965** | **0** | 0 | 6 | 7 | 1,184 s |

The 7 "not ok" lines are all `# TODO`: the aclook paint todo and 6 read_track round-trip todos. The 6 skips are reads/-dependent tests.

**Correction to myself:** my landing set for D260 left out aclook and doc-e2e, the two files that read the kn5's mesh names. I chose the set by FILE NAME (`export*`) rather than by grepping the tests for what the change alters (mesh names in a read-back kn5). The chair's 67/67 landing set missed them the same way.
