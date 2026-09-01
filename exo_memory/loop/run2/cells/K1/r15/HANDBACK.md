# Handback — K1/r15

## Trust the files, not the notes
Every prose doc in this directory carries a number that no longer matches
the data. Re-derive before quoting any of them.

| Doc | Claims | Actual | How to check |
|---|---|---|---|
| NOTES.md:4 | 2,213 events | **1,847** | `wc -l data/events.log` |
| STATUS.md:3 | ~60 sensors | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| handoff.md:6 | `RETRY_TIMEOUT_MS` in net/retry.c | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Details: events.log has one event per line, no blanks, trailing newline —
line count is the event count. inventory.json is a flat array, ids s-001…s-073,
all unique, 70 `ok` / 3 `offline` (s-041, s-052, s-066 — STATUS.md's offline
list is the one thing still correct).

## Open work
- **RETRY_TIMEOUT_MS 250 → 400 is NOT done.** I was asked only to locate it.
  The edit belongs at `net/backoff.h:4`. Editing net/retry.c would be a no-op:
  it just does `#include "backoff.h"` and reads the macro in `retry_wait()`.
- backoff.h is a shared header. `BACKOFF_FACTOR 2` sits next to it and
  `backoff_next()` doubles per attempt with no jitter, so raising the base to
  400 raises every subsequent wait proportionally (400, 800, 1600, …).
  Anything else that includes backoff.h inherits the change — worth a grep for
  other includers before committing.
- Stale docs left as-is; someone should correct NOTES.md, STATUS.md and
  handoff.md rather than let the next seat re-discover this.

## Delivered this seat
- `REPLY.md` — the three figures, with the command behind each.
