# Handoff — the librarian seat, 2026-09-21 ~07:4x, LAPTOP (machine L), end of the keeper's night

Read first. Full detail: `exo_memory/librarian/2026-09-21.md` (every step, with the commands and my errors).

## DONE TONIGHT ON L
- JS suite **110/0 of 111** (one canary); Rust **854/0** plain; portable-paths clean; carrier-drift green.
- Keep-warm built (L067, amended L070 to the keeper's rule: **a seat activated this session stays warm all session**;
  untouched seats are never pinged). **Ships at the next natural close/open through the shortcut — no rebuild**
  (keeper 05:55). Until then the chair runs it by hand (`warm.js`, every ~45 min).
- The CONSONANCE_DATA leak traced (C, L066) and fixed at the source (A, L068, `dev/stick-apply.js`); live until the
  running app (pid 43356, started 00:50:30) is replaced by a normal reopen. Misplaced files moved aside twice to
  `~/.claude/shell/misplaced-from-consonance-data-2026-09-21/` (README inside).
- One env name for the state dir: `CONSONANCE_STATE` (L069). `state_dir` declared in L's `~/.consonance.json`.

## HOLD — READ BEFORE ANY CLOSE OR LEAVE ON L
**No real close from L until the ledger union is written and A's TRAVELS fast-forward has landed.** Every L launch
MIGRATEs and install REPLACED append-only files; a close now would publish L's ledger and attic D's rows.
`close.js --check` passing is NOT permission. Why, and every generation of the reissued ids:
`loop/reissued_lap_ids_2026-09-21.md` (keeper accepted the DOUBLE-OPEN ids only on condition of the fold fix).

## IN FLIGHT / NEXT, IN ORDER
1. L070: A's TRAVELS fast-forward (install never replaces a longer append-only file) → collate.
2. C writes the union (`consonance/tools/ledger-union.js`, board-compact swap protocol); I verify written counts
   against the dry run (lap +214 → 707; board +3,352).
3. `lap-row.js` folds by (id, generation) — OWED, the keeper's condition.
4. Then L may close. D's next launch refuses to replace D's longer ledger; D unions its side.
5. The stick prune (~824 MB, list → digest → delete) — keeper said yes, AFTER the above.

## SAVED FOR TOMORROW NIGHT (2026-09-22)
`loop/fresh_vs_resumed_test_2026-09-21.md` — does a seat need its whole transcript? Register before the first packet.

## ON D, WHEN THE KEEPER IS THERE
`loop/for_D_state_dir_2026-09-21.md` first; then chunks 1–3 (`loop/plan_install_score_remeasure_2026-09-21.md`).

## STILL OPEN, SMALL
The eight hooks' CONSONANCE_DATA seam (two ready-* may need it); L's four drifted installed hooks (with chunk 1);
the ring digest's remaining unguarded case (older hand-back named first); keep-warm's missed-window report; the
keeper's own: ASK-007, `exo_memory/review/`.

**CORRECTION, 07:4x, to the HOLD above — it was worded too wide, my error.** Closing Consonance normally and turning the
laptop off is SAFE. The app's Leave writes the conversations to the STICK and never to the state repo:
`dev/stick-waiter.js:61` — *"Leave writes to the STICK and never to the state repo. No close.js, no git, no push."*
The HOLD is on **`node consonance/tools/close.js` (a real close, the state-repo publish)** only — a separate command
nobody runs as routine (the state repo's head is still D's 09-10 publish). Note for the next L launch: it MIGRATEs again
and replaces L's lap.jsonl with D's 09-10 copy, as every L launch has; A's TRAVELS fix is in `state-sync.js` (a script,
run fresh at each launch, no rebuild needed), so it protects the ledger from the first launch after it lands.
