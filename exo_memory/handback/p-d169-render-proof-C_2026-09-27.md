# D169, packet C: the rendering, proven in the REAL app window

Pane C, 2026-09-27. Repo `C:\Users\nname\Desktop\t180-track-builder` (base f0b0d75), uncommitted.

**A's files were not edited** (app/index.html, app/shell.js, app/lib/cjs.js, src-tauri/). No AC launches.

## 1 · Files (`checked: sha256sum … | cut -c1-16,65-`)

| file | sha256 (first 16) | what |
|---|---|---|
| app/preview/preview.js | 9d735492a0fe3dd6 | DPR-sized backing store (`backingSize`), `keyAction(key, mods)` ignores Ctrl/Alt/Meta, `view()` |
| app/preview/index.js | 1310325a3784df9c | `PreviewMountError`; the reason is left visible in the panel; answers `t180-probe` |
| app/testhook/probe.js (**new**) | 55730de92addb0d3 | read-only probe: mode, head, head in NDC, view·T, canvas size and DPR |
| scripts/prove_render.js (**new**) | 85204ee0eab77389 | drives the real window over WebView2's DevTools port; plan, judge, hard timeout |
| scripts/prove_render.ps1 (**new**) | 7902a2a2da1f6077 | PrintWindow of the app's own window only, plus a drawn-pixel count in the preview's rectangle |
| app/test/render_proof.test.js (**new**) | f4f475c3e648de6b | 8 tests (DPR, keys, mount error, probe) |
| test/prove_render.test.js (**new**) | 64df04de8602d771 | 6 tests (the driver's arguments, plan, view keys, judge) |
| app/test/mutation.test.js | 50dea01d9ab3ea79 | + A15–A22; also runs the two new test files |

`git diff --stat f0b0d75` over the three changed files → 71 insertions, 15 deletions.

## 2 · How the window was driven (no line in A's page)
- **The binary.** `cargo build` in src-tauri: `Finished dev profile … in 43.48s`, `target/debug/t180-track-builder.exe` 13,240,320 B, with build.rs copying the current app/ and src/ into dist (`cmp app/preview/preview.js src-tauri/dist/app/preview/preview.js` → identical). target/ and dist/ are gitignored.
- **The launch and control.** The app was started by `scripts/prove_render.js` with `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=<port>` in its environment. WebView2 reads that variable, so no code in the app changes to allow it. The script then speaks the DevTools protocol through Node's own WebSocket (no dependency).
  - **Words** were placed by real mouse events (`Input.dispatchMouseEvent`) at the centres of **A's palette buttons**. The Font was set on the palette's own `<select>` (value plus a change event; a native dropdown can't be clicked open over CDP).
  - **Camera keys** were real key events (`Input.dispatchKeyEvent`), so they go through the preview's own key handler.
- **Safety.**
  - Each run had a hard timeout of 600 s. At the end the script kills only the PID it started (`taskkill /PID <pid> /T /F`).
  - `Get-Process t180-track-builder` afterwards → **0 running**, after each of the 3 runs.
  - Each run took 15–20 s (the last one 21:25:08–21:25:28Z).
- **The sequence placed:** straight, sweep, turn with Font = half-pipe, wall-ride, jump. The palette's track list read `w1 straight`, `w2 sweep`, `w3 turn`, `w4 wall-ride`, `w5 jump`.

## 3 · Screenshots: PrintWindow of the app's own window (PW_RENDERFULLCONTENT), OUTSIDE both repos

Folder: `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\scratchpad\d169\`, with the run's full record in `prove_render.json`.

**How the capture is kept honest.**
- `prove_render.ps1` finds the visible top-level window of THE PID it is given, refuses a minimised one, and asks that window to render itself. **It never reads screen pixels.**
- The driver also rejects any capture whose window title is not "T-180 Track Builder", deleting the file at once. That never happened.
- I opened every image. **Each is the app window**: title bar "T-180 Track Builder", A's palette, E's panels, and my camera buttons. Nothing else is in any of them.

| file | view | what it shows | checks (all PASS) |
|---|---|---|---|
| `window-build-before-jump.png` | build, right after the wall-ride | the purple wall-ride road running ahead to the open end, its wall rising on the right (the outside of the left turn), and the earlier track as a tan sliver on the horizon | track visible 37.1% of the preview; head at NDC (0.000, −0.321); view·T = 0.9806 |
| `window-build.png` | build, after the jump | **little road:** after a jump the head is at the end of the flight, in the air over no surface. A thin tan sliver only | track visible 1.9% (passes the 1% bar); head at NDC (0.000, −0.321); view·T = 0.9806 |
| `window-overhead.png` | overhead | the wall-ride curve from above in purple, and the head at the exact centre over empty space (the jump's flight has no surface) | 9.3%; head at NDC (0.000, 0.000) |
| `window-chase.png` | chase | the wall-ride's surface close up from 25 m behind the head, with the tan earlier track beyond | 41.6%; head at NDC (0.000, −0.068) |
| `window-free.png` | free | the same picture as chase: free takes over the view it was entered from, as designed | 41.6%; head at NDC (0.000, −0.068) |

- **Why the build view's numbers repeat:** the build camera is rigid in the head's own frame, 15 m back and 6 m up, looking 15 m ahead. So the head always lands at the same screen point (NDC y −0.321), and view·T is always 0.9806.
- **How "track visible" is measured:** pixels differing from the preview's clear colour (18, 20, 26) by more than 12, sampled every 2 px inside the canvas rectangle.

## 4 · The packet's items
1. **A real sequence placed in the window:** done, §2.
2. **Captured with PrintWindow; build, overhead, chase and free:** done, §3. The track is visible in every view, the build view looks along growth (0.98), and the head is in frame in every view.
3. **devicePixelRatio:**
   - `backingSize` gives round(css × dpr) per side; a missing or nonsense DPR counts as 1, and a side is capped at 8192 with the aspect kept. The frame loop resizes when either the DPR or the css size changes (headless, against the real `createPreview` loop).
   - **In the real window**, CDP `Emulation.setDeviceMetricsOverride` with deviceScaleFactor 1.5 gave a canvas of **1208×1182 for 805×788 css at DPR 1.5**, and 805×788 at DPR 1 after clearing it.
4. **Ctrl-modified keys:**
   - `keyAction` returns null with Ctrl, Alt or Meta, while Shift+C is still C. In the frame loop, Ctrl+C and Meta+B leave the mode alone and plain C moves it.
   - **In the real window**, a Ctrl+C key event (modifiers 2) left the camera on `build` → `build`.
5. **A failed mount:** throws `PreviewMountError` ("The preview could not start: preview: WebGL is not available in this window") and leaves that sentence in the panel with role=alert. A's page shows nothing of its own for the preview, so the panel's own text is what the user sees today.
   - **For A's display half, one line:** `app/index.html:122` (as of this writing; `grep -n "not plugged in yet" app/index.html`), where the loader's catch sits, can show `e.message` for the preview too (it is already the full sentence):
     ```diff
     -      if (id !== 'preview') root.replaceChildren(Object.assign(document.createElement('p'), { className: 'empty', textContent: `app/${dir} is not plugged in yet (${e.message}).` }));
     +      if (e && e.name === 'PreviewMountError') { /* the panel already shows the reason */ }
     +      else if (id !== 'preview') root.replaceChildren(Object.assign(document.createElement('p'), { className: 'empty', textContent: `app/${dir} is not plugged in yet (${e.message}).` }));
     +      else root.replaceChildren(Object.assign(document.createElement('p'), { className: 'empty', textContent: `The preview is not plugged in yet (${e.message}).` }));
     ```
     Not applied (A's file).

## 5 · Tests
- **Red first:** `render_proof.test.js` failed before the code (the module did not exist). The rest was written against the stated behaviour in each header.
- **Headless:** `node --test app/test/render_proof.test.js app/test/camera.test.js app/test/preview.test.js test/prove_render.test.js` → **38/38**. That is render_proof 8, camera 14, preview 10 and prove_render 6.
- **Whole suite, reported as it came out:**
  - Run 1 (21:25:38–21:27:25Z): 560 tests, 548 pass, **6 fail**, all in `app/test/validate-ui-panel.test.js` (E's). That file was rewritten at 15:25:57 local, inside the run, and imports none of my files.
  - Run 2 (21:27:38–21:29:48Z): **561 tests, 554 pass, 1 fail, 6 todo.** The failure is `test/validate_bounds.test.js` (E's) at FILE level, with no subtest named ('test failed' after 9.3 s). Alone right after, it passed **14/14 twice**. It requires src/doc, src/validate and src/geom only, nothing I changed this lap.
  - **It is intermittent under load and not caused by this packet. I have not seen a fully green whole-suite run since D168.** Its six todos are the round-trip reader findings.

## 6 · Mutations (`checked: node --test app/test/mutation.test.js` → 22 tests, 22 pass: every mutant APPLIED and CAUGHT)
- **A1–A14 (D168):** all still caught.
- **New this lap:**

| mutant | caught by |
|---|---|
| A15 the backing store ignores DPR | DPR: the backing store is the css size × DPR |
| A16 the size cap drops the aspect | DPR edges |
| A17 Ctrl/Alt/Meta ignored by keyAction | keys: Ctrl, Alt or Meta |
| A18 the frame loop passes no modifiers | keys in the frame loop |
| A19 a failed mount is swallowed | mount failure |
| A20 the probe skips the perspective divide | probe: the head lands in the middle |
| A21 the judge accepts a view with nothing drawn | judge: each failure |
| A22 the judge never checks DPR | judge: each failure |

## 7 · NOT verified
- **A real display at DPR ≠ 1.** This machine's window ran at DPR 1; 1.5 was emulated through CDP inside the real WebView2, and that emulation changes the page's `devicePixelRatio` the same way a scaled monitor would. Moving a real window between monitors was not done.
- **Mouse-drag look and held-key flying in free mode:** not driven. Free was entered by key and captured.
- **A human's keyboard focus:** keys were delivered by CDP to the page. Whether the window holds focus for real typing is untested.
- **`cargo tauri dev` itself:** the debug binary was run directly, the same thing tauri dev runs when there is no devUrl, as B noted.
- **The installer build.**
- **The ps1 capture script has no unit test.** It needs a real window; its evidence is the five captures above.
- **For E, seen in the captures:** the validation panel reads "0 jumps" with a jump placed (w5). The jump may be pending because no landing is placed yet (E's own test says "the jump is pending, not failed"). I have not checked which.

## 8 · CHANGELOG addition, for B to carry

```
### Added
- A window proof (scripts/prove_render.js + .ps1): starts the built app, places a real track through the palette,
  and captures the app's own window (PrintWindow, never the screen) in the build, overhead, chase and free views,
  checking that the track is drawn, the build view looks along the growth direction and the head is in frame.
### Fixed
- The preview canvas follows devicePixelRatio (sharp on scaled displays) and resizes with it.
- Ctrl, Alt and Meta shortcuts no longer switch the camera (Ctrl+C is copy).
- A preview that cannot start says why, in the panel and as a PreviewMountError for the page.
```

NEXT: librarian call_librarian with the pointer (done on writing). Plan default: B reads D169 and it lands.
