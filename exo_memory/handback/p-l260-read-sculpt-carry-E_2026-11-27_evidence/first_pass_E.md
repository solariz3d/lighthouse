# L260 track 7 read, pane E: first pass on 2067c88..7b3926e (0023853, 7b3926e), written before A's hand-back was opened

Read before this: the packet's "Track 7" and "Amendment, 01:25", and the diff (6 files, +154/−29).

## What the code does
- `coreshell.js`: `bankWithinTurn` is deleted; `brushTo` sends `delta0` (÷ `sculptRatio` for a Sculpt piece) as given. Sculpt's bank handle and the
  bank brush now carry past a turn, from a head past a turn AND from inside one (350 + 20 → 370; the CHANGELOG says so).
- `panel.js`, `handles.js`: untouched. So the typed rule, the ghost handle's crossing-from-inside wrap (350 + 20 writes 10) and the extra handle's ±360 hold
  are as at 2067c88, and so is the whole-turn edge (my item 4).
- Rows: W5 (the flowing offer's value, a guard), S1-S3 (Sculpt's drag through the shell API, the brush), the two core-sculpt D259 rows amended by name with
  a pointer to his answer, core-pieces-ui's ghost-handle row through the handle host on a fake stage, and a Sculpt-mark row through the handle host.
  Harness: B7, B8 (the wrap put back for both or the brush alone), B9 (my F1).

## My four items, as the diff reads (to be checked by running)
1. CHANGELOG:35 corrected, with the correction marked ("This entry first said …"); the rows' header corrected, naming 2067c88 and D677 (2). Holds by
   reading.
2. A ghost-handle row through the handle's own path (`dragBy` on core-pieces-ui's `handlePanel`). It says "Red on f3cd425": to check by running that row
   against f3cd425's panel.
3. W5 + B9. W5 is green on f3cd425 too (the base offered −60, my E2a), so it is a guard that catches B9, which is what was asked.
4. Untouched: panel.js and handles.js are not in the diff.

## What I expect to find, and will vary
1. **The base kind's ±720 clamp** (`handles.js` KINDS.bank min −720, max 720). A Sculpt mark's drag goes through `panel.js` `apply`: `delta = value −
   sculptDrag.base`. On a piece whose middle is past ±720 (or dragged across 720), the handle's value is clamped while the base is not: predict a hold at
   720, or a jump on the first step. Before D677 (2) the shell wrapped within one turn, so the clamp was out of reach.
2. **A closed lap:** a Sculpt drag on a wound piece of a closed lap (the shell re-closes after a drag, `b.closing`): the lap stays closed and its seam a
   whole turn; and the same drag from inside one turn across 360 on a closed lap.
3. **Undo** of a carried drag restores the document's bytes.
4. **Two turns down** (middle −730): the drag carries there too.
5. **The ghost handle crossing 360 from inside one turn** still writes 10 (the hold the CHANGELOG names): the ghost and the Sculpt handle now answer
   the same gesture differently (Sculpt 370, ghost 10). Named in the CHANGELOG as his to rule on; I read it, I do not rule.

## Pre-registered: NOT CLEAN if
- a touched row red at 7b3926e, or a mutant NOT APPLIED counted as caught;
- one of my four items not in as written (the CHANGELOG or header still saying a drag keeps the 10-06 rule where it does not; no row through the
  ghost handle's own path, or one that is not red at f3cd425; no row catching F1/B9; panel.js or handles.js changed);
- a Sculpt drag or brush that the CHANGELOG says carries, jumping round a turn or holding somewhere it does not name (expectation 1 is the candidate);
- a closed lap opened, or its seam off a whole turn, by a carried drag.
