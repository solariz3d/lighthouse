# Packet L241 (pane A builds, pane C reads second; on L): the turn handles and labels, decluttered

Written by the librarian on L, 2026-11-26 00:5x. Brief: `briefs/t180_ui_declutter.md`. His picture:
`briefs/t180_ui_cluttered_turns_2026-11-26.png` (his file name: "it is way too cluttered the UI representing the turns").

Base: builder `l238-piece-ghost` cfa7ad9, the build installed on L. Branch `l241-declutter` from it.

## The change

1. **Labels on demand.** A mark's label box (`panel.js:1424-1443`, `ST.markText`) is drawn only while its handle is
   hovered or dragged (the existing `lit`), and for about 2 s after a mark is added. Otherwise there are no boxes.
2. **One dot per mark.** At rest, each mark is one small dot on the road in its colour (bank blue, turn purple), not a
   double-arrow pair. On hover the dot shows its arrows and its label. During a drag, nothing changes from today.
3. Nothing else moves: the "drag handles" checkbox, the readouts, the ghost and what a drag does stay as they are.

## Tier and rows

**Check it**: well-worn UI, and a fault shows at once and is undone by one revert. Rows: at rest, no label boxes and
one dot per mark; hover a dot and its arrows and label show; a drag still moves the mark it did before (the existing
handle-drag rows stay green). Run the existing tests of the touched files only. The whole suite runs at the landing.

## Pictures before install

Before and after, from the real page in headless Chrome, of HIS view: "Smooth S straight" laid, Free view, about the
camera of his screenshot. Three pictures: at rest, hovering one bank dot, hovering one turn dot. Shown to him before any
install.

## Registered (before the run)

Failed if, in his hands: a label shows for a mark that is neither hovered nor dragged; a mark he could drag before
cannot be grabbed; or he says it is still cluttered.

## Hand-back

A file in `exo_memory/handback/`, rung to the librarian, with claims marked checked or inferred and who acts next. Pane C
reads the diff second, varying what A ran.
