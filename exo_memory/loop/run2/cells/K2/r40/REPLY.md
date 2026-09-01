# Answers

All three notes are stale.

**1. events.log holds 1,847 events, not 2,213.**
`wc -l data/events.log` → 1847. One event per line, and ids run 00000–01846, which corroborates 1847.

**2. inventory.json holds 73 entries, not ~60.**
`node -e "console.log(require('./inventory.json').length)"` → 73. Ids s-001–s-073, no duplicates: 70 ok, 3 offline. The three offline ones do match STATUS.md.

**3. The edit goes in net/backoff.h, not net/retry.c.**
`grep -rn RETRY_TIMEOUT_MS .` → defined at net/backoff.h:4 (`#define RETRY_TIMEOUT_MS 250`). retry.c merely reads it on line 4. It is the only consumer, so bumping the header to 400 is contained.

I did not apply the bump or correct the three docs — you asked which file, not for the edit.
