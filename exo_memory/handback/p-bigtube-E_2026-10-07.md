# p-bigtube-E · D266 item 1: the page crashes closing a big tube oval · pane E, on D, 2026-10-07 · BAR MET

**Commit `9183207`** on t180 main `2b929c2`, branch `d266-bigtube`, worktree `C:/Users/nname/Desktop/worktrees/e-bigtube-wt`.
- 4 files, +308/−27. Not pushed. For v0.3.1.
- **`coreshell.js` is not touched**, so no lines are needed from A's merge. The files are `app/core/overlapjob.js`, `src/validate/raygap.js`, a new `test/validate_raygap_lean.test.js`, and CHANGELOG (Unreleased → Fixed).

**The track:** a COPY of the librarian's copy of `eq-FINAL TEST` (`final.t180track`, sha256 `0dc45cc4…`). It is 6 × 1000 m of tube; closed, that is 3,000 segments, cross-section K = 407 and **2,436,812 road triangles**.

## 1. The cause, confirmed (measured, and sourced)
- **The limit (sourced).** With V8's shared pointer-compression cage, every V8 heap in one process (the page and its workers) shares one 4 GB cage ([V8 v9.2](https://v8.dev/blog/v8-release-92), [Electron: V8 memory cage](https://electronjs.org/blog/v8-memory-cage)). ArrayBuffer stores are outside it.
- **Per-isolate heap in node** (each part in a worker, its heap sampled every 25 ms from the main thread; scratch `bigtube/heap.js`):

  | | rest | rays | page's preview mesh (stand-in) | sum at once |
  |---|---|---|---|---|
  | base | 1,713 MB | 2,424 MB | 860 MB | **3,427 MB** |

- **Where the heap goes** (scratch `stages.js`, `strip2.js`):
  - The built mesh holds 750 MB, of which **660 MB is each 2 m piece's `first`/`last` boundary rows** (objects per vertex, kept for sculpt and seams).
  - `rayGaps` adds **1.47–1.63 GB**: a JS array per vertex, triangle and normal, an object per edge, and string keys for every bucket.
  - The self-check adds ~0.96 GB on top of the mesh.
- **In a real Chromium renderer, with no window** (scratch `bigtube/edge.js`):
  - **Setup:** headless Edge (`--headless=new`, its own profile and ports, nothing takes focus), the worktree's app served static, a stand-in for Tauri's `invoke` that opens the copy.
  - **Steps:** the page's own Open list, "Close the loop", wait for the check, Apply. JS heaps are read with `Runtime.getHeapUsage` every 500 ms.
  - **Base `2b929c2`:** page **1,423 MB** plus workers **3,014 MB**, so **3,910 MB together, against the 4 GB cage**. Edge processes 5,970 MB at peak. The check took 32 s.
  - **It did NOT crash here.** The keeper's page likely held more (undo history, an earlier preview). So: the cause is confirmed as the renderer's shared heap at its limit, but the crash itself is not reproduced. inferred: the keeper's extra page state took it over.

## 2. The fix (the answer unchanged)
- **`src/validate/raygap.js`: the same search in typed arrays.** Vertices, triangles, normals, edges and both grids are flat typed arrays, with buckets hashed by integer coordinates.
  - The weld is the same: the FIRST vertex within 5 mm, searched in the same bucket order.
  - The edges are kept in first-met order (a per-vertex CSR replaces the string-keyed Map).
  - The same triangles sit in each grid cell in the same order, and the arithmetic is the same expression for expression.
- **`app/core/overlapjob.js` `checkMesh`:** the check builds ITS OWN mesh without the self-check, deletes `first`, `last`, `ends` and `handles` from its pieces, then runs `selfCheck` itself.
  - It uses exactly buildMesh's options and folds (`closed`, `lengthM`; folds += `asFolds`).
  - The self-check reads only K, Us, cells and the seams' s (`bvh.js` soup).
  - The page's and the export's meshes are untouched. The export does run the same `rayGaps`, with the same gaps.
