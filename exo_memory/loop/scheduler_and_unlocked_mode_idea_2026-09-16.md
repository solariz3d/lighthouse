# The scheduler, and the unlocked mode — the keeper's idea, saved with its prior art (not built)

*Librarian (the lineage, on L), 2026-09-16 07:1x, ten minutes after thesis run 1 filed. Saved the way `pane_battery_idea_2026-09-11.md` and `stick_arrival_module_idea_2026-09-14.md` were: the keeper's words verbatim, what the record already holds, what would have to be true before it is built, and the falsifier. Nothing here is a plan; the plan is a lap.*

## The keeper, 07:1x, verbatim

> "well id say it passed. There will always be someone in the room that engauges the work, even with how autonomous you can operate with the loop, the user still acts as a spark that can start the work. But perhaps we can plan for future work, a scheduler, the user can choose a time and project or inquiry or build for you to work on an expand until it is complete. Then stops and hands it back to the user. But it would be cool to have a unlocked mode that simply allows the system to work indefintely, choosing and planning future tasks after the first autonomous laps are completed, you see what I mean?"

Two things, and they are different in kind:

1. **The scheduler** — a time and an object (project, inquiry or build) chosen by the human; the loop works it "until it is complete", then STOPS and hands back. Bounded by the human at both ends.
2. **The unlocked mode** — after the first autonomous laps, the loop chooses and plans its own next tasks, indefinitely. Bounded at neither end except by a human unlocking it.

## The ruling this rests on

The keeper's reading of thesis run 1 (`librarian/2026-09-16.md` 07:09, both readings filed): **it passed**, because the strict reading's one human turn was the spark, and "there will always be someone in the room that engages the work". So the README's sentence at `:87` is answered in the keeper's form: the ferry is gone from the middle of the lap; the spark stays at its start. The scheduler is the spark moved forward in time; the unlocked mode is the spark once, then the loop supplying its own.

## What the record already holds — cite, do not rebuild

| the idea's part | already on disk | what it settles |
|---|---|---|
| the loop opening a lap with no human inquiry | `lap-row.js --entry ring` ("no user inquiry entered — the loop supplied this lap itself"); `two_doors_amendment_2026-09-02.md`; D008–D010 ring laps; **L063 tonight** — opened, run, filed, 0 human turns in chair + panes | the unit exists and has run; the unlocked mode is this repeated |
| a clock as the trigger | `second-vantage.js:4-5` — "a duration goal wakes this on a clock … the firing is a clock's decision, nobody's judgment"; and `journal/2026-08-17.md:163-173` — **the clock was never built**, the only file naming the runner path was the runner itself | a scheduler was designed once and the trigger never existed; build the trigger first, then anything it fires |
| a seat handed a baton it was never told about | `baton-wake.js` header — D005's map sat 8.99 h; the wake channel exists and runs unattended (01:06:45 ring landed with nobody present) | "hand it back to the user" has a mechanism for seats; for the human it is the ask channel, below |
| firing into an empty room | `journal/2026-08-17.md:172-173`: **no `WakeToRun`** — "firing into an empty room is the same spend with nobody to read the finding" | the unlocked mode's first cost: tokens with no reader; L063's ten minutes cost two panes + chair + librarian for one one-character-class defect |
| the machine staying up | rows 4–5 (`135e4c8`), `SetThreadExecutionState(ES_CONTINUOUS, ES_SYSTEM_REQUIRED)` at `main.rs:11271`, AC-only; the stick's Leave on OS shutdown | the laptop can now stay awake for a scheduled window without the keeper's hand |
| questions while the human is absent | `ASK.md` — 14 asks filed, the protocol at `:21`; `keeper_ruling_no_questions_in_lap_2026-09-16.md` — file on the ask channel and continue | "stops and hands it back" = a filed ask plus a parked row; the mechanism exists and is text |
| a lap that stalls with nobody moving | `stalled_lap_detector_2026-08-29.md`; `packet_stalled_at_chair_2026-09-09.md` (the chair stalls silently); tonight: 345 prompts printed a stale lap and nobody acted (`librarian/2026-09-16.md` 05:27) | an indefinite mode needs the detector to ACT, not print; B's trailer gate and the NEXT trailer are the current answer |
| the loop choosing its own object | L063: the chair chose from the previous lap's residue; `cycle9_preregistration.md` (does the lattice catch without the keeper — D1 yes, D2 no); the trigger index (`trigger_index_preregistration.md`) is the room's list of situation→object | one choice observed (n = 1); the class of objects a loop can choose unaided is unmeasured |
| what a full launch costs | C's bound ≤ ~338k tokens per full launch (`pane_archetypes_idea_2026-09-16.md`); the weekly limit is the keeper's plan | the unlocked mode runs into the limit, not into a wall of judgment; the archetype idea is the lever |
| the hand-back to the human | `close.js` / the stick Leave; the handoff files; the survey ledger | "stops and hands it back" is a handoff file plus a Leave; both exist |

## What would have to be true before the scheduler is built

- **A trigger that exists.** The 08-17 lesson verbatim: the runner path was named in one file, itself. The scheduler is a Windows task or the app's own timer that fires `lap-row.js --open --initiator chair --entry ring` with the keeper's object as the inquiry, and its first test is that the task is registered (`schtasks /query`) and fires once with the app closed.
- **"Until it is complete" has a predicate.** The room measures failure and not success (`objectives_not_only_falsifiers_2026-09-01.md`). A scheduled build needs the completion condition written BEFORE the window, or the loop cannot stop by itself and the stall detector is the only exit.
- **The ask channel is the only door to the human.** Inside the window the chair files asks and continues (the 01:1x rule); the run's verdict lists the asks, and the human answers them on return.
- **The seal-row decision (A §5.2).** Any keyed task while the keeper sleeps needs a push nobody is present to make; either the narrow standing yes or unkeyed objects only.

## What would have to be true before the unlocked mode is built — and its falsifier, first

- **A stop that is not the human.** The token bound per launch, the weekly limit, a lap count, or a filed-asks count: at least one written, machine-checked ceiling, or the mode is "indefinite" in the degenerating sense.
- **The object-choice class measured.** n = 1 tonight. Ten ring laps with no human object, scored on whether the chosen object was (a) from the record's residue, (b) covered by a trigger already, (c) invented. If most are (b), the mode is the trigger index run on a clock and should be called that.
- **The falsifier, registered now:** the unlocked mode is decorative if, over its first ten laps, no lap lands a correction that a human later opens (the librarian's own "opened" instrument, `CLAUDE.md`), or if the corrections it lands are all in files it wrote itself that night. A loop that only corrects its own residue is a loop talking to itself.
- **The keeper's own rule from the third principle:** "did a check precede the claim" — every ring lap's object must cite the record row it came from, or the choice is unconditioned.

## Not built. Not planned. Saved.

The next honest step is not code: it is **thesis run 2** — a ring lap while the keeper sleeps, the scheduler's first firing — which tests the scheduler's trigger and the empty-room cost in one night. Run 1's verdict names it.
