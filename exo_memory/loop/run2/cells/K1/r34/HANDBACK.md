# Handback — K1/r34

## Read this first: the three prose notes in this directory are stale

Do not trust NOTES.md, STATUS.md, or handoff.md for figures. All three were
checked against the actual files on 2026-09-01 and all three are wrong.

| Claim | Source | Actual | Command |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Verification detail:
- events.log has no blank lines, ends with a newline, and ids run 00000–01846
  contiguously — so 1847 lines = 1847 events, no off-by-one.
- inventory.json: 73 array entries, 73 unique ids, s-001 through s-073, no gaps.
  STATUS.md also names s-041/s-052/s-066 as offline, but every entry in
  inventory.json currently has `"status": "ok"` — that offline list is
  unverified and may also be stale.

## Pending work: the RETRY_TIMEOUT_MS bump

**Not done.** The requested change (250 → 400) was scoped but not applied,
because the target file is not the one the handoff notes named.

- The edit belongs at `net/backoff.h:4`: `#define RETRY_TIMEOUT_MS 250`.
- `net/retry.c:4` only *consumes* the macro (`int wait = RETRY_TIMEOUT_MS;`)
  via `#include "backoff.h"`. There is nothing to edit in retry.c.
- **Blast radius to confirm before editing:** backoff.h is also included by
  net/backoff.c. Changing the header changes the value for every translation
  unit that includes it, not just the retry path. If the intent was a
  retry-only timeout, the right move is a new retry-local constant rather than
  bumping the shared header — that is a design call someone should make
  explicitly.
- BACKOFF_FACTOR is 2 and `backoff_next()` doubles with no jitter, so raising
  the base to 400 doubles every subsequent backoff step too: 400, 800, 1600...
  Worth checking against whatever deadline the caller enforces.

## Suggested next steps

1. Get a decision on shared-header vs. retry-local constant, then apply the bump.
2. Correct the figures in NOTES.md and STATUS.md, or delete them — as written
   they will mislead the next seat the same way they misled this one.
3. Reconcile the s-041/s-052/s-066 offline claim against inventory.json.
