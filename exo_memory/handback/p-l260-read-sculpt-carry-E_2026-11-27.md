# L260 track 7 read, pane E (L): Sculpt's bank drag carries past a turn, 2067c88..7b3926e: NOT CLEAN, on one hold the change does not name

BASE: C:\Users\zackn\Downloads\t180-track-builder 7b3926e (`l-bankcarry-a`, local; read 2067c88..7b3926e = 0023853, 7b3926e)

**Verdict: NOT CLEAN, narrowly. Sculpt's bank HANDLE stops carrying at ±720.**
- **Where it stops:** on a piece whose middle is past two turns, its first step jumps to ±720 (the wrong way when the drag is outward), then holds
  there. A piece inside ±720 dragged outward stops at ±720.
- **The cause:** the handle clamps its value to the bank kind's range, −720 to 720 (`handles.js:54`, applied in `targetFor`, `handles.js:325`).
  The panel subtracts the UNWRAPPED middle (`panel.js` handles host, `delta = value − sculptDrag.base`).
- **Before D677 (2)** the drag was wrapped within one turn, so the range never came into reach.
- **The CHANGELOG** says Sculpt's handle and the brush "now send the change as given". It names two holds at one turn (the ghost handle crossing
  from inside one; the extra handle's ±360), not this one.
- **The brush has no such hold.**

Measured through the panel's own handle host (core-pieces-ui's `handlePanel` and `followMark`: a pointer stepped along the handle's screen axis, 1
px a step), at 7b3926e and at 2067c88 (`h_tip.txt`, `h_base.txt`; the cases in `e260_rows.part.js`):

