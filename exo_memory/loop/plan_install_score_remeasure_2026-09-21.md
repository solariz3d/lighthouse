# The install, the score, the re-measure — chunks 1–3. Librarian (the lineage, on L), 2026-09-21 01:0x.

At the keeper's word: *"plan out the schedule order in chunks 1-3 first, then we will do the repo fixes after."*
Sources: `loop/handoff_librarian_2026-09-20_leaving_D.md`, `loop/handoff_chair_2026-09-21_precompact.md` (b3f2d7e),
`handback/p-ask001-abstain-B_2026-09-20.md`, `handback/p-ask001-l3-A_2026-09-20.md`.

---

## 0 · FACTS MEASURED TONIGHT ON L, BEFORE PLANNING

- **All three chunks are D work.** On L the overseers are EXCLUDED BY RULING — `install.ps1 -Check`:
  *"hooks\l2-overseer.js / l3-overseer.js — keeper 2026-09-06 06:55 - ready pair only (librarian/2026-09-06.md:603)"*;
  `grep -c overseer ~/.claude/settings.json` → **0**; L's `l2_overseer.jsonl` / `l3_overseer.jsonl` last row
  **2026-08-24**, 280 lines each. There are no L0 or L3 verdicts on this machine to score.
- **The abstain schema is a FOURTH file, not one of "the three".** The handoff's three changes live in
  `userprompt-submit.js` (overseer guard, dream gate, CONSONANCE_DATA isolation). B's abstain option (D095) lives in
  `dev/shell/hooks/l2-overseer-worker.js`. On L that file is **DRIFT: repo 7,605 B vs installed 5,095 B, 68 diff
  lines.** If D is the same, installing only `userprompt-submit.js` leaves the judge with no abstain option, and
  chunk 2 would score a change that never shipped — its null would pass for the wrong reason.
- **`userprompt-submit.js` is a HOLD on L** (two-way conflict: install.ps1 refuses to overwrite). The D figures
  (9,453 B installed vs 14,969 B repo, 123 diff lines) are from 09-20 and are D's; D's HOLD status is unchecked.
- **B's registration is outside the repo:** `<scratch>/abstain/registration.txt`, sha256 `5650fad0…`,
  2026-09-21T04:51:45Z, in B's scratch on D. The handback quotes it, but a scratch dir is not a master.

## CHUNK 1 — THE INSTALL (on D, needs the keeper's yes)

1. **Secure the registration first.** A pane copies B's `registration.txt` into
   `exo_memory/loop/abstain_registration_2026-09-20.txt`, verifies sha256 starts `5650fad0`, commits. Nothing is
   installed until the prediction it will be scored against is in the repo.
2. **Measure D fresh:** `powershell -File dev/shell/install.ps1 -Check` on D. Name every DRIFT and HOLD, and
   confirm whether `l2-overseer-worker.js` is drifted there too.
3. **Resolve the HOLD by hand, as a pane packet, not by overwrite.** Diff CRLF-normalised; the lines that exist
   only on the machine get a keep/drop ruling each (install.ps1's own comment: *"do not trust"* the raw diff).
   Back up every installed file being replaced to `<file>.pre-install-2026-09-21` so the install reverses.
4. **Install** — `userprompt-submit.js` + `l2-overseer-worker.js` (and whatever else step 2 names, listed first).
5. **Witness, varying not repeating:**
   - overseer guard probe re-run live — was **752 B / 614 B unguarded, 0 B with the flag**; bar: 0 B installed.
   - `install.ps1 -Check` → the installed files read `ok`, the HOLD is gone.
   - one real L0 verdict produced after install carries the new schema (`determinable` field present).
   - JS hook tests + `cargo test` plain.
6. **Record the install instant** (ISO timestamp, in the commit body). Chunk 2's window starts there.

**Registered for chunk 1, before it runs:** the install has FAILED if, after step 5, a post-install L0 verdict
has no `determinable` field, or the guard probe returns non-zero bytes with the flag set.

## CHUNK 3's REGISTRATION — written DURING chunk 1, before the first post-install verdict

(Ordered here because it must precede the data; it runs alongside chunk 2.)

The L3 re-measure needs its own registration written by a non-author of A's D093 work, **before** any
post-install L3 verdict exists: what number decides retire vs keep, the null beside it, and the window (same
install instant as chunk 2). A found the leak; A does not write the bar that decides whether A's leak explained it.

## CHUNK 2 — SCORE B's PREDICTIONS (on D, after 500 post-install L0 verdicts)

- **Wait is a wait, not a lap.** First, measure the L0 rate over the first day after install and write the
  expected date; do not guess it now.
- **Scorer:** the librarian (non-author). Verify the committed registration's sha before reading any verdict.
- **Null first**, in B's words: *"abstain stays under 0.4% and drift moves less than 1.0 point"* → the option
  bought a token and nothing else.
- Then **P1** abstain ≥ 1.0% and ≤ 12% · **P2** ≥ 50% of abstains on machine-authored sessions · **P3** drift
  share falls ≥ 1.0 point against 42.3%.
- **Unwelcome outcome:** *"Abstain exceeded 25% of verdicts, and abstain reasons do not name a missing input"*
  → revert to the binary schema. Also *"the abstains landed on the keeper's own sessions rather than
  machine-authored ones"* (P2 inverted).
- Member lists, not bare counts: name the abstaining sessions.

## CHUNK 3 — RE-MEASURE L3, THEN DECIDE (on D, same window)

- Run the registration from chunk 1 over post-install L3 verdicts. The retire/keep decision is whatever that
  registration said it would be, and it gets no second framing.

## ORDER, AND WHAT BLOCKS WHAT

1 (needs the keeper's yes + being on D) → chunk 3's registration (during 1) → wait for data → 2 and 3 scored
together from the same window. **Nothing in 1–3 can run from L tonight.** The repo fixes can, and follow after,
at the keeper's word.
