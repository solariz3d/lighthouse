# P-D168-COLOUR-HANDLES · ECHO: live colour, the jump's two landings, and sculpt handles with live bounds

**Pane E, machine D, 2026-09-27 14:4x–15:1x local.** Repo `C:\Users\nname\Desktop\t180-track-builder`, working tree
only. I wrote under `app/validate-ui/`, `app/handles/` and my `app/test/` files, and nowhere else. `src/` and `test/`
were not touched. **Nothing committed, nothing pushed, no AC launched.**

## 0 · In short

- **Live colour:**
  - Colour runs along the track, per station and per lateral line, from validation's loads and its red and amber
    lists.
  - It follows the build head: an append runs C's `extendPath`, then `revalidate` from the old end. It re-colours only
    the stations whose findings changed, and the result equals a full run.
  - It works on an open track.
- **The jump's two landings:** the 3.2 g and 6.3 g arcs are drawn from validation's own numbers, each caught arc ends at
  its touchdown, and the landing zone is marked between them.
- **Sculpt handles with live bounds:**
  - Every handle in the plan's list, dragged through A's shell as one undo entry.
  - Each drag **stops at the red bound and passes amber** (§2 has why). Alt goes past red and shows it.
- **Tests:**
  - my four files: 44 pass, 0 fail;
  - all of `app/test`: 111 pass, 0 fail;
  - the repo suite: 384 tests, 378 pass, 0 fail, 6 todo.
- **Mutants,** on a copy, never the shared tree: the first pass was 46 applied, 40 caught, 0 NOT APPLIED, with all six
  survivors handled (§3). **Final: 45 applied, 44 caught, 0 NOT APPLIED;** the one survivor is the named equivalent.
- **Three seams are named for other seats** (§4). The largest: **load colours cannot appear in the app today.** The
  shell places words with no design speed, and FINDINGS has no car acceleration, so validation computes no loads. Only
  the geometry reds and ambers show.

## 1 · Files

sha256 and line counts are from `sha256sum` and `wc -l` at 15:0x.

| file | sha256 | lines | what |
|---|---|---|---|
| `app/validate-ui/colour.js` | `b6c5c12f08974299…` | 99 | load → level at validation's own thresholds; red and amber ranges over whole stations; `colourMap`, `recolour` (reuses unchanged stations by identity), `levelAt`, `rgbaAt` |
| `app/validate-ui/live.js` | `6e743fda0e974d57…` | 37 | `createLive().update(path, segments, { fromS })`: a full validate, or `revalidate` then `recolour` |
| `app/validate-ui/jumparcs.js` | `696de710e397b9bb…` | 64 | `jumpArcs(result, path)`: both landings as world polylines, touchdowns, the zone |
| `app/validate-ui/panel.js` | `874e2ecfff5325f5…` | 85 | the controller, with no DOM: follows the shell, picks append, sculpt or full, one update per frame |
| `app/validate-ui/index.js` | `dd1ebaed5c33ce98…` | 80 | `mount(root, shell)`: summary, CSP toggle, colour ribbon, red/amber/lap/jump list, and the `t180:validation` event |
| `app/handles/handles.js` | `2e6126a205a98969…` | 112 | `SCULPT`, `handlesOf`, `startDrag(historyOrShell, id, handle, { bounds, pastRed })`, `clampTo` |
| `app/handles/panel.js` | `66be438618d67164…` | 54 | the controller, with no DOM: the selected word's handles; begin, move, end and cancel through the shell |
| `app/handles/index.js` | `59c0b4cb83a5bf80…` | 78 | `mount(root, shell)`: a slider per handle, clamped, coloured, with the reason; "Show bounds" |
| `app/test/validate-ui.test.js` | `e3057fb8719fda6b…` | 169 | 18 tests |
| `app/test/validate-ui-panel.test.js` | `cc9467db1bb5bb58…` | 109 | 8 tests |
| `app/test/handles.test.js` | `fc8524296594e516…` | 107 | 11 tests |
| `app/test/handles-panel.test.js` | `7836f329f7104b95…` | 97 | 7 tests |

## 2 · Decisions

**A drag stops at red, and passes amber.**
- ARCHITECTURE §1.3: *"Guardrails, not gates … Red is kept for what is known to break; amber means 'no track has
  proven this yet'."*
- **Amber never blocks.** The drag goes on and the handle shows amber.
- **Red is known breakage,** and the D167 export refuses it, so a drag that would turn the word red is **clamped at the
  last clean quantum**. `why` names the limit and its source, e.g. `red past 0.87266…: steep-without-raycast
  (ARCHITECTURE.md:87 …)`.
