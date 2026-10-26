# D481: dragging a straight past ~400 m lags badly in 0.4.21. Librarian, 2026-10-26

The keeper, 16:12: "Something isnt right with track builder, as soon as I drag the straight more than 400m it lags very bad like how it did in the beginning, what happeneed? I could do a 10km straight into a turn and it wouldnt lag that bad before"

## What is known
- He runs 0.4.21, installed this morning by D471: exe sha256 87aa6a2a…27c3. Before that he had 0.4.19 (D452's install, exe sha256 16dcfb9b…1081, kept as `.before-0.4.21`).
- So the regression came in between v0.4.19 (496c347) and v0.4.21 (9648a25), across 0.4.20 and 0.4.21.
- The standard is the keeper's own (memory, preview-at-refresh-rate): the previewer holds the display's refresh rate, 6.9 ms at 144 Hz, and only absurd loads may drop, gracefully. A 10 km straight was fine before.
- **Suspects, named so they get measured rather than assumed.** These are the changes in that range that run on a drag or revalidate:
  1. D463's bank-cup-edge amber, `stackCurl` in src/validate/index.js. A's own hand-back (p-d462-A, §3) says it is "read over the whole track on every call", "not memoised per segment", "runs on every revalidate up to the window's end", and "not measured on a drag tick". It took 150 ms over TEST 10.
  2. D460's mesher change: meshSeam pairing by lateral u, plus weldSeams dropping standing triangles. Does it run per drag tick on the dragged piece, and does its cost grow with length?
  3. The C2 quintic (D459, 3b and 3c) and the continuity checks (`c2Breaks`, `jointSteps`). Do they run per tick?
  4. Anything in D465, D467 or D468 on the drag path. The bend bar (closejob barMiss) should only run on release; confirm it does.

## The plan: one pane, the first free (check it to find; the fix is its own order, prove it)
1. **Reproduce it in a test first** (his bug report, so red first). Use the repo's own drag harness (`app/test/drag-frame.test.js`, a headless browser, `--mute-audio`, titled zz-headless-test). Drag a straight's length handle from 200 m to 400, 1,000, 3,000 and 10,000 m on a simple open lap, and record the frame time per drag tick at each length.
2. **The same run on v0.4.19, v0.4.20 and v0.4.21**, each in a detached worktree. Report a table of length against frame time for each version. That is the regression measured, not felt.
3. **Bisect** the 0.4.19 → 0.4.21 range with that measure, down to the commit that made the cost grow with length.
4. **Profile** the bad tick (a Chrome DevTools CPU profile through the harness), and name the function and file taking the time.
5. **Hand-back:** the table, the commit, the function, and a red test row that fails on 0.4.21 and passes on 0.4.19: a drag tick at 10 km under a stated budget, the budget derived from 0.4.19's measured time with margin, not invented. No fix yet.

Nothing touches his tracks or his install. Heavy runs go at BelowNormal under the heavy-run lock.

NEXT: chair dispatch D481 to the first free pane now; librarian rules the fix order when its hand-back is in.
