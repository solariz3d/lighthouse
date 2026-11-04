# p-pittexture-E · D279: the pit lane wears the track's road texture · pane E, on D, 2026-10-09 · DONE, with one question for the keeper

**Commit `9d7e94c`** on t180 main `d1bf901`, branch `d279-pittexture`, my own worktree `C:/Users/nname/Desktop/worktrees/e-pittex-wt`. 4 paths, not pushed.
**No `app/` file touched.**

## READ FIRST: the keeper's tracks have no pit lane
- **The app's equation-core export passes NO pit lane.** `app/core/coreshell.js` `buildExport` calls `exporter.runSegments(...)` with no `pitLane`, and nothing in `app/` mentions one
  (`git grep -n -E "pitLane|PIT_|buildPitLane|laneForExport" -- app`, excluding tests, finds nothing).
- **A pit lane exists only in a WORD document** (`buildExport(doc)` with `doc.pitLane`).
- **On a core track the pits are on the main road:** `startLayout` → `Markers.defaultLayout` places `AC_PIT_n` there, and the only pit visual is the pit-box PAINT, thin
  near-white outlines (`src/markers/paint.js` `MATERIAL`, `t180b_paint`).
- **So this fix changes nothing on any track the program builds today.** If the keeper saw "pits" not wearing the track texture on one of HIS tracks, he may mean the pit-box
  paint (which the plan says to leave), or something else.
- **For the keeper, via the librarian: which track, and what did the pits look like?** That decides whether there is a second fix.

## 1. CONFIRMED in an exported kn5 (before the fix)
Probe: `<scratchpad>/pit/probe1.js` against the untouched worktree, run under the lock (`pit/probe1.txt`). It is `test/export-layouts.test.js`'s stadium with its pit lane,
read back with `tools/kn5.cjs`.
```
solid (no floor texture)  road 6 meshes {t180b_road: 6}                         pit lane 5 {t180b_road: 5}
asphalt (made, every word) road 6 meshes {t180b_floor_made-f971b2c04e6bda35-64: 6}  pit lane 5 {t180b_road: 5}
```
- **The cause** is `src/texture/set.js` `withTextureSet`: it builds its `wear` map from `mesh.cells`, the road's own cells, so the lane's cells were never in it.
  The plan's inference was right.
- **What the probe missed:** `tools/kn5.cjs` lists a material's name and shader but not its samplers, so the DIFFUSE check below reads the export's own scene
  (`b.scene.materials[].samplers`), which is what is written. Its picture case also failed on my hand-made PNG (bad CRC); the rows use the repo's `T.png.encodePng`.

## 2. The fix
- **`src/export/pitlane.js` `withLaneFloor(scene, lane, mainSegments, set)`**, applied in `fromwords.js` right after `withTextureSet`.
  - Every lane cell (`1ROAD_PIT_…`) takes the FLOOR material of the main-road segment the lane LEAVES from (`lane.joins.leave.s`).
  - So it gets the same material and the same diffuse texture under a made texture (asphalt) or the user's picture.
  - Untextured: unchanged, because the lane and the road already share `t180b_road`.
  - A floor material missing from the scene throws `PIT_LANE_FLOOR`, by name.
- **Unchanged:**
  - **the surface key** (`1ROAD_PIT_…`, ROAD/PIT physics), **the lane's mesh count**, and its exclusion from the road merge (`acready.js:176`, untouched);
  - **the pit box paint** (`t180b_paint`, same mesh count);
  - **texture coordinates:** a word document's road cells keep `mesh.js`'s 10 m repeats (`flow.js` re-runs only core cells), and the lane's mesh uses the same rule.
    The SCALE is therefore the same as the road's. The PHASE restarts at the lane's first cell, as the road's own UVs restart at every word.
- **A known edge:** a lane that runs beside two words with DIFFERENT floors wears the floor of the word it leaves from. Untested, because no test track has that.

## 3. The preview
- **It does not draw the pit lane** (the same `git grep` over `app/`), so there is nothing to change.

## Rows (`test/export_pittexture.test.js`, 5)
1. **solid:** the lane and the road both wear `t180b_road` (a guard);
2. **asphalt:** the lane wears the road's floor material and the same diffuse texture, in the scene and in the kn5;
3. **picture:** the same;
4. **paint, the lane's kn5 names and count, and the read-back are unchanged** (a guard);
5. **a word document's UVs are untouched** (a guard).

- **Red first on `d1bf901`:** rows 2 and 3 FAIL ("actual t180b_road, expected t180b_floor_…"); the three guards pass (`pit/red.tap`).
- **Green, under the lock:** the new file plus every test that reads a kn5 (`git grep -l -E 'kn5|readKn5' -- test app/test`, the `.test.js` ones): 39 files.
  **635 tests, 628 pass, 0 fail, 7 todo** (`pit/green.tap` sha256 `e92e6de3…`).
  Fixtures 0 of 9 is included: `core_cup_fixtures` row 5a "0 of 9 differ" passes.
