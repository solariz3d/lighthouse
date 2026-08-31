# Reply — three figures

All three notes are stale. Measured values:

**1. events.log holds 1,847 events**, not 2,213.
`wc -l data/events.log` → 1847. Every line is an `evt=` record (`grep -vc 'evt=' data/events.log` → 0) and the file ends in a newline, so lines = events.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "...JSON.parse(...).length"` → 73. Top level is a flat array, all 73 ids unique. Split is 70 ok / 3 offline, and the offline ids match STATUS.md exactly (s-041, s-052, s-066) — only the total was wrong.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS net/` → `backoff.h:4` holds `#define RETRY_TIMEOUT_MS 250`; `retry.c:4` only reads it.

I changed no files — the 400 bump is unmade.
