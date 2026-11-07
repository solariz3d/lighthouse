# D614: the final-scene check's memory (seat A, 2026-11-02)

Branch **d614-a** off d610-c `81b8b25`: **`71a8556`**, one commit, not pushed. Tier PROVE IT.
Evidence and every script: `exo_memory/handback/p-d614-check-memory-A_2026-11-02_evidence/` (EV below); raw outputs on `G:\Consonance-tools\scratch-A-d614`.

## 1. The answer

**The check was the memory, and it is now light.** On ELYSIUM it held **3,594 MB of live heap**: one object per triangle and a string key per vertex,
3,487,592 triangles. Under a 4 GB heap that is what C's batch hit. The new check holds **+39 MB of heap and at most +331 MB of typed arrays**, and
its findings are byte-equal to the old check's on all 9 scene × track pairs. In the built app, the export's worker peaks at 1,106 MB with the new check,
against 1,159 with the check stubbed and **3,413 with the old one**. **Page + checker at Export to AC is 857–863 MB in all three builds**: the check
never ran there. It runs in the export's own worker, in the sandboxed frame's process.

## 2. Node, the app's own modules, his ELYSIUM (copy)

Live heap after a full GC at each phase of the check (`node --expose-gc phase614.js <repo> <doc> <probe copy of the check>`; the probe copy only adds
PH lines) → `EV/runs/phase-old.txt`, `EV/runs/phase-new.txt`:

| check | heap at start | heap at its largest | typed arrays at start → largest | time |
|---|---|---|---|---|
| old (81b8b25) | 905 MB | **4,499 MB (+3,594)** | 496 → 496 | 26.2 s |
| new (71a8556) | 906 MB | 945 MB (+39) | 496 → **827 (+331)**, at the edge table | 17.4 s alone (31.1 s while the builds ran) |

(The first new version, with the edge table grown at half full and the vertex table kept to the end, was +38 MB heap and +511 MB typed: `EV/runs/phase-new-first.txt`.)

The whole export through the app's exporter (coreshell `buildExport`, modules loaded from text as the app does), with the check hooked or stubbed
(`node --expose-gc --trace-gc mem614.js` | `memsum.js` → `EV/runs/*.memsum.txt`):

| run | heap limit | export's peak heap (any GC) | peak RSS |
|---|---|---|---|
| stub (no check) | 12 GB | 1,951 MB | 4,219 MB |
| old check | 12 GB | **5,714 MB**, inside the check | **7,420 MB** |
| new check | 12 GB | 5,321 MB: garbage V8 had no reason to collect under 12 GB; live at most 1,477 → 1,477 | 7,699 MB |
| stub | **3 GB** | 1,913 MB | 4,189 MB |
| new check | **3 GB** | 1,922 MB (in the check: 1,717 peak, live at most 1,522) | 4,200 MB |

Read the 12 GB rows with care: a generous limit lets garbage pile up, so a used-heap peak there is not what a process needs. Under the same 3 GB, the new
check adds 9 MB to the export's peak heap and 11 MB to its peak RSS.

## 3. The ceiling, as a test (red first)

`test/finalscene_heap.test.js` row 1: ELYSIUM (the tracked fixture, `elysium-2026-10-22.t180track`) exports with the check in a child node process under
a **3,072 MB** heap. Controls: the check ran once, on more than 3 million triangles.
checked: `heaptest.ps1` → `EV/runs/heaptest.txt`:
- **red on 81b8b25** (the test file copied in): `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`, 181 s
- **green on d614-a**: 158 s

## 4. The built app, hidden

Three builds of this tree's own code (`build614.ps1`: `cargo tauri build --no-bundle`, target on G: seeded from the 0.4.37 landing's release target, a
copy; its tree untouched). sha256 in `EV/runs/build-sha256.txt`:
- old: 81b8b25, `56b822b7…`
- stub: 81b8b25 with the check returning nothing, `c138e36f…`
- new: d614-a before row 11's one-line export of the two tables, `2f083791…`. That line changes no behaviour.

C's D583 harness (`wv583.js`, my copy with every child hidden), one run at a time under a heavy-run slot, acs.exe checked before each, on his ELYSIUM:
File ▸ Open…, then Export to Assetto Corsa into a fake AC folder (`wvrun.js open,install stub new old` | `wvmax.js` → `EV/runs/wv-runs.txt`,
`wv-max.txt`, samples CSVs). Every isolate's used JS heap, each second:

