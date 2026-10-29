# D529: opening a long track no longer freezes the window. Librarian, 2026-10-29 06:0x

The user, 05:49: on CRAZY TEST, with a 24-box pit lane and a 24-car grid, "it hitches the program bad on project load". Measured before planning, headless, the app's own modules, on his saved file (`%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-CRAZY TEST.t180track`, 58,993 B; the script is `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-librarian\0c0c0c0b-0000-4000-8000-00000000115b\scratchpad\time-load.js`, node, two runs plus variants).

## What the open costs, step by step (node, this machine)

| step | as saved (24 boxes, 24 grid) | 2 boxes, 2 grid | no pit lane, no spawns |
|---|---|---|---|
| parse + resolve (shell.open) | 131–137 ms | 102 ms | 92 ms |
| spawnsInfo (pit lane + grid + checks) | 79–141 ms | 48 ms | 95 ms |
| preview mesh, full (trackmodel update) | 1,658–1,786 ms | 1,942 ms | 1,654 ms |
| validation, full | 2,418–2,628 ms | 2,365 ms | 2,360 ms |

The track: 13 pieces, 19,657 m, 9,838 cells, 2,075,032 vertices. **The pit lane and the grid are not the cause**: everything they add is under 0.15 s. The hitch is the track's size at open: the preview meshes all 19.7 km in one go on the window's thread.

## Where it runs today (checked in t180-fresh c1396b9)

- `app/preview/preview.js:193-201` `refresh` → `refreshNow` → `model.update(st.resolved)` synchronous, for every state change that is not a drag release: an open included. One frame carries the whole 1.6 s build (plus the GPU upload of 2 M vertices, not measured here).
- The SLICED build exists: `preview.js:170-191` `startExact` / `stepExact`, `EXACT_SLICE_MS = 3`, `model.updateSteps` (trackmodel.js:253). On this track it is 29,490 steps, 1,342 ms in total, and it is used ONLY after a brush drag's release (`refresh`, line 193-194).
- The validation already runs in the checker worker on the page (`app/validate-ui/index.js:88-111`, `checkrunner.js`): its 2.4 s does not block the window. Nothing to do there.
- `trackmodel.js:84-86` `detail` + `preview.js:158-160` `scheduleFull` (FULL_AFTER_MS 250): a coarse build then full. On this track coarse is no rescue: factor 6 still 628 ms, factor 24 572 ms (the per-station work along 9,831 samples dominates, not the rows across).

## The change (pane C, who profiled the freeze in D421: `exo_memory/handback/p-d421-freeze-C_2026-10-20.md`; tier CHECK IT, plus one test for what cannot be seen)

1. **A 'full' build of a placed track goes through the sliced path, not one frame.** In `refresh`, a state with no open brush whose build the model classes as 'full' (trackmodel.js:145; C exposes the classification, or lets the first slice run with a budget that finishes an 'extend' or 'sculpt' at once and spills only a 'full') starts `startExact` and returns; `stepExact` publishes it through `refreshNow(job.st, job.built)` as the release path does today. Until it lands the stage keeps what it showed: on a first open, empty; after an undo past the end or a close, the old track. The status line says the road is being built (C's words), and clears when it lands.
2. **Placing a piece does not get slower.** The 'extend' build (D407: 13 ms path, 65 ms to place) must still land in its own frame: either the classification keeps it on `refreshNow`, or the first slice's budget covers it. Falsifier for the lap: if a placement on a 12-piece track takes more frames after this change than before (preview-speed.test.js's figures), the slicing is wrong, not the budget.
3. **Slice size stays under a 144 Hz frame** (the user keeps the preview at the display's refresh rate): 3 ms stays, or C raises it to at most 5 ms for a build with no drag open and says why. At 3 ms the 19.7 km track arrives over roughly 450 frames (about 3 s at 144 Hz) with the window live throughout; that is the trade, and the user judges it installed.
4. **Measurement, before and after, in the real window headless (`--mute-audio`, never stealing focus):** the longest task on the page thread during an open of CRAZY TEST (PerformanceObserver 'longtask', or performance.now around `refresh`), and the time until the track is on screen. Before: one task of about the full build. After: no task over one frame's budget during the open; the arrival time reported. Node figure beside it: the time `refresh(openState)` holds the thread in preview.js's test rig, before and after.
5. **Tests:** the existing `app/test/preview-speed.test.js`, `release-frame.test.js`, `release-ghost.test.js`, `sculpt-release.test.js`, `core-pieces-ui.test.js` unchanged and green. ONE new test, behaviour nobody can see by looking: opening a document in the preview's rig publishes no track from the first `refresh` call, the track arrives after N fake frames, and a placement on an open track still arrives from its own `refresh` call. Mutation: none (check it); anchors still once.

Kept out: the GPU upload (measured in step 4; if it is the larger half, that is the next lap, not this one); the validation (already off the thread); the pit lane and the grid (measured innocent); any change to the mesh or the export.

## Part 2 (C): install for the user after my read

Builder closed, `.before-d529` backup, sha256 compare, install over the current exe (45f86975…cc51 = 0.4.29 + D517). He opens CRAZY TEST and feels it. On his yes it rides the next release batch with D517.

## Where the work lives

Branch from `C:\Users\nname\Downloads\t180-fresh` main (c1396b9), a worktree off that checkout; never the old clones. Commit message plain (what and why in a player's words, no lap ids or seat letters), the Claude co-author line allowed. CHANGELOG `[Unreleased]`, one line: opening a long track no longer freezes the window while the road is built; it appears over the next second or two instead. New code comments say what the code does, not which lap. D517's branch (d517-e: 66e8d3d, bd86f36, d3772aa, on the old clone) is rebased onto t180-fresh by the landing pane before the batch; not in this lap.

surfaced: preview.js:158-160/:170-201, trackmodel.js:84-86/:145/:253, validate-ui/index.js:88-111, coarse.js, p-d421-freeze-C_2026-10-20.md, preview-speed.test.js, release-frame.test.js.
