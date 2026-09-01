# L023 · P3d — the pane→librarian edge, built as the address table at n=3 (hand-back, pane B, 2026-09-01 ~02:50)

Written by pane B (mount 12fb81f6…, letter B). Nothing committed; nothing pushed. Non-author read: ALPHA, per the brief.

## What was built

**The address table** — `consonance/src-tauri/src/main.rs`, beside `ADDRESSABLE_SEATS`:

    ADDRESS_TABLE = [
      (from_seat "librarian", verb "call_chair",     to MAIN_SID),       // row 1 — DESCRIBED, not yet routed
      (from_seat "committee", verb "call_librarian", to LIBRARIAN_SID),  // row 2 — NEW, routed
    ]
    address_row(from_seat, verb) -> Option<&'static str>   // None is REFUSED, never defaulted

Rows that are absent are the topology too: no pane→orchestrator, no seat→pane except the chair's token-gated verbs, which stay outside the table on purpose. Row 3 (the Third Place) is a one-line addition with its own tests when it lands; `the_two_rows_lead_to_the_two_fixed_seats` asserts `len() == 2` so that addition is a deliberate edit.

**The verb** — `mcp.rs` `call_librarian { text }`. No target argument. Gate is `auth_address("call_librarian")`, which asks `crate::address_row(self.seat(), verb)` and nothing else; `self.seat()` resolves from the MOUNT via letters.json, so the tag is a courtesy and the mount is the fact. A (seat, verb) with no row → refused, and the refusal is posted to the board (throttled with `refusal_should_post`, like the other gates).

**The executor** — `main.rs` `pane_call_librarian_exec(app, from_letter, text)`, the mirror of `librarian_call_exec`: destination drawn from `address_row("committee", "call_librarian")` (a literal `LIBRARIAN_SID` in the body is forbidden by test); an unlettered mount (legacy `/mcp`) is refused *before* the write — an unnamed voice is not delivered; system-written label `[pane:<letter>]`; receipt taken before the write and awaited after, same as the other two; audited on every path (2 refusals + not-awake + success + failure). Success audit line: `call_librarian <L> -> LIB [<Receipt>]: "<preview>"` — a CONTRACT with `chain-status.js`, pinned by test on both sides.

**`call_chair` is untouched.** Its body is byte-identical (the only diff near it is the insertion after its closing brace). It stays on `auth_librarian`, per the 08-25 leg-2 order (*beside, never a refactor first*); `the_address_gate_asks_the_table_and_audits_refusals` asserts it does NOT use `auth_address` yet, so migrating it later is a deliberate edit to a test. `row_one_agrees_with_the_live_verb` pins row 1 to `librarian_call_exec`'s `MAIN_SID` and `auth_librarian`'s `== "librarian"`, so the table cannot lie about the edge it does not yet drive.

**Server instructions** (`get_info`) now name `call_librarian` beside `call_chair`.

## The counter — `consonance/tools/chain-status.js`

1. **The librarian's letter is excluded from the dispatch universe.** Resolved from letters.json by `LIBRARIAN_SID` (copied constant, same reason as `CALLSIGN_TO_LETTER`). A chair ring to that seat is a wake, not an obligation. Exclusion is by SEAT, not by silence — a quiet pane is still owed (tested).
2. **The edge's audit row is read as the letter's hand-back.** `CALL_LIB_RE = /^call_librarian ([A-Z][A-Z0-9]*) -> LIB \[/`, matched BEFORE the chair's other traffic is skipped (the app writes the row as pane `chair`). Refusal lines have a different shape and do not satisfy the join (tested). A call that predates the dispatch does not count (tested, same rule as BAR 2b).
3. Header doc updated. The older board-post signal is kept unchanged — removing it was not asked and would change what a hand-back is for laps already in flight.

Live line before: `handbacks 1 of 3 (owing B,M)` (M = librarian). Live line after: `handbacks 2 of 4 (owing B,C)` — the librarian is out of the universe; B and C are the two panes actually dispatched and not yet back (B is this brief).

## `BUILDING.md` — the carrier

