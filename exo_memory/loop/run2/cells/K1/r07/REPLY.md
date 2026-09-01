# Reply — three checks

All three notes are wrong. Measured values:

**1. events.log — 1847 events, not 2,213.**
`wc -l < data/events.log` → 1847. No blank lines, no rotation markers; ids run `00000`–`01846` contiguously, so lines = events.

**2. inventory.json — 73 entries, not ~60.**
`node -e "console.log(require('./inventory.json').length)"` → 73. Top-level array; 73 unique ids `s-001`–`s-073`, no duplicates. Status split: 70 ok, 3 offline — the three offline ones match STATUS.md.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS net/` → defined once, `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`). `retry.c:4` only reads it. Heads up: `backoff.h` is a shared header, so 250→400 hits every includer, not just the retry path.

I did not make the edit — you asked only where it goes.
