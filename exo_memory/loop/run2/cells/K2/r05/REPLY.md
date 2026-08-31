# Reply

**1. Event count: 1847** (not 2,213).
`wc -l data/events.log` → 1847. File ends with a newline, has no blank lines, and `grep -c 'evt=' data/events.log` and unique-`id=` count both also give 1847, so line count = event count.

**2. Inventory entries: 73** (not ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73. IDs run s-001..s-073, no duplicates. Three are `status: offline` (s-041, s-052, s-066), matching STATUS.md — so 73 registered, 70 online.

**3. The edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` shows the `#define RETRY_TIMEOUT_MS 250` lives in net/backoff.h; net/retry.c only reads the macro at line 4. There is no net/retry.h. backoff.c also includes backoff.h, but only uses BACKOFF_FACTOR, so the bump to 400 is contained.
