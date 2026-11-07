# p-d610: a lighter underside (C), 2026-11-02

The packet: chair 13:03Z (D610, the user at 07:01: "does the new apron and undertrack make more geometry to lag assetto?"), plus the added condition at 13:05Z (the user at 07:05: "if people make cool underneath textures, the simplification must not mess with the image beyond the curve distortion"), the collision note at 13:22Z (A's weld) and the `sectionUp` note at 14:23Z. Tier: PROVE IT. Seat: C.

Evidence: `p-d610-light-underside-C_2026-11-02_evidence/`. `E` below means that folder.

## What landed on the branch

t180 `d610-c` (worktree `Desktop\worktrees\t180-c610`), off d604-o `f1f3416`, one commit **`97a2fb8`**, NOT pushed.

- **`src/export/lighthull.js`** (new), `withLightHull(scene, mesh, segments)`. A pass after `withApron` that redraws the drawn bottom (`SKIN_`/`UNDERSKIN_` nodes only) of every stretch of plain cells as one mesh.
  - A plain cell is a grid cell with a run under a plank on both sides, or a closed ring. It is not beside a seam, not in the twisted zone, not a wall side and not on the pit lane's side. Anything else is left exactly as `withUnderskin` and `withApron` made it.
  - Every vertex it keeps is a vertex of the full skin, with its own position, normal and uv. Nothing is interpolated. It never chooses an offset direction of its own (see "`sectionUp`" below).
  - Each stretch's first and last rows are whole (the neighbours share them vertex for vertex). Every row's two plank tips are kept and fanned into the strip, so the plank's own outer edge (its actual vertices, not an assumed spacing) has no T-junction.
  - Columns across: the union, over the rows, of what Douglas–Peucker at 1 cm (measured at each point's own u) needs.
  - Rows along: the farthest step, at most 40 m, for which every point between stays within the drift limit. A row where the uv jumps is always kept, with each side's own vertices.
  - **The texel drift check.** For every vertex of the full skin, and the centre of every one of its quads, the light skin's point carrying the same (u, v) must lie within **2 cm** of the full point.
  - Where it fails at a dropped column, that column is kept and the stretch rebuilt. Where it fails between kept columns, the step halves. A stretch that still fails, or has a sliver, or passes 65,536 vertices, is left as it was.
  - Stretches are built in pieces of at most 50 cells (100 m).
- **`src/export/fromwords.js`**: one call after `withApron`. `lightHull: false` keeps the full skin (for before/after only).
- **`test/lighthull.test.js`** (new, 9 rows) and its fixture **`test/fixtures/light-hull-2026-11-02.t180track`**: 27 m wide, straight, banked sweeper, esse, twist, and a climb up through vertical and over. Details in "Tests" below.
- **Amended existing tests by name, each with its reason in a comment:**
  - `test/underskin.test.js` exports with `lightHull: false`. The file tests the skin as `withUnderskin`/`withApron` make it, cell by cell, and its rows 1, 2 and 6 count per-cell columns.
  - `test/tube_cases.test.js` row 3 places "the track's two ends" by the EDGE's own midpoint, not by its triangle's centre. A 40 m light strip at the track's start has its centre 14 m in, so the old rule called the track's own end edges open.
  - `app/test/export-isolated.test.js` and `-page.test.js`: both pins moved (see below).
  - `test/core_cup_fixtures.test.js`: a new seal record, `test/fixtures/manifest.lighthull.json`, with its own row. The D593 and D604 rows leave the skins to it.
- **`CHANGELOG.md`**: one "Changed" entry under Unreleased.
- No lap id or seat word was added in t180. The lap-id matches in the diff all name existing records (D190 to D604, `after_d604`) or piece ids.
- Sweep (`SC/d555/sweep.js` on the whole diff): **term hits 0**.

## Counts (re-derived; the chair's first)

checked: `node count.js` (E/scripts) on the chair's two files → E/count-chair-files.txt.
- 0.4.34 ELYSIUM: road 2,902,738 + pit 4,036 = 2,906,774; underside 675,990; apron 49,288 + APRONSIDE 49,288 = 98,576; total 3,681,960.
- fix4: underside 1,024,736; apron 49,744 + 3,096 = 52,840; total 3,984,610.
- **The chair's figures stand.**

The light hull, each track exported textured the way the page exports it (`createCoreTextures`, the page's own asphalt). checked: `TEX=1 node eval.js <tree> <doc>` (E/scripts/eval.js) → E/final-*.out.txt. Each run builds the export twice, `lightHull: false` and on.

| track | road | underside full | underside light | light / full | light / road |
|---|---|---|---|---|---|
| his ELYSIUM (A's copy of his save, sha256 2ab08386…) | 2,902,738 | 1,026,159 | **487,973** | 48% | 17% |
| his CRAZY TEST (sha256 7347e61c…) | 2,115,774 | 702,728 | **275,096** | 39% | 13% |
| his TEST 10 (sha256 b6f62b8a…) | 725,058 | 484,899 | **193,227** | 40% | 27% |
| LANIAKEA-shaped stand-in (the new fixture) | 91,336 | 122,640 | **40,512** | 33% | 44% |
| the tube fixture | 746,300 | 97,986 | **63,872** | 65% | 9% |

- ELYSIUM's total: **3,979,353 → 3,441,167**, below 0.4.34's 3,681,960.
- **The LANIAKEA-shaped stand-in is a stand-in.** His LANIAKEA save is not on this machine, and the installed kn5 is a pre-hull export. The fixture takes its width (27 m, from his export's `ui_track.json`) and its climb through vertical. Its road is coarser than his (31 triangles per metre against 76 in the installed kn5), so read it by ratio, not count.
- **Untextured exports gain little.** checked: E/final-ely-plain.out.txt → ELYSIUM untextured 1,026,159 → 919,899 (−10%). An untextured road's v starts again every 2 m (`src/geom/mesh.js`: v is piece-local, and the export's pieces are 2 m segments), so no triangle may span two of them and only columns go. The page exports textured.
- **Physics byte-equal.** Every mesh that is not the bottom (name, positions, normals, uvs, indices, material) is byte-equal with and without the light hull, on all six runs (`non-underside meshes … byte-equal: true`).

## The shape and the image

- **Texel drift** (the full skin's vertex against the light skin's point carrying its uv), worst per track:
  - ELYSIUM 2.00 cm, CRAZY 2.01 cm, TEST 10 2.00 cm, stand-in 2.00 cm, tube 1.95 cm, ELYSIUM untextured 1.00 cm.
  - Every vertex was found by its uv (`not found 0`).
  - The bound is 2 cm; CRAZY's 2.01 is that bound read back from the float32 scene.
- **Shape** (nearest distance to the light surface): ≤ 2.01 cm everywhere. Histogram, ELYSIUM: <1 mm 615,401, <1 cm 343,109, <3 cm 92,707, ≥3 cm 0.
- **The cross-section** (O's `cut.js`, his ELYSIUM's flat, bank and cup stations, and TEST 10 p4, p4/p5, p5; E/cuts):
  - The underside's extents are identical full and light at every station.
  - Its clearance to the road moves 1.0 cm at most (cup 1.283 → 1.273 m; bank 1.303 → 1.296 m; flat 1.472 → 1.472 m).
  - Looked at, `ely-*-cut-bank.png`: the same curve from plank tip to plank tip.
- **No texture swim.** Triangles in the long steps along span a straight u/v grid (one column set per stretch), so a texture line inside a triangle is interpolated exactly as on the full mesh.

## Renders (looked at)

A TEST GRID texture (16×16 cells lettered A–P and 0–F, a checker tint, red lines every 4 cells) on the underside, full and light, from the same cameras, rendered with a fixed mip level (`MIPFIX=0` in my copy of the renderer, `render3.js`: the stock one picks the level per triangle, which made bigger triangles blurrier and the diff meaningless). `diffpng.js` gives each pair a ×4 difference image. E/renders.

- **ELYSIUM bank-under, O's camera** (`ely-{full,light,diff}-bank-under.png`): the same by eye. 3.0% of pixels differ by more than 24/255, all edge pixels.
- **Stand-in** (`lan-*`): straight, sweeper (bend and bank), twist, esse and the sweeper's edge, from below and close.
  - The grid lines are straight and continuous, with no zigzag along triangle edges, in each view.
  - The diffs are one-to-three-pixel edge shifts, which is the 2 cm drift seen from 6–8 m.
- **TEST 10 p4, p5 and the p4/p5 joint** (`t10-*`):
  - p4 and p5 differ in 0.33% and 0.02% of pixels; the joint in 6.1%.
  - At the joint, both full and light show the same small step in the red line where p4 meets p5. It predates this lap, and it sits where A found the off-centre section middle.
- Every render here is from the committed code; an earlier scratch set, made before the quad-centre fix in "Corrections", is not used.

## Tests

checked: `node --test test/lighthull.test.js` → 9/9 (E/… final run, below). The rows:
1. Under 40% of the full bottom's triangles textured (40,512 of 122,640) and under 80% untextured (80,014).
2. Every non-bottom mesh byte-equal, textured and untextured, and the materials equal.
3. **THE IMAGE**: every full-bottom vertex, found by its uv, within 2 cm.
4. **THE IMAGE at random points**: 3,000 seeded random points on the light bottom carry the uv the full bottom carries within 3 cm (1.5× the bound: between vertices the two piecewise maps can part slightly more).
5. No light triangle spans a uv jump (untextured: v span ≤ 0.2).
6. No uncovered open edge beyond the full hull's, and no sliver.
7. Every light triangle faces away from the road.
8. **Vertex for vertex**: no boundary edge the full hull does not have.
9. A scene with nothing to lighten comes back as it is.

**Mutants** (`E/scripts/mutrun610.js` on a copy of the worktree, each with the whole light-hull test): **applied 8 / caught 7 / NOT APPLIED 0**. E/mutrun610b.out.txt.
- L1, tips not fanned → row 6 and row 8.
- L2, a jump row not forced kept → **not caught, equivalent.** Its bottom is byte for byte the unmutated one, textured and untextured (`skinsha.js`). The drift check refuses any step over a jump on its own.
- L3, quad centres not sampled → row 4.
- L4, drift bound ×5 (with the test's bar pinned at 2 cm) → rows 3 and 4.
- L5, end rows not whole → row 8.
- L6, the road's node replaced instead of its skin's → row 2 (and every other).
- L7, no winding → row 7.
- L8, a made-up uv on a jump row → row 1. The uv triangles have no area, so the drift check refuses every stretch it reaches and the bottom stays full; the bad uv never reaches the kn5.

**The tube test**: 7/7 untextured and 7/7 with the page's textures (a scratch copy), after the row 3 amendment above.

**The full suite on the change** (before the amendments): checked: `node --test --test-concurrency=4 "test/*.test.js" "app/test/*.test.js"` under the lock → **4,145 tests, 4,105 pass, 18 fail** (E/suite1-summary.txt). The reds:
- **2 timing rows:**
  - `drag-frame` row 8 fails alone on **f1f3416 too** (E/frames-base-vs-d610.txt: base 11/1, d610 11/1). It is not mine.
  - `release-frame` row 1 passes alone in both trees: load.
- **The export byte pins** (`export-isolated` rows 1, 2, 4b, the page test, and the mutation harness's control), moved by design and amended by name:
  - lap 4dd44dff31b0a8f9 → c94879a57ffcaa2a;
  - open 50248bc3a07ddd32 → 19a54a4cc876ef11.
  - Compared with f1f3416 node by node: only the kn5 changed in either export, and only UNDERSKIN chunks in it (one chunk now starts at p4 instead of p5). Every physics node, the paint, planks, lane and outline, and every material record, are byte-equal.
- **The fixture seal** (row 5a/5b/control, the D593 and D604 records): the new `manifest.lighthull.json` record.
  - F1 F2 only, their kn5 only: 15 and 16 nodes kept byte for byte, the 4 skins each changed.
  - kn5 8,438,864 → 7,108,364 bytes (F1) and 10,760,837 → 10,249,137 (F2).
  - No material changed. Pin sha256 `0740c578…`.
- **`underskin.test.js` rows 1, 2 and 6, and its harness's control**: `lightHull: false`.

checked: the amended files plus both harnesses (`underskin_mutation`, `export-isolated-mutation`), `lighthull` and the tube test, under the lock → **84/84** before the rename of the record to `manifest.lighthull.json` (no lap id in t180), and **85/85** after it, on the committed tree (lighthull 9 rows by then).

## The rebase (the 09:07 order) and `sectionUp` (the 08:22 note)

- **To do when A's d609-a is final:** rebase `97a2fb8` onto it. Then re-run the strict counts, the tube test (untextured and textured) and the 2 cm drift against the CORRECTED skin (22f9025: the skin's normal from the centreline's u=0). Regenerate `manifest.lighthull.json` and the two export pins, since both hold the skin's bytes. The decimation needs no change: it is keyed to the skin's own vertices.


My pass chooses no offset direction. It keeps the full skin's own vertices, so the bottom hangs by whatever `withUnderskin` hangs it by: today `sectionUp`'s column-index middle. If A's ruling moves it to the u=0 column, the light hull measures its drift against that skin with no change here. Whichever of us lands second re-runs the strict counts and the tube test.

## Corrections (mine)

- **My first along-merge** checked each column's straight line between kept rows but zipped rows with different column sets. It drifted up to 7.67 cm on the tube fixture, then 8.75 cm on ELYSIUM. Fixed with one column set per stretch.
- **I first dropped merging along altogether** for the texture condition, reading `mesh.js`'s 2 m restart of v as today's mapping. That is true only untextured. A textured floor's v runs on along the path (`src/texture/flow.js`), so merging came back with the uv-jump rule.
- **My first drift check sampled only the full mesh's vertices.** A random point in a twist read 10.27 cm, where a long thin triangle from a stretch's whole end row to its first thin row bows away between vertices. Fixed with the quad-centre samples and the column refinement (mutant L3 shows the row now sees it).
- **A float32 uv tolerance of 1e-6** missed vertices sitting exactly on corners (v ≈ 13 has float32 precision 1e-6). It is 1e-4 now. This was hiding 10,083 found-by-uv vertices on ELYSIUM in one run.
- **Huge stretches** (6,301 cells) were refused at the 65,536-vertex cap and kept nearly every column. Fixed by building in 100 m pieces.
- **The strict watertight row** first rounded vertices to a 1 mm grid and reported 4 false open edges that straddled a rounding boundary. It welds by distance now.
- **Mutants L5 and L8 were first NOT CAUGHT.** L5 needed the new row 8. L8 was caught, but by the count row, not the row I had named; it is reported as that.
- **I put an environment override on the new seal pin** in a draft of the amendment and removed it before running.

SOURCES: the chair's 13:03Z, 13:05Z, 13:22Z and 14:23Z packets; f1f3416's `src/export/underskin.js`, `apron.js`, `fromwords.js`, `src/geom/mesh.js`, `src/texture/set.js`, `flow.js`; O's `views-d604.json`, `cut.js`, `d606record.js`; A's copies of his tracks (G:\Consonance-tools\scratch-A-d609\his); the runs above.
NEXT: the chair names a landing for `97a2fb8` after 0.4.37 lands, with A's D609 weld landing first or second; whichever lands second rebases and re-runs the strict counts and the tube test.

## The rebase onto d609-a 6f0969e (the chair's 10:54 order), 12:30

**Rebased sha: `81b8b25` on d610-c** (was 97a2fb8; the old tip kept as local branch `d610-c-pre-rebase`). Not pushed. The pass stays a pure decimation: it picks no offset and reads the full skin's own vertices, which on 6f0969e are A's corrected skin (centre-line section, even arc into the tip).

checked: `git log --oneline -2 d610-c` → 81b8b25 over 6f0969e; `git status --short` (worktree t180-c610) → clean.

### What the rebase needed
- Conflicts in three files, because A's D609 took AMEND13 first: A's record stays as it is; mine is **AMEND14** (`manifest.lighthull.json`, made against 6f0969e: its "before" is the D609 record's after). The D593, D604 and D609 rows now hand the drawn skins to it (D609 row: "AMENDED (the light hull)"). Scripts: `_evidence/rebase/scripts/rebase-cup.js`, `d610record2.js`.
  - checked: `manifest.lighthull.json` sha256 b5b7a6babf7ba70c…; F1 kn5 8,438,864 → 7,312,564 bytes, underside 67,382 → 44,856 triangles; F2 10,760,837 → 10,468,437 bytes, 67,444 → 61,596; every node but the skins kept byte for byte (F1 15, F2 16), no material changed (d610record2.js stops on anything else).
- Export pins: lap d89c835f5f103a8c → **a5eef6d390282bc0**, open 4e1404430764e540 → **8c49973d829104e6**. Node by node against 6f0969e: only skins moved (lap: UNDERSKIN_p1_chunk_0, _p1_chunk_1, _p3_chunk_2, and _p5_chunk_3 now starts at p4; open: _p1_chunk_0, _p2_chunk_1, _p3_chunk_2); 0 other nodes moved, added or gone; materials the same; file counts the same. checked: `_evidence/rebase/iso-nodes-6f0969e-vs-81b8b25.txt` (isodump.js + isocmp.js).

### A defect of mine the new final-scene check found (fixed, red first)
A's `finalscene.js` (new on 6f0969e) found this on **CRAZY TEST**, on the light bottom only: "36 edge(s) of the underside skin are open by up to a metre or more at 19.65 km (s 19649 m) … in piece p13: a line of sky through the hull". The full bottom has no open edge there.
- Cause, measured: the light bottom ends on the same row as the full one (pieces.js: last piece s 19559..19657, its mesh 0.000 m from its last row). But **its last strip ran ~20 m onto the end row**, because `lighthull.js:113` held a strip off a whole end row to one row only when the piece kept FEWER columns than the whole row. CRAZY's last 200 m keeps all 39 of 39 columns.
  - The check places a triangle by the path sample nearest its centre. The full bottom's last 2 m triangles read s 19657, inside the open route's last 4 m (END_M); the light bottom's long ones read s 19649, outside it. So the same end row read as a gap.
  - The sceneopen3 trace shows it: full `q.s 19657 atEnd true`, light `q.s 19649 atEnd false`.
- Fix: `if (X !== Y) return Infinity;`. A strip off a whole end row is one row long whatever the column count, so every light piece ends on the full skin's own last cell.
- Red first: a new row, **"every light piece ends on a whole cell"** (fixture, unmerged, textured; a cell is a full cell node's v span).
  - Before the fix it was ✖ with `UNDERSKIN_p6_body_0_2 first row, 2.0 cells`, `_p7_body_0_3` and `_p9_body_0`: the fixture's pieces at 1300–1400, 1600–1700 and 1800–1900 m keep 43 of 43 columns. After the fix: ✔.
  - A second new row checks that the export's check finds no open edge on the light bottom it does not find on the full one (fixture and a plain straight route). It was green before the fix too, because neither route shows the bug; it stays as a guard.
  - Mutant **L9** (the old loophole put back) is CAUGHT by the red row.
- After the fix, CRAZY's light scene check reads `refuse 0 warn 2 {"fold":2}`, the same as the full. The two folds (s 1044 and s 3156) are the full skin's, not mine. checked: `_evidence/rebase/all.out.txt`, the "scene check" lines.
- Cost: none on the fixtures, which are untextured: their strips were already one row, and the fix leaves the record and pins unchanged. Textured counts rose a little (CRAZY 268,352 → 279,176 between the two runs).

### A test of A's, amended by name
`test/export_finalscene.test.js` row 5 cuts its hand-made defects from one cell's skin node: "this cell's skin" sunk 0.3 m, "this cell and the one before" pressed. With the light hull that node is a piece of up to 100 m. So the sunk-skin defect showed as a 300 mm open edge at the piece's end instead of a step near the cell (✖, "111 edge(s) … open by up to 300 mm … s 108 m").
- Amended by name: `pitLap(full)` builds the same lap with `lightHull: false`, and row 5 alone cuts its defects from it. Rows 1 and 7 still read the light export clean.
- checked: export_finalscene 10/10 alone; the two finalscene_mutation controls that run row 5 are green in the touched run.
- This changes how the test builds its defects, not what the check must find: every defect kind is still made, and each must still be found where it was made.

### Re-runs on the corrected skin (all on the final tree, one run: `_evidence/rebase/all.out.txt`)
- **Touched and neighbouring files, 14:** lighthull, tube_cases, underskin, core_cup_fixtures, export-isolated, export-isolated-page, export-isolated-mutation, underskin_mutation, export_finalscene, export_apron, apron_mutation, finalscene_mutation, export_acready, acready_mutation → **207 tests, 207 pass, 0 fail** (`touched2-summary.txt`).
  - The run before the fix had 6 reds (`touched1-summary-before-fix.txt`): row 5 and its two mutation controls, plus two rows of the iframe page test with `EXPORT_LOST` ("its process stopped before it started").
  - That run started while O's apron runs held the lock's other slot, and the two page rows passed in the rerun.
  - inferred: the page test's two reds were load, not the change. Its file and the export it pins did not change between the two runs; it passed on the rerun.
- **Tube test: 7/7** (inside the 207); its strict counts: 0.
- **Mutants (lighthull.js): applied 9 / caught 8 / NOT APPLIED 0.** L2 is EQUIVALENT: its bottom is byte for byte the unmutated one, textured and untextured (skinsha c4e56ac4e6ff0ea6 b5737ba2c190e124). `mutrun.out.txt`.
- **Drift and shape against the corrected skin** (textured unless marked):

| track | underside full → light | of road | max shape (cm) | max texel drift (cm) | not found | physics byte-equal | scene check light vs full |
|---|---|---|---|---|---|---|---|
| his ELYSIUM | 1,026,126 → **477,280** | 16% of 2,902,738 | 1.99 | 2.00 | 0 | yes (157 meshes) | 0 = 0 |
| his ELYSIUM untextured | 1,026,126 → 967,318 | | 0.94 | 1.00 | 0 | yes | 0 = 0 |
| his CRAZY TEST | 702,710 → **279,176** | 13% of 2,115,774 | 2.01 | 2.01 | 0 | yes (125) | fold 2 = fold 2 |
| his TEST 10 | 484,370 → **202,946** | 28% of 725,058 | 2.00 | 2.00 | 0 | yes (62) | 0 = 0 |
| LANIAKEA-shaped stand-in | 122,640 → 40,758 | | 1.99 | 2.00 | 0 | yes | 0 = 0 |
| tube cases | 97,986 → 65,112 | | 1.94 | 1.95 | 0 | yes | 0 = 0 |

ELYSIUM's total goes 3,979,320 → 3,430,474. The first batch ran ELYSIUM with a 4 GB heap and it ran out of memory, since the export now also runs the final-scene check; at 8 GB it passed (`batch-first-ely-oom.out.txt`). The 2.01 on CRAZY is float32 read-back, as before.

### TEST 10 p4/p5: the red-line step is gone
- `renders/f1f3416-t10-full-t10-p4p5-close.png`, the full bottom on f1f3416: the red grid line along the bottom steps at the p4/p5 joint and the outline kinks there.
- `renders/t10-full-…` and `t10-light-…-p4p5-close.png`, on 6f0969e + 81b8b25: one continuous red line and a smooth outline, full and light alike. Looked at.
- Light against full, pixels differing by more than 24/255: p4p5-close 0.88%, p4p5-under 2.51%, p4 0.02–0.04%, p5 0.00%. That is edge shimmer from the 2 cm drift.
- ELYSIUM bank-under: 3.09% (was 3.03%).

### Sweeps
- The 938 added lines of 6f0969e..81b8b25: term hits 0 (`SC/d555/sweep.js` on the added lines).
- CHANGELOG.md and export-isolated.test.js carry term hits 39 and 3 as whole files: the same counts as their 6f0969e versions, so none was added here.
- Lap-id matches in added lines name existing records only (D190–D609, `after_d609`).
- Commit message unchanged (term hits 0). Evidence folder `rebase/`: 21 text files, term hits 0.

NEXT: chair names the 0.4.38 landing for 81b8b25 when it lands A's d609-a; the landing pane runs the full suite.
