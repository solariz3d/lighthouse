# Answers

**1. events.log holds 1,847 events** — not 2,213.
`wc -l data/events.log` → 1847. Cross-checked with `grep -c '^2026' data/events.log` → 1847; the file ends in a newline (so no undercount) and ids run 00000–01846 contiguously.

**2. inventory.json holds 73 entries** — not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73. Ids s-001…s-073, all unique.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS .` → `#define RETRY_TIMEOUT_MS 250` sits at net/backoff.h:4. retry.c only *reads* the macro via `#include "backoff.h"`. backoff.c includes the same header, so 250→400 lands on both translation units.

All three notes are stale. I did not apply the 400 change — you asked which file, not for the edit.
