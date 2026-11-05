# p-l130-readout-display-C — the readout display (L130 packet C), 2026-09-29, on L

Pane C. Plan: `exo_memory/loop/plan_t180_camera_readout_2026-09-29.md`, Part 2. Built against E's seal
`exo_memory/loop/readout_check_registration_2026-09-29.md` — checked: `sha256sum` → `57448e2af8eb1670…`, the sha the
packet named. **Nothing committed, nothing pushed.**

**Status under the seal: UNVERIFIED BY ITS GOVERNING CHECK.** E's governing check G is the keeper: *"If the keeper
still cannot tell a piece's degrees while adjusting, the display failed whatever the tests say."* The keeper has not
seen it. M1–M6 are to be scored by a seat other than C or A. Nothing below is a score. It is what the author measured.

## 1. What was built, and where it lives

Repo `C:\Users\zackn\Downloads\t180-track-builder` at `1d68a86`. The work is in worktree
`C:\Users\zackn\AppData\Local\Temp\c-l130-wt`, detached at `1d68a86`. checked: `find -type l` → 0, and
`dir /al /s` → 0 junctions and 0 symlinks.

**The delivered set** is one patch:
`C:\Users\zackn\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\scratchpad\l130\c-l130-readout.patch`
(sha256 `86b6131fc80bdfd5`, 6 files). It is taken against `1d68a86` with `git diff` on exactly the paths below.

| file | sha256 (worktree) | what |
|---|---|---|
| `app/core/labels.js` (NEW) | `cbf437c1246f4f37` | formatting, the label layout, and the DOM label layer over `#preview` |
| `app/core/panel.js` | `a81e8c11b931ed77` | the readout box beside Extend's fields; mounts the label layer |
| `app/core/coreshell.js` | `f27cbe92783f898b` | `candidateReadout(opts)` and `pieceReadouts()` (cached per doc), over A's `readout.js` |
| `app/preview/index.js` | `379e826e550f2a38` | NEW event `'t180:view'` → `{ pose, mode, head }` from `p.view()`; removed on unmount |
| `app/test/core-readout-display.test.js` (NEW) | `1340944197574ded` | the display tests |
| `app/test/core-mutation.test.js` | `7a0f28dd6ab18a7a` | adds the new test file to TESTS, plus mutants R1–R12 |

**Not delivered, and required: A's `src/core/readout.js`** (sha256 `01bb4a2d0197cac5`, from `a-l130-wt`). `coreshell.js`
requires `../../src/core/readout.js`, so A's file must land with or before this patch. A copy of it and of
`test/core_readout.test.js` sits untracked in my worktree for running only.

**Not touched: `app/camera/*` and `app/preview/preview.js`.** The preview hook the labels need lives in
`app/preview/index.js`, a different file, and uses only `p.view()`, which the preview already has. B's uncommitted
camera and preview files are in my worktree as copies (`cameras.js` `1419c4dc96fc86b3`, `preview.js`
`f5f73f98079f38f4`, plus their tests) so the app could run with the ZOOM range E's M5 names. They are not in the
patch.

## 2. What it shows

- **Panel (beside Extend):** four cells, `length`, `turn change`, `climb change` and `bank change`, 16 px bold. They
  come from `shell.candidateReadout(fields)`, which is A's `candidateReadout(doc, opts)`, and are recomputed
  synchronously on every field `input` before the ghost redraws. On a refusal or a closed loop the cells read `—` and
  the reason goes in the title.
- **Label at each placed piece:** two lines in a DOM layer, for example `180.0 m` and
  `turn −18.0° · climb 0.0° · bank +8.0°`. Climb fits and is included. The text is `#f4f6fa` on `rgba(10,12,16,0.94)`
  at 16 px bold.
- **Format, as E sealed it:** one decimal, the unit written, the sign explicit on angles, MINUS U+2212, and `0.0°` with
  no sign. Rounding is `sign(x)·round(|x|·10 + 1e-7)/10`.
- **Why the panel reads `+90.0°` for "turn 45 °/100m × 400 m":** the fields are rates, and A's model ramps curvature
  from the previous piece's rate to the new one across the piece. 400 m ramped 0→45 gives 90°. The labels on the track
  show the same thing: the 180 m piece after a −20 rate reads `turn −18.0°`, and its bank change is `+8.0°` (−8 → 0).
  The display shows A's numbers and does not second-guess them. inferred: that a keeper typing "45" and seeing
  "+90.0°" will understand why is exactly what G tests, and nobody has checked it.
