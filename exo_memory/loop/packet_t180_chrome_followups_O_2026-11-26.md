# Packet L255 (pane O builds, pane P reads; on L): what P's read of the chrome refactor left for a small lap

**Source:** `handback/p-l249-read-P_2026-11-26.md` (CLEAN), its rows 11 to 13, "Two of A's lines", "Older than the
range" and "For the landing". His words on the refactor, 04:49: "the refactor looks good enough." Spec:
`briefs/t180_ui_refactor_spec.md` §5, §6.

Builder, branch `l255-chrome-followups` from `l249-chrome-refactor` 40e931e. CSS and one menu placement only; no markup
change unless a rule has nothing to hold on to (say so).

1. **Export hovers.** In aurora, skyline and skyline-night a hovered Export changes 0 pixels (P's row 12: the look's
   `[data-theme=X] header #install > button` outranks the hover rule, and no `#install > button:hover` exists).
   `--accent-hover` (step 10) is set in six looks and drawn nowhere (row 13). Wire it: one rule if one reaches all six,
   else one per look. Contrast of the hovered Export stays 4.5:1 or more (row 14's check).
2. **Export's capsule is the formula only.** Delete `skyline.css:49` and `skyline-night.css:47` (a 999 px corner set by
   look name), so a look moved under factor 1 loses the capsule as the spec says. No visible change today.
3. **SIGIL's menu titles hover.** `#m-file > summary` in SIGIL changes 0 pixels on hover; every other look's changes.
   Give it `--hover`.
4. **The File menu stays in the window.** At 900 px wide (tauri's minimum) its box is `-55,40,205,582`: 55 px off the
   left edge, words cut. Keep it inside the window at every width from 900 up.
5. **One frame on a focused field, not two.** A clicked field wears its accent border and the 2 px ring together (P:
   "a heavy double frame"; Chrome matches `:focus-visible` on any focus of a text field). The librarian's call: the ring
   is the focus mark, so a focused field's border keeps its resting colour. If that reads worse in a look, say so with
   a picture rather than keep both.
6. **The values strip's corner on the scale.** `valuesoverlay.js` sets an inline `border-radius: 8px`, off the scale in
   sigil, glass and aurora (P's row 11). Give it `var(--r3)` if that is one line; if it needs more, say so and leave it.
7. **The CHANGELOG line L249 owes** (its 8 commits added none), covering L249 and these items.

## Tier and rows
**Check it** (CSS on a read branch). Red first for 1, 3, 4 and 5: a real pointer over Export and over SIGIL's File title
changes pixels; the File menu's left edge is at 0 or more at 900 px in all six looks; a focused field shows one frame.
Rows 13 and 14 of `texture-page.test.js` and the glow and scale rows of `theme.test.js` stay green. Touched tests only.

## For his eye
A clicked field before and after (two looks), and Export hovered in the three looks. Uncommitted.

Hand-back to the librarian, claims checked or inferred. No install, no release; his app is not touched.
