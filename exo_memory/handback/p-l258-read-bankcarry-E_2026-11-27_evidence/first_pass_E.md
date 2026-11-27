# L258 read, pane E: first pass on f3cd425..2067c88 (one WIP commit), written before A's L258 hand-back was opened

Read before this: the packet's track 1 and reader sections, D's "Where it stopped" (p-bankcarry-A_2026-11-26.md:1-22), and the diff.

## What the code does
- `headTurns()` = 360 × round((h − wrapTurn(h)) / 360), h the head's bank in degrees; `inHeadTurn(T)` = T + headTurns().
- `bankTarget()` (the field) and `secThen` (each extra bank row) now send `inHeadTurn(typed)`, never wrapped. Within one turn nothing changes
  (headTurns 0). The `onchange` that wrote a typed |bank| > 360 back into the field wrapped is gone.
- The two offer paths (the flowing bank's offer at :1486 and the extra offer at :1505) take `base = Number(last ? last.target/DEG : bankTarget()) −
  headTurns()`.

## What I expect to find, and will vary
1. **The offer's base with an untouched bank field.** `bankTarget()` is `''` when the field is untouched ("continue"), and `Number('')` is 0, so with
   the head past a turn the base becomes `−headTurns()`: **+360 from a head at −392**, where the field shows −32. At f3cd425 the same path gave 0.
   Predict: an offer drawn at 360 (the extra handle's limit, ±360) on a head past a turn; and whatever a drag of it lays, it is not "from −32".
   To measure: the offer's `base` through the panel, and what a drag on it lays.
2. **The ghost's bank handle is a drag that goes through the field** (`panel.js:1089`: it writes `show(wrapTurn(value))` into the field, then the
   field's handler, so `bankTarget` → `inHeadTurn`). So with the head past a turn, a drag of the ghost's bank handle now lays in the head's turn
   (rolls on), where at f3cd425 it laid the wrapped value (unwound). The CHANGELOG says "The drags (the ghost's bank handle, …) keep his 2026-10-06
   rule unchanged". Predict: the handle's own range and what it writes in the field are unchanged; **the road it lays is not**. To measure: base
   against tip, the same drag.
3. **Only the head's turn counts.** Every typed value is taken in the HEAD's turn, rows included; a row is not taken in the previous row's turn.
   From −340: a row −420 is −420. From −392: a row −60 is −420, a row −400 is −760. To check that rows chain as the CHANGELOG says.
4. **A closed lap.** The core's close is unchanged, but a lap whose head is wound past a turn now types differently; to vary: close a lap
   wound past a turn, then type a bank on the next piece and see what headTurns does after Close (the head is the closed end).
5. **A head at exactly ±360** (`wrapTurn(±360)` is 0, so headTurns is ±360, and the field shows 0): a typed 0 there keeps the road where it is, and a
   typed 360 adds a second turn. Round-off: a head at 359.999 is in turn 0.

## Pre-registered: NOT CLEAN if
- any red in the touched rows at 2067c88 (core-bank-carry 7, its harness 8, and the amended rows), or a mutant NOT APPLIED counted as caught;
- an offer, a row or a field from a head past a turn lays a bank a whole turn away from what the field and the row show (item 1 is the candidate);
- a drag the CHANGELOG calls unchanged lays a different road from f3cd425 (item 2), unless the hand-back says so;
- a saved track (copies) that opens or round-trips differently between f3cd425 and 2067c88.
