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

## Ruled, 19:10 (A, `p-d481-A_2026-10-26.md` read whole, lighthouse 1be86b9a; red row t180 d481-a 41e7595a)

- **Accepted.** The cause is `fitWithHold`, `src/core/extend.js:123` (t180), from 90f5809 (D459 3b widened), first shipped in 0.4.20. It runs on every pointer move whenever bank, cup or edge is typed. Checked by the librarian at v0.4.21 (9648a25:src/core/extend.js:123–141):
  - `one(i)` builds an unfrozen piece per free point, so every `channelValue` copies the knot vector;
  - the B table is dense m × S;
  - the normal equations are a dense O(m²·S) loop, and the elimination is a dense O(m³) Gauss-Jordan. Its comment says "m is at most a few tens", but m is about 500 at 10 km.
- My lead suspect (stackCurl) was wrong: 0 samples on the drag tick. A cleared it with the profile. The other suspects are cleared the same way (§5).
- A's figures I take as A states them: 1 km with all three typed, p95 486 ms on 0.4.21 against 3.6 on 0.4.19. 10 km turn drag: frames of 130 s. The 26b895a and 496c347 bisect rows are inferred (unsaved output); 90f5809's row is on disk (`bis.out`).

## D482, the fix: two parts, in parallel

**Part 1, pane A (prove it: core maths, the bank/cup/edge every exported track carries).** Make `fitWithHold` cost linear in length with the same answer.
- Compute the basis of each free point only over its own support (a B-spline basis function is non-zero over degree+1 spans). Use one knot vector for the whole fit, not a fresh copy per call.
- Build the normal equations banded, and solve them with a banded solver. Keep the singular-system return ("the fit as it was").
- **Same answer, proven:** byte-equal channels after the `toFixed(dec)` rounding on every public fixture, both private fixtures, TEST 10 and TEST TRACK 10, at each typed combination A used. If any value differs in its last kept digit, list it; do not widen a tolerance.
- **Red to green:** row 6 (41e7595a) goes green unedited. A new node row: `extend()` at 10 km with all three typed finishes under a budget derived from a measured run, stated with its source.
- The mutation harness covering extend.js, whole. The touched files' tests. CHANGELOG line, 0 "keeper".
- No change to when the fit runs. Throttling the readout to release is a design change, not this fix.

**Part 2, pane C (check it, find only): A's §7.** On 0.4.19 already, with any of bank, cup or edge typed, about 400 frames a second do more than 1 ms of work during a drag (40–60 untyped), and p95 misses 6.9 ms. Find what redraws every frame while a field is typed: a profile, the function and file. No fix; the fix is its own order.

**The batch:** D482 part 1 joins d473-e + d477-p in the next T-180 release. This is a regression he feels on every drag, so it is the one item that justifies releasing the batch without waiting for his new-track findings. That is a recommendation, and his to veto.

## D482 collated, 20:30 (A 001069f3 / t180 d482-a 883c200 + 1366dfc; C 8f2f8800; both read whole)

Checked by the librarian on disk, from A's evidence (`G:\consonance-scratch\a-d482\`) and the worktree:
- d482-a sits on 41e7595 with a clean tree: 5 files, +225/−16.
- `final-proof-all.out`: cases 1036, byte-equal 674, refused alike 361, DIFFER 1.
- `final2-direct.out`: 6,656 fits, 195,392 points, DIFFER 1. It is the same value, pre-close p43 phi[6].
- Ramp harness: 35/35/0. Touched files: 943, pass 940, fail 0, skip 3.
- Row 6 green unedited: p95 10.4 ms against the 13.4 bar.

**Part 1, accepted.**
- The one differing value is 2 ulp either side of a rounding half-point, with neither more correct, and it is listed as ordered. That is accepted.
- The near-singular divergence (§3c) is accepted as A states it: a 1 cm knot cluster gives no meaningful bank in either code, and the panel cannot lay one. One line goes in the release notes' known limits, not a fix.
- 10 km with all three typed: about 10 to 23 ms, against 162 s on 0.4.21.
- A's two corrections are recorded: untitled D481 drag runs, and an accidental harness run outside the lock. 1366dfc fixes the first for good.

**Part 2, accepted as a finding (C §5).**
- The every-frame work is `widthAtHead` (preview.js:573). Its `perHead` memo skips the unfrozen ghost head, and it triggers only with an edge typed and nothing placed.
- The 6.9 ms miss is the per-move rebuild with an edge typed (`handleKey` JSON.stringify, `meshPiece`, `ghostSteps`), placed or not.

OUTPUT → NEXT: changed — after the fit is fixed, A's 1 km page profile puts 47% of the drag in C's perHead path. So the edge-typed costs are now the largest thing between his drag and 144 Hz, and they get their own order.

## D483, two parts

**Part 1, the landing: one pane, E or the first free that is not A or C (prove it: release).**
- Merge d473-e (a4bfe52) + d477-p (2451dfb, cf03658) + d482-a (41e7595, 1366dfc, 883c200) onto v0.4.21.
- The full suite. A credential scan on the added lines. 0 "keeper" in public text.
- Release notes, including the known limits from D477 (two edges) and D482 (§3c).
- Build, release and push under the standing permission.
- Install into his T-180 only with the builder closed, a `.before-0.4.22` backup and a sha256 compare.
- **The batch goes now, without waiting for his new-track findings.** It is a regression he feels on every drag. That is my ruling under his standing word; he can veto.

**Part 2, pane C (prove it: mesh.js and the segment key feed what the preview and the mesher build). The edge-typed drag reaches the 6.9 ms standard.**
1. `perHead` (or the coarsened copy) answers the dragged ghost's head without recomputing `spanOf` every frame. Output must be equal.
2. The per-move rebuild with an edge typed: `handleKey`'s whole-segment JSON.stringify first, then whatever the profile names next. The mesh must be byte-equal to the current one on the public fixtures, and a stale-key test must show a changed segment never reuses an old mesh.
3. Red first: a drag-frame row with a left edge typed, at 1,000 m, empty and placed, under 6.9 ms p95. If 6.9 ms is not reachable in headless runs, C says so with the figures and proposes the bar.
4. The mutation harness for every touched src file, whole. Touched tests. CHANGELOG line, 0 "keeper".
5. It builds on d482-a, and rides the next batch, not this one.