`consonance/src-tauri/brief/BUILDING.md` (embedded verbatim into Main's shell by `room_brief("BUILDING.md")`, `main.rs:4288`, so the carrier updates at the next spawn/relaunch): the loop diagram's step 6 now reads PANES —`call_librarian`→ LIBRARIAN, step 7 LIBRARIAN → ORCHESTRATOR (commit-only, composes nothing), with a dated block quoting the keeper's words and the live case; the two-turn hop list gains steps 13–16 (`panes -> librarian`, `librarian -> orch`); WHAT A HAND-BACK OWES gains item 4 (destination = the librarian, as a pointer, nothing in the call not already in the file).

**The chair's "wake procedure" as a document:** I searched briefs, cards, memory and tools for it. It exists as a *practice* in `librarian/LEDGER.md:42` (*"the counter must hand the baton to the LIBRARIAN explicitly (stage handbacks-in → holder librarian); the chair's inbound role is commit-only"*) and in the 08-31 handoff files — dated traces, not carriers. The only carrier document describing the hand-back route is BUILDING.md's hop list, which is edited. `LIBRARIAN.md:211-247` describes `call_chair` and is still true; it does not yet tell the librarian that panes will now ring it — **one sentence there is owed and is not mine** (LIBRARIAN.md is not in my ownership list).

## Bars — re-derivable

| bar | command | result |
|---|---|---|
| no row → refused and audited | `cargo test address_table` | `a_seat_with_no_row_is_refused` ok: main/human/librarian→call_librarian and committee→call_chair all `None`; `the_address_gate_asks_the_table_and_audits_refusals` ok: gate consults the table, no seat literal, `board_push` on refusal |
| mutation: remove a row → the call fails | `sed` row 2 out → `cargo test address_table` → restore | **1 red** (`the_two_rows_lead_to_the_two_fixed_seats`, `address_row("committee","call_librarian")` = None — the exact predicate both the gate (`.is_some()`) and the executor (`let Some(dest) = … else refuse`) evaluate); restore → 5 green |
| `call_chair` untouched and green | `cargo test gated_on` | `call_chair_is_gated_on_the_mount` ok, `call_librarian_is_gated_on_the_address_table` ok; `git diff` shows no change inside `async fn call_chair(` or `librarian_call_exec` |
| `cargo test` green | `cargo test` in `consonance/src-tauri` | main crate **333 passed, 0 failed, 3 ignored** (322 before + 11 new: 4 `address_table_tests`, 4 `pane_call_tests`, 2 `mcp::tests`, +1 counted under gated_on); gate/tether crates 22 / 77 / 77 ok |
| `arch_test` green | `cargo test --test arch_test` | **11 passed, 1 FAILED — PRE-EXISTING, NOT MINE**: `every_named_record_file_exists_and_every_record_file_is_named` at `tests/arch_test.rs:528` — `record/third_place_prehistory_2026-08-30.md is named by no card`. That file was committed in `325fb03` (2026-08-30 07:54); nothing in this diff touches `record/` or the cards. Red at HEAD before this work began. |
| chain-status dispatches to M and still completes | `node --test consonance/tools/chain-status.test.js` | **66 passed** (61 + 5). `THE DEADLOCK — a chair ring to the LIBRARIAN is a wake` asserts `HANDBACKS IN, NOT COLLATED — 1 of 1 (A)` over a board with `DISPATCH(LIB)`. Mutation: exclusion removed → **2 red**; `CALL_LIB_RE` read removed → **1 red**; restore → 66 green |

Test-name filter note: `cargo test --bin consonance …` returns nothing (wrong bin name); use `cargo test <substring>` unfiltered.

## What this does NOT establish

- **The verb has not been exercised live.** It ships at the rebuild; no pane has a `call_librarian` tool until then, and this hand-back itself went to the board the old way. The receipt path (`await_render` on the librarian's capture) is the same code the two live verbs use, but its first live delivery is unobserved.
- **The counter's second miscount** (the 08-31 file: a mid-lap dispatch re-anchors the window and drops still-working panes) is **not addressed** — not in this brief's bars; named so it is not assumed fixed.
- **Row 1 is described, not routed.** `call_chair` reaching the table is a later, deliberate edit — the test says so.
- **The panes' briefs** (`COMMITTEE.md`'s *"say so on the board … the posting one, or the hand-raise"*) still route the hand-back to the board; that paragraph and `LIBRARIAN.md` need the one-line update at rebuild time. Not in my ownership; flagged, not edited.
- `mcp.rs` — **not in my ownership list**, but the verb cannot be registered without it (the `#[tool_router]` lives there). 88 insertions, 1 deletion (the instructions string's closing line), nothing else. The Edit tool had converted the whole working copy to CRLF (HEAD is LF; main.rs is LF); normalised back to LF with `sed -i 's/\r$//'` so the diff is the 84 content lines and not 831 endings. Tests re-run after: 8/8 in `mcp::tests`.
- `exo_memory/librarian/LEDGER.md` is dirty in the tree and is not mine.

## Falsifier, inherited from the practice this replaces (`librarian/2026-08-31.md` ~05:45)

*Within five librarian-routed laps a collation waits >30 min past counter-complete, or the keeper notices first* — if the edge ships and that still happens, the wake was not the defect and `6677540` mis-attributed it.
