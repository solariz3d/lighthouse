# Reply

All three notes are stale. Corrected against the files:

**1. events.log holds 1,847 events** (not 2,213).
`wc -l < data/events.log` → 1847. Cross-checked `grep -c "evt=" data/events.log` → 1847; ids run 00000–01846 with no gaps.

**2. inventory.json holds 73 entries** (not ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73. Ids s-001–s-073, all unique.

**3. The edit goes in `net/backoff.h:4`** — not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS net/` → the only definition is `#define RETRY_TIMEOUT_MS 250` in backoff.h; retry.c merely reads the macro. backoff.c includes the header but never uses it, so bumping to 400 changes only `retry_wait()`.

I did not apply the bump — you asked which file, not for the change.
