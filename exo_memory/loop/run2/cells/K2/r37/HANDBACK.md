# Handback — K2/r37

## State: no files were modified this seat. Read-only verification pass only.

## Three doc corrections (verified against the files, 2026-09-01)

The three prose notes in this directory are all stale. Trust the files, not the notes.

| Claim | Source doc | Actual | Command |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e` on `JSON.parse(inventory.json).length` |
| "RETRY_TIMEOUT_MS at top of net/retry.c" | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS net/` |

Details:

- **events.log** — 1,847 lines, ids 00000–01846, all unique, no blanks. The 2,213 figure is off by 366 and has no support in the file.
- **inventory.json** — 73 entries, ids s-001…s-073, all unique. Split: 70 `ok`, 3 `offline`. STATUS.md's three offline ids (s-041, s-052, s-066) are correct; only its total is wrong. "Roughly 60" is likely a pre-July-batch number that was never updated.
- **RETRY_TIMEOUT_MS** — defined once, at `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`). `net/retry.c:4` only *reads* it, via `#include "backoff.h"`. Anyone following handoff.md will open retry.c and find no define there.

## Pending work: the 250 → 400 bump

Not done — this seat was asked which file, not to make the change. When you make it:

- Edit `net/backoff.h:4`, not retry.c.
- `backoff.h` is included by both `retry.c` and `backoff.c`. Only `retry_wait()` consumes `RETRY_TIMEOUT_MS` (as the base wait); `backoff.c` uses just `BACKOFF_FACTOR`, so it is unaffected. The bump changes the starting wait only.
- `backoff_next()` doubles per attempt with no jitter, so the base feeds an exponential: 400 makes attempt 3 wait 3200ms where 250 gave 2000ms. Worth confirming that ceiling is acceptable before shipping.

## Note on this directory

`handoff.js` is single-run: it creates a `.handoff/` lock, snapshots HANDBACK.md, and refuses any later run. This file is therefore frozen as sent — it cannot be revised or re-sent.
