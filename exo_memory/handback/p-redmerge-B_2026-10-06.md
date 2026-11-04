# D248 — red merge (pane B, build; FEEL tier)

**Commit `05f0c2c`** on branch `b-redmerge`, worktree `C:\Users\nname\Desktop\worktrees\b-redmerge-wt`, parent `4d2e67b` (main, per the packet). 11 paths, named on the commit. Not pushed.

## What it does

Source: E's note B (`exo_memory/handback/p-close-E_2026-10-05.md:81`).

`app/validate-ui/redgroups.js` now gives each group `g.places`:
- **What merges:** within one group, reds that **overlap**, or that **touch** (gap ≤ `TOUCH_M` = 2 m, one validation station) **on the piece the place ends on**. So merged reds always share a piece. Reds on different pieces that only touch stay as two places.
- **What a place holds:** its start (`s`, `s0`, which a click goes to), its end, the pieces it spans, every reason and plain description it merged, its worst value, and how many reds it covers.
- **Unchanged:** `g.items` (every red, unmerged) and `g.count` (the number of reds).

Every red list now shows one line per place and says "N places" from the merged list, via `RG.placesText(g)`.

**"Per red kind" is read as per GROUP**, i.e. the kind the keeper reads. "The road overlaps itself" is one kind whether the mesh, the stacking or the ray found it. E's own example is that cross-reason case (a self-intersection and a stacked red at one place). If the chair meant per validator reason, that is a one-line change, but a self-intersection and a stacked red at one spot would then show as two lines again.

## The rule changed mid-lap (the real window caught it)

My first rule merged only reds that **start on the same piece**. The real-window check on a closed coil showed this:
`The closed track OVERLAPS ITSELF (3 places): at 1.08–1.16 km (p4–p5), at 1.15 km (p5), at 1.91–1.99 km (p7)`

The second line lies inside the first, but it starts on p5. Before fixing it I wrote a test that reproduces it (`D248: a red inside a place that spans two pieces…`), and it failed on that code with 3 lines for 1 place. After the fix the same window reads:
`(2 places): at 1.08–1.16 km (p4–p5), at 1.91–1.99 km (p7)`

The click lands on s = 1076.54, the merged start. The status line says "OVERLAPS ITSELF in 2 places", there are 0 page errors, and 0 lines on one piece overlap.

## Lines touched OUTSIDE redgroups.js (for A, building drag handles)

Each of these is one line, a count or loop switched from reds to places:
- `app/core/coreshell.js:47`: a new helper, `overlapPlacesText`.
- `app/core/coreshell.js:312` (close words) and `:451` (delete words): "OVERLAPS ITSELF in N places". This was the red count labelled "place(s)", which was wrong before this lap.
- `app/core/panel.js:270`: the close-preview header shows `placesText(g)`, and the buttons come from `g.places.slice(0, 24)`.
- `app/core/piecesui.js:67`: the same change in the delete preview.
- `app/index.html:206, :208`: the drawReds header and loop.

## Tests amended BY NAME (the rule they asserted changed)

- `redgroups.test.js`, the "groupsText names EVERY red's place" row becomes "groupsText names one line per PLACE and every red lies inside exactly one of them…". It now expects 13 places on the TEST-1-shaped layout. The 6.022 km ray red touches 5.98–6.02 km on that place's end piece p7, so it merges. The first rule had said 14; the comment in the row says why.
- `core-close-preview.test.js` row 6 now expects `(1 place): at 0.20–0.23 km`, and `(1 place)` for roll.
- `preview-async.test.js:289` and `core-shell.test.js:319` now expect `(1 place)`.
- **3 new rows:**
  - the near-duplicate merge, with the click target being the start;
  - touching 2 m merges, 3 m does not, and different pieces never merge;
  - a red inside a two-piece place is that place (the real-window case).

## Numbers (all under the heavy-run lock)

Logs are in my scratchpad, `redmerge/run2.out` and `run4.out`.

- **Targeted, 124/124 top-level:**

  | file | passing |
  |---|---|
  | redgroups | 9 (run4) |
  | core-close-preview | 7 |
  | core-pieces-ui | 13 |
  | preview-async | 10 |
  | core-shell | 28 |
  | core-readout-display | 37 |
  | share-install | 12 |
  | core_cup_fixtures | 8 (0 of 9 fixtures differ) |

  The 7 files after redgroups ran in run2 on the final source. Only `redgroups.test.js` changed after run2.
- **`core-close-mutation`, 37/37:** the control plus 36 mutants, all applied and caught, 0 NOT APPLIED.
  - G3 re-anchored (the text now lists places).
  - G6 (never merge) and G7 (merge across pieces) re-anchored to the new condition.
  - G8 (TOUCH_M = 0) and G9 (count = reds) are new.
  - G10 (the old same-start-piece rule) is new and caught by the real-window row.
- **Real window:** Chrome off-screen at -12000, browser storage only (no Tauri, no app data, which is stricter than T180_TEST_APP_DATA). I built a coil through the panel, chose Close using "whole", then clicked the first place. Output is in `redmerge/rwprobe2.json`.

## Not established

- I did not run a real window on the refused-export dialog or the delete preview. Those are covered only by the core-shell and pieces-ui rows.
- I did not check that the keeper's TEST 1 now reads one line per place. My layout only has the same shape as TEST 1; I did not read the keeper's track.
- No full suite.

## My slips

- In the first fix pass, my own amended row still held the old rule: it matched a red's place on the start piece. The control caught it.
- An edit dropped a space in a regex. Run3 caught it.
- A few `node -e` lines wrote step lists and text edits outside the lock. No test ran outside the lock.

