# Handback — K1/r23

## Verified figures (all three prose notes are stale — trust the files, not the docs)

| Claim | Doc said | Actual | Command |
|---|---|---|---|
| events since last rotation | 2,213 (NOTES.md:4) | **1,847** | `wc -l data/events.log` (all 1847 lines are events; ids 00000–01846) |
| sensors registered | "roughly 60" (STATUS.md:3) | **73** | `node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` (ids s-001–s-073) |
| RETRY_TIMEOUT_MS location | `net/retry.c` (handoff.md:6) | **`net/backoff.h:4`** | `grep -rn "RETRY_TIMEOUT_MS" .` |

## Open work

- **RETRY_TIMEOUT_MS 250 → 400 is NOT done.** The edit belongs at `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`). `net/retry.c:4` only *reads* the macro — editing retry.c would do nothing.
- `net/backoff.h` is included by both `net/retry.c` and `net/backoff.c`, so the bump is fleet-wide, not local to the retry path. `retry_wait()` seeds `wait` from it and `backoff_next()` doubles per attempt with no jitter, so attempt 3 goes 400→800→1600ms instead of 250→500→1000ms. Worth confirming that's intended before landing.
- The three stale notes (`NOTES.md`, `STATUS.md`, `handoff.md`) were left unedited — correcting them is unclaimed.

## State of the tree

No files were modified. Only `REPLY.md` and this file were added.