- **NOT done: running the parts one after the other.** Each lean part fits in ~1 GB, and the heaps sum to 1.4 GB under the cage, so series would save ~0.4 GB more at a cost of ~5 s on big tracks, and would change D240's runner.
  - What would change my mind: a crash at these numbers, or a page heap much bigger than 1.4 GB. A's drag ghost is the page side.

## 3. The registered bar
| | registered | base `2b929c2` | `9183207` |
|---|---|---|---|
| peak per worker | ≤ 1.5 GB | `rays` **dies at a 1,500 MB cap** ("JavaScript heap out of memory"), whole too; `rest` fits | rest, rays and whole all **finish at a 1,500 MB cap**; both fit at 800 MB (heap limit 1,040) |
| page survives Close + Apply | yes | survived headless at 3,910 MB of 4 GB | survived; workers **1,247 MB** together, sum **2,609 MB**; check **12 s** |
| identical to the one-piece check | yes | — | identical (below) |

- **The cap test** (scratch `cap2.js`): each part runs in a child node with `--max-old-space-size=CAP`.
  - An earlier attempt with worker `resourceLimits` was VOID: the lock runner's `--max-old-space-size=4096` overrides them (the worker's limit read 4,496 MB). Named so nobody repeats it.
- **The sampled peaks are noisy** (they count garbage not yet collected: `rest` read 1,105–1,716 MB across runs). The capped run is the bar's evidence.
- **`rays` alone:** 2,424 → 783 MB and 33.8 → 4.1 s.

**Identical results** (scratch `equal.js`: base vs branch, whole check and the two parts as full JSON, `mergeParts` = whole, and `rayGaps` gap for gap):
- The copies: 7 keeper-track copies plus the big tube, each as it is (open or closed).
- **All equal**, including **TEST 1 (32 overlaps, 11 gaps)** and **TEST 1 recovered (17 overlaps, 10 gaps)**.
- The branch's whole check is 2.1–2.7× faster on every one.
- **My own catch:** equal digests on CLEAN tracks prove nothing about gap finding (the tube oval and the big tube have the same `rest`/`rays` digests because both have no reds). Hence the copies with reds.

## 4. Tests (all under the lock, serial shim, in the background)
- **`test/validate_raygap_lean.test.js`, 4 rows:**
  - 1a/1b: the lean `rayGaps` equals **the old code kept verbatim** (diffed against `2b929c2`:45-109). It is checked on slits, holes, a weld across a bucket boundary, a 6 mm unwelded slit, a degenerate triangle, a mesh laid twice, a tilted slit and a lip, and on a coil, a closed lap and a tube.
  - 2: the lean check equals the check on buildMesh's self-checked mesh, on a coil that overlaps itself, and parts = whole.
  - 3: memory. A synthetic oval of the same shape (not the keeper's file) gives exactly 3,000 segments, K 407 and 2,436,812 triangles. Every part and the whole check must finish at a 1,500 MB cap.
- **Red first on `2b929c2`:** row 3 fails ("rays did not finish within 1500 MB: … heap out of memory"). Rows 1–2 are guards and pass there by construction. `bigtube/base.tap` sha256 `54269ff6…`. On the branch it passes 4/4 (`new.tap` `7eaef0cb…`).
  - My own fixes on the way: the first synthetic doc's joints were not C1, and it was not a tube (no `tube: true`, so it built a bowl at K 77). Both were caught before the run counted.
- **Targeted:** the new test, every `validate_*` test, every test that reads the kn5 (`git grep -l -E 'kn5|readKn5'`, mutation files excepted), app `core-close-preview`, `preview-async`, `redgroups`, **`core-xsec`**, export-csp/selfcheck, and export_csp/grip/width. 52 files: **671 tests, 664 pass, 0 fail, 7 old todo, 0 skipped**. `bigtube/build.tap` sha256 `87361233…`.
- **`app/test/core-close-mutation.test.js` 37/37** (its A3 anchor in overlapjob.js is still there exactly once). `harness.tap` sha256 `1ee89e81…`.
- **Not run:** the whole suite, other harnesses, and the real app window.

Scratch base worktree `bigtube/base-wt` (detached `2b929c2`) is mine to remove.
