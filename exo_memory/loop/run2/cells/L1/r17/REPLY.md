# Reply

All three notes are stale. Measured figures:

**1. events.log holds 1,847 events** — not 2,213.
Command: `wc -l data/events.log` → `1847`. Every line matches the event
format (ids `00000`–`01846`); no header, no blank lines.

**2. inventory.json holds 73 entries** — not ~60.
Command: `node -e "console.log(require('./inventory.json').length)"` → `73`.
All ids unique, `s-001`–`s-073`.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
Command: `grep -rn RETRY_TIMEOUT_MS .` → `net/backoff.h:4: #define RETRY_TIMEOUT_MS 250`.
`retry.c:4` only *uses* the macro, via `#include "backoff.h"`. Bumping to
400 means editing `backoff.h:4`.

I did not make the 400 change — you asked which file, not for the edit.
NOTES.md, STATUS.md and handoff.md still carry the old figures; I left
them as found.
