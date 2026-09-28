# D179 · the drag budget (pane E) · 2026-09-27

**Packet:** the chair's D179 NEXT ITEM for E, from B's bench addendum (p-d178-read-B, ADDENDUM 21:02) and the
librarian's direction:
- during an open drag, keep the dragged word and its neighbours LIVE;
- defer the rest to the drag's end;
- the result at the end equals a full revalidate exactly;
- never show a stale "clean".

**Nothing is committed.** This builds on the D179 jump-default addendum (the no-forward-gap red, in the same
`src/validate/index.js`). B owns the CHANGELOG, so my entry is §8.

## 0 · The answer first

**On B's exact bench command, under the lock, all three drag steps are now inside the 50 ms budget: 25.0, 19.2 and
24.3 ms.** B's addendum measured 54.9, 94.5 and 64.8 ms. My part, validation, went from 39.5, 86.2 and 49.7 ms to 18.5,
15.8 and 15.2 ms (§5).

**Mid-track, validation no longer grows with the road after the edit** (15.8 ms against 18.5 at the head). The dragged
word and the word after it are checked every tick; the rest waits for the release, shown as PENDING, never as clean.
**The release pays it once: 14–47 ms,** measured separately, since the bench does not time it. After the release the
result equals a full validate exactly (tested).

## 1 · What an open drag checks now, and what it defers

**While a drag is open** (`state.history.dragBase` set) and the change is a sculpt, the controller passes validation an
end point, `uptoS`:
- **Live:** stations before it are checked in full, exactly as a full validate checks them. That is:
  - everything upstream of the dragged word (carried, as before);
  - the dragged word;
  - **the word after it** (its neighbour: the one whose start the drag moves).
  - `panel.js windowEnd`: the start of the second word after the dragged one. Words are told apart by the segments'
    `id`, because one word resolves to several segments.
- **PENDING:** stations from `uptoS` to the track's end. For them:
  - no loads, folds, seams, holes or segment reds are computed;
  - jumps whose flight starts there are listed as `pending: true, deferred: true`;
  - a closed loop's lap is deferred (as before);
  - the open head's "head in the air" red waits.
  - `result.pendingFrom` says where the stretch starts.
- **The drag's end** is the change that clears `dragBase`; the document itself does not change. It runs
  `revalidate(windowed result, path, segments, pendingFrom)`. That checks everything from the pending start on and
  proves a closed loop's lap. The result **equals a full validate exactly** (§4). `state.how` is `'drag-end'`.

## 2 · Never a stale "clean": how, and the one trap

- **The colours.** A new level, `LEVEL.PENDING` (4), with its own colour: a dim violet-grey, unlike the road's own
  clear grey, since it was not found clean, it was not looked at.
  - The colour map gives every station at or past `pendingFrom` that level, whatever it showed before
    (`colour.js isPending`), and carries `pendingFrom`.
  - The load graph shades the pending stretch to the track's end (`graph.js`).
  - The summary line says `checked to N m, the rest when the drag ends`.
  - A jump past the window does not count as "waiting for its landing".
- **THE TRAP, and why the settled stations stay exact.** Stacking couples stations far apart. A drag swings the whole
  road after it, and that road can come to lie on road BEFORE the edit.
  - **The naive window** skips the moved road entirely. The upstream station it now lies on would keep showing CLEAN:
    exactly the stale clean the chair forbids.
  - **So a pending station is still measured for stacking** against the window and everything before it. Only a pair of
    two pending stations is skipped, and that skip is an index compare, before any geometry (`stacked()`).
  - **So every station before `pendingFrom` has exactly the findings a full validate gives it.** Tested directly: on
    the tight spiral, a settled station stacked on a partner inside the pending stretch shows RED during the drag.

## 3 · Files (all mine)

