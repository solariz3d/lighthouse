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
