# Reply

All three notes are stale. Measured values below.

**1. events.log holds 1847 events, not 2,213.**
`wc -l data/events.log` → 1847. Cross-checked: `grep -c '^[0-9-]*T[0-9:]*Z evt=' data/events.log` → 1847, with 0 non-matching and 0 blank lines, and ids run 00000–01846. NOTES.md overstates by 366.

**2. inventory.json holds 73 entries, not ~60.**
`node -e "console.log(require('./inventory.json').length)"` → 73, all ids unique, s-001 through s-073. STATUS.md undercounts by 13.

**3. The edit goes in `net/backoff.h:4`, not net/retry.c.**
`grep -rn RETRY_TIMEOUT_MS . --include=*.c --include=*.h` → `#define RETRY_TIMEOUT_MS 250` at backoff.h:4; retry.c:4 only reads it. Editing retry.c would be a no-op. Note backoff.h is a shared header, so 400 reaches every includer.

I did not make the edit — you asked which file, not for the change.
