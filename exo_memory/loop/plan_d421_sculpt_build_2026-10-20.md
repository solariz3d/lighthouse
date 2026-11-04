# D421 Part 3: build Sculpt mode (librarian, 2026-10-20 14:5x local)

The keeper, 14:53: "GO". He approved P's design (`exo_memory/loop/design_d421_sculpt_P_2026-10-20.md`, the "design" below)
with all four open calls on their defaults (§6 of the design):
1. Stretch keeps the bend; Alt keeps the rate.
2. A route tool on a closed lap that cannot re-close drops the drag whole, and says so.
3. A closed tube past 300°: width, bank and sweep stay refused, as today.
4. The switch sits in the top bar at the left of the menus. The first Build menu item is the fallback only if it doesn't fit.

## The base

- t180 repo `C:\Users\nname\Downloads\t180-track-builder`.
- Every part branches from **ea54ac3**. That is local-0.4.10's merge of D421 Part 1, the freeze fix 84e2170 on v0.4.9 409d3f8.
- It has neither of 000f13e's version-bump commits.
- Each pane makes its own worktree in Downloads, `t180-wt-<letter><n>`, and names it in its hand-back.
- Never touch `Desktop\t180-track-builder`.

## The parts and their panes

| # | what | pane | tier | files |
|---|---|---|---|---|
| 1 | Core: `stretch` and `smooth`, plus C's leftover sharp-brush BAD_RANGE | C | prove it | `src/core/sculpt.js` + test |
| 2 | Shell: tools, families, guard by family, release re-close, run window | O | prove it | `app/core/coreshell.js`, `app/core/centreline.js` call sites |
| 3 | The mode in the page: switch, keys, Sculpt strip, menus | B | check it | `app/core/panel.js`, `buildmenu.js`, `keys.js`, `app/index.html`, `handles.js` (run selection) |
| 4 | Preview degrade ladder | E | prove it | `app/preview/trackmodel.js` ghost path, `app/preview/coarse.js` |
| 5 | The frame rows red first, then the page subscribers | A | prove it | `app/test/sculpt-frame.test.js` (new); `segkey.js`, the spawns layer, `pieceReadouts`, `ghostModel` |
| 6 | Review every diff before landing (reviewer-only, the keeper's 12:54 yes) | P | review | reads diffs, writes nothing in t180 |

### Part 1 (C): the core

**What to build:**
- `stretch(doc, i, L1, { keepRate })`, design §3.2:
  - `kh`/`kv` control points scaled by L0/L1 unless `keepRate`;
  - knots `evenKnots(L1)`;
  - the following joint re-derived value-then-slope;
  - quantised, then `checkDoc`.
  - A run: `stretch` over `from..to` by one factor.
- `smooth(doc, channel, s0, r, lambda)`, design §3.7:
  - a Laplacian relax under the falloff;
  - the window's outer four control points held;
  - joints inside moved value-then-slope.
- Both are pure and frozen, and untouched pieces stay the same objects, in `sculpt.js`'s style.
- The leftover: the sharp brush at r ≥ 500 on 10 km refuses `BAD_RANGE ... [200, 200]`, because `refineKnots` gets a zero-width range when the window ends on a piece's end (`p-d421-freeze-C_2026-10-20.md` §5). Red row first.

**Tests:**
- The design's §4.4 rows 5 (only the half that is core) and 6 (Stretch keeps C1, and the length changes by exactly the stretch).
- Edges: L1 = L0, a minimum length, a closed lap, a flight inside the run, λ = 0.

**Mutation:** the harnesses that anchor in `sculpt.js` (`core_cup_mutation`, `core_xsec_mutation`) whole, plus C's own mutants of the two new functions.

### Part 2 (O): the shell

**What to build:**
- `beginBrush(..., tool)` resolves a tool name to (mode, channel, family). The tools: grab-up, grab-side, stretch, bend, climb, twist, width, cup, edge, edge-right, edge-start, wall, sweep, smooth.
- The family sets the guard:
  - Shape: the D244b centreline guard, unchanged;
  - Local and Route: no guard.
- `smooth`'s channel is the last tool used. The family follows that channel.
- A Route tool on a CLOSED lap:
  - no `close()` per step (remove `brush()`'s per-step re-close for this path only);
  - on release, `close(doc, { window })` in the close worker (`closerunner.js` / `closeworker.js`);
  - if that's refused, the whole-lap close once, with the window protected;
  - if refused again, the drag is dropped whole with a named message (call 2).
  - The pointer-up handler only starts the job.
- The window can be a run: `sculptInfo` gains `from` / `to`, and `beginSculpt` takes a run (design §3.6), including the `longWay` rule across the start line.
- A radius change during an open drag re-runs from the same base: a new `r` in the brush state, no accumulation.

**Unchanged:** `endBrush`, `D.beginDrag` / `dragTo` / `endDrag` (one drag, one undo step) and the D335 ratio. The harness anchors C2 (`endBrush`) and V5 (`panel.js`) stay where they are.

**Depends on Part 1** for `stretch` and `smooth`. Code against the signatures above, and stub them until C's commits land. O merges C's branch into its own when it's handed back.

**Mutation:** the harnesses that anchor in `coreshell.js` and `centreline.js` whole.

### Part 3 (B): the mode in the page

**The switch:**
- Build | Sculpt, in the top bar at the left of the menus (`app/index.html:131-138`).
- Fallback, only if it doesn't fit at 900 px: "Sculpt mode", checked, as the first Build menu item.
- It sets `st.sculpt` and nothing else.

**Keys:**

| key | does |
|---|---|
| Tab | toggles the mode, except in a text field (`keys.js` `inText`) |
| Esc | drops an open drag |
| `[` `]` | change the radius |
| 1-9 | pick a tool in Sculpt: Grab, Stretch, Bend, Climb, Twist, Width, Cup, Edge, Smooth |

No letters: `keys.js:9` reserves them for the cameras.

**The wheel:** during an open drag, it changes the radius by one knot span a notch, in the same animation frame as `brushTo` (D235's coalescing).

**The strip:**
- The Sculpt strip replaces the brush strip (`panel.js:553-568`). It holds the tool, the radius, the one-line hint, and "more ▾": exact size (sharp), wall rise, tube sweep, and Smooth's channel.
- It shows the value at the centre and the widening note during a drag.
- A Route tool's hint ends "moves the road after it".
- Removed:
  - the brush strip's on box, mode select, channel select and "sculpt (shape only)" box;
  - `sculptOn.onchange`;
  - the Build menu "Brush" toggle (`buildmenu.js:36`).

**The menus:**
- In Sculpt, the placing and closing commands are disabled, with the reason "in Sculpt" (design §5).
- Pieces ▾ save and insert stay.
- Switching mid-drag is refused with "finish the brush drag first".

**The handles:** they stand on the selected RUN's middle piece (`handles.js`).

**The falloff band:** tinted on the road over `[s0 − r, s0 + r]`, fixed at the drag's start, as a per-sample weight on the selection layer.

**Tests:** run the existing tests of the touched files. Add a new test only for the Tab-in-a-text-field rule (not visible by looking).

**Headless only.** Every headless browser runs with `--mute-audio`.

### Part 4 (E): the preview degrade ladder (design §4.3)

**Per frame:**
- a chord ghost of the window's pieces (D404's ghost method), with the window's placed mesh hidden under it;
- every other piece's mesh untouched.

**A Route tool on an open lap:** the tail is re-PLACED as a rigid body (`reuseMesh`, D236): one matrix per tail piece. No rebuild.

**A Route tool on a closed lap:** the lap is drawn open during the drag, with the gap as a line.

**The release:**
- the exact segments, mesh and end guard run in the frames after pointer-up;
- the coarse road stays on show until then, and never blinks.

**Never:** `close()` per step, the overlap check during a drag, or a full `toSegments` per step.

**The bars** are §4.4 rows 1-4, A's file (Part 5). E runs them once A hands the file over.

### Part 5 (A): the frame rows first, then the subscribers

**Step 1: write the rows red first.**
- Write `app/test/sculpt-frame.test.js`, design §4.4 rows 1-5, on drag-frame's machinery.
- Run it on ea54ac3, and record which rows are red there.
- Hand the file to E and O (write its path into the hand-back and ring the librarian) before Step 2.

**Step 2: the page subscribers every edit pays** (C's profile, `p-d421-freeze-C_2026-10-20.md` §5):

| subscriber | cost (ms) |
|---|---|
| `segkey.keyOf` | 639 |
| the spawns layer's `spawnsInfo` | 778 |
| `pieceReadouts` | 485 |
| `ghostModel` | 350 |

- Each one goes coarse during a drag, or skips pieces that didn't change, and is exact on release.
- They're shared code: trace each one's consumers and run their tests.
- **Not** `trackmodel.js`'s ghost path (E's file). If a subscriber's fix needs it, A says so and E does it.

**Pending:** D407b (release-frame row 4) stays parked. It's A's own, resumed after this.

### Part 6 (P): review

- P reads each part's diff before it lands, and lists what it would make smaller. It writes no code in t180.
- The builder decides, and the librarian rules on any disagreement.
- Also, C's other leftover: the wording of Sculpt's closed-tube sweep refusal ("BAD_TUBE ... within 0 to 360°" reads as a fault). P proposes one sentence and B puts it in.

## Order and landing

- Parts 1, 3, 4 and 5 start now, in parallel.
- Part 2 starts now on the stubs, and merges C's work when it's handed back.
- E's bars come from A's Step 1.
- Each pane hands back to the librarian.
- **Landing (O), after all five hand back, P has reviewed, and I've read them:**
  - merge onto a fresh `local-0.4.11` from ea54ac3 (or onto `local-0.4.10`);
  - full suite, cargo, harnesses, the drag-frame, release-frame and sculpt-frame files;
  - the credential scan and the keeper scan;
  - no push and no release: releases are batched.
- **Then E installs it locally**, with the builder closed:
  - back up as `.before-local-0.4.11-sculpt`;
  - the stamped compare;
  - the keeper tries it.

NEXT: chair routes Parts 1-6 to C, O, B, E, A, P now; each calls the librarian with its hand-back path
