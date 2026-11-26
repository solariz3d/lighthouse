# Packet L242 (pane A builds, pane C reads second; on L): the mark and handle windows wear each theme

Written by the librarian on L, 2026-11-26 01:0x. Brief: `briefs/t180_ui_declutter.md` (his words at 00:58: "we should
also incorporate the themes for those windows for each theme u know? More work, but it is fun work imo").

Base: builder `l241-declutter` at the tip C's read leaves (77ffe18 or its fix). Branch `l242-themed-marks`.

## The change

1. **The windows are the theme's own.** The label of a hovered or dragged mark (`secondtick.js:193-201`) and a field
   handle's readout (`handles.js:416`) are drawn the way that theme draws its panels: its font, corner radius, border,
   glow and blur. The way to get there is A's choice, said in the hand-back. One way is an HTML element placed over the
   canvas, so the theme's CSS styles it with no second copy of the look. The other is canvas drawing that reads new
   tokens.
2. **Colours per theme.** Each theme may set its own colours for the marks and handles (bank, turn, width, cup, length,
   and the dot's rim). Make them tokens such as `--mark-bank`, read where `handles.js:49-58` and secondtick read
   `colour` now. A theme that sets none keeps today's colours. Whatever the theme, bank and turn must stay easy to tell
   apart on that theme's road.
3. Behaviour does not change: what hover, drag, dots and the drag-handles checkbox do stays exactly as L241 left it.

## Pictures before any install (the deliverable he picks from)

From the real page in headless Chrome, Coast Esses in Free view (the camera of L241's pictures): for **each theme**
(sigil, aqua, skyline, skyline-night, glass, aurora), one picture hovering a bank dot and one dragging a field handle.
Twelve pictures, named by theme. If a theme's colours were changed, add one at-rest picture for that theme.

## Tier and rows

**Check it.** It is a look change, and a fault shows at once and undoes with one revert. Rows: each theme's label takes
that theme's font and radius (read back from the computed style, or from the tokens drawn); a theme with no mark tokens
draws today's colours; hover and drag rows from L241 stay green. Touched tests only.

## Registered (before the run)

Failed if, in his hands: a theme's mark windows look like another theme's or like plain boxes; a label is unreadable
on its theme's road; or bank and turn cannot be told apart on some theme.

## Hand-back

File in `exo_memory/handback/`, rung to the librarian, with claims marked checked or inferred and who acts next.
