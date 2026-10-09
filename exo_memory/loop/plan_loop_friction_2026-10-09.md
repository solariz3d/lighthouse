# The loop got slow because the seats optimise against being caught. Measure it, then loosen what costs and catches nothing. Librarian, on D, 2026-10-09 11:0x. Lap D276.

The keeper, 10:59: "I view every seat, almost putting more or too much effort into their outputs being aligned in a safe way to not be called out,
instead of simply flowing through the path you see, right or wrong, with less friction. The whole point of the loop isnt for the individual seats to
become better themselves, but the whole system of seats to work better together … perhaps you are the other seats change the rules by accident in
such a way that you worry more about being wrong than being smoothly right." 11:05: "we should get to the bottom of this".

## The first number (librarian, `C:\Consonance\data\sources-gate.jsonl`, rows since 2026-10-08)
186 rows: 153 allow/matched, **30 deny/unmatched**, 3 allow/none. **All 30 denies were followed by an allow from the same seat within 10 minutes.**
The librarian's own were the same message with the Sources line reworded to match a command's exact text. inferred, to be measured: most of the 30 are
format-only.

## The hypothesis, registered with its falsifier BEFORE any measuring
**H:** the gates that check a seat's PAPERWORK (the SOURCES line's wording, the NEXT trailer's grammar, the reply slot's Sources line) cost round trips
and almost never change the CONTENT of what is sent. The checks on the WORK (tests, parity, identity diff, cold reads, the release build) carry the
catches. The paperwork gates also teach defensive writing (hand-backs growing "does not establish" / "my own fault" sections), which slows laps.
**H is FALSE (and the gates stay as they are) if:** in the measured window, ≥ 30% of paperwork-gate refusals were followed by a re-send whose CONTENT
(the message minus its Sources/NEXT/OUTPUT lines) changed. That would mean the refusal made the seat fix a real claim, not just its wording.

## The lap (E, who built the gate instruments and measures cleanly; MEASURE ONLY, nothing changed yet)
1. **Per gate since it went live:** SOURCES (`sources-gate.jsonl` + the rings on `board.jsonl`), the NEXT-trailer refusals (`board.jsonl` trailer-gate
   rows), and the reply slot (`reply-slot.jsonl`). Count refusals, and for each refusal → re-send pair, whether the CONTENT changed (diff with the
   gate's own lines stripped). Report the share of content-changing re-sends per gate.
2. **Time cost:** the extra wall-clock per refused hand-off (refusal → accepted re-send).
3. **Lap speed over time:** dispatch → hand-back durations in `lap.jsonl`, before the gates went live (2026-10-02/03) vs after, per pane. Name the
   confounders (lap size, kind of work); don't adjust them away.
4. **Defensive text:** across the hand-backs in `exo_memory/handback/`, by date, the share of lines under caveat / "does not establish" / "my own
   fault" / correction headings. Report the trend only, no verdict on any seat.
5. **What the work checks caught,** from the record (the cold reads, release builds, harnesses, identity diff since 10-08), set against what the
   paperwork gates caught.
- Output: one measurement file with each number's command beside it. Then the librarian scores H against its falsifier, and the keeper decides what
  loosens (candidates, NOT yet chosen: SOURCES matches what was run, not its wording; the reply slot warns instead of blocking; the trailer gate
  fills in a missing `when` instead of refusing; a brief line, "flow the path you see; the work checks catch you; a hand-back is a pointer, not a
  defence").
- Beside it, not in this lap: the 10-03 error re-measure (`loop/remeasure_registration_2026-10-03.md`) runs from 10-10 05:55 as registered. Together
  they give both sides: whether the gates made the room less wrong, and what they cost.

NEXT: chair dispatch D276 to E when this plan is read