| file | sha256 (16) | what |
|---|---|---|
| `src/validate/index.js` | `88adaf0775fc536c` | `core(…, upto)`: loops end at the window; `pendingFrom`; stacking as §2; `revalidate`/`validate` take `opts.uptoS`, and a windowed `prev` is resumed from its `pendingFrom` |
| `app/validate-ui/panel.js` | `d80189aac7064d2a` | the window during a drag (`windowEnd`, exported), the finish at the drag's end, `summary().pendingFrom` |
| `app/validate-ui/live.js` | `3215ff421e2af402` | passes `uptoS` through |
| `app/validate-ui/colour.js` | `8b3bc6f95f21e117` | `LEVEL.PENDING`, its colour, pending stations in `colourMap` / `recolour` |
| `app/validate-ui/graph.js` | `308829126ac0aabd` | the pending band, and the axis to the track's end |
| `app/validate-ui/index.js` | `236f3c9d91163846` | the summary text |
| `app/test/validate-ui-incval.test.js` | `6026b403f5dfe0c3` | §4 |
| `app/test/validate-ui.test.js` | `9ae16137e20fa0b6` | ONE test changed, stated in the file: "the palette has one colour per level" pinned `PALETTE.length === 4`; the new PENDING level made it 5. It now counts the levels from `LEVEL`, and adds that pending is unlike clear |

## 4 · Tests

**Command:** `node --test --test-concurrency=4 app/test/validate-ui-incval.test.js` → **18/18.**

- **The property test, both path modes, seeds 11–14,** now checks every state with one rule (`checkState`):
  - **with no pending stretch:** the result equals a full validate exactly, and so do the colours;
  - **with one (a drag is open):**
    - the result equals a full validate BOUNDED at the same point, exactly;
    - every station before it has the colour an UNBOUNDED full validate gives it;
    - every station from it on is PENDING.
  - **After every drag that was open, once it ends:** a full validate exactly.
- **The coverage hole it had, found and closed.** Before this, the property test passed with windows present only
  because none of its seeds left a drag open on a word with two words after it.
  - **The new test** holds a drag OPEN on a mid-track word for 4 ticks. Seeds 21–23: ≥ 3 of 4 ticks windowed each
    time; every tick checked; the end is a full validate exactly, `how 'drag-end'`.
- **Never stale clean:** the tight spiral with w2 dragged. There is a settled station stacked on a partner in the
  pending stretch, and it shows RED during the drag. After the end, a full validate exactly.
- **`windowEnd`:** the second word after the dragged one; null when that is past the end.
- **A windowed result revalidated from BEYOND its pending start** still finishes the whole track exactly: revalidate
  never carries past a windowed prev.
- **The panel says what is pending:**
  - the load graph has a PENDING band from `pendingFrom` to the track end;
  - `summary().pendingFrom`;
  - a deferred jump is not counted as "waiting for its landing".
- **Around it:** validate-ui and validate together **148/148** (before the incval additions); validate-ui alone
  **54/54**.

## 5 · The bench, B's exact command, under the lock

**The runs:**
- `node --expose-gc scripts/bench.js --km 40 --seed 17`, B's exact command, run on the LIVE tree under the lock at
  ~21:4x (`d179/dragbench.js`; output `d179/bench-live.json`).
- In the same locked session, the drag END was timed for the same three words, the bench's own seven 0.5 m steps, five
  times each (`d179/dragend.json`).
- The bench wires NO shared path (my two-line diff for it, p-d177-incval §3.2, is not applied). So this is the
  controller on its own path, as B's run was.

| measure (median of 7, ms) | B's addendum 21:02 (total / preview / validation) | **now** (total / preview / validation) | budget |
|---|---|---|---|
| place one word | 43.3 / 6.1 / 36.9 | **20.0** / 2.6 / 16.6 ✓ | 100 |
| drag near the head, w122 tight | 54.9 / 15.0 / 39.5 ✗ | **25.0** / 7.0 / 18.5 ✓ | 50 |
| drag mid-track, w63 straight | 94.5 / 6.1 / 86.2 ✗ | **19.2** / 2.9 / 15.8 ✓ | 50 |
| drag mid-track, w64 turn | 64.8 / 14.3 / 49.7 ✗ | **24.3** / 9.4 / 15.2 ✓ | 50 |
| full revalidate | 204.9 ✓ | **100.3** ✓ | 1,000 |
| RSS / heap / array buffers (MB) | 904 / 174 / 38 ✓ | **918 / 174 / 38** ✓ | 1,024 |

**The drag's end, which the window defers** (`dragend.json`, medians of 5 releases):

| word | validation per step | **the release** | pending from | track |
|---|---|---|---|---|
| near the head, w122 | 15.1 ms | **13.8 ms** | 39,991 m | 40,259 m |
| mid-track, w63 straight | 15.8 ms | **46.7 ms** | 22,671 m | 40,259 m |
| mid-track, w64 turn | 15.9 ms | **31.8 ms** | 22,771 m | 40,259 m |

