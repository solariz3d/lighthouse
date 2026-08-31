# Reply

All three notes are stale. Figures below are from the files, not the notes.

**1. events.log holds 1,847 events** — not 2,213.
`wc -l data/events.log` → 1847. Cross-check `grep -c "evt=" data/events.log` → also 1847; no header, no blank lines, file ends in a newline. IDs run 00000–01846.

**2. inventory.json holds 73 entries** — not ~60.
`node -e "...JSON.parse(...).length"` → 73, all ids unique, s-001 through s-073.

**3. The 250→400 edit goes in `net/backoff.h`, line 4** — not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → `#define RETRY_TIMEOUT_MS 250` lives in net/backoff.h; retry.c only consumes it (line 4) via `#include "backoff.h"`.

One caveat: backoff.h is a shared header, so the bump reaches every file that includes it, not just retry.c. I did not make the edit — flagging only.
