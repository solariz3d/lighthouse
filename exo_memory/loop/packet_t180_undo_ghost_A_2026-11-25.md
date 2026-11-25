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

---

## ADDENDUM 1 (the librarian, 01:4x): the numbers come back too. This replaces the first line of "Not in this lap".

**His words, 01:37, verbatim:** "but why cant it show the numbers that made it? That is one of the main reasons this
would be good, bc it shows you the values of the shape, if you can see the shape, you can derive the values as well, this
helps users remember how they got the shape they did"

**He is right and my "cannot" was wrong.** What I had checked is that a piece in the TRACK file keeps no typed values.
What I had not weighed: the shell is handed those values at every Extend (the call the panel sends), and the undo
history is the shell's own, in memory and in the `.t180undo` file beside the track, which can be extended without
touching the track format (`app/core/coreshell.js:102-106`: "the track file is unchanged"). And where no values were
kept, the shape can still be read.

**Part 2 of this lap, after Part 1's rows (R1 to R4) are green. Same branch.**

5. **Remembered values.** Each step the shell commits from the panel keeps the values that made it (the options of
   that call), beside the document in the history: in memory, and in the undo file. On an undo of such a step the
   panel's boxes are filled with those values, extra rows included, so the ghost on screen is the panel's own
   next-piece ghost of the piece he just took back: Extend lays it again, or he changes a number first.
6. **Read from the shape, where nothing was remembered** (a track from before this build, a pasted or shared track,
   a piece laid by a tool): the ghost is Part 1's, drawn from the redo state, and its readout gives what can be read
   off the piece: length, each turn with where it starts and ends, climb, and the bank at its turning points with
   their distances (the repo's own readers do this: `test/roll_profile.js` `turnOf` and the marks read; say which you
   used). The readout says these are read from the shape, not the typed values. The boxes are filled only when the
   read values, laid again, give the same piece; otherwise they are shown and not filled.
7. **The S's own numbers must be typeable**, or step 5 cannot re-lay it: pane O's measured proposal, in corner mode a
   turn of 0 that has extra turn rows sends `turnDeg: 0` (`app/core/panel.js:207`;
   `handback/p-d677-t180-route-O_2026-11-24.md` §3, "byte for byte the S he drove"). Build it here, red first.

**Rows added (print each):**
- **R6, red first:** `extend(opts)` then `undo`: the shell offers `opts` back, and the candidate laid from them is byte
  for byte the piece that was removed. For a plain piece, for a piece with extra turn and bank rows, and for the S as
  driven (turn 0, +92 from 80, −91 from 200, flow through its five marks).
- **R7, red first:** save, open, undo: the values come back from the undo file. An undo file with no values (today's
  format) opens as today and falls to step 6.
- **R8:** an undo file WITH values is read by the released build's reader without complaint: read the 0.4.40 release
  line's parse (builder main 3b33b38) and say whether an unknown field is ignored or refused. If refused, stop and say
  so before choosing a format.
- **R9:** step 6 on "Smooth S as driven L" as it is on disk: the read turns and bank marks beside the known ones
  (+92 from 80, −91 from 200; −20, −27, 0, 25, 26 at 80, 145, 200, 255, 300 m), with the miss of each.
- **R5 (his eye) now shows the boxes too:** the picture after the undo shows the ghost AND the panel filled.

**Registered failure line, added:** failed if, after undoing a piece laid in the installed build, the boxes do not hold
the numbers he typed; or if values shown as "read from the shape" re-lay a different piece and are filled anyway.

**Still not in this lap:** the track file's own format; the flow panel's redesign; a release.

---

## ADDENDUM 2 (the librarian, 02:2x): pane C's read is NOT CLEAN; one line to fix, then C re-runs, then the install

**The line (pane C, `handback/p-l230-C_2026-11-25.md`; the six sites re-read by the librarian with
`git grep -n "madeWith.set\|undoneNow" 2e70b9f -- app/core/panel.js`):** `app/core/panel.js:1314`,
`if (ug && undoneNow) ghost()`. `undoneNow` is true for any step with kept values, and six commands keep them
(`:566` Extend, `:690` Level / To floor, `:698` Turn by, `:714` Turn to grid, `:722` Sharp, `:1098` Jump). After an
undo of any but Extend the preview is the plain Extend of the boxes, not the road the undo removed (C4: 4 rows red at
2e70b9f, none at 27e2084, so it is new with the branch).

**Pane A, tier "check it", same branch `l229-undo-ghost`:**

1. **Red first:** take pane C's rows C3 and C4 from `handback/p-l230-C_2026-11-25_evidence/c-l230-read.test.js` into
   the builder's tests, and add the row C could not set up: Turn to grid (`:714`), from a heading that is off the grid.
2. **The fix, as C proposes:** `op: 'extend'` inside `made` at `:566` only; in `draw` the `ghost()` path is taken only
   when `m.made.op === 'extend'`; every other command keeps `putBack` and shows `st.undoGhost` with the "undone"
   header. Green: C3, C4, the new row, and R6, R7, P1 to P3.
3. **The two saved S projects:** their undo files were written by 2e70b9f with `made` and no `op`. Re-run
   `made_files.js` so each step's `made` carries `op: 'extend'`; print each `.t180track` sha256 before and after
   (L228's line stands: a track file that differs fails the lap) and the new `.t180undo` sha256.
4. **Say, from a read (no build):** whether `fieldsNow()` holds the command's own numbers (Turn by's angle; Sharp's
   degrees, radius and ramp; the grid step). His words of 01:37 are "the numbers that made it"; if an undone Sharp
   gives back the piece's boxes and not Sharp's three, name that in the hand-back as open, do not build it here.
5. Tests: the rows above and the tests of `app/core/panel.js`. **No whole suite.** Pane B's landing may be using the
   machine: `node consonance/tools/heavy-run.js --status && <run>` in one call.
6. Hand back to the librarian. **No build and no install yet.**

**Then pane C** (on the librarian's ring, not before): re-run C3, C4 and the Turn-to-grid row on the new tip, varied
(a different first piece, a Jump after a Sharp). CLEAN or the line.

**Then, on CLEAN, pane A:** an internal build of that tip, installed with a backup of the current exe; install first,
no whole suite before it (the notes' rule of 01:0x). His app is closed (his word, 01:36); if `t180-track-builder.exe`
is running at the install, stop and say so.

**Registered:** C's line carried: failed if the undo ghost is installed and he finds a stale ghost or wrong numbers in
the boxes after an undo that C's read passed.
