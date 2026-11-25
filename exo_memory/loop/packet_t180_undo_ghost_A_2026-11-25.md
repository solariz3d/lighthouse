# Packet (pane A, on L, Sonnet 5.5): after an undo, what was undone stays on screen as the ghost

Written by the librarian on L, 2026-11-25 01:3x, at his word. For the chair to number and dispatch. Brief:
`exo_memory/briefs/t180_undo_ghost.md` (his words whole; read it first). **The re-read of pane B's L225 repair comes
before this if it arrives; it holds his restart.**

## His words (verbatim, 01:33)

"when I undo it, it works, but the two turns are one piece that disapears, i guess what I am looking for is this, and
should be like this for the program in general not just tests, but you should see the ghost of the piece you undo every
time you undo, right now it just goes away and resets so you dont see the piece you reverted, get what I mean?"

## What to build (builder repo, a new branch from `p-flow-ai` 27e2084; tier **check it**)

1. **After an undo, the road that the undo took away is drawn as the see-through ghost, where it stood.** It is taken
   from the redo state the shell already holds; no piece is rebuilt from typed numbers (a document keeps none).
   "In general" is his word: an undone Extend shows the piece; an undone brush stroke or handle move shows the piece as
   it was before the undo, over the piece as it is now. If some kind of undo cannot show a ghost, name it and why.
2. **It carries the piece's readout** (length, turn, climb, bank), the one a placed piece's label already shows
   (`pieceReadout`), so he can read what he reverted.
3. **It goes when he acts:** redo puts the piece back and the ghost goes; any new edit, a typed value or a handle drag
   returns the ghost to the next piece as today. Several undos in a row show the piece of the LAST undo only (say if
   you find a reason to show more).
4. **It costs nothing he can feel.** An undo on a long track once took 54 to 102 s and was fixed
   (`app/core/coreshell.js:123-125`); the ghost must not bring a whole-track rebuild back. Use the redo state's
   already-built piece. **No timing run on L** (his standing order): the measure is a COUNT, how many pieces are parsed or rebuilt by one undo on a long track, before and after.

## Registered before code (print each in the hand-back)

- **R1, red first:** after `extend` then `undo`, the shell's state holds a ghost whose road is the removed piece's
  (the same samples the placed piece had); after `redo` it holds none and the document is the same bytes.
- **R2, red first:** after an undo, a new `extend`, `candidate` or brush begins with no undo ghost left.
- **R3:** an undone brush stroke shows the piece as it was; or the named reason it cannot.
- **R4:** the number of pieces parsed or rebuilt by one undo on the longest track in the repo's fixtures, before and
  after (a count from the code's own counters or a probe; not a timing).
- **R5, his eye, BEFORE any install:** two pictures from the page tests' headless view of "Smooth S as driven L"
  (`%APPDATA%\com.solariz3d.t180-track-builder\tracks`, read only): before the undo, and after one undo with the ghost.
  They go in the hand-back. The librarian shows them to him; an internal build is made and installed only at his word.
- Tests to run: the rows above and the existing tests of the files you touch. **No whole suite here**; that is the
  landing's. A second pane reads the diff before anything is installed.

## Registered failure line

Failed if, after one undo of a piece in the installed build, he cannot see the piece he reverted; or if one undo on a
long track parses or rebuilds more pieces than it did before this change.

## Not in this lap

The panel's boxes refilled with the numbers that made the piece (a document does not keep them; that is a file-format
question for him). The flow panel's redesign. Any change to what undo or redo do to the document. A release.

## Standing rules

His app may be open: do not start, stop or build over it; no install in this lap. Commit by named paths on your branch
in the builder's repo; his words do not go into that repo. `node consonance/tools/heavy-run.js --status && <run>` in one
call before a build or any run over three test files. No timing runs on L. Hand-back as a file in `exo_memory/handback/`, rung to the librarian as a pointer,
each claim marked checked or inferred, ending with who acts next.
