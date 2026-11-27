# D678 N5: the next piece's ghost drawn without the road's offset, mended on d678-ghost-offset-p 5127aad (pane P, 2026-11-27)

Seat: pane P (sibling-372c8abc, D). This answers the chair's N5 packet (sent 2026-11-27T21:34:52Z; the order is
`exo_memory/loop/packet_t180_sculpt_even_build_on_D_2026-11-27.md`, "Amended 15:4x", N5) and its addition (21:41:14Z, the flat road, "Added 15:5x",
`:132`). Tier: CHECK IT. Worktree: `Downloads\t180-wt-p-d678`, branch `d678-ghost-offset-p`, made from c522ea6.

**S** names the evidence folder beside this file, `p-d678-ghost-offset-P_2026-11-27_evidence/`:
- it holds the scripts, TAP files and outputs named below, and the pictures in `pics/`;
- it is UNTRACKED and stays so, because some of its outputs carry the machine's own paths;
- the files were made in this seat's session scratchpad, folder `d678`, and copied there.

## 0. The answer first

- **B's reading holds, both halves.** The ghost is the wash; the wash is not Even's; it is on c522ea6. On the flat road the next piece's ghost begins
  beside an offset head. One cause: **the ghost was never lifted by the road's offsets (h, l)**, which placing applies.
- **The mend is in two places, and each is needed** (section 4 runs each half alone):
  - `app/core/coreshell.js`: the candidate hands on its own document's lift (`liftFor`), as `resolvedOf` hands on the placed track's. This is
    B's probable mend, as B named it.
  - `app/preview/trackmodel.js` `ghostSteps`, the copy-and-extend branch (any road with no re-laid tail): it never read a lift at all. It now
    lifts the ghost's path with the candidate's lift and meshes on the lifted path with the lift keys, as `update()` does when it places. With no
    offsets anywhere the lift returns the very same path, and the ghost is built exactly as before.
- **Rows:** `app/test/ghost-offset.test.js`, four rows. Rows 1, 2 and 4 are red at c522ea6 and green on the branch. Row 3 is a control, green on both.
- **The existing ghost tests:** 10 files, green before and after (section 5).
- **Pictures:** sections 6 and 7, kept untracked beside this file.
  - Banked: the lavender wash went from 22,274 and 2,662 px to the floor, 66.
  - Flat: the next piece's ghost starts 1.6086 m beside the head before and on it after.
- **Pushed:** `d678-ghost-offset-p` = 5127aad. No build, no install, no merge to builder main.
- **Findings, not mended here:** the Jump ghost and the undo ghost have the same fault (2.47 m and 2.55 m beside, measured), and the piece ghost is
  built the same way (section 8). Also one page observation, a next piece with no preview after a width grab at the head (section 9).

## 1. The cause

