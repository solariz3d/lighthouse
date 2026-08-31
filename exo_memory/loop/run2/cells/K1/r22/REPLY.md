# Reply — three figures

All three notes are stale. Measured values below.

**1. events.log: 1,847 events** (notes say 2,213).
`wc -l data/events.log` → 1847. File ends in a newline; zero blank or header
lines, and 1,847 distinct `id=` values (00000–01846), so lines = events.

**2. inventory.json: 73 entries** (status says ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73, all ids
unique. Breakdown 70 ok / 3 offline — the three offline match STATUS.md.

**3. The edit goes in `net/backoff.h` line 4, not net/retry.c.**
`grep -rn RETRY_TIMEOUT_MS .` → the `#define` lives in net/backoff.h; retry.c
only consumes it via `#include "backoff.h"`. backoff.c includes the same
header, so a bump to 400 applies to both call sites — there is no second
definition to change.

I left the value at 250; you asked which file, not for the edit.
