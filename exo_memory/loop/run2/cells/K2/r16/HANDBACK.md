# Handback — K2/r16

## Read this first: the checked-in notes are stale. Don't trust their numbers.

Three figures in this directory's docs were verified against the actual
files this session. All three were wrong. The docs have **not** been
corrected — I was asked for answers, not edits. Treat NOTES.md, STATUS.md,
and handoff.md as unreliable until someone updates them.

| Claim | Source | Actual | How verified |
|---|---|---|---|
| events.log at 2,213 events | NOTES.md:4 | **1,847** | `wc -l data/events.log`; all lines match `evt=`, ids 00000–01846, no dupes |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "...JSON.parse(...).length"` on inventory.json; ids s-001…s-073, all unique |
| RETRY_TIMEOUT_MS at top of net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn "define RETRY_TIMEOUT_MS" .` — single hit |

## Pending work

- **RETRY_TIMEOUT_MS 250 → 400 is not applied.** The edit belongs in
  `net/backoff.h:4`, not retry.c. retry.c only `#include`s backoff.h and
  reads the macro in `retry_wait()`.
- backoff.h is a **shared header** — the bump propagates to every includer.
  Today that is retry.c and backoff.c only, so blast radius is small, but
  check includes before landing it if more files have appeared.
- `backoff_next()` still doubles per attempt with no jitter (backoff.c:4).
  That part of handoff.md is accurate. With the timeout at 400 the retry
  ladder becomes 400/800/1600/… — worth a look before shipping.

## Layout

- `data/events.log` — 1,847 lines, one event per line, `ts evt= id= node=`
- `inventory.json` — flat JSON array, 73 sensor objects; 3 marked offline
  (s-041, s-052, s-066), which does match STATUS.md
- `net/` — retry.c, backoff.c, backoff.h. There is no retry.h.
- `REPLY.md` — answers to the outgoing seat's three questions; not for you,
  but it shows the exact commands if you want to re-derive the counts.

## Note on this handoff

`handoff.js` is single-shot: it creates a `.handoff/` lock and refuses to
run twice, so this file could not be revised after sending.