- **The banked road (B's 2.1).**
  - On a banked road the next piece re-lays the last piece's bank (D642), so `ghostSteps` takes its re-laid branch. That branch lifts the ghost by
    `candidate.lift` when there is one.
  - The shell's `candidate` carried none (c522ea6 `coreshell.js:818-819`). So the lift keys differed from the placed ones from the first offset
    segment, and the ghost ran from there to the head as the road with no offset. It is drawn see-through over the placed road.
- **The flat road (B's 2.4).**
  - A road with no re-laid tail takes the copy-and-extend branch. That branch copies the placed BASE path (unlifted), extends it, and meshes on it.
    It reads no lift, so the shell half alone cannot reach it.
  - Placing lifts the new piece too (it carries the head's `l`), so the placed piece starts at the offset head. The ghost started at the unoffset
    head.

checked: `S\n5probe.js` on the banked road with a 2 m grab in its middle →
- c522ea6: the ghost from segment 650 (s 1300); sideways grab 2 m off at s 1500; height grab 2 m off.
- branch: from 971 (s 1942), the re-laid tail the bare road has; 0 and 0.

checked: `S\n5flat.js` on a 2,000 m flat road, a sideways 2 m grab whose window reaches the head →
- c522ea6, the new piece's ghost from where placing lays it:
  - centre 1980, r 60: head l 1.6647, **2.5518 m**;
  - centre 1950, r 100: head l 1.0153, 2.7467 m;
  - centre 2000, r 50 (widened to 60 by the brush): head l 2, 2.3465 m;
  - centre 1500, r 200 (the window does not reach the head): head l 0, 0 m.
- branch: 0 in all four.

## 2. The rows, red first

`app/test/ghost-offset.test.js`:

| row | what | c522ea6 | branch |
|---|---|---|---|
| 1 | his D642 bank (88.45° over 1,000 m), a sideways 2 m grab in its middle: the next piece's ghost starts at the re-laid tail, lies on the placed road, head included | red: re-laid start 650, expected 971 | green |
| 2 | the same, a height grab (a hill) | red: 650, expected 971 | green |
| 3 | control: a road that ends at rest, a sideways grab, the copy-and-extend ghost matches placing | green | green |
| 4 | (the chair's addition) a flat road, a sideways 2 m grab whose window reaches the head (l 1.66 m there): the new piece's ghost lies where placing lays it, head included | red: 2.5518 m off at s 2100 | green |

The checks behind the table:
- checked: `S\n5-red-c522ea6.tap` (rows 1-3, commit 2f3f8b7, the code at c522ea6) → tests 3, pass 1, fail 2.
- checked: `S\n5-red2-c522ea6.tap` (rows 1-4, commit 88c4d47, the code at c522ea6) → tests 4, pass 1, fail 3.
  - Row 4: "the new piece's ghost lies where it is placed: 2.5518 m off at s 2100".
- checked: `S\n5-green2.tap` (the mend) → tests 4, pass 4.

The row commits are the code at c522ea6 plus the test file only:
- 2f3f8b7 (rows 1-3);
- 88c4d47 (row 4);
- 5127aad is the mend.

**What is drawn, not only the path** (the rows compare paths; the violet is the mesh). Measure: every ghost cell, matched by piece and name to a
freshly built model of the placed track, world vertex for vertex.

checked: `S\n5mesh.js` →

| road | c522ea6 | branch |
|---|---|---|
| bank, sideways grab | 400 cells from segment 650, **2 m** | 79 cells from segment 971, 0 |
| bank, height grab | 400 cells from segment 650, 2 m | 79 cells from segment 971, 0 |
| flat, sideways grab at the head | 50 cells from segment 1000, **2.6446 m** | 50 cells, 0 |

## 3. The mutation anchors

The mutation harness is not run (tier check it). Instead: every mutation row whose file is `trackmodel.js` or `coreshell.js` keeps its anchor
exactly once.

checked: `S\anchors.js` → 51 anchors on the two files, 0 not exactly once, on the branch and at c522ea6.

## 4. Each half alone

Run in a throwaway worktree, with the rows file at 5127aad. Removed after: `git worktree remove`, and the folder is gone.

- **The shell half alone** (`trackmodel.js` at c522ea6):
  - checked: `S\n5-shellhalf.tap` → pass 3, fail 1.
  - Rows 1 and 2 are mended. Row 4 is still red at 2.5518 m.
- **The preview half alone** (`coreshell.js` at c522ea6):
  - checked: `S\n5-previewhalf.tap` → pass 1, fail 3.
  - With no lift handed on there is nothing to lift by.
- **So one cause, mended in two places.** The chair's "one fix" holds for the cause, not the file count.

## 5. The existing ghost tests, before and after

The 10 files: `app/test/` cheap-ghost, core-next-ghost-after-bank, drag-ghost, ghost-relaid-tail, ghost-stalekey, piece-ghost, release-ghost,
shell-ghost, undo-ghost-panel and undo-ghost. Run with ghost-offset, `node --test --test-concurrency=1 --test-reporter=tap`, under heavy-run at
BelowNormal, "(not a timing session)".

- checked: `S\ghost-before.tap` (at 2f3f8b7, the code at c522ea6) → tests 72, pass 70, fail 2. The two are N5 rows 1 and 2 (TAP 17 and 18).
- checked: `S\ghost-after.tap` (at 5127aad) → tests 73, pass 73, fail 0.
- So the 10 files' 69 rows are green before and after.
  - inferred: 69 = 72 − 3 N5 rows before, and 73 − 4 after.

Among them, `release-ghost.test.js` row 3 hashes the placed mesh and two full ghosts against c2d7cb5. Row 8 holds "placing the ghost on show takes
its work, the track the same to the byte". Both are green after, which is the check that a road with no offsets builds its ghost as before.

## 6. Pictures: the banked road (before and after)

Method: B's `washpage678.js`, as `S\pic678.js`:
- A's B− document;
- T1 is one Sculpt width grab at 320, T2b is eight grabs 215..425, each to 16 m wide with one rim held;
- restored into a headless page (`--mute-audio`, title `zz-headless-test`), which opens with Sculpt OFF;
- the ground grid on, focus at s 365;
- photographed with the drag handles on (his default) and then unticked;
- lavender pixels counted in the view (B's count; 66 is the page's floor);
- the ghost read back against the placed track (`t180:ghost-request`, `t180:track-request`).

checked: `S\pics-before.out` (2f3f8b7, the code at c522ea6) and `S\pics-after.out` (5127aad) →

| document | before: ghost vs placed (handles on) | before: lavender px on / off | after: ghost vs placed | after: lavender px on / off |
|---|---|---|---|---|
| bankT1 (one grab) | 2 m sideways at s 320, 0.2403 m in height | **22,274** / 66 | 0, 0 | **66** / 66 |
| bankT2b (eight grabs) | 2.04 m sideways at s 380, 0.2452 m in height | **2,662** / 66 | 0, 0 | **66** / 66 |

- After the mend the wash is gone: the count is at the floor with the ghost on.
  - The ghost is still shown and still read back (346 stations, s0 590).
- bankT2b's 2,662 before is B's figure to the pixel (B's 2.1 table).

The pictures, in `S\pics\`:
- `n5_before_bankT1_sculpt-off_handles-on.png` (the whole turn washed lavender) and `n5_after_bankT1_sculpt-off_handles-on.png` (the plain road);
- the same pairs for bankT2b;
- the handles-off pair of each.

## 7. Pictures: the flat road (before and after)

**The document.** A's flat turn: 200 m, four 60 m corners of 30°, then 150 m, width 12, the head at 590.
- The grab is row 4's: sideways, 2 m, centred at 570 over r 60, with Sculpt off (Sculpt refuses that brush).
- checked: `S\flatcheck.js` in node → at c522ea6 the head's l is 1.6086 m. The ghost starts 1.6086 m from where placing lays the piece, and lies up
  to 3.2034 m off over the new piece. On the branch: 0 and 0.

**The view.** The page opened with Sculpt off, focused at s 600, without the right-drag.
- The script clicked Overhead first. The HUD still read "Free view", so the picture is the focus view, looking down the head's straight onto the
  next piece.

checked: `S\pics-flat-overhead-before.out` (c522ea6) and `S\pics-flat-overhead-after.out` (5127aad) →

| | ghost's first station against the placed head | lavender px, on / off |
|---|---|---|
| before | **1.6086 m** | 21,388 / 64 |
| after | **0** | 21,525 / 64 |

- On a flat road the next piece's ghost is drawn whether or not it is right, so its lavender count is high both times.
  - The discriminator is where it starts.
  - In `n5_before_flatHead_sculpt-off_handles-on.png` the ghost's road starts out to the left of the placed road's end, its centre line off the
    road's.
  - In `n5_after_flatHead_sculpt-off_handles-on.png` it continues the placed road edge for edge, one centre line.
- The script's "over the shared stations" reads 1.999 m before. It compares the ghost's whole path, which before the mend was the placed path
  unlifted, so it counts stations that are not drawn. The head figure and the picture are the ones to read.

## 8. Findings: the same missing lift in the other ghost senders (not mended here)

N5 is the next piece's ghost. These three build their candidate the same way, with no lift.

- **Jump** (`coreshell.js:725` `candidateJump`).
  - checked: `S\n5siblings.js`, the flat road with its head moved (row 4's road) → the Jump ghost lies **2.4675 m** from where `jump()` places
    it.
  - The same at c522ea6 and on the branch.
- **The undo ghost** (`coreshell.js:426` `undoGhostOf`).
  - checked: the same script, Extend 100 m after the grab, then Undo → the undone piece's ghost lies **2.5518 m** from where it was.
  - The same on both.
- **The piece ghost** (`coreshell.js:1319`, the saved piece at the head).
  - The candidate is `{ segments, closed, start }` with no lift.
  - inferred: the same fault on a road with offsets near the head. Not run (it needs a storage with a piece in it).
- Each mend would be one field, `lift: liftFor(<its document>)`, now that the preview lifts both branches. I left them for the chair's word: the
  packet names the next piece's ghost.

## 9. Observation, not run down: a next piece with no preview after a width grab at the head

My first flat document for the pictures was A's flat turn, with a Sculpt width grab (one rim held) at s 575 over r 30 to 16 m, the head at 590.

- On the page at c522ea6 the panel showed "no preview of this piece: BAD_WIDTH: the road's width must be positive, got -0.1041800000000001 m".
  - The NEXT line read cup 13.27° → −18.30°, with width 14.13 m.
  - There was no ghost at all.
- checked: `S\badwidth.js`, the same grab in node, the next piece named with width 12 → the candidate builds and Extend places.
  - So it is the panel's carried fields (the width and the cup read off the head), not the grab alone.
  - inferred: a real case he could meet (a width grab at the head, then hover Extend). Not run down; for the chair to route.
- The page's pictures are kept as `n5_before_flatHead-widthgrab_*.png`, beside the others.
- Its JSON (`pic678_before_flatHead-widthgrab.json`) overwrote the banked run's JSON of the same name. The banked figures are in
  `S\pics-before.out`, which section 6 reads (Corrections).

## 10. Housekeeping

- **Headless pages:** five runs, every one `--mute-audio`, titled `zz-headless-test`, 0 page errors, fatal none, and the temporary profile removed
  (`profileLeft none`).
  - The five: the banked before; the width-grab flat before; the drag-view flat before with all three after; and the Overhead-focus flat before and
    after.
- **TabProxyWindows:** counted before and after each run, 0 and 0 every time (`S` `tabproxy-*.txt`), including the heavy-run wait that ran no page.
- **Priority:**
  - Under heavy-run at BelowNormal: the 11-file ghost runs and the first two picture runs.
  - The later picture runs were lockless at BelowNormal (Corrections).
  - checked: `S\lowpri.js` printed priority 10 = BelowNormal for each.
- **Processes:** checked: a search of every process's command line for this lap's scripts, profiles and worktrees → 0.
- **Worktrees:**
  - My c522ea6 worktree (`Downloads\t180-wt-p-d678-base`, for the before pictures) was clean, with no links, and was removed. So was the
    throwaway tree of section 4.
  - `Downloads\t180-wt-p-d678` stays: it is the branch's.
- **Not touched:** his game, the installed builder, acs.exe, his tracks folder, the AC content folder and D's pieces folder. Nothing was built and
  nothing installed.

## 11. Corrections

- **The flat picture's first document was the wrong case.** The width grab at the head left the next piece with no preview (section 9), so there
  was no ghost to photograph. Remade with the sideways grab of row 4.
  - Under Sculpt that brush is refused ("SCULPT_CHANNEL … Turn Sculpt off to use it"), so the grab is made with Sculpt off, as row 4 makes it.
- **The picture script's JSON was overwritten.** Its first form wrote `pic678_<label>.json` per run, so the first flat run overwrote the banked
  before JSON. The banked figures survive in `S\pics-before.out` (one line per document). The script now names the JSON by its documents too.
- **A heavy-run wait gave up.** The second flat before-picture waited 30 min for a slot and gave up (exit 3), with both slots held by O's mutant
  batches and A's design pass.
  - The picture is one headless page, not a run of over 3 test files, and no holder named a timing session (status read on its own first).
  - So it ran without the lock, at BelowNormal (`S\lowpri.js`; the browser inherits the class).
- **The first flat pictures did not show the case.** The banked documents' right-drag view showed the placed straight, not the head, so the before
  and after frames looked alike although their figures differ (1.6086 m and 0 at the head). They are set aside as `n5_*_flatHead-dragview_*`,
  and retaken from the focus at s 600 without the drag (section 7).
- **The first ghost-before run never ran.** It went through `cmd /c` from Git Bash, which mangled the `/c`, so cmd opened a prompt and exited. Re-run
  with `node --test` directly.

## 12. The branch

- `d678-ghost-offset-p` on t180's origin, 3 commits on c522ea6:
  - 2f3f8b7 (rows 1-3);
  - 88c4d47 (row 4);
  - 5127aad (the mend and a CHANGELOG "Fixed" entry).
- The code map (`MAP.md`) is not changed: no file's role changed.
- checked: the scan of the branch's 111 added lines and its messages:
  - emails 0 (the messages' only address is the Co-Authored-By noreply);
  - account paths 0;
  - key shapes 0;
  - the reference key's track names 0.
- checked: `git push origin d678-ghost-offset-p` → `[new branch]`, exit 0.
  - The push gate's row: 2026-11-27T22:09:40.570Z, allow.
  - `git ls-remote origin refs/heads/d678-ghost-offset-p` → 5127aadf19fa84d278e3de11313d96325ed75700 = HEAD.
- inferred: cost. The extend branch now makes one `offsetPath` per ghost on a document with offsets (placing already makes one per placement).
  - Not timed: no timing figures while his game may run.
  - The drag and cheap ghost rows are green.

## 13. Step 2 (added 16:4x): the sibling ghosts mended; the no-preview case on the width hold's tip

This answers the chair's second N5 step (sent 2026-11-27T22:26:58Z), on the librarian's ruling in
`exo_memory/loop/packet_t180_sculpt_even_build_on_D_2026-11-27.md`, "Added 16:3x" (`:151-`).
- Sections 8 and 9 above are what it rules on; they keep their words.
- The trailer below replaces step 1's. Step 1's lines are in git at dbcba583.

### 13.1 The three sibling ghosts, mended on the same branch

Three new rows in `app/test/ghost-offset.test.js`, all on row 4's road (a sideways grab moved the head 1.66 m):

| row | ghost | measured against | at 5127aad | at 8c78a59 |
|---|---|---|---|---|
| 5 | Jump (`candidateJump`) | where `jump()` places it | red, **2.4675 m** at s 2098 | green |
| 6 | the undo ghost (Extend, then Undo) | the track before the Undo | red, **2.5518 m** at s 2100 | green |
| 7 | the saved piece's ghost (`showPiece`) | where `placePiece` lays it | red, **1.6647 m** at s 2000 | green |

**Row 7's stored piece** lives in a storage held in memory, so nothing is written to disk:
- One 100 m straight, written by `piece.js` `saveRun` the way Save as piece writes it.
- The storage answers only what `showPiece` and `placePiece` read: `listPieces`, `openPiece` and the autosave stubs.

**The rows and the mend:**
- checked: `S\n5s-red-5127aad.tap` (985d3f8, the rows on 5127aad's code) → tests 7, pass 4, fail 3, with the figures above.
- **The mend (8c78a59) changes one field in each sender**, as section 8 said: `candidateJump`, `undoGhostOf` and `showPiece`'s
  candidate now hand on `liftFor(<their document>)`, for `d`, `was` and `after` respectively.
- checked: `S\n5s-green.tap` → tests 7, pass 7.
- checked: `S\anchors.js` → 51 anchors in `coreshell.js` and `trackmodel.js`, 0 not exactly once.
- checked: `S\ghost-after2.tap` (8c78a59, section 5's 11 files under heavy-run at BelowNormal) → tests 76, pass 76, fail 0. That is the 69
  existing rows plus N5's seven.
- The CHANGELOG's N5 "Fixed" entry now names all three.

### 13.2 Section 9's case on the width hold's tip (15e7d62)

**The setup**
- A detached worktree at `l264-extend-holds-width-b` 15e7d62, `Downloads\t180-wt-p-d678-hold`. It was clean, and it is removed now.
- The case is section 9's: A's flat turn, head at 590, with a Sculpt width grab (one rim held) at s 575, over r 30, to 16 m.
- Then the next 100 m piece, with every field left as shown. The panel sends no target for those:
  `extendOptions({ length: 100 })` = `{ length: 100, targets: {} }`.

**In node**

checked: `S\noprev.js`, run on c522ea6's core and on 15e7d62 →

| | c522ea6's core | 15e7d62 |
|---|---|---|
| the head's width, and how fast it is changing | 14.1259 m, **−0.2635 m per m** | the same |
| the next piece's ghost | refused: BAD_WIDTH "the road's width must be positive, got -0.1041800000000001 m" | **built** |
| Extend | refused, same words | placed |
| the new piece's width at 0, 50 and 100 m | 14.1259, 0.9499, **−12.2261** | 14.1259, 14.1259, 14.1259 |
| the NEXT line's cup (the readout) | 13.2697° → **−18.2964°** | 13.2697° → 13.2697° |

"c522ea6's core" means this branch's worktree, which changes no file under `src/core`.
- checked: `git diff c522ea6 HEAD --stat -- src/core` → 0 lines.

**On the page**

checked: `S\pics-hold.out` (15e7d62, one headless page under heavy-run at BelowNormal) → the ghost is shown and read back (346 stations, s0 590).

Read off the pictures, because my script's text read found neither line (`note: null` and `nextLine: null` on this page, so its selector is unproven):

| picture | "no preview" note | ghost | NEXT line |
|---|---|---|---|
| `S\pics\n5_before_flatHead-widthgrab_sculpt-off_handles-on.png` (c522ea6) | "no preview of this piece: BAD_WIDTH: the road's width must be positive, got -0.1041800000000001 m" | none | "cup 13.27° → −18.30°" |
| `S\pics\n5_hold15e7d62_flatW_sculpt-off_handles-on.png` (15e7d62) | none | drawn | "cup 13.27", one value with no arrow |

Both pictures show 14.13 in the width field.

**The librarian's reading holds.**
- The grab leaves the width falling 0.2635 m per m at the head.
- At c522ea6, Extend with the fields as shown carries that on: extend.js says a channel with no target "goes on as v + m*s". The width is 0.95 m
  at 50 m and −12.23 m at 100 m.
  - inferred: it crosses 0 near 53.6 m (14.1259 / 0.2635).
- The hold brings the width to rest, and **the preview comes back, in node and on the page.**

**One thing 15e7d62 leaves: the ghost that comes back is off by up to 2 m.**
- checked: the page's read-back (`S\pics-hold.out`) → the ghost lies **1.0602 m** beside the placed road at the head. It is up to 2.0196 m
  across and 0.2427 m vertically.
- That is N5's own fault: 15e7d62 does not carry 5127aad, and the grab moved `l` to −1.0526 m at the head.
  - inferred: with this branch beside it, the offset is 0. Not run together.

**What the cup does in the NEXT line**
- The cup does not run on in this case. The width does, and the cup reading follows it.
- These pieces carry no cup of their own:
  - checked: `S\legacycup.out` → family `bowl`, `cup` not set.
  - checked: `S\noprev-*.out` → the `c` channel reads 0 all along the new piece.
- So the NEXT line's cup is the legacy profile's edge angle, worked from the width (`src/core/readout.js:255`, `D.legacyEdgeDeg(family, w, r)`).
  - checked: `S\legacycup.out` → `legacyEdgeDeg('bowl', 14.1259, 2.993)` = 13.269704675, and at −12.2261 it is −18.296358650000002.
  - These are the readout's two numbers exactly.
- So **13.27° → −18.30° is a width of 14.13 m running to −12.23 m, read as an edge angle.** Hold the width, and the cup reading holds.

**For his question (should cup, bank and edges hold after a brush?), this case is a picture of the width only.**
- It shows nothing about a cup, bank or edge that a brush left still changing.
- I tried once to make the cup case in node (`S\cupcase.js`):
  - The road: cup 20° typed on every piece, then a cup brush (Sculpt off: under Sculpt the c brush at 575 was refused, SCULPT_CHANNEL) at 575, +10.
  - The brush widened to 56.25 m and left the head's cup at 20°, not changing. So no case of a brushed cup running on was made.
  - I did not go further: no cup code was asked for, and building that case is a step past the order.
- inferred: the picture he needs is a brush on a cup the road carries itself (not the legacy edge), whose falloff ends at the head while the cup
  is still moving.

**A number nobody asked for: the hold's ramp dips.**
- checked: `S\cupcase-15e7d62.out` (dip) → the new piece's width falls to **13.7237 m at 3.5 m**, 0.4022 m under the head's 14.1259 m. It is
  back to 14.1259 m by 20 m and holds there.
- The hold's commit (e112a14) measured 3.7 mm on its own case, where the width at the head was changing at −0.001005 m per m. This head changes
  0.2635 m per m, 262 times faster.
  - inferred: the dip grows with the head's rate. The joint keeps the head's slope (that commit: "The joint stays C1 (roadPiece holds the
    head's value and slope)"), so the width keeps falling for the first metres of the ramp before it turns.
- That is 40 cm over 20 m on a 14 m road. It is for the hold's builder to weigh; not photographed.

**Also seen:** the checker's red at 556–564 m and amber at 570–576 m, the same in both pictures. That is the grabbed road itself, not this case.

### 13.3 Housekeeping and the branch

- **The headless page:** one page, `--mute-audio`, title `zz-headless-test`, errors 0, fatal none, profile removed.
  - TabProxyWindows: 0 before and 0 after (`S\tabproxy-before-pics-hold.txt`, `S\tabproxy-after-pics-hold.txt`).
- **heavy-run:** the page and the 11-file run each waited for a slot, as the chair asked. Each ran on its first try, at BelowNormal, labelled
  "(not a timing session)".
- **The node reads** (`noprev.js`, `cupcase.js`, `legacycup.js`) ran lockless as single node processes, with no exclusive hold and no timing
  session named.
- **Processes:** checked: a command-line search → 0 left.
- **The 15e7d62 worktree** was clean, with no links, and was removed with `git worktree remove`.
- **The credential scan:** checked: the two new commits' 55 added lines and their messages → emails 0, account paths 0, key shapes 0, the
  reference key's track names 0.
- **The push:** checked: `git push origin d678-ghost-offset-p` → 5127aad..8c78a59, exit 0.
  - The push gate's row: 2026-11-27T22:38:16.755Z, allow.
  - `ls-remote` → 8c78a59c08e3749f2681b14853f5ed4f840a898f = HEAD.
  - No build, no install, no merge.
- **The code map** is not changed: no file was created, split or deleted.

BASE: Downloads\t180-wt-p-d678 5127aad (step 2's base; the branch is now 985d3f8, 8c78a59 on it; step 1's base was c522ea6); 15e7d62 (l264-extend-holds-width-b), read only

SOURCES: exo_memory/loop/packet_t180_sculpt_even_build_on_D_2026-11-27.md (N5 :132; "Added 16:3x" :151-); exo_memory/handback/p-d678-even-read-B_2026-11-27.md
(2.1, 2.4); t180 app/core/coreshell.js, app/preview/trackmodel.js, app/test/ghost-offset.test.js, CHANGELOG.md at 8c78a59; t180 src/core/readout.js:255;
e112a14's message; the evidence folder's TAP files, outputs and pictures named in each section; C:\Consonance\data\push-gate.jsonl (the 22:09:40.570Z and
22:38:16.755Z rows)

NEXT: librarian read section 13 and collate it into the D678 pass when it rings; the chair routes the hold's 0.40 m ramp dip (13.2) to the hold's builder,
and puts the cup-case picture (13.2) to him with his open question, when it next routes D678
