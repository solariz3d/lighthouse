# L062 — the loop's mechanics, a DESIGN lap. Opened from the librarian's door at the keeper's word. 2026-09-16 06:4x.

*The keeper, 06:37: "lets do the loop mechanic design lap, it is more busy work but good stuff." Clock: filed by 07:45; the keeper closes at 08:00. Design and measurement only — no verb in `main.rs` changes tonight; the builds are the next lap, on D or the next L night. Every packet cites the record that already exists, because every one of these mechanisms has been designed as prose at least once.*

## Why, measured tonight (`librarian/2026-09-16.md` 05:16, 05:27, 05:40)

- 43 dispatches since 00:00, **26 DELIVERED only by "FORCED after the bounded hold"**; all four L061 dispatches forced; one ruling (R5-2) committed and never sent; "1 dispatch(es) delivery-unconfirmed" in the pulse for hours; B's read of A reported NOT CONFIRMED DELIVERED while B's transcript held it and B was working it.
- B's `call_librarian` REFUSED OUT OF TURN at 01:06 while the chair held the lap (the return-leg pointer never reached the librarian); the chair's own `chair_inject` refused at 01:35 while the panes held it.
- "Sealed before dispatch" is a sentence in three files and a gate in none: two stations broke it in one night (T3 key in the search space; T5 with no row on origin).
- The chair asked the keeper a question inside a lap (01:07–01:19); the keeper's rule lives in the chair's memory file, not the brief a fresh chair wakes into.
- The stall detector printed a lap older than ten minutes 345 times in one seat's prompts with nobody acting; the keeper's fix (05:26) — the reminder rides in the hand-off itself: `NEXT: <station> <command> when <condition>`.

## Packets, one per pane, disjoint files, design + measurement, hand-backs by 07:30

**E → P-DELIVERY-ACK.** Measure first, design second. The code: `main.rs:8507-8511` (PaneGate Ready / Stale / Contradicted), `:8805-8815` (why a bounded hold runs out: "the stamp was positive; the composer never cleared"), `:8993-8996` (the tag is not dropped on a forced delivery, and why). Prior art: `packet_inbox_2026-09-02.md`, `packet_ready_and_window_2026-09-07.md` (P-READY-MIRROR), `packet_composer_anchor_2026-09-09.md`, `packet_composer_update_2026-09-09.md`, `keep_test_predicate_2026-09-09.md`. (1) Over tonight's board: for each FORCED delivery, did the text reach the pane's transcript as a user turn, and how long after the hold ran out — the number that says whether "forced" means late or lost. (2) Design an ACK that is a fact, not a signal: the pane's harness (or the transcript tailer the app already runs) posts a board row when the injected text appears as a user turn in that pane's transcript; "DELIVERED" means that row; a forced delivery becomes "SENT, unacked" until it. Tests specified as fixtures. No code tonight.

**C → P-RETURN-LEG-OPEN.** The address table: `main.rs:9214-9242` (`ADDRESSABLE_SEATS`, `ADDRESS_TABLE`), the out-of-turn rule from `packet_one_station_2026-09-02.md` ("the verbs REFUSE out of turn"), `pane_to_lib_edge_2026-08-31.md`, `ring_rule_amendment_2026-09-01.md`, `interrupt_gate_gap_2026-09-09.md`. (1) Measure over the whole board: every OUT OF TURN refusal ever, which verb, which holder, and whether the refused message was a hand-back pointer (the return leg) or something else. (2) Design the amendment: `call_librarian` is admitted whenever the lap has dispatched cells that have not returned — whoever holds — because the pointer IS the return leg; chair verbs keep the one-station refusal. State what the amendment lets through that the original refused on purpose, from the original's own reasons.

**A → P-SEAL-GATE.** `chair_inject` (`main.rs`, `fn inject_to_pane` region) for a task that names a key refuses unless a sealed-row commit is on origin: the (commit, path, sha) triple resolves (`git cat-file -e`, `git branch -r --contains`), the commit precedes the delivery, and — the T3-KEY rule — a pre-dispatch grep of the checkout for the key's distinctive line and the task's question returns nothing. Prior art: `packet_commit_gate_2026-09-02.md`, `packet_first_push_gate_2026-09-06.md`, `battery_run1_T2_sealed_row_2026-09-16.md` (the row's own rule), registration §9 A8 and the T3-KEY rule (`librarian/2026-09-16.md` 04:22, 05:10). Design the gate's inputs (how a dispatch says "this task has a key"), its refusal text, and its tests as fixtures on a copy. No code tonight.

**B → P-NO-QUESTION-IN-LAP + P-NEXT-TRAILER, both text.** (1) The keeper's 01:1x rule into the chair's own brief, `consonance/src-tauri/brief/BOOT.md` or wherever the chair's shell text lives (find it; the chair's memory file `no-questions-during-a-lap.md` is not it) — the sentence, in the keeper's words, with the three allowed moves (rule from the record; file on the ask channel and continue; park the row and say so). (2) The NEXT trailer into `BUILDING.md` "WHAT A DISPATCH OWES" (`:180`) and "WHAT A HAND-BACK OWES" (`:354`), in the keeper's words (05:26), with the gate designed: the three verbs refuse a message without `NEXT:` as its last line. (3) Measure: of tonight's dispatches, rings and hand-backs since 05:27, how many carried the trailer — the compliance number before the gate exists.

**The librarian:** re-derives every measurement; collates; nothing to the chair until all four are in; one return.

## What lands tonight and what does not

Lands: four design files under `handback/`, B's two text edits to the briefs, the measurements. Does not land: any change to `main.rs`. The four gates are built on the next lap, each red-first on a copy, with the tests these designs specify.

## Falsifier for the lap, before it runs

If after these four land the next lap's dispatches are still forced by timeout at the same rate, the designs described the symptom and not the mechanism, and P-DELIVERY-ACK is redesigned from E's measurement rather than patched.
