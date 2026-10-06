# D251: handle precision (the keeper, 11:28: "the colored drags on the track need to have slightly more precise scrubbing, cant get to 0 precise") — seat A (Sonnet 5.5), 2026-10-06

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_handle_precision_2026-10-06.md · worktree `C:\Users\nname\Desktop\worktrees\a-precision-wt`, branch `precision-a-d251`, commit `63c3ccf` on main `eeec787` (local, nothing pushed, no AC; FEEL tier: no harness run) · evidence `exo_memory/handback/p-precision-A_2026-10-06_evidence/` (`red_on_eeec787.txt`, `green_on_precision.txt`, `window/window_report.json`, five screenshots, `precision_window.js`, `sp_build.js`, `sp_win.js`)

## What changed (5 files: `app/core/handles.js`, the two test files, `CHANGELOG.md`, `app/README.md`; `src/`, `app/core/panel.js` and the fields are untouched)
1. **Speed per screen pixel.** `dragPixels` (was `dragMetres`) projects the pointer's travel on the handle's own on-screen arrow, in px; `KINDS[kind].perPx` (was `rate`): turn and climb 0.05, bank and cup 0.2°, width 0.1 m, length 0.5 m (the plan's starting rates, unchanged); Shift is a tenth. Edge-on (axis shorter than 0.05 px a metre) the pointer's own motion stands in, as before, now in px.
2. **Detent.** `targetFor(kind, base, px, ctx, mods)` holds for `DETENT_PX = 6` px of travel at the starting value and, for bank, turn and climb (`zero: true`), at 0. Ctrl (snap to 5, 10 m, 5 m) is not held.
3. **Rounding to the step (0.1) with Shift too** (was 0.01), then clamp.
4. **Double-click** (capture phase, like the press): `resetValue(kind, pre)`: 0 for bank, turn, climb; for length, width, cup the value before the last drag that moved it, **kept only while the field still reads what that drag set**: a value typed since is never "put back" to a stale one. It goes through `host.begin/apply/end` once, so the panel's own path (typing into the field and firing its handler) is used.
5. **Label.** While dragging it is `drag.value`, the value that was set (it always was; now that value is the held/rounded one). While hovering it adds what a double-click would set: `turn 2.0°/100 m · double-click: 0`, `length 180.0 m · double-click: 160.0`.

## The rows: red on `eeec787` first, then green (one row per item; the failing text is in `red_on_eeec787.txt`)
| item | row | red on eeec787 (the failing line) | green |
|---|---|---|---|
| 1 pixel speed, any zoom | `handles` 8, 4, 3, 5; `core-pieces-ui` 11 | row 8: `20 px: turn 0.05 a pixel…` got `[4, 38.4, 165.9]`, expected `[1, 33, 170]` (the old code gave 4.0 on the near camera: zoom-dependent); row 11: length 40 px gave 200, expected 120 | `[1, 33, 170]` on the near AND a far camera (2.5 against 1.3 px a metre; control row asserts the zoom really differs) |
| 2 detent at 0 and at the start | `handles` 9 | `36 px down from 2 … exactly 0, not -5.2` | held: 36 px from 2 gives exactly 0 (`Object.is`), 3 px wobble keeps 2, 8 px moves (1.6), length holds 5 px, bank from 5: 22 px gives 0, 35 px gives -2, Ctrl snaps instead |
| 3 round to the step with Shift | `handles` 10 | `a slow drag to nothing is exactly 0, not -5.96` | Shift 397 px from 2 gives exactly 0; 103.7 px fine gives 1.5 (not 1.48); 5.6 px fine holds at 0 (never 0.03); width 77 px fine gives 31.8 |
| 4 double-click | `handles` 11 | `taken by the handle` false (no listener) | turn and bank to 0 in one begin/apply/end; length, width back to before the LAST drag; a typed value is left alone; a double-click off every handle is nobody's |
| label shows the value it sets | `handles` 12 | hover label `turn 2.0°/100 m` without the double-click hint | hover and drag texts as above, drag text equals the applied value (0.0) |

`core-pieces-ui` row 11 and 11b are red on the base with my updated `dragBy` (now px); the rest of that file and `handles` rows 1, 1b, 2, 6, 7b are the same on both. **Spec-change note, so no one reads it as weakening:** rows 3, 4, 5, 7 of `handles.test.js` and `dragBy` calls in `core-pieces-ui.test.js` pinned the OLD metre-based speed, which the keeper asked to replace; I restated the same checks in pixels (same structure, same kinds, e.g. 20 m of length is now 40 px at 0.5, "120" still asserted) rather than deleting any. Green: `handles` 14/14, `core-pieces-ui` 23/23; with `core-sculpt`, `jump-ui`, `shell-ghost`, `core-readout-display`, `layout-css`, `redgroups`: **108 of 108**, `node --test --test-concurrency=1`, run directly (no harness).

## The real window (the keeper's own check: turn from 2 to EXACTLY 0, with and without Shift)
Our debug build of `precision-a-d251` (`cargo tauri build --debug --no-bundle`, own target dir), real mouse through CDP `Input.dispatchMouseEvent`, `T180_TEST_APP_DATA` its own folder, own WebView2 profile and DevTools port. `window_report.json`: **0 page errors, 0 console errors, the keeper's 10 app-data files unchanged (`keeperChanged: []`), no document edit** (the track's info line before and after the drags is the same).

