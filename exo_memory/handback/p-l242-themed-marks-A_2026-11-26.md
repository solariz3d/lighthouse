# L242, pane A (L): the mark and handle windows wear each theme

**Builder branch `l242-themed-marks`, tip `0ab6cc8` (from 13faa9d; pushed, `git ls-remote origin l242-themed-marks` = 0ab6cc8059). Not merged, not built, not installed. Pictures for him below, before any install.**

BASE: C:\Consonance\t180-wt-declutter 13faa9d

Step 0 (checked): `l241-declutter` fast-forwarded to 13faa9d in `C:\Consonance\t180-wt-declutter` and pushed; `git ls-remote origin l241-declutter` = 13faa9df6f.

## The way (packet item 1: A's choice)
**Canvas drawing that reads new tokens, through one shared painter, `app/core/markwindow.js`.** I did not use an HTML element over the canvas. Placement (`placeLabel`, the handles' avoid boxes, the HUD clearance) and the hit tests all live in the canvas code and are what the L241 rows test. An element would move layout out of that code and add a DOM node per frame of a drag.
- Both windows call it: a mark's label (`secondtick.js` `drawExplained`) and a handle's readout and brush box (`handles.js`).
- With **no tokens** it draws today's box exactly: `fillRect`/`strokeRect`, the veil at 0.92, a 1.5 px edge (2.5 lit) in the mark's colour, bold 12px system-ui, words at +6 px (row W2). So every L241 row and every older row reads the same.
- Tokens (each theme's file; SIGIL's in `app/index.html` `:root`):
  - `--mark-win-font`, `--mark-win-weight`, `--mark-win-radius`, `--mark-win-edge`, `--mark-win-glow` (in the mark's colour).
  - `--mark-win-bg`, `--mark-win-text`, `--mark-win-sheen` (a highlight inside the top edge), `--mark-win-shade` (a soft drop shadow).
- **Said plainly: no blur.** A canvas cannot blur what is behind it, so the glass looks have translucency, sheen and glow but no backdrop blur.
- Each look's window:

| look | window |
|---|---|
| SIGIL | hairline 1 px edge, 2 px corners, Bahnschrift 600 |
| Aqua | 10 px rounded teal gel, wet top highlight, 9 px glow |
| Glass | square frosted shard, 1 px edge, sheen, 6 px glow |
| Aurora | 8 px night glass, Bahnschrift, 12 px glow |
| Skyline | white frosted pane, 12 px corners, dark-blue words, glossy top, a soft blue shadow |
| Skyline Night | navy glass, 12 px corners, sheen, 8 px glow |

  The fonts are the page's own (`--display` or `--body`). The theme files promise never to set `font`; these are canvas tokens and size no box (checked: `theme.test.js` 12 of 12).

## Colours (packet item 2)
- Every mark and handle colour now reads `--mark-<field>` (bank, turn, climb, width, cup, length; `--mark-edge` for the edge marks) over today's literal, through `handles.js` `paintOf`. An extra kind wears its field's colour, and `turnDeg`/`climbDeg` are turn and climb (row W3). The dark rim under every arrow, bar and dot reads `--mark-rim` over `--ink`.
- **No theme sets mark colours yet (my choice; his call).** Each theme file says the canvas hues keep their meaning. Bank and turn are already told apart on every look: row W4 measures today's colours at 60 or more RGB apart on all six (checked). So no extra at-rest pictures were owed. The tokens are there if he wants a theme's own blue and purple.

## Rows
- New `app/test/markwindow.test.js`, which reads the REAL tokens (SIGIL's `:root` and each skin's `[data-theme]` blocks, `var()` substituted) through `tokens.js`:
  - **W1** each look's window draws its own font and corner radius, and no two looks draw the same window.
  - **W2** no tokens draws today's box, lit 2.5.
  - **W3** colour tokens map to fields, extra kinds and corner kinds; none means today's.
  - **W4** bank and turn are apart, and each window's words read at 4.5:1 or better on its fill, on every look.
  - checked: 4 of 4. W1-W3 cannot run at 13faa9d (no `markwindow.js` and no `paintOf`).
- checked: `heavy-run.js --status` (no hold), then `heavy-run.js --run` over the 16 test files that name handles.js or secondtick.js, plus `markwindow.test.js` and `theme.test.js`: 382 tests, 380 pass, 1 fail.
- **The red: `core-extra-bank-drag-cost.test.js` D642**, a timing row (a drag's p95 within 2× another drag's). It fails at 13faa9d too (checked: 8 runs each from the same shell, alternating base and mine). 13faa9d failed 3 of 8 (an archive of 13faa9d in a scratch folder, since removed), mine 1 of 8. An existing timing flake, not this change. inferred: it does not measure the windows at all; it times the panel's drag maths.
- Not run: the whole suite, mutation harnesses (tier "check it").

## Pictures for him (`pics/<look>/`; `themed_screens.js`)
The real page in headless Chrome. The theme is set as the app saves it (`localStorage t180.settings.theme`) before load (checked: `data-theme` read back equals each look). His pieces folder is served read-only. Coast Esses, Free view, L241's camera (RISE 5000, BACK 1500, LOOK 70).
- For each of sigil, aqua, skyline, skyline-night, glass, aurora:
  - `hover_bank.png`: the pointer on a bank mark's dot; its label in the look's window.
  - `drag_handle.png`: the bank's extra handle pressed and moved 40 px up, taken mid-drag: the readout "extra bank -27.4x°" in the look's window, beside the lit mark's label.
  - `rest.png`: as well, for each look.
- `run1.json`: per look, 7 dots, a hover and a drag, 0 page errors.
- **Said plainly:** the handles canvas's own box read 24 px below where its bars land. The script corrects by a measured 22 px (`BAR_DY`), not explained. I checked each drag picture by eye: the readout is there in all six.

## For pane C (vary what I ran)
- Another camera; a lit mark's 2.5 px edge on each look; the brush box (Sculpt), which goes through the same painter and is not pictured.
- A theme switch while a window is shown: `tokens.js` refreshes on `data-theme`; not in a row.
- Skyline's shadow over a light road, where it is the faintest.

## The machine
The T-180 app was running throughout (his); not touched. Nothing installed. His pieces folder only read. The scratch base folder `C:\Consonance\t180-l242-base` was removed. The old stash in the builder repo (`L leftovers 2026-09-29`) is not mine and was left.

SOURCES: packet_t180_themed_marks_A_2026-11-26.md, git merge --ff-only and git ls-remote, app/themes/*.css and app/index.html, theme.test.js, node --test markwindow.test.js, heavy-run.js --status and --run, the D642 alternating runs, themed_screens.js (run1.json)
NEXT: librarian show him the six looks' hover_bank.png and drag_handle.png, and send pane C the diff 13faa9d..0ab6cc8, when you have read this
