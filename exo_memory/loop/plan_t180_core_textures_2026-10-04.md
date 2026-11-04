# T-180: a real road texture on the equation-core tracks (the tube included). Librarian, on D, 2026-10-04 01:5x. Lap D228.

The keeper, 01:48: "the tube works so good its insane, but I wonder, is it possible we could have like a stock track texture".

## Checked (worktree `lib-tube-build`, 09f3fcc; main is now b8dcd1b, export code unchanged since)
- **The equation-core page's Export passes NO texture set:** `app/index.html:193` `await shell.exportTo(dir);`. The words page passes
  one: `app/index.html:287` `await shell.exportTo(dir, { textures: textureSet });`. The core exporter already takes it:
  `app/export/export.js:98` `runSegments(…, { textures = null, … })`. So the keeper's tracks, the tube oval included, export with the
  solid diffuse from the Third Place's "road is lit" work.
- **A texture system already exists,** built for the words model:
  - `app/texture/index.js`, the panel: PNG/JPG import, per-word slots for tiling, fit/tile and offset;
  - `app/texmaker/`, a procedural maker;
  - `src/texmaker/presets.js:7`, an `asphalt` preset (noise plus two grain layers).
- **The promise that binds "stock":** `src/texmaker/presets.js:1-2`, "no other author's texture bytes are read or copied (the README's
  promise)". t180 is PUBLIC. **So Kunos's own AC textures cannot be copied into the repo or bundled.**

## The lap (A, who built the texture set; FEEL + export tier: targeted tests, one real export, the keeper's eyes)
1. **The core page gets textures.**
   - Mount the textures panel (or the part of it a core track needs) on the equation-core page, with core PIECES in place of words.
   - The Export on that page passes `{ textures: textureSet }` the way `:287` does.
   - The preview draws the same set.
2. **The default road is the `asphalt` preset**, not the solid colour, so a new or old track looks like a road with no clicks. The
   solid colour stays one click away.
3. **A tube maps all the way round:** a closed tube's texture runs the full circumference without a stretched seam, along the
   floor-to-ceiling direction. A's own cross-section mapping decides how; say in the hand-back where the seam sits.
4. **Bring-your-own stays:** the PNG/JPG import already lets the keeper use any picture he has the right to use. Nothing is bundled from AC.
- **Tests:** the core export with a texture set writes its DDS and material (a test); without one it is byte-identical to today
  (the fixtures, 0 of 9 differ); a closed tube's UVs wrap with no seam stretch (a test on the mesh's UV range).
- **Then:** B's quick look; land; the librarian rebuilds, installs and re-exports T-180 TUBE OVAL with the asphalt default.

## Open, the keeper's call (not blocking this lap)
- **A photo-real asphalt as the default** instead of the procedural one: a CC0 scan (ambientCG or Poly Haven, both CC0, so it can ship in
  a public repo). It would be one bundled image with its licence noted. The librarian's suggestion is to do it after this lap, if the
  procedural asphalt doesn't look "stock" enough in AC.

NEXT: chair dispatch D228 (core textures) to A when this plan is read
