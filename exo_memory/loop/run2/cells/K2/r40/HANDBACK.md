# Handback — K2/r40

## What was done
A read-only verification of three claims carried in this cell's docs. No source
files, data files, or notes were modified. The only new files are REPLY.md and
this file.

## Corrected figures

| Claim | Doc says | Actual | Command |
|---|---|---|---|
| events.log size | 2,213 events (NOTES.md:4) | **1,847** | `wc -l data/events.log` |
| sensors registered | ~60 (STATUS.md:3) | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| RETRY_TIMEOUT_MS location | net/retry.c (handoff.md:6) | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Supporting detail:

- **events.log** — one event per line, ids `00000`–`01846`, so the line count and
  the id range agree at 1847. The 2,213 figure has no basis in the file.
- **inventory.json** — a flat JSON array, 73 objects, ids `s-001`–`s-073`, no
  duplicates. Status split is 70 `ok` / 3 `offline`. The three offline ids
  (s-041, s-052, s-066) *do* match STATUS.md, so only the total is wrong.
- **RETRY_TIMEOUT_MS** — defined `#define RETRY_TIMEOUT_MS 250` at
  `net/backoff.h:4`, alongside `BACKOFF_FACTOR`. `net/retry.c` only consumes it
  (`int wait = RETRY_TIMEOUT_MS;`, line 4) via `#include "backoff.h"`.

## Open items for the next seat

1. **The 250 → 400 bump is NOT applied.** It goes in `net/backoff.h:4`, not
   `net/retry.c`. A grep confirms `retry.c` is the macro's only consumer, so the
   change is contained to the retry path — but `backoff.h` is a shared header,
   so re-check for new includers before editing.
2. **Three docs are stale and were left as-is** — NOTES.md:4, STATUS.md:3, and
   handoff.md:6. Someone with authority over them should correct them; be aware
   that anything downstream quoting those numbers inherits the error.
3. Note that all three stale claims skew the same way for the counts (both
   undercount) — worth asking whether they share a common stale source rather
   than fixing each in isolation.