| build | open: page + checker | Export to AC: page + checker | Export to AC: export's worker | crashes / page errors |
|---|---|---|---|---|
| stub | 958 MB | 863 MB | 1,159 MB | 0 / 0 |
| new | 952 MB | 857 MB | 1,106 MB | 0 / 0 |
| old | 962 MB | 859 MB | **3,413 MB** | 0 / 0 |

- **Hidden, proved per run:** the app started on its own desktop ("t180-measure"), and winenum found **0 windows of its process tree on the user's
  desktop** in each of the three runs. Each run killed only its own pid; t180-track-builder.exe left running: 0, all three.
- **Same output:** all three wrote 10 files, kn5 178,653,991 B.
- **The old build did not crash** here: its export worker reached 3.4 GB of used heap and finished. That is about 0.6 GB under the 4 GB cage C's dumps
  named, on this one track. A longer track would not have had the room.
- **inferred:** these are used-heap peaks, garbage included, as C's §1c footnote says of the same instrument.

## 5. The findings are identical

`cmp614.js <scene tree> <doc> <old check> <new check>` builds one welded scene, then runs both checks on it with `detail` and compares their whole JSON
output: refuse, warn, open edges, hairlines, folds, steps, faces across, slivers, rays and depths. → `EV/runs/cmp-matrix.txt`, `cmp-81b8b25-rerun.txt`:

| scene tree | ELYSIUM | CRAZY TEST | TEST 10 |
|---|---|---|---|
| 81b8b25 | SAME (0 / 0; 32 hairlines, 92 folds read) | SAME (0 refuse / 2 fold warnings) | SAME (0 / 0) |
| 8fb6ecc | SAME (9 refuse / 10 warn) | SAME (12 / 13) | SAME (11 / 15) |
| e911792 | SAME (9 / 12) | SAME (12 / 20) | SAME (11 / 18) |

**Correction:** my first matrix's three 81b8b25 rows compared the old check against a stub. On the d614 tree my tool stubbed the scene tree's own
`finalscene.js`, which was the new check. I reran those three with the new check loaded from a copy; the table above is the rerun.

## 6. The change (src/export/finalscene.js)

- The triangles are rows of typed arrays: mesh, place, nearest sample, vertex ids, unit normal. They are read through `tri(i)`, a view made when a triangle is
  read. The view has the old object's fields as getters, so the fold, open-edge and bottom code reads as it did.
- The welded vertices go in `tripleIds()`, an open-addressed Int32 table, and the edges in `edgeGroups()`. Both number entries in the order first seen,
  so every iteration, and so every tie and every finding, comes out in the old Map order.
- The vertex table and the per-triangle ids are let go once the edges are filed.
- A vertex that is not a finite number within 2,000 km now refuses by name. The old string key would have welded every NaN together.
- No streaming per piece: the weld and the crack widths read across pieces, and typed arrays alone met the bar with the findings byte-equal.

## 7. Tests and mutants

- `test/export_finalscene.test.js`: **11/11** (`EV/runs/export_finalscene.tap`):
  - row 8 adds the non-finite vertex refusal;
  - new row 11 holds the two tables to their promise across growth: 200,000 vertices and 100,000 edges, each with its number, first and second slot and count.
- **Mutation harness `finalscene_mutation.test.js`: applied 24 / caught 24 / NOT APPLIED 0**, plus 2 controls (`EV/runs/mutation-final.txt`).
  - F1's anchor is **AMENDED by name**: the normal is the local `nu`, not `tri.n`; the fault is the same.
  - New mutants: F17 (an edge's count never passes 1), F18 (no second slot), F19 and F20 (each table loses its entries when it grows).
  - **Correction, run 1** (`mutation-run1.txt`): F19 and F20 were judged by row 1 and **not caught**. A table that loses entries files them again as
    coincident duplicates, and the open-edge check reads coincident edges as covered, so a clean lap cannot show it. Row 11 was written for that; both
    are caught by it in the final run.
- Touched files (D609's selection: every test naming the export, the apron, the skin or this check, 66 files with the new heap test): **728 tests, 727
  pass, 0 fail, 1 todo** (the existing preview-list TODO). `EV/runs/touched.tap`.
- CHANGELOG: one Fixed entry, in plain words.

## 8. What I did not do

- No push. Nothing installed. Nothing written to his tracks or AC folders: the app runs exported into fake folders under G:.
- Not measured: the 50 and 100 km stadiums in the built app. The check's cost now scales at roughly 95 B a triangle (inferred from 331 MB / 3.49 M),
  against about 1 KB before.

SOURCES: the order D614; C's D583 hand-back §1a/§1c/§8c and its harness (wv583.js, hidden-launch.ps1, winenum.ps1); the runs above.
