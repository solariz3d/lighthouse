# T-180: exported tracks run slow in AC: the road is cut into thousands of tiny meshes. Librarian, on D, 2026-10-06 18:3x. Lap D260.

The keeper, 18:31: "just testing the test recovered track, for no lights, i can tell the track is harder to run since i should be getting
400-500 frames in a map with no complex lighting, is the track geometry like too complex causing strain? If so it would be ass bc it works so good".

## Measured (read-only, `tools/kn5.cjs` on the exported .kn5 files in the keeper's AC `content\tracks`)
| export | kn5 bytes | meshes | triangles | vertices | avg tris / mesh |
|---|---|---|---|---|---|
| `t180b_test_1_recovered_test` (exported 18:25) | 80,994,426 | **15,271** | 1,457,224 | 1,487,754 | **95** |
| `t180b_t_180_tube_oval` | 136,247,728 | **6,008** | 2,593,082 | 2,605,134 | 432 |
- TEST 1's meshes: `t180b_underskin` 7,633, `t180b_floor_made-…` (the road) 7,630, `t180b_paint` 7, `t180b_road` 1. Names like
  `1ROAD_p1_body_0`, `1ROAD_p1_body_0_2`, `…_3`: the road is split into very small chunks.
- **inferred (the usual cost model for AC/DirectX 11): each mesh is at least one draw call.** ~15k draw calls is far above what a track
  with no scenery should need. Triangles (1.5M) are ordinary for an AC track; the COUNT OF MESHES is the likely cost, not the smoothness.

## The lap (C, free; EXPORT tier)
1. **Find why the export splits so finely** (`src/export` mesh writer and kn5 writer): per-segment chunks, the underskin mirrored per chunk,
   a vertex limit, or a physics chunking choice. State it with the code line.
2. **Merge into large chunks:** road and underskin each into chunks of roughly 300–500 m (or by a vertex budget below kn5's 16-bit index
   limit of 65,535 vertices per mesh, if the writer uses 16-bit indices: check), keeping:
   - **the same triangles and the same vertices** (geometry byte-identical in world space; only the grouping changes);
   - **the physics surface names AC needs** (`1ROAD_…` prefixes for the drivable road; the underskin stays non-physics);
   - the AI line, markers, grid, pits and timing untouched.
3. **Measure before and after** on copies of TEST 1 recovered and the tube oval: meshes, draw-call-relevant counts, triangles (must be equal),
   and a geometry comparison (every triangle present once). Report the expected draw-call reduction.
4. **Fixtures:** the kn5 bytes WILL change. A fixtures manifest (the `manifest.d196/d222/d230.json` pattern) records each fixture's digests
   before and after with the reason, and the triangle-set equality per fixture is the check that nothing moved.
- **AC:** not launched by the seat. The keeper's FPS before and after on TEST 1 recovered is the real test (he has the before number).
- Targeted tests; the librarian runs the export harnesses once at install.

NEXT: chair dispatch D260 to C when this plan is read

## The comparison that makes the case (the keeper, 18:34; measured read-only with tools/kn5.cjs)
- His FPS: **TEST 1 recovered 70–150**; **Hazen Loop (no lighting) 400–500**.
- Hazen Loop's kn5 files: `icetrack.kn5` 156 meshes / 1,359,544 tris; `env.kn5` 158 / 389,745; `support.kn5` 651 / 151,900 →
  **965 meshes, ~1.90M triangles in all.**
- TEST 1 recovered: **15,271 meshes, 1.46M triangles.** Fewer triangles than Hazen, ~16× the meshes. **Target: under ~1,000 meshes.**