Field text after each drag, from 2 (`pxPerM` 6.07 on screen at that camera, so by the OLD per-metre rule the same 40 px would have been 6.6 m and 3.3 degrees: it could not land on 0):
- **No Shift:** −40 px `0`, −37 px `0` (0.15 short, inside the hold), −43 px `0` (0.15 past, inside the hold); −30 px `0.5` (out of the hold: moves).
- **Shift:** one −400 px drag `0`; one −397 px drag `0`; two −200 px drags (2 → 1 → 0) `0`; −103.7 px `1.5`. The held label during a drag read `turn 0.0°/100 m` (`3_dragging_turn.png`), field `0`.
- **Zoom** (mouse wheel out, 29.65 → 11.15 px a metre on the width arrow): the same 20 px: turn `1`, width (inward) `29`, length `110` in BOTH views.
- **Double-click** in the window: turn 2 → `0`, bank 6 → `0`, length 100 → drag to 120 → `100`, width 31 → drag in to 26 → `31`, cup 8 → drag to 16 → `8`.

## Things to decide or tune by hand (I can't feel the drag; I only read what it lands on)
- **The rates are the plan's starting rates and were NOT tuned.** In numbers: turn 20 px is 1°/100 m (a 4° turn is 80 px), length 40 px is 20 m (a 300 m change is 600 px: slow for big length changes, where Ctrl snaps or typing is the way; the plan said "tune in the window", the call is the keeper's hand). Bank no longer scales with the road's width (0.2° a pixel on any road); before, a wide road felt slow and a narrow one fast.
- **Leaving a hold jumps once**: the value goes from the held one to the raw one, up to 6 px of travel at once (turn 0.3°, bank 1.2°, length 3 m); Shift makes it a tenth. A smoother exit (subtract the hold) is easy but changes the "6 px of hold" meaning, so I left the plain snap.
- **Climb's rate, the Sculpt drags and the Sculpt double-click** share the same code but I did not drive them in the window; Sculpt's `begin/apply` takes the value as a delta from the piece's current one, so a double-click to 0 there sets the piece's bank/width channel offset to `-base` through the same guard (it refuses by name if the centreline would move). Only the stub-host rows cover that; I ran no Sculpt reset in the window.
- **Guard relaxed in my own window script**: the keeper's installed app (`T-180 Track Builder`, pid 21204, started 11:37) was open, and my script refused to run while ANY `t180-track-builder.exe` ran. It now refuses only when a copy of the exe under test runs (the run's own app data, profile and DevTools port are what keep it apart; the before/after snapshot of the keeper's folder is the proof: unchanged). I did not touch his process.

## What it does NOT establish
Ctrl-snap and the hold in the window (rows only), climb in the window, a touch screen, a real AC install, the full suite and the harnesses (not run, per the rule; the mutation harnesses anchor on `panel.js`, `coreshell.js` and `preview.js` lines, none of which I edited).

## Corrections (mine)
- My first zoom check used the Overhead camera: its guide card covers the far-end turn mark, so the press landed on the card (turn read 0, a wrong test, not a wrong fix); redone with the mouse wheel in the Build view. My first width reset dragged the mark outward off the preview's right edge, so the double-click had nothing to hit; redone dragging inward.
- A `Co-Authored-By` trailer names the model, not the thread, as `BOOT`'s commit rule says; the body says seat A wrote it.

NEXT: librarian — the plan's default stands: a quick non-author look (B or E: `handles.test.js` rows 8 to 12 and the diff of `app/core/handles.js`), land `precision-a-d251` (63c3ccf), install, unless this output says otherwise
