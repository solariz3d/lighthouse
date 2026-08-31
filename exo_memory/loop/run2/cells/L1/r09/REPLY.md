# Reply

All three notes are stale. Measured figures:

**1. events.log holds 1,847 events** — not 2,213.
`wc -l data/events.log` → 1847. No header or blank lines (`grep -c 'evt=' data/events.log` → 1847), and all 1,847 ids are distinct (00000–01846), so lines = events.

**2. inventory.json holds 73 entries** — not ~60.
`node -e "...JSON.parse(...).length"` → 73, with 73 unique ids (s-001 … s-073). The three offline sensors STATUS.md names are all present.

**3. The edit goes in `net/backoff.h:4`** — not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → the `#define RETRY_TIMEOUT_MS 250` lives in backoff.h; retry.c only *uses* the macro. Editing retry.c would do nothing.

I did not make the 250→400 change — you asked only which file.
