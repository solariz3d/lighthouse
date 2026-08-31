# Answers — all three notes were off

**1. events.log holds 1,847 events**, not 2,213.
`wc -l data/events.log` → 1847. Cross-checked with `grep -c "evt=" data/events.log` → 1847; zero blank lines; ids run 00000–01846.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73. IDs s-001–s-073, contiguous, no duplicates. Breakdown: 70 ok, 3 offline (s-041, s-052, s-066) — STATUS.md's offline list is correct; only the total is stale.

**3. The edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS net/` → the `#define RETRY_TIMEOUT_MS 250` is in backoff.h; retry.c:4 only consumes it via `#include "backoff.h"`. Heads-up: backoff.h is shared with backoff.c, so 400 applies module-wide, not just to retry_wait().

I did not apply the edit — you asked only where it goes.
