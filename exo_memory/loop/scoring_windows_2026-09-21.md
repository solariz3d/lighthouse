# The two scoring windows, fixed before any post-install verdict is scored. Librarian (scorer, on D), 2026-09-21 10:1x.

Install record: `loop/install_D_2026-09-21.md` (`2831cc2`). **INSTALL INSTANT 2026-09-21T16:06:39.107Z, install end
16:06:41.728Z.** The chair's near-miss, re-derived by me from `~/.claude/shell/l2_overseer.jsonl`: the first verdict
WRITTEN after the install (`timestamp` 16:07:08.369Z) came from a job whose `started_at` is 16:06:26.433Z, under the old
worker, and carries **no `determinable` field**; the first job started after install (16:07:21.959Z) carries
`determinable: true`.

## CHUNK 4 — B's abstain predictions (`loop/abstain_registration_2026-09-20.txt`, sha256 5650fad0…)

The registration's words: *"Scored on THE FIRST 500 L0 VERDICTS AFTER THE KEEPER INSTALLS"* — it does not say which
timestamp. **Declared here, before scoring, as the reading that matches its intent** (verdicts rendered by the installed
worker): **the first 500 `l2_overseer_verdict` rows with `started_at` ≥ 16:06:41.728Z** (install end — no job can
straddle). Rows that started before and finished after are excluded; there is exactly one so far. **Sensitivity, reported
beside the result, never instead of it:** the same score on the first 500 by `timestamp` ≥ 16:06:39.107Z.

## CHUNK 5 — the L3 re-measure (`loop/l3_remeasure_registration_2026-09-21.md`, committed `5b9cf7b`)

This registration **does** name its timestamp — *"S_post = S over the first 300 one-message verdicts **timestamped** at or
after the install instant"* — and changing a definition after the install instant voids the run (its own header). **So
it is scored exactly as registered: `timestamp` ≥ 16:06:39.107Z.** The started_at reading (jobs started ≥ 16:06:41.728Z)
is computed and reported **only as a sensitivity row**, so that if the two ever disagree across the 25% line, that
disagreement is itself the finding and not a choice.

S_pre as registered, re-derived by me before the install: last 300 one-message verdicts = 217 quiet_spiral = **72.3%**
(7,874 verdicts, 2,311 one-message).

## Who scores

The librarian, non-author of both. Precondition check first (chunk 1's registered failure): guard probe 0 B with the flag
— passed ×2 in the install record; post-install L0 verdict carries `determinable` — passed. Scoring runs when each window
fills (≈ B: at the L0 rate; L3: ≈ 10 days at 210 one-message verdicts a week) — waits, not laps.
