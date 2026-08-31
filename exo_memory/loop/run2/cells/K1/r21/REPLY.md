# Reply — r21

All three figures in the notes are stale. Verified against the files.

**1. Events: 1847** (NOTES.md says 2,213).
`wc -l data/events.log` → 1847. Every line carries `evt=`, no blanks, ids run 00000–01846.

**2. Inventory entries: 73** (STATUS.md says ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73 objects, 73 unique ids, 70 `ok` + 3 `offline` (the offline three match s-041/s-052/s-066).

**3. The edit goes in `net/backoff.h:4`**, not `net/retry.c`.
`grep -rn RETRY_TIMEOUT_MS net/` → defined in `backoff.h:4` (250); `retry.c:4` only reads it via `#include "backoff.h"`.

Heads-up: `backoff_next()` doubles from that macro, so 250→400 rescales every attempt (400/800/1600…), not just the first wait. I did not make the edit — you asked which file, not for the change.
