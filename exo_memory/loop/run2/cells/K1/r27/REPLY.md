# Reply

All three notes are wrong. Figures below are from the files, not the notes.

**1. events.log holds 1847 events**, not 2,213.
`wc -l data/events.log` → 1847. Lines = events: `grep -c '^$'` → 0 blanks, no header, ids run 00000–01846 contiguously.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73, all ids unique (s-001–s-073). It's the right file: 70 ok / 3 offline, and the offline ids are exactly s-041, s-052, s-066 as STATUS.md says. Only the count is stale.

**3. The edit goes in `net/backoff.h:4`**, not retry.c.
`grep -rn RETRY_TIMEOUT_MS net/` → defined at backoff.h:4 (`#define RETRY_TIMEOUT_MS 250`); retry.c:4 only reads it via `#include "backoff.h"`. Editing retry.c would change nothing.

I did not apply the 400 bump — you asked which file, not for the change.
