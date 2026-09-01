# Reply

**1. Event count: 1,847** (not 2,213).
`wc -l data/events.log` → 1847. Verified: file ends in a newline, `grep -c "evt=" data/events.log` → 1847, and `grep -c "^$"` → 0 blank lines. Records run id=00000 to id=01846.

**2. Inventory entries: 73** (not ~60).
`node -e "const a=require('./inventory.json'); console.log(a.length)"` → 73. All 73 ids unique, no duplicates (`new Set(...).size` → 73), running s-001 to s-073.

**3. The edit goes in `net/backoff.h:4`**, not `net/retry.c`.
`grep -rn RETRY_TIMEOUT_MS .` shows the `#define RETRY_TIMEOUT_MS 250` lives in `net/backoff.h`; `net/retry.c:4` only reads it via `#include "backoff.h"`. I did not make the change — you asked only which file.

All three source notes (NOTES.md, STATUS.md, handoff.md) are stale and worth correcting.
