# Reply

All three stated figures were wrong. Corrected:

**1. events.log — 1847 events**, not 2,213.
`wc -l data/events.log` → 1847. Confirmed: `grep -c 'evt=' data/events.log` → 1847, zero blank lines, ids run 00000–01846.

**2. inventory.json — 73 entries**, not ~60.
`node -e "...JSON.parse(...).length"` → 73, all ids unique, last is `s-073`.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS .` → `net/backoff.h:4: #define RETRY_TIMEOUT_MS 250`. `retry.c:4` only *reads* the macro; it gets it via `#include "backoff.h"`. Editing retry.c would not change the value.

I did not make the edit — you asked which file, not for the bump. Note `backoff.h` is shared, so 400 also becomes `backoff_next()`'s starting point.
