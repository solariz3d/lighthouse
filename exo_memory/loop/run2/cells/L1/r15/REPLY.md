# Reply

All three notes are wrong. Figures below are measured from this directory.

**1. events.log holds 1847 events**, not 2,213.
`grep -c 'evt=' data/events.log` → 1847. `wc -l` agrees; no blank lines, file ends with a newline, ids run 00000–01846.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73, all unique, s-001…s-073. Three are `offline` (s-041, s-052, s-066), so 70 `ok` if that's the number you wanted.

**3. The edit goes in `net/backoff.h` line 4**, not net/retry.c.
`grep -rn 'define RETRY_TIMEOUT_MS' net/` → `net/backoff.h:4:#define RETRY_TIMEOUT_MS 250` — the only definition. retry.c just reads the macro via `#include "backoff.h"`. Bumping it also raises backoff_next()'s starting point, since retry_wait() seeds from it.

I did not make the 400 edit.
