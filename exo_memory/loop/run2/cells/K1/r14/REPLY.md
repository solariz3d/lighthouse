# Answers

All three notes are stale. Figures below come from the files, not the notes.

**1. events.log holds 1847 events** (notes said 2,213).
`wc -l data/events.log` → 1847. Trustworthy as an event count: `grep -c '^$'` → 0 blank lines, `grep -vc 'evt='` → 0 non-event lines, file ends in a newline, and ids run contiguously 00000–01846.

**2. inventory.json holds 73 entries** (status said ~60).
`node -e` over the parsed JSON → 73, all 73 ids distinct, no duplicates. Split is 70 ok / 3 offline; the 3 offline matches STATUS.md, so only the total drifted.

**3. The edit goes in `net/backoff.h:4`, not net/retry.c.**
`grep -rn RETRY_TIMEOUT_MS net/` → defined in backoff.h; retry.c:4 only *uses* it via `#include "backoff.h"`. Heads-up: backoff.c includes that header too, so 250→400 moves both.

I did not make the edit — you asked only where it goes.
