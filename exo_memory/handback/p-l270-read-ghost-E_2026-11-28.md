# L270 role 3, pane E (L): the second-seat read of the ghost fix 8c78a59 (d678-ghost-offset-p), on the merge 9de0b18

Seat: pane E (sibling-07b8a48f, L). The order: `exo_memory/loop/packet_t180_n4a_resume_on_L_2026-11-28.md` "Role 3" and "For
every role" (room bc4e2f5d), the chair's L270 paste (2026-11-28T06:33:59Z). The fix's own record:
`handback/p-d678-ghost-offset-P_2026-11-27.md`. I wrote none of the ghost fix. I read the width hold (L264), whose
`drag-ghost.test.js` row 5 is where the two branches meet.

## 0. Registered before I read the diff (committed alone, before any read of c522ea6..8c78a59)

Read before this section was written: the packet whole, P's hand-back whole, O's section 2 (`p-d678-n4a-build-O_2026-11-27.md`:27-55).
Not read before it: the diff, any file at 8c78a59 or 9de0b18, any test row.

**The lines I am scored on (O's section 2, quoted):** "on the page, the ghost is shown **and** lies on the placed road at the
head: its offset there is **under 0.01 m**"; the unwelcome outcome "on the merge the ghost on the head is still off the placed
road", or "drag-ghost.test.js is red only on the merge".

**CLEAN means all of these hold.** Each one is a sentence that could be false.

1. **Scope.** c522ea6..8c78a59 changes only `app/core/coreshell.js` (the next piece's candidate, `candidateJump`, `undoGhostOf`,
   and `showPiece`'s candidate each carry one more field, `lift`), `app/preview/trackmodel.js` (`ghostSteps`' copy-and-extend
   branch), `app/test/ghost-offset.test.js` (new), and `CHANGELOG.md`. Any other file is named and read.
2. **No offsets, no change.** On a road with no h or l offset anywhere, every ghost (next piece, cheap/drag, Jump, undo,
   piece) is the same as c522ea6's: the same path and the same mesh, to the byte where the old code is deterministic.
3. **No double lift.** On a road whose offsets are applied once already (a re-laid tail that is lifted, a placed piece that
   carries the head's `l`), the ghost is lifted once: it lies on where placing lays it, not 2× the offset off.
4. **The variations, on the merge 9de0b18,** each against where placing (or Undo, or `jump()`) actually lays the road, within
   **0.01 m** at every shared station, head included:
   - a. the next piece's ghost after a **width brush** at the head on a road whose head carries an `l` offset (the width
     hold's path and the ghost fix's lift meet here);
   - b. the same after a width brush with **no** offset (the hold alone; it must match c522ea6 + 15e7d62's ghost, the fix
     adding nothing);
   - c. the **undo ghost** after one Undo, after two Undos, and after Undo then Redo, on a road with an offset at the head;
   - d. the **Jump ghost** from a head with an `l` offset, and from one with an `h` offset;
   - e. a **height** (h) offset at the head as well as a sideways (l) one, for the next piece's ghost;
   - f. the **cheap (drag) ghost**, the one `drag-ghost.test.js` reads, on a road with an offset at the head: on the placed
     road, or named as outside the fix's reach.
5. **The meeting point.** `drag-ghost.test.js` and the ghost's sender in `coreshell.js` at 9de0b18 carry both branches'
   changes, with no line of either lost; `drag-ghost.test.js` is green on the merge, and its row 5 pin is the width hold's
   (`eb3501a2c3eec581`).
6. **P's rows stand on the merge:** the 11 ghost files (76 rows at 8c78a59) are green at 9de0b18. Re-run, not quoted.
7. **The CHANGELOG** states no figure or rule that a run of mine contradicts.

**NOT CLEAN** if any of 1-7 fails. **"Do not build this"** if a ghost he can make in the app (by a brush, an Undo, a Jump or
the piece list) lies 0.01 m or more off where placing lays it on the merge, or a road with no offsets draws a different
ghost than c522ea6 did. A CHANGELOG-only or scope-only failure is NOT CLEAN but not "do not build this".

**The unwelcome outcome, in the words that would make it true:** "after a width brush (or an Undo, or at a Jump) on the merge,
the ghost lies off the placed road by more than 0.01 m"; "a road with no offsets draws a different ghost after the fix";
"the ghost is lifted twice".

**Default to refuted.** I attack each of P's claims; P's figures are not quoted as mine until re-derived.

**My bias.** I read the width hold and called it NOT CLEAN on its CHANGELOG (`p-l264-read-E_2026-11-27.md`), so I may lean
toward finding CHANGELOG faults and toward trusting drag-ghost row 5, which I checked. And on L264 my carry was "run a probe
with the app's own brush, not the one a test injects": I will use the shell's default `brushFn` for every width brush here.

*(Section 0 above was committed alone at 9f5299db, 06:35:57Z, before the diff was opened. Nothing in it is changed below; one
stale figure in it is corrected in "Corrections".)*

## 1. Verdict: NOT CLEAN narrowly, on the CHANGELOG only. The code: build it.

- **The code meets every condition I registered** (1-6). On the merge every ghost I made lies on the road placing lays, path
  and mesh, to 0 m in 34 of 34 cases, and the no-offset cases draw a ghost byte for byte the same as before the fix.
- **Condition 7 fires.** The CHANGELOG's N5 entry says the old ghost lay "up to 2 m beside the placed road", and that the Jump,
  undo and piece ghosts "each lay up to 2.5 m beside where it belongs". At c522ea6 a run gives **6.80 m** (a grab of width and
  offset together, 100 m piece), **7.62 m** (banked road), and **40.50 m** after a plain sideways brush with a 1,000 m piece. The
  miss grows with the next piece's length (section 4). A wording fix, not a reason to hold the build.
- **Not "do not build this":** no ghost he can make is off on the merge, and no road without offsets changed.
- **For his eye (section 4), older than both branches:** after a grab or hill whose window reaches the head, Extend with the
  fields as shown carries the offset's SLOPE on along the whole new piece: 40.5 m sideways, or 40.5 m down, at the end of a
  1,000 m piece. The width hold stops this for the width only. Before the fix the ghost hid it (it drew the piece with no
  offset); **after the fix the ghost shows it truthfully**, so the first time he hovers Extend after a grab at the head he
  will see the next piece swerve or sink away. That is the placed road, not a ghost fault.

## 2. The delta and the meeting point (conditions 1 and 5)

checked: `git diff --stat c522ea6 8c78a59` → CHANGELOG.md, app/core/coreshell.js, app/preview/trackmodel.js,
app/test/ghost-offset.test.js; 165 insertions, 9 deletions. Condition 1 holds.

What it does, read whole:
- `coreshell.js`: a new `liftFor(d, segments)`, which lifts by `offsetPath(d, segments or segmentsOf(d), p)`, the segments found
  lazily. The next piece's candidate (full and coarse), `candidateJump`, `undoGhostOf` and `showPiece` each carry
  `lift: liftFor(<their doc>)`; the coarse one hands its own coarse segments (`liftFor(dc, sc)`).
- `trackmodel.js` `ghostSteps`, copy-and-extend branch: lifts the extended copy by `candidate.lift`, meshes on the lifted path
  with `_lift` keys, returns the lifted path. The re-laid branch already read `candidate.lift` (D642); it now gets one.
- inferred, from reading `src/core/adapter.js` `offsetPath`: it indexes `segments[x.seg]`, so a lift handed other segments than
  the path's would mis-lift. `coarsen` and `coarsenRun` (`app/preview/coarse.js`) keep every segment's count, id, length and
  curvature and change only its row grid, so the cheap and coarse ghosts are safe. The cheap-ghost cases below agree (0 m).
- Every other candidate: the close and delete proposals go through `resolvedOf`, which already carried a lift.
  checked: `grep "segments: segmentsOf("` in coreshell.js at 9de0b18 → the 4 senders, all four with `liftFor`.

**The meeting point is in behaviour only, not in a shared line.**
checked: `git diff 8c78a59 9de0b18` on coreshell.js, trackmodel.js, ghost-offset.test.js → 0 lines each; `git diff 15e7d62
9de0b18` on drag-ghost.test.js, extend.js, turnby.js, core-width-hold.test.js → 0 lines each. Neither branch touched a file
the other did except CHANGELOG.md, where `git diff 8c78a59 9de0b18 -- CHANGELOG.md` removes 0 lines.
- `drag-ghost.test.js` reads only roads with no offsets (rows 2-4 the coarse, release and cheap ghosts; row 5 the hold's
  documents). So it cannot see the fix: the lift reaches it only as the identity. My `f cheap` cases cover the cheap ghost
  WITH offsets, which it does not.
- Row 5's pins at 9de0b18 are `24bcdf657190c0cd` (placed pieces) and `015881f53acdbc5f` (with the corners), the same file as
  15e7d62's.

## 3. The variations (conditions 2, 3, 4)

**Instrument:** `S\e270.js <tree>`: one shell and ONE preview model per case, kept across every step and updated after each
(the page keeps one model; P's rows build a fresh model before each ghost). For each case: the ghost the app sends (the
panel's own `extendOptions` with every field as shown, then `candidate`, `candidateJump`, `st.undoGhost.candidate` or
`st.pieceGhost.candidate`); then the act (Extend as shown, Jump or Place; for Undo, the road before it, kept as its own
model); then the ghost against the road the model now shows, by lap distance: every station, the head, and every drawn mesh
batch paired in order with the placed model's (world vertices). Width brushes are Sculpt's grab (`beginFollow`) and the rate
brush, both on the shell's default `brushFn` (my L264 carry). Run on four trees: the merge, 8c78a59 (the fix alone), 15e7d62
(the hold alone) and c522ea6. **S** = `p-l270-read-ghost-E_2026-11-28_evidence/`.

checked: `S\e270_merge.jsonl`, `S\e270-fix.jsonl`, `S\e270-hold.jsonl`, `S\e270-base.jsonl` (34 rows each) →

| case (FLAT = 1,000 m + 1,000 m to 14 m wide; HIS = his D642 bank) | merge: stations / head / mesh | 15e7d62 | c522ea6 |
|---|---|---|---|
| a. Sculpt grab w +3, l +2 at end−10 r30, Extend as shown | 0 / 0 / 0 (58 of 58 batches) | 6.7954 m | 6.7954 m |
| a. grab w −3, l +2 | 0 / 0 / 0 | 6.7954 | 6.7954 |
| a. grab w +3, l −1.5 at end−25 r40 | 0 / 0 / 0 | 6.3768 | 6.3768 |
| a. grab w +6, l +2 at end−5 r20 | 0 / 0 / 0 | 6.0974 | refused, BAD_WIDTH −0.42948 m |
| a2. a sideways grab, then the rate width brush +1.37 (two steps) | 0 / 0 / 0 | 6.7954 | 6.7954 |
| b. grab w +3, w −3, w +5, no offset | 0 / 0 / 0, hash = 15e7d62's | 0 | 0 |
| e. a height grab at the head; height and sideways together | 0 / 0 / 0 | 2.5624; 7.6093 | the same |
| e. a local sideways brush at the head, Sculpt off (live model, and fresh) | 0 / 0 / 0, the two hashes equal | 2.5518 | 2.5518 |
| 3. HIS, sideways at the head (re-laid tail from 971) | 0 / 0 / 0 | 3.2020 | 3.2020 |
| 3. HIS, a hill in the middle, then sideways at the head | 0 / 0 / 0 | 2.0 (head 1.1072) | the same |
| 3. HIS, grab w +3, l +2 at the head | 0 / 0 / 0 (106 of 106) | 7.6163 | 7.6163 |
| f. the cheap (drag) ghost, coarse candidate: no offset; sideways at head; w+l grab; HIS sideways | 0 / 0 in all four | 0; 2.5518; 6.7954; 3.2020 | the same |
| d. the Jump ghost from a sideways head; a height head; after a w+l grab | 0 / 0 / 0 | 1.6647; 1.6647; 3.2397 | the same |
| d. the next piece after a placed Jump whose take-off had an offset | 0 / 0 / 0 | 1.9994 | 1.9994 |
| c. Undo of one piece; the second of two Undos; the first of two (an 80 m piece turning 20°) | 0 / 0 / 0 | 2.5518; 2.5518; 5.925 | the same |
| c. Undo, then Redo, then the next piece's ghost | 0 / 0 / 0 | 6.7683 | 6.7683 |
| c. Undo of the grab itself, then the next piece | 0 / 0 / 0, hash the same on all four | 0 | 0 |
| c. w+l grab, Extend, Undo: the undo ghost | 0 / 0 / 0 | 6.7954 | 6.7954 |
| the saved piece's ghost after a w+l grab, then Place | 0 / 0 / 0 | 1.6706 | 1.6706 |
| 0. no offsets: a plain road; a turn; HIS; a typed width | 0 / 0 / 0, hash the same on all four | 0 | 0 |

- **Merge: 34 of 34 at 0 m** on stations, head and mesh, every batch paired (counted over `S\e270_merge.jsonl`).
- **The positive control:** the same instrument reads up to 7.6163 m at 15e7d62 and at c522ea6, so it can see the fault.
- **Condition 2 (no offsets, no change):** 9 cases with no offset at the head hash the same at 8c78a59 as at c522ea6, and at
  the merge as at 15e7d62: the four plain roads, the three width-only grabs, the cheap ghost with no offset, and the grab
  undone. A width-only grab leaves `l` and `h` at 0, so the lift returns the very path and the hold alone decides the ghost.
  (Read against 15e7d62 for the merge, not c522ea6: the hold rightly changes what a width brush's next piece is.)
- **Condition 3 (no double lift):** the banked cases lift the re-laid tail once: 0 m, where twice would be 3.2 m or more.
- **The two branches together:** the width-grab cases are 0 on the merge and 0 on 8c78a59 alone. The one case 8c78a59 refuses
  (w +6: BAD_WIDTH, as c522ea6 does) the merge builds, at 0. So 33 of 34 at 0 on 8c78a59, the 34th refused.
- **A Jump's head** is 0 on every tree: `jump()` lands where it lands whatever the offset; the miss before the fix is along the
  take-off.
- Four brushes said "brush widened to …" (the app widens a window to whole knot spans); kept per row as `notes`, not failures.

## 4. Condition 7, and the older thing it uncovers

**The CHANGELOG's bound is not a bound.** At c522ea6 the old ghost's miss is the new piece's own offset, and that runs on.
checked: `S\ghostlen.js` on c522ea6 → after a sideways 2 m brush at 1980 r60 (the head's `l` 1.6647, changing −0.04216 m per
m), the next piece's ghost head lies **10.9848 m** from where placing lays it on a 300 m piece and **40.5003 m** on 1,000 m; a
height brush the same, 40.5003 m. On the merge: 0, 0, 0.

**Why: Extend as shown carries an offset's slope on, for the whole piece.**
checked: `S\runon.js` on c522ea6 and on the merge, the same numbers on both (`S\runon-base.txt`, `S\runon_merge.txt`) →
- sideways at the head: the new piece's `l` is 1.665 at 0, −0.444 at 50 m, −2.552 at 100 m; −10.985 at 300 m; **−40.5 m** at
  1,000 m. Height the same in `h`.
- a brush whose window ends short of the head: 0 all along (the control).
- inferred: an offset channel with no target "goes on as v + m*s", as the width did before the hold (`extend.js`, the rule P's
  13.2 quotes). The width hold (15e7d62) holds `w` only.

**What changes for him with this build:** before the fix, the ghost was drawn with no offset, running straight on from where
the road would be with no grab, and that hid this. After the fix the ghost is drawn where the piece will be, so after a grab
or hill that reaches the head, the hovered ghost swings away sideways or dives (2.6 m over 100 m here, 40 m over 1,000 m).
**The ghost is now right; the road it shows is the older question**, the same shape as his open one after the width hold
(should what a brush left still changing hold at the head?), now for the offsets. Not this fix's to change; for the chair to
put to him.

## 5. P's rows on the merge (condition 6)

checked: `S\ghost11_merge.tap` (9de0b18; P's section 5 list of 11 files: cheap-ghost, core-next-ghost-after-bank, drag-ghost,
ghost-relaid-tail, ghost-stalekey, piece-ghost, release-ghost, shell-ghost, undo-ghost-panel, undo-ghost, ghost-offset;
`node --test --test-concurrency=1 --test-reporter=tap` under heavy-run at BelowNormal; it waited for a slot behind P's and C's
runs, then ran 25.1 s) → **tests 76, pass 76, fail 0, cancelled 0**. P's 76 at 8c78a59 hold on the merge.
- `drag-ghost.test.js`, the meeting point, is green on the merge: TAP 10-16, rows 1-7 `ok`. O's unwelcome outcome
  "drag-ghost.test.js is red only on the merge" did not happen.
- N5 rows 1-7 are `ok` (TAP 17-23).

## 6. Not done, said plainly

- No picture: role 2 takes the pictures of the preview (packet). My cases are in node, on the model the page uses.
- No timing figure. inferred: on a document with an offset, the copy-and-extend ghost now runs `offsetPath` over the whole path
  for every ghost, the drag's cheap one included (P's 12 says the same for the full ghost). `offsetPath` skips a sample on a
  piece with no offset at once, so the cost is one pass over the samples. Not measured.
- No Even case of my own: B's 2.4 (1.94 m after an Even) is P's row 4, among the rows in section 5.

## Corrections

- **My own registration named a stale pin.** Section 0, condition 5, says row 5's pin is "the width hold's
  (`eb3501a2c3eec581`)". That was the pin I read at L264 (e112a14). The width hold moved it twice since (L268, then D678); at
  15e7d62 it is `015881f53acdbc5f`. The condition as meant (the pin is the width hold's, untouched by the merge) holds; the
  figure I wrote was already out of date.
- **My first mesh comparison was wrong.** It paired batches by name, and names repeat inside a piece, so it read 98 m on a plain
  road. Fixed to pair in order, checking name and piece; every number above is from the fixed instrument.
- **My first run stopped three cases on "brush widened …"**, an information message, not a refusal. Fixed to stop only when the
  document did not change.

## The machine

- Worktrees `Downloads\t180-wt-e-l270`, `-base`, `-hold`, `-fix` (detached at 9de0b18, c522ea6, 15e7d62, 8c78a59).
  checked: each `git status --short` empty and no links → `git worktree remove` on all four; `git worktree list` has no
  `e-l270` row, and the folders are gone.
- No push, no merge, no build, nothing committed to the builder. No browser opened. His tracks folder not read.
- The node probes ran as single processes at BelowNormal (`start /belownormal`), with no timing session held
  (`S\hr_status_before.txt`); the 11 test files under heavy-run.
