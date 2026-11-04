# D215 — the SOURCES gate reaches DISPATCHES (chair_inject). Librarian, on D, 2026-10-02 16:0x.

The keeper, 15:59: "continue retrieval we were close".

## Why this is the next step
- The gate (D212, fixes D214) is live on hand-offs (`call_librarian`, `call_chair`). Its ledger `C:\Consonance\data\sources-gate.jsonl` at
  16:0x: 23 decisions, 16 allow, 7 deny (6 unmatched, 1 missing), from 3 seats. Mostly probes so far. Real traffic fills the week.
- **The biggest uncovered surface for unchecked figures is the chair's DISPATCHES.**
  - D210: R04 "every figure in a dispatch has the command beside it" = **0.010**, R03 0.826, R09 0.034 (`loop/rule_census_score_2026-10-02.md`).
  - The founding reason for the librarian seat: the chair briefed panes with figures from memory (115 that was 70; 139 that was 158;
    CLAUDE.md "What this seat does").
  - A wrong figure in a dispatch is copied by a pane and re-derived, at the cost of a whole lap.
- **Same hook, one more tool:** add `mcp__consonance__chair_inject` to the gate's matcher. No new logic.

## The build: A (hook tier; targeted tests; B's quick look; the D205 installer)
- `dev/shell/install.ps1`: the sources-gate matcher becomes `mcp__consonance__call_librarian|mcp__consonance__call_chair|mcp__consonance__chair_inject`.
  The second reader's matcher is UNCHANGED (it stays on hand-offs).
- `sources-gate.js`: accept `chair_inject`'s input field for the message (check its real tool_input shape on the chair's transcript).
  The deny reason is the same. `none (no state claims)` stays valid, for dispatches that only route work.
- BUILDING.md WHAT A DISPATCH OWES: one line pointing at item 8 ("a dispatch carries a SOURCES line too; the gate enforces it").
- **Tests:** chair_inject without the line → deny; with matched items → allow; a ring-shaped `chair_inject` to a pane after a pane's
  hand-back was read in the same turn → allow; the second reader is not triggered by chair_inject.
- **B's look:** diff, tests, one live chair dispatch through the gate (denied-then-fixed, or allowed).

## Registered (it joins D212's live week, which is scored together)
- The D212 bars apply to dispatches too, reported separately: ≥ 90% followed; no stall > 15 min; 0 lost dispatches (every deny row
  has a later allow from the chair).
- **One added falsifier:** if the chair uses `SOURCES: none` on > 30% of dispatches that state a number, the slot is being dodged on
  exactly the surface it was built for.

## Next after this (not in this lap): replies to the keeper
Replies to the keeper are the other ungated surface: K, 0/81 labelled on the second read, almost all this seat's. There is no tool
call to gate there. The candidate is a **Stop hook that blocks the end of turn** when the reply states checkable state with no
`checked:`/SOURCES line, so the seat appends its sources in the same turn ("the next breath"). It needs its own design and test, after
this week's numbers.

NEXT: chair dispatch D215 to A when this plan is read
