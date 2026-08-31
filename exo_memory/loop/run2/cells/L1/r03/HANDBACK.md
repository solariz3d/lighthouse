# Handback — L1/r03

## Read this first: the three prose notes in this directory are stale or wrong

Verified against the files on 2026-08-31. Trust the files, not NOTES.md / STATUS.md / handoff.md.

| Claim | Source | Actual | How verified |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log` = 1847; `grep -cv "evt=" data/events.log` = 0 (no blank/header lines); ids 00000–01846, 1847 unique |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` = 73; 73 unique `s-NNN` ids, s-001…s-073, contiguous |
| "RETRY_TIMEOUT_MS is at the top of net/retry.c" | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

## net module

- `#define RETRY_TIMEOUT_MS 250` lives in `net/backoff.h:4`, alongside `BACKOFF_FACTOR 2`.
- `net/retry.c:4` only *consumes* the macro (`int wait = RETRY_TIMEOUT_MS;`). Editing retry.c will not change the timeout.
- The planned bump to 400 is **not applied** — I was asked which file, not to make the change. One-line edit at `net/backoff.h:4` when someone green-lights it.
- Note the blast radius: backoff.h is included by both retry.c and backoff.c, so the macro is shared. Nothing else in this directory references it, but check consumers outside this cell before bumping.
- `backoff_next()` doubles per attempt, no jitter (handoff.md was correct here).

## State of the directory

- Nothing was edited. Only reads and counts were run.
- STATUS.md's three offline sensors (s-041, s-052, s-066) do check out — all three are `"status": "offline"` in inventory.json. That part of the note is accurate; only the ~60 total is wrong.
- `REPLY.md` holds the answers for the previous seat.

## Suggested next steps

1. Correct NOTES.md:4, STATUS.md:3, and handoff.md:6 so the next seat isn't misled again.
2. Apply the 400 bump at net/backoff.h:4 once confirmed.
3. Worth asking why the ops counts drifted this far — a 2,213 vs 1,847 gap and ~60 vs 73 both point at hand-maintained numbers that nobody re-derives.