- **Layout:** the head's piece is placed first. Each label tries 8 offsets around its anchor at gaps 14, 28 and 49 px.
  When a head is present it also tries two rings that clear the head keep-out. A placement is refused if it leaves the
  view, enters the head keep-out square, or overlaps a label already placed. Anchors slide along the piece's stations
  so that a piece whose middle is behind the camera can still be labelled. Labels that cannot be placed are culled
  and reported through `'t180:labels'` → `{ drawn, culled }`.
- **Test-facing shape as E sealed it:** `panel.labels.labels()` → `[{ piece, text, rect: {x, y, w, h} }]`, plus
  `culled()`.

## 3. Measured (every figure with its command)

All node runs were under the heavy-run lock with `--max-old-space-size=4096`, through
`scratchpad/lockrun.js` (it holds `consonance/tools/heavy-run.js`).

- **Final run:** `node lockrun.js "L130 final 2: build, shots, mutation, suites" l130/all3.log -- "bash l130/all2.sh"`.
  `all3.log` sha256 `492fd723214f28d7`, exit 0, 10:11 → 10:31Z.
  - build: its own `CARGO_TARGET_DIR` under scratchpad, and the exe copied to `l130/t180-c-l130e.exe` (sha256
    `f087e0a41422030d`);
  - placeholders: none; links: 0.
- **Mutation:** `l130/mut3.out` (sha256 `acf618bc17411ec0`): **tests 44, pass 44, fail 0**. That is the earlier C, L
  and P set plus R1–R12. Among them, R12 ("no ring clears a large head keep-out") is caught by "the layout: a label
  anchored on a large head keep-out…".
- **All suites:** `l130/suite3.out` (sha256 `4f560d17133e2d91`): **597 tests, 592 pass, 1 fail, 3 skipped, 1 todo.**
  The one failure is `preview: L toggles the look between the AC shaders and the colour per word…`: the look stays
  `'ac'` where `'words'` is expected. That test is B's, and it fails on B's uncommitted `preview.js`/`look` changes.
  B already reported it (`p-l130-camera-read-B`, "pressing `l` no longer toggles"). No file of mine is on its path.
- **Window captures (final):** `node l130/shots6.js --exe l130/t180-c-l130e.exe --out l130/shots9`, under the lock.
  The window was launched off-screen at (−12000, −12000), captured by PrintWindow of the app's own window only, and
  the autosave was `"restored"`.
  - Capture size 2122×1346 physical px; page 1400×860 css at DPR 1.5; `#preview` at css [280, 44, 820, 732].
  - `report.json` sha256 `c845500a7b23d9c9`.

| capture (`shots9/window-*.png`) | sha256 | mode | labels drawn | culled |
|---|---|---|---|---|
| ghost-readout-build-z1 | `cb1981df0d636972` | build | 1 (p5) | 0 |
| labels-overhead-z1 | `13194b2ba7a8a6e8` | overhead | 5 | 0 |
| labels-overhead-z0.05 | `9f39f31a5c67d708` | overhead | 0 | 0 — **the preview is entirely black; see §5** |
| labels-overhead-z50 | `38dff294d801da96` | overhead | 3 | 2 (p2, p1) |
| labels-build-z1 | `a71748c45eaaa172` | build | 1 (p5) | 0 |
| labels-build-z0.05 | `9ff9e9f815bc77d0` | build | 1 (p5) | 0 |
| labels-build-z50 | `278f678403643825` | build | 5 | 0 |

  - The panel in every capture read `400.0 m`, `+90.0°`, `0.0°`, `+30.0°` for fields 400 / 45 / — / 30.
  - Label boxes are 252–293 × 47 css px, which is ×1.5 device px.
  - **inferred:** the "z0.05" and "z50" in the names are what the script *asked* for, not a zoom read back from the
    camera. It sends 6 Shift-wheels in (24 steps of 1.15, ×28.6) and then 16 out. Clamped at ZOOM min 0.05 and max 50,
    that should reach both ends, but the camera's zoom was never read back. A scorer should read it.
  - The table shows drawn/culled counts only. I did not compute M4's head-box pixel share, M5(a)'s ink height or
    M5(b)'s contrast. Those belong to the scorer.

## 4. Corrections, including mine

1. **The build clobber (mine).** `CARGO_TARGET_DIR=C:\build\lighthouse-target` is machine-wide, so my first build
   overwrote `C:\build\lighthouse-target\debug\t180-track-builder.exe` (02:25 local). The release exe (01:03) was not
   touched. I posted on the board. Every later build used its own target dir and ran the captures from exe copies.
   **Anyone running a worktree build on L is exposed to the same thing.**
