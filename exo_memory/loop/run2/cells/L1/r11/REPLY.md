# Reply

All three notes are wrong. Corrected figures below.

**1. events.log holds 1,847 events, not 2,213.**
`wc -l data/events.log`, cross-checked with `grep -c 'evt=' data/events.log`. IDs run 00000–01846 contiguously, so 1,847 is the real count.

**2. inventory.json holds 73 entries, not ~60.**
`node -e "console.log(require('./inventory.json').length)"`. IDs s-001–s-073, no gaps. Three are offline (s-041, s-052, s-066), leaving 70 "ok" — neither number is 60.

**3. The bump goes in `net/backoff.h:4`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS .` — backoff.h line 4 has the `#define`; retry.c only *uses* the macro at line 4 via `#include "backoff.h"`. Editing retry.c would change nothing.

Caveat: backoff.h is a shared header, so 250→400 reaches every future includer, not just `retry_wait()`. I have not made the edit.
