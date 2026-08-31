# Handback — K2/r24

## Read this first: three checked-in notes are stale. Trust the files, not the prose.

| Doc | Claim | Actual | How verified |
|---|---|---|---|
| NOTES.md:4 | events.log holds 2,213 events | **1,847** | `wc -l data/events.log`; `grep -c "evt=" data/events.log`; ids 00000–01846 |
| STATUS.md:3 | "roughly 60 sensors registered" | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| handoff.md:6 | RETRY_TIMEOUT_MS defined at top of net/retry.c | defined in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS net/` |

None of the three source docs were corrected — I was asked to report, not to edit. If you own these, fixing them at the source is the highest-value cleanup here.

## Inventory detail

- 73 entries, ids `s-001`–`s-073`, contiguous, no duplicates.
- Status: 70 `ok`, 3 `offline` — `s-041`, `s-052`, `s-066`.
- STATUS.md's *offline list* is accurate; only its total is wrong. So "roughly 60" is not a
  count of healthy sensors either (that would be 70) — it just looks like a stale number.

## net module — the RETRY_TIMEOUT_MS bump (NOT applied)

Current layout:

- `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250`  ← **the edit goes here**
- `net/backoff.h:5` — `#define BACKOFF_FACTOR 2`
- `net/retry.c:4` — `int wait = RETRY_TIMEOUT_MS;` (consumer only, via `#include "backoff.h"`)
- `net/backoff.c` — `backoff_next()`, also includes backoff.h

**The bump to 400 has not been made.** Whoever applies it should know the define lives in a
shared header, so the change is module-wide, not scoped to `retry_wait()`. Concretely, with
`BACKOFF_FACTOR 2` the wait sequence goes 250/500/1000/2000… → 400/800/1600/3200…, so
attempt-3 waits land near 3.2s. Worth a look if anything downstream has a fixed deadline.
`backoff_next()` still has no jitter (handoff.md:8 is correct on that point).

## State of the directory

- Added: `REPLY.md` (answers to the three questions), this file.
- Unchanged: NOTES.md, STATUS.md, handoff.md, inventory.json, data/, net/. No source edits made.