## F1 — the end piece at a boundary (C's look, `handback/p-redmerge-C_2026-10-06.md:33-36`)

**Commits `2b51633` (the fix) and `ddf7889` (its changelog line)** on branch `b-redmerge-f1`, worktree `C:\Users\nname\Desktop\worktrees\b-redmerge-f1-wt`, on main `05f0c2c`. 4 paths, named on the commits. Not pushed. Only my red-list files are touched, nothing in panel.js or coreshell.js.

**C was right.** `pieceAt` puts a boundary s on the NEXT piece, and I read a place's END piece with it. So a red ending exactly on a boundary was labelled as spanning both pieces (C's case F). Through the touch rule it also merged a red starting within 2 m on the next piece (case B). An exact meeting at the boundary merged through `it.s0 <= last.s1` (case A). All three break the rule I stated: different pieces never merge. As C says, the label half is older than D248: the item's `pieceEnd` was computed the same way in D242.

**Fix** (`app/validate-ui/redgroups.js`):
- A new `endPiece(segments, s0, s1)` reads `pieceAt(s1 - 1e-6)` when the range is longer than 0.5 m, and the start piece otherwise. It is used in all three places: the item's label, the place's label, and the touch rule.
- The overlap branch is now strict (`it.s0 < last.s1`). Meeting at a point therefore goes through the touch rule, which needs the same piece. Two reds meeting on one piece still merge; two meeting at a boundary stay two places.
- Side effect, not separately tested: a closed lap's red ending exactly at s = L used to wrap to p1 for its end piece. It now reads the last piece.

**Two RED rows first,** both red on `05f0c2c` and green after:
- "F1: a red that ENDS exactly on a piece boundary is on its own piece only (0.98–1.00 km is p1, not p1–p2)". This is case F, checking both the item label and the place label.
- "F1: reds that meet AT a boundary, or touch across it, stay two places…". This covers cases A and B, plus a control: two reds meeting on one piece are one place.

**Numbers** (under the lock; log `redmerge/runf1.out` in my scratchpad):
- Targeted, 126/126 top-level:

  | file | passing |
  |---|---|
  | redgroups | 11 |
  | core-close-preview | 7 |
  | core-pieces-ui | 13 |
  | preview-async | 10 |
  | core-shell | 28 |
  | core-readout-display | 37 |
  | share-install | 12 |
  | core_cup_fixtures | 8 |

- The TEST-1-shaped row still says 13 places: 5.98–6.02 km ends past the boundary, inside p7, so the 6.022 km ray red still touches on p7.
- No harness run, per the packet. G6, G7 and G10 in `core-close-mutation.test.js` are re-anchored to the new condition line (3 anchors, replaced by exact text). G7 (merge across pieces) should now also be caught by the new F1 row. That is unverified until the librarian's install run.

**My slip:** I committed `2b51633` before checking that my changelog Edit had landed. It had failed on a non-unique anchor. The line went in as `ddf7889`.

## F2 — an open track's end (C's look at A's handles, `handback/p-handles-C_2026-10-06.md:85`)

**Commit `d4b31fd`** on branch `b-redmerge-f2`, worktree `C:\Users\nname\Desktop\worktrees\b-redmerge-f2-wt`, on main `63dc19b`. 7 paths, named on the commit. Not pushed.

**C was right.** `pieceAt` wrapped s = L to the first piece even on an open track. So a point red at the very end read "(p1)", and after F1 it stood as its own place beside the range that ends there.

**Fix** (`app/validate-ui/redgroups.js`):
- `pieceAt(segments, s, { closed })` and `groupReds(reds, segments, { closed })`, threaded through `endPiece` and `mergePlaces`.
- `closed` defaults to **true**, so a closed lap keeps the wrap, and so does every caller that doesn't pass the flag.
- With `closed: false` nothing wraps: s at or past the end is the last piece.

**Lines touched outside redgroups.js (for A):** each adds `{ closed: <resolved>.closed }`.
- `app/core/coreshell.js:47`: the `overlapPlacesText` helper gains a third argument `o`, which it passes on.
- `app/core/coreshell.js:495`: the delete-preview words pass `r.resolved.closed`.
- `app/core/coreshell.js:570`: the export refusal passes `st.resolved.closed`.
- `app/core/piecesui.js:65`: the delete preview's red list.
- `app/index.html:205`: the page's red box.

`panel.js` is NOT touched. Its close preview is always of a closed lap, so the default is right there. The close words at coreshell `:356` are left alone for the same reason.

**Two RED rows first,** red 2/2 on `63dc19b`, green after:
- "F2: on an OPEN track, s at or past the end is the LAST piece…". It checks `pieceAt` open, open-past, closed, and no flag.
- "F2: an open track's end red is ONE place with the range that ends there…".

**Numbers** (under the lock; log `redmerge/runf2.out` in my scratchpad):
- Targeted, **133/133 top-level**:

  | file | passing |
  |---|---|
  | redgroups | 13 |
  | core-close-preview | 7 |
  | core-pieces-ui | 18 |
  | preview-async | 10 |
  | core-shell | 28 |
  | core-readout-display | 37 |
  | share-install | 12 |
  | core_cup_fixtures | 8 |

- No harness, per the packet. Mutants G4, G5, G6, G7 and G10 are re-anchored to the new text. I checked by grep that every redgroups anchor in `core-close-mutation.test.js` occurs exactly once. G5 ("s past the lap does not wrap") should still be caught by the closed-default `pieceAt wraps` row. That is unverified until the librarian's install run.

**Not established:**
- The caller wiring (the five lines above) has no test of its own. No row drives an open-track export refusal or delete preview with a red at s = L; only the redgroups rows test the rule.
- No real window.
