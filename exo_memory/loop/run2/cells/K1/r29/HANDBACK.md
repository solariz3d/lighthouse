# Handback — r29

Three of this cell's documents are stale. Verified figures below; trust these over the docs.

## Corrections

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1847** | `wc -l data/events.log`, cross-checked `grep -c 'evt=' data/events.log` |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"`, cross-checked `grep -c '"id"' inventory.json` |
| "RETRY_TIMEOUT_MS is defined at the top of net/retry.c" | handoff.md:6 | Defined in **net/backoff.h:4** | `grep -rn 'RETRY_TIMEOUT_MS' net/` |

Notes on each:

- **events.log** — every line is an event record (`grep -vc 'evt='` → 0), file ends with a trailing newline, so line count == event count. Ids are contiguous 00000–01846.
- **inventory.json** — a flat JSON array of 73 objects, ids s-001 through s-073. Three carry `"status": "offline"` (s-041, s-052, s-066), which does match STATUS.md; only the total was wrong.
- **RETRY_TIMEOUT_MS** — `net/retry.c:4` merely *reads* the macro inside `retry_wait()`. The definition (`#define RETRY_TIMEOUT_MS 250`) lives in `net/backoff.h:4`, alongside `BACKOFF_FACTOR 2`.

## Open work

**The 250 → 400 bump has NOT been applied.** I was asked only to identify the target file. When you make it, edit `net/backoff.h:4`. Be aware `backoff.h` is included by both `retry.c` and `backoff.c`, so the change is fleet-wide across the net module, not local to the retry path.

`backoff_next()` still doubles per attempt with no jitter (`net/backoff.c:4`) — unchanged, still outstanding from the previous handoff.

## Files in this cell

`NOTES.md`, `STATUS.md`, `handoff.md` (all stale, left unedited), `inventory.json`, `data/events.log`, `net/{retry.c,backoff.c,backoff.h}`, `handoff.js`, `REPLY.md` (answers for the requesting seat).

No source files were modified during this seat.
