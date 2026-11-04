# D572 Part C: the ELYSIUM APRON test export, installed (pane E, machine D), 2026-10-30

Tier: prove it (export bytes, an install). Headless throughout, every run through the gate at BelowNormal, no window. Nothing pushed, nothing committed in t180. S below is my scratchpad, `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\`.

**Installed:** `G:\SteamLibrary\steamapps\common\assettocorsa\content\tracks\t180b_elysium_apron\`, ui name **"ELYSIUM APRON"**, 10 files. It is a NEW folder. His `t180b_elysium`, `t180b_elysium_gates` and `t180b_elysium_gates_stiff` are untouched.

**One departure from the order, read it first.** The road is **not byte-identical** to GATES STIFF's. What differs is 200 upright fin triangles at three joints, removed by a fix that landed after his export (§3). It is the same road surface everywhere the test drives (§3).

## 1. The tree and the document

- **The scratch worktree:** `C:\Users\nname\Downloads\t180-wt-e572c`, branch `d572c-e`, head **`429bc68`**. That is origin/main `60c7688` + d572-e (merged at its head `9a5362f`, which carries `06a596b`) + d571-c `c456efe`.
- **For the landing, one conflict:** `app/test/export-isolated.test.js` PIN. I resolved it with both comments kept and the pin re-derived on the merged tree: lap `sha256 257d550e6870bdf1 files 10`, open `sha256 2b6ad34e0f135050 files 11` (row 1 passes there). Nothing else conflicted.
- **The document:** `eq-ELYSIUM.2026-10-22_193736.t180track`, the track-backups copy (sha256 `2ab08386d2afb287…`), 25,045.6 m. It is the only one of the three 25,045.6 m candidates that this tree exports and that reproduces his road (§3). The current `eq-ELYSIUM.t180track` is 27,592 m, the longer document, and was not used.

      checked: S/d572c/outE/summary.json docSha 2ab08386d2afb287; ui_track.json length "25046m" in his folder and in this one

- **The export path is the app's own:** `coreshell.buildExport({ textures })`, with the textures panel's set (asphalt made here, edge fit off). Node's `fromwords.exportSegments` on the same arguments writes the same kn5:

      checked: S/d572c/outE/summary.json → app and node2 kn5 both sha256 dd4218e9cdf705b5…, 196,257,975 bytes

## 2. What is in the folder (sha256, from the installed files)

    checked: S/d572c/installed-apron.sha (sha256sum over the installed folder) = S/d572c/stage.sha, diff empty

| file | bytes | sha256 |
|---|---|---|
| `t180b_elysium_apron.kn5` | 196,257,975 | `27321f34aa515bf7a0c0ec4788a240892c312b50a9841f8c654ea422796951a8` |
| `data/surfaces.ini` | 772 | `039e54dad3f8f1c0bc9990187cf70819f0841dae74350e5da928657427ff62fb` |
| `ai/fast_lane.ai` | 384,124 | `4a7f195b2b96be29b1010549370f1788044287493cc1a61a59ecf687401ead56` |
| `data/map.ini` | 113 | `385480350f7372d94b005c2ac6869a1601c9d85c054e6ad3a31e4f6f37e82b17` |
| `map.png` | 20,673,690 | `0d9c739b283845d062fcd2eb4b5ab76e58e226b8539fdfba541c8715e248deef` |
| `models.ini` | 69 | `3d7931aae4eeca76788f12efa5813ee0387594eb00e473c7ec18a6b62d358757` |
| `ui/ui_track.json` | 386 | `8bf56b02c558b5a0327f12f310e53dd94fba71bd91dc68c3da99e41488c039be` |
| `ui/outline.png` | 280,600 | `41f7d0a6e9edf352f25716517344da952d4a7a2ef3f3f776b5ce9595de00f4d1` |
| `ui/preview.png` | 284,288 | `808eb342146389bed7c713c0bbe62fe1f701fbe94653fbcdb907e1a79a513eb0` |
| `.t180b-builder.json` | 421 | `e7f16f8aa2c25a48ed2279cbf3c350008478b51a68db67c93489e05fc46d55bc` |

- **`surfaces.ini` carries the firm value:** `SOFT_CFM=0.00005` at line 26, and the file is **byte-equal to GATES STIFF's**.

      checked: diff t180b_elysium_gates_stiff/data/surfaces.ini against this one → no difference; grep -n SOFT_CFM → 26:SOFT_CFM=0.00005

- **The AI line is byte-equal to his** (`4a7f195b…` in all three of his folders and here). The apron changes no station, as Part A said.
- **`map.ini` is 3–4 px wider** (2032 × 2543 against 2029 × 2539): the map takes in the aprons. The width-0 export's `map.ini` equals his exactly (`1fb8618b…`).
- **`ui_track.json` differs from GATES STIFF's** only in the name and in a third tag, `"t180-track-builder"`, which this builder writes.

## 3. The road against GATES STIFF's

GATES STIFF's road is his racing kn5's road, byte for byte; only two dummy matrices were changed there (D567). So the comparison is against both.

    checked: S/d572c/set-installed.json, set-stiff.json → roadSetSha 9ffe542b238ae9fc… in both, 89 road meshes, 2,899,338 vertices
    checked: S/d572c/set-app.json, set-zero.json → roadSetSha 216c69d0b6bebc07… in both, 89 road meshes, 2,898,580 vertices

**The apron leaves the road alone:** the road set is the same at width 0 and 2.0. **But it is not his road set** (758 vertices fewer), so I measured where it differs:

- **Every vertex position is his.** All 2,898,580 new road vertices lie exactly on one of his (distance 0). Of his 2,899,338, 2,899,161 lie exactly on a new one and 177 within 0.015 mm (one float32 step).

      checked: S/d572c/nearest.json bins exact 2,898,580 of 2,898,580; nearest-rev.json exact 2,899,161, <1mm 177, max 1.5e-5 m

- **Every triangle except 200 is his.** Comparing triangles as three positions rounded to 0.1 mm: the new set has 2,873,530 and all are in his; his has 2,873,730, and 200 are not in the new set.

      checked: S/d572c/tris.json aNotInB 200, bNotInA 0

- **The 200 are FINS, upright faces across the road at three joints, not a surface you drive on.**
  - Every normal is 89.85–90° from the road's normal and within 0.85° of the direction of travel.
  - They lie at three stations only: s 0 (the lap's seam, 140 of them), s 12,604.5 (52) and s 19,102.1 (8).
  - They sit 13.5–15.7 m from the line, against edges at ±17.1 m. Total area 1.18 m².
  - No drivable mesh of the new kn5 lies under 193 of them (probing along each one's own normal). They are gone, not moved into the pit-lane or catch meshes.

      checked: S/d572c/extranorm.json (per mesh: 1ROAD_p1_chunk_0 140, p28_chunk_37 52, p33_chunk_60 8; the angles above); coverAll.json coveredByB 7 of 200

- **The cause:** t180 `5fb289c` (2026-10-25), "No fins where pieces meet: zip seams by position, drop and refuse standing road". It is in `429bc68` and not in v0.3.6 `a759ad6`, the export his `t180b_elysium` came from (written 2026-10-17T15:51:08Z).

      checked: git merge-base --is-ancestor 5fb289c HEAD → yes; against a759ad6 → no
      inferred: 5fb289c is what removed these 200 (its subject names exactly this; I did not export the document on the commit before it)

- **What this means for his test:** his test stretch, s 8,937–9,354 and pieces 20–21, holds none of the 200. There the road's triangles are his to 0.1 mm and its vertices his to the float. **The test compares the apron and nothing else.** The three joints where the fins were are the only other places the road changed; a fin across the road's edge is a thing a wheel could catch, so its absence is a fix, not a loss.
- **The 7 vertex-count changes per chunk** (for example `1ROAD_p1_chunk_0` 32,720 → 32,640) come from the same fins and the zipped seams. A chunk boundary moving shifts every later vertex's index, so a mesh-by-mesh, index-by-index comparison shows metre-sized "moves" that are a renumbering, not a change of shape.

      checked: S/d572c/meshdiff.json (index-paired: 0 of 89 meshes byte-equal; the order-free measures above are the ones that mean something)

## 4. TIME_2: kn5-move-gate on the result, and why it is equivalent

**The d566-a rule is not in this tree** (`d566-a` and `land-0431` contain it; `429bc68` does not), so I used O's tool, `t180-wt-o567` at `acc9280`, with O's own arguments: gate 2, near s 17,680, max tilt 2°, closed.

**The tool counts every `<digit><KEY>` mesh as road**, the `1ROAD_APRON_` strips included. With them, its edge search would find the road 2 m wider each side and stand the gate further out than GATES' gate. So I did this:

1. **Ran the tool on the WIDTH-0 export.** Same document and tree, `edgeApronM: 0`, kn5 `df3176a1…`, whose road set equals the 2.0 m one (§3).
2. **Copied the two moved 64-byte matrices** into the 2.0 m kn5 at its own `AC_TIME_2_L` / `_R` offsets. Both parents are the identity there, as the tool requires.

**Equivalence:**

    checked: S/d572c/move.json
      the station: k 2160, s 12,958.47, camber 1.99°, climb 1.77°, edges 17.10 / 17.10 m
      moved L (-882.82, -294.19, 7.36), R (-907.11, -293.64, -13.05): 31.73 m top-down, L-R tilt 0.98° (O's D567 figures)
      vsStiff: AC_TIME_2_L and _R matrices BYTE-EQUAL to GATES STIFF's (max difference 0)
      the patch: 88 bytes changed, same length (the from-matrices were his unmoved gate, 768.6 m and 798.8 m up)

**The gate checks pass on the installed kn5.** These are the three gate checks O's tool runs (`gate-orientation`, `height-and-heading`, `slots`), from the merged tree's `src/markers/checks.js` `checkPlaced`. They read the gate back from the PATCHED 2.0 m bytes, against that kn5's whole drivable road, aprons included:

    checked: S/d572c/move.json checks2.problems [] for AC_TIME_2; heights 1.49998 / 1.50001 m (the tool's own on width 0: the same); edges with the apron 19.10 / 19.10 m

`checkPlaced`'s full list also prints `gate-orientation:1`, `start-ahead-of-grid:1` and `pit-count:1`. Those are about the start gate, grid and pits, which this one-gate set does not hold; O's tool filters them out the same way (problems naming AC_TIME_2 only). AC_TIME_2 itself has none.

## 5. The texture, which is not his

- **His racing kn5's road texture** is `t180b_floor_made-15fd8c54218137c3-2048`: a made texture at 2048 px. **No commit in t180's history carries a 2048 in app/ or src/** (`git log --all -S2048 -- app src` is empty).

      inferred: his texture panel was set to a look the app remembers, which I cannot reproduce from the document

- **This export uses the app's default**, `t180b_floor_made-993b5297d4ad20a5-1024` (asphalt made here, edge fit off). The kn5 is 7.5 MB smaller than his for that reason.

      inferred: the size difference is the texture; not measured

- **The road's look differs from his folder; its geometry does not.** If he wants his own look, re-exporting from the app with his texture setting gives the same road.

## 6. The install

- `tasklist` was checked twice, the second time immediately before the copy: no `acs.exe`, no `t180-track-builder.exe`. The target did not exist.
- The folder was staged in `S/d572c/stage/` and copied in as a new folder. Its 10 installed files equal the staged ones by sha256.
- **His folders after the copy:** `t180b_elysium` kn5 `21a13bf8…`, surfaces `21396ea8…`; GATES kn5 `d41a9f41…`; GATES STIFF kn5 `d41a9f41…`, surfaces `039e54da…`. All are as before.
- **Nothing of C's was touched.** The 0.4.31 build ran under its own lock while my runs waited at the gate.

## 7. The test and the falsifier, as filed

- **The test:** his drive through s 8,937–9,354 and pieces 20–21, on ELYSIUM APRON.
- **The falsifier:** any wheel under the top surface for more than one frame after a return means the wedge underside is next, not a wider apron.

## 8. Corrections, mine

- **I first compared the road mesh by mesh, by vertex index.** That showed every mesh "moved" by 2–7 m, which was a renumbering after the chunk boundaries shifted. The order-free measures in §3 replace it.
- **A sed edit ate the backslashes in `\d+`** (`coverAll.js`, a scratch probe). `node --check` passed it, so this time it was caught by reading the line, not by the check. It was fixed with Edit before the run.
- **My first coverage probe mis-shaped the triangles for the ray index.** The Edit failed on a mismatched string before anything ran.

SOURCES: S/d572c/{exportA.js, outE/summary.json, set-installed.json, set-stiff.json, set-app.json, set-zero.json, meshdiff.json, nearest.json, nearest-rev.json, tris.json, cover.json, coverAll.json, extranorm.json, move.js, move.json, stage.sha, installed-apron.sha, runE.log, runM2.log}; t180-wt-o567 tools/kn5-move-gate.cjs (acc9280); t180-wt-e572c src/markers/checks.js, src/texture/set.js, app/core/textures.js, app/export/export.js, coreshell.js buildExport; git show 5fb289c; git log --all -S2048; his three folders' surfaces.ini, ui_track.json, models.ini (read only); tasklist
