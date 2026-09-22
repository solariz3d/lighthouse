# Handoff — the librarian seat, 2026-09-22 ~00:5x, LAPTOP (machine L), written at the keeper's warning of a near compaction

**Read first after waking. Then `librarian/2026-09-22.md` (today) — and after the pull, `loop/for_L_tonight_2026-09-21.md`
and `librarian/2026-09-21.md` (both are on origin; this checkout is 66 behind until L070 lands).**

## WHERE WE ARE, RIGHT NOW
- **L is 66 commits behind origin** because yesterday's L070 work was left uncommitted at close, and `launch.ps1` refuses
  to pull over dirty tracked files. The launch ran A's uncommitted state-sync: lap.jsonl and board.jsonl KEPT
  (LOCAL-AHEAD 76 / 1,067 rows), nothing lost; the "not promoted" message is the known false one.
- **Jev's key is set on L** (User env `AI_GATEWAY_API_KEY`, from `<stick>\secrets`; never printed).
- **In flight: L070 packet A** — A rebuilding its install fix as (a) STOP-BEFORE-WRITE (pre-scan every fast-forward file,
  refuse the whole install before the first byte if any would be refused), per A's correction written on D. A is mid-work
  (state-sync.js + test, close.test 30/0 at 00:4x). C's union files (`ledger-union.js`, `lap-row.js` floor) are on disk too.

## THE ORDER TONIGHT (the keeper agreed at 00:3x–00:4x)
1. Collate L070 (A's rebuild + C's union/floor) — re-derive, don't accept.
2. Chair lands L070 **and commits `exo_memory/review/`** (the keeper said yes on D, 11:0x, "lets do all of em"), then pulls 66.
3. **Restart Consonance ONCE, right after the pull** (keeper's concern: every extra restart = full re-reads; keep-warm,
   Jev's auto-runner and the ring-digest fix only arrive with that rebuild). Until then Jev's runner can be started by hand:
   `node consonance/tools/jev-shadow-runner.js --app-pid <consonance pid>` with the key passed in-process (only after the
   pull — the runner is not in this checkout yet).
4. Move L's old `C:\Consonance\data\vantage_cell\` aside (D100 removed its rules).
5. C writes the ledger union (dry run first; verify lap +214 → ~707, board +3,352 — recount, L's live files grew).
6. Fold-by-generation in `lap-row.js` — the keeper's condition (`loop/reissued_lap_ids_2026-09-21.md`).
7. Only then a real `close.js` from L.
8. NEW, small, after: **Leave "parks" uncommitted work** (a WIP branch/stash) so the next launch on either machine always
   pulls. The keeper named the cost: a dirty close forces a second restart and a second round of re-reads.

## ALSO RUNNING / OWED
- D's scoring windows (B's abstain 500 by started_at ≥ 16:06:41.728Z; L3 300 by timestamp ≥ 16:06:39.107Z) —
  `loop/scoring_windows_2026-09-21.md`. Don't peek.
- Jev shadow agreement report after ~100 pairs (D's store `%LOCALAPPDATA%\consonance\jev-shadow`; 25 asked on 09-21).
- Keeper's standing permission (memory `obvious-calls-just-do-them`): obvious, reversible calls — act and report after.
- My 13:05 judge-cost figure was double-counted; the right one is ~13.6M cache_write / 31 h (`third_place/jev_census_2026-09-21.md`).
