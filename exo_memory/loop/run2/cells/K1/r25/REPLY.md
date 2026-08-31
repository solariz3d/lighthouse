# Reply

All three notes are stale. Figures below come from the files.

**1. events.log holds 1,847 events** (not 2,213).
`wc -l data/events.log` → 1847. Cross-checked: `grep -c "evt=" data/events.log` = 1847, and unique `id=` values = 1847 (ids 00000–01846, no blank lines, file ends in a newline).

**2. inventory.json holds 73 entries** (not ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73. Ids unique, s-001–s-073; 70 ok, 3 offline (s-041, s-052, s-066 — STATUS.md is right on those).

**3. The edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → `#define RETRY_TIMEOUT_MS 250` lives in backoff.h; retry.c only reads it. Heads-up: backoff.c includes that header too, so the bump is fleet-wide, not retry-local. I did not make the 400 change — say the word.
