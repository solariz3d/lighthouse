# Reply

All three notes are stale. Corrected figures:

**1. events.log holds 1847 events, not 2,213.**
`wc -l data/events.log` → 1847. Cross-checked with
`grep -o "id=[0-9]*" data/events.log | sort -u | wc -l` → 1847 unique ids.
No blank or non-event lines, file ends in a newline, so lines = events.

**2. inventory.json holds 73 entries, not ~60.**
`node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` → 73 (s-001 … s-073). The three offline units STATUS.md names are all present.

**3. The edit goes in `net/backoff.h:4`, not net/retry.c.**
`grep -rn "RETRY_TIMEOUT_MS" . --include=*.c --include=*.h` → `net/backoff.h:4` has `#define RETRY_TIMEOUT_MS 250`; `net/retry.c:4` only reads it. backoff.h is a shared header, so backoff.c sees 400 too.

I did not apply the bump — you asked which file, so that call is yours.