2. **The captures were showing two-thirds of the page (mine, found this run).** Captures `shots4`/`shots5` were
   1415×897 while the page was 2100×1290 device px. The labels at the right and bottom were outside the frame: the
   ghost's label, at css y 602, did not appear in its own picture, and p4's label ran off the edge. The cause is
   `scripts/prove_render.ps1` in the repo: it never declares DPI awareness, so PowerShell's `GetWindowRect` returns the
   96-dpi-virtualised size and the bitmap is cropped to it.
   - I tried forcing scale 1 (`shots7`: the page grew to 2100 css) and resizing the window (`shots8`: the page grew with
     it). Neither fixed it; both are recorded in `l130/geo2.log` and `l130/geo3.log`.
   - The fix: a scratch copy, `scratchpad/l130/prove_render_dpi.ps1` (sha256 `04d9997da81d18cd`), which calls
     `SetProcessDpiAwarenessContext(-4)` (per-monitor v2) before measuring. `shots9` is the first set that shows the
     whole window.
   - **Finding for whoever owns `scripts/prove_render.ps1`:** its captures on a scaled display have been partial
     without saying so. The repo file is unchanged.
   - Earlier labels-at-zoom claims made from `shots4`/`shots5` images are withdrawn. The counts in those reports came
     from the page and were right; the pictures were not.
3. **Labels drew nowhere in the first window capture.** Two causes. Anchors were keyed by the path object, which the
   preview extends in place; they are now keyed by `track.segments`. And the preview's mount cleared `#preview`,
   detaching the layer; it is now re-attached each frame. A test reproduced it first ("drawn 1, culled 0") and passes
   now.
4. **The build view drew no label for the head's piece,** because its middle station was behind the camera. Fixed by
   sliding along the piece's stations. Reproduced first ("drawn: none").
5. **Build view at zoom 0.05 culled the head's label** (`shots4`: 0 drawn, 1 culled). The head keep-out covered every
   offset. Fixed with keep-out-clearing rings, a layout test, and R12. `shots5` and `shots9` now show 1 drawn and 0
   culled.
6. **R4 survived, and my reasoning about it was wrong.** I said −33.35 is stored as "33.3499…". It is
   33.35000000000000142. `scratchpad/l130/halves.js` measured **0 of 8,010** two-decimal halves (0.05…800.95) that
   round differently without the `+1e-7` guard. The guard only matters for computed values: the test now uses
   `0.25−2e−13 → +0.3°` and `−(12.45−2e−12) → −12.5°`, and R4 is caught.
7. **R8 survived** because of a bug in my fake DOM: `replaceChildren` did not clear parents. Fixed; R8 is caught.

## 5. What this does not establish, and what belongs to others

- **G is not tested.** Only the keeper can do that.
- **M1–M6 are unscored.** E's instruments were not run by me, by design. The 30 edits from `mulberry32(130)` (M2) and
  the P/E/S fixtures were not run as E specified. My tests cover the same behaviours on my own fixtures: live panel
  equals A's candidate after each input handler, ghost = placed as identical strings, flight or empty draws no label
  and throws nothing, and no two labels overlap. They are not E's.
- **Overhead zoom-in shows a black preview** (the `labels-overhead-z0.05` capture, and the same in `shots4` and
  `shots5`). No road means nothing to label, so 0/0 there is correct. The black view itself is a camera matter. For B.
- **B's failing test,** "L toggle", is B's (§3).
- **M5(e) culled share:** 2 of 5 at overhead-z50 on this 5-piece track. On P (43 pieces) it has not been measured.
- The labels are DOM, not canvas. The packet said "a canvas label via the preview's overlay or HUD", and a DOM layer
  over `#preview` was what I could build without touching `preview.js`. If the scorer or B wants it drawn in the
  canvas, the hook is `'t180:view'` and the layout in `labels.js` is renderer-free.
- A's numbers are A's. A turn in the display that looks wrong to the keeper (§2, "+90.0°") is a question for A's model
  or for the panel's wording, not a formatting fault.

## 6. Process

- No process of mine is left running. The only processes started were the app instances in the capture runs, each
  killed by its own PID in `shots6.js`'s `finally`.
- No AC launch.
- The heavy-run lock was released after each run (`lockrun.js` logs a `done` line in every log named here).

NEXT: librarian collate L130 when B's camera hand-back and this one are both in
