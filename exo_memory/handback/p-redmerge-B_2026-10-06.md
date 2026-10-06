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