| piece (its middle) | drag | 2067c88 | 7b3926e |
|---|---|---|---|
| 340 → 392 (366), control | up 30 px | first step −359.55, unwinds to 19.5 | **366 → 379.5**, one way (A's row) |
| 350 held (350) | up 60 px, across 360 | 350 → 17, not one way | **350 → 377**, one way |
| 710 held (710) | up 30 px, across 720 | first step −359.55, ends at 0 | rises to **720 and stops there** |
| 700 → 760 (**730**) | up 30 px | first step −730, ends at 0 | first step **−10** (down, to 720), then **720 for all 30 steps** |
| 700 → 760 (730) | down 30 px | first step −730, then 356.5 | first step −10 (to 720), then down to 716.5 |
| −700 → −760 (**−730**) | down 30 px | first step +730, ends at 0 | first step **+10** (up, to −720), then held at −720 |

- **Not a regression:** at 2067c88 the same drags unwound a whole turn or two.
- **Against his answer 6, "keep rolling":** past ±720 the handle does not keep rolling, and on a piece already past ±720 a drag outward moves the
  road the other way by the overshoot.
- **Reachable on his tracks?**
  - inferred: none of L's tracks reaches it. A measured their largest middle bank at 90°.
  - checked at L258: the builder's 17 test tracks hold no wound track.
  - A track wound to −720 exists on D: D's t13, his TEST 1 corkscrew. That is where it would bite.
- **The fix is not mine to choose.** The obvious ones:
  - give Sculpt's bank handle no range, as the brush has none;
  - or drive it by the travel rather than by `value − base`.
  - Either completes what his answer 6 asked; neither changes the ghost handle, which shares the kind.

My pre-registered condition fired (`evidence/first_pass_E.md`, written before A's hand-back was opened): *"a Sculpt drag or brush that the
CHANGELOG says carries, jumping round a turn or holding somewhere it does not name"*.

## What A fixed, varied (checked)

**My four items from the 01:25 amendment are in as written:**
1. **The sentence is corrected.**
   - `CHANGELOG.md`: D's entry has the corrected sentence, with its correction marked ("This entry first said those drags kept his 2026-10-06
     rule; a read of the change measured them carrying"), plus a new entry for this change.
   - The rows' header (`core-bank-carry.test.js:5-10`): it names 2067c88 for the ghost and extra handles and D677 (2) for Sculpt's handle and the
     brush. checked by reading the diff.
2. **The ghost handle's roll, through the handle's own path:** `core-pieces-ui` "D677 (ghost handle)", a pointer drag on the rig's fake stage
   (`dragBy`). That is stronger than my E1, which could only make the handle's write. checked, by running it: A's row from 7b3926e, run against f3cd425 (`ghostrow_f3cd425.txt`), is **red**: "the head is -36.500000001264496 for the field's -36.5" (the road unwound to the field). It is green at the tip (row "Rows").
3. **The flowing offer: W5, both signs**, a guard that is green on the base too. Mutant B9 (my F1) is caught by it. checked: **applied 9 / caught 9 / NOT APPLIED 0**, B9 caught by W5 (`touched_tip.txt`).
4. **The whole-turn edge is not changed:** `panel.js` and `handles.js` are not in the diff (`git diff --stat 2067c88 7b3926e`: 6 files, none of
   them). It stays with him; I read it and do not rule on it.

**The carry itself, beyond A's rows:**
- **A closed lap** (G6's wound lap, closed by `closejob.runCloseBest`, then in the shell), `closed_sculpt.txt`:

| on the wound piece (middle −376) | 2067c88 | 7b3926e |
|---|---|---|
| Sculpt −10 | → −26 (unwound) | **→ −386** |
| Sculpt +10 | → −6 | **→ −366** |
| brush −10 (r 60) | → −50.5 | **→ −385.3** |

  On both trees the lap stays closed, its seam stays −360, and **Undo gives back the same bytes** (sha256 equal).
- **Across 360 from inside one turn:** Sculpt now rolls on (350 → 377 through the handle host; A's S2 through the shell). The ghost handle at the
  same crossing still writes 10 (`core-pieces-ui` D259, green). The two handles now answer one gesture differently. The CHANGELOG names it as his
  to rule on, and I do not rule.

## Rows (at 7b3926e)

checked: `node heavy-run.js --run --priority belownormal … -- node --test` over `core-bank-carry`, `core-sculpt`, `core-pieces-ui` and `core-bank-carry-mutation` → **96 of 96** (13 + 15 + 57 + 11; `touched_tip.txt`). In the harness each of B1 to B9 is applied and caught by its own row: B7 by S1, B8 by S3, B9 by W5.

A's other figures I did not re-run:
- the 55 files at 0023853 (883 tests, 877 pass, 0 fail, 5 skipped, 1 todo);
- the five harnesses that rewrite `coreshell.js`;
- his tracks under 274 drags.
inferred: 7b3926e adds one row in one test file to 0023853 (`git diff --stat 0023853 7b3926e`), so those figures stand for the tip but that row.

## A's hand-back, against my reading

- **Holds:**
  - the one-line change and why it covers both drags (both reach `brushTo`);
  - the crossing answer, which rolls on, and its reason;
  - the amended rows, renamed with a pointer and not quoted; `near` lost the old `|got| < 360` bound;
  - the red-first table (my base runs agree: S1's −366 → −16 is my H0's unwind; the closed lap's −26).
- **"For a refactor", point 2** ("the handle's shown value and its dragged value are in different turns, and only one line keeps them apart") is
  the right place to look, and the finding above is its next case. The dragged value is also CLAMPED to ±720 (`handles.js:325`), while the base
  it is measured from is not. Add it to that list.
- **Not stated by A:** the ±720 hold on Sculpt's handle.

## Corrections, mine

- **None this lap changed a figure.**
- A note on the table: each handle-host drag is 30 (or 60) pointer steps of 1 px at 0.45 °/px, so it asks 13.5° (27°). The 710 case reaches 720 at
  about its 22nd step, which is why the table gives where each drag ends, not "13.5° added".
- **My first-pass expectation 1 held:** a hold at ±720, and a jump on the first step on a piece past it.

## The machine

- **Trees:** my own detached worktrees `Downloads\t180-wt-e-l260` (7b3926e), `-l260b` (2067c88) and `-l260f` (f3cd425, for A's ghost row only).
  - The scratch test copies (`app/test/zz-e260-*.test.js`) were deleted before each tree was removed.
  - All three were checked clean (0 changes) and removed. `l-bankcarry-a` is still 7b3926e; nothing was committed to the builder.
- **Runs:** every multi-file run went through `heavy-run.js --status` and `--run --priority belownormal`, in the background. B's whole suite held a
  slot throughout.
- **No browser.**
- **His saves:** not opened (A's copies covered them); no track name in this file or its evidence.
- No push, landing or build.

SOURCES: the packet's Track 7 and Amendment 01:25; handback/p-l260-sculpt-carry-A_2026-11-27.md (whole); builder git diff 2067c88 7b3926e; evidence/ (first_pass_E.md, e260_rows.part.js, h_tip.txt, h_base.txt, closed_sculpt.js, closed_sculpt.txt, touched_tip.txt, ghostrow_f3cd425.txt)
NEXT: librarian route the ±720 hold to the chair when this is rung; a one-line completion of track 7 (no range on Sculpt's bank handle, or travel-driven) is the builder's if the chair sends it

---

## 2026-11-27 03:5x local (L): the ±720 completion, 7b3926e..e7b9128: CLEAN

BASE: C:\Users\zackn\Downloads\t180-track-builder e7b9128 (`l-bankcarry-a`, one commit on 7b3926e; local, not pushed)

**Verdict: CLEAN.** The hold my table above found is gone, by every input the handle has, and nothing else moved.
- **No range on Sculpt's bank handle**, lifted only for that handle: `handles.js` `rangeOf`, read by `targetFor` and the wheel; `panel.js:1018`, the
  Sculpt model's `ctx` for `bank` only.
- None of the NOT CLEAN conditions I registered before opening A's section fired (`evidence/first_pass_02-38.md`).
- The order: `packet_…:81`, "Amendment, 02:38". The object: A's section "Amendment 02:38", read whole after my first pass.

**My middle-730 case, and the rest of my table, through the panel's own handle host** (`followMark`, 1 px a step, 0.45° a pixel), at e7b9128
(`e261_tip.txt`; the cases are `e260_rows.part.js`, as before, plus `e261_rows.part.js`):

| piece (its middle), gesture | 7b3926e (my table above) | e7b9128 |
|---|---|---|
| 700 → 760 (**730**), up 30 px | −10 on the first step, then held at 720 | **730 → 743.5**, first step +0.45 |
| 700 → 760 (730), down 30 px | −10 at once, then on to 716.5 | 730 → 716.5, first step −0.45 |
| held at 710, up 30 px | stops at 720 | 710 → 723.5 |
| −700 → −760 (−730), down 30 px | +10 at once, then held at −720 | −730 → −743.5 |
| 350, up 60 px across 360 | 350 → 377 | the same |
| 730, up **400 px** | (not run) | → **910**, every one of 400 steps 0.45 |
| held at ±1070, 30 px out across ±1080 | (not run) | → ±1083.5, every step 0.45 |
| 730 held: ArrowUp, Up, Down, Down, Down; released; a wheel notch down | (A's probe: 720 at once) | 730.01, 730.02, 730.01, 730, 729.99; 729.99; wheel 729.98 |

- The label still shows the bank within one turn (743.5 shows 23.50°, 910 shows 190.00°).
- checked: A's rows 720a-720e state the same figures.

**The ghost's bank handle keeps its ±720 by every input** (the order's item 2; `e261_tip.txt` G4). The ghost's bank handle, with the field typed:
- **720:** a wheel notch up changes nothing (the field stays 720).
- **719.99:** two ArrowUps give handle values 720 and 720.
- **−720:** a wheel notch down changes nothing.
- A drag is A's 720g (from 710, the value stops at 720).
- Had the lift reached the ghost, the wheel at 720 would read 720.01.

### The chair's three questions

1. **Freeing the wheel and the arrow keys is inside the order, not a change he was not asked about.**
   - checked: they are the same handle's inputs, and they clamped on the same lines (the arrows through `targetFor`, the wheel on its own copy of the
     clamp, `handles.js:628`).
   - checked: at 7b3926e they showed the very defect the order names. A wheel notch or an arrow on the 730 piece moved the road to 720 at once (A's
     720e red and arrow probe; my G3 now steps by 0.01).
   - inferred, from `rangeOf`: inside ±720 the lift changes nothing for them, because nothing there reached the range. It does not reach the ghost's
     wheel or arrows (G4 above). "Sculpt's bank handle carries past ±720 as it does past ±360" covers every way that handle is moved.
2. **My middle-730 case carries both ways, from its first step** (the table). A drag outward goes 730 → 743.5 and inward 730 → 716.5, each step
   0.45, with no jump against the drag and no hold.
3. **The timing red (`core-extra-bank-drag-cost` row 1, D642) is not the change, by reading. A clean timing is OWED; I timed nothing.**
   - inferred: the row is a ratio of two p95s of the SAME extra-bank drag (the bank's ramp moving, against early), read in one process. That drag's
     model (the ghost's) sets no `range`, so the change adds one `rangeOf` call per move to both sides of the ratio, and nothing else.
   - inferred, from A's figures: A's alternating A/B (`l261/dragcost261.txt`) puts both trees across the 2× bar (the change 2.03 and 2.02, the base
     2.13 and 1.97) and was taken under load, with P's whole suite in the other slot. It is evidence of noise at the bar, not a timing.
   - **Owed: run row 1 on a quiet machine (no other heavy-run holder) at 7b3926e and at e7b9128, alternated as A did.** The landing pane's, or whoever
     holds a quiet window.

### Rows (checked, at e7b9128)

- **The rows:** `node heavy-run.js --status && node heavy-run.js --run --priority belownormal … -- node --test` over `core-pieces-ui`,
  `core-bank-carry`, `core-extra-bank-wind`, `handles`, `handle-step` and `core-bank-carry-mutation` → **145 of 145** (`touched261_tip.txt`). It ran
  in slot 2, beside P's whole suite in slot 1.
- **The harness:** its CONTROL runs all three row files whole on its copy, and it is green (A's 67-file run had it red on a missing `app/testhook`,
  fixed in e7b9128). **Applied 13 / caught 13 / NOT APPLIED 0.**
  - B10 and B11 are caught by rows 720a-d, B12 by 720e, B13 by the ghost's guard 720g.
- **Not re-run by me:** A's 67 files (986 tests, 977 pass; its 2 fails are the harness control, fixed and green above, and the timing row, owed).

### The CHANGELOG (checked by reading, against the runs)

- **It names three holds after this, and each is there:**
  - the ghost crossing a full turn from inside one (350 + 20 lays 10);
  - the extra bank's one turn of its field (unchanged code);
  - the ghost's ±720 (G4, 720g).
- **It names no hold that is not there:** Sculpt's handle has none (the table).
- "730 by a wheel notch up is 730.01" is A's 720e; my G3 gives the arrows.
- **A note for his eye, not a defect of this commit.** "From a typed 710 a drag up stops at 720" is the handle's value. The ghost writes the field
  within one turn (`panel.js:1089`), so the field reads 0 there (720g asserts it) and Extend lays 0.
  - inferred, from `wrapTurn` (`x % 360`): the ghost's first step from a typed 710 already writes 350.45.
  - That is the ghost's unchanged rule, his to rule on with the other ghost hold.

### Older than the range (listed apart; not run)

- inferred, by reading `handles.js:614` and `:335`: **a double-click on a bank handle resets it to 0**, so on a Sculpt piece at 730 it would unwind
  730°, two turns. It was the same at 7b3926e: 0 never touched the range. It is a reset, not a hold, and outside this order. For his eye, beside
  "keep rolling".

### Corrections, mine

- **My first attempt to append this section failed in a shell heredoc** (a quote inside it). Nothing was written, which I checked by the files'
  tails and `git status` before writing it again.

### The machine

- **Worktree:** `Downloads\t180-wt-e-l260c` at e7b9128, checked clean (0 changes; the scratch copy `app/test/zz-e261-scratch.test.js` was deleted
  first) and removed. `l-bankcarry-a` is still e7b9128.
- **heavy-run:** both runs went through `--status && --run --priority belownormal`, in the background, in the free slot. No `cmd`.
- **No browser. No timing.** His saves were not opened, and no track name is in this section or its evidence.
- No push, landing or build.

SOURCES: exo_memory/loop/packet_t180_overlay_and_sculpt_carry_2026-11-27.md:81; handback/p-l260-sculpt-carry-A_2026-11-27.md "Amendment 02:38" (whole); builder git diff 7b3926e e7b9128; evidence/ (first_pass_02-38.md, e261_rows.part.js, e261_tip.txt, touched261_tip.txt)
NEXT: librarian route CLEAN to the chair when this is rung; the D642 row-1 timing on a quiet machine, both commits, is owed to whoever holds a quiet window
