# D266 item 2: the cheap ghost while a handle is dragged — seat A (Sonnet 5.5), 2026-10-07

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_big_tube_crash_2026-10-07.md (item 2) · worktree `C:\Users\nname\Desktop\worktrees\a-cheap-wt` · evidence `p-cheapghost-A_2026-10-07_evidence/` (`measure2.js`, `before_after.txt`, `red_on_2b929c2.txt`, `green_targeted.txt`)

**Done: commit `8cf4430` on branch `cheapghost-a`, from t180 main `2b929c2`. Local, nothing pushed. FEEL tier: rows and fake hosts only, no real window, no pointer lock.** It touches no `coreshell.js` line and nothing on E's side (`overlapjob.js`).

## What it does
While an Extend handle is being DRAGGED the panel asks the preview for a CHEAP ghost; the release builds the full one. Typing in a field, hovering Extend, Extend itself, the placed track and the export are unchanged.
- `app/core/panel.js`: a `scrubbing` flag, true from an Extend handle's `begin` to its `end` (not for Sculpt or the landing's handles); `ghost()` sends `t180-ghost` with `cheap: scrubbing`; `end` calls `ghost()` again with the flag off, which builds the full ghost.
- `app/preview/index.js` → `preview.showGhost(candidate, { cheap })` → `trackmodel.ghostFor(candidate, { cheap })`.
- `app/preview/trackmodel.js` `ghostFor`: with `cheap`, the NEW segments' row grid is thinned by `coarse.js` (the existing D235 `coarsen`, with a new `CHEAP_FACTOR` of 12: a section step of about 12° where the full ghost has 1°); the PLACED segments are left exactly as they are (the candidate must still extend them: a coarsened prefix would fail the key check), so **the path is identical and the handles read the same samples**. The brush's own coarse mode (model `detail`) is untouched.
- **"No underskin": there is none in the preview.** The underside skin is an export mesh (`src/export/underskin.js`); the preview's mesh has none, so there was nothing to drop. Said here so it is not read as skipped.
- **"Coarser along the piece" is NOT done.** The cost is now per 2 m segment (500 of them on 1000 m), not per vertex; merging segments would change what the path and the mesh are built from, a bigger change than a ghost flag. See the numbers below.

## Measured before and after (the command: `node measure2.js <root>`, in the evidence folder; headless, one drag step on a 1000 m closed-tube piece after a 300 m straight; median of 9 steps; the core's `candidate` + `candidateReadout`, then the track model's `ghostFor`)
| | step | core part | ghost build | vertices | upload (float32 + indices) |
|---|---|---|---|---|---|
| **before** (main `2b929c2`) | **514 ms** | 16 ms | 497 ms | 392,455 | 17.3 MB |
| after, FULL ghost (unchanged) | 583 ms | 18 ms | 565 ms | 392,455 | 17.3 MB |
| after, **CHEAP ghost (a drag step)** | **95 ms** | 18 ms | **77 ms** | **34,097** | **1.5 MB** |
The full ghost is as slow as before (583 against 514 is machine noise on a shared PC). **A drag step is about 5.4 times cheaper and uploads a twelfth of the data**, from about 2 steps a second to about 10. Where the remaining 77 ms goes (measured apart): path extension 5 ms, mesh extension 55 ms for 34 thousand vertices, i.e. per-segment overhead. **inferred, not measured: the GPU upload and draw time in the real window** (headless has no GL): 17 MB to 1.5 MB per step should help there too, but I did not see a frame.

## Rows (red first, then green)
- `app/test/cheap-ghost.test.js` rows 1 to 3 and `app/test/core-pieces-ui.test.js` row 18.
- **Red on `2b929c2`'s code:** row 1 (the model: "the cheap ghost is at most a quarter: 392455 against 392455") and row 18 ("every step of the drag is cheap: [false,false,false]"). **Rows 2 and 3 are GUARDS, not red**: they assert the cheap ghost keeps the same path, `ghostInfo` samples/s0/segments and the placed track, which was already true of an ignored flag.
- **Green:** row 1: at most a quarter of the vertices on the 1000 m tube; the same path samples, head and segment count; `tm.path` and `tm.mesh` the very same objects; a full ghost after a cheap one is the full ghost without it (same vertices); `cheap: false` is full. Row 2: the headless preview keeps `ghostInfo` (samples, `s0`, segments) and the placed track; a plain `showGhost` is full. Row 3: a short plain piece and an empty track: cheap is still a ghost of the same path. Row 18: typing sends the full ghost; a press alone asks for nothing; each of three drag steps is cheap; the release's LAST ghost is the full one; typing and hovering Extend after it are full; a second drag is cheap again.
- **Targeted run under the lock (19 files: `cheap-ghost`, `core-pieces-ui`, `core-xsec`, `preview`, `preview-async`, `preview-speed`, `look`, `shell-dist`, `shell-ghost`, `handles`, `jump-ui`, `core-readout-display`, `core-shell`, `core-sculpt`, `layout-css`, `redgroups`, `core-close-preview`, `timers-regression`, `camera`): 343 tests, 343 pass, 0 fail, 0 skipped**, including `core-xsec` (the webview-loader row).
- Mutation-harness anchors (not run): 223 edits, the same 3 not applied as before, in `preview/renderer.js` and `prove_render.js`, not touched here.
- `CHANGELOG.md` and `app/README.md` updated. It ships in v0.3.1 as asked.

## Decisions (mine)
- **Only handle drags are cheap, not typing.** The keeper said "scrubbing" and "dragging"; typing a number is one ghost per keystroke, and a cheap ghost that turns full a moment later would need a timer. If a held arrow key in a number box also lags, that is the next step (a short debounce).
- **A factor of 12** (a 360° tube section drawn with about 30 columns while dragging): visibly faceted but clearly the same shape; 6 (the brush's) would give about 3 times the vertices. One constant.
- **No `coreshell.js` lines were needed.**

## What it does NOT establish
The real window (no frame seen; the GPU part is inferred); that a 1000 m tube is the worst case (a longer piece is cheaper per step in proportion, but I measured only this one); the Close preview (item 1, E's); the whole suite and the harnesses (not run).

NEXT: librarian: a non-author look at `8cf4430` (the `ghostFor` tail slice in `trackmodel.js`, the `scrubbing` flag in `panel.js`), then land it with the v0.3.1 batch; the keeper's hand on whether a drag now feels precise