**Honest limits of the table:**
- **The totals are not all mine.** The preview column also fell (6.1–15.0 → 2.6–9.4 ms), and that is C's work since
  B's run.
- **Only the validation column is this change:** 36.9–86.2 → 15.2–18.5 ms.
- **B found my earlier figures 1.5–2.5× faster than B's own run of the same code.** One machine, shared, and single
  sessions: these are medians of 7 on one run, not a distribution. The claim that does not depend on the machine: at
  mid-track, the validation per tick no longer grows with the track after the edit.

## 6 · Mutation pass

**How it ran:**
- `d179/mutate_drag.js`: 13 mutants on a COPY of the live tree, under the lock, at `--test-concurrency=4`.
- The tests run: `validate-ui-incval`, `validate-ui` and `validate_incremental`.

**First pass: applied 13 / caught 9 / NOT APPLIED 0.** The copy was restored equal to the live files.

| # | mutant | result |
|---|---|---|
| 1 | loads computed past the window too | SURVIVED. **I labelled it perf-only before the run, and that was wrong:** the loads past the window are computed AND reported, a leak like #4. A test gap (below) |
| 2 | pairs of two pending stations measured too | SURVIVED: **perf only**, as labelled; the output is equal |
| 3 | THE NAIVE WINDOW: pending stations not queried at all | **caught**, by the stale-clean test (§4) |
| 4 | pending stations keep findings | SURVIVED: **a test gap** (below) |
| 5 | revalidate does not resume from a windowed prev's pending start | caught |
| 6 | the head-in-the-air red while its head is pending | SURVIVED: **a test gap** (below) |
| 7 | no `pendingFrom` in the result | caught |
| 8 | windowed without a drag | caught |
| 9 | no finish at the drag's end | caught |
| 10 | the window is the dragged word only | caught |
| 11 | `live` drops `uptoS` | caught |
| 12 | pending stations coloured as they were | caught |
| 13 | no pending band on the graph | caught |

**#1, #4 and #6 would leak findings into the pending stretch.** Those findings are true, not stale, but the contract is
that a windowed result reports NOTHING at or past `pendingFrom`, since those stations are shown pending.
- **The test now asserts it:** `checkState` fails on any red, amber or info range starting at or past `pendingFrom`
  (18/18).
- **#6 may still survive:** it needs the open end to be a bare flight while the drag is open. Since A's jump carries its
  landing ramp, the tests rarely build one.

**The re-run of #1, #4 and #6 with that assertion: NOT RUN.** It was queued behind B's landing run and stopped at the
final lap (22:4x), so whether the new assertion catches them is **not measured**.
- **The command:** `ONLY=1,4,6 node d179/mutate_drag.js`, under the lock, about 2 minutes.
- **Final as measured: 13 applied / 9 caught / 0 NOT APPLIED.** #2 survives as perf-only by construction: pending
  stations' marks are dropped, so measuring their pairs changes nothing reported.
## 7 · What this does NOT establish

- **The drag's END pays what the ticks deferred:** the rest of the track, once, when the mouse is released. Its cost is
  measured (§5) and it is not a drag step.
- **A closed loop is still a full path build and validate per tick** (C's geometry: its closing twist spans the loop).
  The window applies to open tracks.
- **Nothing was run in the real window.** The pending colour reaches the panel's colour map, list and graph. The
  preview does not paint validation's colours at all yet (README §5), so the road in the 3D view shows no pending
  stretch, and no stale clean either.

**The final check of my files (22:4x), NOT the full suite:** validate, validate-ui, handles, onboarding, phrasebook,
export_words and doc-jump together, `--test-concurrency=4` → **264/264**, with A's D179 jump-default diff applied in
the live tree. A first run at the same minute had 7 failures in `validate-ui-jumpdefault`; A was mid-way through
applying that diff, and they pass since. The full suite under the lock is B's landing run.

## 8 · CHANGELOG entry (for B)

- **Changed:** while you drag a handle, only the dragged word and the word after it are re-checked on every frame. The
  rest of the track is shown as "not checked yet" (a violet-grey, never the clear grey) and is checked in full the
  moment you let go. The result then is exactly what a full check gives.
  - Road the drag swings onto earlier road is still caught while you drag.
  - On the 40 km bench track the drag steps went from 55–95 ms to 19–25 ms (the budget is 50); letting go costs
    14–47 ms, once.
