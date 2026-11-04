# D170, packet C: "feels like a coaster builder", with the ADDENDUM first (the BVH false positives, and the full flow)

## §0 · ADDENDUM: the self-intersection check vs multi-part words (FIRST, as the chair asked)

**What A reported** (`p-d169-fixes-export-A_2026-09-27.md:51-57`, and the comment at `src/export/fromwords.js:26-30`): the BVH reports crossings that its own rules exclude on multi-part words, so "a default export of most tracks is refused", with the example "1ROAD_w1_0 meets 1ROAD_w1_0 at s 70 and 90".

**What is true at HEAD, checked:**
- **The symptom no longer happens.** It was fixed at the D166+D167 landing (`0104ce1`), where pieces are named by (id, part) (`src/geom/mesh.js:89` `safeId(id, g, part)`). Evidence:
  - E's own test `test/export_words.test.js:170`, "with the self-check on (the default), the sample exports", passes (`node --test test/export_words.test.js` → 20/20);
  - A's `app/test/export.test.js` sample loop exports with the check ON (my run, scratchpad `repro_bvh.js` → `EXPORT OK`);
  - a 5-word open document with 15 parts has 22 cells, all 22 names unique, and 0 findings.
- A's hand-back and the `fromwords.js:26-30` comment are therefore **stale**, and A's "skip self-intersection check" stopgap was not needed (A has since removed it; see step 3).
- **The CAUSE was still live in my code, and is now fixed.** `src/geom/bvh.js` paired each scene node with its cell record BY NAME (a Map from `mesh.cells` names). With any repeated name, a triangle took ANOTHER piece's s and u, so neighbours inside one pass looked far apart in s and "met": exactly A's symptom. Names happened to be unique after `0104ce1`, so nothing enforced it.

**1. Reproduced first** (`test/geom_bvh.test.js`, two new tests):
- "names repeat (two adjacent pieces with one id and no part): a plain straight run is still clean". **RED before the fix**, with A's exact symptom: `[["1ROAD_w1_0","1ROAD_w1_0",60,116]]`.
- "names repeat: a real same-height crossing still fires, between the right passes". Every piece is named alike, and the lead straight is split into two pieces that the over road crosses both of. It must give the same number of findings as with unique names, each two passes apart (≥ 25 m).

**2. The fix** (`src/geom/bvh.js`, `git diff --stat HEAD -- src/geom` → 1 file, 15 insertions, 7 deletions):
- scene nodes and cell records are paired BY POSITION (mesh.js `assemble` pushes them in one order);
- a count or name mismatch throws, instead of guessing;
- findings are grouped by cell INDEX, never by name.
- **The exclusion rules are unchanged:** the same 25 m same-pass window, the same 2 m stack reach.
- **Real crossings still fire:** the D167 tests stay red where they should (the figure-8 at the same height is an intersection, 1.5 m up is stacked, 6 m up is clean), and so does the loop-bottom overlap. `node --test test/geom_bvh.test.js test/geom_loop.test.js` → 13/13.

