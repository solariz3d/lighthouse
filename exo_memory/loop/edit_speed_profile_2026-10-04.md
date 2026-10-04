# T-180 edit speed: one edit, stage by stage (D235 part 1, pane E, 2026-10-04, D)

**Base:** t180 main `ee3df09`, worktree `C:/Users/nname/Desktop/worktrees/e-speed-wt` (fresh, no junctions). Measured in node 24.14.1 with the app's own modules, in the order the app runs them.
**Every figure below comes from ONE command per track,** each run alone under the heavy-run lock (A held it in turns):
```
node --max-old-space-size=4096 -e "require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({cmd:'D235 speedprobe <track> (E)'}); process.argv=['node','speedprobe.js','<tree>','<track>','<track>.json']; require('./speedprobe.js')"
```
- The instrument is `speedprobe.js` (scratchpad `…\scratchpad\speed\`, sha256 `ea395d6d…`).
- `<track>` is `short` | `oval` | `tube` | `tubeopen`, and the raw rows are in `<track>.json`.
- The figures are **ms, the median of 5 edits after 1 warm-up**; the per-edit maxima are in the json.

**The tracks:**
- **short:** fixture F3, a bowl 12 m wide with 3 pieces, OPEN.
- **oval:** the keeper's saved T-180 OVAL. 6 pieces, 6 km, closed, cups 47 m wide.
- **tube:** the keeper's T-180 TUBE OVAL. 6 pieces, 6 km, closed, tube 40 m wide.
- **tubeopen:** the TUBE OVAL with its last piece removed, left open (about 4.9 km), so its EXTEND can be measured on a long tube.
- The keeper's docs were COPIED from `%APPDATA%\com.solariz3d.t180-track-builder\tracks` and only read. Nothing in the AC folder was touched.

**THE EDIT:**
- On an OPEN track: the keystrokes that GHOST an Extend (100 m, a turn), then the Extend itself.
- On a CLOSED track, Extend is impossible: no open end, and no ghost. The edit is ONE BRUSH DRAG STEP (the rate brush on bank, `shell.brushTo`), which is how a closed loop is changed. A drag sends one of these per pointer move.

## The table (ms per stage, median of 5)

| stage (what runs) | short | oval | tube | tubeopen |
|---|---|---|---|---|
| **per keystroke** — readout (`candidateReadout`) | 0.38 | — | — | 1.58 |
| **per keystroke** — ghost build (`shell.candidate`: extend + toSegments of the WHOLE doc) | 5.10 | — | — | 98.19 |
| **per keystroke** — ghost mesh (`trackmodel.ghostFor`: extendPath + extendMesh on copies + batchesOf) | 5.50 | — | — | 108.75 |
| **per keystroke, total** | **11.0** | — | — | **208.5** |
| resolve (the edit + `toSegments`, the shell's commit) | 4.85 | 148.22 | 202.40 | 96.09 |
| path (`buildPath` / `extendPath`) | 0.23 | 11.09 | 14.14 | 0.31 |
| **mesh** (`buildMesh` / `extendMesh` / `sculptMesh`) | 3.71 | **368.18** | **1,921.12** | 37.43 |
| batches (`batchesOf` + `worldBounds`: every batch, every update) | 1.09 | 8.97 | 87.16 | 72.39 |
| texture set (`textures.refresh`, only when the piece ids change) | 0.13 | 0.12 | 0.09 | 0.34 |
| **texture flow** (`flowCell` for every NEW uvs array) | 3.35 | 49.54 | 116.90 | 27.07 |
| look (`resolveLook`, when the scene's materials change) | 0.06 | 3.92 | 26.42 | 0.08 |
| **validation** (`live.update`: incremental after an extend, FULL on a closed loop, lap off while dragging) | 2.93 | 94.66 | 296.14 | 174.57 |
| labels (`pieceReadouts`, every piece) | 0.80 | 6.33 | 5.26 | 9.64 |
| **per edit, node total (water off)** | **17.2** | **691.0** | **2,669.6** | **417.9** |
| water, if on (`shell.pour`, 1,500 m, 7 streams) | 26.52 | 204.28 | 3.79 (refused) | 130.73 |

- **How each edit updated the preview** (trackmodel): short and tubeopen `extend` ×5; oval and tube `full` ×5. **A closed loop is always rebuilt in full** (`trackmodel.js`: `isClosed → full`).
- **Texture cells re-flowed per edit:** EVERY cell, every time — short 310/310…510/510, oval 3001/3001, tube 3001/3001, tubeopen 2600/2600…2800/2800.
  - On an open track the reason is that an Extend adds a piece id, the texture set is rebuilt (`app/core/textures.js:104`), and the preview's flow memo resets on a new set (`preview.js` batchesFor).
  - On a closed loop every uvs array is new (the full rebuild).
- **Validation was FULL on every closed-loop edit** (5/5); on the open ones it was incremental (0/5 full). The tubeopen figure (175 ms) is incremental and still the largest after the ghost.
- **Water on the closed tube is refused by name:** `WATER_HEARTLINE … a heartline offset (the roll axis of a closed tube, the spiral) is not supported by the water`. So its 3.79 ms is the refusal.
- **The first tube run** gave the same picture: per edit 2,720.2, mesh 1,967.31 (`tube.json` was then re-run for the water message; the table is the re-run).
- **Opening a track** (the first build, not an edit): short 91 ms, oval 916, tube 2,502, tubeopen 1,976.

## What the WebView must also do per edit (from `payload.js`, sha256 `f649ce0d…`, output `payload.txt`)

| | short | oval | tube |
|---|---|---|---|
| draw batches (one draw call each, every frame) | 210 | 3,001 | 3,001 |
| vertices | 15,540 | 774,258 | 2,412,804 |
| triangles | 15,120 | 768,256 | 2,406,802 |
| vertex + index bytes | 0.56 MB | 28.02 MB | **87.40 MB** |

- On a closed loop every one of these arrays is NEW after every edit, so the renderer re-uploads all of it: **about 87 MB per brush step on the tube oval.** The texture flow's new uvs arrays come on top.

## Stages ONLY a real WebView can time (named, not measured)

- **The GPU upload** of the new arrays (`app/preview/renderer.js`, a buffer per array).
- **The draw:** 3,001 draw calls per frame on the ovals.
- **resolveLook's image decode and texture upload.**
- **The DOM work:** the labels layer's layout every animation frame (`app/core/labels.js`), the readout box, and the validation list.
- **Garbage collection** of the replaced arrays (about 87 MB per tube edit).
- **The event dispatch between the panels.**
- **How many of these run per pointer move, and whether frames queue:** nothing coalesces them. The only debounce is the water's 120 ms (`panel.js:213`).
- inferred, not measured: the 1.5-core burn the chair saw at 05:06–05:10 with a big tube open is this draw (3,001 calls a frame) plus repeated uploads, not the node-side stages.

## What the numbers say (for part 2; the fix is A's, chosen by the numbers)

1. **A closed tube's brush step is about 2.7 s, and mesh is 72% of it (1,921 ms).** It is a full `buildMesh` on every step, because trackmodel rebuilds a closed loop in full. Then come validation (296, full), resolve (202), texture flow (117) and batches (87).
   - The cup oval is the same shape at about 0.7 s.
   - The tube's mesh is 5.2× the oval's, because the tube's 360° section is sampled at ≤ 1° of ψ: 3.1× the vertices.
2. **On an open long tube, every KEYSTROKE in an Extend field costs about 209 ms** (the ghost):
   - `shell.candidate` re-runs `toSegments` over the whole document (98);
   - `ghostFor` runs `batchesOf` over the whole mesh and then keeps only the new piece (109).
   - A commit costs about 418 ms more.
3. **Work that grows with the track on every edit, even when the edit is local:**
   - toSegments of the whole doc (resolve, ghostBuild);
   - batchesOf of every batch;
   - the texture flow of every cell (set rebuilt on every new id; full rebuild on a closed loop);
   - full validation on a closed loop.
4. **Cheap everywhere:** the readout, labels, texture set, look and path.

## What this does NOT establish

- **No WebView time** (above), so the keeper's felt lag includes stages I could not time. **The node total is a FLOOR on the edit-to-draw time, not the time.**
- **Node vs WebView2's V8:** both are V8, but the versions and flags differ. inferred: comparable.
- **The edit chosen for closed loops is the bank brush;** other brushes (width, height) were not run. A drag step's cost is inferred to be the same shape, because the full rebuild does not depend on the channel.
- **Only these four tracks;** nothing was measured on machine L.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_edit_speed_2026-10-04.md · scratchpad speed/short.json, oval.json, tube.json, tubeopen.json, payload.txt
