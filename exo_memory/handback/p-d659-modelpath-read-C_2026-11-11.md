# p-d659-modelpath-read-C — the model path, read against the renderer at b0f7e5e (pane C, on D, 2026-11-11)

**Took (b), not (a), because the hospital and the school edit the same files.** The school's numbers and the apartment's
`door_rate` are in `gen/src/biome.cpp` `default_biomes`. The hospital adds its numbers to that same function and a new id to
`gen/src/gen.h` `BiomeId`, which moves `kBiomeCount` and with it every per-biome table. So it would not run beside B's branch;
it would merge into it.

**Packet:** the chair's D658 phase 1, sent 18:48:59Z (the librarian's 12:48 ruling). Read only: dreamzone-3 main `b0f7e5e`
(`Desktop/dreamzone-3`) and E's `handback/p-d659-models-E_2026-11-11.md`.
- Nothing built, nothing run in dreamzone-3, **no dependency added**.
- The only fetches were the two upstream licence files below.

**Why a re-read was worth it:** E read `e656a9c`. Since then `b0f7e5e` carries my D651 work (the body's ray group, per-instance
motion vectors) and my D656 work (render scale, surfaces, halation, the trace's colour ping-pong). Several of E's anchors
moved, and some of what E planned already exists.

## 1. E's claims against b0f7e5e (checked: read)

| E's claim | now | holds? |
|---|---|---|
| `Mesh` has positions, normals, indices, one material; no UVs or weights | `core/scene.h:54-60` | yes |
| `GpuVertex` is 24 bytes, pos and normal | `render/src/renderer.cpp:127`; `GpuGeom` `:128` | yes (moved from :125) |
| a hit's normal is interpolated by barycentrics | `render/shaders/dz.hlsl:228` (`CommittedTriangleBarycentrics`) | yes (moved) |
| one flat albedo and emissive per material, 128 at most | `render/renderer.h:47`, `dz.hlsl:14,42-43` | yes, and see §2.1 |
| moving things: `UploadScene` once, `SetInstanceTransform` per frame | `renderer.h:189,194`; `renderer.cpp:1779` | yes |
| per-instance motion for TAA, rigid only | `GpuMotion` `renderer.cpp:131`; `WasAt` `dz.hlsl:371` | yes: it is D651's, so **rigid segments get correct TAA motion with no new code** |
| ray masks: primary 0xFF, shadow rays use the light's mask | the closest query in `Trace` at `dz.hlsl:207` (0xFF); AO at `:426`; shadows `:116` | yes; the body is already group `0x02` (`game/body_figure.h:41`) |
| every query is FORCE_OPAQUE; no alpha | `dz.hlsl:110-111`, both query types | yes |
| binding sets of 4 SRV and 4 UAV; no texture table | `renderer.cpp:591`, sets at `:717-724` | yes, and see §2.3 |
| streamed chunks are untouched by models | chunks read `Prims`, never `Verts` | yes: widening the vertex costs the streamed world nothing |
| worst building views 2.8-2.9 ms, the risk to 2.78 | **out of date.** D656's clean bench at render scale 0.75 (2560x1440, 9 chasers): GPU 1.14 ms average, p99 1.49, worst 1.81-1.97 (`handback/p-d656-look-C_2026-11-11.md`) | changed: about **0.8 ms of headroom** at the worst frame |

## 2. What the code says that shapes 1a (the static model path)

### 2.1 Material ids are nearly all spoken for
- **Where the materials live:** they are in the frame's constant buffer, 128 of them (`renderer.h:47`, `dz.hlsl:14`). A chunk's
  triangle record carries 8 bits of material (`dz.hlsl`, `rec & 0xFF`), so ids up to 255 already fit there.
- **Who holds them:**
  - kits 0-1 are the apartment and hotel;
  - BIOMES.md §11 (c8d706b) gives kits 2-5 to the school, mall, hospital and facility;
  - kit 0's roles 12-15 and kit 1's roles 12-14 are the figures and the body.
- **A conflict I made:** BIOMES.md §11 says kits 6 and 7 "stay free for the parked pool rooms and chaos". My D656 took the lamp
  role (5) of kits 6 and 7 for the shared corridor and dead fixtures (`gen/src/gen.h` `kFixtureCool`, `kFixtureDead`). A pool
  rooms or chaos kit would collide on role 5.
- **Proposed:**
  - raise `kMaxMaterials` to 256 (the constant buffer grows from 4 to 8 KB, inside 64 KB);
  - give ids 128-255 to models and to things shared across kits;
  - move the two fixtures there.
  - That frees kits 6-7 as BIOMES.md says, and gives models ids without taking a role from any biome. This is a small, separate
    change, and I would do it first.

### 2.2 A texture index needs no new constant
- `matAlbedo` and `matEmissive` are `float4` and only `.rgb` is read (`dz.hlsl:42-43`). So `.w` can carry a texture index per
  material, with no growth.
- D656's `SurfaceAlbedo` (`dz.hlsl:152`) must then skip textured materials (a check on that `.w`). Otherwise the procedural
  carpet and paint would multiply a model's texture.

### 2.3 The texture table needs a range of the heap that is never reset
- **What is there:** the shader-visible heap is 256 descriptors (`renderer.cpp:93`). 17 binding sets of 8 use 136 of them.
  `CreateTargets` sets `heapUsed = 0` and remakes the sets on every resize, and since D656 on every render-scale change
  (`:693`).
- **What it needs:**
  - A texture table must be its own range that is never reset (the top of a larger heap, say).
  - A new root parameter, an unbounded SRV range in its own register space.
  - The root signature is version 1.0 (`:644`) and the shaders are SM 6.5 (`render/CMakeLists.txt:40-45`). Unbounded ranges
    work there; dynamic indexing needs `NonUniformResourceIndex` per hit.

### 2.4 The ray cone already follows the render scale
- A cone's spread per pixel is 2·tanFovY / `F.size.y`.
- Since D656, `F.size` is the **trace's** size, not the screen's. So the mip chosen at 0.75 scale matches the detail the trace
  and the TAA can resolve.
- Bounce hits take a coarse mip, or the material's flat colour, as E says.

### 2.5 One glTF primitive is one `Mesh` today
- `UploadScene` builds one bottom-level structure per `Mesh` (`renderer.cpp:1748-1753`). A hit finds its record at
  `InstanceID + GeometryIndex`, so several geometries in one structure are already supported if their records sit
  together.
- For the proof, one primitive is one `Mesh` and one instance. Merging comes later if instance count shows in the
  top-level rebuild.

## 3. What it says about 1b (skinning) and 1c (the head)

- **Rigid segments (1b first pass): no GPU change.** Motion vectors and the body's ray group are already per instance.
- **Compute skinning plus refit (1b second pass):**
  - **What is there:** bottom-level structures are built `PREFER_FAST_TRACE | ALLOW_COMPACTION` (`renderer.cpp:781-782`)
    from one shared, default-heap vertex buffer uploaded once (`:1748`).
  - **What a skinned body needs:**
    - its own UAV vertex buffer;
    - a structure built with `ALLOW_UPDATE` (compaction can stay);
    - a compute pass before the frame's top-level build;
    - `Trace` reading that buffer for normals and UVs.
  - **Per-vertex motion:**
    - a `GpuMotion` record would gain a "deforming" state (`moved = 3`, beside 0, 1 and 2) and an offset into a buffer of last
      frame's skinned positions;
    - `WasAt` would interpolate those positions at the hit's barycentrics;
    - so `Surface` must carry the primitive index and the barycentrics, which `Trace` has at `:228`.
- **The head group (1c). A trap in the masks:**
  - An instance is hit when (its mask & the ray's mask) is not 0.
  - So the head must be in a group of its own **only** (say `0x04`), not in `0x02` as well. With `0x06` the primary mask
    `~0x04` would still hit it through `0x02`.
  - The hand lights then leave out both: `shadow_mask = 0xFF & ~(0x02 | 0x04)` (`game/world/beam.cpp`).
  - `Trace` serves both the primary ray (`dz.hlsl:406`) and the bounce (`:439`), so it needs a mask argument. Only the primary
    ray drops the head.

## 4. The two licences E left unread (checked: fetched 2026-11-11)
- **cgltf:** upstream `LICENSE` (raw.githubusercontent.com/jkuhlmann/cgltf/master/LICENSE) is the MIT licence, "Copyright (c)
  2018-2021 Johannes Kuhlmann".
- **DirectXTex (texconv):** upstream `LICENSE` (raw.githubusercontent.com/microsoft/DirectXTex/main/LICENSE) is the MIT
  licence, "Copyright (c) Microsoft Corporation".
- **Both still wait for his yes** (the global rules on new dependencies). Nothing was added.

## 5. What can be built before the yes (no dependency)
In order, each small, each its own landing.

| step | what | tier |
|---|---|---|
| 1 | Materials to 256; ids 128-255 for models and shared things; the D656 fixtures moved there (frees kits 6-7, BIOMES.md §11) | prove it: the stored material ids of chunks and the gen tests' one-kit rule move |
| 2 | The texture index in `matAlbedo.w`; `SurfaceAlbedo` skips textured materials; the reserved heap range and the bindless root parameter, empty | check it |
| 3 | Rigid segments from procedural meshes (the chasers' silhouettes as several boxes per bone), driven as the body is now | check it |
| 4 | The head's own ray group and `Trace`'s mask argument | check it, with a test that the primary ray misses the head and a lamp's shadow does not |

With the yes: cgltf, the 32-byte vertex with UVs, a PNG path for the proof (texconv later), ray-cone mips, then compute skinning.

## NOT verified
- **No frame cost** for any of this: nothing was built.
- **The heap and root-signature reading is from the code only;** no build was tried. That unbounded ranges work on this driver is
  inferred from D3D12's rules, not run.
- **E's Blender pipeline** (§2) was not touched. Its probe is still unrun.

BASE: none (no repository changed)
SOURCES: handback/p-d659-models-E_2026-11-11.md; dreamzone-3 b0f7e5e read: render/src/renderer.cpp, render/shaders/dz.hlsl, render/renderer.h, render/CMakeLists.txt, core/scene.h, game/body_figure.h; docs/BIOMES.md at c8d706b (§7, §11, §12); the two upstream LICENSE files
