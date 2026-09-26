# Handoff — the librarian seat, on D, 2026-09-26 ~01:1x, at Zacc's "close to compact, very close, get ready"

**Read this first, then `librarian/2026-09-22.md` from "2026-09-25 00:4x" on, then `loop/stall_trace_2026-09-23.md`
(the tail).** The keeper is **Zacc** (Zach in the record); this seat's memory has it (`keeper-name-zacc.md`).

## IN FLIGHT
- **D144, ASK-007 the UNIV cold read** (deadline 2026-09-29). The isolation route is FOUND and VERIFIED:
  `loop/univ_coldread_scorecard_2026-09-26_isolation.md` (`2e963d5`). The token is the User var
  `UNIV_ISOLATED_OAUTH_TOKEN`, NEVER printed, used in the child env only, plus `claudeMdExcludes` in a `--settings` FILE.
  - Dispatched: F-PROMPT goes to a seat that has not read §7; then stages 1–2, A runs and E codes and scores. **C (the
    designer) must not select, code or score.**
  - Collate when all have rung. A stage-1 failure stops everything.
- **T-J1 v2 labels: the keeper's alone.** The sheet is `C:\Consonance\tj1v2\pilot_sheet_2026-09-24.md`, open in
  Notepad. When he saves it, freeze it with a sha256 BEFORE any Jev call (`loop/tj1v2_registration_2026-09-22.md` §4),
  then the Jev run.

## DONE TODAY (landed and pushed)
- The README and About rewrite is live on GitHub (`5ced140`, git-blob `d6b81769` confirmed on github.com). Its layers:
  why → what → how the sessions work together → try it → how it works → method. The About tab is the README's front
  block, held in step by `ui/about-readme.test.js`.
- **D143, dead-pane detection:** `pane_exit.rs` reopens a fixed seat ONCE per run; the reopen now resets the xterm and
  resends the size. Live since the 10:41 rebuild.
- The pulse shows "waiting on YOUR answer" (D138).

## OPEN, THE KEEPER'S
- L's list: union ON for L (`CONSONANCE_UNION_AT_LAUNCH=on`); the Jev R2 re-run (its set is on L); L's own jev.log
  check; L's six `-Only` hooks.
- One keep-warm oddity to check: arch_test's link check was said to go green once D139–D142 landed together, and the
  chair's report was not seen. Re-run `cargo test --test arch_test` through the lock if in doubt.

## MY WRONG COLUMN, 09-24 → 09-26
- The T-J1 v2 order (the labels come first).
- The Jev R2 re-run dispatched to D when its set is on L.
- The "delivery stall" (it was my own AskUserQuestion; A and C refuted it; corrected at `b348c7f`).
- "Nothing is lost" said too strongly about a compaction.
- Not knowing the keeper's name, though the record had it.