**3. `selfCheck: false` where it was only a workaround.** None of MY tests pass it; the geometry tests turn the check ON (`selfCheck: true`). The grep (`grep -rn "selfCheck" test/ app/test/`) found:
- **`test/export_words.test.js:20` (E's): `const OPTS = { selfCheck: false };`**, used by most of that file's tests. This is the workaround. Evidence for E: a copy of the file with `OPTS = {}`, run against the live repo (scratchpad `flip/export_words.flipped.test.js`), gives **19/20 pass**. The one failure is "turning the self-check off is said in the warnings", which needs the flag by design. **For E:** set `OPTS = {}` and give that one test `selfCheck: false` explicitly.
- **`test/export_words.test.js:167` (E's): `--no-self-check`.** This tests the CLI flag itself. Keep it.
- **`app/test/export.test.js` (A's):** it passed `selfCheck: false` at 60, 73, 74, 88 and 121 when I first grepped. **A has since removed all of them** and the app's skip box (new `app/test/export-selfcheck.test.js`: "asking the exporter to skip the check does nothing").
- **`src/export/fromwords.js:26-30` (E's comment):** stale; it describes the defect as current.
- **Who was right:** both, about different lines. **B** was right that export_words has a test run "with the self-check ON (the default)" (`:170`). **A** was right that the repo's tests passed `selfCheck: false` (`export_words.test.js:20` for most tests, and A's own app tests until A removed them).

**Mutations on the fix** (`checked: node --test test/geom_mutation.test.js` → 27 tests, 27 pass; all APPLIED and CAUGHT, NOT APPLIED: none):

| mutant | caught by |
|---|---|
| M26 the self-check finds cell records by NAME again | names repeat (two adjacent pieces …) |
| M27 the self-check groups findings by cell NAME | names repeat: a real same-height crossing (after I split the lead straight: with one crossing pair, grouping by name and by index give the same count, and M27 first survived) |

M1–M25 are all still caught.

**The whole suite** (22:39:11–22:41:50Z): **706 tests, 699 pass, 1 fail, 6 todo.** The failure is `test/join.test.js:83` (B's), from A's in-progress `src/doc/resolve.js`, as in §5 below. It is not this fix.

## §0b · THE FULL FLOW in the real window: loop built and closed there; the EXPORT is PARKED in-window, and proven headless
**Driver:** `node scripts/prove_render.js --flow --exe src-tauri/target/debug/t180-track-builder.exe --out <scratchpad>/d170flowN --port <p> --timeout 600 --shim-timers`.

**Proven in the window** (run `d170flow4`, 22:37:29–22:38:07Z; the app PID was killed at the end, 0 running after):
- the palette (real clicks) placed straight, straight, tight, straight, tight;
- **"Close the loop"** (A's button) closed it. Status "· closed loop"; message "loop closed with 3 words (765 m), worst load on the connector 6.9 g".
- **Capture:** `…\scratchpad\d170flow4\window-flow-closed-overhead.png` (PrintWindow of the app window, opened by me; the same scene as `d170flow\window-flow-closed-overhead.png`). It shows the closed loop from overhead, fitted: 8 words, per-word colours, edge lines and ties, the grid, and the head ring at the join. The right panel reads "0 red · 0 amber · lap proved · 0 jumps".

**PARKED (stuck rule: the in-window export check failed three times, over two causes):**
1. My first stand-in for the native folder dialog wrapped `window.__TAURI__.core.invoke` from the page. That object is **frozen** (`Object.isFrozen(core) → true`, `invoke` not writable), so the wrap silently did nothing. **The REAL folder dialog "Export the track into…" opened on the desktop** and stayed about 180 s, until my timeout and kill of the app closed it (run `d170flow`, 22:30:54–22:34:17Z).
2. A second driver, `scripts/prove_render_dialog.ps1`, finds that dialog by UI Automation, **filtered to my app's PID only**, and typed the folder. But the dialog exposes no commit button to UI Automation: only Help, Details, Organize, New folder and the column headers. There is no Select Folder or Cancel (runs `d170flow2`–`d170flow4`; the dialog opened briefly each time and closed with the kill). The only remaining way to commit is keyboard Enter via SendKeys, which goes to whatever window is in the foreground, **possibly the keeper's**. **Not done.**
3. One of those runs failed on my own script corruption (a dollar-quote sequence in a JavaScript replacement string), not on the dialog.

**The export, proven on the app's own code path, headless** (scratchpad `flow_headless.js`, 22:38:36–22:39:01Z):
- A's `createShell` with A's `makeExporter`; the same five palette words; `shell.closeLoop()` → "loop closed with 3 words (765 m), worst load on the connector 6.9 g" (the same loop as in the window);
- `shell.exportTo(dir)`, the exact call the Export button makes after its dialog. The self-check is ON: A's shell never passes it off.
- → "exported t180b_untitled", with `exportReds` null.
- **The folder, listed:** `.t180b-builder.json` 327 B, `ai/fast_lane.ai` 24,864 B, `data/map.ini` 109 B, `data/surfaces.ini` 356 B, `map.png` 1,130,765 B, `models.ini` 64 B, **`t180b_untitled.kn5` 3,379,657 B**, `ui/outline.png` 280,600 B, `ui/preview.png` 284,288 B, `ui/ui_track.json` 346 B. It is in `…\scratchpad\d170flow-headless-export\t180b_untitled\`.
- **The kn5, read back through `tools/kn5.cjs readKn5`:** version 5, 2 materials, 36 meshes, 60,880 vertices, and the markers AC_HOTLAP_START_0, AC_PIT_0, AC_PIT_1, AC_START_0–3, AC_TIME_0_L and AC_TIME_0_R.
- **What would unpark the in-window export:** a test hook in A's page that lets a proof run name the export folder; A's file, not mine. Or a human pressing Select Folder.

**Files for this section:** `src/geom/bvh.js` (sha256 bb7917843b17316d), `test/geom_bvh.test.js` (af99c6723cb6844e), `test/geom_mutation.test.js` (678edcdfc3bde8c2), `scripts/prove_render.js` (7f75f7bc5091e638, + `--flow`, `FLOW_WORDS`, `summarise`; the report is written even when a step fails), `scripts/prove_render_dialog.ps1` (**new**, 87e2af113c2aa438). `node --test test/prove_render.test.js test/geom_bvh.test.js` → 14/14.

**CHANGELOG addition for B (under Fixed):** "The self-intersection check pairs each mesh with its own cell by position, never by name, so a repeated name can no longer make one pass of the road 'meet' itself (the multi-part-word refusals of D169). Real crossings and stacks are still found."

---


Pane C, 2026-09-27. Repo `C:\Users\nname\Desktop\t180-track-builder` (base f0b0d75, with D169 not yet landed), uncommitted.

**Scope:** my files only. **src/ is untouched** (`git diff --stat HEAD -- src/geom` is empty). A's and E's files were not edited.

This implements the review at `exo_memory/librarian/2026-09-27.desktop.md:142-160`, items 1, 2, 6 and 7.

## 1 · Files (`checked: sha256sum … | cut -c1-16,65-`)

| file | sha256 (first 16) | what |
|---|---|---|
| app/preview/look.js (**new**) | bfcb605d578d22e3 | `LIGHT` / `shade`, road lines (`linesFor`), `localBounds` / `worldBounds`, `gridLines`, `headMarker` |
| app/preview/renderer.js | caea3c131ad8d8f6 | lighting compiled from look.js's constants; a line program; a see-through ghost pass; grid and marker |
| app/preview/batches.js | d7f2b55035c0d345 | batches carry the vertex count across, their u, and each row's s (for the lines) |
| app/preview/trackmodel.js | efcb4cdd59fc62e8 | `bounds` per update; `ghostFor(candidate)` built on COPIES of the live path and mesh |
| app/preview/preview.js | 54239d7211e1176a | `showGhost` / `clearGhost`; grid and marker in the frame; `markerSize` grows with camera distance |
| app/preview/index.js | 06de35548f5ea5db | the `t180-ghost` / `t180-ghost-clear` events |
| app/camera/cameras.js | 7487456df2b127d2 | overhead FITS THE WHOLE TRACK when given bounds and an aspect (`fitOverhead`); without them, the old head-centred pose |
| app/camera/math.js | dd9fffcfcece2108 | `viewProj(pose, aspect)`, shared by the renderer, the probe and the tests (far plane follows the pose) |
| app/testhook/ghostword.js (**new**) | 4acbb56da9662dc9 | a candidate for a built-in word, as `shell.place()` builds it (tests and the fallback path) |
| app/testhook/probe.js | 628c83f70a726338 | + ghost count, grid lines, bounds |
| scripts/prove_render.js | beace3f992455d16 | the D170 captures; pointer moved off the palette after each click; ghost by real palette hover; `--shim-timers` (§4) |
| app/test/look.test.js (**new**) | 9ffca5af8857628f | 16 tests |
| app/test/preview.test.js | 2df855cee6123bdb | fake GL gains the new calls; upload counts include the two line arrays per road cell (§5) |
| app/test/render_proof.test.js | 3329aa652a6814a2 | fake GL gains the new calls; the overhead probe test follows the new requirement (§5) |
| app/test/mutation.test.js | 73348d9919c7f8e1 | + B1–B16, a CONTROL run, and all of src/ copied into the temp tree (§6) |
| test/prove_render.test.js | 411829ef6d0fdd62 | `--shim-timers` is opt-in |

## 2 · What changed, per review item
1. **Light and road lines.**
   - **The lighting:** `shade(n)` = 0.20 ambient + 0.72·max(n·key, 0) + 0.22·max(n·fill, 0), two-sided. The key light is low and to the side, so a floor, a bank and a wall of one colour read differently. The GLSL is generated from the same constants, and a test checks the shader carries them.
   - **The lines:** white EDGE lines at the profile's two edge vertices and a CENTRE line at the vertex nearest u = 0, each lifted 3 cm along its normal. A dark TIE crosses the road every 10 m (inferred spacing), so banking and the profile's shape read.
   - **Upload cost:** the lines are memoised per vertex array, so a piece that only moved re-uploads nothing.
2. **The overhead fits the whole track.**
   - It looks straight down over the track box's centre, keeping the growth direction up the screen. The eye rises until the box's 8 corners fit the field of view at the box TOP's depth, with 8% margin. So every vertex is inside the view, whatever the aspect.
   - **The head marker:** a mast, a cross and a square ring in the road plane. It grows with the camera distance (2%, never under 3 m); a vertical mast alone would be a single point from overhead.
6. **The GHOST.**
   - `preview.showGhost(candidate)` / `clearGhost()`. The candidate is the resolved document with the word appended but not committed. The ghost is built exactly as placing builds it (`extendPath` + `extendMesh`), on copies, so the placed track is untouched. It is drawn see-through (cyan, alpha 0.42, no depth write) with its own lines.
   - **Retired automatically** by any change to the placed track. It refuses a candidate that does not extend the placed track.
   - **On an empty track** the ghost's own head drives the camera, so the first word can be previewed too.
7. **A faint ground grid at y = 0.** It covers the track box plus 50 m, at 10 m spacing, widened ×5 until each axis has at most 200 lines. No other environment.

## 3 · The wiring for A, and A has ALREADY wired it
While I worked, A wired the ghost on the page. `app/index.html:107-114`: pointing at a palette piece sends `t180-ghost` with `shell.candidate(name)` (`app/shell.js:125`), and leaving sends `t180-ghost-clear`.

**It works in the real window:** the `build-ghost` capture below was made by hovering the 'jump' button with a real mouse event, and the report records `ghostVia: palette hover (A's app/index.html)`. So no wiring diff is needed. What remains is documenting it in `app/README.md`'s seam section. **Proposed diff (A's file, not applied):**

```diff
@@ ## The seam: what C and E plug into
 - **The camera** reads the head from the path (`path.head` from `src/geom`), not from the shell. The shell holds no
   derived geometry, so the frame is never stored twice.
+- **The ghost of the next piece** (the preview's events, `app/preview/index.js`):
+  - `t180-ghost` `{ detail: { candidate } }` shows it. `candidate` is `shell.candidate(name)`: the document with the piece
+    appended exactly as `place(name)` would, NOT committed. The preview builds it on copies of the live track, so what
+    is ghosted is exactly what a click places. `{ detail: { word } }` also works for a built-in word.
+  - `t180-ghost-clear` hides it. Any change to the placed track also retires it.
+  - The page sends the first when the pointer is on a palette piece and the second when it leaves; a click places as
+    before (`index.html` "THE GHOST").
+- **The preview's other events:** `t180-camera` `{ detail: { mode } }` asks for a camera; `t180-camera-mode` says which
+  one is on; `t180-probe` `{ detail: { reply } }` answers read-only numbers for the window proof.
```

## 4 · Blocking bug in A's in-progress D169 shell (sent to A on the board), and the disclosed shim
- **The bug.** `app/shell.js:31` defaults `timers = { setTimeout, clearTimeout }`, and `:59` calls `timers.setTimeout(...)`. A browser rejects that call ("Illegal invocation", because the method is called on another object), so **every `place()` in the real window threw inside `set()`**. No word could be placed.
  - Seen through the DevTools protocol: `Runtime.exceptionThrown` at `app/shell.js` line 62 col 94, with the stack `set ← commit ← place ← palette.js:66`.
  - Node doesn't mind, so A's headless tests pass.
  - The fix, sent to A: wrap them, e.g. `{ setTimeout: (f, ms) => setTimeout(f, ms), clearTimeout: (t) => clearTimeout(t) }`.
- **The shim.** To take the captures without editing A's file, `prove_render.js --shim-timers` installs `this`-independent wrappers for `window.setTimeout` / `clearTimeout` before the page's scripts run (`Page.addScriptToEvaluateOnNewDocument` + reload). **Every D170 capture below was made with it**: `prove_render.json` records `shimTimers: true`. It is opt-in, and nothing else is changed.
- **A side effect on the keeper's machine.** With the shim in place, A's autosave worked. My proof runs therefore left **`%APPDATA%\com.solariz3d.t180-track-builder\autosave.t180auto`** (1,551 B, last written 16:11:32 local), holding the 5-word test track. The next launch shows "A track from your last session was not saved: 5 words. Restore it / Discard it". **I did not delete it** (a user-data folder). "Discard it" clears it, or I can remove it on the keeper's word.

## 5 · Tests
- **`node --test app/test/look.test.js app/test/camera.test.js app/test/preview.test.js app/test/render_proof.test.js test/prove_render.test.js` → 54/54.**
- **look.test.js (16), as the packet asked:**
  - **the lighting term on known normals:** the floor gets exactly ambient + key·key.y + fill·fill.y; floor vs wall and a bank toward vs away from the key differ by ≥ 0.15; it is two-sided and stays within [ambient, 1]; the shader carries look.js's constants;
  - **the edge lines at the profile edges:** the edge lines run through k = 0 and k = K−1 (the profile's own edge u), the centre line through the vertex nearest u = 0, lifted 3 cm; in world space the edge vertex lies within 1e-4 m of the geometry's surface; a tie at least every 10 m; none on seams;
  - **the overhead fit contains every vertex:** at aspect 1.7 and 0.6, every vertex of a 12-word track (> 10,000) projects inside |NDC| ≤ 1, in front of the camera, before the far plane; the world box contains every vertex; the fit is not wastefully loose (worst > 0.6); the head is in frame;
  - **the ghost:**
    - it is shown and cleared;
    - placing the word retires it;
    - the ghost equals the placed geometry for the same word, array for array (exact);
    - the live batches stay the same objects and unmoved;
    - a non-extension is refused;
    - an empty-track ghost has a head;
    - **through A's real `shell.place()`**, with a non-default font (half-pipe on a 'turn', whose own font is bowl), the candidate equals the placed track;
  - **the grid sits at y = 0:** every vertex, covering the box, 10 m spacing, and a 14 km box stays ≤ 402 lines;
  - **the frame:** exactly grid + marker + 2 per road cell line draws;
  - **the head marker:** 3 m up close, 40 m at 2 km, the ring in the road plane around the head, a 10 m mast by default.
- **Requirements that changed, stated, not weakened:**
  - `render_proof.test.js` "in overhead the head is straight below" became "in overhead (fit to the whole track) the head is in frame". Item 2 changed the requirement; the strict containment test is new in look.test.js.
  - `preview.test.js` upload counts: 3 arrays per batch became 3 + 2 per road cell (the new line arrays). The claim ("each array is uploaded once; a sculpt uploads only the new arrays") is unchanged.
  - Both fake GLs gained the new calls.
- **Tests I first wrote too weak, and tightened because a mutant exposed them or a check showed it:**
  - The shell-ghost test first used font bowl, which is the turn's own font, so mutant B12 survived. It now uses half-pipe.
  - The line-draw count was ≥ and is now exact.
  - The ghost comparisons used `deepEqual` on large arrays: on a failure it spent 124 s printing the diff and reported only a file-level failure. It is now a first-mismatch comparator.
- **Whole suite** (`node --test`, 22:15:25–22:18:54Z): **655 tests, 648 pass, 1 fail, 6 todo.**
  - The failure is `test/join.test.js:83` (B's), "a font change in the document reaches the geometry … after a jump the road starts on its own font".
  - It comes from A's in-progress `src/doc/resolve.js` (modified 16:12:54 local, the jump-landing work). `git diff --stat HEAD -- src/geom` is empty: **not this packet.** Also failing alone: `node --test test/join.test.js` → 5 pass, 1 fail.
  - The 6 todos are the round-trip reader rows.

## 6 · Mutations (`checked: node --test app/test/mutation.test.js` → 39 tests, 39 pass)
- **A CONTROL comes first:** the unmutated temp copy must pass every test. It found a real hole in the harness mid-lap. A's `src/doc/resolve.js` began requiring `src/validate`, the temp copy held only src/geom and src/doc, and so every test loading the model failed, which would have made every mutant look "caught". The harness now copies all of src/, and the control passes.
- **38 mutants: all APPLIED and CAUGHT; NOT APPLIED: none; NOT CAUGHT: none.**
  - A1–A22 (D168–D169) are still caught.
  - **New this lap:**

| mutant | caught by |
|---|---|
| B1 no key light | light: a floor and a vertical wall … |
| B2 one-sided light | light: two-sided |
| B3 the shader's key strength drifts from look.js | light: the fragment shader carries … |
| B4 the edge lines one vertex in | edge lines: through the two edge vertices |
| B5 the lines not lifted | edge lines: through the two edge vertices |
| B6 no ties | edge lines: a tie across the road |
| B7 the fit ignores the aspect | overhead fit (aspect 0.6) |
| B8 the fit measured from the box bottom | overhead fit |
| B9 the world box from one corner | overhead fit |
| B10 the ghost built on the live path | ghost: the ghost of a segment tail |
| B11 placing does not retire the ghost | preview: showGhost draws the ghost |
| B12 the candidate ignores the font picker | ghost through A's real shell (after the fix above) |
| B13 the grid above y = 0 | grid: every vertex at y = 0 |
| B14 the ghost never drawn | preview: showGhost draws the ghost |
| B15 the marker never drawn | preview: a frame draws the grid and the head marker |
| B16 the marker does not grow with distance | head marker: it grows … |

## 7 · Proof screenshots: PrintWindow of the app's own window only, outside both repos

**Folder:** `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\scratchpad\d170c\`. The run's record is `prove_render.json` there.

**The run:** `node scripts/prove_render.js --exe src-tauri/target/debug/t180-track-builder.exe --out <that folder> --port 9354 --timeout 600 --shim-timers`, 22:13:24–22:13:57Z. `ok: true`, `shimTimers: true`, the app PID killed at the end, and `Get-Process t180-track-builder` → 0 running.

**Placed through A's palette (real clicks):** straight, sweep, turn (half-pipe), wall-ride, jump.

**Every capture is the app window:** the title is checked, and I opened each. Anything else would have been deleted; nothing was.

| file | what it shows | checks |
|---|---|---|
| `window-wallride-lit.png` | **The wall-ride, lit.** Purple floor; the wall rising on the right shades light to dark across its curve. A white centre line and a white rim edge line; the ground grid under it; the orange head marker (mast, cross and ring); the far straight on the horizon with dark ties. No ghost (ghost = 0). | 45.3% drawn; head at NDC (0, −0.321); view·T 0.9806 |
| `window-build-ghost.png` | **The build view with a ghost.** The same view, plus the ghost of 'jump' ahead of the head: a see-through cyan piece with its own lines, shown **by hovering A's 'jump' button** (the button shows hovered). | ghost shown: 1 batch; 50.3% drawn |
| `window-after-jump.png` | **After a jump.** The green landing (A's jump now carries one) is lit, with its walls shaded, a dark tie across and the rim edge line. The head is on the road, with no ghost. E's panel reads "1 red · 1 jump: landing-misses-zone". | 45.0% drawn; head at NDC (0, −0.321) |
| `window-overhead.png` | **The overhead of the WHOLE track.** The start straight at the top right, the long sweep, the half-pipe turn, the wall-ride U-turn at the bottom left and the jump, all on the grid. The head is marked by the orange ring and cross at the end. | 33.9% drawn; head at NDC (−0.746, −0.420) |
| `window-build.png`, `window-chase.png`, `window-free.png` | the build, chase and free views at the end (free takes over the chase view) | all pass |

- **Real-window DPR** (emulated 1.5): 1230×1032 backing for 820×688 css. Ctrl+C left the camera on build.
- **Earlier, superseded capture sets** (`d170\`, `d170b\`, app window only): the pointer was left on the palette after a click, so A's hover ghost of the last-clicked word polluted `wallride-lit` and `after-jump`. I found it by diffing pixels between two captures of the same view (31,916 sampled pixels differed), and fixed the driver to move the pointer off the palette. **Use `d170c\`.**

## 8 · NOT verified
- **A real, unshimmed window:** every capture used `--shim-timers` until A fixes `shell.js:31/59`.
- **The shader's lighting LOGIC is not unit-tested,** only its constants. The GLSL mirrors `shade()` line by line, and the captures show the shading.
- **The preview's wiring of `markerSize` into the frame is not asserted** (the formula is; mutant B16).
- **Ghost performance on long tracks:** each hover builds the new piece on copies; each copy clones the path's sample array, O(track samples) per hover (inferred, not measured).
- **The ghost of a word whose placement changes an EARLIER segment** (if resolve ever does that) is refused with a clear error, not shown. Not seen with today's words.
- **Colour-blind or contrast checks** of the ghost and line colours.
- **The grid under a track far below y = 0** (it stays at y = 0 by design).

## 9 · CHANGELOG addition, for B to carry (under Added)

```
- The preview reads as a track: lit surfaces (a key light low and to the side, so floors, banks and walls differ),
  white edge and centre lines and a tie across the road every 10 m, a faint ground grid at height 0, and a marker at
  the build head that stays readable from any distance.
- The overhead camera frames the whole track.
- A ghost of the next piece: point at a word in the palette and see it, see-through, at the head, exactly as a click
  will place it.
```

NEXT: librarian call_librarian with the pointer (done on writing). Plan default: A fixes the timers bug, B reads D169+D170 combined, and it lands.
