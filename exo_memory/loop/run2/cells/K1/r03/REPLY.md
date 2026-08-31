# Reply

All three notes are off. Measured values:

**1. events.log holds 1847 events, not 2,213.**
`wc -l data/events.log` → 1847; cross-checked with `grep -c 'evt=' data/events.log` → 1847. No blank lines, no headers, ids 00000–01846 all unique — line count equals event count.

**2. inventory.json holds 73 entries, not ~60.**
`node -e "console.log(require('./inventory.json').length)"` → 73, all ids unique (70 ok, 3 offline). The three offline sensors STATUS.md names are real; the total is not.

**3. The bump to 400 goes in `net/backoff.h:4`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS` puts the `#define` in backoff.h; retry.c only reads it via `#include`. Note backoff.c includes the same header, so this change reaches both files, not just the retry path.

I did not make the edit — you asked which file.
