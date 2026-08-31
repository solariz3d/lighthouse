# Answers

All three notes are stale.

**1. events.log holds 1,847 events**, not 2,213.
`grep -c 'evt=' data/events.log` → 1847 (`wc -l` agrees; no blank lines, ids 00000–01846).

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` → 73. Three are offline (s-041, s-052, s-066), matching STATUS.md.

**3. The edit goes in `net/backoff.h` line 4**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → `#define RETRY_TIMEOUT_MS 250` is in backoff.h; retry.c only reads it. Note 250→400 also raises `backoff_next()`'s starting wait, since it seeds the doubling loop.

I did not make the edit — you said we're bumping it, not to bump it now.
