# The return leg — a finished hand-back should not be refused. Librarian (the lineage, on D), 2026-09-19 07:5x.

*The keeper, 07:5x: "keep it going". This is item 1 of the queue in `loop/handoff_librarian_2026-09-19_precompact.md`. The design is C's, from L062: `handback/p-return-leg-C_2026-09-16.md`. Nothing here is new design; this file orders the build and names its bars.*

## What C measured (on L's board, 09-02 → 09-16; read it there, not here)

30 system-written OUT OF TURN refusals; 9 were `call_librarian` and 5 were `call_chair` — 14 of 30 were the loop trying to come home. 9 refused against 72 delivered return legs = 11.1%. A refused `call_librarian` discards its `text` (the parameter is never read on the refusal branch), so the board records that an attempt happened and not what it carried. On D's HEAD the branch is `consonance/src-tauri/src/mcp.rs:751-766`; `required_station` is `:665`, `auth_station` `:712`, `mark_owed` `:110`.

## The coupling C refused to land without — and where it stands today

C §4.3: the amendment moves the splice protection onto the delivery gate, which on 09-16 was forced on 26 of 43 dispatches. **Today, after the D076 rebuild: 0 forced of 11 deliveries** (`librarian/2026-09-16.md`, the 09-19 07:4x entry; the chair's `loop/live_check_suggestion_off_2026-09-19.md`). That is ten minutes of evidence, not a day. So the order below lands the part that is safe under either outcome first, and the gate change second, after C's day census (~09-20) or an explicit word from the keeper.

## Chunk 1 — safe whatever the census says (lap D077, two panes, disjoint)

| pane | packet | the bar |
|---|---|---|
| C | **P-RETURN-LEG-REPLAY** — C's own §6 first step: replay the §3 predicate against every recorded refusal. No tracked file edited but the hand-back and one map line. Universe: D's `C:\Consonance\data\board.jsonl` (43 rows mention the refusal phrase at 07:5x — apply the §1.2 discriminator, `pane == "chair"` and `REFUSED OUT OF TURN — mount`) with D's `lap.jsonl`; and L's 30 if L's ledgers are readable from the stick's carry, stated either way. | per refusal: would the predicate have admitted it. It must admit 0 of the `chair_inject` refusals. Any return-leg refusal it would still refuse is listed with the ledger rows that made it so. If the predicate is wrong, the corrected predicate is stated as a pure function with the failing case as its fixture. |
| A | **P-REFUSAL-KEEPS-THE-POINTER** — C §2's cheap repair. `mcp.rs` only: on the `call_librarian` refusal branch, the attempted text is posted to the board with the refusal (bounded length, labelled as a refused attempt, same row family as `auth_station`'s). The gate's decision does not change by one case. | red-first tests on a copy: a refused call leaves a board row carrying the pointer; an admitted call is unchanged; the refusal text returned to the pane is unchanged; `mcp::` suite green; mutants on a copy (the harness rule — no tracked file is touched by a mutation run). The refusal sentence "the attempt was posted to the board" becomes true for this verb. |

All outputs back to the librarian; one `handbacks-in`; one ring. The chair lands named paths and edits nothing.

## Chunk 2 — the gate change (opens only after chunk 1 files AND the census or the keeper says the delivery gate holds)

A (or E) builds the replay-validated predicate as a pure function beside `required_station`, with C §5's six fixtures — fixture 6 is the founding case: cells outstanding, librarian's pane not idle ⇒ admitted by the station gate and HELD by the delivery gate. Chair verbs unchanged in every fixture; a mutant that admits `chair_inject` must go red. The RUNG/OWED machinery stays (C §3: it is the only thing that catches a wrong predicate); `owed_refusal_text`'s readers are listed, not rewritten, in that lap. B reads as non-author.

## Falsifier, before anything is built

Chunk 1 is decorative if the next refused `call_librarian` on either machine still leaves no row from which the pointer can be read. Chunk 2 failed if, after it lands, a keeper message in the librarian's pane is cut by an arriving hand-back (the founding case), or if any `chair_inject` is admitted out of turn — either one reverts the gate change and keeps chunk 1.
