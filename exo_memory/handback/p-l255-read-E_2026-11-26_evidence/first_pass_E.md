# L255 read, pane E: first pass on the diff 40e931e..a64c625, written before any run and before O's hand-back is opened

Read: the packet (`loop/packet_t180_chrome_followups_O_2026-11-26.md`), P's L249 read rows 11-14 and its "Older than the range" / "For the
landing", and `git diff 40e931e a64c625` (9 files, +121/-11). Not read yet: `handback/p-l255-followups-O_2026-11-26.md`.

## What the diff does, item by item, and what I expect to find

1. **Export hovers.** One rule per look, in aurora, skyline and skyline-night only:
   `[data-theme=X] header #install > button:hover:not([disabled]) { background: var(--accent-hover); }`, (1,3,2) over the look's (1,1,2). Expect: those
   three change pixels on hover; sigil, aqua and glass hover through their generic `button:hover`, as before. So `--accent-hover` is drawn in 3 looks
   and still set and undrawn in 3 (sigil's default, aqua, glass). The packet said "one rule if one reaches all six, else one per look"; whether
   Export in those three is a solid fill at all decides if that is a gap. Contrast hovered, from the tokens (to measure): skyline #fff on #0751a6,
   skyline-night #04203f on #89cdff, aurora #03130d on #7ef5c8; all should be well over 4.5. The aurora gradient becomes a flat fill on hover.
   **Pressed:** the looks' `button:active:not([disabled])` is (0,3,1) and loses to the Export rule, so in the three looks a press shows the hover
   fill and nothing more. Predict: no pressed state of its own in aurora, skyline and skyline-night (none before either; not a regression).
2. **Capsule by formula only.** `skyline.css:49`, `skyline-night.css:47` deleted; the old comment is kept and reworded above the new hover rule (it now
   sits over a rule it does not describe: nit). Expect: 999 px at factor 1 (both skylines), r2 if `--radius-factor` is set under 1.
3. **SIGIL titles hover.** `:root:not([data-theme]) .more > summary:hover { background: var(--hover) }`. SIGIL's buttons hover by accent border and
   text, its titles now by a background only: two hover languages side by side in one bar (the packet asked for `--hover`, so not O's to answer).
   Expect a small change: --hover is raise 6% toward text.
4. **File and Edit hang rightwards under 1000 px.** `@media (width < 1000px) { header :is(#m-file, #m-edit) > .more-menu { right: auto; left: 0 } }`.
   Expect all 7 menus inside at 900-990; at 1000 and 1010 File opens leftwards again and should just fit (O's comment: 960 was the first width it
   did). Risk to look for: a menu whose width grows with its content (Open…'s list of saved tracks, white-space: nowrap, no max-width) runs off the
   right edge at 900 when hung from the left, as it ran off the left before. Not in the packet; a vary.
5. **One frame on a focused field.** The base `input:focus, select:focus, textarea:focus { border-color: var(--accent) }` is removed, and so are the
   four skins' border lines (glass, both skylines; aqua and aurora keep their box-shadow part). Expect: a clicked text field wears only the ring.
   **Risks to look for:** (a) O's row 18 parks the pointer OFF the field before reading; a person leaves the pointer ON the field after a click, so
   any hover border on a field would be the second frame (none found by grep: `(input|select|textarea)…:hover{…border` hits only a base-select
   option); (b) a **select** opened by mouse does not match `:focus-visible`, so with the border rule gone it carries no focus mark at all while open
   or after a mouse choice (O infers this); (c) a field in a scroller (`#left`) or in a menu could clip the ring: P measured 30/30 and 12/12 drawn at
   L249, and nothing here moves a field, so expect the same.
6. **Values strip corner** `var(--r3)` inline. Expect computed = each look's r3.
7. **CHANGELOG**: one Changed line (L249 and L255) and one Fixed line. Read them against the page.

## The merge question (item 5 of the chair's list)
A's `l254-left-column` (2d7ab5f) does not touch `texture-page.test.js` (its rows are a new file, `leftcolumn-page.test.js`), so the only textual
neighbours in that file are O's appended rows 15-18 and my row 7b (inserted after row 7, plus a header line at :16). Expect a clean textual merge
there. Possible conflicts elsewhere: CHANGELOG (all three add lines near the top of Unreleased), `index.html` (A's hunks at :62, :88, :264, :286,
:699; O's at :165, :194, :236: disjoint), `valuesoverlay.js` (A's at :65-82, O's at :34: disjoint).
**The semantic risk is A's clearing column:** O's rows park the pointer at (5, 850), inside the column, so they arm it; it clears 400 ms after the
pointer leaves. Rows 15 and 16 shoot 350 ms after the move, so they should still see what they saw. Only a run of the merged file says.

## Pre-registered: what makes this NOT CLEAN
- any red in the touched tests at a64c625 other than row 7 (`texture-page.test.js:252`, known);
- a focused field still wearing two frames in any look, by click or Tab, with the pointer left on it or off it;
- an open menu off the window at any of 900, 950, 990, 1000, 1010 in any look;
- a hovered or pressed Export under 4.5:1 in any look, or Export hover changing nothing in any look;
- the capsule no longer 999 px at factor 1 in the skylines;
- the three-way scratch merge not merging, or its texture-page / leftcolumn-page rows red where each branch alone is green.
Not a defect by itself: a select with no focus mark while open by mouse (I judge it, with what Chrome does on a following key).
