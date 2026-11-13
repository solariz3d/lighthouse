# The wake gate's new bar: how the start line S is found, REGISTERED before any code (pane P)

Seat: pane P (sibling-372c8abc), W4's author. Tier: PROVE IT. No code is written yet.
The ruling: `exo_memory/loop/plan_room_stretch_2026-11-13.md:215` (441bcc67), read whole. The bar: before the first ring after a wake, the seat has
had **returned** to it every line the dated note gained since its previous wake, through to the last line. When the previous wake is unknown: the
whole note. The other machine's handoffs stay whole.
Branch: **`wg-bar-p` off origin/main fab53587** (lap-w-h-p and lap-i-p are on it). Files: `consonance/hooks/wake-gate.js` and its test,
`consonance/hooks/sessionstart-body.js` and its test, `consonance/tools/lapw-hooks.mutants.js`. Nothing installed.

## The input it reads, checked first

- **A Read's returned lines are in the transcript.** checked: each Read `tool_result` in a transcript starts its lines with `N\t`, from line 1
  or from the offset ("offset 149 limit 6 → numbered 6, 149..154"; three whole Reads → 1..299, 1..225, 1..500). Read with
  `S\lapi\readshape.js`, which prints prefixes and counts only. So the union of returned line numbers can be read as ruled.
- A persisted result has no numbers, so it covers nothing.

## S, the start line

1. **The body hook records it.** At each wake, for the librarian's cwd only, `sessionstart-body.js` adds three fields to its existing ledger row
   (`<data>/sessionstart-body.jsonl`):
   - `session` (the payload's session_id);
   - `note` (the dated note's repo-relative path, from `required()`, the same list both hooks share);
   - `note_lines` (its line count at that moment).
   - Nothing else in the row or the printed line changes.
2. **The gate reads it.** At the first ring after the current wake it takes the body-ledger rows with the **same session** and the **same note**,
   stamped more than 10 s before the current wake's time in the transcript, so the current wake's own row is left out. The latest of those is the
   previous wake: **S = its `note_lines` + 1**.
3. **Unknown means whole (S = 1):** no such row (a new session, a new day's note, a ledger that cannot be read), or `note_lines` larger than the
   note's line count now (the note shrank, so it was not appended to).
4. **N** is the note's line count read by the gate at the decision, never a number the seat states.

## Coverage

- The union of the line numbers the seat's Reads RETURNED since the wake, plus, on a resume wake, those since the last compaction (as today).
  It is checked against **[S..N]** for the note and **[1..N]** for each handoff.
- **Missing lines are named as ranges** in the refusal.
- **A shell `cat`** covers lines 1..k (k = the lines in its result) only when its result is uncut: no persisted tag and no cut marker. A cut
  result cannot be mapped to lines, so it covers nothing.
- **`own-append` as now:** when every missing line lies after the last line the seat's Reads returned, and the file changed after the last Read,
  the row says `own-append`.

## Red first, the ruling's fixture

1. Returned 1-183 and 690-754 of 754, previous wake at :543 → **DENY**, naming 544-689. The previous wake's count was 543 lines, so S = 544.
   The ruling writes "543-689"; I take :543 as the last line read at that wake, and say so here so the reader can correct me.
2. The same with 544-689 returned → **ALLOW**.
3. No previous wake known, 184-689 missing → **DENY**, naming 184-689.
4. Also: a handoff read only in part → deny; a capped `cat` → covers nothing; the current wake's own row is never taken as the previous one.

## Mutants, to be added to `lapw-hooks.mutants.js`

- the union replaced by "any Read with no limit" (the old form);
- S ignored (always whole);
- the 10 s window removed (the current wake's row read as the previous);
- the session match removed;
- the note match removed;
- a cut `cat` counted;
- N taken from the ledger, not the file.

## Limits, named now

- **S assumes the note grows by appending.** A line inserted earlier in the note, or the note rewritten, moves the gained region, and S points
  at the wrong lines. The ruling's falsifier (an older part of that day's note corrects the first hour) is what would show it.
- **Two wakes within 10 s** read as one.
- **A body hook that failed at the previous wake** leaves no row, so the next older row is used. S is then earlier: more lines are required,
  never fewer.

## Registered before the build

- **The build is wrong if** the ruling's three fixture cases do not come out deny / allow / deny as stated above, or if the body ledger's
  recorded `note_lines` at a wake differs from `wc -l` of that note at that moment.
- **The bar is too low** by the ruling's own falsifier (`plan_room_stretch_2026-11-13.md`, the section at :215).

BASE: C:\Users\nname\Desktop\lighthouse fab53587
SOURCES: exo_memory/loop/plan_room_stretch_2026-11-13.md (441bcc67, :215-240); S\lapi\readshape.js over this seat's transcript; consonance/hooks/wake-gate.js; consonance/hooks/sessionstart-body.js
NEXT: librarian read this registration (and the 543 reading in its fixture) when it lands; P builds on wg-bar-p after it is read
