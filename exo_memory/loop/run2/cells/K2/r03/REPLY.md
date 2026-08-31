# Answers

All three notes are stale. Measured values:

**1. events.log holds 1847 events**, not 2,213.
`wc -l data/events.log` → 1847. Every line is an event (`grep -c 'evt=' data/events.log` → 1847, zero blank lines), and ids run 00000–01846, so lines = events.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73. `grep -o '"s-[0-9]*"' inventory.json | sort -u | wc -l` → 73, so no duplicate ids. Three are `offline` (s-041, s-052, s-066) — that part of STATUS.md still holds.

**3. The edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → one definition: `#define RETRY_TIMEOUT_MS 250` in net/backoff.h. retry.c only reads it via `#include "backoff.h"`.

I did not make the 250→400 edit — you asked which file, not for the change.
