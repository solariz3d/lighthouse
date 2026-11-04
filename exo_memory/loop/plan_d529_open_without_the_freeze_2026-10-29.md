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

## Amendment, 06:05: ELYSIUM does not fit the story, so the window is measured FIRST (Part 0, before any code)

The user, 06:01: "elysium is longer aint it not, i wonder how long it takes to open that track, i dont remember a big lag". Same script, same steps, node: ELYSIUM 44 pieces, closed, 27.6 km, 13,803 cells, 3,260,300 vertices, 12 boxes, 12 grid: open 648 ms, spawnsInfo 254 ms, preview full mesh 6,570 ms, validation 10,268 ms (CRAZY TEST in the same run: 1,862 / 3,282 ms). By the table ELYSIUM's open should hold the thread three to four times longer than CRAZY TEST's, and he does not remember a lag. ELYSIUM was last saved 2026-10-23 01:37 (0.4.1x); CRAZY TEST 2026-10-28. So one of three is true and the node table cannot say which: (a) his memory of ELYSIUM is of a quicker build or he has not opened it since, and both freeze today; (b) the window behaves unlike node on an open; (c) what he feels on CRAZY TEST is not the open's build at all but something that runs after it, on an open track with 24 + 24 marks: the per-frame layers (spawnslayer.js draws 51 car boxes with text and two 400-point lane outlines every frame; the handles and labels of an open track with 231- and 249-knot pieces; the open end's ghost).

**Part 0 (C, first, no code change):** in the real window headless (`--mute-audio`, no focus), open CRAZY TEST and ELYSIUM in turn, cold, and record for each: every long task on the page thread during the open and the 10 s after (PerformanceObserver 'longtask' with attribution, or performance marks around `refresh`, the validate-ui mount, the spawns/handles/labels layers' frames), the frame times of those 10 s (the 144 Hz budget is 6.9 ms), and the time to the first drawn road. Then the same open of CRAZY TEST with the pit lane and spawns blocks removed from a copy of the file (the saved file untouched). Hand back the figures; the change is chosen from them: the sliced build (Part 1 as written) if the open's one-frame build is the long task on both tracks; a per-frame fix instead, named from the attribution, if CRAZY TEST stutters after the open where ELYSIUM does not. Part 1 does not start until Part 0 is read by me. The falsifier for my premise: if the window shows no task over 500 ms at CRAZY TEST's open, the premise (the one-frame build) is wrong and the plan's Part 1 is not the fix.

## Part 2 (C): install for the user after my read

Builder closed, `.before-d529` backup, sha256 compare, install over the current exe (45f86975…cc51 = 0.4.29 + D517). He opens CRAZY TEST and feels it. On his yes it rides the next release batch with D517.

## Where the work lives

Branch from `C:\Users\nname\Downloads\t180-fresh` main (c1396b9), a worktree off that checkout; never the old clones. Commit message plain (what and why in a player's words, no lap ids or seat letters), the Claude co-author line allowed. CHANGELOG `[Unreleased]`, one line: opening a long track no longer freezes the window while the road is built; it appears over the next second or two instead. New code comments say what the code does, not which lap. D517's branch (d517-e: 66e8d3d, bd86f36, d3772aa, on the old clone) is rebased onto t180-fresh by the landing pane before the batch; not in this lap.

surfaced: preview.js:158-160/:170-201, trackmodel.js:84-86/:145/:253, validate-ui/index.js:88-111, coarse.js, p-d421-freeze-C_2026-10-20.md, preview-speed.test.js, release-frame.test.js.

## Part 0 read by the librarian, 06:2x: PREMISE HELD, Part 1 GO as planned

p-d529-part0-C (git-blob c3cfb67f) read whole. In the real page headless: one task at the open, 2,459 ms CRAZY TEST / 5,734 ms ELYSIUM, the full build 1,630 / 4,370 of it; the 10 s after: p99 0.3 ms both; the bare copy 128 ms less. So case (a): both freeze, ELYSIUM worse, the user has not opened it on a recent build. Ruling on C two questions: (1) the texture set: src/texture/set.js:41 keeps the last 32 rendered textures by name, so the 0.5 s is the session first render, not an every-open cost; NOT in this lap. C proves it in the after-measurement by a second open in the same page: if the ~0.5 s recurs, a follow-up keys the images by their own key (k|image|edge widths), never by piece ids; (2) the first frame (322 / 596 ms: lines, tangents, uploads): the sliced path already makes lines and tangents per batch ahead (stepExact), so Part 1 covers it; C reports the first frame after, and if it still exceeds one budget the upload is the next lap, not this one. C resumes from the set-aside change (preview.js diff + preview-open.test.js); the before/after is Part 0 rig, same three opens, plus the second open; existing preview tests green; CHANGELOG one line; then Part 2 install.

## Part 1 read by the librarian, 06:4x: ACCEPTED, Part 2 GO

p-d529-part1-C (git-blob 972b29ed) read whole. Checked by me in t180-wt-c529: d529-c 7f21962 on c1396b9, author solariz3d, message plain with the co-author line only, 3 files (+76 -2), CHANGELOG one entry, no lap ids or seat words in the new lines; preview-open.test.js 2/2 on my run. C figures (real page): the open stall 2,958 -> 958 ms CRAZY TEST, 6,385 -> 1,542 ms ELYSIUM cold; the road arrives 0.7 / 1.6 s later with the window live; placement unchanged (row 2 + release-frame). The texture set is 0 ms on a second open (ruling 1 held). Left for later laps, by the plan: the key hash before the first yield (101 / 295-366 ms), the resolve (106 / 305 ms), slice gaps up to 46 ms (one piece mesh per step), the first-draw frame (192-383 ms). Part 2 GO: the D517 patch (d494dde..d517-e, 13 files) as its own local commit on d529-c with validate_chassis + validate_load_mutation green, the CHANGELOG hunk merged by hand; build; builder closed; .before-d529; sha256 compare; the user opens CRAZY TEST and ELYSIUM and judges the trade (live window, road a second or two later).
