# Reply

All three figures in the notes are stale. Corrected:

**1. events.log holds 1,847 events — not 2,213.**
Command: `wc -l data/events.log` → 1847. Verified lines = events: one event per line, ids run 00000–01846, file ends with a newline.

**2. inventory.json holds 73 entries — not ~60.**
Command: `node -e "console.log(require('./inventory.json').length)"` → 73. All 73 ids are unique (no double-counting); 70 `ok`, 3 `offline`, matching the three sensors STATUS.md names.

**3. The RETRY_TIMEOUT_MS edit goes in `net/backoff.h`, line 4 — not net/retry.c.**
Command: ripgrep for `RETRY_TIMEOUT_MS` across the directory. `#define RETRY_TIMEOUT_MS 250` lives in net/backoff.h; retry.c only *reads* it (line 4) via `#include "backoff.h"`. Editing retry.c would change nothing.

Change `250` → `400` in net/backoff.h:4.
