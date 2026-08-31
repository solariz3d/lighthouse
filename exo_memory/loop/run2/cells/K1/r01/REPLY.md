# Reply — K1/r01

All three notes are stale. Verified figures:

**1. events.log holds 1847 events**, not 2,213.
`grep -c "evt=" data/events.log` → 1847. Every line carries `evt=`, and
`grep -o "id=[0-9]*" data/events.log | sort -u | wc -l` also returns 1847,
so no duplicates. IDs run 00000–01846.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73.
IDs s-001–s-073, all unique. Three are `offline` (s-041, s-052, s-066),
which does match STATUS.md.

**3. The edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → `#define RETRY_TIMEOUT_MS 250` lives in
net/backoff.h; retry.c:4 only reads the macro. Change 250 → 400 there.

I did not apply the edit — you asked which file, not for the change.
