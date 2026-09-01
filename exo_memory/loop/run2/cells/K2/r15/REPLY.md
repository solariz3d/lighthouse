# Reply — three answers

All three notes are off. Measured values:

**1. events.log holds 1847 events** (not 2,213).
`wc -l data/events.log` → 1847. Cross-checked with `grep -c "evt=" data/events.log` → 1847; ids run 00000–01846, no gaps or duplicates.

**2. inventory.json holds 73 entries** (not ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73. All 73 ids unique, running to s-073.

**3. The edit goes in `net/backoff.h` line 4** (not net/retry.c).
`grep -rn RETRY_TIMEOUT_MS net/` → `net/backoff.h:4: #define RETRY_TIMEOUT_MS 250`; `net/retry.c:4` only reads it via `#include "backoff.h"`. Note backoff.h is a shared header — 250→400 hits every file that includes it, currently retry.c and backoff.c.

I did not make the edit; you asked only which file.
