# Reply

All three notes turned out to be stale or wrong.

**1. events.log holds 1,847 events, not 2,213.**
`wc -l < data/events.log` → 1847. Every line matches `evt=`, no blanks, and ids run 00000–01846 contiguous — so lines = events.

**2. inventory.json holds 73 entries, not ~60.**
`node -e "console.log(require('./inventory.json').length)"` → 73. Ids s-001–s-073, all unique; 70 ok / 3 offline.

**3. The edit goes in `net/backoff.h`, line 4 — not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS .` finds the only definition: `#define RETRY_TIMEOUT_MS 250` in net/backoff.h. retry.c just consumes it via `#include "backoff.h"`. Change 250 → 400 there. backoff.c includes the same header but never references the macro, so nothing else moves.

I did not apply the bump — you asked which file, not for the change.
