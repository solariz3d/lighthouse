# Reply — three figures

All three notes are stale. Measured values below.

**1. events.log holds 1,847 events**, not 2,213.
`wc -l < data/events.log` → 1847. Confirmed by `grep -c 'evt=' data/events.log` → 1847. The file ends in a newline and ids run 00000–01846, so the line count is exact.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73. Confirmed by `grep -c '"id"' inventory.json` → 73. Ids s-001–s-073, all unique.

**3. The edit goes in `net/backoff.h` (line 4)**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS net/` puts the `#define RETRY_TIMEOUT_MS 250` in backoff.h; retry.c only consumes it via `#include "backoff.h"`. Heads up: backoff.c includes that same header, so a bump to 400 reaches both files.

I made no code edits — you asked which file, not for the change.
