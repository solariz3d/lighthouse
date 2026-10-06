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

---

# AMENDMENT (the keeper, 11:29 and 11:30): pointer lock, length 5x, "leave the rest the same". Commit `3e8d64e` on `precision-a-d251` (on `63c3ccf`), local, no push. THIS SECTION SUPERSEDES THE RATES ABOVE (the plan's starting rates are gone).

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_handle_precision_2026-10-06.md (Amendment) · worktree `a-precision-wt` · evidence `p-precision-A_2026-10-06_evidence/` (`amend_red_on_63c3ccf.txt`, `amend_green.txt`, `window_amend/`, `precision_window_amend.js`)

## What changed (`app/core/handles.js`, the two test files, CHANGELOG, README)
- **6. Rates are today's feel, length 5x.** Each kind's OLD per-metre speed divided by the px a metre takes at the default Build camera, MEASURED in the window (a probe run: length 11.78, width 29.61, bank 8.25, cup 8.23, turn 6.05, climb 6.08 px a metre, default width 31): **turn 0.083, climb 0.082, bank 0.45°, cup 0.24°, width 0.068 m a pixel; LENGTH 0.42 m a pixel (5 x 0.085).** A row asserts every rate is within 2% of today's speed over those pixels (length 5x within 2%). Shift a tenth.
- **5. Pointer lock.** A press on a handle calls `requestPointerLock` on the stage; locked, the drag runs on `movementX/Y` added to the click point (`drag.v`), so the cursor stays where it clicked and the drag never stops at the screen edge; release, or Esc (the browser's own unlock), ends it (Esc ends the drag where it is). Refused (error event, rejected promise, a throw) or no `requestPointerLock`: the drag is today's, on the pointer's own position. **The first movement after the lock is dropped**: Chromium reports the jump from the cursor to the lock as it (measured in the window: `(64, -112)` every time, before any real step).
- **Double-click, changed to survive the lock:** the window showed that **no `dblclick` event comes while the pointer is locked** (a press locks, the release unlocks, the browser never sees a click pair). So two presses within 400 ms on one handle, the first having changed nothing, are the double-click (`DOUBLE_MS`, `resetHandle`); the `dblclick` listener stays (it swallows the camera's own and is a no-op after the reset). A press right after a DRAG is not one.
- **Items 2 to 4 are separable, as asked:** the hold is one number (`DETENT_PX = 0` turns it off), the Shift rounding is one `round(v, K.step)` call in `targetFor`, the reset is `resetHandle` plus `onDouble` and the two-press check in `onDown`. Remove any alone; the tests name each (rows 9, 10, 11 and 11b of `handles.test.js`).

## Rows: red on `63c3ccf` first, green on `3e8d64e` (`amend_red_on_63c3ccf.txt`: `handles` 11 red of 17, `core-pieces-ui` 2 red of 23; the rate rows 3, 4, 7, 8, 9, 10, 11, 12 are restated for the new rates, the lock rows are new)
- **row 13** (lock grants): the stage asks for it; an 800 px travel that no 900 x 600 stage could give by position moves the value exactly `targetFor(turn, 2, -800)` (a control asserts it is not clamped and is beyond the stage); the spike `(64, -112)` is not counted; release unlocks once and does not reset to the click point.
- **row 13b** (every refusal shape: `pointerlockerror`, a rejected promise, a throw, no function): the drag works on the pointer's position, `movementX` is ignored, nothing to unlock.
- **row 13c** (Esc): the browser's unlock mid-drag ends the drag at the value reached with an apply then an end, and we do not call `exitPointerLock` on what was already unlocked; unmount while locked unlocks and takes the listeners off.
- **row 11b** (new, in `handles.test.js`): two presses 160 ms apart reset (with the lock rig too, where no `dblclick` ever fires); 600 ms apart do not; a press right after a drag does not; a click and a click after it restores the pre-drag length.
- Green: `handles` 17/17 and `core-pieces-ui` 23/23; with `core-sculpt`, `jump-ui`, `shell-ghost`, `core-readout-display`, `layout-css`, `redgroups`: **112 of 112**, run directly, no harness. (The fallback row 13b is red on `63c3ccf` only through its rate arithmetic.) `core-pieces-ui.test.js`'s `fire` now stamps each event a second apart, so two separate drags are never read as a double-click.

## The real window (clean runs 1 and 3 of 3, `window_amend/clean_run_*.json`; 0 page errors, the keeper's files unchanged in all three)
The lock engaged (`document.pointerLockElement` was the preview while the button was down and null after the release). Field text, from 2: **no Shift: -24, -20 and -28 px all give `0`; -15 px gives `0.8`. Shift: -240 and -236 px give `0`; two -120 px drags give `0`; -103.7 px gives `1.1`.** The same 20 px at two zooms (mouse wheel out, 29.65 to 11.15 px a metre): turn `1.7`, width inward `29.6`, length `108.4` in BOTH. Double-click (two presses): turn `0`, bank `0`, length 100 to 116.8 back to `100`, width 31 to 27.6 back to `31`, cup 8 to 17.6 back to `8`. The label while dragging read `turn 0.0°/100 m` with the field `0`.

## Please read: my test touched the keeper's REAL mouse (an honest side effect, not a defect in the code)
**While the page holds the lock, real mouse movement reaches it**: run 2 of 3 shows `movementX/Y` like `(-69, 104)` and `(-470, 266)`, hundreds of samples, which are not my CDP steps but the keeper's own hand (`polluted_run_2_keeper_mouse.json`); that run's turn values were wrong for that reason (28 px gave 90) and I do NOT count it. The same fact shows the lock reads real relative hardware movement smoothly, which is the case the keeper wants. **But I could not see the physical cursor stay put and could not drive hardware input**: my window driver speaks CDP, whose synthetic moves are absolute positions. So: **the lock engaging and releasing, the movement reading and the fallbacks are proved; "the cursor does not physically move" is the browser's documented behaviour, unwitnessed by me.** If his cursor froze for a second now and then between about 11:50 and 12:05, that was my runs (the off-screen window had focus while locked). I stopped after three runs.

## Open / limits (in addition to the list above)
- **The first-movement drop** loses one small real step at the start of every locked drag (a few px of travel); I judged it better than a spike of about 130 px (the CDP case; on hardware the first movement may be fine, which I could not test). If it feels wrong on his mouse, `drag.skip` is the one line.
- **`DOUBLE_MS` is 400 ms**, and Windows' own double-click time is usually 500 ms; one number.
- **The hold grew with the new rates**: 6 px is 0.5 degrees of turn, 2.7 degrees of bank, 2.5 m of length (Shift a tenth). If bank's 2.7° hold is too sticky, `DETENT_PX` is global; a per-kind value would be the change.
- Lock in Sculpt, climb and Ctrl: stub-host rows only (as before).

NEXT: librarian — plan default: a quick non-author look at `3e8d64e` (`handles.js` diff, `handles.test.js` rows 11b, 13, 13b, 13c), land `precision-a-d251`, install; then the keeper's hand decides the rates and the 6 px

## The numbers the chair asked for: today per WORLD-metre, to per-pixel (pre-D251 speed, default Build camera, width 31, measured by the probe run)
| kind | today per world metre of drag | px a metre on screen at the default camera | per pixel | set to |
|---|---|---|---|---|
| length | 1 m | 11.778 | 0.0849 m; **x5 = 0.4245** | **0.42 m** |
| width | 2 m | 29.608 | 0.0676 m | 0.068 m |
| bank | 3.696° (the lever: 1 m on a half-width of 15.5 m, in degrees) | 8.25 | 0.448° | 0.45° |
| cup | 2° | 8.227 | 0.243° | 0.24° |
| turn | 0.5 °/100 m | 6.045 | 0.0827 | 0.083 |
| climb | 0.5 °/100 m | 6.084 | 0.0822 | 0.082 |
(Bank today scaled with the road's width and these rates do not; at width 31 they agree. A 300 m length change was 300 / 0.0849 = 3,534 px before D251 and is 300 / 0.4245 = 707 px now: faster than today, as the keeper asked. (63c3ccf's 0.5 m a px was in fact 5.9x today at that camera, 600 px for 300 m; the amendment sets it to exactly 5x, 0.42.)