- **CHANGELOG:** a `### Fixed` entry under `[Unreleased]`.

---

# Follow-up (~16:3x): the PAINTED PIT BOXES wear the road · DONE

The keeper's answer (plan "Amendment", lines 23–30): **"The painted pit boxes."**
**Commit `e003c59`** on t180 main `0dc10dc` (which is main now, so no rebase was needed), branch `d279-pitboxes`, worktree `C:/Users/nname/Desktop/worktrees/e-pitbox-wt`.
7 paths, not pushed. **No `app/` file touched.**

## What changed
- **`src/export/pitboxes.js` `withPitBoxFloor`**, applied in `fromwords.js` after the road and the lane take their floors. Each `PAINT_PIT_n` now wears what the road under it wears:
  - **the material:** the floor of the road segment it lies on (asphalt, or the user's picture), or the road's own `t180b_road` when the floor is not textured.
    A box on a word document's pit lane wears the lane's floor.
  - **the texture coordinates:** the road's own at each vertex. On a core road with a textured floor that is `flow.js`'s rule (u / tileWidth, (s + offset) / tileLength,
    swapped for 'across'); everywhere else it is `mesh.js`'s (u / 10, (s − the segment's first s) / 10).
- **`src/markers/paint.js`:** `patch()` also records each vertex's (s, u), and `paintFor` returns them for the pit boxes (`su`). Its meshes are byte-identical,
  which row 4 and the fixture measure both show.
- **Unchanged:**
  - the start line and the grid boxes keep `t180b_paint`, with the same positions and coordinates;
  - the `AC_PIT_n` spawns and the physics (the boxes are visual meshes, not `1ROAD_`);
  - the box geometry, still lifted 2 cm.
- **Named, as the chair asked: ON A SOLID-COLOUR ROAD THE PIT BOXES NO LONGER SHOW.** They wear the road's own flat `t180b_road` and sit 2 cm above it, so they are the
  same colour as the road. That is what "blend into the road" means there. It is said in the CHANGELOG entry too.
