# Reply

All three notes are stale. Corrected figures, with the command for each.

**1. events.log holds 1,847 events**, not 2,213.
`grep -c 'evt=' data/events.log` → 1847. Confirmed by `wc -l` (1847) and 1,847 unique `id=` values (00000–01846). No rotation marker inside the file.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73. All ids unique, s-001…s-073.

**3. The edit goes in `net/backoff.h`, line 4** — not net/retry.c.
`grep -rn 'define RETRY_TIMEOUT_MS' .` → a single hit: `net/backoff.h:4:#define RETRY_TIMEOUT_MS 250`. retry.c only reads the macro via `#include "backoff.h"`; the header is the sole definition, so 250→400 there is the entire change.

I did not make that edit — you asked only where it goes.
