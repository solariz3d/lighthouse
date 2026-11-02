# p-d612 — the Pieces menu's "mirror on insert" box (O), 2026-11-02

Packet: the chair's D612 (16:24Z). The keeper, 10:22: in the Pieces menu, "mirror on insert" is drawn as a white square on a long slider-like track, far from its label.
- Make it a normal checkbox beside its label, like the other toggles in the menus.
- Check it in all six looks, keyboard and click toggling unchanged, the saved setting unchanged.
- Tier: CHECK IT. Seat: O.

## What landed
- t180 **`d612-o`** (worktree `C:\Users\nname\Downloads\t180-wt-o612`), off public main `b497c5d`, one commit **`c2d3880`**, NOT pushed.
- Two paths: `app/core/piecesui.js` (3 lines), `CHANGELOG.md` (Fixed).

## The cause
- The box sat in a `label.picker`. `.picker` is a grid (`60px minmax(0, 1fr)`, `app/index.html:284`) whose second column is a slider's, so the box took the whole column: **329 × 13 px**.
  - In Aqua the theme draws that as a track with a white square at its middle.
  - In the other looks it's a small box out in the middle of the row.
- Now it's a `label.menu-check`: the box, then its words. That's the menus' own tick (`app/menubar/menubar.js:43`, `.more-menu .menu-check` at `app/index.html:177`), and the Pieces panel sits inside the same `.more-menu`.
- The aria-label, the title, and the setting's wiring (`mirrorOnInsert`: S.get, S.on, onchange → S.set) are untouched.

## Checked in all six looks (Aqua, Skyline, Skyline Night, Glass, Aurora, Sigil), headless
checked: `S\d612\shot612.js` (headless Chrome via the repo's own `app/test/soundrender.js` launchChrome, `--mute-audio`, every child hidden by `S\winhide.js`; acs.exe checked first) → `G:\Consonance-tools\scratch-O-d612\{before,after}-report.json`.

| | before (b497c5d) | after (c2d3880) |
|---|---|---|
| the box | 329 × 13 px | **13 × 13 px** in every look |
| beside its words | 10 px after a 60 px label column, then 329 px of track | **9 px** from its words, on the same row (0 px off) |
| the box's contrast against the panel round it | 1.09 to 1.7 | **4.2** (Skyline Night) to **19.6** (Sigil) |
| the words' contrast (the pixel probe of texture-page.test.js) | 4.74 to 8.17 | **6.79 to 14.15** |
| a click / Space / a click on the words | saved true / false / true | **the same**, saved as `t180.settings.mirrorOnInsert` |

- Tests: `app/test/core-pieces-ui.test.js` **55/55**. No test that loads index.html was run (the tier).

## The shots (looked at, each)
- Whole page with the Pieces menu open, 1400 × 860: `G:\Consonance-tools\scratch-O-d612\before-<look>-pieces.png` and `after-<look>-pieces.png`.
- The six looks side by side, cropped to the menu: `S\d612\before-six.png` and `S\d612\after-six.png`, in the order Aqua, Skyline, Skyline Night, Glass, Aurora, Sigil.
  - Underwater is **Aqua**.
  - No look is called "space". The night looks are **Aurora** and **Skyline Night**; both are in the set.
- What they show: before, Aqua's track with its white square and the other looks' box in mid-row. After, a tick box at the left of "mirror on insert", as in Settings' own ticks.

## Corrections
- My first run of the shot script read the screenshot from the wrong field of the DevTools reply (the harness's `send` returns the whole message) and stopped before any shot. Fixed and re-run; no figure came from that run.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

SOURCES: `S\d612\shot612.js`, `G:\Consonance-tools\scratch-O-d612\before-report.json`, `after-report.json`, the shots above, `node --test app/test/core-pieces-ui.test.js`
NEXT: the librarian checks the before/after shots when this lands in its pane; the landing pane takes d612-o into 0.4.38 when the chair names it