- **Holding Alt** (`pastRed`) lets the drag through and shows red, for a user who will fix a neighbour next.
- **A word that is already red** has no clean range, so it moves freely and shows red.
- **A value the document refuses** (an ease sum over 1, a roll step) stops the drag at the last value A accepts, and
  shows A's own message.

**The colour levels**, highest wins:
- red 3 > amber 2 > info 1 > clear 0;
- by load, with validation's own comparisons: amber is `fN_g > provenG` (90 g, FINDINGS.md:105); info is
  `fN_g >= suspensionStopG` (20 g, FINDINGS.md:103-104);
- a load is never red: the 60 g red is withdrawn, FINDINGS.md:116-118;
- ranges colour whole stations, both ends included.

**Coarser than the finding:** a range carries only its worst u, so a steep wall paints its floor too. Per-u red needs
validation to publish per-u points.

**No speed model means no lines, but the reds still show.** The map takes its stations from the path, so geometry reds
(fold, stacked, steep, gaps) colour a track that has no loads. I found this while testing: the first version drew
nothing at all on a track without speeds.

**Following the head** (`app/validate-ui/panel.js`):
- **append**, when the old segments are the same objects followed by new ones: `extendPath`, then
  `revalidate(fromS = the old end)`;
- **sculpt**, when a prefix is the same and a later segment changed (the part count may change): `rebuildPathFrom(g)`,
  then `revalidate(fromS = the start of g)`;
- **full** for everything else: the first build, a removed head, undo across a length change, open or new documents,
  and a closed loop.
- **Both C calls work in place** (`src/geom/path.js`). So `fromS` is read first, and after an error the path is dropped
  and the next change rebuilds in full.

**Batching.** Validation runs at most once per animation frame (`schedule`), and changes that arrive in between are
coalesced.

**No mesh crosses IPC** (§9):
- everything runs in the webview;
- a drag's move is a clamp plus one `shell.dragTo`;
- the colours are looked up by (s, u).

## 3 · Tests and mutants

| command | result |
|---|---|
| `node --test --test-reporter=tap app/test/validate-ui.test.js app/test/validate-ui-panel.test.js app/test/handles.test.js app/test/handles-panel.test.js` | **44 tests: 44 pass, 0 fail** |
| `node --test --test-reporter=tap "app/test/*.test.js"` (A's, C's and mine) | **111 tests: 111 pass, 0 fail** |
| `node --test --test-reporter=tap "test/*.test.js"` (the repo suite, B's now; at 14:5x) | **384 tests: 378 pass, 0 fail, 6 todo** (C's six round-trip rows) |

**What the packet asked for, all present:**
- **Load → colour at each threshold, boundaries included.** 19.999999 → clear; 20 → info; 90 → info;
  90.000001 → amber; 1e6 → amber, never red. The thresholds are read from the car, and an amber line lies exactly where
  validation lists `load-above-proven`.
- **An append re-colours only the new span.** Every station before the new span minus validation's one-station
  look-back is the **same object**. The map equals a full re-colour, both through `live.js` and through A's real shell.
  The shell test uses a lap-sim car so there are loads, and it asserts they exist, so the equality cannot hold
  vacuously.
- **A handle clamps at its bound.** Bank dragged to 2 rad stops at exactly the 50° bound (±2e-5 rad). The clamped
  document validates clean, and one quantum past it is red. The low side holds too.
- **The landing arcs match `src/validate/jumps.js`.** Every drawn point is `flightY(x, v, θ, g)` from validation's own
  lip, within 1e-9 m. That holds on a flat take-off and on a 10° ramp. A caught arc ends at validation's touchdown x;
  the zone spans both touchdowns; a missed landing has no touchdown and no zone; with no speed model each arc is
  drawn at its own `minSpeed` and clears the landing lip exactly.

**Also tested:**
- red ranges, including with no loads at all;
- amber ranges that are not loads;
- `levelAt`;
- open tracks;
- a recolour that reaches back over an old station;
- sculpt and full routes, each equal to a full run;
- the CSP toggle;
- a pending jump at the open head is not drawn;
- coalescing;
- pastRed, amber passing, and one undo entry per drag;
- cancel, both through a history and through the shell;
- refusals, both by bound and by the document;
- red-now;
- one drag at a time;
- selection;
- **both panels load through A's webview loader** (`app/lib/cjs.js`) and export `mount`.

**Mutants** (`scratchpad/d168/mutate_app.js`):
- It runs on a **copy** of `src/`, `tools/` and `app/`, never the shared tree (the D167 lesson).
- It prints one progress line per mutant, and a monitor watched it to an end condition.

**First pass: 46 applied, 40 caught, 0 NOT APPLIED.** The six survivors:

