# Handoff — the librarian seat, on L, 2026-09-23 ~07:4x, at the keeper's "its your time to compact now as well"

**Read first. Then `librarian/2026-09-22.md` from "2026-09-23 01:0x" on, then `loop/jev_standalone_design_2026-09-23.md`.**

## IN FLIGHT: the standalone Jev BUILD, batch 1 of 3 (L114), strict wait-for-all
Design: `loop/jev_standalone_design_2026-09-23.md` (`e1b3eb6`), and the keeper said "go". The module lives at `jev/` (repo
root). The contracts are fixed in my L114 ring (narrowedView/buildPrompt, config.load, ask, and a ledger row with no text).
- A (prompt, vendored, with a parity test): **in**, hand-back git-blob 95c60575. **Contract deviation:** `narrowedView`
  returns an OBJECT, not a string. Check at collation that B's judge passes it to buildPrompt unchanged.
- B (ask + the jev-judge Stop hook), C (config), E (the jev-flags hook): still working at 07:3x.
- **When all four ring:** run `jev/test/*` together in the background (the heavy-run lock), check that the contracts fit,
  then ONE ring. Batch 2 is install.js (merge-only), jev-report, the README with the measured precision plus the gateway
  disclosure, and Consonance as a config consumer. Batch 3 is the clean-machine test; the public repo is created only on
  the keeper's word.
- The check-in cron `1c7f29dc` watches this build (session-only; it survives compaction in this session).

## TONIGHT'S RULES FROM THE KEEPER (all in memory)
**Strict wait-for-all**: one ring per batch, even if panes go idle (his reason: rework from incomplete info). The next step
comes from the OUTPUT, and every collation carries `OUTPUT → NEXT: changed|unchanged — why`. Small fixes I make MYSELF. Every
stall gets traced (`loop/stall_trace_2026-09-23.md`). Before a landing ring, the whole js-suite and portable-paths run in
the BACKGROUND, WITH new files included (portable-paths only sees tracked files). Never use the [panes] digest for who
exists or who is done. Pane specialization comes after the Jev standalone.

## LIVE DEFECTS FOUND TONIGHT, OWED
- **Live Jev judges with the RETRACTED ASK-008 prompt** (require cache in `jev-judge.js` `loadJudgeInputs`; 247 captures
  record the repaired sha). Fixes: the runner restart (the keeper's, at the next app launch) and hashing what was LOADED (one lap).
- The `[panes]` digest leaks panes' results into blind reads, so board-digest must honour the blind window.
- A STALE stamp held two rings to me for 16+ min, past the 240 s force (`drain_decision`, main.rs), so check it.
- The QUEUED line still shows those two 06:20 rings ("2 waiting"). They were handled from disk.

## THE KEEPER'S QUEUE (his, not blocking)
The REBUILD, which makes the Rust from L084/L085/L086/L088/L104 live and restarts the Jev runner. `DISABLE_AUTOUPDATER`
(L101 §4). The CH-4/ASK sheets (`loop/ask_sheets_2026-09-23.md`). The four unused hooks (use `-Only`; a plain install would
now overwrite `userprompt-submit.js`). Item 8: egress yes + sitting (the set is fully built). D's publish (it never landed
at 23:00) and the board compaction are on D.

## MY WRONG COLUMN TONIGHT (on L)
C "logged out" off a stale digest · blamed A for a ring queued behind my own turn · "no B here" off the digest · my
`--setting-sources` probe was cwd-dependent · endorsed E's §0.4 from the wrapper (L120) · rang per freed pane without
telling the keeper · agreed to his batching too fast, citing evidence that didn't support it (the MASK failure, live).
