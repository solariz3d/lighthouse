# D267: declutter the left column — seat A (Sonnet 5.5), 2026-10-07

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_declutter_left_2026-10-07.md · `git log --oneline b33bac5..e850c45` in `C:\Users\nname\Desktop\worktrees\a-declutter-wt` · evidence `p-declutter-A_2026-10-07_evidence/` (`red_on_e850c45.txt`, `green_targeted.txt`)

**Done: one commit on branch `declutter-a` (worktree `C:\Users\nname\Desktop\worktrees\a-declutter-wt`), from t180 main `e850c45`. Local, nothing pushed, no real window (rows and fake hosts only). The commit hash is in the ring.**

## What changed, against the plan's three items
1. **No help paragraph under a field; each is a tooltip.**
   - **Tube width:** the note under the field is "≈ 14.3 m across" (`widthlike.js` `tubeNote`); the explanation is `tubeTip`, the width field's and the note's tooltip.
   - **Grip:** just "Grip 100%" (and "Grip 130% · untested"; a refused value keeps its words, which are the point). What 100% is and what untested means are the field's tooltip (`griplike.js` `tip`). **The "does not model grip / drive it in AC" sentence is CUT**, from the field note AND from the Set grip status message (it was in both).
   - **Turn 0:** the paragraph is gone; the sense is appended to the turn "at start" box's tooltip while it applies (`hintNow` now sets that title; the harness anchor `core-close-mutation` S3 still applies and its named row now checks the tooltip).
   - **Jump:** no paragraph under the button (the button's tooltip keeps the sentence); the note under it shows only a refusal's words; the status after a jump is now "Jump placed: move its landing by hand." (it said "This is a jump: drive it in AC and move the landing until it works.").
   - **Beyond the list, same rule:** the landing block's hint paragraph ("Move the landing: drag its arrows…") is now the block's tooltip. Say if you want it back.
2. **Share codes in ⋯:** `<section id="share">` left the left column; `<div id="share">` is inside the ⋯ menu (`app/index.html`), mounted by the same `panels.mountPanel($('share'), …)`. The buttons read **Copy track code** and **Paste track code…**; the box that holds the code says "paste a track code here" (it said "paste a t180 code here"). `app/share/share.js` is untouched: a code is made and read as before (row 19c round-trips one).
3. **The values, large:** new `app/core/valuesoverlay.js`: length, turn, climb, bank and width of the piece the fields describe, 28 px bold on a dark strip at the TOP CENTRE of the 3D view, fed by the panel's `readout()` (so it follows every drag step and every keystroke), hidden when there is no such piece (a closed loop). **The spot is one constant, `SPOT_CSS`** (inferred from "a better spot to be seen"; the guide card sits top right). The left column's own small readout is unchanged.

## Rows
- **Red on `e850c45` first** (`red_on_e850c45.txt`): 9 fail with the new expectations on the old code (rows 14, 14b, 16, 16b restated, the width-like tube row, the straight-hint row, and the new 19, 19b, 19c); **green after.**
- New: **row 19** (no paragraph renders: a sweep of every leaf text of the panel for the removed sentences at the start, on a tube, at grip 130, after a turn then turn 0, after a jump; and the tooltips carry them), **19b** (the overlay: its five values, follows typing and a three-step handle drag, equals the panel's own readout, large type at the constant, hidden on a closed loop), **19c** (the share block is inside the ⋯ menu and not in the left column, the buttons' names, a code round-trips).
- Restated (the spec changed, not weakened): `core-pieces-ui` 14, 14b, 16, 16b; `core-widthlike` (the note, the panel rows); `core-readout-display` (the straight hint is the tooltip); `jump-ui` (the status text).
- **Targeted run under the lock: 20 files, 269 tests, 269 pass, 0 fail** (`core-pieces-ui`, `core-widthlike`, `core-readout-display`, `jump-ui`, **`core-xsec`**, `layout-css`, `shell-dist`, `share-install`, `onboarding`, `guides`, `redgroups`, `handles`, `cheap-ghost`, `core-shell`, `core-sculpt`, `shell-ghost`, `palette-panels`, `timers-regression`, `keys-anywhere`, `shell-keys`).
- Mutation-harness anchors (not run): 223 edits, the same 3 not applied as before (`renderer.js`, `prove_render.js`), none in files I changed.
- `CHANGELOG.md` under [Unreleased] and `app/README.md` updated.

## Does NOT establish
Any real window: how the strip looks over the real view (28 px, 5 values, over a 900 px stage may crowd the top; the guide card), whether the ⋯ menu is wide enough for the code box, and that "top centre" is where the keeper meant. The whole suite and the four mutation harnesses (not run). **The left column still carries the small readout, the Extend fields, the brush, Close, the selection and library sections**: this lap removed paragraphs, not sections.

## Decisions / for the keeper's hand
- The status line after Jump and Set grip is shorter; if he wants "drive it in AC" back anywhere, it is one string.
- The overlay's width shows the field's value (`31 m`), not a readout figure (the core's readout has no width).

NEXT: librarian — plan default: a non-author look at the commit (`panel.js` `readout()` feed and `hintNow`, `valuesoverlay.js`, the `index.html` move), install on the shortcut, release 0.3.2 only if the keeper wants it public