| survivor | what it was | now |
|---|---|---|
| `colour: amber ranges ignored` | test gap: only load ambers were tested | a seam-past-envelope amber test |
| `arcs: lip theta ignored` | test gap: every jump fixture took off flat | the flight test also runs a 10° ramp |
| `arcs: no-speed arcs at a fixed speed` | test gap: the test checked the formula, not the drawn points | every drawn point checked at `minSpeed` |
| `arcs: landing road includes the gap` | **dead code**: a touchdown x is never short of the lip (jumps.js searches from x = D), and flight samples all are | deleted, with the reason in the comment |
| `vpanel: fromS read after the in-place extend` | test gap, and a finding: a shell-built track has no loads, so a wrong `fromS` could not show | the panel test uses a lap-sim car and asserts loads exist |
| `hpanel: two drags at once` | **equivalent**: A's history refuses a second drag with the same message | kept, because it fails before a bounds search that costs seconds |

"Copy restored equal to live: NO" on that pass was because I edited the live files during the run, not a restore
failure. **Final pass on the finished code: 45 applied / 44 caught / 0 NOT APPLIED; copy restored equal to live: yes.** The survivor is `hpanel: two drags at once`, the equivalent above. The dead-code mutant was dropped along with its code, which is why there are 45 and not 46.

## 4 · Seams, for the other seats

1. **For C: the colour on the track.** The preview paints one colour per word. My panel dispatches a **bubbling
   `t180:validation` CustomEvent** on its root after every update. Its detail is:
   `{ path, result, map, levelAt(s, u), rgbaAt(s, u), arcs }`.
   - The preview can listen on `document` and paint each vertex by `rgbaAt(s, u)`: its cells know each row's s
     (`rowS`) and each vertex's u.
   - It can draw `arcs[].arcs[].points` as polylines, and mark `arcs[].zone`.
   - That's the same DOM-event pattern as C's own `t180-camera`. **Proposed, not agreed; nothing of C's was edited.**
   - Until then, my panel's ribbon shows the colour: the track unrolled in s and u.
2. **For A: load colours need a speed.** `shell.place` gives a word no design speed, and FINDINGS has no car
   acceleration (`src/validate/limits.js`, `accel: null`). So validation computes **no loads** on a shell-built track.
   Only the geometry reds and ambers colour it, and the lap proof never runs.
   - Either a speed in the pickers or in the sculpt (`shell.sculpt(id, { speed })` exists), or a measured acceleration
     for the car, turns load colour on.
   - This is the biggest gap between the packet's "live red and amber from the loads" and what a user sees today.
3. **For A: `shell.cancelDrag()`.** The shell has none. A cancel through it moves back to the base values and ends the
   drag, which **leaves one no-op undo entry**. This is tested, and named in `handles.js`.
4. **For A: the test script.** `npm test` runs only `test/*.test.js`. A's hand-back already asks B to add
   `app/test/*.test.js`.
5. **Closed:** my D167 todo (the self-check export) is now a real test. B's landing notes that C's cell-naming fix went
   in.

## 5 · NOT verified

- **Nothing in a window.** The `mount`s (DOM, canvas ribbon, sliders, pointer events, Alt) are **not run**. Only their
  controllers are tested headless, and only their loading through A's loader. `cargo tauri dev` was not run by me.
- **Live speed.**
  - Bounds for one handle: 331 ms on a short straight (single `node -e` run on D), and about 2.3 s per handle on a
    tight word (D166).
  - That is computed once at pointer-down, not per move, so it is **not** live-speed. It will be felt as a pause when a
    drag begins.
  - Validation per frame while dragging is untimed.
- A red range colours the whole cross-section, not the u where it is (§2).
- The landing zone's s comes from interpolating the path's samples between road stations.
- The palette colours are display choices (inferred).
- Closed loops are always a full rebuild, because C cannot extend or sculpt them in place.

## 6 · CHANGELOG lines (for B)

```
### Added
- The app's validation panel (`app/validate-ui/`): red and amber colour along the track, per station and lateral line,
  from validation's loads and its red and amber lists. It follows the build head: an append or a sculpt re-validates
  only from the changed word and re-colours only what changed, and the result equals a full run. It works on an open
  track, and without loads (no speed model) the geometry reds still show. Each jump's 3.2 g and 6.3 g landing arcs and
  the landing zone are drawn from validation's own numbers. Tests: `app/test/validate-ui*.test.js`.
- Sculpt handles (`app/handles/`): every handle of a placed word with its physics bounds. A drag stops at the red bound
  (known breakage; the export refuses it), passes amber (unproven, never blocked), and is one undo step. Alt goes past
  red and shows it. Tests: `app/test/handles*.test.js`.
```

NEXT: librarian call_librarian with the pointer when the hand-back is written
