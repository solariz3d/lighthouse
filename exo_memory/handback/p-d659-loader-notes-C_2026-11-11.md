# p-d659-loader-notes-C — the model loader's design, for when cgltf has his yes (pane C, on D, 2026-11-11)

**Packet:** the chair's D659 loader notes, sent 19:18:20Z (the librarian's 13:18 ruling). Tier: just do it. Read only.
- Code read: dreamzone-3 main `b0f7e5e`, plus my two branches waiting to land: `d659-render-c` c7e0302, which reserves the texture range and adds the unbounded table, and `d659-body-c` 7fd38ee.
- **No code written, no dependency added.** One fetch: NVIDIA's ray-tracing best practices (cited in §3).

**In short:**
- A **CPU-only loader module** turns a GLB into `dz::Mesh`es plus images plus a skin.
- The **renderer** gains three small entry points: add a texture, upload a scene as now, and set a skinned pose.
- **Static models** need no new GPU pass.
- **Skinned bodies** get a compute pass that writes into a reserved tail of the existing vertex buffer, so `Trace` reads them unchanged. Their bottom-level structures are refit every frame and rebuilt now and then.
- **Model files** go in a **tracked** folder, not `assets/`, which is ignored.

## 1. A static glTF mesh, end to end

**1a. The loader (CPU, no Direct3D).** A new module, say `model/` (`dz::model::Load(path) -> Model`). Its job:
- read the GLB with cgltf (after the yes);
- validate it;
- emit renderer-neutral data:
  - one `dz::Mesh` per glTF primitive (each has one material), with positions, normals, indices and, appended to `Mesh` (`core/scene.h` only grows), **`uv0`** and, for skins, **`joints`** (4 × u16) and **`weights`** (4 × float);
  - the materials (base colour factor, emissive, the base-colour image's index);
  - the images, decoded to RGBA8, with a mip chain made on the CPU (box filter);
  - the skin (joint hierarchy, inverse bind matrices) when there is one.
- **It refuses the whole file on any fault**, as `UploadScene` already does (`renderer.cpp:1694-1717`): a truncated buffer, an index past its positions, a NaN, a missing image, more than 4 influences. The error names the primitive.

**1b. Textures into the reserved range.**
- `d659-render-c` reserves descriptors 256 to 1,279 (`kTextureBase`, `kMaxTextures` 1,024), filled with null SRVs that `CreateTargets` never remakes.
- The renderer adds `uint32_t AddTexture(const Image&)`. It:
  - creates a default-heap `Texture2D` with mips;
  - copies the pixels in through an upload buffer, each subresource's footprint from `GetCopyableFootprints`, the way `Readback` reads one back (`renderer.cpp:2122`), on the existing `BeginWork` / `RunWork` path (`:570-575`);
  - writes an SRV at `kTextureBase + slot`, taking the slot from a free list.
- Albedo is created `R8G8B8A8_UNORM_SRGB`, so sampling returns linear colour. Normal maps, later, are `UNORM`.
- `RemoveTexture(slot)` puts a null SRV back, once the frames in flight are done.
- The loader's material gets `Material::texture = slot` (`d659-render-c`, carried in `matAlbedo.w`). From then on the surface patterns leave that material alone, as the green row in `dz-view --selftest` already shows.

**1c. The vertex.**
- `GpuVertex` grows from 24 to 32 bytes (`renderer.cpp:127`): pos, normal, uv.
- The bottom-level build already takes its stride from `sizeof(GpuVertex)` with the position first (`:788-797`), so no build code changes.
- Streamed chunks never read `Verts` (they use `Prims`), so the world's cost does not move.
- `GpuGeom::pad` (`:128`) becomes a flags word: bit 0 means "has UVs".

**1d. The shader.**
- `Trace` interpolates `uv` with the barycentrics it already has (`dz.hlsl:228`). Where the material has a texture:
  `albedo *= Textures[NonUniformResourceIndex(tex)].SampleLevel(sWrap, uv, mip)`.
- A second static sampler is needed: wrap, linear. The one there clamps (`renderer.cpp:637-639`).
- **The mip, by ray cone:**
  - a primary ray's spread per pixel is 2·tanFovY / `F.size.y`; since D656, `F.size` is the trace's size, so the mip follows what the trace and the TAA resolve;
  - the footprint at the hit is spread × t / |dot(dir, N)|;
  - texels per metre come from the triangle's UV area against its world area, both made from the three vertices already read;
  - mip = log2(footprint × texels per metre), clamped.
- **Bounce hits** take a coarse mip, the cone's width plus 3, which is a few texels of a 2k map. Inferred: cheap enough, and no texture read is wasted on detail the bounce blurs.

**1e. Instances.**
- One glTF node with N primitives becomes N `Mesh`es and N instances, moved together by `SetInstanceTransform`. D651's per-instance motion vectors already cover them.
- Merging the primitives into one structure with several geometries is possible later: a hit already finds its record at `InstanceID + GeometryIndex` (`dz.hlsl`, `Trace`). Do it if the per-frame top-level rebuild grows with instance count.

## 2. A skinned mesh beside the ray tracing

**2a. Where the skinned vertices live: a reserved tail of the shared vertex buffer.**
- `UploadScene` builds one default-heap vertex buffer for every mesh (`renderer.cpp:1721-1748`). It is read by every hit through one root SRV.
- If that buffer is made with `ALLOW_UNORDERED_ACCESS`, and `UploadScene` reserves an output range after the static vertices for each skinned mesh:
  - the skinning pass writes there;
  - the mesh's `Geom` record and its bottom-level geometry point there;
  - **`Trace` reads skinned vertices with no change**, normals and UVs included.
- Last frame's skinned positions (for motion, §2d) go in a second range, written by the same pass before it overwrites the current one, or by ping-pong of two ranges.

**2b. The pass, each frame, per skinned instance:**
1. The game supplies a bone palette:
   - for **the kid**, from the 21 joints of `Body::pose`, through E's `joint_map.json` (bone rotations from the joint chain), so the body stays procedural and the camera untouched;
   - for **chasers**, from their clips.
2. A compute pass: for each vertex, rest position, normal, 4 joints and 4 weights, through the palette, into the output range.
3. A UAV barrier on the vertex buffer.
4. The bottom-level **update** (`PERFORM_UPDATE`, source = destination, in place).
5. A UAV barrier on the structure.
6. The top-level rebuild, which already runs every frame when anything moved (`BuildTlas`, `:881`).
7. Then the trace, as now.

**2c. Refit or rebuild** (NVIDIA, "Best Practices for Using NVIDIA RTX Ray Tracing (Updated)", fetched 2026-11-11):
- **Refit every frame.** "BLAS updates are a good choice after limited deformations, as they are significantly cheaper than rebuilds."
  - A run cycle is a limited deformation that comes back to itself, so refits stay good for a while.
- **Rebuild now and then.** "large deformations after the previous rebuild can lead to non-optimal ray-trace performance", and "Simply periodically rebuilding all BLASes can be a reasonable approach".
  - Proposed: one skinned body's structure rebuilt a frame, round-robin, so no frame pays for two. The article warns that rebuilds should be spread across frames.
- **The build flags:** a skinned mesh's structure is built with `ALLOW_UPDATE` and `PREFER_FAST_TRACE`, separate from `BuildBlasBatch`'s static path (`:781-782`, which compacts). The article: "For dynamic BLASes, choose between using the PREFER_FAST_TRACE or PREFER_FAST_BUILD flags, or neither", and "I recommend trying different options". So the proof times both.

**2d. Motion on a deforming mesh.**
- D651's `GpuMotion` (`renderer.cpp:131`, `moved` 0, 1 or 2) gains state 3, "deforming", plus the offset of the mesh's last-frame positions.
- `WasAt` (`dz.hlsl:371`) then interpolates those positions at the hit's barycentrics, which needs the primitive index and barycentrics carried in `Surface`.
- Without this the limbs ghost, as the arm did before D651.

**2e. The cost against 2.78 ms.**
- **Where we start:** D656's clean session, 2560x1440 with 9 chasers at render scale 0.75: GPU 1.14 ms average, p99 1.49, worst 1.81-1.97 (`handback/p-d656-look-C_2026-11-11.md`). About **0.8 ms of room** at the worst frame.
- **inferred, not measured:**
  - skinning about 20k vertices is a few hundredths of a millisecond;
  - a 20k-triangle refit is a few hundredths more;
  - a rebuild is several times a refit, which is why only one a frame;
  - the per-vertex motion is a few loads on hits on skinned things only.
- **Cap the skinned bodies,** as E proposed: the kid and the two nearest chasers skinned, the rest rigid segments.
- **The proof times** 1, 3 and 8 skinned bodies, refit only and with the round-robin rebuild, each with both build flags, in the worst building view, under a quiet timing session (both lock slots empty, watched).

## 3. A tracked home for the model files

- **The problem:** `.gitignore` ignores `assets/` (`.gitignore:12`), since the first commit (`d11ce9a`). It is also where the ambience file (`ambience1.wav`) sits on this machine, put there by the librarian and ignored by that same rule. So a GLB in `assets/` would never be committed, and a fresh clone would have no kid.
- **Proposed home:** `content/models/<name>.glb`, **tracked**:
  - textures embedded in the GLB, so one file is one asset;
  - one row in `CREDITS.md` per asset, E's template (`handback/p-d659-models-E_2026-11-11.md` §3);
  - E's Blender scripts under `art/tools/`, tracked, so every GLB can be made again.
- **Size:** a kid at 2k maps is inferred at 10-30 MB, and every refit is another copy in git's history.
  - Plain git is fine for a few files refitted now and then.
  - **Git LFS** is the answer if they multiply, but it is a new tool for the repository, so it is his call: asked, not taken.
  - A size check on `content/` in the tests, say 40 MB a file, would make the growth visible.
- **Finding it at run time:**
  - The game finds `game/config` by walking up from the exe (`game/world/main.cpp` `find_config_dir`); `content/` is found the same way, beside it.
  - The release (`release.cjs` for t180; here the build's `bin/`) must carry `content/`.
  - D651's bed lesson stands: a relative path is made absolute before its parent is taken (`game/world/sound.cpp` `find_bed`).

## 4. The order when the yes comes (each a landing, prove it)

1. **Step 1** (materials to 256, models in 128-255, D656's fixtures moved), **when the school lands.** That is my next packet.
2. **The loader alone** (`model/`, cgltf), with no renderer change:
   - rows: a CC0 Poly Haven model loads to the expected counts;
   - every malformed case (truncated, out of range, NaN, missing image, 5 influences) is refused, naming the primitive.
3. **Static models with textures:**
   - the 32-byte vertex, `AddTexture` into the reserved range, the wrap sampler, ray-cone mips;
   - rows: a textured quad reads its texture's colour at a known pixel; a far quad picks a coarser mip than a near one;
   - frame cost with and without the model in view.
4. **Skinned:**
   - the reserved tail, the skinning pass, refit and round-robin rebuild, per-vertex motion;
   - rows: refit and rebuild trace the same hits on a posed test mesh; the motion row (a skinned limb keeps its own light, as D651's arm row);
   - frame cost for 1, 3 and 8 bodies.
5. **The head's group in the game** (`game/`): the kid's head in 0x04 alone, `primaryMask = 0xFF & ~0x04`, the hand lights leaving out 0x04 (`d659-render-c` made the renderer side).

## NOT verified
- **No cost here is measured;** each is an estimate to be timed by the proof.
- That `NonUniformResourceIndex` over an unbounded SM 6.5 table samples correctly on this driver is inferred from D3D12's rules. `d659-render-c` binds the table but reads nothing from it.
- The 10-30 MB size of a kid GLB is a guess from 2k maps; A's first export will say.

SOURCES: dreamzone-3 b0f7e5e: render/src/renderer.cpp (:127-131, :570-575, :637-639, :776-800, :881, :1694-1748, :2122), render/shaders/dz.hlsl (Trace, WasAt), core/scene.h, .gitignore; branches d659-render-c c7e0302 and d659-body-c 7fd38ee; handback/p-d659-models-E_2026-11-11.md; developer.nvidia.com "Best Practices for Using NVIDIA RTX Ray Tracing (Updated)"