- **The preview** does not draw the paint (no `paint` in `app/preview`; aclook's own todo row says so), so it has nothing to change.

## Rows (`test/export_pitboxes.test.js`, 5, on a core lap exported by the app's route: `startLayout` → `buildFromSegments`)
1. **asphalt:** every pit box wears the road's floor material and the same diffuse, in the scene and in the kn5;
2. **picture:** the same;
3. **solid:** every pit box wears `t180b_road` (no longer shows);
4. **start and grid paint, the spawns and the read-back are unchanged** (a guard);
5. **a box's v gives an s within its own 2.4 m of road.**

- **Red first on `0dc10dc`:** rows 1, 2, 3 and 5 FAIL (they read `t180b_paint` and 0–1 patch coordinates); row 4, the guard, passes (`pitbox/red.tap`).

## Fixtures: F1 F2's kn5 changes BY DESIGN, recorded by D260's pattern
- **The first full run had 3 reds, all in `core_cup_fixtures`:** row 5a "2 of 9 differ" (F1 and F2, the two CLOSED laps, "DIFFERS in kn5"), and rows 5b and 5-CONTROL with it.
  The closed fixtures export with pit boxes, so this is the change itself, not a regression. I proved that before recording anything:
- **Measured node by node** (scratch `pitbox/fxmeasure.js`, the same render as `fixtures.js` `digests()`; `0dc10dc` git archive vs the branch):
  in EACH of F1 and F2, **2 of 1,505 nodes differ, the two `PAINT_PIT_n`, in `material t180b_paint -> t180b_road` and `uvs` only.**
  Every other node is byte for byte the same. The base's kn5 equals D260's recorded "after" exactly, and kn5 byte length is unchanged (7,112,528; 9,434,428).
- **Recorded as `test/fixtures/manifest.d279.json`** (sha256 `544395e3…`), built from that measure by a script that refuses unless the base equals the D260 record. Then amended in
  `core_cup_fixtures.test.js` the way D260 was:
  - `AMEND6`, applied in `amendedManifest()`;
  - its sha256, keys and `unchanged` pinned in row 5;
  - a "D279 amendment record" row: before = D260's after, only the kn5 moved, and the measure is exactly the pit boxes, in material and coordinates.
  - **This changes a test because the requirement changed;** the record carries the measured proof. Row 5a reads **"0 of 9 differ"** again.

## Tests (under the lock)
- **The full set:** the new file, the pit-lane file, every `git grep -l -E 'kn5|readKn5'` `.test.js`, every test reading `paintFor` / `placeAll`, and the chair's named
  `markers_export`, `export-textures`, `aclook`, `doc-e2e` and `core_cup_fixtures`: **43 files, 656 tests, 649 pass, 0 fail, 7 todo** (`pitbox/all2.tap` sha256 `bf6de71c…`).
- **The one aclook line in the "failing" list is a `todo` row** (the preview doesn't draw paint), not a failure.
- **CHANGELOG:** under `[Unreleased]` `### Fixed`, beside A's D278 and my pit-lane entry, for 0.3.4.

---

# Correction + infill (~17:0x): PART 1, READ BEFORE ANY 0.3.4 BUILD

## The correction, and mine first
- **My "core tracks have no pit lane" was wrong.** I read it off a `git grep` over `app/` and never read an export. The keeper's `t180b_track_2_test.kn5` has a lane.
- **Re-checked against exports this time.** Each claim below is from an export of a COPY of TRACK 2 (`eq-TRACK 2.t180track`, copied to scratch; the keeper's file untouched).

## !! STOP-CHECK FOR THE CHAIR: main cannot build the keeper's pit lane. The installed app has code that is in NO t180 tree on this machine
- **TRACK 2's file carries `"spawns"` and `"pitLane"` keys in a CORE document:**
  - `pitLane`: `{"side":"L","leave":{"word":"p1","along":100},"rejoin":{"word":"p1","along":900},"offsetM":12,"width":8,…,"boxes":12,"boxSpacingM":10}`;
  - `spawns`: `{"line":{"along":858},"grid":{"count":24,…}}`.
- **Main `0dc10dc`'s core parser keeps neither:** `D.parse` returns schema, generator, name, closed, start, nextId and pieces only. So an export of it on main plus my branch
  has **0 pit-lane meshes** (`pitbox/track2-export.txt`).
- **Neither string is in any code on this machine:**
  - `git grep -l spawns main` finds only docs and the CHANGELOG;
  - `git log --all -S'"spawns"'` finds nothing;
  - no worktree under `Desktop/worktrees`, the main checkout (246 uncommitted changes, an older state, not this), or `lib-build-wt` has it;
  - origin = local main = `0dc10dc`.
- **The installed app was built from that unknown source.** `%LOCALAPPDATA%\T-180 Track Builder` keeps `t180-track-builder.exe.before-spawns` (2026-10-08 15:30) and
  `.before-pitlane` (2026-10-09 11:30); the current exe is from 14:02.
  - The only session transcripts that name those backups are this one (my search) and the Third Place's (`C--Consonance-instances-third-place`).
  - **I did not open the Third Place's conversation**, and its scratch folder holds no JS with `spawns`.
- **CONSEQUENCE: a 0.3.4 built from main would REMOVE the keeper's pit lane and spawns from his app**, and would open his TRACK 2 without them. A TRACK 2 saved by a
  main build would DROP those keys from the file. **Please find that source and land it in main before any build.** It is the chair's or the keeper's to find; I will not
  go into the Third Place.

## (1) What main + 9d7e94c does with a core pit lane: it wears the road texture
- **Given TRACK 2's own `pitLane` through `meta.pitLane`** (the only way `buildFromSegments` takes a lane, and what the installed build must do, since the mesh names match
  `buildPitLane` exactly), the export makes **the same 7 lane meshes as the keeper's kn5** (`1ROAD_PIT_in_0`, `body_0..4`, `out_0`). **All 7 wear
  `t180b_floor_made-f971b2c04e6bda35-1024`, the road's floor** (`pitbox/track2-lane.txt`).
- **Why the keeper's export showed `t180b_road`:** his installed build (14:02) predates `9d7e94c` / `0dc10dc` (~15:10). Once his source lands on main, its lane gets the floor
  through `withLaneFloor`, IF it reaches the export as `meta.pitLane` (the names say it does).
- **Where the installed build's 12 lane boxes come from:** on main, the start layout puts the 2 default pit boxes on the MAIN road, wearing the floor (e003c59). The keeper's
  build puts 12 on the lane (`AC_PIT_n` at x = 31.2), so it must also set the layout's `pits.lane`. That is part of the same missing code. With a lane, `withPitBoxFloor`
  dresses lane boxes in the lane's floor.

## (2) Infill and (3) pit boxes: next
- **(3)** is committed (`e003c59`, the Follow-up above) and holds on the TRACK 2 copy: `PAINT_PIT_0/1` wear the floor.
- **(2) the infill** is next, export-side and on a core export given its lane through `meta.pitLane`, so it does not wait on the missing source. Its section follows when it is
  committed.

## Correction + infill, PART 2 (~18:1x): the infill, and all three on land-pit-base · DONE
**Branch `d279-pitboxes`, rebased onto `land-pit-base` `22c46a0`** (the Third Place's core pit lane, which the chair found and cherry-picked). Not pushed:
- `7594666`: the pit-box paint; it was `e003c59`, and its content is unchanged;
- **`1b05236`: the infill.**

The rebase was clean, with only the CHANGELOG auto-merged: `land-pit-base` touches none of `src/export/*`, `src/markers/paint.js` or my tests. The part-1 alarm above is
answered: the source exists, and it is that branch.

### (1)–(3), re-checked through the REAL shell on land-pit-base, on a COPY of TRACK 2
`<scratchpad>/pitbox/track2shell.js`: the copy is opened in `createCoreShell` (a fake storage hands it the text) and exported by the shell's own `buildExport` (the TEST export,
since the track is open) with the asphalt set; the kn5 is read back (`pitbox/track2-shell.txt`).
- **This tree's parse now keeps `spawns` and `pitLane`.**
- **(1) texture:** the kn5's 8 pit meshes (`in_0`, `body_0..4`, `out_0` and the new `fill_0`) all wear `t180b_floor_made-f971b2c04e6bda35-1024`, the road's floor.
- **(2) infill:** **0 downforce-ray gaps across the lane's span** (s 100–900). The test reds are exactly the 4 the keeper's own export lists (ray gaps at s 1274, 6802 and 6828, and
  leaves-surface at 5830–6284), all outside the lane.
- **(3) pit boxes:** **12, all on the lane, all wearing the floor.**

### The infill, and what it took (`src/export/pitlane.js`)
- **The surface:** ONE drivable surface, `1ROAD_PIT_fill_0`, from the road's edge to the lane's inner edge over the whole span: the entry arc, the body and the exit arc.
  Because it is a `1ROAD_PIT_…` mesh, it is drivable, wears the lane's floor (`withLaneFloor`) and stays out of the road merge.
- **First attempt, wrong:** I built its edges from formulas and the downforce ray still found gaps along all of it. A diagnostic (`pitbox/diag*.txt`) showed why:
  - **the road mesh's edge vertices sit 2–9 cm off `buildPitLane`'s analytic edge** (offsets and profile blend);
  - **the lane mesh keeps 294 rows for its 321 stations**;
  - so the strip welded to neither: 226 of 482 vertices were over 5 mm from any road or lane vertex, and the worst was 2.0 m.
- **The fix: its two edges are the meshes' OWN boundary polylines**, the road mesh's boundary edges on the lane side and the lane mesh's inner boundary, **zipped** in order
  along the road. **Measured: 256 of 256 infill vertices ARE road or lane vertices (163 road, 93 lane), worst 0.0000 m; 0 gaps.**
- **New check, `spanGaps`:** the export now runs the car's downforce ray over road + lane + infill across the lane's span, and a gap there is RED. The old check looked at the road
  alone (`fromwords.js` `roadMesh`), so **the gap between road and lane was never checked**.
  - **It found a real one before the infill:** 0.1–1 m at the entry arc, s 42–50, on the test lap. A track with that gap now refuses to export, by name.
- **Texture coordinates:** u = metres across from the road's edge u, v = the road's own s / 10, which is the road's own rule at the default 10 m tile (flow.js and mesh.js both).
- **Rows (`test/export_pitinfill.test.js`, 4, on a core lap given its lane via `meta.pitLane`, the route the shell uses):**
  1. the infill is there, drivable, in the lane's floor, in the scene and the kn5;
  2. **NO GAP** under the downforce ray in the span;
  3. solid colour gives `t180b_road`;
  4. the self-check is on and a full export passes.
  - **Red first:** rows 1–3 fail without the infill. Row 2 lists the entry-arc gaps (s 42.0 u 15.2 width 0.1 … s 50.0 u 15.8 width 1).
- **My test bug, fixed before the commit:** my rows first read the material from `walkScene`'s world-space records, which carry none, so the read gave `undefined`. They now read the
  scene's own nodes, as the pit-texture rows do.

### Tests (under the lock, on the REBASED branch)
- **The set:** the earlier 43 files, plus the infill rows, `geom-pitlane`, `doc-pitlane`, `geom_pitlane_tilt`, and `land-pit-base`'s own `app/test/core-pitlane`, `core-spawns-ui`,
  `core-spawns`, `core-readout-display`, `test/core_pitflat`, `core_pitlane` and `core_spawns`.
- **Result: 730 tests, 723 pass, 0 fail, 7 todo** (`pitbox/rebased-all.tap` sha256 `6c6c9989…`). Fixtures still read "0 of 9 differ".
- **CHANGELOG:** a `### Fixed` entry for the infill under `[Unreleased]`, beside the pit-box and pit-lane entries.

### Not done, named
- **An AC look:** the keeper's, on the next build.
- **Two words on one lane:** a lane beside two words with different floors still wears the floor it leaves from. Untested, because no test track has that.
