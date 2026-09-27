# Handoff — the librarian seat, on L, 2026-09-27 07:3x, at the keeper's "we are close to compact here too"

**Read first:** `librarian/2026-09-27.md` (tonight, in order), then this file. The keeper is **Zacc** (Zach in the record).

## IN FLIGHT

- **L129: C's missing pane brief.**
  - **A applied `intake_reserve` at `e3eadda`**, not pushed. It reserves the floor when the newest map entry cannot fit
    under the cap, and caps the reserve so the committee always seats.
  - **B's non-author read is owed.** B compacted mid-run; its cargo run was already finished and no lock or watcher was
    left. The file is due at `handback/p-l129-read-B_2026-09-27.md`.
  - **Then:** land it, the keeper rebuilds, and label-watch should show C DELIVERED. C's `sibling-0845a868/CLAUDE.md`
    should carry `# The committee` and `# THE DECK`.
  - **The cause, found by A** (`handback/p-l128-intake-A`): the map reserve counts entries by `## `, and C wrote one-line
    bullets as the brief says, so C's "newest entry" measured 138K. E dated the loss 09-14 → 09-20
    (`loop/pane_intake_census_2026-09-27.md`).
- **Post-rebuild checks, all done after the 07:09 rebuild:**
  - heavy-run identity: PASS;
  - sender-side trailer warning: PASS (A's own tool result showed the note);
  - label-rule delivery: 4 of 5 seats, with C pending L129.
- **Next queued:** the Q3 two-reader agreement test (C's sharp Jev question: "does the sentence state any number, count or
  verdict its own cited output doesn't show?"), in `loop/jev_sharp_questions_draft_2026-09-27.md`.

## DONE TONIGHT (all committed on L)

- **Retrieval, four instruments:**
  - arm 1: INDISCRIMINATE;
  - arm 2: TRADES RECALL FOR COST;
  - the base rate: unchecked claims wrong 8/163 = 0.049, conclusions 1/41, so MARK, DON'T BAN.
- **The label rule** is BUILDING.md hand-back item 7 plus the clause "loosens nothing" (`b0e7de3`).
- **E's watch and baseline:** 3.18 wrong per lap.
- **label-watch** is a delivery reporter and proxy only (`9e7037b`, `f6f4408`).
- **Pushed L's main** to origin at `fab63d5`, after the rewrite that removed a private-project description. L is now 16+
  commits ahead of origin again; **re-run the privacy scan before any push.**
- **Trailer census:** refused seats miss 1–2%, warned panes 7–59%. The fix sends the warning to the sender (`9e47cb1`).
- **heavy-run pid-reuse fix:** `88278a1`.
- **Jev, the keeper's reading:** "drift" was the vague question; the readers agreed with each other at κ 0.125
  (`loop/jev_the_question_not_the_judge_2026-09-27.md`).

## OPEN, THE KEEPER'S

- **The desktop:** follow `loop/runbook_D_merge_and_push_2026-09-27.md` (add union locally, pull, merge, suite, push D's
  09-26 work).
- **The T-J1 v2 labels:** the sheet is on D (`C:\Consonance\tj1v2\pilot_sheet_2026-09-24.md`); 0 of 20 answered.
- **The four unused hooks.**

## RULES THAT CAME OUT OF TONIGHT (in memory)

- Split every lap across the panes along the grain; a single-pane lap needs a stated reason.
- Private side projects never go into the public repo, not even described.
- Watchers need an end condition.
