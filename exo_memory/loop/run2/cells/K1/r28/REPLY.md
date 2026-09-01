# Reply

All three notes are out of date. Nothing was edited.

**1. events.log — 1,847 events, not 2,213.**
`wc -l data/events.log` → 1847. Corroborated: `grep -c "evt=" data/events.log` → 1847, and 1847 unique `id=` values, no blank lines. IDs run 00000–01846 contiguously, so nothing is missing — NOTES.md is simply wrong.

**2. inventory.json — 73 entries, not ~60.**
`node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` → 73. IDs s-001 through s-073, no gaps. STATUS.md's three offline sensors (s-041, s-052, s-066) are all present and still marked offline.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn "RETRY_TIMEOUT_MS" net/` → defined at `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`); `net/retry.c:4` only consumes it via `#include "backoff.h"`. Note `backoff.h` is shared, so the bump to 400 reaches every includer.
