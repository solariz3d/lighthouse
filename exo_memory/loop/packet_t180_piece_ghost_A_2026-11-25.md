# Packet (pane A builds, pane C reads second; on L): a saved piece goes down as a ghost, with the numbers that made it

Written by the librarian on L, 2026-11-25 07:1x. Brief: `briefs/t180_undo_ghost.md` (his 07:02 words, verbatim, at the end).
His words, 07:02: "it isnt obvious how you made that piece ... i need to know how to make it by hand with the program, as
well, in saved pieces, it should add the ghost of the piece before placing it you know? So click a saved piece, it doesnt
auto place it, it places the ghost that you then have to press place, it allows you to tweak the piece if you want before
placing it."

Base: the builder's `l229-undo-ghost` 4e19e33 (his test PASSED, 07:02 "it works"). Branch from it; the landing merges
l229 and this together into the builder's main (13 commits ahead of main 3b33b38 today).

## What exists (checked by the librarian)

- A piece file refuses unknown fields: `src/core/piece.js:118` ("refused rather than dropped on the next save"). So the
  numbers CANNOT go into the `.t180piece` without a new schema that older builds refuse.
- The library adds on click: `app/core/piecesui.js:131` `addAtHead`, `:141` the button, `:145` a row click adds at once.
- L229 already does the rest of the work: undo puts an Extend's typed numbers back in the boxes and shows the panel's own
  ghost; where none were kept it reads them off the shape and says so.
- The panel now accepts turn 0 with extra turn rows (`app/core/panel.js:209`, `t !== 0 || turnRows`), so the S he drove
  can be typed (pane O's typing, `handback/p-d677-t180-route-O_2026-11-24_evidence/probe5.js:19`).

## The change

1. **A saved piece keeps the numbers that made it, in a sidecar** `<name>.t180recipe` beside the `.t180piece` (the
   `.t180undo` precedent: older builds ignore it, the piece file is not changed). Written by Save piece when the piece
   was laid by Extend or a command with kept numbers. Rename and Delete carry the sidecar with the piece.
2. **A click on a saved piece (row or Add at head) lays nothing.** It shows the piece as the ghost at the head and puts
   its numbers in the panel's boxes (from the sidecar; else read off the shape, and the readout says so, as in L229).
   A **Place** button lays it, one undo step. Tweaking a box changes the ghost, as Extend's ghost does today. Esc or a
   click elsewhere drops the ghost. Mirrored stays an option and mirrors the ghost.
3. Where the numbers are read off the shape and Place is pressed untouched, the laid road is the saved piece's own
   bytes (not a re-lay from read-off numbers).
4. Re-save **Smooth S as driven** and its ease-out through the panel's own typing (probe5.js:19, then the 150 m
   ease-out, bank 0, flow, at 100) so both get a sidecar; same names, `cp` the old files aside first, never overwrite
   without a copy.

## Tier and rows

Tier: **prove it** for 1 and 3 (it writes beside his saved files; a fault would hide until he reopens a piece). Rows,
red first: a saved Extend piece writes a sidecar and the piece file's bytes are unchanged; Rename and Delete carry it; a
click lays nothing and shows the ghost with the typed numbers; Place lays it as one undo step; an untouched read-off
Place equals the saved bytes; an older build's reader (the piece reader at 3b33b38) still opens the piece file.
**Check it** for 2's look. The whole suite once, at the landing only.

## Pictures before install

Two screenshots of the app: a saved piece clicked (ghost plus filled boxes, Place visible), and the same after one box
tweaked. Shown to him before the install.

## Registered (before the run)

Failed if, in his hands after install: a click on a saved piece lays road; Place does not lay what the ghost showed; a
piece he saved before this build no longer opens or adds; or the re-saved Smooth S as driven, clicked, does not show
the numbers he can type to make it by hand.

## Landing

Merge l229-undo-ghost and this branch into the builder's main, one release build, install on L (backup the exe first,
hash both), his word before any release. Hand-backs as files in `exo_memory/handback/`, rung to the librarian, each claim
checked or inferred, ending with who acts next.
