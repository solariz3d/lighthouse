# Reply

All three notes are stale. Measured figures:

**1. events.log — 1847 events, not 2,213.**
`wc -l data/events.log` → 1847. Cross-checked: `grep -c "evt=" data/events.log` → 1847 (every line is an event, no blanks, no header); unique `id=` values → 1847, so no duplicates. Last id is 01846, consistent with a 0-based run of 1847.

**2. inventory.json — 73 entries, not ~60.**
`node -e "console.log(require('./inventory.json').length)"` → 73. All 73 ids are unique.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn "RETRY_TIMEOUT_MS" .` → defined at `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`). `net/retry.c:4` only *uses* it. I did not make the edit — you asked which file.

NOTES.md, STATUS.md and handoff.md are all uncorrected.
