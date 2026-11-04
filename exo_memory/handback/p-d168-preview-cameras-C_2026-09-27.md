# D168, packet C: the WebGL preview and the cameras (app/preview, app/camera)

Pane C, 2026-09-27. Repo `C:\Users\nname\Desktop\t180-track-builder`, uncommitted.

**Written ONLY under app/camera/, app/preview/ and app/test/{camera,preview,mutation}.test.js.** src/ and test/ were not touched after the blend hand-back (p-d167-blend-C, "src/ handed to B"). A's files (app/index.html, app/shell.js, app/lib/cjs.js, src-tauri/) were read, not edited.

## 1 · Files (`checked: sha256sum … | cut -c1-16,65-`; 887 lines in all, `wc -l`)

| file | sha256 (first 16) | what |
|---|---|---|
| app/camera/cameras.js | fad01712d979cc9a | the five modes, the rig, the keys, the easing; pure, no DOM, no GL |
| app/camera/math.js | 520624973f942171 | column-major perspective / lookAt / mul (after blackbox ui/mathutil.js) |
| app/camera/index.js | 9f364f565e1c7cea | the camera panel: `mount(root)`, mode buttons, key legend |
| app/preview/batches.js | 3f1cce773219337a | a src/geom mesh → draw batches (the geometry's own arrays, never copied) |
| app/preview/trackmodel.js | ec4b8785c45c4fe5 | resolved document → path + mesh, incrementally, in the UI process |
| app/preview/renderer.js | 4678b39d6d13e88b | WebGL: one lit two-sided shader with fog; GPU buffers keyed by array object |
| app/preview/preview.js | 0ae7abfd7c9ae7ee | the DOM glue: frame loop, keys, free-fly, `keyAction` (tested headless) |
| app/preview/index.js | 86b7c086cdd63549 | the preview panel: `mount(root, shell)`, per app/README.md "The seam" |
| app/preview/smoke.html | afd75a81c1088d94 | a browser smoke page (§4) |
| app/test/camera.test.js | fcde6d0a7d4fd2a7 | 14 tests |
| app/test/preview.test.js | c0de475c2b905183 | 10 tests |
| app/test/mutation.test.js | 3a6b53f43c4d041d | 14 mutants |

## 2 · What it does
- **Build view (the default).** It is src/geom's own `headCamera`: 15 m behind the head along T, 6 m up along U, looking along the growth direction, with up = U so it banks with the road. It follows the head.
- **The other modes:**
  - **overhead:** 80 m straight up, with the growth direction up the screen. Inside a loop, where T is vertical, it uses L × up, which stays level and keeps the loop's heading.
  - **side:** level with the head, 40 m off its right, looking at it.
  - **chase:** rides the road 25 m behind the head, 3 m along the road's own up, so it stays on the drivable side through a loop-the-loop.
  - **free:** takes over the view on screen, then flies with W/S, A/D and Q/E, turns with the arrows or a drag, Shift for speed, and does NOT follow the head.
- **Keys.** **C** cycles build → overhead → side → chase → free → build. **B** is the build view in one key from every mode. Keys typed into an input are ignored.
- **Easing.** The shown pose eases toward the exact pose (rate 8/s), so a mode switch or an append never snaps. Free is flown directly.
- **The track model.** It picks the least work the geometry allows: `extend` for an append, `sculpt` for an edit, `full` for a removal, a closed loop or the first build, and `same` when nothing changed. A document that fails to resolve keeps the last good track, marked stale. **The geometry runs in the UI process; no mesh data crosses IPC** (ARCHITECTURE §9).
- **The renderer** uploads each array once; arrays are keyed by object. Because the geometry returns the same arrays for pieces it only moved, a sculpt re-uploads only the edited piece's cells and its seams, and stale buffers are deleted after the frame.
  - **Colour:** one colour per placed word (ARCHITECTURE §4); seams are darker.
  - **Scope, v1:** the track only. There is no sky, texture or sampler in the shaders, and a test checks that.
- **The seam with A's page.** `app/preview/index.js` and `app/camera/index.js` export `mount(root, shell)` as app/README.md asks. The two panels are loaded by separate `loadCjs` calls, each with its own module cache, so they talk through two DOM events: `t180-camera` (ask for a mode) and `t180-camera-mode` (the preview announces it).

## 3 · Tests (headless; `node --test app/test/camera.test.js app/test/preview.test.js` → 24/24)
- **camera (14):**
  - each mode's pose from real head frames, including a banked, climbing, turning head;
  - overhead inside a loop, with the loop heading 0.7 rad off +z;
  - chase all the way round a loop-the-loop;
  - chase on a track shorter than its lag;
  - the switch order;
  - the build key reaching build in ONE press from every mode;
  - other keys doing nothing;
  - after `extendPath`, every follow mode equals the new head's pose while free stays put;
  - entering free keeps the view, flying works only in free mode, and pitch is clamped at ±89°;
  - easing: no snap, and convergence;
  - bad input refused.
- **preview (10):**
  - the node matrix read column-major (as GL reads it) puts every sampled vertex within 1e-4 m of the geometry's float64 surface (worst measured under that, over > 50 vertices);
  - one colour per word, seams darker;
  - the track model after append / edit / removal / no change equals a full build;
  - a document that does not resolve keeps the last track;
  - **through A's real shell**, placing words grows the preview by `extend`;
  - the renderer against a recording fake GL: each array uploaded once, nothing re-uploaded on redraw, after a sculpt only the edited piece and its seams re-uploaded (fewer than a third of the batches), and stale buffers deleted;
  - a shader that fails to compile throws with the compiler's log;
  - the key map;
  - no environment in the shaders.
- **Two tolerances set after seeing data, declared:**
  - The track-model comparison is not exact: names and indices are equal, matrices within 1e-9, positions within 1e-5 m. A piece a sculpt only MOVED keeps local arrays made at its old placement, and they agree with a fresh build to round-off (measured 1.7e-14 m). The geometry's own sculpt tests use the same 1e-5 m.
  - The matrix check runs with `rampM: 0`, because it tests the matrix convention and not the ramp.
- **My own test errors, caught and fixed:**
  - the reference sample at a join (two samples share s there, with different frames);
  - an inline comment that swallowed half a line.
- **The whole suite:** `node --test` (20:55:52–20:59:05Z) → **498 tests, 492 pass, 0 fail, 6 todo** (the round-trip reader todos). It includes app/test: `grep -cE` on the named app lines in the run output → 17.

## 4 · Seen running: in a real browser engine, NOT in the app window
- **NOT seen in `cargo tauri dev`.** I did not launch the Tauri app: src-tauri is A's, and a dev build opens a window on the keeper's desktop.
- **Seen in headless Microsoft Edge** (Chromium, the engine WebView2 is built on), driven over the DevTools protocol:
  - `app/preview/smoke.html`, served from the repo root by a 127.0.0.1-only, read-only node server that exits after 120 s;
  - a throwaway Edge profile in my scratchpad; Node 24's built-in WebSocket, no dependency added.
- **What that run showed.** It ran A's shell with an in-memory store and placed straight · turn · straight · turn · straight (5 words, 15 segments). It mounted `app/preview/index.js` exactly as A's page does and read pixels back in every mode. The context was `WebGL 2.0 (OpenGL ES 3.0 Chromium)`.

| mode | non-background pixels of 256,000 |
|---|---|
| build | 80,733 |
| overhead | 17,600 |
| side | 9,575 |
| chase | 109,562 |
| free | 109,562 (free took over the chase view, as designed) |

  **Uploads stayed at 63** (21 batches × 3 arrays) across all five modes, so switching cameras re-uploads nothing.
- **Screenshots looked at, per mode:**
  - build shows the road ahead to the head from behind and above;
  - overhead shows the head mid-screen, the track behind it, growth up the screen;
  - side shows travel running screen-right, the far turn faint in the fog.
  They are in my scratchpad; none were committed.

## 5 · Mutations (`checked: node --test app/test/mutation.test.js` → 14 tests, 14 pass: every mutant APPLIED and CAUGHT)

| mutant | caught by |
|---|---|
| A1 the build view looks backward | build view (default) |
| A2 the build key does nothing from free | the build view is ONE key away |
| A3 the switch key skips a mode | the switch key walks |
| A4 chase ignores its lag | chase: 25 m behind |
| A5 chase lifts along world up, not the road's | chase through a loop-the-loop |
| A6 overhead's loop fallback is a fixed north | overhead: inside a loop |
| A7 free follows the head | after an append |
| A8 entering free does not take over the view | entering free keeps the view |
| A9 the shown pose snaps | the shown pose eases |
| A10 re-upload every frame | renderer: every array is uploaded once |
| A11 stale buffers never deleted | renderer: after a sculpt |
| A12 batches copy the arrays | renderer: after a sculpt |
| A13 the track model never extends | track model: append |
| A14 the model matrix transposed | batches: the node matrix |

**Said plainly:** A6 would have SURVIVED on my first loop fixture, which heads along +z, so a fixed "north" was the right answer there. I saw the gap before running the harness and rotated the fixture's start heading. The harness copies app/camera, app/preview and src/geom to a temp folder, so the originals are never touched.

## 6 · NOT verified
- **The app window** (`cargo tauri dev` / WebView2 inside Tauri), including A's page loading `app/camera/index.js` next to the preview and the two DOM events crossing between them there. The smoke page mounts only the preview.
- **Real GPU vs the headless renderer:** `WebKit WebGL` masks the renderer string, so it may have been SwiftShader (`--enable-unsafe-swiftshader` was passed). No frame times were measured.
- **Mouse drag and held-key flying:** coded in preview.js, not driven in any test (`keyAction` is tested; the loop that applies it is not).
- **Performance on a long track** (a full build of 14 km took 1.7 s in D166; the model rebuilds in full on a removal or undo past the end).
- **Resizing and high-DPI:** the canvas uses clientWidth/clientHeight with no devicePixelRatio scaling, so it will look soft on a scaled display. Named, not fixed.
- **One thing for A:** `app/index.html:123` does not show a preview mount failure (its error text is shown only when `id !== 'preview'`). A broken preview keeps the page's first placeholder, "The preview (app/preview) is not here yet.", which misleads rather than names the error. I did not edit A's page.

## 7 · CHANGELOG addition, for B to carry (under Added)

```
- The 3D preview (app/preview): the track the geometry builds, drawn with WebGL in the app's own process, one colour
  per placed word. Appending and sculpting update it incrementally and re-upload only what changed.
- Cameras (app/camera): the build view (default: behind and above the open end, looking where the track grows),
  overhead, side, chase along the road, and free flight. C switches; B is always the build view.
```

NEXT: librarian call_librarian with the pointer (done on writing). Plan default: B lands the combined tree, then D168 is read and lands.
