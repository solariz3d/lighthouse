# T-180 track builder: after an undo, the piece that was undone stays visible as a ghost

One brief for this thing. His words go in verbatim in the turn they arrive; the state half is updated with the work.

## His words

- 2026-11-25 01:27 (L), with "Smooth S as driven L" open: "looks good, but when i try to undo it to see the piece and
  how it works, the whole thing despawns, like you know it doesnt show me the pieces when i undo"
- 2026-11-25 01:33 (L), after the saved history was rebuilt as one step a piece: "when I undo it, it works, but the two
  turns are one piece that disapears, i guess what I am looking for is this, and should be like this for the program in
  general not just tests, but you should see the ghost of the piece you undo every time you undo, right now it just goes
  away and resets so you dont see the piece you reverted, get what I mean?"

## What he is asking for (the librarian's reading, said back to him at 01:3x)

In the whole program, not only in these test files: when an undo takes a piece away, that piece stays on screen as the
see-through ghost where it stood, so he can look at what he just reverted. Today the piece vanishes and the panel goes
back to its resting state.

## What exists (checked by the librarian, 01:3x, builder tip 27e2084)

- The builder already draws a see-through ghost: for the next piece (`app/core/coreshell.js`, `candidate`, the drag's
  ghost at `:76`, `:382-386`) and for a delete or close preview (`:293`, `:331`).
- Undo and redo step through whole documents (`coreshell.js:7`, `:31`; the saved history is `{present, past, future}`,
  `:102-106`). So after an undo the piece that was removed is still held, in the redo state.
- A piece in a document is its knots and channels only (read in `eq-Smooth S as driven L.t180track`: `id`, `type`,
  `length`, `family`, `knots`, `channels`). **The numbers typed to make it are not kept.** So a ghost of the undone
  piece can be drawn from what is held, but the panel's boxes cannot be refilled with how it was made unless the file
  starts remembering that (the same addition the flowing bank's "built as laid" question needs:
  `loop/handoff_t180_2026-11-24-D.md`, "Open with him", 1).
- No earlier words of his on a ghost after undo were found in the T-180 briefs (grep for ghost with undo, redo, revert).

## State

- 01:3x: packet `loop/packet_t180_undo_ghost_A_2026-11-25.md` rung for pane A: the ghost of what an undo removed, drawn
  from the redo state; pictures shown to him before any install. Not in it: the boxes refilled with the piece's numbers.
