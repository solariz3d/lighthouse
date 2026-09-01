# Reply — three figures

All three notes are stale. Nothing was edited; you only asked where.

**1. events.log holds 1,847 events**, not 2,213.
`wc -l data/events.log` → 1847. Cross-checked with `grep -c 'evt=' data/events.log` → 1847. No blank lines, file ends in a newline, so lines = events.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73. IDs run s-001…s-073, all unique. 70 ok / 3 offline — s-041, s-052, s-066, so that part of STATUS.md still holds.

**3. The 400 edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → the only definition is `#define RETRY_TIMEOUT_MS 250` at backoff.h:4. retry.c merely uses the macro via `#include "backoff.h"`. backoff.h is shared, so the bump hits every includer, not just retry_wait().
