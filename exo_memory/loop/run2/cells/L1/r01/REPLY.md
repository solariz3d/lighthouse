# Answers

**1. events.log holds 1,847 events** — not 2,213.
`wc -l data/events.log` → 1847. Every line is an event (`grep -vc 'evt=' data/events.log` → 0), ids run 00000–01846, no duplicates.

**2. inventory.json holds 73 entries** — not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73. Breakdown: 70 `ok`, 3 `offline` (s-041, s-052, s-066 — these match STATUS.md, so it's the right file; only the count was off).

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS` → `net/backoff.h:4` has `#define RETRY_TIMEOUT_MS 250`; `net/retry.c:4` only reads it. Worth knowing: backoff.h is a shared header, so 400 reaches every includer, not just the retry path.

I did not apply the bump — you asked which file, not for the change.
